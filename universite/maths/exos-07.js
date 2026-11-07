/* Mathématiques BA1 · chapitre 7 : vecteurs, droites et plans de l'espace · exercices */
SFA.exos("c07", [
  {t:"Norme d'un vecteur", s:1, enonce:"Calcule la norme du vecteur u = (2 ; −3 ; 6).",
   indice:"‖u‖ = √(x² + y² + z²).",
   corrige:"<ol><li>‖u‖² = 2² + (−3)² + 6² = 4 + 9 + 36 = 49.</li><li>‖u‖ = √49 = 7.</li></ol>", reponse:"‖u‖ = 7"},

  {t:"Produit scalaire", s:1, enonce:"Calcule u·v pour u = (1 ; 2 ; −1) et v = (3 ; 0 ; 4).",
   indice:"Multiplie les composantes de même rang puis additionne.",
   corrige:"<ol><li>u·v = 1×3 + 2×0 + (−1)×4.</li><li>= 3 + 0 − 4 = −1.</li><li>Le produit scalaire est négatif : l'angle entre u et v est obtus.</li></ol>", reponse:"u·v = −1"},

  {t:"Vecteur directeur", s:1, enonce:"Un vecteur directeur de la droite passant par A(1 ; 2 ; 3) et B(4 ; 0 ; 5) est :", choix:["(3 ; −2 ; 2)","(5 ; 2 ; 8)","(−3 ; 2 ; 2)","(3 ; 2 ; 2)"], bonne:0,
   pourquoi:{1:"(5 ; 2 ; 8) = A + B : on a additionné les coordonnées des points au lieu de les soustraire.",2:"Signe de la première composante faux : on a calculé 1 − 4 pour x mais B − A pour les autres.",3:"Signe de y faux : 0 − 2 = −2 et non +2."},
   corrige:"AB = B − A = (4 − 1 ; 0 − 2 ; 5 − 3) = (3 ; −2 ; 2). Tout vecteur non nul proportionnel à AB convient aussi."},

  {t:"Angle entre deux vecteurs", s:2, enonce:"Calcule l'angle θ entre u = (1 ; 2 ; 2) et v = (2 ; 3 ; 6).",
   indice:"cos θ = u·v / (‖u‖ ‖v‖).",
   corrige:"<ol><li>u·v = 1×2 + 2×3 + 2×6 = 2 + 6 + 12 = 20.</li><li>‖u‖ = √(1 + 4 + 4) = 3 ; ‖v‖ = √(4 + 9 + 36) = 7.</li><li>cos θ = 20/21 ≈ 0,9524.</li><li>θ = arccos(20/21) ≈ 17,75°.</li></ol>", reponse:"θ ≈ 17,8°"},

  {t:"Produit vectoriel", s:2, enonce:"Calcule u × v pour u = (1 ; 2 ; 3) et v = (2 ; −1 ; 0), puis vérifie que le résultat est orthogonal à u.",
   indice:"u × v = (y₁z₂ − z₁y₂ ; z₁x₂ − x₁z₂ ; x₁y₂ − y₁x₂).",
   corrige:"<ol><li>x : 2×0 − 3×(−1) = 3.</li><li>y : 3×2 − 1×0 = 6.</li><li>z : 1×(−1) − 2×2 = −5.</li><li>u × v = (3 ; 6 ; −5).</li><li>Vérification : (u × v)·u = 3 + 12 − 15 = 0. ✓ (et (u × v)·v = 6 − 6 + 0 = 0 ✓).</li></ol>", reponse:"u × v = (3 ; 6 ; −5)"},

  {t:"Orthogonalité", s:2, enonce:"Lequel de ces couples de vecteurs est formé de vecteurs orthogonaux ?", choix:["(2 ; 1 ; −2) et (1 ; 2 ; 2)","(1 ; −1 ; 2) et (2 ; 1 ; 1)","(3 ; 1 ; 1) et (1 ; −3 ; 1)","(1 ; 1 ; 0) et (1 ; 1 ; 1)"], bonne:0,
   pourquoi:{1:"Produit scalaire = 2 − 1 + 2 = 3 ≠ 0.",2:"Produit scalaire = 3 − 3 + 1 = 1 ≠ 0 : les deux premières composantes s'annulent, mais pas la troisième.",3:"Produit scalaire = 1 + 1 + 0 = 2 ≠ 0."},
   corrige:"Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul. Pour (2 ; 1 ; −2) et (1 ; 2 ; 2) : 2 + 2 − 4 = 0. ✓"},

  {t:"Aire d'un triangle", s:3, enonce:"Calcule l'aire du triangle ABC avec A(1 ; 0 ; 2), B(3 ; 1 ; 1) et C(2 ; 3 ; 4).",
   indice:"Aire = ½ ‖AB × AC‖.",
   corrige:"<ol><li>AB = (2 ; 1 ; −1) et AC = (1 ; 3 ; 2).</li><li>AB × AC : x = 1×2 − (−1)×3 = 5 ; y = (−1)×1 − 2×2 = −5 ; z = 2×3 − 1×1 = 5. Donc (5 ; −5 ; 5).</li><li>‖AB × AC‖ = √(25 + 25 + 25) = 5√3.</li><li>Aire = 5√3/2 ≈ 4,33.</li></ol>", reponse:"5√3/2 ≈ 4,33"},

  {t:"Plan de coupe par trois points", s:3, enonce:"Un plan de coupe (imagerie) passe par A(1 ; 0 ; 0), B(0 ; 2 ; 0) et C(0 ; 0 ; 3). Donne son équation cartésienne.",
   indice:"Un vecteur normal est AB × AC ; puis n·(M − A) = 0.",
   corrige:"<ol><li>AB = (−1 ; 2 ; 0) et AC = (−1 ; 0 ; 3).</li><li>n = AB × AC = (2×3 − 0×0 ; 0×(−1) − (−1)×3 ; (−1)×0 − 2×(−1)) = (6 ; 3 ; 2).</li><li>Équation : 6x + 3y + 2z = d avec A : 6×1 = 6, donc d = 6.</li><li>Vérification : B : 3×2 = 6 ✓ ; C : 2×3 = 6 ✓.</li><li>Forme « par les axes » : x/1 + y/2 + z/3 = 1.</li></ol>", reponse:"6x + 3y + 2z = 6"},

  {t:"Distance d'un point à un plan", s:3, enonce:"Quelle est la distance du point P(1 ; 2 ; 3) au plan d'équation 2x − y + 2z = 1 ?", choix:["5/3","5","3","5/9"], bonne:0,
   pourquoi:{1:"5 = |2x − y + 2z − 1| : on a oublié de diviser par la norme ‖n‖ = 3.",2:"3 vient d'une erreur de signe : 2 + 2 + 6 − 1 = 9, puis 9/3.",3:"5/9 : on a divisé par ‖n‖² = 9 au lieu de ‖n‖ = 3."},
   corrige:"d = |2×1 − 2 + 2×3 − 1| / √(2² + (−1)² + 2²) = |5| / 3 = 5/3 ≈ 1,67."},

  {t:"Faisceau de radiothérapie", s:4, enonce:"Un faisceau de rayons X suit la droite (x ; y ; z) = (1 ; 2 ; 0) + t(1 ; −1 ; 2) (unités : cm). Il traverse le plan de la peau d'équation 2x + y − z = 7. Détermine le point d'entrée et la longueur de faisceau parcourue entre le point (1 ; 2 ; 0) et ce point.",
   indice:"Remplace x, y, z par leurs expressions en t dans l'équation du plan, puis résous en t.",
   corrige:"<ol><li>x = 1 + t, y = 2 − t, z = 2t.</li><li>2(1 + t) + (2 − t) − 2t = 7 ⇒ 4 − t = 7 ⇒ t = −3.</li><li>Point : (1 − 3 ; 2 + 3 ; −6) = (−2 ; 5 ; −6).</li><li>Vérification : 2(−2) + 5 + 6 = 7 ✓.</li><li>Longueur : |t|·‖d‖ = 3·√(1 + 1 + 4) = 3√6 ≈ 7,35 cm.</li></ol>", reponse:"point (−2 ; 5 ; −6) ; longueur 3√6 ≈ 7,35 cm"},

  {t:"Distance d'un point à une droite", s:4, enonce:"Quelle est la distance du point P(2 ; 1 ; 4) à la droite passant par A(0 ; 0 ; 1) de vecteur directeur d = (1 ; 2 ; 2) ?", choix:["√26/3 ≈ 1,70","√26 ≈ 5,10","26/3 ≈ 8,67","√14 ≈ 3,74"], bonne:0,
   pourquoi:{1:"√26 = ‖AP × d‖ : on a oublié de diviser par ‖d‖ = 3.",2:"26/3 : on a oublié la racine sur ‖AP × d‖.",3:"√14 = ‖AP‖ est la distance AP, pas la distance à la droite (c'est une borne supérieure)."},
   corrige:"<ol><li>AP = (2 ; 1 ; 3).</li><li>AP × d = (1×2 − 3×2 ; 3×1 − 2×2 ; 2×2 − 1×1) = (−4 ; −1 ; 3).</li><li>‖AP × d‖ = √(16 + 1 + 9) = √26 et ‖d‖ = 3.</li><li>Distance = √26/3 ≈ 1,70.</li></ol>"},

  {t:"Droites gauches", s:4, enonce:"Soient D₁ : (1 ; 0 ; 0) + s(1 ; 2 ; 0) et D₂ : (0 ; 1 ; 2) + t(0 ; 1 ; 1). Montre que ces droites ne sont ni parallèles ni sécantes, puis calcule leur distance.",
   indice:"Calcule n = d₁ × d₂ et le produit mixte AB·n, avec A ∈ D₁ et B ∈ D₂. Distance = |AB·n| / ‖n‖.",
   corrige:"<ol><li>d₁ = (1 ; 2 ; 0) et d₂ = (0 ; 1 ; 1) ne sont pas proportionnels : pas parallèles.</li><li>n = d₁ × d₂ = (2×1 − 0×1 ; 0×0 − 1×1 ; 1×1 − 2×0) = (2 ; −1 ; 1).</li><li>AB = (0 − 1 ; 1 − 0 ; 2 − 0) = (−1 ; 1 ; 2) et AB·n = −2 − 1 + 2 = −1 ≠ 0.</li><li>Si les droites étaient sécantes, AB serait dans le plan engendré par d₁ et d₂, donc orthogonal à n : ici ce n'est pas le cas, elles sont <b>gauches</b>.</li><li>Distance = |AB·n|/‖n‖ = 1/√6 ≈ 0,41.</li></ol>", reponse:"droites gauches ; distance 1/√6 ≈ 0,41"},

  {t:"Volume d'un tétraèdre", s:5, enonce:"Une tumeur est modélisée par le tétraèdre ABCD avec A(1 ; 1 ; 0), B(3 ; 1 ; 1), C(2 ; 4 ; 1) et D(2 ; 2 ; 5) (unités : cm). Calcule son volume, l'aire de la face ABC et la hauteur issue de D.",
   indice:"V = |(AB × AC)·AD| / 6 ; aire(ABC) = ½‖AB × AC‖ ; V = ⅓ × aire × hauteur.",
   corrige:"<ol><li>AB = (2 ; 0 ; 1), AC = (1 ; 3 ; 1), AD = (1 ; 1 ; 5).</li><li>AB × AC = (0×1 − 1×3 ; 1×1 − 2×1 ; 2×3 − 0×1) = (−3 ; −1 ; 6).</li><li>Produit mixte : (AB × AC)·AD = −3 − 1 + 30 = 26. Volume V = 26/6 = 13/3 ≈ 4,33 cm³.</li><li>Aire de ABC : ½√(9 + 1 + 36) = √46/2 ≈ 3,39 cm².</li><li>Hauteur : h = 3V/aire = 13/(√46/2) = 26/√46 ≈ 3,83 cm. (C'est aussi la distance de D au plan ABC : |26|/√46.)</li></ol>", reponse:"V = 13/3 ≈ 4,33 cm³ ; aire ≈ 3,39 cm² ; h ≈ 3,83 cm"},

  {t:"Produits scalaire et vectoriel nuls", s:5, enonce:"Soient u et v deux vecteurs non nuls de l'espace. Que peut-on dire si u·v = 0 et u × v = 0 simultanément ?", choix:["u et v sont orthogonaux","u et v sont parallèles","Cette situation est impossible","u = v"], bonne:2,
   pourquoi:{0:"u·v = 0 donne l'orthogonalité, mais u × v = 0 impose aussi le parallélisme : les deux ensemble sont incompatibles.",1:"u × v = 0 donne le parallélisme, mais alors u·v = ±‖u‖‖v‖ ≠ 0.",3:"Si u = v, alors u × v = 0 mais u·v = ‖u‖² ≠ 0."},
   corrige:"Identité de Lagrange : ‖u × v‖² + (u·v)² = ‖u‖²‖v‖² (car ‖u‖²‖v‖²sin²θ + ‖u‖²‖v‖²cos²θ). Si u·v = 0 et u × v = 0, le membre de gauche vaut 0, donc ‖u‖‖v‖ = 0 : un des vecteurs serait nul. Pour deux vecteurs non nuls, c'est impossible."}
]);
