/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n’est repris d’un examen.
   Ils s’ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c01", [
 {t:"Distinguer aldéhyde et cétone (QCM)", s:2, enonce:"Deux flacons contiennent l’un du propanal, l’autre de la propanone. Quel test permet de les distinguer ?", choix:["La liqueur de Fehling","La DNPH","Le bleu de bromothymol","L’eau de brome"], bonne:0,
  pourquoi:{1:"La DNPH donne un précipité jaune-orange avec les aldéhydes ET les cétones : elle ne les distingue pas.",2:"Le BBT repère un acide ; ni le propanal ni la propanone ne sont des acides.",3:"L’eau de brome teste une double liaison C=C, pas le groupe C=O."},
  corrige:"Seul l’aldéhyde (H porté par le C=O) est oxydé par la <b>liqueur de Fehling</b> : précipité rouge brique avec le propanal, rien avec la propanone ✓."},
 {t:"Oxyder le propan-2-ol (QCM)", s:3, enonce:"On oxyde le propan-2-ol CH<sub>3</sub>–CH(OH)–CH<sub>3</sub> par du dichromate acidifié. Quel produit obtient-on ?", choix:["Le propanal","L’acide propanoïque","Aucun : il ne s’oxyde pas","La propanone"], bonne:3,
  pourquoi:{0:"Un aldéhyde vient d’un alcool primaire (OH en bout de chaîne) ; ici le C–OH est lié à deux carbones.",1:"Un acide carboxylique vient de l’oxydation poussée d’un alcool primaire.",2:"C’est le cas d’un alcool tertiaire ; le propan-2-ol est secondaire et son C–OH porte un H."},
  corrige:"Le C–OH est lié à 2 carbones : alcool secondaire. Il s’oxyde en cétone, et pas plus loin : la <b>propanone</b> CH<sub>3</sub>–CO–CH<sub>3</sub>. Le dichromate vire de l’orange au vert ✓."}
]);
SFA.exos("c02", [
 {t:"Le nom de l’ester (QCM)", s:2, enonce:"Quel ester obtient-on en faisant réagir l’acide méthanoïque HCOOH avec le propan-1-ol ?", choix:["Le propanoate de méthyle","L’éthanoate de propyle","Le méthanoate de propyle"], bonne:2,
  pourquoi:{0:"Les rôles sont inversés : c’est l’acide qui donne « …oate », l’alcool qui donne « de …yle ».",1:"Le nombre de carbones de l’acide est mal compté : HCOOH n’a qu’un carbone (méthan-)."},
  corrige:"L’acide méthanoïque donne « méthanoate », le propan-1-ol donne « de propyle » : <b>méthanoate de propyle</b>, HCOO–CH<sub>2</sub>–CH<sub>2</sub>–CH<sub>3</sub>. Contrôle : HCOOH + C₃H₇OH → HCOOC₃H₇ + H₂O, atomes équilibrés ✓."},
 {t:"Rendement avec un alcool en excès (QCM)", s:3, enonce:"On mélange 0,40 mol d’acide éthanoïque et 0,60 mol d’éthanol. À l’équilibre, on obtient 0,30 mol d’ester. Quel est le rendement ?", choix:["75 %","50 %","30 %","133 %"], bonne:0,
  pourquoi:{1:"On a divisé par la quantité d’alcool, qui est en excès : le maximum est fixé par le réactif limitant.",2:"On a divisé par la quantité totale de réactifs (1,00 mol).",3:"Le quotient est inversé : un rendement ne dépasse jamais 100 %."},
  corrige:"L’acide est limitant : au maximum 0,40 mol d’ester. Rendement = 0,30 / 0,40 = <b>75 %</b>. Contrôle : c’est plus que les 67 % d’un mélange équimolaire, grâce à l’excès d’alcool ✓."}
]);
SFA.exos("c03", [
 {t:"Le monomère du PVC (QCM)", s:1, enonce:"Le PVC est obtenu par polyaddition. Quel est son monomère ?", choix:["L’éthène","Le propène","Le chloroéthène","Le styrène"], bonne:2,
  pourquoi:{0:"L’éthène donne le polyéthylène (PE).",1:"Le propène donne le polypropylène (PP).",3:"Le styrène donne le polystyrène (PS)."},
  corrige:"Le PVC (polychlorure de vinyle) vient du <b>chloroéthène</b> CH<sub>2</sub>=CHCl : la double liaison s’ouvre et relie les motifs –CH<sub>2</sub>–CHCl– ✓."},
 {t:"Degré de polymérisation du PP (QCM)", s:3, enonce:"Un polypropylène a une masse molaire moyenne de 126 000 g/mol. Quel est son degré de polymérisation ? (M(C<sub>3</sub>H<sub>6</sub>) = 42 g/mol)", choix:["4 500","3 000","9 000","5,3·10<sup>6</sup>"], bonne:1,
  pourquoi:{0:"On a utilisé la masse molaire de l’éthène (28 g/mol) : le monomère du PP est le propène.",2:"On a divisé par la masse d’un groupe CH₂ (14 g/mol) au lieu de celle du monomère.",3:"On a multiplié au lieu de diviser."},
  corrige:"En polyaddition, rien n’est perdu : M(polymère) = n × M(monomère). n = 126 000 / 42 = <b>3 000</b>. Contrôle : 3 000 × 42 = 126 000 g/mol ✓."}
]);
SFA.exos("c04", [
 {t:"L’ion éthanoate à pH 7 (QCM)", s:2, enonce:"Pour le couple CH<sub>3</sub>COOH/CH<sub>3</sub>COO<sup>−</sup>, pK<sub>a</sub> = 4,76. Quelle forme prédomine dans une solution de pH 7,0 ?", choix:["CH<sub>3</sub>COOH","CH<sub>3</sub>COO<sup>−</sup>","Les deux formes à parts égales"], bonne:1,
  pourquoi:{0:"La forme acide prédomine seulement si pH &lt; pK<sub>a</sub> ; ici 7,0 &gt; 4,76.",2:"Les deux formes sont égales seulement si pH = pK<sub>a</sub> = 4,76."},
  corrige:"pH = 7,0 &gt; pK<sub>a</sub> = 4,76 : la forme basique <b>CH<sub>3</sub>COO<sup>−</sup></b> prédomine. Contrôle : [A⁻]/[HA] = 10<sup>7,0 − 4,76</sup> ≈ 170 ✓."},
 {t:"pH d’une solution d’hydroxyde de baryum (QCM)", s:3, enonce:"Quel est le pH, à 25 °C, d’une solution d’hydroxyde de baryum Ba(OH)<sub>2</sub> (base forte) à 0,0050 mol/L ?", choix:["11,7","2,0","12,0","2,3"], bonne:2,
  pourquoi:{0:"Le 2 de Ba(OH)₂ a été oublié : chaque unité libère 2 OH⁻, donc [OH⁻] = 0,010 mol/L.",1:"C’est le pOH ; le pH vaut 14 − pOH.",3:"C’est le pOH calculé sans le facteur 2 : double erreur."},
  corrige:"Ba(OH)<sub>2</sub> → Ba<sup>2+</sup> + 2 OH<sup>−</sup> : [OH<sup>−</sup>] = 2 × 0,0050 = 0,010 mol/L ; pOH = 2,0 ; pH = 14 − 2,0 = <b>12,0</b>. Contrôle : [H₃O⁺] = 10⁻¹⁴ / 10⁻² = 10⁻¹² mol/L ✓."}
]);
SFA.exos("c05", [
 {t:"À la demi-équivalence (QCM)", s:2, enonce:"On titre de l’acide méthanoïque (pK<sub>a</sub> = 3,75) par de la soude. Que vaut le pH à la demi-équivalence ?", choix:["7,0","3,75","1,9","10,25"], bonne:1,
  pourquoi:{0:"7,0 est le pH à l’équivalence d’un titrage acide fort / base forte, pas la demi-équivalence.",2:"On a divisé le pK<sub>a</sub> par 2 : la formule ½(pK<sub>a</sub> − log c) ne vaut qu’au départ, pour l’acide seul.",3:"On a calculé 14 − pK<sub>a</sub> : ce n’est pas la relation du tampon."},
  corrige:"À la demi-équivalence, la moitié de l’acide est devenue base : [HA] = [A<sup>−</sup>], donc pH = pK<sub>a</sub> + log 1 = <b>3,75</b> ✓."},
 {t:"pH d’un tampon ammoniacal (QCM)", s:3, enonce:"Un tampon contient [NH<sub>3</sub>] = 0,20 mol/L et [NH<sub>4</sub><sup>+</sup>] = 0,10 mol/L (pK<sub>a</sub> = 9,25). Quel est son pH ?", choix:["8,95","9,25","9,55","11,25"], bonne:2,
  pourquoi:{0:"Le rapport est inversé : c’est log([base]/[acide]), avec NH₃ comme base.",1:"Le rapport a été ignoré : pH = pK<sub>a</sub> seulement si les deux formes sont égales.",3:"On a ajouté le rapport lui-même (2) au lieu de son logarithme."},
  corrige:"pH = pK<sub>a</sub> + log([NH<sub>3</sub>]/[NH<sub>4</sub><sup>+</sup>]) = 9,25 + log 2 = 9,25 + 0,30 = <b>9,55</b>. Contrôle : la base est majoritaire, le pH est bien au-dessus du pK<sub>a</sub> ✓."}
]);
SFA.exos("c06", [
 {t:"Le Ks du fluorure de calcium (QCM)", s:2, enonce:"Quelle est l’expression du produit de solubilité du fluorure de calcium CaF<sub>2</sub> ?", choix:["K<sub>s</sub> = [Ca<sup>2+</sup>]·[F<sup>−</sup>]","K<sub>s</sub> = [Ca<sup>2+</sup>]·2[F<sup>−</sup>]","K<sub>s</sub> = [Ca<sup>2+</sup>]·[F<sup>−</sup>]² ÷ [CaF<sub>2</sub>]","K<sub>s</sub> = [Ca<sup>2+</sup>]·[F<sup>−</sup>]²"], bonne:3,
  pourquoi:{0:"Le coefficient 2 des ions fluorure a été oublié : il devient un exposant.",1:"Le coefficient a été mis en facteur au lieu d’exposant.",2:"Le solide n’apparaît pas dans K<sub>s</sub>."},
  corrige:"CaF<sub>2</sub>(s) ⇌ Ca<sup>2+</sup> + 2 F<sup>−</sup>, donc <b>K<sub>s</sub> = [Ca<sup>2+</sup>]·[F<sup>−</sup>]²</b>, sans le solide ✓."},
 {t:"BaSO₄ dans une solution de sulfate (QCM)", s:4, enonce:"K<sub>s</sub>(BaSO<sub>4</sub>) = 1,1·10<sup>−10</sup>. Quelle est la solubilité de BaSO<sub>4</sub> dans une solution de sulfate de sodium à 0,010 mol/L ?", choix:["1,1·10<sup>−8</sup> mol/L","1,05·10<sup>−5</sup> mol/L","1,1·10<sup>−12</sup> mol/L","1,05·10<sup>−4</sup> mol/L"], bonne:0,
  pourquoi:{1:"C’est la solubilité dans l’eau pure (√K<sub>s</sub>) : l’ion commun SO₄²⁻ a été oublié.",2:"On a multiplié K<sub>s</sub> par [SO₄²⁻] au lieu de diviser.",3:"On a pris la racine carrée de K<sub>s</sub>/[SO₄²⁻] : avec l’ion commun, s = K<sub>s</sub>/[SO₄²⁻] directement."},
  corrige:"[SO<sub>4</sub><sup>2−</sup>] ≈ 0,010 mol/L (apporté par Na₂SO₄) et [Ba<sup>2+</sup>] = s. K<sub>s</sub> = s × 0,010, donc s = 1,1·10<sup>−10</sup> / 0,010 = <b>1,1·10<sup>−8</sup> mol/L</b>, environ 1 000 fois moins que dans l’eau pure ✓."}
]);
SFA.exos("c07", [
 {t:"Le métal qui ne réagit pas avec Cu²⁺ (QCM)", s:2, enonce:"E°(Zn<sup>2+</sup>/Zn) = −0,76 V ; E°(Fe<sup>2+</sup>/Fe) = −0,44 V ; E°(Cu<sup>2+</sup>/Cu) = +0,34 V ; E°(Ag<sup>+</sup>/Ag) = +0,80 V. Quel métal, plongé dans une solution de Cu<sup>2+</sup>, ne réagit PAS ?", choix:["Le zinc","Le fer","L’argent","Aucun : les trois réagissent"], bonne:2,
  pourquoi:{0:"Zn (E° = −0,76 V) est un réducteur plus fort que Cu : il réduit Cu²⁺ et se recouvre de cuivre.",1:"Fe (E° = −0,44 V &lt; 0,34 V) réduit aussi Cu²⁺.",3:"L’argent a un E° plus élevé que le cuivre : il ne peut pas réduire Cu²⁺."},
  corrige:"Une réaction spontanée oppose l’oxydant de plus grand E° au réducteur de plus petit E°. Ag (0,80 V) est au-dessus de Cu<sup>2+</sup>/Cu (0,34 V) : <b>l’argent</b> ne réduit pas Cu<sup>2+</sup>. C’est au contraire Cu qui réduirait Ag<sup>+</sup> ✓."},
 {t:"Demi-équation du couple NO₃⁻/NO (QCM)", s:4, enonce:"Quelle demi-équation, en milieu acide, est correcte pour le couple NO<sub>3</sub><sup>−</sup>/NO ?", choix:["NO<sub>3</sub><sup>−</sup> + 4 H<sup>+</sup> + e<sup>−</sup> → NO + 2 H<sub>2</sub>O","NO<sub>3</sub><sup>−</sup> + 4 H<sup>+</sup> → NO + 2 H<sub>2</sub>O + 3 e<sup>−</sup>","NO<sub>3</sub><sup>−</sup> + 2 H<sup>+</sup> + 3 e<sup>−</sup> → NO + H<sub>2</sub>O","NO<sub>3</sub><sup>−</sup> + 4 H<sup>+</sup> + 3 e<sup>−</sup> → NO + 2 H<sub>2</sub>O"], bonne:3,
  pourquoi:{0:"Atomes équilibrés, mais pas les charges : +2 à gauche, 0 à droite. Il faut 3 électrons.",1:"Les électrons sont du mauvais côté : l’oxydant NO₃⁻ capte des électrons. Charges : +3 à gauche, −3 à droite.",2:"L’oxygène n’est pas équilibré : 3 O à gauche, 2 à droite. Il faut 2 H₂O, donc 4 H⁺."},
  corrige:"O : 3 − 1 = 2 O en trop → 2 H<sub>2</sub>O ; H : 4 H<sup>+</sup> ; charges : −1 + 4 = +3 à gauche, 0 à droite → 3 e<sup>−</sup>. <b>NO<sub>3</sub><sup>−</sup> + 4 H<sup>+</sup> + 3 e<sup>−</sup> → NO + 2 H<sub>2</sub>O</b>. Contrôle par les n.o. : N passe de +5 à +2, soit 3 électrons ✓."}
]);
SFA.exos("c08", [
 {t:"f.é.m. d’une pile zinc-argent (QCM)", s:2, enonce:"On construit la pile Zn | Zn<sup>2+</sup> ‖ Ag<sup>+</sup> | Ag avec E°(Zn<sup>2+</sup>/Zn) = −0,76 V et E°(Ag<sup>+</sup>/Ag) = +0,80 V (concentrations 1 mol/L). Quelle est sa f.é.m. ?", choix:["1,56 V","0,04 V","−1,56 V","2,36 V"], bonne:0,
  pourquoi:{1:"On a additionné les deux E° (0,80 + (−0,76)) au lieu de les soustraire.",2:"On a calculé E°(anode) − E°(cathode) : la f.é.m. est positive.",3:"On a multiplié E°(Ag⁺/Ag) par 2 à cause de l’équation : un potentiel ne se multiplie pas par les coefficients."},
  corrige:"f.é.m. = E°(cathode) − E°(anode) = 0,80 − (−0,76) = <b>1,56 V</b>. L’argent est le pôle +, le zinc le pôle − ✓."},
 {t:"Quatre piles en parallèle (QCM)", s:3, enonce:"On associe en parallèle quatre piles identiques de f.é.m. 1,10 V. Quelle est la f.é.m. de l’ensemble ?", choix:["4,40 V","0,275 V","1,10 V","0 V"], bonne:2,
  pourquoi:{0:"C’est le résultat d’une association en série : les f.é.m. s’ajoutent seulement en série.",1:"On a divisé par le nombre de piles : en parallèle, la tension n’est pas partagée.",3:"Les piles sont branchées dans le même sens : elles ne s’annulent pas."},
  corrige:"En parallèle, la tension reste celle d’une branche : <b>1,10 V</b>. Ce qui change, c’est la résistance interne (divisée par 4) et la capacité (4 fois plus de charge disponible) ✓."}
]);
SFA.exos("c09", [
 {t:"Choisir une anode sacrificielle (QCM)", s:2, enonce:"On veut protéger la coque en acier (fer) d’un bateau avec une anode sacrificielle. Quel métal choisir ?", choix:["Le cuivre","Le zinc","L’argent"], bonne:1,
  pourquoi:{0:"Le cuivre est plus noble que le fer (E° plus élevé) : relié au fer, il accélérerait sa corrosion.",2:"L’argent est encore plus noble : c’est le fer qui s’oxyderait à sa place."},
  corrige:"Il faut un métal plus réducteur que le fer, de E° plus bas : le <b>zinc</b> (−0,76 V &lt; −0,44 V). C’est lui qui s’oxyde, le fer est protégé ✓."},
 {t:"Masse de cuivre déposée (QCM)", s:4, enonce:"On fait passer un courant de 1,5 A pendant 20 min dans une solution de sulfate de cuivre(II) : Cu<sup>2+</sup> + 2 e<sup>−</sup> → Cu. Quelle masse de cuivre se dépose à la cathode ? (F = 96 500 C/mol ; M(Cu) = 63,5 g/mol)", choix:["≈ 1,18 g","≈ 9,9 mg","≈ 0,59 g","≈ 0,0093 g"], bonne:2,
  pourquoi:{0:"Le facteur 2 a été oublié : il faut 2 électrons pour déposer 1 atome de cuivre.",1:"Le temps a été laissé en minutes : Q = I·t exige des secondes.",3:"0,0093 est la quantité de cuivre en mol : il faut encore multiplier par M."},
  corrige:"Q = 1,5 × 1 200 = 1 800 C ; n(e<sup>−</sup>) = 1 800 / 96 500 = 0,0187 mol ; n(Cu) = 0,0187 / 2 = 0,0093 mol ; m = 0,0093 × 63,5 ≈ <b>0,59 g</b>. Contrôle : 0,59 / 63,5 × 2 × 96 500 ≈ 1 800 C ✓."}
]);
SFA.exos("c10", [
 {t:"Le facteur E d’un procédé (QCM)", s:2, enonce:"Un procédé produit 2,0 kg de produit et 8,0 kg de déchets. Quel est son facteur E ?", choix:["0,25","4,0","5,0","80 %"], bonne:1,
  pourquoi:{0:"Le quotient est inversé : E = masse de déchets / masse de produit.",2:"On a divisé la masse totale (10 kg) par la masse de produit : seuls les déchets comptent.",3:"80 % est la part des déchets dans la masse totale, pas le facteur E."},
  corrige:"E = m(déchets) / m(produit) = 8,0 / 2,0 = <b>4,0</b> : 4 kg de déchets par kg de produit. Plus E est petit, plus le procédé est « vert » ✓."},
 {t:"Économie d’atomes de la chaux (QCM)", s:3, enonce:"On fabrique de la chaux vive par CaCO<sub>3</sub> → CaO + CO<sub>2</sub> (M(CaCO<sub>3</sub>) = 100 g/mol ; M(CaO) = 56 g/mol). Quelle est l’économie d’atomes ?", choix:["100 %, car il n’y a qu’un réactif","44 %","179 %","56 %"], bonne:3,
  pourquoi:{0:"Le CO₂ formé est un sous-produit perdu : même avec un seul réactif, tous les atomes ne finissent pas dans CaO.",1:"On a pris le CO₂ comme produit voulu (44 / 100).",2:"Le quotient est inversé (100 / 56) : l’économie d’atomes ne dépasse jamais 100 %."},
  corrige:"Économie d’atomes = M(produit voulu) / ΣM(réactifs) × 100 = 56 / 100 × 100 = <b>56 %</b>. Contrôle : 56 + 44 = 100 g/mol, la masse se conserve ✓."}
]);
