import 'server-only'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

// Client en lecture seule sur le contenu publié. Aucun jeton : rien de secret ne part vers le navigateur.
// useCdn: false : après une publication, le site relit la source à jour. Le cache rapide de Sanity peut avoir
// quelques secondes de retard et ferait garder l'ancien contenu. Le site met de toute façon les réponses en cache.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})
