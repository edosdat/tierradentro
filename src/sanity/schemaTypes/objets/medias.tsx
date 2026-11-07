import {defineField, defineType} from 'sanity'
import {idYoutube, miniatureYoutube} from '../../../lib/youtube'
import {francaisObligatoire} from './traductions'

// Image avec crédit photo et texte alternatif obligatoires (la publication est bloquée sans eux).
export const imageCreditee = defineType({
  name: 'imageCreditee',
  title: 'Photo',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Description de la photo (texte alternatif)',
      description: 'Décrivez ce que montre la photo, pour les personnes qui ne la voient pas. Exemple : « Les quatre musiciens sur scène, éclairage violet ».',
      type: 'texteCourtTraduit',
      validation: francaisObligatoire,
    }),
    defineField({
      name: 'credit',
      title: 'Crédit photo',
      description: 'Nom du ou de la photographe. Exemple : « © Marie Dupont ».',
      type: 'string',
      validation: (rule) => rule.required().error('Le crédit photo est obligatoire.'),
    }),
  ],
  validation: (rule) =>
    rule.custom((valeur: {asset?: unknown} | undefined) => (!valeur || valeur.asset ? true : 'Ajoutez une image.')),
})

// Vidéo YouTube : on colle simplement l'adresse de la vidéo.
export const videoYoutube = defineType({
  name: 'videoYoutube',
  title: 'Vidéo YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Adresse de la vidéo YouTube',
      description: 'Copiez l\'adresse depuis YouTube (bouton « Partager »). Exemple : https://youtu.be/…',
      type: 'url',
      validation: (rule) =>
        rule.required().custom((valeur: string | undefined) =>
          !valeur || idYoutube(valeur) ? true : 'Ce n\'est pas une adresse de vidéo YouTube valide.',
        ),
    }),
    defineField({name: 'titre', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'legende', title: 'Légende', description: 'Exemple : « Clip officiel 2023 ».', type: 'texteCourtTraduit'}),
  ],
  preview: {
    select: {titre: 'titre', url: 'url', legende: 'legende.fr'},
    prepare({titre, url, legende}) {
      const id = idYoutube(url)
      return {
        title: titre || 'Vidéo sans titre',
        subtitle: id ? legende || 'YouTube' : 'Adresse YouTube à vérifier',
        // eslint-disable-next-line @next/next/no-img-element
        media: id ? <img src={miniatureYoutube(id)} alt="" style={{objectFit: 'cover'}} /> : undefined,
      }
    },
  },
})

// Document téléchargeable de l'Espace pro (PDF).
export const fichierPro = defineType({
  name: 'fichierPro',
  title: 'Document pro',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type de document',
      type: 'string',
      options: {
        list: [
          {title: 'Fiche technique', value: 'fiche-technique'},
          {title: 'Plan de scène', value: 'plan-de-scene'},
          {title: 'Dossier de presse', value: 'dossier-de-presse'},
          {title: 'Dossier artistique', value: 'dossier-artistique'},
          {title: 'Rapport d\'activité', value: 'rapport-activite'},
          {title: 'Autre', value: 'autre'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'libelle', title: 'Libellé affiché', type: 'texteCourtTraduit', validation: francaisObligatoire}),
    defineField({
      name: 'fichier',
      title: 'Fichier PDF',
      type: 'file',
      options: {accept: 'application/pdf'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'miseAJour',
      title: 'Date de mise à jour',
      description: 'Affichée sur le site : « mis à jour le … ».',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {titre: 'libelle.fr', type: 'type', date: 'miseAJour'},
    prepare: ({titre, type, date}) => ({
      title: titre || type,
      subtitle: date ? `Mis à jour le ${new Date(date).toLocaleDateString('fr-FR')}` : 'Date de mise à jour manquante',
    }),
  },
})

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'object',
  fields: [
    defineField({name: 'role', title: 'Rôle', description: 'Exemple : « Production », « Diffusion », « Direction artistique ».', type: 'texteCourtTraduit', validation: francaisObligatoire}),
    defineField({name: 'nom', title: 'Nom', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'structure', title: 'Structure', description: 'Si le contact appartient à une autre structure (agence de diffusion…).', type: 'string'}),
    defineField({name: 'telephone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'email', title: 'E-mail', type: 'email'}),
  ],
  preview: {select: {title: 'nom', subtitle: 'role.fr'}},
})

export const lienExterne = defineType({
  name: 'lienExterne',
  title: 'Lien',
  type: 'object',
  fields: [
    defineField({name: 'libelle', title: 'Libellé', description: 'Exemple : « Spotify », « Bandcamp », « Instagram ».', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'url', title: 'Adresse', type: 'url', validation: (rule) => rule.required().uri({scheme: ['https']})}),
  ],
  preview: {select: {title: 'libelle', subtitle: 'url'}},
})

export const album = defineType({
  name: 'album',
  title: 'Album',
  type: 'object',
  fields: [
    defineField({name: 'titre', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'dateSortie', title: 'Date de sortie', type: 'date', options: {dateFormat: 'DD/MM/YYYY'}}),
    defineField({name: 'annee', title: 'Année (si la date exacte est inconnue)', type: 'number', validation: (rule) => rule.min(1980).max(2100)}),
    defineField({name: 'nombreTitres', title: 'Nombre de titres', type: 'number'}),
    defineField({name: 'pochette', title: 'Pochette', type: 'imageCreditee'}),
    defineField({name: 'ecoute', title: 'Liens d\'écoute', type: 'array', of: [{type: 'lienExterne'}]}),
    defineField({name: 'paroles', title: 'Paroles (PDF)', type: 'file', options: {accept: 'application/pdf'}}),
  ],
  preview: {
    select: {title: 'titre', date: 'dateSortie', annee: 'annee', media: 'pochette'},
    prepare: ({title, date, annee, media}) => ({title, subtitle: date ? new Date(date).getFullYear().toString() : annee?.toString(), media}),
  },
})
