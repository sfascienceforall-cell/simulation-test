/* Biologie 3e · chapitre 3 : appareil digestif et digestion */
b3.cube = function (x, y, s, n, col) {
  /* cube vu en perspective cavalière : face avant en (x, y) coin haut-gauche, côté s, découpé en n × n × n */
  var d = s * .38, i;
  ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d); ctx.lineTo(x + s + d, y - d); ctx.lineTo(x + s, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.beginPath(); ctx.moveTo(x + s, y); ctx.lineTo(x + s + d, y - d); ctx.lineTo(x + s + d, y + s - d); ctx.lineTo(x + s, y + s); ctx.closePath(); ctx.fill();
  ctx.lineWidth = .9; ctx.strokeStyle = "rgba(60,60,60,.7)";
  for (i = 1; i < n; i++) { var u = s * i / n, v = d * i / n; LN(x + u, y, x + u, y + s, "rgba(60,60,60,.7)", .9); LN(x, y + u, x + s, y + u, "rgba(60,60,60,.7)", .9); LN(x + u, y, x + u + d, y - d, "rgba(60,60,60,.7)", .9); LN(x + s, y + u, x + s + d, y + u - d, "rgba(60,60,60,.7)", .9); LN(x + v, y - v, x + s + v, y - v, "rgba(60,60,60,.7)", .9); LN(x + s + v, y - v, x + s + v, y + s - v, "rgba(60,60,60,.7)", .9); }
  ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.strokeRect(x, y, s, s); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d); ctx.lineTo(x + s + d, y - d); ctx.lineTo(x + s + d, y + s - d); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y); ctx.lineTo(x + s + d, y - d); ctx.stroke();
};
b3.tube = function (x, y, w, h, fill, lab) {
  /* tube à essai : (x,y) haut centre */
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.fillStyle = fill;
  var lv = y + h * .28; ctx.beginPath(); ctx.moveTo(x - w / 2, lv); ctx.lineTo(x - w / 2, y + h - w / 2); ctx.arc(x, y + h - w / 2, w / 2, 3.1416, 0, true); ctx.lineTo(x + w / 2, lv); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - w / 2 - 3, y); ctx.lineTo(x - w / 2, y); ctx.lineTo(x - w / 2, y + h - w / 2); ctx.arc(x, y + h - w / 2, w / 2, 3.1416, 0, true); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w / 2 + 3, y); ctx.stroke();
  if (lab) TB(lab, x, y + h + 18, INK, 14);
};
b3.tract = function (x, y, sc, hl) {
  /* appareil digestif très schématique : (x,y) = centre de l'estomac ; hl = 1 estomac, 2 intestin grêle, 3 gros intestin */
  var S = sc, i, c1 = "#e9b8ad", c2 = "#e6a79b", c3 = "#d49a8f"; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = c1; ctx.lineWidth = 11 * S; ctx.beginPath(); ctx.moveTo(x - 25 * S, y - 72 * S); ctx.lineTo(x - 25 * S, y - 18 * S); ctx.stroke();
  b3.E(x, y, 42 * S, 30 * S, hl === 1 ? "#ffd6a8" : c1, hl === 1 ? ORANGE : "#c98f84", .3);
  ctx.strokeStyle = hl === 3 ? ORANGE : c3; ctx.lineWidth = 12 * S; ctx.beginPath(); ctx.moveTo(x - 60 * S, y + 40 * S); ctx.lineTo(x - 60 * S, y + 100 * S); ctx.lineTo(x + 125 * S, y + 100 * S); ctx.lineTo(x + 125 * S, y + 28 * S); ctx.stroke();
  ctx.strokeStyle = hl === 2 ? ORANGE : c2; ctx.lineWidth = 9 * S; ctx.beginPath(); ctx.moveTo(x + 25 * S, y + 28 * S);
  for (i = 0; i <= 15; i++) ctx.lineTo(x + (28 + i * 6) * S, y + (50 + Math.sin(i * 1.4) * 13) * S); ctx.stroke();
};
SFA.theo("c03", {
  icon: function () {
    b3.tract(W * .2, H * .33, .85, 2);
    TB("amylase · pepsine · lipase", W * .68, H * .36, ORANGE, 17, "center"); TB("enzymes", W * .68, H * .56, BLUE_D, 26); TB("digestion", W * .68, H * .76, DGREEN, 20);
  },
  anim: function (t) {
    var k = W / 700, m = H / 300, pts = [[50, 55, 0], [160, 55, 0], [160, 95, 1], [160, 140, 2], [205, 170, 2], [250, 205, 3]], i;
    for (i = 0; i <= 20; i++) pts.push([250 + i * 14, 205 + Math.sin(i * 1.1) * 14, 3]);
    pts.push([560, 205, 4]); pts.push([640, 205, 4]); pts.push([640, 120, 4]); pts.push([540, 120, 4]);
    function P(q) { return [q[0] * k, q[1] * m]; }
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    var seg = [[0, 5], [0, 5]]; // tracé global
    ctx.strokeStyle = "#e6b3a8"; ctx.lineWidth = 24 * m; ctx.beginPath(); pts.forEach(function (q, j) { var r = P(q); j ? ctx.lineTo(r[0], r[1]) : ctx.moveTo(r[0], r[1]); }); ctx.stroke();
    ctx.strokeStyle = "#fbe3de"; ctx.lineWidth = 17 * m; ctx.beginPath(); pts.forEach(function (q, j) { var r = P(q); j ? ctx.lineTo(r[0], r[1]) : ctx.moveTo(r[0], r[1]); }); ctx.stroke();
    b3.E(160 * k, 150 * m, 62 * k, 42 * m, "#fbe3de", "#e6b3a8"); ctx.lineWidth = 3; ctx.strokeStyle = "#e6b3a8"; ctx.stroke();
    var L = [], tot = 0; for (i = 1; i < pts.length; i++) { var d = Math.hypot((pts[i][0] - pts[i - 1][0]) * k, (pts[i][1] - pts[i - 1][1]) * m); L.push(d); tot += d; }
    var s = (t * 1.6) % (tot + 40), dd = Math.min(s, tot), j = 0; while (j < L.length - 1 && dd > L[j]) { dd -= L[j]; j++; }
    var a = P(pts[j]), b = P(pts[j + 1]), f = L[j] ? dd / L[j] : 0, bx = a[0] + (b[0] - a[0]) * f, by = a[1] + (b[1] - a[1]) * f, st = pts[j + 1][2];
    var names = ["Bouche", "Œsophage", "Estomac", "Intestin grêle", "Gros intestin"], txt = ["amylase salivaire : amidon → sucres", "transit seulement (pas de digestion)", "pepsine, pH ≈ 2 : protéines", "bile + sucs pancréatique et intestinal : fin de la digestion", "eau absorbée, matières fécales"], col = [BLUE, GREY, RED, GREEN, ORANGE];
    var tx = [[50, 32], [180, 85], [160, 218], [400, 172], [585, 100]];
    for (i = 0; i < 5; i++) { var on = i === st, q = tx[i]; TB(names[i], q[0] * k, q[1] * m + (i === 2 ? 0 : 0), on ? col[i] : GREY, on ? 15 : 13, i === 1 ? "left" : "center"); }
    DOT(bx, by, 9 * m + 2, st === 3 ? "#9ad28a" : st === 2 ? "#e9b072" : "#d9b778"); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx, by, 9 * m + 2, 0, 7); ctx.stroke();
    b3.box(W * .04, H * .88 - 4, W * .92, 32, "#f4f8fc", BLUE, 8); TB(names[st] + " : " + txt[st], W * .5, H * .88 + 17, col[st] === GREY ? INK : col[st], 14);
    TB("1. mécanique : mastication, brassage   2. chimique : enzymes   3. absorption dans le sang", W * .98, H * .07, GREY, 13, "right");
  },
  th: "<div class=\"tcard\"><b class=\"h\">Digérer, c'est découper</b><p>Les aliments contiennent de grosses molécules, trop grandes pour passer dans le sang. La <b>digestion</b> les découpe en petites molécules, les <b>nutriments</b>, qui seront ensuite <b>absorbées</b> : amidon → <b>glucose</b> ; protéines → <b>acides aminés</b> ; lipides (graisses) → <b>acides gras et glycérol</b>. L'eau, les sels minéraux et les vitamines n'ont pas besoin d'être digérés.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Le trajet et les glandes</b><p>Bouche → pharynx → œsophage → <b>estomac</b> → <b>intestin grêle</b> → gros intestin → anus. Les <b>glandes salivaires</b>, le <b>foie</b> (qui fabrique la bile) et le <b>pancréas</b> (suc pancréatique) déversent leurs produits dans le tube digestif. La digestion chimique se termine dans l'intestin grêle, où la plupart des nutriments sont aussi absorbés ; le gros intestin récupère surtout de l'eau.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Digestion mécanique et chimique</b><p><b>Mécanique</b> : couper, broyer, brasser (mastication, mouvements de l'estomac) sans changer la nature des molécules. Elle <b>augmente la surface de contact</b> avec les enzymes. <b>Chimique</b> : les enzymes découpent les molécules.</p><p><i>Exemple chiffré :</i> un cube de 2 cm d'arête a une surface de 6 × 2² = 24 cm². Coupé en cubes de 1 cm : 8 cubes, 8 × 6 = 48 cm² (× 2). En cubes de 0,5 cm : 64 cubes, 64 × 1,5 = 96 cm² (× 4). Plus on coupe, plus la surface augmente.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Les enzymes</b><p>Une <b>enzyme</b> est une protéine qui accélère une réaction précise. Elle est <b>spécifique</b> : <b>amylase</b> → amidon ; <b>pepsine</b> → protéines ; <b>lipase</b> → lipides. Son activité dépend de la <b>température</b> (optimale vers 37 °C ; le froid la ralentit de façon <i>réversible</i> ; au-delà de 60 °C environ elle est détruite, de façon <i>irréversible</i>) et du <b>pH</b> (pepsine : optimum à pH 2 dans l'estomac, presque nulle à pH 8 ; la trypsine, pancréatique, agit en milieu basique). La <b>bile</b> n'est pas une enzyme : elle <b>émulsionne</b> les graisses en fines gouttelettes pour que la lipase agisse sur une plus grande surface.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Méthode : prouver l'action d'une enzyme</b><p>On compare des tubes qui ne diffèrent que par <b>un seul paramètre</b> (un <b>témoin</b>). L'<b>eau iodée</b> brunit en l'absence d'amidon et devient <b>bleu-noir</b> en sa présence. Amidon + salive à 37 °C reste brun-orangé (amidon digéré) ; amidon + eau reste bleu-noir ; salive bouillie : bleu-noir (enzyme détruite). <i>Piège :</i> sans tube témoin, on ne peut rien conclure.</p></div>"
});

SFA.figs("c03", [
  /* 0 Enzyme et substrat */
  function (p) {
    var en = ["amylase", "pepsine", "lipase"], su = ["lipides", "amidon", "protéines"], tg = [1, 2, 0], cl = [BLUE, RED, GREEN], i;
    for (i = 0; i < 3; i++) { var y = H * (.25 + i * .24); b3.box(W * .08, y - 20, W * .27, 40, cl[i] + "33", cl[i], 10); TB(en[i], W * .215, y + 5, cl[i] === BLUE ? BLUE_D : cl[i] === RED ? DRED : DGREEN, 17); b3.box(W * .65, y - 20, W * .27, 40, "#f4efe6", "#b9a98a", 10); TB(su[i], W * .785, y + 5, INK, 17); }
    for (i = 0; i < 3; i++) { var y1 = H * (.25 + i * .24), y2 = H * (.25 + tg[i] * .24); if (p > 0) { var f = b3.f(p, i * .2, i * .2 + .4); b3.ar(W * .37, y1, W * .37 + (W * .26) * f, y1 + (y2 - y1) * f, cl[i], 4); } }
    if (p <= 0) TB("?", W * .5, H * .5, ORANGE, 30);
  },
  /* 1 Où finit la digestion ? */
  function (p) {
    b3.tract(W * .27, H * .4, 1.2, p > 0 ? 2 : -1);
    TB("estomac", W * .48, H * .22, GREY, 14, "left"); TB("intestin grêle", W * .68, H * .55, p > 0 ? ORANGE : GREY, 15, "left"); TB("gros intestin", W * .68, H * .82, GREY, 14, "left"); TB("œsophage", W * .22, H * .3, GREY, 13, "right");
    if (p > 0) b3.pill("fin de la digestion + absorption", W * .5, H * .06 + 6, "#fff3de", ORANGE, 14); else TB("Où se termine la digestion ?", W * .5, H * .08, ORANGE, 15);
  },
  /* 2 Quatre tubes */
  function (p) {
    var col = ["#d9893a", "#1f2a5c", "#1f2a5c", "#7c6bb0"], lab = ["A salive 37 °C", "B eau 37 °C", "C salive bouillie", "D salive 4 °C"], mess = ["amidon digéré", "pas d'enzyme", "enzyme détruite", "ralentie"], i;
    for (i = 0; i < 4; i++) { var x = W * (.14 + i * .24); b3.tube(x, H * .12, 36, H * .55, col[i]); TB(lab[i], x, H * .67 + 24, INK, 12); if (p > 0) { ctx.globalAlpha = b3.f(p, i * .15, i * .15 + .35); b3.pill(mess[i], x, H * .9, i === 0 ? "#e4f6ee" : "#fdecea", i === 0 ? DGREEN : DRED, 12); ctx.globalAlpha = 1; } }
    TB("test à l'iode après 10 min", W * .98, H * .07, GREY, 13, "right");
  },
  /* 3 Mécanique ou chimique */
  function (p) {
    var it = ["a  mastication", "b  amylase salivaire", "c  brassage de l'estomac", "d  pepsine", "e  sucs pancréatiques"], mech = [1, 0, 1, 0, 0], i;
    TB("mécanique", W * .25, H * .1, p > 0 ? ORANGE : GREY, 16); TB("chimique", W * .75, H * .1, p > 0 ? BLUE_D : GREY, 16); LN(W * .5, H * .14, W * .5, H * .92, AX, 1.5, [4, 4]);
    for (i = 0; i < 5; i++) { var y = H * (.2 + i * .15); if (p > 0) { var f = b3.f(p, i * .12, i * .12 + .3), x = mech[i] ? W * .25 : W * .75; ctx.globalAlpha = f; b3.box(x - W * .21, y - 16, W * .42, 32, mech[i] ? "#fff3de" : "#e3effb", mech[i] ? ORANGE : BLUE, 8); TB(it[i], x, y + 5, INK, 14); ctx.globalAlpha = 1; } else { b3.box(W * .5 - W * .21, y - 16, W * .42, 32, "#f4f4f4", GREY, 8); TB(it[i], W * .5, y + 5, INK, 14); } }
  },
  /* 4 Retour au chaud */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .82, gh = H * .55, X = function (T) { return gx + T / 80 * gw; }, Y = function (a) { return gb - a * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "T (°C)", "activité");
    var pts = [[0, .04], [10, .15], [20, .45], [30, .8], [37, 1], [45, .85], [55, .35], [62, .05], [70, 0], [80, 0]]; b3.curve(pts.map(function (q) { return [X(q[0]), Y(q[1])]; }), BLUE, 3.5);
    [0, 37, 70].forEach(function (T) { LN(X(T), gb, X(T), gb + 5, INK, 1.5); TB(T, X(T), gb + 18, GREY, 12); });
    DOT(X(0), Y(.04), 6, BLUE_D); DOT(X(70), Y(0), 6, RED); DOT(X(37), Y(1), 6, GREEN);
    TB("froid : réversible", X(2), H * .2, BLUE_D, 13, "left"); TB("70 °C : détruite", X(58), H * .2, DRED, 13, "left");
    if (p > 0) { b3.ar(X(2), Y(.1) - 4, X(35), Y(1) + 8, GREEN, 3.5); b3.ar(X(70), Y(0) - 10, X(40), Y(.1), RED, 3, [6, 4]); b3.cross(X(52), Y(.12) - 8, 9, RED); b3.pill("retrouve", X(17), Y(.78), "#e4f6ee", DGREEN, 12); }
  },
  /* 5 Couper un cube */
  function (p) {
    var n = [1, 2, 4], s = [70, 70, 70], sf = ["24 cm²", "48 cm²", "96 cm²"], fa = ["", "× 2", "× 4"], nb = ["1 cube", "8 cubes", "64 cubes"], ar = ["2 cm", "1 cm", "0,5 cm"], i;
    for (i = 0; i < 3; i++) { var x = W * (.07 + i * .32); b3.cube(x, H * .38, 70, n[i], ["#f4c6a0", "#f2b98a", "#eeac78"][i]); TB(nb[i], x + 50, H * .74, INK, 14); TB("arête " + ar[i], x + 50, H * .83, GREY, 12); if (i < 2) b3.ar(x + 118, H * .5, x + W * .32 - 6, H * .5, ORANGE, 3);
      if (p > 0) { ctx.globalAlpha = b3.f(p, i * .2, i * .2 + .4); TB(sf[i], x + 50, H * .2, DGREEN, 16); if (fa[i]) TB(fa[i], x + 50, H * .92, DRED, 15); ctx.globalAlpha = 1; } }
    if (p <= 0) TB("surface totale ?", W * .5, H * .14, ORANGE, 15);
  },
  /* 6 La pepsine et le pH */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .84, gh = H * .55, X = function (v) { return gx + v / 9 * gw; }, Y = function (a) { return gb - a / 100 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "pH", "activité (%)");
    var d = [[1, 60], [2, 100], [3, 70], [5, 10], [7, 0], [8, 0]]; for (var v = 1; v <= 8; v++) TB(v, X(v), gb + 18, GREY, 12);
    b3.curve(d.map(function (q) { return [X(q[0]), Y(q[1])]; }), RED, 3.5); d.forEach(function (q) { DOT(X(q[0]), Y(q[1]), 5, RED); });
    if (p > 0) { b3.box(X(1.6), H * .1, X(2.4) - X(1.6), gb - H * .1, "rgba(226,75,74,.12)", null, 4); b3.box(X(7.6), H * .1, X(8.4) - X(7.6), gb - H * .1, "rgba(55,138,221,.15)", null, 4); TB("estomac", X(2), H * .95, DRED, 13); TB("intestin", X(8), H * .95, BLUE_D, 13); b3.pill("optimum pH 2", X(3.9), Y(100) - 4, "#fdecea", DRED, 13); TB("inactive", X(8), Y(0) - 12, DRED, 12); }
  },
  /* 7 Concevoir l'expérience */
  function (p) {
    var xs = [.3, .7], fl = [p > 0 ? "#d9893a" : "#f2e9c4", p > 0 ? "#1f2a5c" : "#f2e9c4"], lab = ["amidon + salive", "amidon + eau (témoin)"], i;
    for (i = 0; i < 2; i++) { b3.tube(W * xs[i], H * .14, 44, H * .5, fl[i]); TB(lab[i], W * xs[i], H * .64 + 26, INK, 14); TB("37 °C", W * xs[i], H * .64 + 44, GREY, 13); }
    if (p > 0) { b3.pill("orange : amidon digéré", W * .3, H * .93, "#e4f6ee", DGREEN, 13); b3.pill("bleu-noir : amidon intact", W * .7, H * .93, "#e8eaf6", "#1f2a5c", 13); b3.check(W * .5, H * .4, 14); } else TB("avec iode dans les deux", W * .5, H * .93, ORANGE, 14);
  },
  /* 8 Découpe et temps de digestion */
  function (p) {
    b3.cube(W * .08, H * .35, 90, 1, "#f2b98a"); TB("3 cm · 9 h", W * .08 + 60, H * .82, INK, 15);
    b3.ar(W * .33, H * .5, W * .43, H * .5, ORANGE, 3); b3.cube(W * .47, H * .35, 90, 3, "#eeac78"); TB("27 cubes de 1 cm", W * .47 + 60, H * .82, INK, 15);
    if (p > 0) { TB("162 cm² (× 3)", W * .47 + 60, H * .18, DGREEN, 15); b3.pill("3 h à 37 °C", W * .85, H * .4, "#e4f6ee", DGREEN, 15); b3.pill("6 h à 27 °C", W * .85, H * .62, "#e3effb", BLUE_D, 15); } else TB("temps ?", W * .86, H * .5, ORANGE, 20);
  },
  /* 9 Sans bile */
  function (p) {
    var i; TB("sans bile", W * .26, H * .1, DRED, 16); TB("avec bile", W * .74, H * .1, DGREEN, 16); LN(W * .5, H * .14, W * .5, H * .92, AX, 1.5, [4, 4]);
    b3.E(W * .26, H * .52, 56, 56, "#ffe58a", ORANGE); for (i = 0; i < 6; i++) DOT(W * .26 + Math.cos(i * 1.05) * 66, H * .52 + Math.sin(i * 1.05) * 66, 5, BLUE);
    TB("une grosse goutte", W * .26, H * .88, INK, 13);
    var a = p > 0 ? b3.f(p, 0, .6) : 0; for (i = 0; i < 12; i++) { var ang = i * 2.4, rr = 14 + (i % 3) * 18, cx = W * .74 + Math.cos(ang) * (20 + i * 4 * a + 22 * (1 - a)) * 1.0, cy = H * .52 + Math.sin(ang) * (20 + i * 3.5 * a + 22 * (1 - a));
      if (p > 0) { b3.E(cx, cy, 10, 10, "#ffe58a", ORANGE); DOT(cx + 13, cy - 10, 4, BLUE); DOT(cx - 13, cy + 10, 4, BLUE); } }
    if (p <= 0) { b3.E(W * .74, H * .52, 56, 56, "#ffe58a", ORANGE); TB("?", W * .74, H * .56, ORANGE, 24); } else b3.pill("surface × plus grande", W * .74, H * .9, "#e4f6ee", DGREEN, 13);
  }
]);
