/* Mathématiques BA1 · chapitre 10 : fonctions de plusieurs variables · exercices */
SFA.exos("c10", [
  {t:"Domaine d'une fonction de deux variables", s:1, enonce:"Détermine et décris géométriquement le domaine de f(x ; y) = √(9 − x² − y²).",
   indice:"Il faut que le radicande soit positif ou nul : 9 − x² − y² ≥ 0.",
   corrige:"<ol><li>La racine carrée n'est définie que si 9 − x² − y² ≥ 0, soit x² + y² ≤ 9.</li><li>C'est l'ensemble des points dont la distance à l'origine est au plus 3.</li><li>Le domaine est le disque fermé de centre (0 ; 0) et de rayon 3. Le graphe est la demi-sphère supérieure de rayon 3.</li></ol>", reponse:"Disque fermé de centre O et de rayon 3 : x² + y² ≤ 9"},

  {t:"Valeur et courbe de niveau", s:1, enonce:"Soit f(x ; y) = 2x² + y. Calcule f(1 ; −3), puis décris la courbe de niveau f(x ; y) = 4.",
   indice:"Une courbe de niveau c est l'ensemble des (x ; y) tels que f(x ; y) = c : isole y.",
   corrige:"<ol><li>f(1 ; −3) = 2·1 + (−3) = −1.</li><li>f(x ; y) = 4 équivaut à 2x² + y = 4, donc y = 4 − 2x².</li><li>La courbe de niveau 4 est une parabole tournée vers le bas, de sommet (0 ; 4), qui coupe l'axe x en (±√2 ; 0).</li></ol>", reponse:"f(1 ; −3) = −1 ; niveau 4 : parabole y = 4 − 2x²"},

  {t:"Une dérivée partielle", s:1, enonce:"Quelle est la dérivée partielle ∂f/∂x de f(x ; y) = x²y³ ?", choix:["2xy³","3x²y²","6xy²","2x + 3y²"], bonne:0,
   pourquoi:{1:"C'est ∂f/∂y : on a dérivé par rapport à y.",2:"On a dérivé x² et y³ en même temps ; y est une constante quand on dérive en x.",3:"On a confondu le produit avec une somme : x²y³ ≠ x² + y³."},
   corrige:"On dérive par rapport à x en traitant y comme une constante : ∂/∂x(x²·y³) = 2x·y³."},

  {t:"Dérivées partielles d'une exponentielle", s:2, enonce:"Calcule ∂f/∂x et ∂f/∂y pour f(x ; y) = x·e^(xy) + y², puis leurs valeurs en (1 ; 0).",
   indice:"Pour ∂f/∂x, utilise la règle du produit sur x·e^(xy) (e^(xy) dépend de x). Pour ∂f/∂y, x est une constante.",
   corrige:"<ol><li>∂f/∂x = 1·e^(xy) + x·(y·e^(xy)) = (1 + xy)e^(xy).</li><li>∂f/∂y = x·(x·e^(xy)) + 2y = x²e^(xy) + 2y.</li><li>En (1 ; 0) : ∂f/∂x = (1 + 0)e⁰ = 1 et ∂f/∂y = 1·e⁰ + 0 = 1.</li></ol>", reponse:"f_x = (1 + xy)e^(xy), f_y = x²e^(xy) + 2y ; en (1 ; 0) : 1 et 1"},

  {t:"Plan tangent et approximation", s:2, enonce:"Soit f(x ; y) = x² + xy + y². Donne l'équation du plan tangent au point (1 ; 1), puis estime f(1,1 ; 0,9) avec ce plan et compare à la valeur exacte.",
   indice:"Plan tangent : z = f(a ; b) + f_x(a ; b)(x − a) + f_y(a ; b)(y − b).",
   corrige:"<ol><li>f(1 ; 1) = 3. f_x = 2x + y = 3 et f_y = x + 2y = 3 en (1 ; 1).</li><li>Plan tangent : z = 3 + 3(x − 1) + 3(y − 1) = 3x + 3y − 3.</li><li>Estimation en (1,1 ; 0,9) : 3 + 3(0,1) + 3(−0,1) = 3.</li><li>Valeur exacte : 1,21 + 0,99 + 0,81 = 3,01. L'erreur (0,01) est du second ordre (0,1²).</li></ol>", reponse:"z = 3x + 3y − 3 ; estimation 3, valeur exacte 3,01"},

  {t:"Courbe de niveau d'une selle", s:2, enonce:"Quelle est la courbe de niveau f(x ; y) = 0 pour f(x ; y) = x² − y² ?", choix:["Deux droites : y = x et y = −x","Un cercle","Une hyperbole","Une parabole"], bonne:0,
   pourquoi:{1:"Un cercle serait x² + y² = c (somme de carrés).",2:"Les niveaux x² − y² = c avec c ≠ 0 sont des hyperboles, mais le niveau 0 est dégénéré.",3:"Il n'y a pas de terme du premier degré : ce n'est pas une parabole."},
   corrige:"x² − y² = 0 équivaut à (x − y)(x + y) = 0, donc y = x ou y = −x : deux droites qui se croisent à l'origine. Pour c > 0 les niveaux sont des hyperboles d'axe x, pour c < 0 d'axe y : c'est la signature d'un point-selle."},

  {t:"Dérivée directionnelle", s:3, enonce:"Soit f(x ; y) = x² + 3xy. Calcule le gradient en (1 ; 2), la dérivée directionnelle dans la direction du vecteur v = (3 ; 4), et la plus grande pente possible en ce point.",
   indice:"Normalise d'abord v : u = v/‖v‖. Puis D_u f = ∇f·u. La plus grande pente est ‖∇f‖.",
   corrige:"<ol><li>∇f = (2x + 3y ; 3x) = (2 + 6 ; 3) = (8 ; 3) en (1 ; 2).</li><li>‖v‖ = 5 donc u = (3/5 ; 4/5).</li><li>D_u f = 8·(3/5) + 3·(4/5) = 24/5 + 12/5 = 36/5 = 7,2.</li><li>La plus grande pente est ‖∇f‖ = √(64 + 9) = √73 ≈ 8,54, dans la direction (8 ; 3)/√73.</li></ol>", reponse:"∇f = (8 ; 3) ; D_u f = 7,2 ; pente maximale √73 ≈ 8,54"},

  {t:"Le plus vite au frais", s:3, enonce:"La température (en °C) d'une plaque est T(x ; y) = 20 − x² − 2y² (x et y en mètres). Une fourmi est en (1 ; 1). Dans quelle direction doit-elle partir pour que la température baisse le plus vite, et à quel taux ? Dans quelle direction la température reste-t-elle constante ?",
   indice:"Le gradient donne la direction de plus forte hausse ; la plus forte baisse est −∇T. Le long d'une courbe de niveau, la dérivée directionnelle est nulle : u ⟂ ∇T.",
   corrige:"<ol><li>∇T = (−2x ; −4y) = (−2 ; −4) en (1 ; 1).</li><li>La baisse la plus rapide est dans la direction −∇T = (2 ; 4), soit u = (1 ; 2)/√5 ≈ (0,447 ; 0,894).</li><li>Taux : ‖∇T‖ = √(4 + 16) = √20 = 2√5 ≈ 4,47 °C par mètre.</li><li>Température constante : u ⟂ ∇T, par exemple (2 ; −1)/√5 (ou son opposé) : on suit la courbe de niveau T = 17.</li></ol>", reponse:"Direction (1 ; 2)/√5, baisse de ≈ 4,47 °C/m ; direction ± (2 ; −1)/√5 pour T constante"},

  {t:"Nature d'un point critique", s:3, enonce:"Le point (0 ; 0) est critique pour f(x ; y) = x² − 4xy + y². De quel type est-il ?", choix:["Minimum local","Maximum local","Point-selle","On ne peut pas conclure"], bonne:2,
   pourquoi:{0:"f_xx = 2 > 0 ne suffit pas : il faut aussi que D = f_xx f_yy − f_xy² soit positif (ici négatif).",1:"f_xx = 2 est positif : ce ne peut pas être un maximum.",3:"D = −12 ≠ 0 : le test conclut."},
   corrige:"f_xx = 2, f_yy = 2, f_xy = −4. D = 2·2 − (−4)² = 4 − 16 = −12 < 0 : point-selle. Contrôle : f(t ; t) = −2t² < 0 alors que f(t ; −t) = 6t² > 0 : dans une direction ça descend, dans l'autre ça monte."},

  {t:"Points critiques d'un polynôme", s:4, enonce:"Trouve et classe les points critiques de f(x ; y) = x³ + y³ − 3xy.",
   indice:"Résous f_x = 0 et f_y = 0 : tu obtiens y = x² et x = y². Ensuite, calcule la hessienne en chaque point.",
   corrige:"<ol><li>f_x = 3x² − 3y = 0 donne y = x² ; f_y = 3y² − 3x = 0 donne x = y².</li><li>En substituant : x = (x²)² = x⁴, donc x(x³ − 1) = 0 : x = 0 ou x = 1. Points critiques : (0 ; 0) et (1 ; 1).</li><li>Hessienne : f_xx = 6x, f_yy = 6y, f_xy = −3.</li><li>(0 ; 0) : D = 0·0 − 9 = −9 < 0 : point-selle.</li><li>(1 ; 1) : D = 36 − 9 = 27 > 0 et f_xx = 6 > 0 : minimum local, de valeur f(1 ; 1) = 1 + 1 − 3 = −1.</li></ol>", reponse:"(0 ; 0) point-selle ; (1 ; 1) minimum local, f = −1"},

  {t:"Quand D = 0", s:4, enonce:"En un point critique de f, la hessienne a un déterminant D = 0. Que peut-on conclure ?", choix:["Rien avec ce test : ce peut être un minimum, un maximum ou un col","C'est forcément un point-selle","C'est forcément un minimum","Ce n'est pas un point critique"], bonne:0,
   pourquoi:{1:"x⁴ + y⁴ a D = 0 en (0 ; 0), pourtant c'est un minimum.",2:"−x⁴ − y⁴ a D = 0 en (0 ; 0), pourtant c'est un maximum.",3:"D se calcule justement en un point critique ; ∇f = 0 reste vrai."},
   corrige:"Si D = 0 le test est inopérant. Exemples : x⁴ + y⁴ (minimum), −x⁴ − y⁴ (maximum), x³ + y³ (ni l'un ni l'autre). Il faut alors étudier le signe de f(x ; y) − f(a ; b) autour du point par un autre moyen."},

  {t:"La boîte la plus économique", s:4, enonce:"On veut une boîte rectangulaire sans couvercle, de volume 32 dm³, dont la surface de carton soit minimale. Les dimensions de la base sont x et y, la hauteur z. Écris la surface comme fonction de x et y, puis trouve les dimensions optimales.",
   indice:"Volume : xyz = 32, donc z = 32/(xy). Surface : S = xy + 2xz + 2yz = xy + 64/y + 64/x.",
   corrige:"<ol><li>S(x ; y) = xy + 2z(x + y) avec z = 32/(xy) : S = xy + 64/y + 64/x (x, y > 0).</li><li>S_x = y − 64/x² = 0 et S_y = x − 64/y² = 0. Donc y = 64/x², puis x = 64/y² = x⁴/64, soit x³ = 64 : x = 4, y = 4.</li><li>Hauteur : z = 32/16 = 2. Surface S = 16 + 16 + 16 = 48 dm².</li><li>Hessienne : S_xx = 128/x³ = 2, S_yy = 2, S_xy = 1 : D = 4 − 1 = 3 > 0 et S_xx > 0 : minimum.</li></ol>", reponse:"Base 4 dm × 4 dm, hauteur 2 dm, surface minimale 48 dm²"},

  {t:"Multiplicateurs de Lagrange", s:5, enonce:"Trouve les extrema de f(x ; y) = x²y sous la contrainte x² + y² = 3.",
   indice:"Pose g = x² + y² et résous ∇f = λ∇g avec g = 3. Deux équations : 2xy = 2λx et x² = 2λy. Sépare le cas x = 0.",
   corrige:"<ol><li>∇f = (2xy ; x²) et ∇g = (2x ; 2y) : 2xy = 2λx, x² = 2λy, x² + y² = 3.</li><li>Cas x ≠ 0 : de la première, λ = y. La deuxième donne x² = 2y². Dans la contrainte : 2y² + y² = 3, donc y = ±1 et x² = 2 : points (±√2 ; 1) et (±√2 ; −1). f = x²y = 2y vaut 2 en y = 1 et −2 en y = −1.</li><li>Cas x = 0 : y² = 3 et f = 0 (valeur intermédiaire).</li><li>Comparaison : la contrainte (cercle) est fermée et bornée, donc f y atteint un maximum et un minimum.</li></ol>", reponse:"Maximum 2 en (±√2 ; 1) ; minimum −2 en (±√2 ; −1)"},

  {t:"Maximum sur un disque", s:5, enonce:"On cherche le maximum de f(x ; y) = x + y sur le disque x² + y² ≤ 2. Quelle affirmation est correcte ?", choix:["Le maximum vaut 2, atteint en (1 ; 1) sur le bord du disque","Le maximum vaut 0, atteint en (0 ; 0)","Il n'y a pas de maximum car f n'a pas de point critique","Le maximum vaut 2√2, atteint en (√2 ; √2)"], bonne:0,
   pourquoi:{1:"(0 ; 0) n'est pas critique (∇f = (1 ; 1) ≠ 0) ; f y vaut 0, bien en dessous de f(1 ; 1) = 2.",2:"Le disque est fermé et borné : f continue y atteint un maximum, sur le bord s'il n'est pas à l'intérieur.",3:"(√2 ; √2) vérifie x² + y² = 4 > 2 : il est hors du disque."},
   corrige:"∇f = (1 ; 1) ne s'annule jamais : pas de point critique à l'intérieur, le maximum est sur le bord x² + y² = 2. Lagrange : (1 ; 1) = λ(2x ; 2y) donne x = y = 1/(2λ), puis 2x² = 2 : x = y = ±1. f(1 ; 1) = 2 (maximum), f(−1 ; −1) = −2 (minimum)."}
]);
