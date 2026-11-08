# Recherche : complément universitaire SFA (chimie, biologie, statistique)

Rédigé le 4 novembre 2026 par le chercheur de l'équipe pédagogique. Destinataires : le chef de projet et les constructeurs de pages `universite/chimie`, `universite/biologie`, `universite/statistique` (format `SFA.page` / `SFA.sim` / `SFA.exos` décrit dans `secondaire/_lib/GUIDE.md`). Aucun code ici : uniquement des contenus et des priorités.

Convention : les noms de simulations proposés (en minuscules avec tirets) sont des identifiants de travail, à renommer librement. « Existant » = déjà dans `/home/claude/simulations/chimie/`.

---

## 0. Ce que la recherche web a permis (et ses limites)

Constats utiles pour tout le plan :

1. **Les cours de BA1 médecine ne ressemblent pas à notre programme secondaire.** À l'ULiège, la biologie générale (9 ECTS) est un cours évolutif en 26 chapitres, du « monde abiotique » à l'écologie, en passant par la génétique des populations. À l'UCLouvain, la biologie et l'embryologie générale (6 ECTS) est plus classique (chimie du vivant, membranes, métabolisme, génétique mendélienne et des populations, embryologie). Les deux évaluent par QCM.
2. **La statistique BA1 est très « lecture critique ».** UCLouvain (4 ECTS) : descriptive, variables aléatoires, TCL, intervalles de confiance, tests, introduction à la régression, essais cliniques. UNamur (Biostatistics I, 2 ECTS) : pièges d'interprétation (régression vers la moyenne, p-valeur, significativité biologique contre statistique, corrélation contre causalité, tests multiples). ULiège rattache les probabilités et les biais à un cours d'épidémiologie de 2 ECTS.
3. **Les prérequis publiés sont chimiques et mathématiques.** ULiège BIOL2026-2 attend en entrée : dilutions, molarité, pH, pKa, tampon, titrage, électronégativité, oxydoréduction, pression. UCLouvain WMDS1114 attend : règle de trois, pourcentages, logarithmes, exponentielles. Notre complément chimie sert donc aussi de passerelle vers la biologie.
4. **Limites honnêtes.**
   - ULB : les pages publiques consultées ne détaillent pas les cours de BA1 (seulement une description générale du bloc). Je n'ai donc **pas** de fiche ULB de biologie ou de biostatistique de BA1 confirmée. La fiche MEDI-G2205 « Épidémiologie et biostatistique » (5 ECTS, Erasme) est publique mais **l'année d'études n'est pas précisée** (probablement hors BA1) : je l'utilise comme référence de contenu statistique, pas comme preuve d'un cours de BA1.
   - UNamur : seule la liste de crédits du bachelier en médecine est accessible (biologie, chimie médicale, biochimie et biologie cellulaire, génétique, biostatistiques) sans détail de contenu, hors Biostatistics I. Les fiches détaillées de biologie n'ont pas pu être ouvertes.
   - ULiège : la biostatistique n'apparaît pas comme cours de BA1 médecine ; le plus proche est EPID0110-3 (2 ECTS, second quadrimestre).
   - UCLouvain LBIO1111 (biologie cellulaire et moléculaire, 5 ECTS) concerne le bachelier en biologie, chimie et médecine vétérinaire, pas médecine ; la page ne détaille pas le contenu. Je ne m'en sers que comme indice de niveau.
   - Référentiel ARES : je n'ai pas pu ouvrir la page officielle de l'ARES ni son annexe 2026 (domaine non accessible depuis cet environnement). J'ai utilisé : une copie ancienne de l'annexe (UMONS), la page de la faculté de médecine de l'ULiège, le communiqué ARES 2026 sur les résultats, et surtout les documents déjà dans le projet SFA (`audit-tracabilite-ares-2026.html`, `architecture-capsules-biologie-ares-v8.html`), qui citent le texte ARES clause par clause.
   - Je n'ai pas cherché de fiche de psychologie : le plan statistique vise médecine et biomédecine (les chapitres demandés couvrent aussi le besoin psycho, mais sans vérification de fiche).

---

## 1. Sources (URL)

### Examen d'entrée (ARES)
- Structure de l'épreuve et résultats 2026 (biologie, chimie, maths, physique chacune sur 20 ; transversal A sur 20 ; transversal B sur 60 ; total sur 160) : https://www.ares-ac.be/sites/default/files/2026-09/ares-cmd-2026_moyennes-et-medianes.pdf
- Page de la faculté de médecine de l'ULiège sur l'examen (deux parties : savoirs scientifiques, puis communication et analyse critique ; renvoie à l'ARES pour la matière) : https://www.facmed.uliege.be/cms/c_3954059/en/facmed-entrance-exam-in-medical-and-dental-sciences
- Copie ancienne de l'annexe ARES avec le programme de biologie en quatre volets (cellule et vivant ; génétique et hérédité ; diversité, évolution, adaptabilité ; écologie) : https://web.umons.ac.be/app/uploads/2018/01/04-RE-annexe-8.pdf
- Texte ARES détaillé : voir les documents du projet `claude/audit-tracabilite-ares-2026.html` et `claude/architecture-capsules-biologie-ares-v8.html` (qui citent mesetudes.be/exmd).

### Biologie et sciences fondamentales BA1
- ULiège, programme du bachelier en médecine (liste des cours de bloc 1 avec crédits) : https://www.programmes.uliege.be/cocoon/20262027/en/programmes/M1MEDE01.html et https://www.programmes.uliege.be/cocoon/programmes/M1MEDE01_B.pdf
- ULiège, BIOL2026-2 « Biologie générale » (9 ECTS, 26 chapitres, QCM de 60 questions) : https://www.programmes.uliege.be/cocoon/20262027/en/cours/BIOL2026-2.html
- UCLouvain, structure du bachelier en médecine : https://uclouvain.be/prog-2025-md1ba-structure et liste des cours : https://uclouvain.be/prog-2025-md1ba.pdf
- UCLouvain, WMEDE1152 « Biologie et embryologie générale » (6 ECTS) : https://uclouvain.be/cours-2026-wmede1152.pdf
- UCLouvain, WMDS1154 « Physiologie cellulaire » (7 ECTS ; titre et crédits confirmés par la liste des cours, contenu non lu) : https://uclouvain.be/cours-2026-wmds1154
- UCLouvain, LBIO1111 « Cell and molecular biology » (5 ECTS, bachelier biologie/chimie/vétérinaire, contenu non détaillé) : https://www.uclouvain.be/en-cours-2026-lbio1111.pdf
- ULB, bachelier en médecine (description générale du bloc 1) : https://www.ulb.be/fr/programme/2025-ba-medi
- UNamur, bachelier en médecine (crédits par discipline) : https://www.unamur.be/sites/default/files/2026-06/medecine.pdf

### Statistique BA1
- UCLouvain, WMDS1114 « Éléments de statistiques médicales » (4 ECTS, 28 h + 20 h) : https://uclouvain.be/cours-2026-wmds1114
- UNamur, MBIOB132 « Biostatistics I » (2 ECTS, bloc 1 de médecine) : https://www.unamur.be/en/biostatistics-i
- ULiège, EPID0110-3 « Basis of Epidemiology » (2 ECTS) : https://www.programmes.uliege.be/cocoon/20262027/en/cours/EPID0110-3.html
- ULB, MEDI-G2205 « Épidémiologie et biostatistique » (5 ECTS, année d'études non précisée) : https://www.ulb.be/fr/programme/2025-medi-g2205

---

## PARTIE A. CHIMIE

### A.1 État réel des exercices (mesuré dans `chimie/exercices/index.html`)

130 éléments dans 10 chapitres (1, 3, 6, 8, 12, 13, 15, 16, 17, 18), soit **13 par chapitre : 8 exercices + 5 QCM**. La répartition est **identique dans les 10 chapitres**.

| Type | ★ | ★★ | ★★★ | ★★★★ | ★★★★★ | Total |
|---|---|---|---|---|---|---|
| Exercices (par chapitre) | 1 | 2 | 2 | 2 | 1 | 8 |
| QCM (par chapitre) | 0 | 5 | 0 | 0 | 0 | 5 |
| **Total par chapitre** | **1** | **7** | **2** | **2** | **1** | **13** |
| Total des 10 chapitres | 10 | 70 | 20 | 20 | 10 | 130 |

Lecture :
- **54 % des éléments sont à ★★**, parce que tous les QCM y sont rangés. Ce n'est pas un étagement, c'est un plateau. Un QCM de nomenclature et un QCM de lecture de graphique n'ont pas la même difficulté.
- **Un seul ★ et un seul ★★★★★ par chapitre.** L'élève qui démarre n'a qu'un exercice d'entrée ; l'élève fort n'a qu'un défi. On ne peut pas faire un parcours « 3 exercices ★ pour s'échauffer » ni « 3 problèmes de synthèse » par chapitre.
- **Aucun QCM au-dessus de ★★**, alors que l'examen universitaire est un QCM à pièges (BIOL2026-2 : 60 questions, un seul examen écrit).
- Neuf chapitres sans exercice : 2, 4, 5, 7, 9, 10, 11, 14, 19. Il manque donc 9 × 13 = 117 éléments pour boucler le programme à format constant (247 au total).

**Ce qui manque pour un vrai étagement ★ à ★★★★★ (recommandation)**
1. Définir publiquement le sens des étoiles (une phrase par niveau). Proposition : ★ = une formule, un calcul, une donnée ; ★★ = deux étapes ; ★★★ = plusieurs notions combinées ; ★★★★ = problème contextualisé biomédical à données imparfaites ; ★★★★★ = synthèse de deux chapitres avec interprétation critique.
2. Cible par chapitre : **14 exercices (3 ★, 3 ★★, 3 ★★★, 3 ★★★★, 2 ★★★★★) + 5 QCM étalés (1 ★, 2 ★★, 1 ★★★, 1 ★★★★)**. Soit 19 éléments par chapitre.
3. Pour les 10 chapitres existants : ajouter 6 exercices (2 ★, 1 ★★, 1 ★★★, 1 ★★★★, 1 ★★★★★) et **réétiqueter** les 5 QCM (le plus simple passe à ★, un ou deux montent à ★★★ ou ★★★★). Total à créer : 60 exercices.
4. Pour les 9 chapitres neufs : 14 exercices + 5 QCM chacun, soit 171 éléments.
5. Mettre en regard de chaque chapitre de l'examen les ★★★★★ qui demandent de **combiner deux chapitres** (ex. gaz + stœchiométrie + pression partielle d'O₂ ; tampon + Henry ; Nernst + osmose), car c'est là que les étudiants de BA1 échouent.

### A.2 Couverture des 19 chapitres par les 22 simulations existantes

Légende : bonne = le chapitre est traité de bout en bout ; partielle = une partie seulement ; absente = rien.

| Ch. | Chapitre | Simulations existantes | Couverture | Exercices |
|---|---|---|---|---|
| 1 | Mole, nomenclature inorganique, stœchiométrie | stoechiometrie-labo (concentration, dilution, réactif limitant, avancement, rendement) | partielle : **nomenclature inorganique absente**, formule empirique absente | fait |
| 2 | Atome, spectre, radioactivité | aucune (cinetique et tendances-periodiques n'effleurent la radioactivité en une phrase) | **absente** | à faire |
| 3 | Configuration, nombres quantiques, périodicité | configuration-electronique, tendances-periodiques | bonne | fait |
| 4 | Liaison, Lewis, mésomérie, hybridation | lewis-vsepr (Lewis, hybridation citée), effets-electroniques (mésomérie en organique), aromaticite | partielle : hybridation et mésomérie sans simulation dédiée | à faire |
| 5 | VSEPR et polarité | lewis-vsepr | bonne (moment dipolaire vectoriel à vérifier) | à faire |
| 6 | Gaz | gaz-pressions-partielles (PV = nRT, Dalton, Maxwell-Boltzmann) | bonne pour le parfait ; gaz réels et effusion absents | fait |
| 7 | Liquides, solides, diagrammes de phases | diagramme-phases (eau, CO₂, courbe de chauffage, altitude) | partielle : **forces intermoléculaires et mailles cristallines absentes** | à faire |
| 8 | Solutions, colligatives | proprietes-colligatives (osmose, cryoscopie, Henry), stoechiometrie-labo (dilutions) | bonne | fait |
| 9 | Thermochimie, spontanéité | thermochimie (Hess, ΔfH, ΔG, calorimètre) | bonne ; Born-Haber, énergies de liaison, ΔG° ↔ K absents | à faire |
| 10 | Équilibre et solubilité | le-chatelier (Q, K, perturbations, Ks avec effet d'ion commun) | partielle : **précipitation, pH et solubilité, complexation, K(T) absents** | à faire |
| 11 | Cinétique | cinetique (ordres, Arrhenius, catalyseur, collisions, demi-vie) | bonne pour le formel ; mécanismes et enzymatique absents | à faire |
| 12 | Acides-bases, pH | ph-metre, predominance-pi | bonne | fait |
| 13 | Tampons, titrages, acides aminés | titrage-tampon, predominance-pi | bonne ; polyacides et tampon sanguin à renforcer | fait |
| 14 | Oxydoréduction, piles, électrolyse | piles-electrolyse (tableau des E°, usure, Nernst, électrolyse) | partielle : **équilibrage redox, dosages redox, ΔG = −nFE absents** | à faire |
| 15 | Nomenclature et isomérie de constitution | nomenclature-organique, isomerie-constitution | bonne | fait |
| 16 | Stéréochimie, conformations | stereochimie-3d (R/S, Fischer, E/Z), conformations (Newman, chaise) | bonne ; diastéréoisomères/méso et sucres à renforcer | fait |
| 17 | Alcènes et aromatiques | aromaticite, effets-electroniques (carbocations, Wheland) | partielle : **additions sur alcènes (Markovnikov, bromonium) absentes** | fait |
| 18 | Halogénés SN/E | substitution-elimination (arbre de décision, mécanismes, profil, loi de vitesse) | bonne ; Zaitsev/Hofmann et stéréochimie de SN2 à vérifier | fait |
| 19 | Alcools, carbonyles, acides et dérivés | carbonyles-derives (addition nucléophile, hémiacétal, dérivés d'acides) | partielle : **alcools et acides carboxyliques peu traités** | à faire |

### A.3 Simulations manquantes à créer (par chapitre, priorité en tête)

Priorité : P1 = le chapitre n'a rien ou presque, ou la notion revient à l'examen ; P2 = utile ; P3 = confort.

**Ch. 1 Mole, nomenclature inorganique (partielle)**
- P1 `nomenclature-inorganique` : atelier de nomination (cations avec nombre d'oxydation, oxoanions sulfate/sulfite, acides, hydrates) dans les deux sens, formule vers nom et nom vers formule.
- P2 `formule-empirique-brute` : de pourcentages massiques et d'une masse molaire vers formule empirique puis moléculaire.
- P3 `equilibrage-assiste` : équilibrer par comptage d'atomes avec bilan visuel en billes.

**Ch. 2 Atome, spectre, radioactivité (absente) : le plus gros manque**
- P1 `spectre-hydrogene-bohr` : transitions entre niveaux, séries de Lyman, Balmer, Paschen ; calcul de λ et d'énergie du photon avec E = hν ; spectre d'émission contre spectre d'absorption.
- P1 `decroissance-radioactive` : N(t), demi-vie, activité, datation au carbone 14 ; lien avec la cinétique d'ordre 1.
- P1 `types-radioactivite-noyau` : équations nucléaires α, β⁻, β⁺, capture, γ ; équilibrage de A et Z ; vallée de stabilité.
- P2 `defaut-de-masse-energie-liaison` : E = Δm·c², énergie de liaison par nucléon, fission contre fusion.
- P2 `radiopharmaceutiques-demi-vie` : technétium-99m, iode-131, fluor-18 ; demi-vie physique et biologique combinées, choix d'un traceur pour l'imagerie (pont avec la médecine).
- P3 `effet-photoelectrique` : seuil, énergie cinétique, dépendance en fréquence et non en intensité.

**Ch. 4 Liaison, mésomérie, hybridation (partielle)**
- P1 `hybridation-sp-sp2-sp3` : construction d'orbitales hybrides, σ et π, comptage sur éthane, éthène, éthyne, benzène, carbonyle.
- P1 `mesomerie-structures-limites` : flèches de déplacement d'électrons, charges formelles, poids relatifs des structures limites, énolate, carboxylate, amide.
- P2 `ordre-longueur-energie-liaison` : relier ordre de liaison, longueur et énergie (C–C, C=C, C≡C, CO₃²⁻).
- P2 `electronegativite-caractere-ionique` : écart d'électronegativité, polarité de liaison, pourcentage de caractère ionique.
- P3 `orbitales-moleculaires-h2-o2` : diagramme d'OM simple, paramagnétisme de O₂.

**Ch. 5 VSEPR et polarité (bonne)**
- P2 `moment-dipolaire-vecteurs` : somme vectorielle des dipôles de liaison ; pourquoi CO₂ est apolaire et H₂O polaire.
- P3 `isomeres-cis-trans-polarite` : dichloroéthènes, ortho/méta/para-dichlorobenzène.

**Ch. 6 Gaz (bonne)**
- P2 `gaz-reels-van-der-waals` : écart au gaz parfait, facteur de compressibilité Z, rôle de a et b.
- P2 `effusion-graham` : rapport de vitesses et de temps de fuite (déjà un exercice ★★★★★ qui le suppose).
- P3 `stoechiometrie-gazeuse` : volumes molaires dans une réaction, rendement gazeux.

**Ch. 7 Liquides, solides, diagrammes (partielle)**
- P1 `forces-intermoleculaires` : London, dipôle-dipôle, liaison hydrogène ; corrélation avec les points d'ébullition (série des hydrures, alcanes ramifiés contre linéaires).
- P1 `mailles-cristallines` : cubique simple, centrée, faces centrées ; nombre d'atomes par maille, compacité, masse volumique, rayon de l'atome.
- P1 `tension-de-vapeur-clausius-clapeyron` : pression de vapeur contre T, ΔHvap par pente de ln P contre 1/T, ébullition.
- P2 `types-de-solides` : ioniques, covalents, métalliques, moléculaires ; propriétés (conduction, dureté, fusion).
- P2 `viscosite-tension-superficielle` : capillarité, surfactant pulmonaire (lien biologique).

**Ch. 8 Solutions (bonne)**
- P2 `loi-de-raoult-melange-ideal` : pression de vapeur d'un solvant et d'un mélange binaire, abaissement relatif.
- P3 `solubilite-temperature-miscibilite` : « qui se ressemble s'assemble », courbes de solubilité, solutions saturées.

**Ch. 9 Thermochimie (bonne)**
- P1 `born-haber` : cycle de formation d'un solide ionique, énergie réticulaire, tendance LiF → CsI.
- P2 `energies-de-liaison` : estimation de ΔH de réaction par liaisons rompues et formées ; limites de l'estimation.
- P1 `deltaG-et-constante-equilibre` : ΔG° = −RT ln K, ΔG = ΔG° + RT ln Q, sens spontané, avec Q glissant.
- P2 `calorimetrie-capacite-thermique` : bombe calorimétrique, chauffage, changements d'état, mélange de deux corps.
- P2 `couplage-atp` : réaction défavorable couplée à l'hydrolyse de l'ATP (pont avec la biologie).

**Ch. 10 Équilibre et solubilité (partielle) : second gros manque**
- P1 `precipitation-q-contre-ks` : mélange de deux solutions, comparaison de Q et de Ks, quantité précipitée.
- P1 `tableau-ice-kc-kp` : calcul d'équilibre par x, approximation de la racine carrée et validité, Kp contre Kc.
- P1 `solubilite-et-ph` : hydroxydes, carbonates, phosphates de calcium ; dissolution en milieu acide (lien avec l'os et les calculs rénaux).
- P2 `precipitation-selective` : deux ions, un réactif, ordre de précipitation, séparation.
- P2 `complexation-et-solubilite` : AgCl dans NH₃, constante de formation.
- P3 `vant-hoff-k-contre-temperature` : K(T), exothermique contre endothermique.

**Ch. 11 Cinétique (bonne pour le formel)**
- P1 `vitesses-initiales-ordres` : tableau d'expériences, détermination des ordres partiels et de k (le type d'exercice qui tombe).
- P1 `mecanismes-etape-determinante` : mécanisme en plusieurs étapes, étape lente, intermédiaire, loi de vitesse déduite.
- P2 `arrhenius-lineaire` : tracé de ln k contre 1/T, énergie d'activation par la pente, deux températures.
- P2 `pharmacocinetique-doses-repetees` : élimination d'ordre 1, accumulation, état d'équilibre, dose de charge.
- P2 `cinetique-enzymatique-intro` : pont vers la partie biologie (voir B5).

**Ch. 12 Acides-bases (bonne)**
- P2 `polyacides-distribution` : H₃PO₄, H₂CO₃, fractions de chaque forme en fonction du pH.
- P2 `hydrolyse-des-sels` : pH d'un sel selon la force de l'acide et de la base d'origine.
- P3 `force-acide-et-structure` : pKa, effet inductif, résonance du carboxylate (lien ch. 4 et 19).

**Ch. 13 Tampons, titrages, acides aminés (bonne)**
- P1 `tampon-sanguin-bicarbonate` : couple CO₂/HCO₃⁻, Henderson-Hasselbalch avec pCO₂, acidose et alcalose respiratoires et métaboliques.
- P2 `titrage-polyacide-acide-amine` : courbe de la glycine, de l'acide glutamique, de la lysine ; pI.
- P2 `capacite-tampon` : ajout d'acide ou de base à différents rapports et concentrations.
- P3 `electrophorese-selon-le-ph` : migration d'un peptide en fonction du pH et de son pI.

**Ch. 14 Oxydoréduction, piles (partielle)**
- P1 `equilibrage-redox-demi-reactions` : milieu acide puis basique, permanganate, dichromate, eau oxygénée.
- P1 `nernst-et-deltaG` : E = E° − (RT/nF) ln Q, ΔG = −nFE, K à partir de E° ; pile de concentration (pont direct vers le potentiel de membrane, voir B3).
- P2 `dosage-redox` : permanganate sur fer(II), iodométrie, calcul de concentration au point équivalent.
- P2 `electrolyse-faraday-sels-fondus-aqueux` : produits à chaque électrode, masse déposée (déjà partiellement dans piles-electrolyse : prévoir la compétition eau contre ion).
- P3 `corrosion-et-protection` : anode sacrificielle, pile de corrosion.

**Ch. 16 Stéréochimie (bonne)**
- P2 `relations-de-stereoisomerie` : énantiomères, diastéréoisomères, composés méso, nombre de stéréoisomères 2ⁿ.
- P2 `pouvoir-rotatoire-exces-enantiomerique` : [α], pureté optique, racémique.
- P2 `glucose-fischer-haworth-anomeres` : cyclisation, α et β, mutarotation.

**Ch. 17 Alcènes et aromatiques (partielle)**
- P1 `addition-electrophile-alcene` : HBr, H₂O/H⁺, Br₂ ; Markovnikov par le carbocation, syn contre anti, régénération du catalyseur.
- P2 `stabilite-alcenes-hydrogenation` : chaleur d'hydrogénation, substitution de la double liaison, conjugaison.
- P2 `sear-orientation-assistee` : bilan prédictif sur disubstitués (ortho/méta/para, activant ou désactivant), déjà partiellement dans effets-electroniques.

**Ch. 18 Halogénés SN/E (bonne)**
- P2 `zaitsev-hofmann` : régiosélectivité de l'élimination, base encombrée.
- P3 `stereochimie-sn2-walden` : inversion de configuration, SN1 racémisation.

**Ch. 19 Alcools, carbonyles, acides et dérivés (partielle) : à traiter en priorité**
- P1 `alcools-reactivite-oxydation` : alcools primaires/secondaires/tertiaires, oxydation douce et forte, déshydratation (Zaitsev), substitution par HX.
- P1 `acides-carboxyliques-acidite-esterification` : acidité (carboxylate), estérification de Fischer comme équilibre (lien ch. 10), hydrolyse, saponification.
- P1 `reactivite-carbonyles-reduction` : NaBH₄ et LiAlH₄, Grignard (niveau BA1 : bilan), cyanhydrine ; ordre de réactivité aldéhyde > cétone.
- P2 `aldolisation-enolates` : acidité en α, énolate, aldolisation et crotonisation (glycolyse : aldolase).
- P2 `amides-peptides-liaison` : formation de la liaison peptidique, résonance, plan de la liaison amide (pont avec les protéines).
- P3 `glucides-hemiacetal-glycoside` : formation d'un glycoside, sucres réducteurs.

**Bilan chimie** : 68 simulations proposées. **Ordre de construction conseillé (les 12 premières)** : spectre-hydrogene-bohr, decroissance-radioactive, hybridation-sp-sp2-sp3, forces-intermoleculaires, mailles-cristallines, born-haber, precipitation-q-contre-ks, nernst-et-deltaG, equilibrage-redox-demi-reactions, addition-electrophile-alcene, alcools-reactivite-oxydation, tampon-sanguin-bicarbonate. Ces douze couvrent les sept trous les plus visibles (chapitres 2, 4, 7, 10, 14, 17, 19) et préparent les ponts vers la biologie.

---

## PARTIE B. BIOLOGIE (BA1 sciences de la santé)

### B.1 Positionnement

Le référentiel ARES (cellule et vivant ; génétique et hérédité ; diversité, évolution, adaptabilité ; écologie) reste un niveau **secondaire**, déjà couvert par les 19 capsules du projet. Le complément universitaire ne le recopie pas : il ajoute ce que BIOL2026-2 (ULiège) et WMEDE1152 (UCLouvain) demandent en plus, c'est-à-dire des **modèles quantitatifs** (cinétique, potentiels, fréquences alléliques, croissance), des **mécanismes détaillés** (métabolisme, expression du génome, cycle cellulaire) et des **exercices de calcul sur QCM**. À l'ULiège, l'évaluation prévoit explicitement de « prédire les variations de volume cellulaire selon le milieu extracellulaire » et de « calculer des fréquences alléliques et génotypiques ».

### B.2 Dix chapitres

Chaque chapitre : intérêt (d'où vient l'exigence), puis 4 à 5 simulations. Entre parenthèses : les ponts avec la chimie SFA.

**B1 Molécules du vivant et eau**
Sources : UCLouvain WMEDE1152 (chimie du vivant : eau, carbone, macromolécules) ; prérequis de BIOL2026-2 (pH, tampons, concentrations).
1. `eau-liaisons-faibles` : liaisons hydrogène, effet hydrophobe, solvatation ; pourquoi l'eau est un bon solvant (ch. 7 chimie).
2. `macromolecules-monomeres` : glucides, lipides, protéines, acides nucléiques ; condensation et hydrolyse, nombre de liaisons formées pour n monomères.
3. `structure-proteines-niveaux` : primaire à quaternaire, liaisons stabilisatrices, dénaturation par T ou pH (ch. 13 chimie).
4. `acides-gras-saturation-fluidite` : longueur, insaturations cis, température de fusion (ch. 7).
5. `tampons-intracellulaires` : pH cellulaire et sanguin, rôle des tampons phosphate et bicarbonate (ch. 13).

**B2 Cellule, organites et techniques d'observation**
Sources : ULiège BIOL2026-2 (chapitres 5 à 13 : protocellules, premières cellules, origine des eucaryotes, endomembranes, mitochondries) ; UCLouvain (organisation cellulaire).
1. `microscopie-grossissement-echelle` : unités (µm, nm), calcul de grandeur réelle, résolution, techniques (optique, électronique, fluorescence).
2. `rapport-surface-volume` : pourquoi les cellules sont petites ; cellule sphérique, cubique, microvillosités.
3. `endosymbiose-origine-mitochondrie` : preuves (ADN circulaire, double membrane, ribosomes 70S), arbre simplifié.
4. `voies-secretion-endomembranes` : trajet d'une protéine (RER, Golgi, vésicule), adressage, signaux.
5. `fractionnement-centrifugation` : séparation d'organites par vitesse et densité.

**B3 Membranes et transports**
Sources : UCLouvain (structure et fonctions des membranes, transports, endocytose) ; ULiège (prédire le volume cellulaire) ; UCLouvain physiologie cellulaire (WMDS1154, 7 ECTS).
1. `diffusion-fick-membrane` : flux selon le gradient, perméabilité, épaisseur, surface (ch. 6 et 8).
2. `osmose-volume-cellulaire` : globule rouge dans différentes solutions, tonicité contre osmolarité, urée contre NaCl (reprend directement `proprietes-colligatives`).
3. `transport-passif-facilite-actif` : saturation d'un transporteur, canal contre pompe, symport et antiport, pompe Na⁺/K⁺.
4. `potentiel-equilibre-nernst` : potentiel d'équilibre de K⁺, Na⁺, Cl⁻, Ca²⁺ à partir des concentrations (pont direct avec la pile de concentration, ch. 14).
5. `potentiel-repos-goldman` : potentiel de repos selon la perméabilité relative aux ions ; effet de l'hyperkaliémie.

**B4 Communication cellulaire, excitabilité et homéostasie**
Sources : UCLouvain (communication cellulaire : réception, transduction, jonctions) ; physiologie cellulaire.
1. `potentiel-action-seuil` : phases, canaux Na⁺ et K⁺ voltage-dépendants, période réfractaire, loi du tout ou rien.
2. `propagation-myelinisation` : conduction continue contre saltatoire, vitesse selon diamètre et myéline.
3. `transduction-cascade-amplification` : récepteur, protéine G, AMPc, amplification (1 hormone → 10⁴ molécules).
4. `synapse-neurotransmetteur` : libération, récepteurs excitateurs et inhibiteurs, sommation spatiale et temporelle.
5. `homeostasie-retroaction` : glycémie (insuline, glucagon), thermorégulation ; rétroaction négative et positive, gain.

**B5 Énergie et enzymes**
Sources : UCLouvain (énergie et travail, ATP, enzymes) ; ULiège (évolution du métabolisme énergétique).
1. `michaelis-menten` : v contre [S], Vmax, Km ; double inverse de Lineweaver-Burk ; effet de la concentration d'enzyme (pont avec la cinétique, ch. 11).
2. `inhibition-enzymatique` : compétitive, non compétitive, incompétitive ; lecture du double inverse et variation de Km et Vmax.
3. `effets-ph-temperature-enzyme` : optimum, dénaturation, enzymes de l'estomac et de l'intestin.
4. `couplage-atp-deltaG` : ΔG de l'hydrolyse de l'ATP, réaction couplée, spontanéité (ch. 9).
5. `regulation-allosterique-retro-inhibition` : sigmoïde de l'hémoglobine ou de la PFK, inhibition par le produit final.

**B6 Métabolisme énergétique**
Sources : UCLouvain (respiration cellulaire, photosynthèse) ; ULiège (mitochondries, chloroplastes, évolution du métabolisme).
1. `bilan-glycolyse-krebs` : bilans nets d'ATP, NADH, FADH₂ ; suivi du carbone de glucose à CO₂.
2. `chaine-respiratoire-chimiosmose` : gradient de protons, ATP synthase, rendement P/O, découplants (ch. 14, potentiels redox).
3. `fermentation-contre-respiration` : rendement comparé, lactate, effort musculaire.
4. `photosynthese-reactions-claires-calvin` : lumière, NADPH, ATP, fixation du CO₂.
5. `regulation-metabolique-glycolyse` : états nourri et à jeun, glycogène, néoglucogenèse, hormones.

**B7 Expression et perpétuation du génome**
Sources : ULiège (chapitres 14 à 16 : transcription, traduction, perpétuation) ; UCLouvain (ADN, transcription, traduction, génétique des procaryotes, ingénierie génétique) ; ARES (code génétique, transcription).
1. `replication-adn-pas-a-pas` : fourche, brin avancé et brin retardé, fragments d'Okazaki, ADN polymérase, correction d'erreurs.
2. `transcription-maturation-arn` : promoteur, ARN polymérase, coiffe, polyadénylation, épissage.
3. `traduction-code-genetique` : lecture de l'ARNm, ARNt, ribosome, codon stop ; mutations ponctuelles (silencieuse, faux-sens, non-sens, décalage).
4. `regulation-operon-lac` : induction et répression, effet du lactose et du glucose.
5. `pcr-et-electrophorese` : cycles, amplification 2ⁿ, amorces, taille des fragments, interprétation de gels.

**B8 Cycle cellulaire, division et embryologie**
Sources : ULiège (chapitres 17 à 20 : division, cycle et contrôle, gamètes, embryologie générale) ; UCLouvain (cycle, mitose, méiose, embryologie).
1. `cycle-cellulaire-points-controle` : G1, S, G2, M ; cyclines et CDK, p53, effets d'un point de contrôle défaillant.
2. `mitose-contre-meiose` : comparaison pas à pas, nombre de chromosomes et de chromatides à chaque étape (le piège classique).
3. `meiose-brassage-genetique` : brassage inter- et intrachromosomique, nombre de gamètes possibles 2ⁿ, crossing-over.
4. `anomalies-chromosomiques-caryotype` : non-disjonction, trisomie 21, syndromes de Turner et de Klinefelter, lecture d'un caryotype.
5. `gametogenese-embryogenese-etapes` : spermatogenèse et ovogenèse (ploïdie, cellules produites), fécondation, segmentation, gastrulation, feuillets.

**B9 Transmission des caractères**
Sources : UCLouvain (lois de Mendel, gènes liés, gènes liés au sexe, crossing-over) ; ULiège (chapitre 24, génétique) ; ARES (problèmes d'hérédité, arbres généalogiques, groupes sanguins). Plusieurs de ces points existent déjà au niveau secondaire dans le projet (capsules BI7) : le complément ajoute les **statistiques de croisement** et la **liaison génétique**.
1. `croisements-mono-dihybrides-chi2` : échiquier de Punnett, rapports 3:1 et 9:3:3:1, test χ² sur des effectifs observés (lien avec la statistique, chap. S9).
2. `liaison-genetique-cartographie` : fréquence de recombinaison, distance en centimorgans, croisement-test à trois points.
3. `heredite-liee-au-sexe-pedigree` : analyse d'arbres, calcul du risque pour un enfant (autosomique dominant, récessif, lié à l'X).
4. `groupes-sanguins-codominance` : ABO, Rhésus, compatibilité transfusionnelle, incompatibilité fœto-maternelle.
5. `penetrance-expressivite-polygenique` : un gène n'explique pas tout ; courbe en cloche d'un caractère polygénique (milieu ET gènes, exigence ARES).

**B10 Populations : évolution, génétique des populations, écologie**
Sources : ULiège (chapitres 2, 25 et 26 : théories de l'évolution, génétique des populations, interactions avec l'environnement) ; UCLouvain (génétique des populations) ; ARES (diversité, évolution, écologie : niches, chaînes alimentaires, cycles biogéochimiques, dynamique des écosystèmes).
1. `hardy-weinberg` : p² + 2pq + q² = 1, fréquence de porteurs d'une maladie récessive (mucoviscidose), test d'équilibre par χ².
2. `derive-genetique-effectif` : fixation d'allèles au hasard dans de petites populations, effet fondateur et goulot.
3. `selection-naturelle-modele` : coefficient de sélection, évolution de p sur les générations, avantage de l'hétérozygote (drépanocytose et paludisme).
4. `croissance-populations-logistique` : exponentielle, capacité de charge K, taux de croissance, effet de la densité.
5. `proies-predateurs-lotka-volterra` : oscillations couplées, facteurs limitants.
6. (optionnelle) `flux-energie-pyramides-trophiques` : rendement de 10 %, bioaccumulation (chaînes alimentaires du référentiel ARES).

**Ponts à exploiter explicitement** (à mentionner dans les « à retenir ») : B3-4 avec chimie ch. 14 (Nernst) ; B3-2 avec chimie ch. 8 (osmose) ; B5-1 avec chimie ch. 11 ; B5-4 avec chimie ch. 9 ; B6-2 avec chimie ch. 14 ; B1-5 avec chimie ch. 13 ; B9-1 avec statistique S9 ; B10-1 avec statistique S5 et S9.

**Total biologie** : 10 chapitres, 50 simulations (plus une optionnelle). Priorité : B3-2 et B3-4, B5-1 et B5-2, B7-3, B8-2, B9-1 et B9-2, B10-1.

---

## PARTIE C. STATISTIQUE (biostatistique BA1)

### C.1 Positionnement

Les fiches convergent sur six blocs : statistique descriptive, probabilités et distributions, TCL et échantillonnage, intervalles de confiance, tests d'hypothèse (p-valeur, erreurs de première et de seconde espèce, puissance), et régression/corrélation. À cela s'ajoutent les tests diagnostiques et les mesures d'association (ULB, ULiège), ainsi que les pièges d'interprétation (UNamur). Le format retenu par les évaluations est le QCM suivi de questions ouvertes (UCLouvain, UNamur) : il faut donc des simulations qui **donnent une intuition** et des exercices qui **entraînent aux pièges**.

### C.2 Dix chapitres

**S1 Statistique descriptive** (UCLouvain : variables et distributions empiriques ; UNamur : statistiques descriptives et barres d'erreur)
1. `types-de-variables-echelles` : quantitative, qualitative, ordinale ; quel résumé pour quelle variable.
2. `histogramme-et-largeur-de-classe` : l'aspect de la distribution change avec le découpage ; asymétrie.
3. `moyenne-mediane-aberrante` : effet d'une valeur extrême sur la moyenne, la médiane, l'écart-type.
4. `boite-a-moustaches-quartiles` : lecture d'une boîte, valeurs atypiques, comparaison de groupes.
5. `ecart-type-contre-erreur-standard` : confusion fréquente, barres d'erreur de deux sortes.

**S2 Probabilités** (ULiège EPID0110-3 : fréquences relatives et probabilité des affections ; UCLouvain : variables aléatoires)
1. `probabilite-frequentiste-simulation` : convergence d'une fréquence vers la probabilité (loi des grands nombres).
2. `evenements-union-intersection-venn` : règle de l'addition, événements incompatibles et indépendants.
3. `arbre-de-probabilites` : tirages successifs, enchaînement conditionnel.
4. `probabilite-conditionnelle-independance` : tableaux de contingence, indépendance contre dépendance.
5. `combinatoire-dans-les-croisements` : arrangements et combinaisons appliqués à la génétique (lien B9).

**S3 Bayes et tests diagnostiques** (ULB MEDI-G2205 : tests diagnostiques ; ULiège : probabilités pour interpréter les résultats médicaux)
1. `sensibilite-specificite-vpp-vpn` : tableau 2×2 interactif ; seuil d'un test.
2. `prevalence-et-valeur-predictive` : pour un test fixe, la valeur prédictive positive s'effondre quand la prévalence baisse (effet dépistage).
3. `theoreme-de-bayes-effectifs` : reformulation en fréquences naturelles (« sur 1000 personnes… »).
4. `courbe-roc-seuil` : déplacer le seuil, compromis sensibilité/spécificité, aire sous la courbe.
5. `rapports-de-vraisemblance-fagan` : probabilité pré-test et post-test.

**S4 Lois binomiale, de Poisson, normale** (UCLouvain : distributions de probabilité ; UNamur : loi normale)
1. `binomiale-n-p` : forme selon n et p, espérance et variance ; effets sur des risques (n enfants, p de porter un allèle).
2. `poisson-evenements-rares` : comptages (cellules, désintégrations, mutations), approximation de la binomiale.
3. `normale-aire-z` : aires sous la courbe, score z, règle 68-95-99,7.
4. `approximation-normale-de-la-binomiale` : quand elle marche, correction de continuité.
5. `normalite-qq-et-transformation-log` : reconnaître une distribution asymétrique, transformation logarithmique (UNamur).

**S5 Échantillonnage et théorème central limite** (UCLouvain : TCL ; ULB : distribution d'échantillonnage)
1. `distribution-moyennes-echantillons` : tirage répété, histogramme des moyennes selon n.
2. `tcl-loi-de-depart-quelconque` : population uniforme, exponentielle ou bimodale ; la moyenne tend vers la normale.
3. `erreur-standard-racine-n` : précision qui ne s'améliore que comme √n ; coût d'une précision double.
4. `biais-de-selection-echantillonnage` : aléatoire, systématique, par grappes, convenance ; biais d'un échantillon non représentatif.
5. `regression-vers-la-moyenne` : pourquoi un résultat extrême est suivi d'un résultat plus modéré (UNamur).

**S6 Intervalles de confiance** (ULB : IC d'une moyenne et d'une proportion ; UCLouvain : estimation)
1. `ic-moyenne-100-echantillons` : 100 intervalles à 95 % ; combien contiennent la vraie moyenne (≈ 95).
2. `ic-largeur-n-niveau-ecart-type` : comment la largeur change avec n, le niveau de confiance et la dispersion.
3. `ic-proportion-sondage-marge-erreur` : marge d'erreur et taille nécessaire (UNamur : marge d'erreur).
4. `student-contre-normale-petits-effectifs` : quantiles t et z, degrés de liberté.
5. `interpretation-correcte-ic` : ce que « 95 % » veut dire et ne veut pas dire (QCM-piège).

**S7 Tests d'hypothèse** (ULB : p-valeur, erreurs de première et de seconde espèce, puissance ; UNamur : p-valeur, significativité biologique contre statistique, tests multiples)
1. `test-de-conformite-moyenne` : H₀, H₁, statistique, p-valeur, région critique, décision.
2. `erreurs-alpha-beta-puissance` : déplacer la moyenne réelle et le seuil, lire α, β et la puissance sur deux courbes.
3. `taille-echantillon-puissance` : planifier une étude (UCLouvain : « planifier une étude »).
4. `p-valeur-et-grands-echantillons` : un effet minuscule devient « significatif » avec n énorme (significativité statistique contre biologique).
5. `tests-multiples-p-hacking` : 20 tests indépendants, risque d'un faux positif (UNamur : tests aléatoires répétés) ; correction de Bonferroni.

**S8 Comparaison de moyennes** (ULB : Student apparié et indépendant ; tests non paramétriques)
1. `student-deux-echantillons-independants` : différence de moyennes, variance combinée, t, p.
2. `student-apparie-avant-apres` : gain de puissance quand on apparie ; essai avant/après traitement.
3. `anova-intuition-variance-inter-intra` : trois groupes ou plus, rapport de variances, pourquoi pas plusieurs t.
4. `tests-non-parametriques-rangs` : Mann-Whitney et Wilcoxon, quand préférer (petits effectifs, asymétrie).
5. `taille-d-effet-d-de-cohen` : différence standardisée, lecture d'un essai clinique.

**S9 Test du χ²** (ULB : test χ²)
1. `chi2-adequation-mendel` : comparer 3:1 ou 9:3:3:1 aux effectifs observés ; degrés de liberté (lien B9-1).
2. `chi2-independance-tableau-contingence` : effectifs théoriques, χ², p.
3. `risque-relatif-odds-ratio` : mesures d'association dans un essai de cohorte ou cas-témoins (ULB, ULiège).
4. `conditions-effectifs-theoriques-fisher` : effectifs théoriques < 5, test exact de Fisher.
5. `paradoxe-de-simpson` : un effet qui s'inverse après stratification (confusion).

**S10 Corrélation et régression** (UCLouvain : introduction à la régression ; ULB : régression et corrélation ; UNamur : corrélation contre causalité)
1. `nuage-de-points-coefficient-r` : r selon le nuage ; r = 0 n'est pas indépendance.
2. `droite-moindres-carres-residus` : ajuster la droite à la main, minimiser la somme des carrés des résidus.
3. `quartet-d-anscombe-et-points-influents` : quatre jeux avec même r et même droite, mais structures différentes.
4. `correlation-contre-causalite-confusion` : variable cachée, associations parasites (glaces et noyades).
5. `regression-logistique-intro` : probabilité d'un événement binaire, odds, courbe sigmoïde (ULB : modèles logistiques en cycle supérieur : option).

**Total statistique** : 10 chapitres, 50 simulations. Priorité : S3 (3 sims), S5-2, S6-1, S7-2, S7-5, S9-3, S10-3.

---

## 3. Charge et ordre de travail suggéré

| Domaine | Chapitres | Simulations | Exercices à produire (cible A.1 : 19 par chapitre) |
|---|---|---|---|
| Chimie | 19 (dont 9 sans exercices) | 68 nouvelles (22 existantes) | 60 (compléments) + 171 (neufs) = 231 |
| Biologie | 10 | 50 | 190 |
| Statistique | 10 | 50 | 190 |

Ordre conseillé :
1. Chimie, les 12 simulations prioritaires ci-dessus (elles débloquent les ponts).
2. Biologie B3, B5, B7, B9, B10 (quantitatif, le plus demandé par les évaluations).
3. Statistique S3, S5, S6, S7, S9 (le noyau commun à toutes les fiches).
4. Chimie chapitres 2, 10, 14 et 19 en exercices (les neuf chapitres sans exercice).
5. Tout le reste, avec la règle des étoiles de la section A.1.

Vérifications à faire avant publication :
- Obtenir l'annexe ARES 2027 quand elle sera publiée (la checklist du projet le note déjà) pour ajuster B7, B9, B10.
- Faire valider par un enseignant de l'ULB la liste de biologie et de biostatistique de BA1 : je n'ai pas pu confirmer de fiche ULB de BA1.
- Demander à un étudiant de BA1 quels chapitres des fiches (ULiège en particulier) tombent sous forme de calcul plutôt que de mémoire, pour trier les simulations B1 et B2, que j'ai jugées moins prioritaires.
