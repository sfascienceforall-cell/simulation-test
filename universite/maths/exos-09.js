/* Mathématiques BA1 · chapitre 9 : applications linéaires, valeurs et vecteurs propres · exercices */
SFA.exos("c09", [
  {t:"Une dilatation", s:1, enonce:"Écris la matrice de l'application linéaire qui multiplie les abscisses par 3 et les ordonnées par ½, puis calcule l'image du vecteur (2 ; 4).",
   indice:"Les colonnes de la matrice sont les images de e₁ = (1 ; 0) et e₂ = (0 ; 1).",
   corrige:"<ol><li>e₁ = (1 ; 0) devient (3 ; 0) et e₂ = (0 ; 1) devient (0 ; ½).</li><li>La matrice est A = [[3 ; 0] ; [0 ; ½]].</li><li>Image de (2 ; 4) : (3·2 + 0·4 ; 0·2 + ½·4) = (6 ; 2).</li></ol>", reponse:"A = [[3 ; 0] ; [0 ; 0,5]] ; image de (2 ; 4) = (6 ; 2)"},

  {t:"Image d'un vecteur", s:1, enonce:"Soit A = [[2 ; −1] ; [1 ; 3]]. Calcule A·(1 ; 2).",
   indice:"Première composante : ligne 1 de A · (1 ; 2) ; deuxième composante : ligne 2.",
   corrige:"<ol><li>Ligne 1 : 2·1 + (−1)·2 = 0.</li><li>Ligne 2 : 1·1 + 3·2 = 7.</li></ol>", reponse:"(0 ; 7)"},

  {t:"Matrice d'une rotation", s:1, enonce:"Quelle est la matrice de la rotation de 90° dans le sens trigonométrique (anti-horaire) autour de l'origine ?", choix:["[[0 ; −1] ; [1 ; 0]]","[[0 ; 1] ; [−1 ; 0]]","[[−1 ; 0] ; [0 ; −1]]","[[1 ; 0] ; [0 ; −1]]"], bonne:0,
   pourquoi:{1:"C'est la rotation de 90° dans le sens horaire : e₁ serait envoyé sur (0 ; −1).",2:"C'est la rotation de 180° (symétrie centrale).",3:"C'est la réflexion par rapport à l'axe x, pas une rotation."},
   corrige:"Une rotation de 90° anti-horaire envoie e₁ = (1 ; 0) sur (0 ; 1) et e₂ = (0 ; 1) sur (−1 ; 0). Ce sont les colonnes : [[0 ; −1] ; [1 ; 0]]. Cas général : [[cos θ ; −sin θ] ; [sin θ ; cos θ]]."},

  {t:"Valeurs et vecteurs propres", s:2, enonce:"Détermine les valeurs propres et des vecteurs propres associés de A = [[4 ; 1] ; [2 ; 3]].",
   indice:"Résous det(A − λI) = (4 − λ)(3 − λ) − 2 = 0, puis (A − λI)v = 0 pour chaque λ.",
   corrige:"<ol><li>Polynôme caractéristique : λ² − 7λ + 10 = 0 (trace 7, déterminant 10), donc (λ − 5)(λ − 2) = 0 : λ = 5 ou λ = 2.</li><li>Pour λ = 5 : (A − 5I)v = 0 donne −x + y = 0, donc y = x : v₁ = (1 ; 1).</li><li>Pour λ = 2 : 2x + y = 0, donc y = −2x : v₂ = (1 ; −2).</li><li>Vérification : A(1 ; 1) = (5 ; 5) = 5(1 ; 1) ✓ ; A(1 ; −2) = (2 ; −4) = 2(1 ; −2) ✓.</li></ol>", reponse:"λ = 5 avec (1 ; 1) ; λ = 2 avec (1 ; −2)"},

  {t:"Cisaillement puis projection", s:2, enonce:"Soit S = [[1 ; 1] ; [0 ; 1]] (cisaillement) et P = [[1 ; 0] ; [0 ; 0]] (projection sur l'axe x). Calcule PS et SP, et décris en mots ce que fait chacune.",
   indice:"PS signifie « d'abord S, puis P ». Calcule les deux produits ligne par colonne.",
   corrige:"<ol><li>PS = [[1·1 + 0·0 ; 1·1 + 0·1] ; [0 ; 0]] = [[1 ; 1] ; [0 ; 0]] : (x ; y) ↦ (x + y ; 0). On cisaille d'abord (x devient x + y), puis on projette sur l'axe x.</li><li>SP = [[1 ; 0] ; [0 ; 0]] : (x ; y) ↦ (x ; 0). On projette d'abord (y est effacé), le cisaillement n'a plus d'effet.</li><li>PS ≠ SP : l'ordre des transformations compte.</li></ol>", reponse:"PS = [[1 ; 1] ; [0 ; 0]], SP = [[1 ; 0] ; [0 ; 0]] : PS ≠ SP"},

  {t:"Valeurs propres d'une matrice triangulaire", s:2, enonce:"Quelles sont les valeurs propres de A = [[3 ; 5] ; [0 ; −2]] ?", choix:["3 et −2","3 et 5","−2 et 5","1 et −6"], bonne:0,
   pourquoi:{1:"On a lu la première ligne (3 et 5) au lieu de la diagonale.",2:"On a lu la dernière colonne (5 et −2) en confondant avec la diagonale.",3:"1 et −6 sont la trace et le déterminant, pas les valeurs propres."},
   corrige:"det(A − λI) = (3 − λ)(−2 − λ) − 5·0 = (3 − λ)(−2 − λ). Les racines sont 3 et −2 : pour une matrice triangulaire, les valeurs propres se lisent sur la diagonale. Contrôle : somme = 1 = trace, produit = −6 = déterminant."},

  {t:"Diagonaliser et calculer A³", s:3, enonce:"Soit A = [[5 ; −2] ; [−2 ; 2]]. Trouve les valeurs propres, une matrice P et une matrice diagonale D telles que A = PDP⁻¹, puis calcule A³.",
   indice:"Trace 7, déterminant 6. Pour A³, utilise A³ = PD³P⁻¹ avec P⁻¹ = (1/det P)·[[d ; −b] ; [−c ; a]].",
   corrige:"<ol><li>λ² − 7λ + 6 = 0 donne (λ − 1)(λ − 6) = 0 : λ = 6 ou 1.</li><li>λ = 6 : (A − 6I)v = 0 donne −x − 2y = 0, soit v₁ = (2 ; −1). λ = 1 : 4x − 2y = 0, soit v₂ = (1 ; 2).</li><li>P = [[2 ; 1] ; [−1 ; 2]] (colonnes v₁, v₂), D = diag(6 ; 1), det P = 5, P⁻¹ = (1/5)[[2 ; −1] ; [1 ; 2]].</li><li>D³ = diag(216 ; 1). PD³ = [[432 ; 1] ; [−216 ; 2]].</li><li>A³ = PD³P⁻¹ = (1/5)[[432·2 + 1·1 ; −432 + 2] ; [−216·2 + 2·1 ; 216 + 4]] = (1/5)[[865 ; −430] ; [−430 ; 220]] = [[173 ; −86] ; [−86 ; 44]].</li></ol>", reponse:"λ = 6 et 1 ; A³ = [[173 ; −86] ; [−86 ; 44]]"},

  {t:"Une maladie en deux états", s:3, enonce:"Chaque mois, 10 % des personnes saines tombent malades et 20 % des malades guérissent. Le vecteur (S ; M) des proportions évolue selon (S ; M)ₙ₊₁ = A·(S ; M)ₙ avec A = [[0,9 ; 0,2] ; [0,1 ; 0,8]]. Trouve les valeurs propres de A, la répartition stationnaire, et dis à quelle vitesse on s'en approche.",
   indice:"La somme S + M vaut 1 : une valeur propre est 1. La répartition stationnaire est le vecteur propre de λ = 1 normalisé (somme = 1).",
   corrige:"<ol><li>Trace 1,7 ; déterminant 0,72 − 0,02 = 0,70. λ² − 1,7λ + 0,7 = 0 donne λ = 1 ou λ = 0,7.</li><li>λ = 1 : (A − I)v = 0 donne −0,1S + 0,2M = 0, soit S = 2M : v = (2 ; 1).</li><li>Normalisé (somme 1) : (2/3 ; 1/3) ≈ (66,7 % ; 33,3 %).</li><li>λ = 0,7 : la composante qui s'éloigne de l'équilibre est multipliée par 0,7 à chaque mois (0,7¹⁰ ≈ 0,028 après 10 mois) : la convergence est rapide.</li></ol>", reponse:"λ = 1 et 0,7 ; répartition stationnaire (2/3 ; 1/3) ; écart multiplié par 0,7 chaque mois"},

  {t:"Valeurs propres de A²", s:3, enonce:"La matrice A (2 × 2) a pour valeurs propres 2 et −3. Quelles sont les valeurs propres de A² ?", choix:["4 et 9","4 et −9","2 et −3","4 et 6"], bonne:0,
   pourquoi:{1:"Le carré d'un réel est positif : (−3)² = 9, pas −9.",2:"Les valeurs propres de A² ne sont pas celles de A : si Av = λv, alors A²v = λ²v.",3:"6 = |2 × (−3)| est le module du déterminant de A, pas une valeur propre de A²."},
   corrige:"Si Av = λv, alors A²v = A(λv) = λ(Av) = λ²v : v reste un vecteur propre, avec la valeur propre λ². Ici 2² = 4 et (−3)² = 9."},

  {t:"Rotation-dilatation", s:4, enonce:"Soit A = [[1 ; −2] ; [2 ; 1]]. Calcule ses valeurs propres, interprète A comme une rotation suivie d'une dilatation (angle et rapport), puis calcule A³·(1 ; 0).",
   indice:"Le polynôme caractéristique est λ² − 2λ + 5. Les valeurs propres complexes 1 ± 2i ont un module et un argument. Multiplier (x + iy) par 1 + 2i revient à appliquer A au vecteur (x ; y).",
   corrige:"<ol><li>Trace 2, déterminant 1 + 4 = 5 : λ² − 2λ + 5 = 0, Δ = 4 − 20 = −16, donc λ = 1 ± 2i.</li><li>Module |1 + 2i| = √5 ≈ 2,236 : rapport de la dilatation. Argument arctan 2 ≈ 63,43° : angle de la rotation. Aucun vecteur réel n'est conservé en direction.</li><li>A agit comme la multiplication par 1 + 2i sur x + iy. Pour (1 ; 0) = 1 : (1 + 2i)³ = (1 + 2i)²(1 + 2i) = (−3 + 4i)(1 + 2i) = −3 − 6i + 4i − 8 = −11 − 2i.</li><li>Donc A³·(1 ; 0) = (−11 ; −2). Contrôle : ‖(−11 ; −2)‖ = √125 = (√5)³ ✓ et l'angle est 3 × 63,43° ≈ 190,3°.</li></ol>", reponse:"λ = 1 ± 2i ; rotation de ≈ 63,4° et dilatation de rapport √5 ; A³(1 ; 0) = (−11 ; −2)"},

  {t:"Déterminant nul", s:4, enonce:"A est une matrice 2 × 2 de déterminant 0. Laquelle de ces affirmations est vraie ?", choix:["0 est une valeur propre de A","0 est la seule valeur propre de A","A est la matrice nulle","A n'est pas diagonalisable"], bonne:0,
   pourquoi:{1:"L'autre valeur propre est égale à la trace de A, qui peut être non nulle (par exemple A = [[1 ; 0] ; [0 ; 0]] a pour valeurs propres 1 et 0).",2:"Beaucoup de matrices non nulles ont un déterminant nul, comme [[1 ; 2] ; [2 ; 4]].",3:"[[1 ; 0] ; [0 ; 0]] a un déterminant nul et est diagonale : déterminant nul n'interdit pas la diagonalisation."},
   corrige:"Le produit des valeurs propres vaut le déterminant : λ₁λ₂ = 0, donc l'une d'elles est 0. Équivalent : det(A − 0·I) = 0, il existe un vecteur v ≠ 0 avec Av = 0, et A n'est pas inversible."},

  {t:"Population à deux classes", s:4, enonce:"Une population compte des jeunes (J) et des adultes (A). À chaque génération : chaque jeune produit 1 jeune, chaque adulte en produit 2, et la moitié des jeunes devient adulte. Les adultes disparaissent après une génération. Matrice L = [[1 ; 2] ; [0,5 ; 0]]. Trouve le taux de croissance à long terme et la répartition jeunes/adultes stable.",
   indice:"Valeur propre dominante : racine positive de det(L − λI) = (1 − λ)(−λ) − 1 = λ² − λ − 1. Le vecteur propre donne la répartition.",
   corrige:"<ol><li>λ² − λ − 1 = 0 donne λ = (1 + √5)/2 ≈ 1,618 (racine dominante) ; l'autre racine ≈ −0,618 est plus petite en module.</li><li>À long terme, la population totale est multipliée par 1,618 à chaque génération : croissance de ≈ 61,8 %.</li><li>Vecteur propre : (1 − λ)J + 2A = 0, donc A = (λ − 1)J/2 ≈ 0,309 J.</li><li>Proportions : J/(J + A) = 1/1,309 ≈ 76,4 % de jeunes et ≈ 23,6 % d'adultes.</li></ol>", reponse:"λ = (1 + √5)/2 ≈ 1,618 (+61,8 % par génération) ; ≈ 76,4 % de jeunes et 23,6 % d'adultes"},

  {t:"Fibonacci et matrices", s:5, enonce:"La suite de Fibonacci vérifie (Fₙ₊₁ ; Fₙ) = M·(Fₙ ; Fₙ₋₁) avec M = [[1 ; 1] ; [1 ; 0]]. Diagonalise M, déduis la limite de Fₙ₊₁/Fₙ, puis estime F₂₀ à l'aide de φⁿ/√5 (φ = valeur propre positive).",
   indice:"Le polynôme caractéristique est λ² − λ − 1. Pour la formule de Binet, écris (F₁ ; F₀) = (1 ; 0) sur la base des vecteurs propres (φ ; 1) et (ψ ; 1).",
   corrige:"<ol><li>det(M − λI) = λ² − λ − 1 : φ = (1 + √5)/2 ≈ 1,618 et ψ = (1 − √5)/2 ≈ −0,618. Vecteurs propres : (φ ; 1) et (ψ ; 1) (car (1 − λ)x + y = 0 et x = λ y).</li><li>(1 ; 0) = (1/√5)·[(φ ; 1) − (ψ ; 1)] puisque φ − ψ = √5. Donc (Fₙ₊₁ ; Fₙ) = Mⁿ(1 ; 0) = (1/√5)[φⁿ(φ ; 1) − ψⁿ(ψ ; 1)], et Fₙ = (φⁿ − ψⁿ)/√5 (formule de Binet).</li><li>Comme |ψ| < 1, ψⁿ → 0 : Fₙ ≈ φⁿ/√5, et Fₙ₊₁/Fₙ → φ ≈ 1,618 (le nombre d'or).</li><li>F₂₀ ≈ φ²⁰/√5 ≈ 15 127,0/2,2361 ≈ 6 765 (la valeur exacte est 6 765, car |ψ²⁰/√5| < 10⁻⁴).</li></ol>", reponse:"Fₙ = (φⁿ − ψⁿ)/√5 ; Fₙ₊₁/Fₙ → φ ≈ 1,618 ; F₂₀ = 6 765"},

  {t:"Limite de Aⁿ", s:5, enonce:"A = PDP⁻¹ avec D = diag(1 ; ½). Que devient Aⁿ quand n tend vers l'infini ?", choix:["La matrice nulle","La projection sur le vecteur propre de valeur propre 1, parallèlement à l'autre vecteur propre","La matrice identité","La limite n'existe pas"], bonne:1,
   pourquoi:{0:"La matrice nulle n'apparaîtrait que si toutes les valeurs propres étaient de module < 1 ; ici λ = 1 est conservée.",2:"L'identité exigerait que (½)ⁿ tende aussi vers 1 ; elle tend vers 0.",3:"Dⁿ = diag(1 ; (½)ⁿ) converge bien vers diag(1 ; 0) : la limite existe."},
   corrige:"Aⁿ = P·diag(1 ; (½)ⁿ)·P⁻¹ tend vers P·diag(1 ; 0)·P⁻¹. Cette matrice laisse fixe le vecteur propre v₁ (λ = 1) et envoie le vecteur v₂ sur 0 : c'est la projection sur la droite de v₁ parallèlement à celle de v₂. Tout point de départ finit par se poser sur la direction de v₁."}
]);
