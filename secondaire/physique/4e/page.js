SFA.page({
  matiere: "physique",
  titre: "Physique · 4e secondaire",
  kicker: "Secondaire · FWB",
  intro: "Du mouvement à l'énergie, puis de la lumière aux lentilles : 10 chapitres, des simulations à manipuler et des exercices du ★ au ★★★★★ corrigés pas à pas. Sauf mention contraire, g = 9,8 m/s².",
  base: "../../",
  chapitres: [
    {id:"c01", num:1, titre:"Mouvement et vitesse", resume:"Décrire un mouvement, c'est choisir un référentiel puis suivre la position au cours du temps. La vitesse dit de combien la position change à chaque seconde.", attendus:"décrire un mouvement par rapport à un référentiel ; calculer une vitesse moyenne ; convertir m/s et km/h ; lire et construire un graphique position-temps."},
    {id:"c02", num:2, titre:"Accélération et MRUA", resume:"Quand la vitesse change, le mouvement est accéléré. Si la vitesse change du même montant à chaque seconde, le mouvement est uniformément accéléré.", attendus:"définir l'accélération ; reconnaître un MRUA ; utiliser v = v₀ + a·t et x = x₀ + v₀·t + ½·a·t² ; lire un graphique v(t) (pente et aire)."},
    {id:"c03", num:3, titre:"Chute libre et graphes du mouvement", resume:"Sans air, tous les objets tombent avec la même accélération. Avec l'air, la résistance finit par limiter la vitesse.", attendus:"décrire une chute libre (a = g) ; comparer avec et sans air ; lire et relier les graphiques x(t), v(t) et a(t) ; notion de vitesse limite."},
    {id:"c04", num:4, titre:"Énergie cinétique et potentielle", resume:"Un objet en mouvement ou en hauteur possède de l'énergie. Elle se transforme sans disparaître.", attendus:"reconnaître les formes d'énergie ; calculer E<sub>c</sub> = ½·m·v² et E<sub>p</sub> = m·g·h ; décrire les transformations d'énergie mécanique."},
    {id:"c05", num:5, titre:"Travail, puissance et rendement", resume:"Une force qui déplace son point d'application transfère de l'énergie : c'est le travail. La puissance dit à quelle vitesse, le rendement dit ce qui est utile.", attendus:"calculer W = F·d (force dans le sens du déplacement), P = W/t et le rendement ; interpréter une chaîne énergétique ; machines simples."},
    {id:"c06", num:6, titre:"Conservation et dégradation de l'énergie", resume:"L'énergie ne se crée pas et ne se perd pas, mais elle se dégrade en chaleur peu utilisable. Les sources d'énergie ont des limites.", attendus:"énoncer la conservation de l'énergie ; expliquer la dégradation en énergie thermique ; comparer des sources d'énergie ; faire un bilan énergétique."},
    {id:"c07", num:7, titre:"Lumière : sources, ombres et éclipses", resume:"La lumière se propage en ligne droite. Cela suffit pour expliquer les ombres, la pénombre, les éclipses, les phases de la Lune et la vision.", attendus:"distinguer source et objet éclairé ; propagation rectiligne ; ombre et pénombre ; éclipses ; éclairement."},
    {id:"c08", num:8, titre:"Réflexion de la lumière", resume:"Un rayon qui rebondit sur un miroir suit une loi simple : l'angle de réflexion est égal à l'angle d'incidence, mesurés par rapport à la normale.", attendus:"loi de la réflexion ; image dans un miroir plan ; réflexion spéculaire et diffuse ; deux miroirs."},
    {id:"c09", num:9, titre:"Réfraction, réflexion totale et dispersion", resume:"La lumière change de direction en passant d'un milieu transparent à un autre. Selon l'angle, elle peut même être totalement réfléchie, et la lumière blanche peut se décomposer.", attendus:"expliquer la réfraction ; utiliser n₁·sin i = n₂·sin r ; angle limite et réflexion totale ; fibre optique ; dispersion par un prisme."},
    {id:"c10", num:10, titre:"Lentilles, œil et couleurs", resume:"Une lentille convergente forme des images. L'œil en est une, réglable : on corrige ses défauts avec des lunettes. Les couleurs se mélangent différemment pour la lumière et pour les pigments.", attendus:"image par une lentille convergente ; 1/f = 1/p + 1/q ; œil, myopie, hypermétropie ; synthèse additive et soustractive."}
  ]
});

/* aides de dessin communes à la page (ne dépendent d'aucun code externe) */
window.P4 = {
  car: function(c, x, y, w, color, dir){
    var ctx = c.ctx, h = w * 0.36; ctx.save(); ctx.translate(x, y); if (dir < 0) ctx.scale(-1, 1);
    ctx.fillStyle = color || "#1e3f8f"; ctx.fillRect(-w/2, -h, w, h * 0.7);
    ctx.fillRect(-w*0.25, -h*1.6, w*0.5, h*0.7);
    ctx.fillStyle = "#dbe7ff"; ctx.fillRect(-w*0.19, -h*1.5, w*0.17, h*0.5); ctx.fillRect(w*0.02, -h*1.5, w*0.17, h*0.5);
    ctx.fillStyle = "#13233a"; [-w*0.3, w*0.3].forEach(function(dx){ ctx.beginPath(); ctx.arc(dx, -h*0.25, h*0.28, 0, 6.2832); ctx.fill(); });
    ctx.restore();
  },
  label: function(c, s, x, y, color, align){ SFA.draw.text(c, s, x, y, {size:12, color:color || "#2c3a4e", align:align || "center"}); },
  nice: function(x){ var p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
};
/* remplissage d'une aire sous f entre t0 et t1 (par rapport à y = 0) */
P4.area = function(c, ax, f, t0, t1, col, colNeg){
  var ctx = c.ctx, n = 80; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
  for (var i = 0; i < n; i++){
    var a = t0 + (t1 - t0) * i / n, b = t0 + (t1 - t0) * (i + 1) / n, ya = f(a), yb = f(b);
    ctx.fillStyle = (ya + yb) / 2 >= 0 ? col : (colNeg || col);
    ctx.beginPath(); ctx.moveTo(ax.X(a), ax.Y(0)); ctx.lineTo(ax.X(a), ax.Y(ya)); ctx.lineTo(ax.X(b), ax.Y(yb)); ctx.lineTo(ax.X(b), ax.Y(0)); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
};
/* barres d'énergie horizontales : items = [{n, v, col}] ; opts = {lo, hi, unit, fmt} */
P4.bars = function(c, items, opts){
  var ctx = c.ctx, L = 52, R = 70, rowH = c.H / items.length, lo = opts.lo, hi = opts.hi;
  var X = function(v){ return L + (v - lo) / (hi - lo) * (c.W - L - R); };
  c.clear();
  ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0), 4); ctx.lineTo(X(0), c.H - 4); ctx.stroke(); ctx.restore();
  items.forEach(function(it, i){
    var y = i * rowH + rowH / 2, h = Math.min(26, rowH * 0.6), x0 = X(0), x1 = X(it.v);
    ctx.fillStyle = it.col; ctx.fillRect(Math.min(x0, x1), y - h / 2, Math.max(1, Math.abs(x1 - x0)), h);
    SFA.draw.text(c, it.n, 6, y, {size:13, color:it.col, align:"left"});
    SFA.draw.text(c, (opts.fmt || function(v){ return SFA.fmt(v, 0); })(it.v) + " " + (opts.unit || ""), c.W - R + 6, y, {size:12, color:"#2c3a4e", align:"left"});
  });
};
