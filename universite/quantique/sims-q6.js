/* Physique quantique · lot Q6 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-h2plus-liaison · pq-bandes-solide · pq-rotation-vibration-co (pq10 : molécules et solides)
   Aucune ressource externe : la 3D est une projection faite main (faces triées par profondeur). */
(function(){
"use strict";
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018) ---------- */
var HP = 6.62607015e-34, HB = HP / TAU, ME = 9.1093837015e-31, QE = 1.602176634e-19, CL = 2.99792458e8;
var UMA = 1.66053906660e-27, KB = 1.380649e-23, MUB = 9.2740100783e-24, A0PM = 52.917721, RYEV = 13.605693;
var HC_EVNM = HP * CL / QE * 1e9; /* 1239,84 eV·nm */

/* ---------- petites aides (préfixe q) ---------- */
function zrgb(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function zshade(col, f){
  var c = typeof col === "string" ? zrgb(col) : col;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function za(col, a){ var c = typeof col === "string" ? zrgb(col) : col; return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
function zfz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function zN(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d == null ? 2 : d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
var SUPD = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
/* notation scientifique : d chiffres après la virgule de la mantisse */
function zsci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return zN(x, Math.max(0, d - e));
  return zN(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : String(e).split("").map(function(ch){ return SUPD[ch]; }).join(""));
}
function zT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function zrr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function zball(ctx, x, y, r, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, zshade(col, 0.75)); g.addColorStop(0.45, zshade(col, 0)); g.addColorStop(1, zshade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, TAU); ctx.fill(); ctx.restore();
}
function zglow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, za(col, a == null ? 0.8 : a)); g.addColorStop(1, za(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
/* couleur perçue d'une longueur d'onde (nm) ; en dehors du visible : violet pâle (UV) ou rouge sombre (IR) */
function zwl(nm){
  var r = 0, g = 0, b = 0;
  if (nm < 380) return [150, 90, 255];
  if (nm < 440){ r = (440 - nm) / 60; b = 1; }
  else if (nm < 490){ g = (nm - 440) / 50; b = 1; }
  else if (nm < 510){ g = 1; b = (510 - nm) / 20; }
  else if (nm < 580){ r = (nm - 510) / 70; g = 1; }
  else if (nm < 645){ r = 1; g = (645 - nm) / 65; }
  else if (nm <= 780){ r = 1; }
  else return [120, 20, 20];
  var f = nm < 420 ? 0.35 + 0.65 * (nm - 380) / 40 : nm > 700 ? 0.35 + 0.65 * (780 - nm) / 80 : 1;
  return [Math.round(255 * Math.pow(r * f, 0.8)), Math.round(255 * Math.pow(g * f, 0.8)), Math.round(255 * Math.pow(b * f, 0.8))];
}
/* graduation « ronde » : pas proche de span/n */
function zstep(span, n){ var s = span / n, p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }

/* ---------- moteur 3D minimal : vue orbitale, faces planes éclairées, triées par profondeur ---------- */
function Z3(){ this.a = -0.5; this.b = 0.35; this.sc = 40; this.cx = 0; this.cy = 0; this.f = 14; this.L = []; this.set(); }
Z3.prototype.set = function(){ this.ca = Math.cos(this.a); this.sa = Math.sin(this.a); this.cb = Math.cos(this.b); this.sb = Math.sin(this.b); };
/* monde (x, y vers le haut, z) → vue (x à droite, y en haut, z vers toi) */
Z3.prototype.rot = function(x, y, z){
  var x1 = x * this.ca + z * this.sa, z1 = -x * this.sa + z * this.ca;
  return [x1, y * this.cb - z1 * this.sb, y * this.sb + z1 * this.cb];
};
Z3.prototype.pv = function(v){ var s = this.f ? this.f / (this.f - v[2]) : 1; return {x:this.cx + v[0] * this.sc * s, y:this.cy - v[1] * this.sc * s, z:v[2], s:s}; };
Z3.prototype.p = function(x, y, z){ return this.pv(this.rot(x, y, z)); };
Z3.prototype.clear = function(){ this.L = []; };
/* face : points monde, couleur ; o.c = centre de l'objet (oriente la normale vers l'extérieur), o.cull, o.alpha, o.glow (sans ombrage) */
Z3.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
Z3.prototype.sprite = function(x, y, z, fn){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + 1e-3, fn:fn, v:v}); };
Z3.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], q = {c:c, cull:true, alpha:o.alpha, line:o.line, tag:o.tag};
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    var cc = o.cols ? o.cols[i] || col : col, qq = q;
    if (o.after && o.afterFace === i){ qq = {c:c, cull:true, alpha:o.alpha, line:o.line, after:o.after}; }
    this.face(f.map(function(j){ return P[j]; }), cc, qq);
  }, this);
};
/* cylindre de l'axe p0 → p1, rayon r, n côtés */
Z3.prototype.cyl = function(p0, p1, r, n, col, o){
  o = o || {}; n = n || 14;
  var ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], la = Math.hypot(ax[0], ax[1], ax[2]); ax = [ax[0] / la, ax[1] / la, ax[2] / la];
  var t = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  var u = [ax[1] * t[2] - ax[2] * t[1], ax[2] * t[0] - ax[0] * t[2], ax[0] * t[1] - ax[1] * t[0]], lu = Math.hypot(u[0], u[1], u[2]); u = [u[0] / lu, u[1] / lu, u[2] / lu];
  var w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
  var r1 = o.r1 == null ? r : o.r1, c = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2], q = {c:c, cull:true, alpha:o.alpha};
  var A = [], B = [];
  for (var i = 0; i < n; i++){
    var th = i / n * TAU, cs = Math.cos(th), sn = Math.sin(th);
    A.push([p0[0] + r * (cs * u[0] + sn * w[0]), p0[1] + r * (cs * u[1] + sn * w[1]), p0[2] + r * (cs * u[2] + sn * w[2])]);
    B.push([p1[0] + r1 * (cs * u[0] + sn * w[0]), p1[1] + r1 * (cs * u[1] + sn * w[1]), p1[2] + r1 * (cs * u[2] + sn * w[2])]);
  }
  for (i = 0; i < n; i++){ var j = (i + 1) % n; this.face([A[i], A[j], B[j], B[i]], col, q); }
  if (!o.open){ this.face(A.slice(), o.cap0 || col, q); this.face(B.slice(), o.cap1 || col, q); }
};
/* rendu : faces et sprites du plus loin au plus proche */
Z3.prototype.render = function(ctx){
  var self = this, L = this.L, Lt = [-0.42, 0.62, 0.66], i;
  for (i = 0; i < L.length; i++){
    var it = L[i]; if (it.t) continue;
    var V = it.pts.map(function(p){ return self.rot(p[0], p[1], p[2]); });
    var a = V[0], b = V[1], c = V[2];
    var n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
    var ln = Math.hypot(n[0], n[1], n[2]) || 1; n = [n[0] / ln, n[1] / ln, n[2] / ln];
    var zc = 0, m = [0, 0, 0]; V.forEach(function(v){ zc += v[2]; m[0] += v[0]; m[1] += v[1]; m[2] += v[2]; }); zc /= V.length; m = [m[0] / V.length, m[1] / V.length, m[2] / V.length];
    if (it.o.c){ var cc = self.rot(it.o.c[0], it.o.c[1], it.o.c[2]); if ((m[0] - cc[0]) * n[0] + (m[1] - cc[1]) * n[1] + (m[2] - cc[2]) * n[2] < 0) n = [-n[0], -n[1], -n[2]]; }
    /* face vue de dos : normale qui s'éloigne de l'œil (perspective : œil en (0, 0, f)) */
    var eye = self.f ? [-m[0], -m[1], self.f - m[2]] : [0, 0, 1];
    it.back = n[0] * eye[0] + n[1] * eye[1] + n[2] * eye[2] < 0;
    it.V = V; it.n = n; it.z = zc;
  }
  var D = L.filter(function(it){ return it.t || !(it.back && it.o.cull); });
  D.sort(function(p, q){ return p.z - q.z; });
  for (i = 0; i < D.length; i++){
    var d = D[i];
    if (d.t){ d.fn(ctx, self.pv(d.v)); continue; }
    var nn = d.back ? [-d.n[0], -d.n[1], -d.n[2]] : d.n;
    var dif = Math.max(0, nn[0] * Lt[0] + nn[1] * Lt[1] + nn[2] * Lt[2]) / Math.hypot(Lt[0], Lt[1], Lt[2]);
    var fill = d.o.glow ? d.col : zshade(d.col, -0.5 + 0.72 * dif);
    ctx.save(); if (d.o.alpha != null) ctx.globalAlpha = d.o.alpha;
    ctx.beginPath();
    d.V.forEach(function(v, j){ var p = self.pv(v); if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.lineJoin = "round"; ctx.lineWidth = d.o.line ? 1.2 : 0.7; ctx.strokeStyle = d.o.line || fill; ctx.stroke();
    ctx.restore();
    if (d.o.after) d.o.after(ctx, d);
  }
};
/* glisser pour tourner la vue */
function zorbit(c, v, k, lim, onDrag){
  var st = {lx:null};
  c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; if (onDrag && onDrag("down", p) === false) st.lx = null; }
    if (type === "drag" && st.lx != null){
      v.a += (p.x - st.lx) * 0.01; v.b = Math.max(lim ? lim[0] : -1.4, Math.min(lim ? lim[1] : 1.4, v.b + (p.y - st.ly) * 0.01));
      if (lim && lim[2] != null) v.a = Math.max(lim[2], Math.min(lim[3], v.a));
      st.lx = p.x; st.ly = p.y; v.set(); v.user = true; k.redraw();
    }
    if (type === "up") st.lx = null;
  });
  return st;
}
/* fond de laboratoire sombre */
function zlab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* étiquette claire sur fond sombre, bornée au cadre */
function ztag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = zfz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  bx = Math.max(3, Math.min(c.W - w - 3, bx)); var by = Math.max(3, Math.min(c.H - h - 3, y - h / 2));
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.72)"; zrr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  zT(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}

/* fraction lisible : 1/2, 3/2, 2/3… */
function zfrac(x){
  if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)).replace("-", "−");
  for (var d = 2; d <= 6; d++){ var n = x * d; if (Math.abs(n - Math.round(n)) < 1e-9) return (String(Math.round(n)) + "/" + d).replace("-", "−"); }
  return zN(x, 3);
}
function zsgn(x){ return (x > 1e-9 ? "+" : "") + zfrac(x); }
/* renomme les cases d'afficheurs (k.readouts n'a pas d'accès aux libellés) */
function zrelabel(k, labs){
  var cells = k.ctrl.querySelectorAll(".read .ro small");
  labs.forEach(function(l, i){ if (cells[i] && cells[i].textContent !== l) cells[i].textContent = l; });
}
/* flèche 3D (tige + pointe) dans une scène Z3 */
function zarrow3(v, p0, p1, r, col, o){
  o = o || {}; var d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], L = Math.hypot(d[0], d[1], d[2]);
  if (!(L > 1e-6)) return;
  var hl = Math.min(L * 0.4, o.head || r * 5), t = (L - hl) / L, pm = [p0[0] + d[0] * t, p0[1] + d[1] * t, p0[2] + d[2] * t];
  v.cyl(p0, pm, r, o.n || 10, col, {alpha:o.alpha});
  v.cyl(pm, p1, r * 2.6, o.n || 10, col, {r1:0.001, alpha:o.alpha});
}
/* sphère facettée (pour les noyaux et les atomes en 3D) */
function zsphere(v, c, r, col, o){
  v.sprite(c[0], c[1], c[2], function(ctx, q){ zball(ctx, q.x, q.y, r * v.sc * q.s, col, o && o.alpha); });
}
/* =====================================================================
   1. Effet Zeeman (pq08)

/* =====================================================================
   1. H₂⁺ : un électron, deux protons, une liaison (pq10)
   Modèle LCAO : ψ± = (φA ± φB)/√(2(1 ± S)), φ = orbitale 1s de l'hydrogène.
   W±(R) = E_1s + e²/(4πε₀R) − (J ± K)/(1 ± S), mesurée depuis H(1s) + p⁺ séparés.
   ===================================================================== */
var HA_EV = 27.211386, A0 = 52.917721, MP = 1.67262192e-27;
function h2parts(R){ var e1 = Math.exp(-R); return {S:e1 * (1 + R + R * R / 3), j:(1 - (1 + R) * Math.exp(-2 * R)) / R, k:(1 + R) * e1}; }
/* énergie (eV) au-dessus de H(1s) + p⁺, R en pm, s = +1 liante, −1 antiliante */
function h2W(Rpm, s){ var R = Rpm / A0, p = h2parts(R); return HA_EV * (1 / R - (p.j + s * p.k) / (1 + s * p.S)); }
function h2dW(Rpm, s){ var h = 0.02; return (h2W(Rpm + h, s) - h2W(Rpm - h, s)) / (2 * h); }
/* minimum de W₊ (section dorée) */
var H2_RE = (function(){ var a = 60, b = 300, g = (Math.sqrt(5) - 1) / 2;
  for (var i = 0; i < 80; i++){ var c = b - g * (b - a), d = a + g * (b - a); if (h2W(c, 1) < h2W(d, 1)) b = d; else a = c; }
  return (a + b) / 2; })();
var H2_DE = -h2W(H2_RE, 1);
/* points tirés une fois (graine fixe) : chaque point garde son tirage, le nuage se déforme donc sans scintiller */
function h2rng(seed){ var s = seed >>> 0; return function(){ s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; }; }
var H2_PTS = (function(){
  var r = h2rng(20261126), a = [];
  for (var i = 0; i < 5200; i++){
    var z = 2 * r() - 1, ph = TAU * r(), q = Math.sqrt(1 - z * z);
    var rad = -0.5 * Math.log(r() * r() * r());      /* loi r² e^(−2r) : orbitale 1s */
    a.push({n:r() < 0.5 ? -1 : 1, d:[q * Math.cos(ph), q * Math.sin(ph), z], r:Math.min(rad, 6), u:r()});
  }
  return a;
})();
var H2_SLOW = 7;
/* nuage : densité projetée sur une grille basse résolution (lissée), puis points nets par-dessus */
var H2_BUF = {w:0, h:0};
function h2blur(a, w, h, r){
  var t = new Float32Array(a.length), i, x, y, s, n = 2 * r + 1;
  for (y = 0; y < h; y++){ s = 0; var o = y * w;
    for (x = -r; x <= r; x++) s += a[o + Math.max(0, Math.min(w - 1, x))];
    for (x = 0; x < w; x++){ t[o + x] = s / n; s += a[o + Math.min(w - 1, x + r + 1)] - a[o + Math.max(0, x - r)]; } }
  for (x = 0; x < w; x++){ s = 0;
    for (y = -r; y <= r; y++) s += t[Math.max(0, Math.min(h - 1, y)) * w + x];
    for (y = 0; y < h; y++){ a[y * w + x] = s / n; s += t[Math.min(h - 1, y + r + 1) * w + x] - t[Math.max(0, y - r) * w + x]; } }
}
function h2cloud(g, v, hx, sg, W, H, phone){
  var K = 4, gw = Math.max(8, Math.ceil(W / K)), gh = Math.max(8, Math.ceil(H / K)), B = H2_BUF;
  if (B.w !== gw || B.h !== gh){ B.w = gw; B.h = gh; B.p = new Float32Array(gw * gh); B.m = new Float32Array(gw * gh);
    B.cv = document.createElement("canvas"); B.cv.width = gw; B.cv.height = gh; B.cx = B.cv.getContext("2d"); B.img = B.cx.createImageData(gw, gh); }
  B.p.fill(0); B.m.fill(0);
  var dotsP = [], dotsM = [], j;
  for (j = 0; j < H2_PTS.length; j++){
    var q = H2_PTS[j], x = q.n * hx + q.r * q.d[0], y = q.r * q.d[1], z = q.r * q.d[2];
    var ea = Math.exp(-Math.hypot(x + hx, y, z)), eb = Math.exp(-Math.hypot(x - hx, y, z)), ps = ea + sg * eb;
    if (q.u * 2 * (ea * ea + eb * eb) > ps * ps) continue;
    var P = v.p(x, y, z), gx = Math.round(P.x / K), gy = Math.round(P.y / K);
    if (gx >= 0 && gy >= 0 && gx < gw && gy < gh) (ps >= 0 ? B.p : B.m)[gy * gw + gx] += 1;
    if (j % 2 === 0) (ps >= 0 ? dotsP : dotsM).push(P);
  }
  var r = Math.max(1, Math.round(0.16 * v.sc / K));
  h2blur(B.p, gw, gh, r); h2blur(B.p, gw, gh, r); h2blur(B.m, gw, gh, r); h2blur(B.m, gw, gh, r);
  var mx = 1e-9, n = gw * gh, D = B.img.data, i;
  for (i = 0; i < n; i++) mx = Math.max(mx, B.p[i] + B.m[i]);
  var d0 = 0.38 * mx;
  for (i = 0; i < n; i++){
    var a = B.p[i], b = B.m[i], t = a + b, I = 1 - Math.exp(-t / d0), fp = t > 0 ? a / t : 1;
    var wh = 0.75 * I * I, r0 = 80 * fp + 255 * (1 - fp), g0 = 150 * fp + 105 * (1 - fp), b0 = 255 * fp + 80 * (1 - fp);
    D[4 * i] = r0 + (255 - r0) * wh; D[4 * i + 1] = g0 + (255 - g0) * wh; D[4 * i + 2] = b0 + (255 - b0) * wh;
    D[4 * i + 3] = 250 * Math.pow(I, 0.75);
  }
  B.cx.putImageData(B.img, 0, 0);
  g.save(); g.imageSmoothingEnabled = true; g.globalAlpha = 0.92;
  g.drawImage(B.cv, 0, 0, gw * K, gh * K); g.globalAlpha = 1;
  var sz = phone ? 1.6 : 1.8;
  [[dotsP, "rgba(170,210,255,.55)"], [dotsM, "rgba(255,180,160,.55)"]].forEach(function(o){
    g.fillStyle = o[1]; g.beginPath(); o[0].forEach(function(P){ g.rect(P.x - sz / 2, P.y - sz / 2, sz, sz); }); g.fill(); });
  g.restore();
}
SFA.sim({
  id:"pq-h2plus-liaison", ch:"pq10", tag:"Molécules",
  titre:"H₂⁺ : un électron, deux protons, une liaison",
  resume:"Deux protons et un seul électron : son nuage se place entre eux (liante) ou s'en écarte (antiliante), et les protons roulent dans la courbe W(R).",
  but:"Tire un proton (ou le curseur R) et regarde le nuage de l'électron suivre aussitôt. Lâche : les protons, bien plus lourds, roulent lentement dans la courbe W(R). Passe en antiliante. Glisse ailleurs sur la scène pour tourner autour de la molécule.",
  aRetenir:"L'électron lie les deux protons quand il s'accumule entre eux (liante) ; avec un plan nodal au milieu (antiliante), il les sépare.",
  piege:"L'orbitale antiliante n'est pas « sans effet » : son énergie est au-dessus de celle des atomes séparés, elle repousse les noyaux.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 360), f = k.canvas(phone ? 430 : 280);
    var sg = 1;
    k.seg("Orbitale de l'électron", [["1", "Liante ψ₊"], ["-1", "Antiliante ψ₋"]], "1", function(v){ sg = +v; restart(R); });
    var rS = k.slider("Distance R entre les protons", 40, 420, 1, 200, "pm", function(v){ R = v; restart(v); hold = 0.3; });
    var fT = k.toggle("Protons libres (ils roulent dans W(R))", true, function(){ restart(R); });
    var ro = k.readouts(["Distance R", "Énergie W(R)", "Recouvrement S", "ρ au milieu"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.42; v.b = 0.32; v.f = 26; v.set();
    var R = 200, vR = 0, R0 = 200, E0 = h2W(200, 1), tfs = 0, gone = 0, hold = 0, grab = false, eIdx = 0, eT = 0, tA = 0;
    function restart(r){ R = Math.max(40, Math.min(420, r)); R0 = R; vR = 0; tfs = 0; gone = 0; E0 = h2W(R, sg); }
    /* ---- souris sur la scène : tirer un proton, sinon tourner ---- */
    var orb = {lx:null};
    c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
    function nearProton(p){
      var A = v.p(-R / A0 / 2, 0, 0), B = v.p(R / A0 / 2, 0, 0), rr = Math.max(16, 0.45 * v.sc);
      return Math.hypot(p.x - A.x, p.y - A.y) < rr || Math.hypot(p.x - B.x, p.y - B.y) < rr;
    }
    function dragR(p){
      var A = v.p(-1, 0, 0), B = v.p(1, 0, 0), O = v.p(0, 0, 0), ux = B.x - A.x, uy = B.y - A.y, L2 = ux * ux + uy * uy;
      if (L2 < 9) return;
      var t = Math.abs(((p.x - O.x) * ux + (p.y - O.y) * uy) / L2) * 2;   /* demi-distance en a₀ */
      R = Math.max(40, Math.min(420, Math.round(t * 2 * A0)));
      restart(R); rS.set(R);
    }
    c.pointer(function(type, p){
      if (type === "down"){ if (nearProton(p)){ grab = true; hold = 1e9; c.cv.style.cursor = "grabbing"; dragR(p); } else orb.lx = p.x, orb.ly = p.y; }
      if (type === "drag"){
        if (grab) dragR(p);
        else if (orb.lx != null){ v.a += (p.x - orb.lx) * 0.01; v.b = Math.max(-1.2, Math.min(1.2, v.b + (p.y - orb.ly) * 0.01)); orb.lx = p.x; orb.ly = p.y; v.set(); v.user = true; }
        k.redraw();
      }
      if (type === "move") c.cv.style.cursor = nearProton(p) ? "ew-resize" : "grab";
      if (type === "up"){ if (grab){ grab = false; hold = 0; restart(R); } orb.lx = null; c.cv.style.cursor = "grab"; }
    });
    /* ---- souris sur le graphe : glisser règle R ---- */
    var GEO = null, gDrag = false;
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO) return;
      var inG = p.x >= GEO.x0 - 6 && p.x <= GEO.x1 + 6 && p.y >= GEO.y0 && p.y <= GEO.y1;
      if (type === "down" && inG){ gDrag = true; hold = 1e9; }
      if ((type === "down" || type === "drag") && gDrag){ R = Math.round(Math.max(40, Math.min(420, GEO.ix(p.x)))); restart(R); rS.set(R); k.redraw(); }
      if (type === "move") f.cv.style.cursor = inG ? "ew-resize" : "default";
      if (type === "up" && gDrag){ gDrag = false; hold = 0; restart(R); }
    });
    restart(200);
    var lp = k.loop(function(dt){
      tA += dt;
      if (hold > 0 && hold < 1e8) hold -= dt;
      var free = fT.value && hold <= 0 && !grab && !gDrag;
      if (free){
        if (gone > 0){ gone -= dt; if (gone <= 0) restart(R0); }
        else {
          var tau = dt * H2_SLOW, n = 12, h = tau / n, mu = MP / 2;
          for (var i = 0; i < n; i++){
            var a1 = -h2dW(R, sg) * QE * 1e-6 / mu;
            R += vR * h + 0.5 * a1 * h * h;
            var a2 = -h2dW(Math.max(R, 20), sg) * QE * 1e-6 / mu;
            vR += 0.5 * (a1 + a2) * h;
            if (R < 20){ R = 20; vR = Math.abs(vR); }
          }
          tfs += tau;
          if (R > 430){ R = 430; gone = 1.1; }
          rS.set(Math.round(Math.min(420, R)));
        }
      }
      /* l'électron « vu » : un point du nuage tiré au hasard, change souvent */
      eT += dt; if (eT > 0.09){ eT = 0; eIdx = Math.floor(Math.random() * H2_PTS.length); }
      if (!v.user){ v.a = -0.42 + 0.35 * Math.sin(tA * 0.18); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Ra = Math.min(R, 420) / A0, i;
      /* ================= scène : piège à ions sous vide ================= */
      zlab(ctx, W, H, "#1b2440", "#070b16");
      v.sc = Math.min(W / (Ra + (phone ? 5.6 : 6.4)), H / (phone ? 6.6 : 7)); v.cx = W * 0.5; v.cy = H * 0.5; v.clear();
      /* quatre barreaux du piège (dorés), parallèles à l'axe */
      var rodY = 5.4 / 0.72, rodL = 12;
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(o){
        var cz = v.rot(0, o[0] * rodY * 0.72, o[1] * rodY * 0.72)[2];
        v.cyl([-rodL, o[0] * rodY * 0.72, o[1] * rodY * 0.72], [rodL, o[0] * rodY * 0.72, o[1] * rodY * 0.72], 0.3, 14, "#c99a3c", {alpha:cz > 0.5 ? 0.22 : 0.85});
      });
      /* plan nodal (antiliante) */
      if (sg < 0 && !(gone > 0)){
        var pn = 3.6;
        v.face([[0, -pn, -pn], [0, pn, -pn], [0, pn, pn], [0, -pn, pn]], "#ff8a7a", {alpha:0.12, glow:true});
      }
      /* nuage + protons : un seul calque trié au centre */
      var hx = Ra / 2;
      v.sprite(0, 0, 0, function(g){
        g.save();
        /* axe internucléaire */
        var e1 = v.p(-hx - 3.2, 0, 0), e2 = v.p(hx + 3.2, 0, 0);
        g.setLineDash([4, 5]); g.strokeStyle = "rgba(170,190,230,.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(e1.x, e1.y); g.lineTo(e2.x, e2.y); g.stroke(); g.setLineDash([]);
        /* protons d'abord si derrière, le nuage, puis protons devant */
        var PA = v.p(-hx, 0, 0), PB = v.p(hx, 0, 0), rp = Math.max(5, 0.32 * v.sc);
        function proton(P){ zglow(g, P.x, P.y, rp * 2.6 * P.s, "#ff6a5a", 0.35); zball(g, P.x, P.y, rp * P.s, "#e2463b"); }
                h2cloud(g, v, hx, sg, c.W, c.H, phone);
        /* l'électron à un instant : un point du nuage */
        var qe = null;
        for (var tr = 0; tr < 40 && !qe; tr++){
          var cand = H2_PTS[(eIdx + tr * 97) % H2_PTS.length], xx = cand.n * hx + cand.r * cand.d[0], yy = cand.r * cand.d[1], zz = cand.r * cand.d[2];
          var a1 = Math.exp(-Math.hypot(xx + hx, yy, zz)), b1 = Math.exp(-Math.hypot(xx - hx, yy, zz)), s1 = a1 + sg * b1;
          if (cand.u * 2 * (a1 * a1 + b1 * b1) <= s1 * s1) qe = v.p(xx, yy, zz);
        }
        g.globalCompositeOperation = "source-over";
        if (qe){ zglow(g, qe.x, qe.y, 11 * qe.s, "#ffe680", 0.75); g.fillStyle = "#fff6c8"; g.beginPath(); g.arc(qe.x, qe.y, 2.6 * qe.s, 0, TAU); g.fill(); }
        (PA.z < PB.z ? [PA, PB] : [PB, PA]).forEach(proton);
        g.restore();
      });
      v.render(ctx);
      /* étiquettes */
      var PA = v.p(-hx, 0, 0), PB = v.p(hx, 0, 0), rp = Math.max(5, 0.32 * v.sc);
      var sep = Math.abs(PB.x - PA.x) > 46;
      /* pendant la séparation, le message « H + p⁺ » remplace les étiquettes des protons */
      if (!(gone > 0) && sep){ ztag(S, c, "p⁺", PA.x, PA.y - rp - 13, {size:11, color:"#ffb3a8"}); ztag(S, c, "p⁺", PB.x, PB.y - rp - 13, {size:11, color:"#ffb3a8"}); }
      else if (!(gone > 0)) ztag(S, c, "p⁺  p⁺", (PA.x + PB.x) / 2, Math.min(PA.y, PB.y) - rp - 13, {size:11, color:"#ffb3a8"});
      /* cote R sous la molécule */
      var yc = H - (phone ? 46 : 50), xa = Math.min(PA.x, PB.x), xb = Math.max(PA.x, PB.x);
      ctx.save(); ctx.strokeStyle = "rgba(220,230,250,.7)"; ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(PA.x, PA.y + rp); ctx.lineTo(PA.x, yc); ctx.moveTo(PB.x, PB.y + rp); ctx.lineTo(PB.x, yc); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(xa, yc); ctx.lineTo(xb, yc); ctx.stroke(); ctx.restore();
      ztag(S, c, "R = " + zN(Math.min(R, 420), 0) + " pm", (xa + xb) / 2, yc + 14, {size:11.5, color:"#eef3fb"});
      if (sg < 0 && !(gone > 0)) {
        /* étiquette du plan nodal : le bord du plan le plus loin des étiquettes p⁺ */
        var tgs = sep ? [[PA.x, PA.y - rp - 13], [PB.x, PB.y - rp - 13]] : [[(PA.x + PB.x) / 2, Math.min(PA.y, PB.y) - rp - 13]];
        var plc = [v.p(0, 3.4, 0), v.p(0, -3.4, 0)].map(function(q){ var y = Math.max(52, Math.min(H - 70, q.y)), m = 1e9;
          tgs.forEach(function(t){ m = Math.min(m, Math.max(Math.abs(q.x - t[0]) / 3, Math.abs(y - t[1]))); }); return {x:q.x, y:y, m:m}; });
        var pl = plc[0].m >= plc[1].m || plc[0].m > 24 ? plc[0] : plc[1];
        ztag(S, c, "plan nodal", pl.x, pl.y, {size:11, color:"#ffb2a6"}); }
      zT(S, c, phone ? "glisse : tourner · tire un p⁺" : "glisse pour tourner · tire un proton", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      zT(S, c, "t = " + zN(tfs, 1) + " fs", 10, 14, {size:zfz(c, 11.5), color:"#ffe680", align:"left", weight:800});
      zT(S, c, "noyaux ralentis ≈ 10¹⁴ fois (1 s = 7 fs)", 10, 31, {size:zfz(c, 10.5), color:"rgba(210,222,240,.75)", align:"left", weight:600});
      ztag(S, c, "piège à ions (vide)", W - 8, H - 16, {size:10, align:"right", color:"#e6c47a"});
      ztag(S, c, sg > 0 ? "ψ₊ : électron entre les protons" : "ψ₋ : électron chassé du milieu", 8, H - 16, {size:10.5, align:"left", color:sg > 0 ? "#9cc6ff" : "#ffb2a6"});
      if (gone > 0) ztag(S, c, "les protons se séparent : H + p⁺", W / 2, 50, {size:12, color:"#ffd34d"});

      /* ================= graphes : W(R) et ψ le long de l'axe ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var b1 = phone ? [8, 6, FW - 8, FH * 0.6] : [8, 6, FW * 0.6, FH - 6];
      var b2 = phone ? [8, FH * 0.6 + 6, FW - 8, FH - 6] : [FW * 0.6 + 8, 6, FW - 8, FH - 6];
      [b1, b2].forEach(function(b){ g.save(); zrr(g, b[0], b[1], b[2] - b[0], b[3] - b[1], 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore(); });
      /* --- W(R) --- */
      var x0 = b1[0] + 40, x1 = b1[2] - 12, y0 = b1[1] + 28, y1 = b1[3] - 26, Wmin = -2.6, Wmax = 6;
      function X(r){ return x0 + (r - 0) / 420 * (x1 - x0); }
      function Y(w){ return y1 - (w - Wmin) / (Wmax - Wmin) * (y1 - y0); }
      GEO = {x0:X(40), x1:x1, y0:y0, y1:y1, ix:function(px){ return (px - x0) / (x1 - x0) * 420; }};
      zT(S, f, "W(R) en eV : protons + électron", b1[0] + 10, b1[1] + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      g.save(); g.strokeStyle = "#e6ebf2"; g.lineWidth = 1;
      for (var wv = -2; wv <= 6; wv += 2){ g.beginPath(); g.moveTo(x0, Y(wv)); g.lineTo(x1, Y(wv)); g.stroke();
        zT(S, f, zN(wv, 0), x0 - 6, Y(wv), {size:zfz(f, 10), color:"#5f6b7a", align:"right", weight:600}); }
      for (var rv = 0; rv <= 400; rv += 100){ zT(S, f, rv === 400 ? "400 pm" : String(rv), X(rv), y1 + 11, {size:zfz(f, 10), color:"#5f6b7a", weight:600}); }
      g.restore();
      g.save(); g.strokeStyle = "#8792a2"; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(x0, Y(0)); g.lineTo(x1, Y(0)); g.stroke(); g.restore();
      zT(S, f, "H + p⁺ séparés", X(150), Y(0) + 9, {size:zfz(f, 10), color:"#6b7686", align:"left", weight:700, bg:"rgba(255,255,255,.85)"});
      g.save(); g.beginPath(); g.rect(x0, y0 - 2, x1 - x0, y1 - y0 + 2); g.clip();
      [[1, "#2f6fd6"], [-1, "#d0504f"]].forEach(function(cv){
        g.beginPath();
        for (var rr = 30; rr <= 420; rr += 2){ var yy = Y(h2W(rr, cv[0])); if (rr === 30) g.moveTo(X(rr), yy); else g.lineTo(X(rr), yy); }
        g.strokeStyle = cv[1]; g.lineWidth = cv[0] === sg ? 3 : 1.4; g.globalAlpha = cv[0] === sg ? 1 : 0.45; g.stroke(); g.globalAlpha = 1;
      });
      /* énergie totale des protons libres : ils restent sous ce trait */
      if (fT.value && E0 < Wmax){
        g.save(); g.setLineDash([3, 4]); g.strokeStyle = "rgba(200,140,20,.85)"; g.lineWidth = 1.4;
        var ra = 30, rb = 420;
        if (sg > 0 && E0 < 0){ ra = 30; rb = 420; for (var rq = 30; rq <= 420; rq += 0.5){ if (h2W(rq, 1) <= E0 + 1e-6){ ra = rq; break; } } for (rq = 420; rq >= 30; rq -= 0.5){ if (h2W(rq, 1) <= E0 + 1e-6){ rb = rq; break; } } }
        else { for (var rr2 = 30; rr2 <= 420; rr2 += 0.5){ if (h2W(rr2, sg) <= E0 + 1e-6){ ra = rr2; break; } } }
        g.beginPath(); g.moveTo(X(ra), Y(E0)); g.lineTo(X(rb), Y(E0)); g.stroke(); g.restore();
      }
      g.restore();
      /* repère du minimum */
      g.save(); g.strokeStyle = "rgba(47,111,214,.5)"; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(X(H2_RE), Y(-H2_DE)); g.lineTo(X(H2_RE), y1); g.stroke(); g.restore();
      zT(S, f, "Rₑ = " + zN(H2_RE, 0) + " pm ; Dₑ = " + zN(H2_DE, 2) + " eV", X(H2_RE) + 12, Y(-2.2), {size:zfz(f, 10), color:"#2f6fd6", align:"left", weight:800});
      zT(S, f, "W₋", X(150) + 6, Y(h2W(150, -1)) - 6, {size:zfz(f, 11.5), color:"#d0504f", align:"left", weight:800});
      zT(S, f, "W₊", X(300), Y(h2W(300, 1)) + 14, {size:zfz(f, 11.5), color:"#2f6fd6", weight:800});
      var Wc = h2W(Math.min(R, 420), sg), yP = Math.max(y0, Math.min(y1, Y(Wc)));
      g.save(); g.strokeStyle = "rgba(20,30,50,.25)"; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(X(Math.min(R, 420)), y0); g.lineTo(X(Math.min(R, 420)), y1); g.stroke(); g.restore();
      zball(g, X(Math.min(R, 420)), yP, 6.5, sg > 0 ? "#2f6fd6" : "#d0504f");
      /* --- ψ le long de l'axe --- */
      var u0 = b2[0] + 12, u1 = b2[2] - 12, v0 = b2[1] + 30, v1 = b2[3] - 22, vm = v0 + (v1 - v0) * 0.56;
      zT(S, f, "Sur l'axe : ψ et |ψ|²", b2[0] + 10, b2[1] + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      function U(xpm){ return (u0 + u1) / 2 + xpm / 380 * (u1 - u0) / 2; }
      var pp = h2parts(Ra), nrm = 1 / Math.sqrt(2 * (1 + sg * pp.S)), amp = (v1 - v0) * 0.52;
      function psi(xpm){ var xa0 = xpm / A0; return nrm * (Math.exp(-Math.abs(xa0 + Ra / 2)) + sg * Math.exp(-Math.abs(xa0 - Ra / 2))); }
      g.save(); g.beginPath(); g.rect(u0, v0 - 4, u1 - u0, v1 - v0 + 8); g.clip();
      g.strokeStyle = "#e6ebf2"; g.beginPath(); g.moveTo(u0, vm); g.lineTo(u1, vm); g.stroke();
      /* |ψ|² rempli (vers le haut) */
      g.beginPath(); g.moveTo(u0, vm);
      for (i = 0; i <= 200; i++){ var xp = -380 + 760 * i / 200, ps = psi(xp); g.lineTo(U(xp), vm - ps * ps * amp); }
      g.lineTo(u1, vm); g.closePath(); g.fillStyle = sg > 0 ? "rgba(47,111,214,.22)" : "rgba(208,80,79,.22)"; g.fill();
      g.beginPath();
      for (i = 0; i <= 200; i++){ xp = -380 + 760 * i / 200; var yv = vm - psi(xp) * amp; if (i) g.lineTo(U(xp), yv); else g.moveTo(U(xp), yv); }
      g.strokeStyle = sg > 0 ? "#2f6fd6" : "#d0504f"; g.lineWidth = 2; g.stroke();
      g.restore();
      [-1, 1].forEach(function(s2){ zball(g, U(s2 * Math.min(R, 420) / 2), vm, 4.5, "#e2463b"); });
      zT(S, f, "ψ", u0 + 2, v0 - 2, {size:zfz(f, 11), color:sg > 0 ? "#2f6fd6" : "#d0504f", align:"left", weight:800});
      zT(S, f, "|ψ|² rempli", u1, v0 - 2, {size:zfz(f, 10), color:"#6b7686", align:"right", weight:700});
      var lgd = sg > 0 ? "|ψ|² ≠ 0 au milieu" : "ψ = 0 au milieu", fzl = zfz(f, 9.5);
      g.save(); g.font = "800 " + fzl + "px Mulish, system-ui, sans-serif"; var wlg = g.measureText(lgd).width;
      g.font = "600 " + fzl + "px Mulish, system-ui, sans-serif"; var w38 = g.measureText("+380 pm").width; g.restore();
      var lab38 = (u1 - u0) / 2 - wlg / 2 - 8 > w38 ? " pm" : "";
      zT(S, f, "−380" + lab38, u0, v1 + 12, {size:fzl, color:"#8792a2", align:"left", weight:600});
      zT(S, f, "+380" + lab38, u1, v1 + 12, {size:fzl, color:"#8792a2", align:"right", weight:600});
      zT(S, f, lgd, (u0 + u1) / 2, v1 + 12, {size:zfz(f, 9.5), color:sg > 0 ? "#2f6fd6" : "#d0504f", weight:800});
      /* ---- afficheurs ---- */
      var Rd = Math.min(R, 420);
      ro.set(0, zN(Rd, 0) + " pm");
      ro.set(1, zN(h2W(Rd, sg), 2) + " eV");
      ro.set(2, zN(h2parts(Rd / A0).S, 2));
      ro.set(3, sg > 0 ? "× " + zN(2 / (1 + h2parts(Rd / A0).S), 2) : "0 (plan nodal)");
      nt.set(sg > 0 ? "Liante : la densité au milieu vaut 2/(1 + S) fois celle de deux atomes séparés ; le nuage tire les deux protons l'un vers l'autre. Ce modèle donne Rₑ = " + zN(H2_RE, 0) + " pm et Dₑ = " + zN(H2_DE, 2) + " eV (calcul exact : 106 pm et 2,79 eV). W(R) est mesurée depuis H + p⁺ séparés." :
        "Antiliante : ψ change de signe au milieu, le nuage est chassé vers l'extérieur. W₋ descend sans minimum : lâchés, les protons s'écartent jusqu'à H + p⁺.", sg > 0 ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   2. Des niveaux aux bandes : 1, 2, 10, N atomes (pq10)
   Modèle des liaisons fortes sur une chaîne ouverte de N atomes, deux niveaux atomiques (s et p) :
   E_k = E_at − 2t·cos(kπ/(N + 1)), k = 1…N ; t(d) = t₀·exp(−(d − d₀)/λ).
   ===================================================================== */
var BS = {Es:-8, Ep:-4, ts0:0.55, tp0:0.9, d0:0.235, lam:0.06, kT:0.025852, hb:0.6582119569, dDon:0.045, NMAX:24, WLOC:0.2};
function bsT(d){ var f = Math.exp(-(d - BS.d0) / BS.lam); return [BS.ts0 * f, BS.tp0 * f]; }
function bsLev(E, t, N){ var a = []; for (var k = 1; k <= N; k++) a.push(E - 2 * t * Math.cos(k * PI / (N + 1))); return a; }
/* bande interdite d'une chaîne infinie : (E_p − 2t_p) − (E_s + 2t_s) */
function bsEgInf(d){ var t = bsT(d); return (BS.Ep - 2 * t[1]) - (BS.Es + 2 * t[0]); }
/* d où E_g(∞) vaut une valeur donnée (E_g décroît quand d diminue) */
function bsDofEg(eg){ return BS.d0 - BS.lam * Math.log((BS.Ep - BS.Es - eg) / (2 * (BS.ts0 + BS.tp0))); }
/* état complet pour N atomes, distance d, val électrons par atome, dopant */
function bsState(N, d, val, dop){
  var t = bsT(d), ls = bsLev(BS.Es, t[0], N), lp = bsLev(BS.Ep, t[1], N);
  var eg = N > 0 ? lp[0] - ls[N - 1] : 0;
  var all = ls.map(function(E, i){ return {E:E, b:"s", i:i}; }).concat(lp.map(function(E, i){ return {E:E, b:"p", i:i}; }));
  all.sort(function(a, b){ return a.E - b.E; });
  var ne = N * val + (dop ? 1 : 0), occ = {}, left = ne;
  /* donneur ionisé (bande interdite > 0, 2 électrons par atome) : son électron est compté dans la bande haute */
  all.forEach(function(l){ var n = Math.min(2, Math.max(0, left)); l.n = n; left -= n; });
  var np = 0, ns = 0; all.forEach(function(l){ if (l.b === "p") np += l.n; else ns += l.n; });
  var type, kind;
  if (N === 1){ type = "atome isolé"; kind = "at"; }
  else if (val === 1){ if (4 * t[0] < BS.WLOC){ type = "isolant : électrons localisés"; kind = "loc"; } else { type = "conducteur"; kind = "met"; } }
  else if (eg <= 0){ type = "conducteur"; kind = "met"; }
  else if (eg <= 3){ type = dop ? "semi-conducteur dopé n" : "semi-conducteur"; kind = "sc"; }
  else { type = dop ? "isolant dopé n" : "isolant"; kind = "iso"; }
  /* électrons mobiles (dessin) */
  var mob = 0;
  if (kind === "met") mob = val === 1 ? N : Math.max(1, np);
  else if (kind !== "at" && kind !== "loc" && dop && 4 * t[1] >= BS.WLOC) mob = 1;
  return {t:t, ls:ls, lp:lp, eg:eg, all:all, ne:ne, np:np, ns:ns, type:type, kind:kind, mob:mob,
    wp:N > 1 ? lp[N - 1] - lp[0] : 0, ws:N > 1 ? ls[N - 1] - ls[0] : 0};
}
var BS_D_MET = bsDofEg(0), BS_D_ISO = bsDofEg(3);
var BS_D_LOC = BS.d0 + BS.lam * Math.log(4 * BS.ts0 / BS.WLOC);

SFA.sim({
  id:"pq-bandes-solide", ch:"pq10", tag:"Solides",
  titre:"Des niveaux aux bandes : 1, 2, 10, N atomes",
  resume:"Une rangée d'atomes s'allonge : chaque niveau atomique se divise en N niveaux qui forment une bande ; l'écart entre bandes décide si le cristal conduit.",
  but:"Ajoute des atomes et regarde chaque niveau se diviser puis devenir une bande. Rapproche les atomes (curseur d ou glisse dans le graphe de gauche) : les bandes s'élargissent et la bande interdite se ferme. Clique un atome pour en faire un donneur. Glisse sur la scène pour tourner.",
  aRetenir:"N atomes liés donnent N niveaux par niveau atomique, serrés en bande ; un solide conduit si sa dernière bande occupée n'est pas pleine.",
  piege:"Avoir des électrons ne suffit pas pour conduire : dans une bande pleine, ils ne peuvent pas changer d'état.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 350), f = k.canvas(phone ? 560 : 300);
    var nS = k.slider("Nombre d'atomes N", 1, BS.NMAX, 1, 1, "", function(){ grow = false; });
    var dS = k.slider("Distance entre atomes d", 0.16, 0.45, 0.005, BS.d0, "nm");
    var val = 2;
    k.seg("Électrons de valence par atome", [["2", "2 (bande basse pleine)"], ["1", "1 (bande basse à moitié)"]], "2", function(x){ val = +x; });
    var dT = k.toggle("Un atome donneur (1 électron de plus)", false, function(x){ dop = x ? (donI < 0 ? -2 : donI) : -1; });
    k.button("Reconstruire la chaîne atome par atome", function(){ grow = true; growT = 0; nS.set(1); });
    var ro = k.readouts(["Bande interdite E_g", "Largeur bande haute", "Saut d'un atome à l'autre", "Facteur e^(−E_g/2k_BT) à 300 K"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.62; v.b = 0.36; v.f = 16; v.set();
    var grow = true, growT = 0, tA = 0, dop = -1, donI = -1, mob = [], ST = null, xs = [];
    /* ---- souris sur la scène : clic sur un atome (donneur) ou glisser pour tourner ---- */
    var pd = null; c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
    function hitAtom(p){
      var best = -1, bd = 1e9;
      xs.forEach(function(P, i){ var dd = Math.hypot(p.x - P.x, p.y - P.y); if (dd < Math.max(12, P.r * 1.6) && dd < bd){ bd = dd; best = i; } });
      return best;
    }
    c.pointer(function(type, p){
      if (type === "down") pd = {x:p.x, y:p.y, lx:p.x, ly:p.y, moved:false};
      if (type === "drag" && pd){
        if (Math.hypot(p.x - pd.x, p.y - pd.y) > 4) pd.moved = true;
        v.a += (p.x - pd.lx) * 0.01; v.b = Math.max(-0.2, Math.min(1.2, v.b + (p.y - pd.ly) * 0.01)); pd.lx = p.x; pd.ly = p.y; v.set(); v.user = true; k.redraw();
      }
      if (type === "move"){ c.cv.style.cursor = hitAtom(p) >= 0 ? "pointer" : "grab"; }
      if (type === "up" && pd){
        if (!pd.moved){ var h = hitAtom(p); if (h >= 0){ if (dop === h){ dop = -1; dT.set(false); } else { dop = h; donI = h; dT.set(true); } k.redraw(); } }
        pd = null;
      }
    });
    /* ---- souris sur le graphe de gauche : glisser règle d ---- */
    var GEO = null, gd = false;
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO) return;
      var inG = p.x >= GEO.x0 - 6 && p.x <= GEO.x1 + 6 && p.y >= GEO.y0 && p.y <= GEO.y1;
      if (type === "down" && inG) gd = true;
      if ((type === "down" || type === "drag") && gd){ var dd = GEO.id(p.x); dS.set(Math.round(Math.max(0.16, Math.min(0.45, dd)) / 0.005) * 0.005); k.redraw(); }
      if (type === "move") f.cv.style.cursor = inG ? "ew-resize" : "default";
      if (type === "up") gd = false;
    });
    var lp = k.loop(function(dt){
      tA += dt;
      if (grow){ growT += dt; var nn = Math.min(12, 1 + Math.floor(growT / 0.38)); if (nn !== nS.value) nS.set(nn); if (nn >= 12) grow = false; }
      if (!v.user){ v.a = -0.62 + 0.16 * Math.sin(tA * 0.2); v.set(); }
      /* électrons mobiles : sauts d'atome en atome, dérive vers l'électrode + (à droite) */
      if (ST){
        var N = Math.round(nS.value), want = ST.mob;
        while (mob.length < want) mob.push({s:-0.6 + Math.random() * (N + 0.2), ph:Math.random() * TAU, w:0.7 + Math.random() * 0.6});
        if (mob.length > want) mob.length = want;
        var rate = 0.9 + 2.2 * Math.min(1.6, ST.t[1]);
        mob.forEach(function(m){ m.s += dt * rate * m.w; if (m.s > N - 0.4) m.s = -0.6; });
      }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var N = Math.round(nS.value), d = dS.value, i;
      if (dop >= N) dop = N > 1 ? Math.floor(N / 2) : -1;
      if (dop === -2) dop = N > 1 ? Math.floor(N / 2) : -1;
      if (N === 1 && dop >= 0) dop = -1;
      var hasDop = dop >= 0;
      ST = bsState(N, d, val, hasDop);
      var ctx = c.ctx, W = c.W, H = c.H;
      /* ================= scène : rangée d'atomes entre deux électrodes ================= */
      zlab(ctx, W, H, "#1d2843", "#080c17");
      var Lref = (N - 1) * Math.max(d, 0.28), ca = Math.abs(Math.cos(v.a));
      v.sc = Math.min(W / (phone ? 1.9 : 2.2), W * 0.86 / (Lref * Math.max(0.55, ca) + 0.75), H / 1.3);
      v.cx = W * 0.5; v.cy = H * 0.42; v.clear();
      var L = (N - 1) * d, x0 = -L / 2, rAt = 0.085, rOrb = 0.14, tp = ST.t[1];
      /* support (plaque isolante) et électrodes */
      var ex = L / 2 + Math.max(0.16, d * 0.7);
      v.box(-ex - 0.22, -0.32, -0.32, ex + 0.22, -0.27, 0.32, "#3b4a63", {cols:[null, null, null, "#55678a"]});
      v.box(-ex - 0.16, -0.27, -0.16, -ex, 0.2, 0.16, "#b8733a"); v.box(ex, -0.27, -0.16, ex + 0.16, 0.2, 0.16, "#b8733a");
      xs = [];
      var kind = ST.kind, bound = val === 2 ? 2 : 0;
      v.sprite(0, 0, 0, function(g){
        g.save();
        /* nuages des orbitales externes : ils se recouvrent quand d diminue */
        g.globalCompositeOperation = "lighter";
        for (var j = 0; j < N; j++){
          var P = v.p(x0 + j * d, 0, 0), isD = j === dop;
          zglow(g, P.x, P.y, rOrb * v.sc * P.s * 1.25, isD ? [255, 160, 80] : [90, 150, 255], 0.32);
        }
        /* liaison délocalisée : bande lumineuse le long de la chaîne, d'autant plus forte que t est grand */
        if (N > 1){
          var A = v.p(x0, 0, 0), B = v.p(-x0, 0, 0), al = Math.min(0.5, 0.42 * tp);
          g.lineCap = "round"; g.strokeStyle = za([110, 170, 255], al); g.lineWidth = rOrb * v.sc * 1.1 * (A.s + B.s) / 2;
          g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke();
        }
        g.globalCompositeOperation = "source-over";
        /* atomes du plus loin au plus proche */
        var order = []; for (j = 0; j < N; j++) order.push(j);
        var zs = order.map(function(jj){ return v.p(x0 + jj * d, 0, 0); });
        order.sort(function(a, b){ return zs[a].z - zs[b].z; });
        order.forEach(function(jj){
          var P = zs[jj], vib = 0.006 * Math.sin(tA * 13 + jj * 1.7), Q = v.p(x0 + jj * d + vib, 0, 0), r = Math.max(4, rAt * v.sc * Q.s);
          xs[jj] = {x:Q.x, y:Q.y, r:r};
          /* électrons liés : 2 par atome, sur une petite orbite */
          var nb = (jj === dop && kind !== "met" && kind !== "at") ? bound : bound;
          for (var e = 0; e < nb; e++){
            var th = tA * 2.6 + e * PI + jj * 0.9, E3 = v.p(x0 + jj * d + 0.105 * Math.cos(th), 0.105 * Math.sin(th) * 0.55, 0.105 * Math.sin(th));
            if (E3.z < P.z){ g.fillStyle = "rgba(140,190,255,.8)"; g.beginPath(); g.arc(E3.x, E3.y, Math.max(1.4, 2.2 * E3.s), 0, TAU); g.fill(); }
          }
          zball(g, Q.x, Q.y, r, jj === dop ? "#e08a3a" : "#8fa0b8");
          for (e = 0; e < nb; e++){
            th = tA * 2.6 + e * PI + jj * 0.9; E3 = v.p(x0 + jj * d + 0.105 * Math.cos(th), 0.105 * Math.sin(th) * 0.55, 0.105 * Math.sin(th));
            if (E3.z >= P.z){ g.fillStyle = "rgba(170,210,255,.95)"; g.beginPath(); g.arc(E3.x, E3.y, Math.max(1.4, 2.2 * E3.s), 0, TAU); g.fill(); }
          }
          if (jj === dop && kind !== "met" && ST.mob > 0 && r > 5) zT(S, c, "+", Q.x, Q.y, {size:Math.min(14, r * 1.3), color:"#fff", weight:800});
        });
        /* électrons mobiles : sauts entre atomes voisins */
        mob.forEach(function(m){
          var sf = Math.floor(m.s), fr = m.s - sf, e2 = fr < 0.55 ? 0 : (fr - 0.55) / 0.45, s2 = sf + e2 * e2 * (3 - 2 * e2);
          var x = x0 + s2 * d, y = 0.13 * Math.sin(m.ph + tA * 5) * (1 - Math.abs(e2 - 0.5) * 2) + 0.03, M = v.p(x, y, 0.06 * Math.cos(m.ph + tA * 4));
          zglow(g, M.x, M.y, 9 * M.s, [255, 225, 90], 0.8); g.fillStyle = "#fff3b0"; g.beginPath(); g.arc(M.x, M.y, 2.6 * M.s, 0, TAU); g.fill();
        });
        g.restore();
      });
      v.render(ctx);
      /* circuit : fils, pile et ampèremètre (dessinés à plat, sous la scène) */
      var EL = v.p(-ex - 0.08, -0.27, 0), ER = v.p(ex + 0.08, -0.27, 0), yb = H - (phone ? 40 : 44), xm = W / 2;
      var Iamp = kind === "met" ? 1 : ST.mob > 0 ? 0.32 : 0, ang = -1.05 + 2.1 * Iamp * (0.9 + 0.1 * Math.sin(tA * 6));
      ctx.save(); ctx.strokeStyle = "#c98a4a"; ctx.lineWidth = 2; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(EL.x, EL.y); ctx.lineTo(EL.x, yb); ctx.lineTo(xm - 70, yb); ctx.moveTo(xm - 34, yb); ctx.lineTo(xm + 26, yb); ctx.moveTo(xm + 70, yb); ctx.lineTo(ER.x, yb); ctx.lineTo(ER.x, ER.y); ctx.stroke(); ctx.restore();
      /* pile */
      ctx.save(); var pg = ctx.createLinearGradient(0, yb - 12, 0, yb + 12); pg.addColorStop(0, "#5c6b82"); pg.addColorStop(0.5, "#2c3546"); pg.addColorStop(1, "#1a202b");
      zrr(ctx, xm - 70, yb - 11, 36, 22, 5); ctx.fillStyle = pg; ctx.fill(); ctx.fillStyle = "#c9a23a"; ctx.fillRect(xm - 36, yb - 5, 4, 10); ctx.restore();
      zT(S, c, "− +", xm - 52, yb, {size:zfz(c, 10.5), color:"#e9eef8", weight:800});
      /* ampèremètre */
      ctx.save(); var ag = ctx.createRadialGradient(xm + 46, yb - 6, 2, xm + 48, yb, 26); ag.addColorStop(0, "#f4f6fa"); ag.addColorStop(1, "#aab4c4");
      ctx.beginPath(); ctx.arc(xm + 48, yb, 22, 0, TAU); ctx.fillStyle = ag; ctx.fill(); ctx.strokeStyle = "#3b4658"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xm + 48, yb + 8); ctx.lineTo(xm + 48 + 17 * Math.sin(ang), yb + 8 - 17 * Math.cos(ang)); ctx.stroke(); ctx.restore();
      zT(S, c, "A", xm + 48, yb + 13, {size:9.5, color:"#3b4658", weight:800});
      ztag(S, c, Iamp > 0.5 ? "courant fort" : Iamp > 0 ? "faible courant" : "pas de courant", xm + 78, yb, {size:10.5, align:"left", color:Iamp > 0.5 ? "#9be7a8" : Iamp > 0 ? "#ffd34d" : "#c8d2e2"});
      /* étiquettes */
      var KCOL = {at:"#c8d2e2", met:"#9be7a8", sc:"#ffd34d", iso:"#ffb2a6", loc:"#ffb2a6"};
      ztag(S, c, "N = " + N + " · " + ST.type, 10, 16, {size:12, align:"left", color:KCOL[kind]});
      zT(S, c, phone ? "glisse : tourner · clic : donneur" : "glisse pour tourner · clique un atome", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      if (hasDop && xs[dop]){ var Dp = xs[dop]; ztag(S, c, kind === "met" || !ST.mob ? "donneur" : "donneur ionisé", Dp.x, Dp.y - Dp.r - 30, {size:10.5, color:"#ffc08a"}); }
      if (N >= 2 && xs[0] && xs[1]){
        var a0 = xs[0], a1 = xs[1], yy = Math.max(a0.y, a1.y) + Math.max(a0.r, a1.r) + 14;
        if (Math.abs(a1.x - a0.x) > 18){
          ctx.save(); ctx.strokeStyle = "rgba(220,230,250,.7)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a0.x, yy); ctx.lineTo(a1.x, yy); ctx.stroke(); ctx.restore();
        }
        ztag(S, c, "d = " + zN(d, 3) + " nm", (a0.x + a1.x) / 2, yy + 14, {size:10.5});
      }

      /* ================= graphes : bandes selon d, et niveaux des N atomes ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var b1 = phone ? [8, 6, FW - 8, FH * 0.5] : [8, 6, FW * 0.5, FH - 6];
      var b2 = phone ? [8, FH * 0.5 + 6, FW - 8, FH - 6] : [FW * 0.5 + 8, 6, FW - 8, FH - 6];
      [b1, b2].forEach(function(b){ g.save(); zrr(g, b[0], b[1], b[2] - b[0], b[3] - b[1], 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore(); });
      var Emin = -12, Emax = 2;
      /* --- gauche : bandes (chaîne infinie) selon d --- */
      var gx0 = b1[0] + 30, gx1 = b1[2] - 10, gy0 = b1[1] + 44, gy1 = b1[3] - 46;
      function GX(dd){ return gx0 + (dd - 0.16) / (0.45 - 0.16) * (gx1 - gx0); }
      function GY(E){ return gy1 - (E - Emin) / (Emax - Emin) * (gy1 - gy0); }
      GEO = {x0:gx0, x1:gx1, y0:gy0, y1:b1[3], id:function(px){ return 0.16 + (px - gx0) / (gx1 - gx0) * 0.29; }};
      zT(S, f, "Bandes (eV) selon d, pour N → ∞", b1[0] + 10, b1[1] + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      g.save(); g.strokeStyle = "#e9edf3";
      for (var Ev = -10; Ev <= 0; Ev += 2){ g.beginPath(); g.moveTo(gx0, GY(Ev)); g.lineTo(gx1, GY(Ev)); g.stroke(); zT(S, f, zN(Ev, 0), gx0 - 5, GY(Ev), {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:600}); }
      g.restore();
      g.save(); g.beginPath(); g.rect(gx0, gy0, gx1 - gx0, gy1 - gy0); g.clip();
      [["s", BS.Es, 0, "rgba(47,111,214,.30)", "#2f6fd6"], ["p", BS.Ep, 1, "rgba(230,140,40,.30)", "#d07a1a"]].forEach(function(bd){
        g.beginPath();
        for (var q = 0; q <= 80; q++){ var dd = 0.16 + 0.29 * q / 80, tt = bsT(dd)[bd[2]]; var yy2 = GY(bd[1] + 2 * tt); if (q) g.lineTo(GX(dd), yy2); else g.moveTo(GX(dd), yy2); }
        for (q = 80; q >= 0; q--){ dd = 0.16 + 0.29 * q / 80; tt = bsT(dd)[bd[2]]; g.lineTo(GX(dd), GY(bd[1] - 2 * tt)); }
        g.closePath(); g.fillStyle = bd[3]; g.fill(); g.strokeStyle = bd[4]; g.lineWidth = 1.2; g.stroke();
      });
      g.restore();
      /* bande des régimes sous l'axe */
      var ry = gy1 + 4, rh = 10, xm1 = GX(Math.max(0.16, BS_D_MET)), xm2 = GX(Math.min(0.45, BS_D_ISO));
      var ty = ry + rh + 9;
      if (val === 2){
        g.fillStyle = "#9be7a8"; g.fillRect(gx0, ry, xm1 - gx0, rh); g.fillStyle = "#ffe08a"; g.fillRect(xm1, ry, xm2 - xm1, rh); g.fillStyle = "#ffc4b8"; g.fillRect(xm2, ry, gx1 - xm2, rh);
        zT(S, f, "cond.", (gx0 + xm1) / 2, ty, {size:zfz(f, 9.5), color:"#1f7a3a", weight:800});
        zT(S, f, "semi-cond.", (xm1 + xm2) / 2, ty, {size:zfz(f, 9.5), color:"#8a6a00", weight:800});
        zT(S, f, "isolant", (xm2 + gx1) / 2, ty, {size:zfz(f, 9.5), color:"#a2412f", weight:800});
      } else {
        var xl = Math.max(gx0, Math.min(gx1, GX(BS_D_LOC)));
        g.fillStyle = "#9be7a8"; g.fillRect(gx0, ry, xl - gx0, rh); g.fillStyle = "#ffc4b8"; g.fillRect(xl, ry, gx1 - xl, rh);
        zT(S, f, "conducteur", gx0, ty, {size:zfz(f, 9.5), color:"#1f7a3a", align:"left", weight:800});
        zT(S, f, "(sauf atomes très éloignés : isolant de Mott)", gx0, ty + 12, {size:zfz(f, 9), color:"#1f7a3a", align:"left", weight:700});
        zT(S, f, "électrons localisés (Mott)", gx1, ty, {size:zfz(f, 9.5), color:"#a2412f", align:"right", weight:800});
      }
      zT(S, f, "modèle à deux bandes s et p (inventé)", gx1 - 4, GY(0.9), {size:zfz(f, 9), color:"#8792a2", align:"right", weight:700});
      /* curseur d */
      var xd = GX(d);
      g.save(); g.strokeStyle = "#13233a"; g.lineWidth = 1.5; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xd, gy0); g.lineTo(xd, gy1 + rh + 4); g.stroke(); g.restore();
      zball(g, xd, gy0, 5, "#13233a");
      var dTxt = "d = " + zN(d, 3) + " nm", tw = (phone ? 72 : 80);
      zT(S, f, dTxt, Math.max(gx0 + tw / 2, Math.min(gx1 - tw / 2, xd)), b1[1] + 31, {size:zfz(f, 10), color:"#13233a", weight:800, bg:"rgba(255,255,255,.9)"});
      zT(S, f, "bande s", GX(0.42), GY(BS.Es) - 9, {size:zfz(f, 10), color:"#2f6fd6", weight:800, bg:"rgba(255,255,255,.85)"});
      zT(S, f, "bande p", GX(0.42), GY(BS.Ep) - 9, {size:zfz(f, 10), color:"#d07a1a", weight:800, bg:"rgba(255,255,255,.85)"});
      /* --- droite : niveaux des N atomes --- */
      var lx0 = b2[0] + 34, lx1 = b2[0] + (b2[2] - b2[0]) * (phone ? 0.45 : 0.44), ly0 = b2[1] + 26, ly1 = b2[3] - 12;
      function LY(E){ return ly1 - (E - Emin) / (Emax - Emin) * (ly1 - ly0); }
      zT(S, f, N === 1 ? "1 atome : 2 niveaux" : N + " atomes : " + 2 * N + " niveaux", b2[0] + 10, b2[1] + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      g.save(); g.strokeStyle = "#eef1f5";
      for (Ev = -10; Ev <= 0; Ev += 2){ g.beginPath(); g.moveTo(lx0, LY(Ev)); g.lineTo(b2[2] - 8, LY(Ev)); g.stroke(); zT(S, f, zN(Ev, 0), lx0 - 5, LY(Ev), {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:600}); }
      g.restore();
      var trap = hasDop && ST.eg > 0 && val === 2 && !ST.mob;
      ST.all.forEach(function(l){
        var y = LY(l.E), col = l.b === "s" ? "#2f6fd6" : "#d07a1a";
        var on = l.n > 0 && !(trap && l.b === "p"); g.save(); g.strokeStyle = on ? col : za(col, 0.35); g.lineWidth = on ? 2 : 1.4;
        g.beginPath(); g.moveTo(lx0 + 6, y); g.lineTo(lx1, y); g.stroke(); g.restore();
      });
      /* électrons : deux points par niveau tant qu'il y a la place, sinon remplissage */
      var spacing = N > 1 ? (LY(ST.ls[0]) - LY(ST.ls[1])) : 99;
      ST.all.forEach(function(l){
        if (!(l.n > 0) || (trap && l.b === "p")) return;
        var y = LY(l.E);
        if (N <= 6 || spacing > 4.5){ var rr = Math.min(2.6, Math.max(1.6, spacing * 0.36)); for (var e = 0; e < l.n; e++){ g.fillStyle = "#13233a"; g.beginPath(); g.arc(lx0 + 20 + e * 9, y - rr - 0.5, rr, 0, TAU); g.fill(); } }
      });
      if (!(N <= 6 || spacing > 4.5)) zT(S, f, "trait plein : niveau occupé (2 e⁻)", lx0 + 6, b2[3] - 6, {size:zfz(f, 9), color:"#13233a", align:"left", weight:700});
      /* niveau du donneur */
      if (hasDop && ST.eg > 0 && val === 2){
        var yD = LY(ST.lp[0] - BS.dDon);
        g.save(); g.strokeStyle = "#e08a3a"; g.setLineDash([3, 3]); g.lineWidth = 2; g.beginPath(); g.moveTo(lx0 + 24, yD + 3); g.lineTo(lx0 + 54, yD + 3); g.stroke(); g.restore();
        if (trap){ g.fillStyle = "#e08a3a"; g.beginPath(); g.arc(lx0 + 39, yD - 0.5, 2.6, 0, TAU); g.fill(); }
      }
      /* étiquettes à droite des niveaux */
      var tx = lx1 + 8, sTop = LY(ST.ls[N - 1]), sBot = LY(ST.ls[0]), pTop = LY(ST.lp[N - 1]), pBot = LY(ST.lp[0]);
      var labS = val === 2 ? (ST.eg > 0 ? "valence : pleine" : "bande s") : "s : à moitié pleine";
      var labP = val === 2 && ST.eg > 0 ? (hasDop && ST.mob > 0 ? "conduction : 1 e⁻" : "conduction : vide") : "bande p";
      if (N === 1){ labS = "niveau s (2 e⁻)"; labP = val === 2 ? "niveau p (vide)" : "niveau p (vide)"; if (val === 1) labS = "niveau s (1 e⁻)"; }
      var yS = (sTop + sBot) / 2, yP = (pTop + pBot) / 2;
      if (yS - yP < 30){ var mid = (yS + yP) / 2; yS = mid + 15; yP = mid - 15; }
      var maxw = b2[2] - 8 - tx, fs = zfz(f, 10);
      g.save(); g.font = "800 " + fs + "px Mulish, system-ui, sans-serif";
      function fit(sx){ while (g.measureText(sx).width > maxw && sx.length > 4) sx = sx.slice(0, -2) + "…"; return sx; }
      var LS = fit(labS), LP = fit(labP); g.restore();
      zT(S, f, LP, tx, yP, {size:fs, color:"#d07a1a", align:"left", weight:800});
      zT(S, f, LS, tx, yS, {size:fs, color:"#2f6fd6", align:"left", weight:800});
      if (ST.eg > 0 && N > 0){
        var xg = lx0 + (lx1 - lx0) * 0.78;
        if (pBot - sTop < -14) {
          g.save(); g.strokeStyle = "#13233a"; g.lineWidth = 1.2; S.draw.arrow(f, xg, sTop - 2, xg, pBot + 2, "#13233a", 1.4); S.draw.arrow(f, xg, pBot + 2, xg, sTop - 2, "#13233a", 1.4); g.restore();
        }
        var ym = (sTop + pBot) / 2, gtxt = (N === 1 ? "ΔE = " : "E_g = ") + zN(ST.eg, 2) + " eV";
        zT(S, f, gtxt, tx, Math.max(yP + 15, Math.min(yS - 15, ym)), {size:fs, color:"#13233a", align:"left", weight:800, bg:"rgba(255,255,255,.9)"});
      } else if (N > 1 && val === 2){
        zT(S, f, "bandes chevauchées", tx, Math.max(yP + 15, Math.min(yS - 15, (sTop + pBot) / 2)), {size:fs, color:"#1f7a3a", align:"left", weight:800, bg:"rgba(255,255,255,.9)"});
      }
      /* ---- afficheurs ---- */
      ro.set(0, ST.eg > 0 ? zN(ST.eg, 2) + " eV" : "aucune");
      ro.set(1, N > 1 ? zN(ST.wp, 2) + " eV" : "0 (1 niveau)");
      ro.set(2, N > 1 ? zN(BS.hb / (val === 1 ? ST.t[0] : tp), 2) + " fs" : "— (1 atome)");
      var fr = ST.eg > 0 && val === 2 && N > 1 ? Math.exp(-ST.eg / (2 * BS.kT)) : null;
      ro.set(3, fr == null ? (kind === "at" ? "—" : "bande non pleine") : "≈ " + zsci(fr, 1));
      var msg;
      if (kind === "at") msg = "Un atome seul : deux niveaux nets (s et p). Ajoute des atomes : chacun se divise en autant de niveaux qu'il y a d'atomes.";
      else if (kind === "met") msg = val === 1 ? "Un électron par atome : la bande basse n'est remplie qu'à moitié. Juste au-dessus des électrons, il reste des niveaux libres : ils accélèrent dans le champ, c'est un métal." :
        "Les atomes sont si proches que les bandes s et p se chevauchent : des électrons passent dans la bande p, les deux bandes sont incomplètes, le solide conduit.";
      else if (kind === "loc") msg = "Un électron par atome, mais les atomes sont si loin que la bande s ne fait que " + zN(4 * ST.t[0] * 1000, 0) + " meV de large : la répulsion entre deux électrons sur un même atome l'emporte, chaque électron reste chez lui (isolant de Mott, hors de la théorie des bandes simple). Rapproche les atomes.";
      else if (kind === "sc") msg = "Bande de valence pleine, bande interdite de " + zN(ST.eg, 2) + " eV : à 300 K, le nombre d'électrons qui la franchissent est proportionnel à e^(−E_g/2kT)." + (hasDop ? " Le donneur a un niveau 0,045 eV sous la bande de conduction : son électron y passe et conduit (dopage n)." : " Ajoute un donneur pour le faire conduire.");
      else msg = "Bande interdite de " + zN(ST.eg, 2) + " eV, bien plus que kT ≈ 0,026 eV : presque aucun électron ne la franchit, isolant." + (hasDop ? (ST.mob > 0 ? " Ce donneur peu profond (0,045 eV) libère pourtant son électron : dopage n." : " Le donneur garde son électron : la bande de conduction est trop étroite pour qu'il s'y déplace.") : " Rapproche les atomes pour élargir les bandes.");
      nt.set(msg, kind === "met" || kind === "sc" ? "ok" : kind === "iso" || kind === "loc" ? "warn" : "");
    });
  }
});

/* =====================================================================
   3. Une molécule qui tourne et qui vibre : niveaux et spectre infrarouge (pq10)
   Rotateur rigide + oscillateur harmonique : E(v, l) = (v + ½)ħω + l(l + 1)ħ²/2I.
   Transitions v = 0 → 1 avec Δl = ±1 : branche R (l → l + 1) et branche P (l → l − 1), pas de raie à ν₀.
   ν₀ : origine de la bande fondamentale mesurée ; B = ħ/(4πcI) : constante de rotation de v = 0.
   ===================================================================== */
var RV_HC_K = 1.438776877;   /* hc/k_B en cm·K */
var RV_MEV = 0.12398419843;  /* meV par cm⁻¹ */
var RV = {
  co:{nom:"CO", nu0:2143.27, B:1.9225, m1:12.0, m2:15.99491462, a1:"C", a2:"O", c1:"#4a525e", c2:"#e0403a", r1:0.25, r2:0.23, span:128, Ls:10, res:0.85},
  hcl:{nom:"HCl", nu0:2885.98, B:10.4398, m1:1.00782503, m2:34.96885268, a1:"H", a2:"Cl", c1:"#eef0f4", c2:"#46b35a", r1:0.14, r2:0.33, span:330, Ls:7, res:2.2}
};
(function(){ for (var key in RV){ var M = RV[key], mu = M.m1 * M.m2 / (M.m1 + M.m2) * UMA;
  M.I = HP / (8 * PI * PI * CL * 100 * M.B); M.r = Math.sqrt(M.I / mu) * 1e12; M.k = mu * Math.pow(TAU * CL * 100 * M.nu0, 2); } })();
/* raies : {br, l (niveau bas), nu, s (population relative du niveau bas)} */
function rvLines(M, T){
  var out = [], Z = 0, l, mx = 0;
  var pm = 0; for (l = 0; l < 80; l++) pm = Math.max(pm, (2 * l + 1) * Math.exp(-RV_HC_K * M.B * l * (l + 1) / T));
  for (l = 0; l < 80; l++){ var p = (2 * l + 1) * Math.exp(-RV_HC_K * M.B * l * (l + 1) / T); if (p < 0.004 * pm && l > 3) break;
    out.push({br:"R", l:l, nu:M.nu0 + 2 * M.B * (l + 1), s:p});
    if (l >= 1) out.push({br:"P", l:l, nu:M.nu0 - 2 * M.B * l, s:p});
    mx = Math.max(mx, p); }
  out.forEach(function(o){ o.s /= mx; });
  return out;
}
function rvLmax(M, T){ var best = 0, bp = -1; for (var l = 0; l < 80; l++){ var p = (2 * l + 1) * Math.exp(-RV_HC_K * M.B * l * (l + 1) / T); if (p > bp){ bp = p; best = l; } } return best; }
function rvTrans(lines, nu, sig){ var a = 0; lines.forEach(function(o){ a += 1.9 * o.s * Math.exp(-Math.pow((nu - o.nu) / sig, 2) / 2); }); return Math.exp(-a); }

SFA.sim({
  id:"pq-rotation-vibration-co", ch:"pq10", tag:"Molécules",
  titre:"Une molécule qui tourne et qui vibre : niveaux et spectre infrarouge",
  resume:"Un faisceau infrarouge balaie les fréquences à travers une cuve de CO : chaque raie absorbée fait monter la molécule d'un niveau de vibration en changeant sa rotation d'un cran.",
  but:"Regarde le faisceau balayer : à chaque raie, la flèche montre le saut v = 0 → 1 avec l → l ± 1. Glisse sur le spectre pour choisir toi-même la fréquence. Change la température, passe à HCl, puis au satellite. Glisse sur la scène pour tourner.",
  aRetenir:"Une raie infrarouge = un saut de vibration (ħω) accompagné d'un saut de rotation (Δl = ±1) : deux branches P et R de raies écartées de 2B, sans raie au centre.",
  piege:"Le trou au milieu du spectre n'est pas une raie manquée : la transition sans changement de rotation (Δl = 0) est interdite.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 350), f = k.canvas(phone ? 520 : 300);
    var key = "co", scene = "lab";
    var mS = k.seg("Molécule", [["co", "CO"], ["hcl", "HCl"]], "co", function(x){ key = x; if (x === "hcl" && scene === "sat"){ scene = "lab"; sS.set("lab"); tS.set(296); } nu = RV[key].nu0 - RV[key].span; man = 0; });
    var sS = k.seg("Scène", [["lab", "Laboratoire"], ["sat", "Satellite"]], "lab", function(x){ scene = x; if (x === "sat"){ key = "co"; mS.set("co"); tS.set(250); } else tS.set(296); nu = RV[key].nu0 - RV[key].span; man = 0; });
    var tS = k.slider("Température du gaz", 50, 1000, 1, 296, "K");
    var ro = k.readouts(["Nombre d'onde du faisceau", "Raie la plus proche", "Vibration ħω", "Rotation 2B"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.38; v.b = 0.34; v.f = 16; v.set();
    var nu = RV.co.nu0 - RV.co.span, man = 0, tA = 0, phi = 0, vibP = 0, exc = 0, lastHit = null, GEO = null, drag = false;
    zorbit(c, v, k, [-0.1, 1.1]);
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO) return;
      var inS = p.x >= GEO.x0 - 4 && p.x <= GEO.x1 + 4 && p.y >= GEO.y0 && p.y <= GEO.y1;
      if (type === "down" && inS) drag = true;
      if ((type === "down" || type === "drag") && drag){ nu = Math.max(GEO.n0, Math.min(GEO.n1, GEO.inu(p.x))); man = 1e9; k.redraw(); }
      if (type === "move") f.cv.style.cursor = inS ? "ew-resize" : "default";
      if (type === "up" && drag){ drag = false; man = 3; }
    });
    var lp = k.loop(function(dt){
      tA += dt;
      var M = RV[key], n0 = M.nu0 - M.span, n1 = M.nu0 + M.span;
      if (man > 0 && man < 1e8) man -= dt;
      if (man <= 0){ nu += dt * (n1 - n0) / 11; if (nu > n1) nu = n0; }
      /* état affiché : niveau bas de la raie touchée, sinon le plus peuplé */
      var T = tS.value, L = rvLines(M, T), sig = M.res, hit = null;
      L.forEach(function(o){ if (o.s > 0.03 && Math.abs(o.nu - nu) < 1.6 * sig && (!hit || Math.abs(o.nu - nu) < Math.abs(hit.nu - nu))) hit = o; });
      if (hit){ exc = Math.min(1, exc + dt * 6); lastHit = hit; } else exc = Math.max(0, exc - dt * 1.5);
      var l = exc > 0.5 && lastHit ? (lastHit.br === "R" ? lastHit.l + 1 : lastHit.l - 1) : (lastHit && exc > 0 ? lastHit.l : rvLmax(M, T));
      phi += dt * (0.35 + 0.18 * Math.sqrt(l * (l + 1)));
      vibP += dt * TAU * 2.4;
      if (!v.user){ v.a = -0.38 + 0.18 * Math.sin(tA * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    /* dessin de la molécule : deux sphères et un ressort, axe tournant, liaison qui vibre */
    function molecule(V, cx, cy, cz, len, M, amp, glow, pv){
      var ax = [Math.cos(phi), 0.18 * Math.sin(phi * 0.7), Math.sin(phi)], la = Math.hypot(ax[0], ax[1], ax[2]); ax = [ax[0] / la, ax[1] / la, ax[2] / la];
      var m1 = M.m1, m2 = M.m2, Lb = len * (1 + amp * Math.sin(vibP)), d1 = Lb * m2 / (m1 + m2), d2 = Lb * m1 / (m1 + m2);
      var A = [cx - ax[0] * d1, cy - ax[1] * d1, cz - ax[2] * d1], B = [cx + ax[0] * d2, cy + ax[1] * d2, cz + ax[2] * d2];
      V.sprite(cx, cy, cz, function(g){
        var PA = pv(A), PB = pv(B), sc = V.sc;
        if (glow > 0) zglow(g, (PA.x + PB.x) / 2, (PA.y + PB.y) / 2, (Lb * 0.9 + 0.3) * sc * PA.s, [255, 120, 60], 0.45 * glow);
        /* ressort : hélice autour de l'axe */
        var t0 = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        var u = [ax[1] * t0[2] - ax[2] * t0[1], ax[2] * t0[0] - ax[0] * t0[2], ax[0] * t0[1] - ax[1] * t0[0]], lu = Math.hypot(u[0], u[1], u[2]); u = [u[0] / lu, u[1] / lu, u[2] / lu];
        var w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]], rh = len * 0.07;
        g.save(); g.beginPath();
        for (var i = 0; i <= 90; i++){ var s = i / 90, th = s * TAU * 7, q = [A[0] + (B[0] - A[0]) * s + rh * (Math.cos(th) * u[0] + Math.sin(th) * w[0]), A[1] + (B[1] - A[1]) * s + rh * (Math.cos(th) * u[1] + Math.sin(th) * w[1]), A[2] + (B[2] - A[2]) * s + rh * (Math.cos(th) * u[2] + Math.sin(th) * w[2])], P = pv(q);
          if (i) g.lineTo(P.x, P.y); else g.moveTo(P.x, P.y); }
        g.strokeStyle = "#c9d3e2"; g.lineWidth = Math.max(1.2, 0.028 * sc); g.stroke(); g.restore();
        var bigA = [PA, M.r1, M.c1, M.a1], bigB = [PB, M.r2, M.c2, M.a2];
        (PA.z < PB.z ? [bigA, bigB] : [bigB, bigA]).forEach(function(o){
          var rr = o[1] * len * 1.6 * sc * o[0].s;
          zball(g, o[0].x, o[0].y, rr, o[2]);
          if (rr > 9) zT(S, c, o[3], o[0].x, o[0].y + 1, {size:Math.min(15, rr * 0.75), color:o[2] === "#eef0f4" ? "#2a3240" : "#fff", weight:800});
        });
      });
      return {A:A, B:B};
    }
    k.draw(function(){
      var M = RV[key], T = tS.value, L = rvLines(M, T), sig = M.res, lm = rvLmax(M, T), i;
      var n0 = M.nu0 - M.span, n1 = M.nu0 + M.span;
      var hit = null; L.forEach(function(o){ if (o.s > 0.03 && Math.abs(o.nu - nu) < 1.6 * sig && (!hit || Math.abs(o.nu - nu) < Math.abs(hit.nu - nu))) hit = o; });
      var xr = (nu - M.nu0) / (2 * M.B), near = xr >= 0 ? {br:"R", l:Math.max(0, Math.round(xr - 1))} : {br:"P", l:Math.max(1, Math.round(-xr))};
      var tr = rvTrans(L, nu, sig);
      var ctx = c.ctx, W = c.W, H = c.H, pv = function(q){ return v.p(q[0], q[1], q[2]); };
      v.clear();
      if (scene === "lab"){
        /* ================= banc de spectroscopie infrarouge ================= */
        zlab(ctx, W, H, "#1e2944", "#090d18");
        v.sc = phone ? Math.min(W / 7.3, H / 3.5) : Math.min(W / 6.9, H / 3.5); v.cx = W * 0.5; v.cy = H * 0.5;
        var yA = -0.02;
        v.box(-3.3, -1.05, -1.1, 3.3, -0.9, 1.1, "#4b5668", {cols:[null, null, null, "#6a778c"]});
        /* source accordable (laser IR) */
        v.box(-3.15, -0.9, -0.42, -2.15, 0.38, 0.42, "#2f3a4d");
        v.cyl([-2.15, yA, 0], [-2.0, yA, 0], 0.13, 14, "#11161f", {cap1:"#ff6a3a"});
        /* cuve à gaz : cylindre de verre sur deux supports */
        v.box(-1.0, -0.9, -0.22, -0.8, -0.6, 0.22, "#3c4658"); v.box(0.8, -0.9, -0.22, 1.0, -0.6, 0.22, "#3c4658");
        v.cyl([-1.35, yA, 0], [1.35, yA, 0], 0.8, 28, "#9fd0ff", {alpha:0.15, cap0:"#c8e6ff", cap1:"#c8e6ff"});
        /* détecteur */
        v.box(2.15, -0.9, -0.45, 3.15, 0.38, 0.45, "#2f3a4d");
        v.cyl([2.15, yA, 0], [2.0, yA, 0], 0.16, 14, "#11161f", {cap1:"#20262f"});
        /* faisceau */
        v.sprite(0, yA, 0.9, function(g){
          var a = v.p(-2.0, yA, 0), b = v.p(2.0, yA, 0);
          g.save(); g.lineCap = "round";
          var g1 = g.createLinearGradient(a.x, a.y, b.x, b.y); g1.addColorStop(0, "rgba(255,90,60,.75)"); g1.addColorStop(0.5, "rgba(255,90,60," + (0.75 * (0.35 + 0.65 * tr)) + ")"); g1.addColorStop(1, "rgba(255,90,60," + (0.75 * tr) + ")");
          g.strokeStyle = g1; g.lineWidth = 0.09 * v.sc; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
          g.strokeStyle = "rgba(255,220,200," + (0.5 * tr + 0.2) + ")"; g.lineWidth = 0.025 * v.sc; g.stroke(); g.restore();
        });
        molecule(v, 0, yA, 0, 0.82, M, exc > 0.5 ? 0.16 : 0.07, exc, pv);
        v.render(ctx);
        /* écran du détecteur : intensité transmise */
        var sp = v.p(2.65, 0.1, 0.46), bw = phone ? 44 : 52;
        ctx.save(); zrr(ctx, sp.x - bw / 2, sp.y - 16, bw, 26, 4); ctx.fillStyle = "#0c1a10"; ctx.fill(); ctx.strokeStyle = "#5a6b80"; ctx.stroke();
        ctx.fillStyle = "#57e389"; ctx.fillRect(sp.x - bw / 2 + 4, sp.y - 2, (bw - 8) * tr, 8); ctx.restore();
        zT(S, c, zN(tr * 100, 0) + " %", sp.x, sp.y - 9, {size:9.5, color:"#9cf0b9", weight:800});
        var s1 = v.p(-2.65, 0.38, 0), s2 = v.p(0, 0.8, 0), s3 = v.p(2.65, 0.38, 0);
        ztag(S, c, "laser IR · " + zN(1e4 / nu, 3) + " µm", s1.x, s1.y - 14, {size:10.5, color:"#ffb59c"});
        ztag(S, c, "cuve de " + M.nom + " · " + zN(T, 0) + " K", s2.x, s2.y - 14, {size:10.5, color:"#bfe1ff"});
        ztag(S, c, "détecteur", s3.x, s3.y - 14, {size:10.5});
        zT(S, c, "faisceau infrarouge (invisible, dessiné en rouge)", W / 2, H - 14, {size:zfz(c, 10), color:"rgba(255,190,170,.8)", weight:600});
      } else {
        /* ================= orbite : satellite au-dessus de l'atmosphère ================= */
        var sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#02040b"); sky.addColorStop(1, "#0b1630"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
        for (i = 0; i < 60; i++){ var sx = (i * 137.5) % W, sy = (i * 71.3) % (H * 0.55); ctx.fillStyle = "rgba(255,255,255," + (0.25 + 0.5 * ((i * 7) % 10) / 10) + ")"; ctx.fillRect(sx, sy, 1.4, 1.4); }
        var Rr = W * 1.6, ecx = W / 2, ecy = H * 0.78 + Rr;
        var atm = ctx.createRadialGradient(ecx, ecy, Rr - 4, ecx, ecy, Rr + 46); atm.addColorStop(0, "rgba(120,190,255,.55)"); atm.addColorStop(1, "rgba(120,190,255,0)");
        ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(ecx, ecy, Rr + 46, 0, TAU); ctx.fill();
        var gE = ctx.createLinearGradient(0, H * 0.75, 0, H); gE.addColorStop(0, "#2f6fb0"); gE.addColorStop(0.4, "#2b7a4b"); gE.addColorStop(1, "#1d4a2e");
        ctx.fillStyle = gE; ctx.beginPath(); ctx.arc(ecx, ecy, Rr, 0, TAU); ctx.fill();
        /* rayonnement infrarouge de la surface qui monte */
        for (i = 0; i < 5; i++){
          var xw = W * (0.3 + 0.1 * i), y0w = H * 0.8, ph2 = (tA * 40 + i * 37) % 90;
          ctx.save(); ctx.strokeStyle = "rgba(255,110,70," + (0.55 * (1 - ph2 / 90)) + ")"; ctx.lineWidth = 2; ctx.beginPath();
          for (var q = 0; q <= 20; q++){ var yy = y0w - ph2 - q * 2.4; ctx.lineTo(xw + 4 * Math.sin(q * 0.9 + tA * 6), yy); } ctx.stroke(); ctx.restore();
        }
        /* molécules de CO dans l'atmosphère (petites) */
        for (i = 0; i < 7; i++){
          var mx = W * (0.12 + 0.125 * i), my = H * (0.62 + 0.06 * Math.sin(i * 2.1)), an = phi * (0.8 + 0.1 * i) + i, ll = 7;
          zball(ctx, mx - ll * Math.cos(an) * 0.55, my - ll * Math.sin(an) * 0.25, 4, "#4a525e"); zball(ctx, mx + ll * Math.cos(an) * 0.45, my + ll * Math.sin(an) * 0.2, 3.6, "#e0403a");
        }
        /* satellite 3D */
        v.sc = phone ? Math.min(W / 7, H / 4.2) : Math.min(W / 8.5, H / 4.4); v.cx = W * 0.5; v.cy = H * 0.3;
        v.box(-0.45, -0.4, -0.4, 0.45, 0.4, 0.4, "#c9a23a");
        v.box(-2.2, -0.03, -0.32, -0.55, 0.03, 0.32, "#25406e", {cols:[null, null, null, "#3d6bb5"]});
        v.box(0.55, -0.03, -0.32, 2.2, 0.03, 0.32, "#25406e", {cols:[null, null, null, "#3d6bb5"]});
        v.cyl([-0.55, 0, 0], [-0.45, 0, 0], 0.04, 8, "#9aa4b0"); v.cyl([0.45, 0, 0], [0.55, 0, 0], 0.04, 8, "#9aa4b0");
        v.cyl([0, -0.4, 0], [0, -0.62, 0], 0.18, 16, "#2a3240", {cap1:"#1a1f28"});
        v.render(ctx);
        /* médaillon : une molécule de CO agrandie */
        var mr = phone ? 46 : 54, mcx = W - mr - 12, mcy = H * 0.5;
        ctx.save(); ctx.beginPath(); ctx.arc(mcx, mcy, mr, 0, TAU); ctx.fillStyle = "rgba(10,18,36,.85)"; ctx.fill(); ctx.strokeStyle = "rgba(190,215,255,.6)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.clip();
        var V2 = new Z3(); V2.a = v.a; V2.b = 0.3; V2.f = 0; V2.set(); V2.sc = mr * 1.15; V2.cx = mcx; V2.cy = mcy; V2.clear();
        molecule(V2, 0, 0, 0, 0.62, M, exc > 0.5 ? 0.16 : 0.07, exc, function(q){ return V2.p(q[0], q[1], q[2]); });
        V2.render(ctx); ctx.restore();
        ztag(S, c, "CO agrandie", mcx, mcy + mr + 10, {size:10});
        var st = v.p(0, 0.5, 0); ztag(S, c, "satellite : spectromètre IR", st.x, Math.max(16, st.y - 22), {size:10.5, color:"#ffe08a"});
        ztag(S, c, "CO de l'atmosphère, " + zN(T, 0) + " K", W * 0.3, H * 0.53, {size:10.5, color:"#bfe1ff"});
        zT(S, c, "le sol chaud émet de l'infrarouge", W * 0.5, H - 12, {size:zfz(c, 10), color:"rgba(255,190,170,.85)", weight:700});
      }
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      var lshow = exc > 0.5 && lastHit ? (lastHit.br === "R" ? lastHit.l + 1 : lastHit.l - 1) : (lastHit && exc > 0 ? lastHit.l : lm);
      var vst = exc > 0.5 ? 1 : 0;
      ztag(S, c, "v = " + vst + " · l = " + lshow, 10, 16, {size:11.5, align:"left", color:exc > 0.5 ? "#ffb59c" : "#eef3fb"});
      if (!phone || scene === "lab") zT(S, c, "vibration ≈ " + zN(M.nu0 / (2 * M.B * Math.sqrt(Math.max(1, lshow) * (Math.max(1, lshow) + 1))), 0) + " × plus rapide que la rotation (non à l'échelle)", 10, 36, {size:zfz(c, 10), color:"rgba(210,222,240,.75)", align:"left", weight:600});

      /* ================= niveaux (à gauche) et spectre (à droite) ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var b1 = phone ? [8, 6, FW - 8, FH * 0.5] : [8, 6, FW * 0.42, FH - 6];
      var b2 = phone ? [8, FH * 0.5 + 6, FW - 8, FH - 6] : [FW * 0.42 + 8, 6, FW - 8, FH - 6];
      [b1, b2].forEach(function(b){ g.save(); zrr(g, b[0], b[1], b[2] - b[0], b[3] - b[1], 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore(); });
      /* --- niveaux --- */
      zT(S, f, "Niveaux de " + M.nom, b1[0] + 10, b1[1] + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      var Ls = 6; L.forEach(function(o){ if (o.s > 0.03) Ls = Math.max(Ls, o.l + 1); }); Ls = Math.min(Ls, 14);
      var top = b1[1] + 44, bot = b1[3] - 14, gapPx = 26, stackH = (bot - top - gapPx) / 2;
      var lx0 = b1[0] + 44, lx1 = b1[0] + (b1[2] - b1[0]) * 0.62;
      function LY(vq, l){ var base = vq === 0 ? bot : bot - stackH - gapPx; return base - l * (l + 1) / (Ls * (Ls + 1)) * (stackH - 6); }
      [0, 1].forEach(function(vq){
        var lastY = LY(vq, 0);
        for (var l = 0; l <= Ls; l++){
          var y = LY(vq, l), on = hit && ((vq === 0 && l === hit.l) || (vq === 1 && l === (hit.br === "R" ? hit.l + 1 : hit.l - 1)));
          g.save(); g.strokeStyle = on ? "#c0392b" : vq === 0 ? "#2f6fd6" : "#7a4fd0"; g.lineWidth = on ? 2.6 : l === 0 ? 2 : 1.1; g.globalAlpha = on ? 1 : l === 0 ? 0.95 : 0.6;
          g.beginPath(); g.moveTo(lx0, y); g.lineTo(lx1, y); g.stroke(); g.restore();
          if (l >= 3 && lastY - y >= 13 && (l === Ls || LY(vq, l) - LY(vq, Ls) >= 13)){ lastY = y;  zT(S, f, "l = " + l, lx1 + 4, y, {size:zfz(f, 9), color:"#6b7686", align:"left", weight:700}); }
        }
        zT(S, f, "v = " + vq, b1[0] + 8, LY(vq, 0) - 2, {size:zfz(f, 11), color:vq === 0 ? "#2f6fd6" : "#7a4fd0", align:"left", weight:800});
        zT(S, f, "l = 0, 1, 2", lx1 + 4, LY(vq, 0) - 2, {size:zfz(f, 9), color:"#6b7686", align:"left", weight:700});
      });
      /* axe coupé entre les deux empilements */
      var yb = bot - stackH - gapPx / 2;
      zT(S, f, "ħω = " + zN(M.nu0 * RV_MEV, 0) + " meV", lx1 + 4, yb, {size:zfz(f, 9), color:"#13233a", align:"left", weight:800});
      g.save(); g.strokeStyle = "rgba(120,130,150,.5)"; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(lx0, yb - 5); g.lineTo(lx1, yb - 5); g.moveTo(lx0, yb + 5); g.lineTo(lx1, yb + 5); g.stroke(); g.restore();
      zT(S, f, "↑ électronique : ≈ 8 eV (" + zN(8000 / (M.nu0 * RV_MEV), 0) + " ħω)", b1[0] + 10, b1[1] + 30, {size:zfz(f, 9.5), color:"#8792a2", align:"left", weight:700});
      /* flèche de la transition */
      if (hit && hit.l <= Ls && (hit.br === "R" ? hit.l + 1 : hit.l - 1) <= Ls){
        var xa = lx0 + (lx1 - lx0) * (hit.br === "R" ? 0.62 : 0.35);
        S.draw.arrow(f, xa, LY(0, hit.l) - 1, xa, LY(1, hit.br === "R" ? hit.l + 1 : hit.l - 1) + 1, "#c0392b", 2.4);
      } else if (hit){
        zT(S, f, "l = " + hit.l + " : hors du dessin", (lx0 + lx1) / 2, bot - stackH * 0.55, {size:zfz(f, 9.5), color:"#c0392b", weight:800, bg:"rgba(255,255,255,.9)"});
      }
      zT(S, f, "rotation agrandie", lx0, bot + 8, {size:zfz(f, 8.5), color:"#8792a2", align:"left", weight:600});
      /* --- spectre --- */
      var sx0 = b2[0] + 12, sx1 = b2[2] - 12, sy0 = b2[1] + 64, sy1 = b2[3] - 30;
      function SX(n){ return sx0 + (n - n0) / (n1 - n0) * (sx1 - sx0); }
      function SY(tt){ return sy1 - tt * (sy1 - sy0); }
      GEO = {x0:sx0, x1:sx1, y0:sy0 - 30, y1:sy1 + 30, n0:n0, n1:n1, inu:function(px){ return n0 + (px - sx0) / (sx1 - sx0) * (n1 - n0); }};
      zT(S, f, scene === "sat" ? "Spectre vu du satellite" : "Spectre transmis par la cuve", b2[0] + 10, b2[1] + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      zT(S, f, "l le plus peuplé : " + lm, b2[2] - 10, b2[1] + 13, {size:zfz(f, 10), color:"#6b7686", align:"right", weight:800});
      g.save(); g.strokeStyle = "#eef1f5";
      [0, 0.5, 1].forEach(function(tt){ g.beginPath(); g.moveTo(sx0, SY(tt)); g.lineTo(sx1, SY(tt)); g.stroke(); });
      g.restore();
      var NS = Math.max(300, Math.round((sx1 - sx0) * 1.5)), pts = [];
      for (i = 0; i <= NS; i++){ var nn = n0 + (n1 - n0) * i / NS; pts.push([SX(nn), SY(rvTrans(L, nn, sig)), nn]); }
      g.save(); g.beginPath(); pts.forEach(function(p, j){ if (j) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.strokeStyle = "rgba(120,130,150,.22)"; g.lineWidth = 1; g.stroke(); g.restore();
      g.save(); g.beginPath(); var started = false;
      pts.forEach(function(p){ if (p[2] > nu) return; if (started) g.lineTo(p[0], p[1]); else { g.moveTo(p[0], p[1]); started = true; } });
      g.strokeStyle = "#c0392b"; g.lineWidth = 1.8; g.stroke(); g.restore();
      /* ν₀ et branches */
      g.save(); g.setLineDash([3, 3]); g.strokeStyle = "rgba(19,35,58,.35)"; g.beginPath(); g.moveTo(SX(M.nu0), sy0 - 4); g.lineTo(SX(M.nu0), sy1); g.stroke(); g.restore();
      zT(S, f, "ν₀ : pas de raie", SX(M.nu0), sy0 - 13, {size:zfz(f, 9.5), color:"#13233a", weight:800, bg:"rgba(255,255,255,.95)"});
      zT(S, f, "branche P", (sx0 + SX(M.nu0)) / 2 - 14, sy0 - 32, {size:zfz(f, 10.5), color:"#2f6fd6", weight:800});
      zT(S, f, "branche R", (SX(M.nu0) + sx1) / 2 + 14, sy0 - 32, {size:zfz(f, 10.5), color:"#7a4fd0", weight:800});
      /* graduation */
      var stp = zstep(n1 - n0, phone ? 3 : 4);
      for (var gv = Math.ceil(n0 / stp) * stp; gv <= n1 + 1e-9; gv += stp){ var X = SX(gv); g.strokeStyle = "#b8c2d0"; g.beginPath(); g.moveTo(X, sy1 + 2); g.lineTo(X, sy1 + 6); g.stroke();
        zT(S, f, zN(gv, 0), X, sy1 + 14, {size:zfz(f, 9.5), color:"#5f6b7a", weight:600}); }
      zT(S, f, "ν̃ (cm⁻¹)", sx1, sy1 + 25, {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:800});
      zT(S, f, "transmis", sx0, sy1 + 25, {size:zfz(f, 9.5), color:"#5f6b7a", align:"left", weight:700});
      /* curseur du faisceau */
      var xn = SX(nu);
      g.save(); g.strokeStyle = "#c0392b"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(xn, sy0 - 4); g.lineTo(xn, sy1); g.stroke(); g.restore();
      zball(g, xn, SY(tr), 4.5, "#c0392b");
      if (hit){ var lab = hit.br + "(" + hit.l + ")", lx = Math.max(sx0 + 16, Math.min(sx1 - 16, xn)); zT(S, f, lab, lx, SY(tr) + 16 > sy1 - 4 ? SY(tr) - 14 : SY(tr) + 16, {size:zfz(f, 10), color:"#c0392b", weight:800, bg:"rgba(255,255,255,.9)"}); }
      /* ---- afficheurs ---- */
      ro.set(0, zN(nu, 1) + " cm⁻¹");
      ro.set(1, near.br + "(" + near.l + ") : " + near.l + " → " + (near.br === "R" ? near.l + 1 : near.l - 1));
      ro.set(2, zN(M.nu0 * RV_MEV, 1) + " meV");
      ro.set(3, zN(2 * M.B * RV_MEV, 3) + " meV");
      nt.set((scene === "sat" ? "Vu d'orbite, le CO de l'atmosphère creuse les mêmes raies vers 4,7 µm dans l'infrarouge émis par le sol : leur profondeur donne la quantité de CO. " : "") +
        M.nom + " : liaison de " + zN(M.r, 1) + " pm (de I = ħ/(4πcB)), raideur k = μω² ≈ " + zN(M.k, 0) + " N/m. Raies espacées de 2B = " + zN(2 * M.B, 2) + " cm⁻¹ ; à " + zN(T, 0) + " K, le niveau le plus peuplé est l = " + lm + ".", "ok");
    });
  }
});
})();
