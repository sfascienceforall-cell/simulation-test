/* Biostatistique BA1 · chapitre 3 : Bayes et tests diagnostiques */
(function(){
var P = SFA.draw.palette, F = SFA.fmt, ST = SFA.st, Phi = ST.Phi;
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function vpp(pr, se, sp){ var tp = pr * se, fp = (1 - pr) * (1 - sp); return tp + fp > 0 ? tp / (tp + fp) : 0; }
function vpn(pr, se, sp){ var tn = (1 - pr) * sp, fn = pr * (1 - se); return tn + fn > 0 ? tn / (tn + fn) : 0; }
var CVP = P.green, CFP = P.red, CFN = P.amber, CVN = "#8fc6ad";

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-tableau", ch: "c03", tag: "Fréquences naturelles",
  titre: "Le tableau 2×2 sur 10 000 personnes",
  resume: "Prévalence, sensibilité, spécificité : une mosaïque de 10 000 personnes, un tableau et les valeurs prédictives.",
  but: "Chaque surface est un effectif. Glisse la frontière malades / sains (prévalence) et les deux poignées de sensibilité et de spécificité : vrais et faux positifs apparaissent, puis la VPP et la VPN.",
  aRetenir: "Se = VP/(VP+FN) et Sp = VN/(VN+FP) ne dépendent pas de la prévalence ; VPP = VP/(VP+FP) et VPN = VN/(VN+FN) en dépendent. Raisonne en effectifs : « sur 10 000 personnes… ».",
  piege: "« Test positif » ne veut pas dire « malade à 99 % » : si la maladie est rare, la majorité des positifs peuvent être de faux positifs.",
  build: function(k, S){
    var c = ST.canvas(k, 490, 1.12, 540);
    var pr = k.slider("Prévalence", 0.1, 50, 0.1, 1, "%"), se = k.slider("Sensibilité", 50, 100, 1, 90, "%"), sp = k.slider("Spécificité", 50, 100, 1, 95, "%");
    var ro = k.readouts(["VPP", "VPN", "Faux positifs / vrais positifs", "Positifs au total"]);
    var nt = k.note("", "");
    var lay = {};
    ST.drag(c, function(){ if (!lay.w) return []; var p = pr.value / 100, wm = p * lay.w;
      return [{id: "pr", x: lay.x0 + wm, y: lay.y0 - 4, r: 16}, {id: "se", x: lay.x0 + Math.max(7, wm / 2), y: lay.y0 + se.value / 100 * lay.h, r: 16}, {id: "sp", x: lay.x0 + wm + (lay.w - wm) / 2, y: lay.y0 + (1 - sp.value / 100) * lay.h, r: 16}]; },
      function(id, q){
        if (id === "pr") pr.set(ST.clamp(Math.round((q.x - lay.x0) / lay.w * 1000) / 10, 0.1, 50));
        else if (id === "se") se.set(ST.clamp(Math.round((q.y - lay.y0) / lay.h * 100), 50, 100));
        else sp.set(ST.clamp(Math.round((1 - (q.y - lay.y0) / lay.h) * 100), 50, 100)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var N = 10000, p = pr.value / 100, s1 = se.value / 100, s2 = sp.value / 100, ctx = c.ctx, W = c.W;
      var M = N * p, Sn = N - M, VP = M * s1, FN = M - VP, VN = Sn * s2, FP = Sn - VN;
      var x0 = 14, w = W - 28, y0 = 34, h = Math.round(c.H * 0.30); lay.x0 = x0; lay.w = w; lay.y0 = y0; lay.h = h;
      var wm = p * w;
      function blk(x, y, ww, hh, col, lab){ ctx.fillStyle = col; ctx.fillRect(x, y, ww, hh); if (lab && ww > 54 && hh > 18) S.draw.text(c, lab, x + ww / 2, y + hh / 2, {size: 12, color: P.ink}); }
      blk(x0, y0, wm, h * s1, CVP, ""); blk(x0, y0 + h * s1, wm, h * (1 - s1), CFN, "");
      blk(x0 + wm, y0, w - wm, h * (1 - s2), CFP, "faux positifs " + F(Math.round(FP), 0)); blk(x0 + wm, y0 + h * (1 - s2), w - wm, h * s2, S.draw.tint(CVN, .55), "vrais négatifs " + F(Math.round(VN), 0));
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.6; ctx.strokeRect(x0, y0, w, h); S.draw.line(c, x0 + wm, y0, x0 + wm, y0 + h, P.ink, 1.6);
      S.draw.text(c, "Malades " + pct(p, 1), x0, y0 - 14, {size: 12, align: "left", color: P.red});
      S.draw.text(c, "Sains " + pct(1 - p, 1), x0 + w, y0 - 14, {size: 12, align: "right", color: P.mat});
      S.draw.text(c, "test positif (haut)", x0 + w - 4, y0 + h + 12, {size: 10.5, align: "right", color: "#6b7685", weight: 600});
      S.draw.dot(c, x0 + wm, y0 - 4, 8, P.ink); S.draw.dot(c, x0 + Math.max(7, wm / 2), y0 + s1 * h, 8, P.green); S.draw.dot(c, x0 + wm + (w - wm) / 2, y0 + (1 - s2) * h, 8, P.red);
      ST.hint(c, "glisse les poignées", W / 2, y0 + h + 12, P.mat);
      /* tableau */
      var ty = y0 + h + 34, cw = Math.min(124, (W - 100) / 3), rh = 36, tx = 78;
      ctx.save(); ctx.font = "800 11px Mulish, system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#6b7685";
      ["MALADES", "SAINS", "TOTAL"].forEach(function(t, j){ ctx.fillText(t, tx + cw * (j + .5), ty); });
      ctx.fillStyle = P.ink; ctx.font = "800 12.5px Mulish, system-ui"; ctx.textAlign = "right";
      ctx.fillText("Test +", tx - 8, ty + rh); ctx.fillText("Test −", tx - 8, ty + rh * 2); ctx.fillText("Total", tx - 8, ty + rh * 3);
      var cells = [[VP, S.draw.tint(CVP, .4), 0, 1, "VP"], [FP, S.draw.tint(CFP, .4), 1, 1, "FP"], [FN, S.draw.tint(CFN, .4), 0, 2, "FN"], [VN, S.draw.tint(CVN, .5), 1, 2, "VN"], [M, "#e7ebf2", 0, 3], [Sn, "#e7ebf2", 1, 3], [VP + FP, "#e7ebf2", 2, 1], [FN + VN, "#e7ebf2", 2, 2], [N, "#e7ebf2", 2, 3]];
      cells.forEach(function(q){ ctx.fillStyle = q[1]; S.draw.rrect(c, tx + cw * q[2] + 2, ty + rh * q[3] - rh / 2 + 2, cw - 4, rh - 4, 6); ctx.fill();
        ctx.fillStyle = P.ink; ctx.font = "800 14px Mulish, system-ui"; ctx.textAlign = "center"; ctx.fillText(F(Math.round(q[0]), 0), tx + cw * (q[2] + 0.5), ty + rh * q[3] + 1);
        if (q[4]){ ctx.font = "800 9.5px Mulish, system-ui"; ctx.textAlign = "left"; ctx.fillStyle = "#4a5a6e"; ctx.fillText(q[4], tx + cw * q[2] + 8, ty + rh * q[3] - 9); } });
      ctx.restore();
      /* barres VPP et VPN */
      var by = ty + rh * 3 + 50, bw = W - 28, pos = VP + FP, neg = VN + FN, fv = pos > 0 ? VP / pos : 0, fn = neg > 0 ? VN / neg : 0;
      S.draw.text(c, "Parmi les " + F(Math.round(pos), 0) + " positifs : vrais (vert) et faux (rouge)", x0, by - 14, {size: 12, align: "left"});
      ctx.fillStyle = S.draw.tint(CVP, .9); ctx.fillRect(x0, by, bw * fv, 26); ctx.fillStyle = S.draw.tint(CFP, .85); ctx.fillRect(x0 + bw * fv, by, bw * (1 - fv), 26);
      S.draw.text(c, "VPP = " + pct(fv, 1), x0 + Math.max(50, bw * fv / 2), by + 13, {size: 13, color: "#fff"});
      var by2 = by + 52;
      S.draw.text(c, "Parmi les " + F(Math.round(neg), 0) + " négatifs : vrais (vert clair) et faux (orange)", x0, by2 - 14, {size: 12, align: "left"});
      ctx.fillStyle = S.draw.tint(CVN, .9); ctx.fillRect(x0, by2, bw * fn, 26); ctx.fillStyle = S.draw.tint(CFN, .85); ctx.fillRect(x0 + bw * fn, by2, bw * (1 - fn), 26);
      S.draw.text(c, "VPN = " + pct(fn, 2), x0 + Math.max(50, bw * fn / 2), by2 + 13, {size: 13, color: P.ink});
      var pp = vpp(p, s1, s2), pn = vpn(p, s1, s2);
      ro.set(0, pct(pp)); ro.set(1, pct(pn, 2)); ro.set(2, VP > 0 ? F(FP / VP, 1) + " pour 1" : "—"); ro.set(3, F(Math.round(pos), 0));
      nt.set(pp < 0.5 ? "Avec cette prévalence, plus de la moitié des tests positifs sont de faux positifs : la VPP (" + pct(pp) + ") est inférieure à 50 %. Les effectifs sont arrondis à l'unité." : "Les vrais positifs dominent parmi les positifs (VPP " + pct(pp) + "). Les effectifs sont arrondis à l'unité.", pp < 0.5 ? "warn" : "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-prevalence", ch: "c03", tag: "Dépistage",
  titre: "La valeur prédictive dépend de la prévalence",
  resume: "Un même test, deux populations : la VPP s'effondre quand la maladie devient rare.",
  but: "Fixe sensibilité et spécificité. Fais glisser les points le long des courbes (ou le curseur) : suis VPP et VPN. L'échelle logarithmique éclaire les maladies rares.",
  aRetenir: "Se et Sp sont des propriétés du test ; VPP et VPN sont des propriétés du test dans une population. VPP augmente avec la prévalence, VPN diminue.",
  piege: "Même un test à 99 % de sensibilité et de spécificité a une VPP faible pour une maladie à 1 pour 10 000.",
  build: function(k, S){
    var c = ST.canvas(k, 320, .75, 420);
    var se = k.slider("Sensibilité", 50, 100, 0.5, 95, "%"), sp = k.slider("Spécificité", 50, 100, 0.5, 95, "%");
    var pr = k.slider("Prévalence", 0.1, 100, 0.1, 5, "%");
    var lg = k.toggle("Échelle logarithmique de la prévalence", false);
    var ro = k.readouts(["VPP", "VPN", "RV+", "RV−"]);
    var nt = k.note("", "");
    var lay = {};
    function X(p){ return lg.value ? lay.L + (Math.log10(Math.max(p, 0.001)) + 3) / 3 * (lay.R - lay.L) : lay.L + p * (lay.R - lay.L); }
    function pOf(px){ var u = ST.clamp((px - lay.L) / (lay.R - lay.L), 0, 1); return lg.value ? Math.pow(10, u * 3 - 3) : u; }
    function Y(v){ return lay.B - v * (lay.B - lay.T); }
    ST.drag(c, function(){ if (!lay.L) return []; var s1 = se.value / 100, s2 = sp.value / 100, p = pr.value / 100; return [{id: 1, x: X(p), y: Y(vpp(p, s1, s2)), r: 16}, {id: 2, x: X(p), y: Y(vpn(p, s1, s2)), r: 16}]; },
      function(id, q){ pr.set(ST.clamp(Math.round(pOf(q.x) * 1000) / 10, 0.1, 100)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var s1 = se.value / 100, s2 = sp.value / 100, p = pr.value / 100, ctx = c.ctx;
      lay.L = 50; lay.R = c.W - 16; lay.T = 36; lay.B = c.H - 42;
      ctx.save(); ctx.font = "600 11.5px Mulish, system-ui"; ctx.fillStyle = "#6b7685"; ctx.strokeStyle = P.grid; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 0; g <= 1.001; g += 0.25){ ctx.beginPath(); ctx.moveTo(lay.L, Math.round(Y(g)) + .5); ctx.lineTo(lay.R, Math.round(Y(g)) + .5); ctx.stroke(); ctx.fillText(F(g * 100, 0) + " %", lay.L - 7, Y(g)); }
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      var ticks = lg.value ? [0.001, 0.01, 0.1, 1] : [0, 0.2, 0.4, 0.6, 0.8, 1];
      ticks.forEach(function(t){ ctx.beginPath(); ctx.moveTo(Math.round(X(t)) + .5, lay.T); ctx.lineTo(Math.round(X(t)) + .5, lay.B); ctx.stroke(); ctx.fillText(F(t * 100, 1) + " %", X(t), lay.B + 6); });
      ctx.restore();
      S.draw.text(c, "prévalence" + (lg.value ? " (échelle log)" : ""), lay.R, c.H - 10, {size: 12, align: "right", color: "#3d4b5f"});
      S.draw.text(c, "valeur prédictive", lay.L - 36, lay.T - 24, {size: 12, align: "left", color: "#3d4b5f"});
      function curve(f, col){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.8; ctx.lineJoin = "round"; ctx.beginPath(); for (var i = 0; i <= 240; i++){ var u = i / 240, pp = lg.value ? Math.pow(10, u * 3 - 3) : u; if (pp <= 0) pp = 1e-6; var xx = lay.L + u * (lay.R - lay.L), yy = Y(f(pp, s1, s2)); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
      curve(vpn, P.mat); curve(vpp, P.red);
      S.draw.line(c, X(p), lay.B, X(p), lay.T, P.grey, 1.2, [4, 4]);
      S.draw.dot(c, X(p), Y(vpp(p, s1, s2)), 7, P.red); S.draw.dot(c, X(p), Y(vpn(p, s1, s2)), 7, P.mat);
      var right = X(p) > c.W * 0.62;
      S.draw.label(c, "VPP " + pct(vpp(p, s1, s2), 0), X(p) + (right ? -12 : 12), Y(vpp(p, s1, s2)) + (vpp(p, s1, s2) > 0.5 ? -18 : 2), {color: P.red, align: right ? "right" : "left", size: 12});
      S.draw.label(c, "VPN " + pct(vpn(p, s1, s2), 1), X(p) + (right ? -12 : 12), Y(vpn(p, s1, s2)) + (vpn(p, s1, s2) > 0.5 ? 18 : -2), {color: P.mat, align: right ? "right" : "left", size: 12});
      ST.hint(c, "glisse les points", (lay.L + lay.R) / 2, lay.B - 14, P.mat);
      ro.set(0, pct(vpp(p, s1, s2))); ro.set(1, pct(vpn(p, s1, s2), 2));
      ro.set(2, s2 < 1 ? F(s1 / (1 - s2), 1) : "∞"); ro.set(3, s2 > 0 ? F((1 - s1) / s2, 3) : "—");
      nt.set("Prévalence " + pct(p, 1) + " : sur 10 000 personnes testées, " + F(Math.round(10000 * p * s1), 0) + " vrais positifs pour " + F(Math.round(10000 * (1 - p) * (1 - s2)), 0) + " faux positifs.", vpp(p, s1, s2) < 0.5 ? "warn" : "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-roc", ch: "c03", tag: "Seuil et courbe ROC",
  titre: "Déplacer le seuil : sensibilité contre spécificité",
  resume: "Deux distributions (sains, malades), un seuil, la courbe ROC qui en résulte et son aire.",
  but: "Écarte les deux distributions (Δ) puis fais glisser le seuil (trait noir) ou le point rouge de la courbe ROC : tout résultat au-dessus du seuil est dit positif.",
  aRetenir: "Abaisser le seuil augmente la sensibilité et diminue la spécificité (et inversement). La courbe ROC trace Se contre 1 − Sp ; l'aire AUC mesure la séparation (0,5 = hasard, 1 = parfait).",
  piege: "Modèle simplifié : deux lois normales de même écart-type. Le « meilleur » seuil dépend du coût d'un faux négatif contre celui d'un faux positif, pas seulement de l'indice de Youden.",
  build: function(k, S){
    var c1 = ST.canvas(k, 210, .46, 270), c2 = ST.canvas(k, 280, .66, 360);
    var dl = k.slider("Écart Δ entre moyennes (en écarts-types)", 0, 4, 0.1, 2, "σ");
    var th = k.slider("Seuil", -2, 6, 0.1, 1, "");
    k.button("Placer le seuil au meilleur compromis (Youden)", function(){ th.set(Math.round(ST.clamp(dl.value / 2, -2, 6) * 10) / 10); }, true);
    var ro = k.readouts(["Sensibilité", "Spécificité", "AUC", "Se + Sp − 1"]);
    var nt = k.note("", "");
    var l1 = {}, l2 = {};
    function roc(D, t){ return [1 - Phi(t - D), Phi(t)]; }
    ST.drag(c1, function(){ return l1.ax ? [{id: "t", x: l1.ax.X(th.value), y: l1.ax.Y(0.45) + 2, r: 16, dist: function(q){ return Math.abs(q.x - l1.ax.X(th.value)); }}] : []; },
      function(id, q){ th.set(ST.clamp(Math.round(l1.ax.ix(q.x) * 10) / 10, -2, 6)); k.redraw(); });
    ST.drag(c2, function(){ if (!l2.bx) return []; var r = roc(dl.value, th.value); return [{id: "r", x: l2.bx.X(1 - r[1]), y: l2.bx.Y(r[0]), r: 16}]; },
      function(id, q){ var fx = l2.bx.ix(q.x), fy = l2.bx.iy(q.y), best = th.value, bd = 1e9;
        for (var t = -2; t <= 6.001; t += 0.1){ var r = roc(dl.value, t), d = Math.pow(1 - r[1] - fx, 2) + Math.pow(r[0] - fy, 2); if (d < bd){ bd = d; best = t; } } th.set(Math.round(best * 10) / 10); k.redraw(); });
    function phi(x){ return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
    k.draw(function(){
      var D = dl.value, t = th.value, r = roc(D, t), se = r[0], sp = r[1];
      c1.clear(); c2.clear();
      var ax = S.draw.axes(c1, {x0: -4, x1: 8, y0: 0, y1: 0.46, xl: "valeur du marqueur (unités d'écart-type)", stepX: 1, stepY: 0.1, t: 26, b: 40}); l1.ax = ax;
      var ctx = c1.ctx;
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(t), ax.Y(0));
      for (var x = t; x <= 8.0001; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(phi(x - D))); ctx.lineTo(ax.X(8), ax.Y(0)); ctx.closePath(); ctx.fillStyle = S.draw.tint(P.red, .3); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ax.X(-4), ax.Y(0));
      for (x = -4; x <= t + 0.0001; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(phi(x))); ctx.lineTo(ax.X(t), ax.Y(0)); ctx.closePath(); ctx.fillStyle = S.draw.tint(P.mat, .3); ctx.fill(); ctx.restore();
      S.draw.fn(c1, ax, function(x){ return phi(x); }, P.mat, 2.5); S.draw.fn(c1, ax, function(x){ return phi(x - D); }, P.red, 2.5);
      S.draw.line(c1, ax.X(t), ax.Y(0), ax.X(t), ax.T, P.ink, 2.4);
      S.draw.dot(c1, ax.X(t), ax.T + 2, 7, P.ink);
      S.draw.label(c1, "sains", ax.X(-0.2), ax.T - 4, {color: P.mat, align: "right", base: "bottom", size: 12}); S.draw.label(c1, "malades", ax.X(D + 0.2), ax.T - 4, {color: P.red, align: "left", base: "bottom", size: 12});
      S.draw.label(c1, "Sp " + pct(sp, 0), ax.X(Math.max(-3, t - 1.2)), ax.Y(0.04), {color: P.mat, size: 11}); S.draw.label(c1, "Se " + pct(se, 0), ax.X(Math.min(7, t + 1.2)), ax.Y(0.04), {color: P.red, size: 11});
      var size = Math.min(c2.H - 56, c2.W - 120), mx = (c2.W - size) / 2;
      var bx = S.draw.axes(c2, {x0: 0, x1: 1, y0: 0, y1: 1, xl: "1 − spécificité", yl: "sensibilité", l: mx, r: mx, stepX: 0.2, stepY: 0.2, t: 22, b: 44}); l2.bx = bx;
      S.draw.line(c2, bx.X(0), bx.Y(0), bx.X(1), bx.Y(1), P.grey, 1.2, [5, 4]);
      var rocf = function(f){ if (f <= 0) return 0; if (f >= 1) return 1; var lo = -9, hi = 9; for (var i = 0; i < 40; i++){ var m = (lo + hi) / 2; if (1 - Phi(m) > f) lo = m; else hi = m; } return 1 - Phi((lo + hi) / 2 - D); };
      S.draw.area(c2, bx, rocf, 0, 1, P.mat, 0.12);
      S.draw.fn(c2, bx, rocf, P.mat, 3);
      S.draw.dot(c2, bx.X(1 - sp), bx.Y(se), 8, P.red);
      S.draw.line(c2, bx.X(1 - sp), bx.Y(se), bx.X(1 - sp), bx.Y(0), S.draw.tint(P.red, .5), 1.2, [3, 3]); S.draw.line(c2, bx.X(1 - sp), bx.Y(se), bx.X(0), bx.Y(se), S.draw.tint(P.red, .5), 1.2, [3, 3]);
      var auc = Phi(D / Math.SQRT2);
      S.draw.label(c2, "AUC = " + F(auc, 3), bx.X(0.98), bx.Y(0.1), {color: P.mat, align: "right", size: 12.5});
      ST.hint(c2, "glisse le point rouge", bx.X(0.62), bx.Y(0.42), P.red);
      ro.set(0, pct(se)); ro.set(1, pct(sp)); ro.set(2, F(auc, 3)); ro.set(3, F(se + sp - 1, 3));
      nt.set(D < 0.2 ? "Distributions presque confondues : la courbe ROC colle à la diagonale (AUC ≈ 0,5), le test n'apporte rien." : "Le seuil qui maximise Se + Sp − 1 est ici au milieu des deux moyennes, soit " + F(D / 2, 2) + " (modèle à variances égales). Seuil actuel : " + F(t, 1) + ".", D < 0.2 ? "warn" : "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-fagan", ch: "c03", tag: "Probabilité pré- et post-test",
  titre: "Nomogramme de Fagan : du pré-test au post-test",
  resume: "Une droite relie la probabilité avant le test, le rapport de vraisemblance et la probabilité après.",
  but: "Choisis Se, Sp et le résultat du test, puis fais glisser le point de gauche (probabilité pré-test) : la droite du nomogramme donne la probabilité post-test.",
  aRetenir: "RV+ = Se/(1 − Sp), RV− = (1 − Se)/Sp. Cote post-test = cote pré-test × RV. Un RV+ élevé (> 10) ou un RV− faible (< 0,1) modifie beaucoup la probabilité.",
  piege: "La probabilité pré-test n'est pas la prévalence générale : c'est la probabilité clinique pour ce patient, qui dépend de ses symptômes. Le test ne remplace jamais ce point de départ.",
  build: function(k, S){
    var c = ST.canvas(k, 420, .95, 480);
    var se = k.slider("Sensibilité", 50, 99, 1, 90, "%"), sp = k.slider("Spécificité", 50, 99, 1, 90, "%");
    var pre = k.slider("Probabilité pré-test", 1, 99, 1, 20, "%");
    var res = k.seg("Résultat du test", [["+", "Positif"], ["-", "Négatif"]], "+");
    var ro = k.readouts(["RV utilisé", "Cote pré-test", "Cote post-test", "Probabilité post-test"]);
    var nt = k.note("", "");
    var lay = {};
    function lo(p){ return Math.log10(p / (1 - p)); }
    ST.drag(c, function(){ if (!lay.s) return []; return [{id: "pre", x: lay.xs[0], y: lay.yc - lay.s * lo(pre.value / 100), r: 18}]; },
      function(id, q){ var l = (lay.yc - q.y) / lay.s, o = Math.pow(10, l), p = o / (1 + o); pre.set(ST.clamp(Math.round(p * 100), 1, 99)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var s1 = se.value / 100, s2 = sp.value / 100, rv = res.value === "+" ? s1 / (1 - s2) : (1 - s1) / s2;
      var p0 = pre.value / 100, o0 = p0 / (1 - p0), o1 = o0 * rv, p1 = o1 / (1 + o1);
      var H = c.H, W = c.W, yc = H / 2 - 6, s = (H - 80) / 9, xs = [W * 0.2, W * 0.5, W * 0.8]; lay.s = s; lay.yc = yc; lay.xs = xs;
      var yPre = yc - s * lo(p0), yPost = yc + s * lo(p1), yLR = yc + s * Math.log10(rv) / 2, ctx = c.ctx;
      xs.forEach(function(x, i){ S.draw.line(c, x, 22, x, H - 40, i === 1 ? P.mat : P.grey, 2); });
      [0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 80, 90, 95, 99, 99.9, 99.99].forEach(function(pp){ var l = lo(pp / 100);
        if (Math.abs(l) > 3.9) return;
        S.draw.line(c, xs[0] - 5, yc - s * l, xs[0] + 5, yc - s * l, P.grey, 1.2); S.draw.text(c, pp + "", xs[0] - 10, yc - s * l, {size: 10.5, align: "right", color: "#6b7685", weight: 600});
        S.draw.line(c, xs[2] - 5, yc + s * l, xs[2] + 5, yc + s * l, P.grey, 1.2); S.draw.text(c, pp + "", xs[2] + 10, yc + s * l, {size: 10.5, align: "left", color: "#6b7685", weight: 600}); });
      [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100].forEach(function(r){ var y = yc + s * Math.log10(r) / 2; S.draw.line(c, xs[1] - 5, y, xs[1] + 5, y, P.mat, 1.2); if ([0.01, 0.1, 1, 10, 100].indexOf(r) >= 0) S.draw.text(c, F(r, 2) + "", xs[1] - 10, y, {size: 10.5, align: "right", color: P.mat, weight: 700}); });
      S.draw.text(c, "pré-test (%)", xs[0], H - 22, {size: 12}); S.draw.text(c, "rapport de vraisemblance", xs[1], H - 22, {size: 12, color: P.mat}); S.draw.text(c, "post-test (%)", xs[2], H - 22, {size: 12});
      ctx.save(); ctx.beginPath(); ctx.rect(0, 14, W, H - 56); ctx.clip();
      S.draw.line(c, xs[0], yPre, xs[2], yPost, S.draw.tint(P.red, .85), 3.2); ctx.restore();
      S.draw.dot(c, xs[0], yPre, 8, P.red); S.draw.dot(c, xs[1], yLR, 7, P.mat); S.draw.dot(c, xs[2], yPost, 8, P.red);
      S.draw.label(c, "pré " + F(p0 * 100, 0) + " %", xs[0] + 14, yPre - 16, {color: P.red, align: "left", size: 12}); S.draw.label(c, "RV " + F(rv, rv < 1 ? 2 : 1), xs[1] + 12, yLR + (yLR > yc ? 18 : -16), {color: P.mat, align: "left", size: 12});
      S.draw.label(c, "post " + F(p1 * 100, p1 < 0.1 || p1 > 0.9 ? 1 : 0) + " %", xs[2] - 14, yPost + 18, {color: P.red, align: "right", size: 12});
      ST.hint(c, "glisse le point de gauche", xs[0] + 6, 12, P.red);
      ro.set(0, F(rv, rv < 1 ? 3 : 1)); ro.set(1, F(o0, 3)); ro.set(2, F(o1, 3)); ro.set(3, pct(p1));
      nt.set("Test " + (res.value === "+" ? "positif" : "négatif") + " : la probabilité passe de " + F(p0 * 100, 0) + " % à " + F(p1 * 100, 1) + " %. " + (rv > 10 || rv < 0.1 ? "Un tel rapport de vraisemblance déplace fortement la probabilité." : "Un rapport de vraisemblance entre 0,1 et 10 ne change la probabilité que modérément."), rv > 10 || rv < 0.1 ? "ok" : "warn");
    });
  }
});

/* 5 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-tests-successifs", ch: "c03", tag: "Cumuler les résultats",
  titre: "Plusieurs tests positifs d'affilée : à quelles conditions ?",
  resume: "Chaque test positif multiplie la cote par RV+ ; mais seulement si les tests sont indépendants.",
  but: "Règle le test et la prévalence, puis suis la composition des personnes qui restent positives après 1, 2, 3 ou 4 tests : la part de vrais malades (rouge) grandit, et le nombre de personnes restantes fond.",
  aRetenir: "Si les tests sont indépendants chez le malade comme chez le sain, la cote est multipliée par RV+ à chaque test positif. Cote finale = cote initiale × RV+ᵏ.",
  piege: "Refaire le même test sur le même échantillon, ou un test qui se trompe pour la même raison (réaction croisée), n'apporte aucune information nouvelle : l'hypothèse d'indépendance est essentielle.",
  build: function(k, S){
    var c = ST.canvas(k, 330, .78, 430);
    var pr = k.slider("Prévalence", 0.1, 20, 0.1, 2, "%"), se = k.slider("Sensibilité", 70, 99, 1, 95, "%"), sp = k.slider("Spécificité", 70, 99, 1, 98, "%");
    var dep = k.toggle("Erreurs identiques à chaque test (non indépendants)", false);
    var ro = k.readouts(["RV+", "Après 1 positif", "Après 2 positifs", "Positifs pour dépasser 95 %"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var p0 = pr.value / 100, s1 = se.value / 100, s2 = sp.value / 100, rv = s1 / (1 - s2), o0 = p0 / (1 - p0), vals = [], rest = [], j, N = 100000, ctx = c.ctx;
      for (j = 0; j <= 4; j++){
        var o = dep.value ? (j ? o0 * rv : o0) : o0 * Math.pow(rv, j); vals.push(o / (1 + o));
        var kk = dep.value ? Math.min(j, 1) : j; rest.push(N * (p0 * Math.pow(s1, kk) + (1 - p0) * Math.pow(1 - s2, kk))); }
      var L = 52, R = 14, T = 26, B = 84, bw = (c.W - L - R) / 5;
      ctx.save(); ctx.font = "600 11.5px Mulish, system-ui"; ctx.fillStyle = "#6b7685"; ctx.strokeStyle = P.grid; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 0; g <= 1.001; g += 0.25){ var yy = Math.round(T + (1 - g) * (c.H - T - B)) + .5; ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(c.W - R, yy); ctx.stroke(); ctx.fillText(F(g * 100, 0) + " %", L - 7, yy); }
      ctx.restore();
      var Y = function(v){ return T + (1 - v) * (c.H - T - B); };
      vals.forEach(function(v, j){ var xa = L + bw * j + bw * 0.14, wd = bw * 0.72;
        ctx.fillStyle = S.draw.tint(P.grey, .25); ctx.fillRect(xa, T, wd, c.H - T - B);
        ctx.fillStyle = S.draw.tint(P.red, .8); ctx.fillRect(xa, Y(v), wd, c.H - B - Y(v));
        if (v > 0.9) S.draw.text(c, pct(v, 1), xa + wd / 2, Y(v) + 16, {size: 12.5, color: "#fff"});
        else S.draw.text(c, pct(v, v < 0.1 ? 1 : 0), xa + wd / 2, Y(v) - 10, {size: 12.5, color: P.red});
        S.draw.text(c, j === 0 ? "avant" : j + (j === 1 ? " positif" : " positifs"), xa + wd / 2, c.H - B + 16, {size: 12, color: P.ink});
        S.draw.text(c, "restent", xa + wd / 2, c.H - B + 36, {size: 10, color: "#6b7685", weight: 600});
        S.draw.text(c, F(Math.round(rest[j]), 0), xa + wd / 2, c.H - B + 51, {size: 11.5, color: "#3d4b5f"}); });
      S.draw.line(c, L, Y(0.95), c.W - R, Y(0.95), P.ink, 1.4, [5, 4]); S.draw.label(c, "seuil 95 %", L + 4, Y(0.95) - 12, {color: P.ink, align: "left", size: 10.5});
      S.draw.text(c, "sur " + F(N, 0) + " personnes testées ; rouge = part de vrais malades", L, 12, {size: 11, align: "left", color: "#6b7685"});
      var need = "—"; for (j = 1; j <= 12; j++){ var o2 = o0 * Math.pow(rv, j); if (o2 / (1 + o2) > 0.95){ need = j; break; } }
      if (dep.value) need = "jamais";
      ro.set(0, F(rv, 1)); ro.set(1, pct(vals[1])); ro.set(2, pct(vals[2])); ro.set(3, need);
      nt.set(dep.value ? "Erreurs identiques : le 2e, 3e… test répète le 1er et n'ajoute rien. La probabilité plafonne à la valeur obtenue après un seul positif, et le nombre de personnes restantes ne diminue plus." : "Tests indépendants : cote × " + F(rv, 1) + " à chaque positif, et il reste de moins en moins de faux positifs. Un seul positif ne suffit pas en dépistage de maladie rare ; la confirmation par un test différent est précieuse.", dep.value ? "warn" : "ok");
    });
  }
});
})();
