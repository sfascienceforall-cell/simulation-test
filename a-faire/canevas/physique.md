# Analyse d'écarts : physique (P01–P22) et électricité niveau 3 (E01–E08)

Couverture vérifiée dans la physique BA1 (86 pages), puis dans les cours à moteur (secondaire/physique 3e à 6e, et chimie, biologie, maths BA1 quand ils montrent vraiment la notion).
Statut : **couvert** (une simulation universitaire montre la notion), **partiel** (seulement au secondaire, ou un seul aspect), **manquant**, ou *sans objet* (méthode, pièges, formulaire : pas de simulation utile).
Couverture d'un chapitre : (couvertes + ½ partielles) / sections de matière ; bonne ≥ 70 %, partielle ≥ 40 %, faible au-dessous, nulle à 0.
Les chapitres E sont de niveau N3 : leurs propositions sont classées au plus P2, car P1 est réservé aux notions N1.

## E01 · Champ électrique et superposition
Couverture **partielle** · couvertes : 2 · partielles : 1 · manquantes : 3 · sans objet : 1.
Manque : Les distributions continues de charge ; Le fil chargé, fini puis infini ; Anneau, disque et plan.

- **P2** `el-champ-distributions` · Du point au continu : fil, anneau, disque (N3, section PH8). Une tige, un anneau ou un disque en 3D se découpe en N petites charges ; chaque dE part vers le point P et la somme se construit flèche par flèche. On règle N, la longueur du fil et la position de P : la courbe E(z) rejoint la formule exacte, le fil long devient infini et le disque devient un plan. *Tout le cœur du chapitre (distributions continues, fil, anneau, disque, cas limites) est absent. Notion N3 : P2 au plus.*

## E02 · Le dipôle électrique
Couverture **partielle** · couvertes : 1 · partielles : 3 · manquantes : 2 · sans objet : 1.
Manque : Du discret au continu ; L'approximation dipolaire.

- **P2** `el-dipole-couple` · Un dipôle dans un champ : couple et énergie (N3, section PH8). Une molécule d'eau en 3D flotte entre deux plaques ; on la tourne à la souris et elle revient en oscillant vers l'alignement, avec le couple et la courbe U(θ) = −pE·cos θ en direct. Un onglet rend le champ non uniforme (près d'une sphère chargée) : la molécule alignée est attirée, comme le filet d'eau dévié par une règle frottée. *Couple, stabilité et force en champ non uniforme n'existent nulle part ; très visuel.*
- **P3** `el-dipole-loin` · Pourquoi 1/r³ : le dipôle vu de loin (N3, section PH8). On promène une sonde autour d'un dipôle dont on règle l'écartement d ; deux courbes log-log montrent E(r) exact et l'approximation dipolaire, de pente −3 contre −2 pour une charge seule. L'erreur en % s'affiche et tombe sous 1 % dès que r dépasse une dizaine de d. *Approximation dipolaire absente ; bon complément de potentiel-carte.*

## E03 · Le théorème de Gauss
Couverture **faible** · couvertes : 0 · partielles : 1 · manquantes : 5 · sans objet : 1.
Manque : Surface fermée et surface de Gauss ; L'énoncé du théorème ; Les symétries et le choix de la surface ; Quand le théorème ne sert à rien ; La forme locale.

- **P2** `el-gauss-flux-ferme` · Flux à travers une surface fermée (N3, section PH8). Des charges qu'on déplace et une surface fermée en 3D (sphère, cube ou « patate » déformable) ; chaque ligne de champ qui sort compte +1, chaque ligne qui entre −1, et le compteur affiche Φ = Q_int/ε₀. On déforme la surface : le flux ne change pas ; on sort une charge : sa contribution tombe à zéro même si le champ change partout. *Le théorème de Gauss est totalement absent du site ; c'est la notion clé de l'électricité niveau 3.*
- **P3** `el-flux-surface-plane` · Flux à travers une surface plane (N3, section PH8). Un cadre rectangulaire en 3D dans un champ uniforme, avec son vecteur surface ; on le fait pivoter à la souris et les lignes qui le traversent se comptent. Φ = E·S·cos θ s'affiche, nul quand le cadre est parallèle au champ ; un onglet remplace le cadre par une calotte hémisphérique. *Prépare la notion de flux ; peut être un onglet de el-gauss-flux-ferme.*

## E04 · Gauss appliqué aux distributions
Couverture **faible** · couvertes : 0 · partielles : 1 · manquantes : 5 · sans objet : 1.
Manque : Flux et théorème de Gauss ; La sphère pleine uniformément chargée ; Coquilles et densités variables ; La symétrie cylindrique ; Continuité, raccords et lecture des graphes.

- **P2** `el-gauss-distributions` · Gauss appliqué : E(r) de la boule, du fil, du plan (N3, section PH8). Une distribution en coupe 3D (boule pleine, coquilles emboîtées, cylindre, câble coaxial ou plan) et sa surface de Gauss qu'on agrandit en glissant ; la charge enfermée se colore et la courbe E(r) se trace en direct. On choisit une densité uniforme ou ρ(r) décroissante : on voit où E est maximal, où il est continu et où il saute. *Tout le chapitre est absent ; une seule scène couvre les trois symétries et la lecture des graphes.*

## E05 · Potentiel électrostatique et travail
Couverture **partielle** · couvertes : 4 · partielles : 0 · manquantes : 2 · sans objet : 1.
Manque : Les potentiels des distributions classiques ; L'énergie d'un système de charges.

- **P3** `el-energie-assemblage` · Assembler des charges une à une (N3, section PH8). On amène des charges depuis le bord de l'écran (l'infini) et on les pose ; chaque nouvelle paire fait apparaître un lien coloré avec son énergie kq₁q₂/r. Le total U se met à jour, et le travail à fournir pour la dernière charge se lit sur une jauge ; un preset carré de quatre charges sert de vérification. *Seule section vraiment visuelle qui manque ; les potentiels de distributions peuvent aller dans el-gauss-distributions (courbe V(r)).*

## E06 · Conducteurs et condensateurs
Couverture **partielle** · couvertes : 2 · partielles : 4 · manquantes : 0 · sans objet : 1.

- **P2** `el-influence-totale` · Une charge dans une coquille métallique (N3, section PH8). Une coquille conductrice en coupe 3D et une charge qu'on déplace à l'intérieur ; les charges induites se répartissent sur la face interne et la face externe, avec les lignes de champ dedans et dehors. On relie la coquille à la terre : le champ extérieur disparaît, c'est l'écran électrostatique. *Influence totale et écran absents ; la scène sert aussi à la cage de Faraday.*
- **P3** `el-pouvoir-pointes` · Deux sphères reliées : le pouvoir des pointes (N3, section PH8). Deux sphères de rayons réglables reliées par un fil ; on charge l'ensemble et les charges se partagent, plus serrées sur la petite. Le champ en surface se lit en couleur et l'air s'illumine (effet couronne) quand il dépasse 3 MV/m. *Complète Conducteur avec le calcul σ/ε₀ et le claquage.*

## E07 · Milieux diélectriques
Couverture **faible** · couvertes : 0 · partielles : 1 · manquantes : 5 · sans objet : 1.
Manque : Les charges de polarisation ; Susceptibilité, permittivité et vecteur D ; L'interface entre deux milieux ; Le condensateur à diélectrique ; Rigidité diélectrique et claquage.

- **P2** `el-condensateur-dielectrique` · Glisser une lame de verre entre les armatures (N3, section PH8). Un condensateur plan en 3D et une lame qu'on enfonce à la souris ; on choisit « générateur débranché » (Q constant, U baisse) ou « générateur branché » (U constant, Q monte), et la lame est aspirée. On monte la tension jusqu'au claquage : une étincelle traverse l'isolant le plus faible. *Section très visuelle, absente ; couvre aussi la rigidité diélectrique.*
- **P2** `el-polarisation-milieu` · Dans la matière polarisée (N3, section PH8). Un zoom sur un bloc de matière entre deux plaques : nuages électroniques qui se décalent (non polaire) ou molécules qui pivotent (polaire). Les charges liées apparaissent sur les faces, le champ interne se réduit à E₀/εᵣ et les vecteurs P, E et D s'affichent côte à côte. *Charges de polarisation et vecteur P absents.*
- **P3** `el-interface-dielectrique` · Les lignes de champ se brisent à l'interface (N3, section PH8). Deux milieux (huile et verre) séparés par une interface ; on oriente le champ incident et on règle les εᵣ. Les lignes se brisent selon tan θ₁/tan θ₂ = ε₁/ε₂, avec les composantes tangentielle de E et normale de D qui se conservent. *Relations de passage absentes ; moins central.*

## E08 · Courant et loi d'Ohm locale
Couverture **faible** · couvertes : 0 · partielles : 4 · manquantes : 2 · sans objet : 1.
Manque : Résistance d'un conducteur de forme quelconque ; Conservation de la charge.

- **P2** `el-conduction-drude` · Dans le fil : agitation, chocs et dérive (N3, section PH9). Un zoom 3D dans un fil de cuivre : les électrons filent en zigzag à 10⁵ m/s et rebondissent sur le réseau d'ions. On applique un champ E : une dérive minuscule s'ajoute, et v_d, τ, j = σE s'affichent ; un front lumineux montre que le signal part tout de suite alors que l'électron rampe. *Le modèle microscopique n'existe qu'au secondaire, sans chocs ni j = σE.*
- **P3** `el-resistance-tranches` · Résistance d'un tronc de cône : la méthode des tranches (N3, section PH9). Un conducteur en forme de tronc de cône se découpe en N tranches qui s'allument une à une ; la somme des ρ·dx/S(x) converge vers la formule exacte quand N augmente. Un onglet fait la fuite radiale d'un câble : des coquilles cylindriques remplacent les tranches. *Méthode centrale du chapitre, sans support visuel aujourd'hui.*

## P01 · Cinématique à une dimension
Couverture **bonne** · couvertes : 4 · partielles : 2 · manquantes : 0 · sans objet : 2.

- **P2** `ph-lancer-vertical` · Lancer vertical : le signe de g suit l'axe (N1, section PH1). Une personne au bord d'un balcon lance une balle vers le haut ; la balle laisse une trace stroboscopique, et y(t), v(t), a(t) se tracent en même temps. On règle v₀ et la hauteur, on retourne l'axe (vers le haut ou vers le bas) et tous les signes changent ; un bouton ajoute l'air et fait apparaître la vitesse limite. *Chute libre N1 couverte seulement au secondaire ; le piège du signe de g n'est montré nulle part.*
- **P2** `ph-aller-retour` · Un aller-retour : déplacement ou distance ? (N1, section PH1). Un joggeur court sur une piste droite, fait demi-tour et revient en partie ; deux compteurs affichent le déplacement et la distance parcourue. On fait glisser le point de demi-tour : x(t) montre une tangente horizontale et v(t) change de signe au même instant. *Distinction N1 absente du site ; aide aussi à lire x(t) et v(t).*

## P02 · Cinématique à deux dimensions
Couverture **bonne** · couvertes : 6 · partielles : 1 · manquantes : 0 · sans objet : 1.

- **P2** `ph-traversee-riviere` · Traverser une rivière qui coule (N1, section PH1). Vue du dessus d'une rivière avec son courant ; une barque part d'une rive et on oriente son cap à la souris. Le triangle des vitesses (barque/eau + eau/rive) se dessine, la trajectoire dérive vers l'aval, et on cherche l'angle qui fait accoster juste en face. *Composition des vitesses couverte en partie ; la situation type de la rivière est absente.*

## P03 · Dynamique du point : les lois de Newton
Couverture **bonne** · couvertes : 7 · partielles : 0 · manquantes : 0 · sans objet : 1.

Aucune proposition : le chapitre est bien couvert.

## P04 · Dynamique du point II Frottements, pente, chocs
Couverture **bonne** · couvertes : 4 · partielles : 2 · manquantes : 0 · sans objet : 2.

- **P2** `ph-looping` · Le looping : la vitesse minimale au sommet (N1, section PH2). Un wagon de montagnes russes avec un passager dessiné part d'une hauteur qu'on règle et entre dans une boucle ; P et N sont dessinés en haut et en bas. Sous h = 2,5 R, N tombe à zéro avant le sommet et le wagon décroche. *Le looping (N1) n'existe nulle part ; la force centripète n'est couverte qu'en partie.*
- **P2** `ph-airbag-impulsion` · Airbag : même impulsion, choc plus long (N1, section QM). Crash test au ralenti : la tête du mannequin heurte le volant, puis l'airbag. La courbe F(t) se trace : même aire (Δp), mais un pic dix fois plus bas quand Δt s'allonge ; on règle la vitesse et la raideur du coussin. *Impulsion N1 couverte seulement au secondaire ; lien direct avec la médecine (traumatismes).*
- **P3** `ph-virage-voiture` · Le virage : frottement ou route relevée (N1, section PH2). Une voiture vue en 3D aborde un virage ; on règle la vitesse, le rayon, l'adhérence (sec, mouillé, verglas) et l'inclinaison. Les forces se dessinent, et au-delà de la vitesse limite la voiture part tout droit, tangente à la courbe. *Déjà au secondaire (p5-c06-virage) et en partie dans tourniquet.*

## P05 · Travail, énergie et puissance
Couverture **bonne** · couvertes : 3 · partielles : 4 · manquantes : 0 · sans objet : 1.

- **P2** `ph-puissance-corps` · Monter un escalier, sauter : énergie et puissance du corps (N1, section PH4). Un personnage dessiné monte un escalier, saute ou soulève une charge ; on règle sa masse, la hauteur et la durée. Ep gagnée, puissance en watts et énergie métabolique (rendement musculaire ≈ 25 %, en kcal) se comparent à des repères : ampoule, cycliste, sprint. *Puissance, rendement et biomécanique N1 : rien en BA1.*
- **P2** `ph-bilan-travaux` · Le théorème de l'énergie cinétique, force par force (N1, section PH4). Une luge tirée par une corde monte une pente avec frottement ; chaque force a sa barre de travail (W_P, W_N, W_f, W_T) qui grandit pendant le trajet. La somme des barres est toujours égale à ΔEc, affichée à côté ; on change l'angle de la corde, μ et la pente. *Le théorème de l'énergie cinétique (N1) n'est montré nulle part.*
- **P2** `ph-diagramme-energie` · Lire un diagramme d'énergie potentielle (N2, section PH4). On dessine une courbe Ep(x) à la souris (ou on choisit ressort, molécule, puits) et on lâche une bille avec une énergie E réglable. La bille oscille entre les points où E = Ep, les zones interdites se grisent, et les équilibres stables et instables se marquent. *N2 très visuelle ; resservira pour la gravitation et la chimie.*

## P06 · Statique du solide moment, équilibre, leviers
Couverture **bonne** · couvertes : 4 · partielles : 1 · manquantes : 1 · sans objet : 2.
Manque : Applications biomécaniques.

- **P1** `ph-biceps-avant-bras` · L'avant-bras : la force du biceps (N1, section PH3). Un bras en 3D (humérus, radius, biceps attaché à 4 cm du coude) tient un haltère ; on règle la masse et l'angle du coude, et le biceps gonfle avec la force qu'il doit fournir. F_biceps ≈ 10 × le poids de l'haltère et la réaction au coude s'affichent avec leurs bras de levier. *Cas phare des études de médecine et de kiné, très visuel, absent du site.*
- **P2** `ph-leviers-corps` · Les trois genres de leviers dans le corps (N1, section PH3). Trois scènes dessinées : la tête sur la colonne (1er genre), se mettre sur la pointe des pieds (2e), l'avant-bras (3e). On déplace l'appui, la charge ou la force motrice et l'avantage mécanique se lit sur une jauge. *Couvert seulement par la balançoire (1er genre).*
- **P2** `ph-poutre-deux-appuis` · Une planche sur deux tréteaux (N1, section PH3). Un personnage marche sur une planche posée sur deux tréteaux ; les réactions des appuis montent et descendent comme deux barres. Au-delà d'un tréteau, une réaction tombe à zéro et la planche bascule. *Situation type N1 absente ; complète moment_de_force.*

## P07 · Dynamique du solide en rotation
Couverture **bonne** · couvertes : 4 · partielles : 2 · manquantes : 1 · sans objet : 1.
Manque : La deuxième loi de Newton en rotation.

- **P1** `ph-rotation-sigma-m` · Faire tourner : ΣM = I·α et le moment d'inertie (N1, section PH2). Un tourniquet de labo en 3D : une masse qui tombe déroule une ficelle autour de l'axe et fait tourner une tige portant deux masses. On écarte les masses ou on change l'axe (milieu ou bout de la tige) : I = Σmr² change, α se mesure et Huygens-Steiner se vérifie. *ΣM = I·α (N1 central) est absent du site ; la poulie massive suit au même endroit.*
- **P1** `ph-patineuse` · La patineuse qui rentre les bras (N1, section PH2). Une patineuse dessinée en 3D tourne sur la glace ; on replie ou on écarte ses bras à la souris. I baisse, ω monte, L = I·ω reste constant et l'énergie de rotation augmente (les bras travaillent) ; un onglet fait la même chose sur un tabouret avec deux haltères. *Conservation du moment cinétique (N1), très visuelle, rien sur le site.*

## P08 · Gravitation universelle
Couverture **bonne** · couvertes : 3 · partielles : 4 · manquantes : 0 · sans objet : 1.

- **P2** `ph-apesanteur` · Apesanteur : trois situations, une seule physique (N1, section PH3). La même personne sur une balance dans trois décors : ascenseur dont le câble casse, avion en vol parabolique, station spatiale. La balance lit zéro partout alors que g vaut encore 8,7 m/s² à 400 km : tout tombe ensemble. *N1 couverte seulement en partie (ascenseur) et au secondaire.*
- **P3** `ph-puits-gravitation` · Le puits de potentiel : liée ou libre ? (N2, section PH3). Une surface en entonnoir 3D représente Ep = −GMm/r ; on lance une bille avec une vitesse réglable. Si E < 0 elle reste en orbite, si E ≥ 0 elle s'échappe ; l'énergie d'un satellite (−GMm/2r) se lit sur l'échelle. *N2, en partie couverte par le canon de Newton.*
- **P3** `ph-champ-g-interieur` · g dehors et dedans : le tunnel à travers la Terre (N2, section PH3). La Terre en coupe avec sa carte de champ ; on laisse tomber une pomme dans un tunnel qui la traverse. g(r) se trace : linéaire dedans, en 1/r² dehors, et la pomme oscille d'un bout à l'autre en 42 minutes. *Carte du champ (N1) en partie couverte ; g à l'intérieur (N2) absent.*

## P09 · Statique des fluides
Couverture **partielle** · couvertes : 2 · partielles : 3 · manquantes : 1 · sans objet : 2.
Manque : Les applications médicales.

- **P1** `ph-perfusion-posture` · Perfusion et posture : ρgh dans le corps (N1, section FL). Un patient au lit avec une poche de perfusion qu'on monte ou qu'on descend sur la potence ; la pression à l'aiguille se compare à la pression veineuse et la goutte coule ou le sang reflue. Un second onglet montre une personne couchée, debout ou bras levé, avec la pression en mmHg à la tête, au cœur et aux pieds. *Application médicale N1, au cœur du public visé, absente du site.*
- **P2** `ph-pression-profondeur` · p = p₀ + ρgh : la sonde et le paradoxe (N1, section FL). Une sonde reliée à un manomètre plonge dans une piscine puis dans des vases de formes différentes ; on la fait glisser à la souris. Même profondeur, même pression, quelle que soit la forme ; un bouton bascule entre pression absolue et relative. *Loi fondamentale et paradoxe couverts seulement au secondaire.*

## P10 · Dynamique des fluides débit, Bernoulli, viscosité
Couverture **partielle** · couvertes : 4 · partielles : 1 · manquantes : 2 · sans objet : 1.
Manque : Décrire un écoulement ; La résistance hydraulique.

- **P1** `ph-reynolds` · Laminaire ou turbulent : l'expérience de Reynolds (N1, section FL). Un filet d'encre est injecté dans l'eau qui coule dans un tube de verre ; on ouvre la vanne et le filet reste droit, ondule puis se brise en tourbillons. Re = ρvD/η s'affiche avec ses seuils, et un onglet passe au sang dans l'aorte (souffle cardiaque). *Deux notions N1 du chapitre, très visuelles, absentes du site.*
- **P2** `ph-vidange-torricelli` · Vidange d'un réservoir : la vitesse de Torricelli (N1, section FL). Un réservoir percé de trous qu'on place à différentes hauteurs ; les jets sortent avec v = √(2gh) et leurs paraboles se dessinent. Le niveau baisse, le jet faiblit, et la courbe h(t) se trace. *Seuls les jets du bidon du secondaire s'en approchent.*
- **P3** `ph-reseau-vasculaire` · Résistances hydrauliques : un réseau d'artères (N2, section FL). Un réseau de vaisseaux en série et en parallèle avec la pompe cardiaque ; on rétrécit une artériole et les débits se redistribuent. L'analogie avec un circuit électrique (ΔP = R·Q) s'affiche à côté. *N2, utile pour la physiologie ; prolonge poiseuille.*

## P11 · Électrostatique
Couverture **bonne** · couvertes : 4 · partielles : 3 · manquantes : 0 · sans objet : 1.

- **P2** `ph-condensateur-plan` · Condensateur plan : écarte les armatures (N1, section PH8). Deux armatures en 3D dont on fait glisser l'écart et la surface, générateur branché ou débranché ; les charges, les lignes de champ et C = ε₀S/d, Q, U, E, énergie se mettent à jour. Un onglet zoome sur une membrane cellulaire (7 nm, −70 mV) : des ions de part et d'autre, et sa capacité de 1 µF/cm². *La charge d'un condensateur (N1) est couverte en partie ; la géométrie et la membrane (lien médecine) manquent.*
- **P2** `ph-cage-faraday` · La cage de Faraday (N1, section PH8). Une personne dans une cage métallique à côté d'un générateur de Van de Graaff ; on approche la sphère et des étincelles frappent la cage. Les lignes de champ s'arrêtent sur le grillage et le champ dedans reste nul ; on ouvre une porte de la cage pour voir la différence. *N1 non couverte, Conducteur montre déjà E = 0 dans le métal.*

## P12 · Courant, loi d'Ohm et circuits
Couverture **bonne** · couvertes : 5 · partielles : 2 · manquantes : 0 · sans objet : 1.

- **P2** `ph-courant-corps` · Le courant qui traverse le corps (N1, section PH9). Une personne touche un appareil dont le boîtier est sous tension ; on choisit peau sèche ou mouillée, et le trajet main-main ou main-pied. Le courant en mA se place sur l'échelle des seuils (perception, tétanisation, fibrillation) et le différentiel de 30 mA coupe ou non. *Seuils dangereux (N1) couverts seulement en partie au secondaire ; lien direct avec la médecine.*
- **P2** `ph-generateur-reel` · La pile réelle : U = E − r·I (N1, section PH9). Une pile ouverte montre sa résistance interne ; on tourne un rhéostat et les points (I, U) s'alignent sur une droite de pente −r. Au court-circuit, la pile chauffe et U tombe à zéro. *Générateur réel (N1) couvert seulement au secondaire.*

## P13 · Magnétisme
Couverture **bonne** · couvertes : 3 · partielles : 3 · manquantes : 0 · sans objet : 2.

- **P1** `ph-loi-ampere` · La loi d'Ampère : faire le tour des courants (N1, section PH11). On dessine à la souris un contour fermé autour d'un ou plusieurs fils (courants entrants et sortants) ; B·dl s'additionne le long du contour jusqu'à μ₀·I_enc, quelle que soit sa forme. Des onglets appliquent la loi au fil (B = μ₀I/2πr), au solénoïde, au tore et au câble coaxial. *Déjà prévue dans A-FAIRE-SIMULATIONS.md ; c'est la clé des « trois formules de source ».*
- **P2** `ph-spectrometre-masse` · Spectromètre de masse avec sélecteur de vitesse (N1, section PH11). Une chambre à vide en 3D : des ions accélérés par U passent un sélecteur (E et B croisés) puis décrivent un demi-cercle dans B. Chaque isotope frappe la plaque à son endroit ; on règle U, E et B pour séparer ¹²C et ¹³C. *Spectromètre (N1) couvert seulement au secondaire ; sélecteur de vitesse (N2) absent.*
- **P2** `ph-lorentz-helice` · Cercle, hélice et aurores polaires (N2, section PH11). Une particule entre dans un champ B uniforme avec un angle qu'on règle ; à 90° elle tourne en cercle, sinon elle dessine une hélice. Un onglet montre des protons du vent solaire qui s'enroulent autour des lignes du champ terrestre jusqu'aux pôles. *N2 très visuelle ; Cyclotron ne montre que le cercle.*
- **P2** `ph-irm-principe` · Le principe de l'IRM (N2, section PH11). Des protons, petites toupies, s'orientent au hasard puis s'alignent dans le champ B₀ d'un aimant en 3D ; une impulsion radio les fait basculer et ils reviennent en émettant un signal. On règle B₀ et la fréquence de Larmor change (42,6 MHz/T). *N2 très visuelle et propre au public médecine ; rien sur le site.*

## P14 · Induction électromagnétique
Couverture **partielle** · couvertes : 1 · partielles : 5 · manquantes : 1 · sans objet : 1.
Manque : Auto-induction et inductance.

- **P1** `ph-rails-induction` · La barre qui glisse sur des rails : e = B·L·v (N1, section PH11). Des rails en 3D dans un champ B et une barre qu'on tire à la souris ; l'aire balayée se colore, e = BLv allume une ampoule et la force de Laplace freine la barre. Lâchée, la barre ralentit et s'arrête : le bilan de puissance s'affiche. *Situation N1 type de Faraday et de Lenz, absente ; les rails de aimants-laplace peuvent servir de base.*
- **P2** `ph-alternateur-3d` · Le cadre tournant : de la rotation à la sinusoïde (N1, section PH10). Un cadre de N spires tourne entre les pôles d'un aimant ; on le fait tourner à la manivelle, à la souris. Φ(t) et e(t) se tracent en phase décalée, et quand on branche une charge la manivelle devient plus dure. *Couvert seulement au secondaire ; courant-alternatif ne montre pas d'où vient la sinusoïde.*
- **P2** `ph-foucault` · Courants de Foucault : freiner et chauffer (N1, section PH11). Un disque de cuivre tourne entre les pôles d'un aimant qu'on approche ; des boucles de courant apparaissent dans le métal et le disque freine. Un onglet montre une plaque à induction qui chauffe le fond d'une casserole en fer, pas en verre. *N1 couverte seulement au secondaire (tube de cuivre).*
- **P2** `ph-auto-induction` · Deux lampes : la bobine retarde le courant (N1, section PH11). Deux lampes en parallèle, l'une avec une résistance, l'autre avec une bobine à noyau de fer ; on ferme l'interrupteur et la seconde s'allume en retard. À l'ouverture, une étincelle jaillit ; la courbe i(t) montre τ = L/R. *Absent du site ; une seule notion N1 dans la section, les autres sont N2.*

## P15 · Les ondes : description et propagation
Couverture **bonne** · couvertes : 5 · partielles : 2 · manquantes : 0 · sans objet : 1.

- **P3** `ph-corde-jonction` · Deux cordes nouées : une partie passe, une partie revient (N2, section PH5). Une corde légère nouée à une corde lourde ; on envoie une impulsion d'un coup de souris. À la jonction, une impulsion transmise continue plus lentement et une impulsion réfléchie revient, retournée ou non selon le sens du passage. *N2 ; complète reflexion-obstacle. Le son en P16 couvre l'onde longitudinale.*

## P16 · Le son, l'intensité sonore et l'effet Doppler
Couverture **bonne** · couvertes : 4 · partielles : 4 · manquantes : 0 · sans objet : 1.

- **P2** `ph-son-onde-pression` · Le son : un haut-parleur pousse l'air (N1, section PH5). La membrane d'un haut-parleur vibre et pousse des milliers de molécules d'air qu'on voit se serrer et s'écarter ; une molécule marquée oscille sur place pendant que les compressions avancent. Sous la scène, la courbe p(x) ; on change de milieu (air, eau, os, acier) et la vitesse change. *N1 couverte seulement en partie (tuyaux, onde longitudinale du secondaire).*
- **P2** `ph-echographie` · Échographie : le trajet d'une impulsion (N1, section PH5). Une sonde posée sur un ventre envoie une impulsion qui traverse peau, graisse, foie et rein ; à chaque interface une partie revient (impédance Z). Les échos s'affichent en temps (mode A) et la profondeur d = v·t/2 ; on règle la fréquence et la résolution s'oppose à la profondeur. *N1 couverte au secondaire seulement ; cœur du public médecine.*
- **P2** `ph-doppler-sanguin` · Doppler sanguin : mesurer la vitesse du sang (N2, section PH5). Une sonde inclinée sur une artère où défilent des globules rouges ; Δf = 2f·v·cos θ/c s'affiche et on l'entend. On règle l'angle, la vitesse et une sténose qui accélère le flux. *N2 très visuelle et médicale ; Doppler n'a que la source en mouvement.*
- **P3** `ph-timbre` · Le timbre : même note, instruments différents (N1, section PH5). La même note de 440 Hz jouée par une flûte, un violon ou une clarinette ; la forme du signal et son spectre d'harmoniques s'affichent. On monte ou on baisse chaque harmonique avec des curseurs et le son change (Web Audio du navigateur). *Timbre absent ; moins central.*

## P17 · Optique géométrique I Réflexion et miroirs
Couverture **bonne** · couvertes : 4 · partielles : 2 · manquantes : 1 · sans objet : 1.
Manque : Les miroirs sphériques.

- **P1** `ph-miroir-spherique` · Miroirs concave et convexe (N1, section PH6). Un miroir de maquillage (concave) ou un rétroviseur (convexe) et une bougie qu'on déplace le long de l'axe ; les trois rayons de construction se tracent et l'image se forme, réelle ou virtuelle. On voit l'image changer de nature quand la bougie passe C puis F, et la relation de conjugaison se vérifie. *Section N1 entière absente du site, ni BA1 ni secondaire.*
- **P2** `ph-arc-en-ciel` · Prisme et goutte d'eau : l'arc-en-ciel (N2, section PH6). Un faisceau blanc entre dans une goutte d'eau géante ; chaque couleur se réfracte, se réfléchit au fond et ressort à un angle différent (≈ 42° pour le rouge). Un second onglet place l'observateur dos au Soleil : l'arc se dessine dans le ciel et bouge avec lui. *Dispersion (N1) au secondaire seulement ; arc-en-ciel (N2) très visuel.*
- **P2** `ph-profondeur-apparente` · La profondeur apparente d'un bassin (N2, section PH6). Un caillou au fond d'une piscine et un œil qu'on déplace au-dessus ; les rayons se brisent à la surface et l'image du caillou remonte. La profondeur apparente (≈ 3/4 de la vraie) varie avec l'angle de vue. *N2 très visuelle, absente.*

## P18 · Lentilles, œil et instruments
Couverture **bonne** · couvertes : 6 · partielles : 0 · manquantes : 0 · sans objet : 2.

- **P3** `ph-astigmatisme` · L'astigmatisme : deux focales dans un œil (N2, section PH7). Une cornée en 3D plus bombée dans un sens que dans l'autre ; un faisceau donne deux lignes focales au lieu d'un point et une croix vue par l'œil est nette dans une direction seulement. On ajoute un verre cylindrique et on le tourne jusqu'à corriger. *N2 ; oeil couvre déjà les trois autres défauts.*
- **P3** `ph-lunette-appareil-photo` · Lunette astronomique et appareil photo (N2, section PH7). Onglet lunette : objectif et oculaire, la Lune vue sous un angle agrandi. Onglet appareil photo : on fait la mise au point en déplaçant le capteur et on voit la profondeur de champ. *N2 ; prolonge loupe-microscope.*

## P19 · Température, chaleur et changements d'état
Couverture **partielle** · couvertes : 2 · partielles : 3 · manquantes : 2 · sans objet : 1.
Manque : La dilatation thermique ; Les trois modes de transfert.

- **P1** `ph-transferts-thermiques` · Conduction, convection, rayonnement (N1, section TH). Une maison en coupe en hiver : la chaleur traverse le mur par conduction (flux selon l'épaisseur et λ), l'air tourne en boucles de convection devant le radiateur, et le poêle rayonne en infrarouge. On règle l'isolant, l'écart de température et l'émissivité, et chaque flux s'affiche en watts ; un onglet fait le bilan du corps humain. *Section N1 entière absente, très visuelle.*
- **P1** `ph-dilatation` · La dilatation : rails, ponts et barre chauffée (N1, section TH). Une barre chauffée sur un banc pousse l'aiguille d'un comparateur ; ΔL = α·L₀·ΔT s'affiche selon le métal. Un onglet montre une voie ferrée de l'hiver à l'été (le joint se ferme) et un autre un lac qui gèle par le haut à cause de l'eau à 4 °C. *Section N1 absente du site, très visuelle.*
- **P2** `ph-glace-vapeur` · Chauffer 1 kg de glace de −20 à 120 °C (N1, section TH). Un bloc de glace dans une casserole sur un réchaud de puissance réglable ; les particules passent de l'ordre au désordre et la courbe T(Q) se trace avec ses deux paliers. Les énergies de chaque étape s'empilent en barres : la vaporisation coûte près de sept fois la fusion. *Palier montré au secondaire ; chaleur latente absente en BA1.*
- **P2** `ph-zero-absolu` · Trouver le zéro absolu avec un ballon de gaz (N1, section TH). Un ballon de verre fermé relié à un manomètre plonge tour à tour dans de l'azote liquide, de la glace et de l'eau bouillante ; les points p(θ) s'alignent. On prolonge la droite : elle coupe p = 0 à −273 °C, pour tous les gaz et toutes les quantités. *Zéro absolu et échelles (N1) non montrés.*

## P20 · Gaz parfaits et principes de la thermodynamique
Couverture **bonne** · couvertes : 5 · partielles : 0 · manquantes : 2 · sans objet : 1.
Manque : Le deuxième principe ; Les machines thermiques.

- **P1** `ph-machine-thermique` · Moteur, frigo, pompe à chaleur : le cycle (N1, section TH). Un cylindre en 3D tourne son cycle pendant que le point se déplace dans le diagramme p-V ; l'aire du cycle (travail net) se remplit et les flèches Q_c et Q_f relient les deux sources. On inverse le sens pour faire un réfrigérateur ou une pompe à chaleur, et on compare le rendement au rendement de Carnot 1 − T_f/T_c. *Section N1 entière absente du site.*
- **P1** `ph-detente-irreversible` · Une détente qui ne revient jamais (N1, section TH). Une boîte coupée en deux : on retire la cloison et les particules envahissent le vide. On peut attendre : la probabilité de les retrouver toutes à gauche (1/2ᴺ) s'affiche et l'entropie monte ; un onglet met deux blocs chaud et froid en contact. *Deuxième principe N1 absent ; très visuel.*
- **P2** `ph-respiration-boyle` · Respirer, c'est appliquer Boyle-Mariotte (N2, section TH). Un thorax en coupe avec un diaphragme qu'on abaisse à la souris ; le volume des poumons augmente, la pression baisse sous p_atm et l'air entre. Les valeurs p et V sont lues à chaque instant, avec le volume courant de 0,5 L. *N2 très visuelle et médicale ; absente.*

## P21 · Physique nucléaire et radioactivité
Couverture **bonne** · couvertes : 3 · partielles : 4 · manquantes : 0 · sans objet : 1.

- **P2** `ph-radioprotection` · Temps, distance, écran : se protéger (N1, section NU). Un labo en 3D avec une source α, β ou γ, un compteur Geiger qui crépite et des écrans (papier, aluminium, plomb) qu'on glisse devant. On recule (1/r²), on réduit le temps et la dose s'affiche en Gy puis en Sv selon le rayonnement. *Pénétration et doses (N1) couvertes au secondaire seulement.*
- **P2** `ph-fission-chaine` · Fission et réaction en chaîne (N1, section NU). Un neutron frappe un noyau d'uranium 235 qui se déforme et se coupe en deux en libérant 2 ou 3 neutrons. On règle la part de neutrons absorbés (barres de contrôle) : la réaction s'éteint, reste stable ou s'emballe, avec l'énergie libérée par réaction. *Fission (N1) seulement placée sur la courbe d'Aston ; réaction en chaîne (N2) absente.*
- **P2** `ph-noyau-forces` · Construire un noyau : force forte contre Coulomb (N1, section NU). On ajoute des protons et des neutrons un par un à un noyau en 3D ; la répulsion électrique et la cohésion forte s'affichent en barres. Le noyau se place sur la carte N-Z et devient stable, émetteur β⁻, β⁺ ou α selon son excès. *Les deux forces en compétition (N1) ne sont montrées nulle part.*

## P22 · Grandeurs, unités et analyse dimensionnelle
Couverture **faible** · couvertes : 1 · partielles : 1 · manquantes : 3 · sans objet : 3.
Manque : Les puissances de dix ; Convertir sans se tromper ; Ordres de grandeur.

- **P2** `ph-puissances-de-dix` · Zoom de 10⁻¹⁵ m à 10¹² m (N1, section MA). Un zoom continu, dessiné à la main, d'un noyau à l'atome, la cellule, la main, la personne, la ville, la Terre et le système solaire ; la molette change la puissance de dix. L'échelle, le préfixe (fm, nm, µm… Tm) et des objets de comparaison s'affichent à chaque étape. *Préfixes et ordres de grandeur (N1) absents ; utile mais moins central qu'une loi physique.*
- **P2** `ph-justesse-fidelite` · Justesse et fidélité : mesurer dix fois (N1, section MA). On mesure dix fois la période d'un pendule au chronomètre ; les mesures tombent sur une cible et dans un histogramme. On règle l'erreur aléatoire (réflexe) et l'erreur systématique (montre qui avance) : moyenne, écart-type et chiffres significatifs du résultat s'affichent. *Incertitudes (N1) absentes en BA1.*
- **P3** `ph-conversions-cube` · 1 m³ = 1000 L : le facteur au cube (N1, section MA). Un cube d'un mètre se découpe en 1000 cubes d'un décimètre, puis l'un d'eux en 1000 cubes d'un centimètre ; on clique pour zoomer d'un niveau. Le facteur passe au carré pour les faces et au cube pour le volume. *Simple, mais une image évite l'erreur la plus fréquente.*

## Récapitulatif

- Sections analysées : 233, dont 38 sans objet (méthode, formulaire).
- Sur les 195 sections de matière : **93 couvertes**, **64 partielles**, **38 manquantes**.
- Propositions : **71** au total, **12 P1**, **44 P2**, **15 P3**.

### Les P1, dans l'ordre conseillé

- P06 · `ph-biceps-avant-bras` · L'avant-bras : la force du biceps (section PH3)
- P07 · `ph-rotation-sigma-m` · Faire tourner : ΣM = I·α et le moment d'inertie (section PH2)
- P07 · `ph-patineuse` · La patineuse qui rentre les bras (section PH2)
- P09 · `ph-perfusion-posture` · Perfusion et posture : ρgh dans le corps (section FL)
- P10 · `ph-reynolds` · Laminaire ou turbulent : l'expérience de Reynolds (section FL)
- P13 · `ph-loi-ampere` · La loi d'Ampère : faire le tour des courants (section PH11)
- P14 · `ph-rails-induction` · La barre qui glisse sur des rails : e = B·L·v (section PH11)
- P17 · `ph-miroir-spherique` · Miroirs concave et convexe (section PH6)
- P19 · `ph-transferts-thermiques` · Conduction, convection, rayonnement (section TH)
- P19 · `ph-dilatation` · La dilatation : rails, ponts et barre chauffée (section TH)
- P20 · `ph-machine-thermique` · Moteur, frigo, pompe à chaleur : le cycle (section TH)
- P20 · `ph-detente-irreversible` · Une détente qui ne revient jamais (section TH)

### Couverture par chapitre

| Chapitre | Couverture | C / P / M | P1 / P2 / P3 |
|---|---|---|---|
| E01 - Champ electrique | partielle | 2 / 1 / 3 | 0 / 1 / 0 |
| E02 - Dipole electrique | partielle | 1 / 3 / 2 | 0 / 1 / 1 |
| E03 - Theoreme de Gauss | faible | 0 / 1 / 5 | 0 / 1 / 1 |
| E04 - Gauss applique | faible | 0 / 1 / 5 | 0 / 1 / 0 |
| E05 - Potentiel et travail | partielle | 4 / 0 / 2 | 0 / 0 / 1 |
| E06 - Conducteurs et condensateurs | partielle | 2 / 4 / 0 | 0 / 1 / 1 |
| E07 - Dielectriques | faible | 0 / 1 / 5 | 0 / 2 / 1 |
| E08 - Courant et loi d Ohm locale | faible | 0 / 4 / 2 | 0 / 1 / 1 |
| P01 - Cinematique 1D | bonne | 4 / 2 / 0 | 0 / 2 / 0 |
| P02 - Cinematique 2D | bonne | 6 / 1 / 0 | 0 / 1 / 0 |
| P03 - Dynamique du point 1 | bonne | 7 / 0 / 0 | 0 / 0 / 0 |
| P04 - Dynamique du point 2 | bonne | 4 / 2 / 0 | 0 / 2 / 1 |
| P05 - Travail energie puissance | bonne | 3 / 4 / 0 | 0 / 3 / 0 |
| P06 - Statique du solide | bonne | 4 / 1 / 1 | 1 / 2 / 0 |
| P07 - Dynamique de rotation | bonne | 4 / 2 / 1 | 2 / 0 / 0 |
| P08 - Gravitation | bonne | 3 / 4 / 0 | 0 / 1 / 2 |
| P09 - Statique des fluides | partielle | 2 / 3 / 1 | 1 / 1 / 0 |
| P10 - Dynamique des fluides | partielle | 4 / 1 / 2 | 1 / 1 / 1 |
| P11 - Electrostatique | bonne | 4 / 3 / 0 | 0 / 2 / 0 |
| P12 - Circuits electriques | bonne | 5 / 2 / 0 | 0 / 2 / 0 |
| P13 - Magnetisme | bonne | 3 / 3 / 0 | 1 / 3 / 0 |
| P14 - Induction electromagnetique | partielle | 1 / 5 / 1 | 1 / 3 / 0 |
| P15 - Ondes 1 | bonne | 5 / 2 / 0 | 0 / 0 / 1 |
| P16 - Ondes 2 - le son | bonne | 4 / 4 / 0 | 0 / 3 / 1 |
| P17 - Optique 1 | bonne | 4 / 2 / 1 | 1 / 2 / 0 |
| P18 - Optique 2 | bonne | 6 / 0 / 0 | 0 / 0 / 2 |
| P19 - Thermodynamique 1 | partielle | 2 / 3 / 2 | 2 / 2 / 0 |
| P20 - Thermodynamique 2 | bonne | 5 / 0 / 2 | 2 / 1 / 0 |
| P21 - Physique nucleaire | bonne | 3 / 4 / 0 | 0 / 3 / 0 |
| P22 - Grandeurs et unites | faible | 1 / 1 / 3 | 0 / 2 / 1 |
