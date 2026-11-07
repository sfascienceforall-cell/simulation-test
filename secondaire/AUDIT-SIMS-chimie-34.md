# Audit du code des simulations · Chimie 3e et 4e secondaire

Périmètre : `secondaire/chimie/3e` et `4e`, 40 + 40 = 80 simulations, toutes relues dans le code (sims-01 à sims-10 de chaque page). Les 80 sont auditées.

Méthode :
- lecture de chaque fichier : formules, constantes, conversions d'unités, tables de données ;
- recalcul à la main ou par script des valeurs clés (Rutherford, moyennes isotopiques, courbes de solubilité, titrages, stœchiométrie, gaz parfaits, dureté, etc.) ;
- contrôle de la cohérence entre dessin, valeurs affichées, « À retenir », « Piège » et défis ;
- test automatique (Playwright) de chaque simulation : tous les curseurs à min, max et milieu, seuls et combinés, avec chaque option de chaque liste. Aucune apparition de NaN, undefined, Infinity ou « null » dans le texte des panneaux (le texte dessiné dans les canvas passe par `SFA.fmt`, qui renvoie « — » pour NaN) ;
- `node --check` sur les 40 fichiers .js : 0 échec ;
- `check.py` sur les deux `index.html` : **0 erreur** (40 sims / 110 exos pour la 3e, 40 sims / 100 exos pour la 4e).

Les points déjà validés dans `RELECTURE-PROF-chimie-secondaire.md` (Ca-46, film d'acide oléique, PbCl₂, etc.) n'ont pas été refaits. Le seul recoupement concerne `c4-c02-oleique` : le prof avait validé les formules, j'ai ajouté une précision sur le « piège ».

## 1. Éléments corrigés ou signalés

| id | statut | problème | correction |
|---|---|---|---|
| c3-c01-atelier | corrigé | Le message « Bravo ! » s'affichait même quand un constituant précieux était évaporé (huile + eau salée évaporés d'emblée : « Bravo », alors que l'huile est perdue). Si tout s'évaporait (eau + éthanol), le message disait « un groupe contient encore plusieurs constituants », alors qu'il ne restait rien. | Le « Bravo » exige que seul de l'eau soit éventuellement perdue. Message spécifique si un autre liquide est évaporé ; message « il ne reste plus rien » si tout est parti. Testé sur 5 enchaînements. |
| c3-c01-distillation | corrigé | Phrase finale incohérente : « la température en tête est passée de plus bas à X °C ». | « La température en tête est montée jusqu'à X °C. » |
| c3-c02-atome | corrigé | Texte du 7e défi confus (il évoquait Na⁺ et un autre élément avant de demander le néon 20). | « Construis l'atome neutre de néon 20. » |
| c3-c03-carte | corrigé | La droite pointillée N = Z passait par les coins des cases au lieu de leurs centres (décalée d'une case), et son étiquette « N = Z → » était loin de la droite. | Droite tracée par les centres des cases (N = Z) ; étiquette « ← N = Z » placée au bout de la droite. |
| c3-c03-balance | corrigé | Le défi parlait de « valeur arrondie du tableau », or la cible est calculée avec les nombres de masse : 80,0 u pour le brome (tableau : 79,90) et 63,6 u pour le cuivre (tableau : 63,55). L'étiquette « Isotope le plus lourd » affichait en réalité l'isotope dominant. | Texte : « moyenne calculée avec les abondances naturelles et les nombres de masse, proche de la valeur du tableau (X u) ». Étiquette renommée « Isotope dominant ». |
| c3-c03-demivie | corrigé | La liste déroulante affichait « T = 5 730,00 ans » (deux décimales inutiles pour les valeurs entières). | Décimales supprimées pour les valeurs entières. |
| c3-c04-tableau | corrigé | L'électronégativité du krypton (3,00) était affichée alors que le texte dit « les gaz nobles n'ont pas de valeur (grisés) » (He, Ne, Ar étaient grisés, pas Kr). | Valeur du Kr retirée (case grisée, comme les autres gaz nobles). |
| c3-c04-mendeleiev | corrigé | Le « Piège » annonçait un écart de 10 à 15 % entre densité interpolée et densité réelle. Recalcul : −10 % pour Ge, −16 % pour Ga. | « 10 à 20 % (environ 10 % pour le germanium, 16 % pour le gallium) ». |
| c3-c06-dilution | corrigé | Phrase du « Piège » ambiguë (« le nombre de particules dissoutes dans la pipette est exactement le même qu'avant »). | Reformulée : tout le soluté prélevé dans la pipette se retrouve dans la fiole. |
| c3-c06-solubilite | corrigé | Le « Piège » disait que le sucre dépasse 260 g/100 g d'eau « à partir de 60 °C ». Par interpolation, c'est vers 50 °C. | « À partir d'environ 50 °C ». |
| c3-c08-quiz | corrigé | Pour les composés 1 pour 1 (NaCl…), le distracteur « charges en indices » donnait « Na₁Cl₁ » (indice 1 jamais écrit), et il restait seulement 3 propositions. | Distracteur généré seulement si une charge dépasse 1, remplacé sinon par « NaCl₂ » ; ajout d'un distracteur de plus. |
| c3-c08-menage | corrigé | (a) Javel + vinaigre : l'équation donnée n'est valable que pour HCl. (b) Eau oxygénée + détartrant WC (HCl) : le message parlait d'acide peracétique, faux pour HCl. | (a) Équation pour HCl précisée ; avec le vinaigre, dégagement plus lent mais possible. (b) Message propre : oxydation de HCl en Cl₂ toxique. |
| c3-c09-eaux | corrigé | Eau du robinet à 0,6 mS/cm dans la table, alors que le « À retenir » dit ≈ 0,5 (et l'eau de mer diluée 100 fois donne 0,5). | Table alignée sur 0,5 mS/cm. |
| c4-c01 (bibliothèque C4) | corrigé | Ajout de `C4.eqU` (équation avec indices Unicode), utilisé par c4-c05-avancement et c4-c07-melange. Voir ces deux simulations. | — |
| c4-c02-echelle | corrigé | Repère « grains de sable ≈ 10¹⁸ » alors que la valeur placée sur l'axe et celle de la note sont 7,5·10¹⁸. | « ≈ 7,5·10¹⁸ (estim.) ». |
| c4-c02-oleique | corrigé | Le « Piège » généralisait « modèle cubique = 20 à 30 fois trop petit ». C'est vrai avec les réglages de départ (3 % de N_A), pas pour tous (le résultat varie comme S³ et peut dépasser N_A). | « avec les réglages de départ ». |
| c4-c03-centesimale | corrigé | La masse d'élément (« xx kg ») était écrite en blanc à droite de la barre, donc invisible sur le fond gris quand la barre est courte (Ca dans CaSO₄, 29 %). | Couleur sombre quand la barre n'atteint pas le texte. |
| c4-c04-piston | corrigé | Largeur négative possible de la tige du piston à V maximal (dessin). | Largeur limitée à 0 au minimum. |
| c4-c04-azote | corrigé | Étiquette « N₂ liquide » affichée dès −150 °C, alors que N₂ ne devient liquide qu'à −196 °C (hors du curseur). | « bain très froid (N₂ liquide : −196 °C) ». |
| c4-c05-avancement | corrigé | L'équation affichée en tête perdait ses indices (« 2 H2 + O2 → 2 H2O »). | Utilise `C4.eqU` (« 2 H₂ + O₂ → 2 H₂O »). |
| c4-c05-niveaux | corrigé | (a) Les solides (Mg, Fe, CaCO₃, MgO…) étaient étiquetés « liquide » dans la ligne « V gaz ». (b) Le titre annonçait « quatre lectures » pour trois lignes (n, m, V). | (a) « pas un gaz ». (b) « Une équation, trois lectures ». |
| c4-c06-methane | corrigé | Le graphique montre des masses, mais « O₂ nécessaire » était donné en litres seulement. | « 64 g (48 L) » pour 1 mol de CH₄ : masse (lue sur le graphique) et volume. |
| c4-c07-melange | corrigé | Même défaut d'indices que c4-c05-avancement. | `C4.eqU`. |
| c4-c07-cloche | corrigé | Curseur « Méthane brûlé » : c'est la quantité introduite ; le brûlé dépend du limitant. | « Méthane introduit ». |
| c4-c08-dilution | corrigé | Densité de points sans lien avec la concentration : le bécher « mère » gardait 40 points quel que soit c₁, et la fille en avait un nombre dépendant de la quantité totale. L'image ne montrait donc pas « F fois moins de particules par litre ». | Densité de points proportionnelle à la concentration dans la mère, la pipette et la fille ; légende « schéma qualitatif ». |
| c4-c09-dilution-infinie | corrigé | Pour pc ≈ 6,6 à 7, la note disait que le pH naïf « passe de l'autre côté de 7 » alors qu'il est encore du bon côté. | Texte adapté : « de l'autre côté de 7 » seulement si c'est vrai. |
| c4-c10-melange | corrigé | Les listes affichaient « Pb2²⁺ », « Ca2²⁺ », « Cu2²⁺ »… au lieu de « Pb²⁺ », « Ca²⁺ », « Cu²⁺ ». | Charge écrite seule, en exposant. |
| c4-c10-durete | corrigé | (a) Classes de dureté décalées (« très dure » dès 35 °f ; usage français : très dure au-delà de 42 °f). (b) À la stœchiométrie exacte, le message disait « il faut encore 0 goutte(s) ». | (a) Classes : < 7 très douce ; < 15 douce ; < 25 moyennement dure ; < 32 assez dure ; < 42 dure ; sinon très dure. (b) « la prochaine goutte fera mousser ». |

## 2. Simulations auditées sans modification (ok)

Dans chaque cas : formules, constantes, unités, bornes des curseurs, dessin et textes ont été contrôlés.

**3e** : c3-c01-courbe-chauffe (chaleurs massiques, enthalpies de changement d'état, paliers recalculés) · c3-c01-chromato · c3-c02-etats · c3-c02-rutherford (tan(θ/2) = a/b, rétrodiffusion cohérente avec le piège) · c3-c02-modeles · c3-c03-spectro (m ∝ B², rayon ∝ √m/B) · c3-c04-alcalins · c3-c04-mystere · c3-c05-ion · c3-c05-transfert (formules, charges) · c3-c05-molecule (valences, doublets, nombre de liaisons attendu recalculé pour les 18 molécules) · c3-c05-fusion · c3-c06-dissolution · c3-c06-balance (0,62 mL/g, solubilité du sucre) · c3-c07-lavoisier (44/84, 60/84, 82/84, 18/84) · c3-c07-equilibrage (11 réactions, coefficients vérifiés) · c3-c07-magnesium (3 : 2 : 5, 0,28 g/L d'O₂) · c3-c07-ballon (défis atteignables avec les pas des curseurs) · c3-c08-familles · c3-c09-conductimetre · c3-c09-dissociation (orientation O/H des molécules d'eau) · c3-c09-etalonnage · c3-c10-echelle · c3-c10-titrage (courbes, pH d'équivalence ≈ 8,6 à 8,8 pour l'acide faible) · c3-c10-metal (volumes de H₂, Al avec délai) · c3-c10-chou.

**4e** : c4-c01-atelier · c4-c01-quiz · c4-c01-charges · c4-c01-neutralisation (coefficients et nombre d'eau recalculés pour les 20 combinaisons) · c4-c02-sacs · c4-c02-souffle · c4-c03-calculateur (analyseur de formules : parenthèses, hydrates, erreurs) · c4-c03-balance · c4-c03-hydrate · c4-c04-hydrogene · c4-c04-airbag (M(NaN₃) = 65, rapport 3/2) · c4-c05-lavoisier · c4-c05-combustibles (rapports massiques recalculés pour 6 combustibles) · c4-c06-guide · c4-c06-chaux · c4-c06-fuite (9 couples acide-base) · c4-c08-preparation · c4-c08-teinte · c4-c08-mer (saturation vers 90 % d'évaporation) · c4-c07-burger · c4-c07-rendement · c4-c09-titrage · c4-c09-echelle · c4-c09-fort-faible · c4-c10-flacons · c4-c10-zinc.

## 3. Éléments signalés (non modifiés)

| id | statut | remarque |
|---|---|---|
| c4-c08-mer | signalé | Modèle simplifié : la solubilité de NaCl (360 g) est donnée par litre de solution. Elle est en réalité de 360 g pour 1 kg d'eau, soit environ 318 g par litre de solution. L'écart est sans effet sur la leçon (le piège signale déjà le modèle). Il vaut mieux ne pas comparer le point de saturation à une mesure réelle. |
| c4-c08-preparation | signalé | Même convention : solubilités en g/L de solution (« ≈ »). Les valeurs sont des ordres de grandeur. |
| c3-c06-dissolution, c3-c06-dilution | signalé | Même convention pour les solubilités par litre d'eau. Le volume de la solution est pris égal à celui de l'eau (déjà annoncé dans le piège). |
| c3-c08-menage | signalé | pH du vinaigre : « ≈ 2,5 » dans cette simulation, 2,9 dans c3-c10-echelle (valeurs usuelles 2,4 à 3). Non harmonisé : ordres de grandeur, annoncés comme approchés. |
| c3-c07-ballon, c3-c10-metal, c3-c10-titrage | signalé (niveau) | Déjà noté dans la relecture prof (n° 34-35) : mole et mol/L en 3e. Aucune erreur de calcul. |
| c4-c04-piston, c4-c04-hydrogene | signalé | `R = 8,31` et `V_m = 24 × T/293` : cohérents entre eux (V_m = 24,0 L/mol à 20 °C, contre 24,04 avec R). Écart de 0,2 % sans conséquence. |
| c4-c09-fort-faible | signalé | Les 100 points « particules » arrondissent la fraction ionisée de l'acide éthanoïque à 0 point dès c ≈ 1 mol/L (0,4 %) alors que le pourcentage est bien affiché dans la note. Choix de représentation, aucune valeur fausse. |

## 4. Non audité

Rien dans le périmètre (80/80 lues). Limites :
- le texte dessiné dans les canvas n'est pas lu par le test automatique : j'ai vérifié par le code que toutes les valeurs passent par `SFA.fmt` / `SFA.sci` (qui renvoient « — » pour NaN) ou par `C4.sciU` ;
- le rendu visuel (superpositions de texte, lisibilité sur mobile) n'a pas été contrôlé à l'œil ;
- l'adéquation au référentiel FWB n'a pas été réévaluée (voir la relecture prof).
