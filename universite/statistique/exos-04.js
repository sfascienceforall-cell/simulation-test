/* Biostatistique BA1 · chapitre 4 : lois binomiale, de Poisson et normale · exercices */
SFA.exos("c04", [
  {t:"Probabilité binomiale", s:1, enonce:"Dans une fratrie de 4 enfants dont les deux parents sont porteurs sains d'une maladie récessive, chaque enfant a une probabilité 1/4 d'être atteint (enfants indépendants). Calcule la probabilité qu'exactement 2 enfants soient atteints.",
   indice:"P(X = k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ, avec n = 4, k = 2, p = 1/4.",
   corrige:"<ol><li>C(4, 2) = 6.</li><li>(1/4)² = 1/16 ; (3/4)² = 9/16.</li><li>P(X = 2) = 6 × 1/16 × 9/16 = 54/256 = 0,211.</li></ol>", reponse:"54/256 ≈ 0,211"},

  {t:"Probabilité de Poisson", s:1, enonce:"Une boîte de culture contient en moyenne 2 colonies, nombre qu'on modélise par une loi de Poisson. Quelle est la probabilité qu'une boîte ne contienne aucune colonie ?",
   indice:"P(X = k) = e^(−λ) · λᵏ / k! ; pour k = 0, λ⁰/0! = 1.",
   corrige:"<ol><li>λ = 2, k = 0.</li><li>P(X = 0) = e⁻² × 2⁰/0! = e⁻² = 0,135.</li></ol>", reponse:"e⁻² ≈ 0,135"},

  {t:"Quelle loi ?", s:1, enonce:"On suit 20 patients traités ; chacun guérit avec une probabilité 0,7, indépendamment des autres. Le nombre de patients guéris suit :",
   choix:["une loi de Poisson de paramètre 14","une loi binomiale B(20 ; 0,7)","une loi normale exacte N(14 ; 4,2)","une loi uniforme sur {0, 1, …, 20}"], bonne:1,
   pourquoi:{0:"Poisson modélise un comptage sans maximum, pour des événements rares. Ici le nombre de patients est borné par 20 et connu.",2:"La normale est continue ; elle ne peut au mieux qu'approcher la binomiale (ici np = 14 et n(1 − p) = 6, l'approximation est possible mais pas exacte).",3:"Toutes les valeurs ne sont pas équiprobables : 14 guérisons est bien plus probable que 0."},
   corrige:"Nombre fixe d'épreuves indépendantes (n = 20), chacune avec deux issues et la même probabilité de succès (0,7) : c'est la définition de la loi binomiale B(20 ; 0,7). E(X) = 14 et Var(X) = 20 × 0,7 × 0,3 = 4,2."},

  {t:"Espérance et variance binomiales", s:2, enonce:"Sur 40 patients, chacun a une probabilité 0,15 de présenter un effet indésirable. Soit X le nombre de patients touchés. Donne la loi de X, E(X), Var(X) et σ.",
   indice:"E(X) = np ; Var(X) = np(1 − p).",
   corrige:"<ol><li>X suit B(40 ; 0,15).</li><li>E(X) = 40 × 0,15 = 6.</li><li>Var(X) = 40 × 0,15 × 0,85 = 5,1.</li><li>σ = √5,1 = 2,26.</li></ol>En moyenne 6 patients sont touchés, avec une fluctuation typique d'environ ± 2.", reponse:"E(X) = 6 ; Var(X) = 5,1 ; σ ≈ 2,26"},

  {t:"Aire sous la normale", s:2, enonce:"La glycémie à jeun d'une population suit N(95 ; 10²) (mg/dL). Quelle proportion a une glycémie inférieure à 110 mg/dL ? supérieure à 110 ?",
   indice:"z = (x − μ)/σ, puis lis Φ(z) dans la table.",
   corrige:"<ol><li>z = (110 − 95)/10 = 1,5.</li><li>P(X < 110) = Φ(1,5) = 0,9332.</li><li>P(X > 110) = 1 − 0,9332 = 0,0668.</li></ol>", reponse:"93,3 % en dessous ; 6,7 % au-dessus"},

  {t:"Règle 68–95–99,7", s:2, enonce:"Un dosage suit approximativement une loi normale de moyenne 80 et d'écart-type 5. Quelle proportion des valeurs se situe environ entre 70 et 90 ?",
   choix:["≈ 68 %","≈ 95 %","≈ 99,7 %","≈ 50 %"], bonne:1,
   pourquoi:{0:"68 % correspond à μ ± 1σ, soit 75 à 85.",2:"99,7 % correspond à μ ± 3σ, soit 65 à 95.",3:"50 % est la proportion au-dessus (ou en dessous) de la moyenne."},
   corrige:"70 = 80 − 2×5 et 90 = 80 + 2×5 : l'intervalle est μ ± 2σ, qui contient environ 95 % des valeurs (plus précisément 95,4 % ; l'intervalle à 95 % exact est μ ± 1,96σ)."},

  {t:"Poisson : au moins deux", s:3, enonce:"Un échantillon d'eau contient en moyenne 3,2 bactéries par mL (loi de Poisson). Quelle est la probabilité de trouver au moins 2 bactéries dans 1 mL ?",
   indice:"Passe par l'événement contraire : P(X ≥ 2) = 1 − P(0) − P(1).",
   corrige:"<ol><li>P(0) = e⁻³·² = 0,0408.</li><li>P(1) = e⁻³·² × 3,2 = 0,1304.</li><li>P(X ≥ 2) = 1 − 0,0408 − 0,1304 = 0,8288.</li></ol>", reponse:"≈ 0,829"},

  {t:"Intervalle normal", s:3, enonce:"L'hémoglobine d'un groupe de femmes suit N(140 ; 12²) (g/L). Quelle proportion a une hémoglobine comprise entre 120 et 160 g/L ?",
   indice:"Standardise les deux bornes. Elles sont symétriques autour de la moyenne.",
   corrige:"<ol><li>z₁ = (120 − 140)/12 = −1,67 ; z₂ = (160 − 140)/12 = +1,67.</li><li>P = Φ(1,67) − Φ(−1,67) = 2Φ(1,67) − 1.</li><li>Avec la table : Φ(1,67) = 0,9525, donc P ≈ 0,905 (valeur exacte 0,904 avec z = 5/3).</li></ol>Environ 90 % des femmes de ce groupe sont dans cet intervalle.", reponse:"≈ 0,90"},

  {t:"Quelle approximation ?", s:3, enonce:"Soit X le nombre d'événements indésirables sur n = 200 patients, chacun ayant p = 0,02 de risque (indépendants). Quelle approximation de la loi de X est adaptée ?",
   choix:["La normale N(4 ; 3,92), car n est grand","La loi de Poisson de paramètre 4 ; la normale est inadaptée car np = 4 < 5","Aucune approximation n'est possible","La loi de Poisson de paramètre 200"], bonne:1,
   pourquoi:{0:"n grand ne suffit pas : np = 4 est petit, la loi est nettement asymétrique et la normale fonctionne mal.",2:"Poisson est justement conçue pour ce cas : n grand, p petit.",3:"Le paramètre de Poisson est λ = np = 4, pas n."},
   corrige:"n = 200 est grand et p = 0,02 est petit : B(200 ; 0,02) ≈ Poisson(λ = np = 4). La règle usuelle de l'approximation normale (np ≥ 5 et n(1 − p) ≥ 5) n'est pas satisfaite : np = 4."},

  {t:"Normale et correction de continuité", s:4, enonce:"Dans un essai, 100 patients reçoivent un traitement ; chacun répond avec une probabilité 0,3. Estime P(X ≤ 35) par l'approximation normale avec correction de continuité. Compare avec l'approximation sans correction (0,862) et la valeur exacte (0,884). Les conditions de l'approximation sont-elles remplies ?",
   indice:"Moyenne np ; variance np(1 − p). Avec la correction, remplace 35 par 35,5.",
   corrige:"<ol><li>np = 30 ≥ 5 et n(1 − p) = 70 ≥ 5 : conditions remplies.</li><li>Variance : 100 × 0,3 × 0,7 = 21 ; σ = 4,58.</li><li>Avec correction : z = (35,5 − 30)/4,58 = 1,20 ; Φ(1,20) = 0,885.</li><li>Sans correction : z = (35 − 30)/4,58 = 1,09 ; Φ = 0,862.</li><li>Valeur exacte (binomiale) : 0,884. La correction ramène l'erreur de 0,022 à environ 0,001.</li></ol>", reponse:"≈ 0,885 (exacte 0,884)"},

  {t:"Poisson et sommes", s:4, enonce:"Une plaque de culture contient en moyenne 2 colonies (Poisson). On prépare 3 plaques indépendantes. Quelle est la probabilité qu'aucune des 3 plaques ne contienne de colonie ?",
   choix:["e⁻² ≈ 0,135","3 e⁻² ≈ 0,406","e⁻⁶ ≈ 0,0025","e^(−2/3) ≈ 0,513"], bonne:2,
   pourquoi:{0:"C'est la probabilité qu'une seule plaque soit vide. Pour que les 3 le soient, il faut multiplier les probabilités.",1:"Tu as additionné au lieu de multiplier (et on dépasserait vite 1) : « et » pour des événements indépendants se traduit par un produit.",3:"Le paramètre λ des 3 plaques réunies vaut 2 × 3 = 6, pas 2/3."},
   corrige:"Deux voies équivalentes : (1) indépendance : (e⁻²)³ = e⁻⁶ ; (2) la somme de 3 Poisson indépendantes de moyenne 2 suit Poisson(6), donc P(0) = e⁻⁶ = 0,00248."},

  {t:"Intervalle de référence et panel d'analyses", s:4, enonce:"Une glycémie à jeun suit N(90 ; 8²) mg/dL chez les sujets sains. L'intervalle de référence est l'intervalle central à 95 %. (a) Calcule ses bornes. (b) Quelle proportion de sujets sains est hors intervalle ? (c) Un bilan contient 10 analyses indépendantes, chacune avec un intervalle à 95 % : quelle est la probabilité qu'un sujet sain ait au moins une valeur « anormale » ? Conclusion ?",
   indice:"Intervalle à 95 % : μ ± 1,96σ. Pour (c), raisonne par l'événement contraire.",
   corrige:"<ol><li>(a) 90 ± 1,96 × 8 = 90 ± 15,7 : de 74,3 à 105,7 mg/dL.</li><li>(b) Par construction, 5 % des sujets sains sont hors intervalle (2,5 % de chaque côté).</li><li>(c) P(aucune valeur anormale) = 0,95¹⁰ = 0,599. P(au moins une) = 1 − 0,599 = 0,401.</li><li>Environ 4 sujets sains sur 10 auront au moins une valeur « anormale » : un résultat isolé hors norme n'est pas forcément pathologique. (Hypothèse d'indépendance simplificatrice : en réalité les analyses sont souvent corrélées.)</li></ol>", reponse:"74,3 à 105,7 mg/dL ; 5 % ; ≈ 40 %"},

  {t:"Marqueur continu et dépistage", s:5, enonce:"Un marqueur biologique suit N(5 ; 1²) chez les sujets sains et N(7 ; 1²) chez les malades. Le test est positif si la valeur dépasse 6. (a) Calcule la sensibilité et la spécificité. (b) La prévalence est de 10 % : calcule la VPP et la VPN. (c) On abaisse le seuil à 5,5 : recalcule Se, Sp et VPP. Interprète.",
   indice:"Se = P(X > seuil | malade), Sp = P(X < seuil | sain). Standardise avec la moyenne du groupe concerné.",
   corrige:"<ol><li>(a) Se = P(N(7 ; 1) > 6) = P(Z > −1) = Φ(1) = 0,841. Sp = P(N(5 ; 1) < 6) = Φ(1) = 0,841.</li><li>(b) Sur 1 000 personnes : malades 100, VP = 84,1, FN = 15,9 ; sains 900, VN = 757,2, FP = 142,8. VPP = 84,1/(84,1 + 142,8) = 0,371 ; VPN = 757,2/(757,2 + 15,9) = 0,979.</li><li>(c) Seuil 5,5 : Se = P(Z > −1,5) = Φ(1,5) = 0,933 ; Sp = Φ(0,5) = 0,691. VP = 93,3 ; FP = 900 × 0,309 = 277,6 ; VPP = 93,3/370,9 = 0,252.</li><li>Abaisser le seuil gagne 9 points de sensibilité mais fait chuter la spécificité de 15 points et la VPP de 37 % à 25 % : à prévalence faible, ce sont les faux positifs qui dominent. Le seuil dépend du coût d'un faux négatif par rapport à celui d'un faux positif.</li></ol>", reponse:"Se = Sp = 84,1 % ; VPP ≈ 37 %, VPN ≈ 98 % ; seuil 5,5 : Se 93,3 %, Sp 69,1 %, VPP ≈ 25 %"},

  {t:"Événement rare : binomiale, Poisson ou normale ?", s:5, enonce:"Un événement indésirable survient chez 1 % des patients. Sur 400 patients indépendants, soit X le nombre de cas. Quelle affirmation est correcte ?",
   choix:["La normale N(4 ; 3,96) est l'approximation de référence car n = 400 est grand","Poisson(4) approche bien X : P(X = 0) ≈ e⁻⁴ ≈ 0,018, proche de la valeur exacte 0,99⁴⁰⁰ ≈ 0,0180, et variance ≈ moyenne","P(X = 0) = 0,99 car le risque individuel est de 1 %","P(X = 0) est quasi nulle car on attend 4 cas"], bonne:1,
   pourquoi:{0:"np = 4 < 5 : la loi est asymétrique et la normale donnerait une courbe symétrique, avec des valeurs négatives possibles pour un comptage.",2:"0,99 est la probabilité qu'un seul patient n'ait pas l'événement ; pour 400 patients, on prend 0,99⁴⁰⁰.",3:"Un nombre moyen de 4 cas n'interdit pas 0 cas : P(X = 0) ≈ 1,8 %, faible mais pas nulle."},
   corrige:"X suit B(400 ; 0,01) : E(X) = 4 et Var(X) = 400 × 0,01 × 0,99 = 3,96 ≈ E(X), signature d'une loi de Poisson. Valeurs : P(X = 0) = 0,99⁴⁰⁰ = 0,01795 (exact) contre e⁻⁴ = 0,01832 (Poisson). La normale est inadaptée car np = 4 < 5."}
]);
