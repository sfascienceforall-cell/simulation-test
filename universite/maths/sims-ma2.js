/* Mathématiques BA1 · chapitre 13 « Suites et séries » (lot MB, novembre 2026)
   ma-suite-bande-epsilon · ma-etau-gendarmes · ma-series-sommes-partielles
   Fichier autonome : toutes les aides sont préfixées mb, rien d'externe. */
(function(){
var D = SFA.draw, F = SFA.fmt, TAU = 2 * Math.PI;
var MBC = {ink:"#0f1b2d", blue:"#1e3f8f", sky:"#3b82f6", red:"#b42318", green:"#2e6b55", lime:"#15803d", amber:"#B45309", gold:"#f4c542", grey:"#5f6b7a", light:"#e3e7ed", violet:"#5B21B6", teal:"#0f766e", orange:"#ea7a1a"};
var MBFONT = "Mulish, system-ui, -apple-system, 'Segoe UI', sans-serif";
function mbFx(x, d){ return F(x, d == null ? 2 : d); }
var MBSUB = {"0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆", "7":"₇", "8":"₈", "9":"₉"};
function mbSub(n){ return String(n).replace(/[0-9]/g, function(c){ return MBSUB[c]; }); }
/* canevas : rapport largeur/hauteur différent sur téléphone (jamais de hauteur nulle : largeur ≥ 260 dans le moteur) */
function mbRatio(c, wide, tall){ var r0 = c.resize; c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < 560) ? tall : wide; r0(); }; c.resize(); }
function mbRR(ctx, x, y, w, h, r){ r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath(); }
function mbRGB(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; }
function mbShade(h, f, a){ var c = Array.isArray(h) ? h : mbRGB(h), m = function(v){ return Math.max(0, Math.min(255, Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f))); }; return "rgba(" + m(c[0]) + "," + m(c[1]) + "," + m(c[2]) + "," + (a == null ? 1 : a) + ")"; }
/* bille en volume : dégradé radial, reflet, ombre portée facultative */
function mbBall(ctx, x, y, r, col, shadowY){
  if (!isFinite(x) || !isFinite(y)) return;
  if (shadowY != null){ ctx.save(); ctx.fillStyle = "rgba(15,27,45,.16)"; ctx.beginPath(); ctx.ellipse(x + r * 0.25, shadowY, r * 1.05, r * 0.32, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.12, x, y, r);
  g.addColorStop(0, mbShade(col, 1.75)); g.addColorStop(0.45, mbShade(col, 1)); g.addColorStop(1, mbShade(col, 0.55));
  ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  if (r > 3){ ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.42, r * 0.28, r * 0.17, -0.6, 0, TAU); ctx.fill(); }
  ctx.restore();
}
/* personnage dessiné (pieds en (x, y), hauteur h) : o = {coat, pants, cap, helmet, stripes, walk, phase, dir, hold} */
function mbPerson(ctx, x, y, h, o){
  o = o || {}; var s = h / 100, ph = o.phase || 0, sw = o.walk ? Math.sin(ph) : 0, coat = o.coat || "#2563eb";
  if (!(s > 0) || !isFinite(x) || !isFinite(y)) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.dir || 1), s);
  ctx.fillStyle = "rgba(15,27,45,.22)"; ctx.beginPath(); ctx.ellipse(0, 0, 21, 5, 0, 0, TAU); ctx.fill();
  ctx.translate(0, o.walk ? -Math.abs(Math.cos(ph)) * 2.5 : 0);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  /* jambes et chaussures */
  ctx.strokeStyle = o.pants || "#1f2a3d"; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(-4, -46); ctx.lineTo(-4 + sw * 9, -5); ctx.moveTo(4, -46); ctx.lineTo(4 - sw * 9, -5); ctx.stroke();
  ctx.fillStyle = "#141a24"; ctx.beginPath(); ctx.ellipse(-1 + sw * 9, -3.5, 7.5, 3.8, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(7 - sw * 9, -3.5, 7.5, 3.8, 0, 0, TAU); ctx.fill();
  /* bras arrière */
  ctx.strokeStyle = mbShade(coat, 0.7); ctx.lineWidth = 7.5;
  ctx.beginPath(); ctx.moveTo(-9, -76); ctx.lineTo(-11 - sw * 7, -50); ctx.stroke();
  /* buste */
  var g = ctx.createLinearGradient(-14, 0, 14, 0); g.addColorStop(0, mbShade(coat, 1.3)); g.addColorStop(0.55, mbShade(coat, 1)); g.addColorStop(1, mbShade(coat, 0.68));
  mbRR(ctx, -13, -84, 26, 42, 9); ctx.fillStyle = g; ctx.fill();
  if (o.stripes){ ctx.save(); mbRR(ctx, -13, -84, 26, 42, 9); ctx.clip(); ctx.fillStyle = "rgba(20,24,32,.78)"; for (var q = 0; q < 5; q++) ctx.fillRect(-14, -80 + q * 8.4, 28, 4); ctx.restore(); }
  if (o.belt){ ctx.fillStyle = "#1b1f27"; ctx.fillRect(-13, -50, 26, 4.5); ctx.fillStyle = o.belt; ctx.fillRect(-2.5, -50.5, 5, 5.5); }
  /* bras avant (ou bras levé qui tient un mât) */
  ctx.strokeStyle = mbShade(coat, 0.85); ctx.lineWidth = 7.5; ctx.beginPath(); ctx.moveTo(8, -76);
  if (o.hold) ctx.lineTo(19, -68); else ctx.lineTo(10 + sw * 7, -50);
  ctx.stroke();
  ctx.fillStyle = "#e9b48f"; ctx.beginPath(); ctx.arc(o.hold ? 20 : 10 + sw * 7, o.hold ? -67 : -48, 4, 0, TAU); ctx.fill();
  /* tête */
  var gh = ctx.createRadialGradient(-3, -96, 2, 0, -92, 12); gh.addColorStop(0, "#f8d2b4"); gh.addColorStop(1, "#d99a72");
  ctx.fillStyle = gh; ctx.beginPath(); ctx.arc(0, -93, 11.5, 0, TAU); ctx.fill();
  ctx.fillStyle = "#1b1f27"; ctx.beginPath(); ctx.arc(6, -95, 1.6, 0, TAU); ctx.fill();
  if (o.cap){ /* képi */
    var gc = ctx.createLinearGradient(-11, 0, 11, 0); gc.addColorStop(0, "#334a8a"); gc.addColorStop(1, "#0f1d45");
    ctx.fillStyle = gc; ctx.beginPath(); ctx.moveTo(-11, -100); ctx.lineTo(-10, -113); ctx.lineTo(10, -113); ctx.lineTo(11, -100); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#d4a72c"; ctx.fillRect(-11, -103.5, 22, 3);
    ctx.fillStyle = "#0b1430"; ctx.beginPath(); ctx.ellipse(9, -100, 8, 2.6, 0.15, 0, TAU); ctx.fill();
  } else if (o.helmet){
    ctx.fillStyle = o.helmet; ctx.beginPath(); ctx.arc(0, -98, 12.5, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillRect(-14, -99, 28, 3); ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.ellipse(-4, -105, 4, 2, -0.4, 0, TAU); ctx.fill();
  } else { ctx.fillStyle = o.hair || "#3b2a20"; ctx.beginPath(); ctx.arc(-1, -96, 11.5, Math.PI * 1.02, Math.PI * 1.95); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
/* étiquette sur pastille, police réduite jusqu'à tenir dans maxW */
function mbTag(c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = o.size || 12, mw = o.maxW || 1e9;
  ctx.save(); while (size > 8){ ctx.font = (o.weight || 800) + " " + size + "px " + (o.math ? "'STIX Two Text', 'Cambria Math', serif" : MBFONT); if (ctx.measureText(s).width + 10 <= mw) break; size -= 0.5; } ctx.restore();
  D.text(c, s, x, y, {size:size, color:o.color || MBC.ink, align:o.align || "center", base:o.base, weight:o.weight || 800, math:o.math, bg:o.bg === false ? null : (o.bg || "rgba(255,255,255,.92)"), halo:o.bg === false ? (o.halo || true) : null});
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px " + (o.math ? "'STIX Two Text', 'Cambria Math', serif" : MBFONT); var w = ctx.measureText(s).width + 10; ctx.restore(); return w;
}
var MBSUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
/* très petits nombres en notation scientifique (2,98·10⁻⁸) pour ne jamais afficher un faux « 0 » */
function mbNum(x, d){ if (x !== 0 && isFinite(x) && Math.abs(x) < Math.pow(10, -d) / 2){ var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e); if (Math.abs(m) >= 9.995){ m /= 10; e += 1; } return F(m, 2) + "·10" + String(e).replace(/[-0-9]/g, function(ch){ return MBSUP[ch]; }); } return F(x, d); }
/* décimales de sₙ : assez pour que sₙ ne s'affiche jamais égal à S */
function mbDig(sv, Sm, d0){ if (Sm == null) return d0; var g = Math.abs(Sm - sv); return g > 0 ? Math.max(d0, Math.min(12, Math.ceil(-Math.log10(g)) + 1)) : d0; }
function mbNice(span, n){ var raw = span / Math.max(1, n), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
function mbHide(ctl){ return function(show){ var e = ctl.el ? ctl.el.parentNode : null; if (e) e.style.display = show ? "" : "none"; }; }

/* ======================================================================================
   1. Converger : la bande ε et le rang N
   ====================================================================================== */
var SQ1 = {
  inv:{nom:"uₙ = 1 + 1/n", f:function(n){ return 1 + 1 / n; }, L:1, inv:function(r){ return Math.ceil(1 / r - 1e-9); }, lo:0.55, hi:2.15, maj:"⌈1/ε⌉", exact:true},
  alt:{nom:"uₙ = 1 + 1,5·(−1)ⁿ/n (alternée amortie)", f:function(n){ return 1 + 1.5 * (n % 2 ? -1 : 1) / n; }, L:1, inv:function(r){ return Math.ceil(1.5 / r - 1e-9); }, lo:-0.65, hi:2.05, maj:"⌈1,5/ε⌉", exact:true},
  geo:{nom:"uₙ = 1 − 0,8ⁿ (géométrique)", f:function(n){ return 1 - Math.pow(0.8, n); }, L:1, inv:function(r){ return Math.max(1, Math.ceil(Math.log(r) / Math.log(0.8) - 1e-9)); }, lo:0, hi:1.4, maj:"⌈ln ε / ln 0,8⌉", exact:true},
  sin:{nom:"uₙ = 1 + sin(n)/√n (bruit amorti)", f:function(n){ return 1 + Math.sin(n) / Math.sqrt(n); }, L:1, inv:function(r){ return Math.ceil(1 / (r * r) - 1e-9); }, lo:0.35, hi:2.05, maj:"⌈1/ε²⌉", exact:false},
  osc:{nom:"uₙ = (−1)ⁿ (aucune limite)", f:function(n){ return n % 2 ? -1 : 1; }, L:null, lo:-1.75, hi:1.75}
};
var MB_CAP = 200000;
/* plus petit N tel que |uₙ − u| ≤ ε pour tout n ≥ N (null s'il n'existe pas) */
function mbFindN(sq, u, eps){
  var tol = 1e-9, bad = function(n){ return Math.abs(sq.f(n) - u) > eps + tol; }, n;
  if (sq.L == null) return (!bad(1) && !bad(2)) ? {N:1} : {N:null, why:"osc"};
  var d = Math.abs(u - sq.L), r = eps - d, M, edge = false;
  if (r < -tol) return {N:null, why:"far", d:d};
  if (r <= tol){ M = MB_CAP; edge = true; } else M = Math.min(MB_CAP, sq.inv(r));
  /* au-delà de M, |uₙ − u| ≤ |uₙ − ℓ| + |ℓ − u| ≤ majorant + d ≤ ε : on ne cherche le dernier terme hors bande qu'avant M */
  for (n = M; n >= 1; n--) if (bad(n)) break;
  if (edge && n > MB_CAP / 2) return {N:null, why:"edge", d:d};
  return {N:n + 1, d:d};
}
function mbFirstBad(sq, u, eps, from, to){ for (var n = from; n <= to; n++) if (Math.abs(sq.f(n) - u) > eps + 1e-9) return n; return null; }

SFA.sim({
  id:"ma-suite-bande-epsilon", ch:"c13", titre:"Converger : la bande ε et le rang N", tag:"Définition ε-N",
  resume:"Les termes tombent comme des billes ; tu resserres la bande ε autour de la limite et tu vois le rang N reculer : N dépend de ε.",
  but:"Les termes de la suite tombent un à un sur le panneau. Attrape un bord de la bande verte pour changer ε, ou la tige du milieu pour tester une autre limite u. Le drapeau marque le plus petit rang N à partir duquel toutes les billes restent dans la bande. Lance « Resserrer ε » : plus la bande est fine, plus N est grand. En mode défi, c'est toi qui plantes le drapeau.",
  aRetenir:"uₙ → u signifie : ∀ε > 0, ∃N, ∀n ≥ N : |uₙ − u| ≤ ε. La tolérance ε est imposée, le rang N se choisit ensuite et dépend de ε. Ce qui se passe avant N ne compte pas. La limite est unique : un autre candidat finit toujours par sortir d'une bande assez fine.",
  piege:"Trouver un N pour un ε ne prouve rien : il en faut un pour chaque ε > 0. Une suite bornée comme (−1)ⁿ tient dans une bande large (ε ≥ 1) mais dans aucune bande plus fine : elle ne converge pas.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.74}); mbRatio(c, 0.74, 1.12);
    var st = {nv:30, carX:null, rain:{t:0, next:1, last:-1, start:[]}, t:0, drag:null, hover:null, Nu:4, auto:false, autoDir:-1, cache:"", res:null, scan:0};
    var sel = k.select("Suite étudiée", Object.keys(SQ1).map(function(key){ return [key, SQ1[key].nom]; }), "inv", function(){ var sq = SQ1[sel.value]; su.el.min = sq.lo + 0.1; su.el.max = sq.hi - 0.1; su.set(sq.L == null ? 0 : sq.L); se.el.max = sq.L == null ? 1.2 : 0.6; se.set(Math.min(se.value, +se.el.max)); relaunch(); });
    var se = k.slider("Tolérance ε (demi-largeur de la bande)", 0.01, 0.6, 0.005, 0.15, "", function(){ st.auto = false; });
    var su = k.slider("Limite testée u", SQ1.inv.lo + 0.1, SQ1.inv.hi - 0.1, 0.01, 1, "");
    var td = k.toggle("Défi : je plante le drapeau N moi-même", false, function(v){ if (v) st.Nu = 2; });
    var lp = k.loop(function(dt){ step(dt); k.redraw(); });
    var bAuto = k.button("▶ Resserrer ε", function(){ st.auto = !st.auto; bAuto.textContent = st.auto ? "⏸ Arrêter" : "▶ Resserrer ε"; }, true);
    k.button("Relancer la chute", function(){ relaunch(); });
    k.button("u = vraie limite", function(){ var sq = SQ1[sel.value]; su.set(sq.L == null ? 0 : sq.L); });
    var ro = k.readouts(["Tolérance ε", "Limite testée u", "Rang N", "Écart |u_N − u|", "N par la majoration"]);
    var nt = k.note("", "ok");
    var roLab = ro.el.querySelectorAll("small");
    function relaunch(){ st.rain = {t:0, next:1, last:-1, start:[]}; st.carX = null; }
    function getRes(){ var key = sel.value + "|" + se.value + "|" + su.value; if (key !== st.cache){ st.cache = key; st.res = mbFindN(SQ1[sel.value], su.value, se.value); } return st.res; }
    function step(dt){
      st.t += dt;
      if (st.auto){ var e = se.value * Math.exp(st.autoDir * 0.55 * dt); if (e < 0.02){ e = 0.02; st.autoDir = 1; } if (e > 0.45){ e = 0.45; st.autoDir = -1; } se.set(e); }
      var res = getRes(), tgt = res.N ? Math.ceil(res.N * 1.3) + 4 : 30; if (td.value) tgt = Math.max(tgt, st.Nu + 8);
      tgt = Math.max(22, Math.min(120, tgt)); st.nv += (tgt - st.nv) * Math.min(1, dt * 2.5);
      var nmax = Math.floor(st.nv + 0.5), R = st.rain, gap = Math.max(0.025, Math.min(0.13, 2.6 / nmax));
      R.t += dt; while (R.next <= nmax && (R.last < 0 || R.t >= R.last + gap)){ R.start[R.next] = R.t; R.last = Math.max(R.t, R.last + gap); R.next++; }
      st.scan += dt;
    }
    function hit(pp){
      var g = c._g; if (!g) return null;
      if (pp.x < g.L - 30 || pp.x > g.R + 8 || pp.y < g.T - 8 || pp.y > g.B + 6) return null;
      var u = su.value, e = se.value, dT = Math.abs(pp.y - g.Y(u + e)), dB = Math.abs(pp.y - g.Y(u - e)), dU = Math.abs(pp.y - g.Y(u));
      if (td.value && Math.abs(pp.x - g.post) < 12 && pp.y > g.T) return "N";
      var m = Math.min(dT, dB, dU); if (m > 11) return null;
      if (m === dU && dU < dT - 0.5 && dU < dB - 0.5) return "u";
      return "e";
    }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, pp){
      var g = c._g;
      if (t === "down"){ st.drag = hit(pp); if (st.drag) st.auto = false, bAuto.textContent = "▶ Resserrer ε"; }
      else if (t === "move"){ var h = hit(pp); c.cv.style.cursor = h === "N" ? "ew-resize" : h ? "ns-resize" : "default"; }
      else if (t === "drag" && st.drag && g){
        var v = g.iy(pp.y);
        if (st.drag === "e") se.set(Math.max(0.01, Math.min(+se.el.max, Math.round(Math.abs(v - su.value) / 0.005) * 0.005)));
        else if (st.drag === "u") su.set(Math.round(v * 100) / 100);
        else st.Nu = Math.max(1, Math.min(Math.floor(st.nv + 0.5), Math.round(g.ix(pp.x) + 0.5)));
        k.redraw();
      }
      else if (t === "up") st.drag = null;
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, sq = SQ1[sel.value], eps = se.value, u = su.value, res = getRes(), defi = td.value;
      var nmax = Math.floor(st.nv + 0.5), gy = H - Math.max(50, Math.round(H * 0.14));
      var L = 44, R = W - 14, T = 48, B = gy - 26, lo = sq.lo, hi = sq.hi;
      var X = function(n){ return L + (n - 0.5) / st.nv * (R - L); }, Y = function(v){ return B - (v - lo) / (hi - lo) * (B - T); };
      var stepPx = (R - L) / st.nv, N = res.N, post = defi ? X(st.Nu) - stepPx / 2 : (N ? X(N) - stepPx / 2 : null);
      c._g = {L:L, R:R, T:T, B:B, Y:Y, iy:function(py){ return lo + (B - py) / (B - T) * (hi - lo); }, ix:function(px){ return (px - L) / (R - L) * st.nv + 0.5; }, post:post};
      c.clear();
      /* décor : mur, sol, panneau en bois */
      var gw = ctx.createLinearGradient(0, 0, 0, gy); gw.addColorStop(0, "#e8eef6"); gw.addColorStop(1, "#d6dfeb"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, gy);
      var gf = ctx.createLinearGradient(0, gy, 0, H); gf.addColorStop(0, "#c9b79a"); gf.addColorStop(1, "#a8926f"); ctx.fillStyle = gf; ctx.fillRect(0, gy, W, H - gy);
      ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(0, gy, W, 2);
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.28)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
      mbRR(ctx, 6, 6, W - 12, gy - 8, 10); var gb = ctx.createLinearGradient(0, 6, 0, gy); gb.addColorStop(0, "#b7895a"); gb.addColorStop(1, "#8a6038"); ctx.fillStyle = gb; ctx.fill(); ctx.restore();
      mbRR(ctx, 13, 13, W - 26, gy - 22, 6); var gp = ctx.createLinearGradient(0, 13, 0, gy); gp.addColorStop(0, "#fbfcfe"); gp.addColorStop(1, "#eef2f7"); ctx.fillStyle = gp; ctx.fill();
      /* grille et axes */
      ctx.save(); ctx.beginPath(); ctx.rect(L, T - 4, R - L, B - T + 8); ctx.clip();
      var sy = mbNice(hi - lo, 7), v; ctx.strokeStyle = "#e6ebf2"; ctx.lineWidth = 1; ctx.beginPath();
      for (v = Math.ceil(lo / sy) * sy; v <= hi + 1e-9; v += sy){ ctx.moveTo(L, Math.round(Y(v)) + 0.5); ctx.lineTo(R, Math.round(Y(v)) + 0.5); } ctx.stroke();
      /* zone n ≥ N */
      if (post != null){ ctx.fillStyle = defi ? "rgba(180,83,9,.06)" : "rgba(21,128,61,.07)"; ctx.fillRect(post, T - 4, R - post, B - T + 8); }
      /* bande ε : plaque de verre */
      var yT = Y(u + eps), yB = Y(u - eps), gg = ctx.createLinearGradient(0, yT, 0, yB);
      gg.addColorStop(0, "rgba(16,185,129,.30)"); gg.addColorStop(0.5, "rgba(16,185,129,.14)"); gg.addColorStop(1, "rgba(16,185,129,.30)");
      ctx.fillStyle = gg; ctx.fillRect(L, yT, R - L, yB - yT);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(L, yT + 2, R - L, Math.min(2, Math.max(0, yB - yT - 4)));
      D.line(c, L, yT, R, yT, "#0f766e", 2); D.line(c, L, yB, R, yB, "#0f766e", 2);
      /* tige de la limite testée */
      var gr = ctx.createLinearGradient(0, Y(u) - 2.5, 0, Y(u) + 2.5); gr.addColorStop(0, "#9aa6b6"); gr.addColorStop(0.5, "#f4f6f9"); gr.addColorStop(1, "#5d6a7c");
      ctx.fillStyle = gr; ctx.fillRect(L, Y(u) - 2.2, R - L, 4.4);
      if (sq.L != null && Math.abs(u - sq.L) > 1e-9){ ctx.setLineDash([5, 4]); D.line(c, L, Y(sq.L), R, Y(sq.L), "rgba(30,63,143,.55)", 1.3, [5, 4]); ctx.setLineDash([]); }
      ctx.restore();
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(L, B + 0.5); ctx.lineTo(R, B + 0.5); ctx.moveTo(L - 0.5, T - 4); ctx.lineTo(L - 0.5, B); ctx.stroke();
      ctx.font = "600 10.5px " + MBFONT; ctx.fillStyle = "#6b7685"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (v = Math.ceil(lo / sy) * sy; v <= hi + 1e-9; v += sy){ var ty = Y(v); if (Math.abs(ty - Y(u)) > 11 && ty > T - 2) ctx.fillText(F(v, 2), L - 5, ty); }
      var sx = st.nv <= 30 ? 5 : st.nv <= 70 ? 10 : 20; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (v = sx; v <= nmax; v += sx){ var tx = X(v); if (tx < R - 16) ctx.fillText(String(v), tx, B + 5); }
      ctx.fillText("1", X(1), B + 5);
      D.text(c, "n", R - 4, B + 11, {size:12, color:"#2c3a4e", align:"right", math:true});
      /* repère u sur l'axe vertical */
      mbTag(c, "u", L - 12, Y(u), {size:12, math:true, color:"#334155", bg:"#e2e8f0"});
      /* rail et chariot qui lâche les billes */
      var railY = 28; ctx.fillStyle = "#7b8796"; ctx.fillRect(L - 6, railY - 2, R - L + 12, 4); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(L - 6, railY - 2, R - L + 12, 1);
      var tgtX = X(Math.min(st.rain.next, nmax)); st.carX = st.carX == null ? tgtX : st.carX + (tgtX - st.carX) * 0.25;
      var cx = st.carX, gc = ctx.createLinearGradient(cx - 13, 0, cx + 13, 0); gc.addColorStop(0, "#f59e0b"); gc.addColorStop(1, "#b45309");
      mbRR(ctx, cx - 13, railY - 13, 26, 11, 3); ctx.fillStyle = gc; ctx.fill();
      ctx.fillStyle = "#334155"; ctx.beginPath(); ctx.arc(cx - 7, railY - 2, 2.6, 0, TAU); ctx.arc(cx + 7, railY - 2, 2.6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(cx - 6, railY + 2); ctx.lineTo(cx + 6, railY + 2); ctx.lineTo(cx + 2.5, railY + 9); ctx.lineTo(cx - 2.5, railY + 9); ctx.closePath(); ctx.fill();
      /* billes */
      var r = Math.max(2.2, Math.min(8.5, stepPx * 0.36)), Rn = st.rain, n, scanN = -1;
      var done = Rn.next > nmax && Rn.t > Rn.last + 1;
      if (done && N && !defi && N <= nmax){ var span = nmax - N + 1; scanN = N + Math.floor((st.scan * Math.max(6, span / 2)) % (span + 6)); }
      for (n = 1; n <= nmax; n++){
        if (Rn.start[n] == null) continue;
        var val = sq.f(n), tyb = Y(val), yb, tau = Rn.t - Rn.start[n], y0 = railY + 10, gacc = 2600, tl = Math.sqrt(2 * Math.max(1, tyb - r - y0) / gacc);
        if (tyb < y0) yb = tyb; else if (tau < tl) yb = y0 + 0.5 * gacc * tau * tau; else { var tt = tau - tl, A = Math.min(16, (tyb - y0) * 0.1); yb = tyb - r - A * Math.exp(-7 * tt) * Math.abs(Math.sin(15 * tt)) + r; }
        if (tau < tl){ mbBall(ctx, X(n), yb, r, "#94a3b8"); continue; }
        var inside = Math.abs(val - u) <= eps + 1e-9, col = inside ? "#16a34a" : "#dc2626";
        if (r >= 4 && tau >= tl){ ctx.fillStyle = "#a16207"; ctx.fillRect(X(n) - r * 0.9, tyb + r - 0.5, r * 1.8, 2.2); }
        if (n === scanN){ D.glow(c, X(n), yb, r * 3, "#fde047", 0.8); }
        mbBall(ctx, X(n), Math.min(yb, B - r), r, col);
        if (defi && n >= st.Nu && !inside){ ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X(n), yb, r + 3.5, 0, TAU); ctx.stroke(); }
      }
      /* étiquettes des bords de la bande (à droite) */
      var lab = function(s, y, base){ if (y < T - 2 || y > B + 2) return; mbTag(c, s, R - 26, y, {size:11.5, math:true, color:"#0f766e", align:"right", base:base, bg:"rgba(240,253,250,.92)"}); };
      var hb = yB - yT;
      if (hb < 30) lab("u ± ε", yT - 3 < T + 12 ? yB + 3 : yT - 3, yT - 3 < T + 12 ? "top" : "bottom");
      else { lab("u + ε", yT - 3 < T + 12 ? yT + 3 : yT - 3, yT - 3 < T + 12 ? "top" : "bottom"); lab("u − ε", yB + 3 > B - 12 ? yB - 3 : yB + 3, yB + 3 > B - 12 ? "bottom" : "top"); }
      /* poignées des bords */
      [yT, yB].forEach(function(yy){ if (yy < T - 4 || yy > B + 4) return; var gh = ctx.createLinearGradient(0, yy - 5, 0, yy + 5); gh.addColorStop(0, "#5eead4"); gh.addColorStop(1, "#0f766e"); mbRR(ctx, R - 20, yy - 5, 18, 10, 5); ctx.fillStyle = gh; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke(); });
      /* poteau N, drapeau et personnage au sol */
      if (post != null && post < R){
        D.line(c, post, T - 4, post, B, defi ? "#b45309" : "#15803d", 1.6, [5, 4]);
        var fy = gy + 4, pole = H - 6;
        ctx.fillStyle = "#6b4f2a"; ctx.fillRect(post - 1.5, fy, 3, pole - fy);
        var fw = mbTag(c, defi ? "ton N = " + st.Nu : "N = " + N, -999, -999, {size:11});
        var right = post + fw + 6 < W - 4, wave = Math.sin(st.t * 5) * 1.5, fx0 = right ? post + 1.5 : post - 1.5 - fw;
        ctx.fillStyle = defi ? "#f59e0b" : "#16a34a"; ctx.beginPath(); ctx.moveTo(fx0, fy); ctx.lineTo(fx0 + fw, fy + wave); ctx.lineTo(fx0 + fw, fy + 16 + wave); ctx.lineTo(fx0, fy + 16); ctx.closePath(); ctx.fill();
        D.text(c, defi ? "ton N = " + st.Nu : "N = " + N, fx0 + fw / 2, fy + 8 + wave / 2, {size:11, color:"#fff", weight:800});
        mbPerson(ctx, right ? post - 13 : post + 13, H - 4, Math.min(50, H - gy - 4), {coat:defi ? "#b45309" : "#1e3f8f", hold:true, dir:right ? 1 : -1});
      }
      if (post != null && post >= R){ var fyy = gy + 4; mbTag(c, "N = " + N + " : plus loin →", W - 16, fyy + 8, {size:11, align:"right", color:"#fff", bg:"#16a34a"}); }
      /* légende en bas, du côté libre */
      var msg = sq.L == null && !N ? "aucun N : (−1)ⁿ ne converge pas" : !N ? "aucun rang N ne convient" : "ε = " + mbFx(eps, 3) + "  →  N = " + N;
      if (defi) msg = "défi : plante le drapeau";
      var leftSide = post == null || post > W / 2, far = post != null && post >= R;
      mbTag(c, msg, leftSide ? 16 : W - 16, far ? H - 14 : gy + (H - gy) / 2, {size:11.5, align:leftSide ? "left" : "right", maxW:(post == null || far ? W - 32 : leftSide ? post - 70 : W - post - 70), color:N ? "#14532d" : "#991b1b"});
      /* lectures */
      ro.set(0, mbFx(eps, 3)); ro.set(1, mbFx(u, 2));
      roLab[2].textContent = defi ? "Ton rang N" : "Rang N (le plus petit)";
      roLab[3].textContent = (defi || N) ? "Écart |u" + mbSub(defi ? st.Nu : N) + " − u|" : "Écart au rang N";
      var Nshow = defi ? st.Nu : N;
      ro.set(2, defi ? String(st.Nu) : N ? String(N) : "aucun");
      ro.set(3, Nshow ? mbFx(Math.abs(sq.f(Nshow) - u), 4) : "—");
      ro.set(4, defi ? "(caché pendant le défi)" : sq.L != null && Math.abs(u - sq.L) < 1e-9 ? (sq.maj + " = " + sq.inv(eps)) : "—");
      var d = sq.L == null ? 0 : Math.abs(u - sq.L), txt, kind = "ok";
      if (defi){
        if (N && st.Nu >= N){ txt = "Gagné : à partir du rang " + st.Nu + ", toutes les billes restent dans la bande. Le plus petit rang qui convient est N = " + N + " ; tout rang plus grand convient aussi."; }
        else { var fb = mbFirstBad(sq, u, eps, st.Nu, N ? N - 1 : st.Nu + 400); kind = "warn"; txt = fb ? "Raté : u" + mbSub(fb) + " = " + mbFx(sq.f(fb), 4) + " est à " + mbFx(Math.abs(sq.f(fb) - u), 4) + " de u, plus que ε = " + mbFx(eps, 3) + ". Recule le drapeau vers la droite." : "Aucun rang ne convient pour cette bande."; if (!N) txt += " Ici, aucun N ne peut marcher : il y a toujours des billes dehors plus loin."; }
      } else if (sq.L == null){
        kind = N ? "warn" : "bad";
        txt = N ? "Avec ε = " + mbFx(eps, 3) + " ≥ 1, la bande est assez large pour contenir 1 et −1 : ce ε-là passe. Mais la définition exige tous les ε : dès que ε < 1, aucune bande de largeur 2ε ne contient à la fois 1 et −1." : "Les termes valent 1 aux rangs pairs et −1 aux rangs impairs. Avec ε < 1, aucune limite u ne garde les deux valeurs dans la bande : (−1)ⁿ est bornée mais ne converge vers aucun réel.";
      } else if (!N){
        kind = "bad"; txt = "u = " + mbFx(u, 2) + " est à " + mbFx(d, 2) + " de la vraie limite 1, plus que ε : à partir d'un certain rang, toutes les billes sortent de la bande. Aucun N ne convient, u n'est pas la limite (elle est unique).";
      } else if (d > 1e-9){
        kind = "warn"; txt = "Pour ε = " + mbFx(eps, 3) + ", u = " + mbFx(u, 2) + " passe le test avec N = " + N + "… mais la définition demande tous les ε : avec ε < " + mbFx(d, 2) + ", plus aucun N ne convient. Seule la vraie limite résiste à toutes les bandes.";
      } else {
        txt = "Avec ε = " + mbFx(eps, 3) + ", tous les termes à partir du rang N = " + N + " sont dans [u − ε ; u + ε]. " + (sq.exact ? "Ici N = " + sq.maj + "." : "La majoration |sin n|/√n ≤ 1/√n donne N = " + sq.inv(eps) + " : un rang valable, pas forcément le plus petit.") + " Resserre ε : N grandit.";
      }
      nt.set(txt, kind);
    });
    lp.play();
  }
});

/* ======================================================================================
   2. Le théorème de l'étau (des gendarmes)
   ====================================================================================== */
var ET2 = {
  sinn:{nom:"−1/n ≤ sin(n)/n ≤ 1/n", v:function(n){ return -1 / n; }, u:function(n){ return Math.sin(n) / n; }, w:function(n){ return 1 / n; }, L:0, nMax:40, lo:-1.1, hi:1.1},
  asym:{nom:"1 − 1/n ≤ 1 − (1 + cos n)/(2n) ≤ 1 + 1/n²", v:function(n){ return 1 - 1 / n; }, u:function(n){ return 1 - (1 + Math.cos(n)) / (2 * n); }, w:function(n){ return 1 + 1 / (n * n); }, L:1, nMax:40, lo:-0.1, hi:2.1},
  rac:{nom:"1 − 1/√n ≤ 1 + sin(3n)/√n ≤ 1 + 1/√n", v:function(n){ return 1 - 1 / Math.sqrt(n); }, u:function(n){ return 1 + Math.sin(3 * n) / Math.sqrt(n); }, w:function(n){ return 1 + 1 / Math.sqrt(n); }, L:1, nMax:60, lo:-0.1, hi:2.1},
  casse:{nom:"−1/n ≤ (1 + sin n)/2 ≤ 1 + 1/n (un gendarme part ailleurs)", v:function(n){ return -1 / n; }, u:function(n){ return (1 + Math.sin(n)) / 2; }, w:function(n){ return 1 + 1 / n; }, L:null, Lv:0, Lw:1, nMax:40, lo:-1.1, hi:2.1}
};
var EF2 = {
  x2:{nom:"−x² ≤ x²·sin(1/x) ≤ x², quand x → 0", v:function(x){ return -x * x; }, u:function(x){ return x * x * Math.sin(1 / x); }, w:function(x){ return x * x; }, L:0, x0:1, lo:-1.1, hi:1.1, delta:function(e){ return Math.sqrt(e); }, ds:"√ε"},
  sinc:{nom:"cos x ≤ sin(x)/x ≤ 1, quand x → 0", v:function(x){ return Math.cos(x); }, u:function(x){ return Math.sin(x) / x; }, w:function(){ return 1; }, L:1, x0:2, lo:-0.6, hi:1.3, delta:function(e){ return Math.acos(1 - e); }, ds:"arccos(1 − ε)"},
  casse:{nom:"−1 ≤ sin(1/x) ≤ 1, quand x → 0 (l'étau ne se ferme pas)", v:function(){ return -1; }, u:function(x){ return Math.sin(1 / x); }, w:function(){ return 1; }, L:null, Lv:-1, Lw:1, x0:1, lo:-1.25, hi:1.25}
};
/* rang à partir duquel g(n) reste dans [ℓ − ε ; ℓ + ε] (dernier rang hors bande + 1, cherché jusqu'à 100 000) */
function mbRank(g, L, eps){ for (var n = 100000; n >= 1; n--) if (Math.abs(g(n) - L) > eps + 1e-9) return n + 1; return 1; }
function mbTree(ctx, P, a, b, s){
  var f = P(a, b, 0), t = P(a, b, 1.1 * s), hp = f.y - t.y, rr = 0.55 * s * f.k;
  ctx.fillStyle = "rgba(15,27,45,.16)"; ctx.beginPath(); ctx.ellipse(f.x + rr * 0.3, f.y, rr * 1.1, rr * 0.4, 0, 0, TAU); ctx.fill();
  if (hp > 6){ ctx.strokeStyle = "#6b4423"; ctx.lineWidth = Math.max(2, rr * 0.28); ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y); ctx.stroke(); }
  var cx = t.x, cy = hp > 6 ? t.y : f.y, g = ctx.createRadialGradient(cx - rr * 0.35, cy - rr * 0.4, rr * 0.1, cx, cy, rr);
  g.addColorStop(0, "#7cc576"); g.addColorStop(1, "#2f6b33"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.fill();
}
SFA.sim({
  id:"ma-etau-gendarmes", ch:"c13", titre:"Le théorème de l'étau (des gendarmes)", tag:"Théorème de l'étau",
  resume:"Deux gendarmes vₙ et wₙ encadrent un suspect uₙ sur une route : s'ils arrivent à la même borne ℓ, le suspect y est conduit.",
  but:"Sur la route, la position de chaque marcheur en travers de la route est la valeur de sa suite, et le rang n avance avec ses pas : les traces dessinent les trois suites. Fais tourner la route à la souris, ou passe en vue de dessus : c'est le graphe. Règle ε : le drapeau marque le rang N à partir duquel les deux gendarmes sont dans la bande ℓ ± ε, et le suspect avec eux. Choisis « un gendarme part ailleurs » pour voir ce qui casse, ou l'onglet Fonctions.",
  aRetenir:"Si vₙ ≤ uₙ ≤ wₙ pour tout n ≥ N₀, et si vₙ → ℓ et wₙ → ℓ, alors uₙ → ℓ. Preuve : pour ε > 0, vₙ est dans la bande ℓ ± ε dès le rang N₁, wₙ dès le rang N₂ ; on prend N = max(N₀ ; N₁ ; N₂) ; pour n ≥ N, ℓ − ε ≤ vₙ ≤ uₙ ≤ wₙ ≤ ℓ + ε. Même énoncé pour les fonctions : g(x) ≤ f(x) ≤ h(x) près de a, g et h → ℓ, alors f(x) → ℓ.",
  piege:"Vérifie que les deux gendarmes ont la même limite : si l'un tend vers 0 et l'autre vers 1, le théorème ne dit rien. Vérifie aussi l'encadrement vₙ ≤ uₙ ≤ wₙ. Tu n'as pas à calculer uₙ : le théorème te dit à la fois que la limite existe et qu'elle vaut ℓ.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.66}); mbRatio(c, 0.66, 0.95);
    var st = {t:0, hold:0, az:0.24, el:1.0, taz:0.24, tel:1.0, paused:false, drag:null, cache:"", NN:null};
    var mode = k.seg("Objet", [["s", "Suites"], ["f", "Fonctions"]], "s", function(){ showSel(); restart(); });
    var ss = k.select("Encadrement", Object.keys(ET2).map(function(key){ return [key, ET2[key].nom]; }), "sinn", function(){ restart(); });
    var sf = k.select("Encadrement (fonctions)", Object.keys(EF2).map(function(key){ return [key, EF2[key].nom]; }), "x2", function(){ restart(); });
    var se = k.slider("Tolérance ε (bande autour de ℓ)", 0.02, 0.5, 0.01, 0.2, "");
    var sv = k.slider("Vitesse de marche", 0.5, 6, 0.5, 2, " rangs/s");
    var vue = k.seg("Vue", [["3d", "Route en 3D"], ["top", "Vue de dessus (graphe)"]], "3d", function(v){ if (v === "top"){ st.taz = 0; st.tel = Math.PI / 2; } else { st.taz = 0.24; st.tel = 1.0; } });
    var lp = k.loop(function(dt){ step(dt); k.redraw(); });
    k.button("↺ Recommencer la marche", function(){ restart(); st.paused = false; bp.textContent = "⏸ Pause"; }, true);
    var bp = k.button("⏸ Pause", function(){ st.paused = !st.paused; bp.textContent = st.paused ? "▶ Reprendre" : "⏸ Pause"; });
    var ro = k.readouts(["Rang n", "vₙ (gendarme du bas)", "uₙ (suspect)", "wₙ (gendarme du haut)", "Écart wₙ − vₙ", "Rang N pour ε"]);
    var roLab = ro.el.querySelectorAll("small"), nt = k.note("", "ok");
    function showSel(){ mbHide(ss)(mode.value === "s"); mbHide(sf)(mode.value === "f"); }
    showSel();
    function restart(){ st.t = 0; st.hold = 0; }
    function cur(){ return mode.value === "s" ? ET2[ss.value] : EF2[sf.value]; }
    function step(dt){
      st.az += (st.taz - st.az) * Math.min(1, dt * 4); st.el += (st.tel - st.el) * Math.min(1, dt * 4);
      if (st.paused) return;
      var E = cur(), dur = mode.value === "s" ? (E.nMax - 1) / sv.value : 6 / (sv.value / 2);
      if (st.t < dur) st.t = Math.min(dur, st.t + dt); else { st.hold += dt; if (st.hold > 2.2) restart(); }
    }
    /* N (suites) ou δ (fonctions) pour ε, avec cache */
    function ranks(){
      var E = cur(), key = mode.value + ss.value + sf.value + se.value;
      if (key === st.cache) return st.NN;
      st.cache = key; var e = se.value;
      if (E.L == null) st.NN = null;
      else if (mode.value === "s"){ var a = mbRank(E.v, E.L, e), b = mbRank(E.w, E.L, e), cu = mbRank(E.u, E.L, e); st.NN = {N1:a, N2:b, N:Math.max(a, b), Nu:cu}; }
      else { var d = E.delta(e); st.NN = {delta:d}; }
      return st.NN;
    }
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, pp){
      if (t === "down"){ st.drag = pp; c.cv.style.cursor = "grabbing"; }
      else if (t === "drag" && st.drag){ st.taz = st.az = st.az + (pp.x - st.drag.x) * 0.008; st.tel = st.el = Math.max(0.5, Math.min(Math.PI / 2, st.el + (pp.y - st.drag.y) * 0.008)); st.drag = pp; vue.set(Math.abs(st.el - Math.PI / 2) < 0.02 && Math.abs(st.az) < 0.02 ? "top" : "3d"); k.redraw(); }
      else if (t === "up"){ st.drag = null; c.cv.style.cursor = "grab"; }
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, E = cur(), isS = mode.value === "s", eps = se.value, NN = ranks();
      var Lr = 12, Wr = 3.4, mid = (E.lo + E.hi) / 2, kb = 2 * Wr / (E.hi - E.lo), Dc = 24, hum = 1.8, zf = hum * 1.18 / Math.max(0.25, Math.cos(st.el));
      var B = function(v){ return (v - mid) * kb; };
      var nMax = isS ? E.nMax : 0, A = isS ? function(n){ return (n - 1) / (nMax - 1) * Lr; } : function(x){ return (1 - x / E.x0) * Lr; };
      var ca = Math.cos(st.az), sa = Math.sin(st.az), ce = Math.cos(st.el), se2 = Math.sin(st.el);
      function raw(a, b, z){ var x = a - Lr / 2, X = x * ca - b * sa, Yd = x * sa + b * ca, d = Yd * ce - z * se2, kp = Dc / (Dc + d); return {x:X * kp, y:-(z * ce + Yd * se2) * kp, k:kp, d:d}; }
      /* cadrage automatique : la route, les marcheurs et la porte tiennent toujours dans le cadre */
      var pts = [[-1.1, -Wr - 0.75, 0], [Lr + 1.2, -Wr - 0.75, 0], [-1.1, Wr + 0.5, 0], [Lr + 1.2, Wr + 0.5, 0], [0, -Wr, 0.6], [0, Wr * 0.5, zf], [Lr, Wr * 0.5, zf], [Lr + 0.75, Wr * 0.3, 2.4], [0, Wr + 0.25, 1.75], [Lr, Wr + 0.25, 1.75]], x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      pts.forEach(function(q){ var r = raw(q[0], q[1], q[2]); x0 = Math.min(x0, r.x); x1 = Math.max(x1, r.x); y0 = Math.min(y0, r.y); y1 = Math.max(y1, r.y); });
      var top = 36, bot = 6, Sc = Math.min((W - 16) / (x1 - x0), (H - top - bot) / (y1 - y0)), ox = W / 2 - (x0 + x1) / 2 * Sc, oy = top + (H - top - bot) / 2 - (y0 + y1) / 2 * Sc;
      function P(a, b, z){ var r = raw(a, b, z); return {x:ox + r.x * Sc, y:oy + r.y * Sc, k:r.k * Sc, d:r.d}; }
      c.clear();
      /* décor : pré tondu, brume d'horizon */
      var gg = ctx.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, "#a9d18e"); gg.addColorStop(1, "#6fae5a"); ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = 0.07; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 14; for (var q = -1; q < 12; q++){ var s0 = P(q * 1.2, Wr + 3, 0), s1 = P(q * 1.2, -Wr - 3, 0); ctx.beginPath(); ctx.moveTo(s0.x, s0.y); ctx.lineTo(s1.x, s1.y); ctx.stroke(); } ctx.restore();
      var hz = ctx.createLinearGradient(0, 0, 0, H * 0.35); hz.addColorStop(0, "rgba(226,240,252," + (0.85 * ce).toFixed(3) + ")"); hz.addColorStop(1, "rgba(226,240,252,0)"); ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H * 0.35);
      /* route */
      var c0 = P(-0.4, -Wr, 0), c1 = P(Lr + 0.4, -Wr, 0), c2 = P(Lr + 0.4, Wr, 0), c3 = P(-0.4, Wr, 0);
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y); ctx.closePath();
      var ga = ctx.createLinearGradient(c0.x, c0.y, c2.x, c2.y); ga.addColorStop(0, "#5b6474"); ga.addColorStop(1, "#4a5262"); ctx.fillStyle = ga; ctx.fill(); ctx.restore();
      var ln = function(a0, b0, a1, b1, col, w, dash){ var p0 = P(a0, b0, 0), p1 = P(a1, b1, 0); D.line(c, p0.x, p0.y, p1.x, p1.y, col, w, dash); };
      ln(-0.4, -Wr, Lr + 0.4, -Wr, "#f8fafc", 2.2); ln(-0.4, Wr, Lr + 0.4, Wr, "#f8fafc", 2.2);
      /* graduations en travers (valeurs) */
      var stp = mbNice(E.hi - E.lo, 6), v;
      for (v = Math.ceil(E.lo / stp) * stp; v <= E.hi + 1e-9; v += stp){ ln(-0.4, B(v), Lr + 0.4, B(v), "rgba(255,255,255,.16)", 1); var pl = P(-0.75, B(v), 0); ctx.save(); ctx.font = "800 10.5px " + MBFONT; var gtw = ctx.measureText(F(v, 2)).width; ctx.restore(); D.text(c, F(v, 2), Math.max(pl.x, gtw + 6), pl.y, {size:10.5, color:"#14301a", halo:"rgba(220,240,210,.9)", align:"right"}); }
      /* bande ε autour de ℓ */
      var lim = E.L, aN = null;
      if (lim != null){
        if (isS) aN = NN.N <= nMax ? A(NN.N) - 0.5 * Lr / (nMax - 1) : null; else aN = NN.delta < E.x0 ? A(NN.delta) : 0;
        var quad = function(a0, a1, al){ var q0 = P(a0, B(lim - eps), 0), q1 = P(a1, B(lim - eps), 0), q2 = P(a1, B(lim + eps), 0), q3 = P(a0, B(lim + eps), 0); ctx.fillStyle = "rgba(250,204,21," + al + ")"; ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.lineTo(q3.x, q3.y); ctx.closePath(); ctx.fill(); };
        quad(-0.4, Lr + 0.4, 0.13); if (aN != null) quad(aN, Lr + 0.4, 0.3);
        ln(-0.4, B(lim + eps), Lr + 0.4, B(lim + eps), "rgba(250,204,21,.85)", 1.3, [6, 5]); ln(-0.4, B(lim - eps), Lr + 0.4, B(lim - eps), "rgba(250,204,21,.85)", 1.3, [6, 5]);
        ln(-0.4, B(lim), Lr + 0.4, B(lim), "#fde68a", 1.6, [10, 8]);
      }
      /* bornes de rang */
      if (isS){ var sN = nMax > 45 ? 10 : 5, pa = P(A(nMax - sN), -Wr - 0.5, 0), pb = P(A(nMax), -Wr - 0.5, 0), gap = Math.hypot(pb.x - pa.x, pb.y - pa.y), ml = 1; while (gap * ml < 48 && ml < 8) ml++; sN *= ml; for (var n = sN; n <= nMax; n += sN){ ln(A(n), -Wr, A(n), -Wr + 0.25, "#f8fafc", 2); var pk = P(A(n), -Wr - 0.5, 0); D.text(c, "n = " + n, pk.x, pk.y, {size:10.5, color:"#14301a", halo:"rgba(220,240,210,.9)"}); } }
      else { [1, 0.75, 0.5, 0.25].forEach(function(f){ var xv = E.x0 * f, pk = P(A(xv), -Wr - 0.5, 0); ln(A(xv), -Wr, A(xv), -Wr + 0.25, "#f8fafc", 2); D.text(c, "x = " + F(xv, 2), pk.x, pk.y, {size:10.5, color:"#14301a", halo:"rgba(220,240,210,.9)"}); }); var pz = P(Lr, -Wr - 0.5, 0); D.text(c, "x → 0", pz.x, pz.y, {size:10.5, color:"#14301a", halo:"rgba(220,240,210,.9)"}); }
      /* position courante */
      var dur = isS ? (nMax - 1) / sv.value : 6 / (sv.value / 2), prog = Math.min(1, st.t / dur);
      var nf = isS ? 1 + prog * (nMax - 1) : 0, xf = isS ? 0 : E.x0 * (1 - prog * 0.985), n0 = Math.floor(nf + 1e-9);
      var at = function(g){ if (!isS) return g(xf); var a = g(n0), b = n0 < nMax ? g(n0 + 1) : a, fr = nf - n0, e = fr * fr * (3 - 2 * fr); return a + (b - a) * e; };
      var aCur = isS ? A(nf) : A(xf);
      /* traces : points (suites) ou courbes peintes (fonctions) */
      var foot = function(a, val, col){ var p = P(a, B(val), 0.01), rx = Math.max(2.2, 0.11 * p.k), ry = rx * Math.max(0.3, se2); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 0.8; ctx.stroke(); };
      if (isS){ for (n = 1; n <= n0; n++){ foot(A(n), E.v(n), "#1e3a8a"); foot(A(n), E.w(n), "#1e3a8a"); foot(A(n), E.u(n), "#ea7a1a"); } }
      else {
        var path = function(g, col, w){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; ctx.beginPath(); var m = 900, first = true; for (var i = 0; i <= m; i++){ var qq = i / m, sp = 1 - (1 - qq) * (1 - qq), x = E.x0 * (1 - sp * 0.985); if (x < xf - 1e-12) break; var p = P(A(x), B(g(x)), 0.01); if (first){ ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y); } ctx.stroke(); };
        path(E.v, "#1e3a8a", 2.6); path(E.w, "#1e3a8a", 2.6); path(E.u, "#ea7a1a", 2.2);
      }
      /* arbres au loin (côté opposé) */
      var trees = [0.6, 3.4, 6.2, 9.1, 11.8].map(function(a, i){ return {a:a, b:Wr + 1.5 + (i % 2) * 0.45}; });
      /* porte(s) d'arrivée */
      var gate = function(val, lab){ var b = B(val), g0 = P(Lr + 0.75, b - 0.65, 0), g1 = P(Lr + 0.75, b + 0.65, 0), h0 = P(Lr + 0.75, b - 0.65, 2.0), h1 = P(Lr + 0.75, b + 0.65, 2.0), pw = Math.max(3, 0.16 * g0.k);
        ctx.lineCap = "round"; ctx.strokeStyle = "#8b7355"; ctx.lineWidth = pw; ctx.beginPath(); ctx.moveTo(g0.x, g0.y); ctx.lineTo(h0.x, h0.y); ctx.moveTo(g1.x, g1.y); ctx.lineTo(h1.x, h1.y); ctx.stroke();
        ctx.strokeStyle = "#5b4636"; ctx.lineWidth = pw * 1.2; ctx.beginPath(); ctx.moveTo(h0.x, h0.y); ctx.lineTo(h1.x, h1.y); ctx.stroke();
        /* l'étiquette reste dans le cadre (« lim v = −1 » était coupé à droite) */
        var hm = P(Lr + 0.75, b, 2.35), tw = mbTag(c, lab, -999, -999, {size:11, math:true}), hx = Math.max(tw / 2 + 4, Math.min(W - tw / 2 - 4, hm.x)), hy = Math.max(12, Math.min(H - 12, hm.y));
        mbTag(c, lab, hx, hy, {size:11, math:true, color:"#3b2a1a", bg:"rgba(255,251,235,.95)"}); };
      /* marcheurs (triés par profondeur) */
      var vv = at(E.v), uu = at(E.u), ww = at(E.w), ph = st.t * 9 * (st.paused ? 0 : 1), moving = prog < 1 && !st.paused;
      var dirp = P(aCur + 0.3, 0, 0), dir0 = P(aCur, 0, 0), dir = dirp.x >= dir0.x ? 1 : -1;
      var objs = trees.map(function(tr){ return {d:P(tr.a, tr.b, 0).d, f:function(){ mbTree(ctx, P, tr.a, tr.b, 1); }}; });
      if (E.L != null) objs.push({d:P(Lr + 0.75, B(E.L), 0).d, f:function(){ gate(E.L, "ℓ = " + F(E.L, 2)); }});
      else { objs.push({d:P(Lr + 0.75, B(E.Lv), 0).d, f:function(){ gate(E.Lv, "lim v = " + F(E.Lv, 2)); }}); objs.push({d:P(Lr + 0.75, B(E.Lw), 0).d, f:function(){ gate(E.Lw, "lim w = " + F(E.Lw, 2)); }}); }
      var walker = function(val, o, tok){ return {d:P(aCur, B(val), 0).d, f:function(){ var f0 = P(aCur, B(val), 0), hp = hum * f0.k;
        if (st.el < 1.3){ o.walk = moving; o.phase = ph + (o.off || 0); o.dir = dir; mbPerson(ctx, f0.x, f0.y, hp, o); }
        else { mbBall(ctx, f0.x, f0.y, Math.max(6, 0.2 * f0.k), tok); } }}; };
      objs.push(walker(vv, {coat:"#1e3a8a", cap:true, belt:"#d4a72c", pants:"#14213d", off:0}, "#1e3a8a"));
      objs.push(walker(ww, {coat:"#1e3a8a", cap:true, belt:"#d4a72c", pants:"#14213d", off:1.3}, "#1e3a8a"));
      objs.push(walker(uu, {coat:"#f59e0b", stripes:true, pants:"#3f3f46", off:2.6}, "#ea7a1a"));
      /* corde tendue entre les gendarmes */
      var r0 = P(aCur, B(vv), hum * 0.55), r1 = P(aCur, B(ww), hum * 0.55);
      objs.sort(function(p, q){ return q.d - p.d; });
      var drawnRope = false, ropeD = P(aCur, B((vv + ww) / 2), 0).d;
      objs.forEach(function(o){ if (!drawnRope && o.d < ropeD){ ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r0.x, r0.y); ctx.quadraticCurveTo((r0.x + r1.x) / 2, (r0.y + r1.y) / 2 + 8, r1.x, r1.y); ctx.stroke(); drawnRope = true; } o.f(); });
      /* drapeau N (ou δ) sur le bas-côté */
      if (aN != null){ var f0 = P(aN, Wr + 0.2, 0), f1 = P(aN, Wr + 0.2, 1.6), fl = isS ? "N = " + NN.N : "δ = " + F(NN.delta, 3);
        ctx.strokeStyle = "#5b4636"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(f0.x, f0.y); ctx.lineTo(f1.x, f1.y); ctx.stroke();
        var fw = mbTag(c, fl, -999, -999, {size:11}), wv = Math.sin(st.t * 5) * 1.5, rt = f1.x + fw < W - 4, fx0 = rt ? f1.x : f1.x - fw;
        ctx.fillStyle = "#ca8a04"; ctx.beginPath(); ctx.moveTo(fx0, f1.y); ctx.lineTo(fx0 + fw, f1.y + wv); ctx.lineTo(fx0 + fw, f1.y + 15 + wv); ctx.lineTo(fx0, f1.y + 15); ctx.closePath(); ctx.fill();
        D.text(c, fl, fx0 + fw / 2, f1.y + 7.5 + wv / 2, {size:11, color:"#fff", weight:800}); }
      /* énoncé en haut */
      var hud = E.L != null ? (isS ? "vₙ ≤ uₙ ≤ wₙ et vₙ, wₙ → " + F(E.L, 2) + "  ⇒  uₙ → " + F(E.L, 2) : "g ≤ f ≤ h et g, h → " + F(E.L, 2) + "  ⇒  f(x) → " + F(E.L, 2)) : (isS ? "vₙ → 0 mais wₙ → 1 : l'étau ne se ferme pas" : "g = −1 et h = 1 : l'étau ne se ferme pas");
      mbTag(c, hud, 8, 18, {size:13.5, math:true, align:"left", maxW:W - 16, color:E.L != null ? "#1e293b" : "#991b1b"});
      /* lectures */
      var labs = isS ? ["Rang n", "vₙ (gendarme du bas)", "uₙ (suspect)", "wₙ (gendarme du haut)", "Écart wₙ − vₙ", "Rang N pour ε"] : ["x", "g(x) (gendarme du bas)", "f(x) (suspect)", "h(x) (gendarme du haut)", "Écart h(x) − g(x)", "δ pour ε"];
      labs.forEach(function(s, i){ roLab[i].textContent = s; });
      if (isS){ var nn = Math.max(1, n0); ro.set(0, String(nn)); ro.set(1, mbFx(E.v(nn), 4)); ro.set(2, mbFx(E.u(nn), 4)); ro.set(3, mbFx(E.w(nn), 4)); ro.set(4, mbFx(E.w(nn) - E.v(nn), 4)); ro.set(5, NN ? "max(" + NN.N1 + " ; " + NN.N2 + ") = " + NN.N : "sans objet"); }
      else { ro.set(0, mbFx(xf, 3)); ro.set(1, mbFx(E.v(xf), 4)); ro.set(2, mbFx(E.u(xf), 4)); ro.set(3, mbFx(E.w(xf), 4)); ro.set(4, mbFx(E.w(xf) - E.v(xf), 4)); ro.set(5, NN ? E.ds + " = " + mbFx(NN.delta, 4) : "sans objet"); }
      /* pas de limite commune : le curseur ε n'a pas d'effet, on le grise */
      var noL = E.L == null, seBox = se.el.parentNode; se.el.disabled = noL; if (seBox) seBox.style.opacity = noL ? "0.45" : "";
      var txt, kind = "ok";
      if (noL){ kind = "bad"; txt = (isS ? "Le gendarme du bas va vers 0, celui du haut vers 1 : l'écart wₙ − vₙ ne tend pas vers 0. Le suspect reste coincé entre eux mais erre entre 0 et 1 sans se fixer : le théorème ne s'applique pas, et ici uₙ n'a pas de limite." : "g = −1 et h = 1 ne se rejoignent pas : sin(1/x) oscille de plus en plus vite entre −1 et 1 quand x → 0 et n'a pas de limite. L'étau exige la même limite des deux côtés.") + " Pas de limite ℓ commune : la tolérance ε est sans objet ici (curseur grisé)."; }
      else if (isS){ txt = "Avec ε = " + mbFx(eps, 2) + " : vₙ est dans la bande à partir du rang N₁ = " + NN.N1 + ", wₙ à partir du rang N₂ = " + NN.N2 + ". L'encadrement vaut dès n = 1 (N₀ = 1), donc N = max(N₀ ; N₁ ; N₂) = " + NN.N + " : pour n ≥ N, ℓ − ε ≤ vₙ ≤ uₙ ≤ wₙ ≤ ℓ + ε, le suspect est dans la bande lui aussi" + (NN.Nu < NN.N ? " (il y est même dès le rang " + NN.Nu + ", mais seul l'encadrement le garantit)." : ".") + (NN.N > nMax ? " Ce rang est plus loin que la route dessinée." : ""); }
      else { txt = "Avec ε = " + mbFx(eps, 2) + " : dès que 0 < |x| ≤ δ = " + mbFx(NN.delta, 4) + ", g(x) et h(x) sont à au plus ε de " + F(E.L, 2) + ", donc f(x) aussi. Le suspect est conduit à la porte : f(x) → " + F(E.L, 2) + " quand x → 0. La route ne montre que x > 0 ; pour x < 0, c'est le même calcul."; }
      nt.set(txt, kind);
    });
    lp.play();
  }
});

/* ======================================================================================
   3. Une série, c'est une suite de sommes partielles
   ====================================================================================== */
var SR3 = {
  geo:{nom:"Géométrique : aᵢ = aⁱ (raison a réglable)", t:function(i, r){ return Math.pow(r, i); }, nMax:25},
  harm:{nom:"Harmonique : aᵢ = 1/i", t:function(i){ return 1 / i; }, nMax:60, S:null},
  inv2:{nom:"aᵢ = 1/i²", t:function(i){ return 1 / (i * i); }, nMax:40, S:Math.PI * Math.PI / 6},
  tele:{nom:"Télescopique : aᵢ = 1/(i(i + 1)) = 1/i − 1/(i + 1)", t:function(i){ return 1 / (i * (i + 1)); }, nMax:40, S:1},
  rac:{nom:"aᵢ = 1/√i", t:function(i){ return 1 / Math.sqrt(i); }, nMax:40, S:null}
};
var MB_BR = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
function mbBrick(ctx, x1, x2, yb, h, dx, dy, col, alpha){
  var w = x2 - x1; if (!isFinite(w)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  if (w < 1.2){ ctx.strokeStyle = mbShade(col, 0.7); ctx.lineWidth = Math.max(0.6, w); ctx.beginPath(); ctx.moveTo(x1 + w / 2, yb); ctx.lineTo(x1 + w / 2, yb - h); ctx.lineTo(x1 + w / 2 + dx, yb - h + dy); ctx.stroke(); ctx.restore(); return; }
  var g = ctx.createLinearGradient(0, yb - h, 0, yb); g.addColorStop(0, mbShade(col, 1.25)); g.addColorStop(1, mbShade(col, 0.82));
  ctx.fillStyle = g; ctx.fillRect(x1, yb - h, w, h);
  ctx.fillStyle = mbShade(col, 1.45); ctx.beginPath(); ctx.moveTo(x1, yb - h); ctx.lineTo(x2, yb - h); ctx.lineTo(x2 + dx, yb - h + dy); ctx.lineTo(x1 + dx, yb - h + dy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mbShade(col, 0.6); ctx.beginPath(); ctx.moveTo(x2, yb); ctx.lineTo(x2, yb - h); ctx.lineTo(x2 + dx, yb - h + dy); ctx.lineTo(x2 + dx, yb + dy); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(15,27,45,.28)"; ctx.lineWidth = 0.7; ctx.strokeRect(x1, yb - h, w, h);
  ctx.restore();
}
SFA.sim({
  id:"ma-series-sommes-partielles", ch:"c13", titre:"Une série, c'est une suite de sommes partielles", tag:"Séries",
  resume:"Les termes se posent bout à bout comme des briques sur une règle ; la suite des sommes partielles sₙ converge, diverge ou oscille.",
  but:"Chaque terme aᵢ est une brique de longueur aᵢ posée au bout des précédentes : le marcheur se trouve à la distance sₙ = a₁ + … + aₙ. En bas, les barres orange sont les termes aₙ, les points bleus les sommes partielles sₙ. Choisis la série, règle la raison de la géométrique, ou fais glisser la souris sur le graphe pour choisir n. Compare la géométrique (plafond S) et l'harmonique (pas de plafond).",
  aRetenir:"La somme d'une série est, par définition, la limite de la suite des sommes partielles sₙ = a₁ + a₂ + … + aₙ, quand elle existe. Si la série converge, alors aₙ → 0 ; la réciproque est fausse (série harmonique). Série géométrique : Σ aⁱ (i ≥ 1) = a/(1 − a) si |a| < 1, divergente sinon.",
  piege:"« aₙ → 0 donc la série converge » est faux : les briques de l'harmonique rapetissent, et pourtant le marcheur va aussi loin qu'on veut (s₂ᵏ ≥ 1 + k/2). Ne confonds pas la suite des termes aₙ et la suite des sommes sₙ.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.86}); mbRatio(c, 0.86, 1.28);
    var st = {nf:0, hold:0, paused:false, rlo:null, rhi:null, drag:false, t:0};
    var sel = k.select("Série étudiée", Object.keys(SR3).map(function(key){ return [key, SR3[key].nom]; }), "geo", function(){ showCtl(); restart(); });
    var sa = k.slider("Raison a (géométrique)", -1.2, 1.2, 0.05, 0.5, "", function(){ restart(); });
    var sn = k.slider("Nombre de termes n", 0, 25, 1, 0, "", function(v){ st.paused = true; st.nf = v; bp.textContent = "▶ Lecture"; });
    var tp = k.toggle("Paquets de l'harmonique (chacun pèse au moins ½)", false), tpBox = k.ctrl.lastElementChild;
    var tl = k.toggle("Échelle logarithmique en n (graphe)", false), tlBox = k.ctrl.lastElementChild;
    var lp = k.loop(function(dt){ step(dt); k.redraw(); });
    var bp = k.button("⏸ Pause", function(){ st.paused = !st.paused; if (!st.paused && st.nf >= SR3[sel.value].nMax) restart(); bp.textContent = st.paused ? "▶ Lecture" : "⏸ Pause"; }, true);
    k.button("↺ Recommencer", function(){ restart(); st.paused = false; bp.textContent = "⏸ Pause"; });
    var ro = k.readouts(["Nombre de termes n", "Dernier terme aₙ", "Somme partielle sₙ", "Limite S = lim sₙ", "Reste S − sₙ"]), nt = k.note("", "ok");
    function showCtl(){ var sr = SR3[sel.value]; mbHide(sa)(sel.value === "geo"); tpBox.style.display = tlBox.style.display = sel.value === "harm" ? "" : "none"; sn.el.max = sr.nMax; }
    function restart(){ st.nf = 0; st.hold = 0; st.rlo = st.rhi = null; }
    showCtl();
    function sumS(){ return sel.value === "geo" ? (Math.abs(sa.value) < 1 - 1e-9 ? sa.value / (1 - sa.value) : null) : SR3[sel.value].S; }
    function step(dt){
      st.t += dt; if (st.paused) return;
      var sr = SR3[sel.value], sp = sr.nMax > 45 ? 3.2 : 2.2;
      if (st.nf < sr.nMax) st.nf = Math.min(sr.nMax, st.nf + sp * dt); else { st.hold += dt; if (st.hold > 2.6) restart(); }
      sn.set(Math.floor(st.nf));
    }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, pp){
      var g = c._g; if (!g) return;
      var inG = pp.y > g.top - 6 && pp.x > g.L - 10 && pp.x < g.R + 10;
      if (t === "down" && inG){ st.drag = true; }
      if ((t === "down" || t === "drag") && st.drag){ var n = Math.max(0, Math.min(SR3[sel.value].nMax, Math.round(g.ix(pp.x)))); st.nf = n; st.paused = true; bp.textContent = "▶ Lecture"; sn.set(n); k.redraw(); }
      else if (t === "up") st.drag = false;
      else if (t === "move") c.cv.style.cursor = inG ? "ew-resize" : "default";
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, key = sel.value, sr = SR3[key], r = sa.value, nMax = sr.nMax, Sm = sumS(), i;
      var nf = Math.min(st.nf, nMax), n = Math.floor(nf + 1e-9), p = nf - n, a = [0], s = [0];
      for (i = 1; i <= nMax; i++){ a.push(sr.t(i, r)); s.push(s[i - 1] + a[i]); }
      /* étendue de la règle : tout le chemin pour une série convergente, ce qui a été parcouru sinon (zoom arrière) */
      var upto = Sm != null ? nMax : Math.min(nMax, n + 1), mn = 0, mx = 0;
      for (i = 1; i <= upto; i++){ mn = Math.min(mn, s[i]); mx = Math.max(mx, s[i]); }
      if (Sm != null){ mn = Math.min(mn, Sm); mx = Math.max(mx, Sm); }
      if (mx - mn < 1) mx = mn + 1; var pad = (mx - mn) * 0.08, tlo = mn - (mn < 0 ? pad : 0), thi = mx + pad;
      if (st.rlo == null){ st.rlo = tlo; st.rhi = thi; } else { st.rlo += (tlo - st.rlo) * 0.12; st.rhi += (thi - st.rhi) * 0.12; }
      var rlo = st.rlo, rhi = st.rhi;
      c.clear();
      /* ---- scène : mur, table, règle en bois ---- */
      var H1 = Math.round(H * 0.46), yt = Math.round(H1 * 0.42);
      var gw = ctx.createLinearGradient(0, 0, 0, yt); gw.addColorStop(0, "#eef2f7"); gw.addColorStop(1, "#dde4ee"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, yt);
      var gt = ctx.createLinearGradient(0, yt, 0, H1); gt.addColorStop(0, "#c08a55"); gt.addColorStop(1, "#9a6a3c"); ctx.fillStyle = gt; ctx.fillRect(0, yt, W, H1 - yt);
      ctx.strokeStyle = "rgba(90,55,25,.18)"; ctx.lineWidth = 1; for (i = 0; i < 6; i++){ var yy = yt + (H1 - yt) * (i + 0.5) / 6; ctx.beginPath(); ctx.moveTo(0, yy); ctx.bezierCurveTo(W * 0.3, yy - 3, W * 0.6, yy + 3, W, yy - 1); ctx.stroke(); }
      ctx.fillStyle = "#6e4a28"; ctx.fillRect(0, H1, W, 5);
      var xL = 18, xR = W - 30, yR = H1 - 24, dx = 14, dy = -16, fh = 16;
      var RX = function(v){ return xL + 10 + (v - rlo) / (rhi - rlo) * (xR - xL - 20); };
      ctx.save(); ctx.shadowColor = "rgba(40,20,5,.35)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; ctx.fillStyle = "#e9c46a"; ctx.fillRect(xL, yR, xR - xL, fh); ctx.restore();
      var gr = ctx.createLinearGradient(0, yR, 0, yR + fh); gr.addColorStop(0, "#f6d77d"); gr.addColorStop(1, "#d9a943"); ctx.fillStyle = gr; ctx.fillRect(xL, yR, xR - xL, fh);
      ctx.fillStyle = "#f9e3a3"; ctx.beginPath(); ctx.moveTo(xL, yR); ctx.lineTo(xR, yR); ctx.lineTo(xR + dx, yR + dy); ctx.lineTo(xL + dx, yR + dy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#b98a2e"; ctx.beginPath(); ctx.moveTo(xR, yR); ctx.lineTo(xR + dx, yR + dy); ctx.lineTo(xR + dx, yR + dy + fh); ctx.lineTo(xR, yR + fh); ctx.closePath(); ctx.fill();
      var tk = mbNice(rhi - rlo, Math.max(4, (xR - xL) / 62)), v;
      ctx.strokeStyle = "#5b4210"; ctx.fillStyle = "#3f2d0a"; ctx.font = "700 9.5px " + MBFONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (v = Math.ceil(rlo / (tk / 5)) * (tk / 5); v <= rhi + 1e-9; v += tk / 5){ var xv = RX(v), major = Math.abs(v / tk - Math.round(v / tk)) < 1e-6; ctx.lineWidth = major ? 1.2 : 0.7; ctx.beginPath(); ctx.moveTo(xv, yR); ctx.lineTo(xv, yR + (major ? 6 : 3.5)); ctx.stroke(); if (major && xv > xL + 6 && xv < xR - 6) ctx.fillText(F(v, 3), xv, yR + 11.5); }
      /* plafond S */
      var bh = Math.max(16, Math.min(24, H1 * 0.11)), bdx = 6, bdy = -7, laneB = {x:7, y:-8}, laneF = {x:0, y:-1};
      var wall = function(){ if (Sm == null) return; var xs = RX(Sm), hh = 30; ctx.fillStyle = "rgba(220,38,38,.22)"; ctx.beginPath(); ctx.moveTo(xs, yR); ctx.lineTo(xs + dx, yR + dy); ctx.lineTo(xs + dx, yR + dy - hh); ctx.lineTo(xs, yR - hh); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#b91c1c"; ctx.lineWidth = 1.6; ctx.stroke(); };
      /* briques : termes positifs sur la voie du fond, négatifs sur la voie de devant */
      var col = function(kk){ if (key === "harm" && tp.value){ var pk = kk === 1 ? 0 : Math.ceil(Math.log2(kk) - 1e-9); return MB_BR[pk % MB_BR.length]; } return MB_BR[(kk - 1) % MB_BR.length]; };
      var drawLane = function(pos){ var ln = pos ? laneB : laneF; for (var kk = 1; kk <= Math.min(nMax, n + 1); kk++){ if ((a[kk] >= 0) !== pos) continue; var fr = kk <= n ? 1 : p; if (fr <= 0) continue; var x1 = RX(Math.min(s[kk - 1], s[kk])), x2 = RX(Math.max(s[kk - 1], s[kk])), drop = (1 - fr) * (1 - fr) * 46; mbBrick(ctx, x1 + ln.x, x2 + ln.x, yR + ln.y - drop, bh, bdx, bdy, col(kk), kk <= n ? 1 : Math.min(1, fr * 1.6)); } };
      drawLane(true); wall(); drawLane(false);
      /* le marcheur au bout de la chaîne */
      var sCur = n < nMax ? s[n] + (s[n + 1] - s[n]) * p : s[n], lastPos = n === 0 ? true : a[Math.min(nMax, p > 0 && n < nMax ? n + 1 : n)] >= 0, ln2 = lastPos ? laneB : laneF;
      var hw = Math.max(30, Math.min(58, H1 * 0.27)), wx = Math.max(10, Math.min(W - 10, RX(sCur) + ln2.x + bdx / 2));
      mbPerson(ctx, wx, yR + ln2.y + bdy / 2 - bh + 1, hw, {coat:"#2563eb", helmet:"#facc15", walk:!st.paused && nf < nMax, phase:st.t * 10, dir:(n < nMax ? a[n + 1] : a[n]) >= 0 ? 1 : -1});
      if (Sm != null){ var lbS = (key === "geo" && Math.abs(r) < 1e-9 ? "S = " : key === "geo" && r < 0 ? "limite S = " : "plafond S = ") + mbFx(Sm, 4), twS = mbTag(c, lbS, -999, -999, {size:11.5}), xs2 = RX(Sm) + dx / 2, ty2 = Math.max(yt + 12, yR + dy - 30 - hw * 1.2 - 14), tx2 = xs2, headY = yR + ln2.y + bdy / 2 - bh - hw * 1.15;
        if (ty2 + 10 > headY && Math.abs(tx2 - wx) < twS / 2 + 16) tx2 = wx - twS - 22 > 4 ? wx - twS / 2 - 18 : wx + twS / 2 + 18;
        tx2 = Math.max(twS / 2 + 4, Math.min(W - twS / 2 - 4, tx2));
        D.line(c, xs2, yR + dy - 30, tx2, ty2 + 8, "rgba(185,28,28,.6)", 1, [3, 3]); mbTag(c, lbS, tx2, ty2, {size:11.5, color:"#991b1b", bg:"rgba(254,242,242,.96)"}); }
      /* tableau noir au mur */
      var bwid = Math.min(W - 40, 400), bx0 = (W - bwid) / 2, by0 = 7, bht = yt - 12;
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.3)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; mbRR(ctx, bx0 - 5, by0 - 4, bwid + 10, bht + 8, 5); ctx.fillStyle = "#8a5a2b"; ctx.fill(); ctx.restore();
      var gk = ctx.createLinearGradient(0, by0, 0, by0 + bht); gk.addColorStop(0, "#2f4f3e"); gk.addColorStop(1, "#22392d"); mbRR(ctx, bx0, by0, bwid, bht, 3); ctx.fillStyle = gk; ctx.fill();
      var l1 = "s" + mbSub(n) + " = " + (n <= 3 ? ["", "a₁", "a₁ + a₂", "a₁ + a₂ + a₃"][n] : "a₁ + a₂ + … + a" + mbSub(n)), l2 = "s" + mbSub(n) + " = " + F(s[n], mbDig(s[n], Sm, 4)) + (Sm != null ? "   (S = " + mbFx(Sm, 4) + ")" : "");
      if (n === 0) l1 = "s₀ = 0 (aucune brique)";
      mbTag(c, l1, W / 2, by0 + bht * 0.32, {size:16, math:true, color:"#f1f5f0", bg:false, halo:"#2a4636", maxW:bwid - 10});
      mbTag(c, l2, W / 2, by0 + bht * 0.72, {size:16, math:true, color:"#fde68a", bg:false, halo:"#26402f", maxW:bwid - 10});
      /* ---- graphe : termes (barres) et sommes partielles (points) ---- */
      var gL = 46, gR = W - 12, gT = H1 + 34, gB = H - 22;
      var glo = rlo, ghi = rhi; for (i = 1; i <= upto; i++){ glo = Math.min(glo, a[i]); ghi = Math.max(ghi, a[i]); }
      if (glo < rlo) glo -= (ghi - glo) * 0.04; if (ghi > rhi) ghi += (ghi - glo) * 0.04;
      /* échelle en n : linéaire, ou logarithmique (harmonique seulement) : n = 1 à gL0, n = nMax + 0,6 à gR */
      var logN = key === "harm" && tl.value, lnM = Math.log(nMax + 0.6), gL0 = gL + 10;
      var gX = logN ? function(m){ return gL0 + Math.log(Math.max(1, m)) / lnM * (gR - gL0); } : function(m){ return gL + m / (nMax + 0.6) * (gR - gL); }, gY = function(y){ return gB - (y - glo) / (ghi - glo) * (gB - gT); };
      c._g = {L:gL, R:gR, top:gT, ix:logN ? function(px){ return px < gL0 - 5 ? 0 : Math.exp(Math.max(0, px - gL0) / (gR - gL0) * lnM); } : function(px){ return (px - gL) / (gR - gL) * (nMax + 0.6); }};
      ctx.fillStyle = "#fff"; ctx.fillRect(0, H1 + 5, W, H - H1 - 5);
      var gs = mbNice(ghi - glo, 5); ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1; ctx.beginPath();
      for (v = Math.ceil(glo / gs) * gs; v <= ghi + 1e-9; v += gs){ ctx.moveTo(gL, Math.round(gY(v)) + 0.5); ctx.lineTo(gR, Math.round(gY(v)) + 0.5); } ctx.stroke();
      ctx.font = "600 10.5px " + MBFONT; ctx.fillStyle = "#6b7685"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      /* graduations en y (sauf celle que l'étiquette S, à gauche de l'axe, recouvrirait) */
      var ySm = Sm != null ? gY(Sm) : null;
      for (v = Math.ceil(glo / gs) * gs; v <= ghi + 1e-9; v += gs) if (ySm == null || Math.abs(gY(v) - ySm) >= 12) ctx.fillText(F(v, 3), gL - 5, gY(v));
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      if (logN){
        /* puissances de 2 : en échelle log, elles sont équidistantes (ce sont les bords des paquets) */
        ctx.save(); ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1; ctx.beginPath();
        for (v = 1; v <= nMax; v *= 2){ ctx.moveTo(Math.round(gX(v)) + 0.5, gT); ctx.lineTo(Math.round(gX(v)) + 0.5, gB); } ctx.stroke(); ctx.restore();
        for (v = 1; v <= nMax; v *= 2) if (gX(v) < gR - 16) ctx.fillText(String(v), gX(v), gB + 5);
        mbTag(c, "échelle logarithmique en n", gL + 8, gT + 8, {size:10.5, align:"left", color:"#475569", bg:"rgba(241,245,249,.95)"});
      } else { var xs = nMax > 45 ? 10 : 5; for (v = xs; v <= nMax; v += xs) if (gX(v) < gR - 16) ctx.fillText(String(v), gX(v), gB + 5); }
      D.text(c, "n", gR - 2, gB + 11, {size:12, math:true, color:"#2c3a4e", align:"right"});
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gL, gY(0)); ctx.lineTo(gR, gY(0)); ctx.moveTo(gL, gT); ctx.lineTo(gL, gB); ctx.stroke();
      if (Sm != null){ D.line(c, gL, gY(Sm), gR, gY(Sm), "#dc2626", 1.5, [6, 4]); }
      var bw = Math.max(1.5, Math.min(9, (gR - gL) / (nMax + 1) * 0.45)), rr = Math.max(2.4, Math.min(5.5, (gR - gL) / (nMax + 1) * 0.3));
      ctx.save(); ctx.beginPath(); ctx.rect(gL, gT - 4, gR - gL, gB - gT + 8); ctx.clip();
      /* en échelle log, l'espace entre deux rangs rétrécit : largeur des barres et rayon des billes suivent l'espace local */
      var sp = function(m){ return gX(m + 1) - gX(m); }, bwOf = function(m){ return logN ? Math.max(1, Math.min(9, sp(m) * 0.5)) : bw; }, rrOf = function(m){ return logN ? Math.max(1.8, Math.min(5.5, sp(m) * 0.4)) : rr; };
      for (i = 1; i <= n; i++){ var bwi = bwOf(i), y0 = gY(0), y1 = gY(a[i]), gb = ctx.createLinearGradient(gX(i) - bwi / 2, 0, gX(i) + bwi / 2, 0); gb.addColorStop(0, "#fbbf24"); gb.addColorStop(1, "#d97706"); ctx.fillStyle = gb; ctx.fillRect(gX(i) - bwi / 2, Math.min(y0, y1), bwi, Math.max(1, Math.abs(y1 - y0))); }
      for (i = 1; i <= n; i++) mbBall(ctx, gX(i), gY(s[i]), i === n ? rrOf(i) + 1.5 : rrOf(i), i === n ? "#1d4ed8" : "#3b82f6");
      ctx.restore();
      if (n >= 1) D.line(c, gX(n), gT, gX(n), gB, "rgba(29,78,216,.35)", 1, [3, 3]);
      /* étiquette S à gauche de l'axe, à la hauteur de la ligne pointillée : jamais sous une bille */
      if (Sm != null) mbTag(c, "S", gL - 4, ySm, {size:11.5, math:true, align:"right", color:"#b91c1c", bg:"rgba(254,242,242,.95)"});
      /* légende */
      var lgY = H1 + 19; ctx.fillStyle = "#f59e0b"; ctx.fillRect(gL, lgY - 5, 7, 11); D.text(c, "termes aₙ", gL + 11, lgY, {size:11.5, align:"left", color:"#92400e"});
      mbBall(ctx, gL + 96, lgY, 4.5, "#3b82f6"); D.text(c, "sommes partielles sₙ", gL + 104, lgY, {size:11.5, align:"left", color:"#1e3f8f"});
      /* lectures */
      ro.set(0, String(n)); ro.set(1, n ? mbNum(a[n], 5) : "—"); ro.set(2, F(s[n], mbDig(s[n], Sm, 5)));
      var cvg = Sm != null, osc = key === "geo" && r <= -1 + 1e-9;
      ro.set(3, cvg ? mbFx(Sm, 5) : osc ? "pas de limite" : "diverge (+∞)"); ro.set(4, cvg ? mbNum(Sm - s[n], 5) : "—");
      var txt, kind = "ok";
      if (key === "geo"){
        if (cvg && Math.abs(r) < 1e-9) txt = "Raison a = 0 : tous les termes sont nuls, donc sₙ = 0 pour tout n. La somme S = 0 est atteinte dès le départ : il n'y a rien à approcher.";
        else if (cvg && r > 0) txt = "Raison a = " + mbFx(r, 2) + " : sₙ = a(1 − aⁿ)/(1 − a), et aⁿ → 0 donc sₙ → a/(1 − a) = " + mbFx(Sm, 4) + ". Chaque brique vaut " + mbFx(r, 2) + " fois la précédente : la somme monte et bute contre le plafond S sans jamais l'atteindre.";
        else if (cvg) txt = "Raison a = " + mbFx(r, 2) + " : sₙ = a(1 − aⁿ)/(1 − a), et aⁿ → 0 donc sₙ → a/(1 − a) = " + mbFx(Sm, 4) + ". Avec a < 0, les termes changent de signe : les sommes partielles oscillent autour de S, une fois au-dessus, une fois en dessous, et l'écart se resserre. Le marcheur fait des allers-retours de plus en plus courts : S est une limite, pas un plafond.";
        else if (r >= 1 - 1e-9){ kind = "bad"; txt = "Raison a = " + mbFx(r, 2) + " ≥ 1 : les termes ne tendent pas vers 0, donc la série diverge (condition nécessaire violée) : sₙ → +∞."; }
        else { kind = "bad"; txt = "Raison a = " + mbFx(r, 2) + " ≤ −1 : |aⁿ| ne tend pas vers 0, la série diverge : sₙ oscille sans se fixer" + (r < -1 + 1e-9 && r > -1 - 1e-9 ? " (−1, 0, −1, 0…)." : ", de plus en plus fort."); }
      } else if (key === "harm"){ kind = "warn"; txt = "aₙ = 1/n → 0, et pourtant sₙ → +∞, très lentement (s₆₀ ≈ 4,68). En regroupant 1/3 + 1/4, puis 1/5 + … + 1/8, etc., chaque paquet pèse au moins ½ : s₂ᵏ ≥ 1 + k/2. « aₙ → 0 » ne suffit pas." + (tl.value ? " En échelle logarithmique, les points sₙ s'alignent presque sur une droite (sₙ ≈ ln n + 0,577) : chaque fois que n double, sₙ gagne au moins ½, de plus en plus près de ln 2 ≈ 0,69, sans fin." : " Coche l'échelle logarithmique : la montée lente devient une droite."); }
      else if (key === "inv2"){ txt = "aₙ = 1/n² décroît assez vite : la série converge, vers π²/6 ≈ 1,6449 (Euler). Le reste S − sₙ est d'environ 1/n."; }
      else if (key === "tele"){ txt = "aᵢ = 1/i − 1/(i + 1) : dans sₙ tout se simplifie deux à deux, il reste sₙ = 1 − 1/(n + 1) → 1. Le reste vaut exactement 1/(n + 1)."; }
      else { kind = "warn"; txt = "aₙ = 1/√n → 0 mais plus lentement que 1/n : chaque terme vaut au moins 1/√n, donc sₙ ≥ n·(1/√n) = √n → +∞. La série diverge."; }
      nt.set(txt, kind);
    });
    lp.play();
  }
});
})();
