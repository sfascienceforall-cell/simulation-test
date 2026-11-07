(function(){
var P = SFA.draw.palette, F = SFA.fmt, R2 = Math.SQRT2;
/*@@H:m5-c07-plan*/
var TVD = {
  a:{x:["−∞", "−1", "1", "+∞"], s:["+", "−", "+"], v:["−∞", "2", "−2", "+∞"], z:[0, 1, 1, 0]},
  b:{x:["−∞", "−1", "1", "+∞"], s:["−", "+", "−"], v:["0", "−1/2", "1/2", "0"], z:[0, 1, 1, 0]},
  c:{x:["−∞", "1 − √2", "1", "1 + √2", "+∞"], s:["+", "−", "−", "+"], v:["−∞", "−0,83", "‖", "4,83", "+∞"], z:[0, 1, 2, 1, 0]},
  d:{x:["−2", "−√2", "√2", "2"], s:["−", "+", "−"], v:["0", "−2", "2", "0"], z:[0, 1, 1, 0]}
};
function plTable(c, S, y0, d, s){
  var P = S.draw.palette, ctx = c.ctx, n = d.x.length, lw = 46, W = c.W - 16 - lw, x0 = 8 + lw, cw = W / (n - 1), rows = [y0, y0 + 34, y0 + 66], rh = [34, 32, 74], i;
  S.draw.panel(c, 4, y0 - 6, c.W - 8, 34 + 32 + 74 + 16, {fill:"#fff", stroke:"#e3e7ed", radius:10, shadow:false});
  ctx.save(); ctx.strokeStyle = "#cfd6df"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(8, y0 + 28); ctx.lineTo(c.W - 8, y0 + 28); ctx.moveTo(8, y0 + 62); ctx.lineTo(c.W - 8, y0 + 62); ctx.moveTo(x0 - 6, y0 - 4); ctx.lineTo(x0 - 6, y0 + 144); ctx.stroke(); ctx.restore();
  S.draw.text(c, "x", 8 + lw / 2 - 4, y0 + 12, {size:13, math:true, weight:700, italic:true}); S.draw.text(c, "f′(x)", 8 + lw / 2 - 4, y0 + 46, {size:13, math:true}); S.draw.text(c, "f(x)", 8 + lw / 2 - 4, y0 + 100, {size:13, math:true});
  var X = function(j){ return x0 + 6 + j * (W - 12) / (n - 1); };
  for (i = 0; i < n; i++){
    var isVA = d.z[i] === 2, edge = i === 0 || i === n - 1;
    S.draw.text(c, d.x[i], X(i), y0 + 12, {size:12, math:true, color:edge ? P.grey : P.ink, weight:700});
    if (s >= 4 && d.z[i] === 1) S.draw.text(c, "0", X(i), y0 + 46, {size:13, mono:true, color:P.amber, weight:700});
    if (s >= 4 && isVA){ S.draw.line(c, X(i) - 2, y0 + 30, X(i) - 2, y0 + 142, P.red, 1.4); S.draw.line(c, X(i) + 2, y0 + 30, X(i) + 2, y0 + 142, P.red, 1.4); }
  }
  if (s < 5) return;
  var hi = y0 + 76, lo = y0 + 142, ys = [];
  for (i = 0; i < n; i++){
    var l = d.s[i - 1], r = d.s[i], top;
    if (d.z[i] === 2) { ys.push([lo, hi]); continue; }
    if (i === 0) top = r === "−"; else if (i === n - 1) top = l === "+"; else top = l === "+" && r === "−";
    ys.push([top ? hi : lo, top ? hi : lo]);
  }
  for (i = 0; i < n - 1; i++){
    var sg = d.s[i], mx = (X(i) + X(i + 1)) / 2;
    S.draw.text(c, sg, mx, y0 + 46, {size:17, color:sg === "+" ? P.green : P.red, weight:800});
    var ya = ys[i][1], yb = ys[i + 1][0], ax1 = X(i) + 20, ax2 = X(i + 1) - 20;
    if (i === 0 || d.z[i] !== 2) ax1 = X(i) + 22; if (d.z[i + 1] === 2) ax2 = X(i + 1) - 20;
    S.draw.arrow(c, ax1, ya + (ya < yb ? 8 : -8), ax2, yb + (ya < yb ? -8 : 8), sg === "+" ? P.green : P.red, 2);
  }
  for (i = 0; i < n; i++){
    if (d.z[i] === 2){ S.draw.text(c, "−∞", X(i) - 18, lo, {size:12, math:true}); S.draw.text(c, "+∞", X(i) + 18, hi, {size:12, math:true}); continue; }
    S.draw.text(c, d.v[i], X(i), ys[i][0] + (ys[i][0] === hi ? -2 : 2), {size:12, math:true, weight:700, color:i && i < n - 1 ? (ys[i][0] === hi ? P.red : P.green) : P.ink, bg:"#fff"});
  }
}
/*@@E:m5-c07-plan*/
function clipped(c, ax, fn){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); fn(); ctx.restore(); }
function tbl(rows){ var h = "<table style='border-collapse:collapse;font-size:13px;margin-top:6px'>"; rows.forEach(function(r){ h += "<tr>" + r.map(function(c, i){ return "<td style='border:1px solid #ccd;padding:3px 7px;" + (i === 0 ? "font-weight:800" : "") + "'>" + c + "</td>"; }).join("") + "</tr>"; }); return h + "</table>"; }

/* 1. Plan d'étude guidé */
var PL = {
  a:{n:"f(x) = x³ − 3x", f:function(x){ return x*x*x - 3*x; }, win:[-3, 3, -6, 6], dom:[[-9, 9]], zeros:[-Math.sqrt(3), 0, Math.sqrt(3)], va:[], lines:[],
     crit:[[-1, 2, "max"], [1, -2, "min"]],
     st:["<b>Domaine :</b> f est un polynôme, définie sur ℝ. <b>Parité :</b> f(−x) = −f(x) : f est impaire, la courbe est symétrique par rapport à l'origine.",
         "<b>Zéros :</b> x³ − 3x = x(x² − 3) = 0 ⇔ x = 0 ou x = ±√3 ≈ ±1,73. Signe : f > 0 sur ]−√3 ; 0[ et ]√3 ; +∞[, f < 0 ailleurs.",
         "<b>Limites :</b> lim<sub>+∞</sub> f = +∞ et lim<sub>−∞</sub> f = −∞ (terme x³). Aucune asymptote (polynôme).",
         "<b>Dérivée :</b> f′(x) = 3x² − 3 = 3(x − 1)(x + 1). Elle s'annule en x = −1 et x = 1.",
         "<b>Signe de f′ :</b> + sur ]−∞ ; −1[, − sur ]−1 ; 1[, + sur ]1 ; +∞[. Maximum local f(−1) = 2, minimum local f(1) = −2.",
         "<b>Points de repère :</b> on place les zéros et les extrema, puis on les relie en respectant les flèches du tableau."],
     tab:[["x", "−∞", "−1", "1", "+∞"], ["f′", "+", "0 −", "0", "+"], ["f", "−∞ ↗", "2 ↘", "−2 ↗", "+∞"]]},
  b:{n:"f(x) = x/(x² + 1)", f:function(x){ return x/(x*x + 1); }, win:[-6, 6, -0.8, 0.8], dom:[[-9, 9]], zeros:[0], va:[], lines:[{m:0, p:0}],
     crit:[[-1, -0.5, "min"], [1, 0.5, "max"]],
     st:["<b>Domaine :</b> x² + 1 > 0 pour tout x : ℝ. <b>Parité :</b> f(−x) = −f(x) : impaire.",
         "<b>Zéros :</b> f(x) = 0 ⇔ x = 0 (seul). Signe de f = signe de x, car x² + 1 > 0.",
         "<b>Limites :</b> degré du numérateur < degré du dénominateur : lim<sub>±∞</sub> f = 0. Asymptote horizontale y = 0 ; la courbe la coupe en x = 0 !",
         "<b>Dérivée :</b> f′(x) = ((x² + 1) − x·2x)/(x² + 1)² = (1 − x²)/(x² + 1)². Elle s'annule en x = ±1.",
         "<b>Signe de f′ :</b> − sur ]−∞ ; −1[, + sur ]−1 ; 1[, − sur ]1 ; +∞[. Minimum local f(−1) = −1/2, maximum local f(1) = 1/2.",
         "<b>Points de repère :</b> l'origine, le minimum (−1 ; −0,5), le maximum (1 ; 0,5) ; la courbe revient vers y = 0 aux deux bouts."],
     tab:[["x", "−∞", "−1", "1", "+∞"], ["f′", "−", "0 +", "0", "−"], ["f", "0 ↘", "−1/2 ↗", "1/2 ↘", "0"]]},
  c:{n:"f(x) = (x² + 1)/(x − 1)", f:function(x){ return Math.abs(x - 1) < 1e-12 ? NaN : (x*x + 1)/(x - 1); }, win:[-6, 8, -8, 12], dom:[[-99, 1], [1, 99]], zeros:[], va:[1], lines:[{m:1, p:1}],
     crit:[[1 - R2, 2 - 2*R2, "max"], [1 + R2, 2 + 2*R2, "min"]],
     st:["<b>Domaine :</b> x − 1 ≠ 0 : ℝ \\ {1}. Le domaine n'est pas symétrique par rapport à 0 : f n'est ni paire ni impaire.",
         "<b>Zéros :</b> x² + 1 > 0 : le numérateur ne s'annule jamais, f n'a pas de zéro. Signe de f = signe de x − 1 : négatif pour x < 1, positif pour x > 1.",
         "<b>Limites :</b> en 1⁺ : 2/0⁺ = +∞ ; en 1⁻ : 2/0⁻ = −∞ : asymptote verticale x = 1. En ±∞ : f(x) = x + 1 + 2/(x − 1), asymptote oblique y = x + 1 (courbe au-dessus pour x > 1, en dessous pour x < 1).",
         "<b>Dérivée :</b> f′(x) = (2x(x − 1) − (x² + 1))/(x − 1)² = (x² − 2x − 1)/(x − 1)². Zéros : x = 1 ± √2 ≈ 2,41 et −0,41.",
         "<b>Signe de f′ :</b> + sur ]−∞ ; 1 − √2[, − sur ]1 − √2 ; 1[ et ]1 ; 1 + √2[, + sur ]1 + √2 ; +∞[. Maximum local f(1 − √2) = 2 − 2√2 ≈ −0,83, minimum local f(1 + √2) = 2 + 2√2 ≈ 4,83.",
         "<b>Points de repère :</b> les deux extrema, l'asymptote verticale x = 1 et l'oblique y = x + 1 encadrent les deux branches."],
     tab:[["x", "−∞", "1 − √2", "1", "1 + √2", "+∞"], ["f′", "+", "0 −", "‖ −", "0 +", ""], ["f", "−∞ ↗", "−0,83 ↘", "−∞ ‖ +∞ ↘", "4,83 ↗", "+∞"]]},
  d:{n:"f(x) = x·√(4 − x²)", f:function(x){ return Math.abs(x) <= 2 ? x * Math.sqrt(4 - x*x) : NaN; }, win:[-3, 3, -2.8, 2.8], dom:[[-2, 2]], zeros:[-2, 0, 2], va:[], lines:[],
     crit:[[-R2, -2, "min"], [R2, 2, "max"]],
     st:["<b>Domaine :</b> 4 − x² ≥ 0 ⇔ x ∈ [−2 ; 2]. <b>Parité :</b> f(−x) = −f(x) : impaire.",
         "<b>Zéros :</b> f(x) = 0 ⇔ x = 0 ou 4 − x² = 0, soit x ∈ {−2 ; 0 ; 2}. Signe de f = signe de x sur ]−2 ; 2[.",
         "<b>Limites :</b> le domaine est borné : pas de limite en ±∞, donc aucune asymptote. Aux bornes f(±2) = 0.",
         "<b>Dérivée :</b> f′(x) = √(4 − x²) − x²/√(4 − x²) = (4 − 2x²)/√(4 − x²) sur ]−2 ; 2[. Zéros : x = ±√2 ≈ ±1,41. Aux deux bornes, f′ tend vers −∞ (numérateur −4, dénominateur → 0⁺) : tangentes verticales en ±2.",
         "<b>Signe de f′ :</b> − sur ]−2 ; −√2[, + sur ]−√2 ; √2[, − sur ]√2 ; 2[. Minimum f(−√2) = −2, maximum f(√2) = 2.",
         "<b>Points de repère :</b> (−2 ; 0), (−√2 ; −2), (0 ; 0), (√2 ; 2), (2 ; 0) : la courbe est une sorte de « S » couché."],
     tab:[["x", "−2", "−√2", "√2", "2"], ["f′", "−", "0 +", "0 −", ""], ["f", "0 ↘", "−2 ↗", "2 ↘", "0"]]}
};
SFA.sim({
  id:"m5-c07-plan", ch:"c07", tag:"Méthode",
  titre:"Le plan d'étude : la courbe se construit étape par étape",
  resume:"Domaine, zéros, limites, dérivée, tableau : chaque étape ajoute un morceau du dessin.",
  but:"Avance étape par étape (boutons, curseur ou pastilles en haut du dessin). À chaque étape, regarde ce qui apparaît sur le graphique et dans le tableau de variations. Seule la dernière étape trace la courbe complète.",
  aRetenir:"Plan : 1) domaine et parité ; 2) zéros et signe ; 3) limites et asymptotes ; 4) dérivée ; 5) signe de f′ et tableau de variations ; 6) points de repère ; 7) tracé. Le tableau et la courbe doivent raconter la même histoire.",
  piege:"Ne place pas une asymptote verticale sans calculer les limites de chaque côté, et n'oublie pas un zéro de f′ : chaque oubli fausse le tableau et donc la courbe.",
  build:function(k, S){
    var c = k.canvas(535);
    var sel = k.select("Fonction", Object.keys(PL).map(function(q){ return [q, PL[q].n]; }), "a");
    var st = k.slider("Étape", 1, 7, 1, 1, "/ 7");
    var auto = k.loop(function(dt, t){ if (!auto._acc) auto._acc = 0; auto._acc += dt; if (auto._acc > 1.4){ auto._acc = 0; if (st.value >= 7){ auto.pause(); } else st.set(st.value + 1); k.redraw(); } });
    k.button("◀ Précédente", function(){ auto.pause(); st.set(Math.max(1, st.value - 1)); });
    k.button("Suivante ▶", function(){ auto.pause(); st.set(Math.min(7, st.value + 1)); }, true);
    k.button("↻ Dérouler", function(){ st.set(1); auto._acc = 0; auto.play(); });
    var nt = k.note("", "ok");
    var NAMES = ["Domaine", "Zéros", "Limites", "Dérivée", "Variations", "Repères", "Tracé"], pills = [];
    c.pointer(function(type, p){ if (type === "down"){ pills.forEach(function(q){ if (p.x >= q.x && p.x <= q.x + q.w && p.y >= 4 && p.y <= 34){ auto.pause(); st.set(q.i); k.redraw(); } }); } });
    sel.el.addEventListener("change", function(){ st.set(1); });
    k.draw(function(){
      var d = PL[sel.value], s = st.value, w = d.win; c.clear();
      /* pastilles d'étapes */
      pills = []; var pw = (c.W - 8) / 7, ctx = c.ctx;
      NAMES.forEach(function(nm, i){
        var on = i + 1 === s, done = i + 1 < s, px = 4 + i * pw;
        pills.push({x:px, w:pw, i:i + 1});
        S.draw.panel(c, px + 1.5, 5, pw - 3, 28, {fill:on ? P.acc : done ? S.draw.tint(P.acc, 0.12) : "#f3f5f8", stroke:on ? P.acc : "#e3e7ed", radius:8, shadow:false});
        S.draw.text(c, pw > 56 ? (i + 1) + " " + nm : String(i + 1), px + pw / 2, 20, {size:pw > 56 ? 11 : 13, color:on ? "#fff" : done ? P.acc : P.grey, weight:800});
      });
      var gb = 332, ax = S.draw.axes(c, {x0:w[0], x1:w[1], y0:w[2], y1:w[3], xl:"x", yl:"y", t:46, b:c.H - gb, l:40});
      var lo = w[0], inD = d.dom;
      ctx.save(); ctx.fillStyle = "rgba(138,149,163,.22)"; var cur = lo;
      inD.slice().sort(function(a, b){ return a[0] - b[0]; }).forEach(function(iv){ if (iv[0] > cur) ctx.fillRect(ax.X(cur), ax.T, ax.X(Math.min(iv[0], w[1])) - ax.X(cur), ax.B - ax.T); cur = Math.max(cur, iv[1]); });
      if (cur < w[1]) ctx.fillRect(ax.X(cur), ax.T, ax.X(w[1]) - ax.X(cur), ax.B - ax.T);
      ctx.restore();
      if (sel.value === "c" && s >= 1) S.draw.line(c, ax.X(1), ax.T, ax.X(1), ax.B, P.grey, 1.2, [3, 3]);
      if (s >= 2) d.zeros.forEach(function(z){ S.draw.dot(c, ax.X(z), ax.Y(0), 6, P.amber); });
      if (s >= 3){ d.va.forEach(function(x){ S.draw.line(c, ax.X(x), ax.T, ax.X(x), ax.B, P.red, 1.6, [6, 5]); }); d.lines.forEach(function(l){ S.draw.line(c, ax.L, ax.Y(l.m * w[0] + l.p), ax.R, ax.Y(l.m * w[1] + l.p), P.violet, 1.6, [6, 5]); }); }
      if (s >= 4) d.crit.forEach(function(q){ S.draw.line(c, ax.X(q[0]), ax.Y(0), ax.X(q[0]), ax.Y(q[1]), P.light, 1.2, [3, 3]); });
      if (s >= 5) d.crit.forEach(function(q){ S.draw.dot(c, ax.X(q[0]), ax.Y(q[1]), 6, q[2] === "max" ? P.red : P.green); clipped(c, ax, function(){ S.draw.line(c, ax.X(q[0]) - 18, ax.Y(q[1]), ax.X(q[0]) + 18, ax.Y(q[1]), q[2] === "max" ? P.red : P.green, 2); }); });
      if (s === 6){
        var pts = d.zeros.map(function(z){ return [z, 0]; }).concat(d.crit.map(function(q){ return [q[0], q[1]]; })).sort(function(a, b){ return a[0] - b[0]; });
        ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = P.grey; ctx.beginPath(); pts.forEach(function(p, i){ var cut = i && d.va.some(function(v){ return v > pts[i - 1][0] && v < p[0]; }); if (i && !cut) ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); else ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); }); ctx.stroke(); ctx.restore();
      }
      if (s < 7) S.draw.fn(c, ax, d.f, "rgba(31,75,158,.12)", 3, [2, 5]);
      S.draw.label(c, d.n, ax.L + 10, ax.T + 14, {color:P.acc, align:"left", size:12, math:true});
      if (s === 7){ S.draw.fn(c, ax, d.f, P.acc, 3); }
      var leg = [];
      if (s >= 2) leg.push([P.amber, "zéros"]); if (s >= 3 && (d.va.length || d.lines.length)) leg.push([P.red, "asymptotes", true]); if (s >= 5) leg.push([P.green, "extrema"]);
      if (leg.length) S.draw.legend(c, leg, ax.R - 118, ax.T + 4);
      plTable(c, S, gb + 22, TVD[sel.value], s);
      nt.set("<b>Étape " + s + " / 7.</b> " + (s <= 6 ? d.st[s - 1] : "<b>Tracé :</b> on relie les points de repère par une courbe lisse qui respecte les variations et les asymptotes. Contrôle : les extrema du tableau sont bien aux sommets de la courbe."), "ok");
    });
  }
});

/* 2. f' dessinée -> f */
var KX = [-2, -1, 0, 1, 2];
var PRE = {A:[2, 1, 0, -1, -2], B:[1.5, -0.5, -1.5, -0.5, 1.5], C:[1, 1.5, 1, 0.5, 1], D:[1, 0, 1, 0.5, 1]};
SFA.sim({
  id:"m5-c07-f-fprime", ch:"c07", tag:"Classique",
  titre:"Dessine f′, obtiens les variations de f",
  resume:"Déplace les points de f′ : le tableau de variations de f se remplit.",
  but:"Fais glisser les cinq points rouges de la courbe de f′ (en haut). En bas, f est reconstruite (avec f(−2) = 0) et le tableau de variations s'écrit tout seul.",
  aRetenir:"Là où f′ > 0, f monte ; là où f′ < 0, f descend ; un extremum de f est un zéro de f′ <b>où le signe change</b>. Si f′ touche l'axe sans le traverser, il n'y a pas d'extremum.",
  piege:"La courbe de f′ n'est pas la courbe de f : un point haut de f′ n'est pas un maximum de f. Seul le signe de f′ commande les variations de f.",
  build:function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(240);
    var ys = PRE.B.slice(), ax1, ax2, drag = -1;
    k.seg("Départ", [["A", "Un maximum"], ["B", "Deux extrema"], ["C", "Toujours croissante"], ["D", "Touche l'axe"]], "B", function(v){ ys = PRE[v].slice(); });
    var nt = k.note("", "ok");
    c1.pointer(function(type, p){
      if (type === "down"){ var best = 0, bd = 1e9; KX.forEach(function(x, i){ var dd = Math.abs(ax1.X(x) - p.x); if (dd < bd){ bd = dd; best = i; } }); drag = best; }
      if ((type === "down" || type === "drag") && drag >= 0){ ys[drag] = Math.max(-3, Math.min(3, Math.round(ax1.iy(p.y) * 10) / 10)); k.redraw(); }
      if (type === "up") drag = -1;
    });
    function fp(x){ var i = Math.max(0, Math.min(3, Math.floor(x + 2 - 1e-12))); var t = x - KX[i]; return ys[i] * (1 - t) + ys[i + 1] * t; }
    k.draw(function(){
      c1.clear(); c2.clear();
      var N = 400, fv = [0], i, h = 4 / N;
      for (i = 1; i <= N; i++){ var x0 = -2 + (i - 1) * h, x1 = x0 + h; fv.push(fv[i - 1] + (fp(x0 + 1e-12) + fp(x1 - 1e-12)) / 2 * h); }
      var lo = Math.min.apply(null, fv), hi = Math.max.apply(null, fv), pad = (hi - lo) * 0.15 + 0.3;
      ax1 = S.draw.axes(c1, {x0:-2.4, x1:2.4, y0:-3.3, y1:3.3, xl:"x", yl:"f′", stepX:1, stepY:1, b:26});
      ax2 = S.draw.axes(c2, {x0:-2.4, x1:2.4, y0:lo - pad, y1:hi + pad, xl:"x", yl:"f", stepX:1, b:26});
      c1.ctx.beginPath(); KX.forEach(function(x, j){ if (j) c1.ctx.lineTo(ax1.X(x), ax1.Y(ys[j])); else c1.ctx.moveTo(ax1.X(x), ax1.Y(ys[j])); }); c1.ctx.strokeStyle = P.red; c1.ctx.lineWidth = 2.4; c1.ctx.stroke();
      KX.forEach(function(x, j){ S.draw.dot(c1, ax1.X(x), ax1.Y(ys[j]), 8, P.red); });
      c2.ctx.beginPath(); fv.forEach(function(v, j){ var x = -2 + j * h; if (j) c2.ctx.lineTo(ax2.X(x), ax2.Y(v)); else c2.ctx.moveTo(ax2.X(x), ax2.Y(v)); }); c2.ctx.strokeStyle = P.acc; c2.ctx.lineWidth = 2.6; c2.ctx.stroke();
      /* points critiques */
      var cr = [], j;
      for (j = 0; j < 4; j++){ if (ys[j] * ys[j + 1] < 0) cr.push({x:KX[j] + ys[j] / (ys[j] - ys[j + 1]), type:ys[j] > 0 ? "max" : "min"}); }
      for (j = 1; j < 4; j++){ if (Math.abs(ys[j]) < 1e-9){ if (ys[j - 1] * ys[j + 1] < 0) cr.push({x:KX[j], type:ys[j - 1] > 0 ? "max" : "min"}); else if (ys[j - 1] * ys[j + 1] > 0) cr.push({x:KX[j], type:"none"}); } }
      cr.sort(function(a, b){ return a.x - b.x; });
      var fat = function(x){ var idx = Math.round((x + 2) / h); return fv[Math.max(0, Math.min(N, idx))]; };
      cr.forEach(function(q){ if (q.type !== "none") S.draw.dot(c2, ax2.X(q.x), ax2.Y(fat(q.x)), 6, q.type === "max" ? P.red : P.green); else S.draw.dot(c2, ax2.X(q.x), ax2.Y(fat(q.x)), 5, P.amber); });
      var bounds = [-2].concat(cr.map(function(q){ return q.x; })).concat([2]);
      var cols = [["x", "f′", "f"], ["−2", "", F(fv[0], 2)]];
      for (j = 0; j < bounds.length - 1; j++){
        var v3 = fp((bounds[j] + bounds[j + 1]) / 2);
        cols.push(["", v3 > 1e-9 ? "+" : v3 < -1e-9 ? "−" : "0", v3 > 1e-9 ? "↗" : v3 < -1e-9 ? "↘" : "→"]);
        if (j < cr.length) cols.push([F(cr[j].x, 2), "0", cr[j].type === "none" ? "pas d'extremum" : (cr[j].type === "max" ? "max " : "min ") + F(fat(cr[j].x), 2)]);
      }
      cols.push(["2", "", F(fv[N], 2)]);
      var tb = tbl([0, 1, 2].map(function(r){ return cols.map(function(cc){ return cc[r]; }); }));
      var flat = false; for (j = 0; j < 4; j++) if (Math.abs(ys[j]) < 1e-9 && Math.abs(ys[j + 1]) < 1e-9) flat = true;
      nt.set((flat ? "<b>Attention :</b> f′ = 0 sur tout un intervalle, donc f y est constante ; le tableau ci-dessous ne détecte pas d'extremum sur ce palier.<br>" : "") + "f(−2) = 0 est imposé : f est connue à une constante près, mais ses variations ne changent pas.<br><b>Tableau de variations construit à partir du signe de f′ :</b>" + tb + (cr.length ? "" : "<br>f′ ne s'annule pas en changeant de signe : f est strictement monotone."), "ok");
    });
  }
});

/* 3. Appariement f / f' */
var BK = [
  {f:function(x){ return x*x*x/3 - x; }, d:function(x){ return x*x - 1; }, cr:"un maximum local en x = −1 et un minimum local en x = 1"},
  {f:function(x){ return -x*x*x/3 + x; }, d:function(x){ return -x*x + 1; }, cr:"un minimum local en x = −1 et un maximum local en x = 1"},
  {f:function(x){ return Math.pow(x, 4)/4 - x*x/2; }, d:function(x){ return x*x*x - x; }, cr:"des minimums locaux en x = ±1 et un maximum local en x = 0"},
  {f:function(x){ return x*x/2 - x; }, d:function(x){ return x - 1; }, cr:"un minimum en x = 1"},
  {f:function(x){ return 1/(1 + x*x); }, d:function(x){ return -2*x/Math.pow(1 + x*x, 2); }, cr:"un maximum en x = 0"},
  {f:function(x){ return 2*x/(1 + x*x); }, d:function(x){ return 2*(1 - x*x)/Math.pow(1 + x*x, 2); }, cr:"un minimum local en x = −1 et un maximum local en x = 1"}
];
SFA.sim({
  id:"m5-c07-appariement", ch:"c07", tag:"Défi",
  titre:"Quelle courbe est f′ ?",
  resume:"Une courbe f, quatre candidates : trouve celle de f′ en lisant les variations.",
  but:"Observe f en haut. Touche, parmi A, B, C, D, la courbe qui peut être f′ : cherche où f a ses extrema (f′ y vaut 0) et où f monte (f′ > 0).",
  aRetenir:"Les zéros de f′ sont aux abscisses des extrema de f. f′ > 0 là où f croît, f′ < 0 là où f décroît. Les candidates pièges : f elle-même, −f′, et f′ décalée (zéros au mauvais endroit). Repère les graduations : −2, −1, 1, 2.",
  piege:"Ne choisis pas la courbe qui « ressemble » à f : f et f′ n'ont en général pas la même forme. Vérifie les zéros et les signes.",
  build:function(k, S){
    var c1 = k.canvas(170), c2 = k.canvas(290);
    var ro = k.readouts(["Question", "Réussies"]);
    var nt = k.note("Touche l'une des quatre courbes.", "");
    var q = {i:-1, order:[], chosen:-1}, ok = 0, tot = 0, boxes = [];
    function nouvelle(){ var i; do { i = Math.floor(Math.random() * BK.length); } while (i === q.i); q.i = i; q.chosen = -1;
      var b = BK[i], cand = [b.d, b.f, function(x){ return -b.d(x); }, function(x){ return b.d(x - 1.2); }], idx = [0, 1, 2, 3];
      for (var j = 3; j > 0; j--){ var r = Math.floor(Math.random() * (j + 1)), t = idx[j]; idx[j] = idx[r]; idx[r] = t; }
      q.order = idx.map(function(z){ return cand[z]; }); q.ans = idx.indexOf(0); nt.set("Touche l'une des quatre courbes.", ""); }
    k.button("Nouvelle question", function(){ nouvelle(); }, true);
    c2.pointer(function(type, p){ if (type !== "down" || q.chosen >= 0) return; boxes.forEach(function(b, i){ if (p.x >= b[0] && p.x <= b[0] + b[2] && p.y >= b[1] && p.y <= b[1] + b[3]){
      q.chosen = i; tot++; var good = i === q.ans; if (good) ok++;
      nt.set((good ? "<b>Bien vu.</b> " : "<b>Pas cette fois : la bonne est " + "ABCD"[q.ans] + ".</b> ") + "f possède " + BK[q.i].cr + " : f′ s'annule là, avec le bon changement de signe (+ puis − pour un maximum, − puis + pour un minimum)." + (!good ? " Ta courbe ne s'annule pas aux bons endroits, ou n'a pas les bons signes." : ""), good ? "ok" : "warn"); k.redraw(); } }); });
    nouvelle();
    k.draw(function(){
      c1.clear(); c2.clear(); var b = BK[q.i], X0 = -2.5, X1 = 2.5, i, M = 0;
      var ax = S.draw.axes(c1, {x0:X0, x1:X1, y0:-2, y1:2, xl:"x", yl:"f", stepX:1, stepY:1, b:24, t:10});
      S.draw.fn(c1, ax, b.f, P.acc, 2.8);
      for (i = 0; i < 4; i++) for (var x = X0; x <= X1; x += 0.05){ var v = q.order[i](x); if (isFinite(v)) M = Math.max(M, Math.abs(v)); }
      M = Math.max(M, 0.5) * 1.15; boxes = [];
      var gw = (c2.W - 12) / 2, gh = (c2.H - 12) / 2;
      for (i = 0; i < 4; i++){
        var bx = 4 + (i % 2) * (gw + 4), by = 4 + Math.floor(i / 2) * (gh + 4); boxes.push([bx, by, gw, gh]);
        var ctx = c2.ctx; ctx.save(); ctx.fillStyle = q.chosen >= 0 ? (i === q.ans ? "rgba(46,107,85,.14)" : i === q.chosen ? "rgba(180,35,24,.12)" : "#fff") : "#fff"; ctx.fillRect(bx, by, gw, gh);
        ctx.strokeStyle = q.chosen >= 0 && i === q.ans ? P.green : "#c9d1db"; ctx.lineWidth = q.chosen >= 0 && i === q.ans ? 2.5 : 1; ctx.strokeRect(bx, by, gw, gh);
        ctx.beginPath(); ctx.rect(bx, by, gw, gh); ctx.clip();
        var X = function(x){ return bx + 8 + (x - X0) / (X1 - X0) * (gw - 16); }, Y = function(y){ return by + gh / 2 - y / M * (gh / 2 - 14); };
        ctx.strokeStyle = "#aab4c0"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, Y(0)); ctx.lineTo(bx + gw, Y(0)); ctx.moveTo(X(0), by); ctx.lineTo(X(0), by + gh); [-2, -1, 1, 2].forEach(function(t){ ctx.moveTo(X(t), Y(0) - 4); ctx.lineTo(X(t), Y(0) + 4); }); ctx.stroke();
        ctx.strokeStyle = P.red; ctx.lineWidth = 2.4; ctx.beginPath(); var st = false;
        for (var xx = X0; xx <= X1 + 1e-9; xx += 0.03){ var yy = q.order[i](xx); if (!isFinite(yy)){ st = false; continue; } if (!st){ ctx.moveTo(X(xx), Y(yy)); st = true; } else ctx.lineTo(X(xx), Y(yy)); }
        ctx.stroke(); ctx.restore();
        S.draw.text(c2, "ABCD"[i], bx + 14, by + 14, {size:14, color:P.ink});
      }
      ro.set(0, String(tot + (q.chosen >= 0 ? 0 : 1))); ro.set(1, ok + " / " + tot);
    });
  }
});

/* 4. Famille x + m/x */
SFA.sim({
  id:"m5-c07-famille", ch:"c07", tag:"Niche utile",
  titre:"Une famille de fonctions : f(x) = x + m/x",
  resume:"Selon m, la courbe a deux extrema ou aucun ; l'asymptote oblique ne bouge pas.",
  but:"Tire le point orange de la courbe (ou règle m de −4 à 4) : combien d'extrema ? où ? Que reste-t-il quand m = 0 ? Quelles droites ne changent jamais ?",
  aRetenir:"f′(x) = 1 − m/x². Si m > 0 : f′ s'annule en x = ±√m, extrema f(±√m) = ±2√m (maximum local à gauche, minimum local à droite). Si m < 0 : f′ > 0, aucun extremum. Pour m ≠ 0 : asymptote verticale x = 0 et oblique y = x (pour m = 0, f(x) = x).",
  piege:"Pour une famille, on discute selon la valeur du paramètre : le nombre de solutions de f′(x) = 0 dépend de m. Ne suppose pas « les mêmes extrema » pour tout m.",
  build:function(k, S){
    var c = k.canvas(430);
    var m = k.slider("m", -4, 4, 0.5, 2, "");
    var ro = k.readouts(["Extrema", "Valeurs extrêmes", "Asympt. verticale", "Asympt. oblique"]);
    var nt = k.note("", "ok"), axf = null, dg = false;
    c.pointer(function(t, q){
      if (!axf) return;
      if (t === "down") dg = Math.hypot(q.x - axf.X(2), q.y - axf.Y(2 + m.value / 2)) < 34;
      if ((t === "down" || t === "drag") && dg){ m.set(Math.max(-4, Math.min(4, Math.round(3.5 * (axf.iy(q.y) - 3.5) * 2) / 2))); k.redraw(); }
      if (t === "up") dg = false;
    });
    k.draw(function(){
      c.clear(); var M = m.value, f = function(x){ return x === 0 ? NaN : x + M / x; };
      var ax = axf = S.draw.axes(c, {x0:-6, x1:6, y0:-10, y1:10, stepX:2, stepY:2, xl:"x", yl:"y"});
      S.draw.line(c, ax.X(-6), ax.Y(-6), ax.X(6), ax.Y(6), P.violet, 1.5, [6, 5]);
      if (M !== 0) S.draw.line(c, ax.X(0), ax.T, ax.X(0), ax.B, P.red, 1.5, [6, 5]);
      S.draw.fn(c, ax, f, P.acc, 2.8);
      S.draw.glow(c, ax.X(3.5), ax.Y(3.5 + M / 3.5), 16, P.amber, 0.45); S.draw.dot(c, ax.X(3.5), ax.Y(3.5 + M / 3.5), 7, P.amber);
      S.draw.label(c, "↕ tire : m = " + F(M, 1), ax.X(3.5) + 12, ax.Y(3.5 + M / 3.5) + 18, {color:P.amber, align:"left", size:11.5});
      S.draw.label(c, "y = x", ax.R - 8, ax.Y(5.2) , {color:P.violet, align:"right", size:11});
      if (M !== 0) S.draw.label(c, "x = 0", ax.X(0) + 8, ax.B - 14, {color:P.red, align:"left", size:11});
      if (M > 0){ var r = Math.sqrt(M); S.draw.label(c, "max local " + F(-2 * r, 2), ax.X(-r) - 6, ax.Y(-2 * r) + 20, {color:P.red, align:"right", size:11}); S.draw.label(c, "min local " + F(2 * r, 2), ax.X(r) + 8, ax.Y(2 * r) + 20, {color:P.green, align:"left", size:11}); S.draw.dot(c, ax.X(-r), ax.Y(-2 * r), 6, P.red); S.draw.dot(c, ax.X(r), ax.Y(2 * r), 6, P.green); S.draw.line(c, ax.X(-r) - 20, ax.Y(-2 * r), ax.X(-r) + 20, ax.Y(-2 * r), P.red, 2); S.draw.line(c, ax.X(r) - 20, ax.Y(2 * r), ax.X(r) + 20, ax.Y(2 * r), P.green, 2); }
      ro.set(0, M > 0 ? "2 (x = ±" + F(Math.sqrt(M), 2) + ")" : "0"); ro.set(1, M > 0 ? "−" + F(2 * Math.sqrt(M), 2) + " (max) et " + F(2 * Math.sqrt(M), 2) + " (min)" : "—");
      ro.set(2, M !== 0 ? "x = 0" : "aucune"); ro.set(3, M !== 0 ? "y = x" : "aucune (f = x)");
      nt.set(M > 0 ? "m > 0 : f′(x) = 1 − m/x² = 0 ⇔ x² = m. En −√m, f passe de ↗ à ↘ : <b>maximum local</b> f(−√m) = −2√m = " + F(-2 * Math.sqrt(M), 2) + " ; en +√m, ↘ puis ↗ : <b>minimum local</b> " + F(2 * Math.sqrt(M), 2) + ". Remarque : le « maximum local » est plus bas que le « minimum local »." : M < 0 ? "m < 0 : f′(x) = 1 + |m|/x² > 0 partout : f est croissante sur chaque branche, aucun extremum." : "m = 0 : f(x) = x + 0/x = x pour x ≠ 0 : une droite privée du point (0 ; 0). Plus d'asymptote verticale.", "ok");
    });
  }
});
})();
