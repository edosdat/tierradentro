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
| 1 | Next.js 16 + Sanity (Studio en français sur `/studio`), schémas, import des dates | **Livrée** (reste à créer le projet Sanity) |
| 2 | Pages publiques en français | À faire |
| 3 | Anglais et espagnol, SEO, données structurées | À faire |
| 4 | Sécurité, performance, accessibilité, guide d'administration | À faire |

## Technique

- **Next.js 16** (App Router, TypeScript, Cache Components), déployé sur **Vercel**
- **Sanity** : contenu et interface d'administration, intégrée au site sur `/studio`
- **next-intl** : `/fr` (par défaut), `/en`, `/es`. Une phrase non traduite s'affiche en français.
- **Tailwind CSS v4**, polices Fraunces et Inter Tight auto-hébergées (aucun appel à Google Fonts)

```
src/
  app/[locale]/        pages du site (une seule pour l'instant, provisoire)
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
cp .env.example .env.local   # puis renseigner l'identifiant du projet Sanity
npm run dev                  # http://localhost:3000 (site) et http://localhost:3000/studio
```

Sans identifiant Sanity, le site s'affiche quand même et indique que les dates arriveront plus tard.

## Brancher Sanity (à faire une fois)

1. Créer un compte sur [sanity.io](https://www.sanity.io) avec le compte Google d'Eloi, et activer la double authentification.
2. Créer un projet « Tierradentro » avec un jeu de données `production` (visibilité **publique** : le site ne fait que lire le contenu publié).
3. Copier l'identifiant du projet dans `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`) et dans les variables d'environnement Vercel.
4. Dans *API → CORS origins* du projet : autoriser `http://localhost:3000` et l'adresse du site (Vercel puis nom de domaine), **avec** « Allow credentials » (nécessaire au Studio).
5. Importer le contenu de départ :

   ```bash
   npx sanity login
   npm run seed            # régénère data/seed.ndjson à partir du CSV
   npm run seed:importer   # l'envoie dans Sanity (remplace les documents de même identifiant)
   ```

6. Inviter Ludo dans le projet avec le rôle *Editor* ; Eloi garde le rôle *Administrator*.

### Contenu importé

- 96 dates de concert (2024 → 2027). Celles dont l'année était « déduite » portent la note interne « Année à vérifier ».
  Les 5 dates sans jour connu sont des **brouillons** : à compléter puis publier.
- 5 projets : Cuarteto Tafi, *Des espoirs plein le corps*, *La voix des femmes d'Amérique latine*, *La Noche Eterna*, *Nosotras*.
  Les textes provisoires commencent par `[À VALIDER]`.
- 7 personnes et la distribution de chaque projet.
- Discographie et 6 vidéos du Cuarteto Tafi (reprises de cuartetotafi.com).
- 34 articles de presse en **brouillon**, repris de la page presse du Tafi : nom du média et date de parution à compléter.

## Commandes utiles

| Commande | Effet |
|---|---|
| `npm run dev` | site en développement |
| `npm run build` | construction de production |
| `npm run typecheck` / `npm run lint` | vérifications du code |
| `npm run sanity:valider` | vérifie le modèle de contenu |
| `npm run seed` | prépare `data/seed.ndjson` |
| `npm run seed:importer` | importe ce fichier dans Sanity |
