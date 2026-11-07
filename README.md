# Tierradentro

Site de **Tierradentro**, association toulousaine de production de spectacles vivants (loi 1901), qui produit aujourd'hui le Cuarteto Tafi.

Le cahier des charges complet est dans [`docs/brief.md`](docs/brief.md).

## Où en est le projet

| Phase | Contenu | État |
|---|---|---|
| 0 | Direction artistique : maquette B « Nuit », Fraunces + Inter Tight, colibri du Cuarteto Tafi | **Validée** |
| 1 | Next.js 16 + Sanity (Studio en français sur `/studio`), schémas, import des dates | À faire |
| 2 | Pages publiques en français | À faire |
| 3 | Anglais et espagnol, SEO, données structurées | À faire |
| 4 | Sécurité, performance, accessibilité, guide d'administration | À faire |

## Organisation du dépôt

```
data/        historique des concerts (CSV, 2024 → 2027)
docs/        brief du projet (et, plus tard, guide d'administration)
design/
  phase-0/   maquettes HTML statiques de la phase 0 (ouvrir index.html)
reference/   captures d'écran de référence (à déposer)
```

## Voir les maquettes de la phase 0

Ouvrir `design/phase-0/index.html` dans un navigateur. Aucune installation n'est nécessaire : les polices sont hébergées dans le dépôt, sans appel à Google Fonts.
