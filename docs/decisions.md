# Décisions de projet

Les écarts par rapport à `brief.md`, dans l'ordre où ils ont été décidés.

## 1. Une liste plate de projets (remplace « Artistes » + « Spectacles »)

Le Cuarteto Tafi est **un des projets** présentés par Tierradentro, pas « l'artiste » de la structure.
À côté de lui existent des collaborations et d'autres projets, même quand on y retrouve des musiciens du Tafi.

Conséquences :
- La navigation a une rubrique **Projets** au lieu de « Artistes » et « Spectacles ».
- Chaque projet a sa propre fiche, au même niveau : présentation, distribution (personnes et instruments),
  photos, vidéos, discographie s'il y en a, dates, presse, documents pro.
- Projets de départ : Cuarteto Tafi (concert *El infinito y un amor*), *Des espoirs plein le corps*,
  *La voix des femmes d'Amérique latine*, *La Noche Eterna* (à venir), *Nosotras : nuestros cantos – nuestros cuerpos* (à confirmer).
- Modèle Sanity (phase 1) : un type **Projet** avec un statut (`En tournée`, `Création`, `À venir`, `Archivé`)
  et une liste de **Personnes** (réutilisables d'un projet à l'autre). Chaque **Date** pointe vers un projet.
- Dans le CSV, une date sans spectacle renseigné est rattachée au projet Cuarteto Tafi (confirmé : les dates à venir sont des concerts du Cuarteto).
- La discographie appartient au projet Cuarteto Tafi : *El infinito y un amor* (19/01/2024), *Amanecer* (19/03/2021), *Semillas*, et les albums antérieurs à compléter.

## 2. Direction artistique validée (phase 0)

- **Maquette B « Nuit »** : héros plein écran au crépuscule sur le salar, dates en billets,
  projets en aplats de couleur, tableau des documents pro.
- **Typographies** : Fraunces (titres) + Inter Tight (texte), auto-hébergées.
- **Colibri** : celui du Cuarteto Tafi.
  - Couleur : l'aquarelle originale (`Colibri-002-Home-Page-2024.png` du site cuartetotafi.com),
    copiée dans `reference/colibri-original-cuartetotafi.png` et en WebP dans `design/phase-0/assets/colibri-tafi.webp`.
  - Logo : version monochrome tracée automatiquement à partir de l'aquarelle (traits blancs des plumes en réserve),
    avec une version allégée pour le favicon.
  - Droits d'usage par Tierradentro et nom à créditer : à confirmer avec l'illustrateur ou l'illustratrice avant la mise en ligne.
