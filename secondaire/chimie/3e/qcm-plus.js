/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n’est repris d’un examen.
   Ils s’ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c01", [
 {t:"Séparer l’eau et l’huile (QCM)", s:1, enonce:"De l’huile et de l’eau forment deux couches dans un récipient. Quelle technique permet de les séparer simplement ?", choix:["La décantation (ampoule à décanter)","La filtration","L’évaporation","L’aimant"], bonne:0,
  pourquoi:{1:"La filtration retient un solide non dissous ; deux liquides passent tous les deux à travers le filtre.",2:"L’évaporation fait disparaître l’eau dans l’air : on ne la récupère pas, et on ne sépare pas proprement les deux liquides.",3:"L’aimant n’attire que le fer, le cobalt et le nickel : il n’agit pas sur des liquides."},
  corrige:"L’huile et l’eau sont non miscibles et n’ont pas la même masse volumique : l’huile flotte sur l’eau. Dans une ampoule à décanter, on laisse couler l’eau (couche du bas), puis on ferme le robinet : c’est la <b>décantation</b>. Contrôle : on obtient deux liquides séparés, rien n’est perdu ✓."},
 {t:"Rf d’une tache bleue (QCM)", s:2, enonce:"Sur un chromatogramme, le front du solvant est à 7,5 cm de la ligne de dépôt et une tache bleue est à 3,0 cm de cette ligne. Quel est le rapport frontal de la tache ?", choix:["2,5","4,5 cm","0,60","0,40"], bonne:3,
  pourquoi:{0:"Le rapport est inversé : on a fait 7,5 ÷ 3,0. Rf est toujours compris entre 0 et 1.",1:"On a soustrait les distances (7,5 − 3,0) : Rf est un quotient, sans unité.",2:"On a mesuré la tache depuis le front du solvant ((7,5 − 3,0) ÷ 7,5) au lieu de depuis la ligne de dépôt."},
  corrige:"Rf = distance de la tache ÷ distance du front, toutes deux mesurées depuis la ligne de dépôt : Rf = 3,0 ÷ 7,5 = <b>0,40</b>, sans unité. Contrôle : 0,40 × 7,5 cm = 3,0 cm ✓."},
 {t:"Boire de l’eau de mer ? (QCM)", s:3, enonce:"On veut obtenir de l’eau pure, liquide, à partir d’eau salée. Quelle technique convient ?", choix:["La filtration sur papier filtre","L’évaporation à l’air libre","La décantation","La distillation"], bonne:3,
  pourquoi:{0:"Le sel est dissous : ses particules traversent le filtre avec l’eau. Le filtrat est toujours salé.",1:"L’évaporation récupère le sel, mais l’eau part dans l’air : on la perd.",2:"Il n’y a qu’une seule phase (mélange homogène) : rien ne se dépose, la décantation ne sépare rien."},
  corrige:"Dans la <b>distillation</b>, l’eau bout, sa vapeur est refroidie dans le réfrigérant et se condense : on recueille de l’eau pure, et le sel reste dans le ballon. Contrôle : le distillat ne laisse aucun dépôt quand on l’évapore ✓."}
]);
SFA.exos("c02", [
 {t:"Volume propre, forme variable (QCM)", s:1, enonce:"Dans quel état la matière a-t-elle un volume propre mais pas de forme propre (elle prend la forme du récipient) ?", choix:["L’état solide","L’état liquide","L’état gazeux"], bonne:1,
  pourquoi:{0:"Un solide a une forme propre : ses particules sont ordonnées et vibrent sur place.",2:"Un gaz n’a ni forme ni volume propres : il occupe tout le récipient et se comprime."},
  corrige:"Dans un liquide, les particules sont serrées (volume propre, presque incompressible) mais désordonnées et glissent les unes sur les autres : la forme suit le récipient. C’est l’<b>état liquide</b> ✓."},
 {t:"Neutrons de l’aluminium (QCM)", s:2, enonce:"L’atome d’aluminium a Z = 13 et A = 27. Combien de neutrons contient son noyau ?", choix:["27","13","14","40"], bonne:2,
  pourquoi:{0:"27 est le nombre de masse A : il compte les protons ET les neutrons.",1:"13 est le nombre de protons (Z) : un noyau n’a pas forcément autant de neutrons que de protons.",3:"On a additionné A et Z : il faut soustraire, N = A − Z."},
  corrige:"A = Z + N, donc N = A − Z = 27 − 13 = <b>14</b> neutrons. Contrôle : 13 protons + 14 neutrons = 27 nucléons ✓."},
 {t:"Où est la masse de l’atome ? (QCM)", s:3, enonce:"Où se trouve presque toute la masse d’un atome ?", choix:["Dans le noyau, formé de protons et de neutrons","Dans les électrons, qui occupent presque tout le volume","Elle est répartie uniformément dans tout l’atome","Dans le vide entre le noyau et les électrons"], bonne:0,
  pourquoi:{1:"Les électrons occupent le volume, mais chacun est environ 1 800 fois plus léger qu’un proton.",2:"C’est l’idée du modèle de Thomson, contredite par l’expérience de Rutherford.",3:"Le vide n’a pas de masse."},
  corrige:"Protons et neutrons pèsent chacun environ 1 u ; l’électron environ 1 800 fois moins. Le noyau, minuscule (10⁻¹⁵ m), concentre donc plus de 99,9 % de la masse. Contrôle avec le sodium : électrons ≈ 1,0·10⁻²⁹ kg contre ≈ 3,8·10⁻²⁶ kg pour le noyau ✓."}
]);
SFA.exos("c03", [
 {t:"Deux noyaux isotopes (QCM)", s:2, enonce:"Quelle paire est formée de deux isotopes ?", choix:["<sup>14</sup>C et <sup>14</sup>N","<sup>12</sup>C et <sup>13</sup>C","<sup>23</sup>Na et <sup>24</sup>Mg","<sup>16</sup>O et <sup>16</sup>O<sup>2−</sup>"], bonne:1,
  pourquoi:{0:"Même nombre de masse, mais Z différent (6 et 7) : ce sont deux éléments différents.",2:"Ils ont le même nombre de neutrons (12), mais Z = 11 et Z = 12 : deux éléments différents.",3:"C’est le même noyau ; seul le nombre d’électrons change : c’est un atome et son ion, pas des isotopes."},
  corrige:"Des isotopes ont le même Z mais un nombre de neutrons différent. <sup>12</sup>C et <sup>13</sup>C : Z = 6 tous deux, N = 6 et N = 7 ✓."},
 {t:"Masse atomique du gallium (QCM)", s:3, enonce:"Le gallium naturel contient 60 % de gallium 69 et 40 % de gallium 71 (masses prises égales à 69 u et 71 u). Quelle est sa masse atomique moyenne ?", choix:["69,8 u","70,0 u","70,2 u","6 980 u"], bonne:0,
  pourquoi:{1:"C’est la moyenne simple (69 + 71) ÷ 2 : elle ne tient pas compte des abondances.",2:"Les abondances ont été inversées : 0,40 × 69 + 0,60 × 71.",3:"Les pourcentages n’ont pas été convertis en fractions : 60 × 69 + 40 × 71 sans diviser par 100."},
  corrige:"m = 0,60 × 69 + 0,40 × 71 = 41,4 + 28,4 = <b>69,8 u</b>. Contrôle : la moyenne est plus proche de 69 que de 71, car le gallium 69 est le plus abondant ✓."},
 {t:"Trois demi-vies (QCM)", s:4, enonce:"L’iode 131, utilisé en médecine, a une demi-vie d’environ 8 jours. Quelle fraction des noyaux d’iode 131 reste-t-il au bout de 24 jours ?", choix:["1/3","1/6","Plus aucun noyau","1/8"], bonne:3,
  pourquoi:{0:"On a divisé par le nombre de demi-vies (3) : à chaque demi-vie, on divise par 2.",1:"On a calculé 2 × 3 = 6 au lieu de 2³ = 8.",2:"Une demi-vie n’est pas « la moitié de la durée de vie » : il reste toujours une fraction des noyaux."},
  corrige:"24 jours = 3 demi-vies. Fraction restante = (1/2)³ = <b>1/8</b>, soit 12,5 %. Contrôle : 1 → 1/2 (8 j) → 1/4 (16 j) → 1/8 (24 j) ✓."}
]);
SFA.exos("c04", [
 {t:"Le métal attiré par l’aimant (QCM)", s:1, enonce:"Parmi ces métaux, lequel est attiré par un aimant ?", choix:["Le cuivre","L’aluminium","Le nickel","Le zinc"], bonne:2,
  pourquoi:{0:"Le cuivre est un métal, mais tous les métaux ne sont pas attirés par un aimant.",1:"L’aluminium est un métal non magnétique : une canette en aluminium n’est pas attirée.",3:"Le zinc est un métal, mais il n’est pas attiré par un aimant."},
  corrige:"Seuls le fer, le cobalt et le <b>nickel</b> (et certains alliages) sont attirés par un aimant. Être attiré par un aimant n’est donc pas une propriété commune à tous les métaux ✓."},
 {t:"Le plus réactif avec l’eau (QCM)", s:2, enonce:"On dépose un petit morceau de chacun de ces métaux dans de l’eau. Lequel réagit le plus violemment ?", choix:["Le lithium (Li, groupe 1, période 2)","Le sodium (Na, groupe 1, période 3)","Le potassium (K, groupe 1, période 4)","Le magnésium (Mg, groupe 2, période 3)"], bonne:2,
  pourquoi:{0:"Le lithium est un alcalin, mais c’est le moins réactif des trois : il est en haut du groupe.",1:"Le sodium réagit vivement, mais le potassium, placé plus bas dans le groupe, réagit plus fort encore.",3:"Le magnésium est un alcalino-terreux (2 électrons de valence) : il est bien moins réactif que les alcalins."},
  corrige:"Chez les alcalins, la réactivité augmente en descendant le groupe : Li &lt; Na &lt; <b>K</b>. Le potassium réagit violemment (il s’enflamme) et forme du dihydrogène et une solution basique ✓."},
 {t:"La case du calcium (QCM)", s:3, enonce:"Le calcium a Z = 20. Où se trouve-t-il dans le tableau périodique ?", choix:["Période 2, groupe 4","Période 4, groupe 2","Période 3, groupe 2","Période 4, groupe 12"], bonne:1,
  pourquoi:{0:"Période et groupe sont inversés.",2:"Une couche a été oubliée : 2, 8, 8, 2 fait 4 couches occupées.",3:"Le « + 10 » ne vaut que pour les groupes 13 à 18 ; pour 1 et 2 électrons de valence, le groupe est 1 ou 2."},
  corrige:"Répartition : 2, 8, 8, 2. Quatre couches → <b>période 4</b> ; 2 électrons de valence → <b>groupe 2</b> (alcalino-terreux). Contrôle : 2 + 8 + 8 + 2 = 20 électrons ✓."}
]);
SFA.exos("c05", [
 {t:"L’ion du calcium (QCM)", s:2, enonce:"Le calcium (groupe 2) forme un ion pour avoir la même couche externe qu’un gaz noble. Lequel ?", choix:["Ca<sup>2−</sup>","Ca<sup>+</sup>","Ca<sup>6−</sup>","Ca<sup>2+</sup>"], bonne:3,
  pourquoi:{0:"Le signe est faux : un métal perd ses électrons de valence, il devient un cation (+).",1:"Le calcium a 2 électrons de valence, pas 1 : il en perd 2.",2:"Gagner 6 électrons demanderait beaucoup trop d’énergie ; il est bien plus facile d’en perdre 2."},
  corrige:"Ca (2, 8, 8, 2) perd ses 2 électrons de valence : il reste 2, 8, 8 comme l’argon. Charge = 20 protons − 18 électrons = +2 : <b>Ca<sup>2+</sup></b> ✓."},
 {t:"Formule de l’oxyde de lithium (QCM)", s:3, enonce:"Le lithium forme l’ion Li<sup>+</sup> et l’oxygène l’ion O<sup>2−</sup>. Quelle est la formule de l’oxyde de lithium ?", choix:["Li<sub>2</sub>O","LiO","LiO<sub>2</sub>","Li<sub>2</sub>O<sub>2</sub>"], bonne:0,
  pourquoi:{1:"Les charges ne s’équilibrent pas : +1 − 2 = −1.",2:"Le croisement est inversé : charge totale +1 − 4 = −3.",3:"Charge totale +2 − 4 = −2 : le composé ne serait pas neutre."},
  corrige:"Il faut autant de charges + que de charges − : 2 Li<sup>+</sup> (+2) pour 1 O<sup>2−</sup> (−2). Formule : <b>Li<sub>2</sub>O</b>. Contrôle : 2 × (+1) + (−2) = 0 ✓."},
 {t:"Doublets non liants de NH₃ (QCM)", s:3, enonce:"Dans la molécule d’ammoniac NH<sub>3</sub>, l’azote (5 électrons de valence) forme 3 liaisons. Combien de doublets non liants porte-t-il ?", choix:["0","2","1","3"], bonne:2,
  pourquoi:{0:"Les 3 liaisons n’utilisent que 3 des 5 électrons de valence : il en reste 2.",1:"C’est le cas de l’oxygène de l’eau (6 électrons de valence, 2 liaisons), pas de l’azote.",3:"3 est le nombre de liaisons (8 − 5), pas le nombre de doublets non liants."},
  corrige:"5 électrons de valence = 3 électrons engagés dans les 3 liaisons + 2 électrons restants, soit <b>1 doublet non liant</b>. Contrôle : autour de N, 3 liaisons × 2 + 1 doublet × 2 = 8 électrons (octet) ✓."}
]);
SFA.exos("c06", [
 {t:"5 g dans 250 mL (QCM)", s:2, enonce:"On dissout 5 g de sucre dans de l’eau pour obtenir 250 mL de solution. Quelle est sa concentration massique ?", choix:["0,02 g/L","1,25 g/L","20 g/L","1 250 g/L"], bonne:2,
  pourquoi:{0:"Le volume n’a pas été converti en litres : 5 ÷ 250 donne des g/mL, pas des g/L.",1:"On a multiplié la masse par le volume (5 × 0,250) au lieu de diviser.",3:"On a multiplié la masse par le volume en mL (5 × 250)."},
  corrige:"V = 250 mL = 0,250 L. ρ = m ÷ V = 5 ÷ 0,250 = <b>20 g/L</b>. Contrôle : 20 g/L × 0,250 L = 5 g ✓."},
 {t:"Volume à prélever (QCM)", s:3, enonce:"On dispose d’une solution mère à 80 g/L. On veut préparer 500 mL de solution à 4 g/L. Quel volume de solution mère faut-il prélever ?", choix:["25 mL","475 mL","20 mL","10 000 mL"], bonne:0,
  pourquoi:{1:"475 mL est le volume d’eau à ajouter, pas le volume de solution mère à prélever.",2:"20 est le facteur de dilution (80 ÷ 4), pas un volume.",3:"La formule est inversée : ρ₁ × V₂ ÷ ρ₂ au lieu de ρ₂ × V₂ ÷ ρ₁."},
  corrige:"La masse de soluté se conserve : ρ₁ × V₁ = ρ₂ × V₂, donc V₁ = 4 × 500 ÷ 80 = <b>25 mL</b>. Contrôle : facteur de dilution F = 500 ÷ 25 = 20 = 80 ÷ 4 ✓."},
 {t:"Cristaux au refroidissement (QCM)", s:4, enonce:"La solubilité d’un sel vaut 64 g pour 100 g d’eau à 40 °C et 21 g pour 100 g d’eau à 10 °C. On refroidit de 40 °C à 10 °C une solution saturée préparée avec 200 g d’eau. Quelle masse de cristaux se dépose ?", choix:["43 g","86 g","128 g","42 g"], bonne:1,
  pourquoi:{0:"C’est le calcul pour 100 g d’eau : il y a ici 200 g d’eau, il faut multiplier par 2.",2:"128 g est la masse dissoute à 40 °C : une partie reste dissoute à 10 °C.",3:"42 g est la masse qui reste dissoute à 10 °C, pas celle qui se dépose."},
  corrige:"À 40 °C : 2 × 64 = 128 g dissous. À 10 °C, il ne peut en rester que 2 × 21 = 42 g. Il se dépose 128 − 42 = <b>86 g</b> de cristaux. Contrôle : 86 + 42 = 128 g, la masse de sel se conserve ✓."}
]);
SFA.exos("c07", [
 {t:"Reconnaître une transformation chimique (QCM)", s:1, enonce:"Lequel de ces phénomènes est une transformation chimique ?", choix:["De l’eau bout dans une casserole","Du sel se dissout dans l’eau","Un morceau de bois brûle","Un glaçon fond"], bonne:2,
  pourquoi:{0:"L’eau liquide devient de la vapeur d’eau : c’est toujours de l’eau, la transformation est physique.",1:"Le sel est seulement dispersé dans l’eau : on le récupère par évaporation, c’est physique.",3:"La glace devient de l’eau liquide : même substance, c’est un changement d’état."},
  corrige:"Quand le bois brûle, de nouvelles substances apparaissent (dioxyde de carbone, eau, cendres) avec de la chaleur et de la lumière : c’est une <b>transformation chimique</b>. On ne peut pas revenir au bois ✓."},
 {t:"Équilibrer la combustion du fer (QCM)", s:3, enonce:"Le fer brûle dans le dioxygène en donnant l’oxyde magnétique Fe<sub>3</sub>O<sub>4</sub>. Quelle équation est correctement équilibrée ?", choix:["Fe + O<sub>2</sub> → FeO<sub>2</sub>","3 Fe + 4 O<sub>2</sub> → Fe<sub>3</sub>O<sub>4</sub>","3 Fe + O<sub>2</sub> → Fe<sub>3</sub>O<sub>4</sub>","3 Fe + 2 O<sub>2</sub> → Fe<sub>3</sub>O<sub>4</sub>"], bonne:3,
  pourquoi:{0:"La formule du produit a été changée pour que ça « tombe juste » : FeO₂ n’est pas Fe₃O₄. On ajuste les coefficients, jamais les indices.",1:"On a recopié l’indice 4 comme coefficient : 4 O₂ apportent 8 atomes d’oxygène, pas 4.",2:"Le fer est équilibré mais pas l’oxygène : 2 atomes à gauche, 4 à droite."},
  corrige:"<b>3 Fe + 2 O<sub>2</sub> → Fe<sub>3</sub>O<sub>4</sub></b>. Contrôle : Fe 3 = 3 ; O 2 × 2 = 4 = 4 ✓."},
 {t:"Fer et soufre : quelle masse ? (QCM)", s:4, enonce:"Le fer et le soufre réagissent dans le rapport 7 g de fer pour 4 g de soufre, et donnent 11 g de sulfure de fer. On chauffe 14 g de fer avec 10 g de soufre. Quelle masse de sulfure de fer obtient-on au maximum ?", choix:["24 g","22 g","27,5 g","11 g"], bonne:1,
  pourquoi:{0:"On a additionné toutes les masses : 2 g de soufre sont en excès et ne réagissent pas.",2:"On a pris le soufre comme réactif limitant : 10 g de soufre demanderaient 17,5 g de fer, il n’y en a que 14 g.",3:"C’est la masse donnée pour 7 g de fer : ici il y a deux fois plus de fer."},
  corrige:"14 g de fer = 2 × 7 g : ils réagissent avec 2 × 4 = 8 g de soufre. Le fer est le réactif limitant, il reste 2 g de soufre. Masse de produit : 2 × 11 = <b>22 g</b>. Contrôle (Lavoisier) : 14 + 8 = 22 g ✓."}
]);
SFA.exos("c08", [
 {t:"Classer KOH (QCM)", s:1, enonce:"À quelle famille appartient l’hydroxyde de potassium KOH ?", choix:["Oxyde","Acide","Base","Sel"], bonne:2,
  pourquoi:{0:"Un oxyde contient l’ion O²⁻ seul ; ici l’oxygène fait partie de l’ion hydroxyde OH⁻.",1:"Un acide libère H⁺ dans l’eau ; KOH libère OH⁻.",3:"Un sel associe un cation à un anion autre que O²⁻ et OH⁻."},
  corrige:"KOH est formé de K<sup>+</sup> et de l’ion hydroxyde OH<sup>−</sup> : c’est un hydroxyde, donc une <b>base</b> ✓."},
 {t:"Formule du nitrate de calcium (QCM)", s:2, enonce:"Le nitrate de calcium est formé d’ions Ca<sup>2+</sup> et NO<sub>3</sub><sup>−</sup>. Quelle est sa formule ?", choix:["Ca(NO<sub>3</sub>)<sub>2</sub>","CaNO<sub>3</sub>","CaNO<sub>32</sub>","Ca<sub>2</sub>NO<sub>3</sub>"], bonne:0,
  pourquoi:{1:"Les charges ne s’équilibrent pas : +2 − 1 = +1.",2:"Les parenthèses ont été oubliées : on lit 32 atomes d’oxygène au lieu de deux ions nitrate.",3:"Le croisement est inversé : 2 × (+2) − 1 = +3."},
  corrige:"Il faut 2 ions NO<sub>3</sub><sup>−</sup> pour un ion Ca<sup>2+</sup>. L’ion composé répété se met entre parenthèses : <b>Ca(NO<sub>3</sub>)<sub>2</sub></b>. Contrôle : +2 + 2 × (−1) = 0 ✓."},
 {t:"Le nom de FeCl₃ (QCM)", s:3, enonce:"Quel est le nom du composé FeCl<sub>3</sub> ?", choix:["Chlorure de fer(II)","Chlorate de fer(III)","Chlorure de fer, sans autre précision","Chlorure de fer(III)"], bonne:3,
  pourquoi:{0:"La charge du fer est mal retrouvée : 3 ions Cl⁻ font −3, le fer porte donc +3.",1:"Chlorate désigne ClO₃⁻, qui contient de l’oxygène. Ici l’anion est Cl⁻, le chlorure.",2:"Le fer forme deux ions (Fe²⁺ et Fe³⁺) : il faut préciser la charge en chiffres romains."},
  corrige:"3 Cl<sup>−</sup> portent −3, donc le fer est Fe<sup>3+</sup>. Nom : « anion de cation » avec la charge : <b>chlorure de fer(III)</b> ✓."}
]);
SFA.exos("c09", [
 {t:"Vers quelle électrode ? (QCM)", s:2, enonce:"On fait passer un courant dans une solution de chlorure de cuivre(II). Vers quelle électrode se dirigent les ions Cu<sup>2+</sup> ?", choix:["Vers l’électrode négative","Vers l’électrode positive","Ils restent immobiles","Vers les deux électrodes"], bonne:0,
  pourquoi:{1:"Des charges de même signe se repoussent : un cation est attiré par l’électrode négative.",2:"En solution, les ions sont libres : c’est justement leur déplacement qui forme le courant.",3:"Tous les ions Cu²⁺ ont la même charge (+) : ils vont tous du même côté."},
  corrige:"Les cations (+) migrent vers l’<b>électrode négative</b> ; les anions Cl<sup>−</sup> vont vers l’électrode positive. Contrôle : on voit un dépôt de cuivre sur l’électrode négative ✓."},
 {t:"Dissocier le sulfate de sodium (QCM)", s:3, enonce:"Quelle équation décrit correctement la dissociation du sulfate de sodium Na<sub>2</sub>SO<sub>4</sub> dans l’eau ?", choix:["Na<sub>2</sub>SO<sub>4</sub> → Na<sub>2</sub><sup>+</sup> + SO<sub>4</sub><sup>2−</sup>","Na<sub>2</sub>SO<sub>4</sub> → 2 Na<sup>+</sup> + SO<sub>4</sub><sup>2−</sup>","Na<sub>2</sub>SO<sub>4</sub> → Na<sup>+</sup> + SO<sub>4</sub><sup>−</sup>","Na<sub>2</sub>SO<sub>4</sub> → 2 Na<sup>+</sup> + S<sup>2−</sup> + 2 O<sub>2</sub>"], bonne:1,
  pourquoi:{0:"L’indice 2 est resté collé : les deux ions sodium se séparent, il faut écrire 2 Na⁺. Et les charges ne se conservent pas (+1 − 2).",2:"Atomes non conservés (1 Na au lieu de 2) et charge de l’ion sulfate fausse (SO₄²⁻).",3:"Un ion composé comme SO₄²⁻ reste entier dans l’eau : il ne se casse pas en soufre et dioxygène."},
  corrige:"<b>Na<sub>2</sub>SO<sub>4</sub> → 2 Na<sup>+</sup> + SO<sub>4</sub><sup>2−</sup></b> : 3 ions libérés. Contrôle : Na 2 = 2, S 1 = 1, O 4 = 4 ; charges 0 = 2 × (+1) + (−2) ✓."},
 {t:"Orientation de l’eau autour de Cl⁻ (QCM)", s:4, enonce:"Quand un cristal de sel se dissout, comment les molécules d’eau s’orientent-elles autour d’un ion Cl<sup>−</sup> ?", choix:["Elles tournent leur atome d’oxygène (légèrement négatif) vers l’ion","Elles se cassent en H⁺ et OH⁻ autour de l’ion","Elles tournent leurs atomes d’hydrogène (légèrement positifs) vers l’ion","Elles ne s’orientent pas, car l’eau est électriquement neutre"], bonne:2,
  pourquoi:{0:"C’est l’orientation autour des cations comme Na⁺ : l’oxygène, légèrement négatif, serait repoussé par Cl⁻.",1:"Les molécules d’eau restent entières : elles entourent les ions (hydratation) sans se dissocier.",3:"La molécule est neutre au total, mais polaire : O légèrement −, H légèrement +. C’est ce qui permet l’orientation."},
  corrige:"L’anion Cl<sup>−</sup> attire le côté <b>hydrogène</b> (légèrement +) des molécules d’eau, qui l’entourent : c’est l’hydratation. Autour de Na<sup>+</sup>, c’est l’inverse : l’oxygène est tourné vers l’ion ✓."}
]);
SFA.exos("c10", [
 {t:"Le gaz du zinc dans l’acide (QCM)", s:1, enonce:"On met du zinc dans de l’acide chlorhydrique : des bulles se forment et le gaz fait un petit « pop » à la flamme. Quel est ce gaz ?", choix:["Le dioxyde de carbone CO<sub>2</sub>","Le dichlore Cl<sub>2</sub>","Le dioxygène O<sub>2</sub>","Le dihydrogène H<sub>2</sub>"], bonne:3,
  pourquoi:{0:"Le CO₂ se dégage quand un acide attaque le calcaire (un carbonate), pas un métal.",1:"Le dichlore se forme quand on mélange eau de Javel et acide, pas avec un métal.",2:"Le dioxygène ravive une braise ; il ne fait pas de « pop »."},
  corrige:"Acide + métal → sel + dihydrogène : Zn + 2 HCl → ZnCl<sub>2</sub> + <b>H<sub>2</sub></b>. Le test du « pop » à la flamme identifie le dihydrogène ✓."},
 {t:"Combien de fois plus acide ? (QCM)", s:3, enonce:"Une solution A a un pH de 3, une solution B un pH de 5. Combien de fois plus d’ions H<sup>+</sup> la solution A contient-elle ?", choix:["2 fois plus","100 fois plus","Environ 1,7 fois plus","20 fois plus"], bonne:1,
  pourquoi:{0:"On a fait la différence des pH (5 − 3) : l’échelle est logarithmique, pas linéaire.",2:"On a fait le rapport des pH (5 ÷ 3) : ça n’a pas de sens sur une échelle logarithmique.",3:"On a fait 2 × 10 au lieu de 10 × 10."},
  corrige:"Une unité de pH en moins = 10 fois plus de H<sup>+</sup>. Deux unités : 10 × 10 = <b>100 fois plus</b>. Contrôle : [H⁺] passe de 10⁻⁵ à 10⁻³ mol/L, rapport 10² ✓."},
 {t:"Volume de soude à l’équivalence (QCM)", s:4, enonce:"On titre 25 mL d’acide chlorhydrique à 0,20 mol/L par de la soude à 0,10 mol/L. Quel volume de soude faut-il verser pour atteindre l’équivalence ?", choix:["12,5 mL","25 mL","50 mL","0,05 mL"], bonne:2,
  pourquoi:{0:"Le rapport des concentrations est inversé : la soude est deux fois moins concentrée, il en faut donc plus, pas moins.",1:"On a supposé qu’il faut le même volume des deux solutions : c’est vrai seulement à concentrations égales.",3:"Le résultat en litres (0,05 L) a été lu comme des millilitres."},
  corrige:"n(H<sup>+</sup>) = 0,20 × 0,025 = 0,0050 mol. À l’équivalence, n(OH<sup>−</sup>) = 0,0050 mol, donc V = 0,0050 ÷ 0,10 = 0,050 L = <b>50 mL</b>. Contrôle : 0,10 × 0,050 = 0,0050 mol ✓."}
]);
