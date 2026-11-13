/* QCM ajoutés (séquence E, 13/11/2026) : écrits à partir de la théorie du chapitre, rien n'est repris d'un examen.
   Ils s'ajoutent à la fin de la liste du chapitre : les index des exercices existants (et donc reponses.js) ne changent pas. */
SFA.exos("c06", [
 {t:"Un cosinus du 2e quadrant (QCM)", s:2, enonce:"Quelle est la valeur exacte de cos(5π/6) ?", choix:["−√3/2","√3/2","−1/2","1/2"], bonne:0,
  pourquoi:{1:"5π/6 est dans le 2e quadrant, où le cosinus est négatif : le signe ne peut pas être +.",2:"−1/2 est cos(2π/3). Ici 5π/6 = π − π/6, et cos(π/6) = √3/2, pas 1/2.",3:"Double erreur : mauvais angle de référence (π/3 au lieu de π/6) et mauvais signe."},
  corrige:"5π/6 = π − π/6. Avec cos(π − x) = −cos x : cos(5π/6) = −cos(π/6) = −√3/2. Contrôle : 5π/6 = 150°, un point à gauche de l'axe vertical, donc abscisse négative ✓."},
 {t:"Signes dans le 3e quadrant (QCM)", s:1, enonce:"Pour θ = 4π/3, le point M du cercle trigonométrique est dans le 3e quadrant. Que peut-on dire de cos θ et sin θ ?", choix:["cos θ > 0 et sin θ > 0","cos θ < 0 et sin θ > 0","cos θ < 0 et sin θ < 0","cos θ > 0 et sin θ < 0"], bonne:2,
  pourquoi:{0:"C'est le cas du 1er quadrant (entre 0 et π/2).",1:"C'est le cas du 2e quadrant (entre π/2 et π) : le point est en haut à gauche.",3:"C'est le cas du 4e quadrant (entre 3π/2 et 2π) : le point est en bas à droite."},
  corrige:"4π/3 est entre π et 3π/2 : le point M est en bas à gauche. Son abscisse (cos θ) et son ordonnée (sin θ) sont toutes deux négatives. Valeurs : cos(4π/3) = −1/2 et sin(4π/3) = −√3/2 ✓."},
 {t:"Combien de solutions ? (QCM)", s:3, enonce:"Combien de solutions l'équation cos x = 1 a-t-elle dans l'intervalle [0 ; 2π[ ?", choix:["Une seule : x = 0","Deux : x = 0 et x = 2π","Deux : x = 0 et x = π","Aucune"], bonne:0,
  pourquoi:{1:"2π est exclu de l'intervalle [0 ; 2π[ (crochet ouvert). Et 2π est le même point du cercle que 0.",2:"cos π = −1, pas 1.",3:"cos 0 = 1 : x = 0 convient."},
  corrige:"cos x = 1 : l'abscisse du point vaut 1, c'est le seul point (1 ; 0) du cercle. Les solutions α et −α sont ici confondues (α = 0). Dans [0 ; 2π[, il n'y a donc qu'une solution : x = 0."},
 {t:"Équation avec la tangente (QCM)", s:3, enonce:"Quelles sont les solutions de tan x = 1 dans [0 ; 2π[ ?", choix:["π/4 et 5π/4","π/4 et 3π/4","π/4 seulement","π/4 et 7π/4"], bonne:0,
  pourquoi:{1:"tan(3π/4) = −1 : sinus positif mais cosinus négatif.",2:"La tangente a pour période π : π/4 + π = 5π/4 est aussi solution.",3:"tan(7π/4) = −1 : c'est l'angle opposé −π/4, pas π/4 + π."},
  corrige:"tan(π/4) = 1. Comme la tangente a pour période π, les solutions sont π/4 + kπ. Dans [0 ; 2π[ : π/4 et 5π/4. Contrôle : en 5π/4, sin et cos valent tous deux −√2/2, donc tan = 1 ✓."}
]);
