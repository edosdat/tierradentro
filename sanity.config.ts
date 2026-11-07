'use client'

// Configuration du Studio Sanity, intégré au site sur /studio.
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {frFRLocale} from '@sanity/locale-fr-fr'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {documentsUniques, schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const uniques = new Set<string>(documentsUniques)

export default defineConfig({
  name: 'tierradentro',
  title: 'Tierradentro',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Les documents uniques ne peuvent pas être créés depuis le bouton « + ».
    templates: (modeles) => modeles.filter(({schemaType}) => !uniques.has(schemaType)),
  },
  document: {
    // Ni suppression ni duplication des documents uniques.
    actions: (actions, {schemaType}) =>
      uniques.has(schemaType) ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : actions,
    newDocumentOptions: (options) => options.filter(({templateId}) => !uniques.has(templateId)),
  },
  plugins: [
    structureTool({title: 'Contenus', structure}),
    frFRLocale(),
    // Outil de requêtes, utile au développement uniquement.
    ...(process.env.NODE_ENV === 'development' ? [visionTool({defaultApiVersion: apiVersion})] : []),
  ],
})
