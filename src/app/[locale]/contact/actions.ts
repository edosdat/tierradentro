'use server'

import {headers} from 'next/headers'
import {z} from 'zod'
import {reglages} from '@/sanity/lib/requetes'

export type EtatFormulaire = {
  etat: 'initial' | 'succes' | 'erreurChamps' | 'erreurEnvoi' | 'indisponible' | 'trop'
  champs?: Partial<Record<'nom' | 'email' | 'objet' | 'message', true>>
}

const schema = z.object({
  nom: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  structure: z.string().trim().max(160).optional().default(''),
  objet: z.enum(['programmation', 'presse', 'proposition', 'autre']),
  message: z.string().trim().min(10).max(5000),
})

// Limite simple : 5 messages par heure et par adresse IP (au mieux, par instance du serveur).
const envois = new Map<string, number[]>()
function tropDEnvois(ip: string) {
  const maintenant = Date.now()
  const recents = (envois.get(ip) ?? []).filter((t) => maintenant - t < 3_600_000)
  recents.push(maintenant)
  envois.set(ip, recents)
  return recents.length > 5
}

async function verifierTurnstile(jeton: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // protection pas encore configurée
  const reponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({secret, response: jeton, remoteip: ip}),
  })
  const resultat = (await reponse.json()) as {success?: boolean}
  return resultat.success === true
}

const echapper = (texte: string) => texte.replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]!)

export async function envoyerMessage(_precedent: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  // Champ piège invisible : un robot le remplit, un humain non.
  if (donnees.get('site')) return {etat: 'succes'}

  const lecture = schema.safeParse(Object.fromEntries(donnees))
  if (!lecture.success) {
    const champs: EtatFormulaire['champs'] = {}
    for (const probleme of lecture.error.issues) {
      const champ = probleme.path[0]
      if (champ === 'nom' || champ === 'email' || champ === 'objet' || champ === 'message') champs[champ] = true
    }
    return {etat: 'erreurChamps', champs}
  }

  const entetes = await headers()
  const ip = entetes.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue'
  if (tropDEnvois(ip)) return {etat: 'trop'}
  if (!(await verifierTurnstile(String(donnees.get('cf-turnstile-response') ?? ''), ip))) return {etat: 'erreurEnvoi'}

  const destinataire = (await reglages())?.emailContact
  const cle = process.env.RESEND_API_KEY
  const expediteur = process.env.RESEND_FROM
  if (!destinataire || !cle || !expediteur) return {etat: 'indisponible'}

  const m = lecture.data
  // Le message n'est stocké nulle part : il est seulement transmis par e-mail.
  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      from: expediteur,
      to: [destinataire],
      reply_to: m.email,
      subject: `[Site] ${m.objet} · ${m.nom}${m.structure ? ` (${m.structure})` : ''}`,
      text: `De : ${m.nom} <${m.email}>\nStructure : ${m.structure || '—'}\nObjet : ${m.objet}\n\n${m.message}`,
      html: `<p><strong>De :</strong> ${echapper(m.nom)} &lt;${echapper(m.email)}&gt;<br><strong>Structure :</strong> ${echapper(m.structure || '—')}<br><strong>Objet :</strong> ${m.objet}</p><p style="white-space:pre-line">${echapper(m.message)}</p>`,
    }),
  })
  return reponse.ok ? {etat: 'succes'} : {etat: 'erreurEnvoi'}
}
