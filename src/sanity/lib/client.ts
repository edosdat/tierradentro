import 'server-only'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

// Client en lecture seule sur le contenu publié. Aucun jeton : rien de secret ne part vers le navigateur.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
