/* Mathématiques BA1 · chapitre 1 : fonctions réelles et graphes · exercices */
SFA.exos("c01", [
  {t:"Domaine d'un logarithme", s:1, enonce:"Quel est le domaine de définition de f(x) = ln(4 − x) ?",
   choix:["]−∞ ; 4]","]4 ; +∞[","]−∞ ; 4[","ℝ"], bonne:2,
   pourquoi:{0:"En x = 4 on obtient ln 0, qui n'existe pas : l'argument doit être strictement positif.",1:"On a inversé l'inégalité : 4 − x > 0 donne x < 4, pas x > 4.",3:"Le logarithme n'est défini que sur les réels strictement positifs, donc le domaine est restreint."},
   corrige:"Le logarithme exige un argument strictement positif : 4 − x > 0, c'est-à-dire x < 4. Le domaine est ]−∞ ; 4[."},

  {t:"Parité", s:1, enonce:"La fonction f(x) = x⁴ − 3x² est-elle paire, impaire ou ni l'une ni l'autre ? Justifie par un calcul.",
   indice:"Calcule f(−x) et compare avec f(x) et −f(x).",
   corrige:"<ol><li>f(−x) = (−x)<sup>4</sup> − 3(−x)<sup>2</sup> = x<sup>4</sup> − 3x<sup>2</sup>.</li><li>Donc f(−x) = f(x) pour tout x : f est paire.</li><li>Contrôle : f(2) = 16 − 12 = 4 et f(−2) = 4. Son graphe est symétrique par rapport à l'axe Oy.</li></ol>", reponse:"f est paire"},

  {t:"Lire une transformation", s:1, enonce:"Le graphe de f(x) = x² est transformé en celui de g(x) = −2·f(x − 3) + 1. Donne le sommet de la parabole obtenue et dis si elle s'ouvre vers le haut ou vers le bas.",
   indice:"Le sommet de f est (0 ; 0). Applique d'abord la translation horizontale, puis a et k.",
   corrige:"<ol><li>g(x) = −2(x − 3)² + 1.</li><li>Le sommet (0 ; 0) de f devient (h ; a·0 + k) = (3 ; 1).</li><li>Le facteur a = −2 est négatif : symétrie par rapport à Ox et étirement vertical de facteur 2 ; la parabole s'ouvre vers le bas.</li></ol>", reponse:"sommet (3 ; 1), ouverte vers le bas"},

  {t:"Réciproque d'une homographie", s:2, enonce:"Soit f(x) = (2x + 1)/(x − 3), définie pour x ≠ 3. Détermine f⁻¹(y) et le domaine de f⁻¹.",
   indice:"Pose y = f(x) et isole x.",
   corrige:"<ol><li>y = (2x + 1)/(x − 3) donne y(x − 3) = 2x + 1.</li><li>yx − 3y = 2x + 1, soit x(y − 2) = 3y + 1.</li><li>Pour y ≠ 2 : x = (3y + 1)/(y − 2).</li><li>La valeur y = 2 n'est jamais atteinte par f (l'équation donnerait 0 = 7) : c'est l'asymptote horizontale de f, donc le domaine de f⁻¹ est ℝ \\ {2}.</li></ol>Contrôle : f(4) = 9, et f⁻¹(9) = 28/7 = 4. ✓", reponse:"f⁻¹(y) = (3y + 1)/(y − 2), domaine ℝ \\ {2}"},

  {t:"Lois des logarithmes", s:2, enonce:"Que vaut A = ln 8 − 3 ln 2 + ln(e²) ?",
   choix:["2","ln 2 + 2","0","2 + 3 ln 2"], bonne:0,
   pourquoi:{1:"Tu as écrit ln 8 − 3 ln 2 = ln(8 − 6) = ln 2 : la différence de logarithmes est le logarithme d'un quotient, pas d'une différence.",2:"Tu as oublié le dernier terme : ln(e²) = 2 ln e = 2.",3:"Tu as remplacé ln 8 par 0 ; en fait ln 8 = 3 ln 2, qui compense exactement le terme − 3 ln 2."},
   corrige:"ln 8 = ln(2³) = 3 ln 2, donc ln 8 − 3 ln 2 = 0. Ensuite ln(e²) = 2. Donc A = 0 + 2 = 2."},

  {t:"Équation exponentielle", s:2, enonce:"Résous 3·e<sup>2x</sup> = 12. Donne la valeur exacte puis une valeur approchée à 10<sup>−3</sup> près.",
   indice:"Isole e^{2x}, puis applique ln.",
   corrige:"<ol><li>e<sup>2x</sup> = 12/3 = 4.</li><li>On applique ln (croissante, réciproque de l'exponentielle) : 2x = ln 4 = 2 ln 2.</li><li>x = ln 2 ≈ 0,693.</li></ol>Contrôle : 3·e<sup>2 ln 2</sup> = 3·4 = 12. ✓", reponse:"x = ln 2 ≈ 0,693"},

  {t:"arcsin d'un sinus", s:3, enonce:"Que vaut arcsin(sin(5π/6)) ?",
   choix:["5π/6","−π/6","π/3","π/6"], bonne:3,
   pourquoi:{0:"arcsin renvoie toujours une valeur dans [−π/2 ; π/2] ; 5π/6 est en dehors de cet intervalle, donc arcsin(sin x) ≠ x ici.",1:"Le signe est faux : sin(5π/6) = + 1/2 (second quadrant), donc le résultat est positif.",2:"sin(π/3) = √3/2 et non 1/2 : tu as confondu avec un autre angle usuel."},
   corrige:"sin(5π/6) = sin(π − π/6) = sin(π/6) = 1/2. La valeur principale de arcsin(1/2), dans [−π/2 ; π/2], est π/6. Donc arcsin(sin(5π/6)) = π/6, pas 5π/6."},

  {t:"Élimination d'un médicament", s:3, enonce:"Un médicament est éliminé selon C(t) = C₀·e<sup>−kt</sup>. On mesure C(2 h) = 80 mg/L et C(6 h) = 20 mg/L. Calcule la constante k, la concentration initiale C₀ et la demi-vie.",
   indice:"Divise les deux mesures pour éliminer C₀, puis prends le logarithme.",
   corrige:"<ol><li>C(2)/C(6) = e<sup>4k</sup> = 80/20 = 4.</li><li>4k = ln 4, donc k = ln 4 / 4 = (ln 2)/2 ≈ 0,347 h<sup>−1</sup>.</li><li>C₀ = C(2)·e<sup>2k</sup> = 80·e<sup>ln 2</sup> = 80 × 2 = 160 mg/L.</li><li>Demi-vie : t½ = ln 2 / k = 2 h. (On le voit : 80 → 40 → 20 en 4 h, soit deux demi-vies.)</li></ol>", reponse:"k ≈ 0,347 h⁻¹ ; C₀ = 160 mg/L ; t½ = 2 h"},

  {t:"Domaine et équation avec un logarithme", s:3, enonce:"Soit f(x) = ln(x² − 4x + 3). (a) Détermine le domaine. (b) Calcule f(0). (c) Résous f(x) = 0.",
   indice:"Factorise x² − 4x + 3 et étudie son signe. Pour (c), ln u = 0 ⇔ u = 1.",
   corrige:"<ol><li>(a) x² − 4x + 3 = (x − 1)(x − 3) > 0 : le trinôme est positif à l'extérieur des racines. Domaine : ]−∞ ; 1[ ∪ ]3 ; +∞[.</li><li>(b) f(0) = ln 3 ≈ 1,099.</li><li>(c) f(x) = 0 ⇔ x² − 4x + 3 = 1 ⇔ x² − 4x + 2 = 0, de discriminant 8 : x = 2 ± √2 ≈ 0,586 ou 3,414.</li><li>Les deux valeurs sont dans le domaine (0,586 < 1 et 3,414 > 3) : elles sont acceptables.</li></ol>", reponse:"domaine ]−∞ ; 1[ ∪ ]3 ; +∞[ ; f(0) = ln 3 ; x = 2 ± √2"},

  {t:"Acidose et logarithme décimal", s:4, enonce:"Le pH du sang artériel vaut normalement 7,4 ; en acidose sévère il descend à 7,1. Par quel facteur approximatif la concentration en ions H⁺ est-elle multipliée ? (pH = −log₁₀[H⁺])",
   choix:["≈ 1,04","≈ 2","≈ 3","≈ 0,5"], bonne:1,
   pourquoi:{0:"Tu as comparé 7,4 et 7,1 comme si la concentration variait de façon linéaire (−4 %). L'échelle de pH est logarithmique : 0,3 unité représente un facteur 10<sup>0,3</sup>.",2:"Tu as pris 10<sup>0,3</sup> ≈ 3 au lieu de 2 : retiens 10<sup>0,3</sup> ≈ 2 (car log 2 ≈ 0,301).",3:"Le sens est inversé : un pH plus bas signifie plus d'ions H⁺, donc un facteur supérieur à 1."},
   corrige:"[H⁺] = 10<sup>−pH</sup>. Rapport : 10<sup>−7,1</sup>/10<sup>−7,4</sup> = 10<sup>0,3</sup> ≈ 1,995 ≈ 2. Une baisse de seulement 0,3 unité de pH double la concentration en H⁺ (de ≈ 40 nmol/L à ≈ 80 nmol/L)."},

  {t:"Réciproque après restriction", s:4, enonce:"Soit f(x) = x² − 4x + 1. (a) Explique pourquoi f n'a pas de réciproque sur ℝ. (b) On restreint f à [2 ; +∞[ : détermine f⁻¹, son domaine et calcule f⁻¹(6).",
   indice:"Mets f sous forme canonique : f(x) = (x − 2)² − 3.",
   corrige:"<ol><li>(a) f(x) = (x − 2)² − 3 : f(1) = f(3) = −2, donc f n'est pas injective (parabole symétrique par rapport à x = 2).</li><li>(b) Sur [2 ; +∞[, f est strictement croissante, à valeurs dans [−3 ; +∞[.</li><li>y = (x − 2)² − 3 ⇒ (x − 2)² = y + 3 ⇒ x − 2 = +√(y + 3) car x ≥ 2.</li><li>f⁻¹(y) = 2 + √(y + 3), de domaine [−3 ; +∞[.</li><li>f⁻¹(6) = 2 + √9 = 5. Contrôle : f(5) = 25 − 20 + 1 = 6. ✓</li></ol>", reponse:"f⁻¹(y) = 2 + √(y + 3) sur [−3 ; +∞[ ; f⁻¹(6) = 5"},

  {t:"Rythme circadien de la température", s:4, enonce:"La température corporelle d'un adulte au cours de la journée est modélisée par T(t) = 36,8 + 0,4·sin(π(t − 10)/12) (T en °C, t en heures depuis minuit). Détermine la période, les extrema et les heures auxquelles T = 37,0 °C.",
   indice:"Période = 2π/B avec B = π/12. T = 37,0 impose sin(…) = 0,5.",
   corrige:"<ol><li>Période : 2π / (π/12) = 24 h.</li><li>Maximum 36,8 + 0,4 = 37,2 °C quand π(t − 10)/12 = π/2, soit t = 16 h ; minimum 36,4 °C pour t = 4 h.</li><li>T = 37,0 ⇔ sin(π(t − 10)/12) = 0,5 ⇔ π(t − 10)/12 = π/6 ou 5π/6 (modulo 2π).</li><li>t − 10 = 2 ou 10, donc t = 12 h ou t = 20 h.</li></ol>Contrôle : à 12 h, 0,4·sin(π/6) = 0,2. ✓", reponse:"période 24 h ; max 37,2 °C à 16 h ; min 36,4 °C à 4 h ; T = 37,0 °C à 12 h et à 20 h"},

  {t:"Une réciproque surprenante", s:5, enonce:"Soit f(x) = ln(x + √(x² + 1)), définie sur ℝ. Quelle est sa réciproque ?",
   choix:["f⁻¹(y) = (e<sup>y</sup> + e<sup>−y</sup>)/2","f⁻¹(y) = e<sup>y</sup> − 1","f⁻¹(y) = (e<sup>y</sup> − e<sup>−y</sup>)/2","f⁻¹(y) = ln(y + √(y² − 1))"], bonne:2,
   pourquoi:{0:"Cette expression (cosinus hyperbolique) est paire : elle ne peut pas être la réciproque d'une fonction impaire et strictement croissante comme f.",1:"Elle est trop simple : en y = 0 elle vaut 0 (comme il faut), mais f(1) = ln(1 + √2) ≈ 0,881 et e<sup>0,881</sup> − 1 ≈ 1,41 ≠ 1.",3:"Elle n'est même pas définie pour |y| < 1, alors que f⁻¹ doit être définie pour tout réel y."},
   corrige:"Posons y = ln(x + √(x² + 1)) : e<sup>y</sup> = x + √(x² + 1). Comme (√(x² + 1) + x)(√(x² + 1) − x) = 1, on a e<sup>−y</sup> = √(x² + 1) − x. En soustrayant : e<sup>y</sup> − e<sup>−y</sup> = 2x, donc x = (e<sup>y</sup> − e<sup>−y</sup>)/2 (le sinus hyperbolique). Contrôle : f(0,7) ≈ 0,6527 et (e<sup>0,6527</sup> − e<sup>−0,6527</sup>)/2 = 0,7. ✓"},

  {t:"Croissance d'une culture bactérienne", s:5, enonce:"Une culture croît selon N(t) = N₀·e<sup>rt</sup>. On compte N(2 h) = 1 200 et N(5 h) = 4 050 bactéries. (a) Détermine r et N₀. (b) Quel est le temps de doublement ? (c) Quand atteint-on 10<sup>6</sup> bactéries ? (d) Comment ces données apparaissent-elles sur un papier semi-logarithmique ?",
   indice:"4 050/1 200 = 3,375 = 1,5³. Pour (d), prends ln de N(t).",
   corrige:"<ol><li>(a) N(5)/N(2) = e<sup>3r</sup> = 3,375 = 1,5³, donc r = ln 1,5 ≈ 0,405 h<sup>−1</sup>. N₀ = N(2)/e<sup>2r</sup> = 1 200/1,5² ≈ 533.</li><li>(b) Doublement : t<sub>d</sub> = ln 2 / r = 0,693/0,405 ≈ 1,71 h (≈ 1 h 43 min).</li><li>(c) N(t) = 10<sup>6</sup> ⇔ e<sup>rt</sup> = 10<sup>6</sup>/533,3 = 1 875 ⇔ t = ln 1 875 / ln 1,5 ≈ 7,537/0,4055 ≈ 18,6 h.</li><li>(d) ln N = ln N₀ + r·t : sur échelle logarithmique, les points sont alignés sur une droite de pente r (ou log₁₀(1,5) ≈ 0,176 par heure en base 10).</li></ol>", reponse:"r = ln 1,5 ≈ 0,405 h⁻¹ ; N₀ ≈ 533 ; doublement ≈ 1,71 h ; 10⁶ atteint vers 18,6 h ; points alignés en semi-log"}
]);
