/* Chimie BA1 · lot P2-CE (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-force-acide-structure · ch-tampon-sang · ch-corrosion-goutte · ch-regle-gamma-ph · ch-especes-reactives-oxygene
   Fichier autonome : toutes les aides sont ici, préfixe ce. Aucune ressource externe. */
(function(){
var PI = Math.PI;

/* ---------- aides de dessin (préfixe ce) ---------- */
function ceHex(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function ceShade(hex, f){
  var c = ceHex(hex);
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function ceRgba(hex, a){ var c = ceHex(hex); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
function ceMix(h1, h2, t){
  var a = ceHex(h1), b = ceHex(h2); t = Math.max(0, Math.min(1, t));
  function q(i){ var v = Math.round(a[i] + (b[i] - a[i]) * t).toString(16); return v.length < 2 ? "0" + v : v; }
  return "#" + q(0) + q(1) + q(2);
}
function ceBall(ctx, x, y, r, hex, alpha){
  if (!(r > 0.4)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, ceShade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, ceShade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
function ceRR(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function ceFmt(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
function ceSigned(x, d){ var s = ceFmt(x, d); return (x > 0 && s.replace(/[0,]/g, "") !== "") ? "+" + s : s; }
var CE_SUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻", "−":"⁻", "+":"⁺"};
function ceSup(n){ return String(n).split("").map(function(c){ return CE_SUP[c] || c; }).join(""); }
function ceSci(x, d){
  if (!isFinite(x) || x === 0) return ceFmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.9995){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return ceFmt(x, Math.max(0, d - e));
  return ceFmt(m, d) + "·10" + ceSup(e);
}
function ceFont(w, s){ return w + " " + Math.round(s) + "px Mulish, system-ui, sans-serif"; }
function ceText(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = ceFont(o.w || 700, o.size || 12); ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.halo){ ctx.lineJoin = "round"; ctx.lineWidth = o.hw || 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.fillText(s, x, y); ctx.restore();
}
function ceTw(ctx, s, size, w){ ctx.save(); ctx.font = ceFont(w || 700, size); var m = ctx.measureText(s).width; ctx.restore(); return m; }
/* pastille de texte ; renvoie {x0, y0, w, h} */
function ceTag(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 11.5;
  ctx.save(); ctx.font = ceFont(o.w || 800, size);
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  var w = ctx.measureText(s).width + 14, h = size + 9, al = o.align || "center";
  var x0 = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  if (o.clampW){ x0 = Math.max(o.clampL || 4, Math.min(o.clampW - w - 4, x0)); }
  ceRR(ctx, x0, y - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "rgba(255,255,255,.93)"; ctx.fill();
  if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x0 + w / 2, y + 0.5);
  ctx.restore(); return {x0:x0, y0:y - h / 2, w:w, h:h};
}
/* texte sur plusieurs lignes ; renvoie le nombre de lignes */
function ceWrap(ctx, s, x, y, maxW, lh, o){
  o = o || {}; ctx.save(); ctx.font = ceFont(o.w || 700, o.size || 12);
  var words = s.split(" "), lines = [], cur = "";
  words.forEach(function(wd){ var t = cur ? cur + " " + wd : wd; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = wd; } else cur = t; });
  if (cur) lines.push(cur);
  ctx.restore();
  if (!o.measure) lines.forEach(function(L, i){ ceText(ctx, L, x, y + i * lh, o); });
  return lines.length;
}
function ceArrow(ctx, x1, y1, x2, y2, col, w, head){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
  var a = Math.atan2(dy, dx), h = Math.min(head || (7 + w * 1.6), L * 0.6);
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
  ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill(); ctx.restore();
}
function ceShadow(ctx, x, y, rx, ry, a){ ctx.save(); ctx.fillStyle = "rgba(0,0,0," + (a || 0.3) + ")"; ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, 7); ctx.fill(); ctx.restore(); }
/* canevas dont la hauteur suit la largeur (plus haut sur téléphone) ; jamais de hauteur nulle */
function ceCanvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = (w > 0 && w < 480) ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
/* rotation de vue : lacet a, tangage b (b > 0 : vu d'en haut) */
function ceRot(p, a, b){
  var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1];
  return [x, y * cb - z * sb, y * sb + z * cb];
}
function ceSmooth(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function ceHash(i, j){ var x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); }
function ceClamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
/* petite algèbre 3D */
function vAdd(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function vSub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function vMul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function vDot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vCross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function vNrm(a){ var l = Math.sqrt(vDot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
/* boîte 3D (faces visibles seulement) ; P : projection monde → écran */
function ceBox(ctx, P, x0, x1, y0, y1, z0, z1, col, a, b, o){
  o = o || {};
  var V = [];
  for (var i = 0; i < 8; i++) V.push(P([i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0]));
  var F = [[[0, 1, 3, 2], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, 1]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 3, 7, 6], [0, 1, 0]], [[0, 2, 6, 4], [-1, 0, 0]], [[1, 3, 7, 5], [1, 0, 0]]];
  var L = [-0.45, 0.75, 0.5];
  F.forEach(function(f){
    var n = ceRot(f[1], a, b); if (n[2] <= 0.002) return;
    if (o.skip && o.skip(f[1])) return;
    var lit = 0.35 + 0.65 * Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
    ctx.beginPath(); f[0].forEach(function(vi, j){ j ? ctx.lineTo(V[vi].x, V[vi].y) : ctx.moveTo(V[vi].x, V[vi].y); }); ctx.closePath();
    var g = ctx.createLinearGradient(V[f[0][0]].x, V[f[0][0]].y, V[f[0][2]].x, V[f[0][2]].y);
    g.addColorStop(0, ceShade(col, (lit - 0.62) * 0.9 + 0.12)); g.addColorStop(1, ceShade(col, (lit - 0.62) * 0.9 - 0.1));
    ctx.fillStyle = g; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fill(); ctx.globalAlpha = 1;
    if (o.edge !== false){ ctx.strokeStyle = o.edge || "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.stroke(); }
  });
  return V;
}
function ceHull(pts){
  pts = pts.slice().sort(function(a, b){ return a.x - b.x || a.y - b.y; });
  function cr(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
  var lo = [], up = [];
  pts.forEach(function(p){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
  for (var i = pts.length - 1; i >= 0; i--){ var p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function cePoly(ctx, pts){ ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); }
function ceRing(P, cx, cz, R, y, n){ var o = []; for (var i = 0; i < (n || 44); i++){ var t = i / (n || 44) * 2 * PI; o.push(P([cx + R * Math.cos(t), y, cz + R * Math.sin(t)])); } return o; }
/* cylindre vertical translucide (verre, liquide) */
function ceCyl(ctx, P, cx, cz, R, y0, y1, col, alpha, topCol){
  var r0 = ceRing(P, cx, cz, R, y0), r1 = ceRing(P, cx, cz, R, y1), hull = ceHull(r0.concat(r1));
  var xs = hull.map(function(p){ return p.x; }), mn = Math.min.apply(null, xs), mx = Math.max.apply(null, xs);
  var g = ctx.createLinearGradient(mn, 0, mx, 0);
  g.addColorStop(0, ceRgba(col, alpha * 0.95)); g.addColorStop(0.35, ceRgba(col, alpha * 0.7)); g.addColorStop(0.75, ceRgba(col, alpha * 0.85)); g.addColorStop(1, ceRgba(col, alpha));
  ctx.fillStyle = g; cePoly(ctx, hull); ctx.fill();
  if (topCol){ ctx.fillStyle = topCol; cePoly(ctx, r1); ctx.fill(); }
  return {hull:hull, top:r1, bot:r0, mn:mn, mx:mx};
}
/* liaison en bâton 3D entre deux points projetés */
function ceStick(ctx, p1, p2, w, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.lineCap = "round";
  ctx.strokeStyle = ceShade(col, -0.45); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = w * 0.62; ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = Math.max(1, w * 0.18);
  ctx.beginPath(); ctx.moveTo(p1.x - w * 0.12, p1.y - w * 0.14); ctx.lineTo(p2.x - w * 0.12, p2.y - w * 0.14); ctx.stroke();
  ctx.restore();
}
/* nuage électronique translucide : q < 0 rouge (riche en électrons), q > 0 bleu (pauvre) */
function ceCloud(ctx, x, y, r, inten, neg, alpha){
  if (!(r > 1)) return;
  var col = neg ? ceMix("#f4efe6", "#e0332b", inten) : ceMix("#f4efe6", "#2f6fe0", inten);
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, ceRgba(col, 0.42)); g.addColorStop(0.75, ceRgba(col, 0.3)); g.addColorStop(1, ceRgba(col, 0.06));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = ceRgba(col, 0.55); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.restore();
}
function ceDrag(c, st, kb, ka, bmin, bmax){
  c.pointer(function(type, p){
    if (st.onPtr && st.onPtr(type, p)) return;
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; st.idle = 0; }
    if (type === "drag" && st.drag){ st.a += (p.x - st.lx) * (ka || 0.011); st.b = ceClamp(st.b + (p.y - st.ly) * (kb || 0.009), bmin == null ? -1.3 : bmin, bmax == null ? 1.3 : bmax); st.lx = p.x; st.ly = p.y; st.idle = 0; }
    if (type === "up") st.drag = false;
  });
  c.cv.style.cursor = "grab";
}
function ceHide(el, show){ if (el) el.style.display = show ? "" : "none"; }

/* =====================================================================
   1. Force d'un acide et structure (L12)
   ===================================================================== */
var FA_COL = {H:"#eef2f6", F:"#8fd14f", Cl:"#2fb34f", Br:"#a5402a", I:"#7b3fa0", C:"#4a5568", N:"#3b5fd6", O:"#d6392f"};
var FA_RVDW = {H:1.10, C:1.70, N:1.55, O:1.52, F:1.47, Cl:1.75, Br:1.85, I:1.98};
var FA_RION = {F:1.33, Cl:1.81, Br:1.96, I:2.20};   /* rayons ioniques de X⁻ (Å) */
var FA_CHI = {H:2.20, C:2.55, N:3.04, O:3.44, F:3.98};
var FA_D = 3.33564e-30, FA_E = 1.602177e-19;          /* 1 debye (C·m), charge élémentaire (C) */
/* direction d'un des n atomes d'une pyramide d'axe −y dont l'angle entre liaisons vaut ang (degrés) */
function faPyr(ang, phi){
  var c = Math.cos(ang * PI / 180), s2 = (1 - c) / 1.5, st = Math.sqrt(s2), ct = Math.sqrt(1 - s2);
  return [st * Math.cos(phi), -ct, st * Math.sin(phi)];
}
var FA_TET = [vNrm([1, 1, 1]), vNrm([1, -1, -1]), vNrm([-1, 1, -1]), vNrm([-1, -1, 1])];
/* H d'un groupe O–H : angle Cl–O–H 105°, dans le plan perpendiculaire choisi */
function faOH(O, Cl, up){
  var u = vNrm(vSub(O, Cl)), p = vNrm(vSub(up, vMul(u, vDot(up, u))));
  return vAdd(O, vMul(vAdd(vMul(u, Math.cos(75 * PI / 180)), vMul(p, Math.sin(75 * PI / 180))), 0.97));
}
/* chaque espèce : atomes [élément, position (Å), charge partielle (qualitative sauf HX)], liaisons, H acide (hA) et atome qui le porte (xA) */
function faMol(key){
  var A = [], B = [], hA = 1, xA = 0, conj = null;
  function at(e, p, q){ A.push({e:e, p:p, q:q}); return A.length - 1; }
  var HX = {HF:["F", 0.917, 1.82], HCl:["Cl", 1.275, 1.08], HBr:["Br", 1.414, 0.82], HI:["I", 1.609, 0.44]};
  if (HX[key]){
    var X = HX[key], d = X[1], dl = X[2] * FA_D / (FA_E * d * 1e-10);
    xA = at(X[0], [0, 0, 0], -dl); hA = at("H", [d, 0, 0], dl); B.push([xA, hA]);
    conj = {}; conj[xA] = -1;
  } else if (key === "CH4" || key === "NH3" || key === "H2O"){
    if (key === "CH4"){ xA = at("C", [0, 0, 0], -0.2); FA_TET.forEach(function(v){ B.push([0, at("H", vMul(v, 1.09), 0.05)]); }); hA = 1; }
    if (key === "NH3"){ xA = at("N", [0, 0, 0], -0.6); [0, 1, 2].forEach(function(i){ B.push([0, at("H", vMul(faPyr(107, i * 2 * PI / 3), 1.01), 0.2)]); }); hA = 1; }
    if (key === "H2O"){ xA = at("O", [0, 0, 0], -0.66); var hh = 52.25 * PI / 180; B.push([0, at("H", [Math.sin(hh) * 0.96, -Math.cos(hh) * 0.96, 0], 0.33)]); B.push([0, at("H", [-Math.sin(hh) * 0.96, -Math.cos(hh) * 0.96, 0], 0.33)]); hA = 1; }
    conj = {}; conj[xA] = -1;
  } else {
    /* oxacides du chlore : Cl au centre ; O1 porte le H */
    var n = {HClO:0, HClO2:1, HClO3:2, HClO4:3}[key], cl = at("Cl", [0, 0, 0], [0.2, 0.63, 1.18, 1.71][n]), dirs;
    if (n === 0) dirs = [[-1, 0, 0]];
    else if (n === 1) dirs = [[Math.cos(215 * PI / 180), Math.sin(215 * PI / 180), 0], [Math.cos(325 * PI / 180), Math.sin(325 * PI / 180), 0]];
    else if (n === 2) dirs = [faPyr(105, 0), faPyr(105, 2 * PI / 3), faPyr(105, 4 * PI / 3)];
    else dirs = FA_TET;
    var oIdx = [];
    dirs.forEach(function(v, i){ var o = at("O", vMul(v, i === 0 ? (n === 0 ? 1.69 : 1.64) : (n === 3 ? 1.41 : 1.44)), i === 0 ? -0.5 : -0.55); oIdx.push(o); B.push([cl, o, i === 0 ? 1 : 2]); });
    var O1 = A[oIdx[0]].p, up = n === 1 ? [0, 0, 1] : n === 0 ? [0, 1, 0] : (n === 2 ? [0, 0, 1] : [0, 1, 0]);
    if (n === 0) A[oIdx[0]].q = -0.62;
    xA = oIdx[0]; hA = at("H", faOH(O1, [0, 0, 0], up), 0.42); B.push([xA, hA]);
    conj = {}; oIdx.forEach(function(o){ conj[o] = -(0.35 + 1 / (n + 1)); });
    conj.share = n + 1;
  }
  /* centrage sur le barycentre géométrique de l'acide */
  var cx = [0, 0, 0]; A.forEach(function(a){ cx = vAdd(cx, a.p); }); cx = vMul(cx, 1 / A.length);
  A.forEach(function(a){ a.p = vSub(a.p, cx); });
  return {A:A, B:B, hA:hA, xA:xA, conj:conj};
}
/* données : d (pm), D (kJ/mol), μ (D), pKa ; χ ; n.o. */
var FA_DATA = {
  HF:{f:"HF", nom:"fluorure d'hydrogène", b:"F⁻", d:91.7, D:570, mu:1.82, pKa:3.17, x:"F"},
  HCl:{f:"HCl", nom:"chlorure d'hydrogène", b:"Cl⁻", d:127.5, D:432, mu:1.08, pKa:-7, x:"Cl", approx:true},
  HBr:{f:"HBr", nom:"bromure d'hydrogène", b:"Br⁻", d:141.4, D:366, mu:0.82, pKa:-9, x:"Br", approx:true},
  HI:{f:"HI", nom:"iodure d'hydrogène", b:"I⁻", d:160.9, D:298, mu:0.44, pKa:-10, x:"I", approx:true},
  CH4:{f:"CH₄", nom:"méthane", b:"CH₃⁻", pKa:50, x:"C", approx:true, solv:"non"},
  NH3:{f:"NH₃", nom:"ammoniac", b:"NH₂⁻", pKa:38, x:"N", approx:true, solv:"non"},
  H2O:{f:"H₂O", nom:"eau", b:"OH⁻", pKa:14, x:"O", solv:"eau"},
  HClO:{f:"HClO", nom:"acide hypochloreux", b:"ClO⁻", pKa:7.53, no:1, nO:0},
  HClO2:{f:"HClO₂", nom:"acide chloreux", b:"ClO₂⁻", pKa:1.96, no:3, nO:1},
  HClO3:{f:"HClO₃", nom:"acide chlorique", b:"ClO₃⁻", pKa:-1, no:5, nO:2, approx:true},
  HClO4:{f:"HClO₄", nom:"acide perchlorique", b:"ClO₄⁻", pKa:-8, no:7, nO:3, approx:true}
};
var FA_SERIES = {col:["HF", "HCl", "HBr", "HI"], per:["CH4", "NH3", "H2O", "HF"], oxo:["HClO", "HClO2", "HClO3", "HClO4"]};
var FA_RANGE = {col:[-11, 5], per:[-3, 53], oxo:[-10, 9]};
var FA_SC = {col:2.55, per:2.3, oxo:2.9};
/* degré d'ionisation à la concentration C : α = (−Ka + √(Ka² + 4·Ka·C)) / (2C) */
function faAlpha(pKa, C){ var Ka = Math.pow(10, -pKa); return (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C)) / (2 * C); }
function faDelta(k){ var D = FA_DATA[k]; return D.mu * FA_D / (FA_E * D.d * 1e-12); }
function faPk(k){ var D = FA_DATA[k]; return (D.approx ? "≈ " : "") + ceFmt(D.pKa, D.approx || Number.isInteger(D.pKa) ? 0 : 2); }
function faAlphaTxt(k){
  var D = FA_DATA[k]; if (D.solv === "non") return "pas d'ionisation dans l'eau"; if (D.solv === "eau") return "c'est le solvant";
  var a = faAlpha(D.pKa, 0.1); return a > 0.995 ? "≈ 100 %" : a < 0.001 ? ceFmt(a * 100, 3) + " %" : a < 0.1 ? ceFmt(a * 100, 1) + " %" : ceFmt(a * 100, 0) + " %";
}

SFA.sim({
  id:"ch-force-acide-structure", ch:"L12", tag:"Acides et bases",
  titre:"Pourquoi HI est plus fort que HF : taille, électronégativité, oxacides",
  resume:"Des molécules en 3D colorées par leur densité électronique (rouge : riche en électrons, bleu : pauvre). Descends la colonne HF → HI, avance sur la période CH₄ → HF ou ajoute des O à HClO jusqu'à HClO₄ : le H⁺ part plus ou moins facilement et le pKa suit, sur l'échelle.",
  but:"Choisis une série, puis une molécule (ou clique sa graduation sur l'échelle des pKa). Regarde le H⁺ partir et revenir : plus il reste parti, plus l'acide est ionisé. Compare la couleur du H (sa charge partielle) et la taille de l'ion conjugué. Glisse sur la molécule pour la tourner.",
  aRetenir:"La force d'un acide H–A dépend surtout de la stabilité de sa base conjuguée A⁻. Dans une colonne, c'est la taille qui gagne : la liaison H–X s'allonge et s'affaiblit (HF 570 kJ/mol, HI 298 kJ/mol) et la charge de X⁻ s'étale sur un plus gros ion, donc HF (pKa 3,2) < HCl < HBr < HI. Sur une période, la taille change peu : c'est l'électronégativité de l'atome qui porte la charge qui gagne, donc CH₄ (≈ 50) < NH₃ (≈ 38) < H₂O (14) < HF (3,2). Pour les oxacides, chaque O sans H attire les électrons (effet inductif) et partage la charge du conjugué : HClO (7,5) < HClO₂ (2,0) < HClO₃ (≈ −1) < HClO₄ (≈ −8).",
  piege:"La liaison la plus polaire ne donne pas l'acide le plus fort : HF a le H le plus positif (δ ≈ 0,41) et c'est pourtant le plus faible des acides halogénés. Dans l'eau, HCl, HBr, HI, HClO₃ et HClO₄ sont tous totalement ionisés (effet nivelant) : leurs pKa négatifs sont des estimations faites dans d'autres solvants, d'où le « ≈ ». Les charges des nuages sont qualitatives, sauf δ des HX, tiré du moment dipolaire.",
  build:function(k, S){
    var c = ceCanvas(k, 0.95, 1.25);
    var st = {t:0, a:0.5, b:0.32, idle:9, cyc:0};
    var cur = {col:"HF", per:"CH4", oxo:"HClO"};
    var mS = k.seg("Comparer", [["col", "Une colonne : HF → HI"], ["per", "Une période : CH₄ → HF"], ["oxo", "Des oxacides : HClO → HClO₄"]], "col", function(){ st.cyc = 0; });
    var segs = {}, segEl = {};
    ["col", "per", "oxo"].forEach(function(m){
      segs[m] = k.seg("Molécule", FA_SERIES[m].map(function(s){ return [s, FA_DATA[s].f]; }), cur[m], function(v){ cur[m] = v; st.cyc = 0; });
      segEl[m] = k.ctrl.lastElementChild;
    });
    var vS = k.seg("Vue", [["anim", "Le H⁺ part et revient"], ["acide", "Acide HA"], ["base", "Base conjuguée A⁻"]], "anim");
    var ros = {}, roEl = {};
    ros.col = k.readouts(["Longueur de la liaison H–X", "Énergie de la liaison H–X", "Charge partielle du H (δ = μ / e·d)", "pKa dans l'eau"]); roEl.col = ros.col.el;
    ros.per = k.readouts(["Électronégativité de l'atome lié à H", "Écart Δχ avec H (χ = 2,20)", "Base conjuguée", "pKa"]); roEl.per = ros.per.el;
    ros.oxo = k.readouts(["O sans H autour du Cl", "Nombre d'oxydation du Cl", "Charge par O dans le conjugué", "pKa dans l'eau"]); roEl.oxo = ros.oxo.el;
    var nt = k.note("", "ok");
    var ticks = [];
    st.onPtr = function(type, p){
      if (type !== "down") return false;
      var best = null, bd = 22;
      ticks.forEach(function(t){ var d = Math.hypot(p.x - t.x, p.y - t.y); if (d < bd || (Math.abs(p.y - t.y) < 11 && p.x > t.x - 12 && p.x < t.x + t.w)){ bd = Math.min(bd, d); best = t; } });
      if (best){ cur[mS.value] = best.k; segs[mS.value].set(best.k); st.cyc = 0; k.redraw(); return true; }
      return false;
    };
    ceDrag(c, st);
    var lp = k.loop(function(dt){
      st.t += dt; st.cyc += dt; st.idle += dt;
      if (!st.drag && st.idle > 2.5) st.a += dt * 0.38;
      k.redraw();
    });
    lp.play();

    /* état de départ du H⁺ (0 : lié, 1 : parti) */
    function leave(key){
      if (vS.value === "acide") return 0;
      if (vS.value === "base") return 1;
      var D = FA_DATA[key], T = 6, u = (st.cyc % T) / T;
      var share = D.solv ? 0 : ceClamp(faAlpha(D.pKa, 0.1), 0.1, 0.8) * 0.55;
      if (share === 0){ return u > 0.3 && u < 0.55 ? -Math.sin((u - 0.3) / 0.25 * PI) : 0; }   /* < 0 : simple étirement */
      if (u < 0.25) return 0;
      if (u < 0.35) return ceSmooth((u - 0.25) / 0.1);
      if (u < 0.35 + share) return 1;
      if (u < 0.45 + share) return 1 - ceSmooth((u - 0.35 - share) / 0.1);
      return 0;
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, mode = mS.value, key = cur[mode], D = FA_DATA[key];
      ["col", "per", "oxo"].forEach(function(m){ ceHide(segEl[m], m === mode); ceHide(roEl[m], m === mode); });
      ctx.clearRect(0, 0, W, H);
      var strip = ph ? 118 : 150, aw = W - strip;
      /* décor : solution aqueuse vue au microscope, molécules d'eau floues en fond */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0d2340"); bg.addColorStop(1, "#173a63");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < 18; i++){
        var wx = ((ceHash(i, 1) * aw + st.t * (6 + 5 * ceHash(i, 3))) % (aw + 40)) - 20, wy = ceHash(i, 2) * H, wr = 4 + 4 * ceHash(i, 4);
        var wa = 0.14 + 0.1 * ceHash(i, 5);
        ceBall(ctx, wx, wy, wr * 1.3, "#c8463c", wa); ceBall(ctx, wx - wr * 1.2, wy + wr * 0.9, wr * 0.8, "#dfe7ef", wa); ceBall(ctx, wx + wr * 1.2, wy + wr * 0.9, wr * 0.8, "#dfe7ef", wa);
      }
      var gl = ctx.createRadialGradient(aw / 2, H * 0.48, 10, aw / 2, H * 0.48, Math.min(aw, H) * 0.6);
      gl.addColorStop(0, "rgba(120,170,230,.22)"); gl.addColorStop(1, "rgba(120,170,230,0)"); ctx.fillStyle = gl; ctx.fillRect(0, 0, aw, H);

      /* molécule */
      var M = faMol(key), f = leave(key), fp = Math.max(0, f), stretch = Math.min(0, f);
      var sc = Math.min(aw, H * 0.92) * 0.56 / FA_SC[mode], cx = aw / 2, cy = H * 0.47;
      function P(p){ var q = ceRot(p, st.a, st.b), s = 1 / (1 - q[2] * 0.06); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2], s:s}; }
      var xa = M.A[M.xA].p, ha = M.A[M.hA].p, dir = vNrm(vSub(ha, xa));
      var hPos = vAdd(ha, vMul(dir, fp * 3.1 - stretch * 0.35));
      var pts = M.A.map(function(a, i){ return P(i === M.hA ? hPos : a.p); });
      ceShadow(ctx, cx, cy + sc * 2.0, sc * 1.6, sc * 0.28, 0.25);
      /* liaisons (sauf celle du H qui part) */
      var bonds = M.B.slice().sort(function(u, v){ return (pts[u[0]].z + pts[u[1]].z) - (pts[v[0]].z + pts[v[1]].z); });
      bonds.forEach(function(bd){
        var isH = bd[1] === M.hA || bd[0] === M.hA, al = isH ? 1 - ceSmooth(fp * 3) : 1;
        if (al <= 0.02) return;
        var p1 = pts[bd[0]], p2 = pts[bd[1]], w = Math.max(4, sc * 0.16);
        if (bd[2] === 2){
          var dx = p2.x - p1.x, dy = p2.y - p1.y, L = Math.hypot(dx, dy) || 1, ox = -dy / L * w * 0.42, oy = dx / L * w * 0.42;
          ceStick(ctx, {x:p1.x + ox, y:p1.y + oy}, {x:p2.x + ox, y:p2.y + oy}, w * 0.7, "#b9c3cf", al);
          ceStick(ctx, {x:p1.x - ox, y:p1.y - oy}, {x:p2.x - ox, y:p2.y - oy}, w * 0.7, "#b9c3cf", al);
        } else ceStick(ctx, p1, p2, w, isH ? ceMix("#b9c3cf", "#ffffff", stretch * -1) : "#b9c3cf", al);
      });
      /* atomes puis nuages, du fond vers l'avant */
      var order = pts.map(function(p, i){ return i; }).sort(function(u, v){ return pts[u].z - pts[v].z; });
      order.forEach(function(i){
        var a = M.A[i], p = pts[i], isH = i === M.hA, rb = (a.e === "H" ? 0.3 : 0.24 + FA_RVDW[a.e] * 0.14) * sc * p.s;
        /* charge : interpolation acide → base conjuguée */
        var q = a.q;
        if (!isH && M.conj[i] != null) q = a.q + (M.conj[i] - a.q) * fp;
        var R = FA_RVDW[a.e] * 0.82;
        if (mode === "col" && !isH && FA_RION[a.e]) R = R + (FA_RION[a.e] * 0.85 - R) * fp;
        var inten = Math.min(1, Math.abs(q) * Math.pow(1.45 / R, 2));
        if (isH){
          if (vS.value === "base") return;
          ceBall(ctx, p.x, p.y, rb * (1 - 0.25 * fp), fp > 0.5 ? "#9cc3ff" : FA_COL.H);
          if (fp < 0.6) ceCloud(ctx, p.x, p.y, R * sc * p.s * 0.85, inten, q < 0, 1 - fp);
          if (fp > 0.35) ceTag(ctx, "H⁺ → eau", p.x, ceClamp(p.y - rb - 14, 14, H - 14), {clampW:aw, size:ph ? 10 : 11, bg:"rgba(47,111,224,.92)", color:"#fff", alpha:Math.min(1, (fp - 0.35) * 3)});
        } else {
          ceBall(ctx, p.x, p.y, rb, FA_COL[a.e]);
          ceCloud(ctx, p.x, p.y, R * sc * p.s, inten, q < 0);
          if (rb > 11) ceText(ctx, a.e, p.x, p.y + 1, {size:Math.min(15, rb * 0.7), color:a.e === "H" ? "#334155" : "#fff", w:800, halo:"rgba(0,0,0,.25)", hw:2});
        }
      });
      /* charges partagées dans l'ion oxygéné */
      if (mode === "oxo" && fp > 0.6){
        var share = M.conj.share;
        Object.keys(M.conj).forEach(function(ix){
          if (ix === "share") return;
          var p = pts[+ix], lab = share === 1 ? "−1" : "−1/" + share;
          ceTag(ctx, lab, p.x + sc * 0.42, p.y - sc * 0.42, {size:ph ? 10 : 11.5, bg:"rgba(224,51,43,.92)", color:"#fff", alpha:Math.min(1, (fp - 0.6) * 3)});
        });
      }
      if (mode !== "oxo" && fp > 0.6){
        var px = pts[M.xA];
        ceTag(ctx, mode === "col" ? D.b + " : r = " + ceFmt(FA_RION[D.x] * 100, 0) + " pm" : D.b + " : charge sur " + D.x + " (χ = " + ceFmt(FA_CHI[D.x], 2) + ")", ceClamp(px.x, 70, aw - 70), Math.min(H - 52, px.y + sc * 1.25), {size:ph ? 10 : 11.5, bg:"rgba(224,51,43,.92)", color:"#fff", alpha:Math.min(1, (fp - 0.6) * 3), clampW:aw});
      }
      /* en-tête : nom et équation */
      ceTag(ctx, D.f + " · " + D.nom, 10, 20, {align:"left", size:ph ? 11 : 13, bg:"rgba(255,255,255,.95)", clampW:aw});
      var eq = D.f + " + H₂O ⇌ " + D.b + " + H₃O⁺";
      ceTag(ctx, eq, aw / 2, H - 20, {size:ph ? 10.5 : 12, bg:"rgba(15,27,45,.85)", color:"#fff", clampW:aw});
      /* légende des couleurs */
      var ly = 44, lx = 12;
      ceCloud(ctx, lx + 6, ly, 7, 0.9, true); ceText(ctx, "riche en e⁻", lx + 17, ly, {align:"left", size:ph ? 9.5 : 10.5, color:"#ffd2cc", w:700});
      ceCloud(ctx, lx + 6, ly + 18, 7, 0.9, false); ceText(ctx, "pauvre en e⁻", lx + 17, ly + 18, {align:"left", size:ph ? 9.5 : 10.5, color:"#cfe0ff", w:700});

      /* ---------- échelle des pKa (acides forts en bas) ---------- */
      var sx0 = aw + 6, sy0 = 12;
      ctx.save(); ceRR(ctx, sx0, sy0, strip - 12, H - 24, 12); ctx.fillStyle = "rgba(245,248,252,.96)"; ctx.fill(); ctx.restore();
      var rg = FA_RANGE[mode], yT = sy0 + 34, yB = H - 40, xL = sx0 + (ph ? 26 : 32);
      function Y(v){ return yB - (v - rg[0]) / (rg[1] - rg[0]) * (yB - yT); }
      ceText(ctx, "pKa", xL, sy0 + 15, {size:ph ? 11 : 12.5, w:800, color:"#334155"});
      var gr = ctx.createLinearGradient(0, yT, 0, yB); gr.addColorStop(0, "#3f7fe0"); gr.addColorStop(1, "#e2643a");
      ctx.save(); ctx.strokeStyle = gr; ctx.lineCap = "round"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(xL, yT); ctx.lineTo(xL, yB); ctx.stroke(); ctx.restore();
      var step = mode === "per" ? 10 : 5;
      for (var v = Math.ceil(rg[0] / step) * step; v <= rg[1]; v += step){
        var yy = Y(v); ctx.fillStyle = "#94a3b8"; ctx.fillRect(xL - 9, yy - 0.5, 5, 1);
        ceText(ctx, ceFmt(v, 0), xL - 11, yy, {align:"right", size:ph ? 8.5 : 9.5, color:"#64748b", w:600});
      }
      /* repère H₃O⁺ : pKa 0 */
      var y0 = Y(0);
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#0f766e"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(xL - 6, y0); ctx.lineTo(sx0 + strip - 18, y0); ctx.stroke(); ctx.restore();
      ceText(ctx, "H₃O⁺", sx0 + strip - 18, y0 - 7, {align:"right", size:ph ? 8.5 : 9.5, color:"#0f766e", w:800});
      ticks = [];
      FA_SERIES[mode].forEach(function(s){
        var DD = FA_DATA[s], yy = Y(DD.pKa), on = s === key, lab = DD.f + "  " + faPk(s);
        if (on) ceBall(ctx, xL, yy, 7.5, "#f59e0b"); else ceBall(ctx, xL, yy, 5, "#475569");
        var fs = ph ? (on ? 10 : 9) : (on ? 11.5 : 10.5), tw = ceTw(ctx, lab, fs, on ? 800 : 700);
        ceText(ctx, lab, xL + 12, yy, {align:"left", size:fs, w:on ? 800 : 700, color:on ? "#9a3412" : "#334155"});
        ticks.push({k:s, x:xL, y:yy, w:tw + 16});
      });
      ceText(ctx, "acides plus forts ↓", sx0 + (strip - 12) / 2, H - 22, {size:ph ? 8.5 : 9.5, color:"#9a3412", w:800});

      /* ---------- afficheurs et note ---------- */
      var r = ros[mode];
      if (mode === "col"){
        var dl = faDelta(key);
        r.set(0, ceFmt(D.d, 1) + " pm"); r.set(1, ceFmt(D.D, 0) + " kJ/mol"); r.set(2, "δ = " + ceFmt(dl, 2) + " e"); r.set(3, faPk(key));
        var dens = Math.pow(FA_RION.F / FA_RION[D.x], 2);
        nt.set("Liaison " + D.f + " : " + ceFmt(D.d, 1) + " pm et " + ceFmt(D.D, 0) + " kJ/mol. Le H porte δ = μ/(e·d) = " + ceFmt(D.mu, 2) + " × 3,336·10⁻³⁰ / (1,602·10⁻¹⁹ × " + ceFmt(D.d, 1) + "·10⁻¹²) = <b>" + ceFmt(dl, 2) + "</b>. " +
          "L'ion " + D.b + " a un rayon de " + ceFmt(FA_RION[D.x] * 100, 0) + " pm : sa charge est " + (D.x === "F" ? "la plus concentrée de la série." : "étalée, densité (133/" + ceFmt(FA_RION[D.x] * 100, 0) + ")² = " + ceFmt(dens, 2) + " fois celle de F⁻.") +
          " Ionisé à 0,1 mol/L : <b>" + faAlphaTxt(key) + "</b>. " + (key === "HF" ? "HF a le H le plus positif, mais la liaison la plus solide et l'ion le plus petit : c'est l'acide le plus faible de la colonne." : "Plus bas dans la colonne, la liaison est plus longue et plus faible : l'acide est plus fort, même si le H est moins positif."), key === "HF" ? "warn" : "ok");
      } else if (mode === "per"){
        var chi = FA_CHI[D.x];
        r.set(0, "χ(" + D.x + ") = " + ceFmt(chi, 2)); r.set(1, "Δχ = " + ceFmt(chi - FA_CHI.H, 2)); r.set(2, D.b); r.set(3, faPk(key));
        nt.set("Sur une période, les atomes ont presque la même taille : c'est l'électronégativité qui décide. " + D.x + " (χ = " + ceFmt(chi, 2) + ", Δχ = " + ceFmt(chi, 2) + " − 2,20 = " + ceFmt(chi - 2.2, 2) + ") garde " + (chi > 3.3 ? "bien" : "mal") + " la charge négative de " + D.b + ". " +
          (D.solv === "non" ? D.f + " (pKa " + faPk(key) + ") ne cède pratiquement pas de H⁺ à l'eau : son pKa est mesuré dans d'autres solvants." : D.solv === "eau" ? "H₂O (pKa 14) est le solvant lui-même : l'autoprotolyse donne [H₃O⁺] = 10⁻⁷ mol/L à 25 °C." : "HF (pKa 3,17) : ionisé à <b>" + faAlphaTxt(key) + "</b> à 0,1 mol/L, c'est un acide faible."), "ok");
      } else {
        var share2 = D.nO + 1;
        r.set(0, String(D.nO)); r.set(1, "+" + D.no); r.set(2, share2 === 1 ? "−1 (un seul O)" : "−1/" + share2); r.set(3, faPk(key));
        nt.set(D.f + " : " + D.nO + " O sans H, Cl au nombre d'oxydation +" + D.no + ". Dans " + D.b + ", la charge −1 " + (share2 === 1 ? "reste concentrée sur un seul O." : "se répartit sur " + share2 + " O (formes limites) : −1/" + share2 + " chacun.") +
          " Ionisé à 0,1 mol/L : <b>" + faAlphaTxt(key) + "</b>" + (D.approx ? " (acide fort, nivelé par l'eau)." : " (α = (−Ka + √(Ka² + 4·Ka·C)) / 2C, Ka = 10^−" + ceFmt(D.pKa, 2) + ")."), "ok");
      }
    });
  }
});

/* =====================================================================
   2. Le tampon bicarbonate : le sang et les poumons (L13)
   ===================================================================== */
var TS_PK = 6.1, TS_S = 0.03, TS_B0 = 24, TS_P0 = 40;   /* pKa apparent, solubilité du CO₂ (mmol·L⁻¹·mmHg⁻¹), valeurs normales */
/* état du sang : V = ventilation (× normale), a = acide ajouté (mmol/L), ouvert ou fermé, compensation respiratoire */
function tsState(V, a, open, comp){
  var B = TS_B0 - a, P, C;
  if (open){ P = comp ? TS_P0 - 1.2 * a : TS_P0 / V; C = TS_S * P; }
  else { C = TS_S * TS_P0 / V + a; P = C / TS_S; }
  return {B:B, P:P, C:C, pH:TS_PK + Math.log10(B / C), V:open && comp ? TS_P0 / P : V};
}
/* buste dessiné en unités u, (X, Y) = milieu de la poitrine */
function tsPerson(ctx, X, Y, u, br, beat, effort, closed, t){
  function x(v){ return X + v * u; } function y(v){ return Y + v * u; }
  var ex = 1 + 0.035 * br;
  /* bras (derrière le tronc) */
  [-1, 1].forEach(function(s){
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    var g = ctx.createLinearGradient(x(s * 1.7), 0, x(s * 2.4), 0); g.addColorStop(0, "#d99b78"); g.addColorStop(0.5, "#f0c3a3"); g.addColorStop(1, "#c98a68");
    ctx.strokeStyle = g; ctx.lineWidth = u * 0.62;
    ctx.beginPath(); ctx.moveTo(x(s * 1.78 * ex), y(-1.75)); ctx.quadraticCurveTo(x(s * 2.2), y(-0.6), x(s * 2.05), y(0.6)); ctx.lineTo(x(s * 1.95), y(2.4)); ctx.stroke();
    ctx.restore();
  });
  /* muscle du bras droit (à gauche de l'écran) : rougit à l'effort */
  ctx.save(); var bx = x(-2.08), by = y(-0.35);
  var gm = ctx.createRadialGradient(bx - u * 0.1, by - u * 0.1, 2, bx, by, u * 0.55);
  gm.addColorStop(0, effort > 0 ? "rgba(255,120,80," + (0.35 + 0.4 * effort) + ")" : "rgba(214,110,110,.35)"); gm.addColorStop(1, "rgba(214,110,110,0)");
  ctx.fillStyle = gm; ctx.beginPath(); ctx.ellipse(bx, by, u * 0.36, u * 0.62, -0.15, 0, 7); ctx.fill(); ctx.restore();
  /* tronc */
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x(-0.42), y(-2.3)); ctx.quadraticCurveTo(x(-1.2), y(-2.15), x(-1.85 * ex), y(-1.85));
  ctx.quadraticCurveTo(x(-2.05 * ex), y(-1.3), x(-1.78 * ex), y(-0.6)); ctx.lineTo(x(-1.6 * ex), y(2.6)); ctx.lineTo(x(1.6 * ex), y(2.6));
  ctx.lineTo(x(1.78 * ex), y(-0.6)); ctx.quadraticCurveTo(x(2.05 * ex), y(-1.3), x(1.85 * ex), y(-1.85)); ctx.quadraticCurveTo(x(1.2), y(-2.15), x(0.42), y(-2.3)); ctx.closePath();
  var gt = ctx.createLinearGradient(x(-1.9), 0, x(1.9), 0); gt.addColorStop(0, "#d4926f"); gt.addColorStop(0.45, "#f2c9aa"); gt.addColorStop(1, "#c98665");
  ctx.fillStyle = gt; ctx.fill(); ctx.clip();
  /* poumons (dessinés sous la peau) */
  [-1, 1].forEach(function(s){
    ctx.save(); ctx.translate(x(s * 0.3), y(-1.55)); ctx.scale(1 + 0.05 * br, 1 + 0.085 * br); ctx.translate(-x(s * 0.3), -y(-1.55));
    ctx.beginPath(); ctx.moveTo(x(s * 0.36), y(-1.55)); ctx.bezierCurveTo(x(s * 0.95), y(-1.8), x(s * 1.6), y(-0.8), x(s * 1.62), y(0.4));
    ctx.bezierCurveTo(x(s * 1.64), y(1.1), x(s * 1.3), y(1.32), x(s * 0.95), y(1.2));
    ctx.bezierCurveTo(x(s * (s > 0 ? 0.75 : 0.6)), y(1.05), x(s * (s > 0 ? 0.7 : 0.35)), y(0.9), x(s * (s > 0 ? 0.62 : 0.3)), y(0.45));
    ctx.bezierCurveTo(x(s * 0.42), y(-0.2), x(s * 0.3), y(-1.0), x(s * 0.36), y(-1.55)); ctx.closePath();
    var gl = ctx.createRadialGradient(x(s * 1.0), y(-0.3), u * 0.2, x(s * 1.0), y(0), u * 1.7);
    gl.addColorStop(0, "rgba(250,182,186,.95)"); gl.addColorStop(1, "rgba(206,96,118,.95)");
    ctx.fillStyle = gl; ctx.fill(); ctx.strokeStyle = "rgba(150,50,70,.55)"; ctx.lineWidth = 1.4; ctx.stroke();
    /* arbre bronchique */
    ctx.strokeStyle = "rgba(255,240,240,.75)"; ctx.lineCap = "round";
    function br2(x0, y0, ang, L, d){
      if (d > 3) return; var x1 = x0 + Math.cos(ang) * L, y1 = y0 + Math.sin(ang) * L;
      ctx.lineWidth = Math.max(0.8, (4 - d) * u * 0.035); ctx.beginPath(); ctx.moveTo(x(x0), y(y0)); ctx.lineTo(x(x1), y(y1)); ctx.stroke();
      br2(x1, y1, ang - 0.45, L * 0.66, d + 1); br2(x1, y1, ang + 0.45, L * 0.66, d + 1);
    }
    br2(s * 0.5, -0.85, s > 0 ? 0.75 : PI - 0.75, 0.55, 0);
    ctx.restore();
  });
  /* trachée et bronches souches */
  ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#f4ece6"; ctx.lineWidth = u * 0.22;
  ctx.beginPath(); ctx.moveTo(x(0), y(-2.6)); ctx.lineTo(x(0), y(-1.3)); ctx.lineTo(x(-0.5), y(-0.85)); ctx.moveTo(x(0), y(-1.3)); ctx.lineTo(x(0.5), y(-0.85)); ctx.stroke();
  ctx.strokeStyle = "rgba(170,150,140,.7)"; ctx.lineWidth = 1;
  for (var r = 0; r < 6; r++){ var yy = y(-2.5 + r * 0.2); ctx.beginPath(); ctx.moveTo(x(-0.1), yy); ctx.lineTo(x(0.1), yy); ctx.stroke(); }
  ctx.restore();
  /* cœur */
  var hs = 1 + 0.06 * beat, hx = x(0.32), hy = y(0.55);
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.5); ctx.scale(hs * u * 0.5, hs * u * 0.5);
  ctx.beginPath(); ctx.moveTo(0, 0.9); ctx.bezierCurveTo(-1.2, 0.1, -0.9, -0.95, 0, -0.45); ctx.bezierCurveTo(0.9, -0.95, 1.2, 0.1, 0, 0.9); ctx.closePath();
  var gh = ctx.createRadialGradient(-0.3, -0.3, 0.05, 0, 0, 1.1); gh.addColorStop(0, "#ff7a6e"); gh.addColorStop(1, "#9b1c22");
  ctx.fillStyle = gh; ctx.fill(); ctx.restore();
  /* artère vers le bras droit */
  ctx.save(); ctx.strokeStyle = "rgba(200,30,40,.8)"; ctx.lineWidth = Math.max(2, u * 0.07); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(hx - u * 0.1, hy - u * 0.35); ctx.quadraticCurveTo(x(-0.2), y(-1.7), x(-1.2), y(-1.75)); ctx.quadraticCurveTo(x(-1.95), y(-1.6), x(-2.05), y(-0.6)); ctx.stroke(); ctx.restore();
  /* diaphragme */
  ctx.save(); ctx.strokeStyle = "rgba(160,60,70,.7)"; ctx.lineWidth = Math.max(2, u * 0.06);
  ctx.beginPath(); ctx.moveTo(x(-1.75), y(1.45 + 0.12 * br)); ctx.quadraticCurveTo(x(0), y(0.95 + 0.14 * br), x(1.75), y(1.45 + 0.12 * br)); ctx.stroke(); ctx.restore();
  /* voile de peau par-dessus (organes « sous » la peau) */
  ctx.fillStyle = "rgba(242,201,170,.18)"; ctx.fillRect(x(-2.2), y(-2.4), u * 4.4, u * 5.2);
  ctx.restore();
  /* cou et tête */
  var gn = ctx.createLinearGradient(x(-0.35), 0, x(0.35), 0); gn.addColorStop(0, "#d18d6a"); gn.addColorStop(0.5, "#efc2a2"); gn.addColorStop(1, "#c98665");
  ctx.fillStyle = gn; ceRR(ctx, x(-0.33), y(-2.85), u * 0.66, u * 0.65, u * 0.1); ctx.fill();
  var hg = ctx.createRadialGradient(x(-0.2), y(-3.55), u * 0.1, x(0), y(-3.35), u * 0.9);
  hg.addColorStop(0, "#ffe1cb"); hg.addColorStop(1, "#d39371");
  ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(x(0), y(-3.35), u * 0.62, u * 0.76, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#3b2618"; ctx.beginPath(); ctx.ellipse(x(0), y(-3.5), u * 0.67, u * 0.68, 0, PI * 1.02, PI * 1.98); ctx.quadraticCurveTo(x(0.25), y(-3.72), x(-0.05), y(-3.68)); ctx.quadraticCurveTo(x(-0.4), y(-3.62), x(-0.66), y(-3.4)); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#1c2430"; ctx.beginPath(); ctx.arc(x(-0.22), y(-3.38), u * 0.055, 0, 7); ctx.arc(x(0.22), y(-3.38), u * 0.055, 0, 7); ctx.fill();
  /* bouche : ouverte à l'expiration */
  var mo = closed ? 0.02 : Math.max(0.02, -br * 0.09);
  ctx.fillStyle = "#7a2f2a"; ctx.beginPath(); ctx.ellipse(x(0), y(-2.98), u * 0.14, u * mo + 1, 0, 0, 7); ctx.fill();
  /* sueur à l'effort */
  if (effort > 0.05){ for (var d = 0; d < 3; d++){ var ph = (t * 0.6 + d * 0.33) % 1, sx = x(d === 0 ? -0.55 : d === 1 ? 0.5 : 0.62), sy = y(-3.6 + ph * 0.6); ctx.save(); ctx.globalAlpha = effort * (1 - ph); ctx.fillStyle = "#7cc4f2"; ctx.beginPath(); ctx.ellipse(sx, sy, u * 0.05, u * 0.08, 0, 0, 7); ctx.fill(); ctx.restore(); } }
  /* pince sur la trachée en système fermé */
  if (closed){
    ctx.save(); ctx.fillStyle = "#64748b"; ceRR(ctx, x(-0.42), y(-2.42), u * 0.84, u * 0.16, 3); ctx.fill(); ctx.fillStyle = "#94a3b8"; ceRR(ctx, x(-0.42), y(-2.44), u * 0.84, u * 0.06, 2); ctx.fill(); ctx.restore();
  }
}
function tsCO2(ctx, x, y, r, a){
  ceBall(ctx, x - r * 1.25, y, r * 0.9, "#d6392f", a); ceBall(ctx, x + r * 1.25, y, r * 0.9, "#d6392f", a); ceBall(ctx, x, y, r, "#3c4656", a);
}
function tsIon(ctx, x, y, r, col, lab, a){
  ceBall(ctx, x, y, r, col, a);
  if (lab && r > 4.5){ ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.round(Math.max(8, r * 1.15)) + "px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(lab, x, y + 0.5); ctx.restore(); }
}

SFA.sim({
  id:"ch-tampon-sang", ch:"L13", tag:"Tampons",
  titre:"Le tampon bicarbonate : le sang et les poumons",
  resume:"Un buste qui respire : les poumons chassent le CO₂ du sang, et le pH sanguin suit Henderson-Hasselbalch, pH = 6,1 + log([HCO₃⁻] / (0,03 × pCO₂)). Règle la ventilation, ajoute de l'acide lactique comme à l'effort, et compare le système ouvert (avec poumons) au système fermé.",
  but:"Hypoventile puis hyperventile : la pCO₂ monte ou baisse et le pH suit. Ajoute une charge acide (lactate) : HCO₃⁻ est consommé. Passe en système fermé pour voir ce que deviendrait le même tampon si le CO₂ ne pouvait pas sortir. Glisse le viseur entre le poumon et le muscle du bras pour voir ce qui se passe au niveau des capillaires.",
  aRetenir:"Le couple CO₂/HCO₃⁻ (pKa apparent 6,1 à 37 °C) tamponne le sang : pH = 6,1 + log([HCO₃⁻] / (0,03 × pCO₂)), avec pCO₂ en mmHg. Valeurs normales : [HCO₃⁻] = 24 mmol/L, pCO₂ = 40 mmHg, d'où un rapport 24/1,2 = 20 et un pH de 7,40 (normal : 7,35 à 7,45). Ce tampon est efficace malgré un pKa éloigné de 7,4 parce que le système est ouvert : les poumons évacuent le CO₂ formé et règlent la pCO₂ en quelques minutes, les reins règlent HCO₃⁻ en quelques jours.",
  piege:"Hypoventiler n'ajoute aucun acide, mais retient le CO₂ : c'est une acidose respiratoire. Un H⁺ ajouté consomme un HCO₃⁻ et forme un CO₂ ; en système fermé ce CO₂ reste et fait chuter le pH (10 mmol/L d'acide : pH 6,20), alors qu'en système ouvert il est expiré (pH 7,17). Le modèle garde [HCO₃⁻] fixé par l'acide ajouté : la petite variation de HCO₃⁻ due à la pCO₂ et la réponse des reins ne sont pas représentées. La compensation suit la règle clinique pCO₂ ≈ 40 − 1,2 × (baisse de HCO₃⁻).",
  build:function(k, S){
    var c = ceCanvas(k, 0.98, 1.72);
    var st = {t:0, br:0, brp:0, ring:null, drag:false, puffs:[]};
    var sysS = k.seg("Système", [["ouvert", "Ouvert : les poumons expirent le CO₂"], ["ferme", "Fermé : le CO₂ reste"]], "ouvert");
    var vS = k.slider("Ventilation", 0.5, 2, 0.05, 1, "× normale", function(){ cT.set(false); });
    var vEl = k.ctrl.lastElementChild;
    var aS = k.slider("Charge acide (acide lactique à l'effort)", 0, 12, 0.5, 0, "mmol/L");
    var cT = k.toggle("Les poumons compensent (hyperventilation)", false), cEl = k.ctrl.lastElementChild;
    var ro = k.readouts(["pCO₂ du sang artériel", "[HCO₃⁻] du plasma", "CO₂ dissous (0,03 × pCO₂)", "pH du sang"]);
    var nt = k.note("", "ok");
    var anchors = {};
    c.pointer(function(type, p){
      var R = st.ring;
      if (type === "down" && R && Math.hypot(p.x - R.x, p.y - R.y) < R.r + 14){ st.drag = true; }
      if (type === "drag" && st.drag && R){ R.x = p.x; R.y = p.y; R.free = true; }
      if (type === "up" && st.drag){
        st.drag = false;
        var best = null, bd = 1e9; Object.keys(anchors).forEach(function(kk){ var A = anchors[kk], d = Math.hypot(A.x - R.x, A.y - R.y); if (d < bd){ bd = d; best = kk; } });
        if (best && bd < R.r * 2.6){ st.at = best; R.free = false; } else st.at = null;
      }
      if (type === "move") c.cv.style.cursor = R && Math.hypot(p.x - R.x, p.y - R.y) < R.r + 14 ? "move" : "default";
    });
    st.at = "poumon";
    var lp = k.loop(function(dt){
      st.t += dt;
      var open = sysS.value === "ouvert", S0 = tsState(vS.value, aS.value, open, cT.value);
      if (open && cT.value && Math.abs(vS.value - S0.V) > 0.004) vS.set(Math.round(S0.V * 100) / 100);
      var f = 0.22 * Math.sqrt(S0.V);
      if (open){ st.brp += dt * 2 * PI * f; st.br = Math.sin(st.brp); }
      else st.br += (0.6 - st.br) * Math.min(1, dt * 2);
      /* bouffées expirées : nombre de CO₂ ∝ pCO₂ (la fraction de CO₂ de l'air expiré) */
      if (open && Math.cos(st.brp) < 0 && !st.exh){ st.exh = true; st.puffs.push({t:0, n:Math.max(1, Math.round(S0.P / 40 * 3))}); }
      if (Math.cos(st.brp) > 0) st.exh = false;
      st.puffs.forEach(function(q){ q.t += dt; }); st.puffs = st.puffs.filter(function(q){ return q.t < 2.6; });
      k.redraw();
    });
    lp.play();

    function zoomLung(ctx, zx, zy, r, S, open, t){
      var g1 = ctx.createLinearGradient(zx - r, 0, zx, 0); g1.addColorStop(0, "#dff1fb"); g1.addColorStop(1, "#c4e3f5");
      ctx.fillStyle = g1; ctx.fillRect(zx - r, zy - r, r, 2 * r);
      var g2 = ctx.createLinearGradient(zx, 0, zx + r, 0); g2.addColorStop(0, "#f9d9cf"); g2.addColorStop(1, "#f2b9ad");
      ctx.fillStyle = g2; ctx.fillRect(zx, zy - r, r, 2 * r);
      /* globules rouges qui descendent */
      for (var i = 0; i < 4; i++){ var yy = zy - r + ((t * 0.35 * r + i * 0.55 * r) % (2.2 * r)) - 0.1 * r, xx = zx + r * (0.5 + 0.18 * Math.sin(i * 2.1));
        ctx.save(); ctx.translate(xx, yy); ctx.rotate(0.4 + i); var gr = ctx.createRadialGradient(0, 0, r * 0.03, 0, 0, r * 0.17); gr.addColorStop(0, "#b3202a"); gr.addColorStop(0.55, "#e2474c"); gr.addColorStop(1, "#a51d26");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.17, r * 0.11, 0, 0, 7); ctx.fill(); ctx.restore(); }
      /* membrane alvéolo-capillaire */
      ctx.save(); ctx.fillStyle = open ? "#e9a3b4" : "#7c8796"; ctx.beginPath();
      for (var j = 0; j <= 20; j++){ var yy2 = zy - r + j / 20 * 2 * r, xx2 = zx - r * 0.04 + Math.sin(j * 0.9 + t) * r * 0.012; j ? ctx.lineTo(xx2, yy2) : ctx.moveTo(xx2, yy2); }
      for (var j2 = 20; j2 >= 0; j2--){ var yy3 = zy - r + j2 / 20 * 2 * r, xx3 = zx + r * 0.05 + Math.sin(j2 * 0.9 + t) * r * 0.012; ctx.lineTo(xx3, yy3); }
      ctx.closePath(); ctx.fill(); ctx.restore();
      /* HCO₃⁻ dans le plasma (un rond pour 2 mmol/L) */
      var nB = Math.round(S.B / 1.5), rr = Math.max(3.5, r * 0.055);
      for (var b = 0; b < nB; b++){ var bx = zx + r * (0.15 + 0.75 * ceHash(b, 1)), by = zy - r + ((ceHash(b, 2) * 2 * r + t * r * 0.22) % (2 * r)); tsIon(ctx, bx, by, rr, "#3d7fe0", "−"); }
      /* CO₂ : du sang vers l'air (ouvert) ou rebond sur la membrane (fermé) */
      var nC = ceClamp(Math.round(S.C / 0.6), 1, 18);
      for (var m = 0; m < nC; m++){
        var phs = (t / 3.4 + ceHash(m, 3)) % 1, yy4 = zy - r * 0.8 + r * 1.6 * ceHash(m, 4), xx4;
        if (open) xx4 = zx + r * (0.85 - 1.75 * phs); else xx4 = zx + r * (0.55 + 0.38 * Math.cos(phs * 2 * PI));
        var al = open ? (phs > 0.85 ? (1 - phs) / 0.15 : 1) : 1;
        tsCO2(ctx, xx4, yy4 + Math.sin(t * 2 + m) * r * 0.02, Math.max(3, r * 0.045), al);
      }
      ceText(ctx, "alvéole (air)", zx - r * 0.42, zy - r * 0.45, {size:Math.max(9, r * 0.075), color:"#1e5a85", w:800, halo:"rgba(255,255,255,.8)"});
      ceText(ctx, "capillaire (sang)", zx + r * 0.42, zy - r * 0.45, {size:Math.max(9, r * 0.075), color:"#8a1f2a", w:800, halo:"rgba(255,255,255,.8)"});
      if (!open) ceTag(ctx, "échange bloqué", zx, zy + r * 0.55, {size:Math.max(9, r * 0.09), bg:"#334155", color:"#fff"});
    }
    function zoomMuscle(ctx, zx, zy, r, S, a, t){
      var g1 = ctx.createLinearGradient(zx - r, 0, zx, 0); g1.addColorStop(0, "#b8333a"); g1.addColorStop(1, "#d65a5a");
      ctx.fillStyle = g1; ctx.fillRect(zx - r, zy - r, r * 0.9, 2 * r);
      ctx.strokeStyle = "rgba(255,210,210,.45)"; ctx.lineWidth = 2;
      for (var s = 0; s < 14; s++){ var xs = zx - r + s * r * 0.065; ctx.beginPath(); ctx.moveTo(xs, zy - r); ctx.lineTo(xs, zy + r); ctx.stroke(); }
      var g2 = ctx.createLinearGradient(zx - r * 0.1, 0, zx + r, 0); g2.addColorStop(0, "#f9e1d6"); g2.addColorStop(1, "#f2b9ad");
      ctx.fillStyle = g2; ctx.fillRect(zx - r * 0.1, zy - r, r * 1.1, 2 * r);
      ctx.fillStyle = "#e9a3b4"; ctx.fillRect(zx - r * 0.12, zy - r, r * 0.05, 2 * r);
      var nB = Math.round(S.B / 1.5), rr = Math.max(3.5, r * 0.055);
      for (var b = 0; b < nB; b++){ var bx = zx + r * (0.25 + 0.65 * ceHash(b, 5)), by = zy - r + ((ceHash(b, 6) * 2 * r + t * r * 0.25) % (2 * r)); tsIon(ctx, bx, by, rr, "#3d7fe0", "−"); }
      var nH = a > 0 ? Math.max(1, Math.round(a / 2)) : 0;
      for (var h = 0; h < nH; h++){
        var phs = (t / 3 + h / Math.max(1, nH)) % 1, y0 = zy - r * 0.7 + r * 1.4 * ((h + 0.5) / nH), xm = zx + r * 0.35;
        if (phs < 0.4){ var u = ceSmooth(phs / 0.4); tsIon(ctx, zx - r * 0.55 + u * (xm - zx + r * 0.55 - rr * 1.5), y0, rr * 0.75, "#f5b60b", "+"); tsIon(ctx, zx - r * 0.6 + u * r * 0.25, y0 + r * 0.14, rr * 0.9, "#2fa36b", "−"); tsIon(ctx, xm + rr * 1.2, y0, rr, "#3d7fe0", "−"); }
        else if (phs < 0.55){ var w2 = (phs - 0.4) / 0.15; tsIon(ctx, xm, y0, rr * (1 + 0.3 * Math.sin(w2 * PI)), "#7b8fd6", ""); }
        else { var v = (phs - 0.55) / 0.45; tsCO2(ctx, xm + v * r * 0.2, y0 + v * r * 0.5, Math.max(3, r * 0.045), 1 - v * 0.8); }
      }
      if (!nH){ for (var m = 0; m < 3; m++){ var p2 = (t / 3.5 + m / 3) % 1; tsCO2(ctx, zx - r * 0.6 + p2 * r * 1.3, zy - r * 0.5 + m * r * 0.5, Math.max(3, r * 0.045), p2 > 0.85 ? (1 - p2) / 0.15 : 1); } }
      ceText(ctx, "fibre musculaire", zx - r * 0.45, zy - r * 0.45, {size:Math.max(9, r * 0.075), color:"#fff", w:800, halo:"rgba(120,20,30,.7)"});
      ceText(ctx, "capillaire (sang)", zx + r * 0.42, zy - r * 0.45, {size:Math.max(9, r * 0.075), color:"#8a1f2a", w:800, halo:"rgba(255,255,255,.8)"});
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, open = sysS.value === "ouvert";
      ceHide(cEl, open); ceHide(vEl, true);
      var S0 = tsState(vS.value, aS.value, open, cT.value), a = aS.value;
      ctx.clearRect(0, 0, W, H);
      var gh = ph ? 66 : 62, Hs = H - gh;
      /* décor : salle d'examen */
      var bg = ctx.createLinearGradient(0, 0, 0, Hs); bg.addColorStop(0, "#e6f0f3"); bg.addColorStop(1, "#cfdde3");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, Hs);
      ctx.fillStyle = "rgba(255,255,255,.35)"; for (var i = 0; i < W; i += 46) ctx.fillRect(i, 0, 2, Hs);
      /* placement */
      var X, Y, u, zx, zy, zr;
      if (ph){ u = Math.min(Hs * 0.5 / 6.15, W * 0.42 / 2.75); X = W * 0.5; Y = 8 + 4.15 * u; var top0 = Y + 2.0 * u + 12; zr = Math.max(40, Math.min(W * 0.3, (Hs - 56 - top0) / 2)); zx = W * 0.5; zy = top0 + zr; }
      else { zr = Math.min(W * 0.21, Hs * 0.33); zx = W - zr - 22; zy = Hs * 0.42; u = Math.min((Hs - 8) / 6.15, (zx - zr - 10) / 5.1); X = 2.55 * u + 2; Y = Hs - 2.0 * u; }
      var beat = Math.max(0, Math.sin(st.t * 2 * PI * (1.1 + 0.6 * Math.min(1, a / 8))));
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, Y + 2.0 * u); ctx.clip();
      tsPerson(ctx, X, Y, u, open ? st.br : 0.6, beat, Math.min(1, a / 8), !open, st.t);
      ctx.restore();
      var fade = ctx.createLinearGradient(0, Y + 1.45 * u, 0, Y + 2.0 * u); fade.addColorStop(0, "rgba(207,221,227,0)"); fade.addColorStop(1, "rgba(207,221,227,1)");
      ctx.fillStyle = fade; ctx.fillRect(0, Y + 1.45 * u, W, 0.56 * u);
      /* bouffées de CO₂ expiré */
      st.puffs.forEach(function(q){
        var f = q.t / 2.6, mx = X + u * (0.3 + 1.2 * f), my = Y - u * (2.95 + 0.5 * f);
        ctx.save(); ctx.globalAlpha = 0.55 * (1 - f); ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.ellipse(mx, my, u * (0.35 + 0.6 * f), u * (0.25 + 0.35 * f), 0, 0, 7); ctx.fill(); ctx.restore();
        for (var j = 0; j < q.n; j++) tsCO2(ctx, mx + (j - (q.n - 1) / 2) * u * 0.3, my + Math.sin(j * 2 + q.t * 3) * u * 0.1, Math.max(2.6, u * 0.06), 1 - f);
      });
      if (!open) ceTag(ctx, "voies aériennes fermées", X, Y - u * 1.95, {size:ph ? 9.5 : 10.5, bg:"#334155", color:"#fff", clampW:W});
      /* viseur sur le corps */
      anchors = {poumon:{x:X - u * 1.0, y:Y + u * 0.05}, muscle:{x:X - u * 2.08, y:Y - u * 0.35}};
      var rr = Math.max(13, u * 0.42);
      if (!st.ring) st.ring = {x:anchors.poumon.x, y:anchors.poumon.y, r:rr};
      st.ring.r = rr;
      if (!st.drag && st.at){ var A = anchors[st.at]; st.ring.x += (A.x - st.ring.x) * 0.3; st.ring.y += (A.y - st.ring.y) * 0.3; }
      st.ring.x = ceClamp(st.ring.x, rr, W - rr); st.ring.y = ceClamp(st.ring.y, rr, Hs - rr);
      var R = st.ring;
      /* cône vers la loupe */
      var ang = Math.atan2(zy - R.y, zx - R.x), n1 = ang + PI / 2;
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.08)"; ctx.beginPath();
      ctx.moveTo(R.x + Math.cos(n1) * R.r, R.y + Math.sin(n1) * R.r); ctx.lineTo(zx + Math.cos(n1) * zr, zy + Math.sin(n1) * zr);
      ctx.lineTo(zx - Math.cos(n1) * zr, zy - Math.sin(n1) * zr); ctx.lineTo(R.x - Math.cos(n1) * R.r, R.y - Math.sin(n1) * R.r); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(R.x + Math.cos(n1) * R.r, R.y + Math.sin(n1) * R.r); ctx.lineTo(zx + Math.cos(n1) * zr, zy + Math.sin(n1) * zr);
      ctx.moveTo(R.x - Math.cos(n1) * R.r, R.y - Math.sin(n1) * R.r); ctx.lineTo(zx - Math.cos(n1) * zr, zy - Math.sin(n1) * zr); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(R.x, R.y, R.r, 0, 7); ctx.stroke();
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(R.x, R.y, R.r - 2.5, 0, 7); ctx.stroke(); ctx.restore();
      /* loupe */
      ceShadow(ctx, zx + 5, zy + 7, zr, zr, 0.18);
      ctx.save(); ctx.beginPath(); ctx.arc(zx, zy, zr, 0, 7); ctx.clip();
      var kind = st.drag ? null : st.at, cap = "", cap2 = "";
      if (kind === "poumon"){ zoomLung(ctx, zx, zy, zr, S0, open, st.t); cap = open ? "CO₂ : du sang vers l'air" : "le CO₂ ne peut plus sortir"; cap2 = "HCO₃⁻ + H⁺ ⇌ CO₂ + H₂O"; }
      else if (kind === "muscle"){ zoomMuscle(ctx, zx, zy, zr, S0, a, st.t); cap = a > 0 ? "H⁺ + HCO₃⁻ → CO₂ + H₂O" : "au repos : le muscle rejette du CO₂"; cap2 = a > 0 ? "acide lactique → lactate⁻ + H⁺" : "pas d'acide lactique"; }
      else { ctx.fillStyle = "#eef3f8"; ctx.fillRect(zx - zr, zy - zr, 2 * zr, 2 * zr); ceWrap(ctx, "Pose le viseur sur le poumon ou sur le muscle du bras", zx, zy - 12, zr * 1.5, 16, {size:ph ? 11 : 12.5, color:"#334155"}); }
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "#2b2f36"; ctx.lineWidth = Math.max(4, zr * 0.06); ctx.beginPath(); ctx.arc(zx, zy, zr, 0, 7); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(zx, zy, zr - 5, PI * 1.05, PI * 1.45); ctx.stroke(); ctx.restore();
      if (cap){
        var cs = ph ? 10.5 : 11.5, top = ph ? zy - zr - 26 : zy - zr - 30;
        ceTag(ctx, cap, zx, ph ? zy + zr + 15 : top, {size:cs, bg:"rgba(15,27,45,.9)", color:"#fff", clampW:W});
        ceTag(ctx, cap2, zx, ph ? zy + zr + 38 : zy + zr + 16, {size:cs * 0.92, bg:"rgba(255,255,255,.95)", color:"#7a4b00", clampW:W});
      }
      if (!ph){
        ceTag(ctx, "Glisse le viseur", R.x, Math.min(Hs - 12, R.y + R.r + 14), {size:9.5, bg:"rgba(255,255,255,.85)", color:"#475569", clampW:W});
      }

      /* ---------- jauge de pH ---------- */
      var gy0 = Hs, gx0 = 16, gx1 = W - 16, yb = gy0 + gh * 0.58;
      ctx.fillStyle = "#0f1b2d"; ctx.fillRect(0, gy0, W, gh);
      function GX(v){ return gx0 + (v - 6.0) / 1.8 * (gx1 - gx0); }
      var zones = [[6.0, 6.8, "#7f1d1d"], [6.8, 7.35, "#e2643a"], [7.35, 7.45, "#22a35a"], [7.45, 7.8, "#7c5cd6"]];
      zones.forEach(function(z){ ctx.fillStyle = z[2]; ctx.fillRect(GX(z[0]), yb - 5, GX(z[1]) - GX(z[0]), 10); });
      for (var v = 6.0; v <= 7.801; v += 0.2){ var xv = GX(v); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(xv - 0.5, yb + 5, 1, 4);
        if (!ph || Math.round(v * 10) % 4 === 0) ceText(ctx, ceFmt(v, 1), xv, yb + 15, {size:ph ? 8.5 : 9.5, color:"#cbd5e1", w:700}); }
      var pv = ceClamp(S0.pH, 6.0, 7.8), xn = GX(pv);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(xn, yb - 6); ctx.lineTo(xn - 6, yb - 15); ctx.lineTo(xn + 6, yb - 15); ctx.closePath(); ctx.fill();
      var diag = S0.pH < 7.35 ? "acidose" : S0.pH > 7.45 ? "alcalose" : "normal";
      ceTag(ctx, "pH " + ceFmt(S0.pH, 2) + " · " + diag, xn, gy0 + 12, {size:ph ? 10.5 : 11.5, bg:S0.pH < 7.35 ? "#e2643a" : S0.pH > 7.45 ? "#7c5cd6" : "#22a35a", color:"#fff", clampW:W});

      /* ---------- afficheurs ---------- */
      ro.set(0, ceFmt(S0.P, 1) + " mmHg"); ro.set(1, ceFmt(S0.B, 1) + " mmol/L"); ro.set(2, ceFmt(S0.C, 2) + " mmol/L"); ro.set(3, ceFmt(S0.pH, 2));
      var ratio = S0.B / S0.C;
      var txt = "pH = 6,1 + log([HCO₃⁻] / (0,03 × pCO₂)) = 6,1 + log(" + ceFmt(S0.B, 1) + " / " + ceFmt(S0.C, 2) + ") = 6,1 + log(" + ceFmt(ratio, ratio < 10 ? 2 : 1) + ") = <b>" + ceFmt(S0.pH, 2) + "</b>. ";
      var kind2 = "ok";
      if (!open){
        var So = tsState(vS.value, a, true, false);
        txt += a > 0 ? "Système fermé : les " + ceFmt(a, 1) + " mmol/L de H⁺ ont changé autant de HCO₃⁻ en CO₂, qui reste dans le sang. Avec des poumons (même ventilation), le pH serait " + ceFmt(So.pH, 2) + "." : "Système fermé, sans acide ajouté : rien ne change encore. Ajoute une charge acide.";
        kind2 = S0.pH < 7.35 ? "warn" : "ok";
      } else {
        var cause = [];
        if (a > 0) cause.push("métabolique (" + ceFmt(a, 1) + " mmol/L de HCO₃⁻ consommés)");
        if (S0.P > 45) cause.push("respiratoire (CO₂ retenu par hypoventilation)");
        if (S0.P < 35 && diag === "alcalose") cause.push("respiratoire (CO₂ chassé par hyperventilation)");
        if (diag === "normal") txt += a > 0 ? (S0.P < 39.5 ? "pH normal : la baisse de HCO₃⁻ est compensée par une pCO₂ plus basse." : "pH encore normal : la baisse de HCO₃⁻ est faible.") : "Valeurs normales : le rapport HCO₃⁻/CO₂ vaut 20.";
        else if (diag === "alcalose" && a > 0) txt += "Alcalose respiratoire (CO₂ chassé par hyperventilation), malgré une acidose métabolique (" + ceFmt(a, 1) + " mmol/L de HCO₃⁻ consommés).";
        else txt += (diag === "acidose" ? "Acidose " : "Alcalose ") + cause.join(" et ") + "." + (a > 0 && S0.P < 39.5 ? " L'hyperventilation compense en partie (pCO₂ " + ceFmt(S0.P, 1) + " mmHg)." : "");
        kind2 = diag === "normal" ? "ok" : "warn";
      }
      nt.set(txt, kind2);
    });
  }
});

/* =====================================================================
   3. Une goutte d'eau sur le fer : la pile de corrosion (c08)
   ===================================================================== */
var CG_F = 96485, CG_EO2 = 1.229 - 0.0592 * 7 + 0.0592 / 4 * Math.log10(0.21);   /* O₂/OH⁻ à pH 7, air (0,21 bar) */
var CG_EH2 = -0.0592 * 7;                                                         /* H₂O/H₂ à pH 7, 1 bar */
var CG_MET = {Fe:{E:-0.44, M:55.85, nom:"fer", eq:"Fe → Fe²⁺ + 2 e⁻", ion:"Fe²⁺", col:"#8ba0b6"}, Zn:{E:-0.76, M:65.38, nom:"zinc", eq:"Zn → Zn²⁺ + 2 e⁻", ion:"Zn²⁺", col:"#a9b8c8"}, Mg:{E:-2.37, M:24.31, nom:"magnésium", eq:"Mg → Mg²⁺ + 2 e⁻", ion:"Mg²⁺", col:"#d5d9de"}};
var CG_RB = 2.4, CG_HD = 1.65, CG_RS = (CG_RB * CG_RB + CG_HD * CG_HD) / (2 * CG_HD), CG_XM = -1.35;
function cgProf(dx){ var v = CG_RS * CG_RS - dx * dx; return v > 0 ? Math.sqrt(v) - (CG_RS - CG_HD) : 0; }
/* masse dissoute par 1 mA pendant 24 h : m = I·t·M / (n·F) */
function cgMass(met){ return 1e-3 * 86400 * CG_MET[met].M / (2 * CG_F) * 1000; }
/* configuration de la pile selon la surface, la position de la goutte, l'O₂ */
function cgCfg(mode, xd, o2){
  var R = CG_RB, cov = function(x0, m){ return Math.abs(xd - x0) < R - (m || 0.3); };
  var c = {met:"Fe", ax:[xd], cx:[xd - 0.85 * R, xd + 0.85 * R], meet:[xd - 0.55 * R, xd + 0.55 * R], prod:"rust", rate:1, active:true, key:"nu"};
  if (mode === "peinture"){ if (cov(0)){ c.ax = [0]; c.cx = [-0.18, 0.18]; c.meet = [-0.3, 0.3]; c.rate = 0.35; c.key = "peint-raye"; } else { c.active = false; c.met = null; c.key = "peint"; } }
  if (mode === "etain"){ if (cov(0)){ c.ax = [0]; c.meet = [-0.4, 0.4]; c.rate = 2.4; c.key = "etain-raye"; } else { c.active = false; c.met = null; c.key = "etain"; } }
  if (mode === "zinc"){ c.met = "Zn"; c.prod = "white";
    if (cov(0)){ c.ax = [-0.5, 0.5]; c.cx = [0, xd - 0.85 * R, xd + 0.85 * R]; c.meet = [-0.3, 0.3]; c.key = "zinc-raye"; }
    else { c.rate = 0.3; c.key = "zinc"; } }
  if (mode === "mg"){ if (Math.abs(xd - CG_XM) < R + 0.25){ var axm = Math.max(xd - R + 0.3, Math.min(xd + R - 0.3, CG_XM)); c.met = "Mg"; c.ax = [axm]; c.prod = "white"; c.meet = [axm + (xd >= axm ? 0.55 : -0.55)]; c.rate = 1.4; c.key = "mg"; } else c.key = "mg-loin"; }
  c.Ec = o2 ? CG_EO2 : CG_EH2;
  if (!o2 && c.active) c.rate *= c.met === "Mg" ? 0.5 : c.met === "Zn" ? 0.08 : 0.02;
  return c;
}

SFA.sim({
  id:"ch-corrosion-goutte", ch:"c08", tag:"Corrosion",
  titre:"Une goutte d'eau sur le fer : la pile de corrosion",
  resume:"Une goutte d'eau vue en coupe sur une tôle d'acier : au centre le fer se dissout (anode), sur le bord le dioxygène est réduit (cathode), les électrons filent dans le métal et un anneau de rouille se forme entre les deux. Ajoute du sel, retire l'O₂, galvanise, pose une anode sacrificielle, ou raye une peinture ou un étamage.",
  but:"Regarde d'où partent les ions Fe²⁺, où arrive l'O₂ et où naît la rouille. Glisse la goutte avec la souris (ailleurs, tu tournes la tôle). Change la surface : sur une tôle peinte, étamée ou galvanisée, amène la goutte sur la rayure et compare. Ajoute du sel ou chasse l'O₂ et regarde la vitesse changer.",
  aRetenir:"La corrosion du fer est une pile en court-circuit. Anode (là où l'O₂ manque, au centre de la goutte) : Fe → Fe²⁺ + 2 e⁻. Cathode (au bord, là où l'eau est mince et riche en O₂) : O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻. Les électrons passent dans le métal, les ions dans l'eau ; Fe²⁺ et OH⁻ se rencontrent et, avec l'O₂, forment la rouille (Fe₂O₃·nH₂O) en anneau. À pH 7, à l'air, E(O₂/OH⁻) ≈ +0,80 V et E°(Fe²⁺/Fe) = −0,44 V : f.é.m. théorique de la pile : 1,24 V. Un métal plus réducteur que le fer (zinc, magnésium) s'oxyde à sa place et le protège ; un métal plus noble (étain) l'accélère s'il est rayé.",
  piege:"La rouille ne se forme pas là où le fer se dissout, mais entre l'anode et la cathode, là où Fe²⁺ rencontre OH⁻. Le sel ne participe pas à la réaction : il rend l'eau conductrice et accélère la pile. Une boîte de conserve étamée rayée rouille plus vite qu'une tôle nue (petite anode de fer, grande cathode d'étain), tandis qu'une tôle galvanisée rayée ne rouille pas : le zinc se sacrifie. Les potentiels de l'anode sont des E° (ions à 1 mol/L) : un ordre de grandeur.",
  build:function(k, S){
    var c = ceCanvas(k, 0.7, 0.86);
    var st = {t:0, a:-0.22, b:0.34, idle:9, xd:0, prog:0.3, dragDrop:false};
    var mS = k.select("Surface de la tôle", [["nu", "Acier nu"], ["peinture", "Acier peint, avec une rayure"], ["etain", "Acier étamé (étain), avec une rayure"], ["zinc", "Acier galvanisé (zinc), avec une rayure"], ["mg", "Acier nu + anode sacrificielle en magnésium"]], "nu", function(){ st.prog = 0; });
    var sT = k.toggle("Eau salée (NaCl)", false);
    var oT = k.toggle("Eau sans O₂ (désaérée)", false, function(){ st.prog = 0; });
    k.button("Recommencer", function(){ st.prog = 0; });
    var ro = k.readouts(["Anode : oxydation", "Cathode : réduction", "f.é.m. théorique de la pile de corrosion", "Métal perdu pour 1 mA pendant 24 h"]);
    var nt = k.note("", "ok");
    var dropScr = null;
    /* avec l'anode en magnésium, la goutte ne s'éloigne pas au point de sortir le bloc du cadre */
    function cgXmax(){ return mS.value === "mg" ? 1.6 : 2.25; }
    st.onPtr = function(type, p){
      if (type === "down" && dropScr && Math.abs(p.x - dropScr.x) < dropScr.w && p.y > dropScr.y0 - 10 && p.y < dropScr.y1 + 8){ st.dragDrop = true; st.px = p.x; st.idle = 0; c.cv.style.cursor = "grabbing"; return true; }
      if (type === "drag" && st.dragDrop){ st.xd = ceClamp(st.xd + (p.x - st.px) / (dropScr.sc * Math.max(0.5, Math.cos(st.a))), -2.25, cgXmax()); st.px = p.x; st.prog = Math.max(0, st.prog - 0.03); return true; }
      if (type === "up" && st.dragDrop){ st.dragDrop = false; c.cv.style.cursor = "grab"; return true; }
      return false;
    };
    ceDrag(c, st, 0.006, 0.008, 0.12, 0.72);
    var lp = k.loop(function(dt){
      st.t += dt; st.idle += dt;
      if (!st.drag && !st.dragDrop && st.idle > 3) st.a = -0.22 + 0.18 * Math.sin(st.t * 0.22);
      st.a = ceClamp(st.a, -0.6, 0.6); st.xd = Math.min(st.xd, cgXmax());
      var cf = cgCfg(mS.value, st.xd, !oT.value);
      if (cf.active) st.prog = Math.min(1, st.prog + dt * cf.rate * (sT.value ? 2.5 : 1) * 0.035);
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, mode = mS.value, o2 = !oT.value, salt = sT.value, xd = st.xd, R = CG_RB;
      var cf = cgCfg(mode, xd, o2), spd = cf.active ? Math.min(2.5, cf.rate * (salt ? 2 : 1)) : 0, t = st.t, pr = st.prog;
      ctx.clearRect(0, 0, W, H);
      /* décor : atelier */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#dfe6ee"); bg.addColorStop(1, "#b9c5d2");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.25)"; for (var i = 0; i < 7; i++) ctx.fillRect(i * W / 6 - 1, 0, 2, H * 0.35);
      var sc = ph ? W / 5.3 : W / 6.0, cx = W / 2, cy = H * (ph ? 0.62 : 0.64);
      function P(p){ var q = ceRot([p[0], p[1] - 0.25, p[2] + 0.6], st.a, st.b), s = 1 / (1 - q[2] * 0.035); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2]}; }
      /* la caméra suit la goutte : elle reste entière dans le cadre, même poussée au bout de la tôle */
      (function(){ var y0 = coatTop(), lo = 1e9, hi = -1e9;
        for (var j = 0; j <= 16; j++){ var th = PI + j / 16 * PI, q = P([xd + R * Math.cos(th), y0, R * Math.sin(th)]); lo = Math.min(lo, q.x); hi = Math.max(hi, q.x); }
        [P([xd - R, y0, 0]), P([xd + R, y0, 0])].forEach(function(q){ lo = Math.min(lo, q.x); hi = Math.max(hi, q.x); });
        var m = 8;
        if (mode === "mg"){ var l2 = lo, h2 = hi; [-0.32, 0.32].forEach(function(dxm){ [0, -1.3].forEach(function(zm){ var q = P([CG_XM + dxm, 0.5, zm]); l2 = Math.min(l2, q.x - 10); h2 = Math.max(h2, q.x + 10); }); });
          if (h2 - l2 <= W - 2 * m){ lo = l2; hi = h2; }
          else if (l2 < lo && hi - lo <= W - 2 * m){ lo = hi - (W - 2 * m); }   /* goutte calée à droite : on voit le plus possible du bloc */ }
        if (hi - lo > W - 2 * m) cx += W / 2 - (lo + hi) / 2; else if (hi > W - m) cx -= hi - (W - m); else if (lo < m) cx += m - lo;
        /* et verticalement : place pour l'étiquette de l'anode dessous, pour celles de la cathode et de la rouille dessus */
        var yb = P([xd, -0.55, 0]).y, yt = P([xd, y0 + CG_HD, 0]).y, lim = H - 34, tmin = ph ? 60 : 40, d = 0;
        if (yb > lim) d = lim - yb;
        if (yt + d < tmin) d = Math.min(tmin - yt, lim - yb);
        cy += d; })();
      function coatTop(){ return ({peinture:0.1, etain:0.07, zinc:0.09})[mode] || 0; }
      /* tôle (coupée en z = 0) */
      var mcol = cf.met === "Zn" || mode === "zinc" ? "#7d8a99" : "#76828f";
      ceBox(ctx, P, -7, 7, -0.55, 0, -3.6, 0, mcol, st.a, st.b, {edge:"rgba(255,255,255,.25)"});
      /* revêtement avec rayure en x = 0 */
      var coat = {peinture:["#2f6db3", 0.1], etain:["#dfe5ec", 0.07], zinc:["#a9b8c8", 0.09]}[mode];
      if (coat){
        var gap = 0.22, zgap = mode === "zinc" && cf.key === "zinc-raye" ? gap + 0.55 * pr : gap;
        ceBox(ctx, P, -7, -zgap, 0, coat[1], -3.6, 0, coat[0], st.a, st.b, {edge:"rgba(255,255,255,.35)"});
        ceBox(ctx, P, zgap, 7, 0, coat[1], -3.6, 0, coat[0], st.a, st.b, {edge:"rgba(255,255,255,.35)"});
        /* zinc aminci près de la rayure */
        if (zgap > gap){ ceBox(ctx, P, -zgap, -gap, 0, coat[1] * 0.25, -3.6, 0, coat[0], st.a, st.b, {edge:false}); ceBox(ctx, P, gap, zgap, 0, coat[1] * 0.25, -3.6, 0, coat[0], st.a, st.b, {edge:false}); }
      }
      var yTop = coat ? coat[1] : 0;
      /* anode sacrificielle */
      if (mode === "mg"){
        var sh = 1 - 0.45 * (cf.met === "Mg" ? pr : 0);
        ceBox(ctx, P, CG_XM - 0.32 * sh, CG_XM + 0.32 * sh, 0, 0.5 * sh, -1.3, 0, "#b7c0cb", st.a, st.b, {edge:"rgba(0,0,0,.45)"});
        var qmg = P([CG_XM, 0.25 * sh, 0.01]);
        ceBox(ctx, P, CG_XM - 0.08, CG_XM + 0.08, 0.5 * sh, 0.62 * sh, -0.9, -0.4, "#8a929c", st.a, st.b, {edge:false});
      }
      /* dépôts sur la surface, moitié arrière (vue à travers la goutte) */
      function ring(x0, r0, r1, col, al){
        if (al <= 0.01) return;
        var outer = [], inner = [];
        for (var j = 0; j <= 24; j++){ var th = PI + j / 24 * PI; outer.push(P([x0 + r1 * Math.cos(th), yTop + 0.005, r1 * Math.sin(th)])); inner.push(P([x0 + r0 * Math.cos(th), yTop + 0.005, r0 * Math.sin(th)])); }
        ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = col; ctx.beginPath();
        outer.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); for (var j2 = inner.length - 1; j2 >= 0; j2--) ctx.lineTo(inner[j2].x, inner[j2].y);
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
      function strip(x0, x1, col, al){ if (al <= 0.01) return; var q = [P([x0, yTop + 0.01, -R]), P([x1, yTop + 0.01, -R]), P([x1, yTop + 0.01, 0]), P([x0, yTop + 0.01, 0])]; ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = col; cePoly(ctx, q); ctx.fill(); ctx.restore(); }
      var rustA = Math.min(0.9, pr * 1.3);
      if (cf.active){
        if (cf.key === "nu" || cf.key === "mg-loin") ring(xd, 0.42 * R, 0.72 * R, "#8a3b14", rustA);
        else if (cf.key === "zinc") ring(xd, 0.35 * R, 0.72 * R, "#e9edf1", rustA * 0.8);
        else if (cf.key === "peint-raye") strip(-0.45, 0.45, "#9a4a1c", rustA);
        else if (cf.key === "etain-raye") strip(-0.7, 0.7, "#8a3b14", rustA);
        else if (cf.key === "zinc-raye") strip(-0.8, 0.8, "#eef1f4", rustA * 0.8);
        else if (cf.key === "mg") ring(CG_XM, 0.35, 0.9, "#f1f3f5", rustA * 0.8);
      }
      /* goutte : demi-dôme arrière translucide */
      var dome = [];
      for (var ia = 0; ia <= 12; ia++) for (var ib = 0; ib <= 16; ib++){
        var phi = Math.asin(R / CG_RS) * ia / 12, th2 = PI + ib / 16 * PI, rho = CG_RS * Math.sin(phi);
        dome.push(P([xd + rho * Math.cos(th2), yTop + CG_RS * Math.cos(phi) - (CG_RS - CG_HD), rho * Math.sin(th2)]));
      }
      var hull = ceHull(dome), hx = hull.map(function(q){ return q.x; }), hy = hull.map(function(q){ return q.y; });
      var gd = ctx.createLinearGradient(0, Math.min.apply(null, hy), 0, Math.max.apply(null, hy));
      var wcol = salt ? "#9fc9e8" : "#a9d6f2";
      gd.addColorStop(0, ceRgba(wcol, 0.35)); gd.addColorStop(1, ceRgba(wcol, 0.18));
      ctx.fillStyle = gd; cePoly(ctx, hull); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1.4; cePoly(ctx, hull); ctx.stroke();
      /* coupe de la goutte (plan z = 0) */
      var sec = [];
      for (var ix = 0; ix <= 40; ix++){ var dx = -R + ix / 40 * 2 * R; sec.push(P([xd + dx, yTop + cgProf(dx), 0])); }
      var secPoly = sec.concat([P([xd + R, yTop, 0]), P([xd - R, yTop, 0])]);
      var gs = ctx.createLinearGradient(0, P([xd, yTop + CG_HD, 0]).y, 0, P([xd, yTop, 0]).y);
      gs.addColorStop(0, salt ? "rgba(150,195,232,.7)" : "rgba(160,210,242,.7)"); gs.addColorStop(1, salt ? "rgba(96,150,205,.62)" : "rgba(104,165,220,.62)");
      ctx.fillStyle = gs; ctx.beginPath(); sec.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fill();
      /* bande riche en O₂ sous la surface libre */
      if (o2){ ctx.save(); ctx.beginPath(); sec.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.clip();
        ctx.strokeStyle = "rgba(230,250,255,.55)"; ctx.lineWidth = sc * 0.32; ctx.beginPath(); sec.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.restore(); }
      ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 2; ctx.beginPath(); sec.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke();
      /* reflet */
      var hl = P([xd - R * 0.35, yTop + cgProf(-R * 0.35) * 0.92, -0.5]);
      ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(hl.x, hl.y, sc * 0.32, sc * 0.08, -0.35, 0, 7); ctx.fill(); ctx.restore();
      var Pd = {top:P([xd, yTop + CG_HD, 0]), l:P([xd - R, yTop, 0]), r:P([xd + R, yTop, 0])};
      dropScr = {x:(Pd.l.x + Pd.r.x) / 2, w:Math.abs(Pd.r.x - Pd.l.x) / 2, y0:Pd.top.y, y1:Math.max(Pd.l.y, Pd.r.y), sc:sc};

      /* ---------- particules dans la coupe ---------- */
      var rp = Math.max(3, sc * 0.075);
      function S2(x, y){ return P([x, yTop + y, 0]); }
      function inDrop(x, y){ return Math.abs(x - xd) < R && y < cgProf(x - xd) - 0.08; }
      var ionM = cf.met ? CG_MET[cf.met] : null;
      /* ions spectateurs du sel */
      if (salt){ for (var n = 0; n < 10; n++){ var sx = xd - R * 0.85 + R * 1.7 * ceHash(n, 7) + Math.sin(t * 0.8 + n) * 0.1, sy = 0.12 + (cgProf(sx - xd) - 0.25) * ceHash(n, 8); if (!inDrop(sx, sy)) continue;
        var qq = S2(sx, sy); ceBall(ctx, qq.x, qq.y, rp * (n % 2 ? 1.05 : 0.8), n % 2 ? "#5cc46a" : "#b98ae6", 0.85); } }
      if (cf.active && spd > 0.01){
        var per = 4.2 / Math.max(0.4, spd);
        /* O₂ : de la surface libre vers la cathode, puis OH⁻ vers l'intérieur */
        if (o2) cf.cx.forEach(function(xc, ic){
          for (var m = 0; m < 3; m++){
            var phs = (t / per + m / 3 + ic * 0.17) % 1, xs = xc + (xc > xd ? 0.25 : -0.25) * (1 - phs), ytop = Math.max(0.2, cgProf(xs - xd) - 0.05);
            if (phs < 0.55){ var u = phs / 0.55, yy = ytop * (1 - u) + 0.1 * u, qa = S2(xs, yy); if (inDrop(xs, yy) || yy < 0.2){ ceBall(ctx, qa.x - rp * 0.6, qa.y, rp * 0.9, "#d6392f"); ceBall(ctx, qa.x + rp * 0.6, qa.y, rp * 0.9, "#d6392f"); } }
            else { var v = (phs - 0.55) / 0.45, mt = cf.meet.reduce(function(b0, x1){ return Math.abs(x1 - xc) < Math.abs(b0 - xc) ? x1 : b0; }, cf.meet[0]), xo = xc + (mt - xc) * v, qo = S2(xo, 0.12 + 0.05 * Math.sin(v * 6)); ceBall(ctx, qo.x, qo.y, rp * 0.85, "#2fa3c8", 1 - Math.max(0, v - 0.8) * 5); if (rp > 4.5) ceText(ctx, "−", qo.x, qo.y, {size:rp * 1.6, color:"#fff", w:800}); }
          }
        });
        /* ions métalliques : de l'anode vers la zone de rencontre */
        cf.ax.forEach(function(xa, ia2){
          for (var m2 = 0; m2 < 3; m2++){
            var ph2 = (t / per + m2 / 3 + 0.4 + ia2 * 0.3) % 1, mt2 = cf.meet.reduce(function(b0, x1){ return Math.abs(x1 - xa) < Math.abs(b0 - xa) ? x1 : b0; }, cf.meet[0]);
            if (m2 === 1 && cf.meet.length > 1) mt2 = cf.meet.reduce(function(b0, x1){ return Math.abs(x1 - xa) > Math.abs(b0 - xa) ? x1 : b0; }, cf.meet[0]);
            var xi = xa + (mt2 - xa) * ph2, yi = 0.08 + 0.3 * Math.sin(ph2 * PI), qi = S2(xi, yi);
            ceBall(ctx, qi.x, qi.y, rp * 1.05, ionM.col === "#8ba0b6" ? "#4f9a5a" : "#93a3b3", 1 - Math.max(0, ph2 - 0.8) * 5);
            if (rp > 4.5) ceText(ctx, "+", qi.x, qi.y, {size:rp * 1.5, color:"#fff", w:800});
          }
        });
        /* électrons dans le métal (face avant de la tôle) : de l'anode vers chaque cathode */
        cf.ax.forEach(function(xa){ cf.cx.forEach(function(xc, j3){
          if (Math.abs(xc - xa) < 0.05) return;
          for (var e = 0; e < 4; e++){ var pe = (t * 0.9 * Math.max(0.4, spd) / Math.max(1, Math.abs(xc - xa)) + e / 4 + j3 * 0.13) % 1, xe = xa + (xc - xa) * pe, qe = P([xe, -0.22, 0.01]);
            var ge = ctx.createRadialGradient(qe.x, qe.y, 0, qe.x, qe.y, rp * 1.8); ge.addColorStop(0, "rgba(255,226,90,.8)"); ge.addColorStop(1, "rgba(255,226,90,0)"); ctx.fillStyle = ge; ctx.beginPath(); ctx.arc(qe.x, qe.y, rp * 1.8, 0, 7); ctx.fill();
            ceBall(ctx, qe.x, qe.y, rp * 0.6, "#f5c518"); }
        }); });
      }
      /* dépôts dans la coupe (rouille ou hydroxydes blancs) */
      if (cf.active && pr > 0.02){
        var nd = Math.round(pr * 14), white = cf.prod === "white";
        for (var d = 0; d < nd; d++){
          var mt3 = cf.meet[d % cf.meet.length], xr = mt3 + (ceHash(d, 11) - 0.5) * (cf.key === "nu" || cf.key === "mg-loin" ? 0.6 : 0.4), yr = 0.03 + 0.12 * ceHash(d, 12) * (1 + pr), qr = S2(xr, yr);
          ceBall(ctx, qr.x, qr.y, rp * (0.8 + 0.5 * ceHash(d, 13)), white ? "#eef1f4" : (d % 2 ? "#a0522d" : "#7a3b1c"));
        }
      }
      /* piqûre à l'anode (face avant du métal) */
      if (cf.active && cf.met === "Fe"){
        cf.ax.forEach(function(xa){
          var dep = 0.06 + 0.3 * pr * (cf.key === "etain-raye" ? 1.4 : 1), wdt = cf.key === "nu" || cf.key === "mg-loin" ? 0.55 : 0.22;
          var pts = []; for (var j4 = 0; j4 <= 16; j4++){ var u4 = j4 / 16, xx4 = xa - wdt + 2 * wdt * u4; pts.push(P([xx4, -dep * Math.sin(u4 * PI), 0.01])); }
          ctx.fillStyle = "#4b5360"; ctx.beginPath(); pts.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fill();
        });
      }

      /* ---------- étiquettes ---------- */
      var fs = ph ? 9.5 : 11, top = Pd.top.y, boxes = [];
      if (mode === "mg") ceText(ctx, "Mg", Math.max(ph ? 12 : 14, qmg.x), qmg.y, {size:ph ? 10 : 12, w:800, color:"#334155", halo:"rgba(255,255,255,.8)"});
      var met = cf.met ? CG_MET[cf.met] : null;
      if (cf.active){
        var xa0 = S2(cf.ax[0], 0), below = P([cf.ax[0], -0.55, 0.01]);
        var tA = ceTag(ctx, "anode : " + met.eq, xa0.x, Math.min(H - 14, below.y + (ph ? 16 : 20)), {size:fs, bg:"rgba(15,27,45,.9)", color:"#fff", clampW:W}); boxes.push(tA);
        ceArrow(ctx, tA.x0 + tA.w / 2 > xa0.x ? xa0.x + 4 : xa0.x, tA.y0, xa0.x, below.y + 4, "#0f1b2d", 1.6, 7);
        if (o2 && cf.cx.length){
          var xc0 = cf.cx[cf.cx.length - 1], qc = S2(xc0, 0.12);
          var tC = ceTag(ctx, "cathode : O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻", W - 6, top - (ph ? 22 : 26), {align:"right", size:fs, bg:"rgba(255,255,255,.95)", color:"#0f5f7a", stroke:"#9fd3e6", clampW:W}); boxes.push(tC);
          ceArrow(ctx, Math.min(qc.x + 6, tC.x0 + tC.w - 12), tC.y0 + tC.h, qc.x, qc.y - 6, "#0f5f7a", 1.6, 7);
        }
        if (pr > 0.08){
          var mtl = cf.meet[0], qm = S2(mtl, 0.1), lab = cf.prod === "white" ? (cf.met === "Mg" ? "Mg(OH)₂ blanc" : "Zn(OH)₂ blanc : pas de rouille") : "rouille : Fe₂O₃·nH₂O";
          var tR = ceTag(ctx, lab, 6, top - (ph ? 22 : 26) - (o2 && cf.cx.length && ph ? 26 : 0), {align:"left", size:fs, bg:cf.prod === "white" ? "#fff" : "#7a3b1c", color:cf.prod === "white" ? "#334155" : "#fff", clampW:W}); boxes.push(tR);
          ceArrow(ctx, Math.max(tR.x0 + 14, Math.min(qm.x, tR.x0 + tR.w - 10)), tR.y0 + tR.h, qm.x, qm.y - 4, cf.prod === "white" ? "#475569" : "#7a3b1c", 1.6, 7);
        }
      } else {
        boxes.push(ceTag(ctx, mode === "peinture" ? "la peinture isole le fer : rien ne se passe" : "l'étain intact protège : rien ne se passe", W / 2, top - 24, {size:fs, bg:"rgba(255,255,255,.95)", color:"#334155", clampW:W}));
      }
      if (coat){
        var lc = {peinture:"peinture", etain:"couche d'étain", zinc:"couche de zinc"}[mode], ql = P([xd - R - 0.1, yTop, 0]), qr2 = P([xd + R + 0.1, yTop, 0]), wl = ceTw(ctx, lc, fs, 800) + 16;
        if (ql.x - wl > 4) boxes.push(ceTag(ctx, lc, ql.x - 4, ql.y - 14, {align:"right", size:fs * 0.92, bg:"rgba(255,255,255,.9)", color:"#334155"}));
        else if (qr2.x + wl < W - 4) boxes.push(ceTag(ctx, lc, qr2.x + 4, qr2.y - 14, {align:"left", size:fs * 0.92, bg:"rgba(255,255,255,.9)", color:"#334155"}));
      }
      if (coat && !cf.active || (coat && cf.active && cf.key.indexOf("raye") < 0)){
        /* l'étiquette « rayure » glisse le long de la rayure jusqu'à une place libre */
        var rw = ceTw(ctx, "rayure", fs * 0.92, 800) + 14, rh = fs * 0.92 + 9, rBest = null, rS = 1e9;
        [-1.8, -2.8, -3.3, -1.2, -0.6].forEach(function(zr){ [12, -12].forEach(function(oy){
          var q = P([0, yTop, zr]), x0r = Math.max(4, Math.min(W - rw - 4, q.x - rw / 2)), y0r = q.y + oy - rh / 2, sc2 = 0;
          if (y0r < 2 || y0r + rh > H - 2) sc2 += 1e6;
          boxes.forEach(function(bx){ var ox = Math.min(x0r + rw, bx.x0 + bx.w) - Math.max(x0r, bx.x0), oy2 = Math.min(y0r + rh, bx.y0 + bx.h) - Math.max(y0r, bx.y0); if (ox > 0 && oy2 > 0) sc2 += ox * oy2; });
          if (sc2 < rS - 0.5){ rS = sc2; rBest = [x0r + rw / 2, y0r + rh / 2]; } }); });
        ceTag(ctx, "rayure", rBest[0], rBest[1], {size:fs * 0.92, bg:"rgba(255,255,255,.85)", color:"#475569", clampW:W});
      }
      ceTag(ctx, "glisse la goutte ↔", Pd.top.x, top + (Pd.l.y - top) * 0.45, {size:fs * 0.9, bg:"rgba(255,255,255,.6)", color:"#1e3a5f", clampW:W, alpha:st.idle < 6 && st.t > 0 ? 0.35 : 0.9});

      /* ---------- afficheurs ---------- */
      if (!cf.active){
        ro.set(0, "aucune"); ro.set(1, "aucune"); ro.set(2, "—"); ro.set(3, "rien ne se dissout");
        nt.set(mode === "peinture" ? "La goutte ne touche que de la peinture : la peinture est un isolant étanche, l'eau n'atteint pas le fer et aucun courant ne peut circuler. Amène la goutte sur la rayure." : "La goutte ne touche que l'étain : l'étain est plus noble que le fer (E° = −0,14 V) et se couvre d'une couche protectrice. Amène la goutte sur la rayure.", "ok");
        return;
      }
      var dE = cf.Ec - met.E, mass = cgMass(cf.met);
      ro.set(0, met.eq); ro.set(1, o2 ? "O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻" : "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻ (très lente)");
      ro.set(2, ceFmt(dE, 2) + " V"); ro.set(3, ceFmt(mass, 1) + " mg de " + met.nom);
      var base = "E(cathode) = " + (o2 ? "1,229 − 0,0592 × 7 + (0,0592/4) × log 0,21 = " + ceSigned(cf.Ec, 3) + " V" : "−0,0592 × 7 = " + ceFmt(cf.Ec, 3) + " V (H₂O/H₂, il n'y a plus d'O₂)") + " ; E°(" + met.ion + "/" + cf.met + ") = " + ceFmt(met.E, 2) + " V ; f.é.m. théorique = " + ceFmt(dE, 2) + " V. 1 mA pendant 24 h : m = 10⁻³ × 86 400 × " + ceFmt(met.M, 2) + " / (2 × 96 485) = " + ceFmt(mass, 1) + " mg. ";
      var msg = {
        "nu":"Au centre, l'eau est épaisse et l'O₂ y arrive mal : le fer s'y dissout. Au bord, l'eau est mince et riche en O₂ : c'est la cathode. La rouille naît entre les deux.",
        "mg-loin":"La goutte ne touche pas le magnésium : l'acier nu rouille comme d'habitude. Une anode sacrificielle doit baigner dans la même eau que la pièce à protéger.",
        "peint-raye":"Seul le fer de la rayure touche l'eau : il est à la fois anode et cathode, sur une toute petite surface. La rouille reste dans la rayure, mais elle peut ensuite progresser sous la peinture.",
        "etain-raye":"L'étain (−0,14 V) est plus noble que le fer : toute la surface étamée mouillée devient cathode et le fer de la rayure est la seule anode. Petite anode, grande cathode : la piqûre se creuse vite.",
        "zinc-raye":"Le zinc (−0,76 V) est plus réducteur que le fer : c'est lui qui s'oxyde autour de la rayure, le fer reçoit les électrons et devient cathode. Pas de rouille : le zinc se sacrifie.",
        "zinc":"Sans rayure, le zinc s'oxyde lentement lui-même sous la goutte (rouille blanche) et protège l'acier en dessous.",
        "mg":"Le magnésium (−2,37 V) s'oxyde à la place du fer : ses électrons rendent toute la tôle cathodique. Le bloc s'use et doit être remplacé ; l'acier ne rouille pas."
      }[cf.key];
      var extra = (salt ? " L'eau salée conduit beaucoup mieux le courant ionique (Na⁺ et Cl⁻) : la pile débite plus et tout va plus vite." : "") + (!o2 ? " Sans O₂, la seule cathode possible est la réduction de l'eau, presque sans force motrice pour le fer : la corrosion s'arrête presque." : "");
      nt.set(base + msg + extra, !o2 || cf.prod === "white" ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   4. La règle du gamma, et quand le pH s'en mêle (c08)
   ===================================================================== */
/* couples : oxydant, réducteur, E° (V), électrons, H⁺ consommés ; demi-équations de réduction (réactifs → produits) */
var GA = {
  Zn:{ox:"Zn²⁺", red:"Zn", E0:-0.76, n:2, h:0, L:{"Zn²⁺":1}, R:{"Zn":1}},
  Fe:{ox:"Fe²⁺", red:"Fe", E0:-0.44, n:2, h:0, L:{"Fe²⁺":1}, R:{"Fe":1}},
  Pb:{ox:"Pb²⁺", red:"Pb", E0:-0.13, n:2, h:0, L:{"Pb²⁺":1}, R:{"Pb":1}},
  H:{ox:"H⁺", red:"H₂", E0:0, n:2, h:2, L:{"H⁺":2}, R:{"H₂":1}},
  Cu:{ox:"Cu²⁺", red:"Cu", E0:0.34, n:2, h:0, L:{"Cu²⁺":1}, R:{"Cu":1}},
  Fe3:{ox:"Fe³⁺", red:"Fe²⁺", E0:0.77, n:1, h:0, L:{"Fe³⁺":1}, R:{"Fe²⁺":1}},
  Ag:{ox:"Ag⁺", red:"Ag", E0:0.80, n:1, h:0, L:{"Ag⁺":1}, R:{"Ag":1}},
  O2:{ox:"O₂", red:"H₂O", E0:1.23, n:4, h:4, L:{"O₂":1, "H⁺":4}, R:{"H₂O":2}},
  Cl2:{ox:"Cl₂", red:"Cl⁻", E0:1.36, n:2, h:0, L:{"Cl₂":1}, R:{"Cl⁻":2}},
  Mn:{ox:"MnO₄⁻", red:"Mn²⁺", E0:1.51, n:5, h:8, L:{"MnO₄⁻":1, "H⁺":8}, R:{"Mn²⁺":1, "H₂O":4}}
};
var GA_KEYS = ["Zn", "Fe", "Pb", "H", "Cu", "Fe3", "Ag", "O2", "Cl2", "Mn"];
var GA_REDS = ["Zn", "Fe", "Pb", "Cu", "Fe3", "Ag", "Cl2"];
/* couleurs des espèces en solution (null : incolore) et des métaux */
var GA_SOL = {"Zn²⁺":null, "Fe²⁺":"#8fcf86", "Pb²⁺":null, "H⁺":null, "Cu²⁺":"#2f78d0", "Fe³⁺":"#e0a030", "Ag⁺":null, "O₂":null, "Cl₂":"#c9d85a", "MnO₄⁻":"#7b2d8e", "Mn²⁺":"#f2d3dc", "Cl⁻":null, "H₂O":null};
var GA_MET = {Zn:"#9aa6b4", Fe:"#6d7076", Pb:"#5f6670", Cu:"#c87a45", Ag:"#dfe3e8"};
var GA_WATER = "#d5e6f2";
/* E(pH) = E° − 0,0592·(h/n)·pH */
function gaE(k, pH){ var c = GA[k]; return c.E0 - 0.0592 * c.h / c.n * pH; }
function gaGcd(a, b){ return b ? gaGcd(b, a % b) : a; }
/* équation équilibrée : oxydant du couple kO + réducteur du couple kR */
function gaEq(kO, kR){
  var o = GA[kO], r = GA[kR], L = o.n * r.n / gaGcd(o.n, r.n), a = L / o.n, b = L / r.n, left = {}, right = {}, order = [];
  function add(side, sp, q){ side[sp] = (side[sp] || 0) + q; if (order.indexOf(sp) < 0) order.push(sp); }
  Object.keys(o.L).forEach(function(s){ add(left, s, a * o.L[s]); }); Object.keys(r.R).forEach(function(s){ add(left, s, b * r.R[s]); });
  Object.keys(o.R).forEach(function(s){ add(right, s, a * o.R[s]); }); Object.keys(r.L).forEach(function(s){ add(right, s, b * r.L[s]); });
  order.forEach(function(s){ if (left[s] && right[s]){ var m = Math.min(left[s], right[s]); left[s] -= m; right[s] -= m; } });
  function fmt(side){ return order.filter(function(s){ return side[s] > 0; }).map(function(s){ return (side[s] === 1 ? "" : side[s] + " ") + s; }).join(" + "); }
  return {txt:fmt(left) + " → " + fmt(right), n:L};
}

SFA.sim({
  id:"ch-regle-gamma-ph", ch:"c08", tag:"Oxydoréduction",
  titre:"La règle du gamma, et quand le pH s'en mêle",
  resume:"Une échelle verticale des potentiels : choisis un oxydant et un réducteur, le gamma se dessine et le bécher montre si la réaction a lieu. Un curseur de pH fait descendre le potentiel de MnO₄⁻/Mn²⁺, de O₂/H₂O et de H⁺/H₂ : l'ordre des couples peut s'inverser.",
  but:"Clique un oxydant (à gauche de l'échelle) puis un réducteur (à droite), ou choisis-les dans les menus. Si l'oxydant est au-dessus du réducteur, le gamma est vert et le bécher réagit. Puis monte le pH avec MnO₄⁻ face à Cl⁻, ou O₂ face à Ag : à partir de quel pH la réaction s'arrête-t-elle ? Glisse sur le bécher pour le tourner.",
  aRetenir:"On range les couples par E° croissant, oxydants à gauche, réducteurs à droite. L'oxydant le plus fort (en haut à gauche) réagit avec le réducteur le plus fort (en bas à droite) : on relie Ox du haut à Réd du bas et la figure dessine un γ. La réaction Ox₁ + Réd₂ est favorisée si E₁ > E₂ : ΔrG = −n·F·(E₁ − E₂) < 0 et K = 10^(n·ΔE/0,0592). Quand H⁺ participe, E dépend du pH : E(MnO₄⁻/Mn²⁺) = 1,51 − 0,0947·pH, E(O₂/H₂O) = 1,23 − 0,0592·pH, E(H⁺/H₂) = −0,0592·pH.",
  piege:"Le gamma dit si une réaction est possible, pas si elle est rapide : H₂ + Cu²⁺ ou l'oxydation de l'eau par MnO₄⁻ sont favorisées mais très lentes. Il compare des E à pH donné et pour des concentrations de 1 mol/L : une petite différence (quelques centièmes de volt) donne un équilibre, pas une réaction totale. Au-delà de pH 4 environ, MnO₄⁻ est réduit en MnO₂ et non en Mn²⁺, et beaucoup d'ions métalliques précipitent en hydroxydes : les formules ne valent alors plus.",
  build:function(k, S){
    var c = ceCanvas(k, 0.92, 1.35);
    var st = {t:0, a:0.25, b:0.3, idle:9, pr:0, key:"", lx:0, ly:0, beakerDrag:false};
    var oxSel = k.select("Oxydant (dans le bécher)", GA_KEYS.map(function(kk){ return [kk, GA[kk].ox + " (couple " + GA[kk].ox + "/" + GA[kk].red + ")"]; }), "Cu");
    var rdSel = k.select("Réducteur (qu'on y plonge ou y verse)", GA_REDS.map(function(kk){ return [kk, GA[kk].red + " (couple " + GA[kk].ox + "/" + GA[kk].red + ")"]; }), "Fe");
    var pS = k.slider("pH de la solution", 0, 14, 0.5, 0, "");
    var ro = k.readouts(["E de l'oxydant (à ce pH)", "E du réducteur (à ce pH)", "ΔE = E(ox) − E(réd)", "ΔrG = −n·F·ΔE"]);
    var nt = k.note("", "ok");
    var hits = [], beakerBox = null;
    c.pointer(function(type, p){
      if (type === "down"){
        var hit = null; hits.forEach(function(h){ if (p.x >= h.x0 && p.x <= h.x1 && Math.abs(p.y - h.y) < 10) hit = h; });
        if (hit){ if (hit.side === "ox") oxSel.set(hit.k); else if (GA_REDS.indexOf(hit.k) >= 0) rdSel.set(hit.k); st.pr = 0; k.redraw(); return; }
        if (beakerBox && p.x > beakerBox.x0){ st.beakerDrag = true; st.lx = p.x; st.ly = p.y; st.idle = 0; }
      }
      if (type === "drag" && st.beakerDrag){ st.a = ceClamp(st.a + (p.x - st.lx) * 0.01, -1.2, 1.2); st.b = ceClamp(st.b + (p.y - st.ly) * 0.006, 0.1, 0.7); st.lx = p.x; st.ly = p.y; st.idle = 0; }
      if (type === "up") st.beakerDrag = false;
      if (type === "move"){ var on = false; hits.forEach(function(h){ if (p.x >= h.x0 && p.x <= h.x1 && Math.abs(p.y - h.y) < 10) on = true; }); c.cv.style.cursor = on ? "pointer" : (beakerBox && p.x > beakerBox.x0 ? "grab" : "default"); }
    });
    var lp = k.loop(function(dt){
      st.t += dt; st.idle += dt;
      if (!st.beakerDrag && st.idle > 3) st.a = 0.25 + 0.35 * Math.sin(st.t * 0.3);
      var key = oxSel.value + "|" + rdSel.value + "|" + pS.value;
      if (key !== st.key){ st.key = key; st.pr = 0; }
      st.pr += dt / 7; if (st.pr > 1.35) st.pr = 0;
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, pH = pS.value, kO = oxSel.value, kR = rdSel.value;
      var EO = gaE(kO, pH), ER = gaE(kR, pH), dE = EO - ER, same = kO === kR, ok = !same && dE > 0;
      ctx.clearRect(0, 0, W, H);
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#eef2f7"); bg.addColorStop(1, "#d9e1ea");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* ---------- échelle des potentiels ---------- */
      var pw = Math.round(W * (ph ? 0.56 : 0.54)), ax = Math.round(pw * (ph ? 0.6 : 0.56));
      ctx.save(); ceRR(ctx, 6, 6, pw - 8, H - 12, 12); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fill(); ctx.restore();
      var yT = 46, yB = H - 56, Emax = 1.65, Emin = -0.95;
      function Y(E){ return yB - (E - Emin) / (Emax - Emin) * (yB - yT); }
      ceText(ctx, "E (V) à pH " + ceFmt(pH, 1), ax, 22, {size:ph ? 11 : 12.5, w:800, color:"#334155"});
      ceText(ctx, "oxydants", ax - 12, 38, {align:"right", size:ph ? 8.5 : 9.5, color:"#9a3412", w:800});
      ceText(ctx, "réducteurs", ax + 12, 38, {align:"left", size:ph ? 8.5 : 9.5, color:"#1d4ed8", w:800});
      /* domaine de stabilité de l'eau */
      var yO = Y(gaE("O2", pH)), yH = Y(gaE("H", pH));
      ctx.fillStyle = "rgba(80,160,230,.12)"; ctx.fillRect(ax - 5, yO, 10, yH - yO);
      var gr = ctx.createLinearGradient(0, yT, 0, yB); gr.addColorStop(0, "#d2452f"); gr.addColorStop(1, "#2f6fd6");
      ctx.save(); ctx.strokeStyle = gr; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(ax, yB); ctx.lineTo(ax, yT - 4); ctx.stroke(); ctx.restore();
      ceArrow(ctx, ax, yT + 6, ax, yT - 8, "#d2452f", 3, 9);
      /* positions des étiquettes, écartées pour ne pas se chevaucher */
      var fs = ph ? 10 : 11.5, gap = ph ? 15 : 17;
      var L = GA_KEYS.map(function(kk){ return {k:kk, E:gaE(kk, pH), y:Y(gaE(kk, pH))}; }).sort(function(u, v){ return u.y - v.y; });
      L.forEach(function(o){ o.ly = o.y; });
      for (var it = 0; it < 60; it++){
        for (var i = 1; i < L.length; i++){ var d = L[i].ly - L[i - 1].ly; if (d < gap){ var m = (gap - d) / 2; L[i].ly += m; L[i - 1].ly -= m; } }
        L.forEach(function(o){ o.ly = ceClamp(o.ly, yT + 8, yB - 2); });
      }
      var pos = {}; L.forEach(function(o){ pos[o.k] = o; });
      /* ---------- le gamma ---------- */
      if (!same){
        var up = EO > ER ? kO : kR, lo = EO > ER ? kR : kO, U = pos[up], D = pos[lo];
        var p1 = {x:ax - 20, y:U.ly}, p2 = {x:ax + 20, y:D.ly}, p3 = {x:ax - 20, y:D.ly}, p4 = {x:ax + 20, y:U.ly};
        var col = ok ? "#16a34a" : "#dc2626", loopY = D.ly + Math.max(16, (D.ly - U.ly) * 0.18);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round"; if (!ok) ctx.setLineDash([6, 4]);
        ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x - 4, p2.y - 4); ctx.bezierCurveTo(p2.x + 10, p2.y + 6, ax + 4, loopY, ax, loopY); ctx.bezierCurveTo(ax - 4, loopY, p3.x - 10, p3.y + 6, p3.x + 4, p3.y - 4);
        ctx.lineTo(p4.x, p4.y); ctx.stroke(); ctx.restore();
        ceText(ctx, "γ", ax + 26, loopY + 2, {align:"left", size:ph ? 14 : 17, w:800, color:col, halo:"#fff"});
        if (!ok){ var mx = (U.xo + D.xr) / 2; ceTag(ctx, "spontané : " + GA[up].ox + " + " + GA[lo].red + " (absents)", pw / 2, H - 40, {size:ph ? 8.5 : 9.5, bg:"#fee2e2", color:"#991b1b", clampW:pw}); }
      }

      hits = [];
      L.forEach(function(o){
        var cpl = GA[o.k], isO = o.k === kO, isR = o.k === kR, dep = cpl.h > 0;
        /* repère E° à pH 0 si le couple a bougé */
        if (dep && pH > 0){ var y0 = Y(cpl.E0); ctx.fillStyle = "rgba(100,116,139,.45)"; ctx.fillRect(ax - 7, y0 - 0.75, 14, 1.5); }
        ctx.fillStyle = dep ? "#0f766e" : "#475569"; ctx.fillRect(ax - 6, o.y - 1, 12, 2);
        ctx.strokeStyle = "rgba(100,116,139,.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ax - 7, o.y); ctx.lineTo(ax - 13, o.ly); ctx.moveTo(ax + 7, o.y); ctx.lineTo(ax + 13, o.ly); ctx.stroke();
        var fO = isO ? fs + 0.5 : fs, fR = isR ? fs + 0.5 : fs;
        var wO = ceTw(ctx, cpl.ox, fO, 800), wR = ceTw(ctx, cpl.red, fR, 800);
        if (isO){ ctx.save(); ceRR(ctx, ax - 17 - wO - 6, o.ly - 9, wO + 12, 18, 9); ctx.fillStyle = "#f59e0b"; ctx.fill(); ctx.restore(); }
        if (isR){ ctx.save(); ceRR(ctx, ax + 11, o.ly - 9, wR + 12, 18, 9); ctx.fillStyle = "#3b82f6"; ctx.fill(); ctx.restore(); }
        ceText(ctx, cpl.ox, ax - 17, o.ly, {align:"right", size:fO, w:800, color:isO ? "#fff" : "#7c2d12", halo:isO ? null : "rgba(255,255,255,.95)", hw:4});
        ceText(ctx, cpl.red, ax + 17, o.ly, {align:"left", size:fR, w:800, color:isR ? "#fff" : (GA_REDS.indexOf(o.k) >= 0 ? "#1e3a8a" : "#94a3b8"), halo:isR ? null : "rgba(255,255,255,.95)", hw:4});
        ceText(ctx, ceSigned(o.E, 2), 14, o.ly, {align:"left", size:ph ? 8.5 : 9.5, w:700, color:dep ? "#0f766e" : "#64748b"});
        hits.push({k:o.k, side:"ox", x0:ax - 22 - wO, x1:ax - 8, y:o.ly}); hits.push({k:o.k, side:"red", x0:ax + 8, x1:ax + 22 + wR, y:o.ly});
        o.xo = ax - 17 - wO / 2; o.xr = ax + 17 + wR / 2;
      });
      ctx.fillStyle = "rgba(80,160,230,.35)"; ctx.fillRect(14, H - 25, 8, 10); ceText(ctx, "eau stable (entre H⁺/H₂ et O₂/H₂O)", 26, H - 20, {align:"left", size:ph ? 8 : 9, color:"#1e5a85", w:700});
      /* ---------- bécher ---------- */
      var bx0 = pw + 4, bw = W - bx0 - 6;
      beakerBox = {x0:bx0};
      ctx.save(); ctx.beginPath(); ctx.rect(bx0, 0, W - bx0, H); ctx.clip();
      var sc = Math.min(bw / 3.0, H / 5.8), cx = bx0 + bw / 2, cy = H * 0.6;
      function P(p){ var q = ceRot(p, st.a, st.b), s = 1 / (1 - q[2] * 0.05); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2]}; }
      /* paillasse */
      var pa = [P([-1.7, 0, -1.5]), P([1.7, 0, -1.5]), P([1.7, 0, 1.5]), P([-1.7, 0, 1.5])];
      var gpa = ctx.createLinearGradient(0, Math.min(pa[0].y, pa[1].y), 0, Math.max(pa[2].y, pa[3].y)); gpa.addColorStop(0, "#5b6573"); gpa.addColorStop(1, "#353d48");
      ctx.fillStyle = gpa; cePoly(ctx, pa); ctx.fill();
      var pr = ok ? ceSmooth(Math.min(1, st.pr)) : 0, oC = GA[kO], rC = GA[kR];
      /* couleur du liquide : oxydant au départ, produits ensuite */
      var c0 = GA_SOL[oC.ox] || GA_WATER, prod = [GA_SOL[oC.red], GA_SOL[rC.ox]].filter(function(x){ return x; });
      var c1 = prod.length ? (prod.length > 1 ? ceMix(prod[0], prod[1], 0.5) : ceMix(GA_WATER, prod[0], 0.8)) : GA_WATER;
      if (GA_MET[rC.red] == null && GA_SOL[rC.red] && !ok) c0 = ceMix(c0, GA_SOL[rC.red], 0.3);
      var liq = ceMix(c0, ceMix(c0, c1, 0.85), pr), la = (GA_SOL[oC.ox] || prod.length) ? 0.55 : 0.3;
      var R0 = 1.0, hB = 2.5, hL = 1.7;
      ceShadow(ctx, P([0.2, 0, 0.2]).x, P([0.2, 0, 0.2]).y, R0 * sc * 1.15, R0 * sc * 0.35, 0.25);
      ceCyl(ctx, P, 0, 0, R0, 0, hB, "#dfe9f2", 0.35);
      ceCyl(ctx, P, 0, 0, R0 * 0.97, 0.04, hL, liq, la);
      var metal = GA_MET[rC.red] != null;
      /* réducteur : lame de métal plongée, ou compte-gouttes qui verse une solution */
      if (metal){
        var thin = 1 - 0.3 * pr;
        ceBox(ctx, P, -0.12 * thin, 0.12 * thin, 0.25, hB + 0.7, -0.35, 0.35, GA_MET[rC.red], st.a, st.b, {edge:"rgba(255,255,255,.35)"});
        /* dépôt du métal formé */
        if (GA_MET[oC.red] && pr > 0.02){ ctx.save(); ctx.globalAlpha = Math.min(0.95, pr * 1.3);
          for (var d = 0; d < 22; d++){ var q = P([0.13 * (d % 2 ? 1 : -1), 0.3 + (hL - 0.4) * ceHash(d, 3), -0.32 + 0.64 * ceHash(d, 4)]); ceBall(ctx, q.x, q.y, sc * (0.05 + 0.04 * ceHash(d, 5)), GA_MET[oC.red]); }
          ctx.restore(); }
      } else {
        var tip = P([0, hB + 0.35, 0]), top = P([0, hB + 1.4, 0]);
        ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = Math.max(4, sc * 0.16); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(top.x, top.y); ctx.stroke();
        ctx.fillStyle = "#e05a4f"; ceRR(ctx, top.x - sc * 0.14, top.y - sc * 0.4, sc * 0.28, sc * 0.42, sc * 0.1); ctx.fill(); ctx.restore();
        var dc = GA_SOL[rC.red] || "#cfe3f5";
        for (var dd = 0; dd < 2; dd++){ var f = (st.t * 0.9 + dd * 0.5) % 1, qd = P([0, hB + 0.3 - f * (hB + 0.3 - hL), 0]); ceBall(ctx, qd.x, qd.y, Math.max(2.5, sc * 0.06), dc, 1 - f * 0.5); }
      }
      /* précipité de métal (réducteur en solution) */
      if (!metal && GA_MET[oC.red] && pr > 0.02){ for (var pp = 0; pp < 14; pp++){ var fy = ((st.t * 0.25 + ceHash(pp, 6)) % 1), qp = P([-0.7 + 1.4 * ceHash(pp, 7), hL * (1 - fy * pr) * 0.9 + 0.08, -0.4 + 0.8 * ceHash(pp, 8)]); ceBall(ctx, qp.x, qp.y, sc * 0.04, GA_MET[oC.red], Math.min(1, pr * 1.5)); } }
      /* bulles de gaz formé (H₂ ou Cl₂) */
      var gas = oC.red === "H₂" ? "#f1f5f9" : rC.ox === "Cl₂" ? "#d9e57a" : null;
      if (gas && pr > 0.02){ for (var g2 = 0; g2 < 10; g2++){ var fb = (st.t * 0.6 + ceHash(g2, 9)) % 1, qb = P([metal ? 0.18 * (g2 % 2 ? 1 : -1) + 0.15 * Math.sin(fb * 6 + g2) : -0.4 + 0.8 * ceHash(g2, 10), 0.35 + fb * (hL - 0.4), -0.25 + 0.5 * ceHash(g2, 11)]);
        ctx.save(); ctx.globalAlpha = 0.85 * Math.min(1, pr * 2); ctx.strokeStyle = gas === "#f1f5f9" ? "rgba(255,255,255,.95)" : "#a9b53a"; ctx.fillStyle = ceRgba(gas, 0.5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(qb.x, qb.y, Math.max(2, sc * (0.035 + 0.03 * fb)), 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); } }
      /* avant du bécher : surface et verre */
      var top1 = ceRing(P, 0, 0, R0 * 0.97, hL); ctx.fillStyle = ceRgba(liq, Math.min(1, la * 0.6 + 0.12)); cePoly(ctx, top1); ctx.fill();
      var gtop = ceRing(P, 0, 0, R0, hB), gbot = ceRing(P, 0, 0, R0, 0), gh = ceHull(gtop.concat(gbot));
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.6; cePoly(ctx, gh); ctx.stroke(); ctx.strokeStyle = "rgba(140,160,185,.9)"; ctx.lineWidth = 1.2; cePoly(ctx, gtop); ctx.stroke();
      var gxs = gh.map(function(q){ return q.x; }), gmn = Math.min.apply(null, gxs), gmx = Math.max.apply(null, gxs), gys = gh.map(function(q){ return q.y; });
      ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = "#fff"; ctx.fillRect(gmn + (gmx - gmn) * 0.12, Math.min.apply(null, gys) + 8, Math.max(2, (gmx - gmn) * 0.05), (Math.max.apply(null, gys) - Math.min.apply(null, gys)) * 0.7); ctx.restore();
      /* étiquettes du bécher */
      var tsz = ph ? 9.5 : 11, btm = P([0, 0, R0]).y;
      ceTag(ctx, oC.ox + (oC.ox === "H⁺" ? " (acide)" : oC.ox === "O₂" ? " dissous" : ""), cx, Math.min(H - 40, btm + 14), {size:tsz, bg:"#fff7ed", color:"#9a3412", stroke:"#fdba74", clampW:W, clampL:bx0});
      var lt = metal ? "lame de " + rC.red : rC.red + " versé", ltop = P([0, hB + 1.55, 0]).y;
      ceTag(ctx, lt, cx, Math.max(14, ltop - 12), {size:tsz, bg:"#eff6ff", color:"#1e3a8a", stroke:"#93c5fd", clampW:W, clampL:bx0});
      ceTag(ctx, same ? "même couple : rien" : ok ? (pr > 0.05 ? "ça réagit" : "…") : "pas de réaction", cx, Math.min(H - 14, btm + 38), {size:tsz + 0.5, bg:same ? "#64748b" : ok ? "#16a34a" : "#dc2626", color:"#fff", clampW:W, clampL:bx0});

      if (ok){ var eqt = gaEq(kO, kR).txt; ceWrap(ctx, eqt, cx, Math.min(H - 14, btm + 38) + 24, bw - 12, ph ? 13 : 15, {size:ph ? 9.5 : 11, color:"#14532d", w:800, halo:"rgba(255,255,255,.85)"}); }
      ctx.restore();
      /* ---------- afficheurs et note ---------- */
      ro.set(0, oC.ox + "/" + oC.red + " : " + ceSigned(EO, 3) + " V"); ro.set(1, rC.ox + "/" + rC.red + " : " + ceSigned(ER, 3) + " V");
      ro.set(2, ceSigned(dE, 3) + " V");
      if (same){ ro.set(3, "—"); nt.set("L'oxydant et le réducteur appartiennent au même couple " + oC.ox + "/" + oC.red + " : ils coexistent, il n'y a rien à échanger.", "ok"); return; }
      var eq = gaEq(kO, kR), dG = -eq.n * 96485 * dE / 1000, lgK = eq.n * dE / 0.0592;
      ro.set(3, ceSigned(dG, 0) + " kJ/mol (n = " + eq.n + ")");
      var pHdep = (oC.h || rC.h) && pH > 0;
      var warn = "";
      if ((kO === "Mn" || kR === "Mn") && pH > 4) warn += " Attention : au-delà de pH 4 environ, MnO₄⁻ donne MnO₂ et non Mn²⁺.";
      else if (pH > 6 && (/²⁺|³⁺|⁺$/.test(oC.ox) && oC.ox !== "H⁺" || /²⁺|³⁺|⁺$/.test(rC.ox) && rC.ox !== "H⁺")) warn += " À ce pH, les ions métalliques précipitent en hydroxydes : on ne le représente pas.";
      var erT = ER < 0 ? "(" + ceFmt(ER, 3) + ")" : ceFmt(ER, 3), kT = pHdep ? "K' (à ce pH)" : "K";
      if (ok){
        nt.set("Réaction : <b>" + eq.txt + "</b>. ΔE = " + ceFmt(EO, 3) + " − " + erT + " = " + ceFmt(dE, 3) + " V > 0" + (pHdep ? " à pH " + ceFmt(pH, 1) : "") + " : l'oxydant est au-dessus du réducteur, le gamma est dans le bon sens. ΔrG = −" + eq.n + " × 96 485 × " + ceFmt(dE, 3) + " = " + ceFmt(dG, 0) + " kJ/mol ; " + kT + " = 10^(" + eq.n + " × " + ceFmt(dE, 3) + " / 0,0592) = 10^" + ceFmt(lgK, 1) + (lgK < 4 ? " : la réaction est équilibrée, pas totale." : " : réaction quasi totale.") + warn, lgK < 4 ? "warn" : "ok");
      } else {
        var inv = gaEq(kR, kO);
        nt.set("Le couple " + oC.ox + "/" + oC.red + " est sous le couple " + rC.ox + "/" + rC.red + " (ΔE = " + ceFmt(dE, 3) + " V < 0" + (pHdep ? " à pH " + ceFmt(pH, 1) : "") + ") : pas de réaction dans le bécher. C'est l'inverse qui serait spontané, " + inv.txt + ", mais ces espèces-là n'y sont pas." + warn, "warn");
      }
    });
  }
});

/* =====================================================================
   5. De O₂ à H₂O : la cascade des espèces réactives de l'oxygène (c08)
   ===================================================================== */
/* E°' à pH 7 (V) de chaque étape à un électron (valeurs usuelles en biochimie) */
var ER_STEPS = [
  {E:-0.33, eq:"O₂ + e⁻ → O₂•⁻", h:"", nom:"O₂ → superoxyde"},
  {E:0.94, eq:"O₂•⁻ + e⁻ + 2 H⁺ → H₂O₂", h:"+ 2 H⁺", nom:"superoxyde → peroxyde"},
  {E:0.32, eq:"H₂O₂ + e⁻ + H⁺ → •OH + H₂O", h:"+ H⁺", nom:"peroxyde → radical hydroxyle"},
  {E:2.31, eq:"•OH + e⁻ + H⁺ → H₂O", h:"+ H⁺", nom:"radical hydroxyle → eau"}
];
var ER_SP = ["O₂", "O₂•⁻", "H₂O₂", "•OH + H₂O", "2 H₂O"];
var ER_F = 96.485;   /* kJ·mol⁻¹·V⁻¹ */
function erDG(i){ return -ER_F * ER_STEPS[i].E; }
function erCum(i){ var s = 0; for (var j = 0; j < i; j++) s += erDG(j); return s; }
/* modèle de la membrane : 14 lipides, •OH frappe le n° 5, la chaîne va vers la droite ; vitamine E après les n° 3, 7 et 11 */
var ER_N = 14, ER_I0 = 5, ER_VITE = [3, 7, 11];
function erChain(vitE){ if (!vitE) return ER_N - ER_I0; var stop = ER_VITE.filter(function(v){ return v >= ER_I0; })[0]; return stop - ER_I0 + 1; }
/* petites molécules (Å) */
function erMol(sp){
  var c = Math.cos(52.25 * PI / 180), s = Math.sin(52.25 * PI / 180);
  if (sp === 0 || sp === 1) return {A:[["O", [-0.6, 0, 0]], ["O", [0.6, 0, 0]]], B:[[0, 1]]};
  if (sp === 2) return {A:[["O", [-0.73, 0, 0]], ["O", [0.73, 0, 0]], ["H", [-0.9, 0.95, 0]], ["H", [0.9, 0.95 * Math.cos(1.94), 0.95 * Math.sin(1.94)]]], B:[[0, 1], [0, 2], [1, 3]]};
  if (sp === 3) return {A:[["O", [-0.45, 0, 0]], ["H", [0.52, 0, 0]]], B:[[0, 1]]};
  return {A:[["O", [0, 0.2, 0]], ["H", [s * 0.96, 0.2 - c * 0.96, 0]], ["H", [-s * 0.96, 0.2 - c * 0.96, 0]]], B:[[0, 1], [0, 2]]};
}
function erDrawMol(ctx, sp, x, y, sz, a, b, glow){
  var M = erMol(sp), pts = M.A.map(function(at){ var q = ceRot(at[1], a, b); return {x:x + q[0] * sz, y:y - q[1] * sz, z:q[2], e:at[0]}; });
  if (glow){ var g = ctx.createRadialGradient(x, y, 0, x, y, sz * 2.2); g.addColorStop(0, "rgba(255,90,60," + glow + ")"); g.addColorStop(1, "rgba(255,90,60,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, sz * 2.2, 0, 7); ctx.fill(); }
  M.B.forEach(function(bd){ ceStick(ctx, pts[bd[0]], pts[bd[1]], Math.max(2.5, sz * 0.22), "#c3ccd6"); });
  pts.map(function(p, i){ return i; }).sort(function(u, v){ return pts[u].z - pts[v].z; }).forEach(function(i){ var p = pts[i]; ceBall(ctx, p.x, p.y, sz * (p.e === "O" ? 0.5 : 0.32), p.e === "O" ? "#d6392f" : "#eef2f6"); });
  /* électron célibataire et charge */
  if (sp === 1 || sp === 3){ var o = pts[0], dx = sp === 1 ? 0 : -sz * 0.35; ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.arc(o.x + dx, o.y - sz * 0.62, Math.max(1.6, sz * 0.09), 0, 7); ctx.fill(); }
  if (sp === 1) ceText(ctx, "−", x + sz * 1.05, y - sz * 0.55, {size:sz * 0.9, w:800, color:"#1d4ed8"});
}

SFA.sim({
  id:"ch-especes-reactives-oxygene", ch:"c08", tag:"Oxydoréduction",
  titre:"De O₂ à H₂O : la cascade des espèces réactives",
  resume:"O₂ reçoit ses quatre électrons un par un : superoxyde O₂•⁻, peroxyde H₂O₂, radical hydroxyle •OH, puis eau. Sur l'échelle d'énergie, le premier pas monte et le dernier dégringole. Dans la membrane, un •OH arrache un H à un lipide et lance une réaction en chaîne ; la SOD, la catalase et la vitamine E la coupent.",
  but:"Clique une marche de l'escalier (ou choisis une étape) pour lire son potentiel et son ΔG'. Puis regarde la membrane : un superoxyde sort de la mitochondrie, devient H₂O₂, et le fer en fait un •OH qui attaque un lipide. Active la SOD, la catalase, la vitamine E, ou retire le fer, et compte les lipides abîmés. Glisse sur la membrane pour la tourner.",
  aRetenir:"La réduction complète O₂ + 4 e⁻ + 4 H⁺ → 2 H₂O (E°' ≈ +0,81 V à pH 7) se fait normalement d'un bloc dans la cytochrome c oxydase. Si les électrons arrivent un par un, on traverse des espèces réactives : O₂•⁻ (E°' = −0,33 V : premier pas difficile), H₂O₂ (+0,94 V), •OH (+0,32 V) puis H₂O (+2,31 V : •OH est l'oxydant le plus violent du vivant). ΔG' = −F·E°' pour chaque électron. Défenses : la SOD change O₂•⁻ en H₂O₂ + O₂, la catalase change H₂O₂ en H₂O + O₂, et la vitamine E, liposoluble, cède un H au radical peroxyle lipidique (LOO• + TOH → LOOH + TO•) et arrête la chaîne de peroxydation.",
  piege:"La SOD seule ne protège pas : elle fabrique du H₂O₂, que le fer (réaction de Fenton, Fe²⁺ + H₂O₂ → Fe³⁺ + OH⁻ + •OH) peut changer en •OH ; il faut la catalase (ou la glutathion peroxydase) derrière. La vitamine E n'empêche pas la première attaque : elle limite la longueur de la chaîne. Les potentiels sont des E°' à pH 7 dont l'état standard varie selon les sources : −0,33 V pour O₂ à 1 bar, −0,16 V pour O₂ à 1 mol/L ; ±0,05 V pour les autres. Le nombre de lipides abîmés est celui de ce modèle (14 lipides, vitamine E tous les 4), pas une mesure.",
  build:function(k, S){
    var c = ceCanvas(k, 1.02, 1.45);
    var st = {t:0, a:-0.35, b:0.42, idle:9, cyc:0};
    var sS = k.seg("Étape de la cascade", [["0", "1 : O₂ → O₂•⁻"], ["1", "2 : → H₂O₂"], ["2", "3 : → •OH"], ["3", "4 : → H₂O"]], "0");
    var sodT = k.toggle("SOD (superoxyde dismutase)", false, function(){ st.cyc = 0; });
    var catT = k.toggle("Catalase", false, function(){ st.cyc = 0; });
    var veT = k.toggle("Vitamine E dans la membrane", false, function(){ st.cyc = 0; });
    var feT = k.toggle("Fer libre Fe²⁺ (réaction de Fenton)", true, function(){ st.cyc = 0; });
    var ro = k.readouts(["Étape choisie", "E°' de l'étape (pH 7)", "ΔG' de l'étape = −F·E°'", "Lipides oxydés par un seul •OH"]);
    var nt = k.note("", "ok");
    var plats = [], ladH = 0;
    st.onPtr = function(type, p){
      if (type !== "down" || p.y > ladH) return false;
      var best = null; plats.forEach(function(q, i){ if (i > 0 && Math.abs(p.x - q.x) < q.w / 2 && p.y > q.y - 50 && p.y < q.y + 22) best = i; });
      if (best != null){ sS.set(String(best - 1)); k.redraw(); }
      return true;
    };
    ceDrag(c, st, 0.006, 0.01, 0.15, 0.85);
    var lp = k.loop(function(dt){
      st.t += dt; st.cyc = (st.cyc + dt) % 11; st.idle += dt;
      if (!st.drag && st.idle > 3) st.a = -0.35 + 0.25 * Math.sin(st.t * 0.25);
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, sel = +sS.value, t = st.t, u = st.cyc;
      var sod = sodT.value, cat = catT.value, vitE = veT.value, fe = feT.value;
      ctx.clearRect(0, 0, W, H);
      /* ---------- escalier d'énergie ---------- */
      ladH = Math.round(H * (ph ? 0.5 : 0.45));
      var g0 = ctx.createLinearGradient(0, 0, 0, ladH); g0.addColorStop(0, "#101c33"); g0.addColorStop(1, "#1b2d4d");
      ctx.fillStyle = g0; ctx.fillRect(0, 0, W, ladH);
      var x0 = ph ? 44 : 58, x1 = W - 14, dx = (x1 - x0) / 5, yT = ph ? 42 : 52, yB = ladH - 28, Gmax = 50, Gmin = -330;
      function GY(G){ return yT + (Gmax - G) / (Gmax - Gmin) * (yB - yT); }
      ceText(ctx, "O₂ reçoit 4 e⁻ un par un (pH 7)", W / 2, 16, {size:ph ? 11 : 12.5, w:800, color:"#e2e8f0"});
      ctx.save(); ctx.translate(12, (yT + yB) / 2); ctx.rotate(-PI / 2); ceText(ctx, "ΔG' cumulé (kJ/mol)", 0, 0, {size:ph ? 8.5 : 9.5, w:700, color:"#94a3b8"}); ctx.restore();
      for (var G = 0; G >= -300; G -= 100){ var yg = GY(G); ctx.fillStyle = "rgba(148,163,184,.25)"; ctx.fillRect(x0 - 8, yg, x1 - x0 + 8, 1); ceText(ctx, ceFmt(G, 0), x0 - 10, yg, {align:"right", size:ph ? 8 : 9, color:"#94a3b8", w:600}); }
      plats = [];
      for (var i = 0; i < 5; i++){
        var Gi = erCum(i), px = x0 + dx * (i + 0.5), py = GY(Gi), pw2 = dx * 0.72;
        plats.push({x:px, y:py, w:pw2});
        var on = i === sel || i === sel + 1;
        var gp = ctx.createLinearGradient(0, py, 0, py + 7); gp.addColorStop(0, on ? "#fbbf24" : "#64748b"); gp.addColorStop(1, on ? "#b45309" : "#334155");
        ctx.fillStyle = gp; ceRR(ctx, px - pw2 / 2, py, pw2, 7, 3); ctx.fill();
        ceText(ctx, ER_SP[i], px, py + 17, {size:ph ? 9 : 10.5, w:800, color:on ? "#fde68a" : "#cbd5e1"});
      }
      /* marches et leurs potentiels : chaque étiquette prend la première place libre (noms, paliers, molécules, autres étiquettes) */
      var lsz = ph ? 9 : 10.5, msz = Math.min(dx * 0.17, ph ? 10 : 13), tsz2 = ph ? 8.5 : 10, obst = [];
      plats.forEach(function(q, i){
        var lw = ceTw(ctx, ER_SP[i], lsz, 800) + 2;
        obst.push([q.x - lw / 2, q.y + 17 - lsz / 2 - 1, q.x + lw / 2, q.y + 17 + lsz / 2 + 1]);
        obst.push([q.x - q.w / 2, q.y - 1, q.x + q.w / 2, q.y + 8]);
        obst.push([q.x - msz * 1.9, q.y - msz * 3.2, q.x + msz * 1.9, q.y - msz * 0.3]);   /* molécule (H₂O₂ est la plus large) */
      });
      function hit(r){ var s = 0; obst.forEach(function(o){ var ox = Math.min(r[2], o[2]) - Math.max(r[0], o[0]), oy = Math.min(r[3], o[3]) - Math.max(r[1], o[1]); if (ox > 0 && oy > 0) s += ox * oy; }); return s; }
      for (var j = 0; j < 4; j++){
        var A = plats[j], B = plats[j + 1], on2 = j === sel, colS = ER_STEPS[j].E < 0 ? "#f87171" : "#34d399";
        ctx.save(); ctx.strokeStyle = on2 ? colS : "rgba(148,163,184,.55)"; ctx.lineWidth = on2 ? 2.6 : 1.4; ctx.setLineDash(on2 ? [] : [4, 3]);
        ctx.beginPath(); ctx.moveTo(A.x + A.w / 2, A.y + 3); ctx.lineTo(B.x - B.w / 2, B.y + 3); ctx.stroke(); ctx.restore();
        var mxs = (A.x + B.x) / 2, mys = (A.y + B.y) / 2 + 3, lab = ceSigned(ER_STEPS[j].E, 2) + " V";
        var tw2 = ceTw(ctx, lab, tsz2, 800) + 14, th2 = tsz2 + 9, down = B.y > A.y;
        var cand = down ? [[0, 0], [0, 14], [0, -12], [dx * 0.18, -12], [-dx * 0.18, 14], [0, 30], [dx * 0.3, -24], [-dx * 0.3, 26], [dx * 0.4, 0], [-dx * 0.35, 0]] : [[0, 26], [0, 0], [0, -14], [dx * 0.18, 26]];
        var bestC = null, bestS = 1e9;
        cand.forEach(function(cd){ var cxx = Math.max(x0 + tw2 / 2, Math.min(W - 4 - tw2 / 2, mxs + cd[0])), cyy = mys + cd[1], r = [cxx - tw2 / 2, cyy - th2 / 2, cxx + tw2 / 2, cyy + th2 / 2], s = hit(r); if (s < bestS - 0.5){ bestS = s; bestC = [cxx, cyy, r]; } });
        obst.push(bestC[2]);
        ceTag(ctx, lab, bestC[0], bestC[1], {size:tsz2, bg:on2 ? colS : "rgba(15,23,42,.85)", color:on2 ? "#0f172a" : "#e2e8f0"});
      }
      /* molécules en 3D sur chaque marche ; le jeton parcourt l'escalier */
      var tok = (t / 1.4) % 6, ti = Math.min(4, Math.floor(tok)), tf = tok - Math.floor(tok);
      for (var m = 0; m < 5; m++){
        var Pm = plats[m], sz = Math.min(dx * 0.17, ph ? 10 : 13), hot = m === ti && tok < 5;
        erDrawMol(ctx, m, Pm.x, Pm.y - sz * 1.7, sz, t * 0.9 + m, 0.35, hot ? 0.35 : (m === 3 ? 0.25 : 0));
      }
      if (tok < 4){
        var Pa = plats[ti], Pb = plats[ti + 1], ff = ceSmooth(tf), ex = Pa.x + (Pb.x - Pa.x) * ff, ey = Math.min(Pa.y, Pb.y) - 30 - Math.sin(ff * PI) * 14 + (Pa.y - Math.min(Pa.y, Pb.y)) * (1 - ff) + (Pb.y - Math.min(Pa.y, Pb.y)) * ff;
        ey = Math.max(ey, yT - 4);   /* le jeton ne monte pas sur le titre */
        var ge = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10); ge.addColorStop(0, "rgba(255,226,90,.9)"); ge.addColorStop(1, "rgba(255,226,90,0)"); ctx.fillStyle = ge; ctx.beginPath(); ctx.arc(ex, ey, 10, 0, 7); ctx.fill();
        ceBall(ctx, ex, ey, 4.5, "#f5c518"); ceText(ctx, "e⁻", ex + 9, ey - 7, {size:9, w:800, color:"#fde68a", align:"left"});
      }

      /* ---------- la membrane ---------- */
      var my0 = ladH, mh = H - ladH;
      var g1 = ctx.createLinearGradient(0, my0, 0, H); g1.addColorStop(0, "#e8f3f7"); g1.addColorStop(0.55, "#d8ebf2"); g1.addColorStop(1, "#f3e9d8");
      ctx.fillStyle = g1; ctx.fillRect(0, my0, W, mh);
      var sc = Math.min(W / 9.6, mh / 6.6), cx = W / 2, cy = my0 + mh * 0.6;
      function P(p){ var q = ceRot([p[0], p[1] + 0.4, p[2] + 0.6], st.a, st.b), s = 1 / (1 - q[2] * 0.04); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2]}; }
      ctx.save(); ctx.beginPath(); ctx.rect(0, my0, W, mh); ctx.clip();
      /* chronologie du cycle (11 s) */
      var nChain = erChain(vitE), hasOH = fe && !cat, dmgStart = 4.8, step = 0.55;
      var nd = hasOH && u > dmgStart ? Math.min(nChain, Math.floor((u - dmgStart) / step) + 1) : 0;
      function lipX(i){ return -3.9 + 0.6 * i; }
      /* lipides : rangées arrière puis rangée avant (celle de la chaîne) */
      var rows = [-1.6, -0.8, 0];
      rows.forEach(function(z, rI){
        for (var i = 0; i < ER_N; i++){
          var xl = lipX(i) + (rI === 1 ? 0.3 : 0), front = rI === 2;
          var damaged = front && i >= ER_I0 && i < ER_I0 + nd, radical = front && damaged && i === ER_I0 + nd - 1 && u < dmgStart + nChain * step + 0.6;
          var tailCol = damaged ? (radical ? "#ef4444" : "#a0522d") : "#e8c35a", headCol = damaged ? "#c2410c" : "#6b8fb5";
          [[0, -1], [-2.5, 1]].forEach(function(lf){
            var yh = lf[0], dir = lf[1];
            for (var tt = 0; tt < 2; tt++){
              var pts = []; for (var sgm = 0; sgm <= 6; sgm++){ var yy = yh + dir * (0.15 + sgm * 0.16), kink = damaged && lf[0] === 0 && tt === 0 && sgm > 3 ? 0.18 : 0; pts.push(P([xl - 0.1 + tt * 0.2 + Math.sin(sgm * 1.6 + i + tt) * 0.05 + kink, yy, z])); }
              ctx.save(); ctx.strokeStyle = lf[0] === 0 ? tailCol : "#e8c35a"; ctx.globalAlpha = front ? 1 : 0.55; ctx.lineWidth = Math.max(1.5, sc * 0.07); ctx.lineCap = "round"; ctx.beginPath(); pts.forEach(function(q, n2){ n2 ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.restore();
            }
            var hq = P([xl, yh, z]); ceBall(ctx, hq.x, hq.y, sc * 0.2 * (front ? 1 : 0.9), lf[0] === 0 ? headCol : "#6b8fb5", front ? 1 : 0.6);
          });
          if (radical){ var rq = P([xl, -0.5, z]); var gr2 = ctx.createRadialGradient(rq.x, rq.y, 0, rq.x, rq.y, sc * 0.55); gr2.addColorStop(0, "rgba(255,80,60,.75)"); gr2.addColorStop(1, "rgba(255,80,60,0)"); ctx.fillStyle = gr2; ctx.beginPath(); ctx.arc(rq.x, rq.y, sc * 0.55, 0, 7); ctx.fill(); }
        }
        /* vitamine E dans la rangée avant */
        if (rI === 2 && vitE) ER_VITE.forEach(function(v){
          var xv = lipX(v) + 0.3, used = hasOH && v >= ER_I0 && v === ER_I0 + nChain - 1 && nd >= nChain;
          var tq = P([xv, -1.1, 0.12]), hq2 = P([xv, -0.12, 0.12]);
          ctx.save(); ctx.strokeStyle = used ? "#d6b98a" : "#d97706"; ctx.lineWidth = Math.max(1.5, sc * 0.06); ctx.beginPath(); ctx.moveTo(hq2.x, hq2.y); ctx.lineTo(tq.x, tq.y); ctx.stroke(); ctx.restore();
          ceBall(ctx, hq2.x, hq2.y, sc * 0.2, used ? "#e8d3a8" : "#f59e0b");
          if (!ph || used) ceText(ctx, used ? "E•" : "E", hq2.x, hq2.y + 0.5, {size:Math.max(8, sc * 0.2), w:800, color:"#7c2d12"});
        });
      });
      /* mitochondrie */
      var mq = P([-3.4, 2.4, -0.6]), mr = sc * 0.9;
      ctx.save(); ctx.translate(mq.x, mq.y); var gm = ctx.createRadialGradient(-mr * 0.3, -mr * 0.2, 2, 0, 0, mr * 1.2); gm.addColorStop(0, "#fca5a5"); gm.addColorStop(1, "#b45353");
      ctx.fillStyle = gm; ctx.beginPath(); ctx.ellipse(0, 0, mr * 1.1, mr * 0.6, -0.15, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(255,235,235,.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); for (var cr = 0; cr < 5; cr++){ var xc = -mr * 0.75 + cr * mr * 0.38; ctx.moveTo(xc, -mr * 0.4); ctx.quadraticCurveTo(xc + mr * 0.18, 0, xc, mr * 0.4); } ctx.stroke(); ctx.restore();
      ceText(ctx, "mitochondrie", mq.x, mq.y + mr * 0.85, {size:ph ? 8.5 : 9.5, w:800, color:"#7f1d1d", halo:"rgba(255,255,255,.8)"});
      /* enzymes et fer */
      var sodP = P([-1.6, 2.4, -0.4]), catP = P([1.6, 2.6, -0.4]), feP = P([lipX(ER_I0) + 0.1, 1.15, 0]);
      function blob(q, col, lab, act){ ctx.save(); ctx.globalAlpha = act ? 1 : 0.28; var gb = ctx.createRadialGradient(q.x - sc * 0.15, q.y - sc * 0.15, 2, q.x, q.y, sc * 0.5); gb.addColorStop(0, ceShade(col, 0.5)); gb.addColorStop(1, col); ctx.fillStyle = gb; ctx.beginPath();
        for (var bI = 0; bI <= 12; bI++){ var an = bI / 12 * 2 * PI, rr = sc * (0.42 + 0.06 * Math.sin(an * 3 + 1)); bI ? ctx.lineTo(q.x + Math.cos(an) * rr, q.y + Math.sin(an) * rr * 0.85) : ctx.moveTo(q.x + Math.cos(an) * rr, q.y + Math.sin(an) * rr * 0.85); } ctx.closePath(); ctx.fill(); ctx.restore();
        ceText(ctx, lab, q.x, q.y - sc * 0.62, {size:ph ? 8.5 : 9.5, w:800, color:act ? "#0f172a" : "#94a3b8", halo:"rgba(255,255,255,.85)"}); }
      blob(sodP, "#16a34a", "SOD", sod); blob(catP, "#7c3aed", "catalase", cat);
      if (fe){ var fe3 = hasOH && u > 4.0 && u < 10.8; ceBall(ctx, feP.x, feP.y, sc * 0.24, fe3 ? "#b45309" : "#f97316"); ceText(ctx, fe3 ? "Fe³⁺" : "Fe²⁺", feP.x + sc * 0.32, feP.y - sc * 0.2, {align:"left", size:ph ? 8.5 : 9.5, w:800, color:"#9a3412", halo:"rgba(255,255,255,.85)"}); }
      /* l'espèce réactive qui voyage */
      function lerp(a1, b1, f){ return {x:a1.x + (b1.x - a1.x) * f, y:a1.y + (b1.y - a1.y) * f}; }
      var msz = Math.max(5, sc * 0.26), m0 = P([-2.6, 2.4, -0.5]), tag = null, tq2 = null;
      if (u < 1.6){ tq2 = lerp(m0, sodP, u / 1.6); erDrawMol(ctx, 1, tq2.x, tq2.y, msz, t * 2, 0.3, 0.3); tag = "O₂•⁻"; }
      else if (u < 2.6){
        var conv = sod ? Math.min(1, (u - 1.6) / 0.3) : (u - 1.6) / 1.0;
        tq2 = sod ? sodP : lerp(sodP, P([-1.2, 2.0, -0.3]), (u - 1.6) / 1.0);
        erDrawMol(ctx, conv < 1 ? 1 : 2, tq2.x + (sod ? sc * 0.6 : 0), tq2.y, msz, t * 2, 0.3, 0); tag = conv < 1 ? (sod ? "SOD : → H₂O₂ + O₂" : "O₂•⁻ (dismutation lente)") : "H₂O₂";
      } else if (u < 4.0){
        var from = sod ? P([-1.0, 2.4, -0.4]) : P([-1.2, 2.0, -0.3]), f2 = (u - 2.6) / 1.4;
        if (cat){ tq2 = lerp(from, catP, f2); tag = "H₂O₂ → catalase"; }
        else if (fe){ tq2 = lerp(from, feP, f2); tag = "H₂O₂"; }
        else { tq2 = lerp(from, P([3.4, 1.8, -0.3]), f2); tag = "H₂O₂ (sans fer : peu réactif)"; }
        erDrawMol(ctx, 2, tq2.x, tq2.y, msz, t * 2, 0.3, 0);
      } else if (u < dmgStart){
        if (cat){ var fb2 = (u - 4.0) / 0.8; for (var bb = 0; bb < 3; bb++){ ceBall(ctx, catP.x + sc * (0.5 + 0.3 * bb) * fb2, catP.y - sc * 0.6 * fb2 - bb * 4, sc * 0.1, bb === 1 ? "#d6392f" : "#9cc3ff", 1 - fb2 * 0.6); } tag = "2 H₂O₂ → 2 H₂O + O₂"; tq2 = catP; }
        else if (fe){ var lq = P([lipX(ER_I0), 0, 0]); tq2 = lerp(feP, lq, (u - 4.0) / 0.8); erDrawMol(ctx, 3, tq2.x, tq2.y, msz, t * 3, 0.3, 0.5); tag = "•OH (Fenton)"; }
      }
      if (tag && tq2){
        /* l'étiquette mobile ne doit pas cacher le nom d'une enzyme : sinon au-dessus du nom, ou sous l'enzyme */
        var tfs = ph ? 9 : 10.5, tw3 = ceTw(ctx, tag, tfs, 800) + 14, th3 = tfs + 9, lfs = ph ? 8.5 : 9.5;
        var tx3 = Math.max(4 + tw3 / 2, Math.min(W - 4 - tw3 / 2, tq2.x));
        var labs = [[sodP, "SOD", -sc * 0.62], [catP, "catalase", -sc * 0.62], [mq, "mitochondrie", mr * 0.85]].map(function(e){ var lw = ceTw(ctx, e[1], lfs, 800) + 4, ly = e[0].y + e[2]; return {q:e[0], r:[e[0].x - lw / 2, ly - lfs / 2 - 1, e[0].x + lw / 2, ly + lfs / 2 + 1], dn:e[2] > 0 ? ly + lfs / 2 + 3 + th3 / 2 : e[0].y + sc * 0.5 + th3 / 2 + 2}; });
        if (fe){ var fl = ceTw(ctx, "Fe³⁺", lfs, 800) + 4, fy = feP.y - sc * 0.2; labs.push({q:feP, r:[feP.x - sc * 0.26, fy - lfs / 2 - 1, feP.x + sc * 0.32 + fl, Math.max(fy + lfs / 2 + 1, feP.y + sc * 0.26)], dn:feP.y + sc * 0.3 + th3 / 2 + 2}); }
        function clash(y){ return labs.filter(function(L){ return Math.min(tx3 + tw3 / 2, L.r[2]) - Math.max(tx3 - tw3 / 2, L.r[0]) > 0 && Math.min(y + th3 / 2, L.r[3]) - Math.max(y - th3 / 2, L.r[1]) > 0; })[0]; }
        var ty3 = tq2.y - msz * 2.2, cL = clash(ty3);
        if (cL){ var cands = [ty3]; labs.forEach(function(L){ cands.push(L.r[1] - th3 / 2 - 2, L.dn); });
          var okY = cands.filter(function(y){ return y - th3 / 2 >= my0 + 2 && y + th3 / 2 <= H - 2 && !clash(y); });
          if (okY.length) ty3 = okY.sort(function(u, v){ return Math.abs(u - ty3) - Math.abs(v - ty3); })[0]; }
        ceTag(ctx, tag, tx3, ty3, {size:tfs, bg:"rgba(15,27,45,.88)", color:"#fff", clampW:W});
      }
      if (hasOH && u >= dmgStart){
        var lastI = ER_I0 + nd - 1, lq2 = P([lipX(lastI), 0.15, 0]);
        var done = nd >= nChain, msg = done ? (vitE ? "chaîne coupée par la vitamine E" : "chaîne : " + nChain + " lipides oxydés") : "L• + O₂ → LOO• ; LOO• + LH → LOOH + L•";
        var tpos = P([2.0, 1.0, 0]);
        ceTag(ctx, msg, ceClamp(tpos.x, 90, W - 90), tpos.y, {size:ph ? 9 : 10.5, bg:done ? (vitE ? "#16a34a" : "#b91c1c") : "rgba(15,27,45,.88)", color:"#fff", clampW:W});
      }
      ctx.restore();
      ctx.fillStyle = "rgba(15,27,45,.25)"; ctx.fillRect(0, my0, W, 1.5);

      /* ---------- afficheurs ---------- */
      var S0 = ER_STEPS[sel], dG = erDG(sel), nL = hasOH ? nChain : 0;
      ro.set(0, S0.eq); ro.set(1, ceSigned(S0.E, 2) + " V"); ro.set(2, ceSigned(dG, 1) + " kJ/mol"); ro.set(3, String(nL));
      var tot = erCum(4);
      var txt = "Étape " + (sel + 1) + " (" + S0.nom + ") : ΔG' = −F·E°' = −96,485 × " + (S0.E < 0 ? "(" + ceFmt(S0.E, 2) + ")" : ceFmt(S0.E, 2)) + " = " + ceSigned(dG, 1) + " kJ/mol" + (dG > 0 ? " : ce premier électron coûte de l'énergie, c'est pourquoi O₂ réagit lentement seul." : ".") +
        " Sur les 4 électrons : ΔG' = " + ceFmt(tot, 1) + " kJ/mol, soit E°' moyen = " + ceFmt(-tot / (4 * ER_F), 2) + " V (O₂/H₂O à pH 7). ";
      if (!fe) txt += "Sans fer libre, H₂O₂ ne donne pas de •OH : la membrane est épargnée.";
      else if (cat) txt += "La catalase détruit H₂O₂ avant qu'il rencontre le fer : pas de •OH, membrane intacte." + (sod ? " SOD + catalase : la paire complète." : "");
      else txt += (sod ? "La SOD accélère la formation de H₂O₂ mais ne suffit pas : le" : "Le") + " fer fait un •OH (Fenton) qui arrache un H à un lipide ; " + (vitE ? "la vitamine E arrête la chaîne après " + nL + " lipides." : "la chaîne de peroxydation abîme " + nL + " lipides de proche en proche.");
      nt.set(txt, nL > 0 ? "warn" : "ok");
    });
  }
});

/*__CE_SUITE__*/
})();
