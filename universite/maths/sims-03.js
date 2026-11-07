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
  resume: "On coupe des carrés aux coins d'un carton ; ou on dessine une canette de 33 cL. Où V est-il maximal ? où S est-elle minimale ? Là où la dérivée s'annule.",
  but: "Choisis le problème, déplace la variable (x ou r) et regarde la valeur de la grandeur à optimiser. Vérifie que le maximum (minimum) correspond bien à la dérivée nulle.",
  aRetenir: "Méthode : (1) exprimer la grandeur en fonction d'une seule variable ; (2) préciser le domaine ; (3) dériver et résoudre f′ = 0 ; (4) vérifier qu'il s'agit d'un max/min (signe de f′, ou f″) et comparer aux bords ; (5) conclure avec les unités.",
  piege: "Il faut aussi regarder les bords du domaine : un maximum peut être atteint à une extrémité. Ici V = 0 aux deux bords, donc le maximum est intérieur.",
  build: function(k, S){
    var c = k.canvas(390), sc = k.seg("Problème", [["box", "Boîte (carton 30 × 20 cm)"], ["can", "Canette 33 cL"]], "box", function(v){ setr(v); });
    var xv = k.slider("Variable", 0.5, 9.5, 0.01, 2, "cm");
    function setr(v){ if (v === "box"){ xv.el.min = 0.1; xv.el.max = 9.9; xv.set(2); } else { xv.el.min = 1.5; xv.el.max = 7; xv.set(2.5); } }
    var ro = k.readouts(["Variable", "Grandeur", "Optimum", "Grandeur à l'optimum"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, box = sc.value === "box", X = xv.value, split = Math.min(W * 0.42, 230);
      var gA = {x0: 0, x1: 0};
      if (box){
        var V = function(x){ return x * (30 - 2 * x) * (20 - 2 * x); }, xo = (200 - Math.sqrt(40000 - 28800)) / 24, s = (split - 24) / 34, ox = 12, oy = 40;
        ctx.fillStyle = "#eaf0fb"; ctx.fillRect(ox, oy, 30 * s, 20 * s); ctx.strokeStyle = "#8aa0cc"; ctx.lineWidth = 1.6; ctx.strokeRect(ox, oy, 30 * s, 20 * s);
        [[0, 0], [30 - X, 0], [0, 20 - X], [30 - X, 20 - X]].forEach(function(q){ ctx.fillStyle = "rgba(180,35,24,.35)"; ctx.fillRect(ox + q[0] * s, oy + q[1] * s, X * s, X * s); ctx.strokeStyle = P.red; ctx.strokeRect(ox + q[0] * s, oy + q[1] * s, X * s, X * s); });
        lab(c, "30 cm", ox + 15 * s, oy - 12, P.ink, 12); lab(c, "20", ox - 2, oy + 10 * s, P.ink, 12, "right"); lab(c, "x = " + F(X, 2) + " cm", ox + 15 * s, oy + 10 * s, P.red, 13);
        var bx = ox + 6, by = oy + 20 * s + 36, bw = (30 - 2 * X) * s * 0.8, bd = (20 - 2 * X) * s * 0.45, bh = X * s * 1.1; ctx.fillStyle = "rgba(30,63,143,.12)"; ctx.strokeStyle = P.acc; ctx.lineWidth = 2;
        var x0 = bx + 20, y0 = by + 10; ctx.beginPath(); ctx.rect(x0, y0 + bd * 0.3, bw, bh); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0, y0 + bd * 0.3); ctx.lineTo(x0 + bd * 0.6, y0 - bd * 0.2); ctx.lineTo(x0 + bw + bd * 0.6, y0 - bd * 0.2); ctx.lineTo(x0 + bw, y0 + bd * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0 + bw, y0 + bd * 0.3); ctx.lineTo(x0 + bw + bd * 0.6, y0 - bd * 0.2); ctx.lineTo(x0 + bw + bd * 0.6, y0 - bd * 0.2 + bh); ctx.lineTo(x0 + bw, y0 + bd * 0.3 + bh); ctx.closePath(); ctx.fill(); ctx.stroke();
        lab(c, "boîte : " + F(30 - 2 * X, 1) + " × " + F(20 - 2 * X, 1) + " × " + F(X, 1), x0 + bw / 2, H - 16, P.acc, 12);
        var ax = D.axes(c, {x0: 0, x1: 10, y0: 0, y1: 1300, stepX: 2, stepY: 250, l: split + 40, xl: "x (cm)", yl: "V (cm³)"}); D.fn(c, ax, V, P.acc, 3); vl(c, ax, X, "#c2c9d3"); pt(c, ax, xo, V(xo), P.green, 6); pt(c, ax, X, V(X), P.red, 6);
        ro.set(0, F(X, 2) + " cm"); ro.set(1, "V = " + F(V(X), 1) + " cm³"); ro.set(2, "x* = " + F(xo, 3) + " cm"); ro.set(3, F(V(xo), 1) + " cm³");
        nt.set("V(x) = x(30 − 2x)(20 − 2x) ; V′(x) = 12x² − 200x + 600 = 0 ⇒ x = (25 ± 5√7)/3. On garde x = (25 − 5√7)/3 ≈ " + F(xo, 3) + " cm ; l'autre racine (≈ 12,74 cm) est hors du domaine ]0 ; 10[.", "");
      } else {
        var V0 = 330, Sf = function(r){ return 2 * PI * r * r + 2 * V0 / r; }, ro2 = Math.pow(V0 / (2 * PI), 1 / 3), r = X, h = V0 / (PI * r * r), sk = Math.min((H - 100) / 14, (split - 24) / 9);
        var cx = split / 2 + 4, cy = H / 2 + 10, rr = r * sk, hh = Math.min(h * sk, H - 60); ctx.fillStyle = "rgba(30,63,143,.10)"; ctx.strokeStyle = P.acc; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(cx - rr, cy - hh / 2, 2 * rr, hh); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy - hh / 2, rr, rr * 0.28, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy + hh / 2, rr, rr * 0.28, 0, 0, Math.PI); ctx.stroke();
        lab(c, "r = " + F(r, 2) + " cm", cx, cy - hh / 2 - 22, P.red, 12); lab(c, "h = " + F(h, 2) + " cm", cx, cy + hh / 2 + 28, P.acc, 12);
        var ax = D.axes(c, {x0: 1, x1: 7, y0: 150, y1: 700, stepX: 1, stepY: 100, l: split + 40, xl: "r (cm)", yl: "S (cm²)"}); D.fn(c, ax, Sf, P.acc, 3); vl(c, ax, X, "#c2c9d3"); pt(c, ax, ro2, Sf(ro2), P.green, 6); pt(c, ax, X, Sf(X), P.red, 6);
        ro.set(0, "r = " + F(r, 2) + " cm"); ro.set(1, "S = " + F(Sf(r), 1) + " cm²"); ro.set(2, "r* = " + F(ro2, 3) + " cm (h = 2r)"); ro.set(3, F(Sf(ro2), 1) + " cm²");
        nt.set("Volume fixé V = πr²h = 330 cm³ ⇒ h = 330/(πr²) ; S(r) = 2πr² + 2·330/r ; S′(r) = 4πr − 660/r² = 0 ⇒ r = (330/(2π))^(1/3) ≈ " + F(ro2, 3) + " cm et h = 2r. La canette optimale est aussi haute que large.", "");
      }
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
  resume: "On remplace la courbe par sa tangente : le point où elle coupe l'axe Ox donne l'approximation suivante. Le nombre de chiffres justes double à chaque pas.",
  but: "Choisis la fonction et le point de départ, puis clique sur « Itérer » pour tracer la tangente et lire la nouvelle approximation. Teste x³ − 2x + 2 en 0 : la méthode échoue.",
  aRetenir: "x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>). Si la racine est simple et le départ assez proche, la convergence est quadratique : l'erreur est à peu près élevée au carré à chaque pas.",
  piege: "Si f′(x<sub>n</sub>) ≈ 0 la tangente est presque horizontale et le pas est énorme ; la méthode peut aussi osciller (cycle) ou diverger selon le point de départ.",
  build: function(k, S){
    var c = k.canvas(370), fs, st = {xs: []};
    function reset(){ var T = N4[fs.value]; st.xs = [T.x0]; x0.set(T.x0); }
    fs = k.select("Fonction", [["sq2", "x² − 2"], ["cosx", "cos x − x"], ["cub", "x³ − 2x + 2 (piège)"], ["ln", "ln x − 1"]], "sq2", function(){ reset(); });
    var x0 = k.slider("Point de départ x₀", -2, 4, 0.1, 2, "", function(v){ st.xs = [v]; });
    k.button("Itérer", function(){ it(); }, true); k.button("+5", function(){ for (var i = 0; i < 5; i++) it(); }); k.button("Recommencer", function(){ st.xs = [x0.value]; });
    function it(){ var T = N4[fs.value], x = st.xs[st.xs.length - 1], d = T.d(x), y = T.f(x); if (!isFinite(x) || Math.abs(d) < 1e-12) return; var nx = x - y / d; if (st.xs.length < 30) st.xs.push(nx); }
    var ro = k.readouts(["Itération n", "xₙ", "f(xₙ)", "Pas |xₙ − xₙ₋₁|"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = N4[fs.value], ax = D.axes(c, {x0: T.xa, x1: T.xb, y0: T.ya, y1: T.yb, xl: "x", yl: "y"}); D.fn(c, ax, T.f, P.acc, 3);
      var n = st.xs.length; for (var i = 0; i < n; i++){ var x = st.xs[i], y = T.f(x); if (!isFinite(y)) break; D.line(c, ax.X(x), ax.Y(0), ax.X(x), ax.Y(y), "#b9c2cf", 1.2, [3, 3]); if (i < n - 1){ var nx = st.xs[i + 1]; D.line(c, ax.X(x), ax.Y(y), ax.X(nx), ax.Y(0), i === n - 2 ? P.amber : "#e6c8a0", i === n - 2 ? 2.6 : 1.6); } pt(c, ax, x, 0, i === n - 1 ? P.red : "#c98a85", i === n - 1 ? 6 : 3.5); }
      var xl = st.xs[n - 1], fl = T.f(xl); pt(c, ax, xl, fl, P.red, 5);
      ro.set(0, String(n - 1)); ro.set(1, F(xl, 9)); ro.set(2, S.sci(fl)); ro.set(3, n > 1 ? S.sci(Math.abs(xl - st.xs[n - 2])) : "—");
      nt.set(T.v, fs.value === "cub" ? "warn" : "");
    });
    reset();
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
