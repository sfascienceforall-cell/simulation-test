# Rapport de nuit : 25-26/11/2026

Le chef des simulations (session Claude dans le cloud) a travaillé seul pendant la nuit, à la demande d'Enzo :
il a vérifié chaque lot, publié ceux qui passaient les contrôles, puis enchaîné P1 → P2 → P3 → physique quantique.

## En bref (26/11, 08:40)

- **148 simulations en ligne cette nuit** : 144 nouvelles, plus 4 pages refaites.
  - P1 : 26 nouvelles et 4 refaites, soit toute la vague.
  - P2 : 83 sur 88.
  - P3 : 35 sur 35.
- **En cours** : les 5 dernières simulations de P2 (lot CE, en relecture) et le nouveau cours de physique quantique (squelette et 6 premières simulations).
- **Contrôles de chaque simulation publiée** :
  - relecture scientifique (une centaine d’erreurs de texte, de loi ou d’ordre de grandeur corrigées) ;
  - vérification visuelle à 1280 et 420 px (une soixantaine de défauts d’affichage corrigés, dont 5 blocages) ;
  - `test_sims` à 0 erreur, et `check-course` à 0 erreur JS en chimie.

## Incident de crédit et reprise

- Vers 00:50, le crédit de la clé API s'est épuisé de nouveau. Les 7 lots P1 du Mac ont été récupérés (68 fichiers des worktrees `~/sim-p1-*`), puis intégrés et terminés dans le cloud.
- **Les worktrees `~/sim-p1-*` du Mac ne servent plus.** Tout est sur `main` : ne les publie pas depuis le Mac.
- Les `id` de physique suivent la liste des canevas (`ph-…`). Ce sont toutes des pages neuves, publiées sous ces noms seulement :
  - avant-bras-biceps → ph-biceps-avant-bras
  - moment-inertie-alpha → ph-rotation-sigma-m
  - patineuse-moment-cinetique → ph-patineuse
  - perfusion-pression → ph-perfusion-posture
  - reynolds-laminaire-turbulent → ph-reynolds
  - miroirs-spheriques → ph-miroir-spherique
  - loi-ampere → ph-loi-ampere
  - barre-rails-induction → ph-rails-induction
  - transferts-thermiques → ph-transferts-thermiques
  - dilatation-thermique → ph-dilatation
  - cycles-moteur-frigo-pac → ph-machine-thermique
  - detente-irreversible → ph-detente-irreversible

## Ce qui est en ligne

| Heure | Commit | Contenu |
|---|---|---|
| 01:01 | 4255965 | P1 : 26 nouvelles simulations et 4 pages refaites |
| 01:37 et 01:54 | 4dc980a, 8159b1b | P1 : corrections de la relecture et du vérificateur |
| 04:39 | 960a80e | P2 : 32 de physique et 28 de chimie |
| 05:01 | 4f22d2e | P2 : étiquettes corrigées sur 17 simulations |
| 05:44 | 02116e1 | P2 : 16 simulations (ondes, optique, thermo, radioprotection, cinétique, organique) |
| 06:10 | 36216c0 | P2 : nucléaire, mesures, polyosides, électrophorèse, Ramachandran |
| 06:10 | e2e572e | Retrait de 5 pages de test `_tmp-…` publiées par erreur 4 minutes plus tôt (`.gitignore` ajouté) |
| 06:40 | 71dc3cf | P3 : 13 simulations |
| 06:56 | 3fb09a2 | P3 : 5 simulations d'organique |
| 07:50 | 31640cb | P3 : 17 dernières simulations |

Le titre du commit 36216c0 dit « P2 terminé », mais il manque encore le lot CE (5 simulations, voir plus bas).

### Physique BA1 : 87 nouvelles pages
- **Mécanique et fluides**
  - ph-lancer-vertical, ph-aller-retour, ph-traversee-riviere, ph-looping, ph-virage-voiture
  - ph-airbag-impulsion, ph-puissance-corps, ph-bilan-travaux, ph-diagramme-energie
  - ph-biceps-avant-bras, ph-leviers-corps, ph-poutre-deux-appuis, ph-apesanteur
  - ph-puits-gravitation, ph-champ-g-interieur, ph-rotation-sigma-m, ph-patineuse
  - ph-pression-profondeur, ph-perfusion-posture, ph-reynolds, ph-vidange-torricelli, ph-reseau-vasculaire
- **Électricité et magnétisme**
  - el-champ-distributions, el-dipole-couple, el-dipole-loin, el-gauss-flux-ferme, el-flux-surface-plane, el-gauss-distributions
  - el-influence-totale, el-energie-assemblage, el-pouvoir-pointes
  - el-condensateur-dielectrique, el-polarisation-milieu, el-interface-dielectrique
  - el-conduction-drude, el-resistance-tranches, ph-condensateur-plan, ph-cage-faraday
  - ph-generateur-reel, ph-courant-corps
  - ph-loi-ampere, ph-rails-induction, ph-spectrometre-masse, ph-lorentz-helice, ph-irm-principe
  - ph-alternateur-3d, ph-foucault, ph-auto-induction
- **Ondes et optique**
  - ph-son-onde-pression, ph-echographie, ph-doppler-sanguin, ph-corde-jonction, ph-timbre
  - ph-miroir-spherique, ph-arc-en-ciel, ph-profondeur-apparente, ph-astigmatisme, ph-lunette-appareil-photo
- **Thermodynamique**
  - ph-transferts-thermiques, ph-dilatation, ph-machine-thermique, ph-detente-irreversible
  - ph-glace-vapeur, ph-zero-absolu, ph-respiration-boyle
- **Nucléaire**
  - ph-radioprotection, ph-fission-chaine, ph-noyau-forces
- **Outils**
  - ph-puissances-de-dix, ph-justesse-fidelite, ph-conversions-cube
- **Pages refaites**
  - pascal, regle-main-droite, rotation-roulement, diagramme-pv

### Chimie BA1 (générale et organique) : 57 nouvelles simulations

Elles sont réparties dans les fichiers `sims-p1chimie`, `sims-p1orga1`, `sims-p1orga2`, `sims-p2ca` à `sims-p2of` et `sims-p3ca` à `sims-p3ob`.
- **Atome et liaison**
  - ch-orbitales-3d, ch-de-broglie, ch-spectres-continu-raies, ch-ionisations-successives
  - ch-echelle-atome, ch-charge-effective
  - ch-puits-liaison, ch-hybridation-3d, ch-sigma-pi-3d, ch-trois-liaisons
  - ch-london-dipoles, ch-eau-ponts-h-3d, ch-solubilite-alcools
- **Gaz et solutions**
  - ch-gaz-reel, ch-dilutions-cascade
- **Thermochimie et équilibre**
  - ch-reaction-piston, ch-bombe-calorimetrique, ch-entropie-microetats, ch-exo-endo-mains
  - ch-entropie-univers, ch-minimum-g, ch-equilibre-dynamique, ch-kirchhoff
- **Cinétique, acides et bases, redox**
  - ch-vitesse-tangente, ch-collisions-3d, ch-enzyme-site-actif, ch-catalyse-heterogene
  - ch-autoprotolyse, ch-transfert-proton
  - ch-pile-daniell-zoom, ch-electrode-hydrogene
- **Organique**
  - Tous les `org-…` des canevas P1, P2 et P3 (33 simulations).
  - Exemples : halogénation, tension de cycle, polarimètre, alcynes, SEAr, aldolisation, glucose, E2, ozonolyse, bromonium, magnésien, SNAr, réducteurs, polyosides, Ramachandran.

## Pas encore en ligne

- **P2-CE (5 simulations de chimie)** : ch-force-acide-structure, ch-tampon-sang, ch-corrosion-goutte, ch-regle-gamma-ph, ch-especes-reactives-oxygene. Elles sont faites et en relecture scientifique ; il reste la vérification puis la publication.
- **Physique quantique (45 visuels)** : nouveau cours `universite/quantique/`, avec seulement des simulations, sans exercices ni théorie. La structure (15 chapitres) et le lot Q1 sont en construction :
  - le lot Q1 compte 6 simulations : fentes d'Young, effet photoélectrique, effet tunnel, boîte quantique, orbitales de l'hydrogène, Stern-Gerlach ;
  - il en reste 39 à faire.

## Valeurs par défaut changées : reels à refilmer

- `rotation-roulement` : vue 3D, et la course part toute seule en boucle (avant, il fallait cliquer).
- `pascal` : page entièrement nouvelle, avec pompage automatique ; F₁ = 100 N, r₁ = 1 cm, r₂ = 15 cm (avant : 20 N, 5 cm, 15 cm).
- `diagramme-pv` : la transformation tourne en boucle ; « Rejouer » devient « Arrêter l'animation ».
- `regle-main-droite` : vecteurs non unitaires (|a| = 2, |b| = 1,5, |a × b| = 2,82) ; nouvelle main en 3D.

Toutes les autres simulations sont nouvelles : aucune vidéo existante n'est touchée. Pour un reel futur sur la pile Daniell, l'électrode à hydrogène, le transfert de proton ou l'astigmatisme, filme la version actuelle : elle a changé pendant la nuit, avant même d'être filmée.

## Décisions prises sans toi (à valider)

1. **Publier par paquets** : chaque paquet était relu (science) et testé. Pour le premier paquet de P2, une partie des retouches d'affichage a été publiée 20 minutes après.
2. **Chapitres choisis là où il manquait un chapitre** (pas de chapitre « Amines » ni « Glucides ») : les amines vont dans L12 ou L18, les polyosides dans L16.
3. **Titre de ch-minimum-g** : « … pourquoi la réaction n'est pas totale » plutôt que « s'arrête », parce qu'à l'équilibre la réaction continue.
4. **Astigmatisme** : les angles suivent la convention TABO (vue de l'ophtalmologiste), comme les ordonnances.
5. **ph-courant-corps** : la courbe de fibrillation a été corrigée (500 mA jusqu'à 100 ms, 400 mA à 200 ms, 30 mA à 1 s). Avant, un courant coupé par le différentiel pouvait s'afficher « fibrillation ».
6. **Modification de `kit/test_sims.py`** : avec `--only _tmp-<id>`, le script teste maintenant aussi les dossiers de test. Rien d'autre n'a changé dans le kit.

## Doutes et choses à vérifier par toi

- **SSD T7** : la surveillance du Mac avait signalé une « suppression irréversible » par l'agent p1-chimie (avant ma reprise). Les fichiers suivis par git sont intacts. Le dossier « sfa videos » du T7 porte une date de modification du 25/11 à 23:22. **Vérifie qu'il n'y manque rien.** De mon côté, je n'ai rien écrit sur le T7.
- **Vérification en ligne** : depuis le cloud, je ne peux pas ouvrir github.io (le proxy le bloque). Ouvre deux ou trois nouvelles pages pour confirmer qu'elles s'affichent, par exemple `universite/physique/ph-patineuse/` et `universite/chimie/org-bromonium-3d/`.
- **Lycée** : l'audit `audit/lycee-programme.md` attend ton choix pour les chapitres « à déplacer » (règle 4 : pas de changement d'URL).
- **three.js par CDN** : `ascenseur`, `tourniquet`, `moment_de_force` et `forces-magn-tique-sur-fils-` le chargent encore, contre la règle 8. Les tests automatiques ne peuvent pas les ouvrir.
- **Valeurs « de mémoire » signalées par les agents**, à confirmer si tu veux être sûr :
  - seuils de coupure du différentiel ;
  - pKa des acides forts ;
  - quelques Ea de modèles (SNAr, catalyse) ;
  - spectres d'instruments « inventés » dans ph-timbre (annoncés comme tels).
