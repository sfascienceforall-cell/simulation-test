# Audit du code des simulations · Biologie 5e et 6e secondaire (4 novembre 2026)

Périmètre : `biologie/5e` et `biologie/6e`, 10 fichiers `sims-NN.js` chacun, soit **80 simulations**, toutes lues dans le code.

Méthode :
1. Lecture du code de chaque simulation : formules, constantes, unités, géométrie du dessin (axes, échelles, positions), cohérence avec « À retenir », « Piège », notes et défis.
2. Banc d'essai automatique (`/home/claude/tools/fuzz.js`, hors des dossiers de pages) : exécute `build()` de chaque simulation avec un kit simulé, balaie les curseurs (bornes, bornes ± 1 pas, 150 tirages aléatoires, extrêmes un à un, listes et bascules), clique chaque bouton et fait tourner les boucles. Il signale toute exception, tout « NaN / Infinity / undefined / null » dans les valeurs ou notes, tout argument non fini passé au canvas et tout point, texte ou rectangle dessiné hors du canvas.
3. Recalculs numériques en node : modèle glycémie-insuline (profils, repas, pompe), thermostat, solveur d'arbres généalogiques (3 familles × 4 hypothèses), khi-deux de Mendel (0,47 ; p = 0,925), niches, azote, perturbations, régression d'hominisation.
4. Après chaque modification : `node --check`. Fin : `check.py` sur les deux `index.html`.

Résultat de `check.py` : 5e : 40 sims, 101 exos, `bad = []`, `pageErrors = []` ; 6e : 40 sims, 100 exos, `bad = []`, `pageErrors = []` (**0 erreur**).
Banc d'essai final : 0 problème sur les 80 simulations (les seuls signalements restants étaient un faux positif sur le mot « nulles » et un point hors cadre corrigé depuis).

Les points déjà validés dans `RELECTURE-PROF-biologie.md` (thermorégulation 5e, glycémie 5e après correction du piège, table de risque de trisomie 21) n'ont pas été refaits, sauf pour y brancher les corrections ci-dessous.

Légende : **ok** = aucun défaut trouvé · **corrigé** = modifié · **signalé** = laissé en l'état, à décider.

## 5e secondaire

| id | statut | problème | correction |
|---|---|---|---|
| b5-c01-seuil | ok | Potentiel d'action 110 mV (−70 → +40), seuil 15 mV, fréquence 20 à 220 Hz : cohérents avec texte et dessin | — |
| b5-c01-myeline | corrigé | Temps de trajet de la fibre myélinisée arrondi à l'unité : « 1 ms » pour 0,83 ms (d = 20 µm, L = 0,1 m) | Une décimale sous 10 ms |
| b5-c01-refractaire | signalé | Valeurs justes. Quand le 2e stimulus déclenche un PA en période relative, la courbe saute de quelques mV au début du PA (le modèle ne tient pas compte du creux post-PA pour le seuil). Dessin acceptable | — |
| b5-c01-blocage | corrigé | (1) « Plus de 80 % de la fibre démyélinisée » alors que 80 % bloque déjà. (2) « Zone injectée » dessinée même à dose 0, alors que le texte annonce une fibre saine | (1) « Au moins 80 % ». (2) Zone et étiquette affichées seulement si la dose est > 0 |
| b5-c02-sommation | ok | Fréquence minimale avec 4 synapses = 135 Hz, vérifiée (8/(1−e^(−Δt/10)) ≥ 15 mV) | — |
| b5-c02-arc | ok | Durées 25 ms (réflexe main) vs 165 ms environ (volontaire) cohérentes avec les notes | — |
| b5-c02-drogues | ok | — | — |
| b5-c02-regle | ok | t = √(2d/g) correct, règle de 40 cm cohérente avec le graphe | — |
| b5-c03-repas | corrigé + signalé | (1) Pour 0 g, ou si le pic reste ≤ 1,1 g/L, « Retour sous 1,1 g/L » affichait « −30 min après le début » ou le moment du pic (valeurs absurdes). (2) « Moment du pic » pouvait être négatif. Signalé : dans le modèle, la glycémie repasse sous 1,1 g/L 41 à 52 min après le début du repas (réel : 2 à 3 h) | (1) « pas de dépassement » dans ces cas. (2) « — » si le pic précède le repas. Dynamique non modifiée |
| b5-c03-diabete | corrigé | (1) Le profil « Prédiabète » (40 %, 80 %) donne une glycémie à jeun de 1,08 g/L, verdict « normale » : contredit le nom du profil. (2) Avec 90 % de résistance et 100 % de sécrétion (glycémie à jeun 1,48 g/L, verdict « diabète »), la note disait « glycémie encore proche de la normale ». (3) Pour 1,10 à 1,25 g/L (verdict « anormale »), la note disait « régulation efficace » | (1) Profil prédiabète = 60 % / 70 % (1,18 g/L, « anormale »). (2)(3) Notes réécrites selon la glycémie à jeun : ≥ 1,26 diabète ; 1,10–1,25 anormale ; compensation seulement si encore proche de la normale |
| b5-c03-thermostat | corrigé | (1) Axe vertical trop court : avec une température extérieure de 30 °C la courbe « sans régulation » (35,9 °C) sortait du cadre. (2) Gain nul : « Augmente le gain » sans dire qu'il n'y a pas de régulation. (3) Pièce plus chaude que la consigne, chauffage à 0 % : « correction partielle, augmente le gain » (faux : le chauffage ne peut pas refroidir) | (1) Axe calculé sur toutes les courbes. (2)(3) Deux messages ajoutés |
| b5-c03-pompe | ok | Conformité du défi vérifiée : 100 % dans la cible atteignable (basal 1, 1 U / 17 g, bolus 15 min avant) ; hypoglycémie et hyperglycémie détectées | — |
| b5-c04-temperature | ok | Régimes et continuité vérifiés (déjà validé) | — |
| b5-c04-chaleur | ok | — | — |
| b5-c04-ectotherme | ok | — | — |
| b5-c04-fievre | ok | — | — |
| b5-c05-infection | ok | — | — |
| b5-c05-vaccin | ok | — | — |
| b5-c05-collective | ok | Seuil 1 − 1/R₀, R effectif et SIR corrects ; grille de 400 points cohérente | — |
| b5-c05-vih | ok | Année SIDA = 20/(charge − 2) cohérente avec le tracé | — |
| b5-c06-nephron | ok | 180 L/j, seuil rénal 1,8 g/L pour un DFG de 125 mL/min, urée à l'équilibre : corrects | — |
| b5-c06-adh | signalé | Valeurs justes. Le cas « urine la plus diluée possible (50 mOsm/L) » est inaccessible avec les curseurs (au mieux ≈ 115 mOsm/L, car l'eau absorbée est limitée à 6 L/j) : branche inutilisée | — |
| b5-c06-bandelette | corrigé | (1) Une case « + » (protéines 0,15 à 0,5 g/24 h, leucocytes 10 à 100 /µL) s'affichait avec la note « Bandelette normale ». (2) Densité 1,030 affichée « 1,03 » | (1) Deux hypothèses ajoutées (trace de protéines, quelques leucocytes). (2) Trois décimales fixes |
| b5-c06-dialyse | ok | K = 0,7·Qb, Kt/V = K·t/V, baisse d'urée 1 − e^(−Kt/V) vérifiés | — |
| b5-c07-meiose | ok | Compteurs d'ADN (2C, 4C, 2C, 1C) et dessin des 8 étapes cohérents, crossing-over compris | — |
| b5-c07-brassage | corrigé | « Gamètes 100 % d'une origine » pour n ≥ 7 : 2/2ⁿ arrondi à 2 décimales (« 0,02 des gamètes » pour n = 7 au lieu de 1,56 %) | Pourcentage à 2 décimales jusqu'à n = 10, puis « 1 sur … » |
| b5-c07-crossing | ok | r = ½(1 − e^(−2d/100)) cohérent avec la simulation et le piège | — |
| b5-c07-nondisjonction | corrigé | Risque arrondi à la dizaine : 1 sur 110 à 40 ans alors que la table et l'exercice 6e donnent 106 / 105 | Arrondi à 5 sous 200 (1 sur 105 à 40 ans, 950 à 30 ans) |
| b5-c08-gametes-age | corrigé | « Part d'ovocytes ovulés » = ovulations ÷ ovocytes **restants** : 225 % à 60 ans (impossible). L'exercice 5e parle du stock de **naissance**. À 13 ans : « 0 spermatozoïdes produits en 0 ans » | Part du stock de naissance (0,022 % à 30 ans), avec « n sur 10⁶ ». Message de puberté jusqu'à 13 ans inclus |
| b5-c08-gametogenese | corrigé | Globules polaires comptés 3·n (avec fécondation) et 2·n (sans) alors que le dessin n'en montrait que 2 et 1 | Dessin complété (3 avec fécondation, GP1 divisé) ; sans fécondation, 1 seul GP (n) ; mention « (au plus) » ; cohérent avec le corrigé de l'exercice (750 au plus) |
| b5-c08-puberte | ok | Âges des signes et du pic vérifiés (inverse de la logistique) | — |
| b5-c08-course | ok | 323 spermatozoïdes à l'ampoule avec les valeurs par défaut, compatibles avec « quelques centaines » | — |
| b5-c09-cycle | ok | — | — |
| b5-c09-pilule | ok | Ovulation possible dès 4 comprimés oubliés en début ou fin de plaquette, jamais au milieu : cohérent avec le texte | — |
| b5-c09-fenetre | ok | Probabilités = série de Wilcox 1995 | — |
| b5-c09-hcg | ok | Seuil 25 mUI/mL atteint à 14 jours (27), premier jour positif cohérent | — |
| b5-c10-frise | corrigé | À 4 SA : « 0 cm » et « 0 g » | « < 1 mm » et « < 0,1 g » |
| b5-c10-placenta | ok | Flux de référence 100 % (12 m², 5 µm, 10 mmHg) correct | — |
| b5-c10-teratogenes | ok | — | — |
| b5-c10-jumeaux | corrigé | La note « Dizygotes » disait toujours « Si 33 % des paires sont monozygotes » même quand le curseur était réglé autrement | Valeur du curseur utilisée |

## 6e secondaire

| id | statut | problème | correction |
|---|---|---|---|
| b6-c01-echiquier | corrigé | Cases **transposées** par rapport aux en-têtes : pour Aa × aa, la case sous « A » et à côté de « a » affichait aa au lieu de Aa. Proportions globales justes, échiquier faux | Case (ligne i, colonne j) = allèle du parent 1 en colonne j + allèle du parent 2 en ligne i |
| b6-c01-grands-nombres | ok | Bande 75 % ± 2 écarts-types et écart-type attendu corrects | — |
| b6-c01-testcross | corrigé | Courbe (1/2)ⁿ sur un axe logarithmique faux (100 % placé aux 3/5 de la hauteur, étiquettes 0,01 % et 0,001 % sous l'axe, point et courbe hors du canvas dès n ≈ 11) | Axe de 10⁻⁷ à 100 %, graduation par décade, nombre de décimales adapté |
| b6-c01-abo | corrigé | Même transposition des cases de l'échiquier que ci-dessus | Idem |
| b6-c02-dihybride | ok | Échiquier 4 × 4 correct (colonnes = parent 1, lignes = parent 2) | — |
| b6-c02-produit | ok | — | — |
| b6-c02-khi2 | corrigé | En modèle 3 : 1, les curseurs des classes 3 et 4 restaient actifs sans effet, sans le dire | Mention dans la note. χ² des pois de Mendel vérifié (0,47 ; p = 0,925) |
| b6-c02-explosion | corrigé | « P(au moins un) parmi les descendants » = 0 pour n ≥ 20 (1 − (1−p)^M arrondi à 0 en virgule flottante), alors que la valeur vaut ≈ 3·10⁻¹³ | Calcul avec expm1 / log1p |
| b6-c03-daltonisme | corrigé | « 1 des filles », « 1 des garçons », « 0 des filles » et « 1 (100 %) » | Formulations « toutes les filles », « aucun garçon », « 2 sur 4 (50 %) » |
| b6-c03-arbre | ok | Solveur vérifié : famille A = autosomique récessive seule, B = récessive liée à X seule, C = autosomique dominante seule | — |
| b6-c03-recombinaison | ok | — | — |
| b6-c03-ecaille | corrigé | Pour un pelage uniforme, « Plages » comptait les cellules fondatrices isolées au début du développement (jusqu'à 12 « plages » pour un chat entièrement orange) | 1 plage pour les génotypes non mosaïques |
| b6-c04-risque | ok | Risques 1/4, 2/3·f/4, f²/4 et 20 familles corrects | — |
| b6-c04-mutation | corrigé | Mutation du codon AUG classée « faux-sens » | Étiquette « mutation du codon d'initiation AUG ». Séquence et mutation drépanocytaire (position 20, GAG → GTG) vérifiées |
| b6-c04-caryotype | ok | Longueurs des chromosomes et classement des anomalies corrects | — |
| b6-c04-depistage | corrigé | Fréquence à 20 ans : 1/1500, alors que la page 5e et la série de référence donnent 1/1667 | 1/1667 (VPP ≈ 51 % à 30 ans, cohérente avec le piège) |
| b6-c05-pcr | corrigé | Sans plateau, avec 10 000 copies de départ et 40 cycles à 100 %, 10¹⁶ copies : courbe et point sortaient du canvas (axe limité à 10¹⁴) | Axe jusqu'à 10¹⁸ |
| b6-c05-electrophorese | ok | Distance = f(log taille), lecture du repère inverse correcte | — |
| b6-c05-plaques | ok | — | — |
| b6-c05-profil | corrigé | Avec 8 loci et 10 000 personnes, 7,8·10⁻⁵ coïncidence attendue : log10 = −4,1, sous le bas de l'axe | Axe de −5 à 7 |
| b6-c06-phalenes | ok | ≈ 44 générations pour passer de 1 % à 50 % par défaut, compatible avec « plus de 95 % en une cinquantaine » | — |
| b6-c06-antibiotiques | ok | — | — |
| b6-c06-derive | signalé | Valeurs justes. Les 16 populations sont recalculées à chaque image de l'animation (jusqu'à 1,6 million de tirages pour N = 250) : fluide sur ordinateur, à surveiller sur un téléphone ancien | — |
| b6-c06-selection-dirigee | corrigé | Avec h² = 1 et 5 % de reproducteurs retenus, la moyenne atteint 35 mm : courbe, point et distribution sortaient des axes (limités à 22 mm et 20 mm) | Axes adaptés à la moyenne atteinte |
| b6-c07-arbre | corrigé | « Branches à parcourir entre les deux » comptait 2 de trop (4 pour lézard–pigeon au lieu de 2, 5 pour souris–lézard au lieu de 3) | Compte exact (arêtes de l'ancêtre commun à chaque espèce) |
| b6-c07-speciation | corrigé | Note « s = 7.000000000000001 % » possible (flottants) | Valeur du curseur affichée directement |
| b6-c07-sequences | ok | Distances 15 entre l'extérieur et le groupe, UPGMA correct | — |
| b6-c07-datation | corrigé | « 2,5 demi-vie » (pas de pluriel) | « demi-vies » à partir de 2 |
| b6-c08-miller | ok | — | — |
| b6-c08-domaine | ok | Tableau de critères et réponses attendues corrects | — |
| b6-c08-hominisation | ok | Pente de la droite pour Homo ≈ 199 cm³/Ma | — |
| b6-c08-horloge | corrigé | À « il y a 0 Ga » : « 32 décembre » | Plafonné au 31 décembre, 23 h 59 |
| b6-c09-logistique | ok | Formule de N(t), équilibre K(1 − h/r) et rendement r·K/4 vérifiés | — |
| b6-c09-competition | corrigé | Le toucher sur le plan N₁–N₂ utilisait un repère différent de celui du dessin (jusqu'à 14 individus d'écart en N₂) | Même géométrie pour le dessin et le pointeur |
| b6-c09-proie-predateur | corrigé | Avec la capacité d'accueil activée et m/(e·a) ≥ 150, l'équilibre des prédateurs devenait négatif (valeur et point hors cadre) | Équilibre (K, 0) et message dédié |
| b6-c09-niches | corrigé | Le glissement des courbes utilisait un axe de 2 à 18 mm alors que l'axe va de 0 à 20 mm : la courbe sautait jusqu'à 1,6 mm du doigt | Conversion sur l'axe réel |
| b6-c10-chaine | ok | — | — |
| b6-c10-azote | ok | Surplus apparaît vers 106 kg N/ha, nitrates 25 mg/L à 150 kg N/ha, cohérents avec la dose « sans surplus » affichée | — |
| b6-c10-climat | corrigé | Scénario « hausse de 1 % par an » : note « Les émissions diminuent… ». Branche « le CO₂ redescend » jamais atteignable (le modèle ne retire rien) | Notes par scénario (constantes, hausse, baisse de 3 %, nulles en 2050 ou 2075) |
| b6-c10-perturbation | corrigé | Entre 5 et 10 % de perturbation par an (forêt presque toute jeune), la note disait « Perturbations très rares : la forêt mature domine » | Message choisi selon la part de forêt mature (> 80 ans) |

## Bilan

- Simulations auditées : **80 sur 80** (40 en 5e, 40 en 6e), code lu et banc d'essai automatique exécuté sur chacune.
- Corrigées : **33** (12 en 5e, 21 en 6e). Dont 2 échiquiers faux (b6-c01-echiquier, b6-c01-abo), 5 dessins ou axes hors cadre (testcross, pcr, profil ADN, sélection dirigée, thermostat), 3 pointeurs mal calibrés (compétition, niches, arbre) et 4 valeurs fausses ou absurdes (part d'ovocytes ovulés, branches d'arbre, retour de la glycémie, « 32 décembre »).
- Signalées, non modifiées : **3** (b5-c01-refractaire, b5-c06-adh, b6-c06-derive), plus la rapidité du retour de la glycémie dans b5-c03-repas (corrigé pour l'affichage, dynamique du modèle à décider).
- Sans défaut trouvé : 44.
- Non auditées : 0. Limite : « ok » signifie « aucun défaut trouvé » après lecture et recalcul des formules et des cas limites, et non preuve d'absence d'erreur ; je n'ai pas relu le rendu visuel sur téléphone.
