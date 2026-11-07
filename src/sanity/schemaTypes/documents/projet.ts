import {defineArrayMember, defineField, defineType} from 'sanity'
import {francaisObligatoire} from '../objets/traductions'

export const statutsProjet = [
  {title: 'En tournée', value: 'en-tournee'},
  {title: 'Création', value: 'creation'},
  {title: 'À venir', value: 'a-venir'},
  {title: 'Archivé', value: 'archive'},
]

export const couleursProjet = [
  {title: 'Jacaranda (violet)', value: 'jacaranda'},
  {title: 'Ciel (bleu)', value: 'ciel'},
  {title: 'Turquoise', value: 'turquoise'},
  {title: 'Nuit (bleu sombre)', value: 'nuit'},
  {title: 'Sable', value: 'sable'},
  {title: 'Rouge Tafi', value: 'rouge-tafi'},
]

// Un projet présenté par Tierradentro : un groupe en concert, une création, une collaboration…
// Tous les projets sont au même niveau (pas de rubrique « artistes » séparée).
export const projet = defineType({
  name: 'projet',
  title: 'Projet',
  type: 'document',
  groups: [
    {name: 'presentation', title: 'Présentation', default: true},
    {name: 'distribution', title: 'Distribution'},
    {name: 'medias', title: 'Photos et vidéos'},
    {name: 'disco', title: 'Discographie'},
    {name: 'pro', title: 'Espace pro'},
  ],
  fields: [
    defineField({name: 'titre', title: 'Nom du projet', type: 'string', group: 'presentation', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Cliquez sur « Générer » : l\'adresse est créée à partir du nom.',
      type: 'slug',
      group: 'presentation',
      options: {source: 'titre', maxLength: 80},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statut',
      title: 'Statut',
      type: 'string',
      group: 'presentation',
      options: {list: statutsProjet, layout: 'radio', direction: 'horizontal'},
      initialValue: 'en-tournee',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sousTitre',
      title: 'Sous-titre',
      description: 'Exemple : « Quartet franco-argentin de world music ».',
      type: 'texteCourtTraduit',
      group: 'presentation',
    }),
    defineField({name: 'accroche', title: 'Accroche', description: 'Deux ou trois phrases, affichées sur les cartes et en haut de la page.', type: 'texteLongTraduit', group: 'presentation', validation: francaisObligatoire}),
    defineField({name: 'presentation', title: 'Présentation complète', type: 'texteRicheTraduit', group: 'presentation'}),
    defineField({name: 'duree', title: 'Durée', description: 'Exemple : « 1 h 15 ».', type: 'string', group: 'presentation'}),
    defineField({name: 'public', title: 'Public', description: 'Exemple : « Tout public ».', type: 'texteCourtTraduit', group: 'presentation'}),
    defineField({name: 'jauge', title: 'Jauge', description: 'Exemple : « Salles de 100 à 800 places, plein air ».', type: 'texteCourtTraduit', group: 'presentation'}),
    defineField({
      name: 'couleur',
      title: 'Couleur du projet',
      description: 'Couleur d\'accent utilisée sur la carte et la page du projet.',
      type: 'string',
      group: 'presentation',
      options: {list: couleursProjet},
      initialValue: 'jacaranda',
    }),
    defineField({name: 'ordre', title: 'Ordre d\'affichage', description: 'Les plus petits nombres apparaissent en premier.', type: 'number', group: 'presentation', initialValue: 10}),

    defineField({
      name: 'distribution',
      title: 'Distribution',
      type: 'array',
      group: 'distribution',
      of: [
        defineArrayMember({
          name: 'membre',
          type: 'object',
          fields: [
            defineField({name: 'personne', title: 'Personne', type: 'reference', to: [{type: 'personne'}], validation: (rule) => rule.required()}),
            defineField({name: 'role', title: 'Rôle dans ce projet', description: 'Laisser vide pour reprendre les instruments de la fiche personne.', type: 'texteCourtTraduit'}),
          ],
          preview: {
            select: {title: 'personne.nom', role: 'role.fr', instruments: 'personne.instruments.fr', media: 'personne.photo'},
            prepare: ({title, role, instruments, media}) => ({title, subtitle: role || instruments, media}),
          },
        }),
      ],
    }),
    defineField({name: 'contactDiffusion', title: 'Contact diffusion', description: 'Personne ou agence à contacter pour programmer ce projet.', type: 'contact', group: 'distribution'}),

    defineField({name: 'imagePrincipale', title: 'Photo principale', type: 'imageCreditee', group: 'medias'}),
    defineField({name: 'galerie', title: 'Galerie (photos HD libres de droits)', type: 'array', of: [{type: 'imageCreditee'}], group: 'medias', options: {layout: 'grid'}}),
    defineField({name: 'videos', title: 'Vidéos', type: 'array', of: [{type: 'videoYoutube'}], group: 'medias'}),

    defineField({name: 'discographie', title: 'Discographie', type: 'array', of: [{type: 'album'}], group: 'disco'}),

    defineField({name: 'documentsPro', title: 'Documents à télécharger', type: 'array', of: [{type: 'fichierPro'}], group: 'pro'}),
    defineField({name: 'texteCourt', title: 'Texte court à copier', description: 'Pour les programmes de salle et les plaquettes (environ 400 signes).', type: 'texteLongTraduit', group: 'pro'}),
    defineField({name: 'texteLong', title: 'Texte long à copier', description: 'Environ 1 500 signes.', type: 'texteLongTraduit', group: 'pro'}),
  ],
  orderings: [
    {title: 'Ordre d\'affichage', name: 'ordre', by: [{field: 'ordre', direction: 'asc'}, {field: 'titre', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'titre', statut: 'statut', media: 'imagePrincipale'},
    prepare: ({title, statut, media}) => ({title, subtitle: statutsProjet.find((s) => s.value === statut)?.title, media}),
  },
})
