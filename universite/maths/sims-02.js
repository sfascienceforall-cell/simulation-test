(function(){
var P = SFA.draw.palette, F = SFA.fmt, D = SFA.draw, PI = Math.PI;
function simpson(f, a, b, n){ n = n || 600; if (n % 2) n++; var h = (b - a) / n, s = f(a) + f(b); for (var i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; }
function dd(f, x, h){ h = h || 1e-5; return (f(x + h) - f(x - h)) / (2 * h); }
function cl(x, a, b){ return Math.max(a, Math.min(b, x)); }
function lab(c, s, x, y, col, size, al, bg){ D.text(c, s, x, y, {color: col || P.ink, size: size || 13, align: al || "center", math: true, weight: 600, bg: bg}); }
function pt(c, ax, x, y, col, r){ var ctx = c.ctx, X = ax.X(x), Y = ax.Y(y); ctx.beginPath(); ctx.arc(X, Y, (r || 5) + 2, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.beginPath(); ctx.arc(X, Y, r || 5, 0, 7); ctx.fillStyle = col; ctx.fill(); }
function vl(c, ax, x, col, dash, w){ D.line(c, ax.X(x), ax.T, ax.X(x), ax.B, col, w || 1.5, dash || [5, 4]); }
function hl(c, ax, y, col, dash, w){ D.line(c, ax.L, ax.Y(y), ax.R, ax.Y(y), col, w || 1.5, dash || [5, 4]); }
function curve(c, ax, fx, fy, t0, t1, col, w, dash, n){ var ctx = c.ctx; n = n || 500; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; if (dash) ctx.setLineDash(dash); ctx.beginPath(); var st = false; for (var i = 0; i <= n; i++){ var t = t0 + (t1 - t0) * i / n, x = fx(t), y = fy(t); if (!isFinite(x) || !isFinite(y)){ st = false; continue; } if (!st){ ctx.moveTo(ax.X(x), ax.Y(y)); st = true; } else ctx.lineTo(ax.X(x), ax.Y(y)); } ctx.stroke(); ctx.restore(); }
function fillArea(c, ax, f, g, a, b, col){ var ctx = c.ctx, n = 240; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.fillStyle = col; ctx.beginPath(); for (var i = 0; i <= n; i++){ var x = a + (b - a) * i / n; ctx.lineTo(ax.X(x), ax.Y(f(x))); } for (i = n; i >= 0; i--){ x = a + (b - a) * i / n; ctx.lineTo(ax.X(x), ax.Y(g(x))); } ctx.closePath(); ctx.fill(); ctx.restore(); }
/* ---- aides de la refonte (novembre 2026) : dessin et graphe côte à côte (empilés sur téléphone), repère dans une boîte, poignées ---- */
function lay2(c, wide, tall){ var r0 = c.resize; c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < 560) ? tall : wide; r0(); }; c.resize(); }
function split2(c, f, g){ var W = c.W, H = c.H; if (W < 560){ var h = Math.round(H * (g || f)); return [{x:0, y:0, w:W, h:h}, {x:0, y:h, w:W, h:H - h}]; } var w = Math.round(W * f); return [{x:0, y:0, w:w, h:H}, {x:w, y:0, w:W - w, h:H}]; }
function axIn(c, b, o){ var q = {}, key; for (key in o) q[key] = o[key]; q.l = b.x + (o.l || 46); q.r = c.W - b.x - b.w + (o.r || 14); q.t = b.y + (o.t || 16); q.b = c.H - b.y - b.h + (o.b || 34); return D.axes(c, q); }
function rnd(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hnd(c, x, y, col, txt){ if (!isFinite(x) || !isFinite(y)) return; var ctx = c.ctx; D.glow(c, x, y, 20, col, 0.3); ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); ctx.restore(); D.dot(c, x, y, 7, col); if (txt) D.text(c, txt, x + 15, y - 15, {size:10.5, color:col, align:"left", weight:700, halo:true}); }
function frame(c, b, title, col){ D.panel(c, b.x + 4, b.y + 4, b.w - 8, b.h - 8, {shadow:false, fill:"rgba(248,250,252,.9)", title:title, titleColor:col}); }
/* repère dans une boîte avec graduations choisies : o.xt / o.yt = [[valeur, "texte"], …] */
function axBox(c, b, o){
  var L = b.x + (o.l || 40), R = b.x + b.w - (o.r || 12), T = b.y + (o.t || 14), B = b.y + b.h - (o.b || 28), ctx = c.ctx;
  var ax = {x0: o.x0, x1: o.x1, y0: o.y0, y1: o.y1, L: L, R: R, T: T, B: B};
  ax.X = function(x){ return L + (x - o.x0) / (o.x1 - o.x0) * (R - L); }; ax.Y = function(y){ return B - (y - o.y0) / (o.y1 - o.y0) * (B - T); };
  ax.ix = function(px){ return o.x0 + (px - L) / (R - L) * (o.x1 - o.x0); }; ax.iy = function(py){ return o.y0 + (B - py) / (B - T) * (o.y1 - o.y0); };
  var y0p = (!o.xb && o.y0 <= 0 && o.y1 >= 0) ? ax.Y(0) : B, x0p = (o.x0 <= 0 && o.x1 >= 0) ? ax.X(0) : L;
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "#eef1f5"; ctx.beginPath();
  (o.xt || []).forEach(function(t){ var p = Math.round(ax.X(t[0])) + 0.5; ctx.moveTo(p, T); ctx.lineTo(p, B); });
  (o.yt || []).forEach(function(t){ var p = Math.round(ax.Y(t[0])) + 0.5; ctx.moveTo(L, p); ctx.lineTo(R, p); }); ctx.stroke();
  ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(L, y0p); ctx.lineTo(R, y0p); ctx.moveTo(x0p, T); ctx.lineTo(x0p, B); ctx.stroke();
  ctx.font = "600 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#7b8694"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  (o.xt || []).forEach(function(t){ if (t[1]) ctx.fillText(t[1], ax.X(t[0]), Math.min(B, y0p) + 5); });
  ctx.textAlign = "right"; ctx.textBaseline = "middle"; (o.yt || []).forEach(function(t){ if (t[1]) ctx.fillText(t[1], x0p - 5, ax.Y(t[0])); });
  ctx.font = "700 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#2c3a4e";
  if (o.xl){ ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xl, R, y0p - 4); }
  if (o.yl){ ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yl, x0p + 6, T); }
  ctx.restore(); return ax;
}
/* Mathématiques BA1 · chapitre 2 : limites, continuité, asymptotes */
/* 1 ---- epsilon-delta ---- */
var E1 = {
  trou: {n: "f(x) = (x² − 1)/(x − 1)", a: 1, L: 2, f: function(x){ return (x * x - 1) / (x - 1); }, note: "f n'est pas définie en x = 1, mais la limite existe : elle vaut 2."},
  sinc: {n: "f(x) = sin x / x", a: 0, L: 1, f: function(x){ return Math.sin(x) / x; }, note: "Limite remarquable : sin x / x tend vers 1 en 0."},
  lin: {n: "f(x) = 3x − 2", a: 2, L: 4, f: function(x){ return 3 * x - 2; }, note: "Pour une droite de pente 3, δ = ε/3 convient exactement."},
  osc: {n: "f(x) = x·sin(1/x)", a: 0, L: 0, f: function(x){ return x * Math.sin(1 / x); }, note: "La courbe oscille de plus en plus vite mais reste enfermée entre y = x et y = −x : la limite est 0."}
};
function dmax1(T, eps){ var st = 0.0005; for (var d = st; d < 3; d += st){ if (Math.abs(T.f(T.a + d) - T.L) >= eps || Math.abs(T.f(T.a - d) - T.L) >= eps) return d - st; } return 3; }
SFA.sim({
  id: "um-c02-epsilon-delta", ch: "c02", tag: "Définition de la limite",
  titre: "La limite comme un défi : pour tout ε, trouve un δ",
  resume: "Impose une tolérance ε sur les ordonnées ; cherche la largeur δ sur les abscisses qui garantit que la courbe reste dans la bande.",
  but: "Choisis une fonction, fixe ε en glissant un bord de la bande horizontale (orange), puis règle δ en glissant un bord de la bande verticale (bleue). Les points de la courbe qui sortent de la bande horizontale sont en rouge. Défi : trouve le plus grand δ qui marche.",
  aRetenir: "lim<sub>x→a</sub> f(x) = L signifie : ∀ε > 0, ∃δ > 0, 0 < |x − a| < δ ⇒ |f(x) − L| < ε. On exclut x = a : la valeur f(a) n'intervient pas. Plus ε diminue, plus δ doit diminuer.",
  piege: "La limite ne dépend pas de f(a) (qui peut ne pas exister). Un δ qui marche pour un ε ne marche pas forcément pour un ε plus petit.",
  build: function(k, S){
    var c = k.canvas(380), fs = k.select("Fonction", [["trou", "(x² − 1)/(x − 1) en 1"], ["sinc", "sin x / x en 0"], ["lin", "3x − 2 en 2"], ["osc", "x·sin(1/x) en 0"]], "trou");
    var eps = k.slider("ε (tolérance sur y)", 0.05, 1.5, 0.05, 0.5, ""), dl = k.slider("δ (largeur sur x)", 0.01, 1.5, 0.01, 0.2, "");
    k.button("Placer δ au maximum", function(){ dl.set(Math.min(1.5, Math.max(0.01, Math.floor(dmax1(E1[fs.value], eps.value) * 100) / 100))); });
    var ro = k.readouts(["a", "L", "δ maximal ≈", "Verdict"]), nt = k.note("", ""), AXE = null, gb = null;
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (!AXE) return; var T = E1[fs.value], ax = AXE;
      if (t === "down"){ gb = null; var de = Math.min(Math.abs(p.y - ax.Y(T.L + eps.value)), Math.abs(p.y - ax.Y(T.L - eps.value))), ddl = Math.min(Math.abs(p.x - ax.X(T.a + dl.value)), Math.abs(p.x - ax.X(T.a - dl.value))); if (Math.min(de, ddl) < 18) gb = de < ddl ? "e" : "d"; }
      else if (t === "drag" && gb){ if (gb === "e") eps.set(Math.round(cl(Math.abs(ax.iy(p.y) - T.L), 0.05, 1.5) * 20) / 20); else dl.set(Math.round(cl(Math.abs(ax.ix(p.x) - T.a), 0.01, 1.5) * 100) / 100); k.redraw(); }
      else if (t === "up") gb = null;
      else if (t === "move"){ var d1 = Math.min(Math.abs(p.y - ax.Y(T.L + eps.value)), Math.abs(p.y - ax.Y(T.L - eps.value))), d2 = Math.min(Math.abs(p.x - ax.X(T.a + dl.value)), Math.abs(p.x - ax.X(T.a - dl.value))); c.cv.style.cursor = d1 < 18 && d1 <= d2 ? "ns-resize" : d2 < 18 ? "ew-resize" : "default"; } });
    k.draw(function(){
      c.clear(); var T = E1[fs.value], a = T.a, L = T.L, e = eps.value, d = dl.value;
      var ax = D.axes(c, {x0: a - 2, x1: a + 2, y0: L - 2.5, y1: L + 2.5, stepX: 0.5, stepY: 0.5, xl: "x", yl: "y"}); AXE = ax;
      var ctx = c.ctx; ctx.fillStyle = "rgba(180,83,9,.13)"; ctx.fillRect(ax.L, ax.Y(L + e), ax.R - ax.L, ax.Y(L - e) - ax.Y(L + e));
      ctx.fillStyle = "rgba(30,63,143,.10)"; ctx.fillRect(ax.X(a - d), ax.T, ax.X(a + d) - ax.X(a - d), ax.B - ax.T);
      hl(c, ax, L + e, P.amber, [5, 4], 1.4); hl(c, ax, L - e, P.amber, [5, 4], 1.4); vl(c, ax, a - d, P.acc, [5, 4], 1.4); vl(c, ax, a + d, P.acc, [5, 4], 1.4);
      D.fn(c, ax, T.f, P.acc, 2.4);
      var bad = false, n = 1200; for (var i = 0; i <= n; i++){ var x = a - d + 2 * d * i / n; if (Math.abs(x - a) < 1e-9) continue; var y = T.f(x); if (!isFinite(y)) continue; if (Math.abs(y - L) >= e){ bad = true; D.dot(c, ax.X(x), ax.Y(y), 2.4, P.red); } }
      if (fs.value === "trou") { var X = ax.X(a), Y = ax.Y(L), cx = c.ctx; cx.beginPath(); cx.arc(X, Y, 5, 0, 7); cx.fillStyle = "#fff"; cx.fill(); cx.lineWidth = 2; cx.strokeStyle = P.acc; cx.stroke(); }
      lab(c, "L + ε", ax.R - 4, ax.Y(L + e) - 9, P.amber, 12, "right"); lab(c, "L − ε", ax.R - 4, ax.Y(L - e) + 10, P.amber, 12, "right");
      var dm = dmax1(T, e); ro.set(0, F(a, 0)); ro.set(1, F(L, 0)); ro.set(2, dm >= 3 ? "> 3" : F(dm, 3)); ro.set(3, bad ? "δ trop grand" : "δ convient");
      nt.set(bad ? "Des points sortent de la bande horizontale : diminue δ." : "Toute la partie de courbe dans la bande verticale reste dans la bande horizontale (sauf en x = a, exclu). " + T.note, bad ? "warn" : "ok");
    });
  }
});

/* 2 ---- limites latérales et continuité ---- */
var A2 = {
  cont: {n: "x²", a: 1, f: function(x){ return x * x; }, fa: 1, typ: "continue"},
  trou: {n: "(x² − 4)/(x − 2)", a: 2, f: function(x){ return (x * x - 4) / (x - 2); }, fa: 1, typ: "discontinuité « de première espèce » : limite 4 mais f(2) = 1 (discontinuité éliminable)"},
  saut: {n: "|x|/x", a: 0, f: function(x){ return Math.abs(x) / x; }, fa: null, typ: "saut : limites à gauche (−1) et à droite (+1) différentes ; pas de limite en 0"},
  inf: {n: "1/(x − 1)", a: 1, f: function(x){ return 1 / (x - 1); }, fa: null, typ: "asymptote verticale : limite −∞ à gauche, +∞ à droite"},
  inf2: {n: "1/x²", a: 0, f: function(x){ return 1 / (x * x); }, fa: null, typ: "asymptote verticale : limite +∞ des deux côtés (la limite existe dans ℝ̄)"},
  osc: {n: "sin(1/x)", a: 0, f: function(x){ return Math.sin(1 / x); }, fa: null, typ: "oscillation : aucune limite, ni à gauche ni à droite"}
};
SFA.sim({
  id: "um-c02-approche-continuite", ch: "c02", tag: "Limites latérales, continuité",
  titre: "Approcher un point des deux côtés : limites latérales et continuité",
  resume: "Deux points se rapprochent de a, l'un par la gauche, l'autre par la droite : lis les valeurs de f et classe la discontinuité.",
  but: "Choisis une fonction, puis rapproche de a les deux points (glisse l'un d'eux vers la droite verticale x = a, ou utilise le curseur : |x − a| = 10^(−e)). Compare les valeurs de f à gauche et à droite, et avec f(a).",
  aRetenir: "f est continue en a si f(a) existe et lim<sub>x→a</sub> f(x) = f(a). La limite existe si et seulement si les limites à gauche et à droite existent et sont égales. Discontinuités : éliminable (limite finie ≠ f(a)), saut (limites latérales différentes), infinie, oscillation.",
  piege: "« f(a) existe » ne suffit pas, et « la limite existe » non plus : il faut les deux et leur égalité.",
  build: function(k, S){
    var c = k.canvas(340), fs = k.select("Fonction", [["cont", "x² en 1 (continue)"], ["trou", "(x² − 4)/(x − 2) en 2"], ["saut", "|x|/x en 0"], ["inf", "1/(x − 1) en 1"], ["inf2", "1/x² en 0"], ["osc", "sin(1/x) en 0"]], "trou");
    var e = k.slider("Distance |x − a| = 10^(−e), e =", 0, 4, 0.05, 0.5, ""); var ro = k.readouts(["f(a − h)", "f(a + h)", "h = |x − a|", "f(a)"]), nt = k.note("", ""), AXC = null, gc = false;
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (!AXC) return; var a = A2[fs.value].a;
      if (t === "down") gc = Math.abs(Math.abs(p.x - AXC.X(a)) - Math.abs(AXC.X(a + Math.pow(10, -e.value)) - AXC.X(a))) < 20;
      else if (t === "drag" && gc){ var hh = Math.abs(AXC.ix(p.x) - a); e.set(Math.round(cl(-Math.log10(Math.max(hh, 1e-4)), 0, 4) * 20) / 20); k.redraw(); }
      else if (t === "up") gc = false; });
    k.draw(function(){
      c.clear(); var T = A2[fs.value], a = T.a, h = Math.pow(10, -e.value);
      var ymid = fs.value === "cont" ? 1.5 : fs.value === "trou" ? 3 : 0, span = fs.value === "trou" ? 4 : fs.value === "cont" ? 3 : 4;
      var ax = D.axes(c, {x0: a - 2, x1: a + 2, y0: ymid - span, y1: ymid + span, stepX: 0.5, stepY: fs.value === "trou" ? 1 : 1, xl: "x", yl: "y"}); AXC = ax;
      if (T.f.name || true) { D.fn(c, ax, T.f, P.acc, 2.6); }
      vl(c, ax, a, "#c2c9d3");
      var yl = T.f(a - h), yr = T.f(a + h), ctx = c.ctx;
      [["#b42318", a - h, yl], ["#2e6b55", a + h, yr]].forEach(function(p){ if (isFinite(p[2])){ var py = Math.max(ax.T + 4, Math.min(ax.B - 4, ax.Y(p[2]))); D.line(c, ax.X(p[1]), ax.B, ax.X(p[1]), py, p[0], 1.2, [3, 3]); D.dot(c, ax.X(p[1]), py, 6, p[0]); } });
      if (fs.value === "trou"){ ctx.beginPath(); ctx.arc(ax.X(2), ax.Y(4), 5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = P.acc; ctx.stroke(); pt(c, ax, 2, 1, P.amber, 5); lab(c, "f(2) = 1", ax.X(2) + 10, ax.Y(1) + 12, P.amber, 12, "left"); }
      ro.set(0, F(yl, 4)); ro.set(1, F(yr, 4)); ro.set(2, S.sci(h)); ro.set(3, T.fa === null ? "non définie" : F(T.fa, 2));
      nt.set("Type : " + T.typ + ".", fs.value === "cont" ? "ok" : "warn");
    });
  }
});

/* 3 ---- croissances comparées ---- */
SFA.sim({
  id: "um-c02-croissances-comparees", ch: "c02", tag: "Croissances comparées",
  titre: "eˣ contre xⁿ : l'exponentielle finit toujours par gagner",
  resume: "Sur une échelle verticale logarithmique, vois xⁿ dépasser eˣ au début… puis eˣ reprendre définitivement l'avantage.",
  but: "Choisis la puissance n et la fenêtre. Les trois courbes sont tracées en log₁₀ : eˣ est une droite, xⁿ et ln x sont des courbes qui s'aplatissent. Glisse la ligne verticale de lecture et repère le dernier croisement.",
  aRetenir: "Pour tout n : lim<sub>x→+∞</sub> eˣ/xⁿ = +∞ et lim<sub>x→+∞</sub> (ln x)/xᵖ = 0 (p > 0). Ordre de croissance à l'infini : ln x ≪ xᵖ ≪ eˣ. Ces limites lèvent les formes indéterminées ∞/∞ et 0·∞.",
  piege: "Pour n grand, xⁿ domine eˣ sur une très longue plage (de x ≈ 1,12 à x ≈ 35,8 pour n = 10) : la limite en +∞ ne dit rien sur les valeurs « raisonnables ».",
  build: function(k, S){
    var c = k.canvas(380), n = k.slider("Puissance n", 1, 20, 1, 5, ""), xm = k.slider("Fenêtre : x de 0 à", 10, 120, 5, 60, "");
    var xs = k.slider("Point x lu", 1, 120, 1, 30, ""); var ro = k.readouts(["Dernier croisement eˣ = xⁿ", "eˣ", "xⁿ", "Rapport eˣ / xⁿ"]), nt = k.note("", "");
    var gx = false; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ var L = 52, R = c.W - 14, X = xm.value, xv = (p.x - L) / (R - L) * X; if (t === "down") gx = Math.abs(xv - Math.min(xs.value, X)) / X * (R - L) < 22; else if (t === "drag" && gx){ xs.set(Math.round(cl(xv, 1, Math.min(120, X)))); k.redraw(); } else if (t === "up") gx = false; else if (t === "move") c.cv.style.cursor = Math.abs(xv - Math.min(xs.value, X)) / X * (R - L) < 22 ? "ew-resize" : "default"; });
    k.draw(function(){
      c.clear(); var N = n.value, X = xm.value, ctx = c.ctx, L = 52, R = c.W - 14, T = 14, B = c.H - 36;
      var f1 = function(x){ return x / Math.LN10; }, f2 = function(x){ return N * Math.log10(x); }, f3 = function(x){ return Math.log10(Math.log(x)); };
      var top = Math.max(f1(X), f2(X)) * 1.05 + 1, bot = -1; function Xp(x){ return L + x / X * (R - L); } function Yp(v){ return B - (v - bot) / (top - bot) * (B - T); }
      ctx.save(); ctx.font = "600 11px Mulish, system-ui"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "right"; var stp = top > 60 ? 20 : top > 24 ? 10 : 5;
      for (var v = 0; v <= top; v += stp){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Yp(v)); ctx.lineTo(R, Yp(v)); ctx.stroke(); ctx.fillText("10" + String(v).split("").map(function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]; }).join(""), L - 5, Yp(v) + 4); }
      ctx.textAlign = "center"; var sx = X > 60 ? 20 : 10; for (var x = 0; x <= X; x += sx){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(Xp(x), T); ctx.lineTo(Xp(x), B); ctx.stroke(); ctx.fillText(x, Xp(x), B + 15); }
      ctx.fillText("x  (axe vertical : échelle logarithmique)", (L + R) / 2, B + 30);
      ctx.beginPath(); ctx.rect(L, T, R - L, B - T); ctx.clip();
      [[f1, P.acc], [f2, P.red], [f3, P.green]].forEach(function(p){ ctx.strokeStyle = p[1]; ctx.lineWidth = 3; ctx.beginPath(); var st = false; for (var i = 0; i <= 300; i++){ var x = Math.max(1.0001, X * i / 300), y = p[0](x); if (!isFinite(y)) continue; var py = Yp(y); st ? ctx.lineTo(Xp(x), py) : ctx.moveTo(Xp(x), py); st = true; } ctx.stroke(); });
      ctx.restore();
      var last = null, prev = Math.exp(1) - Math.pow(1, N); for (var q = 1.0; q <= 400; q += 0.01){ var dd2 = q - N * Math.log(q); if (dd2 > 0 && prev <= 0) last = q; prev = dd2; }
      var xr = Math.min(xs.value, X); D.line(c, Xp(xr), T, Xp(xr), B, "#c2c9d3", 1.3, [4, 4]); D.dot(c, Xp(xr), Yp(f1(xr)), 5, P.acc); D.dot(c, Xp(xr), Yp(f2(xr)), 5, P.red);
      if (last !== null && last <= X){ D.dot(c, Xp(last), Yp(f1(last)), 6.5, P.amber); }
      lab(c, "eˣ", L + 10, T + 10, P.acc, 13, "left"); lab(c, "x" + String(N).replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }), L + 10, T + 28, P.red, 13, "left"); lab(c, "ln x", L + 10, T + 46, P.green, 13, "left");
      ro.set(0, last === null ? "—" : "x ≈ " + F(last, 2)); ro.set(1, S.sci(Math.exp(xr))); ro.set(2, S.sci(Math.pow(xr, N))); ro.set(3, S.sci(Math.exp(xr) / Math.pow(xr, N)));
      nt.set(last === null ? "Pour ce n et cette fenêtre, eˣ domine déjà partout (avant x ≈ 1 il n'y a pas de croisement utile)." : "Après x ≈ " + F(last, 1) + ", eˣ > xⁿ pour toujours. Augmente n : le croisement recule, mais il existe.", "");
    });
  }
});

/* 4 ---- asymptotes ---- */
SFA.sim({
  id: "um-c02-asymptotes", ch: "c02", tag: "Asymptotes",
  titre: "Asymptotes verticale, horizontale, oblique d'une fraction rationnelle",
  resume: "f(x) = (ax² + bx + c)/(x − s). Glisse le pôle, pars en voyage vers l'infini avec la loupe, et construis une fraction qui a les asymptotes imposées.",
  but: "Glisse la droite verticale orange (le pôle s) et le point de lecture rouge sur la courbe. « Voyage vers +∞ » éloigne la fenêtre : la loupe montre l'écart R/(x − s) entre la courbe et l'asymptote, qui fond vers 0 (graphe du bas). Défi : choisis a, b, c, s pour obtenir les asymptotes cibles.",
  aRetenir: "Division euclidienne : (ax² + bx + c)/(x − s) = ax + (b + as) + R/(x − s), avec R = as² + bs + c. Asymptote oblique y = ax + (b + as) (horizontale y = b si a = 0) ; verticale x = s si R ≠ 0 (si R = 0 la fraction se simplifie : « trou »). L'écart R/(x − s) → 0 quand x → ±∞.",
  piege: "Une courbe peut couper son asymptote horizontale ou oblique ; ce qui compte est la limite de l'écart en ±∞. Et x = s n'est asymptote que si le numérateur ne s'annule pas en s.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8}); lay2(c, 0.8, 1.3);
    var a = k.slider("a", -2, 2, 0.5, 1, ""), b = k.slider("b", -4, 4, 0.5, 0, ""), cc = k.slider("c", -6, 6, 0.5, -2, ""), s = k.slider("s (pôle)", -3, 3, 0.5, 1, ""), z = k.slider("Fenêtre : x de −Z à Z, Z =", 5, 60, 1, 8, ""), x0 = k.slider("Point x où lire l'écart", -60, 60, 0.5, 4, "");
    var trip = k.loop(function(dt){ var Z = Math.min(60, z.value * Math.exp(dt * 0.45)); z.set(Z); x0.set(Math.min(60, 0.8 * Z)); if (Z >= 60) trip.pause(); k.redraw(); });
    k.button("▶ Voyage vers +∞", function(){ z.set(6); x0.set(4.5); trip.play(); }, true);
    var TG = [[2, 1, 3], [-1, 2, -1], [1, 0, 2], [-2, -1, 0], [3, 0.5, 1]], ti = -1, wins = 0, won = false;
    k.button("Défi : asymptotes imposées", function(){ ti = (ti + 1) % TG.length; won = false; z.set(8); });
    var ro = k.readouts(["Verticale", "Oblique / horizontale", "Écart f(x) − asymptote", "Reste R = as² + bs + c"]), nt = k.note("", "");
    function lin(m, p){ var sm = m === 1 ? "x" : m === -1 ? "−x" : F(m, 1) + "x"; return sm + (Math.abs(p) < 1e-9 ? "" : p < 0 ? " − " + F(-p, 1) : " + " + F(p, 1)); }
    var M = null, grab = null; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!M) return;
      if (t === "down"){ grab = null; var xx = x0.value, fx = M.f(xx); if (isFinite(fx) && Math.hypot(M.ax.X(xx) - p.x, M.ax.Y(fx) - p.y) < 24) grab = "x"; else if (Math.abs(M.ax.X(s.value) - p.x) < 16 && p.y > M.ax.T && p.y < M.ax.B) grab = "s"; if (grab) trip.pause(); }
      else if (t === "drag" && grab){ var X = M.ax.ix(p.x); if (grab === "s") s.set(cl(Math.round(X * 2) / 2, -3, 3)); else x0.set(cl(Math.round(X * 2) / 2, -60, 60)); k.redraw(); }
      else if (t === "up") grab = null;
      else if (t === "move" && M.ax) c.cv.style.cursor = Math.abs(M.ax.X(s.value) - p.x) < 16 ? "ew-resize" : "default";
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, A = a.value, B = b.value, C = cc.value, Sv = s.value, Z = z.value, R = A * Sv * Sv + B * Sv + C, m = A, p = B + A * Sv, hole = Math.abs(R) < 1e-9;
      var f = function(x){ return Math.abs(x - Sv) < 1e-12 ? NaN : (A * x * x + B * x + C) / (x - Sv); }, asy = function(x){ return m * x + p; };
      var H = c.H, h1 = Math.round(H * 0.68), ym = Math.abs(p) + Z * Math.max(0.6, Math.abs(m)) * 0.85 + 2;
      var ax = axIn(c, {x: 0, y: 0, w: c.W, h: h1}, {x0: -Z, x1: Z, y0: -ym, y1: ym, xl: "x", yl: "y", b: 26, t: 12, l: 40});
      M = {ax: ax, f: f};
      if (ti >= 0){ var q = TG[ti]; vl(c, ax, q[0], "rgba(224,122,31,.55)", [10, 6], 5); D.fn(c, ax, function(x){ return q[1] * x + q[2]; }, "rgba(224,122,31,.55)", 5, [10, 6]); }
      if (!hole){ vl(c, ax, Sv, P.amber, [6, 4], 2); D.label(c, "x = " + F(Sv, 1), ax.X(Sv) + 6, ax.T + 10, {color: P.amber, align: "left", size: 10.5}); }
      D.fn(c, ax, asy, P.green, 2, [7, 4]); D.fn(c, ax, f, P.acc, 3);
      if (hole){ var yh = asy(Sv); ctx.save(); ctx.beginPath(); ctx.arc(ax.X(Sv), ax.Y(yh), 5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
      var xx = cl(x0.value, -Z, Z); if (Math.abs(xx - Sv) < Z * 0.02) xx = Sv + Z * 0.04; var fx = f(xx), gx = asy(xx), gap = fx - gx;
      D.line(c, ax.X(xx), ax.Y(fx), ax.X(xx), ax.Y(gx), P.red, 2.4); hnd(c, ax.X(xx), ax.Y(fx), P.red, "");
      /* loupe : agrandissement vertical autour du point de lecture */
      var lr = Math.min(62, c.W * 0.15), lx = xx > 0 ? ax.L + lr + 10 : ax.R - lr - 10, ly = ax.T + lr + 8, zoom = Math.max(1, Math.min(400, lr * 0.55 / Math.max(1e-6, Math.abs(ax.Y(fx) - ax.Y(gx)))));
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.fillStyle = "rgba(255,255,255,.97)"; ctx.fill(); ctx.clip();
      var sx = (ax.R - ax.L) / (2 * Z) * 4, sy = (ax.B - ax.T) / (2 * ym) * zoom, ym0 = gx;
      [[asy, P.green, [6, 4]], [f, P.acc, null]].forEach(function(pr){ ctx.strokeStyle = pr[1]; ctx.lineWidth = 2.6; ctx.setLineDash(pr[2] || []); ctx.beginPath(); for (var i = 0; i <= 60; i++){ var u = -lr + 2 * lr * i / 60, X = xx + u / sx, Y = ly - (pr[0](X) - ym0) * sy; i ? ctx.lineTo(lx + u, Y) : ctx.moveTo(lx + u, Y); } ctx.stroke(); });
      ctx.setLineDash([]); D.line(c, lx, ly, lx, ly - gap * sy, P.red, 2.4); ctx.restore();
      ctx.save(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.stroke(); ctx.lineWidth = 5; ctx.lineCap = "round"; var hx = lx + (xx > 0 ? 1 : -1) * lr * 0.72, hy = ly + lr * 0.72; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + (xx > 0 ? 1 : -1) * 16, hy + 16); ctx.stroke(); ctx.restore();
      D.label(c, "loupe × " + F(zoom, 0) + " (vertical)", lx, ly + lr + 12, {color: "#5f6b7a", size: 10});
      /* graphe de l'écart */
      var eb = {x: 0, y: h1, w: c.W, h: H - h1}, er = Math.max(0.5, Math.min(8, Math.abs(R) / Math.max(1, Z * 0.15)));
      var ax2 = axIn(c, eb, {x0: -Z, x1: Z, y0: -er, y1: er, xl: "x", yl: "écart R/(x − s)", t: 14, b: 24, l: 40});
      ctx.save(); ctx.fillStyle = "rgba(36,119,90,.08)"; ctx.fillRect(ax2.L, ax2.Y(er * 0.08), ax2.R - ax2.L, ax2.Y(-er * 0.08) - ax2.Y(er * 0.08)); ctx.restore();
      D.fn(c, ax2, function(x){ return Math.abs(x - Sv) < 1e-12 ? NaN : R / (x - Sv); }, P.red, 2.4); D.dot(c, ax2.X(xx), ax2.Y(cl(gap, -er * 1.2, er * 1.2)), 5.5, P.red);
      ro.set(0, hole ? "aucune (trou en x = " + F(Sv, 1) + ")" : "x = " + F(Sv, 1));
      ro.set(1, A === 0 ? "horizontale y = " + F(B, 1) : "y = " + lin(m, p));
      ro.set(2, S.sci(gap, 3) + " (x = " + F(xx, 1) + ")"); ro.set(3, F(R, 2));
      if (ti >= 0){ var q2 = TG[ti], ok = !hole && Math.abs(Sv - q2[0]) < 1e-9 && Math.abs(m - q2[1]) < 1e-9 && Math.abs(p - q2[2]) < 1e-9;
        var tgt = "x = " + F(q2[0], 0) + " et " + (q2[1] === 0 ? "y = " + F(q2[2], 1) : "y = " + lin(q2[1], q2[2]));
        if (ok){ if (!won){ won = true; wins++; } nt.set("Défi réussi (" + wins + ") : les asymptotes sont bien " + tgt + ". Vérification : a = " + F(A, 1) + " donne la pente, b + as = " + F(p, 1) + " l'ordonnée à l'origine, et R = " + F(R, 2) + " ≠ 0. Clique à nouveau sur « Défi » pour une autre cible.", "ok"); }
        else nt.set("Défi : obtiens les asymptotes (orange) " + tgt + "." + (hole ? " Attention : R = 0, il n'y a plus d'asymptote verticale !" : " Indices : s fixe la verticale, a la pente, puis b règle b + as."), "warn"); }
      else nt.set(hole ? "Le numérateur s'annule en x = s (R = 0) : la fraction se simplifie, il n'y a pas d'asymptote verticale mais un trou." : "L'écart vaut R/(x − s) = " + F(R, 2) + "/(x − s) : il est divisé par 10 quand x est multiplié par 10. Lance le voyage vers +∞.", hole ? "warn" : "ok");
    });
  }
});

/* 5 ---- valeurs intermédiaires ---- */
var V5 = {
  cosx: {n: "f(x) = cos x − x", f: function(x){ return Math.cos(x) - x; }, a: 0, b: 1, x0: -0.5, x1: 1.6, y0: -2, y1: 1.6, cont: true},
  cub: {n: "f(x) = x³ − 2x − 5", f: function(x){ return x * x * x - 2 * x - 5; }, a: 2, b: 3, x0: 1, x1: 3.5, y0: -8, y1: 18, cont: true},
  expo: {n: "f(x) = eˣ + x − 3", f: function(x){ return Math.exp(x) + x - 3; }, a: 0, b: 2, x0: -0.5, x1: 2.5, y0: -4, y1: 8, cont: true},
  inv: {n: "f(x) = 1/x sur [−1 ; 2] (pas continue !)", f: function(x){ return 1 / x; }, a: -1, b: 2, x0: -1.5, x1: 2.5, y0: -5, y1: 5, cont: false}
};
SFA.sim({
  id: "um-c02-valeurs-intermediaires", ch: "c02", tag: "Théorème des valeurs intermédiaires",
  titre: "Théorème des valeurs intermédiaires : la dichotomie qui piège une racine",
  resume: "f(a) et f(b) de signes opposés : si f est continue, une racine est piégée dans [a ; b]. À toi de choisir, coup après coup, la moitié qui la contient ; la vue zoome et le ruban des intervalles se resserre.",
  but: "Glisse les bornes a et b (poignées) pour encadrer un changement de signe. Puis clique sur la moitié de l'intervalle orange qui contient la racine : la vue zoome automatiquement. Défi : encadre la racine à moins de 0,001 sans te tromper de moitié. Essaie ensuite 1/x, qui change de signe sans s'annuler.",
  aRetenir: "TVI : si f est continue sur [a ; b] et si f(a)·f(b) < 0, alors f s'annule au moins une fois sur ]a ; b[. Dichotomie : après n étapes, la racine est dans un intervalle de longueur (b − a)/2ⁿ ; il faut n ≥ log₂((b − a)/ε) étapes pour une précision ε.",
  piege: "L'hypothèse de continuité est indispensable : 1/x change de signe entre −1 et 2 mais ne s'annule jamais. Et f(a)·f(b) > 0 ne prouve pas l'absence de racine (il peut y en avoir deux).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.85}); lay2(c, 0.85, 1.2);
    var st = {a: 0, b: 1, a0: 0, b0: 1, hist: [], err: 0, flash: 0, msg: ""}, view = {x0: -1, x1: 2}, fs;
    function reset(){ var T = V5[fs.value]; st.a = st.a0 = T.a; st.b = st.b0 = T.b; st.hist = []; st.err = 0; st.msg = ""; view.x0 = T.x0; view.x1 = T.x1; }
    fs = k.select("Fonction", [["cosx", "cos x − x"], ["cub", "x³ − 2x − 5"], ["expo", "eˣ + x − 3"], ["inv", "1/x (non continue)"]], "cosx", reset);
    var az = k.toggle("Zoom automatique sur l'intervalle", true);
    function choose(left){ var T = V5[fs.value], m = (st.a + st.b) / 2, fa = T.f(st.a), fm = T.f(m), good = left ? fa * fm <= 0 : fa * fm >= 0;
      if (!good){ st.err++; st.flash = 1; st.msg = "Raté : sur la moitié " + (left ? "gauche" : "droite") + ", f garde le même signe aux deux bouts. Regarde les signes de f(a), f(m) et f(b)."; return; }
      st.msg = ""; st.hist.push([st.a, st.b]); if (left) st.b = m; else st.a = m; if (st.hist.length > 60) st.hist.shift(); }
    function auto(){ var T = V5[fs.value], m = (st.a + st.b) / 2; choose(T.f(st.a) * T.f(m) <= 0); }
    k.button("Une étape automatique", auto, true); k.button("10 étapes", function(){ for (var i = 0; i < 10; i++) auto(); }); k.button("Recommencer", reset);
    var ro = k.readouts(["Intervalle [a ; b]", "Largeur b − a", "Signes f(a) | f(m) | f(b)", "Étapes · erreurs"]), nt = k.note("", "");
    var lp = k.loop(function(dt){ var T = V5[fs.value], w = st.b - st.a, t0, t1; if (az.value && st.hist.length){ t0 = st.a - w * 1.2; t1 = st.b + w * 1.2; } else { t0 = T.x0; t1 = T.x1; } var q = Math.min(1, dt * 4); view.x0 += (t0 - view.x0) * q; view.x1 += (t1 - view.x1) * q; if (st.flash > 0) st.flash = Math.max(0, st.flash - dt * 1.5); k.redraw(); }); lp.play();
    var G = null, grab = null; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return; var ax = G;
      if (t === "down"){ grab = null; if (!st.hist.length){ if (Math.abs(ax.X(st.a) - p.x) < 16 && Math.abs(ax.Y(0) - p.y) < 30) grab = "a"; else if (Math.abs(ax.X(st.b) - p.x) < 16 && Math.abs(ax.Y(0) - p.y) < 30) grab = "b"; }
        if (!grab && p.y < ax.B && p.y > ax.T){ var x = ax.ix(p.x); if (x >= st.a && x <= st.b){ choose(x < (st.a + st.b) / 2); k.redraw(); } } }
      else if (t === "drag" && grab){ var T = V5[fs.value], v = cl(ax.ix(p.x), T.x0, T.x1); v = Math.round(v * 20) / 20; if (grab === "a") st.a = st.a0 = Math.min(v, st.b - 0.05); else st.b = st.b0 = Math.max(v, st.a + 0.05); k.redraw(); }
      else if (t === "up") grab = null;
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, T = V5[fs.value], H = c.H, h1 = Math.round(H * 0.76), m = (st.a + st.b) / 2, fa = T.f(st.a), fb = T.f(st.b), fm = T.f(m);
      var X0 = view.x0, X1 = view.x1, lo = Infinity, hi = -Infinity; for (var i = 0; i <= 80; i++){ var yy = T.f(X0 + (X1 - X0) * i / 80); if (isFinite(yy) && Math.abs(yy) < 1e3){ lo = Math.min(lo, yy); hi = Math.max(hi, yy); } }
      if (!T.cont){ lo = Math.max(lo, -6); hi = Math.min(hi, 6); } lo = Math.min(lo, 0); hi = Math.max(hi, 0); var pad = (hi - lo) * 0.12 || 1;
      var ax = axIn(c, {x: 0, y: 0, w: c.W, h: h1}, {x0: X0, x1: X1, y0: lo - pad, y1: hi + pad, xl: "x", yl: "y", t: 12, b: 26, l: 48}); G = ax;
      ctx.save(); ctx.fillStyle = "rgba(194,106,12,.16)"; ctx.fillRect(ax.X(st.a), ax.T, Math.max(2, ax.X(st.b) - ax.X(st.a)), ax.B - ax.T);
      if (st.flash > 0){ ctx.fillStyle = "rgba(192,50,29," + (0.25 * st.flash) + ")"; ctx.fillRect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); }
      ctx.restore(); vl(c, ax, m, "rgba(194,106,12,.7)", [3, 3], 1.4);
      D.fn(c, ax, T.f, P.acc, 3);
      [[st.a, fa, "a"], [m, fm, "m"], [st.b, fb, "b"]].forEach(function(q){ if (!isFinite(q[1])) return; var yv = cl(q[1], ax.y0, ax.y1), col = q[1] > 0 ? P.green : P.red; D.line(c, ax.X(q[0]), ax.Y(0), ax.X(q[0]), ax.Y(yv), col, 1.6, [3, 3]); D.dot(c, ax.X(q[0]), ax.Y(yv), q[2] === "m" ? 4.5 : 6, col); D.text(c, (q[1] > 0 ? "+" : "−"), ax.X(q[0]) + 10, ax.Y(yv) + (q[1] > 0 ? -10 : 10), {size: 14, color: col, halo: true}); });
      if (!st.hist.length){ hnd(c, ax.X(st.a), ax.Y(0), P.amber, "a"); hnd(c, ax.X(st.b), ax.Y(0), P.amber, "b"); }
      if (ax.X(st.b) - ax.X(st.a) > 60){ D.text(c, "gauche", (ax.X(st.a) + ax.X(m)) / 2, ax.B - 12, {size: 10.5, color: P.amber, halo: true}); D.text(c, "droite", (ax.X(m) + ax.X(st.b)) / 2, ax.B - 12, {size: 10.5, color: P.amber, halo: true}); }
      /* ruban des intervalles emboîtés (échelle de départ) */
      var rb = {x: 12, y: h1 + 6, w: c.W - 24, h: H - h1 - 10}, A0 = st.a0, B0 = st.b0, rows = st.hist.concat([[st.a, st.b]]), show = rows.slice(-10), rh = Math.min(13, (rb.h - 22) / Math.max(show.length, 1));
      D.text(c, "Intervalles successifs (à l'échelle de [a ; b] de départ)", rb.x, rb.y + 6, {size: 10.5, color: "#5f6b7a", align: "left", weight: 700});
      function RX(x){ return rb.x + 40 + (x - A0) / (B0 - A0) * (rb.w - 50); }
      show.forEach(function(q, j){ var y = rb.y + 18 + j * rh, n = rows.length - show.length + j; D.text(c, "n = " + n, rb.x, y + rh / 2, {size: 9.5, color: "#7b8694", align: "left", weight: 600}); ctx.fillStyle = j === show.length - 1 ? P.amber : "rgba(194,106,12,.35)"; ctx.fillRect(RX(q[0]), y + 1, Math.max(1.5, RX(q[1]) - RX(q[0])), rh - 3); });
      var w = st.b - st.a, need = Math.ceil(Math.log2((B0 - A0) / 1e-3));
      ro.set(0, "[" + F(st.a, 6) + " ; " + F(st.b, 6) + "]"); ro.set(1, S.sci(w)); ro.set(2, (fa > 0 ? "+" : "−") + " | " + (fm > 0 ? "+" : "−") + " | " + (fb > 0 ? "+" : "−")); ro.set(3, st.hist.length + " · " + st.err);
      if (st.msg) nt.set(st.msg, "warn");
      else if (fa * fb > 0) nt.set("f(a) et f(b) ont le même signe : le TVI ne garantit aucune racine dans [a ; b]. Déplace les poignées a et b.", "warn");
      else if (!T.cont) nt.set(w < 0.01 ? "L'intervalle se resserre autour de 0, mais f(0) n'existe pas : |f| y devient énorme, ce n'est pas une racine. Pas de continuité, pas de TVI." : "f(−1) < 0 et f(2) > 0, mais f n'est pas continue en 0. Fais quelques étapes et regarde où tu arrives.", "warn");
      else if (w < 1e-3) nt.set("Racine piégée : x ≈ " + F((st.a + st.b) / 2, 5) + " à moins de " + S.sci(w) + " près, en " + st.hist.length + " étapes (minimum théorique ⌈log₂((b − a)/0,001)⌉ = " + need + ")" + (st.err ? ", avec " + st.err + " erreur(s)." : ", sans erreur : défi réussi !"), st.err ? "warn" : "ok");
      else nt.set("Défi : clique sur la moitié (gauche ou droite de la ligne m) où f change de signe, jusqu'à une largeur < 0,001. Il faudra " + need + " coups.", "");
    });
    reset();
  }
});
})();
