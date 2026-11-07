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
  but: "Choisis une fonction, fixe ε (bande horizontale), puis règle δ (bande verticale). Les points de la courbe qui sortent de la bande horizontale sont en rouge. Trouve le plus grand δ qui marche.",
  aRetenir: "lim<sub>x→a</sub> f(x) = L signifie : ∀ε > 0, ∃δ > 0, 0 < |x − a| < δ ⇒ |f(x) − L| < ε. On exclut x = a : la valeur f(a) n'intervient pas. Plus ε diminue, plus δ doit diminuer.",
  piege: "La limite ne dépend pas de f(a) (qui peut ne pas exister). Un δ qui marche pour un ε ne marche pas forcément pour un ε plus petit.",
  build: function(k, S){
    var c = k.canvas(380), fs = k.select("Fonction", [["trou", "(x² − 1)/(x − 1) en 1"], ["sinc", "sin x / x en 0"], ["lin", "3x − 2 en 2"], ["osc", "x·sin(1/x) en 0"]], "trou");
    var eps = k.slider("ε (tolérance sur y)", 0.05, 1.5, 0.05, 0.5, ""), dl = k.slider("δ (largeur sur x)", 0.01, 1.5, 0.01, 0.2, "");
    k.button("Placer δ au maximum", function(){ dl.set(Math.min(1.5, Math.max(0.01, Math.floor(dmax1(E1[fs.value], eps.value) * 100) / 100))); });
    var ro = k.readouts(["a", "L", "δ maximal ≈", "Verdict"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = E1[fs.value], a = T.a, L = T.L, e = eps.value, d = dl.value;
      var ax = D.axes(c, {x0: a - 2, x1: a + 2, y0: L - 2.5, y1: L + 2.5, stepX: 0.5, stepY: 0.5, xl: "x", yl: "y"});
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
  but: "Choisis une fonction, puis diminue la distance |x − a| = 10^(−e) avec le curseur. Compare les valeurs de f à gauche et à droite, et avec f(a).",
  aRetenir: "f est continue en a si f(a) existe et lim<sub>x→a</sub> f(x) = f(a). La limite existe si et seulement si les limites à gauche et à droite existent et sont égales. Discontinuités : éliminable (limite finie ≠ f(a)), saut (limites latérales différentes), infinie, oscillation.",
  piege: "« f(a) existe » ne suffit pas, et « la limite existe » non plus : il faut les deux et leur égalité.",
  build: function(k, S){
    var c = k.canvas(340), fs = k.select("Fonction", [["cont", "x² en 1 (continue)"], ["trou", "(x² − 4)/(x − 2) en 2"], ["saut", "|x|/x en 0"], ["inf", "1/(x − 1) en 1"], ["inf2", "1/x² en 0"], ["osc", "sin(1/x) en 0"]], "trou");
    var e = k.slider("Distance |x − a| = 10^(−e), e =", 0, 4, 0.05, 0.5, ""); var ro = k.readouts(["f(a − h)", "f(a + h)", "h = |x − a|", "f(a)"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = A2[fs.value], a = T.a, h = Math.pow(10, -e.value);
      var ymid = fs.value === "cont" ? 1.5 : fs.value === "trou" ? 3 : 0, span = fs.value === "trou" ? 4 : fs.value === "cont" ? 3 : 4;
      var ax = D.axes(c, {x0: a - 2, x1: a + 2, y0: ymid - span, y1: ymid + span, stepX: 0.5, stepY: fs.value === "trou" ? 1 : 1, xl: "x", yl: "y"});
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
  but: "Choisis la puissance n et la fenêtre. Les trois courbes sont tracées en log₁₀ : eˣ est une droite, xⁿ et ln x sont des courbes qui s'aplatissent. Repère le dernier croisement.",
  aRetenir: "Pour tout n : lim<sub>x→+∞</sub> eˣ/xⁿ = +∞ et lim<sub>x→+∞</sub> (ln x)/xᵖ = 0 (p > 0). Ordre de croissance à l'infini : ln x ≪ xᵖ ≪ eˣ. Ces limites lèvent les formes indéterminées ∞/∞ et 0·∞.",
  piege: "Pour n grand, xⁿ domine eˣ sur une très longue plage (x ≤ 20 pour n = 10…) : la limite en +∞ ne dit rien sur les valeurs « raisonnables ».",
  build: function(k, S){
    var c = k.canvas(380), n = k.slider("Puissance n", 1, 20, 1, 5, ""), xm = k.slider("Fenêtre : x de 0 à", 10, 120, 5, 60, "");
    var xs = k.slider("Point x lu", 1, 120, 1, 30, ""); var ro = k.readouts(["Dernier croisement eˣ = xⁿ", "eˣ", "xⁿ", "Rapport eˣ / xⁿ"]), nt = k.note("", "");
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
  resume: "f(x) = (ax² + bx + c)/(x − s) : le curseur de zoom éloigne la fenêtre et la courbe se colle à son asymptote oblique.",
  but: "Fais varier a, b, c et s. Observe l'asymptote verticale x = s, l'asymptote oblique (ou horizontale si a = 0) et l'écart f(x) − (mx + p) à l'endroit choisi.",
  aRetenir: "Division euclidienne : (ax² + bx + c)/(x − s) = ax + (b + as) + R/(x − s), avec R = as² + bs + c. Asymptote oblique y = ax + (b + as) ; verticale x = s si R ≠ 0 (si R = 0 la fraction se simplifie : « trou »). Écart → 0 quand x → ±∞.",
  piege: "Une courbe peut couper son asymptote horizontale ou oblique ; ce qui compte est la limite de l'écart en ±∞. Et x = s n'est asymptote que si le numérateur ne s'annule pas en s.",
  build: function(k, S){
    var c = k.canvas(400), a = k.slider("a", -2, 2, 0.5, 1, ""), b = k.slider("b", -4, 4, 0.5, 0, ""), cc = k.slider("c", -6, 6, 0.5, -2, ""), s = k.slider("s (pôle)", -3, 3, 0.5, 1, ""), z = k.slider("Fenêtre (zoom arrière)", 5, 60, 1, 8, ""), x0 = k.slider("Point x où lire l'écart", 2, 60, 1, 6, "");
    var ro = k.readouts(["Verticale", "Asymptote oblique / horizontale", "f(x) − asymptote", "Écart relatif"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var A = a.value, B = b.value, C = cc.value, Sv = s.value, Z = z.value, R = A * Sv * Sv + B * Sv + C, m = A, p = B + A * Sv, ob = A !== 0;
      var f = function(x){ return (A * x * x + B * x + C) / (x - Sv); }, asy = function(x){ return A === 0 ? B : m * x + p; };
      var ym = Math.abs(asy(0)) + Z * Math.max(0.6, Math.abs(m)), ax = D.axes(c, {x0: -Z, x1: Z, y0: -ym * 0.8, y1: ym * 0.8, stepX: Z > 20 ? 10 : Z > 10 ? 5 : Z > 6 ? 2 : 1, xl: "x", yl: "y"});
      if (Math.abs(R) > 1e-9) vl(c, ax, Sv, P.amber, [6, 4], 1.8); D.fn(c, ax, asy, P.green, 1.8, [7, 4]); D.fn(c, ax, f, P.acc, 3);
      var xx = Math.min(x0.value, Z - 0.01); if (Math.abs(xx - Sv) < 0.3) xx = Sv + 0.5; var fx = f(xx), ax2 = asy(xx);
      D.line(c, ax.X(xx), ax.Y(fx), ax.X(xx), ax.Y(ax2), P.red, 3); D.dot(c, ax.X(xx), ax.Y(fx), 4.5, P.acc); D.dot(c, ax.X(xx), ax.Y(ax2), 4.5, P.green);
      ro.set(0, Math.abs(R) > 1e-9 ? "x = " + F(Sv, 1) : "aucune (trou en " + F(Sv, 1) + ")");
      ro.set(1, A === 0 ? "horizontale y = " + F(B, 1) : "y = " + F(m, 1) + "x " + (p < 0 ? "− " + F(-p, 1) : "+ " + F(p, 1)));
      ro.set(2, F(fx - ax2, 4)); ro.set(3, F(Math.abs((fx - ax2) / fx) * 100, 2) + " %");
      nt.set(Math.abs(R) <= 1e-9 ? "Le numérateur s'annule en x = s : la fraction se simplifie, il n'y a pas d'asymptote verticale mais un trou." : "L'écart R/(x − s) = " + F(R, 2) + "/(x − s) tend vers 0 : la courbe s'approche de l'asymptote.", Math.abs(R) <= 1e-9 ? "warn" : "ok");
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
  resume: "f(a) et f(b) de signes opposés : le segment [a ; b] contient une racine si f est continue. Coupe-le en deux, encore et encore.",
  but: "Clique sur « Une étape » : le milieu m est calculé et on garde la moitié où le signe change. L'intervalle est divisé par 2 à chaque fois. Essaie ensuite 1/x, qui change de signe sans s'annuler.",
  aRetenir: "TVI : si f est continue sur [a ; b] et si f(a)·f(b) < 0, alors f s'annule au moins une fois sur ]a ; b[. Dichotomie : après n étapes, la racine est dans un intervalle de longueur (b − a)/2ⁿ.",
  piege: "L'hypothèse de continuité est indispensable : 1/x change de signe entre −1 et 2 mais ne s'annule jamais.",
  build: function(k, S){
    var c = k.canvas(380), st = {a: 0, b: 1, hist: []}, fs;
    function reset(){ var T = V5[fs.value]; st.a = T.a; st.b = T.b; st.hist = []; }
    fs = k.select("Fonction", [["cosx", "cos x − x"], ["cub", "x³ − 2x − 5"], ["expo", "eˣ + x − 3"], ["inv", "1/x (non continue)"]], "cosx", reset); reset();
    k.button("Une étape", function(){ step(); }, true); k.button("10 étapes", function(){ for (var i = 0; i < 10; i++) step(); }); k.button("Recommencer", reset);
    function step(){ var T = V5[fs.value], m = (st.a + st.b) / 2, fm = T.f(m), fa = T.f(st.a); if (fa * fm <= 0) st.b = m; else st.a = m; st.hist.push(m); if (st.hist.length > 40) st.hist.shift(); }
    var ro = k.readouts(["Intervalle [a ; b]", "Largeur", "f(a) · f(b)", "Étapes"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = V5[fs.value], ax = D.axes(c, {x0: T.x0, x1: T.x1, y0: T.y0, y1: T.y1, xl: "x", yl: "y"}), ctx = c.ctx;
      var A0 = T.a, B0 = T.b; ctx.fillStyle = "rgba(30,63,143,.07)"; ctx.fillRect(ax.X(A0), ax.T, ax.X(B0) - ax.X(A0), ax.B - ax.T);
      D.fn(c, ax, T.f, P.acc, 3); ctx.fillStyle = "rgba(180,83,9,.2)"; ctx.fillRect(ax.X(st.a), ax.T, Math.max(2, ax.X(st.b) - ax.X(st.a)), ax.B - ax.T);
      var fa = T.f(st.a), fb = T.f(st.b); pt(c, ax, st.a, fa, P.red, 5); pt(c, ax, st.b, fb, P.green, 5); vl(c, ax, st.a, P.amber, [4, 3], 1.4); vl(c, ax, st.b, P.amber, [4, 3], 1.4);
      st.hist.forEach(function(m, i){ if (i > st.hist.length - 8) D.dot(c, ax.X(m), ax.Y(0), 3, "#8a95a3"); });
      ro.set(0, "[" + F(st.a, 6) + " ; " + F(st.b, 6) + "]"); ro.set(1, S.sci(st.b - st.a)); ro.set(2, F(fa * fb, 3) + (fa * fb <= 0 ? " ≤ 0" : " > 0")); ro.set(3, String(st.hist.length));
      var w = st.b - st.a;
      if (!T.cont) nt.set(w < 0.01 ? "L'intervalle se resserre autour de 0, mais f(0) n'existe pas : f est très grande là-bas, ce n'est pas une racine. Pas de continuité, pas de TVI." : "Attention : f(−1) < 0 et f(2) > 0, mais f n'est pas continue en 0. Fais quelques étapes.", "warn");
      else nt.set(w < 1e-4 ? "Racine encadrée : x ≈ " + F((st.a + st.b) / 2, 5) + " à moins de " + S.sci(w) + "." : "f(a) et f(b) ont des signes opposés et f est continue : une racine est piégée dans la zone orange.", w < 1e-4 ? "ok" : "");
    });
  }
});
})();
