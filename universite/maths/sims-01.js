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
/* Mathématiques BA1 · chapitre 1 : fonctions réelles et graphes */
/* 1 ---- transformations ---- */
var T1 = {
  x2: {n: "x²", f: function(x){ return x * x; }, kp: [0, 0]},
  abs: {n: "|x|", f: function(x){ return Math.abs(x); }, kp: [0, 0]},
  sin: {n: "sin x", f: function(x){ return Math.sin(x); }, kp: [PI / 2, 1]},
  sqrt: {n: "√x", f: function(x){ return Math.sqrt(x); }, kp: [1, 1]},
  inv: {n: "1/x", f: function(x){ return 1 / x; }, kp: [1, 1]},
  exp: {n: "eˣ", f: function(x){ return Math.exp(x); }, kp: [0, 1]},
  ln: {n: "ln x", f: function(x){ return Math.log(x); }, kp: [1, 0]}
};
function dom1(t, b, h){
  if (t === "sqrt") return b > 0 ? "x ≥ " + F(h) : "x ≤ " + F(h);
  if (t === "ln") return b > 0 ? "x > " + F(h) : "x < " + F(h);
  if (t === "inv") return "x ≠ " + F(h);
  return "ℝ";
}
function img1(t, a, k){
  if (a === 0) return "{" + F(k) + "}";
  if (t === "x2" || t === "abs" || t === "sqrt") return a > 0 ? "y ≥ " + F(k) : "y ≤ " + F(k);
  if (t === "sin") return "[" + F(k - Math.abs(a)) + " ; " + F(k + Math.abs(a)) + "]";
  if (t === "inv") return "y ≠ " + F(k);
  if (t === "exp") return a > 0 ? "y > " + F(k) : "y < " + F(k);
  return "ℝ";
}
SFA.sim({
  id: "um-c01-transformations", ch: "c01", tag: "Transformations de graphes",
  titre: "g(x) = a·f(b(x − h)) + k : lire les quatre paramètres sur le graphe",
  resume: "Choisis une fonction de référence et déforme-la : dilatation, symétrie, translation. Un point repère te montre où va chaque point.",
  but: "Choisis f, puis fais varier a, b, h et k. La courbe grise est f ; la bleue est g. La flèche suit un point caractéristique de f.",
  aRetenir: "a étire verticalement (a < 0 : symétrie par rapport à l'axe Ox) ; b comprime horizontalement d'un facteur 1/|b| (b < 0 : symétrie par rapport à Oy) ; h translate horizontalement, k verticalement. Le point (x₀ ; y₀) de f devient (h + x₀/b ; a·y₀ + k).",
  piege: "Dans b(x − h), le décalage horizontal vaut h et non b·h : écrire f(2x − 6) = f(2(x − 3)) montre une translation de 3, pas de 6. Et h > 0 déplace vers la droite.",
  build: function(k, S){
    var c = k.canvas(400), tp = k.select("Fonction de référence f", [["x2", "x²"], ["abs", "|x|"], ["sin", "sin x"], ["sqrt", "√x"], ["inv", "1/x"], ["exp", "eˣ"], ["ln", "ln x"]], "x2");
    (function(){ var r0 = c.resize; c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < 560) ? 1 : 0.78; r0(); }; c.resize(); })();
    var a = k.slider("a (dilatation verticale)", -3, 3, 0.25, 1.5, ""), b = k.slider("b (dilatation horizontale)", -3, 3, 0.25, 1, ""), h = k.slider("h (translation horizontale)", -4, 4, 0.25, 1, ""), kk = k.slider("k (translation verticale)", -4, 4, 0.25, -1, "");
    var TG = [[2, 1, 0, -1], [-1, 1, 1, 2], [1, 2, 0, 1], [1.5, -1, -1, 0.5], [0.5, 1, 2, -2]], ti = 0, gd = k.toggle("Défi : épouse la courbe cible (orange)", false);
    k.button("Nouvelle cible", function(){ ti = (ti + 1) % TG.length; gd.set(true); });
    k.button("Remettre a = b = 1, h = k = 0", function(){ a.set(1); b.set(1); h.set(0); kk.set(0); });
    var ro = k.readouts(["Domaine de g", "Image de g", "Point repère"]), nt = k.note("", ""), ax = null, grab = false;
    function sn(x){ return Math.round(x * 4) / 4; }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!ax) return; var T = T1[tp.value], B = b.value;
      if (t === "down"){ if (B !== 0){ var x1 = h.value + T.kp[0] / B, y1 = a.value * T.kp[1] + kk.value; grab = Math.hypot(ax.X(x1) - p.x, ax.Y(y1) - p.y) < 26; } }
      else if (t === "drag" && grab && B !== 0){ h.set(sn(Math.max(-4, Math.min(4, ax.ix(p.x) - T.kp[0] / B)))); kk.set(sn(Math.max(-4, Math.min(4, ax.iy(p.y) - a.value * T.kp[1])))); k.redraw(); }
      else if (t === "up") grab = false;
    });
    k.draw(function(){
      c.clear(); ax = D.axes(c, {x0: -7, x1: 7, y0: -6, y1: 6, equal: true, stepX: 1, stepY: 1, xl: "x", yl: "y"});
      var T = T1[tp.value], f = T.f, A = a.value, B = b.value, H = h.value, K = kk.value;
      D.fn(c, ax, f, "#aab2bd", 2.2, [6, 4]);
      var g = function(x){ return A * f(B * (x - H)) + K; }, ok = false;
      if (gd.value){ var q = TG[ti], gt = function(x){ return q[0] * f(q[1] * (x - q[2])) + q[3]; }; D.fn(c, ax, gt, P.orange, 3.2, [9, 5]); var n = 0, bad = 0; for (var i = -60; i <= 60; i++){ var x = i / 10, u = g(x), v = gt(x); if (isFinite(u) && isFinite(v) && Math.abs(u) < 12 && Math.abs(v) < 12){ n++; if (Math.abs(u - v) > 0.12) bad++; } else if (isFinite(u) !== isFinite(v)) bad++; } ok = n > 15 && bad === 0; }
      if (B !== 0) D.fn(c, ax, g, ok ? P.green : P.acc, 3.4);
      var x0 = T.kp[0], y0 = T.kp[1];
      D.dot(c, ax.X(x0), ax.Y(y0), 5, "#8a95a3");
      if (B !== 0){ var x1 = H + x0 / B, y1 = A * y0 + K; D.arrow(c, ax.X(x0), ax.Y(y0), ax.X(x1), ax.Y(y1), P.red, 2); D.dot(c, ax.X(x1), ax.Y(y1), 8, P.red); D.label(c, "glisse-moi", ax.X(x1) + 12, ax.Y(y1) - 16, {color:P.red, size:10.5, align:"left", math:false}); ro.set(2, "(" + F(x0, 2) + " ; " + F(y0, 2) + ") → (" + F(x1, 2) + " ; " + F(y1, 2) + ")"); }
      D.label(c, "f(x) = " + T.n, ax.L + 8, ax.T + 8, {color:"#6b7380", align:"left", base:"top", math:true});
      D.label(c, "g(x) = " + F(A, 2) + "·f(" + F(B, 2) + "(x " + (H < 0 ? "+ " + F(-H, 2) : "− " + F(H, 2)) + ")) " + (K < 0 ? "− " + F(-K, 2) : "+ " + F(K, 2)), ax.L + 8, ax.T + 32, {color:P.acc, align:"left", base:"top", math:true, size:c.W < 520 ? 10.5 : 11.5});
      ro.set(0, B === 0 ? "—" : dom1(tp.value, B, H)); ro.set(1, B === 0 ? "{" + F(A * f(0) + K) + "}" : img1(tp.value, A, K));
      if (gd.value) nt.set(ok ? "Bravo : g coïncide avec la cible (a = " + F(TG[ti][0], 2) + ", b = " + F(TG[ti][1], 2) + ", h = " + F(TG[ti][2], 2) + ", k = " + F(TG[ti][3], 2) + "). Procède dans l'ordre : forme (a, b), puis position (h, k)." : "Fais coïncider la courbe bleue avec la courbe orange. Astuce : glisse le point rouge pour régler h et k, puis ajuste a et b.", ok ? "ok" : "warn");
      else if (B === 0) { nt.set("b = 0 : g est constante (on n'a plus de dilatation, tout x donne le même f(0)).", "warn"); ro.set(2, "—"); }
      else if (A === 0) nt.set("a = 0 : g est constante, égale à k.", "warn");
      else nt.set("Teste : change le signe de a, puis de b, et compare les deux symétries. Glisse le point rouge pour translater.", "");
    });
  }
});

/* 2 ---- réciproque ---- */
var R2 = {
  exp: {n: "f(x) = eˣ", g: "ln x", f: function(x){ return Math.exp(x); }, fi: function(y){ return Math.log(y); }, lo: -3, hi: 2.6, ok: true},
  cube: {n: "f(x) = x³", g: "∛x", f: function(x){ return x * x * x; }, fi: function(y){ return Math.cbrt(y); }, lo: -2.5, hi: 2.5, ok: true},
  sq: {n: "f(x) = x²", g: "√x", f: function(x){ return x * x; }, fi: function(y){ return Math.sqrt(y); }, lo: -3, hi: 3, ok: false, rlo: 0},
  sin: {n: "f(x) = sin x", g: "arcsin x", f: function(x){ return Math.sin(x); }, fi: function(y){ return Math.asin(y); }, lo: -PI, hi: PI, ok: false, rlo: -PI / 2, rhi: PI / 2},
  tan: {n: "f(x) = tan x", g: "arctan x", f: function(x){ return Math.tan(x); }, fi: function(y){ return Math.atan(y); }, lo: -PI / 2 + 0.02, hi: PI / 2 - 0.02, ok: true}
};
SFA.sim({
  id: "um-c01-reciproque", ch: "c01", tag: "Fonction réciproque",
  titre: "La réciproque, c'est le graphe vu dans un miroir y = x",
  resume: "Fais glisser un point sur f : son symétrique par rapport à la droite y = x est sur la réciproque. Teste le critère de la droite horizontale.",
  but: "Choisis f et fais glisser le point sur la courbe bleue. La droite horizontale doit couper f en un seul point pour que f soit injective sur le domaine choisi.",
  aRetenir: "f admet une réciproque f⁻¹ sur un intervalle où elle est injective (strictement monotone). Les graphes de f et f⁻¹ sont symétriques par rapport à y = x ; domaine de f⁻¹ = image de f ; f⁻¹(f(x)) = x.",
  piege: "x² n'a pas de réciproque sur ℝ : √(x²) = |x| et non x. Pour sin, il faut restreindre à [−π/2 ; π/2] pour définir arcsin.",
  build: function(k, S){
    var c = k.canvas(400), tp = k.select("Fonction", [["exp", "eˣ"], ["cube", "x³"], ["sq", "x²"], ["sin", "sin x"], ["tan", "tan x"]], "sq");
    var rs = k.toggle("Restreindre au domaine d'injectivité (x² : x ≥ 0 ; sin : [−π/2 ; π/2])", true);
    var ax0 = k.slider("Abscisse du point sur f", -2.5, 2.5, 0.05, 0.9, ""); var ro = k.readouts(["x", "f(x)", "Droite y = f(x) coupe f en", "f⁻¹(f(x))"]), nt = k.note("", "");
    c.pointer(function(t, p){ if (t === "down" || t === "drag"){ var ax = c._ax; if (ax) ax0.set(ax.ix(p.x)); k.redraw(); } });
    k.draw(function(){
      c.clear(); var ax = D.axes(c, {x0: -4, x1: 4, y0: -3.5, y1: 3.5, equal: true, stepX: 1, stepY: 1, xl: "x", yl: "y"}); c._ax = ax;
      var T = R2[tp.value], lo = T.lo, hi = T.hi, ra = lo, rb = hi;
      if (rs.value && !T.ok){ ra = T.rlo !== undefined ? T.rlo : lo; rb = T.rhi !== undefined ? T.rhi : hi; }
      D.line(c, ax.X(-6), ax.Y(-6), ax.X(6), ax.Y(6), "#aab2bd", 1.6, [6, 4]);
      curve(c, ax, function(t){ return t; }, T.f, lo, hi, "#aab2bd", 1.6, [2, 3]);
      curve(c, ax, function(t){ return t; }, T.f, ra, rb, P.acc, 3.2);
      curve(c, ax, T.f, function(t){ return t; }, ra, rb, P.red, 3.2);
      var x = cl(ax0.value, ra, rb), y = T.f(x), many = !T.ok && !rs.value;
      if (tp.value === "tan") x = cl(x, -1.5, 1.5), y = T.f(x);
      hl(c, ax, y, "#c2c9d3"); vl(c, ax, x, "#c2c9d3"); vl(c, ax, y, "#e5b3ae"); hl(c, ax, x, "#e5b3ae");
      pt(c, ax, x, y, P.acc, 6); pt(c, ax, y, x, P.red, 6);
      lab(c, "f", ax.X(Math.min(ra + 0.2, 3)), ax.Y(T.f(Math.min(ra + 0.2, 3))) - 14, P.acc, 14);
      lab(c, "f⁻¹ = " + T.g, ax.L + 8, ax.T + 12, P.red, 13, "left"); lab(c, T.n, ax.L + 8, ax.T + 30, P.acc, 13, "left");
      var cnt = tp.value === "sq" && !rs.value ? (Math.abs(x) < 1e-9 ? 1 : 2) : tp.value === "sin" && !rs.value ? "plusieurs points (infiniment)" : 1;
      if (tp.value === "sq" && !rs.value && Math.abs(x) > 1e-9){ pt(c, ax, -x, y, P.amber, 5); }
      ro.set(0, F(x, 3)); ro.set(1, F(y, 3)); ro.set(2, typeof cnt === "number" ? cnt + " point" + (cnt > 1 ? "s" : "") : cnt);
      ro.set(3, many ? "ambigu" : F(T.fi(y), 3));
      nt.set(many ? "Non injective : la droite horizontale coupe plusieurs fois. Le miroir (rouge) n'est pas le graphe d'une fonction. Active la restriction." : "f est injective ici : sa réciproque (en rouge) est bien une fonction. Remarque le domaine et l'image qui s'échangent.", many ? "warn" : "ok");
    });
  }
});

/* 3 ---- exp / ln, échelle semi-log ---- */
var DATA3 = [[0, 520], [1, 770], [2, 1190], [3, 1690], [4, 2650], [5, 3790], [6, 5900], [7, 8450], [8, 12600]];
SFA.sim({
  id: "um-c01-exp-ln", ch: "c01", tag: "Exponentielle et logarithme",
  titre: "Exponentielle, logarithme et papier semi-logarithmique",
  resume: "Une culture de bactéries se divise sous tes yeux. Sur papier semi-logarithmique, ses comptages s'alignent : glisse la droite sur les points pour lire la base b et le temps de doublement.",
  but: "Lance la culture : les bactéries se divisent et chaque comptage horaire s'ajoute au graphe. Compare l'échelle linéaire et l'échelle logarithmique, puis glisse les deux poignées de la droite N = N₀·bᵗ. Défi : erreur moyenne inférieure à 5 %, puis lis le temps de doublement.",
  aRetenir: "bˣ = e<sup>x ln b</sup>. log<sub>b</sub> x = ln x / ln b est la réciproque de bˣ. ln(xy) = ln x + ln y ; ln(xʸ) = y ln x. Une croissance exponentielle N = N₀bᵗ devient une droite sur échelle log : log N = log N₀ + t·log b (ordonnée à l'origine log N₀, pente log b). Temps de doublement = ln 2 / ln b.",
  piege: "ln(x + y) ≠ ln x + ln y. Et sur une échelle logarithmique, des écarts égaux représentent des rapports égaux (×10), pas des différences égales : le zéro n'y existe pas.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.64}); lay2(c, 0.64, 1.45);
    var sc = k.seg("Échelle verticale du graphe", [["log", "logarithmique"], ["lin", "linéaire"]], "log");
    var b = k.slider("Base b (facteur par heure)", 0.5, 2.5, 0.01, 1.2, ""), n0 = k.slider("Effectif de départ N₀", 50, 1500, 10, 300, "");
    var cul = {data: [], b: 1.48}, seed = 1, tt = 0, grab = -1, G = null, wins = 0;
    function make(){
      if (seed === 1) cul.data = DATA3.map(function(d){ return d.slice(); });
      else { var r = rnd(seed * 7919), bb = 1.3 + 0.55 * r(), nn = 150 + 650 * r(); cul.data = []; for (var t = 0; t <= 8; t++) cul.data.push([t, Math.round(nn * Math.pow(bb, t) * Math.exp(0.1 * (r() - 0.5)))]); }
      tt = 0; b.set(1.2); n0.set(300);
    }
    var R = rnd(11), cells = [], seeds = [[-0.32, -0.2], [0.35, 0.12], [-0.05, 0.45], [0.18, -0.48], [-0.52, 0.28]];
    for (var i = 0; i < 300; i++){ var px, py; if (i < seeds.length){ px = seeds[i][0]; py = seeds[i][1]; } else { var p = cells[Math.floor(R() * i)], a = R() * 6.283, d = 0.055 + 0.05 * R(); px = p.x + Math.cos(a) * d; py = p.y + Math.sin(a) * d; var m = Math.hypot(px, py); if (m > 0.86){ px *= 0.86 / m; py *= 0.86 / m; } } cells.push({x: px, y: py, a: R() * PI}); }
    function Ntrue(t){ var dd = cul.data, j = Math.min(7, Math.max(0, Math.floor(t))), f = cl(t - j, 0, 1); if (t >= 8) return dd[8][1]; return dd[j][1] * Math.pow(dd[j + 1][1] / dd[j][1], f); }
    var lp = k.loop(function(dt){ tt += dt * 0.75; if (tt >= 8.4){ tt = 8.4; lp.pause(); } k.redraw(); });
    k.button("▶ Lancer / arrêter la culture", function(){ if (tt >= 8.4) tt = 0; lp.running ? lp.pause() : lp.play(); }, true);
    k.button("Nouvelle culture", function(){ seed++; make(); lp.play(); });
    var ro = k.readouts(["Taux continu k = ln b", "Doublement ln 2 / ln b", "Erreur moyenne", "Comptage à t"]), nt = k.note("", "");
    make(); c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return;
      if (t === "down"){ grab = -1; [0, 1].forEach(function(q){ var hx = G.X(q ? 8 : 0), hy = G.Y(n0.value * (q ? Math.pow(b.value, 8) : 1)); if (Math.hypot(hx - p.x, hy - p.y) < 26) grab = q; }); }
      else if (t === "drag" && grab >= 0){ var v = G.iY(p.y); if (!(v > 0)) v = 1; if (grab === 0) n0.set(cl(Math.round(v / 10) * 10, 50, 1500)); else b.set(cl(Math.pow(v / n0.value, 1 / 8), 0.5, 2.5)); k.redraw(); }
      else if (t === "move"){ var on = false; [0, 1].forEach(function(q){ if (Math.hypot(G.X(q ? 8 : 0) - p.x, G.Y(n0.value * (q ? Math.pow(b.value, 8) : 1)) - p.y) < 26) on = true; }); c.cv.style.cursor = on ? "grab" : "default"; }
      else if (t === "up") grab = -1;
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, bx = split2(c, 0.4, 0.46), B = b.value, N0 = n0.value, dd = cul.data, Nmax = dd[8][1], tnow = Math.min(tt, 8), Nn = Ntrue(tnow);
      /* --- la boîte de Petri --- */
      var q = bx[0], cx = q.x + q.w / 2, cy = q.y + q.h / 2 + 4, rad = Math.min(q.w, q.h) / 2 - 22;
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(cx, cy, rad + 8, 0, 7); ctx.fillStyle = "#eef3f8"; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, rad + 8, 0, 7); ctx.strokeStyle = "#b8c4d2"; ctx.lineWidth = 2; ctx.stroke();
      var gr = ctx.createRadialGradient(cx - rad * 0.3, cy - rad * 0.3, rad * 0.1, cx, cy, rad); gr.addColorStop(0, "#fbf0cf"); gr.addColorStop(1, "#ecd9a0");
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fillStyle = gr; ctx.fill();
      var unit = Nmax / 300, cnt = Math.min(300, Nn / unit), s = Math.max(0.7, rad / 120);
      for (i = 0; i < Math.ceil(cnt); i++){
        var ce = cells[i], fr = i < Math.floor(cnt) ? 1 : cnt - Math.floor(cnt), CXc = cx + ce.x * rad, CYc = cy + ce.y * rad;
        ctx.save(); ctx.translate(CXc, CYc); ctx.rotate(ce.a); ctx.globalAlpha = 0.35 + 0.65 * fr;
        var div = i >= Math.floor(cnt) - 3 && lp.running, gap = div ? 2.2 * s : 0;
        [-1, 1].forEach(function(sg){ ctx.beginPath(); ctx.ellipse(sg * (2.6 * s + gap / 2), 0, 2.9 * s, 2.1 * s, 0, 0, 7); ctx.fillStyle = "#a63d74"; ctx.fill(); ctx.strokeStyle = "#6f2350"; ctx.lineWidth = 0.7; ctx.stroke(); });
        ctx.restore();
      }
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx - rad * 0.45, cy - rad * 0.5, rad * 0.22, PI * 1.1, PI * 1.6); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.stroke();
      D.label(c, "1 bâtonnet dessiné ≈ " + F(unit, 0) + " bactéries", cx, q.y + q.h - 10, {color: "#6f2350", size: 10.5});
      D.display(c, F(tnow, 1) + " h", q.x + 50, q.y + 30, {w: 84, h: 44, caption: "TEMPS"});
      D.display(c, F(Nn, 0), q.x + q.w - 58, q.y + 30, {w: 100, h: 44, caption: "BACTÉRIES", size: 17});
      /* --- le graphe (log ou linéaire) --- */
      var g = bx[1], L = g.x + 54, Rr = g.x + g.w - 14, T = g.y + 22, Bt = g.y + g.h - 40, lg = sc.value === "log";
      var lo = Math.floor(Math.log10(dd[0][1] * 0.6)), hi = Math.ceil(Math.log10(Nmax * 1.6)), ymax = Nmax * 1.25;
      function X(t){ return L + t / 8.4 * (Rr - L); }
      function Yv(v){ return lg ? Bt - (Math.log10(Math.max(v, 1e-9)) - lo) / (hi - lo) * (Bt - T) : Bt - v / ymax * (Bt - T); }
      G = {X: X, Y: Yv, iY: function(py){ return lg ? Math.pow(10, lo + (Bt - py) / (Bt - T) * (hi - lo)) : (Bt - py) / (Bt - T) * ymax; }};
      ctx.save(); ctx.font = "600 10.5px Mulish, system-ui"; ctx.fillStyle = "#5f6b7a"; ctx.lineWidth = 1;
      if (lg){ for (var e = lo; e <= hi; e++){ for (var mm = 1; mm <= 9; mm++){ var v = mm * Math.pow(10, e); if (e === hi && mm > 1) break; ctx.strokeStyle = mm === 1 ? "#cfd6df" : "#eef1f5"; ctx.beginPath(); ctx.moveTo(L, Yv(v)); ctx.lineTo(Rr, Yv(v)); ctx.stroke(); }
          ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("10" + "⁰¹²³⁴⁵⁶⁷⁸⁹"[e], L - 6, Yv(Math.pow(10, e))); } }
      else { var st = Math.pow(10, Math.floor(Math.log10(ymax / 4))), stp = ymax / st > 8 ? st * 2 : st; if (ymax / stp > 8) stp *= 2.5; for (var yv = 0; yv <= ymax; yv += stp){ ctx.strokeStyle = "#eef1f5"; ctx.beginPath(); ctx.moveTo(L, Yv(yv)); ctx.lineTo(Rr, Yv(yv)); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(F(yv, 0), L - 6, Yv(yv)); } }
      ctx.textBaseline = "top"; ctx.textAlign = "center"; for (var tq = 0; tq <= 8; tq++){ ctx.strokeStyle = "#eef1f5"; ctx.beginPath(); ctx.moveTo(X(tq), T); ctx.lineTo(X(tq), Bt); ctx.stroke(); ctx.fillText(tq, X(tq), Bt + 5); }
      ctx.fillStyle = "#2c3a4e"; ctx.font = "700 11px Mulish, system-ui"; ctx.fillText("t (h)", (L + Rr) / 2, Bt + 21); ctx.textAlign = "left"; ctx.fillText(lg ? "N (échelle log)" : "N (échelle linéaire)", L + 4, g.y + 4);
      ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, Bt); ctx.lineTo(Rr, Bt); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(L, T - 4, Rr - L, Bt - T + 4); ctx.clip();
      var err = 0, ne = 0;
      ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath(); for (i = 0; i <= 120; i++){ var t2 = 8.4 * i / 120, yy = Yv(N0 * Math.pow(B, t2)); i ? ctx.lineTo(X(t2), yy) : ctx.moveTo(X(t2), yy); } ctx.stroke();
      if (tt > 0.05){ ctx.strokeStyle = "rgba(166,61,116,.35)"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); for (i = 0; i <= 80; i++){ var t3 = tnow * i / 80; i ? ctx.lineTo(X(t3), Yv(Ntrue(t3))) : ctx.moveTo(X(t3), Yv(Ntrue(t3))); } ctx.stroke(); ctx.setLineDash([]); }
      dd.forEach(function(d){ if (d[0] > tt + 1e-9) return; D.dot(c, X(d[0]), Yv(d[1]), 5.5, "#a63d74"); err += Math.abs(Math.log(N0 * Math.pow(B, d[0])) - Math.log(d[1])); ne++; });
      ctx.restore();
      var done = ne === 9, er = ne ? (Math.exp(err / ne) - 1) * 100 : NaN, ok = done && er < 5, Td = B > 1 ? Math.log(2) / Math.log(B) : NaN;
      if (ok && Td > 0.2){ var t0 = 0, n = N0; ctx.save(); ctx.strokeStyle = P.green; ctx.lineWidth = 2; for (i = 0; i < 12 && t0 + Td <= 8.4; i++){ ctx.beginPath(); ctx.moveTo(X(t0), Yv(n)); ctx.lineTo(X(t0 + Td), Yv(n)); ctx.lineTo(X(t0 + Td), Yv(2 * n)); ctx.stroke(); t0 += Td; n *= 2; } ctx.restore(); D.label(c, "× 2 toutes les " + F(Td, 2) + " h", X(Math.min(t0, 5)), Yv(n) - 18, {color: P.green}); }
      hnd(c, X(0), Yv(N0), P.acc, "N₀"); hnd(c, X(8), Yv(N0 * Math.pow(B, 8)), P.acc, "");
      D.label(c, "N = " + F(N0, 0) + " × " + F(B, 2) + " ^ t", Rr - 6, Bt - 16, {color: P.acc, align: "right", size: 11});
      ro.set(0, F(Math.log(B), 3) + " h⁻¹"); ro.set(1, B > 1 ? F(Td, 2) + " h" : B < 1 ? "— (décroissance)" : "—"); ro.set(2, ne ? F(er, 1) + " %" : "—"); ro.set(3, F(Nn, 0) + " (t = " + F(tnow, 1) + " h)");
      if (Math.abs(B - 1) < 1e-9) nt.set("b = 1 : la fonction est constante ; le logarithme de base 1 n'existe pas.", "warn");
      else if (!done) nt.set(lg ? "Les comptages s'ajoutent heure par heure. Remarque : sur l'échelle log, ils s'alignent. Laisse la culture atteindre 8 h, puis glisse la poignée N₀ (à gauche) et celle de droite (la pente)." : "En échelle linéaire, la croissance paraît d'abord lente puis explosive. Repasse en échelle log pour voir une droite.", "");
      else if (ok){ if (!c._won){ c._won = true; wins++; } nt.set("Défi réussi (" + wins + ") : erreur " + F(er, 1) + " %. b ≈ " + F(B, 2) + " par heure, donc k = ln b ≈ " + F(Math.log(B), 3) + " h⁻¹ et la population double toutes les ln 2 / ln b ≈ " + F(Td, 2) + " h (" + F(Td * 60, 0) + " min). Essaie une « Nouvelle culture ».", "ok"); }
      else { c._won = false; nt.set("Défi : glisse la poignée N₀ (ordonnée à l'origine) puis celle de droite (la pente) pour que la droite passe par les points. Erreur actuelle " + F(er, 1) + " % (objectif : moins de 5 %)." + (lg ? "" : " Astuce : c'est bien plus facile en échelle log."), "warn"); }
    });
    lp.play();
  }
});

/* 4 ---- trigonométrie ---- */
SFA.sim({
  id: "um-c01-trigo", ch: "c01", tag: "Fonctions trigonométriques",
  titre: "Du cercle à la sinusoïde : amplitude, période, phase",
  resume: "Une roue tourne ; la hauteur de sa nacelle rouge trace y = D + A·sin(B(t − C)). Glisse la crête et la ligne médiane sur le graphe, et fais épouser des signaux cibles.",
  but: "La nacelle rouge tourne sur la roue (rayon A, axe à la hauteur D, vitesse angulaire B) ; sa hauteur se reporte sur le graphe. Glisse la crête (orange) et le point de la ligne médiane (vert) directement sur le graphe, ou utilise les curseurs. Défi : superpose ta sinusoïde à la courbe cible.",
  aRetenir: "y = D + A sin(B(t − C)) : amplitude |A| (rayon de la roue), période 2π/|B|, fréquence |B|/2π, déphasage C, valeur moyenne D (hauteur de l'axe). Applications : rythme circadien, pression artérielle, courant alternatif, oscillations de population.",
  piege: "Dans sin(Bt − φ), le décalage dans le temps est φ/B, pas φ. Et sin(2t) a une période π, pas 4π.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.46}); lay2(c, 0.46, 1.38);
    var A = k.slider("Amplitude A (rayon)", 0.5, 2, 0.1, 1.5, ""), Bv = k.slider("Pulsation B", 0.5, 4, 0.25, 1, "rad/unité"), C = k.slider("Décalage C", -3, 3, 0.1, 0, ""), Dv = k.slider("Ligne médiane D", -1, 1, 0.1, 0, "");
    var tt = 0, lp = k.loop(function(dt){ tt += dt * 0.9; if (tt > 4 * PI) tt = 0; k.redraw(); });
    k.button("Lecture / pause", function(){ lp.running ? lp.pause() : lp.play(); }, true); k.button("Revenir à t = 0", function(){ tt = 0; });
    var TG = [[1, 2, 0, 0], [1.5, 0.5, 1, 0.5], [2, 1, -1, -1], [0.8, 3, 0.5, 0.3], [1.2, 1.5, -2, 0.6]], ti = -1, wins = 0;
    var gd = k.toggle("Défi : épouse la courbe cible (orange)", false, function(v){ if (v && ti < 0) ti = 0; });
    k.button("Cible suivante", function(){ ti = (ti + 1) % TG.length; gd.set(true); });
    var ro = k.readouts(["Période 2π/B", "Fréquence B/2π", "Hauteur y(t)", "Crête à crête 2A"]), nt = k.note("", "");
    var G = null, grab = null; c.cv.style.touchAction = "none";
    function wrapT(x){ var T = 2 * PI / Bv.value; while (x < 0.05) x += T; while (x > 4 * PI - 0.05 && x - T >= 0.05) x -= T; return x; }
    function crest(){ var B = Bv.value, x = wrapT(C.value + PI / (2 * B)); return [x, Dv.value + A.value, x - C.value - PI / (2 * B)]; }
    function mid(){ var x = wrapT(C.value); return [x, Dv.value, x - C.value]; }
    var sh = 0;
    c.pointer(function(t, p){
      if (!G) return; var cr = crest(), md = mid();
      if (t === "down"){ grab = null; if (Math.hypot(G.X(cr[0]) - p.x, G.Y(cr[1]) - p.y) < 24){ grab = "c"; sh = cr[2]; } else if (Math.hypot(G.X(md[0]) - p.x, G.Y(md[1]) - p.y) < 24){ grab = "m"; sh = md[2]; } }
      else if (t === "drag" && grab){ var x = G.ix(p.x) - sh, y = G.iy(p.y); if (grab === "c"){ A.set(Math.round(cl(y - Dv.value, 0.5, 2) * 10) / 10); C.set(Math.round(cl(x - PI / (2 * Bv.value), -3, 3) * 10) / 10); } else { Dv.set(Math.round(cl(y, -1, 1) * 10) / 10); C.set(Math.round(cl(x, -3, 3) * 10) / 10); } k.redraw(); }
      else if (t === "up") grab = null;
      else if (t === "move") c.cv.style.cursor = (Math.hypot(G.X(cr[0]) - p.x, G.Y(cr[1]) - p.y) < 24 || Math.hypot(G.X(md[0]) - p.x, G.Y(md[1]) - p.y) < 24) ? "grab" : "default";
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, a = A.value, B = Bv.value, ph = C.value, d = Dv.value, stack = W < 560;
      var R, cx, cy, gx0, gx1, cyg;
      if (stack){ R = Math.min((H * 0.46 - 10) / 6.2, W / 7); cx = W / 2; cy = H * 0.23; gx0 = 34; gx1 = W - 14; cyg = H * 0.74; }
      else { R = (H - 34) / 6.6; cx = 3.3 * R + 6; cy = H / 2; gx0 = cx + 3.3 * R + 30; gx1 = W - 14; cyg = H / 2; }
      var X = function(t){ return gx0 + t / (4 * PI) * (gx1 - gx0); }, Y = function(v){ return cyg - v * R; }, Yw = function(v){ return cy - v * R; };
      G = {X: X, Y: Y, ix: function(px){ return (px - gx0) / (gx1 - gx0) * 4 * PI; }, iy: function(py){ return (cyg - py) / R; }};
      /* --- la roue --- */
      var th = B * (tt - ph), hub = Yw(d), rw = Math.abs(a) * R;
      ctx.save(); ctx.fillStyle = "#e8edf3"; ctx.beginPath(); ctx.moveTo(cx - R * 0.9, Yw(-3.2)); ctx.lineTo(cx, hub); ctx.lineTo(cx + R * 0.9, Yw(-3.2)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#aeb8c5"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "#d5dbe3"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(cx - 3.2 * R, Yw(0)); ctx.lineTo(cx + 3.2 * R, Yw(0)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = P.acc; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(cx, hub, rw, 0, 7); ctx.stroke(); ctx.strokeStyle = "rgba(31,75,158,.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, hub, rw * 0.82, 0, 7); ctx.stroke();
      for (var i = 0; i < 8; i++){ var ang = th + i * PI / 4; D.line(c, cx, hub, cx + rw * Math.cos(ang), hub - rw * Math.sin(ang) * (a < 0 ? -1 : 1), "rgba(31,75,158,.45)", 1.3);
        if (i){ var gx = cx + rw * Math.cos(ang), gy = hub - rw * Math.sin(ang) * (a < 0 ? -1 : 1); ctx.fillStyle = "#c9d3e3"; ctx.fillRect(gx - 5, gy + 1, 10, 8); ctx.strokeStyle = "#8ea0bd"; ctx.lineWidth = 1; ctx.strokeRect(gx - 5, gy + 1, 10, 8); } }
      ctx.restore();
      var px = cx + rw * Math.cos(th), py = hub - a * R * Math.sin(th);
      ctx.save(); ctx.fillStyle = P.red; ctx.strokeStyle = "#7e1f12"; ctx.lineWidth = 1.2; ctx.fillRect(px - 7, py + 1, 14, 11); ctx.strokeRect(px - 7, py + 1, 14, 11); ctx.restore(); D.dot(c, px, py, 5, P.red);
      D.dot(c, cx, hub, 4.5, P.ink);
      if (rw > 20){ ctx.save(); ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, hub, 16, 0, -(((th % (2 * PI)) + 2 * PI) % (2 * PI)) * (a < 0 ? -1 : 1), a >= 0); ctx.stroke(); ctx.restore(); }
      D.text(c, stack ? "roue : rayon A, axe à la hauteur D" : "rayon A", cx, Math.min(hub + rw + 14, stack ? H * 0.4 - 8 : H - 10), {size: 10.5, color: P.acc});
      /* --- le graphe --- */
      var tp = Math.min(tt, 4 * PI), yv = d + a * Math.sin(B * (tp - ph));
      ctx.save(); ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(gx0, Y(0)); ctx.lineTo(gx1, Y(0)); ctx.moveTo(gx0, Y(-3.2)); ctx.lineTo(gx0, Y(3.2)); ctx.stroke();
      ctx.font = "600 10.5px Mulish, system-ui"; ctx.fillStyle = "#7b8694"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ["π", "2π", "3π", "4π"].forEach(function(m, j){ var xx = X((j + 1) * PI); ctx.fillText(m, xx, Y(0) + 5); ctx.strokeStyle = "#eef1f5"; ctx.beginPath(); ctx.moveTo(xx, Y(3.2)); ctx.lineTo(xx, Y(-3.2)); ctx.stroke(); });
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; [-3, -2, -1, 1, 2, 3].forEach(function(v){ ctx.fillText(v, gx0 - 5, Y(v)); });
      ctx.textAlign = "left"; ctx.fillStyle = "#2c3a4e"; ctx.font = "700 11px Mulish, system-ui"; ctx.fillText("y", gx0 + 6, Y(3.1)); ctx.textAlign = "right"; ctx.fillText("t", gx1, Y(0) - 10);
      ctx.strokeStyle = "rgba(36,119,90,.6)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(gx0, Y(d)); ctx.lineTo(gx1, Y(d)); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      var ok = false;
      if (gd.value && ti >= 0){ var q = TG[ti], ft = function(t){ return q[3] + q[0] * Math.sin(q[1] * (t - q[2])); }, worst = 0;
        ctx.save(); ctx.strokeStyle = P.orange; ctx.lineWidth = 7; ctx.globalAlpha = 0.35; ctx.beginPath(); for (i = 0; i <= 300; i++){ var t5 = 4 * PI * i / 300; i ? ctx.lineTo(X(t5), Y(ft(t5))) : ctx.moveTo(X(t5), Y(ft(t5))); } ctx.stroke(); ctx.restore();
        for (i = 0; i <= 200; i++){ var t6 = 4 * PI * i / 200; worst = Math.max(worst, Math.abs(ft(t6) - (d + a * Math.sin(B * (t6 - ph))))); } ok = worst < 0.16; }
      ctx.save(); ctx.strokeStyle = ok ? P.green : P.red; ctx.lineWidth = 3; ctx.beginPath(); for (i = 0; i <= 400; i++){ var t = 4 * PI * i / 400, yy = Y(d + a * Math.sin(B * (t - ph))); i ? ctx.lineTo(X(t), yy) : ctx.moveTo(X(t), yy); } ctx.stroke(); ctx.restore();
      if (!stack) D.line(c, px, py, X(tp), Y(yv), "rgba(192,50,29,.45)", 1.3, [4, 4]); else { D.line(c, px, py, gx0 - 2, py, "rgba(192,50,29,.35)", 1.2, [4, 4]); }
      D.dot(c, X(tp), Y(yv), 6, P.red);
      var T = 2 * PI / B, x0 = ph; while (x0 - T >= 0) x0 -= T; while (x0 < 0) x0 += T;
      if (x0 + T <= 4 * PI){ var yb = Y(d - Math.abs(a)) + 14; D.line(c, X(x0), yb, X(x0 + T), yb, P.green, 2.2); D.line(c, X(x0), yb - 5, X(x0), yb + 5, P.green, 2); D.line(c, X(x0 + T), yb - 5, X(x0 + T), yb + 5, P.green, 2); D.label(c, "période " + F(T, 2), X(x0 + T / 2), yb + 13, {color: P.green, size: 10.5}); }
      var cr = crest(), md = mid(); hnd(c, G.X(cr[0]), G.Y(cr[1]), P.orange, "crête"); hnd(c, G.X(md[0]), G.Y(md[1]), P.green, "ligne médiane");
      ro.set(0, F(T, 2)); ro.set(1, F(B / (2 * PI), 3)); ro.set(2, F(yv, 2)); ro.set(3, F(2 * Math.abs(a), 2));
      if (gd.value && ti >= 0){ var tq = TG[ti]; if (ok){ if (!c._won){ c._won = true; wins++; } nt.set("Bravo (" + wins + " / " + TG.length + ") : A = " + F(tq[0], 1) + ", B = " + F(tq[1], 2) + ", C = " + F(tq[2], 1) + ", D = " + F(tq[3], 1) + ". Clique « Cible suivante ».", "ok"); }
        else { c._won = false; nt.set("Lis la cible : ligne médiane (D), demi-hauteur crête-creux (A), longueur d'une période (2π/B), puis glisse la crête pour caler le décalage C.", "warn"); } }
      else nt.set("Glisse la crête orange (règle A et C) ou le point vert (règle C et D). Observe que C décale la courbe vers la droite quand il augmente.", "");
    });
    lp.play();
  }
});

/* 5 ---- trigonométriques réciproques ---- */
var C5 = {
  arcsin: {n: "arcsin", f: Math.sin, g: Math.asin, ra: -PI / 2, rb: PI / 2, vmin: -1, vmax: 1, dom: "[−1 ; 1]", img: "[−π/2 ; π/2]"},
  arccos: {n: "arccos", f: Math.cos, g: Math.acos, ra: 0, rb: PI, vmin: -1, vmax: 1, dom: "[−1 ; 1]", img: "[0 ; π]"},
  arctan: {n: "arctan", f: Math.tan, g: Math.atan, ra: -PI / 2, rb: PI / 2, vmin: -6, vmax: 6, dom: "ℝ", img: "]−π/2 ; π/2["}
};
SFA.sim({
  id: "um-c01-cyclometriques", ch: "c01", tag: "arcsin, arccos, arctan",
  titre: "arcsin, arccos, arctan : choisir une seule solution parmi une infinité",
  resume: "Sur le cercle trigonométrique, la droite y = v coupe le cercle en deux points ; sur le graphe, en une infinité. arcsin ne retient que la solution principale : à toi de retrouver toutes les autres.",
  but: "Glisse la droite rouge sur le cercle (ou le curseur v). Le cercle montre les deux angles, le graphe toutes les solutions ; la principale est en rouge, dans la zone autorisée (bande colorée). « Parcourir » fait tourner un point qui s'allume à chaque solution. Défi : clique sur le graphe toutes les solutions de [−2π ; 2π].",
  aRetenir: "arcsin : [−1 ; 1] → [−π/2 ; π/2] ; arccos : [−1 ; 1] → [0 ; π] ; arctan : ℝ → ]−π/2 ; π/2[. Les autres solutions de sin x = v sont x₀ + 2kπ et π − x₀ + 2kπ ; de cos x = v : ±x₀ + 2kπ ; de tan x = v : x₀ + kπ.",
  piege: "arcsin(sin x) = x seulement si x ∈ [−π/2 ; π/2] ; par exemple arcsin(sin(2π/3)) = π/3 et non 2π/3.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.5}); lay2(c, 0.5, 1.4);
    var tp = k.seg("Fonction", [["arcsin", "arcsin"], ["arccos", "arccos"], ["arctan", "arctan"]], "arcsin", function(v){ var T = C5[v]; vs.el.min = T.vmin; vs.el.max = T.vmax; vs.el.step = v === "arctan" ? 0.05 : 0.01; vs.set(cl(vs.value, T.vmin, T.vmax)); if (game.on) newGame(); });
    var vs = k.slider("Valeur v", -1, 1, 0.01, 0.5, "");
    var sw = {on: false, th: -2 * PI, hit: []}, lp = k.loop(function(dt){ sw.th += dt * 1.6; if (sw.th > 2 * PI){ sw.th = 2 * PI; sw.on = false; lp.pause(); } k.redraw(); });
    k.button("▶ Parcourir de −2π à 2π", function(){ sw.th = -2 * PI; sw.on = true; sw.hit = []; lp.play(); }, true);
    var NICE = {arcsin: [[0.5, "1/2"], [Math.SQRT1_2, "√2/2"], [Math.sqrt(3) / 2, "√3/2"], [-0.5, "−1/2"], [-Math.sqrt(3) / 2, "−√3/2"]],
                arccos: [[0.5, "1/2"], [-0.5, "−1/2"], [Math.SQRT1_2, "√2/2"], [-Math.SQRT1_2, "−√2/2"]],
                arctan: [[1, "1"], [Math.sqrt(3), "√3"], [-1, "−1"], [1 / Math.sqrt(3), "√3/3"]]};
    var game = {on: false, i: 0, found: [], miss: 0, wins: 0};
    function newGame(){ var L = NICE[tp.value]; game.on = true; game.i = (game.i + 1) % L.length; game.found = []; game.miss = 0; vs.set(L[game.i][0]); }
    k.button("Défi : trouver toutes les solutions", function(){ newGame(); });
    var ro = k.readouts(["Solution principale", "En degrés", "Autres solutions", "Domaine → image"]), nt = k.note("", "");
    function sols(){ var key = tp.value, x0 = C5[key].g(vs.value), out = []; for (var m = -3; m <= 3; m++){ if (key === "arcsin"){ out.push(x0 + 2 * m * PI, PI - x0 + 2 * m * PI); } else if (key === "arccos"){ out.push(x0 + 2 * m * PI, -x0 + 2 * m * PI); } else out.push(x0 + m * PI); } var u = []; out.forEach(function(s){ if (s > -2 * PI - 1e-9 && s < 2 * PI + 1e-9 && !u.some(function(q){ return Math.abs(q - s) < 1e-6; })) u.push(s); }); return u.sort(function(a, b){ return a - b; }); }
    function pif(x){ var r = Math.round(x / PI * 12); if (Math.abs(r * PI / 12 - x) > 1e-6) return F(x, 3); if (r === 0) return "0"; var g = function(a, b){ return b ? g(b, a % b) : a; }, d = g(Math.abs(r), 12), nu = r / d, de = 12 / d; return (nu < 0 ? "−" : "") + (Math.abs(nu) === 1 ? "" : Math.abs(nu)) + "π" + (de === 1 ? "" : "/" + de); }
    var Cc = null, G = null, drag = false; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!Cc) return; var key = tp.value, T = C5[key];
      if (t === "down"){ drag = false; if (p.x >= Cc.bx && p.x <= Cc.bx + Cc.bw && p.y >= Cc.by && p.y <= Cc.by + Cc.bh) drag = true;
        else if (game.on && G && p.x > G.L && p.x < G.R){ var x = G.ix(p.x), best = null, bd = 1e9; sols().forEach(function(s){ var d = Math.abs(G.X(s) - p.x); if (d < bd){ bd = d; best = s; } }); if (bd < 16 && !game.found.some(function(q){ return Math.abs(q - best) < 1e-6; })) game.found.push(best); else if (bd >= 16) game.miss++; k.redraw(); return; } }
      if ((t === "down" || t === "drag") && drag){ var u = (p.x - Cc.cx) / Cc.r, w = (Cc.cy - p.y) / Cc.r, v = key === "arcsin" ? w : key === "arccos" ? u : w / 1; if (key === "arctan") v = (Cc.cy - p.y) / Cc.r; vs.set(Math.round(cl(v, T.vmin, T.vmax) * 100) / 100); if (game.on){ game.on = false; } k.redraw(); }
      if (t === "up") drag = false;
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, key = tp.value, T = C5[key], V = vs.value, x0 = T.g(V), bx = split2(c, 0.4, 0.44), sl = sols();
      /* --- le cercle trigonométrique --- */
      var q = bx[0], tan = key === "arctan", r = Math.min(q.w * (tan ? 0.3 : 0.38), q.h * (tan ? 0.3 : 0.4)), cx = q.x + q.w * (tan ? 0.42 : 0.5), cy = q.y + q.h / 2;
      Cc = {cx: cx, cy: cy, r: r, bx: q.x, by: q.y, bw: q.w, bh: q.h};
      var a0 = T.ra, a1 = T.rb;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r * 1.12, -a1, -a0); ctx.closePath(); ctx.fillStyle = "rgba(192,50,29,.07)"; ctx.fill(); ctx.restore();
      D.line(c, cx - r * 1.3, cy, cx + r * 1.3, cy, "#a3adba", 1.2); D.line(c, cx, cy - r * 1.3, cx, cy + r * 1.3, "#a3adba", 1.2);
      ctx.save(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.strokeStyle = P.red; ctx.lineWidth = 4; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(cx, cy, r, -a1, -a0); ctx.stroke(); ctx.restore();
      D.label(c, "zone de " + key + " : " + T.img, q.x + 10, q.y + 14, {size: 10.5, color: P.red, align: "left"});
      var two = key === "arcsin" ? [x0, PI - x0] : key === "arccos" ? [x0, -x0] : [x0, x0 + PI];
      if (key === "arcsin") D.line(c, cx - r * 1.25, cy - V * r, cx + r * 1.25, cy - V * r, P.red, 2.4);
      else if (key === "arccos") D.line(c, cx + V * r, cy - r * 1.25, cx + V * r, cy + r * 1.25, P.red, 2.4);
      else { D.line(c, cx + r, cy - r * 2.4, cx + r, cy + r * 2.4, "#9aa5b4", 1.4); D.line(c, cx - r * 1.2 * Math.cos(x0) * 1.6, cy + r * 1.2 * Math.sin(x0) * 1.6, cx + r, cy - V * r, "rgba(192,50,29,.6)", 1.6, [4, 3]); hnd(c, cx + r, cy - V * r, P.red, "tan = v"); D.text(c, "axe des tangentes", cx + r + 6, cy + r * 2.2, {size: 10, color: P.grey, align: "left"}); }
      two.forEach(function(a, j){ var X = cx + r * Math.cos(a), Y = cy - r * Math.sin(a); D.line(c, cx, cy, X, Y, j ? "#9aa5b4" : P.red, j ? 1.6 : 2.6); D.dot(c, X, Y, j ? 5 : 6.5, j ? "#8a95a3" : P.red); });
      ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy, r * 0.28, 0, -x0, x0 > 0); ctx.stroke(); ctx.restore();
      if (key !== "arctan") hnd(c, key === "arcsin" ? cx + r * 1.15 : cx + V * r, key === "arcsin" ? cy - V * r : cy - r * 1.15, P.red, "glisse");
      if (sw.on || sw.th > -2 * PI){ var th = sw.th; D.dot(c, cx + r * Math.cos(th), cy - r * Math.sin(th), 5, P.violet); }
      /* --- le graphe --- */
      var g = bx[1], yr = tan ? 4 : 1.5, xt = [], yt = [];
      [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2].forEach(function(m){ xt.push([m * PI, {"-2": "−2π", "-1": "−π", "1": "π", "2": "2π", "-0.5": "−π/2", "0.5": "π/2", "-1.5": "", "1.5": ""}[String(m)]]); });
      (tan ? [-4, -3, -2, -1, 1, 2, 3, 4] : [-1.5, -1, -0.5, 0.5, 1, 1.5]).forEach(function(v){ yt.push([v, F(v, 1)]); });
      var ax = axBox(c, g, {x0: -2 * PI, x1: 2 * PI, y0: -yr, y1: yr, xt: xt, yt: yt, l: 30, t: 14, b: 12, xl: "x", yl: "y"});
      G = {L: ax.L, R: ax.R, X: ax.X, ix: ax.ix};
      ctx.save(); ctx.fillStyle = "rgba(192,50,29,.07)"; ctx.fillRect(ax.X(a0), ax.T, ax.X(a1) - ax.X(a0), ax.B - ax.T); ctx.restore();
      D.fn(c, ax, T.f, "#8fa0b8", 2.2); curve(c, ax, function(t){ return t; }, T.f, a0 + 0.001, a1 - 0.001, P.acc, 3.4);
      hl(c, ax, V, P.red, [6, 4], 1.8);
      var reveal = !game.on || game.found.length === sl.length;
      sl.forEach(function(s){ var f = game.found.some(function(qq){ return Math.abs(qq - s) < 1e-6; }), prin = Math.abs(s - x0) < 1e-9; if (reveal || f) pt(c, ax, s, V, prin ? P.red : f ? P.green : "#8a95a3", prin ? 6.5 : 5); if (game.on && f) D.text(c, pif(s), ax.X(s), ax.Y(V) - 14, {size: 10, color: P.green, halo: true}); });
      if (sw.on || sw.th > -2 * PI){ var th2 = sw.th, yv = T.f(th2); if (isFinite(yv) && Math.abs(yv) < yr){ D.dot(c, ax.X(th2), ax.Y(yv), 5, P.violet); } vl(c, ax, th2, "rgba(98,54,196,.4)", [3, 3], 1.2); sl.forEach(function(s){ if (s <= th2 + 1e-9 && !sw.hit.some(function(qq){ return Math.abs(qq - s) < 1e-6; })) sw.hit.push(s); }); sw.hit.forEach(function(s){ D.glow(c, ax.X(s), ax.Y(V), 16, P.violet, 0.45); }); }
      D.label(c, "y = " + (key === "arcsin" ? "sin" : key === "arccos" ? "cos" : "tan") + " x", ax.R - 6, ax.T + 10, {color: P.acc, align: "right", math: true, size: 12});
      var oth = key === "arcsin" ? "π − x₀ + 2kπ = " + F(PI - x0, 3) + " + 2kπ" : key === "arccos" ? "−x₀ + 2kπ = " + F(-x0, 3) + " + 2kπ" : "x₀ + kπ";
      ro.set(0, "x₀ = " + pif(x0)); ro.set(1, F(x0 * 180 / PI, 2) + " °"); ro.set(2, oth); ro.set(3, T.dom + " → " + T.img);
      if (game.on){ var L = NICE[key][game.i], all = game.found.length === sl.length;
        if (all){ if (!game.done){ game.done = true; game.wins++; } nt.set("Bravo : les " + sl.length + " solutions de " + (key === "arcsin" ? "sin" : key === "arccos" ? "cos" : "tan") + " x = " + L[1] + " dans [−2π ; 2π] sont " + sl.map(pif).join(" ; ") + " (" + game.miss + " clic" + (game.miss > 1 ? "s" : "") + " à côté). Relance le défi pour une autre valeur.", "ok"); }
        else { game.done = false; nt.set("Défi : " + (key === "arcsin" ? "sin" : key === "arccos" ? "cos" : "tan") + " x = " + L[1] + ". La calculatrice donne x₀ = " + key + "(" + L[1] + ") = " + pif(x0) + ". Clique sur l'axe du graphe à l'abscisse de chaque solution de [−2π ; 2π] : " + game.found.length + " / " + sl.length + " trouvée(s), " + game.miss + " clic(s) à côté.", "warn"); } }
      else nt.set("La calculatrice renvoie toujours la valeur principale (rouge) ; les autres solutions s'en déduisent par symétrie sur le cercle et périodicité.", "");
    });
  }
});
})();
