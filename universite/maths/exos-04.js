/* Mathématiques BA1 · chapitre 4 : intégrales · exercices */
SFA.exos("c04", [
  {t:"Primitive d'un polynôme", s:1, enonce:"Détermine la primitive F de f(x) = 3x² − 4x + 5 telle que F(0) = 2.",
   indice:"Primitive terme à terme : ∫xⁿ dx = xⁿ⁺¹/(n + 1). La constante se fixe avec F(0) = 2.",
   corrige:"<ol><li>∫3x² dx = x³ ; ∫−4x dx = −2x² ; ∫5 dx = 5x.</li><li>F(x) = x³ − 2x² + 5x + C.</li><li>F(0) = C = 2.</li></ol>", reponse:"F(x) = x³ − 2x² + 5x + 2"},

  {t:"Intégrale d'un sinus", s:1, enonce:"Que vaut ∫<sub>0</sub><sup>π</sup> sin x dx ?",
   choix:["0","1","2","−2"], bonne:2,
   pourquoi:{0:"Tu as peut-être pensé que sin est « symétrique » sur [0 ; π] et que les aires s'annulent : c'est vrai sur [0 ; 2π], pas sur [0 ; π] où sin ≥ 0.",1:"Tu as évalué la primitive en π seulement (−cos π = 1) en oubliant de soustraire F(0) = −cos 0 = −1.",3:"Erreur de signe : la primitive de sin est −cos, mais F(π) − F(0) = 1 − (−1) = 2, positif car sin ≥ 0."},
   corrige:"Une primitive de sin est F(x) = −cos x. Donc ∫<sub>0</sub><sup>π</sup> sin x dx = F(π) − F(0) = (−cos π) − (−cos 0) = 1 − (−1) = 2. C'est l'aire d'une « arche » de sinus."},

  {t:"Le logarithme comme aire", s:1, enonce:"Calcule ∫<sub>1</sub><sup>e</sup> (1/x) dx et interprète le résultat.",
   indice:"Une primitive de 1/x sur ]0 ; +∞[ est ln x.",
   corrige:"<ol><li>∫<sub>1</sub><sup>e</sup> dx/x = [ln x]<sub>1</sub><sup>e</sup>.</li><li>= ln e − ln 1 = 1 − 0 = 1.</li></ol>Interprétation : l'aire sous l'hyperbole y = 1/x entre 1 et e vaut exactement 1 ; c'est la définition géométrique du nombre e.", reponse:"1"},

  {t:"Intégration par parties", s:2, enonce:"Calcule ∫<sub>0</sub><sup>1</sup> x·eˣ dx.",
   indice:"Pose u = x (qui se simplifie en dérivant) et v′ = eˣ. Formule : ∫u v′ = [u v] − ∫u′ v.",
   corrige:"<ol><li>u = x, u′ = 1 ; v′ = eˣ, v = eˣ.</li><li>∫<sub>0</sub><sup>1</sup> x eˣ dx = [x eˣ]<sub>0</sub><sup>1</sup> − ∫<sub>0</sub><sup>1</sup> eˣ dx.</li><li>= (e − 0) − (e − 1) = 1.</li></ol>Contrôle : une primitive est (x − 1)eˣ, qui vaut 0 en 1 et −1 en 0 ; la différence est bien 1.", reponse:"1"},

  {t:"Changement de variable évident", s:2, enonce:"Quelle est la valeur de ∫<sub>0</sub><sup>1</sup> 2x/(1 + x²) dx ?",
   choix:["2 ln 2","ln 2","1/2","ln 2 − 1"], bonne:1,
   pourquoi:{0:"Tu as multiplié par 2 en reconnaissant 2x : mais 2x est déjà la dérivée de 1 + x², donc la primitive est directement ln(1 + x²) sans facteur supplémentaire.",2:"Tu as intégré le numérateur et le dénominateur séparément ; l'intégrale d'un quotient n'est pas le quotient des intégrales.",3:"Tu as retranché l'intégrale d'une constante (−1) sans raison : F(1) − F(0) = ln 2 − ln 1 = ln 2."},
   corrige:"Avec u = 1 + x², du = 2x dx : ∫ 2x/(1 + x²) dx = ∫ du/u = ln u. Donc ∫<sub>0</sub><sup>1</sup> = [ln(1 + x²)]<sub>0</sub><sup>1</sup> = ln 2 − ln 1 = ln 2 ≈ 0,693."},

  {t:"Aire entre deux courbes", s:2, enonce:"Calcule l'aire du domaine fermé délimité par les courbes y = x et y = x².",
   indice:"Trouve les abscisses d'intersection, puis intègre (courbe du haut) − (courbe du bas).",
   corrige:"<ol><li>x = x² ⇔ x(1 − x) = 0 : x = 0 ou x = 1.</li><li>Sur ]0 ; 1[, x ≥ x² : la droite est au-dessus.</li><li>A = ∫<sub>0</sub><sup>1</sup> (x − x²) dx = [x²/2 − x³/3]<sub>0</sub><sup>1</sup> = 1/2 − 1/3 = 1/6.</li></ol>", reponse:"1/6 ≈ 0,167 unité d'aire"},

  {t:"Substitution avec racine", s:3, enonce:"Calcule I = ∫<sub>0</sub><sup>√3</sup> x/√(1 + x²) dx.",
   indice:"Pose u = 1 + x² et change aussi les bornes.",
   corrige:"<ol><li>u = 1 + x², du = 2x dx donc x dx = du/2.</li><li>Bornes : x = 0 → u = 1 ; x = √3 → u = 4.</li><li>I = ∫<sub>1</sub><sup>4</sup> (1/2)u<sup>−1/2</sup> du = [√u]<sub>1</sub><sup>4</sup> = 2 − 1 = 1.</li></ol>Vérification directe : une primitive de x/√(1 + x²) est √(1 + x²), qui vaut 2 en √3 et 1 en 0.", reponse:"1"},

  {t:"Volume d'un bol", s:3, enonce:"Un bol a la forme obtenue en faisant tourner autour de l'axe Ox l'arc de courbe y = √x, pour x de 0 à 4 (unités : cm). Calcule son volume en cm³ puis en mL.",
   indice:"Méthode des disques : V = π∫[f(x)]² dx. Attention : (√x)² = x.",
   corrige:"<ol><li>V = π∫<sub>0</sub><sup>4</sup> (√x)² dx = π∫<sub>0</sub><sup>4</sup> x dx.</li><li>= π[x²/2]<sub>0</sub><sup>4</sup> = π·8 = 8π.</li><li>8π ≈ 25,1 cm³, et 1 cm³ = 1 mL.</li></ol>", reponse:"V = 8π ≈ 25,1 cm³ ≈ 25,1 mL"},

  {t:"Concentration moyenne", s:3, enonce:"Après une perfusion, la concentration plasmatique vaut C(t) = 8·e<sup>−0,5t</sup> mg/L (t en heures). Quelle est la concentration moyenne entre t = 0 et t = 4 h ?",
   choix:["≈ 13,8 mg/L","≈ 4,54 mg/L","≈ 2,94 mg/L","≈ 3,46 mg/L"], bonne:3,
   pourquoi:{0:"Tu as calculé l'intégrale (l'aire sous la courbe, en mg·h/L) sans la diviser par la durée 4 h.",1:"Tu as pris la moyenne arithmétique de C(0) et C(4) : valable pour une fonction affine, pas pour une exponentielle décroissante (convexe).",2:"Tu as calculé C(2), la valeur au milieu de l'intervalle, et pas la valeur moyenne de la fonction."},
   corrige:"Valeur moyenne = (1/(b − a))∫<sub>a</sub><sup>b</sup> C(t) dt. ∫<sub>0</sub><sup>4</sup> 8e<sup>−0,5t</sup> dt = [−16e<sup>−0,5t</sup>]<sub>0</sub><sup>4</sup> = 16(1 − e<sup>−2</sup>) ≈ 13,83 mg·h/L. On divise par 4 h : C̄ = 4(1 − e<sup>−2</sup>) ≈ 3,46 mg/L."},

  {t:"Double intégration par parties", s:4, enonce:"Calcule J = ∫<sub>0</sub><sup>π</sup> eˣ sin x dx.",
   indice:"Intègre deux fois par parties : l'intégrale de départ réapparaît, tu résous alors une équation en J.",
   corrige:"<ol><li>Première IPP (u = sin x, v′ = eˣ) : J = [eˣ sin x]<sub>0</sub><sup>π</sup> − ∫<sub>0</sub><sup>π</sup> eˣ cos x dx = 0 − K, avec K = ∫ eˣ cos x dx.</li><li>Seconde IPP (u = cos x, v′ = eˣ) : K = [eˣ cos x]<sub>0</sub><sup>π</sup> + ∫<sub>0</sub><sup>π</sup> eˣ sin x dx = (−e<sup>π</sup> − 1) + J.</li><li>Donc J = −K = e<sup>π</sup> + 1 − J, d'où 2J = e<sup>π</sup> + 1.</li></ol>Contrôle numérique : (23,14 + 1)/2 ≈ 12,07.", reponse:"J = (e^π + 1)/2 ≈ 12,07"},

  {t:"Décomposition en fractions partielles", s:4, enonce:"Calcule ∫<sub>2</sub><sup>3</sup> dx/(x² − 1).",
   indice:"x² − 1 = (x − 1)(x + 1) : cherche A et B tels que 1/(x² − 1) = A/(x − 1) + B/(x + 1).",
   corrige:"<ol><li>1 = A(x + 1) + B(x − 1). En x = 1 : 1 = 2A ; en x = −1 : 1 = −2B. Donc A = 1/2 et B = −1/2.</li><li>∫ = (1/2)[ln|x − 1| − ln|x + 1|] = (1/2) ln|(x − 1)/(x + 1)|.</li><li>En 3 : (1/2) ln(2/4) = −(1/2) ln 2 ; en 2 : (1/2) ln(1/3) = −(1/2) ln 3.</li><li>Différence : (1/2)(ln 3 − ln 2) = (1/2) ln(3/2).</li></ol>", reponse:"(1/2) ln(3/2) ≈ 0,203"},

  {t:"Intégrale ou aire ?", s:4, enonce:"Soit f(x) = x³ − x. Quelle est l'aire (géométrique, positive) de la région délimitée par la courbe de f et l'axe Ox entre x = −1 et x = 1 ?",
   choix:["1/2","0","1/4","1"], bonne:0,
   pourquoi:{1:"Tu as calculé ∫<sub>−1</sub><sup>1</sup> f : cette intégrale vaut 0 car f est impaire (aire algébrique), mais une aire géométrique est toujours positive.",2:"Tu as pris l'aire d'un seul des deux morceaux : f change de signe en 0, il y a deux lobes égaux d'aire 1/4 chacun.",3:"Tu as pris 2·∫₀¹ x dx = 2·(1/2) en oubliant le terme −x³ (donc x⁴/4) dans la primitive : l'intégrale de x − x³ vaut 1/2 − 1/4, pas 1/2"},
   corrige:"f(x) = x(x − 1)(x + 1) s'annule en −1, 0, 1. Sur [−1 ; 0], f ≥ 0 ; sur [0 ; 1], f ≤ 0. Par symétrie impaire les deux lobes ont même aire. Aire = 2∫<sub>0</sub><sup>1</sup> (x − x³) dx = 2[x²/2 − x⁴/4]<sub>0</sub><sup>1</sup> = 2(1/2 − 1/4) = 1/2. L'intégrale algébrique, elle, vaut 0 : les deux lobes se compensent."},

  {t:"Pharmacocinétique : AUC et clairance", s:5, enonce:"Après une prise orale (biodisponibilité supposée totale) de 500 mg, la concentration plasmatique est C(t) = 40(e<sup>−0,2t</sup> − e<sup>−1,5t</sup>) mg/L (t en h). Détermine (a) l'instant t<sub>max</sub> du maximum et C<sub>max</sub>, (b) l'aire sous la courbe AUC de 0 à +∞, (c) la clairance CL = Dose/AUC.",
   indice:"(a) C′(t) = 0. (b) ∫<sub>0</sub><sup>∞</sup> e<sup>−kt</sup> dt = 1/k. (c) CL en L/h.",
   corrige:"<ol><li>C′(t) = 40(−0,2e<sup>−0,2t</sup> + 1,5e<sup>−1,5t</sup>) = 0 ⇔ e<sup>1,3t</sup> = 1,5/0,2 = 7,5 ⇔ t<sub>max</sub> = ln 7,5/1,3 ≈ 1,55 h.</li><li>C<sub>max</sub> = C(1,55) ≈ 25,4 mg/L.</li><li>AUC = 40(1/0,2 − 1/1,5) = 40(5 − 0,667) ≈ 173,3 mg·h/L (les deux exponentielles tendent vers 0 : intégrale impropre convergente).</li><li>CL = 500 mg/173,3 mg·h/L ≈ 2,88 L/h.</li></ol>", reponse:"t_max ≈ 1,55 h ; C_max ≈ 25,4 mg/L ; AUC ≈ 173 mg·h/L ; CL ≈ 2,88 L/h"},

  {t:"Volume d'une couronne de révolution", s:5, enonce:"On fait tourner autour de l'axe Ox le domaine fermé compris entre y = x et y = x² (x de 0 à 1). Quel est le volume du solide obtenu ?",
   choix:["π/6","π/30","2π/15","π/36"], bonne:2,
   pourquoi:{0:"Tu as multiplié l'aire du domaine (1/6) par π : le volume de révolution n'est pas π × aire, il faut intégrer les aires de disques de rayons x et x².",1:"Tu as élevé la différence au carré : π∫(x − x²)² dx. Or c'est la différence des carrés π∫(x² − (x²)²) dx qu'il faut intégrer (méthode des rondelles).",3:"Tu as calculé π·(∫(x − x²) dx)² = π/36 : on intègre d'abord les aires π R² − π r², on ne met pas l'intégrale au carré."},
   corrige:"Chaque tranche est une rondelle de rayon extérieur R = x et de rayon intérieur r = x² : aire π(R² − r²) = π(x² − x⁴). V = π∫<sub>0</sub><sup>1</sup> (x² − x⁴) dx = π(1/3 − 1/5) = 2π/15 ≈ 0,419."}
]);
