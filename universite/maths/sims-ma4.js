/* Mathématiques BA1 · chapitre 3 (dérivées) · lot MD (novembre 2026)
   ma-microscope-derivabilite · ma-chaine-engrenages · ma-elasticite-demande
   Fichier autonome : toutes les aides sont préfixées md. Aucune ressource externe. */
(function(){
var P = SFA.draw.palette, F = SFA.fmt, D = SFA.draw, PI = Math.PI;
function mdCl(x, a, b){ return Math.max(a, Math.min(b, x)); }
/* pas de graduation « rond » (1, 2, 5 × 10ⁿ), jamais nul */
function mdStep(span, n){ if (!(span > 0) || !isFinite(span)) return 1; var r = span / (n || 5), e = Math.pow(10, Math.floor(Math.log10(r))), m = r / e; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e; }
/* nombre avec espaces des milliers (1 000) */
function mdBig(x, d){ var s = F(x, d || 0), p = s.split(","), i = p[0].replace("−", ""), g = ""; while (i.length > 3){ g = " " + i.slice(-3) + g; i = i.slice(0, -3); } return (x < 0 ? "−" : "") + i + g + (p[1] ? "," + p[1] : ""); }
/* canevas dont le rapport hauteur/largeur dépend de la largeur (large / téléphone) */
function mdRatio(c, wide, tall, xwide){ var r0 = c.resize; c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 460 ? tall : (w >= 700 && xwide) ? xwide : wide; r0(); }; c.resize(); }
/* plateau de bureau en bois */
function mdWood(ctx, x, y, w, h){
  var g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, "#b98a5c"); g.addColorStop(1, "#8d6440");
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.lineWidth = 1;
  for (var i = 0; i < 16; i++){ var yy = y + (i + 0.5) * h / 16; ctx.strokeStyle = i % 3 ? "rgba(70,40,15,.10)" : "rgba(255,230,190,.10)"; ctx.beginPath(); ctx.moveTo(x, yy);
    for (var xx = x; xx <= x + w; xx += 24) ctx.lineTo(xx, yy + 3 * Math.sin(xx * 0.013 + i * 1.7) + 2 * Math.sin(xx * 0.041 + i)); ctx.stroke(); }
  ctx.restore();
}
/* feuille de papier avec ombre */
function mdPaper(ctx, x, y, w, h){
  ctx.save(); ctx.shadowColor = "rgba(30,15,0,.35)"; ctx.shadowBlur = 14; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 5;
  ctx.fillStyle = "#fdfbf5"; ctx.fillRect(x, y, w, h); ctx.restore();
  var g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "rgba(255,255,255,.0)"); g.addColorStop(1, "rgba(120,100,60,.07)"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}
/* prix toujours à deux décimales : 3,40 */
function mdEur(x){ return (Math.round(x * 100) / 100).toFixed(2).replace("-", "−").replace(".", ","); }
/* variation en % signée ; « 0 % » quand elle s'arrondit à zéro */
function mdPct(v){ return Math.abs(v) < 0.005 ? "0\u00a0%" : (v > 0 ? "+" : "") + F(v, 2) + "\u00a0%"; }
/* écriture scientifique pour le canevas : 6·10⁻⁵ (exposant en exposant Unicode) */
function mdSciT(x, d){ if (!isFinite(x) || x === 0) return F(x, d || 2); var e = Math.floor(Math.log10(Math.abs(x)) + 1e-12), m = x / Math.pow(10, e), sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  if (Math.abs(m) >= 9.995){ m /= 10; e += 1; } return F(m, d === undefined ? 2 : d) + "·10" + String(e).split("").map(function(ch){ return ch === "-" ? "⁻" : sup[+ch]; }).join(""); }
function mdTxt(c, s, x, y, col, size, al, o){ o = o || {}; D.text(c, s, x, y, {size: size || 11, color: col || P.ink, align: al || "center", weight: o.w || 700, math: o.math, halo: o.halo, bg: o.bg, base: o.base}); }

/* =====================================================================
   1 ---- Au microscope : une courbe dérivable devient une droite ----
   ===================================================================== */
var MD1 = {
  lisse: {n: "f(x) = x³/4 − x", f: function(x){ return x * x * x / 4 - x; }, d: function(x){ return 0.75 * x * x - 1; }, a0: 1.8, y0: -1.6, y1: 1.6, sp: null},
  abs:   {n: "f(x) = |x|", f: Math.abs, d: function(x){ return x > 0 ? 1 : -1; }, a0: 0, y0: -0.5, y1: 2.8, sp: 0},
  cbrt:  {n: "f(x) = ∛x", f: Math.cbrt, d: function(x){ var c = Math.cbrt(x); return 1 / (3 * c * c); }, a0: 0, y0: -1.6, y1: 1.6, sp: 0},
  saut:  {n: "f(x) = x/2 (x < 0) ; x/2 + 1 (x ≥ 0)", f: function(x){ return x >= 0 ? x / 2 + 1 : x / 2; }, d: function(){ return 0.5; }, a0: 0, y0: -1.5, y1: 2.5, sp: 0}
};
SFA.sim({
  id: "ma-microscope-derivabilite", ch: "c03", tag: "Dérivabilité",
  titre: "Au microscope : une courbe dérivable devient une droite",
  resume: "Promène la loupe d'un microscope sur la courbe et grossis : là où f est dérivable, la courbe devient sa tangente. Au coin de |x| le coin reste, pour ∛x la courbe se redresse jusqu'à la verticale.",
  but: "Glisse la loupe le long de la courbe (ou règle a). Dans l'oculaire, le grossissement monte et descend tout seul ; glisse verticalement dans l'oculaire ou sur la molette pour le régler toi-même. Les sécantes à gauche (orange) et à droite (violette) utilisent un pas h qui rapetisse avec le champ : compare leurs pentes.",
  aRetenir: "f est dérivable en a quand les dérivées à gauche et à droite, limites des taux d'accroissement [f(a + h) − f(a)]/h pour h → 0⁻ et h → 0⁺, existent, sont finies et coïncident. Au microscope, la courbe devient alors une droite : sa tangente y = f(a) + f′(a)(x − a). Dérivable en a ⇒ continue en a (la réciproque est fausse).",
  piege: "Continue ne veut pas dire dérivable : |x| est continue en 0 mais garde un coin (pentes −1 et +1), et ∛x est continue en 0 et son graphe y est lisse (sans coin), mais sa tangente y est verticale (taux → +∞) : pas de dérivée. Une fonction qui saute n'est jamais dérivable au point de saut.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 1.2}); mdRatio(c, 1.2, 1.5, 0.62); c.cv.style.touchAction = "none";
    var st = {t: 0, auto: true, n: 0, grab: null, py: 0, n0: 0};
    var fs = k.select("Fonction", [["lisse", "x³/4 − x (lisse)"], ["abs", "|x| (point anguleux en 0)"], ["cbrt", "∛x (tangente verticale en 0)"], ["saut", "fonction qui saute en 0"]], "lisse", function(v){ as.set(MD1[v].a0); });
    var as = k.slider("Position a de la loupe", -2.4, 2.4, 0.01, 1.8, "");
    var gs = k.slider("Grossissement : exposant n (×10ⁿ)", 0, 4, 0.05, 0, "", function(){ st.auto = false; au.set(false); });
    var au = k.toggle("Zoom automatique (avant / arrière)", true, function(v){ st.auto = v; if (v) st.t = 0; });
    k.button("Loupe sur le point spécial (0)", function(){ as.set(0); });
    var ro = k.readouts(["Grossissement", "Pente sécante à gauche", "Pente sécante à droite", "En a"]), nt = k.note("", "");
    var lp = k.loop(function(dt){ if (st.auto){ st.t += dt; var T = 11, s = 0.5 - 0.5 * Math.cos(2 * PI * st.t / T); s = mdCl(1.3 * s - 0.15, 0, 1); gs.set(4 * s * s * (3 - 2 * s)); } k.redraw(); });
    var G1 = null, E1 = null;
    function fa(T, a){ return T.f(a); }
    c.pointer(function(t, p){
      if (t === "down"){ st.grab = null;
        if (E1 && (Math.hypot(p.x - E1.cx, p.y - E1.cy) < E1.R + 8 || (E1.kx && Math.abs(p.x - E1.kx) < 20 && Math.abs(p.y - E1.cy) < E1.kh / 2 + 10))){ st.grab = "zoom"; st.py = p.y; st.n0 = gs.value; st.auto = false; au.set(false); }
        else if (G1 && p.y < G1.yB + 10) st.grab = "loupe"; }
      if ((t === "down" || t === "drag") && st.grab === "loupe" && G1){ var T = MD1[fs.value], a = (p.x - G1.ox) / G1.sc; if (T.sp !== null && Math.abs(a - T.sp) < 0.06) a = T.sp; as.set(Math.round(mdCl(a, -2.4, 2.4) * 100) / 100); k.redraw(); }
      if (t === "drag" && st.grab === "zoom"){ gs.set(mdCl(st.n0 + (st.py - p.y) / 70, 0, 4)); k.redraw(); }
      if (t === "up") st.grab = null;
      if (t === "move") c.cv.style.cursor = (E1 && Math.hypot(p.x - E1.cx, p.y - E1.cy) < E1.R + 8) ? "ns-resize" : (G1 && p.y < G1.yB) ? "grab" : "default";
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, T = MD1[fs.value], f = T.f, a = as.value, n = gs.value, G = Math.pow(10, n), w = 1 / G, h = 0.6 * w;
      c.clear(); mdWood(ctx, 0, 0, W, H);
      var wide = W >= 700, top = wide ? {x: 0, y: 0, w: Math.round(W * 0.5), h: H} : {x: 0, y: 0, w: W, h: Math.round(H * (W < 460 ? 0.43 : 0.41))};
      var bot = wide ? {x: top.w, y: 0, w: W - top.w, h: H} : {x: 0, y: top.h, w: W, h: H - top.h};
      /* ---- la feuille et la courbe ---- */
      var px0 = top.x + 10, py0 = top.y + 10, pw = top.w - 20, ph = top.h - 16; mdPaper(ctx, px0, py0, pw, ph);
      var gx0 = px0 + 10, gw = pw - 20, gy0 = py0 + 24, gh = ph - 34, sc = Math.min(gw / 5.2, gh / (T.y1 - T.y0)), ox = gx0 + gw / 2, oy = gy0 + gh / 2 + (T.y1 + T.y0) / 2 * sc;
      var X = function(x){ return ox + x * sc; }, Y = function(y){ return oy - y * sc; };
      G1 = {ox: ox, sc: sc, yB: py0 + ph};
      ctx.save(); ctx.beginPath(); ctx.rect(px0, py0, pw, ph); ctx.clip();
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(70,120,190,.13)"; ctx.beginPath();
      for (var gx = Math.ceil((px0 - ox) / (sc / 4)); ox + gx * sc / 4 < px0 + pw; gx++){ var q = Math.round(ox + gx * sc / 4) + 0.5; ctx.moveTo(q, py0); ctx.lineTo(q, py0 + ph); }
      for (var gy = Math.ceil((oy - py0 - ph) / (sc / 4)); oy - gy * sc / 4 > py0; gy++){ q = Math.round(oy - gy * sc / 4) + 0.5; ctx.moveTo(px0, q); ctx.lineTo(px0 + pw, q); } ctx.stroke();
      ctx.strokeStyle = "rgba(70,120,190,.3)"; ctx.beginPath();
      for (gx = -3; gx <= 3; gx++){ q = Math.round(X(gx)) + 0.5; ctx.moveTo(q, py0); ctx.lineTo(q, py0 + ph); }
      for (gy = Math.ceil(T.y0 - 1); gy <= T.y1 + 1; gy++){ q = Math.round(Y(gy)) + 0.5; ctx.moveTo(px0, q); ctx.lineTo(px0 + pw, q); } ctx.stroke();
      ctx.strokeStyle = "#5b6574"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(px0 + 4, Y(0)); ctx.lineTo(px0 + pw - 4, Y(0)); ctx.moveTo(X(0), py0 + 4); ctx.lineTo(X(0), py0 + ph - 4); ctx.stroke();
      ctx.font = "600 9.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#6b7584"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      [-2, -1, 1, 2].forEach(function(v){ ctx.fillText(F(v, 0), X(v), Y(0) + 3); });
      /* courbe à l'encre */
      ctx.strokeStyle = "#1d3270"; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.beginPath(); var on = false, prv = null;
      for (var i = 0; i <= 600; i++){ var xx = -2.6 + 5.2 * i / 600, yy = f(xx); if (prv !== null && Math.abs(yy - prv) > 0.5){ on = false; } if (!on){ ctx.moveTo(X(xx), Y(yy)); on = true; } else ctx.lineTo(X(xx), Y(yy)); prv = yy; }
      ctx.stroke();
      if (fs.value === "saut"){ ctx.beginPath(); ctx.arc(X(0), Y(0), 4, 0, 7); ctx.fillStyle = "#fdfbf5"; ctx.fill(); ctx.lineWidth = 1.8; ctx.stroke(); ctx.beginPath(); ctx.arc(X(0), Y(1), 4, 0, 7); ctx.fillStyle = "#1d3270"; ctx.fill(); }
      ctx.restore();
      mdTxt(c, T.n, px0 + 10, py0 + 13, "#1d3270", 12, "left", {math: true, halo: "#fdfbf5"});
      /* la loupe : vraie taille du champ (2w), avec un minimum pour rester visible */
      var lx = X(a), ly = Y(f(a)), rTrue = w * sc, rL = Math.max(15, Math.min(rTrue, 0.45 * sc));
      ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = "#2a1a08"; ctx.beginPath(); ctx.ellipse(lx + 7, ly + 9, rL + 5, rL + 5, 0, 0, 7); ctx.fill();
      var hx = lx + (rL + 4) * 0.7071, hy = ly + (rL + 4) * 0.7071; ctx.lineCap = "round"; ctx.lineWidth = 10; ctx.strokeStyle = "#2a1a08"; ctx.beginPath(); ctx.moveTo(hx + 7, hy + 9); ctx.lineTo(hx + 7 + 40, hy + 9 + 40); ctx.stroke(); ctx.restore();
      var hg = ctx.createLinearGradient(hx, hy - 6, hx + 6, hy + 6); hg.addColorStop(0, "#7a4a22"); hg.addColorStop(0.5, "#c98a4b"); hg.addColorStop(1, "#5d3515");
      ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = 10; ctx.strokeStyle = hg; ctx.beginPath(); ctx.moveTo(hx + 3, hy + 3); ctx.lineTo(hx + 40, hy + 40); ctx.stroke(); ctx.restore();
      var gl = ctx.createRadialGradient(lx - rL * 0.35, ly - rL * 0.35, 1, lx, ly, rL); gl.addColorStop(0, "rgba(255,255,255,.35)"); gl.addColorStop(1, "rgba(150,200,235,.22)");
      ctx.beginPath(); ctx.arc(lx, ly, rL, 0, 7); ctx.fillStyle = gl; ctx.fill();
      var rg = ctx.createLinearGradient(lx - rL, ly - rL, lx + rL, ly + rL); rg.addColorStop(0, "#f2f4f7"); rg.addColorStop(0.45, "#8e98a6"); rg.addColorStop(1, "#4a5361");
      ctx.lineWidth = 5; ctx.strokeStyle = rg; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, rL - 4, PI * 1.08, PI * 1.42); ctx.lineWidth = 2.2; ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.stroke(); ctx.restore();
      if (rTrue < rL - 2){ ctx.save(); ctx.strokeStyle = "rgba(192,50,29,.85)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(lx, ly, Math.max(1.5, rTrue), 0, 7); ctx.stroke(); ctx.restore(); }
      D.dot(c, lx, ly, 3.2, P.red);
      /* étiquette « a = … » : au-dessus ou au-dessous de la loupe, sans recouvrir les graduations de l'axe */
      var aLab = "a = " + F(a, 2); ctx.font = "700 10.5px Mulish, system-ui, sans-serif"; var alw = ctx.measureText(aLab).width + 10, alh = 16;
      var ticks = [-2, -1, 1, 2].map(function(v){ return {x: X(v) - 8, y: Y(0) + 1, w: 16, h: 14}; }), lbx = mdCl(lx, px0 + 44, px0 + pw - 44), lby = null;
      [ly - rL - 12, ly + rL + 14, ly - rL - 30, ly + rL + 32].some(function(yc){ if (yc < py0 + 26 || yc > py0 + ph - 10) return false;
        var r = {x: lbx - alw / 2, y: yc - alh / 2, w: alw, h: alh}; if (ticks.some(function(q){ return r.x < q.x + q.w && q.x < r.x + r.w && r.y < q.y + q.h && q.y < r.y + r.h; })) return false; lby = yc; return true; });
      if (lby === null) lby = ly - rL - 12 < py0 + 26 ? Math.min(ly + rL + 14, py0 + ph - 10) : ly - rL - 12;
      mdTxt(c, aLab, lbx, lby, P.red, 10.5, "center", {bg: "rgba(255,255,255,.88)"});
      /* ---- l'oculaire ---- */
      var tH = 20, bH = 22, R = Math.max(40, Math.min(bot.w / 2 - 46, (bot.h - tH - bH) / 2 - 12)), cx = bot.x + bot.w / 2 - (bot.w > 2 * R + 120 ? 0 : 10), cy = bot.y + tH + (bot.h - tH - bH) / 2;
      var kx = cx + R + 30, kh = Math.min(120, R * 1.1); if (kx + 12 > bot.x + bot.w - 2) kx = 0;
      E1 = {cx: cx, cy: cy, R: R, kx: kx, kh: kh};
      mdTxt(c, "OCULAIRE  ×" + mdBig(G, G < 10 ? 1 : 0) + "   ·   pas des sécantes h = " + (h >= 0.001 ? F(h, 4) : mdSciT(h)), bot.x + bot.w / 2, bot.y + 12, "#fff6e8", 11, "center", {halo: "rgba(60,35,15,.6)"});
      /* corps du tube et ombre */
      ctx.save(); ctx.shadowColor = "rgba(20,10,0,.55)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.beginPath(); ctx.arc(cx, cy, R + 14, 0, 7); ctx.fillStyle = "#2b2f36"; ctx.fill(); ctx.restore();
      var mg = ctx.createLinearGradient(cx - R - 14, cy - R - 14, cx + R + 14, cy + R + 14); mg.addColorStop(0, "#e9edf2"); mg.addColorStop(0.35, "#9aa4b1"); mg.addColorStop(0.7, "#4d5663"); mg.addColorStop(1, "#272c33");
      ctx.beginPath(); ctx.arc(cx, cy, R + 13, 0, 7); ctx.fillStyle = mg; ctx.fill();
      ctx.save(); ctx.strokeStyle = "rgba(20,24,30,.35)"; ctx.lineWidth = 1; for (var m = 0; m < 72; m++){ var an = m * PI / 36; ctx.beginPath(); ctx.moveTo(cx + (R + 9) * Math.cos(an), cy + (R + 9) * Math.sin(an)); ctx.lineTo(cx + (R + 13) * Math.cos(an), cy + (R + 13) * Math.sin(an)); ctx.stroke(); } ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, 7); ctx.fillStyle = "#14171c"; ctx.fill();
      /* champ de vision : repère centré en (a, f(a)), même échelle en x et en y */
      var ya = fa(T, a), k1 = R / w, U = function(x){ return cx + (x - a) * k1; }, V = function(y){ return cy - (y - ya) * k1; };
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
      ctx.fillStyle = "#fbf8ef"; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      var stp = mdStep(2 * w, 6); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(70,120,190,.20)"; ctx.beginPath();
      var i0 = Math.ceil((a - w) / stp), i1 = Math.floor((a + w) / stp); for (i = i0; i <= i1 && i - i0 < 40; i++){ q = Math.round(U(i * stp)) + 0.5; ctx.moveTo(q, cy - R); ctx.lineTo(q, cy + R); }
      i0 = Math.ceil((ya - w) / stp); i1 = Math.floor((ya + w) / stp); for (i = i0; i <= i1 && i - i0 < 40; i++){ q = Math.round(V(i * stp)) + 0.5; ctx.moveTo(cx - R, q); ctx.lineTo(cx + R, q); } ctx.stroke();
      /* sécantes (pas h = 0,6 × demi-champ) et tangente */
      var fl = f(a - h), fr = f(a + h), sl = (ya - fl) / h, sr = (fr - ya) / h, isSp = T.sp !== null && Math.abs(a - T.sp) < 1e-9;
      var kind = !isSp ? "ok" : fs.value === "abs" ? "coin" : fs.value === "cbrt" ? "vert" : "saut";
      var LL = 2.2 * w;
      function sline(sl0, col, wd, dash){ var dx = LL / Math.sqrt(1 + sl0 * sl0), dy = sl0 * dx; D.line(c, U(a - dx), V(ya - dy), U(a + dx), V(ya + dy), col, wd, dash); }
      if (kind === "ok") sline(T.d(a), "rgba(36,119,90,.9)", 2.2, [7, 5]);
      if (kind === "vert") D.line(c, cx, cy - R, cx, cy + R, "rgba(36,119,90,.9)", 2.2, [7, 5]);
      if (isFinite(sl)) sline(sl, "rgba(224,122,31,.95)", 2.2); if (isFinite(sr)) sline(sr, "rgba(98,54,196,.9)", 2.2);
      ctx.strokeStyle = "#1d3270"; ctx.lineWidth = 3.4; ctx.lineJoin = "round"; ctx.beginPath(); on = false; prv = null;
      for (i = 0; i <= 400; i++){ xx = a - 1.1 * w + 2.2 * w * i / 400; yy = f(xx); var pyy = V(yy); if (prv !== null && Math.abs(pyy - prv) > R) on = false; pyy = mdCl(pyy, cy - 3 * R, cy + 3 * R); if (!on){ ctx.moveTo(U(xx), pyy); on = true; } else ctx.lineTo(U(xx), pyy); prv = pyy; }
      ctx.stroke();
      if (Math.abs(V(fl) - cy) < R) D.dot(c, U(a - h), V(fl), 5, P.orange); if (Math.abs(V(fr) - cy) < R) D.dot(c, U(a + h), V(fr), 5, P.violet);
      D.dot(c, cx, cy, 5.5, P.red);
      /* barre d'échelle */
      var bl = stp * k1, bxl = cx - bl / 2, byl = cy + R * 0.78; D.line(c, bxl, byl, bxl + bl, byl, "#2c3a4e", 2); D.line(c, bxl, byl - 4, bxl, byl + 4, "#2c3a4e", 2); D.line(c, bxl + bl, byl - 4, bxl + bl, byl + 4, "#2c3a4e", 2);
      mdTxt(c, stp >= 0.001 ? F(stp, Math.max(0, -Math.floor(Math.log10(stp) + 1e-9))) : mdSciT(stp, 0), cx, byl - 10, "#2c3a4e", 10, "center", {halo: "#fbf8ef"});
      /* vignettage et reflet */
      var vg = ctx.createRadialGradient(cx, cy, R * 0.62, cx, cy, R); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(10,10,20,.42)"); ctx.fillStyle = vg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.9, PI * 1.1, PI * 1.38); ctx.lineWidth = R * 0.06; ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.stroke();
      ctx.restore();
      /* ∛x en 0, fort grossissement : la pente explose */
      if (kind === "vert" && n >= 2) mdTxt(c, "pente → ∞", cx + R * 0.42, cy - R * 0.5, P.red, Math.max(12, Math.min(16, R * 0.11)), "center", {w: 800, bg: "rgba(255,255,255,.9)"});
      /* molette de mise au point (grossissement) */
      if (kx){ var kg = ctx.createLinearGradient(kx - 11, 0, kx + 11, 0); kg.addColorStop(0, "#3a414b"); kg.addColorStop(0.45, "#c9d0d9"); kg.addColorStop(1, "#30363f");
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; D.rrect(c, kx - 11, cy - kh / 2, 22, kh, 7); ctx.fillStyle = kg; ctx.fill(); ctx.restore();
        ctx.save(); D.rrect(c, kx - 11, cy - kh / 2, 22, kh, 7); ctx.clip(); ctx.strokeStyle = "rgba(20,24,30,.45)"; ctx.lineWidth = 1.2; var off = (n * 40) % 7;
        for (var yk = cy - kh / 2 - 7 + off; yk < cy + kh / 2 + 7; yk += 7){ ctx.beginPath(); ctx.moveTo(kx - 11, yk); ctx.lineTo(kx + 11, yk); ctx.stroke(); } ctx.restore();
        var ky = cy + kh / 2 - n / 4 * kh; D.line(c, kx - 15, ky, kx + 15, ky, P.yellow, 3);
        mdTxt(c, "zoom", kx, cy - kh / 2 - 10, "#fff6e8", 10, "center", {halo: "rgba(60,35,15,.6)"}); }
      /* légende sous l'oculaire */
      var lgY = bot.y + bot.h - 11, items = [["#ff9a3c", "sécante gauche"], ["#b59bff", "sécante droite"], ["#5fd6a0", "tangente"]], tw = 0; ctx.font = "700 10.5px Mulish, system-ui, sans-serif";
      items.forEach(function(it){ tw += ctx.measureText(it[1]).width + 30; }); var lx0 = bot.x + (bot.w - tw) / 2;
      ctx.save(); ctx.fillStyle = "rgba(25,18,10,.72)"; D.rrect(c, lx0 - 8, lgY - 9, tw + 6, 18, 9); ctx.fill(); ctx.restore();
      items.forEach(function(it){ D.line(c, lx0, lgY, lx0 + 16, lgY, it[0], 3, it[0] === "#5fd6a0" ? [5, 3] : null); mdTxt(c, it[1], lx0 + 20, lgY, "#fff6e8", 10.5, "left"); lx0 += ctx.measureText(it[1]).width + 30; });
      /* écart à la tangente dans le champ (en % du champ) */
      var dev = 0; if (kind === "ok"){ var dA = T.d(a); for (i = 0; i <= 200; i++){ xx = a - w + 2 * w * i / 200; dev = Math.max(dev, Math.abs(f(xx) - ya - dA * (xx - a))); } dev = dev / (2 * w) * 100; }
      ro.set(0, "×" + mdBig(G, G < 10 ? 1 : 0));
      ro.set(1, isFinite(sl) ? (Math.abs(sl) >= 1000 ? S.sci(sl) : F(sl, 3)) : "—"); ro.set(2, isFinite(sr) ? (Math.abs(sr) >= 1000 ? S.sci(sr) : F(sr, 3)) : "—");
      ro.set(3, kind === "ok" ? "dérivable, f′(a) = " + F(T.d(a), 3) : kind === "coin" ? "point anguleux" : kind === "vert" ? "tangente verticale" : "discontinue");
      if (kind === "ok") nt.set("Au grossissement ×" + mdBig(G, G < 10 ? 1 : 0) + ", l'écart entre la courbe et sa tangente (verte) " + (dev >= 0.1 ? "vaut au plus " + F(dev, 1) : "est inférieur à 0,1") + " % de la largeur du champ. Plus on grossit, plus elle se confond avec la droite de pente f′(" + F(a, 2) + ") = " + F(T.d(a), 3) + " : les deux sécantes tendent vers la même pente.", dev < 1 ? "ok" : "");
      else if (kind === "coin") nt.set("|x| en 0 : à n'importe quel grossissement, on voit le même coin. Taux à gauche = −1, taux à droite = +1, quel que soit h : f′<sub>g</sub>(0) = −1 ≠ f′<sub>d</sub>(0) = 1. Continue, mais pas dérivable en 0.", "warn");
      else if (kind === "vert") nt.set("∛x en 0 : la fonction est continue et sa courbe sans coin, mais en grossissant elle se redresse : les pentes des sécantes valent 1/∛h² = " + (sl >= 1000 ? S.sci(sl) : F(sl, 2)) + " et explosent quand h → 0. Tangente verticale : pas de dérivée.", "warn");
      else nt.set("Saut en 0 : f(0) = 1 mais à gauche la courbe arrive en 0. Taux à droite = 1/2, taux à gauche = 1/2 + 1/h → +∞ : un morceau quitte le champ. Pas continue, donc pas dérivable (dérivable ⇒ continue).", "bad");
    });
    lp.play();
  }
});

/* =====================================================================
   2 ---- Règle de la chaîne : des engrenages qui multiplient les vitesses ----
   Engrenages non circulaires exacts : angle de la roue 1 = k·x, de la roue 2 = k·f(x),
   de la roue 3 = k·g(f(x)). Roulement sans glissement : r₁/r₂ = f′(x) au contact (r₁ + r₂ = d).
   ===================================================================== */
var MD2 = {
  rac: {n: "f(x) = x² et g(u) = √u", fn: "x²", gn: "√u", f: function(x){ return x * x; }, df: function(x){ return 2 * x; }, g: Math.sqrt, dg: function(u){ return 0.5 / Math.sqrt(u); }, x0: 0.5, x1: 1.7, xd: 1.1, cst: false},
  aff: {n: "f(x) = 2x et g(u) = u/3", fn: "2x", gn: "u/3", f: function(x){ return 2 * x; }, df: function(){ return 2; }, g: function(u){ return u / 3; }, dg: function(){ return 1 / 3; }, x0: 0, x1: 1.5, xd: 0.6, cst: true},
  sin: {n: "f(x) = sin x et g(u) = eᵘ", fn: "sin x", gn: "eᵘ", f: Math.sin, df: Math.cos, g: Math.exp, dg: Math.exp, x0: 0, x1: 1.3, xd: 0.5, cst: false},
  ln:  {n: "f(x) = ln x et g(u) = (u + 1)²", fn: "ln x", gn: "(u + 1)²", f: Math.log, df: function(x){ return 1 / x; }, g: function(u){ return (u + 1) * (u + 1); }, dg: function(u){ return 2 * (u + 1); }, x0: 1, x1: 3, xd: 1.6, cst: false}
};
/* profil d'une paire de roues (corps : points [x, y] dans le repère de chaque roue) */
function mdPair(ang1, ang2, ratio, t0, t1, k, d, A1, A2, sgn, full, p0){
  var r1 = [], r2 = [], ph1 = [], ph2 = [], ss = [0], i, N, a10 = ang1(t0), a20 = ang2(t0);
  function tw(z){ return mdCl(1.8 * Math.sin(2 * PI * z), -1, 1); }
  if (full){
    var rho = ratio(t0), R1 = d * rho / (1 + rho), R2 = d / (1 + rho), ns = Math.max(8, Math.round(2 * PI * Math.min(R1, R2) / p0)), p = 2 * PI * Math.min(R1, R2) / ns, Am = 0.32 * p;
    N = Math.round(2 * PI * Math.max(R1, R2) / p * 16);
    var o1 = [], o2 = [];
    for (i = 0; i < N; i++){ var u = i / N * 2 * PI, s1 = R1 * u, s2 = R2 * u, q1 = R1 + Am * tw(s1 / p), q2 = R2 - Am * tw(s2 / p), f1 = A1 - sgn * u, f2 = A2 + sgn * u;
      o1.push([q1 * Math.cos(f1), q1 * Math.sin(f1)]); o2.push([q2 * Math.cos(f2), q2 * Math.sin(f2)]); }
    return {g1: o1, g2: o2, rmax1: R1 + Am, rmax2: R2 + Am, A: Am};
  }
  /* secteurs dentés : échantillonnage fin, longueur d'arc commune */
  var Nc = 400; N = Nc; var tt = [];
  for (i = 0; i <= N; i++){ var t = t0 + (t1 - t0) * i / N, rh = ratio(t); tt.push(t); r1.push(d * rh / (1 + rh)); r2.push(d / (1 + rh)); ph1.push(A1 - sgn * k * (ang1(t) - a10)); ph2.push(A2 + sgn * k * (ang2(t) - a20)); }
  for (i = 1; i <= N; i++){ var l1 = Math.hypot(r1[i] * Math.cos(ph1[i]) - r1[i - 1] * Math.cos(ph1[i - 1]), r1[i] * Math.sin(ph1[i]) - r1[i - 1] * Math.sin(ph1[i - 1])), l2 = Math.hypot(r2[i] * Math.cos(ph2[i]) - r2[i - 1] * Math.cos(ph2[i - 1]), r2[i] * Math.sin(ph2[i]) - r2[i - 1] * Math.sin(ph2[i - 1])); ss.push(ss[i - 1] + (l1 + l2) / 2); }
  var Ltot = ss[N], nt = Math.max(4, Math.round(Ltot / p0)), pp = Ltot / nt, Am2 = 0.32 * pp;
  /* rééchantillonnage : 16 points par dent */
  var M = nt * 16, g1 = [], g2 = [], j = 0, mn1 = 9, mn2 = 9, mx1 = 0, mx2 = 0;
  for (i = 0; i <= M; i++){ var sv = Ltot * i / M; while (j < N - 1 && ss[j + 1] < sv) j++; var fr = (sv - ss[j]) / Math.max(1e-12, ss[j + 1] - ss[j]);
    var R1i = r1[j] + (r1[j + 1] - r1[j]) * fr, R2i = r2[j] + (r2[j + 1] - r2[j]) * fr, F1 = ph1[j] + (ph1[j + 1] - ph1[j]) * fr, F2 = ph2[j] + (ph2[j + 1] - ph2[j]) * fr, tv = tw(sv / pp);
    var Q1 = R1i + Am2 * tv, Q2 = R2i - Am2 * tv; g1.push([Q1 * Math.cos(F1), Q1 * Math.sin(F1)]); g2.push([Q2 * Math.cos(F2), Q2 * Math.sin(F2)]);
    mn1 = Math.min(mn1, R1i); mn2 = Math.min(mn2, R2i); mx1 = Math.max(mx1, Q1); mx2 = Math.max(mx2, Q2); }
  /* fermeture du corps par un arc de petit rayon */
  function close(g, f0, f1, rb){ var dir = f1 > f0 ? 1 : -1, end = f0 + dir * 2 * PI, nA = 60; for (var q = 1; q < nA; q++){ var an = f1 + (end - f1) * q / nA; g.push([rb * Math.cos(an), rb * Math.sin(an)]); } }
  close(g1, ph1[0], ph1[N], Math.max(0.1, mn1 - 2.2 * Am2)); close(g2, ph2[0], ph2[N], Math.max(0.1, mn2 - 2.2 * Am2));
  return {g1: g1, g2: g2, rmax1: mx1, rmax2: mx2, A: Am2};
}
function mdShade(hex, f){ var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, c = function(v){ return Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f))); }; return "rgb(" + c(r) + "," + c(g) + "," + c(b) + ")"; }
SFA.sim({
  id: "ma-chaine-engrenages", ch: "c03", tag: "Règle de la chaîne",
  titre: "La règle de la chaîne : des engrenages qui multiplient les vitesses",
  resume: "Trois roues dentées en 3D : la roue 1 tourne de x, la roue 2 de f(x), la roue 3 de g(f(x)). La roue 2 va f′(x) fois plus vite que la 1, la roue 3 g′(f(x)) fois plus vite que la 2 : les rapports se multiplient.",
  but: "Tourne la manivelle rouge de la roue 1 à la souris (ou laisse-la tourner) ; glisse ailleurs dans la scène pour faire pivoter le montage. La roue 1 tourne d'un angle k·x ; la roue 2 tourne de k·f(x) en sens inverse (deux roues engrenées tournent en sens contraires), la roue 3 de k·g(f(x)) dans le sens de la roue 1, avec le même k. Le montage suppose f′ > 0 et g′ > 0 (f et g croissantes), sinon une roue devrait changer de sens. Les roues ne sont pas rondes : là où f′(x) est grand, la roue 1 est grande au contact et la roue 2 petite, donc la 2 tourne vite. Compare les trois pentes en bas.",
  aRetenir: "Règle de la chaîne : (g ∘ f)′(x) = g′(f(x)) · f′(x). On dérive la fonction extérieure g au point image f(x), puis on multiplie par la dérivée de la fonction intérieure f. Les taux de variation s'enchaînent comme les rapports de vitesses d'un train d'engrenages : |ω₂|/|ω₁| = f′(x), |ω₃|/|ω₂| = g′(f(x)), donc |ω₃|/|ω₁| = g′(f(x)) · f′(x).",
  piege: "La dérivée extérieure s'évalue en f(x), pas en x : avec f(x) = x² et g(u) = √u, g′(x) · f′(x) = 2x/(2√x) = √x, alors que (√(x²))′ = 1 pour x > 0 : il faut g′(f(x)) · f′(x) = 2x/(2x) = 1. Et l'on multiplie les dérivées, on ne les additionne pas.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.98}); mdRatio(c, 0.98, 1.5, 0.82); c.cv.style.touchAction = "none";
    var st = {yaw: -0.55, pitch: 0.78, grab: null, px: 0, py: 0, a0: 0, x0: 0, ph: 0.25, dir: 1, geo: null, key: ""};
    var ps = k.select("Fonctions f (intérieure) et g (extérieure)", [["rac", "f(x) = x², g(u) = √u"], ["aff", "f(x) = 2x, g(u) = u/3 (roues rondes)"], ["sin", "f(x) = sin x, g(u) = eᵘ"], ["ln", "f(x) = ln x, g(u) = (u + 1)²"]], "rac", function(v){ var T = MD2[v]; xs.el.min = T.x0; xs.el.max = T.x1; xs.set(T.xd); st.ph = (T.xd - T.x0) / (T.x1 - T.x0) / 2; });
    var xs = k.slider("x (angle de la roue 1 : k·x)", 0.5, 1.7, 0.01, 1.1, "");
    var au = k.toggle("La manivelle tourne toute seule", true);
    k.button("Vue de dessus", function(){ st.yaw = -0.0001; st.pitch = 1.5; }); k.button("Vue en 3D", function(){ st.yaw = -0.55; st.pitch = 0.78; });
    var ro = k.readouts(["x → u = f(x) → y = g(u)", "f′(x) = |ω₂|/|ω₁|", "g′(f(x)) = |ω₃|/|ω₂|", "(g ∘ f)′(x) = |ω₃|/|ω₁|"]), nt = k.note("", "");
    var labs = [], Dd = 1, ZA = 0.56, ZB = 0.3, TH = 0.1, O = [[-Dd, 0], [0, 0], [Dd, 0]], cam = {}, sceneH = 0, crank = null;
    function geo(){ var key = ps.value; if (st.key === key && st.geo) return st.geo; var T = MD2[key], u0 = T.f(T.x0), u1 = T.f(T.x1), y0 = T.g(u0), y1 = T.g(u1);
      var kk = 0.9 * 2 * PI / Math.max(T.x1 - T.x0, u1 - u0, y1 - y0);
      var mA = mdPair(function(x){ return x; }, T.f, T.df, T.x0, T.x1, kk, Dd, 0, PI, 1, T.cst, 0.105);
      var mB = mdPair(function(u){ return u; }, T.g, T.dg, u0, u1, kk, Dd, 0, PI, -1, T.cst, 0.105);
      st.key = key; st.geo = {k: kk, u0: u0, y0: y0, mA: mA, mB: mB}; return st.geo; }
    function camSet(x, y, w, h){ var cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch), Dc = 8; var f = Math.min(w * 0.97 / 3.95, h * 0.96 / (2.6 * sp + 0.75 * cp)) * Dc;
      cam = {cx: x + w / 2, cy: y + h * 0.5 + 0.1 * cp * f / Dc, f: f, Dc: Dc, cyw: cy, syw: sy, cp: cp, sp: sp}; }
    function pr(x, y, z){ var C = cam, xr = x * C.cyw - y * C.syw, yr = x * C.syw + y * C.cyw, dep = C.Dc + yr * C.cp - (z - 0.3) * C.sp, s = C.f / Math.max(0.5, dep); return [C.cx + xr * s, C.cy - ((z - 0.3) * C.cp + yr * C.sp) * s, dep]; }
    function unpr(X, Y, h){ var C = cam, a = (X - C.cx) / C.f, b = (C.cy - Y) / C.f, z = h - 0.3, den = C.sp - b * C.cp; if (Math.abs(den) < 1e-6) return null; var yr = (b * (C.Dc - z * C.sp) - z * C.cp) / den, dep = C.Dc + yr * C.cp - z * C.sp, xr = a * dep; return [xr * C.cyw + yr * C.syw, -xr * C.syw + yr * C.cyw]; }
    function world(pts, o, rot){ var cr = Math.cos(rot), sr = Math.sin(rot); return pts.map(function(q){ return [o[0] + q[0] * cr - q[1] * sr, o[1] + q[0] * sr + q[1] * cr]; }); }
    function path(ctx, w2, z){ ctx.beginPath(); for (var i = 0; i < w2.length; i++){ var q = pr(w2[i][0], w2[i][1], z); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.closePath(); }
    function cyl(ctx, x, y, z0, z1, r, col){ var a = pr(x, y, z0), b = pr(x, y, z1), s = Math.abs(pr(x + r, y, z1)[0] - pr(x - r, y, z1)[0]) / 2 + 1.2, rr = Math.max(s, Math.hypot(pr(x + r * cam.cyw, y - r * cam.syw, z1)[0] - b[0], 0)), ey = rr * cam.sp;
      var g = ctx.createLinearGradient(b[0] - rr, 0, b[0] + rr, 0); g.addColorStop(0, mdShade(col, 0.45)); g.addColorStop(0.4, mdShade(col, 1.35)); g.addColorStop(1, mdShade(col, 0.4));
      ctx.beginPath(); ctx.moveTo(a[0] - rr, a[1]); ctx.lineTo(b[0] - rr, b[1]); ctx.ellipse(b[0], b[1], rr, Math.max(0.5, ey), 0, PI, 0, false); ctx.lineTo(a[0] + rr, a[1]); ctx.ellipse(a[0], a[1], rr, Math.max(0.5, ey), 0, 0, PI, false); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(b[0], b[1], rr, Math.max(0.5, ey), 0, 0, 7); ctx.fillStyle = mdShade(col, 1.2); ctx.fill(); }
    function gear(ctx, pts, o, rot, z0, z1, col, lab, labCol){ var w2 = world(pts, o, rot), L = 6, i;
      for (i = 0; i <= L; i++){ path(ctx, w2, z0 + (z1 - z0) * i / L); ctx.fillStyle = mdShade(col, 0.42 + 0.22 * i / L); ctx.fill(); }
      var a = pr(o[0] - 0.9, o[1] + 0.9, z1), b = pr(o[0] + 0.9, o[1] - 0.9, z1), g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, mdShade(col, 1.45)); g.addColorStop(0.5, col); g.addColorStop(1, mdShade(col, 0.72));
      path(ctx, w2, z1); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 0.8; ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.stroke();
      /* gorge décorative et moyeu */
      ctx.save(); ctx.beginPath(); for (i = 0; i <= 40; i++){ var an = i / 40 * 2 * PI, q = pr(o[0] + 0.115 * Math.cos(an), o[1] + 0.115 * Math.sin(an), z1); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.fillStyle = mdShade(col, 0.6); ctx.fill(); ctx.restore();
      cyl(ctx, o[0], o[1], z1, z1 + 0.05, 0.05, "#8e99a8");
      /* repère tournant (trait radial) pour voir la rotation */
      var m1 = pr(o[0] + 0.13 * Math.cos(rot), o[1] + 0.13 * Math.sin(rot), z1), m2 = pr(o[0] + 0.3 * Math.cos(rot), o[1] + 0.3 * Math.sin(rot), z1); D.line(c, m1[0], m1[1], m2[0], m2[1], "rgba(255,255,255,.85)", 2.4);
      if (lab){ var t = pr(o[0], o[1], z1 + 0.05); labs.push([lab, t[0], t[1] - 13, labCol]); } }
    function shadow(ctx, pts, o, rot, z){ var w2 = world(pts, o, rot).map(function(q){ return [q[0] + 0.22 * z, q[1] - 0.16 * z]; }); path(ctx, w2, 0.001); ctx.fillStyle = "rgba(40,20,5,.22)"; ctx.fill(); }
    /* arc fléché (vitesse) autour d'un axe, sur la face du dessus */
    function speedArc(ctx, o, z, r, rel, sens, col){ var span = mdCl(0.6 * Math.abs(rel), 0.12, 5.2), a0 = 1.9, n = 30, pts = []; for (var i = 0; i <= n; i++){ var an = a0 + sens * span * i / n; pts.push(pr(o[0] + r * Math.cos(an), o[1] + r * Math.sin(an), z)); }
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 6; ctx.beginPath(); pts.forEach(function(q, i){ i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); var e = pts[n], e0 = pts[n - 2]; D.arrow(c, e0[0], e0[1], e[0] + (e[0] - e0[0]) * 0.6, e[1] + (e[1] - e0[1]) * 0.6, col, 3); }
    /* petit graphe avec point et tangente */
    function mini(b, fn, dfn, a0, a1, t, title, sub, col){ var ctx = c.ctx; D.panel(c, b.x + 3, b.y + 3, b.w - 6, b.h - 6, {shadow: false, fill: "rgba(255,255,255,.97)"});
      var L = b.x + 30, R = b.x + b.w - 10, T = b.y + 34, B = b.y + b.h - 22, lo = 1e9, hi = -1e9, i, v;
      for (i = 0; i <= 80; i++){ v = fn(a0 + (a1 - a0) * i / 80); lo = Math.min(lo, v); hi = Math.max(hi, v); } var pad = (hi - lo) * 0.12 + 1e-6; lo -= pad; hi += pad;
      var X = function(x){ return L + (x - a0) / (a1 - a0) * (R - L); }, Y = function(y){ return B - (y - lo) / (hi - lo) * (B - T); };
      ctx.save(); ctx.strokeStyle = "#e6eaf0"; ctx.lineWidth = 1; ctx.beginPath(); var sx = mdStep(a1 - a0, 3), sy = mdStep(hi - lo, 3);
      ctx.font = "600 9.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#7b8694"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (v = Math.ceil(a0 / sx - 1e-9) * sx; v <= a1 + 1e-9; v += sx){ ctx.moveTo(X(v), T); ctx.lineTo(X(v), B); ctx.fillText(F(v, sx < 1 ? 1 : 0), X(v), B + 3); }
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; for (v = Math.ceil(lo / sy - 1e-9) * sy; v <= hi + 1e-9; v += sy){ ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.fillText(F(v, sy < 1 ? 1 : 0), L - 4, Y(v)); }
      ctx.stroke(); ctx.strokeStyle = "#a3adba"; ctx.beginPath(); ctx.moveTo(L, T - 2); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      ctx.beginPath(); ctx.rect(L, T - 4, R - L, B - T + 8); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); for (i = 0; i <= 120; i++){ var xx = a0 + (a1 - a0) * i / 120; i ? ctx.lineTo(X(xx), Y(fn(xx))) : ctx.moveTo(X(xx), Y(fn(xx))); } ctx.stroke();
      var ft = fn(t), sl = dfn(t), hw = (a1 - a0) * 0.22; D.line(c, X(t - hw), Y(ft - sl * hw), X(t + hw), Y(ft + sl * hw), P.amber, 2.2); ctx.restore();
      D.dot(c, X(t), Y(ft), 4.8, P.red);
      mdTxt(c, title, b.x + 12, b.y + 15, col, 11, "left", {math: true}); mdTxt(c, sub, b.x + 12, b.y + 28, P.amber, 10, "left"); }
    var lp = k.loop(function(dt){ if (au.value && st.grab !== "crank"){ var T = MD2[ps.value], g0 = geo(), span = T.x1 - T.x0, v = 0.6 / g0.k / span; st.ph += dt * v * st.dir; if (st.ph > 1){ st.ph = 1; st.dir = -1; } if (st.ph < 0){ st.ph = 0; st.dir = 1; } xs.set(T.x0 + span * (0.02 + 0.96 * st.ph)); } k.redraw(); });
    c.pointer(function(t, p){ var T = MD2[ps.value], g0 = geo();
      if (t === "down"){ st.grab = "view"; st.px = p.x; st.py = p.y;
        if (crank && Math.hypot(p.x - crank[0], p.y - crank[1]) < 26) st.grab = "crank";
        else { var q = unpr(p.x, p.y, ZA + TH / 2); if (q && Math.hypot(q[0] - O[0][0], q[1] - O[0][1]) < g0.mA.rmax1 + 0.05) st.grab = "crank"; }
        if (p.y > sceneH) st.grab = null;
        if (st.grab === "crank"){ var q2 = unpr(p.x, p.y, ZA + TH / 2 + 0.08); st.a0 = q2 ? Math.atan2(q2[1] - O[0][1], q2[0] - O[0][0]) : 0; st.x0 = xs.value; au.set(false); } }
      else if (t === "drag" && st.grab === "view"){ st.yaw += (p.x - st.px) * 0.008; st.pitch = mdCl(st.pitch + (p.y - st.py) * 0.006, 0.35, 1.5); st.px = p.x; st.py = p.y; }
      else if (t === "drag" && st.grab === "crank"){ var q3 = unpr(p.x, p.y, ZA + TH / 2 + 0.08); if (q3){ var an = Math.atan2(q3[1] - O[0][1], q3[0] - O[0][0]), da = an - st.a0; while (da > PI) da -= 2 * PI; while (da < -PI) da += 2 * PI; st.a0 = an; var nx = mdCl(xs.value + da / g0.k, T.x0, T.x1); st.dir = da >= 0 ? 1 : -1; xs.set(nx); st.ph = (nx - T.x0) / (T.x1 - T.x0); } }
      else if (t === "up") st.grab = null;
      if (t === "move") c.cv.style.cursor = crank && Math.hypot(p.x - crank[0], p.y - crank[1]) < 26 ? "grab" : p.y < sceneH ? "move" : "default";
      if (t !== "move") k.redraw(); });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, T = MD2[ps.value], g0 = geo(), x = mdCl(xs.value, T.x0, T.x1), u = T.f(x), y = T.g(u), fp = T.df(x), gp = T.dg(u), kk = g0.k;
      var mob = W < 460, gH = mob ? Math.round(H * 0.42) : Math.round(H * 0.3); sceneH = H - gH; c.clear(); labs = [];
      /* décor : mur d'atelier (panneau perforé) */
      var bg = ctx.createLinearGradient(0, 0, 0, sceneH); bg.addColorStop(0, "#3d4f66"); bg.addColorStop(1, "#24303f"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, sceneH);
      ctx.fillStyle = "rgba(255,255,255,.06)"; for (var py = 14; py < sceneH; py += 18) for (var px = 10 + (py / 18 % 2) * 9; px < W; px += 18){ ctx.beginPath(); ctx.arc(px, py, 1.6, 0, 7); ctx.fill(); }
      camSet(0, 26, W, sceneH - 30);
      /* plateau en bois (boîte) */
      var bx0 = -2.05, bx1 = 2.05, by0 = -1.05, by1 = 1.05, bz0 = -0.1, bz1 = 0, cn = [[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]];
      var sides = [[0, 1], [1, 2], [2, 3], [3, 0]].map(function(e){ var a = cn[e[0]], b = cn[e[1]], m = pr((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, -0.05); return {e: e, dep: m[2]}; }).sort(function(p1, p2){ return p2.dep - p1.dep; });
      sides.forEach(function(sd){ var a = cn[sd.e[0]], b = cn[sd.e[1]], q = [pr(a[0], a[1], bz0), pr(b[0], b[1], bz0), pr(b[0], b[1], bz1), pr(a[0], a[1], bz1)]; ctx.beginPath(); q.forEach(function(v, i){ i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]); }); ctx.closePath(); ctx.fillStyle = "#6b4526"; ctx.fill(); });
      var tq = cn.map(function(v){ return pr(v[0], v[1], bz1); }), wg = ctx.createLinearGradient(tq[0][0], tq[0][1], tq[2][0], tq[2][1]); wg.addColorStop(0, "#d3a56f"); wg.addColorStop(1, "#a57444");
      ctx.beginPath(); tq.forEach(function(v, i){ i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]); }); ctx.closePath(); ctx.fillStyle = wg; ctx.fill();
      ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(90,50,20,.16)"; ctx.lineWidth = 1; for (var gi = 0; gi < 14; gi++){ var yy = by0 + (by1 - by0) * (gi + 0.5) / 14; ctx.beginPath(); for (var xx = bx0; xx <= bx1 + 0.01; xx += 0.2){ var q = pr(xx, yy + 0.02 * Math.sin(xx * 3 + gi), 0); xx === bx0 ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); } ctx.stroke(); } ctx.restore();
      /* rotations des roues */
      var r1 = kk * (x - T.x0), r2 = -kk * (u - g0.u0), r3 = kk * (y - g0.y0);
      shadow(ctx, g0.mB.g1, O[1], r2, ZB); shadow(ctx, g0.mB.g2, O[2], r3, ZB); shadow(ctx, g0.mA.g1, O[0], r1, ZA); shadow(ctx, g0.mA.g2, O[1], r2, ZA);
      /* étage bas : roue 2 (couronne B), roue 3, axe de la roue 1 */
      var low = [{o: O[1], d: function(){ cyl(ctx, 0, 0, 0, ZB - TH / 2, 0.05, "#8e99a8"); gear(ctx, g0.mB.g1, O[1], r2, ZB - TH / 2, ZB + TH / 2, "#93a3b6"); }},
        {o: O[2], d: function(){ cyl(ctx, Dd, 0, 0, ZB - TH / 2, 0.05, "#8e99a8"); gear(ctx, g0.mB.g2, O[2], r3, ZB - TH / 2, ZB + TH / 2, "#c4743f", "3", "#8f4a1f"); }},
        {o: O[0], d: function(){ cyl(ctx, -Dd, 0, 0, ZA - TH / 2, 0.05, "#8e99a8"); }}];
      low.sort(function(a, b){ return pr(b.o[0], b.o[1], 0)[2] - pr(a.o[0], a.o[1], 0)[2]; }).forEach(function(o){ o.d(); });
      /* rayons au contact (étage bas) */
      var cB = g0.mB, rcB = Dd * gp / (1 + gp), pc = pr(rcB, 0, ZB + TH / 2), p2 = pr(0, 0, ZB + TH / 2), p3 = pr(Dd, 0, ZB + TH / 2);
      D.line(c, p2[0], p2[1], pc[0], pc[1], "rgba(244,197,66,.95)", 2.4); D.line(c, pc[0], pc[1], p3[0], p3[1], "rgba(120,220,255,.95)", 2.4); D.glow(c, pc[0], pc[1], 12, "#f4c542", 0.7);
      speedArc(ctx, O[2], ZB + TH / 2, 0.2, fp * gp, st.dir, "#ffcf8a");
      /* étage haut : roue 1 (manivelle), roue 2 (couronne A) */
      cyl(ctx, 0, 0, ZB + TH / 2, ZA - TH / 2, 0.05, "#8e99a8");
      var high = [{o: O[0], d: function(){ gear(ctx, g0.mA.g1, O[0], r1, ZA - TH / 2, ZA + TH / 2, "#cfa64a", "1", "#7a5a12");
          /* manivelle */
          var ca = r1 + PI * 0.75, Lc = Math.min(0.42, g0.mA.rmax1 * 0.9 + 0.12), e = [O[0][0] + Lc * Math.cos(ca), O[0][1] + Lc * Math.sin(ca)], zc = ZA + TH / 2 + 0.07;
          var q0 = pr(O[0][0], O[0][1], zc), q1 = pr(e[0], e[1], zc); ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#3a414b"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke(); ctx.strokeStyle = "#9aa4b1"; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
          cyl(ctx, e[0], e[1], zc, zc + 0.2, 0.055, "#c0392b"); var kt = pr(e[0], e[1], zc + 0.2); crank = kt; D.glow(c, kt[0], kt[1], 18, "#f4c542", 0.35); }},
        {o: O[1], d: function(){ gear(ctx, g0.mA.g2, O[1], r2, ZA - TH / 2, ZA + TH / 2, "#a9b8ca", "2", "#3f4e61"); }}];
      high.sort(function(a, b){ return pr(b.o[0], b.o[1], 0)[2] - pr(a.o[0], a.o[1], 0)[2]; }).forEach(function(o){ o.d(); });
      var rcA = Dd * fp / (1 + fp), qa = pr(-Dd + rcA, 0, ZA + TH / 2), qo1 = pr(-Dd, 0, ZA + TH / 2), qo2 = pr(0, 0, ZA + TH / 2);
      D.line(c, qo1[0], qo1[1], qa[0], qa[1], "rgba(244,197,66,.95)", 2.4); D.line(c, qa[0], qa[1], qo2[0], qo2[1], "rgba(120,220,255,.95)", 2.4); D.glow(c, qa[0], qa[1], 12, "#f4c542", 0.7);
      speedArc(ctx, O[0], ZA + TH / 2, 0.2, 1, st.dir, "#ffe08a"); speedArc(ctx, O[1], ZA + TH / 2, 0.2, fp, -st.dir, "#cfe3ff");
      labs.forEach(function(l){ mdTxt(c, l[0], l[1], l[2], "#fff", 11, "center", {bg: l[3]}); });
      /* vitesses de rotation près des roues (valeurs absolues : les sens alternent) */
      var wl = [["|ω₁| = 1", O[0], ZA, "right", "#7a5a12"], ["|ω₂| = f′(x)", O[1], ZA, "center", "#3f4e61"], ["|ω₃| = g′(f(x))·f′(x)", O[2], ZB, "left", "#8f4a1f"]];
      var wfs = mob ? 9.5 : 10.5, wPlaced = [], yMax = sceneH - (W < 700 ? 32 : 20) - 9; ctx.font = "700 " + wfs + "px Mulish, system-ui, sans-serif";
      /* sous le moyeu, sinon au-dessus ; jamais sur une autre étiquette ni sur la légende du bas */
      wl.forEach(function(it){ var q = pr(it[1][0], it[1][1], it[2] + TH / 2 + 0.05), dx = it[3] === "right" ? 14 : it[3] === "left" ? -14 : 0, tw = ctx.measureText(it[0]).width + 10;
        [q[1] + 20, q[1] - 34, q[1] + 40].some(function(yy){ var x0 = it[3] === "right" ? q[0] + dx - tw : it[3] === "left" ? q[0] + dx : q[0] - tw / 2, r = {x: x0 - 2, y: yy - 10, w: tw + 4, h: 20};
          if (yy > yMax || yy < 34 || r.x < 2 || r.x + r.w > W - 2 || wPlaced.some(function(o){ return r.x < o.x + o.w && o.x < r.x + r.w && r.y < o.y + o.h && o.y < r.y + r.h; })) return false;
          wPlaced.push(r); mdTxt(c, it[0], q[0] + dx, yy, "#fff", wfs, it[3], {bg: "rgba(20,28,40,.78)"}); return true; }); });
      /* bandeau du haut : les trois valeurs */
      var chips = [["1", "x = " + F(x, 3), "#7a5a12"], ["2", "u = " + T.fn + " = " + F(u, 3), "#3f4e61"], ["3", "y = " + T.gn + " = " + F(y, 3), "#8f4a1f"]];
      ctx.font = "700 11px Mulish, system-ui, sans-serif"; var tot = 0, ws = chips.map(function(ch){ var wv = ctx.measureText(ch[1]).width + 30; tot += wv; return wv; }), gap = 6, sc = Math.min(1, (W - 12 - gap * 2) / tot), cx0 = (W - (tot * sc + gap * 2)) / 2;
      chips.forEach(function(ch, i){ var wv = ws[i] * sc; ctx.save(); D.rrect(c, cx0, 5, wv, 20, 10); ctx.fillStyle = "rgba(255,255,255,.93)"; ctx.fill(); ctx.restore(); D.dot(c, cx0 + 10, 15, 7, ch[2]); mdTxt(c, ch[0], cx0 + 10, 15.5, "#fff", 9.5); mdTxt(c, ch[1], cx0 + 21, 15, ch[2], sc < 1 ? 10 : 11, "left"); cx0 += wv + gap; });
      var cap1 = "rayons au contact : r₁/r₂ = f′(x)", cap2 = "flèches : vitesses (les sens alternent, seules les vitesses comptent)";
      if (W < 700){ mdTxt(c, cap1, W / 2, sceneH - 23, "#e9eef5", mob ? 9.5 : 10.5, "center", {halo: "rgba(20,28,40,.8)"}); mdTxt(c, cap2, W / 2, sceneH - 9, "#e9eef5", mob ? 9.5 : 10.5, "center", {halo: "rgba(20,28,40,.8)"}); }
      else mdTxt(c, cap1 + "  ·  " + cap2, W / 2, sceneH - 10, "#e9eef5", 10.5, "center", {halo: "rgba(20,28,40,.8)"});
      /* graphes */
      var gy = sceneH, b1, b2, b3; ctx.fillStyle = "#eef2f7"; ctx.fillRect(0, gy, W, gH);
      if (mob){ var hh = gH / 2; b1 = {x: 0, y: gy, w: W / 2, h: hh}; b2 = {x: W / 2, y: gy, w: W / 2, h: hh}; b3 = {x: 0, y: gy + hh, w: W, h: gH - hh}; }
      else { b1 = {x: 0, y: gy, w: W / 3, h: gH}; b2 = {x: W / 3, y: gy, w: W / 3, h: gH}; b3 = {x: 2 * W / 3, y: gy, w: W - 2 * W / 3, h: gH}; }
      mini(b1, T.f, T.df, T.x0, T.x1, x, "u = f(x) = " + T.fn, "pente f′(x) = " + F(fp, 3), "#5a6f8c");
      mini(b2, T.g, T.dg, g0.u0, T.f(T.x1), u, "y = g(u) = " + T.gn, "pente g′(u) = " + F(gp, 3), "#8f4a1f");
      mini(b3, function(t){ return T.g(T.f(t)); }, function(t){ return T.dg(T.f(t)) * T.df(t); }, T.x0, T.x1, x, "y = g(f(x))", "pente = " + F(gp, 3) + " × " + F(fp, 3) + " ≈ " + F(gp * fp, 3), "#24775a");
      ro.set(0, F(x, 3) + " → " + F(u, 3) + " → " + F(y, 3)); ro.set(1, F(fp, 3)); ro.set(2, F(gp, 3)); ro.set(3, F(gp * fp, 3));
      var extra = ps.value === "rac" ? " Ici g(f(x)) = √(x²) = x : la roue 3 suit exactement la roue 1, alors que la roue 2 accélère et ralentit." : ps.value === "aff" ? " Fonctions affines : rapports constants, ce sont des engrenages ordinaires (roues rondes)." : "";
      nt.set("Roue 2 : f′(x) = " + F(fp, 3) + " fois la vitesse de la roue 1. Roue 3 : g′(f(x)) = g′(" + F(u, 3) + ") = " + F(gp, 3) + " fois la vitesse de la roue 2. Donc (g ∘ f)′(" + F(x, 3) + ") = " + F(gp, 3) + " × " + F(fp, 3) + " ≈ " + F(gp * fp, 3) + "." + extra, "");
    });
    lp.play();
  }
});

/* =====================================================================
   3 ---- L'élasticité de la demande : quand baisser le prix rapporte ----
   ===================================================================== */
/* repère simple dans une boîte : graduations « rondes », jamais de pas nul */
function mdAx(c, b, x0, x1, y0, y1, xl, yl, o){ o = o || {}; var ctx = c.ctx, L = b.x + (o.l || 40), R = b.x + b.w - (o.r || 12), T = b.y + (o.t || 18), B = b.y + b.h - (o.b || 22), ax = {L: L, R: R, T: T, B: B};
  ax.X = function(x){ return L + (x - x0) / (x1 - x0) * (R - L); }; ax.Y = function(y){ return B - (y - y0) / (y1 - y0) * (B - T); }; ax.ix = function(px){ return x0 + (px - L) / (R - L) * (x1 - x0); };
  var sx = mdStep(x1 - x0, o.nx || 5), sy = mdStep(y1 - y0, o.ny || 4), v, n = 0; ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "#edf0f4"; ctx.beginPath();
  ctx.font = "600 9.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#7b8694"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (v = Math.ceil(x0 / sx - 1e-9) * sx; v <= x1 + 1e-9 && n < 60; v += sx, n++){ ctx.moveTo(ax.X(v), T); ctx.lineTo(ax.X(v), B); if (!o.noXlab && (!xl || ax.X(v) < R - 34)) ctx.fillText(F(v, sx < 1 ? 1 : 0), ax.X(v), B + 3); }
  ctx.textAlign = "right"; ctx.textBaseline = "middle"; n = 0;
  for (v = Math.ceil(y0 / sy - 1e-9) * sy; v <= y1 + 1e-9 && n < 60; v += sy, n++){ ctx.moveTo(L, ax.Y(v)); ctx.lineTo(R, ax.Y(v)); ctx.fillText(mdBig(v, sy < 1 ? 1 : 0), L - 4, ax.Y(v)); }
  ctx.stroke(); ctx.strokeStyle = "#9aa5b3"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(L, T - 4); ctx.lineTo(L, B); ctx.lineTo(R + 4, B); ctx.stroke();
  ctx.font = "700 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(yl, L + 6, T - 3);
  if (xl){ ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(xl, R + 4, B + 3); } ctx.restore(); return ax; }
/* un client (silhouette en volume) ; s = échelle, ph = phase du balancement */
function mdPerson(ctx, x, y, s, col, skin, ph, al){ if (al <= 0.02) return; ctx.save(); ctx.globalAlpha = al; var b = Math.sin(ph) * 1.5 * s;
  ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(x, y, 9 * s, 2.6 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#2f3542"; ctx.fillRect(x - 5 * s, y - 15 * s, 3.6 * s, 15 * s); ctx.fillRect(x + 1.4 * s, y - 15 * s, 3.6 * s, 15 * s);
  var g = ctx.createLinearGradient(x - 8 * s, 0, x + 8 * s, 0); g.addColorStop(0, mdShade(col, 1.25)); g.addColorStop(1, mdShade(col, 0.7));
  ctx.fillStyle = g; D.rrect({ctx: ctx}, x - 7.5 * s, y - 33 * s + b, 15 * s, 20 * s, 6 * s); ctx.fill();
  var hg = ctx.createRadialGradient(x - 2 * s, y - 40 * s + b, 1, x, y - 38 * s + b, 7 * s); hg.addColorStop(0, mdShade(skin, 1.2)); hg.addColorStop(1, mdShade(skin, 0.8));
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(x, y - 38.5 * s + b, 5.8 * s, 0, 7); ctx.fill();
  ctx.fillStyle = "#3b2a1e"; ctx.beginPath(); ctx.arc(x, y - 40 * s + b, 5.9 * s, PI * 1.05, PI * 1.95); ctx.fill(); ctx.restore(); }
SFA.sim({
  id: "ma-elasticite-demande", ch: "c03", tag: "Élasticité",
  titre: "L'élasticité de la demande : quand baisser le prix rapporte",
  resume: "Un marchand règle le prix de ses barquettes de fraises : la demande et le rectangle de recette p × q changent ensemble. L'élasticité-prix dit si une hausse de prix augmente ou fait baisser la recette totale ; la recette est maximale quand elle vaut −1.",
  but: "Laisse le marchand essayer des prix, ou glisse le point sur un des graphes (ou l'ardoise, de haut en bas). Sur la courbe de demande, la partie verte est inélastique et la partie rouge élastique ; en bas, la recette totale R(p) = p · D(p). Règle la hausse de prix testée pour lire les variations en pourcentage.",
  aRetenir: "Élasticité-prix de la demande : e(p) = p · D′(p) / D(p), un nombre sans unité ; e = −2 signifie que la demande recule d'environ 2 % quand le prix monte de 1 %. |e| < 1 : demande inélastique, monter le prix augmente la recette totale. |e| > 1 : demande élastique, monter le prix fait perdre de la recette. La recette R(p) = p · D(p) est maximale là où e = −1 (élasticité unitaire), car R′(p) = D(p) · (1 + e(p)).",
  piege: "L'élasticité n'est pas la pente : sur une droite de demande la pente est constante, mais l'élasticité varie de 0 à −∞ le long de la droite et vaut −1 au milieu. Seule la demande isoélastique D(p) = k · p^(−α) a une élasticité constante (−α).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 1.12}); mdRatio(c, 1.12, 1.5, 0.92); c.cv.style.touchAction = "none";
    var st = {t: 0, grab: null, py: 0, p0: 0, al: [], slate: null, G: null};
    var ms = k.seg("Demande", [["aff", "Affine : D(p) = 200 − 40p"], ["iso", "Isoélastique : D(p) = k · p^(−α)"]], "aff", function(v){ ps.el.min = v === "aff" ? 0.2 : 1; ps.set(mdCl(ps.value, +ps.el.min, 4.8)); as.el.parentNode.style.opacity = v === "iso" ? 1 : 0.45; });
    var ps = k.slider("Prix p de la barquette", 0.2, 4.8, 0.01, 2, "€", function(){ au.set(false); });
    var as = k.slider("α (demande isoélastique)", 0.3, 2.5, 0.05, 0.6, ""); as.el.parentNode.style.opacity = 0.45;
    var rs = k.slider("Hausse de prix testée", 1, 30, 1, 10, "%");
    var au = k.toggle("Le marchand essaie des prix", true, function(v){ if (v) st.t = 0; });
    var ro = k.readouts(["Prix p → demande q = D(p)", "Recette totale R = p · q", "Élasticité-prix e(p)", "Si le prix monte de 10 %"]), nt = k.note("", "");
    function model(){ var a = as.value, kk = 100 * Math.pow(2.5, a);
      if (ms.value === "aff") return {D: function(p){ return Math.max(0, 200 - 40 * p); }, dD: function(){ return -40; }, e: function(p){ return -40 * p / (200 - 40 * p); }, pmin: 0.2, ps: 2.5, qmax: 210, kk: 0, a: 0};
      return {D: function(p){ return kk * Math.pow(p, -a); }, dD: function(p){ return -a * kk * Math.pow(p, -a - 1); }, e: function(){ return -a; }, pmin: 1, ps: Math.abs(a - 1) < 1e-9 ? NaN : null, qmax: kk * 1.18, kk: kk, a: a}; }
    var lp = k.loop(function(dt){ st.t += dt; if (au.value && !st.grab){ var M = model(), lo = M.pmin + 0.4, hi = 4.4; ps.set(Math.round((lo + (hi - lo) * (0.5 - 0.5 * Math.cos(2 * PI * st.t / 16 + 1.2))) * 100) / 100); } k.redraw(); });
    c.pointer(function(t, p){
      if (t === "down"){ st.grab = null; var sl = st.slate; if (sl && p.x > sl.x - 8 && p.x < sl.x + sl.w + 8 && p.y > sl.y - 8 && p.y < sl.y + sl.h + 8){ st.grab = "slate"; st.py = p.y; st.p0 = ps.value; } else if (st.G && p.y > st.G.top) st.grab = "graph"; if (st.grab) au.set(false); }
      if ((t === "down" || t === "drag") && st.grab === "graph"){ ps.set(Math.round(mdCl(st.G.ix(p.x), +ps.el.min, 4.8) * 100) / 100); }
      if (t === "drag" && st.grab === "slate"){ ps.set(Math.round(mdCl(st.p0 + (st.py - p.y) / 40, +ps.el.min, 4.8) * 100) / 100); }
      if (t === "up") st.grab = null;
      if (t === "move"){ var s2 = st.slate; c.cv.style.cursor = (s2 && p.x > s2.x - 8 && p.x < s2.x + s2.w + 8 && p.y > s2.y - 8 && p.y < s2.y + s2.h + 8) ? "ns-resize" : (st.G && p.y > st.G.top) ? "ew-resize" : "default"; }
      if (t !== "move") k.redraw(); });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, M = model(), pr = mdCl(ps.value, M.pmin, 4.8), q = M.D(pr), R = pr * q, e = M.e(pr), r = rs.value / 100, p1 = pr * (1 + r), q1 = M.D(p1), R1 = p1 * q1, dq = (q1 - q) / q * 100, dR = (R1 - R) / R * 100;
      var mob = W < 460, sH = Math.round(H * (mob ? 0.43 : 0.45)), t = st.t; c.clear();
      /* ---- la scène : un étal au marché ---- */
      var sky = ctx.createLinearGradient(0, 0, 0, sH); sky.addColorStop(0, "#cfe3f3"); sky.addColorStop(1, "#f3ead8"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, sH);
      /* façades au loin */
      [[0.02, 0.2, "#e8cfae"], [0.2, 0.12, "#d9b99a"], [0.33, 0.22, "#ecd8bd"], [0.56, 0.15, "#d7c2a8"], [0.72, 0.3, "#e5cfb4"]].forEach(function(f, i){ var bx = f[0] * W, bw = f[1] * W, bt = sH * (0.12 + 0.06 * (i % 3)); ctx.fillStyle = f[2]; ctx.fillRect(bx, bt, bw, sH * 0.8 - bt);
        ctx.fillStyle = "rgba(90,110,140,.35)"; for (var wy = bt + 10; wy < sH * 0.62; wy += 22) for (var wx = bx + 8; wx < bx + bw - 12; wx += 20) ctx.fillRect(wx, wy, 9, 12); });
      var gy = Math.round(sH * 0.9), pav = ctx.createLinearGradient(0, gy - sH * 0.12, 0, sH); pav.addColorStop(0, "#b9aa94"); pav.addColorStop(1, "#8f8270"); ctx.fillStyle = pav; ctx.fillRect(0, gy - sH * 0.12, W, sH - gy + sH * 0.12);
      ctx.strokeStyle = "rgba(60,50,40,.22)"; ctx.lineWidth = 1; for (var pv = 0; pv < 4; pv++){ var yy = gy - sH * 0.12 + pv * sH * 0.05; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      /* étal */
      var sx0 = W * 0.04, sw = W * (mob ? 0.6 : 0.56), tt = sH * 0.64, aw0 = sH * 0.03, aw1 = sH * 0.13;
      ctx.fillStyle = "#6b4a2c"; ctx.fillRect(sx0 + 6, aw0, 6, gy - aw0); ctx.fillRect(sx0 + sw - 12, aw0, 6, gy - aw0);
      /* marchand (derrière la table) */
      var vx = sx0 + sw * 0.36, vy = tt, wave = Math.sin(t * 2.2) * 0.12, sk = "#e8b48a", hs = Math.min(1.1, sH / 255);
      ctx.save(); var ag = ctx.createLinearGradient(vx - 22 * hs, 0, vx + 22 * hs, 0); ag.addColorStop(0, "#2f6f4f"); ag.addColorStop(1, "#1d4a33");
      ctx.fillStyle = ag; D.rrect(c, vx - 20 * hs, vy - 58 * hs, 40 * hs, 62 * hs, 12 * hs); ctx.fill();
      ctx.fillStyle = "#f4efe4"; D.rrect(c, vx - 13 * hs, vy - 44 * hs, 26 * hs, 48 * hs, 5 * hs); ctx.fill();
      var hg = ctx.createRadialGradient(vx - 4 * hs, vy - 76 * hs, 2, vx, vy - 72 * hs, 15 * hs); hg.addColorStop(0, "#f6cfaa"); hg.addColorStop(1, "#c98e62");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(vx, vy - 72 * hs, 13 * hs, 0, 7); ctx.fill();
      ctx.fillStyle = "#c0392b"; ctx.beginPath(); ctx.ellipse(vx, vy - 83 * hs, 14 * hs, 6 * hs, 0, PI, 0); ctx.fill(); ctx.fillRect(vx - 2 * hs, vy - 86 * hs, 22 * hs, 4 * hs);
      ctx.fillStyle = "#2b1d14"; ctx.beginPath(); ctx.arc(vx - 4.5 * hs, vy - 73 * hs, 1.6 * hs, 0, 7); ctx.arc(vx + 4.5 * hs, vy - 73 * hs, 1.6 * hs, 0, 7); ctx.fill();
      ctx.strokeStyle = "#7a3b22"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(vx, vy - 68 * hs, 5 * hs, 0.15 * PI, 0.85 * PI); ctx.stroke();
      /* bras qui montre l'ardoise */
      var shx = vx + 17 * hs, shy = vy - 50 * hs, an = -0.55 + wave, ex = shx + 24 * hs * Math.cos(an), ey = shy + 24 * hs * Math.sin(an) + 10 * hs;
      ctx.lineCap = "round"; ctx.strokeStyle = "#245a40"; ctx.lineWidth = 9 * hs; ctx.beginPath(); ctx.moveTo(shx, shy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = sk; ctx.lineWidth = 7 * hs; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + 18 * hs, ey - 12 * hs); ctx.stroke(); ctx.restore();
      /* table et caisses de fraises */
      var tg = ctx.createLinearGradient(0, tt, 0, gy); tg.addColorStop(0, "#a8743f"); tg.addColorStop(1, "#7a4f28"); ctx.fillStyle = tg; ctx.fillRect(sx0, tt, sw, gy - tt);
      ctx.fillStyle = "#c48b50"; ctx.fillRect(sx0 - 4, tt - 6, sw + 8, 8);
      ctx.strokeStyle = "rgba(60,35,15,.3)"; for (var pl = 1; pl < 4; pl++){ ctx.beginPath(); ctx.moveTo(sx0, tt + pl * (gy - tt) / 4); ctx.lineTo(sx0 + sw, tt + pl * (gy - tt) / 4); ctx.stroke(); }
      var cw = sw * 0.17, ch = Math.min(22, sH * 0.09);
      for (var cr = 0; cr < 3; cr++){ var cx1 = sx0 + sw * 0.05 + cr * (cw + 4), cy1 = tt - 6 - ch; if (cr === 2) cx1 = sx0 + sw * 0.05 + 0.5 * (cw + 4), cy1 -= ch * 0.7;
        if (cr === 2 && mob) continue;
        ctx.fillStyle = "#d9b47e"; ctx.fillRect(cx1, cy1, cw, ch); ctx.strokeStyle = "#8a6233"; ctx.lineWidth = 1; ctx.strokeRect(cx1 + 0.5, cy1 + 0.5, cw - 1, ch - 1);
        for (var bb = 0; bb < 7; bb++){ var bx2 = cx1 + 4 + (bb % 4) * (cw - 8) / 3.2, by2 = cy1 + 2 - (bb < 4 ? 0 : 3) + (bb >= 4 ? 0 : 1); ctx.fillStyle = "#d42a2a"; ctx.beginPath(); ctx.arc(bx2 + (bb >= 4 ? (cw - 8) / 6.4 : 0), by2, 3.3, 0, 7); ctx.fill(); ctx.fillStyle = "#3f8f3f"; ctx.fillRect(bx2 - 1 + (bb >= 4 ? (cw - 8) / 6.4 : 0), by2 - 4.5, 2.4, 2); } }
      /* auvent rayé */
      var nS = 9, swd = (sw + 20) / nS; for (var si = 0; si < nS; si++){ var ax0 = sx0 - 10 + si * swd, grd = ctx.createLinearGradient(0, aw0, 0, aw1); grd.addColorStop(0, si % 2 ? "#fff6ec" : "#d8382e"); grd.addColorStop(1, si % 2 ? "#e9dccb" : "#a8241d");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.moveTo(ax0 + 6, aw0); ctx.lineTo(ax0 + swd + 6, aw0); ctx.lineTo(ax0 + swd, aw1); ctx.arc(ax0 + swd / 2, aw1, swd / 2, 0, PI); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.fillRect(sx0 - 10, aw1 + swd / 2, sw + 20, 5);
      /* ardoise du prix (à glisser) */
      var slw = Math.min(92, sw * 0.32), slh = slw * 0.62, slx = sx0 + sw - slw - 10, sly = tt - slh - 10;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; ctx.fillStyle = "#8a6233"; ctx.fillRect(slx - 4, sly - 4, slw + 8, slh + 8); ctx.restore();
      ctx.fillStyle = "#26302b"; ctx.fillRect(slx, sly, slw, slh); ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.fillRect(slx, sly, slw, slh * 0.4);
      mdTxt(c, mdEur(pr) + " €", slx + slw / 2, sly + slh * 0.42, "#f7f3e8", Math.round(slw * 0.24), "center", {w: 800});
      mdTxt(c, "la barquette", slx + slw / 2, sly + slh * 0.8, "#cfd8d2", Math.max(9.5, slw * 0.11), "center", {w: 600});
      st.slate = {x: slx, y: sly, w: slw, h: slh}; D.line(c, slx + slw / 2 - 10, sly + slh + 6, slx + slw / 2 - 16, tt - 6, "#6b4a2c", 3); D.line(c, slx + slw / 2 + 10, sly + slh + 6, slx + slw / 2 + 16, tt - 6, "#6b4a2c", 3);
      /* caisse : recette du jour */
      D.display(c, mdBig(R, 0) + " €", sx0 + sw * 0.3, tt + (gy - tt) * 0.5, {w: Math.min(118, sw * 0.42), h: Math.min(44, (gy - tt) * 0.78), caption: "RECETTE / JOUR", color: "#13233a"});
      /* clients : un personnage pour 10 barquettes (24 au plus) */
      var nP = Math.min(24, Math.round(q / 10)), qx0 = sx0 + sw + 14, qw = W - qx0 - 8, cols = mob ? 6 : 8, rows = 3, cl = ["#3d6fb6", "#c25b8a", "#e0a030", "#5a9a6a", "#8a64c0", "#d06a3a", "#4a9ab0", "#b04a4a"], sks = ["#e8b48a", "#c68a5e", "#8d5a3b", "#f1c9a5"];
      for (var j = 0; j < 24; j++){ st.al[j] = st.al[j] || 0; st.al[j] += ((j < nP ? 1 : 0) - st.al[j]) * 0.18; }
      for (var rw = rows - 1; rw >= 0; rw--) for (var cc = 0; cc < cols; cc++){ var id = rw * cols + cc; if (id >= 24) continue; var scl = (0.62 + 0.16 * (rows - 1 - rw)) * Math.min(1.2, sH / 230), qx = qx0 + (cc + 0.5 + (rw % 2) * 0.35) * qw / (cols + 0.4), qy = gy - rw * 11 * scl - 2;
        mdPerson(ctx, qx, qy, scl, cl[id % 8], sks[(id * 3) % 4], t * 3 + id * 1.3, st.al[id]); }
      if (24 * 10 < q) mdTxt(c, "+ " + mdBig(Math.round(q / 10) - 24, 0), W - 22, gy - 70, "#2c3a4e", 10, "center", {bg: "rgba(255,255,255,.85)"});
      var pTxt = "1 personnage = 10 barquettes", pSz = mob ? 9.5 : 10; ctx.font = "700 " + pSz + "px Mulish, system-ui, sans-serif"; var pW = ctx.measureText(pTxt).width + 12;
      mdTxt(c, pTxt, mdCl(qx0 + qw / 2, pW / 2 + 4, W - pW / 2 - 4), Math.min(sH - 9, (gy + sH) / 2 + 1), "#2c3a4e", pSz, "center", {bg: "rgba(255,255,255,.85)"});
      var dTxt = (mob ? "q = " : "demande : ") + mdBig(q, 1) + " barquettes / jour", dSz = mob ? 9.5 : 11; ctx.font = "700 " + dSz + "px Mulish, system-ui, sans-serif"; var dW = ctx.measureText(dTxt).width + 12;
      mdTxt(c, dTxt, mdCl(qx0 + qw / 2, dW / 2 + 4, W - dW / 2 - 4), sH * 0.09, "#2c3a4e", dSz, "center", {bg: "rgba(255,255,255,.88)"});
      /* ---- graphes : demande et recette ---- */
      var top = sH; st.G = {top: top}; ctx.fillStyle = "#fff"; ctx.fillRect(0, top, W, H - top);
      var h1 = Math.round((H - top) * 0.54), b1 = {x: 0, y: top, w: W, h: h1}, b2 = {x: 0, y: top + h1, w: W, h: H - top - h1};
      var a1 = mdAx(c, b1, 0, 5, 0, M.qmax, "p (€)", "q = D(p)  (barquettes / jour)", {l: 40, t: 22, b: 20, noXlab: false}), Dp = M.D;
      st.G.ix = a1.ix;
      /* zones d'élasticité colorées le long de la courbe */
      ctx.save(); ctx.beginPath(); ctx.rect(a1.L, a1.T - 2, a1.R - a1.L, a1.B - a1.T + 4); ctx.clip();
      ctx.fillStyle = "rgba(244,197,66,.28)"; ctx.fillRect(a1.X(0), a1.Y(q), a1.X(pr) - a1.X(0), a1.Y(0) - a1.Y(q)); ctx.strokeStyle = "rgba(194,106,12,.8)"; ctx.lineWidth = 1.3; ctx.strokeRect(a1.X(0), a1.Y(q), a1.X(pr) - a1.X(0), a1.Y(0) - a1.Y(q));
      D.line(c, a1.X(pr), a1.Y(q), a1.X(p1), a1.Y(q), "rgba(90,100,115,.7)", 1.2, [3, 3]); D.line(c, a1.X(p1), a1.Y(q), a1.X(p1), a1.Y(q1), "rgba(90,100,115,.7)", 1.2, [3, 3]); D.dot(c, a1.X(p1), a1.Y(q1), 3.5, "#5f6b7a");
      ctx.lineWidth = 3.4; ctx.lineCap = "round"; for (var i = 0; i < 200; i++){ var pa = M.pmin + (5 - M.pmin) * i / 200, pb = M.pmin + (5 - M.pmin) * (i + 1) / 200, ee = M.e((pa + pb) / 2); if (M.D(pb) <= 0 && M.D(pa) <= 0) continue;
        ctx.strokeStyle = Math.abs(ee) < 1 - 1e-9 ? "#24775a" : Math.abs(ee) > 1 + 1e-9 ? "#c0321d" : "#6236c4"; ctx.beginPath(); ctx.moveTo(a1.X(pa), a1.Y(Dp(pa))); ctx.lineTo(a1.X(pb), a1.Y(Math.max(0, Dp(pb)))); ctx.stroke(); }
      ctx.restore();
      if (ms.value === "aff"){ D.line(c, a1.X(2.5), a1.T, a1.X(2.5), a1.B, "rgba(98,54,196,.55)", 1.3, [5, 4]); D.dot(c, a1.X(2.5), a1.Y(100), 4.5, P.violet); }
      D.dot(c, a1.X(pr), a1.Y(q), 6, P.red);
      var rLab = "R = p × q = " + mdBig(R, 0) + " €"; ctx.font = "800 11px Mulish, system-ui, sans-serif"; var rw2 = ctx.measureText(rLab).width + 12;
      if (a1.X(pr) - a1.X(0) > rw2 + 6 && a1.Y(0) - a1.Y(q) > 26) mdTxt(c, rLab, (a1.X(0) + a1.X(pr)) / 2, (a1.Y(0) + a1.Y(q)) / 2, "#8a4b08", 11, "center", {bg: "rgba(255,255,255,.8)"});
      var eLab = "e = " + F(e, 2), ex2 = a1.X(pr) + 10, ey2 = a1.Y(q) - 12; ctx.font = "800 11.5px Mulish, system-ui, sans-serif"; var ew = ctx.measureText(eLab).width + 12; if (ex2 + ew > a1.R) ex2 = a1.X(pr) - 10 - ew; if (ey2 < a1.T + 8) ey2 = a1.T + 8;
      mdTxt(c, eLab, ex2, ey2, Math.abs(e) < 0.995 ? P.green : Math.abs(e) > 1.005 ? P.red : P.violet, 11.5, "left", {bg: "rgba(255,255,255,.92)"});
      /* légende des régimes */
      var lg = [["#24775a", "inélastique : |e| < 1"], ["#c0321d", "élastique : |e| > 1"]]; ctx.font = "700 10px Mulish, system-ui, sans-serif"; var lwm = Math.max(ctx.measureText(lg[0][1]).width, ctx.measureText(lg[1][1]).width), lgx = a1.R - lwm - 4;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.9)"; D.rrect(c, lgx - 26, a1.T - 2, lwm + 32, 34, 6); ctx.fill(); ctx.restore();
      lg.forEach(function(it, li){ var ly = a1.T + 7 + li * 15; D.line(c, lgx - 20, ly, lgx - 6, ly, it[0], 3.4); mdTxt(c, it[1], lgx, ly, it[0], 10, "left"); });
      /* recette totale R(p) */
      var Rf = function(p){ return p * Math.max(0, M.D(p)); }, rmax = 0; for (i = 0; i <= 120; i++) rmax = Math.max(rmax, Rf(M.pmin + (5 - M.pmin) * i / 120));
      var a2 = mdAx(c, b2, 0, 5, 0, rmax * 1.2, "p (€)", "R(p) = p · D(p)  (€)", {l: 40, t: 20, b: 20});
      ctx.save(); ctx.beginPath(); ctx.rect(a2.L, a2.T, a2.R - a2.L, a2.B - a2.T); ctx.clip(); ctx.strokeStyle = "#c26a0c"; ctx.lineWidth = 2.8; ctx.beginPath();
      for (i = 0; i <= 200; i++){ var pp = M.pmin + (5 - M.pmin) * i / 200; i ? ctx.lineTo(a2.X(pp), a2.Y(Rf(pp))) : ctx.moveTo(a2.X(pp), a2.Y(Rf(pp))); } ctx.stroke(); ctx.restore();
      if (ms.value === "aff"){ D.line(c, a2.X(2.5), a2.T, a2.X(2.5), a2.B, "rgba(98,54,196,.55)", 1.3, [5, 4]); D.dot(c, a2.X(2.5), a2.Y(250), 5, P.violet);
        mdTxt(c, "max 250 € (e = −1)", a2.X(2.5) + 8, a2.B - 10, P.violet, 10.5, "left", {bg: "rgba(255,255,255,.9)"}); }
      var sl2 = (Rf(pr + 1e-4) - Rf(pr - 1e-4)) / 2e-4, hw = 0.45; ctx.save(); ctx.beginPath(); ctx.rect(a2.L, a2.T, a2.R - a2.L, a2.B - a2.T); ctx.clip(); D.line(c, a2.X(pr - hw), a2.Y(R - sl2 * hw), a2.X(pr + hw), a2.Y(R + sl2 * hw), "rgba(36,119,90,.75)", 2, [5, 3]); ctx.restore();
      /* prix augmenté p(1 + r) sur la courbe de recette */
      ctx.save(); ctx.beginPath(); ctx.rect(a2.L, a2.T, a2.R - a2.L, a2.B - a2.T); ctx.clip(); D.line(c, a2.X(pr), a2.Y(R), a2.X(p1), a2.Y(R1), "rgba(90,100,115,.7)", 1.2, [3, 3]); D.dot(c, a2.X(p1), a2.Y(R1), 4, "#5f6b7a"); ctx.restore();
      D.dot(c, a2.X(pr), a2.Y(R), 6, P.red);
      /* lectures */
      ro.set(0, mdEur(pr) + " € → " + mdBig(q, 1) + " barquettes");
      ro.set(1, mdBig(R, 0) + " €");
      var reg = Math.abs(e + 1) < 0.005 ? "unitaire" : Math.abs(e) < 1 ? "inélastique" : "élastique";
      ro.set(2, F(e, 3) + " (" + reg + ")");
      ro.el.querySelectorAll("small")[3].textContent = "Si le prix monte de " + rs.value + " %";
      ro.set(3, "q\u00a0" + mdPct(dq) + ", R\u00a0" + mdPct(dR));
      var txt = "e(" + mdEur(pr) + ") = " + F(e, 3) + " : quand le prix monte de 1 %, la demande recule d'environ " + F(Math.abs(e), 2) + " %. ";
      if (reg === "unitaire" && ms.value === "iso") txt += "α = 1 : élasticité unitaire partout, la recette R = p · D(p) = k = " + mdBig(M.kk, 0) + " € ne dépend pas du prix.";
      else if (reg === "unitaire") txt += "Élasticité unitaire : la recette totale est maximale (" + mdBig(R, 0) + " €) ; ni hausse ni baisse du prix ne l'augmente.";
      else if (reg === "inélastique") txt += "Demande inélastique : pour une petite hausse, la hausse de prix l'emporte sur la baisse de quantité, la recette augmente. Le marchand a intérêt à monter son prix pour augmenter sa recette" + (ms.value === "aff" ? " (jusqu'à 2,50 €)." : ".") +
        (dR < 0 ? " Mais une hausse de " + rs.value + " % porte le prix à " + mdEur(p1) + " €, au-delà de 2,50 € : la recette baisse (" + F(dR, 2) + " %). L'élasticité ne prédit que l'effet d'une petite variation." : "");
      else txt += "Demande élastique : les clients fuient plus vite (en pourcentage) que le prix ne monte, la recette baisse. Le marchand a intérêt à baisser son prix pour augmenter sa recette" + (ms.value === "aff" ? " (jusqu'à 2,50 €)." : ".");
      if (ms.value === "iso" && reg !== "unitaire") txt += " Demande isoélastique : e = −α = " + F(-M.a, 2) + " partout, la recette varie toujours dans le même sens" + (Math.abs(M.a - 1) < 1e-9 ? " (ici α = 1 : recette constante)." : ".");
      nt.set(txt, reg === "unitaire" ? "ok" : reg === "inélastique" ? "" : "warn");
    });
    lp.play();
  }
});

})();
