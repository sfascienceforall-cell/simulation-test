/* Physique quantique · lot Q2 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq01 : pq-desintegration-neutron · pq-zoom-matiere-interactions · pq-accelerateur-energie-impulsion · pq-lorentz-horloges
   pq02 : pq-corps-noir-catastrophe-uv · pq-compton
   Aucune ressource externe : la 3D est une projection faite main (faces et sprites triés par profondeur).
   Fichier autonome : toutes les aides portent le préfixe w (W3 pour le moteur 3D). */
(function(){
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018, PDG 2024) ---------- */
var HP = 6.62607015e-34, HB = HP / TAU, ME = 9.1093837015e-31, QE = 1.602176634e-19, CL = 2.99792458e8, KB = 1.380649e-23;
var HBARC = 197.3269804;               /* MeV·fm */
var ALPHA = 1 / 137.035999084;
var MN_MEV = 939.56542052, MP_MEV = 938.27208816, ME_MEV = 0.51099895000;

/* ---------- petites aides (préfixe w) ---------- */
function wrgb(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function wshade(col, f){
  var c = typeof col === "string" ? wrgb(col) : col;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function wa(col, a){ var c = typeof col === "string" ? wrgb(col) : col; return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
function wfz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function wN(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d == null ? 2 : d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
var WSUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
function wsup(e){ return String(e).split("").map(function(ch){ return WSUP[ch]; }).join(""); }
/* notation scientifique : d chiffres après la virgule de la mantisse (html : exposant en <sup>) */
function wsci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return wN(x, Math.max(0, d - e));
  return wN(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : wsup(e));
}
function wT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function wrr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function wball(ctx, x, y, r, col, alpha){
  if (!isFinite(x) || !isFinite(y) || !(r > 0)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, wshade(col, 0.75)); g.addColorStop(0.45, wshade(col, 0)); g.addColorStop(1, wshade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, TAU); ctx.fill(); ctx.restore();
}
function wglow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, wa(col, a == null ? 0.8 : a)); g.addColorStop(1, wa(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
function wclamp(x, a, b){ return Math.max(a, Math.min(b, x)); }
/* flèche à pointe pleine, sur un contexte quelconque */
function warrow(ctx, x1, y1, x2, y2, col, w){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (!(L > 0.5)) return;
  var a = Math.atan2(dy, dx), h = Math.min(7 + w * 2, L * 0.55);
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
  ctx.lineTo(x2 - h * 0.7 * Math.cos(a), y2 - h * 0.7 * Math.sin(a)); ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill();
  ctx.restore();
}
/* graduation « ronde » : pas proche de span/n (jamais nul) */
function wstep(span, n){ if (!(span > 0) || !isFinite(span)) return 1; var s = span / n, p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
/* fond de laboratoire sombre */
function wlab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* étiquette claire sur fond sombre, bornée au cadre ; renvoie la boîte */
function wtag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = wfz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  bx = Math.max(3, Math.min(c.W - w - 3, bx)); var by = Math.max(3, Math.min(c.H - h - 3, y - h / 2));
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.74)"; wrr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1.2; ctx.stroke(); }
  ctx.restore();
  wT(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}
/* étiquette qui évite celles déjà posées (liste placed) : décalée verticalement si besoin */
function wtagA(S, c, s, x, y, o, placed){
  o = o || {}; var size = wfz(c, o.size || 12), w = wmeas(c.ctx, s, size, o.weight || 800) + 12, h = size + 8, yy = y;
  var al = o.align || "center";
  function box(y0){ var bx = al === "left" ? x : al === "right" ? x - w : x - w / 2; bx = Math.max(3, Math.min(c.W - w - 3, bx)); return {x:bx, y:Math.max(3, Math.min(c.H - h - 3, y0 - h / 2)), w:w, h:h}; }
  function hit(b){ for (var i = 0; i < placed.length; i++){ var q = placed[i]; if (b.x < q.x + q.w + 2 && q.x < b.x + b.w + 2 && b.y < q.y + q.h + 2 && q.y < b.y + b.h + 2) return true; } return false; }
  /* essais de plus en plus loin, en haut puis en bas ; la position retenue est celle de la boîte déjà ramenée dans le cadre */
  var tries = [0, -1, 1, -2, 2, -3, 3, 4, -4, 5, -5, 6, -6];
  for (var t = 0; t < tries.length; t++){ var cand = box(y + tries[t] * (h + 3)); if (!hit(cand)){ yy = cand.y + h / 2; break; } }
  var r = wtag(S, c, s, x, yy, o); placed.push(r); return r;
}
/* largeur d'un texte */
function wmeas(ctx, s, size, weight){ ctx.save(); ctx.font = (weight || 700) + " " + size + "px Mulish, system-ui, sans-serif"; var w = ctx.measureText(s).width; ctx.restore(); return w; }
/* tirage gaussien */
function wgauss(){ var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }

/* ---------- moteur 3D minimal : vue orbitale, faces planes éclairées, sprites, tri par profondeur ---------- */
function W3(){ this.a = -0.5; this.b = 0.35; this.sc = 40; this.cx = 0; this.cy = 0; this.f = 14; this.L = []; this.set(); }
W3.prototype.set = function(){ this.ca = Math.cos(this.a); this.sa = Math.sin(this.a); this.cb = Math.cos(this.b); this.sb = Math.sin(this.b); };
/* monde (x, y vers le haut, z) → vue (x à droite, y en haut, z vers toi) */
W3.prototype.rot = function(x, y, z){
  var x1 = x * this.ca + z * this.sa, z1 = -x * this.sa + z * this.ca;
  return [x1, y * this.cb - z1 * this.sb, y * this.sb + z1 * this.cb];
};
W3.prototype.pv = function(v){ var s = this.f ? this.f / Math.max(0.2, this.f - v[2]) : 1; return {x:this.cx + v[0] * this.sc * s, y:this.cy - v[1] * this.sc * s, z:v[2], s:s}; };
W3.prototype.p = function(x, y, z){ return this.pv(this.rot(x, y, z)); };
W3.prototype.clear = function(){ this.L = []; };
W3.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
W3.prototype.sprite = function(x, y, z, fn, dz){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + (dz || 1e-3), fn:fn, v:v}); };
W3.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], q = {c:c, cull:true, alpha:o.alpha, line:o.line, glow:o.glow};
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    var cc = o.cols ? o.cols[i] || col : col, qq = q;
    if (o.after && o.afterFace === i) qq = {c:c, cull:true, alpha:o.alpha, line:o.line, after:o.after};
    this.face(f.map(function(j){ return P[j]; }), cc, qq);
  }, this);
};
/* cylindre de l'axe p0 → p1, rayon r (r1 au bout), n côtés */
W3.prototype.cyl = function(p0, p1, r, n, col, o){
  o = o || {}; n = n || 14;
  var ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], la = Math.hypot(ax[0], ax[1], ax[2]) || 1; ax = [ax[0] / la, ax[1] / la, ax[2] / la];
  var t = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  var u = [ax[1] * t[2] - ax[2] * t[1], ax[2] * t[0] - ax[0] * t[2], ax[0] * t[1] - ax[1] * t[0]], lu = Math.hypot(u[0], u[1], u[2]); u = [u[0] / lu, u[1] / lu, u[2] / lu];
  var w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
  var r1 = o.r1 == null ? r : o.r1, c = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2], q = {c:c, cull:!o.nocull, alpha:o.alpha, glow:o.glow};
  var A = [], B = [], i;
  for (i = 0; i < n; i++){
    var th = i / n * TAU, cs = Math.cos(th), sn = Math.sin(th);
    A.push([p0[0] + r * (cs * u[0] + sn * w[0]), p0[1] + r * (cs * u[1] + sn * w[1]), p0[2] + r * (cs * u[2] + sn * w[2])]);
    B.push([p1[0] + r1 * (cs * u[0] + sn * w[0]), p1[1] + r1 * (cs * u[1] + sn * w[1]), p1[2] + r1 * (cs * u[2] + sn * w[2])]);
  }
  for (i = 0; i < n; i++){ var j = (i + 1) % n; this.face([A[i], A[j], B[j], B[i]], col, q); }
  if (!o.open){ this.face(A.slice(), o.cap0 || col, {c:c, cull:true, alpha:o.alpha, glow:o.capGlow}); this.face(B.slice(), o.cap1 || col, {c:c, cull:true, alpha:o.alpha, glow:o.capGlow}); }
};
/* anneau épais (tore grossier) d'axe x, centre (x0, 0, 0) — bobines */
W3.prototype.ring = function(x0, R, r, col, n, m){
  n = n || 28; m = m || 8;
  for (var i = 0; i < n; i++) for (var j = 0; j < m; j++){
    var P = [];
    [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].forEach(function(ij){
      var a = ij[0] / n * TAU, b = ij[1] / m * TAU, rr = R + r * Math.cos(b);
      P.push([x0 + r * Math.sin(b), rr * Math.cos(a), rr * Math.sin(a)]);
    });
    var a0 = (i + 0.5) / n * TAU, cR = [x0, R * Math.cos(a0), R * Math.sin(a0)];
    this.face(P, col, {c:cR, cull:true});
  }
};
W3.prototype.render = function(ctx){
  var self = this, L = this.L, Lt = [-0.42, 0.62, 0.66], i;
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
    var dif = Math.max(0, nn[0] * Lt[0] + nn[1] * Lt[1] + nn[2] * Lt[2]) / Math.hypot(Lt[0], Lt[1], Lt[2]);
    var fill = d.o.glow ? d.col : wshade(d.col, -0.5 + 0.72 * dif);
    ctx.save(); if (d.o.alpha != null) ctx.globalAlpha = d.o.alpha;
    ctx.beginPath();
    d.V.forEach(function(v, j){ var p = self.pv(v); if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.lineJoin = "round"; ctx.lineWidth = d.o.line ? 1.2 : 0.7; ctx.strokeStyle = d.o.line || fill; ctx.stroke();
    ctx.restore();
    if (d.o.after) d.o.after(ctx, d);
  }
};
/* glisser pour tourner la vue ; onDrag("down", p) peut renvoyer false pour garder la main */
function worbit(c, v, k, lim, onDrag){
  var st = {lx:null, own:false};
  c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
  c.pointer(function(type, p){
    if (type === "down"){
      st.own = !!(onDrag && onDrag("down", p) === false);
      if (!st.own){ st.lx = p.x; st.ly = p.y; c.cv.style.cursor = "grabbing"; }
    }
    if (type === "drag"){
      if (st.own){ if (onDrag) onDrag("drag", p); return; }
      if (st.lx == null) return;
      v.a += (p.x - st.lx) * 0.01; v.b = Math.max(lim ? lim[0] : -1.4, Math.min(lim ? lim[1] : 1.4, v.b + (p.y - st.ly) * 0.01));
      st.lx = p.x; st.ly = p.y; v.set(); v.user = true; k.redraw();
    }
    if (type === "move" && onDrag) onDrag("move", p);
    if (type === "up"){ if (st.own && onDrag) onDrag("up", p); st.lx = null; st.own = false; c.cv.style.cursor = "grab"; }
  });
  return st;
}

/* =====================================================================
   1. Désintégration β⁻ du neutron (pq01)
   ===================================================================== */
var NU_TAU = 878.4;   /* durée de vie moyenne du neutron (s), moyenne PDG 2024 */
/* énergie cinétique maximale de l'électron (MeV) : antineutrino d'énergie nulle, proton + ν̄ de masse invariante m_p */
var NU_T0 = (MN_MEV * MN_MEV + ME_MEV * ME_MEV - MP_MEV * MP_MEV) / (2 * MN_MEV) - ME_MEV;
/* spectre permis : N(T) ∝ p·E·(T0 − T)²·F(E), F = fonction de Fermi non relativiste (Z = 1) */
function nuSpec(T){
  if (T <= 0 || T >= NU_T0) return 0;
  var E = T + ME_MEV, p = Math.sqrt(T * T + 2 * T * ME_MEV), eta = ALPHA * E / p, F = TAU * eta / (1 - Math.exp(-TAU * eta));
  return p * E * Math.pow(NU_T0 - T, 2) * F;
}
var NU_MAX = (function(){ var m = 0; for (var i = 1; i < 2000; i++) m = Math.max(m, nuSpec(i / 2000 * NU_T0)); return m * 1.02; })();
var NU_Z = (function(){ var z = 0; for (var i = 0; i < 4000; i++) z += nuSpec((i + 0.5) / 4000 * NU_T0) * NU_T0 / 4000; return z; })();
var NU_MEAN = (function(){ var s = 0, z = 0; for (var i = 0; i < 4000; i++){ var T = (i + 0.5) / 4000 * NU_T0, f = nuSpec(T); s += T * f; z += f; } return s / z; })();
function nuDraw(){ for (var t = 0; t < 5000; t++){ var T = Math.random() * NU_T0; if (Math.random() * NU_MAX < nuSpec(T)) return T; } return NU_MEAN; }
var NXL = 3.7;
/* position d'un quark dans le nucléon (rayon 0,78), triangle qui tourne */
function nuQuark(rot, j){ var a = rot + j * TAU / 3, tilt = 0.55; return [0.78 * Math.cos(a), 0.78 * Math.sin(a) * Math.cos(tilt) + 0.06 * Math.sin(rot * 3 + j), 0.78 * Math.sin(a) * Math.sin(tilt)]; }
function nuRandDir(){ var u = 2 * Math.random() - 1, ph = Math.random() * TAU, s = Math.sqrt(1 - u * u); return [s * Math.cos(ph), u, s * Math.sin(ph)]; }
/* cinématique complète : renvoie impulsions (MeV/c) et énergies de e⁻, ν̄, p (conservation exacte de E et de p) */
function nuKin(withNu){
  var T = withNu ? nuDraw() : NU_T0, Ee = T + ME_MEV, pe = Math.sqrt(T * T + 2 * T * ME_MEV), de = nuRandDir();
  var Pe = [pe * de[0], pe * de[1], pe * de[2]], Pn = [0, 0, 0], En = 0;
  if (withNu){
    var dn = nuRandDir(), ct = de[0] * dn[0] + de[1] * dn[1] + de[2] * dn[2], A = MN_MEV - Ee;
    En = (A * A - MP_MEV * MP_MEV - pe * pe) / (2 * (A + pe * ct));
    if (En < 0) En = 0;
    Pn = [En * dn[0], En * dn[1], En * dn[2]];
  }
  var Pp = [-Pe[0] - Pn[0], -Pe[1] - Pn[1], -Pe[2] - Pn[2]], pp = Math.hypot(Pp[0], Pp[1], Pp[2]);
  var Tp = pp * pp / (Math.sqrt(MP_MEV * MP_MEV + pp * pp) + MP_MEV);   /* = √(m² + p²) − m, sans perte de chiffres */
  return {T:T, Ee:Ee, pe:pe, Pe:Pe, En:En, Pn:Pn, Pp:Pp, pp:pp, Tp:Tp};
}

SFA.sim({
  id:"pq-desintegration-neutron", ch:"pq01", tag:"Interaction faible",
  titre:"Désintégration β⁻ du neutron et neutrino invisible",
  resume:"Un neutron (u, d, d) devient un proton : un quark d se change en u et émet un électron et un antineutrino qu'aucun détecteur ne voit.",
  but:"Regarde le neutron se désintégrer au hasard (temps accéléré), puis l'histogramme des énergies de l'électron se remplir. Passe à l'hypothèse « sans neutrino » pour voir la raie qu'on attendrait. Glisse sur la scène pour tourner autour de la chambre.",
  aRetenir:"n → p + e⁻ + ν̄ₑ : l'énergie se partage à trois, d'où un spectre continu pour l'électron.",
  piege:"Sans l'antineutrino, l'électron aurait toujours la même énergie et le nombre leptonique ne serait pas conservé.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 390), f = k.canvas(phone ? 230 : 250);
    var mode = "nu";
    var hS = k.seg("Hypothèse", [["nu", "Avec antineutrino (réel)"], ["sans", "Sans neutrino"]], "nu", function(v){ mode = v; last = null; newNeutron(); });
    var rS = k.seg("Désintégrations ajoutées à l'histogramme", [["1", "Celle qu'on voit"], ["20", "20 par s"], ["200", "200 par s"]], "20");
    var aS = k.slider("Accélération du temps", 100, 1000, 50, 400, "×");
    k.button("Vider les histogrammes", function(){ hist[0] = new Float64Array(NB); hist[1] = new Float64Array(NB); nTot = [0, 0]; sumT = [0, 0]; });
    var ro = k.readouts(["Énergie libérée Q", "Électron : T", "Antineutrino : E", "Recul du proton", "Désintégrations comptées", "T moyen de l'histogramme"]);
    var nt = k.note("", "ok");
    var NB = 45, TMAXH = 0.9, hist = [new Float64Array(NB), new Float64Array(NB)], nTot = [0, 0], sumT = [0, 0], acc = 0;
    var cur = null, last = null;   /* neutron suivi ; dernière désintégration (pour les afficheurs) */
    function hidx(){ return mode === "nu" ? 0 : 1; }
    function addHist(T){ var j = hidx(), b = Math.floor(T / TMAXH * NB); if (b >= 0 && b < NB) hist[j][b]++; nTot[j]++; sumT[j] += T; }
    function newNeutron(){
      var u = 1 - Math.random();
      cur = {age:0, td:-NU_TAU * Math.log(u), dec:null, s:0, fade:0, e:null, which:Math.random() < 0.5 ? 1 : 2, rot:Math.random() * TAU, o0:[0, 0, 0], base:[0, 0, 0]};
    }
    newNeutron();
    /* ---- vue 3D ---- */
    var v = new W3(); v.a = -0.42; v.b = 0.3; v.f = 18; v.set();
    worbit(c, v, k, [-0.5, 1.2]);
    var lp = k.loop(function(dt, t){
      var A = aS.value;
      cur.rot += dt * (cur.dec ? 0.25 : 0.9);
      if (!cur.dec){
        cur.age += dt * A; cur.fade = Math.min(1, cur.fade + dt * 2.5);
        if (cur.age >= cur.td){
          var kin = nuKin(mode === "nu"); cur.dec = kin; cur.s = 0; last = kin;
          addHist(kin.T); /* la désintégration qu'on regarde compte toujours */
          /* trajectoires : électron guidé par le champ (hélice le long de x) vers un détecteur, proton lent, ν̄ en ligne droite */
          var dir = kin.Pe[0] >= 0 ? 1 : -1;
          cur.o0 = nuQuark(cur.rot, cur.which); cur.base = [cur.o0[0] * 2.3, cur.o0[1] * 2.3, cur.o0[2] * 2.3];
          var vx = 2.2 * (0.45 + kin.pe / 1.3);
          cur.e = {dir:dir, vx:vx, r:0.15 + 0.25 * Math.hypot(kin.Pe[1], kin.Pe[2]) / kin.pe, ph:Math.atan2(kin.Pe[2], kin.Pe[1]), sHit:0.3 + (NXL - dir * cur.base[0]) / vx};
        }
      } else {
        cur.s += dt;
        if (cur.s > 3.4) newNeutron();
      }
      /* désintégrations d'autres neutrons du faisceau, comptées sans être montrées */
      var rate = +rS.value;
      if (rate > 1){ acc += dt * rate; while (acc >= 1){ acc -= 1; addHist(mode === "nu" ? nuDraw() : NU_T0); } }
      if (!v.user){ v.a = -0.42 + 0.2 * Math.sin(t * 0.21); v.set(); }
      k.redraw();
    });
    lp.play();
    var COLU = "#ff7a45", COLD = "#3fa4ff", COLE = "#5ad1ff", COLNU = "#e9e3ff", COLP = "#ff5a6e";
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i;
      wlab(ctx, W, H, "#1b2742", "#070b16");
      v.sc = Math.min(W / (phone ? 10.0 : 10.6), H / 6.0); v.cx = W * 0.5; v.cy = H * 0.56; v.clear();
      var XL = NXL, RC = 2.2, d = cur.dec, s = cur.s;
      var hitI = d && s >= cur.e.sHit ? Math.max(0, 1 - (s - cur.e.sHit) / 0.9) : 0;
      /* chambre : bobines du champ guide et tube à vide (anneaux) */
      [-2.9, -1.75, 1.75, 2.9].forEach(function(x){ v.ring(x, RC + 0.16, 0.12, "#b8742e", 28, 6); });
      [-3.3, -2.3, 2.3, 3.3].forEach(function(x){ v.ring(x, RC, 0.03, "#7d8aa0", 28, 4); });
      /* détecteurs d'électrons (scintillateurs) aux deux bouts */
      [-1, 1].forEach(function(sg){
        var hit = d && cur.e && cur.e.dir === sg ? hitI : 0;
        var col = hit > 0 ? "#9ff3ff" : "#2c5c7a";
        v.cyl([sg * XL, 0, 0], [sg * (XL + 0.35), 0, 0], RC * 0.95, 24, "#4a5568", {cap0:col, cap1:"#2a3140", capGlow:hit > 0});
        v.box(sg * (XL + 0.35), -RC * 0.5, -0.4, sg * (XL + 1.1), RC * 0.5, 0.4, "#39414f");
      });
      /* socle */
      v.box(-XL - 0.9, -RC - 0.75, -1.0, XL + 0.9, -RC - 0.55, 1.0, "#3a4252");
      [-2.9, 2.9].forEach(function(x){ v.box(x - 0.15, -RC - 0.55, -0.15, x + 0.15, -RC - 0.2, 0.15, "#59657a"); });
      /* neutron (ou proton) : coquille + trois quarks reliés par des gluons */
      var Rn = 1.62, Q = [0, 1, 2].map(function(j){ return nuQuark(cur.rot, j); });
      var qBox = [], wPos = null;   /* positions à l'écran des quarks et du W⁻, pour placer les étiquettes après le rendu */
      var flav = ["u", "d", "d"], recoil = [0, 0, 0];
      if (d){
        flav[cur.which] = s < 0.28 ? (Math.floor(s * 20) % 2 ? "u" : "d") : "u";
        /* recul du proton, exagéré pour être visible (il est en réalité 2000 fois plus lent que l'électron) */
        var kr = Math.min(1, s / 3) * 0.55 / Math.max(0.05, d.pp);
        recoil = [d.Pp[0] * kr * 0.6, d.Pp[1] * kr * 0.6, d.Pp[2] * kr * 0.6];
      }
      var alphaN = cur.fade * (d && s > 3.0 ? Math.max(0, (3.4 - s) / 0.4) : 1);
      var cpos = [recoil[0], recoil[1], recoil[2]];
      v.sprite(cpos[0], cpos[1], cpos[2], function(g, q){
        var r = Rn * v.sc * q.s;
        g.save(); g.globalAlpha = alphaN;
        var col = d && s > 0.28 ? COLP : "#9aa8c0";
        var gr = g.createRadialGradient(q.x - r * 0.3, q.y - r * 0.35, r * 0.1, q.x, q.y, r);
        gr.addColorStop(0, wa(col, 0.20)); gr.addColorStop(0.75, wa(col, 0.10)); gr.addColorStop(1, wa(col, 0.34));
        g.fillStyle = gr; g.beginPath(); g.arc(q.x, q.y, r, 0, TAU); g.fill();
        g.strokeStyle = wa(col, 0.55); g.lineWidth = 1.4; g.stroke();
        g.restore();
      }, -0.001);
      /* gluons : ressorts entre quarks */
      for (i = 0; i < 3; i++){
        (function(a, b){
          var A = [cpos[0] + Q[a][0], cpos[1] + Q[a][1], cpos[2] + Q[a][2]], B = [cpos[0] + Q[b][0], cpos[1] + Q[b][1], cpos[2] + Q[b][2]];
          var m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2];
          v.sprite(m[0], m[1], m[2], function(g){
            var P = v.p(A[0], A[1], A[2]), R = v.p(B[0], B[1], B[2]), dx = R.x - P.x, dy = R.y - P.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
            g.save(); g.globalAlpha = alphaN * 0.9; g.strokeStyle = "#ffe066"; g.lineWidth = 1.6; g.beginPath();
            for (var j = 0; j <= 40; j++){ var u = j / 40, w = Math.sin(u * TAU * 5 + performance.now() / 120) * 3.2 * Math.sin(PI * u); var X = P.x + dx * u + nx * w, Y = P.y + dy * u + ny * w; if (j) g.lineTo(X, Y); else g.moveTo(X, Y); }
            g.stroke(); g.restore();
          }, -0.0005);
        })(i, (i + 1) % 3);
      }
      Q.forEach(function(q3, j){
        v.sprite(cpos[0] + q3[0], cpos[1] + q3[1], cpos[2] + q3[2], function(g, q){
          var r = 0.33 * v.sc * q.s, col = flav[j] === "u" ? COLU : COLD;
          if (d && j === cur.which && s < 0.6) wglow(g, q.x, q.y, r * 3.2, "#fff2a8", 0.7 * (1 - s / 0.6));
          g.save(); g.globalAlpha = alphaN; wball(g, q.x, q.y, r, col); g.restore();
          if (r > 7){ g.save(); g.globalAlpha = alphaN; wT(S, c, flav[j], q.x, q.y + 0.5, {size:Math.min(15, r * 0.95), color:"#fff", weight:800}); g.restore(); }
          if (alphaN > 0.3) qBox.push({x:q.x - r * 0.6, y:q.y - r * 0.6, w:r * 1.2, h:r * 1.2});
        });
      });
      /* produits de la désintégration */
      var o0 = cur.o0;
      if (d){
        /* W⁻ virtuel : trait ondulé qui sort du quark puis disparaît */
        if (s < 0.45){
          var u0 = Math.min(1, s / 0.3), wx = o0[0] * (1 + 1.3 * u0), wy = o0[1] * (1 + 1.3 * u0), wz = o0[2] * (1 + 1.3 * u0);
          v.sprite(wx, wy, wz, function(g, q){
            var P = v.p(o0[0], o0[1], o0[2]);
            g.save(); g.strokeStyle = "#ffd34d"; g.lineWidth = 2.2; g.beginPath();
            var dx = q.x - P.x, dy = q.y - P.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
            for (var j = 0; j <= 24; j++){ var uu = j / 24, w = Math.sin(uu * TAU * 3) * 4; var X = P.x + dx * uu + nx * w, Y = P.y + dy * uu + ny * w; if (j) g.lineTo(X, Y); else g.moveTo(X, Y); }
            g.stroke(); wglow(g, q.x, q.y, 16, "#ffd34d", 0.8); g.restore();
            wPos = {x:q.x, y:q.y - 22};
          }, 0.5);
        }
        var se = Math.max(0, s - 0.3);
        if (s >= 0.3){
          var base = cur.base, vx = cur.e.vx;
          /* électron : hélice autour d'une ligne de champ, vers le détecteur */
          var xe = base[0] + cur.e.dir * vx * se, done = Math.abs(xe) >= XL;
          if (done) xe = cur.e.dir * XL;
          var ang = cur.e.ph + se * 6 * cur.e.dir, ye = base[1] * 0.6 + cur.e.r * Math.cos(ang), ze = base[2] * 0.6 + cur.e.r * Math.sin(ang);
          var trail = [];
          for (i = 0; i <= 80; i++){ var ss = se * i / 80, xx = base[0] + cur.e.dir * vx * ss; if (Math.abs(xx) > XL) break; var aa = cur.e.ph + ss * 6 * cur.e.dir; trail.push([xx, base[1] * 0.6 + cur.e.r * Math.cos(aa), base[2] * 0.6 + cur.e.r * Math.sin(aa)]); }
          v.sprite(xe, ye, ze, function(g, q){
            g.save(); g.strokeStyle = wa(COLE, 0.55); g.lineWidth = 1.5; g.beginPath();
            trail.forEach(function(p, j){ var P = v.p(p[0], p[1], p[2]); if (j) g.lineTo(P.x, P.y); else g.moveTo(P.x, P.y); }); g.stroke(); g.restore();
            if (!done){ wglow(g, q.x, q.y, 14 * q.s, COLE, 0.8); wball(g, q.x, q.y, 4.5 * q.s, COLE); }
            else wglow(g, q.x, q.y, 40 * q.s * (0.3 + hitI), "#bff7ff", 0.3 + 0.6 * hitI);
          }, 0.3);
          /* antineutrino : ligne droite qui traverse tout (rien ne l'arrête) */
          if (mode === "nu" && d.En > 0){
            var dn = [d.Pn[0] / d.En, d.Pn[1] / d.En, d.Pn[2] / d.En], dist = se * 4.5;
            var xn = [base[0] + dn[0] * dist, base[1] + dn[1] * dist, base[2] + dn[2] * dist];
            if (dist < 9) v.sprite(xn[0], xn[1], xn[2], function(g, q){
              var P = v.p(base[0], base[1], base[2]);
              g.save(); g.setLineDash([3, 5]); g.strokeStyle = wa(COLNU, 0.45); g.lineWidth = 1.4; g.beginPath(); g.moveTo(P.x, P.y); g.lineTo(q.x, q.y); g.stroke(); g.restore();
              wglow(g, q.x, q.y, 12 * q.s, COLNU, 0.55); g.save(); g.globalAlpha = 0.55; wball(g, q.x, q.y, 3.5 * q.s, COLNU); g.restore();
            }, 0.3);
          }
          /* flèches d'impulsion au point de désintégration (échelle commune) */
          if (s < 2.9){
            var ka = 1.6 / Math.max(d.pe, d.En, d.pp, 0.4);
            var vecs = [[d.Pe, COLE, "pₑ"], [d.Pp, COLP, "pₚ"]];
            if (mode === "nu" && d.En > 0) vecs.push([d.Pn, COLNU, "p_ν̄"]);
            vecs.forEach(function(vv){
              var tip = [vv[0][0] * ka, vv[0][1] * ka, vv[0][2] * ka];
              v.sprite(tip[0] * 0.5, tip[1] * 0.5, tip[2] * 0.5, function(g){
                var P = v.p(0, 0, 0), T2 = v.p(tip[0], tip[1], tip[2]);
                g.save(); g.globalAlpha = Math.min(1, (2.9 - s) * 2); warrow(g, P.x, P.y, T2.x, T2.y, vv[1], 2.6); g.restore();
              }, 0.8);
            });
          }
        }
      }
      v.render(ctx);
      /* ---- étiquettes : d'abord les fixes (horloge, aide, compteurs, détecteur), puis les mobiles qui les évitent ---- */
      var placed = qBox.slice();
      var clk = d ? "désintégré à " + wN(cur.td, 0) + " s" : "âge du neutron : " + wN(cur.age, 0) + " s";
      placed.push(wtag(S, c, clk, W - 8, 16, {size:11, align:"right", color:"#ffe9a8"}));
      var hint = "temps accéléré ×" + wN(aS.value, 0) + " · glisse pour tourner", hfz = wfz(c, 10.5), hy = phone ? H - 12 : 38;
      wT(S, c, hint, W - 10, hy, {size:hfz, color:"rgba(210,222,240,.75)", align:"right", weight:600});
      var hw = wmeas(ctx, hint, hfz, 600);
      placed.push({x:W - 10 - hw, y:hy - hfz * 0.7, w:hw, h:hfz * 1.4});
      /* compteurs de conservation */
      var ok3 = mode === "nu", rows = [
        ["charge", "0 → +1 − 1" + (ok3 ? " + 0" : "") + " = 0", true],
        ["n. baryonique", "1 → 1 + 0" + (ok3 ? " + 0" : "") + " = 1", true],
        ["n. leptonique", ok3 ? "0 → 0 + 1 − 1 = 0" : "0 → 0 + 1 = 1", ok3]
      ];
      var fz = wfz(c, 11), yb = 8;
      rows.forEach(function(r){
        var bx = wtag(S, c, r[0] + " : " + r[1] + (r[2] ? "  ✓" : "  ✗"), 8, yb + 10, {size:fz, align:"left", color:r[2] ? "#a8f0c0" : "#ff9a9a", border:r[2] ? "rgba(120,220,160,.35)" : "rgba(255,120,120,.6)"});
        placed.push(bx); yb += bx.h + 4;
      });
      var dl = v.p(XL + 0.5, RC * 0.95 + 0.4, 0);
      wtagA(S, c, "détecteur d'électrons", dl.x, dl.y, {size:10.5, align:"right", color:"#bfefff"}, placed);
      var c0 = v.p(cpos[0], cpos[1] + Rn + 0.25, cpos[2]);
      wtagA(S, c, d && s > 0.28 ? "proton (u u d)" : "neutron (u d d)", c0.x, c0.y, {size:12, color:d && s > 0.28 ? "#ffb3bd" : "#dfe6f2"}, placed);
      if (wPos) wtagA(S, c, "W⁻ virtuel", wPos.x, wPos.y, {size:11, color:"#ffd34d"}, placed);
      if (d && s > 0.6 && s < 3.0){
        var pe0 = v.p(0, -2.0, 0);
        wtagA(S, c, "e⁻ : " + wN(d.T * 1000, 0) + " keV", pe0.x, pe0.y, {size:11, color:COLE}, placed);
        if (mode === "nu" && d.En > 0){
          var dn2 = [d.Pn[0] / d.En, d.Pn[1] / d.En, d.Pn[2] / d.En], ln = Math.min(8.5, (s - 0.3) * 4.5);
          var pn = v.p(cur.base[0] + dn2[0] * ln, cur.base[1] + dn2[1] * ln, cur.base[2] + dn2[2] * ln);
          wtagA(S, c, "ν̄ₑ : traverse tout, invisible", pn.x, pn.y + 16, {size:10.5, color:COLNU}, placed);
        }
      }

      /* ---- histogramme des énergies de l'électron ---- */
      var g = f.ctx, FW = f.W, FH = f.H, j = hidx();
      g.fillStyle = "#f6f8fb"; g.fillRect(0, 0, FW, FH);
      var mx = 46, mr = 14, top = 30, bot = 34, pw = FW - mx - mr, ph = FH - top - bot;
      wT(S, f, mode === "nu" ? "Énergie cinétique de l'électron (mesure)" : "Hypothèse n → p + e⁻ (sans neutrino)", mx - 36, 14, {size:wfz(f, 12.5), color:"#13233a", align:"left"});
      wT(S, f, nTot[j] + " électron" + (nTot[j] > 1 ? "s" : ""), FW - mr, 14, {size:wfz(f, 11.5), color:"#2f6fd6", align:"right"});
      /* graduations */
      g.strokeStyle = "#d9dee6"; g.lineWidth = 1;
      var stp = phone ? 0.2 : 0.1;
      for (var xv = 0; xv <= TMAXH + 1e-9; xv += stp){
        var X = mx + xv / TMAXH * pw; g.beginPath(); g.moveTo(X + 0.5, top); g.lineTo(X + 0.5, top + ph); g.stroke();
        wT(S, f, wN(xv, 1), X, top + ph + 11, {size:wfz(f, 10.5), color:"#5f6b7a", weight:600});
      }
      wT(S, f, "T (MeV)", FW - mr, top + ph + 25, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right"});
      var mxh = 0; for (i = 0; i < NB; i++) mxh = Math.max(mxh, hist[j][i]);
      /* courbe prévue (normalisée au nombre de comptes) */
      var bwT = TMAXH / NB, curveMax = nTot[j] * bwT * NU_MAX / NU_Z;
      var topv = Math.max(1, mxh, mode === "nu" ? curveMax : 0) * 1.1, bwp = pw / NB;
      /* fond : la mesure réelle reste visible en grisé dans l'hypothèse sans neutrino */
      if (j === 1){
        var mx0 = 0; for (i = 0; i < NB; i++) mx0 = Math.max(mx0, hist[0][i]);
        if (mx0 > 0) for (i = 0; i < NB; i++){ var h0 = hist[0][i] / mx0 * ph * 0.55; g.fillStyle = "rgba(47,111,214,.18)"; g.fillRect(mx + i * bwp + 0.5, top + ph - h0, Math.max(1, bwp - 1), h0); }
      }
      for (i = 0; i < NB; i++){
        var hb = hist[j][i] / topv * ph; if (hb <= 0) continue;
        var gr = g.createLinearGradient(0, top + ph - hb, 0, top + ph); gr.addColorStop(0, j ? "#ef6a5b" : "#4f8ff0"); gr.addColorStop(1, j ? "#a8322a" : "#2457a8");
        g.fillStyle = gr; g.fillRect(mx + i * bwp + 0.5, top + ph - hb, Math.max(1, bwp - 1), hb);
      }
      if (mode === "nu" && nTot[0] > 0){
        g.save(); g.beginPath();
        for (i = 0; i <= 200; i++){ var T = i / 200 * TMAXH, y = nTot[0] * bwT * nuSpec(T) / NU_Z, px = mx + T / TMAXH * pw, py = top + ph - y / topv * ph; if (i) g.lineTo(px, py); else g.moveTo(px, py); }
        g.strokeStyle = "#e0662a"; g.lineWidth = 2; g.stroke(); g.restore();
      }
      /* raie attendue sans neutrino */
      var XT0 = mx + NU_T0 / TMAXH * pw, XB0 = mx + Math.floor(NU_T0 / TMAXH * NB) * bwp;
      g.save(); g.setLineDash([4, 4]); g.strokeStyle = "#c0321d"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(XT0, top + 4); g.lineTo(XT0, top + ph); g.stroke(); g.restore();
      wT(S, f, (phone ? "" : "sans ν : ") + "raie à " + wN(NU_T0, 3) + " MeV", XB0 - 4, top + 8, {size:wfz(f, 10.5), color:"#c0321d", align:"right", halo:true});
      g.strokeStyle = "#a3adba"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(mx, top + ph + 0.5); g.lineTo(mx + pw, top + ph + 0.5); g.moveTo(mx + 0.5, top); g.lineTo(mx + 0.5, top + ph); g.stroke();
      wT(S, f, "nombre", mx - 6, top + 6, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right"});
      if (mode === "nu") wT(S, f, "— prévu", mx + 8, top + 8, {size:wfz(f, 10.5), color:"#e0662a", align:"left", halo:true});
      else wT(S, f, "en bleu pâle : la mesure réelle", mx + 8, top + 8, {size:wfz(f, 10.5), color:"#2f6fd6", align:"left", halo:true});

      /* ---- afficheurs ---- */
      var Qv = MN_MEV - MP_MEV - ME_MEV;
      ro.set(0, wN(Qv, 3) + " MeV");
      ro.set(1, last ? wN(last.T * 1000, 0) + " keV" : "—");
      ro.set(2, last ? (mode === "nu" ? wN(last.En * 1000, 0) + " keV" : "pas de ν̄") : "—");
      ro.set(3, last ? wN(last.Tp * 1e6, 0) + " eV" : "—");
      ro.set(4, String(nTot[j]));
      ro.set(5, nTot[j] ? wN(sumT[j] / nTot[j] * 1000, 0) + " keV" : "—");
      nt.set("Durée de vie moyenne τ = " + wN(NU_TAU, 1) + " s (demi-vie τ·ln 2 = " + wN(NU_TAU * Math.LN2, 0) + " s ; mesures en faisceau : ≈ 888 s, écart encore inexpliqué). " +
        (mode === "nu" ? "Q = (mₙ − mₚ − mₑ)c² se partage entre l'électron, l'antineutrino et le recul du proton : T va de 0 à " + wN(NU_T0 * 1000, 0) + " keV, en moyenne " + wN(NU_MEAN * 1000, 0) + " keV."
          : "À deux corps, l'électron aurait toujours T = " + wN(NU_T0 * 1000, 0) + " keV : une raie. On mesure un spectre continu, d'où le neutrino proposé par Pauli en 1930."),
        mode === "nu" ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   2. De la goutte d'eau au quark (pq01)
   ===================================================================== */
/* potentiels de Yukawa entre deux protons : V = α·ħc·e^(−r/a)/r (modèle d'ordre de grandeur) */
var ZM_HBARC_EVM = HBARC * 1e6 * 1e-15;   /* ħc en eV·m */
var ZM_INT = [
  {id:"forte", nom:"forte", col:"#e0533d", al:1, a:HBARC / 139.57039 * 1e-15, port:"≈ 1,4 fm (pion)"},
  {id:"em", nom:"électromagnétique", col:"#2f80ed", al:ALPHA, a:Infinity, port:"infinie"},
  {id:"faible", nom:"faible", col:"#9b51e0", al:ALPHA / 0.23121, a:HBARC / 91187.6 * 1e-15, port:"≈ 2,2·10⁻³ fm (boson Z)"},
  {id:"grav", nom:"gravitation", col:"#27ae60", al:6.67430e-11 * Math.pow(1.67262192369e-27, 2) / (HB * CL), a:Infinity, port:"infinie"}
];
/* log10 de V (en eV) à la distance r (m) ; −Infinity si négligeable */
function zmLogV(I, r){ var x = isFinite(I.a) ? r / I.a : 0; return Math.log10(I.al * ZM_HBARC_EVM / r) - x / Math.LN10; }
/* étages : diamètre caractéristique (m) */
var ZM_LEV = [
  {nom:"goutte d'eau", L:4e-3, tient:"électromagnétique (liaisons entre molécules)", ti:1},
  {nom:"eau liquide", L:1e-6, tient:"électromagnétique (liaisons entre molécules)", ti:1},
  {nom:"molécule H₂O", L:2.8e-10, tient:"électromagnétique (liaisons covalentes)", ti:1},
  {nom:"atome d'oxygène", L:1.2e-10, tient:"électromagnétique (électrons ↔ noyau)", ti:1},
  {nom:"noyau d'oxygène 16", L:6.0e-15, tient:"forte (résiduelle, entre nucléons)", ti:0},
  {nom:"proton (u u d)", L:1.7e-15, tient:"forte (gluons entre quarks)", ti:0},
  {nom:"quark u", L:1e-18, tient:"aucune structure connue", ti:-1}
];
/* nucléons du noyau ¹⁶O : un au centre, 5 sur une couche interne, 10 sur une couche externe (fm) */
var ZM_NUC = (function(){
  var P = [[0, 0, 0, 1]], i, n;
  for (i = 0; i < 5; i++){ var a = i / 5 * TAU; P.push([1.25 * Math.cos(a), 0.45 * (i % 2 ? 1 : -1), 1.25 * Math.sin(a), i % 2]); }
  for (i = 0; i < 10; i++){ var y = 1 - (i + 0.5) / 10 * 2, rr = Math.sqrt(1 - y * y), ph = i * 2.39996; P.push([2.15 * rr * Math.cos(ph), 2.15 * y, 2.15 * rr * Math.sin(ph), (i + 1) % 2]); }
  return P;   /* [x, y, z, proton?] : 8 protons, 8 neutrons */
})();
/* molécules voisines (Å) : positions pseudo-aléatoires reproductibles, espacement ≈ 3 Å */
var ZM_CROWD = (function(){
  var P = [], seed = 7; function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var t = 0; t < 4000 && P.length < 70; t++){
    var p = [(rnd() - 0.5) * 22, (rnd() - 0.5) * 14, (rnd() - 0.5) * 12];
    if (Math.hypot(p[0], p[1], p[2]) < 3.0) continue;
    var ok = true; for (var j = 0; j < P.length; j++) if (Math.hypot(p[0] - P[j][0], p[1] - P[j][1], p[2] - P[j][2]) < 2.9){ ok = false; break; }
    if (ok) P.push([p[0], p[1], p[2], rnd() * TAU, rnd() * TAU]);
  }
  return P;
})();
/* fondu entre deux tailles en pixels (0 → 1), log */
function zmFade(P, a, b){ if (P <= a) return 0; if (P >= b) return 1; var u = Math.log(P / a) / Math.log(b / a); return u * u * (3 - 2 * u); }

SFA.sim({
  id:"pq-zoom-matiere-interactions", ch:"pq01", tag:"Échelles et interactions",
  titre:"De la goutte d'eau au quark : quelle force tient chaque étage ?",
  resume:"Une loupe plonge de la goutte au quark ; à chaque échelle, les quatre interactions s'allument selon leur portée et leur intensité.",
  but:"Laisse le voyage automatique descendre de la goutte d'eau jusqu'au quark, ou règle toi-même l'échelle r. Glisse verticalement sur la scène pour zoomer, horizontalement pour tourner l'objet. En dessous, compare les potentiels des quatre interactions entre deux protons à la distance r.",
  aRetenir:"Électromagnétisme de l'atome à la goutte, interaction forte dans le noyau et le nucléon : chaque étage a sa force.",
  piege:"La gravitation est 10³⁶ fois plus faible que la force électrique entre deux protons ; elle ne gagne qu'à grande échelle, où les charges se compensent.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 340 : 400), f = k.canvas(phone ? 330 : 270);
    var auto = true;
    var zS = k.slider("Échelle r = 10^x m : exposant x", -18, -2, 0.1, -2.5, "", function(){ auto = false; });
    k.button("Voyage automatique", function(){ auto = true; tAuto = phaseOf(zS.value); }, true);
    var ro = k.readouts(["Échelle r", "Ce que tu vois", "V électrique entre deux protons", "V fort / V électrique"]);
    var nt = k.note("", "ok");
    var tAuto = 0, rotA = 0.4, rotB = 0.25, drag = null;
    /* voyage : aller (26 s) et retour, avec de courtes pauses aux extrémités */
    var TA = 26, TP = 2;
    function zOf(t){ var T = 2 * (TA + TP), u = ((t % T) + T) % T, s;
      if (u < TP) s = 0; else if (u < TP + TA) s = (u - TP) / TA; else if (u < 2 * TP + TA) s = 1; else s = 1 - (u - 2 * TP - TA) / TA;
      s = s * s * (3 - 2 * s); return -2.5 - 15.5 * s; }
    function phaseOf(z){ var s = (-2.5 - z) / 15.5; s = wclamp(s, 0, 1); /* inverse approché du lissage */ var lo = 0, hi = 1; for (var i = 0; i < 30; i++){ var m = (lo + hi) / 2; if (m * m * (3 - 2 * m) < s) lo = m; else hi = m; } return TP + lo * TA; }
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ns-resize";
    c.pointer(function(type, p){
      if (type === "down"){ drag = {x:p.x, y:p.y}; auto = false; }
      if (type === "drag" && drag){
        zS.set(wclamp(zS.value - (p.y - drag.y) * 0.02, -18, -2)); rotA += (p.x - drag.x) * 0.01;
        drag = {x:p.x, y:p.y}; k.redraw();
      }
      if (type === "up") drag = null;
    });
    var lp = k.loop(function(dt, t){
      if (auto){ tAuto += dt; zS.set(Math.round(zOf(tAuto) * 100) / 100); }
      rotA += dt * 0.35; k.redraw();
    });
    lp.play();
    var T0 = performance.now();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, z = zS.value, r = Math.pow(10, z), ppm = H / 2.5 / r, cx = W / 2, cy = H * 0.47, i;
      var tt = (performance.now() - T0) / 1000;
      var ca = Math.cos(rotA), sa = Math.sin(rotA), cb = Math.cos(rotB), sb = Math.sin(rotB);
      function R3(x, y, zz){ var x1 = x * ca + zz * sa, z1 = -x * sa + zz * ca; return [x1, y * cb - z1 * sb, y * sb + z1 * cb]; }
      /* tailles à l'écran (px) */
      var Pd = ZM_LEV[0].L * ppm, Pmol = 3.0e-10 * ppm, Pat = ZM_LEV[3].L * ppm, Pnu = ZM_LEV[4].L * ppm, Pn = ZM_LEV[5].L * ppm;
      /* ---- fond : feuille sous la goutte, puis eau, puis vide ---- */
      var aDrop = 1 - zmFade(Pd, 2.2 * H, 9 * H);
      var aLiq = zmFade(Pd, 1.4 * H, 4 * H) * (1 - zmFade(Pmol, 1.2, 10));
      var aCrowd = zmFade(Pmol, 1.2, 10) * (1 - zmFade(Pat, 0.9 * H, 2.2 * H));
      var aAtom = zmFade(Pat, 0.35 * H, 1.1 * H) * (1 - zmFade(Pat, 9 * H, 40 * H));
      var aNuc = zmFade(Pnu, 3, 14);
      var aNin = zmFade(Pn, 0.22 * H, 0.55 * H), aN = aNin * (1 - zmFade(Pn, 5 * H, 14 * H));
      var aQ = zmFade(Pn, 4 * H, 12 * H);
      /* fond général : du vert de la feuille au noir du subatomique */
      var gvoid = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.8); gvoid.addColorStop(0, "#141b33"); gvoid.addColorStop(1, "#04060d");
      ctx.fillStyle = gvoid; ctx.fillRect(0, 0, W, H);
      if (aDrop > 0){
        ctx.save(); ctx.globalAlpha = aDrop;
        var gl = ctx.createLinearGradient(0, 0, W, H); gl.addColorStop(0, "#2f7a3a"); gl.addColorStop(0.55, "#4c9c48"); gl.addColorStop(1, "#22612c");
        ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
        /* nervures de la feuille (à l'échelle de la goutte) */
        ctx.strokeStyle = "rgba(200,240,170,.35)"; ctx.lineCap = "round";
        var vs = Pd / 4e-3 * 1e-3;  /* px par mm */
        ctx.lineWidth = Math.max(1, vs * 0.25); ctx.beginPath(); ctx.moveTo(cx - 12 * vs, cy + 6 * vs); ctx.lineTo(cx + 14 * vs, cy - 5 * vs); ctx.stroke();
        ctx.lineWidth = Math.max(0.6, vs * 0.1);
        for (i = -6; i <= 6; i++){ var bx = cx + i * 2.2 * vs, by = cy + 6 * vs - (i + 12) / 26 * 11 * vs + 0.5 * vs;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 1.2 * vs, by - 3 * vs, bx + 2.6 * vs, by - 5.5 * vs); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 0.4 * vs, by + 2.5 * vs, bx - 0.2 * vs, by + 5 * vs); ctx.stroke(); }
        /* goutte : ombre, dôme, reflets */
        var rd = Pd / 2;
        ctx.fillStyle = "rgba(10,40,15,.35)"; ctx.beginPath(); ctx.ellipse(cx + rd * 0.18, cy + rd * 0.55, rd * 1.02, rd * 0.42, 0, 0, TAU); ctx.fill();
        var gd = ctx.createRadialGradient(cx - rd * 0.3, cy - rd * 0.35, rd * 0.1, cx, cy, rd * 1.05);
        gd.addColorStop(0, "rgba(235,250,255,.85)"); gd.addColorStop(0.35, "rgba(150,210,235,.55)"); gd.addColorStop(0.85, "rgba(60,140,170,.55)"); gd.addColorStop(1, "rgba(20,70,90,.75)");
        ctx.fillStyle = gd; ctx.beginPath(); ctx.ellipse(cx, cy, rd, rd * 0.82, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = Math.max(1.5, rd * 0.03); ctx.beginPath(); ctx.ellipse(cx, cy, rd * 0.97, rd * 0.8, 0, PI * 1.1, PI * 1.45); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.ellipse(cx - rd * 0.35, cy - rd * 0.38, rd * 0.12, rd * 0.06, -0.6, 0, TAU); ctx.fill();
        /* loupe qui plonge : anneau et manche, au début du voyage */
        var aL = 1 - zmFade(Pd, 0.7 * H, 1.6 * H);
        if (aL > 0){
          ctx.globalAlpha = aDrop * aL; var lr = Math.min(W, H) * 0.36;
          ctx.save(); ctx.translate(cx + lr * 0.05, cy - lr * 0.05);
          ctx.lineWidth = lr * 0.08; var gm = ctx.createLinearGradient(-lr, -lr, lr, lr); gm.addColorStop(0, "#f2d38a"); gm.addColorStop(0.5, "#9c7a30"); gm.addColorStop(1, "#e6c470");
          ctx.strokeStyle = gm; ctx.beginPath(); ctx.arc(0, 0, lr, 0, TAU); ctx.stroke();
          ctx.save(); ctx.rotate(0.75); var gh = ctx.createLinearGradient(0, -lr * 0.07, 0, lr * 0.07); gh.addColorStop(0, "#6b3d1f"); gh.addColorStop(0.5, "#3a1f0e"); gh.addColorStop(1, "#5a321a");
          ctx.fillStyle = gh; wrr(ctx, lr * 1.04, -lr * 0.08, lr * 0.75, lr * 0.16, lr * 0.05); ctx.fill(); ctx.restore();
          ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.beginPath(); ctx.arc(0, 0, lr * 0.96, PI * 1.05, PI * 1.6); ctx.arc(0, 0, lr * 0.7, PI * 1.6, PI * 1.05, true); ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
      /* ---- eau liquide : rien de nouveau sur plusieurs puissances de dix ---- */
      if (aLiq > 0){
        ctx.save(); ctx.globalAlpha = aLiq;
        var gw = ctx.createLinearGradient(0, 0, 0, H); gw.addColorStop(0, "#3d8db5"); gw.addColorStop(1, "#174a6b"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(220,245,255,.16)"; ctx.lineWidth = 2;
        for (i = 0; i < 9; i++){ ctx.beginPath(); for (var xx = 0; xx <= W; xx += 8){ var yy = (i + 0.5) / 9 * H + 7 * Math.sin(xx * 0.03 + tt * 1.3 + i) + 4 * Math.sin(xx * 0.011 - tt * 0.7 + i * 2); if (xx) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } ctx.stroke(); }
        ctx.restore();
      }
      /* ---- molécules d'eau (Å) ---- */
      var aMol = zmFade(Pmol, 1.2, 10) * (1 - zmFade(Pat, 1.6 * H, 3.2 * H));
      function water(ox, oy, oz, a1, a2, alpha, hi){
        /* O à l'origine de la molécule, H à 0,957 Å, angle 104,5° */
        var hh = 0.957, th = 104.5 / 2 * PI / 180, c1 = Math.cos(a1), s1 = Math.sin(a1), c2 = Math.cos(a2), s2 = Math.sin(a2);
        var loc = [[0, 0, 0, 0.62, "#e8473d"], [hh * Math.sin(th), -hh * Math.cos(th), 0, 0.36, "#f4f6fa"], [-hh * Math.sin(th), -hh * Math.cos(th), 0, 0.36, "#f4f6fa"]];
        return loc.map(function(q){
          var x = q[0] * c1 - q[1] * s1, y = q[0] * s1 + q[1] * c1, zz = q[2];
          var y2 = y * c2 - zz * s2, z2 = y * s2 + zz * c2;
          var P = R3(ox + x, oy + y2, oz + z2);
          return {x:cx + P[0] * 1e-10 * ppm, y:cy - P[1] * 1e-10 * ppm, z:P[2], r:q[3] * 1e-10 * ppm, col:q[4], al:alpha, hi:hi};
        });
      }
      if (aMol > 0){
        var balls = [];
        if (aCrowd > 0) ZM_CROWD.forEach(function(m){ balls = balls.concat(water(m[0], m[1], m[2], m[3] + tt * 0.2, m[4], aCrowd * aMol * 0.85, false)); });
        balls = balls.concat(water(0, 0, 0, 0.3 + Math.sin(tt * 0.5) * 0.08, 0.2, aMol, true));
        balls.sort(function(p, q){ return p.z - q.z; });
        balls.forEach(function(b){
          if (b.x < -b.r || b.x > W + b.r || b.y < -b.r || b.y > H + b.r || b.r < 0.4) return;
          var fog = b.hi ? 1 : Math.max(0.35, 1 - Math.max(0, -b.z) / 12);
          wball(ctx, b.x, b.y, b.r, b.col, b.al * fog);
        });
        /* liaisons hydrogène vers quelques voisines */
        if (aCrowd > 0.2 && Pmol < H * 0.5){
          ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(255,240,160," + (0.5 * aCrowd) + ")"; ctx.lineWidth = 1.2;
          ZM_CROWD.slice(0, 70).forEach(function(m){ var d = Math.hypot(m[0], m[1], m[2]); if (d > 3.6) return; var P = R3(m[0], m[1], m[2]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + P[0] * 1e-10 * ppm, cy - P[1] * 1e-10 * ppm); ctx.stroke(); });
          ctx.restore();
        }
      }
      /* ---- atome d'oxygène : nuage électronique (orbitales 1s, 2s, 2p) ---- */
      if (aAtom > 0){
        var ra = Pat / 2; ctx.save(); ctx.globalAlpha = aAtom;
        var gA = ctx.createRadialGradient(cx, cy, 0, cx, cy, ra * 1.3); gA.addColorStop(0, "rgba(140,190,255,.55)"); gA.addColorStop(0.25, "rgba(110,160,255,.30)"); gA.addColorStop(0.7, "rgba(80,120,230,.12)"); gA.addColorStop(1, "rgba(60,90,200,0)");
        ctx.fillStyle = gA; ctx.beginPath(); ctx.arc(cx, cy, ra * 1.3, 0, TAU); ctx.fill();
        /* trois lobes 2p en 3D */
        [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function(ax, j){
          [1, -1].forEach(function(sg){
            var P = R3(ax[0] * sg * 0.45, ax[1] * sg * 0.45, ax[2] * sg * 0.45), px = cx + P[0] * ra, py = cy - P[1] * ra, ang = Math.atan2(-P[1], P[0]), ln = Math.hypot(P[0], P[1]);
            ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
            var gp = ctx.createRadialGradient(0, 0, 0, 0, 0, ra * 0.5); gp.addColorStop(0, wa(["#8fd0ff", "#b39bff", "#7fe0c8"][j], 0.32)); gp.addColorStop(1, wa(["#8fd0ff", "#b39bff", "#7fe0c8"][j], 0));
            ctx.fillStyle = gp; ctx.beginPath(); ctx.ellipse(0, 0, Math.max(2, ra * 0.5 * (0.35 + 0.65 * ln / 0.45)), ra * 0.3, 0, 0, TAU); ctx.fill(); ctx.restore();
          });
        });
        /* noyau : point brillant (20 000 fois plus petit) */
        wglow(ctx, cx, cy, Math.max(6, Math.min(30, Pnu * 3)), "#ffd27a", 0.9);
        ctx.restore();
      }
      /* ---- proton : trois quarks et gluons ; le quark u de devant au centre de l'écran ---- */
      var fm2 = 1e-15 * ppm, qr = 0.42;
      var QQ = [[0, 0, 0, "u"], [qr * 1.5, qr * 0.87, 0, "u"], [qr * 1.5, -qr * 0.87, 0, "d"]];  /* triangle, quark 0 à l'origine */
      var cen = [qr, 0, 0];
      var qa2 = tt * 0.4;
      var QP = QQ.map(function(q){ var x = q[0] * Math.cos(qa2) - q[1] * Math.sin(qa2), y = q[0] * Math.sin(qa2) + q[1] * Math.cos(qa2); var P = R3(x, y, q[2]); return {x:cx + P[0] * fm2, y:cy - P[1] * fm2, z:P[2], f:q[3]}; });
      var CP = (function(){ var x = cen[0] * Math.cos(qa2) - cen[1] * Math.sin(qa2), y = cen[0] * Math.sin(qa2) + cen[1] * Math.cos(qa2), P = R3(x, y, 0); return {x:cx + P[0] * fm2, y:cy - P[1] * fm2}; })();
      /* ---- noyau ¹⁶O : 8 protons, 8 neutrons ---- */
      if (aNuc > 0 && aQ < 1){
        /* le nucléon central est le proton où l'on plonge ensuite : même centre que lui */
        var fm = 1e-15 * ppm, outer = 1 - zmFade(Pnu, 0.9 * H, 1.8 * H);
        var NB = ZM_NUC.map(function(q, j){ var P = R3(q[0], q[1], q[2]); return {x:CP.x + P[0] * fm, y:CP.y - P[1] * fm, z:P[2], p:q[3], j:j}; });
        NB.sort(function(a, b){ return a.z - b.z; });
        NB.forEach(function(b){
          var al = b.j === 0 ? aNuc * (1 - aNin) : aNuc * outer;
          if (al <= 0.01) return;
          wball(ctx, b.x, b.y, 0.85 * fm, b.p ? "#e0533d" : "#8e9bb0", al);
        });
      }
      if (aN > 0 || aQ > 0){
        if (aN > 0){
          var rn = 0.85 * fm2, gN;
          ctx.save(); ctx.globalAlpha = aN * (1 - zmFade(rn, 1.2 * H, 2.5 * H));
          gN = ctx.createRadialGradient(CP.x - rn * 0.3, CP.y - rn * 0.3, rn * 0.1, CP.x, CP.y, rn);
          gN.addColorStop(0, "rgba(255,120,110,.16)"); gN.addColorStop(0.8, "rgba(224,83,61,.12)"); gN.addColorStop(1, "rgba(255,140,120,.45)");
          ctx.fillStyle = gN; ctx.beginPath(); ctx.arc(CP.x, CP.y, rn, 0, TAU); ctx.fill();
          ctx.globalAlpha = aN;
          /* gluons */
          ctx.strokeStyle = "#ffe066"; ctx.lineWidth = wclamp(fm2 * 0.03, 1.2, 3);
          [[0, 1], [1, 2], [2, 0]].forEach(function(pr){
            var A = QP[pr[0]], B = QP[pr[1]], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
            ctx.beginPath(); for (var j = 0; j <= 40; j++){ var u = j / 40, w = Math.sin(u * TAU * 5 + tt * 8) * fm2 * 0.05 * Math.sin(PI * u); var X = A.x + dx * u + nx * w, Y = A.y + dy * u + ny * w; if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke();
          });
          QP.slice().sort(function(a, b){ return a.z - b.z; }).forEach(function(q){ var rq = wclamp(fm2 * 0.13, 3, 17);  /* un quark n'a pas de taille connue : boule bornée */ wball(ctx, q.x, q.y, rq, q.f === "u" ? "#ff7a45" : "#3fa4ff", aN); if (rq > 7) wT(S, c, q.f, q.x, q.y + 0.5, {size:Math.min(16, rq), color:"#fff", weight:800}); });
          ctx.restore();
        }
        if (aQ > 0){
          ctx.save(); ctx.globalAlpha = aQ;
          var pul = 1 + 0.12 * Math.sin(tt * 3);
          wglow(ctx, cx, cy, 60 * pul, "#ff7a45", 0.5); wglow(ctx, cx, cy, 18, "#fff1c9", 0.95);
          /* champ de gluons qui s'étire vers les deux autres quarks (hors cadre) */
          ctx.strokeStyle = "rgba(255,224,102,.55)"; ctx.lineWidth = 2;
          [0.4, 2.5].forEach(function(an){ var a = an + qa2; ctx.beginPath(); for (var j = 0; j <= 60; j++){ var u = j / 60 * Math.max(W, H), w = Math.sin(j * 0.9 + tt * 8) * 5; var X = cx + Math.cos(a) * u - Math.sin(a) * w, Y = cy - Math.sin(a) * u - Math.cos(a) * w; if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke(); });
          ctx.restore();
        }
      }
      /* ---- étage courant et étiquettes ---- */
      var lev = Pd < 2.2 * H ? 0 : Pmol < 6 ? 1 : Pat < 1.5 * H ? 2 : Pnu < 3 ? 3 : Pnu < 1.3 * H ? 4 : Pn < 5 * H ? 5 : 6;
      if (Pat >= 1.5 * H && Pnu < 3) lev = 3;
      var LV = ZM_LEV[lev];
      wtag(S, c, LV.nom, 8, 16, {size:13, align:"left", color:"#ffffff"});
      wtag(S, c, "≈ " + (LV.L >= 1e-3 ? wN(LV.L * 1e3, 0) + " mm" : LV.L >= 1e-9 ? "1 µm et plus" : LV.L >= 1e-12 ? wN(LV.L * 1e10, 1) + " Å" : LV.L > 1e-17 ? wN(LV.L * 1e15, 1) + " fm" : "< 10⁻¹⁸ m"), 8, 42, {size:11, align:"left", color:"#cfe0ff"});
      if (lev === 1) wtag(S, c, "toujours de l'eau : rien de nouveau sur 4 puissances de dix", W / 2, H * 0.47, {size:11.5, color:"#e6f6ff"});
      if (lev === 3 && Pat > 4 * H) wtag(S, c, "presque du vide : le noyau est 20 000 fois plus petit que l'atome", W / 2, H * 0.2, {size:phone ? 10 : 11, color:"#ffe2a8"});
      if (lev === 6) wtag(S, c, "aucune taille mesurée : < 10⁻¹⁸ m", W / 2, H * 0.2, {size:11.5, color:"#ffd9b8"});
      if (lev === 4) wtag(S, c, "8 protons · 8 neutrons", W / 2, Math.min(H - 70, cy + Pnu * 0.62 + 14), {size:11, color:"#ffd2c8"});
      /* qui tient cet étage */
      var ti = LV.ti, colT = ti === 0 ? ZM_INT[0].col : ti === 1 ? ZM_INT[1].col : "#7d8aa0";
      wtag(S, c, "tenu par : " + LV.tient, W / 2, H - 52, {size:phone ? 10.5 : 12, color:"#fff", bg:wa(colT, 0.85)});
      /* règle de longueur r */
      var rb = H / 2.5, rx = 10, ry = H - 20;
      ctx.save(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx, ry - 5); ctx.lineTo(rx, ry + 5); ctx.moveTo(rx, ry); ctx.lineTo(rx + rb, ry); ctx.moveTo(rx + rb, ry - 5); ctx.lineTo(rx + rb, ry + 5); ctx.stroke(); ctx.restore();
      var zt = Math.round(z * 10) / 10, rTxt = "r = " + (Math.abs(zt - Math.round(zt)) < 0.05 ? "10" + wsup(Math.round(zt)) : wN(Math.pow(10, zt - Math.floor(zt)), 1) + "·10" + wsup(Math.floor(zt))) + " m";
      wT(S, c, rTxt, rx + rb + 8, ry, {size:wfz(c, 12), color:"#fff", align:"left", halo:"rgba(0,0,0,.6)"});
      wT(S, c, phone ? "glisse ↕ zoom · ↔ tourner" : "glisse ↕ pour zoomer · ↔ pour tourner", W - 8, ry, {size:wfz(c, 10.5), color:"rgba(230,238,250,.8)", align:"right", weight:600, halo:"rgba(0,0,0,.5)"});

      /* ---- interactions : intensité relative à la distance r, puis V(r) ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f6f8fb"; g.fillRect(0, 0, FW, FH);
      var lv = ZM_INT.map(function(I){ return zmLogV(I, r); }), lmax = Math.max.apply(null, lv);
      var bxW = phone ? FW - 16 : FW * 0.42, bx0 = 8, by0 = 24, rowH = phone ? 26 : 34;
      wT(S, f, "Entre deux protons à la distance r", bx0, 11, {size:wfz(f, 12), color:"#13233a", align:"left"});
      ZM_INT.forEach(function(I, j){
        var y = by0 + j * rowH, rel = lv[j] - lmax, on = rel > -3, lit = Math.max(0, 1 + rel / 3);
        /* voyant */
        var lx = bx0 + 9, ly = y + rowH / 2;
        if (lit > 0) wglow(g, lx, ly, 14, I.col, 0.6 * lit);
        wball(g, lx, ly, 6.5, on ? I.col : "#c3c9d3");
        wT(S, f, I.nom, lx + 13, ly - (phone ? 0 : 6), {size:wfz(f, 11.5), color:on ? "#13233a" : "#8a95a3", align:"left"});
        /* barre en décades : 0 à −40 */
        var bL = phone ? bx0 + 132 : lx + 13, bR = bx0 + bxW, by = phone ? ly - 4 : ly + 3;
        g.fillStyle = "#e3e7ee"; wrr(g, bL, by, bR - bL, 8, 4); g.fill();
        var fr = isFinite(rel) ? Math.max(0, 1 + rel / 40) : 0;
        if (fr > 0){ var gb = g.createLinearGradient(bL, 0, bR, 0); gb.addColorStop(0, wshade(I.col, 0.3)); gb.addColorStop(1, I.col); g.fillStyle = gb; wrr(g, bL, by, Math.max(8, (bR - bL) * fr), 8, 4); g.fill(); }
        var txt = rel > -0.005 ? "la plus forte" : rel < -99 || !isFinite(rel) ? "≈ 0" : "×10" + wsup(Math.round(rel));
        if (!phone) wT(S, f, txt, bR, ly - 6, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right", weight:600});
      });
      /* graphe log-log de V(r) */
      var gx0, gy0, gw, gh;
      if (phone){ gx0 = 48; gy0 = by0 + 4 * rowH + 18; gw = FW - gx0 - 10; gh = FH - gy0 - 32; }
      else { gx0 = bx0 + bxW + 54; gy0 = 22; gw = FW - gx0 - 12; gh = FH - gy0 - 34; }
      var X0 = -18, X1 = -2, Y0 = -45, Y1 = 12;
      function GX(lx){ return gx0 + (lx - X0) / (X1 - X0) * gw; } function GY(ly){ return gy0 + gh - (ly - Y0) / (Y1 - Y0) * gh; }
      g.save(); g.fillStyle = "#fff"; g.fillRect(gx0, gy0, gw, gh); g.strokeStyle = "#e3e7ed"; g.lineWidth = 1;
      for (i = Y0 + 5; i <= Y1; i += 10){ g.beginPath(); g.moveTo(gx0, GY(i) + 0.5); g.lineTo(gx0 + gw, GY(i) + 0.5); g.stroke(); wT(S, f, "10" + wsup(i), gx0 - 4, GY(i), {size:wfz(f, 10), color:"#5f6b7a", align:"right", weight:600}); }
      var sx = phone ? 4 : 2;
      for (i = X0; i <= X1; i += sx){ g.beginPath(); g.moveTo(GX(i) + 0.5, gy0); g.lineTo(GX(i) + 0.5, gy0 + gh); g.stroke(); wT(S, f, "10" + wsup(i), Math.min(GX(i), FW - 14), gy0 + gh + 10, {size:wfz(f, 10), color:"#5f6b7a", weight:600}); }
      g.strokeStyle = "#a3adba"; g.strokeRect(gx0 + 0.5, gy0 + 0.5, gw, gh);
      g.beginPath(); g.rect(gx0, gy0, gw, gh); g.clip();
      ZM_INT.forEach(function(I){
        g.beginPath(); var st = false;
        for (var q = 0; q <= 320; q++){ var lx = X0 + (X1 - X0) * q / 320, ly = zmLogV(I, Math.pow(10, lx)); if (ly < Y0 - 5){ if (st){ g.lineTo(GX(lx), GY(Y0 - 5)); } st = false; continue; } if (st) g.lineTo(GX(lx), GY(ly)); else { g.moveTo(GX(lx), GY(ly)); st = true; } }
        g.strokeStyle = I.col; g.lineWidth = 2.2; g.stroke();
      });
      g.setLineDash([4, 3]); g.strokeStyle = "#13233a"; g.lineWidth = 1.3; g.beginPath(); g.moveTo(GX(z), gy0); g.lineTo(GX(z), gy0 + gh); g.stroke(); g.setLineDash([]);
      ZM_INT.forEach(function(I, j){ if (lv[j] > Y0 && lv[j] < Y1) S.draw.dot(f, GX(z), GY(lv[j]), 4.5, I.col); });
      g.restore();
      wT(S, f, "V (eV)", gx0 + 4, gy0 + 9, {size:wfz(f, 10.5), color:"#13233a", align:"left", halo:true});
      wT(S, f, "r (m)", gx0 + gw, gy0 + gh + 23, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right"});

      /* ---- afficheurs ---- */
      ro.set(0, rTxt.replace("r = ", "").replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, function(m, e){ return "10<sup>" + e.split("").map(function(ch){ for (var kk in WSUP) if (WSUP[kk] === ch) return kk === "-" ? "−" : kk; return ch; }).join("") + "</sup>"; }));
      ro.set(1, LV.nom);
      ro.set(2, wsci(Math.pow(10, lv[1]), 2, true) + " eV");
      var rat = lv[0] - lv[1];
      ro.set(3, rat < -300 ? "≈ 0" : wsci(Math.pow(10, rat), 1, true));
      nt.set("Modèle d'ordre de grandeur : V = α·ħc·e<sup>−r/a</sup>/r, avec α ≈ 1 et a = 1,4 fm pour la forte (échange de pions), α = 1/137 et a infinie pour l'électrique, α ≈ 1/32 et a = ħc/m<sub>Z</sub>c² = 2,2·10<sup>−3</sup> fm pour la faible (entre deux protons, l'échange faible passe par le boson Z, neutre), α<sub>G</sub> = Gm<sub>p</sub>²/ħc = 5,9·10<sup>−39</sup> pour la gravitation. " +
        (z < -17.35 ? "À cette échelle, la faible se rapproche de l'électrique et la dépasse vers 3·10<sup>−18</sup> m : c'est l'unification électrofaible." : z > -14.3 ? "Au-delà de quelques fm, la forte s'éteint : il ne reste que l'électrique (et la gravitation, 10<sup>36</sup> fois plus faible)." : z > -15.5 ? "Vers 1 fm, la forte domine : elle colle les nucléons malgré la répulsion électrique." : "Dans le nucléon, ce modèle ne suffit plus : les quarks sont confinés, la force entre eux ne faiblit pas quand ils s'écartent."), z < -15.5 && z >= -17.35 ? "warn" : "ok");
    });
  }
});

/* =====================================================================
   3. Un proton dans l'accélérateur (pq01)
   ===================================================================== */
var AC_P = {
  p:{nom:"proton", m:MP_MEV * 1e6, col:"#ff6b5a", lo:4, hi:13},
  e:{nom:"électron", m:ME_MEV * 1e6, col:"#5ad1ff", lo:3, hi:11}
};
var AC_C = 26659;   /* circonférence de l'anneau (m), celle du LHC */
/* T, E, pc en eV ; β = pc/E (calcul sans perte de chiffres quand T ≪ mc²) */
function acKin(m, T){ var E = m + T, pc = Math.sqrt(T * (T + 2 * m)), g = E / m; return {T:T, E:E, pc:pc, b:pc / E, g:g, bN:Math.sqrt(2 * T / m)}; }
function acDom(T, m){ var x = T / m; return x < 0.1 ? 0 : x <= 10 ? 1 : 2; }
var AC_DOM = [["non relativiste", "#2e9e6a"], ["relativiste", "#e0a020"], ["ultrarelativiste", "#d9483b"]];
/* énergie lisible : eV, keV, MeV, GeV, TeV */
function acE(x){
  var u = [["TeV", 1e12], ["GeV", 1e9], ["MeV", 1e6], ["keV", 1e3], ["eV", 1]];
  for (var i = 0; i < u.length; i++) if (Math.abs(x) >= u[i][1] * 0.9995){ var v = x / u[i][1]; return wN(v, v < 10 ? 3 : v < 100 ? 2 : 1) + " " + u[i][0]; }
  return wN(x, 2) + " eV";
}
/* β très proche de 1 : 0,999 999 99 → affichage « 1 − 1,1·10⁻⁸ » */
function acBeta(b, g){
  if (b < 0.9999) return wN(b, b < 0.1 ? 5 : 4);
  var d = 1 / (g * g * (1 + b));   /* 1 − β = 1/(γ²(1 + β)) sans annulation */
  return "1 − " + wsci(d, 2, true);
}

SFA.sim({
  id:"pq-accelerateur-energie-impulsion", ch:"pq01", tag:"Relativité restreinte",
  titre:"Un proton dans l'accélérateur : E = mc² + T et v qui plafonne à c",
  resume:"Un paquet de protons reçoit une poussée à chaque tour : son énergie grimpe sans fin, sa vitesse plafonne sous c.",
  but:"Regarde le paquet accélérer : à chaque passage dans la cavité, il gagne de l'énergie. Sa vitesse monte puis plafonne, alors que E continue de grimper sur l'hyperbole E² = (pc)² + (mc²)². Règle T toi-même, change de particule, et glisse sur l'anneau pour le faire tourner.",
  aRetenir:"E = mc² + T et E² = (pc)² + (mc²)² : quand T ≫ mc², E ≈ pc et v ≈ c.",
  piege:"½mv² ne vaut que si T ≪ mc² : appliquée au LHC, elle donnerait une vitesse de plus de cent fois c.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 380), f = k.canvas(phone ? 360 : 260);
    var auto = true, kind = "p", phi = 0, flash = 0, lastPass = 0, tCyc = 0;
    var pS = k.seg("Particule", [["p", "Proton"], ["e", "Électron"]], "p", function(v){ kind = v; tS.el.min = AC_P[v].lo; tS.el.max = AC_P[v].hi; tS.set(wclamp(tS.value, AC_P[v].lo, AC_P[v].hi)); if (auto) tCyc = 0; });
    var tS = k.slider("Énergie cinétique T = 10^x eV : exposant x", 4, 13, 0.05, 9, "", function(){ auto = false; });
    var nT = k.toggle("Fantôme « Newton » (v calculée avec ½mv²)", false);
    k.button("Relancer l'accélération", function(){ auto = true; tCyc = 0; }, true);
    var ro = k.readouts(["Énergie cinétique T", "Énergie totale E = mc² + T", "Impulsion p", "Vitesse v/c", "Facteur γ = E/mc²", "½mv² donnerait v/c ="]);
    var nt = k.note("", "ok");
    var v = new W3(); v.a = 0.5; v.b = 0.62; v.f = 20; v.set();
    worbit(c, v, k, [0.2, 1.25]);
    var NS = 32, RR = 3.0;
    var lp = k.loop(function(dt, t){
      var P = AC_P[kind];
      /* cycle : une décade toutes les 3 s, pause de 2 s au sommet puis on recommence */
      if (auto){ tCyc += dt; var span = P.hi - P.lo, dur = span * 3; var x = tCyc < dur ? P.lo + tCyc / 3 : P.hi; if (tCyc > dur + 2.5) tCyc = 0; tS.set(Math.round(x * 100) / 100); }
      var K = acKin(P.m, Math.pow(10, tS.value));
      var w = TAU / 2.4;   /* 1 tour en 2,4 s quand v = c (ralenti) */
      var old = phi; phi += K.b * w * dt; phiN += Math.min(K.bN, 60) * w * dt;
      if (Math.floor(phi / TAU) !== Math.floor(old / TAU)) flash = 1;
      flash = Math.max(0, flash - dt * 2.5);
      if (!v.user){ v.a = 0.5 + t * 0.05; v.set(); }
      k.redraw();
    });
    var phiN = 0;
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, P = AC_P[kind], T = Math.pow(10, tS.value), K = acKin(P.m, T), dom = acDom(T, P.m), i;
      wlab(ctx, W, H, "#25324a", "#0c111c");
      v.sc = Math.min(W / 8.2, H / (phone ? 5.4 : 5.0)); v.cx = W * (phone ? 0.5 : 0.47); v.cy = H * 0.55; v.clear();
      /* dalle du tunnel */
      v.box(-4.2, -0.62, -4.2, 4.2, -0.5, 4.2, "#4b5263");
      v.render(ctx); v.clear();   /* la dalle d'abord : elle est sous tout le reste */
      /* anneau : tube à vide, aimants dipolaires (bleus), quadripôles (rouges), cavité accélératrice (cuivre) à l'angle 0 */
      for (i = 0; i < NS; i++){
        var a0 = (i + 0.06) / NS * TAU, a1 = (i + 0.94) / NS * TAU, am = (i + 0.5) / NS * TAU;
        var p0 = [RR * Math.cos(a0), 0, RR * Math.sin(a0)], p1 = [RR * Math.cos(a1), 0, RR * Math.sin(a1)];
        if (i === 0 || i === NS - 1) continue;
        if (i % 4 === 2) v.cyl(p0, p1, 0.2, 10, "#c83a32");
        else {
          var cs = Math.cos(am), sn = Math.sin(am), hw = RR * Math.sin(PI / NS) * 0.9;
          /* dipôle : boîte orientée le long de l'anneau */
          var cen = [RR * cs, 0, RR * sn], tx = [-sn, 0, cs], nx = [cs, 0, sn];
          var Q = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(function(q){
            return [cen[0] + tx[0] * q[0] * hw + nx[0] * q[2] * 0.28, q[1] * 0.26, cen[2] + tx[2] * q[0] * hw + nx[2] * q[2] * 0.28]; });
          [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(fc){ v.face(fc.map(function(j){ return Q[j]; }), "#2f6fd6", {c:cen, cull:true}); });
        }
        /* pied */
        v.box(RR * Math.cos(am) - 0.08, -0.5, RR * Math.sin(am) - 0.08, RR * Math.cos(am) + 0.08, -0.26, RR * Math.sin(am) + 0.08, "#6b7486");
      }
      /* cavité RF (à l'angle 0) */
      var ca0 = -1 / NS * TAU * 0.94, ca1 = 1 / NS * TAU * 0.94;
      v.cyl([RR * Math.cos(ca0), 0, RR * Math.sin(ca0)], [RR * Math.cos(ca1), 0, RR * Math.sin(ca1)], 0.36, 16, flash > 0.05 ? wshade("#d08a4a", flash * 0.6) : "#b8743a", {cap0:"#8a5428", cap1:"#8a5428"});
      /* paquet : traînée lumineuse le long de l'anneau */
      var L = Math.min(0.9, 0.12 + 0.8 * K.b);
      for (i = 0; i < 10; i++){
        (function(j){
          var a = phi - j * L / 10 / RR * 2.2, x = RR * Math.cos(a), zz = RR * Math.sin(a);
          v.sprite(x, 0, zz, function(g, q){ wglow(g, q.x, q.y, (24 - j) * q.s, P.col, 0.85 * (1 - j / 10)); if (!j){ wglow(g, q.x, q.y, 9 * q.s, "#ffffff", 0.9); wball(g, q.x, q.y, 6 * q.s, P.col); } }, 0.4);
        })(i);
      }
      if (nT.value){
        var aN = phiN, gx = RR * Math.cos(aN), gz = RR * Math.sin(aN);
        v.sprite(gx, 0.45, gz, function(g, q){ g.save(); g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 2; g.beginPath(); g.arc(q.x, q.y, 7 * q.s, 0, TAU); g.stroke(); wglow(g, q.x, q.y, 14, "#ffffff", 0.5); g.restore(); }, 0.5);
      }
      v.render(ctx);
      /* éclair de la cavité */
      var cp = v.p(RR, 0.5, 0), cq = v.p(RR, -0.5, 0);
      if (flash > 0.05) wglow(ctx, cp.x, cp.y, 40 * flash, "#ffd27a", 0.8 * flash);
      wtag(S, c, "cavité accélératrice", Math.min(cq.x, W - (phone ? 70 : 110)), Math.min(cq.y + 16, H - 34), {size:10.5, color:"#ffd9a8"});
      if (nT.value) wtag(S, c, "○ fantôme Newton : v = " + wN(K.bN, K.bN < 1 ? 3 : K.bN < 10 ? 1 : 0) + " c" + (K.bN > 1 ? " !" : ""), 8, 68, {size:11, align:"left", color:"#fff", border:"rgba(255,255,255,.55)"});
      /* compteur de vitesse (v/c) */
      var gr = phone ? 34 : 44, gxc = W - gr - 14, gyc = gr + 20;
      ctx.save(); var gg = ctx.createRadialGradient(gxc - gr * 0.3, gyc - gr * 0.3, 2, gxc, gyc, gr * 1.1); gg.addColorStop(0, "#fbfcfe"); gg.addColorStop(1, "#c4ccd8");
      ctx.fillStyle = "#1a2232"; ctx.beginPath(); ctx.arc(gxc, gyc, gr + 5, 0, TAU); ctx.fill(); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gxc, gyc, gr, 0, TAU); ctx.fill();
      var A0 = PI * 0.8, A1 = PI * 2.2;
      ctx.lineWidth = 4; ctx.strokeStyle = "#d9483b"; ctx.beginPath(); ctx.arc(gxc, gyc, gr * 0.82, A1 - 0.06, A1 + 0.02); ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = "#5f6b7a";
      for (i = 0; i <= 10; i++){ var aa = A0 + (A1 - A0) * i / 10; ctx.beginPath(); ctx.moveTo(gxc + Math.cos(aa) * gr * 0.68, gyc + Math.sin(aa) * gr * 0.68); ctx.lineTo(gxc + Math.cos(aa) * gr * (i % 5 ? 0.78 : 0.86), gyc + Math.sin(aa) * gr * (i % 5 ? 0.78 : 0.86)); ctx.stroke(); }
      var an = A0 + (A1 - A0) * K.b;
      ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(gxc, gyc); ctx.lineTo(gxc + Math.cos(an) * gr * 0.82, gyc + Math.sin(an) * gr * 0.82); ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(gxc, gyc, 3, 0, TAU); ctx.fill(); ctx.restore();
      wT(S, c, "c", gxc + Math.cos(A1) * gr * 0.5, gyc + Math.sin(A1) * gr * 0.5 - 1, {size:wfz(c, 11), color:"#c0321d", weight:800});
      wT(S, c, "0", gxc + Math.cos(A0) * gr * 0.5, gyc + Math.sin(A0) * gr * 0.5 - 1, {size:wfz(c, 10.5), color:"#5f6b7a"});
      wtag(S, c, "v = " + (K.b < 0.9999 ? wN(K.b, 4) : "0,9999…") + " c", gxc, gyc + gr + 18, {size:11, color:"#fff"});
      /* étiquettes */
      wtag(S, c, P.nom + " · T = " + acE(T), 8, 16, {size:12.5, align:"left", color:"#fff"});
      wtag(S, c, AC_DOM[dom][0], 8, 42, {size:11, align:"left", color:"#fff", bg:wa(AC_DOM[dom][1], 0.9)});
      wT(S, c, "ralenti : 1 tour en 2,4 s à v = c · glisse pour tourner", W / 2, H - 12, {size:wfz(c, 10.5), color:"rgba(215,225,240,.75)", weight:600});

      /* ---- graphe E(pc) et barre d'énergie ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f6f8fb"; g.fillRect(0, 0, FW, FH);
      var p = K.pc / P.m, e = K.E / P.m;
      var X1 = Math.max(2, p * 1.25), st = wstep(X1, 4); X1 = Math.ceil(X1 / st) * st; var Y1 = X1 + 1;
      var gx0 = 46, gy0 = 24, gw = phone ? FW - gx0 - 14 : FW * 0.56 - gx0, gh = (phone ? FH * 0.6 : FH) - gy0 - 34;
      function GX(x){ return gx0 + x / X1 * gw; } function GY(y){ return gy0 + gh - y / Y1 * gh; }
      wT(S, f, "E² = (pc)² + (mc²)²", gx0, 11, {size:wfz(f, 12), color:"#13233a", align:"left"});
      g.save(); g.fillStyle = "#fff"; g.fillRect(gx0, gy0, gw, gh); g.strokeStyle = "#e3e7ed"; g.lineWidth = 1;
      var sy = wstep(Y1, 4), tfz = wfz(f, 10);
      /* graduation : notation scientifique dès 10⁴, pour rester lisible sur téléphone */
      function tk(x, dd){ return x >= 1e4 ? wsci(x, 1).replace(",0·", "·") : wN(x, dd); }
      for (i = 0; i <= X1 + 1e-9; i += st){ g.beginPath(); g.moveTo(GX(i) + 0.5, gy0); g.lineTo(GX(i) + 0.5, gy0 + gh); g.stroke(); var tl = tk(i, st < 1 ? 1 : 0), tw = wmeas(g, tl, tfz, 600); wT(S, f, tl, Math.min(GX(i), FW - tw / 2 - 3), gy0 + gh + 10, {size:tfz, color:"#5f6b7a", weight:600}); }
      for (i = 0; i <= Y1 + 1e-9; i += sy){ g.beginPath(); g.moveTo(gx0, GY(i) + 0.5); g.lineTo(gx0 + gw, GY(i) + 0.5); g.stroke(); wT(S, f, tk(i, sy < 1 ? 1 : 0), gx0 - 5, GY(i), {size:tfz, color:"#5f6b7a", align:"right", weight:600}); }
      g.beginPath(); g.rect(gx0, gy0, gw, gh); g.clip();
      /* photon : E = pc */
      g.setLineDash([5, 4]); g.strokeStyle = "#e0a020"; g.lineWidth = 1.8; g.beginPath(); g.moveTo(GX(0), GY(0)); g.lineTo(GX(X1), GY(X1)); g.stroke(); g.setLineDash([]);
      /* hyperbole, colorée par domaine (T/mc² = E/mc² − 1) */
      var N = 300, prev = null;
      for (i = 0; i <= N; i++){
        var pp = X1 * i / N, ee = Math.sqrt(1 + pp * pp), d = (ee - 1) < 0.1 ? 0 : (ee - 1) <= 10 ? 1 : 2, pt = [GX(pp), GY(ee)];
        if (prev){ g.strokeStyle = AC_DOM[d][1]; g.lineWidth = 3; g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(pt[0], pt[1]); g.stroke(); }
        prev = pt;
      }
      /* E = mc² au repos */
      g.setLineDash([2, 3]); g.strokeStyle = "#8a95a3"; g.lineWidth = 1; g.beginPath(); g.moveTo(gx0, GY(1)); g.lineTo(gx0 + gw, GY(1)); g.stroke(); g.setLineDash([]);
      g.restore();
      S.draw.dot(f, GX(p), GY(e), 6, P.col);
      g.strokeStyle = "#a3adba"; g.strokeRect(gx0 + 0.5, gy0 + 0.5, gw, gh);
      wT(S, f, "E/mc²", gx0 + 4, gy0 + 9, {size:wfz(f, 10.5), color:"#13233a", align:"left", halo:true});
      wT(S, f, "pc/mc²", gx0 + gw, gy0 + gh + 24, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right"});
      wT(S, f, "- - photon : E = pc", gx0 + gw - 6, gy0 + gh - 12, {size:wfz(f, 10.5), color:"#b07a10", align:"right", halo:true});
      /* barre d'énergie : part de mc² et part de T dans E */
      var bx, by, bw, bh;
      if (phone){ bx = 14; by = gy0 + gh + 52; bw = FW - 28; bh = 22; }
      else { bx = FW * 0.56 + 40; by = 34; bw = FW - bx - 16; bh = 26; }
      wT(S, f, "E = mc² + T", bx, by - 12, {size:wfz(f, 12), color:"#13233a", align:"left"});
      var fm = P.m / K.E;
      g.save(); wrr(g, bx, by, bw, bh, 6); g.clip();
      g.fillStyle = "#7d8aa0"; g.fillRect(bx, by, bw * fm, bh);
      var gT = g.createLinearGradient(bx, 0, bx + bw, 0); gT.addColorStop(0, wshade(P.col, 0.2)); gT.addColorStop(1, P.col); g.fillStyle = gT; g.fillRect(bx + bw * fm, by, bw * (1 - fm), bh);
      g.restore();
      var fz = wfz(f, 10.5);
      wT(S, f, "mc² : " + wN(fm * 100, fm < 0.01 ? 3 : 1) + " %", bx, by + bh + 12, {size:fz, color:"#5f6b7a", align:"left"});
      wT(S, f, "T : " + wN((1 - fm) * 100, 1 - fm < 0.01 ? 3 : 1) + " %", bx + bw, by + bh + 12, {size:fz, color:wshade(P.col, -0.35), align:"right"});
      /* domaines */
      var dy = by + bh + 36;
      AC_DOM.forEach(function(D, j){
        var yy = phone ? dy : dy + j * 22, xx = phone ? bx + j * bw / 3 : bx;
        g.fillStyle = D[1]; wrr(g, xx, yy - 6, 12, 12, 3); g.fill();
        if (j === dom){ g.strokeStyle = "#13233a"; g.lineWidth = 2; wrr(g, xx - 2, yy - 8, 16, 16, 4); g.stroke(); }
        wT(S, f, D[0], xx + 17, yy, {size:fz, color:j === dom ? "#13233a" : "#7b8694", align:"left", weight:j === dom ? 800 : 600});
        if (!phone) wT(S, f, ["T < 0,1 mc²", "0,1 mc² ≤ T ≤ 10 mc²", "T > 10 mc²"][j], bx + bw, yy, {size:fz, color:"#7b8694", align:"right", weight:600});
      });

      /* ---- afficheurs ---- */
      ro.set(0, acE(T));
      ro.set(1, acE(K.E));
      ro.set(2, acE(K.pc) + "/c");
      ro.set(3, acBeta(K.b, K.g));
      ro.set(4, K.g < 1.001 ? wN(K.g, 6) : K.g < 100 ? wN(K.g, 3) : wsci(K.g, 3, true));
      ro.set(5, wN(K.bN, K.bN < 1 ? 4 : K.bN < 10 ? 2 : 0) + (K.bN > 1 ? " : impossible" : ""));
      var lap = K.b * CL / AC_C;
      nt.set("mc² = " + acE(P.m) + (P.nom === "électron" ? " pour l'" : " pour le ") + P.nom + ". Dans un anneau de 26,7 km (le LHC), ce paquet ferait " + (lap >= 1000 ? wN(Math.round(lap), 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : wN(lap, 1)) + " tours par seconde ; au-delà de T ≈ 10 mc², il en ajoute à peine, alors que E continue de monter.", dom === 0 ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   4. Le train relativiste : horloges et transformation de Lorentz (pq01)
   ===================================================================== */
var LZ_CUS = CL * 1e-6;          /* c en m/µs (299,79…) */
var LZ_L0 = 400, LZ_X0 = -150, LZ_X1 = 1050, LZ_CT0 = -150, LZ_CT1 = 650;
var LZ_PLAT = [0, 200, 400, 600, 800, 1000], LZ_TR = [0, 200, 400];
function lzG(b){ return 1 / Math.sqrt(1 - b * b); }
/* coordonnées dans le train (origines communes : arrière du train en x = 0 à t = 0) */
function lzPrime(b, x, ct){ var g = lzG(b); return [g * (x - b * ct), g * (ct - b * x)]; }

SFA.sim({
  id:"pq-lorentz-horloges", ch:"pq01", tag:"Relativité restreinte",
  titre:"Le train relativiste : horloges et transformation de Lorentz",
  resume:"Un train spatial file devant un quai couvert d'horloges ; le diagramme d'espace-temps montre ses axes ct′ et x′ qui se referment vers la lumière.",
  but:"Règle β = v/c et regarde : le train est plus court vu du quai et ses horloges, synchronisées pour lui, ne marquent pas la même heure vues du quai. Clique dans le diagramme (ou sur le quai) pour placer un événement : ses coordonnées s'affichent dans les deux référentiels. Glisse sur la scène pour faire défiler le temps.",
  aRetenir:"x′ = γ(x − βct) et ct′ = γ(ct − βx), avec γ = 1/√(1 − β²) : durées dilatées, longueurs contractées, simultanéité relative.",
  piege:"Deux événements simultanés pour le quai ne le sont pas pour le train : l'horloge de tête du train retarde sur celle de queue.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 250 : 290), f = k.canvas(phone ? 300 : 390);
    var bS = k.slider("Vitesse du train β = v/c", 0, 0.95, 0.01, 0.6, "");
    var spS = k.seg("Défilement", [["0.5", "Lent"], ["1", "Normal"], ["0", "Pause"]], "1");
    k.button("Événement au centre du quai", function(){ ev = {x:500, ct:300}; });
    var ro = k.readouts(["Facteur γ", "Longueur du train vue du quai (400 m au repos)", "Événement (quai) : x ; t", "Événement (train) : x′ ; t′", "1 µs du train dure, pour le quai", "Retard de l'horloge de tête"]);
    var nt = k.note("", "ok");
    var ct = 0, ev = {x:600, ct:450}, drag = null, axD = null;
    var lp = k.loop(function(dt){
      ct += dt * 100 * (+spS.value);   /* 100 m de ct par seconde : 1 µs du quai ≈ 3 s */
      if (ct > LZ_CT1) ct = LZ_CT0;
      k.redraw();
    });
    lp.play();
    /* scène : glisser = faire défiler le temps ; clic simple = événement sur le quai, maintenant */
    var SC = {};
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(type, p){
      if (type === "down") drag = {x0:p.x, x:p.x, ct:ct, moved:false};
      if (type === "drag" && drag){ if (Math.abs(p.x - drag.x0) > 4) drag.moved = true; ct = wclamp(drag.ct + (p.x - drag.x0) / (SC.ppm || 0.4), LZ_CT0, LZ_CT1); k.redraw(); }
      if (type === "up" && drag){ if (!drag.moved && SC.ppm){ var x = (p.x - SC.x0) / SC.ppm + LZ_X0; ev = {x:wclamp(Math.round(x / 10) * 10, LZ_X0, LZ_X1), ct:Math.round(ct)}; } drag = null; k.redraw(); }
    });
    f.cv.style.cursor = "crosshair"; f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if ((type === "down" || type === "drag") && axD){
        var x = axD.ix(p.x), y = axD.iy(p.y);
        if (x >= LZ_X0 && x <= LZ_X1 && y >= LZ_CT0 && y <= LZ_CT1){ ev = {x:Math.round(x / 10) * 10, ct:Math.round(y / 10) * 10}; k.redraw(); }
      }
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, b = bS.value, g = lzG(b), L = LZ_L0 / g, i;
      /* ---- scène : quai la nuit, horloges, train ---- */
      var gs = ctx.createLinearGradient(0, 0, 0, H); gs.addColorStop(0, "#0b1430"); gs.addColorStop(0.65, "#1d2a52"); gs.addColorStop(1, "#2a2f45");
      ctx.fillStyle = gs; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < 60; i++){ var sx = (i * 137.5 % 1) * W, sx2 = ((i * 97.13) % W + W) % W, sy = ((i * 53.7) % (H * 0.45)); ctx.fillStyle = "rgba(255,255,255," + (0.25 + (i % 5) * 0.12) + ")"; ctx.fillRect(sx2, sy, 1.4, 1.4); }
      var mx = 14, ppm = (W - 2 * mx) / (LZ_X1 - LZ_X0); SC = {x0:mx, ppm:ppm};
      function X(x){ return mx + (x - LZ_X0) * ppm; }
      var yRail = H * 0.56, yPl = H * 0.66;
      /* auvent de la gare et lampadaires */
      var gr0 = ctx.createLinearGradient(0, 0, 0, 22); gr0.addColorStop(0, "#5d6478"); gr0.addColorStop(1, "#2c3142");
      ctx.fillStyle = gr0; ctx.fillRect(0, 0, W, 10);
      [100, 300, 500, 700, 900].forEach(function(x){ var px = X(x);
        ctx.fillStyle = "#4a5063"; ctx.fillRect(px - 1.5, 10, 3, 14);
        ctx.fillStyle = "#2c3142"; ctx.beginPath(); ctx.moveTo(px - 10, 24); ctx.lineTo(px + 10, 24); ctx.lineTo(px + 6, 29); ctx.lineTo(px - 6, 29); ctx.closePath(); ctx.fill();
        var gl = ctx.createRadialGradient(px, 30, 0, px, 60, 70); gl.addColorStop(0, "rgba(255,236,180,.28)"); gl.addColorStop(1, "rgba(255,236,180,0)");
        ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(px - 6, 29); ctx.lineTo(px + 6, 29); ctx.lineTo(px + 40, yPl); ctx.lineTo(px - 40, yPl); ctx.closePath(); ctx.fill();
        wglow(ctx, px, 29, 8, "#fff0c0", 0.9); });
      /* voie et rails */
      ctx.fillStyle = "#3a3f52"; ctx.fillRect(0, yRail + 18, W, 8);
      ctx.fillStyle = "#9aa3b5"; ctx.fillRect(0, yRail + 16, W, 2.5);
      /* quai en volume */
      var gq = ctx.createLinearGradient(0, yPl, 0, H); gq.addColorStop(0, "#b9bfcc"); gq.addColorStop(0.12, "#8a91a3"); gq.addColorStop(1, "#4b5163");
      ctx.fillStyle = gq; ctx.beginPath(); ctx.moveTo(0, yPl + 4); ctx.lineTo(W, yPl + 4); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#e8c547"; ctx.fillRect(0, yPl + 4, W, 3);
      /* horloges du quai (synchronisées pour le quai) */
      var tq = ct / LZ_CUS, fz = wfz(c, phone ? 10 : 11.5);
      LZ_PLAT.forEach(function(x){
        var px = X(x);
        ctx.fillStyle = "#5b6275"; ctx.fillRect(px - 2, yPl - 6, 4, H - yPl);
        var bw = phone ? 46 : 64, bh = phone ? 20 : 24, by = H - bh - 8;
        ctx.save(); var gb = ctx.createLinearGradient(0, by, 0, by + bh); gb.addColorStop(0, "#2a3146"); gb.addColorStop(1, "#11151f"); ctx.fillStyle = gb; wrr(ctx, px - bw / 2, by, bw, bh, 5); ctx.fill(); ctx.strokeStyle = "rgba(125,255,154,.35)"; ctx.stroke(); ctx.restore();
        wT(S, c, wN(tq, 2) + (phone ? "" : " µs"), px, by + bh / 2 + 0.5, {size:fz, color:"#7dff9a", mono:true});
      });
      /* personnage sur le quai */
      (function(){ var px = X(-90), py = yPl + 2;
        ctx.save(); ctx.fillStyle = "#2b2f3d"; ctx.beginPath(); ctx.ellipse(px, py + 2, 10, 3, 0, 0, TAU); ctx.fill();
        var gp = ctx.createLinearGradient(px - 8, 0, px + 8, 0); gp.addColorStop(0, "#2f6fd6"); gp.addColorStop(1, "#173a7a");
        ctx.fillStyle = gp; wrr(ctx, px - 7, py - 34, 14, 22, 5); ctx.fill();
        ctx.fillStyle = "#1d2536"; ctx.fillRect(px - 6, py - 13, 5, 13); ctx.fillRect(px + 1, py - 13, 5, 13);
        wball(ctx, px, py - 41, 7, "#e9b48a"); ctx.restore(); })();
      /* train : rectangle arrondi métallique, contracté ; arrière en x = βct */
      var xr = b * ct, xf = xr + L, tx0 = X(xr), tx1 = X(xf), th = phone ? 44 : 56, ty = yRail + 14 - th;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse((tx0 + tx1) / 2, yRail + 16, (tx1 - tx0) / 2, 4, 0, 0, TAU); ctx.fill();
      var gt = ctx.createLinearGradient(0, ty, 0, ty + th); gt.addColorStop(0, "#eef2f8"); gt.addColorStop(0.35, "#b8c2d3"); gt.addColorStop(0.7, "#7d889c"); gt.addColorStop(1, "#4a5366");
      ctx.fillStyle = gt; ctx.beginPath();
      var nose = Math.min(28, (tx1 - tx0) * 0.25);
      ctx.moveTo(tx0 + 6, ty); ctx.lineTo(tx1 - nose, ty); ctx.quadraticCurveTo(tx1, ty + 4, tx1, ty + th * 0.75); ctx.lineTo(tx1, ty + th); ctx.lineTo(tx0, ty + th); ctx.lineTo(tx0, ty + 6); ctx.quadraticCurveTo(tx0, ty, tx0 + 6, ty); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#d9483b"; ctx.fillRect(tx0, ty + th * 0.62, tx1 - tx0 - 2, 4);
      /* fenêtres (contractées avec le train) */
      var nw = 8; for (i = 0; i < nw; i++){ var wx0 = tx0 + (tx1 - tx0 - nose) * (i + 0.2) / nw, ww = (tx1 - tx0 - nose) * 0.6 / nw; var gw = ctx.createLinearGradient(0, ty + 6, 0, ty + 20); gw.addColorStop(0, "#9fd6ff"); gw.addColorStop(1, "#2a5a8a"); ctx.fillStyle = gw; wrr(ctx, wx0, ty + 7, ww, 13, 2); ctx.fill(); }
      /* voyageuse dans la 3e fenêtre */
      var vx = tx0 + (tx1 - tx0 - nose) * (2.2 + 0.3) / nw; wball(ctx, vx, ty + 13, 4, "#c98a60");
      ctx.restore();
      /* horloges du train : t′ = γ(t − βx/c) à leur position */
      var sp = (tx1 - tx0) / 2, showMid = sp > (phone ? 52 : 70);
      LZ_TR.forEach(function(xp, j){
        if (j === 1 && !showMid) return;
        var x = xr + xp / g, ctp = g * (ct - b * x), px = X(x);
        var row = showMid ? 0 : j === 2 ? 1 : 0, yy = ty - 14 - row * 0;
        if (!showMid && j === 2 && sp * 2 < (phone ? 54 : 72)) yy = ty - 36;
        ctx.save(); ctx.strokeStyle = "rgba(255,210,122,.6)"; ctx.beginPath(); ctx.moveTo(px, ty); ctx.lineTo(px, yy + 8); ctx.stroke(); ctx.restore();
        wtag(S, c, wN(ctp / LZ_CUS, 2) + (phone ? "" : " µs"), px, yy, {size:phone ? 10 : 11, color:"#ffd27a", border:"rgba(255,210,122,.5)"});
      });
      /* événement : éclair sur le quai quand t passe par t_E */
      var dtE = ct - ev.ct;
      if (Math.abs(dtE) < 40){ var a = 1 - Math.abs(dtE) / 40; wglow(ctx, X(ev.x), yPl - 6, 34 * a + 6, "#fff3a0", 0.9 * a); }
      ctx.save(); ctx.fillStyle = "#ffd34d"; ctx.beginPath(); ctx.moveTo(X(ev.x), yPl + 2); ctx.lineTo(X(ev.x) - 5, yPl + 10); ctx.lineTo(X(ev.x) + 5, yPl + 10); ctx.closePath(); ctx.fill(); ctx.restore();
      wtag(S, c, "quai : t = " + wN(tq, 2) + " µs", 8, 22, {size:11.5, align:"left", color:"#7dff9a"});
      wtag(S, c, "β = " + wN(b, 2) + " · γ = " + wN(g, 3), W - 8, 22, {size:11.5, align:"right", color:"#fff"});
      wT(S, c, phone ? "glisse : temps · clic : événement" : "glisse pour faire défiler le temps · clique sur le quai pour un événement", W / 2, 44, {size:wfz(c, 10.5), color:"rgba(220,230,245,.75)", weight:600});

      /* ---- diagramme d'espace-temps (échelles égales : la lumière à 45°) ---- */
      f.clear(); var gx = f.ctx;
      gx.fillStyle = "#fbfcfe"; gx.fillRect(0, 0, f.W, f.H);
      var ax = S.draw.axes(f, {x0:LZ_X0, x1:LZ_X1, y0:LZ_CT0, y1:LZ_CT1, equal:true, l:44, b:32, t:24, r:14, stepX:200, stepY:200, xl:"x (m)", yl:"ct (m)"});
      axD = ax;
      gx.save(); gx.beginPath(); gx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); gx.clip();
      /* cône de lumière depuis l'origine */
      gx.setLineDash([5, 4]); gx.strokeStyle = "#e0a020"; gx.lineWidth = 1.6;
      gx.beginPath(); gx.moveTo(ax.X(-1000), ax.Y(-1000)); gx.lineTo(ax.X(1500), ax.Y(1500)); gx.moveTo(ax.X(1000), ax.Y(-1000)); gx.lineTo(ax.X(-1500), ax.Y(1500)); gx.stroke(); gx.setLineDash([]);
      /* lignes d'univers des horloges du quai (verticales) */
      gx.strokeStyle = "rgba(46,158,106,.35)"; gx.lineWidth = 1.2;
      LZ_PLAT.forEach(function(x){ gx.beginPath(); gx.moveTo(ax.X(x), ax.Y(LZ_CT0)); gx.lineTo(ax.X(x), ax.Y(LZ_CT1)); gx.stroke(); });
      /* bande du train : entre l'arrière (x = βct) et l'avant */
      gx.fillStyle = "rgba(47,111,214,.10)"; gx.beginPath(); gx.moveTo(ax.X(b * LZ_CT0), ax.Y(LZ_CT0)); gx.lineTo(ax.X(b * LZ_CT1), ax.Y(LZ_CT1)); gx.lineTo(ax.X(b * LZ_CT1 + L), ax.Y(LZ_CT1)); gx.lineTo(ax.X(b * LZ_CT0 + L), ax.Y(LZ_CT0)); gx.closePath(); gx.fill();
      /* axes du train : ct′ (x′ = 0 : x = βct) et x′ (ct′ = 0 : ct = βx) */
      gx.strokeStyle = "#2f6fd6"; gx.lineWidth = 2.4;
      gx.beginPath(); gx.moveTo(ax.X(b * LZ_CT0), ax.Y(LZ_CT0)); gx.lineTo(ax.X(b * 2000), ax.Y(2000)); gx.stroke();
      gx.beginPath(); gx.moveTo(ax.X(LZ_X0), ax.Y(b * LZ_X0)); gx.lineTo(ax.X(2000), ax.Y(b * 2000)); gx.stroke();
      /* graduations des axes primés tous les 200 m (x = γX, ct = γβX) */
      gx.fillStyle = "#2f6fd6";
      for (i = -4; i <= 8; i++){ if (!i) continue; var Xp = i * 200;
        var p1 = [ax.X(g * Xp), ax.Y(g * b * Xp)], p2 = [ax.X(g * b * Xp), ax.Y(g * Xp)];
        gx.beginPath(); gx.arc(p1[0], p1[1], 3, 0, TAU); gx.fill(); gx.beginPath(); gx.arc(p2[0], p2[1], 3, 0, TAU); gx.fill(); }
      /* maintenant : pour le quai (horizontale) et pour le train (parallèle à x′, passant par l'arrière du train) */
      gx.strokeStyle = "#2e9e6a"; gx.lineWidth = 1.6; gx.beginPath(); gx.moveTo(ax.L, ax.Y(ct)); gx.lineTo(ax.R, ax.Y(ct)); gx.stroke();
      var xr0 = b * ct, cr0 = ct;   /* arrière du train maintenant */
      gx.setLineDash([6, 4]); gx.strokeStyle = "#2f6fd6"; gx.lineWidth = 1.4;
      gx.beginPath(); gx.moveTo(ax.X(xr0 - 2000), ax.Y(cr0 - b * 2000)); gx.lineTo(ax.X(xr0 + 2000), ax.Y(cr0 + b * 2000)); gx.stroke(); gx.setLineDash([]);
      /* le train, maintenant, sur la ligne du quai */
      gx.strokeStyle = "#13233a"; gx.lineWidth = 4; gx.lineCap = "round"; gx.beginPath(); gx.moveTo(ax.X(xr0), ax.Y(ct)); gx.lineTo(ax.X(xr0 + L), ax.Y(ct)); gx.stroke();
      /* événement et ses projections sur les axes du train (parallèles aux axes) */
      var Pp = lzPrime(b, ev.x, ev.ct), EX = ax.X(ev.x), EY = ax.Y(ev.ct);
      gx.setLineDash([3, 3]); gx.strokeStyle = "#c0321d"; gx.lineWidth = 1.3;
      var xa = [g * Pp[0], g * b * Pp[0]], ca = [g * b * Pp[1], g * Pp[1]];   /* pieds sur x′ et ct′ */
      gx.beginPath(); gx.moveTo(EX, EY); gx.lineTo(ax.X(xa[0]), ax.Y(xa[1])); gx.moveTo(EX, EY); gx.lineTo(ax.X(ca[0]), ax.Y(ca[1])); gx.stroke();
      gx.strokeStyle = "rgba(19,35,58,.5)"; gx.beginPath(); gx.moveTo(EX, EY); gx.lineTo(EX, ax.Y(0)); gx.moveTo(EX, EY); gx.lineTo(ax.X(0), EY); gx.stroke();
      gx.setLineDash([]);
      gx.restore();
      S.draw.dot(f, EX, EY, 6, "#c0321d");
      /* étiquettes des axes primés */
      var fz2 = wfz(f, 11), fzc = wfz(f, 10.5);
      /* zones déjà occupées (x0, y0, x1, y1), pour poser « maintenant (quai) » sans chevauchement */
      var occ = [];
      function txt(sx, x, y, o){ wT(S, f, sx, x, y, o); var ww = wmeas(gx, sx, o.size, o.weight || 700), al = o.align || "center", x0 = al === "left" ? x : al === "right" ? x - ww : x - ww / 2; occ.push([x0 - 2, y - o.size * 0.7, x0 + ww + 2, y + o.size * 0.7]); }
      [200, 400, 600].forEach(function(v){ occ.push([ax.X(0) - 32, ax.Y(v) - 7, ax.X(0) - 2, ax.Y(v) + 7]); });   /* graduations de ct */
      occ.push([ax.L, ax.Y(0) + 3, ax.R, ax.Y(0) + 18]);                                                        /* graduations de x */
      occ.push([ax.R - 44, ax.Y(0) - 19, ax.R, ax.Y(0) - 3]);                                                   /* « x (m) » */
      occ.push([ax.X(0) + 4, ax.T - 2, ax.X(0) + 56, ax.T + 15]);                                               /* « ct (m) » */
      /* ct′ à gauche de son axe, x′ à droite (ou au-dessus) du sien, lumière sur la diagonale de gauche */
      var yc = LZ_CT1 - 30;
      if (b >= 0.08) txt("ct′", ax.X(b * yc) - 7, ax.Y(yc), {size:fz2 + 1, color:"#2f6fd6", align:"right", halo:"#fbfcfe", weight:800});
      if (b < 0.08) txt("β ≈ 0 : axes du train = axes du quai", ax.R - 4, ax.B - 10, {size:fz2, color:"#2f6fd6", align:"right", halo:"#fbfcfe"});
      else if (b * (LZ_X1 - 20) < LZ_CT1 - 24) txt("x′", ax.X(LZ_X1 - 20), ax.Y(b * (LZ_X1 - 20)) - 10, {size:fz2 + 1, color:"#2f6fd6", align:"right", halo:"#fbfcfe", weight:800});
      else txt("x′", ax.X((LZ_CT1 - 24) / b) + 7, ax.Y(LZ_CT1 - 24), {size:fz2 + 1, color:"#2f6fd6", align:"left", halo:"#fbfcfe", weight:800});
      txt("lumière", ax.X(-125) + 6, ax.Y(125) - 2, {size:fz2, color:"#b07a10", align:"left", halo:"#fbfcfe"});
      txt("clique pour placer l'événement", ax.R - 4, Math.max(8, ax.T - 11), {size:fzc, color:"#7b8694", align:"right", halo:true, weight:600});
      /* étiquette de l'événement (elle évite déjà la ligne verte) */
      var lbl = (phone ? "E : x′ = " : "E dans le train : x′ = ") + wN(Pp[0], 0) + " m ; ct′ = " + wN(Pp[1], 0) + " m";
      var lw = wmeas(gx, lbl, fz2, 800) + 6, lx = wclamp(EX - lw / 2, ax.L + 2, ax.R - lw - 2);
      var ly = EY + 17; if (Math.abs(ly - ax.Y(ct)) < 12 || ly > ax.B - 22) ly = EY - 15; if (Math.abs(ly - ax.Y(ct)) < 12) ly = EY + (ax.Y(ct) > EY ? -15 : 17);
      txt(lbl, lx, ly, {size:fz2, color:"#c0321d", align:"left", halo:"#fbfcfe", weight:800});
      occ.push([EX - 8, EY - 8, EX + 8, EY + 8]);
      /* « maintenant (quai) » : à gauche (ax.L + 4), au-dessus ou au-dessous de sa ligne ; à droite seulement si la gauche est prise */
      var sN = "maintenant (quai)", wNw = wmeas(gx, sN, fz2, 700), yN = ax.Y(ct), hN = fz2 * 0.7;
      var cand = [[ax.L + 4, yN - 11], [ax.L + 4, yN + 12], [ax.R - 4 - wNw, yN - 11], [ax.R - 4 - wNw, yN + 12]], best = null, bestO = 1e9;
      cand.forEach(function(cd){
        var x0 = cd[0] - 2, x1 = cd[0] + wNw + 2, y0 = cd[1] - hN, y1 = cd[1] + hN, o = 0;
        if (y0 < 2 || y1 > f.H - 2) o += 1e6;
        occ.forEach(function(r){ var dx = Math.min(x1, r[2]) - Math.max(x0, r[0]), dy = Math.min(y1, r[3]) - Math.max(y0, r[1]); if (dx > 0 && dy > 0) o += dx * dy; });
        if (o < bestO - 1e-9){ bestO = o; best = cd; }
      });
      wT(S, f, sN, best[0], best[1], {size:fz2, color:"#2e9e6a", align:"left", halo:"#fbfcfe"});

      /* ---- afficheurs ---- */
      ro.set(0, wN(g, 4));
      ro.set(1, wN(L, 1) + " m");
      ro.set(2, wN(ev.x, 0) + " m ; " + wN(ev.ct / LZ_CUS, 3) + " µs");
      ro.set(3, wN(Pp[0], 1) + " m ; " + wN(Pp[1] / LZ_CUS, 3) + " µs");
      ro.set(4, wN(g, 4) + " µs");
      ro.set(5, wN(b * LZ_L0 / LZ_CUS, 3) + " µs");
      nt.set("Dans le diagramme, la ligne verte relie les événements simultanés pour le quai, la pointillée bleue ceux simultanés pour le train. Les horloges du train sont synchronisées dans le train : vues du quai, celle de tête retarde de βL₀/c = " + wN(b * LZ_L0 / LZ_CUS, 3) + " µs sur celle de queue. Chacune avance γ = " + wN(g, 3) + " fois plus lentement que les horloges du quai. " +
        (b > 0.85 ? "Près de c, les axes ct′ et x′ se referment sur la diagonale de la lumière." : "Monte β : les axes du train se referment vers la diagonale de la lumière."), "ok");
    });
  }
});

/* =====================================================================
   5. Le four et la catastrophe ultraviolette (pq02)
   ===================================================================== */
var BB_SIG = 5.670374419e-8, BB_A = 4 * BB_SIG / CL, BB_WIEN = 2.897771955e-3, BB_XN = 2.821439372;
var BB_K = 8 * PI * HP / (CL * CL * CL);
/* densité spectrale d'énergie (J·m⁻³·Hz⁻¹) : Planck et Rayleigh-Jeans */
function bbP(nu, T){ if (!(nu > 0)) return 0; var x = HP * nu / (KB * T); if (x > 700) return 0; return BB_K * nu * nu * nu / (x < 1e-6 ? x : Math.expm1(x)); }
function bbRJ(nu, T){ return 8 * PI * nu * nu * KB * T / (CL * CL * CL); }
/* fonctions colorimétriques CIE 1931 : ajustement analytique par sommes de gaussiennes dissymétriques */
function bbG(l, m, s1, s2){ var t = (l - m) / (l < m ? s1 : s2); return Math.exp(-0.5 * t * t); }
function bbXYZ(l){
  return [1.056 * bbG(l, 599.8, 37.9, 31.0) + 0.362 * bbG(l, 442.0, 16.0, 26.7) - 0.065 * bbG(l, 501.1, 20.4, 26.2),
          0.821 * bbG(l, 568.8, 46.9, 40.5) + 0.286 * bbG(l, 530.9, 16.3, 31.1),
          1.217 * bbG(l, 437.0, 11.8, 36.0) + 0.681 * bbG(l, 459.0, 26.0, 13.8)];
}
/* couleur (sRGB normalisée) et luminance relative Y d'un corps noir à T */
function bbColor(T){
  var X = 0, Y = 0, Z = 0;
  for (var l = 380; l <= 780; l += 5){ var lm = l * 1e-9, B = 1 / (Math.pow(lm, 5) * Math.expm1(HP * CL / (lm * KB * T))), q = bbXYZ(l); X += B * q[0]; Y += B * q[1]; Z += B * q[2]; }
  var r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  var m = Math.max(r, g, b); r = Math.max(0, r / m); g = Math.max(0, g / m); b = Math.max(0, b / m);
  function gam(v){ return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; }
  return {rgb:[Math.round(255 * gam(r)), Math.round(255 * gam(g)), Math.round(255 * gam(b))], Y:Y};
}
var BB_Y800 = bbColor(800).Y, BB_Y3000 = bbColor(3000).Y;
/* éclat perçu (0-1), échelle logarithmique : presque noir vers 700 K */
function bbBright(Y){ return wclamp((Math.log10(Y) - Math.log10(BB_Y800)) / (Math.log10(BB_Y3000) - Math.log10(BB_Y800)) * 0.85 + 0.12, 0, 1); }
function bbName(T){ return T < 750 ? "noir à l'œil (infrarouge seulement)" : T < 1000 ? "rouge sombre" : T < 1400 ? "rouge cerise" : T < 1900 ? "orange" : T < 3200 ? "jaune" : T < 5500 ? "blanc chaud" : T <= 6500 ? "blanc" : "blanc bleuté"; }
/* fréquence d'un photon tiré au hasard dans le spectre de Planck (nombre de photons ∝ x²/(eˣ − 1)) */
function bbDrawNu(T){ for (var t = 0; t < 400; t++){ var x = Math.random() * 12; if (Math.random() * 0.65 < x * x / Math.expm1(Math.max(x, 1e-6))) return x * KB * T / HP; } return 1.6 * KB * T / HP; }

SFA.sim({
  id:"pq-corps-noir-catastrophe-uv", ch:"pq02", tag:"Rayonnement thermique",
  titre:"Le four et la catastrophe ultraviolette",
  resume:"L'orifice d'un four passe du rouge sombre au blanc bleuté ; la loi de Planck suit la mesure, la loi classique file vers l'infini dans l'UV.",
  but:"Monte la température du four (curseur, ou glisse verticalement sur le four) et regarde la couleur de l'orifice. Sur le graphe, compare la loi de Planck à la loi classique de Rayleigh-Jeans, garde une courbe pour comparer, et survole le graphe pour lire les valeurs.",
  aRetenir:"u(ν, T) = (8πhν³/c³)/(e^(hν/kT) − 1) : le pic suit la loi de Wien et l'énergie totale vaut aT⁴.",
  piege:"Le pic en fréquence (ν_max = 2,82 kT/h) ne correspond pas au pic en longueur d'onde (λ_max = b/T) : c/ν_max ≠ λ_max.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 380), f = k.canvas(phone ? 290 : 290);
    var tS = k.slider("Température du four T", 500, 7000, 50, 1800, "K");
    var rjT = k.toggle("Loi classique (Rayleigh-Jeans : k<sub>B</sub>T par mode)", true);
    var fxT = k.toggle("Échelle verticale fixe (celle de 7 000 K)", false);
    var pins = [];
    k.button("Garder cette courbe", function(){ if (pins.indexOf(tS.value) < 0){ pins.push(tS.value); if (pins.length > 3) pins.shift(); } }, true);
    k.button("Effacer", function(){ pins = []; });
    var ro = k.readouts(["Couleur de l'orifice", "Pic en fréquence ν<sub>max</sub>", "Pic en longueur d'onde λ<sub>max</sub>", "Puissance émise σT⁴", "Énergie volumique aT⁴", "Énergie totale classique"]);
    var nt = k.note("", "ok");
    var ph = [], sp = [], accP = 0, accS = 0, hov = null, drag = null, col = bbColor(1800), colT = 1800;
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ns-resize";
    c.pointer(function(type, p){
      if (type === "down") drag = {y:p.y, T:tS.value};
      if (type === "drag" && drag){ tS.set(Math.round(wclamp(drag.T + (drag.y - p.y) * 12, 500, 7000) / 50) * 50); k.redraw(); }
      if (type === "up") drag = null;
    });
    f.pointer(function(type, p){ if (type === "move" || type === "drag" || type === "down") { hov = p.x; k.redraw(); } });
    f.cv.addEventListener("pointerleave", function(){ hov = null; k.redraw(); });
    var G = {};
    var lp = k.loop(function(dt, t){
      var T = tS.value;
      accP += dt * (6 + 10 * Math.min(1, T / 3000)); while (accP >= 1){ accP -= 1; ph.push({s:0, nu:bbDrawNu(T), a:(Math.random() - 0.5) * 0.9}); }
      for (var i = ph.length - 1; i >= 0; i--){ ph[i].s += dt * 0.55; if (ph[i].s > 1) ph.splice(i, 1); }
      accS += dt * 10 * Math.min(1.5, T / 2000); while (accS >= 1){ accS -= 1; sp.push({x:(Math.random() - 0.5) * 0.5, y:0, vx:(Math.random() - 0.5) * 0.15, vy:0.4 + Math.random() * 0.5, life:1}); }
      for (i = sp.length - 1; i >= 0; i--){ var q = sp[i]; q.x += q.vx * dt; q.y += q.vy * dt; q.vy -= 0.05 * dt; q.life -= dt * 0.7; if (q.life <= 0) sp.splice(i, 1); }
      k.redraw();
    });
    lp.play();
    var t0 = performance.now();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, T = tS.value, i, tt = (performance.now() - t0) / 1000;
      if (colT !== T){ col = bbColor(T); colT = T; }
      var br = bbBright(col.Y), fl = 1 + 0.04 * Math.sin(tt * 13) + 0.03 * Math.sin(tt * 7.3);
      var rgb = col.rgb;
      /* atelier : mur de planches, sol de terre battue */
      var gw = ctx.createLinearGradient(0, 0, 0, H); gw.addColorStop(0, "#2a1e17"); gw.addColorStop(0.7, "#3b2a1f"); gw.addColorStop(1, "#1d1510");
      ctx.fillStyle = gw; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,0,0,.28)"; ctx.lineWidth = 1; for (i = 0; i < W; i += 38){ ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, H * 0.74); ctx.stroke(); }
      var yF = H * 0.78; var gf = ctx.createLinearGradient(0, yF, 0, H); gf.addColorStop(0, "#4a3a2c"); gf.addColorStop(1, "#231a12"); ctx.fillStyle = gf; ctx.fillRect(0, yF, W, H - yF);
      /* four en briques : face avant, côté en perspective, cheminée */
      var fw = W * (phone ? 0.52 : 0.47), fh = H * 0.62, fx = W * (phone ? 0.42 : 0.45), fy = yF - fh, dpx = fw * 0.16, dpy = -fh * 0.1;
      /* reflet de la lumière du four sur le mur et le sol */
      if (br > 0.05) wglow(ctx, fx + fw * 0.45, fy + fh * 0.55, Math.max(W, H) * 0.55 * fl, rgb, 0.22 * br);
      ctx.save();
      /* côté droit */
      ctx.fillStyle = "#5a2e1e"; ctx.beginPath(); ctx.moveTo(fx + fw, fy); ctx.lineTo(fx + fw + dpx, fy + dpy); ctx.lineTo(fx + fw + dpx, yF + dpy); ctx.lineTo(fx + fw, yF); ctx.closePath(); ctx.fill();
      /* dessus */
      ctx.fillStyle = "#8a4a32"; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + dpx, fy + dpy); ctx.lineTo(fx + fw + dpx, fy + dpy); ctx.lineTo(fx + fw, fy); ctx.closePath(); ctx.fill();
      /* cheminée */
      var cx0 = fx + fw * 0.6, cw = fw * 0.22; var gc = ctx.createLinearGradient(cx0, 0, cx0 + cw, 0); gc.addColorStop(0, "#6a3524"); gc.addColorStop(1, "#45220f");
      ctx.fillStyle = gc; ctx.fillRect(cx0 + dpx * 0.5, 0, cw, fy + dpy * 0.5 + 2);
      /* face avant en briques */
      var gF = ctx.createLinearGradient(fx, fy, fx + fw, yF); gF.addColorStop(0, "#9b4f35"); gF.addColorStop(1, "#6e3423"); ctx.fillStyle = gF; ctx.fillRect(fx, fy, fw, fh);
      ctx.strokeStyle = "rgba(40,18,10,.55)"; ctx.lineWidth = 1.2;
      var bh = fh / 9; for (i = 0; i <= 9; i++){ ctx.beginPath(); ctx.moveTo(fx, fy + i * bh); ctx.lineTo(fx + fw, fy + i * bh); ctx.stroke(); }
      for (i = 0; i < 9; i++){ var off = i % 2 ? fw / 10 : 0; for (var j = off; j < fw; j += fw / 5){ ctx.beginPath(); ctx.moveTo(fx + j, fy + i * bh); ctx.lineTo(fx + j, fy + (i + 1) * bh); ctx.stroke(); } }
      ctx.restore();
      /* orifice : cavité vue par un petit trou (couleur du corps noir à T) */
      var ox = fx + fw * 0.42, oy = fy + fh * 0.5, orr = Math.min(fw, fh) * 0.16;
      G.ox = ox; G.oy = oy;
      ctx.save(); ctx.fillStyle = "#1a0d08"; ctx.beginPath(); ctx.arc(ox, oy, orr * 1.22, 0, TAU); ctx.fill();
      var inner = wa(rgb, 0.08 + 0.92 * br), go = ctx.createRadialGradient(ox, oy, 0, ox, oy, orr);
      go.addColorStop(0, br > 0.9 ? "#ffffff" : wa(rgb.map(function(v){ return Math.min(255, v * (0.3 + 0.8 * br)); }), 1)); go.addColorStop(0.85, wa(rgb.map(function(v){ return v * (0.15 + 0.8 * br); }), 1)); go.addColorStop(1, "#1a0d08");
      ctx.fillStyle = go; ctx.beginPath(); ctx.arc(ox, oy, orr, 0, TAU); ctx.fill(); ctx.restore();
      if (br > 0.05){ ctx.save(); ctx.globalCompositeOperation = "lighter"; wglow(ctx, ox, oy, orr * (2.2 + 1.8 * br) * fl, rgb, 0.55 * br); ctx.restore(); }
      /* étincelles qui montent de la cheminée */
      sp.forEach(function(q){ var X = cx0 + dpx * 0.5 + cw / 2 + q.x * cw * 2, Y = -q.y * H * 0.5 + fy * 0.2; if (Y < -5) return; wglow(ctx, X, Y + 6, 4, "#ffb347", 0.9 * q.life); });
      /* photons qui sortent de l'orifice vers le spectromètre (à gauche) */
      var sx = W * (phone ? 0.12 : 0.13), sy = H * 0.42;
      ph.forEach(function(q){
        var lam = CL / q.nu * 1e9, vis = lam >= 380 && lam <= 780, cc = vis ? bbWl(lam) : lam > 780 ? [150, 40, 30] : [170, 120, 255];
        var X = ox + (sx + 30 - ox) * q.s, Y = oy + (sy - oy) * q.s + q.a * 40 * Math.sin(q.s * PI), ang = Math.atan2(sy - oy, sx + 30 - ox);
        ctx.save(); ctx.globalAlpha = vis ? 0.95 : 0.55; ctx.strokeStyle = wa(cc, 1); ctx.lineWidth = 1.6; ctx.beginPath();
        var kk = 0.9e-14 * q.nu;   /* nombre d'ondulations visible ∝ fréquence */
        for (var j = 0; j <= 18; j++){ var u = (j - 9) * 1.4, w = Math.sin(j / 18 * TAU * kk) * 3.5 * Math.exp(-Math.pow((j - 9) / 6, 2)); var XX = X + Math.cos(ang) * u - Math.sin(ang) * w, YY = Y + Math.sin(ang) * u + Math.cos(ang) * w; if (j) ctx.lineTo(XX, YY); else ctx.moveTo(XX, YY); }
        ctx.stroke(); ctx.restore();
      });
      /* spectromètre sur trépied */
      ctx.save(); ctx.strokeStyle = "#20252e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy + 16); ctx.lineTo(sx - 18, yF + 10); ctx.moveTo(sx, sy + 16); ctx.lineTo(sx + 16, yF + 10); ctx.moveTo(sx, sy + 16); ctx.lineTo(sx + 2, yF + 4); ctx.stroke();
      var gs = ctx.createLinearGradient(0, sy - 16, 0, sy + 16); gs.addColorStop(0, "#8d97a8"); gs.addColorStop(0.5, "#4a5468"); gs.addColorStop(1, "#262c38");
      ctx.fillStyle = gs; wrr(ctx, sx - 30, sy - 15, 62, 30, 6); ctx.fill(); ctx.fillStyle = "#11151d"; ctx.beginPath(); ctx.ellipse(sx + 32, sy, 4, 10, 0, 0, TAU); ctx.fill(); ctx.restore();
      wtag(S, c, "spectromètre", sx, sy - 30, {size:10.5});
      /* thermomètre du four */
      var tx = fx + fw * 0.84, ty0 = fy + fh * 0.15, tlen = fh * 0.7;
      ctx.save(); ctx.fillStyle = "#e9edf3"; wrr(ctx, tx - 6, ty0, 12, tlen, 6); ctx.fill();
      var fr = (T - 500) / 6500, gT = ctx.createLinearGradient(0, ty0 + tlen, 0, ty0); gT.addColorStop(0, "#c0321d"); gT.addColorStop(1, "#ff8a5c");
      ctx.fillStyle = gT; wrr(ctx, tx - 3, ty0 + tlen * (1 - fr) + 2, 6, tlen * fr - 2, 3); ctx.fill(); wball(ctx, tx, ty0 + tlen + 4, 8, "#c0321d"); ctx.restore();
      wtag(S, c, wN(T, 0) + " K", tx, ty0 - 12, {size:12, color:"#ffd9a8"});
      wtag(S, c, "orifice : " + (phone && T < 750 ? "noir à l'œil (IR)" : bbName(T)), ox, Math.min(oy + orr * 1.6 + 14, yF - 12), {size:phone ? 10.5 : 11.5, color:"#fff"});
      wT(S, c, phone ? "glisse ↕ sur le four : T" : "glisse verticalement sur le four pour changer T", W - 8, H - 12, {size:wfz(c, 10.5), color:"rgba(240,225,210,.8)", align:"right", weight:600});
      wT(S, c, "photons IR : en rouge sombre", 8, H - 12, {size:wfz(c, 10.5), color:"rgba(240,180,160,.85)", align:"left", weight:600});

      /* ---- graphe u(ν, T) ---- */
      f.clear(); var g = f.ctx; g.fillStyle = "#fbfcfe"; g.fillRect(0, 0, f.W, f.H);
      var N1 = 15e14, umax = bbP(BB_XN * KB * (fxT.value ? 7000 : T) / HP, fxT.value ? 7000 : T);
      var top = fxT.value ? umax * 1.1 : umax * 1.7, e = Math.floor(Math.log10(top)), un = Math.pow(10, e);
      var ax = S.draw.axes(f, {x0:0, x1:15, y0:0, y1:top / un, l:44, b:44, t:24, r:12, stepX:phone ? 5 : 1, xl:"ν (10¹⁴ Hz)", yl:"u (10" + wsup(e) + " J·m⁻³·Hz⁻¹)"});
      /* bande visible */
      var v0 = CL / 780e-9 / 1e14, v1 = CL / 380e-9 / 1e14;
      for (i = 0; i < 60; i++){ var nuv = v0 + (v1 - v0) * i / 60, lv = CL / (nuv * 1e14) * 1e9; g.fillStyle = wa(bbWl(lv), 0.13); g.fillRect(ax.X(nuv), ax.T, ax.X(v0 + (v1 - v0) * (i + 1) / 60) - ax.X(nuv) + 0.5, ax.B - ax.T); g.fillStyle = wa(bbWl(lv), 1); g.fillRect(ax.X(nuv), ax.B + 22, ax.X(v0 + (v1 - v0) * (i + 1) / 60) - ax.X(nuv) + 0.5, 5); }
      wT(S, f, "visible", ax.X((v0 + v1) / 2), ax.B + 35, {size:wfz(f, 10), color:"#5f6b7a", weight:600});
      wT(S, f, "UV →", ax.X(Math.min(14.2, v1 + 1.2)), ax.B + 35, {size:wfz(f, 10), color:"#7b5cc8", weight:700});
      if (!phone) wT(S, f, "← IR", ax.X(1.3), ax.B + 35, {size:wfz(f, 10), color:"#a33", weight:700});
      /* courbes gardées */
      pins.forEach(function(Tp){ S.draw.fn(f, ax, function(x){ return bbP(x * 1e14, Tp) / un; }, "#9aa5b5", 1.6, [4, 3]); });
      /* aire sous Planck */
      g.save(); g.beginPath(); g.moveTo(ax.X(0), ax.Y(0)); for (i = 0; i <= 300; i++){ var xx = 15 * i / 300; g.lineTo(ax.X(xx), ax.Y(Math.min(top / un * 1.02, bbP(xx * 1e14, T) / un))); } g.lineTo(ax.X(15), ax.Y(0)); g.closePath();
      g.fillStyle = wa(rgb, 0.22); g.fill(); g.restore();
      if (rjT.value) S.draw.fn(f, ax, function(x){ return bbRJ(x * 1e14, T) / un; }, "#7b5cc8", 2.2, [6, 4]);
      S.draw.fn(f, ax, function(x){ return bbP(x * 1e14, T) / un; }, "#c0321d", 2.6);
      var numx = BB_XN * KB * T / HP;
      if (numx / 1e14 < 15){ g.save(); g.setLineDash([3, 3]); g.strokeStyle = "#c0321d"; g.lineWidth = 1; g.beginPath(); g.moveTo(ax.X(numx / 1e14), ax.Y(bbP(numx, T) / un)); g.lineTo(ax.X(numx / 1e14), ax.B); g.stroke(); g.restore(); S.draw.dot(f, ax.X(numx / 1e14), ax.Y(bbP(numx, T) / un), 5, "#c0321d"); }
      /* étiquettes des courbes gardées, posées après les courbes pour rester lisibles */
      pins.forEach(function(Tp){ var xm = BB_XN * KB * Tp / HP / 1e14, ym = bbP(xm * 1e14, Tp) / un; if (xm < 15 && ym < top / un) wT(S, f, wN(Tp, 0) + " K", ax.X(xm), ax.Y(ym) - 9, {size:wfz(f, 10), color:"#6b7686", halo:"#fff"}); });
      /* légende */
      var lgx = ax.R - 6, lgy = ax.T + 10, fz = wfz(f, 10.5);
      wT(S, f, "— Planck", lgx, lgy, {size:fz, color:"#c0321d", align:"right", halo:true});
      if (rjT.value){
        wT(S, f, "- - classique (→ ∞)", lgx, lgy + 15, {size:fz, color:"#7b5cc8", align:"right", halo:true});
        /* où la loi classique sort du cadre */
        var nuOut = Math.sqrt(top * CL * CL * CL / (8 * PI * KB * T)) / 1e14;
        if (nuOut < 15) wT(S, f, "↑ catastrophe UV", Math.min(ax.X(nuOut) + 4, ax.R - 70), ax.T + 44, {size:fz, color:"#7b5cc8", align:"left", halo:true, weight:800});
      }
      /* lecture au survol */
      if (hov != null && hov >= ax.L && hov <= ax.R){
        var nh = ax.ix(hov) * 1e14, uP = bbP(nh, T), uR = bbRJ(nh, T);
        g.save(); g.strokeStyle = "rgba(19,35,58,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(hov + 0.5, ax.T); g.lineTo(hov + 0.5, ax.B); g.stroke(); g.restore();
        var txt = "ν = " + wN(nh / 1e14, 2) + "·10¹⁴ Hz : classique/Planck = " + (uP > 0 ? wsci(uR / uP, 2) : "∞");
        var tw = wmeas(g, txt, fz, 700) + 10, tx2 = wclamp(hov - tw / 2, 2, f.W - tw - 2);
        wT(S, f, txt, tx2 + 5, ax.T + 60, {size:fz, color:"#13233a", align:"left", bg:"rgba(255,255,255,.92)"});
      }

      /* ---- afficheurs ---- */
      ro.set(0, bbName(T));
      ro.set(1, wN(numx / 1e14, 2) + "·10<sup>14</sup> Hz");
      var lm = BB_WIEN / T;
      ro.set(2, lm >= 1e-6 ? wN(lm * 1e6, 3) + " µm" : wN(lm * 1e9, 0) + " nm");
      var P = BB_SIG * Math.pow(T, 4);
      ro.set(3, P >= 1e6 ? wN(P / 1e6, 2) + " MW/m²" : wN(P / 1e3, 1) + " kW/m²");
      ro.set(4, wsci(BB_A * Math.pow(T, 4), 3, true) + " J/m³");
      ro.set(5, "infinie");
      nt.set("La loi classique donne k<sub>B</sub>T à chacun des modes du four, et ils sont de plus en plus nombreux vers l'UV : l'énergie totale diverge. Planck : un mode de fréquence ν n'échange que des quanta hν, si bien que les modes où hν ≫ k<sub>B</sub>T restent vides. " +
        "À " + wN(T, 0) + " K, c/ν<sub>max</sub> = " + wN(CL / numx * 1e6, 2) + " µm mais λ<sub>max</sub> = " + wN(lm * 1e6, 2) + " µm.", T < 750 ? "warn" : "ok");
    });
  }
});
/* couleur perçue d'une longueur d'onde visible (nm) */
function bbWl(nm){
  var r = 0, g = 0, b = 0;
  if (nm < 440){ r = (440 - nm) / 60; b = 1; } else if (nm < 490){ g = (nm - 440) / 50; b = 1; } else if (nm < 510){ g = 1; b = (510 - nm) / 20; }
  else if (nm < 580){ r = (nm - 510) / 70; g = 1; } else if (nm < 645){ r = 1; g = (645 - nm) / 65; } else r = 1;
  var f = nm < 420 ? 0.35 + 0.65 * (nm - 380) / 40 : nm > 700 ? 0.35 + 0.65 * (780 - nm) / 80 : 1;
  return [Math.round(255 * Math.pow(r * f, 0.8)), Math.round(255 * Math.pow(g * f, 0.8)), Math.round(255 * Math.pow(b * f, 0.8))];
}

/* =====================================================================
   6. Effet Compton (pq02)
   ===================================================================== */
var CP_LC = HP / (ME * CL) * 1e12;          /* longueur d'onde de Compton (pm) = 2,426 */
var CP_HC = HP * CL / QE * 1e12 / 1e3;      /* hc en keV·pm = 1239,84 */
var CP_MC2 = ME * CL * CL / QE / 1e3;       /* mₑc² en keV = 511,0 */
function cpKin(lam, thDeg){
  var th = thDeg * PI / 180, d = CP_LC * (1 - Math.cos(th)), l2 = lam + d, E = CP_HC / lam, E2 = CP_HC / l2;
  /* recul de l'électron : cot φ = (1 + E/mₑc²)·tan(θ/2) */
  var phi = thDeg < 1e-9 ? PI / 2 : Math.atan2(1, (1 + E / CP_MC2) * Math.tan(th / 2));
  var p = E, p2 = E2, pe = Math.sqrt(p * p + p2 * p2 - 2 * p * p2 * Math.cos(th));   /* impulsions en keV/c */
  return {th:th, d:d, l2:l2, E:E, E2:E2, T:E - E2, phi:phi, p:p, p2:p2, pe:pe};
}
/* section efficace de Klein-Nishina (relative) : (λ/λ′)²·(λ/λ′ + λ′/λ − sin²θ) */
function cpKN(lam, thDeg){ var K = cpKin(lam, thDeg), r = lam / K.l2, s = Math.sin(K.th); return r * r * (r + 1 / r - s * s); }

SFA.sim({
  id:"pq-compton", ch:"pq02", tag:"Photon",
  titre:"Effet Compton : un photon X rebondit sur un électron",
  resume:"Un photon X frappe un électron au repos ; le détecteur, qu'on fait tourner autour de la cible, mesure une longueur d'onde allongée.",
  but:"Attrape le détecteur et fais-le tourner autour de la cible : l'écart Δλ = λ′ − λ grandit avec l'angle θ. Change λ pour voir que Δλ n'en dépend pas. Le spectre mesuré se remplit en dessous ; le triangle des impulsions montre la conservation de p. Glisse ailleurs sur la scène pour tourner la vue.",
  aRetenir:"λ′ − λ = (h/mₑc)(1 − cos θ), avec h/mₑc = 2,43 pm : le photon cède énergie et impulsion à l'électron, comme une bille.",
  piege:"Δλ ne dépend pas de λ : l'effet n'est visible qu'avec des longueurs d'onde de quelques pm à quelques dizaines de pm (rayons X ou γ).",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 390), f = k.canvas(phone ? 300 : 230);
    var lS = k.slider("Longueur d'onde des rayons X λ", 1, 100, 0.5, 10, "pm", function(){ resetSpec(); });
    var thS = k.slider("Angle du détecteur θ", 0, 165, 1, 90, "°", function(){ resetSpec(); });
    var triT = k.toggle("Triangle des impulsions", true);
    var ro = k.readouts(["λ incident", "λ′ diffusé", "Δλ = λ′ − λ", "Énergie du photon : E → E′", "Électron : énergie cinétique", "Électron : angle de recul φ"]);
    var nt = k.note("", "ok");
    var NB = 70, hist = new Float64Array(NB), nTot = 0, ev = [], acc = 0, range = null;
    function resetSpec(){ hist = new Float64Array(NB); nTot = 0; range = null; }
    /* fenêtre du spectre (pm) : autour de λ et de λ′ max */
    function rng(){ var l = lS.value, sg = 0.35 + 0.012 * l, K = cpKin(l, thS.value), a = Math.max(0, l - 1.2 - 4 * sg), b = K.l2 + 1.2 + 4 * sg; return [a, b]; }
    /* vue 3D */
    var v = new W3(); v.a = -0.15; v.b = 0.6; v.f = 20; v.set();
    var RD = 2.55, dragD = false;
    function detPos(th, y){ var t = th * PI / 180; return [RD * Math.cos(t), y, RD * Math.sin(t)]; }
    worbit(c, v, k, [0.15, 1.3], function(type, p){
      if (type === "down"){ var q = v.p.apply(v, detPos(thS.value, 0.45)); if (Math.hypot(p.x - q.x, p.y - q.y) < 34){ dragD = true; return false; } return true; }
      if (type === "drag" && dragD){
        var best = 0, bd = 1e9; for (var a = 0; a <= 165; a++){ var q2 = v.p.apply(v, detPos(a, 0.45)), d = Math.hypot(p.x - q2.x, p.y - q2.y); if (d < bd){ bd = d; best = a; } }
        if (best !== thS.value){ thS.set(best); resetSpec(); } k.redraw();
      }
      if (type === "move"){ var q3 = v.p.apply(v, detPos(thS.value, 0.45)); c.cv.style.cursor = Math.hypot(p.x - q3.x, p.y - q3.y) < 34 ? "pointer" : "grab"; }
      if (type === "up") dragD = false;
    });
    var lp = k.loop(function(dt, t){
      acc += dt * 1.6;
      if (acc >= 1){ acc -= 1; ev.push({s:0, shifted:Math.random() < 0.75, sgn:Math.random()}); }
      for (var i = ev.length - 1; i >= 0; i--){ ev[i].s += dt * 0.7; if (ev[i].s >= 1) ev.splice(i, 1); }
      /* comptage au détecteur (bien plus de photons que ceux qu'on dessine) */
      var l = lS.value, K = cpKin(l, thS.value), R = rng(), kn = cpKN(l, thS.value) / cpKN(l, 90);
      var n = Math.round(dt * 160);
      for (var j = 0; j < n; j++){
        var shifted = Math.random() < 0.72 * kn / (0.72 * kn + 0.28), x = (shifted ? K.l2 : l) + wgauss() * (shifted ? 0.35 + 0.012 * l : 0.25 + 0.01 * l);
        var b = Math.floor((x - R[0]) / (R[1] - R[0]) * NB); if (b >= 0 && b < NB){ hist[b]++; nTot++; }
      }
      if (!v.user){ v.a = -0.15 + 0.18 * Math.sin(t * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    function wave(g, A, B, lamPx, col, amp, alpha){
      var dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy); if (L < 2) return; var ux = dx / L, uy = dy / L;
      g.save(); g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = 2; g.beginPath();
      for (var s = 0; s <= L; s += 1.5){ var env = Math.sin(PI * s / L), w = Math.sin(s / lamPx * TAU) * amp * env; var X = A.x + ux * s - uy * w, Y = A.y + uy * s + ux * w; if (s) g.lineTo(X, Y); else g.moveTo(X, Y); }
      g.stroke(); g.restore();
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, l = lS.value, th = thS.value, K = cpKin(l, th), i;
      wlab(ctx, W, H, "#1c2638", "#0a0e17");
      v.sc = Math.min(W / (phone ? 9.6 : 10.0), H / 5.8); v.cx = W * (phone ? 0.55 : 0.52); v.cy = H * 0.5;
      /* table et plateau gradué (dessinés d'abord : sous tout le reste) */
      v.clear();
      v.box(-4.6, -0.95, -3.3, 3.4, -0.8, 3.3, "#6b4a2e", {cols:[null, null, null, "#8a6240"]});
      v.render(ctx); v.clear();
      v.cyl([0, -0.8, 0], [0, -0.62, 0], 3.0, 48, "#8d97a8", {cap1:"#b9c2cf"});
      v.render(ctx); v.clear();
      /* graduations tous les 10° sur le bord du plateau */
      ctx.save(); ctx.strokeStyle = "rgba(30,40,55,.8)"; ctx.lineWidth = 1;
      for (i = 0; i <= 36; i++){ var a = i * 10 * PI / 180, r0 = i % 9 === 0 ? 2.55 : 2.75, P0 = v.p(r0 * Math.cos(a), -0.62, r0 * Math.sin(a)), P1 = v.p(2.95 * Math.cos(a), -0.62, 2.95 * Math.sin(a)); ctx.beginPath(); ctx.moveTo(P0.x, P0.y); ctx.lineTo(P1.x, P1.y); ctx.stroke(); }
      /* arc de l'angle θ */
      ctx.strokeStyle = "#ffd34d"; ctx.lineWidth = 2.2; ctx.beginPath();
      for (i = 0; i <= 40; i++){ var aa = th * PI / 180 * i / 40, P = v.p(1.1 * Math.cos(aa), -0.6, 1.1 * Math.sin(aa)); if (i) ctx.lineTo(P.x, P.y); else ctx.moveTo(P.x, P.y); }
      ctx.stroke(); ctx.restore();
      [0, 90].forEach(function(a){ var P = v.p(3.25 * Math.cos(a * PI / 180), -0.62, 3.25 * Math.sin(a * PI / 180)); wT(S, c, a + "°", P.x, P.y, {size:wfz(c, 10.5), color:"#dfe6f2", weight:700, halo:"rgba(0,0,0,.5)"}); });
      /* tube à rayons X et collimateur (axe x) */
      v.cyl([-4.5, 0, 0], [-3.2, 0, 0], 0.5, 18, "#9aa5b8", {cap0:"#5c6678", cap1:"#3a4252"});
      v.cyl([-3.2, 0, 0], [-1.9, 0, 0], 0.16, 12, "#4a5568", {cap1:"#0b0f16"});
      v.box(-4.1, -0.8, -0.3, -3.6, -0.5, 0.3, "#3a4252");
      v.box(-2.7, -0.62, -0.12, -2.5, -0.16, 0.12, "#3a4252");
      /* cible de graphite sur son support */
      v.box(-0.18, -0.62, -0.1, 0.18, -0.35, 0.1, "#59657a");
      v.box(-0.22, -0.35, -0.22, 0.22, 0.35, 0.22, "#2a2d33", {line:"#4a4f58"});
      /* bras et détecteur à l'angle θ (vers −z) */
      var dp = detPos(th, 0), t = th * PI / 180, u = [Math.cos(t), 0, Math.sin(t)];
      var armA = [0.3 * u[0], -0.58, 0.3 * u[2]], armB = [dp[0], -0.58, dp[2]];
      v.cyl(armA, armB, 0.07, 8, "#c9d0dc");
      v.box(dp[0] - 0.12, -0.6, dp[2] - 0.12, dp[0] + 0.12, -0.25, dp[2] + 0.12, "#4a5568");
      var d0 = [dp[0] - 0.25 * u[0], 0, dp[2] - 0.25 * u[2]], d1 = [dp[0] + 0.55 * u[0], 0, dp[2] + 0.55 * u[2]];
      v.cyl(d0, d1, 0.3, 16, dragD ? "#ffbf3c" : "#d9a23b", {cap0:"#1b1f27", cap1:"#7a5a20"});
      /* événements : photon incident → cible → photon diffusé (vers le détecteur) + électron */
      var lamv = function(lpm){ return 0.11 + 0.38 * Math.sqrt(lpm / 100); };   /* longueur d'onde dessinée (unités de scène), croissante avec λ */
      ev.forEach(function(e){
        var s = e.s;
        if (s < 0.45){
          var q = s / 0.45, xh = -1.9 + 1.9 * q;
          v.sprite(xh, 0, 0, function(g){ var A = v.p(Math.max(-1.9, xh - 0.9), 0, 0), B = v.p(xh, 0, 0); wave(g, A, B, lamv(l) * v.sc, "#c9b3ff", 5, 0.95); wglow(g, B.x, B.y, 8, "#c9b3ff", 0.6); }, 0.2);
        } else {
          var q2 = (s - 0.45) / 0.55, L2 = e.shifted ? K.l2 : l, rr = 0.25 + q2 * (RD - 0.5);
          var hx = rr * u[0], hz = rr * u[2];
          v.sprite(hx, 0, hz, function(g){ var A = v.p(Math.max(0.25, rr - 0.9) * u[0], 0, Math.max(0.25, rr - 0.9) * u[2]), B = v.p(hx, 0, hz); wave(g, A, B, lamv(L2) * v.sc, e.shifted ? "#ff9fd0" : "#c9b3ff", 5, 0.95 * (1 - Math.max(0, q2 - 0.85) / 0.15)); }, 0.2);
          if (e.shifted){
            /* électron éjecté (de l'autre côté), vitesse croissante avec son énergie */
            var re = 0.25 + q2 * (0.8 + 2.2 * Math.min(1, K.pe / K.p)), ex = re * Math.cos(K.phi), ez = -re * Math.sin(K.phi);
            v.sprite(ex, 0, ez, function(g, pq){ var A = v.p(0.25 * Math.cos(K.phi), 0, -0.25 * Math.sin(K.phi)); g.save(); g.strokeStyle = "rgba(90,209,255,.45)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(pq.x, pq.y); g.stroke(); g.restore(); wglow(g, pq.x, pq.y, 12 * pq.s, "#5ad1ff", 0.8); wball(g, pq.x, pq.y, 4 * pq.s, "#5ad1ff"); }, 0.2);
          }
          if (q2 < 0.15){ v.sprite(0, 0, 0, function(g, pq){ wglow(g, pq.x, pq.y, 30 * (1 - q2 / 0.15), "#ffffff", 0.8); }, 0.6); }
        }
      });
      v.render(ctx);
      /* repère 180° : devant le tube (sinon le tube le cache) */
      var P180 = v.p(-3.25, -0.62, 0.75), f180 = wfz(c, 10.5), w180 = wmeas(ctx, "180°", f180, 700);
      wT(S, c, "180°", P180.x, P180.y, {size:f180, color:"#dfe6f2", weight:700, halo:"rgba(0,0,0,.5)"});
      /* étiquettes (sans chevauchement) */
      var placed = [{x:P180.x - w180 / 2 - 2, y:P180.y - f180 * 0.7, w:w180 + 4, h:f180 * 1.4}];
      if (triT.value) placed.push({x:phone ? W - 104 : W - 150, y:10, w:phone ? 96 : 140, h:phone ? 92 : 118});
      var pt = v.p(-3.85, 0.62, 0), pc = v.p(0, 0.7, 0), pd = v.p(dp[0] * 1.08, 0.75, dp[2] * 1.08), pa = v.p(1.45 * Math.cos(t / 2), -0.6, 1.45 * Math.sin(t / 2));
      wtagA(S, c, "θ = " + th + "°", pa.x, pa.y, {size:12, color:"#ffd34d"}, placed);
      wtagA(S, c, "détecteur" + (phone ? "" : " · attrape-moi"), pd.x, pd.y, {size:10.5, color:"#ffd34d", border:"rgba(255,211,77,.6)"}, placed);
      wtagA(S, c, "cible (graphite)", pc.x, pc.y, {size:10.5}, placed);
      wtagA(S, c, "tube à rayons X", pt.x, pt.y, {size:10.5}, placed);
      var pe = v.p(1.9 * Math.cos(K.phi), 0.3, -1.9 * Math.sin(K.phi));
      if (th > 0) wtagA(S, c, "e⁻ (φ = " + wN(K.phi * 180 / PI, 0) + "°)", pe.x, pe.y, {size:10.5, color:"#9fe6ff"}, placed);
      /* triangle des impulsions : p = p′ + pₑ */
      if (triT.value){
        var bx = phone ? W - 104 : W - 150, by = 10, bw = phone ? 96 : 140, bh = phone ? 92 : 118;
        ctx.save(); ctx.fillStyle = "rgba(8,14,28,.78)"; wrr(ctx, bx, by, bw, bh, 8); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.stroke(); ctx.restore();
        wT(S, c, "p = p′ + pₑ", bx + bw / 2, by + 11, {size:wfz(c, 10.5), color:"#fff"});
        /* p horizontal ; p′ à l'angle θ ; triangle ajusté et centré dans l'encart */
        var tp = [[0, 0], [K.p, 0], [K.p2 * Math.cos(t), -K.p2 * Math.sin(t)]];
        var mnx = Math.min(tp[0][0], tp[1][0], tp[2][0]), mxx = Math.max(tp[0][0], tp[1][0], tp[2][0]), mny = Math.min(tp[0][1], tp[1][1], tp[2][1]), mxy = Math.max(tp[0][1], tp[1][1], tp[2][1]);
        var sc = Math.min((bw - 30) / Math.max(1e-9, mxx - mnx), (bh - 44) / Math.max(1e-9, mxy - mny));
        var ox = bx + bw / 2 - (mnx + mxx) / 2 * sc, oy = by + 24 + (bh - 44) / 2 - (mny + mxy) / 2 * sc + 4;
        var A = {x:ox, y:oy}, Bp = {x:ox + tp[1][0] * sc, y:oy}, Cp = {x:ox + tp[2][0] * sc, y:oy + tp[2][1] * sc};
        warrow(ctx, A.x, A.y, Bp.x, Bp.y, "#c9b3ff", 2.2);
        warrow(ctx, A.x, A.y, Cp.x, Cp.y, "#ff9fd0", 2.2);
        warrow(ctx, Cp.x, Cp.y, Bp.x, Bp.y, "#5ad1ff", 2.2);
        var fzz = wfz(c, 10.5);
        wT(S, c, "p", (A.x + Bp.x) / 2, A.y + 10 * (th > 0 ? 1 : 1), {size:fzz, color:"#c9b3ff"});
        wT(S, c, "p′", (A.x + Cp.x) / 2 - 8, (A.y + Cp.y) / 2 - 2, {size:fzz, color:"#ff9fd0"});
        wT(S, c, "pₑ", (Cp.x + Bp.x) / 2 + 9, (Cp.y + Bp.y) / 2, {size:fzz, color:"#5ad1ff"});
      }
      wT(S, c, phone ? "glisse pour tourner la vue" : "glisse ailleurs pour tourner la vue", 10, H - 12, {size:wfz(c, 10.5), color:"rgba(210,222,240,.75)", align:"left", weight:600});

      /* ---- spectre mesuré et Δλ(θ) ---- */
      var g = f.ctx, FW = f.W, FH = f.H, R = rng();
      g.fillStyle = "#f6f8fb"; g.fillRect(0, 0, FW, FH);
      var sx0 = 40, sy0 = 26, sw = phone ? FW - sx0 - 12 : FW * 0.62 - sx0, sh = (phone ? FH * 0.56 : FH) - sy0 - 34;
      wT(S, f, "Spectre au détecteur (θ = " + th + "°)", 8, 12, {size:wfz(f, 12), color:"#13233a", align:"left"});
      wT(S, f, nTot + " photons", sx0 + sw, 12, {size:wfz(f, 11), color:"#2f6fd6", align:"right"});
      var mx = 1; for (i = 0; i < NB; i++) mx = Math.max(mx, hist[i]);
      g.fillStyle = "#fff"; g.fillRect(sx0, sy0, sw, sh);
      var stp = wstep(R[1] - R[0], phone ? 4 : 5);
      g.strokeStyle = "#e3e7ed"; g.lineWidth = 1;
      for (var xv = Math.ceil(R[0] / stp) * stp; xv <= R[1] + 1e-9; xv += stp){ var X = sx0 + (xv - R[0]) / (R[1] - R[0]) * sw; g.beginPath(); g.moveTo(X + 0.5, sy0); g.lineTo(X + 0.5, sy0 + sh); g.stroke(); wT(S, f, wN(xv, stp < 1 ? 1 : 0), X, sy0 + sh + 10, {size:wfz(f, 10), color:"#5f6b7a", weight:600}); }
      wT(S, f, "λ (pm)", sx0 + sw, sy0 + sh + 24, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right"});
      var bw2 = sw / NB;
      for (i = 0; i < NB; i++){ var hb = hist[i] / mx * (sh - 18); if (hb <= 0) continue; var gr = g.createLinearGradient(0, sy0 + sh - hb, 0, sy0 + sh); gr.addColorStop(0, "#9a7ce8"); gr.addColorStop(1, "#5a3eb0"); g.fillStyle = gr; g.fillRect(sx0 + i * bw2 + 0.5, sy0 + sh - hb, Math.max(1, bw2 - 1), hb); }
      /* repères λ et λ′ */
      [[l, "λ", "#5f6b7a"], [K.l2, "λ′", "#c0327a"]].forEach(function(m, j){
        var X = sx0 + (m[0] - R[0]) / (R[1] - R[0]) * sw;
        g.save(); g.setLineDash([3, 3]); g.strokeStyle = m[2]; g.lineWidth = 1.3; g.beginPath(); g.moveTo(X, sy0 + 4); g.lineTo(X, sy0 + sh); g.stroke(); g.restore();
        var close = Math.abs(K.d) / (R[1] - R[0]) * sw < 26;
        wT(S, f, m[1], X + (close ? (j ? 9 : -9) : 0), sy0 + 10, {size:wfz(f, 11.5), color:m[2], weight:800, halo:"#fff"});
      });
      g.strokeStyle = "#a3adba"; g.strokeRect(sx0 + 0.5, sy0 + 0.5, sw, sh);
      if (!phone || true){
        /* Δλ(θ) */
        var dx0, dy0, dw, dh;
        if (phone){ dx0 = 40; dy0 = sy0 + sh + 46; dw = FW - dx0 - 12; dh = FH - dy0 - 26; }
        else { dx0 = FW * 0.62 + 42; dy0 = 26; dw = FW - dx0 - 12; dh = FH - dy0 - 34; }
        wT(S, f, "Δλ (pm)", dx0, dy0 - 12, {size:wfz(f, 11), color:"#13233a", align:"left"});
        g.fillStyle = "#fff"; g.fillRect(dx0, dy0, dw, dh);
        function DX(a){ return dx0 + a / 180 * dw; } function DY(d){ return dy0 + dh - d / 5.2 * dh; }
        g.strokeStyle = "#e3e7ed"; for (i = 0; i <= 180; i += 45){ g.beginPath(); g.moveTo(DX(i) + 0.5, dy0); g.lineTo(DX(i) + 0.5, dy0 + dh); g.stroke(); wT(S, f, i + "°", DX(i), dy0 + dh + 10, {size:wfz(f, 10), color:"#5f6b7a", weight:600}); }
        [0, 2.43, 4.85].forEach(function(d){ g.beginPath(); g.moveTo(dx0, DY(d) + 0.5); g.lineTo(dx0 + dw, DY(d) + 0.5); g.stroke(); wT(S, f, wN(d, d ? 2 : 0), dx0 - 4, DY(d), {size:wfz(f, 10), color:"#5f6b7a", align:"right", weight:600}); });
        g.beginPath(); for (i = 0; i <= 90; i++){ var a2 = i * 2, d2 = CP_LC * (1 - Math.cos(a2 * PI / 180)); if (i) g.lineTo(DX(a2), DY(d2)); else g.moveTo(DX(a2), DY(d2)); } g.strokeStyle = "#c0327a"; g.lineWidth = 2.2; g.stroke();
        g.strokeStyle = "#a3adba"; g.lineWidth = 1; g.strokeRect(dx0 + 0.5, dy0 + 0.5, dw, dh);
        S.draw.dot(f, DX(th), DY(K.d), 5, "#c0327a");
        wT(S, f, "θ", dx0 + dw, dy0 + dh + 22, {size:wfz(f, 10.5), color:"#5f6b7a", align:"right"});
      }

      /* ---- afficheurs ---- */
      ro.set(0, wN(l, 1) + " pm");
      ro.set(1, wN(K.l2, 2) + " pm");
      ro.set(2, wN(K.d, 3) + " pm");
      ro.set(3, wN(K.E, 1) + " → " + wN(K.E2, 1) + " keV");
      ro.set(4, wN(K.T, K.T < 10 ? 2 : 1) + " keV");
      ro.set(5, th === 0 ? "—" : wN(K.phi * 180 / PI, 1) + "°");
      nt.set("h/mₑc = " + wN(CP_LC, 3) + " pm. À θ = " + th + "°, Δλ/λ = " + wN(K.d / l * 100, 1) + " % : " + (K.d / l < 0.05 ? "un petit écart, mesuré par Compton en 1923 avec λ ≈ 71 pm." : "un écart bien visible, car λ est courte.") +
        " Le pic non décalé vient des électrons très liés : c'est alors l'atome entier qui recule. Hauteurs des pics indicatives.", "ok");
    });
  }
});

})();
