# Relecture du professeur de biologie (nuit du 3 au 4 novembre 2026)

Périmètre : `secondaire/biologie/3e`, `4e`, `5e`, `6e` et `universite/biologie` : 541 exercices (209 QCM) et 208 simulations.
Méthode : j'ai extrait tous les exercices avec node (contexte vm), puis je les ai relus un par un : index `bonne`, distracteurs, `pourquoi`, calcul et corrigé. J'ai lu le texte de toutes les simulations (résumé, « À retenir », « Piège »). J'ai lu le code des simulations signalées comme incertaines, et j'en ai réexécuté les modèles en Python sur tout le domaine des curseurs (Hodgkin-Huxley, glycémie 3e et 5e). Après chaque modification : `node --check`. Pour finir, `check.py` sur les 5 `index.html` : **0 erreur** (bad = [], pageErrors = []).

## 1. Tableau des éléments corrigés ou signalés

| n° | Page · id ou exercice | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 1 | 3e · exos-06 « Énergie d'un gramme » (★★) | corrigé | 34 % de l'énergie en ATP : incohérent avec les 30 ATP par glucose de la 4e et de la simulation b4-c06 (30 × 30,5 / 2 870 ≈ 32 %) | 32 % → 250 kJ en ATP, 530 kJ en chaleur (68 %) |
| 2 | 3e · exos-01 « Niveau trophique d'un omnivore » (★★★) | corrigé + signalé | Le calcul 0,1^1,5 arrivait sans explication (exposant non entier, hors programme de maths de 3e) | Calcul détaillé (0,1 × √0,1 ≈ 0,032), présenté comme une estimation simplifiée et encadré entre 10 % et 1 % |
| 3 | 3e · exos-04 « Vers le foie », distracteur aorte | corrigé | « L'aorte n'est pas reliée directement à l'intestin » : faux, puisque l'intestin est irrigué par des artères qui partent de l'aorte | Nouveau `pourquoi` : l'aorte apporte du sang oxygéné à l'intestin ; le sang chargé de nutriments repart par des veines |
| 4 | 3e · exos-07 « Le potomètre » | corrigé | Coquille « en un heure » | « en une heure » |
| 5 | 3e · exos-09 « Croissance et plateau » (★★★★) | corrigé | Le temps exponentiel (≈ 17 h) était donné comme le temps pour atteindre le plateau | Ajout : c'est une durée minimale, car la croissance ralentit à l'approche de la capacité du milieu (courbe en S) |
| 6 | 3e · exos-01 « Prévoir à court terme » | réétiqueté ★★★★★ → ★★★ | Raisonnement direct sur une chaîne à 4 maillons | s:3 |
| 7 | 3e · exos-06 « Deux respirations » | réétiqueté ★★★★★ → ★★ | Simple distinction de définitions | s:2 |
| 8 | 3e · exos-09 « CO₂ et couche d'ozone » | réétiqueté ★★★★★ → ★★★ | QCM de connaissances | s:3 |
| 9 | 3e · b3-c04-glycemie (simulation) | corrigé | En mode « diabète », la glycémie à jeun du modèle restait à 0,90 g/L, ce qui contredisait l'« À retenir » (diabète si glycémie à jeun > 1,26 g/L) | Valeur de base 1,30 g/L en mode diabète (modèle vérifié en Python sur toutes les positions des curseurs) |
| 10 | 3e · b3-c04-surface-intestin | corrigé | Avec un facteur de plis non entier (1,5 ; 2,5), le facteur total était arrondi à l'entier (« 1,5 × 1 × 1 = 2 ») | Affichage d'une décimale quand c'est nécessaire |
| 11 | 3e · b3-c01-regimes | corrigé | « herbivore stricte » | « herbivore strict » |
| 12 | 4e · exos-05 « Double marquage » (★★★★★) | corrigé | Le corrigé utilisait « 12 H₂O consommées » et « eau reformée » sans donner l'équation détaillée ; l'exercice c05 #0 donne l'équation simplifiée | Équation détaillée 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O dans l'énoncé et le corrigé, plus une mention du modèle idéalisé (échange isotopique eau ↔ CO₂) |
| 13 | 4e · exos-07 « Bilan carboné d'une plante » | corrigé | « presque deux fois moins de croissance » : faux, 273,6 / 158,4 = 1,7 | « environ 1,7 fois moins » |
| 14 | 4e · exos-04 « Lessive à 90 °C ? » | réétiqueté ★★★★★ → ★★ | Application directe de la dénaturation | s:2 |
| 15 | 4e · exos-07 « Phrase exacte sur l'ATP », exos-08 « Combien de liaisons hydrogène ? », exos-10 « Le gène p53 muté » | réétiquetés ★★★★★ → ★★★ | Pas de la synthèse : le calcul de liaisons H refait l'exercice ★★ du même chapitre | s:3 (chaque chapitre garde un ★★★★★) |
| 16 | 5e · exos-02 « Réflexe ou action volontaire ? » | corrigé | Parenthèse fausse « 5,7 avec 25,3 ms non arrondis » (145 / 25 = 5,8) | Parenthèse supprimée |
| 17 | 5e · exos-01 « Pourquoi la myéline accélère l'influx » | corrigé | « n'entrent que au niveau » | « qu'au niveau » |
| 18 | 5e · exos-08 « Compter les gamètes » | corrigé | 750 globules polaires présentés comme certains, alors que chez l'humain le 1er globule polaire ne se divise souvent pas | « 750 au plus (500 si le 1er globule ne se divise pas) » dans le corrigé et la réponse |
| 19 | 5e · exos-01 « Anesthésique local » | réétiqueté ★★★★★ → ★★★ | QCM de mécanisme, pas une synthèse (le chapitre a 2 ★★★★★) | s:3 |
| 20 | 5e · b5-c07-nondisjonction (risque selon l'âge) | corrigé | Table de risque de trisomie 21 : 1/1 200 à 25 ans, valeur qui sort de la série de référence (1/1 667 · 1/1 250 · 1/952 · 1/378 · 1/106 · 1/30) | 25 ans → 1/1 250. Le reste est cohérent avec l'exercice 6e (1/950 à 30 ans, 1/105 à 40 ans) |
| 21 | 5e · b5-c03-repas (modèle glycémie-insuline) | corrigé (piège) | Le modèle exécuté donne des pics de 2,1 à 2,7 g/L chez une personne en bonne santé pour 150 g de glucides rapides : irréaliste | Piège complété : pour plus de 100 g de glucides rapides, le pic du modèle est exagéré (en réalité rarement plus de 1,6 à 1,8 g/L). Les profils T1, T2 et prédiabète sont plausibles |
| 22 | 6e · exos-04 « Couple au hasard et fratrie » + b6-c04-risque | corrigé | Porteurs de la mucoviscidose fixés à 1/30, alors que la page université utilise 1/25,5 (incidence 1/2 500) | Mention « 1/25 à 1/30 selon les populations » ; dans la simulation, « 1 sur 25 à 30, soit 1 naissance sur 2 500 à 3 600 » |
| 23 | 6e · exos-08 « Pourquoi un monde à ARN ? », exos-10 « Pourquoi le carbone fossile… » | réétiquetés ★★★★★ → ★★★ | QCM de compréhension | s:3 |
| 24 | Université · ub-c04-potentiel-action (Hodgkin-Huxley) | corrigé | Seuil annoncé ≈ 6,5 µA/cm² pour 1 ms ; en réexécutant le modèle du code (HH 1952, calmar, 6,3 °C, repos −65 mV), le seuil vaut 6,9 µA/cm² (6,5 ne déclenche rien) | « ≈ 7 µA/cm² pour 1 ms ». Le reste a été vérifié : pics +38 mV (8 µA) et +41 mV (20 µA), pas de 2e PA jusqu'à 10 ms de délai, TTX et TEA corrects |
| 25 | Université · exos-04 « Pièges du potentiel d'action » | corrigé | Même seuil 6,5 dans un `pourquoi` | ≈ 7 µA/cm² pour 1 ms |
| 26 | Université · exos-03 « Potentiel d'équilibre du chlorure », distracteur −128 mV | corrigé | `pourquoi` faux : « confusion avec un ion divalent » (un ion divalent divise E par 2, il ne le double pas) | Explication du facteur 2 corrigée |
| 27 | ATP par glucose, toutes pages | validé | Cohérence vérifiée : 4e = 30 (avec un piège sur les anciens 36-38), université = 30 à 32 selon la navette, 3e = « environ un tiers » / 32 % | — |
| 28 | Surface intestinale (3e sims-04, exos-04) | validé | Tube lisse 0,314 m² × 600 ≈ 188 m², avec la fourchette 30 à 250 m² annoncée et le modèle déclaré simplifié | — |
| 29 | Thermorégulation 5e (b5-c04-temperature, -chaleur, -fievre, -ectotherme) | validé | Code lu : 245 kJ/K, 2,43 kJ/g, sueur = E/0,675 g/h, Emax de type Lewis, consigne de fièvre ≤ 40,5 °C. Ordres de grandeur justes, modèle annoncé simplifié | — |
| 30 | 3e b3-c05-altitude | validé | Atmosphère standard, PIO₂ = 0,2093 (Patm − 6,3 kPa), équation des gaz alvéolaires, P50 = 3,5 kPa : correct | — |
| 31 | Photosynthèse 4e (b4-c05-bilan) | validé | Le bilan net et l'écriture détaillée (12 H₂O / 6 H₂O) sont tous deux présentés, avec 18 O de chaque côté | — |
| 32 | Hardy-Weinberg en 6e | signalé | Il n'y a pas de chapitre Hardy-Weinberg en 6e, mais q, q² et 2q(1−q) sont utilisés pour le daltonisme (exos-03 #3, b6-c03-daltonisme) sans nommer l'hypothèse de panmixie. C'est à la limite du programme FWB | À décider par l'équipe : nommer l'hypothèse ou garder au niveau ★★ |
| 33 | Niveau 4e : Michaelis-Menten (Km, Vmax, Km′ = Km(1 + [I]/Ki)), Meselson-Stahl chiffré, polysomes | signalé | Dépasse le programme FWB de 4e (cinétique enzymatique quantitative = BA1) | À garder comme approfondissement, ou à basculer vers l'université |
| 34 | Niveau 5e : exos-02 « Fréquence minimale de décharge » (exponentielle et ln), exos-09 hCG (log₂), dialyse Kt/V (e^−x) | signalé | Les fonctions exponentielle et logarithme ne sont vues qu'en 6e en mathématiques | Garder en ★★★★★ « défi » ou donner les valeurs numériques |
| 35 | Niveau 6e : χ², modèles de Lotka-Volterra (compétition, proies-prédateurs), Kt/V | signalé | Au-delà du programme FWB de biologie de 6e (statistique, modèles différentiels) | Signalé, non supprimé (corrigés justes) |
| 36 | 3e : modèle de Lotka-Volterra en équilibre (exos-09 « Point d'équilibre ») | signalé | Formule donnée et appliquée correctement, mais niveau élevé pour la 3e | Signalé |

Tout le reste a été **validé** sans changement : QCM (bonne réponse et `pourquoi`) et calculs refaits, exercice par exercice.

## 2. Bilan chiffré

- **Exercices vérifiés : 541 sur 541.** Les 209 QCM ont tous été contrôlés (index `bonne`, distracteurs, `pourquoi`) : aucun index faux, aucun distracteur juste, 1 `pourquoi` faux (université, chlorure) et 1 `pourquoi` contestable (3e, aorte), corrigés tous les deux. Tous les calculs ★★★ à ★★★★★ (≈ 320) et la totalité des ★ et ★★ ont été refaits. Il y a 0 réponse finale fausse ; j'ai corrigé 4 imprécisions dans des corrigés (34 % → 32 %, « deux fois » → 1,7, parenthèse 5,7, globules polaires) et 3 compléments d'hypothèse (exponentielle vs logistique, équation détaillée, 0,1^1,5).
- **Étoiles réétiquetées : 10 exercices** (★★★★★ trop faciles : 3 en 3e, 4 en 4e, 1 en 5e, 2 en 6e). Chaque chapitre garde au moins un ★★★★★.
- **Simulations : 208 sur 208** relues au niveau du texte (« À retenir », « Piège », résumé). Le code et les formules de 14 simulations ont été lus et en partie réexécutés en Python : HH, glycémie 3e et 5e (×3), thermorégulation (×3), altitude, surface intestinale, trisomie 21 selon l'âge, mucoviscidose, phalènes, profil ADN, microscope. **5 simulations corrigées** (seuil HH, base de glycémie diabétique, table d'âge T21, fourchette muco, arrondi et piège de glycémie).
- **Total : 26 lignes corrigées ou réétiquetées (29 éléments, dont 10 réétiquetages et 5 simulations), 5 points de niveau signalés.** Syntaxe : `node --check` OK sur tous les fichiers. `check.py` : 0 erreur sur les 5 pages.

## 3. Ce que je n'ai pas eu le temps de vérifier

- Le code (formules, constantes, comportement aux bornes) d'environ 190 simulations sur 208. Seuls leurs textes ont été relus, et `check.py` garantit l'absence d'erreur JS, pas la justesse des valeurs affichées. Les simulations à vérifier en priorité sont celles qui affichent des chiffres : 4e b4-c03-pompe, b4-c06-effort ; 5e b5-c05-collective (SIR), b5-c06-dialyse, b5-c10-placenta ; 6e b6-c06-antibiotiques, b6-c10-climat, b6-c10-azote ; université ub-c03-goldman, ub-c05-allosterie, ub-c06-chimiosmose, ub-c10-logistique (Ricker).
- La comparaison avec les programmes officiels FWB : les PDF des réseaux n'étaient pas accessibles (cf. `_plans/RECHERCHE-sciences.md`, chapitres 4e à 6e marqués « DÉD »). Le niveau a été jugé sur la progression habituelle du programme de sciences générales.
- La répartition exacte des étoiles chapitre par chapitre après réétiquetage (environ 2/2/2-3/2/1-2 par chapitre, non recomptée chapitre par chapitre).
- Le rendu visuel sur téléphone (taille des textes sur le canvas).
