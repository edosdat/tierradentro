import {defineArrayMember, defineField, defineType} from 'sanity'
import {francaisObligatoire} from '../objets/traductions'

const slug = (source: string) =>
  defineField({
    name: 'slug',
    title: 'Adresse de la page',
    description: 'Cliquez sur « Générer » : l\'adresse est créée à partir du titre.',
    type: 'slug',
    options: {source, maxLength: 80},
    validation: (rule) => rule.required(),
  })

// Musicien, danseuse, technicien… Une personne peut jouer dans plusieurs projets.
export const personne = defineType({
  name: 'personne',
  title: 'Personne',
  type: 'document',
  fields: [
    defineField({name: 'nom', title: 'Nom', type: 'string', validation: (rule) => rule.required()}),
    slug('nom'),
    defineField({name: 'instruments', title: 'Instruments ou rôle', description: 'Exemple : « bouzouki, chœurs ».', type: 'texteCourtTraduit', validation: francaisObligatoire}),
    defineField({name: 'photo', title: 'Photo', type: 'imageCreditee'}),
    defineField({name: 'bio', title: 'Biographie', description: 'Affichée sur la page de l\'artiste, ouverte depuis la distribution des projets.', type: 'texteLongTraduit'}),
  ],
  orderings: [{title: 'Nom', name: 'nom', by: [{field: 'nom', direction: 'asc'}]}],
  preview: {select: {title: 'nom', subtitle: 'instruments.fr', media: 'photo'}},
})

export const presse = defineType({
  name: 'presse',
  title: 'Article de presse',
  type: 'document',
  fields: [
    defineField({name: 'titre', title: 'Titre de l\'article', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'media', title: 'Média', description: 'Exemple : « Songazine ».', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'date', title: 'Date de parution', type: 'date', options: {dateFormat: 'DD/MM/YYYY'}, validation: (rule) => rule.required()}),
    defineField({name: 'extrait', title: 'Extrait court', description: 'Une ou deux phrases citées telles quelles.', type: 'texteLongTraduit'}),
    defineField({name: 'lien', title: 'Lien vers l\'article', type: 'url', validation: (rule) => rule.uri({scheme: ['https']})}),
    defineField({name: 'projets', title: 'Projets concernés', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'projet'}]})]}),
    defineField({name: 'noteInterne', title: 'Note interne', description: 'Jamais affichée sur le site.', type: 'text', rows: 2}),
  ],
  orderings: [{title: 'Date (plus récente d\'abord)', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'titre', media: 'media', date: 'date'},
    prepare: ({title, media, date}) => ({title, subtitle: [media, date && new Date(date).toLocaleDateString('fr-FR')].filter(Boolean).join(' · ')}),
  },
})

export const actualite = defineType({
  name: 'actualite',
  title: 'Actualité',
  type: 'document',
  fields: [
    defineField({name: 'titre', title: 'Titre', type: 'texteCourtTraduit', validation: francaisObligatoire}),
    slug('titre.fr'),
    defineField({name: 'date', title: 'Date', type: 'date', options: {dateFormat: 'DD/MM/YYYY'}, initialValue: () => new Date().toISOString().slice(0, 10), validation: (rule) => rule.required()}),
    defineField({name: 'image', title: 'Photo', type: 'imageCreditee'}),
    defineField({name: 'resume', title: 'Résumé', type: 'texteLongTraduit', validation: francaisObligatoire}),
    defineField({name: 'contenu', title: 'Texte', type: 'texteRicheTraduit'}),
    defineField({name: 'projets', title: 'Projets concernés', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'projet'}]})]}),
  ],
  orderings: [{title: 'Date (plus récente d\'abord)', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'titre.fr', date: 'date', media: 'image'},
    prepare: ({title, date, media}) => ({title, subtitle: date && new Date(date).toLocaleDateString('fr-FR'), media}),
  },
})

export const partenaire = defineType({
  name: 'partenaire',
  title: 'Partenaire',
  type: 'document',
  fields: [
    defineField({name: 'nom', title: 'Nom', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      fields: [defineField({name: 'alt', title: 'Texte alternatif', description: 'En général le nom du partenaire.', type: 'string', validation: (rule) => rule.required()})],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'lien', title: 'Site du partenaire', type: 'url', validation: (rule) => rule.uri({scheme: ['https']})}),
    defineField({name: 'ordre', title: 'Ordre d\'affichage', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Ordre d\'affichage', name: 'ordre', by: [{field: 'ordre', direction: 'asc'}]}],
  preview: {select: {title: 'nom', media: 'logo'}},
})

// Pages simples : mentions légales, politique de confidentialité, crédits.
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'titre', title: 'Titre', type: 'texteCourtTraduit', validation: francaisObligatoire}),
    slug('titre.fr'),
    defineField({name: 'contenu', title: 'Texte', type: 'texteRicheTraduit', validation: francaisObligatoire}),
  ],
  preview: {select: {title: 'titre.fr', subtitle: 'slug.current'}},
})

// Document unique : la page « L'association », celle qui rassure les institutionnels.
export const association = defineType({
  name: 'association',
  title: 'L\'association',
  type: 'document',
  groups: [
    {name: 'projet', title: 'Projet associatif', default: true},
    {name: 'equipe', title: 'Équipe'},
    {name: 'identite', title: 'Identité légale'},
    {name: 'rapports', title: 'Rapports d\'activité'},
  ],
  fields: [
    defineField({name: 'mission', title: 'Mission et projet artistique', type: 'texteRicheTraduit', group: 'projet', validation: francaisObligatoire}),
    defineField({
      name: 'valeurs',
      title: 'Valeurs',
      type: 'array',
      group: 'projet',
      of: [
        defineArrayMember({
          name: 'valeur',
          type: 'object',
          fields: [
            defineField({name: 'titre', title: 'Titre', type: 'texteCourtTraduit', validation: francaisObligatoire}),
            defineField({name: 'texte', title: 'Texte', type: 'texteLongTraduit'}),
          ],
          preview: {select: {title: 'titre.fr', subtitle: 'texte.fr'}},
        }),
      ],
    }),
    defineField({
      name: 'bureau',
      title: 'Bureau et équipe',
      type: 'array',
      group: 'equipe',
      of: [
        defineArrayMember({
          name: 'membreBureau',
          type: 'object',
          fields: [
            defineField({name: 'nom', title: 'Nom', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'role', title: 'Rôle', description: 'Exemple : « Président », « Trésorière », « Chargé de production ».', type: 'texteCourtTraduit', validation: francaisObligatoire}),
          ],
          preview: {select: {title: 'nom', subtitle: 'role.fr'}},
        }),
      ],
    }),
    defineField({name: 'nomLegal', title: 'Nom légal', type: 'string', group: 'identite', initialValue: 'Tierradentro'}),
    defineField({name: 'forme', title: 'Forme juridique', type: 'string', group: 'identite', initialValue: 'Association loi 1901'}),
    defineField({name: 'siret', title: 'SIRET', type: 'string', group: 'identite', validation: (rule) => rule.regex(/^\d{3} ?\d{3} ?\d{3} ?\d{5}$/).error('Un SIRET compte 14 chiffres.')}),
    defineField({name: 'licence', title: 'Licence(s) d\'entrepreneur de spectacles', description: 'Exemple : « PLATESV-R-2024-000000 ».', type: 'string', group: 'identite'}),
    defineField({name: 'tva', title: 'Statut TVA', description: 'Exemple : « TVA non applicable, article 293 B du CGI ».', type: 'string', group: 'identite'}),
    defineField({name: 'siege', title: 'Adresse du siège', type: 'text', rows: 3, group: 'identite'}),
    defineField({name: 'rapports', title: 'Rapports d\'activité', type: 'array', of: [{type: 'fichierPro'}], group: 'rapports'}),
  ],
  preview: {prepare: () => ({title: 'L\'association'})},
})

// Document unique : réglages communs à tout le site.
export const reglages = defineType({
  name: 'reglages',
  title: 'Réglages du site',
  type: 'document',
  fields: [
    defineField({name: 'accroche', title: 'Accroche de la page d\'accueil', type: 'texteLongTraduit'}),
    defineField({
      name: 'presentation',
      title: 'Texte de présentation (accueil)',
      description: 'La grande phrase sous « L\'association », juste après la vidéo. Laisser vide pour garder le texte d\'origine.',
      type: 'texteLongTraduit',
    }),
    defineField({name: 'contacts', title: 'Contacts affichés', description: 'Production, diffusion, direction artistique…', type: 'array', of: [{type: 'contact'}]}),
    defineField({name: 'emailContact', title: 'Adresse qui reçoit le formulaire de contact', type: 'email'}),
    defineField({name: 'reseaux', title: 'Réseaux sociaux', type: 'array', of: [{type: 'lienExterne'}]}),
    defineField({name: 'videoUne', title: 'Vidéo à la une (page d\'accueil)', type: 'videoYoutube'}),
    defineField({
      name: 'videoFond',
      title: 'Vidéo de fond de l\'accueil',
      description:
        'Courte vidéo sans son qui tourne en boucle derrière le titre (10 à 30 secondes, format MP4, moins de 10 Mo). Laisser vide pour garder le ciel de nuit.',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      fields: [
        defineField({
          name: 'cadrage',
          title: 'Cadrage vertical sur téléphone',
          description: 'Sur un téléphone, la vidéo est recadrée. 50 = centre, 20 = plutôt le haut, 80 = plutôt le bas.',
          type: 'number',
          initialValue: 50,
          validation: (rule) => rule.min(0).max(100),
        }),
      ],
    }),
    defineField({name: 'creditIllustration', title: 'Crédit de l\'illustration du colibri', type: 'string', initialValue: 'Ludo Deny'}),
  ],
  preview: {prepare: () => ({title: 'Réglages du site'})},
})
