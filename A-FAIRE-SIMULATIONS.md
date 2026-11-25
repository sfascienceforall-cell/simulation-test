# Simulations SFA : travail en cours

Tenu à jour par le chef des simulations. Mets à jour ce fichier à chaque publication.
Le plus récent est en haut de chaque section.

## 1. Décisions d'Enzo en attente (ne rien changer avant sa réponse)

- **Valeurs par défaut changées le 21/11.** Elles changent ce qu'on voit dans les reels :
  - rotor (`p5-c06-rotor`) : 32 tr/min au lieu de 25 ;
  - fibre optique (`p4-c09-fibre`) : indice de gaine 1,32 au lieu de 1,44 ;
  - comprimé effervescent (`c5-c07-effervescent`) : n = 8 par défaut au lieu de 1 ;
  - Monty Hall (`m6-c09-monty-hall`) : le bouton principal lance les parties automatiques.
- **Questions du 18/11, sans réponse :**
  - faut-il retirer les objectifs « 🎯 Défi » intégrés aux simulations du secondaire ?
  - faut-il afficher les réglages de la physique à côté du canevas, hors plein écran ?
- **Doutes des agents à trancher :**
  - `Onde-progressive` et `Fonction-d-onde-f-x-vt-` sont passées en unités SI : l'échelle du dessin a changé ;
  - `c5-c07-profil-catalyseur` : énergies des molécules exagérées ×8 pour qu'on voie des passages (c'est dit à l'écran) ;
  - `c6-c07-rouille` : avec Zn ou Mg, il reste 6 à 9 % de rouille, alors que le texte dit « le clou reste intact » ;
  - `p6-c09-carbone14` : activité de référence 13,6 désintégrations par minute et par gramme, à confirmer.

## 2. À faire

0. **Les 204 simulations manquantes par rapport aux canevas SFA et au cours de physique quantique** (analyse du 25/11) :
   liste détaillée dans `a-faire/canevas/`, méthode dans `a-faire/CONSIGNE-NUIT.md`. Ordre : P1, P2, P3, puis la quantique.
   La loi d'Ampère (point 1 ci-dessous) en fait partie (`ph-loi-ampere`, P1).
0. **Session du 25/11 : priorité 1 du rapport « matière du site et écarts avec les canevas »** (26 simulations).
   Lots en cours : `p1-magn` (Ampère, barre sur rails), `p1-rot` (ΣM = I·α, patineuse, avant-bras),
   `p1-flu-opt` (perfusion, Reynolds, miroirs), `p1-thermo` (transferts, dilatation, moteur-frigo-PAC, détente),
   `p1-chimie` (orbitales, de Broglie, piston, bombe, entropie + retrait des défis de uc-c01-bohr, uc-c04-types-solides,
   uc-c09-entraineur-additions), `p1-orga1` (halogénation, tension de cycle, polarimètre, sites Nu/E, triple liaison),
   `p1-orga2` (SEAr, aldolisation, amine et membrane, glucose).
   Ensuite : priorité 2 (88), priorité 3 (45), puis le cours de physique quantique (45 visuels).
0. **Passage au lycée (décision d'Enzo du 25/11)** : noms affichés 3e / Seconde / Première / Terminale et contenu
   aligné sur le programme français. Dossiers et URL inchangés. Lot `lycee` : renommage + plan d'écart au programme
   dans `audit/lycee-programme.md`, puis mise en conformité par lots.
1. **Loi d'Ampère** (physique BA1, chapitre Magnétisme, section `PH11`).
   Un contour fermé qu'on dessine autour d'un ou plusieurs fils (courants entrants et sortants). On voit B·dl s'additionner
   le long du contour jusqu'à μ₀·I_enc, quelle que soit la forme du contour. Puis les applications : fil (B = μ₀I/(2πr)),
   solénoïde, tore, câble coaxial.
2. **Audit de qualité des simulations hors reels.**
   La critique du 21/11 ne couvrait que les 128 simulations des reels. Les autres (environ 1 300) n'ont pas été jugées
   avec la liste de qualité de `CLAUDE.md`.
   - Passe cours par cours : capture de chaque simulation, puis classement « à refaire », « à améliorer » ou « correcte ».
   - Écris le résultat dans `audit/<cours>.md`. Refais ensuite par lots, en commençant par les cours de 5e et 6e
     et par la physique BA1.
3. **Vignettes des chapitres** sur l'accueil des 21 cours.
   Aujourd'hui, chaque chapitre montre la vignette de sa première simulation. Pour mettre la plus parlante, ajoute
   `chThumb: { "c01": "<id>", … }` dans `course-meta.js` (le moteur le lit déjà).
4. **Après chaque refonte d'une simulation qui apparaît dans un reel**, note le reel à refilmer dans le compte rendu à Enzo.
   La liste des simulations des reels se trouve dans le projet Claude « SFA » (`refonte-sims-reels-2026-11-21.md`).

## 3. Déjà fait (pour mémoire)

- **22/11** :
  - Ondes BA1 : `reflexion-obstacle`, `onde-stationnaire-somme`, `harmoniques-tuyaux` ;
  - diffraction jusqu'à a/λ = 150 ;
  - Magnétisme BA1 : `fils-paralleles-3d` (montage réaliste, limaille de fer, lignes de champ calculées).
- **21/11** :
  - refonte des 45 simulations des reels : 18 refaites, 26 améliorées, plus le tube à vide ;
  - nouveaux chapitres BA1 « Rappels de trigonométrie », « Projections dans les axes » et « Quantité de mouvement » ;
  - accueil des 21 cours au design de la page de garde de physique.
