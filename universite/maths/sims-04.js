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
/* Mathématiques BA1 · chapitre 4 : intégrales */
/* 1 ---- Riemann ---- */
var R1 = {
  x2: {n: "f(x) = x² sur [0 ; 3]", f: function(x){ return x * x; }, a: 0, b: 3, I: 9, y1: 10},
  sin: {n: "f(x) = sin x sur [0 ; π]", f: Math.sin, a: 0, b: PI, I: 2, y1: 1.4},
  exp: {n: "f(x) = eˣ sur [0 ; 2]", f: Math.exp, a: 0, b: 2, I: Math.exp(2) - 1, y1: 8},
  inv: {n: "f(x) = 1/x sur [1 ; 5]", f: function(x){ return 1 / x; }, a: 1, b: 5, I: Math.log(5), y1: 1.3},
  sqrt: {n: "f(x) = √x sur [0 ; 4]", f: Math.sqrt, a: 0, b: 4, I: 16 / 3, y1: 2.5}
};
SFA.sim({
  id: "um-c04-riemann", ch: "c04", tag: "Sommes de Riemann",
  titre: "L'intégrale comme limite de sommes de rectangles",
  resume: "Coupe [a ; b] en n bandes et verse l'aire de chaque rectangle dans l'éprouvette : la somme se rapproche du trait « intégrale exacte ». Glisse le point d'échantillonnage et compare les vitesses de convergence.",
  but: "Choisis la fonction, la méthode et n. « Remplir » verse les rectangles un à un dans l'éprouvette de droite. Glisse un point noir à l'intérieur d'un rectangle : tu passes en mode « libre » (point ξ placé à la fraction θ de chaque bande). En bas, l'erreur en fonction de n (échelles log) : la pente révèle 1/n ou 1/n². Défi : en mode libre, trouve θ qui donne l'intégrale à 0,1 % près.",
  aRetenir: "∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ f(ξᵢ)Δx avec Δx = (b − a)/n et ξᵢ dans la i-ème bande. Pour une fonction croissante, la somme de gauche sous-estime et celle de droite surestime ; leur erreur décroît comme 1/n, celle du point milieu et des trapèzes comme 1/n² (droite deux fois plus pentue en échelle log).",
  piege: "L'intégrale est une aire algébrique : la partie sous l'axe Ox compte négativement. Une aire (positive) s'obtient avec ∫|f|. Et le θ « parfait » trouvé pour un n ne marche plus pour un autre n.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.9}); lay2(c, 0.9, 1.3);
    var fs = k.select("Fonction", [["x2", "x² sur [0 ; 3]"], ["sin", "sin x sur [0 ; π]"], ["exp", "eˣ sur [0 ; 2]"], ["inv", "1/x sur [1 ; 5]"], ["sqrt", "√x sur [0 ; 4]"]], "x2", function(){ won = false; });
    var md = k.seg("Méthode", [["g", "Gauche"], ["d", "Droite"], ["m", "Milieu"], ["t", "Trapèzes"], ["l", "Libre θ"]], "g"), n = k.slider("Nombre n de bandes", 1, 100, 1, 6, "");
    var th = 0.3, fill = {on: false, p: 1}, won = false;
    var lp = k.loop(function(dt){ fill.p += dt * Math.max(0.6, 6 / n.value) * 0.5; if (fill.p >= 1){ fill.p = 1; lp.pause(); } k.redraw(); });
    k.button("▶ Remplir l'éprouvette", function(){ fill.p = 0; lp.play(); }, true);
    var ro = k.readouts(["Somme Sₙ", "Intégrale exacte I", "Erreur Sₙ − I", "Erreur relative"]), nt = k.note("", "");
    function theta(m){ return m === "g" ? 0 : m === "d" ? 1 : m === "m" ? 0.5 : th; }
    function sum(T, m, N){ var h = (T.b - T.a) / N, s = 0; for (var i = 0; i < N; i++){ var x0 = T.a + i * h; s += m === "t" ? (T.f(x0) + T.f(x0 + h)) / 2 : T.f(x0 + theta(m) * h); } return s * h; }
    var G = null, grab = false; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return; var T = R1[fs.value], N = n.value, h = (T.b - T.a) / N;
      if (t === "down"){ grab = false; var x = G.ix(p.x); if (x > T.a && x < T.b && p.y > G.T && p.y < G.B){ grab = true; md.set("l"); } }
      if ((t === "down" || t === "drag") && grab){ var x2 = G.ix(p.x), i = cl(Math.floor((x2 - T.a) / h), 0, N - 1); th = Math.round(cl((x2 - T.a - i * h) / h, 0, 1) * 1000) / 1000; md.set("l"); k.redraw(); }
      if (t === "up") grab = false;
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, T = R1[fs.value], N = n.value, h = (T.b - T.a) / N, m = md.value, H = c.H, h1 = Math.round(H * 0.62), gw = 64;
      var ax = axIn(c, {x: 0, y: 0, w: c.W - gw, h: h1}, {x0: T.a - (T.b - T.a) * 0.05, x1: T.b + (T.b - T.a) * 0.05, y0: -T.y1 * 0.06, y1: T.y1, xl: "x", yl: "y", t: 12, b: 26}); G = ax;
      var shown = Math.ceil(fill.p * N - 1e-9), part = 0, s = sum(T, m, N);
      for (var i = 0; i < N; i++){ var x0 = T.a + i * h, x1 = x0 + h, on = i < shown, y, ar;
        ctx.save(); ctx.globalAlpha = on ? 1 : 0.25; ctx.beginPath();
        if (m === "t"){ ctx.moveTo(ax.X(x0), ax.Y(0)); ctx.lineTo(ax.X(x0), ax.Y(T.f(x0))); ctx.lineTo(ax.X(x1), ax.Y(T.f(x1))); ctx.lineTo(ax.X(x1), ax.Y(0)); ctx.closePath(); ar = (T.f(x0) + T.f(x1)) / 2 * h; }
        else { y = T.f(x0 + theta(m) * h); ctx.rect(ax.X(x0), ax.Y(y), ax.X(x1) - ax.X(x0), ax.Y(0) - ax.Y(y)); ar = y * h; }
        ctx.fillStyle = i === shown - 1 && fill.p < 1 ? "rgba(224,122,31,.55)" : "rgba(194,106,12,.25)"; ctx.fill(); ctx.strokeStyle = P.amber; ctx.lineWidth = N > 40 ? 0.6 : 1.3; ctx.stroke(); ctx.restore();
        if (on) part += ar;
        if (m !== "t" && N <= 40){ var xs = x0 + theta(m) * h; D.dot(c, ax.X(xs), ax.Y(T.f(xs)), N > 20 ? 2.5 : 3.5, P.ink); D.line(c, ax.X(xs), ax.Y(0), ax.X(xs), ax.Y(T.f(xs)), "rgba(15,27,45,.25)", 1, [2, 3]); }
      }
      D.fn(c, ax, T.f, P.acc, 3);
      if (m === "l" && N <= 40){ var xh = T.a + th * h; hnd(c, ax.X(xh), ax.Y(T.f(xh)), P.ink, "θ = " + F(th, 2)); }
      /* éprouvette */
      var tx = c.W - gw + 18, tw = 26, tt = ax.T + 10, tb = ax.B, top = Math.max(T.I, s) * 1.2, lv = function(v){ return tb - v / top * (tb - tt); };
      ctx.save(); ctx.fillStyle = "rgba(194,106,12,.55)"; ctx.fillRect(tx, lv(Math.max(0, part)), tw, tb - lv(Math.max(0, part))); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, tt - 6); ctx.lineTo(tx, tb); ctx.lineTo(tx + tw, tb); ctx.lineTo(tx + tw, tt - 6); ctx.stroke(); ctx.restore();
      D.line(c, tx - 6, lv(T.I), tx + tw + 6, lv(T.I), P.green, 2.4); D.text(c, "I", tx + tw + 9, lv(T.I), {size: 12, color: P.green, align: "left", math: true});
      D.text(c, "Sₙ", tx + tw / 2, tt - 14, {size: 11, color: P.amber, math: true});
      /* erreur relative en fonction de n (log-log) */
      var bb = {x: 0, y: h1, w: c.W, h: H - h1}, xt = [[0, "1"], [Math.log10(2), "2"], [Math.log10(5), "5"], [1, "10"], [Math.log10(20), "20"], [Math.log10(50), "50"], [2, "100"]], yt = [[0, "100 %"], [-2, "1 %"], [-4, "0,01 %"], [-6, "10⁻⁴ %"], [-8, ""]];
      var ax2 = axBox(c, bb, {x0: 0, x1: 2, y0: -8, y1: 0.3, xt: xt, yt: yt, l: 54, t: 22, b: 30, xb: true});
      D.text(c, "n (échelle log)", ax2.R, ax2.B + 22, {size: 10.5, color: "#2c3a4e", align: "right"});
      D.text(c, "Erreur relative |Sₙ − I| / I", 8, h1 + 8, {size: 10.5, color: "#5f6b7a", align: "left", weight: 700});
      var meths = [["g", P.blue, "gauche"], ["m", P.green, "milieu"], ["t", P.violet, "trapèzes"]]; if (m === "d" || m === "l") meths.push([m, P.amber, m === "d" ? "droite" : "libre"]);
      meths.forEach(function(q){ ctx.save(); ctx.beginPath(); ctx.rect(ax2.L, ax2.T, ax2.R - ax2.L, ax2.B - ax2.T); ctx.clip(); ctx.strokeStyle = q[1]; ctx.lineWidth = q[0] === m ? 3 : 1.6; ctx.globalAlpha = q[0] === m ? 1 : 0.55; ctx.beginPath(); var st = false; for (var j = 1; j <= 100; j++){ var e = Math.abs(sum(T, q[0], j) - T.I) / T.I, ly = Math.log10(Math.max(e, 1e-12)); st ? ctx.lineTo(ax2.X(Math.log10(j)), ax2.Y(ly)) : ctx.moveTo(ax2.X(Math.log10(j)), ax2.Y(ly)); st = true; } ctx.stroke(); ctx.restore(); });
      D.legend(c, meths.map(function(q){ return [q[1], q[2]]; }), ax2.L + 6, ax2.B - 6 - meths.length * 17 - 10, {});
      var er = Math.abs(s - T.I) / T.I; D.dot(c, ax2.X(Math.log10(N)), ax2.Y(Math.log10(Math.max(er, 1e-12))), 5.5, P.red);
      ro.set(0, F(s, 5)); ro.set(1, F(T.I, 5)); ro.set(2, S.sci(s - T.I)); ro.set(3, F(er * 100, 3) + " %");
      if (m === "l"){ if (er < 1e-3){ won = true; nt.set("Défi réussi : avec θ = " + F(th, 3) + " et n = " + N + ", Sₙ = " + F(s, 4) + " colle à I = " + F(T.I, 4) + " (erreur " + F(er * 100, 3) + " %). Le théorème des valeurs intermédiaires garantit qu'un tel θ existe entre la somme de gauche et celle de droite. Change n : ce θ ne marche plus exactement !", "ok"); }
        else nt.set("Défi : glisse le point noir dans sa bande (θ entre 0 et 1) jusqu'à ce que Sₙ égale I à 0,1 % près. Actuellement " + (s < T.I ? "trop petit : " : "trop grand : ") + F(er * 100, 2) + " %.", "warn"); }
      else nt.set(m === "g" || m === "d" ? (T.f(T.a) < T.f(T.b) ? (m === "g" ? "f croissante : la somme de gauche sous-estime l'aire ; erreur en 1/n (droite de pente −1 en bas)." : "f croissante : la somme de droite surestime l'aire ; erreur en 1/n.") : (m === "g" ? "f décroissante : la somme de gauche surestime l'aire." : "f décroissante : la somme de droite sous-estime l'aire.")) + " Glisse un point noir pour le mode libre (défi)." : "Le point milieu et les trapèzes compensent en partie les erreurs : leur courbe d'erreur descend deux fois plus vite (pente −2 : erreur en 1/n²).", "");
    });
  }
});

/* 2 ---- théorème fondamental ---- */
var F2 = {
  cos: {n: "f(x) = cos x", f: Math.cos, a: 0, x1: 2 * PI, yf: 1.6, yF: 1.6, G: "F(x) = sin x"},
  quad: {n: "f(x) = x² − 1", f: function(x){ return x * x - 1; }, a: 0, x1: 3, yf: 9, yF: 7, G: "F(x) = x³/3 − x"},
  gauss: {n: "f(x) = e^(−x²)", f: function(x){ return Math.exp(-x * x); }, a: 0, x1: 3, yf: 1.2, yF: 1, G: "pas de primitive élémentaire (loi normale !)"},
  arct: {n: "f(x) = 1/(1 + x²)", f: function(x){ return 1 / (1 + x * x); }, a: 0, x1: 5, yf: 1.2, yF: 1.6, G: "F(x) = arctan x"}
};
SFA.sim({
  id: "um-c04-theoreme-fondamental", ch: "c04", tag: "Théorème fondamental",
  titre: "Aire accumulée et pente : le théorème fondamental du calcul",
  resume: "Fais glisser x : l'aire sous f de a à x (en haut) est l'ordonnée de F (en bas), et la pente de F en x est exactement f(x).",
  but: "Choisis f et déplace x. En haut, l'aire hachurée A(x) = ∫ₐˣ f ; en bas, la courbe de A. La tangente de A en x a pour pente f(x) : vérifie-le dans la lecture chiffrée.",
  aRetenir: "Si F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt, alors F′(x) = f(x) : F est une primitive de f. Conséquence : ∫<sub>a</sub><sup>b</sup> f = G(b) − G(a) pour n'importe quelle primitive G. Là où f > 0, F croît ; là où f < 0, F décroît.",
  piege: "Les primitives sont définies à une constante près : F(x) = x³/3 − x + C. Et certaines fonctions continues (e^(−x²)) n'ont pas de primitive exprimable avec les fonctions usuelles, mais F existe quand même.",
  build: function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), fs = k.select("Fonction", [["cos", "cos x"], ["quad", "x² − 1"], ["gauss", "e^(−x²)"], ["arct", "1/(1 + x²)"]], "cos", function(){ xs.el.max = F2[fs.value].x1; xs.set(Math.min(F2[fs.value].x1 * 0.4, F2[fs.value].x1)); });
    var xs = k.slider("Position x", 0.05, 2 * PI, 0.01, 1.8, ""); var ro = k.readouts(["Aire F(x) = ∫₀ˣ f", "f(x)", "Pente de F en x", "Primitive"]);
    c1.pointer(function(t, p){ if ((t === "down" || t === "drag") && c1._ax){ xs.set(c1._ax.ix(p.x)); k.redraw(); } });
    k.draw(function(){
      c1.clear(); c2.clear(); var T = F2[fs.value], X = Math.min(xs.value, T.x1), Fx = function(x){ return simpson(T.f, 0, x, 300); }, ctx = c1.ctx;
      var ymin = fs.value === "quad" ? -2 : fs.value === "cos" ? -1.6 : -0.2;
      var ax1 = D.axes(c1, {x0: -0.2, x1: T.x1, y0: ymin, y1: T.yf, hideZero: false, yl: "f"}); c1._ax = ax1; fillArea(c1, ax1, T.f, function(){ return 0; }, 0, X, "rgba(180,83,9,.30)"); D.fn(c1, ax1, T.f, P.acc, 3); vl(c1, ax1, X, P.amber, [5, 4], 1.5); pt(c1, ax1, X, T.f(X), P.red, 5);
      var ymin2 = fs.value === "quad" ? -1.5 : fs.value === "cos" ? -1.6 : -0.2, ax2 = D.axes(c2, {x0: -0.2, x1: T.x1, y0: ymin2, y1: T.yF, hideZero: false, yl: "F"}); D.fn(c2, ax2, function(x){ return x < 0 ? NaN : Fx(x); }, P.amber, 3); vl(c2, ax2, X, P.amber, [5, 4], 1.5);
      var fx = T.f(X), Fv = Fx(X); pt(c2, ax2, X, Fv, P.red, 6); var dx = (ax2.x1 - ax2.x0) * 0.14; D.fn(c2, ax2, function(x){ return Fv + fx * (x - X); }, P.red, 2, [6, 4]);
      var sl = (Fx(X + 1e-3) - Fx(X - 1e-3)) / 2e-3; ro.set(0, F(Fv, 4)); ro.set(1, F(fx, 4)); ro.set(2, F(sl, 4)); ro.set(3, T.G);
    });
  }
});

/* 3 ---- aire entre courbes ---- */
var C3 = {
  par: {n: "x² et x + 2", f: function(x){ return x * x; }, g: function(x){ return x + 2; }, x0: -2, x1: 3, y0: -1, y1: 6, a: -1, b: 2, ex: 4.5},
  rac: {n: "√x et x²", f: function(x){ return Math.sqrt(x); }, g: function(x){ return x * x; }, x0: -0.2, x1: 1.4, y0: -0.2, y1: 1.5, a: 0, b: 1, ex: 1 / 3},
  sc: {n: "sin x et cos x", f: Math.sin, g: Math.cos, x0: -0.3, x1: 6.5, y0: -1.4, y1: 1.4, a: PI / 4, b: 5 * PI / 4, ex: 2 * Math.SQRT2},
  cub: {n: "x et x³", f: function(x){ return x; }, g: function(x){ return x * x * x; }, x0: -1.6, x1: 1.6, y0: -1.8, y1: 1.8, a: -1, b: 1, ex: 0.5}
};
SFA.sim({
  id: "um-c04-aire-entre-courbes", ch: "c04", tag: "Aire entre deux courbes",
  titre: "Aire entre deux courbes : intégrale algébrique contre aire géométrique",
  resume: "Une tranche verticale balaie l'espace entre deux courbes : vert quand f est au-dessus, rouge sinon. Deux compteurs cumulent ∫(f − g) et ∫|f − g| ; glisse les bornes pour les faire diverger.",
  but: "Glisse les bornes a et b (poignées sur l'axe ; elles s'aimantent aux points d'intersection). « Balayer » fait défiler une tranche de hauteur f − g ; en bas, ses deux cumuls : l'intégrale algébrique (violet) et l'aire (noir). Défi 1 : place a et b sur deux intersections consécutives. Défi 2 : obtiens ∫(f − g) = 0 avec une aire d'au moins 0,5.",
  aRetenir: "Aire = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx : on découpe aux points d'intersection (solutions de f = g) et on intègre « haut − bas » sur chaque morceau. Si f ≥ g sur [a ; b], l'aire est ∫(f − g). La tranche verticale de hauteur f(x) − g(x) et de largeur dx est l'élément d'aire.",
  piege: "∫(x − x³) dx sur [−1 ; 1] vaut 0 (les deux boucles se compensent) alors que l'aire vaut 1/2.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.9}); lay2(c, 0.9, 1.3);
    var DOM = {par: [-2, 3], rac: [0, 1.4], sc: [-0.3, 6.5], cub: [-1.6, 1.6]}, st = {a: -1, b: 2, sw: 1}, dfi = 0, wins = 0, won = false;
    var fs = k.select("Couple de courbes", [["par", "x² et x + 2"], ["rac", "√x et x²"], ["sc", "sin x et cos x"], ["cub", "x et x³"]], "par", function(v){ var T = C3[v]; st.a = T.a; st.b = T.b; st.sw = 1; won = false; });
    var lp = k.loop(function(dt){ st.sw += dt * 0.35; if (st.sw >= 1){ st.sw = 1; lp.pause(); } k.redraw(); });
    k.button("▶ Balayer de a à b", function(){ st.sw = 0; lp.play(); }, true);
    k.button("Défi suivant", function(){ dfi = dfi % 2 + 1; won = false; });
    var ro = k.readouts(["∫(f − g) (algébrique)", "Aire ∫|f − g|", "Intersections f = g", "Écart aire − intégrale"]), nt = k.note("", "");
    function inter(T, dom){ var out = [], N = 600, d = function(x){ return T.f(x) - T.g(x); }, p = d(dom[0]); if (Math.abs(p) < 1e-12) out.push(dom[0]); for (var i = 1; i <= N; i++){ var x = dom[0] + (dom[1] - dom[0]) * i / N, q = d(x); if (Math.abs(q) < 1e-12) out.push(x); else if (p * q < 0){ var lo = x - (dom[1] - dom[0]) / N, hi = x; for (var j = 0; j < 50; j++){ var mm = (lo + hi) / 2; if (d(lo) * d(mm) <= 0) hi = mm; else lo = mm; } out.push((lo + hi) / 2); } p = q; } return out.filter(function(v, i, a){ return !i || Math.abs(v - a[i - 1]) > 1e-6; }); }
    var G = null, grab = null; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return; var T = C3[fs.value], dom = DOM[fs.value];
      if (t === "down"){ grab = null; var da = Math.abs(G.X(st.a) - p.x), db = Math.abs(G.X(st.b) - p.x); if (Math.min(da, db) < 22 && p.y > G.T && p.y < G.B) grab = da <= db ? "a" : "b"; }
      else if (t === "drag" && grab){ var x = cl(G.ix(p.x), dom[0], dom[1]); inter(T, dom).forEach(function(q){ if (Math.abs(G.X(q) - G.X(x)) < 10) x = q; }); st[grab] = x; st.sw = 1; k.redraw(); }
      else if (t === "up") grab = null;
      else if (t === "move") c.cv.style.cursor = (Math.abs(G.X(st.a) - p.x) < 22 || Math.abs(G.X(st.b) - p.x) < 22) ? "ew-resize" : "default";
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, T = C3[fs.value], dom = DOM[fs.value], A = Math.min(st.a, st.b), B = Math.max(st.a, st.b), H = c.H, h1 = Math.round(H * 0.6);
      var d = function(x){ return T.f(x) - T.g(x); }, xc = A + (B - A) * st.sw, its = inter(T, dom);
      var ax = axIn(c, {x: 0, y: 0, w: c.W, h: h1}, {x0: T.x0, x1: T.x1, y0: T.y0, y1: T.y1, xl: "x", yl: "y", t: 12, b: 26}); G = ax;
      var n = 300; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      for (var i = 0; i < n; i++){ var x0 = A + (B - A) * i / n, x1 = A + (B - A) * (i + 1) / n, xm = (x0 + x1) / 2; if (xm > xc) break; ctx.fillStyle = d(xm) >= 0 ? "rgba(36,119,90,.30)" : "rgba(192,50,29,.28)"; ctx.beginPath(); ctx.moveTo(ax.X(x0), ax.Y(T.f(x0))); ctx.lineTo(ax.X(x1), ax.Y(T.f(x1))); ctx.lineTo(ax.X(x1), ax.Y(T.g(x1))); ctx.lineTo(ax.X(x0), ax.Y(T.g(x0))); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      D.fn(c, ax, function(x){ return x < dom[0] - 1e-9 ? NaN : T.f(x); }, P.acc, 3); D.fn(c, ax, T.g, P.violet, 3);
      if (st.sw < 1){ var w = Math.max(4, (ax.X(B) - ax.X(A)) / 40), up = d(xc) >= 0; ctx.save(); ctx.fillStyle = up ? P.green : P.red; ctx.globalAlpha = 0.8; ctx.fillRect(ax.X(xc) - w / 2, ax.Y(Math.max(T.f(xc), T.g(xc))), w, Math.abs(ax.Y(T.f(xc)) - ax.Y(T.g(xc)))); ctx.restore(); D.label(c, "f − g = " + F(d(xc), 2), ax.X(xc), ax.Y(Math.max(T.f(xc), T.g(xc))) - 14, {color: up ? P.green : P.red, size: 10.5}); }
      its.forEach(function(q){ if (q >= T.x0 && q <= T.x1) D.dot(c, ax.X(q), ax.Y(T.f(q)), 4, P.ink); });
      hnd(c, ax.X(A), ax.Y(0), P.amber, "a"); hnd(c, ax.X(B), ax.Y(0), P.amber, "b");
      D.label(c, "f(x) = " + T.n.split(" et ")[0], ax.L + 8, ax.T + 10, {color: P.acc, align: "left", math: true, size: 12}); D.label(c, "g(x) = " + T.n.split(" et ")[1], ax.L + 8, ax.T + 30, {color: P.violet, align: "left", math: true, size: 12});
      /* cumuls I(x) et A(x) */
      var NN = 160, Ic = [0], Ac = [0], hx = (B - A) / NN; for (i = 0; i < NN; i++){ var xa = A + i * hx, xb = xa + hx, m1 = d(xa), m2 = d((xa + xb) / 2), m3 = d(xb); Ic.push(Ic[i] + hx * (m1 + 4 * m2 + m3) / 6); Ac.push(Ac[i] + hx * (Math.abs(m1) + 4 * Math.abs(m2) + Math.abs(m3)) / 6); }
      var alg = Ic[NN], geo = Ac[NN], top = Math.max(geo, Math.abs(alg), 0.2) * 1.15, lo = Math.min(0, Math.min.apply(null, Ic)) * 1.15 - top * 0.05;
      var ax2 = axIn(c, {x: 0, y: h1, w: c.W, h: H - h1}, {x0: T.x0, x1: T.x1, y0: lo, y1: top, xl: "x", t: 20, b: 24});
      D.text(c, "Cumuls depuis a : ∫(f − g) (violet) et aire ∫|f − g| (noir)", 8, h1 + 8, {size: 10.5, color: "#5f6b7a", align: "left", weight: 700});
      var upto = Math.round(NN * st.sw);
      [[Ic, P.violet], [Ac, P.ink]].forEach(function(pr){ ctx.save(); ctx.strokeStyle = pr[1]; ctx.lineWidth = 2.6; ctx.beginPath(); for (var j = 0; j <= upto; j++){ var X = ax2.X(A + j * hx), Y = ax2.Y(pr[0][j]); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); D.dot(c, ax2.X(A + upto * hx), ax2.Y(pr[0][upto]), 4.5, pr[1]); });
      ro.set(0, F(alg, 4)); ro.set(1, F(geo, 4)); ro.set(2, its.length ? its.map(function(q){ return F(q, 3); }).join(" ; ") : "aucune"); ro.set(3, F(geo - alg, 4));
      if (dfi === 1){ var ok1 = false; for (i = 0; i + 1 < its.length; i++) if (Math.abs(A - its[i]) < 1e-6 && Math.abs(B - its[i + 1]) < 1e-6) ok1 = true;
        if (ok1){ if (!won){ won = true; wins++; } nt.set("Défi 1 réussi : entre deux intersections consécutives, f − g garde un signe, donc l'aire vaut |∫(f − g)| = " + F(geo, 4) + (Math.abs(geo - T.ex) < 1e-3 ? " (valeur exacte " + F(T.ex, 4) + ")." : "."), "ok"); }
        else { won = false; nt.set("Défi 1 : glisse a puis b sur deux points d'intersection consécutifs (points noirs : les poignées s'y aimantent).", "warn"); } }
      else if (dfi === 2){ var ok2 = Math.abs(alg) < 0.01 && geo >= 0.5;
        if (ok2){ if (!won){ won = true; wins++; } nt.set("Défi 2 réussi : ∫(f − g) = " + F(alg, 3) + " mais l'aire vaut " + F(geo, 3) + ". Les parties vertes et rouges se compensent exactement.", "ok"); }
        else { won = false; nt.set("Défi 2 : obtiens ∫(f − g) = 0 (à 0,01 près) avec une aire d'au moins 0,5 : il faut que [a ; b] contienne une partie verte et une partie rouge de même aire. Actuellement ∫ = " + F(alg, 3) + ", aire = " + F(geo, 3) + "." + (fs.value === "rac" ? " (Impossible avec √x et x² dans cette fenêtre : la partie rouge est trop petite. Change de couple.)" : ""), "warn"); } }
      else nt.set(Math.abs(alg - geo) > 1e-3 ? "Attention : les deux signes se compensent partiellement. L'intégrale algébrique " + F(alg, 3) + " ne donne pas l'aire " + F(geo, 3) + ". Clique « Défi suivant »." : "f ≥ g (ou g ≥ f) partout sur [a ; b] : l'intégrale et l'aire coïncident (au signe près). Clique « Défi suivant ».", Math.abs(alg - geo) > 1e-3 ? "warn" : "ok");
    });
  }
});

/* 4 ---- volumes de révolution (3D) ---- */
var S4 = {
  cone: {n: "Cône : f(x) = x sur [0 ; 3]", f: function(x){ return x; }, a: 0, b: 3, V: 9 * PI, nm: "cône", fm: "π∫₀³ x² dx = 9π"},
  sph: {n: "Sphère de rayon 3 : f(x) = √(9 − x²)", f: function(x){ return Math.sqrt(Math.max(0, 9 - x * x)); }, a: -3, b: 3, V: 36 * PI, nm: "sphère", fm: "π∫₋₃³ (9 − x²) dx = 36π = 4πr³/3"},
  par: {n: "Paraboloïde : f(x) = √x sur [0 ; 4]", f: function(x){ return Math.sqrt(x); }, a: 0, b: 4, V: 8 * PI, nm: "paraboloïde", fm: "π∫₀⁴ x dx = 8π"},
  vase: {n: "Vase : f(x) = 1 + 0,6·sin(1,5x) sur [0 ; 4]", f: function(x){ return 1 + 0.6 * Math.sin(1.5 * x); }, a: 0, b: 4, V: null, nm: "vase", fm: "π∫₀⁴ f(x)² dx (intégrale numérique)"}
};
SFA.sim({
  id: "um-c04-volumes-revolution", ch: "c04", tag: "Volumes de révolution (3D)",
  titre: "Volume d'un solide de révolution : empiler des disques",
  resume: "Fais tourner la courbe autour de l'axe Ox : le solide est une pile de disques d'aire πf(x)². Tourne la vue à la souris et fais varier le nombre de disques.",
  but: "Fais glisser la souris sur la vue 3D pour tourner. Choisis le solide, déplace le disque orange et augmente le nombre de disques empilés : le volume approché converge vers π∫f².",
  aRetenir: "V = π ∫<sub>a</sub><sup>b</sup> [f(x)]² dx (méthode des disques). Cône de rayon r et hauteur h : V = πr²h/3. Sphère : V = 4πr³/3. Chaque tranche d'épaisseur dx est un disque de volume πf(x)²dx.",
  piege: "On élève f au carré, pas la primitive : π(∫f)² ≠ π∫f². Et le résultat est en unités de longueur au cube (cm³).",
  build: function(k, S){
    var c = k.canvas(330), c2 = k.canvas(150), st = {az: 0.62, el: 0.38, drag: false, lx: 0, ly: 0}, MAT = [30, 63, 143];
    (function(){ var r0 = c.resize; c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < 560) ? 0.95 : 0.66; r0(); }; c.resize(); })();
    var fs = k.select("Solide", [["cone", "Cône"], ["sph", "Sphère"], ["par", "Paraboloïde"], ["vase", "Vase"]], "cone", function(v){ var T = S4[v]; sx.el.min = T.a; sx.el.max = T.b; sx.set((T.a + T.b) / 2 + (T.b - T.a) * 0.15); });
    var sx = k.slider("Position du disque x", 0, 4, 0.01, 1.5, ""), nd = k.slider("Nombre de disques empilés", 1, 40, 1, 8, ""), show = k.toggle("Afficher la pile de disques", true), cut = k.toggle("Vue en coupe (demi-solide)", false);
    var ro = k.readouts(["Rayon f(x)", "Aire du disque πf(x)²", "Volume exact", "Volume de la pile", "Erreur de la pile"]), nt = k.note("", "ok");
    var lp = k.loop(function(dt){ if (!st.drag) st.az += dt * 0.2; k.redraw(); }); lp.play();
    k.button("Défi : erreur < 1 %", function(){ nd.set(1); show.set(true); lp.pause(); }, false);
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, p){ if (t === "down"){ st.drag = true; st.lx = p.x; st.ly = p.y; lp.pause(); } else if (t === "drag"){ st.az += (p.x - st.lx) * 0.012; st.el = cl(st.el + (p.y - st.ly) * 0.01, -1.2, 1.2); st.lx = p.x; st.ly = p.y; k.redraw(); } else if (t === "up"){ st.drag = false; } });
    function proj(x, y, z, cx, cy, s){ var ca = Math.cos(st.az), sa = Math.sin(st.az), ce = Math.cos(st.el), se = Math.sin(st.el), X = x * ca - y * sa, Y = x * sa + y * ca; return [cx + s * X, cy - s * (z * ce + Y * se), Y * ce - z * se]; }
    function shade(nx, ny, nz){ var ca = Math.cos(st.az), sa = Math.sin(st.az), ce = Math.cos(st.el), se = Math.sin(st.el), Xn = nx * ca - ny * sa, Yn = nx * sa + ny * ca, tw = nz * se - Yn * ce, up = nz * ce + Yn * se; var v = 0.42 + 0.34 * Math.abs(tw) + 0.2 * up - 0.1 * Xn; return cl(v, 0.12, 1); }
    k.draw(function(){
      c.clear(); c2.clear(); var T = S4[fs.value], ctx = c.ctx, a = T.a, b = T.b, mid = (a + b) / 2, rmax = 0, i, j; for (i = 0; i <= 60; i++) rmax = Math.max(rmax, T.f(a + (b - a) * i / 60));
      var s = Math.min(c.W * 0.86 / (b - a + 0.6), c.H * 0.9 / (2 * rmax + 0.4)), cx = c.W / 2, cy = c.H / 2 + 6, X0 = mid;
      var X = sx.value, n = nd.value, h = (b - a) / n;
      function ring(x, r, col, w, fill, th0, th1){ th0 = th0 == null ? 0 : th0; th1 = th1 == null ? 2 * PI : th1; ctx.beginPath(); for (var q = 0; q <= 56; q++){ var th = th0 + (th1 - th0) * q / 56, p = proj(x - X0, r * Math.cos(th), r * Math.sin(th), cx, cy, s); q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (col){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); } }
      var a0 = proj(a - X0 - 0.5, 0, 0, cx, cy, s), a1 = proj(b - X0 + 0.7, 0, 0, cx, cy, s); D.line(c, a0[0], a0[1], a1[0], a1[1], "#9aa5b4", 1.4, [4, 4]); D.text(c, "x", a1[0] + 9, a1[1], {size:13, color:P.grey, math:true});
      /* surface : facettes triées de l'arrière vers l'avant */
      var NX = 40, NT = 36, quads = [], th0 = cut.value ? PI : 0, th1 = 2 * PI;
      for (i = 0; i < NX; i++){ var xa = a + (b - a) * i / NX, xb = a + (b - a) * (i + 1) / NX, fa = T.f(xa), fb = T.f(xb), fm = (fa + fb) / 2, dfx = (fb - fa) / (xb - xa);
        for (j = 0; j < NT; j++){ var t0 = th0 + (th1 - th0) * j / NT, t1 = th0 + (th1 - th0) * (j + 1) / NT, tm = (t0 + t1) / 2;
          var p1 = proj(xa - X0, fa * Math.cos(t0), fa * Math.sin(t0), cx, cy, s), p2 = proj(xb - X0, fb * Math.cos(t0), fb * Math.sin(t0), cx, cy, s), p3 = proj(xb - X0, fb * Math.cos(t1), fb * Math.sin(t1), cx, cy, s), p4 = proj(xa - X0, fa * Math.cos(t1), fa * Math.sin(t1), cx, cy, s);
          var nl = Math.hypot(dfx, 1), sh = shade(-dfx / nl, Math.cos(tm) / nl, Math.sin(tm) / nl);
          quads.push({p:[p1, p2, p3, p4], d:(p1[2] + p2[2] + p3[2] + p4[2]) / 4, sh:sh}); } }
      quads.sort(function(u, v){ return v.d - u.d; });
      if (cut.value){ /* plan de coupe z = 0 : profil plein */
        ctx.beginPath(); for (i = 0; i <= 40; i++){ var xq = a + (b - a) * i / 40, pq = proj(xq - X0, T.f(xq), 0, cx, cy, s); i ? ctx.lineTo(pq[0], pq[1]) : ctx.moveTo(pq[0], pq[1]); } for (i = 40; i >= 0; i--){ var xq2 = a + (b - a) * i / 40, pq2 = proj(xq2 - X0, -T.f(xq2), 0, cx, cy, s); ctx.lineTo(pq2[0], pq2[1]); } ctx.closePath(); ctx.fillStyle = "rgba(244,197,66,.35)"; ctx.fill(); ctx.strokeStyle = "rgba(194,106,12,.8)"; ctx.lineWidth = 1.4; ctx.stroke(); }
      quads.forEach(function(q){ var v = q.sh, r = Math.round(205 - (205 - MAT[0]) * (1 - v) * 1.05), g = Math.round(220 - (220 - MAT[1]) * (1 - v) * 1.05), bl = Math.round(248 - (248 - MAT[2]) * (1 - v) * 1.05), col = "rgba(" + r + "," + g + "," + bl + ",.94)"; ctx.beginPath(); ctx.moveTo(q.p[0][0], q.p[0][1]); for (var m = 1; m < 4; m++) ctx.lineTo(q.p[m][0], q.p[m][1]); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 0.6; ctx.stroke(); });
      if (cut.value){ ctx.beginPath(); for (i = 0; i <= 40; i++){ var xr = a + (b - a) * i / 40, pr2 = proj(xr - X0, T.f(xr), 0, cx, cy, s); i ? ctx.lineTo(pr2[0], pr2[1]) : ctx.moveTo(pr2[0], pr2[1]); } ctx.strokeStyle = "rgba(194,106,12,.9)"; ctx.lineWidth = 2; ctx.stroke(); }
      if (show.value){ for (i = 0; i < n; i++){ var xl = a + i * h, r = T.f(xl + h / 2); ring(xl, r, "rgba(194,106,12,.85)", 1.3, null, th0, th1); ring(xl + h, r, "rgba(194,106,12,.85)", 1.3, i === n - 1 ? "rgba(244,197,66,.28)" : null, th0, th1); } }
      ring(X, T.f(X), P.red, 2.8, "rgba(192,50,29,.28)", th0, th1); var pr = proj(X - X0, 0, 0, cx, cy, s); D.dot(c, pr[0], pr[1], 4, P.red);
      D.label(c, T.nm, 10, 10, {color:P.mat, align:"left", base:"top", size:13}); D.text(c, "glisse pour tourner", c.W - 10, c.H - 12, {size:10.5, color:P.grey, align:"right"});
      /* profil et rectangles des disques */
      var ax = D.axes(c2, {x0: a - 0.2, x1: b + 0.2, y0: -rmax * 1.2, y1: rmax * 1.2, hideZero: false, yl: "profil", t: 6, b: 24});
      if (show.value){ for (i = 0; i < n; i++){ var xl2 = a + i * h, rm = T.f(xl2 + h / 2); c2.ctx.fillStyle = "rgba(244,197,66,.32)"; c2.ctx.fillRect(ax.X(xl2), ax.Y(rm), ax.X(xl2 + h) - ax.X(xl2), ax.Y(-rm) - ax.Y(rm)); c2.ctx.strokeStyle = "rgba(194,106,12,.7)"; c2.ctx.lineWidth = 1; c2.ctx.strokeRect(ax.X(xl2), ax.Y(rm), ax.X(xl2 + h) - ax.X(xl2), ax.Y(-rm) - ax.Y(rm)); } }
      D.fn(c2, ax, T.f, P.acc, 2.8); D.fn(c2, ax, function(x){ return -T.f(x); }, "rgba(31,75,158,.4)", 1.8, [4, 3]); vl(c2, ax, X, P.red, [4, 3], 1.8);
      var Vex = T.V === null ? PI * simpson(function(x){ var v = T.f(x); return v * v; }, a, b, 600) : T.V, Vs = 0; for (i = 0; i < n; i++){ var rr = T.f(a + (i + 0.5) * h); Vs += PI * rr * rr * h; }
      var err = Math.abs(Vs - Vex) / Vex * 100;
      ro.set(0, F(T.f(X), 3)); ro.set(1, F(PI * T.f(X) * T.f(X), 3)); ro.set(2, F(Vex, 3) + " (" + (T.V === null ? "num." : "exact") + ")"); ro.set(3, show.value ? F(Vs, 3) + " (n = " + n + ")" : "—"); ro.set(4, show.value ? F(err, 2) + " %" : "—");
      nt.set(show.value ? (err < 1 ? "Erreur " + F(err, 2) + " % avec n = " + n + " disques : objectif atteint (moins de 1 %). Plus n est grand, plus la pile épouse le solide." : "Avec n = " + n + " disques l'erreur est " + F(err, 1) + " %. Défi : trouve le plus petit n qui donne moins de 1 %.") : "Active « Afficher la pile de disques » pour comparer la pile au volume exact.", show.value && err < 1 ? "ok" : "");
    });
  }
});

/* 5 ---- AUC pharmacocinétique + valeur moyenne ---- */
SFA.sim({
  id: "um-c04-auc-pharmaco", ch: "c04", tag: "Aire sous la courbe, valeur moyenne",
  titre: "Aire sous la courbe de concentration (AUC) et concentration moyenne",
  resume: "Un comprimé se dissout dans l'intestin, le médicament passe dans le sang puis est éliminé par les reins. La courbe de concentration se trace en direct ; l'aire sous la courbe mesure l'exposition, le rectangle de même aire donne la moyenne.",
  but: "Lance la prise : les points du schéma représentent le médicament (1 point ≈ 10 mg) dans l'intestin, le sang et l'urine. Glisse le curseur de temps ou l'horizon T directement sur le graphe. Défi : règle la dose et les constantes pour atteindre l'exposition ou la moyenne demandée.",
  aRetenir: "C(t) = [D·kₐ/(V(kₐ − kₑ))]·(e<sup>−kₑt</sup> − e<sup>−kₐt</sup>). AUC(0 → T) = ∫₀ᵀ C dt ; AUC(0 → ∞) = D/(V·kₑ) = D/Cl (clairance Cl = V·kₑ). Valeur moyenne de C sur [0 ; T] : (1/T) ∫₀ᵀ C(t) dt = AUC/T : le rectangle de hauteur moyenne a la même aire que la courbe. Intégrale impropre : ∫₀^∞ e<sup>−kt</sup> dt = 1/k.",
  piege: "L'AUC dépend de la dose et de la clairance, pas de la vitesse d'absorption : changer kₐ modifie le pic mais pas D/(V·kₑ). Modèle simplifié à un compartiment, absorption complète (biodisponibilité 100 %).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.95}); lay2(c, 0.95, 1.4);
    var Dd = k.slider("Dose D", 100, 1000, 50, 500, "mg"), ka = k.slider("Absorption kₐ", 0.3, 3, 0.1, 1.2, "h⁻¹"), ke = k.slider("Élimination kₑ", 0.05, 0.6, 0.01, 0.2, "h⁻¹"), V = k.slider("Volume de distribution V", 20, 80, 5, 40, "L"), T = k.slider("Horizon T", 1, 24, 0.5, 12, "h");
    var mv = k.toggle("Montrer le rectangle de valeur moyenne", true);
    var tn = 0, lp = k.loop(function(dt){ tn += dt * 2.2; if (tn >= 24){ tn = 24; lp.pause(); } k.redraw(); });
    k.button("▶ Prendre le comprimé", function(){ tn = 0; lp.play(); }, true);
    var TG = [["auc", 100, 0, "AUC(0 → ∞) = 100 mg·h/L (± 2)"], ["moy", 5, 12, "concentration moyenne 5 mg/L sur [0 ; 12 h] (± 0,1)"], ["auc", 50, 0, "AUC(0 → ∞) = 50 mg·h/L avec un pic sous 6 mg/L"]], ti = -1, won = false, wins = 0;
    k.button("Défi suivant", function(){ ti = (ti + 1) % TG.length; won = false; if (TG[ti][2]) T.set(TG[ti][2]); });
    var ro = k.readouts(["C max (à t max)", "AUC(0 → T)", "AUC(0 → ∞) = D/(V·kₑ)", "Moyenne sur [0 ; T]"]), nt = k.note("", ""); lp.play();
    var R = rnd(5), dots = []; for (var i = 0; i < 100; i++) dots.push([R(), R(), R() * 6.283]);
    var G = null, grab = null; c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return;
      if (t === "down"){ grab = null; if (p.y > G.T - 10 && p.y < G.B + 10){ grab = Math.abs(G.X(T.value) - p.x) < 14 ? "T" : "t"; lp.pause(); } }
      if ((t === "down" || t === "drag") && grab){ var x = cl(G.ix(p.x), 0, 24); if (grab === "T") T.set(Math.max(1, Math.round(x * 2) / 2)); else tn = x; k.redraw(); }
      if (t === "up") grab = null;
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, d = Dd.value, a = ka.value, e = ke.value, v = V.value, TT = T.value; if (Math.abs(a - e) < 0.03) a = e + 0.03;
      var A = d * a / (v * (a - e)), C = function(t){ return t < 0 ? 0 : A * (Math.exp(-e * t) - Math.exp(-a * t)); }, tm = Math.log(a / e) / (a - e), Cm = C(tm);
      var auc = A * ((1 - Math.exp(-e * TT)) / e - (1 - Math.exp(-a * TT)) / a), aucInf = d / (v * e), moy = auc / TT;
      var H = c.H, h1 = Math.round(H * 0.42), W = c.W, t = tn;
      var gut = d * Math.exp(-a * t), blood = v * C(t), out = Math.max(0, d - gut - blood);
      /* --- schéma : intestin → sang → reins / urine --- */
      var bw = Math.min(150, (W - 60) / 3), gy = 30, bh = h1 - 64, xs = [14, (W - bw) / 2, W - bw - 14];
      var boxes = [["INTESTIN", "#f1d9b5", "#b07a3c", gut], ["SANG (V = " + F(v, 0) + " L)", "#f6d0cc", "#b42318", blood], ["URINE (éliminé)", "#f4ecbf", "#9a7d12", out]];
      boxes.forEach(function(bx, j){ var x = xs[j]; D.panel(c, x, gy, bw, bh, {fill: bx[1], stroke: bx[2], radius: 14, shadow: true}); D.text(c, bx[0], x + bw / 2, gy - 10, {size: 10, color: bx[2], weight: 800});
        var nd = Math.min(100, Math.round(bx[3] / 10)), cols = j === 1 ? "#8d1b10" : j === 0 ? "#6236c4" : "#6236c4";
        for (var q = 0; q < nd; q++){ var p = dots[q], jx = Math.sin(t * 3 + p[2] + j) * 2.5, jy = Math.cos(t * 2.3 + p[2] * 1.7) * 2.5; D.dot(c, x + 10 + p[0] * (bw - 20) + jx, gy + 12 + p[1] * (bh - 24) + jy, 2.6, cols); }
        D.text(c, F(bx[3], 0) + " mg", x + bw / 2, gy + bh + 12, {size: 11, color: bx[2], weight: 800}); });
      if (gut > 5){ var px = xs[0] + bw * 0.25, py = gy + bh * 0.3, sz = 6 + 10 * gut / d; ctx.save(); ctx.translate(px, py); ctx.rotate(-0.5); D.rrect(c, -sz, -sz * 0.45, 2 * sz, 0.9 * sz, sz * 0.45); ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.strokeStyle = "#6236c4"; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore(); }
      var fl1 = a * gut, fl2 = e * blood;
      D.arrow(c, xs[0] + bw + 4, gy + bh / 2, xs[1] - 4, gy + bh / 2, "#6236c4", 1.5 + Math.min(5, fl1 / 60)); D.text(c, "kₐ", (xs[0] + bw + xs[1]) / 2, gy + bh / 2 - 12, {size: 12, color: "#6236c4", math: true, halo: true});
      D.arrow(c, xs[1] + bw + 4, gy + bh / 2, xs[2] - 4, gy + bh / 2, "#9a7d12", 1.5 + Math.min(5, fl2 / 60)); D.text(c, "kₑ (reins)", (xs[1] + bw + xs[2]) / 2, gy + bh / 2 - 12, {size: 11, color: "#9a7d12", halo: true});
      D.display(c, F(C(t), 2), xs[1] + bw / 2, gy + bh / 2, {w: Math.min(92, bw - 16), h: 40, caption: "C (mg/L)", size: 15});
      /* --- courbe de concentration --- */
      var ax = axIn(c, {x: 0, y: h1, w: W, h: H - h1}, {x0: 0, x1: 24, y0: 0, y1: Math.max(10, Math.ceil(Cm * 1.3)), stepX: 2, xl: "t (h)", yl: "C (mg/L)", t: 16}); G = ax;
      if (mv.value){ ctx.save(); ctx.fillStyle = "rgba(194,106,12,.14)"; ctx.fillRect(ax.X(0), ax.Y(moy), ax.X(TT) - ax.X(0), ax.Y(0) - ax.Y(moy)); ctx.restore(); hl(c, ax, moy, P.amber, [6, 4], 1.6); D.label(c, "moyenne " + F(moy, 2) + " mg/L", ax.X(TT) + (TT > 16 ? -6 : 6), ax.Y(moy) - 11, {color: P.amber, size: 10.5, align: TT > 16 ? "right" : "left"}); }
      fillArea(c, ax, C, function(){ return 0; }, 0, Math.min(TT, t), "rgba(31,75,158,.28)");
      D.fn(c, ax, function(x){ return x <= t ? C(x) : NaN; }, P.acc, 3.2); D.fn(c, ax, function(x){ return x >= t ? C(x) : NaN; }, "rgba(31,75,158,.3)", 2, [4, 4]);
      if (ti >= 0 && TG[ti][0] === "auc" && TG[ti][1] === 50) hl(c, ax, 6, P.red, [3, 3], 1.4);
      vl(c, ax, TT, "#8a95a3", [4, 4], 1.4); hnd(c, ax.X(TT), ax.T + 8, P.ink, "T"); pt(c, ax, tm, Cm, P.red, 4.5);
      D.dot(c, ax.X(t), ax.Y(C(t)), 6, P.red); D.line(c, ax.X(t), ax.B, ax.X(t), ax.Y(C(t)), "rgba(192,50,29,.4)", 1.2, [3, 3]);
      ro.set(0, F(Cm, 2) + " mg/L (t = " + F(tm, 1) + " h)"); ro.set(1, F(auc, 1) + " mg·h/L"); ro.set(2, F(aucInf, 1) + " mg·h/L"); ro.set(3, F(moy, 2) + " mg/L");
      if (ti >= 0){ var g = TG[ti], ok = g[0] === "auc" ? Math.abs(aucInf - g[1]) <= 2 && (g[1] !== 50 || Cm < 6) : Math.abs(TT - g[2]) < 1e-9 && Math.abs(moy - g[1]) <= 0.1;
        if (ok){ if (!won){ won = true; wins++; } nt.set("Défi réussi (" + wins + ") : " + g[3] + ". " + (g[0] === "auc" ? "AUC(0 → ∞) = D/(V·kₑ) = " + F(d, 0) + "/(" + F(v, 0) + " × " + F(e, 2) + ") = " + F(aucInf, 1) + " mg·h/L." : "Moyenne = AUC(0 → 12)/12 = " + F(auc, 1) + "/12 = " + F(moy, 2) + " mg/L."), "ok"); }
        else { won = false; nt.set("Défi : " + g[3] + ". " + (g[0] === "auc" ? (g[1] === 50 ? "Indice : kₐ ne change pas l'AUC mais abaisse le pic." : "Indice : AUC(0 → ∞) = D/(V·kₑ) ; kₐ n'y joue aucun rôle.") : "Garde T = 12 h ; la moyenne vaut AUC(0 → 12)/12."), "warn"); } }
      else nt.set("À l'horizon T = " + F(TT, 1) + " h, " + F(auc / aucInf * 100, 1) + " % de l'exposition totale est intégrée. Le rectangle orange (hauteur = moyenne) a la même aire que la zone bleue sous la courbe. Clique « Défi suivant ».", "");
    });
  }
});
})();
