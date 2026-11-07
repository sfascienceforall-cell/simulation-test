/* Biostatistique BA1 · chapitre 3 : Bayes et tests diagnostiques · exercices */
SFA.exos("c03", [
  {t:"Sensibilité et spécificité", s:1, enonce:"Un test est appliqué à 1 000 personnes. Parmi les 100 malades, il est positif chez 90 (et négatif chez 10). Parmi les 900 non-malades, il est positif chez 90 (et négatif chez 810). Calcule la sensibilité et la spécificité.",
   indice:"Se = vrais positifs / malades ; Sp = vrais négatifs / non-malades.",
   corrige:"<ol><li>Se = VP/(VP + FN) = 90/100 = 0,90.</li><li>Sp = VN/(VN + FP) = 810/900 = 0,90.</li></ol>", reponse:"Se = 90 % ; Sp = 90 %"},

  {t:"Valeurs prédictives", s:1, enonce:"Avec le même tableau (VP = 90, FN = 10, FP = 90, VN = 810), calcule la valeur prédictive positive (VPP) et la valeur prédictive négative (VPN).",
   indice:"VPP : parmi les tests positifs, quelle fraction est malade ? VPN : parmi les négatifs, quelle fraction est saine ?",
   corrige:"<ol><li>Tests positifs : 90 + 90 = 180. VPP = 90/180 = 0,50.</li><li>Tests négatifs : 10 + 810 = 820. VPN = 810/820 = 0,988.</li></ol>Une personne sur deux dont le test est positif n'est pas malade.", reponse:"VPP = 50 % ; VPN ≈ 98,8 %"},

  {t:"Définition de la VPP", s:1, enonce:"Quelle probabilité correspond à la valeur prédictive positive d'un test ?",
   choix:["P(test positif | malade)","P(malade | test positif)","P(test négatif | non malade)","P(non malade | test négatif)"], bonne:1,
   pourquoi:{0:"C'est la sensibilité : on part des malades.",2:"C'est la spécificité : on part des non-malades.",3:"C'est la valeur prédictive négative."},
   corrige:"VPP = P(malade | test positif) : on se place parmi les personnes dont le test est positif et on cherche la fraction de malades. Elle dépend de la prévalence, contrairement à la sensibilité."},

  {t:"VPP en fréquences naturelles", s:2, enonce:"Une maladie touche 2 % de la population. Un test a une sensibilité de 95 % et une spécificité de 98 %. Raisonne sur 10 000 personnes : combien de vrais positifs, de faux positifs, de vrais négatifs, de faux négatifs ? Déduis VPP et VPN.",
   indice:"Commence par séparer les 10 000 personnes en malades et non-malades avec la prévalence.",
   corrige:"<ol><li>Malades : 2 % × 10 000 = 200 ; non-malades : 9 800.</li><li>VP = 0,95 × 200 = 190 ; FN = 10.</li><li>VN = 0,98 × 9 800 = 9 604 ; FP = 196.</li><li>Positifs : 190 + 196 = 386 → VPP = 190/386 = 0,492.</li><li>Négatifs : 9 604 + 10 = 9 614 → VPN = 9 604/9 614 = 0,999.</li></ol>", reponse:"VPP ≈ 49 % ; VPN ≈ 99,9 %"},

  {t:"Rapports de vraisemblance", s:2, enonce:"Un test a une sensibilité de 90 % et une spécificité de 80 %. Calcule RV+ et RV−. Que signifie RV+ = 4,5 ?",
   indice:"RV+ = Se / (1 − Sp) ; RV− = (1 − Se) / Sp.",
   corrige:"<ol><li>RV+ = 0,90/(1 − 0,80) = 0,90/0,20 = 4,5.</li><li>RV− = (1 − 0,90)/0,80 = 0,10/0,80 = 0,125.</li><li>RV+ = 4,5 : un résultat positif est 4,5 fois plus probable chez un malade que chez un non-malade ; la cote de maladie est multipliée par 4,5.</li></ol>", reponse:"RV+ = 4,5 ; RV− = 0,125"},

  {t:"Effet de la prévalence", s:2, enonce:"La sensibilité et la spécificité d'un test sont fixées. La prévalence de la maladie diminue. Que se passe-t-il ?",
   choix:["VPP et VPN augmentent toutes les deux","VPP diminue, VPN augmente","VPP augmente, VPN diminue","La sensibilité diminue, la spécificité augmente"], bonne:1,
   pourquoi:{0:"Quand la maladie raréfie, les faux positifs deviennent relativement plus nombreux : la VPP baisse.",2:"C'est l'inverse : avec peu de malades, un test positif est moins souvent un vrai positif.",3:"Sensibilité et spécificité sont des propriétés du test, elles ne dépendent pas (en principe) de la prévalence."},
   corrige:"Moins de malades : moins de vrais positifs, mais autant de faux positifs (proportionnels aux non-malades). La part de vrais positifs parmi les positifs (VPP) baisse. Les personnes saines étant plus nombreuses, un résultat négatif est plus souvent juste : VPN augmente."},

  {t:"Théorème de Bayes", s:3, enonce:"Une maladie touche 3 personnes sur 1 000. Le test a une sensibilité de 99 % et une spécificité de 99,5 %. Une personne est testée positive. Calcule P(malade | positif) avec la formule de Bayes.",
   indice:"P(M | +) = P(+ | M)·P(M) / [P(+ | M)·P(M) + P(+ | non M)·P(non M)].",
   corrige:"<ol><li>P(M) = 0,003 ; P(non M) = 0,997 ; P(+ | M) = 0,99 ; P(+ | non M) = 1 − 0,995 = 0,005.</li><li>Numérateur : 0,99 × 0,003 = 0,00297.</li><li>P(+) = 0,00297 + 0,005 × 0,997 = 0,00297 + 0,004985 = 0,007955.</li><li>P(M | +) = 0,00297/0,007955 = 0,373.</li></ol>Malgré un excellent test, il y a près de deux chances sur trois que la personne soit saine.", reponse:"≈ 0,37 (37 %)"},

  {t:"Nomogramme de Fagan", s:3, enonce:"Un patient a une probabilité pré-test de 20 % pour une maladie. Le test a RV+ = 8 et RV− = 0,2. Quelle est la probabilité post-test si le résultat est positif ? s'il est négatif ?",
   indice:"Passe en cote : cote = p/(1 − p). Cote post-test = cote pré-test × RV. Puis repasse en probabilité : p = cote/(1 + cote).",
   corrige:"<ol><li>Cote pré-test = 0,20/0,80 = 0,25.</li><li>Test positif : cote = 0,25 × 8 = 2 ; p = 2/3 = 0,667 (66,7 %).</li><li>Test négatif : cote = 0,25 × 0,2 = 0,05 ; p = 0,05/1,05 = 0,0476 (4,8 %).</li></ol>", reponse:"66,7 % si positif ; 4,8 % si négatif"},

  {t:"Abaisser le seuil", s:3, enonce:"Un test est positif quand la valeur d'un dosage dépasse un seuil. On abaisse ce seuil de positivité. Quelle est la conséquence ?",
   choix:["La sensibilité augmente et la spécificité diminue","La sensibilité diminue et la spécificité augmente","La sensibilité et la spécificité augmentent","La sensibilité et la spécificité ne changent pas : seule la VPP change"], bonne:0,
   pourquoi:{1:"C'est l'effet d'un relèvement du seuil.",2:"Il n'y a pas de gain gratuit : sur la courbe ROC, on se déplace sur la courbe, on ne la quitte pas.",3:"Le seuil modifie directement la répartition des malades et des sains entre positifs et négatifs, donc Se et Sp."},
   corrige:"Un seuil plus bas classe plus de personnes comme positives : davantage de malades sont détectés (sensibilité ↑) mais aussi davantage de sains classés positifs (spécificité ↓). On se déplace vers le haut et la droite de la courbe ROC."},

  {t:"Dépistage de masse", s:4, enonce:"Un programme dépiste 50 000 personnes pour une maladie de prévalence 0,5 %. Le test a une sensibilité de 92 % et une spécificité de 96 %. (a) Combien de vrais positifs, faux négatifs, faux positifs, vrais négatifs ? (b) Quelle est la VPP ? (c) Combien de faux positifs pour un vrai positif ? (d) Que dire de la VPN ? Quelle suite proposer pour un positif ?",
   indice:"Malades : 0,5 % de 50 000 = 250.",
   corrige:"<ol><li>(a) Malades : 250 ; non-malades : 49 750. VP = 0,92 × 250 = 230 ; FN = 20. VN = 0,96 × 49 750 = 47 760 ; FP = 1 990.</li><li>(b) Positifs : 230 + 1 990 = 2 220. VPP = 230/2 220 = 0,104 (10,4 %).</li><li>(c) 1 990/230 = 8,65 faux positifs pour 1 vrai positif.</li><li>(d) Négatifs : 47 760 + 20 = 47 780. VPN = 47 760/47 780 = 0,9996 : un test négatif est très rassurant.</li><li>Un test positif est un résultat <b>à confirmer</b> par un examen plus spécifique : près de 9 positifs sur 10 sont de faux positifs.</li></ol>", reponse:"VP 230 ; FN 20 ; FP 1 990 ; VN 47 760 ; VPP ≈ 10,4 % ; 8,65 faux positifs par vrai positif ; VPN ≈ 99,96 %"},

  {t:"Un test très bon, une maladie très rare", s:4, enonce:"Une maladie touche 1 personne sur 1 000. Le test a une sensibilité de 99 % et une spécificité de 99 %. Un patient sans symptôme est testé positif. Quelle est la probabilité qu'il soit malade ?",
   choix:["99 %","Environ 9 %","Environ 50 %","1 %"], bonne:1,
   pourquoi:{0:"Tu as confondu la sensibilité P(+ | M) avec la valeur prédictive P(M | +). C'est la négligence du taux de base.",2:"Il faudrait une prévalence de 50 % pour que Se = Sp = 99 % donne une VPP de 99 % ; l'intuition « 50/50 » n'a pas de base ici.",3:"1 % est la proportion de faux positifs parmi les sains (1 − Sp), pas la probabilité d'être malade."},
   corrige:"Sur 100 000 personnes : 100 malades dont 99 positifs ; 99 900 sains dont 999 faux positifs. Positifs : 99 + 999 = 1 098. VPP = 99/1 098 = 0,090. Il y a 10 faux positifs pour 1 vrai positif, car les sains sont 999 fois plus nombreux que les malades."},

  {t:"Répéter le test", s:4, enonce:"Un test (Se = 95 %, Sp = 98 %) est utilisé pour une maladie de prévalence 2 % : un premier résultat positif donne une VPP de 49,2 %. Un deuxième test du même type, indépendant du premier chez les malades comme chez les sains, est fait chez ceux qui sont positifs. Calcule la probabilité d'être malade (a) si le 2e test est positif ; (b) s'il est négatif. (c) Quelle hypothèse est cruciale ?",
   indice:"Après le 1er test positif, la nouvelle « prévalence » est la VPP de 0,492. Applique RV+ ou RV− à la cote.",
   corrige:"<ol><li>RV+ = 0,95/0,02 = 47,5 ; RV− = 0,05/0,98 = 0,0510.</li><li>Cote après le 1er test : 190/196 = 0,969 (VPP = 0,492).</li><li>(a) 2e test positif : 0,969 × 47,5 = 46,0 → p = 46,0/47,0 = 0,979.</li><li>(b) 2e test négatif : 0,969 × 0,0510 = 0,0495 → p = 0,0495/1,0495 = 0,047.</li><li>(c) L'indépendance conditionnelle : si le test se trompe toujours pour la même raison (réaction croisée, même échantillon), le second résultat n'ajoute pas d'information et les probabilités ci-dessus sont trop optimistes.</li></ol>", reponse:"(a) ≈ 97,9 % ; (b) ≈ 4,7 % ; indépendance des erreurs nécessaire"},

  {t:"Deux tests en série ou en parallèle", s:5, enonce:"Deux tests A et B ont chacun Se = 90 % et Sp = 90 % et leurs erreurs sont indépendantes chez les malades et chez les sains. (a) Stratégie en série : on ne déclare « positif » que si A et B sont tous deux positifs. Calcule la sensibilité et la spécificité de la stratégie. (b) Stratégie en parallèle : « positif » si au moins un des deux est positif. Même question. (c) Pour une prévalence de 5 %, calcule la VPP et la VPN dans les deux stratégies. (d) Laquelle choisir pour un dépistage ? pour une confirmation ?",
   indice:"En série : Se = Se² ; Sp = 1 − (1 − Sp)². En parallèle, c'est l'inverse.",
   corrige:"<ol><li>(a) Série : Se = 0,9 × 0,9 = 0,81 ; 1 − Sp = 0,1 × 0,1 = 0,01 donc Sp = 0,99.</li><li>(b) Parallèle : 1 − Se = 0,1 × 0,1 = 0,01 donc Se = 0,99 ; Sp = 0,9 × 0,9 = 0,81.</li><li>(c) Prévalence 5 %. Série : VP = 0,05 × 0,81 = 0,0405 ; FP = 0,95 × 0,01 = 0,0095 ; VPP = 0,0405/0,05 = 0,81. FN = 0,05 × 0,19 = 0,0095 ; VN = 0,95 × 0,99 = 0,9405 ; VPN = 0,9405/0,95 = 0,990.</li><li>Parallèle : VP = 0,05 × 0,99 = 0,0495 ; FP = 0,95 × 0,19 = 0,1805 ; VPP = 0,0495/0,23 = 0,215. FN = 0,05 × 0,01 = 0,0005 ; VN = 0,95 × 0,81 = 0,7695 ; VPN = 0,7695/0,77 = 0,9994.</li><li>(d) Le parallèle (très sensible, VPN ≈ 99,9 %) convient pour écarter une maladie (dépistage) ; la série (très spécifique, VPP 81 %) convient pour confirmer. Ces résultats supposent l'indépendance des erreurs, rarement réalisée en pratique.</li></ol>", reponse:"série : Se 0,81 ; Sp 0,99 ; VPP 81 % ; parallèle : Se 0,99 ; Sp 0,81 ; VPP 21,5 %"},

  {t:"Même test, deux contextes", s:5, enonce:"Un test a Se = 90 % et Sp = 90 %. Il est utilisé dans un service hospitalier spécialisé (30 % de malades parmi les patients testés) puis en médecine générale (3 % de malades). Quelle affirmation est correcte ?",
   choix:["Le test a la même valeur partout : Se, Sp et VPP sont identiques dans les deux contextes","Se et Sp restent identiques, mais la VPP passe d'environ 79 % à l'hôpital à environ 22 % en médecine générale","La sensibilité baisse en médecine générale parce qu'il y a moins de malades","La VPP vaut 90 % dans les deux contextes car VPP = Se"], bonne:1,
   pourquoi:{0:"Se et Sp sont des propriétés du test (en principe), mais pas la VPP.",2:"La sensibilité est conditionnelle aux malades : elle ne dépend pas de leur nombre (sous réserve d'un spectre de gravité comparable).",3:"VPP = P(M | +) et Se = P(+ | M) sont deux probabilités différentes."},
   corrige:"Hôpital (prévalence 0,30) : VP = 0,30 × 0,9 = 0,27 ; FP = 0,70 × 0,1 = 0,07 ; VPP = 0,27/0,34 = 0,794. Médecine générale (0,03) : VP = 0,027 ; FP = 0,97 × 0,1 = 0,097 ; VPP = 0,027/0,124 = 0,218. Un même test a donc une portée très différente selon la population. Autre nuance : le spectre des patients (formes bénignes en médecine générale) peut aussi modifier Se et Sp en pratique."}
]);
