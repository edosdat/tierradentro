import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {tr} from '@/lib/traduction'
import type {ProjetCourt} from '@/sanity/lib/requetes'

// Couleur de chaque projet (choisie dans le Studio). Contrastes texte/fond vérifiés (AA).
export const couleurs: Record<string, {fond: string; texte: string; sombre: boolean}> = {
  jacaranda: {fond: 'bg-jacaranda', texte: 'text-nuit', sombre: false},
  nuit: {fond: 'bg-nuit', texte: 'text-sable', sombre: true},
  turquoise: {fond: 'bg-turquoise', texte: 'text-nuit', sombre: false},
  ciel: {fond: 'bg-ciel-encre', texte: 'text-white', sombre: true},
  sable: {fond: 'bg-sable-2', texte: 'text-nuit', sombre: false},
  'rouge-tafi': {fond: 'bg-[#B8301F]', texte: 'text-white', sombre: true},
}
export const couleurProjet = (c?: string) => couleurs[c ?? ''] ?? couleurs.jacaranda

export async function Statut({statut, className = ''}: {statut: ProjetCourt['statut']; className?: string}) {
  const t = await getTranslations('statut')
  return <span className={`inline-block border-[1.5px] border-current px-2 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${className}`}>{t(statut)}</span>
}

// Carte en aplat de couleur (accueil, liste des projets).
export async function CarteProjet({p, grande = true, niveau = 3}: {p: ProjetCourt; grande?: boolean; niveau?: 2 | 3}) {
  const Titre = niveau === 2 ? 'h2' : 'h3'
  const locale = await getLocale()
  const c = couleurProjet(p.couleur)
  const enAttente = p.statut === 'a-venir'
  return (
    <Link
      href={`/projets/${p.slug}`}
      className={`${c.fond} ${c.texte} ${c.sombre ? 'sur-nuit' : ''} group relative flex flex-col justify-between overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-9 ${grande ? 'min-h-[340px]' : 'min-h-[260px]'}`}
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <Statut statut={p.statut} className="whitespace-nowrap" />
        <span className="text-right text-sm">{tr(p.sousTitre, locale) ?? p.duree}</span>
      </div>
      <div className="relative z-10">
        <Titre className={`titre-display max-w-[13ch] text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.95] [text-wrap:balance] ${enAttente ? 'italic' : ''}`}>{p.titre}</Titre>
        {p.accroche ? <p className="mt-4 max-w-xl text-[15px] leading-relaxed">{tr(p.accroche, locale)}</p> : null}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/colibri.svg"
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -bottom-10 h-52 w-auto opacity-[0.13] transition-transform duration-1000 group-hover:-translate-x-3 group-hover:-translate-y-2 group-hover:-rotate-3 ${c.sombre ? 'invert' : ''}`}
      />
    </Link>
  )
}
