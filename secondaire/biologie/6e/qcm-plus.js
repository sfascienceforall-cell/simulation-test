/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n’est repris d’un examen.
   Ils s’ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c01", [
 {t:"Le groupe AB (QCM)", s:1, enonce:"Une personne de génotype AB exprime à la fois l’antigène A et l’antigène B sur ses globules rouges. Comment appelle-t-on cette relation entre les allèles A et B ?", choix:["La codominance","La dominance incomplète","La récessivité","Un allèle létal"], bonne:0,
  pourquoi:{1:"En dominance incomplète, l’hétérozygote a un phénotype intermédiaire (belle-de-nuit rose), pas les deux phénotypes à la fois.",2:"Aucun des deux allèles n’est masqué : ni A ni B n’est récessif par rapport à l’autre.",3:"Un allèle létal entraîne la mort des homozygotes ; le groupe AB est parfaitement viable."},
  corrige:"En codominance, les deux allèles s’expriment ensemble : le groupe AB porte les antigènes A et B. A et B sont, eux, dominants sur O ✓."},
 {t:"Après trois enfants dominants (QCM)", s:2, enonce:"Deux parents Aa (dominance complète) ont déjà trois enfants au phénotype dominant. Quelle est la probabilité que leur quatrième enfant ait le phénotype récessif ?", choix:["1 : il en faut forcément un sur quatre.","1/4","1/256","3/4"], bonne:1,
  pourquoi:{0:"Idée fausse : 3 : 1 est une probabilité, pas une obligation sur une petite famille. Chaque naissance est indépendante.",2:"1/256 = (1/4)⁴ serait la probabilité que les quatre enfants soient récessifs.",3:"3/4 est la probabilité d’un phénotype dominant, pas récessif."},
  corrige:"Chaque naissance est indépendante des précédentes : pour Aa × Aa, P(aa) = 1/4 à chaque fois, quel que soit le résultat des enfants précédents ✓."}
]);
SFA.exos("c02", [
 {t:"Types de gamètes de AaBbCCDd (QCM)", s:2, enonce:"Combien de types de gamètes différents un individu AaBbCCDd peut-il produire (quatre gènes indépendants) ?", choix:["4","6","8","16"], bonne:2,
  pourquoi:{0:"4 = 2² ne compte que deux gènes hétérozygotes ; il y en a trois (A, B et D).",1:"6 = 2 × 3 : on a multiplié au lieu d’élever 2 à la puissance du nombre de gènes hétérozygotes.",3:"16 = 2⁴ compte aussi le gène C, or CC est homozygote : il ne donne qu’un seul type d’allèle."},
  corrige:"Seuls les gènes hétérozygotes (A, B, D) multiplient les possibilités : 2³ = 8 types de gamètes, chacun portant C ✓."},
 {t:"Calculer un χ² simple (QCM)", s:4, enonce:"Un croisement Aa × Aa donne 100 descendants : 70 au phénotype dominant et 30 au phénotype récessif. Quelle est la valeur du χ² par rapport au rapport 3 : 1 ?", choix:["0","1,19","1,33","10"], bonne:2,
  pourquoi:{0:"0 vient de Σ(O − E) = −5 + 5 : les écarts doivent être élevés au carré avant d’être additionnés.",1:"1,19 = Σ(O − E)²/O : on a divisé par les effectifs observés au lieu des attendus.",3:"10 = Σ|O − E| : les écarts ont été additionnés sans être élevés au carré ni divisés par E."},
  corrige:"Attendus : 75 et 25. χ² = (70 − 75)²/75 + (30 − 25)²/25 = 25/75 + 25/25 ≈ 0,33 + 1 = 1,33. C’est inférieur à 3,84 (1 ddl) : on ne rejette pas le rapport 3 : 1 ✓."}
]);
SFA.exos("c03", [
 {t:"Pourquoi surtout des garçons ? (QCM)", s:1, enonce:"Pourquoi le daltonisme (récessif, lié au chromosome X) touche-t-il beaucoup plus de garçons que de filles ?", choix:["Parce que le gène du daltonisme est porté par le chromosome Y.","Parce que les garçons reçoivent leur X de leur père.","Parce que le daltonisme est dominant chez les garçons.","Parce que les garçons n’ont qu’un X : un seul allèle récessif suffit pour qu’ils soient atteints."], bonne:3,
  pourquoi:{0:"Le gène est porté par X et absent de Y.",1:"Un garçon reçoit son X de sa mère et son Y de son père.",2:"L’allèle reste récessif ; il s’exprime chez le garçon parce qu’il n’a pas de second X pour le masquer."},
  corrige:"L’homme (XY) est hémizygote : il n’a qu’un exemplaire du gène. Un seul Xd suffit. La femme doit être XdXd. Avec q = 0,08 : 8 % des hommes contre 0,64 % des femmes ✓."},
 {t:"Le frère hémophile (QCM)", s:4, enonce:"Une femme non hémophile a un frère hémophile ; ses parents ne sont pas hémophiles. Elle a un enfant avec un homme non hémophile. Quelle est la probabilité que ce premier enfant soit un garçon hémophile ?", choix:["1/4","1/6","1/8","1/16"], bonne:2,
  pourquoi:{0:"1/4 suppose qu’elle est porteuse à coup sûr ; elle ne l’est qu’avec une probabilité de 1/2.",1:"1/6 = 2/3 × 1/4 : le 2/3 vaut pour une maladie autosomique récessive, pas pour une maladie liée à X.",3:"1/16 : la probabilité d’avoir un garçon a été comptée deux fois."},
  corrige:"Son frère XhY a reçu Xh de leur mère, qui est donc XHXh. Elle-même a reçu XH de son père et un X de sa mère : porteuse avec P = 1/2. Si elle est porteuse, P(garçon atteint) = 1/2 × 1/2 = 1/4. Total : 1/2 × 1/4 = 1/8 ✓."}
]);
SFA.exos("c04", [
 {t:"Le caryotype de Turner (QCM)", s:1, enonce:"Quel caryotype correspond au syndrome de Turner ?", choix:["47,XXY","45,X","47,XX,+21","46,XY"], bonne:1,
  pourquoi:{0:"47,XXY est le syndrome de Klinefelter.",2:"47,XX,+21 est une trisomie 21 chez une fille.",3:"46,XY est le caryotype normal d’un garçon."},
  corrige:"Le syndrome de Turner est une monosomie : un seul chromosome X et 45 chromosomes au total, noté 45,X ✓."},
 {t:"Risque d’un couple pris au hasard (QCM)", s:3, enonce:"Dans une population, une personne sur 25 est porteuse saine de l’allèle de la mucoviscidose (autosomique récessive). Quel est le risque, pour un couple pris au hasard, d’avoir un enfant atteint ?", choix:["1/100","1/625","1/2 500","1/50"], bonne:2,
  pourquoi:{0:"1/100 = 1/25 × 1/4 : on n’a compté qu’un seul parent porteur ; il faut que les deux le soient.",1:"1/625 = (1/25)² : c’est la probabilité que les deux soient porteurs, mais il faut encore multiplier par 1/4.",3:"1/50 = 2 × 1/25 : on a additionné les probabilités des deux parents au lieu de les multiplier."},
  corrige:"P(deux porteurs) × P(enfant mm) = (1/25)² × 1/4 = 1/625 × 1/4 = 1/2 500 ✓."}
]);
SFA.exos("c05", [
 {t:"La PCR à 95 °C (QCM)", s:2, enonce:"Au cours d’un cycle de PCR, à quoi sert l’étape à environ 95 °C ?", choix:["À fixer les amorces sur l’ADN","À faire travailler la polymérase (élongation)","À détruire la polymérase pour arrêter la réaction","À séparer les deux brins de l’ADN (dénaturation)"], bonne:3,
  pourquoi:{0:"L’hybridation des amorces se fait à plus basse température, vers 55 °C.",1:"L’élongation par la polymérase se fait vers 72 °C.",2:"La Taq polymérase est thermostable : elle résiste à 95 °C et sert à tous les cycles."},
  corrige:"Un cycle : dénaturation (95 °C, les brins se séparent), hybridation des amorces (≈ 55 °C), élongation (72 °C). Le nombre de copies double à chaque cycle ✓."},
 {t:"Couper un plasmide (QCM)", s:3, enonce:"Un plasmide circulaire de 6 000 pb est coupé par une enzyme qui a deux sites, aux positions 1 000 et 4 500. Quels fragments obtient-on ?", choix:["1 000, 3 500 et 1 500 pb","3 500 et 2 500 pb","3 500 pb seulement","4 500 et 1 500 pb"], bonne:1,
  pourquoi:{0:"Ce serait le résultat pour un ADN linéaire. Un ADN circulaire n’a pas d’extrémités : 1 000 et 1 500 forment un seul fragment.",2:"Il reste aussi le fragment qui fait le tour par l’origine : 6 000 − 3 500 = 2 500 pb.",3:"Les positions des sites ont été prises pour des tailles de fragments."},
  corrige:"Pour un ADN circulaire, n coupures donnent n fragments. Entre 1 000 et 4 500 : 3 500 pb ; le reste du cercle : 6 000 − 3 500 = 2 500 pb. Contrôle : 3 500 + 2 500 = 6 000 ✓."}
]);
SFA.exos("c06", [
 {t:"L’antibiotique crée-t-il la résistance ? (QCM)", s:2, enonce:"Après un traitement antibiotique mal suivi, une souche résistante devient majoritaire. Quelle explication est correcte ?", choix:["Des bactéries résistantes existaient déjà par mutation aléatoire ; l’antibiotique a éliminé les sensibles, et les résistantes se sont multipliées.","L’antibiotique a provoqué chez les bactéries les mutations qui les rendent résistantes.","Les bactéries se sont habituées à l’antibiotique et ont transmis cette habitude à leurs descendantes.","C’est le corps du patient qui est devenu résistant à l’antibiotique."], bonne:0,
  pourquoi:{1:"La mutation est aléatoire, non dirigée par le milieu : l’antibiotique ne crée pas la résistance, il la sélectionne.",2:"C’est un raisonnement lamarckien : un caractère acquis au cours de la vie ne se transmet pas.",3:"Ce sont les bactéries qui deviennent résistantes, pas le patient."},
  corrige:"Parmi 10⁹ bactéries, environ 10 sont déjà résistantes. L’antibiotique tue 99,99 % des sensibles et aucune résistante : il élimine la concurrence. C’est une sélection naturelle ✓."},
 {t:"Phalènes : une génération (QCM)", s:4, enonce:"Dans une population de phalènes, 30 % des individus sont foncés. La survie jusqu’à la reproduction est de 0,8 pour les foncés et 0,5 pour les clairs. Quelle sera la fréquence des foncés à la génération suivante ?", choix:["24 %","30 %","41 %","48 %"], bonne:2,
  pourquoi:{0:"24 % = 0,30 × 0,8 : c’est la part de foncés survivants dans la population de départ, il faut encore diviser par l’ensemble des survivants.",1:"30 % : la fréquence ne reste pas la même quand les deux formes survivent différemment.",3:"48 % = 0,30 × 0,8/0,5 : on a multiplié la fréquence par le rapport des survies au lieu d’utiliser la formule complète."},
  corrige:"p′ = p × w<sub>f</sub> / (p × w<sub>f</sub> + (1 − p) × w<sub>c</sub>) = 0,24 / (0,24 + 0,35) = 0,24 / 0,59 ≈ 0,407, soit environ 41 %. Contrôle : la fréquence augmente, car les foncés survivent mieux ✓."}
]);
SFA.exos("c07", [
 {t:"Le mulet (QCM)", s:1, enonce:"Le cheval et l’âne peuvent s’accoupler, mais le mulet qui naît est stérile. Que peut-on en conclure ?", choix:["Le cheval et l’âne sont deux espèces différentes : leurs descendants ne sont pas féconds.","Le cheval et l’âne appartiennent à la même espèce, puisqu’ils ont un descendant.","Le mulet est une troisième espèce.","On ne peut rien conclure sans fossiles."], bonne:0,
  pourquoi:{1:"Une espèce suppose des descendants féconds ; un descendant stérile ne suffit pas.",2:"Le mulet ne peut pas se reproduire : il ne forme pas de population qui se perpétue, donc pas une espèce.",3:"La définition biologique de l’espèce repose sur la reproduction, observable chez les êtres vivants actuels."},
  corrige:"Une espèce est un ensemble de populations dont les individus donnent des descendants féconds. Le mulet est stérile : il y a isolement reproductif après la fécondation, cheval et âne sont deux espèces ✓."},
 {t:"Horloge moléculaire (QCM)", s:3, enonce:"Deux espèces diffèrent par 30 nucléotides sur 1 000 sites comparés. La vitesse de substitution est de 1·10⁻⁹ par site et par an sur chaque lignée. Depuis combien de temps ont-elles divergé ?", choix:["15 millions d’années","30 millions d’années","60 millions d’années","15 000 millions d’années"], bonne:0,
  pourquoi:{1:"30 Ma = d / v : on a oublié que les deux lignées accumulent des différences, d’où le facteur 2.",2:"60 Ma = 2d / v : on a multiplié par 2 au lieu de diviser.",3:"15 000 Ma : on a utilisé 30 différences au lieu de 30/1 000 = 0,03 par site."},
  corrige:"d = 30 / 1 000 = 0,03 par site. T = d / (2v) = 0,03 / (2 × 10⁻⁹) = 1,5·10⁷ ans = 15 millions d’années. Contrôle : 2 × 10⁻⁹ × 1,5·10⁷ = 0,03 ✓."}
]);
SFA.exos("c08", [
 {t:"Ce que montre l’expérience de Miller (QCM)", s:2, enonce:"Quelle conclusion peut-on tirer de l’expérience de Miller (1953) ?", choix:["Elle a produit des cellules vivantes à partir de gaz.","Elle prouve la composition exacte de l’atmosphère primitive.","Elle montre comment sont apparues la réplication et les premières cellules.","Des molécules organiques, comme des acides aminés, peuvent se former spontanément dans des conditions prébiotiques."], bonne:3,
  pourquoi:{0:"Le piège contenait des acides aminés, pas des êtres vivants.",1:"Le mélange de gaz reproduit une atmosphère supposée ; l’expérience ne prouve pas qu’elle était exactement ainsi.",2:"L’expérience ne dit rien de l’apparition de la réplication, du métabolisme ni des cellules."},
  corrige:"Miller montre que des molécules organiques (acides aminés) peuvent se former spontanément à partir de CH₄, NH₃, H₂ et d’eau soumis à des étincelles. Le passage aux cellules reste une hypothèse ✓."},
 {t:"Le buisson des hominidés (QCM)", s:3, enonce:"Quelle affirmation sur l’évolution humaine est la plus juste ?", choix:["L’être humain descend du chimpanzé actuel.","Les espèces humaines forment une ligne droite : chacune a remplacé la précédente, avec un cerveau toujours plus grand.","Le volume du cerveau a augmenté à vitesse constante depuis 2 millions d’années.","L’évolution humaine est un buisson d’espèces, dont certaines ont coexisté ; le volume du cerveau n’a pas augmenté de façon régulière."], bonne:3,
  pourquoi:{0:"Idée fausse : l’humain et le chimpanzé actuel partagent un ancêtre commun ; aucune espèce actuelle ne descend d’une autre espèce actuelle.",1:"Des espèces ont coexisté, et H. floresiensis vivait récemment avec un cerveau de 420 cm³ : il n’y a pas de tendance universelle.",2:"De H. habilis à H. erectus : ≈ 486 cm³/Ma ; puis jusqu’à H. heidelbergensis : ≈ 313 cm³/Ma. La vitesse n’est pas constante."},
  corrige:"L’évolution humaine est un buisson : plusieurs espèces ont coexisté. Le volume crânien augmente globalement, mais pas régulièrement (486 puis 313 cm³/Ma), et H. floresiensis montre qu’il n’existe pas de tendance universelle ✓."}
]);
SFA.exos("c09", [
 {t:"Rhizobium et légumineuse (QCM)", s:1, enonce:"Les bactéries Rhizobium des nodosités fournissent de l’azote à la légumineuse, qui leur fournit des sucres. Quelle est cette interaction ?", choix:["Le parasitisme","Le mutualisme","Le commensalisme","La compétition"], bonne:1,
  pourquoi:{0:"Dans le parasitisme (+ −), l’hôte est affaibli ; ici, la plante en tire profit.",2:"Dans le commensalisme (+ 0), une seule espèce profite ; ici, les deux en tirent un bénéfice.",3:"La compétition (− −) nuit aux deux espèces."},
  corrige:"Les deux partenaires en tirent un bénéfice (+ +) : c’est du mutualisme ✓."},
 {t:"Croissance la plus rapide (QCM)", s:3, enonce:"Une population suit dN/dt = r·N·(1 − N/K) avec r = 0,5 par an et K = 800. La vitesse de croissance est maximale pour N = K/2. Combien vaut cette vitesse maximale ?", choix:["400 individus par an","200 individus par an","100 individus par an","50 individus par an"], bonne:2,
  pourquoi:{0:"400 = r × K : on a oublié le terme N/K et pris N = K, sans le frein.",1:"200 = r × N avec N = 400 : le frein (1 − N/K) = 0,5 a été oublié.",3:"50 = r × 400 / 4 : la formule r·K/4 a été appliquée avec N au lieu de K."},
  corrige:"N = K/2 = 400. dN/dt = 0,5 × 400 × (1 − 400/800) = 0,5 × 400 × 0,5 = 100 individus par an. Contrôle : r·K/4 = 0,5 × 800 / 4 = 100 ✓."}
]);
SFA.exos("c10", [
 {t:"Sans effet de serre naturel (QCM)", s:1, enonce:"Que se passerait-il s’il n’y avait aucun effet de serre naturel ?", choix:["La Terre serait beaucoup plus froide, environ −18 °C en moyenne.","La Terre serait plus chaude.","Rien : l’effet de serre est uniquement dû aux activités humaines.","Le trou de la couche d’ozone se refermerait."], bonne:0,
  pourquoi:{1:"L’effet de serre retient de la chaleur : sans lui, la Terre serait plus froide, pas plus chaude.",2:"Il existe un effet de serre naturel (vapeur d’eau, CO₂) ; les activités humaines le renforcent.",3:"L’effet de serre et la couche d’ozone sont deux phénomènes différents."},
  corrige:"Les gaz à effet de serre absorbent une partie du rayonnement infrarouge émis par la Terre et le réémettent vers le sol. Cet effet naturel est indispensable : sans lui, la Terre serait à environ −18 °C ✓."},
 {t:"Doubler la concentration de CO₂ (QCM)", s:4, enonce:"Le forçage radiatif vaut ΔF = 5,35 × ln(C/C₀) en W/m². Quel forçage produit le passage de 300 ppm à 600 ppm de CO₂ ?", choix:["10,7 W/m²","3,7 W/m²","1,6 W/m²","5,35 W/m²"], bonne:1,
  pourquoi:{0:"10,7 = 5,35 × 2 : on a multiplié par le rapport C/C₀ au lieu de prendre son logarithme.",2:"1,6 = 5,35 × log₁₀ 2 : on a utilisé le logarithme décimal au lieu du logarithme népérien.",3:"5,35 = 5,35 × (600 − 300)/300 : la variation relative a remplacé le logarithme."},
  corrige:"ΔF = 5,35 × ln(600/300) = 5,35 × ln 2 ≈ 5,35 × 0,693 ≈ 3,7 W/m². C’est le forçage d’un doublement, le même quelle que soit la concentration de départ ✓."}
]);
