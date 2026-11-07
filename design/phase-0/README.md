# Phase 0 : direction artistique

**Choix validés** : maquette B « Nuit », Fraunces + Inter Tight, colibri du Cuarteto Tafi (voir `docs/decisions.md`).

Ouvrir **`index.html`** : il présente les choix à faire et renvoie vers le reste.

| Fichier | Contenu |
|---|---|
| `maquette-a-salar.html` | Proposition A : fond sable, éditorial, salar en panorama |
| `maquette-b-nuit.html` | Proposition B : héros plein écran au crépuscule, jacaranda, reflet sur le sel |
| `typographies.html` | Les deux paires typographiques côte à côte |
| `assets/logo-tierradentro-a.svg` / `-b.svg` | Logo complet (colibri + mot, en tracés) pour chaque paire |
| `assets/colibri-trait.svg` | Colibri seul, monochrome (`currentColor`), tracé depuis l'aquarelle du Tafi |
| `assets/colibri-favicon.svg` | Version épaissie pour 16–24 px, s'adapte au mode sombre |
| `assets/colibri-tafi.webp` | Aquarelle originale du Cuarteto Tafi (droits à confirmer) |
| `assets/salar-croute.svg` | Croûte de sel en perspective (générée) |

Dans chaque maquette, le bouton **Typo** en bas à droite bascule entre les deux paires. On peut aussi ajouter `?pair=a` ou `?pair=b` à l'adresse.

Notes :
- Les textes marqués « À valider » sont provisoires. Aucune citation, aucun partenaire et aucun chiffre n'ont été inventés. Les chiffres affichés (90 dates, 36 départements et le Maroc) sont calculés à partir de `data/dates-cuarteto-tafi.csv`. Une partie des années y est déduite, d'où la mention « À valider ».
- Les animations (colibri qui traverse une fois, flottement, parallaxe, apparitions) sont désactivées si le système demande moins d'animations.
- Polices : Fraunces, Inter Tight, Instrument Serif et Manrope (SIL OFL), copiées depuis les paquets npm Fontsource.
