/* Mathématiques BA1 · chapitre 6 : nombres complexes · exercices */
SFA.exos("c06", [
  {t:"Somme et différence", s:1, enonce:"Calcule (3 − 2i) + (−1 + 5i) − (2 + i) et donne le résultat sous la forme a + bi.",
   indice:"Additionne séparément les parties réelles et les parties imaginaires ; attention au signe moins devant la parenthèse.",
   corrige:"<ol><li>On retire les parenthèses : 3 − 2i − 1 + 5i − 2 − i.</li><li>Parties réelles : 3 − 1 − 2 = 0.</li><li>Parties imaginaires : −2 + 5 − 1 = 2, donc 2i.</li></ol>", reponse:"2i (a = 0, b = 2)"},

  {t:"Produit de deux complexes", s:1, enonce:"Calcule (2 + 3i)(1 − i).",
   indice:"Distribue comme avec des polynômes, puis remplace i² par −1.",
   corrige:"<ol><li>(2 + 3i)(1 − i) = 2 − 2i + 3i − 3i².</li><li>Comme i² = −1 : −3i² = +3.</li><li>Parties réelles : 2 + 3 = 5 ; parties imaginaires : −2 + 3 = 1.</li></ol>", reponse:"5 + i"},

  {t:"Module", s:1, enonce:"Quel est le module du nombre complexe z = −3 + 4i ?", choix:["7","5","1","25"], bonne:1,
   pourquoi:{0:"7 = |−3| + |4| : on a additionné les valeurs absolues au lieu d'utiliser Pythagore.",2:"1 = −3 + 4 : on a additionné partie réelle et partie imaginaire.",3:"25 est |z|², il manque la racine carrée."},
   corrige:"|z| = √((−3)² + 4²) = √(9 + 16) = √25 = 5. C'est la longueur de l'hypoténuse du triangle rectangle de côtés 3 et 4 dans le plan complexe."},

  {t:"Quotient de deux complexes", s:2, enonce:"Écris (5 + i)/(2 − 3i) sous la forme a + bi.",
   indice:"Multiplie le numérateur et le dénominateur par le conjugué du dénominateur, 2 + 3i.",
   corrige:"<ol><li>Dénominateur : (2 − 3i)(2 + 3i) = 4 + 9 = 13.</li><li>Numérateur : (5 + i)(2 + 3i) = 10 + 15i + 2i + 3i² = 10 − 3 + 17i = 7 + 17i.</li><li>Quotient : (7 + 17i)/13.</li></ol>", reponse:"7/13 + (17/13) i ≈ 0,538 + 1,308 i"},

  {t:"Puissances de i", s:2, enonce:"Simplifie i<sup>2027</sup> + i<sup>2028</sup>.",
   indice:"Les puissances de i se répètent avec une période de 4 : i, −1, −i, 1. Cherche le reste de la division par 4.",
   corrige:"<ol><li>2027 = 4 × 506 + 3, donc i<sup>2027</sup> = i³ = −i.</li><li>2028 = 4 × 507, donc i<sup>2028</sup> = i⁰ = 1.</li><li>Somme : 1 − i.</li></ol>", reponse:"1 − i"},

  {t:"Argument principal", s:2, enonce:"Quel est l'argument principal (dans ]−π ; π]) de z = −1 + i ?", choix:["π/4","−π/4","3π/4","−3π/4"], bonne:2,
   pourquoi:{0:"arctan(1/(−1)) = −π/4 et π/4 est l'argument de 1 + i : on a ignoré le signe de la partie réelle.",1:"−π/4 = arctan(b/a) brut : le point −1 + i est dans le 2e quadrant, pas dans le 4e.",3:"−3π/4 correspond à −1 − i (3e quadrant) : mauvais signe pour la partie imaginaire."},
   corrige:"Le point (−1 ; 1) est dans le 2e quadrant, sur la bissectrice, à 45° de l'axe des abscisses négatif. Son argument est donc π − π/4 = 3π/4. (arctan(b/a) = −π/4 doit être corrigé en ajoutant π car a &lt; 0.)"},

  {t:"Oscillation amortie", s:3, enonce:"Un tissu élastique amorti obéit à x″ + 4x′ + 13x = 0. Son équation caractéristique est r² + 4r + 13 = 0. Résous-la dans ℂ, écris la forme réelle des solutions x(t) = e<sup>αt</sup>(A cos ωt + B sin ωt), puis donne la pseudo-période T = 2π/ω et le facteur par lequel l'amplitude est multipliée à chaque pseudo-période.",
   indice:"Δ = 16 − 52 &lt; 0. Les racines sont α ± iω avec α la partie réelle.",
   corrige:"<ol><li>Δ = 4² − 4·1·13 = 16 − 52 = −36 = (6i)².</li><li>r = (−4 ± 6i)/2 = −2 ± 3i.</li><li>Donc α = −2 et ω = 3 : x(t) = e<sup>−2t</sup>(A cos 3t + B sin 3t).</li><li>Pseudo-période : T = 2π/3 ≈ 2,09 s.</li><li>Facteur d'amortissement sur une pseudo-période : e<sup>−2T</sup> = e<sup>−4π/3</sup> ≈ 0,0151 (l'amplitude est divisée par environ 66).</li></ol>", reponse:"r = −2 ± 3i ; T = 2π/3 ≈ 2,09 s ; facteur ≈ 0,015"},

  {t:"Puissance par la formule de Moivre", s:3, enonce:"Calcule (1 + i)<sup>10</sup> sans développer.",
   indice:"Passe en forme trigonométrique : |1 + i| = √2 et arg = π/4.",
   corrige:"<ol><li>1 + i = √2 (cos π/4 + i sin π/4).</li><li>Moivre : (1 + i)<sup>10</sup> = (√2)<sup>10</sup>(cos 10π/4 + i sin 10π/4).</li><li>(√2)<sup>10</sup> = 2⁵ = 32 et 10π/4 = 5π/2 = π/2 + 2π.</li><li>cos(π/2) = 0 et sin(π/2) = 1, donc le résultat vaut 32 i.</li></ol>", reponse:"32 i"},

  {t:"Conjugué d'un quotient", s:3, enonce:"Quel est le conjugué de z = (1 + i)/(1 − i) ?", choix:["i","−i","1","−1"], bonne:1,
   pourquoi:{0:"i est la valeur de z elle-même : on a oublié de prendre le conjugué.",2:"1 est le module de z, pas son conjugué.",3:"Mauvais calcul du quotient : (1 + i)² = 2i et non −2."},
   corrige:"<ol><li>z = (1 + i)(1 + i)/((1 − i)(1 + i)) = (1 + 2i + i²)/2 = 2i/2 = i.</li><li>Le conjugué de i est −i.</li></ol>"},

  {t:"Racines cubiques de 8i", s:4, enonce:"Détermine toutes les solutions complexes de z³ = 8i et place-les sur un cercle dont tu donneras le rayon. Vérifie une des solutions.",
   indice:"8i = 8 e<sup>iπ/2</sup>. Les solutions sont 8<sup>1/3</sup> e<sup>i(π/2 + 2kπ)/3</sup>, k = 0, 1, 2.",
   corrige:"<ol><li>8i = 8(cos π/2 + i sin π/2) : module 8, argument π/2.</li><li>Rayon des racines : 8<sup>1/3</sup> = 2. Arguments : (π/2 + 2kπ)/3 = π/6 + 2kπ/3, soit π/6, 5π/6 et 3π/2.</li><li>z₀ = 2(cos π/6 + i sin π/6) = √3 + i.</li><li>z₁ = 2(cos 5π/6 + i sin 5π/6) = −√3 + i.</li><li>z₂ = 2(cos 3π/2 + i sin 3π/2) = −2i.</li><li>Vérification : (−2i)³ = −8 i³ = −8(−i) = 8i. ✓ Les trois points forment un triangle équilatéral inscrit dans le cercle de rayon 2.</li></ol>", reponse:"z ∈ {√3 + i ; −√3 + i ; −2i}, sur le cercle de rayon 2"},

  {t:"Bras de robot : rotation et homothétie", s:4, enonce:"L'extrémité d'un bras de robot chirurgical a pour affixe z = 4 + 2i (en cm) dans un plan de travail. Le bras tourne de 60° autour de l'origine, puis sa longueur est multipliée par 1,5. Quelle est la nouvelle affixe z′ ? Quelle est la distance de la nouvelle extrémité à l'origine ?",
   indice:"Une rotation de 60° s'obtient en multipliant par e<sup>iπ/3</sup> = 1/2 + i√3/2 ; l'homothétie en multipliant par 1,5.",
   corrige:"<ol><li>z′ = 1,5 · e<sup>iπ/3</sup> · (4 + 2i) = 1,5 (1/2 + i√3/2)(4 + 2i).</li><li>(1/2 + i√3/2)(4 + 2i) = 2 + i + 2√3 i + √3 i² = (2 − √3) + (1 + 2√3) i ≈ 0,268 + 4,464 i.</li><li>Multiplication par 1,5 : z′ ≈ 0,402 + 6,696 i.</li><li>Distance : |z′| = 1,5 · |z| · 1 = 1,5 √(16 + 4) = 1,5 √20 ≈ 6,708 cm (la rotation conserve le module). Vérification : √(0,402² + 6,696²) ≈ 6,708. ✓</li></ol>", reponse:"z′ ≈ 0,40 + 6,70 i (cm) ; |z′| = 1,5√20 ≈ 6,71 cm"},

  {t:"Lieu de points", s:4, enonce:"Détermine l'ensemble des points M d'affixe z = x + iy tels que |z − 2i| = |z + 1|. Interprète géométriquement.",
   indice:"|z − 2i| est la distance de M au point A d'affixe 2i ; |z + 1| est la distance de M au point B d'affixe −1.",
   corrige:"<ol><li>|z − 2i|² = x² + (y − 2)² et |z + 1|² = (x + 1)² + y².</li><li>Égalité : x² + y² − 4y + 4 = x² + 2x + 1 + y².</li><li>Simplification : −4y + 4 = 2x + 1, soit 2x + 4y = 3, ou x + 2y = 3/2.</li><li>Interprétation : M est équidistant de A(0 ; 2) et B(−1 ; 0) : c'est la médiatrice du segment [AB]. Vérification : le milieu (−1/2 ; 1) satisfait −1/2 + 2 = 3/2. ✓</li></ol>", reponse:"la droite x + 2y = 3/2 (médiatrice de [AB])"},

  {t:"Triple de l'angle", s:5, enonce:"En développant (cos θ + i sin θ)³ de deux façons (Moivre et binôme), démontre que cos 3θ = 4cos³θ − 3cos θ. En déduis que x = cos 20° est solution de 8x³ − 6x − 1 = 0.",
   indice:"Compare les parties réelles. Utilise sin²θ = 1 − cos²θ. Pour la seconde partie, prends θ = 20° pour que 3θ = 60°.",
   corrige:"<ol><li>Moivre : (cos θ + i sin θ)³ = cos 3θ + i sin 3θ.</li><li>Binôme : cos³θ + 3i cos²θ sin θ − 3 cos θ sin²θ − i sin³θ.</li><li>Partie réelle : cos 3θ = cos³θ − 3 cos θ sin²θ = cos³θ − 3cos θ(1 − cos²θ) = 4cos³θ − 3cos θ.</li><li>Avec θ = 20° : 4x³ − 3x = cos 60° = 1/2, où x = cos 20°.</li><li>Donc 8x³ − 6x = 1, soit 8x³ − 6x − 1 = 0. Vérification numérique : cos 20° ≈ 0,9397 ; 8 × 0,8298 − 6 × 0,9397 − 1 ≈ 6,638 − 5,638 − 1 = 0. ✓</li></ol>", reponse:"cos 3θ = 4cos³θ − 3cos θ ; cos 20° est racine de 8x³ − 6x − 1"},

  {t:"Somme de cosinus et racines de l'unité", s:5, enonce:"Les racines 7-ièmes de l'unité sont ωₖ = e<sup>2ikπ/7</sup> (k = 0, …, 6). Que vaut cos(2π/7) + cos(4π/7) + cos(6π/7) ?", choix:["0","−1/2","1/2","−1"], bonne:1,
   pourquoi:{0:"La somme des 7 racines vaut 0, mais elle inclut le terme k = 0 (cos 0 = 1) : il faut le retirer.",2:"Signe oublié : la somme des cosinus des 6 racines non triviales est négative.",3:"−1 est la somme des 6 racines non triviales (partie réelle complète), soit 2 × (cos 2π/7 + cos 4π/7 + cos 6π/7) : il faut diviser par 2."},
   corrige:"<ol><li>La somme des racines n-ièmes de l'unité (n ≥ 2) est nulle : 1 + ω₁ + … + ω₆ = 0.</li><li>Les racines non réelles vont par paires conjuguées (ω₇₋ₖ = ω̄ₖ). Donc ω₁ + ω₆ = 2cos(2π/7), ω₂ + ω₅ = 2cos(4π/7), ω₃ + ω₄ = 2cos(6π/7).</li><li>1 + 2[cos(2π/7) + cos(4π/7) + cos(6π/7)] = 0, d'où la somme vaut −1/2. Numériquement : 0,6235 − 0,2225 − 0,9010 = −0,5. ✓</li></ol>"}
]);
