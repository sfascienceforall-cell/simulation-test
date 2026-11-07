/* Mathématiques BA1 · chapitre 3 : dérivées et applications · exercices */
SFA.exos("c03", [
  {t:"Dérivée d'un polynôme", s:1, enonce:"Soit f(x) = x³ − 4x. Que vaut f′(2) ?",
   choix:["0","8","12","2"], bonne:1,
   pourquoi:{0:"Tu as calculé f(2) = 8 − 8 = 0 au lieu de f′(2) : la valeur de la fonction n'est pas la pente de la tangente.",2:"Tu as oublié de dériver −4x : (x³ − 4x)′ = 3x² − 4, et pas 3x².",3:"Tu as dérivé x³ en 3x sans élever x à la bonne puissance : (xⁿ)′ = n·xⁿ⁻¹, donc (x³)′ = 3x²."},
   corrige:"f′(x) = 3x² − 4. Donc f′(2) = 3·4 − 4 = 12 − 4 = 8."},

  {t:"Produit et fonction composée", s:1, enonce:"Dérive f(x) = x²·e<sup>3x</sup> et mets le résultat sous forme factorisée.",
   indice:"(u v)′ = u′v + u v′ et (e<sup>3x</sup>)′ = 3e<sup>3x</sup>.",
   corrige:"<ol><li>u = x², u′ = 2x ; v = e<sup>3x</sup>, v′ = 3e<sup>3x</sup> (dérivée composée).</li><li>f′(x) = 2x·e<sup>3x</sup> + x²·3e<sup>3x</sup>.</li><li>On factorise : f′(x) = x·e<sup>3x</sup>(2 + 3x).</li></ol>", reponse:"f′(x) = x(3x + 2)e^{3x}"},

  {t:"Équation de la tangente", s:1, enonce:"Détermine l'équation de la tangente à la courbe de f(x) = √x au point d'abscisse a = 4.",
   indice:"y = f(a) + f′(a)(x − a) avec f′(x) = 1/(2√x).",
   corrige:"<ol><li>f(4) = 2.</li><li>f′(x) = 1/(2√x), donc f′(4) = 1/4.</li><li>y = 2 + (1/4)(x − 4) = x/4 + 1.</li></ol>", reponse:"y = x/4 + 1"},

  {t:"Dérivée d'un quotient", s:2, enonce:"Dérive f(x) = (x² + 1)/(x − 1) sur ℝ \\ {1}.",
   indice:"(u/v)′ = (u′v − u v′)/v².",
   corrige:"<ol><li>u = x² + 1, u′ = 2x ; v = x − 1, v′ = 1.</li><li>f′(x) = [2x(x − 1) − (x² + 1)·1]/(x − 1)².</li><li>Numérateur : 2x² − 2x − x² − 1 = x² − 2x − 1.</li></ol>", reponse:"f′(x) = (x² − 2x − 1)/(x − 1)²"},

  {t:"Dérivée d'un logarithme composé", s:2, enonce:"Quelle est la dérivée de f(x) = ln(x² + 1) ?",
   choix:["1/(x² + 1)","2x·ln(x² + 1)","2x(x² + 1)","2x/(x² + 1)"], bonne:3,
   pourquoi:{0:"Tu as dérivé ln comme si l'argument était x : il faut multiplier par la dérivée de l'argument (règle de la chaîne), ici 2x.",1:"Tu as mélangé avec la dérivée d'un produit : (ln u)′ = u′/u, il n'y a pas de logarithme dans le résultat.",2:"Tu as multiplié par u au lieu de diviser : (ln u)′ = u′/u."},
   corrige:"Règle de la chaîne : (ln u)′ = u′/u avec u = x² + 1 et u′ = 2x. Donc f′(x) = 2x/(x² + 1)."},

  {t:"Dérivation implicite", s:2, enonce:"Soit le cercle x² + y² = 25. Détermine la pente de la tangente et l'équation de la tangente au point (3 ; 4).",
   indice:"Dérive les deux membres par rapport à x en considérant y = y(x).",
   corrige:"<ol><li>2x + 2y·y′ = 0, donc y′ = −x/y (si y ≠ 0).</li><li>Au point (3 ; 4) : y′ = −3/4.</li><li>Tangente : y − 4 = −(3/4)(x − 3), soit y = −(3/4)x + 25/4.</li></ol>Contrôle : la tangente est perpendiculaire au rayon (pente 4/3) : (−3/4)·(4/3) = −1. ✓", reponse:"pente −3/4 ; y = −3x/4 + 25/4"},

  {t:"Étude complète d'un polynôme", s:3, enonce:"Étudie f(x) = x³ − 6x² + 9x + 1 : extrema locaux, intervalles de monotonie, concavité et point d'inflexion.",
   indice:"Factorise f′ ; f″ donne la concavité.",
   corrige:"<ol><li>f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3).</li><li>Signes : f′ > 0 sur ]−∞ ; 1[ et ]3 ; +∞[ (croissante) ; f′ < 0 sur ]1 ; 3[ (décroissante).</li><li>Maximum local en x = 1 : f(1) = 5 ; minimum local en x = 3 : f(3) = 1.</li><li>f″(x) = 6x − 12 : f″ < 0 si x < 2 (concave), f″ > 0 si x > 2 (convexe). Point d'inflexion en (2 ; 3).</li></ol>", reponse:"max (1 ; 5), min (3 ; 1), inflexion (2 ; 3)"},

  {t:"Règle de l'Hospital", s:3, enonce:"Que vaut lim<sub>x→0</sub> (e<sup>x</sup> − 1 − x)/x² ?",
   choix:["0","1","1/2","+∞"], bonne:2,
   pourquoi:{0:"Le numérateur tend vers 0 mais le dénominateur aussi : c'est une forme 0/0 qu'il faut lever, pas une preuve que la limite est nulle.",1:"Tu as appliqué la règle une fois, obtenu (e<sup>x</sup> − 1)/(2x), puis oublié le facteur 2 en citant la limite remarquable (e<sup>x</sup> − 1)/x → 1.",3:"Le dénominateur x² tend vers 0 mais le numérateur aussi (et il est du même ordre que x²) : la limite est finie."},
   corrige:"Forme 0/0. L'Hospital : (e<sup>x</sup> − 1)/(2x), toujours de la forme 0/0. Une seconde application donne e<sup>x</sup>/2 → 1/2. (Avec Taylor : e<sup>x</sup> − 1 − x ≈ x²/2.) Contrôle : pour x = 0,001, le quotient vaut 0,50017."},

  {t:"Pic de concentration d'un médicament", s:3, enonce:"Après une injection, la concentration plasmatique est C(t) = 20·t·e<sup>−0,5t</sup> (C en mg/L, t en heures). À quel instant est-elle maximale et que vaut-elle ?",
   indice:"Dérive avec la règle du produit, factorise e<sup>−0,5t</sup>, étudie le signe.",
   corrige:"<ol><li>C′(t) = 20·e<sup>−0,5t</sup> + 20t·(−0,5)e<sup>−0,5t</sup> = 20e<sup>−0,5t</sup>(1 − 0,5t).</li><li>e<sup>−0,5t</sup> > 0 : le signe de C′ est celui de 1 − 0,5t. C′ > 0 pour t < 2 et C′ < 0 pour t > 2.</li><li>Maximum en t = 2 h : C(2) = 40e<sup>−1</sup> ≈ 14,7 mg/L.</li><li>Contrôle aux bords : C(0) = 0 et C(t) → 0 quand t → +∞ (croissances comparées).</li></ol>", reponse:"t = 2 h, C ≈ 14,7 mg/L"},

  {t:"Approximation affine", s:4, enonce:"Avec l'approximation affine de f(x) = √x en a = 25, quelle valeur approchée obtient-on pour √26 ?",
   choix:["5,1","5,2","5,05","5,01"], bonne:0,
   pourquoi:{1:"Tu as pris f′(25) = 1/√25 = 1/5 en oubliant le facteur 2 : (√x)′ = 1/(2√x).",2:"Tu as calculé 1/(4·5) au lieu de 1/(2·5) : (√x)′ = 1/(2√x), donc f′(25) = 1/10.",3:"Tu as ajouté 0,01 en confondant h = 1 avec 0,1 : l'accroissement est f′(25)·1 = 0,1."},
   corrige:"f(25) = 5 et f′(25) = 1/(2·5) = 0,1. f(26) ≈ f(25) + f′(25)·(26 − 25) = 5 + 0,1 = 5,1. Valeur exacte : √26 ≈ 5,09902 (erreur ≈ 10⁻³)."},

  {t:"Boîte de volume imposé", s:4, enonce:"On veut fabriquer une boîte à base carrée, sans couvercle, de volume 32 dm³, avec le moins de matériau possible. Quelles dimensions choisir et quelle surface minimale obtient-on ?",
   indice:"Côté de la base a, hauteur h : a²h = 32. Surface S = a² + 4ah.",
   corrige:"<ol><li>h = 32/a², donc S(a) = a² + 4a·32/a² = a² + 128/a, pour a > 0.</li><li>S′(a) = 2a − 128/a² = (2a³ − 128)/a² = 0 ⇔ a³ = 64 ⇔ a = 4 dm.</li><li>S′ < 0 pour a < 4 et S′ > 0 pour a > 4 : c'est un minimum (S → +∞ aux deux bords).</li><li>h = 32/16 = 2 dm et S = 16 + 32 = 48 dm².</li></ol>", reponse:"base 4 dm × 4 dm, hauteur 2 dm ; S = 48 dm²"},

  {t:"Taylor et ln(1 + x)", s:4, enonce:"(a) Écris le polynôme de Taylor d'ordre 3 de ln(1 + x) en 0 et utilise-le pour approcher ln(1,1). (b) Majore l'erreur commise. (c) Calcule lim<sub>x→0</sub> (ln(1 + x) − x)/x².",
   indice:"f′ = 1/(1 + x), f″ = −1/(1 + x)², f‴ = 2/(1 + x)³.",
   corrige:"<ol><li>(a) f(0) = 0, f′(0) = 1, f″(0) = −1, f‴(0) = 2. T₃(x) = x − x²/2 + x³/3. Pour x = 0,1 : 0,1 − 0,005 + 0,000333 ≈ 0,095333.</li><li>(b) Le terme suivant vaut −x⁴/4 = −2,5·10⁻⁵ : l'erreur est de cet ordre. Valeur exacte ln(1,1) ≈ 0,095310 : erreur réelle 2,3·10⁻⁵. ✓</li><li>(c) ln(1 + x) − x ≈ −x²/2 + x³/3, donc le quotient tend vers −1/2.</li></ol>", reponse:"T₃(0,1) ≈ 0,09533 (erreur ≈ 2,5·10⁻⁵) ; limite −1/2"},

  {t:"Taux liés : une bulle qui grandit", s:5, enonce:"Une bulle sphérique de gaz se gonfle à un débit constant de 100 cm³/s. À quelle vitesse son rayon augmente-t-il quand r = 5 cm ?",
   choix:["4/π ≈ 1,27 cm/s","≈ 1,59 cm/s","≈ 3,14 cm/s","1/π ≈ 0,32 cm/s"], bonne:3,
   pourquoi:{0:"Tu as pris dV/dr = πr² (aire d'un disque) au lieu de 4πr², l'aire de la sphère : le facteur 4 a disparu.",1:"Tu as utilisé 4πr au lieu de 4πr² : dV/dr = 4πr² (et non 4πr).",2:"Tu as inversé le rapport : dr/dt = (dV/dt)/(4πr²), pas 4πr²/(dV/dt)."},
   corrige:"V = (4/3)πr³ ⇒ dV/dt = 4πr²·dr/dt. Donc dr/dt = (dV/dt)/(4πr²) = 100/(4π·25) = 1/π ≈ 0,318 cm/s. Plus la bulle est grande, plus son rayon grossit lentement pour un débit fixé."},

  {t:"Étude de x²·exp(−x)", s:5, enonce:"Étudie complètement f(x) = x²·e<sup>−x</sup> : limites, variations, extrema, concavité, points d'inflexion, asymptote.",
   indice:"f′ = (2x − x²)e<sup>−x</sup> ; f″ = (x² − 4x + 2)e<sup>−x</sup>.",
   corrige:"<ol><li>Limites : en +∞, f → 0 (croissances comparées : x²/e<sup>x</sup> → 0), donc y = 0 est asymptote horizontale ; en −∞, f → +∞.</li><li>f′(x) = x(2 − x)e<sup>−x</sup> : f′ < 0 pour x < 0, f′ > 0 sur ]0 ; 2[, f′ < 0 pour x > 2. Minimum local en 0 : f(0) = 0 ; maximum local en 2 : f(2) = 4/e² ≈ 0,541.</li><li>f″(x) = (x² − 4x + 2)e<sup>−x</sup>, de racines 2 ± √2 ≈ 0,586 et 3,414. f″ > 0 (convexe) si x < 0,586 ou x > 3,414 ; f″ < 0 (concave) entre.</li><li>Points d'inflexion : x = 2 − √2 (f ≈ 0,191) et x = 2 + √2 (f ≈ 0,384).</li></ol>", reponse:"min (0 ; 0), max (2 ; 4/e²), inflexions en 2 ± √2, asymptote y = 0 en +∞"}
]);
