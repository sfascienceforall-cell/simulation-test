/* Chapitre 5 · Défenses de l'organisme et immunité */
(function(){
var LN2 = Math.LN2;

/* ---------- infection : courbes de charge et d'anticorps (modèle phénoménologique en log10) ---------- */
function infection(o){
  var g = o.r * (1 - o.eps), ta = Math.max(5, 11 - o.lp0), lp = o.lp0, dt = 0.05, T = 40, load = [], ab = [], an = 0, cleared = -1, i;
  for (var t = 0; t <= T + 1e-9; t += dt){
    an = o.ad ? 1 / (1 + Math.exp(-(t - ta) / 1.2)) : 0;
    load.push([t, lp]);
    var d = g * (1 - lp / 9) - 1.2 * an;
    if (lp > 0) lp = Math.min(9, lp + d * dt);
    if (lp <= 0){ lp = 0; if (cleared < 0 && t > 1) cleared = t; }
  }
  for (i = 0; i < load.length; i++){
    var tt = load[i][0], a = o.ad ? 3 / (1 + Math.exp(-(tt - ta - 2) / 2.5)) : 0;
    if (cleared >= 0 && tt > cleared + 7) a *= Math.exp(-(tt - cleared - 7) * LN2 / 25);
    ab.push([tt, a]);
  }
  return {load: load, ab: ab, ta: ta, cleared: cleared};
}
SFA.sim({
  id: "b5-c05-infection", ch: "c05", tag: "Classique",
  titre: "Une infection : innée d'abord, adaptative ensuite",
  resume: "Dose, vitesse de multiplication, efficacité innée → charge en pathogènes et anticorps.",
  but: "Regarde l'infection se dérouler dans le tissu (lecture automatique, ou glisse le repère de temps sur le graphique). Règle la dose de départ, la vitesse de multiplication du pathogène et l'efficacité de la défense innée. Observe quand l'immunité adaptative démarre, jusqu'où monte le pathogène, et ce qui se passe sans immunité adaptative (immunodéficience).",
  aRetenir: "La réponse innée (barrières, phagocytes, inflammation) est immédiate mais non spécifique : elle ralentit le pathogène sans l'éliminer. La réponse adaptative est lente (≈ 1 semaine) car il faut sélectionner et multiplier les lymphocytes B et T spécifiques de l'antigène ; elle élimine le pathogène et laisse des cellules mémoire.",
  piege: "Les antibiotiques n'agissent pas sur les virus. Et la fièvre n'est pas « la maladie » : c'est une réponse de défense. Modèle simplifié : charge en log10 (unités arbitraires).",
  build: function(k, S){
    var c = k.canvas(520), pal = S.draw.palette, D = S.draw;
    var lp = k.slider("Dose de départ (log10)", 1, 6, 0.5, 3, "");
    var r = k.slider("Vitesse de multiplication du pathogène (log10 par jour)", 0.3, 1.2, 0.1, 0.8, "");
    var eps = k.slider("Efficacité de la défense innée", 0, 80, 10, 40, "%");
    var ad = k.toggle("Immunité adaptative fonctionnelle", true);
    var ro = k.readouts(["Pic de charge (log10)", "Début adaptative", "Élimination", "Jours symptomatiques"]);
    var nt = k.note("", "");
    var tm = 0, play = true, geo = {}, drag = false, rnd = B5.rng(3), PP = [], PH = [], AB = [], i;
    for (i = 0; i < 80; i++) PP.push({x: rnd(), y: rnd(), ph: rnd() * 6.3, s: .5 + rnd()});
    for (i = 0; i < 9; i++) PH.push({x: rnd(), y: rnd(), ph: rnd() * 6.3});
    for (i = 0; i < 80; i++) AB.push({a: rnd() * 6.3, ph: rnd() * 6.3});
    var lpp = k.loop(function(dt){ if (play){ tm += dt * 2.6; if (tm > 44) tm = 0; } k.redraw(); }); lpp.play();
    k.button("Lecture / pause", function(){ play = !play; }, true);
    k.button("Revenir au jour 0", function(){ tm = 0; });
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") drag = p.y > geo.gy; if (drag && (t === "down" || t === "drag") && geo.ax){ tm = Math.max(0, Math.min(40, geo.ax.ix(p.x))); play = false; k.redraw(); } if (t === "up") drag = false; });
    function Y(ctx, x, y, s, col, a){ ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s); ctx.lineTo(-s * .55, -s * 1.6); ctx.moveTo(0, -s); ctx.lineTo(s * .55, -s * 1.6); ctx.stroke(); ctx.restore(); }
    k.draw(function(){
      var m = infection({lp0: lp.value, r: r.value, eps: eps.value / 100, ad: ad.value});
      var pk = 0, sym = 0;
      m.load.forEach(function(p){ if (p[1] > pk) pk = p[1]; if (p[1] >= 4) sym += 0.05; });
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 238;
      var ii = Math.min(m.load.length - 1, Math.round(Math.min(tm, 40) / (40 / (m.load.length - 1)))), ld = m.load[ii][1], abv = m.ab[Math.min(m.ab.length - 1, ii)][1];
      /* ---------- tissu ---------- */
      D.rrect(c, 8, 8, W - 16, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#fdeef0"); bg.addColorStop(1, "#f9dfe2"); ctx.fillStyle = bg; ctx.fill();
      ctx.save(); D.rrect(c, 8, 8, W - 16, sh, 12); ctx.clip();
      /* cellules du tissu */
      for (i = 0; i < 28; i++){ var cx = 8 + ((i * 97) % 100) / 100 * (W - 16), cy = 40 + ((i * 53) % 100) / 100 * (sh - 74); B5.circ(c, cx, cy, 15 + (i % 4) * 3, "rgba(255,255,255,.35)", "rgba(190,120,130,.35)", 1); }
      /* vaisseau sanguin */
      ctx.fillStyle = "#f2a7a0"; ctx.fillRect(8, sh - 22, W - 16, 30); D.text(c, "vaisseau sanguin", 22, sh - 2, {size: 10.5, color: "#8a2a1a", weight: 800, align: "left"});
      for (i = 0; i < 12; i++){ var rx = 8 + ((i * 61 + tm * 22) % (W - 16)); ctx.fillStyle = "#c0321d"; ctx.beginPath(); ctx.ellipse(rx, sh - 8 + (i % 3) * 2, 6, 3.5, 0, 0, 7); ctx.fill(); }
      var nP = Math.min(80, Math.round(ld * 9)), nPh = ld > 0.8 ? Math.round(1 + eps.value / 100 * 8) : 0, nAb = ad.value && abv > 0.05 ? Math.min(80, Math.round(abv * 26)) : 0;
      var t = tm;
      /* phagocytes */
      for (i = 0; i < nPh && i < 9; i++){ var q = PH[i], px = 8 + 30 + (q.x * (W - 76)) + Math.sin(t * .6 + q.ph) * 16, py = 50 + q.y * (sh - 110) + Math.cos(t * .5 + q.ph) * 12;
        ctx.fillStyle = "rgba(110,140,200,.75)"; ctx.strokeStyle = "#3f5fa8"; ctx.lineWidth = 2; ctx.beginPath(); for (var a = 0; a < 7; a++){ var an = a / 7 * 6.28, rr = 16 + (a % 2 ? 6 : 0) + Math.sin(t * 2 + a + q.ph) * 2; ctx.lineTo(px + Math.cos(an) * rr, py + Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke();
        B5.circ(c, px, py, 5.5, "#2f4f98"); B5.circ(c, px + 7, py - 5, 3, "#c0321d"); }
      /* pathogènes */
      for (i = 0; i < nP; i++){ var p = PP[i], x = 8 + 14 + p.x * (W - 44) + Math.sin(t * 1.5 + p.ph) * 4, y = 34 + p.y * (sh - 84) + Math.cos(t * 1.3 + p.ph) * 4;
        B5.circ(c, x, y, 4 * p.s + 1.5, "#4a8a1c", "#2a5a0c", 1.2);
        if (i < nAb){ var ax2 = AB[i]; Y(ctx, x + Math.cos(ax2.a) * 7, y + Math.sin(ax2.a) * 7, 5, pal.violet, ax2.a + 1.57); } }
      /* anticorps libres */
      if (nAb > 14){ for (i = 0; i < Math.min(24, nAb - 14); i++){ var b = AB[i]; Y(ctx, 40 + ((i * 83 + b.ph * 40) % (W - 80)), sh - 40 + Math.sin(t + b.ph) * 6, 5, pal.violet, b.a); } }
      ctx.restore();
      D.legend(c, [["#4a8a1c", "pathogène"], ["#3f5fa8", "phagocyte (inné)"], [pal.violet, "anticorps (adaptatif)"]], W - 16, 14, {align: "right"});
      D.display(c, "J" + S.fmt(Math.min(tm, 40), 0), 56, 38, {w: 76, h: 40, size: 18, caption: ld >= 4 ? "symptômes" : "jour"});
      /* ---------- courbes ---------- */
      var gy = sh + 22; geo.gy = gy - 6;
      D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 40, y0: 0, y1: 9, xl: "jours  ·  glisse le repère", stepX: 5, stepY: 3, t: gy + 12, b: 36, l: 40, r: 38});
      geo.ax = ax; D.text(c, "pathogènes (log10)", 14, gy + 4, {size: 11, color: pal.red, align: "left"}); D.text(c, "anticorps", W - 14, gy + 4, {size: 11, color: pal.violet, align: "right"});
      ctx.fillStyle = "rgba(192,50,29,.08)"; ctx.fillRect(ax.X(0), ax.Y(9), ax.X(40) - ax.X(0), ax.Y(4) - ax.Y(9));
      D.text(c, "symptômes (≥ 4)", ax.L + 8, ax.Y(8.2), {align: "left", size: 11, color: pal.red});
      for (var q2 = 0; q2 <= 3; q2++) D.text(c, q2, ax.R + 12, ax.Y(q2 * 3), {size: 10.5, color: pal.violet, weight: 800});
      if (ad.value){ D.line(c, ax.X(m.ta), ax.T, ax.X(m.ta), ax.B, pal.green, 1.5, [5, 4]); D.label(c, "adaptative", ax.X(m.ta) + 4, ax.B - 12, {align: "left", size: 10.5, color: pal.green}); }
      B5.poly(c, ax, m.ab.map(function(p){ return [p[0], p[1] * 3]; }), pal.violet, 2.6);
      B5.poly(c, ax, m.load, pal.red, 3);
      D.line(c, ax.X(Math.min(tm, 40)), ax.T, ax.X(Math.min(tm, 40)), ax.B, pal.ink, 1.3, [4, 3]); D.dot(c, ax.X(Math.min(tm, 40)), ax.Y(ld), 5.5, pal.red);
      ro.set(0, S.fmt(pk, 1)); ro.set(1, ad.value ? "jour " + S.fmt(m.ta, 0) : "jamais"); ro.set(2, m.cleared >= 0 ? "jour " + S.fmt(m.cleared, 0) : "pas éliminé");
      ro.set(3, S.fmt(sym, 0) + " j");
      var last = m.load[m.load.length - 1][1];
      if (!ad.value) nt.set("Sans immunité adaptative, la défense innée seule ne suffit pas : le pathogène atteint " + S.fmt(last, 1) + " (log10) à 40 jours et ne régresse pas. C'est l'immunodéficience (VIH : voir la dernière simulation du chapitre).", "warn");
      else if (pk >= 7) nt.set("Pic très élevé : l'infection est grave. Une dose forte ou une multiplication rapide laissent peu de temps à l'immunité adaptative.", "warn");
      else if (sym > 0) nt.set("Symptômes pendant " + S.fmt(sym, 0) + " jours : le pathogène dépasse le seuil avant que les anticorps (apparus le jour " + S.fmt(m.ta, 0) + ") ne le maîtrisent.", "warn");
      else nt.set("La défense innée suffit à tenir la charge sous le seuil de symptômes jusqu'à l'arrivée des anticorps.", "ok");
    });
  }
});

/* ---------- vaccin ou sérum ---------- */
function titre(t, dose2, mode, serumHL){       /* log10 du titre d'anticorps spécifique (0 = non détectable) */
  if (mode === "s"){ return t < 0 ? 0 : Math.max(0, 2.0 - t * Math.log10(2) / serumHL); }
  var L1 = 0.5, L2 = 1.3, v = 0;
  function dose(t0, peak, lag, rise, floor){
    var s = t - t0; if (s < 0) return 0;
    if (s < lag) return 0; if (s < lag + rise) return peak * (s - lag) / rise;
    return floor + (peak - floor) * Math.pow(2, -(s - lag - rise) / 25);
  }
  v = dose(0, 2.0, 5, 10, L1);
  if (t >= dose2) v = Math.max(dose(dose2, 3.5, 2, 5, L2), t < dose2 + 7 ? v : 0);
  return v;
}
SFA.sim({
  id: "b5-c05-vaccin", ch: "c05", tag: "Comparaison",
  titre: "Vaccin ou sérum : deux protections différentes",
  resume: "Deux personnes au fil de l'année : anticorps fabriqués et cellules mémoire (vaccin) ou anticorps prêtés (sérum).",
  but: "Compare deux personnes : l'une reçoit un vaccin (2e dose au jour choisi), l'autre un sérum (anticorps tout faits) au jour 0. Regarde leurs anticorps et leurs cellules mémoire au fil des jours, et glisse la ligne rouge du contact avec le pathogène. Défi : trouve le premier jour où le vaccin protège, puis le dernier jour où le sérum protège encore.",
  aRetenir: "Vaccin : protection retardée (une dizaine de jours) mais durable, grâce aux cellules mémoire : le 2e contact déclenche une réponse secondaire plus rapide (2 jours) et plus forte. Sérum : protection immédiate mais brève (les anticorps injectés disparaissent en quelques semaines ou mois), sans mémoire. Le sérum soigne, le vaccin prévient.",
  piege: "Confondre vaccin et sérum est l'erreur classique. Autre piège : croire qu'un taux d'anticorps bas signifie « pas protégé » : les cellules mémoire peuvent produire une réponse secondaire rapide. Modèle qualitatif, valeurs indicatives.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var d2 = k.slider("2e dose de vaccin (jour)", 14, 180, 7, 28, "j");
    var te = k.slider("Contact avec le pathogène (jour)", 1, 365, 1, 100, "j");
    var hl = k.slider("Demi-vie des anticorps du sérum", 7, 28, 7, 21, "j");
    var ro = k.readouts(["Protection vaccin (titre ≥ 10)", "Protection sérum", "Au contact : vaccin", "Au contact : sérum"]);
    var nt = k.note("", "");
    var day = 0, an = 0, play = true, geo = {}, drag = 0, rnd = B5.rng(19), Q = [], i, found = {v: false, s: false};
    for (i = 0; i < 40; i++) Q.push({x: rnd(), y: rnd(), a: rnd() * 6.28});
    k.button("Lecture / pause de l'année", function(){ play = !play; if (play && day >= 365) day = 0; }, true);
    var lp = k.loop(function(dt){ an += dt; if (play){ day += dt * 36; if (day >= 365){ day = 365; play = false; } } k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down"){ drag = 0; if (geo.ax && p.y > geo.gy) drag = Math.abs(p.x - geo.ax.X(te.value)) < 16 ? 2 : 1; }
      if (drag === 2 && (t === "down" || t === "drag")) te.set(B5.cl(Math.round(geo.ax.ix(p.x)), 1, 365));
      if (drag === 1 && (t === "down" || t === "drag")){ day = B5.cl(geo.ax.ix(p.x), 0, 365); play = false; }
      if (t === "up") drag = 0;
    });
    function Y(ctx, x, y, s, col, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, s); ctx.lineTo(0, 0); ctx.lineTo(-s * 0.7, -s * 0.8); ctx.moveTo(0, 0); ctx.lineTo(s * 0.7, -s * 0.8); ctx.stroke(); ctx.restore(); }
    function germ(ctx, x, y, r, col){ for (var j = 0; j < 8; j++){ var a = j / 8 * 6.283; D.line(c, x, y, x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3), col, 1.2); } B5.circ(c, x, y, r, "#a8d88f", col, 1.4); }
    k.draw(function(){
      var tv = titre(day, d2.value, "v"), ts = titre(day, d2.value, "s", hl.value), T = te.value, ctx = c.ctx, W = c.W, H = c.H, sh = 236;
      var vacStart = null, serLast = 0, vacDays = 0, serDays = 0, t;
      for (t = 0; t <= 365; t++){ var a = titre(t, d2.value, "v"), b = titre(t, d2.value, "s", hl.value); if (a >= 1){ vacDays++; if (vacStart === null) vacStart = t; } if (b >= 1){ serDays++; serLast = t; } }
      var tvC = titre(T, d2.value, "v"), tsC = titre(T, d2.value, "s", hl.value), memC = T >= 10 ? (T >= d2.value + 5 ? 2 : 1) : 0;
      c.clear();
      D.rrect(c, 6, 6, W - 12, sh, 12); ctx.fillStyle = "#f3f5fa"; ctx.fill();
      var pw = (W - 30) / 2;
      [["v", "vacciné", pal.violet, tv], ["s", "sérum (injecté à J0)", pal.amber, ts]].forEach(function(P, j){
        var x0 = 12 + j * (pw + 6), y0 = 14, cx = x0 + pw / 2;
        D.text(c, P[1], cx, y0 + 8, {size: 11, color: P[2], weight: 900});
        D.rrect(c, x0 + 6, y0 + 22, pw - 12, 150, 16); var g = ctx.createLinearGradient(0, y0 + 22, 0, y0 + 172); g.addColorStop(0, "#fde7e3"); g.addColorStop(1, "#f6cdc6"); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#d9776b"; ctx.lineWidth = 1.5; ctx.stroke();
        var nY = Math.round(Math.max(0, P[3]) / 4 * 28), bx0 = x0 + 16, bw = pw - 32;
        for (i = 0; i < nY; i++){ var q = Q[i]; Y(ctx, bx0 + q.x * bw, y0 + 36 + q.y * 120 + Math.sin(an + i) * 2, 5, P[2], q.a + an * 0.3); }
        if (P[0] === "v"){
          var mem = day >= 10 ? (day >= d2.value + 5 ? 5 : 2) : 0, plas = (day >= 5 && day < 15) || (day >= d2.value + 2 && day < d2.value + 7);
          for (i = 0; i < mem; i++){ var mx = x0 + 22 + i * 18, my = y0 + 156; B5.circ(c, mx, my, 7, "#b9cdf2", "#3d63b8", 1.5); D.text(c, "M", mx, my + 0.5, {size: 8.5, color: "#1f3f8f", weight: 900}); }
          if (plas){ var px = x0 + pw - 30, py = y0 + 150; B5.circ(c, px, py, 11, "#d9c8f5", pal.violet, 1.6); B5.circ(c, px + 3, py, 4, pal.violet); for (i = 0; i < 3; i++){ var f = (an * 0.8 + i / 3) % 1; Y(ctx, px - 12 - f * 30, py - f * 40, 4, pal.violet, f * 4); } D.text(c, "plasmocyte", px - 4, py + 18, {size: 8.5, color: pal.violet, weight: 800}); }
          if (mem) D.text(c, "cellules mémoire", x0 + 16, y0 + 140, {size: 8.5, color: "#1f3f8f", weight: 800, align: "left"});
        }
        /* contact avec le pathogène */
        if (Math.abs(day - T) < 14 && day >= T - 2){
          var prot = (P[0] === "v" ? tvC : tsC) >= 1, memo = P[0] === "v" && !prot && memC > 0, s0 = day - T, ng = prot ? Math.max(0, 6 - Math.round(s0 * 1.5)) : memo ? (s0 < 3 ? 4 + Math.round(s0 * 2) : Math.max(0, 10 - Math.round((s0 - 3) * 2))) : Math.min(14, 4 + Math.round(Math.max(0, s0) * 1.4));
          for (i = 0; i < ng; i++){ var gq = Q[i + 20], gx = bx0 + 6 + gq.x * (bw - 12), gyy = y0 + 46 + gq.y * 90; germ(ctx, gx, gyy, 5, "#3f7f2e"); if (prot || (memo && s0 >= 2)){ Y(ctx, gx - 8, gyy - 6, 4, P[2], -0.8); Y(ctx, gx + 8, gyy + 4, 4, P[2], 2.2); } }
          D.label(c, prot ? "pathogène neutralisé" : memo ? (s0 < 2 ? "mémoire : réponse en 2 j" : "réponse secondaire") : "le pathogène se multiplie", cx, y0 + 186, {size: 9.5, color: prot || memo ? pal.green : pal.red});
        }
        D.display(c, P[3] >= 1 ? "≥ 10" : P[3] > 0.05 ? "< 10" : "0", cx, y0 + 206, {w: 74, h: 30, size: 12, caption: "titre", color: P[3] >= 1 ? pal.green : "#a31d0e"});
      });
      D.label(c, "jour " + Math.floor(day), W / 2, sh - 4, {size: 10, color: pal.ink});
      /* ---------- courbe ---------- */
      var gy = sh + 14; geo.gy = gy - 4; D.panel(c, 6, gy - 2, W - 12, H - gy - 2, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 365, y0: 0, y1: 4, xl: "jours · glisse (temps ou contact)", stepX: 60, stepY: 1, t: gy + 24, b: 34, l: 40, r: 16}); geo.ax = ax;
      D.text(c, "titre d'anticorps (log10)", 14, gy + 12, {size: 11, color: pal.grey, align: "left"});
      ctx.fillStyle = "rgba(36,119,90,.07)"; ctx.fillRect(ax.L, ax.T, ax.R - ax.L, ax.Y(1) - ax.T);
      D.line(c, ax.L, ax.Y(1), ax.R, ax.Y(1), pal.red, 1.4, [6, 4]); D.text(c, "seuil de protection (10)", ax.X(150), ax.Y(1) + 10, {align: "left", size: 10, color: pal.red});
      var pv = [], ps = [];
      for (t = 0; t <= 365; t++){ pv.push([t, titre(t, d2.value, "v")]); ps.push([t, titre(t, d2.value, "s", hl.value)]); }
      B5.poly(c, ax, ps, "rgba(194,106,12,.3)", 2); B5.poly(c, ax, pv, "rgba(98,54,196,.3)", 2);
      B5.poly(c, ax, ps.slice(0, Math.floor(day) + 1), pal.amber, 3); B5.poly(c, ax, pv.slice(0, Math.floor(day) + 1), pal.violet, 3);
      D.legend(c, [[pal.violet, "vaccin"], [pal.amber, "sérum"]], ax.R - 2, ax.Y(3.9), {align: "right"});
      [[0, "dose 1"], [d2.value, "dose 2"]].forEach(function(q){ var X = ax.X(q[0]); ctx.fillStyle = pal.violet; ctx.beginPath(); ctx.moveTo(X, ax.B + 2); ctx.lineTo(X - 5, ax.B + 11); ctx.lineTo(X + 5, ax.B + 11); ctx.closePath(); ctx.fill(); });
      D.line(c, ax.X(day), ax.T, ax.X(day), ax.B, pal.ink, 1.1, [4, 3]);
      D.line(c, ax.X(T), ax.T, ax.X(T), ax.B, pal.red, 2.2, [5, 4]);
      D.label(c, "contact J" + T + " ↔", B5.cl(ax.X(T), ax.L + 40, ax.R - 40), ax.T + 8, {size: 10, color: pal.red});
      var rv = tvC >= 1 ? "protégé (anticorps présents)" : (memC >= 1 && T > 15 ? "réponse secondaire rapide (mémoire)" : "non protégé"), rs = tsC >= 1 ? "protégé (anticorps injectés)" : "non protégé";
      ro.set(0, vacStart === null ? "jamais" : "dès le jour " + vacStart + ", " + vacDays + " j sur 365"); ro.set(1, "dès le jour 0, " + serDays + " j sur 365"); ro.set(2, rv); ro.set(3, rs);
      if (T === vacStart) found.v = true; if (T === serLast) found.s = true;
      if (found.v && found.s) nt.set("Défi réussi : le vaccin protège à partir du jour " + vacStart + " (le temps de fabriquer ses anticorps) et le sérum jusqu'au jour " + serLast + " (ses anticorps s'éliminent). Après, le vacciné garde ses cellules mémoire ; la personne du sérum, rien.", "ok");
      else if (T === vacStart) nt.set("Trouvé : premier jour de protection par le vaccin = jour " + vacStart + ". Cherche maintenant le dernier jour où le sérum protège.", "ok");
      else if (T === serLast) nt.set("Trouvé : dernier jour de protection par le sérum = jour " + serLast + ". Cherche maintenant le premier jour où le vaccin protège.", "ok");
      else nt.set("Au jour " + T + " : titre vaccin " + S.fmt(tvC, 1) + " (log10), titre sérum " + S.fmt(tsC, 1) + ". " + (tsC >= 1 && tvC < 1 ? "Le sérum protège seul à ce moment-là." : (tvC >= 1 && tsC < 1 ? "Seul le vaccin protège encore : le sérum s'est éliminé." : (tvC >= 1 ? "Les deux protègent." : "Ni l'un ni l'autre n'atteint le seuil, sauf mémoire éventuelle du vaccin."))), "");
    });
  }
});

/* ---------- immunité collective (SIR) ---------- */
function sir(R0, cov, ve, days){
  var gam = 0.2, bet = R0 * gam, s0 = 1 - cov * ve, S = s0 - 1e-4, I = 1e-4, R = 0, dt = 0.1, out = [], Im = 0, tm = 0;
  for (var t = 0; t <= days + 1e-9; t += dt){
    out.push([t, S, I, R]);
    if (I > Im){ Im = I; tm = t; }
    var nI = bet * S * I * dt, nR = gam * I * dt;
    S -= nI; I += nI - nR; R += nR;
  }
  return {out: out, Im: Im, tm: tm, s0: s0, fin: 1 - cov * ve - S};
}
SFA.sim({
  id: "b5-c05-collective", ch: "c05", tag: "Épidémie",
  titre: "Immunité collective : combien faut-il vacciner ?",
  resume: "R₀, couverture vaccinale, efficacité → courbe épidémique et nombre de personnes touchées.",
  but: "Une population de 400 personnes (chaque point). Choisis la contagiosité (R₀), la proportion de vaccinés et l'efficacité du vaccin. Déplace le jour ou lance l'animation : qui est protégé, infecté, guéri ? Trouve la couverture qui empêche l'épidémie.",
  aRetenir: "Une épidémie ne démarre que si chaque cas en infecte plus d'un autre : R₀ × (part de personnes sensibles) > 1. Il suffit donc que la proportion de personnes immunisées dépasse 1 − 1/R₀ pour protéger aussi les non-vaccinés (immunité collective). Pour une maladie très contagieuse (R₀ = 12–18, comme la rougeole), il faut environ 92–95 % de la population immunisée.",
  piege: "L'immunité collective protège ceux qui ne peuvent pas être vaccinés seulement si la couverture est suffisante. Et elle dépend de R₀ : le seuil n'est pas le même pour toutes les maladies. Modèle SIR simplifié (période infectieuse 5 jours, population homogène).",
  build: function(k, S){
    var c = k.canvas(190), g = k.canvas(250), pal = S.draw.palette;
    var R0 = k.slider("R₀ (nombre moyen de personnes infectées par un cas)", 1, 18, 0.5, 3, "");
    var cov = k.slider("Couverture vaccinale", 0, 100, 1, 40, "%");
    var ve = k.slider("Efficacité du vaccin", 50, 100, 5, 95, "%");
    var day = k.slider("Jour", 0, 200, 1, 40, "j");
    var ro = k.readouts(["Seuil d'immunité collective", "Part immunisée", "Pic d'infectés", "Total infectés"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ day.set(Math.min(200, day.value + dt * 25)); if (day.value >= 200) lp.pause(); k.redraw(); });
    k.button("Lecture / pause", function(){ if (lp.running) lp.pause(); else { if (day.value >= 200) day.set(0); lp.play(); } }, true);
    var order = null;
    k.draw(function(){
      var m = sir(R0.value, cov.value / 100, ve.value / 100, 200), pc = (1 - 1 / R0.value) / (ve.value / 100);
      var imm = cov.value / 100 * ve.value / 100;
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 200, y0: 0, y1: Math.max(10, Math.min(100, Math.ceil(m.Im * 100 / 10) * 10 + 10)), xl: "jours", yl: "% infectés", stepX: 40});
      B5.poly(c, ax, m.out.filter(function(p, i){ return i % 5 === 0; }).map(function(p){ return [p[0], p[2] * 100]; }), pal.red, 2.8);
      S.draw.line(c, ax.X(day.value), ax.T, ax.X(day.value), ax.B, pal.ink, 1.4, [5, 4]);
      /* grille des 400 personnes */
      g.clear();
      var N = 400, cols = 40, rows = 10, cw = (g.W - 20) / cols, ch = 14, idx = Math.min(m.out.length - 1, Math.round(day.value * 10)), row = m.out[idx];
      if (!order){ var rnd = B5.rng(7), a = []; for (var i = 0; i < N; i++) a.push(i); for (i = N - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)), tmp = a[i]; a[i] = a[j]; a[j] = tmp; } order = a; }
      var nImm = Math.round(imm * N), nI = Math.round(row[2] * N), nR = Math.round(row[3] * N + 0), pos = {}, q;
      for (q = 0; q < N; q++){
        var who = order[q], color;
        if (q < nImm) color = pal.green; else { var r2 = q - nImm; color = r2 < nR ? "#2f6fd6" : (r2 < nR + nI ? pal.red : "#c8ceda"); }
        var X = 10 + (who % cols) * cw + cw / 2, Y = 12 + Math.floor(who / cols) * (ch + 7);
        B5.circ(g, X, Y, Math.min(cw, ch) / 2 - 1, color);
      }
      B5.leg(g, [["immunisés (vaccin)", pal.green], ["sensibles", "#c8ceda"], ["infectés", pal.red], ["guéris", "#2f6fd6"]], 10, 236);
      ro.set(0, R0.value <= 1 ? "pas d'épidémie (R₀ ≤ 1)" : S.fmt(100 * (1 - 1 / R0.value), 0) + " % immunisés"); ro.set(1, S.fmt(imm * 100, 0) + " %"); ro.set(2, S.fmt(m.Im * 100, 1) + " %"); ro.set(3, S.fmt(m.fin * 100, 1) + " %");
      var eff = R0.value * (1 - imm);
      if (eff <= 1) nt.set("R effectif = R₀ × (1 − part immunisée) = " + S.fmt(eff, 2) + " ≤ 1 : chaque cas infecte moins d'une personne, l'épidémie ne décolle pas : immunité collective atteinte.", "ok");
      else nt.set("R effectif = " + S.fmt(eff, 2) + " > 1 : l'épidémie démarre. Il faudrait " + S.fmt(100 * pc, 0) + " % de vaccinés (avec cette efficacité) pour la bloquer" + (pc > 1 ? " : impossible avec ce vaccin seul." : "."), "warn");
    });
  }
});

/* ---------- VIH ---------- */
SFA.sim({
  id: "b5-c05-vih", ch: "c05", tag: "Santé",
  titre: "VIH : les lymphocytes CD4 et le traitement",
  resume: "Le virus détruit les lymphocytes T CD4 ; le traitement bloque sa multiplication. Quand commencer ?",
  but: "Regarde une goutte de sang au fil des années : les virus infectent les lymphocytes T CD4, s'y multiplient et les détruisent. Choisis la charge virale de base, puis glisse le comprimé sur le graphique pour choisir l'année du début du traitement antirétroviral. Défi : trouve la dernière année où l'on peut commencer le traitement sans que les CD4 passent jamais sous 200 /µL.",
  aRetenir: "Le VIH infecte les lymphocytes T CD4 : leur nombre baisse lentement (en moyenne, sur des années) puis l'organisme n'est plus protégé : infections opportunistes (SIDA). Un traitement antirétroviral bloque la multiplication du virus : la charge virale devient indétectable, les CD4 remontent, et la personne ne transmet plus le virus.",
  piege: "Être séropositif n'est pas être au stade SIDA : c'est pendant des années sans symptômes. Et il n'existe pas de vaccin ni de guérison pour le VIH : le traitement est à vie. Valeurs moyennes d'un modèle simplifié ; l'évolution individuelle varie beaucoup. En pratique, on recommande aujourd'hui de traiter dès le diagnostic.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var vl = k.slider("Charge virale de base (log10 copies/mL)", 3, 5.5, 0.5, 5, "");
    var art = k.toggle("Traitement antirétroviral", true);
    var ts = k.slider("Début du traitement (année)", 1, 15, 1, 9, "");
    var ro = k.readouts(["CD4 à l'année observée", "Charge virale", "Stade", "Stade SIDA sans traitement"]);
    var nt = k.note("", "");
    var yr = 0, an = 0, play = true, geo = {}, drag = 0, rnd = B5.rng(31), C = [], V = [], i;
    for (i = 0; i < 26; i++){ var a = rnd() * 2 * Math.PI, rr = Math.sqrt(rnd()) * 0.78; C.push({x: Math.cos(a) * rr, y: Math.sin(a) * rr, s: rnd(), r: 0.85 + 0.3 * rnd()}); }
    for (i = 0; i < 40; i++) V.push({a: rnd() * 6.28, b: rnd() * 6.28, w1: 0.3 + rnd() * 0.5, w2: 0.3 + rnd() * 0.5, r: 0.2 + rnd() * 0.7});
    k.button("Lecture / pause (20 ans)", function(){ play = !play; if (play && yr >= 20) yr = 0; }, true);
    var lp = k.loop(function(dt){ an += dt; if (play){ yr += dt * 1.1; if (yr >= 20){ yr = 20; play = false; } } k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down"){ drag = 0; if (geo.ax && p.y > geo.gy){ drag = art.value && Math.abs(p.x - geo.ax.X(ts.value)) < 22 && p.y > geo.ax.B - 6 ? 2 : 1; } }
      if (drag === 2 && (t === "down" || t === "drag")) ts.set(B5.cl(Math.round(geo.ax.ix(p.x)), 1, 15));
      if (drag === 1 && (t === "down" || t === "drag")){ yr = B5.cl(geo.ax.ix(p.x), 0, 20); play = false; }
      if (t === "up") drag = 0;
    });
    function cd4(t){
      var rate = 40 * (vl.value - 2), base = Math.max(0, 1000 - rate * t);
      if (!art.value || t <= ts.value) return base;
      var c0 = Math.max(0, 1000 - rate * ts.value);
      return c0 < 900 ? 900 + (c0 - 900) * Math.exp(-0.2 * (t - ts.value)) : c0;
    }
    function vload(t){ if (!art.value || t <= ts.value) return vl.value; return 1.7 + (vl.value - 1.7) * Math.exp(-(t - ts.value) / 0.2); }
    k.draw(function(){
      var Cn = cd4(yr), Vn = vload(yr), onT = art.value && yr > ts.value, tsida = 20 / (vl.value - 2);
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 250;
      D.rrect(c, 6, 6, W - 12, sh, 12); ctx.fillStyle = "#f2f0f7"; ctx.fill();
      /* champ du microscope */
      var R = Math.min(112, (W - 150) / 2 - 4, sh / 2 - 14), cx = R + 18, cy = sh / 2 + 6;
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.clip();
      var g0 = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R); g0.addColorStop(0, "#fff3ee"); g0.addColorStop(1, "#f5d6cf"); ctx.fillStyle = g0; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      for (i = 0; i < 9; i++){ var rx = cx + Math.cos(i * 2.1 + an * 0.05) * R * (0.3 + (i % 3) * 0.25), ry = cy + Math.sin(i * 1.7 + an * 0.04) * R * (0.4 + (i % 2) * 0.3); ctx.fillStyle = "rgba(214,90,80,.22)"; ctx.beginPath(); ctx.ellipse(rx, ry, 12, 10, i, 0, 2 * Math.PI); ctx.fill(); }
      var alive = Math.round(Cn / 1000 * 24), vir = B5.cl((Vn - 1.7) / 3.8, 0, 1), inf = onT ? 0 : Math.round(alive * 0.25 * vir + (vir > 0.05 ? 1 : 0));
      for (i = 0; i < C.length; i++){
        var q = C[i], X = cx + q.x * R + Math.sin(an * 0.4 + i) * 2, Y = cy + q.y * R + Math.cos(an * 0.35 + i) * 2, rc = 9.5 * q.r;
        if (i < alive){
          var infd = i < inf;
          B5.circ(c, X, Y, rc, infd ? "#cdb7e8" : "#b9cdf2", infd ? "#7a4fb8" : "#3d63b8", 1.6); B5.circ(c, X + 1, Y - 1, rc * 0.55, infd ? "#8a62c6" : "#5b7fcf");
          if (infd){ for (var b = 0; b < 3; b++){ var ab = an * 0.8 + b * 2.1 + i, bd = rc + 2 + ((an * 0.6 + b / 3) % 1) * 6; B5.circ(c, X + Math.cos(ab) * bd, Y + Math.sin(ab) * bd, 2.4, "#c0321d"); } }
          else if (onT && i < 4){ D.text(c, "✕", X + rc * 0.9, Y - rc * 0.9, {size: 9, color: pal.green, weight: 900}); }
        } else if (i < alive + 3 && Cn < 950){ for (var f = 0; f < 4; f++) B5.circ(c, X + Math.cos(f * 1.6 + i) * 6, Y + Math.sin(f * 1.6 + i) * 5, 2.2, "rgba(120,130,160,.45)"); }
      }
      var nv = Math.round(vir * 36);
      for (i = 0; i < nv; i++){ var v = V[i], vx = cx + Math.cos(v.a + an * v.w1) * R * v.r, vy = cy + Math.sin(v.b + an * v.w2) * R * v.r * 0.9;
        for (var sp = 0; sp < 6; sp++){ var as = sp / 6 * 6.28; D.line(c, vx, vy, vx + Math.cos(as) * 4.6, vy + Math.sin(as) * 4.6, "#8a1d10", 1); } B5.circ(c, vx, vy, 3, "#e0503c", "#8a1d10", 1); }
      if (Cn < 200){ for (i = 0; i < 6; i++){ var ox = cx + Math.cos(i * 1.3 + an * 0.2) * R * 0.6, oy = cy + Math.sin(i * 2.2 + an * 0.17) * R * 0.55; ctx.save(); ctx.translate(ox, oy); ctx.rotate(i); D.rrect(c, -7, -3, 14, 6, 3); ctx.fillStyle = "#86c06e"; ctx.fill(); ctx.strokeStyle = "#3f7f2e"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); } }
      ctx.restore();
      if (Cn < 200) D.label(c, "infections opportunistes", cx, cy - R + 28, {size: 9.5, color: pal.red});
      ctx.strokeStyle = "#3a4656"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, 2 * Math.PI); ctx.stroke();
      D.label(c, "goutte de sang (schéma)", cx, cy + R - 10, {size: 9.5, color: pal.ink});
      /* panneau d'état */
      var px = cx + R + 16, pw = W - px - 14;
      D.text(c, "année " + S.fmt(yr, 1), px + pw / 2, 24, {size: 12.5, color: pal.ink, weight: 900});
      D.display(c, S.fmt(Math.round(Cn / 10) * 10, 0), px + pw / 2, 64, {w: Math.min(118, pw), h: 46, size: 17, caption: "CD4 / µL", color: Cn < 200 ? "#a31d0e" : "#13233a", screen: Cn < 200 ? "#fbe0db" : "#e8f3ec"});
      D.display(c, Vn < 1.75 ? "< 50" : B5.sci(Math.pow(10, Vn), 1), px + pw / 2, 120, {w: Math.min(118, pw), h: 46, size: 15, caption: "virus (copies/mL)", color: Vn < 1.75 ? pal.green : "#a31d0e"});
      var leg = [["#b9cdf2", "#3d63b8", "T CD4 sain"], ["#cdb7e8", "#7a4fb8", "CD4 infecté"], ["#e0503c", "#8a1d10", "VIH (virus)"]];
      leg.forEach(function(L, j){ B5.circ(c, px + 6, 162 + j * 17, 5, L[0], L[1], 1.4); D.text(c, L[2], px + 16, 162 + j * 17, {align: "left", size: 10, color: "#2c3a4e", weight: 700}); });
      if (onT){ ctx.save(); ctx.translate(px + 12, 222); D.rrect(c, -10, -5, 20, 10, 5); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = pal.green; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = "#9fd6bd"; ctx.fillRect(0, -4, 9, 8); ctx.restore(); D.text(c, "traitement", px + 28, 222, {align: "left", size: 10.5, color: pal.green, weight: 800}); }
      
      /* ---------- courbes ---------- */
      var gy = sh + 14; geo.gy = gy - 4; D.panel(c, 6, gy - 2, W - 12, H - gy - 2, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 20, y0: 0, y1: 1200, xl: "années · glisse (temps ou comprimé)", stepX: 4, stepY: 200, t: gy + 26, b: 52, l: 44, r: 34}); geo.ax = ax;
      D.text(c, "CD4 (/µL)", 14, gy + 12, {size: 11, color: pal.violet, align: "left"}); D.text(c, "virus (log10)", W - 14, gy + 12, {size: 11, color: pal.red, align: "right"});
      ctx.fillStyle = "rgba(180,35,24,.10)"; ctx.fillRect(ax.L, ax.Y(200), ax.R - ax.L, ax.Y(0) - ax.Y(200));
      D.text(c, "SIDA (< 200)", ax.R - 6, ax.Y(100), {align: "right", size: 10.5, color: pal.red});
      function Yv(v){ return ax.Y((v - 1) / 5 * 1200); }
      [1, 2, 3, 4, 5, 6].forEach(function(v){ D.text(c, v, ax.R + 12, Yv(v), {size: 10, color: pal.red, weight: 600}); });
      var a1 = [], b1 = [], a0 = [];
      for (var t = 0; t <= 20.001; t += 0.1){ a1.push([t, cd4(t)]); b1.push([ax.X(t), Yv(vload(t))]); a0.push([t, Math.max(0, 1000 - 40 * (vl.value - 2) * t)]); }
      if (art.value) B5.poly(c, ax, a0, "rgba(138,149,163,.8)", 1.5, [3, 4]);
      ctx.save(); ctx.strokeStyle = "rgba(192,50,29,.75)"; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath(); b1.forEach(function(p, j){ if (j) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
      B5.poly(c, ax, a1.filter(function(p){ return p[0] <= yr + 0.05; }), pal.violet, 3);
      B5.poly(c, ax, a1, "rgba(98,54,196,.22)", 2);
      D.line(c, ax.X(yr), ax.T, ax.X(yr), ax.B, pal.ink, 1.2, [4, 3]); D.dot(c, ax.X(yr), ax.Y(Cn), 5, pal.violet);
      if (art.value){ var pX = ax.X(ts.value), pY = ax.B + 26; D.line(c, pX, ax.T, pX, ax.B, pal.green, 1.4, [5, 4]); ctx.save(); ctx.translate(pX, pY); D.rrect(c, -14, -7, 28, 14, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = pal.green; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#9fd6bd"; ctx.fillRect(0, -5, 12, 10); ctx.restore(); }
      var stade = Cn < 200 ? "SIDA (< 200)" : Cn < 500 ? "immunodéficience modérée" : "CD4 ≥ 500";
      var mn = Math.min.apply(null, a1.map(function(p){ return p[1]; })), last = Math.min(15, Math.floor(tsida + 1e-9));
      ro.set(0, S.fmt(Cn, 0) + " /µL"); ro.set(1, Vn < 1.75 ? "indétectable (< 50 copies/mL)" : "10<sup>" + S.fmt(Vn, 1) + "</sup> copies/mL"); ro.set(2, stade); ro.set(3, tsida <= 20 ? "vers " + S.fmt(tsida, 1) + " ans" : "> 20 ans");
      if (!art.value) nt.set("Sans traitement : CD4 sous 200 /µL à partir de l'année " + S.fmt(tsida, 1) + " (en moyenne, dans ce modèle). Plus la charge virale de base est élevée, plus c'est rapide.", "warn");
      else if (mn >= 200 && ts.value === last && tsida <= 15.999) nt.set("Défi réussi : commencer l'année " + ts.value + " est la limite (CD4 au plus bas : " + S.fmt(mn, 0) + " /µL). Un an plus tard, les CD4 passeraient sous 200. Dans la réalité, on n'attend pas : on traite dès le diagnostic.", "ok");
      else if (mn >= 200) nt.set("Avec un traitement commencé l'année " + ts.value + ", les CD4 ne passent jamais sous 200 /µL (minimum " + S.fmt(mn, 0) + "). La charge virale devient indétectable en quelques mois. Défi : peux-tu attendre plus longtemps ?", "");
      else nt.set("Les CD4 sont passés sous 200 /µL avant le début du traitement (année " + ts.value + ") : infections opportunistes possibles. Le traitement les fait remonter, mais lentement. Glisse le comprimé plus tôt.", "warn");
    });
  }
});
})();

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b5-3d-anticorps*/
SFA.sim({
  id:"b5-3d-anticorps", ch:"c05", tag:"3D · immunité adaptative",
  titre:"Sélection clonale : un seul lymphocyte B reconnaît l'antigène",
  resume:"Parmi quatre lymphocytes B de spécificités différentes, celui qui reconnaît l'antigène se multiplie et fabrique des anticorps. Teste ensuite la 2e rencontre.",
  but:"Choisis l'antigène du pathogène et avance étape par étape (ou en lecture automatique). Glisse pour tourner la scène. Clique sur « 2e rencontre » à la fin pour comparer la rapidité et l'intensité de la réponse.",
  aRetenir:"Chaque lymphocyte B porte à sa surface des récepteurs d'une seule spécificité, complémentaires d'un seul antigène (clé et serrure). Quand l'antigène se fixe, seul ce lymphocyte est sélectionné et se multiplie (sélection clonale) ; ses descendants deviennent des plasmocytes (qui sécrètent des milliers d'anticorps identiques) et des lymphocytes mémoire. Les anticorps se fixent sur les pathogènes, les neutralisent, les agglutinent et facilitent leur destruction par les phagocytes. À la 2e rencontre, les cellules mémoire rendent la réponse plus rapide et plus forte : c'est le principe du vaccin.",
  piege:"Le pathogène ne « fait pas fabriquer » un anticorps sur mesure : les lymphocytes B de toutes les spécificités existent déjà avant la rencontre, l'antigène ne fait que sélectionner celui qui convient. Et un anticorps ne reconnaît qu'un antigène : l'anticorps contre la grippe ne protège pas contre la rougeole.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(380), cam = B.cam(0.3, 0.6, 8.5);
    var ag = k.seg("Antigène du pathogène", [[0,"A"],[1,"B"],[2,"C"],[3,"D"]], 0, function(){ restart(); });
    var spd = k.slider("Vitesse", 0.3, 2, 0.1, 1, "×");
    var auto = k.toggle("Lecture automatique", true);
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    k.button("Étape suivante", function(){ next(); }, true);
    k.button("2e rencontre (mémoire)", function(){ second(); });
    k.button("Recommencer", function(){ restart(); });
    var ro = k.readouts(["Lymphocytes B sélectionnés", "Plasmocytes", "Anticorps libres", "Pathogènes restants"]);
    var nt = k.note("", "");
    cam.auto = false;
    var COLS = ["#f97316", "#2563eb", "#16a34a", "#9333ea"], NAMES = ["A", "B", "C", "D"];
    var BC = [0, 1, 2, 3].map(function(i){ var a = i * 1.5708 + 0.785; return {x:1.7 * Math.cos(a), z:1.7 * Math.sin(a), i:i}; });
    var stage = 0, sp = 0, mem = false, clones = [], abs = [], pat = [], T = 0, nAb = 0;
    function rnd(){ return Math.random() * 2 - 1; }
    function restart(){ mem = false; reset(); }
    function reset(){ stage = 0; sp = 0; clones = []; abs = []; nAb = 0; pat = []; for (var i = 0; i < 6; i++){ var a = i * 1.047; pat.push({x:0.6 * Math.cos(a), y:0.2 * rnd(), z:0.6 * Math.sin(a), st:0, ph:Math.random() * 6, first:i === 0}); } }
    function second(){ mem = true; reset(); stage = 0; sp = 0; stage = 1; var m = ag.value; clones = []; for (var i = 0; i < 6; i++) clones.push({k:"mem", a:0}); }
    function next(){ if (stage < 6){ stage++; sp = 0; enter(); } }
    function enter(){
      if (stage === 3){ var n = mem ? 14 : 7; clones = clones.filter(function(q){ return q.k === "mem"; }); if (!mem) for (var j = 0; j < 3; j++) clones.push({k:"mem", a:0}); for (var i = 0; i < n; i++) clones.push({k:"pl", a:0}); }
    }
    function step(dt0){
      var dt = dt0 * spd.value; T += dt; sp += dt * (mem ? 0.55 : 0.32);
      if (auto.value && sp > 1 && stage < 6){ next(); }
      var m = ag.value, bc = BC[m];
      pat.forEach(function(p){ p.ph += dt;
        if (p.st === 0){
          if (stage < 1){ p.x += Math.cos(p.ph * 1.3 + p.ph) * dt * 0.1; p.z += Math.sin(p.ph * 0.9) * dt * 0.1; p.y = 0.2 * Math.sin(p.ph); }
          else if (stage === 1 && p.first){ p.x += (bc.x * 0.72 - p.x) * dt * 0.8; p.z += (bc.z * 0.72 - p.z) * dt * 0.8; } else if (stage >= 2 && !p.first){ } else if (stage >= 2){ p.x += (0.3 * Math.cos(p.ph) - p.x) * dt * 0.5; p.z += (0.3 * Math.sin(p.ph) - p.z) * dt * 0.5; }
        }
      });
      if (stage >= 5){ abs.forEach(function(a){ if (!a.bound){ var tg = pat.filter(function(p){ return p.st === 0; }); if (tg.length){ var t = tg[a.tgt % tg.length]; a.x += (t.x - a.x) * dt * 1.4; a.y += (t.y - a.y) * dt * 1.4; a.z += (t.z - a.z) * dt * 1.4; if (Math.hypot(a.x - t.x, a.y - t.y, a.z - t.z) < 0.22){ a.bound = true; t.nb = (t.nb || 0) + 1; } } } });
        pat.forEach(function(p){ if (p.st === 0 && (p.nb || 0) >= 3) p.st = 1; if (p.st === 1){ p.x += (0 - p.x) * dt * 0.5; p.z += (0 - p.z) * dt * 0.5; p.y += (-0.4 - p.y) * dt * 0.5; p.ph += 0; } });
      }
      if (stage >= 4 && abs.length < (mem ? 40 : 18) && Math.random() < dt * (mem ? 22 : 10)){ var pls = clones.filter(function(q){ return q.k === "pl"; }); if (pls.length){ var q = pls[Math.floor(Math.random() * pls.length)]; abs.push({x:q.px || bc.x, y:0.1, z:q.pz || bc.z, tgt:Math.floor(Math.random() * 6), bound:false, ph:Math.random() * 6}); nAb++; } }
    }
    B.drag(c, cam, function(){ render(); });
    function Y(sc, p, col, ph, al){ var c0 = B.hex(col), ca = Math.cos(ph), sa = Math.sin(ph);
      sc.tube([p[0], p[1] - 0.18, p[2]], [p[0], p[1], p[2]], 0.035, c0, al);
      sc.tube([p[0], p[1], p[2]], [p[0] + 0.15 * ca, p[1] + 0.17, p[2] + 0.15 * sa], 0.035, c0, al); sc.tube([p[0], p[1], p[2]], [p[0] - 0.15 * ca, p[1] + 0.17, p[2] - 0.15 * sa], 0.035, c0, al); }
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W / 7.6, c.H / 5.4), 4.5), m = ag.value;
      /* plateau */
      var gr = 3.6; sc.poly([[-gr, -0.5, -gr], [gr, -0.5, -gr], [gr, -0.5, gr], [-gr, -0.5, gr]], B.hex("#e8edf6"), [0, 1, 0], 1, "rgba(100,116,139,.3)", true);
      /* lymphocytes B naïfs */
      BC.forEach(function(b, i){
        var sel = stage >= 2 && i === m, dim = stage >= 2 && i !== m, sz = sel && stage >= 2 ? 0.5 : 0.42, al = dim ? 0.28 : 1;
        sc.sphere([b.x, 0, b.z], sz, B.hex("#fde68a"), al, sel ? "#b45309" : null);
        for (var q = 0; q < 6; q++){ var a = q * 1.047 + b.i, rx = b.x + (sz + 0.02) * Math.cos(a) * 0.95, rz = b.z + (sz + 0.02) * Math.sin(a) * 0.95; Y(sc, [rx, 0.25 * (q % 2 ? 1 : -1), rz], COLS[i], a, al); }
        sc.label([b.x, 0.85, b.z], "B " + NAMES[i], dim ? "#94a3b8" : COLS[i], 11, 0, 0);
      });
      /* clones */
      var bc = BC[m];
      var dd = Math.hypot(bc.x, bc.z) || 1, ux = bc.x / dd, uz = bc.z / dd, vx = -uz, vz = ux;
      clones.forEach(function(q, n){
        var vis = (q.k === "mem" && mem && stage < 3) ? 1 : (stage >= 3 ? Math.min(1, sp * 2 + (stage > 3 ? 1 : 0)) : 0);
        var row = Math.floor(n / 5), col = n % 5, dist = (0.85 + row * 0.5) * vis, off = (col - 2) * 0.46 * vis;
        var x = bc.x + ux * dist + vx * off, z = bc.z + uz * dist + vz * off;
        if (q.k === "pl"){ sc.sphere([x, 0, z], 0.22, B.hex("#fbbf24"), 1, "#92400e"); for (var j = 0; j < 3; j++) sc.sphere([x + 0.09 * Math.cos(j * 2.1), 0.07, z + 0.09 * Math.sin(j * 2.1)], 0.04, B.hex("#b45309")); }
        else sc.sphere([x, 0, z], 0.19, B.hex("#bef264"), 1, "#4d7c0f");
        q.px = x; q.pz = z;
      });
      /* pathogènes */
      pat.forEach(function(p){
        var col = B.hex(COLS[m]);
        sc.sphere([p.x, p.y, p.z], 0.17, p.st ? B.hex("#94a3b8") : B.hex("#fca5a5"), p.st ? 0.6 : 1, "#7f1d1d");
        for (var q = 0; q < 6; q++){ var a = q * 1.047 + p.ph * 0.2; sc.sphere([p.x + 0.23 * Math.cos(a), p.y + 0.08 * Math.sin(a * 2), p.z + 0.23 * Math.sin(a)], 0.06, p.st ? B.hex("#94a3b8") : col); }
      });
      /* anticorps libres */
      abs.forEach(function(a){ Y(sc, [a.x, a.y, a.z], COLS[m], a.ph + T * 0.8); });
      if (stage < 1) sc.label([0, 0.7, 0], "pathogène (antigène " + NAMES[m] + ")", "#7f1d1d", 11, 0, 0);
      sc.flush(); B.hint(c);
      var left = pat.filter(function(p){ return p.st === 0; }).length, pls = clones.filter(function(q){ return q.k === "pl"; }).length, nCl = clones.length;
      ro.set(0, stage >= 2 ? (stage >= 3 ? 1 + nCl : 1) : 0); ro.set(1, stage >= 3 ? pls : 0); ro.set(2, abs.filter(function(a){ return !a.bound; }).length); ro.set(3, left);
      var ST = ["Un pathogène porteur de l'antigène " + NAMES[m] + " pénètre dans l'organisme. Quatre lymphocytes B de spécificités différentes sont présents (A, B, C, D).",
        "Reconnaissance : l'antigène " + NAMES[m] + " se fixe sur les récepteurs du lymphocyte B " + NAMES[m] + " (forme complémentaire, comme une clé dans une serrure). Les autres lymphocytes ne le reconnaissent pas.",
        "Sélection clonale : seul le lymphocyte B " + NAMES[m] + " est activé. Les trois autres restent inchangés.",
        "Prolifération : le lymphocyte sélectionné se divise en un clone de cellules identiques : des plasmocytes (jaunes) et des cellules mémoire (vertes).",
        "Les plasmocytes sécrètent un grand nombre d'anticorps identiques, de même spécificité que le récepteur d'origine.",
        "Neutralisation : les anticorps se fixent sur les antigènes, agglutinent les pathogènes (gris) qui seront détruits par les phagocytes.",
        "Réponse terminée. Les cellules mémoire (vertes) restent : clique sur « 2e rencontre » pour voir une réponse plus rapide et plus forte."];
      var s = Math.min(stage, 6);
      nt.set((mem && stage <= 1 ? "2e rencontre : des cellules mémoire sont déjà là. " : "") + ST[s], stage === 6 ? "ok" : "");
    }
    k.draw(render);
    reset();
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b5-3d-anticorps*/
