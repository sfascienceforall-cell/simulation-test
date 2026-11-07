/* Chapitre 3 · Alcènes, polymères et plastiques */
(function(){
function sub(s){ return String(s).replace(/(\d+)/g, "<sub>$1</sub>"); }
function brute(C, H, extra){ return "C" + (C > 1 ? "<sub>" + C + "</sub>" : "") + "H<sub>" + H + "</sub>" + (extra || ""); }
var ALK = {
  ethene: {nom: "éthène", n: 2, db: [0, 1], X: 1},
  propene: {nom: "propène", n: 3, db: [0, 1], X: 1},
  butene: {nom: "but-2-ène", n: 4, db: [1, 2], X: 1}
};
var NOMS = {
  ethene: {H2: "éthane", Br2: "1,2-dibromoéthane", HBr: "bromoéthane", H2O: "éthanol"},
  propene: {H2: "propane", Br2: "1,2-dibromopropane", HBr: "2-bromopropane (majoritaire)", H2O: "propan-2-ol (majoritaire)"},
  butene: {H2: "butane", Br2: "2,3-dibromobutane", HBr: "2-bromobutane", H2O: "butan-2-ol"}
};
var REA = {H2: {M: 2, nom: "hydrogénation", cond: "catalyseur Pt ou Ni", obs: "aucune couleur ne change"}, Br2: {M: 160, nom: "addition de dibrome", cond: "à température ambiante", obs: "l'eau de brome orange se décolore"},
  HBr: {M: 81, nom: "hydrobromation", cond: "HBr gazeux", obs: "—"}, H2O: {M: 18, nom: "hydratation", cond: "catalyseur acide (H⁺), chauffage", obs: "—"}};
SFA.sim({
  id: "c6-c03-addition", ch: "c03", tag: "Classique",
  titre: "Addition sur une double liaison C=C",
  resume: "Choisis un alcène et un réactif : regarde la liaison π s'ouvrir et les deux atomes se fixer sur la chaîne.",
  but: "Choisis l'alcène et le réactif, puis fais glisser l'avancement (ou presse « Animer ») : la 2e liaison de C=C s'efface et les atomes du réactif viennent se fixer sur les deux carbones.",
  aRetenir: "Dans une addition, la liaison π de C=C s'ouvre et deux nouveaux atomes ou groupes se fixent sur les deux carbones : le produit est saturé. Les masses s'ajoutent : M(produit) = M(alcène) + M(réactif). H₂ → alcane ; Br₂ → dérivé dibromé ; HBr → dérivé monobromé ; H₂O → alcool.",
  piege: "Avec le propène, HBr ou H₂O peuvent se fixer de deux façons : on obtient surtout le produit où X se fixe sur le carbone le plus substitué (règle de Markovnikov). Le test de décoloration de l'eau de brome ne marche que pour la double liaison, pas pour un alcane.",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette, H = window.C6;
    var al = k.seg("Alcène", [["ethene", "Éthène"], ["propene", "Propène"], ["butene", "But-2-ène"]], "ethene");
    var re = k.seg("Réactif", [["H2", "H₂"], ["Br2", "Br₂"], ["HBr", "HBr"], ["H2O", "H₂O"]], "Br2");
    var av = k.slider("Avancement", 0, 100, 1, 0, "%");
    var go = false, tt = 0;
    var lp = k.loop(function(dt, t){ tt = t; if (go){ var v = av.value + dt * 30; if (v >= 100){ v = 100; go = false; } av.set(v); } k.redraw(); if (!go && t > 0.3) lp.pause(); });
    k.button("▶ Animer", function(){ av.set(0); go = true; lp.play(); }, true);
    var ro = k.readouts(["Type de réaction", "Produit", "Formule brute", "Bilan de masse"]);
    var nt = k.note("", "ok");
    var CND = {
      ethene: {i: "CH₂=CH₂", H2: "CH₃–CH₃", Br2: "CH₂Br–CH₂Br", HBr: "CH₃–CH₂Br", H2O: "CH₃–CH₂OH"},
      propene: {i: "CH₃–CH=CH₂", H2: "CH₃–CH₂–CH₃", Br2: "CH₃–CHBr–CH₂Br", HBr: "CH₃–CHBr–CH₃", H2O: "CH₃–CH(OH)–CH₃"},
      butene: {i: "CH₃–CH=CH–CH₃", H2: "CH₃–CH₂–CH₂–CH₃", Br2: "CH₃–CHBr–CHBr–CH₃", HBr: "CH₃–CHBr–CH₂–CH₃", H2O: "CH₃–CH(OH)–CH₂–CH₃"}
    };
    var RLAB = {H2: "H₂", Br2: "Br₂", HBr: "HBr", H2O: "H₂O"};
    function ease(u){ return u * u * (3 - 2 * u); }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var A = ALK[al.value], r = re.value, t = av.value / 100, n = A.n, ctx = c.ctx, i;
      var dx = Math.min(104, (c.W - 90) / Math.max(1, n - 1)), a = 30, x0 = c.W / 2 - dx * (n - 1) / 2, yc = 225;
      var X = function(j){ return x0 + j * dx; }, Y = function(j){ return yc + (j % 2 === 0 ? a : -a); };
      var out = function(j){ return j % 2 === 0 ? 1 : -1; };
      var i0 = A.db[0], i1 = A.db[1];
      /* halo de la liaison π */
      var mx = (X(i0) + X(i1)) / 2, my = (Y(i0) + Y(i1)) / 2;
      if (t < 1) S.draw.glow(c, mx, my, 46, P.red, 0.45 * (1 - t));
      for (i = 0; i < n - 1; i++) S.draw.line(c, X(i), Y(i), X(i + 1), Y(i + 1), "#2c3a4e", 3.2);
      var dxx = X(i1) - X(i0), dyy = Y(i1) - Y(i0), l = Math.sqrt(dxx * dxx + dyy * dyy), nx = -dyy / l * 7, ny = dxx / l * 7, sgn = out(i0);
      ctx.save(); ctx.globalAlpha = 1 - t; S.draw.line(c, X(i0) + nx * sgn, Y(i0) + ny * sgn, X(i1) + nx * sgn, Y(i1) + ny * sgn, P.red, 3.2); ctx.restore();
      if (t < 0.7) S.draw.label(c, "liaison π", mx + nx * sgn * 2.3, my + ny * sgn * 2.3, {color: P.red, size: 11}), 0;
      for (i = 0; i < n; i++) S.draw.dot(c, X(i), Y(i), 3.6, "#6b7686");
      /* atomes du réactif : départ en haut à droite, arrivée sur les carbones */
      var G, col;
      if (r === "H2"){ G = ["H", "H"]; col = [P.green, P.green]; }
      if (r === "Br2"){ G = ["Br", "Br"]; col = [P.red, P.red]; }
      if (r === "HBr"){ G = ["H", "Br"]; col = [P.green, P.red]; }
      if (r === "H2O"){ G = ["H", "OH"]; col = [P.green, P.teal]; }
      var jX = (r === "HBr" || r === "H2O") ? A.X : i1, jH = (jX === i0) ? i1 : i0, tgt = [], jj;
      if (r === "H2" || r === "Br2"){ tgt = [[i0, 0], [i1, 1]]; } else { tgt = [[jH, 0], [jX, 1]]; }
      tgt.sort(function(p, q){ return X(p[0]) - X(q[0]); });
      var rx = c.W - 70, ry = 74, e = ease(Math.max(0, Math.min(1, t)));
      S.draw.label(c, "réactif " + RLAB[r], rx, 38, {color: P.ink});
      var sx = [rx - 22, rx + 22];
      if (t < 0.9) S.draw.line(c, sx[0], ry, sx[1], ry, "rgba(107,118,134," + (1 - t).toFixed(2) + ")", 3);
      tgt.forEach(function(p, q){
        var j = p[0], gi = p[1], ex = X(j), ey = Y(j) + out(j) * 52, px = sx[q] + (ex - sx[q]) * e, py = ry + (ey - ry) * e;
        if (e > 0.02){ ctx.save(); ctx.globalAlpha = Math.min(1, e * 1.5); S.draw.line(c, X(j), Y(j), ex, Y(j) + out(j) * 34, "#2c3a4e", 2.6); ctx.restore(); }
        S.draw.dot(c, px, py, 17, "rgba(255,255,255,.95)"); S.draw.text(c, G[gi], px, py, {size: G[gi].length > 1 ? 13 : 15, color: col[gi], weight: 800});
      });
      S.draw.text(c, t < 0.5 ? "double liaison C=C (insaturé)" : "liaison simple C–C : produit saturé", c.W / 2, 22, {size: 14, color: t < 0.5 ? P.red : P.green, weight: 800});
      /* équation semi-développée */
      var eq = CND[al.value].i + "  +  " + RLAB[r] + "  →  " + CND[al.value][r];
      S.draw.panel(c, 10, c.H - 66, c.W - 20, 52, {shadow: false});
      H.wrap(c, eq, c.W / 2, c.H - 40, c.W - 40, {size: 15, math: true, color: P.ink});
      if ((r === "HBr" || r === "H2O") && al.value !== "ethene") S.draw.label(c, "majoritaire (Markovnikov) : X sur le C le plus substitué", c.W / 2, c.H - 82, {color: P.amber, size: 11});
      var H0 = 2 * n, Mal = 12 * n + H0, Mp = Mal + REA[r].M, Hp = r === "H2" ? H0 + 2 : r === "Br2" ? H0 : r === "HBr" ? H0 + 1 : H0 + 2;
      var extra = r === "H2" ? "" : r === "Br2" ? "Br<sub>2</sub>" : r === "HBr" ? "Br" : "O";
      ro.set(0, REA[r].nom); ro.set(1, NOMS[al.value][r]); ro.set(2, brute(n, Hp, extra));
      ro.set(3, S.fmt(Mal, 1) + " + " + S.fmt(REA[r].M, 1) + " = " + S.fmt(Mp, 1) + " g/mol");
      nt.set(r === "Br2" ? "Observation : l'eau de brome orange se décolore (" + REA[r].cond + ")." : "Conditions : " + REA[r].cond + ".", "ok");
    });
  }
});

var MON = [
  {id: "pe", mon: "éthène", pol: "polyéthylène (PE)", M0: 28, unit: "–CH₂–CH₂–", usage: "sacs, films, bouteilles de lait"},
  {id: "pp", mon: "propène", pol: "polypropylène (PP)", M0: 42, unit: "–CH₂–CH(CH₃)–", usage: "bouchons, pots de yaourt, cordes"},
  {id: "pvc", mon: "chloroéthène", pol: "poly(chlorure de vinyle) (PVC)", M0: 62.5, unit: "–CH₂–CHCl–", usage: "tuyaux, cadres de fenêtre"},
  {id: "ps", mon: "styrène", pol: "polystyrène (PS)", M0: 104, unit: "–CH₂–CH(C₆H₅)–", usage: "boîtiers de CD, barquettes"},
  {id: "ptfe", mon: "tétrafluoroéthène", pol: "polytétrafluoroéthylène (PTFE)", M0: 100, unit: "–CF₂–CF₂–", usage: "revêtement antiadhésif"}
];
SFA.sim({
  id: "c6-c03-polyaddition", ch: "c03", tag: "Classique",
  titre: "Une chaîne de polymère : n monomères, quelle masse molaire ?",
  resume: "Choisis le monomère et le nombre n : la masse molaire du polymère vaut n × M(monomère).",
  but: "Choisis un monomère et fais varier n (échelle logarithmique) avec le curseur ou en faisant glisser le repère sur la règle. Défi : obtiens un polyéthylène de masse molaire 100 000 g/mol (à 3 % près).",
  aRetenir: "Polyaddition : n molécules de monomère à double liaison C=C s'additionnent sans rien perdre : n CH₂=CHX → [–CH₂–CHX–]ₙ. Donc M(polymère) = n × M(monomère) (les extrémités sont négligeables). Un polymère contient en réalité des chaînes de longueurs différentes : M est une valeur moyenne.",
  piege: "Le polymère n'a pas de double liaison C=C : elle a disparu dans l'addition. Et « n » est très grand (des centaines à des dizaines de milliers) : on ne peut pas écrire de formule brute simple, seulement le motif répété.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, H = window.C6;
    var mo = k.select("Monomère", MON.map(function(m, i){ return [i, m.mon + " → " + m.pol.split(" (")[0]]; }), 0);
    var pn = k.slider("p, avec n = 10^p monomères", 1, 4.5, 0.05, 2, "");
    var ro = k.readouts(["n", "M du polymère", "Longueur étirée", "Usages"]);
    var nt = k.note("", "ok"), tt = 0;
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    var SUB = ["H", "CH₃", "Cl", "ring", "F"], COL = [P.acc, P.teal, P.green, P.amber, P.violet];
    var geo = {};
    c.pointer(function(type, p){ if (type === "move" || type === "up") return; if (p.y > geo.ry - 22 && p.x > 20) pn.set(Math.round(Math.max(1, Math.min(4.5, 1 + (p.x - geo.rx0) / geo.rw * 3.5)) * 20) / 20); k.redraw(); });
    function hexa(x, y, r, col){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); for (var i = 0; i < 6; i++){ var a = Math.PI / 3 * i + Math.PI / 6, px = x + r * Math.cos(a), py = y + r * Math.sin(a); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, 7); ctx.stroke(); ctx.restore(); }
    function glyph(x, y, i, col){ /* motif –CH₂–CHX– : deux carbones, substituant X */
      var up = true, dxv = 34;
      S.draw.line(c, x - dxv / 2, y + 7, x + dxv / 2, y - 7, "#2c3a4e", 3);
      if (i === 3){ S.draw.line(c, x + dxv / 2, y - 7, x + dxv / 2, y - 22, "#2c3a4e", 2.4); hexa(x + dxv / 2, y - 38, 14, col); }
      else if (i === 0){} else { S.draw.line(c, x + dxv / 2, y - 7, x + dxv / 2, y - 22, "#2c3a4e", 2.4); H.at(c, SUB[i], x + dxv / 2, y - 31, col, 13); }
    }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var m = MON[mo.value], n = Math.round(Math.pow(10, pn.value)), M = n * m.M0, ctx = c.ctx, i, col = COL[mo.value], mi = +mo.value;
      S.draw.text(c, m.pol, c.W / 2, 20, {size: 15, color: P.green, weight: 800});
      /* monomère */
      S.draw.panel(c, 12, 38, c.W - 24, 78, {shadow: false});
      S.draw.text(c, "n ×", 34, 86, {size: 16, color: P.ink, math: true});
      var mx = 100, my = 84;
      S.draw.line(c, mx - 22, my + 8, mx, my - 8, "#2c3a4e", 3); S.draw.line(c, mx - 22 + 3, my + 8 - 5, mx + 3, my - 8 - 5, P.red, 3);
      S.draw.line(c, mx, my - 8, mx + 24, my + 8, "#2c3a4e", 2.4);
      var sx = mx + 24, sy = my + 8;
      if (mi === 3){ S.draw.line(c, mx, my - 8, mx, my - 24, "#2c3a4e", 2.4); hexa(mx, my - 40, 13, col); }
      else if (mi === 0){ H.at(c, "H", mx + 28, my + 12, P.grey, 12); } else { S.draw.line(c, mx, my - 8, mx, my - 24, "#2c3a4e", 2.4); H.at(c, SUB[mi], mx, my - 33, col, 13); }
      S.draw.text(c, m.mon + " · M = " + S.fmt(m.M0, 1) + " g/mol", 156, 104, {size: 11.5, color: P.grey, align: "left", weight: 700});
      S.draw.arrow(c, c.W * 0.58, 76, c.W * 0.58 + 40, 76, P.ink, 2.4); S.draw.text(c, "polyaddition", c.W * 0.58 + 20, 62, {size: 11, color: P.grey});
      /* chaîne : un motif = 2 carbones ; on en montre jusqu'à 5 */
      var cnt = Math.min(5, n), dxc = Math.min(40, (c.W - 120) / (2 * cnt)), xs = c.W / 2 - dxc * (2 * cnt - 1) / 2 - dxc * 0.2, yc = 205;
      var X = function(j){ return xs + j * dxc; }, Y = function(j){ return yc + (j % 2 === 0 ? 11 : -11); };
      var xb = X(0) - dxc * 0.8, xe = X(2 * cnt - 1) + dxc * 0.8;
      S.draw.line(c, X(0) - dxc * 0.7, yc + 22, X(0), Y(0), "#9aa6b5", 3, [4, 3]); S.draw.line(c, X(2 * cnt - 1), Y(2 * cnt - 1), xe, yc + 22, "#9aa6b5", 3, [4, 3]);
      for (i = 0; i < 2 * cnt - 1; i++) S.draw.line(c, X(i), Y(i), X(i + 1), Y(i + 1), "#2c3a4e", 3.4);
      for (i = 0; i < cnt; i++){
        var j = 2 * i + 1, ux = X(j), uy = Y(j);
        if (mi === 4){ S.draw.line(c, ux, uy, ux, uy - 22, "#2c3a4e", 2.4); H.at(c, "F", ux, uy - 31, col, 13); S.draw.line(c, X(j - 1), Y(j - 1), X(j - 1), Y(j - 1) + 22, "#2c3a4e", 2.4); H.at(c, "F", X(j - 1), Y(j - 1) + 31, col, 13); }
        else if (mi === 3){ S.draw.line(c, ux, uy, ux, uy - 20, "#2c3a4e", 2.4); hexa(ux, uy - 35, 13, col); }
        else if (mi !== 0){ S.draw.line(c, ux, uy, ux, uy - 22, "#2c3a4e", 2.4); H.at(c, SUB[mi], ux, uy - 31, col, 13); }
        if (i === 0 || i === cnt - 1) {}
        ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = 0.07 + 0.04 * (i % 2); S.draw.rrect(c, X(2 * i) - dxc * 0.5, yc - 56, dxc * 2, 98, 6); ctx.fill(); ctx.restore();
      }
      for (i = 0; i < 2 * cnt; i++) S.draw.dot(c, X(i), Y(i), 3.8, "#6b7686");
      /* crochets [ ]n */
      ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.6; ctx.lineCap = "round"; var bt = yc - 62, bb = yc + 42;
      ctx.beginPath(); ctx.moveTo(xb + 8, bt); ctx.lineTo(xb, bt); ctx.lineTo(xb, bb); ctx.lineTo(xb + 8, bb); ctx.moveTo(xe - 8, bt); ctx.lineTo(xe, bt); ctx.lineTo(xe, bb); ctx.lineTo(xe - 8, bb); ctx.stroke(); ctx.restore();
      S.draw.text(c, "n", xe + 9, bb + 2, {size: 17, math: true, color: P.red, italic: true});
      if (n > cnt) S.draw.text(c, "… " + S.fmt(n, 0) + " motifs au total", c.W / 2, yc + 64, {size: 13, color: P.grey, weight: 700}); else S.draw.text(c, n + " motif" + (n > 1 ? "s" : ""), c.W / 2, yc + 64, {size: 13, color: P.grey, weight: 700});
      /* monomères qui s'additionnent (petits C=C qui glissent vers l'extrémité) */
      for (i = 0; i < 3; i++){ var u = ((tt * 0.35 + i / 3) % 1), gx = c.W * 0.58 + 60 + u * (xe - c.W * 0.58 - 60 + 14), gy = 128 + u * (yc - 8 - 128); ctx.save(); ctx.globalAlpha = Math.min(1, u * 4) * Math.min(1, (1 - u) * 4); S.draw.line(c, gx - 7, gy + 3, gx + 7, gy - 3, col, 2.4); S.draw.line(c, gx - 7, gy - 2, gx + 7, gy - 8, col, 2.4); ctx.restore(); }
      S.draw.text(c, m.unit.replace(/–/g, "–") + "  ×  " + S.fmt(n, 0), c.W / 2, 300, {size: 16, math: true, color: P.ink});
      /* règle logarithmique */
      var rx0 = 34, rw = c.W - 68, ry = 352; geo.rx0 = rx0; geo.rw = rw; geo.ry = ry;
      ctx.save(); S.draw.rrect(c, rx0, ry - 4, rw, 8, 4); ctx.fillStyle = "#dfe5ee"; ctx.fill(); S.draw.rrect(c, rx0, ry - 4, rw * (pn.value - 1) / 3.5, 8, 4); ctx.fillStyle = col; ctx.fill(); ctx.restore();
      [[1, "10"], [2, "100"], [3, "1 000"], [4, "10 000"]].forEach(function(tk){ var tx = rx0 + rw * (tk[0] - 1) / 3.5; S.draw.line(c, tx, ry + 6, tx, ry + 12, P.grey, 1.5); S.draw.text(c, tk[1], tx, ry + 24, {size: 10.5, color: P.grey}); });
      S.draw.text(c, "n", rx0 - 16, ry, {size: 13, color: P.grey, italic: true, math: true});
      if (mi === 0){ var tg = rx0 + rw * (Math.log10(100000 / 28) - 1) / 3.5; S.draw.line(c, tg, ry - 14, tg, ry + 8, P.green, 2.4); S.draw.label(c, "100 000 g/mol", tg, ry - 24, {color: P.green, size: 10.5}); }
      var hx = rx0 + rw * (pn.value - 1) / 3.5; S.draw.dot(c, hx, ry, 9, "#fff"); S.draw.dot(c, hx, ry, 6, col);
      S.draw.text(c, "↔ glisse le repère", c.W / 2, ry + 44, {size: 11, color: P.grey});
      var L = n * 0.25;   /* nm, ordre de grandeur de la chaîne carbonée étirée */
      ro.set(0, S.fmt(n, 0)); ro.set(1, S.sci(M, 3) + " g/mol"); ro.set(2, "≈ " + (L >= 1000 ? S.fmt(L / 1000, 1) + " µm" : S.fmt(L, 0) + " nm")); ro.set(3, m.usage);
      if (mi === 0){
        var err = Math.abs(M - 100000) / 100000;
        nt.set(err <= 0.03 ? "Défi réussi : M ≈ 100 000 g/mol, n ≈ " + S.fmt(n, 0) + "." : "Défi PE : vise 100 000 g/mol (n ≈ 3 571). Actuellement " + S.sci(M, 2) + " g/mol.", err <= 0.03 ? "ok" : "warn");
      } else nt.set("Longueur étirée : ordre de grandeur (≈ 0,25 nm par motif à deux carbones).", "ok");
    });
  }
});

var COND = [
  {id: "pet", nom: "PET (polyester)", A: "acide téréphtalique", MA: 166, B: "éthane-1,2-diol", MB: 62, rep: 192, cA: "#2c5f9a", cB: "#d98a1c", usage: "bouteilles en plastique, fibres textiles", lien: "ester"},
  {id: "nylon", nom: "Nylon 6,6 (polyamide)", A: "acide hexanedioïque", MA: 146, B: "hexane-1,6-diamine", MB: 116, rep: 226, cA: "#7a3fa0", cB: "#2e8b57", usage: "textiles, cordes, pièces mécaniques", lien: "amide"}
];
SFA.sim({
  id: "c6-c03-polycondensation", ch: "c03", tag: "Original",
  titre: "Polycondensation : l'eau qui s'échappe à chaque liaison",
  resume: "Un diacide et un dialcool (ou une diamine) s'assemblent en chaîne en libérant de l'eau : compte-la.",
  but: "Choisis le polymère et le nombre n de paires de monomères (curseur ou bouton « + 1 paire »). Chaque liaison formée libère une goutte d'eau : compte-les et vérifie la conservation de la masse.",
  aRetenir: "Polycondensation : chaque liaison formée (ester ou amide) libère une molécule d'eau. n diacide + n diol → chaîne + (2n − 1) H₂O. Masse de la chaîne : n × M(motif) + 18 g/mol (les extrémités gardent un H et un OH), avec M(motif) = M(A) + M(B) − 2 × 18.",
  piege: "Contrairement à la polyaddition, la polycondensation perd de petites molécules : la masse du polymère est inférieure à la somme des masses des monomères. Et il faut deux fonctions par monomère ; un monomère à une seule fonction arrête la chaîne.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, H = window.C6, tt = 0;
    var ty = k.seg("Polymère", COND.map(function(x){ return [x.id, x.nom.split(" (")[0]]; }), "pet");
    var nn = k.slider("n (paires de monomères)", 1, 12, 1, 4, "");
    k.button("+ 1 paire", function(){ nn.set(nn.value >= 12 ? 1 : nn.value + 1); }, true);
    var ro = k.readouts(["Eau libérée", "Masse de la chaîne", "Masse des monomères", "Liaisons"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var T = COND.filter(function(x){ return x.id === ty.value; })[0], n = nn.value, i, ctx = c.ctx, m = 2 * n;
      var perRow = m > 12 ? Math.ceil(m / 2) : m, rows = Math.ceil(m / perRow), w = Math.min(46, (c.W - 40) / perRow), bh = 48, rowH = 120;
      S.draw.text(c, T.nom, c.W / 2, 20, {size: 14, color: P.ink, weight: 800});
      /* monomères source */
      S.draw.panel(c, 12, 34, c.W - 24, 40, {shadow: false});
      ctx.fillStyle = T.cA; S.draw.rrect(c, 24, 44, 22, 20, 5); ctx.fill(); S.draw.text(c, T.A + " (" + T.MA + " g/mol)", 54, 54, {size: 11, align: "left", color: P.ink, weight: 700});
      var bx0 = c.W / 2 + 6; ctx.fillStyle = T.cB; S.draw.rrect(c, bx0, 44, 22, 20, 5); ctx.fill(); S.draw.text(c, T.B + " (" + T.MB + ")", bx0 + 30, 54, {size: 11, align: "left", color: P.ink, weight: 700});
      var junc = 0;
      for (var r = 0; r < rows; r++){
        var cnt = Math.min(perRow, m - r * perRow), x0 = (c.W - cnt * w) / 2, y = 96 + r * rowH;
        for (i = 0; i < cnt; i++){
          var gi = r * perRow + i, isA = gi % 2 === 0, x = x0 + i * w;
          var gr = ctx.createLinearGradient(0, y, 0, y + bh); gr.addColorStop(0, isA ? T.cA : T.cB); gr.addColorStop(1, C6.shade(isA ? T.cA : T.cB, -0.25));
          ctx.save(); ctx.shadowColor = "rgba(15,27,45,.2)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2; S.draw.rrect(c, x + 1, y, w - 3, bh, 6); ctx.fillStyle = gr; ctx.fill(); ctx.restore();
          S.draw.text(c, isA ? "A" : "B", x + w / 2, y + bh / 2, {size: Math.min(16, w * 0.4), color: "#fff", weight: 800});
          if (gi < m - 1){
            /* liaison + goutte d'eau qui tombe (en boucle, déphasée) */
            var jx = x + w - 1, ph = ((tt * 0.55 + gi * 0.23) % 1);
            S.draw.line(c, jx, y + bh, jx, y + bh + 14, T.id === "pet" ? P.green : P.red, 2.4);
            var wy = y + bh + 18 + ph * 34;
            ctx.save(); ctx.globalAlpha = Math.min(1, (1 - ph) * 1.6); H.ball(c, jx, wy, 6.5, "#3aa7c4", ""); S.draw.text(c, "H₂O", jx, wy + 14, {size: 8.5, color: P.teal, weight: 800}); ctx.restore();
            junc++;
          }
        }
        if (r === 0) S.draw.text(c, T.lien === "ester" ? "liaison ester –COO–" : "liaison amide –CONH–", c.W / 2, y - 8, {size: 10.5, color: T.id === "pet" ? P.green : P.red, weight: 800});
      }
      var yb = 96 + (rows - 1) * rowH + bh + 18 + 34 + 34;
      S.draw.text(c, "n = " + n + " paire" + (n > 1 ? "s" : "") + " · " + (2 * n - 1) + " liaisons · " + (2 * n - 1) + " H₂O libérées", c.W / 2, yb, {size: 13, color: P.teal, weight: 800});
      var nEau = 2 * n - 1, Mch = n * T.rep + 18, Mmon = n * (T.MA + T.MB);
      /* bilan des masses en barres */
      var bx = 24, bw = c.W - 48, by2 = yb + 26, sc = bw / Mmon;
      ctx.save(); S.draw.rrect(c, bx, by2, bw, 22, 11); ctx.clip(); ctx.fillStyle = "#3b6fd6"; ctx.fillRect(bx, by2, Mch * sc, 22); ctx.fillStyle = "#3aa7c4"; ctx.fillRect(bx + Mch * sc, by2, nEau * 18 * sc, 22); ctx.restore();
      S.draw.text(c, "chaîne " + S.fmt(Mch, 0), bx + 10, by2 + 11, {size: 11, color: "#fff", align: "left", weight: 800}); if (nEau * 18 * sc > 60) S.draw.text(c, "eau " + S.fmt(nEau * 18, 0), bx + bw - 8, by2 + 11, {size: 11, color: "#fff", align: "right", weight: 800});
      S.draw.text(c, "= " + S.fmt(Mmon, 0) + " g/mol de monomères mis en jeu", c.W / 2, by2 + 38, {size: 11, color: P.grey});
      ro.set(0, nEau + " H₂O par chaîne (" + S.fmt(nEau * 18, 0) + " g par mole de chaîne)"); ro.set(1, S.fmt(Mch, 0) + " g/mol"); ro.set(2, S.fmt(Mmon, 0) + " g/mol"); ro.set(3, nEau + " liaisons " + T.lien);
      nt.set("Bilan : " + S.fmt(Mmon, 0) + " = " + S.fmt(Mch, 0) + " + " + S.fmt(nEau * 18, 0) + " ✓  (usages : " + T.usage + ")", "ok");
    });
  }
});

/* ---------- tri des plastiques ---------- */
var PLA = [
  {code: 1, nom: "PET", rho: 1.38, usage: "bouteilles d'eau et de soda"},
  {code: 2, nom: "PEHD", rho: 0.95, usage: "flacons de lessive, bidons"},
  {code: 3, nom: "PVC", rho: 1.38, usage: "tuyaux, cadres de fenêtre"},
  {code: 4, nom: "PEBD", rho: 0.92, usage: "sacs, films souples"},
  {code: 5, nom: "PP", rho: 0.90, usage: "pots de yaourt, bouchons"},
  {code: 6, nom: "PS", rho: 1.05, usage: "pots, couverts jetables (compact)"}
];
SFA.sim({
  id: "c6-c03-tri", ch: "c03", tag: "Original",
  titre: "Trier les plastiques par flottaison",
  resume: "Règle la masse volumique du liquide et vois quels plastiques flottent ou coulent. Peux-tu séparer le PET du PVC ?",
  but: "Fais varier la masse volumique du liquide (curseur, boutons, ou en faisant glisser le repère sur la règle de droite). Un plastique flotte si sa masse volumique est inférieure à celle du liquide. Défi : sépare le PEHD du PS, puis tente de séparer le PET du PVC.",
  aRetenir: "Flottaison : ρ(plastique) < ρ(liquide) → ça flotte. Dans l'eau (1,00 g/cm³), PE et PP flottent ; PET, PVC et PS (compact) coulent. En ajustant la masse volumique du liquide (eau salée…), on sépare des plastiques de densités différentes.",
  piege: "Le PET et le PVC ont pratiquement la même masse volumique (≈ 1,38 g/cm³) : on ne peut pas les séparer par flottaison. Or un peu de PVC mélangé au PET abîme le recyclage : les centres de tri utilisent donc d'autres méthodes (détecteurs optiques). Valeurs typiques arrondies : elles varient avec les additifs et la forme.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, H = window.C6, tt = 0;
    var rl = k.slider("Masse volumique du liquide", 0.80, 1.50, 0.01, 1, "g/cm³");
    k.button("Eau (1,00)", function(){ rl.set(1.00); }); k.button("Eau très salée (1,20)", function(){ rl.set(1.20); }); k.button("Éthanol-eau (0,90)", function(){ rl.set(0.90); });
    var ro = k.readouts(["Flottent", "Coulent"]);
    var nt = k.note("", "ok");
    var COL = ["#2f7fd1", "#8aa0b8", "#3aa860", "#c8d4e2", "#e07a1f", "#8a5cd6"], pos = null, geo = {};
    var lp = k.loop(function(dt, t){ tt = t; if (pos){ for (var i = 0; i < pos.length; i++){ pos[i] += (geo.tg ? geo.tg[i] - pos[i] : 0) * Math.min(1, dt * 3.2); } } k.redraw(); }); lp.play();
    c.pointer(function(type, p){ if (type === "move" || type === "up" || !geo.rx0 || p.x < geo.rx0 - 24) return; rl.set(Math.round(Math.max(0.8, Math.min(1.5, 0.8 + (p.y - geo.ry0) / (geo.ry1 - geo.ry0) * 0.7)) * 100) / 100); });
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var rho = rl.value, ctx = c.ctx, i, W = c.W;
      var bx = 16, by = 40, bw = W - 112, bh = 330, top = by + 34, floor = by + bh - 24;
      /* liquide */
      var tl = 0.18 + (rho - 0.8) / 0.7 * 0.5, liq = [Math.round(150 - 60 * tl), Math.round(205 - 50 * tl), Math.round(240 - 20 * tl)];
      H.glass(c, "beaker", bx, by, bw, bh, {level: 0.88, color: liq, alpha: 0.6, shine: true});
      S.draw.text(c, "liquide : " + S.fmt(rho, 2) + " g/cm³", bx + bw / 2, 22, {size: 14, color: P.acc, weight: 800});
      var fl = [], co = [], tg = [];
      for (i = 0; i < PLA.length; i++){ var p = PLA[i], up = p.rho < rho - 0.005, mid = Math.abs(p.rho - rho) <= 0.005; tg.push(mid ? (top + floor) / 2 : up ? top + 14 : floor); if (up) fl.push(p.nom); else co.push(p.nom); }
      geo.tg = tg; if (!pos) pos = tg.slice();
      for (i = 0; i < PLA.length; i++){
        var p2 = PLA[i], x = bx + (i + 0.5) * bw / PLA.length, bob = Math.abs(pos[i] - top - 14) < 4 ? Math.sin(tt * 2 + i * 1.7) * 3 : 0, y = pos[i] + bob, r = 22;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(tt * 1.3 + i) * 0.1);
        var g = ctx.createLinearGradient(-r, -r, r, r); g.addColorStop(0, "#ffffff"); g.addColorStop(0.3, COL[i]); g.addColorStop(1, C6.shade(COL[i], -0.3));
        ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; S.draw.rrect(c, -r, -r * 0.8, 2 * r, r * 1.6, 9); ctx.fillStyle = g; ctx.fill(); ctx.restore();
        S.draw.text(c, p2.nom, x, y, {size: 12, color: i === 3 ? P.ink : "#fff", weight: 800});
        S.draw.text(c, "n°" + p2.code + " · " + S.fmt(p2.rho, 2), x, by + bh + 18, {size: 10.5, color: P.grey, weight: 700});
      }
      /* règle de masse volumique (repère à glisser) */
      var rx0 = W - 56, ry0 = by + 8, ry1 = by + bh - 8; geo.rx0 = rx0; geo.ry0 = ry0; geo.ry1 = ry1;
      var Yr = function(v){ return ry0 + (v - 0.8) / 0.7 * (ry1 - ry0); };
      ctx.save(); S.draw.rrect(c, rx0 - 3, ry0, 6, ry1 - ry0, 3); ctx.fillStyle = "#dfe5ee"; ctx.fill(); ctx.restore();
      for (var v = 0.8; v <= 1.5001; v += 0.1){ S.draw.line(c, rx0 - 8, Yr(v), rx0 + 8, Yr(v), "#b8c2d0", 1.2); S.draw.text(c, S.fmt(v, 1), rx0 + 12, Yr(v), {size: 10, color: P.grey, align: "left"}); }
      PLA.forEach(function(q, j){ S.draw.dot(c, rx0 - 14 - (j % 2) * 0, Yr(q.rho) + (q.nom === "PVC" ? 6 : 0) * (q.nom === "PVC" ? 1 : 0) + (j === 2 ? 5 : 0), 3.6, COL[PLA.indexOf(q)]); });
      S.draw.dot(c, rx0, Yr(rho), 9, "#fff"); S.draw.dot(c, rx0, Yr(rho), 6, P.acc);
      S.draw.text(c, "ρ", rx0, by - 6, {size: 13, color: P.acc, italic: true, math: true});
      ro.set(0, fl.length ? fl.join(", ") : "aucun"); ro.set(1, co.length ? co.join(", ") : "aucun");
      var nn = Math.abs(rho - 1.38) <= 0.005;
      if (nn) nt.set("PET et PVC : même masse volumique, le liquide ne les sépare pas (flottaison impossible).", "warn");
      else if (rho > 0.95 && rho < 1.05) nt.set("PEHD (0,95) flotte et PS (1,05) coule : séparation réussie. Il reste PET/PVC identiques dans le fond.", "ok");
      else nt.set("Essaie une masse volumique qui place PEHD (0,95) et PS (1,05) de part et d'autre.", "ok");
    });
  }
});

/* ---------- test au dibrome ---------- */
var ECH = [
  {nom: "pentane", type: "alcane", db: 0, form: "C₅H₁₂"},
  {nom: "pent-1-ène", type: "alcène", db: 1, form: "C₅H₁₀"},
  {nom: "cyclohexane", type: "cycloalcane (saturé)", db: 0, form: "C₆H₁₂"},
  {nom: "cyclohexène", type: "alcène cyclique", db: 1, form: "C₆H₁₀"},
  {nom: "hexa-1,5-diène", type: "alcène (2 C=C)", db: 2, form: "C₆H₁₀"}
];
SFA.sim({
  id: "c6-c03-dibrome", ch: "c03", tag: "Original",
  titre: "Le test au dibrome : l'alcène décolore, l'alcane non",
  resume: "Ajoute le dibrome goutte à goutte à un échantillon : la couleur orange persiste-t-elle ? Compte les C=C.",
  but: "Choisis l'échantillon et sa quantité, puis laisse tomber des gouttes d'eau de brome (0,010 mmol de Br₂ par goutte) avec les boutons ou en cliquant sur la pipette. Repère la goutte à partir de laquelle l'orange persiste.",
  aRetenir: "Le dibrome orange s'additionne sur chaque liaison C=C : 1 Br₂ par double liaison. Tant qu'il reste des C=C, la solution reste incolore ; l'orange persiste quand tout l'alcène a réagi. Avec un alcane, rien ne se passe à l'obscurité : l'orange reste dès la première goutte.",
  piege: "À la lumière vive, un alcane finit par décolorer lentement le dibrome, mais c'est une substitution (R–H + Br₂ → R–Br + HBr, avec dégagement de HBr), pas une addition : la décoloration est lente, et elle ne suit pas la règle « 1 Br₂ par liaison C=C ».",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, H = window.C6;
    var es = k.select("Échantillon", ECH.map(function(e, i){ return [i, e.nom + " (" + e.type + ")"]; }), 1);
    var q = k.slider("Quantité d'échantillon", 0.05, 0.5, 0.05, 0.2, "mmol");
    var dr = k.slider("Gouttes d'eau de brome ajoutées", 0, 60, 1, 10, "");
    var dropT = -9, lp = k.loop(function(){ k.redraw(); if (now() - dropT > 0.8) lp.pause(); });
    function now(){ return performance.now() / 1000; }
    function add(m){ dr.set(Math.min(60, dr.value + m)); dropT = now(); lp.play(); }
    k.button("💧 +1 goutte", function(){ add(1); }, true); k.button("+5 gouttes", function(){ add(5); }); k.button("↺ Vider", function(){ dr.set(0); });
    var ro = k.readouts(["Br₂ ajouté", "Br₂ consommé", "Br₂ libre", "Observation"]);
    var nt = k.note("", "ok");
    c.pointer(function(type){ if (type === "down") add(1); });
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var e = ECH[es.value], n = q.value, d = dr.value, ctx = c.ctx;
      var added = d * 0.010, cons = Math.min(added, n * e.db), left = added - cons, need = n * e.db;
      var V = 2 + 0.05 * d, inten = Math.min(1, (left / V) / 0.06);
      var bw = 118, bh = 140, bx = 34, by = 128, lvl = Math.min(0.9, 0.5 + d * 0.004);
      var rgb = [0, 1, 2].map(function(j){ return Math.round([222, 234, 242][j] + ([236, 120, 18][j] - [222, 234, 242][j]) * inten); });
      /* pipette */
      var px = bx + bw / 2;
      ctx.save(); S.draw.rrect(c, px - 9, 10, 18, 56, 8); ctx.fillStyle = "#eef3f8"; ctx.fill(); ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.rrect(c, px - 14, 4, 28, 26, 13); ctx.fillStyle = "#c0321d"; ctx.fill(); ctx.beginPath(); ctx.moveTo(px - 5, 66); ctx.lineTo(px, 82); ctx.lineTo(px + 5, 66); ctx.fillStyle = "#eef3f8"; ctx.fill(); ctx.stroke();
      S.draw.rrect(c, px - 6, 32, 12, 30, 5); ctx.fillStyle = "rgba(236,120,18,.9)"; ctx.fill(); ctx.restore();
      var u = (now() - dropT) / 0.55;
      if (u >= 0 && u < 1){ var dy = 82 + u * u * (by + (1 - lvl) * bh - 82 + 4); S.draw.dot(c, px, dy, 4.2, "rgba(236,120,18,.95)"); }
      H.glass(c, "beaker", bx, by, bw, bh, {level: lvl, color: rgb, alpha: 0.8, ticks: 4,
        inside: function(top){ if (u >= 0 && u < 0.9 + 0.1) {} for (var i = 0; i < 6; i++){ var uu = (now() * 0.5 + i / 6) % 1; if (e.db > 0 && left <= 1e-9 && d > 0 && now() - dropT < 1.2) S.draw.dot(c, bx + 14 + H.rnd(i, 1) * (bw - 28), by + bh - 6 - uu * (by + bh - top), 2.2, "rgba(255,255,255,.7)"); } }});
      S.draw.text(c, e.nom, bx + bw / 2, by + bh + 22, {size: 12, color: P.grey});
      /* compteur et pastille de couleur */
      var rx = bx + bw + 36, rw = c.W - rx - 14;
      S.draw.text(c, d, rx + 34, 54, {size: 40, color: P.amber, weight: 800, align: "center"});
      S.draw.text(c, d === 1 ? "goutte" : "gouttes", rx + 34, 86, {size: 12, color: P.grey});
      var sw = Math.min(rw - 90, 120), swx = rx + 90;
      ctx.save(); S.draw.rrect(c, swx, 30, Math.max(60, sw), 52, 12); ctx.fillStyle = "rgb(" + rgb.join(",") + ")"; ctx.fill(); ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      S.draw.text(c, left > 1e-9 ? "orange" : "incolore", swx + Math.max(60, sw) / 2, 56, {size: 13, color: left > 1e-9 ? "#fff" : P.ink});
      /* barres */
      var bbx = rx, bbw = c.W - rx - 14, mxv = Math.max(0.6, need * 1.2, added);
      function bar(y, val, col, lab){ ctx.save(); S.draw.rrect(c, bbx, y, bbw, 20, 10); ctx.fillStyle = "#e6ebf2"; ctx.fill(); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(bbx, y, bbw * val / mxv, 20); ctx.restore(); S.draw.text(c, lab, bbx, y - 9, {size: 12, color: P.ink, align: "left"}); }
      bar(152, added, P.amber, "Br₂ ajouté : " + S.fmt(added, 2) + " mmol"); bar(206, cons, P.green, "Br₂ consommé : " + S.fmt(cons, 2) + " mmol"); bar(260, left, P.red, "Br₂ libre : " + S.fmt(left, 2) + " mmol");
      if (e.db > 0){ var nx2 = bbx + bbw * need / mxv; S.draw.line(c, nx2, 138, nx2, 284, P.green, 2, [4, 3]); S.draw.label(c, "il en faut " + S.fmt(need, 2), Math.min(nx2, c.W - 56), 296, {color: P.green}); }
      /* structure de l'échantillon */
      S.draw.panel(c, 12, c.H - 118, c.W - 24, 104, {shadow: false});
      S.draw.text(c, e.nom + " · " + e.form + " · " + e.db + " liaison" + (e.db > 1 ? "s" : "") + " C=C", c.W / 2, c.H - 100, {size: 12, color: P.grey, weight: 700});
      var kk = e.nom === "pentane" || e.nom === "pent-1-ène" ? 5 : e.nom === "hexa-1,5-diène" ? 6 : 0, y0 = c.H - 58, dxs = 36, xs0 = c.W / 2 - dxs * 2.5;
      if (kk){ var db1 = e.nom === "pent-1-ène" ? [0] : e.nom === "hexa-1,5-diène" ? [0, 4] : [], ii; for (ii = 0; ii < kk - 1; ii++){ var xa = c.W / 2 - dxs * (kk - 1) / 2 + ii * dxs, ya = y0 + (ii % 2 === 0 ? 10 : -10), xb = xa + dxs, yb = y0 + ((ii + 1) % 2 === 0 ? 10 : -10); S.draw.line(c, xa, ya, xb, yb, "#2c3a4e", 2.6); if (db1.indexOf(ii) >= 0) S.draw.line(c, xa + 2, ya - 5, xb + 2, yb - 5, P.red, 2.6); } }
      else { var cyc = 6, rr = 26, cx0 = c.W / 2, cy0 = y0; ctx.save(); ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 2.6; ctx.beginPath(); for (var h = 0; h < cyc; h++){ var ang = Math.PI / 3 * h - Math.PI / 2; var hx = cx0 + rr * Math.cos(ang), hy = cy0 + rr * Math.sin(ang); h ? ctx.lineTo(hx, hy) : ctx.moveTo(hx, hy); } ctx.closePath(); ctx.stroke();
        if (e.db) { ctx.strokeStyle = P.red; ctx.beginPath(); ctx.moveTo(cx0 + (rr - 6) * Math.cos(-Math.PI / 2 + 0.3), cy0 + (rr - 6) * Math.sin(-Math.PI / 2 + 0.3)); ctx.lineTo(cx0 + (rr - 6) * Math.cos(Math.PI / 3 - Math.PI / 2 - 0.3), cy0 + (rr - 6) * Math.sin(Math.PI / 3 - Math.PI / 2 - 0.3)); ctx.stroke(); } ctx.restore(); }
      ro.set(0, S.fmt(added, 2) + " mmol"); ro.set(1, S.fmt(cons, 2) + " mmol"); ro.set(2, S.fmt(left, 2) + " mmol");
      var obs = d === 0 ? "—" : (e.db === 0 ? "orange dès la 1<sup>re</sup> goutte" : left > 1e-9 ? "l'orange persiste" : "décoloré instantanément");
      ro.set(3, obs);
      if (d === 0) nt.set("Ajoute des gouttes de brome (clique sur la pipette).", "ok");
      else if (e.db === 0) nt.set("Pas d'addition possible : pas de C=C. (À la lumière vive, décoloration lente par substitution.)", "ok");
      else if (left > 1e-9) nt.set("Toute la double liaison a réagi : le Br₂ en excès colore la solution. Il en fallait " + S.fmt(need, 2) + " mmol (" + S.fmt(need / 0.010, 0) + " gouttes).", "ok");
      else nt.set("Chaque goutte est décolorée : il reste des liaisons C=C. Il manque " + S.fmt((need - added) / 0.010, 0) + " gouttes pour tout transformer.", "ok");
    });
  }
});
})();
