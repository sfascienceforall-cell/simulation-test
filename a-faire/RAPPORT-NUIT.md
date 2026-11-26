# Rapport de nuit : 25-26/11/2026

Le chef des simulations travaille seul pendant la nuit, sur la demande d'Enzo :
il vérifie chaque lot, publie ceux qui passent les contrôles, puis enchaîne P1 → P2 → P3 → physique quantique.
Pour le lycée, rien n'est supprimé : il n'y a que des propositions.

## Incident

- 26/11 : les 8 agents se sont arrêtés en cours de route (crédit API épuisé). Le travail fait est resté dans les worktrees (`git status` vérifié pour chaque lot). Après la recharge, chaque agent a repris là où il s'était arrêté, avec son contexte.

## Reprise dans le cloud (26/11, 01:00)

Le crédit de la clé API est de nouveau épuisé vers 00:50. Enzo a demandé que tout continue avec les agents de la session Claude (cloud).
Le travail des 7 lots P1 a été récupéré des worktrees du Mac (68 fichiers), puis intégré sur main dans le cloud.
Les `id` de physique suivent la liste des canevas : `avant-bras-biceps` → `ph-biceps-avant-bras`, `moment-inertie-alpha` → `ph-rotation-sigma-m`,
`patineuse-moment-cinetique` → `ph-patineuse`, `perfusion-pression` → `ph-perfusion-posture`, `reynolds-laminaire-turbulent` → `ph-reynolds`,
`miroirs-spheriques` → `ph-miroir-spherique`, `loi-ampere` → `ph-loi-ampere`, `barre-rails-induction` → `ph-rails-induction`,
`transferts-thermiques` → `ph-transferts-thermiques`, `dilatation-thermique` → `ph-dilatation`, `cycles-moteur-frigo-pac` → `ph-machine-thermique`,
`detente-irreversible` → `ph-detente-irreversible` (rien n'avait été publié sous les anciens noms).
**Les worktrees `~/sim-p1-*` du Mac ne sont plus utiles** : ne les publie pas depuis le Mac (tout est sur main).

## Vague P1 (26 simulations + 4 pages refaites)

**Publié le 26/11 vers 02:00** (commits 4255965, 4dc980a, 8159b1b) : les 26 nouvelles simulations et les 4 pages refaites.
- Relecture scientifique : 16 pages de physique (11 OK, 6 erreurs de texte corrigées) et 14 de chimie (4 erreurs corrigées : NO₂ dans le nitrobenzène, de Broglie 3·10³², furanose, diazépam). Aucun calcul faux.
- Vérification : 24 acceptées, 6 refusées puis corrigées (étiquettes qui se chevauchaient : biceps, ΣM = Iα, entropie, tension de cycle, polarimètre ; perfusion qui restait blanche si le canevas démarrait à 0 px).
- Tests : chimie 78 pages, 0 erreur ; physique, 0 erreur sur les pages touchées.

## Décisions prises sans Enzo

- `a-faire/CONSIGNE-NUIT.md` et la liste `a-faire/canevas/` sont arrivés sur main pendant la nuit (autre session). Les `id` des nouvelles simulations suivent cette liste (`ph-…`, `ch-…`, `org-…`), même si les agents de P1 avaient d'abord pris d'autres noms : rien n'était encore publié.
- Les 7 lots de P1 tournaient déjà en parallèle avant la consigne « 4 lots au plus » ; pour P2, P3 et la quantique, 4 lots au plus.
- Lycée : en 3e, la carte affiche « Collège · 3e » ; dans le menu « Cours », les niveaux sont abrégés en 3e / 2de / 1re / Tle (faute de place).
- Lycée : l'alcootest (`chimie/6e`) garde la limite belge de 0,22 mg/L, présentée comme telle (« en Belgique »). La limite française de 0,25 mg/L changerait la valeur par défaut, donc les vidéos.

## Propositions pour le lycée (rien n'est supprimé)

L'audit complet est dans `audit/lycee-programme.md`. Sur les 160 chapitres : 88 à garder, 52 à déplacer d'un niveau, 20 hors programme français.
- Le site n'a **aucune géologie en SVT**, alors que les géosciences sont au programme à tous les niveaux.
- Physique de Terminale : 6 chapitres hors programme (magnétisme, induction, alternatif, oscillations…). Il manque la thermodynamique, le mouvement dans un champ, le circuit RC et l'effet photoélectrique.
- Maths : Seconde et Première suivent le nouveau programme (BO du 2/4/2026). Le second degré et la trigonométrie passent en Première ; les limites passent en Terminale.
- Un chapitre « à déplacer » ne peut pas changer de `ch` ni d'URL (règle 4). Deux possibilités : le garder comme « pour aller plus loin », ou faire une nouvelle simulation au bon niveau. **C'est à Enzo de choisir.**
- Tant que l'audit n'est pas traité, les introductions des cours disent « programme de l'Éducation nationale » alors que le contenu reste en grande partie celui de la FWB.

## Valeurs par défaut changées et reels à refilmer

En ligne depuis le 26/11 :
- `rotation-roulement` : vue 3D, la course part toute seule et recommence en boucle (avant : il fallait cliquer). Toute vidéo est à refaire.
- `pascal` : page entièrement nouvelle, avec le pompage automatique. Valeurs par défaut prévues : F₁ = 100 N, r₁ = 1 cm, r₂ = 15 cm (avant : 20 N, 5 cm, 15 cm). Toute vidéo est à refaire.
- `diagramme-pv` : la transformation tourne en boucle, et le bouton « Rejouer » devient « Arrêter l'animation ». Les valeurs par défaut restent les mêmes. Toute vidéo est à refaire.
- `regle-main-droite` : les vecteurs ne sont plus unitaires (|a| = 2, |b| = 1,5, |a × b| = 2,82 au lieu de 0,94) ; nouvelle main en 3D sans three.js. Toute vidéo est à refaire.

## Doutes à trancher par Enzo

- `analyse-dimensionnelle` (physique BA1) : le test signale « pas de canevas », déjà sur main avant cette nuit. Je n'y ai pas touché.
- Les références `ascenseur`, `tourniquet` et `moment_de_force` chargent three.js par CDN, ce qui va contre la règle 8 dans sa forme actuelle. Il faudra les réécrire un jour.
- `kit/check-course.py` et `kit/thumbs.py` cherchent `/usr/bin/google-chrome`, qui n'existe pas sur le Mac, et PIL n'est pas installé. Les agents ont utilisé des copies hors dépôt avec le Chromium de Playwright, sans modifier `kit/`.
- La surveillance a signalé une « suppression irréversible » par l'agent p1-chimie. Les fichiers suivis par git sont intacts dans les 7 lots. Sur le T7, le dossier « sfa videos » porte une date de modification du 25/11 à 23:22, que je ne peux pas attribuer à un lot. Vérifie-le si quelque chose y manque.
