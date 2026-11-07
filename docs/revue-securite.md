# Revue de sécurité · Tierradentro (7 novembre 2026)

Périmètre : site public (Next.js 16 sur Vercel), administration (Sanity Studio sur `/studio`), formulaire de contact,
webhook de mise à jour, dépôt GitHub. Méthode : relecture du code, contrôle des en-têtes servis, recherche de secrets
dans le code envoyé aux navigateurs, audit des dépendances.

**Bilan : aucune faille critique ni haute ouverte dans le site servi aux visiteurs.** Deux actions restent à faire par l'association (voir « À faire »).

## Points vérifiés

| Sujet | État |
|---|---|
| Authentification de l'administration | Déléguée à Sanity (Google). Un seul membre humain (administrateur). Aucun mot de passe stocké par le site. |
| Secrets côté navigateur | Aucun : recherche sur les 231 fichiers JS servis. Seuls des identifiants publics (`NEXT_PUBLIC_…`). |
| Lecture du contenu | Le site lit le contenu **publié** sans jeton ; les brouillons et notes internes ne sont jamais servis. |
| Webhook `/api/revalidation` | Signature HMAC vérifiée (`SANITY_REVALIDATE_SECRET`) ; refuse toute requête non signée (401). |
| CORS Sanity | Limité à `localhost:3000` et à l'adresse du site (+ `localhost:3333` ajouté par Sanity). |
| En-têtes HTTP | CSP stricte (sources limitées à Sanity, YouTube nocookie, Turnstile), HSTS 2 ans, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Cross-Origin-Opener-Policy`. |
| Texte riche | Rendu par Portable Text : aucun HTML brut, pas de script ni d'iframe saisissables ; liens externes en `noopener noreferrer`. |
| Vidéos | URL YouTube validée (identifiant de 11 caractères) ; lecteur `youtube-nocookie.com` chargé seulement au clic. |
| Formulaire de contact | Validation serveur (zod), champ piège anti-robots, limite de 5 envois/heure/IP, Turnstile dès que la clé est fournie, contenu échappé dans l'e-mail, aucun stockage. |
| Données structurées | JSON sérialisé avec échappement de `<` (pas d'injection de script). |
| Déploiements de test Vercel | Protégés par connexion Vercel ; la production est publique. |

## Risques acceptés

- **`'unsafe-inline'` pour les scripts** : nécessaire pour garder des pages statiques (rapides). Le risque est limité :
  aucun contenu saisi n'est injecté comme HTML, et les sources externes de scripts sont restreintes à Cloudflare Turnstile.
- **Dépendances signalées par `npm audit`** (3 « hautes », 18 « modérées ») : js-yaml, smol-toml, undici.
  Elles sont utilisées par les **outils en ligne de commande** de Sanity (import, déploiement), pas par les pages servies.
  Dependabot proposera les correctifs dès leur publication ; la vérification automatique bloque toute faille **critique**.
- **Studio sans CSP détaillée** : l'interface de Sanity charge ses propres ressources ; il reste protégé par
  l'authentification Sanity et ne peut pas être affiché dans un cadre (`frame-ancestors 'none'`).

## Mesures en place

- Vérification automatique à chaque modification (`.github/workflows/verification.yml`).
- Mises à jour de sécurité hebdomadaires proposées par Dependabot (`.github/dependabot.yml`).
- Sauvegarde hebdomadaire **chiffrée** du contenu (`.github/workflows/sauvegarde.yml`), conservée 90 jours.

## À faire par l'association

1. **Passer le dépôt GitHub en privé** (*Settings → General → Danger Zone → Change visibility*).
   Il contient l'aquarelle originale du colibri, les captures du site du Tafi et des notes de travail.
2. **Activer la double authentification** sur les comptes Google (Eloi, Ludo), GitHub et Vercel.
3. **Supprimer les jetons Sanity inutiles** (*API → Tokens*) : garder seulement celui des sauvegardes (Viewer).
   Le jeton « Editor » utilisé pour l'import pourra être supprimé à la fin du chantier.
4. **Créer les secrets de sauvegarde** dans GitHub : `SANITY_SAUVEGARDE_TOKEN` (jeton Viewer) et `SAUVEGARDE_PHRASE`.
5. Facultatif : activer le **pare-feu Vercel** avec une limite de débit sur `/api/*`.
