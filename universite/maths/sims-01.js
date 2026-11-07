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
  resume: "Ajuste la base b : en haut bˣ et sa réciproque log_b ; en bas, des mesures de croissance bactérienne que l'échelle log redresse en droite.",
  but: "Fais varier la base b et le départ N₀. Dans le graphe du bas, l'axe vertical est gradué en puissances de 10 : une exponentielle y devient une droite dont la pente est log₁₀ b. Cherche b et N₀ qui passent par les points.",
  aRetenir: "bˣ = e<sup>x ln b</sup>. log<sub>b</sub> x = ln x / ln b est la réciproque de bˣ. ln(xy) = ln x + ln y ; ln(xʸ) = y ln x. Une croissance exponentielle N = N₀bᵗ devient une droite sur échelle log : pente = log b. Temps de doublement = ln 2 / ln b.",
  piege: "ln(x + y) ≠ ln x + ln y. Et sur une échelle logarithmique, des écarts égaux représentent des rapports égaux (×10), pas des différences égales.",
  build: function(k, S){
    var c1 = k.canvas(250), c2 = k.canvas(250);
    var b = k.slider("Base b", 0.2, 3, 0.05, 1.5, ""), n0 = k.slider("Effectif de départ N₀", 100, 1000, 10, 500, "");
    var ro = k.readouts(["ln b", "Pente log₁₀ b", "Doublement (ln 2 / ln b)", "Erreur moyenne sur les mesures"]), nt = k.note("", "");
    k.draw(function(){
      c1.clear(); c2.clear(); var B = b.value, ax = D.axes(c1, {x0: -4, x1: 4, y0: -3, y1: 5, equal: true, stepX: 1, stepY: 1, xl: "x", yl: "y"});
      D.line(c1, ax.X(-8), ax.Y(-8), ax.X(8), ax.Y(8), "#aab2bd", 1.4, [6, 4]);
      D.fn(c1, ax, function(x){ return Math.pow(B, x); }, P.acc, 3); D.fn(c1, ax, function(x){ return Math.log(x) / Math.log(B); }, P.red, 3);
      lab(c1, "y = " + F(B, 2) + "ˣ", ax.R - 10, ax.T + 14, P.acc, 13, "right"); lab(c1, "y = log" + F(B, 2) + " x", ax.R - 10, ax.T + 32, P.red, 13, "right");
      pt(c1, ax, 0, 1, P.acc, 4); pt(c1, ax, 1, 0, P.red, 4);
      var L = 50, R = c2.W - 16, T = 14, Bt = c2.H - 34, ctx = c2.ctx; ctx.save(); ctx.font = "600 11px Mulish, system-ui"; ctx.fillStyle = "#5f6b7a";
      function X(t){ return L + t / 8.4 * (R - L); } function Y(v){ return Bt - (Math.log10(v) - 1.7) / (4.5 - 1.7) * (Bt - T); }
      for (var e = 2; e <= 4; e++){ [1, 2, 5].forEach(function(m){ var v = m * Math.pow(10, e); if (v > 40000) return; ctx.strokeStyle = m === 1 ? "#cfd6df" : "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); if (m === 1){ ctx.textAlign = "right"; ctx.fillText("10" + ["", "", "²", "³", "⁴"][e], L - 6, Y(v) + 4); } }); }
      for (var t = 0; t <= 8; t++){ ctx.textAlign = "center"; ctx.fillText(t, X(t), Bt + 16); ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(X(t), T); ctx.lineTo(X(t), Bt); ctx.stroke(); }
      ctx.fillText("temps (h) — axe vertical logarithmique", (L + R) / 2, Bt + 30);
      ctx.beginPath(); ctx.rect(L, T, R - L, Bt - T); ctx.clip(); ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath();
      for (var i = 0; i <= 100; i++){ var tt = 8.4 * i / 100, v = n0.value * Math.pow(B, tt); i ? ctx.lineTo(X(tt), Y(v)) : ctx.moveTo(X(tt), Y(v)); } ctx.stroke();
      var err = 0; DATA3.forEach(function(d){ D.dot(c2, X(d[0]), Y(d[1]), 5.5, P.red); err += Math.abs(Math.log(n0.value * Math.pow(B, d[0])) - Math.log(d[1])); }); ctx.restore();
      err /= DATA3.length; ro.set(0, F(Math.log(B), 3)); ro.set(1, F(Math.log10(B), 3)); ro.set(2, B > 1 ? F(Math.log(2) / Math.log(B), 2) + " h" : "— (décroissance)"); ro.set(3, F((Math.exp(err) - 1) * 100, 1) + " %");
      nt.set(Math.abs(B - 1) < 1e-9 ? "b = 1 : la fonction est constante, le logarithme de base 1 n'existe pas." : (err < 0.04 ? "Très bon ajustement : les points sont presque alignés sur la droite." : "Les points rouges sont des mesures. Ajuste la pente (b) puis le départ (N₀) pour les rejoindre."), Math.abs(B - 1) < 1e-9 ? "warn" : (err < 0.04 ? "ok" : ""));
    });
  }
});

/* 4 ---- trigonométrie ---- */
SFA.sim({
  id: "um-c01-trigo", ch: "c01", tag: "Fonctions trigonométriques",
  titre: "Du cercle à la sinusoïde : amplitude, période, phase",
  resume: "Un point tourne sur un cercle ; sa hauteur trace y = D + A·sin(B(t − C)). Modifie A, B, C, D et lis chaque paramètre sur le graphe.",
  but: "Lance l'animation puis fais varier les paramètres : l'amplitude A est le rayon, B la vitesse angulaire (période 2π/B), C le décalage dans le temps, D la ligne médiane.",
  aRetenir: "y = D + A sin(B(t − C)) : amplitude |A|, période 2π/|B|, fréquence |B|/2π, déphasage C, valeur moyenne D. Applications : rythme circadien, pression artérielle, courant alternatif, oscillations de population.",
  piege: "Dans sin(Bt − φ), le décalage dans le temps est φ/B, pas φ. Et sin(2t) a une période π, pas 4π.",
  build: function(k, S){
    var c = k.canvas(340), A = k.slider("Amplitude A", 0.5, 2, 0.1, 1.5, ""), Bv = k.slider("Pulsation B", 0.5, 4, 0.25, 1, "rad/unité"), C = k.slider("Décalage C", -2, 2, 0.1, 0, ""), Dv = k.slider("Ligne médiane D", -1, 1, 0.1, 0, "");
    if (c.W < 640){ c.ratio = 1.15; c.resize(); }
    var tt = 0, lp = k.loop(function(dt){ tt += dt * 0.9; if (tt > 4 * PI) tt = 0; k.redraw(); });
    k.button("Lecture / pause", function(){ lp.running ? lp.pause() : lp.play(); }, true); k.button("Revenir à t = 0", function(){ tt = 0; });
    var ro = k.readouts(["Période 2π/B", "Fréquence", "Hauteur y(t)", "Amplitude crête à crête"]);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, a = A.value, B = Bv.value, ph = C.value, d = Dv.value, stack = W < 640;
      var R, cx, cy, gx0, gx1, cyg;
      if (stack){ R = Math.min((H * 0.25 - 8) / 3, W * 0.18); cx = W * 0.5; cy = H * 0.25; gx0 = 30; gx1 = W - 14; cyg = H * 0.75; }
      else { R = (H / 2 - 10) / 3; cx = 2.6 * R + 8; cy = H / 2; gx0 = cx + 3 * R + 12; gx1 = W - 14; cyg = H / 2; }
      ctx.save(); ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - 3 * R, cy); ctx.lineTo(cx + 3 * R, cy); ctx.moveTo(cx, cy - 3 * R); ctx.lineTo(cx, cy + 3 * R); ctx.stroke();
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy - d * R, Math.abs(a) * R, 0, 7); ctx.stroke(); ctx.restore();
      var th = B * (tt - ph), px = cx + Math.abs(a) * R * Math.cos(th), py = cy - d * R - a * R * Math.sin(th);
      var X = function(t){ return gx0 + t / (4 * PI) * (gx1 - gx0); }, Y = function(v){ return cyg - v * R; }, tp = Math.min(tt, 4 * PI), yv = d + a * Math.sin(B * (tp - ph));
      ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(gx0, cyg); ctx.lineTo(gx1, cyg); ctx.moveTo(gx0, cyg - 3 * R); ctx.lineTo(gx0, cyg + 3 * R); ctx.stroke();
      ctx.strokeStyle = "#cfd6df"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(gx0, Y(d)); ctx.lineTo(gx1, Y(d)); ctx.stroke(); ctx.setLineDash([]); ctx.font = "600 11px Mulish, system-ui"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center";
      [["π", 1], ["2π", 2], ["3π", 3], ["4π", 4]].forEach(function(m){ ctx.fillText(m[0], X(m[1] * PI), cyg + 14); ctx.beginPath(); ctx.moveTo(X(m[1] * PI), cyg - 3); ctx.lineTo(X(m[1] * PI), cyg + 3); ctx.stroke(); });
      ctx.beginPath(); ctx.strokeStyle = P.red; ctx.lineWidth = 3; for (var i = 0; i <= 300; i++){ var t = 4 * PI * i / 300; i ? ctx.lineTo(X(t), Y(d + a * Math.sin(B * (t - ph)))) : ctx.moveTo(X(t), Y(d + a * Math.sin(B * (t - ph)))); } ctx.stroke(); ctx.restore();
      if (!stack) D.line(c, px, py, X(tp), Y(yv), "#e0a7a2", 1.4, [4, 4]); else D.line(c, px, py, gx0, Y(yv), "#e0a7a2", 1.4, [4, 4]);
      D.line(c, cx, cy - d * R, px, py, P.acc, 2.4); D.dot(c, px, py, 6, P.acc); D.dot(c, X(tp), Y(yv), 6, P.red); D.line(c, px, py, px, cy, "#9fb0d6", 1.2, [3, 3]);
      var T = 2 * PI / B; ctx.save(); ctx.strokeStyle = P.green; ctx.lineWidth = 2.2; var yb = Y(d + Math.abs(a)) - 12, x0 = X(ph), x1 = X(ph + T); if (x0 < gx0) { x0 = X(ph + T * Math.ceil((0 - ph) / T)); x1 = x0 + (X(T) - X(0)); } if (x1 <= gx1 + 1){ ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke(); lab(c, "T", (x0 + x1) / 2, yb - 9, P.green, 13); } ctx.restore();
      ro.set(0, F(T, 2)); ro.set(1, F(B / (2 * PI), 3)); ro.set(2, F(yv, 2)); ro.set(3, F(2 * Math.abs(a), 2));
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
  resume: "La droite horizontale y = v coupe le sinus une infinité de fois ; arcsin ne retient que la solution principale. Vois les autres solutions.",
  but: "Choisis la fonction et fais varier v. En haut : le graphe de sin, cos ou tan avec toutes les solutions de f(x) = v ; la principale est en rouge. En bas : la fonction réciproque.",
  aRetenir: "arcsin : [−1 ; 1] → [−π/2 ; π/2] ; arccos : [−1 ; 1] → [0 ; π] ; arctan : ℝ → ]−π/2 ; π/2[. Les autres solutions de sin x = v sont x₀ + 2kπ et π − x₀ + 2kπ ; de cos x = v : ±x₀ + 2kπ ; de tan x = v : x₀ + kπ.",
  piege: "arcsin(sin x) = x seulement si x ∈ [−π/2 ; π/2] ; par exemple arcsin(sin(2π/3)) = π/3 et non 2π/3.",
  build: function(k, S){
    var c1 = k.canvas(230), c2 = k.canvas(210), tp = k.seg("Fonction", [["arcsin", "arcsin"], ["arccos", "arccos"], ["arctan", "arctan"]], "arcsin");
    var v = k.slider("Valeur v", -1, 1, 0.01, 0.5, "", null); var ro = k.readouts(["Solution principale (rad)", "En degrés", "Autres solutions", "Domaine → image"]), nt = k.note("", "");
    function setRange(){ var T = C5[tp.value]; v.el.min = T.vmin; v.el.max = T.vmax; v.el.step = tp.value === "arctan" ? 0.05 : 0.01; v.set(Math.max(T.vmin, Math.min(T.vmax, v.value))); }
    tp.el = null; var prev = "arcsin";
    k.draw(function(){
      if (tp.value !== prev){ prev = tp.value; setRange(); }
      c1.clear(); c2.clear(); var T = C5[tp.value], x0 = T.g(v.value), V = v.value;
      var ax1 = D.axes(c1, {x0: -2 * PI, x1: 2 * PI, y0: tp.value === "arctan" ? -6 : -1.6, y1: tp.value === "arctan" ? 6 : 1.6, stepX: PI / 2, stepY: tp.value === "arctan" ? 2 : 0.5, l: 40});
      D.fn(c1, ax1, T.f, "#aab2bd", 2.2); curve(c1, ax1, function(t){ return t; }, T.f, T.ra + 0.001, T.rb - 0.001, P.acc, 3.4);
      hl(c1, ax1, V, P.amber, [5, 4], 1.8);
      var sols = [], key = tp.value;
      for (var m = -3; m <= 3; m++){ if (key === "arcsin"){ sols.push(x0 + 2 * m * PI); sols.push(PI - x0 + 2 * m * PI); } else if (key === "arccos"){ sols.push(x0 + 2 * m * PI); sols.push(-x0 + 2 * m * PI); } else sols.push(x0 + m * PI); }
      sols.forEach(function(s){ if (Math.abs(s - x0) > 1e-9 && s > -2 * PI - 1e-9 && s < 2 * PI + 1e-9) pt(c1, ax1, s, V, "#8a95a3", 4.5); });
      pt(c1, ax1, x0, V, P.red, 6.5);
      lab(c1, "f(x) = v", ax1.R - 6, ax1.Y(V) - 11, P.amber, 12, "right");
      var xr = key === "arctan" ? 6.3 : 1.25, ax2 = D.axes(c2, {x0: -xr, x1: xr, y0: -PI * 0.8, y1: PI * 1.1, stepX: key === "arctan" ? 2 : 0.5, stepY: PI / 2, l: 40});
      D.fn(c2, ax2, T.g, P.red, 3.4); vl(c2, ax2, V, "#e5b3ae"); hl(c2, ax2, x0, "#e5b3ae"); pt(c2, ax2, V, x0, P.red, 6.5); lab(c2, "y = " + T.n + " x", ax2.L + 8, ax2.T + 12, P.red, 13, "left");
      var oth = key === "arcsin" ? "π − x₀ = " + F(PI - x0, 3) + " (+ 2kπ)" : key === "arccos" ? "−x₀ = " + F(-x0, 3) + " (+ 2kπ)" : "x₀ + kπ";
      ro.set(0, F(x0, 4)); ro.set(1, F(x0 * 180 / PI, 2) + " °"); ro.set(2, oth); ro.set(3, T.dom + " → " + T.img);
      nt.set("La calculatrice renvoie toujours la valeur principale ; pour résoudre l'équation il faut ajouter les autres solutions.", "");
    });
  }
});
})();
