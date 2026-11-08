/* Chimie BA1 · L06 · Gaz — simulations SFA originales */
(function(){
var R = 8.314, NA = 6.02214076e23;
var GAS = {
  H2:{n:"H₂", M:2.016, col:"#7aa7e0"}, He:{n:"He", M:4.003, col:"#e0a23c"}, H2O:{n:"H₂O (vapeur)", M:18.015, col:"#5aa9c9"},
  N2:{n:"N₂", M:28.014, col:"#2f5fb3"}, O2:{n:"O₂", M:31.998, col:"#c0392b"}, CO2:{n:"CO₂", M:44.009, col:"#3b4350"}
};
/* ---- aides 3D communes (projection en perspective douce, tri par profondeur) ---- */
function rot3(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}
function proj3(p, st, sc, cx, cy){
  var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * 0.09);
  return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s};
}
function dragView(c, st){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = Math.max(-1.45, Math.min(1.45, st.b + (p.y - st.ly) * 0.012)); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
}
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function ball(ctx, x, y, r, hex, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, shade(hex, 0.75)); g.addColorStop(0.45, hex); g.addColorStop(1, shade(hex, -0.45));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.restore();
}
function stick(ctx, x1, y1, x2, y2, w, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col || "#5f6b7a"; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}

/* ---------- 1. Loi des gaz parfaits : piston 3D ---------- */
SFA.sim({
  id:"uc-L06-piston-3d", ch:"L06", tag:"Gaz",
  titre:"Loi des gaz parfaits : un piston en 3D",
  resume:"Un cylindre à piston, des particules en 3D et la loi PV = nRT : change V, T ou n et lis la pression.",
  but:"Choisis si le piston est bloqué (le volume est imposé, on lit P) ou libre (la pression extérieure est imposée, le piston se déplace et on lit V). Fais varier n et T : les particules vont plus vite, plus nombreuses ou plus à l'étroit, et la courbe P(V) montre où tu te trouves. Glisse sur le cylindre pour le tourner.",
  aRetenir:"PV = nRT avec R = 8,314 J·mol⁻¹·K⁻¹ ; avec V en L et T en K, P = n·8,314·T / V s'obtient directement en kPa. Boyle : P·V constant à T et n fixés. Charles : V/T constant à P et n fixés. Gay-Lussac : P/T constant à V et n fixés. Avogadro : V/n constant à T et P fixés. T toujours en kelvin.",
  piege:"La température se met en kelvin (T = θ + 273,15) : doubler 25 °C ne double pas T. Et la pression d'un gaz parfait ne dépend pas de sa nature : à n, V et T égaux, He et CO₂ exercent la même pression. Au-delà de quelques bars, le gaz réel s'écarte du modèle parfait.",
  build:function(k, S){
    var c = k.canvas(330), g = k.canvas(190);
    var P = S.draw.palette;
    var st = {a:0.55, b:0.5, H:null, parts:[], flash:0, tprev:null};
    dragView(c, st); st.onview = function(){ k.redraw(); };
    var VMAX = 20, HMAX = 2.9, RC = 0.65;
    var mode = k.seg("Piston", [["bloque","Bloqué (V imposé)"],["libre","Libre (P imposée)"]], "bloque", function(){ k.redraw(); });
    var gs = k.select("Gaz", Object.keys(GAS).map(function(q){ return [q, GAS[q].n]; }), "N2");
    var nS = k.slider("Quantité de gaz n", 0.2, 1, 0.05, 0.5, "mol");
    var tS = k.slider("Température T", 200, 600, 5, 300, "K");
    var vS = k.slider("Volume V (piston bloqué)", 0.5, 20, 0.5, 5, "L");
    var pS = k.slider("Pression extérieure (piston libre)", 250, 1000, 10, 500, "kPa");
    var ro = k.readouts(["Pression P", "Volume V", "Température", "Nombre de particules", "Vitesse quadratique v<sub>rms</sub>", "P·V / (n·T)"]);
    var nt = k.note("", "ok");
    function state(){
      var n = nS.value, T = tS.value, V, Pk;
      if (mode.value === "bloque"){ V = vS.value; Pk = n * R * T / V; }
      else { Pk = pS.value; V = n * R * T / Pk; }
      return {n:n, T:T, V:V, P:Pk};
    }
    function seed(){
      var N = 50; st.parts = [];
      for (var i = 0; i < N; i++){
        var gx = gauss(), gy = gauss(), gz = gauss(), r = Math.sqrt(Math.random()), th = Math.random() * 6.283;
        st.parts.push({x:r * Math.cos(th) * RC * 0.85, y:Math.random() * 1.0 + 0.05, z:r * Math.sin(th) * RC * 0.85, gx:gx, gy:gy, gz:gz});
      }
    }
    function gauss(){ var u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }
    seed();
    var lp = k.loop(function(dt){
      var s = state(), N = Math.max(1, Math.round(s.n * 50)), target = Math.max(0.1, HMAX * Math.min(s.V, VMAX) / VMAX);
      if (st.H == null) st.H = target;
      var dH = target - st.H; st.H += Math.sign(dH) * Math.min(Math.abs(dH), 1.6 * dt);
      var sp = 0.95 * Math.sqrt(s.T / 300);
      st.flash = Math.max(0, st.flash - dt * 4);
      for (var i = 0; i < st.parts.length; i++){
        var p = st.parts[i]; p.on = i < N; if (!p.on) continue;
        p.x += p.gx * sp * dt; p.y += p.gy * sp * dt; p.z += p.gz * sp * dt;
        var rr = Math.hypot(p.x, p.z);
        if (rr > RC - 0.07){ var nx = p.x / rr, nz = p.z / rr, dot = p.gx * nx + p.gz * nz; if (dot > 0){ p.gx -= 2 * dot * nx; p.gz -= 2 * dot * nz; } p.x = nx * (RC - 0.07); p.z = nz * (RC - 0.07); }
        if (p.y < 0.07){ p.y = 0.07; p.gy = Math.abs(p.gy); }
        if (p.y > st.H - 0.07){ p.y = st.H - 0.07; if (p.gy > 0){ p.gy = -p.gy; st.flash = 1; } }
      }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, s = state(), gas = GAS[gs.value];
      vS.el.closest(".ctl").style.display = mode.value === "bloque" ? "" : "none";
      pS.el.closest(".ctl").style.display = mode.value === "libre" ? "" : "none";
      c.clear();
      var Hc = st.H == null ? 1 : st.H, sc = Math.min(W * 0.4, H * 0.3), cx = W * 0.5, cy = H * 0.5, y0 = -HMAX / 2;
      function pt(x, y, z){ return proj3([x, y + y0, z], st, sc, cx, cy); }
      /* cylindre : anneaux bas et haut, génératrices */
      var NR = 36, ringB = [], ringT = [], i;
      for (i = 0; i < NR; i++){ var an = i / NR * 6.2832; ringB.push(pt(RC * Math.cos(an), 0, RC * Math.sin(an))); ringT.push(pt(RC * Math.cos(an), Hc, RC * Math.sin(an))); }
      ctx.save();
      ctx.fillStyle = "rgba(30,63,143,.05)"; ctx.beginPath(); ringB.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "rgba(15,27,45,.28)"; ctx.lineWidth = 1.2;
      for (i = 0; i < NR; i += 3){ ctx.beginPath(); ctx.moveTo(ringB[i].x, ringB[i].y); ctx.lineTo(ringT[i].x, ringT[i].y); ctx.stroke(); }
      ctx.restore();
      /* règle de volume sur le côté */
      var rx = W * 0.5 - sc * 1.55;
      var pb = pt(0, 0, 0), top = proj3([0, y0 + HMAX, 0], st, sc, cx, cy);
      /* particules triées par profondeur */
      var N = Math.max(1, Math.round(s.n * 50)), items = [];
      st.parts.forEach(function(p){ if (!p.on) return; var q = pt(p.x, p.y, p.z); q.p = p; items.push(q); });
      items.sort(function(a, b){ return a.z - b.z; });
      items.forEach(function(q){ ball(ctx, q.x, q.y, 6.5 * q.s, gas.col, 1); });
      /* piston : disque translucide, tige, masses */
      ctx.save();
      ctx.fillStyle = "rgba(95,107,122,.30)";
      ctx.beginPath(); ringT.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#3b4350"; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
      var tc = pt(0, Hc, 0), nw = mode.value === "libre" ? Math.max(1, Math.round(s.P / 250)) : 0, rodTop = proj3([0, y0 + Hc + 0.55 + nw * 0.0, 0], st, sc, cx, cy);
      var ctop = proj3([0, y0 + Hc + 0.42, 0], st, sc, cx, cy);
      stick(ctx, tc.x, tc.y, ctop.x, ctop.y, 5, "#3b4350");
      if (mode.value === "libre"){
        for (i = 0; i < nw; i++){ var wy = proj3([0, y0 + Hc + 0.1 + i * 0.12, 0], st, sc, cx, cy); ctx.fillStyle = "#6b7a8c"; ctx.fillRect(wy.x - 26, wy.y - 7, 52, 7); ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 1; ctx.strokeRect(wy.x - 26, wy.y - 7, 52, 7); }
      } else {
        S.draw.text(c, "piston bloqué", ctop.x + 12, ctop.y - 12, {size:10.5, color:P.grey, align:"left"});
      }
      /* repère de volume : anneau fantôme à 20 L et étiquette V au niveau du piston */
      var ghost = [];
      for (i = 0; i < NR; i++){ var an2 = i / NR * 6.2832; ghost.push(pt(RC * Math.cos(an2), HMAX, RC * Math.sin(an2))); }
      ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = "rgba(95,107,122,.55)"; ctx.lineWidth = 1.2; ctx.beginPath(); ghost.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.stroke(); ctx.restore();
      S.draw.text(c, "20 L", ghost[0].x + 8, ghost[0].y - 2, {size:10, color:P.grey, align:"left", weight:600});
      S.draw.text(c, "V = " + S.fmt(s.V, 1) + " L", tc.x + RC * sc * 1.15, tc.y, {size:12, color:P.red, align:"left"});
      S.draw.text(c, "Glisse pour tourner · 1 particule dessinée ≈ 0,02 mol", W / 2, H - 8, {size:10, color:P.grey, weight:600});
      /* manomètre : barre logarithmique */
      var gx = 12, gy1 = 28, gy2 = H - 36, lg = function(p){ return Math.max(0, Math.min(1, (Math.log10(Math.max(p, 10)) - 1) / 3.2)); };
      ctx.fillStyle = "#eef2f7"; ctx.fillRect(gx, gy1, 14, gy2 - gy1);
      var fh = (gy2 - gy1) * lg(s.P); ctx.fillStyle = s.P > 1000 ? P.red : P.acc; ctx.fillRect(gx, gy2 - fh, 14, fh);
      [10, 100, 1000, 10000].forEach(function(v){ var yy = gy2 - (gy2 - gy1) * lg(v); S.draw.line(c, gx + 14, yy, gx + 19, yy, "#8a95a3", 1); S.draw.text(c, S.fmt(v, 0), gx + 22, yy, {size:9, color:P.grey, align:"left", weight:600}); });
      S.draw.text(c, "P (kPa, échelle log)", gx - 6, 14, {size:10, color:P.grey, align:"left"});
      S.draw.text(c, S.fmt(s.P, s.P < 100 ? 1 : 0) + " kPa", gx + 20, gy2 + 14, {size:11.5, color:s.P > 1000 ? P.red : P.acc});
      /* graphique P(V) */
      g.clear(); var gc = g.ctx;
      var ymax = s.P * 1.8 < 600 ? 600 : (s.P * 1.8 < 1500 ? 1500 : 4000);
      var ax = S.draw.axes(g, {x0:0, x1:VMAX, y0:0, y1:ymax, xl:"V (L)", yl:"P (kPa)", l:52, b:30});
      [[tS.value * 0.6, "#9fb0c8", "0,6 T"], [tS.value * 1.5, "#e7b7ab", "1,5 T"], [tS.value, P.acc, "T"]].forEach(function(q, j){
        var Tq = Math.min(q[0], 900); S.draw.fn(g, ax, function(v){ return s.n * R * Tq / v; }, q[1], j === 2 ? 2.8 : 1.6, j === 2 ? null : [5, 4]);
      });
      var px = ax.X(Math.min(s.V, VMAX)), py = ax.Y(Math.min(s.P, ymax));
      S.draw.dot(g, px, py, 7, P.red);
      S.draw.text(g, "isotherme T = " + S.fmt(s.T, 0) + " K, n = " + S.fmt(s.n, 2) + " mol", ax.R - 6, ax.T + 10, {size:10.5, color:P.acc, align:"right"});
      /* lectures */
      ro.set(0, S.fmt(s.P, s.P < 100 ? 1 : 0) + " kPa = " + S.fmt(s.P / 101.325, 2) + " atm");
      ro.set(1, S.fmt(s.V, 2) + " L");
      ro.set(2, S.fmt(s.T, 0) + " K = " + S.fmt(s.T - 273.15, 0) + " °C");
      ro.set(3, S.sci(s.n * NA, 2));
      ro.set(4, S.fmt(Math.sqrt(3 * R * s.T / (gas.M / 1000)), 0) + " m/s");
      ro.set(5, S.fmt(s.P * s.V / (s.n * s.T), 3) + " = R");
      var warns = [];
      if (s.V > VMAX + 1e-9) warns.push("Le volume dépasse l'échelle du dessin (" + S.fmt(s.V, 1) + " L).");
      if (s.V < 2.4 * 0.1 / HMAX * VMAX * 0 + 0.0) warns.push("");
      if (s.P > 1000) warns.push("P > 10 bar : un gaz réel s'écarte déjà du modèle parfait (forces intermoléculaires, volume propre).");
      nt.set((mode.value === "bloque" ? "Piston bloqué : P = nRT/V = " + S.fmt(s.n, 2) + " × 8,314 × " + S.fmt(s.T, 0) + " / " + S.fmt(s.V, 1) + " = <b>" + S.fmt(s.P, 1) + " kPa</b>." : "Piston libre : le piston s'arrête quand la pression du gaz égale la pression extérieure : V = nRT/P = <b>" + S.fmt(s.V, 2) + " L</b>.") + " Chaque particule frappe la paroi d'autant plus fort et plus souvent que T est élevée et V petit." + (warns.filter(Boolean).length ? "<br>" + warns.filter(Boolean).join(" ") : ""), s.P > 1000 || s.V > VMAX ? "warn" : "ok");
    });
  }
});

/* ---------- 2. Distribution de Maxwell–Boltzmann ---------- */
function maxw(M, T){   /* densité f(v) des vitesses (s/m), M en kg/mol */
  var a = M / (2 * Math.PI * R * T), b = M / (2 * R * T);
  return function(v){ return 4 * Math.PI * Math.pow(a, 1.5) * v * v * Math.exp(-b * v * v); };
}
function fracAbove(M, T, v0){
  var f = maxw(M, T), vmax = 9 * Math.sqrt(3 * R * T / M), N = 3000, h = (vmax - v0) / N, s = 0;
  if (v0 >= vmax) return 0;
  for (var i = 0; i <= N; i++){ var w = i === 0 || i === N ? 1 : (i % 2 ? 4 : 2); s += w * f(v0 + i * h); }
  return Math.min(1, s * h / 3);
}
SFA.sim({
  id:"uc-L06-maxwell-boltzmann", ch:"L06", tag:"Gaz",
  titre:"Distribution de Maxwell–Boltzmann des vitesses",
  resume:"Compare les vitesses des molécules de deux gaz à deux températures, et la fraction qui dépasse un seuil ou une énergie d'activation.",
  but:"Choisis un gaz, éventuellement un second pour comparer, et règle la température. Les trois vitesses caractéristiques s'affichent. Place un seuil (en vitesse ou en énergie d'activation) : l'aire colorée est la fraction de molécules au-dessus. En bas, un échantillon de molécules en mouvement : les rouges sont au-dessus du seuil.",
  aRetenir:"f(v) = 4π (M/2πRT)<sup>3/2</sup> v² e<sup>−Mv²/2RT</sup>. v<sub>mp</sub> = √(2RT/M) < v<sub>moy</sub> = √(8RT/πM) < v<sub>rms</sub> = √(3RT/M). Plus T augmente, plus la courbe s'étale et s'abaisse (l'aire reste égale à 1) ; plus M augmente, plus la courbe se resserre vers les faibles vitesses. La queue à haute énergie explique pourquoi la vitesse d'une réaction croît vite avec T.",
  piege:"La vitesse la plus probable n'est pas la vitesse moyenne ni la vitesse quadratique moyenne : v<sub>mp</sub> < v<sub>moy</sub> < v<sub>rms</sub> (rapports 1 : 1,128 : 1,225). Attention aussi : M se met en kg/mol (et non g/mol) dans ces formules avec R = 8,314 J·mol⁻¹·K⁻¹.",
  build:function(k, S){
    var c = k.canvas(300), c2 = k.canvas(150);
    var P = S.draw.palette;
    var st = {parts:null};
    var g1 = k.select("Gaz 1", Object.keys(GAS).map(function(q){ return [q, GAS[q].n]; }), "N2");
    var g2 = k.select("Gaz 2 (comparaison)", [["none","— aucun —"]].concat(Object.keys(GAS).map(function(q){ return [q, GAS[q].n]; })), "He");
    var tS = k.slider("Température T", 100, 1000, 10, 300, "K");
    var tm = k.seg("Seuil", [["v","En vitesse v₀"],["e","En énergie E<sub>a</sub>"]], "v");
    var v0 = k.slider("Vitesse seuil v₀", 0, 3000, 10, 800, "m/s");
    var ea = k.slider("Énergie seuil E<sub>a</sub> (par mole)", 0, 30, 0.5, 5, "kJ/mol");
    var ro = k.readouts(["v<sub>mp</sub> (gaz 1)", "v<sub>moy</sub> (gaz 1)", "v<sub>rms</sub> (gaz 1)", "Fraction au-dessus du seuil (gaz 1)", "Fraction au-dessus (gaz 2)", "Seuil en vitesse"]);
    var nt = k.note("", "ok");
    function gauss(){ var u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }
    function seed(){ st.parts = []; for (var i = 0; i < 90; i++) st.parts.push({x:Math.random(), y:Math.random(), a:Math.random() * 6.283, gx:gauss(), gy:gauss(), gz:gauss()}); }
    seed();
    var lp = k.loop(function(dt){
      var M = GAS[g1.value].M / 1000, T = tS.value, sg = Math.sqrt(R * T / M);
      st.parts.forEach(function(p){
        var vx = p.gx * sg, vy = p.gy * sg, f = 0.00018;   /* échelle d'affichage : 1 m/s ↔ 0,00018 largeurs/s */
        p.x += vx * f * dt; p.y += vy * f * dt * 1.6;
        if (p.x < 0){ p.x = -p.x; p.gx = Math.abs(p.gx); } if (p.x > 1){ p.x = 2 - p.x; p.gx = -Math.abs(p.gx); }
        if (p.y < 0){ p.y = -p.y; p.gy = Math.abs(p.gy); } if (p.y > 1){ p.y = 2 - p.y; p.gy = -Math.abs(p.gy); }
      });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, A = GAS[g1.value], B = g2.value === "none" ? null : GAS[g2.value], T = tS.value;
      v0.el.closest(".ctl").style.display = tm.value === "v" ? "" : "none";
      ea.el.closest(".ctl").style.display = tm.value === "e" ? "" : "none";
      c.clear(); c2.clear();
      var Ma = A.M / 1000, fa = maxw(Ma, T), fb = B ? maxw(B.M / 1000, T) : null;
      var vmpA = Math.sqrt(2 * R * T / Ma), vavA = Math.sqrt(8 * R * T / (Math.PI * Ma)), vrmsA = Math.sqrt(3 * R * T / Ma);
      var vthr = tm.value === "v" ? v0.value : Math.sqrt(2 * ea.value * 1000 / Ma);
      var vx1 = 3000;
      var peak = Math.max(fa(vmpA), B ? fb(Math.sqrt(2 * R * T / (B.M / 1000))) : 0) * 1.15;
      var sc = 1e3;   /* ordonnée en 10⁻³ s/m */
      var ax = S.draw.axes(c, {x0:0, x1:vx1, y0:0, y1:peak * sc, xl:"v (m/s)", yl:"f(v) (10⁻³ s/m)", l:54, b:32, stepX:500});
      /* aire au-dessus du seuil (gaz 1) */
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      if (vthr < vx1){
        ctx.beginPath(); ctx.moveTo(ax.X(vthr), ax.Y(0));
        for (var v = vthr; v <= vx1; v += 6) ctx.lineTo(ax.X(v), ax.Y(fa(v) * sc));
        ctx.lineTo(ax.X(vx1), ax.Y(0)); ctx.closePath(); ctx.fillStyle = "rgba(180,35,24,.28)"; ctx.fill();
        if (B){ ctx.beginPath(); ctx.moveTo(ax.X(vthr), ax.Y(0)); for (v = vthr; v <= vx1; v += 6) ctx.lineTo(ax.X(v), ax.Y(fb(v) * sc)); ctx.lineTo(ax.X(vx1), ax.Y(0)); ctx.closePath(); ctx.fillStyle = "rgba(180,83,9,.18)"; ctx.fill(); }
      }
      ctx.restore();
      S.draw.fn(c, ax, function(v){ return fa(v) * sc; }, P.acc, 3);
      if (B) S.draw.fn(c, ax, function(v){ return fb(v) * sc; }, P.amber, 3);
      /* repères de v_mp, v_moy, v_rms (gaz 1) */
      [[vmpA, "v mp", "right"], [vavA, "v moy", "left"], [vrmsA, "v rms", "left"]].forEach(function(q, i){
        if (q[0] < vx1){ S.draw.line(c, ax.X(q[0]), ax.Y(0), ax.X(q[0]), ax.T + 38 + i * 12, P.acc, 1.2, [4, 3]); S.draw.text(c, q[1], ax.X(q[0]) + (q[2] === "left" ? 3 : -3), ax.T + 38 + i * 12 - 6, {size:9.5, color:P.acc, align:q[2]}); }
      });
      if (vthr < vx1){ S.draw.line(c, ax.X(vthr), ax.T, ax.X(vthr), ax.B, P.red, 2); S.draw.text(c, "seuil", ax.X(vthr), ax.T + 8, {size:10, color:P.red, bg:"rgba(255,255,255,.8)"}); }
      var lx = ax.R - 8;
      S.draw.text(c, A.n + " à " + S.fmt(T, 0) + " K", lx, ax.T + 10, {size:11.5, color:P.acc, align:"right"});
      if (B) S.draw.text(c, B.n + " à " + S.fmt(T, 0) + " K", lx, ax.T + 26, {size:11.5, color:P.amber, align:"right"});
      /* échantillon de molécules */
      var w2 = c2.W, h2 = c2.H, c2x = c2.ctx, sg = Math.sqrt(R * T / Ma);
      c2x.fillStyle = "#f6f8fb"; c2x.fillRect(4, 4, w2 - 8, h2 - 8);
      var nAbove = 0;
      st.parts.forEach(function(p){
        var sp = Math.sqrt(p.gx * p.gx + p.gy * p.gy + p.gz * p.gz) * sg, hi = sp >= vthr; if (hi) nAbove++;
        ball(c2x, 10 + p.x * (w2 - 20), 10 + p.y * (h2 - 20), 5.2, hi ? "#b42318" : A.col === "#3b4350" ? "#6b7a8c" : A.col, 1);
      });
      S.draw.text(c2, "90 molécules " + A.n + " : " + nAbove + " au-dessus du seuil", 10, h2 - 14, {size:10.5, color:P.grey, align:"left", bg:"rgba(246,248,251,.9)"});
      /* lectures */
      var frA = fracAbove(Ma, T, vthr), frB = B ? fracAbove(B.M / 1000, T, vthr) : null;
      function pc(x){ return x < 1e-4 ? S.sci(x * 100, 2) + " %" : S.fmt(x * 100, x < 0.1 ? 2 : 1) + " %"; }
      ro.set(0, S.fmt(vmpA, 0) + " m/s"); ro.set(1, S.fmt(vavA, 0) + " m/s"); ro.set(2, S.fmt(vrmsA, 0) + " m/s");
      ro.set(3, pc(frA)); ro.set(4, B ? pc(frB) : "—");
      ro.set(5, S.fmt(vthr, 0) + " m/s" + (tm.value === "e" ? " (½Mv² = E<sub>a</sub>)" : ""));
      var warn = "";
      if (vthr >= vx1) warn = " Le seuil sort de l'échelle du graphique (v₀ ≥ 3000 m/s).";
      var extra = "";
      if (tm.value === "e"){
        var x = ea.value * 1000 / (R * T);
        extra = " E<sub>a</sub>/RT = " + S.fmt(x, 2) + " : la fraction vaut environ e<sup>−E<sub>a</sub>/RT</sup> × un facteur de l'ordre de 2√(x/π) = " + pc(Math.exp(-x)) + " × " + S.fmt(2 * Math.sqrt(x / Math.PI), 2) + " pour x grand (la queue de la distribution des énergies).";
      }
      nt.set("v<sub>mp</sub> : v<sub>moy</sub> : v<sub>rms</sub> = 1 : " + S.fmt(vavA / vmpA, 3) + " : " + S.fmt(vrmsA / vmpA, 3) + ". Fraction de molécules de " + A.n + " au-dessus du seuil : <b>" + pc(frA) + "</b>." + (B ? " Pour " + B.n + " : " + pc(frB) + "." : "") + extra + warn, "ok");
    });
  }
});
})();
