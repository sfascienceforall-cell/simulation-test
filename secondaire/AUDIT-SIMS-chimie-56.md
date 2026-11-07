# Audit du code des simulations de chimie : 5e et 6e secondaire (4 novembre 2026)

Périmètre : `secondaire/chimie/5e` (40 simulations, sims-01 à 10) et `secondaire/chimie/6e` (41 simulations).
Méthode : lecture du code de chacune des 81 simulations (formules, constantes, unités, dessin, textes « À retenir » / « Piège », cas limites) ; recalcul en Python ou node des valeurs douteuses (calorimètre, évolution Q → K, défis Haber et titrage, matrice indicateurs × titrages, durée des anodes, ratios de masse) ; balayage automatique de chaque simulation (toutes les listes, curseurs aux bornes et au milieu : aucun « NaN », « undefined » ou « Infinity » affiché) ; captures d'écran des dessins modifiés.
Contrôles finaux : `node --check` OK sur les 20 fichiers sims ; `check.py` : 5e = 40 simulations, 0 erreur ; 6e = 41 simulations, 0 erreur.
Les points déjà validés dans `RELECTURE-PROF-chimie-secondaire.md` (Kp de Haber, Ks, Mohr, Nernst, NO₂, HI, oléique) ont été relus dans le code mais pas refaits : ils sont confirmés.

## Tableau (statut : ok / corrigé / signalé)

### 5e

| id | statut | problème | correction |
|---|---|---|---|
| c5-c01-remplissage | corrigé | Le bouton « Défi suivant » sautait le 1er défi (index initial 0, puis +1). | Index initial −1 : le défi 1 s'affiche en premier. |
| c5-c01-spectre | ok | Formules (13,6 eV/n², λ = 1240/ΔE) et séries justes sur toute la plage. | — |
| c5-c01-lewis | corrigé | (1) Ions dont la charge dépasse la valence (Na²⁺, Li²⁺, Mg³⁺…) dessinés avec 8 ou 2 points, donc un nombre d'électrons faux (Na²⁺ a 9 électrons). (2) Atome neutre : « peut former 8 − v liaisons » donnait 7 liaisons pour Li ou Na, 6 pour Be. (3) « À retenir » : même erreur. | (1) Cas déclaré « ion irréaliste » avec avertissement, sans dessin faux. (2) Nombre de liaisons = électrons célibataires ; pour les groupes 1, 2, 13 le message dit que l'atome préfère perdre ses électrons. (3) « À retenir » corrigé. |
| c5-c01-flamme | corrigé | En mode mystère, la ligne « Couleur » du potassium affichait « rouge 766 nm… », ce qui donne la longueur d'onde avant la réponse. | Seule la couleur (sans la parenthèse) est affichée tant que la réponse n'est pas vérifiée. |
| c5-c02-delta-en | ok | Seuils 0,5 / 1,7, signes δ⁺/δ⁻, sens du nuage et barre d'échelle justes. | — |
| c5-c02-energie-liaison | corrigé | (1) À r = 30 pm, E(r) affichait jusqu'à 195 000 kJ/mol (Cl–Cl) : valeur absurde du modèle de Morse. (2) En mode « Comparer », les cases « Longueur » et « Énergie de liaison » restaient celles de la liaison choisie dans la liste. | (1) Affichage « très élevée (> 3 D) » au-delà de 3 D. (2) En mode comparaison : valeurs des trois liaisons C–C, C=C, C≡C et note explicative. |
| c5-c02-octet | ok | n + v électrons, verdicts, cas impossibles (n > v, période 2) justes. | — |
| c5-c02-couches | corrigé | (1) Curseur d'unité « ion » (« 0,5 ion »). (2) À un glissement de 2 espacements le réseau se réaligne (attraction maximale) mais la note disait « attraction diminue ». | (1) Libellé « en espacements ioniques ». (2) s = 0 et s = 2 donnent la note « chaque ion est entouré d'ions de signe contraire ». |
| c5-c03-vsepr | ok | Géométries, ordre des doublets non liants (équatoriaux pour la bipyramide, trans pour XeF₄), tableau d'angles justes. | — |
| c5-c03-polarite | corrigé | « À retenir » citait CH₄ parmi les molécules à « liaisons polaires », alors que la simulation (seuil 0,5, ΔEN(C–H) = 0,4) affiche « non ». | « À retenir » : CH₄ = liaisons à peine polaires (ΔEN = 0,4). |
| c5-c03-solides | ok | Données (T de fusion, ébullition), états et conduction cohérents. | — |
| c5-c03-glace | corrigé | (1) Vue moléculaire : le liquide était dessiné avec 10 molécules, la glace avec 24 (qui se superposaient), donc le dessin montrait l'eau liquide MOINS dense que la glace, à l'inverse du titre. (2) ρ de l'eau de mer et de l'éthanol constantes quand la température change (à 100 °C : 1,025 pour l'eau de mer). (3) Éthanol au-dessus de 78 °C (vapeur) non signalé. | (1) Réseau en nid d'abeilles dessiné avec ses vraies molécules (comptées par le code) ; liquide = même zone, +9 % (rapport 1,000/0,917), effectifs affichés (25 / 27). (2) ρ(mer) suit la dilatation de l'eau ; ρ(éthanol) = 0,789 − 0,00085 (T − 20). (3) Avertissement au-delà de 78 °C. |
| c5-c04-dissolution | ok | Orientation des dipôles (O vers Na⁺, H vers Cl⁻), comptages, schéma annoncé simplifié. | — |
| c5-c04-ebullition | ok | 16 températures et masses molaires vérifiées ; extrapolation sur les périodes 3–5 : écarts +94, +192, +132 °C (N, O, F) et −14 °C (C), seuil d'anomalie correct. | — |
| c5-c04-miscibilite | ok | Densités, couche du haut, cas partiel (éthanol) cohérents avec le texte. | — |
| c5-c04-tension | ok | γ(c), force 2γL, poids, marge (en mN, en cm) justes ; 3 cm / 0,3 g flotte de 48 %. | — |
| c5-c05-q-mc-dt | ok | Chaleurs massiques, limites d'ébullition/fusion, défi (41,8 kJ) atteignable au pas de 0,5 kJ. | — |
| c5-c05-diagramme | corrigé | Graduation « 0 » parasite sur l'axe horizontal (axe sans unité). | Option `hideZero`. |
| c5-c05-melange | ok | Tf, énergies perdue = gagnée, c₁ du métal mystère, calorimètre justes. | — |
| c5-c05-plage-mer | ok | Rapports 5,2 (même masse) et 3,3 (même volume) justes. Le message « eau > 100 °C » n'est jamais atteint avec les curseurs (72 °C au maximum) : inoffensif. | — |
| c5-c06-calorimetre | corrigé | Modèle faux : la source de chaleur restait active (relaxation vers T idéale), donc la courbe plafonnait sans jamais redescendre. Le maximum lu et « l'extrapolation de la décroissance » (texte) ne correspondaient à rien. (2) Message d'avertissement « C ignoré » affiché même si C = 0. | (1) Source de chaleur exponentielle (≈ 8 s, total = ΔT vrai) + pertes proportionnelles à (T − T₀) : la courbe monte puis décroît ; droite d'extrapolation tracée sur [t₀ + 40, t₀ + 160] s (après le mélange) ; écart avec la table affiché (0 à 17 % selon τ). Vérifié : extrapolé/vrai = 0,85 (τ = 100 s), 1,00 (300 s), 1,015 (3000 s). (2) Avertissement seulement si C > 0 et non pris en compte. |
| c5-c06-combustibles | ok | Énergies massiques (MJ/kg), volumes (Vm = 24 L/mol), CO₂, bois humide (chaleur latente 2,44 MJ/kg) justes. | — |
| c5-c06-hess | ok | a = 1, b = 2, c = −1 → −76 kJ/mol ; bilan d'espèces juste. | — |
| c5-c06-canette | ok | kJ/g, ΔT, rendement et seuil d'ébullition justes. | — |
| c5-c07-collisions | corrigé | Le « Piège » affirmait que +10 K double le nombre de chocs efficaces « d'où le doublement » ; avec Eₐ de 0,5 à 6 kT (les curseurs), +10 K ne donne que +2 à +21 %. | Texte réécrit : +1 à 2 % de chocs, effet sur les chocs efficaces (×2 pour Eₐ ≈ 50 kJ/mol réelle, effet modeste avec les petites Eₐ de la simulation). Part théorique e^(−Eₐ/kT) vérifiée analytiquement. |
| c5-c07-effervescent | corrigé | Quand le temps de disparition dépasse 70 s (eau froide, n = 1 : 170 s), le point rouge « disparition » était tracé à t = 70 s, courbe encore à 0,3 de masse. | Point supprimé hors graphe et remplacé par « disparition après 70 s (hors graphe) ». |
| c5-c07-profil-catalyseur | corrigé | Eₐ ou abaissement du catalyseur silencieusement ramenés dans le domaine possible (Eₐ relevée à ΔH + 10 ; abaissement limité) : le curseur et la valeur affichée divergeaient sans explication. | Note d'avertissement indiquant la valeur effectivement utilisée. |
| c5-c07-horloge-iode | ok | Délai = [S₂O₃²⁻]/(2v) ; défi 31 s atteignable (0,04 / 0,08 / 0,001 / 25 °C). | — |
| c5-c08-boite | ok | A ⇌ B stochastique : B/A = k₁/k₂, vitesses A→B et B→A affichées. | — |
| c5-c08-constante-k | ok | K = 50, 0,22 mol/L de chaque réactif en partant de 1,0 (recalculé). | — |
| c5-c08-quotient | corrigé | La cinétique (vitesses arbitraires) était trop lente pour certaines concentrations : en 20 s, Q n'atteignait pas K (ex. départ 0,05 / 0,05 / 0 : Q = 1 après 20 s ; 0 / 0 / 0,05 : Q = 10 000), alors que le texte dit « Q atteint K ». | Le temps de convergence est calculé au départ et la vitesse d'animation s'adapte (tous les cas convergent à 1 % ; vérifié de 14 à 850 unités simulées). Axe « t (unités arbitraires) ». |
| c5-c08-no2 | ok | Kp van't Hoff (0,148 → 15 bar à 100 °C), α = √(Kp/(Kp + 4P)), fraction de NO₂ = 2α/(1 + α). | — |
| c5-c09-perturbation | corrigé | Après « − H₂ » (H₂ = 0), Q affichait un nombre à 12 chiffres. | Affichage « → ∞ (H₂ ou I₂ épuisé) ». |
| c5-c09-temperature-pression | ok | eqGas, Kp(T), effets de T et P cohérents avec ΔH et Δn. | — |
| c5-c09-haber | ok | Défi faisable : à 390 °C et 250 bar, 41 % de NH₃ avec une vitesse relative de 0,22. | — |
| c5-c09-gaz-dissous | corrigé | « Gaz libérable » comptait tout le CO₂ dissous, y compris la quantité qui reste à l'équilibre après ouverture. | Excès au-dessus de la solubilité à l'air (c − c_air) × 24 L/mol. |
| c5-c10-constructeur | corrigé | Deux substituants sur le même carbone (2,2-diméthylpropane, 2,2-diméthylbutane) étaient dessinés l'un sur l'autre : un seul méthyle visible. « À retenir » : « du pentane au décane : liquides » (le néopentane, 10 °C, est gazeux : la simulation affichait « gaz »). | Substituants placés côte à côte (vérifié en capture). « À retenir » complété. |
| c5-c10-nomenclature | corrigé | Même défaut de dessin (molécules 3 et 5) : les noms 2,2-diméthyl… ne correspondaient pas à ce que montrait le schéma. Noms de toutes les molécules recalculés : justes. | Même correction de dessin. |
| c5-c10-combustion | ok | Bilan CₙH₂ₙ₊₂, répartition CO₂/CO/C, énergie (DH − 283 y − 394 s) justes ; zone « O₂ insuffisant » signalée. | — |
| c5-c10-raffinage | ok | 20 températures d'ébullition, fractions (conventions annoncées simplifiées). | — |

### 6e

| id | statut | problème | correction |
|---|---|---|---|
| c6-c01-reconnaitre | ok | Noms, formules (CₙH₂ₙ₊₂O…), classes, masses molaires, cas « cétone < 3 C » signalé. | — |
| c6-c01-oxydation | ok | Produits, couleurs, test de Fehling cohérents pour primaire/secondaire/tertiaire. | — |
| c6-c01-ebullition | ok | 32 températures vérifiées (ordre alcane < aldéhyde < alcool < acide pour n = 1…8). | — |
| c6-c01-ethylotest | ok | Équation bilan équilibrée (atomes et charges), n × 2/3, limite 0,22 mg/L, conversion ×2,3. | — |
| c6-c02-equilibre | corrigé | Changer un curseur ne relançait pas l'animation : après la fin (7 unités) ou en cours de route, les barres sautaient à l'équilibre ou restaient au point de départ. | Les curseurs relancent l'évolution depuis t = 0. K = 4 → 67 % et formule de xeq vérifiés. |
| c6-c02-deplacer | ok | Rendement, limite à 100 % avec retrait total de l'eau, défi (≈ 2,9 mol d'alcool pour 90 %) atteignable. | — |
| c6-c02-saponification | corrigé | Le défi « aucun réactif en reste » était inatteignable (tolérance 0,05 g de soude, curseur au gramme). Le message de vérification comparait masse des réactifs versés et masse des produits (différentes dès qu'un réactif est en excès). | Tolérance de 2 % sur la masse de soude (défi atteignable : ex. 150 g d'huile + 20 g, 220 g + 30 g) ; vérification sur les masses consommées. M(trioléine) = 884, savon 304, glycérol 92, 13,6 g NaOH/100 g : justes. |
| c6-c02-aromes | corrigé | Le défi n'acceptait pas le butanoate de méthyle (« pomme / ananas ») pour « ananas », alors que la fiche affiche cette odeur. | Acceptation si l'arôme demandé figure dans l'odeur affichée. |
| c6-c03-addition | ok | Produits, masses (M(alcène) + M(réactif)), Markovnikov dessiné sur le bon carbone. | — |
| c6-c03-polyaddition | ok | n × M(monomère) ; défi PE 100 000 g/mol atteignable (p ≈ 3,55). | — |
| c6-c03-polycondensation | corrigé | La case « Eau libérée » affichait « n mol · X g/mol » (mélange de mol et g/mol). | « (2n − 1) H₂O par chaîne (X g par mole de chaîne) ». Bilan n·(MA + MB) = n·M(motif) + 18 + (2n − 1)·18 vérifié. |
| c6-c03-tri | ok | Masses volumiques, flottaison, impossibilité PET/PVC signalée. | — |
| c6-c03-dibrome | ok | 1 Br₂ par C=C, nombre de gouttes, observation avant/après. | — |
| c6-c04-dissociation | corrigé | Pour les acides très faibles (NH₄⁺, HCN) α ≈ 10⁻³ % s'affichait « 0 % » et le message disait « α ≈ 0 % … non nul ». | α affiché en notation scientifique quand il est < 0,01 %. |
| c6-c04-calcul-ph | ok | pH exact (électroneutralité), formules approchées, domaine de validité cohérents sur toute la plage de pKa et de pc. | — |
| c6-c04-predominance | corrigé | Message « pH = pKa : 50 % / 50 % » à ±0,06 unité (le curseur est au dixième) : le rapport n'est pas exactement 50/50. | « pH ≈ pKa : environ 50 % / 50 % ». Fractions 10^(jpH − ΣpKa) vérifiées. |
| c6-c04-antiacide | ok | n(H⁺) = 9,49 mmol (300 mL à pH 1,5), pouvoirs neutralisants par gramme (20 ; 34,5 ; 11,9 ; 38,5 mmol/g) conformes au texte. | — |
| c6-c05-titrage | ok | pH par électroneutralité, V_éq, pH à V_éq/2 = pKa, pH d'équivalence ≠ 7 justes pour les 4 titrages. | — |
| c6-c05-indicateur | corrigé | Quand le pH du milieu de la zone de virage n'est jamais traversé (acide très faible, hélianthine), le message parlait de « ne descend pas jusque-là » : confus. Matrice indicateurs × titrages recalculée : cohérente avec l'« À retenir ». | Message : l'indicateur garde la même couleur pendant tout le titrage. |
| c6-c05-tampon | ok | Bilan de charges avec l'ajout de HCl/NaOH, capacité = réserve de base ou d'acide, eau pure comparée. | — |
| c6-c05-sels | ok | 9 sels : charges des sous-systèmes acido-basiques justes ; pH des ampholytes ≈ ½(pKa₁ + pKa₂) retrouvés. | — |
| c6-c06-dissolution | ok | Solubilités s = (Ks/(xˣyʸ))^(1/(x+y)), Q = Ks à saturation, masses molaires. | — |
| c6-c06-melange | ok | Dilution, droite xpM + ypA = pKs, masse précipitée (z·V·M) justes. | — |
| c6-c06-ion-commun | ok | Solubilité avec ion commun, facteur de réduction (≈ 7 450 à 0,10 mol/L pour AgCl) cohérent avec le texte (« 7 000 »). | — |
| c6-c06-selective | ok | Bilan d'argent, seuils 1,8·10⁻⁸ et 1,5·10⁻⁵ mol/L, équivalence 5,0 mL. | — |
| c6-c07-plaque | ok | Δm (dépôt − dissolution), équations par PPCM des électrons, E° corrects. | — |
| c6-c07-demi-equations | ok | 13 demi-équations équilibrées (atomes et charges) ; simplification H⁺/H₂O et fusion des espèces communes justes. | — |
| c6-c07-nombre-oxydation | ok | 16 espèces, n.o. attendus justes (dont moyens : S₄O₆²⁻ = +2,5 ; C de l'éthanol −2). | — |
| c6-c07-rouille | ok | Modèle qualitatif annoncé ; équations anode/cathode justes. | — |
| c6-c08-pile | ok | f.é.m., anode/cathode, sens des électrons et des ions, Δm justes. | — |
| c6-c08-echelle | ok | 11 E° et les 5 f.é.m. cibles (1,10 ; 1,56 ; 0,78 ; 0,63 ; 0,93 ≈ 0,94) ont une paire solution. | — |
| c6-c08-nernst | corrigé | Mode Daniell : les curseurs s'appellent « compartiment 1 / 2 » sans dire que 1 = Zn²⁺ et 2 = Cu²⁺. | Précision ajoutée dans la note. Formules (0,0296 V, K ≈ 10³⁷) validées. |
| c6-c08-citron | signalé | En parallèle la tension reste celle d'un citron (0,9 V < seuil des LED) : la courbe pointillée est nulle pour les trois LED. Le texte « l'intensité augmente en parallèle » reste vrai en général mais la simulation ne le montre pas. | Rien modifié (la note dit bien que la tension est insuffisante). À enrichir si on veut montrer l'intensité disponible en parallèle. |
| c6-c09-eau | ok | Faraday (H₂ : n/2, O₂ : n/4), rapport 2 pour 1, seuil 1,8 V, tubes gradués 0–100 mL. | — |
| c6-c09-faraday | ok | m = ηMQ/(zF), h = m/(ρS), temps pour 20 µm, rapport Ag/Cu = 3,4. | — |
| c6-c09-electrolytes | ok | Produits et quantités par la loi de Faraday justes pour les 6 électrolytes. | — |
| c6-c09-anode | ok | Durées : Zn 1,7 an, Al 5,8 ans, Mg 2,5 ans (20 kg, 1 A, rendements réalistes). | — |
| c6-c10-etiquette | ok | Fonctions, masses molaires, rôles cohérents. | — |
| c6-c10-vinaigre | ok | Degré = 0,3·V (g/100 mL), V_éq = 20 mL pour 6 %, pH d'équivalence ≈ 8,7. | — |
| c6-c10-engrais | ok | 0,437 (62/142) et 0,830 (78/94) justes. | — |
| c6-c10-chimie-verte | corrigé | Le « Piège » disait « jeter plus de la moitié de la masse des réactifs (fermentation du glucose : 51 %) » : à 100 % de rendement, 49 % seulement sont jetés (51 % est l'économie d'atomes). | Texte corrigé (49 % de déchets pour la fermentation, 69 % pour la substitution du bromoéthane). Masses et économies d'atomes de toutes les voies recalculées. |

## Compléments

- Matrice indicateur × titrage (6e) recalculée : « fort/fort : presque tous ; acide faible/base forte : phénolphtaléine (rouge de phénol aussi, −0,14 %) ; base faible/acide fort : rouge de méthyle ou hélianthine » est juste.
- **c5-c06-calorimetre** est la correction la plus importante (modèle physique) ; **c5-c03-glace** (dessin contraire au message) et **c5-c10-constructeur / nomenclature** (substituants superposés) sont les corrections de dessin.
- Simulations non auditées : aucune.
