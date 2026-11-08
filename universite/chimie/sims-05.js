/* Chimie BA1 · c05 · Thermochimie et spontanéité — contenu SFA original */
(function(){
var R = 8.314;
function sciT(x, d){ if (!isFinite(x) || x === 0) return "0"; var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), m = x / Math.pow(10, e), sup = "⁰¹²³⁴⁵⁶⁷⁸⁹", es = String(Math.abs(e)).replace(/\d/g, function(q){ return sup[q]; }); if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e++; es = String(Math.abs(e)).replace(/\d/g, function(q){ return sup[q]; }); } return (+m.toFixed(d)).toString().replace(".", ",") + "·10" + (e < 0 ? "⁻" : "") + es; }
/* diagramme en cascade (waterfall) : steps = [{l:"étiquette", v:valeur, col, tot:true pour une barre depuis 0, s:"sous-texte"}] */
function waterfall(c, S, x0, y0, w, h, steps, opt){
  opt = opt || {}; var ctx = c.ctx, P = S.draw.palette, cum = [0], i, lo = 0, hi = 0;
  steps.forEach(function(s, j){ var a = j ? cum[j] : 0; var nx = s.tot ? s.v : a + s.v; cum.push(nx); lo = Math.min(lo, a, nx); hi = Math.max(hi, a, nx); });
  var pad = (hi - lo) * 0.14 + 1; lo -= pad; hi += pad; var labH = opt.labH || 44, top = y0 + 8, bot = y0 + h - labH;
  function Y(v){ return bot - (v - lo) / (hi - lo) * (bot - top); }
  var n = steps.length, slot = (w - 40) / n, bw = Math.min(opt.bw || 70, slot - 12), base = x0 + 36;
  S.draw.line(c, base - 6, Y(0), x0 + w - 4, Y(0), "#94a3b8", 1.4, [4, 3]); S.draw.text(c, "0", base - 12, Y(0), {size:10, color:P.grey, align:"right", weight:700});
  steps.forEach(function(s, j){
    var a = j && !s.tot ? cum[j] : 0, b = cum[j + 1], x = base + j * slot + (slot - bw) / 2, ya = Y(a), yb = Y(b), up = b >= a;
    var col = s.col || (s.v >= 0 ? P.amber : P.green);
    if (j < n - 1 && !steps[j + 1].tot){ S.draw.line(c, x + bw, yb, x + slot + (slot - bw) / 2 - 0, yb, "#cbd5e1", 1.4, [3, 3]); }
    ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = s.tot ? 0.95 : 0.88; S.draw.rrect(c, x, Math.min(ya, yb), bw, Math.max(Math.abs(yb - ya), 3), 5); ctx.fill(); ctx.restore();
    var txt = (s.v > 0 && !s.tot ? "+" : "") + S.fmt(s.v, s.d == null ? 0 : s.d).replace(/^-/, "−");
    S.draw.label(c, txt, x + bw / 2, up ? Math.min(ya, yb) - 12 : Math.max(ya, yb) + 12, {color:col, size:opt.fs || 11.5});
    var lines = String(s.l).split("|"); lines.forEach(function(t, q){ S.draw.text(c, t, x + bw / 2, y0 + h - labH + 14 + q * 12.5, {size:opt.ls || 10, color:q ? P.grey : "#1e293b", weight:q ? 600 : 800}); });
    if (s.s) S.draw.text(c, s.s, x + bw / 2, y0 + h - 6, {size:9, color:P.grey, weight:600});
    if (s.in && Math.abs(yb - ya) > 34){ String(s.in).split("|").forEach(function(t, q, arr){ S.draw.text(c, t, x + bw / 2, (ya + yb) / 2 + q * 13 - (arr.length - 1) * 6.5, {size:10.5, color:"#fff", weight:800}); }); }
  });
  return {Y:Y, base:base, slot:slot, lo:lo, hi:hi};
}


/* ---------- 1. Cycle de Born–Haber ---------- */
var MET = {Li:{sub:159.4, ie:520.2, r:76}, Na:{sub:107.5, ie:495.8, r:102}, K:{sub:89.0, ie:418.8, r:138}, Cs:{sub:76.5, ie:375.7, r:167}};
var HAL = {F:{at:79.4, ea:-328.0, r:133, nom:"½F₂(g) → F(g)"}, Cl:{at:121.3, ea:-349.0, r:181, nom:"½Cl₂(g) → Cl(g)"}, Br:{at:111.9, ea:-324.6, r:196, nom:"½Br₂(l) → Br(g)"}, I:{at:106.8, ea:-295.2, r:220, nom:"½I₂(s) → I(g)"}};
var DF = {LiF:-616.0,LiCl:-408.6,LiBr:-351.2,LiI:-270.4,NaF:-573.6,NaCl:-411.2,NaBr:-361.1,NaI:-287.8,KF:-568.6,KCl:-436.5,KBr:-393.8,KI:-327.9,CsF:-553.5,CsCl:-443.0,CsBr:-405.8,CsI:-346.6};
function lat(m, x){ var a = MET[m], b = HAL[x]; return a.sub + a.ie + b.at + b.ea - DF[m + x]; }
SFA.sim({
  id:"uc-c05-born-haber", ch:"c05", tag:"Thermochimie",
  titre:"Cycle de Born–Haber : l'énergie réticulaire des halogénures alcalins",
  resume:"Construis le cycle de formation d'un sel MX et déduis l'énergie réticulaire ; observe qu'elle suit environ 1/(r₊ + r₋).",
  but:"Choisis un métal alcalin et un halogène. La cascade additionne sublimation, ionisation, atomisation de l'halogène et affinité électronique, puis la formation du réseau ramène à ΔfH°. En dessous, les 16 sels sont comparés : clique sur un point pour le choisir.",
  aRetenir:"Loi de Hess : ΔfH°(MX) = ΔsubH(M) + I₁(M) + ΔatH(X) + ΔH<sub>ea</sub>(X) + ΔH<sub>réseau</sub>. L'énergie réticulaire U = −ΔH<sub>réseau</sub> se déduit par différence. Elle croît quand les ions sont petits : U est ≈ proportionnelle à 1/(r₊ + r₋) (loi de Coulomb), d'où LiF &gt; NaF &gt; … &gt; CsI.",
  piege:"Chaque étape a son signe : sublimation, ionisation et atomisation sont endothermiques ; l'affinité électronique du chlore est exothermique (−349 kJ/mol) ; la formation du réseau l'est très fortement. Si ΔfH° d'un sel est très négative, ce n'est pas seulement le réseau : c'est le bilan de tout le cycle. Les valeurs sont des moyennes de tables à 298 K.",
  build:function(k, S){
    var c = k.canvas(560);
    var ms = k.select("Métal alcalin M", [["Li","Li"],["Na","Na"],["K","K"],["Cs","Cs"]], "Na");
    var hs = k.select("Halogène X", [["F","F"],["Cl","Cl"],["Br","Br"],["I","I"]], "Cl");
    var ro = k.readouts(["ΔfH°(MX, s)", "Somme des étapes avant réseau", "Énergie réticulaire U", "r₊ + r₋"]);
    var nt = k.note("", "ok");
    var pts = [];
    c.pointer(function(type, p){ if (type !== "down") return; var best = null, bd = 22; pts.forEach(function(q){ var d = Math.hypot(p.x - q.x, p.y - q.y); if (d < bd){ bd = d; best = q; } }); if (best){ ms.set(best.m); hs.set(best.xx); k.redraw(); } });
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, m = ms.value, x = hs.value, a = MET[m], b = HAL[x], key = m + x, ph = W < 420;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var Uv = lat(m, x), wfH = 280;
      S.draw.text(c, "Cascade des enthalpies (kJ/mol) : M(s) + ½X₂ → MX(s)".replace(/M/g, "M").replace("M(s)", m + "(s)").replace("½X₂", "½" + x + "₂").replace("MX(s)", m + x + "(s)"), 12, 14, {size:ph ? 10.5 : 12, align:"left", color:P.ink, weight:800});
      waterfall(c, S, 6, 22, W - 12, wfH, [
        {l:(ph ? "sublim.|" : "sublimation|") + m, v:a.sub, d:1, col:P.amber, s:""},
        {l:(ph ? "ionis.|" : "1ʳᵉ ionisation|") + m, v:a.ie, d:1, col:P.amber},
        {l:(ph ? "atomis.|½" : "atomisation|½") + x + "₂", v:b.at, d:1, col:P.amber},
        {l:(ph ? "aff. él.|" : "affinité él.|") + x, v:b.ea, d:1, col:P.green},
        {l:(ph ? "réseau|" + m + x : "réseau|" + m + "⁺ + " + x + "⁻"), v:-Uv, d:0, col:P.red},
        {l:"ΔfH°|" + m + x + "(s)", v:DF[key], d:1, col:P.mat, tot:true}
      ], {labH:48, fs:ph ? 10.5 : 11.5, ls:ph ? 9 : 10, bw:62});
      /* nuage U contre 1/(r₊ + r₋) : on clique pour choisir un autre sel */
      var sx0 = 54, sx1 = W - 16, sy0 = wfH + 66, sy1 = H - 40;
      S.draw.text(c, (ph ? "U selon 1000/(r₊+r₋) : clique un point" : "Énergie réticulaire U (kJ/mol) selon 1000/(r₊ + r₋) : clique un point"), 12, wfH + 40, {size:ph ? 10.5 : 11.5, align:"left", color:P.ink, weight:800});
      var inv = function(mm, xx){ return 1000 / (MET[mm].r + HAL[xx].r); };
      function X2(v){ return sx0 + (v - 2.5) / (5 - 2.5) * (sx1 - sx0); } function Y2(u){ return sy1 - (u - 550) / (1100 - 550) * (sy1 - sy0); }
      S.draw.line(c, sx0, sy1, sx1, sy1, "#94a3b8", 1.4); S.draw.line(c, sx0, sy0, sx0, sy1, "#94a3b8", 1.4);
      [2.5, 3, 3.5, 4, 4.5, 5].forEach(function(t){ S.draw.text(c, S.fmt(t, 1), X2(t), sy1 + 11, {size:9.5, color:P.grey}); S.draw.line(c, X2(t), sy1, X2(t), sy0, "#eef1f5", 1); });
      [600, 800, 1000].forEach(function(u){ S.draw.text(c, String(u), sx0 - 6, Y2(u), {size:9.5, color:P.grey, align:"right"}); S.draw.line(c, sx0, Y2(u), sx1, Y2(u), "#eef1f5", 1); });
      S.draw.text(c, "1000/(r₊+r₋) (nm⁻¹)", sx1, sy1 + 26, {size:10, color:P.grey, align:"right", weight:700});
      /* droite de tendance (moindres carrés simples sur les 16 sels) */
      var sxx = 0, sxy = 0, sx = 0, sy = 0, nn = 0; Object.keys(MET).forEach(function(mm){ Object.keys(HAL).forEach(function(xx){ var xv = inv(mm, xx), yv = lat(mm, xx); sx += xv; sy += yv; sxx += xv * xv; sxy += xv * yv; nn++; }); });
      var sl = (nn * sxy - sx * sy) / (nn * sxx - sx * sx), ic = (sy - sl * sx) / nn; S.draw.line(c, X2(2.5), Y2(ic + sl * 2.5), X2(5), Y2(ic + sl * 5), "#94a3b8", 1.5, [5, 4]);
      pts = [];
      Object.keys(MET).forEach(function(mm){ Object.keys(HAL).forEach(function(xx){ var on = mm === m && xx === x, px = X2(inv(mm, xx)), py = Y2(lat(mm, xx)); pts.push({x:px, y:py, m:mm, xx:xx}); S.draw.dot(c, px, py, on ? 8 : 4, on ? P.red : P.acc); if (on) S.draw.label(c, mm + xx, px - 10, py - 14, {color:P.red, size:11.5, align:"right"}); }); });
      var sumSteps = a.sub + a.ie + b.at + b.ea;
      ro.set(0, S.fmt(DF[key], 1) + " kJ/mol"); ro.set(1, S.fmt(sumSteps, 1) + " kJ/mol"); ro.set(2, S.fmt(Uv, 0) + " kJ/mol"); ro.set(3, (MET[m].r + HAL[x].r) + " pm");
      nt.set("U = " + S.fmt(a.sub, 1) + " + " + S.fmt(a.ie, 1) + " + " + S.fmt(b.at, 1) + " + (" + S.fmt(b.ea, 1) + ") − (" + S.fmt(DF[key], 1) + ") = " + S.fmt(Uv, 0) + " kJ/mol. Le sel est stable car le gain de réseau (" + S.fmt(Uv, 0) + ") dépasse nettement le coût de formation des ions gazeux (" + S.fmt(sumSteps, 0) + ").", "ok");
    });
  }
});

/* ---------- 2. ΔG, ΔG°, K et Q ---------- */
var RXN = [
  ["nh3","N₂ + 3 H₂ ⇌ 2 NH₃ (synthèse)",-92.2,-198.7],
  ["caco3","CaCO₃(s) ⇌ CaO(s) + CO₂(g)",178.3,160.5],
  ["h2og","H₂O(l) ⇌ H₂O(g)",44.0,118.8],
  ["glace","H₂O(s) ⇌ H₂O(l)",6.01,22.0],
  ["ch4","CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)",-802.3,-5.3]
];
SFA.sim({
  id:"uc-c05-deltag-k", ch:"c05", tag:"Thermochimie",
  titre:"ΔG° = ΔH° − TΔS° = −RT ln K : le sens d'une réaction selon T et Q",
  resume:"Fais varier T : ΔG° change de signe à T = ΔH°/ΔS°, K bascule. Fais glisser Q : ΔG = ΔG° + RT ln Q donne le sens spontané.",
  but:"Choisis une réaction (ΔH° et ΔS° supposés constants), puis règle la température et le quotient réactionnel Q. Lis ΔG°, K, ΔG et le sens d'évolution.",
  aRetenir:"ΔG° = ΔH° − TΔS° et ΔG° = −RT ln K ; ΔG = ΔG° + RT ln Q. ΔG &lt; 0 : sens direct spontané ; ΔG &gt; 0 : sens inverse ; ΔG = 0 : équilibre (Q = K). Si ΔH° et ΔS° ont le même signe, ΔG° change de signe à T<sub>c</sub> = ΔH°/ΔS°.",
  piege:"ΔG° n'est pas ΔG : le signe de ΔG° fixe K, pas le sens réel, qui dépend de Q. ΔG° &lt; 0 donne K &gt; 1 mais pas « la réaction se fait toujours ». ΔH° et ΔS° varient un peu avec T : le simulateur les suppose constants (approximation raisonnable sur quelques centaines de K). Unités : ΔH° en kJ/mol, ΔS° en J/(mol·K).",
  build:function(k, S){
    var c = k.canvas(360);
    var rs = k.select("Réaction", RXN.map(function(r){ return [r[0], r[1] + " (ΔH° = " + S.fmt(r[2], 1) + " kJ/mol ; ΔS° = " + S.fmt(r[3], 1) + " J/(mol·K))"]; }), "nh3");
    var tt = k.slider("Température T", 100, 1500, 5, 298, "K");
    var lq = k.slider("log₁₀ Q", -6, 6, 0.1, 0, "");
    var ro = k.readouts(["ΔG°", "K", "ΔG", "T<sub>c</sub> = ΔH°/ΔS°", "Sens spontané"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, r = RXN.filter(function(x){ return x[0] === rs.value; })[0], dH = r[2] * 1000, dS = r[3], T = tt.value, Q = Math.pow(10, lq.value);
      var dG0 = dH - T * dS, K = Math.exp(-dG0 / (R * T)), dG = dG0 + R * T * Math.log(Q), Tc = dH / dS;
      /* K peut dépasser la capacité d'un nombre flottant (combustion du méthane à basse T) : affichage en puissance de 10 */
      var lgK = -dG0 / (R * T) / Math.LN10, Ktxt = Math.abs(lgK) > 250 ? "10^" + S.fmt(lgK, 0) : S.sci(K, 2);
      c.clear();
      var lo = Math.min(dH - 100 * dS, dH - 1500 * dS) / 1000, hi = Math.max(dH - 100 * dS, dH - 1500 * dS) / 1000, pad = (hi - lo) * 0.1 + 5;
      var ax = S.draw.axes(c, {x0:100, x1:1500, y0:lo - pad, y1:hi + pad, xl:"T (K)", yl:"ΔG° (kJ/mol)", stepX:250});
      S.draw.fn(c, ax, function(t){ return (dH - t * dS) / 1000; }, P.acc, 2.8);
      S.draw.line(c, ax.X(T), ax.Y(lo - pad), ax.X(T), ax.Y(hi + pad), P.red, 1.3, [4,3]);
      S.draw.dot(c, ax.X(T), ax.Y(dG0 / 1000), 6, P.red);
      if (Tc > 100 && Tc < 1500 && dH * dS > 0){ S.draw.dot(c, ax.X(Tc), ax.Y(0), 6, P.green); S.draw.text(c, "T c = " + S.fmt(Tc, 0) + " K", ax.X(Tc), ax.Y(0) - 14, {size:12, color:P.green}); }
      var sens = Math.abs(dG) < 100 ? "équilibre (Q ≈ K)" : (dG < 0 ? "→ sens direct" : "← sens inverse");
      ro.set(0, S.fmt(dG0 / 1000, 1) + " kJ/mol"); ro.set(1, Ktxt); ro.set(2, S.fmt(dG / 1000, 1) + " kJ/mol");
      ro.set(3, (Tc > 0 && dH * dS > 0) ? S.fmt(Tc, 0) + " K" : "pas de changement de signe"); ro.set(4, sens);
      var why = dH < 0 && dS < 0 ? "ΔH° &lt; 0 et ΔS° &lt; 0 : favorable à basse température, défavorable à haute T." : dH > 0 && dS > 0 ? "ΔH° &gt; 0 et ΔS° &gt; 0 : favorisée par l'entropie, spontanée à haute T." : dH < 0 && dS > 0 ? "ΔH° &lt; 0 et ΔS° &gt; 0 : spontanée à toute température." : "ΔH° &gt; 0 et ΔS° &lt; 0 : jamais spontanée.";
      nt.set("ΔG° = " + S.fmt(r[2], 1) + " − " + S.fmt(T, 0) + " × (" + S.fmt(dS, 1) + ")/1000 = " + S.fmt(dG0 / 1000, 1) + " kJ/mol ; K = exp(−ΔG°/RT) = " + Ktxt + ". " + why + (Math.abs(T - Tc) < 60 && dH * dS > 0 ? " Près de T<sub>c</sub>, ΔG° est faible : la constante varie très vite avec T." : "") + (Math.abs(T - 298) > 400 ? " Extrapolation loin de 298 K : ΔH° et ΔS° ne sont plus vraiment constants (et l'état physique des espèces peut changer), résultat indicatif." : ""), Math.abs(T - 298) > 400 ? "warn" : "ok");
    });
  }
});

/* ---------- 3. Énergies de liaison ---------- */
var EB = {HH:436, ClCl:243, HCl:431, NN3:945, NH:391, CH:413, CC:347, CC2:614, OO2:498, CO2:799, CO2c:745, OH:463};
var NAMES = {HH:"H–H", ClCl:"Cl–Cl", HCl:"H–Cl", NN3:"N≡N", NH:"N–H", CH:"C–H", CC:"C–C", CC2:"C=C", OO2:"O=O", CO2:"C=O (dans CO₂)", OH:"O–H"};
var REAC = [
  ["hcl","H₂ + Cl₂ → 2 HCl",[["HH",1],["ClCl",1]],[["HCl",2]],-184.6,0],
  ["nh3","N₂ + 3 H₂ → 2 NH₃",[["NN3",1],["HH",3]],[["NH",6]],-92.2,0],
  ["h2o","2 H₂ + O₂ → 2 H₂O(g)",[["HH",2],["OO2",1]],[["OH",4]],-483.6,2],
  ["ch4","CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)",[["CH",4],["OO2",2]],[["CO2",2],["OH",4]],-802.3,2],
  ["c2h4","C₂H₄ + H₂ → C₂H₆",[["CC2",1],["HH",1]],[["CC",1],["CH",2]],-136.4,0]
];
SFA.sim({
  id:"uc-c05-energies-liaison", ch:"c05", tag:"Thermochimie",
  titre:"Estimer ΔH par les énergies de liaison",
  resume:"ΔH ≈ Σ liaisons rompues − Σ liaisons formées. Compare l'estimation à la valeur mesurée et mesure l'erreur.",
  but:"Choisis une réaction : la cascade monte de l'énergie des liaisons rompues puis redescend de celle des liaisons formées. Teste l'effet de la valeur de l'énergie C=O et de l'état de l'eau (gaz ou liquide) sur l'écart avec la mesure.",
  aRetenir:"ΔH ≈ Σ E(liaisons rompues) − Σ E(liaisons formées) en phase gazeuse. Rompre coûte de l'énergie (+), former en libère (−). C'est une estimation : les énergies sont des moyennes sur de nombreuses molécules.",
  piege:"Les liaisons formées s'écrivent en négatif : ne les additionne pas avec le même signe. Valable en phase gazeuse : si l'eau est liquide, ajoute −44 kJ par mole d'eau condensée. Les énergies de C=O varient : 799 kJ/mol dans CO₂, ≈ 745 dans un aldéhyde ou une cétone ; choisir la mauvaise valeur fausse le résultat de ≈ 100 kJ.",
  build:function(k, S){
    var c = k.canvas(400);
    var rs = k.select("Réaction", REAC.map(function(r){ return [r[0], r[1]]; }), "ch4");
    var co = k.seg("E(C=O) retenue", [[799,"799 (dans CO₂)"],[745,"745 (carbonyle)"]], 799);
    var lq = k.toggle("H₂O formée à l'état liquide (−44 kJ/mol)", false);
    var ro = k.readouts(["Σ liaisons rompues", "Σ liaisons formées", "ΔH estimé", "ΔH mesuré", "Écart"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, ph = W < 420, r = REAC.filter(function(x){ return x[0] === rs.value; })[0];
      UC.bg(c, "#f6f9fc", "#ffffff");
      function en(key){ return key === "CO2" ? +co.value : EB[key]; }
      var sb = 0, sf = 0, lb = [], lf = [];
      r[2].forEach(function(b){ sb += en(b[0]) * b[1]; lb.push(b[1] + "×" + NAMES[b[0]].replace(" (dans CO₂)", "")); }); r[3].forEach(function(b){ sf += en(b[0]) * b[1]; lf.push(b[1] + "×" + NAMES[b[0]].replace(" (dans CO₂)", "")); });
      var cond = lq.value ? 44 * r[5] : 0, dH = sb - sf - cond, exp = r[4] - cond;
      var steps = [
        {l:"liaisons rompues|" + lb.join(" + "), v:sb, col:P.amber, in:lb.join("|")},
        {l:"liaisons formées|" + lf.join(" + "), v:-sf, col:P.green, in:lf.join("|")}
      ];
      if (cond) steps.push({l:"H₂O(g) → H₂O(l)|" + r[5] + " × (−44)", v:-cond, col:P.teal});
      steps.push({l:"ΔH estimé|", v:dH, col:P.mat, tot:true});
      var wfw = ph ? W - 12 : Math.min(W - 12, 430);
      waterfall(c, S, 6, 8, W - 12, H - 100, steps, {labH:50, bw:ph ? 64 : 78, fs:ph ? 10.5 : 12, ls:ph ? 9 : 10});
      /* comparaison estimé / mesuré */
      var by = H - 76, mx = Math.max(Math.abs(dH), Math.abs(exp), 1) * 1.05, neg = dH < 0 && exp < 0, pos = dH >= 0 && exp >= 0, cx0 = neg ? W - 26 : pos ? 26 : W / 2, av = neg ? cx0 - 150 : pos ? W - 26 - cx0 - 150 : W / 2 - 150;
      S.draw.panel(c, 8, by - 14, W - 16, 74, {shadow:false, title:"Estimé · mesuré"});
      [[dH, "estimé", P.mat, by + 18], [exp, "mesuré", P.grey, by + 42]].forEach(function(q){ var w = q[0] / mx * av; ctx.save(); ctx.fillStyle = q[2]; S.draw.rrect(c, q[0] < 0 ? cx0 + w : cx0, q[3] - 8, Math.max(Math.abs(w), 2), 16, 4); ctx.fill(); ctx.restore(); S.draw.text(c, q[1] + " " + S.fmt(q[0], 0) + " kJ/mol", q[0] < 0 ? cx0 + w - 8 : cx0 + w + 8, q[3], {size:11.5, color:q[2], align:q[0] < 0 ? "right" : "left", weight:800}); });
      S.draw.line(c, cx0, by + 4, cx0, by + 52, "#94a3b8", 1.2);
      ro.set(0, "+" + sb + " kJ"); ro.set(1, "−" + sf + " kJ"); ro.set(2, S.fmt(dH, 0) + " kJ/mol"); ro.set(3, S.fmt(exp, 0) + " kJ/mol"); ro.set(4, S.fmt(dH - exp, 0) + " kJ/mol (" + S.fmt(Math.abs(dH - exp) / Math.abs(exp) * 100, 0) + " %)");
      var warn = Math.abs(dH - exp) / Math.abs(exp) > 0.08;
      nt.set("ΔH ≈ " + sb + " − " + sf + (lq.value && r[5] ? " − " + (44 * r[5]) : "") + " = " + S.fmt(dH, 0) + " kJ/mol, mesure " + S.fmt(exp, 1) + " kJ/mol. " + (warn ? "Écart supérieur à 8 % : valeurs moyennes d'énergie de liaison peu adaptées à cette réaction ou mauvais choix de la liaison C=O / de l'état de l'eau." : "Estimation correcte pour une méthode aussi simple."), warn ? "warn" : "ok");
    });
  }
});

/* ---------- 4. Calorimétrie ---------- */
var METAUX = [["Cu","cuivre",0.385],["Al","aluminium",0.897],["Fe","fer",0.449],["Zn","zinc",0.388],["Ag","argent",0.235],["Pb","plomb",0.129]];
SFA.sim({
  id:"uc-c05-calorimetrie", ch:"c05", tag:"Thermochimie",
  titre:"Calorimétrie : mélange thermique et neutralisation",
  resume:"Q = m·c·ΔT, bilan de chaleur nul dans un calorimètre : trouve la température finale d'un mélange ou la ΔT d'une neutralisation HCl/NaOH.",
  but:"Mode mélange : plonge un métal chaud dans de l'eau et regarde les deux températures se rejoindre en T<sub>f</sub>. Mode neutralisation : mélange un acide et une base fortes et lis l'élévation de température ; la quantité limitante fixe la chaleur dégagée. Le bouton « Rejouer » relance l'expérience.",
  aRetenir:"Σ Q = 0 dans un système isolé : m₁c₁(T<sub>f</sub> − T₁) + m₂c₂(T<sub>f</sub> − T₂) + C<sub>cal</sub>(T<sub>f</sub> − T₂) = 0. Pour une réaction : q = −n·ΔH, absorbée par la solution : ΔT = q/(m·c + C<sub>cal</sub>). ΔH<sub>neutralisation</sub> ≈ −55,8 kJ/mol de H₂O formée, acide fort + base forte.",
  piege:"Le calorimètre absorbe aussi de la chaleur (capacité C<sub>cal</sub>) : l'ignorer fait sous-estimer la chaleur dégagée. La réaction est limitée par le réactif en défaut. Modèle : solution diluée de masse volumique 1,00 g/mL et capacité thermique massique 4,18 J/(g·K), pertes de chaleur négligées.",
  build:function(k, S){
    var c = k.canvas(470);
    var md = k.seg("Mode", [["mix","Mélange eau + métal"],["neu","Neutralisation HCl + NaOH"]], "mix", function(){ tt = 0; });
    var mt = k.select("Métal (mélange)", METAUX.map(function(m){ return [m[0], m[1] + " (c = " + S.fmt(m[2], 3) + " J/(g·K))"]; }), "Cu");
    var m1 = k.slider("Masse du métal", 10, 500, 5, 100, "g");
    var t1 = k.slider("Température du métal", 30, 300, 5, 150, "°C");
    var m2 = k.slider("Masse d'eau", 50, 500, 5, 200, "g");
    var t2 = k.slider("Température initiale de l'eau", 5, 40, 1, 20, "°C");
    var cc = k.slider("Capacité du calorimètre C<sub>cal</sub>", 0, 200, 5, 20, "J/K");
    var ca = k.slider("Concentration HCl", 0.2, 2, 0.1, 1, "mol/L");
    var cb = k.slider("Concentration NaOH", 0.2, 2, 0.1, 1, "mol/L");
    var vv = k.slider("Volume de chaque solution", 25, 100, 5, 50, "mL");
    k.button("Rejouer l'expérience", function(){ tt = 0; }, true);
    var ro = k.readouts(["Résultat", "Chaleur échangée", "Détail"]);
    var nt = k.note("", "ok");
    var tt = 0;
    var MC = {Cu:"#c9803f", Al:"#b9c2cc", Fe:"#6b7280", Zn:"#9aa5b1", Ag:"#d8dee6", Pb:"#566070"};
    var lp = k.loop(function(dt){ if (tt < 9){ tt += dt; k.redraw(); } }); lp.play();
    function lerp(a, b, u){ return a + (b - a) * u; }
    function waterCol(T){ var f = Math.max(0, Math.min(1, (T - 5) / 70)); return "rgb(" + Math.round(lerp(150, 242, f)) + "," + Math.round(lerp(200, 170, f)) + "," + Math.round(lerp(242, 140, f)) + ")"; }
    function beaker(x, y, w, h, level, col, label){
      var ctx = c.ctx; ctx.save();
      ctx.fillStyle = col; ctx.globalAlpha = 0.85; S.draw.rrect(c, x + 3, y + h * (1 - level), w - 6, h * level - 3, 8); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = "#7c8a9c"; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x - 4, y - 6); ctx.lineTo(x, y); ctx.lineTo(x, y + h - 10); ctx.quadraticCurveTo(x, y + h, x + 10, y + h); ctx.lineTo(x + w - 10, y + h); ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 10); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 4, y - 6); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 8, y + 12); ctx.lineTo(x + 8, y + h - 24); ctx.stroke();
      ctx.restore(); if (label) S.draw.text(c, label, x + w / 2, y + h + 16, {size:11.5, color:"#334155", weight:700});
    }
    function thermo(x, y, h, T, lo, hi){
      var ctx = c.ctx, f = Math.max(0, Math.min(1, (T - lo) / (hi - lo)));
      ctx.save(); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#7c8a9c"; ctx.lineWidth = 2; S.draw.rrect(c, x - 6, y, 12, h, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#d6392f"; S.draw.rrect(c, x - 2.5, y + h - 6 - f * (h - 18), 5, f * (h - 18) + 6, 2.5); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y + h + 4, 9, 0, 7); ctx.fillStyle = "#d6392f"; ctx.fill(); ctx.strokeStyle = "#7c8a9c"; ctx.stroke();
      for (var i = 0; i <= 4; i++){ var yy = y + h - 6 - i / 4 * (h - 18); S.draw.line(c, x + 7, yy, x + 12, yy, "#94a3b8", 1.2); S.draw.text(c, Math.round(lo + (hi - lo) * i / 4) + "", x + 16, yy, {size:9, color:"#64748b", align:"left"}); }
      ctx.restore();
    }
    k.draw(function(){
      var Pl = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, ph = W < 420, mixm = md.value === "mix";
      [mt, m1, t1, m2, t2].forEach(function(q){ q.el.parentNode.style.display = mixm ? "" : "none"; });
      [ca, cb, vv].forEach(function(q){ q.el.parentNode.style.display = mixm ? "none" : ""; });
      UC.bg(c, "#f6f9fc", "#ffffff");
      var g = 1 - Math.exp(-tt / 1.8), cwv = 4.184, sceneH = 230;
      var Tm, Tw, Tf, q, curves, tmax = 9, ylo, yhi;
      if (mixm){
        var M = METAUX.filter(function(x){ return x[0] === mt.value; })[0], cm = M[2];
        Tf = (m1.value * cm * t1.value + (m2.value * cwv + cc.value) * t2.value) / (m1.value * cm + m2.value * cwv + cc.value);
        q = m1.value * cm * (t1.value - Tf); Tm = lerp(t1.value, Tf, g); Tw = lerp(t2.value, Tf, g);
        ylo = Math.min(t2.value, Tf) - 8; yhi = t1.value + 12;
        var bw = Math.min(150, W * 0.4), bx = W / 2 - bw / 2 - (ph ? 10 : 20), by = 40, bh = 150, lev = Math.min(0.85, 0.4 + m2.value / 800);
        beaker(bx, by, bw, bh, lev, waterCol(Tw), "eau : " + S.fmt(Tw, 1) + " °C");
        /* bloc métallique chauffé */
        var mw = 26 + m1.value / 14, mx = bx + bw / 2 - mw / 2, my = by + bh - mw - 8;
        var hot = Math.max(0, Math.min(1, (Tm - 40) / 240));
        S.draw.glow(c, mx + mw / 2, my + mw / 2, mw * 1.6, "#ff7a2f", 0.1 + 0.65 * hot);
        var gr = ctx.createLinearGradient(mx, my, mx + mw, my + mw); gr.addColorStop(0, UC.shade(MC[mt.value] || "#9aa5b1", 0.4)); gr.addColorStop(1, UC.shade(MC[mt.value] || "#9aa5b1", -0.3));
        ctx.save(); ctx.fillStyle = gr; S.draw.rrect(c, mx, my, mw, mw, 4); ctx.fill(); ctx.fillStyle = "rgba(255,90,20," + (0.5 * hot) + ")"; S.draw.rrect(c, mx, my, mw, mw, 4); ctx.fill(); ctx.restore();
        S.draw.text(c, mt.value, mx + mw / 2, my + mw / 2, {size:12, color:"#fff", weight:800});
        S.draw.label(c, "métal : " + S.fmt(Tm, 0) + " °C", bx + bw / 2, by - 16, {color:"#9a3412", size:11.5});
        /* flux de chaleur */
        var flow = (1 - g) * Math.min(1, Math.abs(q) / 20000 + 0.35);
        for (var i = 0; i < 4; i++){ var u = ((tt * 0.9) + i / 4) % 1, ang = -Math.PI / 2 + (i - 1.5) * 0.7, rr = 18 + u * 38; ctx.save(); ctx.globalAlpha = flow * (1 - u); S.draw.arrow(c, mx + mw / 2 + Math.cos(ang) * (mw / 2 + 4), my + mw / 2 + Math.sin(ang) * (mw / 2 + 4), mx + mw / 2 + Math.cos(ang) * (mw / 2 + rr), my + mw / 2 + Math.sin(ang) * (mw / 2 + rr), "#e0452f", 2.6); ctx.restore(); }
        thermo(W - (ph ? 54 : 70), 40, 140, Tw, Math.floor(Math.min(t2.value, Tf) / 10) * 10, Math.ceil(Math.max(Tf, t2.value + 5) / 10) * 10);
        S.draw.text(c, "thermomètre (eau)", W - (ph ? 54 : 70), 26, {size:10, color:Pl.grey, weight:700});
        ro.set(0, "T<sub>f</sub> = " + S.fmt(Tf, 1) + " °C"); ro.set(1, S.fmt(q, 0) + " J cédés par le métal"); ro.set(2, "ΔT eau = " + S.fmt(Tf - t2.value, 1) + " K");
        nt.set("T<sub>f</sub> = (" + m1.value + " × " + S.fmt(cm, 3) + " × " + t1.value + " + (" + m2.value + " × 4,184 + " + cc.value + ") × " + t2.value + ") / (" + m1.value + " × " + S.fmt(cm, 3) + " + " + m2.value + " × 4,184 + " + cc.value + ") = " + S.fmt(Tf, 1) + " °C." + (Tf > 95 ? " Attention : eau proche de l'ébullition, la vaporisation (non modélisée) fausserait le résultat." : ""), Tf > 95 ? "warn" : "ok");
        curves = [[Tm, t1.value, Pl.red, "métal"], [Tw, t2.value, Pl.acc, "eau"]];
      } else {
        var na = ca.value * vv.value / 1000, nb = cb.value * vv.value / 1000, nr = Math.min(na, nb), qq = nr * 55.8e3, mtot = 2 * vv.value * 1.0, T0 = 20;
        var dT = qq / (mtot * 4.18 + cc.value), lim = Math.abs(na - nb) < 1e-9 ? "mélange stœchiométrique" : (na < nb ? "HCl en défaut : NaOH en excès" : "NaOH en défaut : HCl en excès");
        Tf = T0 + dT; Tw = lerp(T0, Tf, g); ylo = T0 - 3; yhi = Math.max(T0 + 8, Tf + 4); q = qq;
        var bw2 = Math.min(90, W * 0.24), lev1 = 0.35 + vv.value / 400, pour = Math.min(1, tt / 1.6);
        beaker(14, 70, bw2, 120, lev1 * (1 - pour * 0.9), "#d9e6f8", "HCl " + S.fmt(ca.value, 1) + " mol/L");
        beaker(W / 2 - bw2 / 2 - (ph ? 24 : 6), 70, bw2, 120, lev1 * (1 - pour * 0.9), "#f1dcec", "NaOH " + S.fmt(cb.value, 1) + " mol/L");
        var rx = W - bw2 - (ph ? 54 : 84); beaker(rx, 60, bw2 + 20, 140, Math.min(0.85, 0.15 + pour * (lev1 * 1.3)), waterCol(Tw), "mélange : " + S.fmt(Tw, 1) + " °C");
        S.draw.arrow(c, 14 + bw2 + 6, 110, rx - 4, 110, Pl.red, 2.6 * pour + 0.5);
        thermo(W - (ph ? 28 : 40), 40, 140, Tw, Math.floor(ylo / 5) * 5, Math.ceil(yhi / 5) * 5);
        ro.set(0, "ΔT = " + S.fmt(dT, 2) + " K"); ro.set(1, S.fmt(qq, 0) + " J"); ro.set(2, "n limitant = " + S.fmt(nr, 3) + " mol");
        nt.set("q = n·|ΔH| = " + S.fmt(nr, 3) + " × 55,8·10³ = " + S.fmt(qq, 0) + " J ; ΔT = q/(m·c + C<sub>cal</sub>) = " + S.fmt(qq, 0) + " / (" + S.fmt(mtot, 0) + " × 4,18 + " + cc.value + ") = " + S.fmt(dT, 2) + " K. " + lim + ". (n(HCl) = " + S.fmt(na, 3) + " mol ; n(NaOH) = " + S.fmt(nb, 3) + " mol)", "ok");
        curves = [[Tw, T0, Pl.red, "mélange"]];
      }
      /* graphe T(t) : l'expérience se déroule dans le temps */
      var gx0 = 52, gx1 = W - 14, gy0 = sceneH + 24, gy1 = H - 36;
      S.draw.panel(c, 8, sceneH + 6, W - 16, H - sceneH - 14, {shadow:false, title:"Température en fonction du temps"});
      function X(t){ return gx0 + t / tmax * (gx1 - gx0); } function Y(T){ return gy1 - (T - ylo) / (yhi - ylo) * (gy1 - gy0 - 10); }
      S.draw.line(c, gx0, gy1, gx1, gy1, "#94a3b8", 1.4); S.draw.line(c, gx0, gy0, gx0, gy1, "#94a3b8", 1.4);
      var step = (yhi - ylo) > 150 ? 50 : (yhi - ylo) > 60 ? 20 : (yhi - ylo) > 20 ? 10 : 5;
      for (var v = Math.ceil(ylo / step) * step; v <= yhi; v += step){ S.draw.line(c, gx0, Y(v), gx1, Y(v), "#eef1f5", 1); S.draw.text(c, v + "", gx0 - 6, Y(v), {size:9.5, color:Pl.grey, align:"right"}); }
      S.draw.text(c, "t", gx1, gy1 + 14, {size:10.5, color:Pl.grey, align:"right", weight:700});
      S.draw.line(c, gx0, Y(Tf), gx1, Y(Tf), Pl.green, 1.6, [5, 4]); S.draw.label(c, "T f = " + S.fmt(Tf, 1) + " °C", gx1 - 4, Y(Tf) - 11, {color:Pl.green, size:11, align:"right"});
      curves.forEach(function(cv){
        var T1 = cv[1], Tfin = Tf;
        ctx.save(); ctx.strokeStyle = cv[2]; ctx.lineWidth = 3; ctx.beginPath(); for (var s = 0; s <= 60; s++){ var t = Math.min(tt, tmax) * s / 60, gg = 1 - Math.exp(-t / 1.8), T = lerp(T1, Tfin, gg); s ? ctx.lineTo(X(t), Y(T)) : ctx.moveTo(X(t), Y(T)); } ctx.stroke(); ctx.restore();
        S.draw.dot(c, X(Math.min(tt, tmax)), Y(cv[0]), 5.5, cv[2]); S.draw.text(c, cv[3], gx0 + 6, Y(cv[1]) + (cv[1] > Tf ? -10 : 12), {size:10.5, color:cv[2], align:"left", weight:800});
      });
    });
  }
});

/* ---------- 5. Couplage de l'ATP ---------- */
SFA.sim({
  id:"uc-c05-couplage-atp", ch:"c05", tag:"Biologie",
  titre:"Couplage à l'ATP : rendre possible une réaction défavorable",
  resume:"ΔG = ΔG°′ + RT ln([ADP][Pi]/[ATP]) : avec les concentrations cellulaires, l'hydrolyse de l'ATP libère ≈ −50 kJ/mol et déplace l'équilibre de millions de fois.",
  but:"Choisis une réaction A → B défavorable (ΔG°′ &gt; 0) : tu peux aussi faire glisser la poignée en haut de la 1ʳᵉ barre. Règle les concentrations d'ATP, d'ADP et de Pi : compare le rapport [B]/[A] à l'équilibre sans et avec couplage sur l'échelle logarithmique.",
  aRetenir:"ATP + H₂O → ADP + Pi : ΔG°′ = −30,5 kJ/mol (pH 7), mais ΔG réel = ΔG°′ + RT ln([ADP][Pi]/[ATP]) ≈ −50 kJ/mol dans la cellule, car le rapport ATP/ADP est maintenu très élevé. Pour une réaction couplée, les ΔG s'additionnent : le rapport [B]/[A] à l'équilibre est multiplié par exp(−ΔG<sub>ATP</sub>/RT).",
  piege:"Le couplage exige un intermédiaire commun (ou un transfert de groupe phosphoryle), pas seulement deux réactions « en même temps ». Le simulateur suppose 310 K, pH 7, Mg²⁺ ignoré, états standard de 1 mol/L pour ADP, Pi et ATP : il donne l'ordre de grandeur. Le rapport ATP/ADP cellulaire est maintenu loin de l'équilibre par le métabolisme.",
  build:function(k, S){
    var c = k.canvas(470);
    var dga = k.slider("ΔG°′ de A → B", -10, 40, 0.5, 13.8, "kJ/mol");
    var atp = k.slider("[ATP]", 0.5, 10, 0.1, 3, "mmol/L");
    var adp = k.slider("[ADP]", 0.01, 2, 0.01, 0.3, "mmol/L");
    var pi = k.slider("[Pi]", 0.5, 10, 0.1, 3, "mmol/L");
    var ro = k.readouts(["ΔG réel de l'hydrolyse de l'ATP", "[B]/[A] sans couplage", "[B]/[A] avec couplage", "Facteur gagné"]);
    var nt = k.note("", "ok");
    var geo = {}, drag = false;
    c.pointer(function(type, p){
      if (type === "down" && geo.hx != null && Math.hypot(p.x - geo.hx, p.y - geo.hy) < 22) drag = true;
      if (type === "up") drag = false;
      if (drag && geo.zero != null && (type === "drag" || type === "down")){ dga.set(Math.round((geo.zero - p.y) / geo.sc * 2) / 2); k.redraw(); }
    });
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, T = 310.15, RT = R * T / 1000;
      var q = (adp.value / 1000) * (pi.value / 1000) / (atp.value / 1000);
      var dgatp = -30.5 + RT * Math.log(q), A = dga.value, tot = A + dgatp;
      var K0 = Math.exp(-A / RT), K1 = Math.exp(-tot / RT);
      UC.bg(c, "#f6f9fc", "#ffffff");
      var chH = ph ? 290 : 300, zero = 44 + (chH - 70) * 0.42, sc = (chH - 70) * 0.5 / 55;
      S.draw.text(c, "ΔG (kJ/mol)", 12, 16, {size:11, align:"left", color:P.grey, weight:700});
      S.draw.line(c, 24, zero, W - 14, zero, "#94a3b8", 1.6, [5, 3]); S.draw.text(c, "0", 18, zero, {size:10, color:P.grey, align:"right", weight:700});
      var bars = [["A → B", A, P.red, "défavorable"], ["hydrolyse de l'ATP", dgatp, P.green, "favorable"], ["réaction couplée", tot, tot < 0 ? P.acc : P.amber, tot < 0 ? "favorable" : "encore défavorable"]];
      var bw = Math.min(100, (W - 90) / 3.3), gap = (W - 50 - 3 * bw) / 2;
      bars.forEach(function(b, i){
        var x = 32 + i * (bw + gap), y = zero - Math.max(-60, Math.min(60, b[1])) * sc;
        var bg = ctx.createLinearGradient(x, 0, x + bw, 0); bg.addColorStop(0, UC.shade(b[2], 0.25)); bg.addColorStop(1, b[2]);
        ctx.save(); ctx.fillStyle = bg; S.draw.rrect(c, x, Math.min(zero, y), bw, Math.max(Math.abs(y - zero), 3), 6); ctx.fill(); ctx.restore();
        S.draw.label(c, S.fmt(b[1], 1), x + bw / 2, b[1] > 0 ? y - 13 : y + 13, {color:b[2], size:12.5});
        S.draw.text(c, b[0], x + bw / 2, chH - 26, {size:ph ? 10.5 : 11.5, color:P.ink, weight:800}); S.draw.text(c, b[3], x + bw / 2, chH - 12, {size:10, color:P.grey, weight:700});
        if (i === 0){ geo.hx = x + bw / 2; geo.hy = y; S.draw.dot(c, x + bw / 2, y, 9, P.red); S.draw.text(c, "↕", x + bw / 2, y + 0.5, {size:10, color:"#fff", weight:800}); }
      });
      /* « + » et « = » entre les barres */
      var xs = [32 + bw + gap / 2, 32 + 2 * bw + 1.5 * gap]; S.draw.text(c, "+", xs[0], zero - 40, {size:22, color:P.grey, weight:800}); S.draw.text(c, "=", xs[1], zero - 40, {size:22, color:P.grey, weight:800});
      geo.zero = zero; geo.sc = sc;
      /* échelle logarithmique de [B]/[A] à l'équilibre */
      var gy = chH + 24, gx0 = 40, gx1 = W - 24, lo = -9, hi = 11;
      S.draw.panel(c, 8, chH + 4, W - 16, H - chH - 12, {title:"Rapport [B]/[A] à l'équilibre (échelle logarithmique)", shadow:false});
      function X(lg){ return gx0 + (lg - lo) / (hi - lo) * (gx1 - gx0); }
      var ay = gy + 44;
      S.draw.line(c, gx0, ay, gx1, ay, "#94a3b8", 2);
      for (var e = lo; e <= hi; e += 2){ S.draw.line(c, X(e), ay - 4, X(e), ay + 4, "#94a3b8", 1.4); S.draw.text(c, "10" + String(e).replace("-", "⁻").replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }), X(e), ay + 16, {size:9.5, color:P.grey}); }
      S.draw.line(c, X(0), ay - 10, X(0), ay + 10, P.ink, 1.6); S.draw.text(c, "1", X(0), ay - 18, {size:9.5, color:P.ink, weight:800});
      var l0 = Math.max(lo, Math.min(hi, Math.log(K0) / Math.LN10)), l1 = Math.max(lo, Math.min(hi, Math.log(K1) / Math.LN10));
      S.draw.arrow(c, X(l0), ay - 26, X(l1), ay - 26, P.green, 3);
      S.draw.dot(c, X(l0), ay, 7, P.red); S.draw.dot(c, X(l1), ay, 7, P.acc);
      S.draw.label(c, "sans : " + sciT(K0, 1), X(l0), ay + 38, {color:P.red, size:11, align:l0 < l1 ? "right" : "left"}); S.draw.label(c, "avec : " + sciT(K1, 1), X(l1), ay + 38, {color:P.acc, size:11, align:l0 < l1 ? "left" : "right"});
      ro.set(0, S.fmt(dgatp, 1) + " kJ/mol"); ro.set(1, S.sci(K0, 2)); ro.set(2, S.sci(K1, 2)); ro.set(3, "× " + S.sci(K1 / K0, 2));
      nt.set("ΔG(ATP) = −30,5 + 2,579 × ln[(" + S.fmt(adp.value, 2) + "·10⁻³ × " + S.fmt(pi.value, 1) + "·10⁻³)/(" + S.fmt(atp.value, 1) + "·10⁻³)] = " + S.fmt(dgatp, 1) + " kJ/mol. Couplée à A → B : ΔG = " + S.fmt(A, 1) + " + (" + S.fmt(dgatp, 1) + ") = " + S.fmt(tot, 1) + " kJ/mol, " + (tot < 0 ? "réaction globale favorable." : "encore défavorable : il faut un ATP/ADP plus élevé ou un couplage à plusieurs ATP.") , tot < 0 ? "ok" : "warn");
    });
  }
});
})();
