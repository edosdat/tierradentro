/**
 * Envoie data/seed.ndjson dans le projet Sanity (createOrReplace : relançable sans doublons).
 *
 *   SANITY_API_WRITE_TOKEN=… npm run seed:importer
 *
 * Le jeton (Sanity → API → Tokens, permission « Editor ») n'est jamais enregistré dans le dépôt.
 */
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cnmla0ea'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Variable SANITY_API_WRITE_TOKEN manquante (jeton Sanity avec la permission « Editor »).')
  process.exit(1)
}

const client = createClient({projectId, dataset, token, apiVersion: '2026-11-01', useCdn: false})
const docs = readFileSync(resolve(import.meta.dirname, '../data/seed.ndjson'), 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((ligne) => JSON.parse(ligne))

const TAILLE_LOT = 50
for (let i = 0; i < docs.length; i += TAILLE_LOT) {
  const lot = docs.slice(i, i + TAILLE_LOT)
  const transaction = client.transaction()
  for (const doc of lot) transaction.createOrReplace(doc)
  await transaction.commit({visibility: 'async'})
  console.log(`  ${Math.min(i + TAILLE_LOT, docs.length)} / ${docs.length}`)
}
console.log(`Import terminé dans ${projectId}/${dataset}.`)
