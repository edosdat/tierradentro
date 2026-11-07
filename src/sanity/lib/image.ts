import {createImageUrlBuilder} from '@sanity/image-url'
import {dataset, projectId} from '../env'

const constructeur = createImageUrlBuilder({projectId, dataset})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlImage = (source: any) => constructeur.image(source).auto('format').fit('crop')
