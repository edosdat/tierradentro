import {defineArrayMember, defineField, defineType, type Rule} from 'sanity'

// Champs traduits : le français est toujours visible, l'anglais et l'espagnol
// sont rangés dans un volet « Traductions » replié, pour ne pas encombrer le formulaire.

const traductions = {name: 'traductions', title: 'Traductions (facultatif)', options: {collapsible: true, collapsed: true}}

/** À utiliser comme `validation` d'un champ traduit obligatoire. */
export const francaisObligatoire = (rule: Rule) =>
  rule.custom((valeur: {fr?: unknown} | undefined) =>
    valeur?.fr && (!Array.isArray(valeur.fr) || valeur.fr.length > 0)
      ? true
      : 'Le texte en français est obligatoire.',
  )

export const texteCourtTraduit = defineType({
  name: 'texteCourtTraduit',
  title: 'Texte court traduit',
  type: 'object',
  fieldsets: [traductions],
  fields: [
    defineField({name: 'fr', title: 'Français', type: 'string'}),
    defineField({name: 'en', title: 'English', type: 'string', fieldset: 'traductions'}),
    defineField({name: 'es', title: 'Español', type: 'string', fieldset: 'traductions'}),
  ],
})

export const texteLongTraduit = defineType({
  name: 'texteLongTraduit',
  title: 'Texte traduit',
  type: 'object',
  fieldsets: [traductions],
  fields: [
    defineField({name: 'fr', title: 'Français', type: 'text', rows: 4}),
    defineField({name: 'en', title: 'English', type: 'text', rows: 4, fieldset: 'traductions'}),
    defineField({name: 'es', title: 'Español', type: 'text', rows: 4, fieldset: 'traductions'}),
  ],
})

// Texte mis en forme : paragraphes, intertitres, listes, gras, italique et liens.
// Pas de HTML brut, pas d'intégration de script ou d'iframe.
const blocs = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Paragraphe', value: 'normal'},
      {title: 'Intertitre', value: 'h3'},
      {title: 'Citation', value: 'blockquote'},
    ],
    lists: [
      {title: 'Liste à puces', value: 'bullet'},
      {title: 'Liste numérotée', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Gras', value: 'strong'},
        {title: 'Italique', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Lien',
          type: 'object',
          fields: [
            defineField({
              name: 'href',
              title: 'Adresse',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['https', 'mailto', 'tel'], allowRelative: true}),
            }),
          ],
        }),
      ],
    },
  }),
]

export const texteRicheTraduit = defineType({
  name: 'texteRicheTraduit',
  title: 'Texte mis en forme traduit',
  type: 'object',
  fieldsets: [traductions],
  fields: [
    defineField({name: 'fr', title: 'Français', type: 'array', of: blocs}),
    defineField({name: 'en', title: 'English', type: 'array', of: blocs, fieldset: 'traductions'}),
    defineField({name: 'es', title: 'Español', type: 'array', of: blocs, fieldset: 'traductions'}),
  ],
})
