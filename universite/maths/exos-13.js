/* Mathématiques BA1 · chapitre 13 : suites et séries · exercices (valeurs recalculées : work/maths/chap/verif-13.py) */
SFA.exos("c13", [
  {t:"Lire la définition de la convergence", s:1, enonce:"Laquelle de ces phrases traduit exactement « la suite (uₙ) converge vers le réel u » ?",
   choix:["∃N, ∀ε &gt; 0, ∀n ≥ N : |uₙ − u| ≤ ε","∀ε &gt; 0, ∃N, ∀n ≥ N : |uₙ − u| ≤ ε","∀ε &gt; 0, ∀N, ∃n ≥ N : |uₙ − u| ≤ ε","∃ε &gt; 0, ∃N, ∀n ≥ N : |uₙ − u| ≤ ε"], bonne:1,
   pourquoi:{0:"Ici le rang N est choisi avant ε et doit servir pour toutes les tolérances : cela force uₙ = u pour tout n ≥ N (suite constante à partir d'un rang). C'est beaucoup plus fort que converger : 1/n converge vers 0 sans jamais valoir 0.",2:"Cette phrase dit seulement que la suite repasse une infinité de fois près de u, aussi près qu'on veut : u est une valeur d'adhérence. (−1)ⁿ la vérifie avec u = 1 et pourtant ne converge pas.",3:"Avec un seul ε (par exemple ε = 10), cette phrase dit juste que la suite finit par rester dans une bande fixe : c'est une forme de bornitude, pas une convergence. (−1)ⁿ la vérifie avec u = 0 et ε = 1."},
   corrige:"La tolérance ε est imposée d'abord (∀ε &gt; 0) ; ensuite tu as le droit de choisir un rang N qui dépend de ε (∃N) ; enfin, à partir de ce rang, <b>tous</b> les termes sont dans la bande [u − ε ; u + ε] (∀n ≥ N). L'ordre des quantificateurs fait tout le sens de la définition."},

  {t:"Dépasser n'importe quel seuil", s:1, enonce:"Soit uₙ = 2n − 7 (n ≥ 1). (a) À partir de quel rang a-t-on uₙ ≥ 1 000 ? (b) Montre, avec la définition, que uₙ → +∞ : pour un seuil M quelconque, donne un rang N qui convient.",
   indice:"Résous l'inéquation 2n − 7 ≥ M en n, puis prends le premier entier qui convient.",
   corrige:"<ol><li>(a) 2n − 7 ≥ 1 000 ⇔ 2n ≥ 1 007 ⇔ n ≥ 503,5. Le premier entier est n = 504 (u₅₀₄ = 1 001, alors que u₅₀₃ = 999).</li><li>(b) Soit M un réel. 2n − 7 ≥ M ⇔ n ≥ (M + 7)/2. Posons N = ⌈(M + 7)/2⌉ (et N ≥ 1). Pour tout n ≥ N, on a n ≥ (M + 7)/2, donc uₙ ≥ M.</li><li>C'est exactement la définition : ∀M, ∃N, ∀n ≥ N : uₙ ≥ M. Donc uₙ → +∞. Le seuil M est donné d'abord, le rang N est construit ensuite (il dépend de M).</li></ol>", reponse:"(a) N = 504 ; (b) N = ⌈(M + 7)/2⌉ convient pour tout M",
   num:{q:"(a) premier rang N", v:504, u:"", tol:0.0005, p:{"503":"calcul","503.5":"concept"}}},

  {t:"Le rang N pour une tolérance donnée", s:1, enonce:"Soit uₙ = (5n + 3)/n. (a) Quelle est la limite de (uₙ) ? (b) Détermine le plus petit rang N tel que |uₙ − 5| ≤ 0,02 pour tout n ≥ N. (c) Donne N en fonction d'une tolérance ε quelconque.",
   indice:"Simplifie : uₙ = 5 + 3/n. L'écart à la limite est donc 3/n, qui décroît.",
   corrige:"<ol><li>(a) uₙ = 5 + 3/n et 3/n → 0 : la limite est 5.</li><li>(b) |uₙ − 5| = 3/n ≤ 0,02 ⇔ n ≥ 3/0,02 = 150. Comme 3/n décroît, tous les n ≥ 150 conviennent et n = 149 ne convient pas (3/149 ≈ 0,0201). Donc N = 150.</li><li>(c) 3/n ≤ ε ⇔ n ≥ 3/ε : N = ⌈3/ε⌉. Plus ε est petit, plus N est grand : N dépend de ε.</li></ol>", reponse:"limite 5 ; N = 150 ; en général N = ⌈3/ε⌉",
   num:{q:"(b) rang N", v:150, u:"", tol:0.001, p:{"149":"calcul","15":"calcul"}}},

  {t:"Bornée ou convergente ?", s:1, enonce:"Une seule de ces affirmations est vraie pour toute suite réelle. Laquelle ?",
   choix:["Toute suite bornée est convergente.","Toute suite convergente est bornée.","Toute suite croissante est convergente.","Une suite non bornée peut converger vers un réel."], bonne:1,
   pourquoi:{0:"Contre-exemple : (−1)ⁿ est bornée (par 1) mais oscille entre −1 et 1 sans limite. Bornée est nécessaire, pas suffisant.",2:"Contre-exemple : la suite uₙ = n est croissante et tend vers +∞. Il faut ajouter « majorée » (théorème de convergence monotone).",3:"C'est la contraposée du bon énoncé qui est vraie : une suite non bornée ne converge jamais vers un réel."},
   corrige:"Si uₙ → u, la définition avec ε = 1 place tous les termes à partir d'un rang N dans [u − 1 ; u + 1] ; il ne reste que les termes u₁, …, u<sub>N−1</sub>, en nombre fini. Le plus grand de |u| + 1 et des |uᵢ| (i &lt; N) borne toute la suite."},

  {t:"Limite d'un quotient de polynômes", s:2, enonce:"Que vaut lim<sub>n→+∞</sub> (4n² − 3n + 1)/(2n² + 5) ?",
   choix:["2","1/5","+∞","0"], bonne:0,
   pourquoi:{1:"Tu as gardé les termes constants : ce sont les termes de plus haut degré qui dominent quand n devient grand, pas les constantes.",2:"Numérateur et dénominateur tendent tous les deux vers +∞ : c'est la forme indéterminée ∞/∞, qui ne donne pas +∞ automatiquement. Ici les degrés sont égaux.",3:"La limite est 0 quand le degré du dénominateur est plus grand ; ici les deux degrés valent 2."},
   corrige:"On met n² en évidence en haut et en bas : (4 − 3/n + 1/n²)/(2 + 5/n²). Les termes en 1/n et 1/n² tendent vers 0, donc la limite vaut 4/2 = 2 (rapport des coefficients dominants). Contrôle : pour n = 100, on trouve ≈ 1,985."},

  {t:"Majorer pour trouver N", s:2, enonce:"Soit uₙ = (4n + sin n)/(2n). (a) Montre que |uₙ − 2| ≤ 1/(2n) pour tout n ≥ 1. (b) Déduis-en un rang N tel que |uₙ − 2| ≤ 0,001 pour tout n ≥ N. (c) Rédige la preuve de uₙ → 2 avec la définition.",
   indice:"uₙ − 2 = sin(n)/(2n), et |sin n| ≤ 1.",
   corrige:"<ol><li>(a) uₙ − 2 = (4n + sin n − 4n)/(2n) = sin(n)/(2n). Comme |sin n| ≤ 1 : |uₙ − 2| ≤ 1/(2n).</li><li>(b) Il suffit que 1/(2n) ≤ 0,001, c'est-à-dire n ≥ 500. Le rang N = 500 convient. (Le plus petit rang réel est un peu plus petit, 499, car |sin n| &lt; 1 : la majoration n'a pas besoin d'être optimale.)</li><li>(c) Soit ε &gt; 0. Posons N = ⌈1/(2ε)⌉. Pour tout n ≥ N : |uₙ − 2| ≤ 1/(2n) ≤ 1/(2N) ≤ ε. Donc uₙ → 2.</li></ol>", reponse:"|uₙ − 2| ≤ 1/(2n) ; N = 500 ; en général N = ⌈1/(2ε)⌉",
   num:{q:"(b) rang N donné par la majoration", v:500, u:"", tol:0.001, p:{"1000":"calcul","250":"calcul"}}},

  {t:"Une forme ∞ − ∞ avec des racines", s:2, enonce:"Calcule lim<sub>n→+∞</sub> (√(4n² + 12n) − 2n).",
   indice:"Multiplie et divise par la quantité conjuguée √(4n² + 12n) + 2n.",
   corrige:"<ol><li>Les deux termes tendent vers +∞ : forme indéterminée ∞ − ∞.</li><li>Conjugué : (√(4n² + 12n) − 2n)(√(4n² + 12n) + 2n) = 4n² + 12n − 4n² = 12n. Donc uₙ = 12n/(√(4n² + 12n) + 2n).</li><li>On met n en évidence (n &gt; 0) : uₙ = 12/(√(4 + 12/n) + 2) → 12/(2 + 2) = 3.</li></ol>Contrôle : n = 1 000 donne ≈ 2,9978.", reponse:"3",
   num:{q:"limite", v:3, u:"", tol:0.001, p:{"6":"formule","0":"concept"}}},

  {t:"Une inégalité stricte à la limite", s:2, enonce:"On sait que uₙ &lt; vₙ pour tout n, que uₙ → a et que vₙ → b. Que peut-on affirmer à coup sûr ?",
   choix:["a &lt; b","a ≤ b","a = b","Rien du tout : on ne peut pas comparer a et b."], bonne:1,
   pourquoi:{0:"Le passage à la limite ne conserve pas l'inégalité stricte : uₙ = 1/n &lt; vₙ = 2/n pour tout n, et pourtant a = b = 0.",2:"L'égalité n'est pas obligatoire : uₙ = 0 &lt; vₙ = 1 donne a = 0 &lt; b = 1.",3:"On peut comparer : si on avait a &gt; b, les deux bandes autour de a et b finiraient par séparer uₙ (au-dessus) et vₙ (au-dessous), contredisant uₙ &lt; vₙ."},
   corrige:"Une inégalité large ou stricte vraie à partir d'un rang passe à la limite sous forme <b>large</b> : a ≤ b. Les deux cas a &lt; b et a = b sont possibles : 1/n &lt; 2/n donne 0 = 0 à la limite, tandis que 0 &lt; 1 reste 0 &lt; 1."},

  {t:"Étau autour d'un bruit oscillant", s:3, enonce:"Soit uₙ = (2n + 3 cos(n²))/(n + 1). (a) Encadre uₙ par deux suites simples. (b) Déduis-en la limite. (c) À partir de quel rang l'encadrement garantit-il que uₙ ∈ [1,9 ; 2,1] ?",
   indice:"−1 ≤ cos(n²) ≤ 1. Calcule ensuite 2 − (2n − 3)/(n + 1) et (2n + 3)/(n + 1) − 2.",
   corrige:"<ol><li>(a) −1 ≤ cos(n²) ≤ 1 et n + 1 &gt; 0, donc vₙ = (2n − 3)/(n + 1) ≤ uₙ ≤ (2n + 3)/(n + 1) = wₙ.</li><li>(b) vₙ → 2 et wₙ → 2 (rapport des coefficients dominants). Par le théorème de l'étau, uₙ → 2.</li><li>(c) wₙ − 2 = 1/(n + 1) et 2 − vₙ = 5/(n + 1). Il faut 5/(n + 1) ≤ 0,1, soit n + 1 ≥ 50, donc n ≥ 49 (la condition sur wₙ, n ≥ 9, est alors vérifiée). À partir de N = 49, 1,9 ≤ vₙ ≤ uₙ ≤ wₙ ≤ 2,1.</li></ol>Contrôle : v₄₉ = 1,9 et w₄₉ = 2,02.", reponse:"limite 2 ; garanti dès n = 49",
   num:[{q:"(b) limite", v:2, u:"", tol:0.001},{q:"(c) rang N", v:49, u:"", tol:0.001, p:{"50":"calcul","9":"concept"}}]},

  {t:"Une récurrence croissante et majorée", s:3, enonce:"On pose u₁ = 1 et uₙ₊₁ = √(uₙ + 6). (a) Calcule u₂ et u₃. (b) Montre par récurrence que 0 &lt; uₙ &lt; 3 et que la suite est croissante. (c) Déduis-en qu'elle converge et calcule sa limite.",
   indice:"Pour la croissance, compare uₙ₊₁² − uₙ² = uₙ + 6 − uₙ² = (3 − uₙ)(uₙ + 2). Pour la limite, passe à la limite dans la relation.",
   corrige:"<ol><li>(a) u₂ = √7 ≈ 2,646 ; u₃ = √(√7 + 6) ≈ 2,940.</li><li>(b) Majoration : u₁ = 1 &lt; 3 ; si 0 &lt; uₙ &lt; 3, alors uₙ + 6 &lt; 9 donc 0 &lt; uₙ₊₁ &lt; 3. Croissance : uₙ₊₁² − uₙ² = (3 − uₙ)(uₙ + 2) &gt; 0, et les termes sont positifs, donc uₙ₊₁ &gt; uₙ.</li><li>(c) Croissante et majorée par 3 : elle converge vers une limite ℓ ∈ [1 ; 3]. En passant à la limite (la racine est continue) : ℓ = √(ℓ + 6), donc ℓ² − ℓ − 6 = 0, (ℓ − 3)(ℓ + 2) = 0. Comme ℓ ≥ 1, ℓ = 3.</li></ol>", reponse:"u₂ ≈ 2,646 ; u₃ ≈ 2,940 ; limite 3",
   num:[{q:"(a) u₃", v:2.940, u:"", tol:0.002},{q:"(c) limite", v:3, u:"", tol:0.001, p:{"-2":"concept"}}]},

  {t:"Valeurs d'adhérence d'une suite périodique", s:3, enonce:"Soit wₙ = 2 + cos(2nπ/3) (n ≥ 1). (a) Calcule w₁, w₂, w₃ et montre que la suite est bornée. (b) Trouve deux sous-suites de limites différentes et conclus. (c) Avec ε = 0,5, écris pourquoi aucun réel ℓ n'est la limite.",
   indice:"Le cosinus ne dépend que du reste de n dans la division par 3.",
   corrige:"<ol><li>(a) cos(2π/3) = −1/2, cos(4π/3) = −1/2, cos(2π) = 1 : w₁ = w₂ = 1,5 et w₃ = 3, puis le motif se répète. La suite est bornée : 1,5 ≤ wₙ ≤ 3.</li><li>(b) w<sub>3k</sub> = 3 pour tout k (sous-suite constante, limite 3) et w<sub>3k+1</sub> = 1,5 (limite 1,5). Deux sous-suites de limites différentes : (wₙ) diverge. Ses valeurs d'adhérence sont 3 et 1,5 (Bolzano-Weierstrass en garantissait au moins une).</li><li>(c) Négation : il faut ∃ε, ∀N, ∃n ≥ N avec |wₙ − ℓ| &gt; ε. Prends ε = 0,5. Les deux valeurs 3 et 1,5 sont à distance 1,5 ; la bande [ℓ − 0,5 ; ℓ + 0,5], de largeur 1, ne peut pas les contenir toutes les deux. Or, au-delà de n'importe quel rang N, la suite prend encore les deux valeurs : un terme sort toujours de la bande.</li></ol>", reponse:"bornée entre 1,5 et 3 ; valeurs d'adhérence 3 et 1,5 : divergente"},

  {t:"La balle qui rebondit", s:3, enonce:"On lâche une balle d'une hauteur de 2 m. À chaque rebond, elle remonte aux 3/4 de la hauteur précédente. Quelle distance verticale totale parcourt-elle (en supposant une infinité de rebonds) ?",
   indice:"Après la chute initiale, chaque rebond compte deux fois (montée et descente) : 2 + 2·Σ<sub>k≥1</sub> 2·(3/4)ᵏ.",
   corrige:"<ol><li>Chute initiale : 2 m. Le k-ième rebond monte à hₖ = 2·(3/4)ᵏ m puis redescend : il compte 2hₖ.</li><li>Σ<sub>k≥1</sub> 2·(3/4)ᵏ est géométrique de premier terme 2·3/4 = 1,5 et de raison 3/4 &lt; 1 : somme = 1,5/(1 − 3/4) = 6 m.</li><li>Distance totale : 2 + 2 × 6 = 14 m.</li></ol>Contrôle : après 3 rebonds seulement, la balle a déjà parcouru 2 + 2(1,5 + 1,125 + 0,84375) ≈ 8,94 m.", reponse:"14 m",
   num:{q:"distance totale", v:14, u:"m", tol:0.005, p:{"8":"formule","6":"formule","12":"concept"}}},

  {t:"Terme général qui tend vers 0", s:3, enonce:"On sait que aₙ → 0. Que peut-on dire de la série Σ aₙ ?",
   choix:["Elle converge forcément.","Elle diverge forcément.","On ne peut pas conclure : elle peut converger ou diverger.","Sa somme vaut 0."], bonne:2,
   pourquoi:{0:"C'est l'erreur classique : la série harmonique Σ 1/n a un terme qui tend vers 0 et pourtant elle diverge (s<sub>2ᵏ</sub> ≥ 1 + k/2).",1:"Contre-exemple : Σ 1/n² (ou une géométrique de raison 1/2) a un terme qui tend vers 0 et converge.",3:"Ce sont les termes qui tendent vers 0, pas la somme : par exemple Σ<sub>n≥1</sub> (1/2)ⁿ = 1."},
   corrige:"aₙ → 0 est une condition <b>nécessaire</b> de convergence, jamais suffisante. Σ 1/n² converge (vers π²/6) et Σ 1/n diverge, alors que leurs deux termes tendent vers 0. En revanche, si aₙ ne tend pas vers 0, la série diverge à coup sûr."},

  {t:"Deux séries qui divergent", s:4, enonce:"(a) Quelle est la nature de Σ<sub>i≥1</sub> (2i + 1)/(5i − 3) ? (b) Même question pour Σ<sub>i≥1</sub> 1/(3i). (c) Pour la série (b), combien de termes faut-il pour que sₙ dépasse 2 ? Compare au nombre que garantit la preuve par paquets.",
   indice:"(a) Regarde la limite du terme général. (b) sₙ = Hₙ/3 où Hₙ = 1 + 1/2 + … + 1/n. (c) Il faut Hₙ ≥ 6, et les paquets donnent H<sub>2ᵏ</sub> ≥ 1 + k/2.",
   corrige:"<ol><li>(a) (2i + 1)/(5i − 3) → 2/5 ≠ 0 : la condition nécessaire n'est pas remplie, la série diverge (sₙ se comporte comme 0,4n).</li><li>(b) Le terme 1/(3i) tend vers 0 : pas de conclusion directe. Mais sₙ = (1/3)Hₙ et Hₙ → +∞ (série harmonique), donc sₙ → +∞ : la série diverge.</li><li>(c) sₙ ≥ 2 ⇔ Hₙ ≥ 6. Les paquets garantissent H<sub>2ᵏ</sub> ≥ 1 + k/2 ≥ 6 dès k = 10, donc n = 2¹⁰ = 1 024 suffit. En réalité, le calcul donne H₂₂₆ ≈ 5,99996 et H₂₂₇ ≈ 6,0044 : il faut 227 termes. La minoration est grossière, mais elle suffit pour prouver la divergence.</li></ol>", reponse:"(a) diverge (terme → 2/5) ; (b) diverge ; (c) 227 termes (les paquets garantissent 1 024)",
   num:{q:"(c) nombre de termes", v:227, u:"", tol:0.001, p:{"1024":"concept","226":"calcul"}}},

  {t:"Nature de la série des 1/√i", s:4, enonce:"Quelle est la nature de la série Σ<sub>i≥1</sub> 1/√i ?",
   choix:["Elle converge, car 1/√i → 0.","Elle diverge, car 1/√i ≥ 1/i et la série harmonique diverge.","Elle converge par comparaison avec Σ 1/i².","Elle diverge, car son terme général ne tend pas vers 0."], bonne:1,
   pourquoi:{0:"aₙ → 0 ne prouve jamais la convergence : c'est seulement une condition nécessaire.",2:"La comparaison va dans le mauvais sens : 1/√i est plus grand que 1/i², et être au-dessus d'une série convergente ne prouve rien.",3:"Le terme 1/√i tend bien vers 0 : ce test ne permet pas de conclure ici."},
   corrige:"Pour i ≥ 1, √i ≤ i, donc 1/√i ≥ 1/i ≥ 0. Les sommes partielles de Σ 1/√i sont au-dessus de celles de la série harmonique, qui tendent vers +∞. Par le critère de comparaison (termes positifs), Σ 1/√i diverge. C'est le cas p = 1/2 ≤ 1 des séries Σ 1/iᵖ."},

  {t:"Doses répétées d'un médicament", s:4, enonce:"Un patient reçoit 100 mg d'un médicament toutes les 6 h. La demi-vie d'élimination est de 6 h : entre deux prises, la quantité présente est divisée par 2. On note Qₙ la quantité juste après la n-ième prise. (a) Écris Qₙ comme une somme géométrique et calcule-la. (b) Vers quel plateau tend Qₙ ? (c) À partir de quelle prise dépasse-t-on 95 % du plateau ?",
   indice:"Juste après la n-ième prise : la dernière dose vaut 100, la précédente 100·(1/2), etc. Qₙ = 100(1 + 1/2 + … + (1/2)ⁿ⁻¹).",
   corrige:"<ol><li>(a) Qₙ = 100 Σ<sub>k=0</sub><sup>n−1</sup> (1/2)ᵏ = 100 (1 − (1/2)ⁿ)/(1 − 1/2) = 200(1 − 2⁻ⁿ) mg.</li><li>(b) 2⁻ⁿ → 0, donc Qₙ → 200 mg : la série géométrique Σ 100·(1/2)ᵏ converge vers 100/(1 − 1/2) = 200.</li><li>(c) 200(1 − 2⁻ⁿ) ≥ 190 ⇔ 2⁻ⁿ ≤ 0,05 ⇔ 2ⁿ ≥ 20 ⇔ n ≥ log₂ 20 ≈ 4,32. Donc dès la 5e prise : Q₄ = 187,5 mg et Q₅ = 193,75 mg.</li></ol>", reponse:"Qₙ = 200(1 − 2⁻ⁿ) mg ; plateau 200 mg ; dès la 5e prise",
   num:[{q:"(b) plateau", v:200, u:"mg", tol:0.005, p:{"100":"formule"}},{q:"(c) numéro de la prise", v:5, u:"", tol:0.001, p:{"4":"calcul"}}]},

  {t:"Une somme télescopique", s:5, enonce:"Calcule la somme partielle sₙ = Σ<sub>i=1</sub><sup>n</sup> 1/(i(i + 3)), puis la somme de la série Σ<sub>i≥1</sub> 1/(i(i + 3)).",
   indice:"Décompose : 1/(i(i + 3)) = (1/3)(1/i − 1/(i + 3)). Écris les premières lignes et regarde ce qui s'annule.",
   corrige:"<ol><li>1/i − 1/(i + 3) = 3/(i(i + 3)), donc 1/(i(i + 3)) = (1/3)(1/i − 1/(i + 3)).</li><li>Dans Σ<sub>i=1</sub><sup>n</sup> (1/i − 1/(i + 3)), chaque −1/(i + 3) s'annule avec le +1/(i + 3) de la ligne i + 3. Il reste les trois premiers termes positifs et les trois derniers termes négatifs : sₙ = (1/3)(1 + 1/2 + 1/3 − 1/(n + 1) − 1/(n + 2) − 1/(n + 3)).</li><li>Quand n → +∞ : S = (1/3)(1 + 1/2 + 1/3) = (1/3)(11/6) = 11/18 ≈ 0,611.</li></ol>Contrôle : s₁ = 1/4 (= 1/(1·4)) ✓ ; s₂ = 1/4 + 1/10 = 7/20 ✓ ; s₁₀ ≈ 0,527.", reponse:"S = 11/18 ≈ 0,611",
   num:{q:"somme S", v:0.6111, u:"", tol:0.005, p:{"0.3333":"formule","1.8333":"formule","0.25":"concept"}}},

  {t:"La série des 1/i² converge", s:5, enonce:"(a) Montre que pour i ≥ 2, 1/i² ≤ 1/(i − 1) − 1/i. (b) Déduis-en que sₙ = Σ<sub>i=1</sub><sup>n</sup> 1/i² ≤ 2 − 1/n pour tout n ≥ 1. (c) Conclus sur la nature de la série et encadre sa somme.",
   indice:"1/(i − 1) − 1/i = 1/((i − 1)i), et (i − 1)i ≤ i². Pour (b), sépare le terme i = 1 et télescope le reste.",
   corrige:"<ol><li>(a) 1/(i − 1) − 1/i = 1/((i − 1)i). Comme 0 &lt; (i − 1)i &lt; i² pour i ≥ 2, on a 1/i² &lt; 1/((i − 1)i).</li><li>(b) sₙ = 1 + Σ<sub>i=2</sub><sup>n</sup> 1/i² ≤ 1 + Σ<sub>i=2</sub><sup>n</sup> (1/(i − 1) − 1/i) = 1 + (1 − 1/n) = 2 − 1/n (télescopage ; pour n = 1 : s₁ = 1 = 2 − 1).</li><li>(c) Les termes sont positifs, donc (sₙ) est croissante ; elle est majorée par 2. Par le théorème de convergence monotone, la série converge, et sa somme S vérifie 1 &lt; S ≤ 2 (passage à la limite d'une inégalité : large).</li></ol>Pour info : S = π²/6 ≈ 1,645 (résultat d'Euler), et s₁₀ ≈ 1,550.", reponse:"la série converge ; 1 < S ≤ 2 (en fait S = π²/6 ≈ 1,645)"}
]);
