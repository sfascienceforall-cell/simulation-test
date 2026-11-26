/* Physique quantique · lot Q4 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-oscillateur-quantique · pq-microscope-tunnel (pq05)
   pq-moment-cinetique-cones · pq-potentiel-effectif-orbites (pq06)
   pq-deux-particules-identiques · pq-masse-reduite-hydrogenoides (pq07)
   Fichier autonome (aides préfixées q4). Aucune ressource externe : la 3D est une projection faite main. */
(function(){
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018) ---------- */
var HP = 6.62607015e-34, HB = HP / TAU, ME = 9.1093837015e-31, QE = 1.602176634e-19, CL = 2.99792458e8;
var UMA = 1.66053906660e-27, A0PM = 52.917721, RYEV = 13.605693, HAEV = 27.211386;
var HC_EVNM = HP * CL / QE * 1e9;            /* 1239,84 eV·nm */
var MP_ME = 1836.15267, MMU_ME = 206.768283; /* masses du proton et du muon, en masses d'électron */

/* ---------- petites aides ---------- */
function q4rgb(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function q4shade(col, f){
  var c = typeof col === "string" ? q4rgb(col) : col;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function q4a(col, a){ var c = typeof col === "string" ? q4rgb(col) : col; return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
function q4fz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function q4N(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d == null ? 2 : d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
/* nombre « propre » : d chiffres significatifs, sans zéros inutiles */
function q4S(x, d){
  if (!isFinite(x)) return "—"; if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), dec = Math.max(0, (d || 3) - 1 - e);
  var s = Number(x).toFixed(dec); if (dec > 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s.replace("-", "−").replace(".", ",");
}
var Q4SUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
function q4sci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return q4S(x, d + 1);
  return q4N(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : String(e).split("").map(function(ch){ return Q4SUP[ch]; }).join(""));
}
function q4T(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function q4rr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function q4ball(ctx, x, y, r, col, alpha){
  if (!isFinite(x) || !isFinite(y) || !(r > 0)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, q4shade(col, 0.75)); g.addColorStop(0.45, q4shade(col, 0)); g.addColorStop(1, q4shade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, TAU); ctx.fill(); ctx.restore();
}
function q4glow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, q4a(col, a == null ? 0.8 : a)); g.addColorStop(1, q4a(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
/* ombre portée elliptique */
function q4shadow(ctx, x, y, rx, ry, a){
  if (!(rx > 0) || !(ry > 0)) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, "rgba(0,0,0," + (a || 0.35) + ")"); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}
/* couleur perçue d'une longueur d'onde (nm) */
function q4wl(nm){
  var r = 0, g = 0, b = 0;
  if (nm < 380) return [150, 90, 255];
  if (nm < 440){ r = (440 - nm) / 60; b = 1; }
  else if (nm < 490){ g = (nm - 440) / 50; b = 1; }
  else if (nm < 510){ g = 1; b = (510 - nm) / 20; }
  else if (nm < 580){ r = (nm - 510) / 70; g = 1; }
  else if (nm < 645){ r = 1; g = (645 - nm) / 65; }
  else if (nm <= 780){ r = 1; }
  else return [150, 40, 40];
  var f = nm < 420 ? 0.35 + 0.65 * (nm - 380) / 40 : nm > 700 ? 0.35 + 0.65 * (780 - nm) / 80 : 1;
  return [Math.round(255 * Math.pow(r * f, 0.8)), Math.round(255 * Math.pow(g * f, 0.8)), Math.round(255 * Math.pow(b * f, 0.8))];
}
/* couleur d'une phase (roue chromatique) */
function q4hue(ph){
  var h = ((ph % TAU) + TAU) % TAU / TAU * 6, i = Math.floor(h), f = h - i, q = 1 - f, r, g, b;
  if (i === 0){ r = 1; g = f; b = 0; } else if (i === 1){ r = q; g = 1; b = 0; } else if (i === 2){ r = 0; g = 1; b = f; }
  else if (i === 3){ r = 0; g = q; b = 1; } else if (i === 4){ r = f; g = 0; b = 1; } else { r = 1; g = 0; b = q; }
  return [Math.round(40 + 205 * r), Math.round(40 + 205 * g), Math.round(40 + 205 * b)];
}
/* étiquette claire sur fond sombre, bornée au cadre (o.box : zone {x0,x1,y0,y1} où la garder) */
function q4tag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = q4fz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var bx0 = o.box ? o.box.x0 : 0, bx1 = o.box ? o.box.x1 : c.W, by0 = o.box ? o.box.y0 : 0, by1 = o.box ? o.box.y1 : c.H;
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  bx = Math.max(bx0 + 3, Math.min(bx1 - w - 3, bx)); var by = Math.max(by0 + 3, Math.min(by1 - h - 3, y - h / 2));
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.74)"; q4rr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  q4T(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}
/* largeur d'un texte */
function q4tw(c, s, size, weight){ var ctx = c.ctx; ctx.save(); ctx.font = (weight || 700) + " " + size + "px Mulish, system-ui, sans-serif"; var w = ctx.measureText(s).width; ctx.restore(); return w; }
/* fond sombre de laboratoire */
function q4lab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* graduation ronde */
function q4step(span, n){ var s = span / Math.max(1, n), p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
function q4clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function q4fact(n){ var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }


/* repère simple, axe horizontal toujours en bas ; ligne y = 0 renforcée si visible */
function q4axes(S, c, o){
  var ctx = c.ctx, L = o.l, R = c.W - o.r, T = o.t, B = c.H - o.b;
  var ax = {L:L, R:R, T:T, B:B, x0:o.x0, x1:o.x1, y0:o.y0, y1:o.y1};
  ax.X = function(x){ return L + (x - o.x0) / (o.x1 - o.x0) * (R - L); };
  ax.Y = function(y){ return B - (y - o.y0) / (o.y1 - o.y0) * (B - T); };
  var sx = o.stepX || q4step(o.x1 - o.x0, Math.max(3, Math.min(8, (R - L) / 60))), sy = o.stepY || q4step(o.y1 - o.y0, Math.max(3, Math.min(6, (B - T) / 34)));
  var v, fz = q4fz(c, 10.5);
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "#eef1f5"; ctx.beginPath();
  for (v = Math.ceil(o.x0 / sx) * sx; v <= o.x1 + 1e-9; v += sx){ ctx.moveTo(Math.round(ax.X(v)) + 0.5, T); ctx.lineTo(Math.round(ax.X(v)) + 0.5, B); }
  for (v = Math.ceil(o.y0 / sy) * sy; v <= o.y1 + 1e-9; v += sy){ ctx.moveTo(L, Math.round(ax.Y(v)) + 0.5); ctx.lineTo(R, Math.round(ax.Y(v)) + 0.5); }
  ctx.stroke();
  if (o.y0 < 0 && o.y1 > 0){ ctx.strokeStyle = "#a3adba"; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(L, Math.round(ax.Y(0)) + 0.5); ctx.lineTo(R, Math.round(ax.Y(0)) + 0.5); ctx.stroke(); ctx.setLineDash([]); }
  ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(L + 0.5, T); ctx.lineTo(L + 0.5, B + 0.5); ctx.lineTo(R, B + 0.5); ctx.stroke(); ctx.restore();
  var lastX = -1e9;
  for (v = Math.ceil(o.x0 / sx) * sx; v <= o.x1 + 1e-9; v += sx){ var X = ax.X(v), sv = q4N(Math.abs(v) < sx * 1e-6 ? 0 : v, sx < 1 ? 1 : 0), w = q4tw(c, sv, fz, 600);
    if (X - w / 2 < lastX + 6 || X + w / 2 > c.W - 2) continue; lastX = X + w / 2; q4T(S, c, sv, X, B + 10, {size:fz, color:"#7b8694", weight:600}); }
  for (v = Math.ceil(o.y0 / sy) * sy; v <= o.y1 + 1e-9; v += sy){ var Y = ax.Y(v); if (Y < T + 5) continue; q4T(S, c, q4N(Math.abs(v) < sy * 1e-6 ? 0 : v, sy < 1 ? 1 : 0), L - 5, Y, {size:fz, color:"#7b8694", align:"right", weight:600}); }
  if (o.xl) q4T(S, c, o.xl, R, B + 23, {size:q4fz(c, 11), color:"#2c3a4e", align:"right"});
  return ax;
}

/* ---------- moteur 3D minimal : vue orbitale, faces planes éclairées, triées par profondeur ---------- */
function Q4V(){ this.a = -0.5; this.b = 0.35; this.sc = 40; this.cx = 0; this.cy = 0; this.f = 14; this.L = []; this.set(); }
Q4V.prototype.set = function(){ this.ca = Math.cos(this.a); this.sa = Math.sin(this.a); this.cb = Math.cos(this.b); this.sb = Math.sin(this.b); };
/* monde (x, y vers le haut, z) → vue (x à droite, y en haut, z vers toi) */
Q4V.prototype.rot = function(x, y, z){
  var x1 = x * this.ca + z * this.sa, z1 = -x * this.sa + z * this.ca;
  return [x1, y * this.cb - z1 * this.sb, y * this.sb + z1 * this.cb];
};
Q4V.prototype.pv = function(v){ var s = this.f ? this.f / Math.max(0.2, this.f - v[2]) : 1; return {x:this.cx + v[0] * this.sc * s, y:this.cy - v[1] * this.sc * s, z:v[2], s:s}; };
Q4V.prototype.p = function(x, y, z){ return this.pv(this.rot(x, y, z)); };
Q4V.prototype.clear = function(){ this.L = []; };
Q4V.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
Q4V.prototype.sprite = function(x, y, z, fn, dz){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + (dz || 1e-3), fn:fn, v:v}); };
Q4V.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], q = {c:c, cull:true, alpha:o.alpha};
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    this.face(f.map(function(j){ return P[j]; }), o.cols && o.cols[i] ? o.cols[i] : col, q);
  }, this);
};
Q4V.prototype.cyl = function(p0, p1, r, n, col, o){
  o = o || {}; n = n || 14;
  var ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], la = Math.hypot(ax[0], ax[1], ax[2]) || 1; ax = [ax[0] / la, ax[1] / la, ax[2] / la];
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
  if (!o.open){ if (r > 0) this.face(A.slice(), o.cap0 || col, q); if (r1 > 0) this.face(B.slice(), o.cap1 || col, q); }
};
Q4V.prototype.render = function(ctx){
  var self = this, L = this.L, Lt = [-0.42, 0.62, 0.66], i;
  for (i = 0; i < L.length; i++){
    var it = L[i]; if (it.t) continue;
    var V = it.pts.map(function(p){ return self.rot(p[0], p[1], p[2]); });
    var a = V[0], b = V[1], c = V[2];
    var n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
    if (V.length > 3 && Math.hypot(n[0], n[1], n[2]) < 1e-12){ var d2 = V[3]; n = [(c[1] - a[1]) * (d2[2] - a[2]) - (c[2] - a[2]) * (d2[1] - a[1]), (c[2] - a[2]) * (d2[0] - a[0]) - (c[0] - a[0]) * (d2[2] - a[2]), (c[0] - a[0]) * (d2[1] - a[1]) - (c[1] - a[1]) * (d2[0] - a[0])]; }
    var ln = Math.hypot(n[0], n[1], n[2]) || 1; n = [n[0] / ln, n[1] / ln, n[2] / ln];
    var zc = 0, m = [0, 0, 0]; V.forEach(function(v){ zc += v[2]; m[0] += v[0]; m[1] += v[1]; m[2] += v[2]; }); zc /= V.length; m = [m[0] / V.length, m[1] / V.length, m[2] / V.length];
    if (it.o.c){ var cc = self.rot(it.o.c[0], it.o.c[1], it.o.c[2]); if ((m[0] - cc[0]) * n[0] + (m[1] - cc[1]) * n[1] + (m[2] - cc[2]) * n[2] < 0) n = [-n[0], -n[1], -n[2]]; }
    var eye = self.f ? [-m[0], -m[1], self.f - m[2]] : [0, 0, 1];
    it.back = n[0] * eye[0] + n[1] * eye[1] + n[2] * eye[2] < 0;
    it.V = V; it.n = n; it.z = zc + (it.o.dz || 0);
  }
  var D = L.filter(function(it){ return it.t || !(it.back && it.o.cull); });
  D.sort(function(p, q){ return p.z - q.z; });
  for (i = 0; i < D.length; i++){
    var d = D[i];
    if (d.t){ d.fn(ctx, self.pv(d.v)); continue; }
    var nn = d.back ? [-d.n[0], -d.n[1], -d.n[2]] : d.n;
    var dif = Math.max(0, nn[0] * Lt[0] + nn[1] * Lt[1] + nn[2] * Lt[2]) / Math.hypot(Lt[0], Lt[1], Lt[2]);
    var spec = Math.pow(Math.max(0, nn[2] * 0.8 + nn[1] * 0.45), 18) * 0.35;
    var fill = d.o.glow ? d.col : q4shade(d.col, -0.5 + 0.72 * dif + spec);
    ctx.save(); if (d.o.alpha != null) ctx.globalAlpha = d.o.alpha;
    ctx.beginPath();
    d.V.forEach(function(v, j){ var p = self.pv(v); if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.lineJoin = "round"; ctx.lineWidth = d.o.line ? 1 : 0.7; ctx.strokeStyle = d.o.line || fill; ctx.stroke();
    ctx.restore();
  }
};
/* inverse (projection orthographique, f = 0) : point écran → point du plan horizontal y = 0 */
Q4V.prototype.unplane = function(px, py){
  var X1 = (px - this.cx) / this.sc, Z1 = (py - this.cy) / (this.sc * Math.max(0.2, this.sb));
  return [X1 * this.ca - Z1 * this.sa, X1 * this.sa + Z1 * this.ca];
};
/* sphère éclairée posée dans la scène comme un « sprite » trié en profondeur */
function q4sphere(v, x, y, z, rW, col, o){
  o = o || {};
  v.sprite(x, y, z, function(ctx, q){
    var r = rW * v.sc * q.s;
    if (o.glow) q4glow(ctx, q.x, q.y, r * 2.4, o.glow, 0.45);
    q4ball(ctx, q.x, q.y, r, col, o.alpha);
  }, o.dz);
}

/* =====================================================================
   1. Oscillateur harmonique quantique (pq05)
   ===================================================================== */
/* constantes spectroscopiques (fréquence harmonique ωe en cm⁻¹, masses atomiques en u, distance d'équilibre en pm) */
var OH_MOL = {
  H2:{nom:"H₂", a:["H", "#f2f4f8", 1.00783], b:["H", "#f2f4f8", 1.00783], we:4401.2, re:74.1, D0:4.48},
  HCl:{nom:"HCl", a:["H", "#f2f4f8", 1.00783], b:["Cl", "#56c35a", 34.96885], we:2990.9, re:127.5, D0:4.43},
  CO:{nom:"CO", a:["C", "#59616e", 12.0], b:["O", "#e2463a", 15.99491], we:2169.8, re:112.8, D0:11.1},
  I2:{nom:"I₂", a:["I", "#9b5fd0", 126.90447], b:["I", "#9b5fd0", 126.90447], we:214.5, re:266.6, D0:1.54}
};
var HC_EVCM = HC_EVNM * 1e-7;   /* eV·cm : ħω (eV) = ωe (cm⁻¹) × hc */
function ohParams(key){
  var M = OH_MOL[key], ma = M.a[2], mb = M.b[2], mu = ma * mb / (ma + mb);
  var hw = M.we * HC_EVCM;                                   /* eV */
  var x0 = HB / Math.sqrt(mu * UMA * hw * QE) * 1e12;        /* pm : x₀ = √(ħ/μω) */
  return {M:M, mu:mu, hw:hw, x0:x0, lamUm:1e4 / M.we};
}
/* ψₙ(ξ) normalisée (ξ = x/x₀), récurrence stable */
function ohPsi(n, xi){
  var p0 = Math.pow(PI, -0.25) * Math.exp(-xi * xi / 2);
  if (n === 0) return p0;
  var p1 = Math.SQRT2 * xi * p0;
  for (var k = 2; k <= n; k++){ var p2 = Math.sqrt(2 / k) * xi * p1 - Math.sqrt((k - 1) / k) * p0; p0 = p1; p1 = p2; }
  return p1;
}
/* probabilité hors de la zone classique |ξ| > √(2n+1) */
function ohOutside(n){
  var A = Math.sqrt(2 * n + 1), X = A + 9, N = 4000, h = (X - A) / N, s = 0;
  for (var i = 0; i <= N; i++){ var x = A + i * h, p = ohPsi(n, x); s += (i === 0 || i === N ? 0.5 : 1) * p * p; }
  return 2 * s * h;
}

SFA.sim({
  id:"pq-oscillateur-quantique", ch:"pq05", tag:"Oscillateur harmonique",
  titre:"Oscillateur harmonique quantique : niveaux équidistants et point zéro",
  resume:"Une molécule-ressort vibre au-dessus de la parabole ½μω²x² : niveaux (n + ½)ħω, densités |ψₙ|² et points de rebroussement.",
  but:"Choisis une molécule et le niveau n (curseur ou clic sur un niveau). Compare la densité quantique |ψₙ|² aux positions mesurées et à la probabilité du ressort classique. Glisse sur la molécule pour la faire tourner.",
  aRetenir:"Les niveaux sont équidistants, Eₙ = (n + ½)ħω, et le plus bas vaut ½ħω, pas zéro.",
  piege:"La particule a une probabilité non nulle d'être au-delà des points de rebroussement, là où un ressort classique ne va jamais.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 430 : 440), g = k.canvas(phone ? 220 : 220);
    var molS = k.select("Molécule", Object.keys(OH_MOL).map(function(m){ return [m, OH_MOL[m].nom + " (ωₑ = " + q4N(OH_MOL[m].we, 1) + " cm⁻¹)"]; }), "HCl", function(){ reset(); });
    var nS = k.slider("Niveau de vibration n", 0, 20, 1, 0, "", function(){ reset(); });
    var mT = k.toggle("Mesures de position (points tirés selon |ψₙ|²)", true, function(){ reset(); });
    var ro = k.readouts(["Énergie Eₙ = (n + ½)ħω", "Écart entre niveaux ħω", "Amplitude classique Aₙ", "Probabilité hors zone classique"]);
    var nt = k.note("", "ok");
    var NB = 48, hist = new Float64Array(NB), nMes = 0, flashes = [], acc = 0, tt = 0, zoom = null, levels = [];
    var cdf = null, cdfN = -1;
    function reset(){ hist = new Float64Array(NB); nMes = 0; flashes = []; cdfN = -1; }
    /* table de répartition de |ψₙ|² pour tirer des positions */
    function buildCdf(n){
      var X = Math.sqrt(2 * n + 1) + 4.5, N = 900, a = [], s = 0;
      for (var i = 0; i <= N; i++){ var x = -X + 2 * X * i / N, p = ohPsi(n, x); s += p * p; a.push(s); }
      cdf = {X:X, N:N, a:a.map(function(v){ return v / s; })}; cdfN = n;
    }
    function sample(n){
      if (cdfN !== n) buildCdf(n);
      var u = Math.random(), lo = 0, hi = cdf.N;
      while (hi - lo > 1){ var mid = (lo + hi) >> 1; if (cdf.a[mid] < u) lo = mid; else hi = mid; }
      return -cdf.X + 2 * cdf.X * (hi - 0.5 + Math.random() - 0.5) / cdf.N;
    }
    /* vue 3D de la molécule */
    var v = new Q4V(); v.a = 0.35; v.b = 0.32; v.f = 9; v.set();
    var drag = null;
    c.cv.style.touchAction = "none";
    c.pointer(function(type, p){
      if (type === "down"){
        var hit = null; levels.forEach(function(L){ if (Math.abs(p.y - L.y) < Math.max(6, L.dy * 0.45) && p.x > L.x0 - 10 && p.x < L.x1 + 10) hit = L; });
        if (hit && p.y > c.H * 0.3){ nS.set(hit.n); reset(); k.redraw(); drag = null; return; }
        drag = {x:p.x, y:p.y};
      }
      if (type === "drag" && drag){ v.a += (p.x - drag.x) * 0.01; v.b = q4clamp(v.b + (p.y - drag.y) * 0.01, -0.9, 1.2); v.set(); v.user = true; drag = {x:p.x, y:p.y}; }
      if (type === "move"){ var on = levels.some(function(L){ return Math.abs(p.y - L.y) < Math.max(6, L.dy * 0.45) && p.x > L.x0 - 10 && p.x < L.x1 + 10; }); c.cv.style.cursor = on && p.y > c.H * 0.3 ? "pointer" : "grab"; }
      if (type === "up") drag = null;
    });
    var lp = k.loop(function(dt){
      tt += dt;
      if (!v.user){ v.a = 0.35 + 0.35 * Math.sin(tt * 0.3); v.set(); }
      var n = nS.value;
      if (mT.value){
        acc += dt * 9;
        while (acc >= 1){
          acc -= 1; var xi = sample(n); flashes.push({xi:xi, age:0});
          var Xh = Math.sqrt(2 * n + 1) + 3, b = Math.floor((xi + Xh) / (2 * Xh) * NB);
          if (b >= 0 && b < NB) hist[b]++; nMes++;
        }
      }
      for (var i = flashes.length - 1; i >= 0; i--){ flashes[i].age += dt; if (flashes[i].age > 0.9) flashes.splice(i, 1); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, P = ohParams(molS.value), n = nS.value, i, j;
      var An = Math.sqrt(2 * n + 1);                     /* amplitude classique en unités de x₀ */
      var ph = tt * 2.2, xcl = An * Math.cos(ph);         /* mouvement classique à l'énergie Eₙ (ralenti) */
      q4lab(ctx, W, H, "#1b2540", "#080d18");
      /* ---- bandeau du haut : la molécule ---- */
      var topH = H * 0.3;
      ctx.save(); var gt = ctx.createLinearGradient(0, 0, 0, topH); gt.addColorStop(0, "rgba(40,60,100,.35)"); gt.addColorStop(1, "rgba(40,60,100,0)");
      ctx.fillStyle = gt; ctx.fillRect(0, 0, W, topH); ctx.restore();
      var M = P.M, ma = M.a[2], mb = M.b[2], re = M.re, sca = M.re > 200 ? 1 / 75 : 1 / 50;   /* 50 pm par unité de scène (75 pour I₂) */
      /* échelle : l'atome le plus éloigné du centre de masse (à l'élongation maximale) reste dans le cadre */
      v.sc = Math.min(W / 5.2, topH / 2.1, (W / 2 - 12) / (1.35 * ((M.re + Math.sqrt(2 * n + 1) * P.x0) * sca * Math.max(ma, mb) / (ma + mb) + 0.6))); v.cx = W * 0.5; v.cy = topH * 0.55; v.clear();
      var dx = xcl * P.x0, L = (re + dx) * sca, xa = -L * mb / (ma + mb), xb = L * ma / (ma + mb);
      var ra = M.a[0] === "H" ? 0.33 : 0.52, rb = M.b[0] === "H" ? 0.33 : 0.52;
      if (M.a[0] === "I"){ ra = rb = 0.6; }
      /* ressort : hélice entre les deux atomes */
      var x0s = xa + ra * 0.8, x1s = xb - rb * 0.8, nt2 = 9, seg = 90, prev = null;
      for (i = 0; i <= seg; i++){
        var u = i / seg, X = x0s + (x1s - x0s) * u, th = u * nt2 * TAU, Y = 0.13 * Math.sin(th), Z = 0.13 * Math.cos(th);
        if (prev){ (function(p0, p1, zz){ v.sprite((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2, function(cx2){
          var A = v.p(p0[0], p0[1], p0[2]), B = v.p(p1[0], p1[1], p1[2]);
          cx2.save(); cx2.strokeStyle = zz > 0 ? "#e8edf5" : "#8f9bb0"; cx2.lineWidth = 2.6; cx2.lineCap = "round"; cx2.beginPath(); cx2.moveTo(A.x, A.y); cx2.lineTo(B.x, B.y); cx2.stroke(); cx2.restore();
        }); })(prev, [X, Y, Z], Z); }
        prev = [X, Y, Z];
      }
      q4sphere(v, xa, 0, 0, ra, M.a[1]); q4sphere(v, xb, 0, 0, rb, M.b[1]);
      v.render(ctx);
      var pa = v.p(xa, 0, 0), pb = v.p(xb, 0, 0);
      q4T(S, c, M.a[0], pa.x, pa.y, {size:q4fz(c, 12), color:M.a[0] === "H" ? "#22324a" : "#fff"});
      q4T(S, c, M.b[0], pb.x, pb.y, {size:q4fz(c, 12), color:M.b[0] === "H" ? "#22324a" : "#fff"});
      q4tag(S, c, M.nom + " : la liaison vibre (image classique à l'énergie Eₙ)", 8, 16, {size:10.5, align:"left", weight:700});
      q4T(S, c, "glisse pour tourner", W - 8, topH - 10, {size:q4fz(c, 10.5), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      /* ---- puits parabolique ---- */
      var nView = Math.max(4, n + 2), Xr = Math.sqrt(2 * nView + 1) * 1.08 + 0.6;
      if (!zoom) zoom = Xr; zoom += (Xr - zoom) * 0.12; if (Math.abs(zoom - Xr) < 1e-3) zoom = Xr;
      var gx0 = phone ? 40 : 54, gx1 = W - (phone ? 14 : 20), gy0 = topH + 14, gy1 = H - 30;
      var Emax = 0.5 * zoom * zoom, Xs = function(xi){ return (gx0 + gx1) / 2 + xi / zoom * (gx1 - gx0) / 2; };
      var Ys = function(e){ return gy1 - e / Emax * (gy1 - gy0); };
      /* paroi parabolique en volume */
      ctx.save(); ctx.beginPath();
      for (i = 0; i <= 120; i++){ var xx = -zoom + 2 * zoom * i / 120, yy = Ys(0.5 * xx * xx); if (i) ctx.lineTo(Xs(xx), yy); else ctx.moveTo(Xs(xx), yy); }
      ctx.lineTo(gx1, gy0 - 4); ctx.lineTo(gx1 + 12, gy0 - 4); ctx.lineTo(gx1 + 12, gy1 + 10); ctx.lineTo(gx0 - 12, gy1 + 10); ctx.lineTo(gx0 - 12, gy0 - 4); ctx.lineTo(gx0, gy0 - 4); ctx.closePath();
      var gw = ctx.createLinearGradient(0, gy0, 0, gy1); gw.addColorStop(0, "rgba(70,110,180,.0)"); gw.addColorStop(1, "rgba(70,110,180,.28)");
      ctx.fillStyle = gw; ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath();
      for (i = 0; i <= 120; i++){ xx = -zoom + 2 * zoom * i / 120; yy = Ys(0.5 * xx * xx); if (i) ctx.lineTo(Xs(xx), yy); else ctx.moveTo(Xs(xx), yy); }
      ctx.lineWidth = 7; ctx.strokeStyle = "rgba(20,40,80,.9)"; ctx.stroke(); ctx.lineWidth = 3.2; ctx.strokeStyle = "#7fa8e8"; ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.translate(0, -1.6); ctx.stroke(); ctx.restore();
      /* axe des énergies */
      ctx.save(); ctx.strokeStyle = "rgba(200,215,240,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0 - 14, gy1); ctx.lineTo(gx0 - 14, gy0); ctx.stroke(); ctx.restore();
      q4T(S, c, "E", gx0 - 14, gy0 - 6, {size:q4fz(c, 11), color:"#c9d6ee"});
      /* niveaux et densités */
      levels = []; var dyL = (Ys(0) - Ys(1));
      for (j = 0; j <= nView + 1; j++){
        var E = j + 0.5; if (E > Emax * 0.97) break;
        var Y0 = Ys(E), Aj = Math.sqrt(2 * j + 1), on = j === n;
        var xl = Xs(-Aj), xr = Xs(Aj);
        levels.push({n:j, y:Y0, x0:xl, x1:xr, dy:dyL});
        /* densité |ψ|² posée sur le niveau */
        var amp = dyL * (on ? 0.95 : 0.7), pk = 0, Xd = Math.min(zoom, Aj + 3.2), pts = [];
        for (i = 0; i <= 160; i++){ var x2 = -Xd + 2 * Xd * i / 160, ps = ohPsi(j, x2); pts.push([x2, ps * ps]); pk = Math.max(pk, ps * ps); }
        ctx.save(); ctx.beginPath(); ctx.moveTo(Xs(-Xd), Y0);
        pts.forEach(function(q){ ctx.lineTo(Xs(q[0]), Y0 - q[1] / pk * amp); }); ctx.lineTo(Xs(Xd), Y0); ctx.closePath();
        var gd = ctx.createLinearGradient(0, Y0 - amp, 0, Y0); gd.addColorStop(0, on ? "rgba(255,196,70,.85)" : "rgba(120,190,255,.35)"); gd.addColorStop(1, on ? "rgba(255,150,40,.25)" : "rgba(120,190,255,.08)");
        ctx.fillStyle = gd; ctx.fill(); ctx.lineWidth = on ? 1.8 : 1; ctx.strokeStyle = on ? "#ffd27a" : "rgba(150,200,255,.55)"; ctx.stroke(); ctx.restore();
        /* trait du niveau entre les points de rebroussement, prolongé en pointillé */
        S.draw.line(c, Xs(-Xd), Y0, xl, Y0, on ? "rgba(255,210,120,.6)" : "rgba(170,195,235,.3)", 1, [3, 3]);
        S.draw.line(c, xr, Y0, Xs(Xd), Y0, on ? "rgba(255,210,120,.6)" : "rgba(170,195,235,.3)", 1, [3, 3]);
        S.draw.line(c, xl, Y0, xr, Y0, on ? "#ffcf5c" : "rgba(190,210,245,.75)", on ? 2.4 : 1.3);
        if (on){ S.draw.dot(c, xl, Y0, 3.5, "#ff7a45"); S.draw.dot(c, xr, Y0, 3.5, "#ff7a45"); }
        var kk = Math.max(1, Math.ceil(15 / dyL)), showL = on || (j % kk === 0 && Math.abs(j - n) * dyL >= 13);
        var lab = phone || kk > 1 ? String(j) : "n = " + j;
        if (showL) q4T(S, c, lab, gx0 - 20, Y0, {size:q4fz(c, on ? 11.5 : 10.5), color:on ? "#ffd27a" : "#9fb2d4", align:"right", weight:on ? 800 : 600});
      }
      /* bille classique sur la parabole */
      var bx = Xs(xcl), by = Ys(0.5 * xcl * xcl);
      q4glow(ctx, bx, by - 7, 18, "#ffb04d", 0.3); q4ball(ctx, bx, by - 7, 7, "#ff9b3d");
      /* points de mesure */
      flashes.forEach(function(f){
        var Xf = Xs(f.xi), Yf = Ys(n + 0.5), a = 1 - f.age / 0.9;
        if (Xf < gx0 - 4 || Xf > gx1 + 4) return;
        q4glow(ctx, Xf, Yf, 12, "#7dffb0", 0.55 * a); q4ball(ctx, Xf, Yf, 2.6, "#7dffb0", a);
      });
      /* demi-quantum du point zéro */
      var y0z = Ys(0.5);
      ctx.save(); ctx.strokeStyle = "#ff8f6b"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(gx1 - 4, gy1); ctx.lineTo(gx1 - 4, y0z); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx1 - 8, gy1); ctx.lineTo(gx1, gy1); ctx.moveTo(gx1 - 8, y0z); ctx.lineTo(gx1, y0z); ctx.stroke(); ctx.restore();
      q4T(S, c, "½ħω", gx1 - 10, gy1 - y0z < 18 ? y0z - 9 : (gy1 + y0z) / 2, {size:q4fz(c, 11), color:"#ff9f80", align:"right", halo:"#0d1424"});
      q4T(S, c, "x", gx1, gy1 + 14, {size:q4fz(c, 11), color:"#c9d6ee", align:"right"});
      q4T(S, c, "0", Xs(0), gy1 + 14, {size:q4fz(c, 10.5), color:"#9fb2d4"});
      q4T(S, c, "−Aₙ", Xs(-An), gy1 + 14, {size:q4fz(c, 10.5), color:"#ff9f80"});
      q4T(S, c, "+Aₙ", Xs(An), gy1 + 14, {size:q4fz(c, 10.5), color:"#ff9f80"});
      S.draw.line(c, Xs(-An), Ys(n + 0.5), Xs(-An), gy1, "rgba(255,140,100,.45)", 1, [2, 3]);
      S.draw.line(c, Xs(An), Ys(n + 0.5), Xs(An), gy1, "rgba(255,140,100,.45)", 1, [2, 3]);
      q4tag(S, c, phone ? "clique un niveau" : "clique sur un niveau pour le choisir", W - 8, topH + 14, {size:10.5, align:"right", weight:700, color:"#cfe0ff"});

      /* ---- graphe : densité quantique, ressort classique, mesures ---- */
      g.clear();
      var Xh = An + 3, pmax = 0;
      for (i = 0; i <= 300; i++){ var xq = -Xh + 2 * Xh * i / 300, pq = ohPsi(n, xq); pmax = Math.max(pmax, pq * pq); }
      var hmax = 0; for (i = 0; i < NB; i++) hmax = Math.max(hmax, hist[i]);
      var bwx = 2 * Xh / NB, ymax = Math.max(pmax, 1 / (PI * An) * 2.2) * 1.25;
      var xu = Xh * P.x0, ax = S.draw.axes(g, {x0:-xu, x1:xu, y0:0, y1:ymax / P.x0, l:phone ? 38 : 46, r:12, t:38, b:32, xl:"x (pm)", stepY:q4step(ymax / P.x0, 3)});
      var gx = g.ctx;
      /* zones interdites classiquement */
      gx.save(); gx.fillStyle = "rgba(220,70,50,.08)"; gx.fillRect(ax.L, ax.T, ax.X(-An * P.x0) - ax.L, ax.B - ax.T); gx.fillRect(ax.X(An * P.x0), ax.T, ax.R - ax.X(An * P.x0), ax.B - ax.T); gx.restore();
      /* histogramme des mesures */
      if (nMes > 0){
        for (i = 0; i < NB; i++){
          var hv = hist[i] / (nMes * bwx) / P.x0; if (hv <= 0) continue;
          var xa2 = (-Xh + i * bwx) * P.x0, xb2 = xa2 + bwx * P.x0;
          var ytop = Math.max(ax.T, ax.Y(hv));
          gx.fillStyle = "rgba(46,158,106,.45)"; gx.fillRect(ax.X(xa2) + 0.5, ytop, Math.max(1, ax.X(xb2) - ax.X(xa2) - 1), ax.B - ytop);
        }
      }
      /* probabilité classique 1/(π√(A² − x²)) */
      S.draw.fn(g, ax, function(x){ var s = x / P.x0; return Math.abs(s) < An * 0.999 ? 1 / (PI * Math.sqrt(An * An - s * s)) / P.x0 : NaN; }, "#e0662a", 2, [5, 4]);
      S.draw.fn(g, ax, function(x){ var s = x / P.x0, q = ohPsi(n, s); return q * q / P.x0; }, "#2f6fd6", 2.4);
      S.draw.line(g, ax.X(-An * P.x0), ax.T, ax.X(-An * P.x0), ax.B, "rgba(220,70,50,.7)", 1, [3, 3]);
      S.draw.line(g, ax.X(An * P.x0), ax.T, ax.X(An * P.x0), ax.B, "rgba(220,70,50,.7)", 1, [3, 3]);
      (function(){ var sy = q4step(ymax / P.x0, 3), ys = [], yv;
        for (yv = sy; yv <= ymax / P.x0 * (1 + 1e-9); yv += sy) ys.push(yv);
        var ky = ys.length > 1 ? Math.max(1, Math.ceil(16 / Math.abs(ax.Y(ys[0]) - ax.Y(ys[1])))) : 1;
        ys.forEach(function(yv2, i2){ if ((i2 + 1) % ky) return; q4T(S, g, S.fmt(yv2, 3).replace(/<[^>]+>/g, ""), ax.X(0) - 6, ax.Y(yv2), {size:10.5, color:"#5d6876", align:"right", weight:700, halo:"#ffffff"}); });
      })();
      q4T(S, g, "densité de probabilité (pm⁻¹)", ax.L, 10, {size:q4fz(g, 11), color:"#2c3a4e", align:"left"});
      /* légende sur une ligne, sous le titre */
      var fzl = q4fz(g, 10.5), lx = ax.R, items = [["— |ψₙ|² quantique", "#2f6fd6"], ["- - ressort classique", "#e0662a"]];
      if (nMes > 0) items.push(["■ " + nMes + " mesures", "#2e9e6a"]);
      for (i = items.length - 1; i >= 0; i--){ q4T(S, g, items[i][0], lx, 25, {size:fzl, color:items[i][1], align:"right"}); lx -= q4tw(g, items[i][0], fzl) + 10; }

      /* ---- afficheurs ---- */
      var En = (n + 0.5) * P.hw, out = ohOutside(n);
      ro.set(0, q4N(En, En < 0.1 ? 4 : 3) + " eV");
      ro.set(1, q4N(P.hw, P.hw < 0.1 ? 4 : 3) + " eV");
      ro.set(2, q4N(An * P.x0, 1) + " pm");
      ro.set(3, q4N(out * 100, 1) + " %");
      nt.set("Pour " + M.nom + " : x₀ = √(ħ/μω) = " + q4N(P.x0, 2) + " pm (μ = " + q4N(P.mu, 3) + " u). Passer d'un niveau au suivant demande un photon infrarouge de " + q4N(P.lamUm, 2) + " µm. " +
        (n === 0 ? "Même au niveau le plus bas, la molécule vibre : son énergie vaut ½ħω, jamais zéro." :
          n >= 10 ? "Pour n grand, |ψₙ|² oscille vite et sa moyenne suit la courbe du ressort classique, maximale aux points de rebroussement." :
          "La densité a n nœuds ; la probabilité classique, elle, est maximale aux points de rebroussement.") +
        " Modèle harmonique : pour une vraie molécule, il vaut surtout pour les premiers niveaux." +
        (En > M.D0 + 0.5 * P.hw ? " Attention : à cette énergie, la vraie molécule serait déjà cassée (énergie de dissociation ≈ " + q4N(M.D0, 2) + " eV)." : ""), En > M.D0 + 0.5 * P.hw ? "warn" : "ok");
    });
  }
});

/* =====================================================================
   2. Microscope à effet tunnel (pq05)
   ===================================================================== */
/* surfaces modèles (distances en Å) : maille, barrière φ ≈ travail d'extraction, corrugation apparente */
var STM_SURF = {
  cu:{nom:"Cuivre (100)", court:"Cu(100)", a:2.556, phi:4.59, type:"carre", col:"#d08a52", cor:0.25, ad:"#6fa8ff"},
  au:{nom:"Or (111)", court:"Au(111)", a:2.884, phi:5.31, type:"hex", col:"#e3b94b", cor:0.18, ad:"#6fa8ff"},
  gr:{nom:"Graphite", court:"graphite", a:2.46, phi:4.6, type:"graph", col:"#7d8794", cor:0.6, ad:"#ff8a5c"}
};
var STM_W = 7;              /* demi-côté de la zone balayée (Å) */
var STM_KAPPA1 = Math.sqrt(2 * ME * QE) / HB * 1e-9;   /* κ (nm⁻¹) pour φ = 1 eV : 5,123 */
/* atomes de surface : [x, z, vu] (vu = visible en STM) */
function stmAtoms(key){
  var Sf = STM_SURF[key], a = Sf.a, R = 12.5, L = [], i, j, n = Math.ceil(R / a) + 3;
  for (i = -n; i <= n; i++) for (j = -n; j <= n; j++){
    if (Sf.type === "carre"){ L.push([i * a, j * a, 1]); continue; }
    var x = i * a + j * a / 2, z = j * a * Math.sqrt(3) / 2;
    L.push([x, z, 1]);
    if (Sf.type === "graph") L.push([x + a / 2, z + a / (2 * Math.sqrt(3)), 0]);
  }
  return L.filter(function(p){ return Math.abs(p[0]) <= R && Math.abs(p[1]) <= R; });
}
/* site creux le plus proche de (x, z) */
function stmHollow(key, x, z){
  var Sf = STM_SURF[key], a = Sf.a;
  if (Sf.type === "carre") return [(Math.floor(x / a) + 0.5) * a, (Math.floor(z / a) + 0.5) * a];
  var h = Sf.type === "graph" ? [a, a / Math.sqrt(3)] : [a / 2, a / (2 * Math.sqrt(3))], best = null, bd = 1e9;
  var jj = Math.round(z / (a * Math.sqrt(3) / 2));
  for (var j = jj - 2; j <= jj + 2; j++) for (var i = Math.round(x / a - j / 2) - 2; i <= Math.round(x / a - j / 2) + 2; i++){
    var px = i * a + j * a / 2 + h[0], pz = j * a * Math.sqrt(3) / 2 + h[1];
    if (Sf.type === "graph"){ /* centres d'hexagones : un site sur trois du réseau décalé */ if (((i - j) % 3 + 3) % 3 !== 0) continue; }
    var d = (px - x) * (px - x) + (pz - z) * (pz - z); if (d < bd){ bd = d; best = [px, pz]; }
  }
  return best;
}
/* hauteur apparente de la surface sous la pointe (Å) : bosses gaussiennes des atomes vus + adatome */
function stmHeight(key, atoms, ad, x, z){
  var Sf = STM_SURF[key], s2 = 2 * Math.pow(0.36 * Sf.a, 2), h = 0, i;
  for (i = 0; i < atoms.length; i++){
    var p = atoms[i]; if (!p[2]) continue;
    var dx = p[0] - x, dz = p[1] - z; if (Math.abs(dx) > 5 || Math.abs(dz) > 5) continue;
    h += Sf.cor * Math.exp(-(dx * dx + dz * dz) / s2);
  }
  if (ad){ var ddx = ad[0] - x, ddz = ad[1] - z; h += 1.0 * Math.exp(-(ddx * ddx + ddz * ddz) / (2 * 1.5 * 1.5)); }
  return h;
}
function stmCmap(u){   /* fausses couleurs : brun foncé → orange → jaune pâle */
  u = q4clamp(u, 0, 1);
  var st = [[0, 20, 8, 4], [0.35, 120, 40, 10], [0.65, 225, 120, 30], [0.85, 255, 200, 90], [1, 255, 250, 215]];
  for (var i = 1; i < st.length; i++) if (u <= st[i][0]){ var f = (u - st[i - 1][0]) / (st[i][0] - st[i - 1][0]); return [0, 1, 2].map(function(c){ return Math.round(st[i - 1][c + 1] + f * (st[i][c + 1] - st[i - 1][c + 1])); }); }
  return [255, 250, 215];
}

SFA.sim({
  id:"pq-microscope-tunnel", ch:"pq05", tag:"Effet tunnel",
  titre:"Microscope à effet tunnel : lire une surface atome par atome",
  resume:"Une pointe balaie une surface : le courant tunnel, proportionnel à e^(−2κd), dessine les atomes ligne par ligne.",
  but:"Regarde la pointe balayer la surface et l'image se construire ligne par ligne. Rapproche ou éloigne la pointe, change de surface ou passe en courant constant. Clique sur l'image pour y amener l'atome isolé avec la pointe ; glisse sur la scène pour tourner.",
  aRetenir:"Le courant tunnel varie comme e^(−2κd), avec κ = √(2mφ)/ħ : environ un facteur 10 pour 0,1 nm.",
  piege:"La pointe ne touche jamais la surface : il n'y a aucun contact, les électrons traversent le vide par effet tunnel.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 360 : 400), g = k.canvas(phone ? 210 : 230);
    var key = "cu";
    var sfS = k.select("Surface", Object.keys(STM_SURF).map(function(s){ return [s, STM_SURF[s].nom + " (φ ≈ " + q4N(STM_SURF[s].phi, 2) + " eV)"]; }), "cu", function(v){ key = v; atoms = stmAtoms(key); ad = stmHollow(key, 1.5, -1.5); clearImg(); });
    var dS = k.slider("Distance pointe-surface d", 0.4, 1.0, 0.01, 0.6, "nm");
    var mS = k.seg("Mode", [["h", "Hauteur constante"], ["i", "Courant constant"]], "h", function(){ clearImg(); });
    k.button("Nouvelle image", function(){ clearImg(); });
    var ro = k.readouts(["Courant I (surface plane)", "κ = √(2mφ)/ħ", "Si d baisse de 0,1 nm", "Probabilité de traversée e^(−2κd)"]);
    var nt = k.note("", "ok");
    var atoms = stmAtoms(key), ad = stmHollow(key, 1.5, -1.5);
    var NP = phone ? 44 : 56, img = new Float32Array(NP * NP), done = new Uint8Array(NP * NP), row = 0, col = 0, frac = 0;
    var off = document.createElement("canvas"); off.width = NP; off.height = NP;
    var tip = {x:-STM_W, z:-STM_W, y:6}, manip = null, tt = 0, sparks = [], IMG = null;
    function clearImg(){ img = new Float32Array(NP * NP); done = new Uint8Array(NP * NP); row = 0; col = 0; frac = 0; }
    function kap(){ return STM_KAPPA1 * Math.sqrt(STM_SURF[key].phi); }      /* nm⁻¹ */
    /* courant (nA) pour un écart pointe-surface réel gap (Å) : modèle I = 1 nA à 0,6 nm */
    function cur(gap){ return Math.exp(-2 * kap() * (gap / 10 - 0.6)); }
    function px2pos(i){ return -STM_W + (i + 0.5) / NP * 2 * STM_W; }
    var v = new Q4V(); v.a = 0.55; v.b = 0.5; v.f = 90; v.set();
    var drag = null;
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(type, p){
      if (type === "down") drag = {x:p.x, y:p.y};
      if (type === "drag" && drag){ v.a += (p.x - drag.x) * 0.01; v.b = q4clamp(v.b + (p.y - drag.y) * 0.01, 0.12, 1.3); v.set(); v.user = true; drag = {x:p.x, y:p.y}; }
      if (type === "up") drag = null;
    });
    g.cv.style.touchAction = "none";
    g.pointer(function(type, p){
      if (!IMG) return;
      var inn = p.x >= IMG.x && p.x <= IMG.x + IMG.s && p.y >= IMG.y && p.y <= IMG.y + IMG.s;
      if (type === "move") g.cv.style.cursor = inn ? "crosshair" : "default";
      if (type === "down" && inn && !manip){
        var X = -STM_W + (p.x - IMG.x) / IMG.s * 2 * STM_W, Z = -STM_W + (p.y - IMG.y) / IMG.s * 2 * STM_W;
        var to = stmHollow(key, q4clamp(X, -STM_W + 1, STM_W - 1), q4clamp(Z, -STM_W + 1, STM_W - 1));
        manip = {ph:0, t:0, from:[tip.x, tip.z, tip.y], to:to};
        k.redraw();
      }
    });
    var lp = k.loop(function(dt){
      tt += dt;
      if (!v.user){ v.a = 0.55 + 0.25 * Math.sin(tt * 0.18); v.set(); }
      var d = dS.value * 10, mode = mS.value;
      if (manip){
        /* 0 : aller au-dessus de l'atome ; 1 : descendre ; 2 : traîner l'atome ; 3 : remonter */
        manip.t += dt / 0.7; var u = Math.min(1, manip.t), e = u * u * (3 - 2 * u);
        if (manip.ph === 0){ tip.x = manip.from[0] + (ad[0] - manip.from[0]) * e; tip.z = manip.from[1] + (ad[1] - manip.from[1]) * e; tip.y = stmHeight(key, atoms, ad, tip.x, tip.z) + d; }
        else if (manip.ph === 1){ tip.y = stmHeight(key, atoms, ad, tip.x, tip.z) + d - (d - 2.2) * e; }
        else if (manip.ph === 2){ if (!manip.a0) manip.a0 = ad.slice(); ad = [manip.a0[0] + (manip.to[0] - manip.a0[0]) * e, manip.a0[1] + (manip.to[1] - manip.a0[1]) * e]; tip.x = ad[0]; tip.z = ad[1]; tip.y = stmHeight(key, atoms, ad, tip.x, tip.z) + 2.2; }
        else { tip.y = stmHeight(key, atoms, ad, tip.x, tip.z) + 2.2 + (d - 2.2) * e; }
        if (u >= 1){ manip.ph++; manip.t = 0; if (manip.ph > 3){ manip = null; clearImg(); } }
      } else {
        /* balayage : une ligne en 0,16 s */
        frac += dt * NP / 0.16;
        while (frac >= 1){
          frac -= 1;
          var X = px2pos(col), Z = px2pos(row), h = stmHeight(key, atoms, ad, X, Z);
          img[row * NP + col] = mode === "h" ? Math.log(cur(d - h)) : h; done[row * NP + col] = 1;
          col++; if (col >= NP){ col = 0; row = (row + 1) % NP; }
        }
        tip.x = px2pos(Math.min(NP - 1, col + frac)); tip.z = px2pos(row);
        var hh = stmHeight(key, atoms, ad, tip.x, tip.z);
        tip.y = mode === "h" ? d : hh + d;
      }
      /* électrons qui traversent le vide : nombre ∝ log du courant */
      var I = cur(tip.y - stmHeight(key, atoms, ad, tip.x, tip.z)), rate = q4clamp(6 + 4 * Math.log10(Math.max(1e-6, I)) * 2, 0, 30);
      if (Math.random() < rate * dt) sparks.push({t:0, o:Math.random() * TAU});
      for (var i = sparks.length - 1; i >= 0; i--){ sparks[i].t += dt * 2.2; if (sparks[i].t >= 1) sparks.splice(i, 1); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Sf = STM_SURF[key], i, d = dS.value * 10, mode = mS.value;
      q4lab(ctx, W, H, "#162238", "#06090f");
      /* enceinte à ultravide suggérée : reflets de hublot */
      ctx.save(); ctx.strokeStyle = "rgba(140,170,220,.10)"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(W / 2, H * 0.52, Math.min(W, H) * 0.62, 0, TAU); ctx.stroke(); ctx.restore();
      v.sc = Math.min(W / 34, H / 29); v.cx = W * 0.5; v.cy = H * 0.7; v.clear();
      /* cristal : rendu à part (une grande face mal triée cacherait les atomes) */
      v.box(-12.8, -6, -12.8, 12.8, -1.2, 12.8, q4shade(Sf.col, -0.35));
      v.render(ctx); v.clear();
      atoms.forEach(function(p){ q4sphere(v, p[0], 0, p[1], Sf.type === "graph" ? 0.72 : 1.18, p[2] ? Sf.col : q4shade(Sf.col, -0.15)); });
      if (Sf.type === "graph"){   /* liaisons du réseau en nid d'abeilles, dans le plan */
        var b1 = [[Sf.a / 2, Sf.a / (2 * Math.sqrt(3))], [-Sf.a / 2, Sf.a / (2 * Math.sqrt(3))], [0, -Sf.a / Math.sqrt(3)]];
        ctx.save(); ctx.strokeStyle = "rgba(170,180,195,.55)"; ctx.lineWidth = 1.2; ctx.beginPath();
        atoms.forEach(function(p){ if (!p[2]) return; b1.forEach(function(o){
          var q = [p[0] + o[0], p[1] + o[1]]; if (Math.abs(q[0]) > 12.5 || Math.abs(q[1]) > 12.5) return;
          var A = v.p(p[0], 0, p[1]), B = v.p(q[0], 0, q[1]); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); }); });
        ctx.stroke(); ctx.restore();
      }
      /* adatome */
      q4sphere(v, ad[0], 1.55, ad[1], 1.25, Sf.ad, {glow:manip && manip.ph === 2 ? "#9cc6ff" : null});
      /* pointe : tube piézoélectrique, support, pointe en tungstène, atome d'apex */
      var ty = tip.y + 1.2;
      v.cyl([tip.x, ty + 8.5, tip.z], [tip.x, ty + 24, tip.z], 3.2, 18, "#e7e3da");
      v.cyl([tip.x, ty + 6.5, tip.z], [tip.x, ty + 8.5, tip.z], 2.2, 14, "#8d96a6");
      v.cyl([tip.x, ty + 6.5, tip.z], [tip.x, ty + 0.8, tip.z], 1.7, 16, "#aab3c2", {r1:0.3});
      q4sphere(v, tip.x, ty, tip.z, 0.9, "#c5ccd8", {dz:2});
      /* canal tunnel */
      var hs = stmHeight(key, atoms, ad, tip.x, tip.z), I = cur(tip.y - hs), lI = Math.log10(Math.max(1e-6, I));
      v.sprite(tip.x, (ty + hs) / 2, tip.z, function(cx2){
        var A = v.p(tip.x, ty - 0.8, tip.z), B = v.p(tip.x, hs + 1.0, tip.z), a = q4clamp(0.25 + 0.15 * lI, 0.05, 0.85);
        cx2.save(); cx2.globalCompositeOperation = "lighter";
        var gr = cx2.createLinearGradient(A.x, A.y, B.x, B.y); gr.addColorStop(0, q4a("#7fd4ff", a)); gr.addColorStop(1, q4a("#7fd4ff", a * 0.5));
        cx2.strokeStyle = gr; cx2.lineWidth = 3 + 3 * a; cx2.lineCap = "round"; cx2.beginPath(); cx2.moveTo(A.x, A.y); cx2.lineTo(B.x, B.y); cx2.stroke();
        sparks.forEach(function(s){ var X = A.x + (B.x - A.x) * s.t + Math.cos(s.o) * 2, Y = A.y + (B.y - A.y) * s.t; q4glow(cx2, X, Y, 6, "#bfe8ff", 0.8); });
        q4glow(cx2, B.x, B.y, 14 * (0.4 + a), "#7fd4ff", a * 0.6);
        cx2.restore();
      }, 1.5);
      v.render(ctx);
      /* zone balayée (cadre pointillé au-dessus des atomes) */
      (function(){ var A = v.p(-STM_W, 1.3, -STM_W), B = v.p(STM_W, 1.3, -STM_W), C = v.p(STM_W, 1.3, STM_W), D = v.p(-STM_W, 1.3, STM_W);
        ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "rgba(255,225,150,.5)"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.lineTo(D.x, D.y); ctx.closePath(); ctx.stroke(); ctx.restore(); })();
      /* étiquettes */
      var pT = v.p(tip.x, ty + 11, tip.z), pA = v.p(ad[0], 2.8, ad[1]);
      q4tag(S, c, "tube piézo", pT.x + 30, pT.y, {size:10.5, align:"left", box:{x0:0, x1:W, y0:26, y1:H}});
      if (!phone || !manip) q4tag(S, c, "atome isolé", pA.x, pA.y - 26, {size:10.5, color:"#bcd7ff"});
      q4tag(S, c, Sf.court + " · zone balayée " + q4N(2 * STM_W / 10, 1) + " nm", 8, H - 16, {size:10.5, align:"left", weight:700});
      q4T(S, c, "glisse pour tourner", W - 10, 14, {size:q4fz(c, 10.5), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      /* afficheur du courant (boîtier) */
      var bw = phone ? 118 : 140, bh = 46, bx = 10, by = 10;
      ctx.save(); var gb = ctx.createLinearGradient(0, by, 0, by + bh); gb.addColorStop(0, "#3a4458"); gb.addColorStop(1, "#1a2030"); ctx.fillStyle = gb; q4rr(ctx, bx, by, bw, bh, 8); ctx.fill();
      ctx.fillStyle = "#08140b"; q4rr(ctx, bx + 6, by + 6, bw - 12, bh - 20, 4); ctx.fill(); ctx.restore();
      var Iv = I;
      q4T(S, c, (Iv >= 0.01 ? q4S(Iv, 3) + " nA" : q4S(Iv * 1000, 3) + " pA"), bx + bw / 2, by + 6 + (bh - 20) / 2 + 1, {size:q4fz(c, 14), color:"#7dff9a", mono:true});
      q4T(S, c, "courant tunnel", bx + bw / 2, by + bh - 7, {size:q4fz(c, 9.5), color:"#c7d3ea", weight:700});
      if (manip) q4tag(S, c, manip.ph < 2 ? "la pointe descend sur l'atome" : manip.ph === 2 ? "la pointe traîne l'atome" : "la pointe remonte", W / 2, 44, {size:11, color:"#ffd34d"});

      /* ---- image et courbe I(d) ---- */
      var gc = g.ctx, GW = g.W, GH = g.H; gc.fillStyle = "#f4f6fa"; gc.fillRect(0, 0, GW, GH);
      var sz = Math.min(GH - 40, GW * 0.46), ix = 10, iy = 24; IMG = {x:ix, y:iy, s:sz};
      q4T(S, g, mode === "h" ? "Image du courant" : "Image de la hauteur", ix, 11, {size:q4fz(g, 12), color:"#13233a", align:"left"});
      /* mise à l'échelle des couleurs sur les points déjà mesurés */
      var lo = 1e9, hi = -1e9; for (i = 0; i < NP * NP; i++) if (done[i]){ lo = Math.min(lo, img[i]); hi = Math.max(hi, img[i]); }
      if (!(hi > lo)) { lo = 0; hi = 1; }
      var oc = off.getContext("2d"), id = oc.createImageData(NP, NP);
      for (i = 0; i < NP * NP; i++){
        var cc = done[i] ? stmCmap(Math.sqrt((img[i] - lo) / (hi - lo))) : [10, 14, 22];
        id.data[4 * i] = cc[0]; id.data[4 * i + 1] = cc[1]; id.data[4 * i + 2] = cc[2]; id.data[4 * i + 3] = 255;
      }
      oc.putImageData(id, 0, 0);
      gc.save(); q4rr(gc, ix, iy, sz, sz, 6); gc.clip(); gc.imageSmoothingEnabled = true; gc.drawImage(off, ix, iy, sz, sz);
      /* ligne en cours */
      if (!manip){ var yr = iy + (row + 0.5) / NP * sz; gc.strokeStyle = "rgba(127,212,255,.9)"; gc.lineWidth = 1.5; gc.beginPath(); gc.moveTo(ix, yr); gc.lineTo(ix + sz, yr); gc.stroke(); }
      /* position de la pointe */
      var tx = ix + (tip.x + STM_W) / (2 * STM_W) * sz, tz = iy + (tip.z + STM_W) / (2 * STM_W) * sz;
      gc.strokeStyle = "#ffffff"; gc.lineWidth = 1.5; gc.beginPath(); gc.arc(tx, tz, 4, 0, TAU); gc.stroke();
      if (manip){ var mx = ix + (manip.to[0] + STM_W) / (2 * STM_W) * sz, mz = iy + (manip.to[1] + STM_W) / (2 * STM_W) * sz; gc.setLineDash([3, 3]); gc.strokeStyle = "#7fd4ff"; gc.beginPath(); gc.arc(mx, mz, 7, 0, TAU); gc.stroke(); }
      gc.restore();
      gc.strokeStyle = "#a3adba"; gc.lineWidth = 1; q4rr(gc, ix + 0.5, iy + 0.5, sz - 1, sz - 1, 6); gc.stroke();
      q4T(S, g, phone ? "clique : déplace l'atome" : "clique pour déplacer l'atome", ix + sz / 2, iy + sz + 10, {size:q4fz(g, 10), color:"#5f6b7a", weight:600});
      /* courbe I(d), échelle logarithmique */
      var L0 = ix + sz + (phone ? 40 : 52), R0 = GW - 10, T0 = 30, B0 = GH - 30, dmin = 0.4, dmax = 1.0, lmin = -4, lmax = 2;
      var X = function(dd){ return L0 + (dd - dmin) / (dmax - dmin) * (R0 - L0); }, Y = function(l){ return B0 - (l - lmin) / (lmax - lmin) * (B0 - T0); };
      q4T(S, g, "I (nA), échelle log", L0 - (phone ? 34 : 44), 11, {size:q4fz(g, 11.5), color:"#13233a", align:"left"});
      gc.save(); gc.strokeStyle = "#eef1f5"; gc.lineWidth = 1;
      for (var l = lmin; l <= lmax; l++){ gc.beginPath(); gc.moveTo(L0, Y(l) + 0.5); gc.lineTo(R0, Y(l) + 0.5); gc.stroke(); }
      gc.strokeStyle = "#a3adba"; gc.beginPath(); gc.moveTo(L0, T0); gc.lineTo(L0, B0); gc.lineTo(R0, B0); gc.stroke(); gc.restore();
      var labs = {"-4":"10⁻⁴", "-3":"10⁻³", "-2":"0,01", "-1":"0,1", "0":"1", "1":"10", "2":"100"};
      for (l = lmin; l <= lmax; l += (phone ? 2 : 1)) q4T(S, g, labs[String(l)], L0 - 5, Y(l), {size:q4fz(g, 10), color:"#7b8694", align:"right", weight:600});
      for (var dd = 0.4; dd <= 1.0001; dd += 0.2) q4T(S, g, q4N(dd, 1), X(dd), B0 + 10, {size:q4fz(g, 10), color:"#7b8694", weight:600});
      q4T(S, g, "d (nm)", R0, B0 + 22, {size:q4fz(g, 11), color:"#2c3a4e", align:"right"});
      gc.save(); gc.beginPath(); gc.rect(L0, T0 - 2, R0 - L0, B0 - T0 + 4); gc.clip();
      gc.strokeStyle = "#2f6fd6"; gc.lineWidth = 2.4; gc.beginPath(); gc.moveTo(X(dmin), Y(Math.log10(cur(dmin * 10)))); gc.lineTo(X(dmax), Y(Math.log10(cur(dmax * 10)))); gc.stroke(); gc.restore();
      var Ic = cur(d), Xc = X(dS.value), Yc = Y(Math.log10(Ic));
      S.draw.line(g, Xc, B0, Xc, Yc, "rgba(224,102,42,.6)", 1, [3, 3]);
      S.draw.dot(g, Xc, Yc, 5, "#e0662a");
      var fac = Math.exp(2 * kap() * 0.1);
      q4T(S, g, phone ? "× " + q4N(fac, 1) + " / 0,1 nm" : "× " + q4N(fac, 1) + " par 0,1 nm en moins", L0 + 6, B0 - 12, {size:q4fz(g, 10.5), color:"#2f6fd6", align:"left", halo:"#ffffff"});

      /* ---- afficheurs ---- */
      ro.set(0, Ic >= 0.01 ? q4S(Ic, 3) + " nA" : q4S(Ic * 1000, 3) + " pA");
      ro.set(1, q4N(kap(), 2) + " nm⁻¹");
      ro.set(2, "I × " + q4N(fac, 1));
      ro.set(3, q4sci(Math.exp(-2 * kap() * dS.value), 2, true));
      nt.set((mode === "h" ? "Hauteur constante : la pointe reste à d au-dessus du plan des atomes ; le courant grimpe à chaque bosse, et l'atome isolé (" + q4N(1, 1) + " Å plus haut) multiplie le courant par " + q4N(Math.exp(2 * kap() * 0.1), 1) + ". " :
        "Courant constant : une boucle de rétroaction monte ou descend la pointe pour garder le courant fixé (" + (cur(d) >= 0.01 ? q4S(cur(d), 3) + " nA" : q4S(cur(d) * 1000, 3) + " pA") + ") ; l'image est la hauteur de la pointe, au centième de nanomètre près. ") +
        "Modèle : I ∝ e^(−2κd) avec I = 1 nA à d = 0,6 nm (valeurs affichées pour une surface plane, au niveau des atomes).", "ok");
    });
  }
});

/* =====================================================================
   3. Harmoniques sphériques et cônes du moment cinétique (pq06)
   ===================================================================== */
/* polynôme de Legendre associé P_l^m(x), m ≥ 0, sans la phase de Condon-Shortley */
function ylP(l, m, x){
  var pmm = 1, s = Math.sqrt(Math.max(0, 1 - x * x)), f = 1, i;
  for (i = 1; i <= m; i++){ pmm *= f * s; f += 2; }
  if (l === m) return pmm;
  var pm1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return pm1;
  var pll = 0;
  for (var ll = m + 2; ll <= l; ll++){ pll = (x * (2 * ll - 1) * pm1 - (ll + m - 1) * pmm) / (ll - m); pmm = pm1; pm1 = pll; }
  return pll;
}
function ylN(l, m){ m = Math.abs(m); return Math.sqrt((2 * l + 1) / (4 * PI) * q4fact(l - m) / q4fact(l + m)); }
/* partie θ de Y_lm (réelle, avec signe), Condon-Shortley inclus : Y_lm = ylTh · e^{imφ} */
function ylTh(l, m, th){ var am = Math.abs(m), v = ylN(l, am) * ylP(l, am, Math.cos(th)); if (m > 0 && am % 2) v = -v; return v; }

SFA.sim({
  id:"pq-moment-cinetique-cones", ch:"pq06", tag:"Moment cinétique",
  titre:"Harmoniques sphériques et cônes du moment cinétique",
  resume:"La sphère déformée par Yₗₘ(θ, φ), et le vecteur L qui précesse sur un cône : seules 2l + 1 hauteurs mħ sont permises.",
  but:"Règle l et m (curseurs, ou clic sur un cercle à droite). À gauche, le rayon vaut |Yₗₘ| et la couleur donne la phase ; à droite, L tourne sur son cône. Glisse sur la scène pour tourner la vue.",
  aRetenir:"|L| = ħ√(l(l + 1)) et sa composante selon z vaut mħ avec m = −l, …, l : L n'est jamais aligné sur l'axe z.",
  piege:"L ne « tourne » pas vraiment : ses composantes selon x et y n'ont pas de valeur nette, le cône représente seulement ce flou.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 600 : 420);
    var lS = k.slider("Nombre quantique orbital l", 0, 4, 1, 2, "", function(){ syncM(); });
    var mS = k.slider("Nombre quantique magnétique m", -2, 2, 1, 1, "");
    var fS = k.seg("Représentation", [["c", "Complexe : |Y| et phase"], ["r", "Réelle (orbitale)"]], "c");
    var ro = k.readouts(["|L| = ħ√(l(l + 1))", "L<sub>z</sub> = mħ", "Angle du cône θ", "Flou ΔL<sub>x</sub> = ΔL<sub>y</sub>"]);
    var nt = k.note("", "ok");
    function syncM(){ var l = lS.value; mS.el.min = -l; mS.el.max = l; mS.set(q4clamp(Math.round(mS.value), -l, l)); }
    syncM();
    var v = new Q4V(); v.a = 0.6; v.b = 0.32; v.f = 9; v.set();
    var w = new Q4V(); w.f = 0;
    var drag = null, tt = 0, CIR = [];
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(type, p){
      if (type === "down"){
        /* clic sur un cercle permis : choisit m */
        var best = null, bd = 14;
        CIR.forEach(function(C){ C.pts.forEach(function(q){ var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd){ bd = d; best = C; } }); });
        if (best){ mS.set(best.m); k.redraw(); drag = null; return; }
        drag = {x:p.x, y:p.y};
      }
      if (type === "drag" && drag){ v.a += (p.x - drag.x) * 0.01; v.b = q4clamp(v.b + (p.y - drag.y) * 0.01, -1.2, 1.35); v.set(); v.user = true; drag = {x:p.x, y:p.y}; }
      if (type === "up") drag = null;
    });
    var lp = k.loop(function(dt){ tt += dt; if (!v.user){ v.a += dt * 0.25; v.set(); } k.redraw(); });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, l = Math.round(lS.value), m = q4clamp(Math.round(mS.value), -l, l), real = fS.value === "r", i, j;
      q4lab(ctx, W, H, "#1a2440", "#070b16");
      /* panneaux */
      var P1, P2;
      if (phone){ P1 = {x:0, y:0, w:W, h:H * 0.5}; P2 = {x:0, y:H * 0.5, w:W, h:H * 0.5}; }
      else { P1 = {x:0, y:0, w:W * 0.53, h:H}; P2 = {x:W * 0.53, y:0, w:W * 0.47, h:H}; }
      [P1, P2].forEach(function(P){ P.x0 = P.x; P.x1 = P.x + P.w; P.y0 = P.y; P.y1 = P.y + P.h; });
      ctx.save(); ctx.strokeStyle = "rgba(160,185,230,.18)"; ctx.lineWidth = 1; ctx.beginPath();
      if (phone){ ctx.moveTo(10, P2.y + 0.5); ctx.lineTo(W - 10, P2.y + 0.5); } else { ctx.moveTo(P2.x + 0.5, 14); ctx.lineTo(P2.x + 0.5, H - 14); }
      ctx.stroke(); ctx.restore();
      /* ---- Y_lm en 3D ---- */
      v.sc = Math.min(P1.w, P1.h) * 0.36; v.cx = P1.x + P1.w / 2; v.cy = P1.y + P1.h * 0.54; v.clear();
      var NT = 26, NPh = 40, R = [], mx = 0, wt = (l * (l + 1)) * 0.6 * tt;   /* phase temporelle e^{−iEt/ħ} (ralentie) */
      for (i = 0; i <= NT; i++){ var th = i / NT * PI; R.push(ylTh(l, m, th)); }
      /* valeur au point (θ_i, φ_j) : rayon et couleur */
      function val(ii, jj){
        var ph = jj / NPh * TAU, t = R[ii], r, col;
        if (real){
          var y = m === 0 ? t : (m > 0 ? Math.SQRT2 * (m % 2 ? -1 : 1) * t * Math.cos(m * ph) : Math.SQRT2 * t * Math.sin(-m * ph));
          r = Math.abs(y); col = y >= 0 ? [235, 92, 70] : [70, 130, 235];
        } else { r = Math.abs(t); col = q4hue(m * ph + (t < 0 ? PI : 0) - wt); }
        return {r:r, col:col};
      }
      var G = [];
      for (i = 0; i <= NT; i++){ G.push([]); for (j = 0; j <= NPh; j++){ var q = val(i, j); G[i].push(q); mx = Math.max(mx, q.r); } }
      mx = mx || 1;
      function pt(ii, jj){ var th = ii / NT * PI, ph = jj / NPh * TAU, r = G[ii][jj].r / mx; return [r * Math.sin(th) * Math.cos(ph), r * Math.cos(th), -r * Math.sin(th) * Math.sin(ph)]; }
      for (i = 0; i < NT; i++) for (j = 0; j < NPh; j++){
        var a = G[i][j].col, b = G[i + 1][j + 1].col;
        var col = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        var hex = "#" + col.map(function(x){ var s2 = Math.round(x).toString(16); return s2.length < 2 ? "0" + s2 : s2; }).join("");
        v.face([pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)], hex, {});
      }
      /* axe z */
      v.sprite(0, 1.25, 0, function(cx2){ var A = v.p(0, -1.2, 0), B = v.p(0, 1.25, 0); S.draw.arrow(c, A.x, A.y, B.x, B.y, "rgba(225,235,250,.85)", 1.6); q4T(S, c, "z", B.x + 9, B.y, {size:q4fz(c, 12), color:"#e6eefc"}); }, 5);
      v.render(ctx);
      q4tag(S, c, real ? "orbitale réelle : rouge +, bleu −" : "Yₗₘ : rayon |Y|, couleur = phase", P1.x + 8, P1.y + 16, {size:10.5, align:"left", weight:700, box:P1});
      /* roue des phases */
      if (!real){
        var wx = P1.x + P1.w - 26, wy = P1.y + P1.h - 26, wr = 14;
        for (i = 0; i < 36; i++){ ctx.fillStyle = q4a(q4hue(i / 36 * TAU), 1); ctx.beginPath(); ctx.moveTo(wx, wy); ctx.arc(wx, wy, wr, -i / 36 * TAU, -(i + 1.05) / 36 * TAU, true); ctx.closePath(); ctx.fill(); }
        q4T(S, c, "phase", wx - wr - 4, wy, {size:q4fz(c, 10), color:"#c9d6ee", align:"right", weight:600});
      }
      /* ---- cônes du moment cinétique ---- */
      w.a = v.a; w.b = Math.max(0.12, v.b); w.set();
      var Lm = Math.sqrt(l * (l + 1)), sc = Math.max(1, Lm);
      w.sc = Math.min(P2.w * 0.42 / sc, (P2.h * 0.53 - 26) / (sc + 0.7), (P2.h * 0.47 - 20) / (sc + 0.5)); w.cx = P2.x + P2.w * 0.5; w.cy = P2.y + P2.h * 0.53; w.clear();
      CIR = [];
      /* sphère |L| (contour) */
      if (l > 0){ ctx.save(); ctx.strokeStyle = "rgba(160,190,240,.16)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(w.cx, w.cy, Lm * w.sc, 0, TAU); ctx.stroke(); ctx.restore(); }
      /* cercles permis (tous les m) */
      function circ(mm, rr){ var pts = []; for (var u = 0; u <= 48; u++){ var ph = u / 48 * TAU; pts.push(w.p(rr * Math.cos(ph), mm, -rr * Math.sin(ph))); } return pts; }
      for (var mm = -l; mm <= l; mm++){
        var rr = Math.sqrt(Math.max(0, l * (l + 1) - mm * mm)), pts = circ(mm, rr), on = mm === m;
        CIR.push({m:mm, pts:pts});
        ctx.save(); ctx.beginPath(); pts.forEach(function(q, u){ if (u) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
        ctx.strokeStyle = on ? "#ffd27a" : "rgba(170,200,255,.38)"; ctx.lineWidth = on ? 2.2 : 1.2; if (!on) ctx.setLineDash([4, 4]); ctx.stroke(); ctx.restore();
      }
      /* cône actif : surface translucide */
      if (l > 0){
        var rr0 = Math.sqrt(l * (l + 1) - m * m), O = w.p(0, 0, 0), pc = circ(m, rr0);
        ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = "#ffcf6a";
        for (i = 0; i < pc.length - 1; i++){ ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(pc[i].x, pc[i].y); ctx.lineTo(pc[i + 1].x, pc[i + 1].y); ctx.closePath(); ctx.fill(); }
        ctx.restore();
      }
      /* axe z gradué en ħ */
      var zA = w.p(0, -sc - 0.5, 0), zB = w.p(0, sc + 0.7, 0);
      S.draw.arrow(c, zA.x, zA.y, zB.x, zB.y, "rgba(225,235,250,.85)", 1.6);
      q4T(S, c, "z", zB.x + 9, zB.y + 2, {size:q4fz(c, 12), color:"#e6eefc"});
      for (mm = -l; mm <= l; mm++){
        var tq = w.p(0, mm, 0), lab = mm === 0 ? "0" : (mm === 1 ? "ħ" : mm === -1 ? "−ħ" : q4N(mm, 0) + "ħ");
        S.draw.line(c, tq.x - 4, tq.y, tq.x + 4, tq.y, "rgba(225,235,250,.85)", 1.4);
        if (l <= 3 || mm % 2 === 0 || mm === m) q4T(S, c, lab, tq.x - 8, tq.y, {size:q4fz(c, 10.5), color:mm === m ? "#ffd27a" : "#9fb2d4", align:"right", weight:mm === m ? 800 : 600, halo:"#0c1222"});
      }
      /* vecteur L qui précesse, avec des « fantômes » (L_x, L_y flous) */
      if (l > 0){
        var rr1 = Math.sqrt(l * (l + 1) - m * m), phi0 = tt * 1.1, O2 = w.p(0, 0, 0);
        for (i = 1; i <= 7; i++){ var pg = phi0 + i / 8 * TAU, Q = w.p(rr1 * Math.cos(pg), m, -rr1 * Math.sin(pg)); S.draw.line(c, O2.x, O2.y, Q.x, Q.y, "rgba(255,210,120,.13)", 2); }
        var Lx = rr1 * Math.cos(phi0), Lz2 = -rr1 * Math.sin(phi0), T = w.p(Lx, m, Lz2), Pz = w.p(0, m, 0);
        S.draw.line(c, T.x, T.y, Pz.x, Pz.y, "rgba(255,210,120,.6)", 1.2, [3, 3]);
        q4glow(ctx, T.x, T.y, 16, "#ffcf6a", 0.4);
        S.draw.arrow(c, O2.x, O2.y, T.x, T.y, "#ffb547", 3.2);
        q4T(S, c, "L", T.x + (T.x > O2.x ? 10 : -10), T.y - 8, {size:q4fz(c, 14), color:"#ffd27a", math:true, italic:true, halo:"#0c1222"});
      } else {
        var O3 = w.p(0, 0, 0); q4glow(ctx, O3.x, O3.y, 14, "#ffcf6a", 0.6);
        q4tag(S, c, "l = 0 : L = 0, pas de cône", P2.x + P2.w / 2, P2.y + P2.h * 0.82, {size:11, color:"#ffd27a", box:P2});
      }
      q4tag(S, c, (2 * l + 1) + " hauteur" + (l ? "s" : "") + " permise" + (l ? "s" : "") + " : mħ", P2.x + 8, P2.y + 16, {size:10.5, align:"left", weight:700, box:P2});
      q4T(S, c, phone ? "glisse : tourner · clic sur un cercle : m" : "clic sur un cercle : choisit m", P2.x + P2.w - 8, P2.y + P2.h - 12, {size:q4fz(c, 10), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      if (!phone) q4T(S, c, "glisse pour tourner", P1.x + 10, P1.y + P1.h - 12, {size:q4fz(c, 10), color:"rgba(210,222,240,.7)", align:"left", weight:600});

      /* ---- afficheurs ---- */
      var th0 = l > 0 ? Math.acos(m / Lm) * 180 / PI : NaN, dL = Math.sqrt(Math.max(0, (l * (l + 1) - m * m) / 2));
      ro.set(0, l > 0 ? q4N(Lm, 3) + " ħ" : "0");
      ro.set(1, m === 0 ? "0" : (m === 1 ? "ħ" : m === -1 ? "−ħ" : q4N(m, 0) + " ħ"));
      ro.set(2, l > 0 ? q4N(th0, 1) + "°" : "—");
      ro.set(3, dL > 0 ? q4N(dL, 3) + " ħ" : "0");
      nt.set(l > 0 ? "|L| = " + q4N(Lm, 3) + " ħ = " + q4sci(Lm * HB, 3, true) + " J·s est plus grand que |m|ħ : même pour m = ±l, le cône garde un angle de " + q4N(Math.acos(l / Lm) * 180 / PI, 1) + "°. Les 2l + 1 = " + (2 * l + 1) + " valeurs de m ont la même énergie pour un potentiel central." +
        (real ? " Les orbitales réelles (p<sub>x</sub>, d<sub>xy</sub>…) mélangent m et −m : leur composante L<sub>z</sub> n'a plus de valeur nette." : " |Yₗₘ| ne dépend pas de φ : la forme est de révolution autour de z, seule la phase e<sup>imφ</sup> fait |m| tours autour de z.")
        : "l = 0 : Y₀₀ est une constante (sphère), le moment cinétique est nul.", "ok");
    });
  }
});

/* =====================================================================
   4. Du Kepler classique au potentiel effectif quantique (pq06)
   ===================================================================== */
/* unités atomiques : r en a₀, E en hartree (27,211 eV), L en ħ ; V(r) = −1/r (électron et proton) */
function peVeff(r, L2){ return -1 / r + L2 / (2 * r * r); }
/* points de rebroussement : E r² + r − L²/2 = 0 */
function peTurn(E, L2){
  if (Math.abs(E) < 1e-9) return [L2 / 2, Infinity];
  var D = 1 + 2 * E * L2; if (D < 0) D = 0;
  var r1 = (-1 + Math.sqrt(D)) / (2 * E), r2 = (-1 - Math.sqrt(D)) / (2 * E);
  if (E > 0) return [Math.max(r1, r2), Infinity];
  return [Math.min(r1, r2), Math.max(r1, r2)];
}
/* fonction radiale u_nl(r) = r R_nl(r) de l'hydrogène (normalisée, r en a₀) */
function peU(n, l, r){
  var x = 2 * r / n, a = 2 * l + 1, kk = n - l - 1, L0 = 1, L1 = 1 + a - x, Lk = kk === 0 ? 1 : L1;
  for (var j = 1; j < kk; j++){ var L2 = ((2 * j + 1 + a - x) * L1 - (j + a) * L0) / (j + 1); L0 = L1; L1 = L2; Lk = L2; }
  var N = Math.sqrt(Math.pow(2 / n, 3) * q4fact(n - l - 1) / (2 * n * q4fact(n + l)));
  return r * N * Math.exp(-r / n) * Math.pow(x, l) * Lk;
}

SFA.sim({
  id:"pq-potentiel-effectif-orbites", ch:"pq06", tag:"Potentiel central",
  titre:"Du Kepler classique au potentiel effectif quantique",
  resume:"Une particule attirée par un centre décrit une ellipse ou une hyperbole ; en dessous, elle oscille dans le puits du potentiel effectif. En mode quantique, les niveaux Eₙₗ et les fonctions uₙₗ(r) apparaissent dans le même puits.",
  but:"Attrape la flèche de vitesse de l'électron et lance-le : l'énergie et le moment cinétique changent, l'orbite aussi. En bas, la bille oscille entre r₁ et r₂ dans le puits du potentiel effectif. Passe en mode quantique pour voir les niveaux permis et les fonctions radiales.",
  aRetenir:"Le potentiel effectif −ke²/r + L²/(2mr²) contient une barrière centrifuge qui repousse la particule du centre, sauf pour l = 0.",
  piege:"En quantique, L² vaut l(l + 1)ħ², pas l²ħ², et l'énergie de l'hydrogène ne dépend que de n.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 340), g = k.canvas(phone ? 250 : 250);
    var modeS = k.seg("Mode", [["c", "Classique"], ["q", "Quantique"]], "c", function(){ showCtl(); relaunch(); }), modeBox = k.ctrl.lastElementChild;
    var eS = k.slider("Énergie E", -12, 4, 0.1, -4, "eV", function(){ fixE(); relaunch(); });
    var LS = k.slider("Moment cinétique L", 0.6, 3, 0.05, 1.2, "ħ", function(){ fixE(); relaunch(); });
    var lS = k.seg("Nombre quantique l", [["0", "l = 0 (s)"], ["1", "l = 1 (p)"], ["2", "l = 2 (d)"]], "1", function(){ syncN(); cloud = []; }), lBox = k.ctrl.lastElementChild;
    var nS = k.slider("Nombre quantique principal n", 1, 6, 1, 2, "", function(){ syncN(); cloud = []; });
    var ro = k.readouts(["Énergie", "Moment cinétique", "Excentricité e", "Orbite"]);
    var nt = k.note("", "ok");
    var smalls = ro.el.querySelectorAll("small");
    function showCtl(){
      var q = modeS.value === "q";
      eS.el.parentNode.style.display = q ? "none" : ""; LS.el.parentNode.style.display = q ? "none" : "";
      lBox.style.display = q ? "" : "none"; nS.el.parentNode.style.display = q ? "" : "none";
    }
    function syncN(){ var l = +lS.value; nS.el.min = l + 1; nS.set(Math.max(l + 1, Math.round(nS.value))); }
    function Emin(){ return -1 / (2 * LS.value * LS.value) * HAEV; }
    function fixE(){ if (eS.value < Emin()) eS.set(Math.ceil(Emin() * 10 - 1e-9) / 10); }
    fixE(); showCtl(); syncN();
    var st = {x:1, y:0, vx:0, vy:1}, wAng = 0.4, trail = [], Rv = null, tt = 0, cloud = [], accC = 0;
    function orbitOf(E, L){ var Eh = E / HAEV, L2 = L * L, e = Math.sqrt(Math.max(0, 1 + 2 * Eh * L2)); return {Eh:Eh, L:L, L2:L2, e:e, p:L2, tp:peTurn(Eh, L2)}; }
    function cur(){ return modeS.value === "q" ? orbitOf(-RYEV / (nS.value * nS.value), Math.max(0.6, Math.sqrt(+lS.value * (+lS.value + 1)))) : orbitOf(eS.value, LS.value); }
    function relaunch(){
      var O = cur(), rp = O.tp[0];
      st = {x:rp * Math.cos(wAng), y:rp * Math.sin(wAng), vx:-O.L / rp * Math.sin(wAng), vy:O.L / rp * Math.cos(wAng)}; trail = [];
    }
    relaunch();
    function acc(x, y){ var r = Math.hypot(x, y), r3 = r * r * r; return [-x / r3, -y / r3]; }
    function rk4(h){
      var s0 = st, a0 = acc(s0.x, s0.y);
      var k1 = [s0.vx, s0.vy, a0[0], a0[1]];
      var a1 = acc(s0.x + h / 2 * k1[0], s0.y + h / 2 * k1[1]), k2 = [s0.vx + h / 2 * k1[2], s0.vy + h / 2 * k1[3], a1[0], a1[1]];
      var a2 = acc(s0.x + h / 2 * k2[0], s0.y + h / 2 * k2[1]), k3 = [s0.vx + h / 2 * k2[2], s0.vy + h / 2 * k2[3], a2[0], a2[1]];
      var a3 = acc(s0.x + h * k3[0], s0.y + h * k3[1]), k4 = [s0.vx + h * k3[2], s0.vy + h * k3[3], a3[0], a3[1]];
      st = {x:s0.x + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), y:s0.y + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
            vx:s0.vx + h / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]), vy:s0.vy + h / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3])};
    }
    /* vue 3D du plan de l'orbite (orthographique, pour pouvoir viser le plan à la souris) */
    var v = new Q4V(); v.a = 0.25; v.b = 0.95; v.f = 0; v.set();
    var VS = 1, drag = null;
    /* longueur de la flèche de vitesse (a₀ par unité atomique de vitesse) : la vitesse circulaire à Rv/2 donne 0,2 Rv */
    function vk(){ var R = Rv || 6; return 0.2 * R / Math.sqrt(2 / R); }
    c.cv.style.touchAction = "none";
    function tipPos(){ var sc = vk(); return {x:st.x + st.vx * VS * sc, y:st.y + st.vy * VS * sc}; }
    function scr(x, y){ return v.p(x, 0, -y); }
    c.pointer(function(type, p){
      var q = modeS.value === "q";
      if (type === "down"){
        var T = tipPos(), Ts = scr(T.x, T.y), Ps = scr(st.x, st.y);
        if (!q && (Math.hypot(p.x - Ts.x, p.y - Ts.y) < 22 || Math.hypot(p.x - Ps.x, p.y - Ps.y) < 16)){ drag = {v:true}; }
        else drag = {x:p.x, y:p.y};
      }
      if (type === "drag" && drag){
        if (drag.v){
          var w0 = v.unplane(p.x, p.y), sc = vk(), vx = (w0[0] - st.x) / (VS * sc), vy = (-w0[1] - st.y) / (VS * sc);
          var r = Math.hypot(st.x, st.y), E = (vx * vx + vy * vy) / 2 - 1 / r, L = st.x * vy - st.y * vx, aL = q4clamp(Math.abs(L), 0.6, 3);
          var Ee = q4clamp(E * HAEV, -12, 4);
          if (Math.abs(aL - Math.abs(L)) > 1e-9 || Math.abs(Ee - E * HAEV) > 1e-9 || Ee < -1 / (2 * aL * aL) * HAEV){
            /* hors des bornes : on garde la direction et on ajuste |v| pour rester dans le domaine permis */
            LS.set(Math.round(aL / 0.05) * 0.05); eS.set(Math.round(Ee * 10) / 10); fixE();
            var O = cur(), vv = Math.sqrt(2 * (O.Eh + 1 / r)), vt = O.L / r, vr2 = Math.max(0, vv * vv - vt * vt), sg = L >= 0 ? 1 : -1;
            var rx = st.x / r, ry = st.y / r, rad = (vx * rx + vy * ry) >= 0 ? 1 : -1;
            vx = rx * rad * Math.sqrt(vr2) - ry * vt * sg; vy = ry * rad * Math.sqrt(vr2) + rx * vt * sg;
          } else { LS.set(Math.round(aL / 0.05) * 0.05); eS.set(Math.round(Ee * 10) / 10); }
          st.vx = vx; st.vy = vy; trail = []; drag.moved = true;
          /* direction du péricentre (vecteur excentricité) pour les relances */
          var h = st.x * st.vy - st.y * st.vx, ex = st.vy * h - st.x / r, ey = -st.vx * h - st.y / r;
          if (Math.hypot(ex, ey) > 1e-6) wAng = Math.atan2(ey, ex);
        } else { v.a += (p.x - drag.x) * 0.01; v.b = q4clamp(v.b + (p.y - drag.y) * 0.01, 0.35, 1.5); v.set(); drag.x = p.x; drag.y = p.y; }
        k.redraw();
      }
      if (type === "move" && !q){ var T2 = scr(tipPos().x, tipPos().y); c.cv.style.cursor = Math.hypot(p.x - T2.x, p.y - T2.y) < 22 ? "grab" : "move"; }
      if (type === "up") drag = null;
    });
    var lp = k.loop(function(dt){
      tt += dt;
      var O = cur(), q = modeS.value === "q";
      if (!(drag && drag.v)){
        var r0 = Math.hypot(st.x, st.y), speed;
        if (O.Eh < 0){ var a = -1 / (2 * O.Eh); speed = TAU * Math.pow(a, 1.5) / 5; }
        else speed = 0.6 * (Rv || 10) / Math.sqrt(Math.max(0.02, 2 * O.Eh + 2 / (Rv || 10)));
        var T = dt * speed, guard = 0;
        while (T > 1e-12 && guard++ < 4000){ var r = Math.hypot(st.x, st.y), h = Math.min(T, 0.015 * Math.pow(r, 1.5)); rk4(h); T -= h; }
        trail.push([st.x, st.y]); if (trail.length > 260) trail.shift();
        if (O.Eh >= 0 && Math.hypot(st.x, st.y) > 1.7 * (Rv || 10) && (st.x * st.vx + st.y * st.vy) > 0) relaunch();
        else if (Rv){ var Pe = scr(st.x, st.y); if (Pe.x < -8 || Pe.x > c.W + 8 || Pe.y < -8 || Pe.y > c.H + 8) relaunch(); }   /* sorti de l'écran : on relance */
      }
      if (q){ accC += dt * 40; while (accC >= 1){ accC -= 1; cloud.push(sampleR()); } if (cloud.length > 700) cloud.splice(0, cloud.length - 700); }
      k.redraw();
    });
    lp.play();
    /* tirage d'une distance selon |u_nl|² (rejet) et d'un angle au hasard */
    function sampleR(){
      var n = nS.value, l = +lS.value, rm = n * n * 2.6 + 6, mx = 0, i;
      for (i = 1; i <= 80; i++){ var u = peU(n, l, i / 80 * rm); mx = Math.max(mx, u * u); }
      for (var t = 0; t < 500; t++){ var r = Math.random() * rm, uu = peU(n, l, r); if (Math.random() * mx * 1.1 < uu * uu){ var an = Math.random() * TAU; return [r * Math.cos(an), r * Math.sin(an)]; } }
      return [0, 0];
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, O = cur(), q = modeS.value === "q", i, n = nS.value, l = +lS.value;
      var bound = O.Eh < 0, rp = O.tp[0], ra = O.tp[1];
      var Rt = q ? n * n * 2.2 + 3 : (bound ? Math.max(3, ra * 1.12) : Math.max(8, rp * 6));
      Rt = q4clamp(Rt, 3, 90); if (!Rv) Rv = Rt; Rv += (Rt - Rv) * 0.08;
      q4lab(ctx, W, H, "#141d33", "#05080f");
      /* étoiles */
      ctx.save(); for (i = 0; i < 70; i++){ var r1s = Math.sin(i * 12.9898) * 43758.5453, r2s = Math.sin(i * 78.233) * 12345.6789; r1s -= Math.floor(r1s); r2s -= Math.floor(r2s); ctx.fillStyle = "rgba(255,255,255," + (0.15 + 0.35 * ((i * 13) % 7) / 7) + ")"; ctx.fillRect(r1s * W, r2s * H, 1.3, 1.3); } ctx.restore();
      v.sc = Math.min(W, H * 1.55) * 0.46 / Rv; v.cx = W * 0.5; v.cy = H * 0.52;
      /* plan de l'orbite : anneaux en a₀ */
      var stp = q4step(Rv, 3);
      ctx.save(); ctx.lineWidth = 1;
      for (var rr = stp; rr <= Rv * 1.25; rr += stp){
        ctx.beginPath(); for (i = 0; i <= 64; i++){ var an = i / 64 * TAU, P = scr(rr * Math.cos(an), rr * Math.sin(an)); if (i) ctx.lineTo(P.x, P.y); else ctx.moveTo(P.x, P.y); }
        ctx.strokeStyle = "rgba(120,160,230,.16)"; ctx.stroke();
      }
      var lab = scr(stp * Math.cos(-0.5), stp * Math.sin(-0.5)); ctx.restore();
      q4T(S, c, q4N(stp, stp < 1 ? 1 : 0) + " a₀", lab.x + 4, lab.y + 8, {size:q4fz(c, 10), color:"rgba(170,195,240,.75)", align:"left", weight:600});
      /* nuage quantique : distances mesurées */
      if (q){
        /* probabilité radiale |u|² : anneaux lumineux dans le plan */
        var umx = 0, NR = 60, rmq = n * n * 2.6 + 6, uu2 = [];
        for (i = 0; i < NR; i++){ var ur = peU(n, l, (i + 0.5) / NR * rmq); uu2.push(ur * ur); umx = Math.max(umx, ur * ur); }
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        for (i = 0; i < NR; i++){ var rq0 = (i + 0.5) / NR * rmq, al = 0.32 * uu2[i] / umx; if (al < 0.01) continue;
          ctx.beginPath(); for (var jj = 0; jj <= 64; jj++){ var an2 = jj / 64 * TAU, P2 = scr(rq0 * Math.cos(an2), rq0 * Math.sin(an2)); if (jj) ctx.lineTo(P2.x, P2.y); else ctx.moveTo(P2.x, P2.y); }
          ctx.strokeStyle = "rgba(90,220,150," + al.toFixed(3) + ")"; ctx.lineWidth = Math.max(1.5, rmq / NR * v.sc * 1.1); ctx.stroke(); }
        ctx.restore();
        cloud.forEach(function(pt, j){ var P = scr(pt[0], pt[1]), a = 0.35 + 0.65 * j / cloud.length; ctx.fillStyle = "rgba(170,255,200," + a.toFixed(2) + ")"; ctx.fillRect(P.x - 1.3, P.y - 1.3, 2.6, 2.6); });
      }
      /* orbite analytique */
      var e = O.e, pp = O.p;
      if (!(q && l === 0)){
        ctx.save(); ctx.beginPath(); var started = false;
        for (i = 0; i <= 360; i++){
          var th = -PI + i / 360 * TAU, den = 1 + e * Math.cos(th); if (den <= 0.02){ started = false; continue; }
          var r3 = pp / den; if (r3 > Rv * 3){ started = false; continue; }
          var P3 = scr(r3 * Math.cos(th + wAng), r3 * Math.sin(th + wAng)); if (!started){ ctx.moveTo(P3.x, P3.y); started = true; } else ctx.lineTo(P3.x, P3.y);
        }
        ctx.strokeStyle = q ? "rgba(255,200,110,.35)" : "rgba(255,200,110,.75)"; ctx.lineWidth = 1.6; ctx.setLineDash(q ? [5, 5] : [6, 4]); ctx.stroke(); ctx.restore();
      }
      /* traînée */
      if (!q && trail.length > 1){ ctx.save(); for (i = 1; i < trail.length; i++){ var A = scr(trail[i - 1][0], trail[i - 1][1]), B = scr(trail[i][0], trail[i][1]); ctx.strokeStyle = "rgba(127,212,255," + (i / trail.length * 0.85).toFixed(2) + ")"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); } ctx.restore(); }
      /* noyau */
      var N0 = scr(0, 0); q4glow(ctx, N0.x, N0.y, 30, "#ff8a5c", 0.45); q4ball(ctx, N0.x, N0.y, 8, "#e0533d");
      q4T(S, c, "+", N0.x, N0.y, {size:11, color:"#fff"});
      /* électron et flèche de vitesse */
      if (!q){
        var Pe = scr(st.x, st.y), T = tipPos(), Ts = scr(T.x, T.y);
        q4glow(ctx, Pe.x, Pe.y, 16, "#7fd4ff", 0.5); q4ball(ctx, Pe.x, Pe.y, 6, "#59b8ff");
        S.draw.arrow(c, Pe.x, Pe.y, Ts.x, Ts.y, "#7dff9a", 2.4);
        ctx.save(); ctx.strokeStyle = "rgba(125,255,154,.8)"; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(Ts.x, Ts.y, 9, 0, TAU); ctx.stroke(); ctx.restore();
        q4T(S, c, "v", Ts.x + 12, Ts.y - 8, {size:q4fz(c, 13), color:"#7dff9a", math:true, italic:true});
      }
      var typ = q ? "" : (bound ? (e < 0.02 ? "cercle" : "ellipse") : (Math.abs(O.Eh) < 1e-4 ? "parabole" : "hyperbole"));
      q4tag(S, c, q ? "mode quantique : distances mesurées, tirées selon |uₙₗ|²" : "orbite : " + typ + " (e = " + q4N(e, 2) + ")", 8, 16, {size:10.5, align:"left", weight:700, color:q ? "#bff5d2" : "#ffe1a8"});
      if (!q) q4T(S, c, phone ? "glisse la flèche v" : "attrape la flèche v pour lancer l'électron", W - 8, H - 12, {size:q4fz(c, 10.5), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      if (q && l > 0) q4T(S, c, "- - orbite classique de même E et L", W - 8, H - 12, {size:q4fz(c, 10.5), color:"rgba(255,210,140,.8)", align:"right", weight:600});

      /* ---- potentiel effectif ---- */
      g.clear();
      var L2 = q ? l * (l + 1) : O.L2, Emn = -RYEV / (n * n);
      var rmax = q ? Math.max(12, n * n * 2.6) : (bound ? Math.max(6, ra * 1.25) : Math.max(8, rp * 5));
      var vmin = L2 > 0 ? -1 / (2 * L2) * HAEV : -RYEV, ymin, ymax;
      if (q){ ymin = Math.min(vmin, -RYEV / Math.pow(l + 1, 2)) * 1.15; ymax = Math.abs(ymin) * 0.22; }
      else { ymin = Math.min(vmin, eS.value) * 1.2 - 0.5; ymax = Math.max(eS.value + Math.abs(ymin) * 0.25, Math.abs(ymin) * 0.3); }
      var ax = q4axes(S, g, {x0:0, x1:rmax, y0:ymin, y1:ymax, l:phone ? 36 : 42, r:12, t:22, b:32, xl:"r (a₀)"});
      var gx = g.ctx;
      q4T(S, g, "énergie (eV)", ax.L, 10, {size:q4fz(g, 11), color:"#2c3a4e", align:"left"});
      /* zone permise (classique) */
      if (!q){
        var r1 = rp, r2 = Math.min(ra, rmax);
        gx.save(); gx.fillStyle = "rgba(47,111,214,.08)"; gx.fillRect(ax.X(r1), ax.T, ax.X(r2) - ax.X(r1), ax.B - ax.T); gx.restore();
      }
      S.draw.fn(g, ax, function(r){ return r > 0.02 ? -1 / r * HAEV : NaN; }, "rgba(224,83,61,.55)", 1.4, [4, 4]);
      if (L2 > 0) S.draw.fn(g, ax, function(r){ return r > 0.02 ? L2 / (2 * r * r) * HAEV : NaN; }, "rgba(46,158,106,.6)", 1.4, [4, 4]);
      S.draw.fn(g, ax, function(r){ return r > 0.02 ? peVeff(r, L2) * HAEV : NaN; }, "#13233a", 2.6);
      /* légende sur une ligne, dans la marge du haut */
      var fz = q4fz(g, 10.5), lx = ax.R, t3 = L2 > 0 ? "- - L²/2mr²" : "", t2 = "- - −ke²/r", t1 = "— potentiel effectif";
      if (t3){ q4T(S, g, t3, lx, 10, {size:fz, color:"#2e9e6a", align:"right"}); lx -= q4tw(g, t3, fz) + 10; }
      q4T(S, g, t2, lx, 10, {size:fz, color:"#e0533d", align:"right"}); lx -= q4tw(g, t2, fz) + 10;
      q4T(S, g, t1, lx, 10, {size:fz, color:"#13233a", align:"right"});
      if (!q){
        var Ey = ax.Y(eS.value);
        S.draw.line(g, ax.X(rp), Ey, ax.X(Math.min(ra, rmax)), Ey, "#e0662a", 2);
        S.draw.line(g, ax.X(rp), Ey, ax.X(rp), ax.B, "rgba(224,102,42,.6)", 1, [3, 3]);
        q4T(S, g, "r₁", ax.X(rp), ax.B - 9, {size:q4fz(g, 10.5), color:"#e0662a", halo:"#ffffff"});
        if (bound && ra < rmax){ S.draw.line(g, ax.X(ra), Ey, ax.X(ra), ax.B, "rgba(224,102,42,.6)", 1, [3, 3]); q4T(S, g, "r₂", ax.X(ra), ax.B - 9, {size:q4fz(g, 10.5), color:"#e0662a", halo:"#ffffff"}); }
        var rn = Math.hypot(st.x, st.y);
        if (rn <= rmax){ var bx = ax.X(rn), by = Ey; q4glow(gx, bx, by - 7, 14, "#59b8ff", 0.35); q4ball(gx, bx, by - 7, 6.5, "#59b8ff"); }
        q4T(S, g, "E", ax.L + 8, Ey - 9, {size:q4fz(g, 11), color:"#e0662a", align:"left", halo:"#ffffff"});
      } else {
        /* niveaux permis pour ce l, fonction radiale du niveau choisi */
        var labs = [];   /* étiquettes posées après les courbes, sur une pastille blanche */
        for (var nn = l + 1; nn <= 7; nn++){
          var En = -RYEV / (nn * nn), Y = ax.Y(En); if (Y < ax.T + 4) continue;
          var on = nn === n;
          S.draw.line(g, ax.L, Y, ax.R, Y, on ? "#e0662a" : "rgba(47,111,214,.45)", on ? 2 : 1.2, on ? null : [5, 3]);
          if (on || nn === l + 1) labs.push(["n = " + nn, Y - 9, on ? "#e0662a" : "#2f6fd6", 10]);
        }
        var Yn = ax.Y(Emn), um = 0;
        for (i = 0; i <= 300; i++){ var uu = peU(n, l, i / 300 * rmax); um = Math.max(um, Math.abs(uu)); }
        var amp = Math.min(38, (ax.B - ax.T) * 0.22);
        gx.save(); gx.beginPath(); gx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); gx.clip(); gx.beginPath();
        for (i = 0; i <= 400; i++){ var rq = i / 400 * rmax, yq = Yn - peU(n, l, rq) / um * amp; if (i) gx.lineTo(ax.X(rq), yq); else gx.moveTo(ax.X(rq), yq); }
        gx.lineTo(ax.R, Yn); gx.lineTo(ax.L, Yn); gx.closePath(); gx.fillStyle = "rgba(224,102,42,.15)"; gx.fill();
        gx.beginPath(); for (i = 0; i <= 400; i++){ rq = i / 400 * rmax; yq = Yn - peU(n, l, rq) / um * amp; if (i) gx.lineTo(ax.X(rq), yq); else gx.moveTo(ax.X(rq), yq); }
        gx.strokeStyle = "#c0391f"; gx.lineWidth = 2; gx.stroke(); gx.restore();
        labs.push(["u" + ["₁", "₂", "₃", "₄", "₅", "₆"][n - 1] + ["₀", "₁", "₂"][l] + "(r)", Yn + 13, "#c0391f", 11]);
        labs.forEach(function(lb){ q4T(S, g, lb[0], ax.R - 6, q4clamp(lb[1], ax.T + 8, ax.B - 8), {size:q4fz(g, lb[3]), color:lb[2], align:"right", bg:"rgba(255,255,255,.94)"}); });
      }

      /* ---- afficheurs ---- */
      if (q){
        var rbest = 0, ub = 0; for (i = 1; i <= 4000; i++){ var r5 = i / 4000 * rmax, u5 = peU(n, l, r5); if (u5 * u5 > ub){ ub = u5 * u5; rbest = r5; } }
        smalls[0].innerHTML = "Énergie Eₙ = −13,6 eV/n²"; smalls[1].innerHTML = "|L| = ħ√(l(l + 1))"; smalls[2].innerHTML = "Rayon le plus probable"; smalls[3].innerHTML = "Nœuds radiaux n − l − 1";
        ro.set(0, q4N(Emn, 3) + " eV"); ro.set(1, l ? q4N(Math.sqrt(l * (l + 1)), 3) + " ħ" : "0");
        ro.set(2, q4N(rbest, 2) + " a₀"); ro.set(3, String(n - l - 1));
        nt.set("Pour l = " + l + ", les niveaux permis sont n = " + (l + 1) + ", " + (l + 2) + ", … : même énergie −13,6 eV/n² que pour les autres l (dégénérescence propre au potentiel en 1/r). uₙₗ(r) a n − l − 1 nœuds" + (l > 0 ? " et s'annule au centre, repoussée par la barrière centrifuge." : " ; pour l = 0, pas de barrière : l'électron a une probabilité non nulle près du noyau."), "ok");
      } else {
        smalls[0].innerHTML = "Énergie E"; smalls[1].innerHTML = "Moment cinétique L"; smalls[2].innerHTML = "Excentricité e"; smalls[3].innerHTML = "Distances r₁ et r₂";
        ro.set(0, q4N(eS.value, 1) + " eV"); ro.set(1, q4N(LS.value, 2) + " ħ"); ro.set(2, q4N(e, 3));
        ro.set(3, bound ? q4N(rp, 2) + " a₀ et " + q4N(ra, 2) + " a₀" : "r₁ = " + q4N(rp, 2) + " a₀, r₂ infini");
        nt.set((bound ? (e < 0.02 ? "Orbite circulaire : E est au fond du puits, la bille ne bouge pas en r." : "E < 0 : la bille reste piégée entre r₁ et r₂, l'orbite est une ellipse.") : "E ≥ 0 : rien ne retient la bille au-delà de r₁, l'électron repart à l'infini (" + (Math.abs(O.Eh) < 1e-4 ? "parabole" : "hyperbole") + ").") +
          " Fond du puits : −13,6 eV/L² = " + q4N(vmin, 2) + " eV, à r = L² a₀ = " + q4N(O.L2, 2) + " a₀. Unités atomiques : électron autour d'un proton fixe.", "ok");
      }
    });
  }
});

/* =====================================================================
   5. Deux particules dans une boîte : discernables, bosons, fermions (pq07)
   ===================================================================== */
var DP_A = 1e-9;                                          /* largeur de la boîte : 1 nm, électrons */
var DP_E1 = HP * HP / (8 * ME * DP_A * DP_A) / QE;        /* énergie du niveau 1 : 0,376 eV */
function dpPsi(n, u){ return Math.SQRT2 * Math.sin(n * PI * u); }   /* u = x/a, normalisée sur [0, 1] */
/* |Ψ(u1, u2)|² (unités 1/a²) */
function dpRho(type, na, nb, u1, u2){
  var A = dpPsi(na, u1) * dpPsi(nb, u2), B = dpPsi(nb, u1) * dpPsi(na, u2);
  if (type === "d") return A * A;
  if (na === nb) return type === "b" ? A * A : 0;
  var s = type === "b" ? (A + B) : (A - B); return s * s / 2;
}
function dpHeat(t){   /* bleu nuit → turquoise → jaune */
  t = q4clamp(t, 0, 1);
  var st = [[0, 22, 40, 90], [0.35, 30, 120, 170], [0.65, 70, 200, 160], [0.85, 220, 220, 90], [1, 255, 240, 170]];
  for (var i = 1; i < st.length; i++) if (t <= st[i][0]){ var f = (t - st[i - 1][0]) / (st[i][0] - st[i - 1][0]); return [0, 1, 2].map(function(c){ return Math.round(st[i - 1][c + 1] + f * (st[i][c + 1] - st[i - 1][c + 1])); }); }
  return [255, 240, 170];
}

SFA.sim({
  id:"pq-deux-particules-identiques", ch:"pq07", tag:"Particules identiques",
  titre:"Deux particules dans une boîte : discernables, bosons, fermions",
  resume:"Deux particules dans la même boîte : leurs positions tirées au hasard, et la carte |Ψ(x₁, x₂)|² en relief. Pour des fermions de même spin, la diagonale x₁ = x₂ est vide.",
  but:"Choisis les deux états occupés et le type de particules. À gauche, chaque flash est une mesure des deux positions, reportée sur la carte (x₁, x₂). À droite, |Ψ|² en relief : glisse pour le faire tourner.",
  aRetenir:"Pour des fermions de même spin, Ψ change de signe quand on échange les particules : Ψ(x, x) = 0, jamais deux au même endroit.",
  piege:"L'exclusion ne vient d'aucune force entre les particules : elle vient seulement de l'antisymétrie de Ψ.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 640 : 430);
    var tS = k.seg("Particules", [["d", "Discernables"], ["b", "Bosons"], ["f", "Fermions (même spin)"]], "f", function(){ reset(); });
    var aS = k.slider("État de la particule 1 : n<sub>a</sub>", 1, 4, 1, 1, "", function(){ reset(); });
    var bS = k.slider("État de la particule 2 : n<sub>b</sub>", 1, 4, 1, 2, "", function(){ reset(); });
    k.button("Effacer les mesures", function(){ pts = []; });
    var ro = k.readouts(["Énergie totale (m = m<sub>e</sub>, a = 1 nm)", "Même moitié de la boîte", "Écart moyen ⟨|x₁ − x₂|⟩", "Diagonale x₁ = x₂ / discernables"]);
    var nt = k.note("", "ok");
    var pts = [], acc = 0, cur = null, tt = 0, stats = null, statKey = "";
    function reset(){ pts = []; cur = null; stats = null; }
    function par(){ return {t:tS.value, a:Math.round(aS.value), b:Math.round(bS.value)}; }
    function maxRho(P){ var m = 0; for (var i = 0; i <= 60; i++) for (var j = 0; j <= 60; j++) m = Math.max(m, dpRho(P.t, P.a, P.b, i / 60, j / 60)); return m * 1.05; }
    function sample(P){
      var M = maxRho(P); if (M <= 0) return null;
      for (var t = 0; t < 3000; t++){ var u1 = Math.random(), u2 = Math.random(); if (Math.random() * M < dpRho(P.t, P.a, P.b, u1, u2)) return [u1, u2]; }
      return null;
    }
    function getStats(P){
      var key = P.t + P.a + "," + P.b; if (stats && statKey === key) return stats;
      var N = 200, h = 1 / N, same = 0, dist = 0, tot = 0, diag = 0, i, j;
      for (i = 0; i < N; i++) for (j = 0; j < N; j++){
        var u1 = (i + 0.5) * h, u2 = (j + 0.5) * h, r = dpRho(P.t, P.a, P.b, u1, u2) * h * h;
        tot += r; dist += r * Math.abs(u1 - u2); if ((u1 < 0.5) === (u2 < 0.5)) same += r;
      }
      for (i = 0; i < 2000; i++){ var u = (i + 0.5) / 2000; diag += dpRho(P.t, P.a, P.b, u, u) / 2000; }
      var dd = 0; for (i = 0; i < 2000; i++){ u = (i + 0.5) / 2000; dd += dpRho("d", P.a, P.b, u, u) / 2000; }
      stats = {tot:tot, same:tot > 0 ? same / tot : NaN, dist:tot > 0 ? dist / tot : NaN, diag:diag, diagD:dd}; statKey = key; return stats;
    }
    var v = new Q4V(); v.a = -0.65; v.b = 0.62; v.f = 9; v.set();
    var drag = null;
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(type, p){
      if (type === "down") drag = {x:p.x, y:p.y};
      if (type === "drag" && drag){ v.a += (p.x - drag.x) * 0.01; v.b = q4clamp(v.b + (p.y - drag.y) * 0.01, 0.12, 1.45); v.set(); v.user = true; drag = {x:p.x, y:p.y}; }
      if (type === "up") drag = null;
    });
    var lp = k.loop(function(dt){
      tt += dt;
      if (!v.user){ v.a = -0.65 + 0.3 * Math.sin(tt * 0.22); v.set(); }
      acc += dt * 2.2;
      while (acc >= 1){ acc -= 1; var q = sample(par()); if (q){ cur = {u:q, age:0}; pts.push(q); if (pts.length > 1500) pts.shift(); } else cur = null; }
      if (cur) cur.age += dt;
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, P = par(), i, j, ident = P.t !== "d", imp = P.t === "f" && P.a === P.b;
      q4lab(ctx, W, H, "#18223b", "#070b15");
      var L, R;
      if (phone){ L = {x:0, y:0, w:W, h:H * 0.44}; R = {x:0, y:H * 0.44, w:W, h:H * 0.56}; }
      else { L = {x:0, y:0, w:W * 0.42, h:H}; R = {x:W * 0.42, y:0, w:W * 0.58, h:H}; }
      [L, R].forEach(function(Q){ Q.x0 = Q.x; Q.x1 = Q.x + Q.w; Q.y0 = Q.y; Q.y1 = Q.y + Q.h; });
      ctx.save(); ctx.strokeStyle = "rgba(160,185,230,.18)"; ctx.beginPath();
      if (phone){ ctx.moveTo(10, R.y + 0.5); ctx.lineTo(W - 10, R.y + 0.5); } else { ctx.moveTo(R.x + 0.5, 14); ctx.lineTo(R.x + 0.5, H - 14); }
      ctx.stroke(); ctx.restore();
      var c1 = "#59b8ff", c2 = ident ? "#59b8ff" : "#ff9b3d";
      /* ---- la boîte (fil quantique en verre) ---- */
      var bx0 = L.x + 22, bx1 = L.x + L.w - 16, by = L.y + (phone ? 52 : 66), bh = phone ? 52 : 74, dep = 14;
      ctx.save();
      /* paroi du fond et sol */
      var gb = ctx.createLinearGradient(0, by - dep, 0, by + bh); gb.addColorStop(0, "rgba(120,160,230,.10)"); gb.addColorStop(1, "rgba(120,160,230,.22)");
      ctx.fillStyle = gb; ctx.beginPath(); ctx.moveTo(bx0 + dep, by - dep); ctx.lineTo(bx1 + dep, by - dep); ctx.lineTo(bx1, by); ctx.lineTo(bx1, by + bh); ctx.lineTo(bx0, by + bh); ctx.lineTo(bx0, by); ctx.closePath(); ctx.fill();
      /* murs infranchissables */
      [bx0, bx1].forEach(function(xw){ var gw = ctx.createLinearGradient(xw - 6, 0, xw + 6, 0); gw.addColorStop(0, "#5b6b86"); gw.addColorStop(0.5, "#b9c6dc"); gw.addColorStop(1, "#46536a");
        ctx.fillStyle = gw; ctx.beginPath(); ctx.moveTo(xw - 5, by + bh + 4); ctx.lineTo(xw - 5, by - 2); ctx.lineTo(xw - 5 + dep, by - dep - 2); ctx.lineTo(xw + 5 + dep, by - dep - 2); ctx.lineTo(xw + 5, by - 2); ctx.lineTo(xw + 5, by + bh + 4); ctx.closePath(); ctx.fill(); });
      ctx.strokeStyle = "rgba(190,215,255,.55)"; ctx.lineWidth = 1.2; ctx.strokeRect(bx0, by, bx1 - bx0, bh);
      ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(bx0 + dep, by - dep); ctx.lineTo(bx1 + dep, by - dep); ctx.lineTo(bx1, by); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx0 + 10, by + 6); ctx.lineTo(bx1 - 10, by + 6); ctx.stroke();
      ctx.restore();
      /* densités à une particule (fines, sous la boîte) */
      var Xb = function(u){ return bx0 + 5 + u * (bx1 - bx0 - 10); };
      /* billes : dernière mesure */
      if (cur && !imp){
        var a = Math.max(0, 1 - cur.age / 0.45) * 0.6 + 0.4, yb = by + bh * 0.58;
        var x1 = Xb(cur.u[0]), x2 = Xb(cur.u[1]), close = Math.abs(x1 - x2) < 16;
        q4shadow(ctx, x1, by + bh - 4, 11, 4, 0.4); q4shadow(ctx, x2, by + bh - 4, 11, 4, 0.4);
        q4glow(ctx, x1, yb - (close ? 7 : 0), 22, c1, 0.5 * a); q4ball(ctx, x1, yb - (close ? 7 : 0), 9, c1);
        q4glow(ctx, x2, yb + (close ? 7 : 0), 22, c2, 0.5 * a); q4ball(ctx, x2, yb + (close ? 7 : 0), 9, c2);
        if (!ident){ q4T(S, c, "1", x1, yb - (close ? 7 : 0), {size:10, color:"#0d1a2e"}); q4T(S, c, "2", x2, yb + (close ? 7 : 0), {size:10, color:"#2a1606"}); }
      }
      q4tag(S, c, imp ? "fermions de même spin : même état interdit" : ident ? (P.t === "b" ? "deux bosons identiques" : "deux fermions de même spin") : "1 en bleu, 2 en orange", L.x + 8, L.y + 16, {size:10.5, align:"left", weight:700, box:L, color:imp ? "#ffb4a0" : "#eef3fb"});
      q4T(S, c, "0", bx0, by + bh + 14, {size:q4fz(c, 10), color:"#9fb2d4", weight:600});
      q4T(S, c, "a = 1 nm", bx1 + 5, by + bh + 14, {size:q4fz(c, 10), color:"#9fb2d4", weight:600, align:"right"});
      /* carte des mesures (x₁, x₂) */
      var my0 = by + bh + 30, ms = Math.min(L.w - 64, L.y + L.h - my0 - 30), mx0 = L.x + (L.w - ms) / 2 + 8;
      if (ms > 40){
        ctx.save(); ctx.fillStyle = "#0b1222"; q4rr(ctx, mx0, my0, ms, ms, 6); ctx.fill(); ctx.strokeStyle = "rgba(160,190,240,.35)"; ctx.stroke(); ctx.restore();
        ctx.save(); q4rr(ctx, mx0, my0, ms, ms, 6); ctx.clip();
        pts.forEach(function(q, n){ var a2 = 0.35 + 0.55 * n / pts.length; ctx.fillStyle = "rgba(255,214,110," + a2.toFixed(2) + ")"; ctx.fillRect(mx0 + q[0] * ms - 1.2, my0 + (1 - q[1]) * ms - 1.2, 2.4, 2.4); });
        ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mx0, my0 + ms); ctx.lineTo(mx0 + ms, my0); ctx.stroke();
        if (cur && !imp){ ctx.setLineDash([]); ctx.strokeStyle = "#7dff9a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mx0 + cur.u[0] * ms, my0 + (1 - cur.u[1]) * ms, 5, 0, TAU); ctx.stroke(); }
        ctx.restore();
        q4T(S, c, "x₁", mx0 + ms / 2, my0 + ms + 11, {size:q4fz(c, 11), color:"#c9d6ee", math:true});
        q4T(S, c, "x₂", mx0 - 12, my0 + ms / 2, {size:q4fz(c, 11), color:"#c9d6ee", math:true});
        q4T(S, c, "x₁ = x₂", mx0 + ms - 4, my0 + 10, {size:q4fz(c, 9.5), color:"rgba(255,255,255,.75)", align:"right", weight:600});
        q4T(S, c, pts.length + " mesures", mx0 + ms, my0 + ms + 11, {size:q4fz(c, 9.5), color:"#ffd27a", align:"right", weight:700});
      }
      /* ---- |Ψ(x₁, x₂)|² en relief ---- */
      var N = phone ? 26 : 30, M = imp ? 1 : maxRho(P), Hs = 1.15;
      v.sc = Math.min(R.w, R.h) * 0.22; v.cx = R.x + R.w / 2; v.cy = R.y + R.h * 0.6; v.clear();
      /* socle */
      v.box(-1.08, -0.12, -1.08, 1.08, 0, 1.08, "#2a3550");
      v.render(ctx); v.clear();
      var G = [];
      for (i = 0; i <= N; i++){ G.push([]); for (j = 0; j <= N; j++) G[i].push(imp ? 0 : dpRho(P.t, P.a, P.b, i / N, j / N) / M); }
      for (i = 0; i < N; i++) for (j = 0; j < N; j++){
        var hm = (G[i][j] + G[i + 1][j] + G[i + 1][j + 1] + G[i][j + 1]) / 4, cc = dpHeat(hm);
        var hex = "#" + cc.map(function(x){ var s2 = x.toString(16); return s2.length < 2 ? "0" + s2 : s2; }).join("");
        var X0 = -1 + 2 * i / N, X1 = -1 + 2 * (i + 1) / N, Z0 = 1 - 2 * j / N, Z1 = 1 - 2 * (j + 1) / N;
        v.face([[X0, G[i][j] * Hs + 0.002, Z0], [X1, G[i + 1][j] * Hs + 0.002, Z0], [X1, G[i + 1][j + 1] * Hs + 0.002, Z1], [X0, G[i][j + 1] * Hs + 0.002, Z1]], hex, {});
      }
      v.render(ctx);
      /* diagonale x₁ = x₂, tracée sur la surface */
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (i = 0; i <= N; i++){ var Dp = v.p(-1 + 2 * i / N, G[i][i] * Hs + 0.01, 1 - 2 * i / N); if (i) ctx.lineTo(Dp.x, Dp.y); else ctx.moveTo(Dp.x, Dp.y); }
      ctx.stroke(); ctx.restore();
      var A0 = v.p(-1.08, 0, 1.2), A1 = v.p(1.15, 0, 1.2), B0 = v.p(-1.2, 0, 1.08), B1 = v.p(-1.2, 0, -1.15);
      S.draw.arrow(c, A0.x, A0.y, A1.x, A1.y, "#c9d6ee", 1.5); S.draw.arrow(c, B0.x, B0.y, B1.x, B1.y, "#c9d6ee", 1.5);
      q4T(S, c, "x₁", q4clamp(A1.x + 10, R.x + 12, R.x + R.w - 12), q4clamp(A1.y + 4, R.y + 30, R.y + R.h - 24), {size:q4fz(c, 12), color:"#e6eefc", math:true});
      q4T(S, c, "x₂", q4clamp(B1.x - 10, R.x + 12, R.x + R.w - 12), q4clamp(B1.y - 4, R.y + 30, R.y + R.h - 24), {size:q4fz(c, 12), color:"#e6eefc", math:true});
      var Dl = v.p(0.75, G[Math.round(N * 0.875)][Math.round(N * 0.875)] * Hs + 0.01, -0.75);
      q4tag(S, c, "x₁ = x₂", Dl.x, Dl.y - 14, {size:10, box:R, weight:700});
      q4tag(S, c, "|Ψ(x₁, x₂)|² en relief", R.x + 8, R.y + 16, {size:10.5, align:"left", weight:700, box:R});
      q4T(S, c, "glisse pour tourner", R.x + R.w - 8, R.y + R.h - 12, {size:q4fz(c, 10), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      if (imp) q4tag(S, c, "Ψ = 0 partout : principe de Pauli (même spin)", R.x + R.w / 2, R.y + R.h * 0.3, {size:12, color:"#ffd34d", box:R});

      /* ---- afficheurs ---- */
      var St = getStats(P), E = (P.a * P.a + P.b * P.b) * DP_E1;
      ro.set(0, imp ? "état interdit" : q4N(E, 2) + " eV");
      ro.set(1, imp ? "—" : q4N(St.same * 100, 1) + " %");
      ro.set(2, imp ? "—" : q4N(St.dist, 3) + " nm");
      ro.set(3, imp ? "—" : (P.t === "d" ? "× 1 (référence)" : St.diagD > 0 ? (St.diag / St.diagD < 1e-9 ? "0 (vide)" : "× " + q4N(St.diag / St.diagD, 2)) : "—"));
      var msg = imp ? "Deux fermions de même spin ne peuvent pas occuper le même état spatial : la fonction antisymétrique est nulle partout. Avec des spins opposés (singulet), la partie spatiale est symétrique et ils peuvent partager n<sub>a</sub> = n<sub>b</sub>. Ici, choisis deux états différents." :
        P.t === "f" ? "Fermions de même spin : Ψ = [ψ<sub>a</sub>(x₁)ψ<sub>b</sub>(x₂) − ψ<sub>b</sub>(x₁)ψ<sub>a</sub>(x₂)]/√2 s'annule sur toute la diagonale ; les mesures évitent x₁ = x₂, les particules se tiennent à l'écart." :
        P.t === "b" ? (P.a === P.b ? "Bosons dans le même état : rien ne les empêche de s'accumuler, Ψ = ψ<sub>a</sub>(x₁)ψ<sub>a</sub>(x₂)." : "Bosons : Ψ = [ψ<sub>a</sub>(x₁)ψ<sub>b</sub>(x₂) + ψ<sub>b</sub>(x₁)ψ<sub>a</sub>(x₂)]/√2 ; la diagonale est deux fois plus dense que pour des particules discernables, elles se regroupent.") :
        "Discernables : Ψ = ψ<sub>a</sub>(x₁)ψ<sub>b</sub>(x₂), chaque particule ignore l'autre ; la carte n'est pas symétrique si n<sub>a</sub> ≠ n<sub>b</sub>.";
      nt.set(msg + " Énergie : E = (n<sub>a</sub>² + n<sub>b</sub>²)E₁ avec E₁ = h²/(8ma²) = " + q4N(DP_E1, 3) + " eV.", imp ? "warn" : "ok");
    });
  }
});

/* =====================================================================
   6. Deux corps autour du centre de masse : H, D, He⁺, Ps, μp, Rb (pq07)
   ===================================================================== */
/* m : particule légère, M : partenaire (en masses d'électron), Z : charge du noyau vue */
var MR_SYS = {
  H:{nom:"Hydrogène ¹H", m:1, M:MP_ME, Z:1, lc:"#59b8ff", ll:"e⁻", nc:"#e0533d", nl:"p", nuc:"p"},
  D:{nom:"Deutérium ²H", m:1, M:3670.48297, Z:1, lc:"#59b8ff", ll:"e⁻", nc:"#e0533d", nl:"d", nuc:"d"},
  He:{nom:"Ion hélium He⁺", m:1, M:7294.29954, Z:2, lc:"#59b8ff", ll:"e⁻", nc:"#e0533d", nl:"α", nuc:"a"},
  Ps:{nom:"Positronium", m:1, M:1, Z:1, lc:"#59b8ff", ll:"e⁻", nc:"#ff6fae", nl:"e⁺", nuc:"e"},
  Mu:{nom:"Hydrogène muonique μp", m:MMU_ME, M:MP_ME, Z:1, lc:"#b07cff", ll:"μ⁻", nc:"#e0533d", nl:"p", nuc:"p"},
  Rb:{nom:"Rubidium très excité", m:1, M:84.9117897 * UMA / ME - 1, Z:1, lc:"#59b8ff", ll:"e⁻", nc:"#9a8bbd", nl:"Rb⁺", nuc:"rb", nmin:5}
};
function mrMu(Sy){ return Sy.m * Sy.M / (Sy.m + Sy.M); }          /* masse réduite (mₑ) */
function mrLam(Sy, n2, n1){ return HC_EVNM / (RYEV * mrMu(Sy) * Sy.Z * Sy.Z * (1 / (n1 * n1) - 1 / (n2 * n2))); }   /* nm, dans le vide */

SFA.sim({
  id:"pq-masse-reduite-hydrogenoides", ch:"pq07", tag:"Masse réduite",
  titre:"Deux corps autour du centre de masse : H, deutérium, positronium",
  resume:"Électron et noyau tournent autour de leur centre de masse ; la masse réduite μ change le rayon de Bohr, l'énergie et décale les raies de Balmer.",
  but:"Choisis un système : le noyau danse plus ou moins autour du centre de masse (la croix). Regarde les raies se décaler sur le spectre et dans la loupe autour de Hα, puis monte n pour voir la taille d'un atome de Rydberg. Glisse sur la scène pour tourner.",
  aRetenir:"On remplace m par la masse réduite μ = mM/(m + M) : aₙ = n²(mₑ/μ)a₀/Z et Eₙ = −13,6 eV × (μ/mₑ)Z²/n².",
  piege:"Le noyau n'est pas immobile : il tourne lui aussi autour du centre de masse, de très peu pour l'hydrogène, autant que l'électron pour le positronium.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 370 : 390), g = k.canvas(phone ? 220 : 210);
    var sysS = k.select("Système", Object.keys(MR_SYS).map(function(x){ return [x, MR_SYS[x].nom]; }), "H", function(){ syncN(); });
    var nS = k.slider("Niveau n (taille de l'atome)", 1, 60, 1, 1, "", function(){ syncN(); });
    var ro = k.readouts(["Masse réduite μ", "Rayon de Bohr effectif a", "Raie Hα (3 → 2)", "Taille de l'orbite n : n²a", "Énergie du niveau n"]);
    var nt = k.note("", "ok");
    function syncN(){ var Sy = MR_SYS[sysS.value]; nS.el.min = Sy.nmin || 1; if (nS.value < (Sy.nmin || 1)) nS.set(Sy.nmin || 1); }
    var v = new Q4V(); v.a = 0.3; v.b = 0.55; v.f = 12; v.set();
    var drag = null, tt = 0, ang = 0;
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(type, p){
      if (type === "down") drag = {x:p.x, y:p.y};
      if (type === "drag" && drag){ v.a += (p.x - drag.x) * 0.01; v.b = q4clamp(v.b + (p.y - drag.y) * 0.01, 0.1, 1.45); v.set(); v.user = true; drag = {x:p.x, y:p.y}; }
      if (type === "up") drag = null;
    });
    var lp = k.loop(function(dt){ tt += dt; ang += dt * 1.3; if (!v.user){ v.a = 0.3 + 0.25 * Math.sin(tt * 0.2); v.set(); } k.redraw(); });
    lp.play();
    /* noyau dessiné en grappe de nucléons */
    function nucleus(ctx, x, y, r, Sy){
      if (Sy.nuc === "d" || Sy.nuc === "a"){
        var L = Sy.nuc === "d" ? [[-0.38, 0, "#e0533d"], [0.38, 0, "#8d9bb3"]] : [[-0.36, -0.3, "#e0533d"], [0.36, -0.3, "#8d9bb3"], [-0.36, 0.32, "#8d9bb3"], [0.36, 0.32, "#e0533d"]];
        L.forEach(function(q){ q4ball(ctx, x + q[0] * r, y + q[1] * r, r * 0.62, q[2]); });
      } else q4ball(ctx, x, y, r, Sy.nc);
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Sy = MR_SYS[sysS.value], n = Math.round(nS.value), i;
      var mu = mrMu(Sy), aeff = A0PM / mu / Sy.Z, rn = n * n * aeff, En = -RYEV * mu * Sy.Z * Sy.Z / (n * n);
      q4lab(ctx, W, H, "#18223c", "#060a14");
      /* ---- la scène : les deux corps et le centre de masse ---- */
      var barH = phone ? 66 : 62, sceneH = H - barH;
      v.sc = Math.min(W, sceneH * 1.5) * (phone ? 0.26 : 0.34); v.cx = W * (phone ? 0.44 : 0.5); v.cy = sceneH * 0.52; v.clear();
      var D = 1, fe = Sy.M / (Sy.m + Sy.M), fN = Sy.m / (Sy.m + Sy.M);
      var ex = D * fe * Math.cos(ang), ez = -D * fe * Math.sin(ang), nx = -D * fN * Math.cos(ang), nz = D * fN * Math.sin(ang);
      /* plan de l'orbite (anneaux) */
      function ring(rr, col, w, dash){ ctx.save(); ctx.beginPath(); for (var j = 0; j <= 72; j++){ var a2 = j / 72 * TAU, P = v.p(rr * Math.cos(a2), 0, rr * Math.sin(a2)); if (j) ctx.lineTo(P.x, P.y); else ctx.moveTo(P.x, P.y); } ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.restore(); }
      var gp = ctx.createRadialGradient(v.cx, v.cy, 0, v.cx, v.cy, v.sc * 1.3); gp.addColorStop(0, "rgba(90,130,210,.18)"); gp.addColorStop(1, "rgba(90,130,210,0)");
      ctx.save(); ctx.fillStyle = gp; ctx.beginPath(); for (i = 0; i <= 72; i++){ var a3 = i / 72 * TAU, P3 = v.p(1.25 * Math.cos(a3), 0, 1.25 * Math.sin(a3)); if (i) ctx.lineTo(P3.x, P3.y); else ctx.moveTo(P3.x, P3.y); } ctx.fill(); ctx.restore();
      ring(D * fe, q4a(Sy.lc, 0.55), 1.4, [5, 4]);
      if (fN * v.sc > 2) ring(D * fN, q4a(Sy.nc, 0.6), 1.4, [4, 4]);
      var rL = Sy.ll === "μ⁻" ? 0.075 : 0.06, rN = Sy.nuc === "e" ? 0.06 : Sy.nuc === "rb" ? 0.2 : Sy.nuc === "a" ? 0.13 : Sy.nuc === "d" ? 0.11 : 0.09;
      v.sprite(ex, 0, ez, function(cx2, q){ q4glow(cx2, q.x, q.y, rL * v.sc * q.s * 3, Sy.lc, 0.5); q4ball(cx2, q.x, q.y, rL * v.sc * q.s, Sy.lc); });
      v.sprite(nx, 0, nz, function(cx2, q){ q4glow(cx2, q.x, q.y, rN * v.sc * q.s * 2.2, Sy.nc, 0.35); nucleus(cx2, q.x, q.y, rN * v.sc * q.s, Sy); });
      /* centre de masse : croix */
      v.sprite(0, 0, 0, function(cx2, q){ cx2.save(); cx2.strokeStyle = "#ffd34d"; cx2.lineWidth = 2.2; var s3 = 7; cx2.beginPath(); cx2.moveTo(q.x - s3, q.y - s3); cx2.lineTo(q.x + s3, q.y + s3); cx2.moveTo(q.x + s3, q.y - s3); cx2.lineTo(q.x - s3, q.y + s3); cx2.stroke(); cx2.restore(); }, 0.5);
      v.render(ctx);
      /* étiquettes des corps */
      var pe = v.p(ex, 0, ez), pn = v.p(nx, 0, nz), pc = v.p(0, 0, 0);
      q4T(S, c, Sy.ll, pe.x, pe.y - rL * v.sc - 12, {size:q4fz(c, 12), color:"#dfeaff", halo:"#0c1222"});
      q4T(S, c, Sy.nl, pn.x, pn.y + rN * v.sc + 13, {size:q4fz(c, 12), color:"#ffd9cf", halo:"#0c1222"});
      q4tag(S, c, Sy.nom + " : μ = " + (mu > 0.999 && mu < 1 ? q4N(mu, 5) : q4S(mu, 4)) + " mₑ", 8, 16, {size:10.5, align:"left", weight:700});
      if (!phone) q4T(S, c, "glisse pour tourner", W - 10, 14, {size:q4fz(c, 10.5), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      /* loupe sur le noyau quand son cercle est trop petit pour être vu */
      var rpx = D * fN * v.sc;
      if (rpx < 6){
        var target = 26, mag = target / Math.max(rpx, 1e-9), p10 = Math.pow(10, Math.floor(Math.log10(mag))), mm = mag / p10; mag = (mm < 2 ? 1 : mm < 5 ? 2 : 5) * p10;
        var lr = phone ? 40 : 46, lx = W - lr - 12, ly = 30 + lr;
        ctx.save(); ctx.fillStyle = "rgba(6,10,20,.85)"; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, TAU); ctx.fill(); ctx.strokeStyle = "#c9d6ee"; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = "#8d97a8"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(lx - lr * 0.72, ly + lr * 0.72); ctx.lineTo(lx - lr * 1.05, ly + lr * 1.05); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr - 2, 0, TAU); ctx.clip();
        /* même projection que la scène, agrandie autour du centre de masse */
        ctx.strokeStyle = q4a(Sy.nc, 0.7); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.3; ctx.beginPath();
        for (i = 0; i <= 48; i++){ var a4 = i / 48 * TAU, Q4 = v.p(D * fN * Math.cos(a4), 0, D * fN * Math.sin(a4)); var qx = lx + (Q4.x - pc.x) * mag, qy = ly + (Q4.y - pc.y) * mag; if (i) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy); }
        ctx.stroke(); ctx.setLineDash([]);
        var npx = lx + (pn.x - pc.x) * mag, npy = ly + (pn.y - pc.y) * mag;
        ctx.strokeStyle = "#ffd34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx - 5, ly - 5); ctx.lineTo(lx + 5, ly + 5); ctx.moveTo(lx + 5, ly - 5); ctx.lineTo(lx - 5, ly + 5); ctx.stroke();
        q4ball(ctx, npx, npy, 5, Sy.nc); ctx.restore();
        q4T(S, c, "noyau × " + q4N(mag, 0).replace(/\B(?=(\d{3})+(?!\d))/g, " "), lx, ly + lr + 11, {size:q4fz(c, 10.5), color:"#c9d6ee", weight:700, halo:"#0c1222"});
      }
      /* ---- règle des tailles (échelle logarithmique) ---- */
      var bx0 = 16, bx1 = W - 16, by = sceneH + barH * 0.42, lo = -1, hi = 6;     /* log10 de la taille en pm : 0,1 pm → 1 µm */
      var X = function(pm){ return bx0 + (Math.log10(pm) - lo) / (hi - lo) * (bx1 - bx0); };
      ctx.save(); var gb = ctx.createLinearGradient(bx0, 0, bx1, 0); gb.addColorStop(0, "#2a3d63"); gb.addColorStop(1, "#5a4a7a"); ctx.fillStyle = gb; q4rr(ctx, bx0, by - 4, bx1 - bx0, 8, 4); ctx.fill(); ctx.restore();
      for (i = lo; i <= hi; i++){ var Xi = X(Math.pow(10, i)); S.draw.line(c, Xi, by - 6, Xi, by + 6, "rgba(200,215,240,.6)", 1); }
      var marks = [[52.9, "atome H"], [2000, "ADN (largeur)"], [1e5, "virus"]];
      if (phone) marks = [[52.9, "atome H"], [1e5, "virus"]];
      marks.forEach(function(mk){ var Xm = X(mk[0]); S.draw.line(c, Xm, by - 9, Xm, by - 4, "#9fb2d4", 1.5); q4T(S, c, mk[1], Xm, by - 16, {size:q4fz(c, 9.5), color:"#9fb2d4", weight:600}); });
      var Xr = X(q4clamp(rn, 0.1, 1e6));
      ctx.save(); ctx.fillStyle = "#ffd34d"; ctx.beginPath(); ctx.moveTo(Xr, by + 5); ctx.lineTo(Xr - 6, by + 14); ctx.lineTo(Xr + 6, by + 14); ctx.closePath(); ctx.fill(); ctx.restore();
      var rtxt = "orbite n = " + n + " : " + (rn < 1000 ? q4S(rn, 3) + " pm" : rn < 1e6 ? q4S(rn / 1000, 3) + " nm" : q4S(rn / 1e6, 3) + " µm");
      var tw = q4tw(c, rtxt, q4fz(c, 10.5), 800) + 8;
      q4T(S, c, rtxt, q4clamp(Xr, bx0 + tw / 2, bx1 - tw / 2), by + 23, {size:q4fz(c, 10.5), color:"#ffd34d", weight:800});

      /* ---- spectre ---- */
      var gc = g.ctx, GW = g.W, GH = g.H; gc.fillStyle = "#f4f6fa"; gc.fillRect(0, 0, GW, GH);
      var sx0 = 14, sx1 = GW - 14, sy0 = 26, sh = Math.round(GH * 0.26), l0 = 90, l1 = 1400;
      var LX = function(l){ return sx0 + (l - l0) / (l1 - l0) * (sx1 - sx0); };
      q4T(S, g, "Série n → 2 (Balmer pour H), dans le vide", sx0, 12, {size:q4fz(g, 11.5), color:"#13233a", align:"left"});
      gc.save(); q4rr(gc, sx0, sy0, sx1 - sx0, sh, 5); gc.fillStyle = "#0b0f1a"; gc.fill(); gc.clip();
      for (var lw = 380; lw <= 780; lw += 2){ gc.fillStyle = q4a(q4wl(lw), 0.25); gc.fillRect(LX(lw), sy0, LX(lw + 2) - LX(lw) + 0.5, sh); }
      /* raies de l'hydrogène (repère) en haut */
      for (var n2 = 3; n2 <= 8; n2++){ var lh = mrLam(MR_SYS.H, n2, 2); gc.fillStyle = "rgba(255,255,255,.55)"; gc.fillRect(LX(lh) - 0.5, sy0, 1, sh * 0.22); }
      /* raies du système choisi */
      var inR = 0;
      if (sysS.value !== "Rb"){
        for (n2 = 3; n2 <= 8; n2++){ var ls = mrLam(Sy, n2, 2); if (ls < l0 || ls > l1) continue; inR++;
          var cl = ls >= 380 && ls <= 780 ? q4wl(ls) : [235, 235, 255], aa = n2 === 3 ? 1 : 0.85 - (n2 - 3) * 0.1;
          gc.fillStyle = q4a(cl, aa); gc.fillRect(LX(ls) - 1.2, sy0 + sh * 0.28, 2.4, sh * 0.72); q4glow(gc, LX(ls), sy0 + sh * 0.64, 9, cl, 0.5 * aa); }
      }
      gc.restore();
      for (var tl = 200; tl <= 1400; tl += (phone ? 400 : 200)) q4T(S, g, String(tl), LX(tl), sy0 + sh + 9, {size:q4fz(g, 10), color:"#7b8694", weight:600});
      q4T(S, g, "λ (nm)", sx1, sy0 + sh + 21, {size:q4fz(g, 10.5), color:"#2c3a4e", align:"right"});
      q4T(S, g, "UV", LX(240), sy0 + sh + 21, {size:q4fz(g, 10), color:"#6a4bc9", weight:700});
      q4T(S, g, "visible", LX(580), sy0 + sh + 21, {size:q4fz(g, 10), color:"#2e9e6a", weight:700});
      q4T(S, g, "IR", LX(1100), sy0 + sh + 21, {size:q4fz(g, 10), color:"#b3402a", weight:700});
      if (sysS.value === "Rb") q4T(S, g, "pas de série n → 2 pour l'électron externe du rubidium", (sx0 + sx1) / 2, sy0 + sh * 0.62, {size:q4fz(g, 10.5), color:"#ffd27a", weight:700});
      else if (!inR) q4T(S, g, "raies à " + q4S(mrLam(Sy, 3, 2), 3) + " nm et moins : rayons X, hors du cadre", (sx0 + sx1) / 2, sy0 + sh * 0.62, {size:q4fz(g, 10.5), color:"#ffd27a", weight:700});
      /* loupe autour de Hα de l'hydrogène */
      var zy0 = sy0 + sh + 46, zh = GH - zy0 - 22, lH = mrLam(MR_SYS.H, 3, 2), half = 0.5, zx0 = sx0, zx1 = sx1;
      var ZX = function(l){ return zx0 + (l - (lH - half)) / (2 * half) * (zx1 - zx0); };
      q4T(S, g, "Loupe : Hα ± 0,5 nm", zx0, zy0 - 7, {size:q4fz(g, 10.5), color:"#13233a", align:"left"});
      gc.save(); q4rr(gc, zx0, zy0, zx1 - zx0, zh, 5); gc.fillStyle = "#14070a"; gc.fill(); gc.clip();
      gc.fillStyle = "rgba(255,255,255,.55)"; gc.fillRect(ZX(lH) - 0.7, zy0, 1.4, zh * 0.35);
      var lS = mrLam(Sy, 3, 2), inZ = Math.abs(lS - lH) < half && sysS.value !== "Rb";
      if (inZ){ gc.fillStyle = "#ff3b2a"; gc.fillRect(ZX(lS) - 2, zy0 + zh * 0.3, 4, zh * 0.7); q4glow(gc, ZX(lS), zy0 + zh * 0.65, 16, [255, 60, 40], 0.6); }
      gc.restore();
      q4T(S, g, "H", ZX(lH) + 5, zy0 + 8, {size:q4fz(g, 9.5), color:"#ffffff", align:"left", weight:700});
      for (var dz = -0.4; dz <= 0.41; dz += 0.2) q4T(S, g, (dz > 0.01 ? "+" : "") + q4N(dz, 1), ZX(lH + dz), zy0 + zh + 9, {size:q4fz(g, 9.5), color:"#7b8694", weight:600});
      var zmsg = sysS.value === "Rb" ? "" : inZ ? (Math.abs(lS - lH) < 1e-4 ? "" : "Δλ = " + q4N((lS - lH) * 1000, 0) + " pm") : "Hα à " + q4S(lS, 4) + " nm : hors de la loupe";
      if (zmsg) q4T(S, g, zmsg, zx1 - 4, zy0 - 7, {size:q4fz(g, 10.5), color:"#c0321d", align:"right"});

      /* ---- afficheurs ---- */
      ro.set(0, (mu > 0.999 && mu < 1 ? q4N(mu, 5) : q4S(mu, 4)) + " mₑ");
      ro.set(1, q4S(aeff, 4) + " pm");
      ro.set(2, sysS.value === "Rb" ? "—" : q4S(lS, 5) + " nm");
      ro.set(3, rn < 1000 ? q4S(rn, 4) + " pm" : rn < 1e6 ? q4S(rn / 1000, 3) + " nm" : q4S(rn / 1e6, 3) + " µm");
      ro.set(4, Math.abs(En) >= 0.01 ? q4S(En, 5) + " eV" : q4S(En * 1000, 4) + " meV");
      var msg = {
        H:"Le proton est 1836 fois plus lourd que l'électron : il décrit un cercle 1836 fois plus petit, invisible sans la loupe. μ diffère de mₑ de 0,05 %.",
        D:"Le deutéron est deux fois plus lourd que le proton : μ se rapproche encore de mₑ et la raie Hα se décale d'environ 0,18 nm vers le bleu. C'est ainsi que le deutérium a été découvert (Urey, 1932).",
        He:"He⁺ n'a qu'un électron : c'est un hydrogénoïde de charge Z = 2. Les énergies sont multipliées par Z² = 4 et les longueurs d'onde divisées par 4 environ : la série n → 2 passe dans l'ultraviolet.",
        Ps:"Électron et positron ont la même masse : ils tournent sur le même cercle autour du centre de masse, μ = mₑ/2. Les énergies sont divisées par deux, les longueurs d'onde doublées, la taille doublée.",
        Mu:"Le muon pèse 207 mₑ : l'atome est 186 fois plus petit et ses raies sont des rayons X. Le proton danse nettement autour du centre de masse.",
        Rb:"L'électron externe d'un rubidium très excité voit un cœur Rb⁺ de charge +1 : pour n grand (et l grand), il se comporte comme dans l'hydrogène. Modèle hydrogénoïde sans défaut quantique."
      }[sysS.value];
      nt.set(msg + (n >= 20 ? " À n = " + n + ", l'atome mesure " + (rn < 1e6 ? q4S(2 * rn / 1000, 3) + " nm" : q4S(2 * rn / 1e6, 3) + " µm") + " de diamètre : un atome de Rydberg géant, lié par seulement " + (Math.abs(En) >= 0.01 ? q4S(-En * 1000, 3) + " meV." : q4S(-En * 1000, 3) + " meV.") : ""), "ok");
    });
  }
});

})();
