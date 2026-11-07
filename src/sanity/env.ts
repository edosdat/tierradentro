// Réglages de connexion à Sanity, lus dans les variables d'environnement.
// Seules des valeurs publiques ici : aucun jeton.

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-11-01'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Tant que le projet Sanity n'est pas créé, un identifiant fictif permet au site de compiler.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'aremplacer'
export const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
