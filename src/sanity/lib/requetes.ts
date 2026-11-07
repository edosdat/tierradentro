import 'server-only'
import {defineQuery} from 'next-sanity'
import {cacheLife, cacheTag} from 'next/cache'
import {aujourdhuiIso, type Traduit} from '@/lib/traduction'
import {client} from './client'

// Toutes les lectures passent par ici : contenu publié seulement, mis en cache côté serveur.
// La publication dans le Studio déclenche le webhook /api/revalidation, qui vide le cache « sanity ».
// À défaut, le cache se renouvelle toutes les heures (ce qui fait aussi basculer les dates passées en archives).
// `avecDate` ajoute le paramètre $aujourdhui, calculé à l'intérieur du cache (exigence de Next 16).
async function chercher<T>(requete: string, params: Record<string, unknown> = {}, avecDate = false): Promise<T> {
  'use cache'
  cacheLife('hours')
  cacheTag('sanity')
  return client.fetch<T>(requete, avecDate ? {...params, aujourdhui: aujourdhuiIso()} : params)
}

// ---------- types ----------
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ImageSanity = {asset?: {_ref: string}; hotspot?: any; crop?: any; alt?: Traduit; credit?: string} | null
export type Bloc = any[]
/* eslint-enable @typescript-eslint/no-explicit-any */

export type ProjetCourt = {
  _id: string
  titre: string
  slug: string
  statut: 'en-tournee' | 'creation' | 'a-venir' | 'archive'
  couleur?: string
  sousTitre?: Traduit
  accroche?: Traduit
  duree?: string
  public?: Traduit
  imagePrincipale?: ImageSanity
}

export type Concert = {
  _id: string
  date: string
  heure?: string
  salle: string
  ville: string
  departement: string
  billetterie?: string
  statut: 'confirme' | 'complet' | 'annule'
  projet?: {titre: string; slug: string; couleur?: string}
}

export type Video = {_key: string; titre: string; url: string; legende?: Traduit}
export type Document = {_key: string; type: string; libelle?: Traduit; miseAJour?: string; url?: string; taille?: number}
export type Album = {_key: string; titre: string; dateSortie?: string; annee?: number; nombreTitres?: number; pochette?: ImageSanity; ecoute?: {_key: string; libelle: string; url: string}[]; paroles?: string}
export type Contact = {_key?: string; role?: Traduit; nom: string; structure?: string; telephone?: string; email?: string}
export type Article = {_id: string; titre: string; media: string; date: string; extrait?: Traduit; lien?: string; projets?: {titre: string; slug: string}[]}

export type ProjetComplet = ProjetCourt & {
  presentation?: Traduit<Bloc>
  jauge?: Traduit
  distribution?: {_key: string; role?: Traduit; personne: {nom: string; instruments?: Traduit; photo?: ImageSanity}}[]
  contactDiffusion?: Contact
  galerie?: (NonNullable<ImageSanity> & {_key: string})[]
  videos?: Video[]
  discographie?: Album[]
  documentsPro?: Document[]
  texteCourt?: Traduit
  texteLong?: Traduit
  dates: Concert[]
  presse: Article[]
}

// ---------- fragments ----------
const PROJET_COURT = `_id, titre, "slug": slug.current, statut, couleur, sousTitre, accroche, duree, public, imagePrincipale`
const CONCERT = `_id, date, heure, salle, ville, departement, billetterie, statut, "projet": projet->{titre, "slug": slug.current, couleur}`
const DOCUMENTS = `documentsPro[]{_key, type, libelle, miseAJour, "url": fichier.asset->url, "taille": fichier.asset->size}`

// ---------- projets ----------
const PROJETS = defineQuery(`*[_type == "projet" && defined(slug.current)] | order(ordre asc, titre asc) { ${PROJET_COURT} }`)
export const projets = () => chercher<ProjetCourt[]>(PROJETS)

const SLUGS_PROJETS = defineQuery(`*[_type == "projet" && defined(slug.current)].slug.current`)
export const slugsProjets = () => chercher<string[]>(SLUGS_PROJETS)

const PROJET = defineQuery(`*[_type == "projet" && slug.current == $slug][0] {
  ${PROJET_COURT}, presentation, jauge, contactDiffusion, galerie, videos, texteCourt, texteLong,
  distribution[]{_key, role, personne->{nom, instruments, photo}},
  discographie[]{_key, titre, dateSortie, annee, nombreTitres, pochette, ecoute, "paroles": paroles.asset->url},
  ${DOCUMENTS},
  "dates": *[_type == "concert" && references(^._id) && date >= $aujourdhui] | order(date asc) { ${CONCERT} },
  "presse": *[_type == "presse" && references(^._id)] | order(date desc) { _id, titre, media, date, extrait, lien }
}`)
export const projet = (slug: string) => chercher<ProjetComplet | null>(PROJET, {slug}, true)

// ---------- agenda ----------
const A_VENIR = defineQuery(`*[_type == "concert" && date >= $aujourdhui] | order(date asc, heure asc) { ${CONCERT} }`)
export const concertsAVenir = () => chercher<Concert[]>(A_VENIR, {}, true)

const PASSES = defineQuery(`*[_type == "concert" && date < $aujourdhui] | order(date desc) { ${CONCERT} }`)
export const concertsPasses = () => chercher<Concert[]>(PASSES, {}, true)

// ---------- presse, actualités ----------
const PRESSE = defineQuery(`*[_type == "presse"] | order(date desc) { _id, titre, media, date, extrait, lien, "projets": projets[]->{titre, "slug": slug.current} }`)
export const presse = () => chercher<Article[]>(PRESSE)

export type Actualite = {_id: string; titre: Traduit; slug: string; date: string; image?: ImageSanity; resume?: Traduit; contenu?: Traduit<Bloc>}
const ACTUALITES = defineQuery(`*[_type == "actualite" && defined(slug.current)] | order(date desc) { _id, titre, "slug": slug.current, date, image, resume }`)
export const actualites = () => chercher<Actualite[]>(ACTUALITES)
const ACTUALITE = defineQuery(`*[_type == "actualite" && slug.current == $slug][0] { _id, titre, "slug": slug.current, date, image, resume, contenu }`)
export const actualite = (slug: string) => chercher<Actualite | null>(ACTUALITE, {slug})
const SLUGS_ACTUALITES = defineQuery(`*[_type == "actualite" && defined(slug.current)].slug.current`)
export const slugsActualites = () => chercher<string[]>(SLUGS_ACTUALITES)

// ---------- espace pro ----------
export type ProjetPro = ProjetCourt & {documentsPro?: Document[]; galerie?: (NonNullable<ImageSanity> & {_key: string})[]; texteCourt?: Traduit; texteLong?: Traduit; contactDiffusion?: Contact}
const PRO = defineQuery(`*[_type == "projet" && defined(slug.current) && statut != "archive"] | order(ordre asc) { ${PROJET_COURT}, ${DOCUMENTS}, galerie, texteCourt, texteLong, contactDiffusion }`)
export const projetsPro = () => chercher<ProjetPro[]>(PRO)

// ---------- documents uniques, pages, partenaires ----------
export type Association = {
  mission?: Traduit<Bloc>
  valeurs?: {_key: string; titre: Traduit; texte?: Traduit}[]
  bureau?: {_key: string; nom: string; role: Traduit}[]
  nomLegal?: string
  forme?: string
  siret?: string
  licence?: string
  tva?: string
  siege?: string
  rapports?: Document[]
}
const ASSOCIATION = defineQuery(`*[_id == "association"][0] { mission, valeurs, bureau, nomLegal, forme, siret, licence, tva, siege,
  "rapports": rapports[]{_key, type, libelle, miseAJour, "url": fichier.asset->url, "taille": fichier.asset->size} }`)
export const association = () => chercher<Association | null>(ASSOCIATION)

export type Reglages = {accroche?: Traduit; contacts?: Contact[]; emailContact?: string; reseaux?: {_key: string; libelle: string; url: string}[]; videoUne?: Video; videoFond?: {url?: string; cadrage?: number}; creditIllustration?: string}
const REGLAGES = defineQuery(`*[_id == "reglages"][0] { accroche, contacts, emailContact, reseaux, videoUne, creditIllustration, "videoFond": videoFond{"url": asset->url, cadrage} }`)
export const reglages = () => chercher<Reglages | null>(REGLAGES)

export type Partenaire = {_id: string; nom: string; logo: NonNullable<ImageSanity> & {alt: string}; lien?: string}
const PARTENAIRES = defineQuery(`*[_type == "partenaire" && defined(logo.asset)] | order(ordre asc) { _id, nom, logo, lien }`)
export const partenaires = () => chercher<Partenaire[]>(PARTENAIRES)

export type Page = {titre: Traduit; slug: string; contenu?: Traduit<Bloc>}
const PAGE = defineQuery(`*[_type == "page" && slug.current == $slug][0] { titre, "slug": slug.current, contenu }`)
export const page = (slug: string) => chercher<Page | null>(PAGE, {slug})
const SLUGS_PAGES = defineQuery(`*[_type == "page" && defined(slug.current)].slug.current`)
export const slugsPages = () => chercher<string[]>(SLUGS_PAGES)

// ---------- chiffres d'activité (preuve d'activité pour les institutionnels) ----------
export async function chiffresActivite() {
  const passes = await concertsPasses()
  const lieux = new Set(passes.map((c) => c.departement))
  const pays = [...lieux].filter((l) => !/^\d{2,3}$|^2[AB]$/.test(l))
  return {
    dates: passes.length,
    depuis: passes.at(-1)?.date.slice(0, 4),
    departements: lieux.size - pays.length,
    pays,
  }
}
