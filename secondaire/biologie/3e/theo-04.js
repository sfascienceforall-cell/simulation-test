/* Biologie 3e · chapitre 4 : absorption et transport des nutriments */
b3.pt = function (pts, u) {
  var L = [], tot = 0, i; for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  var s = (u % 1) * tot; for (i = 0; i < L.length; i++) { if (s <= L[i] || i === L.length - 1) { var f = L[i] ? Math.min(1, s / L[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } s -= L[i]; }
};
b3.poly = function (pts, c, w, dash) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(function (q, i) { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.setLineDash([]); };
b3.vill = function (x, yb, w, h) {
  /* villosité : base en (x, yb) centrée, largeur w, hauteur h */
  ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.lineTo(x - w / 2, yb - h + w / 2); ctx.arc(x, yb - h + w / 2, w / 2, 3.1416, 0); ctx.lineTo(x + w / 2, yb); ctx.closePath(); ctx.fillStyle = "#fbe3de"; ctx.fill(); ctx.strokeStyle = "#d49a8f"; ctx.lineWidth = 3; ctx.stroke();
  b3.poly([[x - w * .2, yb], [x - w * .2, yb - h + w * .6], [x - w * .02, yb - h + w * .42], [x - w * .02, yb]], RED, 4);
  b3.poly([[x + w * .22, yb], [x + w * .22, yb - h + w * .62]], "#e8b100", w * .2);
};
SFA.theo("c04", {
  icon: function () {
    var i; for (i = 0; i < 5; i++) b3.vill(W * (.1 + i * .1), H * .72, 30, 90 + (i % 2) * 10);
    LN(W * .04, H * .72, W * .6, H * .72, "#d49a8f", 4); TB("surface × 600", W * .8, H * .36, ORANGE, 24); TB("villosités", W * .8, H * .56, BLUE_D, 18); TB("→ foie", W * .8, H * .76, DRED, 18);
  },
  anim: function (t) {
    var xv = 190, yb = 255, w = 84, h = 175, k = W / 700, m = H / 300, i;
    ctx.save(); ctx.scale(k, m);
    b3.box(10, 20, 100, 250, "#f4efe6", null, 10); TB("cavité de", 60, 218, "#6b5a3a", 14); TB("l'intestin", 60, 236, "#6b5a3a", 14); TB("(lumière)", 60, 254, "#6b5a3a", 13);
    b3.vill(xv, yb, w, h); LN(xv - 60, yb + 2, xv + 60, yb + 2, "#d49a8f", 4);
    TB("capillaire sanguin", xv - 60, 52, RED, 13, "right"); TB("chylifère (lymphe)", xv + 56, 52, "#a07d00", 13, "left");
    var gl = [[75, 150], [165, 150], [xv - w * .11, 150], [xv - w * .11, yb], [260, yb + 20], [420, yb + 20], [420, 205]];
    var gl2 = [[75, 190], [165, 190], [xv - w * .11, 190], [xv - w * .11, yb], [260, yb + 20], [420, yb + 20], [420, 205]];
    var fa = [[75, 120], [165, 120], [xv + w * .22, 120], [xv + w * .22, yb - 4], [xv + w * .22, yb + 24], [300, yb + 40], [560, yb + 40], [560, 250]];
    b3.poly([[xv - w * .11, yb], [260, yb + 20], [420, yb + 20], [420, 190]], "rgba(226,75,74,.35)", 10); b3.poly([[xv + w * .22, yb], [xv + w * .22, yb + 24], [300, yb + 40], [560, yb + 40]], "rgba(232,177,0,.35)", 8);
    b3.box(380, 80, 200, 110, "#e9c8a8", "#a8785a", 20); TB("FOIE", 480, 122, "#6b4a2a", 20); TB("stocke le glucose", 480, 148, "#6b4a2a", 13); TB("(glycogène)", 480, 166, "#6b4a2a", 13);
    TB("veine porte", 340, yb + 14, RED, 13, "center"); TB("lymphe → veine sous-clavière → cœur", 560, yb + 62, "#a07d00", 13, "center");
    for (i = 0; i < 4; i++) { var u = (t * .004 + i / 4) % 1, q = b3.pt(i % 2 ? gl2 : gl, u); DOT(q[0], q[1], 6, BLUE); }
    for (i = 0; i < 3; i++) { var u2 = (t * .004 + i / 3 + .1) % 1, q2 = b3.pt(fa, u2); DOT(q2[0], q2[1], 6, ORANGE); }
    DOT(500, 205, 6, BLUE); TB("glucose, acides aminés, vitamines, eau, sels", 160, 24, BLUE_D, 13, "left"); TB("acides gras + glycérol", 390, 40, ORANGE, 13, "left");
    ctx.restore();
  },
  th: "<div class=\"tcard\"><b class=\"h\">L'absorption</b><p>Après la digestion, les <b>nutriments</b> (glucose, acides aminés, acides gras, glycérol, mais aussi eau, sels minéraux, vitamines) traversent la <b>paroi de l'intestin grêle</b>, formée d'une seule couche de cellules, pour passer dans le <b>sang</b> ou la <b>lymphe</b>. C'est l'<b>absorption</b>. Elle se fait surtout dans l'intestin grêle ; le gros intestin absorbe surtout de l'eau.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Une surface immense grâce aux replis</b><p>La paroi présente trois niveaux de repliement : les <b>plis</b> (environ × 3), les <b>villosités</b> (× 10) et les <b>microvillosités</b> (× 20), soit un facteur 3 × 10 × 20 = <b>× 600</b>.</p><p><i>Exemple chiffré :</i> un tube lisse de 4 m de long et 2,5 cm de diamètre a une surface latérale π × d × L = π × 0,025 × 4 ≈ <b>0,314 m²</b>. Avec les replis : 0,314 × 600 ≈ <b>188 m²</b>, soit environ 105 fois la peau (1,8 m²). Plus la surface est grande, plus l'absorption est efficace.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Deux voies de transport</b><ul><li><b>Voie sanguine</b> (glucose, acides aminés, vitamines hydrosolubles, eau, sels) : capillaires de la villosité → <b>veine porte</b> → <b>foie</b> → veine cave inférieure → cœur → tout le corps.</li><li><b>Voie lymphatique</b> (acides gras et glycérol, vitamines liposolubles) : vaisseau <b>chylifère</b> de la villosité → lymphe → veine sous-clavière → sang, sans passer d'abord par le foie.</li></ul></div>" +
    "<div class=\"tcard\"><b class=\"h\">Le foie et la glycémie</b><p>La <b>glycémie</b> est la concentration de glucose dans le sang (environ 0,9 g/L à jeun). Après un repas elle monte (par exemple 0,90 → 1,50 g/L en 30 minutes), puis redescend : le glucose n'a pas disparu, il est <b>capté par le foie</b> et les muscles, stocké sous forme de glycogène ou consommé. Entre les repas, le foie le libère. Le sang de la veine porte est donc le plus riche en glucose juste après un repas. Un repas riche en fibres ralentit l'absorption : le pic est plus bas et plus tardif.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Quand on retire une partie de l'intestin</b><p>Moins de longueur, c'est moins de surface d'absorption. <i>Exemple :</i> 5,0 m − 40 % = 3,0 m (suffisant) ; 5,0 m − 65 % = 1,75 m (moins de 2 m : « syndrome de l'intestin court »). La fin de l'iléon absorbe la vitamine B12 et les sels biliaires : sans elle, diarrhée et graisses mal digérées, puis anémie. La carence en B12 apparaît tard car les réserves (environ 2 000 µg) durent 2 000 / 2,5 = 800 jours, soit plus de 2 ans.</p></div>"
});

SFA.figs("c04", [
  /* 0 Trois replis */
  function (p) {
    var i, nm = ["plis", "villosités", "microvillosités"], mu = ["× 3", "× 10", "× 20"];
    for (i = 0; i < 3; i++) { b3.box(W * (.03 + i * .33), H * .15, W * .3, H * .58, "#fdf6f3", "#e6b3a8", 8); TB(nm[i], W * (.18 + i * .33), H * .83, INK, 14); }
    ctx.strokeStyle = "#d49a8f"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W * .05, H * .6); ctx.bezierCurveTo(W * .08, H * .2, W * .13, H * .2, W * .15, H * .6); ctx.bezierCurveTo(W * .17, H * .2, W * .22, H * .2, W * .25, H * .6); ctx.stroke();
    var x0 = W * .38, j; for (j = 0; j < 4; j++) { var xx = x0 + j * W * .06; ctx.fillStyle = "#fbe3de"; ctx.strokeStyle = "#d49a8f"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(xx - 9, H * .26, 18, H * .34, 9); ctx.fill(); ctx.stroke(); }
    LN(W * .36, H * .62, W * .62, H * .62, "#d49a8f", 4);
    var x1 = W * .71; ctx.strokeStyle = "#d49a8f"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x1 - 6, H * .6); ctx.lineTo(x1 + W * .2, H * .6); ctx.stroke(); for (j = 0; j < 14; j++) LN(x1 + j * 7 - 2, H * .6, x1 + j * 7 - 2, H * .6 - 28 - (j % 2) * 3, "#c98f84", 2.4);
    if (p > 0) { for (i = 0; i < 3; i++) { ctx.globalAlpha = b3.f(p, i * .2, i * .2 + .3); b3.pill(mu[i], W * (.18 + i * .33), H * .09, i === 0 ? BLUE : i === 1 ? GREEN : ORANGE, "#fff", 15); ctx.globalAlpha = 1; } b3.pill("3 × 10 × 20 = × 600", W * .5, H * .95, DGREEN, "#fff", 14); } else TB("trois niveaux de repliement", W * .5, H * .09, ORANGE, 15);
  },
  /* 1 Vers le foie */
  function (p) {
    var y = H * .5; b3.box(W * .04, y - 40, W * .2, 80, "#fbe3de", "#d49a8f", 14); TB("intestin", W * .14, y + 5, INK, 14); TB("grêle", W * .14, y + 22, INK, 14);
    b3.box(W * .45, y - 50, W * .22, 100, "#e9c8a8", "#a8785a", 20); TB("foie", W * .56, y + 6, "#6b4a2a", 17); b3.box(W * .82, y - 36, W * .15, 72, "#fde0de", RED, 14); TB("cœur", W * .895, y + 6, DRED, 15);
    b3.ar(W * .26, y, W * .43, y, p > 0 ? BLUE : GREY, p > 0 ? 6 : 3); b3.ar(W * .69, y, W * .8, y, GREY, 3);
    if (p > 0) { b3.pill("veine porte", W * .345, y - 26, BLUE, "#fff", 15); TB("glucose", W * .345, y + 28, BLUE_D, 14); TB("veine cave", W * .745, y - 14, GREY, 12); } else TB("quel vaisseau ?", W * .345, y - 22, ORANGE, 16);
  },
  /* 2 Surface d'un tube lisse et plissé */
  function (p) {
    var base = H * .8, k = 11, a = [[.314, "tube lisse", "0,314 m²", BLUE], [1.8, "peau", "1,8 m²", ORANGE], [188.4, "intestin plissé", "≈ 188 m²", GREEN]], x = W * .1, i;
    for (i = 0; i < 3; i++) { var s = Math.sqrt(a[i][0]) * k; if (i < 2 || p > 0) { var sc = i === 2 ? b3.f(p, 0, .6) : 1; ctx.fillStyle = a[i][3] + "55"; ctx.strokeStyle = a[i][3]; ctx.lineWidth = 2.5; ctx.fillRect(x, base - s * sc, s * sc, s * sc); ctx.strokeRect(x, base - s * sc, s * sc, s * sc); } TB(a[i][1], x + (i < 2 ? 0 : 60), base + 18, INK, 13, i < 2 ? "left" : "left"); if (i < 2 || p > 0) TB(a[i][2], x + (i < 2 ? 0 : 60), base + 36, a[i][3] === GREEN ? DGREEN : a[i][3], 13, "left"); x += i === 0 ? 90 : 90; }
    TB("aires à l'échelle (carrés)", W * .5, H * .08, GREY, 13); if (p > 0) b3.pill("≈ 105 × la peau", W * .78, H * .25, DGREEN, "#fff", 14); else TB("× 600 ?", W * .78, H * .3, ORANGE, 24);
  },
  /* 3 Courbe de glycémie */
  function (p) {
    var gx = W * .13, gb = H * .8, gw = W * .8, gh = H * .56, X = function (t) { return gx + t / 180 * gw; }, Y = function (g) { return gb - (g - .6) / 1.1 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "t (min)", "g/L"); [0, 30, 60, 120, 180].forEach(function (t) { TB(t, X(t), gb + 18, GREY, 12); }); [.9, 1.2, 1.5].forEach(function (g) { LN(gx, Y(g), gx + gw, Y(g), "#eef0f2", 1); TB(String(g).replace(".", ",") + (g === 1.2 || g === 1.5 ? "" : "0").slice(0, 0), gx - 6, Y(g) + 4, GREY, 12, "right"); });
    var d = [[0, .9], [30, 1.5], [60, 1.3], [120, 1.0], [180, .9]]; b3.curve(d.map(function (q) { return [X(q[0]), Y(q[1])]; }), BLUE, 3.5, p > 0 ? 5 : 2); DOT(X(0), Y(.9), 5, BLUE_D);
    if (p > 0) { d.forEach(function (q) { DOT(X(q[0]), Y(q[1]), 5, BLUE_D); }); LN(X(0), Y(.9), X(180), Y(.9), GREEN, 1.5, [5, 4]); b3.ar(X(30), Y(.9) + 2, X(30), Y(1.5) + 4, ORANGE, 3); b3.pill("max à 30 min : + 0,60 g/L", X(75), Y(1.5) - 12, "#fff3de", ORANGE, 14); } else TB("après le repas…", X(95), Y(1.5), ORANGE, 15);
  },
  /* 4 La voie des graisses */
  function (p) {
    var xv = W * .3, yb = H * .8, w = 80, h = H * .62; b3.vill(xv, yb, w, h); LN(xv - 60, yb + 2, xv + 60, yb + 2, "#d49a8f", 4);
    TB("capillaire", xv - 56, H * .2, RED, 13, "right"); TB("chylifère", xv + 52, H * .2, "#a07d00", 13, "left"); var i; for (i = 0; i < 3; i++) DOT(W * .08 + i * 12, H * .45 + i * 18, 6, ORANGE); TB("acides gras", W * .1, H * .78, ORANGE, 13);
    b3.ar(W * .15, H * .5, xv + w * .22 - 12, H * .5, ORANGE, 3);
    if (p > 0) { var pts = [[xv + w * .22, yb], [xv + w * .22, yb + 22], [W * .55, yb + 22], [W * .8, H * .45]]; b3.poly(pts, "rgba(232,177,0,.6)", 8); for (i = 0; i < 3; i++) { var q = b3.pt(pts, (tGlob * .006 + i / 3) % 1); DOT(q[0], q[1], 6, ORANGE); } b3.pill("lymphe", W * .55, yb - 6, "#fff7da", "#a07d00", 14); b3.box(W * .74, H * .3, W * .24, H * .3, "#fde0de", RED, 14); TB("veine", W * .86, H * .43, DRED, 14); TB("sous-clavière", W * .86, H * .53, DRED, 13); } else TB("par où ?", W * .6, H * .4, ORANGE, 22);
  },
  /* 5 Grêle de 5 mètres */
  function (p) {
    var x0 = W * .08, sc = W * .8 / 5, y = [H * .25, H * .5, H * .75], v = [5, 3, 1.75], lab = ["départ : 5,0 m", "− 40 % : 3,0 m", "− 65 % : 1,75 m"], i;
    for (i = 0; i < 3; i++) { b3.box(x0, y[i] - 14, 5 * sc, 28, "#f4efe6", "#c8bfae", 6); if (i === 0 || p > 0) { var f = i === 0 ? 1 : b3.f(p, i * .15, i * .15 + .5); b3.box(x0, y[i] - 14, v[i] * sc * f + (5 - v[i]) * sc * (1 - f) * 0 + 0, 28, i === 2 ? "#f2a28a" : "#9ad28a", INK, 6); } TB(lab[i], x0 + 4, y[i] - 22, INK, 13, "left"); }
    var xl = x0 + 2 * sc; LN(xl, H * .12, xl, H * .9, RED, 2, [6, 4]); TB("2 m", xl, H * .95, DRED, 13);
    if (p > 0) { b3.pill("intestin court", x0 + 4.1 * sc, y[2] + 8, "#fdecea", DRED, 13); b3.check(x0 + 4.1 * sc, y[1], 10); } else TB("suffisant ?", x0 + 4.1 * sc, y[1] + 4, ORANGE, 15);
  },
  /* 6 Fin de l'iléon retirée */
  function (p) {
    var x0 = W * .06, w = W * .88, y = H * .4, segs = [["duodénum", .15], ["jéjunum", .45], ["iléon", .4]], x = x0, cl = ["#f2c9a8", "#eab6a0", "#e0a090"], i;
    for (i = 0; i < 3; i++) { var ww = w * segs[i][1]; b3.box(x, y - 22, ww - 3, 44, cl[i], INK, 14); TB(segs[i][0], x + ww / 2, y + 5, INK, i ? 13 : 10); x += ww; }
    var xe = x0 + w - 70; b3.box(xe, y - 26, 68, 52, p > 0 ? "rgba(226,75,74,.2)" : "rgba(255,214,168,.5)", p > 0 ? RED : ORANGE, 10); TB("B12 + sels biliaires", xe + 34, y - 36, ORANGE, 12);
    if (p > 0) { b3.cross(xe + 34, y, 20, RED); b3.pill("court terme : diarrhée, graisses mal digérées", W * .5, H * .68, "#fdecea", DRED, 13); b3.pill("long terme : anémie (2 000 / 2,5 = 800 j ≈ 2,2 ans)", W * .5, H * .83, "#fff3de", ORANGE, 13); } else TB("dernier segment retiré : conséquences ?", W * .5, H * .75, ORANGE, 16);
  },
  /* 7 Boisson ou repas complet */
  function (p) {
    var gx = W * .13, gb = H * .8, gw = W * .8, gh = H * .56, X = function (t) { return gx + t / 120 * gw; }, Y = function (g) { return gb - g * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "temps", "glycémie");
    LN(gx, Y(.35), gx + gw, Y(.35), AX, 1.2, [4, 4]); TB("à jeun", gx + 4, Y(.35) - 6, GREY, 12, "left");
    var d1 = [[0, .35], [15, .6], [30, .95], [50, .7], [80, .45], [120, .35]], d2 = [[0, .35], [20, .45], [50, .62], [80, .55], [120, .4]];
    if (p > 0) { b3.curve(d1.map(function (q) { return [X(q[0]), Y(q[1])]; }), RED, 3.5); b3.curve(d2.map(function (q) { return [X(q[0]), Y(q[1])]; }), GREEN, 3.5); b3.pill("boisson sucrée : pic haut, précoce", W * .62, H * .12, "#fdecea", DRED, 13); b3.pill("repas à fibres : pic bas, tardif", W * .62, H * .25, "#e4f6ee", DGREEN, 13); }
    else { b3.box(W * .22, H * .22, 40, 56, "#fdecea", RED, 8); TB("boisson", W * .22 + 20, H * .22 + 78, DRED, 13); b3.E(W * .6, H * .36, 50, 28, "#e4f6ee", GREEN); TB("repas complet", W * .6, H * .36 + 60, DGREEN, 13); TB("même quantité de glucose", W * .5, H * .1, ORANGE, 14); }
  },
  /* 8 Villosités abîmées */
  function (p) {
    var base = H * .8, i, v = [188, 37.7], x = [W * .15, W * .55], sc = H * .55 / 188;
    for (i = 0; i < 2; i++) { if (i === 0 || p > 0) { var f = i === 0 ? 1 : b3.f(p, 0, .6), hh = v[i] * sc * (i ? f + (1 - f) * (188 / 37.7) : 1); b3.box(x[i], base - hh, W * .22, hh, i ? "#f2a28a" : "#9ad28a", INK, 4); TB(i ? "37,7 m²" : "188 m²", x[i] + W * .11, base - hh - 8, INK, 14); } TB(i ? "villosités × 2" : "villosités × 10", x[i] + W * .11, base + 20, INK, 13); }
    if (p > 0) { b3.pill("÷ 5 : − 80 %", W * .8, H * .3, "#fdecea", DRED, 15); TB("malabsorption, carences,", W * .8, H * .5, DRED, 12); TB("retard de croissance", W * .8, H * .6, DRED, 12); } else TB("surface après la maladie ?", W * .78, H * .3, ORANGE, 14);
    b3.ar(W * .4, H * .5, W * .52, H * .5, GREY, 3);
  },
  /* 9 Où est le glucose le plus concentré ? */
  function (p) {
    var nm = ["veine porte", "sortie du foie", "artère du bras", "veine cave sup."], v = [1, .62, .55, .5], i, gb = H * .8;
    LN(W * .08, gb, W * .95, gb, INK, 2);
    for (i = 0; i < 4; i++) { var x = W * (.1 + i * .22), hh = v[i] * H * .5 * (p > 0 || i === 0 ? 1 : 1); var on = i === 0 && p > 0; b3.box(x, gb - hh, W * .16, hh, on ? RED + "aa" : "#dfe6ee", on ? RED : GREY, 4); TB(nm[i], x + W * .08, gb + 16, on ? DRED : INK, 12); }
    if (p > 0) { b3.pill("la plus concentrée", W * .18, gb - H * .5 - 22, DRED, "#fff", 13); TB("(le foie capte le glucose)", W * .6, H * .15, GREY, 13); } else TB("concentration en glucose après un repas sucré ?", W * .5, H * .1, ORANGE, 14);
  }
]);
