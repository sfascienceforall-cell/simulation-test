/* Biologie 3e · théorie animée et devantures · chapitre 1 (+ aides de dessin b3 partagées par theo-02 … theo-10) */
var b3 = {};
b3.f = function (p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); };
b3.box = function (x, y, w, h, fill, st, r) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 8 : r); ctx.fill(); if (st) { ctx.strokeStyle = st; ctx.lineWidth = 2; ctx.stroke(); } };
b3.pill = function (txt, x, y, fill, tc, size) { var s = size || 13; ctx.font = "600 " + s + "px system-ui"; var w = ctx.measureText(txt).width + 16; b3.box(x - w / 2, y - s * .85, w, s * 1.7, fill, null, s); TB(txt, x, y + s * .35, tc, s); };
b3.ar = function (x1, y1, x2, y2, c, w, dash) {
  var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy); if (l < 6) return; var ux = dx / l, uy = dy / l, hs = (w || 2.5) * 3;
  LN(x1, y1, x2 - ux * hs * .8, y2 - uy * hs * .8, c, w || 2.5, dash);
  ctx.fillStyle = c; ctx.save(); ctx.translate(x2, y2); ctx.rotate(Math.atan2(dy, dx)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-hs * 1.3, -hs * .6); ctx.lineTo(-hs * 1.3, hs * .6); ctx.closePath(); ctx.fill(); ctx.restore();
};
b3.flow = function (x1, y1, x2, y2, t, c, n) { n = n || 3; for (var i = 0; i < n; i++) { var u = ((t * .012) + i / n) % 1; DOT(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u, 3.5, c); } };
b3.axes = function (x, y, w, h, xl, yl) { LN(x, y, x + w, y, INK, 1.8); LN(x, y, x, y - h, INK, 1.8); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(x + w + 7, y); ctx.lineTo(x + w, y - 4); ctx.lineTo(x + w, y + 4); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y - h - 7); ctx.lineTo(x - 4, y - h); ctx.lineTo(x + 4, y - h); ctx.fill(); if (xl) TB(xl, x + w, y + 36, GREY, 13, "right"); if (yl) TB(yl, x + 6, y - h - 10, GREY, 13, "left"); };
b3.curve = function (pts, c, w, k) { ctx.strokeStyle = c; ctx.lineWidth = w || 3; ctx.lineJoin = "round"; ctx.beginPath(); var n = k == null ? pts.length : k; for (var i = 0; i < n; i++) { i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); } ctx.stroke(); };
b3.cross = function (x, y, r, c) { LN(x - r, y - r, x + r, y + r, c || RED, 4); LN(x + r, y - r, x - r, y + r, c || RED, 4); };
b3.check = function (x, y, r, c) { ctx.strokeStyle = c || GREEN; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r * .3, y + r * .7); ctx.lineTo(x + r, y - r * .7); ctx.stroke(); };
b3.sun = function (x, y, r, t) { for (var i = 0; i < 10; i++) { var a = i / 10 * 6.283 + (t || 0) * .01; LN(x + Math.cos(a) * (r + 4), y + Math.sin(a) * (r + 4), x + Math.cos(a) * (r + 11), y + Math.sin(a) * (r + 11), "#e8b100", 2.5); } DOT(x, y, r, "#ffd34d"); };
b3.E = function (cx, cy, rx, ry, f, st, rot) { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, 7); ctx.fillStyle = f; ctx.fill(); if (st) { ctx.strokeStyle = st; ctx.lineWidth = 2; ctx.stroke(); } };
/* pictogrammes : k = nom ; (x,y) centre ; s = demi-largeur environ */
b3.ico = function (k, x, y, s) {
  ctx.lineCap = "round"; ctx.lineJoin = "round"; var E = b3.E, i;
  if (k === "herbe") { for (i = -3; i <= 3; i++) { LN(x + i * s * .22, y + s * .6, x + i * s * .34, y - s * (.55 + (i % 2 ? .1 : .3)), i % 2 ? GREEN : DGREEN, 3); } }
  else if (k === "chene") { LN(x, y + s * .7, x, y, "#8a5a2b", s * .28); E(x, y - s * .25, s * .75, s * .6, "#9ad28a", DGREEN); E(x - s * .35, y + s * .05, s * .45, s * .35, "#7cc470", DGREEN); E(x + s * .38, y + s * .05, s * .45, s * .35, "#7cc470", DGREEN); }
  else if (k === "chou") { E(x, y + s * .1, s * .62, s * .55, "#b7e3a2", DGREEN); E(x, y + s * .1, s * .38, s * .33, "#d9f2c9", DGREEN); }
  else if (k === "sauterelle") { E(x, y, s * .65, s * .25, "#bfe08a", DGREEN, -.15); DOT(x + s * .62, y - s * .12, s * .17, "#bfe08a"); LN(x - s * .1, y, x - s * .5, y + s * .5, DGREEN, 2.4); LN(x - s * .5, y + s * .5, x - s * .85, y + s * .1, DGREEN, 2.4); LN(x + s * .1, y + s * .1, x + s * .15, y + s * .55, DGREEN, 2.4); LN(x + s * .6, y - s * .2, x + s * .9, y - s * .6, DGREEN, 1.6); }
  else if (k === "grenouille") { E(x, y + s * .1, s * .65, s * .42, "#8fd18f", DGREEN); DOT(x - s * .28, y - s * .32, s * .17, "#fff"); DOT(x + s * .28, y - s * .32, s * .17, "#fff"); DOT(x - s * .28, y - s * .32, s * .07, INK); DOT(x + s * .28, y - s * .32, s * .07, INK); ctx.strokeStyle = DGREEN; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(x, y + s * .1, s * .3, .2, 2.9); ctx.stroke(); }
  else if (k === "lapin") { E(x - s * .15, y + s * .25, s * .6, s * .4, "#e9dcc8", "#8a7a5c"); E(x + s * .35, y - s * .1, s * .3, s * .26, "#e9dcc8", "#8a7a5c"); E(x + s * .3, y - s * .62, s * .1, s * .34, "#e9dcc8", "#8a7a5c", .15); E(x + s * .52, y - s * .6, s * .1, s * .34, "#e9dcc8", "#8a7a5c", -.1); DOT(x + s * .45, y - s * .13, 2.5, INK); DOT(x - s * .75, y + s * .2, s * .13, "#fff"); }
  else if (k === "renard") { E(x - s * .1, y + s * .15, s * .6, s * .33, "#e8873a", "#a8561a"); E(x + s * .5, y - s * .05, s * .27, s * .24, "#e8873a", "#a8561a"); ctx.fillStyle = "#e8873a"; ctx.strokeStyle = "#a8561a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + s * .35, y - s * .22); ctx.lineTo(x + s * .4, y - s * .6); ctx.lineTo(x + s * .56, y - s * .25); ctx.closePath(); ctx.fill(); ctx.stroke(); E(x - s * .85, y + s * .1, s * .35, s * .15, "#e8873a", "#a8561a", -.4); DOT(x + s * .55, y - s * .08, 2.5, INK); }
  else if (k === "oiseau" || k === "mesange" || k === "heron" || k === "epervier") {
    var col = k === "mesange" ? "#f2d24a" : k === "epervier" ? "#a9825a" : k === "heron" ? "#aab6c4" : "#6ea8e0"; E(x, y + s * .05, s * .55, s * .36, col, INK); DOT(x + s * .5, y - s * .22, s * .2, col); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + s * .5, y - s * .22, s * .2, 0, 7); ctx.stroke(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(x + s * .68, y - s * .27); ctx.lineTo(x + s * (k === "heron" ? 1.15 : .9), y - s * .2); ctx.lineTo(x + s * .68, y - s * .14); ctx.fill(); DOT(x + s * .52, y - s * .26, 2.2, INK); E(x - s * .1, y + s * .05, s * .3, s * .17, "#00000022", null, -.3); LN(x - s * .1, y + s * .4, x - s * .1, y + s * (k === "heron" ? .85 : .6), INK, 2); if (k === "epervier") LN(x - s * .5, y + s * .1, x - s * .9, y + s * .3, INK, 2.4);
  }
  else if (k === "chenille") { for (i = 0; i < 5; i++) { DOT(x - s * .6 + i * s * .3, y + (i % 2) * -s * .1, s * .2, i === 4 ? "#7cc470" : "#a6dc8e"); } DOT(x + s * .62, y - s * .02, 2.2, INK); }
  else if (k === "champi") { ctx.fillStyle = "#e46a5a"; ctx.beginPath(); ctx.arc(x, y, s * .6, 3.14, 6.283); ctx.closePath(); ctx.fill(); ctx.strokeStyle = DRED; ctx.lineWidth = 2; ctx.stroke(); b3.box(x - s * .15, y, s * .3, s * .55, "#f4ead8", "#9a8a6a", 3); DOT(x - s * .25, y - s * .25, 3, "#fff"); DOT(x + s * .2, y - s * .32, 3, "#fff"); }
  else if (k === "poisson") { E(x, y, s * .6, s * .34, "#8ec3ea", BLUE_D); ctx.fillStyle = "#8ec3ea"; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - s * .5, y); ctx.lineTo(x - s * .95, y - s * .3); ctx.lineTo(x - s * .95, y + s * .3); ctx.closePath(); ctx.fill(); ctx.stroke(); DOT(x + s * .35, y - s * .06, 2.6, INK); }
  else if (k === "serpent") { ctx.strokeStyle = "#7a9a3a"; ctx.lineWidth = s * .26; ctx.beginPath(); for (i = 0; i <= 20; i++) { var xx = x - s * .9 + i * s * .09, yy = y + Math.sin(i * .6) * s * .25; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); DOT(x + s * .93, y + Math.sin(12) * s * .25 - 2, s * .17, "#7a9a3a"); }
  else if (k === "souris") { E(x, y + s * .1, s * .5, s * .32, "#b9b2a8", "#6d675f"); E(x + s * .45, y, s * .2, s * .17, "#b9b2a8", "#6d675f"); DOT(x + s * .35, y - s * .2, s * .13, "#e9c0c0"); DOT(x + s * .52, y - s * .02, 2, INK); ctx.strokeStyle = "#6d675f"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x - s * .5, y + s * .1); ctx.quadraticCurveTo(x - s * .9, y - s * .1, x - s * .95, y + s * .2); ctx.stroke(); }
  else if (k === "chouette") { E(x, y + s * .05, s * .5, s * .62, "#b58b5c", "#6b4a2a"); DOT(x - s * .2, y - s * .2, s * .17, "#fff"); DOT(x + s * .2, y - s * .2, s * .17, "#fff"); DOT(x - s * .2, y - s * .2, s * .08, INK); DOT(x + s * .2, y - s * .2, s * .08, INK); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(x - 4, y - s * .05); ctx.lineTo(x + 4, y - s * .05); ctx.lineTo(x, y + s * .12); ctx.fill(); }
  else if (k === "campagnol") { E(x, y + s * .1, s * .5, s * .33, "#a48a6a", "#6d5a40"); E(x + s * .4, y + s * .02, s * .22, s * .2, "#a48a6a", "#6d5a40"); DOT(x + s * .5, y, 2.2, INK); DOT(x + s * .3, y - s * .2, s * .1, "#c9a98a"); }
  else if (k === "cadavre") { E(x, y + s * .2, s * .7, s * .3, "#cfc7b8", "#8a8272"); LN(x - s * .3, y + s * .05, x + s * .3, y + s * .35, "#8a8272", 2); LN(x + s * .3, y + s * .05, x - s * .3, y + s * .35, "#8a8272", 2); }
  else if (k === "algue") { for (i = -2; i <= 2; i++) { ctx.strokeStyle = i % 2 ? "#4aa86a" : DGREEN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + i * s * .25, y + s * .6); ctx.quadraticCurveTo(x + i * s * .25 + s * .25, y, x + i * s * .25, y - s * .6); ctx.stroke(); } }
  else if (k === "plancton") { for (i = 0; i < 5; i++) { DOT(x + Math.cos(i * 1.7) * s * .5, y + Math.sin(i * 2.3) * s * .35, s * .13, "#6cc29a"); } }
  else if (k === "zoo") { E(x, y, s * .35, s * .22, "#f4c6a0", ORA2, .3); LN(x - s * .3, y - s * .1, x - s * .6, y - s * .3, ORA2, 1.8); LN(x - s * .3, y + s * .1, x - s * .6, y + s * .3, ORA2, 1.8); }
  else if (k === "feuille") { ctx.fillStyle = "#8fd18f"; ctx.strokeStyle = DGREEN; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - s * .8, y + s * .2); ctx.quadraticCurveTo(x, y - s * .9, x + s * .8, y - s * .1); ctx.quadraticCurveTo(x, y + s * .7, x - s * .8, y + s * .2); ctx.fill(); ctx.stroke(); LN(x - s * .8, y + s * .2, x + s * .6, y - s * .08, DGREEN, 1.6); }
};

SFA.theo("c01", {
  icon: function () {
    b3.ico("herbe", W * .17, H * .5, 38); b3.ico("sauterelle", W * .42, H * .48, 38); b3.ico("grenouille", W * .66, H * .48, 38); b3.ico("heron", W * .86, H * .46, 34);
    b3.ar(W * .26, H * .5, W * .33, H * .5, ORANGE, 3); b3.ar(W * .5, H * .5, W * .58, H * .5, ORANGE, 3); b3.ar(W * .74, H * .5, W * .79, H * .5, ORANGE, 3);
    TB("chaînes et réseaux", W * .5, H * .86, BLUE_D, 20);
  },
  anim: function (t) {
    var xs = [.11, .31, .51, .71, .91], ico = ["herbe", "sauterelle", "grenouille", "serpent", "epervier"], nm = ["herbe", "sauterelle", "grenouille", "couleuvre", "épervier"], ro = ["Producteur", "Consommateur I", "Consommateur II", "Consommateur III", "Consommateur IV"];
    var y = H * .36, k = Math.floor(t / 75) % 5, i;
    b3.sun(W * .05, H * .09, 11, t);
    for (i = 0; i < 5; i++) {
      var x = W * xs[i], on = i === k; if (on) { b3.E(x, y, 46, 40, "#fff3de", ORANGE); }
      b3.ico(ico[i], x, y, on ? 32 : 28); TB(nm[i], x, y + 56, on ? ORANGE : INK, 14); TB(ro[i], x, y + 74, i ? BLUE_D : DGREEN, 12);
      if (i < 4) { b3.ar(x + 44, y, W * xs[i + 1] - 44, y, ORANGE, 3); b3.flow(x + 44, y, W * xs[i + 1] - 44, y, t, ORA2, 2); }
      LN(x, y + 84, x, H * .72, AX, 1.5, [4, 4]);
    }
    TB("la flèche va de l'être mangé vers celui qui le mange (matière + énergie)", W * .56, H * .09, INK, 14);
    b3.box(W * .06, H * .72, W * .88, H * .16, "#f4efe6", "#b9a98a", 10);
    b3.ico("champi", W * .12, H * .8, 14); TB("décomposeurs : bactéries, champignons… → CO₂, eau, sels minéraux", W * .52, H * .805, "#6b5a3a", 14);
    b3.ar(W * .035, H * .72, W * .035, H * .4, GREEN, 2.5, [6, 4]); TB("sels", W * .035, H * .5, DGREEN, 12, "left"); TB("minéraux", W * .035, H * .5 + 15, DGREEN, 12, "left");
  },
  th: "<div class=\"tcard\"><b class=\"h\">Chaîne alimentaire</b><p>Une <b>chaîne alimentaire</b> relie des êtres vivants par « qui mange qui ». La <b>flèche</b> ne signifie pas « mange » : elle indique <b>où vont la matière et l'énergie</b>, de l'être mangé vers celui qui le mange. Dans <i>herbe → sauterelle → grenouille</i>, la grenouille mange la sauterelle.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Les rôles</b><ul><li><b>Producteur</b> : fabrique sa matière organique par photosynthèse (plantes, algues). Il est toujours au début.</li><li><b>Consommateur I</b> : herbivore. <b>Consommateur II, III…</b> : carnivores qui mangent un consommateur du niveau précédent. Un <b>omnivore</b> mange des végétaux et des animaux.</li><li><b>Décomposeur</b> (bactéries, champignons, certains insectes) : dégrade la matière morte en CO₂, eau et <b>sels minéraux</b>, que les producteurs réabsorbent. La matière est recyclée.</li></ul></div>" +
    "<div class=\"tcard\"><b class=\"h\">Réseau alimentaire et niveau trophique</b><p>Dans la réalité, un animal a plusieurs proies et plusieurs prédateurs : les chaînes s'entrecroisent en <b>réseau</b>. Pour compter les chaînes, on suit chaque chemin possible du producteur au dernier prédateur.</p><p><b>Niveau trophique d'un omnivore</b> = 1 + moyenne pondérée des niveaux de ses aliments. <i>Exemple :</i> un mulot mange 50 % de glands (niveau 1) et 50 % de chenilles (niveau 2) : 1 + (0,5 × 1 + 0,5 × 2) = 1 + 1,5 = <b>2,5</b>.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Prévoir les effets d'une disparition</b><p>Retirer une espèce se répercute <b>vers le bas</b> (ses proies, moins mangées, augmentent d'abord) et <b>vers le haut</b> (ses prédateurs, privés de nourriture, diminuent). <i>Piège :</i> sans prédateur, les proies ne prospèrent pas indéfiniment : elles finissent par épuiser leur propre nourriture et déclinent à leur tour.</p></div>"
});

SFA.figs("c01", [
  /* 0 Lire une flèche */
  function (p) {
    var y = H * .46; b3.ico("herbe", W * .17, y, 36); b3.ico("sauterelle", W * .5, y, 36); b3.ico("grenouille", W * .83, y, 36);
    b3.ar(W * .27, y, W * .39, y, ORANGE, 3); b3.ar(W * .6, y, W * .72, y, p > 0 ? GREEN : ORANGE, p > 0 ? 5 : 3);
    TB("herbe", W * .17, y + 56, INK, 14); TB("sauterelle", W * .5, y + 56, INK, 14); TB("grenouille", W * .83, y + 56, INK, 14);
    if (p > 0) { ctx.globalAlpha = b3.f(p, 0, .5); b3.pill("matière + énergie", W * .66, y - 32, "#e4f6ee", DGREEN, 14); b3.ar(W * .83, H * .13, W * .5, H * .13, RED, 2.5, [6, 4]); TB("mange", W * .66, H * .09, DRED, 14); ctx.globalAlpha = 1; }
    else TB("Que signifie la flèche ?", W * .66, y - 38, ORANGE, 15);
  },
  /* 1 Reconnaître un producteur */
  function (p) {
    var xs = [.13, .38, .63, .88], ks = ["lapin", "champi", "chene", "renard"], nm = ["lapin", "champignon", "chêne", "renard"], y = H * .45;
    if (p > 0) b3.box(W * .51, H * .12, W * .24, H * .62, "#e4f6ee", GREEN, 12);
    for (var i = 0; i < 4; i++) { b3.ico(ks[i], W * xs[i], y + (i === 2 ? 8 : 0), 32); TB(nm[i], W * xs[i], y + 62, i === 2 && p > 0 ? DGREEN : INK, 15); }
    b3.sun(W * .63, H * .17, 10, tGlob); if (p > 0) { ctx.globalAlpha = b3.f(p, 0, .6); b3.pill("PRODUCTEUR : photosynthèse", W * .63, H * .9, DGREEN, "#fff", 13); ctx.globalAlpha = 1; }
  },
  /* 2 Niveaux d'une chaîne */
  function (p) {
    var xs = [.12, .37, .62, .87], ks = ["chou", "chenille", "mesange", "epervier"], nm = ["chou", "chenille", "mésange", "épervier"], ro = ["Producteur", "Conso. I", "Conso. II", "Conso. III"], y = H * .4;
    for (var i = 0; i < 4; i++) { b3.ico(ks[i], W * xs[i], y, 28); TB(nm[i], W * xs[i], y + 46, INK, 14); if (i < 3) b3.ar(W * xs[i] + 36, y, W * xs[i + 1] - 36, y, ORANGE, 3); if (p > 0) { ctx.globalAlpha = b3.f(p, i * .18, i * .18 + .3); b3.pill(ro[i], W * xs[i], y + 78, i ? "#e3effb" : "#e4f6ee", i ? BLUE_D : DGREEN, 13); ctx.globalAlpha = 1; } }
    if (p <= 0) TB("Rôle de chaque maillon ?", W * .5, H * .88, ORANGE, 15);
  },
  /* 3 Compter les chaînes */
  function (p) {
    var P = { herbe: [.1, .5], lapin: [.38, .25], campagnol: [.38, .72], renard: [.7, .25], buse: [.7, .75] };
    var ic = { herbe: "herbe", lapin: "lapin", campagnol: "campagnol", renard: "renard", buse: "epervier" };
    var E = [["herbe", "lapin"], ["herbe", "campagnol"], ["lapin", "renard"], ["campagnol", "renard"], ["campagnol", "buse"]];
    var hl = p > 0 ? [[0, 2], [1, 3], [1, 4]] : [], cl = [BLUE, GREEN, VIOLET], i;
    E.forEach(function (e, j) { var a = P[e[0]], b = P[e[1]], c = AX; hl.forEach(function (h, q) { if (h.indexOf(j) >= 0 && p > q * .25) c = cl[q]; }); var dy = (e[0] === "campagnol" && e[1] === "renard") ? -6 : 0; b3.ar(W * a[0] + 34, H * a[1] + dy, W * b[0] - 34, H * b[1] + dy, c, c === AX ? 2 : 4); });
    for (var k in P) { b3.ico(ic[k], W * P[k][0], H * P[k][1], 24); TB(k, W * P[k][0], H * P[k][1] + 40, k === "campagnol" && p > 0 ? DGREEN : INK, 14); }
    if (p > 0) { b3.pill("3 chaînes", W * .9, H * .5, DGREEN, "#fff", 15); } else TB("Combien de chaînes ?", W * .9, H * .5, ORANGE, 14, "right");
  },
  /* 4 Disparition des décomposeurs */
  function (p) {
    var cx = W * .5, cy = H * .5; b3.ico("chene", W * .2, H * .38, 34); b3.ico("cadavre", W * .8, H * .45, 28); b3.ico("champi", W * .5, H * .78, 26);
    TB("producteurs", W * .2, H * .62, DGREEN, 14); TB("matière morte", W * .8, H * .72, "#6b5a3a", 14); TB("décomposeurs", W * .5, H * .93, "#6b5a3a", 14);
    b3.ar(W * .3, H * .3, W * .7, H * .37, ORANGE, 3); b3.ar(W * .74, H * .62, W * .56, H * .75, GREY, 3); b3.ar(W * .43, H * .75, W * .24, H * .62, GREEN, 3);
    TB("consommateurs", W * .5, H * .22, ORANGE, 13); TB("sels minéraux", W * .3, H * .72, DGREEN, 12);
    if (p > 0) { ctx.globalAlpha = b3.f(p, 0, .5); b3.cross(W * .5, H * .78, 30, RED); b3.pill("sels bloqués : le sol s'appauvrit", W * .5, H * .54, "#fdecea", DRED, 13); ctx.globalAlpha = 1; }
  },
  /* 5 Niveau trophique d'un omnivore */
  function (p) {
    var x0 = W * .1, w = W * .8, y = H * .3, parts = [[.6, "#9ad28a", "végétaux 60 %", 1], [.3, "#8ec3ea", "herbivores 30 %", 2], [.1, "#f2a28a", "carnivores 10 %", 3]], x = x0;
    parts.forEach(function (q) { b3.box(x, y, w * q[0], 44, q[1], INK, 0); if (q[0] > .15) TB(q[2], x + w * q[0] / 2, y + 27, INK, 13); x += w * q[0]; });
    TB("niveau 1", x0 + w * .3, y - 8, DGREEN, 13); TB("2", x0 + w * .75, y - 8, BLUE_D, 13); TB("3", x0 + w * .95, y - 8, DRED, 13);
    var sy = H * .72, sx = function (v) { return W * .1 + (v - 1) / 3 * W * .8; }; LN(sx(1), sy, sx(4), sy, INK, 2);
    for (var v = 1; v <= 4; v++) { LN(sx(v), sy - 5, sx(v), sy + 5, INK, 2); TB(v, sx(v), sy + 22, GREY, 13); }
    TB("niveau trophique", W * .5, H * .93, GREY, 13);
    if (p > 0) { var a = b3.f(p, 0, .6); ctx.globalAlpha = a; TB("0,6×1 + 0,3×2 + 0,1×3 = 1,5", W * .5, H * .58, ORANGE, 14); DOT(sx(2.5), sy, 9, ORANGE); b3.pill("2,5", sx(2.5), sy - 22, ORANGE, "#fff", 14); ctx.globalAlpha = 1; }
  },
  /* 6 Retirer le renard */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .78, gh = H * .62, X = function (a) { return gx + a / 4 * gw; }, Y = function (v) { return gy - v / 280 * gh; };
    b3.axes(gx, gy, gw + 10, gh + 8, "année", "%"); for (var a = 0; a <= 4; a++) TB(a, X(a), gy + 18, GREY, 12);
    var lap = [100, 180, 260, 120], her = [100, 80, 35, 20];
    var k = p > 0 ? 1 + Math.floor(p * 3.01) : 1; k = Math.min(4, k + (p > 0 ? 1 : 0)); if (p <= 0) k = 1;
    b3.curve(lap.map(function (v, i) { return [X(i), Y(v)]; }), BLUE, 3.5, p > 0 ? 4 : 1); b3.curve(her.map(function (v, i) { return [X(i), Y(v)]; }), GREEN, 3.5, p > 0 ? 4 : 1);
    lap.forEach(function (v, i) { if (p > 0 || i === 0) DOT(X(i), Y(v), 5, BLUE); }); her.forEach(function (v, i) { if (p > 0 || i === 0) DOT(X(i), Y(v), 5, GREEN); });
    LN(gx, Y(100), gx + gw, Y(100), AX, 1.2, [4, 4]); TB("100", gx - 6, Y(100) + 4, GREY, 12, "right"); if (p > 0) { TB("lapins", X(2) + 10, Y(260) - 10, BLUE_D, 14, "left"); TB("herbe", X(2.2), Y(35) - 12, DGREEN, 14, "left"); }
    if (p > 0) { ctx.globalAlpha = b3.f(p, .5, 1); b3.ar(X(3), Y(120), X(4), Y(70), BLUE, 2.5, [5, 4]); b3.ar(X(3), Y(20), X(4), Y(24), GREEN, 2.5, [5, 4]); TB("prévision : baisse puis lent retour", W * .5, H * .1, INK, 13); ctx.globalAlpha = 1; }
    else TB("après la disparition du renard", W * .5, H * .1, ORANGE, 14);
  },
  /* 7 Devenir d'un cadavre */
  function (p) {
    var xs = [.12, .38, .63, .88], ks = ["cadavre", "champi", null, "chene"], nm = ["renard mort", "décomposeurs", "sels minéraux", "producteurs"], y = H * .4;
    for (var i = 0; i < 4; i++) {
      var x = W * xs[i]; if (ks[i]) b3.ico(ks[i], x, y, 28); else { b3.box(x - 34, y - 22, 68, 44, "#e4f6ee", GREEN, 10); TB("Ca²⁺ K⁺", x, y + 5, DGREEN, 13); TB("NO₃⁻", x, y + 20, DGREEN, 11); }
      TB(nm[i], x, y + 54, INK, 14); if (i < 3) b3.ar(x + 42, y, W * xs[i + 1] - 42, y, p > 0 ? GREEN : ORANGE, p > 0 ? 4 : 3);
    }
    if (p > 0) { ctx.globalAlpha = b3.f(p, 0, .6); b3.ar(W * .38, y + 80, W * .38, y + 110, GREY, 2.5); TB("CO₂ + eau", W * .38, y + 128, GREY, 14); b3.pill("la matière est recyclée", W * .5, H * .1, "#e4f6ee", DGREEN, 14); ctx.globalAlpha = 1; }
  },
  /* 8 Réseau à reconstituer */
  function (p) {
    var P = { chene: [.1, .5], chenille: [.34, .22], mulot: [.4, .76], mesange: [.62, .22], chouette: [.87, .45], renard: [.85, .85] }, ic = { chene: "chene", chenille: "chenille", mulot: "souris", mesange: "mesange", chouette: "chouette", renard: "renard" };
    var E = [["chene", "chenille"], ["chene", "mulot"], ["chenille", "mulot"], ["chenille", "mesange"], ["mulot", "chouette"], ["mesange", "chouette"], ["mulot", "renard"]];
    var long = [["chene", "chenille"], ["chenille", "mesange"], ["mesange", "chouette"]];
    E.forEach(function (e) { var a = P[e[0]], b = P[e[1]], on = p > 0 && long.some(function (l) { return l[0] === e[0] && l[1] === e[1]; }); var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx * W, dy * H); b3.ar(W * a[0] + dx * W / l * 32, H * a[1] + dy * H / l * 32, W * b[0] - dx * W / l * 34, H * b[1] - dy * H / l * 34, on ? GREEN : GREY, on ? 4.5 : 2.2); });
    for (var k in P) { b3.ico(ic[k], W * P[k][0], H * P[k][1], 22); TB(k, W * P[k][0], H * P[k][1] + 38, INK, 13); }
    if (p > 0) { b3.pill("niveau 2,5", W * P.mulot[0], H * P.mulot[1] - 36, ORANGE, "#fff", 13); b3.pill("7 flèches · 4 maillons", W * .5, H * .06 + 6, DGREEN, "#fff", 13); }
  },
  /* 9 Prévoir à court terme */
  function (p) {
    var xs = [.12, .37, .62, .87], ks = ["herbe", "sauterelle", "grenouille", "serpent"], nm = ["herbe", "sauterelle", "grenouille", "couleuvre"], y = H * .45;
    for (var i = 0; i < 4; i++) { b3.ico(ks[i], W * xs[i], y, 28); TB(nm[i], W * xs[i], y + 48, INK, 14); if (i < 3) b3.ar(W * xs[i] + 38, y, W * xs[i + 1] - 38, y, GREY, 2.5); }
    b3.cross(W * .62, y, 34, RED); b3.pill("pollution", W * .62, y - 50, "#fdecea", DRED, 13);
    if (p > 0) { ctx.globalAlpha = b3.f(p, 0, .6); b3.ar(W * .37, y - 40, W * .37, y - 80, GREEN, 4); TB("augmente", W * .37, y - 88, DGREEN, 13); b3.ar(W * .87, y - 80, W * .87, y - 40, RED, 4); TB("diminue", W * .87, y - 88, DRED, 13); ctx.globalAlpha = 1; }
  }
]);
