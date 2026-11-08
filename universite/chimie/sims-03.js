/* Chimie BA1 · c03 · VSEPR et polarité — contenu SFA original */
(function(){
var DEBYE = 3.336e-30, QE = 1.602e-19, KB = 1.381e-23;
var ELCOL = {H:"#d9dee6", C:"#3b4350", O:"#c0392b", N:"#2f5fb3", F:"#5aa469", Cl:"#2e8b57", B:"#d08a3c", Xe:"#7b5cb8", S:"#d4b200", P:"#d17a22", Br:"#8b3a2e"};

/* projection orthographique après rotation autour de y (a) puis de x (b) */
function rot(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  var y2 = y * Math.cos(b) - z * Math.sin(b), z2 = y * Math.sin(b) + z * Math.cos(b);
  return [x, y2, z2];
}
function dragger(c, st){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b += (p.y - st.ly) * 0.012; st.lx = p.x; st.ly = p.y; c.redrawFn(); }
    if (type === "up") st.lx = null;
  });
}

/* ---------- 1. Géométries VSEPR en 3D ---------- */
var UNIT = {
  2:[[0,0,1],[0,0,-1]],
  3:[[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]],
  4:[[0.577,0.577,0.577],[0.577,-0.577,-0.577],[-0.577,0.577,-0.577],[-0.577,-0.577,0.577]],
  5:[[0,0,1],[0,0,-1],[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]],
  6:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]
};
var LPIDX = {3:[2], 4:[3,2], 5:[4,3,2], 6:[5,4]};
var GEO = {
  "2,0":["AX₂","linéaire","180°","sp","CO₂, BeCl₂"],
  "3,0":["AX₃","trigonale plane","120°","sp²","BF₃, SO₃"],
  "3,1":["AX₂E","en V (angulaire)","≈ 117–119° (inférieur à 120°)","sp²","SO₂, O₃"],
  "4,0":["AX₄","tétraédrique","109,5°","sp³","CH₄, CCl₄"],
  "4,1":["AX₃E","pyramidale à base triangulaire","≈ 107°","sp³","NH₃, PCl₃"],
  "4,2":["AX₂E₂","en V (angulaire)","≈ 104,5°","sp³","H₂O, H₂S"],
  "5,0":["AX₅","bipyramide trigonale","90° et 120°","sp³d","PCl₅"],
  "5,1":["AX₄E","en bascule (balançoire)","≈ 102° et ≈ 173°","sp³d","SF₄"],
  "5,2":["AX₃E₂","en T","≈ 87,5°","sp³d","ClF₃"],
  "5,3":["AX₂E₃","linéaire","180°","sp³d","XeF₂, I₃⁻"],
  "6,0":["AX₆","octaédrique","90°","sp³d²","SF₆"],
  "6,1":["AX₅E","pyramide à base carrée","≈ 85–90°","sp³d²","BrF₅"],
  "6,2":["AX₄E₂","plan carré","90°","sp³d²","XeF₄"]
};
SFA.sim({
  id:"uc-c03-vsepr-3d", ch:"c03", tag:"Géométrie",
  titre:"VSEPR en 3D : de AXₙEₘ à la forme et à la polarité",
  resume:"Choisis le nombre de domaines et de doublets libres, fais tourner la molécule à la souris : forme, angles, hybridation et polarité.",
  but:"Fixe le nombre total de domaines d'électrons autour de l'atome central, puis le nombre de doublets non liants. Glisse sur le dessin pour tourner la molécule. La polarité est calculée comme somme vectorielle des dipôles de liaison identiques. Active le mode défi pour deviner la forme.",
  aRetenir:"Les domaines se placent le plus loin possible les uns des autres ; les doublets non liants, plus répulsifs, se mettent en équatorial (bipyramide trigonale) ou en trans (octaèdre) et compriment les angles de liaison. On décrit la forme avec les atomes seuls (pas avec les doublets) : AX₃E est pyramidale, AX₂E₂ est en V.",
  piege:"Le nombre de domaines compte les doublets liants (un domaine par liaison, simple, double ou triple) et les doublets libres. La forme n'est pas la géométrie des domaines : NH₃ est tétraédrique pour ses domaines mais pyramidale par ses atomes. L'hybridation sp³d et sp³d² pour les hypervalents est une description d'enseignement, la contribution des orbitales d est discutée.",
  build:function(k, S){
    var c = k.canvas(430);
    var st = {a:0.6, b:0.3};
    var sn = k.seg("Domaines d'électrons", [[2,"2"],[3,"3"],[4,"4"],[5,"5"],[6,"6"]], 4);
    var es = k.seg("Doublets non liants E", [[0,"0"],[1,"1"],[2,"2"],[3,"3"]], 0);
    var tp = k.toggle("Afficher le polyèdre des domaines", true);
    var td = k.toggle("Mode défi : cacher la forme", false);
    var shapes = []; Object.keys(GEO).forEach(function(q){ if (shapes.indexOf(GEO[q][1]) < 0) shapes.push(GEO[q][1]); });
    var ans = k.select("Ta réponse (mode défi)", [["","— choisis la forme —"]].concat(shapes.map(function(s){ return [s, s]; })), "");
    k.button("Nouveau défi au hasard", function(){
      var ks = Object.keys(GEO).filter(function(q){ return q.split(",")[0] === q.split(",")[0]; }), q = ks[Math.floor(Math.random() * ks.length)].split(",");
      td.set(true); sn.set(+q[0]); es.set(+q[1]); ans.set("");
    });
    var ro = k.readouts(["Notation", "Forme", "Angles", "Hybridation", "Exemples", "Molécule polaire ?"]);
    var nt = k.note("", "ok");
    UC.view(k, c, st, true);
    function norm(v){ var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
    function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
    function ad(a, b, s, t){ return [a[0] * s + b[0] * t, a[1] * s + b[1] * t, a[2] * s + b[2] * t]; }
    /* directions réelles des liaisons (angles comprimés par les doublets libres quand ils sont connus) */
    function geom(n, e){
      var U = UNIT[n], lpi = (LPIDX[n] || []).slice(0, e), bonds = [], lps = [];
      U.forEach(function(p, i){ (lpi.indexOf(i) >= 0 ? lps : bonds).push(p.slice()); });
      if (n === 3 && e === 1){ var d = norm([-lps[0][0], -lps[0][1], 0]), a0 = Math.atan2(d[1], d[0]), h = 59 * Math.PI / 180; bonds = [[Math.cos(a0 + h), Math.sin(a0 + h), 0], [Math.cos(a0 - h), Math.sin(a0 - h), 0]]; }
      if (n === 4 && e === 1){ var dd = norm([-lps[0][0], -lps[0][1], -lps[0][2]]), ca = Math.sqrt((Math.cos(107 * Math.PI / 180) + 0.5) / 1.5), sa = Math.sqrt(1 - ca * ca);
        bonds = bonds.map(function(v){ var u = norm(ad(v, dd, 1, -dot(v, dd))); return ad(dd, u, ca, sa); }); }
      if (n === 4 && e === 2){ var m = norm(ad(bonds[0], bonds[1], 1, 1)), u2 = norm(ad(bonds[0], bonds[1], 1, -1)), hh = 52.25 * Math.PI / 180;
        bonds = [ad(m, u2, Math.cos(hh), Math.sin(hh)), ad(m, u2, Math.cos(hh), -Math.sin(hh))]; }
      return {bonds:bonds, lps:lps};
    }
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, n = +sn.value, e = +es.value, ph = W < 420;
      var maxE = {2:0, 3:1, 4:2, 5:3, 6:2}[n], warn = "";
      if (e > maxE){ e = maxE; warn = "Avec " + n + " domaines, on ne place pas plus de " + maxE + " doublet(s) non liant(s) dans les cas usuels (E = " + maxE + " affiché)."; }
      UC.bg(c, "#f4f8fc", "#ffffff");
      var g = geom(n, e), sc = Math.min(W * 0.36, H * 0.34), cx = W / 2, cy = H / 2 - 4, it = [];
      var hidden = td.value;
      UC.floor(c, cx, cy + sc * 1.12, sc * 0.8, sc * 0.16);
      /* polyèdre des domaines (arêtes entre sommets voisins) */
      var U = UNIT[n], pv = U.map(function(p){ return UC.proj(p, st, sc, cx, cy); });
      if (tp.value){
        var dmin = 9; for (var i = 0; i < U.length; i++) for (var j = i + 1; j < U.length; j++) dmin = Math.min(dmin, Math.hypot(U[i][0] - U[j][0], U[i][1] - U[j][1], U[i][2] - U[j][2]));
        ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(100,116,139,.45)"; ctx.lineWidth = 1.2;
        for (var i2 = 0; i2 < U.length; i2++) for (var j2 = i2 + 1; j2 < U.length; j2++) if (n > 2 && Math.hypot(U[i2][0] - U[j2][0], U[i2][1] - U[j2][1], U[i2][2] - U[j2][2]) < dmin * 1.05){ ctx.beginPath(); ctx.moveTo(pv[i2].x, pv[i2].y); ctx.lineTo(pv[j2].x, pv[j2].y); ctx.stroke(); }
        ctx.restore();
      }
      g.bonds.forEach(function(v){ var q = UC.proj(v, st, sc, cx, cy); it.push({t:"b", q:q, z:q.z / 2}); });
      g.lps.forEach(function(v){ var q = UC.proj(v.map(function(x){ return x * 0.95; }), st, sc, cx, cy); it.push({t:"l", q:q, z:q.z}); });
      it.push({t:"c", z:0});
      it.sort(function(p, q){ return p.z - q.z; });
      it.forEach(function(o){
        if (o.t === "b"){ UC.stick(ctx, cx, cy, o.q.x, o.q.y, 6.5 * o.q.s, "#9aa5b4"); UC.ball(ctx, o.q.x, o.q.y, 14 * o.q.s, UC.COL.X); S.draw.text(c, "X", o.q.x, o.q.y + 0.5, {size:12 * o.q.s, color:"#fff"}); }
        else if (o.t === "l"){
          var ang = Math.atan2(o.q.y - cy, o.q.x - cx), L = Math.hypot(o.q.x - cx, o.q.y - cy);
          UC.lobe(ctx, cx, cy, ang, Math.max(L, 14), 24 * o.q.s, "#6236c4", 0.4);
          var tx = cx + Math.cos(ang) * Math.max(L, 14) * 0.62, ty = cy + Math.sin(ang) * Math.max(L, 14) * 0.62, nx = -Math.sin(ang) * 4.5, ny = Math.cos(ang) * 4.5;
          S.draw.dot(c, tx + nx, ty + ny, 2.8, "#4a1fa0"); S.draw.dot(c, tx - nx, ty - ny, 2.8, "#4a1fa0");
        } else { UC.ball(ctx, cx, cy, 20, UC.COL.A); S.draw.text(c, "A", cx, cy + 0.5, {size:15, color:"#fff"}); }
      });
      /* angle entre les deux premières liaisons : arc 3D + valeur */
      var gg = GEO[n + "," + e], b0 = norm(g.bonds[0]), b1 = norm(g.bonds[1] || g.bonds[0]);
      var cosA = dot(b0, b1), ang0 = Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;
      if (g.bonds.length > 1 && !hidden){
        var mid = norm(ad(b0, b1, 1, 1)), perp = norm(ad(b1, b0, 1, -cosA)), pts = [], N = 18, tt;
        for (tt = 0; tt <= N; tt++){ var a = Math.acos(Math.max(-1, Math.min(1, cosA))) * tt / N; pts.push(UC.proj(ad(b0, perp, Math.cos(a), Math.sin(a)).map(function(x){ return x * 0.42; }), st, sc, cx, cy)); }
        ctx.save(); ctx.strokeStyle = P.amber; ctx.lineWidth = 2.2; ctx.beginPath(); pts.forEach(function(q, i){ i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.restore();
        var lq = UC.proj(mid.map(function(x){ return x * (Math.abs(cosA) > 0.99 ? 0.3 : 0.62); }), st, sc, cx, cy);
        S.draw.label(c, S.fmt(ang0, ang0 % 1 > 0.01 ? 1 : 0) + "°", lq.x, lq.y, {color:P.amber, size:12});
      }
      /* moment dipolaire net (somme des dipôles X–A, X identiques) */
      var sum = [0, 0, 0]; g.bonds.forEach(function(v){ sum = ad(sum, v, 1, 1); });
      var net = Math.hypot(sum[0], sum[1], sum[2]); if (net < 1e-6) net = 0;
      if (net > 0 && !hidden){ var q1 = UC.proj(sum.map(function(x){ return -x * 0.5; }), st, sc, cx, cy), q2 = UC.proj(sum.map(function(x){ return x * 0.5; }), st, sc, cx, cy); S.draw.arrow(c, q1.x + 0, q1.y + sc * 0.0, q2.x, q2.y, P.red, 3); S.draw.label(c, "μ net", q2.x + 6, q2.y - 12, {color:P.red, size:11}); }
      /* légende */
      var ly = H - (ph ? 56 : 46), lx = 12;
      S.draw.panel(c, lx - 4, ly - 12, ph ? W - 16 : 332, ph ? 50 : 38, {shadow:false});
      UC.ball(ctx, lx + 8, ly + 2, 6, UC.COL.A); S.draw.text(c, "atome central A", lx + 20, ly + 2, {size:11, align:"left", color:P.ink, weight:600});
      UC.ball(ctx, lx + 118, ly + 2, 6, UC.COL.X); S.draw.text(c, "atome lié X", lx + 130, ly + 2, {size:11, align:"left", color:P.ink, weight:600});
      UC.lobe(ctx, lx + 205, ly + 2, 0, 16, 5, "#6236c4", 0.4); S.draw.text(c, "doublet non liant", lx + 227, ly + 2, {size:11, align:"left", color:P.ink, weight:600});
      S.draw.text(c, "glisse pour tourner · polyèdre en pointillés", lx + 4, ly + 22, {size:10.5, align:"left", color:P.grey, weight:600});
      var lab = n + " domaines · " + (n - e) + " liés + " + e + " libre" + (e > 1 ? "s" : "");
      S.draw.label(c, lab, ph ? W / 2 : W - 10, ph ? 44 : 18, {color:P.mat, align:ph ? "center" : "right", size:12});
      if (!hidden) S.draw.label(c, gg[0] + " · " + gg[1], W / 2, 18, {color:P.ink, size:ph ? 12 : 13.5});
      else S.draw.label(c, "Quelle forme ? (notation " + gg[0] + ")", W / 2, 18, {color:P.red, size:ph ? 12 : 13.5});
      ro.set(0, gg[0]); ro.set(1, hidden ? "?" : gg[1]); ro.set(2, hidden ? "?" : gg[2]); ro.set(3, hidden ? "?" : gg[3]); ro.set(4, hidden ? "?" : gg[4]);
      ro.set(5, hidden ? "?" : (net < 1e-6 ? "non (dipôles qui s'annulent)" : "oui (somme ≠ 0)"));
      if (hidden){
        if (!ans.value) nt.set("Mode défi : observe la molécule (doublets libres en violet), puis choisis la forme dans la liste. Les angles et la polarité apparaissent quand tu as trouvé.", "ok");
        else if (ans.value === gg[1]){ nt.set("Bravo : " + gg[0] + " donne bien la forme « " + gg[1] + " », angles " + gg[2] + ". Décoche le mode défi pour voir les angles et la polarité.", "ok"); }
        else nt.set("Pas tout à fait : « " + ans.value + " » ne correspond pas à " + gg[0] + ". Compte les doublets non liants et place-les en premier (ils occupent le plus de place).", "warn");
      } else nt.set((warn ? warn + " " : "") + "Domaines : " + n + " dont " + e + " non liant(s). Somme vectorielle des " + (n - e) + " dipôles X–A égaux : " + S.fmt(net, 2) + " (en unités d'un dipôle de liaison). Un doublet libre n'est pas ajouté ici : si X est le même partout, la polarité vient de la forme.", warn ? "warn" : "ok");
    });
  }
});

/* ---------- 2. Moment dipolaire : somme vectorielle ---------- */
var T = [[0.577,0.577,0.577],[0.577,-0.577,-0.577],[-0.577,0.577,-0.577],[-0.577,-0.577,0.577]];
var cosN = 0.3599, sinN = Math.sqrt(1 - cosN * cosN);
function tetra(sym, which){ /* which = [symboles aux 4 sommets] */
  var at = [[sym, 0, 0, 0]], bd = [];
  which.forEach(function(s, i){ at.push([s, T[i][0] * 1.1, T[i][1] * 1.1, T[i][2] * 1.1]); bd.push([0, i + 1, s === "Cl" ? 1.5 : 0]); });
  return {at:at, bd:bd};
}
function ring(sub){ /* sub = positions des Cl (0..5) */
  var at = [], bd = [];
  for (var i = 0; i < 6; i++){ var a = Math.PI / 2 - i * Math.PI / 3; at.push(["C", Math.cos(a) * 1, Math.sin(a) * 1, 0]); }
  for (var j = 0; j < 6; j++) bd.push([j, (j + 1) % 6, 0]);
  for (var m = 0; m < 6; m++){ var a2 = Math.PI / 2 - m * Math.PI / 3, isCl = sub.indexOf(m) >= 0; at.push([isCl ? "Cl" : "H", Math.cos(a2) * 2, Math.sin(a2) * 2, 0]); bd.push([m, 6 + m, isCl ? 1.5 : 0]); }
  return {at:at, bd:bd};
}
var MOLS = {
  co2:{nom:"CO₂", exp:0, at:[["C",0,0,0],["O",-1.16,0,0],["O",1.16,0,0]], bd:[[0,1,2.3],[0,2,2.3]]},
  h2o:{nom:"H₂O", exp:1.85, at:[["O",0,0,0],["H",-0.757,0.586,0],["H",0.757,0.586,0]], bd:[[1,0,1.51],[2,0,1.51]]},
  nh3:{nom:"NH₃", exp:1.47, at:[["N",0,0,0],["H",sinN,0,-cosN],["H",-sinN/2,sinN*0.866,-cosN],["H",-sinN/2,-sinN*0.866,-cosN]], bd:[[1,0,1.31],[2,0,1.31],[3,0,1.31]]},
  bf3:{nom:"BF₃", exp:0, at:[["B",0,0,0],["F",1.3,0,0],["F",-0.65,1.126,0],["F",-0.65,-1.126,0]], bd:[[0,1,1.5],[0,2,1.5],[0,3,1.5]]},
  ccl4:Object.assign({nom:"CCl₄", exp:0}, tetra("C", ["Cl","Cl","Cl","Cl"])),
  chcl3:Object.assign({nom:"CHCl₃", exp:1.04}, tetra("C", ["H","Cl","Cl","Cl"])),
  ch2cl2:Object.assign({nom:"CH₂Cl₂", exp:1.60}, tetra("C", ["H","H","Cl","Cl"])),
  ch3cl:Object.assign({nom:"CH₃Cl", exp:1.87}, tetra("C", ["H","H","H","Cl"])),
  ch2o:{nom:"H₂C=O (méthanal)", exp:2.33, at:[["C",0,0,0],["O",1.21,0,0],["H",-0.55,0.95,0],["H",-0.55,-0.95,0]], bd:[[0,1,2.3],[0,2,0],[0,3,0]]},
  cis:{nom:"cis-1,2-dichloroéthène", exp:1.90, at:[["C",-0.67,0,0],["C",0.67,0,0],["Cl",-1.5,1.5,0],["Cl",1.5,1.5,0],["H",-1.2,-0.95,0],["H",1.2,-0.95,0]], bd:[[0,1,0],[0,2,1.5],[1,3,1.5],[0,4,0],[1,5,0]]},
  trans:{nom:"trans-1,2-dichloroéthène", exp:0, at:[["C",-0.67,0,0],["C",0.67,0,0],["Cl",-1.5,1.5,0],["Cl",1.5,-1.5,0],["H",-1.2,-0.95,0],["H",1.2,0.95,0]], bd:[[0,1,0],[0,2,1.5],[1,3,1.5],[0,4,0],[1,5,0]]},
  ortho:Object.assign({nom:"ortho-dichlorobenzène", exp:2.50}, ring([0,1])),
  meta:Object.assign({nom:"méta-dichlorobenzène", exp:1.72}, ring([0,2])),
  para:Object.assign({nom:"para-dichlorobenzène", exp:0}, ring([0,3])),
  xef4:{nom:"XeF₄ (plan carré)", exp:0, at:[["Xe",0,0,0],["F",1.95,0,0],["F",-1.95,0,0],["F",0,1.95,0],["F",0,-1.95,0]], bd:[[0,1,1.0],[0,2,1.0],[0,3,1.0],[0,4,1.0]]}
};
SFA.sim({
  id:"uc-c03-moment-dipolaire", ch:"c03", tag:"Polarité",
  titre:"Moment dipolaire : somme vectorielle des dipôles de liaison",
  resume:"Pour 15 molécules, additionne les dipôles de liaison : CO₂ et CCl₄ s'annulent, H₂O et CHCl₃ non. Compare à la valeur mesurée.",
  but:"Choisis une molécule et fais-la tourner. Les flèches orange sont les dipôles de liaison (vers l'atome le plus électronégatif) ; la flèche rouge est leur somme vectorielle. L'encadré en bas montre l'addition bout à bout. Pronostique d'abord polaire ou apolaire.",
  aRetenir:"μ = Σ des moments de liaison (grandeurs vectorielles) : une molécule est polaire si cette somme n'est pas nulle. Des liaisons polaires peuvent donner une molécule apolaire (CO₂, BF₃, CCl₄, trans-C₂H₂Cl₂, para-C₆H₄Cl₂, XeF₄). Unité : le debye, 1 D = 3,336·10⁻³⁰ C·m.",
  piege:"Le calcul vectoriel de ce simulateur est un modèle simplifié : les liaisons C–H sont prises apolaires, les doublets libres ne sont pas ajoutés, et les moments de liaison sont supposés indépendants (additivité). Il prédit bien polaire/apolaire mais l'ordre de grandeur seulement (CHCl₃ : le modèle surestime). Dans NH₃ et H₂O, le doublet non liant contribue au moment réel.",
  build:function(k, S){
    var c = k.canvas(440);
    var st = {a:0.5, b:0.3};
    var ms = k.select("Molécule", Object.keys(MOLS).map(function(m){ return [m, MOLS[m].nom]; }), "h2o", function(){ pr.set("-"); });
    var pr = k.seg("Ton pronostic avant de regarder", [["-","?"],["p","polaire"],["a","apolaire"]], "-");
    var tg = k.toggle("Montrer les dipôles de liaison et les charges partielles", true);
    var ro = k.readouts(["μ calculé (modèle)", "μ expérimental", "Polaire ?"]);
    var nt = k.note("", "ok");
    UC.view(k, c, st, true);
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, m = MOLS[ms.value], ph = W < 420;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var sum = [0, 0, 0], chg = m.at.map(function(){ return 0; });
      m.bd.forEach(function(b){
        var a = m.at[b[0]], q = m.at[b[1]], v = [q[1] - a[1], q[2] - a[2], q[3] - a[3]], L = Math.hypot(v[0], v[1], v[2]);
        for (var i = 0; i < 3; i++) sum[i] += b[2] * v[i] / L;
        chg[b[0]] += b[2]; chg[b[1]] -= b[2];
      });
      var net = Math.hypot(sum[0], sum[1], sum[2]); if (net < 1e-9) net = 0;
      var cen = [0, 0, 0]; m.at.forEach(function(a){ cen[0] += a[1]; cen[1] += a[2]; cen[2] += a[3]; }); cen = cen.map(function(v){ return v / m.at.length; });
      var R = 0; m.at.forEach(function(a){ R = Math.max(R, Math.hypot(a[1] - cen[0], a[2] - cen[1], a[3] - cen[2])); });
      var cx = W / 2, cy = ph ? H * 0.34 : H * 0.44, sc = Math.min(W * 0.3, H * 0.24) / Math.max(R, 1);
      var pr3 = m.at.map(function(a){ return UC.proj([a[1] - cen[0], a[2] - cen[1], a[3] - cen[2]], st, sc, cx, cy); });
      UC.floor(c, cx, cy + sc * R * 0.95, sc * R * 0.9, sc * R * 0.14);
      var maxq = 0; chg.forEach(function(q){ maxq = Math.max(maxq, Math.abs(q)); });
      var rad = function(a){ return (a[0] === "H" ? 9 : a[0] === "Cl" || a[0] === "Xe" ? 17 : 14) * (ph ? 0.9 : 1); };
      if (tg.value) m.at.forEach(function(a, i){ if (chg[i] && maxq) S.draw.glow(c, pr3[i].x, pr3[i].y, 46 * pr3[i].s, chg[i] < 0 ? "#e0452f" : "#2f7fd1", 0.2 + 0.4 * Math.abs(chg[i]) / maxq); });
      var it = [];
      m.bd.forEach(function(b, bi){ it.push({t:"b", b:b, z:(pr3[b[0]].z + pr3[b[1]].z) / 2}); });
      m.at.forEach(function(a, i){ it.push({t:"a", i:i, z:pr3[i].z}); });
      it.sort(function(p, q){ return p.z - q.z; });
      it.forEach(function(o){
        if (o.t === "b"){
          var p1 = pr3[o.b[0]], p2 = pr3[o.b[1]];
          UC.stick(ctx, p1.x, p1.y, p2.x, p2.y, 6 * (p1.s + p2.s) / 2, "#9aa5b4");
          if (tg.value && o.b[2]){
            var dx = p2.x - p1.x, dy = p2.y - p1.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L * 12, ny = dx / L * 12;
            var f0 = 0.3, f1 = 0.7;
            S.draw.arrow(c, p1.x + dx * f0 + nx, p1.y + dy * f0 + ny, p1.x + dx * f1 + nx, p1.y + dy * f1 + ny, P.amber, 2.6);
            S.draw.text(c, "+", p1.x + dx * f0 + nx - dx / L * 6, p1.y + dy * f0 + ny - dy / L * 6, {size:11, color:P.amber, weight:800});
          }
        } else {
          var a = m.at[o.i], q = pr3[o.i], r = rad(a) * q.s;
          UC.ball(ctx, q.x, q.y, r, UC.COL[a[0]] || "#8a95a3");
          S.draw.text(c, a[0], q.x, q.y + 0.5, {size:(a[0] === "H" ? 10 : 12.5) * q.s, color:a[0] === "H" ? P.ink : "#fff"});
          if (tg.value && chg[o.i] && maxq) S.draw.text(c, chg[o.i] < 0 ? "δ−" : "δ+", q.x + r * 0.9, q.y - r * 1.05, {size:11, color:chg[o.i] < 0 ? "#c0321d" : "#1f6fbf", weight:800, halo:true});
        }
      });
      if (net > 0){
        var nv = UC.proj(sum.map(function(v){ return v / Math.max(net, 1e-9) * Math.min(net, 3) * 0.22; }), {a:st.a, b:st.b}, sc * 1.0, 0, 0);
        var vx = nv.x * 1.0, vy = nv.y * 1.0;
        S.draw.arrow(c, cx - vx * 0.5, cy - vy * 0.5 + 0, cx + vx * 1.5, cy + vy * 1.5, P.red, 4.5);
        S.draw.label(c, "μ net", cx + vx * 1.5 + (vx >= 0 ? 8 : -8), cy + vy * 1.5 - 14, {color:P.red, size:12, align:vx >= 0 ? "left" : "right"});
      } else S.draw.label(c, "Σ = 0 : molécule apolaire", W / 2, 18, {color:P.green, size:13});
      /* addition bout à bout dans le plan de l'écran */
      var iw = ph ? Math.min(W - 16, 220) : 190, ih = ph ? 120 : 130, ix = ph ? W / 2 - iw / 2 : W - iw - 10, iy = H - ih - 10;
      S.draw.panel(c, ix, iy, iw, ih, {title:"Addition des dipôles", shadow:false});
      var vecs = m.bd.filter(function(b){ return b[2]; }).map(function(b){
        var a = m.at[b[0]], q = m.at[b[1]], v = [q[1] - a[1], q[2] - a[2], q[3] - a[3]], L = Math.hypot(v[0], v[1], v[2]), r = UC.rot([b[2] * v[0] / L, b[2] * v[1] / L, b[2] * v[2] / L], st.a, st.b);
        return [r[0], -r[1]];
      });
      var pts = [[0, 0]]; vecs.forEach(function(v){ var l = pts[pts.length - 1]; pts.push([l[0] + v[0], l[1] + v[1]]); });
      var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(function(p){ x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
      var ww = Math.max(x1 - x0, 0.3), hh = Math.max(y1 - y0, 0.3), s2 = Math.min((iw - 36) / ww, (ih - 66) / hh, 70), ox = ix + iw / 2 - (x0 + x1) / 2 * s2, oy = iy + 20 + (ih - 20) / 2 - (y0 + y1) / 2 * s2 + 4;
      vecs.forEach(function(v, i){ S.draw.arrow(c, ox + pts[i][0] * s2, oy + pts[i][1] * s2, ox + pts[i + 1][0] * s2, oy + pts[i + 1][1] * s2, P.amber, 2.2); });
      if (net > 0 && vecs.length > 1){ var e = pts[pts.length - 1]; S.draw.arrow(c, ox, oy, ox + e[0] * s2, oy + e[1] * s2, P.red, 3); }
      else if (vecs.length > 1) { S.draw.dot(c, ox, oy, 4, P.green); S.draw.text(c, "boucle fermée", ix + iw / 2, iy + ih - 10, {size:10.5, color:P.green}); }
      S.draw.text(c, "glisse pour tourner", 10, H - 12, {size:10.5, color:P.grey, align:"left", weight:600});
      ro.set(0, S.fmt(net, 2) + " D"); ro.set(1, S.fmt(m.exp, 2) + " D"); ro.set(2, net > 1e-6 ? "oui" : "non");
      var diff = Math.abs(net - m.exp), ok = net > 1e-6, guess = pr.value;
      var msg = ok ? ("Les dipôles de liaison ne se compensent pas : " + S.fmt(net, 2) + " D (valeur mesurée " + S.fmt(m.exp, 2) + " D)." + (diff > 0.5 ? " L'écart est grand : additivité des moments de liaison, doublets libres et polarisation mutuelle ne sont pas pris en compte." : "")) : "Par symétrie, la somme vectorielle est nulle : molécule apolaire malgré des liaisons polaires.";
      if (guess !== "-") msg = (((guess === "p") === ok) ? "Bien vu. " : "Raté, regarde la boucle d'addition. ") + msg;
      nt.set(msg, diff > 0.5 && ok ? "warn" : "ok");
    });
  }
});

/* ---------- 3. Pourcentage ionique à partir de μ mesuré ---------- */
var HX = [["hf","HF",1.83,91.7,1.78],["hcl","HCl",1.11,127.4,0.96],["hbr","HBr",0.83,141.4,0.76],["hi","HI",0.45,160.9,0.46],["lif","LiF (gaz)",6.33,156.4,3.00],["nacl","NaCl (gaz)",9.00,236.1,2.23],["kcl","KCl (gaz)",10.27,266.7,2.34]];
SFA.sim({
  id:"uc-c03-pourcentage-ionique", ch:"c03", tag:"Polarité",
  titre:"Caractère ionique d'une liaison : μ = δ·e·d",
  resume:"De μ mesuré et de la longueur de liaison, déduis la charge partielle δ et le pourcentage ionique ; compare à la formule de Pauling.",
  but:"Choisis une molécule diatomique : règle le pourcentage ionique pour retrouver le moment dipolaire mesuré. La charge partielle exacte correspond à μ<sub>exp</sub> = δ·e·d.",
  aRetenir:"μ = q·d avec q = δ·e. Pour une liaison 100 % ionique, μ = e·d (≈ 4,8 D par Å). Pourcentage ionique = μ<sub>exp</sub>/(e·d) × 100. Le caractère ionique grandit avec Δχ, mais la formule de Pauling 100·(1 − e<sup>−Δχ²/4</sup>) n'est qu'une tendance.",
  piege:"Ne confonds pas un moment dipolaire élevé (grand μ, peut venir d'une grande longueur) et un caractère ionique élevé (δ proche de 1). HI est moins polaire que HF mais pas parce que d est plus petit : parce que δ est plus faible. Les valeurs des sels sont des molécules isolées en phase gazeuse, pas des cristaux.",
  build:function(k, S){
    var c = k.canvas(340);
    var ms = k.select("Molécule diatomique", HX.map(function(h){ return [h[0], h[1] + " (Δχ = " + S.fmt(h[4], 2) + ")"]; }), "hcl");
    var sl = k.slider("Pourcentage ionique supposé", 0, 100, 1, 50, "%");
    var ro = k.readouts(["μ expérimental", "e·d (100 % ionique)", "% ionique réel", "% ionique (Pauling)", "μ calculé avec ton %"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, h = HX.filter(function(x){ return x[0] === ms.value; })[0];
      c.clear();
      var mu = h[2], d = h[3] * 1e-12, ed = QE * d / DEBYE, real = mu / ed * 100, paul = 100 * (1 - Math.exp(-h[4] * h[4] / 4));
      var mc = sl.value / 100 * ed;
      /* graphe : % ionique en fonction de Δχ */
      var ax = S.draw.axes(c, {x0:0, x1:3.5, y0:0, y1:100, xl:"Δχ", yl:"% ionique", stepX:0.5, stepY:20});
      S.draw.fn(c, ax, function(x){ return 100 * (1 - Math.exp(-x * x / 4)); }, P.grey, 2, [6,4]);
      HX.forEach(function(q){ var rr = q[2] / (QE * q[3] * 1e-12 / DEBYE) * 100; S.draw.dot(c, ax.X(q[4]), ax.Y(rr), q[0] === h[0] ? 8 : 4, q[0] === h[0] ? P.red : P.acc); S.draw.text(c, q[1].split(" ")[0], ax.X(q[4]) + 6, ax.Y(rr) + 12, {size:10, color:P.acc, align:"left"}); });
      S.draw.line(c, ax.L, ax.Y(sl.value), ax.R, ax.Y(sl.value), P.amber, 1.5, [3,3]);
      S.draw.text(c, "courbe de Pauling", ax.X(2.6), ax.Y(97), {size:11, color:P.grey});
      ro.set(0, S.fmt(mu, 2) + " D"); ro.set(1, S.fmt(ed, 2) + " D"); ro.set(2, S.fmt(real, 0) + " %"); ro.set(3, S.fmt(paul, 0) + " %"); ro.set(4, S.fmt(mc, 2) + " D");
      var err = Math.abs(mc - mu) / mu;
      nt.set("Charge partielle δ = " + S.fmt(real / 100, 2) + " e sur le pôle négatif. Avec ton choix (" + sl.value + " %), μ = " + S.fmt(mc, 2) + " D" + (err < 0.03 ? " : tu retrouves la valeur mesurée." : " ; écart avec la mesure : " + S.fmt(err * 100, 0) + " %.") + " La formule de Pauling donne " + S.fmt(paul, 0) + " % : écart de " + S.fmt(Math.abs(paul - real), 0) + " points avec la valeur déduite de μ.", err < 0.03 ? "ok" : "warn");
    });
  }
});

/* ---------- 4. Dipôle dans un champ électrique ---------- */
var DIP = [["h2o","H₂O",1.85],["hcl","HCl",1.11],["nh3","NH₃",1.47],["chcl3","CHCl₃",1.04],["co2","CO₂ (apolaire)",0],["ch4","CH₄ (apolaire)",0]];
SFA.sim({
  id:"uc-c03-dipole-champ", ch:"c03", tag:"Polarité",
  titre:"Molécules polaires dans un champ électrique : orientation et agitation",
  resume:"Fais varier le champ et la température : l'orientation moyenne ⟨cos θ⟩ = coth x − 1/x, avec x = μE/(kT).",
  but:"Choisis une molécule, règle le champ (échelle logarithmique) et la température : les molécules (δ− en rouge, δ+ en bleu) s'alignent plus ou moins sur le champ. Tu peux aussi faire glisser le point rouge sur la courbe de droite pour imposer x.",
  aRetenir:"L'orientation résulte d'une compétition entre l'énergie d'orientation μE et l'agitation thermique kT : x = μE/(kT). Si x ≪ 1, l'alignement est faible (⟨cos θ⟩ ≈ x/3) ; si x ≫ 1, il est quasi total. Une molécule apolaire (μ = 0) ne s'oriente pas : c'est pourquoi les micro-ondes chauffent l'eau mais pas le CO₂ ou les graisses apolaires.",
  piege:"Modèle simplifié : molécules indépendantes (gaz dilué), sans polarisabilité ni interactions entre molécules. Dans l'eau liquide, la liaison hydrogène limite fortement l'orientation et la constante diélectrique (≈ 78) vient aussi de la corrélation entre molécules. Les champs usuels de laboratoire (≈ 10⁵ V/m) donnent x ≈ 10⁻⁴ : orientation infime.",
  build:function(k, S){
    var c = k.canvas(470);
    var ms = k.select("Molécule", DIP.map(function(d){ return [d[0], d[1] + (d[2] ? " (μ = " + S.fmt(d[2], 2) + " D)" : "")]; }), "h2o");
    var ef = k.slider("Champ E (10<sup>p</sup> V/m) : p", 3, 10, 0.1, 8, "");
    var tt = k.slider("Température T", 100, 500, 5, 298, "K");
    var ro = k.readouts(["E", "x = μE/(kT)", "⟨cos θ⟩", "Énergie d'orientation / kT"]);
    var nt = k.note("", "ok");
    var N = 48, mol = [], i0;
    for (i0 = 0; i0 < N; i0++) mol.push({u:((i0 * 61 + 17) % N + 0.5) / N, ph:((i0 * 37 + 5) % N) / N * 2 * Math.PI, cs:0, tg:0, tm:Math.random() * 0.6, x:(i0 % 8), y:Math.floor(i0 / 8), jx:0, jy:0});
    var cur = {x:0, mu:0}, geo = {}, drag = false;
    function samp(u, x, mu){ var cs; if (x < 1e-6 || !mu) cs = 2 * u - 1; else cs = Math.log(Math.exp(-x) + u * (Math.exp(x) - Math.exp(-x))) / x; if (!isFinite(cs)) cs = x > 0 ? 1 : 2 * u - 1; return Math.max(-1, Math.min(1, cs)); }
    /* glisser le point de la courbe de Langevin : x = μE/(kT) → p = log10(E) */
    c.pointer(function(type, p){
      var g = geo; if (!g.ax) return;
      if (type === "down" && p.x > g.px && p.y > g.py - 6 && p.y < g.py + g.ph + 6) drag = true;
      if (type === "up") drag = false;
      if (drag && (type === "drag" || type === "down") && cur.mu){
        var lx = -4 + (p.x - g.px - 26) / (g.pw - 38) * 6, x = Math.pow(10, Math.max(-4, Math.min(2, lx))), E = x * KB * tt.value / cur.mu;
        ef.set(Math.max(3, Math.min(10, Math.log(E) / Math.LN10))); k.redraw();
      }
    });
    var lp = k.loop(function(dt){
      mol.forEach(function(m){
        m.tm -= dt; if (m.tm <= 0){ m.u = Math.random(); m.tg = samp(m.u, cur.x, cur.mu); m.tm = 0.35 + Math.random() * 0.7; m.dph = (Math.random() - 0.5) * 2.5; }
        m.cs += (m.tg - m.cs) * Math.min(1, dt * 7); m.ph += (m.dph || 0) * dt;
      });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, d = DIP.filter(function(q){ return q[0] === ms.value; })[0], ph = W < 560;
      var E = Math.pow(10, ef.value), mu = d[2] * DEBYE, T = tt.value, x = mu * E / (KB * T);
      var avg = x < 1e-3 ? x / 3 : (1 / Math.tanh(x) - 1 / x);
      if (Math.abs(x - cur.x) > 1e-9 || mu !== cur.mu){ cur.x = x; cur.mu = mu; mol.forEach(function(m){ m.tm = 0; }); }
      UC.bg(c, "#f7f9fc", "#ffffff");
      /* boîte entre les deux plaques */
      var bx = 12, by = 12, bw = ph ? W - 24 : Math.round(W * 0.58), bh = ph ? Math.round(H * 0.56) : H - 24;
      var pl = 22;
      ctx.save(); ctx.fillStyle = "#fbfcfe"; ctx.strokeStyle = P.light; S.draw.rrect(c, bx, by, bw, bh, 12); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.fillStyle = "#c0321d"; S.draw.rrect(c, bx + 6, by + 6, bw - 12, 14, 7); ctx.fill(); ctx.fillStyle = "#1f6fbf"; S.draw.rrect(c, bx + 6, by + bh - 20, bw - 12, 14, 7); ctx.fill(); ctx.restore();
      for (var q = 0; q < 9; q++){ var qx = bx + 22 + q * (bw - 44) / 8; S.draw.text(c, "−", qx, by + 13, {size:13, color:"#fff", weight:800}); S.draw.text(c, "+", qx, by + bh - 13, {size:13, color:"#fff", weight:800}); }
      /* lignes de champ */
      ctx.save(); ctx.globalAlpha = 0.55;
      for (var f = 0; f < 5; f++){ var fx = bx + (f + 0.5) * bw / 5; S.draw.arrow(c, fx, by + bh - 28, fx, by + 34, "#8a95a3", 1.2); }
      ctx.restore();
      S.draw.label(c, "E", bx + 14, by + bh / 2, {color:P.grey, size:13, math:true});
      /* molécules */
      var cols = ph ? 8 : 8, rows = 6, cw = (bw - 24) / cols, chh = (bh - 70) / rows, L = Math.min(cw, chh) * 0.42;
      mol.forEach(function(m){
        var sn = Math.sqrt(Math.max(0, 1 - m.cs * m.cs)), vx = sn * Math.cos(m.ph), vy = m.cs;
        var cx = bx + 12 + m.x * cw + cw / 2, cy = by + 38 + m.y * chh + chh / 2;
        var tx = cx - vx * L, ty = cy + vy * L, hx = cx + vx * L, hy = cy - vy * L;
        UC.stick(ctx, tx, ty, hx, hy, 4, "#aab4c1");
        if (d[2]){ UC.ball(ctx, tx, ty, 5.2, "#e0452f"); UC.ball(ctx, hx, hy, 4, "#3b86d6"); }
        else { UC.ball(ctx, tx, ty, 4.6, "#8a95a3"); UC.ball(ctx, hx, hy, 4.6, "#8a95a3"); }
      });
      /* courbe de Langevin ⟨cos θ⟩(x), axe log */
      var px = ph ? 12 : bw + 24, py = ph ? bh + 28 : 12, pw = ph ? W - 24 : W - bw - 36, phh = ph ? H - bh - 40 : Math.round(H * 0.5);
      geo = {ax:1, px:px - 6, py:py, pw:pw + 6, ph:phh};
      S.draw.panel(c, px - 6, py, pw + 6, phh, {title:"Orientation moyenne", shadow:false});
      var ax0 = px + 26, ax1 = px + pw - 10, ay0 = py + phh - 26, ay1 = py + 32;
      function X(lx){ return ax0 + (lx + 4) / 6 * (ax1 - ax0); } function Y(v){ return ay0 + (ay1 - ay0) * v; }
      ctx.save(); ctx.strokeStyle = P.light; ctx.lineWidth = 1;
      [0, 0.5, 1].forEach(function(v){ ctx.beginPath(); ctx.moveTo(ax0, Y(v)); ctx.lineTo(ax1, Y(v)); ctx.stroke(); S.draw.text(c, S.fmt(v, 1), ax0 - 6, Y(v), {size:10, color:P.grey, align:"right"}); });
      for (var lx = -4; lx <= 2; lx += 2){ ctx.beginPath(); ctx.moveTo(X(lx), ay0); ctx.lineTo(X(lx), ay1); ctx.stroke(); S.draw.text(c, "10" + (lx < 0 ? "⁻" : "") + ["⁰", "¹", "²", "³", "⁴"][Math.abs(lx)], X(lx), ay0 + 12, {size:10, color:P.grey}); }
      ctx.restore();
      S.draw.text(c, "x = μE/(kT)", ax1, ay0 + 24 > py + phh - 4 ? py + phh - 6 : ay0 + 22, {size:10.5, color:P.grey, align:"right"});
      ctx.save(); ctx.strokeStyle = P.acc; ctx.lineWidth = 2.4; ctx.beginPath();
      for (var s = 0; s <= 120; s++){ var l2 = -4 + 6 * s / 120, xx = Math.pow(10, l2), v = xx < 1e-3 ? xx / 3 : 1 / Math.tanh(xx) - 1 / xx; s ? ctx.lineTo(X(l2), Y(v)) : ctx.moveTo(X(l2), Y(v)); }
      ctx.stroke(); ctx.restore();
      if (d[2]){
        var lxc = Math.max(-4, Math.min(2, Math.log(Math.max(x, 1e-9)) / Math.LN10));
        S.draw.line(c, X(lxc), ay0, X(lxc), Y(avg), P.red, 1.4, [3, 3]);
        S.draw.dot(c, X(lxc), Y(avg), 7, P.red);
        S.draw.text(c, "⟨cos θ⟩ = " + S.fmt(avg, 2), ax0 + 8, Y(0.8), {size:11.5, color:P.red, align:"left"});
      } else S.draw.text(c, "μ = 0 : aucune orientation", (ax0 + ax1) / 2, (ay0 + ay1) / 2, {size:11.5, color:P.grey});
      /* légende */
      if (!ph){
        var lyy = py + phh + 24; S.draw.panel(c, px - 6, lyy, pw + 6, 74, {shadow:false});
        UC.ball(ctx, px + 8, lyy + 16, 5, "#e0452f"); S.draw.text(c, "pôle δ− (négatif)", px + 20, lyy + 16, {size:11, align:"left", weight:600});
        UC.ball(ctx, px + 8, lyy + 36, 5, "#3b86d6"); S.draw.text(c, "pôle δ+ (positif)", px + 20, lyy + 36, {size:11, align:"left", weight:600});
        S.draw.text(c, "Le dipôle s'aligne δ− → δ+ sur E", px + 2, lyy + 57, {size:10.5, align:"left", color:P.grey, weight:600});
      }
      ro.set(0, S.sci(E, 2) + " V/m"); ro.set(1, d[2] ? S.sci(x, 2) : "0"); ro.set(2, d[2] ? S.fmt(avg, 3) : "0"); ro.set(3, d[2] ? S.sci(x * avg, 2) : "0");
      nt.set(d[2] === 0 ? "μ = 0 : aucune orientation, quel que soit le champ (modèle sans polarisation induite)." : (x < 0.1 ? "x ≪ 1 : l'agitation thermique domine, orientation moyenne très faible (⟨cos θ⟩ ≈ x/3 = " + S.fmt(x / 3, 3) + ")." : x > 5 ? "x ≫ 1 : champ très intense ou température basse, molécules presque toutes alignées." : "Régime intermédiaire : alignement partiel."), "ok");
    });
  }
});

/* ---------- 5. Charges formelles et hypervalence ---------- */
var FC = [["so4","Sulfate SO₄²⁻","S",6,-2],["po4","Phosphate PO₄³⁻","P",5,-3],["clo4","Perchlorate ClO₄⁻","Cl",7,-1]];
SFA.sim({
  id:"uc-c03-charge-formelle", ch:"c03", tag:"Lewis",
  titre:"Charges formelles : octet respecté ou liaisons doubles ?",
  resume:"Pour SO₄²⁻, PO₄³⁻ et ClO₄⁻, change le nombre de liaisons doubles : les charges formelles se redistribuent.",
  but:"Choisis un oxo-anion et le nombre de liaisons doubles A=O. Observe la charge formelle de l'atome central et des oxygènes. La somme vaut toujours la charge de l'ion.",
  aRetenir:"Charge formelle = électrons de valence − électrons non liants − (électrons liants)/2. La meilleure structure de Lewis minimise les charges formelles (SO₄²⁻ : 2 doubles liaisons, charge de S = 0 ; PO₄³⁻ : 1 ; ClO₄⁻ : 3). Les longueurs expérimentales sont toutes égales : on utilise en pratique plusieurs structures limites équivalentes.",
  piege:"La charge formelle n'est pas la charge réelle. La structure sans liaison double (k = 0) respecte l'octet ; les structures « à octet étendu » qui annulent la charge formelle de l'atome central sont une convention d'enseignement discutée (les orbitales d ne participent guère). Ne dis pas « la liaison S=O est une vraie double » : ce sont des liaisons très polaires, plus justement décrites par des charges séparées.",
  build:function(k, S){
    var c = k.canvas(340);
    var sp = k.select("Espèce", FC.map(function(f){ return [f[0], f[1]]; }), "so4");
    var kd = k.slider("Nombre de liaisons doubles A=O", 0, 4, 1, 2, "");
    var ro = k.readouts(["Liaisons autour de A", "e⁻ autour de A", "FC de A", "FC de chaque O simple", "FC de chaque O double", "Somme des FC"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, f = FC.filter(function(x){ return x[0] === sp.value; })[0], kk = kd.value;
      c.clear();
      var V = f[3], bonds = 4 + kk, fcA = V - bonds, fcS = 6 - 6 - 1, fcD = 6 - 4 - 2, sum = fcA + (4 - kk) * fcS + kk * fcD;
      var cx = W * 0.4, cy = H / 2, R = Math.min(W * 0.28, H * 0.34);
      var ang = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
      for (var i = 0; i < 4; i++){
        var dbl = i < kk, x = cx + Math.cos(ang[i]) * R, y = cy + Math.sin(ang[i]) * R, nx = -Math.sin(ang[i]) * 4, ny = Math.cos(ang[i]) * 4;
        if (dbl){ S.draw.line(c, cx + nx, cy + ny, x + nx, y + ny, P.ink, 2.5); S.draw.line(c, cx - nx, cy - ny, x - nx, y - ny, P.ink, 2.5); }
        else S.draw.line(c, cx, cy, x, y, P.ink, 2.5);
        S.draw.dot(c, x, y, 17, P.red); S.draw.text(c, "O", x, y, {size:14, color:"#fff"});
        S.draw.text(c, dbl ? "0" : "−", x + Math.cos(ang[i]) * 32, y + Math.sin(ang[i]) * 32, {size:14, color:dbl ? P.green : P.acc});
      }
      S.draw.dot(c, cx, cy, 22, P.acc); S.draw.text(c, f[2], cx, cy, {size:15, color:"#fff"});
      S.draw.text(c, (fcA > 0 ? "+" : fcA < 0 ? "−" : "") + Math.abs(fcA), cx + 30, cy - 28, {size:14, color:fcA === 0 ? P.green : P.red});
      var sx = W * 0.72;
      S.draw.text(c, "Meilleur choix : FC(" + f[2] + ") = 0", sx, 50, {size:12, color:P.green});
      S.draw.text(c, "k = " + (V - 4) + " double(s) liaison(s)", sx, 70, {size:12, color:P.green});
      ro.set(0, String(bonds)); ro.set(1, String(2 * bonds)); ro.set(2, S.fmt(fcA, 0)); ro.set(3, kk < 4 ? "−1" : "—"); ro.set(4, kk > 0 ? "0" : "—"); ro.set(5, S.fmt(sum, 0) + " (attendu " + f[4] + ")");
      nt.set("Autour de " + f[2] + " : " + bonds + " liaisons, donc " + 2 * bonds + " électrons" + (2 * bonds > 8 ? " (octet dépassé : hypervalence formelle)" : " (octet respecté)") + ". FC(" + f[2] + ") = " + V + " − " + bonds + " = " + fcA + ". Somme des FC = " + sum + " = charge de l'ion ✓.", kk === V - 4 ? "ok" : "warn");
    });
  }
});
})();
