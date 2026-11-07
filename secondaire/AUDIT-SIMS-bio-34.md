# Audit du code des simulations de biologie 3e et 4e

Périmètre : `secondaire/biologie/3e` et `4e`, soit 80 simulations (`sims-01.js` à `sims-10.js`, 4 par chapitre).
Méthode : lecture du code de chaque simulation, recalcul en node des modèles (équilibre du réseau à 5 espèces, glycémie, fT enzymatique), vérification des unités, des axes et des cas limites. Les points déjà « validés après lecture du code » dans `RELECTURE-PROF-biologie.md` n'ont pas été refaits (glycémie 3e en mode diabète, surface intestinale, altitude : modèle, constantes). Après chaque correction : `node --check`. Contrôle final : `check.py` sur les deux `index.html`, **0 erreur** (`bad = []`, `pageErrors = []`, 40 simulations et 100 exercices par page).

Statuts : ok = code lu, rien à corriger · corrigé = erreur d'affichage ou de comportement corrigée · signalé = point laissé tel quel, à décider par l'équipe.

## 3e

| id | statut | problème | correction |
|---|---|---|---|
| b3-c01-reseau | ok | | |
| b3-c01-retire-espece | corrigé | Modèle à l'équilibre exact (vérifié). Mais une espèce restée à 11 % ou 1 % de son effectif après un effondrement général n'était pas comptée comme « en cascade » : la note affichait « les autres se réorganisent » alors que l'écosystème s'effondrait | Seuil « disparue ou au bord de la disparition » à moins de 15 % pour la note (l'affichage « disparue » reste à moins de 1 %) |
| b3-c01-regimes | ok | | |
| b3-c01-decomposeurs | ok | | |
| b3-c02-pyramide-energie | ok | Conversions MJ → kJ → m² refaites (surface pour un humain, 10 MJ/jour) | |
| b3-c02-pyramides | ok | | |
| b3-c02-regime-surface | ok | Formule du seuil `pmax` refaite | |
| b3-c02-bioaccumulation | corrigé | Axe logarithmique limité à 10⁵ µg/kg alors que le maximum atteint 5·10⁵ (5 ng/L donne 50 µg/kg dans le phytoplancton, puis × 10 à chacun des 4 maillons suivants) : barres coupées hors cadre | Axe prolongé à 10⁶, étiquette 10⁶ ajoutée |
| b3-c03-voyage-repas | ok | | |
| b3-c03-amylase | corrigé | « Dénaturée (irréversible) » affiché dès 50 °C, alors que la courbe d'activité vaut encore 48 % à 50 °C et ne s'annule qu'à 55 °C | Dénaturation totale à partir de 55 °C, état intermédiaire « en cours de dénaturation » de 45 à 55 °C, notes adaptées |
| b3-c03-tube | ok | | |
| b3-c03-surface-contact | ok | Surfaces (6k cm², π k cm²) et temps relatif 1/k vérifiés | |
| b3-c04-surface-intestin | ok | Déjà validé (relecture prof) | |
| b3-c04-glycemie | corrigé | Avec 0 g de glucose absorbé, la note disait « montée modérée puis retour à la normale » alors qu'il n'y a aucune montée | Message dédié (0,90 g/L stable en mode normal ; 1,30 g/L, au-dessus de 1,26, en mode diabète) |
| b3-c04-circuit | ok | | |
| b3-c04-chirurgie | ok | | |
| b3-c05-thorax-modele | ok | Résolution de P·V par dichotomie vérifiée | |
| b3-c05-air-inspire-expire | ok | | |
| b3-c05-effort | ok | Débit cardiaque 25 L/min et VO₂ 3,7 L/min au maximum, barres dimensionnées correctement | |
| b3-c05-altitude | corrigé | Modèle déjà validé. Mais à CO ≥ 5 %, la note annonçait une baisse du O₂ transporté calculée en comparant à la valeur du niveau de la mer, donc en y mélangeant l'effet de l'altitude (« même au niveau de la mer » faux en montagne) | Note réécrite : la perte due au CO vaut environ le pourcentage de CO, quelle que soit l'altitude |
| b3-c06-bilan | corrigé | Légende « dont ATP (≈ 34 %) » incohérente avec « environ un tiers » et avec les 32 % des exercices (relecture prof) | 32 % partout (légende et calcul) |
| b3-c06-levures | ok | Volume de CO₂ (gaz parfait à T) et 2 CO₂ par glucose vérifiés | |
| b3-c06-effort-energie | ok | MET, 3,5 mL/kg/min, 15,6 kJ/g vérifiés | |
| b3-c06-dette-oxygene | ok | Durée de retour du lactate sous 4 mmol/L refaite (demi-vie 20 min) ; peut dépasser les 20 min du graphe, c'est cohérent | |
| b3-c07-coupe-feuille | ok | | |
| b3-c07-stomates | corrigé | À 95-100 % d'humidité, l'eau perdue tombe à 0 mais la note disait « beaucoup d'eau s'échappe » | Note dédiée pour l'air presque saturé |
| b3-c07-transpiration | ok | 64,8 g/h par mmol/m²/s, 0,648 pour 100 cm², 129,6 L pour 200 m² × 10 h : vérifiés | |
| b3-c07-comptage-stomates | signalé | La densité moyenne des « champs vus » utilise le nombre réel de stomates du champ (pas le comptage de l'élève) : la moyenne est donc toujours juste, même si l'élève a mal compté | Non modifié : à décider (utiliser les stomates marqués si « Vérifier » a été cliqué) |
| b3-c08-plante-aquatique | corrigé | Le message « Plateau » (≥ 30 bulles/min) n'apparaissait jamais : le maximum du modèle est 29 bulles/min | Seuil abaissé à 25 |
| b3-c08-facteurs-limitants | ok | | |
| b3-c08-test-iode | corrigé | Si la plante n'est pas mise à l'obscurité, la feuille laissée dans le noir ou sans CO₂ et le bord blanc bleuissaient, sans avertissement (seule la zone sous l'aluminium déclenchait l'alerte) | Avertissement étendu à toutes les zones qui n'ont pas pu fabriquer d'amidon |
| b3-c08-van-helmont | ok | 2,268 kg · 76,75 kg · 90,7 kg · 56,7 g : conformes | |
| b3-c09-cycle-carbone | ok | 5,7 GtC/an de puits à 425 ppm, hausse de 2,5 ppm/an : cohérents | |
| b3-c09-lynx-lievre | corrigé | Cas m/a = 100 exactement (m = 1, a = 0,01, nourriture limitée) : lynx condamnés (équilibre à 0) mais non détectés comme « disparus » | Condition ajoutée (Hs ≥ 100) |
| b3-c09-bocal | ok | | |
| b3-c09-croissance-levures | corrigé | Le « temps pour 90 % de la capacité » cherchait jusqu'à 96 h alors que le graphe et le message « pas dans les 48 h » s'arrêtent à 48 h ; le temps de doublement pouvait devenir négatif si la croissance effective est inférieure à la mortalité | Recherche limitée à 48 h ; temps de doublement calculé avec le taux effectif et protégé |
| b3-c10-eutrophisation | ok | Saturation en O₂ (9,4 mg/L à 18 °C) correcte | |
| b3-c10-peche-durable | corrigé | (1) « Prise la dernière année » affichait le quota entier même quand le stock ne le permettait plus ; (2) l'axe du diagramme (hauteur 120 par défaut) ne montrait pas un quota de 200 t ; (3) la droite « part prélevée » sortait du cadre (jusqu'à 800 t) | (1) prise = min(quota, stock) ; (2) échelle verticale adaptée au quota ; (3) droite tracée jusqu'au bord du cadre |
| b3-c10-invasive | corrigé | Une espèce en cours de disparition (par ex. 13 individus après 100 ans, en baisse) était annoncée en « coexistence » | Détection du déclin (effectif < 10 et en baisse sur 10 ans) : « en voie de disparition », issue et notes adaptées |
| b3-c10-bioindicateur | signalé + corrigé | L'indice (formule identique à celle de l'exercice « Calculer un indice ») est généreux : 9/10 « très bonne » à 20 % de pollution alors que les plécoptères ont disparu. La note « beaucoup de taxa sensibles » s'affichait avec des taxa de sensibilité moyenne seulement | Note conditionnée à la présence d'un taxon de sensibilité ≥ 4. Formule non modifiée (alignée sur l'exercice) : à décider |

## 4e

| id | statut | problème | correction |
|---|---|---|---|
| b4-c01-microscope | ok | R = 0,61 λ/ON, champ = 18 mm / objectif, taille de l'image : vérifiés | |
| b4-c01-zoom | ok | 13 objets, exposants relus (log₁₀ des tailles) | |
| b4-c01-mesure | ok | | |
| b4-c01-comparer | ok | | |
| b4-c02-visite | ok | | |
| b4-c02-secretion | ok | Modèle en chaîne, somme des compartiments = 100 % | |
| b4-c02-specialisees | ok | | |
| b4-c02-mito | ok | | |
| b4-c03-diffusion | ok | | |
| b4-c03-osmose | corrigé | Le nombre de points de soluté dessinés était proportionnel à la concentration seule : quand l'eau passait d'un côté, les points apparaissaient ou disparaissaient au lieu de rester en nombre constant (la densité ne reflétait pas la concentration) | Nombre de points proportionnel à la quantité de matière (concentration × volume) |
| b4-c03-bain | ok | Modèle de Boyle–van 't Hoff, hémolyse à 0,5 % : cohérent | |
| b4-c03-pompe | ok | Régime stationnaire vérifié (12 mmol/L Na⁺, 140 mmol/L K⁺ avec ATP complet) | |
| b4-c04-tph | corrigé | Résumé : « trois enzymes » alors que le sélecteur en propose quatre | Texte corrigé. fT(optimum) = 1 vérifié |
| b4-c04-substrat | ok | | |
| b4-c04-inhib | corrigé | Note « à très faible [S], l'inhibition est forte pour les deux types » : faux (en non compétitif l'inhibition est constante ; en compétitif elle est faible avec un petit [I]/Ki) | Notes recalculées : compétitif = % d'inhibition à ce [S] ; non compétitif = vitesse divisée par (1 + [I]/Ki) quel que soit [S] |
| b4-c04-lactase | ok | 4,8 g/100 mL, 360/342 pour la masse des produits : corrects | |
| b4-c05-bilan | corrigé | Le « but » annonçait un choix de l'écriture de l'équation qui n'existe pas dans la simulation | Texte corrigé. Atomes d'oxygène (24 de chaque côté), masses (480 g) et marquages 18O vérifiés |
| b4-c05-spectre | ok | | |
| b4-c05-facteurs | corrigé | Axe vertical minimal à −8 alors que la respiration atteint −11 à 45 °C : courbe nette et droite « − respiration » hors cadre | Axe de −12 à 24 |
| b4-c05-phases | ok | | |
| b4-c06-bilan | ok | 30 ATP/glucose, rendement 32 % : cohérents | |
| b4-c06-levures | corrigé | (1) Avec dioxygène, le CO₂ atteint 59 g pour 40 g de sucre : courbe au-dessus de l'axe (limité à 40) ; (2) basculer l'interrupteur « Dioxygène » en cours de route réécrivait tout l'historique avec une autre stœchiométrie | (1) axe adapté ; (2) le basculement relance la simulation |
| b4-c06-effort | ok | | |
| b4-c06-etapes | ok | | |
| b4-c07-cycle | ok | 80 mol d'ATP/jour pour 10 000 kJ, 40 kg, stock épuisé en ≈ 100 s : cohérents | |
| b4-c07-mb | corrigé | Axe vertical minimal à 800 kcal alors que Mifflin–St Jeor descend à 550 kcal (30 kg, 130 cm, 80 ans) : courbe et point tronqués | Axe de 400 à 2 800 |
| b4-c07-bilan | corrigé | Pour des apports élevés (jusqu'à 21 850 kJ), la barre d'apports dépassait le cadre et le graphe de variation de masse (± 8 kg fixe) coupait la courbe (jusqu'à 44 kg) | Échelles de la barre et du graphe adaptées |
| b4-c07-plante | ok | | |
| b4-c08-adn | ok | | |
| b4-c08-meselson | corrigé | Dans les tubes dessinés, l'ADN lourd (¹⁵N) était en haut et le léger en bas, à l'inverse de la note « bas = ADN lourd » et de la centrifugation réelle | Orientation inversée : lourd en bas |
| b4-c08-caryotype | ok | 46 · 47 · 45 · 23 chromosomes comptés dans chaque cellule | |
| b4-c08-genome | corrigé | Axe logarithmique limité à 10¹³ m : l'ADN total de 10¹⁴ cellules humaines (2·10¹⁴ m) sortait de la graduation ; longueur totale en m entre 1 m et 10⁹ m affichée avec une écriture lourde | Axe étendu à 10¹⁵ m ; longueur affichée en km (notation scientifique au-delà de 10⁴ m) |
| b4-c09-transcription | ok | | |
| b4-c09-traduction | corrigé | Curseur « Codon lu » allant jusqu'à 13 alors que le gène de la β-globine n'a que 13 codons (indices 0 à 12) : la valeur 13 affichait le codon 12 | Maximum ramené à 12 |
| b4-c09-mutation | corrigé | Une substitution dans le codon stop (TAA → TAT) était classée « faux-sens : 1 acide aminé remplacé » alors qu'elle supprime l'arrêt de la traduction | Nouvelle catégorie « perte du codon stop » |
| b4-c09-polysome | ok | | |
| b4-c10-mitose | ok | | |
| b4-c10-adn | ok | | |
| b4-c10-cancer | ok | Équilibre du tissu normal vérifié (naissances 3,47 %/j contre morts 3,5 %/j) | |
| b4-c10-chimio | corrigé | Simulation arrêtée à 140 jours : avec un intervalle de 28 jours et 8 cures, les dernières cures (jusqu'à 196 jours) n'étaient ni appliquées ni dessinées, donc « Tumeur à la fin » était sous-estimée ; tournure fautive « a recroissance supérieure » | Durée de simulation et axe adaptés au nombre de cures et à l'intervalle ; phrase reformulée |

## Cas limites

Contrôlés dans le code et par `check.py` (curseurs aux bornes et au milieu) : aucun NaN, Infinity ni « undefined » affiché. Divisions par zéro protégées (stomates à 100 % d'humidité, temps de doublement, P·V, volumes d'osmose à 10 mL, 0 particule en diffusion).

## Points signalés à l'équipe (non modifiés)

1. `b3-c07-comptage-stomates` : la moyenne des champs utilise le nombre réel, pas celui de l'élève.
2. `b3-c10-bioindicateur` : indice généreux (aligné sur l'exercice « Calculer un indice », donc non modifié sans accord du professeur).
3. `b4-c02-secretion` : le tracé des quatre courbes relance la simulation pour chaque pixel ; correct mais coûteux en animation sur un appareil lent.
4. `b4-c08-meselson` : le modèle dispersif arrondit la proportion de segments anciens (1/16 → 1/8) à la 4e génération, effet purement graphique.
