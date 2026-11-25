# Audit : les 17 cours de `secondaire/` comparés au programme français

Audit fait le 26/11/2026, lot `lycee`. Il ne modifie rien : les chapitres hors programme sont seulement signalés, et c'est Enzo qui décide.

Correspondance des niveaux : `3e` = 3e (fin de collège), `4e` = Seconde, `5e` = Première, `6e` = Terminale.
`maths/5e_t` est une copie de `maths/5e` faite de liens symboliques : il a le même audit que `maths/5e`.

Légende du verdict :
- **G** : à garder à ce niveau ;
- **D → niveau** : notion du programme français, mais d'un autre niveau ;
- **H** : hors programme français, au collège comme au lycée.

« Partiel » veut dire qu'une partie du chapitre relève d'un autre niveau.

## Programmes de référence

Ce sont les programmes en vigueur pour l'année 2026-2027.

| Matière | 3e | Seconde | Première (spécialité) | Terminale (spécialité) |
|---|---|---|---|---|
| Physique-chimie | cycle 4, BO n° 31 du 30/07/2020 | BO spécial n° 1 du 22/01/2019 | BO spécial n° 1 du 22/01/2019 | BO spécial n° 8 du 25/07/2019 |
| SVT | cycle 4, BO n° 31 du 30/07/2020 | BO spécial n° 1 du 22/01/2019 | BO spécial n° 1 du 22/01/2019 | BO spécial n° 8 du 25/07/2019 |
| Mathématiques | cycle 4, BO n° 31 du 30/07/2020 | **nouveau programme**, BO n° 14 du 02/04/2026 | **nouveau programme**, BO n° 14 du 02/04/2026 | BO spécial n° 8 du 25/07/2019 (nouveau programme en 2027) |

**Ce qui change pour les maths :**
- Le nouveau programme du cycle 4 (BO n° 10 du 05/03/2026) n'arrive en 3e qu'en 2028-2029.
- Le nouveau programme de Terminale (BO n° 14 de 2026) s'appliquera à la rentrée 2027. Il faudra refaire l'audit de Terminale à ce moment-là.
- L'épreuve anticipée de maths de Première (session 2028) commence par des automatismes, sans calculatrice. Elle ne change pas le programme, mais elle justifierait des exercices d'automatismes.

**Points non vérifiés :**
- Pour la physique-chimie et la SVT de 2019-2020, le détail des notions a été repris des programmes connus. Il n'a pas été relu ligne à ligne dans les PDF, sauf la structure du programme de Terminale de physique-chimie.
- Le cycle 4 n'est pas découpé par année. Une notion « de cycle 4 » peut en pratique être traitée en 5e ou en 4e de collège plutôt qu'en 3e.
- La SVT comprend aussi les **géosciences**. Aucun des quatre cours de biologie du site n'en parle : c'est le trou le plus large du lot.

Sources :
- https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602914A
- https://www.education.gouv.fr/bo/2026/Hebdo10/MENE2602912A
- https://www.education.gouv.fr/bo/19/Special8/MENE1921249A.htm
- https://eduscol.education.gouv.fr/1648/programmes-et-ressources-en-physique-chimie-voie-gt
- https://eduscol.education.gouv.fr/5835/programmes-et-ressources-en-sciences-de-la-vie-et-de-la-terre-voie-gt

## Bilan

| Cours | G | D | H | Plus gros trous |
|---|---|---|---|---|
| 3e · Physique-chimie · physique | 6 | 3 | 1 | mouvement et vitesse, signaux (lumière, son), Univers |
| Seconde · Physique-chimie · physique | 4 | 6 | 0 | forces et principe d'inertie, son, spectres, capteurs |
| Première · Physique-chimie · physique | 3 | 7 | 0 | énergie mécanique, ondes progressives, photon, fluides au repos |
| Terminale · Physique-chimie · physique | 3 | 1 | 6 | thermodynamique, mouvement dans un champ, Bernoulli, lunette, effet photoélectrique, circuit RC |
| 3e · Physique-chimie · chimie | 5 | 3 | 2 | états de la matière, masse volumique, tests d'ions |
| Seconde · Physique-chimie · chimie | 5 | 4 | 1 | configuration électronique et Lewis, dosage par étalonnage, transformations nucléaires |
| Première · Physique-chimie · chimie | 6 | 3 | 1 | avancement, oxydoréduction, Beer-Lambert, titrage, groupes caractéristiques |
| Terminale · Physique-chimie · chimie | 7 | 2 | 1 | cinétique, quotient de réaction et K, conductimétrie |
| 3e · SVT | 10 | 0 | 0 | géologie, génétique, évolution, immunité, système nerveux, reproduction |
| Seconde · SVT | 6 | 4 | 0 | biodiversité et évolution, géosciences, sols et agrosystèmes, sexualité, microbiote |
| Première · SVT | 1 | 5 | 4 | mitose et expression génétique, mutations et cancers, tectonique, écosystèmes |
| Terminale · SVT | 6 | 2 | 2 | Hardy-Weinberg, géologie (datation, orogenèse), climats, plante domestiquée, système nerveux et muscle |
| 3e · Mathématiques | 9 | 1 | 0 | statistiques, probabilités, arithmétique, transformations, volumes, Scratch |
| Seconde · Mathématiques | 5 | 5 | 0 | droites, nombres et intervalles, probabilités conditionnelles, proportions et évolutions, Python |
| Première · Mathématiques (et sa copie 5e_t) | 5 | 5 | 0 | second degré, exponentielle, variables aléatoires, probabilités totales |
| Terminale · Mathématiques | 7 | 1 | 2 | suites et récurrence, convexité, loi des grands nombres, sinus et cosinus |
| **Total (16 cours distincts, 160 chapitres)** | **88** | **52** | **20** | |

Une grande partie des chapitres à déplacer passe simplement d'un niveau du site à un autre. Par exemple :
- la mécanique de « 5e » (Belgique) est en Seconde et en Terminale en France ;
- l'énergie de « 4e » est en Première ;
- la génétique moléculaire de « 4e » est en Première.

On peut donc **redistribuer les chapitres entre les quatre niveaux** plutôt que d'en écrire de nouveaux. Mais un chapitre déplacé change de `ch` et d'URL, ce que la règle 4 interdit. Il faut donc choisir l'une de ces solutions :
- garder le chapitre où il est et le présenter comme « rappel » ou « pour aller plus loin » ;
- refaire une simulation équivalente au bon niveau, avec un nouvel `id`.

---

## Physique-chimie · physique

### 3e (`secondaire/physique/3e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Électrostatique : charges et interactions | Pas dans le cycle 4 (l'électrisation par frottement n'y figure pas). Les charges électriques reviennent avec Coulomb en Première. | H |
| 2 | Le circuit électrique et le courant | Cycle 4 : circuits, schémas normalisés | G |
| 3 | Intensité et tension | Cycle 4 : lois d'unicité et d'additivité, mesures | G |
| 4 | Résistance et loi d'Ohm | Cycle 4 : U = R·I | G |
| 5 | Circuits en série et en dérivation | Cycle 4 | G |
| 6 | Puissance, énergie électrique et sécurité | Cycle 4 : P = U·I, E = P·t, kWh | G |
| 7 | Forces, poids et masse | Cycle 4 : interactions, force, P = m·g | G |
| 8 | Résultante de forces et équilibre | Seconde : modélisation des forces, principe d'inertie | D → Seconde |
| 9 | Pression : solides, liquides, gaz | Première : statique des fluides, loi de Mariotte | D → Première |
| 10 | Poussée d'Archimède, flottaison, fluides en mouvement | Terminale : Archimède, débit, Bernoulli | D → Terminale |

Notions du programme absentes, avec une proposition de simulation :
- **Mouvement :** référentiel, trajectoire, v = d/t, mouvement uniforme ou accéléré. Simulation : un cycliste filmé depuis le bord de la route et depuis une voiture.
- **Énergie et conversions :** Ec = ½mv², chaînes énergétiques. Simulation : une éolienne ou un barrage avec une chaîne énergétique animée.
- **Signaux :** lumière (c ≈ 3·10⁸ m/s, année-lumière), son (milieu, 340 m/s, fréquence, ultrasons, dB). Simulation : un orage où l'on mesure la distance de la foudre en comptant les secondes entre l'éclair et le tonnerre.
- **Univers et système solaire :** échelles de distance. Simulation : un zoom de la Terre à la galaxie.

### Seconde (`secondaire/physique/4e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Mouvement et vitesse | Seconde : référentiel, vecteur vitesse | G |
| 2 | Accélération et MRUA | Terminale : vecteur accélération, mouvement rectiligne uniformément accéléré | D → Terminale |
| 3 | Chute libre et graphes du mouvement | Terminale : chute libre dans un champ uniforme | D → Terminale |
| 4 | Énergie cinétique et potentielle | Première : énergie mécanique | D → Première |
| 5 | Travail, puissance et rendement | Première : travail d'une force, théorème de l'énergie cinétique, rendement | D → Première |
| 6 | Conservation et dégradation de l'énergie | Première : conservation ou non de l'énergie mécanique | D → Première |
| 7 | Lumière : sources, ombres et éclipses | Cycle 4 : propagation rectiligne | D → 3e |
| 8 | Réflexion de la lumière | Seconde : lois de Snell-Descartes (partiel) | G |
| 9 | Réfraction, réflexion totale et dispersion | Seconde : Snell-Descartes, dispersion | G |
| 10 | Lentilles, œil et couleurs | Seconde : lentille convergente, grandissement, œil. La relation de conjugaison et les synthèses de couleurs sont en Première. | G (partiel) |

Notions du programme absentes, avec une proposition de simulation :
- **Interactions et principe d'inertie :** force de gravitation F = G·m·m′/d², réaction d'un support, tension d'un fil, actions réciproques. Ces notions sont aujourd'hui en Première, chapitres 1, 2 et 4. Simulation : un palet sur la glace avec un bilan des forces.
- **Son :** période, fréquence, hauteur, timbre, niveau d'intensité sonore. Simulation : une guitare dont on voit l'oscillogramme.
- **Spectres et longueur d'onde.** Simulation : des spectres de lampes vus à travers un réseau.
- **Signaux et capteurs :** loi des mailles, caractéristique d'un dipôle, thermistance, photorésistance. Simulation : une station météo à capteurs.

### Première (`secondaire/physique/5e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Vecteurs, composition et décomposition des forces | Seconde : modélisation des forces | D → Seconde |
| 2 | Équilibre statique et première loi de Newton | Seconde : principe d'inertie. Le moment d'une force est hors programme. | D → Seconde |
| 3 | Deuxième loi de Newton | Première : m·Δv/Δt ≈ ΣF. La forme complète est en Terminale. | G (partiel) |
| 4 | Troisième loi de Newton et quantité de mouvement | Seconde : actions réciproques. Terminale : quantité de mouvement, propulsion. | D → Seconde / Terminale |
| 5 | Frottements, plan incliné et projectiles | Terminale : mouvement dans un champ uniforme | D → Terminale |
| 6 | Mouvement circulaire uniforme | Terminale : repère de Frenet | D → Terminale |
| 7 | Gravitation universelle et mouvement des astres | Première : champ de gravitation. Terminale : lois de Kepler, satellites. | D → Terminale |
| 8 | Champ et force électriques | Première : loi de Coulomb, champ électrostatique, condensateur plan | G |
| 9 | Potentiel, énergie électrique et condensateur | Terminale : circuit RC, particule chargée dans un champ électrique | D → Terminale |
| 10 | Lois de Kirchhoff et générateurs | Première : source réelle U = E − r·I, effet Joule, rendement. Les lois des nœuds et des mailles sont en Seconde. | G |

Notions du programme absentes, avec une proposition de simulation :
- **Énergie mécanique :** Ec, Ep, travail, théorème de l'énergie cinétique. Ces notions sont aujourd'hui en Seconde, chapitres 4 à 6.
- **Fluides au repos :** p_B − p_A = ρ·g·(z_A − z_B), loi de Mariotte. Simulation : un plongeur et une seringue fermée.
- **Ondes mécaniques progressives :** retard, célérité, λ = v·T. Simulation : une ola dans un stade, puis une onde sur une corde avec deux capteurs.
- **Images et couleurs :** relation de conjugaison, synthèses additive et soustractive.
- **Photon :** E = h·ν, niveaux d'énergie, spectres de raies. Simulation : un atome d'hydrogène dont on règle le photon absorbé.

### Terminale (`secondaire/physique/6e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Magnétisme et champ magnétique | Absent de Terminale (et de tout le lycée) | H |
| 2 | Force de Lorentz et force de Laplace | Absent de Terminale | H |
| 3 | Induction électromagnétique | Absent de Terminale | H |
| 4 | Courant alternatif, transformateur et réseau | Absent de Terminale | H |
| 5 | Oscillations et vibrations | Absent de Terminale (oscillateurs exclus) | H |
| 6 | Ondes mécaniques : propagation et propriétés | Première : ondes progressives. La diffraction et les interférences sont en Terminale. | D → Première (partiel) |
| 7 | Le son : hauteur, intensité, effet Doppler | Terminale : niveau en dB, atténuation, effet Doppler. Les tuyaux sonores relèvent de l'enseignement scientifique de Première. | G |
| 8 | Ondes électromagnétiques, interférences et spectres | Terminale : diffraction θ = λ/a, interférences. Les spectres sont en Première. | G |
| 9 | Atome, noyau et radioactivité | Terminale : décroissance radioactive, demi-vie. Le modèle de Bohr est en Première. | G |
| 10 | Physique et santé ; climat et énergie | Enseignement scientifique (tronc commun), pas la spécialité | H |

Notions du programme absentes, avec une proposition de simulation :
- **Thermodynamique :** 1er principe ΔU = W + Q, capacité thermique, transferts thermiques, résistance thermique, loi de Newton du refroidissement, gaz parfait pV = nRT. Simulations : une tasse de café qui refroidit ; une maison vue à la caméra thermique.
- **Mouvement dans un champ uniforme et 2e loi de Newton vectorielle.** Ces notions sont en Première, chapitres 3 et 5.
- **Mécanique des fluides :** Archimède, débit, Bernoulli. Simulation : un tuyau d'arrosage qu'on pince.
- **Lunette astronomique et grossissement.**
- **Effet photoélectrique et cellule photovoltaïque.**
- **Circuit RC et constante de temps.** Simulation : le flash d'un appareil photo.

## Physique-chimie · chimie

### 3e (`secondaire/chimie/3e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Mélanges, corps purs et techniques de séparation | Cycle 4 : mélanges, corps purs, identification | G |
| 2 | Du modèle particulaire aux modèles de l'atome | Cycle 4 : atome, noyau, électrons ; histoire du modèle | G |
| 3 | Isotopes et masse atomique | Seconde : Z, A, isotopes | D → Seconde |
| 4 | Tableau périodique : métaux et non-métaux | Seconde : tableau périodique, familles | D → Seconde |
| 5 | Ions et molécules | Cycle 4 : ions, molécules | G |
| 6 | Solutions et concentration massique | Seconde : concentration en masse, dilution. La solubilité est au cycle 4. | D → Seconde (partiel) |
| 7 | Réaction chimique et conservation de la masse | Cycle 4 : conservation de la masse, équation de réaction | G |
| 8 | Formules et nomenclature des corps minéraux | Nomenclature systématique des oxydes, bases et sels : absente des programmes français | H |
| 9 | Dissociation ionique et conductibilité | Absent du cycle 4. La conductimétrie de Terminale est un autre sujet. | H |
| 10 | Acides, bases et neutralisation | Cycle 4 : pH, solutions acides et basiques, sécurité | G |

Notions du programme absentes, avec une proposition de simulation :
- **États et changements d'état.** Simulation : courbe de température de l'eau du glaçon à la vapeur.
- **Masse volumique ρ = m/V.** Simulation : objets plongés dans une éprouvette graduée.
- **Tests d'identification des ions et des gaz :** soude, nitrate d'argent, eau de chaux, allumette.
- **Univers et matière :** la plupart des éléments chimiques viennent des étoiles.

### Seconde (`secondaire/chimie/4e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Nomenclature des substances inorganiques | Absente des programmes français | H |
| 2 | La mole et le nombre d'Avogadro | Seconde : mole, N_A | G |
| 3 | Masse molaire et calculs de masse | Première : n = m/M (la Seconde se limite à la masse d'une entité) | D → Première |
| 4 | Gaz : volume molaire et lois des gaz | Première : loi de Mariotte. Terminale : pV = nRT. | D → Première / Terminale |
| 5 | Lire une équation : rapports stœchiométriques | Seconde : stœchiométrie | G |
| 6 | Calculs stœchiométriques | Seconde (puis avancement en Première) | G |
| 7 | Réactif limitant, excès et rendement | Seconde : réactif limitant. Le rendement est en Première. | G |
| 8 | Concentration, dilution, préparation de solutions | Seconde : concentration en masse, dilution. La concentration en mol/L est en Première. | G (partiel) |
| 9 | pH, acides et bases en solution | Terminale : pH, couples acide-base. Le titrage est en Première. | D → Terminale |
| 10 | Précipitation et introduction à l'oxydoréduction | Première : oxydoréduction. La précipitation est hors programme. | D → Première |

Notions du programme absentes, avec une proposition de simulation :
- **Configuration électronique et schémas de Lewis de molécules simples.** Ces notions sont aujourd'hui en Première, chapitre 1.
- **Dosage par étalonnage :** échelle de teintes, masse volumique. Simulation : un sirop de menthe à doser par comparaison.
- **Transformations physiques :** énergie de changement d'état Q = m·L.
- **Transformations nucléaires :** équation, conservation de Z et de A.
- **Chromatographie et extraction.** Simulation : séparer les colorants d'un bonbon.

### Première (`secondaire/chimie/5e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Structure électronique et schéma de Lewis | Première : Lewis. La configuration électronique est en Seconde. | G |
| 2 | Liaisons covalente, ionique et métallique | Première : électronégativité, polarité, cohésion des solides | G |
| 3 | Géométrie des molécules et solides cristallins | Première : géométrie VSEPR, polarité | G |
| 4 | Eau, polarité, liaison hydrogène et solubilité | Première : cohésion, solubilité | G |
| 5 | Chaleur, température et effet thermique | Terminale : Q = m·c·ΔT, 1er principe | D → Terminale |
| 6 | Calorimétrie et pouvoir calorifique | Première : énergie de combustion, pouvoir calorifique. La loi de Hess est hors programme. | G (partiel) |
| 7 | Vitesse d'une réaction et catalyse | Terminale : cinétique | D → Terminale |
| 8 | Équilibres chimiques et constante K | Terminale : quotient de réaction Q et constante K | D → Terminale |
| 9 | Principe de Le Chatelier | Absent du lycée français | H |
| 10 | Alcanes et combustion | Première : nomenclature, combustions | G |

Notions du programme absentes, avec une proposition de simulation :
- **Avancement et tableau d'avancement.** Simulation : une réaction en ballon avec un curseur d'avancement x.
- **Oxydoréduction et demi-équations.** Aujourd'hui en Seconde, chapitre 10.
- **Loi de Beer-Lambert et spectrophotométrie.** Simulation : un spectrophotomètre et une gamme de solutions de sulfate de cuivre.
- **Titrage colorimétrique et équivalence.**
- **Groupes caractéristiques et nomenclature.** Aujourd'hui en Terminale, chapitre 1.
- **Spectroscopie IR.** Simulation : reconnaître les bandes O–H et C=O d'un spectre.
- **Synthèse et rendement.**
- **Savons :** partie hydrophile et partie lipophile.

### Terminale (`secondaire/chimie/6e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Alcools, aldéhydes, cétones et acides carboxyliques | Première : groupes caractéristiques et nomenclature | D → Première |
| 2 | Estérification, hydrolyse et saponification | Terminale : synthèse, optimisation, rendement | G |
| 3 | Alcènes, polymères et plastiques | Terminale : stratégie de synthèse et modification de chaîne (les polymères sont à vérifier dans le BO) | G (partiel) |
| 4 | Acides et bases : couples, Ka et pH | Terminale : Ka, pKa, diagramme de prédominance | G |
| 5 | Titrages, solutions tampons et pH des sels | Terminale : titrage pH-métrique, tampons (qualitatif). Le pH des sels est hors programme. | G |
| 6 | Solubilité et précipitation (Ks) | Absent de Terminale | H |
| 7 | Oxydoréduction : transferts d'électrons | Première. Le nombre d'oxydation est hors programme. | D → Première |
| 8 | Piles et potentiels standards | Terminale : piles. Les potentiels standards sont hors programme. | G |
| 9 | Électrolyse et applications industrielles | Terminale : électrolyse, Q = n·F | G |
| 10 | Chimie du quotidien et analyse de substances courantes | Terminale : dosages (en application) | G (partiel) |

Notions du programme absentes, avec une proposition de simulation :
- **Cinétique :** vitesse volumique, temps de demi-réaction, ordre 1. Aujourd'hui en Première, chapitre 7.
- **Quotient de réaction Q, constante K, sens d'évolution spontanée.** Aujourd'hui en Première, chapitre 8.
- **Conductimétrie et loi de Kohlrausch, titrage conductimétrique.** Simulation : une conductimétrie où l'on voit les ions qui remplacent les autres.
- **Diagramme de distribution.**
- **Décroissance radioactive.** Elle est en Terminale côté physique, chapitre 9.

## SVT

### 3e (`secondaire/biologie/3e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Chaînes et réseaux trophiques | Cycle 4 : écosystèmes | G |
| 2 | Flux d'énergie, pyramides et rendement | Cycle 4 : écosystèmes, impact humain | G |
| 3 | Appareil digestif et digestion | Cycle 4 : digestion, microorganismes | G |
| 4 | Absorption et transport des nutriments | Cycle 4 | G |
| 5 | Respiration : échanges gazeux et circulation | Cycle 4 | G |
| 6 | Respiration cellulaire | Cycle 4 : besoins des cellules. La fermentation est en Seconde. | G |
| 7 | La feuille et les échanges chez les végétaux | Cycle 4 : nutrition des végétaux | G |
| 8 | La photosynthèse | Cycle 4 | G |
| 9 | Cycles de la matière et équilibre d'un écosystème | Cycle 4 | G |
| 10 | Perturbations, impact humain et biodiversité | Cycle 4 : action humaine, biodiversité | G |

Tout est au cycle 4. Mais ces thèmes sont plutôt traités en 5e et 4e de collège, et les grands thèmes de 3e manquent.

Notions du programme absentes, avec une proposition de simulation :
- **Géologie :** structure du globe, tectonique des plaques, séismes et volcans, risques naturels. Simulation : un sismographe et des plaques que l'on fait glisser.
- **Météo et climat.**
- **Génétique :** ADN, gènes, allèles, chromosomes, méiose et fécondation simplifiées. Simulation : tirer au sort les chromosomes d'un enfant.
- **Évolution et parentés :** sélection naturelle.
- **Immunité :** vaccination, antibiotiques, microbes. Simulation : une épidémie dans une classe selon la part de vaccinés.
- **Système nerveux.**
- **Puberté, reproduction, contraception.**

### Seconde (`secondaire/biologie/4e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Niveaux d'organisation et observation de la cellule | Seconde : organisme pluricellulaire, cellules | G |
| 2 | Organites et leurs fonctions | Seconde | G |
| 3 | Membrane, diffusion et osmose | Seconde : échanges cellulaires (partiel) | G |
| 4 | Enzymes et catalyse biologique | Seconde : métabolisme et enzymes | G |
| 5 | Photosynthèse : phases et facteurs | Seconde : autotrophie (le cycle de Calvin détaillé n'est pas exigé) | G |
| 6 | Respiration cellulaire et fermentation | Seconde : respiration et fermentation | G |
| 7 | ATP et bilan énergétique de la cellule | Terminale : ATP et contraction musculaire | D → Terminale |
| 8 | ADN, chromosomes et réplication | Première : réplication semi-conservative | D → Première |
| 9 | Du gène à la protéine | Première : transcription, traduction, code génétique | D → Première |
| 10 | Cycle cellulaire et mitose | Première : mitose | D → Première |

Notions du programme absentes, avec une proposition de simulation :
- **Biodiversité et évolution :** dérive génétique, sélection naturelle. Aujourd'hui en Terminale, chapitre 6. Simulation : une dérive génétique sur une petite île.
- **Géosciences et paysages :** érosion, transport, sédimentation. Simulation : une rivière qui creuse sa vallée et dépose ses sédiments.
- **Sols et agrosystèmes, cycles du carbone et de l'azote.**
- **Procréation et sexualité :** hormones, contraception, infections sexuellement transmissibles. Aujourd'hui en Première, chapitres 8 et 9.
- **Microbiote et pathogènes.**

### Première (`secondaire/biologie/5e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Neurone, influx nerveux et système nerveux | Terminale : potentiel d'action, motricité | D → Terminale |
| 2 | Synapse, réflexe et intégration nerveuse | Terminale : réflexe myotatique, synapse, plasticité | D → Terminale |
| 3 | Hormones, rétrocontrôle et glycémie | Glycémie et diabète absents des spécialités de 2019 (le rétrocontrôle revient avec le stress en Terminale) | H |
| 4 | Homéostasie et thermorégulation | Absent | H |
| 5 | Défenses de l'organisme et immunité | Première : immunité innée et adaptative, vaccination | G |
| 6 | Excrétion : reins et bilan hydrique | Absent | H |
| 7 | Reproduction asexuée, sexuée et méiose | Terminale : méiose, brassages génétiques | D → Terminale |
| 8 | Appareils reproducteurs et gamétogenèse | Seconde : procréation (et cycle 4) | D → Seconde |
| 9 | Cycle menstruel, fécondation et contraception | Seconde : procréation et sexualité | D → Seconde |
| 10 | Embryogenèse, développement et grossesse | Absent du lycée | H |

Notions du programme absentes, avec une proposition de simulation :
- **Mitose, réplication, transcription et traduction.** Aujourd'hui en Seconde, chapitres 8 à 10.
- **Mutations et réparation de l'ADN, variation génétique et santé :** cancers, mucoviscidose, résistance aux antibiotiques. Simulation : une colonie de bactéries sous antibiotique.
- **Dynamique interne de la Terre :** ondes sismiques P et S, lithosphère et asthénosphère, géotherme, dorsales, subduction. Simulations : des ondes sismiques traversant un globe en coupe ; une dorsale qui s'ouvre.
- **Écosystèmes et services environnementaux.** Aujourd'hui en Terminale, chapitre 9.

### Terminale (`secondaire/biologie/6e`)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Hérédité monohybride | Terminale : génotype, croisements, test-cross | G |
| 2 | Dihybridisme et indépendance des gènes | Terminale : brassage interchromosomique | G |
| 3 | Hérédité liée au sexe et gènes liés | Terminale : brassage intrachromosomique, crossing-over | G |
| 4 | Génétique humaine, mutations et maladies génétiques | Première : mutations, variation génétique et santé | D → Première |
| 5 | Génie génétique et biotechnologies | Absent des spécialités (PCR, CRISPR) | H |
| 6 | Évolution : sélection naturelle et adaptation | Seconde et Terminale : dérive, sélection (Hardy-Weinberg manque) | G |
| 7 | Spéciation, preuves de l'évolution et phylogénie | Terminale : évolution, datation | G |
| 8 | Origine de la vie, classification et diversité | Absent (la classification est au cycle 4) | H |
| 9 | Écologie : populations, niches et interactions | Première : écosystèmes et interactions | D → Première |
| 10 | Écosystèmes, cycles et enjeux globaux | Terminale : climats, cycle du carbone (partiel) | G |

Notions du programme absentes, avec une proposition de simulation :
- **Modèle de Hardy-Weinberg.** Simulation : des fréquences alléliques sur plusieurs générations.
- **Complexification des génomes :** transferts horizontaux, endosymbiose.
- **Passé géologique :** datation relative et absolue, droite isochrone, orogenèse et ophiolites (Alpes). Simulation : une horloge radioactive Rb/Sr avec sa droite isochrone.
- **Climats passés et futurs :** δ¹⁸O, glaciations, scénarios du GIEC.
- **De la plante sauvage à la plante domestiquée.**
- **Système nerveux et muscle, contraction et ATP, stress.** Aujourd'hui en Première, chapitres 1 et 2.

## Mathématiques

### 3e (`secondaire/maths/3e`, programme de 2020)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Calcul numérique et expressions algébriques | Cycle 4 : calcul littéral, identités remarquables | G |
| 2 | Fonctions : graphiques, tableaux, formules | Cycle 4 : image, antécédent | G |
| 3 | Fonctions du premier degré | Cycle 4 : fonctions linéaires et affines | G |
| 4 | Équations du premier degré | Cycle 4 | G |
| 5 | Inéquations du premier degré | Cycle 4 | G |
| 6 | Systèmes de deux équations | Seconde (2026) : droites et intersection | D → Seconde |
| 7 | Angles et cas d'isométrie des triangles | Cycle 4 : angles, triangles égaux et semblables | G |
| 8 | Pythagore et nombres irrationnels | Cycle 4 : Pythagore, racine carrée (les irrationnels sont en Seconde) | G |
| 9 | Thalès, rapports et similitude | Cycle 4 | G |
| 10 | Trigonométrie du triangle rectangle | Cycle 4 | G |

Notions du programme absentes, avec une proposition de simulation :
- **Statistiques :** moyenne, médiane, étendue.
- **Probabilités à une ou deux épreuves.** Simulation : des lancers de dés en masse, où la fréquence se rapproche de la probabilité.
- **Arithmétique :** nombres premiers, décomposition. Simulation : un crible d'Ératosthène animé.
- **Puissances et notation scientifique.**
- **Transformations :** translation, rotation, homothétie.
- **Volumes et agrandissement :** coefficients k, k², k³.
- **Repérage sur la sphère :** latitude et longitude.
- **Algorithmique (Scratch).**
- **Proportionnalité et pourcentages.**

### Seconde (`secondaire/maths/4e`, nouveau programme de 2026)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Fonctions de référence et transformations | Seconde : fonctions de référence, variations | G |
| 2 | Racines, radicaux et polynômes | Seconde : racines, calcul. La division des polynômes est hors programme. | G (partiel) |
| 3 | Fonction du second degré | Première : second degré | D → Première |
| 4 | Équations du second degré | Première : discriminant | D → Première |
| 5 | Signe, inéquations et domaine | Seconde : tableaux de signes, inéquations | G |
| 6 | Cercle trigonométrique et radians | Première : cercle trigonométrique, radian | D → Première |
| 7 | Triangles quelconques et trigonométrie | Première : Al-Kashi. La loi des sinus est hors programme. | D → Première |
| 8 | Calcul vectoriel dans le plan | Seconde : vecteurs, colinéarité, déterminant | G |
| 9 | Lieux géométriques, cercle et tangentes | Première : équation de cercle. L'angle inscrit est hors programme. | D → Première |
| 10 | Statistique descriptive | Seconde : moyenne, médiane, écart type | G |

Notions du programme absentes, avec une proposition de simulation :
- **Droites :** vecteur directeur, équation cartésienne et équation réduite, pente, intersection. Simulation : une droite que l'on attrape, avec son équation en direct.
- **Nombres :** ensembles ℕ, ℤ, ℚ, ℝ, intervalles, valeur absolue vue comme une distance.
- **Arithmétique :** multiples, diviseurs, parité.
- **Proportions et évolutions :** pourcentages successifs et réciproques. Simulation : des soldes puis une hausse de prix.
- **Probabilités conditionnelles et arbres :** faux positifs d'un test. Simulation : un dépistage dans une ville de 10 000 habitants.
- **Fluctuation d'échantillonnage et loi des grands nombres simulée.**
- **Logique et Python.**

### Première (`secondaire/maths/5e` et sa copie `5e_t`, nouveau programme de 2026)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Fonctions : opérations, composition, réciproque | Terminale : composée. La réciproque est hors programme. | D → Terminale |
| 2 | Suites arithmétiques et géométriques | Première : suites, sommes, limite intuitive | G |
| 3 | Limites de fonctions | Terminale | D → Terminale |
| 4 | Asymptotes et continuité | Terminale : continuité, théorème des valeurs intermédiaires | D → Terminale |
| 5 | Dérivée : définition, tangente, règles | Première : nombre dérivé, tangente, règles (sauf la composée) | G |
| 6 | Dérivée : monotonie, extrema, optimisation | Première | G |
| 7 | Étude complète de fonction | Première (partiel). L'étude avec limites est en Terminale. | G (partiel) |
| 8 | Trigonométrie : formules et équations | Le programme de Première de 2026 ne garde que le cercle et les valeurs remarquables. Les fonctions sinus et cosinus sont en Terminale (programme de 2019). Les formules d'addition sont hors programme de spécialité. | D → Terminale |
| 9 | Géométrie de l'espace : incidence, sections | Terminale : géométrie dans l'espace | D → Terminale |
| 10 | Repère orthonormé et produit scalaire | Première : produit scalaire, Al-Kashi, projeté orthogonal | G |

Notions du programme absentes, avec une proposition de simulation :
- **Second degré.** Aujourd'hui en Seconde, chapitres 3 et 4.
- **Fonction exponentielle :** f′ = f, modèles e^(kt), méthode d'Euler. Aujourd'hui en Terminale, chapitre 1. Simulation : construire la courbe de l'exponentielle par la méthode d'Euler, avec un pas réglable.
- **Probabilités totales, répétition d'épreuves de Bernoulli (n ≤ 4), variables aléatoires :** espérance, variance, formule de König-Huygens. Simulation : un jeu de fête foraine ; est-il rentable ?
- **Méthode de Monte-Carlo.** Simulation : estimer π avec des fléchettes.
- **Méthode de Newton.**
- **Automatismes pour l'épreuve anticipée.**

Les marques « (6 h : … ) » des attendus sont un découpage belge. Elles sont gardées pour l'instant et seulement redéfinies comme « approfondissements » (voir le compte rendu).

### Terminale (`secondaire/maths/6e`, programme de 2019 en 2026-2027)

| # | Chapitre actuel | Notion du programme français | Verdict |
|---|---|---|---|
| 1 | Exponentielles et logarithmes | Terminale : ln. L'exponentielle est en Première. Les bases a quelconques sont hors programme. | G (partiel) |
| 2 | Dérivation de eˣ et ln x, étude de fonctions | Terminale : composée, limites, croissances comparées | G |
| 3 | Primitives | Terminale | G |
| 4 | Intégrale définie, aires et volumes | Terminale : intégrale, intégration par parties, valeur moyenne. Les volumes de révolution sont hors programme. | G |
| 5 | Droites et plans dans l'espace | Terminale | G |
| 6 | Systèmes linéaires 3×3 | Hors spécialité (les matrices sont en maths expertes) | H |
| 7 | Statistique à deux variables | Hors spécialité (maths complémentaires, enseignement scientifique) | H |
| 8 | Analyse combinatoire et binôme de Newton | Terminale : dénombrement | G |
| 9 | Probabilités | Première (et Seconde en 2026) : probabilités conditionnelles, probabilités totales | D → Première |
| 10 | Variables aléatoires, loi binomiale, loi normale | Terminale : loi binomiale. La loi normale est hors programme. | G (partiel) |

Notions du programme absentes, avec une proposition de simulation :
- **Suites :** récurrence, limites, gendarmes, convergence monotone. Simulation : une toile d'araignée u(n+1) = f(u(n)).
- **Limites, continuité, théorème des valeurs intermédiaires.** Aujourd'hui en Première, chapitres 3 et 4.
- **Convexité et point d'inflexion.**
- **Fonctions sinus et cosinus :** dérivées, périodicité.
- **Équations différentielles y′ = a·y + b.**
- **Somme de variables aléatoires, Bienaymé-Tchebychev, loi faible des grands nombres.** Simulation : la moyenne de n dés qui se concentre.

À revoir en 2027, quand le nouveau programme de Terminale entrera en vigueur.
