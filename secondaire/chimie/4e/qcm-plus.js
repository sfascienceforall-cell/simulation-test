/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n’est repris d’un examen.
   Ils s’ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c01", [
 {t:"Formule du sulfate d’ammonium (QCM)", s:2, enonce:"Le sulfate d’ammonium, un engrais, est formé d’ions NH<sub>4</sub><sup>+</sup> et SO<sub>4</sub><sup>2−</sup>. Quelle est sa formule ?", choix:["NH<sub>4</sub>SO<sub>4</sub>","NH<sub>42</sub>SO<sub>4</sub>","(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>","NH<sub>4</sub>(SO<sub>4</sub>)<sub>2</sub>"], bonne:2,
  pourquoi:{0:"Les charges ne s’équilibrent pas : +1 − 2 = −1.",1:"Les parenthèses ont été oubliées : on lit 42 atomes d’hydrogène au lieu de deux ions ammonium.",3:"Le croisement est inversé : +1 + 2 × (−2) = −3."},
  corrige:"Il faut 2 NH<sub>4</sub><sup>+</sup> (+2) pour 1 SO<sub>4</sub><sup>2−</sup> (−2). L’ion polyatomique répété se met entre parenthèses : <b>(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub></b>. Contrôle : 2 × (+1) + (−2) = 0 ✓."},
 {t:"Acide sulfurique et potasse (QCM)", s:3, enonce:"Quelle équation décrit correctement la neutralisation complète de l’acide sulfurique H<sub>2</sub>SO<sub>4</sub> par l’hydroxyde de potassium KOH ?", choix:["H<sub>2</sub>SO<sub>4</sub> + KOH → KSO<sub>4</sub> + H<sub>2</sub>O","H<sub>2</sub>SO<sub>4</sub> + 2 KOH → K<sub>2</sub>SO<sub>4</sub> + 2 H<sub>2</sub>O","H<sub>2</sub>SO<sub>4</sub> + 2 KOH → K<sub>2</sub>SO<sub>4</sub> + H<sub>2</sub>O"], bonne:1,
  pourquoi:{0:"KSO₄ n’est pas neutre (+1 − 2) : le sel est K₂SO₄. Et l’hydrogène n’est pas équilibré (3 à gauche, 2 à droite).",2:"Le sel est juste, mais l’eau n’est pas équilibrée : 4 H et 6 O à gauche, 2 H et 5 O à droite."},
  corrige:"Les 2 H<sup>+</sup> de l’acide captent 2 OH<sup>−</sup> : il faut 2 KOH et il se forme 2 H<sub>2</sub>O. <b>H<sub>2</sub>SO<sub>4</sub> + 2 KOH → K<sub>2</sub>SO<sub>4</sub> + 2 H<sub>2</sub>O</b>. Contrôle : K 2 = 2 ; S 1 = 1 ; O 6 = 6 ; H 4 = 4 ✓."}
]);
SFA.exos("c02", [
 {t:"Molécules dans 0,25 mol (QCM)", s:1, enonce:"Combien de molécules contient un échantillon de 0,25 mol de dioxyde de carbone ? (N<sub>A</sub> = 6,02·10<sup>23</sup> mol<sup>−1</sup>)", choix:["≈ 2,4·10<sup>24</sup>","≈ 1,5·10<sup>23</sup>","≈ 4,2·10<sup>−25</sup>","≈ 1,5·10<sup>22</sup>"], bonne:1,
  pourquoi:{0:"On a divisé N<sub>A</sub> par n au lieu de multiplier : N = n × N<sub>A</sub>.",2:"On a divisé n par N<sub>A</sub> : un nombre de molécules ne peut pas être plus petit que 1.",3:"Erreur de notation scientifique : 0,25 × 6,02 = 1,505, et l’exposant reste 23."},
  corrige:"N = n × N<sub>A</sub> = 0,25 × 6,02·10<sup>23</sup> ≈ <b>1,5·10<sup>23</sup></b> molécules. Contrôle : c’est un quart de mole, donc environ un quart de 6·10<sup>23</sup> ✓."},
 {t:"Atomes dans 0,20 mol de méthane (QCM)", s:3, enonce:"Quelle quantité de matière d’atomes (tous éléments confondus) contient un échantillon de 0,20 mol de méthane CH<sub>4</sub> ?", choix:["0,20 mol","0,80 mol","0,040 mol","1,0 mol"], bonne:3,
  pourquoi:{0:"0,20 mol est la quantité de molécules : chaque molécule contient plusieurs atomes.",1:"On n’a compté que les atomes d’hydrogène (4 par molécule) et oublié l’atome de carbone.",2:"On a divisé par 5 au lieu de multiplier."},
  corrige:"Une molécule de CH<sub>4</sub> contient 1 C + 4 H = 5 atomes. n(atomes) = 5 × 0,20 = <b>1,0 mol</b> (0,20 mol de C et 0,80 mol de H). Contrôle : 0,20 + 0,80 = 1,0 ✓."}
]);
SFA.exos("c03", [
 {t:"Masse molaire du nitrate de magnésium (QCM)", s:2, enonce:"Calcule la masse molaire du nitrate de magnésium Mg(NO<sub>3</sub>)<sub>2</sub>. (M(Mg) = 24 ; M(N) = 14 ; M(O) = 16 g/mol)", choix:["86 g/mol","100 g/mol","172 g/mol","148 g/mol"], bonne:3,
  pourquoi:{0:"Les parenthèses ont été oubliées : on a compté un seul groupe NO₃.",1:"Le 2 n’a été appliqué qu’à l’azote : il multiplie tout ce qui est entre parenthèses, oxygène compris.",2:"On a tout multiplié par 2, magnésium compris : le 2 ne porte que sur NO₃."},
  corrige:"M = 24 + 2 × (14 + 3 × 16) = 24 + 2 × 62 = <b>148 g/mol</b>. Contrôle : 1 Mg + 2 N + 6 O : 24 + 28 + 96 = 148 ✓."},
 {t:"Pourcentage de fer dans la rouille (QCM)", s:3, enonce:"Quel est le pourcentage massique de fer dans l’oxyde de fer(III) Fe<sub>2</sub>O<sub>3</sub> ? (M(Fe) = 56 ; M(O) = 16 g/mol)", choix:["35 %","70 %","40 %","30 %"], bonne:1,
  pourquoi:{0:"Un seul atome de fer a été compté au numérateur : il y en a 2 dans la formule.",2:"On a fait le rapport des nombres d’atomes (2 sur 5) au lieu du rapport des masses.",3:"C’est le pourcentage d’oxygène (48 ÷ 160)."},
  corrige:"M(Fe<sub>2</sub>O<sub>3</sub>) = 2 × 56 + 3 × 16 = 160 g/mol. % Fe = 112 ÷ 160 × 100 = <b>70 %</b>. Contrôle : % O = 48 ÷ 160 = 30 %, et 70 + 30 = 100 % ✓."}
]);
SFA.exos("c04", [
 {t:"Chauffer un ballon : kelvins ! (QCM)", s:3, enonce:"Un ballon de 1,5 L est à 27 °C. On le chauffe à 87 °C à pression constante. Quel est son nouveau volume ?", choix:["≈ 4,8 L","≈ 1,25 L","1,5 L","1,8 L"], bonne:3,
  pourquoi:{0:"Les températures ont été gardées en °C (1,5 × 87 ÷ 27) : la loi de Charles exige des kelvins.",1:"Le rapport est inversé (1,5 × 300 ÷ 360) : quand on chauffe à pression constante, le volume augmente.",2:"À pression constante, le volume suit la température : il ne reste pas le même."},
  corrige:"Charles : V₁/T₁ = V₂/T₂ avec T₁ = 300 K et T₂ = 360 K. V₂ = 1,5 × 360 ÷ 300 = <b>1,8 L</b>. Contrôle : 1,5 ÷ 300 = 1,8 ÷ 360 = 0,005 L/K ✓."},
 {t:"Volume par pV = nRT (QCM)", s:4, enonce:"Quel volume occupent 0,50 mol de gaz à 27 °C sous 1,0·10<sup>5</sup> Pa ? (R = 8,31 J/(mol·K))", choix:["≈ 12 L","≈ 0,012 L","≈ 1,1 L","≈ 12 000 L"], bonne:0,
  pourquoi:{1:"Le résultat de la formule est en m³ (0,012 m³) : il fallait le convertir en litres.",2:"La température a été laissée en °C (27 au lieu de 300 K).",3:"La conversion m³ → L a été faite avec 10⁶ au lieu de 10³ (1 m³ = 1 000 L)."},
  corrige:"T = 27 + 273 = 300 K. V = nRT ÷ p = 0,50 × 8,31 × 300 ÷ 1,0·10<sup>5</sup> ≈ 0,0125 m³ ≈ <b>12 L</b>. Contrôle : 0,50 mol × 24 L/mol (volume molaire vers 20-25 °C) = 12 L ✓."}
]);
SFA.exos("c05", [
 {t:"Volumes de gaz et coefficients (QCM)", s:2, enonce:"N<sub>2</sub> + 3 H<sub>2</sub> → 2 NH<sub>3</sub>. Tous les gaz sont mesurés dans les mêmes conditions de température et de pression. Quel volume d’ammoniac obtient-on avec 30 L de dihydrogène (diazote en excès) ?", choix:["30 L","45 L","20 L","60 L"], bonne:2,
  pourquoi:{0:"On a pris un rapport 1 pour 1 : les coefficients de H₂ (3) et de NH₃ (2) sont différents.",1:"Le rapport des coefficients est inversé : 30 × 3/2 au lieu de 30 × 2/3.",3:"On a multiplié par le coefficient de NH₃ sans diviser par celui de H₂."},
  corrige:"Pour des gaz, les coefficients sont aussi des rapports de volumes : V(NH<sub>3</sub>) = 30 × 2/3 = <b>20 L</b>. Contrôle : 3 volumes de H₂ donnent 2 volumes de NH₃, et 30 ÷ 3 = 20 ÷ 2 = 10 ✓."},
 {t:"Avancement maximal (QCM)", s:4, enonce:"2 SO<sub>2</sub> + O<sub>2</sub> → 2 SO<sub>3</sub>. On part de 4,0 mol de SO<sub>2</sub> et 1,5 mol de O<sub>2</sub>. Que valent l’avancement maximal ξ<sub>max</sub> et la quantité de SO<sub>3</sub> formée ?", choix:["ξ<sub>max</sub> = 2,0 mol ; 4,0 mol de SO<sub>3</sub>","ξ<sub>max</sub> = 1,5 mol ; 3,0 mol de SO<sub>3</sub>","ξ<sub>max</sub> = 1,5 mol ; 1,5 mol de SO<sub>3</sub>","ξ<sub>max</sub> = 0,75 mol ; 1,5 mol de SO<sub>3</sub>"], bonne:1,
  pourquoi:{0:"On a oublié de vérifier O₂ : ξ = 2,0 mol demanderait 2,0 mol de O₂, il n’y en a que 1,5.",2:"ξ<sub>max</sub> est juste, mais le coefficient 2 de SO₃ a été oublié : n(SO₃) = 2ξ.",3:"Le coefficient 2 a été appliqué à O₂ (1,5 ÷ 2) au lieu de SO₂."},
  corrige:"SO<sub>2</sub> : 4,0 − 2ξ = 0 → ξ = 2,0 ; O<sub>2</sub> : 1,5 − ξ = 0 → ξ = 1,5. Le plus petit l’emporte : <b>ξ<sub>max</sub> = 1,5 mol</b>, n(SO<sub>3</sub>) = 2 × 1,5 = <b>3,0 mol</b>. Contrôle : il reste 4,0 − 3,0 = 1,0 mol de SO₂, et O₂ est épuisé ✓."}
]);
SFA.exos("c06", [
 {t:"Volume de CO₂ du calcaire (QCM)", s:3, enonce:"On chauffe 25 g de calcaire pur : CaCO<sub>3</sub> → CaO + CO<sub>2</sub>. Quel volume de CO<sub>2</sub> se dégage à 20 °C et 1 atm ? (M(CaCO<sub>3</sub>) = 100 g/mol ; V<sub>m</sub> = 24 L/mol)", choix:["6,0 L","600 L","11 L","0,010 L"], bonne:0,
  pourquoi:{1:"La masse (25 g) a été prise pour une quantité de matière : il faut d’abord diviser par M.",2:"11 est la masse de CO₂ en grammes (0,25 × 44), pas un volume.",3:"On a divisé la quantité de matière par V<sub>m</sub> au lieu de multiplier."},
  corrige:"n(CaCO<sub>3</sub>) = 25 ÷ 100 = 0,25 mol → n(CO<sub>2</sub>) = 0,25 mol (rapport 1/1). V = 0,25 × 24 = <b>6,0 L</b>. Contrôle : 6,0 ÷ 24 = 0,25 mol ✓."},
 {t:"Dioxygène pour le butane (QCM)", s:4, enonce:"2 C<sub>4</sub>H<sub>10</sub> + 13 O<sub>2</sub> → 8 CO<sub>2</sub> + 10 H<sub>2</sub>O. Quelle masse de dioxygène faut-il pour brûler 11,6 g de butane ? (M(C<sub>4</sub>H<sub>10</sub>) = 58 ; M(O<sub>2</sub>) = 32 g/mol)", choix:["83,2 g","6,4 g","41,6 g","75,4 g"], bonne:2,
  pourquoi:{0:"Le rapport des coefficients n’a pas été complété : on a multiplié par 13 sans diviser par 2.",1:"On a pris un rapport 1 pour 1 entre butane et dioxygène.",3:"On a appliqué le rapport des coefficients aux masses (11,6 × 13/2) : seules les moles suivent les coefficients."},
  corrige:"n(butane) = 11,6 ÷ 58 = 0,20 mol ; n(O<sub>2</sub>) = 0,20 × 13/2 = 1,3 mol ; m = 1,3 × 32 = <b>41,6 g</b>. Contrôle : 0,20 ÷ 2 = 1,3 ÷ 13 = 0,10 ✓."}
]);
SFA.exos("c07", [
 {t:"Ce qui reste en excès (QCM)", s:3, enonce:"2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O. On fait réagir 5,0 mol de H<sub>2</sub> avec 2,0 mol de O<sub>2</sub>. Que reste-t-il à la fin, en plus de l’eau ?", choix:["3,0 mol de H<sub>2</sub>","Rien : les deux réactifs sont épuisés","1,0 mol de O<sub>2</sub>","1,0 mol de H<sub>2</sub>"], bonne:3,
  pourquoi:{0:"Le coefficient 2 de H₂ a été oublié : 2,0 mol de O₂ consomment 4,0 mol de H₂, pas 2,0.",1:"Les réactifs ne sont pas dans les proportions 2 : 1 (5,0 : 2,0 = 2,5).",2:"Le réactif en excès est mal identifié : O₂ est limitant (2,0 &lt; 5,0 ÷ 2 = 2,5)."},
  corrige:"n/coeff : H<sub>2</sub> 5,0/2 = 2,5 ; O<sub>2</sub> 2,0/1 = 2,0. O<sub>2</sub> limite, ξ<sub>max</sub> = 2,0 mol. H<sub>2</sub> restant = 5,0 − 2 × 2,0 = <b>1,0 mol</b> ; eau formée : 4,0 mol. Contrôle (atomes H) : 10 = 2 × 1,0 + 2 × 4,0 ✓."},
 {t:"Magnésium dans un peu d’acide (QCM)", s:4, enonce:"Mg + 2 HCl → MgCl<sub>2</sub> + H<sub>2</sub>. On plonge 0,48 g de magnésium (M = 24 g/mol) dans 30 mL d’acide chlorhydrique à 1,0 mol/L. Quel est le réactif limitant et quel volume de H<sub>2</sub> obtient-on ? (V<sub>m</sub> = 24 L/mol)", choix:["Mg ; 0,48 L","HCl ; 0,36 L","HCl ; 0,72 L","HCl ; 0,015 L"], bonne:1,
  pourquoi:{0:"On a comparé les n sans les diviser par les coefficients (0,020 &lt; 0,030) : HCl a un coefficient 2.",2:"Le coefficient 2 a été oublié dans le passage de HCl à H₂ : 0,030 mol de HCl donnent 0,015 mol de H₂.",3:"0,015 est la quantité de H₂ en mol : il faut la multiplier par V<sub>m</sub>."},
  corrige:"n(Mg) = 0,48 ÷ 24 = 0,020 mol ; n(HCl) = 1,0 × 0,030 = 0,030 mol. n/coeff : Mg 0,020 ; HCl 0,015 → <b>HCl limite</b>. n(H<sub>2</sub>) = 0,030 ÷ 2 = 0,015 mol ; V = 0,015 × 24 = <b>0,36 L</b>. Contrôle : il reste 0,020 − 0,015 = 0,005 mol de Mg ✓."}
]);
SFA.exos("c08", [
 {t:"Concentration en ions chlorure (QCM)", s:2, enonce:"Une solution de chlorure de calcium CaCl<sub>2</sub> a une concentration de 0,15 mol/L. Quelle est la concentration en ions Cl<sup>−</sup> ?", choix:["0,15 mol/L","0,075 mol/L","0,30 mol/L","0,45 mol/L"], bonne:2,
  pourquoi:{0:"L’indice 2 a été oublié : chaque unité CaCl₂ libère 2 ions Cl⁻.",1:"On a divisé par 2 au lieu de multiplier.",3:"On a compté tous les ions (1 Ca²⁺ + 2 Cl⁻ = 3) au lieu des seuls ions chlorure."},
  corrige:"CaCl<sub>2</sub> → Ca<sup>2+</sup> + 2 Cl<sup>−</sup> : [Cl<sup>−</sup>] = 2 × 0,15 = <b>0,30 mol/L</b>. Contrôle des charges : 2 × 0,15 (Ca²⁺) = 0,30 (Cl⁻) ✓."},
 {t:"De g/L à mol/L (QCM)", s:3, enonce:"Une solution de glucose C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> (M = 180 g/mol) a une concentration massique de 9,0 g/L. Quelle est sa concentration molaire ?", choix:["0,050 mol/L","1 620 mol/L","20 mol/L","9,0 mol/L"], bonne:0,
  pourquoi:{1:"On a multiplié par M au lieu de diviser : c<sub>m</sub> = c × M, donc c = c<sub>m</sub> ÷ M.",2:"Le quotient est inversé (180 ÷ 9,0).",3:"Concentration massique et concentration molaire ont été confondues."},
  corrige:"c = c<sub>m</sub> ÷ M = 9,0 ÷ 180 = <b>0,050 mol/L</b>. Contrôle : 0,050 mol/L × 180 g/mol = 9,0 g/L ✓."}
]);
SFA.exos("c09", [
 {t:"pH d’un acide fort dilué (QCM)", s:1, enonce:"Quel est le pH d’une solution d’acide chlorhydrique (acide fort) à 1,0·10<sup>−3</sup> mol/L ?", choix:["−3","11","0,001","3"], bonne:3,
  pourquoi:{0:"Le signe moins de la formule pH = −log c a été oublié.",1:"C’est la formule d’une base forte (14 + log c) : HCl est un acide.",2:"La concentration a été prise pour le pH."},
  corrige:"Acide fort : [H<sub>3</sub>O<sup>+</sup>] = c = 1,0·10<sup>−3</sup> mol/L, donc pH = −log(10<sup>−3</sup>) = <b>3</b>. Contrôle : 10<sup>−3</sup> = 10<sup>−pH</sup> ✓."},
 {t:"Concentration d’un acide titré (QCM)", s:3, enonce:"On titre 10,0 mL d’acide chlorhydrique par de la soude à 0,200 mol/L. L’équivalence est atteinte pour 12,5 mL de soude. Quelle est la concentration de l’acide ?", choix:["0,160 mol/L","2,50 mol/L","0,125 mol/L","0,250 mol/L"], bonne:3,
  pourquoi:{0:"Les volumes ont été inversés : 0,200 × 10,0 ÷ 12,5.",1:"On a calculé c<sub>b</sub> × V<sub>éq</sub> (2,50 mmol) sans diviser par le volume d’acide.",2:"On a divisé par 2 comme pour un diacide : HCl ne libère qu’un H⁺."},
  corrige:"Monoacide : c<sub>a</sub> × V<sub>a</sub> = c<sub>b</sub> × V<sub>éq</sub>, donc c<sub>a</sub> = 0,200 × 12,5 ÷ 10,0 = <b>0,250 mol/L</b>. Contrôle : 0,250 × 10,0 = 2,50 mmol = 0,200 × 12,5 ✓."}
]);
SFA.exos("c10", [
 {t:"Les ions spectateurs (QCM)", s:2, enonce:"On mélange une solution de nitrate d’argent AgNO<sub>3</sub> et une solution de chlorure de sodium NaCl : un précipité blanc de AgCl se forme. Quels sont les ions spectateurs ?", choix:["Ag<sup>+</sup> et Cl<sup>−</sup>","Il n’y en a pas","Na<sup>+</sup> et Cl<sup>−</sup>","Na<sup>+</sup> et NO<sub>3</sub><sup>−</sup>"], bonne:3,
  pourquoi:{0:"Ag⁺ et Cl⁻ sont justement les ions qui forment le précipité AgCl.",1:"Na⁺ et NO₃⁻ restent dissous sans réagir : ce sont des spectateurs.",2:"Cl⁻ ne reste pas en solution : il s’associe à Ag⁺ dans le précipité. Na⁺ est bien spectateur, mais pas Cl⁻."},
  corrige:"Équation ionique nette : Ag<sup>+</sup> + Cl<sup>−</sup> → AgCl(s). Les ions <b>Na<sup>+</sup> et NO<sub>3</sub><sup>−</sup></b> restent en solution : tous les sels de sodium et tous les nitrates sont solubles ✓."},
 {t:"Masse de sulfate de baryum (QCM)", s:4, enonce:"On verse 20,0 mL de chlorure de baryum à 0,100 mol/L dans un excès de sulfate de sodium : Ba<sup>2+</sup> + SO<sub>4</sub><sup>2−</sup> → BaSO<sub>4</sub>(s). Quelle masse de précipité obtient-on ? (M(Ba) = 137 ; M(S) = 32 ; M(O) = 16 ; M(Cl) = 35,5 ; M(Na) = 23 g/mol)", choix:["0,416 g","0,466 g","466 g","0,284 g"], bonne:1,
  pourquoi:{0:"On a utilisé la masse molaire de BaCl₂ (208 g/mol) au lieu de celle du précipité BaSO₄.",2:"Le volume n’a pas été converti en litres (20,0 au lieu de 0,0200 L).",3:"On a utilisé la masse molaire de Na₂SO₄ (142 g/mol), qui reste dissous."},
  corrige:"n(Ba<sup>2+</sup>) = 0,100 × 0,0200 = 2,00·10<sup>−3</sup> mol = n(BaSO<sub>4</sub>). M(BaSO<sub>4</sub>) = 137 + 32 + 4 × 16 = 233 g/mol. m = 2,00·10<sup>−3</sup> × 233 = <b>0,466 g</b>. Contrôle : 0,466 ÷ 233 = 2,00 mmol ✓."}
]);
