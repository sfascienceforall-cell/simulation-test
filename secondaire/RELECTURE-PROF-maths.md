# Relecture du professeur de mathématiques : maths 3e, 4e, 5e, 6e

Nuit du 4 novembre 2026. Périmètre : `maths/3e`, `maths/4e`, `maths/5e`, `maths/6e`.
Hors périmètre, laissé au professeur de statistique : `4e/exos-10.js`, et en 6e `sims-07..10.js` et `exos-07..10.js`. Le fichier `4e/sims-10.js` est dans mon périmètre (la consigne n'exclut que `exos-10.js` en 4e) : je l'ai relu.

## Méthode

- **Exercices** : extraction de tous les exercices avec node (contexte `vm`) et lecture de chacun : énoncé, choix, `bonne`, `pourquoi`, corrigé, réponse.
  - Un script vérifie la structure de chaque QCM : `bonne` dans les bornes, un `pourquoi` pour chaque distracteur et aucun sur la bonne réponse, pas de choix en double. Résultat : 0 anomalie.
  - Les calculs non entiers (trigonométrie, intérêts, tableau d'amortissement, optimisation, logarithmes, loi des sinus et des cosinus, produit scalaire, Kirchhoff, etc.) ont été refaits en Python. Les calculs exacts (algèbre, factorisations) ont été refaits à la main.
- **Simulations** :
  - lecture de tous les « But », « À retenir » et « Piège », puis de toutes les lignes de calcul (`ro.set`, `Math.*`) ;
  - banc d'essai node (kit simulé) : chaque curseur est poussé à ses bornes, chaque option est essayée, avec 300 combinaisons aléatoires par simulation, et chaque bouton est pressé. Le banc relève les exceptions, NaN et Infinity, et vérifie qu'un tiret « — » affiché est toujours accompagné d'une note d'avertissement.
- **Contrôles finaux** : `node --check` sur chaque fichier modifié, puis `check.py` sur les 4 index.html : `bad: []` et `pageErrors: []` pour les quatre pages.

## Tableau des éléments

### Corrigés

| n° | Page · élément | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 1 | 6e · c04 ex. 6 « Valeur moyenne » (QCM) | corrigé | Le distracteur « 1 » ne correspondait à aucune erreur (son `pourquoi` disait « Rien ne justifie 1 »). La règle du GUIDE exige une erreur typique. | Il est remplacé par « √3 ≈ 1,73 » : c'est l'abscisse où la valeur moyenne est atteinte, une confusion réelle. Nouveau `pourquoi` écrit. |
| 2 | 6e · c01 ex. 7 « Quand le capital double-t-il ? » (QCM) | corrigé | Le distracteur « 15 ans » ne correspondait à aucune erreur (« Aucun calcul ne mène à 15 »). | Il est remplacé par « 57 ans » (2 ÷ 0,035, erreur typique quand on n'utilise pas le logarithme), avec son explication. |
| 3 | 6e · c02 ex. 5 « Croissances comparées » (QCM) | corrigé | Le distracteur « 1 » n'avait aucun sens (« Aucune raison d'obtenir 1 »). | Il est remplacé par « La limite n'existe pas » (confusion entre forme indéterminée et absence de limite), avec son explication. |
| 4 | 4e · c03 ex. 8 « Le ballon retombe quand ? » (QCM) | corrigé | Le `pourquoi` du choix 2,1 s était confus : il disait « 4,1 est la durée totale de vol, pas la moitié ». | Nouvelle explication : 4,1 ÷ 2 ≈ 2,1 s est à peu près l'instant du sommet, pas celui où le ballon touche le sol. |
| 5 | 4e · c01 ex. 5 « Domaine et zéro » (QCM) | corrigé | Le `pourquoi` du choix « zéro en x = −2 » n'expliquait pas l'erreur. | Nouvelle explication : l'élève a résolu x + 4 = 2 sans élever au carré. |
| 6 | 4e · `m4-c10-classes` (simulation) | corrigé | L'affichage « Classe la plus fréquente » donnait en fait la classe de plus grande densité. Avec des classes inégales, ce n'est pas la classe d'effectif maximal : c'était justement le piège visé, mais avec la mauvaise étiquette. | L'étiquette et la note deviennent « Classe modale (la plus dense) ». |
| 7 | 4e · `m4-c09-ellipse` et c09 ex. 10 « Une ellipse de jardinier » | corrigé (niveau) | Les coniques ne figurent pas au programme de 4e : elles relèvent du 6e, option 6 h. Le contenu dépassait l'année visée sans être signalé. | La simulation et l'exercice sont gardés, avec la mention « Prolongement » : étiquette `tag`, phrase dans le résumé et en tête de l'énoncé. |
| 8 | 5e · c09 ex. 7 « Un hexagone régulier dans le cube » | corrigé (niveau) | La justification utilise l'équation d'un plan de l'espace, matière de 6e. | Mention « Prolongement » ajoutée en tête de l'énoncé. |

### Signalés, sans modification

| n° | Page · élément | Statut | Ce qui pose question | Correction |
|---|---|---|---|---|
| 9 | 4e · chapitre 7 (loi des sinus et des cosinus, cas ambigu) | signalé | Ce chapitre est placé en 4e, ce qui est conforme au programme WBE 39/2000/240 (« triangles quelconques » au 2e degré). Certains réseaux le font en 5e. | À valider avec le réseau de l'école. Les contenus sont justes : cas ambigu h < a < b → deux triangles, vérifié. |
| 10 | 4e · chapitre 6 (radians, cercle trigonométrique) | signalé | Conforme au WBE 4e. D'autres programmes placent les fonctions trigonométriques en 5e. | Aucune. |
| 11 | 4e · c10 (sims) : méthode des quartiles | validé + signalé | Méthode « médiane des deux moitiés, médiane exclue si n impair ». Elle est cohérente entre la simulation (`quart()`) et la note affichée. Elle est aussi cohérente avec l'exercice 4 de `exos-10.js`, simplement constaté : la relecture de ce fichier revient au professeur de statistique. | Aucune. D'autres définitions existent (rang n/4) : le texte le dit déjà. |
| 12 | 4e · c10 : écart-type en /n | validé | σ = √(moyenne des carrés des écarts), en /n. C'est la convention du secondaire FWB, annoncée dans « À retenir » et dans l'énoncé du QCM. | Aucune. |
| 13 | 3e · c10 (arctan, arccos) | validé | Calculer un angle avec tan⁻¹ ou cos⁻¹ de la calculatrice fait partie des attendus de 3e (trigonométrie du triangle rectangle). Les deux notations sont données. | Aucune. |
| 14 | 3e · c07 ex. 8 et `m3-c07-construction` (cas CCA) | validé | 8 sin 30° = 4 < 5 < 8 donne bien deux triangles. La simulation compte 0, 1 ou 2 triangles et prend correctement le cas limite a = h. | Aucune. |
| 15 | 5e · `m5-c04-asymptotes` | signalé (mineur) | Quand le numérateur s'annule en p avec a = 0, f est constante (= b) avec un trou. L'affichage « AH : aucune (f constante) » est discutable : y = b est techniquement asymptote horizontale, confondue avec la courbe. | À trancher selon le cours. Pas modifié. |
| 16 | 5e · c06 ex. 4 « Extrema sur un intervalle fermé » (★★) | signalé | La difficulté est plutôt ★★★ : quatre candidats à comparer, piège de la borne. | Pas réétiqueté, pour ne pas casser la répartition exigée de 2 exercices par niveau d'étoile. |
| 17 | 6e · c03 ex. 9 et c05 ex. 9 (« Extension 6 h ») | validé | Les extensions 6 h sont correctement annoncées : intégration par parties, distance point-plan. | Aucune. |

### Validés sans remarque

| n° | Page · élément | Statut | Remarque |
|---|---|---|---|
| 18 | 3e · 102 exercices (dont 30 QCM) | validé | Toutes les réponses sont justes. Les distracteurs ont été recalculés : erreurs typiques cohérentes. Les valeurs trigonométriques (17,2 m ; 6,88 et 9,83 cm ; 95,3 m ; 2 518 m ; 6,8°) ont été vérifiées en Python. |
| 19 | 4e · 90 exercices c01 à c09 (dont 27 QCM) | validé | Loi des sinus et des cosinus (9,43 ; 10,61 ; 13,02 ; 79/94/70 m ; 92,8 m ; 4 137 m² ; 48,0° ; 89,1 m), remorqueurs (6 083 N), avion (206 km/h, 104°, 75,5°, 193,6 km/h) : tout est exact. |
| 20 | 5e · 100 exercices (dont 30 QCM) | validé | Intérêts composés, tableau d'amortissement complet (2 885,91 € ; 1 543,66 €), boîte de conserve (r ≈ 4,30 cm, S ≈ 348,7 cm²), angles du triangle (77,5° ; 54,2° ; 48,4°), travail (1 638 J) : tout est exact. |
| 21 | 6e · 61 exercices c01 à c06 (dont 19 QCM) | validé, sauf n° 1 à 3 | Logarithmes, refroidissement (k ≈ 0,0847 min⁻¹ ; 31,1 min), primitives, intégrales, volumes, droites et plans, Gauss, Kirchhoff (30/11, 18/11, 12/11 A) : tout est exact. |
| 22 | 3e · 40 simulations | validé | Formules justes. Cas limites signalés par une note « warn » : Δx = 0, droite verticale, systèmes parallèles ou confondus, solution négative (poules et lapins). |
| 23 | 4e · 49 simulations | validé, sauf n° 6 et 7 | Trajectoire (« modèle simplifié, sans air » annoncé), distance d'arrêt v·t/3,6 + v²/(25,92·a) exacte (« modèle simplifié » annoncé), loi des sinus et des cosinus, cas ambigu, tangentes √(OP² − R²), ellipse b² = a² − c². |
| 24 | 5e · 40 simulations | validé, sauf n° 15 | Annuité K·t/(1 − (1 + t)⁻ⁿ) (« modèle simplifié, un paiement par an » annoncé), boîte (x = a/6, V = 2a³/27), sauveteur (Snell), battements, sections du cube, droites gauches (distance h vérifiée par produit vectoriel). |
| 25 | 6e · 24 simulations c01 à c06 | validé | Demi-vie, logistique (inflexion en y = K/2, modèle simplifié annoncé), sommes de Riemann, aire entre courbes (9 pour p = −2, q = 0, vérifié), volumes de révolution (πb²/2, π(b/2 − sin 2b/4), πb⁵/80), D(m) = (m − 1)²(m + 1) vérifié. |

## Bilan chiffré

- **Exercices relus : 353** (3e 102, 4e 90, 5e 100, 6e 61), **dont 106 QCM** vérifiés un par un et par script (0 anomalie de structure).
- **Calculs ★★★ à ★★★★★** : tous refaits, environ 30 en Python et les autres à la main. **Aucune réponse finale fausse.**
- **Exercices ★ et ★★** : tous relus. Aucun faux.
- **Étoiles** : répartition conforme (2-2-2-2-2, au moins 3 QCM) dans tous les chapitres. 0 réétiquetage, 1 signalement (n° 16).
- **Simulations relues : 153** (3e 40, 4e 49, 5e 40, 6e 24), avec banc d'essai aux bornes et 300 combinaisons aléatoires chacune : 0 exception, 0 NaN sans avertissement.
- **Éléments corrigés : 8** (5 QCM, 1 simulation, 2 mentions de niveau), **soit 10 modifications** dans 9 fichiers. **Éléments signalés : 6.**
- **check.py** : 0 erreur sur les 4 pages (`bad: []`, `pageErrors: []`).

## Ce que je n'ai pas eu le temps de vérifier

1. **Le rendu visuel des simulations.** Je n'ai pas vérifié, dans un navigateur, les dessins (sens des flèches, étiquettes, échelles des axes, lisibilité sur mobile). J'ai contrôlé les valeurs affichées, pas l'image.
2. **Les interactions au pointeur et les animations.** Le glisser-déposer (`c.pointer`) n'a pas été rejoué. Les boucles `k.loop` n'ont été exécutées que sur un pas.
3. **L'alignement fin avec les programmes FESeC et CPEONS**, dont le dossier de recherche n'a pas lu le texte. Seul le programme WBE a servi de référence pour les signalements de niveau.
4. **Le hors-périmètre** (`4e/exos-10.js` ; `6e/sims-07..10.js` et `exos-07..10.js` : approximation normale, Bayes, TCL), laissé au professeur de statistique.
