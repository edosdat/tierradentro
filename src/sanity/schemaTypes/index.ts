import {album, contact, fichierPro, imageCreditee, lienExterne, videoYoutube} from './objets/medias'
import {texteCourtTraduit, texteLongTraduit, texteRicheTraduit} from './objets/traductions'
import {concert} from './documents/concert'
import {projet} from './documents/projet'
import {actualite, association, page, partenaire, personne, presse, reglages} from './documents/autres'

export const schemaTypes = [
  // objets
  texteCourtTraduit,
  texteLongTraduit,
  texteRicheTraduit,
  imageCreditee,
  videoYoutube,
  fichierPro,
  contact,
  lienExterne,
  album,
  // documents
  concert,
  projet,
  personne,
  presse,
  actualite,
  partenaire,
  page,
  association,
  reglages,
]

// Documents uniques : un seul exemplaire, ni création ni suppression depuis le Studio.
export const documentsUniques = ['association', 'reglages'] as const
