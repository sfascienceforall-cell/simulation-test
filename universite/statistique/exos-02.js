/* Biostatistique BA1 · chapitre 2 : probabilités · exercices */
SFA.exos("c02", [
  {t:"Événements incompatibles", s:1, enonce:"A et B sont deux événements incompatibles, avec P(A) = 0,30 et P(B) = 0,50. Que vaut P(A ∪ B) ?",
   choix:["0,15","0,20","0,65","0,80"], bonne:3,
   pourquoi:{0:"C'est le produit P(A)·P(B), valable pour des événements indépendants et pour une intersection, pas pour une union.",1:"Tu as calculé 0,50 − 0,30. Une union ne se calcule pas par différence.",2:"C'est P(A) + P(B) − P(A)·P(B), la formule des événements indépendants. Ici ils sont incompatibles : P(A ∩ B) = 0."},
   corrige:"Incompatibles signifie P(A ∩ B) = 0. Donc P(A ∪ B) = P(A) + P(B) − 0 = 0,30 + 0,50 = 0,80."},

  {t:"Fréquence relative", s:1, enonce:"Sur 400 patients traités par un médicament, 38 présentent un effet indésirable. Quelle est la fréquence relative de cet effet ? Que peux-tu dire de la probabilité qu'un nouveau patient le présente ?",
   indice:"Fréquence relative = effectif de l'événement ÷ effectif total.",
   corrige:"<ol><li>f = 38 / 400 = 0,095, soit 9,5 %.</li><li>Cette fréquence est une <b>estimation</b> de la probabilité : elle se rapproche de la vraie probabilité quand l'effectif augmente (loi des grands nombres), mais elle n'est pas égale à la probabilité.</li></ol>", reponse:"f = 0,095 (9,5 %) : estimation de la probabilité"},

  {t:"Équiprobabilité", s:1, enonce:"Un portoir contient 10 échantillons : 3 positifs et 7 négatifs. On en prend un au hasard. Calcule la probabilité qu'il soit positif, puis qu'il soit négatif.",
   indice:"Cas favorables ÷ cas possibles.",
   corrige:"<ol><li>P(positif) = 3/10 = 0,3.</li><li>P(négatif) = 7/10 = 0,7 = 1 − 0,3 (événement contraire).</li></ol>", reponse:"0,3 et 0,7"},

  {t:"Règle de l'addition", s:2, enonce:"Dans une population, 40 % des personnes sont atteintes d'une affection A, 25 % d'une affection B, et 10 % des deux. Calcule P(A ∪ B), P(ni A ni B) et P(A seule). A et B sont-elles indépendantes ?",
   indice:"P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
   corrige:"<ol><li>P(A ∪ B) = 0,40 + 0,25 − 0,10 = 0,55.</li><li>P(ni A ni B) = 1 − 0,55 = 0,45.</li><li>P(A seule) = P(A) − P(A ∩ B) = 0,40 − 0,10 = 0,30.</li><li>Indépendance : P(A)·P(B) = 0,40 × 0,25 = 0,10 = P(A ∩ B). Oui, A et B sont indépendantes.</li></ol>", reponse:"0,55 ; 0,45 ; 0,30 ; indépendantes"},

  {t:"Probabilités conditionnelles", s:2, enonce:"Sur 200 patients, 80 sont fumeurs et 120 non-fumeurs. Une toux chronique est présente chez 36 fumeurs et 18 non-fumeurs. Calcule P(toux), P(toux | fumeur), P(fumeur | toux).",
   indice:"P(A | B) = P(A ∩ B) / P(B), ou « effectif de A et B ÷ effectif de B ».",
   corrige:"<ol><li>Toux totale : 36 + 18 = 54, donc P(toux) = 54/200 = 0,27.</li><li>P(toux | fumeur) = 36/80 = 0,45.</li><li>P(fumeur | toux) = 36/54 = 0,667.</li><li>Les deux probabilités conditionnelles sont différentes : l'ordre des conditions compte.</li></ol>", reponse:"0,27 ; 0,45 ; 0,667"},

  {t:"Indépendance", s:2, enonce:"On sait que P(A) = 0,4, P(B) = 0,5 et P(A ∩ B) = 0,2. Quelle conclusion est correcte ?",
   choix:["A et B sont incompatibles","A et B sont indépendants car P(A ∩ B) = P(A)·P(B)","A et B sont dépendants car P(A ∩ B) ≠ 0","A et B sont dépendants car P(A ∪ B) = 0,7 ≠ P(A) + P(B)"], bonne:1,
   pourquoi:{0:"Incompatibles = P(A ∩ B) = 0. Ici l'intersection vaut 0,2.",2:"Une intersection non nulle ne prouve pas la dépendance : deux événements indépendants de probabilités non nulles ont une intersection non nulle.",3:"P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0,7 est tout à fait normal ; ce n'est pas un critère d'indépendance."},
   corrige:"P(A)·P(B) = 0,4 × 0,5 = 0,2 = P(A ∩ B) : A et B sont indépendants. De façon équivalente, P(A | B) = 0,2/0,5 = 0,4 = P(A)."},

  {t:"Tirages sans remise", s:3, enonce:"Une boîte contient 5 tubes positifs et 3 négatifs. On prélève deux tubes successivement sans remise. Calcule P(2 positifs), P(1 positif et 1 négatif, dans n'importe quel ordre) et P(2 négatifs). Compare P(2 positifs) avec le cas avec remise.",
   indice:"Dessine l'arbre : au deuxième tirage, la composition de la boîte a changé.",
   corrige:"<ol><li>P(2 positifs) = 5/8 × 4/7 = 20/56 = 5/14 = 0,357.</li><li>P(+ puis −) = 5/8 × 3/7 = 15/56 ; P(− puis +) = 3/8 × 5/7 = 15/56. Total : 30/56 = 15/28 = 0,536.</li><li>P(2 négatifs) = 3/8 × 2/7 = 6/56 = 3/28 = 0,107.</li><li>Contrôle : 20/56 + 30/56 + 6/56 = 1.</li><li>Avec remise : P(2 positifs) = (5/8)² = 25/64 = 0,391, plus grand : sans remise, le premier tube positif retiré rend le deuxième moins probable.</li></ol>", reponse:"0,357 ; 0,536 ; 0,107 (avec remise : 0,391)"},

  {t:"Probabilités totales", s:3, enonce:"Deux laboratoires analysent les prélèvements d'un hôpital : le laboratoire A en traite 60 % avec 2 % d'erreurs, le laboratoire B en traite 40 % avec 5 % d'erreurs. Un prélèvement est choisi au hasard. (a) Quelle est la probabilité qu'il ait fait l'objet d'une erreur ? (b) Sachant qu'il y a eu une erreur, quelle est la probabilité qu'elle vienne du laboratoire B ?",
   indice:"Décompose P(erreur) selon le laboratoire : P(E) = P(A)·P(E | A) + P(B)·P(E | B).",
   corrige:"<ol><li>P(E ∩ A) = 0,60 × 0,02 = 0,012 ; P(E ∩ B) = 0,40 × 0,05 = 0,020.</li><li>P(E) = 0,012 + 0,020 = 0,032 (3,2 %).</li><li>P(B | E) = P(E ∩ B)/P(E) = 0,020/0,032 = 0,625.</li><li>Le laboratoire B traite 40 % des prélèvements mais produit 62,5 % des erreurs.</li></ol>", reponse:"P(E) = 0,032 ; P(B | E) = 0,625"},

  {t:"Au moins un", s:3, enonce:"Cinq patients indépendants reçoivent un même traitement, chacun ayant une probabilité 0,2 de présenter une réaction allergique. Quelle est la probabilité qu'au moins un des cinq réagisse ?",
   choix:["1,000 (5 × 0,2)","0,672","0,328","0,200"], bonne:1,
   pourquoi:{0:"On ne peut pas additionner des probabilités d'événements qui ne sont pas incompatibles : plusieurs patients peuvent réagir à la fois (et on dépasserait 1 avec plus de 5 patients).",2:"0,8⁵ = 0,328 est la probabilité qu'aucun ne réagisse, pas qu'au moins un réagisse.",3:"C'est la probabilité pour un seul patient."},
   corrige:"Passer par l'événement contraire : P(aucun ne réagit) = 0,8⁵ = 0,32768 (indépendance). P(au moins un) = 1 − 0,32768 = 0,672."},

  {t:"Fratrie et maladie récessive", s:4, enonce:"Deux parents sont hétérozygotes (Aa) pour une maladie autosomique récessive : seul le génotype aa est atteint. (a) Quelle est la probabilité qu'un enfant soit atteint ? (b) Dans une famille de 3 enfants, quelle est la probabilité qu'exactement un soit atteint ? qu'au moins un soit atteint ? (c) Un enfant n'est pas atteint : quelle est la probabilité qu'il soit porteur (Aa) ?",
   indice:"Génotypes possibles de l'enfant : AA, Aa, aA, aa, équiprobables. Pour (b), compte les arrangements de la position de l'enfant atteint.",
   corrige:"<ol><li>(a) Les 4 combinaisons AA, Aa, aA, aa sont équiprobables : P(atteint) = 1/4.</li><li>(b) Exactement un atteint : 3 positions possibles × (1/4) × (3/4)² = 3 × 9/64 = 27/64 = 0,422.</li><li>Au moins un : 1 − P(aucun) = 1 − (3/4)³ = 1 − 27/64 = 37/64 = 0,578.</li><li>(c) P(Aa | non atteint) = P(Aa ∩ non atteint)/P(non atteint) = (1/2)/(3/4) = 2/3.</li></ol>", reponse:"(a) 1/4 ; (b) 27/64 ≈ 0,42 et 37/64 ≈ 0,58 ; (c) 2/3"},

  {t:"Donneurs universels", s:4, enonce:"On suppose, par simplification, que le groupe ABO et le facteur Rhésus sont indépendants, avec P(groupe O) = 0,45 et P(Rh −) = 0,15. (a) Quelle est la probabilité qu'un donneur soit O négatif ? (b) Parmi 10 donneurs indépendants, quelle est la probabilité d'avoir au moins un donneur O négatif ? (c) Combien de donneurs faut-il pour que cette probabilité dépasse 90 % ?",
   indice:"(c) Résous 1 − (1 − p)ⁿ > 0,9, c'est-à-dire (1 − p)ⁿ < 0,1, avec des logarithmes.",
   corrige:"<ol><li>(a) Indépendance : P(O et Rh −) = 0,45 × 0,15 = 0,0675.</li><li>(b) P(aucun O −) = (1 − 0,0675)¹⁰ = 0,9325¹⁰ = 0,497. P(au moins un) = 1 − 0,497 = 0,503.</li><li>(c) n·ln(0,9325) < ln(0,1), soit n > ln(0,1)/ln(0,9325) = (−2,3026)/(−0,06989) = 32,9. Il faut au moins n = 33 donneurs (pour n = 32 on trouve 0,893 ; pour n = 33, 0,900).</li></ol>", reponse:"(a) 0,0675 ; (b) ≈ 0,50 ; (c) 33 donneurs"},

  {t:"Symptôme et maladie : l'ordre compte", s:4, enonce:"Dans un échantillon de 1 000 personnes, 100 sont malades (M). Un symptôme S est présent chez 90 des malades et chez 180 des 900 personnes non malades. Quelle affirmation est correcte ?",
   choix:["P(M | S) = 0,90","P(S | M) = 0,90 et P(M | S) = 1/3","P(M | S) = 0,09","P(S | M) = 1/3 et P(M | S) = 0,90"], bonne:1,
   pourquoi:{0:"Tu as confondu P(M | S) avec P(S | M). Parmi les malades, 90 % ont S ; parmi ceux qui ont S, la fraction de malades est autre.",2:"0,09 = 90/1000 est P(M ∩ S), une probabilité jointe, pas une probabilité conditionnelle.",3:"C'est exactement l'inverse : P(S | M) = 90/100 et P(M | S) = 90/270."},
   corrige:"P(S | M) = 90/100 = 0,90. Les personnes qui ont S sont 90 + 180 = 270 ; parmi elles 90 sont malades : P(M | S) = 90/270 = 1/3. Un symptôme très fréquent chez les malades peut rester peu spécifique de la maladie."},

  {t:"Consultations : distribution et espérance", s:5, enonce:"Dans une clinique, le nombre X de consultations annuelles de 500 patients se répartit ainsi : 0 : 100 patients ; 1 : 150 ; 2 : 125 ; 3 : 75 ; 4 : 50. (a) Donne la distribution de fréquences, calcule E(X) et Var(X). (b) Calcule P(X ≥ 3) et P(X ≥ 3 | X ≥ 1). (c) La direction prévoit 1 000 nouveaux patients : combien de consultations prévoir et que dire de la fiabilité de cette prévision ?",
   indice:"E(X) = Σ x·P(x) ; Var(X) = E(X²) − E(X)².",
   corrige:"<ol><li>(a) Fréquences : 0,20 ; 0,30 ; 0,25 ; 0,15 ; 0,10. E(X) = 0·0,2 + 1·0,3 + 2·0,25 + 3·0,15 + 4·0,10 = 1,65. E(X²) = 0,3 + 1,0 + 1,35 + 1,6 = 4,25 ; Var(X) = 4,25 − 1,65² = 4,25 − 2,7225 = 1,5275 ; σ = 1,24.</li><li>(b) P(X ≥ 3) = 0,15 + 0,10 = 0,25. P(X ≥ 1) = 0,80, donc P(X ≥ 3 | X ≥ 1) = 0,25/0,80 = 0,3125.</li><li>(c) 1 000 × 1,65 = 1 650 consultations en moyenne.</li><li>Les fréquences d'un échantillon de 500 sont des estimations des probabilités : elles comportent une incertitude (de l'ordre de ± 4 points pour une fréquence de 0,25, voir chapitre 5) et supposent que les nouveaux patients ressemblent aux anciens. La prévision est un ordre de grandeur, pas une valeur exacte.</li></ol>", reponse:"E(X) = 1,65 ; Var(X) ≈ 1,53 ; P(X ≥ 3) = 0,25 ; P(X ≥ 3 | X ≥ 1) = 0,3125 ; ≈ 1 650 consultations"},

  {t:"Quatre enfants sains, et le cinquième ?", s:5, enonce:"Deux parents, connus pour être hétérozygotes (Aa) pour une maladie récessive, ont déjà quatre enfants non atteints. Une cinquième grossesse commence. Quelle affirmation est correcte ?",
   choix:["La probabilité que cet enfant soit atteint est supérieure à 1/4 : la loi des grands nombres « rattrape » le déficit","La probabilité est exactement 1/4 : les transmissions sont indépendantes ; en revanche, la probabilité d'avoir 4 enfants sains puis un enfant atteint est ≈ 7,9 %","La probabilité est (3/4)⁴ × 1/4 ≈ 7,9 %","La probabilité est inférieure à 1/4 : le risque s'épuise quand les enfants sains s'accumulent"], bonne:1,
   pourquoi:{0:"Erreur du joueur : la loi des grands nombres porte sur des fréquences pour n très grand, elle ne corrige pas les écarts passés.",2:"Tu as calculé la probabilité de la séquence entière (4 sains puis 1 atteint), pas la probabilité du 5e enfant sachant les quatre premiers.",3:"Erreur symétrique : l'« épuisement du risque » n'existe pas pour des événements indépendants."},
   corrige:"Chaque transmission est indépendante des autres (génotypes parentaux connus) : P(5e atteint | 4 premiers sains) = P(5e atteint) = 1/4. La probabilité de la séquence « 4 sains puis 1 atteint » vaut (3/4)⁴ × (1/4) = 0,079 : c'est une probabilité <b>jointe</b>, calculée avant d'avoir observé quoi que ce soit. Conditionner sur ce qui s'est déjà produit ramène à 1/4."}
]);
