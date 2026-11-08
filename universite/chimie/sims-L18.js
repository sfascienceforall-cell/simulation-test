/* Chimie BA1 · L18 · Dérivés halogénés : substitutions et éliminations — simulations SFA originales */
(function(){
var PI = Math.PI, DEG = PI / 180, RT = 8.314 * 298.15 / 1000;   /* RT en kJ/mol à 298,15 K (R = 8,314 J·mol⁻¹·K⁻¹) */
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
function rot3(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}
function proj3(p, st, sc, cx, cy){
  var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * 0.04);
  return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s};
}
function dragView(c, st){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = Math.max(-1.45, Math.min(1.45, st.b + (p.y - st.ly) * 0.012)); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; }
  });
}
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function unit(a){ var l = Math.sqrt(dot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function ease(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function plotAxes(S, c, o){
  var ctx = c.ctx, L = o.l || 44, ax = {L:L, R:c.W - (o.r || 14), T:o.t || 22, B:c.H - (o.b || 28)};
  ax.X = function(x){ return ax.L + (x - o.x0) / (o.x1 - o.x0) * (ax.R - ax.L); };
  ax.Y = function(y){ return ax.B - (y - o.y0) / (o.y1 - o.y0) * (ax.B - ax.T); };
  ctx.save(); ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1;
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (var gy = Math.ceil(o.y0 / o.sy) * o.sy; gy <= o.y1 + 1e-9; gy += o.sy){ ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(gy)); ctx.lineTo(ax.R, ax.Y(gy)); ctx.stroke(); ctx.fillText(S.fmt(gy, 0), ax.L - 6, ax.Y(gy)); }
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax.L, ax.T); ctx.lineTo(ax.L, ax.B); ctx.lineTo(ax.R, ax.B); ctx.stroke(); ctx.restore();
  if (o.yl) S.draw.text(c, o.yl, ax.L, 9, {size:11.5, color:"#2c3a4e", align:"left"});
  if (o.xl) S.draw.text(c, o.xl, ax.R, ax.B + 17, {size:11.5, color:"#2c3a4e", align:"right"});
  return ax;
}

/* ---------- groupes, halogènes, nucléophiles ---------- */
var GR = {
  H:{lab:"H", r:0.36, col:"#e8edf3", L:1.09, txt:"#2c3a4e"},
  CH3:{lab:"CH₃", r:0.62, col:"#59657a", L:1.54},
  C2H5:{lab:"C₂H₅", r:0.74, col:"#4a5568", L:1.54},
  C3H7:{lab:"C₃H₇", r:0.84, col:"#3c4658", L:1.54},
  Ph:{lab:"Ph", r:0.86, col:"#7a5aa6", L:1.51}
};
var LGS = {Cl:{n:"Cl", L:1.77, r:0.78, col:"#2fa84f", adj:10}, Br:{n:"Br", L:1.94, r:0.86, col:"#9a2a1c", adj:0}, I:{n:"I", L:2.14, r:0.96, col:"#7b3fb0", adj:-8}};
var NUS = {OH:{n:"HO⁻", lab:"HO", L:1.43, r:0.66, col:"#d6392f", adj:0}, CN:{n:"NC⁻", lab:"NC", L:1.47, r:0.68, col:"#3b6ec2", adj:-5}, I:{n:"I⁻", lab:"I", L:2.14, r:0.96, col:"#7b3fb0", adj:-6}};
/* configuration CIP : le groupe partant X et le nucléophile Nu sont de rang 1 (halogène, O, ou C(N,N,N) > alkyle) */
function det3(a, b, c){ return dot(a, cross(b, c)); }
function descriptor(v1, v2, v3){ var d = det3(unit(v1), unit(v2), unit(v3)); if (Math.abs(d) < 0.12) return ""; return d < 0 ? "R" : "S"; }

function drawScene(c, st, sc, atoms, bonds, extra){
  var ctx = c.ctx, cx = c.W * (extra && extra.cx != null ? extra.cx : 0.5), cy = c.H * 0.5, items = [];
  var pr = atoms.map(function(a){ return a ? proj3(a.p, st, sc, cx, cy) : null; });
  if (extra && extra.poly){
    var pp = extra.poly.map(function(i){ return pr[i]; }), zc = (pp[0].z + pp[1].z + pp[2].z) / 3;
    items.push({z:zc - 0.01, f:function(){ ctx.save(); ctx.fillStyle = extra.polyCol || "rgba(42,111,219,.14)"; ctx.strokeStyle = extra.polyEdge || "rgba(42,111,219,.55)"; ctx.lineWidth = 1.3; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(pp[0].x, pp[0].y); ctx.lineTo(pp[1].x, pp[1].y); ctx.lineTo(pp[2].x, pp[2].y); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }});
  }
  if (extra && extra.lobes){
    extra.lobes.forEach(function(lb){
      var q = proj3(lb.p, st, sc, cx, cy), ax = proj3([lb.p[0] + 1, lb.p[1], lb.p[2]], st, sc, cx, cy), ang = Math.atan2(ax.y - q.y, ax.x - q.x), L = Math.hypot(ax.x - q.x, ax.y - q.y);
      items.push({z:q.z, f:function(){
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(ang); ctx.globalAlpha = lb.alpha;
        var rx = Math.max(6, 0.95 * L * 1.0), ry = 0.62 * sc * q.s;
        var g = ctx.createRadialGradient(0, 0, 1, 0, 0, Math.max(rx, ry)); g.addColorStop(0, lb.col); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7); ctx.fill();
        ctx.restore();
      }});
    });
  }
  bonds.forEach(function(b){
    var p = pr[b.a], q = pr[b.b]; if (!p || !q || b.alpha <= 0.01) return;
    items.push({z:(p.z + q.z) / 2 - 0.001, f:function(){
      ctx.save(); ctx.globalAlpha = b.alpha; ctx.strokeStyle = b.col || "#7d8a9b"; ctx.lineCap = "round";
      ctx.lineWidth = Math.max(2.5, sc * 0.11) * (b.thin ? 0.7 : 1);
      if (b.dash) ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore();
    }});
  });
  atoms.forEach(function(a, i){
    if (!a || a.alpha <= 0.01) return;
    var p = pr[i], r = Math.max(5, a.r * sc * 0.74 * p.s);
    items.push({z:p.z, f:function(){
      ball(ctx, p.x, p.y, r, a.col, a.alpha);
      if (a.lab){
        ctx.save(); ctx.globalAlpha = a.alpha; ctx.font = "800 " + Math.round(Math.max(9, Math.min(15, r * 0.86))) + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (!a.dark){ ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.strokeText(a.lab, p.x, p.y); ctx.fillStyle = "#fff"; }
        else ctx.fillStyle = "#2c3a4e";
        ctx.fillText(a.lab, p.x, p.y); ctx.restore();
      }
      if (a.tag){ ctx.save(); ctx.globalAlpha = a.alpha; ctx.font = "800 11.5px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = a.tagCol || "#2c3a4e"; ctx.fillText(a.tag, p.x, p.y - r - 7); ctx.restore(); }
    }});
  });
  items.sort(function(x, y){ return x.z - y.z; });
  items.forEach(function(it){ it.f(); });
  return pr;
}
/* position des trois groupes R autour de l'axe x : angle polaire th (depuis +x), azimuts az */
function rPos(th, az, L){ return [Math.cos(th) * L, Math.sin(th) * L * Math.cos(az), Math.sin(th) * L * Math.sin(az)]; }
function viewPreset(st, v){ if (v === "cote"){ st.a = 0.0; st.b = 0.2; } else if (v === "oblique"){ st.a = 0.42; st.b = 0.22; } else { st.a = 1.25; st.b = 0.2; } }

/* ====================================================================== */
/* 1. SN2 : inversion de Walden en 3D (le parapluie)                       */
/* ====================================================================== */
var SUB2 = {
  met:{n:"CH₃–X (méthyle)", R:["H", "H", "H"], Ea:74, chir:false, cls:"méthyle"},
  prim:{n:"CH₃CH₂–X (primaire)", R:["H", "H", "CH3"], Ea:82, chir:false, cls:"primaire"},
  sec:{n:"2-halogénobutane (secondaire, chiral)", R:["H", "CH3", "C2H5"], Ea:91, chir:true, cls:"secondaire"},
  ter:{n:"(CH₃)₃C–X (tertiaire)", R:["CH3", "CH3", "CH3"], Ea:110, chir:false, cls:"tertiaire"}
};
function sn2Geom(xi, sub, lg, nu, mirror){
  /* distance C–X(ξ) et C–Nu(ξ) : liaisons partielles de part et d'autre de l'état de transition */
  function d(t, L){ t = Math.max(0, Math.min(1, t)); return t <= 0.5 ? L * (1 + 0.32 * Math.pow(t / 0.5, 2)) : L * 1.32 + Math.pow((t - 0.5) / 0.5, 1.6) * 3.4; }
  var dLG = d(xi, lg.L), dNu = d(1 - xi, nu.L);
  var th = (109.5 - 39 * xi) * DEG, azs = mirror ? [0, 240 * DEG, 120 * DEG] : [0, 120 * DEG, 240 * DEG];
  var R = sub.R.map(function(g, i){ return rPos(th, azs[i] + 1.5708, GR[g].L); });
  return {dLG:dLG, dNu:dNu, R:R, th:th};
}
SFA.sim({
  id:"uc-L18-sn2-walden", ch:"L18", tag:"Substitution",
  titre:"SN2 en 3D : l'inversion de Walden (le parapluie)",
  resume:"Le nucléophile attaque par l'arrière, les trois groupes se retournent comme un parapluie par grand vent : suis l'état de transition, la configuration R/S et le profil d'énergie.",
  but:"Fais glisser « avancement » (ou lance l'animation) : le nucléophile se rapproche du côté opposé au groupe partant, le carbone passe par un état de transition plan à cinq voisins (Nu···C···X alignés), puis les trois groupes restants basculent de l'autre côté. Avec le 2-halogénobutane (chiral), la configuration passe de R à S. Change le substrat, le groupe partant et le nucléophile, tourne la molécule en glissant, et lis la vitesse relative.",
  aRetenir:"SN2 : une seule étape, concertée ; Nu attaque à 180° du groupe partant (attaque dorsale) ; état de transition bipyramidal trigonal [Nu···C···X]‡, les trois autres groupes dans un plan ; inversion de configuration (Walden) ; v = k·[RX]·[Nu] (ordre 2). Réactivité : CH₃–X > primaire > secondaire ≫ tertiaire (encombrement stérique de l'attaque dorsale). Bon groupe partant : I⁻ > Br⁻ > Cl⁻ (base conjuguée d'un acide fort).",
  piege:"« Inversion de configuration » désigne l'inversion géométrique du carbone ; le descripteur R/S ne s'inverse que si l'ordre de priorité CIP des quatre groupes reste le même (ici Nu remplace X au rang 1, donc R devient S). Autre cas : le produit peut rester R si le nucléophile n'a pas le même rang que X. Et un carbone tertiaire ne subit pas de SN2 : l'attaque dorsale est bloquée par les trois méthyles.",
  build:function(k, S){
    var c = k.canvas(330), g = k.canvas(150);
    var st = {a:0.42, b:0.22, xi:0, play:false, mirror:false};
    dragView(c, st); st.onview = function(){ k.redraw(); };
    var sSel = k.select("Substrat R–X", Object.keys(SUB2).map(function(q){ return [q, SUB2[q].n]; }), "sec");
    var lSel = k.seg("Groupe partant X", [["Cl", "Cl"], ["Br", "Br"], ["I", "I"]], "Br");
    var nSel = k.seg("Nucléophile Nu⁻", [["OH", "HO⁻"], ["CN", "CN⁻"], ["I", "I⁻"]], "OH");
    var cfg = k.seg("Configuration de départ", [["R", "(R)"], ["S", "(S)"]], "R", function(v){ st.want = v; });
    var vSel = k.seg("Vue", [["oblique", "Oblique"], ["cote", "De côté"], ["axe", "Selon l'axe Nu–C–X"]], "oblique", function(v){ viewPreset(st, v); });
    var xi = k.slider("Avancement de la réaction ξ", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    var rx = k.slider("Concentration [R–X]", 0.1, 2, 0.1, 1, "mol/L");
    var nuC = k.slider("Concentration [Nu⁻]", 0.1, 2, 0.1, 1, "mol/L");
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) { st.xi = 0; xi.set(0); } st.play = !st.play; }, true);
    k.button("Retour au début", function(){ st.xi = 0; xi.set(0); st.play = false; });
    var ro = k.readouts(["Configuration du carbone", "Étape", "Angle Nu–C–X", "Énergie d'activation (modèle)", "Vitesse relative v/v₀"]);
    var nt = k.note("", "ok");
    st.want = "R";
    var lp = k.loop(function(dt){ if (st.play){ st.xi = Math.min(1, st.xi + dt * 0.22); xi.set(st.xi); if (st.xi >= 1) st.play = false; k.redraw(); } });
    lp.play();
    function profile(Ea, dE){ return function(t){ return Ea * Math.pow(Math.sin(PI * t), 2) + dE * (3 * t * t - 2 * t * t * t); }; }
    k.draw(function(){
      var sub = SUB2[sSel.value], lg = LGS[lSel.value], nu = NUS[nSel.value], ctx = c.ctx;
      var xv = st.xi;
      /* quel arrangement donne (R) au départ ? */
      var base = sn2Geom(0, sub, lg, nu, false), mir = false;
      if (sub.chir){
        var d0 = descriptor([1, 0, 0], base.R[2], base.R[1]);
        mir = (d0 === "R") !== (st.want === "R");
      }
      var G = sn2Geom(xv, sub, lg, nu, mir);
      c.clear();
      /* atomes */
      var atoms = [{p:[0, 0, 0], r:0.62, col:"#3b4350", lab:"C", alpha:1}];
      sub.R.forEach(function(gk, i){ var gg = GR[gk]; atoms.push({p:G.R[i], r:gg.r, col:gg.col, lab:gg.lab, alpha:1, dark:gk === "H"}); });
      var lgA = {p:[G.dLG, 0, 0], r:lg.r, col:lg.col, lab:lg.n, alpha:1, tag:xv > 0.6 ? lg.n + "⁻" : (xv > 0.05 ? "δ−" : ""), tagCol:"#c0392b"};
      var nuA = {p:[-G.dNu, 0, 0], r:nu.r, col:nu.col, lab:nu.lab, alpha:xv < 0.02 ? 0.45 + xv * 25 : 1, tag:xv < 0.4 ? nu.n : (xv < 0.95 ? "δ−" : ""), tagCol:"#c0392b"};
      atoms.push(lgA); atoms.push(nuA);
      var bonds = [];
      for (var i = 1; i <= 3; i++) bonds.push({a:0, b:i, alpha:1});
      var fLG = Math.max(0, Math.min(1, 1 - (G.dLG - lg.L * 1.32) / 1.2)), fNu = Math.max(0, Math.min(1, 1 - (G.dNu - nu.L * 1.32) / 1.2));
      bonds.push({a:0, b:4, alpha:Math.max(fLG, 0), dash:xv > 0.03, col:"#9a2a1c"});
      bonds.push({a:0, b:5, alpha:Math.max(fNu, 0), dash:xv < 0.97, col:"#3b6ec2"});
      var sc = Math.min(c.W / 14, c.H / 7.2);
      drawScene(c, st, sc, atoms, bonds, {poly:[1, 2, 3]});
      S.draw.text(c, "attaque dorsale : Nu → C ··· X sur un même axe", 10, 14, {size:11.5, color:"#2c3a4e", align:"left"});
      if (Math.abs(xv - 0.5) < 0.03) S.draw.text(c, "[ Nu ··· C ··· X ]‡ : état de transition", c.W / 2, c.H - 12, {size:13, color:"#a35a00", align:"center", bg:"rgba(255,244,214,.9)"});
      /* configuration */
      var cfgTxt;
      if (!sub.chir) cfgTxt = "pas de centre stéréogène";
      else if (Math.abs(xv - 0.5) < 0.03) cfgTxt = "indéfinie (carbone plan)";
      else {
        var top = xv < 0.5 ? [1, 0, 0] : [-1, 0, 0];
        var dd = descriptor(top, G.R[2], G.R[1]);
        cfgTxt = "(" + dd + ")";
      }
      var stage = xv < 0.05 ? "réactifs" : xv < 0.45 ? "approche" : xv < 0.55 ? "état de transition" : xv < 0.95 ? "départ de X⁻" : "produit";
      var ang = Math.acos(Math.max(-1, Math.min(1, dot(unit([-G.dNu, 0, 0]), unit([G.dLG, 0, 0]))))) / DEG;
      var Ea = sub.Ea + lg.adj + nu.adj, vrel = Math.exp((82 - Ea) / RT) * rx.value * nuC.value;
      ro.set(0, cfgTxt); ro.set(1, stage); ro.set(2, "180°"); ro.set(3, S.fmt(Ea, 0) + " kJ/mol");
      ro.set(4, vrel < 1e-3 ? S.sci(vrel, 1) : S.fmt(vrel, vrel < 10 ? 2 : 1));
      /* profil d'énergie */
      g.clear();
      var dE = -45, fE = profile(Ea, dE), ax = plotAxes(S, g, {x0:0, x1:1, y0:-60, y1:Math.max(160, Ea + 25), sy:40, yl:"Énergie (kJ/mol, profil qualitatif)", xl:"avancement ξ", l:46, b:26, t:22});
      g.ctx.save(); g.ctx.strokeStyle = "#2a6fdb"; g.ctx.lineWidth = 2.4; g.ctx.beginPath();
      for (var j = 0; j <= 100; j++){ var t = j / 100; if (j === 0) g.ctx.moveTo(ax.X(t), ax.Y(fE(t))); else g.ctx.lineTo(ax.X(t), ax.Y(fE(t))); }
      g.ctx.stroke(); g.ctx.restore();
      S.draw.dot(g, ax.X(xv), ax.Y(fE(xv)), 6, "#e08a1e");
      S.draw.text(g, "Ea ≈ " + S.fmt(Ea, 0), ax.X(0.5), ax.Y(fE(0.5)) - 9, {size:11.5, color:"#a35a00", align:"center"});
      S.draw.text(g, "R–X + Nu⁻", ax.X(0.02), ax.Y(0) - 10, {size:11, color:"#2c3a4e", align:"left"});
      S.draw.text(g, "R–Nu + X⁻", ax.X(0.98), ax.Y(dE) - 10, {size:11, color:"#2c3a4e", align:"right"});
      var msg;
      if (sub.cls === "tertiaire") msg = "Substrat tertiaire : les trois méthyles bloquent l'attaque dorsale (Ea ≈ " + S.fmt(Ea, 0) + " kJ/mol, v ≈ 0). Ce substrat réagit par SN1 ou E1/E2, pas par SN2.";
      else if (lSel.value === "I" && nSel.value === "I") msg = "Nu = I⁻ et X = I : l'iode s'échange avec lui-même, aucune réaction nette (mais l'inversion de configuration a bien lieu au niveau moléculaire).";
      else if (!sub.chir) msg = "Substrat sans centre stéréogène : l'inversion se produit, mais on ne peut pas la voir dans le nom. Passe au 2-halogénobutane pour suivre R → S.";
      else msg = "Au départ (" + st.want + "), à l'arrivée (" + (st.want === "R" ? "S" : "R") + ") : l'ordre de priorité CIP est X > C₂H₅ > CH₃ > H au départ et Nu > C₂H₅ > CH₃ > H à l'arrivée, donc l'inversion géométrique change le descripteur. Rapport de vitesse : v ∝ [R–X]·[Nu⁻] (double une concentration : v double).";
      nt.set(msg + " <i>Les groupes CH₃, C₂H₅ sont représentés en une seule boule (modèle simplifié) ; profil d'énergie qualitatif.</i>", sub.cls === "tertiaire" ? "warn" : "ok");
    });
  }
});

/* ====================================================================== */
/* 2. SN1 : carbocation plan et racémisation                               */
/* ====================================================================== */
var SUB1 = {
  ter:{n:"3-bromo-3-méthylhexane (tertiaire, chiral)", R:["CH3", "C2H5", "C3H7"], Ea:85, rk:"tertiaire", note:"carbocation tertiaire : trois groupes alkyles donneurs (hyperconjugaison et effet inductif)"},
  benz:{n:"1-bromo-1-phényléthane (benzylique, chiral)", R:["H", "CH3", "Ph"], Ea:88, rk:"benzylique secondaire", note:"carbocation benzylique : la charge est délocalisée sur le cycle (mésomérie)"},
  sec:{n:"2-bromobutane (secondaire, chiral)", R:["H", "CH3", "C2H5"], Ea:114, rk:"secondaire", note:"carbocation secondaire : peu stabilisé, SN1 lente (la SN2 est en concurrence)"},
  prim:{n:"1-bromopropane (primaire)", R:["H", "H", "C2H5"], Ea:120, rk:"primaire", note:"carbocation primaire : très instable, SN1 pratiquement impossible"}
};
var SOLV = {
  prot:{n:"Eau / méthanol (polaire protique)", adj:0, k:"le solvant polaire protique solvate le cation (dipôles) et l'anion X⁻ (liaisons H)"},
  apro:{n:"Acétone (polaire aprotique)", adj:12, k:"le solvant aprotique solvate bien le cation mais mal l'anion X⁻ : ionisation moins aidée"},
  apol:{n:"Hexane (apolaire)", adj:45, k:"un solvant apolaire ne stabilise pas les ions : l'ionisation est quasi impossible"}
};
function sn1Pos(xi, sub, lg, face, mirror){
  var azs = mirror ? [0, 240 * DEG, 120 * DEG] : [0, 120 * DEG, 240 * DEG], th, dLG, yoff = 0, nuP = null, dNu = 0;
  if (xi <= 0.5){
    th = (109.5 - 19.5 * ease(xi / 0.5)) * DEG;
    var t = xi / 0.5;
    dLG = t <= 0.5 ? lg.L * (1 + 0.35 * Math.pow(t / 0.5, 2)) : lg.L * 1.35 + (t - 0.5) / 0.5 * 3.4;
    yoff = ease((t - 0.5) / 0.5) * 3.2;
  } else {
    var u = (xi - 0.5) / 0.5;
    th = (90 + (face > 0 ? 19.5 : -19.5) * ease(u)) * DEG;
    dLG = lg.L * 1.35 + 3.4 + u * 0.8; yoff = 3.2 + u * 0.4;
    dNu = 0; nuP = u;
  }
  var R = sub.R.map(function(g, i){ return rPos(th, azs[i] + 1.5708, GR[g].L); });
  return {th:th, R:R, dLG:dLG, yoff:yoff, u:nuP};
}
SFA.sim({
  id:"uc-L18-sn1-racemisation", ch:"L18", tag:"Substitution",
  titre:"SN1 : carbocation plan et racémisation",
  resume:"Le groupe partant s'en va seul, le carbocation devient plan, et le nucléophile attaque par l'une ou l'autre face : lance des molécules et regarde le mélange tendre vers 50 % R, 50 % S.",
  but:"Déroule la réaction (avancement) : étape 1, ionisation lente de R–X en carbocation plan sp² avec une orbitale p vide (deux lobes) ; étape 2, attaque rapide du nucléophile. Choisis la face d'attaque, ou laisse le hasard décider et lance 1 ou 100 molécules : la proportion R/S montre la racémisation. Change le substrat (stabilité du carbocation) et le solvant (polarité) pour voir l'énergie d'activation et la vitesse varier ; [Nu] n'a aucune influence sur la vitesse.",
  aRetenir:"SN1 : deux étapes, v = k·[R–X] (ordre 1, [Nu] absent). Étape lente : formation du carbocation (plan, sp², orbitale p vide). Le nucléophile attaque les deux faces avec une probabilité voisine : mélange racémique (50/50 R + S), donc aucune activité optique résultante. Réactivité : tertiaire ≈ benzylique/allylique > secondaire ≫ primaire, favorisée par un solvant polaire protique. En solvolyse dans l'eau, vitesses relatives CH₃Br : 1 ; primaire : 1 ; secondaire : ≈ 12 ; tertiaire : ≈ 10⁶.",
  piege:"« Racémisation » ne veut pas dire que le mélange est 50/50 à chaque fois : c'est la statistique de nombreuses molécules. Une paire d'ions serrée peut donner un léger excès d'inversion (≈ 55–60 %), parce que le groupe partant masque encore une face. Et un carbocation peut se réarranger (migration d'hydrure ou de méthyle) vers un cation plus stable avant l'attaque.",
  build:function(k, S){
    var c = k.canvas(330), g = k.canvas(150), h = k.canvas(120);
    var st = {a:0.85, b:0.3, xi:0, play:false, face:-1, tally:{R:0, S:0}, last:""};
    dragView(c, st); st.onview = function(){ k.redraw(); };
    var sSel = k.select("Substrat R–Br", Object.keys(SUB1).map(function(q){ return [q, SUB1[q].n]; }), "ter");
    var solv = k.select("Solvant", Object.keys(SOLV).map(function(q){ return [q, SOLV[q].n]; }), "prot");
    var faceS = k.seg("Face d'attaque de Nu", [["rand", "Au hasard"], ["inv", "Opposée à X (inversion)"], ["ret", "Du côté de X (rétention)"]], "rand", function(){ roll(); });
    var pair = k.toggle("Paire d'ions serrée (léger excès d'inversion, ≈ 60/40)", false);
    var cfg = k.seg("Configuration de départ", [["R", "(R)"], ["S", "(S)"]], "R", function(v){ st.want = v; st.tally = {R:0, S:0}; });
    var xi = k.slider("Avancement ξ", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    var nuC = k.slider("Concentration [Nu⁻]", 0.1, 2, 0.1, 1, "mol/L");
    var rx = k.slider("Concentration [R–Br]", 0.1, 2, 0.1, 1, "mol/L");
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) { st.xi = 0; xi.set(0); roll(); } st.play = !st.play; }, true);
    k.button("Lancer 1 molécule", function(){ one(); });
    k.button("Lancer 100 molécules", function(){ for (var i = 0; i < 100; i++) one(true); });
    k.button("Remise à zéro du comptage", function(){ st.tally = {R:0, S:0}; });
    var ro = k.readouts(["Étape", "Configuration du carbone", "Ea de l'étape lente", "Vitesse relative (CH₃Br = 1)", "v = k[RX] : v/v₀ si [Nu] ×2"]);
    var nt = k.note("", "ok");
    st.want = "R";
    function pInv(){ return pair.value ? 0.6 : 0.5; }
    function roll(){
      if (faceS.value === "rand") st.face = Math.random() < pInv() ? -1 : 1;
      else st.face = faceS.value === "inv" ? -1 : 1;
    }
    function one(silent){
      var f = Math.random() < pInv() ? -1 : 1;   /* -1 : face opposée à X → inversion */
      var prod = f < 0 ? (st.want === "R" ? "S" : "R") : st.want;
      st.tally[prod]++;
      if (!silent){ st.face = f; st.xi = 0.5; xi.set(0.5); st.play = true; }
    }
    roll();
    var lp = k.loop(function(dt){ if (st.play){ st.xi = Math.min(1, st.xi + dt * 0.2); xi.set(st.xi); if (st.xi >= 1) st.play = false; k.redraw(); } });
    lp.play();
    function eFun(Ea1){
      var Ei = Ea1 - 22, dE = -30, pts = [[0, 0], [0.25, Ea1], [0.5, Ei], [0.75, Ei + 7], [1, dE]];
      return function(t){
        for (var i = 1; i < pts.length; i++) if (t <= pts[i][0] + 1e-9){
          var a = pts[i - 1], b = pts[i], u = (t - a[0]) / (b[0] - a[0]);
          return a[1] + (b[1] - a[1]) * (1 - Math.cos(PI * u)) / 2;
        }
        return dE;
      };
    }
    k.draw(function(){
      var sub = SUB1[sSel.value], sv = SOLV[solv.value], lg = LGS.Br, nuB = NUS.OH, xv = st.xi;
      /* quel arrangement donne (R) au départ ? */
      var base = sn1Pos(0, sub, lg, -1, false), mir = false;
      var ranks = sub.R.map(function(g, i){ return {g:g, i:i}; });
      /* ordre CIP des trois groupes R par priorité décroissante */
      var CIP = {Ph:5, C3H7:4, C2H5:3, CH3:2, H:1};
      ranks.sort(function(a, b){ return CIP[b.g] - CIP[a.g]; });
      var chir = !(CIP[ranks[0].g] === CIP[ranks[1].g] || CIP[ranks[1].g] === CIP[ranks[2].g]);
      /* Ph (C : C,C,C) > propyle (C,H,H) mais pour 1-bromo-1-phényléthane : Br > Ph > CH₃ > H */
      var d0 = chir ? descriptor([1, 0, 0], base.R[ranks[0].i], base.R[ranks[1].i]) : "";
      if (chir) mir = (d0 === "R") !== (st.want === "R");
      var G = sn1Pos(xv, sub, lg, st.face, mir);
      c.clear();
      var atoms = [{p:[0, 0, 0], r:0.62, col:"#3b4350", lab:"C", alpha:1}];
      sub.R.forEach(function(gk, i){ var gg = GR[gk]; atoms.push({p:G.R[i], r:gg.r, col:gg.col, lab:gg.lab, alpha:1, dark:gk === "H"}); });
      var lgP = [G.dLG, 0, G.yoff];   /* X⁻ s'éloigne le long de l'axe puis glisse sur le côté pour libérer les deux faces */
      atoms.push({p:lgP, r:lg.r, col:lg.col, lab:"Br", alpha:xv <= 0.5 ? 1 : 0.85, tag:xv > 0.3 ? "Br⁻" : "", tagCol:"#c0392b"});
      var nuAlpha = xv > 0.5 ? Math.min(1, (xv - 0.5) * 6) : 0;
      var nuX = st.face * (nuB.L + (1 - ease(G.u == null ? 0 : G.u)) * 4.2);
      atoms.push({p:[nuX, 0, 0], r:nuB.r, col:nuB.col, lab:"HO", alpha:nuAlpha, tag:"HO⁻", tagCol:"#c0392b"});
      var bonds = [];
      for (var i = 1; i <= 3; i++) bonds.push({a:0, b:i, alpha:1});
      var t1 = xv / 0.5, bLG = xv <= 0.5 ? Math.max(0, 1 - Math.max(0, t1 - 0.45) / 0.25) : 0;
      bonds.push({a:0, b:4, alpha:xv <= 0.5 ? bLG : 0, dash:xv > 0.05, col:"#9a2a1c"});
      var bNu = xv > 0.5 ? Math.max(0, Math.min(1, (G.u - 0.45) / 0.35)) : 0;
      bonds.push({a:0, b:5, alpha:bNu, dash:G.u != null && G.u < 0.97, col:"#3b6ec2"});
      var lobes = [];
      var plan = Math.max(0, 1 - Math.abs(xv - 0.5) / 0.14);
      if (plan > 0.05){ lobes.push({p:[1.05, 0, 0], col:"#e08a1e", alpha:0.7 * plan}); lobes.push({p:[-1.05, 0, 0], col:"#2a6fdb", alpha:0.7 * plan}); }
      var sc = Math.min(c.W / 13, c.H / 7.2);
      drawScene(c, st, sc, atoms, bonds, {poly:[1, 2, 3], lobes:lobes, polyCol:"rgba(224,138,30,.12)", polyEdge:"rgba(224,138,30,.6)"});
      var stage = xv < 0.05 ? "R–Br intact" : xv < 0.4 ? "étape 1 : ionisation (lente)" : xv < 0.6 ? "carbocation plan" : xv < 0.97 ? "étape 2 : attaque de Nu (rapide)" : "produit";
      if (xv > 0.45 && xv < 0.55) S.draw.text(c, "carbocation sp² : plan, orbitale p vide (2 lobes)", c.W / 2, c.H - 12, {size:12.5, color:"#a35a00", align:"center", bg:"rgba(255,244,214,.9)"});
      S.draw.text(c, "Nu attaque la face " + (st.face < 0 ? "opposée à X (inversion)" : "du côté de X (rétention)"), 10, 14, {size:11.5, color:"#2c3a4e", align:"left"});
      var cfgTxt;
      if (!chir) cfgTxt = "pas de centre stéréogène";
      else if (xv > 0.46 && xv < 0.54) cfgTxt = "indéfinie (carbocation plan)";
      else { var top = xv < 0.5 ? [1, 0, 0] : [st.face, 0, 0]; cfgTxt = "(" + descriptor(top, G.R[ranks[0].i], G.R[ranks[1].i]) + ")"; }
      var Ea1 = sub.Ea + sv.adj, vrel = Math.exp((120 - Ea1) / RT);
      ro.set(0, stage); ro.set(1, cfgTxt); ro.set(2, S.fmt(Ea1, 0) + " kJ/mol"); ro.set(3, vrel > 1e4 || vrel < 1e-3 ? S.sci(vrel, 1) : S.fmt(vrel, vrel < 10 ? 2 : 0));
      ro.set(4, "1,00 (indépendant de [Nu⁻])");
      /* profil d'énergie à deux étapes */
      g.clear();
      var fE = eFun(Ea1), ax = plotAxes(S, g, {x0:0, x1:1, y0:-40, y1:Math.max(180, Ea1 + 30), sy:40, yl:"Énergie (kJ/mol, profil qualitatif)", xl:"avancement ξ", l:46, b:26, t:22});
      g.ctx.save(); g.ctx.strokeStyle = "#2a6fdb"; g.ctx.lineWidth = 2.4; g.ctx.beginPath();
      for (var j = 0; j <= 120; j++){ var t = j / 120; if (j === 0) g.ctx.moveTo(ax.X(t), ax.Y(fE(t))); else g.ctx.lineTo(ax.X(t), ax.Y(fE(t))); }
      g.ctx.stroke(); g.ctx.restore();
      S.draw.dot(g, ax.X(xv), ax.Y(fE(xv)), 6, "#e08a1e");
      S.draw.text(g, "TS₁ (étape lente)", ax.X(0.25), ax.Y(Ea1) - 9, {size:11, color:"#a35a00", align:"center"});
      S.draw.text(g, "R⁺ (intermédiaire)", ax.X(0.5), ax.Y(fE(0.5)) + 16, {size:11, color:"#2c3a4e", align:"center"});
      S.draw.text(g, "TS₂ (rapide)", ax.X(0.75), ax.Y(fE(0.75)) - 9, {size:11, color:"#2c3a4e", align:"center"});
      /* comptage R / S */
      h.clear();
      var R = st.tally.R, Sn = st.tally.S, N = R + Sn, ctx = h.ctx, X0 = 78, X1 = h.W - 70;
      [["R", R, "#2a6fdb", 28], ["S", Sn, "#e08a1e", 62]].forEach(function(r){
        var f = N ? r[1] / N : 0;
        ctx.fillStyle = "#edf0f4"; ctx.fillRect(X0, r[3], X1 - X0, 22);
        ctx.fillStyle = r[2]; ctx.fillRect(X0, r[3], (X1 - X0) * f, 22);
        S.draw.text(h, "produit (" + r[0] + ")", X0 - 8, r[3] + 11, {size:12, color:"#2c3a4e", align:"right"});
        S.draw.text(h, N ? S.fmt(f * 100, 1) + " % (" + r[1] + ")" : "—", X1 + 6, r[3] + 11, {size:12, color:"#2c3a4e", align:"left"});
      });
      ctx.strokeStyle = "#2c3a4e"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo((X0 + X1) / 2, 22); ctx.lineTo((X0 + X1) / 2, 90); ctx.stroke(); ctx.setLineDash([]);
      S.draw.text(h, "Produits formés (départ : " + st.want + ", " + N + " molécule" + (N > 1 ? "s" : "") + " lancée" + (N > 1 ? "s" : "") + ")", 8, 10, {size:11.5, color:"#2c3a4e", align:"left"});
      var ee = N ? Math.abs(R - Sn) / N * 100 : 0;
      S.draw.text(h, N ? "excès énantiomérique ee = " + S.fmt(ee, 1) + " % (0 % = racémique)" : "lance des molécules pour voir la statistique", 8, 108, {size:11.5, color:"#5f6b7a", align:"left"});
      var msg;
      if (sub.rk === "primaire") msg = "Carbocation primaire : " + sub.note + ". Les halogénoalcanes primaires réagissent en SN2, pas en SN1.";
      else msg = "Substrat " + sub.rk + " : " + sub.note + ". Solvant : " + sv.k + ".";
      if (solv.value === "apol") msg = "Ea(étape 1) = " + S.fmt(Ea1, 0) + " kJ/mol dans l'hexane : " + sv.k + ".";
      nt.set(msg + (N ? " Après " + N + " molécule" + (N > 1 ? "s" : "") + " : " + S.fmt(R / N * 100, 0) + " % (R) et " + S.fmt(Sn / N * 100, 0) + " % (S) ; l'écart à 50/50 est du hasard statistique et diminue avec N." : "") + " <i>Profil d'énergie qualitatif ; vitesse relative calculée avec Ea(CH₃Br) = 120 kJ/mol à 298 K.</i>", sub.rk === "primaire" || solv.value === "apol" ? "warn" : "ok");
    });
  }
});
})();
