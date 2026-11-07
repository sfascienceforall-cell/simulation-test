# Guide de construction d'une page SFA (secondaire ou université)

Une page = un dossier `<racine>/<matiere>/<annee>/` avec :

```
index.html      ← squelette (ne change que les chemins des scripts)
page.js         ← SFA.page({...}) : titre, chapitres
sims-01.js …    ← un fichier par chapitre : SFA.sim({...}) × 4 environ
exos-01.js …    ← un fichier par chapitre : SFA.exos("c01", [...])
```

## index.html (à copier tel quel, en adaptant le nombre de fichiers)
```html
<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SFA</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800&family=STIX+Two+Text:ital@0;1&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="../../_lib/sfa-sec.css">
<script src="../../_lib/sfa-sec.js"></script>
<script src="page.js"></script>
<script src="sims-01.js"></script> … <script src="exos-01.js"></script> …
</head><body><div id="app"></div></body></html>
```
(Pour l'université, le chemin est `../../secondaire/_lib/` ou celui indiqué dans la mission.)

## page.js
```js
SFA.page({
  matiere: "maths",            // maths | physique | chimie | biologie | statistique (couleur)
  titre: "Mathématiques · 3e secondaire",
  kicker: "Secondaire · FWB",
  intro: "40 simulations et 120 exercices…",
  base: "../../",              // chemin vers le hub secondaire/
  chapitres: [
    {id:"c01", num:1, titre:"Calcul littéral", resume:"…une ou deux phrases…", attendus:"…ce que le référentiel demande…"},
    …
  ]
});
```

## Une simulation
```js
SFA.sim({
  id: "m3-c01-identites",      // unique, sans espace (sert d'ancre #id)
  ch: "c01",
  titre: "Les produits remarquables en aires",
  resume: "Une ligne affichée sur la carte.",
  but: "Ce que l'élève fait et observe (sous le titre du panneau).",
  tag: "Géométrie",            // facultatif
  aRetenir: "(a + b)² = a² + 2ab + b² : les deux rectangles ab.",   // facultatif mais conseillé
  piege: "(a + b)² ≠ a² + b².",                                       // facultatif
  build: function(k, S){
    var c = k.canvas(380);                         // ou k.canvas(0, {ratio:.6})
    var a = k.slider("a", 1, 8, 0.5, 3, "cm");
    var b = k.slider("b", 1, 8, 0.5, 2, "cm");
    var ro = k.readouts(["(a+b)²", "a²+b²"]);
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0:-1, x1:10, y0:-1, y1:10, xl:"x", yl:"y"});   // repère avec graduations
      S.draw.fn(c, ax, function(x){ return x*x/10; }, S.draw.palette.acc);
      ro.set(0, S.fmt((a.value+b.value)**2, 2));
    });
  }
});
```
Le kit `k` : `canvas(h)`, `slider(label,min,max,pas,val,unité,fn)`, `select(label,[[v,t],…],val,fn)`, `seg(label,[[v,t],…],val,fn)`,
`toggle(label,val,fn)`, `input(label,val,fn)`, `button(texte,fn,primaire)`, `readouts([labels])→.set(i,html)`, `note(html,"ok|warn|bad")→.set()`,
`draw(fn)` (redessiné après chaque contrôle et au redimensionnement), `loop(fn(dt,t))→{play,pause,reset,running}`.
Canvas : `c.ctx`, `c.W`, `c.H` (pixels CSS), `c.clear()`, `c.pointer(function(type,{x,y}){…})` (type = down/drag/move/up).
Aides : `S.draw.axes(c, {x0,x1,y0,y1,xl,yl,stepX,stepY})` → `ax.X(x)`, `ax.Y(y)`, `ax.ix(px)`, `ax.iy(py)` ; `S.draw.fn(c,ax,f,couleur)`, `dot`, `line`,
`arrow`, `text(c,"…",x,y,{size,color,align,bg,math})`, `S.draw.palette`. Nombres : `S.fmt(x, déc)` (virgule belge, signe −), `S.sci(x)`.

Règles :
- **Rien d'externe** (pas de bibliothèque, pas d'image, pas de réseau). Tout est dessiné au canvas ou en HTML.
- Une vraie interaction : l'élève **fait varier** quelque chose et **voit** une conséquence chiffrée ou graphique. Pas de diaporama.
- Les valeurs affichées sont justes **sur tout le domaine des curseurs** ; bornes et cas limites signalés (`k.note(..., "warn")`).
- Les modèles simplifiés sont annoncés comme simplifiés.
- Texte en français de Belgique : virgule décimale, « septante/nonante » non nécessaires, unités SI, vocabulaire des référentiels FWB.
- Pas de `alert()`, pas de `prompt()`, pas de `console.log` laissé.
- Si le dessin dépend d'une animation, utilise `k.loop` (elle s'arrête quand le panneau se ferme).

## Exercices
```js
SFA.exos("c01", [
  {t:"Développer", s:1, enonce:"Développe (x + 3)².", indice:"…", corrige:"<ol><li>…</li></ol>", reponse:"x² + 6x + 9"},
  {t:"QCM", s:2, enonce:"…", choix:["…","…","…","…"], bonne:2,
   pourquoi:{0:"erreur typique : …", 1:"…", 3:"…"}, corrige:"Explication de la bonne réponse."}
]);
```
- `s` = difficulté 1 à 5 étoiles. **Répartition exigée par chapitre** (environ 10 éléments) :
  ★ 2 · ★★ 2 · ★★★ 2 · ★★★★ 2 · ★★★★★ 1 à 2, dont au moins 3 QCM.
  ★ = application directe d'une définition ; ★★ = une méthode en deux étapes ; ★★★ = plusieurs étapes ou un contexte ;
  ★★★★ = problème à modéliser ou piège classique ; ★★★★★ = synthèse de plusieurs chapitres / défi.
- Chaque distracteur de QCM correspond à une erreur typique, expliquée dans `pourquoi`.
- Corrigé **pas à pas**, sans saut logique, avec la réponse finale. Contenu 100 % original SFA (aucun énoncé recopié d'un manuel, d'un examen ou d'un site).
- HTML simple : `<sup>`, `<sub>`, `<b>`, `<ol>`, `<span class="math">`. Pas de LaTeX.
