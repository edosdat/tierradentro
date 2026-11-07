import 'server-only'
import {defineQuery} from 'next-sanity'
import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {sanityConfigured} from '../env'

export const PROCHAINES_DATES = defineQuery(`
  *[_type == "concert" && date >= $aujourdhui] | order(date asc, heure asc) [0...$limite] {
    _id, date, heure, salle, ville, departement, billetterie, statut,
    "projet": projet->{titre, "slug": slug.current, couleur}
  }
`)

export type ProchaineDate = {
  _id: string
  date: string
  heure?: string
  salle: string
  ville: string
  departement: string
  billetterie?: string
  statut: 'confirme' | 'complet' | 'annule'
  projet?: {titre: string; slug?: string; couleur?: string}
}

// Mis en cache une heure : une date passée bascule d'elle-même hors de la liste.
export async function prochainesDates(limite = 6): Promise<ProchaineDate[] | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('concert')
  if (!sanityConfigured) return null
  const aujourdhui = new Date().toISOString().slice(0, 10)
  return client.fetch(PROCHAINES_DATES, {aujourdhui, limite})
}
