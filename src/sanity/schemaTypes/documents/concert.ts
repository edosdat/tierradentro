import {defineField, defineType} from 'sanity'

export const statutsConcert = [
  {title: 'Confirmé', value: 'confirme'},
  {title: 'Complet', value: 'complet'},
  {title: 'Annulé', value: 'annule'},
]

const formatDate = (date?: string) =>
  date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', {weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'})
    : 'Date à saisir'

// Une date de concert. Elle passe toute seule dans les archives le lendemain.
export const concert = defineType({
  name: 'concert',
  title: 'Date de concert',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {dateFormat: 'dddd D MMMM YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heure',
      title: 'Heure',
      description: 'Facultatif. Exemple : 20:30',
      type: 'string',
      validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'heure'}).error('Format attendu : 20:30'),
    }),
    defineField({
      name: 'projet',
      title: 'Projet',
      type: 'reference',
      to: [{type: 'projet'}],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'salle', title: 'Salle ou événement', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'ville', title: 'Ville', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'departement',
      title: 'Département ou pays',
      description: 'Numéro du département en France (exemple : 31), sinon le nom du pays.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'billetterie',
      title: 'Lien billetterie',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}).error('L\'adresse doit commencer par https://'),
    }),
    defineField({
      name: 'statut',
      title: 'Statut',
      type: 'string',
      options: {list: statutsConcert, layout: 'radio', direction: 'horizontal'},
      initialValue: 'confirme',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'noteInterne',
      title: 'Note interne',
      description: 'Jamais affichée sur le site.',
      type: 'text',
      rows: 2,
    }),
  ],
  orderings: [
    {title: 'Date (plus proche d\'abord)', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
    {title: 'Date (plus récente d\'abord)', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
  ],
  preview: {
    select: {date: 'date', ville: 'ville', departement: 'departement', salle: 'salle', projet: 'projet.titre', statut: 'statut'},
    prepare: ({date, ville, departement, salle, projet, statut}) => ({
      title: `${formatDate(date)} · ${ville ?? '?'}${departement ? ` (${departement})` : ''}`,
      subtitle: [projet, salle, statut === 'annule' ? 'ANNULÉ' : statut === 'complet' ? 'COMPLET' : null].filter(Boolean).join(' · '),
    }),
  },
})
