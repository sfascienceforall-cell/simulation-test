/* Biologie 3e · chapitre 9 : cycles de la matière et équilibre d'un écosystème */
function b3_lv(t) { /* effectifs (en dizaines) de lièvres et de lynx, périodes de 10 ans, autour de 40 et 27,5 */
  return [40 + 25 * Math.sin(6.2832 * (t - 1.5) / 10), 27.5 + 16 * Math.sin(6.2832 * (t - 3.5) / 10)];
}
SFA.theo("c09", {
  icon: function () {
    var cx = W * .5, cy = H * .5, i, nm = ["CO₂", "plantes", "animaux", "sol"], px = [.5, .2, .8, .5], py = [.18, .52, .52, .85];
    for (i = 0; i < 4; i++) { b3.box(W * px[i] - 46, H * py[i] - 18, 92, 36, ["#eef2f6", "#e4f6ee", "#fff3de", "#f4efe6"][i], [GREY, GREEN, ORANGE, "#b9a98a"][i], 10); TB(nm[i], W * px[i], H * py[i] + 6, INK, 16); }
    b3.ar(W * .42, H * .3, W * .27, H * .42, GREEN, 3); b3.ar(W * .3, H * .65, W * .43, H * .78, "#a8895a", 3); b3.ar(W * .57, H * .78, W * .7, H * .65, "#a8895a", 3); b3.ar(W * .74, H * .42, W * .6, H * .3, GREY, 3); b3.ar(W * .3, H * .5, W * .7, H * .5, ORANGE, 3);
  },
  sub: [
    {
      t: "Cycle du carbone et de l'eau",
      anim: function (t) {
        ctx.save(); ctx.scale(W / 700, H / 300); var i;
        b3.box(120, 12, 460, 40, "#eef2f6", GREY, 12); TB("atmosphère : CO₂", 350, 38, "#555", 16);
        b3.ico("chene", 150, 160, 40); TB("producteurs", 150, 205, DGREEN, 14);
        b3.ico("lapin", 350, 170, 34); TB("consommateurs", 350, 205, ORANGE, 14);
        b3.box(260, 245, 180, 40, "#f4efe6", "#b9a98a", 10); b3.ico("champi", 285, 267, 12); TB("décomposeurs + sol", 365, 270, "#6b5a3a", 13);
        b3.box(520, 215, 150, 50, "#ece7e1", "#8a7f74", 8); TB("combustibles fossiles", 595, 236, "#5b5148", 13); TB("(charbon, pétrole, gaz)", 595, 254, "#5b5148", 12);
        var fl = [[[130, 54], [130, 120], GREEN, "photosynthèse"], [[170, 120], [170, 54], "#777", "respiration"], [[350, 135], [350, 54], "#777", ""], [[185, 175], [320, 175], ORANGE, "on mange"], [[170, 205], [300, 244], "#a8895a", ""], [[350, 205], [350, 244], "#a8895a", "mort, déchets"], [[430, 258], [520, 258], "#bbb", "fossilisation"], [[600, 215], [600, 54], RED, "combustion"]];
        for (i = 0; i < fl.length; i++) { var f = fl[i]; b3.ar(f[0][0], f[0][1], f[1][0], f[1][1], f[2], 2.5); if (i !== 6) b3.flow(f[0][0], f[0][1], f[1][0], f[1][1], t + i * 7, f[2], 2); }
        TB("photosynthèse", 112, 100, DGREEN, 12, "right"); TB("respiration", 178, 92, "#555", 12, "left"); TB("respiration", 357, 96, "#555", 12, "left"); TB("combustion", 608, 130, DRED, 13, "left"); b3.poly([[260, 265], [60, 265], [60, 58]], "#777", 2.5); b3.ar(60, 90, 60, 56, "#777", 2.5); b3.flow(60, 262, 60, 60, t, "#777", 3); TB("décomposition", 54, 160, "#555", 12, "right");
        b3.pill("la matière circule en boucle ; l'énergie, elle, traverse l'écosystème", 350, 292, "#fff3de", ORANGE, 12);
        ctx.restore();
      },
      th: "<div class=\"tcard\"><b class=\"h\">Le cycle du carbone</b><p>Le carbone circule entre l'<b>atmosphère</b> (CO₂), les <b>êtres vivants</b>, le <b>sol</b>, les océans et les roches. La <b>photosynthèse</b> prélève du CO₂ ; la <b>respiration</b> (des producteurs, des consommateurs et des décomposeurs), la <b>décomposition</b> et la <b>combustion</b> (bois, charbon, pétrole, gaz) en rejettent. Une forêt en croissance est un <b>puits de carbone</b> ; une centrale à charbon, un moteur ou un feu de forêt sont des <b>sources</b>.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Des quantités à manier</b><p>1 ppm de CO₂ dans l'air représente environ 2,12 GtC (milliards de tonnes de carbone). De 280 ppm à 425 ppm : (425 − 280) × 2,12 ≈ <b>307 GtC</b> ajoutées. Si les émissions annuelles sont de 11 GtC et les puits absorbent 5,7 GtC : l'atmosphère gagne 11 − 5,7 = <b>5,3 GtC par an</b>, soit 5,3 / 2,12 ≈ <b>2,5 ppm par an</b>.</p><p><i>Voiture :</i> 120 g de CO₂ par km × 12 000 km = 1 440 kg de CO₂ ; le carbone représente 12/44 de la masse : 1 440 × 12 / 44 ≈ <b>393 kg de carbone</b>. Un arbre adulte absorbant environ 25 kg de CO₂ par an : 1 440 / 25 ≈ 58 arbres. <i>Limite du raisonnement :</i> le carbone stocké peut être relâché (mort de l'arbre, incendie) et un arbre met des décennies à croître.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Le cycle de l'eau</b><p>L'eau s'évapore (océans, sols) et est rejetée par la <b>transpiration</b> des plantes ; la vapeur se <b>condense</b> en nuages, retombe en <b>précipitations</b>, s'infiltre ou ruisselle. La photosynthèse n'utilise qu'une toute petite part de l'eau qui traverse les plantes.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Un écosystème fermé : le bocal</b><p>Dans un bocal fermé, plantes et animaux respirent <b>24 h sur 24</b>, mais les plantes ne font de la photosynthèse que pendant les heures d'éclairement. Avec seulement 2 h de lumière par jour, la production de O₂ est trop faible : le dioxygène s'épuise et les animaux meurent. Un bocal ne reste équilibré que si lumière, plantes et animaux sont dosés.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Ne pas confondre</b><p>L'augmentation du CO₂ renforce l'<b>effet de serre</b> (réchauffement) ; le trou de la <b>couche d'ozone</b> est un autre phénomène (gaz chlorés, UV). Un effet de serre naturel existe et est indispensable : sans lui, la Terre serait bien plus froide.</p></div>"
    },
    {
      t: "Équilibre et régulation des populations",
      anim: function (t) {
        ctx.save(); ctx.scale(W / 700, H / 300);
        var gx = 60, gb = 240, gw = 420, gh = 190, X = function (y) { return gx + y / 20 * gw; }, Y = function (v) { return gb - v / 80 * gh; }, i, T = (t * .02) % 20;
        b3.axes(gx, gb, gw + 10, gh + 12, "temps (années)", "effectifs"); LN(gx, Y(40), gx + gw, Y(40), "rgba(55,138,221,.5)", 1.2, [5, 4]); LN(gx, Y(27.5), gx + gw, Y(27.5), "rgba(226,75,74,.5)", 1.2, [5, 4]);
        TB("équilibre : lièvres 40", gx + gw, Y(40) - 5, BLUE_D, 12, "right"); TB("lynx 27,5", gx + gw, Y(27.5) + 14, DRED, 12, "right");
        var pl = [], pn = []; for (i = 0; i * .25 <= T; i++) { var v = b3_lv(i * .25); pl.push([X(i * .25), Y(v[0])]); pn.push([X(i * .25), Y(v[1])]); }
        if (pl.length > 1) { b3.curve(pl, BLUE, 3.5); b3.curve(pn, RED, 3.5); }
        var c = b3_lv(T); DOT(X(T), Y(c[0]), 6, BLUE); DOT(X(T), Y(c[1]), 6, RED);
        b3.ico("lapin", 590, 70, 14 + c[0] * .5); b3.ico("renard", 590, 190, 12 + c[1] * .55); TB("lièvres", 590, 108 + c[0] * .2, BLUE_D, 13); TB("lynx", 590, 236, DRED, 13);
        TB("les lynx suivent les lièvres, avec un décalage", 270, 14, ORANGE, 14);
        ctx.restore();
      },
      th: "<div class=\"tcard\"><b class=\"h\">Équilibre dynamique</b><p>Un écosystème « en équilibre » n'est pas figé : les effectifs <b>varient</b> (saisons, cycles proie-prédateur) mais restent <b>en moyenne autour de valeurs stables</b>. Il y a toujours des naissances et des morts qui se compensent.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Régulation proie-prédateur</b><p>Quand les proies sont nombreuses, les prédateurs mangent mieux et se multiplient ; ils réduisent alors les proies ; privés de nourriture, les prédateurs déclinent ; les proies repartent. Les deux courbes oscillent avec un <b>décalage</b> : les prédateurs suivent les proies. <i>Exemple :</i> lièvres au maximum à l'année 4, lynx au maximum à l'année 6 : décalage de 2 ans. Supprimer les prédateurs ne protège pas durablement les proies : elles épuisent leur nourriture.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Un modèle simple</b><p>Dans un modèle élémentaire, à l'équilibre : lièvres = m / a et lynx = r / a (r : reproduction des lièvres, m : mortalité des lynx, a : efficacité de la chasse). Avec r = 0,55, m = 0,8 et a = 0,02 : lièvres = 0,8 / 0,02 = <b>40</b> et lynx = 0,55 / 0,02 = <b>27,5</b>. Si a double (0,04) : 20 lièvres et 13,75 lynx : des chasseurs plus efficaces épuisent leurs proies, donc il y a <i>moins</i> de prédateurs à l'équilibre.</p></div>" +
        "<div class=\"tcard\"><b class=\"h\">Croissance d'une population</b><p>Dans un milieu limité, une population croît d'abord de façon <b>exponentielle</b>, puis atteint un <b>plateau</b> (capacité du milieu : nourriture, espace, déchets). <i>Exemple :</i> des levures doublent toutes les 2,5 h à partir de 0,2 million/mL. Après 10 h : 4 doublements, 0,2 × 2⁴ = <b>3,2 millions/mL</b>. Pour atteindre 20 millions/mL : 2ⁿ = 101, n ≈ 6,66 doublements, soit 6,66 × 2,5 ≈ <b>17 h</b> ; ensuite le plateau.</p></div>"
    }
  ]
});

SFA.figs("c09", [
  /* 0 Deux processus opposés */
  function (p) {
    b3.box(W * .1, H * .05, W * .8, 34, "#eef2f6", GREY, 10); TB("CO₂ de l'air", W * .5, H * .05 + 23, "#555", 15); b3.ico("chene", W * .5, H * .55, 44);
    b3.ar(W * .3, H * .17, W * .42, H * .4, GREEN, 5); b3.ar(W * .58, H * .4, W * .7, H * .17, RED, 5);
    b3.ico("champi", W * .2, H * .8, 20); b3.ico("lapin", W * .8, H * .8, 24);
    if (p > 0) { TB("photosynthèse", W * .12, H * .35, DGREEN, 15, "left"); TB("respiration", W * .8, H * .35, DRED, 15, "right"); b3.ar(W * .2, H * .7, W * .22, H * .2, RED, 2.5, [5, 4]); b3.ar(W * .8, H * .7, W * .78, H * .2, RED, 2.5, [5, 4]); TB("décomposition", W * .2, H * .95, DRED, 12); } else TB("lequel prélève, lequel rejette ?", W * .5, H * .95, ORANGE, 15);
  },
  /* 1 Un puits de carbone */
  function (p) {
    var ic = ["chene", "cheminée", "voiture", "feu"], nm = ["forêt en croissance", "centrale charbon", "moteur", "feu de forêt"], x = [.14, .38, .62, .86], i;
    for (i = 0; i < 4; i++) { var cx = W * x[i], cy = H * .55; if (i === 0) b3.ico("chene", cx, cy, 30); else if (i === 1) { b3.box(cx - 22, cy - 10, 44, 40, "#c9c2b8", INK, 3); b3.box(cx + 6, cy - 40, 12, 34, "#a39a8e", INK, 2); } else if (i === 2) car(cx, cy + 10, "#666"); else { ctx.fillStyle = ORA2; ctx.beginPath(); ctx.moveTo(cx - 20, cy + 22); ctx.quadraticCurveTo(cx - 24, cy - 10, cx, cy - 30); ctx.quadraticCurveTo(cx + 4, cy - 6, cx + 22, cy + 22); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffd84d"; ctx.beginPath(); ctx.moveTo(cx - 9, cy + 22); ctx.quadraticCurveTo(cx - 10, cy + 4, cx, cy - 8); ctx.quadraticCurveTo(cx + 4, cy + 6, cx + 10, cy + 22); ctx.fill(); }
      TB(nm[i], cx, H * .88, INK, 12); if (p > 0) { if (i === 0) b3.ar(cx, H * .22, cx, H * .38, GREEN, 4); else b3.ar(cx, H * .38, cx, H * .22, RED, 4); } }
    if (p > 0) { b3.pill("puits", W * .14, H * .12, GREEN, "#fff", 14); b3.pill("sources", W * .62, H * .1, RED, "#fff", 14); } else TB("lequel retire du CO₂ de l'air ?", W * .5, H * .12, ORANGE, 15);
  },
  /* 2 Gigatonnes de carbone */
  function (p) {
    var gb = H * .72, k = H * .5 / 425, x = [W * .12, W * .34];
    LN(W * .06, gb, W * .5, gb, INK, 2); b3.box(x[0], gb - 280 * k, W * .16, 280 * k, "#8ec3ea", INK, 3); TB("280 ppm", x[0] + W * .08, gb - 280 * k - 8, BLUE_D, 14); TB("avant l'ère industrielle", x[0] + W * .08, gb + 18, INK, 11);
    b3.box(x[1], gb - 425 * k, W * .16, 425 * k, "#f2a28a", INK, 3); TB("425 ppm", x[1] + W * .08, gb - 425 * k - 8, DRED, 14); TB("aujourd'hui", x[1] + W * .08, gb + 18, INK, 11);
    if (p > 0) { b3.box(x[1], gb - 425 * k, W * .16, 145 * k, "#d9534f", INK, 2); TB("145 ppm × 2,12 ≈ 307 GtC", W * .72, H * .28, DGREEN, 14); TB("11 − 5,7 = 5,3 GtC/an", W * .72, H * .5, DGREEN, 14); TB("≈ 2,5 ppm/an", W * .72, H * .66, DGREEN, 15); } else TB("combien de carbone ajouté ?", W * .72, H * .4, ORANGE, 15);
  },
  /* 3 Lire un cycle */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .84, gh = H * .55, X = function (y) { return gx + y / 10 * gw; }, Y = function (v) { return gb - v / 70 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "année", "dizaines"); [0, 2, 4, 6, 8, 10].forEach(function (y) { TB(y, X(y), gb + 18, GREY, 12); });
    var yr = [0, 2, 4, 6, 8, 10], li = [30, 55, 62, 35, 20, 25], ly = [15, 16, 30, 45, 35, 20];
    b3.curve(yr.map(function (y, i) { return [X(y), Y(li[i])]; }), BLUE, 3.5); b3.curve(yr.map(function (y, i) { return [X(y), Y(ly[i])]; }), RED, 3.5); yr.forEach(function (y, i) { DOT(X(y), Y(li[i]), 4.5, BLUE_D); DOT(X(y), Y(ly[i]), 4.5, DRED); });
    TB("lièvres", X(1), Y(55) - 6, BLUE_D, 13); TB("lynx", X(8.7), Y(45), DRED, 13);
    if (p > 0) { DOT(X(4), Y(62), 9, BLUE, false); DOT(X(6), Y(45), 9, RED, false); b3.ar(X(4), Y(68), X(6), Y(68), ORANGE, 3); b3.pill("décalage : 2 ans", X(5), Y(68) - 14, "#fff3de", ORANGE, 14); }
  },
  /* 4 Équilibre dynamique */
  function (p) {
    var gx = W * .1, gb = H * .8, gw = W * .84, gh = H * .55, X = function (y) { return gx + y / 20 * gw; }, Y = function (v) { return gb - v / 80 * gh; }, i;
    b3.axes(gx, gb, gw + 8, gh + 14, "temps", "effectif"); var pts = []; for (i = 0; i <= 80; i++) { pts.push([X(i * .25), Y(b3_lv(i * .25)[0])]); } b3.curve(pts, BLUE, 3.5);
    LN(gx, Y(40), gx + gw, Y(40), p > 0 ? GREEN : AX, 2, [6, 4]);
    if (p > 0) { b3.pill("varie autour d'une moyenne stable", W * .5, H * .1, "#e4f6ee", DGREEN, 14); } else TB("effectifs constants ? variables ?", W * .5, H * .1, ORANGE, 15);
  },
  /* 5 Point d'équilibre */
  function (p) {
    var gb = H * .78, k = H * .5 / 40, i, vals = [[40, 27.5], [20, 13.75]], xs = [[.12, .27], [.56, .71]];
    LN(W * .06, gb, W * .94, gb, INK, 2);
    for (i = 0; i < 2; i++) { if (i === 1 && p <= 0) continue; b3.box(W * xs[i][0], gb - vals[i][0] * k, W * .12, vals[i][0] * k, "#8ec3ea", INK, 3); b3.box(W * xs[i][1], gb - vals[i][1] * k, W * .12, vals[i][1] * k, "#f2a28a", INK, 3); TB(String(vals[i][0]).replace(".", ","), W * (xs[i][0] + .06), gb - vals[i][0] * k - 8, BLUE_D, 14); TB(String(vals[i][1]).replace(".", ","), W * (xs[i][1] + .06), gb - vals[i][1] * k - 8, DRED, 14); TB("lièvres", W * (xs[i][0] + .06), gb + 16, INK, 12); TB("lynx", W * (xs[i][1] + .06), gb + 16, INK, 12); }
    TB("a = 0,02", W * .27, H * .08, ORANGE, 15); if (p > 0) { TB("a = 0,04", W * .71, H * .08, ORANGE, 15); b3.ar(W * .44, H * .45, W * .53, H * .45, GREY, 3); b3.pill("moins de lynx !", W * .5, H * .93, "#fdecea", DRED, 13); } else TB("a double : ?", W * .75, H * .45, ORANGE, 20);
  },
  /* 6 Croissance et plateau */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .84, gh = H * .58, X = function (t) { return gx + t / 24 * gw; }, Y = function (v) { return gb - v / 22 * gh; }, i;
    b3.axes(gx, gb, gw + 8, gh + 14, "temps (h)", "millions/mL"); [0, 10, 17, 24].forEach(function (t) { TB(t, X(t), gb + 18, GREY, 12); });
    var pts = []; for (i = 0; i <= 24; i += .5) { var v = i < 16.6 ? .2 * Math.pow(2, i / 2.5) : 20 + (i - 16.6) * .03; pts.push([X(i), Y(Math.min(v, 20.2))]); } b3.curve(pts, GREEN, 3.5, p > 0 ? pts.length : Math.floor(pts.length * .45));
    LN(gx, Y(20.2), gx + gw, Y(20.2), RED, 1.4, [5, 4]); TB("capacité 20,2", gx + gw, Y(20.2) - 6, DRED, 12, "right");
    if (p > 0) { DOT(X(10), Y(3.2), 6, ORANGE); TB("3,2 à 10 h", X(10) + 8, Y(3.2) - 10, ORANGE, 14, "left"); DOT(X(16.6), Y(20), 6, ORANGE); b3.pill("≈ 17 h puis plateau", X(11.5), Y(14), "#fff3de", ORANGE, 14); } else TB("combien de temps ?", W * .35, H * .3, ORANGE, 15);
  },
  /* 7 Le bocal qui s'éteint */
  function (p) {
    b3.box(W * .08, H * .15, W * .38, H * .62, "#f1f8fd", BLUE, 24); b3.ico("herbe", W * .18, H * .62, 22); b3.ico("herbe", W * .33, H * .62, 22); b3.ico("sauterelle", W * .27, H * .45, 14); b3.sun(W * .27, H * .06, 8, tGlob);
    TB("bocal fermé", W * .27, H * .88, INK, 14); var x0 = W * .54, w = W * .4; b3.box(x0, H * .3, w, 28, "#2c2f4a", INK, 4); b3.box(x0, H * .3, w * 2 / 24, 28, "#ffe58a", INK, 4); TB("24 h : 2 h de lumière", x0 + w / 2, H * .24, INK, 13);
    b3.box(x0, H * .56, w, 28, "#f2a28a", INK, 4); TB("respiration : 24 h sur 24", x0 + w / 2, H * .5, DRED, 13);
    if (p > 0) { b3.pill("O₂ produit < O₂ consommé", W * .74, H * .78, "#fdecea", DRED, 13); TB("→ le dioxygène s'épuise", W * .74, H * .92, DRED, 14); } else TB("pourquoi meurent-ils ?", W * .74, H * .82, ORANGE, 15);
  },
  /* 8 La voiture et les arbres */
  function (p) {
    car(W * .13, H * .4, BLUE); TB("120 g CO₂ / km", W * .14, H * .7, INK, 13); TB("× 12 000 km", W * .14, H * .8, INK, 13); b3.ar(W * .24, H * .4, W * .38, H * .4, ORANGE, 3);
    TB("1 440 kg de CO₂", W * .5, H * .36, DRED, 16); TB("393 kg de C", W * .5, H * .5, "#555", 15);
    if (p > 0) { b3.ar(W * .62, H * .4, W * .7, H * .4, ORANGE, 3); var i; for (i = 0; i < 6; i++) b3.ico("chene", W * .76 + (i % 3) * 28, H * .3 + Math.floor(i / 3) * 40, 12); TB("58 arbres", W * .86, H * .75, DGREEN, 16); b3.pill("mais le carbone stocké peut être relâché", W * .5, H * .93, "#fdecea", DRED, 13); } else TB("arbres pour compenser ?", W * .78, H * .65, ORANGE, 14);
  },
  /* 9 CO₂ et couche d'ozone */
  function (p) {
    var i; LN(W * .5, H * .1, W * .5, H * .9, AX, 1.5, [4, 4]);
    b3.E(W * .25, H * .95, 70, 40, "#8ec3ea", BLUE); b3.box(W * .06, H * .4, W * .38, 14, "rgba(120,120,120,.35)", null, 7); TB("CO₂", W * .25, H * .37, "#555", 13); for (i = 0; i < 3; i++) { b3.ar(W * (.12 + i * .1), H * .82, W * (.12 + i * .1), H * .56, RED, 2.5); }
    TB("effet de serre", W * .25, H * .1, DRED, 15); TB("chaleur retenue", W * .25, H * .67, DRED, 12);
    b3.box(W * .56, H * .35, W * .38, 14, "rgba(160,100,220,.35)", null, 7); TB("couche d'ozone", W * .75, H * .3, VIOLET, 13); for (i = 0; i < 3; i++) b3.ar(W * (.62 + i * .1), H * .12, W * (.62 + i * .1), H * .34, VIOLET, 2.5, i === 1 ? [4, 3] : null); TB("trou : UV", W * .75, H * .1 + 5, "#4a3fa0", 13);
    if (p > 0) b3.pill("deux phénomènes différents", W * .5, H * .95, "#e4f6ee", DGREEN, 14); else TB("même phénomène ?", W * .5, H * .62, ORANGE, 14);
  }
]);
