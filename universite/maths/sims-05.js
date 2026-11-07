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
/* Mathématiques BA1 · chapitre 5 : équations différentielles */
function rk4(f, x, y, h){ var k1 = f(x, y), k2 = f(x + h / 2, y + h / 2 * k1), k3 = f(x + h / 2, y + h / 2 * k2), k4 = f(x + h, y + h * k3); return y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); }
function traj(f, x0, y0, x1, n, stop){ var pts = [[x0, y0]], h = (x1 - x0) / n, x = x0, y = y0; for (var i = 0; i < n; i++){ var yn = rk4(f, x, y, h); x += h; if (!isFinite(yn) || Math.abs(yn) > 1e3 || (stop && stop(x, yn))) break; y = yn; pts.push([x, y]); } return pts; }
function poly(c, ax, pts, col, w, dash){ var ctx = c.ctx; if (pts.length < 2) return; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(ax.X(p[0]), ax.Y(p[1])) : ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); }); ctx.stroke(); ctx.restore(); }

/* 1 ---- champ de directions et méthode d'Euler ---- */
var E1 = {
  exp: {n: "y′ = y/2", f: function(x, y){ return y / 2; }, w: [-1, 5, -4, 8], ex: function(x0, y0){ return function(x){ return y0 * Math.exp((x - x0) / 2); }; }, form: "y = y₀·e^((x − x₀)/2)"},
  lin: {n: "y′ = x − y", f: function(x, y){ return x - y; }, w: [-1, 5, -3, 5], ex: function(x0, y0){ var C = (y0 - x0 + 1) * Math.exp(x0); return function(x){ return x - 1 + C * Math.exp(-x); }; }, form: "y = x − 1 + C·e^(−x)"},
  log: {n: "y′ = 0,8·y(1 − y/4)", f: function(x, y){ return 0.8 * y * (1 - y / 4); }, w: [0, 8, -1, 6], ex: function(x0, y0){ return function(x){ return y0 === 0 ? 0 : 4 / (1 + ((4 - y0) / y0) * Math.exp(-0.8 * (x - x0))); }; }, form: "logistique : y → 4"},
  xy: {n: "y′ = x·y", f: function(x, y){ return x * y; }, w: [-3, 3, -4, 4], ex: function(x0, y0){ return function(x){ return y0 * Math.exp((x * x - x0 * x0) / 2); }; }, form: "y = y₀·e^((x² − x₀²)/2)"},
  circ: {n: "y′ = −x/y", f: function(x, y){ return -x / y; }, w: [-5, 5, -4, 4], ex: null, form: "x² + y² = R² (cercles)"}
};
SFA.sim({
  id: "um-c05-champ-directions", ch: "c05", tag: "Champ de directions (EDO)",
  titre: "Le champ de directions : voir toutes les solutions d'un coup",
  resume: "Chaque petit segment donne la pente imposée par l'équation y′ = f(x, y). Clique pour lâcher une condition initiale et compare la solution exacte à la méthode d'Euler.",
  but: "Clique ou fais glisser le point de départ sur le graphe : la courbe bleue suit les segments. La ligne orange est la méthode d'Euler (tangentes successives de pas h) : diminue h et regarde-la se coller à la solution.",
  aRetenir: "Une équation différentielle y′ = f(x, y) fixe la pente en chaque point ; une solution est une courbe tangente au champ en tout point, et une condition initiale y(x₀) = y₀ en choisit une. Euler : yₙ₊₁ = yₙ + h·f(xₙ, yₙ) ; l'erreur globale est proportionnelle à h.",
  piege: "Euler accumule les erreurs : sur y′ = −x/y il quitte les cercles et spirale vers l'extérieur ; un pas trop grand donne un résultat qualitativement faux.",
  build: function(k, S){
    var c = k.canvas(400), st = {x0: 0, y0: 1, prog: 1e9};
    var eq = k.select("Équation", [["exp", "y′ = y/2"], ["lin", "y′ = x − y"], ["log", "y′ = 0,8·y(1 − y/4) (logistique)"], ["xy", "y′ = x·y"], ["circ", "y′ = −x/y"]], "lin", function(v){ var w = E1[v].w; st.x0 = v === "log" ? 0 : v === "circ" ? 0 : (w[0] + w[1]) / 2 - (w[1] - w[0]) * 0.25; st.y0 = v === "circ" ? 2.5 : v === "log" ? 0.6 : 1; st.prog = 1e9; });
    var hh = k.slider("Pas d'Euler h", 0.05, 1, 0.05, 0.5, ""), tg1 = k.toggle("Solution (Runge–Kutta précise)", true), tg2 = k.toggle("Méthode d'Euler", true), tg3 = k.toggle("Segments du champ", true);
    var ro = k.readouts(["Pente imposée f(x₀, y₀)", "Solution en x = fin", "Euler en x = fin", "Écart Euler − solution"]), nt = k.note("", "");
    var lp = k.loop(function(dt){ st.prog += dt * 6; k.redraw(); if (st.prog > 1000) lp.pause(); });
    k.button("Rejouer Euler pas à pas", function(){ st.prog = 0; lp.play(); }, true);
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && st.ax){ var w = E1[eq.value].w; st.x0 = cl(st.ax.ix(p.x), w[0], w[1] - 0.05); st.y0 = cl(st.ax.iy(p.y), w[2], w[3]); st.prog = 1e9; k.redraw(); } });
    k.draw(function(){
      c.clear(); var T = E1[eq.value], w = T.w, ctx = c.ctx, ax = D.axes(c, {x0: w[0], x1: w[1], y0: w[2], y1: w[3], xl: "x", yl: "y"}); st.ax = ax;
      var nx = Math.max(8, Math.round((ax.R - ax.L) / 30)), ny = Math.max(6, Math.round((ax.B - ax.T) / 30)), i, j;
      if (tg3.value){ ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); for (i = 0; i < nx; i++) for (j = 0; j < ny; j++){
        var x = w[0] + (i + 0.5) / nx * (w[1] - w[0]), y = w[2] + (j + 0.5) / ny * (w[3] - w[2]), s = T.f(x, y); if (!isFinite(s)) continue;
        var dyp = (ax.Y(y + s * 0.01) - ax.Y(y)) / (ax.X(x + 0.01) - ax.X(x)); var nrm = Math.sqrt(1 + dyp * dyp), L = 11, ux = L / nrm, uy = L * dyp / nrm, X = ax.X(x), Y = ax.Y(y);
        var g = Math.min(1, Math.abs(s) / 3); ctx.strokeStyle = "rgba(" + Math.round(60 + 120 * g) + "," + Math.round(110 - 40 * g) + "," + Math.round(170 - 110 * g) + ",.62)"; ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X - ux, Y - uy); ctx.lineTo(X + ux, Y + uy); ctx.stroke(); }
        ctx.restore(); }
      var stop = eq.value === "circ" ? function(x, y){ return Math.abs(y) < 0.05; } : null, nF = 300;
      var fw = traj(T.f, st.x0, st.y0, w[1], Math.max(10, Math.round(nF * (w[1] - st.x0) / (w[1] - w[0]))), stop), bw = traj(T.f, st.x0, st.y0, w[0], Math.max(10, Math.round(nF * (st.x0 - w[0]) / (w[1] - w[0]))), stop);
      if (eq.value === "circ"){ var R = Math.sqrt(st.x0 * st.x0 + st.y0 * st.y0), ci = []; for (i = 0; i <= 200; i++){ var th = (st.y0 >= 0 ? 0 : PI) + PI * i / 200; ci.push([R * Math.cos(th), R * Math.sin(th)]); } if (tg1.value) poly(c, ax, ci, "rgba(30,63,143,.35)", 7); }
      if (tg1.value){ poly(c, ax, bw, P.acc, 3.2); poly(c, ax, fw, P.acc, 3.2); }
      var n = Math.min(400, Math.floor((w[1] - st.x0) / hh.value + 1e-9)), ep = [[st.x0, st.y0]], xe = st.x0, ye = st.y0, nShow = Math.min(n, Math.floor(st.prog));
      for (i = 0; i < n; i++){ var sl = T.f(xe, ye); if (!isFinite(sl) || Math.abs(ye) > 1e3) { n = i; break; } ye += hh.value * sl; xe += hh.value; ep.push([xe, ye]); }
      var shown = ep.slice(0, nShow + 1);
      if (tg2.value){ poly(c, ax, shown, P.amber, 2.4); shown.forEach(function(p, q){ if (p[1] > w[2] - 5 && p[1] < w[3] + 5) pt(c, ax, p[0], p[1], P.amber, q === shown.length - 1 && nShow < n ? 5.5 : 3.6); }); }
      pt(c, ax, st.x0, st.y0, P.red, 6.5); lab(c, "(x₀ ; y₀)", ax.X(st.x0) + 10, ax.Y(st.y0) - 14, P.red, 12, "left");
      lab(c, T.n, ax.L + 8, ax.T + 14, P.ink, 15, "left"); lab(c, T.form, ax.L + 8, ax.T + 34, "#6b7380", 12, "left");
      var xf = ep[ep.length - 1][0], yE = ep[ep.length - 1][1], yR = st.y0, yS = NaN;
      var sub = traj(T.f, st.x0, st.y0, xf, 400, stop); if (sub.length && Math.abs(sub[sub.length - 1][0] - xf) < 1e-6) yS = sub[sub.length - 1][1];
      if (T.ex && isFinite(yS)){ var ye0 = T.ex(st.x0, st.y0)(xf); if (isFinite(ye0)) yS = ye0; }
      ro.set(0, F(T.f(st.x0, st.y0), 3)); ro.set(1, isFinite(yS) ? "x = " + F(xf, 2) + " : " + F(yS, 3) : "—"); ro.set(2, "x = " + F(xf, 2) + " : " + F(yE, 3)); ro.set(3, isFinite(yS) ? F(yE - yS, 3) : "—");
      if (eq.value === "circ") nt.set("Les solutions sont des demi-cercles : x² + y² = R² (car y dy = −x dx). Le champ est vertical sur l'axe Ox (pente infinie) : la solution s'arrête avant y = 0. Euler spirale vers l'extérieur.", "warn");
      else if (hh.value >= 0.8 && eq.value === "log") nt.set("Un pas h trop grand pour la logistique : Euler peut osciller autour de l'équilibre y = 4 sans converger. Diminue h.", "warn");
      else nt.set("Euler : " + n + " pas de h = " + F(hh.value, 2) + ". En divisant h par 2, l'écart final est à peu près divisé par 2 (erreur globale ∝ h).", "");
    });
  }
});

/* 2 ---- relaxation exponentielle y' = k(y - ye) ---- */
var PRE = {
  des: {n: "Désintégration radioactive (1 u.t. = 1 demi-vie)", k: -0.69, y0: 100, ye: 0, txt: "Un échantillon perd la moitié de ses noyaux par u.t. : y′ = −0,69·y."},
  eli: {n: "Élimination d'un médicament", k: -0.35, y0: 80, ye: 0, txt: "Après une injection i.v. : C′ = −k·C, sans apport. Plus C est grande, plus l'élimination est rapide."},
  cro: {n: "Croissance bactérienne", k: 0.5, y0: 2, ye: 0, txt: "Sans limitation de nutriments : N′ = k·N, croissance exponentielle."},
  ref: {n: "Refroidissement d'une boisson (loi de Newton)", k: -0.3, y0: 90, ye: 20, txt: "T′ = −0,3·(T − 20) : la température tend vers celle de la pièce, 20 °C."},
  per: {n: "Perfusion continue", k: -0.4, y0: 0, ye: 50, txt: "C′ = −0,4·C + 20 = −0,4·(C − 50) : la concentration monte vers un plateau 50 = apport/(k·V)."}
};
SFA.sim({
  id: "um-c05-relaxation", ch: "c05", tag: "y′ = k(y − y∞)",
  titre: "Croissance, décroissance, refroidissement, perfusion : une seule équation",
  resume: "y′ = k(y − y∞) : le taux de variation est proportionnel à l'écart à l'équilibre. Change k, y₀ et y∞ et vois la solution, sa pente et la droite du diagramme de phase.",
  but: "Choisis un contexte ou règle k, y₀, y∞. À gauche : y(t) avec sa tangente au temps t* (glisse sur le graphe). À droite : y′ en fonction de y est une droite — c'est l'équation elle-même. En semi-log, l'écart |y − y∞| devient une droite de pente k.",
  aRetenir: "Solution : y(t) = y∞ + (y₀ − y∞)·e^(kt). Si k < 0, y tend vers y∞ (équilibre stable) avec la constante de temps 1/|k| et la demi-vie ln 2/|k| ; si k > 0, l'écart explose (temps de doublement ln 2/k) : y∞ est instable.",
  piege: "Une demi-vie n'est pas « la moitié de la durée de vie » : après 2 demi-vies il reste 1/4, pas 0. Pour le refroidissement, c'est l'écart T − T_ambiante qui décroît exponentiellement, pas T lui-même.",
  build: function(k, S){
    var c = k.canvas(300), c2 = k.canvas(200), st = {tt: 3};
    var pr = k.select("Contexte", [["des", PRE.des.n], ["eli", PRE.eli.n], ["cro", PRE.cro.n], ["ref", PRE.ref.n], ["per", PRE.per.n]], "ref", function(v){ var q = PRE[v]; kk.set(q.k); y0.set(q.y0); ye.set(q.ye); });
    var kk = k.slider("Taux k", -1.5, 1.5, 0.01, PRE.ref.k, "1/u.t."), y0 = k.slider("Valeur initiale y₀", 0, 100, 1, PRE.ref.y0, ""), ye = k.slider("Équilibre y∞", 0, 100, 1, PRE.ref.ye, "");
    var sl = k.toggle("Échelle semi-log de l'écart |y − y∞|", false);
    var ro = k.readouts(["y(t*)", "y′(t*) = k(y − y∞)", "Constante de temps 1/|k|", "Demi-vie ou doublement"]), nt = k.note(PRE.ref.txt, "");
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && st.ax){ st.tt = cl(st.ax.ix(p.x), 0, st.T); k.redraw(); } });
    k.draw(function(){
      c.clear(); c2.clear(); var K = kk.value, Y0 = y0.value, YE = ye.value, T = Math.abs(K) < 0.03 ? 20 : cl(4.6 / Math.abs(K), 3, 20); st.T = T; var tt = Math.min(st.tt, T);
      var y = function(t){ return YE + (Y0 - YE) * Math.exp(K * t); }, ctx = c.ctx, semi = sl.value && Math.abs(Y0 - YE) > 1e-9, i;
      var ymin = 0, ymax = Math.max(Y0, YE, y(T), 1) * 1.1; if (K > 0 && Y0 < YE) ymin = Math.min(0, y(T)); if (y(T) < 0) ymin = y(T) * 1.1;
      var ax;
      if (semi){ var g = function(t){ return Math.log(Math.abs(Y0 - YE)) + K * t; }, lo = Math.min(g(0), g(T)) - 0.5, hi = Math.max(g(0), g(T)) + 0.5; ax = D.axes(c, {x0: 0, x1: T, y0: lo, y1: hi, xl: "t", yl: "ln|y − y∞|"}); st.ax = ax; D.fn(c, ax, g, P.acc, 3.2); pt(c, ax, tt, g(tt), P.red, 6); lab(c, "pente = k = " + F(K, 2), ax.X(T * 0.55), ax.Y(g(T * 0.55)) - 18, P.amber, 14);
      } else { ax = D.axes(c, {x0: 0, x1: T, y0: ymin, y1: ymax, xl: "t (u.t.)", yl: "y"}); st.ax = ax; if (YE >= ymin && YE <= ymax){ hl(c, ax, YE, P.green, [6, 4], 1.8); lab(c, "y∞ = " + F(YE, 0), ax.R - 6, ax.Y(YE) - 10, P.green, 13, "right"); }
        D.fn(c, ax, y, P.acc, 3.4); var yt = y(tt), sp = K * (yt - YE), dt0 = T * 0.28; D.fn(c, ax, function(t){ return yt + sp * (t - tt); }, P.amber, 2.2, [6, 4]); pt(c, ax, tt, yt, P.red, 6.5); vl(c, ax, tt, "#b6bfcc", [3, 4], 1.2); lab(c, "t*", ax.X(tt), ax.B + 14, P.red, 12); }
      var ctx2 = c2.ctx, rng = Math.max(Math.abs(Y0 - YE), 1) * 1.25, y1 = Math.max(Y0, YE) + rng * 0.3, ya = Math.min(Y0, YE, 0) - 1, yb = Math.max(Y0, YE, 1) * 1.15 + 1, dmax = Math.abs(K) * Math.max(Math.abs(ya - YE), Math.abs(yb - YE));
      var ax2 = D.axes(c2, {x0: ya, x1: yb, y0: -dmax * 1.1, y1: dmax * 1.1, xl: "y", yl: "y′", l: 54}); D.fn(c2, ax2, function(v){ return K * (v - YE); }, P.violet, 3);
      pt(c2, ax2, YE, 0, K < 0 ? P.green : "#fff", 6.5); if (K > 0){ ctx2.beginPath(); ctx2.arc(ax2.X(YE), ax2.Y(0), 6.5, 0, 7); ctx2.strokeStyle = P.red; ctx2.lineWidth = 2.4; ctx2.stroke(); }
      var yt2 = y(tt), dy = K * (yt2 - YE); pt(c2, ax2, yt2, dy, P.red, 6); var dir = dy > 0 ? 1 : dy < 0 ? -1 : 0; if (dir && ax2.X(yt2) > ax2.L + 30 && ax2.X(yt2) < ax2.R - 30) D.arrow(c2, ax2.X(yt2), ax2.Y(0), ax2.X(yt2) + dir * 26, ax2.Y(0), P.red, 2.6);
      lab(c2, K < 0 ? "équilibre stable" : K > 0 ? "équilibre instable" : "pas d'évolution", ax2.X(YE), ax2.Y(0) + (K < 0 ? -16 : 16), K < 0 ? P.green : P.red, 12);
      lab(c2, "pente k = " + F(K, 2), ax2.R - 8, ax2.T + 12, P.violet, 13, "right");
      ro.set(0, F(yt2, 2)); ro.set(1, F(dy, 3)); ro.set(2, Math.abs(K) < 1e-9 ? "∞" : F(1 / Math.abs(K), 2) + " u.t."); ro.set(3, Math.abs(K) < 1e-9 ? "—" : (K < 0 ? "demi-vie " : "doublement ") + F(Math.LN2 / Math.abs(K), 2) + " u.t.");
      var q = PRE[pr.value]; nt.set(Math.abs(Y0 - YE) < 1e-9 ? "y₀ = y∞ : la solution constante y = y∞ ne bouge pas (équilibre)." : (K > 0 && Y0 !== YE ? "k > 0 : l'écart à y∞ croît exponentiellement — y∞ est un équilibre instable. " : "") + (K === 0 ? "k = 0 : y′ = 0, y reste constante." : ""), Math.abs(Y0 - YE) < 1e-9 || K > 0 ? "warn" : "");
      if (!(Math.abs(Y0 - YE) < 1e-9 || K > 0 || K === 0)) nt.set((q ? q.txt + " " : "") + "Après une demi-vie, l'écart est divisé par 2 ; après 3 demi-vies, il reste 12,5 % de l'écart initial.", "");
    });
  }
});

/* 3 ---- logistique avec prélèvement ---- */
SFA.sim({
  id: "um-c05-logistique", ch: "c05", tag: "Modèle logistique",
  titre: "Croissance logistique et prélèvement : équilibres, stabilité, effondrement",
  resume: "y′ = r·y(1 − y/K) − h : une population limitée par K, éventuellement exploitée (pêche). Les équilibres se lisent sur la parabole y′(y) ; au-delà d'un prélèvement critique, tout s'effondre.",
  but: "Fais varier r, K, la population initiale et le prélèvement h. À droite : y′ en fonction de y — où la courbe coupe l'axe, il y a un équilibre (plein = stable, creux = instable). Augmente h jusqu'à rK/4 et observe la disparition des équilibres.",
  aRetenir: "Sans prélèvement : équilibres 0 (instable) et K (stable) ; la croissance est maximale pour y = K/2 (point d'inflexion), avec y′ = rK/4. Avec prélèvement h : équilibres y = (K/2)(1 ± √(1 − 4h/(rK))) ; ils fusionnent et disparaissent si h > rK/4 (rendement maximal soutenable).",
  piege: "Le prélèvement maximal « rentable » rK/4 est aussi le bord de l'effondrement : une population ramenée sous l'équilibre instable ne se rétablit plus, même si l'on arrête de la surexploiter seulement un peu trop tard.",
  build: function(k, S){
    var c = k.canvas(300), c2 = k.canvas(210);
    var r = k.slider("Taux de croissance r", 0.2, 2, 0.05, 1, "1/u.t."), K = k.slider("Capacité du milieu K", 20, 100, 5, 100, ""), y0 = k.slider("Population initiale y₀", 0, 150, 1, 15, ""), h = k.slider("Prélèvement h (par u.t.)", 0, 40, 0.5, 0, "");
    var ro = k.readouts(["Équilibre stable", "Équilibre instable", "Prélèvement critique rK/4", "y(T)"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); c2.clear(); var R = r.value, KK = K.value, H = h.value, Y0 = y0.value, T = 12 / R, Hc = R * KK / 4, ctx = c.ctx;
      var f = function(t, y){ return R * y * (1 - y / KK) - H; }, ymax = Math.max(KK * 1.5, Y0 * 1.05, 20);
      var ax = D.axes(c, {x0: 0, x1: T, y0: 0, y1: ymax, xl: "t (u.t.)", yl: "y"});
      var D2 = H <= Hc ? Math.sqrt(1 - 4 * H / (R * KK)) : NaN, ys = H <= Hc ? KK / 2 * (1 + D2) : NaN, yu = H <= Hc ? KK / 2 * (1 - D2) : NaN;
      if (isFinite(ys)){ hl(c, ax, ys, P.green, [6, 4], 1.6); lab(c, "équilibre stable " + F(ys, 1), ax.R - 6, ax.Y(ys) - 10, P.green, 12, "right"); if (H > 0){ hl(c, ax, yu, P.red, [4, 4], 1.6); lab(c, "instable " + F(yu, 1), ax.R - 6, ax.Y(yu) + 14, P.red, 12, "right"); } }
      function path(y00, N){ var pts = [[0, y00]], y = y00, hs = T / N; for (var i = 0; i < N; i++){ y = rk4(f, i * hs, y, hs); if (y < 0) { y = 0; } pts.push([(i + 1) * hs, y]); if (y === 0 && f(0, 0) <= 0) { for (var q = i + 1; q < N; q++) pts.push([(q + 1) * hs, 0]); break; } } return pts; }
      [0.12, 0.35, 0.65, 1.15, 1.4].forEach(function(m){ poly(c, ax, path(m * KK, 240), "rgba(30,63,143,.22)", 1.8); });
      var me = path(Y0, 360); poly(c, ax, me, P.acc, 3.6);
      var yT = me[me.length - 1][1];
      pt(c, ax, 0, Y0, P.red, 6); lab(c, "K = " + F(KK, 0), ax.L + 6, ax.Y(KK) - 8, "#6b7380", 12, "left"); if (H === 0) hl(c, ax, KK, "#9aa5b4", [3, 4], 1.2);
      if (H === 0 && Y0 > 0 && Y0 < KK){ var ti = Math.log((KK - Y0) / Y0) / R; if (ti > 0 && ti < T){ pt(c, ax, ti, KK / 2, P.amber, 5.5); lab(c, "inflexion y = K/2", ax.X(ti) + 8, ax.Y(KK / 2) + 16, P.amber, 12, "left"); } }
      // diagramme de phase
      var yb = Math.max(KK * 1.5, 20), fmax = Math.max(R * KK / 4, 1), ax2 = D.axes(c2, {x0: 0, x1: yb, y0: -fmax * 1.6 - H * 0.3, y1: fmax * 1.25, xl: "y", yl: "y′", l: 54});
      D.fn(c2, ax2, function(y){ return R * y * (1 - y / KK) - H; }, P.violet, 3.2); if (H > 0) D.fn(c2, ax2, function(y){ return R * y * (1 - y / KK); }, "rgba(98,54,196,.28)", 1.8, [5, 4]);
      var cur = f(0, Y0); pt(c2, ax2, Y0, cur, P.red, 6); var dir = cur > 0 ? 1 : cur < 0 ? -1 : 0; if (dir) D.arrow(c2, ax2.X(Y0), ax2.Y(0), ax2.X(Y0) + dir * 28, ax2.Y(0), P.red, 2.6);
      if (isFinite(ys)){ var cx = c2.ctx; pt(c2, ax2, ys, 0, P.green, 6.5); if (H > 0 && D2 > 1e-9){ cx.beginPath(); cx.arc(ax2.X(yu), ax2.Y(0), 6.5, 0, 7); cx.fillStyle = "#fff"; cx.fill(); cx.strokeStyle = P.red; cx.lineWidth = 2.6; cx.stroke(); } else if (H === 0){ cx.beginPath(); cx.arc(ax2.X(0), ax2.Y(0), 6.5, 0, 7); cx.fillStyle = "#fff"; cx.fill(); cx.strokeStyle = P.red; cx.lineWidth = 2.6; cx.stroke(); } }
      lab(c2, "y′ = r·y(1 − y/K) − h", ax2.R - 6, ax2.T + 12, P.violet, 13, "right");
      ro.set(0, isFinite(ys) ? F(ys, 2) : "aucun"); ro.set(1, isFinite(yu) ? (H === 0 ? "0" : F(yu, 2)) : "aucun"); ro.set(2, F(Hc, 2)); ro.set(3, F(yT, 2));
      if (H > Hc) nt.set("h > rK/4 = " + F(Hc, 2) + " : plus aucun équilibre, y′ < 0 partout. La population s'éteint en temps fini, quelle que soit y₀.", "bad");
      else if (isFinite(yu) && Y0 < yu - 1e-9 && H > 0) nt.set("y₀ est sous l'équilibre instable " + F(yu, 2) + " : la population décline jusqu'à l'extinction.", "bad");
      else if (Math.abs(H - Hc) < 1e-9) nt.set("h = rK/4 : équilibre semi-stable unique y = K/2. Une petite perturbation vers le bas entraîne l'effondrement.", "warn");
      else nt.set(Y0 === 0 && H === 0 ? "y₀ = 0 : l'équilibre y = 0 est instable mais la population reste nulle." : "La population converge vers l'équilibre stable " + F(ys, 2) + ".", "");
    });
  }
});

/* 4 ---- oscillateur libre : m x'' + c x' + k x = 0 ---- */
function osc(m, cc, kk, x0, v0){
  var D0 = cc * cc - 4 * m * kk;
  if (Math.abs(D0) < 1e-9){ var l = -cc / (2 * m); return {reg: "crit", l1: l, l2: l, f: function(t){ return Math.exp(l * t) * (x0 + (v0 - l * x0) * t); }, d: function(t){ return Math.exp(l * t) * (l * (x0 + (v0 - l * x0) * t) + (v0 - l * x0)); }}; }
  if (D0 < 0){ var al = -cc / (2 * m), w = Math.sqrt(-D0) / (2 * m), B = (v0 - al * x0) / w; return {reg: "sous", al: al, w: w, re: al, im: w, f: function(t){ return Math.exp(al * t) * (x0 * Math.cos(w * t) + B * Math.sin(w * t)); }, d: function(t){ return Math.exp(al * t) * ((al * x0 + w * B) * Math.cos(w * t) + (al * B - w * x0) * Math.sin(w * t)); }}; }
  var s = Math.sqrt(D0), l1 = (-cc + s) / (2 * m), l2 = (-cc - s) / (2 * m), A = (v0 - l2 * x0) / (l1 - l2), Bq = x0 - A;
  return {reg: "sur", l1: l1, l2: l2, f: function(t){ return A * Math.exp(l1 * t) + Bq * Math.exp(l2 * t); }, d: function(t){ return A * l1 * Math.exp(l1 * t) + Bq * l2 * Math.exp(l2 * t); }};
}
function springDraw(c, x0px, xm, y, w, col){ var ctx = c.ctx, n = 12, len = xm - x0px; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x0px, y); ctx.lineTo(x0px + len * 0.1, y); for (var i = 0; i < n; i++){ var xx = x0px + len * (0.1 + 0.8 * (i + 0.5) / n); ctx.lineTo(xx, y + (i % 2 ? 1 : -1) * w); } ctx.lineTo(x0px + len * 0.9, y); ctx.lineTo(xm, y); ctx.stroke(); ctx.restore(); }
SFA.sim({
  id: "um-c05-oscillateur", ch: "c05", tag: "EDO linéaire d'ordre 2",
  titre: "Masse-ressort amorti : les racines de l'équation caractéristique décident de tout",
  resume: "m x″ + c x′ + k x = 0. Selon le signe de c² − 4mk, les racines sont complexes (oscillations amorties), doubles (amortissement critique) ou réelles (retour lent). Vois-les dans le plan complexe et sur la masse.",
  but: "Règle m, c, k, la position et la vitesse initiales, ou clique un régime prêt à l'emploi. Le point de la masse suit la courbe x(t) ; en bas, les racines λ de m λ² + c λ + k = 0 bougent dans le plan complexe.",
  aRetenir: "Équation caractéristique mλ² + cλ + k = 0, Δ = c² − 4mk. Δ < 0 : x = e^(αt)(A cos ωt + B sin ωt), α = −c/2m, ω = √(4mk − c²)/2m ; Δ = 0 : x = (A + Bt)e^(λt) ; Δ > 0 : x = A e^(λ₁t) + B e^(λ₂t). Si c > 0, toutes les solutions tendent vers 0 (les racines ont une partie réelle < 0).",
  piege: "L'amortissement critique n'est pas « le plus fort » : c'est le plus rapide retour à l'équilibre sans dépassement. Au-delà (sur-amorti), le retour est plus lent à cause de la racine la plus proche de 0.",
  build: function(k, S){
    var c = k.canvas(250), c0 = k.canvas(96), c3 = k.canvas(190), st = {t: 0};
    var m = k.slider("Masse m", 0.2, 3, 0.05, 1, "kg"), cc = k.slider("Frottement c", 0, 8, 0.05, 0.8, "kg/s"), kk = k.slider("Raideur k", 0.5, 12, 0.1, 4, "N/m"), x0 = k.slider("Position initiale x₀", -1, 1, 0.05, 1, "m"), v0 = k.slider("Vitesse initiale v₀", -3, 3, 0.1, 0, "m/s");
    var ro = k.readouts(["Δ = c² − 4mk", "Racines λ", "Régime", "Rapport ζ = c/(2√(mk))"]), nt = k.note("", "");
    k.seg("Régime prêt à l'emploi", [["n", "Sans frottement"], ["s", "Sous-amorti"], ["c", "Critique"], ["o", "Sur-amorti"]], "s", function(v){ m.set(1); kk.set(4); x0.set(1); v0.set(0); cc.set(v === "n" ? 0 : v === "s" ? 0.8 : v === "c" ? 4 : 7); st.t = 0; });
    var TT = 12, lp = k.loop(function(dt){ st.t += dt; if (st.t > TT + 1) st.t = 0; k.redraw(); }); lp.play();
    k.button("Relancer", function(){ st.t = 0; }, true);
    k.draw(function(){
      c.clear(); c0.clear(); c3.clear(); var M = m.value, C = cc.value, Kk = kk.value, X0 = x0.value, V0 = v0.value, o = osc(M, C, Kk, X0, V0), t = Math.min(st.t, TT), ctx = c.ctx;
      var amp = Math.max(Math.abs(X0), Math.sqrt(X0 * X0 + V0 * V0 * M / Kk), 0.2) * 1.2, ax = D.axes(c, {x0: 0, x1: TT, y0: -amp, y1: amp, xl: "t (s)", yl: "x (m)"});
      if (o.reg === "sous" && C > 0){ var env = Math.sqrt(X0 * X0 + Math.pow((V0 - o.al * X0) / o.w, 2)); D.fn(c, ax, function(s){ return env * Math.exp(o.al * s); }, "rgba(192,50,29,.5)", 1.8, [5, 4]); D.fn(c, ax, function(s){ return -env * Math.exp(o.al * s); }, "rgba(192,50,29,.5)", 1.8, [5, 4]); }
      D.fn(c, ax, o.f, P.acc, 3.2); pt(c, ax, t, o.f(t), P.red, 6.5); vl(c, ax, t, "#b6bfcc", [3, 4], 1.2);
      // masse-ressort
      var W0 = c0.W, Y0 = c0.H / 2, sc = (W0 - 110) / 2 / Math.max(amp, 0.5) * 0.9, xm = W0 / 2 + 20 + o.f(t) * sc, c0x = c0.ctx;
      c0x.fillStyle = "#e3e7ed"; c0x.fillRect(0, Y0 + 24, W0, 4); c0x.fillStyle = "#6b7380"; c0x.fillRect(14, Y0 - 28, 8, 56); springDraw(c0, 22, xm - 20, Y0, 11, P.teal);
      c0x.fillStyle = P.acc; c0x.beginPath(); c0x.roundRect ? c0x.roundRect(xm - 20, Y0 - 20, 40, 40, 6) : c0x.rect(xm - 20, Y0 - 20, 40, 40); c0x.fill(); D.line(c0, W0 / 2 + 20, Y0 - 30, W0 / 2 + 20, Y0 + 30, "#9aa5b4", 1.2, [3, 3]); lab(c0, "x = 0", W0 / 2 + 20, Y0 - 38, "#6b7380", 11);
      // plan complexe des racines
      var roots = o.reg === "sous" ? [[o.re, o.im], [o.re, -o.im]] : [[o.l1, 0], [o.l2, 0]], Rm = Math.max(1.5, Math.abs(o.re || 0) * 1.4, Math.abs(o.l1 || 0) * 1.2, Math.abs(o.l2 || 0) * 1.2, o.im ? o.im * 1.4 : 0), ax3 = D.axes(c3, {x0: -Rm * 1.05, x1: Rm * 0.35, y0: -Rm * 0.75, y1: Rm * 0.75, xl: "Re λ", yl: "Im λ", l: 50});
      c3.ctx.fillStyle = "rgba(36,119,90,.07)"; c3.ctx.fillRect(ax3.L, ax3.T, ax3.X(0) - ax3.L, ax3.B - ax3.T); lab(c3, "Re λ < 0 : amortissement", ax3.L + 8, ax3.T + 12, P.green, 11, "left");
      roots.forEach(function(q){ pt(c3, ax3, q[0], q[1], P.red, 6.5); }); if (o.reg === "sous"){ D.line(c3, ax3.X(o.re), ax3.Y(o.im), ax3.X(o.re), ax3.Y(-o.im), "rgba(192,50,29,.4)", 1.4, [4, 3]); }
      lab(c3, o.reg === "sous" ? "λ = " + F(o.re, 2) + " ± " + F(o.im, 2) + " i" : "λ = " + F(o.l1, 2) + (o.reg === "crit" ? " (double)" : " ; " + F(o.l2, 2)), ax3.R - 6, ax3.B - 10, P.red, 12, "right");
      var Dl = C * C - 4 * M * Kk; ro.set(0, F(Dl, 2)); ro.set(1, o.reg === "sous" ? F(o.re, 2) + " ± " + F(o.im, 2) + " i" : F(o.l1, 2) + " ; " + F(o.l2, 2)); ro.set(2, C === 0 ? "oscillations libres" : o.reg === "sous" ? "sous-amorti" : o.reg === "crit" ? "critique" : "sur-amorti"); ro.set(3, F(C / (2 * Math.sqrt(M * Kk)), 3));
      nt.set(C === 0 ? "Sans frottement : racines imaginaires pures ±iω₀, ω₀ = √(k/m) = " + F(Math.sqrt(Kk / M), 2) + " rad/s ; période " + F(2 * PI / Math.sqrt(Kk / M), 2) + " s, amplitude constante." : o.reg === "sous" ? "Pseudo-période " + F(2 * PI / o.w, 2) + " s ; l'amplitude est multipliée par e^(−c/2m) = " + F(Math.exp(o.al), 3) + " par seconde (enveloppe rouge pointillée)." : o.reg === "crit" ? "Amortissement critique : retour à l'équilibre le plus rapide sans oscillation." : "Sur-amorti : deux exponentielles décroissantes ; la plus lente (λ = " + F(Math.max(o.l1, o.l2), 3) + ") domine à long terme.", "");
    });
  }
});

/* 5 ---- oscillateur forcé et résonance (3D) ---- */
SFA.sim({
  id: "um-c05-resonance", ch: "c05", tag: "Résonance (3D)",
  titre: "Oscillateur forcé : la résonance, de la courbe de réponse à la spirale en 3D",
  resume: "x″ + 2ζω₀x′ + ω₀²x = cos ωt. Balaye la fréquence excitatrice ω, vois l'amplitude exploser près de ω₀ et regarde la trajectoire (x, v, t) s'enrouler vers une ellipse. Tourne la vue 3D à la souris.",
  but: "Règle la fréquence ω de la force et l'amortissement ζ (ω₀ = 2 rad/s). En haut : courbe de résonance A(ω) avec le point de fonctionnement. Au milieu : x(t) à partir du repos (régime transitoire puis permanent). En bas : la trajectoire dans l'espace (x, v/ω₀, t) — fais-la tourner en la tirant.",
  aRetenir: "Solution = transitoire (qui meurt, e^(−ζω₀t)) + régime permanent x_p = A cos(ωt − φ) avec A = 1/√((ω₀² − ω²)² + (2ζω₀ω)²). Pic de résonance en ω_r = ω₀√(1 − 2ζ²) (si ζ < 1/√2) ; plus ζ est petit, plus le pic est haut (A ≈ 1/(2ζω₀²)). Sans frottement, A → ∞ : l'énergie s'accumule à chaque cycle.",
  piege: "La fréquence de résonance n'est pas exactement ω₀ dès qu'il y a du frottement (ω_r < ω₀), et au démarrage la réponse oscille de façon irrégulière (battements) avant de se stabiliser.",
  build: function(k, S){
    var c0 = k.canvas(96), c = k.canvas(220), c2 = k.canvas(190), c3 = k.canvas(320), st = {t: 0, az: 0.7, el: 0.45, drag: false, lx: 0, ly: 0};
    var w0 = 2, wv = k.slider("Fréquence de la force ω", 0.2, 5, 0.01, 1.6, "rad/s"), zt = k.slider("Amortissement ζ", 0.03, 0.9, 0.01, 0.12, "");
    var ro = k.readouts(["Amplitude permanente A(ω)", "Amplification A(ω)/A(0)", "Déphasage φ", "Fréquence de résonance ω_r"]), nt = k.note("", "");
    var TT = 40, lp = k.loop(function(dt){ st.t += dt * 2; if (st.t > TT) st.t = 0; k.redraw(); }); lp.play();
    k.button("Relancer depuis le repos", function(){ st.t = 0; }, true);
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(t, p){ if (t === "down" || t === "drag"){ var X0 = 46, X1 = c.W - 16; wv.set(Math.round(cl(0.2 + (p.x - X0) / (X1 - X0) * 4.8, 0.2, 5) * 100) / 100); k.redraw(); } });
    c3.pointer(function(t, p){ if (t === "down"){ st.drag = true; st.lx = p.x; st.ly = p.y; } else if (t === "drag"){ st.az += (p.x - st.lx) * 0.012; st.el = cl(st.el + (p.y - st.ly) * 0.01, -1.3, 1.3); st.lx = p.x; st.ly = p.y; } else if (t === "up") st.drag = false; });
    function sol(w, z){
      var A = 1 / Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(2 * z * w0 * w, 2)), ph = Math.atan2(2 * z * w0 * w, w0 * w0 - w * w), wd = w0 * Math.sqrt(1 - z * z), a = z * w0;
      var xp0 = A * Math.cos(ph), vp0 = A * w * Math.sin(ph), C1 = -xp0, C2 = (-vp0 + a * C1) / wd;
      return {A: A, ph: ph, x: function(t){ var e = Math.exp(-a * t); return A * Math.cos(w * t - ph) + e * (C1 * Math.cos(wd * t) + C2 * Math.sin(wd * t)); }, v: function(t){ var e = Math.exp(-a * t); return -A * w * Math.sin(w * t - ph) + e * ((-a * C1 + wd * C2) * Math.cos(wd * t) + (-a * C2 - wd * C1) * Math.sin(wd * t)); }};
    }
    function pj(x, y, z, cx, cy, s){ var ca = Math.cos(st.az), sa = Math.sin(st.az), ce = Math.cos(st.el), se = Math.sin(st.el), X = x * ca - y * sa, Y = x * sa + y * ca; return [cx + s * X, cy - s * (z * ce + Y * se)]; }
    k.draw(function(){
      c.clear(); c2.clear(); c3.clear(); c0.clear(); var Z = zt.value, Wv = wv.value, s = sol(Wv, Z), t = Math.min(st.t, TT), i;
      var Am = function(w){ return 1 / Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(2 * Z * w0 * w, 2)); }, Ar = 0.25; for (i = 0; i <= 500; i++) Ar = Math.max(Ar, Am(0.2 + 4.8 * i / 500));
      var ax = D.axes(c, {x0: 0, x1: 5, y0: 0, y1: Ar * 1.12, xl: "ω (rad/s)", yl: "A(ω)"}); D.fn(c, ax, Am, P.violet, 3.2); vl(c, ax, w0, "#9aa5b4", [4, 4], 1.2); lab(c, "ω₀", ax.X(w0), ax.B + 14, "#6b7380", 12); D.label(c, "glisse le point rouge", ax.R - 6, ax.T + 4, {color:P.red, align:"right", base:"top", size:10.5});
      pt(c, ax, Wv, s.A, P.red, 6.5); var wr = Z < Math.SQRT1_2 ? w0 * Math.sqrt(1 - 2 * Z * Z) : 0; if (wr > 0) { pt(c, ax, wr, Am(wr), P.amber, 4.5); }
      var Rt = 0.2; for (i = 0; i <= 400; i++){ var tq = TT * i / 400; Rt = Math.max(Rt, Math.abs(s.x(tq)), Math.abs(s.v(tq)) / w0); } Rt *= 1.1; var ax2 = D.axes(c2, {x0: 0, x1: TT, y0: -Rt, y1: Rt, xl: "t (s)", yl: "x(t)"}), N = 700, pts = [], f1 = [];
      for (i = 0; i <= N; i++){ var tt = TT * i / N; pts.push([tt, s.x(tt)]); } poly(c2, ax2, pts, P.acc, 2.4);
      D.fn(c2, ax2, function(u){ return 0.0 * u; }, "#9aa5b4", 1, [3, 3]); var fa = Math.min(Rt * 0.5, 0.5); D.fn(c2, ax2, function(u){ return fa * Math.cos(Wv * u); }, "rgba(194,106,12,.35)", 1.4);
      pt(c2, ax2, t, s.x(t), P.red, 6); vl(c2, ax2, t, "#b6bfcc", [3, 4], 1.2); lab(c2, "force (orange)", ax2.R - 6, ax2.T + 12, P.amber, 11, "right");
      // masse-ressort
      var W0 = c0.W, Y0 = c0.H / 2, sc = (W0 - 140) / 2 / Rt, xm = W0 / 2 + 30 + s.x(t) * sc, c0x = c0.ctx; c0x.fillStyle = "#6b7380"; c0x.fillRect(14, Y0 - 24, 8, 48); springDraw(c0, 22, xm - 18, Y0, 9, P.teal); c0x.fillStyle = P.acc; c0x.fillRect(xm - 18, Y0 - 18, 36, 36); D.line(c0, W0 / 2 + 30, Y0 - 26, W0 / 2 + 30, Y0 + 26, "#9aa5b4", 1.2, [3, 3]);
      var fq = Math.cos(Wv * t) * 46; if (Math.abs(fq) > 4) D.arrow(c0, xm + (fq > 0 ? 22 : -22), Y0 - 30, xm + (fq > 0 ? 22 : -22) + fq, Y0 - 30, P.amber, 3); D.label(c0, "force excitatrice", W0 - 12, 16, {color:P.amber, align:"right", size:10.5});
      // 3D
      var cx3 = c3.W / 2, cy3 = c3.H / 2 + 8, vs = w0, R = Rt, sc3 = Math.min(c3.W * 0.34, c3.H * 0.42) / R, zh = c3.H * 0.30 / 1, ctx3 = c3.ctx;
      function P3(x, y, tz){ return pj(x, y, (tz / TT - 0.5) * 1.5 * R, cx3, cy3, sc3); }
      var corners = [[-R, -R], [R, -R], [R, R], [-R, R]];
      ctx3.save(); ctx3.strokeStyle = "rgba(138,149,163,.55)"; ctx3.lineWidth = 1.2;
      [0, TT].forEach(function(tz){ ctx3.beginPath(); corners.forEach(function(q, ii){ var p = P3(q[0], q[1], tz); ii ? ctx3.lineTo(p[0], p[1]) : ctx3.moveTo(p[0], p[1]); }); ctx3.closePath(); ctx3.fillStyle = tz === 0 ? "rgba(30,63,143,.05)" : "rgba(0,0,0,0)"; ctx3.fill(); ctx3.stroke(); });
      corners.forEach(function(q){ var a = P3(q[0], q[1], 0), b = P3(q[0], q[1], TT); ctx3.beginPath(); ctx3.moveTo(a[0], a[1]); ctx3.lineTo(b[0], b[1]); ctx3.stroke(); }); ctx3.restore();
      var a0 = P3(-R, 0, 0), a1 = P3(R, 0, 0), b0 = P3(0, -R, 0), b1 = P3(0, R, 0); D.line(c3, a0[0], a0[1], a1[0], a1[1], "#9aa5b4", 1.2); D.line(c3, b0[0], b0[1], b1[0], b1[1], "#9aa5b4", 1.2); lab(c3, "x", a1[0] + 8, a1[1], "#6b7380", 12); lab(c3, "v/ω₀", b1[0] + 4, b1[1] - 8, "#6b7380", 12);
      var tl = P3(R, R, TT); lab(c3, "t", tl[0] + 10, tl[1], "#6b7380", 12);
      var M = 420, last = null, ctx = c3.ctx; ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = 2.4;
      for (i = 0; i <= M; i++){ var tj = t * i / M, pp = P3(s.x(tj), s.v(tj) / vs, tj), ps = P3(s.x(tj), s.v(tj) / vs, 0); if (last){ ctx.strokeStyle = "hsl(" + (220 - 170 * tj / TT) + ",70%,45%)"; ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(pp[0], pp[1]); ctx.stroke(); ctx.strokeStyle = "rgba(15,27,45,.12)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(last[2], last[3]); ctx.lineTo(ps[0], ps[1]); ctx.stroke(); ctx.lineWidth = 2.4; } last = [pp[0], pp[1], ps[0], ps[1]]; }
      ctx.restore(); if (last) pt(c3, {X: function(v){ return v; }, Y: function(v){ return v; }}, last[0], last[1], P.red, 5.5);
      lab(c3, "Projection au sol : portrait de phase (x, v/ω₀)", 10, 14, "#6b7380", 11, "left");
      ro.set(0, F(s.A, 3)); ro.set(1, F(s.A / Am(0), 2) + " ×"); ro.set(2, F(s.ph * 180 / PI, 1) + "°"); ro.set(3, wr > 0 ? F(wr, 3) + " rad/s" : "pas de pic");
      nt.set(Z < 0.06 && Math.abs(Wv - w0) < 0.15 ? "Quasi-résonance (amortissement très faible) : l'amplitude permanente atteint " + F(s.A, 2) + " — mais il faut beaucoup de temps pour y arriver à partir du repos." : "Régime permanent : amplitude " + F(s.A, 3) + " (amplification maximale possible ≈ " + F(1 / (2 * Z * Math.sqrt(Math.max(1e-6, 1 - Z * Z))), 1) + " ×), déphasage " + F(s.ph * 180 / PI, 0) + "° (0° bien sous ω₀, 90° à ω₀, 180° bien au-dessus). Le transitoire décroît en e^(−" + F(Z * w0, 2) + "·t).", "");
    });
  }
});
})();
