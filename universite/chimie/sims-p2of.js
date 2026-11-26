/* Chimie BA1 · chimie organique (lot P2-OF) : polyosides en 3D (amidon, glycogène, cellulose),
   électrophorèse des acides aminés, plan amide et carte de Ramachandran.
   Simulations SFA originales ; la 3D est dessinée à la main sur un canevas 2D (projection perspective). */
(function(){
var PI = Math.PI, DEG = PI / 180, FONT = "Mulish, system-ui, sans-serif";

/* ---------- petite algèbre 3D ---------- */
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function dist(a, b){ return len(sub(a, b)); }
function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function lerp(a, b, t){ return a + (b - a) * t; }
function lerp3(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }
function ease(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function rotAx(v, k, ang){ k = nrm(k); var c = Math.cos(ang), s = Math.sin(ang); return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c))); }
/* place D à partir de A, B, C : |CD| = L, angle BCD = ang (degrés), torsion ABCD = tor (degrés) */
function nerf(A, B, C, L, ang, tor){
  var bc = nrm(sub(C, B)), n = nrm(cross(sub(B, A), bc)), m = cross(n, bc);
  var a = ang * DEG, t = tor * DEG;
  return add(C, add(add(mul(bc, -L * Math.cos(a)), mul(m, L * Math.sin(a) * Math.cos(t))), mul(n, L * Math.sin(a) * Math.sin(t))));
}
function torsion(A, B, C, D){
  var b1 = nrm(sub(C, B)), v = sub(sub(A, B), mul(b1, dot(sub(A, B), b1))), w = sub(sub(D, C), mul(b1, dot(sub(D, C), b1)));
  return Math.atan2(dot(cross(b1, v), w), dot(v, w)) / DEG;
}
/* repère orthonormé (lignes) porté par trois points : origine p1 */
function frame3(p0, p1, p2){
  var e1 = nrm(sub(p0, p1)), u = sub(p2, p1), e2 = nrm(sub(u, mul(e1, dot(u, e1)))), e3 = cross(e1, e2);
  return [e1, e2, e3];
}
/* pose rigide {R (3×3, lignes), t} qui envoie (a0,a1,a2) sur (b0,b1,b2) (triangles égaux) */
function poseFrom(a0, a1, a2, b0, b1, b2){
  var Fa = frame3(a0, a1, a2), Fb = frame3(b0, b1, b2), R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) R[i][j] = Fb[0][i] * Fa[0][j] + Fb[1][i] * Fa[1][j] + Fb[2][i] * Fa[2][j];
  return {R:R, t:sub(b1, mApply(R, a1))};
}
function mApply(R, p){ return [dot(R[0], p), dot(R[1], p), dot(R[2], p)]; }
function pApply(P, p){ return add(mApply(P.R, p), P.t); }
function pCompose(A, B){ /* A ∘ B */
  var R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) R[i][j] = A.R[i][0] * B.R[0][j] + A.R[i][1] * B.R[1][j] + A.R[i][2] * B.R[2][j];
  return {R:R, t:pApply(A, B.t)};
}
function pInverse(A){
  var R = [[A.R[0][0], A.R[1][0], A.R[2][0]], [A.R[0][1], A.R[1][1], A.R[2][1]], [A.R[0][2], A.R[1][2], A.R[2][2]]];
  return {R:R, t:mul(mApply(R, A.t), -1)};
}
var P_ID = {R:[[1, 0, 0], [0, 1, 0], [0, 0, 1]], t:[0, 0, 0]};

/* ---------- rendu ---------- */
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function rgba(hex, a){ var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function ball(ctx, x, y, r, hex, alpha){
  if (!(r > 0)) return;
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
/* projection perspective ; V = {a, b, sc, cx, cy, cam} (cam : distance de la caméra, mêmes unités que p) */
function proj(p, V){
  var r = rot3(p, V.a, V.b), s = V.cam / Math.max(V.cam * 0.35, V.cam - r[2]);
  return {x:V.cx + r[0] * V.sc * s, y:V.cy - r[1] * V.sc * s, z:r[2], s:s};
}
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function label(ctx, s, x, y, o){
  o = o || {}; var size = o.size || 12;
  ctx.save(); ctx.font = (o.weight || 700) + " " + size + "px " + FONT; ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle";
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  var w = ctx.measureText(s).width;
  if (o.bg){
    var bw = w + 12, h = size + 8, bx = ctx.textAlign === "left" ? x - 6 : ctx.textAlign === "right" ? x - bw + 6 : x - bw / 2;
    ctx.fillStyle = o.bg; rr(ctx, bx, y - h / 2, bw, h, 7); ctx.fill();
    if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  ctx.fillStyle = o.col || "#2c3a4e"; ctx.fillText(s, x, y); ctx.restore();
  return w;
}
function textW(ctx, s, size, weight){ ctx.save(); ctx.font = (weight || 700) + " " + size + "px " + FONT; var w = ctx.measureText(s).width; ctx.restore(); return w; }
/* étiquette gardée dans le cadre : renvoie le rectangle occupé */
function tag(ctx, s, x, y, W, H, o){
  o = o || {}; var size = o.size || 12, w = textW(ctx, s, size, o.weight) + 12, h = size + 8;
  var cx = clamp(x, w / 2 + 3, W - w / 2 - 3), cy = clamp(y, h / 2 + 3, H - h / 2 - 3);
  label(ctx, s, cx, cy, {size:size, col:o.col, bg:o.bg || "rgba(255,255,255,.92)", border:o.border, weight:o.weight, alpha:o.alpha});
  return {x:cx - w / 2, y:cy - h / 2, w:w, h:h};
}
function arrowHead(ctx, x, y, ang, s){
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s * Math.cos(ang - 0.42), y - s * Math.sin(ang - 0.42)); ctx.lineTo(x - s * Math.cos(ang + 0.42), y - s * Math.sin(ang + 0.42)); ctx.closePath(); ctx.fill();
}
function bgScene(ctx, W, H, c0, c1){
  var bg = ctx.createRadialGradient(W * 0.48, H * 0.42, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  bg.addColorStop(0, c0 || "#ffffff"); bg.addColorStop(1, c1 || "#e3e9f3"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}
function seeded(n, seed){ var sd = seed || 7, out = []; function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; } for (var i = 0; i < n; i++) out.push({x:rnd(), y:rnd(), r:rnd() * 6.28, v:rnd()}); return out; }
function solvent(ctx, W, H, list, t, alpha){
  ctx.save(); ctx.globalAlpha = alpha || 0.12;
  list.forEach(function(m){
    var x = (m.x + 0.012 * Math.sin(t * 0.4 + m.r * 5)) * W, y = (m.y + 0.012 * Math.cos(t * 0.33 + m.r * 7)) * H;
    ctx.save(); ctx.translate(x, y); ctx.rotate(m.r + t * 0.1); ctx.fillStyle = "#d6392f"; ctx.beginPath(); ctx.arc(0, 0, 5, 0, 7); ctx.fill();
    ctx.fillStyle = "#9aa6b6"; ctx.beginPath(); ctx.arc(-5, 4, 3, 0, 7); ctx.arc(5, 4, 3, 0, 7); ctx.fill(); ctx.restore();
  });
  ctx.restore();
}
function F(x, d){ var s = (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d).replace(".", ","); return s.replace("-", "−"); }
function Fs(x, d){ return (x > 0.5 * Math.pow(10, -d) ? "+" : "") + F(x, d); }
function viewDrag(c, st, lim){
  c.pointer(function(type, p){
    if (st.hit && st.hit(type, p)) return;
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.lx != null){
      st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, lim ? lim[0] : -1.45, lim ? lim[1] : 1.45);
      if (lim && lim[2] != null) st.a = clamp(st.a, lim[2], lim[3]);
      st.lx = p.x; st.ly = p.y; st.moved = true;
    }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
}
/* hauteur du canevas : jamais nulle ni infinie, même si la largeur vaut 0 */
function ratioCanvas(c, desk, phone){
  var r0 = c.resize;
  c.resize = function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); c.ratio = w < 480 ? phone : desk; r0(); };
  c.resize();
}
function fixedCanvas(c, hDesk, hPhone){
  var r0 = c.resize;
  c.resize = function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); c.ratio = (w < 480 ? hPhone : hDesk) / w; r0(); };
  c.resize();
}

/* ====================================================================== */
/* 1. Polyosides en 3D : amylose, amylopectine, glycogène, cellulose       */
/* ====================================================================== */
/* Glucopyranose ⁴C₁ idéalisé (Å) : cycle en chaise, substituants équatoriaux (sauf O1 axial pour α).
   Repère local : cycle dans le plan xy, C1 vers +x, C4 vers −x ; z = haut du cycle. */
var GL = (function(){
  var rho = 1.42, z0 = 0.25, A = {C1:0, C2:-60, C3:-120, C4:180, C5:120, O5:60}, S = {C1:-1, C2:1, C3:-1, C4:1, C5:-1, O5:1}, P = {};
  Object.keys(A).forEach(function(k){ P[k] = [rho * Math.cos(A[k] * DEG), rho * Math.sin(A[k] * DEG), z0 * S[k]]; });
  function eq(k){ return nrm([Math.cos(A[k] * DEG), Math.sin(A[k] * DEG), -S[k] * 0.36]); }
  P.O2 = add(P.C2, mul(eq("C2"), 1.43)); P.O3 = add(P.C3, mul(eq("C3"), 1.43)); P.O4 = add(P.C4, mul(eq("C4"), 1.43));
  P.C6 = add(P.C5, mul(eq("C5"), 1.52)); P.O6 = nerf(P.O5, P.C5, P.C6, 1.43, 111, 60);
  function tpl(alpha){
    var Q = {}; for (var k in P) Q[k] = P[k].slice();
    Q.O1 = add(Q.C1, alpha ? [0, 0, -1.43] : mul(eq("C1"), 1.43));
    return Q;
  }
  var T = {a:tpl(true), b:tpl(false)};
  /* pose relative du résidu suivant (côté réducteur) : son O4 est l'O1 du précédent ; φ = O5–C1–O1–C4', ψ = C1–O1–C4'–C3' */
  function link(L, phi, psi){
    var C4n = nerf(L.O5, L.C1, L.O1, 1.43, 117, phi);
    var lc = dist(L.C4, L.C3), an = Math.acos(dot(nrm(sub(L.O4, L.C4)), nrm(sub(L.C3, L.C4)))) / DEG;
    var C3n = nerf(L.C1, L.O1, C4n, lc, an, psi);
    return poseFrom(L.O4, L.C4, L.C3, L.O1, C4n, C3n);
  }
  /* angles choisis pour retrouver 6 glucoses par tour (hélice gauche, amylose V) et une chaîne 2₁ (cellulose) */
  var Ma = link(T.a, 82, 128), Mb = link(T.b, -100, 100);
  return {T:T, Ma:Ma, Mb:Mb, MaInv:pInverse(Ma), MbInv:pInverse(Mb)};
})();
var RING = ["C1", "C2", "C3", "C4", "C5", "O5"];
var PS = {
  amylose:{n:"Amylose (amidon)", alpha:true, Lc:999, nDef:18, iode:"bleu-noir", iodeCol:"#1d2350", forme:"hélice"},
  amylopectine:{n:"Amylopectine (amidon)", alpha:true, Lc:24, nDef:60, iode:"violet-rouge", iodeCol:"#6a2453", forme:"arbre"},
  glycogene:{n:"Glycogène", alpha:true, Lc:12, nDef:48, iode:"brun-rouge", iodeCol:"#8a3a1c", forme:"arbre"},
  cellulose:{n:"Cellulose", alpha:false, Lc:999, nDef:12, iode:"pas de coloration (jaune de l'iode)", iodeCol:"#d7a53a", forme:"droite"}
};
var M_GLC = 180.156, M_H2O = 18.015;
/* construit le polymère : liste de résidus {P (pose), chain, idx, parent, link:"14"|"16"|null, pos:{...}} */
function buildPoly(kind, n){
  var ps = PS[kind], T = ps.alpha ? GL.T.a : GL.T.b, Minv = ps.alpha ? GL.MaInv : GL.MbInv, res = [];
  function place(P, chain, idx, parent, lk){
    var pos = {}; for (var k in T) pos[k] = pApply(P, T[k]);
    var r = {P:P, chain:chain, idx:idx, parent:parent, link:lk, pos:pos, child:null, branches:[]}; res.push(r); return r;
  }
  if (kind === "cellulose"){
    /* trois chaînes parallèles d'un même feuillet, reliées par liaisons H */
    var base = []; var P = P_ID;
    for (var i = 0; i < n; i++){ base.push(P); P = pCompose(P, Minv); }
    var r0 = base[0], rN = base[Math.max(1, n - 1)];
    var c0 = pApply(r0, [0, 0, 0]), c1 = pApply(base[1], [0, 0, 0]), ax = nrm(sub(pApply(base[2] || rN, [0, 0, 0]), c0));
    var nz = nrm(sub(pApply(r0, [0, 0, 1]), c0)); nz = nrm(sub(nz, mul(ax, dot(nz, ax)))); var side = cross(nz, ax);
    for (var ch = 0; ch < 3; ch++){
      var off = add(mul(side, (ch - 1) * 7.1), mul(ax, (ch - 1) * 2.4));
      for (i = 0; i < n; i++){
        var Pi = {R:base[i].R, t:add(base[i].t, off)};
        var r = place(Pi, ch, i, i > 0 ? res[res.length - 1] : null, i > 0 ? "14" : null);
        if (r.parent) r.parent.child = r;
      }
    }
    return res;
  }
  /* chaînes : la chaîne k (k ≥ 1) se greffe en α(1→6) sur la chaîne floor((k−1)/2) */
  var chains = [], left = n, Lc = ps.Lc;
  for (var k = 0; left > 0; k++){ var L = Math.min(Lc, left); chains.push(L); left -= L; }
  var chainRes = [];
  for (k = 0; k < chains.length; k++){
    var list = [], P0;
    if (k === 0) P0 = P_ID;
    else {
      var pc = chainRes[Math.floor((k - 1) / 2)], at = (k - 1) % 2 === 0 ? 2 : 2 + Math.ceil(Lc / 2);
      at = Math.min(at, pc.length - 1);
      var host = pc[at];
      P0 = bestBranch(host, chains[k], res, T, Minv);
      list.parentHost = host;
    }
    var P1 = P0;
    for (var j = 0; j < chains[k]; j++){
      var rj = place(P1, k, j, j > 0 ? list[j - 1] : (k > 0 ? list.parentHost : null), j > 0 ? "14" : (k > 0 ? "16" : null));
      if (j > 0) list[j - 1].child = rj; else if (k > 0) list.parentHost.branches.push(rj);
      list.push(rj); P1 = pCompose(P1, Minv);
    }
    chainRes.push(list);
  }
  return res;
}
/* greffe α(1→6) : on essaie plusieurs torsions et on garde celle qui éloigne le plus la branche du reste */
function bestBranch(host, Lb, res, T, Minv){
  var C5 = host.pos.C5, C6 = host.pos.C6, O6 = host.pos.O6, best = null, bs = -1;
  var others = [], cen = [0, 0, 0]; res.forEach(function(r){ RING.concat(["C6", "O6", "O2", "O3"]).forEach(function(k){ others.push(r.pos[k]); }); });
  others.forEach(function(o){ cen = add(cen, mul(o, 1 / others.length)); });
  for (var ps = -180; ps < 180; ps += 30) for (var ph = -180; ph < 180; ph += 30){
    var C1b = nerf(C5, C6, O6, 1.43, 117, ps), O5b = nerf(C6, O6, C1b, 1.42, 109.5, ph);
    var P = poseFrom(T.O1, T.C1, T.O5, O6, C1b, O5b), mn = 99, Pq = P;
    for (var j = 0; j < Math.min(Lb, 8); j++){
      ["C1", "C3", "C5", "O6", "O2"].forEach(function(k){ var p = pApply(Pq, T[k]); others.forEach(function(o){ var d = dist(p, o); if (d < mn) mn = d; }); });
      Pq = pCompose(Pq, Minv);
    }
    var sc = Math.min(mn, 3.2) * 10 + dist(pApply(Pq, T.C3), cen) * 0.4;
    if (sc > bs){ bs = sc; best = P; }
  }
  return best;
}
/* liste d'atomes et de liaisons d'un polymère construit */
function polyGeom(res, kind){
  var atoms = [], bonds = [], idx = {};
  res.forEach(function(r, i){
    var keys = RING.concat(["O2", "O3", "C6", "O6"]);
    var redEnd = !r.parent;   /* O1 libre : extrémité réductrice */
    if (redEnd || r.link === "14") keys.push("O1");
    if (!r.child) keys.push("O4");   /* extrémité non réductrice : OH en C4 */
    keys.forEach(function(k){ idx[i + ":" + k] = atoms.length; atoms.push({res:i, k:k, el:k[0], p:r.pos[k], bridge:false}); });
  });
  res.forEach(function(r, i){
    function A(k){ return idx[i + ":" + k]; }
    [["C1", "C2"], ["C2", "C3"], ["C3", "C4"], ["C4", "C5"], ["C5", "O5"], ["O5", "C1"], ["C2", "O2"], ["C3", "O3"], ["C5", "C6"], ["C6", "O6"]].forEach(function(b){ bonds.push({a:A(b[0]), b:A(b[1]), res:i}); });
    if (A("O1") != null) bonds.push({a:A("C1"), b:A("O1"), res:i});
    if (A("O4") != null) bonds.push({a:A("C4"), b:A("O4"), res:i});
    if (r.link === "14"){ var j = res.indexOf(r.parent); bonds.push({a:idx[j + ":C4"], b:A("O1"), res:i}); atoms[A("O1")].bridge = "14"; }
    if (r.link === "16"){ var h = res.indexOf(r.parent); bonds.push({a:A("C1"), b:idx[h + ":O6"], res:i}); atoms[idx[h + ":O6"]].bridge = "16"; atoms[idx[h + ":O6"]].bres = i; }
  });
  /* liaisons H (O···O entre 2,5 et 3,1 Å) : intrachaîne O3'···O5 et interchaînes O6···O3 (cellulose) */
  var hb = [];
  if (kind === "cellulose"){
    for (var a = 0; a < atoms.length; a++) for (var b = a + 1; b < atoms.length; b++){
      var A1 = atoms[a], B1 = atoms[b]; if (A1.el !== "O" || B1.el !== "O" || A1.res === B1.res) continue;
      var ra = res[A1.res], rb = res[B1.res], adjacent = ra.parent === rb || rb.parent === ra;
      if (ra.chain === rb.chain && !adjacent) continue;
      if (adjacent && (A1.k === "O1" || B1.k === "O1")) continue;
      var d = dist(A1.p, B1.p); if (d > 2.5 && d < 3.1) hb.push({a:a, b:b, d:d, inter:ra.chain !== rb.chain});
    }
  }
  var ring = res.map(function(r, i){ return RING.map(function(k){ return idx[i + ":" + k]; }); });
  return {atoms:atoms, bonds:bonds, hb:hb, ring:ring, idx:idx};
}
/* axe local des hélices : moyenne glissante des centres de cycles sur 6 résidus d'une même chaîne */
function helixAxis(res){
  var out = [], byChain = {};
  res.forEach(function(r, i){ (byChain[r.chain] = byChain[r.chain] || []).push(i); });
  Object.keys(byChain).forEach(function(c){
    var L = byChain[c]; if (L.length < 7) return;
    for (var j = 0; j + 6 <= L.length; j++){
      var m = [0, 0, 0]; for (var q = 0; q < 6; q++){ var r = res[L[j + q]]; RING.forEach(function(k){ m = add(m, mul(r.pos[k], 1 / 36)); }); }
      out.push({p:m, res:L[j + 5], clen:L.length});
    }
  });
  return out;
}
function polyStats(kind, n){
  var ps = PS[kind], chains = kind === "cellulose" ? 3 : 1, per = n, br = 0;
  if (ps.Lc < 999){ br = Math.ceil(n / ps.Lc) - 1; }
  var links = kind === "cellulose" ? 3 * (n - 1) : n - 1;
  var M = n * M_GLC - (n - 1) * M_H2O;
  return {br:br, links:links, M:M, chains:chains};
}

/* dessin de Haworth (2D) : un glucopyranose vu en perspective ; renvoie les positions utiles */
function haworth(e, x, y, s, o){
  o = o || {};
  var V = {O5:[0.42, -0.34], C1:[0.86, 0.02], C2:[0.46, 0.38], C3:[-0.4, 0.38], C4:[-0.82, 0.02], C5:[-0.38, -0.34]};
  var P = {}; for (var k in V) P[k] = [x + V[k][0] * s, y + V[k][1] * s];
  var ord = ["C1", "C2", "C3", "C4", "C5", "O5"];
  e.save();
  var g = e.createLinearGradient(x, y - s * 0.4, x, y + s * 0.4); g.addColorStop(0, o.fill0 || "#fff7e6"); g.addColorStop(1, o.fill1 || "#f2d9a6");
  e.fillStyle = g; e.beginPath(); ord.forEach(function(k, i){ if (i === 0) e.moveTo(P[k][0], P[k][1]); else e.lineTo(P[k][0], P[k][1]); }); e.closePath(); e.fill();
  e.strokeStyle = "#5b4a2e"; e.lineJoin = "round"; e.lineCap = "round";
  for (var i = 0; i < 6; i++){
    var a = P[ord[i]], b = P[ord[(i + 1) % 6]], front = (ord[i] === "C1" && ord[(i + 1) % 6] === "C2") || (ord[i] === "C2") || (ord[i] === "C3");
    e.lineWidth = front ? Math.max(3, s * 0.09) : 1.6; e.beginPath(); e.moveTo(a[0], a[1]); e.lineTo(b[0], b[1]); e.stroke();
  }
  e.restore();
  var fs = Math.max(9.5, Math.min(12, s * 0.2));
  label(e, "O", P.O5[0], P.O5[1] - 1, {size:fs, col:"#c0392b", weight:800, bg:"rgba(255,255,255,.9)"});
  /* substituants : longueur verticale */
  var d = s * 0.36;
  function sub2(k, up, txt, col){
    var p = P[k], y2 = p[1] + (up ? -d : d);
    e.save(); e.strokeStyle = col || "#5b4a2e"; e.lineWidth = 1.6; e.beginPath(); e.moveTo(p[0], p[1]); e.lineTo(p[0], y2); e.stroke(); e.restore();
    if (txt) label(e, txt, p[0], y2 + (up ? -fs * 0.55 : fs * 0.6), {size:fs, col:col || "#2c3a4e", weight:700});
    return [p[0], y2];
  }
  var out = {P:P, fs:fs, d:d};
  if (!o.noC6) out.C6 = sub2("C5", true, o.c6txt === undefined ? "CH₂OH" : o.c6txt, o.c6col);
  else out.C6 = sub2("C5", true, "", "#5b4a2e");
  sub2("C2", false, o.small ? "" : "OH"); sub2("C3", true, o.small ? "" : "OH");
  out.C1 = sub2("C1", o.c1up, o.c1txt === undefined ? "OH" : o.c1txt, o.c1col);
  out.C4 = sub2("C4", false, o.c4txt === undefined ? "HO" : o.c4txt, o.c4col);
  return out;
}

SFA.sim({
  id:"org-polyosides-3d", ch:"L16", tag:"Glucides",
  titre:"Amidon, glycogène, cellulose : une liaison change tout",
  resume:"Des glucoses s'assemblent un à un en 3D. Liés en α(1→4), ils s'enroulent en hélice (amylose) ; en β(1→4), ils forment des chaînes droites qui s'accrochent par liaisons H (cellulose). Ajoute des branchements α(1→6) pour obtenir l'amylopectine et le glycogène.",
  but:"Choisis le polysaccharide : les glucoses arrivent un à un et se lient en libérant une molécule d'eau (condensation). Regarde la forme obtenue : hélice, chaîne droite ou arbre. Glisse sur la molécule pour la tourner, regarde l'hélice dans l'axe pour voir l'iode qui s'y loge. En dessous, la liaison en représentation de Haworth.",
  aRetenir:"Un polyoside est une chaîne de glucoses unis par des liaisons glycosidiques (acétals) : chaque liaison libère une molécule d'H₂O, donc M = n × 180,16 − (n − 1) × 18,02 g/mol. Avec des liaisons α(1→4), l'O de C1 est axial : la chaîne tourne et s'enroule en hélice gauche d'environ 6 glucoses par tour (amylose de l'amidon). Avec des liaisons β(1→4), l'O de C1 est équatorial : la chaîne reste droite, un glucose sur deux est retourné, et les chaînes parallèles se lient par liaisons H en fibres solides (cellulose). Des branchements α(1→6) donnent l'amylopectine (environ 1 tous les 24 à 30 glucoses) et le glycogène (1 tous les 8 à 12) : plus de branches, donc plus d'extrémités non réductrices pour libérer vite le glucose.",
  piege:"α et β ne désignent pas deux sucres différents : c'est le même D-glucose, seule la position de l'O du carbone anomère C1 change. Nos enzymes (amylases) coupent les liaisons α mais pas les liaisons β : on digère l'amidon, pas la cellulose. Et l'eau iodée ne colore en bleu-noir que les longues hélices (amylose) : le glycogène, très ramifié, donne seulement une teinte brun-rouge.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.72}); ratioCanvas(c, 0.72, 0.88);
    var g = k.canvas(160); fixedCanvas(g, 168, 300);
    var st = {a:-0.12, b:0.22, spin:0, kind:"amylose", n:18, shown:0, play:true, hold:0, t:0, sc:null, cx:null, cy:null, water:[], last:-1, auto:true};
    viewDrag(c, st);
    var polS = k.seg("Polysaccharide", [["amylose", "amylose"], ["amylopectine", "amylopectine"], ["glycogene", "glycogène"], ["cellulose", "cellulose"]], "amylose", function(v){ st.kind = v; nS.set(PS[v].nDef); st.n = PS[v].nDef; rebuild(true); });
    var nS = k.slider("Nombre de glucoses n", 4, 60, 1, 18, "", function(v){ st.n = Math.round(v); rebuild(false); });
    k.button("Réassembler", function(){ rebuild(true); }, true);
    var atS = k.seg("Atomes", [["cyc", "cycles et ponts O"], ["all", "tous (sauf H)"]], "cyc");
    var ioT = k.toggle("Eau iodée (test de l'amidon)", true);
    var hbT = k.toggle("Liaisons H (cellulose)", true);
    var spT = k.toggle("Rotation automatique", true, function(v){ st.auto = v; });
    var ro = k.readouts(["Liaison glycosidique", "Glucoses liés", "Liaisons formées · H₂O libérées", "Masse molaire", "Forme", "Eau iodée"]);
    var nt = k.note("", "ok");
    var G = null, R = null, AX = [], order = [], solv = seeded(10, 21);
    function rebuild(replay){
      R = buildPoly(st.kind, st.n); G = polyGeom(R, st.kind); AX = helixAxis(R);
      /* ordre d'arrivée : par chaîne, de l'extrémité réductrice vers l'extrémité non réductrice */
      order = R.map(function(r, i){ return i; });
      var rank = {}; order.forEach(function(i, q){ rank[i] = q; }); G.rank = rank;
      /* centre et rayon (pour le cadrage) */
      var m = [0, 0, 0]; G.atoms.forEach(function(a){ m = add(m, a.p); }); m = mul(m, 1 / G.atoms.length);
      var rad = 0; G.atoms.forEach(function(a){ rad = Math.max(rad, dist(a.p, m)); }); G.ctr = m; G.rad = rad;
      /* axe principal approximatif (pour la rotation automatique sur l'axe de la chaîne) */
      if (st.kind === "amylose" || st.kind === "cellulose"){
        var a0 = R[0].pos.C3, a1 = R[st.kind === "cellulose" ? st.n - 1 : R.length - 1].pos.C3;
        if (AX.length > 1) { a0 = AX[0].p; a1 = AX[AX.length - 1].p; }
        G.axis = nrm(sub(a1, a0));
      } else G.axis = null;
      if (replay){ st.shown = 0; st.water = []; st.last = -1; st.play = true; }
      else { st.shown = Math.min(st.shown, R.length); st.water = st.water.filter(function(w){ return w.res < R.length; }); if (st.last >= R.length) st.last = -1; }
      st.sc = null;
    }
    rebuild(true);
    /* orientation du modèle : l'axe de la chaîne couché à l'horizontale, puis rotation autour de cet axe */
    function orient(p, spin){
      var q = sub(p, G.ctr);
      if (G.axis){
        var ax = G.axis, tgt = [1, 0, 0], k1 = cross(ax, tgt), s1 = len(k1), c1 = dot(ax, tgt);
        if (s1 > 1e-6) q = rotAx(q, k1, Math.atan2(s1, c1));
        q = rotAx(q, [1, 0, 0], spin);
      } else q = rotAx(q, [0, 1, 0], spin);
      return q;
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto && !st.drag) st.spin += dt * 0.35;
      var tot = R.length;
      if (st.play && st.shown < tot){
        var rate = st.kind === "cellulose" ? 4.5 : st.kind === "amylose" ? 3.2 : 6;
        var prev = Math.floor(st.shown); st.shown = Math.min(tot, st.shown + dt * rate);
        var now = Math.floor(st.shown);
        for (var q = prev; q < now; q++){ var r = R[order[q]]; if (r.parent){ st.water.push({res:order[q], t:0, dir:[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}); } st.last = order[q]; }
      }
      st.water = st.water.filter(function(w){ w.t += dt; return w.t < 1.6; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, ps = PS[st.kind], cell = st.kind === "cellulose";
      c.clear(); bgScene(ctx, W, H, "#ffffff", "#e8edf5"); solvent(ctx, W, H, solv, st.t, 0.08);
      var shownN = Math.floor(st.shown), frac = st.shown - shownN;
      var V = {a:st.a, b:st.b, sc:1, cx:0, cy:0, cam:G.rad * 4.2};
      /* cadrage lissé sur la molécule entière */
      var mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      for (var i = 0; i < G.atoms.length; i += 2){ var p0 = proj(orient(G.atoms[i].p, st.spin), V); mnx = Math.min(mnx, p0.x); mxx = Math.max(mxx, p0.x); mny = Math.min(mny, p0.y); mxy = Math.max(mxy, p0.y); }
      var topPad = ph ? 40 : 38, botPad = ph ? 34 : 30, scT = Math.min((W - 40) / Math.max(1, mxx - mnx), (H - topPad - botPad) / Math.max(1, mxy - mny));
      scT = Math.min(scT, ph ? 30 : 34);
      st.sc = st.sc ? st.sc + (scT - st.sc) * 0.12 : scT;
      var cxT = W / 2 - (mnx + mxx) / 2 * st.sc, cyT = topPad + (H - topPad - botPad) / 2 - (mny + mxy) / 2 * st.sc;
      st.cx = st.cx == null ? cxT : st.cx + (cxT - st.cx) * 0.12; st.cy = st.cy == null ? cyT : st.cy + (cyT - st.cy) * 0.12;
      V.sc = st.sc; V.cx = st.cx; V.cy = st.cy;
      /* positions affichées (résidu en vol vers sa place) */
      var shownRes = {}, flyOff = {};
      for (var q = 0; q < R.length; q++){
        var ri = order[q];
        if (q < shownN) shownRes[ri] = 1;
        else if (q === shownN && st.play && frac > 0){ shownRes[ri] = ease(frac); }
      }
      var pr = G.atoms.map(function(a){
        var al = shownRes[a.res]; if (!al) return null;
        var p = a.p;
        if (al < 1){ var rp = R[a.res].pos.C3, out = nrm(sub(rp, G.ctr)); p = add(rotAx(sub(p, rp), [0.3, 1, 0.2], (1 - al) * 2.5), add(rp, mul(out, (1 - al) * G.rad * 0.9))); }
        var o = proj(orient(p, st.spin), V); o.al = al; return o;
      });
      var items = [], sc = V.sc, isNew = function(ri){ return ri === st.last && st.shown < R.length + 0.001; };
      /* cycles : plaques colorées */
      var colA = cell ? "#5fa86a" : "#d9a441", colB = "#e0715f";
      R.forEach(function(r, ri){
        if (!shownRes[ri]) return;
        var pts = G.ring[ri].map(function(j){ return pr[j]; });
        if (pts.some(function(p){ return !p; })) return;
        var zc = pts.reduce(function(s2, p){ return s2 + p.z; }, 0) / 6, al = pts[0].al, op = atS.value === "all" ? 0.55 : 0.8;
        var col = r.chain > 0 && !cell ? colB : colA;
        items.push({z:zc - 0.4, f:function(){
          ctx.save(); ctx.globalAlpha = op * al; var gg = ctx.createLinearGradient(pts[3].x, pts[3].y, pts[0].x, pts[0].y);
          gg.addColorStop(0, shade(col, 0.45)); gg.addColorStop(1, col);
          ctx.fillStyle = gg; ctx.beginPath(); pts.forEach(function(p, u){ if (u === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.fill();
          ctx.globalAlpha = 0.8 * al; ctx.strokeStyle = shade(col, -0.35); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
        }});
      });
      G.bonds.forEach(function(b){
        var p = pr[b.a], q2 = pr[b.b]; if (!p || !q2) return;
        if (atS.value !== "all"){ var kA = G.atoms[b.a], kB = G.atoms[b.b]; if ([kA, kB].some(function(x){ return (x.k === "O2" || x.k === "O3" || (x.k === "O6" && !x.bridge) || (x.k === "O4" && !x.bridge)); })) return; }
        var al = Math.min(p.al, q2.al), A1 = G.atoms[b.a], B1 = G.atoms[b.b], br = A1.bridge || B1.bridge;
        items.push({z:(p.z + q2.z) / 2 - 0.05, f:function(){
          var w = Math.max(1.4, sc * 0.2) * (p.s + q2.s) / 2;
          ctx.save(); ctx.globalAlpha = al; ctx.lineCap = "round"; ctx.strokeStyle = br ? (br === "16" ? "#b0306e" : "#c0392b") : "#7d8a9b"; ctx.lineWidth = br ? w * 1.25 : w;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = w * 0.3; ctx.beginPath(); ctx.moveTo(p.x, p.y - w * 0.2); ctx.lineTo(q2.x, q2.y - w * 0.2); ctx.stroke(); ctx.restore();
        }});
      });
      var allAt = atS.value === "all";
      /* fil qui suit les centres des cycles : montre la forme d'ensemble (hélice, chaîne droite, arbre) */
      var ctrs = R.map(function(r, ri){ var pts = G.ring[ri].map(function(j){ return pr[j]; }); if (pts.some(function(p){ return !p; })) return null; var o = {x:0, y:0, z:0, s:0, al:pts[0].al}; pts.forEach(function(p){ o.x += p.x / 6; o.y += p.y / 6; o.z += p.z / 6; o.s += p.s / 6; }); return o; });
      R.forEach(function(r, ri){
        if (!r.parent) return; var p = ctrs[ri], q2 = ctrs[R.indexOf(r.parent)]; if (!p || !q2) return;
        var colR = r.link === "16" ? "#b0306e" : cell ? "#3f8f4c" : r.chain > 0 ? "#d0604e" : "#c98a1a";
        items.push({z:(p.z + q2.z) / 2 - 0.6, f:function(){ ctx.save(); ctx.globalAlpha = 0.28 * Math.min(p.al, q2.al); ctx.strokeStyle = colR; ctx.lineCap = "round"; ctx.lineWidth = Math.max(4, sc * 1.5 * (p.s + q2.s) / 2); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q2.x, q2.y); ctx.stroke(); ctx.restore(); }});
      });
      G.atoms.forEach(function(a, j){
        var p = pr[j]; if (!p) return;
        if (!allAt && (a.k === "O2" || a.k === "O3" || (a.k === "O6" && !a.bridge) || (a.k === "O4" && !a.bridge) || (a.k === "O1" && !a.bridge && !(!R[a.res].parent)))) return;
        var r = Math.max(2, (a.el === "O" ? 0.36 : 0.34) * sc * p.s * (a.bridge ? 1.35 : 1));
        var col = a.el === "O" ? (a.bridge === "16" ? "#b0306e" : "#d6392f") : "#4a5568";
        items.push({z:p.z, f:function(){
          if (a.bridge && (isNew(a.res) || (a.bridge === "16" && isNew(a.bres)))){ var gg = ctx.createRadialGradient(p.x, p.y, r * 0.4, p.x, p.y, r * 3.2); gg.addColorStop(0, "rgba(255,200,60,.85)"); gg.addColorStop(1, "rgba(255,200,60,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3.2, 0, 7); ctx.fill(); }
          ball(ctx, p.x, p.y, r, col, p.al);
        }});
      });
      /* liaisons H de la cellulose */
      if (cell && hbT.value) G.hb.forEach(function(h){
        var p = pr[h.a], q2 = pr[h.b]; if (!p || !q2) return;
        items.push({z:(p.z + q2.z) / 2 + 0.1, f:function(){ ctx.save(); ctx.globalAlpha = Math.min(p.al, q2.al) * 0.95; ctx.setLineDash([3, 3]); ctx.strokeStyle = h.inter ? "#1f6fd1" : "#16a3a3"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q2.x, q2.y); ctx.stroke(); ctx.restore(); }});
      });
      /* iode : chaîne de I logée dans l'axe des hélices assez longues */
      var iodOn = ioT.value && !cell;
      if (iodOn) AX.forEach(function(x, j){
        if (j % 2 || x.clen < 18) return;
        if (!shownRes[x.res] || shownRes[x.res] < 1) return;
        var p = proj(orient(x.p, st.spin), V), r = Math.max(2.5, 0.8 * sc * p.s);
        items.push({z:p.z + 0.01, f:function(){ ball(ctx, p.x, p.y, r, "#6b3fa0", 0.95); }});
      });
      items.sort(function(x, y){ return x.z - y.z; }); items.forEach(function(it){ it.f(); });
      /* eau libérée à chaque liaison formée */
      st.water.forEach(function(w){
        var r = R[w.res], b = r.link === "16" ? r.parent.pos.O6 : r.pos.O1, u = w.t / 1.6;
        var p = proj(orient(add(b, mul(nrm(add(w.dir, mul(nrm(sub(b, G.ctr)), 1.2))), u * G.rad * 0.7)), st.spin), V);
        var rO = Math.max(3, 0.42 * sc * p.s), al = 1 - u;
        ctx.save(); ctx.globalAlpha = al; ball(ctx, p.x, p.y, rO, "#d6392f"); ball(ctx, p.x - rO * 0.9, p.y + rO * 0.6, rO * 0.62, "#e8edf3"); ball(ctx, p.x + rO * 0.9, p.y + rO * 0.6, rO * 0.62, "#e8edf3"); ctx.restore();
        if (u < 0.7) label(ctx, "H₂O", p.x, p.y - rO - 9, {size:10.5, col:"#2a6fdb", alpha:al});
      });
      /* étiquettes : liaison de la dernière arrivée ou d'un pont central */
      var rects = [];
      var titleTxt = ps.n + (cell ? " : 3 chaînes β(1→4)" : st.kind === "amylose" ? " : α(1→4)" : " : α(1→4) + α(1→6)");
      rects.push(tag(ctx, titleTxt, 8 + textW(ctx, titleTxt, ph ? 11.5 : 13) / 2 + 6, 17, W, H, {size:ph ? 11.5 : 13, col:"#13233a", bg:"rgba(255,255,255,.88)"}));
      function linkTag(ri, txt, col){
        var r = R[ri]; if (!r || !shownRes[ri]) return;
        var key = r.link === "16" ? R.indexOf(r.parent) + ":O6" : ri + ":O1", j = G.atoms.findIndex(function(a){ return a.res === (r.link === "16" ? R.indexOf(r.parent) : ri) && a.k === (r.link === "16" ? "O6" : "O1"); });
        var p = pr[j]; if (!p) return;
        var dx = p.x < W / 2 ? 1 : -1, ty = p.y - 34;
        if (ty < 46) ty = p.y + 34;
        var w = textW(ctx, txt, 11.5) + 12, tx = p.x + dx * 26;
        tx = clamp(tx, w / 2 + 3, W - w / 2 - 3);
        for (var z = 0; z < rects.length; z++){ var R2 = rects[z]; if (Math.abs(tx - (R2.x + R2.w / 2)) < (w + R2.w) / 2 && Math.abs(ty - (R2.y + R2.h / 2)) < 20){ ty = R2.y + R2.h + 14; } }
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(tx, ty); ctx.stroke(); ctx.restore();
        rects.push(tag(ctx, txt, tx, ty, W, H, {size:11.5, col:col, border:col}));
      }
      var linkName = cell ? "β(1→4)" : "α(1→4)";
      if (st.shown < R.length && st.last >= 0 && R[st.last].parent) linkTag(st.last, R[st.last].link === "16" ? "α(1→6) : branchement" : linkName, R[st.last].link === "16" ? "#b0306e" : "#c0392b");
      else {
        var mid = cell ? Math.floor(st.n / 2) : Math.min(R.length - 1, 3);
        if (cell) mid = st.n * 2 + Math.floor(st.n / 2);   /* chaîne du dessus */
        linkTag(Math.min(mid, R.length - 1), linkName, "#c0392b");
        var bri = R.findIndex(function(r){ return r.link === "16"; }); if (bri >= 0) linkTag(bri, "α(1→6)", "#b0306e");
      }
      /* tube d'eau iodée */
      if (ioT.value){
        var tw = ph ? 22 : 26, th = ph ? 64 : 78, tx2 = W - tw - 14, ty2 = ph ? 46 : 40, done = clamp(st.shown / R.length, 0, 1);
        var colT = done > 0.25 ? ps.iodeCol : "#d7a53a";
        ctx.save();
        var gT = ctx.createLinearGradient(tx2, 0, tx2 + tw, 0); gT.addColorStop(0, "rgba(255,255,255,.95)"); gT.addColorStop(0.5, "rgba(230,236,244,.6)"); gT.addColorStop(1, "rgba(200,210,224,.9)");
        rr(ctx, tx2, ty2, tw, th, [2, 2, tw / 2, tw / 2]); ctx.fillStyle = gT; ctx.fill();
        var lq = ctx.createLinearGradient(tx2, 0, tx2 + tw, 0); lq.addColorStop(0, shade(colT, 0.25)); lq.addColorStop(0.5, colT); lq.addColorStop(1, shade(colT, -0.3));
        rr(ctx, tx2 + 2, ty2 + th * 0.35, tw - 4, th * 0.65 - 2, [1, 1, tw / 2 - 2, tw / 2 - 2]); ctx.fillStyle = lq; ctx.fill();
        ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.3; rr(ctx, tx2, ty2, tw, th, [2, 2, tw / 2, tw / 2]); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(tx2 + 4, ty2 + 6, 3, th - 18);
        ctx.restore();
        label(ctx, "I₂/KI", tx2 + tw / 2, ty2 + th + 10, {size:10.5, col:"#5f6b7a", weight:700});
      }
      if (!ph) label(ctx, "glisse pour tourner", W - 10, H - 13, {size:11, align:"right", col:"#8a95a3", weight:600});
      label(ctx, "H non représentés · C gris · O rouge", 10, H - 13, {size:ph ? 10 : 11, align:"left", col:"#8a95a3", weight:600});

      /* ---- panneau du bas : la liaison en Haworth ---- */
      drawLinkPanel(g, st.kind);

      /* ---- valeurs ---- */
      var nb = Math.min(R.length, Math.floor(st.shown + 1e-6));
      var stt = polyStats(st.kind, st.n);
      var linked = cell ? nb : nb;   /* nb glucoses visibles */
      var chainsShown = cell ? Math.ceil(nb / st.n) : 1;
      var linksNow = Math.max(0, nb - chainsShown);
      var brNow = 0; for (var u = 0; u < nb; u++) if (R[order[u]].link === "16") brNow++;
      ro.set(0, cell ? "β(1→4)" : st.kind === "amylose" ? "α(1→4)" : "α(1→4) + α(1→6)");
      ro.set(1, cell ? nb + " (3 chaînes de " + st.n + ")" : nb + " / " + R.length);
      ro.set(2, linksNow + " · " + linksNow + (brNow ? " (dont " + brNow + " α(1→6))" : ""));
      var nM = cell ? st.n : nb, Mnow = nM > 0 ? nM * M_GLC - (nM - 1) * M_H2O : 0;
      ro.set(3, F(Mnow, 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " g/mol" + (cell ? " par chaîne" : ""));
      var forme;
      if (st.kind === "amylose") forme = "hélice : " + F(st.n / 6, 1) + " tours ≈ " + F(st.n / 6 * 0.8, 1) + " nm";
      else if (cell) forme = "droite : ≈ " + F(st.n * 0.528, 1) + " nm";   /* montée du modèle : 5,28 Å par glucose */
      else forme = stt.br + " branche" + (stt.br > 1 ? "s" : "") + " α(1→6) · " + F(100 * stt.br / st.n, 1) + " %";
      ro.set(4, forme);
      ro.set(5, ps.iode);
      var msg = {
        amylose:"α(1→4) : l'O qui part de C1 est axial (vers le bas du cycle). Chaque liaison fait tourner la chaîne d'environ 60° : six glucoses font un tour d'hélice gauche (pas ≈ 0,8 nm), creuse au centre. Les ions polyiodure s'y alignent : c'est la couleur bleu-noir du test à l'eau iodée.",
        amylopectine:"Amylopectine : des chaînes α(1→4) en hélice, reliées par un branchement α(1→6) environ tous les 24 à 30 glucoses (ici une branche toutes les " + PS.amylopectine.Lc + "). L'amidon des plantes, c'est 20 à 30 % d'amylose et 70 à 80 % d'amylopectine.",
        glycogene:"Glycogène : la réserve de glucose du foie et des muscles. Même liaison α(1→4) que l'amidon, mais un branchement α(1→6) tous les 8 à 12 glucoses (ici une branche toutes les " + PS.glycogene.Lc + ") : une boule compacte avec beaucoup d'extrémités non réductrices, où les enzymes détachent le glucose en même temps.",
        cellulose:"β(1→4) : l'O qui part de C1 est équatorial. La chaîne reste droite et chaque glucose est retourné de 180° par rapport au précédent. Liaisons H dans la chaîne (O3–H···O5, en turquoise) et entre chaînes voisines (par exemple O6–H···O3, en bleu) : les chaînes forment des feuillets puis des fibres très solides (bois, coton)."
      }[st.kind];
      if (stt.br) msg += " Ici : " + stt.br + " branchement" + (stt.br > 1 ? "s" : "") + " pour " + st.n + " glucoses, donc " + (stt.br + 1) + " extrémités non réductrices et une seule extrémité réductrice.";
      if (cell) msg += " Ici : 3 chaînes de " + st.n + " glucoses, " + G.hb.filter(function(h){ return h.inter; }).length + " liaisons H entre chaînes et " + G.hb.filter(function(h){ return !h.inter; }).length + " dans les chaînes.";
      nt.set(msg + " <i>Modèle idéalisé : glucoses en chaise ⁴C₁ ; H non représentés ; les grandes molécules réelles comptent des milliers de glucoses.</i>", "ok");
    });
    /* panneau Haworth : liaison du polymère (et α(1→6) pour les formes ramifiées) */
    function drawLinkPanel(g, kind){
      g.clear(); var e = g.ctx, GW = g.W, GH = g.H, ph = GW < 480;
      e.fillStyle = "#fbfcfe"; e.fillRect(0, 0, GW, GH);
      var two = true, cell = kind === "cellulose", branched = kind === "amylopectine" || kind === "glycogene";
      var panels = [{t:cell ? "β(1→4) : cellobiose" : "α(1→4) : maltose", beta:cell, main:true}];
      panels.push(branched ? {t:"α(1→6) : point de branchement", b16:true, main:true} : {t:cell ? "à comparer : α(1→4) de l'amidon" : "à comparer : β(1→4) de la cellulose", beta:!cell, main:false});
      panels.forEach(function(pn, i){
        var x0, y0, w, h;
        if (ph){ x0 = 0; w = GW; h = GH / 2; y0 = i * h; } else { w = GW / 2; h = GH; x0 = i * w; y0 = 0; }
        e.save(); e.globalAlpha = pn.main ? 1 : 0.55;
        if (i === 1){ e.strokeStyle = "#e2e7ee"; e.lineWidth = 1; e.beginPath(); if (ph){ e.moveTo(10, y0); e.lineTo(GW - 10, y0); } else { e.moveTo(x0, 10); e.lineTo(x0, GH - 10); } e.stroke(); }
        label(e, pn.t, x0 + w / 2, y0 + 14, {size:11.5, col:pn.b16 ? "#b0306e" : "#c0392b", weight:800});
        var s = Math.min(w * 0.2, h * 0.36), cy = y0 + h * 0.56;
        if (!pn.b16){
          var xa = x0 + w * 0.27, xb = x0 + w * 0.73;
          var r1 = haworth(e, xa, cy, s, {c1up:pn.beta, c1txt:"", c4txt:"HO", small:true});
          var r2 = haworth(e, xb, cy, s, {c1up:pn.beta, c1txt:"OH", c4txt:"", small:true, c6txt:"CH₂OH"});
          /* pont O : de C1 (cycle 1) vers C4 (cycle 2), toujours en bas à C4 */
          var oy = pn.beta ? cy - s * 0.02 : r1.C1[1] + 2, ox = (r1.C1[0] + r2.C4[0]) / 2;
          e.save(); e.strokeStyle = "#c0392b"; e.lineWidth = 2.4; e.lineJoin = "round"; e.beginPath();
          if (pn.beta){ e.moveTo(r1.C1[0], r1.C1[1]); e.lineTo(ox, oy); e.lineTo(r2.C4[0], r2.C4[1]); }
          else { e.moveTo(r1.C1[0], r1.C1[1]); e.lineTo(ox, oy + 4); e.lineTo(r2.C4[0], r2.C4[1]); }
          e.stroke(); e.restore();
          label(e, "O", ox, (pn.beta ? oy : oy + 4), {size:12, col:"#c0392b", weight:800, bg:"#fff"});
          label(e, "1", r1.P.C1[0] - s * 0.2, r1.P.C1[1], {size:9.5, col:"#8a6d3b", weight:800});
          label(e, "4", r2.P.C4[0] + s * 0.2, r2.P.C4[1], {size:9.5, col:"#8a6d3b", weight:800});
          var cap = pn.beta ? "O de C1 en haut (équatorial)" : "O de C1 en bas (axial)";
          if (h > 120 || !ph) label(e, cap, x0 + w / 2, y0 + h - 10, {size:10.5, col:"#5f6b7a", weight:700});
        } else {
          /* résidu de la branche (en haut à gauche) lié par son C1 à l'O6 d'un résidu de la chaîne (en bas à droite) */
          var s2 = Math.min(w * 0.15, h * 0.25), xb2 = x0 + w * 0.6, yb2 = y0 + h * 0.62;
          var rB = haworth(e, xb2, yb2, s2, {c1up:false, c1txt:"", c4txt:"", small:true, noC6:true});
          var xa2 = xb2 - s2 * 1.95, ya2 = yb2 - s2 * 0.95;
          var rA = haworth(e, xa2, ya2, s2, {c1up:false, c1txt:"", c4txt:"HO", small:true});
          var c6 = rB.C6, ox2 = rA.C1[0] + (c6[0] - rA.C1[0]) * 0.55, oy2 = Math.max(rA.C1[1], c6[1] - 4);
          e.save(); e.strokeStyle = "#b0306e"; e.lineWidth = 2.4; e.beginPath(); e.moveTo(rA.C1[0], rA.C1[1]); e.lineTo(ox2, oy2); e.lineTo(c6[0], c6[1]); e.stroke(); e.restore();
          label(e, "O", ox2, oy2, {size:12, col:"#b0306e", weight:800, bg:"#fff"});
          label(e, "CH₂", c6[0] + 2, c6[1] - 9, {size:10.5, col:"#2c3a4e", weight:700});
          label(e, "6", c6[0] + 20, c6[1] - 2, {size:9.5, col:"#8a6d3b", weight:800});
          label(e, "1", rA.P.C1[0] - s2 * 0.2, rA.P.C1[1], {size:9.5, col:"#8a6d3b", weight:800});
          if (h > 120 || !ph) label(e, "C1 (α) lié à l'O de C6", x0 + w / 2, y0 + h - 10, {size:10.5, col:"#5f6b7a", weight:700});
        }
        e.restore();
      });
    }
  }
});

/* ====================================================================== */
/* 2. Électrophorèse des acides aminés sur papier                         */
/* ====================================================================== */
var AA = [
  {id:"Asp", n:"acide aspartique", ac:[1.88, 3.65], ba:[9.60], col:"#2f6fd6"},
  {id:"Gly", n:"glycine", ac:[2.34], ba:[9.60], col:"#2b9a52"},
  {id:"Lys", n:"lysine", ac:[2.18], ba:[8.95, 10.53], col:"#e0801a"}
];
/* charge nette moyenne (Henderson–Hasselbalch) */
function netQ(a, pH){
  var q = 0;
  a.ba.forEach(function(p){ q += 1 / (1 + Math.pow(10, pH - p)); });
  a.ac.forEach(function(p){ q -= 1 / (1 + Math.pow(10, p - pH)); });
  return q;
}
/* pI : on cherche q = 0 par dichotomie */
function pIof(a){ var lo = 0, hi = 14; for (var i = 0; i < 60; i++){ var m = (lo + hi) / 2; if (netQ(a, m) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
/* pI : moyenne des deux pKa qui encadrent la forme de charge nulle (on vérifie que q(pI) ≈ 0) */
AA[0].pI = (1.88 + 3.65) / 2; AA[1].pI = (2.34 + 9.60) / 2; AA[2].pI = (8.95 + 10.53) / 2;
function F2up(x){ return F(x + 1e-9, 2); }
/* forme majoritaire au pH donné */
function majForm(a, pH){
  var cooh = pH < a.ac[0], nh3 = pH < a.ba[0];
  var C = cooh ? "COOH" : "COO⁻", N = nh3 ? "⁺H₃N" : "H₂N";
  if (a.id === "Gly") return N + "–CH₂–" + C;
  if (a.id === "Asp") return N + "–CH(" + (pH < a.ac[1] ? "CH₂COOH" : "CH₂COO⁻") + ")–" + C;
  return N + "–CH(" + (pH < a.ba[1] ? "(CH₂)₄NH₃⁺" : "(CH₂)₄NH₂") + ")–" + C;
}
var EP = {K:5.5, U0:200, T0:60, HALF:11.6};   /* cm par unité de charge pour 60 min à 200 V ; demi-bande utile */
function epDist(q, U, tmin){ return EP.K * q * (U / EP.U0) * (tmin / EP.T0); }

SFA.sim({
  id:"org-electrophorese-acides-amines", ch:"L13", tag:"Acides aminés",
  titre:"Électrophorèse des acides aminés",
  resume:"Une bande de papier imbibée de tampon relie deux électrodes. On dépose l'acide aspartique, la glycine, la lysine et leur mélange, on règle le pH et on allume : chaque tache file vers l'anode ou la cathode selon sa charge nette, ou reste sur place à son pI.",
  but:"Règle le pH du tampon (ou glisse sur le graphique du bas) puis regarde les taches migrer : vers l'anode (+) si l'acide aminé est chargé négativement, vers la cathode (−) s'il est chargé positivement. Au pI, la charge nette est nulle et la tache ne bouge pas. Glisse sur le montage pour le tourner ; touche une tache pour voir la forme majoritaire.",
  aRetenir:"Un acide aminé porte des groupes acides (COOH) et basiques (NH₂). À un pH donné, chaque groupe est plus ou moins protoné (Henderson–Hasselbalch) : la charge nette q varie de +1 ou +2 en milieu très acide à −1 ou −2 en milieu très basique. Au point isoélectrique pI, q = 0 : pas de migration. Si pH < pI, q > 0 : la molécule va vers la cathode (−) ; si pH > pI, q < 0 : elle va vers l'anode (+). Pour un acide aminé à chaîne latérale neutre, pI = (pKa₁ + pKa₂)/2 ; pour Asp, moyenne des deux pKa acides (pI 2,77) ; pour Lys, moyenne des deux pKa des amines (pI 9,74).",
  piege:"Au pI, l'acide aminé n'est pas « sans charge » : il est surtout sous forme d'amphion (zwitterion) +H₃N–CH(R)–COO⁻, avec une charge + et une charge − (pour Lys, le + est sur la chaîne latérale). C'est la charge nette qui est nulle. Et l'anode est l'électrode positive : ce sont les espèces négatives (anions) qui y vont.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.72}); ratioCanvas(c, 0.72, 0.8);
    var g = k.canvas(190); fixedCanvas(g, 200, 210);
    var st = {a:-0.18, b:0.78, pH:6, U:200, tmin:0, on:true, hold:0, t:0, bub:[], hover:null, ended:false, sc:null};
    var pHS = k.slider("pH du tampon", 1, 13, 0.05, 6, "", function(v){ st.pH = v; restart(); });
    var US = k.slider("Tension du générateur", 100, 300, 10, 200, "V", function(v){ st.U = v; });
    k.button("Allumer / couper le courant", function(){ if (st.ended){ restart(); } else st.on = !st.on; }, true);
    k.button("Nouvelle bande", function(){ restart(); });
    var ninT = k.toggle("Révéler à la ninhydrine (taches violettes)", false);
    var ro = k.readouts(["pH · temps", "Asp (pI " + F2up(AA[0].pI) + ")", "Gly (pI " + F2up(AA[1].pI) + ")", "Lys (pI " + F2up(AA[2].pI) + ")"]);
    var nt = k.note("", "ok");
    function restart(){ st.tmin = 0; st.ended = false; st.on = true; st.bub = []; }
    var LANES = [{z:-4.2, aa:[0], n:"Asp"}, {z:-1.4, aa:[1], n:"Gly"}, {z:1.4, aa:[2], n:"Lys"}, {z:4.2, aa:[0, 1, 2], n:"mélange"}];
    var spots = [];
    function spotList(){
      var out = [];
      LANES.forEach(function(L, li){ L.aa.forEach(function(ai){
        var q = netQ(AA[ai], st.pH), d = epDist(q, st.U, st.tmin), off = Math.abs(d) > EP.HALF;
        out.push({lane:li, ai:ai, q:q, d:d, x:clamp(d, -EP.HALF - 0.6, EP.HALF + 0.6), z:L.z, off:off, r:0.62 + 0.35 * Math.sqrt(st.tmin / 60)});
      }); });
      return out;
    }
    /* souris : glisser = tourner ; toucher une tache = forme majoritaire */
    st.hit = function(type, p){
      if (type === "down" || type === "move"){
        var best = null, bd = 18;
        spots.forEach(function(s){ if (s.px == null) return; var d = Math.hypot(p.x - s.px, p.y - s.py); if (d < bd){ bd = d; best = s; } });
        st.hover = best ? {lane:best.lane, ai:best.ai} : (type === "down" ? null : st.hover && type === "move" && !st.drag ? null : st.hover);
      }
      return false;
    };
    viewDrag(c, st, [0.45, 1.35, -0.6, 0.6]);
    g.pointer(function(type, p){
      if (type === "down" || type === "drag"){ var ax = g.ax; if (!ax) return; var v = clamp(Math.round(ax.iX(p.x) * 20) / 20, 1, 13); st.pH = v; pHS.set(v); restart(); k.redraw(); }
    });
    var bubSeed = seeded(200, 5), bi = 0;
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.on && !st.ended){
        st.tmin = Math.min(60, st.tmin + dt * 4.5);
        if (st.tmin >= 60){ st.ended = true; st.on = false; st.hold = 6; }
        /* bulles : H₂ à la cathode (deux fois plus) et O₂ à l'anode */
        var rate = 14 * st.U / 200;
        for (var q = 0; q < 3; q++) if (Math.random() < dt * rate){
          var r = bubSeed[bi++ % 200], cath = Math.random() < 2 / 3;
          st.bub.push({x:(cath ? 17 : -17) + (r.v - 0.5) * 0.6, y:1.2, z:(r.x - 0.5) * 11, vy:2 + r.y * 1.5, r:0.12 + r.r * 0.02, cath:cath});
        }
      }
      if (st.ended && st.auto !== false){ st.hold -= dt; if (st.hold <= 0) restart(); }
      st.bub = st.bub.filter(function(b){ b.y += b.vy * dt; b.x += Math.sin(st.t * 3 + b.z) * 0.02; return b.y < 4.1; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      c.clear();
      /* mur du labo */
      var wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, "#eef2f7"); wall.addColorStop(1, "#dfe5ee"); ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      var V = {a:st.a, b:st.b, sc:1, cx:0, cy:0, cam:140};
      /* cadrage : boîte englobante du montage */
      var bb = [[-21, 0, -18], [21, 0, -18], [-21, 0, 8], [21, 0, 8], [-21, 9, -18], [21, 9, -18], [-21, 7.5, 8], [21, 7.5, 8]], mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      bb.forEach(function(p){ var o = proj(p, V); mnx = Math.min(mnx, o.x); mxx = Math.max(mxx, o.x); mny = Math.min(mny, o.y); mxy = Math.max(mxy, o.y); });
      var top = ph ? 34 : 34, scT = Math.min((W - 16) / (mxx - mnx), (H - top - 10) / (mxy - mny));
      st.sc = st.sc ? st.sc + (scT - st.sc) * 0.2 : scT;
      V.sc = st.sc; V.cx = W / 2 - (mnx + mxx) / 2 * st.sc; V.cy = top + (H - top - 10) / 2 - (mny + mxy) / 2 * st.sc;
      function P(x, y, z){ return proj([x, y, z], V); }
      function poly(pts, fill, stroke, alpha, lw){
        ctx.save(); if (alpha != null) ctx.globalAlpha = alpha; ctx.beginPath();
        pts.forEach(function(p, i){ var o = p.x != null ? p : P(p[0], p[1], p[2]); if (i === 0) ctx.moveTo(o.x, o.y); else ctx.lineTo(o.x, o.y); });
        ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } ctx.restore();
      }
      var LIGHT = nrm([-0.4, 0.85, 0.5]);
      function faceCol(base, n){ var l = clamp(dot(n, LIGHT), -1, 1); return shade(base, l > 0 ? 0.25 * l : 0.35 * l); }
      function facing(n){ var r = rot3(n, V.a, V.b); return r[2] > 0; }
      /* boîte : faces visibles (opaque) ou toutes (translucide, arrière puis avant) */
      function boxFaces(x0, x1, y0, y1, z0, z1){
        return [
          {n:[0, 1, 0], p:[[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]},
          {n:[0, -1, 0], p:[[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]},
          {n:[0, 0, 1], p:[[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]},
          {n:[0, 0, -1], p:[[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]},
          {n:[1, 0, 0], p:[[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]},
          {n:[-1, 0, 0], p:[[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]]}
        ];
      }
      function solid(x0, x1, y0, y1, z0, z1, col, edge){
        boxFaces(x0, x1, y0, y1, z0, z1).forEach(function(f){ if (facing(f.n)) poly(f.p, faceCol(col, f.n), edge || shade(col, -0.3), 1, 0.8); });
      }
      /* paillasse */
      var bench = [[-30, 0, -24], [30, 0, -24], [30, 0, 14], [-30, 0, 14]].map(function(p){ return P(p[0], p[1], p[2]); });
      var bg2 = ctx.createLinearGradient(0, bench[0].y, 0, bench[2].y); bg2.addColorStop(0, "#c9b28c"); bg2.addColorStop(1, "#a88b60");
      poly(bench, bg2, "#8d744f", 1, 1);
      ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = "#6f5634"; ctx.lineWidth = 1;
      for (var zz = -22; zz < 14; zz += 4){ var a1 = P(-30, 0, zz), b1 = P(30, 0, zz + 1.2); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); }
      ctx.restore();
      /* ombres */
      poly([[-19.5, 0.01, -7.5], [20.5, 0.01, -7.5], [21, 0.01, 8], [-19, 0.01, 8]], "rgba(40,30,15,.22)");
      poly([[-6.5, 0.01, -19], [7.5, 0.01, -19], [8, 0.01, -11.5], [-6, 0.01, -11.5]], "rgba(40,30,15,.22)");
      /* générateur (derrière la cuve) */
      solid(-6, 6, 0, 8, -18, -12, "#3c4656");
      var d0 = P(-4.5, 6.8, -11.99), d1 = P(1.5, 6.8, -11.99), d2 = P(1.5, 4.4, -11.99), d3 = P(-4.5, 4.4, -11.99);
      if (facing([0, 0, 1])){
        poly([d0, d1, d2, d3], st.on ? "#1d3b2a" : "#1b2129", "#11161c", 1, 1.2);
        var dc = P(-1.5, 5.6, -11.99), fsz = clamp(st.sc * 1.5 * dc.s, 9, 16);
        label(ctx, st.on ? F(st.U, 0) + " V" : "0 V", dc.x, dc.y, {size:fsz, col:st.on ? "#7dff9c" : "#4b5a52", weight:800});
        var led = P(4, 5.6, -11.99); ball(ctx, led.x, led.y, Math.max(2.5, st.sc * 0.45 * led.s), st.on ? "#ff4a3d" : "#5a2b28");
        var tp = P(-3.6, 2.2, -11.99), tm = P(3.6, 2.2, -11.99);
        ball(ctx, tp.x, tp.y, Math.max(3, st.sc * 0.55 * tp.s), "#d63a2f"); ball(ctx, tm.x, tm.y, Math.max(3, st.sc * 0.55 * tm.s), "#2a2f36");
      }
      /* cuve : parois arrière translucides */
      var T = {x0:-19, x1:19, y0:0, y1:7, z0:-7, z1:7};
      var tank = boxFaces(T.x0, T.x1, T.y0, T.y1, T.z0, T.z1).filter(function(f){ return f.n[1] === 0; });
      tank.forEach(function(f){ if (!facing(f.n)) poly(f.p, "rgba(190,215,235,.35)", "rgba(110,140,170,.7)", 1, 1); });
      poly([[T.x0, 0.02, T.z0], [T.x1, 0.02, T.z0], [T.x1, 0.02, T.z1], [T.x0, 0.02, T.z1]], "rgba(170,200,225,.55)");
      /* tampon dans les deux bacs */
      [[-18.6, -12.4], [12.4, 18.6]].forEach(function(xr){
        boxFaces(xr[0], xr[1], 0.05, 4.2, -6.6, 6.6).forEach(function(f){ if (facing(f.n)) poly(f.p, f.n[1] > 0 ? "rgba(120,170,220,.55)" : "rgba(90,140,200,.35)", null); });
      });
      /* électrodes (fils de platine) */
      function wire(x, col){
        var a1 = P(x, 1.2, -6.3), b1 = P(x, 1.2, 6.3);
        ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#7d8590"; ctx.lineWidth = Math.max(2.5, st.sc * 0.35); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a1.x, a1.y - 1); ctx.lineTo(b1.x, b1.y - 1); ctx.stroke();
        var up = P(x, 7.6, -6.3); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5, st.sc * 0.3); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(up.x, up.y); ctx.stroke(); ctx.restore();
        return up;
      }
      var anU = wire(-17, "#d63a2f"), caU = wire(17, "#2a2f36");
      /* bulles */
      st.bub.forEach(function(b){ var o = P(b.x, b.y, b.z); ctx.save(); ctx.globalAlpha = 0.85; ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.fillStyle = "rgba(230,245,255,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(o.x, o.y, Math.max(1.3, b.r * st.sc * o.s * (b.cath ? 1 : 1.15)), 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); });
      /* support central */
      solid(-12, 12, 0, 5.5, -6.4, 6.4, "#e9edf2", "#aab4c0");
      /* bande de papier (avec ses deux rabats plongés dans le tampon) */
      var yS = 5.56, zS0 = -5.6, zS1 = 5.6;
      var wet = ctx.createLinearGradient(P(-14, yS, 0).x, 0, P(14, yS, 0).x, 0);
      wet.addColorStop(0, "#e2e9ef"); wet.addColorStop(0.15, "#f7f7f2"); wet.addColorStop(0.85, "#f7f7f2"); wet.addColorStop(1, "#e2e9ef");
      poly([[-14.6, 2.6, zS0], [-12, yS, zS0], [-12, yS, zS1], [-14.6, 2.6, zS1]], "#d9e2ea", "#b9c3cc", 1, 1);
      poly([[14.6, 2.6, zS0], [12, yS, zS0], [12, yS, zS1], [14.6, 2.6, zS1]], "#d9e2ea", "#b9c3cc", 1, 1);
      poly([[-12, yS, zS0], [12, yS, zS0], [12, yS, zS1], [-12, yS, zS1]], wet, "#b9c3cc", 1, 1);
      /* ligne de dépôt au crayon */
      var l0 = P(0, yS, zS0 + 0.3), l1 = P(0, yS, zS1 - 0.3);
      ctx.save(); ctx.strokeStyle = "rgba(70,70,80,.55)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(l0.x, l0.y); ctx.lineTo(l1.x, l1.y); ctx.stroke(); ctx.restore();
      /* noms des pistes (au crayon, à gauche) */
      var lfs = ph ? 9.5 : 10.5;
      LANES.forEach(function(L){ var o = P(-11.4, yS, L.z); label(ctx, L.n, o.x, o.y, {size:lfs, align:"left", col:"#3a4250", weight:700, bg:"rgba(255,255,255,.72)"}); });
      /* taches */
      spots = spotList();
      var nin = ninT.value;
      spots.forEach(function(s){
        if (s.off) return;
        var cP = P(s.x, yS + 0.01, s.z), ex = P(s.x + s.r, yS, s.z), ez = P(s.x, yS, s.z + s.r * 0.95);
        var ux = ex.x - cP.x, uy = ex.y - cP.y, vx = ez.x - cP.x, vy = ez.y - cP.y;
        s.px = cP.x; s.py = cP.y;
        var col = nin ? "#7a3d9e" : AA[s.ai].col;
        ctx.save(); ctx.transform(ux, uy, vx, vy, cP.x, cP.y);
        var gr = ctx.createRadialGradient(0, 0, 0.05, 0, 0, 1); gr.addColorStop(0, rgba(col, 0.95)); gr.addColorStop(0.6, rgba(col, 0.75)); gr.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, 1.25, 0, 7); ctx.fill(); ctx.restore();
        if (st.hover && st.hover.lane === s.lane && st.hover.ai === s.ai){ ctx.save(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cP.x, cP.y, Math.hypot(ux, uy) * 1.5, Math.max(3, Math.hypot(vx, vy) * 1.5), Math.atan2(uy, ux), 0, 7); ctx.stroke(); ctx.restore(); }
      });
      /* cuve : parois avant translucides */
      tank.forEach(function(f){ if (facing(f.n)) poly(f.p, "rgba(200,225,245,.16)", "rgba(110,140,170,.75)", 1, 1.2); });
      /* câbles vers le générateur */
      function cable(a1, tx, col){
        var b1 = P(tx, 2.2, -11.9), m1 = P(a1x(tx), 9.5, -9.5);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5, st.sc * 0.32); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.quadraticCurveTo(m1.x, m1.y, b1.x, b1.y); ctx.stroke(); ctx.restore();
      }
      function a1x(tx){ return tx < 0 ? -12 : 12; }
      cable(anU, -3.6, "#d63a2f"); cable(caU, 3.6, "#2a2f36");
      /* étiquettes des électrodes */
      var aL = P(-17, 7.6, 2), cL = P(17, 7.6, 2), efs = ph ? 10.5 : 12;
      var rA = tag(ctx, "anode (+)", aL.x, aL.y - 12, W, H, {size:efs, col:"#c0392b", border:"#c0392b"});
      var rC = tag(ctx, "cathode (−)", cL.x, cL.y - 12, W, H, {size:efs, col:"#2a2f36", border:"#2a2f36"});
      /* titre et temps */
      var tt = "Tampon pH " + F(st.pH, 2) + " · " + F(st.tmin, 0) + " min" + (st.ended ? " · fin" : st.on ? "" : " · courant coupé");
      label(ctx, tt, 10, 16, {size:ph ? 11.5 : 13, align:"left", col:"#13233a", bg:"rgba(255,255,255,.88)"});
      /* bulle d'info sur la tache touchée */
      if (st.hover){
        var hs = spots.filter(function(s){ return s.lane === st.hover.lane && s.ai === st.hover.ai; })[0];
        if (hs && hs.px != null && !hs.off){
          var a = AA[hs.ai], t1 = a.id + " : " + majForm(a, st.pH), t2 = "charge nette " + Fs(hs.q, 2), fs2 = ph ? 10.5 : 11.5;
          var w = Math.max(textW(ctx, t1, fs2), textW(ctx, t2, fs2)) + 16, h = fs2 * 2 + 16;
          var bx = clamp(hs.px - w / 2, 4, W - w - 4), by = hs.py - h - 14; if (by < 30) by = hs.py + 14;
          ctx.save(); ctx.fillStyle = "rgba(255,255,255,.96)"; ctx.strokeStyle = a.col; ctx.lineWidth = 1.4; rr(ctx, bx, by, w, h, 8); ctx.fill(); ctx.stroke(); ctx.restore();
          label(ctx, t1, bx + 8, by + 8 + fs2 / 2, {size:fs2, align:"left", col:"#13233a"});
          label(ctx, t2, bx + 8, by + 14 + fs2 * 1.5, {size:fs2, align:"left", col:a.col});
        }
      } else if (!ph) label(ctx, "glisse pour tourner · touche une tache", W - 10, H - 12, {size:11, align:"right", col:"#5f6b7a", weight:600, bg:"rgba(255,255,255,.7)"});

      /* ---- graphique : charge nette en fonction du pH ---- */
      g.clear(); var e = g.ctx, GW = g.W, GH = g.H;
      e.fillStyle = "#fbfcfe"; e.fillRect(0, 0, GW, GH);
      var ax = {L:40, R:GW - 12, T:36, B:GH - 26};
      ax.X = function(x){ return ax.L + x / 14 * (ax.R - ax.L); }; ax.Y = function(y){ return ax.T + (2.2 - y) / 4.4 * (ax.B - ax.T); };
      ax.iX = function(px){ return (px - ax.L) / (ax.R - ax.L) * 14; }; g.ax = ax;
      e.save();
      e.fillStyle = "rgba(42,47,54,.05)"; e.fillRect(ax.L, ax.T, ax.R - ax.L, ax.Y(0) - ax.T);
      e.fillStyle = "rgba(214,58,47,.05)"; e.fillRect(ax.L, ax.Y(0), ax.R - ax.L, ax.B - ax.Y(0));
      e.strokeStyle = "#e6eaf0"; e.lineWidth = 1;
      for (var x = 0; x <= 14; x += 2){ e.beginPath(); e.moveTo(ax.X(x), ax.T); e.lineTo(ax.X(x), ax.B); e.stroke(); }
      [-2, -1, 1, 2].forEach(function(y){ e.beginPath(); e.moveTo(ax.L, ax.Y(y)); e.lineTo(ax.R, ax.Y(y)); e.stroke(); });
      e.strokeStyle = "#8a95a3"; e.lineWidth = 1.3; e.beginPath(); e.moveTo(ax.L, ax.Y(0)); e.lineTo(ax.R, ax.Y(0)); e.moveTo(ax.L, ax.T); e.lineTo(ax.L, ax.B); e.stroke();
      e.font = "600 10.5px " + FONT; e.fillStyle = "#5f6b7a"; e.textAlign = "center"; e.textBaseline = "top";
      for (x = 0; x <= 14; x += 2) e.fillText(String(x), ax.X(x), ax.B + 4);
      e.textAlign = "right"; e.textBaseline = "middle";
      [-2, -1, 0, 1, 2].forEach(function(y){ e.fillText((y > 0 ? "+" : "") + String(y).replace("-", "−"), ax.L - 5, ax.Y(y)); });
      e.restore();
      label(e, "charge nette q", 6, 11, {size:11, align:"left", col:"#2c3a4e"});
      label(e, "pH", ax.R, ax.B + 17, {size:10.5, align:"right", col:"#5f6b7a", weight:700});
      if (GW >= 480){
        label(e, "q > 0 → cathode (−)", ax.R - 4, ax.Y(0) - 10, {size:10, align:"right", col:"#2a2f36", weight:700});
        label(e, "q < 0 → anode (+)", ax.R - 4, ax.Y(0) + 11, {size:10, align:"right", col:"#c0392b", weight:700});
      }
      AA.forEach(function(a){
        e.save(); e.strokeStyle = a.col; e.lineWidth = 2.4; e.beginPath();
        for (var j = 0; j <= 280; j++){ var x2 = j / 20, y2 = netQ(a, x2); if (j === 0) e.moveTo(ax.X(x2), ax.Y(y2)); else e.lineTo(ax.X(x2), ax.Y(y2)); }
        e.stroke(); e.restore();
      });
      /* pH courant */
      var xp = ax.X(st.pH);
      e.save(); e.strokeStyle = "#13233a"; e.lineWidth = 1.5; e.setLineDash([5, 4]); e.beginPath(); e.moveTo(xp, ax.T - 4); e.lineTo(xp, ax.B); e.stroke(); e.restore();
      /* pI sur l'axe */
      AA.forEach(function(a, i){
        var px = ax.X(a.pI);
        e.save(); e.strokeStyle = rgba(a.col, 0.6); e.setLineDash([2, 3]); e.lineWidth = 1.2; e.beginPath(); e.moveTo(px, ax.T + 17); e.lineTo(px, ax.Y(0)); e.stroke(); e.restore();
        e.save(); e.fillStyle = "#fff"; e.strokeStyle = a.col; e.lineWidth = 2; e.beginPath(); e.arc(px, ax.Y(0), 4, 0, 7); e.fill(); e.stroke(); e.restore();
        label(e, (GW < 420 ? "" : "pI ") + F2up(a.pI), px, ax.T + 9, {size:10, col:a.col, weight:800, bg:"rgba(255,255,255,.9)"});
      });
      AA.forEach(function(a){ var q = netQ(a, st.pH); ball(e, xp, ax.Y(q), 5.5, a.col); });
      var lw2 = textW(e, "pH " + F(st.pH, 2), 10.5) + 12;
      label(e, "pH " + F(st.pH, 2), clamp(xp, lw2 / 2 + 2, ax.R - lw2 / 2 - 2), ax.T - 9, {size:10.5, col:"#fff", bg:"#13233a", weight:800});
      /* légende */
      AA.forEach(function(a, i){ label(e, a.id, ax.R - (2 - i) * 38, 11, {size:10.5, align:"right", col:a.col, weight:800}); });

      /* ---- valeurs ---- */
      ro.set(0, F(st.pH, 2) + " · " + F(st.tmin, 0) + " min à " + F(st.U, 0) + " V");
      AA.forEach(function(a, i){
        var q = netQ(a, st.pH), d = epDist(q, st.U, st.tmin), dir = Math.abs(q) < 0.02 ? "reste au dépôt" : q < 0 ? "vers + " + F(Math.abs(d), 1) + " cm" : "vers − " + F(Math.abs(d), 1) + " cm";
        if (Math.abs(d) > EP.HALF) dir = (q < 0 ? "vers + : " : "vers − : ") + "sortie de la bande";
        ro.set(i + 1, "q = " + Fs(q, 2) + " · " + dir);
      });
      var ords = AA.map(function(a){ return st.pH < a.pI - 0.05 ? a.id + " (pH < pI) est chargé + et va vers la cathode" : st.pH > a.pI + 0.05 ? a.id + " (pH > pI) est chargé − et va vers l'anode" : a.id + " est à son pI : il ne bouge pas"; });
      nt.set("À pH " + F(st.pH, 2) + " : " + ords.join(" ; ") + ". Distance parcourue = " + F(EP.K, 1).replace(",0", "") + " cm × q × (U / 200 V) × (t / 60 min). Bulles : H₂ à la cathode (2 H₂O + 2 e⁻ → H₂ + 2 HO⁻), O₂ à l'anode, deux fois moins. <i>Modèle simplifié : la vitesse est prise proportionnelle à la charge nette ; on néglige la taille des molécules et l'électro-osmose.</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 3. Plan amide, angles φ et ψ, carte de Ramachandran                    */
/* ====================================================================== */
var PEP = {NCA:1.458, CAC:1.525, CN:1.329, CO:1.231, NH:1.0, CAH:1.0, CACB:1.53, TAU:110.0, CNCA:121.7, CACN:116.2};
/* fragment Cα(i−1)–C'(=O)–N(H)–Cα(i)(Hα, Cβ)–C'(=O)–N(H)–Cα(i+1) ; ω = 180° (trans) */
function pepBuild(phi, psi, gly){
  var A = {}, n = PEP;
  A.N1 = [0, 0, 0]; A.CA1 = [n.NCA, 0, 0];
  A.C1 = nerf([0, 1, 0], A.N1, A.CA1, n.CAC, n.TAU, -60);
  A.C0 = nerf(A.C1, A.CA1, A.N1, n.CN, n.CNCA, phi);
  A.CA0 = nerf(A.CA1, A.N1, A.C0, n.CAC, n.CACN, 180);
  A.O0 = nerf(A.CA1, A.N1, A.C0, n.CO, 123.0, 0);
  A.H1 = nerf(A.O0, A.C0, A.N1, n.NH, 119.5, 180);
  A.N2 = nerf(A.N1, A.CA1, A.C1, n.CN, n.CACN, psi);
  A.O1 = nerf(A.N1, A.CA1, A.C1, n.CO, 120.5, psi + 180);
  A.CA2 = nerf(A.CA1, A.C1, A.N2, n.NCA, n.CNCA, 180);
  A.H2 = nerf(A.O1, A.C1, A.N2, n.NH, 119.5, 180);
  var cb = nerf(A.C0, A.N1, A.CA1, n.CACB, 110.5, phi - 122);
  function u(k){ return nrm(sub(A[k], A.CA1)); }
  if (gly) A.HB = add(A.CA1, mul(nrm(sub(cb, A.CA1)), n.CAH)); else A.CB1 = cb;
  A.HA1 = add(A.CA1, mul(nrm(mul(add(add(u("N1"), u("C1")), nrm(sub(cb, A.CA1))), -1)), n.CAH));
  return A;
}
var PEP_B = [["CA0", "C0"], ["C0", "O0"], ["C0", "N1"], ["N1", "H1"], ["N1", "CA1"], ["CA1", "HA1"], ["CA1", "CB1"], ["CA1", "HB"], ["CA1", "C1"], ["C1", "O1"], ["C1", "N2"], ["N2", "H2"], ["N2", "CA2"]];
var PEP_EL = {CA0:"C", C0:"C", O0:"O", N1:"N", H1:"H", CA1:"C", HA1:"H", CB1:"B", HB:"H", C1:"C", O1:"O", N2:"N", H2:"H", CA2:"C"};
/* limites de contact (Å) : [normale, extrême] ; B = Cβ (CH₃) */
var PEP_LIM = (function(){
  var L = {};
  function s(a, b, n, o){ L[a + b] = L[b + a] = [n, o]; }
  s("H", "H", 2.0, 1.9); s("H", "O", 2.3, 2.2); s("H", "N", 2.4, 2.2); s("H", "C", 2.4, 2.2); s("H", "B", 2.4, 2.2);
  s("O", "O", 2.7, 2.6); s("O", "N", 2.7, 2.6); s("O", "C", 2.8, 2.7); s("N", "N", 2.7, 2.6); s("N", "C", 2.9, 2.8); s("C", "C", 3.0, 2.9);
  s("B", "C", 3.2, 3.0); s("B", "O", 2.8, 2.7); s("B", "N", 2.9, 2.8);
  return L;
})();
/* paires dont la distance dépend de φ ou de ψ (séparées par au moins 3 liaisons ; sauf 1–4 entre atomes du squelette) */
var PEP_PAIRS = (function(){
  var out = {};
  [false, true].forEach(function(gly){
    var keys = Object.keys(pepBuild(-60, -45, gly)), adj = {};
    keys.forEach(function(k){ adj[k] = []; });
    PEP_B.forEach(function(b){ if (adj[b[0]] && adj[b[1]]){ adj[b[0]].push(b[1]); adj[b[1]].push(b[0]); } });
    function bfs(s){ var d = {}; d[s] = 0; var fr = [s]; while (fr.length){ var nf = []; fr.forEach(function(u){ adj[u].forEach(function(v){ if (d[v] == null){ d[v] = d[u] + 1; nf.push(v); } }); }); fr = nf; } return d; }
    var PHL = ["CA0", "C0", "O0", "H1"], PHR = ["HA1", "CB1", "HB", "C1", "O1", "N2", "H2", "CA2"];
    var PSL = ["N1", "H1", "CA0", "C0", "O0", "HA1", "CB1", "HB"], PSR = ["O1", "N2", "H2", "CA2"];
    var BB = ["CA0", "C0", "O0", "N1", "CA1", "C1", "O1", "N2", "CA2"];
    function inn(a, L){ return L.indexOf(a) >= 0; }
    var list = [];
    keys.forEach(function(a, i){ var d = bfs(a); keys.slice(i + 1).forEach(function(b){
      var dep = (inn(a, PHL) && inn(b, PHR)) || (inn(b, PHL) && inn(a, PHR)) || (inn(a, PSL) && inn(b, PSR)) || (inn(b, PSL) && inn(a, PSR));
      if (!dep || d[b] < 3) return;
      if (d[b] === 3 && inn(a, BB) && inn(b, BB)) return;
      list.push([a, b, PEP_LIM[PEP_EL[a] + PEP_EL[b]]]);
    }); });
    out[gly ? "gly" : "ala"] = list;
  });
  return out;
})();
/* 0 permis, 1 limite (contacts serrés), 2 interdit ; liste des contacts trop courts */
function pepClash(A, gly){
  var worst = 0, bad = [];
  PEP_PAIRS[gly ? "gly" : "ala"].forEach(function(p){
    var d = dist(A[p[0]], A[p[1]]), lim = p[2];
    if (d < lim[1]){ worst = 2; bad.push({a:p[0], b:p[1], d:d, lim:lim, lvl:2}); }
    else if (d < lim[0]){ worst = Math.max(worst, 1); bad.push({a:p[0], b:p[1], d:d, lim:lim, lvl:1}); }
  });
  bad.sort(function(x, y){ return (y.lvl - x.lvl) || ((x.d - x.lim[1]) - (y.d - y.lim[1])); });
  return {lvl:worst, bad:bad};
}
/* chaîne de n résidus avec les mêmes φ, ψ (et ω = 180°) */
function pepChain(phi, psi, n, gly){
  var P = PEP, R = [], N = [0, 0, 0], CA = [P.NCA, 0, 0], C = nerf([0, 1, 0], N, CA, P.CAC, P.TAU, -60), prevC = null;
  for (var i = 0; i < n; i++){
    var r = {N:N, CA:CA, C:C};
    r.O = nerf(N, CA, C, P.CO, 120.5, psi + 180);
    if (prevC) r.H = nerf(R[i - 1].O, prevC, N, P.NH, 119.5, 180);
    if (!gly && prevC) r.CB = nerf(prevC, N, CA, P.CACB, 110.5, phi - 122);
    R.push(r);
    var N2 = nerf(N, CA, C, P.CN, P.CACN, psi), CA2 = nerf(CA, C, N2, P.NCA, P.CNCA, 180), C2 = nerf(C, N2, CA2, P.CAC, P.TAU, phi);
    prevC = C; N = N2; CA = CA2; C = C2;
  }
  return R;
}
/* paramètres de l'hélice (résidus par tour, montée par résidu, sens) */
function pepHelix(phi, psi){
  var R = pepChain(phi, psi, 4, true), a = R[1], b = R[2];
  var M = poseFrom(a.N, a.CA, a.C, b.N, b.CA, b.C), Rm = M.R;
  var tr = clamp((Rm[0][0] + Rm[1][1] + Rm[2][2] - 1) / 2, -1, 1), th = Math.acos(tr);
  var w = [Rm[2][1] - Rm[1][2], Rm[0][2] - Rm[2][0], Rm[1][0] - Rm[0][1]], ax = len(w) > 1e-9 ? nrm(w) : [1, 0, 0];
  var rise = dot(M.t, ax);
  return {n:th > 1e-6 ? 2 * PI / th : Infinity, rise:Math.abs(rise), right:rise > 0, th:th / DEG};
}
var RAMA_REF = [
  {n:"hélice α", phi:-57, psi:-47, col:"#c0392b"},
  {n:"feuillet β", phi:-120, psi:125, col:"#1d6fd1"},
  {n:"hélice αL", phi:57, psi:47, col:"#7a3d9e"}
];
function ramaZone(phi, psi, lvl){
  if (lvl === 2) return "zone interdite";
  var nm;
  if (Math.abs(phi + 60) <= 40 && Math.abs(psi + 45) <= 35) nm = "hélice α droite";
  else if (phi <= -45 && (psi >= 90 || psi <= -150)) nm = phi > -90 && psi > 110 && psi < 170 ? "étirée (polyproline II)" : "feuillet β (chaîne étirée)";
  else if (phi >= 30 && phi <= 100 && psi >= -10 && psi <= 100) nm = "hélice gauche αL";
  else nm = "autre zone";
  return nm + (lvl === 1 ? " · limite" : " · permise");
}

SFA.sim({
  id:"org-plan-amide-ramachandran", ch:"c10", tag:"Peptides",
  titre:"Plan amide et angles φ, ψ",
  resume:"Un fragment de tripeptide en 3D : les deux plans amides sont des plaques rigides. Tourne φ et ψ autour du carbone α ; les atomes qui se heurtent rougissent et le point se déplace sur la carte de Ramachandran, vers la zone de l'hélice α ou du feuillet β.",
  but:"Glisse une plaque bleue pour changer φ (rotation autour de N–Cα), une plaque verte pour ψ (autour de Cα–C) ; glisse ailleurs pour tourner la vue. Tu peux aussi déplacer le point sur la carte de Ramachandran. Rouge : deux atomes beaucoup trop proches (conformation interdite) ; orange : contact serré. La vue « chaîne » répète tes angles sur 12 résidus.",
  aRetenir:"La liaison peptidique C–N a un caractère partiel de double liaison (mésomérie avec C=O) : elle est courte (1,33 Å contre 1,47 Å pour une simple), ne tourne pas, et les six atomes Cα–C(=O)–N(H)–Cα sont dans un même plan, presque toujours en trans (ω = 180°). Les seules rotations libres du squelette sont φ (autour de N–Cα) et ψ (autour de Cα–C). Les gênes stériques interdisent la plupart des couples (φ, ψ) : la carte de Ramachandran garde surtout la région de l'hélice α (φ ≈ −57°, ψ ≈ −47° : 3,6 résidus par tour, 1,5 Å par résidu, liaisons H de i vers i + 4) et celle du feuillet β (φ ≈ −120°, ψ ≈ +120° : chaîne étirée, 3,3 à 3,5 Å par résidu).",
  piege:"φ et ψ appartiennent au même carbone α : φ est l'angle N–Cα, ψ l'angle Cα–C. ω n'est pas un troisième angle libre : il vaut 180° (trans) à cause du plan amide. Et la glycine, sans chaîne latérale (deux H sur Cα), échappe à la plupart des gênes : sa carte est beaucoup plus étendue et symétrique.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.74}); ratioCanvas(c, 0.74, 0.95);
    var g = k.canvas(300); fixedCanvas(g, 300, 372);
    var st = {a:0.8, b:1.15, phi:-57, psi:-47, gly:false, chain:false, tour:true, tt:0, leg:0, t:0, grab:null, trail:[], sc:null, cx:null, cy:null};
    var TOUR = [[-57, -47, 2.6], [-120, 125, 2.6], [-75, 145, 1.6], [57, 47, 2.4], [0, 0, 1.6], [-57, -47, 0.1]];
    var resS = k.seg("Résidu central", [["ala", "alanine (Cβ)"], ["gly", "glycine (H)"]], "ala", function(v){ st.gly = v === "gly"; mapImg = null; });
    var vueS = k.seg("Vue", [["tri", "tripeptide"], ["ch", "chaîne de 12 résidus"]], "tri", function(v){ st.chain = v === "ch"; st.sc = null; });
    var phS = k.slider("φ (N–Cα)", -180, 180, 1, -57, "°", function(v){ st.phi = v; stopTour(); });
    var psS = k.slider("ψ (Cα–C)", -180, 180, 1, -47, "°", function(v){ st.psi = v; stopTour(); });
    var tourB = k.button("Visite guidée", function(){ st.tour = !st.tour; st.tt = 0; st.leg = 0; }, true);
    k.button("Hélice α", function(){ go(-57, -47); });
    k.button("Feuillet β", function(){ go(-120, 125); });
    var ro = k.readouts(["φ · ψ", "Zone de la carte", "Contact le plus serré", "Si tous les résidus ont ces angles", "Liaison peptidique"]);
    var nt = k.note("", "ok");
    function stopTour(){ st.tour = false; }
    function go(f, p){ stopTour(); st.anim = {f0:st.phi, p0:st.psi, f1:f, p1:p, t:0}; }
    function setAng(f, p){ st.phi = Math.round(f * 10) / 10; st.psi = Math.round(p * 10) / 10; phS.set(Math.round(st.phi)); psS.set(Math.round(st.psi)); }
    /* carte de Ramachandran (calculée avec le même modèle de sphères dures) */
    var mapImg = null;
    function buildMap(){
      var N = 72, cv = document.createElement("canvas"); cv.width = N; cv.height = N;
      var cx = cv.getContext("2d"), im = cx.createImageData(N, N);
      for (var i = 0; i < N; i++) for (var j = 0; j < N; j++){
        var phi = -180 + (i + 0.5) * 360 / N, psi = 180 - (j + 0.5) * 360 / N, lv = pepClash(pepBuild(phi, psi, st.gly), st.gly).lvl;
        var col = lv === 0 ? [47, 95, 168] : lv === 1 ? [150, 186, 228] : [247, 248, 250], o = (j * N + i) * 4;
        im.data[o] = col[0]; im.data[o + 1] = col[1]; im.data[o + 2] = col[2]; im.data[o + 3] = 255;
      }
      cx.putImageData(im, 0, 0); mapImg = cv;
    }
    /* souris sur la scène 3D : une plaque = φ ou ψ ; ailleurs = vue */
    var plates = {};
    function inPoly(p, poly){ var ins = false; for (var i = 0, j = poly.length - 1; i < poly.length; j = i++){ var a = poly[i], b = poly[j]; if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) ins = !ins; } return ins; }
    st.hit = function(type, p){
      if (type === "down"){
        st.grab = null;
        if (!st.chain){
          var cand = [];
          if (plates.p1 && inPoly(p, plates.p1.pts)) cand.push(["phi", plates.p1.z]);
          if (plates.p2 && inPoly(p, plates.p2.pts)) cand.push(["psi", plates.p2.z]);
          cand.sort(function(x, y){ return y[1] - x[1]; });
          if (cand.length){ st.grab = {k:cand[0][0], x:p.x, y:p.y}; stopTour(); st.anim = null; return true; }
        }
        return false;
      }
      if (type === "drag" && st.grab){
        var dd = (p.x - st.grab.x) * 0.9 - (p.y - st.grab.y) * 0.5; st.grab.x = p.x; st.grab.y = p.y;
        function wrap(v){ while (v > 180) v -= 360; while (v < -180) v += 360; return v; }
        if (st.grab.k === "phi") setAng(wrap(st.phi + dd), st.psi); else setAng(st.phi, wrap(st.psi + dd));
        return true;
      }
      if (type === "up" && st.grab){ st.grab = null; return true; }
      if (type === "move"){ var over = !st.chain && ((plates.p1 && inPoly(p, plates.p1.pts)) || (plates.p2 && inPoly(p, plates.p2.pts))); c.cv.style.cursor = over ? "grab" : "move"; }
      return false;
    };
    viewDrag(c, st);
    g.pointer(function(type, p){
      if ((type === "down" || type === "drag") && g.ax){ stopTour(); st.anim = null; var f = clamp(g.ax.iX(p.x), -180, 180), q = clamp(g.ax.iY(p.y), -180, 180); setAng(f, q); k.redraw(); }
    });
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.tour){
        var L = TOUR[st.leg], nx = TOUR[(st.leg + 1) % TOUR.length];
        st.tt += dt;
        var hold = L[2], mv = 1.8;
        if (st.tt > hold){ var u = ease((st.tt - hold) / mv); setAng(lerp(L[0], nx[0], u), lerp(L[1], nx[1], u)); }
        else setAng(L[0], L[1]);
        if (st.tt > hold + mv){ st.tt = 0; st.leg = (st.leg + 1) % (TOUR.length - 1); }
        st.a = 0.8 + 0.3 * Math.sin(st.t * 0.25);
      } else if (st.anim){
        st.anim.t += dt; var u2 = ease(st.anim.t / 1.2); setAng(lerp(st.anim.f0, st.anim.f1, u2), lerp(st.anim.p0, st.anim.p1, u2)); if (st.anim.t >= 1.2) st.anim = null;
      }
      var last = st.trail[st.trail.length - 1];
      if (!last || Math.abs(last[0] - st.phi) + Math.abs(last[1] - st.psi) > 2) st.trail.push([st.phi, st.psi]);
      if (st.trail.length > 60) st.trail.shift();
      tourB.textContent = st.tour ? "Arrêter la visite" : "Visite guidée";
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, gly = st.gly;
      c.clear(); bgScene(ctx, W, H, "#ffffff", "#e6ebf3");
      var A = pepBuild(st.phi, st.psi, gly), CL = pepClash(A, gly);
      var V = {a:st.a, b:st.b, sc:1, cx:0, cy:0, cam:40};
      var items = [], atoms = [], bonds = [], ctrP = A.CA1, rects = [];
      var ELC = {C:"#4a5568", N:"#2f5fd0", O:"#d6392f", H:"#e8edf3", B:"#4a5568"}, ELR = {C:0.36, N:0.35, O:0.36, H:0.22, B:0.38};
      /* orientation : N → C du résidu central à l'horizontale, Cα en haut, plan N–Cα–C face à nous */
      var mNC = lerp3(A.N1, A.C1, 0.5), q1 = nrm(sub(A.C1, A.N1)), q2 = sub(A.CA1, mNC); q2 = nrm(sub(q2, mul(q1, dot(q2, q1)))); var q3 = cross(q1, q2);
      function orientP(p){ var d = sub(p, ctrP); return [dot(d, q1), dot(d, q2), dot(d, q3)]; }
      if (!st.chain){
        Object.keys(A).forEach(function(kk){ atoms.push({k:kk, el:PEP_EL[kk], p:orientP(A[kk])}); });
        PEP_B.forEach(function(b){ if (A[b[0]] && A[b[1]]) bonds.push({a:b[0], b:b[1]}); });
      } else {
        var Rch = pepChain(st.phi, st.psi, 12, gly), m = [0, 0, 0], cnt = 0;
        Rch.forEach(function(r){ m = add(m, r.CA); cnt++; }); m = mul(m, 1 / cnt);
        var ex = sub(Rch[11].CA, Rch[0].CA); ex = len(ex) > 1 ? nrm(ex) : [1, 0, 0];
        var ey = Math.abs(ex[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]; ey = nrm(sub(ey, mul(ex, dot(ey, ex)))); var ez = cross(ex, ey), spin = st.t * 0.4;
        var orientC = function(p){ var d = sub(p, m), v = [dot(d, ex), dot(d, ey), dot(d, ez)]; return rotAx(v, [1, 0, 0], spin); };
        Rch.forEach(function(r, i){
          ["N", "CA", "C", "O", "H", "CB"].forEach(function(kk){ if (r[kk]) atoms.push({k:kk + i, el:kk === "CB" ? "B" : kk === "CA" ? "C" : kk, p:orientC(r[kk]), res:i}); });
          bonds.push({a:"N" + i, b:"CA" + i}, {a:"CA" + i, b:"C" + i}, {a:"C" + i, b:"O" + i});
          if (r.H) bonds.push({a:"N" + i, b:"H" + i});
          if (r.CB) bonds.push({a:"CA" + i, b:"CB" + i});
          if (i > 0) bonds.push({a:"C" + (i - 1), b:"N" + i});
        });
      }
      var amap = {}; atoms.forEach(function(a){ amap[a.k] = a; });
      /* cadrage */
      var tgt;
      if (!st.chain) tgt = Math.min(W / 9, (H - 40) / 7.2);
      else { var rx = 0, ry = 0; atoms.forEach(function(a){ rx = Math.max(rx, Math.abs(a.p[0])); ry = Math.max(ry, Math.hypot(a.p[1], a.p[2])); }); tgt = Math.min(W / (2 * rx + 4), (H - 50) / (2 * ry + 3)); }
      st.sc = st.sc ? st.sc + (tgt - st.sc) * 0.15 : tgt;
      V.sc = st.sc; V.cx = W / 2; V.cy = H / 2 + (ph ? 12 : 10);
      if (!st.chain){ var cc = [0, 0, 0]; atoms.forEach(function(a){ cc = add(cc, mul(a.p, 1 / atoms.length)); }); var rc = rot3(cc, V.a, V.b); st.cx = st.cx == null ? rc[0] : st.cx + (rc[0] - st.cx) * 0.1; st.cy = st.cy == null ? rc[1] : st.cy + (rc[1] - st.cy) * 0.1; V.cx -= st.cx * V.sc; V.cy += st.cy * V.sc; }
      atoms.forEach(function(a){ a.pr = proj(a.p, V); a.r = Math.max(a.el === "H" ? 3 : 5, ELR[a.el] * V.sc * a.pr.s * (st.chain ? 0.9 : 1.15)); });
      /* atomes en conflit */
      var hot = {};
      if (!st.chain) CL.bad.forEach(function(b){ hot[b.a] = Math.max(hot[b.a] || 0, b.lvl); hot[b.b] = Math.max(hot[b.b] || 0, b.lvl); });
      /* plaques des plans amides */
      function plate(keys, col, tagk){
        var P3 = keys.map(function(kk){ return amap[kk] ? amap[kk].p : null; }); if (P3.some(function(p){ return !p; })) return null;
        var c0 = [0, 0, 0]; P3.forEach(function(p){ c0 = add(c0, mul(p, 1 / P3.length)); });
        var e1 = nrm(sub(P3[1], P3[0])), nn = nrm(cross(e1, sub(P3[3], P3[0]))), e2 = cross(nn, e1);
        var pts2 = P3.map(function(p){ var d = sub(p, c0); return [dot(d, e1), dot(d, e2)]; });
        /* enveloppe convexe puis élargie */
        pts2.sort(function(a, b){ return a[0] - b[0] || a[1] - b[1]; });
        function cr(o, a, b){ return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
        var lo = [], hi = [];
        pts2.forEach(function(p){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
        pts2.slice().reverse().forEach(function(p){ while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); });
        var hull = lo.slice(0, -1).concat(hi.slice(0, -1));
        var out3 = [];
        hull.forEach(function(p){ var l = Math.hypot(p[0], p[1]) || 1, f = (l + 0.55) / l; out3.push(add(c0, add(mul(e1, p[0] * f), mul(e2, p[1] * f)))); });
        var pr = out3.map(function(p){ return proj(p, V); }), zc = proj(c0, V).z;
        items.push({z:zc - 0.35, f:function(){
          ctx.save(); var gg = ctx.createLinearGradient(pr[0].x, pr[0].y, pr[Math.floor(pr.length / 2)].x, pr[Math.floor(pr.length / 2)].y);
          gg.addColorStop(0, rgba(col, 0.30)); gg.addColorStop(1, rgba(col, 0.16));
          ctx.fillStyle = gg; ctx.strokeStyle = rgba(col, 0.85); ctx.lineWidth = 1.6; ctx.lineJoin = "round";
          ctx.beginPath(); pr.forEach(function(p, i){ if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
        }});
        return {pts:pr, z:zc};
      }
      if (!st.chain){
        plates.p1 = plate(["CA0", "C0", "O0", "N1", "H1", "CA1"], "#2f6fd6");
        plates.p2 = plate(["CA1", "C1", "O1", "N2", "H2", "CA2"], "#2b9a52");
      } else {
        plates = {};
        for (var i2 = 0; i2 < 11; i2++) plate(["CA" + i2, "C" + i2, "O" + i2, "N" + (i2 + 1), "H" + (i2 + 1), "CA" + (i2 + 1)], i2 % 2 ? "#2b9a52" : "#2f6fd6");
      }
      bonds.forEach(function(b){
        var A1 = amap[b.a], B1 = amap[b.b]; if (!A1 || !B1) return; var p = A1.pr, q = B1.pr;
        var pep = (b.a === "C0" && b.b === "N1") || (b.a === "C1" && b.b === "N2") || (/^C\d+$/.test(b.a) && /^N\d+$/.test(b.b));
        items.push({z:(p.z + q.z) / 2 - 0.05, f:function(){
          var w = Math.max(2.2, V.sc * 0.13) * (p.s + q.s) / 2;
          ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = pep ? "#6b5aa6" : "#7d8a9b"; ctx.lineWidth = w;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          if (pep && !st.chain){ ctx.setLineDash([w * 0.9, w * 0.9]); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = w * 0.35; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
          ctx.restore();
        }});
      });
      atoms.forEach(function(a){
        var p = a.pr, r = a.r, lv = hot[a.k] || 0;
        items.push({z:p.z, f:function(){
          if (lv){ var gg = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 2.6); gg.addColorStop(0, lv === 2 ? "rgba(230,40,30,.75)" : "rgba(245,150,30,.6)"); gg.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.6, 0, 7); ctx.fill(); }
          ball(ctx, p.x, p.y, r, lv === 2 ? "#e0301e" : lv === 1 && a.el === "H" ? "#f3b24a" : ELC[a.el]);
          if (!st.chain && a.el !== "H" && r > 8){
            var tx = a.k === "CA1" ? "Cα" : a.k === "CB1" ? "Cβ" : a.el;
            ctx.save(); ctx.font = "800 " + Math.round(clamp(r * 0.85, 9, 14)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.strokeText(tx, p.x, p.y); ctx.fillStyle = "#fff"; ctx.fillText(tx, p.x, p.y); ctx.restore();
          }
        }});
      });
      /* liaisons H de la chaîne (N–H···O=C) */
      var nHB = 0, hbI = null;
      if (st.chain){
        for (var j = 1; j < 12; j++) for (var i3 = 0; i3 < 12; i3++){
          if (Math.abs(i3 - j) < 3) continue; var Hh = amap["H" + j], Oo = amap["O" + i3], Nn = amap["N" + j]; if (!Hh || !Oo) continue;
          var dHO = dist(Hh.p, Oo.p), ang = Math.acos(clamp(dot(nrm(sub(Nn.p, Hh.p)), nrm(sub(Oo.p, Hh.p))), -1, 1)) / DEG;
          if (dHO < 2.6 && ang > 120){ nHB++; hbI = j - i3; (function(p, q){ items.push({z:(p.z + q.z) / 2 + 0.2, f:function(){ ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "#e08a1e"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore(); }}); })(Hh.pr, Oo.pr); }
        }
      }
      /* flèches de rotation φ et ψ autour des liaisons N–Cα et Cα–C */
      function rotArrow(ka, kb, col, txt){
        var pa = amap[ka].p, pb = amap[kb].p, ax = nrm(sub(pb, pa)), mid = lerp3(pa, pb, 0.5), e1 = nrm(cross(ax, Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), e2 = cross(ax, e1), rad = 0.62;
        var pts = []; for (var q = 0; q <= 26; q++){ var an = (20 + q * 11) * DEG; pts.push(proj(add(mid, add(mul(e1, rad * Math.cos(an)), mul(e2, rad * Math.sin(an)))), V)); }
        items.push({z:proj(mid, V).z + 0.3, f:function(){
          ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.beginPath(); pts.forEach(function(p, i){ if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.stroke();
          var pE = pts[pts.length - 1], pF = pts[pts.length - 3]; arrowHead(ctx, pE.x, pE.y, Math.atan2(pE.y - pF.y, pE.x - pF.x), 9); ctx.restore();
        }});
        var lp2 = proj(add(mid, mul(e1, rad + 0.75)), V);
        return {x:lp2.x, y:lp2.y, txt:txt, col:col};
      }
      var arrowLabs = [];
      if (!st.chain){ arrowLabs.push(rotArrow("N1", "CA1", "#1d4fae", "φ " + F(st.phi, 0) + "°")); arrowLabs.push(rotArrow("CA1", "C1", "#1e7a42", "ψ " + F(st.psi, 0) + "°")); }
      /* traits rouges entre atomes trop proches */
      var worstPair = !st.chain && CL.bad.length ? CL.bad[0] : null;
      if (!st.chain) CL.bad.forEach(function(b){ if (b.lvl < 2) return; var p = amap[b.a].pr, q = amap[b.b].pr; items.push({z:Math.max(p.z, q.z) + 0.5, f:function(){ ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#e0301e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore(); }}); });
      items.sort(function(x, y){ return x.z - y.z; }); items.forEach(function(it){ it.f(); });
      /* étiquettes (sans chevauchement) */
      function place(txt, x, y, o){
        o = o || {}; var size = o.size || (ph ? 11 : 12), w = textW(ctx, txt, size, o.weight) + 12, h = size + 8;
        var cx = clamp(x, w / 2 + 3, W - w / 2 - 3), cy = clamp(y, 32 + h / 2, H - h / 2 - 3);
        for (var it = 0; it < 6; it++){
          var hit = rects.filter(function(r){ return Math.abs(cx - (r.x + r.w / 2)) < (w + r.w) / 2 + 2 && Math.abs(cy - (r.y + r.h / 2)) < (h + r.h) / 2 + 2; })[0];
          if (!hit) break; cy = hit.y + hit.h + h / 2 + 3; if (cy > H - h / 2 - 3) cy = hit.y - h / 2 - 3;
        }
        rects.push(tag(ctx, txt, cx, cy, W, H, {size:size, col:o.col, border:o.border, bg:o.bg, weight:o.weight}));
      }
      rects.push({x:0, y:0, w:Math.min(W, 330), h:30});
      var title = st.chain ? "12 résidus avec φ = " + F(st.phi, 0) + "°, ψ = " + F(st.psi, 0) + "°" : (gly ? "Gly" : "Ala") + " au centre : plans amides rigides";
      label(ctx, title, 10, 16, {size:ph ? 11.5 : 13, align:"left", col:"#13233a", bg:"rgba(255,255,255,.88)"});
      arrowLabs.forEach(function(L){ place(L.txt, L.x, L.y, {col:L.col, border:L.col, weight:800}); });
      if (!st.chain){
        var pm = {x:0, y:0}; atoms.forEach(function(a){ pm.x += a.pr.x / atoms.length; pm.y += a.pr.y / atoms.length; });
        [["CA0", "résidu i − 1"], ["CA2", "résidu i + 1"]].forEach(function(q){
          var pc = amap[q[0]].pr, dx = pc.x - pm.x, dy = pc.y - pm.y, l = Math.hypot(dx, dy) || 1, off = amap[q[0]].r + 26;
          ctx.save(); ctx.strokeStyle = "rgba(95,107,122,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pc.x + dx / l * amap[q[0]].r, pc.y + dy / l * amap[q[0]].r); ctx.lineTo(pc.x + dx / l * (off - 8), pc.y + dy / l * (off - 8)); ctx.stroke(); ctx.restore();
          place(q[1], pc.x + dx / l * off, pc.y + dy / l * off, {size:ph ? 10 : 11, col:"#5f6b7a"});
        });
        if (worstPair){
          var pa = amap[worstPair.a].pr, pb = amap[worstPair.b].pr, nm = function(kk){ return {CA0:"Cα", CA2:"Cα", CA1:"Cα", C0:"C", C1:"C", O0:"O", O1:"O", N1:"N", N2:"N", H1:"H", H2:"H", HA1:"Hα", HB:"Hα", CB1:"Cβ"}[kk]; };
          place(nm(worstPair.a) + "···" + nm(worstPair.b) + " " + F(worstPair.d, 2) + " Å", (pa.x + pb.x) / 2, (pa.y + pb.y) / 2 - 18, {col:worstPair.lvl === 2 ? "#c0392b" : "#b86e00", border:worstPair.lvl === 2 ? "#c0392b" : "#b86e00", weight:800});
        }
      } else if (nHB) place(nHB + " liaisons H : N–H(i + " + hbI + ")···O=C(i)", W / 2, H - 16, {col:"#b86e00", border:"#e08a1e", weight:800});
      if (!ph) label(ctx, st.chain ? "glisse pour tourner" : "plaque : φ ou ψ · ailleurs : vue", W - 10, H - 13, {size:11, align:"right", col:"#8a95a3", weight:600});

      /* ---- carte de Ramachandran ---- */
      if (!mapImg) buildMap();
      g.clear(); var e = g.ctx, GW = g.W, GH = g.H;
      e.fillStyle = "#fbfcfe"; e.fillRect(0, 0, GW, GH);
      var side = GW > 480 ? Math.min(GW - 64, GH - 52) : Math.min(GW - 64, GH - 84), ax2 = {L:Math.max(42, (GW - side) / 2 - (GW > 480 ? 70 : 0)), T:26};
      ax2.R = ax2.L + side; ax2.B = ax2.T + side;
      ax2.X = function(f){ return ax2.L + (f + 180) / 360 * side; }; ax2.Y = function(p){ return ax2.T + (180 - p) / 360 * side; };
      ax2.iX = function(x){ return (x - ax2.L) / side * 360 - 180; }; ax2.iY = function(y){ return 180 - (y - ax2.T) / side * 360; }; g.ax = ax2;
      e.drawImage(mapImg, ax2.L, ax2.T, side, side);
      e.save(); e.strokeStyle = "rgba(60,70,90,.18)"; e.lineWidth = 1;
      [-90, 0, 90].forEach(function(v){ e.beginPath(); e.moveTo(ax2.X(v), ax2.T); e.lineTo(ax2.X(v), ax2.B); e.moveTo(ax2.L, ax2.Y(v)); e.lineTo(ax2.R, ax2.Y(v)); e.stroke(); });
      e.strokeStyle = "#8a95a3"; e.lineWidth = 1.2; e.strokeRect(ax2.L, ax2.T, side, side); e.restore();
      e.save(); e.font = "600 10px " + FONT; e.fillStyle = "#5f6b7a"; e.textAlign = "center"; e.textBaseline = "top";
      [-180, -90, 0, 90, 180].forEach(function(v){ e.fillText(String(v).replace("-", "−"), ax2.X(v), ax2.B + 3); });
      e.textAlign = "right"; e.textBaseline = "middle";
      [-180, -90, 0, 90, 180].forEach(function(v){ e.fillText(String(v).replace("-", "−"), ax2.L - 4, ax2.Y(v)); });
      e.restore();
      if (GW > 480) label(e, "φ (°)", ax2.R, ax2.B + 20, {size:10.5, align:"right", col:"#1d4fae", weight:800});
      else label(e, "φ (°)", ax2.L + side / 2, ax2.B + 24, {size:10.5, col:"#1d4fae", weight:800});
      label(e, "ψ (°)", 4, ax2.T - 12, {size:10.5, align:"left", col:"#1e7a42", weight:800});
      label(e, "Carte de Ramachandran · " + (gly ? "glycine" : "alanine"), ax2.L + side / 2, 11, {size:11.5, col:"#2c3a4e"});
      /* repères */
      RAMA_REF.forEach(function(r){
        var x = ax2.X(r.phi), y = ax2.Y(r.psi);
        e.save(); e.strokeStyle = "#fff"; e.lineWidth = 3; e.beginPath(); e.moveTo(x - 5, y - 5); e.lineTo(x + 5, y + 5); e.moveTo(x + 5, y - 5); e.lineTo(x - 5, y + 5); e.stroke();
        e.strokeStyle = r.col; e.lineWidth = 1.8; e.stroke(); e.restore();
        var lx = r.phi > 0 ? x + 8 : x - 8;
        label(e, r.n, lx, y + (r.psi > 0 ? -12 : 13), {size:10, align:r.phi > 0 ? "left" : "right", col:r.col, weight:800, bg:"rgba(255,255,255,.85)"});
      });
      /* trace et point courant */
      e.save(); e.strokeStyle = "rgba(19,35,58,.35)"; e.lineWidth = 1.5;
      for (var t2 = 1; t2 < st.trail.length; t2++){ var a1 = st.trail[t2 - 1], b1 = st.trail[t2]; if (Math.abs(a1[0] - b1[0]) > 90 || Math.abs(a1[1] - b1[1]) > 90) continue; e.beginPath(); e.moveTo(ax2.X(a1[0]), ax2.Y(a1[1])); e.lineTo(ax2.X(b1[0]), ax2.Y(b1[1])); e.stroke(); }
      e.restore();
      var lvlNow = CL.lvl, pcol = lvlNow === 2 ? "#e0301e" : lvlNow === 1 ? "#f39c12" : "#13233a";
      ball(e, ax2.X(st.phi), ax2.Y(st.psi), 7, pcol);
      /* légende */
      var lgX = ax2.R + 12, lgY = ax2.T + 8;
      var leg = [["#2f5fa8", "permise"], ["#96bae4", "limite"], ["#f7f8fa", "interdite"]];
      if (GW > 480) leg.forEach(function(L, i){ e.save(); e.fillStyle = L[0]; e.strokeStyle = "#8a95a3"; e.fillRect(lgX, lgY + i * 22, 14, 14); e.strokeRect(lgX, lgY + i * 22, 14, 14); e.restore(); label(e, L[1], lgX + 20, lgY + 7 + i * 22, {size:10.5, align:"left", col:"#2c3a4e", weight:700}); });
      else leg.forEach(function(L, i){ var xx = ax2.L + i * (side / 3); e.save(); e.fillStyle = L[0]; e.strokeStyle = "#8a95a3"; e.fillRect(xx, GH - 17, 12, 12); e.strokeRect(xx, GH - 17, 12, 12); e.restore(); label(e, L[1], xx + 17, GH - 11, {size:10, align:"left", col:"#2c3a4e", weight:700}); });

      /* ---- valeurs ---- */
      var hx = pepHelix(st.phi, st.psi);
      ro.set(0, F(st.phi, 0) + "° · " + F(st.psi, 0) + "°");
      ro.set(1, ramaZone(st.phi, st.psi, CL.lvl));
      if (CL.bad.length){ var wp = CL.bad[0], nmm = function(kk){ return {CA0:"Cα", CA2:"Cα", CA1:"Cα", C0:"C", C1:"C", O0:"O", O1:"O", N1:"N", N2:"N", H1:"H", H2:"H", HA1:"Hα", HB:"Hα", CB1:"Cβ"}[kk]; };
        ro.set(2, nmm(wp.a) + "···" + nmm(wp.b) + " : " + F(wp.d, 2) + " Å (min " + F(wp.lim[wp.lvl === 2 ? 1 : 0], 1) + ")"); }
      else ro.set(2, "aucun contact trop court");
      ro.set(3, (CL.lvl === 2 ? "impossible (gêne) · " : "") + (hx.th > 172 ? "≈ 2 résidus/tour (zigzag) · " + F(hx.rise, 1) + " Å/résidu" : F(hx.n, 1) + " résidus/tour · " + F(hx.rise, 2) + " Å/résidu · " + (hx.right ? "droite" : "gauche")));
      ro.set(4, "ω = 180° (trans, fixe) · C–N " + F(PEP.CN, 2) + " Å");
      var msg = "Les deux plaques sont rigides : la liaison C–N (" + F(PEP.CN, 2) + " Å, entre la simple 1,47 Å et la double 1,27 Å) ne tourne pas. ";
      if (CL.lvl === 2 && worstPair) msg += "Ici, deux atomes sont plus proches que la somme de leurs rayons de contact : cette conformation n'existe pas. ";
      if (Math.abs(st.phi + 57) < 8 && Math.abs(st.psi + 47) < 8) msg += "Hélice α : en répétant ces angles, la chaîne s'enroule à droite avec 3,6 résidus par tour et 1,5 Å par résidu (pas de 5,4 Å) ; le N–H du résidu i + 4 se lie au C=O du résidu i (vue « chaîne »). ";
      else if (st.phi < -90 && st.psi > 100) msg += "Feuillet β : la chaîne est presque complètement étirée (≈ 3,3 à 3,5 Å par résidu) ; ses liaisons H se font avec une chaîne voisine, pas à l'intérieur du brin. ";
      if (gly) msg += "Glycine : sans Cβ, beaucoup de gênes disparaissent ; la carte devient presque symétrique.";
      nt.set(msg + " <i>Modèle de sphères dures (limites de contact de Ramachandran légèrement assouplies : O···H 2,3 au lieu de 2,4 Å ; C···C 3,0 au lieu de 3,2 Å), géométrie idéale, angle N–Cα–C = 110°.</i>", "ok");
    });
  }
});

})();
