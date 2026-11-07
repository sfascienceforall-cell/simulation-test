/* Mathématiques BA1 · chapitre 5 : équations différentielles · exercices */
SFA.exos("c05", [
  {t:"Décroissance exponentielle", s:1, enonce:"Résous le problème de Cauchy y′ = −2y avec y(0) = 5.",
   indice:"y′ = k y a pour solutions y = C·e<sup>kx</sup> ; la condition initiale fixe C.",
   corrige:"<ol><li>L'équation y′ = ky (k = −2) a pour solution générale y = C·e<sup>−2x</sup>.</li><li>y(0) = C = 5.</li><li>Vérification : y′ = 5·(−2)e<sup>−2x</sup> = −2y ✓.</li></ol>", reponse:"y = 5e^{−2x}"},

  {t:"Solution générale", s:1, enonce:"Quelle est la solution générale de y′ = 3y ?",
   choix:["y = e<sup>3x</sup> + C","y = C·e<sup>3x</sup>","y = 3C·eˣ","y = C·x³"], bonne:1,
   pourquoi:{0:"Tu as « intégré » comme pour y′ = f(x). Ici y figure dans le second membre : y = e<sup>3x</sup> + C donne y′ = 3e<sup>3x</sup> ≠ 3y = 3e<sup>3x</sup> + 3C (sauf si C = 0).",2:"Tu as mis le facteur 3 devant au lieu de dans l'exposant : (eˣ)′ = eˣ, donc y′ = y et non 3y.",3:"Tu as confondu avec la dérivée d'une puissance : (x³)′ = 3x², pas 3x³."},
   corrige:"Une fonction dont la dérivée est proportionnelle à elle-même est une exponentielle : y = C·e<sup>3x</sup>, car y′ = 3C·e<sup>3x</sup> = 3y. La constante C est arbitraire (une famille de solutions)."},

  {t:"Demi-vie de l'iode 131", s:1, enonce:"L'iode 131 (usage médical) a une demi-vie de 8 jours. Détermine la constante de désintégration k (en jour⁻¹) dans N′ = −kN, puis la fraction restante après 24 jours.",
   indice:"N(t) = N₀e<sup>−kt</sup> ; à t = 8 j, N = N₀/2.",
   corrige:"<ol><li>N₀e<sup>−8k</sup> = N₀/2 ⇒ e<sup>−8k</sup> = 1/2 ⇒ k = ln 2/8 ≈ 0,0866 j⁻¹.</li><li>24 jours = 3 demi-vies : fraction = (1/2)³ = 1/8.</li></ol>", reponse:"k ≈ 0,0866 j⁻¹ ; il reste 12,5 %"},

  {t:"Variables séparables", s:2, enonce:"Résous y′ = x·y² avec y(0) = 1 et précise l'intervalle de validité.",
   indice:"Sépare : dy/y² = x dx, puis intègre les deux membres.",
   corrige:"<ol><li>Pour y ≠ 0 : dy/y² = x dx.</li><li>Intégration : −1/y = x²/2 + C.</li><li>y(0) = 1 ⇒ −1 = C.</li><li>Donc 1/y = 1 − x²/2, soit y = 1/(1 − x²/2) = 2/(2 − x²).</li><li>La solution explose en x = ±√2 : elle n'existe que sur ]−√2 ; √2[ (explosion en temps fini).</li></ol>", reponse:"y = 2/(2 − x²) sur ]−√2 ; √2["},

  {t:"Équation linéaire du premier ordre", s:2, enonce:"Quelle est la solution de y′ + 2y = 6 avec y(0) = 0 ?",
   choix:["y = 3e<sup>−2x</sup>","y = 3 + e<sup>−2x</sup>","y = 6(1 − e<sup>−2x</sup>)","y = 3(1 − e<sup>−2x</sup>)"], bonne:3,
   pourquoi:{0:"C'est la solution de l'équation homogène y′ + 2y = 0 avec y(0) = 3 : tu as oublié la solution particulière constante y = 3 et la condition y(0) = 0 n'est pas respectée (y(0) = 3).",1:"Tu as additionné la solution particulière et le terme exponentiel sans coefficient : y(0) = 3 + 1 = 4 ≠ 0. Il faut y = 3 + C e<sup>−2x</sup> avec y(0) = 0 ⇒ C = −3.",2:"Tu as pris 6 comme valeur d'équilibre au lieu de 6/2 = 3 : en régime stationnaire y′ = 0 ⇒ 2y = 6 ⇒ y = 3."},
   corrige:"Solution particulière constante : 2y = 6 ⇒ y = 3. Solution générale : y = 3 + C e<sup>−2x</sup>. Avec y(0) = 0 : 3 + C = 0 ⇒ C = −3. Donc y = 3(1 − e<sup>−2x</sup>), qui tend vers l'équilibre 3."},

  {t:"Loi de refroidissement de Newton", s:2, enonce:"Un café à 90 °C est posé dans une pièce à 20 °C. Au bout de 10 min il est à 60 °C. En supposant T′ = −k(T − 20), détermine k puis le temps nécessaire pour atteindre 30 °C.",
   indice:"Pose u = T − 20 : u′ = −ku, donc u = u₀e<sup>−kt</sup> avec u₀ = 70.",
   corrige:"<ol><li>T(t) = 20 + 70e<sup>−kt</sup>.</li><li>T(10) = 60 ⇒ 70e<sup>−10k</sup> = 40 ⇒ e<sup>−10k</sup> = 4/7 ⇒ k = ln(7/4)/10 ≈ 0,0560 min⁻¹.</li><li>T(t) = 30 ⇒ 70e<sup>−kt</sup> = 10 ⇒ e<sup>−kt</sup> = 1/7 ⇒ t = ln 7/k = 10·ln 7/ln(7/4) ≈ 34,8 min.</li></ol>", reponse:"k ≈ 0,056 min⁻¹ ; t ≈ 34,8 min"},

  {t:"Perfusion et plateau", s:3, enonce:"Un médicament est perfusé à 12 mg/h dans un volume de distribution V = 30 L ; l'élimination est du premier ordre, k = 0,2 h⁻¹. Alors C′ = −kC + 12/V, avec C(0) = 0. Calcule C(t), la concentration à l'équilibre et le temps pour atteindre 90 % du plateau.",
   indice:"Écris C′ = −0,2(C − C<sub>eq</sub>) avec C<sub>eq</sub> = (12/30)/0,2.",
   corrige:"<ol><li>12/V = 0,4 mg/L/h. Équilibre : C′ = 0 ⇒ C<sub>eq</sub> = 0,4/0,2 = 2 mg/L.</li><li>C′ = −0,2(C − 2) ⇒ C(t) = 2 + (C(0) − 2)e<sup>−0,2t</sup> = 2(1 − e<sup>−0,2t</sup>).</li><li>90 % du plateau : 1 − e<sup>−0,2t</sup> = 0,9 ⇒ e<sup>−0,2t</sup> = 0,1 ⇒ t = ln 10/0,2 ≈ 11,5 h (soit ≈ 3,3 demi-vies d'élimination de 3,47 h).</li></ol>", reponse:"C(t) = 2(1 − e^{−0,2t}) mg/L ; C_eq = 2 mg/L ; t ≈ 11,5 h"},

  {t:"Temps pour atteindre K/2", s:3, enonce:"Une population suit y′ = 0,5·y(1 − y/200) avec y(0) = 20. Au bout de combien d'unités de temps atteint-elle 100 (la moitié de la capacité) ?",
   choix:["≈ 4,39","≈ 3,22","≈ 2,20","≈ 4,61"], bonne:0,
   pourquoi:{1:"Tu as utilisé ln(100/20)/r : la solution logistique fait intervenir (K − y₀)/y₀ = 9, pas y/y₀.",2:"Tu as calculé ln 9 mais oublié de diviser par le taux r = 0,5.",3:"Tu as pris (K/y₀) = 10 au lieu de (K − y₀)/y₀ = 9."},
   corrige:"Solution logistique : y(t) = K/(1 + ((K − y₀)/y₀)e<sup>−rt</sup>). y = K/2 ⇔ ((K − y₀)/y₀)e<sup>−rt</sup> = 1 ⇔ t = ln((K − y₀)/y₀)/r = ln 9/0,5 ≈ 4,39. C'est aussi l'instant du point d'inflexion (croissance maximale)."},

  {t:"Oscillations amorties", s:3, enonce:"Résous y″ + 2y′ + 5y = 0 avec y(0) = 2 et y′(0) = 0.",
   indice:"Équation caractéristique λ² + 2λ + 5 = 0 : racines complexes α ± iω.",
   corrige:"<ol><li>Δ = 4 − 20 = −16 ; λ = (−2 ± 4i)/2 = −1 ± 2i.</li><li>y = e<sup>−x</sup>(A cos 2x + B sin 2x).</li><li>y(0) = A = 2.</li><li>y′ = e<sup>−x</sup>[(−A + 2B)cos 2x + (−B − 2A)sin 2x], donc y′(0) = −A + 2B = 0 ⇒ B = 1.</li></ol>Contrôle : l'amplitude décroît en e<sup>−x</sup>, la pseudo-période vaut π.", reponse:"y = e^{−x}(2 cos 2x + sin 2x)"},

  {t:"Mélange dans une cuve", s:4, enonce:"Une cuve contient 50 L d'eau salée avec 10 kg de sel. On y verse 5 L/min d'une solution à 0,4 kg/L, et le mélange (supposé homogène) sort à 5 L/min. Écris l'équation différentielle de la masse de sel m(t), résous-la et donne le temps pour atteindre 15 kg.",
   indice:"m′ = (sel entrant) − (sel sortant) ; la concentration sortante est m/50.",
   corrige:"<ol><li>Entrée : 5·0,4 = 2 kg/min. Sortie : 5·(m/50) = m/10 kg/min.</li><li>m′ = 2 − m/10 = −(1/10)(m − 20) : équilibre m = 20 kg (= 50 L × 0,4 kg/L).</li><li>m(t) = 20 + (10 − 20)e<sup>−t/10</sup> = 20 − 10e<sup>−t/10</sup>.</li><li>m = 15 ⇒ e<sup>−t/10</sup> = 1/2 ⇒ t = 10 ln 2 ≈ 6,93 min.</li></ol>", reponse:"m′ = 2 − m/10 ; m = 20 − 10e^{−t/10} ; t ≈ 6,93 min"},

  {t:"Régimes d'un amortisseur", s:4, enonce:"Un système masse-ressort a m = 2 kg et k = 8 N/m. Quels sont les régimes pour des frottements c = 5, 8 et 12 kg/s (dans cet ordre) ?",
   choix:["sur-amorti, critique, sous-amorti","sous-amorti, sur-amorti, sur-amorti","sous-amorti, critique, sur-amorti","sous-amorti, critique, critique"], bonne:2,
   pourquoi:{0:"Tu as inversé : plus le frottement est fort, plus on s'éloigne des oscillations (Δ = c² − 4mk augmente avec c).",1:"Tu as placé le seuil critique trop bas : il vaut c = 2√(mk) = 8 kg/s, donc c = 8 est exactement critique (Δ = 0).",3:"Un régime critique n'existe que pour une seule valeur de c ; au-delà (Δ > 0), les racines sont réelles et distinctes (sur-amorti)."},
   corrige:"Δ = c² − 4mk = c² − 64. c = 5 : Δ = −39 < 0 (racines complexes, sous-amorti). c = 8 : Δ = 0 (racine double −2, critique). c = 12 : Δ = 80 > 0 (λ = (−12 ± √80)/4 = −3 ± √5 ≈ −0,76 et −5,24 : réelles distinctes, sur-amorti)."},

  {t:"Exploitation d'une ressource", s:4, enonce:"Une population de poissons suit y′ = 0,4·y(1 − y/50) − 4 (y en milliers, le terme −4 représente la pêche). Détermine les équilibres, leur stabilité, et le prélèvement maximal soutenable.",
   indice:"Résous 0,4y(1 − y/50) = 4, étudie le signe de y′ de part et d'autre ; le maximum de 0,4y(1 − y/50) est rK/4.",
   corrige:"<ol><li>0,4y − 0,008y² = 4 ⇔ y² − 50y + 500 = 0 ⇔ y = 25 ± √125 = 25 ± 5√5 ≈ 13,8 ou 36,2.</li><li>Signe de y′ = −0,008(y − 13,8)(y − 36,2) : négatif avant 13,8, positif entre 13,8 et 36,2, négatif après 36,2.</li><li>y ≈ 36,2 est stable (on y converge) ; y ≈ 13,8 est instable : sous ce seuil la population s'éteint.</li><li>Le prélèvement maximal soutenable est le maximum de 0,4y(1 − y/50), atteint en y = 25 : rK/4 = 0,4·50/4 = 5 (milliers par unité de temps). Au-delà de 5, plus aucun équilibre : effondrement.</li></ol>", reponse:"équilibres ≈ 13,8 (instable) et ≈ 36,2 (stable) ; h_max = 5"},

  {t:"Réponse d'un système à un échelon", s:5, enonce:"Un oscillateur est décrit par x″ + 4x′ + 13x = 26 avec x(0) = 0 et x′(0) = 0 (échelon de force à t = 0). (a) Trouve la solution particulière constante. (b) Résous le problème de Cauchy. (c) Calcule le premier dépassement maximal de x et exprime-le en % de la valeur finale.",
   indice:"x = x<sub>p</sub> + x<sub>h</sub> ; racines caractéristiques −2 ± 3i. Pour (c), x′(t) = 0 en une valeur simple de t.",
   corrige:"<ol><li>(a) x constant : 13x = 26 ⇒ x<sub>p</sub> = 2.</li><li>(b) λ² + 4λ + 13 = 0 ⇒ λ = −2 ± 3i. x = 2 + e<sup>−2t</sup>(A cos 3t + B sin 3t). x(0) = 0 ⇒ A = −2. x′(0) = −2A + 3B = 0 ⇒ B = −4/3. Donc x = 2 − e<sup>−2t</sup>(2 cos 3t + (4/3) sin 3t).</li><li>(c) x′(t) = e<sup>−2t</sup>[(−2A + 3B)cos 3t + (−2B − 3A)sin 3t] = (26/3)e<sup>−2t</sup> sin 3t. Premier zéro pour t > 0 : 3t = π, t = π/3 ≈ 1,05. x(π/3) = 2 + 2e<sup>−2π/3</sup> ≈ 2,246.</li><li>Dépassement : (2,246 − 2)/2 ≈ 12,3 % de la valeur finale.</li></ol>", reponse:"x_p = 2 ; x = 2 − e^{−2t}(2cos3t + (4/3)sin3t) ; dépassement ≈ 12,3 % en t = π/3"},

  {t:"Équilibres et seuil (effet Allee)", s:5, enonce:"Une population obéit à y′ = y(y − 2)(4 − y) (y en milliers). Quels sont les équilibres stables ?",
   choix:["seulement y = 2 (stable)","y = 0, 2 et 4 tous stables","y = 2 et y = 4 stables, y = 0 instable","y = 0 et y = 4 (stables), y = 2 instable"], bonne:3,
   pourquoi:{0:"Tu as confondu un seuil avec un attracteur : y = 2 est un équilibre, mais de part et d'autre y′ éloigne y de 2.",1:"Un équilibre est stable si y′ > 0 à gauche et y′ < 0 à droite ; cela ne peut pas être vrai pour trois équilibres consécutifs : ils alternent stable/instable/stable.",2:"Tu as peut-être mal étudié le signe pour y < 0 : y′ > 0 pour y < 0 (y remonte vers 0), donc 0 attire."},
   corrige:"Équilibres : 0, 2, 4. Signe de f(y) = y(y − 2)(4 − y) : y < 0 → f > 0 ; 0 < y < 2 → f < 0 ; 2 < y < 4 → f > 0 ; y > 4 → f < 0. Flèches : vers 0 de part et d'autre (stable) ; autour de 2, on s'éloigne (instable : c'est le seuil) ; vers 4 de part et d'autre (stable). Population initiale < 2 ⇒ extinction ; > 2 ⇒ stabilisation à 4 (effet Allee)."}
]);
