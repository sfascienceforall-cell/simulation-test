/* Mathématiques BA1 · chapitre 8 : matrices et systèmes linéaires · exercices */
SFA.exos("c08", [
  {t:"Un système 2 × 2", s:1, enonce:"Résous le système { 2x + y = 7 ; x − y = 2 }.",
   indice:"Additionne les deux équations : les y disparaissent.",
   corrige:"<ol><li>En additionnant : 3x = 9, donc x = 3.</li><li>Dans la deuxième équation : 3 − y = 2, donc y = 1.</li><li>Vérification : 2·3 + 1 = 7 ✓ et 3 − 1 = 2 ✓.</li></ol>", reponse:"(x ; y) = (3 ; 1)"},

  {t:"Produit de deux matrices", s:1, enonce:"Soit A = [[1 ; 2] ; [3 ; 4]] et B = [[0 ; 1] ; [1 ; 0]] (lignes entre crochets). Calcule AB, puis BA. Sont-elles égales ?",
   indice:"Entrée (i ; j) de AB = (ligne i de A) · (colonne j de B).",
   corrige:"<ol><li>AB : ligne 1 · colonnes de B : (1·0 + 2·1 ; 1·1 + 2·0) = (2 ; 1). Ligne 2 : (3·0 + 4·1 ; 3·1 + 4·0) = (4 ; 3). Donc AB = [[2 ; 1] ; [4 ; 3]] (les colonnes de A sont échangées).</li><li>BA : ligne 1 de B = (0 ; 1) donne (0·1 + 1·3 ; 0·2 + 1·4) = (3 ; 4) ; ligne 2 = (1 ; 0) donne (1 ; 2). Donc BA = [[3 ; 4] ; [1 ; 2]] (les lignes de A sont échangées).</li><li>AB ≠ BA : le produit matriciel n'est pas commutatif.</li></ol>", reponse:"AB = [[2 ; 1] ; [4 ; 3]], BA = [[3 ; 4] ; [1 ; 2]] : AB ≠ BA"},

  {t:"Déterminant 2 × 2", s:1, enonce:"Quel est le déterminant de M = [[3 ; 5] ; [2 ; 4]] ?", choix:["2","22","7","−2"], bonne:0,
   pourquoi:{1:"22 = 3·4 + 5·2 : on a additionné les produits au lieu de soustraire.",2:"7 = 3 + 4 : on a additionné les éléments de la diagonale (c'est la trace).",3:"−2 : la différence est faite dans le mauvais sens (bc − ad)."},
   corrige:"det M = ad − bc = 3·4 − 5·2 = 12 − 10 = 2. Géométriquement, le parallélogramme construit sur les colonnes (3 ; 2) et (5 ; 4) a une aire de 2."},

  {t:"Déterminant 3 × 3", s:2, enonce:"Calcule le déterminant de M = [[2 ; 0 ; 1] ; [1 ; 3 ; 2] ; [0 ; 1 ; 4]].",
   indice:"Développe selon la première ligne : le zéro supprime un terme.",
   corrige:"<ol><li>det = 2·|3 2 ; 1 4| − 0·|1 2 ; 0 4| + 1·|1 3 ; 0 1|.</li><li>|3 2 ; 1 4| = 12 − 2 = 10 ; |1 3 ; 0 1| = 1 − 0 = 1.</li><li>det = 2·10 − 0 + 1·1 = 21.</li></ol>", reponse:"21"},

  {t:"Inverse d'une matrice 2 × 2", s:2, enonce:"Calcule l'inverse de M = [[2 ; 1] ; [5 ; 3]] et vérifie que M·M⁻¹ = I.",
   indice:"Pour [[a ; b] ; [c ; d]], l'inverse est (1/det)·[[d ; −b] ; [−c ; a]].",
   corrige:"<ol><li>det M = 2·3 − 1·5 = 1 ≠ 0 : M est inversible.</li><li>M⁻¹ = (1/1)·[[3 ; −1] ; [−5 ; 2]].</li><li>Vérification : ligne 1 de M · colonnes de M⁻¹ : (2·3 + 1·(−5) ; 2·(−1) + 1·2) = (1 ; 0). Ligne 2 : (5·3 + 3·(−5) ; 5·(−1) + 3·2) = (0 ; 1) ✓.</li></ol>", reponse:"M⁻¹ = [[3 ; −1] ; [−5 ; 2]]"},

  {t:"Combien de solutions ?", s:2, enonce:"Combien de solutions possède le système { x + 2y = 3 ; 2x + 4y = 7 } ?", choix:["Une seule","Aucune","Une infinité","Exactement deux"], bonne:1,
   pourquoi:{0:"Le déterminant 1·4 − 2·2 = 0 : il n'y a pas de solution unique.",2:"Une infinité n'arriverait que si la deuxième équation était un multiple de la première, second membre compris (2 × 3 = 6, pas 7).",3:"Un système linéaire a 0, 1 ou une infinité de solutions, jamais exactement deux."},
   corrige:"Les deux droites ont la même pente (coefficients proportionnels 1 : 2 et 2 : 4) mais sont distinctes : en éliminant, 2·(équation 1) donne 2x + 4y = 6, ce qui contredit 2x + 4y = 7. Droites parallèles distinctes : aucune solution."},

  {t:"Pivot de Gauss 3 × 3", s:3, enonce:"Résous par élimination de Gauss : { x + y + z = 6 ; 2x − y + z = 3 ; x + 2y − z = 2 }.",
   indice:"Utilise la ligne 1 pour éliminer x des lignes 2 et 3, puis élimine y de la ligne 3.",
   corrige:"<ol><li>L2 ← L2 − 2L1 : −3y − z = −9. L3 ← L3 − L1 : y − 2z = −4.</li><li>L3 ← 3·L3 + L2 : (3y − 6z) + (−3y − z) = −7z et le second membre vaut 3·(−4) + (−9) = −21, donc −7z = −21 et z = 3.</li><li>Remontée : −3y − 3 = −9, donc y = 2 ; puis x = 6 − 2 − 3 = 1.</li><li>Vérification : 2·1 − 2 + 3 = 3 ✓ ; 1 + 4 − 3 = 2 ✓.</li></ol>", reponse:"(x ; y ; z) = (1 ; 2 ; 3)"},

  {t:"Un menu à trois aliments", s:3, enonce:"On mélange trois aliments dont voici les apports par portion (protéines ; glucides ; lipides, en g) : A (10 ; 20 ; 5), B (5 ; 30 ; 10), C (20 ; 10 ; 5). Combien de portions x, y, z de A, B, C faut-il pour obtenir exactement 55 g de protéines, 140 g de glucides et 45 g de lipides ?",
   indice:"Écris une équation par nutriment, simplifie chaque équation (÷ 5, ÷ 10, ÷ 5), puis élimine.",
   corrige:"<ol><li>Système : 10x + 5y + 20z = 55 ; 20x + 30y + 10z = 140 ; 5x + 10y + 5z = 45. En simplifiant : 2x + y + 4z = 11 ; 2x + 3y + z = 14 ; x + 2y + z = 9.</li><li>L2 − L1 : 2y − 3z = 3. De L3 : x = 9 − 2y − z ; dans L1 : 18 − 4y − 2z + y + 4z = 11, soit −3y + 2z = −7.</li><li>Résolution : 2y − 3z = 3 et −3y + 2z = −7. En multipliant par 2 et 3 : 4y − 6z = 6 et −9y + 6z = −21 ; on additionne : −5y = −15, donc y = 3 ; puis z = (2·3 − 3)/3 = 1.</li><li>x = 9 − 6 − 1 = 2. Vérification : protéines 20 + 15 + 20 = 55 ✓ ; glucides 40 + 90 + 10 = 140 ✓ ; lipides 10 + 30 + 5 = 45 ✓.</li></ol>", reponse:"2 portions de A, 3 de B, 1 de C"},

  {t:"Rang d'une matrice", s:3, enonce:"Quel est le rang de M = [[1 ; 2 ; 3] ; [4 ; 5 ; 6] ; [7 ; 8 ; 9]] ?", choix:["3","2","1","0"], bonne:1,
   pourquoi:{0:"Une matrice 3 × 3 n'est de rang 3 que si son déterminant est non nul ; ici det M = 0.",2:"Les lignes 1 et 2 ne sont pas proportionnelles : le rang est au moins 2.",3:"Seule la matrice nulle a un rang égal à 0."},
   corrige:"L2 ← L2 − 4L1 donne (0 ; −3 ; −6) ; L3 ← L3 − 7L1 donne (0 ; −6 ; −12) = 2·(0 ; −3 ; −6). Après L3 ← L3 − 2L2, il reste une ligne nulle et deux lignes non nulles : rang 2 (et det M = 0)."},

  {t:"Un paramètre dans le système", s:4, enonce:"Discute, selon la valeur du réel m, le nombre de solutions de { x + my = 1 ; mx + 4y = 2 }, et donne la solution quand elle est unique.",
   indice:"Calcule le déterminant des coefficients : il vaut 4 − m². Étudie à part les valeurs qui l'annulent.",
   corrige:"<ol><li>det = 1·4 − m·m = 4 − m² = (2 − m)(2 + m). Si m ≠ 2 et m ≠ −2, solution unique.</li><li>Formules de Cramer : x = (1·4 − m·2)/(4 − m²) = 2(2 − m)/((2 − m)(2 + m)) = 2/(2 + m) ; y = (1·2 − m·1)/(4 − m²) = 1/(2 + m).</li><li>m = 2 : le système devient x + 2y = 1 et 2x + 4y = 2, deux équations identiques : une infinité de solutions (une droite).</li><li>m = −2 : x − 2y = 1 et −2x + 4y = 2, soit x − 2y = −1 : contradiction, aucune solution.</li></ol>", reponse:"m ≠ ±2 : (x ; y) = (2/(2+m) ; 1/(2+m)) ; m = 2 : infinité ; m = −2 : aucune"},

  {t:"Quelle égalité est vraie ?", s:4, enonce:"A et B sont deux matrices carrées inversibles de même taille. Laquelle de ces égalités est vraie en général ?", choix:["(AB)⁻¹ = A⁻¹B⁻¹","(AB)⁻¹ = B⁻¹A⁻¹","(A + B)⁻¹ = A⁻¹ + B⁻¹","(AB)² = A²B²"], bonne:1,
   pourquoi:{0:"L'ordre est inversé : pour défaire « d'abord B puis A », on défait A d'abord puis B.",2:"L'inverse d'une somme n'est pas la somme des inverses (comme 1/(a + b) ≠ 1/a + 1/b).",3:"(AB)² = ABAB, qui n'est égal à AABB que si AB = BA."},
   corrige:"On vérifie (AB)(B⁻¹A⁻¹) = A(BB⁻¹)A⁻¹ = AA⁻¹ = I. C'est comme enlever ses chaussettes et ses chaussures : on défait dans l'ordre inverse de celui de l'habillage."},

  {t:"Remonter dans le temps", s:4, enonce:"Un médicament passe entre le sang (S) et un tissu (T). À chaque heure, le vecteur (S ; T) devient M·(S ; T) avec M = [[0,8 ; 0,3] ; [0,2 ; 0,7]]. Après une heure on mesure (S ; T) = (50 ; 30) mg. Quelles étaient les quantités une heure plus tôt ?",
   indice:"Il faut résoudre M·v = (50 ; 30) : calcule M⁻¹ (déterminant 0,8·0,7 − 0,3·0,2).",
   corrige:"<ol><li>det M = 0,56 − 0,06 = 0,5.</li><li>M⁻¹ = (1/0,5)·[[0,7 ; −0,3] ; [−0,2 ; 0,8]] = [[1,4 ; −0,6] ; [−0,4 ; 1,6]].</li><li>v = M⁻¹·(50 ; 30) = (1,4·50 − 0,6·30 ; −0,4·50 + 1,6·30) = (70 − 18 ; −20 + 48) = (52 ; 28).</li><li>Vérification : M·(52 ; 28) = (41,6 + 8,4 ; 10,4 + 19,6) = (50 ; 30) ✓. La quantité totale (80 mg) est conservée.</li></ol>", reponse:"52 mg dans le sang et 28 mg dans le tissu"},

  {t:"Équilibrer une combustion", s:5, enonce:"On veut équilibrer a C₄H₁₀ + b O₂ → c CO₂ + d H₂O avec les plus petits entiers strictement positifs. Écris le système linéaire homogène (un bilan par élément), résous-le et donne a, b, c, d.",
   indice:"Bilan de C : 4a = c ; bilan de H : 10a = 2d ; bilan de O : 2b = 2c + d. Quatre inconnues, trois équations : une inconnue reste libre.",
   corrige:"<ol><li>Équations : 4a − c = 0 ; 10a − 2d = 0 ; 2b − 2c − d = 0.</li><li>On pose a = t : c = 4t, d = 5t, puis 2b = 8t + 5t = 13t, donc b = 13t/2.</li><li>Le rang est 3 pour 4 inconnues : l'ensemble des solutions est une droite vectorielle, dirigée par (1 ; 13/2 ; 4 ; 5).</li><li>Il faut des entiers : t = 2 est la plus petite valeur (13t/2 entier). Alors (a ; b ; c ; d) = (2 ; 13 ; 8 ; 10).</li><li>Vérification : C 8 = 8, H 20 = 20, O 26 = 16 + 10 ✓.</li></ol>", reponse:"2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O"},

  {t:"Un déterminant composé", s:5, enonce:"A est une matrice 3 × 3 avec det A = 4. Que vaut det(2·A⁻¹·Aᵀ) ?", choix:["1","2","8","32"], bonne:2,
   pourquoi:{0:"On a oublié le facteur 2 : multiplier une matrice 3 × 3 par 2 multiplie son déterminant par 2³ = 8.",1:"Le facteur 2 est élevé à la puissance 3 (une fois par ligne), pas à la puissance 1.",3:"32 = 8 × 4 : on a oublié que A⁻¹ divise le déterminant par det A."},
   corrige:"det(kM) = kⁿ det M avec n = 3 : det(2·A⁻¹Aᵀ) = 2³·det(A⁻¹)·det(Aᵀ) = 8·(1/4)·4 = 8. On a utilisé det(A⁻¹) = 1/det A et det(Aᵀ) = det A."}
]);
