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
  - Crédit : « Colibri : illustration de Ludo Deny » (pied de page et page Crédits).

## 3. Distribution des projets

- **Cuarteto Tafi** : Leonor Harispe (chant, textes), Ludovic Deny (bouzouki, chœurs),
  Matthieu Guenez (guitare, oud), Frédéric Theiler (percussions, chœurs).
- ***Des espoirs plein le corps*** : les quatre musiciens du Cuarteto Tafi, Justine Marmouyet (danse), Fanny Do (piano).
- ***La voix des femmes d'Amérique latine*** : les mêmes artistes (les quatre musiciens du Cuarteto Tafi et Fanny Do),
  avec Jean-Luc Amestoy (accordéon).

## 4. Choix techniques de la phase 1

- **Next.js 16.4** avec Cache Components (activé par défaut) : le contenu Sanity est mis en cache côté serveur.
  La liste des prochaines dates est recalculée au moins toutes les heures, ce qui fait basculer une date passée dans les archives sans intervention.
- **Langues** : next-intl, adresses `/fr`, `/en`, `/es`. Les textes de l'interface sont dans `messages/` ;
  toute phrase manquante en anglais ou en espagnol s'affiche en français.
- **Champs traduits dans Sanity** : chaque texte a un champ Français (visible, obligatoire quand le texte l'est)
  et des champs English / Español rangés dans un volet « Traductions » replié. C'est plus simple pour deux personnes
  que des onglets par langue sur tout le formulaire.
- **Dates de concert** : la date et l'heure sont deux champs séparés. L'historique ne donne pas d'heure, et une heure inventée s'afficherait sur le site.
- **Studio** : interface en français, « Dates de concert » en premier avec les vues « À venir » et « Passées ».
  L'association et les réglages sont des documents uniques (ni création ni suppression).
  L'outil de requêtes (Vision) n'est chargé qu'en développement.
- **Prévisualisation en direct** et **mise à jour immédiate après publication** : prévues en phase 2, quand les pages existeront.
