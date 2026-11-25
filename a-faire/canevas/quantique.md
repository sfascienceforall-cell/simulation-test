# Analyse d'écarts : physique quantique et statistique (PQS) ↔ simulations du site

Source : diapositives du cours PHYS-H-200 « Physique quantique et statistique » (ULB, École polytechnique), 15 fichiers `dias_*`.
Futur cours du site : **Physique quantique** (nouveau), un chapitre par fichier, dans l'ordre du cours (ch. 1 à 16 ; le ch. 12 n'est pas dans les dias reçues).
Consigne d'Enzo : uniquement des visuels, 1 à 4 par chapitre. Priorité P3, sauf notion aussi au programme de physique BA1 (P2). Aucun énoncé, chiffre ni figure d'examen ; dossier « Archives examens » non ouvert.

Statut : couvert = une simulation du site montre la notion ; partiel = secondaire seulement, ou un seul aspect ; manquant = rien.

## PQ01 - Introduction  (`dias_intro`)

Couverture **faible** : 0 section(s) couverte(s), 2 partielle(s), 3 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `b4-c01-zoom`, `c3-c02-atome`, `collisions`, `uc-c01-equation-nucleaire`.

- **P2 · Désintégration β⁻ du neutron et neutrino invisible** (`pq-desintegration-neutron`, N1)  
  Un neutron en 3D (quarks u, d, d) se désintègre au hasard (τ ≈ 887 s, temps accéléré) : un quark d devient u et un W⁻ virtuel donne un électron et un antineutrino ; des compteurs de charge, de nombre baryonique et de nombre leptonique restent équilibrés. Un histogramme des énergies de l'électron se remplit en spectre continu, et le bouton « sans neutrino » montre la raie unique qu'on attendrait.  
  *Pourquoi :* BA1 P21 (N2) « Le spectre β et la place du neutrino ». Le site traite la radioactivité β sans son mécanisme ni le spectre continu.
- **P3 · De la goutte d'eau au quark : quelle force tient chaque étage ?** (`pq-zoom-matiere-interactions`, N1)  
  Une loupe plonge dans une goutte d'eau : molécule, atome (Å), noyau (fm), nucléon et ses trois quarks, chaque étage dessiné en volume. Un curseur de distance (échelle logarithmique) allume les quatre interactions selon leur portée et leur intensité relative, et le potentiel V(r) ∼ V₀e^(−r/a)/r de chacune se trace en dessous.  
  *Pourquoi :* Réunit particules composites et quatre interactions. b4-c01-zoom (biologie 4e) s'arrête à l'atome et ne montre pas les forces.
- **P3 · Un proton dans l'accélérateur : E = mc² + T et v qui plafonne à c** (`pq-accelerateur-energie-impulsion`, N1)  
  Un anneau d'accélérateur en 3D où un paquet de protons (ou d'électrons) reçoit une poussée à chaque tour ; à droite, l'hyperbole E² = p²c² + m²c⁴ avec un point qui monte, et la droite E = pc du photon. La vitesse s'approche de c sans l'atteindre, la barre d'énergie se coupe en énergie de masse et énergie cinétique, et une bande colorée indique le domaine non relativiste, relativiste ou ultrarelativiste.  
  *Pourquoi :* Fixe le domaine non relativiste (T ≪ mc²) utilisé dans tout le cours. Prolonge potentiel-electronvolt et Cyclotron (BA1).
- **P3 · Le train relativiste : horloges et transformation de Lorentz** (`pq-lorentz-horloges`, N2)  
  Un train spatial file devant un quai couvert d'horloges synchronisées ; à côté, le diagramme d'espace-temps où les axes ct′ et x′ du train se referment vers le cône de lumière. Tu règles β = v/c et tu cliques un événement : ses coordonnées dans les deux référentiels, la dilatation du temps et la contraction des longueurs (facteur γ) s'affichent.  
  *Pourquoi :* Premier pilier du cours (espace-temps 3 + 1). Rien sur le site ; le diagramme qui bascule rend visible la transformation hyperbolique.

## PQ02 - Les origines de la physique quantique  (`dias_origin`)

Couverture **partielle** : 2 section(s) couverte(s), 2 partielle(s), 4 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `c3-c02-modeles`, `c5-c01-spectre`, `diffraction`, `interferences-deux-sources`, `p6-c08-spectre-em`, `p6-c08-spectres`, `p6-c08-young-reseau`, `p6-c09-bohr`, `uc-c01-bohr`, `yung`.

- **P2 · Le four et la catastrophe ultraviolette** (`pq-corps-noir-catastrophe-uv`, N1)  
  Un four de forge vu par son petit orifice, qui passe du rouge sombre au blanc bleuté quand tu montes la température ; à côté, la densité u(ν, T) de Planck et la courbe classique (k_BT par mode) qui file vers l'infini dans l'UV. Tu règles T et tu compares les deux courbes : le pic se déplace (loi de Wien) et l'aire sous la courbe grandit en T⁴.  
  *Pourquoi :* BA1 P19 (N1) « Le rayonnement thermique ». Point de départ historique ; sert aussi au ch. 16 (distribution de Planck). Rien sur le site.
- **P3 · Young un impact à la fois : photons, électrons, molécules** (`pq-young-impact-par-impact`, N1)  
  Un canon tire une particule à la fois vers deux fentes ; sur l'écran, les impacts tombent au hasard puis dessinent peu à peu les franges. Tu choisis photon, électron, atome Na ou molécule Na₂ et la vitesse (λ = h/p change l'interfrange), et tu peux boucher une fente ou allumer un détecteur de passage : les franges disparaissent.  
  *Pourquoi :* Image centrale de la dualité, qui prépare la mesure (ch. 4). yung (BA1) ne montre que l'intensité classique. La dualité est aussi en chimie BA1 C01 (N1).
- **P3 · Effet photoélectrique : la couleur compte, pas l'intensité** (`pq-effet-photoelectrique`, N1)  
  Une cellule sous vide avec une plaque de métal éclairée par une lampe dont tu règles la longueur d'onde, l'intensité et le métal (Cs, Na, Zn…) : les électrons ne sortent que si hν dépasse le travail d'extraction. Une tension de freinage réglable arrête les plus rapides, et le graphe T_cin(ν) se trace point par point : une droite de pente h qui part du seuil ν₀.  
  *Pourquoi :* Preuve historique du photon. Aucune page sur le site, ni BA1 ni secondaire.
- **P3 · Effet Compton : un photon X rebondit sur un électron** (`pq-compton`, N2)  
  Un photon X (petit paquet d'onde coloré) frappe un électron au repos ; tu fais tourner le détecteur à la souris autour de la cible et tu lis la longueur d'onde diffusée λ′ = λ + (h/m_ec)(1 − cos θ). L'électron recule, et les flèches d'impulsion ferment le triangle de conservation.  
  *Pourquoi :* Seule preuve « mécanique » du photon dans le cours (conservation de E et de p). Rien sur le site.

## PQ03 - L'équation de Schrödinger  (`dias_schroed`)

Couverture **faible** : 0 section(s) couverte(s), 2 partielle(s), 3 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `Fonction-d-onde-f-x-vt-`, `Onde-progressive`, `effet-de-battement`, `harmoniques-tuyaux`, `onde-stationnaire-somme`.

- **P3 · Construire un paquet d'ondes et le regarder s'étaler** (`pq-paquet-ondes-libre`, N1)  
  La fonction d'onde complexe en ruban 3D (hauteur = module, couleur = phase) ; un curseur additionne des ondes planes e^(i(kx−ωt)) jusqu'à former un paquet gaussien. Lancé, le paquet avance à la vitesse de groupe ħk₀/m pendant que les crêtes défilent à la vitesse de phase, deux fois plus lente, et sa largeur grandit ; tu règles k₀, la largeur a et la masse.  
  *Pourquoi :* Premier objet du cours (onde plane, dispersion, étalement). Rien d'équivalent sur le site.
- **P3 · Un paquet d'ondes de matière contre une fente, deux fentes, un réseau** (`pq-paquet-2d-fentes`, N1)  
  Vue en perspective d'un plan où un paquet d'ondes 2D (densité en relief, phase en couleur) fonce vers un mur percé : il se diffracte, se partage entre les ouvertures et ses morceaux interfèrent. Tu choisis une fente, deux fentes ou un réseau, tu règles l'écart et l'énergie, et tu fais tourner la vue.  
  *Pourquoi :* Montre le « deuxième problème d'interprétation » des dias (diffraction et séparation du paquet). Calcul en différences finies écrit à la main, sans bibliothèque.
- **P3 · États stationnaires : une phase qui tourne, une densité immobile** (`pq-etats-stationnaires-horloges`, N2)  
  Une particule confinée : chaque état stationnaire porte une petite horloge qui tourne à la pulsation E/ħ, et sa densité |ψ|² reste immobile. Mélange deux états au curseur : la densité se met à osciller d'un bord à l'autre à la fréquence (E₂ − E₁)/h, et l'horloge de la phase relative montre pourquoi.  
  *Pourquoi :* Fait voir la différence entre solution stationnaire et solution générale, utile pour la mesure et les spectres.

## PQ04 - Principes de la mécanique quantique  (`dias_postul`)

Couverture **faible** : 0 section(s) couverte(s), 2 partielle(s), 7 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `p6-c08-polariseurs`, `p6-c09-rayonnements`.

- **P2 · Chambre à brouillard : voir la trace d'une particule** (`pq-chambre-brouillard`, N2)  
  Un aquarium noir rempli de vapeur d'alcool, éclairé de côté, où naissent des traînées de condensation : traits courts et épais des α, fils fins et sinueux des β, longues traces droites des muons cosmiques. Tu places une source, un écran (papier, aluminium, plomb) ou un aimant qui courbe les traces selon la charge, et tu fais tourner la boîte.  
  *Pourquoi :* BA1 P21 : pénétration (N1) et ionisation (N2) des rayonnements. Dans le cours, exemple de mesure répétée de la position. Aucune trace sur le site.
- **P3 · Heisenberg : serrer la position, perdre l'impulsion** (`pq-heisenberg-mesure`, N1)  
  Deux panneaux face à face : le paquet |ψ(x)|² et sa distribution d'impulsion |φ(p)|², reliés par une poignée qui comprime l'un et étire l'autre ; un compteur affiche Δx·Δp, jamais sous ħ/2. Le bouton « mesurer la position » tire un résultat selon |ψ|², réduit le paquet autour de ce point et fait exploser Δp ; répétée sur 200 copies, la mesure dessine l'histogramme de probabilité.  
  *Pourquoi :* Réunit densité de probabilité, mesure, réduction et incertitudes : le cœur du chapitre. Rien sur le site.
- **P3 · Un photon devant un polariseur : passe ou pas ?** (`pq-photon-polariseur`, N1)  
  Une source envoie des photons un par un, polarisés à l'angle θ que tu tournes à la souris, vers un polariseur vertical : chacun passe ou est absorbé au hasard, et les compteurs convergent vers cos²θ et sin²θ. Après le passage, le photon est vertical : ajoute un deuxième ou un troisième polariseur pour vérifier la réduction de l'état ; un mode « pixel LCD » montre la même chose dans un écran.  
  *Pourquoi :* Exemple de mesure le plus simple des dias. p6-c08-polariseurs (secondaire) ne traite que l'intensité classique.

## PQ05 - Équation de Schrödinger à une dimension  (`dias_schroed1D`)

Couverture **nulle** : 0 section(s) couverte(s), 0 partielle(s), 6 manquante(s).

- **P3 · Un paquet d'ondes contre une barrière : réflexion et effet tunnel** (`pq-barriere-tunnel`, N1)  
  Un paquet d'ondes court vers une barrière dont tu règles la hauteur V₀ et la largeur a ; il se coupe en un paquet réfléchi et un paquet transmis, même quand E < V₀. Les probabilités |R|² et |T|² s'affichent et se tracent en fonction de E, avec les résonances au-dessus de la barrière ; une vue « état stationnaire » montre la décroissance exponentielle dans la barrière.  
  *Pourquoi :* Phénomène purement quantique, base des applications du chapitre. Rien sur le site.
- **P3 · Particule dans une boîte et points quantiques** (`pq-boite-quantique`, N1)  
  Une boîte aux murs infinis où vibre ψₙ, comme une corde de guitare, avec sa densité |ψₙ|² en relief et l'échelle des niveaux Eₙ = n²π²ħ²/2ma² à côté ; tu changes n et la largeur a. Second onglet : une rangée de fioles de points quantiques éclairées en UV, où réduire la taille du cristal augmente l'énergie de confinement et fait passer la lumière émise du rouge au bleu.  
  *Pourquoi :* Premier exemple de quantification par les conditions aux limites ; pont avec harmoniques-tuyaux (BA1). Couleurs des points quantiques : modèle « gap du semi-conducteur + confinement en 1/a² ».
- **P3 · Oscillateur harmonique quantique : niveaux équidistants et point zéro** (`pq-oscillateur-quantique`, N1)  
  Une molécule-ressort vibre au-dessus de la parabole V(x) = ½mω²x², avec l'échelle des niveaux (n + ½)ħω et la densité |ψₙ|² posée sur chaque niveau. Les points de rebroussement classiques sont marqués ; pour n grand, la densité quantique rejoint la probabilité classique du ressort, et pour n = 0 la masse ne s'arrête jamais (½ħω).  
  *Pourquoi :* Modèle repris pour les vibrations moléculaires (ch. 10), les gaz (ch. 15) et les photons (ch. 16). Oscilateur (BA1) reste classique.
- **P3 · Microscope à effet tunnel : lire une surface atome par atome** (`pq-microscope-tunnel`, N2)  
  Une pointe métallique balaie une surface d'atomes dessinés en relief ; le courant tunnel, proportionnel à |T|² ≈ e^(−2Kd), change énormément au moindre écart de distance d. L'image en fausses couleurs se construit ligne par ligne ; tu règles la hauteur de la pointe et tu peux déplacer un atome avec elle.  
  *Pourquoi :* Application nanotechnologique développée dans les dias ; montre la sensibilité exponentielle à la distance.

## PQ06 - Équation de Schrödinger à trois dimensions  (`dias_schroed3D`)

Couverture **partielle** : 2 section(s) couverte(s), 1 partielle(s), 5 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `gravitation-satellite`, `kepler`, `p6-c08-spectres`, `p6-c09-bohr`, `uc-c01-bohr`.

- **P3 · Orbitales de l'hydrogène en 3D : ψnlm qu'on fait tourner** (`pq-orbitales-hydrogene-3d`, N1)  
  Un nuage de points (densité |ψnlm|²) ou une surface d'égale densité colorée selon le signe, que tu fais tourner à la souris ; tu choisis n, l, m (ou px, py, dz²…) et un plan de coupe révèle les nœuds radiaux et angulaires. En dessous, la probabilité radiale r²|Rnl|² avec ⟨r⟩ et le nombre de nœuds radiaux n − l − 1.  
  *Pourquoi :* Image clé du chapitre et de la chimie BA1 (C01 « La forme des orbitales », N1). Aucune orbitale 3D sur le site : à construire une seule fois pour les deux cours.
- **P3 · Harmoniques sphériques et cônes du moment cinétique** (`pq-moment-cinetique-cones`, N2)  
  À gauche, une sphère déformée et colorée par Ylm(θ, φ) (rayon = |Y|, couleur = phase) ; à droite, le vecteur L de longueur ħ√(l(l + 1)) qui précesse sur un cône autour de z, avec seulement 2l + 1 hauteurs permises mħ. Tu règles l et m : L_x et L_y restent flous, seul L_z est net.  
  *Pourquoi :* Rend visibles la quantification de L et la non-commutation de ses composantes.
- **P3 · Du Kepler classique au potentiel effectif quantique** (`pq-potentiel-effectif-orbites`, N2)  
  En haut, une particule attirée par un centre décrit une ellipse, une parabole ou une hyperbole selon l'énergie que tu lui donnes à la souris ; en bas, la courbe V_eff(r) (centrifuge + coulombien) pour l = 0, 1, 2, où une bille oscille entre r₁ et r₂. En mode quantique, les niveaux permis Enl et les fonctions radiales unl(r) apparaissent dans le même puits.  
  *Pourquoi :* Le chapitre part du classique (Kepler, hyperboles) pour arriver à l'équation radiale ; kepler (BA1) ne montre pas le potentiel effectif.

## PQ07 - Systèmes de particules  (`dias_systems`)

Couverture **faible** : 0 section(s) couverte(s), 2 partielle(s), 3 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `c5-c01-remplissage`, `centre-de-masse-`, `uc-c02-om-diatomiques`.

- **P3 · Deux particules dans une boîte : discernables, bosons, fermions** (`pq-deux-particules-identiques`, N1)  
  Deux particules dans une même boîte : à gauche, leurs positions tirées au hasard (deux billes) ; à droite, la carte |Ψ(x₁, x₂)|² en relief qu'on fait tourner. Pour des fermions, la diagonale x₁ = x₂ est vide (exclusion de Pauli), pour des bosons elle est renforcée ; tu choisis les deux états occupés et le type de particules.  
  *Pourquoi :* Montre l'antisymétrie au lieu de l'énoncer ; prépare les atomes, les molécules et les statistiques. Pauli est aussi en chimie BA1 C02 (N1).
- **P3 · Deux corps autour du centre de masse : H, deutérium, positronium** (`pq-masse-reduite-hydrogenoides`, N2)  
  Deux sphères (électron et noyau) tournent autour de leur centre de masse marqué d'une croix ; tu choisis hydrogène, deutérium, positronium ou atome alcalin, et le noyau danse plus ou moins. Le rayon de Bohr et le Rydberg effectifs changent et les raies de Balmer se décalent sur un spectre (à peine pour D, longueurs d'onde doublées pour le positronium) ; un curseur n montre la taille géante d'un atome de Rydberg (≈ n²a₀).  
  *Pourquoi :* Concrétise la masse réduite et les hydrogénoïdes ; centre-de-masse- (BA1) reste classique.

## PQ08 - Le spin  (`dias_spin`)

Couverture **nulle** : 0 section(s) couverte(s), 0 partielle(s), 5 manquante(s).

- **P3 · Stern et Gerlach : un jet d'argent coupé en deux** (`pq-stern-gerlach`, N1)  
  Un four, un jet d'atomes d'argent et un aimant à pièces polaires pointues, en 3D, que tu fais tourner ; les impacts s'accumulent sur la plaque en deux taches, là où la physique classique prévoit une traînée continue. Tu peux tourner l'aimant, choisir un atome de moment cinétique entier (nombre impair de taches) et enchaîner deux ou trois appareils (z, puis x, puis z) pour voir la mesure effacer l'état précédent.  
  *Pourquoi :* Expérience fondatrice du spin et meilleur exemple de mesures successives. Rien sur le site.
- **P3 · Effet Zeeman : un niveau qui se divise dans un aimant** (`pq-zeeman`, N2)  
  Une lampe à vapeur entre les pôles d'un électroaimant, avec sa raie vue au spectroscope ; quand tu montes B, chaque niveau se divise en 2l + 1 (normal) ou 2j + 1 (anormal) sous-niveaux, écartés proportionnellement à μ_B·B. Le diagramme d'énergie et la raie éclatée bougent ensemble ; un bouton montre l'état fondamental de H coupé en deux niveaux, l'indice du spin.  
  *Pourquoi :* Indice expérimental du spin (nombre pair de niveaux). Rien sur le site.
- **P3 · Additionner deux moments cinétiques : la règle du triangle** (`pq-addition-moments-cinetiques`, N2)  
  Deux vecteurs J₁ et J₂ en 3D précessent autour de leur somme J, elle-même sur un cône autour de z ; tu règles j₁ et j₂ (entiers ou demi-entiers) et la liste des j permis, de |j₁ − j₂| à j₁ + j₂, s'affiche avec leurs 2j + 1 projections. Cas guidé : l'électron 2p (l = 1, s = ½) donne j = ½ ou 3/2.  
  *Pourquoi :* Notion abstraite que la 3D rend lisible ; resservira pour l'hélium (S = 0 ou 1) et les règles de Hund.
- **P3 · Zoom sur un niveau : structure fine, Lamb et raie de 21 cm** (`pq-structure-fine-hyperfine-21cm`, N2)  
  Un diagramme d'énergie de l'hydrogène avec une loupe : on zoome d'abord sur n = 2 (2p₁/₂, 2p₃/₂ et le déplacement de Lamb), puis sur 1s qui se coupe en F = 0 et F = 1 selon l'orientation des spins de l'électron et du proton. La transition hyperfine émet un photon de 21 cm, capté par un radiotélescope qui dessine les bras de la Voie lactée.  
  *Pourquoi :* Montre les ordres de grandeur (α², hyperfin) et une application célèbre (radioastronomie).

## PQ09 - Les atomes  (`dias_atoms`)

Couverture **partielle** : 0 section(s) couverte(s), 3 partielle(s), 5 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `c3-c02-atome`, `c3-c04-tableau`, `c5-c01-remplissage`, `uc-c02-om-diatomiques`.

- **P3 · L'hélium : deux électrons, deux familles de niveaux** (`pq-helium-ortho-para`, N2)  
  Un atome d'hélium avec ses deux électrons et leurs flèches de spin ; à droite, deux colonnes de niveaux, singulet (parahélium) et triplet (orthohélium), et la carte |Ψ(r₁, r₂)|² qui montre que l'état triplet garde les électrons éloignés. Un curseur allume la répulsion entre électrons : les niveaux montent, plus pour le singulet que pour le triplet, et 1s² reste seul, sans partenaire triplet.  
  *Pourquoi :* Première conséquence de Pauli visible sur un spectre. Rien sur le site.
- **P3 · Effet d'écran : pourquoi 2s passe sous 2p** (`pq-effet-ecran`, N2)  
  Un atome coupé en deux, en 3D : le petit nuage 1s serré autour du noyau, et autour les nuages 2s et 2p ; la courbe |u₂ₗ(r)|² montre que 2s plonge plus souvent sous le nuage 1s. Une jauge affiche la charge ressentie Z_eff de chaque orbitale, et le diagramme d'énergie se sépare (E₂s < E₂p) quand tu allumes l'écran.  
  *Pourquoi :* Explique l'ordre de remplissage (4s avant 3d). Chimie BA1 C02 (N2 « La charge effective ») sans simulation.
- **P3 · Règles de Hund : spin total le long du tableau et aimants** (`pq-hund-magnetisme`, N2)  
  Une sous-couche p ou d en cases se remplit électron par électron, avec le spin total S et le moment orbital L calculés en direct ; en dessous, les courbes S(Z) et L(Z) se tracent jusqu'au krypton puis jusqu'aux terres rares. Un aimant samarium-cobalt et un clou de fer montrent que les éléments à grand S font les meilleurs aimants.  
  *Pourquoi :* Complète c5-c01-remplissage (secondaire) par ce qu'il ne montre pas : S, L et le lien avec le magnétisme.

## PQ10 - Les molécules et les solides  (`dias_molec`)

Couverture **faible** : 0 section(s) couverte(s), 2 partielle(s), 5 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `c3-c05-transfert`, `c5-c02-energie-liaison`, `uc-c02-electronegativite`, `uc-c02-om-diatomiques`, `uc-c03-pourcentage-ionique`.

- **P3 · H₂⁺ : un électron, deux protons, une liaison** (`pq-h2plus-liaison`, N1)  
  Deux protons dont tu tires la distance R à la souris, et le nuage de l'électron en 3D : orbitale liante (densité accumulée entre les noyaux) ou antiliante (plan nodal au milieu). Les courbes W₊(R) et W₋(R) se tracent avec un point qui suit R ; lâchés, les protons glissent vers le minimum et y vibrent lentement pendant que le nuage suit instantanément (Born-Oppenheimer).  
  *Pourquoi :* Image fondatrice de la liaison chimique, aussi utile en chimie BA1 (C03). Aucun nuage moléculaire sur le site.
- **P3 · Des niveaux aux bandes : 1, 2, 10, N atomes** (`pq-bandes-solide`, N1)  
  Une rangée d'atomes en 3D s'allonge quand tu en ajoutes : chaque niveau atomique se dédouble, se resserre en paquet puis devient une bande continue, séparée de la suivante par une bande interdite. Tu changes la distance entre atomes et tu ajoutes un dopant : les électrons passent de localisés à délocalisés et le cristal devient isolant, semi-conducteur ou conducteur.  
  *Pourquoi :* Base des semi-conducteurs, cités dès l'introduction du cours. Rien sur le site. Conception propre, sans reprendre l'applet citée dans les dias.
- **P3 · Une molécule qui tourne et qui vibre : niveaux et spectre infrarouge** (`pq-rotation-vibration-co`, N2)  
  Une molécule CO (ou HCl) en 3D tourne et sa liaison vibre comme un ressort ; à côté, l'échelle des niveaux : rotations l(l + 1)ħ²/2I empilées sur chaque niveau de vibration (nᵥ + ½)ħω. Un faisceau infrarouge balaie les fréquences et le spectre d'absorption se dessine en deux branches de raies ; un bouton « satellite » retrouve CO dans l'atmosphère.  
  *Pourquoi :* Hiérarchie E_rot ≪ E_vib ≪ E_e en une image ; application à la spectroscopie atmosphérique citée dans les dias.

## PQ11 - Les noyaux  (`dias_nuclei`)

Couverture **partielle** : 3 section(s) couverte(s), 5 partielle(s), 0 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `c3-c02-atome`, `c3-c02-rutherford`, `c3-c03-carte`, `c3-c03-demivie`, `p6-c09-decroissance`, `p6-c09-rayonnements`, `radioactivite`, `uc-c01-decroissance`, `uc-c01-defaut-masse`, `uc-c01-equation-nucleaire`.

- **P2 · La vallée de stabilité en relief** (`pq-vallee-stabilite-3d`, N1)  
  La carte des noyaux (N en abscisse, Z en ordonnée) devient un paysage 3D dont l'altitude est l'excès de masse par nucléon : les noyaux stables tapissent le fond d'une vallée qui s'écarte de N = Z. Tu poses un noyau sur un versant : il descend par β⁻, β⁺ ou α jusqu'au fond en traçant sa chaîne de désintégration, et tu fais tourner le paysage à la souris.  
  *Pourquoi :* BA1 P21 (N1) « La vallée de stabilité » et (N2) « Sortir de la vallée ». c3-c03-carte (secondaire) est une carte plate.
- **P2 · Fission et fusion : monter vers le fer** (`pq-fission-fusion`, N1)  
  Un noyau d'uranium 235, goutte de nucléons, est frappé par un neutron lent : il s'allonge, se coupe en deux fragments et libère des neutrons qui peuvent relancer la réaction (réaction en chaîne réglable). Second onglet : un deutérium et un tritium foncent l'un vers l'autre contre la barrière coulombienne ; chaque réaction place ses noyaux sur la courbe d'Aston et affiche l'énergie libérée.  
  *Pourquoi :* BA1 P21 (N1) fission et fusion, (N2) réaction en chaîne. uc-c01-defaut-masse ne fait que le calcul.
- **P3 · Rutherford : trajectoires hyperboliques et section efficace** (`pq-rutherford-section-efficace`, N2)  
  Un faisceau de particules α tombe sur un noyau d'or : chaque α suit une hyperbole dont tu règles le paramètre d'impact b à la souris, et l'angle de déflexion θ = 2 arctan(a/b) s'affiche. En mode « faisceau », des milliers d'α tirés au hasard remplissent un histogramme des angles qui suit 1/sin⁴(θ/2), avec de rares α renvoyées en arrière.  
  *Pourquoi :* Version quantitative de c3-c02-rutherford (secondaire) ; réutilise l'hyperbole du ch. 6.
- **P3 · Radioactivité α : la particule qui traverse la barrière** (`pq-tunnel-alpha-gamow`, N2)  
  Une particule α ballotte dans le puits du noyau, entourée de la barrière coulombienne ; à chaque choc contre la paroi, elle a une infime chance de passer par effet tunnel. Tu règles l'énergie Eα : la demi-vie calculée parcourt plus de vingt ordres de grandeur sur une échelle logarithmique.  
  *Pourquoi :* Application majeure de l'effet tunnel (dias du ch. 5) ; explique l'énorme dispersion des durées de vie α.

## PQ13 - Principes de la physique statistique  (`dias_princip`)

Couverture **nulle** : 0 section(s) couverte(s), 0 partielle(s), 3 manquante(s).

- **P2 · Détente d'un gaz : compter les micro-états** (`pq-detente-microetats`, N1)  
  Une enceinte coupée en deux par une paroi : tu la retires et les particules envahissent tout le volume. Le compteur gauche/droite oscille autour de N/2, l'histogramme Ω(n) = C(N, n) et l'entropie S = k_B ln Ω montent au maximum ; de 4 à 1 000 particules, les fluctuations s'écrasent et le retour spontané devient impossible en pratique.  
  *Pourquoi :* BA1 P20 (N1) « Une détente qui ne revient pas en arrière » et (N2) « Pourquoi le retour ne se produit pas » ; exemple même des dias. Aucune version statistique sur le site.
- **P2 · Deux solides en contact : pourquoi les températures s'égalisent** (`pq-contact-thermique`, N1)  
  Deux blocs d'atomes-oscillateurs posés l'un contre l'autre échangent au hasard des quanta d'énergie, petites billes lumineuses qui sautent d'atome en atome. Le graphe Ω_A(U_A)·Ω_B(U_T − U_A) montre un pic de plus en plus étroit et le partage se fige à son sommet, là où les pentes de ln Ω (donc 1/T) sont égales ; tu règles la taille des blocs et l'énergie totale.  
  *Pourquoi :* BA1 P19 (N2) « Comment l'équilibre s'établit » ; donne la définition statistique de la température. Rien sur le site.

## PQ14 - Système en équilibre avec un thermostat  (`dias_thermos`)

Couverture **faible** : 0 section(s) couverte(s), 1 partielle(s), 2 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `uc-c03-dipole-champ`.

- **P3 · Un système dans un thermostat : les niveaux s'allument** (`pq-boltzmann-niveaux`, N1)  
  Une grille de 100 copies du même petit système (l'ensemble canonique), chaque case colorée selon l'état occupé et qui change au hasard, posée dans un bain dont tu règles la température. L'histogramme des populations suit pᵢ ∝ gᵢe^(−Eᵢ/k_BT) : à T = 0 tout est dans le fondamental, puis les niveaux s'allument quand k_BT approche ΔE ; en dessous, U, S et C_V se tracent à partir de Z.  
  *Pourquoi :* Distribution de Boltzmann et rôle de la quantification à basse température, socle des ch. 15 et 16.

## PQ15 - Propriétés des gaz  (`dias_gaz`)

Couverture **partielle** : 1 section(s) couverte(s), 1 partielle(s), 2 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `c4-c04-piston`, `gaz-piston`, `uc-L06-maxwell-boltzmann`, `uc-L06-piston-3d`.

- **P2 · Chauffer un gaz diatomique : rotations et vibrations qui se réveillent** (`pq-cv-diatomique`, N1)  
  Une boîte de molécules diatomiques (H₂, N₂…) en 3D qu'on chauffe de 10 K à 10 000 K sur une échelle logarithmique : d'abord elles ne font que voler, puis se mettent à tourner au passage de θ_r, puis à vibrer au passage de θ_v. La courbe c_V/R grimpe par marches de 3/2 à 5/2 puis 7/2, et une barre montre la part de translation, de rotation et de vibration.  
  *Pourquoi :* BA1 P19 (N2) « Quand la chaleur massique n'est plus constante » ; preuve visible de la quantification dans une grandeur macroscopique. Modèle sans dissociation, à signaler à l'écran.
- **P3 · D'où vient la pression : les niveaux d'une boîte qu'on écrase** (`pq-gaz-boite-niveaux`, N2)  
  Un cube dont tu pousses une paroi comme un piston, avec à côté l'échelle des niveaux (nx² + ny² + nz²)π²ħ²/2ma² et leurs populations à la température choisie. Écraser la boîte écarte les niveaux et fait monter l'énergie : c'est la pression ; agrandie, l'échelle devient quasi continue et on retrouve PV = Nk_BT.  
  *Pourquoi :* Relie quantification et loi des gaz parfaits ; les pages de gaz du site restent classiques.

## PQ16 - Physique statistique de particules identiques  (`dias_ident`)

Couverture **faible** : 0 section(s) couverte(s), 1 partielle(s), 5 manquante(s).
Déjà sur le site (à relier, pas à refaire) : `uc-L06-maxwell-boltzmann`.

- **P3 · Dans un laser : l'avalanche de photons identiques** (`pq-laser-emission-stimulee`, N1)  
  Un barreau de rubis entre deux miroirs, en 3D, avec ses atomes à trois niveaux : une lampe flash les pompe vers le haut, l'émission spontanée part dans tous les sens, puis l'émission induite clone les photons jusqu'au faisceau cohérent. Tu règles la puissance de pompage et tu suis l'inversion de population : sous le seuil, rien ; au-dessus, l'avalanche.  
  *Pourquoi :* Phénomène quantique collectif de bosons, cité dès l'introduction du cours. Rien sur le site.
- **P3 · Remplir des niveaux : fermions, bosons et particules classiques** (`pq-fermions-bosons-remplissage`, N1)  
  Une échelle de niveaux d'énergie où tombent des billes : fermions (une par état, empilés jusqu'au niveau de Fermi), bosons (qui s'entassent dans le fondamental) ou particules classiques. Tu règles T et μ : les courbes f_FD, f_BE et f_MB se tracent sur le même graphe, se confondent à haute énergie et divergent à basse énergie.  
  *Pourquoi :* Synthèse visuelle des trois statistiques, conclusion du cours. uc-L06-maxwell-boltzmann ne traite que les vitesses classiques.
- **P3 · Refroidir des atomes jusqu'au condensat de Bose-Einstein** (`pq-condensat-bose-einstein`, N2)  
  Un nuage d'atomes de rubidium piégé, vu en 3D, qu'on refroidit par évaporation (les plus rapides s'échappent) ; la distribution des vitesses s'affiche en relief comme sur les images d'expérience. Sous la température critique, un pic étroit jaillit au centre et la courbe N₀/N(T) monte d'un coup : la plupart des atomes occupent le même état.  
  *Pourquoi :* Changement de phase purement quantique (prédit en 1925, observé en 1995). Rien sur le site.

## Récapitulatif

- Sections : 8 couvertes, 24 partielles, 58 manquantes (sur 90).
- Propositions : 45 en tout ; P1 : 0, P2 : 8, P3 : 37.
- Les P2 touchent la physique BA1 (sections TH et NU) : on peut les relier depuis ces pages en plus du futur cours.
- À mutualiser avec la chimie BA1 : `pq-orbitales-hydrogene-3d` (C01, forme des orbitales), `pq-h2plus-liaison` (C03), `pq-deux-particules-identiques` et `pq-effet-ecran` (C02). Une seule simulation par notion pour les deux cours.
- Pas de doublon proposé pour ce qui existe déjà : spectre de l'hydrogène et Bohr (`uc-c01-bohr`), courbe d'Aston (`uc-c01-defaut-masse`), décroissance (`radioactivite`, `uc-c01-decroissance`), Maxwell (`uc-L06-maxwell-boltzmann`), loi des gaz (`gaz-piston`, `uc-L06-piston-3d`).
- Sans simulation (formalisme ou survol) : formalisme hamiltonien, propriétés mathématiques des opérateurs, Schrödinger à N particules, déterminant de Slater, ordinateurs quantiques, fond cosmique, superfluidité.
- Points techniques : `pq-paquet-2d-fentes`, `pq-paquet-ondes-libre` et `pq-barriere-tunnel` demandent une intégration numérique de l'équation de Schrödinger écrite à la main (différences finies ou Crank-Nicolson), sans bibliothèque (règle 8). Les orbitales 3D se font par projection sur canevas 2D, comme `fils-paralleles-3d`.
