/**
 * Prépare le contenu de départ du site pour Sanity.
 *
 *   npm run seed            → écrit data/seed.ndjson (aucune connexion nécessaire)
 *   npm run seed:importer   → importe ce fichier dans Sanity (après `npx sanity login`)
 *
 * Les identifiants sont stables : relancer l'import remplace les documents sans créer de doublons.
 *
 * Règles reprises du brief :
 *  - une date dont l'année est « déduite » reçoit la note interne « Année à vérifier » ;
 *  - une date sans jour (« 2025 », « 2024-02 ») est importée en brouillon, donc non publiée ;
 *  - une date sans spectacle renseigné est rattachée au projet Cuarteto Tafi ;
 *  - les articles de presse repris du site du Tafi sont importés en brouillons (média à compléter).
 */
import {readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {parse} from 'csv-parse/sync'

type Doc = {_id: string; _type: string; [cle: string]: unknown}
const docs: Doc[] = []
const racine = resolve(import.meta.dirname, '..')

// ---------- outils ----------
const slugifier = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
let compteur = 0
const cle = () => (++compteur).toString(36).padStart(6, '0')
const fr = (texte: string) => ({fr: texte})
const ref = (id: string) => ({_type: 'reference', _ref: id})
const refCle = (id: string) => ({...ref(id), _key: cle()})
const paragraphe = (texte: string) => ({
  _type: 'block',
  _key: cle(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: cle(), text: texte, marks: []}],
})

// ---------- personnes ----------
const personnes: Record<string, [string, string]> = {
  'personne-leonor-harispe': ['Leonor Harispe', 'chant, textes'],
  'personne-ludovic-deny': ['Ludovic Deny', 'bouzouki, chœurs'],
  'personne-matthieu-guenez': ['Matthieu Guenez', 'guitare, oud'],
  'personne-frederic-theiler': ['Frédéric Theiler', 'percussions, chœurs'],
  'personne-justine-marmouyet': ['Justine Marmouyet', 'danse'],
  'personne-fanny-do': ['Fanny Do', 'piano'],
  'personne-jean-luc-amestoy': ['Jean-Luc Amestoy', 'accordéon'],
}
for (const [_id, [nom, instruments]] of Object.entries(personnes)) {
  docs.push({_id, _type: 'personne', nom, instruments: fr(instruments)})
}
const tafi = ['personne-leonor-harispe', 'personne-ludovic-deny', 'personne-matthieu-guenez', 'personne-frederic-theiler']
const distribution = (ids: string[]) => ids.map((id) => ({_type: 'membre', _key: cle(), personne: ref(id)}))

// ---------- projets ----------
const video = (titre: string, id: string, legende?: string) => ({
  _type: 'videoYoutube',
  _key: cle(),
  titre,
  url: `https://youtu.be/${id}`,
  ...(legende ? {legende: fr(legende)} : {}),
})
const albumDoc = (titre: string, extra: Record<string, unknown> = {}) => ({_type: 'album', _key: cle(), titre, ...extra})

const projets: Doc[] = [
  {
    _id: 'projet-cuarteto-tafi',
    _type: 'projet',
    titre: 'Cuarteto Tafi',
    slug: {_type: 'slug', current: 'cuarteto-tafi'},
    statut: 'en-tournee',
    ordre: 1,
    couleur: 'jacaranda',
    sousTitre: fr('Quartet franco-argentin de world music'),
    accroche: fr(
      '[À VALIDER] Chant en espagnol, poétique et engagé, bouzouki grec, guitare flamenca et oud, percussions afro-latines. Le quartet tourne avec El infinito y un amor, son album sorti en janvier 2024.',
    ),
    distribution: distribution(tafi),
    videos: [
      video('Vuelven', 's0XoBr5n5S4', 'Clip officiel'),
      video('Manaos Amazonas', 'MMm7agDk4hI', 'Clip officiel 2023'),
      video('Presentes', '8Ums8_jdDpA', 'Clip officiel'),
      video('Somos de la tierra', 'W6dQNKx7AV4', 'Clip officiel'),
      video('Concert Rio Grande', 'NF6tvqsHZSY', 'Clip officiel 2023'),
      video('Teaser concert', 'UpiAuFa863A', '2023'),
    ],
    discographie: [
      albumDoc('El infinito y un amor', {dateSortie: '2024-01-19', nombreTitres: 11}),
      albumDoc('Amanecer', {dateSortie: '2021-03-19', nombreTitres: 10}),
      albumDoc('Semillas', {nombreTitres: 11}),
      // Titres lus dans le nom des pochettes sur cuartetotafi.com : à vérifier.
      albumDoc('Tierradentro', {nombreTitres: 12}),
      albumDoc('Primerita', {nombreTitres: 12}),
    ],
  },
  {
    _id: 'projet-des-espoirs-plein-le-corps',
    _type: 'projet',
    titre: 'Des espoirs plein le corps',
    slug: {_type: 'slug', current: 'des-espoirs-plein-le-corps'},
    statut: 'en-tournee',
    ordre: 2,
    couleur: 'nuit',
    accroche: fr('[À VALIDER] Le parcours d\'un corps de femme, de la naissance à l\'émancipation, entre musique et danse.'),
    duree: '1 h 15',
    public: fr('Tout public'),
    distribution: distribution([...tafi, 'personne-justine-marmouyet', 'personne-fanny-do']),
  },
  {
    _id: 'projet-la-voix-des-femmes-d-amerique-latine',
    _type: 'projet',
    titre: 'La voix des femmes d\'Amérique latine',
    slug: {_type: 'slug', current: 'la-voix-des-femmes-d-amerique-latine'},
    statut: 'en-tournee',
    ordre: 3,
    couleur: 'turquoise',
    sousTitre: fr('Création 2023'),
    accroche: fr('[À VALIDER] Un répertoire consacré aux voix de femmes d\'Amérique latine, avec Jean-Luc Amestoy à l\'accordéon.'),
    distribution: distribution([...tafi, 'personne-fanny-do', 'personne-jean-luc-amestoy']),
  },
  {
    _id: 'projet-la-noche-eterna',
    _type: 'projet',
    titre: 'La Noche Eterna',
    slug: {_type: 'slug', current: 'la-noche-eterna'},
    statut: 'a-venir',
    ordre: 4,
    couleur: 'sable',
    accroche: fr('Nouveau projet en préparation. Plus d\'informations prochainement.'),
  },
  {
    _id: 'projet-nosotras',
    _type: 'projet',
    titre: 'Nosotras : nuestros cantos – nuestros cuerpos',
    slug: {_type: 'slug', current: 'nosotras'},
    statut: 'creation',
    ordre: 5,
    couleur: 'ciel',
    accroche: fr('[À CONFIRMER] Création présentée au festival Rio Loco, à Toulouse, en 2025.'),
  },
]
docs.push(...projets)

const projetParSpectacle: Record<string, string> = {
  '': 'projet-cuarteto-tafi',
  'El infinito y un amor': 'projet-cuarteto-tafi',
  'Des espoirs plein le corps': 'projet-des-espoirs-plein-le-corps',
  'La voix des femmes d\'Amérique latine': 'projet-la-voix-des-femmes-d-amerique-latine',
}
const projetDeLaDate = (spectacle: string) => {
  if (spectacle.startsWith('Nosotras')) return 'projet-nosotras'
  const id = projetParSpectacle[spectacle.trim()]
  if (!id) throw new Error(`Spectacle inconnu dans le CSV : « ${spectacle} »`)
  return id
}

// ---------- dates de concert ----------
type Ligne = {
  date: string
  statut: string
  spectacle: string
  salle_ou_evenement: string
  ville: string
  departement: string
  annee_certaine: string
  note: string
}
const lignes: Ligne[] = parse(readFileSync(resolve(racine, 'data/dates-cuarteto-tafi.csv')), {
  columns: true,
  delimiter: ';',
  skip_empty_lines: true,
  trim: true,
})

const idsVus = new Set<string>()
let brouillons = 0
for (const l of lignes) {
  const complete = /^\d{4}-\d{2}-\d{2}$/.test(l.date)
  const notes: string[] = []
  if (l.annee_certaine !== 'oui') notes.push('Année à vérifier (déduite lors de l\'import).')
  if (!complete) notes.push(`Date d'origine dans l'historique : « ${l.date} » (jour inconnu). À compléter avant publication.`)
  if (l.note) notes.push(`Note de l'historique : ${l.note}.`)

  let id = `concert-${l.date}-${slugifier(l.ville)}`
  for (let n = 2; idsVus.has(id); n++) id = `concert-${l.date}-${slugifier(l.ville)}-${n}`
  idsVus.add(id)
  if (!complete) brouillons++

  docs.push({
    _id: complete ? id : `drafts.${id}`,
    _type: 'concert',
    ...(complete ? {date: l.date} : {}),
    projet: ref(projetDeLaDate(l.spectacle)),
    salle: l.salle_ou_evenement,
    ville: l.ville,
    departement: l.departement,
    statut: 'confirme',
    ...(notes.length ? {noteInterne: notes.join('\n')} : {}),
  })
}

// ---------- presse (brouillons à compléter) ----------
type ArticleTafi = {titre: string; dateMiseEnLigne: string; source: string}
const articles: ArticleTafi[] = JSON.parse(readFileSync(resolve(racine, 'data/presse-cuartetotafi.json'), 'utf8'))
for (const a of articles) {
  docs.push({
    _id: `drafts.presse-${slugifier(a.titre).slice(0, 60)}`,
    _type: 'presse',
    titre: a.titre.replace(/\s+/g, ' ').trim(),
    date: a.dateMiseEnLigne,
    lien: a.source,
    projets: [refCle('projet-cuarteto-tafi')],
    noteInterne:
      'Repris de la page presse de cuartetotafi.com. À compléter : nom du média, date de parution réelle (la date indiquée est celle de mise en ligne sur le site du Tafi), lien vers l\'article d\'origine si possible.',
  })
}

// ---------- documents uniques ----------
docs.push({
  _id: 'reglages',
  _type: 'reglages',
  creditIllustration: 'Ludo Deny',
  accroche: fr(
    '[À VALIDER] Une association qui accompagne des artistes de la création à la tournée, avec des spectacles prêts à partir et des dossiers techniques à jour.',
  ),
  videoUne: {_type: 'videoYoutube', titre: 'Vuelven', url: 'https://youtu.be/s0XoBr5n5S4', legende: fr('Cuarteto Tafi, clip officiel')},
})
docs.push({
  _id: 'association',
  _type: 'association',
  nomLegal: 'Tierradentro',
  forme: 'Association loi 1901',
  mission: {
    fr: [
      paragraphe(
        '[À VALIDER] Tierradentro est une association toulousaine de production de spectacles vivants. Elle accompagne des projets artistiques de la création à la tournée.',
      ),
    ],
  },
})

// ---------- écriture ----------
const sortie = resolve(racine, 'data/seed.ndjson')
writeFileSync(sortie, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')

const compte = (type: string) => docs.filter((d) => d._type === type).length
console.log(`Fichier écrit : data/seed.ndjson (${docs.length} documents)`)
console.log(`  ${compte('concert')} dates de concert, dont ${brouillons} en brouillon (jour inconnu)`)
console.log(`  ${compte('projet')} projets, ${compte('personne')} personnes, ${compte('presse')} articles de presse en brouillon`)
console.log('Pour importer : npm run seed:importer')
