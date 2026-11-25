# Chimie générale (C01 à C15) : couverture du site et simulations à créer

Sources lues : universite/chimie (62 simulations du moteur), les 22 pages autonomes chimie/<id> (comptées comme université), secondaire/chimie 3e à 6e (comptés comme « partiel »), et la physique BA1 quand elle touche la chimie (diagramme-pv, gaz-piston).
Les sections « Méthode, pièges et formulaire » sont classées « sans objet ».

Ids cités : `uc-…` = cours à moteur de chimie BA1 ; nom simple (`lewis-vsepr`, `thermochimie`…) = page autonome `chimie/<id>/` ; `c3-` à `c6-` = secondaire ; `diagramme-pv`, `gaz-piston` = physique BA1.

## C01 - L'atome
**Couverture partielle** : 3 couvertes, 1 partielles, 2 manquantes.
Trous : Le noyau et les particules (partiel) ; La dualité onde-corpuscule (manquant) ; La forme des orbitales (manquant).

- **P1** `ch-orbitales-3d` · Orbitales s, p et d en 3D : le nuage et ses nœuds (N1, ranger dans `c01 (ou L03)`)
  - À l'écran : Un nuage de points 3D (densité de probabilité) qu'on fait tourner à la souris, avec la surface limite et le signe des lobes en deux couleurs. On règle n, ℓ et mₗ : la forme change, un plan de coupe glissant révèle les nœuds radiaux et la courbe de probabilité radiale s'affiche à côté.
  - Pourquoi : N1 central (forme des orbitales s et p), très visuel, absent du site. Prépare VSEPR et hybridation.
- **P1** `ch-de-broglie` · Électron ou balle de tennis : la longueur d'onde de de Broglie (N1, ranger dans `c01`)
  - À l'écran : Un canon à électrons accélère des électrons sous une tension réglable vers une feuille de graphite ; des anneaux de diffraction apparaissent sur l'écran et se resserrent quand la tension monte. On change la particule (électron, proton, balle de tennis) et la vitesse : λ = h/(mv) s'affiche et les anneaux disparaissent pour la balle.
  - Pourquoi : N1 (relation de de Broglie), rien sur le site. Risque de doublon avec le domaine quantique (pq-) : à arbitrer.
- **P2** `ch-spectres-continu-raies` · Lampe, tube à gaz et prisme : spectre continu, d'émission et d'absorption (N1, ranger dans `c01`)
  - À l'écran : Sur une paillasse sombre, une lampe à filament et des tubes à gaz (H, He, Ne, Na) éclairent un prisme ; le spectre se projette sur l'écran. On intercale un gaz froid devant la lampe : des raies noires apparaissent exactement aux places des raies d'émission, et on peut tirer des photons d'énergie réglable sur un atome d'H pour voir lesquels sont absorbés.
  - Pourquoi : N1 seulement en partie couvert par uc-c01-bohr (pas de spectre continu ni de test d'absorption libre).
- **P3** `ch-echelle-atome` · Si l'atome était un stade : le zoom jusqu'au noyau (N1, ranger dans `c01`)
  - À l'écran : Un zoom continu à la molette, d'un grain de sel jusqu'au noyau, avec un stade de football en surimpression pour l'échelle. Le compteur de puissances de dix défile et on lit où se trouve presque toute la masse.
  - Pourquoi : N1 visuel, mais déjà évoqué au secondaire (c3-c02-rutherford, c3-c02-modeles).

## C02 - Configuration et périodicité
**Couverture bonne** : 5 couvertes, 1 partielles, 0 manquantes.
Trous : Énergie d'ionisation et affinité électronique (partiel).

- **P2** `ch-ionisations-successives` · Arracher les électrons un à un : le saut qui trahit la valence (N2, ranger dans `L03`)
  - À l'écran : Un atome (Na, Mg, Al, Si…) dessiné avec ses couches ; on attrape un électron à la souris et on le tire hors de l'atome, l'énergie dépensée s'empile en barres sur une échelle logarithmique. Au premier électron de cœur, la barre fait un saut énorme et le nombre d'électrons de valence s'affiche.
  - Pourquoi : N2 très visuel, absent du site ; lien direct avec la position dans le tableau.
- **P3** `ch-charge-effective` · Charge effective : ce que voit l'électron externe (N2, ranger dans `L03`)
  - À l'écran : Un noyau de charge Z entouré du nuage des électrons internes ; un électron externe tourne autour. On avance le long d'une période ou on descend une colonne : l'écran grandit ou non, Zeff et le rayon changent, et l'orbite de l'électron externe se resserre ou s'élargit.
  - Pourquoi : Explique les tendances déjà couvertes par tendances-periodiques ; utile mais complémentaire.

## C03 - La liaison chimique
**Couverture bonne** : 6 couvertes, 1 partielles, 0 manquantes.
Trous : Pourquoi les atomes se lient (partiel).

- **P2** `ch-puits-liaison` · Deux atomes qui s'approchent : le puits d'énergie de la liaison (N1, ranger dans `c02`)
  - À l'écran : Deux atomes avec leur nuage électronique ; on fait glisser l'un vers l'autre à la souris et la courbe E(r) se trace en direct, avec les flèches d'attraction et de répulsion. On compare H₂, HCl, Cl₂ et He₂ (pas de puits) : profondeur = énergie de liaison, abscisse du minimum = longueur.
  - Pourquoi : N1 seulement au secondaire (c5-c02-energie-liaison).
- **P3** `ch-trois-liaisons` · Ionique, covalente, métallique : ce que font les électrons (N1, ranger dans `c02`)
  - À l'écran : Un curseur Δχ déplace le nuage électronique d'une paire d'atomes, du partage symétrique au transfert complet. Un 3e mode montre un réseau métallique dont les électrons libres dérivent quand on branche une pile ; un coup de marteau déforme le métal et brise le cristal ionique.
  - Pourquoi : Couvert à l'université par les propriétés, au secondaire par la scène (c5-c02-couches).

## C04 - Géométrie et polarité
**Couverture bonne** : 4 couvertes, 2 partielles, 0 manquantes.
Trous : L'hybridation (partiel) ; Liaisons σ et π (partiel).

- **P2** `ch-hybridation-3d` · Mélanger s et p : les orbitales hybrides en 3D (N1, ranger dans `c02`)
  - À l'écran : En 3D, une orbitale s et trois orbitales p se fondent, sous un curseur de mélange, en quatre lobes sp³ dirigés vers les sommets d'un tétraèdre ; on passe à sp² (trois lobes plans + une p restante) et à sp. La vue tourne à la souris et on pose le résultat sur CH₄, C₂H₄ ou C₂H₂.
  - Pourquoi : N1 couvert seulement en partie (comptage 2D).
- **P2** `ch-sigma-pi-3d` · Recouvrement axial et latéral : σ, π et la rotation bloquée (N1, ranger dans `c02`)
  - À l'écran : Deux carbones en 3D avec leurs orbitales : la σ se forme bout à bout, la π par les côtés. On attrape un groupe CH₂ et on le fait tourner : autour d'une simple liaison rien ne change, avec une double le recouvrement π s'effondre et l'énergie grimpe ; on finit sur les deux isomères cis et trans du dichloroéthène.
  - Pourquoi : N1 seulement compté, jamais montré ; le blocage (N2) est très visuel.

## C05 - Forces intermoléculaires et états
**Couverture partielle** : 3 couvertes, 4 partielles, 0 manquantes.
Trous : Les forces de Van der Waals (partiel) ; Le pont hydrogène (partiel) ; La solubilité (partiel) ; Le cas de l'eau (partiel).

- **P2** `ch-london-dipoles` · Dipôles instantanés : les forces de London en direct (N1, ranger dans `c04`)
  - À l'écran : Des molécules dont le nuage électronique fluctue en couleur ; chaque dipôle instantané en induit un chez sa voisine, et les deux se suivent. On grossit le nuage (He → Xe, F₂ → I₂) ou on change la forme (pentane contre néopentane) : la surface de contact et l'énergie d'attraction changent, et Téb se place sur une échelle.
  - Pourquoi : N1 central dont seules les conséquences sont montrées.
- **P2** `ch-eau-ponts-h-3d` · L'eau en 3D : des ponts hydrogène qui se font et se défont (N1, ranger dans `c04`)
  - À l'écran : Une boîte de molécules d'eau en 3D, qu'on fait tourner ; les ponts H apparaissent en pointillés et clignotent. On règle la température : le nombre moyen de ponts par molécule change ; en dessous de 0 °C, le réseau hexagonal de la glace s'ouvre et la masse volumique baisse.
  - Pourquoi : N1 (pont H, cas de l'eau) seulement au secondaire ou par ses effets.
- **P2** `ch-solubilite-alcools` · Qui se ressemble s'assemble : les alcools dans l'eau (N1, ranger dans `c04`)
  - À l'écran : Un tube à essais où l'on verse un alcool de C₁ à C₈ dans l'eau : les courts se mélangent, les longs forment une couche. Une loupe montre les ponts H avec la tête OH et la chaîne qui écarte l'eau.
  - Pourquoi : N1 seulement au secondaire.
- **P3** `ch-gaz-reel` · Quand le gaz parfait se trompe (N2, ranger dans `L06`)
  - À l'écran : Un piston en 3D où les molécules ont un volume et s'attirent ; on comprime fort ou on refroidit et PV/(nRT) quitte 1 sur la courbe. On compare He, N₂, CO₂ et le gaz parfait.
  - Pourquoi : N2, complète uc-L06-piston-3d.

## C06 - Mole et stœchiométrie
**Couverture bonne** : 5 couvertes, 1 partielles, 0 manquantes.
Trous : La mole (partiel).

- **P3** `ch-dilutions-cascade` · Dilutions en série au labo (N2, ranger dans `L01`)
  - À l'écran : Une rangée de fioles jaugées : on prélève à la pipette, on complète, et la couleur pâlit d'une fiole à l'autre. Une loupe compte les particules de soluté, qui restent les mêmes à chaque transfert ; on règle le facteur et le nombre d'étapes.
  - Pourquoi : Le reste du chapitre est couvert ; utile pour le calcul mental du concours.

## C07 - Thermochimie 1
**Couverture faible** : 1 couvertes, 3 partielles, 2 manquantes.
Trous : Système et milieu extérieur (manquant) ; Travail et chaleur (partiel) ; Le premier principe (partiel) ; L'enthalpie (manquant) ; Réactions exothermiques et endothermiques (partiel).

- **P1** `ch-reaction-piston` · Une réaction qui pousse un piston : Q, W, ΔU et ΔH (N1, ranger dans `c05`)
  - À l'écran : Du zinc tombe dans l'acide au fond d'un cylindre à piston plongé dans un bain : le H₂ formé soulève le piston contre l'atmosphère, des flèches montrent la chaleur qui sort et le travail fourni, et un escalier d'énergie fait le bilan ΔU = Q + W. On bloque le piston (volume constant, W = 0, Qv = ΔU) ou on le libère (Qp = ΔH) et on règle la quantité de zinc.
  - Pourquoi : N1 central (premier principe en chimie, sens de l'enthalpie), très visuel, rien côté chimie ; la physique BA1 n'en couvre que la partie gaz.
- **P2** `ch-exo-endo-mains` · Chaufferette et poche de froid : le signe de ΔH (N1, ranger dans `c05`)
  - À l'écran : Deux béchers sur la paillasse : on y dissout du CaCl₂ et du NH₄NO₃, une main posée sur chacun prend une teinte de caméra thermique et le thermomètre bouge. À côté, le diagramme d'enthalpie montre la flèche vers le bas ou vers le haut ; on règle la masse dissoute.
  - Pourquoi : N1 seulement au secondaire ; corrige le piège « système contre milieu ».

## C08 - Thermochimie 2
**Couverture partielle** : 4 couvertes, 0 partielles, 2 manquantes.
Trous : La bombe calorimétrique (manquant) ; L'enthalpie change avec la température (manquant).

- **P1** `ch-bombe-calorimetrique` · La bombe calorimétrique : brûler du glucose en vase clos (N1, ranger dans `c05`)
  - À l'écran : Une bombe en acier qu'on fait tourner en 3D, plongée dans un seau d'eau agité : on met le feu à une pastille de glucose (ou d'un autre aliment), la température monte et la courbe T(t) se trace. On règle la masse et la capacité du calorimètre ; on lit ΔU puis ΔH = ΔU + Δn(gaz)·RT.
  - Pourquoi : N1 (bombe), très visuel, rien sur le site ; lien médecine (valeur énergétique des aliments). Peut partager le moteur de ch-reaction-piston.
- **P3** `ch-kirchhoff` · ΔH à une autre température : le cycle de Kirchhoff (N1, ranger dans `c05`)
  - À l'écran : Un cycle en escalier : refroidir les réactifs, réagir à 298 K, réchauffer les produits ; la hauteur de chaque marche suit Cp. On fait glisser T₂ et ΔH(T₂) se met à jour sur l'exemple de la synthèse de l'ammoniac.
  - Pourquoi : N1 mais peu visuel ; un schéma animé suffit.

## C09 - Entropie et enthalpie libre
**Couverture partielle** : 2 couvertes, 2 partielles, 2 manquantes.
Trous : Le désordre et l'entropie (manquant) ; Prévoir et calculer ΔS (partiel) ; Le deuxième principe (manquant) ; ΔG° et la constante d'équilibre (partiel).

- **P1** `ch-entropie-microetats` · Compter les arrangements : l'entropie en direct (N1, ranger dans `c05`)
  - À l'écran : Une boîte à deux compartiments : on retire la cloison, les molécules se répandent et le compteur de micro-états W s'envole, avec S = k·ln W. Un 2e mode chauffe un cristal en 3D jusqu'au liquide puis au gaz : la courbe S(T) monte avec un saut à chaque changement d'état.
  - Pourquoi : N1 central, très visuel, rien sur le site.
- **P2** `ch-entropie-univers` · Le congélateur et l'univers : ΔS du système et du milieu (N1, ranger dans `c05`)
  - À l'écran : De l'eau gèle dans une pièce dont on règle la température : ΔS(système) est négatif, ΔS(milieu) = −ΔH/T est positif, et deux barres s'additionnent en ΔS(univers). En dessous de 0 °C la somme est positive et la glace se forme ; au-dessus, elle fond.
  - Pourquoi : N1 absent du site, mais scène moins riche ; rejoint ΔG déjà couvert.
- **P2** `ch-minimum-g` · G en fonction de l'avancement : pourquoi la réaction s'arrête (N2, ranger dans `c05`)
  - À l'écran : Une bille roule sur la courbe G(ξ) et s'arrête au minimum ; sous la courbe, une boîte de particules montre la composition. On règle ΔG° : le minimum se déplace vers les réactifs ou vers les produits, et K se lit au fond.
  - Pourquoi : N2 très visuel ; relie C09 et C10.

## C10 - Équilibre chimique
**Couverture bonne** : 5 couvertes, 1 partielles, 0 manquantes.
Trous : Réactions réversibles et état d'équilibre (partiel).

- **P2** `ch-equilibre-dynamique` · L'équilibre est dynamique : le marquage isotopique (N1, ranger dans `c06`)
  - À l'écran : Une boîte 3D de molécules A ⇌ B qui se transforment dans les deux sens ; les vitesses aller et retour se rejoignent sur un graphe. À l'équilibre, on injecte des molécules marquées en couleur : les concentrations ne bougent plus, mais la couleur se répand dans les deux espèces.
  - Pourquoi : N1 couvert seulement au secondaire pour la vue particulaire.

## C11 - Cinétique chimique
**Couverture bonne** : 3 couvertes, 3 partielles, 0 manquantes.
Trous : La vitesse de réaction (partiel) ; Les facteurs cinétiques (partiel) ; La catalyse (partiel).

- **P2** `ch-vitesse-tangente` · Vitesse moyenne, vitesse instantanée : la tangente (N1, ranger dans `c07`)
  - À l'écran : Un flacon où une couleur s'efface (suivie au spectrophotomètre) trace [A](t) en direct. On place deux points pour la corde (vitesse moyenne) et on fait glisser un point pour la tangente (vitesse instantanée), dont la pente s'affiche ; on change T ou [A]₀.
  - Pourquoi : N1 seulement en partie couvert ; piège d'examen classique.
- **P2** `ch-collisions-3d` · Les collisions efficaces en 3D : énergie et orientation (N1, ranger dans `c07`)
  - À l'écran : Des molécules A et B en 3D dans une boîte qu'on fait tourner ; seuls les chocs assez énergétiques et bien orientés font un éclair et donnent un produit. On règle T, les concentrations et la division d'un solide (bloc ou poudre) ; un compteur de chocs efficaces par seconde suit.
  - Pourquoi : N1 : la scène n'existe qu'au secondaire (c5-c07-collisions).
- **P2** `ch-enzyme-site-actif` · Enzyme et substrat : le site actif en 3D (N1, ranger dans `c07`)
  - À l'écran : Une enzyme en 3D avec sa poche ; plusieurs molécules flottent autour et seule la forme complémentaire s'y loge (ajustement induit), puis repart transformée. On augmente [S] jusqu'à la saturation (lien avec la courbe v([S])) et on ajoute un inhibiteur compétitif qui occupe la poche.
  - Pourquoi : N1 (sélectivité enzymatique) absent ; uc-c07-michaelis-menten ne montre que des courbes.
- **P3** `ch-catalyse-heterogene` · Hydrogénation sur une surface de nickel (N1, ranger dans `c07`)
  - À l'écran : Une surface métallique en relief : H₂ s'adsorbe et se coupe en atomes, l'éthylène se couche sur la surface, les H s'ajoutent et l'éthane repart. On compare avec et sans catalyseur, et on bouche des sites (empoisonnement).
  - Pourquoi : N1 (types de catalyse), moins central.

## C12 - Acides et bases 1
**Couverture partielle** : 2 couvertes, 3 partielles, 1 manquantes.
Trous : Les trois définitions (manquant) ; Les couples acide-base conjugués (partiel) ; L'eau, le produit ionique et le pH (partiel) ; Structure moléculaire et force d'un acide (partiel).

- **P2** `ch-autoprotolyse` · L'eau pure n'est jamais pure : l'autoprotolyse (N1, ranger dans `L12`)
  - À l'écran : Une boîte de molécules d'eau en 3D ; de rares molécules échangent un proton et une loupe compte les H₃O⁺ et OH⁻ (1 paire sur 555 millions). On règle la température : Ke et le pH neutre changent, et le pH de l'eau pure s'écarte de 7.
  - Pourquoi : N1 seulement en partie couvert (échelle de pH).
- **P2** `ch-force-acide-structure` · Pourquoi HI est plus fort que HF : taille, électronégativité, oxacides (N1, ranger dans `L12`)
  - À l'écran : Des molécules en 3D colorées par leur densité électronique ; on descend la colonne HF → HI (la liaison s'allonge) ou on avance sur la période CH₄ → HF. Un 2e mode ajoute des O à HClO jusqu'à HClO₄ : la charge du conjugué s'étale et le pKa chute sur une échelle.
  - Pourquoi : N1 absent en chimie générale ; l'effet inductif n'est traité qu'en organique.
- **P3** `ch-transfert-proton` · Le proton qui saute : deux couples en 3D (N1, ranger dans `L12`)
  - À l'écran : On attrape le proton d'un acide (HCl, CH₃COOH, NH₄⁺) et on le dépose sur une base (H₂O, NH₃) ; les deux couples conjugués s'éclairent. Pour H₃PO₄, les protons partent un par un et chaque pKa s'affiche.
  - Pourquoi : Notion simple, déjà en partie dans predominance-pi.

## C13 - Acides et bases 2
**Couverture bonne** : 5 couvertes, 1 partielles, 0 manquantes.
Trous : Pouvoir tampon et tampons physiologiques (partiel).

- **P2** `ch-tampon-sang` · Le tampon bicarbonate : le sang et les poumons (N2, ranger dans `L13`)
  - À l'écran : Un buste avec les poumons et un vaisseau sanguin ; le CO₂ passe du sang à l'air et HCO₃⁻ se règle. On règle la respiration (hypo ou hyperventilation) et une charge acide (lactate à l'effort) : le pH sanguin suit Henderson-Hasselbalch avec la pCO₂, et on compare système ouvert et fermé.
  - Pourquoi : N2 très visuel et central pour les étudiants en médecine ; absent du site.

## C14 - Oxydoréduction et piles
**Couverture bonne** : 5 couvertes, 1 partielles, 0 manquantes.
Trous : Les nombres d'oxydation (partiel).

- **P3** `ch-pile-daniell-zoom` · La pile Daniell vue de près : électrons, ions et pont salin (N1, ranger dans `c08`)
  - À l'écran : Une grande pile Daniell en relief ; une loupe montre les atomes de Zn qui partent en ions, les Cu²⁺ qui se déposent, les électrons dans le fil et les ions qui migrent dans le pont salin. On retire le pont : les charges s'accumulent et le courant s'arrête ; un mode compare avec la lame de zinc plongée directement dans le sulfate de cuivre, qui ne fait que chauffer.
  - Pourquoi : Déjà couvert ; ajoute la vue particulaire au niveau des pages de référence.
- **P3** `ch-electrode-hydrogene` · L'électrode standard à hydrogène (N2, ranger dans `c08`)
  - À l'écran : Une électrode de platine où bulle H₂ sous 1 bar dans un acide à pH 0, reliée par un pont à une demi-pile au choix ; le voltmètre lit directement E°. On change la demi-pile et le signe de la lecture s'inverse quand le métal est plus noble.
  - Pourquoi : N2, complète l'échelle des E°.

## C15 - Nernst, corrosion, électrolyse
**Couverture partielle** : 3 couvertes, 2 partielles, 1 manquantes.
Trous : Prévoir une réaction d'oxydoréduction (partiel) ; La corrosion du fer et sa prévention (partiel) ; Les espèces réactives de l'oxygène (manquant).

- **P2** `ch-corrosion-goutte` · Une goutte d'eau sur le fer : la pile de corrosion (N1, ranger dans `c08`)
  - À l'écran : Une goutte d'eau vue en coupe sur une tôle d'acier : au centre le fer se dissout (anode), sur le bord O₂ est réduit (cathode), les électrons filent dans le métal et un anneau de rouille se forme. On ajoute du sel, on retire l'O₂, on galvanise au zinc, on pose une anode sacrificielle ou on raye une peinture ou un étamage.
  - Pourquoi : N1 central et très visuel, mais seulement au secondaire.
- **P2** `ch-regle-gamma-ph` · La règle du gamma, et quand le pH s'en mêle (N1, ranger dans `c08`)
  - À l'écran : Une échelle verticale des E° : on glisse deux couples, le gamma se dessine et un bécher montre à côté la réaction qui se produit ou non (métal dans une solution). Un curseur de pH fait descendre le potentiel de MnO₄⁻/Mn²⁺ ou de O₂/H₂O, et l'ordre des couples peut s'inverser.
  - Pourquoi : N1 couvert au secondaire ; l'effet du pH (N2) absent.
- **P2** `ch-especes-reactives-oxygene` · De O₂ à H₂O : la cascade des espèces réactives (N1, ranger dans `c08`)
  - À l'écran : L'O₂ reçoit ses quatre électrons un par un sur une échelle d'énergie : O₂•⁻, H₂O₂, •OH, puis H₂O. Un radical arrache un électron à un lipide de membrane et déclenche une réaction en chaîne ; on active la SOD, la catalase ou la vitamine E pour la couper.
  - Pourquoi : N1 absent du site et important en médecine ; plus descriptif que calculatoire.

## Récapitulatif

- Sections analysées : 107 (15 « Méthode, pièges et formulaire » sans objet).
- Sur les 92 sections de matière : **56 couvertes**, **26 partielles**, **10 manquantes**.
- Propositions : **5 P1**, **21 P2**, **10 P3** (36 au total).

### Les P1

- `ch-orbitales-3d` (C01) · Orbitales s, p et d en 3D : le nuage et ses nœuds
- `ch-de-broglie` (C01) · Électron ou balle de tennis : la longueur d'onde de de Broglie
- `ch-reaction-piston` (C07) · Une réaction qui pousse un piston : Q, W, ΔU et ΔH
- `ch-bombe-calorimetrique` (C08) · La bombe calorimétrique : brûler du glucose en vase clos
- `ch-entropie-microetats` (C09) · Compter les arrangements : l'entropie en direct

### Remarques
- `ch-de-broglie` peut faire doublon avec le domaine quantique (`pq-`) : à arbitrer.
- `ch-reaction-piston` et `ch-bombe-calorimetrique` peuvent partager le même moteur (volume constant contre pression constante).
- Règle 7 d'Enzo (pas de défis en chimie) : `uc-c01-bohr` annonce encore un « Défi » dans son texte, et `uc-c04-types-solides` et `uc-c09-entraineur-additions` affichent un score. À vérifier.
- Le chapitre L03 du moteur n'a aucune simulation : c'est la page autonome `configuration-electronique` qui le couvre. L13 non plus (couvert par `titrage-tampon` et `predominance-pi`).
