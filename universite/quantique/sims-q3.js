/* Physique quantique · lot Q3 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq03 : pq-paquet-ondes-libre · pq-paquet-2d-fentes · pq-etats-stationnaires-horloges
   pq04 : pq-chambre-brouillard · pq-heisenberg-mesure · pq-photon-polariseur
   Aucune ressource externe : la 3D est une projection faite main (faces triées par profondeur). Aides préfixées « z ». */
(function(){
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018) ---------- */
var HP = 6.62607015e-34, HB = HP / TAU, ME = 9.1093837015e-31, QE = 1.602176634e-19, CL = 2.99792458e8;
var HBM_NM2FS = HB / ME * 1e3;          /* ħ/mₑ en nm²/fs = 0,115768 */
var MEC2 = 0.51099895, MPC2 = 938.27208816, MAC2 = 3727.3794066, MMUC2 = 105.6583755;  /* MeV */

/* ---------- petites aides ---------- */
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
/* d décimales gardées (zéros compris) */
function zF(x, d){ if (!isFinite(x)) return "—"; var s = Number(x).toFixed(d); if (/^-0(\.0*)?$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); }
var SUPD = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
function zsci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return zF(x, Math.max(0, d - e));
  return zF(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : String(e).split("").map(function(ch){ return SUPD[ch]; }).join(""));
}
function zT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function zrr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function zball(ctx, x, y, r, col, alpha){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, zshade(col, 0.75)); g.addColorStop(0.45, zshade(col, 0)); g.addColorStop(1, zshade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
function zglow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, za(col, a == null ? 0.8 : a)); g.addColorStop(1, za(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
/* couleur de phase (cercle chromatique) : 0 → rouge, π/2 → jaune-vert, π → cyan, −π/2 → violet */
var ZPH = (function(){
  var a = [];
  for (var i = 0; i < 360; i++){
    var h = i / 60, x = 1 - Math.abs(h % 2 - 1), r = 0, g = 0, b = 0;
    if (h < 1){ r = 1; g = x; } else if (h < 2){ r = x; g = 1; } else if (h < 3){ g = 1; b = x; }
    else if (h < 4){ g = x; b = 1; } else if (h < 5){ r = x; b = 1; } else { r = 1; b = x; }
    a.push([Math.round(40 + 215 * r), Math.round(40 + 215 * g), Math.round(40 + 215 * b)]);
  }
  return a;
})();
function zphc(ph){ var d = Math.round((ph / TAU * 360) % 360); if (d < 0) d += 360; return ZPH[d % 360]; }
/* petit disque des couleurs de phase */
function zphaseKey(S, c, x, y, r){
  var ctx = c.ctx;
  for (var i = 0; i < 72; i++){
    var a0 = i / 72 * TAU, a1 = (i + 1.2) / 72 * TAU;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, -a1, -a0); ctx.closePath(); ctx.fillStyle = za(zphc(a0), 1); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, TAU); ctx.fillStyle = "#0d1424"; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  zT(S, c, "phase", x, y + r + 9, {size:zfz(c, 10), color:"rgba(220,230,245,.8)", weight:700});
}
function zstep(span, n){ var s = span / n, p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
function zgauss(){ var u = 0, v = 0; while (u === 0) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }

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
Z3.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
Z3.prototype.sprite = function(x, y, z, fn, dz){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + (dz || 1e-3), fn:fn, v:v}); };
Z3.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    var q = {c:c, cull:true, alpha:o.alpha, line:o.line, glow:o.glow};
    if (o.after && o.afterFace === i) q.after = o.after;
    this.face(f.map(function(j){ return P[j]; }), o.cols ? o.cols[i] || col : col, q);
  }, this);
};
Z3.prototype.cyl = function(p0, p1, r, n, col, o){
  o = o || {}; n = n || 14;
  var ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], la = Math.hypot(ax[0], ax[1], ax[2]); ax = [ax[0] / la, ax[1] / la, ax[2] / la];
  var t = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  var u = [ax[1] * t[2] - ax[2] * t[1], ax[2] * t[0] - ax[0] * t[2], ax[0] * t[1] - ax[1] * t[0]], lu = Math.hypot(u[0], u[1], u[2]); u = [u[0] / lu, u[1] / lu, u[2] / lu];
  var w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
  var r1 = o.r1 == null ? r : o.r1, c = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2], q = {c:c, cull:!o.open, alpha:o.alpha, glow:o.glow, line:o.line};
  var A = [], B = [];
  for (var i = 0; i < n; i++){
    var th = i / n * TAU, cs = Math.cos(th), sn = Math.sin(th);
    A.push([p0[0] + r * (cs * u[0] + sn * w[0]), p0[1] + r * (cs * u[1] + sn * w[1]), p0[2] + r * (cs * u[2] + sn * w[2])]);
    B.push([p1[0] + r1 * (cs * u[0] + sn * w[0]), p1[1] + r1 * (cs * u[1] + sn * w[1]), p1[2] + r1 * (cs * u[2] + sn * w[2])]);
  }
  for (i = 0; i < n; i++){ var j = (i + 1) % n; this.face([A[i], A[j], B[j], B[i]], col, q); }
  if (!o.open){ this.face(A.slice(), o.cap0 || col, {c:c, cull:true, alpha:o.alpha, after:o.after0}); this.face(B.slice(), o.cap1 || col, {c:c, cull:true, alpha:o.alpha, after:o.after1}); }
};
Z3.prototype.render = function(ctx){
  var self = this, L = this.L, Lt = [-0.42, 0.62, 0.66], Ln = Math.hypot(Lt[0], Lt[1], Lt[2]), i;
  for (i = 0; i < L.length; i++){
    var it = L[i]; if (it.t) continue;
    var V = it.pts.map(function(p){ return self.rot(p[0], p[1], p[2]); });
    var a = V[0], b = V[1], c = V[2];
    var n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
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
    var dif = Math.max(0, nn[0] * Lt[0] + nn[1] * Lt[1] + nn[2] * Lt[2]) / Ln;
    var fill = d.o.glow ? d.col : zshade(d.col, -0.5 + 0.72 * dif);
    ctx.save(); if (d.o.alpha != null) ctx.globalAlpha = d.o.alpha;
    ctx.beginPath();
    d.V.forEach(function(v, j){ var p = self.pv(v); if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    if (!d.o.noline){ ctx.lineJoin = "round"; ctx.lineWidth = d.o.line ? 1.2 : 0.7; ctx.strokeStyle = d.o.line || fill; ctx.stroke(); }
    ctx.restore();
    if (d.o.after) d.o.after(ctx, d);
  }
};
/* point de l'écran → point du plan horizontal y = y0 (Newton, la perspective est faible) */
Z3.prototype.unprojY = function(px, py, y0, gx, gz){
  var x = gx || 0, z = gz || 0;
  for (var it = 0; it < 6; it++){
    var p = this.p(x, y0, z), px1 = this.p(x + 0.01, y0, z), pz1 = this.p(x, y0, z + 0.01);
    var a = (px1.x - p.x) / 0.01, b = (pz1.x - p.x) / 0.01, c = (px1.y - p.y) / 0.01, d = (pz1.y - p.y) / 0.01, det = a * d - b * c;
    if (Math.abs(det) < 1e-9) break;
    var ex = px - p.x, ey = py - p.y; x += (d * ex - b * ey) / det; z += (-c * ex + a * ey) / det;
  }
  return [x, z];
};
/* glisser pour tourner la vue ; onDrag("down", p) peut capturer le geste (renvoie true) */
function zorbit(c, v, k, lim, onDrag){
  var st = {lx:null, own:false};
  c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
  c.pointer(function(type, p){
    if (type === "down"){
      st.own = !!(onDrag && onDrag("down", p));
      if (!st.own){ st.lx = p.x; st.ly = p.y; c.cv.style.cursor = "grabbing"; }
      return;
    }
    if (type === "drag"){
      if (st.own){ onDrag("drag", p); return; }
      if (st.lx == null) return;
      v.a += (p.x - st.lx) * 0.01; v.b = Math.max(lim ? lim[0] : -1.4, Math.min(lim ? lim[1] : 1.4, v.b + (p.y - st.ly) * 0.01));
      if (lim && lim[2] != null) v.a = Math.max(lim[2], Math.min(lim[3], v.a));
      st.lx = p.x; st.ly = p.y; v.set(); v.user = true; k.redraw();
    }
    if (type === "move" && onDrag){ var h = onDrag("hover", p); c.cv.style.cursor = h ? "pointer" : "grab"; }
    if (type === "up"){ if (st.own && onDrag) onDrag("up", p); st.lx = null; st.own = false; c.cv.style.cursor = "grab"; }
  });
  return st;
}
function zlab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* étiquette claire sur fond sombre, bornée au cadre ; renvoie sa boîte */
function ztag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = zfz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  bx = Math.max(3, Math.min(c.W - w - 3, bx)); var by = Math.max(3, Math.min(c.H - h - 3, y - h / 2));
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.74)"; zrr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  zT(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}
/* largeur d'un texte */
function zW(c, s, size, weight){ var ctx = c.ctx; ctx.save(); ctx.font = (weight || 800) + " " + size + "px Mulish, system-ui, sans-serif"; var w = ctx.measureText(s).width; ctx.restore(); return w; }
/* table de laboratoire (plateau bois) */
function zbench(v, x0, x1, z0, z1, y){
  v.box(x0, y - 0.18, z0, x1, y, z1, "#7a5232", {cols:[null, null, null, "#9c6b40"]});
}
/* tracé d'un petit repère 2D clair : cadre, graduations ; renvoie {X, Y} */
function zframe(S, c, x, y, w, h, x0, x1, y0, y1, o){
  o = o || {}; var g = c.ctx;
  g.save(); g.fillStyle = o.bg || "#ffffff"; zrr(g, x, y, w, h, 8); g.fill(); g.strokeStyle = "#dfe4ec"; g.lineWidth = 1; g.stroke(); g.restore();
  var L = x + (o.l == null ? 34 : o.l), R = x + w - (o.r == null ? 10 : o.r), T = y + (o.t == null ? 22 : o.t), B = y + h - (o.b == null ? 24 : o.b);
  var ax = {L:L, R:R, T:T, B:B, X:function(u){ return L + (u - x0) / (x1 - x0) * (R - L); }, Y:function(u){ return B - (u - y0) / (y1 - y0) * (B - T); }};
  g.save(); g.strokeStyle = "#a3adba"; g.lineWidth = 1; g.beginPath(); g.moveTo(L, B + 0.5); g.lineTo(R, B + 0.5); g.stroke();
  if (o.sx){
    var n = 0;
    for (var u = Math.ceil(x0 / o.sx - 1e-9) * o.sx; u <= x1 + 1e-9 && n < 60; u += o.sx, n++){
      var X = ax.X(u); g.beginPath(); g.moveTo(X, B); g.lineTo(X, B + 4); g.stroke();
      zT(S, c, zN(u, o.dx == null ? 1 : o.dx), X, B + 12, {size:zfz(c, 10), color:"#5f6b7a", weight:600});
    }
  }
  g.restore();
  if (o.title) zT(S, c, o.title, x + 10, y + 12, {size:zfz(c, 11.5), color:"#13233a", align:"left"});
  if (o.xl) zT(S, c, o.xl, R, B + (o.sx ? 23 : 12), {size:zfz(c, 10), color:"#5f6b7a", align:"right", weight:700});
  return ax;
}

/* =====================================================================
   1. Paquet d'ondes libre (pq03)
   ===================================================================== */
var PL_PART = {
  e:{nom:"électron", r:1, src:"canon à électrons", col:"#7fd4ff"},
  mu:{nom:"muon", r:206.768283, src:"faisceau de muons", col:"#c9a6ff"},
  p:{nom:"proton", r:1836.15267343, src:"source de protons", col:"#ff9f7a"}
};
var PL_L = 40, PL_X0 = 6, PL_XEND = 34;   /* domaine (nm), départ et arrivée du centre */
SFA.sim({
  id:"pq-paquet-ondes-libre", ch:"pq03", tag:"Paquet d'ondes",
  titre:"Construire un paquet d'ondes et le regarder s'étaler",
  resume:"Des ondes planes s'additionnent en un paquet : il avance à la vitesse de groupe, ses crêtes deux fois moins vite, et il s'étale.",
  but:"Regarde les ondes planes s'additionner, puis le paquet partir dans le tube. Change k₀, la largeur de départ σ₀, la particule ou le nombre d'ondes. Glisse sur la scène pour tourner autour du tube.",
  aRetenir:"Le paquet avance à v_g = ħk₀/m, ses crêtes à v_φ = ħk₀/2m (énergie comptée sans l'énergie de masse : v_φ n'est pas observable), et plus il est étroit au départ, plus il s'étale vite.",
  piege:"La vitesse de la particule est la vitesse de groupe du paquet, pas la vitesse de ses crêtes.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 300 : 380), g = k.canvas(phone ? 330 : 230);
    var nS = k.slider("Ondes planes additionnées N", 1, 81, 2, 1, "", function(){ auto = false; restart(false); });
    var kS = k.slider("Nombre d'onde moyen k₀", 3, 8, 0.1, 5, "nm⁻¹", function(){ restart(false); });
    var aS = k.slider("Largeur de départ σ₀", 0.6, 3, 0.1, 1, "nm", function(){ restart(false); });
    var pS = k.seg("Particule", [["e", "Électron"], ["mu", "Muon"], ["p", "Proton"]], "e", function(){ restart(false); });
    k.button("Rejouer", function(){ auto = true; restart(true); }, true);
    var pB = k.button("Pause", function(){ paused = !paused; pB.textContent = paused ? "Reprendre" : "Pause"; });
    var ro = k.readouts(["Longueur d'onde λ₀ = 2π/k₀", "Vitesse de groupe ħk₀/m", "Vitesse de phase ħk₀/2m", "Largeur σ(t)", "Temps t"]);
    var nt = k.note("", "ok");
    var auto = true, paused = false, phase = "build", hold = 0, tfs = 0, Nsh = 1, bt = 0, xc = PL_X0;
    var NX = phone ? 420 : 560, re = new Float64Array(NX), im = new Float64Array(NX), rho = new Float64Array(NX);
    function P(){
      var pr = PL_PART[pS.value], hm = HBM_NM2FS / pr.r, k0 = kS.value, s0 = aS.value;
      var vg = hm * k0, tau = 2 * s0 * s0 / hm, tend = (PL_XEND - PL_X0) / vg;
      return {pr:pr, hm:hm, k0:k0, s0:s0, vg:vg, vp:vg / 2, tau:tau, tend:tend};
    }
    /* composantes : k_j régulièrement espacés sur ±5σ_k, poids gaussiens, somme des poids = 1 */
    function comps(p, N){
      var sk = 1 / (2 * p.s0), dk = N > 1 ? 10 * sk / (N - 1) : 0, ks = [], cs = [], Z = 0;
      for (var j = 0; j < N; j++){ var kj = p.k0 + (j - (N - 1) / 2) * dk, cj = Math.exp(-Math.pow((kj - p.k0) * p.s0, 2)); ks.push(kj); cs.push(cj); Z += cj; }
      for (j = 0; j < N; j++) cs[j] /= Z;
      return {k:ks, c:cs, dk:dk};
    }
    function psiAt(p, C, x, t){
      var r = 0, i = 0;
      for (var j = 0; j < C.k.length; j++){ var ph = C.k[j] * (x - PL_X0) - p.hm * C.k[j] * C.k[j] / 2 * t; r += C.c[j] * Math.cos(ph); i += C.c[j] * Math.sin(ph); }
      return [r, i];
    }
    function field(p, C, t){
      var dx = PL_L / (NX - 1), j, i;
      for (i = 0; i < NX; i++){ re[i] = 0; im[i] = 0; }
      for (j = 0; j < C.k.length; j++){
        var kj = C.k[j], ph0 = kj * (0 - PL_X0) - p.hm * kj * kj / 2 * t;
        var zr = C.c[j] * Math.cos(ph0), zi = C.c[j] * Math.sin(ph0), wr = Math.cos(kj * dx), wi = Math.sin(kj * dx);
        for (i = 0; i < NX; i++){
          re[i] += zr; im[i] += zi;
          var nr = zr * wr - zi * wi; zi = zr * wi + zi * wr; zr = nr;
        }
      }
      for (i = 0; i < NX; i++) rho[i] = re[i] * re[i] + im[i] * im[i];
    }
    function sigT(p, t){ return p.s0 * Math.sqrt(1 + Math.pow(t / p.tau, 2)); }
    /* suit une crête (phase nulle) par la méthode de Newton */
    function trackCrest(p, C, t){
      var xg = PL_X0 + p.vg * t, sg = sigT(p, t), lam = TAU / p.k0;
      if (xc < xg - 1.4 * sg) xc += Math.ceil((xg + 0.6 * sg - xc) / lam) * lam;
      if (xc > xg + 2 * sg) xc = xg;
      for (var it = 0; it < 3; it++){
        var a = psiAt(p, C, xc, t), b = psiAt(p, C, xc + 0.01, t);
        var f0 = Math.atan2(a[1], a[0]), f1 = Math.atan2(b[1], b[0]), kd = (((f1 - f0 + PI) % TAU + TAU) % TAU - PI) / 0.01;
        if (!(kd > 0.3)) kd = p.k0;
        xc -= f0 / kd;
      }
    }
    function restart(build){
      tfs = 0; xc = PL_X0; hold = 0;
      if (build){ phase = "build"; Nsh = 1; bt = 0; nS.set(1); }
      else { phase = "wait"; Nsh = nS.value; }
      k.redraw();
    }
    var v = new Z3(); v.a = -0.42; v.b = 0.3; v.f = 30; v.set();
    zorbit(c, v, k, [-0.25, 1.2]);
    var lp = k.loop(function(dt, t){
      var p = P();
      if (!paused){
        if (phase === "build"){
          bt += dt;
          var n = Math.min(81, 1 + 2 * Math.floor(bt / 0.085));
          if (n !== Nsh){ Nsh = n; nS.set(n); }
          if (n >= 81){ phase = "wait"; hold = 0; }
        } else if (phase === "wait"){ hold += dt; if (hold > 1.1) phase = "run"; }
        else if (phase === "run"){
          tfs += dt * p.tend / 7;
          if (tfs >= p.tend){ tfs = p.tend; phase = "end"; hold = 0; }
        } else if (phase === "end"){ hold += dt; if (hold > 1.6){ tfs = 0; xc = PL_X0; phase = "wait"; hold = 0.4; } }
      }
      if (!v.user){ v.a = -0.42 + 0.12 * Math.sin(t * 0.22); v.set(); }
      k.redraw();
    });
    lp.play();
    var GX = function(x){ return (x - PL_L / 2) / 4; };   /* nm → unités de la scène */
    k.draw(function(){
      var p = P(), C = comps(p, phase === "build" ? Nsh : nS.value), ctx = c.ctx, W = c.W, H = c.H, i;
      field(p, C, tfs);
      if (phase === "run" || phase === "end") trackCrest(p, C, tfs); else xc = PL_X0;
      var A = 1.38, xg = PL_X0 + p.vg * tfs, sg = sigT(p, tfs);
      zlab(ctx, W, H, "#1d2843", "#0a0f1c");
      v.sc = Math.min(W / (phone ? 14.6 : 13.0), H / 5.2); v.cx = W * 0.5 + (phone ? 4 : 14); v.cy = H * 0.49; v.clear();
      /* table, supports */
      zbench(v, -7.2, 6.4, -2.6, 2.2, -2.05);
      [-4.2, 0, 4.2].forEach(function(xx){ v.box(xx - 0.18, -2.05, -0.22, xx + 0.18, -1.5, 0.22, "#5d6878"); v.box(xx - 0.3, -1.62, -0.5, xx + 0.3, -1.5, 0.5, "#6c7686"); });
      /* tableau de mesure derrière le tube : |ψ|² */
      v.box(-5.4, -1.85, -2.45, 5.4, 1.75, -2.3, "#26324a", {line:"#46546e", afterFace:1, after:function(cx2){
        var X0 = v.p(GX(0), -1.55, -2.3), pts = [], pk = 0;
        for (i = 0; i < NX; i += 2) pk = Math.max(pk, rho[i]);
        cx2.save(); cx2.beginPath();
        for (i = 0; i < NX; i += 2){ var q = v.p(GX(i / (NX - 1) * PL_L), -1.55 + 2.9 * rho[i], -2.3); pts.push(q); if (i) cx2.lineTo(q.x, q.y); else cx2.moveTo(q.x, q.y); }
        var Xe = v.p(GX(PL_L), -1.55, -2.3);
        cx2.lineTo(Xe.x, Xe.y); cx2.lineTo(X0.x, X0.y); cx2.closePath(); cx2.fillStyle = "rgba(255,170,60,.28)"; cx2.fill();
        cx2.beginPath(); pts.forEach(function(q, j){ if (j) cx2.lineTo(q.x, q.y); else cx2.moveTo(q.x, q.y); }); cx2.strokeStyle = "#ffb14a"; cx2.lineWidth = 1.6; cx2.stroke();
        cx2.strokeStyle = "rgba(255,255,255,.18)"; cx2.lineWidth = 1; cx2.beginPath(); cx2.moveTo(X0.x, X0.y); cx2.lineTo(Xe.x, Xe.y); cx2.stroke();
        cx2.restore();
      }});
      v.box(-0.12, -2.05, -2.5, 0.12, -1.85, -2.25, "#4a5566");
      /* canon et détecteur */
      v.cyl([-6.9, 0, 0], [-5.9, 0, 0], 0.75, 18, "#5d6b80", {cap0:"#3a4556"});
      v.cyl([-5.9, 0, 0], [-5.4, 0, 0], 0.38, 14, "#9aa7b8", {cap1:"#0b0f16"});
      v.box(-6.7, -2.05, -0.3, -6.1, -0.7, 0.3, "#4a5566");
      v.cyl([5.4, 0, 0], [5.75, 0, 0], 1.5, 22, "#2f6b4a", {cap0:"#163a26"});
      v.box(5.45, -2.05, -0.3, 5.7, -1.45, 0.3, "#4a5566");
      /* axe du tube */
      v.cyl([-5.4, 0, 0], [5.4, 0, 0], 0.025, 6, "#8090a8", {glow:true, open:true});
      /* ruban ψ(x, t) : rayon = |ψ|, orientation = phase */
      var step = 1;
      for (i = 0; i < NX - 1; i += step){
        var m0 = Math.sqrt(rho[i]), m1 = Math.sqrt(rho[i + 1]);
        if (m0 < 0.006 && m1 < 0.006) continue;
        var x0 = GX(i / (NX - 1) * PL_L), x1 = GX((i + 1) / (NX - 1) * PL_L), col = zphc(Math.atan2(im[i], re[i]));
        v.face([[x0, 0, 0], [x0, A * re[i], A * im[i]], [x1, A * re[i + 1], A * im[i + 1]], [x1, 0, 0]], "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")", {glow:true, alpha:0.92});
      }
      /* marqueurs : centre du paquet (v_g) et une crête (v_φ) */
      if (xg <= PL_L) v.sprite(GX(xg), 0, 0, function(cx2, q){ zglow(cx2, q.x, q.y, 16 * q.s, "#4f9dff", 0.6); zball(cx2, q.x, q.y, 6 * q.s, "#3d8bff"); }, 0.6);
      if (phase !== "build"){
        var a0 = psiAt(p, C, xc, tfs), mc = Math.hypot(a0[0], a0[1]);
        v.sprite(GX(xc), A * mc, 0, function(cx2, q){ zglow(cx2, q.x, q.y, 14 * q.s, "#ff4b4b", 0.6); zball(cx2, q.x, q.y, 5.5 * q.s, "#ff3b3b"); }, 0.6);
      }
      /* tube de verre */
      v.cyl([-5.4, 0, 0], [5.4, 0, 0], 1.5, 22, "#bfe3ff", {glow:true, alpha:0.06, open:true});
      v.render(ctx);
      /* reflets du verre */
      var t1 = v.p(-5.2, 1.42, 0.45), t2 = v.p(5.2, 1.42, 0.45);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.stroke(); ctx.restore();
      /* étiquettes */
      var gq = v.p(-6.6, 0.95, 0), dq = v.p(5.6, 1.85, 0), bq = v.p(-4.6, 1.95, -2.35);
      ztag(S, c, p.pr.src, gq.x, gq.y - 6, {size:11});
      if (!phone) ztag(S, c, "détecteur", dq.x, dq.y - 6, {size:11});
      ztag(S, c, "|ψ|² (densité)", bq.x, bq.y, {size:10.5, color:"#ffcf8a"});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      /* légende */
      var ly = H - 16, lx = 10, l1 = "● centre (v_g)", l2 = "● une crête (v_φ)";
      var b1 = ztag(S, c, l1, lx, ly, {size:10.5, align:"left", color:"#8cc0ff"});
      if (phase !== "build") ztag(S, c, l2, b1.x + b1.w + 6, ly, {size:10.5, align:"left", color:"#ff8a8a"});
      zphaseKey(S, c, W - 26, H - 38, phone ? 13 : 15);
      var nb = phase === "build" ? Nsh : nS.value;
      ztag(S, c, nb === 1 ? "1 onde plane" : nb + " ondes planes", 10, 18, {size:11.5, align:"left", color:"#ffd34d"});

      /* ---- graphe |ψ|²(x) et relation de dispersion ω(k) ---- */
      var gx = g.ctx, GW = g.W, GH = g.H;
      gx.fillStyle = "#f4f6fa"; gx.fillRect(0, 0, GW, GH);
      var wa = phone ? GW - 12 : Math.round(GW * 0.62), ha = phone ? Math.round(GH * 0.52) : GH - 12;
      var ax = zframe(S, g, 6, 6, wa, ha, 0, PL_L, 0, 1.3, {sx:phone ? 10 : 5, dx:0, xl:"x (nm)", title:"Densité de probabilité |ψ(x, t)|²", l:12, t:36});
      /* départ en pointillé */
      var r0 = function(x){ return Math.exp(-Math.pow(x - PL_X0, 2) / (2 * p.s0 * p.s0)); };
      gx.save(); gx.setLineDash([4, 4]); gx.strokeStyle = "#9aa6b6"; gx.lineWidth = 1.3; gx.beginPath();
      for (i = 0; i <= 200; i++){ var xx = i / 200 * PL_L, yy = ax.Y(r0(xx)); if (i) gx.lineTo(ax.X(xx), yy); else gx.moveTo(ax.X(xx), yy); }
      gx.stroke(); gx.restore();
      gx.save(); gx.beginPath(); gx.moveTo(ax.X(0), ax.Y(0));
      for (i = 0; i < NX; i++) gx.lineTo(ax.X(i / (NX - 1) * PL_L), ax.Y(Math.min(1.3, rho[i])));
      gx.lineTo(ax.X(PL_L), ax.Y(0)); gx.closePath(); gx.fillStyle = "rgba(255,160,50,.30)"; gx.fill();
      gx.beginPath(); for (i = 0; i < NX; i++){ var yv = ax.Y(Math.min(1.3, rho[i])); if (i) gx.lineTo(ax.X(i / (NX - 1) * PL_L), yv); else gx.moveTo(ax.X(0), yv); }
      gx.strokeStyle = "#e0662a"; gx.lineWidth = 1.8; gx.stroke(); gx.restore();
      function vline(x, col){ if (x < 0 || x > PL_L) return; var X = ax.X(x); gx.save(); gx.strokeStyle = col; gx.lineWidth = 1.6; gx.beginPath(); gx.moveTo(X, ax.T); gx.lineTo(X, ax.B); gx.stroke(); gx.restore(); }
      vline(xg, "#2f6fd6"); if (phase !== "build") vline(xc, "#d33a3a");
      zT(S, g, "départ", ax.X(PL_X0), ax.T - 2, {size:zfz(g, 10), color:"#7b8694", weight:700});
      /* ω(k) */
      var bx = phone ? 6 : wa + 12, by = phone ? ha + 12 : 6, bw = phone ? GW - 12 : GW - wa - 18, bh = phone ? GH - ha - 18 : GH - 12;
      var kmx = 11, wmx = p.hm * kmx * kmx / 2;
      var bx2 = zframe(S, g, bx, by, bw, bh, 0, kmx, 0, wmx * 1.05, {sx:2, dx:0, xl:"k (nm⁻¹)", title:"Dispersion ω = ħk²/2m", l:12});
      /* poids des ondes planes */
      var cmax = 0; C.c.forEach(function(cc){ cmax = Math.max(cmax, cc); });
      C.k.forEach(function(kk, j){ if (kk < 0 || kk > kmx) return; var X = bx2.X(kk), hh = C.c[j] / cmax * (bx2.B - bx2.T) * 0.33; gx.fillStyle = "rgba(255,160,50,.75)"; gx.fillRect(X - 1, bx2.B - hh, 2, hh); });
      gx.save(); gx.beginPath(); for (i = 0; i <= 80; i++){ var kk = i / 80 * kmx, Y = bx2.Y(p.hm * kk * kk / 2); if (i) gx.lineTo(bx2.X(kk), Y); else gx.moveTo(bx2.X(kk), Y); }
      gx.strokeStyle = "#13233a"; gx.lineWidth = 2; gx.stroke();
      gx.beginPath(); gx.rect(bx2.L, bx2.T, bx2.R - bx2.L, bx2.B - bx2.T); gx.clip();
      var w0 = p.hm * p.k0 * p.k0 / 2;
      gx.strokeStyle = "#2f6fd6"; gx.lineWidth = 1.6; gx.beginPath(); gx.moveTo(bx2.X(p.k0 - 3), bx2.Y(w0 - 3 * p.vg)); gx.lineTo(bx2.X(p.k0 + 3), bx2.Y(w0 + 3 * p.vg)); gx.stroke();
      gx.strokeStyle = "#d33a3a"; gx.setLineDash([5, 4]); gx.beginPath(); gx.moveTo(bx2.X(0), bx2.Y(0)); gx.lineTo(bx2.X(p.k0), bx2.Y(w0)); gx.stroke(); gx.setLineDash([]);
      gx.restore();
      S.draw.dot(g, bx2.X(p.k0), bx2.Y(w0), 5, "#13233a");
      zT(S, g, "pente v_g", bx2.L + 6, bx2.T + 6, {size:zfz(g, 10.5), color:"#2f6fd6", align:"left"});
      zT(S, g, "pente v_φ", bx2.L + 6, bx2.T + 20, {size:zfz(g, 10.5), color:"#d33a3a", align:"left"});

      /* ---- afficheurs ---- */
      var ps = p.tend > 3000, tu = ps ? "ps" : "fs", tf = ps ? 1e-3 : 1;
      ro.set(0, zN(TAU / p.k0, 2) + " nm");
      ro.set(1, zsci(p.vg * 1e6, 2, true) + " m/s");
      ro.set(2, zsci(p.vp * 1e6, 2, true) + " m/s");
      var nb2 = phase === "build" ? Nsh : nS.value;
      ro.set(3, nb2 === 1 ? "infinie (onde plane)" : zN(sg, 2) + " nm");
      ro.set(4, zN(tfs * tf, tfs * tf < 10 ? 2 : 1) + " " + tu);
      if (phase === "build" || nb2 < 31) nt.set(nb2 === 1 ? "Une seule onde plane : |ψ| est le même partout, la particule n'est localisée nulle part." :
        "Avec " + nb2 + " ondes planes de k voisins, elles s'additionnent près du départ et se détruisent ailleurs" + (nb2 < 31 ? " ; avec peu d'ondes, le motif se répète tous les 2π/Δk = " + zN(TAU / C.dk, 0) + " nm." : "."), "warn");
      else nt.set("Le centre (bleu) avance à v_g, la crête (rouge) deux fois moins vite : les crêtes glissent vers l'arrière du paquet. Étalement : σ(t) = σ₀√(1 + (t/τ)²), τ = 2mσ₀²/ħ = " + zN(p.tau * tf, 2) + " " + tu + ".", "ok");
    });
  }
});

/* =====================================================================
   2. Paquet d'ondes 2D contre une fente, deux fentes, un réseau (pq03)
   Schéma explicite de Visscher (parties réelle et imaginaire décalées d'un demi-pas),
   unités de grille : ħ = mₑ = 1, maille 0,1 nm, pas de temps 0,25 (= 0,0216 fs).
   ===================================================================== */
var F2 = {NX:240, NY:200, DX:0.1, WALL:110, WT:3, SCR:214, X0:55, SX:15, SY:45, DT:0.25, ABS:16, XA:133, NA:181};
var F2_TU = ME * 1e-20 / HB * 1e15;   /* unité de temps de grille en fs (m dx²/ħ) = 0,0864 fs */
var F2_LE = HP / Math.sqrt(2 * ME * QE) * 1e9;   /* λ (nm) = 1,2264/√E(eV) pour l'électron (non relativiste) */
function f2Mask(kind, d, a){
  /* tableau NY : 1 = ouvert dans le mur */
  var o = new Uint8Array(F2.NY), c = F2.NY / 2, w = Math.round(a / F2.DX), cs = [];
  if (kind === "une") cs = [0];
  else if (kind === "deux") cs = [-d / 2, d / 2];
  else cs = [-2 * d, -d, 0, d, 2 * d];
  cs.forEach(function(y){ var j0 = Math.round(c + y / F2.DX - w / 2); for (var j = j0; j < j0 + w; j++) if (j >= 0 && j < F2.NY) o[j] = 1; });
  return o;
}
SFA.sim({
  id:"pq-paquet-2d-fentes", ch:"pq03", tag:"Diffraction",
  titre:"Un paquet d'ondes de matière contre une fente, deux fentes, un réseau",
  resume:"Un paquet d'électrons en 2D fonce vers un mur percé : il se diffracte, se partage entre les ouvertures et ses morceaux interfèrent.",
  but:"Regarde le paquet frapper le mur : une petite partie passe, se diffracte et ses morceaux interfèrent. Choisis une fente, deux fentes ou un réseau, change l'écart et l'énergie, et glisse sur la scène pour tourner la vue.",
  aRetenir:"Derrière deux fentes, les morceaux du paquet interfèrent : maxima dans les directions sin θ = nλ/d, avec λ = h/p.",
  piege:"Le paquet ne se coupe pas en deux électrons : c'est une seule onde de probabilité qui passe par les deux fentes.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 420), g = k.canvas(phone ? 200 : 190);
    var mode = "deux";
    var oS = k.seg("Mur", [["une", "Une fente"], ["deux", "Deux fentes"], ["reseau", "Réseau (5 fentes)"]], "deux", function(v){ mode = v; showSl(); restart(); });
    var dS = k.slider("Écart entre fentes d", 2, 4, 0.1, 3, "nm", function(){ restart(); });
    var aS = k.slider("Largeur de la fente a", 1, 3, 0.1, 2, "nm", function(){ restart(); });
    var eS = k.slider("Énergie de l'électron E", 0.5, 3, 0.1, 1, "eV", function(){ restart(); });
    var amT = k.toggle("Relief amplifié ×4 derrière le mur", true);
    k.button("Relancer le paquet", function(){ restart(); }, true);
    var ro = k.readouts(["Longueur d'onde λ = h/p", "Ouverture", "Premier maximum (sin θ = λ/d)", "Probabilité passée", "Temps t"]);
    var nt = k.note("", "ok");
    function showSl(){ dS.el.parentNode.style.display = mode === "une" ? "none" : ""; aS.el.parentNode.style.display = mode === "une" ? "" : "none"; }
    showSl();
    var NX = F2.NX, NY = F2.NY, N = NX * NY, NA = F2.NA;
    var R = new Float64Array(N), I = new Float64Array(N), T1 = new Float64Array(N), M = new Float64Array(N), Wm = new Uint8Array(N);
    var ang = new Float64Array(NA), CS = new Float64Array(NA * NY), SN = new Float64Array(NA * NY);
    var st = {n:0, k0:0, N0:1, absR:0, done:0, op:null};
    for (var j0 = 0; j0 < NY; j0++) for (var i0 = 0; i0 < NX; i0++){
      var dd = Math.min(i0, NX - 1 - i0, j0, NY - 1 - j0), m = 1;
      if (dd < F2.ABS){ var u = (F2.ABS - dd) / F2.ABS; m = 1 - 0.06 * u * u; }
      M[j0 * NX + i0] = m;
    }
    function aOpen(){ return mode === "une" ? aS.value : 0.6; }
    function lam(){ return F2_LE / Math.sqrt(eS.value); }
    function restart(){
      var op = f2Mask(mode, dS.value, aOpen()), i, j, a;
      st.op = op;
      for (j = 0; j < NY; j++) for (i = 0; i < NX; i++) Wm[j * NX + i] = (i >= F2.WALL && i < F2.WALL + F2.WT && !op[j]) ? 1 : 0;
      var k0 = TAU / (lam() / F2.DX), El = 1 - Math.cos(k0), n0 = 0, cy = NY / 2;
      st.k0 = k0;
      for (j = 0; j < NY; j++) for (i = 0; i < NX; i++){
        var id = j * NX + i, env = Math.exp(-Math.pow(i - F2.X0, 2) / (4 * F2.SX * F2.SX) - Math.pow(j - cy, 2) / (4 * F2.SY * F2.SY));
        var ph = k0 * (i - F2.X0);
        R[id] = Wm[id] ? 0 : env * Math.cos(ph); I[id] = Wm[id] ? 0 : env * Math.sin(ph - El * F2.DT / 2);
        n0 += R[id] * R[id] + I[id] * I[id];
      }
      /* table des ondes planes de sortie : k_y = k₀ sin θ, θ de −90° à 90° */
      for (a = 0; a < NA; a++){ var ky = k0 * Math.sin((a / (NA - 1) - 0.5) * PI); for (j = 0; j < NY; j++){ CS[a * NY + j] = Math.cos(ky * (j - cy)); SN[a * NY + j] = Math.sin(ky * (j - cy)); } }
      ang = new Float64Array(NA);
      st.N0 = n0; st.n = 0; st.absR = 0; st.done = 0;
      k.redraw();
    }
    function Hf(f, out){
      for (var j = 0; j < NY; j++){
        var r = j * NX;
        for (var i = 0; i < NX; i++){
          var id = r + i; if (Wm[id]){ out[id] = 0; continue; }
          var s = -4 * f[id];
          if (i > 0) s += f[id - 1]; if (i < NX - 1) s += f[id + 1];
          if (j > 0) s += f[id - NX]; if (j < NY - 1) s += f[id + NX];
          out[id] = -0.5 * s;
        }
      }
    }
    function step(){
      var dt = F2.DT, id, j, a;
      Hf(I, T1); for (id = 0; id < N; id++) R[id] += dt * T1[id];
      Hf(R, T1); for (id = 0; id < N; id++) I[id] -= dt * T1[id];
      for (id = 0; id < N; id++){
        var m = M[id]; if (m === 1) continue;
        if (id % NX > F2.WALL){ st.absR += (R[id] * R[id] + I[id] * I[id]) * (1 - m * m); }
        R[id] *= m; I[id] *= m;
      }
      /* directions de sortie : transformée de Fourier en y sur la colonne XA, accumulée dans le temps */
      if (st.n % 2 === 0){
        for (a = 0; a < NA; a++){
          var sr = 0, si = 0, o = a * NY;
          for (j = 0; j < NY; j++){ var q = j * NX + F2.XA, cc = CS[o + j], sn = SN[o + j]; sr += R[q] * cc + I[q] * sn; si += I[q] * cc - R[q] * sn; }
          ang[a] += sr * sr + si * si;
        }
      }
      st.n++;
    }
    function passed(){
      var s = 0;
      for (var j = 0; j < NY; j++) for (var i = F2.WALL + F2.WT; i < NX; i++){ var id = j * NX + i; s += R[id] * R[id] + I[id] * I[id]; }
      return (s + st.absR) / st.N0;
    }
    function left(){ var s = 0; for (var id = 0; id < N; id++) s += R[id] * R[id] + I[id] * I[id]; return s / st.N0; }
    restart();
    var v = new Z3(); v.a = 0.55; v.b = 0.6; v.f = 34; v.set();
    zorbit(c, v, k, [0.25, 1.25]);
    var hold = 0, tex = document.createElement("canvas"); tex.width = NX; tex.height = NY;
    var tctx = tex.getContext("2d"), img = tctx.createImageData(NX, NY), Pd = 0, Lf = 1;
    var lp = k.loop(function(dt, t){
      if (st.done){ hold += dt; if (hold > 2.2){ hold = 0; restart(); } }
      else {
        var nst = Math.max(2, Math.min(7, Math.round(2.3 / st.k0)));
        for (var s = 0; s < nst; s++) step();
        if (st.n % 12 < nst){ Pd = passed(); Lf = left(); }
        if (Lf < 0.03 || st.n > 9000) st.done = 1;
      }
      if (!v.user){ v.a = 0.55 + 0.1 * Math.sin(t * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    var SXs = 12 / NX, SZs = 10 / NY;
    function WX(i){ return -6 + i * SXs; }
    function WZ(j){ return -5 + j * SZs; }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, j, id, amp = amT.value ? 4 : 1, l = lam(), d = mode === "une" ? 0 : dS.value;
      zlab(ctx, W, H, "#1b2640", "#080d18");
      v.sc = Math.min(W / (phone ? 15.5 : 14.2), H / 8.2); v.cx = W * 0.5; v.cy = H * (phone ? 0.5 : 0.52);
      var leftNear = v.rot(-6, 0, 0)[2] > v.rot(6, 0, 0)[2], zNear = v.rot(0, 0, 1)[2] > v.rot(0, 0, -1)[2];
      var op = st.op, xw0 = WX(F2.WALL), xw1 = WX(F2.WALL + F2.WT) + 0.02, xs = WX(F2.SCR) + 0.05;
      function gun(){ v.clear(); v.cyl([-7.6, 0.55, 0], [-6.5, 0.55, 0], 0.5, 16, "#6b7a8e", {cap1:"#0b0f16"}); v.box(-7.3, -0.75, -0.25, -6.8, 0.1, 0.25, "#4a5566"); v.render(ctx); }
      function wall(){
        v.clear(); var jj = 0;
        while (jj < NY){
          if (op[jj]){ jj++; continue; }
          var j1 = jj; while (j1 < NY && !op[j1]) j1++;
          v.box(xw0, 0, WZ(jj), xw1, 1.15, WZ(j1), "#9aa6b8", {line:"#c3ccd8"});
          jj = j1;
        }
        v.render(ctx);
      }
      function screen(){
        v.clear();
        v.box(xs, 0, -5, xs + 0.14, 2.3, 5, "#173323", {afterFace:4, after:function(cx2){
          cx2.save(); cx2.beginPath();
          for (j = 0; j < NY; j++){ var q0 = j * NX + F2.SCR, rh = (R[q0] * R[q0] + I[q0] * I[q0]) * amp, q = v.p(xs, 0.06 + Math.min(2.1, 9 * rh), WZ(j)); if (j) cx2.lineTo(q.x, q.y); else cx2.moveTo(q.x, q.y); }
          cx2.strokeStyle = "#7dffb0"; cx2.lineWidth = 1.8; cx2.shadowColor = "#3dff8a"; cx2.shadowBlur = 8; cx2.stroke(); cx2.restore();
        }});
        v.render(ctx);
      }
      /* socle */
      v.clear(); v.box(-6.4, -0.75, -5.4, 6.6, -0.02, 5.4, "#2a3346", {cols:[null, null, null, "#1a2132"]}); v.render(ctx);
      if (!leftNear) gun();
      /* plan texturé : couleur = phase, luminosité = √densité */
      var D = img.data;
      for (j = 0; j < NY; j++) for (i = 0; i < NX; i++){
        id = j * NX + i; var p4 = ((NY - 1 - j) * NX + i) * 4;
        if (Wm[id]){ D[p4] = 120; D[p4 + 1] = 130; D[p4 + 2] = 145; D[p4 + 3] = 255; continue; }
        var rh = (R[id] * R[id] + I[id] * I[id]) * (i > F2.WALL ? amp : 1), b = Math.min(1, Math.sqrt(rh) * 1.25);
        var col = zphc(Math.atan2(I[id], R[id]));
        D[p4] = 12 + col[0] * b; D[p4 + 1] = 18 + col[1] * b; D[p4 + 2] = 32 + col[2] * b; D[p4 + 3] = 255;
      }
      tctx.putImageData(img, 0, 0);
      var A0 = v.p(-6, 0, -5), A1 = v.p(6, 0, -5), A2 = v.p(-6, 0, 5), dpr = ctx.canvas.width / W;
      ctx.save(); ctx.setTransform(dpr * (A1.x - A0.x) / NX, dpr * (A1.y - A0.y) / NX, dpr * (A0.x - A2.x) / NY, dpr * (A0.y - A2.y) / NY, dpr * A2.x, dpr * A2.y);
      ctx.imageSmoothingEnabled = true; ctx.drawImage(tex, 0, 0); ctx.restore();
      /* directions des maxima prévus, au sol */
      if (mode !== "une" && l < d){
        var L0 = (F2.SCR - F2.WALL - F2.WT) * F2.DX;
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = "rgba(255,230,120,.75)"; ctx.lineWidth = 1.3;
        [-1, 1].forEach(function(n){
          var th = Math.asin(n * l / d), yy = L0 * Math.tan(th), jy = NY / 2 + yy / F2.DX;
          var xe = jy < 0 || jy > NY ? WX(F2.WALL + F2.WT) + (NY / 2 * F2.DX) / Math.abs(Math.tan(th)) * 10 * SXs : xs, je = Math.max(0, Math.min(NY, jy));
          var q0 = v.p(xw1, 0.01, 0), q1 = v.p(xe, 0.01, WZ(je)); ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke();
        });
        ctx.restore();
      }
      /* relief : profils le long de x, en deux moitiés (de part et d'autre du mur) */
      var rows = [], Hs = 1.5, stp = phone ? 4 : 3;
      for (j = 2; j < NY; j += phone ? 5 : 4) rows.push(j);
      if (!zNear) rows.reverse();
      function relief(i0, i1){
        ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
        rows.forEach(function(jr){
          var z = WZ(jr), pts = [], any = false;
          for (i = i0; i <= i1; i += stp){
            id = jr * NX + Math.min(i, NX - 1); var rh = Wm[id] ? 0 : (R[id] * R[id] + I[id] * I[id]) * (i > F2.WALL ? amp : 1);
            var h = Hs * Math.min(1.7, rh); if (h > 0.025) any = true;
            pts.push([i, h, Math.atan2(I[id], R[id])]);
          }
          if (!any) return;
          ctx.beginPath(); var b0 = v.p(WX(pts[0][0]), 0, z); ctx.moveTo(b0.x, b0.y);
          pts.forEach(function(q){ var pp = v.p(WX(q[0]), q[1], z); ctx.lineTo(pp.x, pp.y); });
          var b1 = v.p(WX(pts[pts.length - 1][0]), 0, z); ctx.lineTo(b1.x, b1.y); ctx.closePath();
          ctx.fillStyle = "rgba(9,14,27,.86)"; ctx.fill();
          for (var q = 0; q < pts.length - 1; q++){
            var a = pts[q], b = pts[q + 1]; if (a[1] < 0.025 && b[1] < 0.025) continue;
            var p1 = v.p(WX(a[0]), a[1], z), p2 = v.p(WX(b[0]), b[1], z), col = zphc(a[2]);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")"; ctx.lineWidth = phone ? 1.4 : 1.8; ctx.stroke();
          }
        });
        ctx.restore();
      }
      if (leftNear){ screen(); relief(F2.WALL + F2.WT, NX - 1); wall(); relief(0, F2.WALL); gun(); }
      else { relief(0, F2.WALL); wall(); relief(F2.WALL + F2.WT, NX - 1); screen(); }
      /* étiquettes */
      var wq = v.p((xw0 + xw1) / 2, 1.5, -4.4), sq = v.p(xs, 2.65, -3.8), gq = v.p(-7.0, 1.25, 0);
      ztag(S, c, mode === "une" ? "une fente" : mode === "deux" ? "deux fentes" : "réseau", wq.x, wq.y, {size:11});
      ztag(S, c, "écran", sq.x, sq.y, {size:11, color:"#9dffc4"});
      if (!phone) ztag(S, c, "canon à électrons", gq.x, gq.y, {size:11});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      if (amT.value) ztag(S, c, "relief ×4 derrière le mur", 8, H - 16, {size:10.5, align:"left", color:"#ffd34d"});
      zphaseKey(S, c, W - 26, H - 38, phone ? 13 : 15);

      /* ---- graphe : directions de sortie (comme sur un écran très éloigné) ---- */
      var gx = g.ctx, GW = g.W, GH = g.H, a, am = 0, P = new Float64Array(NA);
      for (a = 0; a < NA; a++){ var th0 = (a / (NA - 1) - 0.5) * PI; P[a] = ang[a] * Math.cos(th0) * Math.cos(th0); am = Math.max(am, P[a]); }
      gx.fillStyle = "#f4f6fa"; gx.fillRect(0, 0, GW, GH);
      var ax = zframe(S, g, 6, 6, GW - 12, GH - 12, -90, 90, 0, 1.18, {sx:phone ? 45 : 15, dx:0, xl:"direction θ (°)", title:"Directions de sortie (écran très éloigné)", l:12});
      if (am > 0){
        gx.save(); gx.beginPath(); gx.moveTo(ax.X(-90), ax.Y(0));
        for (a = 0; a < NA; a++) gx.lineTo(ax.X(a / (NA - 1) * 180 - 90), ax.Y(P[a] / am));
        gx.lineTo(ax.X(90), ax.Y(0)); gx.closePath(); gx.fillStyle = "rgba(47,180,110,.25)"; gx.fill();
        gx.beginPath(); for (a = 0; a < NA; a++){ var yv = ax.Y(P[a] / am); if (a) gx.lineTo(ax.X(a / (NA - 1) * 180 - 90), yv); else gx.moveTo(ax.X(-90), yv); }
        gx.strokeStyle = "#1f9a5a"; gx.lineWidth = 2; gx.stroke(); gx.restore();
      }
      var marks = [], lab = "";
      if (mode !== "une"){ for (var n = -3; n <= 3; n++) if (Math.abs(n * l / d) < 1) marks.push(Math.asin(n * l / d) * 180 / PI); lab = "- - - maxima prévus : sin θ = nλ/d"; }
      else { for (n = -3; n <= 3; n++) if (n && Math.abs(n * l / aS.value) < 1) marks.push(Math.asin(n * l / aS.value) * 180 / PI); lab = marks.length ? "- - - minima prévus : sin θ = nλ/a" : "λ > a : pas de minimum"; }
      marks.forEach(function(th1){ var Xp = ax.X(th1); gx.save(); gx.setLineDash([4, 4]); gx.strokeStyle = "#d9a21b"; gx.lineWidth = 1.3; gx.beginPath(); gx.moveTo(Xp, ax.T); gx.lineTo(Xp, ax.B); gx.stroke(); gx.restore(); });
      zT(S, g, lab, GW - 14, phone ? 34 : 18, {size:zfz(g, 10.5), color:"#b9860f", align:"right", bg:"rgba(255,255,255,.92)"});

      /* ---- afficheurs ---- */
      ro.set(0, zN(l, 2) + " nm");
      ro.set(1, mode === "une" ? "a = " + zN(aS.value, 1) + " nm" : "d = " + zN(dS.value, 1) + " nm, a = 0,6 nm");
      if (mode === "une") ro.set(2, "—"); else ro.set(2, l < d ? "θ = " + zN(Math.asin(l / d) * 180 / PI, 1) + "°" : "aucun (λ > d)");
      ro.set(3, zN(100 * Pd, 1) + " %");
      ro.set(4, zN(st.n * F2.DT * F2_TU, 1) + " fs");
      var msg = mode === "une" ? "Une fente de largeur a : la tache centrale s'élargit quand a diminue." :
        mode === "deux" ? "Les deux morceaux qui sortent des fentes se recouvrent : là où leurs phases (couleurs) s'opposent, la densité s'annule." :
        "Avec 5 fentes, les maxima restent aux mêmes angles que pour deux fentes, mais ils sont plus fins.";
      nt.set(msg + " L'essentiel du paquet est réfléchi par le mur.", "ok");
    });
  }
});

/* =====================================================================
   3. États stationnaires : une phase qui tourne, une densité immobile (pq03)
   Puits infini de largeur L : ψₙ = √(2/L) sin(nπx/L), Eₙ = n²h²/(8mL²).
   ===================================================================== */
var ES_COL = ["#ff5a5a", "#ffb43c", "#4fd27a", "#5aa8ff"];
/* ⟨a|x|b⟩ dans le puits [0, L] (a ≠ b) */
function esXab(a, b, L){ if (a === b) return L / 2; return (a + b) % 2 ? -8 * a * b * L / (PI * PI * Math.pow(a * a - b * b, 2)) : 0; }
function esClock(S, c, x, y, r, ang, col, on, lab, sub){
  var ctx = c.ctx;
  ctx.save();
  var g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r * 1.15);
  g.addColorStop(0, "#f4f6fa"); g.addColorStop(0.55, "#9aa6b8"); g.addColorStop(1, "#3a4556");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, TAU); ctx.fill();
  var f = ctx.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r);
  f.addColorStop(0, on ? "#ffffff" : "#d9dee6"); f.addColorStop(1, on ? "#e6ebf2" : "#aeb7c4");
  ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r * 0.95, 0, TAU); ctx.fill();
  if (on){ ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1;
  for (var i = 0; i < 12; i++){ var a = i / 12 * TAU, r0 = i % 3 ? r * 0.8 : r * 0.7; ctx.beginPath(); ctx.moveTo(x + r0 * Math.cos(a), y + r0 * Math.sin(a)); ctx.lineTo(x + r * 0.9 * Math.cos(a), y + r * 0.9 * Math.sin(a)); ctx.stroke(); }
  /* aiguille : angle mathématique = phase (sens trigonométrique), l'écran a y vers le bas */
  var hx = x + r * 0.78 * Math.cos(ang), hy = y - r * 0.78 * Math.sin(ang);
  ctx.strokeStyle = on ? col : "#8a94a3"; ctx.lineWidth = Math.max(2, r * 0.13); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(hx, hy); ctx.stroke();
  zball(ctx, x, y, r * 0.12, "#2a3446");
  ctx.restore();
  if (lab) zT(S, c, lab, x, y + r * 1.12 + 9, {size:zfz(c, 10.5), color:on ? "#eef3fb" : "#8d99ab", weight:800});
  if (sub) zT(S, c, sub, x, y + r * 1.12 + 22, {size:zfz(c, 9.5), color:on ? "#c3d0e4" : "#748196", weight:600});
}
SFA.sim({
  id:"pq-etats-stationnaires-horloges", ch:"pq03", tag:"États stationnaires",
  titre:"États stationnaires : une phase qui tourne, une densité immobile",
  resume:"Un électron dans une boîte : chaque état stationnaire tourne en phase comme une horloge, mais sa densité reste immobile, jusqu'à ce qu'on en mélange deux.",
  but:"Regarde l'onde tourner dans la boîte comme une corde à sauter : la densité au fond ne bouge pas. Mélange un deuxième état avec le curseur : la densité se met à osciller d'un bord à l'autre. Glisse sur la scène pour tourner la vue.",
  aRetenir:"Un état stationnaire évolue en e^(−iEt/ħ) : sa densité est constante ; un mélange de deux états oscille à la fréquence (E_B − E_A)/h.",
  piege:"La phase d'un seul état ne se voit pas : seule la différence de phase entre deux états fait bouger la densité.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 360 : 410), g = k.canvas(phone ? 330 : 210);
    var aS = k.seg("État A", [["1", "n = 1"], ["2", "n = 2"], ["3", "n = 3"], ["4", "n = 4"]], "1", function(){ hist = []; });
    var bS = k.seg("État B", [["1", "n = 1"], ["2", "n = 2"], ["3", "n = 3"], ["4", "n = 4"]], "2", function(){ hist = []; });
    var wS = k.slider("Part de l'état B dans le mélange", 0, 100, 1, 0, "%", function(){ hist = []; });
    var lS = k.slider("Largeur de la boîte L", 0.5, 2, 0.05, 1, "nm", function(){ hist = []; });
    k.button("Mélange 50 / 50", function(){ wS.set(50); hist = []; }, true);
    k.button("État pur", function(){ wS.set(0); hist = []; });
    var ro = k.readouts(["Énergie E_A", "Énergie E_B", "Période de la densité h/|E_B − E_A|", "Position moyenne de l'électron", "Temps t"]);
    var nt = k.note("", "ok");
    var tfs = 0, hist = [], NX = phone ? 120 : 160;
    function P(){
      var L = lS.value, a = +aS.value, b = +bS.value, w = wS.value / 100;
      if (a === b) w = 0;
      var E1 = HP * HP / (8 * ME * L * L * 1e-18) / QE;   /* eV */
      var Ea = a * a * E1, Eb = b * b * E1;
      return {L:L, a:a, b:b, ca:Math.sqrt(1 - w), cb:Math.sqrt(w), w:w, E1:E1, Ea:Ea, Eb:Eb, T1:HP / (E1 * QE) * 1e15};
    }
    function om(E){ return E * QE / HB * 1e-15; }   /* rad/fs */
    function psi(p, u, t){
      var pa = -om(p.Ea) * t, pb = -om(p.Eb) * t, sa = Math.sin(p.a * PI * u), sb = Math.sin(p.b * PI * u);
      return [p.ca * sa * Math.cos(pa) + p.cb * sb * Math.cos(pb), p.ca * sa * Math.sin(pa) + p.cb * sb * Math.sin(pb)];
    }
    function xmean(p, t){ return p.L / 2 + 2 * p.ca * p.cb * Math.cos((om(p.Eb) - om(p.Ea)) * t) * esXab(p.a, p.b, p.L); }
    var v = new Z3(); v.a = -0.5; v.b = 0.36; v.f = 26; v.set();
    zorbit(c, v, k, [-0.1, 1.2]);
    var lp = k.loop(function(dt, t){
      var p = P();
      tfs += dt * p.T1 / 4;            /* une période de l'état n = 1 en 4 s */
      hist.push([tfs, xmean(p, tfs) / p.L]); while (hist.length && tfs - hist[0][0] > p.T1 * 2.2) hist.shift();
      if (!v.user){ v.a = -0.5 + 0.14 * Math.sin(t * 0.25); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var p = P(), ctx = c.ctx, W = c.W, H = c.H, i, A = 1.25;
      zlab(ctx, W, H, "#1d2843", "#0a0f1c");
      /* ---- horloges ---- */
      var ncl = 5, rc = phone ? 17 : 22, top = phone ? 30 : 36, gap = Math.min(phone ? 70 : 104, (W - 30) / ncl);
      var x0 = W / 2 - gap * (ncl - 1) / 2;
      for (i = 1; i <= 4; i++){
        var on = (i === p.a && p.ca > 0.001) || (i === p.b && p.cb > 0.001);
        esClock(S, c, x0 + (i - 1) * gap, top, rc, -om(i * i * p.E1) * tfs, ES_COL[i - 1], on, "n = " + i, zN(i * i * p.E1, 2) + " eV");
      }
      var mix = p.cb > 0.001 && p.ca > 0.001;
      var xr = x0 + 4 * gap;
      esClock(S, c, xr, top, rc, mix ? -(om(p.Eb) - om(p.Ea)) * tfs : 0, "#c9a6ff", mix, "B − A", mix ? "phase relative" : "état pur");
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(xr - gap / 2, top - rc - 4); ctx.lineTo(xr - gap / 2, top + rc + 22); ctx.stroke(); ctx.restore();
      /* ---- boîte en 3D ---- */
      var top3 = top + rc + (phone ? 32 : 34);
      v.sc = Math.min(W / (phone ? 10.6 : 12.5), (H - top3) / 5.0); v.cx = W * 0.5; v.cy = top3 + (H - top3) * 0.5; v.clear();
      v.box(-5.6, -2.3, -2.2, 5.6, -1.75, 2.2, "#3b4a66", {cols:[null, null, null, "#4a5b7c"]});
      /* barrières (murs de potentiel infinis) */
      v.box(-4.55, -1.75, -1.9, -4.1, 2.0, 1.9, "#d08a3c", {alpha:0.92, line:"#f0b46a"});
      v.box(4.1, -1.75, -1.9, 4.55, 2.0, 1.9, "#d08a3c", {alpha:0.92, line:"#f0b46a"});
      /* densité au fond de la boîte */
      var U = [], Rr = [], Ii = [];
      for (i = 0; i <= NX; i++){ var u = i / NX, q = psi(p, u, tfs); U.push(u); Rr.push(q[0]); Ii.push(q[1]); }
      v.face([[-4.1, -1.74, -1.9], [4.1, -1.74, -1.9], [4.1, -1.74, 1.9], [-4.1, -1.74, 1.9]], "#1a2235", {glow:true, after:function(cx2){
        cx2.save(); cx2.beginPath();
        for (var j = 0; j <= NX; j++){ var rr = Rr[j] * Rr[j] + Ii[j] * Ii[j], q = v.p(-4.1 + 8.2 * U[j], -1.74, -0.9 * rr); if (j) cx2.lineTo(q.x, q.y); else cx2.moveTo(q.x, q.y); }
        for (j = NX; j >= 0; j--){ var r2 = Rr[j] * Rr[j] + Ii[j] * Ii[j], q2 = v.p(-4.1 + 8.2 * U[j], -1.74, 0.9 * r2); cx2.lineTo(q2.x, q2.y); }
        cx2.closePath(); cx2.fillStyle = "rgba(255,170,60,.55)"; cx2.shadowColor = "#ffb14a"; cx2.shadowBlur = 12; cx2.fill(); cx2.restore();
      }});
      /* axe et onde */
      v.cyl([-4.1, 0, 0], [4.1, 0, 0], 0.02, 6, "#8090a8", {glow:true, open:true});
      for (i = 0; i < NX; i++){
        var xa = -4.1 + 8.2 * U[i], xb = -4.1 + 8.2 * U[i + 1], col = zphc(Math.atan2(Ii[i], Rr[i]));
        if (Rr[i] * Rr[i] + Ii[i] * Ii[i] < 1e-5 && Rr[i + 1] * Rr[i + 1] + Ii[i + 1] * Ii[i + 1] < 1e-5) continue;
        v.face([[xa, 0, 0], [xa, A * Rr[i], A * Ii[i]], [xb, A * Rr[i + 1], A * Ii[i + 1]], [xb, 0, 0]], "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")", {glow:true, alpha:0.9});
      }
      /* position moyenne : petite bille au fond */
      var xm = xmean(p, tfs) / p.L;
      v.sprite(-4.1 + 8.2 * xm, -1.7, 0, function(cx2, q){ zglow(cx2, q.x, q.y, 14 * q.s, "#ffffff", 0.5); zball(cx2, q.x, q.y, 5 * q.s, "#e8eef8"); }, 0.3);
      v.render(ctx);
      var lq = v.p(-4.3, 2.3, 0), rq = v.p(4.3, 2.3, 0), fq = v.p(0, -1.74, 2.0);
      if (!phone){ ztag(S, c, "mur", lq.x, lq.y, {size:10.5, color:"#ffd7a8"}); ztag(S, c, "mur", rq.x, rq.y, {size:10.5, color:"#ffd7a8"}); }
      ztag(S, c, "|ψ|² au fond de la boîte", fq.x, fq.y + 14, {size:10.5, color:"#ffcf8a"});
      zT(S, c, "glisse pour tourner", W - 10, H - 12, {size:zfz(c, 10.5), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      zphaseKey(S, c, 26, H - 34, phone ? 12 : 14);

      /* ---- graphe |ψ|²(x) et position moyenne ---- */
      var gx = g.ctx, GW = g.W, GH = g.H, L = p.L;
      gx.fillStyle = "#f4f6fa"; gx.fillRect(0, 0, GW, GH);
      var wa = phone ? GW - 12 : Math.round(GW * 0.56), ha = phone ? Math.round(GH * 0.52) : GH - 12;
      var ymax = 4.2 / L;
      var ax = zframe(S, g, 6, 6, wa, ha, 0, L, 0, ymax, {sx:zstep(L, 4), dx:2, xl:"x (nm)", title:"|ψ(x, t)|² (nm⁻¹)", l:12});
      function curve(f, col, wd, dash, fill){
        gx.save(); gx.beginPath();
        for (var j = 0; j <= 200; j++){ var uu = j / 200, yy = ax.Y(Math.min(ymax, f(uu))); if (j) gx.lineTo(ax.X(uu * L), yy); else gx.moveTo(ax.X(0), yy); }
        if (fill){ gx.lineTo(ax.X(L), ax.Y(0)); gx.lineTo(ax.X(0), ax.Y(0)); gx.closePath(); gx.fillStyle = fill; gx.fill(); }
        else { gx.setLineDash(dash || []); gx.strokeStyle = col; gx.lineWidth = wd; gx.stroke(); }
        gx.restore();
      }
      var dens = function(uu){ var q = psi(p, uu, tfs); return 2 / L * (q[0] * q[0] + q[1] * q[1]); };
      curve(dens, null, 0, null, "rgba(255,160,50,.28)");
      if (p.ca > 0.001) curve(function(uu){ return 2 / L * p.ca * p.ca * Math.pow(Math.sin(p.a * PI * uu), 2); }, ES_COL[p.a - 1], 1.4, [4, 4]);
      if (p.cb > 0.001) curve(function(uu){ return 2 / L * p.cb * p.cb * Math.pow(Math.sin(p.b * PI * uu), 2); }, ES_COL[p.b - 1], 1.4, [4, 4]);
      curve(dens, "#e0662a", 2.2);
      var Xm = ax.X(xm * L); gx.save(); gx.strokeStyle = "#13233a"; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(Xm, ax.T + 14); gx.lineTo(Xm, ax.B); gx.stroke(); gx.restore();
      zT(S, g, "x moyen", Xm, ax.T + 6, {size:zfz(g, 10.5), color:"#13233a"});
      /* x moyen au cours du temps */
      var bx = phone ? 6 : wa + 12, by = phone ? ha + 12 : 6, bw = phone ? GW - 12 : GW - wa - 18, bh = phone ? GH - ha - 18 : GH - 12;
      var span = p.T1 * 2.2, tu = span > 2000 ? 1e-3 : 1, un = tu === 1 ? "fs" : "ps";
      var t0 = Math.max(0, tfs - span), bx2 = zframe(S, g, bx, by, bw, bh, t0 * tu, (t0 + span) * tu, 0, 1, {sx:zstep(span * tu, 4), dx:1, xl:"t (" + un + ")", title:"Position moyenne / L", l:30});
      [0, 0.5, 1].forEach(function(yv){ var Y = bx2.Y(yv); gx.save(); gx.strokeStyle = "#e6eaf0"; gx.beginPath(); gx.moveTo(bx2.L, Y); gx.lineTo(bx2.R, Y); gx.stroke(); gx.restore(); zT(S, g, zN(yv, 1), bx2.L - 5, Y, {size:zfz(g, 10), color:"#5f6b7a", align:"right", weight:600}); });
      if (hist.length > 1){
        gx.save(); gx.beginPath();
        hist.forEach(function(h, j){ var X = bx2.X(h[0] * tu), Y = bx2.Y(h[1]); if (j) gx.lineTo(X, Y); else gx.moveTo(X, Y); });
        gx.strokeStyle = "#7a4fd6"; gx.lineWidth = 2; gx.stroke(); gx.restore();
      }

      /* ---- afficheurs ---- */
      var dE = Math.abs(p.Eb - p.Ea), tf = p.T1 > 2000 ? 1e-3 : 1;
      ro.set(0, "n = " + p.a + " : " + zN(p.Ea, 3) + " eV");
      ro.set(1, "n = " + p.b + " : " + zN(p.Eb, 3) + " eV");
      ro.set(2, mix ? zN(HP / (dE * QE) * 1e15, 2) + " fs" : "infinie (état pur)");
      ro.set(3, zN(xm * L, 3) + " nm");
      ro.set(4, zN(tfs, tfs < 10 ? 2 : 1) + " fs");
      if (!mix) nt.set("État stationnaire n = " + (p.ca > 0.001 ? p.a : p.b) + " : l'onde tourne en bloc (horloge à " + zN(HP / ((p.ca > 0.001 ? p.Ea : p.Eb) * QE) * 1e15, 2) + " fs par tour), mais |ψ|² au fond de la boîte ne bouge pas.", "ok");
      else if ((p.a + p.b) % 2 === 0) nt.set("États A et B de même parité : |ψ|² change de forme mais reste symétrique, la position moyenne reste au milieu de la boîte.", "warn");
      else nt.set("Quand l'aiguille B − A pointe vers la droite (phases égales), la densité penche à gauche ; vers la gauche, elle penche à droite. La position moyenne oscille entre " + zN(p.L / 2 - Math.abs(2 * p.ca * p.cb * esXab(p.a, p.b, p.L)), 3) + " et " + zN(p.L / 2 + Math.abs(2 * p.ca * p.cb * esXab(p.a, p.b, p.L)), 3) + " nm.", "ok");
    });
  }
});

/* =====================================================================
   4. Chambre à brouillard (pq04)
   Unités internes : cm (1 cm = 1/3 d'unité de scène). Rayon de courbure r = p/(|q|B) : r (cm) = p (MeV/c) / (2,998 |z| B (T)).
   ===================================================================== */
var CB = {S:1 / 3, X:8, Z:5.5, H:7};
var CB_TA = 5.49, CB_PA = Math.sqrt(2 * MAC2 * CB_TA + CB_TA * CB_TA);   /* α de l'américium 241 (et du radon 222) */
var CB_RA = 0.318 * Math.pow(CB_TA, 1.5);                                 /* règle de Geiger : portée dans l'air (cm) */
var CB_PMU = 4000;                                                         /* muon cosmique typique : 4 GeV/c */
function cbPe(T){ return Math.sqrt(T * T + 2 * T * MEC2); }               /* p (MeV/c) d'un électron d'énergie cinétique T (MeV) */
function cbR(p, z, B){ return B > 0 ? p / (2.99792458 * Math.abs(z) * B) : Infinity; }   /* cm */
/* énergie d'un β du ⁹⁰Sr (Q = 0,546 MeV) ou de son descendant ⁹⁰Y (Q = 2,28 MeV) : forme simplifiée √u (1 − u)² */
function cbBetaT(){
  var Q = Math.random() < 0.5 ? 0.546 : 2.28;
  for (var i = 0; i < 200; i++){ var u = Math.random(); if (Math.random() * 0.33 < Math.sqrt(u) * (1 - u) * (1 - u)) return Math.max(0.03, u * Q); }
  return 0.3 * Q;
}
var CB_SCR = {
  aucun:{nom:"aucun écran", col:null, stopA:false, stopB:false},
  papier:{nom:"feuille de papier", col:"#f2efe6", stopA:true, stopB:false},
  alu:{nom:"aluminium 5 mm", col:"#c4ccd6", stopA:true, stopB:true},
  plomb:{nom:"plomb 5 mm", col:"#59606b", stopA:true, stopB:true}
};
SFA.sim({
  id:"pq-chambre-brouillard", ch:"pq04", tag:"Mesure de la position",
  titre:"Chambre à brouillard : voir la trace d'une particule",
  resume:"Dans une vapeur d'alcool sursaturée, chaque particule chargée laisse une traînée de gouttelettes : traits épais des α, fils sinueux des β, longues traces des muons cosmiques.",
  but:"Regarde les traces naître au fond de la chambre. Glisse la source pour la déplacer, change de source ou d'écran, allume le champ magnétique, et glisse ailleurs sur la scène pour tourner autour de la chambre.",
  aRetenir:"Une trace est une suite de mesures de position : chaque gouttelette marque un endroit où la particule a ionisé la vapeur.",
  piege:"Les α sont les plus ionisants mais les moins pénétrants : une feuille de papier les arrête, et le champ magnétique les courbe à peine.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 360 : 450);
    var srcS = k.seg("Source", [["a", "Américium 241 (α)"], ["b", "Strontium 90 (β)"], ["0", "Aucune"]], "a", function(){ k.redraw(); });
    var scS = k.seg("Écran devant la source", [["aucun", "Aucun"], ["papier", "Papier"], ["alu", "Alu 5 mm"], ["plomb", "Plomb 5 mm"]], "aucun");
    var bS = k.slider("Champ magnétique B (vertical)", 0, 1, 0.05, 0, "T");
    k.button("Effacer les traces", function(){ tracks = []; cnt = {a:0, b:0, m:0}; }, true);
    var ro = k.readouts(["Rayonnement de la source", "Portée dans l'air", "Rayon de courbure de l'α", "Rayon de courbure d'un β de 1 MeV", "Traces comptées α · β · μ"]);
    var nt = k.note("", "ok");
    var tracks = [], now = 0, acc = {s:0, m:0, rn:0}, cnt = {a:0, b:0, m:0};
    var src = {x:-5, z:0.5};   /* cm */
    function inBox(x, z){ return Math.abs(x) < CB.X - 0.2 && Math.abs(z) < CB.Z - 0.2; }
    /* écran : plaque perpendiculaire à l'axe de la source (+x), à 1,5 cm, largeur 4,5 cm */
    function hitScreen(x0, z0, x1, z1){ var xs = src.x + 1.5; if ((x0 - xs) * (x1 - xs) > 0) return false; var zz = z0 + (z1 - z0) * (xs - x0) / ((x1 - x0) || 1e-9); return Math.abs(zz - src.z) < 2.25; }
    /* une trace : suite de gouttelettes [x, y, z, taille, retard] */
    function track(type, x, z, ang, opt){
      opt = opt || {};
      var B = bS.value, y = opt.y != null ? opt.y : 0.45 + Math.random() * 0.6, dx = Math.cos(ang), dz = Math.sin(ang), dr = [], L = 0, i;
      var sc = CB_SCR[scS.value], fromSrc = !!opt.src;
      if (type === "a"){
        var Rg = CB_RA * (0.96 + 0.08 * Math.random()), r = cbR(CB_PA, 2, B), ds = 0.04;
        while (L < Rg){
          var x1 = x + dx * ds, z1 = z + dz * ds;
          if (fromSrc && sc.stopA && hitScreen(x, z, x1, z1)) break;
          if (!inBox(x1, z1)) break;
          x = x1; z = z1; L += ds;
          if (isFinite(r)){ var dd = ds / r, nx = dx - dz * dd, nz = dz + dx * dd, ln = Math.hypot(nx, nz); dx = nx / ln; dz = nz / ln; }
          /* gouttelettes serrées, plus grosses en fin de parcours (pic de Bragg) */
          var big = 1 + 0.9 * Math.pow(L / Rg, 4);
          dr.push([x + (Math.random() - 0.5) * 0.05, y + (Math.random() - 0.5) * 0.05, z + (Math.random() - 0.5) * 0.05, (2.0 + Math.random()) * big, L / 25]);
          if (Math.random() < 0.7) dr.push([x + (Math.random() - 0.5) * 0.09, y + (Math.random() - 0.5) * 0.08, z + (Math.random() - 0.5) * 0.09, 1.6 * big, L / 25]);
        }
        if (L < 0.2) return null;
      } else if (type === "b"){
        var T = opt.T || cbBetaT(), ds2 = 0.1, vy = 0, steps = 0;
        while (T > 0.012 && steps < 900){
          var p = cbPe(T), bt = p / (T + MEC2), th0 = 13.6 / (bt * p) * Math.sqrt(ds2 / 30390), d2 = zgauss() * th0;
          var cs = Math.cos(d2), sn = Math.sin(d2), ndx = dx * cs - dz * sn; dz = dx * sn + dz * cs; dx = ndx;
          var r2 = cbR(p, 1, B);
          if (isFinite(r2)){ var e2 = -ds2 / r2, mx = dx - dz * e2, mz = dz + dx * e2, l2 = Math.hypot(mx, mz); dx = mx / l2; dz = mz / l2; }
          var x2 = x + dx * ds2, z2 = z + dz * ds2;
          if (fromSrc && sc.stopB && hitScreen(x, z, x2, z2)) break;
          if (!inBox(x2, z2)) break;
          x = x2; z = z2; L += ds2; steps++;
          vy += zgauss() * th0 * 0.5; vy *= 0.9; y = Math.max(0.25, Math.min(1.4, y + vy * ds2));
          T -= 0.0022 / (bt * bt) * ds2;
          var nd = 0.55 / (bt * bt) * ds2 * 3.6; if (Math.random() < nd % 1) nd = Math.ceil(nd); else nd = Math.floor(nd);
          for (i = 0; i < nd; i++) dr.push([x + (Math.random() - 0.5) * 0.04, y, z + (Math.random() - 0.5) * 0.04, 1.1 + Math.random() * 0.5, L / 300]);
        }
        if (dr.length < 3) return null;
      } else {
        /* muon : entre par un bord, traverse en ligne droite (r ≈ 13 m sous 1 T) */
        var ds3 = 0.25, r3 = cbR(CB_PMU, 1, B), sgn = opt.q || 1;
        while (inBox(x, z) && L < 80){
          x += dx * ds3; z += dz * ds3; L += ds3;
          if (isFinite(r3)){ var e3 = sgn * ds3 / r3, ox = dx - dz * e3, oz = dz + dx * e3, l3 = Math.hypot(ox, oz); dx = ox / l3; dz = oz / l3; }
          var n3 = Math.random() < 0.6 ? 2 : 1;
          for (i = 0; i < n3; i++) dr.push([x + (Math.random() - 0.5) * 0.25, y + (Math.random() - 0.5) * 0.03, z + (Math.random() - 0.5) * 0.04, 1.2 + Math.random() * 0.4, L / 2000]);
        }
        if (dr.length < 10) return null;
      }
      return {type:type, d:dr, t0:now, life:type === "a" ? 1.6 : 2.2};
    }
    function emit(){
      var s = srcS.value;
      if (s === "0") return;
      var ang = (Math.random() - 0.5) * 1.7;
      var t = track(s, src.x + 0.25 * Math.cos(ang), src.z + 0.25 * Math.sin(ang), ang, {src:true, q:s === "a" ? 2 : -1});
      if (t){ tracks.push(t); cnt[s]++; }
    }
    function muon(){
      var side = Math.floor(Math.random() * 4), x, z, ang;
      if (side === 0){ x = -CB.X + 0.3; z = (Math.random() * 2 - 1) * CB.Z; ang = (Math.random() - 0.5) * 1.6; }
      else if (side === 1){ x = CB.X - 0.3; z = (Math.random() * 2 - 1) * CB.Z; ang = PI + (Math.random() - 0.5) * 1.6; }
      else if (side === 2){ z = -CB.Z + 0.3; x = (Math.random() * 2 - 1) * CB.X; ang = PI / 2 + (Math.random() - 0.5) * 1.6; }
      else { z = CB.Z - 0.3; x = (Math.random() * 2 - 1) * CB.X; ang = -PI / 2 + (Math.random() - 0.5) * 1.6; }
      var t = track("m", x, z, ang, {q:Math.random() < 0.55 ? 1 : -1});
      if (t){ tracks.push(t); cnt.m++; }
    }
    function radon(){
      var x = (Math.random() * 2 - 1) * (CB.X - 2), z = (Math.random() * 2 - 1) * (CB.Z - 2);
      var t = track("a", x, z, Math.random() * TAU, {}); if (t){ tracks.push(t); cnt.a++; }
    }
    var v = new Z3(); v.a = -0.25; v.b = 0.82; v.f = 30; v.set();
    var dragSrc = false, srcP = null;
    zorbit(c, v, k, [0.2, 1.35], function(type, p){
      if (type === "down"){ if (srcP && srcS.value !== "0" && Math.hypot(p.x - srcP.x, p.y - srcP.y) < 26){ dragSrc = true; return true; } return false; }
      if (type === "drag" && dragSrc){
        var w = v.unprojY(p.x, p.y, 0.3 * CB.S, src.x * CB.S, src.z * CB.S);
        src.x = Math.max(-CB.X + 1, Math.min(CB.X - 4.5, w[0] / CB.S)); src.z = Math.max(-CB.Z + 2.3, Math.min(CB.Z - 2.3, w[1] / CB.S)); k.redraw(); return true;
      }
      if (type === "up"){ dragSrc = false; return true; }
      if (type === "hover") return srcP && srcS.value !== "0" && Math.hypot(p.x - srcP.x, p.y - srcP.y) < 26;
      return false;
    });
    var lp = k.loop(function(dt, t){
      now += dt;
      acc.s += dt * (srcS.value === "a" ? 2.0 : 2.6); while (acc.s >= 1){ acc.s -= 1; emit(); }
      acc.m += dt * 0.55; while (acc.m >= 1){ acc.m -= 1; muon(); }
      acc.rn += dt * 0.12; while (acc.rn >= 1){ acc.rn -= 1; radon(); }
      if (now < 0.05){ muon(); for (var q = 0; q < 6; q++){ emit(); tracks[tracks.length - 1] && (tracks[tracks.length - 1].t0 -= Math.random() * 1.5); } }
      for (var i = tracks.length - 1; i >= 0; i--) if (now - tracks[i].t0 > tracks[i].life + 1.2) tracks.splice(i, 1);
      if (!v.user){ v.a = -0.25 + 0.14 * Math.sin(t * 0.18); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Sx = CB.S, X = CB.X * Sx, Z = CB.Z * Sx, Hh = CB.H * Sx, B = bS.value, i;
      zlab(ctx, W, H, "#141a2a", "#06080f");
      v.sc = Math.min(W / 8.6, H / 6.0); v.cx = W * 0.5; v.cy = H * 0.5; v.clear();
      /* table, bac de neige carbonique, plaque noire */
      zbench(v, -4.2, 4.2, -3.0, 3.0, -1.05);
      v.box(-X - 0.45, -1.05, -Z - 0.45, X + 0.45, -0.12, Z + 0.45, "#e8edf3", {cols:[null, null, null, "#f6f8fb"]});
      v.box(-X - 0.05, -0.12, -Z - 0.05, X + 0.05, 0, Z + 0.05, "#15181f", {cols:[null, null, null, "#0c0e13"]});
      /* lampe à DEL au fond */
      v.box(-X * 0.8, 0.05, -Z - 0.75, X * 0.8, 0.45, -Z - 0.45, "#3a414d", {afterFace:1, after:function(cx2){
        var a = v.p(-X * 0.78, 0.25, -Z - 0.44), b = v.p(X * 0.78, 0.25, -Z - 0.44);
        cx2.save(); cx2.strokeStyle = "#fffbe8"; cx2.lineWidth = 4; cx2.shadowColor = "#fff6c8"; cx2.shadowBlur = 14; cx2.beginPath(); cx2.moveTo(a.x, a.y); cx2.lineTo(b.x, b.y); cx2.stroke(); cx2.restore();
      }});
      /* bobine (champ B vertical) : demi-boucles arrière / avant */
      var cy = -0.3, coil = [], ccol = B > 0 ? "#d9822b" : "#9a6a3c";
      var ring = [[-X - 0.62, -Z - 0.62], [X + 0.62, -Z - 0.62], [X + 0.62, Z + 0.62], [-X - 0.62, Z + 0.62]];
      for (i = 0; i < 4; i++){ var a0 = ring[i], a1 = ring[(i + 1) % 4]; coil.push([[a0[0], cy, a0[1]], [a1[0], cy, a1[1]]]); }
      var cz = v.rot(0, cy, 0)[2];
      coil.forEach(function(sg){ var m = v.rot((sg[0][0] + sg[1][0]) / 2, cy, (sg[0][2] + sg[1][2]) / 2)[2]; if (m <= cz) v.cyl(sg[0], sg[1], 0.15, 10, ccol); });
      /* source sur son support, écran */
      var sp = srcS.value, sx = src.x * Sx, sz = src.z * Sx;
      if (sp !== "0"){
        v.cyl([sx - 0.05, 0, sz], [sx - 0.05, 0.42, sz], 0.05, 8, "#8d96a3");
        v.cyl([sx - 0.18, 0.42, sz], [sx + 0.06, 0.42, sz], 0.2, 16, sp === "a" ? "#c9a23b" : "#8fa9c7", {cap1:sp === "a" ? "#ffe07a" : "#cfe2ff"});
        var sc = CB_SCR[scS.value];
        if (sc.col){ var xs = sx + 1.5 * Sx; v.box(xs, 0, sz - 2.25 * Sx, xs + (scS.value === "papier" ? 0.035 : 0.08), 0.85, sz + 2.25 * Sx, sc.col); }
      }
      v.render(ctx);
      /* nappe éclairée (couche sensible, près du fond) */
      var g0 = v.p(-X, 0.12, -Z), g1 = v.p(X, 0.12, -Z), g2 = v.p(X, 0.12, Z), g3 = v.p(-X, 0.12, Z);
      var lg = ctx.createLinearGradient((g0.x + g1.x) / 2, (g0.y + g1.y) / 2, (g2.x + g3.x) / 2, (g2.y + g3.y) / 2);
      lg.addColorStop(0, "rgba(255,250,225,.20)"); lg.addColorStop(1, "rgba(200,220,255,.05)");
      ctx.save(); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(g0.x, g0.y); ctx.lineTo(g1.x, g1.y); ctx.lineTo(g2.x, g2.y); ctx.lineTo(g3.x, g3.y); ctx.closePath(); ctx.fill(); ctx.restore();
      /* gouttelettes */
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      tracks.forEach(function(tr){
        var age = now - tr.t0, fade = age < tr.life ? 1 : Math.max(0, 1 - (age - tr.life) / 1.2), sink = 0.06 * Math.max(0, age) * Sx, spread = 1 + 0.25 * age;
        var colr = tr.type === "a" ? "255,250,240" : tr.type === "b" ? "215,235,255" : "235,240,255";
        for (var j = 0; j < tr.d.length; j++){
          var d = tr.d[j]; if (age < d[4]) continue;
          var grow = Math.min(1, (age - d[4]) / 0.15), q = v.p(d[0] * Sx, Math.max(0.02, d[1] * Sx - sink), d[2] * Sx);
          var rr = d[3] * (tr.type === "a" ? 0.42 : 0.5) * q.s * spread * (phone ? 0.8 : 1) * (0.4 + 0.6 * grow), al = fade * grow * (tr.type === "a" ? 0.26 : tr.type === "b" ? 0.55 : 0.7);
          ctx.fillStyle = "rgba(" + colr + "," + al.toFixed(3) + ")";
          ctx.fillRect(q.x - rr, q.y - rr, 2 * rr, 2 * rr);
        }
      });
      ctx.restore();
      /* parois de verre, couvercle, feutre, bobine avant */
      v.clear();
      var gl = {alpha:0.07, glow:true, line:"rgba(220,235,255,.45)"};
      v.face([[-X, 0, -Z], [X, 0, -Z], [X, Hh, -Z], [-X, Hh, -Z]], "#cfe6ff", gl);
      v.face([[-X, 0, Z], [X, 0, Z], [X, Hh, Z], [-X, Hh, Z]], "#cfe6ff", gl);
      v.face([[-X, 0, -Z], [-X, 0, Z], [-X, Hh, Z], [-X, Hh, -Z]], "#cfe6ff", gl);
      v.face([[X, 0, -Z], [X, 0, Z], [X, Hh, Z], [X, Hh, -Z]], "#cfe6ff", gl);
      v.face([[-X, Hh, -Z], [X, Hh, -Z], [X, Hh, Z], [-X, Hh, Z]], "#cfe6ff", {alpha:0.05, glow:true, line:"rgba(220,235,255,.45)"});
      v.box(-X, Hh - 0.3, -Z, X, Hh - 0.05, -Z + 0.12, "#b8343a");
      coil.forEach(function(sg){ var m = v.rot((sg[0][0] + sg[1][0]) / 2, cy, (sg[0][2] + sg[1][2]) / 2)[2]; if (m > cz) v.cyl(sg[0], sg[1], 0.15, 10, ccol); });
      v.render(ctx);
      /* reflet sur la vitre avant */
      var r0 = v.p(-X * 0.9, Hh * 0.92, Z), r1 = v.p(-X * 0.55, Hh * 0.2, Z);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(r0.x, r0.y); ctx.lineTo(r1.x, r1.y); ctx.stroke(); ctx.restore();
      /* étiquettes */
      srcP = sp !== "0" ? v.p(sx, 0.42, sz) : null;
      if (srcP){
        zglow(ctx, srcP.x, srcP.y, 15, sp === "a" ? "#ffd34d" : "#7fb6ff", dragSrc ? 0.5 : 0.18);
        ztag(S, c, sp === "a" ? "source α · glisse-la" : "source β · glisse-la", srcP.x, srcP.y - 26, {size:10.5, color:sp === "a" ? "#ffe39a" : "#bcd8ff"});
      }
      var iq = v.p(X * 0.5, -0.6, Z + 0.45), fq = v.p(0, Hh + 0.25, -Z), bq = v.p(X + 0.62, cy, Z * 0.2);
      if (!phone) ztag(S, c, "neige carbonique (−78 °C)", iq.x, iq.y + 8, {size:10.5});
      ztag(S, c, "feutre imbibé d'alcool", fq.x, fq.y - 12, {size:10.5, color:"#ffb3b6"});
      if (B > 0) ztag(S, c, "bobine : B = " + zN(B, 2) + " T vers le haut", bq.x, bq.y, {size:10.5, color:"#ffc58a", align:phone ? "right" : "center"});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      /* légende des traces */
      var ly = H - 16, b1 = ztag(S, c, "α : court et épais", 8, ly, {size:10, align:"left", color:"#fff1c9"});
      var b2 = ztag(S, c, "β : fin et sinueux", b1.x + b1.w + 5, ly, {size:10, align:"left", color:"#cfe4ff"});
      if (!phone) ztag(S, c, "μ : long et droit", b2.x + b2.w + 5, ly, {size:10, align:"left", color:"#e3e8ff"});
      else ztag(S, c, "μ : long et droit", 8, ly - 24, {size:10, align:"left", color:"#e3e8ff"});

      /* ---- afficheurs ---- */
      var rA = cbR(CB_PA, 2, B), rB = cbR(cbPe(1), 1, B);
      ro.set(0, sp === "a" ? "α de " + zN(CB_TA, 2) + " MeV" : sp === "b" ? "β⁻ jusqu'à 2,28 MeV" : "aucune (cosmiques, radon)");
      ro.set(1, sp === "a" ? "≈ " + zN(CB_RA, 1) + " cm" : sp === "b" ? "plusieurs mètres" : "—");
      ro.set(2, isFinite(rA) ? zN(rA, 0) + " cm" : "infini (B = 0)");
      ro.set(3, isFinite(rB) ? zN(rB, 2) + " cm" : "infini (B = 0)");
      ro.set(4, cnt.a + " · " + cnt.b + " · " + cnt.m);
      var sc2 = CB_SCR[scS.value], msg;
      if (sp === "a") msg = sc2.stopA ? ({papier:"Le papier", alu:"L'aluminium (5 mm)", plomb:"Le plomb (5 mm)"})[scS.value] + " arrête toutes les α : il ne reste que les muons cosmiques et quelques α du radon de l'air." : "Les α (p = " + zN(CB_PA, 0) + " MeV/c) ionisent beaucoup : traces épaisses, toutes de la même longueur, environ " + zN(CB_RA, 1) + " cm.";
      else if (sp === "b") msg = sc2.stopB ? "L'" + sc2.nom.replace(" 5 mm", "") .replace("plomb", "écran de plomb").replace("aluminium", "aluminium") + " (5 mm) arrête les β." : (scS.value === "papier" ? "Le papier ne suffit pas pour les β : ils le traversent. " : "") + "Les β sont légers : la vapeur les dévie à chaque collision, d'où leurs traces sinueuses" + (B > 0 ? ", et le champ les enroule (q < 0, sens opposé aux α)." : ".");
      else msg = "Sans source, on voit les muons des rayons cosmiques (environ un toutes les deux secondes ici) et parfois une α du radon de l'air.";
      nt.set(msg, "ok");
    });
  }
});

/* =====================================================================
   5. Heisenberg : serrer la position, perdre l'impulsion (pq04)
   Grilles : x ∈ [−8, 8] nm (641 points), k = p/ħ ∈ [−25, 25] nm⁻¹ (301 points), transformée de Fourier directe.
   Mesure de résolution δ : ψ → ψ(x)·exp(−(x − x_m)²/4δ²), résultat x_m tiré selon |ψ|² convolué par une gaussienne d'écart δ.
   ===================================================================== */
var HZ = {NX:641, XM:8, NK:301, KM:25, S2:1.8};
SFA.sim({
  id:"pq-heisenberg-mesure", ch:"pq04", tag:"Incertitudes",
  titre:"Heisenberg : serrer la position, perdre l'impulsion",
  resume:"Un microscope mesure la position d'un électron : plus il le localise, plus la distribution de son impulsion s'élargit, et Δx·Δp ne descend jamais sous ħ/2.",
  but:"Tire les poignées Δx ou Δp sur les graphes : l'une serre, l'autre s'élargit. Mesure la position : le paquet se réduit autour du résultat et Δp explose. Mesure 200 copies pour voir l'histogramme. Glisse sur la scène pour tourner autour du microscope.",
  aRetenir:"Δx·Δp ≥ ħ/2 : l'égalité n'est atteinte que pour une gaussienne, au moment où elle est la plus étroite, et une mesure précise de x élargit la distribution de p.",
  piege:"L'incertitude n'est pas une erreur de l'appareil : même un état parfaitement connu a une largeur en x et en p.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 300 : 340), g = k.canvas(phone ? 470 : 250);
    var shS = k.seg("État préparé", [["g", "Paquet gaussien"], ["d", "Deux bosses"]], "g", function(){ prepare(); auto = false; });
    var sgS = k.slider("Largeur du paquet préparé σ", 0.2, 1.5, 0.01, 0.8, "nm", function(){ prepare(); auto = false; });
    var dS = k.slider("Résolution du microscope δ", 0.1, 1, 0.01, 0.15, "nm", function(){ auto = false; });
    k.button("Mesurer la position", function(){ auto = false; if (phase !== "prep") prepare(); startMeasure(); }, true);
    k.button("Mesurer 200 copies", function(){ auto = false; prepare(); for (var i = 0; i < 200; i++) hist.push(drawX()); nMes += 200; });
    k.button("Préparer de nouveau", function(){ auto = false; prepare(); });
    k.button("Effacer l'histogramme", function(){ hist = []; nMes = 0; });
    var ro = k.readouts(["Largeur en position Δx", "Largeur en impulsion Δp", "Δx·Δp (en ħ)", "Largeur en vitesse Δv = Δp/m", "Mesures faites"]);
    var nt = k.note("", "ok");
    var NX = HZ.NX, NK = HZ.NK, X = new Float64Array(NX), K = new Float64Array(NK), dx = 2 * HZ.XM / (NX - 1), dk = 2 * HZ.KM / (NK - 1), i, j;
    for (i = 0; i < NX; i++) X[i] = -HZ.XM + i * dx;
    for (j = 0; j < NK; j++) K[j] = -HZ.KM + j * dk;
    var EC = new Float64Array(NX * NK), ES = new Float64Array(NX * NK);
    for (j = 0; j < NK; j++) for (i = 0; i < NX; i++){ EC[j * NX + i] = Math.cos(K[j] * X[i]); ES[j * NX + i] = Math.sin(K[j] * X[i]); }
    var pr = new Float64Array(NX), pi_ = new Float64Array(NX), fr = new Float64Array(NK), fi = new Float64Array(NK);
    var p0r = new Float64Array(NX), r0 = new Float64Array(NX), cdf = new Float64Array(NX);
    var phase = "prep", tfs = 0, tau = 1, xm = 0, anim = 0, auto = true, at = 0, hist = [], nMes = 0, photon = null, flash = 0;
    var HB_NM = HBM_NM2FS;   /* ħ/m en nm²/fs */
    /* ψ(x) → φ(k) (transformée de Fourier directe, normalisée) */
    function toK(){
      var s = 0;
      for (j = 0; j < NK; j++){
        var a = 0, b = 0, o = j * NX;
        for (i = 0; i < NX; i++){ a += pr[i] * EC[o + i] + pi_[i] * ES[o + i]; b += pi_[i] * EC[o + i] - pr[i] * ES[o + i]; }
        fr[j] = a * dx / Math.sqrt(TAU); fi[j] = b * dx / Math.sqrt(TAU); s += (fr[j] * fr[j] + fi[j] * fi[j]) * dk;
      }
      s = Math.sqrt(s); for (j = 0; j < NK; j++){ fr[j] /= s; fi[j] /= s; }
    }
    /* évolution libre : ψ(x, t) = ∫ φ(k) e^{i(kx − ħk²t/2m)} dk/√2π */
    function toX(t){
      for (i = 0; i < NX; i++){ pr[i] = 0; pi_[i] = 0; }
      for (j = 0; j < NK; j++){
        var w = HB_NM * K[j] * K[j] / 2 * t, cw = Math.cos(w), sw = Math.sin(w), ar = fr[j] * cw + fi[j] * sw, ai = fi[j] * cw - fr[j] * sw, o = j * NX;
        if (Math.abs(ar) + Math.abs(ai) < 1e-7) continue;
        for (i = 0; i < NX; i++){ pr[i] += ar * EC[o + i] - ai * ES[o + i]; pi_[i] += ar * ES[o + i] + ai * EC[o + i]; }
      }
      norm();
    }
    function norm(){ var s = 0; for (i = 0; i < NX; i++) s += (pr[i] * pr[i] + pi_[i] * pi_[i]) * dx; s = Math.sqrt(s); for (i = 0; i < NX; i++){ pr[i] /= s; pi_[i] /= s; } }
    function widths(){
      var m1 = 0, m2 = 0, k1 = 0, k2 = 0;
      for (i = 0; i < NX; i++){ var r = (pr[i] * pr[i] + pi_[i] * pi_[i]) * dx; m1 += X[i] * r; m2 += X[i] * X[i] * r; }
      for (j = 0; j < NK; j++){ var q = (fr[j] * fr[j] + fi[j] * fi[j]) * dk; k1 += K[j] * q; k2 += K[j] * K[j] * q; }
      return {dx:Math.sqrt(Math.max(0, m2 - m1 * m1)), dk:Math.sqrt(Math.max(0, k2 - k1 * k1)), xc:m1};
    }
    function prepare(){
      var sg = sgS.value, d2 = shS.value === "d";
      for (i = 0; i < NX; i++){
        var x = X[i], v = d2 ? Math.exp(-Math.pow(x - HZ.S2, 2) / (4 * sg * sg)) + Math.exp(-Math.pow(x + HZ.S2, 2) / (4 * sg * sg)) : Math.exp(-x * x / (4 * sg * sg));
        pr[i] = v; pi_[i] = 0;
      }
      norm(); toK();
      var c0 = 0; for (i = 0; i < NX; i++){ p0r[i] = pr[i]; r0[i] = pr[i] * pr[i]; c0 += r0[i] * dx; cdf[i] = c0; }
      phase = "prep"; tfs = 0; photon = null; at = 0; W0 = widths();
    }
    /* tirage d'un résultat : x selon |ψ_préparé|², plus le flou gaussien δ du microscope */
    function drawX(){
      var u = Math.random() * cdf[NX - 1], lo = 0, hi = NX - 1;
      while (hi - lo > 1){ var mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid; else hi = mid; }
      return X[hi] + dS.value * zgauss();
    }
    function startMeasure(){ xm = drawX(); photon = {s:0}; phase = "photon"; }
    function collapse(){
      var de = dS.value;
      for (i = 0; i < NX; i++){ var w = Math.exp(-Math.pow(X[i] - xm, 2) / (4 * de * de)); pr[i] = p0r[i] * w; pi_[i] = 0; }
      norm(); toK(); hist.push(xm); nMes++;
      var Wc = widths(); tau = 2 * Wc.dx * Wc.dx / HB_NM;   /* temps caractéristique d'étalement 2mσ²/ħ (fs) */
      phase = "meas"; tfs = 0; flash = 1; W1 = Wc;
    }
    var W0 = null, W1 = null;
    prepare();
    /* poignées des graphes */
    var GEO = {}, drag = null;
    g.cv.style.touchAction = "none";
    g.pointer(function(type, p){
      function near(){
        if (GEO.hx && Math.abs(p.y - GEO.hx.y) < 16 && (Math.abs(p.x - GEO.hx.x1) < 14 || Math.abs(p.x - GEO.hx.x2) < 14)) return "x";
        if (GEO.hp && Math.abs(p.y - GEO.hp.y) < 16 && (Math.abs(p.x - GEO.hp.x1) < 14 || Math.abs(p.x - GEO.hp.x2) < 14)) return "p";
        return null;
      }
      if (type === "down"){ drag = near(); if (drag){ auto = false; if (phase !== "prep") prepare(); } }
      if (type === "move") g.cv.style.cursor = near() ? "ew-resize" : "default";
      if (type === "drag" && drag){
        var W = widths(), sg = sgS.value, tgt;
        if (drag === "x"){ tgt = Math.abs(GEO.ix(p.x)); sgS.set(Math.max(0.2, Math.min(1.5, sg * tgt / Math.max(1e-6, W.dx)))); }
        else { tgt = Math.abs(GEO.ik(p.x)); sgS.set(Math.max(0.2, Math.min(1.5, sg * W.dk / Math.max(1e-6, tgt)))); }
        prepare(); k.redraw();
      }
      if (type === "up") drag = null;
    });
    var v = new Z3(); v.a = -0.45; v.b = 0.32; v.f = 24; v.set();
    zorbit(c, v, k, [-0.1, 1.0]);
    /* nuage de points tirés selon |ψ(x, t)|² */
    var NP = phone ? 260 : 420, cloud = [];
    function sampleCurrent(){
      var cc = new Float64Array(NX), s = 0; for (i = 0; i < NX; i++){ s += pr[i] * pr[i] + pi_[i] * pi_[i]; cc[i] = s; }
      var u = Math.random() * s, lo = 0, hi = NX - 1; while (hi - lo > 1){ var mid = (lo + hi) >> 1; if (cc[mid] < u) lo = mid; else hi = mid; }
      return X[hi] + (Math.random() - 0.5) * dx;
    }
    var lp = k.loop(function(dt, t){
      if (auto){
        at += dt;
        if (phase === "prep" && at > 2.2) startMeasure();
        if (phase === "meas" && tfs > 2.6 * tau && anim > 1.2){ prepare(); }
      }
      if (phase === "photon"){ photon.s += dt * 1.6; if (photon.s >= 1){ collapse(); anim = 0; } }
      if (phase === "meas"){ anim += dt; tfs = tau * 2.6 * Math.min(1, anim / 3.2); toX(tfs); }
      flash = Math.max(0, flash - dt * 1.5);
      /* nuage : on renouvelle une partie des points à chaque image */
      var nn = Math.max(8, Math.round(NP * 0.12));
      if (cloud.length < NP) nn = NP - cloud.length;
      for (var q = 0; q < nn; q++){ var pt = [sampleCurrent(), zgauss() * 0.2, zgauss() * 0.2]; if (cloud.length < NP) cloud.push(pt); else cloud[(Math.random() * NP) | 0] = pt; }
      if (!v.user){ v.a = -0.45 + 0.15 * Math.sin(t * 0.22); v.set(); }
      k.redraw();
    });
    lp.play();
    var GXs = 0.8;   /* nm → unités de scène */
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Wd = widths(), de = dS.value;
      zlab(ctx, W, H, "#1c2640", "#090d18");
      v.sc = Math.min(W / (phone ? 12.5 : 12.8), H / 7.4); v.cx = W * 0.5; v.cy = H * 0.62; v.clear();
      zbench(v, -7.2, 7.2, -2.2, 2.2, -1.6);
      /* enceinte à vide (tube) et supports */
      [-4, 4].forEach(function(xx){ v.box(xx - 0.2, -1.6, -0.25, xx + 0.2, -0.95, 0.25, "#5d6878"); });
      v.cyl([-5.4, 0, 0], [5.4, 0, 0], 0.95, 22, "#c5e4ff", {glow:true, alpha:0.06, open:true});
      v.cyl([-5.55, 0, 0], [-5.4, 0, 0], 1.02, 22, "#7b8798"); v.cyl([5.4, 0, 0], [5.55, 0, 0], 1.02, 22, "#7b8798");
      /* lampe (source de photons) */
      v.cyl([-7.0, 0, 0], [-5.9, 0, 0], 0.42, 16, "#4a5566", {cap1:"#e9e4ff"});
      v.box(-6.7, -1.6, -0.2, -6.2, -0.42, 0.2, "#3d4757");
      /* microscope au-dessus */
      v.cyl([0, 1.0, 0], [0, 1.6, 0], 0.75, 22, "#2e3644", {r1:0.5, cap0:"#9fd0ff"});
      v.cyl([0, 1.6, 0], [0, 3.4, 0], 0.42, 18, "#3c4656");
      v.cyl([0, 3.4, 0], [0, 3.9, 0], 0.5, 18, "#262d39", {cap1:"#111"});
      v.box(-0.2, -1.6, -1.75, 0.2, 2.8, -1.4, "#4a5566"); v.box(-0.15, 2.3, -1.4, 0.15, 2.6, -0.4, "#4a5566");
      /* nuage de probabilité */
      cloud.forEach(function(pt){
        v.sprite(pt[0] * GXs, pt[1], pt[2], function(cx2, q){ cx2.fillStyle = "rgba(120,190,255,.22)"; cx2.fillRect(q.x - 3 * q.s, q.y - 3 * q.s, 6 * q.s, 6 * q.s); cx2.fillStyle = "rgba(200,230,255,.95)"; cx2.fillRect(q.x - 1.2 * q.s, q.y - 1.2 * q.s, 2.4 * q.s, 2.4 * q.s); });
      });
      /* photon en vol */
      if (phase === "photon" && photon){
        var s1 = photon.s, xp, yp;
        if (s1 < 0.6){ xp = -5.9 + (xm * GXs + 5.9) * s1 / 0.6; yp = 0; } else { var u2 = (s1 - 0.6) / 0.4; xp = xm * GXs * (1 - u2); yp = 1.05 * u2; }
        v.sprite(xp, yp, 0, function(cx2, q){ zglow(cx2, q.x, q.y, 16 * q.s, "#c9a6ff", 0.9); zball(cx2, q.x, q.y, 3.5 * q.s, "#f0e6ff"); }, 0.5);
      }
      v.render(ctx);
      /* éclair de la mesure et flèches Δp */
      if (phase === "meas"){
        var mq = v.p(xm * GXs, 0, 0);
        if (flash > 0) zglow(ctx, mq.x, mq.y, 40 * flash + 6, "#ffffff", 0.8 * flash);
        var L1 = Math.min(W * 0.3, Wd.dk * 9 * (phone ? 0.7 : 1)), y1 = v.p(xm * GXs, 1.05, 0).y - 4;
        ctx.save(); ctx.strokeStyle = "#ff8a5c"; ctx.fillStyle = "#ff8a5c"; ctx.lineWidth = 2;
        [-1, 1].forEach(function(sg){ var xe = mq.x + sg * L1; ctx.beginPath(); ctx.moveTo(mq.x, y1); ctx.lineTo(xe, y1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xe, y1); ctx.lineTo(xe - sg * 7, y1 - 4); ctx.lineTo(xe - sg * 7, y1 + 4); ctx.closePath(); ctx.fill(); });
        ctx.restore();
        ztag(S, c, "Δp : coup donné par le photon", mq.x, y1 - 14, {size:10.5, color:"#ffc2a8"});
      }
      var lq = v.p(-6.5, 0.75, 0), oq = v.p(0, 4.2, 0), eq = v.p(3.2, -1.05, 0);
      ztag(S, c, "lampe", lq.x, lq.y, {size:10.5});
      ztag(S, c, "microscope (résolution δ = " + zN(de, 2) + " nm)", oq.x, oq.y, {size:10.5, color:"#bfe0ff"});
      if (!phone) ztag(S, c, "électron : nuage de probabilité |ψ|²", eq.x, eq.y + 10, {size:10.5, color:"#9fd0ff"});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      var stt = phase === "prep" ? "état préparé" : phase === "photon" ? "un photon arrive…" : "mesuré : x = " + zN(xm, 2) + " nm, puis évolution libre (t = " + zN(tfs, tfs < 1 ? 3 : 2) + " fs)";
      ztag(S, c, stt, 8, H - 16, {size:10.5, align:"left", color:phase === "meas" ? "#ffd34d" : "#eef3fb"});

      /* ---- graphes face à face ---- */
      var gx = g.ctx, GW = g.W, GH = g.H;
      gx.fillStyle = "#f4f6fa"; gx.fillRect(0, 0, GW, GH);
      var gw = phone ? GW - 12 : Math.round((GW - 90) / 2), gh = phone ? Math.round((GH - 86) / 2) : GH - 12;
      var gy2 = phone ? gh + 12 : 6, gx2 = phone ? 6 : GW - gw - 6;
      /* |ψ(x)|² */
      var rmax = 0; for (i = 0; i < NX; i++) rmax = Math.max(rmax, pr[i] * pr[i] + pi_[i] * pi_[i]);
      var yx = Math.max(rmax, 0.6) * 1.42;
      var ax = zframe(S, g, 6, 6, gw, gh, -HZ.XM, HZ.XM, 0, yx, {sx:phone ? 2 : 2, dx:0, xl:"x (nm)", title:"Position : |ψ(x)|²", l:12});
      /* histogramme des mesures */
      if (hist.length){
        var NB = 60, hb = new Float64Array(NB), bw = 2 * HZ.XM / NB, hm = 0;
        hist.forEach(function(xv){ var b = Math.floor((xv + HZ.XM) / bw); if (b >= 0 && b < NB) hb[b]++; });
        for (var b = 0; b < NB; b++) hm = Math.max(hm, hb[b]);
        /* échelle : densité de probabilité (nombre / (N·largeur de case)) */
        for (b = 0; b < NB; b++){ if (!hb[b]) continue; var dens = hb[b] / (hist.length * bw), Y = ax.Y(Math.min(yx, dens)); gx.fillStyle = "rgba(79,143,240,.55)"; gx.fillRect(ax.X(-HZ.XM + b * bw) + 0.5, Y, Math.max(1, (ax.X(bw) - ax.X(0)) - 1), ax.B - Y); }
      }
      /* état préparé (pointillé) et état actuel */
      gx.save(); gx.setLineDash([4, 4]); gx.strokeStyle = "#8a96a8"; gx.lineWidth = 1.3; gx.beginPath();
      for (i = 0; i < NX; i += 2){ var Yp = ax.Y(Math.min(yx, r0[i])); if (i) gx.lineTo(ax.X(X[i]), Yp); else gx.moveTo(ax.X(X[i]), Yp); } gx.stroke(); gx.restore();
      gx.save(); gx.beginPath(); gx.moveTo(ax.X(-HZ.XM), ax.Y(0));
      for (i = 0; i < NX; i++) gx.lineTo(ax.X(X[i]), ax.Y(Math.min(yx, pr[i] * pr[i] + pi_[i] * pi_[i])));
      gx.lineTo(ax.X(HZ.XM), ax.Y(0)); gx.closePath(); gx.fillStyle = "rgba(255,160,50,.25)"; gx.fill();
      gx.beginPath(); for (i = 0; i < NX; i++){ var Yc = ax.Y(Math.min(yx, pr[i] * pr[i] + pi_[i] * pi_[i])); if (i) gx.lineTo(ax.X(X[i]), Yc); else gx.moveTo(ax.X(X[i]), Yc); }
      gx.strokeStyle = "#e0662a"; gx.lineWidth = 2; gx.stroke(); gx.restore();
      /* poignées ±Δx */
      var hyX = ax.T + 18, cx0 = ax.X(Wd.xc), x1 = ax.X(Wd.xc - Wd.dx), x2 = ax.X(Wd.xc + Wd.dx);
      function handles(x1, x2, y, col, lab){
        gx.save(); gx.strokeStyle = col; gx.fillStyle = col; gx.lineWidth = 2;
        gx.beginPath(); gx.moveTo(x1, y); gx.lineTo(x2, y); gx.stroke();
        [x1, x2].forEach(function(xx){ gx.beginPath(); gx.moveTo(xx, y - 8); gx.lineTo(xx, y + 8); gx.stroke(); gx.beginPath(); gx.arc(xx, y, 5, 0, TAU); gx.fill(); });
        gx.restore();
        zT(S, g, lab, (x1 + x2) / 2, y - 10, {size:zfz(g, 11), color:col});
      }
      handles(x1, x2, hyX, "#c0392b", "2Δx");
      GEO.hx = {x1:x1, x2:x2, y:hyX}; GEO.ix = function(px){ return (px - ax.L) / (ax.R - ax.L) * 2 * HZ.XM - HZ.XM - Wd.xc; };
      if (hist.length) zT(S, g, "■ " + hist.length + (hist.length > 1 ? " mesures" : " mesure"), ax.R, ax.T - 8, {size:zfz(g, 10), color:"#2f6fd6", align:"right"});
      /* |φ(p)|² */
      var fmax = 0; for (j = 0; j < NK; j++) fmax = Math.max(fmax, fr[j] * fr[j] + fi[j] * fi[j]);
      var yk = Math.max(fmax, 0.25) * 1.42;
      var KD = 15, bx = zframe(S, g, gx2, gy2, gw, gh, -KD, KD, 0, yk, {sx:5, dx:0, xl:"p/ħ (nm⁻¹)", title:"Impulsion : |φ(p)|²", l:12});
      gx.save(); gx.beginPath(); gx.rect(bx.L, bx.T - 4, bx.R - bx.L, bx.B - bx.T + 4); gx.clip(); gx.beginPath(); gx.moveTo(bx.X(-HZ.KM), bx.Y(0));
      for (j = 0; j < NK; j++) gx.lineTo(bx.X(K[j]), bx.Y(Math.min(yk, fr[j] * fr[j] + fi[j] * fi[j])));
      gx.lineTo(bx.X(HZ.KM), bx.Y(0)); gx.closePath(); gx.fillStyle = "rgba(122,79,214,.22)"; gx.fill();
      gx.beginPath(); for (j = 0; j < NK; j++){ var Yk = bx.Y(Math.min(yk, fr[j] * fr[j] + fi[j] * fi[j])); if (j) gx.lineTo(bx.X(K[j]), Yk); else gx.moveTo(bx.X(K[j]), Yk); }
      gx.strokeStyle = "#7a4fd6"; gx.lineWidth = 2; gx.stroke(); gx.restore();
      var k1 = bx.X(Math.max(-KD, -Wd.dk)), k2 = bx.X(Math.min(KD, Wd.dk)), hyP = bx.T + 18;
      handles(k1, k2, hyP, "#7a4fd6", "2Δp/ħ");
      GEO.hp = {x1:k1, x2:k2, y:hyP}; GEO.ik = function(px){ return (px - bx.L) / (bx.R - bx.L) * 2 * KD - KD; };
      /* compteur Δx·Δp */
      var prod = Wd.dx * Wd.dk;
      if (!phone){
        var mx = 6 + gw + 12, mw = GW - 2 * gw - 36, top = 28, bot = GH - 34;
        gx.save(); zrr(gx, mx, top - 18, mw, bot - top + 44, 8); gx.fillStyle = "#ffffff"; gx.fill(); gx.strokeStyle = "#dfe4ec"; gx.stroke(); gx.restore();
        zT(S, g, "Δx·Δp", mx + mw / 2, top - 6, {size:zfz(g, 11), color:"#13233a"});
        var tx = mx + mw / 2 - 7, Ymax = 3, Yf = function(vv){ return bot - Math.min(vv, Ymax) / Ymax * (bot - top - 10); };
        gx.fillStyle = "#f5d0cc"; gx.fillRect(tx, Yf(0.5), 14, bot - Yf(0.5));
        gx.fillStyle = "#e9edf3"; gx.fillRect(tx, top + 4, 14, Yf(0.5) - top - 4);
        var gr = gx.createLinearGradient(0, Yf(prod), 0, bot); gr.addColorStop(0, "#2fa36b"); gr.addColorStop(1, "#1d7a4e");
        gx.fillStyle = gr; gx.fillRect(tx + 3, Yf(prod), 8, bot - Yf(prod));
        gx.strokeStyle = "#c0392b"; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(tx - 6, Yf(0.5)); gx.lineTo(tx + 20, Yf(0.5)); gx.stroke();
        zT(S, g, "ħ/2", tx + 22, Yf(0.5), {size:zfz(g, 10), color:"#c0392b", align:"left"});
        [1, 2, 3].forEach(function(vv){ zT(S, g, vv + "ħ", tx - 4, Yf(vv), {size:zfz(g, 9.5), color:"#7b8694", align:"right", weight:600}); });
        zT(S, g, zN(prod, 2) + " ħ", mx + mw / 2, bot + 14, {size:zfz(g, 12), color:"#1d7a4e"});
      } else {
        var my = gy2 + gh + 8, mw2 = GW - 12;
        gx.save(); zrr(gx, 6, my, mw2, GH - my - 6, 8); gx.fillStyle = "#ffffff"; gx.fill(); gx.strokeStyle = "#dfe4ec"; gx.stroke(); gx.restore();
        var l0 = 70, l1 = GW - 60, Xf = function(vv){ return l0 + Math.min(vv, 3) / 3 * (l1 - l0); }, yb = my + 30;
        zT(S, g, "Δx·Δp", 14, yb, {size:zfz(g, 11), color:"#13233a", align:"left"});
        gx.fillStyle = "#f5d0cc"; gx.fillRect(l0, yb - 7, Xf(0.5) - l0, 14);
        gx.fillStyle = "#e9edf3"; gx.fillRect(Xf(0.5), yb - 7, l1 - Xf(0.5), 14);
        gx.fillStyle = "#2fa36b"; gx.fillRect(l0, yb - 4, Xf(prod) - l0, 8);
        gx.strokeStyle = "#c0392b"; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(Xf(0.5), yb - 11); gx.lineTo(Xf(0.5), yb + 11); gx.stroke();
        zT(S, g, "ħ/2", Xf(0.5), yb + 19, {size:zfz(g, 10), color:"#c0392b"});
        zT(S, g, zN(prod, 2) + " ħ", GW - 14, yb, {size:zfz(g, 12), color:"#1d7a4e", align:"right"});
      }

      /* ---- afficheurs ---- */
      var dp = HB * Wd.dk * 1e9;
      ro.set(0, zN(Wd.dx, 3) + " nm");
      ro.set(1, zsci(dp, 2, true) + " kg·m/s");
      ro.set(2, zN(prod, 3) + " ħ");
      ro.set(3, zN(dp / ME / 1e3, 0) + " km/s");
      ro.set(4, String(nMes));
      var msg;
      if (phase === "prep") msg = shS.value === "g" ? "Paquet gaussien : Δx·Δp = ħ/2 exactement, le minimum permis. Serre Δx : Δp grandit d'autant." : "Deux bosses : le paquet est large en x et |φ(p)|² présente des franges : Δx·Δp est au-dessus de ħ/2.";
      else if (phase === "photon") msg = "Un photon va heurter l'électron : pour le localiser à δ près, il faut une lumière de longueur d'onde courte, dont les photons donnent un coup d'autant plus fort.";
      else if (dS.value < 0.7 * sgS.value) msg = "Après la mesure, " + (shS.value === "g" ? "Δx = σδ/√(σ²+δ²) = " + zN(sgS.value * dS.value / Math.sqrt(sgS.value * sgS.value + dS.value * dS.value), 3) : "Δx ≈ " + zN(W1 ? W1.dx : Wd.dx, 3)) + " nm (≈ δ si δ ≪ σ), et Δp a grandi d'autant. Ensuite le paquet s'étale : Δx grandit, |φ(p)|² ne change plus.";
      else msg = "Le microscope est moins précis que la largeur du paquet : la mesure ne le resserre presque pas et Δp change peu.";
      nt.set(msg, phase === "meas" ? "warn" : "ok");
    });
  }
});

/* =====================================================================
   6. Un photon devant un polariseur (pq04)
   Angles mesurés depuis la verticale, dans le plan perpendiculaire au faisceau (axe x).
   Photon polarisé à α devant un polariseur d'axe φ : il passe avec la probabilité cos²(α − φ) et ressort polarisé à φ.
   Pixel LCD (nématique torsadé) : polariseur vertical, cristal qui tourne la polarisation de β(V), analyseur horizontal.
   ===================================================================== */
function phWrap(a){ while (a > 90) a -= 180; while (a <= -90) a += 180; return a; }
function phBeta(V){ if (V <= 1) return 90; if (V >= 3) return 0; var u = (V - 1) / 2; return 90 * (1 - u * u * (3 - 2 * u)); }
SFA.sim({
  id:"pq-photon-polariseur", ch:"pq04", tag:"Mesure",
  titre:"Un photon devant un polariseur : passe ou pas ?",
  resume:"Des photons polarisés arrivent un par un sur un polariseur vertical : chacun passe ou est absorbé au hasard, et les comptages tendent vers cos²θ et sin²θ.",
  but:"Tourne la polarisation des photons (curseur, ou glisse la poignée jaune de la source) et regarde les compteurs. Ajoute un 2e puis un 3e polariseur, tourne-les à la souris, puis passe en mode pixel LCD. Glisse ailleurs pour tourner la vue.",
  aRetenir:"Chaque photon passe avec la probabilité cos²θ ; s'il passe, il est ensuite polarisé selon l'axe du polariseur : la mesure a changé son état.",
  piege:"On ne peut pas prévoir le sort d'un seul photon : seule la fréquence sur beaucoup de photons est prévisible.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 400), g = k.canvas(phone ? 330 : 190);
    var mode = "banc";
    var mS = k.seg("Montage", [["banc", "Banc d'optique"], ["lcd", "Pixel LCD"]], "banc", function(v){ mode = v; showSl(); reset(); });
    var thS = k.slider("Polarisation des photons θ", -90, 90, 1, 30, "°", function(){ reset(); });
    var nS = k.seg("Polariseurs", [["1", "1"], ["2", "2"], ["3", "3"]], "1", function(v){ if (v === "2"){ p2S.set(0); } if (v === "3"){ p2S.set(45); p3S.set(90); } showSl(); reset(); });
    var nRow = k.ctrl.lastElementChild;
    var p2S = k.slider("Axe du 2e polariseur", -90, 90, 1, 0, "°", function(){ reset(); });
    var p3S = k.slider("Axe du 3e polariseur", -90, 90, 1, 90, "°", function(){ reset(); });
    var vS = k.slider("Tension sur le cristal liquide V", 0, 5, 0.05, 0, "V", function(){ reset(); });
    var rS = k.seg("Cadence", [["2", "2 par s"], ["10", "10 par s"], ["200", "200 par s"]], "10");
    k.button("Remettre les compteurs à zéro", function(){ reset(); }, true);
    var ro = k.readouts(["Prévu au 1er polariseur", "Mesuré au 1er polariseur", "Prévu au détecteur", "Mesuré au détecteur", "Photons envoyés"]);
    var nt = k.note("", "ok");
    function showSl(){
      var b = mode === "banc", n = +nS.value;
      thS.el.parentNode.style.display = b ? "" : "none";
      if (nRow) nRow.style.display = b ? "" : "none";
      p2S.el.parentNode.style.display = b && n >= 2 ? "" : "none";
      p3S.el.parentNode.style.display = b && n >= 3 ? "" : "none";
      vS.el.parentNode.style.display = b ? "none" : "";
    }
    showSl();
    var cnt, fly = [], acc = 0, hist = [], flashes = [];
    function reset(){ cnt = {n:0, p1:0, a1:0, det:0, done:0}; fly = []; hist = []; flashes = []; k.redraw(); }
    reset();
    /* éléments sur l'axe : [x, axe (°), nom] */
    function elems(){
      if (mode === "lcd") return [{x:-2.7, ax:0, nm:"polariseur"}, {x:0, lc:true}, {x:2.7, ax:90, nm:"analyseur"}];
      var n = +nS.value, L = [{x:-2.4, ax:0, nm:"P1", id:1}];
      if (n >= 2) L.push({x:0.4, ax:phWrap(p2S.value), nm:"P2", id:2});
      if (n >= 3) L.push({x:3.0, ax:phWrap(p3S.value), nm:"P3", id:3});
      return L;
    }
    function predicted(){
      if (mode === "lcd"){ var b = phBeta(vS.value) * PI / 180; return {p1:0.5, det:0.5 * Math.pow(Math.sin(b), 2)}; }
      var L = elems(), a = thS.value, P = 1, p1 = 0;
      L.forEach(function(e, i){ var q = Math.pow(Math.cos((a - e.ax) * PI / 180), 2); P *= q; if (!i) p1 = q; a = e.ax; });
      return {p1:p1, det:P};
    }
    var X0 = -5.6, X1 = 5.4;
    /* un photon : on tire son sort à chaque élément au moment où il l'atteint */
    function launch(fast){
      var a = mode === "lcd" ? Math.random() * 180 - 90 : thS.value, ph = {x:X0, a:a, alive:true, k:0, ph:Math.random() * TAU};
      cnt.n++;
      if (fast){ var L = elems(); for (var i = 0; i < L.length; i++){ if (!pass(ph, L[i], i)) break; } if (ph.alive) cnt.det++; cnt.done++; hist.push([cnt.done, cnt.p1 / Math.max(1, cnt.p1 + cnt.a1), cnt.det / cnt.done]); return; }
      fly.push(ph);
    }
    function pass(ph, e, i){
      if (e.lc){ ph.a = phWrap(ph.a + phBeta(vS.value)); return true; }
      var q = Math.pow(Math.cos((ph.a - e.ax) * PI / 180), 2);
      if (Math.random() < q){ ph.a = e.ax; if (i === 0) cnt.p1++; return true; }
      ph.alive = false; if (i === 0) cnt.a1++; flashes.push({x:e.x, t:0}); return false;
    }
    /* souris : poignée de la source (θ) et poignées des polariseurs P2, P3 */
    var v = new Z3(); v.a = -0.62; v.b = 0.3; v.f = 26; v.set();
    var grab = null, HND = [];
    function angleAt(x, p){
      var o = v.p(x, 0, 0), py = v.p(x, 1, 0), pz = v.p(x, 0, 1);
      var a = py.x - o.x, b = pz.x - o.x, c2 = py.y - o.y, d = pz.y - o.y, det = a * d - b * c2; if (Math.abs(det) < 1e-6) return null;
      var ex = p.x - o.x, ey = p.y - o.y, u = (d * ex - b * ey) / det, w = (-c2 * ex + a * ey) / det;
      return phWrap(Math.round(Math.atan2(w, u) * 180 / PI));
    }
    zorbit(c, v, k, [-0.3, 1.1], function(type, p){
      function hit(){ for (var i = 0; i < HND.length; i++) if (Math.hypot(p.x - HND[i].x, p.y - HND[i].y) < 18) return HND[i]; return null; }
      if (type === "down"){ grab = hit(); return !!grab; }
      if (type === "hover") return !!hit();
      if (type === "drag" && grab){
        var an = angleAt(grab.xw, p); if (an == null) return true;
        if (grab.id === 0) thS.set(an); else if (grab.id === 2) p2S.set(an); else if (grab.id === 3) p3S.set(an);
        reset(); return true;
      }
      if (type === "up"){ grab = null; return true; }
      return false;
    });
    var lp = k.loop(function(dt, t){
      var rate = +rS.value;
      acc += dt * rate;
      while (acc >= 1){ acc -= 1; launch(rate > 50); }
      var L = elems(), sp = (X1 - X0) / 1.5;
      for (var i = fly.length - 1; i >= 0; i--){
        var ph = fly[i], nx = ph.x + sp * dt;
        while (ph.alive && ph.k < L.length && nx >= L[ph.k].x){ pass(ph, L[ph.k], ph.k); ph.k++; }
        ph.x = nx; ph.ph += dt * 14;
        if (!ph.alive || ph.x >= X1){ if (ph.alive) cnt.det++; cnt.done++; hist.push([cnt.done, cnt.p1 / Math.max(1, cnt.p1 + cnt.a1), cnt.det / cnt.done]); fly.splice(i, 1); }
      }
      if (hist.length > 4000) hist.splice(0, hist.length - 4000);
      flashes.forEach(function(f){ f.t += dt; }); flashes = flashes.filter(function(f){ return f.t < 0.5; });
      if (!v.user){ v.a = -0.62 + 0.12 * Math.sin(t * 0.21); v.set(); }
      k.redraw();
    });
    lp.play();
    /* double flèche du champ électrique dans le plan transverse */
    function eArrow(ctx, x, a, amp, col, wd){
      var r = a * PI / 180, ey = Math.cos(r) * amp, ez = Math.sin(r) * amp;
      var p0 = v.p(x, -ey, -ez), p1 = v.p(x, ey, ez);
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = wd || 2.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      [[p0, p1], [p1, p0]].forEach(function(pp){ var dx = pp[0].x - pp[1].x, dy = pp[0].y - pp[1].y, l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
        ctx.beginPath(); ctx.moveTo(pp[0].x, pp[0].y); ctx.lineTo(pp[0].x - dx * 7 - dy * 4, pp[0].y - dy * 7 + dx * 4); ctx.lineTo(pp[0].x - dx * 7 + dy * 4, pp[0].y - dy * 7 - dx * 4); ctx.closePath(); ctx.fill(); });
      ctx.restore();
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, L = elems(), pr = predicted(), i;
      zlab(ctx, W, H, "#1d2843", "#0a0f1c");
      v.sc = Math.min(W / (phone ? 12.6 : 13.2), H / 5.0); v.cx = W * 0.5 + 6; v.cy = H * 0.5; v.clear();
      HND = [];
      /* banc */
      zbench(v, -7.4, 6.8, -1.9, 1.9, -1.95);
      v.box(-6.9, -1.95, -0.22, 6.3, -1.75, 0.22, "#5d6878", {cols:[null, null, null, "#7a8597"]});
      if (mode === "banc"){
        /* source : laser atténué + polariseur réglable */
        v.box(-7.2, -0.55, -0.6, -5.9, 0.55, 0.6, "#39424f", {cols:[null, null, null, "#4a5566"]});
        v.cyl([-5.9, 0, 0], [-5.65, 0, 0], 0.42, 18, "#6b7a8e", {cap1:"#151a22", after1:function(cx2){ eArrow(cx2, -5.64, thS.value, 0.36, "#ffd34d", 2.4); }});
        v.box(-6.8, -1.75, -0.2, -6.3, -0.55, 0.2, "#4a5566");
        var hq = v.p(-5.62, 0.62 * Math.cos(thS.value * PI / 180), 0.62 * Math.sin(thS.value * PI / 180));
        HND.push({id:0, x:hq.x, y:hq.y, xw:-5.62});
        /* détecteur (photomultiplicateur) */
        v.cyl([X1 - 0.2, 0, 0], [X1 + 1.2, 0, 0], 0.55, 18, "#2f3a4a", {cap0:"#9fb6d6"});
        v.box(X1 + 0.2, -1.75, -0.2, X1 + 0.7, -0.55, 0.2, "#4a5566");
      } else {
        /* rétroéclairage, pixel */
        v.box(-6.4, -1.3, -1.3, -5.9, 1.3, 1.3, "#d9e6ff", {glow:true, line:"#ffffff"});
        var br = cnt.done > 20 ? Math.min(1, cnt.det / cnt.done * 2) : pr.det * 2, gcol = "rgb(" + Math.round(30 + 60 * br) + "," + Math.round(40 + 200 * br) + "," + Math.round(40 + 90 * br) + ")";
        v.box(X1 - 0.6, -1.0, -1.0, X1 - 0.45, 1.0, 1.0, gcol, {glow:true, line:"#9fe7b3"});
      }
      /* polariseurs (disques teintés, traits parallèles à l'axe) ou cellule à cristaux liquides */
      L.forEach(function(e){
        if (e.lc){
          v.box(-1.6, -1.15, -1.15, -1.5, 1.15, 1.15, "#bfe0ff", {alpha:0.25, glow:true, line:"rgba(200,230,255,.6)"});
          v.box(1.5, -1.15, -1.15, 1.6, 1.15, 1.15, "#bfe0ff", {alpha:0.25, glow:true, line:"rgba(200,230,255,.6)"});
          var V = vS.value, tw = phBeta(V) * PI / 180, tilt = Math.min(1, Math.max(0, (V - 0.8) / 2.2)) * 1.35;
          for (var a2 = 0; a2 < 7; a2++){
            var u = a2 / 6, xx = -1.35 + 2.7 * u, psi = tw * u, ti = tilt * Math.sin(PI * u);
            for (var yy = -0.7; yy <= 0.71; yy += 0.7) for (var zz = -0.7; zz <= 0.71; zz += 0.7){
              var dx = 0.18 * Math.sin(ti), dy = 0.18 * Math.cos(ti) * Math.cos(psi), dz = 0.18 * Math.cos(ti) * Math.sin(psi);
              v.cyl([xx - dx, yy - dy, zz - dz], [xx + dx, yy + dy, zz + dz], 0.045, 6, "#c48cff");
            }
          }
          v.box(-0.15, -1.75, -0.2, 0.15, -1.15, 0.2, "#4a5566");
          return;
        }
        var r = e.ax * PI / 180, R0 = 1.05;
        v.box(e.x - 0.12, -1.75, -0.18, e.x + 0.12, -R0, 0.18, "#4a5566");
        v.cyl([e.x - 0.04, 0, 0], [e.x + 0.04, 0, 0], R0, 28, "#2d3646", {alpha:0.72, cap0:"#3a4a5e", cap1:"#3a4a5e", after1:function(cx2){
          cx2.save(); cx2.strokeStyle = "rgba(220,235,255,.55)"; cx2.lineWidth = 1;
          for (var q = -0.8; q <= 0.81; q += 0.2){
            var h = Math.sqrt(Math.max(0, R0 * R0 * 0.92 - q * q)), ny = -Math.sin(r), nz = Math.cos(r);
            var a0 = v.p(e.x + 0.05, q * ny - h * Math.cos(r), q * nz - h * Math.sin(r)), a1 = v.p(e.x + 0.05, q * ny + h * Math.cos(r), q * nz + h * Math.sin(r));
            cx2.beginPath(); cx2.moveTo(a0.x, a0.y); cx2.lineTo(a1.x, a1.y); cx2.stroke();
          }
          cx2.restore();
        }});
        if (e.id >= 2){ var kq = v.p(e.x + 0.06, 1.2 * Math.cos(r), 1.2 * Math.sin(r)); HND.push({id:e.id, x:kq.x, y:kq.y, xw:e.x + 0.06}); }
      });
      /* photons en vol */
      fly.forEach(function(ph){
        v.sprite(ph.x, 0, 0, function(cx2, q){
          zglow(cx2, q.x, q.y, 15 * q.s, "#ffe680", 0.55);
          eArrow(cx2, ph.x, ph.a, 0.42 * Math.sin(ph.ph), "#ffd34d", 1.8);
          zball(cx2, q.x, q.y, 3.2 * q.s, "#fff3b0");
        }, 0.4);
      });
      v.render(ctx);
      flashes.forEach(function(f){ var q = v.p(f.x, 0, 0); zglow(ctx, q.x, q.y, 26 * (1 - f.t * 2) + 4, "#ff5a3c", 0.8 * (1 - f.t * 2)); });
      /* poignées */
      HND.forEach(function(h){ zglow(ctx, h.x, h.y, 14, h.id ? "#7fd4ff" : "#ffd34d", grab === h ? 0.7 : 0.35); zball(ctx, h.x, h.y, 5.5, h.id ? "#7fd4ff" : "#ffd34d"); });
      /* étiquettes */
      if (mode === "banc"){
        var sq = v.p(-6.55, 1.0, 0), dq = v.p(X1 + 0.5, 1.0, 0);
        ztag(S, c, "source : θ = " + zN(thS.value, 0) + "°", sq.x, sq.y, {size:10.5, color:"#ffe39a"});
        ztag(S, c, "détecteur : " + cnt.det, dq.x, dq.y, {size:10.5, color:"#bfe0ff"});
        L.forEach(function(e, j){ var q = v.p(e.x, 1.45, 0); ztag(S, c, e.nm + " : " + zN(e.ax, 0) + "°", q.x, q.y, {size:10.5, color:j ? "#bfe7ff" : "#eef3fb"}); });
        var q1 = v.p(L[0].x, -1.0, 1.25);
        ztag(S, c, "passés " + cnt.p1 + " · absorbés " + cnt.a1, q1.x, q1.y + 6, {size:10.5, color:"#c9f2d6"});
      } else {
        var bq = v.p(-6.15, 1.6, 0), cq = v.p(0, 1.55, 0), pq = v.p(X1 - 0.5, 1.4, 0), aq = v.p(-2.7, -1.25, 1.1), nq = v.p(2.7, -1.25, 1.1);
        ztag(S, c, "rétroéclairage", bq.x, bq.y, {size:10.5});
        ztag(S, c, "cristal liquide : rotation " + zN(phBeta(vS.value), 0) + "°", cq.x, cq.y, {size:10.5, color:"#e2c8ff"});
        ztag(S, c, "pixel", pq.x, pq.y, {size:10.5, color:"#bff5cf"});
        if (!phone){ ztag(S, c, "polariseur 0°", aq.x, aq.y + 8, {size:10}); ztag(S, c, "analyseur 90°", nq.x, nq.y + 8, {size:10}); }
      }
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      if (mode === "banc") ztag(S, c, "poignées : tourner θ et les axes", 8, H - 16, {size:10, align:"left", color:"#ffe39a"});

      /* ---- convergence et barres ---- */
      var gx = g.ctx, GW = g.W, GH = g.H;
      gx.fillStyle = "#f4f6fa"; gx.fillRect(0, 0, GW, GH);
      var wa = phone ? GW - 12 : Math.round(GW * 0.6), ha = phone ? Math.round(GH * 0.55) : GH - 12;
      var nmax = Math.max(20, cnt.done), lx = function(n){ return Math.log10(Math.max(1, n)); };
      var ax = zframe(S, g, 6, 6, wa, ha, 0, Math.max(1.3, lx(nmax)), 0, 1.05, {title:"Fraction mesurée", l:30, b:30});
      zT(S, g, "photons (échelle log)", ax.R, ax.B + 22, {size:zfz(g, 10), color:"#5f6b7a", align:"right", weight:700});
      [0, 0.5, 1].forEach(function(yv){ var Y = ax.Y(yv); gx.save(); gx.strokeStyle = "#e6eaf0"; gx.beginPath(); gx.moveTo(ax.L, Y); gx.lineTo(ax.R, Y); gx.stroke(); gx.restore(); zT(S, g, zN(yv, 1), ax.L - 5, Y, {size:zfz(g, 10), color:"#5f6b7a", align:"right", weight:600}); });
      for (var dd = 1; dd <= nmax * 1.0001; dd *= 10){ var Xd = ax.X(lx(dd)); zT(S, g, String(dd), Xd, ax.B + 10, {size:zfz(g, 9.5), color:"#5f6b7a", weight:600}); }
      function hline(yv, col){ var Y = ax.Y(yv); gx.save(); gx.setLineDash([5, 4]); gx.strokeStyle = col; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(ax.L, Y); gx.lineTo(ax.R, Y); gx.stroke(); gx.restore(); }
      hline(pr.p1, "#2f6fd6"); hline(pr.det, "#1f9a5a");
      function trace(idx, col){ if (hist.length < 2) return; gx.save(); gx.beginPath(); var st = Math.max(1, Math.floor(hist.length / 600)); for (var q = 0; q < hist.length; q += st){ var hh = hist[q], X = ax.X(lx(hh[0])), Y = ax.Y(hh[idx]); if (q) gx.lineTo(X, Y); else gx.moveTo(X, Y); } gx.strokeStyle = col; gx.lineWidth = 1.8; gx.stroke(); gx.restore(); }
      trace(1, "#2f6fd6"); trace(2, "#1f9a5a");
      var lgx = ax.R - 4; [["- - prévu", "#5f6b7a"], ["détecteur", "#1f9a5a"], [mode === "lcd" ? "polariseur" : "P1", "#2f6fd6"]].forEach(function(it){ zT(S, g, it[0], lgx, 18, {size:zfz(g, 10), color:it[1], align:"right"}); lgx -= zW(g, it[0], zfz(g, 10), 700) + 10; });
      /* barres */
      var bx = phone ? 6 : wa + 12, by = phone ? ha + 12 : 6, bw = phone ? GW - 12 : GW - wa - 18, bh = phone ? GH - ha - 18 : GH - 12;
      gx.save(); zrr(gx, bx, by, bw, bh, 8); gx.fillStyle = "#ffffff"; gx.fill(); gx.strokeStyle = "#dfe4ec"; gx.stroke(); gx.restore();
      var m1 = cnt.p1 + cnt.a1 ? cnt.p1 / (cnt.p1 + cnt.a1) : 0, md = cnt.done ? cnt.det / cnt.done : 0;
      var bars = [[mode === "lcd" ? "passe pol." : "passe P1", m1, pr.p1, "#2f6fd6"], [mode === "lcd" ? "absorbé pol." : "absorbé P1", cnt.p1 + cnt.a1 ? 1 - m1 : 0, 1 - pr.p1, "#c0392b"], ["détecteur", md, pr.det, "#1f9a5a"]];
      var bL = bx + 84, bR = bx + bw - 44, rowH = (bh - 26) / 3;
      zT(S, g, "mesuré (barre) · prévu (trait)", bx + 10, by + 12, {size:zfz(g, 10.5), color:"#13233a", align:"left"});
      bars.forEach(function(bb, q){
        var yc = by + 26 + rowH * (q + 0.5);
        zT(S, g, bb[0], bL - 6, yc, {size:zfz(g, 10.5), color:"#2c3a4e", align:"right", weight:700});
        gx.fillStyle = "#eef1f5"; gx.fillRect(bL, yc - 7, bR - bL, 14);
        gx.fillStyle = bb[3]; gx.fillRect(bL, yc - 7, (bR - bL) * bb[1], 14);
        var Xp = bL + (bR - bL) * bb[2]; gx.strokeStyle = "#13233a"; gx.lineWidth = 2; gx.beginPath(); gx.moveTo(Xp, yc - 11); gx.lineTo(Xp, yc + 11); gx.stroke();
        zT(S, g, zN(100 * bb[1], 0) + " %", bR + 4, yc, {size:zfz(g, 10.5), color:bb[3], align:"left"});
      });

      /* ---- afficheurs ---- */
      var th = thS.value;
      if (mode === "lcd"){
        ro.set(0, "½ (lumière non polarisée)");
        ro.set(2, "½ sin²β = " + zN(100 * pr.det, 1) + " %");
      } else {
        ro.set(0, "cos²θ = " + zN(100 * pr.p1, 1) + " %");
        ro.set(2, zN(100 * pr.det, 1) + " %");
      }
      ro.set(1, cnt.p1 + cnt.a1 ? zN(100 * m1, 1) + " %" : "—");
      ro.set(3, cnt.done ? zN(100 * md, 1) + " %" : "—");
      ro.set(4, String(cnt.n));
      var msg;
      if (mode === "lcd") msg = vS.value <= 1 ? "Sans tension (ou sous 1 V), le cristal tourne la polarisation de 90° : la lumière franchit l'analyseur horizontal, le pixel est allumé. La moitié des photons du rétroéclairage, non polarisé, est déjà perdue au premier polariseur." :
        vS.value >= 3 ? "Au-delà de 3 V, les molécules s'alignent sur le champ : la polarisation n'est plus tournée, l'analyseur horizontal arrête tout, le pixel est éteint." :
        "Sous " + zN(vS.value, 2) + " V, le cristal ne tourne plus la polarisation que de β = " + zN(phBeta(vS.value), 0) + "° : l'analyseur laisse passer sin²β de ce qui sort du premier polariseur, le pixel est gris.";
      else if (+nS.value === 1) msg = "Chaque photon passe (probabilité cos²θ) ou est absorbé (sin²θ). Au début les fractions fluctuent, puis elles se rapprochent des valeurs prévues.";
      else if (+nS.value === 2) msg = "Après P1, tout photon qui a passé est vertical : P2 le laisse passer avec la probabilité cos²(φ₂), quel que soit θ. La mesure a réduit son état.";
      else if (L[1].ax === 45 && L[2].ax === 90) msg = "Avec P1 à 0° et P3 à 90°, sans P2, rien ne passerait ; mais un P2 à 45° entre les deux laisse passer cos²θ × ¼ des photons : chaque polariseur refait la mesure.";
      else msg = "Chaque polariseur refait la mesure : au détecteur, cos²θ·cos²φ₂·cos²(φ₃ − φ₂) = " + zN(100 * pr.det, 1) + "\u00a0%.";
      nt.set(msg, "ok");
    });
  }
});
})();
