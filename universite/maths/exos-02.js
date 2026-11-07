/* Mathématiques BA1 · chapitre 2 : limites, continuité, asymptotes · exercices */
SFA.exos("c02", [
  {t:"Limite d'un quotient 0/0", s:1, enonce:"Que vaut lim<sub>x→2</sub> (x² − 4)/(x − 2) ?",
   choix:["0","n'existe pas","+∞","4"], bonne:3,
   pourquoi:{0:"Tu as remplacé x par 2 seulement dans le numérateur. On obtient la forme indéterminée 0/0 : il faut factoriser avant de conclure.",1:"0/0 est une forme indéterminée, pas une preuve d'absence de limite : après simplification la limite existe.",2:"Le dénominateur s'annule, mais le numérateur aussi : le facteur (x − 2) se simplifie, il n'y a pas d'explosion."},
   corrige:"x² − 4 = (x − 2)(x + 2). Pour x ≠ 2 : (x² − 4)/(x − 2) = x + 2. Donc la limite en 2 vaut 2 + 2 = 4."},

  {t:"Saturation enzymatique", s:1, enonce:"La vitesse d'une réaction enzymatique suit v(S) = 120·S/(5 + S) (S : concentration en substrat). (a) Calcule lim<sub>S→+∞</sub> v(S) et interprète. (b) Pour quelle concentration S la vitesse atteint-elle 95 % de cette valeur limite ?",
   indice:"Divise numérateur et dénominateur par S pour (a). Pour (b), résous 120S/(5 + S) = 114.",
   corrige:"<ol><li>(a) v(S) = 120/(5/S + 1) ; quand S → +∞, 5/S → 0, donc v → 120. La droite v = 120 est une asymptote horizontale : c'est la vitesse maximale V<sub>max</sub> (enzyme saturée).</li><li>(b) 95 % de 120 = 114. 120S = 114(5 + S) ⇒ 120S − 114S = 570 ⇒ 6S = 570 ⇒ S = 95.</li><li>Il faut une concentration 19 fois plus grande que K<sub>m</sub> = 5 pour approcher 95 % de V<sub>max</sub>.</li></ol>", reponse:"(a) 120 (asymptote horizontale) ; (b) S = 95"},

  {t:"Asymptotes d'une homographie", s:1, enonce:"Détermine les asymptotes de f(x) = (2x + 1)/(x − 3).",
   indice:"Asymptote verticale : là où le dénominateur s'annule ; horizontale : limite en ±∞.",
   corrige:"<ol><li>En x = 3 le dénominateur s'annule et le numérateur vaut 7 ≠ 0 : lim<sub>x→3<sup>+</sup></sub> f = +∞ et lim<sub>x→3<sup>−</sup></sub> f = −∞. Asymptote verticale : x = 3.</li><li>En ±∞ : f(x) = (2 + 1/x)/(1 − 3/x) → 2. Asymptote horizontale : y = 2.</li></ol>", reponse:"x = 3 (verticale) et y = 2 (horizontale)"},

  {t:"Limite remarquable avec un paramètre", s:2, enonce:"Calcule lim<sub>x→0</sub> sin(5x)/(2x).",
   indice:"Utilise lim<sub>u→0</sub> (sin u)/u = 1 avec u = 5x.",
   corrige:"<ol><li>sin(5x)/(2x) = (5/2)·sin(5x)/(5x).</li><li>Quand x → 0, u = 5x → 0 et sin u / u → 1.</li><li>La limite vaut 5/2 × 1 = 5/2.</li></ol>", reponse:"5/2"},

  {t:"Forme ∞ − ∞", s:2, enonce:"Que vaut lim<sub>x→+∞</sub> (√(x² + x) − x) ?",
   choix:["0","1","1/2","+∞"], bonne:2,
   pourquoi:{0:"« √(x² + x) ≈ x donc la différence est nulle » est faux : la différence de deux quantités infinies est une forme indéterminée, l'écart relatif tend vers 0 mais pas l'écart absolu.",1:"Tu as approximé √(x² + x) par x + 1 ; en réalité √(x² + x) ≈ x + 1/2 (développement de la racine).",3:"Les deux termes tendent vers +∞, mais leur différence reste bornée : on lève l'indétermination par la quantité conjuguée."},
   corrige:"On multiplie par la quantité conjuguée : (√(x² + x) − x)(√(x² + x) + x)/(√(x² + x) + x) = x/(√(x² + x) + x). On divise par x (x > 0) : 1/(√(1 + 1/x) + 1) → 1/(1 + 1) = 1/2. Contrôle numérique : pour x = 10<sup>6</sup>, √(x² + x) − x ≈ 0,4999999."},

  {t:"Limites à gauche et à droite", s:2, enonce:"Soit f(x) = (x² − x − 2)/|x − 2|. Calcule les limites de f en 2 à gauche et à droite. f a-t-elle une limite en 2 ?",
   indice:"Factorise x² − x − 2 = (x − 2)(x + 1) et distingue le signe de x − 2.",
   corrige:"<ol><li>x² − x − 2 = (x − 2)(x + 1).</li><li>Pour x > 2 : |x − 2| = x − 2, donc f(x) = x + 1 → 3.</li><li>Pour x < 2 : |x − 2| = −(x − 2), donc f(x) = −(x + 1) → −3.</li><li>Les limites latérales sont différentes (3 et −3) : f n'a pas de limite en 2 (discontinuité par saut).</li></ol>", reponse:"à droite 3, à gauche −3 : pas de limite"},

  {t:"Continuité d'une fonction définie par morceaux", s:3, enonce:"Pour quelle valeur de a la fonction f(x) = x² + a·x si x < 1, f(x) = 3x + 2 si x ≥ 1 est-elle continue en 1 ?",
   indice:"Compare la limite à gauche, la limite à droite et f(1).",
   corrige:"<ol><li>f(1) = 3·1 + 2 = 5, et la limite à droite vaut aussi 5 (polynôme).</li><li>Limite à gauche : lim<sub>x→1<sup>−</sup></sub> (x² + ax) = 1 + a.</li><li>Continuité ⇔ 1 + a = 5 ⇔ a = 4.</li></ol>Contrôle : avec a = 4, f(0,999) = 0,998 + 3,996 = 4,994 ≈ 5. ✓", reponse:"a = 4"},

  {t:"Une limite classique", s:3, enonce:"Que vaut lim<sub>x→0</sub> (1 − cos x)/x² ?",
   choix:["1/2","0","1","2"], bonne:0,
   pourquoi:{1:"En remplaçant x par 0 on obtient 0/0 : forme indéterminée, il faut transformer l'expression (le numérateur est du second ordre, comme le dénominateur).",2:"Tu as confondu avec sin x / x → 1 : ici le numérateur 1 − cos x se comporte comme x²/2, pas comme x.",3:"Tu as inversé le rapport : 1 − cos x ≈ x²/2 et non 2x²."},
   corrige:"On multiplie par 1 + cos x : (1 − cos x)(1 + cos x)/(x²(1 + cos x)) = sin² x/(x²(1 + cos x)) = (sin x/x)²·1/(1 + cos x). Quand x → 0 : 1² × 1/2 = 1/2."},

  {t:"Théorème des valeurs intermédiaires", s:3, enonce:"Montre que l'équation x³ + x − 1 = 0 admet une unique solution dans [0 ; 1], puis encadre-la par dichotomie (3 étapes).",
   indice:"Évalue f aux bornes, puis aux milieux successifs. Pour l'unicité, f est strictement croissante.",
   corrige:"<ol><li>f(x) = x³ + x − 1 est continue (polynôme). f(0) = −1 < 0 et f(1) = 1 > 0 : par le TVI, f s'annule sur ]0 ; 1[.</li><li>Unicité : f(x) = x³ + x − 1 est strictement croissante (somme de deux fonctions strictement croissantes), donc elle s'annule au plus une fois.</li><li>Dichotomie : f(0,5) = −0,375 < 0 ⇒ racine dans [0,5 ; 1] ; f(0,75) ≈ 0,172 > 0 ⇒ [0,5 ; 0,75] ; f(0,625) ≈ −0,131 < 0 ⇒ [0,625 ; 0,75].</li></ol>La racine vaut ≈ 0,6823, bien dans [0,625 ; 0,75] (largeur 1/2³ = 0,125). ", reponse:"solution unique ≈ 0,682 ∈ [0,625 ; 0,75]"},

  {t:"Asymptote oblique", s:4, enonce:"Soit f(x) = (2x² − 3x + 5)/(x + 1). Détermine ses asymptotes et la position de la courbe par rapport à l'asymptote oblique.",
   indice:"Effectue la division euclidienne de 2x² − 3x + 5 par x + 1.",
   corrige:"<ol><li>Division : 2x² − 3x + 5 = (x + 1)(2x − 5) + 10, donc f(x) = 2x − 5 + 10/(x + 1).</li><li>Comme 10/(x + 1) → 0 en ±∞, la droite y = 2x − 5 est asymptote oblique.</li><li>En x = −1, le numérateur vaut 2 + 3 + 5 = 10 ≠ 0 : x = −1 est asymptote verticale.</li><li>Position : f(x) − (2x − 5) = 10/(x + 1), positif pour x > −1 (courbe au-dessus de l'asymptote) et négatif pour x < −1 (en dessous).</li></ol>", reponse:"x = −1 ; y = 2x − 5 ; courbe au-dessus pour x > −1, en dessous pour x < −1"},

  {t:"Nombre e comme limite", s:4, enonce:"Que vaut lim<sub>x→+∞</sub> (1 + 3/x)<sup>2x</sup> ?",
   choix:["e<sup>3</sup>","e<sup>6</sup>","1","e<sup>2</sup>"], bonne:1,
   pourquoi:{0:"Tu as oublié l'exposant 2 : (1 + 3/x)<sup>2x</sup> = [(1 + 3/x)<sup>x</sup>]<sup>2</sup> → (e³)².",2:"« 1 à une puissance quelconque vaut 1 » est faux ici : la base tend vers 1 mais l'exposant tend vers +∞, c'est une forme indéterminée 1<sup>∞</sup>.",3:"Tu as utilisé (1 + 1/x)<sup>x</sup> → e sans tenir compte du facteur 3 dans la fraction."},
   corrige:"Posons u = x/3 : (1 + 3/x)<sup>x</sup> = (1 + 1/u)<sup>3u</sup> = [(1 + 1/u)<sup>u</sup>]<sup>3</sup> → e³. Donc (1 + 3/x)<sup>2x</sup> = [(1 + 3/x)<sup>x</sup>]<sup>2</sup> → (e³)² = e<sup>6</sup> ≈ 403,4. (Pour x = 10<sup>6</sup> on trouve 403,425.)"},

  {t:"Définition ε–δ", s:4, enonce:"On sait que lim<sub>x→3</sub> x² = 9. Trouve un δ > 0 tel que |x − 3| < δ ⇒ |x² − 9| < 0,1.",
   indice:"|x² − 9| = |x − 3|·|x + 3|. Si |x − 3| < 1, alors |x + 3| < 7.",
   corrige:"<ol><li>|x² − 9| = |x − 3|·|x + 3|.</li><li>Si on impose δ ≤ 1, alors 2 < x < 4 et |x + 3| < 7.</li><li>Il suffit donc que 7|x − 3| < 0,1, soit |x − 3| < 0,1/7 ≈ 0,0143.</li><li>On prend δ = 1/70 ≈ 0,0143 (qui est ≤ 1).</li></ol>Contrôle : le δ optimal est √(9,1) − 3 ≈ 0,0166 à droite et 3 − √(8,9) ≈ 0,0167 à gauche ; 1/70 convient donc bien.", reponse:"δ = 1/70 ≈ 0,0143 convient"},

  {t:"Une limite en 0×∞", s:5, enonce:"Que vaut lim<sub>x→+∞</sub> x·(e<sup>1/x</sup> − 1) ?",
   choix:["0","e","+∞","1"], bonne:3,
   pourquoi:{0:"Le facteur (e<sup>1/x</sup> − 1) tend vers 0 mais x tend vers +∞ : la forme 0 × ∞ est indéterminée, le résultat dépend de la vitesse relative.",1:"Tu as confondu avec (1 + 1/x)<sup>x</sup> → e ; ici c'est un produit, pas une puissance.",2:"e<sup>1/x</sup> − 1 ≈ 1/x tend vers 0 aussi vite que 1/x : il compense exactement le facteur x."},
   corrige:"Posons h = 1/x → 0<sup>+</sup>. La limite devient (e<sup>h</sup> − 1)/h, qui est la dérivée de e<sup>h</sup> en 0, c'est-à-dire la limite remarquable lim<sub>h→0</sub> (e<sup>h</sup> − 1)/h = 1. Contrôle : x = 10<sup>6</sup> donne 1,0000005."},

  {t:"Étude d'asymptotes de x·exp(1/x)", s:5, enonce:"Étudie les asymptotes de f(x) = x·e<sup>1/x</sup> (domaine ℝ*) : en 0<sup>+</sup>, en 0<sup>−</sup>, et en ±∞.",
   indice:"En ±∞, calcule m = lim f(x)/x puis p = lim (f(x) − m x) à l'aide de la limite remarquable. En 0<sup>−</sup>, e<sup>1/x</sup> → 0.",
   corrige:"<ol><li>x → 0<sup>+</sup> : 1/x → +∞, e<sup>1/x</sup> → +∞ plus vite que x ne tend vers 0 (croissances comparées) : f → +∞. Asymptote verticale x = 0 (côté droit).</li><li>x → 0<sup>−</sup> : 1/x → −∞, e<sup>1/x</sup> → 0 et x → 0 : f → 0. Pas d'asymptote verticale à gauche (la courbe tend vers l'origine, qui est exclue).</li><li>x → ±∞ : f(x)/x = e<sup>1/x</sup> → 1, donc m = 1. Puis f(x) − x = x(e<sup>1/x</sup> − 1) → 1 (limite remarquable), donc p = 1.</li><li>Asymptote oblique : y = x + 1 en +∞ et en −∞.</li></ol>Contrôle : f(100) = 100·e<sup>0,01</sup> ≈ 101,005 ≈ 100 + 1. ✓", reponse:"x = 0 (à droite) ; y = x + 1 en +∞ et −∞ ; limite 0 en 0⁻"}
]);
