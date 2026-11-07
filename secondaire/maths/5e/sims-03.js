(function(){
var P = SFA.draw.palette, F = SFA.fmt;
/*@@H:m5-c03-indetermination*/
var ND = {
  a:{N:function(x){ return x*x - 9; }, D:function(x){ return x - 3; }, ln:"x² − 9", ld:"x − 3", op:"/"},
  b:{N:function(x){ return x*x - 5*x + 6; }, D:function(x){ return x*x - 4; }, ln:"x² − 5x + 6", ld:"x² − 4", op:"/"},
  c:{N:function(x){ return Math.sqrt(x + 4) - 2; }, D:function(x){ return x; }, ln:"√(x + 4) − 2", ld:"x", op:"/"},
  d:{N:function(x){ return 3*x*x - x + 1; }, D:function(x){ return 5*x*x + 2; }, ln:"3x² − x + 1", ld:"5x² + 2", op:"/"},
  e:{N:function(x){ return Math.sqrt(x*x + x); }, D:function(x){ return x; }, ln:"√(x² + x)", ld:"x", op:"−"},
  f:{N:function(x){ return x*x*x + 1; }, D:function(x){ return 2*x*x + x; }, ln:"x³ + 1", ld:"2x² + x", op:"/"}
};
function indG(v){ return !isFinite(v) ? "indéfini" : Math.abs(v) >= 1e6 ? SFA.sci(v, 2) : SFA.sci(v, 4); }
/*@@E:m5-c03-indetermination*/
function curve(c, ax, pt, t0, t1, col, dash, w){
  var ctx = c.ctx, n = 300; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = w || 2.6; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  for (var i = 0; i <= n; i++){ var t = t0 + (t1 - t0) * i / n, p = pt(t); if (i) ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); else ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); }
  ctx.stroke(); ctx.restore();
}
function piece(c, ax, f, x0, x1, col){ curve(c, ax, function(t){ return [t, f(t)]; }, x0, x1, col); }
function hole(c, ax, x, y, col){ var ctx = c.ctx; ctx.beginPath(); ctx.arc(ax.X(x), ax.Y(y), 5.5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); }
function inf(v){ return v === Infinity ? "+∞" : v === -Infinity ? "−∞" : F(v, 3); }

/* 1. Approche d'un point */
var AP = {
  a:{n:"(x² − 4)/(x − 2) en 2", f:function(x){ return Math.abs(x - 2) < 1e-12 ? NaN : (x*x - 4)/(x - 2); }, a:2, lg:4, ld:4, hole:true, fa:"n'existe pas (division 0/0)"},
  b:{n:"1/x en 0", f:function(x){ return x === 0 ? NaN : 1/x; }, a:0, lg:-Infinity, ld:Infinity, fa:"n'existe pas"},
  c:{n:"|x|/x en 0", f:function(x){ return x === 0 ? NaN : Math.abs(x)/x; }, a:0, lg:-1, ld:1, fa:"n'existe pas"},
  d:{n:"(√(x + 4) − 2)/x en 0", f:function(x){ return x === 0 ? NaN : (Math.sqrt(x + 4) - 2)/x; }, a:0, lg:0.25, ld:0.25, hole:true, fa:"n'existe pas (0/0)"},
  e:{n:"x² + 1 en 1", f:function(x){ return x*x + 1; }, a:1, lg:2, ld:2, fa:"2"},
  f:{n:"1/x² en 0", f:function(x){ return x === 0 ? NaN : 1/(x*x); }, a:0, lg:Infinity, ld:Infinity, fa:"n'existe pas"}
};
SFA.sim({
  id:"m5-c03-approche", ch:"c03", tag:"Classique",
  titre:"Approcher un point : à gauche, à droite",
  resume:"Fais tendre x vers a : tableau de valeurs, zoom, limites gauche et droite.",
  but:"Choisis une fonction, puis fais descendre h : suis f(a − h) et f(a + h). Où vont-elles ? Sont-elles d'accord ?",
  aRetenir:"La limite en a décrit ce que fait f(x) quand x s'approche de a, sans l'atteindre. Elle existe (finie ou infinie) quand les limites à gauche et à droite sont égales. La valeur f(a) n'a aucune influence.",
  piege:"« lim f(x) = f(a) » n'est vrai que si f est continue en a. Pour (x² − 4)/(x − 2), f(2) n'existe pas, et pourtant la limite en 2 vaut 4.",
  build:function(k, S){
    var c = k.canvas(410);
    var sel = k.select("Fonction", Object.keys(AP).map(function(q){ return [q, AP[q].n]; }), "a");
    var side = k.seg("Côté", [["G", "Gauche"], ["D", "Droite"], ["B", "Les deux"]], "B");
    var s = k.slider("Zoom z (h = 10^−z)", 0, 2.5, 0.1, 0, "");
    var run = k.loop(function(dt){ var v = s.value + dt * 0.45; if (v >= 2.5){ v = 2.5; run.pause(); } s.set(v); k.redraw(); });
    k.button("▶ Se rapprocher de a", function(){ s.set(0); run.play(); }, true);
    var ro = k.readouts(["f(a − h)", "f(a + h)", "Limite à gauche", "Limite à droite"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var d = AP[sel.value], h = Math.pow(10, -s.value), a = d.a, w = 2 * h; c.clear();
      var ys = [a - h, a + h, a - w, a + w].map(d.f).filter(isFinite), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
      if (isFinite(d.lg)) { lo = Math.min(lo, d.lg); hi = Math.max(hi, d.lg); } if (isFinite(d.ld)) { lo = Math.min(lo, d.ld); hi = Math.max(hi, d.ld); }
      var pd = (hi - lo) * 0.2 || 0.5; lo -= pd; hi += pd;
      var ax = S.draw.axes(c, {x0:a - w, x1:a + w, y0:lo, y1:hi, l:56, xl:"x", yl:"f(x)"});
      var ctx = c.ctx;
      S.draw.line(c, ax.X(a), ax.T, ax.X(a), ax.B, P.light, 1.5, [5, 4]);
      piece(c, ax, d.f, a - w, a - 1e-9, P.acc); piece(c, ax, d.f, a + 1e-9, a + w, P.acc);
      var showL = side.value !== "D", showR = side.value !== "G";
      [[showL, -1, P.red], [showR, 1, P.green]].forEach(function(q){
        if (!q[0]) return; var x = a + q[1] * h, y = d.f(x);
        if (isFinite(y)){ S.draw.line(c, ax.X(x), ax.B, ax.X(x), ax.Y(y), q[2], 1, [3, 3]); S.draw.line(c, ax.L, ax.Y(y), ax.X(x), ax.Y(y), q[2], 1, [3, 3]); S.draw.dot(c, ax.X(x), ax.Y(y), 6, q[2]); }
      });
      if (d.hole) hole(c, ax, a, d.lg, P.acc);
      var fa = d.f(a); if (isFinite(fa)) S.draw.dot(c, ax.X(a), ax.Y(fa), 5, P.acc);
      ro.set(0, F(d.f(a - h), 4)); ro.set(1, F(d.f(a + h), 4)); ro.set(2, inf(d.lg)); ro.set(3, inf(d.ld));
      var m = "Fenêtre : x entre " + F(a - w, 3) + " et " + F(a + w, 3) + " (h = " + F(h, 4) + "). f(a) " + d.fa + ". ";
      if (d.lg === d.ld) m += "Les deux côtés s'accordent : <b>lim = " + inf(d.lg) + "</b>."; else m += "Les deux côtés se contredisent : <b>pas de limite en a</b>.";
      nt.set(m, d.lg === d.ld ? "ok" : "warn");
    });
  }
});

/* 2. Limite en l'infini */
var IN = {
  a:{n:"(2x + 1)/(x − 1)", f:function(x){ return Math.abs(x - 1) < 1e-12 ? NaN : (2*x + 1)/(x - 1); }, lp:2, lm:2, y0:-2, y1:6},
  b:{n:"(3x² + x)/(x² + 4)", f:function(x){ return (3*x*x + x)/(x*x + 4); }, lp:3, lm:3, y0:-1, y1:5},
  c:{n:"5x/(x² + 1)", f:function(x){ return 5*x/(x*x + 1); }, lp:0, lm:0, y0:-3, y1:3},
  d:{n:"x² − 5x", f:function(x){ return x*x - 5*x; }, lp:Infinity, lm:Infinity, y0:-10, y1:60},
  e:{n:"√(x² + 1) − x", f:function(x){ return Math.sqrt(x*x + 1) - x; }, lp:0, lm:Infinity, y0:-1, y1:6}
};
var EPS = [0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.001];
SFA.sim({
  id:"m5-c03-infini", ch:"c03", tag:"Classique",
  titre:"Vers l'infini : la courbe s'aplatit-elle ?",
  resume:"Fais grandir X ; défi : jusqu'où aller pour rester à moins de ε de L ?",
  but:"Choisis une fonction et agrandis la fenêtre [−X ; X]. Puis réduis la tolérance ε : à partir de quel x la courbe reste-t-elle dans la bande L ± ε ?",
  aRetenir:"lim f(x) = L en +∞ signifie que f(x) s'approche de L autant qu'on veut pour x assez grand ; la droite y = L est alors asymptote horizontale. Les limites en +∞ et en −∞ peuvent être différentes.",
  piege:"Une fraction rationnelle n'a pas toujours pour limite le rapport des coefficients : cela dépend des degrés. deg num < deg den : limite 0 ; égaux : rapport des coefficients dominants ; deg num > deg den : infinie.",
  build:function(k, S){
    var c = k.canvas(410);
    var sel = k.select("Fonction", Object.keys(IN).map(function(q){ return [q, IN[q].n]; }), "a");
    var X = k.slider("X (fenêtre [−X ; X])", 5, 200, 5, 20, "");
    var ei = k.slider("Finesse de ε (0 grand … 7 minuscule)", 0, 7, 1, 3, "");
    var run = k.loop(function(dt){ var v = X.value + dt * 38; if (v >= 200){ v = 200; run.pause(); } X.set(v); k.redraw(); });
    k.button("▶ Zoom arrière (x → ∞)", function(){ X.set(5); run.play(); }, true);
    var ro = k.readouts(["f(X)", "f(−X)", "ε", "|f(x) − L| < ε dès x ≥"]);
    var nt = k.note("", "ok"), axi = null, dg = false;
    c.pointer(function(t, q){
      var d = IN[sel.value]; if (!axi || !isFinite(d.lp)) return;
      if (t === "down") dg = Math.abs(q.y - axi.Y(d.lp + EPS[ei.value])) < 16 || Math.abs(q.y - axi.Y(d.lp - EPS[ei.value])) < 16;
      if ((t === "down" || t === "drag") && dg){ var e = Math.max(1e-4, Math.abs(axi.iy(q.y) - d.lp)), bi = 0; EPS.forEach(function(v, i){ if (Math.abs(Math.log(v / e)) < Math.abs(Math.log(EPS[bi] / e))) bi = i; }); ei.set(bi); k.redraw(); }
      if (t === "up") dg = false;
    });
    k.draw(function(){
      var d = IN[sel.value], x = X.value, eps = EPS[ei.value]; c.clear();
      var ax = axi = S.draw.axes(c, {x0:-x, x1:x, y0:d.y0, y1:d.y1, xl:"x", yl:"f(x)"});
      var fin = isFinite(d.lp);
      if (fin){
        var ctx = c.ctx; ctx.fillStyle = "rgba(46,107,85,.18)"; ctx.fillRect(ax.L, ax.Y(d.lp + eps), ax.R - ax.L, Math.max(1.5, ax.Y(d.lp - eps) - ax.Y(d.lp + eps)));
        S.draw.line(c, ax.L, ax.Y(d.lp), ax.R, ax.Y(d.lp), P.green, 1.4, [6, 4]);
        S.draw.label(c, "↕ tire le bord : ε = " + F(eps, 3), ax.R - 8, Math.min(ax.B - 12, Math.max(ax.T + 12, ax.Y(d.lp + eps) - 14)), {color:P.green, align:"right", size:11});
      }
      if (isFinite(d.lm)) S.draw.line(c, ax.L, ax.Y(d.lm), ax.R, ax.Y(d.lm), P.red, 1, [2, 4]);
      S.draw.fn(c, ax, d.f, P.acc, 2.6);
      var N0 = null;
      if (fin){ for (var j = 280; j >= 0; j--){ var xx = Math.pow(10, j / 40); if (Math.abs(d.f(xx) - d.lp) >= eps){ N0 = Math.pow(10, (j + 1) / 40); break; } } if (N0 === null) N0 = 1; }
      if (fin && N0 <= x) S.draw.line(c, ax.X(N0), ax.T, ax.X(N0), ax.B, P.green, 1.5, [3, 3]);
      ro.set(0, F(d.f(x), 4)); ro.set(1, F(d.f(-x), 4)); ro.set(2, F(eps, 3));
      ro.set(3, fin ? (N0 < 1.001 ? "x ≥ 1" : "x ≈ " + F(N0, N0 < 10 ? 2 : 0)) : "sans objet");
      nt.set("Limite en +∞ : <b>" + inf(d.lp) + "</b> · limite en −∞ : <b>" + inf(d.lm) + "</b>." + (fin ? " La bande verte est L ± ε : à partir de x ≈ " + F(N0, N0 < 10 ? 2 : 0) + " " + (N0 <= x ? "(repère vert)" : "(hors fenêtre : agrandis X)") + ", la courbe n'en sort plus." : " Pas de limite finie en +∞ : aucune bande ne peut contenir la courbe."), "ok");
    });
  }
});

/* 3. Lever l'indétermination */
var CASES = {
  a:{n:"0/0 : (x² − 9)/(x − 3), x → 3", f:function(x){ return Math.abs(x - 3) < 1e-12 ? NaN : (x*x - 9)/(x - 3); }, a:3, L:6, win:[0, 6, 0, 10],
     st:["On remplace x par 3 : numérateur 0 et dénominateur 0. C'est la forme <b>0/0</b> : on ne peut pas conclure.", "On factorise : x² − 9 = (x − 3)(x + 3).", "On simplifie par (x − 3) : c'est permis car x tend vers 3 sans jamais valoir 3. Il reste f(x) = x + 3.", "On remplace : lim = 3 + 3 = <b>6</b>."]},
  b:{n:"0/0 : (x² − 5x + 6)/(x² − 4), x → 2", f:function(x){ return Math.abs(x - 2) < 1e-12 ? NaN : (x*x - 5*x + 6)/(x*x - 4); }, a:2, L:-0.25, win:[0, 5, -2, 1],
     st:["Pour x = 2 : numérateur 4 − 10 + 6 = 0, dénominateur 4 − 4 = 0 : forme <b>0/0</b>.", "On factorise : x² − 5x + 6 = (x − 2)(x − 3) et x² − 4 = (x − 2)(x + 2).", "On simplifie par (x − 2) : f(x) = (x − 3)/(x + 2).", "On remplace : lim = (2 − 3)/(2 + 2) = <b>−1/4</b>."]},
  c:{n:"0/0 avec racine : (√(x + 4) − 2)/x, x → 0", f:function(x){ return Math.abs(x) < 1e-12 ? NaN : (Math.sqrt(x + 4) - 2)/x; }, a:0, L:0.25, win:[-3, 6, 0, 0.6],
     st:["Pour x = 0 : (2 − 2)/0 = 0/0, forme <b>0/0</b>.", "On multiplie numérateur et dénominateur par le conjugué √(x + 4) + 2.", "Au numérateur : (√(x + 4) − 2)(√(x + 4) + 2) = (x + 4) − 4 = x. Donc f(x) = x / (x·(√(x + 4) + 2)) = 1/(√(x + 4) + 2).", "On remplace : lim = 1/(2 + 2) = <b>1/4</b>."]},
  d:{n:"∞/∞ : (3x² − x + 1)/(5x² + 2), x → +∞", f:function(x){ return (3*x*x - x + 1)/(5*x*x + 2); }, a:Infinity, L:0.6, win:[0, 30, 0, 1],
     st:["Quand x → +∞, le numérateur et le dénominateur tendent vers +∞ : forme <b>∞/∞</b>.", "On met x² (plus haut degré) en évidence : f(x) = x²(3 − 1/x + 1/x²) / (x²(5 + 2/x²)).", "On simplifie par x² : f(x) = (3 − 1/x + 1/x²)/(5 + 2/x²).", "Quand x → +∞, 1/x et 1/x² tendent vers 0 : lim = <b>3/5</b>."]},
  e:{n:"∞ − ∞ : √(x² + x) − x, x → +∞", f:function(x){ return Math.sqrt(x*x + x) - x; }, a:Infinity, L:0.5, win:[0, 30, 0, 0.7],
     st:["√(x² + x) → +∞ et x → +∞ : forme <b>∞ − ∞</b> (ce n'est pas 0 !).", "On multiplie par le conjugué √(x² + x) + x : le numérateur devient (x² + x) − x² = x.", "f(x) = x / (√(x² + x) + x). Pour x > 0, √(x² + x) = x·√(1 + 1/x), donc f(x) = 1/(√(1 + 1/x) + 1).", "Quand x → +∞, 1/x → 0 : lim = 1/(1 + 1) = <b>1/2</b>."]},
  f:{n:"∞/∞ : (x³ + 1)/(2x² + x), x → +∞", f:function(x){ return Math.abs(2*x*x + x) < 1e-12 ? NaN : (x*x*x + 1)/(2*x*x + x); }, a:Infinity, L:Infinity, win:[0, 10, 0, 6],
     st:["Numérateur et dénominateur tendent vers +∞ : forme <b>∞/∞</b>.", "On met le plus haut degré en évidence : f(x) = x³(1 + 1/x³) / (x²(2 + 1/x)).", "On simplifie : f(x) = x·(1 + 1/x³)/(2 + 1/x). La fraction (1 + 1/x³)/(2 + 1/x) tend vers 1/2.", "Donc f(x) se comporte comme x/2 : lim = <b>+∞</b>. (Degré du numérateur plus grand : limite infinie.)"]}
};
SFA.sim({
  id:"m5-c03-indetermination", ch:"c03", tag:"Méthode",
  titre:"Lever une forme indéterminée, pas à pas",
  resume:"Factoriser, conjuguer ou mettre le plus haut degré en évidence.",
  but:"Choisis une limite. Glisse le point sur la courbe vers la valeur cible (ou règle z) : numérateur et dénominateur partent tous deux vers 0 (ou ∞), pourtant leur quotient se stabilise. Avance ensuite dans le calcul étape par étape.",
  aRetenir:"0/0 : factoriser (ou conjuguer) et simplifier. ∞/∞ : mettre en évidence le plus haut degré. ∞ − ∞ : conjuguer, ou mettre en évidence. Une forme indéterminée n'est jamais « égale à 0 », « égale à 1 » ou « égale à ∞ ».",
  piege:"∞ − ∞ ≠ 0 : √(x² + x) − x tend vers 1/2, pas vers 0. De même 0/0 ≠ 0 et ∞/∞ ≠ 1.",
  build:function(k, S){
    var c = k.canvas(430);
    var sel = k.select("Limite", Object.keys(CASES).map(function(q){ return [q, CASES[q].n]; }), "a");
    var zs = k.slider("z : on se rapproche (h = 10^−z, ou x = 10^z)", 0, 5, 0.1, 1, "");
    var st = k.slider("Étape du calcul", 1, 4, 1, 1, "/ 4");
    var ro = k.readouts(["x", "Numérateur", "Dénominateur", "Quotient (ou différence)"]);
    var nt = k.note("", "ok");
    var ax = null;
    function xOf(d){ return isFinite(d.a) ? d.a + Math.pow(10, -zs.value) : Math.pow(10, zs.value); }
    c.pointer(function(type, p){
      if (!ax || (type !== "down" && type !== "drag")) return; var d = CASES[sel.value], v = ax.ix(p.x);
      if (isFinite(d.a)){ var h = Math.abs(v - d.a); zs.set(Math.max(0, Math.min(5, h > 1e-6 ? -Math.log10(h) : 5))); }
      else zs.set(Math.max(0, Math.min(5, Math.log10(Math.max(1, v)))));
      k.redraw();
    });
    sel.el.addEventListener("change", function(){ zs.set(1); });
    k.draw(function(){
      var d = CASES[sel.value], nd = ND[sel.value]; c.clear(); var w = d.win;
      ax = S.draw.axes(c, {x0:w[0], x1:w[1], y0:w[2], y1:w[3], l:50, xl:"x", yl:"f(x)"});
      var fin = isFinite(d.a);
      if (fin && sel.value !== "d"){
        S.draw.fn(c, ax, nd.N, S.draw.tint(P.violet, 0.75), 1.6, [5, 4]); S.draw.fn(c, ax, nd.D, S.draw.tint(P.teal, 0.85), 1.6, [5, 4]);
      }
      S.draw.fn(c, ax, d.f, P.acc, 3);
      if (isFinite(d.L)){ S.draw.line(c, ax.L, ax.Y(d.L), ax.R, ax.Y(d.L), P.green, 1.5, [6, 4]); S.draw.label(c, "limite = " + F(d.L, 3), ax.R - 6, ax.Y(d.L) - 12, {color:P.green, align:"right"}); }
      if (fin && isFinite(d.L)){ S.draw.line(c, ax.X(d.a), ax.T, ax.X(d.a), ax.B, P.light, 1.4, [5, 4]); hole(c, ax, d.a, d.L, P.green); }
      var xv = xOf(d), yv = d.f(xv), cl = Math.min(xv, w[1]), out = xv > w[1];
      var py = isFinite(yv) ? Math.max(ax.T + 4, Math.min(ax.B - 4, ax.Y(yv))) : ax.Y(d.L || 0);
      if (!out) S.draw.line(c, ax.X(xv), ax.B, ax.X(xv), py, P.red, 1, [3, 3]);
      S.draw.glow(c, ax.X(cl), py, 18, P.red, 0.45); S.draw.dot(c, ax.X(cl), py, 7, P.red);
      S.draw.label(c, out ? "x = " + F(xv, 0) + " (hors cadre) →" : "↔ glisse-moi", Math.min(ax.R - 8, ax.X(cl) + (out ? -10 : 12)), py - 22, {color:P.red, align:out ? "right" : "left"});
      if (fin && sel.value !== "d"){ S.draw.legend(c, [[P.violet, "numérateur " + nd.ln, true], [P.teal, "dénominateur " + nd.ld, true], [P.acc, "quotient"]], ax.L + 8, ax.T + 6); }
      var a = nd.N(xv), b = nd.D(xv);
      ro.set(0, "x = " + indG(xv)); ro.set(1, indG(a)); ro.set(2, indG(b)); ro.set(3, indG(isFinite(yv) ? yv : NaN));
      var h = ""; for (var i = 0; i < st.value; i++) h += "<b>" + (i + 1) + ".</b> " + d.st[i] + "<br>";
      var trend = fin ? (nd.op === "/" ? "numérateur et dénominateur tendent vers 0, mais leur quotient tend vers " : "") : "";
      nt.set((st.value === 1 ? "" : "") + h + (st.value === 4 ? "<i>Le point confirme : " + (isFinite(d.L) ? (fin ? trend : "la valeur se stabilise près de ") + F(d.L, 4) + "." : "les valeurs grandissent sans borne.") + "</i>" : ""), st.value === 4 ? "ok" : "");
    });
  }
});

/* 4. Saut et divergence */
SFA.sim({
  id:"m5-c03-saut", ch:"c03", tag:"Niche utile",
  titre:"Saut ou divergence : quand la limite n'existe pas",
  resume:"Limites gauche et droite d'une fonction par morceaux ou d'une fraction.",
  but:"Mode « Saut » : glisse les points vert (limite à droite) et rouge (f(2)) ou règle m, p et v pour raccorder les deux morceaux. Modes 1/(x − 2) : change le signe de s et regarde les infinis.",
  aRetenir:"La limite en a existe si lim à gauche = lim à droite. Avec un dénominateur qui s'annule, on étudie le signe de chaque côté : 1/(x − 2) tend vers −∞ à gauche et +∞ à droite, 1/(x − 2)² vers +∞ des deux côtés.",
  piege:"« 1/0 = ∞ » sans regarder le signe : 1/(x − 2) n'a pas de limite en 2, alors que 1/(x − 2)² a pour limite +∞.",
  build:function(k, S){
    var c = k.canvas(410);
    var mode = k.seg("Mode", [["S", "Saut"], ["H", "s/(x − 2)"], ["Q", "s/(x − 2)²"]], "S");
    var m = k.slider("m (morceau de droite : m·x + p)", -2, 2, 0.5, 1, "");
    var p = k.slider("p", -3, 5, 0.5, 0, "");
    var v = k.slider("v = f(2) (mode Saut)", -3, 6, 0.5, 3, "");
    var s = k.slider("s (modes fraction)", -3, 3, 1, 1, "");
    var ro = k.readouts(["Limite à gauche", "Limite à droite", "f(2)", "Limite en 2"]);
    var nt = k.note("", "ok"), axs = null, dm = "";
    c.pointer(function(t, q){
      if (!axs || mode.value !== "S") return;
      var yg = axs.Y(2 * m.value + p.value), yv = axs.Y(v.value);
      if (t === "down") dm = Math.abs(q.y - yg) < 30 && Math.abs(q.x - axs.X(2)) < 60 && Math.abs(q.y - yg) <= Math.abs(q.y - yv) ? "p" : Math.abs(q.y - yv) < 30 && Math.abs(q.x - axs.X(2)) < 60 ? "v" : "";
      if ((t === "down" || t === "drag") && dm){ var yy = Math.round(axs.iy(q.y) * 2) / 2; if (dm === "p") p.set(yy - 2 * m.value); else v.set(yy); k.redraw(); }
      if (t === "up") dm = "";
    });
    k.draw(function(){
      c.clear(); var md = mode.value, lg, ld, f2, lim, ok;
      var ax = axs = S.draw.axes(c, {x0:-1, x1:5, y0:-8, y1:12, stepX:1, stepY:2, xl:"x", yl:"f(x)"});
      S.draw.line(c, ax.X(2), ax.T, ax.X(2), ax.B, P.light, 1.5, [5, 4]);
      if (md === "S"){
        var fL = function(x){ return x + 1; }, fR = function(x){ return m.value * x + p.value; };
        piece(c, ax, fL, -1, 2, P.acc); piece(c, ax, fR, 2, 5, P.green);
        lg = 3; ld = 2 * m.value + p.value; f2 = v.value;
        hole(c, ax, 2, lg, P.acc); hole(c, ax, 2, ld, P.green); S.draw.label(c, "lim⁻ = " + F(lg, 1), ax.X(2) - 10, ax.Y(lg) - 14, {color:P.acc, align:"right", size:11}); S.draw.label(c, "lim⁺ = " + F(ld, 1), ax.X(2) + 10, ax.Y(ld) + (ld >= lg ? 16 : -16), {color:P.green, align:"left", size:11}); S.draw.dot(c, ax.X(2), ax.Y(f2), 6, P.red); S.draw.label(c, "↕ f(2) = " + F(f2, 1), ax.X(2) + 12, ax.Y(f2) + (Math.abs(f2 - ld) < 1.2 ? 30 : 0), {color:P.red, align:"left", size:11});
        ok = lg === ld; lim = ok ? F(lg, 2) : "n'existe pas";
        nt.set(ok ? (f2 === lg ? "Raccord parfait : limite gauche = limite droite = f(2) = " + F(lg, 1) + ". La fonction est continue en 2." : "Les limites gauche et droite valent " + F(lg, 1) + " mais f(2) = " + F(f2, 1) + " : la limite existe, la fonction est discontinue en 2 (point mal placé).") : "Limite gauche " + F(lg, 1) + " ≠ limite droite " + F(ld, 1) + " : saut de " + F(ld - lg, 1) + ", pas de limite en 2.", ok ? "ok" : "warn");
      } else {
        var q = md === "H" ? 1 : 2, g = function(x){ return Math.abs(x - 2) < 1e-12 ? NaN : s.value / Math.pow(x - 2, q); };
        S.draw.fn(c, ax, g, P.acc, 2.6);
        if (s.value === 0){ lg = 0; ld = 0; } else if (md === "H"){ lg = -s.value * Infinity; ld = s.value * Infinity; } else { lg = ld = s.value * Infinity; }
        f2 = NaN; ok = lg === ld; lim = ok ? inf(lg) : "n'existe pas";
        nt.set(s.value === 0 ? "s = 0 : f est la fonction nulle (sauf en 2), limite 0." : (md === "H" ? "Le dénominateur x − 2 change de signe en 2 : négatif à gauche, positif à droite. " : "Le dénominateur (x − 2)² est positif des deux côtés. ") + "Limite à gauche : " + inf(lg) + ", à droite : " + inf(ld) + (ok ? " : la limite existe et vaut " + inf(lg) + " (l'asymptote verticale x = 2 est approchée du même côté)." : " : pas de limite en 2."), ok ? "ok" : "warn");
      }
      ro.set(0, inf(lg)); ro.set(1, inf(ld)); ro.set(2, isFinite(f2) ? F(f2, 1) : "n'existe pas"); ro.set(3, lim);
    });
  }
});
})();
