/* Chimie BA1 · L15 · Nomenclature organique et isomérie de constitution — simulations SFA originales */
(function(){
var PI = Math.PI;
/* ---------- petite algèbre 3D ---------- */
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function dist(a, b){ return len(sub(a, b)); }
function rotZ(v, ang){ var c = Math.cos(ang), s = Math.sin(ang); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]; }

/* ---------- constantes chimiques ---------- */
var BL = {CC1:1.54, CC2:1.34, CC3:1.20, CH:1.09, CO1:1.43, CO2:1.22, OH:0.96, F:1.35, Cl:1.77, Br:1.94, I:2.14};
var MM = {C:12.011, H:1.008, O:15.999, F:18.998, Cl:35.45, Br:79.904, I:126.904};
var COL = {C:"#4a5568", H:"#e8edf3", O:"#d6392f", F:"#6cc24a", Cl:"#2fa84f", Br:"#9a2a1c", I:"#7b3fb0"};
var RAD = {C:0.40, H:0.24, O:0.42, F:0.36, Cl:0.58, Br:0.66, I:0.74};
var STEM = {3:"prop", 4:"but", 5:"pent", 6:"hex", 7:"hept", 8:"oct"};

/* ---------- dessin ---------- */
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
  var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * 0.045);
  return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s};
}
function dragView(c, st){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = Math.max(-1.45, Math.min(1.45, st.b + (p.y - st.ly) * 0.012)); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
}

/* ---------- gabarits de directions autour d'un atome ---------- */
/* hyb : 3 (tétraédrique), 2 (plan), 1 (linéaire) ; E : directions unitaires des liaisons déjà posées ; ref : direction de référence pour décaler (conformation décalée) */
function slots(hyb, E, ref){
  var i, u, e1, e2, out = [];
  if (hyb === 1) return [mul(E[0], -1)];
  if (hyb === 2){
    if (E.length === 1) return [rotZ(E[0], 2 * PI / 3), rotZ(E[0], -2 * PI / 3)];
    return [nrm(mul(add(E[0], E[1]), -1))];
  }
  if (E.length === 1){
    u = E[0];
    var rp = ref ? sub(ref, mul(u, dot(ref, u))) : null;
    if (!rp || len(rp) < 1e-3){ rp = cross(u, [0, 0, 1]); if (len(rp) < 1e-3) rp = cross(u, [0, 1, 0]); }
    e1 = nrm(rp); e2 = cross(u, e1);
    [PI, PI / 3, -PI / 3].forEach(function(p){
      out.push(add(mul(u, -1 / 3), mul(add(mul(e1, Math.cos(p)), mul(e2, Math.sin(p))), Math.sqrt(8) / 3)));
    });
    return out;
  }
  if (E.length === 2){
    var d = nrm(mul(add(E[0], E[1]), -1)), n = nrm(cross(E[0], E[1]));
    if (n[2] < 0) n = mul(n, -1);
    var h = 54.75 * PI / 180;
    return [add(mul(d, Math.cos(h)), mul(n, Math.sin(h))), add(mul(d, Math.cos(h)), mul(n, -Math.sin(h)))];
  }
  return [nrm(mul(add(add(E[0], E[1]), E[2]), -1))];
}

/* ---------- constructeur de molécule (chaîne principale + groupes) ---------- */
/* spec : {n, unsat:"none|ene|yne", up, suf:"none|ol|al|one|oic", sp, subs:[{t:"CH3|C2H5|F|Cl|Br|I", p}]} */
function build(spec){
  var n = spec.n, i, j, err = null;
  var hyb = [0], ord = [0], pos = [null], lig = [[]];
  for (i = 1; i <= n; i++){ hyb[i] = 3; ord[i] = 1; lig[i] = []; }
  if (spec.unsat === "ene"){ hyb[spec.up] = 2; hyb[spec.up + 1] = 2; ord[spec.up] = 2; }
  if (spec.unsat === "yne"){ hyb[spec.up] = 1; hyb[spec.up + 1] = 1; ord[spec.up] = 3; }
  var sufC = spec.suf === "al" || spec.suf === "oic" ? 1 : spec.sp;
  if (spec.suf === "al" || spec.suf === "oic"){ if (hyb[1] !== 3) err = "Le groupe –CHO ou –COOH ne peut pas être au bout d'une double ou triple liaison."; hyb[1] = 2; lig[1].push({el:"O", o:2}); if (spec.suf === "oic") lig[1].push({el:"O", o:1, h:true}); }
  if (spec.suf === "one"){ if (hyb[sufC] !== 3) err = "Le groupe C=O ne peut pas se placer sur un carbone déjà engagé dans C=C ou C≡C."; hyb[sufC] = 2; lig[sufC].push({el:"O", o:2}); }
  if (spec.suf === "ol"){ if (hyb[sufC] !== 3) err = "Un –OH sur un carbone insaturé (énol) est instable : il se transforme en carbonyle."; lig[sufC].push({el:"O", o:1, h:true}); }
  spec.subs.forEach(function(s, idx){
    var L = s.t === "CH3" ? 1 : s.t === "C2H5" ? 2 : 0;
    if (L && L > Math.min(s.p - 1, n - s.p) && !err) err = "Un groupe " + (L === 1 ? "méthyle" : "éthyle") + " en position " + s.p + " rallongerait la chaîne : la chaîne principale serait plus longue (choisis une autre position).";
    lig[s.p].push({el:s.t, o:1, sub:idx});
  });
  for (i = 1; i <= n && !err; i++){
    var total = hyb[i] === 3 ? 4 : hyb[i] === 2 ? 3 : 2, nb = (i > 1 ? 1 : 0) + (i < n ? 1 : 0), free = total - nb - lig[i].length;
    if (free < 0) err = "Le carbone " + i + " porterait trop de liaisons (valence 4 dépassée).";
    else if (i === 1 && spec.suf === "al" && free < 1) err = "Le carbone du groupe –CHO garde son hydrogène : aucun substituant sur C1.";
    else if (hyb[i] === 1 && i > 1 && i < n && lig[i].length) err = "Un carbone d'une triple liaison interne ne peut rien porter d'autre.";
    lig[i].free = free;
  }
  if (err) return {err:err};
  /* squelette en zigzag dans le plan xy */
  var ang = function(k){ return k <= 1 || k >= n ? 109.5 : (hyb[k] === 3 ? 109.5 : hyb[k] === 2 ? 120 : 180); };
  var h = (n > 2 ? (180 - ang(2)) / 2 : 35) * PI / 180, s = -1, bu = [null], k;
  pos[1] = [0, 0, 0];
  for (k = 1; k < n; k++){
    var L = ord[k] === 1 ? BL.CC1 : ord[k] === 2 ? BL.CC2 : BL.CC3;
    bu[k] = [Math.cos(h), Math.sin(h), 0]; pos[k + 1] = add(pos[k], mul(bu[k], L));
    if (k + 1 < n){ var turn = (180 - ang(k + 1)) * PI / 180; if (turn > 1e-6){ h += s * turn; s = -s; } }
  }
  var atoms = [], bonds = [];
  function A(el, p, ci, tag){ atoms.push({el:el, p:p, ci:ci || 0, tag:tag || ""}); return atoms.length - 1; }
  var cIdx = [0];
  for (i = 1; i <= n; i++) cIdx[i] = A("C", pos[i], i, "main");
  for (i = 1; i < n; i++) bonds.push({a:cIdx[i], b:cIdx[i + 1], o:ord[i]});
  function nearestFarSlot(sl, from){   /* choisit parmi des directions celle qui s'éloigne le plus des atomes déjà posés */
    var best = 0, bd = -1;
    sl.forEach(function(d, ix){
      var q = add(from, mul(d, 1.5)), m = 99;
      atoms.forEach(function(a){ var dd = dist(q, a.p); if (dd > 0.2 && dd < m) m = dd; });
      if (m > bd){ bd = m; best = ix; }
    });
    return best;
  }
  function addH(parent, E, ref, count){
    var sl = slots(3, E, ref);
    for (var q = 0; q < count; q++){ var a = A("H", add(atoms[parent].p, mul(sl[q], BL.CH))); bonds.push({a:parent, b:a, o:1}); }
  }
  function addGroup(parent, dir, t, ref){
    var from = atoms[parent].p;
    if (t === "F" || t === "Cl" || t === "Br" || t === "I"){ var x = A(t, add(from, mul(dir, BL[t]))); bonds.push({a:parent, b:x, o:1}); return; }
    var c1 = A("C", add(from, mul(dir, BL.CC1)), 0, "branch"); bonds.push({a:parent, b:c1, o:1});
    if (t === "CH3"){ addH(c1, [mul(dir, -1)], ref, 3); return; }
    var sl = slots(3, [mul(dir, -1)], ref), b = nearestFarSlot(sl, atoms[c1].p), d2 = sl[b], rest = [];
    sl.forEach(function(d, ix){ if (ix !== b) rest.push(d); });
    var c2 = A("C", add(atoms[c1].p, mul(d2, BL.CC1)), 0, "branch"); bonds.push({a:c1, b:c2, o:1});
    for (var q = 0; q < 2; q++){ var a = A("H", add(atoms[c1].p, mul(rest[q], BL.CH))); bonds.push({a:c1, b:a, o:1}); }
    addH(c2, [mul(d2, -1)], rest[0], 3);
  }
  function addOH(parent, dir){
    var from = atoms[parent].p, o = A("O", add(from, mul(dir, BL.CO1))); bonds.push({a:parent, b:o, o:1});
    var cands = [nrm(cross(dir, [0, 0, 1])), nrm(cross([0, 0, 1], dir))], best = null, bd = -1;
    cands.forEach(function(pp){
      var hv = nrm(add(mul(dir, 0.259), mul(pp, 0.966))), q = add(atoms[o].p, mul(hv, BL.OH)), m = 99;
      atoms.forEach(function(a, ai){ if (ai !== o) { var dd = dist(q, a.p); if (dd < m) m = dd; } });
      if (m > bd){ bd = m; best = q; }
    });
    var hh = A("H", best); bonds.push({a:o, b:hh, o:1});
  }
  var side = 0;
  for (i = 1; i <= n; i++){
    var E = [];
    if (i > 1) E.push(mul(bu[i - 1], -1));
    if (i < n) E.push(bu[i]);
    var ref = null;
    if (E.length === 1){ var nb2 = i === 1 ? 2 : n - 1, nb3 = i === 1 ? 3 : n - 2; if (nb3 >= 1 && nb3 <= n) ref = sub(pos[nb3], pos[nb2]); }
    var sl = slots(hyb[i], E, ref), heavy = lig[i], nh = lig[i].free, order = [];
    if (hyb[i] === 3 && E.length === 2){ if (heavy.length === 1){ order = side % 2 === 0 ? [0, 1] : [1, 0]; side++; } else order = [0, 1]; }
    else order = sl.map(function(_, q){ return q; });
    var qn = 0;
    heavy.forEach(function(g){
      var d = sl[order[qn++]];
      if (g.el === "O" && g.o === 2){ var o2 = A("O", add(atoms[cIdx[i]].p, mul(d, BL.CO2))); bonds.push({a:cIdx[i], b:o2, o:2}); }
      else if (g.el === "O"){ addOH(cIdx[i], d); }
      else addGroup(cIdx[i], d, g.el, E.length ? E[0] : null);
    });
    for (j = 0; j < nh; j++){ var dH = sl[order[qn++]]; var hA = A("H", add(atoms[cIdx[i]].p, mul(dH, BL.CH))); bonds.push({a:cIdx[i], b:hA, o:1}); }
  }
  /* centrage */
  var ctr = [0, 0, 0], nc = 0;
  atoms.forEach(function(a){ if (a.el !== "H"){ ctr = add(ctr, a.p); nc++; } });
  ctr = mul(ctr, 1 / nc);
  var rmax = 0;
  atoms.forEach(function(a){ a.p = sub(a.p, ctr); rmax = Math.max(rmax, len(a.p) + RAD[a.el]); });
  var cnt = {}; atoms.forEach(function(a){ cnt[a.el] = (cnt[a.el] || 0) + 1; });
  return {atoms:atoms, bonds:bonds, rmax:rmax, cnt:cnt, n:n, cIdx:cIdx};
}

/* ---------- formule brute, masse, insaturations ---------- */
function formula(m){
  var order = ["C", "H", "Br", "Cl", "F", "I", "O"], s = "", M = 0;
  order.forEach(function(e){ var q = m.cnt[e]; if (q){ s += e + (q > 1 ? "<sub>" + q + "</sub>" : ""); M += q * MM[e]; } });
  var X = (m.cnt.F || 0) + (m.cnt.Cl || 0) + (m.cnt.Br || 0) + (m.cnt.I || 0);
  return {txt:s, M:M, dbe:(2 * m.cnt.C + 2 - m.cnt.H - X) / 2};
}

/* ---------- nom IUPAC (français) ---------- */
var SUBN = {CH3:["méthyl", "methyl"], C2H5:["éthyl", "ethyl"], F:["fluoro", "fluoro"], Cl:["chloro", "chloro"], Br:["bromo", "bromo"], I:["iodo", "iodo"]};
var MULT = ["", "", "di", "tri", "tétra"];
function cmpList(a, b){ for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }
function iupac(spec){
  var n = spec.n, term = spec.suf === "al" || spec.suf === "oic", dirs = term ? [1] : [1, -1];
  var sufP = term ? 1 : spec.sp;
  function numbering(d){
    var loc = function(p){ return d === 1 ? p : n + 1 - p; };
    var subs = spec.subs.map(function(s){ return {t:s.t, l:loc(s.p), key:SUBN[s.t][1]}; });
    var locs = subs.map(function(s){ return s.l; }).sort(function(a, b){ return a - b; });
    var alpha = subs.slice().sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : a.l - b.l; }).map(function(s){ return s.l; });
    return {d:d, suf:spec.suf === "none" ? 0 : loc(sufP), un:spec.unsat === "none" ? 0 : (d === 1 ? spec.up : n - spec.up), subs:subs, locs:locs, alpha:alpha};
  }
  var cand = dirs.map(numbering), pick = cand[0], why = "";
  if (cand.length === 2){
    var A = cand[0], B = cand[1], res = 0;
    if (A.suf !== B.suf){ res = A.suf - B.suf; why = "le groupe principal reçoit le plus petit locant (" + Math.min(A.suf, B.suf) + " plutôt que " + Math.max(A.suf, B.suf) + ")"; }
    else if (A.un !== B.un){ res = A.un - B.un; why = "l'insaturation reçoit le plus petit locant (" + Math.min(A.un, B.un) + " plutôt que " + Math.max(A.un, B.un) + ")"; }
    else if (cmpList(A.locs, B.locs) !== 0){ res = cmpList(A.locs, B.locs); why = "le jeu de locants des substituants est le plus petit possible (" + (res < 0 ? A.locs : B.locs).join(",") + " plutôt que " + (res < 0 ? B.locs : A.locs).join(",") + ")"; }
    else if (cmpList(A.alpha, B.alpha) !== 0){ res = cmpList(A.alpha, B.alpha); why = "les locants sont égaux dans les deux sens : le substituant cité en premier par ordre alphabétique reçoit le plus petit locant"; }
    else why = "la molécule est symétrique : les deux sens de numérotation sont équivalents";
    pick = res <= 0 ? A : B;
  } else why = "le groupe –" + (spec.suf === "al" ? "CHO" : "COOH") + " est toujours le carbone 1";
  /* préfixes */
  var groups = {};
  pick.subs.forEach(function(s){ (groups[s.t] = groups[s.t] || []).push(s.l); });
  var pre = Object.keys(groups).sort(function(a, b){ return SUBN[a][1] < SUBN[b][1] ? -1 : 1; }).map(function(t){
    var ls = groups[t].sort(function(a, b){ return a - b; });
    return ls.join(",") + "-" + MULT[ls.length] + SUBN[t][0];
  });
  var stem = STEM[n], u = pick.un, nm;
  var unName = spec.unsat === "ene" ? ["ène", "én"] : ["yne", "yn"];
  var bare = spec.suf === "none" && spec.unsat !== "none" && n === 3 && !pre.length;
  var base;
  if (spec.unsat === "none") base = stem + "an";
  else base = stem + (bare ? "" : "-" + u + "-") + (spec.suf === "none" ? unName[0] : unName[1]);
  if (spec.unsat !== "none" && bare) base = stem + unName[0];
  if (spec.suf === "none") nm = spec.unsat === "none" ? base + "e" : base;
  else if (spec.suf === "al") nm = base + "al";
  else if (spec.suf === "oic") nm = base + "oïque";
  else if (spec.suf === "ol") nm = base + "-" + pick.suf + "-ol";
  else nm = (n === 3 && spec.unsat === "none") ? base + "one" : base + "-" + pick.suf + "-one";
  var prefix = pre.join("-");
  /* « acide » se place avant les préfixes */
  nm = (spec.suf === "oic" ? "acide " : "") + prefix + nm;
  return {name:nm, why:why, pick:pick};
}

/* ---------- rendu 3D commun ---------- */
function drawMol(c, mol, st, o){
  var ctx = c.ctx, W = c.W, H = c.H, items = [], sc = Math.min(W * 0.52, H * 0.52) / (mol.rmax + 0.3);
  var cx = W * 0.5, cy = H * 0.5, pr = mol.atoms.map(function(a){ return proj3(a.p, st, sc, cx, cy); });
  var showH = o.showH !== false;
  mol.bonds.forEach(function(b){
    var A = mol.atoms[b.a], B = mol.atoms[b.b]; if (!showH && (A.el === "H" || B.el === "H")) return;
    var p = pr[b.a], q = pr[b.b];
    items.push({z:(p.z + q.z) / 2 - 0.001, f:function(){
      var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, ox = -dy / l, oy = dx / l, w = Math.max(2.2, sc * 0.1);
      var col = o.bondCol || "#8693a3", offs = b.o === 1 ? [0] : b.o === 2 ? [-w * 0.9, w * 0.9] : [-w * 1.5, 0, w * 1.5];
      offs.forEach(function(of){
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = b.o === 1 ? w : w * 0.62; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(p.x + ox * of, p.y + oy * of); ctx.lineTo(q.x + ox * of, q.y + oy * of); ctx.stroke(); ctx.restore();
      });
    }});
  });
  mol.atoms.forEach(function(a, i){
    if (!showH && a.el === "H") return;
    var p = pr[i], r = Math.max(a.el === "H" ? 4.2 : 6.5, RAD[a.el] * sc * 0.82 * p.s);
    items.push({z:p.z, f:function(){
      var hex = COL[a.el];
      if (o.hl && a.el === "C") hex = a.tag === "main" ? "#2a6fdb" : "#e08a1e";
      ball(ctx, p.x, p.y, r, hex);
      if (o.num && a.el === "C" && a.ci){
        var lab = o.num(a.ci);
        if (lab) S_text(ctx, lab, p.x, p.y, Math.max(10, r * 1.1));
      }
      if (a.el !== "C" && a.el !== "H" && r > 9) S_text(ctx, a.el === "O" ? "O" : a.el, p.x, p.y, Math.max(9, r * 0.85));
    }});
  });
  items.sort(function(x, y){ return x.z - y.z; });
  items.forEach(function(it){ it.f(); });
  return pr;
}
function S_text(ctx, t, x, y, size){
  ctx.save(); ctx.font = "800 " + Math.round(size) + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(t, x, y); ctx.fillStyle = "#fff"; ctx.fillText(t, x, y); ctx.restore();
}

/* ====================================================================== */
/* 1. Constructeur de molécule 3D qui la nomme                             */
/* ====================================================================== */
var SUFS = [["none", "Aucune (hydrocarbure)"], ["ol", "Alcool (–OH)"], ["al", "Aldéhyde (–CHO)"], ["one", "Cétone (C=O)"], ["oic", "Acide carboxylique (–COOH)"]];
var SUBS = [["", "—"], ["CH3", "méthyle –CH₃"], ["C2H5", "éthyle –C₂H₅"], ["F", "fluoro –F"], ["Cl", "chloro –Cl"], ["Br", "bromo –Br"], ["I", "iodo –I"]];
SFA.sim({
  id:"uc-L15-constructeur-iupac", ch:"L15", tag:"Nomenclature",
  titre:"Constructeur de molécule 3D qui la nomme en IUPAC",
  resume:"Choisis la chaîne, le groupe caractéristique, l'insaturation et jusqu'à trois substituants : la molécule se construit en 3D et son nom IUPAC se forme, avec la raison de la numérotation.",
  but:"Pas à pas : (1) fixe la longueur de la chaîne principale, (2) choisis le groupe caractéristique et sa position, (3) ajoute une double ou triple liaison, (4) place jusqu'à trois substituants. Les numéros sur les carbones sont ceux de la numérotation IUPAC retenue (ils changent de sens si c'est nécessaire). Lis le nom, la formule brute, la masse molaire et le nombre d'insaturations. Glisse sur la molécule pour la tourner.",
  aRetenir:"Méthode : (1) chaîne principale = la plus longue qui contient le groupe prioritaire ; (2) numérotation : d'abord le plus petit locant pour le groupe principal, ensuite pour les insaturations (C=C, C≡C), puis pour l'ensemble des substituants ; si égalité, le substituant cité en premier par ordre alphabétique a le plus petit locant ; (3) substituants par ordre alphabétique (di-, tri- ne comptent pas) ; (4) suffixes : –ane, –ène, –yne ; –ol, –al, –one, acide –oïque. Ordre de priorité des groupes : acide > aldéhyde > cétone > alcool > C=C > C≡C > halogéno et alkyle (préfixes).",
  piege:"On ne choisit pas le sens de numérotation au hasard : le groupe principal d'abord, même si les substituants reçoivent alors de plus grands locants. Un halogène ou un alkyle n'est jamais un suffixe. Et le « di » de diméthyl ne compte pas dans l'ordre alphabétique : éthyl passe avant diméthyl, qui se classe à « m ».",
  build:function(k, S){
    var c = k.canvas(360), st = {a:0.6, b:0.35, spin:true, last:""};
    dragView(c, st); st.onview = function(){ st.spin = false; spinT.set(false); k.redraw(); };
    var nS = k.slider("Longueur de la chaîne principale", 3, 8, 1, 5, "C");
    var fS = k.select("Groupe caractéristique", SUFS, "none");
    var pS = k.slider("Position du groupe (–OH, C=O)", 1, 8, 1, 2, "");
    var uS = k.select("Insaturation", [["none", "Aucune"], ["ene", "Double liaison C=C"], ["yne", "Triple liaison C≡C"]], "none");
    var upS = k.slider("Position de l'insaturation (1er carbone)", 1, 7, 1, 2, "");
    var sub = [];
    for (var q = 0; q < 3; q++) (function(q){
      var t = k.select("Substituant " + (q + 1), SUBS, q === 0 ? "CH3" : "");
      var p = k.slider("Position du substituant " + (q + 1), 2, 7, 1, q === 0 ? 2 : 3, "");
      sub.push({t:t, p:p});
    })(q);
    var hlT = k.toggle("Chaîne principale en bleu, branches en orange", true);
    var HT = k.toggle("Afficher les hydrogènes", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var presets = [
      ["Isooctane", {n:5, f:"none", p:1, u:"none", up:2, s:[["CH3", 2], ["CH3", 2], ["CH3", 4]]}],
      ["Ac. 3-méthylbutanoïque", {n:4, f:"oic", p:1, u:"none", up:2, s:[["CH3", 3], ["", 3], ["", 3]]}],
      ["Pent-3-én-2-ol", {n:5, f:"ol", p:4, u:"ene", up:2, s:[["", 3], ["", 3], ["", 3]]}],
      ["2-Bromo-3-méthylpentane", {n:5, f:"none", p:1, u:"none", up:2, s:[["Br", 2], ["CH3", 3], ["", 3]]}]
    ];
    presets.forEach(function(pr){
      k.button(pr[0], function(){
        var v = pr[1]; nS.set(v.n); fS.set(v.f); pS.set(v.p); uS.set(v.u); upS.set(v.up);
        v.s.forEach(function(s, i){ sub[i].t.set(s[0]); sub[i].p.set(s[1]); });
      });
    });
    var ro = k.readouts(["Nom IUPAC", "Formule brute", "Masse molaire M", "Insaturations"]);
    var nt = k.note("", "ok");
    var cache = {key:"", mol:null};
    var lp = k.loop(function(dt){ if (st.spin && !st.drag){ st.t = (st.t || 0) + dt; st.a = 0.35 + 0.8 * Math.sin(st.t * 0.55); k.redraw(); } });
    lp.play();
    function readSpec(){
      var n = Math.round(nS.value), suf = fS.value, sp = Math.round(pS.value), notes = [];
      if (suf === "al" || suf === "oic"){ sp = 1; }
      else if (suf === "one"){ var s2 = Math.max(2, Math.min(n - 1, sp)); if (s2 !== sp) notes.push("une cétone ne peut pas être terminale : position ramenée à " + s2); sp = s2; }
      else { var s3 = Math.min(n, sp); if (s3 !== sp) notes.push("la position du groupe est limitée à la longueur de la chaîne"); sp = s3; }
      var un = uS.value, up = Math.min(n - 1, Math.round(upS.value));
      if (un !== "none" && (suf === "al" || suf === "oic") && up === 1) { up = 2; notes.push("avec –CHO ou –COOH, l'insaturation commence en C2 au plus tôt"); }
      var subs = [];
      sub.forEach(function(s){ if (s.t.value){ subs.push({t:s.t.value, p:Math.max(1, Math.min(n, Math.round(s.p.value)))}); } });
      return {spec:{n:n, suf:suf, sp:sp, unsat:un, up:up, subs:subs}, notes:notes};
    }
    k.draw(function(){
      var rs = readSpec(), spec = rs.spec, key = JSON.stringify(spec);
      pS.el.closest(".ctl").style.display = spec.suf === "ol" || spec.suf === "one" ? "" : "none";
      upS.el.closest(".ctl").style.display = spec.unsat === "none" ? "none" : "";
      c.clear();
      if (key !== cache.key){ cache.key = key; cache.mol = build(spec); cache.nm = cache.mol.err ? null : iupac(spec); }
      var mol = cache.mol, ctx = c.ctx;
      if (mol.err){
        S.draw.text(c, "Combinaison impossible", c.W / 2, c.H / 2 - 12, {size:16, color:"#c0392b", align:"center"});
        ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set(mol.err, "warn"); return;
      }
      var nm = cache.nm, f = formula(mol);
      drawMol(c, mol, st, {showH:HT.value, hl:hlT.value, num:function(i){ return String(nm.pick.d === 1 ? i : spec.n + 1 - i); }});
      S.draw.text(c, "chaîne principale : " + spec.n + " C (« " + STEM[spec.n] + " »)", 10, 14, {size:11.5, color:"#2c3a4e", align:"left"});
      ro.set(0, nm.name); ro.set(1, f.txt); ro.set(2, S.fmt(f.M, 2) + " g/mol"); ro.set(3, S.fmt(f.dbe, 0));
      var msg = "Numérotation " + (nm.pick.d === 1 ? "de gauche à droite" : "de droite à gauche") + " : " + nm.why + ". ";
      if (spec.unsat === "ene" || spec.unsat === "yne") msg += "Les C=C ne précisent pas ici Z/E (voir L16). ";
      nt.set(msg + (rs.notes.length ? "<br>Ajusté : " + rs.notes.join(" ; ") + "." : ""), rs.notes.length ? "warn" : "ok");
    });
  }
});

/* ====================================================================== */
/* 2. Isomères des alcanes en 3D                                           */
/* ====================================================================== */
var ISO = {
  C4H10:{n:2, list:[
    {sp:{n:4, subs:[]}, bp:-0.5},
    {sp:{n:3, subs:[{t:"CH3", p:2}]}, bp:-11.7}]},
  C5H12:{n:3, list:[
    {sp:{n:5, subs:[]}, bp:36.1},
    {sp:{n:4, subs:[{t:"CH3", p:2}]}, bp:27.8},
    {sp:{n:3, subs:[{t:"CH3", p:2}, {t:"CH3", p:2}]}, bp:9.5}]},
  C6H14:{n:5, list:[
    {sp:{n:6, subs:[]}, bp:68.7},
    {sp:{n:5, subs:[{t:"CH3", p:2}]}, bp:60.3},
    {sp:{n:5, subs:[{t:"CH3", p:3}]}, bp:63.3},
    {sp:{n:4, subs:[{t:"CH3", p:2}, {t:"CH3", p:2}]}, bp:49.7},
    {sp:{n:4, subs:[{t:"CH3", p:2}, {t:"CH3", p:3}]}, bp:58.0}]}
};
Object.keys(ISO).forEach(function(f){ ISO[f].list.forEach(function(it){ it.sp.suf = "none"; it.sp.sp = 1; it.sp.unsat = "none"; it.sp.up = 1; it.name = iupac(it.sp).name; it.mol = build(it.sp); }); });
function chainStats(mol){
  var nb = {}, cs = [], i;
  mol.atoms.forEach(function(a, ix){ if (a.el === "C"){ nb[ix] = 0; cs.push(ix); } });
  mol.bonds.forEach(function(b){ if (mol.atoms[b.a].el === "C" && mol.atoms[b.b].el === "C"){ nb[b.a]++; nb[b.b]++; } });
  var cl = [0, 0, 0, 0, 0]; cs.forEach(function(ix){ cl[nb[ix]]++; });
  var cm = [0, 0, 0]; cs.forEach(function(ix){ cm = add(cm, mol.atoms[ix].p); }); cm = mul(cm, 1 / cs.length);
  var rg = Math.sqrt(cs.reduce(function(s, ix){ var d = sub(mol.atoms[ix].p, cm); return s + dot(d, d); }, 0) / cs.length);
  return {prim:cl[1], sec:cl[2], ter:cl[3], qua:cl[4], rg:rg};
}
SFA.sim({
  id:"uc-L15-isomeres-alcanes-3d", ch:"L15", tag:"Isomérie de constitution",
  titre:"Isomères de C₄H₁₀, C₅H₁₂ et C₆H₁₄ en 3D",
  resume:"Une formule brute, plusieurs molécules : tourne chaque isomère de constitution, lis son nom et vois comment la ramification fait baisser la température d'ébullition.",
  but:"Choisis une formule brute puis un isomère. Il apparaît en 3D (chaîne principale en bleu, branches en orange). Compare le type de carbones (primaire, secondaire, tertiaire, quaternaire), la compacité (rayon de giration) et la température d'ébullition sur le diagramme. Le mode défi cache le nom : retrouve-le !",
  aRetenir:"Des isomères de constitution ont la même formule brute mais un enchaînement d'atomes différent. C₄H₁₀ : 2 isomères, C₅H₁₂ : 3, C₆H₁₄ : 5, C₇H₁₆ : 9, C₈H₁₈ : 18. À même nombre de carbones, la ramification rend la molécule plus compacte, diminue sa surface de contact et donc les forces de London : la température d'ébullition baisse (hexane 69 °C, 2,2-diméthylbutane 50 °C).",
  piege:"Deux dessins différents peuvent représenter la même molécule (rotations autour des liaisons simples) : on compare l'enchaînement des atomes, pas la forme du dessin. Et la chaîne principale est toujours la plus longue, même si elle est tracée en « coude » : le 2-méthylpentane n'est pas du « méthylpentane ».",
  build:function(k, S){
    var c = k.canvas(330), g = k.canvas(160), st = {a:0.5, b:0.3, spin:true};
    dragView(c, st); st.onview = function(){ st.spin = false; spinT.set(false); k.redraw(); };
    var fS = k.seg("Formule brute", [["C4H10", "C₄H₁₀"], ["C5H12", "C₅H₁₂"], ["C6H14", "C₆H₁₄"]], "C6H14", function(){ st.idx = 0; st.res = null; rebuildIso(); });
    var holder = k.select("Isomère", [["0", "—"]], "0", function(v){ st.idx = parseInt(v, 10); st.res = null; });
    var defi = k.toggle("Mode défi : cacher le nom", false, function(){ st.res = null; });
    var guess = k.select("Ton nom", [["", "—"]], "");
    var HT = k.toggle("Afficher les hydrogènes", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var chk = k.button("Vérifier mon nom", function(){
      var it = cur();
      st.res = guess.value === it.name ? "ok" : guess.value ? "bad" : null;
    }, true);
    var ro = k.readouts(["Nom IUPAC", "Isomères de cette formule", "Carbones I / II / III / IV", "Rayon de giration", "Éb (1 atm)"]);
    var nt = k.note("", "ok");
    st.idx = 0;
    function cur(){ return ISO[fS.value].list[st.idx] || ISO[fS.value].list[0]; }
    function rebuildIso(){
      var L = ISO[fS.value].list;
      holder.el.innerHTML = ""; guess.el.innerHTML = "";
      L.forEach(function(it, i){ var o = document.createElement("option"); o.value = String(i); o.textContent = defi.value ? "Isomère " + (i + 1) : it.name; holder.el.appendChild(o); });
      var o0 = document.createElement("option"); o0.value = ""; o0.textContent = "— choisis —"; guess.el.appendChild(o0);
      L.slice().sort(function(a, b){ return a.name < b.name ? -1 : 1; }).forEach(function(it){ var o = document.createElement("option"); o.value = it.name; o.textContent = it.name; guess.el.appendChild(o); });
      holder.el.value = "0"; st.idx = 0;
    }
    rebuildIso();
    var lp = k.loop(function(dt){ if (st.spin && !st.drag){ st.t = (st.t || 0) + dt; st.a = 0.35 + 0.8 * Math.sin(st.t * 0.55); k.redraw(); } });
    lp.play();
    k.draw(function(){
      var F = ISO[fS.value], it = cur(), mol = it.mol, D = defi.value;
      /* le libellé des options dépend du mode défi */
      var opts = holder.el.options;
      for (var i = 0; i < opts.length; i++) opts[i].textContent = D ? "Isomère " + (i + 1) : F.list[i].name;
      guess.el.closest(".ctl").style.display = D ? "" : "none";
      chk.style.display = D ? "" : "none";
      c.clear();
      drawMol(c, mol, st, {showH:HT.value, hl:true});
      var stt = chainStats(mol);
      S.draw.text(c, D ? "Isomère " + (st.idx + 1) + " — quel est son nom ?" : it.name, 10, 14, {size:13, color:"#2c3a4e", align:"left"});
      /* diagramme des températures d'ébullition */
      g.clear();
      var ctx = g.ctx, L = F.list, mn = Math.min.apply(null, L.map(function(x){ return x.bp; })), mx = Math.max.apply(null, L.map(function(x){ return x.bp; }));
      var lo = Math.floor((mn - 8) / 10) * 10, hi = Math.ceil((mx + 8) / 10) * 10;
      var X0 = 150, X1 = g.W - 54, rowH = (g.H - 26) / L.length;
      ctx.save(); ctx.font = "600 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var v = lo; v <= hi; v += 10){ var xx = X0 + (v - lo) / (hi - lo) * (X1 - X0); ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(xx, 4); ctx.lineTo(xx, g.H - 22); ctx.stroke(); ctx.fillText(S.fmt(v, 0), xx, g.H - 18); }
      ctx.restore();
      L.forEach(function(x, i){
        var y = 6 + i * rowH, w = (x.bp - lo) / (hi - lo) * (X1 - X0), sel = i === st.idx;
        ctx.fillStyle = sel ? "#2a6fdb" : "#c4cfdd"; ctx.fillRect(X0, y + 3, w, rowH - 8);
        ctx.fillStyle = "#2c3a4e"; ctx.font = (sel ? "800 " : "600 ") + "11px Mulish, system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(D && !sel ? "isomère " + (i + 1) : x.name.length > 24 ? x.name.slice(0, 23) + "…" : x.name, X0 - 6, y + rowH / 2 - 1);
        ctx.textAlign = "left"; ctx.fillText(x.bp.toFixed(1).replace(".", ","), X0 + w + 5, y + rowH / 2 - 1);
      });
      S.draw.text(g, "Éb (°C)", g.W - 8, g.H - 5, {size:10.5, color:"#5f6b7a", align:"right"});
      ro.set(0, D && st.res !== "ok" ? "?" : it.name);
      ro.set(1, F.n + " isomères");
      ro.set(2, stt.prim + " / " + stt.sec + " / " + stt.ter + " / " + stt.qua);
      ro.set(3, S.fmt(stt.rg, 2) + " Å");
      ro.set(4, it.bp.toFixed(1).replace(".", ",") + " °C");
      var msg;
      if (D){
        if (st.res === "ok") msg = "Bravo : c'est bien le " + it.name + ". Vérifie : chaîne la plus longue de " + it.sp.n + " carbones, " + it.sp.subs.length + " méthyle(s).";
        else if (st.res === "bad") msg = "Pas tout à fait. Repère d'abord la chaîne carbonée la plus longue, puis compte et localise les branches (numérote pour avoir les plus petits locants).";
        else msg = "Compte les carbones de la chaîne la plus longue (en bleu), repère les branches (en orange), puis choisis le nom et clique sur « Vérifier ».";
      } else {
        var best = L.reduce(function(a, b){ return a.bp > b.bp ? a : b; });
        msg = it === best ? "Isomère non ramifié : la molécule la plus étirée (Rg le plus grand) a le plus de contacts de London, donc l'Éb la plus élevée." :
          "Plus la molécule est ramifiée, plus elle est compacte : Rg = " + S.fmt(stt.rg, 2) + " Å, contre " + S.fmt(chainStats(best.mol).rg, 2) + " Å pour l'isomère linéaire. Moins de surface de contact, forces de London plus faibles, Éb plus basse de " + S.fmt(best.bp - it.bp, 1) + " °C.";
      }
      nt.set(msg + " <i>Conformère étiré (anti) : le rayon de giration est un indicateur, pas une mesure exacte.</i>", st.res === "bad" ? "warn" : "ok");
    });
  }
});
})();
