/* Physique quantique · lot Q5 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-zeeman · pq-addition-moments-cinetiques · pq-structure-fine-hyperfine-21cm (pq08)
   pq-helium-ortho-para · pq-effet-ecran · pq-hund-magnetisme (pq09)
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

/* ---------- aides propres au lot Q5 ---------- */
var MUB_EV = 5.7883818060e-5, H_EVS = 4.135667696e-15, HC_EVNM5 = 1239.84198, GS = 2.00231930436;
function zfact(n){ var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
/* coefficient de Clebsch-Gordan <j1 m1 ; j2 m2 | J M> (formule de Racah) */
function zcg(j1, m1, j2, m2, J, M){
  if (Math.abs(m1 + m2 - M) > 1e-9 || J < Math.abs(j1 - j2) - 1e-9 || J > j1 + j2 + 1e-9) return 0;
  if (Math.abs(m1) > j1 + 1e-9 || Math.abs(m2) > j2 + 1e-9 || Math.abs(M) > J + 1e-9) return 0;
  function f(x){ return zfact(Math.round(x)); }
  var pre = Math.sqrt((2 * J + 1) * f(J + j1 - j2) * f(J - j1 + j2) * f(j1 + j2 - J) / f(j1 + j2 + J + 1)) *
    Math.sqrt(f(J + M) * f(J - M) * f(j1 - m1) * f(j1 + m1) * f(j2 - m2) * f(j2 + m2));
  var s = 0;
  for (var k = 0; k <= 40; k++){
    var a = [k, j1 + j2 - J - k, j1 - m1 - k, j2 + m2 - k, J - j2 + m1 + k, J - j1 - m2 + k];
    if (a.some(function(v){ return v < -1e-9; })) continue;
    var d = 1; a.forEach(function(v){ d *= f(v); });
    s += (k % 2 ? -1 : 1) / d;
  }
  return pre * s;
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
   ===================================================================== */
/* raies : λ dans l'air (nm), niveau haut (J, g), niveau bas (J, g) */
var ZM = {
  cd:{nom:"Cd 643,8 nm", lampe:"lampe à cadmium", lam:643.847, Ju:2, gu:1, Jl:1, gl:1, hi:"5s5d ¹D₂", lo:"5s5p ¹P₁", type:"normal"},
  d1:{nom:"Na D₁ 589,6 nm", lampe:"lampe à sodium", lam:589.592, Ju:0.5, gu:2 / 3, Jl:0.5, gl:2, hi:"3p ²P₁/₂", lo:"3s ²S₁/₂", type:"anomal"},
  d2:{nom:"Na D₂ 589,0 nm", lampe:"lampe à sodium", lam:588.995, Ju:1.5, gu:4 / 3, Jl:0.5, gl:2, hi:"3p ²P₃/₂", lo:"3s ²S₁/₂", type:"anomal"},
  h:{nom:"H : niveau 1s", lampe:"atomes d'hydrogène", lam:0, Ju:0.5, gu:GS, Jl:0, gl:0, hi:"1s ²S₁/₂", lo:"", type:"spin"}
};
var ZM_BMAX = 2;
function zmM(J){ var a = []; for (var m = J; m >= -J - 1e-9; m -= 1) a.push(m); return a; }
/* composantes : {Mu, Ml, q, dE (en μB·B), s (force relative, observation comprise)} */
function zmComps(L, obs){
  var out = [];
  zmM(L.Ju).forEach(function(Mu){ zmM(L.Jl).forEach(function(Ml){
    var q = Math.round(Mu - Ml); if (Math.abs(q) > 1) return;
    var c = zcg(L.Jl, Ml, 1, q, L.Ju, Mu), s = c * c * (obs === "perp" ? (q === 0 ? 1 : 0.5) : (q === 0 ? 0 : 1));
    out.push({Mu:Mu, Ml:Ml, q:q, dE:L.gu * Mu - L.gl * Ml, s:s});
  }); });
  var mx = 0; out.forEach(function(o){ mx = Math.max(mx, o.s); }); out.forEach(function(o){ o.s = mx > 0 ? o.s / mx : 0; });
  return out;
}
/* raies distinctes : regroupe les composantes de même dE */
function zmLines(cs){
  var L = [];
  cs.forEach(function(o){
    if (o.s < 1e-9) return;
    var f = L.filter(function(l){ return Math.abs(l.dE - o.dE) < 1e-9; })[0];
    if (f){ f.s += o.s; f.list.push(o); } else L.push({dE:o.dE, s:o.s, q:o.q, list:[o]});
  });
  var mx = 0; L.forEach(function(l){ mx = Math.max(mx, l.s); }); L.forEach(function(l){ l.s /= mx; });
  return L.sort(function(a, b){ return a.dE - b.dE; });
}
var ZM_COL = {"0":"#f2c14e", "1":"#5ab8f5", "-1":"#f07a7a"};

SFA.sim({
  id:"pq-zeeman", ch:"pq08", tag:"Spin",
  titre:"Effet Zeeman : un niveau qui se divise dans un aimant",
  resume:"Une lampe entre les pôles d'un électroaimant : chaque niveau se coupe en sous-niveaux et la raie se divise au spectroscope.",
  but:"Monte le champ B (curseur ou glisse dans le diagramme) et regarde la raie se diviser. Change de raie, observe le long de B, clique une composante pour voir ses transitions. Glisse sur la scène pour tourner autour de l'aimant.",
  aRetenir:"Dans un champ B, un niveau J se coupe en 2J + 1 sous-niveaux écartés de g·μ_B·B : un nombre pair de sous-niveaux trahit un spin demi-entier.",
  piege:"Le 1s de l'hydrogène (ℓ = 0) devrait rester un seul niveau sans spin : il se coupe pourtant en deux.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 300 : 340), f = k.canvas(phone ? 440 : 300);
    var raie = "cd", obs = "perp", sel = null;
    k.seg("Raie observée", [["cd", "Cd rouge (normal)"], ["d1", "Na D₁"], ["d2", "Na D₂"], ["h", "H : 1s"]], "cd", function(v){ raie = v; sel = null; });
    var bS = k.slider("Champ magnétique B", 0, ZM_BMAX, 0.05, 1, "T");
    var oS = k.seg("Observation", [["perp", "Perpendiculaire à B"], ["par", "Le long de B"]], "perp", function(v){ obs = v; sel = null; });
    var ro = k.readouts(["μ_B·B", "Composantes vues", "Écart extrême Δλ", "g haut / g bas"]);
    var nt = k.note("", "ok");
    var v = new Z3(); v.a = 0.62; v.b = 0.42; v.f = 18; v.set();
    zorbit(c, v, k, [0.05, 1.1]);
    var ph = [], acc = 0, tCyc = 0, GEO = null, dragB = false;
    /* ---- souris dans le diagramme : glisser dans l'éventail règle B ; clic sur une composante ---- */
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO) return;
      var inFan = p.x >= GEO.fx0 - 6 && p.x <= GEO.fx1 + 6 && p.y >= GEO.fy0 && p.y <= GEO.fy1;
      if (type === "down"){
        if (inFan){ dragB = true; setB(p.x); return; }
        var hit = null;
        (GEO.hits || []).forEach(function(h){ if (Math.abs(p.x - h.x) < 9 && p.y >= h.y0 && p.y <= h.y1) hit = h; });
        sel = hit ? (sel === hit.key ? null : hit.key) : null; k.redraw();
      }
      if (type === "drag" && dragB) setB(p.x);
      if (type === "move"){ var on = inFan || (GEO.hits || []).some(function(h){ return Math.abs(p.x - h.x) < 9 && p.y >= h.y0 && p.y <= h.y1; }); f.cv.style.cursor = on ? (inFan ? "ew-resize" : "pointer") : "default"; }
      if (type === "up") dragB = false;
    });
    function setB(x){ var b = (x - GEO.fx0) / (GEO.fx1 - GEO.fx0) * ZM_BMAX; bS.set(Math.round(Math.max(0, Math.min(ZM_BMAX, b)) / 0.05) * 0.05); k.redraw(); }
    var lp = k.loop(function(dt, t){
      tCyc += dt; acc += dt * 9;
      while (acc >= 1){ acc -= 1; ph.push({s:0, o:Math.random()}); }
      for (var i = ph.length - 1; i >= 0; i--){ ph[i].s += dt * 0.7; if (ph[i].s >= 1) ph.splice(i, 1); }
      if (!v.user){ v.a = 0.62 + 0.22 * Math.sin(t * 0.22); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var L = ZM[raie], B = bS.value, ctx = c.ctx, W = c.W, H = c.H, i, t = tCyc;
      var cs = raie === "h" ? [] : zmComps(L, obs), lines = zmLines(cs);
      var lc = raie === "h" ? [255, 150, 200] : zwl(L.lam);
      /* ================= scène 3D ================= */
      zlab(ctx, W, H, "#212c44", "#0a0f1b");
      v.sc = phone ? Math.min(W / 7.6, H / 4.4) : Math.min(W / 9, H / 4.9); v.cx = W * 0.5; v.cy = H * 0.47; v.clear();
      v.box(-3.7, -1.95, -1.7, 3.9, -1.78, 3.2, "#7a5232", {cols:[null, null, null, "#9c6b40"]});
      var fe = "#5d6672", cu = "#b8733a";
      v.box(-2.5, -1.78, -0.62, 2.5, -1.2, 0.62, fe);
      v.box(-2.5, -1.2, -0.62, -1.85, 0.62, 0.62, fe); v.box(1.85, -1.2, -0.62, 2.5, 0.62, 0.62, fe);
      var bored = obs === "par";
      [-1, 1].forEach(function(sg){
        v.cyl([sg * 1.85, 0, 0], [sg * 0.75, 0, 0], 0.5, 18, "#7d8794");
        v.cyl([sg * 1.72, 0, 0], [sg * 0.95, 0, 0], 0.82, 22, cu, {cap0:"#8a5328", cap1:"#d08a4c"});
        v.cyl([sg * 0.75, 0, 0], [sg * 0.3, 0, 0], 0.5, 18, "#9aa4b0", {r1:0.3, cap1:bored && sg > 0 ? "#1b1f26" : "#b9c2cc"});
      });
      /* lampe : tube de verre lumineux */
      var lcol = "rgb(" + lc.join(",") + ")";
      v.cyl([0, -1.2, 0], [0, -0.85, 0], 0.2, 12, "#2c3340");
      v.sprite(0, 0, 0, function(g, q){
        var a = v.p(0, -0.85, 0), b = v.p(0, 0.85, 0), wq = 0.12 * v.sc * q.s;
        zglow(g, q.x, q.y, 0.95 * v.sc * q.s * (0.92 + 0.08 * Math.sin(t * 9)), lc, 0.5);
        g.save(); g.lineCap = "round"; g.strokeStyle = "rgba(220,235,255,.35)"; g.lineWidth = wq * 2 + 3; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        g.strokeStyle = za(lc, 0.95); g.lineWidth = wq * 2; g.stroke();
        g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = wq * 0.6; g.stroke(); g.restore();
      });
      /* spectroscope : le long de z (perpendiculaire) ou derrière le pôle percé (le long de B) */
      var sp = bored ? [[2.6, 0, 0], [3.3, 0, 0]] : [[0, 0, 1.3], [0, 0, 2.15]];
      v.cyl(sp[0], sp[1], 0.14, 12, "#2f3a4b", {cap0:"#9fd0ff"});
      if (bored){ v.box(3.3, -0.4, -0.42, 3.95, 0.4, 0.42, "#39465a"); v.cyl([3.6, 0, 0.3], [3.6, 0, 1.25], 0.13, 12, "#2f3a4b"); v.cyl([3.6, 0, 1.25], [3.6, 0, 1.5], 0.08, 10, "#141922"); v.box(3.35, -1.78, -0.25, 3.9, -0.4, 0.25, "#4a5566"); }
      else { v.box(-0.42, -0.4, 2.15, 0.42, 0.4, 2.85, "#39465a"); v.cyl([-0.3, 0, 2.5], [-1.25, 0, 3.0], 0.13, 12, "#2f3a4b"); v.cyl([-1.25, 0, 3.0], [-1.47, 0, 3.12], 0.08, 10, "#141922"); v.box(-0.25, -1.78, 2.25, 0.25, -0.4, 2.75, "#4a5566"); }
      /* faisceau et photons */
      var b0 = bored ? [0.12, 0, 0] : [0, 0, 0.12], b1 = bored ? [2.6, 0, 0] : [0, 0, 1.3];
      ph.forEach(function(p){
        var x = b0[0] + (b1[0] - b0[0]) * p.s, z = b0[2] + (b1[2] - b0[2]) * p.s;
        v.sprite(x, (p.o - 0.5) * 0.12, z, function(g, q){ zglow(g, q.x, q.y, 9 * q.s, lc, 0.85); });
      });
      /* lignes de champ entre les pôles (tirets qui défilent) */
      if (B > 0){
        v.sprite(0, 0.42, 0, function(g){
          g.save(); g.lineWidth = 1.4; g.setLineDash([6, 5]); g.lineDashOffset = -t * 30 * (0.3 + B / ZM_BMAX);
          g.strokeStyle = "rgba(140,200,255," + (0.25 + 0.35 * B / ZM_BMAX) + ")";
          [[-0.22, -0.2], [0.22, -0.2], [-0.22, 0.2], [0.22, 0.2], [0, 0.3], [0, -0.3]].forEach(function(o){
            var a = v.p(-0.3, o[0], o[1]), b = v.p(0.3, o[0], o[1]); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); });
          g.restore();
        });
      }
      v.render(ctx);
      /* flèche B et étiquettes */
      var pa = v.p(-0.3, 1.05, 0), pb = v.p(0.3, 1.05, 0);
      if (B > 0) S.draw.arrow(c, pa.x, pa.y, pb.x, pb.y, "#8cc8ff", 2.4);
      zT(S, c, "B = " + zN(B, 2) + " T", (pa.x + pb.x) / 2, pa.y - 19, {size:zfz(c, 12.5), color:"#cfe6ff", weight:800});
      var lt = v.p(0, -1.3, 0);
      ztag(S, c, L.lampe, lt.x, lt.y + 12, {size:11, color:lcol});
      var em = v.p(-2.2, 1.0, 0); ztag(S, c, "électroaimant", em.x, em.y, {size:11});
      var se = bored ? v.p(3.6, 0.75, 0) : v.p(0, -0.15, 3.1);
      ztag(S, c, raie === "h" ? "détecteur micro-ondes" : bored ? "spectroscope (pôle percé)" : "spectroscope", se.x, se.y, {size:11});
      zT(S, c, "glisse pour tourner", W - 10, 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});

      /* ================= diagramme d'énergie + spectre ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var dx0 = 8, dx1 = phone ? FW - 8 : FW * 0.56, dy0 = 6, dy1 = phone ? FH * 0.6 : FH - 6;
      var sx0 = phone ? 8 : FW * 0.56 + 10, sx1 = FW - 8, sy0 = phone ? FH * 0.6 + 6 : 6, sy1 = FH - 6;
      g.save(); zrr(g, dx0, dy0, dx1 - dx0, dy1 - dy0, 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore();
      zT(S, f, "Niveaux d'énergie", dx0 + 10, dy0 + 13, {size:zfz(f, 12), color:"#13233a", align:"left"});
      /* éventail : B en abscisse */
      var fx0 = dx0 + 34, fx1 = dx0 + (dx1 - dx0) * 0.42, fy0 = dy0 + 28, fy1 = dy1 - 22;
      var lx0 = fx1 + 18, lx1 = dx1 - 44;
      var two = raie !== "h", hBlk = two ? (fy1 - fy0) * 0.36 : (fy1 - fy0) * 0.7;
      var yU = two ? fy0 + hBlk / 2 + 4 : (fy0 + fy1) / 2, yL = fy1 - hBlk / 2 - 4;
      var emax = Math.max(L.gu * L.Ju, L.gl * L.Jl) * ZM_BMAX, sc = hBlk / 2 / emax;
      GEO = {fx0:fx0, fx1:fx1, fy0:fy0, fy1:fy1, hits:[]};
      function bx(b){ return fx0 + b / ZM_BMAX * (fx1 - fx0); }
      g.save(); g.strokeStyle = "#b8c2d0"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(fx0, fy1 + 2); g.lineTo(fx1, fy1 + 2); g.stroke();
      for (i = 0; i <= ZM_BMAX; i++){ g.beginPath(); g.moveTo(bx(i), fy1 + 2); g.lineTo(bx(i), fy1 + 6); g.stroke(); zT(S, f, i === ZM_BMAX ? i + " T" : String(i), bx(i), fy1 + 13, {size:zfz(f, 10), color:"#5f6b7a", weight:600}); }
      zT(S, f, "B", fx0 - 14, fy1 + 13, {size:zfz(f, 10.5), color:"#5f6b7a", weight:800});
      g.restore();
      /* curseur B */
      g.save(); g.strokeStyle = "rgba(47,111,214,.35)"; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(bx(B), fy0 - 4); g.lineTo(bx(B), fy1); g.stroke(); g.restore();
      function fan(J, gg, yc, lab, col){
        var Ms = J === 0 ? [0] : zmM(J);
        Ms.forEach(function(M){
          g.save(); g.strokeStyle = col; g.lineWidth = 1.6;
          g.beginPath(); g.moveTo(bx(0), yc); g.lineTo(bx(ZM_BMAX), yc - gg * M * ZM_BMAX * sc); g.stroke();
          var yb = yc - gg * M * B * sc; g.lineWidth = 2.6; g.beginPath(); g.moveTo(lx0, yb); g.lineTo(lx1, yb); g.stroke();
          g.setLineDash([2, 3]); g.lineWidth = 1; g.beginPath(); g.moveTo(bx(B), yb); g.lineTo(lx0, yb); g.stroke(); g.restore();
        });
        /* étiquettes M à droite, espacées */
        var ys = Ms.map(function(M){ return yc - gg * M * B * sc; }), minGap = 12;
        var spread = Ms.length > 1 && Math.abs(ys[0] - ys[1]) < minGap;
        Ms.forEach(function(M, j){
          var yy = spread ? yc + (j - (Ms.length - 1) / 2) * minGap : ys[j];
          if (Ms.length > 1) zT(S, f, (raie === "h" ? "m_s " : "M ") + zsgn(M), lx1 + 4, yy, {size:zfz(f, 10), color:"#3c4a5e", align:"left", weight:700});
        });
        zT(S, f, lab, dx0 + 10, yc - hBlk / 2 - 4, {size:zfz(f, 10.5), color:"#13233a", align:"left", weight:800});
      }
      if (two){
        fan(L.Ju, L.gu, yU, L.hi, "#2f6fd6"); fan(L.Jl, L.gl, yL, L.lo, "#1f8a5b");
        /* axe coupé */
        var ym = (yU + hBlk / 2 + yL - hBlk / 2) / 2;
        zT(S, f, "≈ " + zN(HC_EVNM5 / L.lam, 3) + " eV", (fx0 + fx1) / 2, ym - 8, {size:zfz(f, 10), color:"#8792a2", weight:700, bg:"rgba(255,255,255,.94)"});
        zT(S, f, "plus haut", (fx0 + fx1) / 2, ym + 8, {size:zfz(f, 10), color:"#8792a2", weight:700, bg:"rgba(255,255,255,.94)"});
        /* transitions : flèches entre sous-niveaux au champ B */
        var vis = cs.filter(function(o){ return o.s > 1e-9; }), nA = vis.length, aw = (lx1 - lx0) / (nA + 1);
        var cur = nA ? Math.floor(t / 0.7) % nA : -1;
        vis.forEach(function(o, j){
          var x = lx0 + aw * (j + 1), y1 = yU - L.gu * o.Mu * B * sc, y2 = yL + L.gl * (-o.Ml) * B * sc;
          var key = zN(o.dE, 4), on = sel == null ? j === cur : sel === key;
          g.save(); g.globalAlpha = sel != null && sel !== key ? 0.18 : on ? 1 : 0.55;
          S.draw.arrow(f, x, y1 + 2, x, y2 - 2, ZM_COL[String(o.q)], on ? 2.6 : 1.6); g.restore();
        });
        zT(S, f, "π", lx0 + 4, dy1 - 9, {size:zfz(f, 11), color:"#b88a1a", align:"left", weight:800});
        zT(S, f, "σ⁺", lx0 + 26, dy1 - 9, {size:zfz(f, 11), color:"#2f8fd6", align:"left", weight:800});
        zT(S, f, "σ⁻", lx0 + 52, dy1 - 9, {size:zfz(f, 11), color:"#d0504f", align:"left", weight:800});
      } else {
        fan(L.Ju, L.gu, yU, L.hi, "#2f6fd6");
        g.save(); g.setLineDash([5, 4]); g.strokeStyle = "rgba(120,130,145,.6)"; g.beginPath(); g.moveTo(fx0, yU); g.lineTo(lx1, yU); g.stroke(); g.restore();
        zT(S, f, "sans spin (ℓ = 0) : un seul niveau", (fx0 + lx1) / 2, yU + hBlk / 2 + 8, {size:zfz(f, 10), color:"#7a8596", weight:700});
        var yA = yU - L.gu * 0.5 * B * sc, yB = yU + L.gu * 0.5 * B * sc, xa = (lx0 + lx1) / 2;
        if (B > 0.05) S.draw.arrow(f, xa, yB - 1, xa, yA + 1, "#c0504f", 2.2);
      }
      zT(S, f, "écarts agrandis", dx1 - 8, dy0 + 13, {size:zfz(f, 10), color:"#8792a2", align:"right", weight:700});
      /* ---- spectre (oculaire) ---- */
      g.save(); zrr(g, sx0, sy0, sx1 - sx0, sy1 - sy0, 10); var gs = g.createLinearGradient(0, sy0, 0, sy1); gs.addColorStop(0, "#0c1424"); gs.addColorStop(1, "#05080f"); g.fillStyle = gs; g.fill(); g.restore();
      var px0 = sx0 + 12, px1 = sx1 - 12, py0 = sy0 + 42, py1 = sy1 - 34;
      if (raie !== "h"){
        zT(S, f, "Raie vue au spectroscope", sx0 + 10, sy0 + 13, {size:zfz(f, 12), color:"#e7eefb", align:"left"});
        var dmax = 0; lines.forEach(function(l){ dmax = Math.max(dmax, Math.abs(l.dE)); });
        var lam2 = L.lam * L.lam / HC_EVNM5 * MUB_EV * 1e3;  /* pm par (μB·T) */
        var Wpm = Math.max(1, (raie === "cd" ? 1 : raie === "d1" ? 4 / 3 : 5 / 3) * lam2 * ZM_BMAX * 1.22);
        function X(pm){ return (px0 + px1) / 2 + pm / Wpm * (px1 - px0) / 2; }
        /* profil : somme de gaussiennes (largeur Doppler ≈ 1,5 pm) */
        var sig = 1.5, NS = 220, prof = [], pmx = 0;
        for (i = 0; i <= NS; i++){
          var pm = -Wpm + 2 * Wpm * i / NS, s = 0;
          lines.forEach(function(l){ var c0 = -l.dE * lam2 * B; s += l.s * Math.exp(-Math.pow(pm - c0, 2) / (2 * sig * sig)); });
          prof.push(s); pmx = Math.max(pmx, s);
        }
        g.save(); g.globalCompositeOperation = "lighter";
        lines.forEach(function(l){
          var x = X(-l.dE * lam2 * B), hh = (py1 - py0) * (0.25 + 0.75 * l.s), key = zN(l.dE, 4), on = sel == null || sel === key;
          var gr = g.createLinearGradient(0, py1 - hh, 0, py1); gr.addColorStop(0, za(lc, 0)); gr.addColorStop(0.3, za(lc, on ? 0.9 : 0.25)); gr.addColorStop(1, za(lc, on ? 1 : 0.3));
          g.fillStyle = gr; g.fillRect(x - 2.2, py1 - hh, 4.4, hh);
          zglow(g, x, py1 - hh * 0.45, 14, lc, on ? 0.35 : 0.08);
          GEO.hits.push({x:x, y0:py0 - 10, y1:py1 + 30, key:key});
        });
        g.restore();
        g.save(); g.beginPath();
        for (i = 0; i <= NS; i++){ var xx = px0 + (px1 - px0) * i / NS, yy = py1 - prof[i] / Math.max(pmx, 1e-9) * (py1 - py0) * 0.98; if (i) g.lineTo(xx, yy); else g.moveTo(xx, yy); }
        g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.2; g.stroke(); g.restore();
        /* repères π / σ sous chaque composante */
        lines.forEach(function(l){ var x = X(-l.dE * lam2 * B); if (B < 0.25) return;
          g.fillStyle = ZM_COL[String(l.q)]; g.beginPath(); g.arc(x, py1 + 6, 3, 0, TAU); g.fill(); });
        /* graduation en pm */
        var st = zstep(2 * Wpm, phone ? 4 : 5), x0 = Math.ceil(-Wpm / st) * st;
        g.strokeStyle = "rgba(200,210,230,.5)"; g.lineWidth = 1;
        for (var pv = x0; pv <= Wpm + 1e-9; pv += st){ var XX = X(pv); g.beginPath(); g.moveTo(XX, py1 + 12); g.lineTo(XX, py1 + 16); g.stroke();
          zT(S, f, zN(pv, 0), XX, py1 + 23, {size:zfz(f, 9.5), color:"#aab6c8", weight:600}); }
        zT(S, f, "Δλ (pm)", px1, sy0 + 13, {size:zfz(f, 10), color:"#aab6c8", align:"right", weight:700});
        var msg2 = B < 0.25 ? (B > 0 ? "composantes encore confondues" : "B = 0 : une seule raie") : obs === "par" ? "le long de B : pas de composante π" : "";
        if (msg2) zT(S, f, msg2, sx0 + 10, sy0 + 30, {size:zfz(f, 10), color:B < 0.25 ? "#ffd34d" : "#9fc8ff", align:"left", weight:700});
      } else {
        zT(S, f, "Résonance de spin", sx0 + 10, sy0 + 13, {size:zfz(f, 12), color:"#e7eefb", align:"left"});
        var nu = GS * MUB_EV * B / H_EVS / 1e9, fx = function(ghz){ return px0 + ghz / 60 * (px1 - px0); };
        g.strokeStyle = "rgba(200,210,230,.5)";
        for (var gz = 0; gz <= 60; gz += phone ? 20 : 10){ g.beginPath(); g.moveTo(fx(gz), py1 + 12); g.lineTo(fx(gz), py1 + 16); g.stroke(); zT(S, f, String(gz), fx(gz), py1 + 23, {size:zfz(f, 9.5), color:"#aab6c8", weight:600}); }
        zT(S, f, "ν (GHz)", px1, sy0 + 13, {size:zfz(f, 10), color:"#aab6c8", align:"right", weight:700});
        if (B > 0.05){
          g.save(); g.beginPath();
          for (i = 0; i <= 200; i++){ var gq = 60 * i / 200, yq = py1 - (py1 - py0) * 0.9 * Math.exp(-Math.pow((gq - nu) / 0.8, 2)); if (i) g.lineTo(fx(gq), yq); else g.moveTo(fx(gq), yq); }
          g.strokeStyle = "#f07a7a"; g.lineWidth = 2; g.stroke(); g.restore();
          zglow(g, fx(nu), py0 + (py1 - py0) * 0.3, 18, "#f07a7a", 0.35 + 0.2 * Math.sin(t * 4));
        }
        zT(S, f, "absorption de micro-ondes", sx0 + 10, sy0 + 30, {size:zfz(f, 10), color:"#9fc8ff", align:"left", weight:700});
      }
      /* ---- afficheurs ---- */
      var muB = MUB_EV * B;
      if (raie === "h"){
        zrelabel(k, ["μ_B·B", "Niveaux de 1s", "ΔE = g_s·μ_B·B", "ν = ΔE/h"]);
        ro.set(0, zN(muB * 1e6, 1) + " µeV"); ro.set(1, B > 0 ? "2" : "1 (B = 0)");
        ro.set(2, zN(GS * muB * 1e6, 1) + " µeV"); ro.set(3, zN(GS * muB / H_EVS / 1e9, 2) + " GHz");
        nt.set("Sans spin, ℓ = 0 donne 2ℓ + 1 = 1 seul niveau. On en observe deux, écartés de g_s·μ_B·B avec g_s ≈ 2,002 : un moment cinétique s = ½ donne 2s + 1 = 2 orientations (on néglige le spin du proton : écart hyperfin 1,42 GHz).", "warn");
      } else {
        zrelabel(k, ["μ_B·B", "Composantes vues", "Écart extrême Δλ", "g haut / g bas"]);
        var ext = 0; lines.forEach(function(l){ ext = Math.max(ext, Math.abs(l.dE)); });
        var lam2b = L.lam * L.lam / HC_EVNM5 * muB * 1e3;
        ro.set(0, zN(muB * 1e6, 1) + " µeV");
        ro.set(1, String(lines.length) + (B === 0 ? " (confondues)" : ""));
        ro.set(2, "± " + zN(ext * lam2b, 1) + " pm");
        ro.set(3, zfrac(L.gu) + " / " + zfrac(L.gl));
        var nAll = zmLines(zmComps(L, "perp")).length, sPar = obs === "par" ? " Le long de B, les composantes π (ΔM = 0) n'envoient pas de lumière vers toi : il en reste " + lines.length + "." : "";
        nt.set((L.type === "normal" ? "Effet Zeeman normal : les deux niveaux ont g = 1 (spins appariés, S = 0) ; les sous-niveaux sont écartés de μ_B·B et la raie donne 3 composantes." :
          "Effet Zeeman anomal : le spin de l'électron change g (2/3, 4/3 ou 2) ; les écarts diffèrent en haut et en bas, d'où " + nAll + " composantes au lieu de 3.") + sPar, "ok");
      }
    });
  }
});
/* =====================================================================
   2. Addition de deux moments cinétiques (pq08)
   ===================================================================== */
function amJs(j1, j2){ var a = []; for (var j = Math.abs(j1 - j2); j <= j1 + j2 + 1e-9; j += 1) a.push(Math.round(j * 2) / 2); return a; }
function amLen(j){ return Math.sqrt(j * (j + 1)); }

SFA.sim({
  id:"pq-addition-moments-cinetiques", ch:"pq08", tag:"Moment cinétique",
  titre:"Additionner deux moments cinétiques : la règle du triangle",
  resume:"Deux vecteurs J₁ et J₂ précessent autour de leur somme J, qui tourne elle-même sur un cône autour de z.",
  but:"Règle j₁ et j₂, puis clique une case (j, m) dans l'échelle des états permis : le triangle J₁ + J₂ = J se reforme en 3D. Glisse sur la scène pour tourner la vue.",
  aRetenir:"j va de |j₁ − j₂| à j₁ + j₂ par pas de 1, et Σ(2j + 1) = (2j₁ + 1)(2j₂ + 1) : on ne crée ni ne perd d'état.",
  piege:"|J| vaut √(j(j + 1)) ħ et non j·ħ : J n'est jamais aligné sur z, il reste sur un cône.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 380), f = k.canvas(phone ? 250 : 220);
    var j1S = k.slider("j₁ (premier moment, par ex. ℓ)", 0, 3, 0.5, 1, "", function(){ reset(); });
    var j2S = k.slider("j₂ (second moment, par ex. s)", 0, 3, 0.5, 0.5, "", function(){ reset(); });
    k.button("Électron 2p : ℓ = 1, s = ½", function(){ j1S.set(1); j2S.set(0.5); reset(); }, true);
    k.button("Deux spins ½ (hélium)", function(){ j1S.set(0.5); j2S.set(0.5); reset(); });
    var ro = k.readouts(["|J| = √(j(j+1)) ħ", "J_z = m ħ", "J₁·J₂", "Σ(2j + 1) = (2j₁ + 1)(2j₂ + 1)"]);
    var nt = k.note("", "ok");
    var J = 1.5, M = 1.5, trail = [], GEO = {cols:[]};
    function reset(){ var js = amJs(j1S.value, j2S.value); J = js[js.length - 1]; M = J; trail = []; }
    reset();
    var v = new Z3(); v.a = 0.5; v.b = 0.32; v.f = 16; v.set();
    zorbit(c, v, k, [-0.3, 1.2]);
    f.cv.style.touchAction = "none";
    function hitRung(p){ var h = null; GEO.cols.forEach(function(col){ col.rungs.forEach(function(r){ if (Math.abs(p.x - col.x) < col.w / 2 + 4 && Math.abs(p.y - r.y) < Math.max(5, r.h / 2 + 1)) h = {j:col.j, m:r.m}; }); }); return h; }
    f.pointer(function(type, p){
      if (type === "down"){ var h = hitRung(p); if (h){ J = h.j; M = h.m; trail = []; k.redraw(); } }
      if (type === "move") f.cv.style.cursor = hitRung(p) ? "pointer" : "default";
    });
    var phi = 0, psi = 0;
    var lp = k.loop(function(dt, t){
      phi += dt * 0.55; psi += dt * 1.7;
      if (!v.user){ v.a = 0.5 + 0.25 * Math.sin(t * 0.18); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, j1 = j1S.value, j2 = j2S.value;
      var js = amJs(j1, j2); if (js.indexOf(J) < 0){ J = js[js.length - 1]; M = J; }
      if (Math.abs(M) > J) M = J;
      var L1 = amLen(j1), L2 = amLen(j2), LJ = amLen(J), Lmax = Math.max(amLen(j1 + j2), 0.9);
      var u = 2.9 / Lmax;   /* unités de scène par ħ */
      /* direction de J */
      var th = LJ > 0 ? Math.acos(M / LJ) : 0, eJ = [Math.sin(th) * Math.cos(phi), Math.cos(th), Math.sin(th) * Math.sin(phi)];
      /* base perpendiculaire à J */
      var t0 = Math.abs(eJ[1]) < 0.95 ? [0, 1, 0] : [1, 0, 0];
      var e1 = [eJ[1] * t0[2] - eJ[2] * t0[1], eJ[2] * t0[0] - eJ[0] * t0[2], eJ[0] * t0[1] - eJ[1] * t0[0]], n1 = Math.hypot(e1[0], e1[1], e1[2]);
      e1 = [e1[0] / n1, e1[1] / n1, e1[2] / n1];
      var e2 = [eJ[1] * e1[2] - eJ[2] * e1[1], eJ[2] * e1[0] - eJ[0] * e1[2], eJ[0] * e1[1] - eJ[1] * e1[0]];
      var V1, VJ = [eJ[0] * LJ, eJ[1] * LJ, eJ[2] * LJ], ca = 1, sa = 0;
      if (LJ > 1e-9 && L1 > 1e-9){ ca = (LJ * LJ + L1 * L1 - L2 * L2) / (2 * LJ * L1); ca = Math.max(-1, Math.min(1, ca)); sa = Math.sqrt(1 - ca * ca); }
      if (LJ < 1e-9){ /* J = 0 : J₁ = −J₂ tournent librement */
        var tq = 1.0; V1 = [L1 * Math.sin(tq) * Math.cos(psi), L1 * Math.cos(tq), L1 * Math.sin(tq) * Math.sin(psi)];
      } else {
        var cp = Math.cos(psi), sp = Math.sin(psi);
        V1 = [L1 * (ca * eJ[0] + sa * (cp * e1[0] + sp * e2[0])), L1 * (ca * eJ[1] + sa * (cp * e1[1] + sp * e2[1])), L1 * (ca * eJ[2] + sa * (cp * e1[2] + sp * e2[2]))];
      }
      function sc3(a){ return [a[0] * u, a[1] * u, a[2] * u]; }
      var P1 = sc3(V1), PJ = sc3(VJ);
      trail.push(P1); if (trail.length > 160) trail.shift();
      /* ---- scène ---- */
      zlab(ctx, W, H, "#1f2a44", "#0a0f1b");
      /* pièces polaires de l'aimant (axe z = direction du champ), en bord de cadre */
      [[0, 1], [H, -1]].forEach(function(pp){
        var y0 = pp[0], sg = pp[1], hh = 30, wt = W * 0.16, wb = W * 0.3;
        var gp = ctx.createLinearGradient(W / 2 - wb / 2, 0, W / 2 + wb / 2, 0); gp.addColorStop(0, "#3b434f"); gp.addColorStop(0.45, "#9aa4b1"); gp.addColorStop(1, "#2c333d");
        ctx.fillStyle = gp; ctx.beginPath(); ctx.moveTo(W / 2 - wb / 2, y0); ctx.lineTo(W / 2 + wb / 2, y0); ctx.lineTo(W / 2 + wt / 2, y0 + sg * hh); ctx.lineTo(W / 2 - wt / 2, y0 + sg * hh); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(W / 2 - wt / 2, y0 + sg * hh - (sg > 0 ? 2 : 0), wt, 2);
        zT(S, c, sg > 0 ? "N" : "S", W / 2, y0 + sg * hh * 0.5, {size:zfz(c, 12), color:"#eef3fb", weight:800});
      });
      var cyOff = LJ > 1e-9 ? M / LJ : 0;
      v.sc = Math.min(W / 5.4, (H - 64) / 5.4); v.cx = W * 0.5; v.cy = H * 0.5 + cyOff * v.sc * 1.25; v.clear();
      /* cône de J autour de z */
      var rC = Math.sqrt(Math.max(0, LJ * LJ - M * M)) * u, hC = M * u, NC = 36;
      if (LJ > 1e-9) for (i = 0; i < NC; i++){
        var a0 = i / NC * TAU, a1 = (i + 1) / NC * TAU;
        v.face([[0, 0, 0], [rC * Math.cos(a0), hC, rC * Math.sin(a0)], [rC * Math.cos(a1), hC, rC * Math.sin(a1)]], "#8fb4ff", {alpha:0.13, glow:true});
      }
      /* noyau / atome au centre */
      v.sprite(0, 0, 0, function(g, q){ zglow(g, q.x, q.y, 0.55 * v.sc * q.s, "#9cc4ff", 0.45); zball(g, q.x, q.y, 0.16 * v.sc * q.s, "#e8eef8"); });
      /* vecteurs : J₁ depuis l'origine, J₂ au bout de J₁ (triangle), J somme */
      if (L1 > 1e-9) zarrow3(v, [0, 0, 0], P1, 0.065, "#4f8ff0");
      if (L2 > 1e-9) zarrow3(v, P1, PJ, 0.065, "#f08a3c");
      if (LJ > 1e-9) zarrow3(v, [0, 0, 0], PJ, 0.085, "#f4d35e");
      v.render(ctx);
      /* axe z, cercles et traînée (dessin 2D par-dessus, fin) */
      var z0 = v.p(0, -2.9, 0), z1 = v.p(0, 2.9, 0);
      ctx.save(); ctx.strokeStyle = "rgba(200,215,240,.55)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(z0.x, z0.y); ctx.lineTo(z1.x, z1.y); ctx.stroke();
      function circ(cen, ax, r, col, dash){
        var t1 = Math.abs(ax[1]) < 0.95 ? [0, 1, 0] : [1, 0, 0], a = [ax[1] * t1[2] - ax[2] * t1[1], ax[2] * t1[0] - ax[0] * t1[2], ax[0] * t1[1] - ax[1] * t1[0]], na = Math.hypot(a[0], a[1], a[2]);
        a = [a[0] / na, a[1] / na, a[2] / na]; var b = [ax[1] * a[2] - ax[2] * a[1], ax[2] * a[0] - ax[0] * a[2], ax[0] * a[1] - ax[1] * a[0]];
        ctx.strokeStyle = col; ctx.setLineDash(dash || []); ctx.beginPath();
        for (var q = 0; q <= 48; q++){ var w = q / 48 * TAU, P = v.p(cen[0] + r * (Math.cos(w) * a[0] + Math.sin(w) * b[0]), cen[1] + r * (Math.cos(w) * a[1] + Math.sin(w) * b[1]), cen[2] + r * (Math.cos(w) * a[2] + Math.sin(w) * b[2])); if (q) ctx.lineTo(P.x, P.y); else ctx.moveTo(P.x, P.y); }
        ctx.stroke();
      }
      ctx.lineWidth = 1.4;
      if (LJ > 1e-9) circ([0, hC, 0], [0, 1, 0], rC, "rgba(244,211,94,.7)");
      if (LJ > 1e-9 && L1 > 1e-9 && sa > 1e-6) circ([eJ[0] * L1 * ca * u, eJ[1] * L1 * ca * u, eJ[2] * L1 * ca * u], eJ, L1 * sa * u, "rgba(120,170,255,.65)", [4, 4]);
      /* projection de J sur z */
      if (LJ > 1e-9){ var pj = v.p(PJ[0], PJ[1], PJ[2]), pz = v.p(0, PJ[1], 0); ctx.strokeStyle = "rgba(244,211,94,.6)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(pj.x, pj.y); ctx.lineTo(pz.x, pz.y); ctx.stroke(); }
      ctx.setLineDash([]);
      /* traînée du bout de J₁ */
      for (i = 1; i < trail.length; i++){ var A = v.p(trail[i - 1][0], trail[i - 1][1], trail[i - 1][2]), Bq = v.p(trail[i][0], trail[i][1], trail[i][2]); ctx.strokeStyle = "rgba(110,165,255," + (i / trail.length * 0.6) + ")"; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(Bq.x, Bq.y); ctx.stroke(); }
      ctx.restore();
      /* étiquettes des vecteurs, au milieu de chaque flèche, décalées */
      var lab = [];
      if (L1 > 1e-9){ var m1 = v.p(P1[0] * 0.55, P1[1] * 0.55, P1[2] * 0.55); lab.push(["J₁", m1, "#8db8ff"]); }
      if (L2 > 1e-9){ var m2 = v.p((P1[0] + PJ[0]) / 2, (P1[1] + PJ[1]) / 2, (P1[2] + PJ[2]) / 2); lab.push(["J₂", m2, "#ffb27a"]); }
      if (LJ > 1e-9){ var mJ = v.p(PJ[0] * 1.08, PJ[1] * 1.08, PJ[2] * 1.08); lab.push(["J", mJ, "#f4d35e"]); }
      lab.forEach(function(L, n){
        var x = L[1].x + 14, y = L[1].y;
        lab.slice(0, n).forEach(function(o){ if (Math.abs(o.y2 - y) < 24 && Math.abs(o.x2 - x) < 34) y = o.y2 + (y >= o.y2 ? 24 : -24); });
        L.x2 = x; L.y2 = y; lab[n].y2 = y; lab[n].x2 = x;
        ztag(S, c, L[0], x, y, {size:13, color:L[2], align:"left"});
      });
      ztag(S, c, "axe z = direction de B", W / 2 + W * 0.16, 22, {size:10.5, align:"left"});
      zT(S, c, "glisse pour tourner", W - 10, H - 14, {size:zfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      ztag(S, c, "j = " + zfrac(J) + "   m = " + zsgn(M) + (LJ > 0 ? "   θ = " + zN(Math.acos(M / LJ) * 180 / PI, 1) + "°" : "   (J = 0 : pas de cône)"), 10, H - 18, {size:phone ? 11 : 12.5, align:"left", color:"#f4d35e"});

      /* ---- échelle des états permis ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      zT(S, f, "États permis : j de |j₁ − j₂| à j₁ + j₂", 12, 14, {size:zfz(f, 12.5), color:"#13233a", align:"left"});
      var nCol = js.length, colW = Math.min(92, (FW - 70) / nCol), x0 = 48 + (FW - 56 - colW * nCol) / 2, top = 34, bot = FH - 44;
      var mMax = j1 + j2, rungH = Math.min(24, (bot - top) / (2 * mMax + 1));
      GEO.cols = [];
      js.forEach(function(jj, n){
        var cx = x0 + colW * (n + 0.5), col = {x:cx, w:colW * 0.7, j:jj, rungs:[]};
        for (var mm = jj; mm >= -jj - 1e-9; mm -= 1){
          var y = (top + bot) / 2 - mm * rungH, on = jj === J && Math.abs(mm - M) < 1e-9, sameJ = jj === J;
          g.save(); zrr(g, cx - colW * 0.35, y - rungH * 0.36, colW * 0.7, rungH * 0.72, 3);
          g.fillStyle = on ? "#f4b400" : sameJ ? "#ffe8a3" : "#dbe4f2"; g.fill(); g.restore();
          col.rungs.push({m:mm, y:y, h:rungH});
        }
        GEO.cols.push(col);
        zT(S, f, "j = " + zfrac(jj), cx, bot + 12, {size:zfz(f, 11), color:jj === J ? "#9a6a00" : "#13233a", weight:800});
        zT(S, f, String(2 * jj + 1), cx, bot + 27, {size:zfz(f, 10), color:"#5f6b7a", weight:700});
      });
      /* repère m sur la gauche */
      zT(S, f, "2j + 1", x0 - 8, bot + 27, {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:700});
      var mStep = rungH >= 12 ? 1 : rungH >= 6 ? 2 : 4;
      for (var mq = mMax, nq = 0; mq >= -mMax - 1e-9; mq -= 1, nq++){ if (nq % mStep) continue;
        zT(S, f, (nq === 0 ? "m = " : "") + zsgn(mq), x0 - 8, (top + bot) / 2 - mq * rungH, {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:700}); }
      /* ---- afficheurs ---- */
      var dot12 = (J * (J + 1) - j1 * (j1 + 1) - j2 * (j2 + 1)) / 2;
      ro.set(0, zN(LJ, 3) + " ħ");
      ro.set(1, zsgn(M) + " ħ");
      ro.set(2, zN(dot12, 3) + " ħ²");
      var sum = js.map(function(jj){ return 2 * jj + 1; });
      ro.set(3, (sum.length <= 3 ? sum.join(" + ") : sum[0] + " + … + " + sum[sum.length - 1]) + " = " + (2 * j1 + 1) * (2 * j2 + 1));
      var cas = (j1 === 1 && j2 === 0.5) ? "Électron 2p : ℓ = 1 et s = ½ donnent j = ½ (2p₁/₂) ou j = 3/2 (2p₃/₂), avec 2 + 4 = 6 états. " :
        (j1 === 0.5 && j2 === 0.5) ? "Deux spins ½ : S = 0 (singulet, 1 état) ou S = 1 (triplet, 3 états), soit 4 états : c'est le parahélium et l'orthohélium. " : "";
      nt.set(cas + "Le triangle de côtés √(j₁(j₁+1)), √(j₂(j₂+1)) et √(j(j+1)) tourne autour de J ; seule la projection J_z = mħ reste fixe. J₁·J₂ = [j(j+1) − j₁(j₁+1) − j₂(j₂+1)] ħ²/2.", "ok");
    });
  }
});
/* =====================================================================
   3. Structure fine, Lamb et raie de 21 cm (pq08)
   ===================================================================== */
var FS_A = 7.2973525693e-3, FS_RY = 13.605693122994;
function fsDirac(n, j){ var En = -FS_RY / (n * n); return En * FS_A * FS_A / (n * n) * (n / (j + 0.5) - 0.75); }
var FS_HF = 1420.405751768e6 * H_EVS, FS_L1S = 8172.9e6 * H_EVS, FS_L2S = 1057.845e6 * H_EVS;
/* niveaux (énergies en eV relatives au niveau de Bohr de la même couche : d) ; col : 0 Bohr, 1 Dirac, 2 Lamb, 3 hyperfin */
function fsLevels(){
  var L = [], i;
  for (var n = 1; n <= 4; n++) L.push({id:"b" + n, n:n, col:0, d:0, lab:n === 1 ? "1s" : n === 2 ? "2s, 2p" : "n = " + n});
  var d1 = fsDirac(1, 0.5), d2a = fsDirac(2, 0.5), d2b = fsDirac(2, 1.5);
  [[1, "1s", "1s₁/₂", d1, FS_L1S, FS_HF, [[1, 0.25], [0, -0.75]], "b1"],
   [2, "2s", "2s₁/₂", d2a, FS_L2S, 177.556e6 * H_EVS, [[1, 0.25], [0, -0.75]], "b2"],
   [2, "2p1", "2p₁/₂", d2a, 0, 59.19e6 * H_EVS, [[1, 0.25], [0, -0.75]], "b2"],
   [2, "2p3", "2p₃/₂", d2b, 0, 23.65e6 * H_EVS, [[2, 0.375], [1, -0.625]], "b2"]].forEach(function(r){
    L.push({id:"d" + r[1], n:r[0], col:1, d:r[3], lab:r[2], par:r[7], key:r[1]});
    L.push({id:"l" + r[1], n:r[0], col:2, d:r[3] + r[4], lab:r[2], par:"d" + r[1], key:r[1]});
    r[6].forEach(function(F){ L.push({id:"h" + r[1] + F[0], n:r[0], col:3, d:r[3] + r[4] + F[1] * r[5], lab:"F = " + F[0], par:"l" + r[1], key:r[1]}); });
  });
  for (n = 3; n <= 4; n++) for (i = 1; i <= 3; i++) L.push({id:"x" + n + i, n:n, col:i, d:0, lab:"n = " + n, par:i === 1 ? "b" + n : "x" + n + (i - 1)});
  /* 1s, 2s/2p : les colonnes Dirac/Lamb/hyperfin du niveau dégénéré de Bohr partent de b1, b2 */
  return L;
}
var FS_LEV = fsLevels(), FS_BYID = {}; FS_LEV.forEach(function(l){ FS_BYID[l.id] = l; l.E = -FS_RY / (l.n * l.n) + l.d; });
/* cibles de la loupe : énergie de Bohr, grossissement conseillé, ancres du centre (log10 G → décalage en µeV) */
var FS_T = {
  h1s:{nom:"1s : hyperfin (21 cm)", n:1, z:6.0, anc:[[4.4, -90], [5.0, -147.33], [5.8, -148.8], [6.3, -148.8], [6.8, -145.86]]},
  fs2:{nom:"n = 2 : structure fine", n:2, z:5.3, anc:[[5.3, -32], [6.4, -11.32]]},
  lamb:{nom:"2s et 2p₁/₂ : Lamb", n:2, z:6.25, anc:[[5.3, -32], [6.0, -54.4], [6.4, -54.4], [6.9, -52.41]]}
};
function fsCenter(T, lz){
  var Eb = -FS_RY / (T.n * T.n), Z = Math.pow(10, lz), c0 = -7.2;
  var a = T.anc, off = a[0][1];
  for (var i = 0; i < a.length - 1; i++) if (lz > a[i][0]) off = lz >= a[i + 1][0] ? a[i + 1][1] : a[i][1] + (a[i + 1][1] - a[i][1]) * (lz - a[i][0]) / (a[i + 1][0] - a[i][0]);
  var w = Math.min(1, Math.max(0, (lz - 1.5) / 2.5));   /* le décalage fin n'agit qu'aux forts grossissements */
  return Eb + (c0 - Eb) / (Z * Z) + off * 1e-6 * w;
}
/* Galaxie : bras spiraux logarithmiques, courbe de rotation plate */
var GX = {V0:220, R0:8.5, pitch:12 * PI / 180, arms:[0.3, 1.87, 3.44, 5.01]};
function gxDens(x, y){
  var R = Math.hypot(x, y); if (R < 2.5 || R > 17) return 0;
  var th = Math.atan2(y, x), s = 0, tp = Math.tan(GX.pitch);
  GX.arms.forEach(function(a0){
    var ta = a0 + Math.log(R / 4) / tp, dth = th - ta; dth = dth - TAU * Math.round(dth / TAU);
    var d = R * Math.abs(dth) * Math.sin(GX.pitch); s += Math.exp(-d * d / (2 * 0.32 * 0.32));
  });
  return (s + 0.06) * (R > 14 ? Math.exp(-(R - 14)) : 1);
}
/* vitesse radiale (km/s) d'un point à la distance s (kpc) dans la direction de longitude l (rad) ; Soleil en (0, −R0), centre à l'origine */
function gxVr(l, s){
  var x = -s * Math.sin(l), y = -GX.R0 + s * Math.cos(l), R = Math.hypot(x, y);
  return {x:x, y:y, v:GX.V0 * Math.sin(l) * (GX.R0 / R - 1)};
}

SFA.sim({
  id:"pq-structure-fine-hyperfine-21cm", ch:"pq08", tag:"Spin",
  titre:"Zoom sur un niveau : structure fine, Lamb et raie de 21 cm",
  resume:"Une loupe sur les niveaux de l'hydrogène : structure fine, déplacement de Lamb, puis 1s coupé en deux par le spin du proton, d'où la raie de 21 cm.",
  but:"Choisis où poser la loupe et règle le grossissement (curseur ou glisse verticalement sur le diagramme). Le radiotélescope capte la raie de 21 cm décalée par effet Doppler : glisse sur la carte pour viser une autre direction de la Galaxie.",
  aRetenir:"Structure fine ≈ α²·|Eₙ|, hyperfin encore ≈ 100 fois plus petit (facteur ≈ g_p·m_e/m_p) : 1s se coupe en F = 1 et F = 0, séparés de 5,87 µeV, soit 1 420 MHz et λ = 21,1 cm.",
  piege:"F = 1 et F = 0 viennent de l'orientation relative des spins de l'électron et du proton, pas d'un changement d'orbite.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 420 : 340), f = k.canvas(phone ? 400 : 360);
    var tgt = "h1s";
    var tS = k.seg("Loupe sur", [["h1s", "1s : hyperfin (21 cm)"], ["fs2", "n = 2 : structure fine"], ["lamb", "2s et 2p₁/₂ : Lamb"]], "h1s", function(v){ tgt = v; fly(FS_T[v].z); });
    var zS = k.slider("Grossissement (log₁₀)", 0, 7, 0.05, 0, "", function(){ flight = null; });
    var scT = k.toggle("Balayage automatique du ciel", true);
    k.button("Effacer la carte", function(){ mapClear(); });
    var ro = k.readouts(["Grossissement", "Écart sous la loupe", "Fréquence ν = ΔE/h", "Longueur d'onde λ = c/ν"]);
    var nt = k.note("", "ok");
    var flight = null;
    function fly(z1){ flight = {z0:zS.value, z1:z1, t:0, T:Math.max(1.5, Math.abs(z1 - zS.value) * 0.75)}; }
    fly(FS_T.h1s.z);
    /* glisser verticalement sur le diagramme : grossissement */
    var drag = null;
    f.cv.style.touchAction = "none"; f.cv.style.cursor = "ns-resize";
    f.pointer(function(type, p){
      if (type === "down"){ drag = {y:p.y, z:zS.value}; flight = null; }
      if (type === "drag" && drag){ zS.set(Math.max(0, Math.min(7, drag.z + (drag.y - p.y) * 0.02))); k.redraw(); }
      if (type === "up") drag = null;
    });
    /* carte de la Galaxie : texture des détections */
    var MT = 220, mtex = document.createElement("canvas"); mtex.width = mtex.height = MT;
    var mctx = mtex.getContext("2d"), MSPAN = 34;   /* kpc sur la largeur de la carte */
    function mapClear(){ mctx.clearRect(0, 0, MT, MT); }
    function mxy(x, y){ return [MT / 2 + x / MSPAN * MT, MT / 2 - y / MSPAN * MT]; }
    var lon = 30 * PI / 180, MAPG = null, spec = null, specL = null;
    c.cv.style.touchAction = "none";
    function aim(p){
      if (!MAPG) return false;
      var dx = p.x - MAPG.cx, dy = p.y - MAPG.cy; if (Math.abs(dx) > MAPG.r * 1.05 || Math.abs(dy) > MAPG.r * 1.05) return false;
      var x = dx / MAPG.k, y = -dy / MAPG.k, sx = x, sy = y + GX.R0;
      if (Math.hypot(sx, sy) < 0.3) return true;
      lon = Math.atan2(-sx, sy); if (lon < 0) lon += TAU; scT.set(false); return true;
    }
    var dragM = false;
    c.pointer(function(type, p){
      if (type === "down") dragM = aim(p);
      if (type === "drag" && dragM) aim(p);
      if (type === "move") c.cv.style.cursor = MAPG && Math.abs(p.x - MAPG.cx) < MAPG.r && Math.abs(p.y - MAPG.cy) < MAPG.r ? "crosshair" : "default";
      if (type === "up") dragM = false;
    });
    /* spectre reçu pour la longitude l : T(v) */
    var NV = 160, VMAX = 160;
    function spectrum(l){
      var T = new Float64Array(NV), ds = 0.06, sig = 7;
      for (var s = 0.05; s < 26; s += ds){
        var q = gxVr(l, s), n = gxDens(q.x, q.y); if (n < 0.02) continue;
        for (var i = 0; i < NV; i++){ var v = -VMAX + 2 * VMAX * (i + 0.5) / NV; T[i] += n * ds * Math.exp(-Math.pow(v - q.v, 2) / (2 * sig * sig)); }
        if (n > 0.45){ var m = mxy(q.x, q.y), vv = Math.max(-1, Math.min(1, q.v / 120));
          mctx.fillStyle = vv < 0 ? "rgba(" + Math.round(90 + 60 * (1 + vv)) + "," + Math.round(160 + 40 * (1 + vv)) + ",255,.5)" : "rgba(255," + Math.round(200 - 110 * vv) + "," + Math.round(160 - 100 * vv) + ",.5)";
          mctx.fillRect(m[0] - 1, m[1] - 1, 2.2, 2.2); }
      }
      return T;
    }
    var waves = [], wacc = 0;
    var lp = k.loop(function(dt, t){
      if (flight){ flight.t += dt; var u = Math.min(1, flight.t / flight.T), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        zS.set(flight.z0 + (flight.z1 - flight.z0) * e); if (u >= 1) flight = null; }
      if (scT.value){ lon += dt * 0.32; if (lon > TAU) lon -= TAU; }
      wacc += dt * 3; while (wacc >= 1){ wacc -= 1; waves.push({s:0, x:Math.random()}); }
      for (var i = waves.length - 1; i >= 0; i--){ waves[i].s += dt * 0.45; if (waves[i].s > 1) waves.splice(i, 1); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, t = performance.now() / 1000;
      if (specL !== lon){ spec = spectrum(lon); specL = lon; }
      /* ================= scène : radiotélescope sous la Voie lactée ================= */
      var sw = phone ? W : W * 0.56, sh = phone ? H * 0.5 : H;
      var gs = ctx.createLinearGradient(0, 0, 0, sh); gs.addColorStop(0, "#050914"); gs.addColorStop(0.7, "#13203a"); gs.addColorStop(1, "#24314a");
      ctx.fillStyle = gs; ctx.fillRect(0, 0, sw, sh);
      /* bande de la Voie lactée */
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sw, sh); ctx.clip();
      ctx.translate(sw * 0.5, sh * 0.35); ctx.rotate(-0.35);
      var gm = ctx.createLinearGradient(0, -sh * 0.16, 0, sh * 0.16); gm.addColorStop(0, "rgba(180,190,255,0)"); gm.addColorStop(0.5, "rgba(200,205,255,.22)"); gm.addColorStop(1, "rgba(180,190,255,0)");
      ctx.fillStyle = gm; ctx.fillRect(-sw, -sh * 0.16, 2 * sw, sh * 0.32);
      ctx.fillStyle = "rgba(20,24,40,.35)"; ctx.beginPath(); ctx.ellipse(-sw * 0.1, 0, sw * 0.35, sh * 0.02, 0, 0, TAU); ctx.fill();
      ctx.restore();
      for (i = 0; i < 90; i++){ var sx = (Math.sin(i * 91.7) * 0.5 + 0.5) * sw, sy = (Math.sin(i * 37.3 + 1) * 0.5 + 0.5) * sh * 0.72, tw = 0.5 + 0.5 * Math.sin(t * 2 + i);
        ctx.fillStyle = "rgba(255,255,255," + (0.25 + 0.5 * tw) + ")"; ctx.fillRect(sx, sy, i % 7 ? 1 : 1.8, i % 7 ? 1 : 1.8); }
      /* nuage d'hydrogène qui émet à 21 cm */
      var hx = sw * 0.22, hy = sh * 0.2; zglow(ctx, hx, hy, sh * 0.13, [255, 120, 150], 0.35);
      ztag(S, c, "nuage d'hydrogène H", hx, hy - sh * 0.1 - 6, {size:10.5, color:"#ffc2d0"});
      /* sol et colline */
      var gy = sh * 0.82; var gg = ctx.createLinearGradient(0, gy, 0, sh); gg.addColorStop(0, "#1b2a22"); gg.addColorStop(1, "#0b130e");
      ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(0, gy + 6); ctx.quadraticCurveTo(sw * 0.3, gy - 10, sw * 0.6, gy + 2); ctx.quadraticCurveTo(sw * 0.85, gy + 10, sw, gy - 2); ctx.lineTo(sw, sh); ctx.lineTo(0, sh); ctx.closePath(); ctx.fill();
      /* radiotélescope : pied, monture, parabole orientée vers le nuage */
      var tx = sw * 0.62, ty = gy - 2, R = Math.min(sw * 0.24, sh * (phone ? 0.25 : 0.3)), az = Math.sin(lon) * 0.35;
      ctx.save(); var gp = ctx.createLinearGradient(tx - 20, 0, tx + 20, 0); gp.addColorStop(0, "#5a6372"); gp.addColorStop(0.5, "#c9d1dc"); gp.addColorStop(1, "#4a5260");
      ctx.fillStyle = gp; ctx.beginPath(); ctx.moveTo(tx - R * 0.28, ty); ctx.lineTo(tx - R * 0.08, ty - R * 0.75); ctx.lineTo(tx + R * 0.08, ty - R * 0.75); ctx.lineTo(tx + R * 0.28, ty); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#2b313b"; ctx.fillRect(tx - R * 0.36, ty - 4, R * 0.72, 8); ctx.restore();
      var dcx = tx - R * 0.12, dcy = ty - R * 0.95, ang = -0.75 + az;
      ctx.save(); ctx.translate(dcx, dcy); ctx.rotate(ang);
      /* coupe de la parabole : coque + intérieur clair */
      var gd = ctx.createLinearGradient(0, -R, 0, R); gd.addColorStop(0, "#f2f5fa"); gd.addColorStop(0.5, "#b9c3d1"); gd.addColorStop(1, "#6f7a8a");
      ctx.fillStyle = "#59616d"; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.34, R, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = gd; ctx.beginPath(); ctx.ellipse(-R * 0.06, 0, R * 0.28, R * 0.94, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(60,70,85,.35)"; ctx.lineWidth = 1;
      for (i = 1; i <= 3; i++){ ctx.beginPath(); ctx.ellipse(-R * 0.06, 0, R * 0.28 * i / 4, R * 0.94 * i / 4, 0, 0, TAU); ctx.stroke(); }
      /* bras du récepteur au foyer */
      ctx.strokeStyle = "#c9d1dc"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-R * 0.05, -R * 0.8); ctx.lineTo(-R * 0.75, 0); ctx.lineTo(-R * 0.05, R * 0.8); ctx.stroke();
      zball(ctx, -R * 0.78, 0, R * 0.07, "#d9a23b");
      ctx.restore();
      /* ondes de 21 cm du nuage vers la parabole */
      var fx = dcx + Math.cos(ang + PI) * R * 0.78, fy = dcy + Math.sin(ang + PI) * R * 0.78;
      ctx.save(); ctx.strokeStyle = "rgba(255,150,180,.85)"; ctx.lineWidth = 1.6;
      waves.forEach(function(w){
        var x0 = hx + (fx - hx) * w.s, y0 = hy + (fy - hy) * w.s + (w.x - 0.5) * 30 * (1 - w.s), a = Math.atan2(fy - hy, fx - hx);
        ctx.beginPath(); for (var j = 0; j <= 18; j++){ var u = (j - 9) * 2.2, wv = Math.sin(j / 18 * TAU * 2) * 4; var X = x0 + Math.cos(a) * u - Math.sin(a) * wv, Y = y0 + Math.sin(a) * u + Math.cos(a) * wv; if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
        ctx.globalAlpha = Math.sin(w.s * PI); ctx.stroke();
      });
      ctx.restore();
      ztag(S, c, "λ = 21 cm", (hx + fx) / 2, (hy + fy) / 2 - 18, {size:11, color:"#ffc2d0"});
      ztag(S, c, "radiotélescope", tx, gy + (sh - gy) / 2, {size:10.5});
      /* ================= écran : carte + spectre ================= */
      var px = phone ? 0 : sw, py = phone ? sh : 0, pw = phone ? W : W - sw, ph = phone ? H - sh : H;
      ctx.fillStyle = "#0b1220"; ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fillRect(px, py, 2, ph);
      var mapW = phone ? pw * 0.5 : pw, mapH = phone ? ph : ph * 0.58;
      var r = Math.min(mapW, mapH - 26) / 2 - 8, mcx = px + mapW / 2, mcy = py + 22 + (mapH - 22) / 2;
      zT(S, c, "Carte de la Galaxie (vue de dessus)", px + 10, py + 13, {size:zfz(c, 11), color:"#cfe0f5", align:"left", weight:800});
      var kk = 2 * r / MSPAN; MAPG = {cx:mcx, cy:mcy, r:r, k:kk};
      ctx.save(); ctx.beginPath(); ctx.arc(mcx, mcy, r, 0, TAU); ctx.fillStyle = "#060a14"; ctx.fill(); ctx.clip();
      ctx.drawImage(mtex, mcx - r, mcy - r, 2 * r, 2 * r);
      /* centre galactique, Soleil, ligne de visée */
      zglow(ctx, mcx, mcy, r * 0.12, [255, 220, 150], 0.5);
      var sunx = mcx, suny = mcy + GX.R0 * kk;
      ctx.strokeStyle = "rgba(255,230,120,.8)"; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(sunx, suny); ctx.lineTo(sunx - Math.sin(lon) * 2 * r, suny - Math.cos(lon) * 2 * r); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      ctx.strokeStyle = "rgba(150,170,200,.35)"; ctx.beginPath(); ctx.arc(mcx, mcy, r, 0, TAU); ctx.stroke();
      zball(ctx, sunx, suny, 4, "#ffd34d");
      zT(S, c, "Soleil", sunx + 8, suny + 9, {size:zfz(c, 9.5), color:"#ffe39a", align:"left", weight:700});
      zT(S, c, "centre", mcx, mcy - 9, {size:zfz(c, 9.5), color:"#ffe0b0", weight:700});
      /* spectre */
      var qx = phone ? px + mapW + 6 : px + 10, qy = phone ? py + 26 : py + mapH + 6, qw = phone ? pw - mapW - 14 : pw - 20, qh = phone ? ph - 56 : ph - mapH - 36;
      zT(S, c, "Raie reçue, l = " + zN(lon * 180 / PI, 0) + "°", qx, phone ? py + 13 : qy + 6, {size:zfz(c, 10.5), color:"#cfe0f5", align:"left", weight:800});
      var by0 = qy + 16, bh = qh - 16, mx = 0; for (i = 0; i < NV; i++) mx = Math.max(mx, spec[i]);
      ctx.save(); ctx.beginPath();
      for (i = 0; i < NV; i++){ var X = qx + (i + 0.5) / NV * qw, Y = by0 + bh - spec[i] / Math.max(mx, 1e-9) * bh * 0.95; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
      ctx.strokeStyle = "#7dff9a"; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
      ctx.strokeStyle = "rgba(160,180,210,.5)"; ctx.beginPath(); ctx.moveTo(qx, by0 + bh + 0.5); ctx.lineTo(qx + qw, by0 + bh + 0.5); ctx.moveTo(qx + qw / 2, by0 + bh); ctx.lineTo(qx + qw / 2, by0 + bh + 4); ctx.stroke();
      [-150, 0, 150].forEach(function(vv){ zT(S, c, (vv > 0 ? "+" : "") + zN(vv, 0), qx + (vv + VMAX) / (2 * VMAX) * qw, by0 + bh + 11, {size:zfz(c, 9), color:"#9fb0c8", align:vv < 0 ? "left" : vv > 0 ? "right" : "center", weight:600}); });
      zT(S, c, "vitesse (km/s)", qx + qw, by0 - 2, {size:zfz(c, 9), color:"#9fb0c8", align:"right", weight:600});

      /* ================= diagramme d'énergie avec loupe ================= */
      var g = f.ctx, FW = f.W, FH = f.H, T = FS_T[tgt], lz = zS.value, Z = Math.pow(10, lz);
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var HE = 16 / Z, cE = fsCenter(T, lz);
      var ox = 10, ow = phone ? 46 : 58, top = 34, bot = FH - 26;
      var dx0 = ox + ow + 26, dx1 = FW - 10, cw = (dx1 - dx0) / 4;
      function yE(E){ return (top + bot) / 2 - (E - cE) / HE * (bot - top); }
      /* vue d'ensemble (−14,5 → 0 eV) avec la loupe */
      g.save(); zrr(g, ox, top, ow, bot - top, 8); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore();
      function Yo(E){ return bot - 8 - (E + 14.5) / 14.5 * (bot - top - 16); }
      for (var n = 1; n <= 6; n++){ var yo = Yo(-FS_RY / (n * n)); g.strokeStyle = "#2f6fd6"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(ox + 8, yo); g.lineTo(ox + ow - 8, yo); g.stroke(); }
      zT(S, f, "niveaux", ox + ow / 2, top - 10, {size:zfz(f, 10), color:"#5f6b7a", weight:800});
      var ly = Yo(cE), lr = Math.max(7, Math.min(ow * 0.42, (bot - top) * HE / 14.5));
      g.save(); g.strokeStyle = "#d1495b"; g.lineWidth = 2.2; g.beginPath(); g.arc(ox + ow / 2, ly, lr, 0, TAU); g.stroke();
      g.lineWidth = 3.5; g.beginPath(); g.moveTo(ox + ow / 2 + lr * 0.7, ly + lr * 0.7); g.lineTo(ox + ow / 2 + lr * 0.7 + 9, ly + lr * 0.7 + 9); g.stroke();
      /* cône de la loupe vers la vue agrandie */
      g.strokeStyle = "rgba(209,73,91,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(ox + ow / 2, ly - lr); g.lineTo(dx0 - 4, top); g.moveTo(ox + ow / 2, ly + lr); g.lineTo(dx0 - 4, bot); g.stroke(); g.restore();
      /* fenêtre agrandie */
      g.save(); zrr(g, dx0 - 4, top, dx1 - dx0 + 4, bot - top, 8); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#d1495b"; g.lineWidth = 1.2; g.stroke(); g.clip();
      var heads = ["Bohr", "+ Dirac", "+ Lamb", "+ hyperfin"];
      var yPos = {}, LBL = [];
      FS_LEV.forEach(function(l){ yPos[l.id] = yE(l.E); });
      /* liens entre colonnes */
      g.setLineDash([3, 3]); g.strokeStyle = "rgba(120,135,160,.55)"; g.lineWidth = 1;
      FS_LEV.forEach(function(l){ if (!l.par) return; var pz = FS_BYID[l.par]; var xa = dx0 + cw * pz.col + cw * (phone ? 0.48 : 0.58), xb = dx0 + cw * l.col + cw * 0.08;
        g.beginPath(); g.moveTo(xa, yPos[pz.id]); g.lineTo(xb, yPos[l.id]); g.stroke(); });
      g.setLineDash([]);
      var cols = ["#2f6fd6", "#1f8a5b", "#9a5bd1", "#d1495b"];
      FS_LEV.forEach(function(l){ var y = yPos[l.id]; if (y < top - 30 || y > bot + 30) return;
        var xa = dx0 + cw * l.col + cw * 0.08, xb = xa + cw * (phone ? 0.4 : 0.5);
        g.strokeStyle = cols[l.col]; g.lineWidth = 2.4; g.beginPath(); g.moveTo(xa, y); g.lineTo(xb, y); g.stroke();
        if (y > top + 4 && y < bot - 4) LBL.push({x:xb + 3, y:y, s:l.lab, col:l.col, par:l.par, key:l.key, n:l.n}); });
      /* transitions remarquables */
      function wavy(x, y1, y2, col){ g.save(); g.strokeStyle = col; g.lineWidth = 1.8; g.beginPath(); var nS = 30; for (var q = 0; q <= nS; q++){ var yy = y1 + (y2 - y1) * q / nS, xx = x + Math.sin(q / nS * TAU * 3 + t * 6) * 3; if (q) g.lineTo(xx, yy); else g.moveTo(xx, yy); } g.stroke(); g.restore(); }
      var y21a = yPos.h1s1, y21b = yPos.h1s0; if (Math.abs(y21a - y21b) > 14 && y21a > top && y21b < bot) wavy(dx0 + cw * 3 + cw * 0.35, y21a + 2, y21b - 2, "#d1495b");
      var yfa = yPos.d2p3, yfb = yPos.d2p1; if (Math.abs(yfa - yfb) > 14 && yfa > top && yfb < bot) wavy(dx0 + cw * 1 + cw * 0.35, yfa + 2, yfb - 2, "#1f8a5b");
      var yla = yPos.l2s, ylb = yPos.l2p1; if (Math.abs(yla - ylb) > 14 && yla > top && ylb < bot) wavy(dx0 + cw * 2 + cw * 0.35, yla + 2, ylb - 2, "#9a5bd1");
      g.restore();
      /* étiquettes sans chevauchement (par colonne) */
      [0, 1, 2, 3].forEach(function(ci){
        var Lc = LBL.filter(function(o){ return o.col === ci; }).sort(function(a, b){ return a.y - b.y; }), cl = [];
        /* niveaux à moins de 13 px : un seul nom (le sous-niveau non résolu prend le nom de son parent) */
        Lc.forEach(function(o){ var p = cl[cl.length - 1]; if (p && o.y - p.y1 < 13){ p.m.push(o); p.y1 = o.y; } else cl.push({y:o.y, y1:o.y, m:[o], x:o.x}); });
        g.save(); g.font = "800 " + zfz(f, 9.5) + "px Mulish, system-ui, sans-serif"; var lastY = -1e9;
        cl.forEach(function(q){
          var keys = [], shorts = [];
          q.m.forEach(function(o){ var kk = o.key || ("n" + o.n); if (keys.indexOf(kk) < 0){ keys.push(kk); shorts.push(o.key ? o.key.replace(/[13]$/, "") : o.s); } });
          var names = keys.length === 1 && q.m.length === 1 ? [q.m[0].s] : keys.map(function(kk){ return kk.charAt(0) === "n" ? q.m.filter(function(z){ return !z.key && "n" + z.n === kk; })[0].s : FS_BYID["d" + kk].lab; });
          var room = dx0 + cw * (ci + 1) - q.x - 3, yy = (q.y + q.y1) / 2;
          var ns = []; q.m.forEach(function(z){ if (ns.indexOf(z.n) < 0) ns.push(z.n); }); ns.sort();
          var cands = [names.join(", "), shorts.filter(function(z, i){ return shorts.indexOf(z) === i; }).join(", "), "n = " + ns.join(", ")];
          /* 2s₁/₂ et 2p₁/₂ confondus : nom complet centré sous le trait (« = » chez Dirac, où l'égalité est exacte) */
          if (keys.length === 2 && keys.indexOf("2s") >= 0 && keys.indexOf("2p1") >= 0){
            if (yy - lastY >= 12){ lastY = yy; zT(S, f, ci === 1 ? "2s₁/₂ = 2p₁/₂" : "2s₁/₂, 2p₁/₂", q.x - 3 - cw * (phone ? 0.2 : 0.25), yy + 10, {size:zfz(f, 9.5), color:"#13233a", weight:800, bg:"rgba(255,255,255,.94)"}); }
            return;
          }
          var txt = cands.filter(function(z){ return g.measureText(z).width <= room; })[0];
          if (txt && yy - lastY >= 12){ lastY = yy; zT(S, f, txt, q.x + 2, yy, {size:zfz(f, 9.5), color:"#13233a", align:"left", weight:800, bg:"rgba(255,255,255,.94)"}); }
        });
        g.restore();
      });
      heads.forEach(function(h, ci){ zT(S, f, h, dx0 + cw * ci + cw * 0.36, top - 10, {size:zfz(f, phone ? 9.5 : 10.5), color:cols[ci], weight:800}); });
      /* flèches vers les niveaux hors champ (ex. Bohr, au-dessus) */
      FS_LEV.forEach(function(l){ if (l.col > 1 || (l.n !== T.n)) return; var y = yPos[l.id], x = dx0 + cw * l.col + cw * 0.36;
        if (y < top + 2 && y > top - (bot - top) * 40){ zT(S, f, "↑ " + zu(l.E - cE - HE / 2), x, top + 12, {size:zfz(f, 9), color:"#7a8596", weight:700}); }
        if (y > bot - 2 && y < bot + (bot - top) * 40){ zT(S, f, "↓ " + zu(cE - HE / 2 - l.E), x, bot - 10, {size:zfz(f, 9), color:"#7a8596", weight:700}); } });
      function zu(E){ E = Math.abs(E); return E >= 0.1 ? zN(E, 2) + " eV" : E >= 1e-4 ? zN(E * 1e3, 2) + " meV" : zN(E * 1e6, 1) + " µeV"; }
      /* barre d'échelle */
      var st = zstep(HE, 4), bh2 = st / HE * (bot - top), bx = dx0 + 6;
      g.strokeStyle = "#13233a"; g.lineWidth = 2; g.beginPath(); g.moveTo(bx, bot - 8); g.lineTo(bx, bot - 8 - bh2); g.moveTo(bx - 4, bot - 8); g.lineTo(bx + 4, bot - 8); g.moveTo(bx - 4, bot - 8 - bh2); g.lineTo(bx + 4, bot - 8 - bh2); g.stroke();
      var stl = st >= 0.1 ? zN(st, 2) + " eV" : st >= 1e-4 ? zN(st * 1e3, 3) + " meV" : st >= 1e-7 ? zN(st * 1e6, 3) + " µeV" : zN(st * 1e9, 1) + " neV";
      zT(S, f, stl, bx + 9, bot - 8 - bh2 / 2, {size:zfz(f, 9.5), color:"#13233a", align:"left", weight:800, bg:"rgba(255,255,255,.9)"});
      zT(S, f, "× " + (lz < 0.05 ? "1" : zsci(Z, 1)), FW - 12, FH - 10, {size:zfz(f, 11), color:"#d1495b", align:"right", weight:800});
      zT(S, f, "glisse ↕ pour zoomer", 12, FH - 10, {size:zfz(f, 9.5), color:"#7a8596", align:"left", weight:700});
      function zsup(s){ return String(s).split("").map(function(ch){ return SUPD[ch] || (ch === "," ? "˒" : ch); }).join(""); }
      /* ---- afficheurs ---- */
      var dE, nomE;
      if (tgt === "h1s"){ dE = FS_HF; nomE = "1s : F = 1 ↔ F = 0"; }
      else if (tgt === "fs2"){ dE = fsDirac(2, 1.5) - fsDirac(2, 0.5); nomE = "2p₃/₂ ↔ 2p₁/₂"; }
      else { dE = FS_L2S; nomE = "2s₁/₂ ↔ 2p₁/₂"; }
      var nu = dE / H_EVS;
      ro.set(0, "× " + (lz < 0.05 ? "1" : zsci(Z, 1, true)));
      ro.set(1, zN(dE * 1e6, dE * 1e6 < 10 ? 3 : 2) + " µeV");
      ro.set(2, nu >= 1e10 ? zN(nu / 1e9, 2) + " GHz" : zN(nu / 1e6, 1) + " MHz");
      ro.set(3, zN(CL / nu * 100, 2) + " cm");
      var msg = tgt === "h1s" ? "1s : spins de l'électron et du proton parallèles (F = 1) ou opposés (F = 0). Le basculement F = 1 → F = 0 émet un photon de " + zN(CL / nu * 100, 1) + " cm, rarissime pour un atome mais visible car la Galaxie contient énormément d'hydrogène." :
        tgt === "fs2" ? "Structure fine de n = 2 : " + zN(dE * 1e6, 1) + " µeV, soit " + zsci(dE / (FS_RY / 4), 2) + " fois |E₂| ≈ α²/4. Selon Dirac, 2s₁/₂ et 2p₁/₂ ont exactement la même énergie." :
        "Déplacement de Lamb : 2s₁/₂ est " + zN(dE * 1e6, 2) + " µeV au-dessus de 2p₁/₂, un effet de l'électrodynamique quantique (fluctuations du vide) absent de l'équation de Dirac.";
      nt.set(msg + " Carte : modèle simplifié (bras spiraux, rotation à " + GX.V0 + " km/s) ; chaque vitesse Doppler place un nuage.", "ok");
    });
  }
});
/* =====================================================================
   4. Hélium : parahélium et orthohélium (pq09)
   ===================================================================== */
var HE_CM = 8065.54429, HE_P = 54.4178, HE_ION = 198310.6672 / HE_CM, HE_G = -(HE_ION + HE_P);
/* configurations : n, ℓ de l'électron excité ; niveaux mesurés (cm⁻¹ au-dessus de 1s²) singulet / triplet */
var HE_C = {
  "1s2":{nom:"1s²", n:1, l:0, s:0, t:null},
  "1s2s":{nom:"1s2s", n:2, l:0, s:166277.4403, t:159855.9743},
  "1s2p":{nom:"1s2p", n:2, l:1, s:171134.8970, t:169086.9},
  "1s3s":{nom:"1s3s", n:3, l:0, s:184864.8293, t:183236.7915},
  "1s3p":{nom:"1s3p", n:3, l:1, s:186209.3651, t:185564.6},
  "1s3d":{nom:"1s3d", n:3, l:2, s:186104.9668, t:186101.5463}
};
Object.keys(HE_C).forEach(function(kk){
  var C = HE_C[kk];
  if (kk === "1s2"){ C.E0 = -2 * HE_P; C.J = HE_G - C.E0; C.K = 0; return; }
  var ES = HE_G + C.s / HE_CM, ET = HE_G + C.t / HE_CM;
  C.E0 = -HE_P * (1 + 1 / (C.n * C.n)); C.J = (ES + ET) / 2 - C.E0; C.K = (ES - ET) / 2;
});
function heE(C, lam, trip){ return C.E0 + lam * (C.J + (trip ? -C.K : C.K)); }
/* fonctions radiales hydrogénoïdes (non normalisées), u = r·R */
function heU(n, l, Z, r){
  var x = Z * r;
  if (n === 1) return r * Math.exp(-x);
  if (n === 2) return l === 0 ? r * (1 - x / 2) * Math.exp(-x / 2) : r * x * Math.exp(-x / 2) / Math.sqrt(3) * 0.5;
  if (l === 0) return r * (1 - 2 * x / 3 + 2 * x * x / 27) * Math.exp(-x / 3);
  if (l === 1) return r * x * (1 - x / 6) * Math.exp(-x / 3);
  return r * x * x * Math.exp(-x / 3) * 0.15;
}
function heCol(t){
  var S = [[11, 20, 48], [47, 111, 214], [127, 212, 255], [255, 243, 176]], u = Math.max(0, Math.min(1, t)) * 3, i = Math.min(2, Math.floor(u)), f = u - i;
  return [0, 1, 2].map(function(q){ return Math.round(S[i][q] + (S[i + 1][q] - S[i][q]) * f); });
}

SFA.sim({
  id:"pq-helium-ortho-para", ch:"pq09", tag:"Atomes à plusieurs électrons",
  titre:"L'hélium : deux électrons, deux familles de niveaux",
  resume:"Singulet (parahélium) et triplet (orthohélium) : la répulsion entre électrons sépare les deux familles, et 1s² reste sans partenaire triplet.",
  but:"Choisis une configuration et l'orientation des spins (ou clique un niveau). Allume la répulsion entre électrons : tous les niveaux montent, les singulets plus que les triplets. Glisse sur l'atome pour le tourner.",
  aRetenir:"Spins parallèles (triplet) ⇒ partie spatiale antisymétrique, nulle pour r₁ = r₂ : les électrons s'évitent, se repoussent moins, et le triplet est plus bas.",
  piege:"Ce n'est pas une interaction magnétique entre spins : l'écart vient de la répulsion électrique, triée par le principe de Pauli.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 300 : 330), f = k.canvas(phone ? 560 : 340);
    var cfg = "1s2s", trip = true;
    var cS = k.seg("Configuration", [["1s2", "1s²"], ["1s2s", "1s2s"], ["1s2p", "1s2p"], ["1s3d", "1s3d"]], "1s2s", function(v){ cfg = v; if (v === "1s2") { trip = false; sS.set("s"); } resample(); });
    var sS = k.seg("Spins des deux électrons", [["t", "Triplet ↑↑ (ortho)"], ["s", "Singulet ↑↓ (para)"]], "t", function(v){ trip = v === "t"; if (trip && cfg === "1s2"){ cfg = "1s2s"; cS.set("1s2s"); resample(); } });
    var lS = k.slider("Répulsion entre électrons λ", 0, 1, 0.01, 1, "", function(){ ramp = null; });
    k.button("Allumer la répulsion (0 → 1)", function(){ ramp = {t:0}; lS.set(0); }, true);
    var ro = k.readouts(["Énergie singulet", "Énergie triplet", "Écart singulet − triplet", "Excitation depuis 1s²"]);
    var nt = k.note("", "ok");
    var ramp = null;
    /* nuages de points (échantillonnés une fois par configuration et par écrantage) */
    var seed = 7; function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var cloudIn = [], cloudOut = [], zKey = "";
    function sample(n, l, Z, N){
      var pts = [], rmax = 3.2 * n * n / Z + 2, pmax = 0, i, r;
      for (i = 0; i < 200; i++){ r = rmax * i / 200; pmax = Math.max(pmax, Math.pow(heU(n, l, Z, r), 2)); }
      while (pts.length < N){
        r = rnd() * rmax; if (rnd() * pmax > Math.pow(heU(n, l, Z, r), 2)) continue;
        var ct = 2 * rnd() - 1, ph = rnd() * TAU, w = 1;
        if (l === 1) w = ct * ct; if (l === 2) w = Math.pow(1.5 * ct * ct - 0.5, 2);
        if (rnd() > w) continue;
        var st = Math.sqrt(1 - ct * ct); pts.push([r * st * Math.cos(ph), r * ct, r * st * Math.sin(ph)]);
      }
      return pts;
    }
    function zOut(){ return cfg === "1s2" ? 2 - 5 / 16 * lS.value : 2 - lS.value; }
    function resample(){
      var C = HE_C[cfg], key = cfg + ":" + zN(zOut(), 1); if (key === zKey) return; zKey = key; seed = 11;
      cloudIn = sample(1, 0, cfg === "1s2" ? zOut() : 2, 260);
      cloudOut = cfg === "1s2" ? [] : sample(C.n, C.l, zOut(), 520);
      e1 = {a:cloudIn[0], b:cloudIn[1], t:0}; e2 = {a:(cloudOut[0] || cloudIn[2]), b:(cloudOut[1] || cloudIn[3]), t:0};
    }
    var e1, e2; resample();
    var v = new Z3(); v.a = 0.4; v.b = 0.35; v.f = 0; v.set();
    zorbit(c, v, k, [-1.2, 1.2]);
    /* clic sur un niveau du diagramme */
    var HITS = [];
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      var h = null; HITS.forEach(function(q){ if (p.x >= q.x0 - 4 && p.x <= q.x1 + 4 && Math.abs(p.y - q.y) < 7) h = q; });
      if (type === "down" && h){ cfg = h.cfg; trip = h.trip; cS.set(h.cfgSeg || cfg); sS.set(trip ? "t" : "s"); resample(); k.redraw(); }
      if (type === "move") f.cv.style.cursor = h ? "pointer" : "default";
    });
    /* cartes |Ψ(r₁, r₂)|² */
    var MN = 84, mapS = document.createElement("canvas"), mapT = document.createElement("canvas"); mapS.width = mapS.height = mapT.width = mapT.height = MN;
    var mapKey = "", mapInfo = {};
    function buildMaps(){
      var C = HE_C[cfg], key = cfg + ":" + zN(lS.value, 2); if (key === mapKey) return; mapKey = key;
      var Zi = cfg === "1s2" ? zOut() : 2, Zo = zOut(), rM = cfg === "1s2" ? 4 : C.n === 2 ? 12 : 24, i, j;
      var ua = [], ub = [];
      for (i = 0; i < MN; i++){ var r = (i + 0.5) / MN * rM; ua.push(heU(1, 0, Zi, r)); ub.push(cfg === "1s2" ? heU(1, 0, Zi, r) : heU(C.n, C.l, Zo, r)); }
      var PS = new Float64Array(MN * MN), PT = new Float64Array(MN * MN), sS0 = 0, sT0 = 0;
      for (i = 0; i < MN; i++) for (j = 0; j < MN; j++){
        var a = ua[i] * ub[j], b = ub[i] * ua[j];
        PS[j * MN + i] = cfg === "1s2" ? a * a : (a + b) * (a + b); PT[j * MN + i] = cfg === "1s2" ? 0 : (a - b) * (a - b);
        sS0 += PS[j * MN + i]; sT0 += PT[j * MN + i];
      }
      var mx = 0, dS = 0, dT = 0;
      for (i = 0; i < MN * MN; i++){ PS[i] /= sS0 || 1; PT[i] = sT0 > 0 ? PT[i] / sT0 : 0; mx = Math.max(mx, PS[i], PT[i]); }
      for (i = 0; i < MN; i++) for (j = 0; j < MN; j++){ var d = Math.abs(i - j) / MN * rM; dS += PS[j * MN + i] * d; dT += PT[j * MN + i] * d; }
      [[mapS, PS], [mapT, PT]].forEach(function(q){
        var cx = q[0].getContext("2d"), im = cx.createImageData(MN, MN);
        for (var y = 0; y < MN; y++) for (var x = 0; x < MN; x++){ var col = heCol(Math.sqrt(q[1][(MN - 1 - y) * MN + x] / mx)), o = (y * MN + x) * 4; im.data[o] = col[0]; im.data[o + 1] = col[1]; im.data[o + 2] = col[2]; im.data[o + 3] = 255; }
        cx.putImageData(im, 0, 0);
      });
      mapInfo = {rM:rM, dS:dS, dT:cfg === "1s2" ? null : dT};
    }
    var lp = k.loop(function(dt, t){
      if (ramp){ ramp.t += dt; lS.set(Math.min(1, ramp.t / 3)); if (ramp.t >= 3) ramp = null; resample(); }
      [e1, e2].forEach(function(e, n){
        e.t += dt * (n ? 0.9 : 1.6);
        if (e.t >= 1){ e.t = 0; e.a = e.b; var pool = n && cloudOut.length ? cloudOut : cloudIn; e.b = pool[Math.floor(rnd() * pool.length)]; }
      });
      if (!v.user){ v.a += dt * 0.25; v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, C = HE_C[cfg], lam = lS.value, t = performance.now() / 1000;
      resample(); buildMaps();
      /* ================= scène : tube à hélium et loupe sur un atome ================= */
      zlab(ctx, W, H, "#1f2840", "#0a0e19");
      var ty = H * 0.8; var gT = ctx.createLinearGradient(0, ty, 0, H); gT.addColorStop(0, "#7a5232"); gT.addColorStop(1, "#3e2716"); ctx.fillStyle = gT; ctx.fillRect(0, ty, W, H - ty);
      var tx0 = W * 0.05, tx1 = W * (phone ? 0.36 : 0.32), tyc = H * 0.5, tr = Math.min(16, H * 0.05);
      /* supports et électrodes */
      ctx.fillStyle = "#39404d"; ctx.fillRect(tx0 + 6, tyc, 8, ty - tyc); ctx.fillRect(tx1 - 14, tyc, 8, ty - tyc);
      /* lueur du tube (hélium : jaune-rosé) */
      var fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 3.1);
      zglow(ctx, (tx0 + tx1) / 2, tyc, (tx1 - tx0) * 0.7, [255, 200, 170], 0.25 * fl);
      ctx.save(); ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(220,235,255,.35)"; ctx.lineWidth = tr * 2 + 4; ctx.beginPath(); ctx.moveTo(tx0, tyc); ctx.lineTo(tx1, tyc); ctx.stroke();
      ctx.strokeStyle = "rgba(255,190,160," + (0.85 * fl) + ")"; ctx.lineWidth = tr * 1.4; ctx.stroke();
      ctx.strokeStyle = "rgba(255,245,230,.8)"; ctx.lineWidth = tr * 0.4; ctx.stroke(); ctx.restore();
      ctx.fillStyle = "#8d97a8"; ctx.fillRect(tx0 - 8, tyc - tr * 0.7, 10, tr * 1.4); ctx.fillRect(tx1 - 2, tyc - tr * 0.7, 10, tr * 1.4);
      ztag(S, c, "tube à hélium", (tx0 + tx1) / 2, tyc - tr - 18, {size:11});
      /* loupe */
      var lx = W * (phone ? 0.68 : 0.66), ly = H * 0.46, lr = Math.min(H * 0.42, W * (phone ? 0.3 : 0.3));
      var ax = tx0 + (tx1 - tx0) * 0.62;
      ctx.save(); ctx.strokeStyle = "rgba(200,220,255,.18)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, tyc - 4); ctx.lineTo(lx - lr * 0.2, ly - lr); ctx.moveTo(ax, tyc + 4); ctx.lineTo(lx - lr * 0.2, ly + lr); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr, 0, TAU); var gl = ctx.createRadialGradient(lx, ly, lr * 0.1, lx, ly, lr); gl.addColorStop(0, "#16203a"); gl.addColorStop(1, "#070b15"); ctx.fillStyle = gl; ctx.fill(); ctx.clip();
      /* atome : nuages de points en 3D */
      var rView = cfg === "1s2" ? 2.2 : C.n === 2 ? 9 : 18, sc = lr * 0.92 / rView;
      var P = [];
      cloudIn.forEach(function(q){ var r3 = v.rot(q[0], q[1], q[2]); P.push([r3, "#5ab8f5"]); });
      cloudOut.forEach(function(q){ var r3 = v.rot(q[0], q[1], q[2]); P.push([r3, "#f0a04b"]); });
      P.sort(function(a, b){ return a[0][2] - b[0][2]; });
      var r1s = (cfg === "1s2" ? 1 / zOut() : 0.5) * sc;
      zglow(ctx, lx, ly, r1s * 3.2, "#5ab8f5", 0.55);
      ctx.globalCompositeOperation = "lighter";
      P.forEach(function(q){ var X = lx + q[0][0] * sc, Y = ly - q[0][1] * sc, dz = q[0][2] / rView, sz = 2.2 + 1.2 * dz; if (Math.abs(X - lx) > lr || Math.abs(Y - ly) > lr) return;
        ctx.fillStyle = za(q[1], 0.5 + 0.25 * dz); ctx.beginPath(); ctx.arc(X, Y, Math.max(1, sz), 0, TAU); ctx.fill(); });
      ctx.globalCompositeOperation = "source-over";
      /* noyau */
      [[0.12, 0.08, 0, "#e0533d"], [-0.1, -0.06, 0.05, "#e0533d"], [-0.06, 0.1, -0.08, "#aab4c3"], [0.08, -0.1, 0.06, "#aab4c3"]].forEach(function(q){
        var r3 = v.rot(q[0], q[1], q[2]); q.r = r3; });
      [[0.12, 0.08, 0, "#e0533d"], [-0.1, -0.06, 0.05, "#e0533d"], [-0.06, 0.1, -0.08, "#aab4c3"], [0.08, -0.1, 0.06, "#aab4c3"]].map(function(q){ return [v.rot(q[0], q[1], q[2]), q[3]]; })
        .sort(function(a, b){ return a[0][2] - b[0][2]; }).forEach(function(q){ zball(ctx, lx + q[0][0] * 26, ly - q[0][1] * 26, 5.5, q[1]); });
      /* électrons et spins */
      function epos(e){ var u = e.t * e.t * (3 - 2 * e.t); return [e.a[0] + (e.b[0] - e.a[0]) * u, e.a[1] + (e.b[1] - e.a[1]) * u, e.a[2] + (e.b[2] - e.a[2]) * u]; }
      [[e1, true], [e2, trip]].forEach(function(q, n){
        var p3 = v.rot.apply(v, epos(q[0])), X = lx + p3[0] * sc, Y = ly - p3[1] * sc;
        X = Math.max(lx - lr + 14, Math.min(lx + lr - 14, X)); Y = Math.max(ly - lr + 22, Math.min(ly + lr - 22, Y));
        zglow(ctx, X, Y, 14, n && cfg !== "1s2" ? "#f0a04b" : "#5ab8f5", 0.6); zball(ctx, X, Y, 6, "#ffffff");
        var up = q[1]; S.draw.arrow(c, X + 11, Y + (up ? 9 : -9), X + 11, Y + (up ? -11 : 11), up ? "#ffd34d" : "#ff7a8a", 2.4);
      });
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "#c9d1dc"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(lx, ly, lr - 4, -2.4, -1.2); ctx.stroke();
      ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.strokeStyle = "#6b4a2c"; ctx.beginPath(); ctx.moveTo(lx + lr * 0.72, ly + lr * 0.72); ctx.lineTo(lx + lr * 0.72 + 30, ly + lr * 0.72 + 30); ctx.stroke(); ctx.restore();
      ztag(S, c, C.nom + (cfg === "1s2" ? " · singulet" : trip ? " · triplet (ortho)" : " · singulet (para)"), lx, ly - lr - 2 < 18 ? 16 : ly - lr - 2, {size:11.5, color:trip ? "#ffd34d" : "#ff9fb0"});
      zT(S, c, "glisse sur l'atome pour le tourner", 10, H - 12, {size:zfz(c, 10.5), color:"rgba(230,215,200,.85)", align:"left", weight:600});
      zT(S, c, "bleu : 1s  ·  orange : électron excité", 10, 14, {size:zfz(c, 10.5), color:"rgba(210,222,240,.85)", align:"left", weight:700});

      /* ================= diagramme de Grotrian + cartes ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var dx0 = 8, dx1 = phone ? FW - 8 : FW * 0.6, dy0 = 6, dy1 = phone ? FH * 0.56 : FH - 6;
      g.save(); zrr(g, dx0, dy0, dx1 - dx0, dy1 - dy0, 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore();
      var ax0 = dx0 + 40, ax1 = dx1 - 6, colW = (ax1 - ax0) / 6;
      var uT = dy0 + 44, uB = dy0 + (dy1 - dy0) * 0.7, gT0 = uB + 26, gB = dy1 - 10;
      function yU(E){ return uB - (E + 69) / 15 * (uB - uT); }
      function yG(E){ return gB - 6 - (E + 110) / 33 * (gB - gT0 - 6); }
      zT(S, f, "Parahélium (singulet)", ax0 + colW * 1.5, dy0 + 13, {size:zfz(f, phone ? 10.5 : 11.5), color:"#c2406a", weight:800});
      zT(S, f, "Orthohélium (triplet)", ax0 + colW * 4.5, dy0 + 13, {size:zfz(f, phone ? 10.5 : 11.5), color:"#b07d00", weight:800});
      ["¹S", "¹P", "¹D", "³S", "³P", "³D"].forEach(function(h, n){ zT(S, f, h, ax0 + colW * (n + 0.5), dy0 + 30, {size:zfz(f, 11.5), color:"#13233a", weight:800}); });
      g.strokeStyle = "#e3e8f0"; g.lineWidth = 1; g.beginPath(); g.moveTo(ax0 + colW * 3, dy0 + 6); g.lineTo(ax0 + colW * 3, dy1 - 6); g.stroke();
      /* axes d'énergie (deux morceaux) */
      g.strokeStyle = "#b8c2d0"; g.beginPath(); g.moveTo(ax0 - 4, uT - 4); g.lineTo(ax0 - 4, uB); g.moveTo(ax0 - 4, gT0); g.lineTo(ax0 - 4, gB); g.stroke();
      [-55, -60, -65].forEach(function(E){ zT(S, f, zN(E, 0), ax0 - 8, yU(E), {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:600}); });
      [-80, -100].forEach(function(E){ zT(S, f, zN(E, 0), ax0 - 8, yG(E), {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:600}); });
      zT(S, f, "eV", ax0 - 8, uT - 10, {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:700});
      zT(S, f, "≈", ax0 - 4, (uB + gT0) / 2, {size:zfz(f, 13), color:"#8792a2", weight:800});
      /* seuil d'ionisation */
      g.save(); g.setLineDash([4, 4]); g.strokeStyle = "#8792a2"; g.beginPath(); g.moveTo(ax0, yU(-HE_P)); g.lineTo(ax1, yU(-HE_P)); g.stroke(); g.restore();
      zT(S, f, "He⁺ + e⁻ (ionisation)", ax1 - 2, yU(-HE_P) - 8, {size:zfz(f, 9.5), color:"#7a8596", align:"right", weight:700});
      HITS = [];
      var LCOL = {"0":0, "1":1, "2":2};
      Object.keys(HE_C).forEach(function(kk){
        var Cq = HE_C[kk];
        [false, true].forEach(function(tr2){
          if (kk === "1s2" && tr2) return;
          var col = LCOL[String(Cq.l)] + (tr2 ? 3 : 0), xa = ax0 + colW * col + colW * 0.14, xb = ax0 + colW * (col + 1) - colW * 0.14;
          var E = heE(Cq, lam, tr2), y = kk === "1s2" ? yG(E) : yU(E), on = kk === cfg && tr2 === trip;
          /* trace du niveau sans répulsion */
          if (lam > 0.02){ var y0 = kk === "1s2" ? yG(Cq.E0) : yU(Cq.E0); if (y0 > uT - 6 || kk === "1s2"){ g.save(); g.setLineDash([2, 3]); g.strokeStyle = "rgba(120,130,145,.45)"; g.beginPath(); g.moveTo(xa, y0); g.lineTo(xb, y0); g.stroke(); g.restore(); } }
          g.strokeStyle = on ? (tr2 ? "#e0a000" : "#d1495b") : (tr2 ? "#c9a24a" : "#d27b92"); g.lineWidth = on ? 4 : 2.4;
          g.beginPath(); g.moveTo(xa, y); g.lineTo(xb, y); g.stroke();
          HITS.push({x0:xa, x1:xb, y:y, cfg:kk, trip:tr2, cfgSeg:["1s3s", "1s3p"].indexOf(kk) >= 0 ? "" : kk});
          if (Cq.n === 2 || kk === "1s2" || (kk === "1s3d")) zT(S, f, Cq.nom, (xa + xb) / 2, y + (kk === "1s2" ? -10 : (Cq.n === 2 ? 10 : -9)), {size:zfz(f, 9), color:"#5f6b7a", weight:700});
        });
      });
      /* 1s² triplet : case vide */
      var xg = ax0 + colW * 3 + colW * 0.14, xg1 = ax0 + colW * 4 - colW * 0.14, yg = yG(heE(HE_C["1s2"], lam, false));
      g.save(); g.setLineDash([3, 3]); g.strokeStyle = "#c2c9d4"; g.strokeRect(xg, yg - 9, xg1 - xg, 18); g.restore();
      zT(S, f, "1s² ↑↑", (xg + xg1) / 2, yg, {size:zfz(f, 9), color:"#9aa4b2", weight:700});
      zT(S, f, "interdit (Pauli)", xg1 + 6, yg, {size:zfz(f, 9.5), color:"#9aa4b2", align:"left", weight:700});
      /* cartes */
      var mx0 = phone ? 8 : dx1 + 12, my0 = phone ? dy1 + 10 : 6, mw = phone ? (FW - 24) / 2 : FW - dx1 - 20;
      var side = phone ? Math.min(mw - 26, FH - my0 - 46) : Math.min(mw - 30, (FH - 12) / 2 - 46);
      [[mapS, "singulet", "#c2406a", mapInfo.dS], [mapT, "triplet", "#b07d00", mapInfo.dT]].forEach(function(q, n){
        var bx = phone ? mx0 + n * (mw + 8) : mx0, by = phone ? my0 : my0 + n * (side + 50);
        var ix = bx + 24, iy = by + 18;
        zT(S, f, "|Ψ(r₁, r₂)|² " + q[1], bx, by + 7, {size:zfz(f, 10.5), color:q[2], align:"left", weight:800});
        g.save(); g.imageSmoothingEnabled = true; g.drawImage(q[0], ix, iy, side, side);
        g.setLineDash([4, 3]); g.strokeStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.moveTo(ix, iy + side); g.lineTo(ix + side, iy); g.stroke(); g.restore();
        g.strokeStyle = "#13233a"; g.lineWidth = 1; g.strokeRect(ix + 0.5, iy + 0.5, side - 1, side - 1);
        if (q[3] == null){ g.fillStyle = "rgba(11,20,48,.75)"; g.fillRect(ix, iy, side, side); zT(S, f, "interdit (Pauli)", ix + side / 2, iy + side / 2, {size:zfz(f, 10.5), color:"#fff", weight:800}); }
        else if (HE_C[cfg].l > 0) zT(S, f, "coupe : r₁, r₂ parallèles", ix + 5, iy + 10, {size:zfz(f, 9.5), color:"#fff", align:"left", weight:800, bg:"rgba(11,20,48,.7)"});
        zT(S, f, "r₁", ix + side - 4, iy + side + 9, {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:700});
        zT(S, f, "0", ix, iy + side + 9, {size:zfz(f, 9), color:"#5f6b7a", weight:600});
        zT(S, f, zN(mapInfo.rM, 0) + " a₀", ix + side * 0.5, iy + side + 9, {size:zfz(f, 9), color:"#5f6b7a", weight:600});
        zT(S, f, "r₂", ix - 4, iy + 6, {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:700});
        if (q[3] != null) zT(S, f, "⟨|r₁ − r₂|⟩ = " + zN(q[3], 1) + " a₀", ix + side, iy + side + 22, {size:zfz(f, 9.5), color:"#13233a", align:"right", weight:800});
      });
      /* ---- afficheurs ---- */
      var Eg = heE(HE_C["1s2"], lam, false), ES = heE(C, lam, false), ET = cfg === "1s2" ? null : heE(C, lam, true);
      ro.set(0, zN(ES, 2) + " eV");
      ro.set(1, ET == null ? "aucun (Pauli)" : zN(ET, 2) + " eV");
      var dST = ET == null ? 0 : (ES - ET) * 1e3;
      ro.set(2, ET == null ? "—" : zN(dST, Math.abs(dST) < 10 ? 2 : 0) + " meV");
      ro.set(3, cfg === "1s2" ? "0 eV" : zN((trip ? ET : ES) - Eg, 2) + " eV");
      nt.set(cfg === "1s2" ? "1s² : les deux électrons sont dans la même orbitale, la partie spatiale est forcément symétrique, donc les spins sont opposés. Il n'existe pas de 1s² triplet." :
        "λ = 0 : électrons indépendants, singulet et triplet ont la même énergie (" + zN(C.E0, 2) + " eV). En allumant la répulsion, l'énergie monte de J ± K : le singulet de " + zN(lam * (C.J + C.K), 2) + " eV, le triplet de " + zN(lam * (C.J - C.K), 2) + " eV (K = " + zN(lam * C.K * 1e3, lam * C.K * 1e3 < 10 ? 2 : 0) + " meV). À λ = 1, ce sont les niveaux mesurés ; entre les deux, modèle linéaire. Pointillés : niveaux sans répulsion.", "ok");
    });
  }
});
/* =====================================================================
   5. Effet d'écran (pq09)
   ===================================================================== */
var EC_HA = 27.211386245988;
/* atomes à un électron externe : Z, exposant du nuage 1s², énergies mesurées (eV, liaison de l'électron externe) */
var EC_AT = {
  li:{nom:"Li", Z:3, zeta:2.69, rmax:60, mes:{"2s":-5.392, "2p":-3.544, "3s":-2.018, "3p":-1.558, "3d":-1.513}},
  be:{nom:"Be⁺", Z:4, zeta:3.68, rmax:40, mes:{"2s":-18.211, "2p":-14.252, "3s":-7.272, "3p":-6.247, "3d":-6.054}}
};
var EC_ORB = {"2s":{n:2, l:0, k:1}, "2p":{n:2, l:1, k:0}, "3s":{n:3, l:0, k:2}, "3p":{n:3, l:1, k:1}, "3d":{n:3, l:2, k:0}};
var EC_N = 3000;
/* fraction du nuage 1s (exposant ζ) contenue dans une sphère de rayon r */
function ecQ(zeta, r){ var x = 2 * zeta * r; return 1 - Math.exp(-x) * (1 + x + x * x / 2); }
/* potentiel (hartree) : noyau Z + nuage 1s de q électrons */
function ecV(Z, zeta, q, r){ return -Z / r + q * (1 / r - (zeta + 1 / r) * Math.exp(-2 * zeta * r)); }
/* niveaux et fonctions u(r) par différences finies (matrice tridiagonale, bissection de Sturm + itération inverse) */
function ecSolve(A, q, l, kIdx){
  var N = EC_N, h = A.rmax / (N + 1), d = new Float64Array(N), e2 = 1 / (4 * h * h * h * h), off = -0.5 / (h * h), i;
  for (i = 0; i < N; i++){ var r = h * (i + 1); d[i] = 1 / (h * h) + ecV(A.Z, A.zeta, q, r) + l * (l + 1) / (2 * r * r); }
  function count(x){ var c = 0, p = d[0] - x; if (p < 0) c++; for (var j = 1; j < N; j++){ if (Math.abs(p) < 1e-300) p = 1e-300; p = d[j] - x - e2 / p; if (p < 0) c++; } return c; }
  var lo = -A.Z * A.Z, hi = 0;
  for (var it = 0; it < 60; it++){ var mid = (lo + hi) / 2; if (count(mid) > kIdx) hi = mid; else lo = mid; }
  var E = (lo + hi) / 2;
  /* itération inverse (algorithme de Thomas) */
  var x = new Float64Array(N), b = new Float64Array(N), cp = new Float64Array(N); for (i = 0; i < N; i++) b[i] = 1;
  var sh = E + 1e-7;
  for (var pass = 0; pass < 3; pass++){
    var m = d[0] - sh; cp[0] = off / m; x[0] = b[0] / m;
    for (i = 1; i < N; i++){ m = d[i] - sh - off * cp[i - 1]; cp[i] = off / m; x[i] = (b[i] - off * x[i - 1]) / m; }
    for (i = N - 2; i >= 0; i--) x[i] -= cp[i] * x[i + 1];
    var s = 0; for (i = 0; i < N; i++) s += x[i] * x[i]; s = Math.sqrt(s * h); for (i = 0; i < N; i++) b[i] = x[i] / s;
  }
  var P = new Float64Array(N); for (i = 0; i < N; i++) P[i] = b[i] * b[i];   /* ∫P dr = 1 */
  return {E:E * EC_HA, P:P, h:h};
}

SFA.sim({
  id:"pq-effet-ecran", ch:"pq09", tag:"Atomes à plusieurs électrons",
  titre:"Effet d'écran : pourquoi 2s passe sous 2p",
  resume:"Un atome coupé en deux : le nuage 1s cache une partie du noyau, et 2s, qui plonge plus souvent sous ce nuage, est plus lié que 2p.",
  but:"Choisis l'orbitale de l'électron externe et règle la charge du nuage 1s (l'écran). Regarde la courbe |u(r)|², la jauge de charge ressentie et les niveaux se séparer. Glisse sur l'atome pour le tourner.",
  aRetenir:"L'électron externe sent la charge Z(r) = Z − (électrons 1s plus proches du noyau que lui) : plus il pénètre sous le nuage 1s, plus Z_eff est grand, d'où E(ns) < E(np) < E(nd).",
  piege:"Avec un seul électron (hydrogène ou ion hydrogénoïde), 2s et 2p ont la même énergie : la séparation vient uniquement des autres électrons.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 350), f = k.canvas(phone ? 470 : 280);
    var at = "li", orb = "2s";
    k.seg("Atome", [["li", "Li (Z = 3)"], ["be", "Be⁺ (Z = 4)"]], "li", function(v){ at = v; sol = null; });
    var oS = k.seg("Électron externe dans", [["2s", "2s"], ["2p", "2p"], ["3s", "3s"], ["3p", "3p"], ["3d", "3d"]], "2s", function(v){ orb = v; cloud = null; });
    var qS = k.slider("Écran : électrons dans le nuage 1s", 0, 2, 0.05, 2, "", function(){ sol = null; });
    var mT = k.toggle("Montrer les valeurs mesurées", true);
    var ro = k.readouts(["Z_eff = n·√(−E / 13,6 eV)", "Énergie (modèle)", "Temps sous le nuage 1s", "E(2p) − E(2s)"]);
    var nt = k.note("", "ok");
    var sol = null, solKey = "", cloud = null, cloudKey = "";
    function solve(){
      var key = at + ":" + qS.value; if (sol && key === solKey) return; solKey = key; sol = {};
      var A = EC_AT[at]; Object.keys(EC_ORB).forEach(function(o){ var O = EC_ORB[o]; sol[o] = ecSolve(A, qS.value, O.l, O.k); });
      cloud = null;
    }
    var seed = 3; function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function buildCloud(){
      var key = solKey + ":" + orb; if (cloud && key === cloudKey) return; cloudKey = key; seed = 5;
      var A = EC_AT[at], s0 = sol[orb], O = EC_ORB[orb], N = EC_N, cum = new Float64Array(N), acc = 0, i, pts = [];
      for (i = 0; i < N; i++){ acc += s0.P[i] * s0.h; cum[i] = acc; }
      function rOuter(){ var u = rnd() * acc, lo = 0, hi = N - 1; while (hi - lo > 1){ var m = (lo + hi) >> 1; if (cum[m] < u) lo = m; else hi = m; } return (hi + 1) * s0.h; }
      while (pts.length < 900){
        var ct = 2 * rnd() - 1, w = O.l === 1 ? ct * ct : O.l === 2 ? Math.pow(1.5 * ct * ct - 0.5, 2) : 1; if (rnd() > w) continue;
        var r = rOuter(), ph = rnd() * TAU, st = Math.sqrt(1 - ct * ct); pts.push([r * st * Math.cos(ph), r * ct, r * st * Math.sin(ph), 1]);
      }
      /* nuage 1s : P(r) ∝ r² e^{−2ζr} */
      while (pts.length < 1300){ var r1 = rnd() * 3 / A.zeta; if (rnd() > Math.pow(r1 * A.zeta, 2) * Math.exp(-2 * A.zeta * r1 + 2)) continue;
        var c1 = 2 * rnd() - 1, p1 = rnd() * TAU, s1 = Math.sqrt(1 - c1 * c1); pts.push([r1 * s1 * Math.cos(p1), r1 * c1, r1 * s1 * Math.sin(p1), 0]); }
      cloud = pts;
    }
    /* coupe de l'atome : densité dans le plan z = 0 (texture) */
    var TX = 150, tex = document.createElement("canvas"); tex.width = tex.height = TX; var texKey = "";
    function buildTex(rView, col){
      var key = cloudKey + ":" + rView; if (key === texKey) return; texKey = key;
      var A = EC_AT[at], s0 = sol[orb], O = EC_ORB[orb], tc = tex.getContext("2d"), im = tc.createImageData(TX, TX), i, j, mo = 0, m1 = 0;
      var co = zrgb(col), vals = new Float64Array(TX * TX * 2);
      for (j = 0; j < TX; j++) for (i = 0; i < TX; i++){
        var x = (i + 0.5) / TX * 2 * rView - rView, y = rView - (j + 0.5) / TX * 2 * rView, r = Math.hypot(x, y); if (r > rView){ vals[2 * (j * TX + i)] = -1; continue; }
        var ct = r > 0 ? y / r : 1, w = O.l === 1 ? ct * ct * 3 : O.l === 2 ? Math.pow(1.5 * ct * ct - 0.5, 2) * 5 : 1;
        /* luminosité ∝ probabilité radiale (anneaux aux rayons les plus probables) */
        var idx = Math.min(EC_N - 1, Math.max(0, Math.round(r / s0.h) - 1)), ro = s0.P[idx] * w;
        var r1 = r * r * Math.exp(-2 * A.zeta * r);
        vals[2 * (j * TX + i)] = ro; vals[2 * (j * TX + i) + 1] = r1; mo = Math.max(mo, ro); m1 = Math.max(m1, r1);
      }
      for (i = 0; i < TX * TX; i++){
        var o = i * 4; if (vals[2 * i] < 0){ im.data[o + 3] = 0; continue; }
        var a = Math.pow(vals[2 * i] / mo, 0.7), b = Math.pow(vals[2 * i + 1] / m1, 0.7);
        im.data[o] = Math.min(255, 12 + co[0] * a + 90 * b); im.data[o + 1] = Math.min(255, 18 + co[1] * a + 184 * b); im.data[o + 2] = Math.min(255, 40 + co[2] * a + 245 * b); im.data[o + 3] = 235;
      }
      tc.putImageData(im, 0, 0);
    }
    var v = new Z3(); v.a = 0.45; v.b = 0.32; v.f = 0; v.set();
    zorbit(c, v, k, [-1.2, 1.2]);
    var probe = {a:null, b:null, t:1}, needle = 0;
    var lp = k.loop(function(dt, t){
      if (!v.user){ v.a = 0.45 + 0.42 * Math.sin(t * 0.3); v.set(); }
      if (cloud){ probe.t += dt * 0.8; if (probe.t >= 1 || !probe.a){ probe.t = 0; probe.a = probe.b || cloud[0]; var cand = cloud.filter(function(p){ return p[3] === 1; }); probe.b = cand[Math.floor(rnd() * cand.length)]; } }
      k.redraw();
    });
    lp.play();
    function r90(z){ var lo = 0, hi = 10; for (var i = 0; i < 50; i++){ var m = (lo + hi) / 2; if (ecQ(z, m) < 0.9) lo = m; else hi = m; } return (lo + hi) / 2; }
    k.draw(function(){
      solve(); buildCloud();
      var ctx = c.ctx, W = c.W, H = c.H, i, A = EC_AT[at], q = qS.value, O = EC_ORB[orb], s0 = sol[orb], t = performance.now() / 1000;
      var rc = r90(A.zeta), Zeff = O.n * Math.sqrt(Math.max(0, -s0.E) / RYEV);
      var inside = 0; for (i = 0; i < EC_N; i++){ if ((i + 1) * s0.h <= rc) inside += s0.P[i] * s0.h; }
      /* ================= scène : atome coupé ================= */
      zlab(ctx, W, H, "#1d2740", "#090d18");
      var cx = phone ? W * 0.5 : W * 0.42, cy = H * 0.5, R = Math.min(phone ? W * 0.42 : W * 0.36, H * 0.44);
      var rView = O.n === 2 ? (at === "li" ? 9 : 6) : (at === "li" ? 20 : 13), sc = R / rView;
      /* socle */
      ctx.save(); var gp = ctx.createRadialGradient(cx, H * 0.93, 4, cx, H * 0.93, R * 1.1); gp.addColorStop(0, "rgba(120,150,200,.3)"); gp.addColorStop(1, "rgba(120,150,200,0)");
      ctx.fillStyle = gp; ctx.beginPath(); ctx.ellipse(cx, H * 0.93, R * 1.1, R * 0.16, 0, 0, TAU); ctx.fill(); ctx.restore();
      /* demi-sphère arrière (verre) */
      ctx.save(); var gsp = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R); gsp.addColorStop(0, "rgba(120,150,210,.10)"); gsp.addColorStop(1, "rgba(60,80,130,.28)");
      ctx.fillStyle = gsp; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.restore();
      /* points (moitié z ≤ 0 seulement : l'atome est coupé) */
      var col = {"2s":"#f0a04b", "2p":"#4cd18a", "3s":"#f07a5a", "3p":"#b48cff", "3d":"#ff6fb1"}[orb];
      var L = [];
      (cloud || []).forEach(function(p){ if (p[2] > 0) return; var r3 = v.rot(p[0], p[1], p[2]); L.push([r3, p[3]]); });
      L.sort(function(a, b){ return a[0][2] - b[0][2]; });
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      L.forEach(function(p){ var X = cx + p[0][0] * sc, Y = cy - p[0][1] * sc; if (Math.hypot(X - cx, Y - cy) > R * 1.02) return;
        ctx.fillStyle = za(p[1] ? col : "#5ab8f5", p[1] ? 0.55 : 0.45); ctx.beginPath(); ctx.arc(X, Y, p[1] ? 2.1 : 1.6, 0, TAU); ctx.fill(); });
      ctx.restore();
      /* face de coupe (plan z = 0) : densité réelle, posée en perspective affine */
      buildTex(rView, col);
      var vz = v.rot(0, 0, 1), O0 = v.rot(0, 0, 0), ex = v.rot(1, 0, 0), ey = v.rot(0, 1, 0);
      ctx.save(); var dpr = ctx.canvas.width / W;
      ctx.globalAlpha = vz[2] > 0 ? 0.92 : 0.5;
      ctx.setTransform(dpr * ex[0] * sc * 2 * rView / TX, -dpr * ex[1] * sc * 2 * rView / TX, -dpr * ey[0] * sc * 2 * rView / TX, dpr * ey[1] * sc * 2 * rView / TX,
        dpr * (cx - (ex[0] - ey[0]) * sc * rView), dpr * (cy + (ex[1] - ey[1]) * sc * rView));
      ctx.drawImage(tex, 0, 0); ctx.restore();
      /* bord du disque de coupe */
      ctx.save(); ctx.strokeStyle = "rgba(190,215,255,.55)"; ctx.lineWidth = 1.4; ctx.beginPath();
      for (i = 0; i <= 60; i++){ var w2 = i / 60 * TAU, X2 = cx + (ex[0] * Math.cos(w2) + ey[0] * Math.sin(w2)) * sc * rView, Y2 = cy - (ex[1] * Math.cos(w2) + ey[1] * Math.sin(w2)) * sc * rView; if (i) ctx.lineTo(X2, Y2); else ctx.moveTo(X2, Y2); }
      ctx.stroke(); ctx.restore();
      /* noyau */
      zball(ctx, cx, cy, 6, "#e0533d"); zT(S, c, "+" + A.Z, cx, cy + 0.5, {size:8.5, color:"#fff", weight:800});
      /* électron sonde : charge ressentie là où il se trouve */
      var Zr = A.Z, pr = null;
      if (probe.a && probe.b){
        var u = probe.t * probe.t * (3 - 2 * probe.t), P3 = [probe.a[0] + (probe.b[0] - probe.a[0]) * u, probe.a[1] + (probe.b[1] - probe.a[1]) * u, Math.min(0, probe.a[2] + (probe.b[2] - probe.a[2]) * u)];
        var rr = Math.hypot(P3[0], P3[1], P3[2]); Zr = A.Z - q * ecQ(A.zeta, rr);
        var r3 = v.rot(P3[0], P3[1], P3[2]); pr = {x:cx + r3[0] * sc, y:cy - r3[1] * sc, r:rr};
        if (Math.hypot(pr.x - cx, pr.y - cy) < R){ zglow(ctx, pr.x, pr.y, 16, "#ffffff", 0.5); zball(ctx, pr.x, pr.y, 5, "#ffe9a8"); }
      }
      needle += (Zr - needle) * 0.15;
      ztag(S, c, "nuage 1s (" + zN(q, 2) + " e⁻)", phone ? 10 : 12, 18, {size:10.5, color:"#9fd0ff", align:"left"});
      ztag(S, c, "orbitale " + orb, phone ? 10 : 12, 44, {size:10.5, color:col, align:"left"});
      /* jauge analogique : Z(r) à l'endroit de l'électron */
      var gx = phone ? W - 62 : W - 86, gy = phone ? 62 : 80, gr = phone ? 46 : 60;
      ctx.save(); var gg = ctx.createRadialGradient(gx - gr * 0.3, gy - gr * 0.3, 2, gx, gy, gr * 1.1); gg.addColorStop(0, "#fbfcfe"); gg.addColorStop(1, "#c3cad6");
      ctx.fillStyle = "#2a3242"; zrr(ctx, gx - gr - 6, gy - gr - 6, 2 * gr + 12, gr + 34, 10); ctx.fill(); ctx.fillStyle = gg; zrr(ctx, gx - gr, gy - gr, 2 * gr, gr + 22, 7); ctx.fill();
      var a0 = PI * 1.0, a1 = PI * 2.0; function ang(z){ return a0 + (z - 0) / A.Z * (a1 - a0); }
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.2;
      for (i = 0; i <= A.Z; i++){ var aa = ang(i); ctx.beginPath(); ctx.moveTo(gx + Math.cos(aa) * gr * 0.74, gy + Math.sin(aa) * gr * 0.74); ctx.lineTo(gx + Math.cos(aa) * gr * 0.9, gy + Math.sin(aa) * gr * 0.9); ctx.stroke();
        zT(S, c, String(i), gx + Math.cos(aa) * gr * 0.58, gy + Math.sin(aa) * gr * 0.58, {size:phone ? 9 : 10, color:"#13233a", weight:800}); }
      /* repère Z_eff de l'orbitale */
      var ae = ang(Zeff); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(gx, gy, gr * 0.94, ae - 0.05, ae + 0.05); ctx.stroke();
      var an = ang(Math.max(0, Math.min(A.Z, needle)));
      ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(an) * gr * 0.82, gy + Math.sin(an) * gr * 0.82); ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(gx, gy, 3.5, 0, TAU); ctx.fill(); ctx.restore();
      zT(S, c, "Z(r) = " + zN(Zr, 2), gx, gy + 13, {size:phone ? 10 : 11.5, color:"#13233a", weight:800});
      zT(S, c, "charge ressentie", gx, gy + 44, {size:zfz(c, 10), color:"#cfe0f5", weight:700});
      zT(S, c, "là où est l'électron", gx, gy + 57, {size:zfz(c, 10), color:"#cfe0f5", weight:700});
      zT(S, c, "glisse pour tourner · atome coupé en deux", 10, H - 12, {size:zfz(c, 10.5), color:"rgba(210,222,240,.75)", align:"left", weight:600});

      /* ================= courbe |u(r)|² + niveaux ================= */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var gx0 = 8, gx1 = phone ? FW - 8 : FW * 0.6, gy0 = 6, gy1 = phone ? FH * 0.55 : FH - 6;
      g.save(); zrr(g, gx0, gy0, gx1 - gx0, gy1 - gy0, 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore();
      var px0 = gx0 + 34, px1 = gx1 - 30, py0 = gy0 + 34, py1 = gy1 - 30, rMax = O.n === 2 ? (at === "li" ? 14 : 9) : (at === "li" ? 28 : 18);
      zT(S, f, "Probabilité radiale |u(r)|²", gx0 + 10, gy0 + 13, {size:zfz(f, 11.5), color:"#13233a", align:"left"});
      function X(r){ return px0 + r / rMax * (px1 - px0); }
      /* 1s (2 électrons) et orbitale externe, même échelle de probabilité par électron */
      var pmax = 0, NS = 300, c1s = [], cO = [];
      for (i = 0; i <= NS; i++){ var r = rMax * i / NS, p1 = 4 * Math.pow(A.zeta, 3) * r * r * Math.exp(-2 * A.zeta * r), idx = Math.min(EC_N - 1, Math.max(0, Math.round(r / s0.h) - 1)), po = r < s0.h ? 0 : s0.P[idx];
        c1s.push(p1); cO.push(po); pmax = Math.max(pmax, po); }
      var top = pmax * 1.15, k1 = 0.92 * top / (4 * A.zeta / Math.E / Math.E); c1s = c1s.map(function(p){ return p * k1; });
      function Yp(p){ return py1 - Math.min(p / top, 1.25) * (py1 - py0); }
      /* zone r < r₉₀(1s) */
      g.fillStyle = "rgba(90,184,245,.12)"; g.fillRect(px0, py0 - 14, X(rc) - px0, py1 - py0 + 14);
      /* aire de l'orbitale sous le nuage */
      g.save(); g.beginPath(); g.moveTo(px0, py1); for (i = 0; i <= NS; i++){ var rr2 = rMax * i / NS; if (rr2 > rc) break; g.lineTo(X(rr2), Yp(cO[i])); } g.lineTo(X(Math.min(rc, rMax)), py1); g.closePath(); g.fillStyle = za(col, 0.35); g.fill(); g.restore();
      g.save(); g.beginPath(); g.rect(px0, py0 - 16, px1 - px0, py1 - py0 + 16); g.clip();
      [[c1s, "#5ab8f5", 1.6], [cO, col, 2.6]].forEach(function(cc){ g.beginPath(); for (i = 0; i <= NS; i++){ var xx = X(rMax * i / NS), yy = Yp(cc[0][i]); if (i) g.lineTo(xx, yy); else g.moveTo(xx, yy); } g.strokeStyle = cc[1]; g.lineWidth = cc[2]; g.stroke(); });
      /* Z(r) en pointillés (axe de droite) */
      g.setLineDash([5, 4]); g.beginPath(); for (i = 0; i <= NS; i++){ var r4 = rMax * i / NS, zz = A.Z - q * ecQ(A.zeta, r4), y4 = py1 - zz / A.Z * (py1 - py0); if (i) g.lineTo(X(r4), y4); else g.moveTo(X(r4), y4); }
      g.strokeStyle = "#d1495b"; g.lineWidth = 1.6; g.stroke(); g.setLineDash([]); g.restore();
      g.strokeStyle = "#b8c2d0"; g.lineWidth = 1; g.beginPath(); g.moveTo(px0, py1 + 0.5); g.lineTo(px1, py1 + 0.5); g.moveTo(px1 + 0.5, py0); g.lineTo(px1 + 0.5, py1); g.stroke();
      var stp = zstep(rMax, phone ? 4 : 5); for (var rv = 0; rv <= rMax + 1e-9; rv += stp) zT(S, f, zN(rv, 0), X(rv), py1 + 10, {size:zfz(f, 9.5), color:"#5f6b7a", weight:600});
      zT(S, f, "r (a₀)", px1, py1 + 22, {size:zfz(f, 9.5), color:"#5f6b7a", align:"right", weight:700});
      for (i = 0; i <= A.Z; i++) zT(S, f, String(i), px1 + 6, py1 - i / A.Z * (py1 - py0), {size:zfz(f, 9), color:"#d1495b", align:"left", weight:700});
      zT(S, f, "Z(r)", px1 + 2, py0 - 12, {size:zfz(f, 9.5), color:"#d1495b", align:"left", weight:800});
      zT(S, f, "— 1s (réduit)", gx0 + 10, py1 + 22, {size:zfz(f, 9.5), color:"#2f8fd6", align:"left", weight:800});
      zT(S, f, "— " + orb, gx0 + (phone ? 84 : 92), py1 + 22, {size:zfz(f, 9.5), color:col, align:"left", weight:800});
      g.fillStyle = "rgba(90,184,245,.3)"; g.fillRect(gx0 + (phone ? 116 : 126), py1 + 17, 10, 10);
      zT(S, f, "sous le nuage 1s", gx0 + (phone ? 130 : 140), py1 + 22, {size:zfz(f, 9.5), color:"#2f6fd6", align:"left", weight:800});
      /* ---- niveaux ---- */
      var lx0 = phone ? 8 : gx1 + 10, lx1 = FW - 8, ly0 = phone ? gy1 + 10 : 6, ly1 = FH - 6;
      g.save(); zrr(g, lx0, ly0, lx1 - lx0, ly1 - ly0, 10); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#dde3ec"; g.stroke(); g.restore();
      zT(S, f, "Niveaux de l'électron externe", lx0 + 10, ly0 + 13, {size:zfz(f, 11.5), color:"#13233a", align:"left"});
      var Emin = 0; Object.keys(sol).forEach(function(o){ Emin = Math.min(Emin, sol[o].E); });
      if (mT.value && q > 1.95) Object.keys(A.mes).forEach(function(o){ Emin = Math.min(Emin, A.mes[o]); });
      Emin *= 1.12;
      var ey0 = ly0 + 50, ey1 = ly1 - 14, ex0 = lx0 + 40, ex1 = lx1 - 8, cwl = (ex1 - ex0) / 3;
      function yE(E){ return ey0 + (E / Emin) * (ey1 - ey0); }
      var stE = zstep(-Emin, 4);
      for (var ev = 0; ev >= Emin - 1e-9; ev -= stE){ var yy5 = yE(ev); g.strokeStyle = "#eef1f6"; g.beginPath(); g.moveTo(ex0, yy5); g.lineTo(ex1, yy5); g.stroke(); zT(S, f, zN(ev, stE < 1 ? 1 : 0), ex0 - 6, yy5, {size:zfz(f, 9), color:"#5f6b7a", align:"right", weight:600}); }
      zT(S, f, "eV", ex0 - 6, ey0 - 22, {size:zfz(f, 9), color:"#5f6b7a", align:"right", weight:700});
      ["s", "p", "d"].forEach(function(lt, ci){ zT(S, f, "ℓ = " + ci + " (" + lt + ")", ex0 + cwl * (ci + 0.5), ey0 - 22, {size:zfz(f, 9.5), color:"#13233a", weight:800}); });
      Object.keys(EC_ORB).forEach(function(o){
        var Oq = EC_ORB[o], xa = ex0 + cwl * Oq.l + cwl * 0.16, xb = ex0 + cwl * (Oq.l + 1) - cwl * 0.16, y = yE(sol[o].E), on = o === orb;
        if (mT.value && q > 1.95){ var ym = yE(A.mes[o]); g.save(); g.setLineDash([3, 3]); g.strokeStyle = "rgba(19,35,58,.55)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(xa, ym); g.lineTo(xb, ym); g.stroke(); g.restore(); }
        g.strokeStyle = on ? col : "#7a8596"; g.lineWidth = on ? 4 : 2.4; g.beginPath(); g.moveTo(xa, y); g.lineTo(xb, y); g.stroke();
        zT(S, f, o, (xa + xb) / 2, y - 9, {size:zfz(f, 9.5), color:on ? "#13233a" : "#5f6b7a", weight:800});
      });
      if (mT.value && q > 1.95) zT(S, f, "pointillés : mesuré", lx1 - 8, ly1 - 8, {size:zfz(f, 9), color:"#5f6b7a", align:"right", weight:700});
      /* ---- afficheurs ---- */
      ro.set(0, zN(Zeff, 3));
      ro.set(1, zN(s0.E, 2) + " eV");
      ro.set(2, zN(inside * 100, 1) + " %");
      ro.set(3, q < 0.05 ? "0 eV" : zN(sol["2p"].E - sol["2s"].E, 2) + " eV");
      nt.set((q < 0.05 ? "Sans écran, l'électron externe voit toute la charge +" + A.Z + "e : 2s et 2p ont la même énergie, comme dans l'hydrogène. " :
        "Le nuage 1s (" + zN(q, 2) + " e⁻, 90 % à moins de " + zN(rc, 2) + " a₀) cache une partie du noyau. ") +
        "Modèle : noyau + nuage 1s figé, sans échange entre électrons ; il sous-estime un peu la liaison de 2s.", q < 0.05 ? "warn" : "ok");
    });
  }
});
/* =====================================================================
   6. Règles de Hund et magnétisme (pq09)
   ===================================================================== */
/* éléments : Z, symbole, nom, configuration de valence, sous-couches ouvertes [nom, ℓ, électrons], terme mesuré [S, L, J] */
var HU = [
  [1, "H", "hydrogène", "1s¹", [["1s", 0, 1]], [0.5, 0, 0.5]], [2, "He", "hélium", "1s²", [["1s", 0, 2]], [0, 0, 0]],
  [3, "Li", "lithium", "[He] 2s¹", [["2s", 0, 1]], [0.5, 0, 0.5]], [4, "Be", "béryllium", "[He] 2s²", [["2s", 0, 2]], [0, 0, 0]],
  [5, "B", "bore", "[He] 2s² 2p¹", [["2p", 1, 1]], [0.5, 1, 0.5]], [6, "C", "carbone", "[He] 2s² 2p²", [["2p", 1, 2]], [1, 1, 0]],
  [7, "N", "azote", "[He] 2s² 2p³", [["2p", 1, 3]], [1.5, 0, 1.5]], [8, "O", "oxygène", "[He] 2s² 2p⁴", [["2p", 1, 4]], [1, 1, 2]],
  [9, "F", "fluor", "[He] 2s² 2p⁵", [["2p", 1, 5]], [0.5, 1, 1.5]], [10, "Ne", "néon", "[He] 2s² 2p⁶", [["2p", 1, 6]], [0, 0, 0]],
  [11, "Na", "sodium", "[Ne] 3s¹", [["3s", 0, 1]], [0.5, 0, 0.5]], [12, "Mg", "magnésium", "[Ne] 3s²", [["3s", 0, 2]], [0, 0, 0]],
  [13, "Al", "aluminium", "[Ne] 3s² 3p¹", [["3p", 1, 1]], [0.5, 1, 0.5]], [14, "Si", "silicium", "[Ne] 3s² 3p²", [["3p", 1, 2]], [1, 1, 0]],
  [15, "P", "phosphore", "[Ne] 3s² 3p³", [["3p", 1, 3]], [1.5, 0, 1.5]], [16, "S", "soufre", "[Ne] 3s² 3p⁴", [["3p", 1, 4]], [1, 1, 2]],
  [17, "Cl", "chlore", "[Ne] 3s² 3p⁵", [["3p", 1, 5]], [0.5, 1, 1.5]], [18, "Ar", "argon", "[Ne] 3s² 3p⁶", [["3p", 1, 6]], [0, 0, 0]],
  [19, "K", "potassium", "[Ar] 4s¹", [["4s", 0, 1]], [0.5, 0, 0.5]], [20, "Ca", "calcium", "[Ar] 4s²", [["4s", 0, 2]], [0, 0, 0]],
  [21, "Sc", "scandium", "[Ar] 3d¹ 4s²", [["3d", 2, 1]], [0.5, 2, 1.5]], [22, "Ti", "titane", "[Ar] 3d² 4s²", [["3d", 2, 2]], [1, 3, 2]],
  [23, "V", "vanadium", "[Ar] 3d³ 4s²", [["3d", 2, 3]], [1.5, 3, 1.5]], [24, "Cr", "chrome", "[Ar] 3d⁵ 4s¹", [["3d", 2, 5], ["4s", 0, 1]], [3, 0, 3]],
  [25, "Mn", "manganèse", "[Ar] 3d⁵ 4s²", [["3d", 2, 5]], [2.5, 0, 2.5]], [26, "Fe", "fer", "[Ar] 3d⁶ 4s²", [["3d", 2, 6]], [2, 2, 4]],
  [27, "Co", "cobalt", "[Ar] 3d⁷ 4s²", [["3d", 2, 7]], [1.5, 3, 4.5]], [28, "Ni", "nickel", "[Ar] 3d⁸ 4s²", [["3d", 2, 8]], [1, 3, 4]],
  [29, "Cu", "cuivre", "[Ar] 3d¹⁰ 4s¹", [["3d", 2, 10], ["4s", 0, 1]], [0.5, 0, 0.5]], [30, "Zn", "zinc", "[Ar] 3d¹⁰ 4s²", [["3d", 2, 10]], [0, 0, 0]],
  [31, "Ga", "gallium", "[Ar] 3d¹⁰ 4s² 4p¹", [["4p", 1, 1]], [0.5, 1, 0.5]], [32, "Ge", "germanium", "[Ar] 3d¹⁰ 4s² 4p²", [["4p", 1, 2]], [1, 1, 0]],
  [33, "As", "arsenic", "[Ar] 3d¹⁰ 4s² 4p³", [["4p", 1, 3]], [1.5, 0, 1.5]], [34, "Se", "sélénium", "[Ar] 3d¹⁰ 4s² 4p⁴", [["4p", 1, 4]], [1, 1, 2]],
  [35, "Br", "brome", "[Ar] 3d¹⁰ 4s² 4p⁵", [["4p", 1, 5]], [0.5, 1, 1.5]], [36, "Kr", "krypton", "[Ar] 3d¹⁰ 4s² 4p⁶", [["4p", 1, 6]], [0, 0, 0]],
  [57, "La", "lanthane", "[Xe] 5d¹ 6s²", [["5d", 2, 1]], [0.5, 2, 1.5]], [58, "Ce", "cérium", "[Xe] 4f¹ 5d¹ 6s²", [["4f", 3, 1], ["5d", 2, 1]], [0, 4, 4]],
  [59, "Pr", "praséodyme", "[Xe] 4f³ 6s²", [["4f", 3, 3]], [1.5, 6, 4.5]], [60, "Nd", "néodyme", "[Xe] 4f⁴ 6s²", [["4f", 3, 4]], [2, 6, 4]],
  [61, "Pm", "prométhium", "[Xe] 4f⁵ 6s²", [["4f", 3, 5]], [2.5, 5, 2.5]], [62, "Sm", "samarium", "[Xe] 4f⁶ 6s²", [["4f", 3, 6]], [3, 3, 0]],
  [63, "Eu", "europium", "[Xe] 4f⁷ 6s²", [["4f", 3, 7]], [3.5, 0, 3.5]], [64, "Gd", "gadolinium", "[Xe] 4f⁷ 5d¹ 6s²", [["4f", 3, 7], ["5d", 2, 1]], [4, 2, 2]],
  [65, "Tb", "terbium", "[Xe] 4f⁹ 6s²", [["4f", 3, 9]], [2.5, 5, 7.5]], [66, "Dy", "dysprosium", "[Xe] 4f¹⁰ 6s²", [["4f", 3, 10]], [2, 6, 8]],
  [67, "Ho", "holmium", "[Xe] 4f¹¹ 6s²", [["4f", 3, 11]], [1.5, 6, 7.5]], [68, "Er", "erbium", "[Xe] 4f¹² 6s²", [["4f", 3, 12]], [1, 5, 6]],
  [69, "Tm", "thulium", "[Xe] 4f¹³ 6s²", [["4f", 3, 13]], [0.5, 3, 3.5]], [70, "Yb", "ytterbium", "[Xe] 4f¹⁴ 6s²", [["4f", 3, 14]], [0, 0, 0]],
  [71, "Lu", "lutécium", "[Xe] 4f¹⁴ 5d¹ 6s²", [["4f", 3, 14], ["5d", 2, 1]], [0.5, 2, 1.5]]
];
var HU_LET = "SPDFGHIKLMN", HU_FERRO = {Fe:1, Co:1, Ni:1, Gd:1}, HU_AIM = {Sm:1, Nd:1};
/* remplissage de Hund d'une sous-couche : ordre des cases (mℓ de +ℓ à −ℓ, spins ↑ puis ↓) */
function huOrder(l){ var o = [], m; for (m = l; m >= -l; m--) o.push([m, 1]); for (m = l; m >= -l; m--) o.push([m, -1]); return o; }
/* S, L (somme des M_S et |Σ mℓ| de l'arrangement de Hund) pour k électrons placés au total dans les sous-couches */
function huSL(shells, kTot){
  var ms = 0, ml = 0, left = kTot;
  shells.forEach(function(sh){ var n = Math.min(left, sh[2]); left -= n; huOrder(sh[1]).slice(0, n).forEach(function(e){ ms += e[1] / 2; ml += e[0]; }); });
  return {S:Math.abs(ms), L:Math.abs(ml)};
}
function huJ(S, L, shells){
  var sh = shells[0], half = 2 * sh[1] + 1;
  if (shells.length === 1){ if (sh[2] < half) return Math.abs(L - S); if (sh[2] > half) return L + S; return S; }
  return Math.abs(L - S);
}
function huTerm(S, L, J){ return String(Math.round(2 * S + 1)).split("").map(function(ch){ return SUPD[ch]; }).join("") + HU_LET.charAt(L) + zsubf(J); }
function zsubf(x){ var SUB = {"0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆", "7":"₇", "8":"₈", "9":"₉", "/":"/"}; return zfrac(x).split("").map(function(ch){ return SUB[ch] || ch; }).join(""); }

SFA.sim({
  id:"pq-hund-magnetisme", ch:"pq09", tag:"Atomes à plusieurs électrons",
  titre:"Règles de Hund : spin total le long du tableau et aimants",
  resume:"Une sous-couche se remplit case par case ; S et L se calculent en direct et leurs courbes le long du tableau montrent où sont les atomes les plus magnétiques.",
  but:"Choisis un élément (liste ou clic sur le graphe) et regarde ses électrons tomber dans les cases selon Hund. Glisse l'aimant vers le clou dans la scène de droite.",
  aRetenir:"Hund : d'abord des spins parallèles dans des cases différentes (S maximal), puis L maximal ; S culmine à mi-remplissage (Mn, Cr, Eu, Gd).",
  piege:"Un grand S fait un atome très magnétique, mais un aimant exige aussi que les moments des atomes voisins s'alignent : le chrome (S = 3, record de sa ligne) et le manganèse (S = 5/2) ne sont pas ferromagnétiques.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 480 : 340), f = k.canvas(phone ? 230 : 230);
    var idx = 25;
    var eS = k.select("Élément", HU.map(function(e, i){ return [String(i), e[0] + " · " + e[1] + " (" + e[2] + ")"]; }), "25", function(v){ setEl(+v); });
    k.button("Élément précédent", function(){ setEl(Math.max(0, idx - 1)); });
    k.button("Élément suivant", function(){ setEl(Math.min(HU.length - 1, idx + 1)); });
    var ro = k.readouts(["Spins non compensés (2S)", "Spin total S", "Moment orbital L", "Terme fondamental (mesuré)"]);
    var nt = k.note("", "ok");
    var fill = 0, fillT = 0, hold = 0, drops = [];
    function setEl(i){ idx = i; eS.set(String(i)); fill = 0; fillT = 0; hold = 0; drops = []; k.redraw(); }
    var mag = {x:0.5, drag:false}, nail = {a:0, w:0}, GEO = {};
    c.cv.style.touchAction = "none";
    c.pointer(function(type, p){
      if (type === "down" && GEO.mag && Math.abs(p.x - GEO.mag.x) < GEO.mag.w && Math.abs(p.y - GEO.mag.y) < GEO.mag.h) mag.drag = true;
      if (type === "drag" && mag.drag){ mag.x = Math.max(0.12, Math.min(0.9, (p.x - GEO.sx0) / GEO.sw)); k.redraw(); }
      if (type === "move") c.cv.style.cursor = GEO.mag && Math.abs(p.x - GEO.mag.x) < GEO.mag.w && Math.abs(p.y - GEO.mag.y) < GEO.mag.h ? "grab" : "default";
      if (type === "up") mag.drag = false;
    });
    f.cv.style.touchAction = "none";
    f.pointer(function(type, p){
      if (!GEO.gx) return;
      var best = -1, bd = 1e9; GEO.gx.forEach(function(x, i){ var d = Math.abs(p.x - x); if (d < bd){ bd = d; best = i; } });
      if (type === "down" && bd < 12) setEl(best);
      if (type === "move") f.cv.style.cursor = bd < 12 ? "pointer" : "default";
    });
    var lp = k.loop(function(dt, t){
      var E = HU[idx], tot = 0; E[4].forEach(function(sh){ tot += sh[2]; });
      if (fill < tot){ fillT += dt; if (fillT > 0.42){ fillT = 0; fill++; drops.push({k:fill - 1, t:0}); } }
      else { hold += dt; if (hold > 4.5){ hold = 0; fill = 0; drops = []; } }
      drops.forEach(function(d){ d.t = Math.min(1, d.t + dt * 2.6); });
      /* clou : pendule attiré par l'aimant (qualitatif) */
      var dist = Math.max(0.05, mag.x - 0.3), target = Math.min(0.5, 0.004 / (dist * dist));
      nail.w += ((target - nail.a) * 30 - nail.w * 2.2) * dt; nail.a += nail.w * dt + Math.sin(t * 1.7) * 0.0015;
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, E = HU[idx], t = performance.now() / 1000;
      var cur = huSL(E[4], fill), fin = huSL(E[4], 1e9), Jh = huJ(fin.S, fin.L, E[4]);
      /* ================= plateau des cases ================= */
      zlab(ctx, W, H, "#1e2840", "#0a0e19");
      var tw = phone ? W : W * 0.6, th = phone ? H * 0.58 : H;
      /* carte de l'élément */
      var cw0 = phone ? 74 : 84, ch0 = phone ? 74 : 84;
      ctx.save(); var gc = ctx.createLinearGradient(12, 12, 12, 12 + ch0); gc.addColorStop(0, HU_FERRO[E[1]] ? "#ffe7a6" : "#e8eef8"); gc.addColorStop(1, HU_FERRO[E[1]] ? "#e0b44a" : "#a9b6c8");
      ctx.fillStyle = gc; zrr(ctx, 12, 12, cw0, ch0, 9); ctx.fill(); ctx.restore();
      zT(S, c, String(E[0]), 20, 24, {size:11, color:"#13233a", align:"left", weight:800});
      zT(S, c, E[1], 12 + cw0 / 2, 12 + ch0 * 0.55, {size:phone ? 26 : 30, color:"#13233a", weight:800});
      zT(S, c, E[2], 12 + cw0 / 2, 12 + ch0 - 10, {size:9.5, color:"#13233a", weight:700});
      zT(S, c, E[3], 24 + cw0, 26, {size:zfz(c, 12.5), color:"#eef3fb", align:"left", weight:800});
      zT(S, c, "sous-couche" + (E[4].length > 1 ? "s ouvertes" : " ouverte") + " : " + E[4].map(function(sh){ return sh[0]; }).join(" et "), 24 + cw0, 46, {size:zfz(c, 10.5), color:"#9fb0c8", align:"left", weight:700});
      /* cases (en volume) */
      var nb = 0; E[4].forEach(function(sh){ nb += 2 * sh[1] + 1; });
      var gap = 14 * (E[4].length - 1), bw = Math.min(phone ? 46 : 52, (tw - 50 - gap) / nb), bh = bw * 1.25, by = phone ? 128 : 150, bx0 = 32 + (tw - 42 - nb * bw - gap) / 2;
      var boxes = [], col0 = 0;
      E[4].forEach(function(sh, si){
        var nl = 2 * sh[1] + 1;
        for (var j = 0; j < nl; j++){
          var m = sh[1] - j, x = bx0 + (col0 + j) * bw + si * 14;
          boxes.push({sh:si, m:m, x:x});
          /* boîte en perspective : fond, côtés, rebord */
          ctx.save(); var gb = ctx.createLinearGradient(x, by, x, by + bh); gb.addColorStop(0, "#2a3550"); gb.addColorStop(1, "#141b2c");
          ctx.fillStyle = gb; ctx.fillRect(x + 2, by, bw - 4, bh);
          ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(x + 2, by, 3, bh);
          ctx.strokeStyle = "#8a96aa"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + 2, by - 4); ctx.lineTo(x + 2, by + bh); ctx.lineTo(x + bw - 2, by + bh); ctx.lineTo(x + bw - 2, by - 4); ctx.stroke(); ctx.restore();
          zT(S, c, (m > 0 ? "+" : "") + String(m).replace("-", "−"), x + bw / 2, by + bh + 12, {size:zfz(c, 10), color:"#9fb0c8", weight:700});
        }
        zT(S, c, sh[0], bx0 + (col0 + nl / 2) * bw + si * 14, by - 16, {size:zfz(c, 11.5), color:"#ffd34d", weight:800});
        col0 += nl;
      });
      zT(S, c, "mℓ", bx0 - 6, by + bh + 12, {size:zfz(c, 10), color:"#9fb0c8", align:"right", weight:700});
      /* électrons placés (ordre de Hund), avec chute */
      var placed = [], left = fill, bi = 0;
      E[4].forEach(function(sh, si){ var n = Math.min(left, sh[2]); left -= n; huOrder(sh[1]).slice(0, n).forEach(function(e){ placed.push({si:si, m:e[0], s:e[1]}); }); });
      placed.forEach(function(e, n){
        var b = boxes.filter(function(q){ return q.sh === e.si && q.m === e.m; })[0]; if (!b) return;
        var d = drops.filter(function(q){ return q.k === n; })[0], u = d ? d.t : 1, fall = u < 1 ? (1 - u * u) * (by + 20) : 0;
        var x = b.x + bw / 2 + (e.s > 0 ? -bw * 0.2 : bw * 0.2), y = by + bh * 0.55 - fall;
        var r = Math.min(9, bw * 0.17);
        zglow(ctx, x, y, r * 2.2, e.s > 0 ? "#ffd34d" : "#7fd4ff", 0.35);
        zball(ctx, x, y, r, e.s > 0 ? "#ffcf4a" : "#6cc7ff");
        S.draw.arrow(c, x, y + (e.s > 0 ? bh * 0.3 : -bh * 0.3), x, y + (e.s > 0 ? -bh * 0.32 : bh * 0.32), "#ffffff", 2);
      });
      /* compteurs en direct */
      var yS = by + bh + 40;
      ztag(S, c, "électrons placés : " + fill + "   S = " + zfrac(cur.S) + "   L = " + cur.L, tw / 2, yS, {size:phone ? 11.5 : 13, color:"#eef3fb"});
      var tot2 = 0; E[4].forEach(function(sh){ tot2 += sh[2]; });
      if (fill >= tot2) ztag(S, c, "Hund : " + huTerm(fin.S, fin.L, Jh) + (E[1] === "Ce" ? "  (mesuré : ¹G₄, exception)" : ""), tw / 2, yS + 28, {size:phone ? 11 : 12, color:"#ffd34d"});
      /* ================= établi : aimant SmCo et clou de fer ================= */
      var sx0 = phone ? 0 : tw, sy0 = phone ? th : 0, sw = phone ? W : W - tw, sh2 = phone ? H - th : H;
      ctx.save(); ctx.beginPath(); ctx.rect(sx0, sy0, sw, sh2); ctx.clip();
      var gw = ctx.createLinearGradient(0, sy0, 0, sy0 + sh2); gw.addColorStop(0, "#2a2f3a"); gw.addColorStop(1, "#151820"); ctx.fillStyle = gw; ctx.fillRect(sx0, sy0, sw, sh2);
      var bench = sy0 + sh2 * 0.8; var gbe = ctx.createLinearGradient(0, bench, 0, sy0 + sh2); gbe.addColorStop(0, "#8a5c36"); gbe.addColorStop(1, "#4a2f1a"); ctx.fillStyle = gbe; ctx.fillRect(sx0, bench, sw, sy0 + sh2 - bench);
      /* potence et fil */
      var px = sx0 + sw * 0.22, py = sy0 + sh2 * 0.12, L = sh2 * 0.36;
      ctx.fillStyle = "#5d6672"; ctx.fillRect(px - sw * 0.14, py - 4, sw * 0.2, 6); ctx.fillRect(px - sw * 0.14, py - 4, 6, bench - py + 4);
      var nx = px + Math.sin(nail.a) * L, ny = py + Math.cos(nail.a) * L;
      ctx.strokeStyle = "#cfd6df"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
      /* clou */
      var nl = sh2 * 0.2;
      ctx.save(); ctx.translate(nx, ny); ctx.rotate(PI / 2 - nail.a * 1.3);
      var gn = ctx.createLinearGradient(0, -4, 0, 4); gn.addColorStop(0, "#d9dee6"); gn.addColorStop(0.5, "#8b95a3"); gn.addColorStop(1, "#4d5562");
      ctx.fillStyle = gn; ctx.fillRect(0, -2.5, nl, 5); ctx.beginPath(); ctx.moveTo(nl, -2.5); ctx.lineTo(nl + 8, 0); ctx.lineTo(nl, 2.5); ctx.fill();
      ctx.fillStyle = "#aab3bf"; ctx.fillRect(-3, -6, 4, 12); ctx.restore();
      zT(S, c, "clou de fer", px - 6, bench + (sy0 + sh2 - bench) / 2, {size:zfz(c, 10), color:"#f3e6d6", weight:700});
      /* aimant SmCo (cylindre) qu'on fait glisser */
      var mx = sx0 + sw * mag.x, my = ny + nl * 0.5, mw = Math.min(sw * 0.3, 70), mh = Math.min(sh2 * 0.26, 52);
      mx = Math.max(nx + Math.sin(nail.a * 1.3) * nl + mw / 2 + 12, mx);
      GEO.mag = {x:mx, y:my, w:mw * 0.7 + 10, h:mh * 0.6 + 10}; GEO.sx0 = sx0; GEO.sw = sw;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(mx, bench + 4, mw * 0.7, 5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#3b414c"; ctx.fillRect(mx - 3, my + mh / 2, 6, bench - my - mh / 2);
      var gm = ctx.createLinearGradient(mx - mw / 2, 0, mx + mw / 2, 0); gm.addColorStop(0, "#6d7480"); gm.addColorStop(0.35, "#e7ebf0"); gm.addColorStop(1, "#59606c");
      ctx.fillStyle = gm; zrr(ctx, mx - mw / 2, my - mh / 2, mw, mh, 6); ctx.fill();
      ctx.fillStyle = "#c0392b"; zrr(ctx, mx - mw / 2, my - mh / 2, mw * 0.32, mh, 6); ctx.fill();
      ctx.restore();
      zT(S, c, "N", mx - mw / 2 + mw * 0.16, my, {size:11, color:"#fff", weight:800});
      zT(S, c, "SmCo₅", mx + mw * 0.16, my, {size:zfz(c, 10), color:"#13233a", weight:800});
      /* lignes de champ */
      ctx.save(); ctx.strokeStyle = "rgba(140,200,255,.25)"; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -t * 20;
      for (i = 1; i <= 3; i++){ ctx.beginPath(); ctx.ellipse(mx, my, mw * 0.5 + i * 12, mh * 0.2 + i * 9, 0, 0, TAU); ctx.stroke(); }
      ctx.restore();
      /* loupe dans l'aimant : moments alignés */
      var lzx = sx0 + sw * 0.74, lzy = sy0 + sh2 * 0.2, lzr = Math.min(sw * 0.17, sh2 * 0.16);
      ctx.save(); ctx.beginPath(); ctx.arc(lzx, lzy, lzr, 0, TAU); ctx.fillStyle = "#0b1220"; ctx.fill(); ctx.clip();
      for (var a = -2; a <= 2; a++) for (var b2 = -2; b2 <= 2; b2++){ var ax = lzx + a * lzr * 0.38, ay = lzy + b2 * lzr * 0.38; zball(ctx, ax, ay, lzr * 0.1, (a + b2) % 2 ? "#9aa4b2" : "#c9a24a");
        var wob = Math.sin(t * 3 + a * 1.3 + b2) * 0.12; S.draw.arrow(c, ax - Math.cos(wob) * lzr * 0.15, ay - Math.sin(wob) * lzr * 0.15, ax + Math.cos(wob) * lzr * 0.15, ay + Math.sin(wob) * lzr * 0.15, "#ff7a6a", 1.6); }
      ctx.restore();
      ctx.strokeStyle = "rgba(200,215,240,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lzx - lzr * 0.7, lzy + lzr * 0.7); ctx.lineTo(mx, my - mh / 2); ctx.stroke();
      ctx.strokeStyle = "#c9d1dc"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lzx, lzy, lzr, 0, TAU); ctx.stroke();
      zT(S, c, "moments alignés", lzx, lzy + lzr + 11, {size:zfz(c, 9.5), color:"#cfd6df", weight:700});
      ctx.restore();
      zT(S, c, "glisse l'aimant", sx0 + sw - 8, sy0 + sh2 - 10, {size:zfz(c, 9.5), color:"rgba(255,235,210,.85)", align:"right", weight:700});

      /* ================= courbes S(Z) et L(Z) ================= */
      var g = f.ctx, FW = f.W, FH = f.H, n = HU.length;
      g.fillStyle = "#f5f7fb"; g.fillRect(0, 0, FW, FH);
      var x0 = 34, x1 = FW - 10, y0 = 30, y1 = FH - 34, brk = 8, step = (x1 - x0 - brk) / (n - 1);
      GEO.gx = HU.map(function(e, i){ return x0 + i * step + (i >= 36 ? brk : 0); });
      function Yv(v){ return y1 - v / 6.5 * (y1 - y0); }
      zT(S, f, "Spin total S et moment orbital L de l'état fondamental", 10, 12, {size:zfz(f, phone ? 10.5 : 12), color:"#13233a", align:"left"});
      g.strokeStyle = "#e3e8f0"; g.lineWidth = 1;
      for (i = 0; i <= 6; i++){ g.beginPath(); g.moveTo(x0, Yv(i)); g.lineTo(x1, Yv(i)); g.stroke(); zT(S, f, String(i), x0 - 6, Yv(i), {size:zfz(f, 9), color:"#5f6b7a", align:"right", weight:600}); }
      /* bandes des familles magnétiques */
      HU.forEach(function(e, i){ if (HU_FERRO[e[1]] || HU_AIM[e[1]]){ g.fillStyle = HU_FERRO[e[1]] ? "rgba(224,180,74,.25)" : "rgba(192,57,43,.14)"; g.fillRect(GEO.gx[i] - step / 2, y0, step, y1 - y0); } });
      /* sélection */
      g.fillStyle = "rgba(47,111,214,.16)"; g.fillRect(GEO.gx[idx] - step / 2 - 1, y0 - 4, step + 2, y1 - y0 + 4);
      [[5, "#2f6fd6", "L"], [3, "#e0702a", "S"]].forEach(function(sr){
        g.save(); g.strokeStyle = sr[1]; g.lineWidth = 1.8; g.beginPath(); var started = false;
        HU.forEach(function(e, i){ var x = GEO.gx[i], y = Yv(e[5][sr[2] === "S" ? 0 : 1]); if (i === 36){ g.stroke(); g.beginPath(); started = false; } if (started) g.lineTo(x, y); else { g.moveTo(x, y); started = true; } });
        g.strokeStyle = sr[1]; g.lineWidth = 1.8; g.stroke(); g.restore();
        HU.forEach(function(e, i){ var y = Yv(e[5][sr[2] === "S" ? 0 : 1]); g.fillStyle = sr[1]; g.beginPath(); g.arc(GEO.gx[i], y, i === idx ? 4 : 2.2, 0, TAU); g.fill(); });
      });
      /* coupure entre Kr et La */
      var xb = (GEO.gx[35] + GEO.gx[36]) / 2; g.strokeStyle = "#8792a2"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(xb - 3, y1 + 5); g.lineTo(xb + 1, y1 - 5); g.moveTo(xb + 1, y1 + 5); g.lineTo(xb + 5, y1 - 5); g.stroke();
      ["H", "Li", "Na", "K", "Sc", "Zn", "Kr", "La", "Gd", "Lu"].forEach(function(sy){ var i = HU.map(function(e){ return e[1]; }).indexOf(sy); if (phone && ["Li", "Sc", "Zn"].indexOf(sy) >= 0) return; zT(S, f, sy, GEO.gx[i], y1 + 11, {size:zfz(f, 9), color:"#5f6b7a", weight:700}); });
      zT(S, f, E[1], GEO.gx[idx], y1 + 24, {size:zfz(f, 10.5), color:"#2f6fd6", weight:800});
      zT(S, f, "— S", x1 - (phone ? 70 : 84), y0 - 6, {size:zfz(f, 10), color:"#e0702a", align:"left", weight:800});
      zT(S, f, "— L", x1 - (phone ? 36 : 44), y0 - 6, {size:zfz(f, 10), color:"#2f6fd6", align:"left", weight:800});
      /* ---- afficheurs : terme mesuré ---- */
      var Sm = E[5][0], Lm = E[5][1], Jm = E[5][2];
      ro.set(0, String(Math.round(2 * Sm)));
      ro.set(1, zfrac(Sm));
      ro.set(2, String(Lm) + " (" + HU_LET.charAt(Lm) + ")");
      ro.set(3, huTerm(Sm, Lm, Jm));
      var msg = HU_FERRO[E[1]] ? E[2].charAt(0).toUpperCase() + E[2].slice(1) + " : grand spin, et dans le métal les moments des atomes voisins s'alignent tout seuls (ferromagnétisme" + (E[1] === "Gd" ? ", sous 20 °C" : "") + ")." :
        HU_AIM[E[1]] ? "Dans les aimants SmCo₅ et Nd₂Fe₁₄B, le cobalt ou le fer donne l'aimantation ; la terre rare, au grand moment orbital L, la bloque dans une direction." :
        E[1] === "Ce" ? "Cérium : exception. Hund prévoit ³H₄, mais les spins 4f et 5d s'opposent : l'état fondamental mesuré est ¹G₄ (S = 0)." :
        E[1] === "Mn" || E[1] === "Cr" ? (E[1] === "Cr" ? "Chrome : S = 3, record de sa ligne" : "Manganèse : grand spin, S = 5/2") + ", mais dans le métal les moments voisins se mettent tête-bêche : pas d'aimant permanent." :
        fin.S === 0 ? "Sous-couches pleines : S = 0 et L = 0, l'atome n'a pas de moment magnétique propre." : "Hund : spins parallèles dans des cases différentes d'abord (S maximal), puis L maximal, puis J = |L − S| avant la moitié, L + S après.";
      nt.set(msg, HU_FERRO[E[1]] || HU_AIM[E[1]] ? "ok" : "ok");
    });
  }
});
})();
