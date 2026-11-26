/* Physique quantique · lot Q8 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-detente-microetats · pq-contact-thermique (pq13) · pq-boltzmann-niveaux (pq14)
   pq-cv-diatomique · pq-gaz-boite-niveaux (pq15)
   Aucune ressource externe : la 3D est une projection faite main (faces triées par profondeur). */
(function(){
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
  if (e >= -2 && e <= 3) return zN(x, Math.max(0, d - e)).replace(/^(−?)(\d+)/, function(m0, sg, ip){ return sg + ip.replace(/\B(?=(\d{3})+(?!\d))/g, " "); });
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


/* ---------- aides propres au lot Q8 (physique statistique) ---------- */
/* renomme les cases d'afficheurs */
function zrelabel(k, labs){
  var cells = k.ctrl.querySelectorAll(".read .ro small");
  labs.forEach(function(l, i){ if (cells[i] && cells[i].textContent !== l) cells[i].textContent = l; });
}
/* ln Γ(x) (Lanczos, x > 0) */
var ZLG = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function zlgam(x){
  if (x < 0.5) return Math.log(PI / Math.abs(Math.sin(PI * x))) - zlgam(1 - x);
  x -= 1; var a = 0.99999999999980993, t = x + 7.5;
  for (var i = 0; i < 8; i++) a += ZLG[i] / (x + i + 1);
  return 0.5 * Math.log(TAU) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
/* ln C(n, p) ; −∞ hors bornes */
function zlnC(n, p){ if (p < 0 || p > n) return -Infinity; if (p === 0 || p === n) return 0; return zlgam(n + 1) - zlgam(p + 1) - zlgam(n - p + 1); }
/* entier exact (jusqu'à 10¹⁵) ou m·10ᵉ à partir de son logarithme décimal */
function zbig(lg, d){
  if (!isFinite(lg)) return "0";
  if (lg < 6.999){ var v = Math.round(Math.pow(10, lg)); return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  var e = Math.floor(lg), m = Math.pow(10, lg - e);
  if (+m.toFixed(d) >= 10){ m /= 10; e += 1; }
  return zN(m, d == null ? 2 : d).replace(/(,\d*?)0+$/, "$1").replace(/,$/, "") + "·10" + String(e).split("").map(function(ch){ return SUPD[ch]; }).join("");
}
/* panneau blanc arrondi avec titre */
function zpanel(S, c, x, y, w, h, title, o){
  o = o || {}; var g = c.ctx;
  g.save(); zrr(g, x, y, w, h, 10); g.fillStyle = o.fill || "#fff"; g.fill(); g.strokeStyle = o.stroke || "#dde3ec"; g.lineWidth = 1; g.stroke(); g.restore();
  if (title) zT(S, c, title, x + 10, y + 13, {size:zfz(c, 12), color:o.tcol || "#13233a", align:"left", weight:800});
}
/* tirage d'un indice selon des poids positifs */
function zpick(w, sum){
  var r = Math.random() * sum;
  for (var i = 0; i < w.length; i++){ r -= w[i]; if (r <= 0) return i; }
  return w.length - 1;
}
/* gaussienne (Box-Muller) */
function zgauss(){ var u = Math.random() || 1e-12, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
/* sphère ombrée posée dans une scène Z3 (rayon en unités de scène) */
function zsphere(v, c, r, col, o){
  v.sprite(c[0], c[1], c[2], function(ctx, q){ zball(ctx, q.x, q.y, r * v.sc * q.s, col, o && o.alpha); });
}
/* trace une polyligne (x, y en pixels) */
function zpoly(g, P, col, w, dash){
  if (P.length < 2) return;
  g.save(); g.strokeStyle = col; g.lineWidth = w || 2; g.lineJoin = "round"; g.lineCap = "round"; if (dash) g.setLineDash(dash);
  g.beginPath(); P.forEach(function(p, i){ if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); g.restore();
}
/* nombre à d décimales fixes, virgule */
function zF(x, d){ if (!isFinite(x)) return "—"; var s = Number(x).toFixed(d); if (/^-0[.,]?0*$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); }
/* =====================================================================
   1. Détente de Joule : compter les micro-états (pq13)
   ===================================================================== */
var DM_NS = [4, 10, 40, 200, 1000];
var DM_R = 1, DM_CX = 1.75, DM_RT = 0.5, DM_XT = 1.2;   /* ballons de rayon 1 centrés en x = ±1,75 ; tube de rayon 0,45 */
function dmInside(x, y, z, open){
  var dl = (x + DM_CX) * (x + DM_CX) + y * y + z * z, dr = (x - DM_CX) * (x - DM_CX) + y * y + z * z;
  if (dl < DM_R * DM_R || dr < DM_R * DM_R) return true;
  return Math.abs(x) < DM_XT && y * y + z * z < DM_RT * DM_RT;
}
/* boîte orientée (pour la poignée du robinet) : centre, demi-axes u, v, w */
function dmOBox(v, c, u, w, h, col){
  var P = [], s = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  s.forEach(function(q){ P.push([c[0] + q[0] * u[0] + q[1] * h[0] + q[2] * w[0], c[1] + q[0] * u[1] + q[1] * h[1] + q[2] * w[1], c[2] + q[0] * u[2] + q[1] * h[2] + q[2] * w[2]]); });
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f){
    v.face(f.map(function(j){ return P[j]; }), col, {c:c, cull:true});
  });
}

SFA.sim({
  id:"pq-detente-microetats", ch:"pq13", tag:"Micro-états",
  titre:"Détente d'un gaz : compter les micro-états",
  resume:"Deux ballons de verre reliés par un robinet : on l'ouvre, le gaz envahit le vide, et l'on compte les façons de répartir les particules.",
  but:"Le robinet s'ouvre tout seul : regarde le compteur A/B osciller autour de N/2 et l'histogramme des visites coller à Ω(n). Change N de 4 à 1 000 : les fluctuations s'écrasent. Clique sur le robinet pour le fermer ou le rouvrir, glisse sur la scène pour tourner.",
  aRetenir:"Tous les micro-états sont équiprobables : le macro-état observé est celui qui en compte le plus, Ω(N/2), et S = k_B ln Ω y est maximale.",
  piege:"Le retour de toutes les particules dans A n'est pas interdit : il a une chance sur 2ᴺ, soit jamais pour une mole.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 360), f = k.canvas(phone ? 500 : 300);
    var N = 40, P = [], reached = false, open = false, ang = 0, autoT = 1.4, tRun = 0, hist = [], visits = [], tOpen = 0, acc = 0;
    var nS = k.seg("Nombre de particules N", DM_NS.map(function(n){ return [n, String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")]; }), 40, function(val){ N = +val; reset(); });
    var bO = k.button("Ouvrir / fermer le robinet", function(){ setOpen(!open); }, true);
    k.button("Tout remettre dans A", function(){ reset(); });
    var ro = k.readouts(["Dans A : n / N", "Ω(n) = C(N, n)", "S − S₀ = k_B ln Ω", "Tous dans A : 1 chance sur"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.32; v.b = 0.36; v.f = 16; v.set();
    var VAL = null;
    zorbit(c, v, k, [0.0, 1.2, -0.9, 0.3], function(type, p){
      if (VAL &&Math.hypot(p.x - VAL.x, p.y - VAL.y) < VAL.r){ setOpen(!open); k.redraw(); return false; }
    });
    c.pointer(function(type, p){ if (type === "move" && VAL) c.cv.style.cursor = Math.hypot(p.x - VAL.x, p.y - VAL.y) < VAL.r ? "pointer" : "grab"; });
    function setOpen(o){ open = o; autoT = -1; if (o){ tOpen = 0; visits = []; reached = false; } }
    function spawn(i){
      /* point au hasard dans le ballon A, vitesse de direction isotrope */
      var x, y, z;
      do { x = 2 * Math.random() - 1; y = 2 * Math.random() - 1; z = 2 * Math.random() - 1; } while (x * x + y * y + z * z > 0.9);
      var sp = 2.8 * (0.75 + 0.5 * Math.random()), u = 2 * Math.random() - 1, th = TAU * Math.random(), s2 = Math.sqrt(1 - u * u);
      return {x:x * DM_R - DM_CX, y:y * DM_R, z:z * DM_R, vx:sp * s2 * Math.cos(th), vy:sp * u, vz:sp * s2 * Math.sin(th), i:i};
    }
    function reset(){ P = []; for (var i = 0; i < N; i++) P.push(spawn(i)); open = false; autoT = 1.4; hist = []; visits = []; tOpen = 0; reached = false; }
    reset();
    function step(dt){
      for (var i = 0; i < P.length; i++){
        var p = P[i], nx = p.x + p.vx * dt, ny = p.y + p.vy * dt, nz = p.z + p.vz * dt;
        var cross = !open && ((p.x < 0) !== (nx < 0)) && Math.abs(nx) < DM_XT;
        if (!cross && dmInside(nx, ny, nz, open)){ p.x = nx; p.y = ny; p.z = nz; continue; }
        if (cross){ p.vx = -p.vx; continue; }
        var inT = Math.abs(p.x) < DM_XT && p.y * p.y + p.z * p.z < DM_RT * DM_RT;
        var cx = nx < 0 ? -DM_CX : DM_CX, dx = nx - cx, dl = Math.sqrt(dx * dx + ny * ny + nz * nz);
        if (inT && dl > DM_R){
          /* paroi du tube : on renverse la composante radiale */
          var rr = Math.sqrt(ny * ny + nz * nz) || 1, ey = ny / rr, ez = nz / rr, vr = p.vy * ey + p.vz * ez;
          if (vr > 0){ p.vy -= 2 * vr * ey; p.vz -= 2 * vr * ez; } else p.vx = -p.vx;
        } else {
          var ex = dx / dl, ey2 = ny / dl, ez2 = nz / dl, vn = p.vx * ex + p.vy * ey2 + p.vz * ez2;
          if (vn > 0){ p.vx -= 2 * vn * ex; p.vy -= 2 * vn * ey2; p.vz -= 2 * vn * ez2; } else { p.vx = -p.vx; p.vy = -p.vy; p.vz = -p.vz; }
          /* verre rugueux : une réflexion sur deux part dans une direction au hasard (sinon les trajectoires restent dans un plan) */
          if (Math.random() < 0.5){
            var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz), u = 2 * Math.random() - 1, ph = TAU * Math.random(), s2 = Math.sqrt(1 - u * u);
            var dx2 = s2 * Math.cos(ph), dy2 = u, dz2 = s2 * Math.sin(ph);
            if (dx2 * ex + dy2 * ey2 + dz2 * ez2 > 0){ dx2 = -dx2; dy2 = -dy2; dz2 = -dz2; }
            p.vx = sp * dx2; p.vy = sp * dy2; p.vz = sp * dz2;
          }
        }
        if (!dmInside(p.x, p.y, p.z, open)){ var q = spawn(i); if (p.x > 0) q.x += 2 * DM_CX; P[i] = q; }
      }
    }
    function nLeft(){ var n = 0; for (var i = 0; i < P.length; i++) if (P[i].x < 0) n++; return n; }
    var lp = k.loop(function(dt, t){
      tRun += dt;
      if (autoT > 0){ autoT -= dt; if (autoT <= 0){ open = true; autoT = -1; tOpen = 0; visits = []; reached = false; } }
      ang += ((open ? 1 : 0) - ang) * Math.min(1, dt * 6);
      step(dt / 2); step(dt / 2);
      var n = nLeft();
      acc += dt;
      if (acc >= 0.1){ acc -= 0.1; hist.push(n / N); if (hist.length > 300) hist.shift(); }
      if (open){ tOpen += dt; if (!reached && Math.abs(n - N / 2) <= Math.max(1, Math.sqrt(N) / 2)) reached = true; if (reached) visits[n] = (visits[n] || 0) + dt; }
      if (!v.user){ v.a = -0.32 + 0.16 * Math.sin(t * 0.21); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, n = nLeft();
      /* ================= scène : ballons de Joule ================= */
      zlab(ctx, W, H, "#1f2a42", "#0a0f1a");
      v.sc = Math.min(W / (phone ? 6.0 : 6.6), H / 3.7); v.cx = W * 0.5; v.cy = H * 0.5; v.clear();
      v.box(-3.3, -2.05, -1.5, 3.3, -1.9, 1.5, "#7a5232", {cols:[null, null, null, "#9c6b40"]});
      v.render(ctx); v.clear();
      [-1, 1].forEach(function(sg){
        v.cyl([sg * DM_CX, -1.9, 0], [sg * DM_CX, -1.82, 0], 0.62, 20, "#3a4352");
        v.cyl([sg * DM_CX, -1.82, 0], [sg * DM_CX, -0.98, 0], 0.07, 10, "#8d97a6");
        v.cyl([sg * DM_CX, -1.05, 0], [sg * DM_CX, -0.9, 0], 0.32, 16, "#6b7585", {r1:0.42});
      });
      v.render(ctx);
      /* verre : fond des ballons et du tube */
      var pL = v.p(-DM_CX, 0, 0), pR = v.p(DM_CX, 0, 0), ta = v.p(-DM_XT, 0, 0), tb = v.p(DM_XT, 0, 0);
      function glassBack(q){
        var r = DM_R * v.sc * q.s, g = ctx.createRadialGradient(q.x, q.y, r * 0.2, q.x, q.y, r);
        g.addColorStop(0, "rgba(170,205,240,0.05)"); g.addColorStop(0.85, "rgba(170,205,240,0.12)"); g.addColorStop(1, "rgba(200,225,250,0.30)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, TAU); ctx.fill();
      }
      ctx.save(); ctx.lineCap = "butt"; ctx.strokeStyle = "rgba(190,215,245,0.16)"; ctx.lineWidth = 2 * DM_RT * v.sc * (ta.s + tb.s) / 2;
      ctx.beginPath(); ctx.moveTo(ta.x, ta.y); ctx.lineTo(tb.x, tb.y); ctx.stroke(); ctx.restore();
      glassBack(pL); glassBack(pR);
      /* particules, de la plus lointaine à la plus proche */
      var rP = N <= 4 ? 0.14 : N <= 10 ? 0.11 : N <= 40 ? 0.08 : N <= 200 ? 0.055 : 0.034;
      var Q = P.map(function(p){ var q = v.p(p.x, p.y, p.z); q.L = p.x < 0; return q; });
      Q.sort(function(a, b){ return a.z - b.z; });
      var CA = "#4ea4ff", CB = "#ff9a3c";
      Q.forEach(function(q){
        var r = rP * v.sc * q.s;
        if (N <= 200) zball(ctx, q.x, q.y, r, q.L ? CA : CB);
        else { ctx.fillStyle = q.L ? "#3d8fe6" : "#ec8a2f"; ctx.beginPath(); ctx.arc(q.x, q.y, Math.max(1.2, r), 0, TAU); ctx.fill(); }
      });
      /* verre : reflets */
      function glassFront(q){
        var r = DM_R * v.sc * q.s;
        ctx.save(); ctx.strokeStyle = "rgba(215,235,255,0.55)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, TAU); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = Math.max(2, r * 0.07); ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(q.x, q.y, r * 0.8, -2.6, -1.9); ctx.stroke();
        ctx.lineWidth = Math.max(1, r * 0.03); ctx.beginPath(); ctx.arc(q.x, q.y, r * 0.8, -1.75, -1.55); ctx.stroke();
        ctx.restore();
      }
      glassFront(pL); glassFront(pR);
      ctx.save(); ctx.strokeStyle = "rgba(215,235,255,0.35)"; ctx.lineWidth = 1;
      [-1, 1].forEach(function(s){ var a = v.p(-DM_XT * 0.6, s * DM_RT, 0), b = v.p(DM_XT * 0.6, s * DM_RT, 0); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
      ctx.restore();
      /* robinet en laiton (au premier plan) */
      v.clear();
      v.cyl([-0.32, 0, 0], [0.32, 0, 0], 0.56, 20, "#b58a3a", {cap0:"#9c7530", cap1:"#d0a650"});
      v.cyl([0, 0.5, 0], [0, 0.82, 0], 0.13, 12, "#c9a04c");
      var th = ang * PI / 2, ux = [Math.sin(th) * 0.62, 0, Math.cos(th) * 0.62];
      dmOBox(v, [0, 0.9, 0], ux, [-Math.cos(th) * 0.1, 0, Math.sin(th) * 0.1], [0, 0.07, 0], open ? "#2fa36b" : "#c2453d");
      v.render(ctx);
      var vq = v.p(0, 0.9, 0); VAL = {x:vq.x, y:vq.y, r:Math.max(26, 0.75 * v.sc)};
      /* étiquettes */
      var la = v.p(-DM_CX, DM_R + 0.25, 0), lb = v.p(DM_CX, DM_R + 0.25, 0);
      ztag(S, c, "ballon A · " + n, la.x, la.y - 6, {size:11.5, color:"#9fd0ff"});
      ztag(S, c, "ballon B · " + (N - n), lb.x, lb.y - 6, {size:11.5, color:"#ffc28a"});
      var lv = v.p(0, -0.85, 0);
      ztag(S, c, open ? "robinet ouvert" : autoT > 0 ? "robinet fermé : il va s'ouvrir" : "robinet fermé (clique-le)", lv.x, Math.min(H - 16, lv.y + 18), {size:11, color:open ? "#8ff0b8" : "#ffb0a8"});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});

      /* ================= graphes ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var gx0 = 6, gy0 = 6, gw, gh, hx0, hy0, hw, hh, mx0, my0, mw, mh;
      if (phone){ gw = FW - 12; gh = 150; hx0 = 6; hy0 = gy0 + gh + 6; hw = gw; hh = 168; mx0 = 6; my0 = hy0 + hh + 6; mw = gw; mh = FH - my0 - 6; }
      else { gw = (FW - 18) * 0.5; gh = 186; hx0 = gx0 + gw + 6; hy0 = 6; hw = FW - hx0 - 6; hh = gh; mx0 = 6; my0 = gy0 + gh + 6; mw = FW - 12; mh = FH - my0 - 6; }
      var sig = 1 / (2 * Math.sqrt(N));
      /* --- n/N au cours du temps --- */
      zpanel(S, f, gx0, gy0, gw, gh, "Part dans A au fil du temps");
      var ax0 = gx0 + 34, ax1 = gx0 + gw - 10, ay0 = gy0 + 30, ay1 = gy0 + gh - 22;
      function Yf(fr){ return ay1 - fr * (ay1 - ay0); }
      g.save(); g.fillStyle = "rgba(78,164,255,0.13)"; g.fillRect(ax0, Yf(Math.min(1, 0.5 + 2 * sig)), ax1 - ax0, Yf(Math.max(0, 0.5 - 2 * sig)) - Yf(Math.min(1, 0.5 + 2 * sig))); g.restore();
      g.save(); g.strokeStyle = "#c9d2de"; g.lineWidth = 1;
      [0, 0.5, 1].forEach(function(fr){ g.beginPath(); g.moveTo(ax0, Yf(fr)); g.lineTo(ax1, Yf(fr)); g.stroke();
        zT(S, f, fr === 0.5 ? "N/2" : fr ? "N" : "0", ax0 - 5, Yf(fr), {size:zfz(f, 10), color:"#5f6b7a", align:"right", weight:700}); });
      g.restore();
      var pts = hist.map(function(fr, j){ return [ax1 - (hist.length - 1 - j) / 299 * (ax1 - ax0), Yf(fr)]; });
      zpoly(g, pts, "#2f6fd6", 1.8);
      if (pts.length) { g.fillStyle = "#2f6fd6"; g.beginPath(); g.arc(pts[pts.length - 1][0], pts[pts.length - 1][1], 3.5, 0, TAU); g.fill(); }
      zT(S, f, "30 s", ax0, ay1 + 12, {size:zfz(f, 9.5), color:"#7a8596", align:"left", weight:600});
      zT(S, f, "maintenant", ax1, ay1 + 12, {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:600});
      zT(S, f, "bande : N/2 ± 2σ", (ax0 + ax1) / 2, ay1 + 12, {size:zfz(f, 9.5), color:"#2f6fd6", weight:700});
      /* --- Ω(n) et visites --- */
      zpanel(S, f, hx0, hy0, hw, hh, "Ω(n) / 2ᴺ et temps passé");
      var bx0 = hx0 + 12, bx1 = hx0 + hw - 12, by0 = hy0 + 50, by1 = hy0 + hh - 24;
      var bw = Math.max(1, Math.round(N / 40)), nb = Math.floor(N / bw) + 1, th2 = [], ob = [], tmax = 0, vt = 0;
      for (i = 0; i <= N; i++) vt += visits[i] || 0;
      for (var b = 0; b < nb; b++){
        var s = 0, o = 0;
        for (var m = b * bw; m < Math.min(N + 1, (b + 1) * bw); m++){ s += Math.exp(zlnC(N, m) - N * Math.LN2); o += (visits[m] || 0); }
        th2.push(s); ob.push(vt > 0 ? o / vt : 0); tmax = Math.max(tmax, s);
      }
      function Xn(m){ return bx0 + (m + 0.5 * bw) / (N + bw) * (bx1 - bx0); }
      var bwp = Math.max(1, (bx1 - bx0) * bw / (N + bw) * 0.8);
      for (b = 0; b < nb; b++){
        var xc = Xn(Math.min(N, b * bw + (bw - 1) / 2)), hb = th2[b] / tmax * (by1 - by0);
        if (hb > 0.3){ var gr = g.createLinearGradient(0, by1 - hb, 0, by1); gr.addColorStop(0, "#9cc8ff"); gr.addColorStop(1, "#4e86d8"); g.fillStyle = gr; g.fillRect(xc - bwp / 2, by1 - hb, bwp, hb); }
      }
      if (vt > 0){
        g.save(); g.fillStyle = "#e0761f";
        for (b = 0; b < nb; b++){ if (ob[b] <= 0) continue; var xo = Xn(Math.min(N, b * bw + (bw - 1) / 2)), yo = by1 - Math.min(1, ob[b] / tmax) * (by1 - by0);
          g.beginPath(); g.arc(xo, yo, N <= 10 ? 4 : 2.6, 0, TAU); g.fill(); }
        g.restore();
      }
      g.save(); g.strokeStyle = "#b8c2d0"; g.beginPath(); g.moveTo(bx0, by1 + 1); g.lineTo(bx1, by1 + 1); g.stroke(); g.restore();
      [[0, "0"], [N / 2, "N/2"], [N, "N"]].forEach(function(q){ zT(S, f, q[1], Xn(q[0]), by1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:700}); });
      /* curseur : macro-état actuel */
      var xn = Xn(n);
      g.save(); g.strokeStyle = "#13233a"; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(xn, by0 - 6); g.lineTo(xn, by1); g.stroke(); g.restore();
      zT(S, f, "n = " + n, Math.max(bx0 + 22, Math.min(bx1 - 22, xn)), by0 - 10, {size:zfz(f, 10), color:"#13233a", weight:800, bg:"rgba(255,255,255,.92)"});
      zT(S, f, "■ Ω(n)/2ᴺ (théorie)", bx0, hy0 + 30, {size:zfz(f, 9.5), color:"#4e86d8", align:"left", weight:800});
      zT(S, f, "● temps passé", bx1, hy0 + 30, {size:zfz(f, 9.5), color:"#e0761f", align:"right", weight:800});
      /* --- le micro-état : une case par particule --- */
      zpanel(S, f, mx0, my0, mw, mh, phone ? "Micro-état : une case par particule" : "Le micro-état : une case par particule (bleu = A, orange = B)");
      var gx = mx0 + 10, gy = my0 + 26, gW = mw - 20, gH = mh - 32;
      var cols = Math.max(1, Math.min(N, Math.ceil(Math.sqrt(N * gW / Math.max(gH, 1))))), rows = Math.ceil(N / cols);
      var cw = gW / cols, chh = Math.min(gH / rows, cw * 1.4), cs = Math.min(cw, chh), gap = cs > 8 ? 2 : cs > 4 ? 1 : 0;
      var ox = gx + (gW - cols * cw) / 2, oy = gy + (gH - rows * chh) / 2;
      var side = []; P.forEach(function(p){ side[p.i] = p.x < 0; });
      for (i = 0; i < N; i++){
        var cx = ox + (i % cols) * cw, cy = oy + Math.floor(i / cols) * chh;
        g.fillStyle = side[i] ? "#4ea4ff" : "#ff9a3c"; g.fillRect(cx + gap / 2, cy + gap / 2, Math.max(0.6, cw - gap), Math.max(0.6, chh - gap));
        if (N <= 10){ zT(S, f, side[i] ? "A" : "B", cx + cw / 2, cy + chh / 2, {size:Math.min(16, chh * 0.5), color:"#fff", weight:800}); }
      }
      /* ---- afficheurs ---- */
      var lgO = zlnC(N, n);
      ro.set(0, n + " / " + N);
      ro.set(1, zbig(lgO / Math.LN10, 2));
      ro.set(2, zN(lgO, lgO < 100 ? 2 : 1) + " k_B");
      ro.set(3, "2" + String(N).split("").map(function(ch){ return SUPD[ch]; }).join("") + (N < 20 ? " = " : " ≈ ") + zbig(N * Math.log10(2), 1));
      var lmax = zlnC(N, Math.floor(N / 2));
      nt.set(!open && n === N ? "Robinet fermé : un seul macro-état possible, n = N, réalisé par un seul micro-état (Ω = 1). Il y a pourtant 2<sup>" + N + "</sup> micro-états dès que le robinet s'ouvre." :
        "Ω(N/2) = " + zbig(lmax / Math.LN10, 2) + " micro-états pour n = N/2, contre 1 seul pour « tous dans A ». Écart typique σ = √N/2 = " + zN(Math.sqrt(N) / 2, 1) + " particule" + (Math.sqrt(N) / 2 >= 2 ? "s" : "") + ", soit " + zN(100 * sig, 1) + " % de N.", "ok");
    });
  }
});
/* =====================================================================
   2. Deux solides d'Einstein en contact (pq13)
   ===================================================================== */
/* Ω(N, q) = C(q + N − 1, q) : façons de répartir q quanta sur N oscillateurs */
function ctLnO(N, q){ return q < 0 ? -Infinity : zlnC(q + N - 1, q); }
/* température d'un solide d'Einstein : ε/k_BT = d ln Ω/dq ≈ ln((q + N − ½)/(q + ½)) (différence centrée exacte) */
function ctT(N, q){ return q <= 0 ? 0 : 1 / Math.log((q + N - 0.5) / (q + 0.5)); }
function ctCol(x){
  /* 0 → bleu acier, 1 → orange, 2 → jaune pâle */
  var A = [77, 106, 150], B = [255, 138, 61], C = [255, 226, 140], t;
  if (x <= 1){ t = x; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]; }
  t = Math.min(1, x - 1); return [B[0] + (C[0] - B[0]) * t, B[1] + (C[1] - B[1]) * t, B[2] + (C[2] - B[2]) * t];
}

SFA.sim({
  id:"pq-contact-thermique", ch:"pq13", tag:"Température",
  titre:"Deux solides en contact : pourquoi les températures s'égalisent",
  resume:"Deux blocs d'atomes-oscillateurs (un oscillateur par atome dans ce modèle) se touchent et s'échangent au hasard des quanta d'énergie : le partage se fige au sommet de Ω_A·Ω_B.",
  but:"Le bloc A reçoit toute l'énergie au départ : regarde les quanta passer dans B et q_A se poser au sommet du pic. Change la taille des blocs et l'énergie totale, clique sur un bloc pour lui redonner toute l'énergie, glisse pour tourner.",
  aRetenir:"L'équilibre est le partage qui maximise Ω_A·Ω_B : les pentes de ln Ω y sont égales, et cette pente (par quantum ε), c'est ε/k_BT.",
  piege:"L'énergie ne s'égalise pas : c'est la température, et le bloc qui a le plus d'atomes garde le plus de quanta.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 350), f = k.canvas(phone ? 470 : 280);
    var aS = k.slider("Atomes par arête du bloc A", 2, 5, 1, 3, "", function(){ build(); });
    var bS = k.slider("Atomes par arête du bloc B", 2, 5, 1, 4, "", function(){ build(); });
    var qS = k.slider("Énergie totale q (en quanta ε = ħω)", 10, 300, 10, 120, "", function(){ build(); });
    k.button("Tout donner à A (A chaud)", function(){ give(0); }, true);
    k.button("Tout donner à B", function(){ give(1); });
    var ro = k.readouts(["q_A / q_B (quanta)", "q_A le plus probable", "k_BT_A / ε", "k_BT_B / ε"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.55; v.b = 0.42; v.f = 22; v.set();
    var AT = [], ED = [], NA = 0, NB = 0, Q = 120, beads = [], visits = [], hot = 0, HIT = [], reached = false, BEST = 0, HW = 1, tGive = 0, tEq = null;
    zorbit(c, v, k, [0.05, 1.2], function(type, p){
      for (var i = 0; i < HIT.length; i++) if (Math.hypot(p.x - HIT[i].x, p.y - HIT[i].y) < HIT[i].r){ give(i); k.redraw(); return false; }
    });
    c.pointer(function(type, p){ if (type === "move") c.cv.style.cursor = HIT.some(function(h){ return Math.hypot(p.x - h.x, p.y - h.y) < h.r; }) ? "pointer" : "grab"; });
    function build(){
      var la = aS.value, lb = bS.value, idx = {};
      AT = []; ED = [];
      function add(blk, L, x0){
        for (var ix = 0; ix < L; ix++) for (var iy = 0; iy < L; iy++) for (var iz = 0; iz < L; iz++){
          idx[blk + ":" + ix + ":" + iy + ":" + iz] = AT.length;
          AT.push({b:blk, ix:ix, iy:iy, iz:iz, x:x0 + ix, y:iy, z:iz - (L - 1) / 2, q:0, ph:[TAU * Math.random(), TAU * Math.random(), TAU * Math.random()], w:7 + 3 * Math.random()});
        }
      }
      add(0, la, -la + 0.5); add(1, lb, 0.5);
      NA = la * la * la; NB = lb * lb * lb;
      AT.forEach(function(a, i){
        [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function(d){
          var j = idx[a.b + ":" + (a.ix + d[0]) + ":" + (a.iy + d[1]) + ":" + (a.iz + d[2])];
          if (j != null) ED.push([i, j]);
        });
      });
      /* contact : face droite de A ↔ face gauche de B, même hauteur, profondeurs à moins d'une demi-maille */
      AT.forEach(function(a, i){
        if (a.b !== 0 || a.ix !== la - 1) return;
        AT.forEach(function(o, j){ if (o.b === 1 && o.ix === 0 && o.iy === a.iy && Math.abs(o.z - a.z) <= 0.5 + 1e-9) ED.push([i, j, 1]); });
      });
      Q = qS.value; give(hot);
    }
    function give(blk){
      hot = blk; beads = []; visits = []; reached = false; tGive = 0; tEq = null;
      var list = []; AT.forEach(function(a, i){ a.q = 0; if (a.b === blk) list.push(i); });
      for (var n = 0; n < Q; n++) AT[list[Math.floor(Math.random() * list.length)]].q++;
    }
    function qA(){ var s = 0; for (var i = 0; i < AT.length; i++) if (!AT[i].b) s += AT[i].q; return s; }
    build();
    var lp = k.loop(function(dt, t){
      tGive += dt;
      /* ~30 balayages des liaisons par seconde : une liaison tirée au hasard, un sens au hasard, un quantum passe si possible */
      var nst = Math.round(ED.length * 30 * dt);
      for (var s = 0; s < nst; s++){
        var e = ED[Math.floor(Math.random() * ED.length)], i = e[0], j = e[1];
        if (Math.random() < 0.5){ i = e[1]; j = e[0]; }
        if (AT[i].q > 0){
          AT[i].q--; AT[j].q++;
          if (beads.length < 40 && Math.random() < (e[2] ? 0.6 : 0.03)) beads.push({i:i, j:j, s:0});
        }
      }
      for (var b = beads.length - 1; b >= 0; b--){ beads[b].s += dt * 2.6; if (beads[b].s >= 1) beads.splice(b, 1); }
      var qa = qA(); if (!reached && Math.abs(qa - BEST) <= HW) reached = true; if (reached) visits[qa] = (visits[qa] || 0) + dt;
      if (!v.user){ v.a = -0.55 + 0.2 * Math.sin(t * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, t = performance.now() / 1000, la = aS.value, lb = bS.value;
      var qa = qA(), qb = Q - qa, mean = Q / (NA + NB);
      /* ================= scène 3D ================= */
      zlab(ctx, W, H, "#1e2738", "#0a0e18");
      var span = la + lb + 1.6;
      v.sc = Math.min(W / (span * (phone ? 1.0 : 1.12)), H / (Math.max(la, lb) * 1.45 + 1.4)); v.cx = W * 0.5; v.cy = H * 0.56; v.clear();
      var xc = (lb - la) / 2, yb = -0.42, zmax = Math.max(la, lb) / 2 + 0.5, ym = Math.max(la, lb) / 2 - 0.5;
      function Y(y){ return y - ym; }
      v.box(-la - 0.6 - xc, Y(yb) - 0.35, -zmax - 0.2, lb + 0.6 - xc, Y(yb), zmax + 0.2, "#3b4352", {cols:[null, null, null, "#4f5869"]});
      v.render(ctx); v.clear();
      /* liaisons */
      function pos(a){ var A = 0.045 * Math.sqrt(a.q + 0.5); A = Math.min(A, 0.2);
        return [a.x + A * Math.sin(t * a.w + a.ph[0]), Y(a.y) + A * Math.sin(t * a.w * 1.13 + a.ph[1]), a.z + A * Math.sin(t * a.w * 0.91 + a.ph[2])]; }
      var PS = AT.map(pos), PP = PS.map(function(p){ return v.p(p[0] - xc, p[1], p[2]); });
      ctx.save(); ctx.lineWidth = 1;
      ED.forEach(function(e){ var a = PP[e[0]], b = PP[e[1]]; ctx.strokeStyle = e[2] ? "rgba(255,215,120,.6)" : AT[e[0]].b ? "rgba(140,185,255,.32)" : "rgba(255,175,120,.32)"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
      ctx.restore();
      /* atomes triés par profondeur */
      var ord = AT.map(function(a, i){ return i; }).sort(function(p, q){ return PP[p].z - PP[q].z; });
      var rA = 0.2;
      ord.forEach(function(i){
        var a = AT[i], q = PP[i], r = rA * v.sc * q.s, col = ctCol(a.q / Math.max(1, 2.2 * Math.max(mean, 0.5)) * 1.0);
        if (a.q > 0) zglow(ctx, q.x, q.y, r * (1.8 + Math.min(1.6, a.q * 0.25)), col, 0.35);
        zball(ctx, q.x, q.y, r, col);
      });
      /* quanta qui sautent d'un atome à l'autre */
      beads.forEach(function(bd){
        var a = PP[bd.i], b = PP[bd.j], s = bd.s, x = a.x + (b.x - a.x) * s, y = a.y + (b.y - a.y) * s - Math.sin(PI * s) * 10;
        zglow(ctx, x, y, 9, [255, 236, 150], 0.9); ctx.fillStyle = "#fffbe6"; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill();
      });
      /* étiquettes et zones cliquables */
      var TA = ctT(NA, qa), TB = ctT(NB, qb);
      /* étiquettes fixes en coin : elles ne suivent plus la vue (pas de chevauchement quand on tourne) */
      ztag(S, c, (phone ? "A (" + NA + ")" : "A · " + NA + " atomes") + " · k_BT/ε = " + zF(TA, 2), 6, 36, {size:phone ? 10.5 : 11.5, color:"#ffd0a0", align:"left"});
      ztag(S, c, (phone ? "B (" + NB + ")" : "B · " + NB + " atomes") + " · k_BT/ε = " + zF(TB, 2), W - 6, 36, {size:phone ? 10.5 : 11.5, color:"#bcd8ff", align:"right"});
      var ha = v.p(-la / 2 - xc, Y((la - 1) / 2), 0), hb = v.p(lb / 2 - xc, Y((lb - 1) / 2), 0);
      HIT = [{x:ha.x, y:ha.y, r:la * 0.55 * v.sc}, {x:hb.x, y:hb.y, r:lb * 0.55 * v.sc}];
      var pc = v.p(-xc, Y(yb) - 0.2, zmax + 0.2);
      ztag(S, c, "contact", pc.x, Math.min(H - 14, pc.y + 12), {size:10.5, color:"#ffd778"});
      zT(S, c, "glisse pour tourner · clique un bloc pour le chauffer", W - 10, 14, {size:zfz(c, 10.5), color:"rgba(210,222,240,.75)", align:"right", weight:600});

      /* ================= graphes ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var p1, p2;
      if (phone){ p1 = [6, 6, FW - 12, (FH - 18) / 2]; p2 = [6, 12 + (FH - 18) / 2, FW - 12, (FH - 18) / 2]; }
      else { p1 = [6, 6, (FW - 18) / 2, FH - 12]; p2 = [12 + (FW - 18) / 2, 6, (FW - 18) / 2, FH - 12]; }
      /* courbes */
      var L = [], best = 0, lmax = -Infinity;
      for (var m = 0; m <= Q; m++){ var lo = ctLnO(NA, m) + ctLnO(NB, Q - m); L.push(lo); if (lo > lmax){ lmax = lo; best = m; } }
      /* panneau 1 : Ω_A·Ω_B */
      zpanel(S, f, p1[0], p1[1], p1[2], p1[3], "Ω_A·Ω_B selon q_A (sommet = 1)");
      var x0 = p1[0] + 14, x1 = p1[0] + p1[2] - 14, y0 = p1[1] + 60, y1 = p1[1] + p1[3] - 24;
      function X(m){ return x0 + m / Q * (x1 - x0); }
      var pts = [];
      for (m = 0; m <= Q; m++) pts.push([X(m), y1 - Math.exp(L[m] - lmax) * (y1 - y0)]);
      g.save(); g.beginPath(); g.moveTo(X(0), y1); pts.forEach(function(p){ g.lineTo(p[0], p[1]); }); g.lineTo(X(Q), y1); g.closePath();
      var gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, "rgba(47,111,214,.35)"); gr.addColorStop(1, "rgba(47,111,214,.04)"); g.fillStyle = gr; g.fill(); g.restore();
      zpoly(g, pts, "#2f6fd6", 2);
      /* temps passé à chaque q_A */
      var vt = 0, vm = 0; for (m = 0; m <= Q; m++){ vt += visits[m] || 0; }
      for (m = 0; m <= Q; m++) vm = Math.max(vm, visits[m] || 0);
      if (vt > 2){
        g.fillStyle = "rgba(224,118,31,.85)";
        var pmax = 0, Zs = 0; for (m = 0; m <= Q; m++) Zs += Math.exp(L[m] - lmax);
        pmax = 1 / Zs;
        for (m = 0; m <= Q; m++){ var fr = (visits[m] || 0) / vt; if (fr <= 0) continue; g.fillRect(X(m) - 1.2, y1 - Math.min(1, fr / pmax) * (y1 - y0), 2.4, 2.4); }
      }
      g.save(); g.strokeStyle = "#b8c2d0"; g.beginPath(); g.moveTo(x0, y1 + 1); g.lineTo(x1, y1 + 1); g.stroke(); g.restore();
      zT(S, f, "0", x0, y1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:700});
      zT(S, f, String(Q), x1, y1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:700});
      zT(S, f, "q_A", (x0 + x1) / 2, y1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:800});
      g.save(); g.strokeStyle = "#13233a"; g.setLineDash([3, 3]); g.lineWidth = 1.4; g.beginPath(); g.moveTo(X(qa), y0 - 4); g.lineTo(X(qa), y1); g.stroke(); g.restore();
      g.fillStyle = "#13233a"; g.beginPath(); g.arc(X(qa), y1 - Math.exp(L[qa] - lmax) * (y1 - y0), 4.5, 0, TAU); g.fill();
      zT(S, f, "q_A = " + qa, Math.max(x0 + 26, Math.min(x1 - 26, X(qa))), y0 - 12, {size:zfz(f, 10), color:"#13233a", weight:800, bg:"rgba(255,255,255,.92)"});
      zT(S, f, "■ temps passé à chaque q_A (à l'équilibre)", x0 - 4, p1[1] + 29, {size:zfz(f, 9.5), color:"#e0761f", align:"left", weight:800});
      /* panneau 2 : ln Ω et pentes */
      zpanel(S, f, p2[0], p2[1], p2[2], p2[3], "ln Ω : les pentes donnent ε/k_BT");
      var u0 = p2[0] + 14, u1 = p2[0] + p2[2] - 14, w0 = p2[1] + 46, w1 = p2[1] + p2[3] - 24;
      var lA = [], lB = [], top = 0;
      for (m = 0; m <= Q; m++){ lA.push(ctLnO(NA, m)); lB.push(ctLnO(NB, Q - m)); top = Math.max(top, lA[m] + lB[m]); }
      function U(m){ return u0 + m / Q * (u1 - u0); }
      function V(l){ return w1 - l / top * (w1 - w0); }
      zpoly(g, lA.map(function(l, m){ return [U(m), V(l)]; }), "#e0761f", 2);
      zpoly(g, lB.map(function(l, m){ return [U(m), V(l)]; }), "#2f6fd6", 2);
      zpoly(g, lA.map(function(l, m){ return [U(m), V(l + lB[m])]; }), "#13233a", 2, [5, 4]);
      /* tangentes au point courant : pente de ln Ω_A en q_A, de ln Ω_B en q_B */
      var sA = Math.log((qa + NA - 0.5) / (qa + 0.5)), sB = Math.log((qb + NB - 0.5) / (qb + 0.5)), dq = Q * 0.16;
      function tan(m0, l0, sl, col){
        var xa = Math.max(0, m0 - dq), xb = Math.min(Q, m0 + dq);
        zpoly(g, [[U(xa), V(l0 + sl * (xa - m0))], [U(xb), V(l0 + sl * (xb - m0))]], col, 3);
      }
      g.save(); g.globalAlpha = 0.55; tan(qa, lA[qa], sA, "#a8480b"); tan(qa, lB[qa], -sB, "#173f8a"); g.restore();
      [[lA[qa], "#e0761f"], [lB[qa], "#2f6fd6"], [lA[qa] + lB[qa], "#13233a"]].forEach(function(p){ g.fillStyle = p[1]; g.beginPath(); g.arc(U(qa), V(p[0]), 3.6, 0, TAU); g.fill(); });
      g.save(); g.strokeStyle = "#b8c2d0"; g.beginPath(); g.moveTo(u0, w1 + 1); g.lineTo(u1, w1 + 1); g.stroke(); g.restore();
      zT(S, f, "q_A", (u0 + u1) / 2, w1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:800});
      var ly = p2[1] + 30;
      zT(S, f, "ln Ω_A", u0, ly, {size:zfz(f, 9.5), color:"#e0761f", align:"left", weight:800});
      zT(S, f, "ln Ω_B", (u0 + u1) / 2, ly, {size:zfz(f, 9.5), color:"#2f6fd6", weight:800});
      zT(S, f, "ln Ω_A + ln Ω_B", u1, ly, {size:zfz(f, 9.5), color:"#13233a", align:"right", weight:800});
      /* ---- afficheurs ---- */
      ro.set(0, qa + " / " + qb);
      ro.set(1, String(best));
      ro.set(2, zF(TA, 2));
      ro.set(3, zF(TB, 2));
      /* largeur à mi-hauteur du pic */
      var lo2 = best, hi2 = best; while (lo2 > 0 && L[lo2 - 1] - lmax > -Math.LN2) lo2--; while (hi2 < Q && L[hi2 + 1] - lmax > -Math.LN2) hi2++;
      BEST = best; HW = Math.max(1, (hi2 - lo2) / 2);
      /* temps réel mis par cette simulation pour atteindre le pic (il dépend de la taille des blocs et de q) */
      if (tEq == null && Math.abs(qa - best) <= Math.max(2, (hi2 - lo2) / 2)) tEq = tGive;
      var eq = tEq != null;
      nt.set((eq ? "Équilibre atteint en ≈ " + zN(Math.max(0.5, tEq), 0) + " s : q_A fluctue dans le pic, " : "Les quanta passent du bloc chaud au bloc froid (depuis " + zN(tGive, 0) + " s ; l'équilibre prend de 1 à ≈ 15 s selon les réglages) : ") +
        "le sommet est à q_A = " + best + " (" + zN(100 * best / Q, 0) + " % de l'énergie pour " + zN(100 * NA / (NA + NB), 0) + " % des atomes), pic large de " + (hi2 - lo2 + 1) + " quanta à mi-hauteur. " +
        "Ω_A·Ω_B y vaut " + zbig(lmax / Math.LN10, 2) + ", contre " + zbig(Math.max(L[0], L[Q]) / Math.LN10, 2) + " si un bloc garde tout.", eq ? "ok" : "warn");
    });
  }
});
/* =====================================================================
   3. Ensemble canonique : 100 copies dans un thermostat (pq14)
   ===================================================================== */
var BZ_DE = 10;                       /* écart ΔE en meV */
var BZ_KB = 8.617333262e-2;           /* k_B en meV/K */
var BZ_COL = ["#26324a", "#38d38a", "#ffd84a", "#ff9a3c", "#ff5a5a", "#c77dff"];
var BZ_SYS = {
  two:{nom:"deux niveaux", E:[0, 1], g:[1, 1], lab:function(i){ return i ? "E₁ = ΔE" : "E₀ = 0"; }},
  deg:{nom:"niveau excité triple", E:[0, 1], g:[1, 3], lab:function(i){ return i ? "E₁ = ΔE (g = 3)" : "E₀ = 0 (g = 1)"; }},
  osc:{nom:"oscillateur", E:[], g:[], lab:function(i){ return i < 5 ? "n = " + i : "n ≥ 5"; }},
  rot:{nom:"rotateur", E:[], g:[], lab:function(i){ return i < 5 ? "J = " + i : "J ≥ 5"; }}
};
(function(){ for (var n = 0; n <= 60; n++){ BZ_SYS.osc.E.push(n); BZ_SYS.osc.g.push(1); }
  for (var J = 0; J <= 40; J++){ BZ_SYS.rot.E.push(J * (J + 1) / 2); BZ_SYS.rot.g.push(2 * J + 1); } })();
/* grandeurs canoniques à la température T (K) ; énergies en unités de ΔE */
function bzThermo(sys, T){
  var L = BZ_SYS[sys], n = L.E.length, i;
  if (T <= 1e-9){ var p0 = []; for (i = 0; i < n; i++) p0.push(i ? 0 : 1); return {Z:L.g[0], p:p0, U:0, C:0, S:Math.log(L.g[0]), x:0}; }
  var x = BZ_KB * T / BZ_DE, w = [], Z = 0, U = 0, U2 = 0;
  for (i = 0; i < n; i++){ w.push(L.g[i] * Math.exp(-L.E[i] / x)); Z += w[i]; }
  var p = w.map(function(a){ return a / Z; });
  for (i = 0; i < n; i++){ U += p[i] * L.E[i]; U2 += p[i] * L.E[i] * L.E[i]; }
  return {Z:Z, p:p, U:U, C:(U2 - U * U) / (x * x), S:Math.log(Z) + U / x, x:x};
}

SFA.sim({
  id:"pq-boltzmann-niveaux", ch:"pq14", tag:"Boltzmann",
  titre:"Un système dans un thermostat : les niveaux s'allument",
  resume:"Cent copies du même petit système posées sur une plaque thermostatée : chacune saute au hasard de niveau, et les populations suivent gᵢ·e^(−Eᵢ/k_BT).",
  but:"Lance la montée en température ou règle T : à 0 K toutes les copies sont éteintes (fondamental), puis les niveaux s'allument quand k_BT approche ΔE. Change de système, glisse sur la scène pour tourner, glisse sur le graphe du bas pour choisir T.",
  aRetenir:"Au contact d'un thermostat, pᵢ = gᵢ·e^(−Eᵢ/k_BT)/Z, et Z donne tout : U, S et C_V.",
  piege:"Même à très haute température, si les deux niveaux ont la même dégénérescence, le niveau excité ne dépasse jamais 50 % : chauffer n'inverse pas la population (pᵢ/gᵢ décroît toujours avec Eᵢ).",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 350), f = k.canvas(phone ? 460 : 290);
    var sys = "deg", ramp = null, ST = [], FL = [];
    k.seg("Système", [["two", "Deux niveaux"], ["deg", "Niveau excité triple"], ["osc", "Oscillateur"], ["rot", "Rotateur"]], "deg", function(v){ sys = v; fill(); });
    var tS = k.slider("Température du thermostat T", 0, 600, 5, 120, "K", function(){ ramp = null; });
    k.button("Partir de 0 K et chauffer", function(){ ramp = {t:0}; tS.set(0); fill(); }, true);
    var ro = k.readouts(["k_BT / ΔE", "Z = Σ gᵢ e^(−Eᵢ/k_BT)", "U (énergie moyenne)", "C_V / k_B (par système)"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.5; v.b = 0.62; v.f = 26; v.set();
    zorbit(c, v, k, [0.2, 1.25]);
    var GEO = null, drag = false;
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO) return;
      var inG = p.x >= GEO.x0 - 6 && p.x <= GEO.x1 + 6 && p.y >= GEO.y0 - 10 && p.y <= GEO.y1 + 14;
      if (type === "down" && inG){ drag = true; setT(p.x); }
      if (type === "drag" && drag) setT(p.x);
      if (type === "move") f.cv.style.cursor = inG ? "ew-resize" : "default";
      if (type === "up") drag = false;
    });
    function setT(x){ ramp = null; tS.set(Math.round(Math.max(0, Math.min(600, (x - GEO.x0) / (GEO.x1 - GEO.x0) * 600)) / 5) * 5); k.redraw(); }
    function draw1(th){ var sm = 0; th.p.forEach(function(a){ sm += a; }); return zpick(th.p, sm); }
    function fill(){ var th = bzThermo(sys, tS.value); ST = []; FL = []; for (var i = 0; i < 100; i++){ ST.push(draw1(th)); FL.push(0); } }
    fill();
    var lp = k.loop(function(dt, t){
      if (ramp){ ramp.t += dt; tS.set(Math.min(400, Math.round(ramp.t / 14 * 400 / 5) * 5)); if (ramp.t >= 14) ramp = null; }
      var th = bzThermo(sys, tS.value);
      /* chaque copie retire son état dans la loi de Boltzmann (bain thermique), environ 1,5 fois par seconde */
      for (var i = 0; i < 100; i++){
        FL[i] = Math.max(0, FL[i] - dt * 2.5);
        if (Math.random() < dt * 1.5){ var s = draw1(th); if (s !== ST[i]){ ST[i] = s; FL[i] = 1; } }
      }
      if (!v.user){ v.a = -0.5 + 0.22 * Math.sin(t * 0.18); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, T = tS.value, th = bzThermo(sys, T), L = BZ_SYS[sys];
      var tt = performance.now() / 1000, hotf = Math.min(1, T / 600);
      /* ================= scène : plaque thermostatée ================= */
      zlab(ctx, W, H, "#1d2537", "#090d16");
      v.sc = Math.min(W / (phone ? 17 : 17.5), H / 11); v.cx = W * 0.5; v.cy = H * 0.43; v.clear();
      /* boîtier du thermostat */
      v.box(-6.2, -3.4, -6.2, 6.2, -0.75, 6.2, "#3e4656", {cols:[null, null, null, "#4a5366"]});
      /* plaque de cuivre teintée par la température */
      var cu = zrgb("#b8733a"), cold = [150, 190, 230], hot = [255, 120, 60], mix = T < 120 ? cold : hot, a = T < 120 ? (1 - T / 120) * 0.55 : (T - 120) / 480 * 0.45;
      var pc = "rgb(" + [0, 1, 2].map(function(j){ return Math.round(cu[j] * (1 - a) + mix[j] * a); }).join(",") + ")";
      v.box(-5.6, -0.75, -5.6, 5.6, -0.35, 5.6, pc);
      /* écran du thermostat, sur la face avant */
      v.sprite(0, -2.0, 6.25, function(g, q){
        var w = 3.6 * v.sc * q.s, h = 1.25 * v.sc * q.s;
        g.save(); zrr(g, q.x - w / 2, q.y - h / 2, w, h, 4); g.fillStyle = "#0b1a14"; g.fill(); g.strokeStyle = "#6c7486"; g.lineWidth = 1.2; g.stroke();
        g.font = "700 " + Math.max(8, h * 0.62) + "px 'JetBrains Mono', ui-monospace, monospace"; g.fillStyle = "#5dffa8"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText(zN(T, 0) + " K", q.x, q.y + 1); g.restore();
      });
      v.render(ctx); v.clear();
      /* les 100 copies : une perle dans chaque alvéole */
      for (i = 0; i < 100; i++){
        (function(i){
          var gx = (i % 10) - 4.5, gz = Math.floor(i / 10) - 4.5, lv = ST[i], col = BZ_COL[Math.min(5, lv)];
          v.sprite(gx, -0.05, gz, function(g, q){
            var r = 0.36 * v.sc * q.s;
            g.save(); g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(q.x, q.y + r * 0.75, r * 1.05, r * 0.42, 0, 0, TAU); g.fill(); g.restore();
            if (lv > 0) zglow(g, q.x, q.y, r * (2.1 + 0.25 * Math.sin(tt * 6 + i)), col, 0.45 + 0.4 * FL[i]);
            zball(g, q.x, q.y, r, col);
            if (FL[i] > 0.05){ g.save(); g.strokeStyle = "rgba(255,255,255," + FL[i] * 0.5 + ")"; g.lineWidth = 1.5; g.beginPath(); g.arc(q.x, q.y, r * (1.2 + (1 - FL[i]) * 1.2), 0, TAU); g.stroke(); g.restore(); }
          });
        })(i);
      }
      v.render(ctx);
      /* givre ou chaleur au-dessus de la plaque */
      if (T > 250){
        ctx.save(); ctx.globalAlpha = Math.min(0.5, (T - 250) / 700);
        for (i = 0; i < 6; i++){ var hx = ((i * 0.37 + tt * 0.05) % 1) * 9 - 4.5, hp = v.p(hx, 0.6 + ((tt * 0.4 + i * 0.3) % 1) * 1.5, (i % 3) * 3 - 3);
          zglow(ctx, hp.x, hp.y, 18, [255, 150, 90], 0.35); }
        ctx.restore();
      }
      var lb = v.p(0, -0.35, -5.6);
      ztag(S, c, "100 copies du même système · " + L.nom, W / 2, 34, {size:phone ? 10.5 : 11.5, color:"#d8e4f6"});
      ztag(S, c, "thermostat", 6, 14, {size:10.5, color:"#aab6c8", align:"left"});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});

      /* ================= graphes ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var p1, p2;
      if (phone){ p1 = [6, 6, FW - 12, 200]; p2 = [6, 212, FW - 12, FH - 218]; }
      else { p1 = [6, 6, (FW - 18) * 0.47, FH - 12]; p2 = [12 + (FW - 18) * 0.47, 6, (FW - 18) * 0.53, FH - 12]; }
      /* --- populations --- */
      zpanel(S, f, p1[0], p1[1], p1[2], p1[3], "Populations des niveaux");
      var nb = L.E.length > 2 ? 6 : 2, cnt = [], pth = [];
      for (i = 0; i < nb; i++){ cnt.push(0); pth.push(0); }
      ST.forEach(function(s){ cnt[Math.min(nb - 1, s)]++; });
      th.p.forEach(function(pp, j){ pth[Math.min(nb - 1, j)] += pp; });
      var x0 = p1[0] + 34, x1 = p1[0] + p1[2] - 10, y0 = p1[1] + (nb > 2 ? 44 : 60), y1 = p1[1] + p1[3] - (nb > 2 ? 22 : 34), bw = (x1 - x0) / nb;
      function Yp(fr){ return y1 - fr * (y1 - y0); }
      g.save(); g.strokeStyle = "#e3e8ef"; g.lineWidth = 1;
      [0, 0.5, 1].forEach(function(fr){ g.beginPath(); g.moveTo(x0, Yp(fr)); g.lineTo(x1, Yp(fr)); g.stroke(); zT(S, f, zN(100 * fr, 0) + " %", x0 - 4, Yp(fr), {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:700}); });
      g.restore();
      for (i = 0; i < nb; i++){
        var bx = x0 + bw * i + bw * 0.16, bwi = bw * 0.68, fr = cnt[i] / 100, col = BZ_COL[Math.min(5, i)];
        var gr = g.createLinearGradient(bx, 0, bx + bwi, 0); gr.addColorStop(0, zshade(col, 0.25)); gr.addColorStop(1, zshade(col, -0.2));
        g.fillStyle = gr; g.fillRect(bx, Yp(fr), bwi, y1 - Yp(fr));
        g.save(); g.strokeStyle = "#13233a"; g.lineWidth = 2.4; g.beginPath(); g.moveTo(bx - 3, Yp(pth[i])); g.lineTo(bx + bwi + 3, Yp(pth[i])); g.stroke(); g.restore();
        /* deux niveaux : limite T → ∞, pᵢ → gᵢ/(g₀ + g₁) */
        if (nb === 2){ var plim = L.g[i] / (L.g[0] + L.g[1]);
          g.save(); g.strokeStyle = "#c2410c"; g.lineWidth = 1.6; g.setLineDash([5, 3]); g.beginPath(); g.moveTo(bx - 6, Yp(plim)); g.lineTo(bx + bwi + 6, Yp(plim)); g.stroke(); g.restore(); }
        var lab = L.lab(i);
        if (nb > 2) zT(S, f, lab, bx + bwi / 2, y1 + 11, {size:zfz(f, 9.5), color:"#3c4a5e", weight:700});
        else { var parts = lab.split(" ("); zT(S, f, parts[0], bx + bwi / 2, y1 + 11, {size:zfz(f, 10), color:"#3c4a5e", weight:800}); if (parts[1]) zT(S, f, "(" + parts[1], bx + bwi / 2, y1 + 24, {size:zfz(f, 9.5), color:"#7a8596", weight:700}); }
      }
      zT(S, f, "barres : copies · trait : gᵢe^(−Eᵢ/k_BT)/Z", p1[0] + 10, p1[1] + 29, {size:zfz(f, 9.5), color:"#5f6b7a", align:"left", weight:700});
      if (nb === 2) zT(S, f, "- - limite T → ∞ : gᵢ/(g₀ + g₁), soit " + zN(100 * L.g[1] / (L.g[0] + L.g[1]), 0) + " % pour E₁", p1[0] + 10, p1[1] + 43, {size:zfz(f, 9.5), color:"#c2410c", align:"left", weight:800});
      /* --- U, S, C_V en fonction de T --- */
      zpanel(S, f, p2[0], p2[1], p2[2], p2[3], "Tout sort de Z : U, S et C_V");
      var u0 = p2[0] + 30, u1 = p2[0] + p2[2] - 12, w0 = p2[1] + 44, w1 = p2[1] + p2[3] - 24;
      GEO = {x0:u0, x1:u1, y0:w0, y1:w1};
      var cu1 = [], cs1 = [], cc1 = [], top = 0;
      for (var Tk = 0; Tk <= 600; Tk += 5){ var q = bzThermo(sys, Tk); cu1.push(q.U); cs1.push(q.S); cc1.push(q.C); top = Math.max(top, q.U, q.S, q.C); }
      top = Math.ceil(top * 2 + 0.2) / 2;
      function Xt(T2){ return u0 + T2 / 600 * (u1 - u0); }
      function Yv(y){ return w1 - y / top * (w1 - w0); }
      g.save(); g.strokeStyle = "#e3e8ef"; g.lineWidth = 1;
      for (var yv = 0; yv <= top + 1e-9; yv += top > 3 ? 1 : 0.5){ g.beginPath(); g.moveTo(u0, Yv(yv)); g.lineTo(u1, Yv(yv)); g.stroke(); zT(S, f, zN(yv, 1), u0 - 4, Yv(yv), {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:700}); }
      g.restore();
      function ser(arr, col, dash){ zpoly(g, arr.map(function(y, j){ return [Xt(j * 5), Yv(y)]; }), col, 2.2, dash); }
      ser(cu1, "#2f6fd6"); ser(cs1, "#1f8a5b", [6, 4]); ser(cc1, "#d0504f");
      for (var tk = 0; tk <= 600; tk += phone ? 200 : 100) zT(S, f, String(tk), Xt(tk), w1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:600});
      zT(S, f, "T (K)", u1, w1 - 9, {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:800});
      /* repère k_BT = ΔE */
      var Tde = BZ_DE / BZ_KB;
      g.save(); g.strokeStyle = "rgba(19,35,58,.35)"; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(Xt(Tde), w0); g.lineTo(Xt(Tde), w1); g.stroke(); g.restore();
      /* l'étiquette passe de l'autre côté du repère si le curseur T la traverserait */
      g.save(); g.font = "700 " + zfz(f, 9.5) + "px Mulish, system-ui, sans-serif"; var wde = g.measureText("k_BT = ΔE").width; g.restore();
      var xcT = Xt(T), xde = xcT >= Xt(Tde) - 2 && xcT <= Xt(Tde) + wde + 10 ? Math.max(xcT, Xt(Tde)) + 5 : Xt(Tde) + 4;
      zT(S, f, "k_BT = ΔE", xde, w0 + 6, {size:zfz(f, 9.5), color:"#5f6b7a", align:"left", weight:700});
      /* curseur T */
      g.save(); g.strokeStyle = "#13233a"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(Xt(T), w0 - 6); g.lineTo(Xt(T), w1); g.stroke(); g.restore();
      [[th.U, "#2f6fd6"], [th.S, "#1f8a5b"], [th.C, "#d0504f"]].forEach(function(p){ g.fillStyle = p[1]; g.beginPath(); g.arc(Xt(T), Yv(p[0]), 4, 0, TAU); g.fill(); });
      var ly = p2[1] + 29, lx = p2[0] + 10;
      zT(S, f, "U/ΔE", lx, ly, {size:zfz(f, 10), color:"#2f6fd6", align:"left", weight:800});
      zT(S, f, "S/k_B", lx + (phone ? 52 : 56), ly, {size:zfz(f, 10), color:"#1f8a5b", align:"left", weight:800});
      zT(S, f, "C_V/k_B", lx + (phone ? 104 : 112), ly, {size:zfz(f, 10), color:"#d0504f", align:"left", weight:800});
      zT(S, f, "↔ glisse", p2[0] + p2[2] - 10, p2[1] + 13, {size:zfz(f, 9.5), color:"#8792a2", align:"right", weight:700});
      /* ---- afficheurs ---- */
      ro.set(0, zF(th.x, 2));
      ro.set(1, zF(th.Z, 3));
      ro.set(2, zF(th.U * BZ_DE, 2) + " meV");
      ro.set(3, zF(th.C, 3));
      var nOn = 0; ST.forEach(function(s){ if (s > 0) nOn++; });
      nt.set("ΔE = " + BZ_DE + " meV, soit ΔE/k_B = " + zN(Tde, 0) + " K. Fondamental : p₀ = " + zN(100 * th.p[0], 1) + " % (" + (100 - nOn) + " copies éteintes sur 100 en ce moment). Entropie S = " + zF(th.S, 3) + " k_B" +
        (sys === "two" ? " (au plus ln 2 = 0,693 k_B)." : sys === "deg" ? " (au plus ln 4 = 1,386 k_B)." : "."), "ok");
    });
  }
});
/* =====================================================================
   4. C_V d'un gaz diatomique : rotations et vibrations qui se réveillent (pq15)
   ===================================================================== */
var CV_R = 8.314462618;
var CV_GAS = {
  h2:{nom:"H₂", eb:20.3, fu:14.0, td:2500, tr:85.3, tv:6332, col:["#e9eef6", "#e9eef6"], r:[0.17, 0.17]},
  hcl:{nom:"HCl", eb:188, fu:159, td:2500, tr:15.2, tv:4303, col:["#e9eef6", "#5bd16e"], r:[0.16, 0.27]},
  n2:{nom:"N₂", eb:77.4, fu:63.2, td:5000, tr:2.88, tv:3374, col:["#5b86ff", "#5b86ff"], r:[0.22, 0.22]},
  o2:{nom:"O₂", eb:90.2, fu:54.4, td:2500, tr:2.08, tv:2256, col:["#ff5f52", "#ff5f52"], r:[0.22, 0.22]}
};
/* rotateur rigide : z = Σ (2J+1) e^(−J(J+1)θr/T) ; c_rot/R = variance de E/(k_BT) */
function cvRot(tr, T){
  var y = tr / T, z = 0, e1 = 0, e2 = 0;
  for (var J = 0; J < 400; J++){
    var e = J * (J + 1) * y, w = (2 * J + 1) * Math.exp(-e);
    z += w; e1 += w * e; e2 += w * e * e;
    if (J > 3 && w < 1e-14 * z) break;
  }
  e1 /= z; e2 /= z;
  return {c:e2 - e1 * e1, z:z, p0:1 / z};
}
/* oscillateur (Einstein) : c_vib/R = x² eˣ/(eˣ − 1)², x = θv/T */
function cvVib(tv, T){ var x = tv / T; if (x > 700) return 0; var ex = Math.exp(x); return x * x * ex / ((ex - 1) * (ex - 1)); }
function cvAll(g, T){ var r = cvRot(g.tr, T), vb = cvVib(g.tv, T); return {tr:1.5, rot:r.c, vib:vb, tot:1.5 + r.c + vb, z:r.z, J1:1 - r.p0, v1:Math.exp(-g.tv / T)}; }
/* tirages : J selon (2J+1)e^(−J(J+1)θr/T), v selon e^(−vθv/T) */
function cvDrawJ(tr, T){
  var y = tr / T, w = [], s = 0;
  for (var J = 0; J < 400; J++){ var a = (2 * J + 1) * Math.exp(-J * (J + 1) * y); w.push(a); s += a; if (J > 3 && a < 1e-12 * s) break; }
  return zpick(w, s);
}
function cvDrawV(tv, T){ var q = Math.exp(-tv / T), v = 0; while (v < 30 && Math.random() < q) v++; return v; }

SFA.sim({
  id:"pq-cv-diatomique", ch:"pq15", tag:"Équipartition",
  titre:"Chauffer un gaz diatomique : rotations et vibrations qui se réveillent",
  resume:"Une boîte de molécules diatomiques chauffée de 10 K à 10 000 K : d'abord elles volent, puis tournent, puis vibrent, et c_V monte par marches.",
  but:"Lance la montée en température ou règle T (échelle logarithmique) : regarde les molécules se mettre à tourner autour de θ_rot puis à vibrer autour de θ_vib, et c_V/R passer de 3/2 à 5/2 puis 7/2. Change de gaz, glisse sur la boîte pour tourner, glisse sur le graphe pour choisir T.",
  aRetenir:"Un degré de liberté ne compte dans c_V que si k_BT dépasse l'écart entre ses niveaux : sinon il est gelé.",
  piege:"À 300 K, c_V vaut 5/2 R et non 7/2 R : la vibration existe, mais presque toutes les molécules restent dans v = 0.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 360), f = k.canvas(phone ? 400 : 280);
    var gas = "h2", ramp = null, M = [], NM = phone ? 16 : 20;
    k.seg("Gaz", [["h2", "H₂"], ["hcl", "HCl"], ["n2", "N₂"], ["o2", "O₂"]], "h2", function(v){ gas = v; M.forEach(resample); });
    var tS = k.slider("Température T (échelle log)", 1, 4, 0.001, 2.4771, "", function(){ ramp = null; });
    var outT = tS.el.parentNode.querySelector("output");
    k.button("Chauffer de 10 K à 10 000 K", function(){ ramp = {t:0}; tS.set(1); M.forEach(resample); }, true);
    var ro = k.readouts(["c_V / R", "C_V molaire", "Molécules qui tournent (J ≥ 1)", "Molécules qui vibrent (v ≥ 1)"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.6; v.b = 0.32; v.f = 14; v.set();
    zorbit(c, v, k, [-0.1, 1.2]);
    var GEO = null, drag = false;
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO) return;
      var inG = p.x >= GEO.x0 - 6 && p.x <= GEO.x1 + 6 && p.y >= GEO.y0 - 10 && p.y <= GEO.y1 + 14;
      if (type === "down" && inG){ drag = true; setT(p.x); }
      if (type === "drag" && drag) setT(p.x);
      if (type === "move") f.cv.style.cursor = inG ? "ew-resize" : "default";
      if (type === "up") drag = false;
    });
    function setT(x){ ramp = null; tS.set(Math.round(Math.max(1, Math.min(4, 1 + 3 * (x - GEO.x0) / (GEO.x1 - GEO.x0))) * 1000) / 1000); k.redraw(); }
    function T(){ return Math.pow(10, tS.value); }
    function rnd3(){ var u = 2 * Math.random() - 1, ph = TAU * Math.random(), s = Math.sqrt(1 - u * u); return [s * Math.cos(ph), u, s * Math.sin(ph)]; }
    function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function norm(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
    function resample(m){
      var g = CV_GAS[gas], t = T();
      m.J = cvDrawJ(g.tr, t); m.vv = cvDrawV(g.tv, t);
      /* vitesse d'affichage : ∝ T^0,25 (les vraies vitesses ∝ √T, comprimées pour rester visibles) */
      var sp = 0.55 * Math.pow(t / 100, 0.25) * (0.6 + 0.8 * Math.random()), d = rnd3();
      m.vel = [d[0] * sp, d[1] * sp, d[2] * sp];
      /* rotation : ω ∝ (E_rot)^0,4, comprimée elle aussi */
      var Er = m.J * (m.J + 1) * g.tr;
      m.w = m.J ? Math.min(9, 1.5 * Math.pow(Er / 100, 0.4)) : 0;
      m.L = norm(cross(m.n, rnd3()));
    }
    for (var i = 0; i < NM; i++){ var m0 = {c:[(Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2], n:rnd3(), ph:TAU * Math.random(), fl:0}; M.push(m0); resample(m0); }
    var tt = 0;
    var lp = k.loop(function(dt, t){
      tt += dt;
      if (ramp){ ramp.t += dt; tS.set(Math.min(4, 1 + 3 * ramp.t / 18)); if (ramp.t >= 18) ramp = null; }
      M.forEach(function(m){
        for (var a = 0; a < 3; a++){ m.c[a] += m.vel[a] * dt; if (m.c[a] > 1.6){ m.c[a] = 1.6; m.vel[a] = -Math.abs(m.vel[a]); } if (m.c[a] < -1.6){ m.c[a] = -1.6; m.vel[a] = Math.abs(m.vel[a]); } }
        if (m.w){ var th = m.w * dt, cs = Math.cos(th), sn = Math.sin(th), lx = cross(m.L, m.n); m.n = norm([m.n[0] * cs + lx[0] * sn, m.n[1] * cs + lx[1] * sn, m.n[2] * cs + lx[2] * sn]); }
        m.ph += dt * 22; m.fl = Math.max(0, m.fl - dt * 2);
        /* chocs : environ un par seconde, qui retirent J, v et la vitesse */
        if (Math.random() < dt * 1.0){ var oJ = m.J, ov = m.vv; resample(m); if (m.J !== oJ || m.vv !== ov) m.fl = 1; }
      });
      if (!v.user){ v.a = -0.6 + 0.25 * Math.sin(t * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, g = CV_GAS[gas], Tk = T(), cv = cvAll(g, Tk), lt = (tS.value - 1) / 3;
      outT.innerHTML = (Tk < 100 ? zN(Tk, 1) : zN(Math.round(Tk / (Tk < 1000 ? 1 : 10)) * (Tk < 1000 ? 1 : 10), 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")) + " <i>K</i>";
      /* ================= scène : boîte de verre sur une plaque chauffante ================= */
      zlab(ctx, W, H, "#1c2436", "#080c15");
      v.sc = Math.min(W / (phone ? 5.6 : 6.6), H / 5.0); v.cx = W * 0.5; v.cy = H * 0.47; v.clear();
      v.box(-2.9, -2.75, -2.9, 2.9, -2.45, 2.9, "#4a5263", {cols:[null, null, null, "#58617a"]});
      /* plaque chauffante qui rougit avec T */
      var hotc = lt < 0.4 ? [110, 160, 220] : [Math.round(120 + 135 * Math.min(1, (lt - 0.4) / 0.5)), Math.round(110 - 40 * Math.min(1, (lt - 0.4) / 0.5)), Math.round(100 - 60 * Math.min(1, (lt - 0.4) / 0.5))];
      v.box(-2.3, -2.45, -2.3, 2.3, -2.2, 2.3, "rgb(" + hotc.join(",") + ")");
      v.render(ctx); v.clear();
      if (lt > 0.55){ var hp = v.p(0, -2.2, 0); zglow(ctx, hp.x, hp.y, 2.6 * v.sc, [255, 110, 50], Math.min(0.5, (lt - 0.55) * 1.4)); }
      /* boîte : faces arrière légèrement teintées */
      var B = 2, P8 = [[-B, -B, -B], [B, -B, -B], [B, B, -B], [-B, B, -B], [-B, -B, B], [B, -B, B], [B, B, B], [-B, B, B]];
      var EDG = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      var PP = P8.map(function(p){ return v.p(p[0], p[1] - 0.2, p[2]); });
      ctx.save(); ctx.fillStyle = "rgba(160,200,240,0.07)";
      [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(fc){ ctx.beginPath(); fc.forEach(function(j, q){ if (q) ctx.lineTo(PP[j].x, PP[j].y); else ctx.moveTo(PP[j].x, PP[j].y); }); ctx.closePath(); ctx.fill(); });
      ctx.restore();
      var zc = v.p(0, -0.2, 0).z;
      function edges(front){
        ctx.save(); ctx.lineWidth = front ? 2.2 : 1.4; ctx.strokeStyle = front ? "rgba(205,225,250,.7)" : "rgba(160,185,215,.35)";
        EDG.forEach(function(e){ var a = PP[e[0]], b = PP[e[1]]; if (((a.z + b.z) / 2 > zc) !== front) return; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
        ctx.restore();
      }
      edges(false);
      /* molécules, de la plus lointaine à la plus proche */
      var Q = M.map(function(m){
        var amp = 0.05 * Math.sqrt(m.vv + 0.5) * (m.vv ? 2.2 : 1), r = 0.23 * (1 + amp * Math.sin(m.ph));
        var a = [m.c[0] + m.n[0] * r, m.c[1] - 0.2 + m.n[1] * r, m.c[2] + m.n[2] * r], b = [m.c[0] - m.n[0] * r, m.c[1] - 0.2 - m.n[1] * r, m.c[2] - m.n[2] * r];
        return {m:m, A:v.p(a[0], a[1], a[2]), B:v.p(b[0], b[1], b[2]), z:v.p(m.c[0], m.c[1] - 0.2, m.c[2]).z};
      }).sort(function(p, q){ return p.z - q.z; });
      Q.forEach(function(q){
        var m = q.m, s = (q.A.s + q.B.s) / 2;
        if (m.vv > 0) zglow(ctx, (q.A.x + q.B.x) / 2, (q.A.y + q.B.y) / 2, 0.75 * v.sc * s, [255, 150, 60], 0.45);
        if (m.J > 0 && m.w > 0.3){
          ctx.save(); ctx.strokeStyle = "rgba(120,230,160,.35)"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc((q.A.x + q.B.x) / 2, (q.A.y + q.B.y) / 2, 0.36 * v.sc * s, 0, TAU); ctx.stroke(); ctx.restore();
        }
        var first = q.A.z < q.B.z ? [q.A, 0] : [q.B, 1], second = q.A.z < q.B.z ? [q.B, 1] : [q.A, 0];
        ctx.save(); ctx.strokeStyle = m.vv ? "#ffb070" : "#c9d3e2"; ctx.lineWidth = Math.max(1.5, 0.08 * v.sc * s); ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(q.A.x, q.A.y); ctx.lineTo(q.B.x, q.B.y); ctx.stroke(); ctx.restore();
        [first, second].forEach(function(p){ zball(ctx, p[0].x, p[0].y, 0.82 * g.r[p[1]] * v.sc * p[0].s, g.col[p[1]]); });
        if (m.fl > 0.05){ ctx.save(); ctx.strokeStyle = "rgba(255,255,255," + 0.45 * m.fl + ")"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc((q.A.x + q.B.x) / 2, (q.A.y + q.B.y) / 2, (0.5 + (1 - m.fl) * 0.4) * v.sc * s, 0, TAU); ctx.stroke(); ctx.restore(); }
      });
      edges(true);
      ztag(S, c, g.nom + " · " + outT.textContent.replace(" K", " K").trim(), W / 2, 34, {size:phone ? 11 : 12, color:"#e6eefb"});
      var hl = v.p(2.3, -2.3, 2.3);
      ztag(S, c, "plaque chauffante", Math.max(60, Math.min(W - 60, hl.x)), Math.min(H - 14, hl.y + 14), {size:10.5, color:"#ffc09a"});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      zT(S, c, "vitesses non à l'échelle", W - 10, 30, {size:zfz(c, 10), color:"rgba(210,222,240,.72)", align:"right", weight:600});
      ztag(S, c, "○ vert : tourne · halo orange : vibre", 6, 14, {size:10, align:"left", weight:600, color:"#d2def0"});

      /* ================= graphe c_V/R(T) et barre des parts ================= */
      var gx = f.ctx, FW = f.W, FH = f.H;
      gx.fillStyle = "#f5f7fb"; gx.fillRect(0, 0, FW, FH);
      var barH = phone ? 70 : 64;
      zpanel(S, f, 6, 6, FW - 12, FH - 18 - barH, "c_V / R du gaz " + g.nom + " (modèle sans dissociation)");
      var x0 = 40, x1 = FW - 18, y0 = 6 + 34, y1 = FH - 12 - barH - 26;
      GEO = {x0:x0, x1:x1, y0:y0, y1:y1};
      function X(lg){ return x0 + (lg - 1) / 3 * (x1 - x0); }
      function Y(cv2){ return y1 - (cv2 - 1) / 2.8 * (y1 - y0); }
      gx.save(); gx.strokeStyle = "#e3e8ef"; gx.lineWidth = 1;
      [[1.5, "3/2"], [2.5, "5/2"], [3.5, "7/2"]].forEach(function(p){
        gx.setLineDash([4, 4]); gx.strokeStyle = "#c2ccda"; gx.beginPath(); gx.moveTo(x0, Y(p[0])); gx.lineTo(x1, Y(p[0])); gx.stroke();
        zT(S, f, p[1], x0 - 6, Y(p[0]), {size:zfz(f, 10.5), color:"#3c4a5e", align:"right", weight:800});
      });
      gx.setLineDash([]); gx.strokeStyle = "#b8c2d0";
      for (var e = 1; e <= 4; e++){ gx.beginPath(); gx.moveTo(X(e), y1); gx.lineTo(X(e), y1 + 4); gx.stroke(); zT(S, f, String(Math.pow(10, e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (e === 4 ? " K" : ""), X(e), y1 + 13, {size:zfz(f, 9.5), color:"#5f6b7a", weight:700, align:e === 4 ? "right" : e === 1 ? "left" : "center"}); }
      gx.restore();
      /* zones translation / rotation / vibration sous la courbe */
      var pts = [], pr = [], pv = [];
      for (i = 0; i <= 240; i++){ var lg = 1 + 3 * i / 240, q = cvAll(g, Math.pow(10, lg)); pts.push([X(lg), Y(q.tot)]); pr.push([X(lg), Y(1.5 + q.rot)]); pv.push(q); }
      function band(lo, hi, col){ gx.save(); gx.beginPath(); lo.forEach(function(p, j){ if (j) gx.lineTo(p[0], p[1]); else gx.moveTo(p[0], p[1]); }); for (var j = hi.length - 1; j >= 0; j--) gx.lineTo(hi[j][0], hi[j][1]); gx.closePath(); gx.fillStyle = col; gx.fill(); gx.restore(); }
      var base = pts.map(function(p){ return [p[0], Y(1)]; }), tr = pts.map(function(p){ return [p[0], Y(1.5)]; });
      band(base, tr, "rgba(47,111,214,.16)"); band(tr, pr, "rgba(31,160,90,.18)"); band(pr, pts, "rgba(224,118,31,.2)");
      zpoly(gx, pts, "#13233a", 2.4);
      /* repères θ_rot et θ_vib */
      [[g.tr, "θ_rot"], [g.tv, "θ_vib"]].forEach(function(p, j){
        var lg = Math.log10(p[0]), xs = X(Math.max(1, lg)), txt = p[1] + " = " + (p[0] < 100 ? zN(p[0], p[0] < 10 ? 2 : 1) : zN(p[0], 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")) + " K";
        gx.save(); gx.strokeStyle = j ? "rgba(224,118,31,.7)" : "rgba(31,140,80,.7)"; gx.setLineDash([2, 3]); if (lg >= 1){ gx.beginPath(); gx.moveTo(xs, y0); gx.lineTo(xs, y1); gx.stroke(); } gx.restore();
        zT(S, f, lg < 1 ? "← " + txt : txt, lg < 1 ? x0 + 4 : xs + (j ? -4 : 4), y1 - 10, {size:zfz(f, 9.5), color:j ? "#b5560f" : "#1f7a4b", align:lg < 1 ? "left" : j ? "right" : "left", weight:800, bg:"rgba(255,255,255,.9)"});
      });
      /* curseur */
      var xc = X(tS.value);
      gx.save(); gx.strokeStyle = "#13233a"; gx.lineWidth = 1.3; gx.beginPath(); gx.moveTo(xc, y0 - 4); gx.lineTo(xc, y1); gx.stroke(); gx.restore();
      gx.fillStyle = "#13233a"; gx.beginPath(); gx.arc(xc, Y(cv.tot), 5, 0, TAU); gx.fill();
      if (!phone) zT(S, f, "↔ glisse pour régler T", FW - 16, 6 + 13, {size:zfz(f, 9.5), color:"#8792a2", align:"right", weight:700});
      /* barre : parts de c_V */
      var by = FH - 6 - barH, bx0 = 16, bx1 = FW - 16;
      zpanel(S, f, 6, by, FW - 12, barH, "");
      var bw = bx1 - bx0, yb0 = by + 8, hb = 20, sc = bw / 3.5, xx = bx0;
      [[cv.tr, "#2f6fd6", "translation"], [cv.rot, "#1fa05a", "rotation"], [cv.vib, "#e0761f", "vibration"]].forEach(function(p){
        var wv = p[0] * sc; if (wv > 0.5){ var gr = gx.createLinearGradient(0, yb0, 0, yb0 + hb); gr.addColorStop(0, zshade(p[1], 0.3)); gr.addColorStop(1, zshade(p[1], -0.15)); gx.fillStyle = gr; gx.fillRect(xx, yb0, wv, hb); }
        xx += wv;
      });
      gx.save(); gx.strokeStyle = "#13233a"; gx.lineWidth = 1; gx.strokeRect(bx0 + 0.5, yb0 + 0.5, bw - 1, hb - 1);
      [1.5, 2.5].forEach(function(m){ gx.setLineDash([2, 2]); gx.beginPath(); gx.moveTo(bx0 + m * sc, yb0 - 3); gx.lineTo(bx0 + m * sc, yb0 + hb + 3); gx.stroke(); }); gx.restore();
      var ly = yb0 + hb + 14, items = [["translation " + zF(cv.tr, 2), "#2f6fd6"], ["rotation " + zF(cv.rot, 2), "#1fa05a"], ["vibration " + zF(cv.vib, 2), "#e0761f"]];
      items.forEach(function(it, j){ zT(S, f, it[0], bx0 + bw * (j + 0.5) / 3, ly, {size:zfz(f, 10), color:it[1], weight:800}); });
      if (phone) zT(S, f, "(en unités de R ; barre pleine = 7/2)", FW / 2, ly + 15, {size:9.5, color:"#7a8596", weight:600});
      else zT(S, f, "en unités de R · barre pleine = 7/2", FW / 2, ly + 15, {size:zfz(f, 9.5), color:"#7a8596", weight:600});
      /* ---- afficheurs ---- */
      ro.set(0, zF(cv.tot, 3));
      ro.set(1, zF(cv.tot * CV_R, 1) + " J/(mol·K)");
      ro.set(2, zF(100 * cv.J1, 1) + " %");
      ro.set(3, cv.v1 < 1e-4 ? zsci(100 * cv.v1, 1) + " %" : zF(100 * cv.v1, 1) + " %");
      var st = Tk < g.tr * 0.3 ? "Rotation et vibration gelées : les molécules ne font que voler (3 degrés de liberté)." :
        Tk < g.tv * 0.15 ? (cv.rot > 0.95 ? "Rotation débloquée, vibration gelée : 5 degrés de liberté actifs, c_V ≈ 5/2 R." : "La rotation se réveille : k_BT approche l'écart entre J = 0 et J = 1.") :
        cv.vib > 0.9 ? "Vibration débloquée elle aussi : c_V tend vers 7/2 R." : "La vibration se réveille : k_BT approche ħω = k_B·θ_vib.";
      var real = Tk > g.td ? " En réalité, au-delà de ~" + zN(g.td, 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " K, " + g.nom + " commence à se dissocier : ce modèle l'ignore." :
        Tk < g.eb ? " En réalité, sous " + zN(g.eb, 0) + " K ce gaz serait liquide, puis solide plus bas (sous " + zN(g.fu, 0) + " K, à 1 bar)" + (Tk < g.fu ? " : il serait déjà solide ici." : ".") + " Le modèle le garde gazeux." :
        gas === "h2" && Tk < 400 && Tk > 25 ? " (Pour le vrai H₂, la symétrie ortho/para déforme cette marche.)" : "";
      nt.set(st + real, Tk > g.td || Tk < g.eb ? "warn" : "ok");
    });
  }
});
/* =====================================================================
   5. Gaz dans une boîte : les niveaux d'une boîte qu'on écrase (pq15)
   ===================================================================== */
var GB_M = 4.002602 * UMA;                       /* atome d'hélium 4 */
var GB_COL = ["#4ea4ff", "#38d38a", "#ffd84a", "#ff9a3c", "#ff5a5a", "#c77dff"];
/* ε_d = π²ħ²/(2 m d²) en joules, d en nm */
function gbEps(dnm){ var d = dnm * 1e-9; return PI * PI * HB * HB / (2 * GB_M * d * d); }
/* somme 1D : z = Σ e^(−n² ε/kT), ⟨n²⟩ ; x = kT/ε */
function gb1D(x){
  var nmax = Math.max(4, Math.ceil(Math.sqrt(46 * x)) + 2), z = 0, s2 = 0;
  for (var n = 1; n <= nmax; n++){ var w = Math.exp(-n * n / x); z += w; s2 += n * n * w; }
  return {z:z, n2:s2 / z};
}
/* tirage de n selon e^(−n² ε/kT) */
function gbDrawN(x){
  var nmax = Math.max(4, Math.ceil(Math.sqrt(46 * x)) + 2), w = [], s = 0;
  for (var n = 1; n <= nmax; n++){ var a = Math.exp(-n * n / x); w.push(a); s += a; }
  return zpick(w, s) + 1;
}

SFA.sim({
  id:"pq-gaz-boite-niveaux", ch:"pq15", tag:"Gaz parfait",
  titre:"D'où vient la pression : les niveaux d'une boîte qu'on écrase",
  resume:"Des atomes d'hélium dans une boîte de quelques nanomètres fermée par un piston : pousser le piston écarte les niveaux d'énergie, et c'est de là que vient la pression. Les atomes sont traités un par un, sans interactions ; l'hélium réel se liquéfie sous 4,2 K.",
  but:"Attrape le piston et pousse-le : les niveaux nz montent, l'énergie aussi, et la force sur le piston grandit. Agrandis la boîte ou chauffe : l'échelle devient quasi continue et P·V/(N k_BT) revient à 1. Glisse ailleurs sur la scène pour tourner.",
  aRetenir:"Chaque niveau vaut (nx²/a² + ny²/a² + nz²/L²)·π²ħ²/2m : pousser le piston fait monter les niveaux, et la force sur le piston vaut 2E_z/L, avec E_z l'énergie moyenne du mouvement selon le piston.",
  piege:"À basse température, la pression ne tend pas vers 0 comme N k_BT/V : l'atome garde l'énergie du niveau fondamental et pousse encore.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 300 : 340), f = k.canvas(phone ? 470 : 290);
    var aS = k.slider("Côté de la section a", 0.5, 5, 0.1, 1, "nm", function(){ M.forEach(resample); });
    var lS = k.slider("Piston : longueur L / a", 0.25, 2, 0.01, 1, "", function(){ M.forEach(resample); });
    var tS = k.slider("Température T (échelle log)", -1, 2.5, 0.001, 0.30103, "");
    var outT = tS.el.parentNode.querySelector("output");
    var pump = null;
    k.button("Pousser puis tirer le piston", function(){ pump = {t:0, L0:lS.value}; }, true);
    var ro = k.readouts(["Niveau fondamental E₁₁₁", "Énergie moyenne / (3/2 k_BT)", "Force sur le piston (1 atome)", "P·V / (N k_BT)"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = -0.42; v.b = 0.36; v.f = 15; v.set();
    var PIST = null, dragP = null, M = [], NM = 9;
    zorbit(c, v, k, [0.0, 1.2], function(type, p){
      if (PIST && Math.hypot(p.x - PIST.x, p.y - PIST.y) < PIST.r){ dragP = {x:p.x, y:p.y, L:lS.value}; pump = null; return false; }
    });
    c.pointer(function(type, p){
      if (type === "drag" && dragP && PIST){
        var dx = p.x - dragP.x, dy = p.y - dragP.y, ux = PIST.ux, uy = PIST.uy, l2 = ux * ux + uy * uy || 1;
        var dw = (dx * ux + dy * uy) / l2;            /* déplacement en unités de scène le long de x */
        lS.set(Math.round(Math.max(0.25, Math.min(2, dragP.L + dw / (2 * GB_A))) * 100) / 100); M.forEach(clampIn); k.redraw();
      }
      if (type === "up") dragP = null;
      if (type === "move" && PIST) c.cv.style.cursor = Math.hypot(p.x - PIST.x, p.y - PIST.y) < PIST.r ? "ew-resize" : "grab";
    });
    var GB_A = 1.25;                                   /* demi-côté de la section, en unités de scène */
    function Tk(){ return Math.pow(10, tS.value); }
    function dims(){ var a = aS.value, L = a * lS.value; return {a:a, L:L, ea:gbEps(a), eL:gbEps(L)}; }
    function xw(){ return -1.6 + 2 * GB_A * lS.value; }   /* abscisse du piston (fond de la boîte en x = −1,6) */
    function resample(m){
      var d = dims(), kT = KB * Tk();
      m.n = [gbDrawN(kT / d.ea), gbDrawN(kT / d.ea), gbDrawN(kT / d.eL)];
      /* vitesse affichée : composante ∝ √(nᵢ/dᵢ), comprimée pour rester lisible */
      var sc = [d.a, d.a, d.L];
      m.v = m.n.map(function(n, i){ return (Math.random() < 0.5 ? -1 : 1) * Math.min(3.5, 0.75 * Math.sqrt(n * d.a / sc[i])); });
      m.fl = 1;
    }
    function clampIn(m){ var x1 = xw() - 0.15; if (m.p[0] > x1) m.p[0] = x1; }
    for (var i = 0; i < NM; i++){ var m0 = {p:[-1.6 + 0.3 + Math.random() * 1.8, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2], fl:0}; M.push(m0); resample(m0); }
    var lp = k.loop(function(dt, t){
      if (pump){ pump.t += dt; var ph = pump.t / 7; lS.set(Math.round((pump.L0 - (pump.L0 - 0.35) * Math.sin(PI * Math.min(1, ph))) * 100) / 100); M.forEach(clampIn); if (ph >= 1){ lS.set(pump.L0); pump = null; } }
      var lim = [[-1.6 + 0.15, xw() - 0.15], [-GB_A + 0.15, GB_A - 0.15], [-GB_A + 0.15, GB_A - 0.15]];
      M.forEach(function(m){
        for (var a = 0; a < 3; a++){ m.p[a] += m.v[a] * dt; if (m.p[a] > lim[a][1]){ m.p[a] = lim[a][1]; m.v[a] = -Math.abs(m.v[a]); m.hit = a === 0 ? 1 : m.hit; } if (m.p[a] < lim[a][0]){ m.p[a] = lim[a][0]; m.v[a] = Math.abs(m.v[a]); } }
        m.fl = Math.max(0, m.fl - dt * 2); m.hit = Math.max(0, (m.hit || 0) - dt * 4);
        if (Math.random() < dt * 0.8) resample(m);
      });
      if (!v.user){ v.a = -0.42 + 0.18 * Math.sin(t * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, d = dims(), T = Tk(), kT = KB * T, xp = xw();
      outT.innerHTML = (T < 10 ? zN(T, 2) : T < 100 ? zN(T, 1) : zN(T, 0)) + " <i>K</i>";
      var qa = gb1D(kT / d.ea), qL = gb1D(kT / d.eL);
      var Ex = d.ea * qa.n2, EL = d.eL * qL.n2, Em = 2 * Ex + EL, F = 2 * EL / (d.L * 1e-9);
      var ratio = 2 * EL / kT, E111 = 2 * d.ea + d.eL, UEV = 1e6 / QE;   /* J → µeV */
      /* niveaux : couleur selon le rang d'énergie parmi les premiers niveaux distincts */
      function lvl(n){ return (n[0] * n[0] + n[1] * n[1]) * d.ea + n[2] * n[2] * d.eL; }
      /* ================= scène : boîte à piston ================= */
      zlab(ctx, W, H, "#1d2638", "#090d17");
      var X0 = -1.6, A = GB_A, xh = xp + 2.0, span = xh + 0.3 - X0;
      v.sc = Math.min(W / (span + (phone ? 1.6 : 2.6)), H / 5.0); v.cx = W / 2; v.cy = H * 0.52; v.clear();
      var qc = v.p((X0 + xh) / 2, 0, 0); v.cx += W / 2 - qc.x;
      v.box(X0 - 0.8, -A - 0.45, -A - 0.6, xh + 0.5, -A - 0.25, A + 0.6, "#5a4232", {cols:[null, null, null, "#6e5240"]});
      v.render(ctx); v.clear();
      var P8 = [[X0, -A, -A], [xp, -A, -A], [xp, A, -A], [X0, A, -A], [X0, -A, A], [xp, -A, A], [xp, A, A], [X0, A, A]];
      var PP = P8.map(function(p){ return v.p(p[0], p[1], p[2]); }), zc = v.p((X0 + xp) / 2, 0, 0).z;
      ctx.save(); ctx.fillStyle = "rgba(160,200,240,0.08)";
      [[0, 3, 7, 4], [0, 1, 5, 4], [3, 2, 6, 7], [0, 1, 2, 3], [4, 5, 6, 7]].forEach(function(fc){ ctx.beginPath(); fc.forEach(function(j, q){ if (q) ctx.lineTo(PP[j].x, PP[j].y); else ctx.moveTo(PP[j].x, PP[j].y); }); ctx.closePath(); ctx.fill(); });
      ctx.restore();
      var EDG = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      function edges(front){
        ctx.save(); ctx.lineWidth = front ? 2.2 : 1.3; ctx.strokeStyle = front ? "rgba(205,225,250,.75)" : "rgba(160,185,215,.35)";
        EDG.forEach(function(e){ var a = PP[e[0]], b = PP[e[1]]; if (((a.z + b.z) / 2 > zc) !== front) return; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
        ctx.restore();
      }
      edges(false);
      /* rang des niveaux (pour la couleur) */
      var Ls = [], seen = {};
      for (var nx = 1; nx <= 3; nx++) for (var ny = 1; ny <= 3; ny++) for (var nz = 1; nz <= 4; nz++){ var e = lvl([nx, ny, nz]), key = e.toPrecision(9); if (!seen[key]){ seen[key] = 1; Ls.push(e); } }
      Ls.sort(function(p, q){ return p - q; });
      var cont = PI / 6 * Math.pow(Math.max(6 * kT, 2.6 * E111) / d.ea, 1.5) * lS.value > 60;
      function rank(n){ if (cont) return -1; var e = lvl(n); for (var j = 0; j < 5; j++) if (e <= Ls[j] * (1 + 1e-9)) return j; return 5; }
      var Q = M.map(function(m){ var q = v.p(m.p[0], m.p[1], m.p[2]); q.m = m; return q; }).sort(function(p, q){ return p.z - q.z; });
      Q.forEach(function(q){
        var rk = rank(q.m.n), col = rk < 0 ? "#6fb0ff" : GB_COL[rk], r = 0.2 * v.sc * q.s;
        zglow(ctx, q.x, q.y, r * 2.4, col, 0.35 + 0.4 * q.m.fl);
        zball(ctx, q.x, q.y, r, col);
      });
      /* piston : plaque, tige, poignée */
      v.box(xp, -A + 0.02, -A + 0.02, xp + 0.22, A - 0.02, A - 0.02, "#9aa6b6");
      v.cyl([xp + 0.22, 0, 0], [xh, 0, 0], 0.12, 14, "#c3ccd8");
      v.cyl([xh, 0, 0], [xh + 0.25, 0, 0], 0.42, 18, "#c2453d");
      v.render(ctx); v.clear();
      edges(true);
      /* force sur le piston : flèche + éclats des chocs */
      var pc = v.p(xp, 0, 0), pu = v.p(xp + 1, 0, 0);
      PIST = {x:v.p(xp + 0.1, 0, 0).x, y:pc.y, r:Math.max(28, 0.9 * v.sc), ux:(pu.x - pc.x), uy:(pu.y - pc.y)};
      M.forEach(function(m){ if (m.hit > 0.05){ var q = v.p(xp, m.p[1], m.p[2]); zglow(ctx, q.x, q.y, 14 * m.hit, [255, 230, 150], 0.8 * m.hit); } });
      var fl = Math.max(0.35, Math.min(2.2, 0.9 * Math.pow(ratio, 0.5)));
      var fa = v.p(xp + 0.25 + 0.9 * fl, A + 0.35, 0), fb = v.p(xp + 0.25, A + 0.35, 0);
      S.draw.arrow(c, fb.x, fb.y, fa.x, fa.y, "#ffd166", 3);
      ztag(S, c, "F = " + zsci(F * 1e15, 2) + " fN", fa.x, Math.max(42, fa.y - 16), {size:11.5, color:"#ffd166"});
      ztag(S, c, "a = " + zN(d.a, 1) + " nm · L = " + zN(d.L, 2) + " nm · hélium 4", W / 2, H - 16, {size:phone ? 10.5 : 11.5, color:"#d8e4f6"});
      ztag(S, c, (phone ? "atomes sans interactions" : "atomes un par un, sans interactions") + (T < 4.2 ? (phone ? " · He réel liquide sous 4,2 K" : " · l'hélium réel serait liquide (sous 4,2 K)") : ""), W / 2, H - 38, {size:10, color:T < 4.2 ? "#ffcf8a" : "#c4d0e2", weight:600});
      zT(S, c, "attrape le piston · glisse ailleurs pour tourner", W - 10, 14, {size:zfz(c, 10.5), color:"rgba(210,222,240,.75)", align:"right", weight:600});

      /* ================= graphes ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var p1, p2;
      if (phone){ p1 = [6, 6, FW - 12, 250]; p2 = [6, 262, FW - 12, FH - 268]; }
      else { p1 = [6, 6, (FW - 18) * 0.52, FH - 12]; p2 = [12 + (FW - 18) * 0.52, 6, (FW - 18) * 0.48, FH - 12]; }
      /* --- échelle des niveaux --- */
      zpanel(S, f, p1[0], p1[1], p1[2], p1[3], "Niveaux d'un atome et populations");
      var Emax = Math.max(6 * kT, 2.6 * E111), x0 = p1[0] + 48, x1 = p1[0] + p1[2] - 70, y0 = p1[1] + 34, y1 = p1[1] + p1[3] - 12;
      function Ye(E){ return y1 - E / Emax * (y1 - y0); }
      var nStates = PI / 6 * Math.pow(Emax / d.ea, 1.5) * lS.value;
      var Z = qa.z * qa.z * qL.z;
      if (nStates < 1500){
        var LV = {}, list = [];
        var nxm = Math.floor(Math.sqrt(Emax / d.ea)) + 1, nzm = Math.floor(Math.sqrt(Emax / d.eL)) + 1;
        for (nx = 1; nx <= nxm; nx++) for (ny = 1; ny <= nxm; ny++) for (nz = 1; nz <= nzm; nz++){
          var E = lvl([nx, ny, nz]); if (E > Emax) continue;
          var kk = E.toPrecision(9); if (!LV[kk]){ LV[kk] = {E:E, g:0, n:[nx, ny, nz]}; list.push(LV[kk]); } LV[kk].g++;
        }
        list.sort(function(p, q){ return p.E - q.E; });
        var pmx = 0; list.forEach(function(l){ l.p = l.g * Math.exp(-(l.E - E111) / kT); pmx = Math.max(pmx, l.p); });
        var dense = list.length > 60;
        list.forEach(function(l, j){
          var y = Ye(l.E), col = GB_COL[Math.min(5, j)];
          g.save(); g.strokeStyle = dense ? "rgba(120,135,160,.35)" : "#9aa6b6"; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
          g.strokeStyle = dense ? "#2f6fd6" : col; g.lineWidth = dense ? 1.2 : 4; g.lineCap = "round";
          g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + (x1 - x0) * l.p / pmx, y); g.stroke(); g.restore();
        });
        /* étiquettes des premiers niveaux, sans chevauchement */
        var lastY = 1e9;
        list.slice(0, 6).forEach(function(l, j){
          var y = Ye(l.E); if (lastY - y < 13 || dense) return; lastY = y;
          var lab = "(" + l.n.join(",") + ")" + (l.g > 1 ? " ×" + l.g : "");
          zT(S, f, lab, x1 + 6, y, {size:zfz(f, 9.5), color:"#3c4a5e", align:"left", weight:700});
        });
        if (dense) zT(S, f, list.length + " niveaux : presque continu", (x0 + x1) / 2, y0 + 4, {size:zfz(f, 9.5), color:"#2f6fd6", weight:800, bg:"rgba(255,255,255,.9)"});
      } else {
        /* continuum : densité √E·e^(−E/k_BT) */
        var pts = [], mx = 0, NB = 120;
        for (i = 0; i <= NB; i++){ var Ei = Emax * i / NB, pp = Ei > E111 ? Math.sqrt(Ei - E111) * Math.exp(-(Ei - E111) / kT) : 0; pts.push(pp); mx = Math.max(mx, pp); }
        g.save(); g.beginPath(); g.moveTo(x0, y1);
        for (i = 0; i <= NB; i++) g.lineTo(x0 + (x1 - x0) * pts[i] / mx, Ye(Emax * i / NB));
        g.lineTo(x0, y0); g.closePath(); var gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, "rgba(47,111,214,.55)"); gr.addColorStop(1, "rgba(47,111,214,.15)"); g.fillStyle = gr; g.fill(); g.restore();
        g.save(); g.strokeStyle = "rgba(120,135,160,.25)"; for (i = 0; i <= 60; i++){ var yy = y0 + (y1 - y0) * i / 60; g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); } g.restore();
        zT(S, f, "≈ " + zbig(Math.log10(nStates), 1) + " états : quasi continu", (x0 + x1) / 2, y0 + 4, {size:zfz(f, 9.5), color:"#2f6fd6", weight:800, bg:"rgba(255,255,255,.9)"});
      }
      /* repères k_BT et ⟨E⟩ */
      var yk = Ye(kT), ym = Ye(Em), sep = Math.abs(yk - ym) < 13 ? (yk > ym ? 7 : -7) : 0;
      [[kT, "k_BT", "#d0504f", sep], [Em, "E moy.", "#13233a", -sep]].forEach(function(p){
        if (p[0] > Emax) return;
        var y = Ye(p[0]);
        g.save(); g.strokeStyle = p[2]; g.setLineDash([5, 4]); g.lineWidth = 1.4; g.beginPath(); g.moveTo(x0 - 4, y); g.lineTo(x1, y); g.stroke(); g.restore();
        zT(S, f, p[1], x0 - 6, y + p[3], {size:zfz(f, 9.5), color:p[2], align:"right", weight:800});
      });
      /* --- isotherme : force sur le piston selon L --- */
      zpanel(S, f, p2[0], p2[1], p2[2], p2[3], "Isotherme : pression selon L / a");
      var u0 = p2[0] + 34, u1 = p2[0] + p2[2] - 12, w0 = p2[1] + 46, w1 = p2[1] + p2[3] - 24;
      var Pq = [], Pc = [], top = 0;
      for (i = 0; i <= 70; i++){
        var r = 0.25 + 1.75 * i / 70, eL = gbEps(d.a * r), qq = gb1D(kT / eL);
        var pq = 2 * eL * qq.n2 / kT / r, pc = 1 / r;   /* en unités de k_BT/a³ */
        Pq.push([r, pq]); Pc.push([r, pc]); top = Math.max(top, pq);
      }
      top = Math.min(top, Math.max(5, 2.2 * 2 * EL / kT / lS.value));
      top = Math.max(4.2, top) * 1.05;
      function U(r){ return u0 + (r - 0.25) / 1.75 * (u1 - u0); }
      function V(p){ return w1 - p / top * (w1 - w0); }
      g.save(); g.strokeStyle = "#b8c2d0"; g.beginPath(); g.moveTo(u0, w1); g.lineTo(u1, w1); g.moveTo(u0, w0 - 6); g.lineTo(u0, w1); g.stroke(); g.restore();
      [0.25, 1, 2].forEach(function(r){ zT(S, f, zN(r, 2), U(r), w1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:700}); });
      zT(S, f, "L / a", (u0 + u1) / 2 + 26, w1 + 11, {size:zfz(f, 9.5), color:"#5f6b7a", weight:800});
      zT(S, f, "P", u0 - 8, w0, {size:zfz(f, 10), color:"#5f6b7a", align:"right", weight:800});
      g.save(); g.beginPath(); g.rect(u0, w0 - 8, u1 - u0 + 4, w1 - w0 + 8); g.clip();
      zpoly(g, Pc.map(function(p){ return [U(p[0]), V(p[1])]; }), "#7a8596", 2, [6, 4]);
      zpoly(g, Pq.map(function(p){ return [U(p[0]), V(p[1])]; }), "#2f6fd6", 2.6);
      g.restore();
      var pnow = ratio / lS.value;
      g.fillStyle = "#2f6fd6"; g.beginPath(); g.arc(U(lS.value), V(pnow), 5, 0, TAU); g.fill();
      g.fillStyle = "#7a8596"; g.beginPath(); g.arc(U(lS.value), V(1 / lS.value), 3.5, 0, TAU); g.fill();
      zT(S, f, "— quantique", p2[0] + 10, p2[1] + 30, {size:zfz(f, 9.5), color:"#2f6fd6", align:"left", weight:800});
      zT(S, f, "- - N k_BT/V", p2[0] + p2[2] - 10, p2[1] + 30, {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:800});
      /* ---- afficheurs ---- */
      ro.set(0, zsci(E111 * UEV, 2) + " µeV");
      var r1 = Em / (1.5 * kT); ro.set(1, r1 < 10 ? zF(r1, 3) : zsci(r1, 2));
      ro.set(2, zsci(F * 1e15, 2) + " fN");
      ro.set(3, ratio < 10 ? zF(ratio, 3) : zsci(ratio, 2));
      var gap = (lvl([1, 1, 2]) < lvl([2, 1, 1]) ? lvl([1, 1, 2]) : lvl([2, 1, 1])) - E111;
      nt.set("Premier écart E₂ − E₁ = " + zsci(gap * UEV, 2) + " µeV, soit " + zsci(gap / kT, 2) + " k_BT : " +
        (gap / kT > 0.5 ? "les niveaux sont bien séparés, l'atome reste surtout dans les premiers et P·V/(N k_BT) dépasse 1." : gap / kT > 0.02 ? "les niveaux se resserrent, on s'approche du gaz parfait." : "l'échelle est quasi continue : on retrouve P·V = N k_BT.") +
        " Ici, les atomes sont traités un par un, sans interactions" + (T < 4.2 ? " ; l'hélium réel se liquéfie sous 4,2 K (à 1 bar)." : "."), gap / kT > 0.5 ? "warn" : "ok");
    });
  }
});
})();
