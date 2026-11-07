// Réglages de connexion à Sanity. Valeurs publiques uniquement : aucun jeton ici.
// L'identifiant du projet n'est pas secret ; on peut le remplacer par une variable d'environnement.

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-11-01'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cnmla0ea'
