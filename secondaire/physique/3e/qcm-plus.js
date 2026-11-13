/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n'est repris d'un examen.
   Ils s'ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c01", [
 {t:"Électrons perdus (QCM)", s:2, enonce:"Une sphère métallique neutre perd 2·10<sup>10</sup> électrons (e = 1,6·10<sup>−19</sup> C). Quelle est sa charge ?", choix:["−3,2 nC","+3,2 µC","+3,2 nC","+1,25·10<sup>29</sup> C"], bonne:2,
  pourquoi:{0:"Erreur de signe : perdre des électrons (négatifs) laisse un manque d'électrons, donc une charge positive.",1:"Erreur de conversion : 3,2·10<sup>−9</sup> C, c'est 3,2 nanocoulombs (10<sup>−9</sup>), pas microcoulombs (10<sup>−6</sup>).",3:"Mauvaise formule : on a divisé N par e. La charge vaut q = N·e, un produit."},
  corrige:"|q| = N·e = 2·10<sup>10</sup> × 1,6·10<sup>−19</sup> = 3,2·10<sup>−9</sup> C = 3,2 nC. La sphère a perdu des électrons : elle est positive, q = +3,2 nC. Contrôle : q / e = 3,2·10<sup>−9</sup> / 1,6·10<sup>−19</sup> = 2·10<sup>10</sup> électrons ✓."},
 {t:"Que veut dire « positif » ? (QCM)", s:1, enonce:"Un morceau de verre frotté est chargé positivement. Que s'est-il passé ?", choix:["Il a perdu des électrons","Il a gagné des protons","Il a perdu tous ses électrons","Il a gagné des charges positives venues du chiffon"], bonne:0,
  pourquoi:{1:"Les protons restent dans les noyaux : seuls les électrons passent d'un corps à l'autre.",2:"Il en a perdu seulement quelques-uns : il lui reste énormément d'électrons, mais un peu moins que de protons.",3:"Ce ne sont pas des charges + qui se déplacent : seuls les électrons (négatifs) bougent lors du frottement."},
  corrige:"Seuls les électrons peuvent passer d'un corps à l'autre. Un corps positif a donc un manque d'électrons : le verre en a cédé au chiffon, qui devient négatif. Contrôle : la charge totale verre + chiffon reste nulle (conservation) ✓."}
]);
SFA.exos("c02", [
 {t:"Le symbole de la pile (QCM)", s:1, enonce:"Dans le symbole normalisé d'une pile, on dessine deux barres parallèles de longueurs différentes. Que représente la barre longue ?", choix:["La borne −","La borne +","Le sens des électrons","L'interrupteur intégré à la pile"], bonne:1,
  pourquoi:{0:"Inversion des bornes : c'est la barre courte qui représente la borne −.",2:"Le symbole ne montre pas de sens : les sens (courant, électrons) se dessinent avec des flèches sur les fils.",3:"L'interrupteur a son propre symbole ; les deux barres représentent les deux bornes de la pile."},
  corrige:"Dans le symbole de la pile, la barre longue est la borne + et la barre courte la borne −. Contrôle : le sens conventionnel du courant part de la barre longue (+) et y revient par la barre courte (−) à travers le circuit ✓."},
 {t:"D'où viennent les électrons ? (QCM)", s:3, enonce:"Quand on ferme un circuit pile + lampe, des électrons circulent dans les fils. Quelle affirmation est correcte ?", choix:["La pile fabrique les électrons et les envoie dans les fils","Les électrons sortent de la borne + de la pile","Les électrons libres sont déjà dans les fils ; la pile les met en mouvement d'ensemble","Les électrons sont consommés par la lampe, c'est pourquoi la pile s'use"], bonne:2,
  pourquoi:{0:"Confusion : la pile ne « fournit » pas d'électrons, les électrons libres sont présents dans tout le métal.",1:"Erreur de sens : à l'extérieur de la pile, les électrons vont de la borne − vers la borne +. C'est le courant conventionnel qui sort par la borne +.",3:"Rien n'est consommé : autant d'électrons entrent dans la lampe qu'il en sort. La lampe transforme de l'énergie."},
  corrige:"Un métal contient des électrons libres. Quand le circuit est fermé, la pile les met tous en mouvement en même temps : c'est le courant électrique. Contrôle : c'est aussi ce qui explique que la lampe s'allume aussitôt alors que les électrons avancent à environ 0,1 mm/s ✓."}
]);
SFA.exos("c03", [
 {t:"Un débit de charges (QCM)", s:3, enonce:"En 2 minutes, une charge de 36 C traverse une section du fil. Quelle est l'intensité du courant ?", choix:["18 A","3,3 A","4 320 A","0,30 A"], bonne:3,
  pourquoi:{0:"Conversion oubliée : le temps doit être en secondes (2 min = 120 s), pas en minutes.",1:"Formule renversée : on a calculé t / Q (120 / 36). L'intensité est I = Q / t.",2:"Mauvaise formule : on a multiplié Q par t. L'intensité est une charge divisée par un temps."},
  corrige:"I = Q / t avec t = 2 × 60 = 120 s : I = 36 / 120 = 0,30 A. Contrôle : 0,30 C par seconde pendant 120 s donne bien 0,30 × 120 = 36 C ✓."},
 {t:"Ampèremètre en dérivation (QCM)", s:3, enonce:"Un élève branche par erreur un ampèremètre directement aux bornes d'une lampe (en dérivation), dans un circuit pile + lampe. Que risque-t-il de se passer ?", choix:["L'ampèremètre indique la tension de la lampe","Rien : l'ampèremètre mesure simplement l'intensité de la lampe","La lampe brille plus fort","La lampe s'éteint et un très grand courant traverse l'ampèremètre : c'est un court-circuit"], bonne:3,
  pourquoi:{0:"Confusion d'appareils : un ampèremètre mesure une intensité, jamais une tension.",1:"Confusion de branchement : un ampèremètre se branche en série. En dérivation, sa résistance quasi nulle court-circuite la lampe.",2:"Le courant passe presque entièrement par l'ampèremètre (résistance quasi nulle) et plus par la lampe : elle s'éteint."},
  corrige:"L'ampèremètre a une résistance quasi nulle. Branché aux bornes de la lampe, il se comporte comme un fil : la lampe est court-circuitée, elle s'éteint, et un courant énorme traverse l'appareil (son fusible peut griller). Contrôle : c'est la même situation qu'un fil posé en parallèle sur la lampe ✓."}
]);
SFA.exos("c04", [
 {t:"Jaune, violet, rouge (QCM)", s:2, enonce:"Les bagues d'une résistance sont, dans l'ordre : jaune, violet, rouge, or. Quelle est sa valeur ?", choix:["472 Ω","4,7 kΩ ± 5 %","47 Ω ± 5 %","470 Ω ± 5 %"], bonne:1,
  pourquoi:{0:"La 3e bague n'est pas un chiffre mais le multiplicateur : rouge = × 10<sup>2</sup>.",2:"Le multiplicateur a été oublié : 47 doit encore être multiplié par 10<sup>2</sup>.",3:"Erreur de puissance : rouge vaut 2, donc × 100, pas × 10."},
  corrige:"Jaune = 4, violet = 7, rouge = multiplicateur 10<sup>2</sup>, or = ± 5 %. R = 47 × 100 = 4 700 Ω = 4,7 kΩ ± 5 %. Contrôle : la vraie valeur est entre 4,465 kΩ et 4,935 kΩ ✓."},
 {t:"Loi d'Ohm avec des kΩ (QCM)", s:3, enonce:"Une résistance de 2,2 kΩ est soumise à une tension de 11 V. Quelle est l'intensité qui la traverse ?", choix:["5,0 A","0,20 A","5,0 mA","24,2 A"], bonne:2,
  pourquoi:{0:"Conversion oubliée : 2,2 kΩ = 2 200 Ω. Avec 2,2 on obtient 5,0, mais en ampères c'est 1 000 fois trop.",1:"Formule renversée : on a calculé R / U (2,2 / 11). La loi d'Ohm donne I = U / R.",3:"Mauvaise formule : on a multiplié U par R (11 × 2,2). C'est U = R·I, donc I = U / R."},
  corrige:"I = U / R = 11 / 2 200 = 0,005 0 A = 5,0 mA. Contrôle : U = R·I = 2 200 × 0,005 = 11 V ✓."}
]);
SFA.exos("c05", [
 {t:"Le courant qui se partage (QCM)", s:2, enonce:"Une pile alimente deux lampes en dérivation. L'ampèremètre placé près de la pile indique 0,75 A ; celui de la branche 1 indique 0,30 A. Que mesure-t-on dans la branche 2 ?", choix:["1,05 A","0,45 A","0,75 A","0,375 A"], bonne:1,
  pourquoi:{0:"Mauvaise opération : la loi des nœuds dit I = I<sub>1</sub> + I<sub>2</sub>, donc I<sub>2</sub> = I − I<sub>1</sub>. On a additionné au lieu de soustraire.",2:"Confusion de montages : l'intensité est la même partout en série, pas en dérivation.",3:"On a partagé en deux parts égales, ce qui ne vaut que pour deux lampes identiques ; ici la branche 1 reçoit 0,30 A."},
  corrige:"Loi des nœuds : I = I<sub>1</sub> + I<sub>2</sub>, donc I<sub>2</sub> = 0,75 − 0,30 = 0,45 A. Contrôle : 0,30 + 0,45 = 0,75 A ✓."},
 {t:"Partage de la tension en série (QCM)", s:3, enonce:"Une pile de 12 V alimente en série R<sub>1</sub> = 100 Ω et R<sub>2</sub> = 200 Ω. Quelle est la tension aux bornes de R<sub>2</sub> ?", choix:["6 V","4 V","12 V","8 V"], bonne:3,
  pourquoi:{0:"Partage égal : il ne vaut que pour des résistances égales. En série, la tension se partage proportionnellement aux résistances.",1:"Inversion : 4 V est la tension aux bornes de R<sub>1</sub>. La plus grande résistance reçoit la plus grande tension.",2:"Confusion de montages : la tension de la pile se retrouve aux bornes de chaque branche en dérivation, pas en série."},
  corrige:"R = 100 + 200 = 300 Ω ; I = 12 / 300 = 0,04 A ; U<sub>2</sub> = R<sub>2</sub>·I = 200 × 0,04 = 8 V. Contrôle : U<sub>1</sub> = 100 × 0,04 = 4 V et 4 + 8 = 12 V ✓."}
]);
SFA.exos("c06", [
 {t:"Le prix d'une cuisson (QCM)", s:3, enonce:"Un four de 2 500 W fonctionne pendant 45 min. Le kWh coûte 0,30 €. Combien coûte cette cuisson ?", choix:["0,56 €","33,75 €","562,50 €","0,34 €"], bonne:0,
  pourquoi:{1:"Conversion oubliée : 45 min doivent être converties en heures (0,75 h), pas utilisées telles quelles.",2:"Conversion oubliée : la puissance doit être en kW (2,5 kW) pour obtenir des kWh.",3:"Mauvaise conversion : 45 min ne valent pas 0,45 h mais 45 / 60 = 0,75 h."},
  corrige:"E = P·t = 2,5 kW × 0,75 h = 1,875 kWh ; coût = 1,875 × 0,30 ≈ 0,56 €. Contrôle : 1 h de four coûterait 2,5 × 0,30 = 0,75 €, et 3/4 de 0,75 € font bien 0,56 € ✓."},
 {t:"Le fil vert-jaune (QCM)", s:2, enonce:"La carcasse métallique d'une machine à laver est reliée au fil vert-jaune de la prise. À quoi sert ce fil ?", choix:["À amener le courant qui fait tourner le moteur","À limiter l'intensité à 16 A","À faire couler un éventuel courant de fuite vers la terre plutôt qu'à travers la personne qui touche l'appareil","À diminuer la facture d'électricité"], bonne:2,
  pourquoi:{0:"Confusion de fils : le courant de fonctionnement passe par les deux autres fils (phase et neutre). Le fil de terre n'est parcouru par un courant qu'en cas de défaut.",1:"Confusion d'appareils : c'est le fusible ou le disjoncteur qui coupe au-delà de l'intensité permise.",3:"Le fil de terre ne change pas l'énergie consommée : c'est une protection des personnes."},
  corrige:"Le fil vert-jaune relie les carcasses métalliques à la terre. Si un fil abîmé touche la carcasse, le courant s'écoule par ce fil plutôt que par le corps de la personne ; le différentiel détecte alors la fuite et coupe. Contrôle : c'est une sécurité, elle ne sert jamais au fonctionnement normal ✓."}
]);
SFA.exos("c07", [
 {t:"Le poids d'une pomme (QCM)", s:2, enonce:"Quel est le poids d'une pomme de 150 g sur Terre (g = 9,81 N/kg) ?", choix:["1 471,5 N","150 N","0,015 N","1,47 N"], bonne:3,
  pourquoi:{0:"Conversion oubliée : la masse doit être en kg (150 g = 0,150 kg).",1:"Confusion masse / poids : 150 est une masse en grammes, pas une force en newtons.",2:"Mauvaise formule : on a divisé la masse par g. Le poids est P = m·g."},
  corrige:"P = m·g = 0,150 × 9,81 ≈ 1,47 N. Contrôle : 1 kg pèse environ 10 N, donc 0,15 kg pèse environ 1,5 N ✓."},
 {t:"Représenter le poids d'un sac (QCM)", s:3, enonce:"On représente le poids d'un sac de 2 kg (g = 9,81 N/kg) avec l'échelle « 1 cm pour 5 N ». Quelle est la longueur de la flèche ?", choix:["0,4 cm","environ 3,9 cm","98 cm","2 cm"], bonne:1,
  pourquoi:{0:"Confusion masse / poids : on a divisé la masse (2 kg) par l'échelle au lieu du poids en newtons.",2:"Échelle appliquée à l'envers : on a multiplié le poids par 5 au lieu de le diviser par 5.",3:"Confusion masse / poids : la longueur de la flèche ne vaut pas la masse en kg."},
  corrige:"P = m·g = 2 × 9,81 = 19,62 N ; longueur = 19,62 / 5 ≈ 3,9 cm, vers le bas, depuis le centre de gravité. Contrôle : 3,9 cm × 5 N/cm ≈ 19,6 N ✓."}
]);
SFA.exos("c08", [
 {t:"Trois forces sur une même droite (QCM)", s:2, enonce:"Un objet subit trois forces horizontales : 25 N vers la droite, 10 N vers la droite et 40 N vers la gauche. Quelle est la résultante ?", choix:["5 N vers la droite","75 N vers la gauche","5 N vers la gauche","15 N vers la gauche"], bonne:2,
  pourquoi:{0:"Erreur de sens : la résultante a le sens de la plus grande somme, ici 40 N vers la gauche contre 35 N vers la droite.",1:"On a additionné toutes les valeurs sans tenir compte des sens opposés.",3:"Une force a été oubliée : on a fait 40 − 25 sans compter les 10 N vers la droite."},
  corrige:"Vers la droite : 25 + 10 = 35 N. Vers la gauche : 40 N. R = 40 − 35 = 5 N, vers la gauche. Contrôle : en ajoutant 5 N vers la droite, on obtiendrait 40 N de chaque côté, donc l'équilibre ✓."},
 {t:"Le livre et sa vraie paire (QCM)", s:4, enonce:"Un livre est posé sur une table. Le poids du livre (force de la Terre sur le livre) forme une paire action-réaction avec :", choix:["La force du livre sur la Terre","La réaction de la table sur le livre","La force du livre sur la table","Aucune force : le poids n'a pas de réaction"], bonne:0,
  pourquoi:{1:"Confusion équilibre / action-réaction : ces deux forces s'appliquent sur le même objet (le livre) et se compensent ; une paire action-réaction agit sur deux objets différents.",2:"Cette force agit bien sur un autre objet, mais elle forme une paire avec la réaction de la table, pas avec le poids.",3:"Toute force a sa réaction : si la Terre attire le livre, le livre attire la Terre."},
  corrige:"Le poids est l'action de la Terre sur le livre ; sa réaction est l'action du livre sur la Terre : même valeur, même direction, sens opposé, et appliquée à la Terre. Contrôle : les deux forces de la paire portent sur deux objets différents, donc elles ne s'annulent pas ✓."}
]);
SFA.exos("c09", [
 {t:"Sur un talon aiguille (QCM)", s:3, enonce:"Une personne de 60 kg (g = 9,81 N/kg) se tient un instant sur un seul talon aiguille de 1 cm². Quelle pression exerce-t-elle sur le sol ?", choix:["589 Pa","6,0·10<sup>5</sup> Pa","5,9·10<sup>−2</sup> Pa","5,9·10<sup>6</sup> Pa"], bonne:3,
  pourquoi:{0:"Conversion oubliée : la surface doit être en m² (1 cm² = 0,000 1 m²).",1:"Confusion masse / poids : la force pressante est le poids, 60 × 9,81 = 588,6 N, pas 60.",2:"Mauvaise formule : on a multiplié F par S. La pression est p = F / S."},
  corrige:"F = m·g = 60 × 9,81 = 588,6 N ; S = 1 cm² = 1·10<sup>−4</sup> m² ; p = 588,6 / 1·10<sup>−4</sup> ≈ 5,9·10<sup>6</sup> Pa (environ 59 bar). Contrôle : p × S = 5,886·10<sup>6</sup> × 10<sup>−4</sup> = 588,6 N ✓."},
 {t:"Au fond de la piscine (QCM)", s:2, enonce:"Quelle est la pression due à l'eau seule au fond d'une piscine de 4 m de profondeur (ρ = 1 000 kg/m³ ; g = 9,81 N/kg) ?", choix:["39 240 Pa","39,24 Pa","4 000 Pa","3,92·10<sup>6</sup> Pa"], bonne:0,
  pourquoi:{1:"Conversion oubliée : ρ doit être en kg/m³ (1 000), pas en g/cm³ (1).",2:"Oubli de g : la formule est p = ρ·g·h.",3:"Conversion inutile : h doit rester en mètres ; on l'a mis en centimètres (400)."},
  corrige:"p = ρ·g·h = 1 000 × 9,81 × 4 = 39 240 Pa ≈ 0,39 bar. Contrôle : environ 1 bar tous les 10 m, donc 4 m donnent environ 0,4 bar ✓."}
]);
SFA.exos("c10", [
 {t:"La pierre dans l'eau (QCM)", s:2, enonce:"Une pierre de volume 0,5 L est entièrement plongée dans l'eau (ρ = 1 000 kg/m³ ; g = 9,81 N/kg). Quelle est la poussée d'Archimède ?", choix:["4 905 N","4,9·10<sup>−3</sup> N","0,5 N","4,9 N"], bonne:3,
  pourquoi:{0:"Conversion oubliée : 0,5 L = 0,5·10<sup>−3</sup> m³, pas 0,5 m³.",1:"Mauvaise conversion : 1 L = 10<sup>−3</sup> m³ ; on a utilisé 10<sup>−6</sup>, qui convient pour les cm³.",2:"Oubli de g : ρ·V donne la masse d'eau déplacée (0,5 kg), pas son poids."},
  corrige:"V = 0,5 L = 5·10<sup>−4</sup> m³ ; Π = ρ·V·g = 1 000 × 5·10<sup>−4</sup> × 9,81 ≈ 4,9 N. Contrôle : la pierre déplace 0,5 kg d'eau, qui pèse environ 0,5 × 10 = 5 N ✓."},
 {t:"L'iceberg (QCM)", s:3, enonce:"Un bloc de glace (ρ = 920 kg/m³) flotte dans l'eau de mer (ρ = 1 030 kg/m³). Quelle fraction de son volume est immergée ?", choix:["environ 11 %","environ 92 %","environ 112 %","environ 89 %"], bonne:3,
  pourquoi:{0:"Confusion immergé / émergé : 11 % est la fraction qui dépasse de l'eau.",1:"Mauvais liquide : 920 / 1 000 vaut pour l'eau douce, pas pour l'eau de mer.",2:"Rapport renversé (ρ<sub>liquide</sub> / ρ<sub>objet</sub>) : une fraction immergée ne peut pas dépasser 100 %."},
  corrige:"À la flottaison, fraction immergée = ρ<sub>objet</sub> / ρ<sub>liquide</sub> = 920 / 1 030 ≈ 0,89, soit environ 89 %. Contrôle : la glace est moins dense que l'eau de mer, donc la fraction est bien inférieure à 100 % ✓."}
]);
