# Guide : théorie animée et devantures d'exercices (pages de cours SFA)

Une page de cours (`<cours>/index.html`) se construit à partir de :
`page.js` (chapitres) · `sims-NN.js` (simulations) · `exos-NN.js` (exercices) · **`theo-NN.js` (ce que tu écris)**.
Moteur : `kit/course-engine.js`. Aides de dessin : `kit/course-helpers.js` (À LIRE). Modèle de référence : la page
d'exercices de chimie (`chimie/exercices/index.html`, chapitres `var CH=[…]` : champs `ic`, `anim`, `th`, et pour
chaque exercice `d`) et la page de physique (`exercices/index.html`). Ouvre-les pour voir le style attendu.

## Fichier `theo-NN.js` (un par chapitre, NN = 01…10, même numéro que exos-NN.js)

```js
SFA.theo("c03", {
  // devanture du chapitre (carte 460 × 260 sur la page d'accueil du cours)
  icon: function () { TB('∫ f(x) dx', W*.5, H*.45, BLUE_D, 34); TB('primitives', W*.5, H*.66, ORANGE, 18); },
  // schéma ANIMÉ du rappel théorique ; t = compteur d'images (60/s). Canvas ~700 × 300 (W, H variables).
  anim: function (t) { /* dessin qui bouge et explique l'idée-clé du chapitre */ },
  // le rappel théorique : 3 à 5 cartes, HTML simple
  th: '<div class="tcard"><b class="h">Titre</b><p>…</p></div><div class="tcard">…</div>'
});
// une devanture par exercice, DANS L'ORDRE du tableau de exos-NN.js (même nombre d'éléments)
SFA.figs("c03", [
  function (p) { /* dessin 460 × 280 sur la carte, et en grand sur la page de l'exercice ; p = 0 avant
                    « Voir la solution », monte de 0 à 1 après : tu peux révéler la solution graphiquement */ },
  …
]);
```

Variante pour un chapitre riche : au lieu de `anim` + `th`, `sub: [{t:"Ondes progressives", anim:function(t){…}, th:"…"}, …]`
(onglets de théorie, comme le chapitre « Ondes » de la physique).

## Aides disponibles (globales, voir kit/course-helpers.js)
`ctx, W, H` (canvas courant, coordonnées CSS) · couleurs `BLUE, BLUE_D, RED, DRED, GREEN, DGREEN, ORANGE, ORA2, VIOLET, GREY, AX, INK, YEL`
· `TB(texte,x,y,couleur,taille,align)` texte gras · `T(...)` monospace · `LN(x1,y1,x2,y2,c,w,dash)` · `DOT(x,y,r,c,fill)` ·
`A(x,y,vx,vy,c,lab,w)` / `arrow(...)` flèches · `tag(txt,x,y,c,size)` étiquette sur fond blanc · `grid(O,k,x0,x1,y0,y1)` repère quadrillé ·
`axes2(O,kF,'x','y')` · `sinCurve(x0,y0,w,amp,k,ph,c)` · `P3(x,y,z,cx,cy,s)` projection 3D (orbite à la souris dans la théorie : `ORB.a`, `ORB.b`) ·
`pr3/arr3` (3D des exercices, `d3:true`) · `wall, floor, blockR, spring, car, BALL, chg, pers, wag, rmark, arcA, incline, pendule`.
Tu peux définir tes propres petites fonctions en haut du fichier (préfixe-les par le code du cours, ex. `m6_axes`) pour ne pas écraser celles des autres fichiers.

## Exigences
1. **Devantures** : chaque exercice a une image qui dit tout de suite de quoi il parle (figure, graphe, schéma, montage, molécule,
   formule-clé mise en scène) — pas juste le titre. Lisible en 460 × 280 : 1 à 3 éléments forts, texte ≥ 13 px, couleurs SFA.
   Avec `p > 0`, révèle un élément de la solution (point, aire coloriée, valeur) : c'est ce qui rend la page vivante.
   Elle doit rester juste (même figure que l'énoncé, mêmes valeurs).
2. **Icône de chapitre** : formule ou image emblématique, comme les cartes de chimie (`n = m/M`, `PV = nRT`, `pH`).
3. **Théorie** : 3 à 5 cartes `tcard` qui couvrent tout ce qu'il faut savoir du chapitre (définitions, formules, méthode, pièges, un exemple
   chiffré), niveau exact du cours, français de Belgique, virgule décimale. Le schéma `anim` doit vraiment bouger et illustrer l'idée-clé
   (pas un texte qui clignote). Pour les gros chapitres, utilise `sub`.
4. Rien d'externe, pas d'`alert`, pas de `console.log`. `node --check` sur chaque fichier.
5. Contrôle : `python3 kit/check-course.py <dossier du cours>` (ouvre la page, chaque chapitre, la théorie, la liste et chaque exercice ;
   signale les erreurs JS et les devantures manquantes). 0 erreur exigée. Regarde aussi des captures (Playwright) de la liste d'exercices
   de 2-3 chapitres : les devantures doivent être belles et variées.
6. Ne modifie PAS sims-NN.js, exos-NN.js, page.js, ni le kit. Seulement les fichiers theo-NN.js de TON cours.
   Les figs suivent l'ordre du tableau dans exos-NN.js (pas l'ordre trié par étoiles).
