/* Chapitre 2 · Estérification, hydrolyse et saponification */
(function(){
var K = 4;   /* constante d'équilibre d'estérification (alcool primaire), valeur arrondie */
function xeq(a, b, f){
  /* K (a-x)(b-x) = x^2 (1-f)  avec f = fraction de l'eau formée retirée */
  var A = K - (1 - f), B = -K * (a + b), C = K * a * b;
  return (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
}
SFA.sim({
  id: "c6-c02-equilibre", ch: "c02", tag: "Classique",
  titre: "Estérification : une réaction qui s'arrête à un équilibre",
  resume: "Acide + alcool ⇌ ester + eau : regarde les molécules réagir dans les deux sens, jusqu'à ce que Q rejoigne K = 4.",
  but: "Choisis les quantités d'acide et d'alcool puis lance la réaction. Les molécules changent de couleur : à l'équilibre elles continuent de réagir dans les deux sens, mais les quantités ne bougent plus. Ajoute de l'alcool en cours de route pour voir l'équilibre se déplacer.",
  aRetenir: "L'estérification est limitée (≈ 67 % de rendement avec des quantités égales d'acide et d'alcool primaire) : la réaction inverse, l'hydrolyse, se produit en même temps. À l'équilibre, Q = [ester][eau] / ([acide][alcool]) = K.",
  piege: "Un rendement de 67 % ne veut pas dire que la réaction est « ratée » ou qu'elle s'arrête faute de temps : à l'équilibre, la composition ne change plus parce que les deux réactions se compensent. Un catalyseur (H⁺) accélère, il ne change pas K.",
  build: function(k, S){
    var c = k.canvas(450), P = S.draw.palette, H = window.C6, NPM = 12;
    var a = k.slider("n(acide) au départ", 0.1, 3, 0.1, 1, "mol", function(){ clampX(); });
    var b = k.slider("n(alcool) au départ", 0.1, 3, 0.1, 1, "mol", function(){ clampX(); });
    var x = 0, tt = 0, hist = [], hnext = 0, run = true;
    function lim(){ return Math.min(a.value, b.value); }
    function clampX(){ x = Math.min(x, lim() * 0.999); }
    function restart(){ x = 0; tt = 0; hist = []; hnext = 0; lp.play(); }
    k.button("↺ Relancer", restart, true);
    k.button("+ 0,5 mol d'alcool", function(){ b.set(Math.min(3, b.value + 0.5)); lp.play(); });
    var ro = k.readouts(["Q", "K", "n(ester)", "Rendement"]);
    k.note("Modèle simplifié : volume constant, K = 4 (alcool primaire, 25 °C environ), eau non solvant.");
    var lp = k.loop(function(dt, t){ tt += dt; var xe = xeq(a.value, b.value, 0); x += (xe - x) * (1 - Math.exp(-dt / 1.1)); clampX();
      if (tt >= hnext && tt <= 10){ hist.push([tt, a.value - x, b.value - x, x, x]); hnext = tt + 0.1; } k.redraw(); });
    lp.play();
    var COL = [P.red, P.amber, P.green, P.teal], NAM = ["acide", "alcool", "ester", "eau"];
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var A = a.value, B = b.value, xe = xeq(A, B, 0), ctx = c.ctx, i;
      /* palpitation de l'équilibre dynamique : ±1 molécule qui va et vient */
      var fl = (Math.abs(x - xe) < 0.04 * Math.max(1, xe)) ? (Math.sin(tt * 3.1) + Math.sin(tt * 5.3) > 1.15 ? 1 : (Math.sin(tt * 3.1) + Math.sin(tt * 5.3) < -1.15 ? -1 : 0)) : 0;
      var nA0 = Math.round(A * NPM), nB0 = Math.round(B * NPM), nE = Math.max(0, Math.min(Math.min(nA0, nB0), Math.round(x * NPM) + fl));
      var nAc = nA0 - nE, nAl = nB0 - nE;
      /* boîte de réaction */
      var bx = 12, by = 40, bw = c.W - 24, bh = 190;
      ctx.save(); S.draw.rrect(c, bx, by, bw, bh, 12); var g = ctx.createLinearGradient(0, by, 0, by + bh); g.addColorStop(0, "#e8f2fc"); g.addColorStop(1, "#d5e7f8"); ctx.fillStyle = g; ctx.fill(); ctx.clip();
      for (i = 0; i < nA0; i++){ var p = H.wander(i, tt, 0.9), px = bx + 14 + p[0] * (bw - 28), py = by + 14 + p[1] * (bh - 28), est = i < nE; H.ball(c, px, py, est ? 12.5 : 11, est ? P.green : P.red, est ? "E" : "A", {size: 11}); }
      for (i = 0; i < nB0; i++){ var q = H.wander(100 + i, tt, 0.9), qx = bx + 14 + q[0] * (bw - 28), qy = by + 14 + q[1] * (bh - 28), ea = i < nE; H.ball(c, qx, qy, ea ? 7 : 9.5, ea ? P.teal : P.amber, ea ? "" : "B", {size: 11}); }
      ctx.restore(); ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2; S.draw.rrect(c, bx, by, bw, bh, 12); ctx.stroke();
      /* compteurs */
      var cnt = [nAc, nAl, nE, nE], cw = (c.W - 24) / 4;
      for (i = 0; i < 4; i++){ S.draw.dot(c, 12 + cw * i + 8, 20, 6, COL[i]); S.draw.text(c, NAM[i] + " : " + cnt[i], 12 + cw * i + 20, 20, {size: 12, color: P.ink, align: "left"}); }
      /* jauge Q / K */
      var Q = (A - x) * (B - x) > 1e-9 ? x * x / ((A - x) * (B - x)) : 0, gy = by + bh + 22, gx0 = 54, gx1 = c.W - 20, gk = gx0 + (gx1 - gx0) * 4 / 5.2;
      S.draw.text(c, "Q", 18, gy, {size: 14, color: P.acc, weight: 800});
      ctx.save(); S.draw.rrect(c, gx0, gy - 6, gx1 - gx0, 12, 6); ctx.fillStyle = "#e3e7ed"; ctx.fill(); ctx.clip(); ctx.fillStyle = Math.abs(Q - 4) < 0.1 ? P.green : P.acc; ctx.fillRect(gx0, gy - 6, (gx1 - gx0) * Math.min(1, Q / 5.2), 12); ctx.restore();
      S.draw.line(c, gk, gy - 12, gk, gy + 12, P.red, 2.6); S.draw.label(c, "K = 4", gk, gy + 22, {color: P.red});
      S.draw.text(c, S.fmt(Q, 2), Math.min(gx1 - 14, gx0 + (gx1 - gx0) * Math.min(1, Q / 5.2) + 20), gy - 17, {size: 12, color: P.acc, weight: 800});
      /* courbes n(t) */
      var ymax = Math.max(A, B, 0.3) * 1.1, ax = S.draw.axes(c, {x0: 0, x1: 10, y0: 0, y1: ymax, t: gy + 40, b: 30, l: 44, xl: "temps (unités arbitraires)", yl: "mol"});
      [1, 2, 3].forEach(function(col){ ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip(); ctx.strokeStyle = COL[col - 1]; ctx.lineWidth = col === 3 ? 3 : 2; ctx.setLineDash(col === 2 ? [6, 3] : []); ctx.beginPath();
        hist.forEach(function(h, j){ var X = ax.X(h[0]), Y = ax.Y(h[col]); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.restore(); });
      S.draw.line(c, ax.L, ax.Y(xe), ax.R, ax.Y(xe), "rgba(36,119,90,.45)", 1.2, [3, 4]);
      ro.set(0, S.fmt(Q, 2)); ro.set(1, "4"); ro.set(2, S.fmt(x, 2) + " mol"); ro.set(3, S.fmt(x / lim() * 100, 0) + " %");
    });
  }
});

SFA.sim({
  id: "c6-c02-deplacer", ch: "c02", tag: "Défi",
  titre: "Déplacer l'équilibre : excès de réactif et élimination de l'eau",
  resume: "Avec 1 mol d'acide, combien d'alcool en excès ou quelle part d'eau retirée pour atteindre 90 % de rendement ?",
  but: "Fais varier la quantité d'alcool ajoutée (acide fixé à 1,0 mol) et la fraction d'eau éliminée. Défi : atteins 90 % de rendement.",
  aRetenir: "Pour améliorer le rendement d'une estérification : mettre un réactif en excès (en général le moins cher) et/ou éliminer un produit, l'eau (par distillation, Dean-Stark, déshydratant). Dans les deux cas, on déplace l'équilibre vers la droite : K ne change pas.",
  piege: "Le rendement se calcule par rapport au réactif limitant. Si l'alcool est en excès, c'est l'acide qui est limitant ; quand l'alcool est en défaut (moins de 1 mol), c'est lui le limitant.",
  build: function(k, S){
    var c = k.canvas(320), P = S.draw.palette;
    var b = k.slider("n(alcool) ajouté", 0.5, 10, 0.1, 1, "mol");
    var f = k.slider("Eau retirée (fraction de l'eau formée)", 0, 100, 5, 0, "%");
    var ro = k.readouts(["n(ester) obtenu", "Réactif limitant", "Rendement"]);
    var nt = k.note("", "ok");
    function rend(bb, ff){ var x = xeq(1, bb, ff); return x / Math.min(1, bb); }
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 10, y0: 0, y1: 105, stepX: 1, stepY: 20, xl: "n(alcool) / mol", yl: "rendement (%)"});
      S.draw.fn(c, ax, function(x){ return x < 0.5 ? NaN : 100 * rend(x, 0); }, P.grey, 2, [6, 4]);
      S.draw.fn(c, ax, function(x){ return x < 0.5 ? NaN : 100 * rend(x, f.value / 100); }, P.green, 3);
      S.draw.line(c, ax.L, ax.Y(90), ax.R, ax.Y(90), P.amber, 1.4, [4, 4]);
      S.draw.text(c, "objectif 90 %", ax.X(7.2), ax.Y(90) + 12, {size: 12, color: P.amber, align: "left"});
      var r = rend(b.value, f.value / 100) * 100, x = xeq(1, b.value, f.value / 100);
      S.draw.dot(c, ax.X(b.value), ax.Y(r), 6, P.green);
      S.draw.text(c, "- - sans retrait d'eau", ax.X(2.2), ax.Y(45), {size: 12, color: P.grey, align: "left"}); S.draw.text(c, "— avec le retrait réglé", ax.X(2.2), ax.Y(35), {size: 12, color: P.green, align: "left"});
      ro.set(0, S.fmt(x, 2) + " mol"); ro.set(1, b.value < 1 ? "l'alcool" : b.value > 1 ? "l'acide" : "les deux"); ro.set(2, S.fmt(r, 0) + " %");
      if (r >= 90) nt.set("Objectif atteint : " + S.fmt(r, 0) + " % ≥ 90 %. Combien de matière coûteuse as-tu mise en excès ?", "ok");
      else nt.set("Rendement " + S.fmt(r, 0) + " % : augmente l'excès d'alcool ou retire de l'eau.", "warn");
    });
  }
});

SFA.sim({
  id: "c6-c02-saponification", ch: "c02", tag: "Dans la vraie vie",
  titre: "Saponification : fabriquer du savon",
  resume: "Triglycéride + soude → savon + glycérol : trouve la masse de soude juste nécessaire pour une masse d'huile.",
  but: "Choisis la masse d'huile et la masse de soude (curseurs, ou fais glisser le point sur la courbe). Compare le bécher avant et après : quel réactif limite, ce qui reste. Défi : aucun réactif en reste.",
  aRetenir: "Triglycéride + 3 NaOH → 3 savon (carboxylate de sodium) + glycérol. Il faut 3 mol de soude par mole d'huile : environ 13,6 g de NaOH pour 100 g de trioléine. La masse se conserve : masse des réactifs consommés = masse du savon + du glycérol.",
  piege: "Un excès de soude donne un savon agressif pour la peau (la soude reste libre), un défaut laisse de l'huile non saponifiée. Le savon fabriqué à la maison est volontairement un peu « surgraissé ». Modèle : huile = trioléine pure, M = 884 g/mol.",
  build: function(k, S){
    var c = k.canvas(480), P = S.draw.palette, H = window.C6, tt = 0;
    var mh = k.slider("Masse d'huile", 50, 500, 10, 200, "g");
    var mn = k.slider("Masse de soude NaOH", 5, 80, 1, 27, "g");
    k.button("Proportions exactes", function(){ mn.set(Math.max(5, Math.min(80, Math.round(3 * mh.value / 884 * 40)))); }, true);
    var ro = k.readouts(["Réactif limitant", "Savon formé", "Glycérol formé", "Reste"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    var MH = 884, MN = 40, MS = 304, MG = 92, geo = {};
    c.pointer(function(type, p){ if (type === "move" || type === "up" || !geo.ax || p.y < geo.ax.T - 10) return; mn.set(Math.round(Math.max(5, Math.min(80, geo.ax.ix(p.x))))); k.redraw(); });
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var nh = mh.value / MH, nn = mn.value / MN, xi = Math.min(nh, nn / 3), ctx = c.ctx, i;
      var sav = 3 * xi * MS, gly = xi * MG, oilLeft = (nh - xi) * MH, naLeft = (nn - 3 * xi) * MN;
      var bw = Math.min(124, (c.W - 130) / 2), bh = 118, by = 38, kh = (bh - 10) / 620;
      var xl = 22, xr = c.W - 22 - bw;
      /* avant */
      H.glass(c, "beaker", xl, by, bw, bh, {level: 0.999, color: [255, 255, 255], alpha: 0, shine: true, inside: function(){
        ctx.fillStyle = "rgba(236,200,70,.85)"; ctx.fillRect(xl, by + bh - mh.value * kh - 4, bw, mh.value * kh + 6);
        ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.fillRect(xl, by + bh - mh.value * kh - 4, bw, 3);
        for (i = 0; i < Math.round(mn.value / 2.5); i++){ var px = xl + 8 + H.rnd(i, 1) * (bw - 24), py = by + bh - 8 - H.rnd(i, 2) * (mh.value * kh + 4); ctx.fillStyle = "#f6f8fb"; ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = 1; S.draw.rrect(c, px, py, 7, 5, 2); ctx.fill(); ctx.stroke(); }
      }});
      S.draw.text(c, "avant", xl + bw / 2, by + bh + 16, {size: 12.5, color: P.ink, weight: 800});
      S.draw.text(c, S.fmt(mh.value, 0) + " g d'huile + " + S.fmt(mn.value, 0) + " g de soude", xl + bw / 2, by + bh + 32, {size: 10.5, color: P.grey});
      S.draw.arrow(c, xl + bw + 10, by + bh / 2, xr - 10, by + bh / 2, P.ink, 2.6); S.draw.text(c, "chauffage", c.W / 2, by + bh / 2 - 12, {size: 10.5, color: P.grey});
      /* après : couches */
      var layers = [[gly, "rgba(150,200,235,.85)", "glycérol"], [sav, "rgba(250,244,225,.98)", "savon"], [oilLeft, "rgba(236,200,70,.85)", "huile"], [naLeft, "rgba(235,238,244,.98)", "soude"]];
      H.glass(c, "beaker", xr, by, bw, bh, {level: 0.999, color: [255, 255, 255], alpha: 0, shine: true, inside: function(){
        var y = by + bh + 2; layers.forEach(function(L){ var h2 = Math.max(0, L[0] * kh); if (h2 > 0.4){ y -= h2; ctx.fillStyle = L[1]; ctx.fillRect(xr, y, bw, h2 + 0.6); ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.fillRect(xr, y, bw, 1.4); if (h2 > 12) S.draw.text(c, L[2] + " " + S.fmt(L[0], 0) + " g", xr + bw / 2, y + h2 / 2, {size: 10.5, color: P.ink, weight: 800}); } });
        if (sav > 5) for (i = 0; i < 12; i++){ var u = (tt * 0.25 + i / 12) % 1; S.draw.dot(c, xr + 10 + H.rnd(i, 4) * (bw - 20), by + bh - u * (bh - 10), 2.2, "rgba(255,255,255,.8)"); }
      }});
      S.draw.text(c, "après", xr + bw / 2, by + bh + 16, {size: 12.5, color: P.ink, weight: 800});
      S.draw.text(c, S.fmt(sav + gly + oilLeft + naLeft, 0) + " g (masse conservée)", xr + bw / 2, by + bh + 32, {size: 10.5, color: P.grey});
      var ax = S.draw.axes(c, {x0: 0, x1: 80, y0: 0, y1: 600, stepX: 10, stepY: 100, xl: "m(NaOH) / g", yl: "m(savon) / g", t: 222, b: 34}); geo.ax = ax;
      S.draw.fn(c, ax, function(x){ var q = Math.min(nh, x / MN / 3); return 3 * q * MS; }, P.green, 3);
      var st = 3 * nh * MN;
      S.draw.line(c, ax.X(st), ax.B, ax.X(st), ax.T, P.amber, 1.4, [4, 4]);
      S.draw.text(c, "juste assez : " + S.fmt(st, 1) + " g", Math.min(ax.X(st) + 4, ax.R - 100), ax.T + 30, {size: 12, color: P.amber, align: "left"});
      S.draw.dot(c, ax.X(mn.value), ax.Y(sav), 7.5, P.green);
      var exact = Math.abs(nn / (3 * nh) - 1) < 0.02;
      var lim = exact ? "aucun (proportions exactes à 2 % près)" : (nn / 3 > nh ? "l'huile" : "la soude");
      ro.set(0, lim); ro.set(1, S.fmt(sav, 0) + " g"); ro.set(2, S.fmt(gly, 0) + " g");
      ro.set(3, exact ? "rien (à 2 % près)" : oilLeft > 0.5 ? S.fmt(oilLeft, 0) + " g d'huile" : naLeft > 0.05 ? S.fmt(naLeft, 1) + " g de soude" : "rien");
      if (exact) nt.set("Proportions exactes (à 2 % près). Vérification : " + S.fmt(xi * MH + 3 * xi * MN, 0) + " g de réactifs consommés → " + S.fmt(sav + gly, 0) + " g de produits (la masse se conserve).", "ok");
      else if (naLeft > 0.05) nt.set("Soude en excès : " + S.fmt(naLeft, 1) + " g restent libres. Ce savon serait caustique.", "warn");
      else if (oilLeft > 0.5) nt.set("Huile en excès : " + S.fmt(oilLeft, 0) + " g non saponifiés (savon « surgraissé »).", "warn");
      else nt.set("Proportions exactes. Vérification : " + S.fmt(xi * MH + 3 * xi * MN, 0) + " g de réactifs consommés → " + S.fmt(sav + gly, 0) + " g de produits.", "ok");
    });
  }
});

var ACI = [["méthan", 1], ["éthan", 2], ["propan", 3], ["butan", 4]];
var ALC = [["méthyle", 1, "méthanol"], ["éthyle", 2, "éthanol"], ["propyle", 3, "propan-1-ol"], ["butyle", 4, "butan-1-ol"], ["pentyle", 5, "pentan-1-ol"], ["octyle", 8, "octan-1-ol"]];
var ODEUR = {"4_1": "pomme / ananas", "4_2": "ananas", "4_5": "abricot", "2_5": "banane", "2_8": "orange", "1_2": "framboise", "2_2": "solvant fruité (dissolvant)"};
function fb(n, H, O){ return "C" + (n > 1 ? "<sub>" + n + "</sub>" : "") + "H" + (H > 1 ? "<sub>" + H + "</sub>" : "") + (O ? "O" + (O > 1 ? "<sub>" + O + "</sub>" : "") : ""); }
SFA.sim({
  id: "c6-c02-aromes", ch: "c02", tag: "Défi",
  titre: "Arômes d'esters : choisis l'acide et l'alcool",
  resume: "Combine un acide et un alcool : regarde l'ester se former en libérant une molécule d'eau, et sens l'arôme obtenu.",
  but: "Choisis l'acide et l'alcool, puis fais glisser « Réaction » : le OH de l'acide et le H de l'alcool partent sous forme d'eau, les deux morceaux se soudent. Lis le nom de l'ester et son odeur. Défi : fabrique l'ester d'un arôme demandé.",
  aRetenir: "Nom d'un ester : [acide → -oate] de [alcool → -yle] (éthanoate de pentyle). L'équation conserve les atomes : M(ester) = M(acide) + M(alcool) − 18 g/mol (l'eau formée). Beaucoup d'arômes de fruits sont des esters.",
  piege: "La pièce de l'alcool devient le « de … yle » et celle de l'acide le « …oate » : l'éthanoate de méthyle et le méthanoate d'éthyle sont deux esters différents. Odeurs : indications usuelles, la perception varie d'une personne à l'autre ; pour les couples non listés, l'odeur n'est pas retenue ici.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, H = window.C6;
    var ac = k.select("Acide carboxylique", ACI.map(function(a, i){ return [i, "acide " + a[0] + "oïque"]; }), 1);
    var al = k.select("Alcool", ALC.map(function(a, i){ return [i, a[2]]; }), 4);
    var rx = k.slider("Réaction", 0, 100, 1, 100, "%");
    var cib = k.select("Défi : arôme à fabriquer", [["", "— libre —"], ["banane", "banane"], ["ananas", "ananas"], ["orange", "orange"], ["abricot", "abricot"], ["framboise", "framboise"]], "");
    var ro = k.readouts(["Ester", "Formule brute", "Masse molaire", "Odeur"]);
    var nt = k.note("", "ok");
    var FRU = {banane: "#f2d444", ananas: "#e8b630", orange: "#f08a1c", abricot: "#f2a65a", framboise: "#c42a62", pomme: "#8cc63f"};
    k.button("▶ Animer", function(){ rx.set(0); go = true; lp.play(); }, true);
    var go = false, tt = 0, lp = k.loop(function(dt, t){ tt = t; if (go){ var v = rx.value + dt * 38; if (v >= 100){ v = 100; go = false; } rx.set(v); } k.redraw(); if (!go && tt > 0.3) lp.pause(); });
    function drawEster(cx, cy, na, nb, dx, alpha, t){
      /* alcool (ambre) – O – C(=O) – acide (rouge) sur une même ligne brisée */
      var M = nb + 1 + na, a = dx * 0.3, ctx = c.ctx, i, x0 = cx - dx * (M - 1) / 2;
      function X(j){ return x0 + j * dx; } function Y(j){ return cy + (j % 2 === 0 ? a : -a); }
      ctx.save(); ctx.globalAlpha = alpha;
      for (i = 0; i < M - 1; i++){ var col = i < nb - 1 ? P.amber : i === nb - 1 || i === nb ? P.green : P.red; S.draw.line(c, X(i), Y(i), X(i + 1), Y(i + 1), col, 3); }
      var cj = nb + 1, s = (cj % 2 === 0) ? 1 : -1;
      H.bond(c, X(cj), Y(cj), X(cj), Y(cj) + s * dx * 0.8, 2, P.red, 2.6); H.at(c, "O", X(cj), Y(cj) + s * (dx * 0.8 + 10), P.red);
      H.at(c, "O", X(nb), Y(nb), P.green, 15);
      ctx.restore();
      return {ox: X(nb), oy: Y(nb)};
    }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var A = ACI[ac.value], B = ALC[al.value], na = A[1], nb = B[1], ne = na + nb, f = rx.value / 100, ctx = c.ctx;
      var nom = A[0] + "oate de " + B[0], key = na + "_" + nb, od = ODEUR[key] || "peu caractéristique (non retenue)";
      var Ma = 14 * na + 32, Mb = 14 * nb + 18, Me = 14 * ne + 32;
      var dx = Math.min(34, (c.W - 40) / (Math.max(na, nb, ne + 1)));
      var rowY = [66, 148], ya = 1 - 0.7 * f, ye = 0.15 + 0.85 * f;
      /* réactifs */
      S.draw.label(c, "acide " + A[0] + "oïque · " + fb(na, 2 * na, 2).replace(/<sub>(\d+)<\/sub>/g, function(m, d){ return d.split("").map(function(z){ return "₀₁₂₃₄₅₆₇₈₉"[+z]; }).join(""); }), 14, 18, {color: P.red, align: "left"});
      var sk = H.skel(c, {n: na, p: 1, form: "oic", x: c.W / 2, y: rowY[0], dx: dx, alpha: ya, col: P.red});
      S.draw.text(c, "+", 24, 104, {size: 24, color: P.grey});
      S.draw.label(c, B[2] + " · " + fb(nb, 2 * nb + 2, 1).replace(/<sub>(\d+)<\/sub>/g, function(m, d){ return d.split("").map(function(z){ return "₀₁₂₃₄₅₆₇₈₉"[+z]; }).join(""); }), 14, 124, {color: P.amber, align: "left"});
      H.skel(c, {n: nb, p: 1, form: "ol", x: c.W / 2, y: rowY[1] + 6, dx: dx, alpha: ya, col: P.amber});
      /* flèche d'équilibre */
      S.draw.text(c, "⇌", c.W / 2, 218, {size: 28, color: P.ink});
      S.draw.text(c, "H⁺ (catalyseur)", c.W / 2 + 34, 218, {size: 11, color: P.grey, align: "left"});
      /* ester */
      var by = 300; S.draw.label(c, "ester : " + nom, 14, 246, {color: P.green, align: "left"});
      var es = drawEster(c.W / 2 - (f > 0 ? 18 : 0), by, na, nb, dx, ye, f);
      /* eau libérée */
      var wx = c.W - 62, wy = by + 52 - 34 * f;
      ctx.save(); ctx.globalAlpha = f; H.ball(c, wx - 11, wy, 7, "H", ""); H.ball(c, wx + 11, wy, 7, "H", ""); H.ball(c, wx, wy - 5, 11, "O", "O", {size: 11}); ctx.restore();
      S.draw.text(c, "H₂O", wx, wy + 22, {size: 12, color: P.teal, weight: 800, });
      /* zones qui partent : OH de l'acide et H de l'alcool */
      if (f < 0.98){
        ctx.save(); ctx.setLineDash([4, 3]); ctx.lineWidth = 2; ctx.strokeStyle = P.teal;
        var oy = sk.fy + 1 * (dx * 0.82) + 11; ctx.globalAlpha = 1 - f; ctx.beginPath(); ctx.ellipse(sk.fx, oy, 20, 13, 0, 0, 7); ctx.stroke();
        var hx = c.W / 2 + (nb % 2 === 1 ? 0 : 0); ctx.beginPath(); ctx.ellipse(c.W / 2 - dx * (nb - 1) / 2, rowY[1] + 6 + dx * 0.3 + dx * 0.82 + 11, 20, 13, 0, 0, 7); ctx.stroke(); ctx.restore();
      }
      S.draw.text(c, f < 0.5 ? "Le –OH de l'acide et le H de l'alcool partent en eau…" : "…les deux morceaux se soudent : liaison ester –COO–", c.W / 2, by + 78, {size: 12, color: P.teal, weight: 700});
      /* arôme */
      var fr = (ODEUR[key] || "").split(" ")[0].replace("solvant", ""), fcol = FRU[fr] || "#d0d6df";
      var sx = c.W / 2, sy = c.H - 30;
      ctx.save(); H.ball(c, sx - 74, sy, 14, fcol, ""); ctx.restore();
      S.draw.text(c, ODEUR[key] ? "arôme : " + ODEUR[key] : "arôme : peu caractéristique", sx - 52, sy, {size: 13, color: P.ink, align: "left", weight: 800});
      ro.set(0, nom); ro.set(1, fb(ne, 2 * ne, 2)); ro.set(2, Me + " g/mol"); ro.set(3, od);
      if (cib.value){
        if (ODEUR[key] && ODEUR[key].indexOf(cib.value) >= 0) nt.set("Réussi : " + nom + " sent la " + cib.value + ". Bilan des masses : " + (Ma + Mb) + " = " + Me + " + 18. Quelle serait l'équation de sa formation ?", "ok");
        else nt.set("Pas encore : « " + nom + " » → " + od + ". Essaie une autre combinaison.", "warn");
      } else nt.set("Bilan des masses : " + (Ma + Mb) + " g/mol = " + Me + " + 18. Choisis un arôme dans le défi, ou explore librement.", "ok");
    });
  }
});
})();
