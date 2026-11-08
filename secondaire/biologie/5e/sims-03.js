/* Chapitre 3 · Hormones, rétrocontrôle et glycémie */
(function(){
/* Modèle simplifié glycémie-insuline-glucagon (type « modèle minimal ») : unités arbitraires pour l'insuline.
   G en g/L ; apport par un repas ; insuline sécrétée si G > 1,0 g/L ; glucagon relevé si G < 0,85 g/L. */
var P1 = 0.012, P2 = 0.03, P3 = 1.6e-4, IB = 8, GB = 0.9, NN = 0.12, GAM = 0.008, HH = 1.0, VG = 8;
var EGP = (P1 + P3 * IB / P2) * GB;
function run(meals, res, cap, T, tau, inj, st){
  var G = st[0], I = st[1], X = st[2], A = st[3], out = {G: [], I: [], A: [], X: []};
  for (var t = 0; t < T; t++){
    var Ra = 0;
    for (var m = 0; m < meals.length; m++){ var s = t - meals[m][0]; if (s > 0) Ra += (meals[m][1] * 0.9 / VG) * (s / (tau * tau)) * Math.exp(-s / tau); }
    var sec = cap * (NN * IB + GAM * Math.max(0, G - HH) * 1000);
    var dG = EGP - (P1 + X) * G + Ra + 0.0035 * (A - 1);
    var dX = -P2 * X + P3 * (1 - res) * I;
    var dI = -NN * I + sec + (inj ? inj(t) : 0);
    A += -0.1 * (A - (1 + 6 * Math.max(0, 0.85 - G) / 0.3));
    G = Math.min(Math.max(G + dG, 0.15), 6); X += dX; I = Math.max(I + dI, 0);
    out.G.push(G); out.I.push(I); out.A.push(A); out.X.push(X);
  }
  return out;
}
function gluco(o){
  var res = o.res || 0, cap = o.cap === undefined ? 1 : o.cap, tau = o.tau || 35, base = o.base || 0;
  var pre = run([], res, cap, 3000, tau, function(){ return base; }, [GB, IB * cap + (base / NN), P3 * (1 - res) * (IB * cap + base / NN) / P2, 1]);
  var l = pre.G.length - 1;
  return run(o.meals || [], res, cap, o.T || 480, tau, o.inj, [pre.G[l], pre.I[l], pre.X[l], pre.A[l]]);
}
var TAU = {h: 25, m: 35, b: 60};

SFA.sim({
  id: "b5-c03-repas", ch: "c03", tag: "Classique",
  titre: "Un repas : glycémie, insuline et glucagon",
  resume: "Le glucose passe de l'intestin au sang ; le pancréas répond par l'insuline, le foie stocke le glycogène.",
  but: "Choisis la quantité de glucides et le type d'aliment, puis lance le repas : regarde le glucose passer de l'intestin dans le sang, les cellules β du pancréas libérer l'insuline et le foie stocker le glycogène. Glisse sur les courbes pour revenir à un instant. Défi : un repas d'au moins 80 g de glucides dont le pic reste sous 1,4 g/L.",
  aRetenir: "La glycémie (≈ 0,7–1,1 g/L à jeun) est réglée par rétrocontrôle négatif : si elle monte, le pancréas sécrète de l'insuline, qui fait entrer le glucose dans les cellules et stocker le glycogène dans le foie et les muscles ; la glycémie redescend, la sécrétion d'insuline diminue. Si elle baisse trop, le glucagon fait libérer du glucose par le foie.",
  piege: "L'insuline ne fait pas monter la glycémie : elle la fait baisser. Et la sécrétion n'est pas « arrêtée définitivement » : elle s'ajuste en continu. Modèle simplifié, insuline en unités arbitraires ; pour de très gros repas rapides (plus de 100 g), le pic du modèle est exagéré : chez une personne en bonne santé, il dépasse rarement 1,6 à 1,8 g/L.",
  build: function(k, S){
    var c = k.canvas(590), pal = S.draw.palette, D = S.draw;
    var Dg = k.slider("Glucides ingérés", 0, 150, 5, 50, "g", function(){ tm = 0; play = true; });
    var ali = k.seg("Aliment", [["h", "IG élevé (pain blanc, soda)"], ["m", "IG moyen"], ["b", "IG bas (légumineuses)"]], "m", function(){ tm = 0; play = true; });
    var ro = k.readouts(["Pic de glycémie", "Moment du pic", "Retour sous 1,1 g/L", "Pic d'insuline"]);
    var nt = k.note("", "");
    var tm = 0, an = 0, play = true, geo = {}, drag = false, cache = {}, rnd = B5.rng(5), P = [], i;
    for (i = 0; i < 90; i++) P.push({o: rnd(), y: rnd(), u: rnd(), v: rnd()});
    k.button("Lecture / pause", function(){ play = !play; if (play && tm >= 359) tm = 0; }, true);
    k.button("Recommencer le repas", function(){ tm = 0; play = true; });
    var lp = k.loop(function(dt){ an += dt; if (play){ tm += dt * 30; if (tm >= 359){ tm = 359; play = false; } } k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down") drag = geo.ax && p.y > geo.gy;
      if (drag && (t === "down" || t === "drag")){ tm = B5.cl(geo.ax.ix(p.x), 0, 359); play = false; }
      if (t === "up") drag = false;
    });
    function model(){
      var key = Dg.value + ali.value; if (cache.key === key) return cache;
      var tau = TAU[ali.value], r = gluco({meals: [[30, Dg.value]], tau: tau, T: 360}), Ra = [], gly = [], gl = 0, upt = [], gut = [], t;
      for (t = 0; t < 360; t++){
        var s = t - 30, ra = s > 0 ? (Dg.value * 0.9 / VG) * (s / (tau * tau)) * Math.exp(-s / tau) : 0;
        Ra.push(ra); gut.push(t < 30 ? 0 : Dg.value * (1 - (1 + s / tau) * Math.exp(-s / tau)));
        var u = Math.max(0, r.X[t] * r.G[t]); upt.push(u); gl += u * VG; gly.push(gl);
      }
      cache = {key: key, r: r, Ra: Ra, gly: gly, upt: upt, gut: gut, RaM: Math.max.apply(null, Ra) || 1, uM: Math.max.apply(null, upt) || 1, IM: Math.max.apply(null, r.I), AM: Math.max.apply(null, r.A), glM: Math.max(gl, 1)};
      return cache;
    }
    k.draw(function(){
      var m = model(), r = m.r, G = r.G, pk = 0, ip = 0, ix = Math.min(359, Math.round(tm));
      for (i = 0; i < G.length; i++) if (G[i] > pk){ pk = G[i]; ip = i; }
      var back = -1; if (pk > 1.1) for (i = ip; i < G.length; i++) if (G[i] <= 1.1){ back = i; break; }
      var g = G[ix], I = r.I[ix], A = r.A[ix], ra = m.Ra[ix] / m.RaM, up = m.upt[ix] / Math.max(m.uM, 1e-9);
      var beta = B5.cl((I - IB) / Math.max(30, m.IM - IB), 0, 1), alpha = B5.cl((A - 1) / 1.5, 0, 1);
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 262;
      D.rrect(c, 6, 6, W - 12, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#fbf5ee"); bg.addColorStop(1, "#f1f4fa"); ctx.fillStyle = bg; ctx.fill();
      /* vaisseau sanguin */
      var vy = 116, vh = 42, x0 = 16, x1 = W - 16;
      D.rrect(c, x0, vy, x1 - x0, vh, 21); ctx.fillStyle = "#f7cfc8"; ctx.fill(); ctx.strokeStyle = "#d9776b"; ctx.lineWidth = 2.5; ctx.stroke();
      D.text(c, "sang →", x1 - 30, vy + vh - 9, {size: 10.5, color: "#a5463a", weight: 800});
      /* intestin grêle (tube replié) */
      var ix0 = 22, ix1 = Math.max(110, W * 0.36), iyc = 62;
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      function gutPath(){ ctx.beginPath(); for (var q = 0; q <= 40; q++){ var xx = ix0 + 8 + (ix1 - ix0 - 16) * q / 40, yy = iyc + Math.sin(q / 40 * Math.PI * 4) * 20; if (q) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } }
      gutPath(); ctx.strokeStyle = "#c97a66"; ctx.lineWidth = 22; ctx.stroke(); gutPath(); ctx.strokeStyle = "#f3c3b0"; ctx.lineWidth = 17; ctx.stroke(); ctx.restore();
      var ngut = Math.min(14, Math.round(m.gut[ix] > 0 ? (Dg.value - m.gut[ix]) / 150 * 14 + 0.5 : (tm < 30 ? Dg.value / 150 * 14 : 0)));
      for (i = 0; i < ngut; i++){ var q2 = (P[i].o + an * 0.05) % 1, gx = ix0 + 8 + (ix1 - ix0 - 16) * q2; B5.circ(c, gx, iyc + Math.sin(q2 * Math.PI * 4) * 20, 3.4, "#f4c542", "#a56300", 1); }
      D.text(c, "intestin grêle", (ix0 + ix1) / 2, 22, {size: 11, color: "#9a4a36", weight: 800});
      /* absorption : glucose de l'intestin vers le sang */
      var nab = Math.round(ra * 9);
      for (i = 0; i < nab; i++){ var pa = P[i + 20], f = (pa.o + an * 0.6) % 1, ax0 = ix0 + 20 + pa.u * (ix1 - ix0 - 40); B5.circ(c, ax0, 84 + f * (vy + 10 - 84), 3.4, "#f4c542", "#a56300", 1); }
      if (nab) D.arrow(c, ix1 - 6, 84, ix1 - 6, vy - 2, "#a56300", 1.6);
      /* pancréas et îlot de Langerhans */
      var pr = Math.min(58, W * 0.15), px = W - pr - 26, py = 58;
      ctx.fillStyle = "#f4d2a8"; ctx.strokeStyle = "#c9954a"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(px, py, pr, 28, -0.06, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      D.glow(c, px - pr * 0.3, py, 26, pal.violet, 0.15 + 0.6 * beta); D.glow(c, px + pr * 0.42, py, 20, pal.orange, 0.1 + 0.7 * alpha);
      for (i = 0; i < 5; i++) B5.circ(c, px - pr * 0.55 + i * pr * 0.17, py + (i % 2 ? 6 : -6), 6, "#9a7be0", "#5a3fb0", 1.4);
      for (i = 0; i < 2; i++) B5.circ(c, px + pr * 0.32 + i * 13, py + (i ? 6 : -6), 5.5, "#f0a35a", "#b2620f", 1.4);
      D.text(c, "pancréas", px, py - 38, {size: 11, color: "#8a5a2b", weight: 800});
      D.text(c, "β : insuline", px - pr * 0.25, py + 40, {size: 10, color: pal.violet, weight: 800}); D.text(c, "α", px + pr * 0.4, py + 40, {size: 10, color: "#b2620f", weight: 800});
      var nsec = Math.round(beta * 8);
      for (i = 0; i < nsec; i++){ var ps = P[i + 40], fs = (ps.o + an * 0.7) % 1; B5.circ(c, px - pr * 0.5 + ps.u * pr * 0.6, py + 26 + fs * (vy + 6 - py - 26), 3.2, pal.violet, "#fff", 1); }
      var nga = Math.round(alpha * 5);
      for (i = 0; i < nga; i++){ var pg = P[i + 50], fg = (pg.o + an * 0.7) % 1; ctx.fillStyle = pal.orange; var gx2 = px + pr * 0.3 + pg.u * 16, gy2 = py + 26 + fg * (vy + 6 - py - 26); ctx.fillRect(gx2 - 3, gy2 - 3, 6, 6); }
      /* afficheur de glycémie */
      D.display(c, g.toFixed(2).replace(".", ","), (ix1 + px - pr) / 2, 52, {w: 78, h: 44, size: 16, caption: "glycémie g/L", color: g > 1.4 ? "#a31d0e" : g < 0.7 ? "#b2620f" : "#13233a"});
      /* glucose et insuline dans le sang */
      var ng = Math.min(48, Math.round(g * 15)), ni = Math.min(16, Math.round(I / Math.max(m.IM, 20) * 16));
      for (i = 0; i < ng; i++){ var pb = P[i], fb = (pb.o + an * 0.06) % 1; B5.circ(c, x0 + 12 + fb * (x1 - x0 - 24), vy + 8 + pb.y * (vh - 16), 3.4, "#f4c542", "#a56300", 1); }
      for (i = 0; i < ni; i++){ var pi = P[i + 60], fi = (pi.o + an * 0.08) % 1; B5.circ(c, x0 + 12 + fi * (x1 - x0 - 24), vy + 8 + pi.v * (vh - 16), 3, pal.violet, "#fff", 1); }
      /* foie et muscle (cellules cibles) */
      var ly = vy + vh + 18, lh = sh - ly - 6, lx1 = W * 0.5 - 6;
      ctx.fillStyle = "#c46a55"; ctx.strokeStyle = "#8c3b2c"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(20, ly + 14); ctx.bezierCurveTo(30, ly - 6, lx1 - 14, ly - 8, lx1, ly + 8); ctx.quadraticCurveTo(lx1 - 2, ly + lh * 0.75, (18 + lx1) * 0.55, ly + lh - 2); ctx.quadraticCurveTo(26, ly + lh + 2, 18, ly + lh * 0.55); ctx.closePath(); ctx.fill(); ctx.stroke();
      var ngl = Math.round(m.gly[ix] / m.glM * 16 * Math.min(1, Dg.value / 60 + 0.2));
      for (i = 0; i < ngl; i++){ var pl = P[i + 70], gx3 = 34 + pl.u * (lx1 - 70), gy3 = ly + 14 + pl.v * (lh - 34); for (var a = 0; a < 6; a++) B5.circ(c, gx3 + 4 * Math.cos(a), gy3 + 4 * Math.sin(a), 1.8, "#fbe6a2"); }
      D.text(c, "foie : glycogène", (18 + lx1) / 2, ly + lh - 10, {size: 10.5, color: "#fff", weight: 800});
      var mx0 = W * 0.5 + 8, mx1 = W - 18;
      D.rrect(c, mx0, ly, mx1 - mx0, lh - 4, 12); ctx.fillStyle = "#e7a7a0"; ctx.fill(); ctx.strokeStyle = "#a9504a"; ctx.lineWidth = 2; ctx.stroke();
      for (i = 1; i < 8; i++){ var sx = mx0 + (mx1 - mx0) * i / 8; D.line(c, sx, ly + 4, sx, ly + lh - 8, "rgba(140,50,45,.35)", 1.4); }
      D.text(c, "muscle", (mx0 + mx1) / 2, ly + lh - 14, {size: 10.5, color: "#7a2b25", weight: 800});
      var nup = Math.round(up * 10);
      for (i = 0; i < nup; i++){ var pu = P[i + 5], fu = (pu.o + an * 0.55) % 1, ux = pu.u < 0.5 ? 40 + pu.v * (lx1 - 80) : mx0 + 12 + pu.v * (mx1 - mx0 - 24); B5.circ(c, ux, vy + vh - 4 + fu * 34, 3.2, "#f4c542", "#a56300", 1); }
      if (alpha > 0.15){ for (i = 0; i < Math.round(alpha * 5); i++){ var pr2 = P[i + 80], fr = (pr2.o + an * 0.55) % 1; B5.circ(c, 40 + pr2.u * (lx1 - 80), ly + 4 - fr * 26, 3.2, "#f4c542", "#b2620f", 1.6); } D.label(c, "glucagon : le foie libère du glucose", (18 + lx1) / 2 + 20, ly - 8, {color: "#b2620f", size: 10}); }
      else if (beta > 0.15) D.label(c, "insuline : le glucose entre dans les cellules", W / 2, ly - 9, {color: pal.violet, size: 10});
      /* ---------- courbes ---------- */
      var gy = sh + 14; geo.gy = gy - 4; D.panel(c, 6, gy - 2, W - 12, H - gy - 2, {shadow: false, fill: "#fbfcfe"});
      var h1 = (H - gy) * 0.56;
      var ax = D.axes(c, {x0: 0, x1: 360, y0: 0, y1: 3, xl: "", stepX: 60, stepY: 0.5, t: gy + 22, b: H - (gy + h1), l: 42, r: 16}); geo.ax = ax;
      D.text(c, "glycémie (g/L)", 14, gy + 10, {size: 11, color: pal.grey, align: "left"});
      ctx.fillStyle = "rgba(36,119,90,.12)"; ctx.fillRect(ax.L, ax.Y(1.1), ax.R - ax.L, ax.Y(0.7) - ax.Y(1.1));
      D.line(c, ax.L, ax.Y(1.4), ax.R, ax.Y(1.4), pal.red, 1.2, [5, 4]); D.label(c, "défi : pic < 1,4", ax.R - 4, ax.Y(1.4) - 11, {color: pal.red, align: "right", size: 10});
      B5.poly(c, ax, G.map(function(v, t){ return [t, v]; }), "rgba(98,54,196,.25)", 2);
      B5.poly(c, ax, G.slice(0, ix + 1).map(function(v, t){ return [t, v]; }), pal.violet, 3);
      D.line(c, ax.X(30), ax.T, ax.X(30), ax.B, pal.amber, 1.3, [4, 4]); D.text(c, "repas", ax.X(30) + 4, ax.T + 8, {align: "left", size: 10.5, color: pal.amber});
      D.line(c, ax.X(tm), ax.T, ax.X(tm), ax.B, pal.ink, 1.2, [4, 3]); D.dot(c, ax.X(tm), ax.Y(g), 5, pal.violet);
      var top2 = gy + h1 + 36, yM = Math.max(40, Math.ceil(m.IM / 20) * 20);
      var ax2 = D.axes(c, {x0: 0, x1: 360, y0: 0, y1: yM, xl: "t (min) · glisse pour te déplacer", stepX: 60, stepY: yM / 2, t: top2, b: 32, l: 42, r: 16});
      D.text(c, "insuline (u.a., tirets) · glucagon (×10, orange)", 14, top2 - 8, {size: 10.5, color: pal.grey, align: "left"});
      B5.poly(c, ax2, r.I.slice(0, ix + 1).map(function(v, t){ return [t, v]; }), pal.violet, 2.4, [6, 3]);
      B5.poly(c, ax2, r.A.slice(0, ix + 1).map(function(v, t){ return [t, Math.min(yM, 10 * v)]; }), pal.orange, 2.4);
      D.line(c, ax2.X(tm), ax2.T, ax2.X(tm), ax2.B, pal.ink, 1.2, [4, 3]);
      D.label(c, "t = " + Math.floor(tm / 60) + " h " + (Math.floor(tm % 60) < 10 ? "0" : "") + Math.floor(tm % 60), W - 18, gy + 10, {align: "right", size: 10.5, color: pal.ink});
      ro.set(0, S.fmt(pk, 2) + " g/L"); ro.set(1, Dg.value && ip >= 30 ? S.fmt(ip - 30, 0) + " min après le début" : "—");
      ro.set(2, Dg.value === 0 || pk <= 1.1 ? "pas de dépassement" : back < 0 ? "> 5 h" : S.fmt(back - 30, 0) + " min après le début"); ro.set(3, S.fmt(m.IM, 0) + " u.a. (repos : 8)");
      if (Dg.value === 0) nt.set("Pas de repas : la glycémie reste à 0,9 g/L, l'insuline à sa valeur de base.", "");
      else if (Dg.value >= 80 && pk < 1.4) nt.set("Défi réussi : " + Dg.value + " g de glucides et un pic de " + S.fmt(pk, 2) + " g/L seulement. Un aliment à IG bas libère son glucose lentement : l'insuline a le temps de suivre.", "ok");
      else if (pk >= 1.4) nt.set("Pic à " + S.fmt(pk, 2) + " g/L (≥ 1,4) : plus l'absorption est rapide (IG élevé) et la quantité grande, plus le pic est haut, et plus la sécrétion d'insuline est forte." + (ali.value === "h" && pk > 1.2 ? " Remarque le rebond : la glycémie passe sous 0,85 g/L et le glucagon monte." : ""), "warn");
      else nt.set("Pic modéré (" + S.fmt(pk, 2) + " g/L) : l'insuline absorbe la hausse. Défi : ose au moins 80 g de glucides en gardant le pic sous 1,4 g/L.", "");
    });
  }
});

/* ---------- diabètes ---------- */
SFA.sim({
  id: "b5-c03-diabete", ch: "c03", tag: "Comparaison",
  titre: "Diabète de type 1, de type 2, ou bien portant ?",
  resume: "Sécrétion d'insuline et sensibilité des cellules → glycémie après le repas.",
  but: "Choisis un profil ou règle toi-même la sécrétion d'insuline et la résistance des cellules. Lance le repas de 60 g de glucides : regarde l'insuline quitter le pancréas et ouvrir (ou pas) les portes des cellules, puis compare la glycémie à celle d'une personne en bonne santé (pointillés).",
  aRetenir: "Type 1 : les cellules β du pancréas sont détruites (maladie auto-immune) : plus ou presque plus d'insuline, la glycémie s'envole. Type 2 : l'insuline est présente mais les cellules cibles y répondent mal (résistance) et la sécrétion finit par s'épuiser. Critère OMS : glycémie à jeun ≥ 1,26 g/L (à confirmer) = diabète.",
  piege: "Le diabète n'est pas « trop de sucre mangé ». Dans le type 1, il n'y a pas assez d'insuline ; dans le type 2, les cellules cibles n'obéissent plus. Le type 1 n'est pas causé par l'alimentation. Valeurs d'un modèle simplifié, non diagnostiques.",
  build: function(k, S){
    var c = k.canvas(540), pal = S.draw.palette, D = S.draw;
    var res, cap;
    var pr = k.select("Profil", [["n", "En bonne santé"], ["1", "Diabète de type 1 (non traité)"], ["2", "Diabète de type 2"], ["p", "Prédiabète"], ["x", "Réglage libre"]], "2", function(v){
      var m = {n: [0, 100], 1: [0, 0], 2: [70, 40], p: [60, 70]}[v]; if (m){ res.set(m[0]); cap.set(m[1]); }
    });
    res = k.slider("Résistance à l'insuline", 0, 90, 5, 70, "%");
    cap = k.slider("Capacité de sécrétion d'insuline", 0, 100, 5, 40, "%");
    var ro = k.readouts(["Glycémie à jeun", "Pic après repas", "2 h après le repas", "Verdict (à jeun)"]);
    var nt = k.note("", "");
    var tm = 0, play = true, geo = {}, drag = false, rnd = B5.rng(21), GP = [], IP = [], i;
    for (i = 0; i < 60; i++) GP.push({o: rnd(), u: rnd(), y: rnd(), d: Math.floor(rnd() * 3)});
    for (i = 0; i < 24; i++) IP.push({o: rnd(), y: rnd()});
    var lp = k.loop(function(dt){ if (play){ tm += dt * 22; if (tm > 330) tm = 0; } k.redraw(); }); lp.play();
    k.button("Lancer le repas (lecture / pause)", function(){ play = !play; if (play && tm > 299) tm = 0; }, true);
    k.button("Revenir à 0", function(){ tm = 0; });
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") drag = p.y > geo.gy; if (drag && (t === "down" || t === "drag") && geo.ax){ tm = Math.max(0, Math.min(299, geo.ax.ix(p.x))); play = false; k.redraw(); } if (t === "up") drag = false; });
    k.draw(function(){
      var a = gluco({meals: [[30, 60]], res: 0, cap: 1, T: 300}), b = gluco({meals: [[30, 60]], res: res.value / 100, cap: cap.value / 100, T: 300});
      var pk = Math.max.apply(null, b.G), fast = b.G[0], two = b.G[150], ix = Math.min(299, Math.round(tm)), G = b.G[ix], I = b.I[ix], Xm = Math.max.apply(null, a.X) || 1, open = B5.cl(b.X[ix] / Xm, 0, 1);
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 232;
      D.rrect(c, 8, 8, W - 16, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#f6f3fc"); bg.addColorStop(1, "#eef3fa"); ctx.fillStyle = bg; ctx.fill();
      /* vaisseau */
      var vy = 92, vh = 40, x0 = 20, x1 = W - 20;
      D.rrect(c, x0, vy, x1 - x0, vh, 20); ctx.fillStyle = "#f8d2cc"; ctx.fill(); ctx.strokeStyle = "#e0897f"; ctx.lineWidth = 2.5; ctx.stroke();
      D.text(c, "sang", x1 - 24, vy + 11, {size: 10.5, color: "#a5463a", weight: 800});
      /* pancréas */
      var px = W * 0.2, py = 50; ctx.fillStyle = "#f4c9a0"; ctx.strokeStyle = "#c9954a"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(px, py, 62, 24, -0.08, 0, 7); ctx.fill(); ctx.stroke();
      var nb = 6; for (i = 0; i < nb; i++){ var bx = px - 40 + i * 16, by = py + (i % 2 ? 7 : -7), alive = cap.value > 0 && i < Math.max(1, Math.round(cap.value / 100 * nb)); B5.circ(c, bx, by, 6.5, alive ? "#9a7be0" : "#d5d0dc", alive ? "#5a3fb0" : "#aaa3b5", 1.5); if (cap.value === 0) { D.text(c, "×", bx, by, {size: 11, color: pal.red, weight: 900}); } }
      D.text(c, "pancréas (cellules β)", px, py - 28, {size: 11, color: "#8a5a2b", weight: 800});
      /* insuline : sort du pancréas, circule dans le sang */
      var ni = Math.min(24, Math.round(I / 2.4)); for (i = 0; i < ni; i++){ var q = IP[i], s = (tm * .02 + q.o) % 1, ix2 = px - 20 + s * (x1 - px - 40), iy = s < .08 ? py + 20 + s / .08 * (vy - py - 14) : vy + 8 + q.y * (vh - 16); B5.circ(c, ix2, iy, 3.6, pal.violet, "#fff", 1); }
      /* cellule cible */
      var cx0 = W * 0.42, cx1 = W - 30, cy0 = vy + vh + 24; D.rrect(c, cx0, cy0, cx1 - cx0, sh - (cy0 - 8) - 8, 20); ctx.fillStyle = "#fff6e2"; ctx.fill(); ctx.strokeStyle = "#d9a441"; ctx.lineWidth = 3; ctx.stroke();
      D.text(c, "cellule cible (muscle, foie…)", (cx0 + cx1) / 2, sh - 4, {size: 11, color: "#8a6508", weight: 800});
      var doors = [cx0 + (cx1 - cx0) * .2, cx0 + (cx1 - cx0) * .5, cx0 + (cx1 - cx0) * .8];
      doors.forEach(function(dx){ ctx.fillStyle = open > .08 ? pal.green : (res.value > 40 ? "#b04a3a" : "#8a95a3"); ctx.fillRect(dx - 15, cy0 - 4, 11 + (1 - open) * 4, 8); ctx.fillRect(dx + 4 + (1 - open) * 0, cy0 - 4, 11, 8); if (open > .3){ D.glow(c, dx, cy0, 20, pal.green, .4 * open); } if (res.value >= 50) D.text(c, "✕", dx, cy0 + 12, {size: 10, color: "#b04a3a", weight: 900}); });
      /* glucose */
      var ng = Math.min(60, Math.round(G * 14)); var spd = .05;
      for (i = 0; i < ng; i++){ var p = GP[i], s2 = (tm * spd * .1 + p.o) % 1, gx = x0 + 10 + s2 * (x1 - x0 - 20), gy = vy + 8 + p.y * (vh - 16);
        if (p.u < open * .55){ var dxp = doors[p.d]; if (gx > dxp - 40 && gx < dxp + 60){ var f = B5.cl((gx - (dxp - 30)) / 50, 0, 1); gx = gx + (dxp - gx) * f; gy = gy + (cy0 + 22 + p.y * 30 - gy) * f; } }
        B5.circ(c, gx, gy, 3.8, "#f4c542", "#a56300", 1); }
      var nin = Math.round(open * 22); for (i = 0; i < nin; i++){ var r2 = GP[i + 20]; B5.circ(c, cx0 + 24 + (r2.o * (cx1 - cx0 - 48)) + Math.sin(tm * .3 + i) * 3, cy0 + 30 + r2.y * ((sh - (cy0 - 8)) - 70) + Math.cos(tm * .27 + i) * 3, 3.6, "#f4c542", "#a56300", 1); }
      D.legend(c, [["#f4c542", "glucose"], [pal.violet, "insuline"]], 18, 140, {box: true});
      D.display(c, S.fmt(G, 2), 60, 207, {w: 88, h: 46, size: 17, caption: "glycémie (g/L)", color: G >= 1.26 ? "#a31d0e" : "#13233a"});
      D.label(c, "t = " + S.fmt(Math.floor(tm / 60), 0) + " h " + S.fmt(Math.floor(tm % 60), 0) + " min" + (tm >= 30 && tm < 60 ? " · repas" : ""), W - 18, 22, {color: pal.ink, size: 11.5, align: "right"});
      /* ---------- courbes ---------- */
      var gy = sh + 22; geo.gy = gy - 6; D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var h1 = (H - gy - 16) * 0.56;
      var ax = D.axes(c, {x0: 0, x1: 300, y0: 0, y1: 6, xl: "", stepX: 60, stepY: 2, t: gy + 8, b: H - (gy + 8 + h1) , l: 40, r: 18}); geo.ax = ax;
      D.text(c, "glycémie (g/L)", 14, gy + 3, {size: 11, color: pal.grey, align: "left"});
      ctx.fillStyle = "rgba(192,50,29,.08)"; ctx.fillRect(ax.L, ax.T, ax.R - ax.L, ax.Y(1.26) - ax.T);
      D.line(c, ax.L, ax.Y(1.26), ax.R, ax.Y(1.26), pal.red, 1.2, [5, 4]); D.label(c, "1,26", ax.R - 4, ax.Y(1.26) - 11, {color: pal.red, align: "right", size: 10.5});
      B5.poly(c, ax, a.G.map(function(g, t){ return [t, g]; }), pal.grey, 2, [6, 4]);
      B5.poly(c, ax, b.G.map(function(g, t){ return [t, g]; }).slice(0, ix + 1), pal.violet, 3);
      D.line(c, ax.X(tm), ax.T, ax.X(tm), ax.B, pal.ink, 1.2, [4, 3]); D.dot(c, ax.X(Math.min(299, tm)), ax.Y(G), 5, pal.violet);
      var ymax = Math.max(40, Math.ceil(Math.max.apply(null, b.I) / 20) * 20);
      var top2 = gy + 8 + h1 + 30, ax2 = D.axes(c, {x0: 0, x1: 300, y0: 0, y1: ymax, xl: "t (min)  ·  glisse pour te déplacer", stepX: 60, stepY: ymax / 2, t: top2, b: 34, l: 40, r: 18});
      D.text(c, "insuline (u.a.)", 14, top2 - 8, {size: 11, color: pal.grey, align: "left"});
      B5.poly(c, ax2, a.I.map(function(v, t){ return [t, v]; }), pal.grey, 2, [6, 4]); B5.poly(c, ax2, b.I.map(function(v, t){ return [t, v]; }).slice(0, ix + 1), pal.red, 2.8);
      D.line(c, ax2.X(tm), ax2.T, ax2.X(tm), ax2.B, pal.ink, 1.2, [4, 3]);
      var verdict = fast >= 1.26 ? "≥ 1,26 : diabète" : fast >= 1.10 ? "1,10–1,25 : anormale" : "normale";
      ro.set(0, S.fmt(fast, 2) + " g/L"); ro.set(1, S.fmt(pk, 2) + " g/L"); ro.set(2, S.fmt(two, 2) + " g/L"); ro.set(3, verdict);
      var comp = res.value >= 50 && cap.value >= 70;
      if (cap.value === 0) nt.set("Sans insuline : le glucose ne peut pas entrer dans les cellules, la glycémie s'envole (modèle plafonné à 6 g/L). C'est le diabète de type 1 non traité.", "warn");
      else if (fast >= 1.26) nt.set(comp ? "Les cellules sont très résistantes : même avec beaucoup d'insuline, la glycémie à jeun reste ≥ 1,26 g/L (critère de diabète). Les cellules β finissent par s'épuiser." : "Hyperglycémie à jeun persistante : critère de diabète. Insuline présente mais inefficace ou insuffisante.", "warn");
      else if (fast >= 1.10) nt.set("Glycémie à jeun anormale (1,10 à 1,25 g/L) : " + (comp ? "le pancréas compense par une forte sécrétion d'insuline, mais la régulation est déjà moins efficace (prédiabète). Les cellules β peuvent s'épuiser." : "la régulation est moins efficace (prédiabète), à surveiller."), "warn");
      else if (comp) nt.set("Les cellules sont résistantes mais le pancréas compense : très forte insuline, glycémie encore proche de la normale. Les cellules β finissent par s'épuiser.", "warn");
      else nt.set("Régulation efficace : la glycémie revient vers la valeur de base.", "ok");
    });
  }
});

/* ---------- thermostat ---------- */
SFA.sim({
  id: "b5-c03-thermostat", ch: "c03", tag: "Original",
  titre: "Le thermostat : un rétrocontrôle négatif pas à pas",
  resume: "Consigne, perturbation et gain → la grandeur réglée revient-elle à la consigne ?",
  but: "Une pièce chauffée par un radiateur : à t = 30 min, la température extérieure change. Regarde la boucle capteur → comparaison → radiateur. Glisse le repère vert du thermomètre pour changer la consigne, règle le gain et compare la pièce régulée à la pièce sans régulation (pointillés). Cherche le gain pour lequel l'écart reste sous 0,5 °C.",
  aRetenir: "Un système de régulation comprend un capteur, un centre qui compare à la consigne, un effecteur. Le rétrocontrôle négatif corrige l'écart dans le sens opposé à la perturbation. Plus la réponse est sensible, plus la valeur reste proche de la consigne. La glycémie, la température du corps, la calcémie sont réglées ainsi.",
  piege: "Un rétrocontrôle négatif ne ramène pas toujours exactement à la consigne (écart résiduel, surtout si le gain est faible) et ne « stabilise » pas si l'effecteur est saturé (chauffage au maximum). Modèle d'analogie : ni la pièce ni un humain ne sont aussi simples.",
  build: function(k, S){
    var c = k.canvas(480), pal = S.draw.palette, D = S.draw;
    var Ts = k.slider("Consigne du thermostat", 20, 26, 0.5, 22, "°C");
    var Te = k.slider("Température extérieure après t = 30 min", -10, 30, 1, 0, "°C");
    var g = k.slider("Gain (sensibilité du thermostat)", 0, 2, 0.05, 0.5, "");
    var ro = k.readouts(["T finale (avec thermostat)", "Écart à la consigne", "T finale (sans régulation)", "Chauffage final"]);
    var nt = k.note("", "");
    var N = 120, tm = 0, geo = {}, drag = false;
    var lp = k.loop(function(dt){ tm += dt * 10; if (tm > N + 14) tm = 0; k.redraw(); });
    lp.play();
    k.button("Rejouer la simulation", function(){ tm = 0; }, true);
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down"){ drag = Math.abs(p.x - geo.tx) < 40 && p.y > geo.t0 - 10 && p.y < geo.t1 + 10; }
      if (drag && (t === "down" || t === "drag")){ var v = 14 + (geo.t1 - p.y) / (geo.t1 - geo.t0) * 16; Ts.set(Math.max(20, Math.min(26, Math.round(v * 2) / 2))); k.redraw(); }
      if (t === "up") drag = false;
    });
    k.draw(function(){
      var a = 0.05, b = 1.5, dt = 0.1, T1 = Ts.value, T2 = Ts.value, u0 = Math.max(0, a * (Ts.value - 20) / b), pts1 = [], pts2 = [], us = [], uu = 0;
      for (var t = 0; t <= N + 1e-9; t += dt){
        var Tx = t < 30 ? 20 : Te.value;
        uu = Math.min(1, Math.max(0, g.value * (Ts.value - T1)));
        T1 += (-a * (T1 - Tx) + b * uu) * dt; T2 += (-a * (T2 - Tx) + b * u0) * dt;
        pts1.push([t, T1]); pts2.push([t, T2]); us.push(uu);
      }
      var ii = Math.min(pts1.length - 1, Math.round(Math.min(tm, N) / dt)), Tn = pts1[ii][1], un = us[ii], Tout = Math.min(tm, N) < 30 ? 20 : Te.value;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H;
      /* ---------- scène : pièce en coupe ---------- */
      var sh = 252, hx = 96, hw = W - hx - 12;
      var sky = ctx.createLinearGradient(0, 0, 0, sh); sky.addColorStop(0, Tout < 8 ? "#cfe0f3" : Tout > 24 ? "#fde9c2" : "#e3eefa"); sky.addColorStop(1, "#f4f7fb");
      D.rrect(c, 8, 8, W - 16, sh, 12); ctx.fillStyle = sky; ctx.fill();
      /* extérieur */
      var cold = Tout < 8;
      if (Tout > 18){ D.glow(c, 46, 56, 44, pal.yellow, .8); B5.circ(c, 46, 56, 16, pal.yellow); }
      else { for (var f = 0; f < 6; f++){ var fx = 20 + (f * 29) % 66, fy = 30 + ((f * 41 + tm * 4) % 120); B5.circ(c, fx, fy, 3, cold ? "#fff" : "#cfd8e3", "#aebdce", 1); } }
      D.text(c, "extérieur", 46, 150, {size: 11, color: pal.grey, weight: 800});
      D.display(c, S.fmt(Tout, 0) + " °C", 46, 184, {w: 74, h: 36, size: 15});
      /* maison */
      var gw = ctx.createLinearGradient(0, 40, 0, sh); gw.addColorStop(0, "#fdf6ea"); gw.addColorStop(1, "#f6e4cb");
      ctx.fillStyle = "#c98f66"; ctx.beginPath(); ctx.moveTo(hx - 8, 56); ctx.lineTo(hx + hw / 2, 14); ctx.lineTo(hx + hw + 8, 56); ctx.closePath(); ctx.fill();
      ctx.fillStyle = gw; ctx.fillRect(hx, 52, hw, sh - 52 - 6); ctx.strokeStyle = "#8a6a4a"; ctx.lineWidth = 3; ctx.strokeRect(hx, 52, hw, sh - 58);
      /* teinte de l'air selon T */
      var warm = B5.cl((Tn - 14) / 14, 0, 1); ctx.fillStyle = "rgba(240,120,40," + (0.04 + 0.18 * warm) + ")"; ctx.fillRect(hx + 2, 54, hw - 4, sh - 62);
      /* fenêtre */
      ctx.fillStyle = "#cfe6f8"; ctx.fillRect(hx + 18, 84, 40, 56); ctx.strokeStyle = "#8a6a4a"; ctx.lineWidth = 3; ctx.strokeRect(hx + 18, 84, 40, 56); D.line(c, hx + 38, 84, hx + 38, 140, "#8a6a4a", 2);
      /* radiateur (effecteur) */
      var rx = hx + hw - 70, ry = 150;
      for (var fi = 0; fi < 6; fi++){ D.rrect(c, rx + fi * 10, ry, 7, 62, 3); ctx.fillStyle = un > .02 ? "rgb(" + Math.round(150 + 100 * un) + "," + Math.round(110 - 70 * un) + ",70)" : "#aeb7c2"; ctx.fill(); }
      if (un > 0.03) D.glow(c, rx + 30, ry + 30, 40 + 40 * un, pal.orange, .55 * un + .15);
      D.text(c, "radiateur (effecteur)", rx + 28, ry + 76, {size: 10.5, color: "#7a4a2a", weight: 800});
      D.text(c, S.fmt(un * 100, 0) + " %", rx + 28, ry + 32, {size: 12, color: un > .3 ? "#fff" : "#475569", weight: 900});
      /* thermomètre (capteur) + repère de consigne */
      var tx = hx + hw * 0.42, t0 = 84, t1 = 232; geo.tx = tx; geo.t0 = t0; geo.t1 = t1;
      D.rrect(c, tx - 7, t0, 14, t1 - t0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.stroke();
      var lv = t1 - (B5.cl(Tn, 14, 30) - 14) / 16 * (t1 - t0);
      D.rrect(c, tx - 4, lv, 8, t1 - lv - 1, 4); ctx.fillStyle = pal.red; ctx.fill();
      for (var d = 14; d <= 30; d += 2){ var yy = t1 - (d - 14) / 16 * (t1 - t0); D.line(c, tx + 9, yy, tx + 14, yy, "#8a95a3", 1); if (d % 4 === 2 || d === 30) D.text(c, d, tx + 28, yy, {size: 10, color: pal.grey, weight: 700}); }
      var sy = t1 - (Ts.value - 14) / 16 * (t1 - t0);
      ctx.fillStyle = pal.green; ctx.beginPath(); ctx.moveTo(tx - 10, sy); ctx.lineTo(tx - 26, sy - 9); ctx.lineTo(tx - 26, sy + 9); ctx.fill();
      D.glow(c, tx - 26, sy, 16, pal.green, .35);
      D.label(c, "consigne " + S.fmt(Ts.value, 1) + " °C", tx - 32, sy, {color: pal.green, align: "right", size: 11});
      D.text(c, "↕ glisse", tx - 18, sy + 22, {size: 10, color: pal.green, weight: 700});
      D.display(c, S.fmt(Tn, 1) + "°", tx, 36, {w: 76, h: 34, size: 15});
      D.text(c, "capteur", tx - 46, 36, {size: 10.5, color: "#fff", weight: 800, align: "right", halo: "#c98f66"});
      /* boucle */
      D.arrow(c, tx + 34, 108, rx + 6, 144, pal.violet, 2); D.text(c, "ordre : gain × écart", tx + 36, 98, {size: 10.5, color: pal.violet, weight: 800, align: "left"});
      D.text(c, "écart = " + S.fmt(Ts.value - Tn, 1) + " °C", hx + hw - 50, 70, {size: 11, color: pal.ink, weight: 800});
      /* ---------- courbe ---------- */
      var gy = sh + 20; D.panel(c, 8, gy, W - 16, H - gy - 8, {shadow: false, fill: "#fbfcfe"});
      var ymin = Math.min(Math.floor(Math.min(Te.value, Ts.value, T1, T2) / 2) * 2 - 2, 14), ymax = Math.ceil(Math.max(Ts.value, 22, Te.value, T1, T2) / 2) * 2 + 2;
      var ax = D.axes(c, {x0: 0, x1: N, y0: ymin, y1: ymax, xl: "t (min)", stepX: 20, stepY: 4, t: gy + 10, b: 32, l: 40, r: 20});
      D.line(c, ax.L, ax.Y(Ts.value), ax.R, ax.Y(Ts.value), pal.green, 1.6, [6, 4]); D.label(c, "consigne", ax.L + 6, ax.Y(Ts.value) - 11, {color: pal.green, align: "left", size: 11});
      D.line(c, ax.X(30), ax.T, ax.X(30), ax.B, pal.amber, 1.5, [5, 4]); D.label(c, "perturbation", ax.X(30) + 4, ax.B - 12, {color: pal.amber, align: "left", size: 11});
      B5.poly(c, ax, pts2, pal.grey, 2.2, [6, 4]); B5.poly(c, ax, pts1.slice(0, ii + 1), pal.violet, 3);
      D.dot(c, ax.X(pts1[ii][0]), ax.Y(Tn), 5, pal.violet);
      D.legend(c, [[pal.violet, "avec thermostat"], [pal.grey, "sans régulation", true]], ax.R - 4, ax.T + 2, {align: "right"});
      uu = us[us.length - 1];
      ro.set(0, S.fmt(T1, 1) + " °C"); ro.set(1, S.fmt(T1 - Ts.value, 1) + " °C"); ro.set(2, S.fmt(T2, 1) + " °C"); ro.set(3, S.fmt(uu * 100, 0) + " % de la puissance");
      if (g.value === 0) nt.set("Gain nul : le thermostat ne commande rien, c'est comme s'il n'y avait pas de régulation (la pièce suit l'extérieur).", "warn");
      else if (uu <= 0.001 && T1 - Ts.value > 0.5) nt.set("Chauffage à l'arrêt (0 %) : la pièce est plus chaude que la consigne et ce thermostat ne sait que chauffer, il ne peut pas refroidir. La température dérive vers celle de l'extérieur.", "warn");
      else if (uu >= 0.999 && Math.abs(T1 - Ts.value) > 0.5) nt.set("Chauffage saturé à 100 % : la perturbation est trop forte, la consigne ne peut plus être tenue.", "warn");
      else if (Math.abs(T1 - Ts.value) <= 0.5) nt.set("Écart de " + S.fmt(Math.abs(T1 - Ts.value), 1) + " °C seulement : la régulation compense bien, alors que sans régulation on dérive de " + S.fmt(Math.abs(T2 - Ts.value), 1) + " °C.", "ok");
      else nt.set("Écart de " + S.fmt(Math.abs(T1 - Ts.value), 1) + " °C : correction partielle. Augmente le gain pour réduire l'écart.", "warn");
    });
  }
});

/* ---------- pompe à insuline ---------- */
SFA.sim({
  id: "b5-c03-pompe", ch: "c03", tag: "Défi",
  titre: "Pompe à insuline : tiens la glycémie 24 h",
  resume: "Débit de base, ratio insuline/glucides, avance du bolus → temps passé dans la cible.",
  but: "Une personne avec un diabète de type 1 porte une pompe (insuline sous la peau) et un capteur de glucose. Règle le débit de base, la dose de bolus (1 unité pour X g de glucides) et l'avance du bolus, puis regarde la journée défiler. Défi 1 : au moins 90 % du temps entre 0,7 et 1,8 g/L sans hypoglycémie. Défi 2 (expert) : 100 % du temps entre 0,7 et 1,4 g/L.",
  aRetenir: "Dans le diabète de type 1, on remplace la sécrétion de base par un débit basal continu et la réponse aux repas par un bolus calculé sur les glucides. Trop d'insuline provoque une hypoglycémie (danger : malaise), trop peu une hyperglycémie. Prendre le bolus un peu avant le repas suit mieux la montée du glucose.",
  piege: "Plus d'insuline n'est pas toujours mieux : une dose trop forte fait chuter la glycémie sous 0,7 g/L. Simulation pédagogique et non outil médical : ne sert pas à régler un vrai traitement.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var basal = k.slider("Débit de base", 0, 2, 0.1, 0.6, "U/h");
    var icr = k.slider("1 unité d'insuline pour…", 4, 30, 1, 25, "g de glucides");
    var adv = k.slider("Bolus pris avant le repas", 0, 30, 5, 0, "min");
    var m1 = k.slider("Petit-déjeuner (8 h)", 20, 100, 5, 60, "g");
    var m2 = k.slider("Déjeuner (12 h 30)", 20, 100, 5, 70, "g");
    var m3 = k.slider("Dîner (19 h)", 20, 100, 5, 80, "g");
    var ro = k.readouts(["Temps dans la cible 0,7–1,8", "Glycémie min / max", "Hypo (< 0,7)", "Hyper (> 1,8)"]);
    var nt = k.note("", "");
    var tm = 360, an = 0, play = true, geo = {}, drag = false, cache = {}, rnd = B5.rng(9), P = [], i;
    for (i = 0; i < 40; i++) P.push({o: rnd(), y: rnd()});
    k.button("Lecture / pause de la journée", function(){ play = !play; }, true);
    var lp = k.loop(function(dt){ an += dt; if (play){ tm = (tm + dt * 90) % 1440; } k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down") drag = geo.ax && p.y > geo.gy;
      if (drag && (t === "down" || t === "drag")){ tm = B5.cl(geo.ax.ix(p.x) * 60, 0, 1439); play = false; }
      if (t === "up") drag = false;
    });
    function model(){
      var key = [basal.value, icr.value, adv.value, m1.value, m2.value, m3.value].join(); if (cache.key === key) return cache;
      var meals = [[480, m1.value], [750, m2.value], [1140, m3.value]];
      var bol = function(t){ var r = 0; meals.forEach(function(m){ var s = t - (m[0] - adv.value); if (s > 0) r += (m[1] / icr.value) * 40 * (s / 1600) * Math.exp(-s / 40); }); return r; };
      var inj = function(t){ return basal.value * 0.96 + bol(t); };
      var r = gluco({meals: meals, res: 0, cap: 0, base: basal.value * 0.96, T: 1440, inj: inj}), B = [];
      for (var t = 0; t < 1440; t++) B.push(bol(t));
      var G = r.G, inr = 0, tight = 0, hypo = 0, hyper = 0, mn = 9, mx = 0;
      G.forEach(function(g){ if (g >= 0.7 && g <= 1.8) inr++; if (g >= 0.7 && g <= 1.4) tight++; if (g < 0.7) hypo++; if (g > 1.8) hyper++; mn = Math.min(mn, g); mx = Math.max(mx, g); });
      cache = {key: key, meals: meals, G: G, B: B, BM: Math.max.apply(null, B) || 1, inr: inr, tight: tight, hypo: hypo, hyper: hyper, mn: mn, mx: mx};
      return cache;
    }
    k.draw(function(){
      var m = model(), ix = Math.min(1439, Math.floor(tm)), g = m.G[ix], bo = m.B[ix], rate = basal.value + bo * 60 / 40 / 0.96;
      var trend = m.G[Math.min(1439, ix + 10)] - m.G[Math.max(0, ix - 10)];
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 250;
      D.rrect(c, 6, 6, W - 12, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh);
      var night = tm < 420 || tm > 1320; bg.addColorStop(0, night ? "#e4e8f5" : "#f7f3ea"); bg.addColorStop(1, "#f2f5fa"); ctx.fillStyle = bg; ctx.fill();
      /* personne (buste) */
      var bx = Math.max(78, W * 0.22), skin = "#f1c9a5", skinD = "#c99068";
      B5.circ(c, bx, 46, 24, skin, skinD, 2);
      D.rrect(c, bx - 48, 74, 96, 150, 30); ctx.fillStyle = "#9fc1e6"; ctx.fill(); ctx.strokeStyle = "#5d86b5"; ctx.lineWidth = 2; ctx.stroke();
      D.rrect(c, bx - 70, 80, 22, 110, 11); ctx.fillStyle = "#9fc1e6"; ctx.fill(); ctx.stroke();
      D.rrect(c, bx + 48, 80, 22, 110, 11); ctx.fillStyle = "#9fc1e6"; ctx.fill(); ctx.stroke();
      /* capteur de glucose sur le bras */
      B5.circ(c, bx - 59, 104, 8, "#fff", "#5f6b7a", 2); B5.circ(c, bx - 59, 104, 3, pal.teal);
      for (i = 1; i <= 3; i++){ var wr = ((an * 1.2 + i / 3) % 1) * 18; ctx.globalAlpha = 1 - wr / 18; ctx.strokeStyle = pal.teal; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx - 59, 104, 8 + wr, -0.9, 0.9); ctx.stroke(); ctx.globalAlpha = 1; }
      D.text(c, "capteur", bx - 59, 126, {size: 9.5, color: "#2c3a4e", weight: 800});
      /* pompe à la ceinture + cathéter */
      var pX = bx + 10, pY = 196;
      ctx.strokeStyle = "#7d8ea3"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pX + 30, pY - 6); ctx.bezierCurveTo(pX + 46, pY - 50, bx + 10, 150, bx - 10, 158); ctx.stroke();
      B5.circ(c, bx - 12, 158, 5, "#fff", "#5f6b7a", 1.6);
      var nd = Math.max(1, Math.round(B5.cl(rate / 6, 0, 1) * 8));
      for (i = 0; i < nd; i++){ var f = (P[i].o + an * (0.3 + rate * 0.12)) % 1, tt = f, u = 1 - tt;
        var qx = u * u * u * (pX + 30) + 3 * u * u * tt * (pX + 46) + 3 * u * tt * tt * (bx + 10) + tt * tt * tt * (bx - 10), qy = u * u * u * (pY - 6) + 3 * u * u * tt * (pY - 50) + 3 * u * tt * tt * 150 + tt * tt * tt * 158;
        B5.circ(c, qx, qy, 2.6, pal.violet); }
      D.rrect(c, pX, pY - 8, 56, 40, 8); ctx.fillStyle = "#3a4656"; ctx.fill();
      D.rrect(c, pX + 5, pY - 3, 46, 20, 4); ctx.fillStyle = bo > 0.05 ? "#ece4ff" : "#e8f3ec"; ctx.fill();
      D.text(c, S.fmt(rate, 1) + " U/h", pX + 28, pY + 7, {size: 10, color: "#13233a", weight: 800, mono: true});
      D.text(c, bo > 0.05 ? "bolus" : "basal", pX + 28, pY + 25, {size: 9, color: "#fff", weight: 800});
      D.text(c, "pompe", pX + 28, pY + 44, {size: 10, color: "#2c3a4e", weight: 800});
      /* horloge 24 h */
      var cr = Math.min(52, (W - bx - 90) / 2 - 8), cx = W - cr - 22, cy = 66;
      B5.circ(c, cx, cy, cr, "#fff", "#8a95a3", 2);
      for (i = 0; i < 24; i++){ var aa = i / 24 * 2 * Math.PI - Math.PI / 2; D.line(c, cx + Math.cos(aa) * (cr - (i % 6 ? 4 : 8)), cy + Math.sin(aa) * (cr - (i % 6 ? 4 : 8)), cx + Math.cos(aa) * cr, cy + Math.sin(aa) * cr, "#8a95a3", i % 6 ? 1 : 2); }
      [[0, "0 h"], [6, "6"], [12, "12"], [18, "18"]].forEach(function(q){ var aa = q[0] / 24 * 2 * Math.PI - Math.PI / 2; D.text(c, q[1], cx + Math.cos(aa) * (cr - 16), cy + Math.sin(aa) * (cr - 16), {size: 9.5, color: pal.grey}); });
      m.meals.forEach(function(q, j){ var aa = q[0] / 1440 * 2 * Math.PI - Math.PI / 2, mx0 = cx + Math.cos(aa) * (cr + 9), my0 = cy + Math.sin(aa) * (cr + 9), on = tm >= q[0] && tm < q[0] + 40; B5.circ(c, mx0, my0, on ? 8 : 6, on ? pal.amber : "#fbe3c4", "#b2620f", 1.5); });
      var ah = tm / 1440 * 2 * Math.PI - Math.PI / 2; D.line(c, cx, cy, cx + Math.cos(ah) * (cr - 10), cy + Math.sin(ah) * (cr - 10), pal.ink, 3); B5.circ(c, cx, cy, 3.5, pal.ink);
      var hh = Math.floor(tm / 60), mm = Math.floor(tm % 60);
      D.text(c, hh + " h " + (mm < 10 ? "0" : "") + mm, cx, cy + cr + 22, {size: 12, color: pal.ink, weight: 800});
      /* lecteur de glycémie */
      var zc = g < 0.7 ? "#b2620f" : g > 1.8 ? "#a31d0e" : "#13233a";
      D.display(c, g.toFixed(2).replace(".", ",") + (trend > 0.05 ? " ↑" : trend < -0.05 ? " ↓" : " →"), cx, 186, {w: Math.min(128, 2 * cr + 20), h: 46, size: 16, caption: "glycémie (g/L)", color: zc, screen: g < 0.7 ? "#fde7cf" : g > 1.8 ? "#fbe0db" : "#e8f3ec"});
      var cur = null; m.meals.forEach(function(q, j){ if (tm >= q[0] - adv.value - 5 && tm < q[0] + 60) cur = ["petit-déjeuner", "déjeuner", "dîner"][j] + " : " + q[1] + " g"; });
      if (cur) D.label(c, cur, cx, 226, {color: pal.amber, size: 10.5});
      else if (g < 0.7) D.label(c, "hypoglycémie !", cx, 226, {color: "#b2620f", size: 10.5});
      /* ---------- courbe 24 h ---------- */
      var gy = sh + 14; geo.gy = gy - 4; D.panel(c, 6, gy - 2, W - 12, H - gy - 2, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 24, y0: 0, y1: 3.5, xl: "heure · glisse pour te déplacer", stepX: 4, stepY: 0.5, t: gy + 24, b: 58, l: 42, r: 16}); geo.ax = ax;
      D.text(c, "glycémie (g/L)", 14, gy + 12, {size: 11, color: pal.grey, align: "left"});
      ctx.fillStyle = "rgba(36,119,90,.10)"; ctx.fillRect(ax.L, ax.Y(1.8), ax.R - ax.L, ax.Y(0.7) - ax.Y(1.8));
      ctx.fillStyle = "rgba(36,119,90,.10)"; ctx.fillRect(ax.L, ax.Y(1.4), ax.R - ax.L, ax.Y(0.7) - ax.Y(1.4));
      ctx.fillStyle = "rgba(194,106,12,.12)"; ctx.fillRect(ax.L, ax.Y(0.7), ax.R - ax.L, ax.B - ax.Y(0.7));
      D.text(c, "cible 0,7–1,8", ax.R - 6, ax.Y(1.62), {align: "right", size: 10.5, color: pal.green});
      D.text(c, "hypo", ax.R - 6, ax.Y(0.35), {align: "right", size: 10.5, color: "#b2620f"});
      m.meals.forEach(function(q, j){ D.line(c, ax.X(q[0] / 60), ax.T, ax.X(q[0] / 60), ax.B, pal.amber, 1.2, [4, 4]); });
      B5.poly(c, ax, m.G.map(function(v, t){ return [t / 60, v]; }), pal.violet, 2.8);
      /* insuline délivrée sous l'axe */
      var by0 = H - 14, bh = 12;
      for (var t2 = 0; t2 < 1440; t2 += 10){ var v = basal.value / 2 + m.B[t2] / m.BM; ctx.fillStyle = m.B[t2] > 0.05 ? pal.violet : "rgba(98,54,196,.35)"; var hb = Math.min(bh, 2 + v * bh); ctx.fillRect(ax.X(t2 / 60), by0 - hb, Math.max(1, ax.X(10 / 60) - ax.X(0) - 0.6), hb); }
      D.text(c, "insuline", ax.L - 4, by0 - 6, {align: "right", size: 9.5, color: pal.violet});
      D.line(c, ax.X(tm / 60), ax.T, ax.X(tm / 60), by0, pal.ink, 1.2, [4, 3]); D.dot(c, ax.X(tm / 60), ax.Y(Math.min(3.5, g)), 5, pal.violet);
      var pc = 100 * m.inr / 1440, pt = 100 * m.tight / 1440;
      ro.set(0, S.fmt(pc, 0) + " % (0,7–1,4 : " + S.fmt(pt, 0) + " %)"); ro.set(1, S.fmt(m.mn, 2) + " / " + S.fmt(m.mx, 2) + " g/L"); ro.set(2, S.fmt(m.hypo / 60, 1) + " h"); ro.set(3, S.fmt(m.hyper / 60, 1) + " h");
      if (m.hypo > 0) nt.set("Hypoglycémie : " + S.fmt(m.hypo / 60, 1) + " h sous 0,7 g/L (minimum " + S.fmt(m.mn, 2) + "). Dose trop forte : réduis le bolus (plus de grammes par unité) ou le débit de base.", "warn");
      else if (pt >= 99.95) nt.set("Défi expert réussi : toute la journée entre 0,7 et 1,4 g/L, sans hypoglycémie. Le bolus pris en avance compense le délai d'action de l'insuline injectée sous la peau.", "ok");
      else if (pc >= 90) nt.set("Défi 1 réussi : " + S.fmt(pc, 0) + " % du temps dans la cible, sans hypoglycémie. Défi expert : 100 % entre 0,7 et 1,4 g/L (pense à l'avance du bolus).", "ok");
      else nt.set("Seulement " + S.fmt(pc, 0) + " % dans la cible : encore " + S.fmt(m.hyper / 60, 1) + " h au-dessus de 1,8 g/L. Augmente le bolus (moins de grammes par unité), le débit de base, ou prends le bolus plus tôt.", "warn");
    });
  }
});
})();
