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
/* Mathématiques BA1 · chapitre 3 : dérivées et applications */
/* 1 ---- sécante -> tangente ---- */
var D1 = {
  x2: {n: "x²", f: function(x){ return x * x; }, d: function(x){ return 2 * x; }, a: 1},
  x3: {n: "x³ − x", f: function(x){ return x * x * x - x; }, d: function(x){ return 3 * x * x - 1; }, a: 1},
  sin: {n: "sin x", f: Math.sin, d: Math.cos, a: 1},
  exp: {n: "eˣ", f: Math.exp, d: Math.exp, a: 0.5},
  sqrt: {n: "√x", f: function(x){ return Math.sqrt(x); }, d: function(x){ return 0.5 / Math.sqrt(x); }, a: 2},
  abs: {n: "|x|", f: Math.abs, d: function(x){ return x === 0 ? NaN : (x > 0 ? 1 : -1); }, a: 0}
};
SFA.sim({
  id: "um-c03-tangente-secante", ch: "c03", tag: "Dérivée = pente de la tangente",
  titre: "De la sécante à la tangente : la dérivée comme limite",
  resume: "Un second point glisse vers le premier : la pente de la sécante converge vers f′(a). Essaie |x| en 0, où les pentes de part et d'autre diffèrent.",
  but: "Fais glisser le point a sur la courbe (ou règle-le) et diminue h, ou clique « h → 0 ». La droite orange est la sécante ; la droite pointillée verte est la tangente (pente f′(a)).",
  aRetenir: "f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)]/h. La tangente en a a pour équation y = f(a) + f′(a)(x − a). f est dérivable en a si la limite existe (les limites à gauche et à droite sont égales).",
  piege: "Continue ne veut pas dire dérivable : |x| est continue en 0 mais les pentes valent −1 à gauche et +1 à droite (point anguleux).",
  build: function(k, S){
    var c = k.canvas(380), fs = k.select("Fonction", [["x2", "x²"], ["x3", "x³ − x"], ["sin", "sin x"], ["exp", "eˣ"], ["sqrt", "√x"], ["abs", "|x|"]], "x2", function(v){ a.set(D1[v].a); });
    var a = k.slider("Abscisse a", -2.5, 2.5, 0.05, 1, ""), h = k.slider("Pas h", -2, 2, 0.05, 1, ""), run = false;
    var lp = k.loop(function(dt){ var v = h.value, s = v < 0 ? -1 : 1, m = Math.max(0.0, Math.abs(v) * Math.exp(-dt * 1.2)); if (m < 0.003){ lp.pause(); m = 0.003; } h.set(s * m); k.redraw(); });
    k.button("h → 0", function(){ if (Math.abs(h.value) < 0.05) h.set(1.5); lp.play(); }, true); k.button("h = 1", function(){ lp.pause(); h.set(1); });
    c.pointer(function(t, p){ if (t === "down" || t === "drag"){ if (c._ax){ var v = c._ax.ix(p.x); a.set(Math.round(v * 20) / 20); k.redraw(); } } });
    var ro = k.readouts(["Pente de la sécante", "Pente à gauche (h < 0)", "Pente à droite (h > 0)", "f′(a) exact"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = D1[fs.value], f = T.f, A = a.value, H = h.value; if (fs.value === "sqrt" && A < 0.05) A = 0.05;
      var ax = D.axes(c, {x0: -3, x1: 3, y0: fs.value === "exp" ? -1 : -3, y1: fs.value === "exp" ? 6 : 5, equal: false, stepX: 1, stepY: 1, xl: "x", yl: "y"}); c._ax = ax;
      D.fn(c, ax, f, P.acc, 3); var fa = f(A), d = T.d(A);
      var slope = function(hh){ return (f(A + hh) - fa) / hh; };
      if (isFinite(d)) D.fn(c, ax, function(x){ return fa + d * (x - A); }, P.green, 2, [6, 4]);
      var hh = Math.abs(H) < 1e-9 ? 1e-9 : H, ys = f(A + hh), sec = (ys - fa) / hh;
      if (isFinite(sec)) D.fn(c, ax, function(x){ return fa + sec * (x - A); }, P.amber, 2.6);
      if (isFinite(ys)){ D.line(c, ax.X(A), ax.Y(fa), ax.X(A + hh), ax.Y(fa), "#b9c2cf", 1.3, [3, 3]); D.line(c, ax.X(A + hh), ax.Y(fa), ax.X(A + hh), ax.Y(ys), "#b9c2cf", 1.3, [3, 3]); pt(c, ax, A + hh, ys, P.amber, 5); }
      pt(c, ax, A, fa, P.red, 6);
      ro.set(0, isFinite(sec) ? F(sec, 4) : "—"); ro.set(1, F(slope(-0.001), 4)); ro.set(2, F(slope(0.001), 4)); ro.set(3, isFinite(d) ? F(d, 4) : "n'existe pas");
      nt.set(fs.value === "abs" && Math.abs(A) < 1e-9 ? "|x| en 0 : pente −1 à gauche, +1 à droite : pas de tangente, pas de dérivée." : "La pente de la sécante (orange) se rapproche de f′(a) (vert) quand h → 0, par la gauche comme par la droite.", fs.value === "abs" && Math.abs(A) < 1e-9 ? "warn" : "");
    });
  }
});

/* 2 ---- f, f', f'' ---- */
var G2 = {
  p3: {n: "x³ − 3x", f: function(x){ return x * x * x - 3 * x; }, d: function(x){ return 3 * x * x - 3; }, s: function(x){ return 6 * x; }, x0: -2.7, x1: 2.7, y0: -4, y1: 4},
  p4: {n: "x⁴ − 2x²", f: function(x){ return x * x * x * x - 2 * x * x; }, d: function(x){ return 4 * x * x * x - 4 * x; }, s: function(x){ return 12 * x * x - 4; }, x0: -2, x1: 2, y0: -2, y1: 4},
  xe: {n: "x·e⁻ˣ", f: function(x){ return x * Math.exp(-x); }, d: function(x){ return (1 - x) * Math.exp(-x); }, s: function(x){ return (x - 2) * Math.exp(-x); }, x0: -1, x1: 6, y0: -1.5, y1: 1},
  sin: {n: "sin x + x/2", f: function(x){ return Math.sin(x) + x / 2; }, d: function(x){ return Math.cos(x) + 0.5; }, s: function(x){ return -Math.sin(x); }, x0: -6, x1: 6, y0: -4, y1: 4}
};
SFA.sim({
  id: "um-c03-f-fprime", ch: "c03", tag: "Étude de fonction",
  titre: "f, f′ et f″ : trois graphes, une seule histoire",
  resume: "Déplace un point sur f : la pente de la tangente est l'ordonnée de f′, la courbure se lit sur f″. Les zéros de f′ sont les extrema.",
  but: "Choisis f et fais glisser x. En haut f avec sa tangente (verte si f croît, rouge si f décroît) ; au milieu f′ ; en bas f″. Repère les extrema et les points d'inflexion.",
  aRetenir: "f′ > 0 ⇒ f croissante ; f′ < 0 ⇒ f décroissante ; f′ = 0 en changeant de signe ⇒ extremum local. f″ > 0 ⇒ f convexe (« en U ») ; f″ < 0 ⇒ concave ; f″ change de signe ⇒ point d'inflexion. Test : f′(a) = 0 et f″(a) > 0 ⇒ minimum.",
  piege: "f′(a) = 0 ne suffit pas pour un extremum : x³ en 0 a une tangente horizontale sans extremum (f′ ne change pas de signe).",
  build: function(k, S){
    var c1 = k.canvas(230), c2 = k.canvas(150), c3 = k.canvas(130), fs = k.select("Fonction", [["p3", "x³ − 3x"], ["p4", "x⁴ − 2x²"], ["xe", "x·e⁻ˣ"], ["sin", "sin x + x/2"]], "p3");
    var xs = k.slider("Abscisse x", -2.7, 2.7, 0.01, -1.5, ""); var tg = k.toggle("Repères : extrema (f′ = 0) et inflexions (f″ = 0)", true); var ro = k.readouts(["f(x)", "f′(x) = pente", "f″(x)", "Comportement"]);
    c1.cv.style.touchAction = "none"; c2.cv.style.touchAction = "none"; c3.cv.style.touchAction = "none";
    function roots(fn, a, b){ var r = [], n = 600, px = a, pv = fn(a); for (var i = 1; i <= n; i++){ var x = a + (b - a) * i / n, v = fn(x); if (pv * v < 0 || v === 0){ var lo = px, hi = x; for (var q = 0; q < 40; q++){ var m = (lo + hi) / 2; if (fn(lo) * fn(m) <= 0) hi = m; else lo = m; } r.push((lo + hi) / 2); } px = x; pv = v; } return r; }
    [c2, c3].forEach(function(cc){ cc.pointer(function(t, p){ if ((t === "down" || t === "drag") && cc._ax){ xs.set(cc._ax.ix(p.x)); k.redraw(); } }); });
    c1.pointer(function(t, p){ if ((t === "down" || t === "drag") && c1._ax){ xs.set(c1._ax.ix(p.x)); k.redraw(); } });
    var prev = "p3";
    k.draw(function(){
      var T = G2[fs.value]; if (fs.value !== prev){ prev = fs.value; xs.el.min = T.x0; xs.el.max = T.x1; xs.set(T.x0 * 0.55); }
      var X = xs.value, w = [c1, c2, c3]; w.forEach(function(c){ c.clear(); });
      var ax1 = D.axes(c1, {x0: T.x0, x1: T.x1, y0: T.y0, y1: T.y1, hideZero: true, yl: "f"}); c1._ax = ax1;
      var step = (T.x1 - T.x0) / 240; c1.ctx.lineWidth = 3.2;
      for (var x = T.x0; x < T.x1; x += step){ var m = T.d(x + step / 2); c1.ctx.strokeStyle = m > 0 ? P.green : P.red; c1.ctx.beginPath(); c1.ctx.moveTo(ax1.X(x), ax1.Y(T.f(x))); c1.ctx.lineTo(ax1.X(x + step), ax1.Y(T.f(x + step))); c1.ctx.stroke(); }
      var fx = T.f(X), dx = T.d(X), sx = T.s(X);
      D.fn(c1, ax1, function(u){ return fx + dx * (u - X); }, P.amber, 2, [6, 4]); pt(c1, ax1, X, fx, P.ink, 6);
      var ax2 = D.axes(c2, {x0: T.x0, x1: T.x1, y0: -4, y1: 4, hideZero: true, yl: "f′"}); c2._ax = ax2; D.fn(c2, ax2, T.d, P.acc, 2.8); vl(c2, ax2, X, "#c2c9d3"); pt(c2, ax2, X, dx, P.amber, 6);
      var ax3 = D.axes(c3, {x0: T.x0, x1: T.x1, y0: -4, y1: 4, hideZero: true, yl: "f″"}); c3._ax = ax3; D.fn(c3, ax3, T.s, P.violet, 2.6); vl(c3, ax3, X, "#c2c9d3"); pt(c3, ax3, X, sx, P.amber, 6);
      [ax1, ax2, ax3].forEach(function(a, i){ if (i) vl(w[i], a, X, "#c2c9d3"); });
      if (tg.value){ roots(T.d, T.x0, T.x1).forEach(function(r){ var kind = T.s(r) > 0 ? "min" : "max"; pt(c1, ax1, r, T.f(r), kind === "min" ? P.green : P.red, 5); D.label(c1, kind, ax1.X(r), ax1.Y(T.f(r)) + (kind === "min" ? 16 : -14), {color:kind === "min" ? P.green : P.red, size:10.5}); pt(c2, ax2, r, 0, P.ink, 4.5); });
        roots(T.s, T.x0, T.x1).forEach(function(r){ pt(c1, ax1, r, T.f(r), P.violet, 5); D.label(c1, "inflexion", ax1.X(r) + 6, ax1.Y(T.f(r)) + 16, {color:P.violet, size:10.5, align:"left"}); pt(c3, ax3, r, 0, P.violet, 4.5); }); }
      var beh = (Math.abs(dx) < 0.03 ? "tangente horizontale" : dx > 0 ? "f croît" : "f décroît") + ", " + (sx > 0.03 ? "convexe" : sx < -0.03 ? "concave" : "inflexion ?");
      ro.set(0, F(fx, 3)); ro.set(1, F(dx, 3)); ro.set(2, F(sx, 3)); ro.set(3, beh);
    });
  }
});

/* 3 ---- optimisation ---- */
SFA.sim({
  id: "um-c03-optimisation", ch: "c03", tag: "Optimisation",
  titre: "Optimiser : la boîte de volume maximal et la canette de surface minimale",
  resume: "Découpe les coins d'un carton 30 × 20 cm et plie-le en boîte ; ou dessine une canette de 33 cL. Glisse la découpe, observe la pente de la tangente, et trouve l'optimum à la main avant de le vérifier par f′ = 0.",
  but: "Boîte : glisse le coin rouge du carton pour choisir la taille x des carrés découpés, puis « Plier » pour voir la boîte. Canette : glisse le bord de la canette pour changer son rayon (la hauteur s'ajuste pour garder 330 cm³). Défi : trouve l'optimum à 1 cm³ (ou 0,5 cm²) près, en t'aidant de la pente de la tangente.",
  aRetenir: "Méthode : (1) exprimer la grandeur en fonction d'une seule variable ; (2) préciser le domaine ; (3) dériver et résoudre f′ = 0 ; (4) vérifier qu'il s'agit d'un max/min (signe de f′, ou f″) et comparer aux bords ; (5) conclure avec les unités. Boîte : V(x) = x(30 − 2x)(20 − 2x), x* = (25 − 5√7)/3 ≈ 3,92 cm. Canette : S(r) = 2πr² + 660/r, r* = (165/π)^(1/3) ≈ 3,74 cm et h = 2r.",
  piege: "Il faut aussi regarder les bords du domaine : un maximum peut être atteint à une extrémité. Ici V = 0 aux deux bords, donc le maximum est intérieur. Et la deuxième racine de V′ (≈ 12,74 cm) est hors du domaine ]0 ; 10[.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.66}); lay2(c, 0.66, 1.25);
    var sc = k.seg("Problème", [["box", "Boîte (carton 30 × 20 cm)"], ["can", "Canette 33 cL"]], "box", function(v){ setr(v); won = false; });
    var xv = k.slider("Variable", 0.1, 9.9, 0.01, 2, "cm");
    function setr(v){ if (v === "box"){ xv.el.min = 0.2; xv.el.max = 9.8; xv.set(2); } else { xv.el.min = 1.5; xv.el.max = 7; xv.set(2.2); } fold = 0; tgt = 0; }
    var fold = 0, tgt = 0, won = false, wins = 0, lp = k.loop(function(dt){ var d = tgt - fold; if (Math.abs(d) < 0.01){ fold = tgt; lp.pause(); } else fold += Math.sign(d) * Math.min(Math.abs(d), dt * 0.9); k.redraw(); });
    k.button("Plier / déplier la boîte", function(){ if (sc.value !== "box") return; tgt = tgt > 0.5 ? 0 : 1; lp.play(); }, true);
    var so = k.toggle("Montrer l'optimum théorique (f′ = 0)", false);
    var ro = k.readouts(["Variable", "Grandeur", "Pente de la tangente f′", "Écart à l'optimum"]), nt = k.note("", "");
    var Pj = null, G = null, grab = null; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down"){ grab = null; if (Pj && Math.hypot(Pj.hx - p.x, Pj.hy - p.y) < 26) grab = "h"; else if (G && p.y > G.T && p.y < G.B && p.x > G.L && p.x < G.R) grab = "g"; if (grab === "h" && sc.value === "box" && fold > 0){ tgt = 0; lp.play(); } }
      if ((t === "down" || t === "drag") && grab){ var v;
        if (grab === "g") v = G.ix(p.x);
        else if (sc.value === "box"){ var q = Pj.inv(p.x, p.y); v = (q[0] + q[1]) / 2; }
        else v = (p.x - Pj.cx) / Pj.sk;
        xv.set(Math.round(cl(v, +xv.el.min, +xv.el.max) * 100) / 100); k.redraw(); }
      if (t === "up") grab = null;
      if (t === "move") c.cv.style.cursor = Pj && Math.hypot(Pj.hx - p.x, Pj.hy - p.y) < 26 ? "grab" : "default";
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, box = sc.value === "box", X = xv.value, bx = split2(c, 0.5, 0.5), q = bx[0];
      var f, df, xo, fo, rng0, ylo, yhi, ylab, unit;
      if (box){
        f = function(x){ return x * (30 - 2 * x) * (20 - 2 * x); }; df = function(x){ return 12 * x * x - 200 * x + 600; }; xo = (25 - 5 * Math.sqrt(7)) / 3; rng0 = [0, 10]; ylo = 0; yhi = 1300; ylab = "V (cm³)"; unit = "cm³";
        /* carton plié en perspective cavalière (axe de profondeur vers le haut à droite) */
        var th = fold * PI / 2, Lb = 30 - 2 * X, Wb = 20 - 2 * X, s = Math.min((q.w - 30) / 40, (q.h - 40) / (12 + 10 * fold + 1)), ox = q.x + 16 + (q.w - 32 - 40 * s) / 2, oy = q.y + q.h - 24;
        var P3 = function(x, y, z){ return [ox + s * (x + 0.45 * y), oy - s * (z + 0.6 * y)]; };
        Pj = {inv: function(px, py){ var y = (oy - py) / (0.6 * s), x = (px - ox) / s - 0.45 * y; return [x, y]; }};
        var cth = Math.cos(th), sth = Math.sin(th), card = "#d9b27a", edge = "#8a6233";
        function quad(pts, fill){ ctx.beginPath(); pts.forEach(function(p3, i){ var pp = P3(p3[0], p3[1], p3[2]); i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]); }); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = 1.3; ctx.stroke(); }
        var x0 = X, x1 = 30 - X, y0 = X, y1 = 20 - X;
        if (fold < 0.02){ [[0, 0], [x1, 0], [0, y1], [x1, y1]].forEach(function(o){ quad([[o[0], o[1], 0], [o[0] + X, o[1], 0], [o[0] + X, o[1] + X, 0], [o[0], o[1] + X, 0]], "rgba(192,50,29,.22)"); }); }
        quad([[x0, y1, 0], [x1, y1, 0], [x1, y1 + X * cth, X * sth], [x0, y1 + X * cth, X * sth]], "#c9a067");
        quad([[x0, y0, 0], [x0, y1, 0], [x0 - X * cth, y1, X * sth], [x0 - X * cth, y0, X * sth]], "#c39a60");
        quad([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], card);
        quad([[x1, y0, 0], [x1, y1, 0], [x1 + X * cth, y1, X * sth], [x1 + X * cth, y0, X * sth]], "#e2be8b");
        quad([[x0, y0, 0], [x1, y0, 0], [x1, y0 - X * cth, X * sth], [x0, y0 - X * cth, X * sth]], "#e8c897");
        if (fold < 0.02){ var a1 = P3(0, 0, 0), a2 = P3(30, 0, 0); D.text(c, "30 cm", (a1[0] + a2[0]) / 2, a1[1] + 12, {size: 10.5, color: edge}); var b2 = P3(0, 20, 0); D.text(c, "20 cm", (a1[0] + b2[0]) / 2 - 18, (a1[1] + b2[1]) / 2, {size: 10.5, color: edge}); }
        var hp = P3(X, X, X * sth); Pj.hx = hp[0]; Pj.hy = hp[1]; if (fold < 0.02) hnd(c, hp[0], hp[1], P.red, "x = " + F(X, 2) + " cm");
        else D.label(c, F(Lb, 1) + " × " + F(Wb, 1) + " × " + F(X, 1) + " cm", q.x + q.w / 2, q.y + 14, {color: edge});
      } else {
        var V0 = 330, r = X, h = V0 / (PI * r * r);
        f = function(rr){ return 2 * PI * rr * rr + 2 * V0 / rr; }; df = function(rr){ return 4 * PI * rr - 2 * V0 / (rr * rr); }; xo = Math.pow(V0 / (2 * PI), 1 / 3); rng0 = [1, 7.5]; ylo = 150; yhi = 700; ylab = "S (cm²)"; unit = "cm²";
        var sk = Math.min(30, (q.w - 120) / (2 * r), (q.h - 60) / (h + 0.6 * r)), cx = q.x + q.w / 2, rr = r * sk, hh = h * sk, top = q.y + (q.h - hh) / 2 + 6, ey = Math.max(4, rr * 0.25);
        Pj = {cx: cx, sk: sk, hx: cx + rr, hy: top + hh * 0.5};
        var gr = ctx.createLinearGradient(cx - rr, 0, cx + rr, 0); gr.addColorStop(0, "#9aa5b4"); gr.addColorStop(0.35, "#eef2f6"); gr.addColorStop(0.6, "#c7cfd9"); gr.addColorStop(1, "#7d8896");
        ctx.save(); ctx.beginPath(); ctx.moveTo(cx - rr, top); ctx.lineTo(cx - rr, top + hh); ctx.ellipse(cx, top + hh, rr, ey, 0, PI, 0, true); ctx.lineTo(cx + rr, top); ctx.closePath(); ctx.fillStyle = gr; ctx.fill();
        ctx.beginPath(); ctx.rect(cx - rr, top + hh * 0.3, 2 * rr, hh * 0.42); ctx.fillStyle = "rgba(192,50,29,.85)"; ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx, top, rr, ey, 0, 0, 7); ctx.fillStyle = "#dfe5ec"; ctx.fill(); ctx.strokeStyle = "#6b7684"; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx + rr * 0.3, top, rr * 0.18, ey * 0.35, 0, 0, 7); ctx.strokeStyle = "#8a95a3"; ctx.stroke(); ctx.restore();
        D.text(c, "33 cL", cx, top + hh * 0.51, {size: Math.max(10, Math.min(16, rr * 0.35)), color: "#fff", weight: 800});
        D.arrow(c, cx, top + hh + ey + 10, cx + rr, top + hh + ey + 10, P.red, 1.8); D.text(c, "r = " + F(r, 2) + " cm", cx + rr / 2, top + hh + ey + 22, {size: 10.5, color: P.red});
        D.line(c, cx - rr - 12, top, cx - rr - 12, top + hh, P.acc, 1.6); D.text(c, "h = " + F(h, 1), cx - rr - 16, top + hh / 2, {size: 10.5, color: P.acc, align: "right"});
        hnd(c, Pj.hx, Pj.hy, P.red, "");
      }
      /* graphe de la grandeur et tangente */
      var g = bx[1], ax = axIn(c, g, {x0: rng0[0], x1: rng0[1], y0: ylo, y1: yhi, xl: box ? "x (cm)" : "r (cm)", yl: ylab, l: 48, t: 12});
      G = ax; D.fn(c, ax, f, P.acc, 3);
      var fx = f(X), sl = df(X), w = (rng0[1] - rng0[0]) * 0.18; D.line(c, ax.X(X - w), ax.Y(fx - sl * w), ax.X(X + w), ax.Y(fx + sl * w), P.amber, 2.4);
      vl(c, ax, X, "#c2c9d3"); pt(c, ax, X, fx, P.red, 6);
      fo = f(xo); var gap = box ? fo - fx : fx - fo, tol = box ? 1 : 0.5, ok = gap < tol;
      if (ok || so.value){ pt(c, ax, xo, fo, P.green, 6); D.label(c, (box ? "max " : "min ") + F(fo, 1) + " " + unit, ax.X(xo), ax.Y(fo) + (box ? -16 : 18), {color: P.green}); }
      D.label(c, "pente f′ = " + F(sl, 1), ax.X(X + w), ax.Y(fx + sl * w) + (sl > 0 ? -12 : 12), {color: P.amber, size: 10.5});
      ro.set(0, (box ? "x = " : "r = ") + F(X, 2) + " cm"); ro.set(1, (box ? "V = " : "S = ") + F(fx, 1) + " " + unit); ro.set(2, F(sl, 2) + (box ? " cm³/cm" : " cm²/cm")); ro.set(3, ok || so.value ? F(gap, 2) + " " + unit : "?");
      if (ok){ if (!won){ won = true; wins++; } nt.set("Défi réussi : " + (box ? "V = " + F(fx, 1) + " cm³, à moins de 1 cm³ du maximum " + F(fo, 1) + " cm³ (x* = (25 − 5√7)/3 ≈ " + F(xo, 3) + " cm). La tangente y est presque horizontale : V′(x*) = 0." : "S = " + F(fx, 1) + " cm², à moins de 0,5 cm² du minimum " + F(fo, 1) + " cm² (r* ≈ " + F(xo, 3) + " cm, h = 2r* ≈ " + F(2 * xo, 2) + " cm : la canette optimale est aussi haute que large). La tangente y est horizontale."), "ok"); }
      else { won = false; nt.set("Défi : " + (box ? "trouve la découpe x qui donne le plus grand volume" : "trouve le rayon qui demande le moins de métal") + ", à " + (box ? "1 cm³" : "0,5 cm²") + " près. Indice : la pente de la tangente (orange) vaut " + F(sl, 1) + (sl > 0 ? (box ? " > 0 : augmente x." : " > 0 : diminue r.") : (box ? " < 0 : diminue x." : " < 0 : augmente r.")), ""); }
    });
    setr("box");
  }
});

/* 4 ---- Newton ---- */
var N4 = {
  sq2: {n: "f(x) = x² − 2", f: function(x){ return x * x - 2; }, d: function(x){ return 2 * x; }, x0: 2, v: "racine : √2 ≈ 1,41421356", xa: -0.5, xb: 3, ya: -3, yb: 6},
  cosx: {n: "f(x) = cos x − x", f: function(x){ return Math.cos(x) - x; }, d: function(x){ return -Math.sin(x) - 1; }, x0: 1.5, v: "racine ≈ 0,7390851", xa: -1, xb: 3, ya: -3, yb: 2},
  cub: {n: "f(x) = x³ − 2x + 2", f: function(x){ return x * x * x - 2 * x + 2; }, d: function(x){ return 3 * x * x - 2; }, x0: 0, v: "départ en 0 : Newton oscille entre 0 et 1 sans converger (cycle) !", xa: -3, xb: 3, ya: -4, yb: 8},
  ln: {n: "f(x) = ln x − 1", f: function(x){ return Math.log(x) - 1; }, d: function(x){ return 1 / x; }, x0: 1, v: "racine : e ≈ 2,71828183", xa: -0.5, xb: 5, ya: -3, yb: 2}
};
SFA.sim({
  id: "um-c03-newton", ch: "c03", tag: "Méthode de Newton",
  titre: "Méthode de Newton : suivre la tangente jusqu'à l'axe",
  resume: "Glisse le point de départ, puis regarde le curseur monter jusqu'à la courbe et glisser le long de la tangente jusqu'à l'axe. En bas, le nombre de chiffres exacts double à chaque pas.",
  but: "Glisse x₀ (poignée sur l'axe) puis clique « Itérer » : le point violet monte jusqu'à la courbe et redescend le long de la tangente ; son point d'arrivée sur l'axe est x₁, et ainsi de suite. En bas, une barre par itération donne le nombre de chiffres exacts. Défi : 8 chiffres exacts en au plus 3 itérations. Avec x³ − 2x + 2, trouve un x₀ qui ne tourne pas en rond.",
  aRetenir: "x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>) : c'est l'abscisse où la tangente en x<sub>n</sub> coupe l'axe Ox. Si la racine est simple et le départ assez proche, la convergence est quadratique : l'erreur est à peu près élevée au carré à chaque pas, le nombre de chiffres exacts double.",
  piege: "Si f′(x<sub>n</sub>) ≈ 0 la tangente est presque horizontale et le pas est énorme ; la méthode peut aussi osciller (cycle 0 → 1 → 0 pour x³ − 2x + 2) ou diverger selon le point de départ.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.82}); lay2(c, 0.82, 1.2);
    var ROOT = {sq2: Math.SQRT2, cosx: 0.7390851332151607, cub: -1.7692923542386314, ln: Math.E}, st = {xs: [], an: -1, ph: 0, auto: 0}, fs, won = false, wins = 0;
    function reset(v){ st.xs = [v]; st.an = -1; st.ph = 0; st.auto = 0; }
    fs = k.select("Fonction", [["sq2", "x² − 2 (calcul de √2)"], ["cosx", "cos x − x"], ["cub", "x³ − 2x + 2 (piège)"], ["ln", "ln x − 1 (calcul de e)"]], "sq2", function(){ x0.set(N4[fs.value].x0); reset(x0.value); won = false; });
    var x0 = k.slider("Point de départ x₀", -3, 5, 0.01, 2, "", function(v){ reset(v); won = false; });
    function next(){ var T = N4[fs.value], x = st.xs[st.xs.length - 1], d = T.d(x), y = T.f(x); if (!isFinite(x) || !isFinite(y) || Math.abs(d) < 1e-12 || st.xs.length > 12) return false; st.xs.push(x - y / d); return true; }
    var lp = k.loop(function(dt){ if (st.an >= 0){ st.ph += dt * 1.3; if (st.ph >= 1){ st.an = -1; st.ph = 0; if (st.auto > 0){ st.auto--; go(); } } } if (st.an < 0 && st.auto <= 0) lp.pause(); k.redraw(); });
    function go(){ if (st.an >= 0) return; if (next()){ st.an = st.xs.length - 2; st.ph = 0; lp.play(); } else st.auto = 0; }
    k.button("Itérer", go, true); k.button("6 itérations", function(){ st.auto = 5; go(); }); k.button("Recommencer", function(){ reset(x0.value); });
    var ro = k.readouts(["Itération n", "xₙ", "f(xₙ)", "Chiffres exacts"]), nt = k.note("", "");
    var G = null, grab = false; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return;
      if (t === "down") grab = Math.abs(G.X(st.xs[0]) - p.x) < 22 && Math.abs(G.Y(0) - p.y) < 34;
      else if (t === "drag" && grab){ var T = N4[fs.value]; x0.set(Math.round(cl(G.ix(p.x), Math.max(-3, T.xa), Math.min(5, T.xb)) * 100) / 100); reset(x0.value); won = false; k.redraw(); }
      else if (t === "up") grab = false;
      else if (t === "move") c.cv.style.cursor = Math.abs(G.X(st.xs[0]) - p.x) < 22 && Math.abs(G.Y(0) - p.y) < 34 ? "ew-resize" : "default";
    });
    reset(x0.value);
    function digits(x){ var r = ROOT[fs.value], e = Math.abs(x - r); if (!isFinite(e)) return 0; return e === 0 ? 16 : cl(-Math.log10(e / Math.abs(r)), 0, 16); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, T = N4[fs.value], H = c.H, h1 = Math.round(H * 0.66), xs = st.xs, n = xs.length, done = st.an < 0 ? n : st.an + 1;
      var ax = axIn(c, {x: 0, y: 0, w: c.W, h: h1}, {x0: T.xa, x1: T.xb, y0: T.ya, y1: T.yb, xl: "x", yl: "y", t: 12, b: 26}); G = ax;
      D.fn(c, ax, T.f, P.acc, 3); D.text(c, T.n, ax.R - 6, ax.T + 10, {size: 12, color: P.acc, align: "right", math: true, halo: true});
      for (var i = 0; i < done - 1; i++){ var x = xs[i], y = T.f(x), nx = xs[i + 1]; D.line(c, ax.X(x), ax.Y(0), ax.X(x), ax.Y(y), "#b9c2cf", 1.2, [3, 3]); D.line(c, ax.X(x), ax.Y(y), ax.X(nx), ax.Y(0), i === done - 2 ? P.amber : "#e6c8a0", i === done - 2 ? 2.4 : 1.5); D.dot(c, ax.X(x), ax.Y(0), 3.5, "#c98a85"); }
      if (st.an >= 0){ var xa = xs[st.an], ya = T.f(xa), xb = xs[st.an + 1], ph = st.ph, px, py;
        var dA = T.d(xa); D.fn(c, ax, function(u){ return ya + dA * (u - xa); }, "rgba(224,122,31,.45)", 1.6, [6, 4]);
        if (ph < 0.4){ var u = ph / 0.4; px = ax.X(xa); py = ax.Y(0) + (ax.Y(ya) - ax.Y(0)) * u; D.line(c, px, ax.Y(0), px, py, P.violet, 2); }
        else { var v = (ph - 0.4) / 0.6; px = ax.X(xa) + (ax.X(xb) - ax.X(xa)) * v; py = ax.Y(ya) + (ax.Y(0) - ax.Y(ya)) * v; D.line(c, ax.X(xa), ax.Y(0), ax.X(xa), ax.Y(ya), P.violet, 1.6, [3, 3]); D.line(c, ax.X(xa), ax.Y(ya), px, py, P.violet, 2.6); }
        D.glow(c, px, py, 16, P.violet, 0.5); D.dot(c, px, py, 6, P.violet); }
      var cur = xs[done - 1]; if (isFinite(cur)){ D.dot(c, ax.X(cur), ax.Y(0), 6, P.red); var fc = T.f(cur); if (isFinite(fc)) pt(c, ax, cur, fc, P.red, 4); D.text(c, "x" + "₀₁₂₃₄₅₆₇₈₉"[Math.min(done - 1, 9)] + (done > 10 ? "…" : ""), ax.X(cur), ax.Y(0) + 16, {size: 12, color: P.red, halo: true, math: true}); }
      hnd(c, ax.X(xs[0]), ax.Y(0), P.red, "x₀ (glisse)");
      /* chiffres exacts par itération */
      var bb = {x: 0, y: h1, w: c.W, h: H - h1}, L = 46, Rr = c.W - 12, T0 = h1 + 22, B0 = H - 24, nb = 7, bw = (Rr - L) / nb;
      D.text(c, "Chiffres exacts de xₙ (la barre double à chaque pas quand ça converge)", 10, h1 + 8, {size: 10.5, color: "#5f6b7a", align: "left", weight: 700});
      ctx.save(); ctx.font = "600 10px Mulish, system-ui"; ctx.fillStyle = "#7b8694"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; [0, 4, 8, 12, 16].forEach(function(d){ var yy = B0 - d / 16 * (B0 - T0); ctx.strokeStyle = d === 8 ? "rgba(36,119,90,.5)" : "#eef1f5"; ctx.setLineDash(d === 8 ? [5, 4] : []); ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(Rr, yy); ctx.stroke(); ctx.fillText(d, L - 6, yy); }); ctx.restore();
      for (i = 0; i < Math.min(done, nb); i++){ var dg = digits(xs[i]), hh = dg / 16 * (B0 - T0); ctx.fillStyle = dg >= 8 ? P.green : P.acc; D.rrect(c, L + i * bw + bw * 0.18, B0 - hh, bw * 0.64, Math.max(hh, 1.5), 3); ctx.fill(); D.text(c, "n = " + i, L + i * bw + bw / 2, B0 + 10, {size: 9.5, color: "#5f6b7a", weight: 600}); }
      var dl = digits(cur), it = done - 1;
      ro.set(0, String(it)); ro.set(1, F(cur, 10)); ro.set(2, S.sci(T.f(cur))); ro.set(3, F(dl, 1));
      if (fs.value === "cub" && Math.abs(xs[0]) < 0.6 && it >= 2 && dl < 2) nt.set("Cycle : depuis x₀ ≈ 0, Newton saute 0 → 1 → 0 → 1… sans jamais converger. Défi : glisse x₀ vers la gauche (x₀ < −1) pour atteindre la racine ≈ −1,769.", "warn");
      else if (dl >= 8 && it <= 3 && it > 0){ if (!won){ won = true; wins++; } nt.set("Défi réussi : " + F(dl, 1) + " chiffres exacts en " + it + " itération(s) depuis x₀ = " + F(xs[0], 2) + ". Les barres montrent la convergence quadratique : 1, 2, 4, 8… chiffres.", "ok"); }
      else if (dl >= 8) nt.set("Racine atteinte (" + F(dl, 1) + " chiffres exacts) mais en " + it + " itérations. Défi : rapproche x₀ de la racine pour y arriver en 3 itérations au plus.", "");
      else nt.set("Défi : choisis x₀ pour obtenir 8 chiffres exacts (ligne verte en bas) en au plus 3 itérations. " + T.v, fs.value === "cub" ? "warn" : "");
    });
    reset(x0.value); st.auto = 2; go();
  }
});

/* 5 ---- Taylor ---- */
function fact(n){ var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
var Y5 = {
  sin: {n: "sin x", f: Math.sin, c: function(j){ return j % 2 === 0 ? 0 : (((j - 1) / 2) % 2 === 0 ? 1 : -1) / fact(j); }, x0: -7, x1: 7, y0: -3, y1: 3, R: Infinity},
  cos: {n: "cos x", f: Math.cos, c: function(j){ return j % 2 === 1 ? 0 : ((j / 2) % 2 === 0 ? 1 : -1) / fact(j); }, x0: -7, x1: 7, y0: -3, y1: 3, R: Infinity},
  exp: {n: "eˣ", f: Math.exp, c: function(j){ return 1 / fact(j); }, x0: -4, x1: 4, y0: -2, y1: 12, R: Infinity},
  ln: {n: "ln(1 + x)", f: function(x){ return Math.log(1 + x); }, c: function(j){ return j === 0 ? 0 : (j % 2 ? 1 : -1) / j; }, x0: -0.95, x1: 3, y0: -3, y1: 3, R: 1},
  geo: {n: "1/(1 − x)", f: function(x){ return 1 / (1 - x); }, c: function(j){ return 1; }, x0: -2, x1: 0.95, y0: -1, y1: 6, R: 1},
  atan: {n: "arctan x", f: Math.atan, c: function(j){ return j % 2 === 0 ? 0 : (((j - 1) / 2) % 2 === 0 ? 1 : -1) / j; }, x0: -3, x1: 3, y0: -2, y1: 2, R: 1}
};
SFA.sim({
  id: "um-c03-taylor", ch: "c03", tag: "Polynômes de Taylor",
  titre: "Polynôme de Taylor : approcher une fonction par des polynômes de plus en plus longs",
  resume: "Augmente l'ordre n : le polynôme se colle à la fonction autour de 0, puis de plus en plus loin. Mais pour ln(1 + x) ou 1/(1 − x), il y a un mur en |x| = 1.",
  but: "Choisis la fonction et l'ordre n, puis lis l'erreur au point x. À l'ordre 1 on retrouve l'approximation affine (la tangente).",
  aRetenir: "T<sub>n</sub>(x) = Σ f<sup>(k)</sup>(0) xᵏ/k! (k de 0 à n). Pour x proche de 0, f(x) ≈ T<sub>n</sub>(x) avec une erreur de l'ordre de xⁿ⁺¹. Ordre 1 : f(x) ≈ f(0) + f′(0)x. Exemples : sin x ≈ x − x³/6 ; eˣ ≈ 1 + x + x²/2 ; ln(1 + x) ≈ x − x²/2.",
  piege: "Le polynôme ne converge pas toujours : pour ln(1 + x), 1/(1 − x), arctan x la série ne converge que pour |x| < 1 (rayon de convergence R = 1). Au-delà, augmenter n aggrave l'erreur.",
  build: function(k, S){
    var c = k.canvas(390), fs = k.select("Fonction", [["sin", "sin x"], ["cos", "cos x"], ["exp", "eˣ"], ["ln", "ln(1 + x)"], ["geo", "1/(1 − x)"], ["atan", "arctan x"]], "sin");
    var n = k.slider("Ordre n", 0, 14, 1, 3, ""), xs = k.slider("Point x où lire l'erreur", -3, 3, 0.05, 0.8, "");
    var ro = k.readouts(["Tₙ(x)", "f(x)", "Erreur |f − Tₙ|", "Polynôme"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = Y5[fs.value], N = n.value, X = xs.value; var coef = []; for (var j = 0; j <= N; j++) coef.push(T.c(j));
      var Tn = function(x){ var s = 0, p = 1; for (var j = 0; j <= N; j++){ s += coef[j] * p; p *= x; } return s; };
      var ax = D.axes(c, {x0: T.x0, x1: T.x1, y0: T.y0, y1: T.y1, xl: "x", yl: "y", hideZero: false}); if (isFinite(T.R)){ vl(c, ax, -T.R, P.red, [5, 4], 1.2); vl(c, ax, T.R, P.red, [5, 4], 1.2); }
      D.fn(c, ax, T.f, "#8a95a3", 4, [0]); D.fn(c, ax, Tn, P.red, 2.8); D.fn(c, ax, T.f, "rgba(30,63,143,.9)", 2, [7, 4]);
      var xx = X; if (fs.value === "ln") xx = Math.max(X, -0.95); if (fs.value === "geo" && xx >= 0.95) xx = 0.95; var fx = T.f(xx), tx = Tn(xx); vl(c, ax, xx, "#c2c9d3"); pt(c, ax, xx, fx, P.acc, 5); pt(c, ax, xx, tx, P.red, 5);
      lab(c, "f = " + T.n, ax.L + 8, ax.T + 12, P.acc, 13, "left"); lab(c, "polynôme Tₙ (n = " + N + ")", ax.L + 8, ax.T + 30, P.red, 13, "left");
      var poly = []; for (j = 0; j <= Math.min(N, 5); j++){ if (Math.abs(coef[j]) > 1e-12) poly.push((coef[j] < 0 ? "−" : (poly.length ? "+" : "")) + (j === 0 ? F(Math.abs(coef[j]), 4) : (Math.abs(Math.abs(coef[j]) - 1) < 1e-12 ? "" : F(Math.abs(coef[j]), 4)) + "x" + (j > 1 ? ["", "", "²", "³", "⁴", "⁵"][j] : ""))); }
      ro.set(0, F(tx, 6)); ro.set(1, F(fx, 6)); ro.set(2, S.sci(Math.abs(fx - tx))); ro.set(3, poly.join(" ") + (N > 5 ? " + …" : ""));
      var out = isFinite(T.R) && Math.abs(xx) >= T.R; nt.set(out ? "Hors du rayon de convergence (|x| ≥ 1) : monter en n ne fait pas converger Tₙ(x) vers f(x)." : (N === 1 ? "Ordre 1 : c'est la tangente en 0, la meilleure droite qui approche f près de 0." : "Plus n est grand, plus Tₙ colle à f autour de 0."), out ? "warn" : "");
    });
  }
});
})();
