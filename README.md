# Tierradentro

Site de **Tierradentro**, association toulousaine de production de spectacles vivants (loi 1901).
Le Cuarteto Tafi est l'un des projets présentés, à côté de collaborations et de créations.

- Cahier des charges : [`docs/brief.md`](docs/brief.md)
- Décisions prises en cours de route : [`docs/decisions.md`](docs/decisions.md)
- Direction artistique validée (maquettes HTML) : [`design/phase-0/`](design/phase-0/)

## Où en est le projet

| Phase | Contenu | État |
|---|---|---|
| 0 | Direction artistique : maquette B « Nuit », Fraunces + Inter Tight, colibri du Cuarteto Tafi | Validée |
| 1 | Next.js 16 + Sanity (Studio en français sur `/studio`), schémas, import des dates | **Livrée**, contenu importé |
| 2 | Pages publiques en français | **Livrée** |
| 3 | Anglais et espagnol, SEO, données structurées | À faire |
| 4 | Sécurité, performance, accessibilité, guide d'administration | À faire |

## Technique

- **Next.js 16** (App Router, TypeScript, Cache Components), déployé sur **Vercel**
- **Sanity** : contenu et interface d'administration, intégrée au site sur `/studio`
- **next-intl** : `/fr` (par défaut), `/en`, `/es`. Une phrase non traduite s'affiche en français.
- **Tailwind CSS v4**, polices Fraunces et Inter Tight auto-hébergées (aucun appel à Google Fonts)

```
src/
  app/[locale]/        pages du site (accueil, projets, agenda, espace pro, presse, actualités, association, contact, pages simples)
  app/api/revalidation webhook Sanity → mise à jour immédiate du site
  components/          en-tête, pied de page, cartes, billets, vidéo, filtres…
  app/studio/          Studio Sanity
  i18n/                langues et routage
  sanity/schemaTypes/  modèle de contenu (projets, dates, personnes, presse…)
  sanity/structure.ts  organisation du Studio (« Dates de concert » en premier)
messages/              textes de l'interface en FR / EN / ES
scripts/import-dates.ts  prépare le contenu de départ (data/seed.ndjson)
data/                  historique des concerts (CSV) et presse reprise du site du Tafi
```

## Installer et lancer

Il faut Node.js 22 ou plus récent.

```bash
npm install
cp .env.example .env.local   # facultatif : les valeurs par défaut pointent déjà vers le projet
npm run dev                  # http://localhost:3000 (site) et http://localhost:3000/studio
```


## Sanity

Projet Sanity : **`cnmla0ea`**, jeu de données `production` (public en lecture : le site ne lit que le contenu publié).
L'identifiant n'est pas secret : il est écrit par défaut dans `src/sanity/env.ts`.

Réglages à faire dans [sanity.io/manage](https://www.sanity.io/manage) → projet Tierradentro :

- **API → CORS origins** : ajouter `http://localhost:3000` et l'adresse du site (Vercel, puis le nom de domaine),
  en cochant **Allow credentials**. Sans cela, le Studio ne peut pas se connecter.
- **Members** : inviter Ludo avec le rôle *Editor* ; Eloi garde *Administrator*. Double authentification activée sur les deux comptes Google.

Réimporter le contenu de départ (remplace les documents de même identifiant, sans doublons) :

```bash
npm run seed                                     # régénère data/seed.ndjson à partir du CSV
SANITY_API_WRITE_TOKEN=… npm run seed:importer   # jeton « Editor » créé dans API → Tokens
```

### Contenu importé

- 96 dates de concert (2024 → 2027). Celles dont l'année était « déduite » portent la note interne « Année à vérifier ».
  Les 5 dates sans jour connu sont des **brouillons** : à compléter puis publier.
- 5 projets : Cuarteto Tafi, *Des espoirs plein le corps*, *La voix des femmes d'Amérique latine*, *La Noche Eterna*, *Nosotras*.
  Les textes provisoires commencent par `[À VALIDER]`.
- 7 personnes et la distribution de chaque projet.
- Discographie et 6 vidéos du Cuarteto Tafi (reprises de cuartetotafi.com).
- 34 articles de presse en **brouillon**, repris de la page presse du Tafi : nom du média et date de parution à compléter.

## Mise à jour du site après une publication

Sans réglage, le site relit le contenu au moins toutes les heures. Pour qu'une publication apparaisse en quelques secondes :

1. Choisir un mot de passe long et aléatoire (le « secret »).
2. Vercel → projet tierradentro → *Settings → Environment Variables* : ajouter `SANITY_REVALIDATE_SECRET` avec ce secret, puis redéployer.
3. sanity.io/manage → projet → *API → Webhooks → Create webhook* :
   adresse `https://<adresse du site>/api/revalidation`, jeu de données `production`,
   déclencheurs *Create*, *Update*, *Delete*, projection `{_type}`, méthode `POST`, et le même secret.

## Formulaire de contact

Il s'active quand ces variables sont renseignées dans Vercel :

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | clé du service d'envoi d'e-mails Resend |
| `RESEND_FROM` | expéditeur, par exemple `Tierradentro <site@tierradentro.fr>` (domaine vérifié chez Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` et `TURNSTILE_SECRET_KEY` | protection anti-robots Cloudflare Turnstile (facultatif mais recommandé) |

L'adresse qui reçoit les messages se règle dans le Studio : *Réglages du site → Adresse qui reçoit le formulaire de contact*.

## Commandes utiles

| Commande | Effet |
|---|---|
| `npm run dev` | site en développement |
| `npm run build` | construction de production |
| `npm run typecheck` / `npm run lint` | vérifications du code |
| `npm run sanity:valider` | vérifie le modèle de contenu |
| `npm run seed` | prépare `data/seed.ndjson` |
| `npm run seed:importer` | importe ce fichier dans Sanity |
