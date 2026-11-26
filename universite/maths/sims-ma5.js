(function(){
/* Mathématiques BA1 · lot ME : accroissements finis (c03) et intégrales impropres (c04). Fichier autonome : aides préfixées m5. */
var P = SFA.draw.palette, F = SFA.fmt, D = SFA.draw, PI = Math.PI;
function m5cl(x, a, b){ return Math.max(a, Math.min(b, x)); }
/* canevas : rapport hauteur/largeur différent sur ordinateur et sur téléphone */
function m5lay(c, wide, tall){ var r0 = c.resize; c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < 560) ? tall : wide; r0(); }; c.resize(); }
/* pas « rond » d'une graduation (jamais nul, jamais plus de ~10 traits) */
function m5step(span, n){ if (!(span > 0) || !isFinite(span)) return 1; var raw = span / (n || 5), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
function m5ticks(v0, v1, n, fmt){ var s = m5step(v1 - v0, n), out = [], k0 = Math.ceil(v0 / s - 1e-9); for (var k = k0; k * s <= v1 + 1e-9 * s && out.length < 14; k++){ var v = k * s; out.push([v, fmt ? fmt(v) : F(v, 3)]); } return out; }
/* nombres : espace fine entre les milliers */
function m5grp(x, d){ var s = F(x, d || 0); var m = /^(−?)(\d+)(,\d+)?$/.exec(s); if (!m) return s; return m[1] + m[2].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (m[3] || ""); }
/* repère dans une boîte, graduations données : o.xt / o.yt = [[valeur, "texte"], …] */
function m5axBox(c, b, o){
  var L = b.x + (o.l || 40), R = b.x + b.w - (o.r || 12), T = b.y + (o.t || 14), B = b.y + b.h - (o.b || 28), ctx = c.ctx;
  var ax = {x0: o.x0, x1: o.x1, y0: o.y0, y1: o.y1, L: L, R: R, T: T, B: B};
  ax.X = function(x){ return L + (x - o.x0) / (o.x1 - o.x0) * (R - L); }; ax.Y = function(y){ return B - (y - o.y0) / (o.y1 - o.y0) * (B - T); };
  ax.ix = function(px){ return o.x0 + (px - L) / (R - L) * (o.x1 - o.x0); }; ax.iy = function(py){ return o.y0 + (B - py) / (B - T) * (o.y1 - o.y0); };
  if (o.bg){ ctx.save(); ctx.fillStyle = o.bg; ctx.fillRect(L, T, R - L, B - T); ctx.restore(); }
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = o.grid || "#eef1f5"; ctx.beginPath();
  (o.xt || []).forEach(function(t){ var p = Math.round(ax.X(t[0])) + 0.5; ctx.moveTo(p, T); ctx.lineTo(p, B); });
  (o.yt || []).forEach(function(t){ var p = Math.round(ax.Y(t[0])) + 0.5; ctx.moveTo(L, p); ctx.lineTo(R, p); }); ctx.stroke();
  ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(L, B + 0.5); ctx.lineTo(R, B + 0.5); ctx.moveTo(L + 0.5, T); ctx.lineTo(L + 0.5, B); ctx.stroke();
  ctx.font = "600 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#6b7684"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  var hasSup = function(s){ return /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/.test(s); }, rich = {size: 10.5, weight: 600, color: "#6b7684"};
  (o.xt || []).forEach(function(t){ if (!t[1]) return; if (hasSup(t[1])) m5rich(c, t[1], ax.X(t[0]), B + 11, rich); else ctx.fillText(t[1], ax.X(t[0]), B + 5); });
  ctx.textAlign = "right"; ctx.textBaseline = "middle"; (o.yt || []).forEach(function(t){ if (!t[1]) return; if (hasSup(t[1])) m5rich(c, t[1], L - 5, ax.Y(t[0]), {size: 10.5, weight: 600, color: "#6b7684", align: "right"}); else ctx.fillText(t[1], L - 5, ax.Y(t[0])); });
  ctx.font = "700 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#2c3a4e";
  if (o.yl){ ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(o.yl, L - (o.l || 40) + 6, T - 5); }
  ctx.restore(); return ax;
}
/* poignée qu'on attrape */
function m5hnd(c, x, y, col, r){ if (!isFinite(x) || !isFinite(y)) return; var ctx = c.ctx; D.glow(c, x, y, 18, col, 0.28); ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, (r || 7) + 5, 0, 7); ctx.stroke(); ctx.restore(); D.dot(c, x, y, r || 7, col); }
function m5txt(c, s, x, y, o){ o = o || {}; D.text(c, s, x, y, {size: o.size || 11, color: o.color || P.ink, align: o.align || "center", weight: o.weight || 700, halo: o.halo === undefined ? "rgba(255,255,255,.95)" : o.halo, math: o.math, base: o.base}); }
function m5rnd(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function m5show(ctrl, on){ var p = ctrl && ctrl.el && ctrl.el.parentNode; if (p) p.style.display = on ? "" : "none"; }
function m5out(ctrl, html){ var p = ctrl && ctrl.el && ctrl.el.parentNode, o = p && p.querySelector("output"); if (o) o.innerHTML = html; }

/* =====================================================================================================
   1. Rolle et accroissements finis : le radar-tronçon
   position f(t) en km, t en minutes (0 → 12) ; vitesse = 60·f′(t) en km/h
   ===================================================================================================== */
var M5T = 12;
var M5M = {
  auto: {titre: "Radar-tronçon sur autoroute · limite 120 km/h", a: 2, b: 8,
    f: function(t){ return (100 * t - 55 / 0.6 * (Math.cos(0.6 * t - 1.1) - Math.cos(-1.1))) / 60; },
    d: function(t){ return (100 + 55 * Math.sin(0.6 * t - 1.1)) / 60; }},
  ar: {titre: "Aller-retour : la voiture repasse au même endroit", a: 2, b: 10,
    f: function(t){ var u = t / 12; return 12 * (u - 0.4 * u * u - 0.6 * u * u * u); },
    d: function(t){ var u = t / 12; return (1 - 0.8 * u - 1.8 * u * u); }},
  saut: {titre: "Relevé avec un saut : f n'est pas continue en t = 8 min", a: 3, b: 10, js: 8,
    f: function(t){ return 1.5 * t - (t >= 8 ? 12 : 0); },
    d: function(t){ return t === 8 ? NaN : 1.5; }},
  coin: {titre: "Rebond sur une barrière : f a un coin en t = 6 min", a: 2, b: 10, kc: 6,
    f: function(t){ return 9 - 1.5 * Math.abs(t - 6); },
    d: function(t){ return t === 6 ? NaN : (t < 6 ? 1.5 : -1.5); }}
};
/* zéros de g sur ]a ; b[ : {all: g ≡ 0, list: [...]} ; un « zéro » au saut de f′ (coin, saut) est rejeté */
function m5roots(g, a, b){
  var N = 480, xs = [], vs = [], all = true, out = [], i;
  for (i = 0; i < N; i++){ var x = a + (b - a) * (i + 0.5) / N, v = g(x); xs.push(x); vs.push(v); if (!(Math.abs(v) < 1e-9)) all = false; }
  if (all) return {all: true, list: []};
  for (i = 0; i < N - 1; i++){
    var v0 = vs[i], v1 = vs[i + 1]; if (!isFinite(v0) || !isFinite(v1)) continue;
    var r = null;
    if (v0 === 0) r = xs[i];
    else if (v0 * v1 < 0){ var lo = xs[i], hi = xs[i + 1], glo = v0; for (var q = 0; q < 60; q++){ var m = (lo + hi) / 2, gm = g(m); if (!isFinite(gm)) break; if (glo * gm <= 0) hi = m; else { lo = m; glo = gm; } } r = (lo + hi) / 2; if (!(Math.abs(g(r)) < 1e-6)) r = null; }
    if (r !== null && (!out.length || r - out[out.length - 1] > 1e-6)) out.push(r);
  }
  return {all: false, list: out};
}
/* voiture vue de profil ; x = centre, y = sol, L = longueur, dir = ±1, w = angle des roues */
function m5car(ctx, x, y, L, dir, w, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.translate(x, y);
  var sh = ctx.createRadialGradient(0, 0, 1, 0, 0, L * 0.6); sh.addColorStop(0, "rgba(10,15,25,.38)"); sh.addColorStop(1, "rgba(10,15,25,0)");
  ctx.save(); ctx.scale(1, 0.13); ctx.beginPath(); ctx.arc(0, 0, L * 0.62, 0, 7); ctx.fillStyle = sh; ctx.fill(); ctx.restore();
  ctx.scale(dir * L, L); ctx.lineWidth = 1.2 / L;
  /* carrosserie */
  var g = ctx.createLinearGradient(0, -0.5, 0, -0.08); g.addColorStop(0, "#ff8a73"); g.addColorStop(0.45, col); g.addColorStop(1, "#7a160c");
  ctx.beginPath(); ctx.moveTo(-0.5, -0.12); ctx.lineTo(-0.5, -0.27); ctx.quadraticCurveTo(-0.49, -0.33, -0.4, -0.34); ctx.lineTo(-0.27, -0.35);
  ctx.lineTo(-0.16, -0.52); ctx.quadraticCurveTo(-0.13, -0.55, -0.08, -0.55); ctx.lineTo(0.12, -0.55); ctx.quadraticCurveTo(0.17, -0.55, 0.2, -0.52); ctx.lineTo(0.31, -0.36);
  ctx.lineTo(0.44, -0.33); ctx.quadraticCurveTo(0.51, -0.31, 0.51, -0.24); ctx.lineTo(0.51, -0.12); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "rgba(60,10,5,.7)"; ctx.stroke();
  /* vitres */
  var gv = ctx.createLinearGradient(0, -0.52, 0, -0.36); gv.addColorStop(0, "#dfeefa"); gv.addColorStop(1, "#5b7896");
  ctx.beginPath(); ctx.moveTo(-0.235, -0.365); ctx.lineTo(-0.145, -0.505); ctx.lineTo(-0.03, -0.505); ctx.lineTo(-0.03, -0.365); ctx.closePath(); ctx.fillStyle = gv; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0.0, -0.365); ctx.lineTo(0.0, -0.505); ctx.lineTo(0.11, -0.505); ctx.lineTo(0.25, -0.365); ctx.closePath(); ctx.fill();
  /* reflet, poignée, feux */
  ctx.beginPath(); ctx.moveTo(-0.45, -0.3); ctx.lineTo(0.42, -0.3); ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 2 / L; ctx.stroke();
  ctx.fillStyle = "#ffe9a8"; ctx.fillRect(0.46, -0.29, 0.05, 0.05); ctx.fillStyle = "#b3121a"; ctx.fillRect(-0.5, -0.29, 0.04, 0.06);
  /* roues */
  [-0.31, 0.31].forEach(function(wx){
    ctx.beginPath(); ctx.arc(wx, -0.11, 0.11, 0, 7); ctx.fillStyle = "#1a1d22"; ctx.fill();
    var gr = ctx.createRadialGradient(wx - 0.02, -0.13, 0.005, wx, -0.11, 0.065); gr.addColorStop(0, "#f2f5f8"); gr.addColorStop(1, "#7d8692");
    ctx.beginPath(); ctx.arc(wx, -0.11, 0.062, 0, 7); ctx.fillStyle = gr; ctx.fill();
    ctx.strokeStyle = "#4a525c"; ctx.lineWidth = 1.4 / L; for (var k = 0; k < 5; k++){ var an = w * dir + k * 2 * PI / 5; ctx.beginPath(); ctx.moveTo(wx, -0.11); ctx.lineTo(wx + 0.058 * Math.cos(an), -0.11 + 0.058 * Math.sin(an)); ctx.stroke(); }
  });
  ctx.restore();
}
/* compteur de vitesse : −120 → 180 km/h sur 270° ; repère orange = vitesse moyenne */
function m5gauge(c, cx, cy, R, v, vm, lit){
  var ctx = c.ctx, V0 = -120, V1 = 180, ang = function(u){ return 0.75 * PI + (m5cl(u, V0, V1) - V0) / (V1 - V0) * 1.5 * PI; };
  ctx.save();
  if (lit > 0){ D.glow(c, cx, cy, R * 1.45, P.green, 0.5 * Math.min(1, lit)); }
  ctx.shadowColor = "rgba(10,20,35,.35)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
  var gb = ctx.createLinearGradient(cx, cy - R, cx, cy + R); gb.addColorStop(0, "#d9dee5"); gb.addColorStop(0.5, "#7d8794"); gb.addColorStop(1, "#2b323c");
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = gb; ctx.fill(); ctx.shadowColor = "transparent";
  var gf = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.35, R * 0.1, cx, cy, R * 0.92); gf.addColorStop(0, "#26354d"); gf.addColorStop(1, "#0b1422");
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.9, 0, 7); ctx.fillStyle = gf; ctx.fill();
  /* zones : marche arrière (gris) et au-delà de 120 km/h (rouge) */
  ctx.lineWidth = R * 0.08; ctx.lineCap = "butt";
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, ang(V0), ang(0)); ctx.strokeStyle = "rgba(160,172,188,.55)"; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, ang(120), ang(V1)); ctx.strokeStyle = "#d8432c"; ctx.stroke();
  for (var u = V0; u <= V1; u += 10){ var a = ang(u), big = u % 60 === 0, r0 = R * (big ? 0.66 : 0.72);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85); ctx.strokeStyle = big ? "#f3f6fa" : "rgba(220,228,238,.6)"; ctx.lineWidth = big ? 1.8 : 1; ctx.stroke();
    if (big && u > V0 && u < V1){ var gfs = Math.max(10, Math.round(R * 0.17)), gs = String(u).replace("-", "−");
      ctx.font = "700 " + gfs + "px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#e8eef5"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      /* le nombre entier reste à l'intérieur des grands traits (qui commencent à 0,66 R) : le « − » de −60 ne touche plus la graduation */
      var gw2 = ctx.measureText(gs).width / 2, gr2 = Math.max(R * 0.3, Math.min(R * 0.42, R * 0.6 - (Math.abs(Math.cos(a)) * gw2 + Math.abs(Math.sin(a)) * gfs / 2)));
      ctx.fillText(gs, cx + Math.cos(a) * gr2, cy + Math.sin(a) * gr2); } }
  /* repère de la vitesse moyenne */
  if (isFinite(vm)){ var am = ang(vm); ctx.beginPath(); ctx.moveTo(cx + Math.cos(am) * R * 0.9, cy + Math.sin(am) * R * 0.9); ctx.lineTo(cx + Math.cos(am + 0.11) * R * 1.07, cy + Math.sin(am + 0.11) * R * 1.07); ctx.lineTo(cx + Math.cos(am - 0.11) * R * 1.07, cy + Math.sin(am - 0.11) * R * 1.07); ctx.closePath(); ctx.fillStyle = "#f59a23"; ctx.fill(); ctx.strokeStyle = "#7a3d00"; ctx.lineWidth = 1; ctx.stroke(); }
  /* aiguille */
  if (isFinite(v)){ var av = ang(v); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(av) * R * 0.8, cy + Math.sin(av) * R * 0.8); ctx.lineTo(cx + Math.cos(av + PI / 2) * R * 0.05, cy + Math.sin(av + PI / 2) * R * 0.05); ctx.lineTo(cx - Math.cos(av) * R * 0.15, cy - Math.sin(av) * R * 0.15); ctx.lineTo(cx + Math.cos(av - PI / 2) * R * 0.05, cy + Math.sin(av - PI / 2) * R * 0.05); ctx.closePath();
    ctx.fillStyle = lit > 0 ? "#3ddc97" : "#ff4b3a"; ctx.fill(); ctx.shadowColor = "transparent"; }
  var gh = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, R * 0.12); gh.addColorStop(0, "#f4f6f9"); gh.addColorStop(1, "#59626e"); ctx.beginPath(); ctx.arc(cx, cy, R * 0.11, 0, 7); ctx.fillStyle = gh; ctx.fill();
  /* afficheur numérique */
  var s = isFinite(v) ? F(v, 0) : "—", fs = Math.max(9, Math.round(R * 0.22));
  ctx.font = "600 " + fs + "px 'JetBrains Mono', ui-monospace, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var tw = ctx.measureText(s).width + 10; D.rrect(c, cx - tw / 2, cy + R * 0.3, tw, fs + 6, 4); ctx.fillStyle = lit > 0 ? "#cdf7e3" : "#e8f3ec"; ctx.fill();
  ctx.fillStyle = "#0b1422"; ctx.fillText(s, cx, cy + R * 0.3 + (fs + 6) / 2 + 1);
  ctx.font = "800 " + Math.max(7.5, Math.round(R * 0.13)) + "px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#c9d3df"; ctx.fillText("km/h", cx, cy + R * 0.72);
  ctx.restore();
}

SFA.sim({
  id: "ma-accroissements-finis", ch: "c03", tag: "Rolle · accroissements finis",
  titre: "Rolle et les accroissements finis : le radar-tronçon",
  resume: "Une voiture passe sous deux portiques : sa vitesse moyenne est la pente de la corde, et le compteur affiche cette valeur à un instant c au moins. Mets les deux hauteurs égales (Rolle), puis casse une hypothèse pour voir le théorème tomber.",
  but: "Regarde la voiture rouler : quand l'aiguille du compteur passe sur le repère orange (la vitesse moyenne), la tangente verte du graphe est parallèle à la corde orange. Attrape A ou B sur le graphe pour changer le tronçon [a ; b], ou glisse sur le graphe pour choisir l'instant t. En « Aller-retour », clique « Égaliser f(a) et f(b) » : c'est Rolle. Les modes « Saut » et « Rebond » retirent une hypothèse.",
  aRetenir: "<b>Accroissements finis</b> : si f est continue sur [a ; b] et dérivable sur ]a ; b[, il existe c ∈ ]a ; b[ tel que f′(c) = (f(b) − f(a))/(b − a) : la tangente en c est parallèle à la corde. Lecture cinématique : à un instant c, la vitesse instantanée vaut la vitesse moyenne. <b>Rolle</b> en est le cas f(a) = f(b) : il existe c avec f′(c) = 0. Le théorème dit qu'un tel c existe, pas combien il y en a ni où il est.",
  piege: "Chaque hypothèse compte. Sans continuité sur [a ; b] (saut), ou sans dérivabilité sur ]a ; b[ (coin), la conclusion peut tomber : avec le rebond, f(a) = f(b) mais la vitesse passe de +90 à −90 km/h sans jamais valoir 0. La dérivabilité n'est exigée que sur l'ouvert : un coin placé exactement en a ou en b ne gêne pas.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 1.02}); m5lay(c, 1.02, 1.32); c.cv.style.touchAction = "none";
    var md = k.seg("Situation", [["auto", "Autoroute"], ["ar", "Aller-retour"], ["saut", "Saut"], ["coin", "Rebond"]], "auto", function(v){ setMode(v); });
    var sa = k.slider("Entrée du tronçon a", 0, 11.5, 0.1, 2, "min", function(v){ st.msg = ""; if (v > sb.value - 0.5) sb.set(Math.min(M5T, v + 0.5)); });
    var sb = k.slider("Sortie du tronçon b", 0.5, 12, 0.1, 8, "min", function(v){ st.msg = ""; if (v < sa.value + 0.5) sa.set(Math.max(0, v - 0.5)); });
    var st = {clk: 0, t: 0, play: true, hold: 0, freeze: 0, flash: 0, fc: null, cs: [], all: false, ghost: 0, gp: 0, bump: 0, wheel: 0, dir: 1, drag: null, msg: ""};
    var bp = k.button("Pause", function(){ st.play = !st.play; bp.textContent = st.play ? "Pause" : "Lecture"; if (st.play) lp.play(); }, true);
    k.button("Égaliser f(a) et f(b) (Rolle)", function(){ egaliser(); });
    var ro = k.readouts(["Vitesse moyenne (pente de la corde)", "Instant(s) c", "Compteur à l'instant t", "Hypothèses"]), nt = k.note("", "");
    var G = null, SC = null, rng = {p0: 0, p1: 1};
    function M(){ return M5M[md.value]; }
    function calcRange(){ var f = M().f, lo = 1e9, hi = -1e9; for (var i = 0; i <= 600; i++){ var y = f(M5T * i / 600); lo = Math.min(lo, y); hi = Math.max(hi, y); } if (md.value === "saut"){ hi = Math.max(hi, 12); } rng.p0 = lo; rng.p1 = hi; }
    function setMode(v){ sa.set(M5M[v].a); sb.set(M5M[v].b); st.t = 0; st.hold = 0; st.freeze = 0; st.flash = 0; st.ghost = 0; st.bump = 0; st.dir = 1; st.msg = ""; calcRange(); }
    function egaliser(){
      var f = M().f, A = sa.value, B = sb.value, fa = f(A), best = null, i, t0, t1;
      function scan(target, lo, hi){ var found = [], n = 600, pv = f(lo) - target; for (i = 1; i <= n; i++){ t1 = lo + (hi - lo) * i / n; t0 = lo + (hi - lo) * (i - 1) / n; var v = f(t1) - target; if (pv * v <= 0 && pv !== v){ var l = t0, h = t1; for (var q = 0; q < 60; q++){ var m = (l + h) / 2; if ((f(l) - target) * (f(m) - target) <= 0) h = m; else l = m; } var r = (l + h) / 2; if (Math.abs(f(r) - target) < 1e-6) found.push(r); } pv = v; } return found; }
      scan(fa, A + 0.5, M5T).forEach(function(r){ if (best === null || Math.abs(r - B) < Math.abs(best - B)) best = r; });
      if (best !== null){ sb.set(best); st.msg = ""; return; }
      var fb = f(B); scan(fb, 0, B - 0.5).forEach(function(r){ if (best === null || Math.abs(r - A) < Math.abs(best - A)) best = r; });
      if (best !== null){ sa.set(best); st.msg = ""; return; }
      st.msg = md.value === "auto" ? "Impossible ici : f est strictement croissante (la voiture ne fait jamais demi-tour), elle ne reprend jamais deux fois la même valeur. Passe en « Aller-retour »."
        : "Impossible avec ce tronçon : aucun autre instant ne redonne la même position f(a) ou f(b). Déplace A ou B, puis réessaie.";
    }
    var lp = k.loop(function(dt){
      var m = M(), t = st.t; if (st.play) st.clk += dt; /* la pause fige aussi les nuages */
      if (st.play && !st.drag){
        if (st.hold > 0){ st.hold -= dt; if (st.hold <= 0){ st.t = 0; st.ghost = 0; } }
        else {
          if (st.freeze > 0){ st.freeze -= dt; st.flash = Math.max(0, st.flash - dt); k.redraw(); return; }
          var tn = Math.min(M5T, t + M5T / 9 * dt);
          st.cs.forEach(function(cc){ if (t < cc && cc <= tn && st.freeze <= 0){ tn = cc; st.freeze = 1.1; st.flash = 1.35; st.fc = cc; } });
          if (m.js && t < m.js && tn >= m.js){ st.ghost = 1; st.gp = m.f(t); }
          if (m.kc && t < m.kc && tn >= m.kc) st.bump = 1;
          st.wheel += (m.f(tn) - m.f(t)) * 3.2; st.t = tn; if (tn >= M5T) st.hold = 1.3;
        }
      }
      st.flash = Math.max(0, st.flash - dt); st.ghost = Math.max(0, st.ghost - dt * 1.2); st.bump = Math.max(0, st.bump - dt * 1.6);
      k.redraw();
    });
    c.pointer(function(type, p){
      if (type === "down"){ st.drag = null;
        if (G){ var f = M().f, da = Math.hypot(p.x - G.X(sa.value), p.y - G.Y(f(sa.value))), db = Math.hypot(p.x - G.X(sb.value), p.y - G.Y(f(sb.value)));
          if (Math.min(da, db) < 24) st.drag = da <= db ? "a" : "b";
          else if (p.x >= G.L - 6 && p.x <= G.R + 6 && p.y >= G.T - 6 && p.y <= G.B + 24) st.drag = "t"; }
        if (!st.drag && SC && p.y < SC.h) st.drag = "car";
      }
      if ((type === "down" || type === "drag") && st.drag){
        if (st.drag === "t" || st.drag === "a" || st.drag === "b"){ var v = m5cl(G.ix(p.x), 0, M5T);
          if (st.drag === "t"){ st.t = v; st.hold = 0; }
          /* comme avec les curseurs : A pousse B (et B pousse A), écart minimal 0,5 min */
          else if (st.drag === "a"){ st.msg = ""; sa.set(Math.round(Math.min(v, M5T - 0.5) * 10) / 10); if (sa.value > sb.value - 0.5) sb.set(Math.min(M5T, sa.value + 0.5)); }
          else { st.msg = ""; sb.set(Math.round(Math.max(v, 0.5) * 10) / 10); if (sb.value < sa.value + 0.5) sa.set(Math.max(0, sb.value - 0.5)); } }
        else if (st.drag === "car" && SC){ var f2 = M().f, bt = st.t, bd = 1e9; for (var i = 0; i <= 480; i++){ var tt = M5T * i / 480, dd = Math.abs(SC.X(f2(tt)) - p.x) + Math.abs(tt - st.t) * 2; if (dd < bd){ bd = dd; bt = tt; } } st.t = bt; st.hold = 0; }
        k.redraw(); }
      if (type === "up") st.drag = null;
      /* même zone que pour « down » : la double flèche n'apparaît que là où un glisser déplace vraiment t */
      if (type === "move" && G){ var f3 = M().f, near = Math.min(Math.hypot(p.x - G.X(sa.value), p.y - G.Y(f3(sa.value))), Math.hypot(p.x - G.X(sb.value), p.y - G.Y(f3(sb.value)))) < 24, inG = p.x >= G.L - 6 && p.x <= G.R + 6 && p.y >= G.T - 6 && p.y <= G.B + 24;
        c.cv.style.cursor = near ? "grab" : inG ? "ew-resize" : (SC && p.y < SC.h ? "pointer" : "default"); }
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, m = M(), f = m.f, d = m.d, A = sa.value, B = sb.value, t = st.t;
      if (rng.p1 <= rng.p0) calcRange();
      c.clear();
      var mob = W < 560, hs = Math.round(H * (mob ? 0.47 : 0.46));
      var s = (f(B) - f(A)) / (B - A), vm = 60 * s;
      var R0 = m5roots(function(x){ return d(x) - s; }, A, B); st.cs = R0.list; st.all = R0.all;
      var vt = 60 * d(t);
      var brokeC = !!(m.js && A < m.js && B >= m.js), brokeD = !!(m.kc && A < m.kc && B > m.kc);
      /* ------------------------------------------------ scène ------------------------------------------------ */
      var yF = hs * 0.66, yN = hs * 0.9, dy = yN - yF, dxo = dy * 0.42, Lc = m5cl(Math.min(W * 0.13, hs * 0.29), 42, 74);
      var mL = Lc * 0.62 + 10, mR = Lc * 0.62 + 12 + dxo + (m.kc ? Lc * 0.4 : 0);
      SC = {h: hs, X: function(pp){ return mL + (pp - rng.p0) / (rng.p1 - rng.p0) * (W - mL - mR); }};
      var sky = ctx.createLinearGradient(0, 0, 0, yF); sky.addColorStop(0, "#9ccbee"); sky.addColorStop(1, "#e9f4fb"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, yF);
      /* soleil, collines, arbres */
      D.glow(c, W * 0.42, hs * 0.12, hs * 0.22, "#fff3c4", 0.7);
      [[0.18, 0.3, 1], [0.55, 0.2, 0.8], [0.86, 0.42, 0.7]].forEach(function(cl, j){ var cx = ((cl[0] * W + st.clk * (6 + 3 * j)) % (W + 120)) - 60, cy = hs * cl[1], r = hs * 0.05 * cl[2];
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.88)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.arc(cx + r * 1.1, cy - r * 0.4, r * 1.25, 0, 7); ctx.arc(cx + r * 2.3, cy, r * 0.95, 0, 7); ctx.fill(); ctx.fillRect(cx, cy, r * 2.3, r * 0.9); ctx.restore(); });
      [["#a9cf9b", 0.47, 0.06, 0.011], ["#7fb874", 0.53, 0.05, 0.017]].forEach(function(h){ ctx.beginPath(); ctx.moveTo(0, yF); for (var x = 0; x <= W + 8; x += 8) ctx.lineTo(x, hs * h[1] - hs * h[2] * Math.sin(x * h[3] + h[1] * 9) - hs * 0.03 * Math.sin(x * h[3] * 2.7)); ctx.lineTo(W, yF); ctx.closePath(); ctx.fillStyle = h[0]; ctx.fill(); });
      var rr = m5rnd(7); for (var i = 0; i < 9; i++){ var tx = (i + 0.3 + rr() * 0.4) * W / 9, ty = yF - 6 - rr() * 4, ts = hs * (0.05 + rr() * 0.03);
        ctx.fillStyle = "#6b4a2b"; ctx.fillRect(tx - 1.5, ty - ts * 0.9, 3, ts * 0.9);
        var gt = ctx.createRadialGradient(tx - ts * 0.3, ty - ts * 1.4, 1, tx, ty - ts * 1.1, ts); gt.addColorStop(0, "#8fd27a"); gt.addColorStop(1, "#2f7a3a"); ctx.beginPath(); ctx.arc(tx, ty - ts * 1.15, ts * 0.75, 0, 7); ctx.fillStyle = gt; ctx.fill(); }
      /* herbe, route */
      var gg = ctx.createLinearGradient(0, yF - 8, 0, hs); gg.addColorStop(0, "#9bc977"); gg.addColorStop(1, "#6fa457"); ctx.fillStyle = gg; ctx.fillRect(0, yF - 8, W, hs - yF + 8);
      var ga = ctx.createLinearGradient(0, yF, 0, yN); ga.addColorStop(0, "#5b6068"); ga.addColorStop(1, "#3a3e45"); ctx.fillStyle = ga; ctx.fillRect(0, yF, W, dy);
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(0, yF + 2, W, 2); ctx.fillRect(0, yN - 4, W, 2);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(0, yF + dy * 0.48); ctx.lineTo(W, yF + dy * 0.48); ctx.stroke(); ctx.restore();
      /* glissière */
      ctx.fillStyle = "#c9ced6"; ctx.fillRect(0, yF - 7, W, 3); for (var gx = 6; gx < W; gx += 26){ ctx.fillStyle = "#8c939d"; ctx.fillRect(gx, yF - 7, 2, 8); }
      /* bornes kilométriques */
      var kst = m5step(rng.p1 - rng.p0, Math.max(3, Math.floor((W - mL - mR) / 70)));
      for (var kk = Math.ceil(rng.p0 / kst) * kst, nk = 0; kk <= rng.p1 + 1e-9 && nk < 30; kk += kst, nk++){ var kx = SC.X(kk);
        var ky = yN + (hs - yN) / 2 + 1; ctx.fillStyle = "#f7f7f7"; D.rrect(c, kx - 3, ky - 6, 6, 12, 2); ctx.fill(); ctx.fillStyle = "#d8432c"; ctx.fillRect(kx - 3, ky - 6, 6, 3);
        m5txt(c, F(kk, 1) + " km", kx + 6, ky + 1, {size: 9.5, color: "#1f3a22", halo: false, align: "left"}); }
      /* barrière du rebond */
      if (m.kc){ var bx = SC.X(m.f(m.kc)) + Lc * 0.52, bw = 9, hb = dy * 0.5;
        ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(60,20,10,.55)";
        ctx.beginPath(); ctx.moveTo(bx, yN - hb); ctx.lineTo(bx + dxo, yF - hb); ctx.lineTo(bx + dxo + bw, yF - hb); ctx.lineTo(bx + bw, yN - hb); ctx.closePath(); ctx.fillStyle = "#f3d9d2"; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + bw, yN); ctx.lineTo(bx + bw, yN - hb); ctx.lineTo(bx + bw + dxo, yF - hb); ctx.lineTo(bx + bw + dxo, yF); ctx.closePath(); var gS = ctx.createLinearGradient(0, yF - hb, 0, yN); gS.addColorStop(0, "#c9493a"); gS.addColorStop(1, "#7d2014"); ctx.fillStyle = gS; ctx.fill(); ctx.stroke();
        for (var sI = 0; sI < 4; sI++){ ctx.fillStyle = sI % 2 ? "#eef1f4" : "#c0321d"; ctx.fillRect(bx, yN - hb + sI * hb / 4, bw, hb / 4 + 0.5); }
        ctx.strokeRect(bx, yN - hb, bw, hb);
        ctx.restore();
        if (st.bump > 0){ var sr = 10 + 14 * (1 - st.bump); ctx.save(); ctx.globalAlpha = st.bump; ctx.strokeStyle = "#f4c542"; ctx.lineWidth = 3; for (var q = 0; q < 8; q++){ var aq = q * PI / 4; ctx.beginPath(); ctx.moveTo(bx + Math.cos(aq) * sr * 0.5, yN - dy * 0.45 + Math.sin(aq) * sr * 0.5); ctx.lineTo(bx + Math.cos(aq) * sr, yN - dy * 0.45 + Math.sin(aq) * sr); ctx.stroke(); } ctx.restore(); } }
      /* portiques : poteaux du fond et poutres */
      var hg = hs * 0.26, gts = [[A, "A"], [B, "B"]];
      function gantryFar(pp){ var x = SC.X(pp), gr = ctx.createLinearGradient(x + dxo - 3, 0, x + dxo + 3, 0); gr.addColorStop(0, "#9aa3ae"); gr.addColorStop(1, "#56606c");
        ctx.fillStyle = gr; ctx.fillRect(x + dxo - 2.5, yF - hg, 5, hg);
        ctx.beginPath(); ctx.moveTo(x - 1, yN - hg - 4); ctx.lineTo(x + dxo - 1, yF - hg - 4); ctx.lineTo(x + dxo + 4, yF - hg - 4); ctx.lineTo(x + 4, yN - hg - 4); ctx.lineTo(x + 4, yN - hg + 3); ctx.lineTo(x + dxo + 4, yF - hg + 3); ctx.lineTo(x + dxo - 1, yF - hg + 3); ctx.lineTo(x - 1, yN - hg + 3); ctx.closePath(); ctx.fillStyle = "#7b8592"; ctx.fill(); }
      function gantryNear(pp, lab, col, sh){ var x = SC.X(pp), gr = ctx.createLinearGradient(x - 3, 0, x + 3, 0); gr.addColorStop(0, "#c3cad3"); gr.addColorStop(1, "#5d6773");
        ctx.fillStyle = gr; ctx.fillRect(x - 3, yN - hg, 6, hg + 3);
        /* caméra et panneau */
        var cx0 = x + dxo * 0.32 + 2, cy0 = yN - dy * 0.32 - hg + 4; ctx.fillStyle = "#e9edf2"; D.rrect(c, cx0 - 7, cy0, 14, 9, 2); ctx.fill(); ctx.strokeStyle = "#5d6773"; ctx.lineWidth = 1; ctx.stroke(); ctx.beginPath(); ctx.arc(cx0 - 7, cy0 + 4.5, 2.6, 0, 7); ctx.fillStyle = "#1b2633"; ctx.fill();
        var px = x + dxo * 0.62 + (sh || 0), py = yN - dy * 0.62 - hg - 15; ctx.fillStyle = col; D.rrect(c, px - 10, py, 20, 14, 3); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2; ctx.stroke();
        m5txt(c, lab, px, py + 7.5, {size: 10, color: "#fff", halo: false, weight: 800}); }
      gts.forEach(function(g){ gantryFar(f(g[0])); });
      /* voiture (et fantôme du saut) */
      var vS = d(t); if (isFinite(vS) && Math.abs(vS) > 1e-6) st.dir = vS > 0 ? 1 : -1;
      var yCar = yN - dy * 0.2;
      if (st.ghost > 0) m5car(ctx, SC.X(st.gp), yCar, Lc, 1, st.wheel, "#d8432c", 0.45 * st.ghost);
      if (st.ghost > 0){ var gx0 = SC.X(st.gp), gx1 = SC.X(f(t)); ctx.save(); ctx.globalAlpha = st.ghost; ctx.strokeStyle = "#6236c4"; ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx0, yCar - Lc * 0.6); ctx.quadraticCurveTo((gx0 + gx1) / 2, yCar - Lc * 1.4, gx1, yCar - Lc * 0.6); ctx.stroke(); ctx.restore(); }
      m5car(ctx, SC.X(f(t)), yCar, Lc, st.dir, st.wheel, "#d8432c", 1);
      var close = Math.abs(SC.X(f(A)) - SC.X(f(B))) < 24; gts.forEach(function(g){ gantryNear(f(g[0]), g[1], g[1] === "A" ? "#1f4b9e" : "#6236c4", close ? (g[1] === "A" ? -12 : 12) : 0); });
      /* compteur (en haut à droite) et cartouche (en haut à gauche) */
      var Rg = m5cl(Math.min(hs * 0.19, W * 0.14), 34, 60), gcx = W - Rg - 10, gcy = Rg + 8;
      m5gauge(c, gcx, gcy, Rg, vt, vm, st.flash);
      var pw = Math.min(W - 2 * Rg - 34, 330), pl = st.flash > 0 ? [["Maintenant : le compteur affiche", P.green], ["la vitesse moyenne, " + F(60 * d(st.fc == null ? t : st.fc), 0) + " km/h", P.green]] : [[m.titre, P.ink], ["vitesse moyenne de A à B : " + F(vm, 0) + " km/h", "#b45309"]];
      ctx.save(); ctx.font = "800 11.5px Mulish, system-ui, sans-serif"; var tw1 = ctx.measureText(pl[0][0]).width; ctx.font = "700 11px Mulish, system-ui, sans-serif"; var tw2 = ctx.measureText(pl[1][0]).width; ctx.restore();
      var fsz = Math.min(1, (pw - 20) / Math.max(tw1, tw2)), ph = 44;
      D.panel(c, 8, 8, Math.min(pw, Math.max(tw1, tw2) * fsz + 20), ph, {fill: st.flash > 0 ? "rgba(225,247,236,.95)" : "rgba(255,255,255,.93)", stroke: st.flash > 0 ? P.green : "#e3e7ed"});
      D.text(c, pl[0][0], 17, 21, {size: 11.5 * fsz, color: pl[0][1], align: "left", weight: 800});
      D.text(c, pl[1][0], 17, 38, {size: 11 * fsz, color: pl[1][1], align: "left", weight: 700});
      /* ------------------------------------------------ graphe ------------------------------------------------ */
      var gb = {x: 0, y: hs, w: W, h: H - hs};
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, hs, W, H - hs); ctx.fillStyle = "rgba(15,27,45,.06)"; ctx.fillRect(0, hs, W, 2);
      var yr0 = rng.p0 - 0.06 * (rng.p1 - rng.p0), yr1 = rng.p1 + 0.08 * (rng.p1 - rng.p0);
      var xt = []; for (var tk = 0; tk <= 12; tk += 2) xt.push([tk, tk === 12 ? "" : String(tk)]);
      var ax = m5axBox(c, gb, {x0: 0, x1: M5T, y0: yr0, y1: yr1, l: 42, r: 16, t: 26, b: 42, xt: xt, yt: m5ticks(yr0, yr1, mob ? 4 : 5, function(v){ return F(v, 1); }), yl: "position f(t) en km"}); G = ax;
      /* « 12 min » calé à droite dans le cadre (centré sur la graduation, il débordait) */
      ctx.save(); ctx.font = "600 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#6b7684"; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("12 min", W - 4, ax.B + 5); ctx.restore();
      /* courbe (en deux morceaux autour d'un saut) */
      function plot(t0, t1, col, w){ ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 4, ax.R - ax.L, ax.B - ax.T + 8); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; ctx.beginPath(); for (var i = 0; i <= 300; i++){ var tt = t0 + (t1 - t0) * i / 300; if (i === 300 && m.js && t1 === m.js) tt = t1 - 1e-9; var X = ax.X(tt), Y = ax.Y(f(tt)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); }
      if (m.js){ plot(0, m.js, P.acc, 3); plot(m.js, M5T, P.acc, 3); ctx.beginPath(); ctx.arc(ax.X(m.js), ax.Y(12), 4.5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.stroke(); D.dot(c, ax.X(m.js), ax.Y(0), 4.5, P.acc); }
      else plot(0, M5T, P.acc, 3);
      if (m.kc) m5txt(c, "coin", ax.X(m.kc), ax.Y(f(m.kc)) - 12, {size: 10.5, color: P.red});
      if (m.js) m5txt(c, "saut", ax.X(m.js) + 6, ax.Y(6), {size: 10.5, color: P.red, align: "left"});
      /* corde AB et triangle des accroissements */
      var fa = f(A), fb = f(B), ext = 0.12 * (B - A);
      D.line(c, ax.X(A), ax.Y(fa), ax.X(B), ax.Y(fa), "#c2c9d3", 1.2, [3, 3]); D.line(c, ax.X(B), ax.Y(fa), ax.X(B), ax.Y(fb), "#c2c9d3", 1.2, [3, 3]);
      D.line(c, ax.X(A - ext), ax.Y(fa - s * ext), ax.X(B + ext), ax.Y(fb + s * ext), "rgba(194,106,12,.45)", 2, [6, 4]);
      D.line(c, ax.X(A), ax.Y(fa), ax.X(B), ax.Y(fb), "#e07a1f", 3);
      /* tangentes parallèles à la corde */
      var span = (B - A) * 0.42 + 0.6;
      if (!R0.all) st.cs.forEach(function(cc, i){ var fc = f(cc), on = st.flash > 0 && Math.abs(cc - st.fc) < 1e-6;
        D.line(c, ax.X(cc - span / 2), ax.Y(fc - s * span / 2), ax.X(cc + span / 2), ax.Y(fc + s * span / 2), P.green, on ? 3.4 : 2.2, on ? null : [7, 4]);
        D.line(c, ax.X(cc), ax.Y(fc), ax.X(cc), ax.B, "rgba(36,119,90,.45)", 1.2, [2, 3]);
        D.dot(c, ax.X(cc), ax.Y(fc), 5.5, P.green);
        var ux = ax.X(cc + 1) - ax.X(cc), uy = ax.Y(fc + s) - ax.Y(fc), un = Math.hypot(ux, uy) || 1, nx = uy / un, ny = -ux / un; if (ny > 0){ nx = -nx; ny = -ny; }
        D.label(c, st.cs.length > 1 ? "c" + "₁₂₃₄₅₆"[Math.min(i, 5)] : "c", m5cl(ax.X(cc) + 19 * nx, 14, W - 14), ax.Y(fc) + 19 * ny, {color: P.green, size: 11.5, math: true}); });
      /* instant t : point mobile et sa tangente */
      var ftv = f(t), dtv = d(t);
      D.line(c, ax.X(t), ax.T, ax.X(t), ax.B, "rgba(98,54,196,.28)", 1.2);
      if (isFinite(dtv)){ var sp2 = 1.2, match = st.flash > 0; D.line(c, ax.X(t - sp2), ax.Y(ftv - dtv * sp2), ax.X(t + sp2), ax.Y(ftv + dtv * sp2), match ? P.green : P.violet, 2); }
      D.dot(c, ax.X(t), ax.Y(ftv), 5, P.violet);
      /* poignées A et B */
      m5hnd(c, ax.X(A), ax.Y(fa), "#1f4b9e", 6.5); m5hnd(c, ax.X(B), ax.Y(fb), P.violet, 6.5);
      var cux = ax.X(B) - ax.X(A), cuy = ax.Y(fb) - ax.Y(fa), cun = Math.hypot(cux, cuy) || 1, cnx = cuy / cun, cny = -cux / cun; if (cny > 0){ cnx = -cnx; cny = -cny; }
      m5txt(c, "A", m5cl(ax.X(A) + 17 * cnx - 6, 10, W - 10), ax.Y(fa) + 17 * cny, {size: 13, color: "#1f4b9e", weight: 800});
      m5txt(c, "B", m5cl(ax.X(B) + 17 * cnx + 6, 10, W - 10), ax.Y(fb) + 17 * cny, {size: 13, color: P.violet, weight: 800});
      /* étiquettes a et b sous l'axe */
      var xa = ax.X(A), xb = ax.X(B), yl = ax.B + 26, la = "a = " + F(A, 1), lb = "b = " + F(B, 1);
      ctx.save(); ctx.font = "800 10.5px Mulish, system-ui, sans-serif"; var wa = ctx.measureText(la).width + 12, wb = ctx.measureText(lb).width + 12; ctx.restore();
      var pa = xa - wa / 2, pb = xb - wb / 2; if (pa + wa + 4 > pb){ var mid = (xa + xb) / 2; pa = mid - wa - 2; pb = mid + 2; } pa = m5cl(pa, 2, W - wa - wb - 6); pb = m5cl(pb, pa + wa + 4, W - wb - 2);
      D.label(c, la, pa + wa / 2, yl, {color: "#1f4b9e", size: 10.5}); D.label(c, lb, pb + wb / 2, yl, {color: P.violet, size: 10.5});
      /* ------------------------------------------------ lectures ------------------------------------------------ */
      ro.set(0, F(vm, 1) + " km/h");
      ro.set(1, R0.all ? "tout c de ]a ; b[" : (st.cs.length ? st.cs.map(function(cc){ return F(cc, 2); }).join(" et ") + " min" : "aucun"));
      ro.set(2, isFinite(vt) ? F(vt, 0) + " km/h" : "non définie");
      ro.set(3, brokeC ? "pas continue (saut)" : brokeD ? "pas dérivable (coin)" : "vérifiées");
      var eq = Math.abs(fa - fb) < 0.02, html, kind = "";
      if (st.msg){ html = st.msg; kind = "warn"; }
      else if (brokeC){ html = "Le saut en t = 8 min est dans [a ; b] : f n'est pas continue. La corde a une pente de " + F(vm, 0) + " km/h alors que le compteur indique toujours 90 km/h : <b>aucun c</b>, la conclusion tombe. Une vraie voiture ne se téléporte pas : sa position est continue."; kind = "bad"; }
      else if (brokeD){ html = "Le coin en t = 6 min est dans ]a ; b[ : f n'y est pas dérivable. La vitesse saute de +90 à −90 km/h sans passer par " + F(vm, 0) + " km/h : <b>aucun c</b>." + (eq ? " Même avec f(a) = f(b), Rolle ne s'applique pas." : ""); kind = "bad"; }
      else if (eq){ html = "f(a) = f(b) : la corde est horizontale, la vitesse moyenne est nulle. <b>Rolle</b> : il existe c ∈ ]a ; b[ avec f′(c) = 0" + (st.cs.length ? " ; ici c ≈ " + F(st.cs[0], 2) + " min, l'instant du demi-tour." : "."); kind = "ok"; }
      else if (R0.all){ html = "Vitesse constante sur [a ; b] : la corde est confondue avec la courbe, et tout c de ]a ; b[ convient."; kind = "ok"; }
      else if (md.value === "auto"){ html = "Pente de la corde : (f(b) − f(a))/(b − a) = " + F(fb - fa, 2) + " km / " + F(B - A, 1) + " min = " + F(vm, 1) + " km/h. " + (vm > 120 ? "Plus de 120 km/h : le théorème garantit qu'à un instant c le compteur a indiqué " + F(vm, 0) + " km/h. L'amende est justifiée sans avoir vu l'excès." : "Le compteur a forcément indiqué " + F(vm, 0) + " km/h à un instant c, mais rien ne prouve un excès."); kind = vm > 120 ? "warn" : ""; }
      else { html = "Pente de la corde : " + F(vm, 1) + " km/h. Il existe " + (st.cs.length > 1 ? st.cs.length + " instants c" : "un instant c") + " où le compteur indique exactement cette vitesse. Clique « Égaliser f(a) et f(b) » pour obtenir le cas de Rolle."; }
      nt.set(html, kind);
    });
    calcRange(); lp.play();
  }
});

/* =====================================================================================================
   2. Intégrales impropres : peindre une aire infinie avec une quantité finie de peinture ; rente perpétuelle
   ===================================================================================================== */
function m5A1(p, b){ return Math.abs(p - 1) < 1e-9 ? Math.log(b) : (Math.pow(b, 1 - p) - 1) / (1 - p); }
function m5A2(p, c){ return Math.abs(p - 1) < 1e-9 ? -Math.log(c) : (1 - Math.pow(c, 1 - p)) / (1 - p); }
function m5sup(n){ return String(n).replace("-", "⁻").replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+q]; }); }
function m5big(x, d){ if (!isFinite(x)) return "+∞"; if (x < 100) return F(x, d == null ? 3 : d); if (x < 1e5) return m5grp(x, 0); var e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e); if (m >= 9.995){ m = 1; e++; } return F(m, 2) + "·10" + m5sup(e); }
/* au-delà du milliard : notation scientifique (« 5,09·10¹⁷ € »), jamais un nombre à 15 chiffres */
function m5eur(x){ return !isFinite(x) ? "+∞" : x < 1e6 ? m5grp(x, 0) + " €" : x < 1e9 ? F(x / 1e6, 2) + " M€" : m5big(x) + " €"; }
/* texte du canevas avec de VRAIS exposants : les caractères exposants Unicode (¹, ⁻, ᵖ, ʳ…) sont redessinés
   en petite police remontée (sinon certaines polices les font tomber en indices).
   o = {size, color, align, weight, math, mono, halo, bg, border, measure} ; renvoie la largeur */
var M5SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺⁽⁾ᵖʳᵍᵗᵀˣⁿ", M5NRM = "0123456789−+()prgtTxn";
function m5segs(s){ var out = [], cur = null; for (var i = 0; i < s.length; i++){ var j = M5SUP.indexOf(s[i]), up = j >= 0, ch = up ? M5NRM[j] : s[i]; if (!cur || cur.up !== up){ cur = {t: "", up: up}; out.push(cur); } cur.t += ch; } return out; }
function m5rich(c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = o.size || 11, wt = o.weight || 700, ss = Math.round(size * 7.2) / 10;
  var fam = o.math ? "'STIX Two Text', 'Cambria Math', serif" : o.mono ? "'JetBrains Mono', ui-monospace, monospace" : "Mulish, system-ui, sans-serif";
  var fB = wt + " " + size + "px " + fam, fS = wt + " " + ss + "px " + fam, sg = m5segs(String(s)), w = 0;
  ctx.save(); sg.forEach(function(q){ ctx.font = q.up ? fS : fB; q.w = ctx.measureText(q.t).width; w += q.w; });
  if (o.measure){ ctx.restore(); return w; }
  var x0 = o.align === "left" ? x : o.align === "right" ? x - w : x - w / 2;
  if (o.bg){ var ph = size + 8; D.rrect(c, x0 - 6, y - ph / 2, w + 12, ph, Math.min(7, ph / 2)); ctx.fillStyle = o.bg; ctx.fill(); if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); } }
  ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
  [0, 1].forEach(function(pass){ var xx = x0; sg.forEach(function(q){ ctx.font = q.up ? fS : fB; var yy = q.up ? y - size * 0.36 : y;
    if (pass === 0 && o.halo){ ctx.lineWidth = 3; ctx.strokeStyle = o.halo; ctx.strokeText(q.t, xx, yy); }
    if (pass === 1){ ctx.fillStyle = o.color || P.ink; ctx.fillText(q.t, xx, yy); } xx += q.w; }); });
  ctx.restore(); return w;
}
/* étiquette rouge posée sur la peinture : pastille rouge opaque, texte blanc */
function m5tag(c, s, x, y, size){ m5rich(c, s, x, y, {size: size || 11, color: "#ffffff", weight: 800, bg: P.red, border: "rgba(255,255,255,.85)"}); }
function m5tagW(c, s, size){ return m5rich(c, s, 0, 0, {size: size || 11, weight: 800, measure: true}) + 12; }
function m5pct(q){ var x = 100 * q; return x >= 99.95 ? F(x, 3) : x >= 99 ? F(x, 2) : F(x, 1); }
function m5PV(Fl, r, g, T){ var q = r - g; return Math.abs(q) < 1e-12 ? Fl * T : Fl * (1 - Math.exp(-q * T)) / q; }
/* peintre vu de face, pieds en (x, y), taille h ; (hx, hy) = point tenu par les mains */
function m5painter(ctx, x, y, h, hx, hy){
  ctx.save();
  var sh = ctx.createRadialGradient(x, y, 1, x, y, h * 0.3); sh.addColorStop(0, "rgba(20,25,35,.3)"); sh.addColorStop(1, "rgba(20,25,35,0)"); ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.2); ctx.beginPath(); ctx.arc(0, 0, h * 0.3, 0, 7); ctx.fillStyle = sh; ctx.fill(); ctx.restore();
  var u = h / 100;
  /* jambes et chaussures */
  ctx.fillStyle = "#e9edf2"; ctx.strokeStyle = "#9aa5b4"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 9 * u, y - 46 * u); ctx.lineTo(x - 11 * u, y - 3 * u); ctx.lineTo(x - 3 * u, y - 3 * u); ctx.lineTo(x, y - 40 * u); ctx.lineTo(x + 3 * u, y - 3 * u); ctx.lineTo(x + 11 * u, y - 3 * u); ctx.lineTo(x + 9 * u, y - 46 * u); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#3b2a1d"; D.rrect({ctx: ctx}, x - 13 * u, y - 5 * u, 10 * u, 5 * u, 2 * u); ctx.fill(); D.rrect({ctx: ctx}, x + 3 * u, y - 5 * u, 10 * u, 5 * u, 2 * u); ctx.fill();
  /* salopette */
  var go = ctx.createLinearGradient(x - 14 * u, 0, x + 14 * u, 0); go.addColorStop(0, "#ffffff"); go.addColorStop(1, "#c9d1db");
  ctx.beginPath(); ctx.moveTo(x - 13 * u, y - 76 * u); ctx.quadraticCurveTo(x, y - 80 * u, x + 13 * u, y - 76 * u); ctx.lineTo(x + 11 * u, y - 44 * u); ctx.lineTo(x - 11 * u, y - 44 * u); ctx.closePath(); ctx.fillStyle = go; ctx.fill(); ctx.strokeStyle = "#9aa5b4"; ctx.stroke();
  [[-5, -60, "#2a8fa0"], [4, -52, "#2a8fa0"], [6, -68, "#2a8fa0"]].forEach(function(s){ ctx.beginPath(); ctx.arc(x + s[0] * u, y + s[1] * u, 1.8 * u, 0, 7); ctx.fillStyle = s[2]; ctx.fill(); });
  /* bras vers les mains */
  ctx.strokeStyle = "#f0c9a5"; ctx.lineCap = "round"; ctx.lineWidth = 5 * u;
  ctx.beginPath(); ctx.moveTo(x - 11 * u, y - 72 * u); ctx.quadraticCurveTo(x - 16 * u, y - 58 * u, hx, hy + 6 * u); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 11 * u, y - 72 * u); ctx.quadraticCurveTo(x + 6 * u, y - 60 * u, hx + 2 * u, hy - 6 * u); ctx.stroke();
  /* tête et chapeau de papier */
  var gh = ctx.createRadialGradient(x - 3 * u, y - 89 * u, 1, x, y - 87 * u, 9 * u); gh.addColorStop(0, "#fbe0c4"); gh.addColorStop(1, "#d9a67a");
  ctx.beginPath(); ctx.arc(x, y - 87 * u, 8.5 * u, 0, 7); ctx.fillStyle = gh; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 10 * u, y - 92 * u); ctx.lineTo(x, y - 106 * u); ctx.lineTo(x + 10 * u, y - 92 * u); ctx.closePath(); ctx.fillStyle = "#f7f3e8"; ctx.fill(); ctx.strokeStyle = "#b9b09a"; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = "#2c3a4e"; ctx.beginPath(); ctx.arc(x - 3 * u, y - 87 * u, 1.1 * u, 0, 7); ctx.arc(x + 3 * u, y - 87 * u, 1.1 * u, 0, 7); ctx.fill();
  ctx.restore();
}
/* rouleau : centre (x, y), largeur w */
function m5roller(ctx, x, y, w, col){
  var g = ctx.createLinearGradient(0, y - 5, 0, y + 5); g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, col); g.addColorStop(1, "#0b3a44");
  ctx.save(); D.rrect({ctx: ctx}, x - w / 2, y - 5, w, 10, 4); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
/* pot de peinture en volume ; lvl = part restante (0 → 1) */
function m5can(c, x, y, w, h, lvl, col){
  var ctx = c.ctx, ry = w * 0.16;
  ctx.save();
  var gb = ctx.createLinearGradient(x, 0, x + w, 0); gb.addColorStop(0, "#8f99a6"); gb.addColorStop(0.35, "#f3f6f9"); gb.addColorStop(0.7, "#bcc5d0"); gb.addColorStop(1, "#6d7784");
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.ellipse(x + w / 2, y + h, w / 2, ry, 0, PI, 0, true); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fillStyle = gb; ctx.fill();
  ctx.fillStyle = col; ctx.globalAlpha = 0.9; ctx.fillRect(x, y + h * 0.28, w, h * 0.38); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.ellipse(x + w / 2, y, w / 2, ry, 0, 0, 7); ctx.fillStyle = "#3d4651"; ctx.fill();
  if (lvl > 0.02){ ctx.beginPath(); ctx.ellipse(x + w / 2, y + 1, w / 2 - 2, ry - 1.5, 0, 0, 7); ctx.fillStyle = col; ctx.fill(); }
  ctx.strokeStyle = "#596370"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x + w / 2, y, w / 2, ry, 0, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + w / 2, y + 2, w * 0.55, PI * 1.1, PI * 1.9); ctx.stroke();
  ctx.restore();
}
/* tirelire ; lvl = remplissage (0 → 1) */
function m5pig(c, x, y, w, lvl){
  var ctx = c.ctx, h = w * 0.62, cx = x + w * 0.48, cy = y + h * 0.5;
  ctx.save();
  ctx.fillStyle = "#e58fa6"; [[0.25, 1], [0.62, 1]].forEach(function(l){ D.rrect(c, x + w * l[0], cy + h * 0.3, w * 0.1, h * 0.28, 3); ctx.fill(); });
  var g = ctx.createRadialGradient(cx - w * 0.12, cy - h * 0.2, 2, cx, cy, w * 0.5); g.addColorStop(0, "#ffd6e1"); g.addColorStop(1, "#e0869e");
  ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.42, h * 0.42, 0, 0, 7); ctx.fillStyle = g; ctx.fill();
  /* contenu : niveau de pièces */
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.36, h * 0.35, 0, 0, 7); ctx.clip();
  var top = cy + h * 0.35 - 2 * h * 0.35 * m5cl(lvl, 0, 1); var gc = ctx.createLinearGradient(0, top, 0, cy + h * 0.35); gc.addColorStop(0, "#ffe38a"); gc.addColorStop(1, "#c98b12"); ctx.fillStyle = gc; ctx.fillRect(cx - w * 0.4, top, w * 0.8, h); ctx.restore();
  ctx.strokeStyle = "#b5566f"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.42, h * 0.42, 0, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + w * 0.42, cy + h * 0.02, w * 0.07, h * 0.13, 0, 0, 7); ctx.fillStyle = "#f0a5b8"; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + w * 0.14, cy - h * 0.36); ctx.lineTo(cx + w * 0.24, cy - h * 0.56); ctx.lineTo(cx + w * 0.3, cy - h * 0.3); ctx.closePath(); ctx.fillStyle = "#e58fa6"; ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#3a2430"; ctx.beginPath(); ctx.arc(cx + w * 0.25, cy - h * 0.1, 1.8, 0, 7); ctx.fill();
  ctx.fillStyle = "#6e2b3d"; D.rrect(c, cx - w * 0.12, cy - h * 0.43, w * 0.2, 3.5, 1.5); ctx.fill();
  ctx.restore();
}

SFA.sim({
  id: "ma-integrale-impropre", ch: "c04", tag: "Intégrales impropres",
  titre: "Une aire infinie peut être finie : 1/xᵖ jusqu'à l'infini",
  resume: "Un peintre recouvre le mur sous la courbe 1/xᵖ en avançant vers l'infini (ou vers 0) : selon p, le pot de peinture se stabilise ou se vide sans fin. Le seuil p = 1 s'allume, et un onglet transforme l'aire en valeur d'une rente perpétuelle.",
  but: "Regarde le peintre avancer : le compteur donne la peinture utilisée, c'est-à-dire l'aire. Règle l'exposant p, attrape la borne (poignée rouge) pour la tirer vers l'infini ou vers 0, et lis en bas si l'aire se stabilise. L'onglet « Rente perpétuelle » remplace la courbe par un flux d'argent actualisé.",
  aRetenir: "Une intégrale impropre se définit par une limite : ∫<sub>1</sub><sup>+∞</sup> dx/xᵖ = lim<sub>b→+∞</sub> ∫<sub>1</sub><sup>b</sup> dx/xᵖ. Elle converge (vers 1/(p − 1)) si p &gt; 1 et diverge si p ≤ 1. Près de 0, c'est l'inverse : ∫<sub>0</sub><sup>1</sup> dx/xᵖ converge (vers 1/(1 − p)) si p &lt; 1 et diverge si p ≥ 1. p = 1 diverge dans les deux cas (la primitive est ln x). Rente perpétuelle : ∫<sub>0</sub><sup>+∞</sup> F·e<sup>−rt</sup> dt = F/r, et F/(r − g) si le flux croît au taux g &lt; r.",
  piege: "Une fonction qui tend vers 0 ne suffit pas : 1/x tend vers 0 et pourtant son aire jusqu'à l'infini est infinie. Et n'évalue jamais la primitive directement en une borne interdite : écris toujours la limite.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.98}); m5lay(c, 0.98, 1.42); c.cv.style.touchAction = "none";
    var md = k.seg("Situation", [["inf", "Borne infinie"], ["zero", "Fonction non bornée"], ["rente", "Rente perpétuelle"]], "inf", function(v){ setMode(v); });
    var sp = k.slider("Exposant p", 0.2, 3, 0.05, 2, "", function(){ st.auto = true; st.s = 0; st.hold = 0; });
    var ss = k.slider("Borne", 0, 4, 0.01, 0, "", function(){ st.auto = false; });
    var sF = k.slider("Flux annuel F", 1000, 20000, 500, 5000, "€/an");
    var sr = k.slider("Taux d'actualisation r", 1, 15, 0.5, 5, "%/an");
    var sg = k.slider("Croissance du flux g", 0, 10, 0.5, 0, "%/an");
    var st = {s: 0, auto: true, hold: 0, ph: 0, drag: false, coins: [], lastT: 0};
    var bRel = k.button("▶ Relancer le peintre", function(){ st.auto = true; st.s = 0; st.hold = 0; st.coins = []; }, true);
    var ro = k.readouts(["Borne", "Aire", "Limite", "Verdict"]), nt = k.note("", "");
    var roL = ro.el.querySelectorAll("small");
    var Gs = null, Gb = null, view = null;
    function smax(){ return md.value === "rente" ? 2.5 : 4; }
    function setMode(v){ if (bRel) bRel.textContent = v === "rente" ? "▶ Relancer le temps" : "▶ Relancer le peintre"; st.s = 0; st.auto = true; st.hold = 0; st.coins = [];
      if (v === "inf") sp.set(2); if (v === "zero") sp.set(0.5);
      ss.el.max = smax(); ss.set(0);
      [sp, ss].forEach(function(x){ m5show(x, true); }); m5show(sp, v !== "rente"); [sF, sr, sg].forEach(function(x){ m5show(x, v === "rente"); });
      var L = v === "inf" ? ["Borne b", "Aire de 1 à b (L)", "Limite si b → +∞", "Verdict"] : v === "zero" ? ["Borne c", "Aire de c à 1 (L)", "Limite si c → 0⁺", "Verdict"] : ["Horizon T", "Valeur sur [0 ; T]", "Rente F/(r − g)", "Part atteinte"];
      L.forEach(function(t, i){ if (roL[i]) roL[i].textContent = t; });
    }
    var lp = k.loop(function(dt){
      st.ph += dt * 2.4;
      if (st.auto && !st.drag){ if (st.hold > 0){ st.hold -= dt; if (st.hold <= 0){ st.s = 0; st.coins = []; } } else { st.s = Math.min(smax(), st.s + dt * smax() / 10); if (st.s >= smax()) st.hold = 1.6; } ss.set(st.s); }
      else st.s = ss.value;
      st.coins = st.coins.filter(function(q){ q.k += dt * 1.4; return q.k < 1; });
      k.redraw();
    });
    c.pointer(function(type, p){
      if (type === "down"){ st.px0 = p.x; st.s0 = st.s; st.drag = !!(view && Math.hypot(p.x - view.hx, p.y - view.hy) < 26) ? "s" : (Gb && p.x > Gb.L - 6 && p.x < Gb.R + 6 && p.y > Gb.T - 6 && p.y < Gb.B + 6 ? "g" : false); if (st.drag) st.auto = false; }
      if ((type === "down" || type === "drag") && st.drag){ var v;
        if (st.drag === "g") v = Gb.ix(p.x);
        else if (view.off) v = st.s0 + (p.x - st.px0) / 110; else { var x = view.ax.ix(p.x); if (md.value === "inf") v = Math.log10(Math.max(1, x)); else if (md.value === "zero") v = -Math.log10(m5cl(x, 1e-4, 1)); else v = Math.log10(Math.max(1, x)); if (md.value === "inf" && p.x > view.ax.R - 12) v = st.s + 0.04; if (md.value === "zero" && p.x < view.ax.L + 6) v = st.s + 0.04; }
        st.s = m5cl(v, 0, smax()); ss.set(st.s); k.redraw(); }
      if (type === "up") st.drag = false;
      if (type === "move") c.cv.style.cursor = view && Math.hypot(p.x - view.hx, p.y - view.hy) < 26 ? "grab" : "default";
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, mode = md.value, p = sp.value, s = m5cl(ss.value, 0, smax()), mob = W < 560;
      c.clear();
      var hs = Math.round(H * (mob ? 0.57 : 0.6));
      var Fl = sF.value, r = sr.value / 100, g = sg.value / 100;
      var bnd, area, lim, conv, fx, x0v, x1v, y1v, a0, a1, col, Aof;
      if (mode === "inf"){ bnd = Math.pow(10, s); area = m5A1(p, bnd); conv = p > 1 + 1e-9; lim = conv ? 1 / (p - 1) : Infinity; fx = function(x){ return Math.pow(x, -p); }; x1v = m5cl(1.3 * bnd, 4.2, 24); y1v = 1.42; a0 = 1; a1 = Math.min(bnd, x1v); col = "#2a8fa0"; Aof = function(u){ return m5A1(p, Math.pow(10, u)); }; }
      else if (mode === "zero"){ bnd = Math.pow(10, -s); area = m5A2(p, bnd); conv = p < 1 - 1e-9; lim = conv ? 1 / (1 - p) : Infinity; fx = function(x){ return Math.pow(x, -p); }; x1v = 1.5; y1v = m5cl(1.22 * Math.pow(bnd, -p), 2.6, 14); a0 = bnd; a1 = 1; col = "#2a8fa0"; Aof = function(u){ return m5A2(p, Math.pow(10, -u)); }; }
      else { bnd = Math.pow(10, s); area = m5PV(Fl, r, g, bnd); conv = r > g + 1e-12; lim = conv ? Fl / (r - g) : Infinity; fx = function(t){ return Fl * Math.exp(-(r - g) * t); }; x1v = m5cl(1.2 * bnd, 20, 110); y1v = 1.3 * Fl; a0 = 0; a1 = Math.min(bnd, x1v); col = "#d9a520"; Aof = function(u){ return m5PV(Fl, r, g, Math.pow(10, u)); }; }
      /* ------------------------------------------------ scène : le mur ------------------------------------------------ */
      var wall = ctx.createLinearGradient(0, 0, 0, hs); wall.addColorStop(0, mode === "rente" ? "#f4f1e8" : "#f5efe4"); wall.addColorStop(1, mode === "rente" ? "#e7e1d1" : "#e7dccb"); ctx.fillStyle = wall; ctx.fillRect(0, 0, W, hs);
      var rr = m5rnd(11); ctx.fillStyle = "rgba(120,100,70,.06)"; for (var i = 0; i < 90; i++){ ctx.fillRect(rr() * W, rr() * hs, 2, 2); }
      ctx.strokeStyle = "rgba(150,130,100,.10)"; ctx.lineWidth = 1; for (var yj = 26; yj < hs - 30; yj += 26){ ctx.beginPath(); ctx.moveTo(0, yj + 0.5); ctx.lineTo(W, yj + 0.5); ctx.stroke(); }
      var flH = 30, yFl = hs - flH; /* plancher */
      var gf = ctx.createLinearGradient(0, yFl, 0, hs); gf.addColorStop(0, "#b8875a"); gf.addColorStop(1, "#7d5634"); ctx.fillStyle = gf; ctx.fillRect(0, yFl, W, flH);
      ctx.strokeStyle = "rgba(60,35,15,.25)"; for (var pl = 0; pl < W; pl += 64){ ctx.beginPath(); ctx.moveTo(pl + 0.5, yFl); ctx.lineTo(pl + 0.5 - 10, hs); ctx.stroke(); }
      var L0 = 44, R0 = 12, T0 = 12;
      var ax = {x0: 0, x1: x1v, y0: 0, y1: y1v, L: L0, R: W - R0, T: T0, B: yFl};
      ax.X = function(x){ return L0 + x / x1v * (W - R0 - L0); }; ax.Y = function(y){ return yFl - y / y1v * (yFl - T0); }; ax.ix = function(px){ return (px - L0) / (W - R0 - L0) * x1v; };
      var off = mode !== "zero" && bnd > x1v * 0.97, Xs = off ? ax.R - 44 : ax.X(bnd), skipX = Xs;
      /* aire peinte */
      var N = 260, xa = Math.max(a0, 1e-9), xb = a1;
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.beginPath(); ctx.moveTo(ax.X(xa), ax.B);
      for (i = 0; i <= N; i++){ var xx = mode === "zero" ? xa * Math.pow(xb / xa, i / N) : xa + (xb - xa) * i / N; ctx.lineTo(ax.X(xx), Math.max(ax.T - 2, ax.Y(fx(xx)))); }
      ctx.lineTo(ax.X(xb), ax.B); ctx.closePath();
      var gp = ctx.createLinearGradient(0, ax.T, 0, ax.B); gp.addColorStop(0, mode === "rente" ? "#ffe28a" : "#58c3cf"); gp.addColorStop(1, col); ctx.fillStyle = gp; ctx.fill();
      ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 6; for (var sx = ax.X(xa); sx < ax.X(xb); sx += 15){ ctx.beginPath(); ctx.moveTo(sx, ax.T); ctx.lineTo(sx + 3, ax.B); ctx.stroke(); }
      ctx.restore();
      /* ruban de masquage (axes), mètre ruban au sol, règle verticale */
      ctx.fillStyle = "rgba(232,214,160,.95)"; ctx.fillRect(ax.L - 3, ax.T, 6, ax.B - ax.T);
      var tape = ctx.createLinearGradient(0, yFl + 4, 0, yFl + 22); tape.addColorStop(0, "#ffd84a"); tape.addColorStop(1, "#e0aa12"); ctx.fillStyle = tape; ctx.fillRect(ax.L - 3, yFl + 3, ax.R - ax.L + 3, 19);
      var xt = m5ticks(0, x1v, mob ? 4 : 6, function(v){ return m5grp(v, v < 10 && v % 1 ? 1 : 0); });
      ctx.save(); ctx.font = "800 9.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#3d2b00"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      xt.forEach(function(t){ var X = ax.X(t[0]); ctx.fillRect(X - 0.5, yFl + 3, 1, 5); if (X > ax.L + 8 && X < ax.R - 8 && Math.abs(X - skipX) > 24) ctx.fillText(t[1], X, yFl + 14); });
      ctx.textAlign = "left"; ctx.fillText(mode === "rente" ? "t (ans)" : "x (m)", ax.L + 2, yFl + 14); ctx.restore();
      var yt = m5ticks(0, y1v, mob ? 3 : 4, mode === "rente" ? function(v){ return m5grp(v / 1000, 0) + " k"; } : function(v){ return F(v, v < 10 ? 1 : 0); });
      ctx.save(); ctx.font = "700 10px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#6b5a3e"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      yt.forEach(function(t){ var Y = ax.Y(t[0]); if (Y < ax.T + 16 || t[0] === 0) return; ctx.fillRect(ax.L - 6, Y, 6, 1); ctx.fillText(t[1], ax.L - 8, Y); });
      ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillStyle = "#2c3a4e"; ctx.font = "800 10px Mulish, system-ui, sans-serif"; ctx.fillText(mode === "rente" ? "€/an" : "y (m)", 4, ax.T); ctx.restore();
      /* la courbe tracée au crayon (pointillée hors de l'intervalle d'intégration) */
      function crv(u0, u1, w, dash, alpha, logx){ ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 2); ctx.clip(); ctx.globalAlpha = alpha; ctx.strokeStyle = "#1c2b3f"; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); var st0 = false;
        for (var i = 0; i <= 400; i++){ var xx = logx ? u0 * Math.pow(u1 / u0, i / 400) : u0 + (u1 - u0) * i / 400, y = fx(xx); if (!isFinite(y)) continue; var Y = Math.max(ax.T - 30, ax.Y(y)); if (!st0){ ctx.moveTo(ax.X(xx), Y); st0 = true; } else ctx.lineTo(ax.X(xx), Y); } ctx.stroke(); ctx.restore(); }
      if (mode === "inf"){ crv(x1v / 4000, 1, 1.6, [5, 4], 0.45, true); crv(1, x1v, 2.4, null, 1, false); }
      else if (mode === "zero"){ crv(Math.min(bnd, 1e-4) * 0.5, 1, 2.4, null, 1, true); crv(1, x1v, 1.6, [5, 4], 0.45, false); D.line(c, ax.L + 3, ax.T, ax.L + 3, ax.B, "rgba(192,50,29,.55)", 1.5, [6, 4]); }
      else crv(0, x1v, 2.4, null, 1, false);
      /* peintre / pièces ; au-delà du cadre, le peintre reste au bord droit (flèche) */
      var hp = m5cl((ax.B - ax.T) * 0.42, 54, 96);
      if (mode !== "rente"){
        var fb = fx(bnd), topY = Math.max(ax.T + 4, ax.Y(fb)), rh = (ax.B - topY - 8) * (0.5 + 0.5 * Math.sin(st.ph)), ry = ax.B - 6 - Math.max(0, rh);
        var rx = mode === "inf" ? Xs - 8 : Xs + 9;
        /* « Fonction non bornée » : le peintre se tient juste après x = 1 ; l'étiquette de la courbe va à sa droite, hors de portée de la perche */
        var pxP = mode === "inf" ? Math.min(Xs + 26, ax.R - 12) : ax.X(1.1), hdx = pxP + (mode === "inf" ? -14 : -16) * hp / 100, hdy = ax.B - hp * 0.62;
        ctx.save(); ctx.strokeStyle = "#8a6a43"; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hdx, hdy); ctx.lineTo(rx, ry + 5); ctx.stroke(); ctx.restore();
        m5roller(ctx, rx, ry, 18, "#2a8fa0");
        m5painter(ctx, pxP, ax.B + 2, hp, hdx, hdy);
        view = {ax: ax, hx: Xs, hy: ax.B - 2, off: off};
        D.line(c, Xs, ax.T, Xs, ax.B, "rgba(192,50,29,.5)", 1.4, [4, 4]);
        m5hnd(c, Xs, ax.B - 2, P.red, 6.5);
        var lb = mode === "inf" ? "b = " + m5grp(bnd, bnd < 100 ? 2 : 0) + " m" + (off ? " →" : "") : "c = " + F(bnd, 3) + " m";
        if (mode === "zero" && bnd < 0.01){ var e = Math.floor(Math.log10(bnd) + 1e-9), mm = bnd / Math.pow(10, e); lb = "c = " + F(mm, 2) + "·10" + m5sup(e) + " m"; }
        /* étiquettes posées sur la peinture : pastille rouge opaque et texte blanc (lisibles sur le bleu) */
        var lw = m5tagW(c, lb, 11);
        var lxp = mode === "inf" ? Xs - lw / 2 - 14 : Xs + lw / 2 + 14;
        if (mode === "inf" && lxp - lw / 2 < ax.L + 4) lxp = Xs + lw / 2 + 14 + hp * 0.22;
        lxp = m5cl(lxp, ax.L + lw / 2 + 4, ax.R - lw / 2 - 2);
        m5tag(c, lb, lxp, ax.B - hp - 14, 11);
        if (ax.Y(fb) < ax.T){ var hl = "hauteur en c : " + m5big(fb, 1) + " m ↑", hlw = m5tagW(c, hl, 10.5);
          /* ne pas passer sous la jauge (en haut à droite) : sinon on la décale vers la gauche, puis sous la jauge */
          var gL = W - (mob ? 136 : 168) - 16, hlx = m5cl(Xs + 26 + hlw / 2, ax.L + hlw / 2 + 2, ax.R - hlw / 2 - 4), hly = ax.T + 13;
          if (hlx + hlw / 2 > gL){ hlx = Math.max(ax.L + hlw / 2 + 2, gL - hlw / 2); if (hlx + hlw / 2 > gL) hly = 10 + (mob ? 66 : 74) + 14; }
          m5tag(c, hl, hlx, hly, 10.5); }
      } else {
        var XT = Xs; view = {ax: ax, hx: XT, hy: ax.B - 2, off: off};
        /* pièces actualisées au sol : une par année si la place le permet */
        var pxYear = ax.X(1) - ax.X(0);
        if (pxYear >= 7){ for (var yr = 0; yr < Math.min(bnd, x1v); yr++){ var dfc = Math.exp(-(r - g) * (yr + 0.5)), cr = m5cl(Math.min(pxYear * 0.42, 9) * Math.sqrt(dfc), 1.2, 9); var cxp = ax.X(yr + 0.5), cyp = ax.B - cr - 1;
          var gc = ctx.createRadialGradient(cxp - cr * 0.3, cyp - cr * 0.3, 0.5, cxp, cyp, cr); gc.addColorStop(0, "#fff3b0"); gc.addColorStop(1, "#b07d0c"); ctx.beginPath(); ctx.arc(cxp, cyp, cr, 0, 7); ctx.fillStyle = gc; ctx.fill(); } }
        if (Math.floor(bnd) > st.lastT && st.auto) st.coins.push({x: XT, y: Math.max(ax.T, ax.Y(fx(bnd))), k: 0, r: m5cl(8 * Math.sqrt(Math.exp(-(r - g) * bnd)), 2, 8)}); st.lastT = Math.floor(bnd);
        D.line(c, XT, ax.T, XT, ax.B, "rgba(192,50,29,.5)", 1.4, [4, 4]); m5hnd(c, XT, ax.B - 2, P.red, 6.5);
        var lbT = "T = " + m5grp(bnd, bnd < 10 ? 1 : 0) + " ans" + (off ? " →" : ""), lwT = m5tagW(c, lbT, 11);
        m5tag(c, lbT, m5cl(off ? XT - lwT / 2 - 12 : XT + lwT / 2 + 12, ax.L + lwT / 2 + 2, ax.R - lwT / 2 - 2), ax.B - 26, 11);
      }
      /* étiquette de la courbe, exposant dessiné en vrai exposant */
      var cLab = mode === "rente" ? "y = F·e⁻⁽ʳ⁻ᵍ⁾ᵗ" : "y = 1/xᵖ", cOpt = {size: 12.5, color: "#1c2b3f", align: "left", math: true, halo: "rgba(255,255,255,.95)"}, cW = m5rich(c, cLab, 0, 0, {size: 12.5, math: true, measure: true});
      if (mode === "zero"){ var cxL = Math.min(pxP + 0.16 * hp + 6, ax.R - 2 - cW), cxd = ax.ix(cxL + cW / 2);
        m5rich(c, cLab, cxL, Math.max(ax.T + 10, ax.Y(fx(cxd)) - 14), cOpt); }
      else { var lx = mode === "inf" ? Math.min(x1v * 0.08 + 1.2, 2.2) : x1v * 0.1, lyv = fx(lx);
        m5rich(c, cLab, ax.X(lx) + 8, Math.max(ax.T + 10, ax.Y(lyv) - 12), cOpt); }
      /* jauge en haut à droite : pot(s) de peinture ou tirelire */
      var gw = mode === "rente" ? (mob ? 162 : 182) : (mob ? 136 : 168), gh2 = mob ? 66 : 74, gx0 = W - gw - 10, gy0 = 10;
      D.panel(c, gx0, gy0, gw, gh2, {fill: "rgba(255,255,255,.93)"});
      if (mode !== "rente"){
        var full = Math.floor(area + 1e-9), frac = area - full, cw = mob ? 22 : 26;
        m5can(c, gx0 + 10, gy0 + 20, cw, cw * 1.05, 1 - frac, "#2a8fa0");
        D.text(c, "peinture utilisée", gx0 + 18 + cw, gy0 + 16, {size: 9.5, color: "#5f6b7a", align: "left", weight: 800});
        m5rich(c, m5big(area) + " L", gx0 + 18 + cw, gy0 + 36, {size: mob ? 15 : 17, color: P.ink, align: "left", weight: 800, mono: true});
        /* rangée de pots pleins + compteur « +N » : le compteur reste dans le cadre de la jauge (on retire des pots s'il le faut) */
        var nC = Math.min(full, mob ? 5 : 6), more = function(n){ return "+" + m5big(full - n, 0); }, cntO = {size: 9.5, color: "#5f6b7a", align: "left", weight: 800};
        while (nC > 0 && full > nC && gx0 + 22 + cw + nC * 12 + m5rich(c, more(nC), 0, 0, {size: 9.5, weight: 800, measure: true}) > gx0 + gw - 6) nC--;
        for (var q = 0; q < nC; q++){ m5can(c, gx0 + 18 + cw + q * 12, gy0 + gh2 - 15, 8, 7, 0, "#9aa5b4"); }
        if (full > nC) m5rich(c, more(nC), gx0 + (nC ? 22 : 18) + cw + nC * 12, gy0 + gh2 - 12, cntO);
        if (full === 0) D.text(c, "1 L par m² de mur", gx0 + 18 + cw, gy0 + gh2 - 13, {size: 9, color: "#7b8694", align: "left", weight: 700});
      } else {
        var lvl = conv ? area / lim : Math.min(1, area / (Fl * 300));
        m5pig(c, gx0 + 6, gy0 + 12, mob ? 50 : 58, lvl);
        D.text(c, "valeur présente", gx0 + (mob ? 62 : 72), gy0 + 16, {size: 9.5, color: "#5f6b7a", align: "left", weight: 800});
        m5rich(c, m5eur(area), gx0 + (mob ? 62 : 72), gy0 + 36, {size: mob ? 13.5 : 15, color: P.ink, align: "left", weight: 800, mono: true});
        D.text(c, conv ? m5pct(area / lim) + " % de la rente" : "r ≤ g : sans fin", gx0 + (mob ? 62 : 72), gy0 + gh2 - 14, {size: 9.5, color: conv ? P.green : P.red, align: "left", weight: 800});
        st.coins.forEach(function(q){ var u = q.k, x = q.x + (gx0 + 30 - q.x) * u, y = q.y + (gy0 + 30 - q.y) * u - Math.sin(u * PI) * 50; var gc = ctx.createRadialGradient(x - 1, y - 1, 0.5, x, y, q.r); gc.addColorStop(0, "#fff3b0"); gc.addColorStop(1, "#b07d0c"); ctx.beginPath(); ctx.arc(x, y, q.r, 0, 7); ctx.fillStyle = gc; ctx.fill(); });
      }
      /* ------------------------------------------------ bas : aire en fonction de la borne + verdict ------------------------------------------------ */
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, hs, W, H - hs); ctx.fillStyle = "rgba(15,27,45,.06)"; ctx.fillRect(0, hs, W, 2);
      var vw = mob ? Math.round(W * 0.4) : Math.round(W * 0.34), gbx = {x: 0, y: hs + 4, w: W - vw, h: H - hs - 4}, vbx = {x: W - vw, y: hs + 4, w: vw, h: H - hs - 4};
      var Smax = smax(), aEnd = Aof(Smax), yTop = conv ? Math.max(lim, aEnd) * 1.15 : aEnd * 1.12; if (!(yTop > 0)) yTop = 1;
      var xtb = mode === "inf" ? [[0, "1"], [1, "10"], [2, "100"], [3, "10³"], [4, "10⁴"]] : mode === "zero" ? [[0, "1"], [1, "0,1"], [2, "0,01"], [3, "10⁻³"], [4, "10⁻⁴"]] : [[0, "1"], [1, "10"], [2, "100"]];
      var yfmt = mode === "rente" ? function(v){ return v >= 1e6 ? m5big(v / 1000) : m5grp(v / 1000, 0); } : function(v){ return v >= 1e4 ? m5big(v) : v >= 100 ? m5grp(v, 0) : F(v, 2); };
      var ax2 = m5axBox(c, gbx, {x0: 0, x1: Smax, y0: 0, y1: yTop, l: mode === "rente" ? 40 : 44, r: 12, t: 26, b: 34, xt: xtb, yt: m5ticks(0, yTop, 4, yfmt), yl: mode === "inf" ? "aire de 1 à b" : mode === "zero" ? "aire de c à 1" : "valeur (k€)"}); Gb = ax2;
      D.text(c, mode === "inf" ? "b (échelle log)" : mode === "zero" ? "c → 0 (échelle log)" : "T en années (log)", ax2.R, ax2.B + 24, {size: 10, color: "#2c3a4e", align: "right", weight: 700});
      if (conv && lim <= yTop){ D.line(c, ax2.L, ax2.Y(lim), ax2.R, ax2.Y(lim), P.green, 1.6, [6, 4]); m5txt(c, "limite " + (mode === "rente" ? m5grp(lim / 1000, 1) + " k€" : F(lim, 3)), ax2.L + 6, ax2.Y(lim) - 9, {size: 10.5, color: P.green, align: "left"}); }
      ctx.save(); ctx.beginPath(); ctx.rect(ax2.L, ax2.T - 2, ax2.R - ax2.L, ax2.B - ax2.T + 2); ctx.clip();
      ctx.strokeStyle = "rgba(31,75,158,.28)"; ctx.lineWidth = 2; ctx.beginPath(); for (i = 0; i <= 200; i++){ var u = Smax * i / 200, Y = ax2.Y(Aof(u)); i ? ctx.lineTo(ax2.X(u), Y) : ctx.moveTo(ax2.X(u), Y); } ctx.stroke();
      ctx.strokeStyle = conv ? P.green : P.red; ctx.lineWidth = 3; ctx.beginPath(); for (i = 0; i <= 200; i++){ u = s * i / 200; Y = ax2.Y(Aof(u)); i ? ctx.lineTo(ax2.X(u), Y) : ctx.moveTo(ax2.X(u), Y); } ctx.stroke(); ctx.restore();
      D.dot(c, ax2.X(s), ax2.Y(area), 5.5, conv ? P.green : P.red);
      if (!conv) D.arrow(c, ax2.R - 8, ax2.T + 26, ax2.R - 8, ax2.T + 4, P.red, 2);
      /* verdict */
      D.panel(c, vbx.x + 4, vbx.y + 6, vbx.w - 12, vbx.h - 14, {fill: conv ? "rgba(231,246,239,.95)" : "rgba(252,236,232,.95)", stroke: conv ? "rgba(36,119,90,.4)" : "rgba(192,50,29,.4)", title: "Verdict"});
      var vx = vbx.x + 14, vyy = vbx.y + 38, vsz = mob ? 15 : 18;
      D.text(c, conv ? "converge" : "diverge", vx, vyy, {size: vsz, color: conv ? P.green : P.red, align: "left", weight: 800});
      var formula = mode === "inf" ? (conv ? "vers 1/(p − 1) = " + F(lim, 3) : (Math.abs(p - 1) < 1e-9 ? "ln b → +∞" : "b¹⁻ᵖ → +∞")) : mode === "zero" ? (conv ? "vers 1/(1 − p) = " + F(lim, 3) : (Math.abs(p - 1) < 1e-9 ? "−ln c → +∞" : "c¹⁻ᵖ → +∞")) : (conv ? "vers " + m5grp(lim, 0) + " €" : (Math.abs(r - g) < 1e-12 ? "r = g : F·T → +∞" : "r < g : croît comme e⁽ᵍ⁻ʳ⁾ᵀ" + (mob ? "" : " → +∞")));
      /* r = g : la valeur vaut F·T (croissance linéaire) ; r < g : elle croît exponentiellement, F(e^{(g−r)T} − 1)/(g − r) */
      var fmz = mob ? 10.5 : 11.5, fmw = m5rich(c, formula, 0, 0, {size: fmz, weight: 700, measure: true}), fmA = vbx.w - 30; if (fmw > fmA) fmz = Math.max(8.5, fmz * fmA / fmw);
      m5rich(c, formula, vx, vyy + vsz + 4, {size: fmz, color: P.ink, align: "left", weight: 700});
      /* barre du seuil */
      var bx0 = vx, bx1 = vbx.x + vbx.w - 20, by = Math.min(vbx.y + vbx.h - 34, vyy + vsz + 46), bvMax = mode === "rente" ? 15 : 3, thr = mode === "rente" ? sr.value : 1, cur = mode === "rente" ? sg.value : p;
      var BX = function(v){ return bx0 + v / bvMax * (bx1 - bx0); };
      var goodRight = mode === "inf", near = Math.abs(cur - thr) < 0.051 * (mode === "rente" ? 10 : 1), pulse = near ? 0.5 + 0.5 * Math.sin(st.ph * 2.2) : 0;
      ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = 8;
      ctx.strokeStyle = goodRight ? "rgba(192,50,29,.55)" : "rgba(36,119,90,.55)"; ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(BX(thr), by); ctx.stroke();
      ctx.strokeStyle = goodRight ? "rgba(36,119,90,.55)" : "rgba(192,50,29,.55)"; ctx.beginPath(); ctx.moveTo(BX(thr), by); ctx.lineTo(bx1, by); ctx.stroke(); ctx.restore();
      D.glow(c, BX(thr), by, 14 + 10 * pulse, "#f4c542", 0.45 + 0.4 * pulse); D.line(c, BX(thr), by - 9, BX(thr), by + 9, "#7a5a00", 2);
      m5txt(c, mode === "rente" ? "g = r" : "p = 1", BX(thr), by + 18, {size: 10, color: "#7a5a00", halo: false});
      var fl1 = mode === "inf" ? "aire de 1 à b :" : mode === "zero" ? "aire de c à 1 :" : "valeur sur [0 ; T] :", fl2 = mode === "inf" ? (Math.abs(p - 1) < 1e-9 ? "ln b" : "(b¹⁻ᵖ − 1)/(1 − p)") : mode === "zero" ? (Math.abs(p - 1) < 1e-9 ? "−ln c" : "(1 − c¹⁻ᵖ)/(1 − p)") : (Math.abs(r - g) < 1e-12 ? "F·T" : "F(1 − e⁻⁽ʳ⁻ᵍ⁾ᵀ)/(r − g)");
      if (by + 64 < vbx.y + vbx.h - 8){ D.text(c, fl1, vx, by + 40, {size: 10, color: "#5f6b7a", align: "left", weight: 700}); var f2z = mob ? 11 : 12.5, f2w = m5rich(c, fl2, 0, 0, {size: f2z, weight: 600, math: true, measure: true}); if (f2w > vbx.w - 30) f2z = Math.max(8.5, f2z * (vbx.w - 30) / f2w);
        m5rich(c, fl2, vx, by + 58, {size: f2z, color: P.ink, align: "left", weight: 600, math: true}); }
      ctx.beginPath(); ctx.moveTo(BX(cur), by - 6); ctx.lineTo(BX(cur) - 6, by - 15); ctx.lineTo(BX(cur) + 6, by - 15); ctx.closePath(); ctx.fillStyle = P.ink; ctx.fill();
      m5txt(c, (mode === "rente" ? "g" : "p") + " = " + F(cur, 2), m5cl(BX(cur), bx0 + 18, bx1 - 18), by - 23, {size: 10, color: P.ink, halo: false});
      /* ------------------------------------------------ lectures ------------------------------------------------ */
      if (mode === "inf"){ ro.set(0, m5grp(bnd, bnd < 100 ? 2 : 0)); ro.set(1, m5big(area, 4)); ro.set(2, conv ? F(lim, 4) : "+∞"); ro.set(3, conv ? "converge" : "diverge"); m5out(ss, "b = " + m5grp(bnd, bnd < 100 ? 2 : 0)); }
      else if (mode === "zero"){ ro.set(0, bnd >= 0.001 ? F(bnd, 4) : S.sci(bnd, 2)); ro.set(1, m5big(area, 4)); ro.set(2, conv ? F(lim, 4) : "+∞"); ro.set(3, conv ? "converge" : "diverge"); m5out(ss, "c = " + (bnd >= 0.001 ? F(bnd, 4) : S.sci(bnd, 2))); }
      else { ro.set(0, m5grp(bnd, bnd < 10 ? 1 : 0) + " ans"); ro.set(1, m5eur(area)); ro.set(2, conv ? m5eur(lim) : "+∞ (r ≤ g)"); ro.set(3, conv ? m5pct(area / lim) + " %" : "—"); m5out(ss, "T = " + m5grp(bnd, bnd < 10 ? 1 : 0) + " ans"); }
      var html, kind = conv ? "ok" : "bad";
      if (mode === "inf") html = conv ? "p = " + F(p, 2) + " &gt; 1 : ∫<sub>1</sub><sup>b</sup> dx/x<sup>p</sup> = (1 − b<sup>1−p</sup>)/(p − 1) et b<sup>1−p</sup> → 0. Le mur est infiniment long, mais pour le couvrir en entier il suffit de " + F(lim, 3) + " L de peinture." : (Math.abs(p - 1) < 1e-9 ? "p = 1 : la primitive est ln b, qui tend vers +∞ (lentement : ln 10⁴ ≈ 9,2). C'est le cas critique : divergence." : "p = " + F(p, 2) + " &lt; 1 : b<sup>1−p</sup> → +∞, l'aire grandit sans limite. La fonction tend vers 0, mais trop lentement.");
      else if (mode === "zero") html = conv ? "p = " + F(p, 2) + " &lt; 1 : ∫<sub>c</sub><sup>1</sup> dx/x<sup>p</sup> = (1 − c<sup>1−p</sup>)/(1 − p) et c<sup>1−p</sup> → 0. La fonction explose en 0, mais l'aire reste finie : il suffit de " + F(lim, 3) + " L de peinture pour couvrir tout le mur." : (Math.abs(p - 1) < 1e-9 ? "p = 1 : l'aire vaut −ln c, qui tend vers +∞ quand c → 0⁺. Divergence." : "p = " + F(p, 2) + " &gt; 1 : c<sup>1−p</sup> → +∞, divergence. Près de 0, ce sont les petits exposants qui convergent : le critère est inversé.");
      else html = conv ? "Valeur présente sur [0 ; T] : F(1 − e<sup>−(r−g)T</sup>)/(r − g). Quand T → +∞, elle tend vers F/(r − g) = " + m5grp(Fl, 0) + "/" + F(r - g, 3) + " = " + m5grp(lim, 0) + " €. Les années lointaines, écrasées par l'actualisation, ne comptent presque plus." : (Math.abs(r - g) < 1e-12
          ? "g = r : la croissance compense exactement l'actualisation, chaque année pèse F. La valeur sur [0 ; T] vaut F·T, qui tend vers +∞ (croissance linéaire) : la rente n'a pas de valeur finie."
          : "g &gt; r : la croissance l'emporte sur l'actualisation, chaque année pèse plus que la précédente. La valeur sur [0 ; T] vaut F(e<sup>(g−r)T</sup> − 1)/(g − r) : elle tend vers +∞ de façon exponentielle, bien plus vite que F·T. La rente n'a pas de valeur finie.");
      nt.set(html, kind);
    });
    setMode("inf"); lp.play();
  }
});
})();
