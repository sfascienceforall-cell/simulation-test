/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n’est repris d’un examen.
   Ils s’ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c01", [
 {t:"Cellules semblables (QCM)", s:1, enonce:"Comment appelle-t-on un ensemble de cellules semblables qui remplissent la même fonction, comme les cellules musculaires d’un muscle ?", choix:["Un tissu","Un organe","Un organite","Un appareil"], bonne:0,
  pourquoi:{1:"Un organe (l’estomac par exemple) est formé de plusieurs tissus différents.",2:"Un organite est une structure à l’intérieur d’une cellule (mitochondrie, noyau) : c’est un niveau plus petit que la cellule.",3:"Un appareil réunit plusieurs organes qui coopèrent (appareil digestif)."},
  corrige:"Niveaux emboîtés : molécule → organite → cellule → tissu → organe → appareil → organisme. Un ensemble de cellules semblables forme un tissu ✓."},
 {t:"Changer d’objectif (QCM)", s:3, enonce:"Avec l’oculaire ×10, on passe de l’objectif ×10 à l’objectif ×40. Que devient le diamètre du champ observé ?", choix:["Il est multiplié par 4 : on voit plus de cellules.","Il est divisé par 4 : on voit moins de cellules, mais plus en détail.","Il est divisé par 16.","Il ne change pas : seul le grossissement change."], bonne:1,
  pourquoi:{0:"Grossir davantage resserre le champ : on voit une zone plus petite, donc moins de cellules.",2:"C’est l’aire du champ qui est divisée par 4² = 16 ; le diamètre, une longueur, n’est divisé que par 4.",3:"Le diamètre du champ est inversement proportionnel au grossissement de l’objectif : il change."},
  corrige:"Le grossissement de l’objectif est multiplié par 40 ÷ 10 = 4 ; le diamètre du champ, inversement proportionnel, est divisé par 4. Exemple : 1,8 mm ÷ 4 = 0,45 mm ✓."}
]);
SFA.exos("c02", [
 {t:"Organite de la cellule musculaire (QCM)", s:1, enonce:"Une cellule musculaire consomme beaucoup d’ATP. Quel organite y est particulièrement abondant ?", choix:["Le chloroplaste","L’appareil de Golgi","La mitochondrie","La vacuole"], bonne:2,
  pourquoi:{0:"Les chloroplastes réalisent la photosynthèse ; ils n’existent pas dans les cellules animales.",1:"Le Golgi abonde dans les cellules sécrétrices (pancréas), qui emballent et exportent des protéines.",3:"Une grande vacuole caractérise les cellules végétales ; elle ne fabrique pas d’ATP."},
  corrige:"Une cellule est riche en organites utiles à sa fonction. Les mitochondries produisent l’ATP par respiration cellulaire : une cellule musculaire en contient de très nombreuses ✓."},
 {t:"Capacité aérobie réduite (QCM)", s:3, enonce:"Dans le modèle du cours (capacité aérobie = 100 × part de mitochondries × part saines), une personne n’a que 70 % du nombre normal de mitochondries, dont 30 % sont défaillantes. Quelle est sa capacité aérobie ?", choix:["21","40","49","70"], bonne:2,
  pourquoi:{0:"21 = 100 × 0,70 × 0,30 : on a utilisé la part défaillante au lieu de la part saine (0,70).",1:"40 = 70 − 30 : on a soustrait des pourcentages au lieu de multiplier par la part saine.",3:"70 tient compte du nombre de mitochondries mais oublie que 30 % sont défaillantes."},
  corrige:"Part saine = 1 − 0,30 = 0,70. Capacité = 100 × 0,70 × 0,70 = 49. Contrôle : 49 % des mitochondries normales fonctionnent, soit 70 % de 70 % ✓."}
]);
SFA.exos("c03", [
 {t:"Le transport qui coûte de l’ATP (QCM)", s:1, enonce:"Lequel de ces passages à travers la membrane consomme de l’ATP ?", choix:["La diffusion du dioxygène à travers la bicouche","L’osmose de l’eau","L’entrée du glucose par un transporteur, dans le sens de son gradient","Le rejet du Na⁺ hors de la cellule par la pompe Na⁺/K⁺"], bonne:3,
  pourquoi:{0:"La diffusion est passive : les particules vont du plus concentré vers le moins concentré, sans énergie.",1:"L’osmose est la diffusion de l’eau : elle est passive.",2:"La diffusion facilitée suit le gradient : elle utilise une protéine mais ne coûte pas d’ATP."},
  corrige:"Seul le transport actif, contre le gradient, consomme de l’ATP. La pompe Na⁺/K⁺ rejette le Na⁺ (12 mmol/L dedans, 145 dehors) contre son gradient grâce à l’ATP ✓."},
 {t:"Feuille dans l’eau distillée (QCM)", s:3, enonce:"Une cellule de feuille est placée dans de l’eau distillée (milieu hypotonique). Que lui arrive-t-il ?", choix:["Elle devient turgescente : l’eau entre, mais la paroi l’empêche d’éclater.","Elle éclate, comme un globule rouge.","Elle se plasmolyse : l’eau sort.","Rien : l’eau ne traverse pas la membrane d’une cellule végétale."], bonne:0,
  pourquoi:{1:"Une cellule animale éclate ; la cellule végétale, elle, est protégée par sa paroi de cellulose.",2:"La plasmolyse se produit dans un milieu hypertonique, où l’eau sort.",3:"La membrane laisse passer l’eau facilement, chez les végétaux comme chez les animaux."},
  corrige:"Dans un milieu hypotonique, l’eau entre par osmose vers le milieu le plus concentré (la cellule). La vacuole gonfle et presse la paroi : la cellule devient turgescente sans éclater ✓."}
]);
SFA.exos("c04", [
 {t:"Que représente Km ? (QCM)", s:2, enonce:"Dans la relation v = V<sub>max</sub> · [S] ÷ (K<sub>m</sub> + [S]), que représente K<sub>m</sub> ?", choix:["La vitesse maximale de la réaction","La concentration de substrat pour laquelle v = V<sub>max</sub> / 2","La concentration de substrat pour laquelle v = V<sub>max</sub>","La quantité d’enzyme présente"], bonne:1,
  pourquoi:{0:"La vitesse maximale, c’est V<sub>max</sub>. K<sub>m</sub> est une concentration, pas une vitesse.",2:"v n’atteint jamais tout à fait V<sub>max</sub> : il faudrait une concentration infinie de substrat.",3:"La quantité d’enzyme fixe V<sub>max</sub> (proportionnelle), pas K<sub>m</sub>."},
  corrige:"Si [S] = K<sub>m</sub> : v = V<sub>max</sub> · K<sub>m</sub> ÷ (2 K<sub>m</sub>) = V<sub>max</sub> / 2. Exemple : K<sub>m</sub> = 5 mmol/L, V<sub>max</sub> = 80 → v(5) = 40 µmol/min ✓."},
 {t:"Glucose libéré par la lactase (QCM)", s:4, enonce:"La lactase coupe 1 lactose + 1 H₂O en 1 glucose + 1 galactose. On digère complètement 6,84 g de lactose (M = 342 g/mol). Quelle masse de glucose obtient-on (M = 180 g/mol) ?", choix:["6,84 g","3,42 g","7,2 g","3,6 g"], bonne:3,
  pourquoi:{0:"La masse ne se conserve pas d’une seule molécule à l’autre : il faut passer par les moles (n = m ÷ M).",1:"3,42 g = 6,84 ÷ 2 : on a partagé la masse entre les deux produits au lieu de raisonner en moles.",2:"7,2 g suppose que 1 lactose donne 2 glucoses ; il donne 1 glucose et 1 galactose."},
  corrige:"n(lactose) = 6,84 ÷ 342 = 0,020 mol. Rapport 1 : 1 → n(glucose) = 0,020 mol ; m = 0,020 × 180 = 3,6 g. Contrôle : glucose + galactose = 7,2 g = 6,84 g + eau (0,020 × 18 = 0,36 g) ✓."}
]);
SFA.exos("c05", [
 {t:"Pourquoi les feuilles sont vertes (QCM)", s:1, enonce:"Pourquoi les feuilles nous paraissent-elles vertes ?", choix:["Parce que la chlorophylle absorbe surtout le vert.","Parce que le vert est la couleur la plus efficace pour la photosynthèse.","Parce que la chlorophylle absorbe surtout le bleu-violet et le rouge, et absorbe peu le vert, qui est renvoyé vers nos yeux.","Parce que les feuilles fabriquent de la lumière verte."], bonne:2,
  pourquoi:{0:"Une couleur absorbée n’arrive pas à nos yeux : on voit la couleur qui est renvoyée, pas celle qui est absorbée.",1:"C’est l’inverse : le vert est peu utilisé (Engelmann : peu de bactéries dans le vert).",3:"Les feuilles ne produisent pas de lumière : elles en absorbent une partie et réfléchissent le reste."},
  corrige:"La chlorophylle absorbe surtout le bleu-violet (≈ 430-450 nm) et le rouge (≈ 660-680 nm). Elle réfléchit le vert, d’où la couleur des feuilles ✓."},
 {t:"Le point de compensation (QCM)", s:3, enonce:"Au point de compensation, l’échange net de O₂ d’une feuille est nul. Que se passe-t-il à ce moment ?", choix:["La plante ne fait ni photosynthèse ni respiration.","La photosynthèse s’arrête et seule la respiration continue.","La plante respire seulement la nuit, donc rien n’est mesuré le jour.","La photosynthèse produit autant de O₂ que la respiration en consomme."], bonne:3,
  pourquoi:{0:"Les deux processus continuent : un bilan nul ne veut pas dire qu’il ne se passe rien.",1:"Si seule la respiration continuait, l’échange net serait négatif (consommation de O₂), comme dans l’obscurité.",2:"Idée fausse : la plante respire jour et nuit ; le jour, la photosynthèse masque la respiration."},
  corrige:"Photosynthèse brute = échange net + respiration. Au point de compensation, échange net = 0, donc photosynthèse brute = respiration. Exemple du cours : à 10 % d’éclairement, net = 0 et brute = respiration = 2 µmol/m²/s ✓."}
]);
SFA.exos("c06", [
 {t:"D’où vient le CO₂ rejeté ? (QCM)", s:2, enonce:"Au cours de la respiration cellulaire, d’où proviennent les atomes de carbone du CO₂ rejeté ?", choix:["Du glucose, dont le carbone est libéré au cycle de Krebs","Du dioxygène consommé, qui se transforme en CO₂","De l’air inspiré, qui contient déjà du CO₂","De l’ATP, qui libère du carbone en se dégradant"], bonne:0,
  pourquoi:{1:"Le dioxygène ne contient pas de carbone : il est réduit en eau à la fin de la chaîne respiratoire.",2:"L’air inspiré ne contient que 0,04 % de CO₂ : le CO₂ rejeté est fabriqué par les cellules.",3:"L’ATP est hydrolysé en ADP + Pi : il ne libère pas de CO₂."},
  corrige:"Le carbone du CO₂ vient du glucose : le pyruvate est oxydé dans la matrice et son carbone part en CO₂ (cycle de Krebs). Le O₂ n’est consommé qu’à la fin, où il devient H₂O ✓."},
 {t:"Fermenter pour autant d’ATP (QCM)", s:3, enonce:"La respiration rapporte environ 30 ATP par glucose, la fermentation 2. Pour obtenir la même quantité d’ATP, combien de fois plus de glucose une cellule qui fermente doit-elle consommer ?", choix:["2 fois","15 fois","28 fois","60 fois"], bonne:1,
  pourquoi:{0:"2 est le nombre d’ATP de la fermentation par glucose, pas le rapport entre les deux voies.",2:"28 = 30 − 2 : c’est la différence d’ATP par glucose ; il faut le rapport.",3:"60 = 30 × 2 : il faut diviser 30 par 2, pas multiplier."},
  corrige:"Rapport = 30 ÷ 2 = 15. Contrôle par les rendements : 30 × 30,5 = 915 kJ (≈ 32 %) contre 2 × 30,5 = 61 kJ (≈ 2 %) par mole de glucose, et 915 ÷ 61 = 15 ✓."}
]);
SFA.exos("c07", [
 {t:"Un processus d’anabolisme (QCM)", s:1, enonce:"Lequel de ces processus fait partie de l’anabolisme ?", choix:["La respiration cellulaire du glucose","La formation de glycogène à partir de glucose","La fermentation lactique","L’hydrolyse de l’ATP en ADP + Pi"], bonne:1,
  pourquoi:{0:"La respiration dégrade le glucose et libère de l’énergie : c’est du catabolisme.",2:"La fermentation dégrade le glucose : c’est du catabolisme.",3:"L’hydrolyse de l’ATP libère de l’énergie ; elle n’est pas une construction de molécule."},
  corrige:"Anabolisme = construction de molécules, qui consomme de l’ATP (synthèse de protéines, photosynthèse, formation de glycogène). Catabolisme = dégradation qui libère de l’énergie. La formation de glycogène est donc de l’anabolisme ✓."},
 {t:"Énergie d’une collation (QCM)", s:2, enonce:"Une collation contient 40 g de glucides et 20 g de lipides. On prend 17 kJ/g pour les glucides et 37 kJ/g pour les lipides. Quelle énergie apporte-t-elle ?", choix:["1 020 kJ","1 420 kJ","1 820 kJ","2 220 kJ"], bonne:1,
  pourquoi:{0:"1 020 = 60 × 17 : toute la masse a été comptée à 17 kJ/g, alors que les lipides apportent 37 kJ/g.",2:"1 820 = 40 × 37 + 20 × 17 : les valeurs énergétiques des glucides et des lipides ont été inversées.",3:"2 220 = 60 × 37 : toute la masse a été comptée comme des lipides."},
  corrige:"Glucides : 40 × 17 = 680 kJ ; lipides : 20 × 37 = 740 kJ ; total = 1 420 kJ (≈ 339 kcal). Contrôle : 1 420 ÷ 4,184 ≈ 339 kcal ✓."}
]);
SFA.exos("c08", [
 {t:"Qu’est-ce qu’un gène ? (QCM)", s:1, enonce:"Quelle définition d’un gène est correcte ?", choix:["Un chromosome entier","Une protéine fabriquée par le ribosome","Une portion d’ADN qui porte une information, souvent celle d’une protéine","Une paire de chromosomes homologues"], bonne:2,
  pourquoi:{0:"Un chromosome est une molécule d’ADN très compactée qui porte de nombreux gènes.",1:"La protéine est le produit d’un gène, pas le gène lui-même.",3:"Une paire de chromosomes porte de très nombreux gènes, en deux exemplaires."},
  corrige:"Un gène est une portion d’ADN qui code une information (souvent une protéine). Un chromosome est une molécule d’ADN compactée avec des protéines, qui porte de nombreux gènes ✓."},
 {t:"Chargaff à l’envers (QCM)", s:2, enonce:"Dans un ADN double brin, 18 % des bases sont des guanines (G). Quel est le pourcentage d’adénines (A) ?", choix:["18 %","32 %","64 %","82 %"], bonne:1,
  pourquoi:{0:"%A = %G n’est pas une règle : A s’apparie avec T, G avec C.",2:"64 % est la somme A + T ; il faut la partager entre A et T.",3:"82 % = 100 − 18 : on a oublié que C représente aussi 18 % et que A + T se partagent le reste."},
  corrige:"%G = %C = 18 %, donc G + C = 36 %. A + T = 64 %, et %A = %T = 32 %. Contrôle : 32 + 32 + 18 + 18 = 100 % ✓."}
]);
SFA.exos("c09", [
 {t:"Où se fait la transcription ? (QCM)", s:1, enonce:"Chez une cellule eucaryote, où se déroulent la transcription et la traduction ?", choix:["Transcription dans le cytoplasme, traduction dans le noyau","Les deux dans le noyau","Les deux dans les mitochondries","Transcription dans le noyau, traduction sur les ribosomes du cytoplasme"], bonne:3,
  pourquoi:{0:"C’est l’inverse : l’ADN est dans le noyau, où il est transcrit ; l’ARNm sort vers les ribosomes.",1:"Les ribosomes, qui traduisent, sont dans le cytoplasme (libres ou sur le réticulum).",2:"Les mitochondries produisent l’ATP ; ce n’est pas le lieu de l’expression des gènes du noyau."},
  corrige:"Transcription : dans le noyau, l’ARN polymérase copie le brin matrice en ARNm. Traduction : l’ARNm sort par les pores et est lu par les ribosomes du cytoplasme ✓."},
 {t:"Un codon stop qui apparaît (QCM)", s:3, enonce:"Au milieu de la région codante d’un ARNm, le codon AAA (Lys) devient UAA à la suite d’une substitution. Comment classer cette mutation et quelle est sa conséquence ?", choix:["Non-sens : la traduction s’arrête à ce codon, la protéine est raccourcie.","Silencieuse : la protéine est identique.","Faux-sens : la lysine est remplacée par un autre acide aminé.","Décalage du cadre de lecture : tous les codons suivants changent."], bonne:0,
  pourquoi:{1:"UAA ne code aucun acide aminé : c’est un codon stop, la protéine ne peut pas rester identique.",2:"Un faux-sens remplace un acide aminé par un autre ; UAA n’apporte aucun acide aminé.",3:"Une substitution remplace une base par une autre : le nombre de bases ne change pas, le cadre est conservé."},
  corrige:"UAA est un codon stop. La mutation est non-sens : la traduction s’arrête là et la protéine est raccourcie, souvent inactive ✓."}
]);
SFA.exos("c10", [
 {t:"Pendant l’anaphase (QCM)", s:1, enonce:"Que se passe-t-il pendant l’anaphase de la mitose ?", choix:["Les chromosomes se condensent et l’enveloppe du noyau disparaît.","Les chromosomes s’alignent au centre de la cellule.","Les chromatides sœurs se séparent et migrent vers les pôles opposés.","Deux noyaux se reforment autour des chromosomes."], bonne:2,
  pourquoi:{0:"C’est la prophase.",1:"C’est la métaphase (plaque équatoriale).",3:"C’est la télophase."},
  corrige:"Anaphase : les chromatides sœurs se séparent et migrent vers les pôles ; chaque chromatide devient un chromosome. Ordre : prophase → métaphase → anaphase → télophase ✓."},
 {t:"Une cure d’antimitotique (QCM)", s:3, enonce:"Dans le modèle du cours, une cure détruit une fraction g × E des cellules, où g est la part de cellules en cycle et E = dose ÷ (dose + 10). À la dose 90, quelle part des cellules d’une tumeur où g = 0,6 survit à une cure ?", choix:["54 %","46 %","10 %","40 %"], bonne:1,
  pourquoi:{0:"54 % = g × E = 0,6 × 0,9 : c’est la part détruite, pas la part qui survit.",2:"10 % = 1 − E : on a oublié que seules les cellules en cycle (g = 0,6) sont touchées.",3:"40 % = 1 − g : ce sont les cellules hors cycle, mais une partie des cellules en cycle survit aussi."},
  corrige:"E = 90 ÷ (90 + 10) = 0,9. Survie = 1 − g × E = 1 − 0,6 × 0,9 = 1 − 0,54 = 0,46, soit 46 %. Contrôle : 40 % hors cycle + 10 % des 60 % en cycle (6 %) = 46 % ✓."}
]);
