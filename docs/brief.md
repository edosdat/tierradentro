# Prompt — Site web de Tierradentro (production musicale)

> À coller tel quel dans Claude Code (ou un autre agent de code). Placer dans le dossier du projet :
> - `reference/` : les captures d'écran du site du Cuarteto Tafi (colibri, pages Concerts, Discographie, Vidéos, Presse, Espace Pro)
> - `data/dates-cuarteto-tafi.csv` : l'historique des concerts (2024 → 2027)

---

## 1. Contexte

Tu construis le site de **Tierradentro**, une association toulousaine de production de spectacles vivants (loi 1901). Tierradentro produit aujourd'hui le **Cuarteto Tafi**, un quartet franco-argentin de world music : chant en espagnol poétique et engagé, bouzouki grec, guitare flamenca et oud, percussions afro-latines. Tierradentro a vocation à accueillir **d'autres artistes** : le site doit le montrer dès le départ.

**Public principal : les institutionnels.** Programmateurs de salles et de festivals, collectivités, DRAC, Région, sociétés civiles (SACEM, ADAMI, SPEDIDAM), financeurs européens. Le site doit dire en dix secondes : *structure sérieuse, bien tenue, avec des spectacles prêts à tourner et des documents techniques à jour.* Le grand public vient en second (agenda, billetterie).

**Inspiration de structure :** https://www.atarrayaproductions.com/ (grille d'artistes, agenda des dates, résidence, contacts nommés, bandeau de logos partenaires). Reprendre la clarté de cette structure, **pas** son esthétique WordPress générique.

**Inspiration visuelle :** https://www.cuartetotafi.com/ et les captures dans `reference/`.

## 2. Direction artistique

### Le colibri, emblème de Tierradentro
Le colibri du Cuarteto Tafi (aquarelle magenta / violet / turquoise, éclaboussures, traits blancs) devient **la marque de Tierradentro**, avec cette déclinaison :
- **Logo Tierradentro** : une version **monochrome au trait** du colibri, dérivée de l'aquarelle (un seul tracé, lisible en 24 px comme en grand format), accolée au mot « Tierradentro ». Livrer un SVG.
- **Le colibri aquarelle en couleur** est réservé aux moments forts : héros de la page d'accueil, page 404, transitions.
- ⚠️ Avant mise en ligne, vérifier avec l'illustrateur ou illustratrice du colibri les droits de réutilisation pour Tierradentro. Prévoir un emplacement de crédit.

### Univers
Salar blanc à perte de vue, ciel bleu profond, jacaranda violet, petits colibris en silhouette. Cet univers sert de **socle** à Tierradentro (« tierra adentro » = l'intérieur des terres), mais sans copier la page du Tafi. Chaque artiste garde sa propre couleur d'accent sur sa page.

### Palette (à affiner en phase 0)
- Sable / sel : `#F3EEE6` (fond principal)
- Encre nuit : `#14182B` (texte, sections sombres)
- Ciel : `#2E7BB5`
- Magenta colibri : `#D21FD0` (accent principal, avec parcimonie)
- Turquoise colibri : `#3FC9D6` (accent secondaire)
- Jacaranda : `#9B7BD9`
- Rouge Tafi `#E0422F` : **uniquement** comme accent de la page Cuarteto Tafi
Contraste AA obligatoire sur tout texte.

### Typographie
Le Tafi utilise une linéale grasse très large pour les titres. Pour Tierradentro, viser plus éditorial et plus « institution culturelle » :
- **Titres** : une serif display à caractère (ex. Fraunces, Instrument Serif ou Gloock), avec de grands corps et une composition aérée de type magazine
- **Texte** : une grotesque lisible (ex. Inter Tight, Manrope ou Work Sans)
Proposer 2 paires en phase 0 et me laisser choisir. Polices auto-hébergées via `next/font` (pas d'appel à Google Fonts : RGPD).

### Mouvement
Animations sobres et lentes (fondus, léger parallaxe sur le salar, un colibri qui traverse l'écran une fois). Respect de `prefers-reduced-motion`. Pas de carrousel automatique.

### À éviter absolument
Look « template IA » (dégradés violets génériques, cartes arrondies partout, emojis), fonds d'image derrière du texte sans voile, vidéos en lecture automatique avec son.

## 3. Architecture du site

Trois langues : **FR (par défaut), EN, ES**. URLs préfixées : `/fr/…`, `/en/…`, `/es/…`. Sélecteur de langue visible. Si une traduction manque, afficher le français (repli automatique) sans casser la page.

1. **Accueil** : héros avec colibri et accroche ; « Prochaines dates » (les 4–6 suivantes) ; « Nos spectacles » (cartes) ; « Nos artistes » ; une vidéo à la une ; bloc « Programmateurs : accès direct à l'Espace pro » ; bandeau de logos partenaires (masqué tant qu'il est vide).
2. **L'association** : mission et projet artistique, valeurs, équipe (bureau, rôles), **fiche d'identité légale** (SIRET, licence d'entrepreneur de spectacles, statut d'exonération de TVA, siège), rapports d'activité téléchargeables. *C'est la page qui rassure les institutionnels : la soigner.*
3. **Artistes** : grille. Afficher le Cuarteto Tafi, plus une carte « Rejoindre Tierradentro / Nous proposer un projet » qui renvoie vers le contact. Une fiche par artiste : bio, membres et instruments, photos, vidéos YouTube, discographie (pochettes, liens d'écoute), spectacles liés, dates à venir, presse.
4. **Spectacles** : une fiche par spectacle, avec un statut (`En tournée`, `Création`, `À venir`, `Archivé`). À créer au départ :
   - **El infinito y un amor** (Cuarteto Tafi, spectacle de l'album 2024) — En tournée
   - **Des espoirs plein le corps** (Cuarteto Tafi, avec Justine Marmouyet à la danse et Fanny Do au piano ; parcours d'un corps de femme, de la naissance à l'émancipation ; 1h15, tout public) — En tournée
   - **La voix des femmes d'Amérique latine** (Cuarteto Tafi et Jean-Luc Amestoy à l'accordéon ; création 2023) — En tournée
   - **La Noche Eterna** — À venir (contenu en attente, afficher un teaser propre)
   - Prévoir aussi la création « Nosotras : nuestros cantos – nuestros cuerpos » (Rio Loco 2025), à confirmer
   Chaque fiche contient : texte de présentation, distribution, durée, jauge et public, galerie photos, vidéos, dates liées, presse, **téléchargements pro** (voir 5).
5. **Agenda** : dates à venir (liste claire : date, spectacle, artiste, salle, ville, département ou pays, lien billetterie, statut `Complet` / `Annulé`), avec filtres par artiste et par spectacle. Onglet **Archives** classé par année : c'est la preuve d'activité pour les institutionnels. Une date passe automatiquement en archive le lendemain. Option carte de France des dates passées (nice-to-have).
6. **Espace pro** : pour chaque spectacle, fiche technique (PDF), plan de scène, dossier de presse, dossier artistique, photos HD libres de droits (avec crédits), et texte court / long à copier. Accès public, sans mot de passe : les programmateurs ne doivent rencontrer aucun obstacle.
7. **Presse** : articles (titre, média, date, extrait court, lien externe), filtrables par artiste.
8. **Actualités** : articles simples (sortie d'album, résidence, création).
9. **Contact** : contacts nommés (production / diffusion / artistique, avec téléphone et e-mail, éditables), formulaire de contact (objet : programmation, presse, proposition d'artiste, autre), adresse.
10. **Mentions légales, Politique de confidentialité, Crédits**.

## 4. Stack technique (décision)

- **Next.js 16** (App Router, TypeScript strict), déployé sur **Vercel**
- **Sanity** comme CMS headless, avec **Sanity Studio intégré au site sur `/studio`**. C'est l'interface d'admin pour Eloi et Ludo.
- **Tailwind CSS v4** + composants maison (pas de kit d'UI générique visible)
- **next-intl** pour l'interface en 3 langues ; contenus traduits dans Sanity par champs internationalisés (un seul document « date » ou « spectacle » avec ses 3 langues : plus simple à maintenir pour deux personnes)
- Images : pipeline Sanity (recadrage par point focal, formats AVIF/WebP) + `next/image`
- Vidéos : **YouTube uniquement**, collées en URL dans le Studio, affichées en « lite embed » (miniature, puis lecteur `youtube-nocookie.com` au clic) : rapide et sans cookies avant le clic
- Formulaire de contact : Server Action + **Resend** pour l'envoi + **Cloudflare Turnstile** contre le spam
- Mise à jour du site : **webhook Sanity → revalidation à la demande** (une modif publiée est en ligne en quelques secondes)
- Analytics : Vercel Web Analytics (sans cookie, pas de bannière nécessaire)

Pourquoi ce choix : l'admin est hébergée et sécurisée par Sanity (aucun mot de passe stocké chez nous, aucune base de données à patcher), le front est statique et ultra-rapide, et la stack est très documentée, ce qui la rend maintenable avec un agent IA.

## 5. Interface d'admin (Sanity Studio) : exigences

Utilisateurs : **Eloi** (administrateur) et **Ludo** (éditeur). Ce ne sont pas des développeurs : le Studio doit être aussi simple qu'un formulaire.

- **Structure du Studio en français**, avec des intitulés métier : « Dates de concert », « Spectacles », « Artistes », « Presse », « Actualités », « Partenaires », « Pages », « Réglages du site ». Pas de jargon technique.
- **Dates de concert** en premier, avec une vue « À venir » et une vue « Passées ». Champs :
  - date et heure
  - spectacle (référence)
  - artiste (déduit du spectacle, modifiable)
  - salle
  - ville
  - département ou pays
  - lien billetterie
  - statut (`Confirmé`, `Complet`, `Annulé`)
  - note interne non publiée

  Bouton « Dupliquer » pour enchaîner les dates d'une tournée.
- **Photos** : glisser-déposer, recadrage par point focal, **crédit photo et texte alternatif obligatoires** (validation bloquante).
- **Vidéos** : champ URL YouTube avec validation et aperçu de la miniature.
- **Fichiers pro** (PDF) : téléversement, libellé, date de mise à jour affichée sur le site.
- **Aperçu en direct** (Presentation / Visual Editing) pour voir la page avant de publier.
- Brouillon / publication, historique des versions et restauration en un clic.
- Champs de traduction regroupés en onglets FR / EN / ES, le FR obligatoire, EN et ES facultatifs.
- Écrire un **guide d'utilisation d'une page** (`docs/guide-admin.md`) avec captures : « ajouter une date », « ajouter une vidéo », « mettre à jour une fiche technique ».

## 6. Sécurité (priorité forte)

Objectif : impossible de défigurer le site ou d'y publier du contenu indésirable.

- **Authentification** : déléguée à Sanity, connexion via Google ou e-mail. **2FA activée obligatoirement** sur les comptes Google d'Eloi et Ludo, sur GitHub et sur Vercel. Membres du projet Sanity : uniquement ces deux personnes, avec les rôles minimum nécessaires.
- **Aucun secret côté client** : le front lit le dataset public en lecture seule ; les tokens d'écriture ou de preview restent côté serveur (variables d'environnement Vercel). Le webhook de revalidation est signé (vérification du secret).
- **CORS Sanity** : seuls le domaine de production et `localhost` sont autorisés.
- **En-têtes HTTP** : Content-Security-Policy stricte (autoriser seulement Sanity CDN, youtube-nocookie, Turnstile, Vercel), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'` (sauf pour le Studio en preview).
- **Contenu riche** : Portable Text rendu sans HTML brut. Liens externes en `rel="noopener noreferrer"`. Aucun champ ne permet d'injecter du script ou de l'iframe arbitraire (vidéos : URL YouTube validée uniquement).
- **Formulaire** : Turnstile, rate limiting par IP, validation serveur (zod), pas de stockage des messages hors e-mail.
- **Dépendances** : Dependabot ou Renovate activé ; suivre les releases de sécurité de Next.js ; `npm audit` en CI.
- **Sauvegarde** : GitHub Action hebdomadaire qui exporte le dataset Sanity (contenus + images) vers un stockage privé.
- **Vercel** : protection des déploiements de preview ; firewall Vercel avec limitation de débit sur `/api/*`.
- Avant la mise en ligne, faire passer une revue de sécurité (skill sécurité, voir 8) et me livrer le rapport.

## 7. Données de départ

- Importer `data/dates-cuarteto-tafi.csv` dans Sanity via un script de seed (`scripts/import-dates.ts`). Colonnes : `date;statut;spectacle;salle_ou_evenement;ville;departement;annee_certaine;note`. Les lignes marquées `annee_certaine=déduite` reçoivent une note interne « année à vérifier ». Les dates sans jour (`2025` ou `2024-02`) sont importées en brouillon.
- Créer l'artiste Cuarteto Tafi : Leonor Harispe (chant, textes), Ludovic Deny (bouzouki, chœurs), Matthieu Guenez (guitare, oud), Frédéric Theiler (percussions, chœurs). Discographie : *El infinito y un amor* (19/01/2024), *Amanecer* (19/03/2021), *Semillas*, et les albums antérieurs à compléter. Clips YouTube : Vuelven, Manaos Amazonas, Presentes, Somos de la tierra (chaîne @CuartetoTafi).
- Textes : rédiger des textes provisoires sobres en FR (marqués `[À VALIDER]`), puis les traduire en EN/ES. Ne jamais inventer de citation de presse, de chiffre ou de partenaire.

## 8. Skills et outils à installer avant de coder

Installer et **utiliser explicitement** :
1. **frontend-design** (Anthropic, officiel) : direction artistique et refus du look générique. `/plugin install frontend-design@claude-plugins-official`
2. **sanity-best-practices** (Sanity, officiel) : schémas, GROQ, i18n, Visual Editing. `npx skills add sanity-io/agent-toolkit --skill sanity-best-practices`
3. **next-best-practices** : conventions Next.js 16, RSC, cache, images, metadata. `npx skills add https://github.com/sanity-io/next-sanity --skill next-best-practices`
4. **Impeccable** (pbakaus/impeccable) : audit et finition design avant livraison
5. **Playwright** (skill ou MCP) : vérifier chaque page en 3 langues, sur mobile et sur desktop, avec captures
6. **Trail of Bits security skills** (trailofbits/skills) : revue de sécurité finale
Utiliser aussi le **MCP Sanity** pour créer les schémas et injecter le contenu.

## 9. Méthode de travail

- **Phase 0 — Direction artistique** : 2 propositions de page d'accueil (maquettes HTML statiques), le logo colibri au trait et 2 paires typographiques. **Stop : j'arbitre.**
- **Phase 1** : initialisation du projet, schémas Sanity, Studio en français, import des données.
- **Phase 2** : pages publiques en FR.
- **Phase 3** : EN / ES, SEO (metadata, sitemap, hreflang, Open Graph par page, **JSON-LD `MusicEvent`** pour chaque date et `PerformingGroup` pour les artistes).
- **Phase 4** : sécurité, performance, accessibilité, guide admin.
- Commits réguliers, README clair (installation, variables d'environnement, déploiement).

## 10. Critères d'acceptation

- [ ] Lighthouse ≥ 95 sur Performance, Accessibilité, Bonnes pratiques et SEO (mobile)
- [ ] WCAG 2.2 AA : navigation clavier, focus visible, textes alternatifs, contrastes
- [ ] Ludo ajoute une date avec un lien billetterie et une vidéo YouTube **en moins de 2 minutes, sans aide**, et la voit en ligne en moins d'une minute
- [ ] Une date passée bascule seule en archive
- [ ] Les 3 langues fonctionnent, avec repli sur le français sans erreur
- [ ] Aucun token dans le bundle client ; en-têtes de sécurité notés A sur securityheaders.com
- [ ] Rapport de revue de sécurité livré, sans faille critique ni haute ouverte
- [ ] Rendu soigné de 360 px à 1920 px

## 11. Points en attente (ne pas bloquer, mettre des emplacements propres)

- Contenu de **La Noche Eterna**
- **Logos partenaires** (bloc masqué tant qu'il est vide)
- **Nom de domaine** à acheter (ex. `tierradentro.fr`). Développer sur l'URL Vercel en attendant.
- Contact de diffusion / booking par spectacle (Atarraya Productions pour le Tafi aujourd'hui ?) : champ « contact diffusion » éditable par spectacle
- Droits d'usage du colibri pour Tierradentro
