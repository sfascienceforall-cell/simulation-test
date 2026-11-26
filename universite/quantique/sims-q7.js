/* Physique quantique · lot Q7 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-vallee-stabilite-3d · pq-fission-fusion · pq-rutherford-section-efficace · pq-tunnel-alpha-gamow (pq11)
   Aucune ressource externe : la 3D est une projection faite main (faces triées par profondeur). */
(function(){
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018, énergies en MeV, longueurs en fm) ---------- */
var NHC = 197.3269804, NE2 = 1.439964548, NAF = 1 / 137.035999084, NU = 931.49410242;
var NMN = 939.56542052, NMP = 938.27208816, NMEL = 0.51099895, NMH = 938.78307;   /* neutron, proton, électron, atome ¹H */
var NMD = 1875.61294257, NMT = 2808.92113298, NMA = 3727.3794066;                 /* noyaux ²H, ³H, ⁴He */
var NC_FMS = 2.99792458e23;                                                         /* c en fm/s */
var NSYM = ["n", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm",
  "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np",
  "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds"];

/* ---------- petites aides (préfixe n) ---------- */
function nrgb(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function nshade(col, f){
  var c = typeof col === "string" ? nrgb(col) : col;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function na(col, a){ var c = typeof col === "string" ? nrgb(col) : col; return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
function nmix(c1, c2, t){ return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t, c1[2] + (c2[2] - c1[2]) * t]; }
function nfz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function nN(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d == null ? 2 : d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
var NSUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻", "−":"⁻"};
function nsup(s){ return String(s).split("").map(function(ch){ return NSUP[ch] || ch; }).join(""); }
/* notation scientifique : d chiffres après la virgule de la mantisse */
function nsci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return nN(x, Math.max(0, d - e));
  return nN(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : nsup(e));
}
/* nom d'un noyau : ²³⁸U */
function nnuc(Z, A){ return Z === 0 && A === 1 ? "n" : nsup(A) + (NSYM[Z] || "?"); }
/* durée lisible (s → s, min, h, j, ans) */
function ndur(s){
  if (!isFinite(s)) return "—";
  var y = 3.15576e7;
  if (s < 1e-6) return s < 1e-9 ? nsci(s * 1e9, 2) + " ns" : nN(s * 1e9, s < 1e-8 ? 1 : 0) + " ns";
  if (s < 1e-3) return nsci(s * 1e6, 2) + " µs";
  if (s < 1) return nN(s * 1e3, s < 0.01 ? 2 : 1) + " ms";
  if (s < 120) return nN(s, s < 10 ? 2 : 1) + " s";
  if (s < 7200) return nN(s / 60, 1) + " min";
  if (s < 2 * 86400) return nN(s / 3600, 1) + " h";
  if (s < y) return nN(s / 86400, s < 10 * 86400 ? 2 : 1) + " j";
  if (s < 1e4 * y) return nN(s / y, s < 10 * y ? 2 : 0) + " ans";
  return nsci(s / y, 2) + " ans";
}
function nT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function nrr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function nball(ctx, x, y, r, col, alpha){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, nshade(col, 0.75)); g.addColorStop(0.45, nshade(col, 0)); g.addColorStop(1, nshade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
function nglow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, na(col, a == null ? 0.8 : a)); g.addColorStop(1, na(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
/* amas de nucléons (protons rouges, neutrons gris) : positions fixes dans une boule de rayon 1 */
function ncluster(nZ, nN0, seed){
  var A = nZ + nN0, pts = [], s = seed || 7, i;
  function rnd(){ s = (s * 16807) % 2147483647; return s / 2147483647; }
  var ga = PI * (3 - Math.sqrt(5));
  for (i = 0; i < A; i++){
    var rr = A === 1 ? 0 : Math.cbrt((i + 0.5) / A) * 0.82, y = A === 1 ? 0 : 1 - 2 * (i + 0.5) / A, rad = Math.sqrt(Math.max(0, 1 - y * y)), th = ga * i;
    pts.push({x:rr * rad * Math.cos(th), y:rr * y, z:rr * rad * Math.sin(th), p:false});
  }
  /* distribue les protons au hasard (graine fixe) */
  var idx = pts.map(function(_, j){ return j; });
  for (i = idx.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  for (i = 0; i < nZ; i++) pts[idx[i]].p = true;
  return pts;
}
/* dessine un amas (liste ncluster) centré en (x, y, z) monde, rayon R monde, dans la vue v */
function ndrawCluster(ctx, v, cl, x, y, z, R, rb, alpha){
  var L = cl.map(function(p){ var q = v.p(x + p.x * R, y + p.y * R, z + p.z * R); return {q:q, p:p.p}; });
  L.sort(function(a, b){ return a.q.z - b.q.z; });
  L.forEach(function(it){ nball(ctx, it.q.x, it.q.y, rb * v.sc * it.q.s, it.p ? "#e2473b" : "#a9b4c4", alpha); });
}

/* ---------- moteur 3D minimal : vue orbitale, faces planes éclairées, triées par profondeur ---------- */
function N3(){ this.a = -0.5; this.b = 0.35; this.sc = 40; this.cx = 0; this.cy = 0; this.f = 14; this.L = []; this.set(); }
N3.prototype.set = function(){ this.ca = Math.cos(this.a); this.sa = Math.sin(this.a); this.cb = Math.cos(this.b); this.sb = Math.sin(this.b); };
/* monde (x, y vers le haut, z) → vue (x à droite, y en haut, z vers toi) */
N3.prototype.rot = function(x, y, z){
  var x1 = x * this.ca + z * this.sa, z1 = -x * this.sa + z * this.ca;
  return [x1, y * this.cb - z1 * this.sb, y * this.sb + z1 * this.cb];
};
N3.prototype.pv = function(v){ var s = this.f ? this.f / Math.max(0.5, this.f - v[2]) : 1; return {x:this.cx + v[0] * this.sc * s, y:this.cy - v[1] * this.sc * s, z:v[2], s:s}; };
N3.prototype.p = function(x, y, z){ return this.pv(this.rot(x, y, z)); };
N3.prototype.clear = function(){ this.L = []; };
N3.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
N3.prototype.sprite = function(x, y, z, fn){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + 1e-3, fn:fn, v:v}); };
N3.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], q = {c:c, cull:true, alpha:o.alpha, line:o.line};
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    this.face(f.map(function(j){ return P[j]; }), o.cols ? o.cols[i] || col : col, q);
  }, this);
};
/* cylindre p0 → p1 */
N3.prototype.cyl = function(p0, p1, r, n, col, o){
  o = o || {}; n = n || 14;
  var ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], la = Math.hypot(ax[0], ax[1], ax[2]) || 1; ax = [ax[0] / la, ax[1] / la, ax[2] / la];
  var t = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  var u = [ax[1] * t[2] - ax[2] * t[1], ax[2] * t[0] - ax[0] * t[2], ax[0] * t[1] - ax[1] * t[0]], lu = Math.hypot(u[0], u[1], u[2]); u = [u[0] / lu, u[1] / lu, u[2] / lu];
  var w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
  var r1 = o.r1 == null ? r : o.r1, c = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2], q = {c:c, cull:true, alpha:o.alpha, line:o.line};
  var A = [], B = [], i;
  for (i = 0; i < n; i++){
    var th = i / n * TAU, cs = Math.cos(th), sn = Math.sin(th);
    A.push([p0[0] + r * (cs * u[0] + sn * w[0]), p0[1] + r * (cs * u[1] + sn * w[1]), p0[2] + r * (cs * u[2] + sn * w[2])]);
    B.push([p1[0] + r1 * (cs * u[0] + sn * w[0]), p1[1] + r1 * (cs * u[1] + sn * w[1]), p1[2] + r1 * (cs * u[2] + sn * w[2])]);
  }
  for (i = 0; i < n; i++){ var j = (i + 1) % n; this.face([A[i], A[j], B[j], B[i]], col, q); }
  if (!o.open){ this.face(A.slice(), o.cap0 || col, q); this.face(B.slice(), o.cap1 || col, q); }
};
N3.prototype.render = function(ctx){
  var self = this, L = this.L, Lt = [-0.42, 0.62, 0.66], ll = Math.hypot(Lt[0], Lt[1], Lt[2]), i;
  for (i = 0; i < L.length; i++){
    var it = L[i]; if (it.t) continue;
    var V = it.pts.map(function(p){ return self.rot(p[0], p[1], p[2]); });
    var a = V[0], b = V[1], c = V[2];
    if (V.length > 3 && Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) < 1e-9) c = V[3];
    var n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
    var ln = Math.hypot(n[0], n[1], n[2]) || 1; n = [n[0] / ln, n[1] / ln, n[2] / ln];
    var zc = 0, m = [0, 0, 0]; V.forEach(function(w){ zc += w[2]; m[0] += w[0]; m[1] += w[1]; m[2] += w[2]; }); zc /= V.length; m = [m[0] / V.length, m[1] / V.length, m[2] / V.length];
    if (it.o.c){ var cc = self.rot(it.o.c[0], it.o.c[1], it.o.c[2]); if ((m[0] - cc[0]) * n[0] + (m[1] - cc[1]) * n[1] + (m[2] - cc[2]) * n[2] < 0) n = [-n[0], -n[1], -n[2]]; }
    else if (it.o.up && n[1] * self.cb + n[2] * self.sb < 0) n = [-n[0], -n[1], -n[2]];
    var eye = self.f ? [-m[0], -m[1], self.f - m[2]] : [0, 0, 1];
    it.back = it.o.up ? false : n[0] * eye[0] + n[1] * eye[1] + n[2] * eye[2] < 0;
    it.V = V; it.n = n; it.z = zc + (it.o.dz || 0);
  }
  var D = L.filter(function(it){ return it.t || !(it.back && it.o.cull); });
  D.sort(function(p, q){ return p.z - q.z; });
  for (i = 0; i < D.length; i++){
    var d = D[i];
    if (d.t){ d.fn(ctx, self.pv(d.v)); continue; }
    var nn = d.back ? [-d.n[0], -d.n[1], -d.n[2]] : d.n;
    var dif = Math.max(0, nn[0] * Lt[0] + nn[1] * Lt[1] + nn[2] * Lt[2]) / ll;
    var fill = d.o.glow ? d.col : nshade(d.col, (d.o.amb == null ? -0.5 : d.o.amb) + 0.72 * dif);
    if (d.o.alpha != null){ ctx.save(); ctx.globalAlpha = d.o.alpha; }
    ctx.beginPath();
    for (var j = 0; j < d.V.length; j++){ var p = self.pv(d.V[j]); if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    if (!d.o.ns){ ctx.lineJoin = "round"; ctx.lineWidth = d.o.line ? 1.1 : 0.7; ctx.strokeStyle = d.o.line || fill; ctx.stroke(); }
    if (d.o.alpha != null) ctx.restore();
    if (d.o.after) d.o.after(ctx, d, self);
  }
};
/* glisser pour tourner la vue ; un clic sans glisser appelle onClick(p) ; onDown(p) renvoie false pour capturer le geste */
function norbit(c, v, k, lim, onClick, onDown, onDrag){
  var st = {lx:null, moved:0, cap:false};
  c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.x0 = p.x; st.y0 = p.y; st.moved = 0; st.cap = !!(onDown && onDown(p) === false); }
    if (type === "drag" && st.lx != null){
      st.moved = Math.max(st.moved, Math.hypot(p.x - st.x0, p.y - st.y0));
      if (st.cap){ if (onDrag) onDrag(p); }
      else if (st.moved > 4){
        v.a += (p.x - st.lx) * 0.01; v.b = Math.max(lim ? lim[0] : -1.4, Math.min(lim ? lim[1] : 1.4, v.b + (p.y - st.ly) * 0.01));
        v.set(); v.user = true;
      }
      st.lx = p.x; st.ly = p.y; k.redraw();
    }
    if (type === "up"){ if (st.lx != null && st.moved <= 4 && !st.cap && onClick) onClick(p); st.lx = null; st.cap = false; k.redraw(); }
  });
  return st;
}
/* fond de laboratoire sombre */
function nlab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* étiquette claire sur fond sombre, bornée au cadre ; renvoie sa boîte */
function ntag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = nfz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  var lx0 = o.x0 == null ? 3 : o.x0, lx1 = o.x1 == null ? c.W - 3 : o.x1, ly0 = o.y0 == null ? 3 : o.y0, ly1 = o.y1 == null ? c.H - 3 : o.y1;
  bx = Math.max(lx0, Math.min(lx1 - w, bx)); var by = Math.max(ly0, Math.min(ly1 - h, y - h / 2));
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.74)"; nrr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  nT(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}
/* place des étiquettes sans chevauchement : liste {s, x, y, o} → décale verticalement */
function ntags(S, c, list, top){
  var boxes = [], y0 = top || 3;
  list.forEach(function(it){
    var o = it.o || {}, ctx = c.ctx, size = nfz(c, o.size || 12);
    ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif"; var w = ctx.measureText(it.s).width + 12, h = size + 8; ctx.restore();
    var al = o.align || "center", bx = al === "left" ? it.x : al === "right" ? it.x - w : it.x - w / 2, y = it.y;
    bx = Math.max(3, Math.min(c.W - w - 3, bx));
    for (var tr = 0; tr < 12; tr++){
      var by = Math.max(y0, Math.min(c.H - h - 3, y - h / 2)), hit = null;
      for (var j = 0; j < boxes.length; j++){ var b = boxes[j]; if (bx < b.x + b.w + 2 && bx + w + 2 > b.x && by < b.y + b.h + 2 && by + h + 2 > b.y){ hit = b; break; } }
      if (!hit) break;
      y = (it.dir || 1) > 0 ? hit.y + hit.h + h / 2 + 3 : hit.y - h / 2 - 3;
      if (y + h / 2 > c.H - 3 || y - h / 2 < y0){ it.dir = -(it.dir || 1); y = it.y; }
    }
    var o2 = {}; for (var kk in o) o2[kk] = o[kk]; o2.align = "left"; o2.y0 = y0;
    boxes.push(ntag(S, c, it.s, bx, y, o2));
  });
  return boxes;
}
/* graduation « ronde » */
function nstep(span, n){ var s = span / n, p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }

/* =====================================================================
   1. La vallée de stabilité en relief (pq11)
   ===================================================================== */
/* formule de Weizsäcker (MeV) : volume, surface, coulomb, asymétrie, appariement */
var VS = {aV:15.75, aS:17.8, aC:0.711, aA:23.7, aP:11.18};
function vsB(Z, A, pair){
  if (A < 1 || Z < 0 || Z > A) return NaN;
  var b = VS.aV * A - VS.aS * Math.pow(A, 2 / 3) - VS.aC * Z * (Z - 1) / Math.cbrt(A) - VS.aA * (A - 2 * Z) * (A - 2 * Z) / A;
  if (pair && A % 2 === 0) b += (Z % 2 === 0 ? 1 : -1) * VS.aP / Math.sqrt(A);
  return b;
}
/* masse atomique (MeV) : Z atomes ¹H + N neutrons − B */
function vsM(Z, A){ return Z * NMH + (A - Z) * NMN - vsB(Z, A, true); }
var VS_MHE = 2 * NMH + 2 * NMN - 28.2957;
/* Z le plus stable pour A (fond de la vallée, sans appariement) */
function vsZ0(A){ var c = 1 / Math.cbrt(A); return (NMN - NMH + VS.aC * c + 4 * VS.aA) / (2 * VS.aC * c + 8 * VS.aA / A); }
/* transformation prévue par le modèle (Q en MeV) */
function vsMode(Z, N){
  var A = Z + N;
  if (A < 2) return {m:null, q:0};
  if (N > 0 && vsB(Z, A, true) - vsB(Z, A - 1, true) < 0) return {m:"n", q:vsB(Z, A - 1, true) - vsB(Z, A, true)};
  if (Z > 0 && vsB(Z, A, true) - vsB(Z - 1, A - 1, true) < 0) return {m:"p", q:vsB(Z - 1, A - 1, true) - vsB(Z, A, true)};
  var qm = N > 0 ? vsM(Z, A) - vsM(Z + 1, A) : -1, qp = Z > 1 ? vsM(Z, A) - vsM(Z - 1, A) : -1;
  if (qm > 0 || qp > 0){ if (qm >= qp) return {m:"b-", q:qm}; return {m:qp > 2 * NMEL ? "b+" : "ce", q:qp}; }
  if (Z >= 84 && N >= 2){ var qa = vsM(Z, A) - vsM(Z - 2, A - 4) - VS_MHE; if (qa > 0) return {m:"a", q:qa}; }
  return {m:null, q:0};
}
function vsNext(Z, N, m){
  if (m === "n") return [Z, N - 1]; if (m === "p") return [Z - 1, N];
  if (m === "b-") return [Z + 1, N - 1]; if (m === "b+" || m === "ce") return [Z - 1, N + 1];
  if (m === "a") return [Z - 2, N - 2]; return null;
}
function vsChainModel(Z, N){
  var out = [];
  for (var i = 0; i < 80; i++){
    var md = vsMode(Z, N); out.push({Z:Z, N:N, m:md.m, q:md.q});
    if (!md.m) break;
    var nx = vsNext(Z, N, md.m); Z = nx[0]; N = nx[1];
  }
  return out;
}
/* familles réelles (demi-vies mesurées, en s) */
var VY = 3.15576e7, VD = 86400;
var VS_REAL = {
  u238:{nom:"Uranium 238 (famille de l'uranium)", c:[[92, 238, "a", 4.468e9 * VY], [90, 234, "b-", 24.10 * VD], [91, 234, "b-", 1.17 * 60], [92, 234, "a", 2.455e5 * VY], [90, 230, "a", 7.54e4 * VY], [88, 226, "a", 1600 * VY], [86, 222, "a", 3.8235 * VD], [84, 218, "a", 3.098 * 60], [82, 214, "b-", 26.8 * 60], [83, 214, "b-", 19.9 * 60], [84, 214, "a", 164.3e-6], [82, 210, "b-", 22.2 * VY], [83, 210, "b-", 5.012 * VD], [84, 210, "a", 138.376 * VD], [82, 206]]},
  th232:{nom:"Thorium 232 (famille du thorium)", c:[[90, 232, "a", 1.405e10 * VY], [88, 228, "b-", 5.75 * VY], [89, 228, "b-", 6.15 * 3600], [90, 228, "a", 1.912 * VY], [88, 224, "a", 3.632 * VD], [86, 220, "a", 55.6], [84, 216, "a", 0.145], [82, 212, "b-", 10.64 * 3600], [83, 212, "b-", 60.55 * 60], [84, 212, "a", 0.299e-6], [82, 208]]},
  u235:{nom:"Uranium 235 (famille de l'actinium)", c:[[92, 235, "a", 7.04e8 * VY], [90, 231, "b-", 25.52 * 3600], [91, 231, "a", 3.276e4 * VY], [89, 227, "b-", 21.77 * VY], [90, 227, "a", 18.68 * VD], [88, 223, "a", 11.43 * VD], [86, 219, "a", 3.96], [84, 215, "a", 1.781e-3], [82, 211, "b-", 36.1 * 60], [83, 211, "a", 2.14 * 60], [81, 207, "b-", 4.77 * 60], [82, 207]]},
  co60:{nom:"Cobalt 60 (radiothérapie)", c:[[27, 60, "b-", 5.271 * VY], [28, 60]]},
  sr90:{nom:"Strontium 90 (déchet de fission)", c:[[38, 90, "b-", 28.8 * VY], [39, 90, "b-", 64.0 * 3600], [40, 90]]},
  na22:{nom:"Sodium 22 (émetteur β⁺)", c:[[11, 22, "b+", 2.602 * VY], [10, 22]]},
  f18:{nom:"Fluor 18 (imagerie TEP)", c:[[9, 18, "b+", 109.7 * 60], [8, 18]]}
};
var VS_COL = {a:"#ffcf4a", "b-":"#5ab4ff", "b+":"#ff6b6b", ce:"#ff9b6b", n:"#d5dce8", p:"#ff8fd0"};
var VS_NAME = {a:"α", "b-":"β⁻", "b+":"β⁺", ce:"capture électronique", n:"émission d'un neutron", p:"émission d'un proton"};

SFA.sim({
  id:"pq-vallee-stabilite-3d", ch:"pq11", tag:"Stabilité des noyaux",
  titre:"La vallée de stabilité en relief",
  resume:"La carte des noyaux devient un paysage : l'altitude est la masse par nucléon. Les noyaux stables tapissent le fond d'une vallée, les autres en descendent par α, β⁻ ou β⁺.",
  but:"Choisis un noyau de départ, ou clique sur le paysage pour en poser un : il descend la vallée par α, β⁻ ou β⁺ jusqu'au fond. Glisse pour tourner la maquette.",
  aRetenir:"Le fond de la vallée s'écarte de N = Z : les gros noyaux ont besoin de plus de neutrons pour compenser la répulsion des protons.",
  piege:"Une désintégration β ne change pas A : elle descend à A constant, en travers de la vallée ; seule l'émission α la parcourt dans sa longueur.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 310 : 420), g = k.canvas(phone ? 230 : 220);
    var opts = Object.keys(VS_REAL).map(function(id){ return [id, VS_REAL[id].nom]; }); opts.push(["souris", "Noyau posé à la souris (modèle)"]);
    var preS = k.select("Noyau de départ", opts, "u238", function(v){ if (v !== "souris") start(v); else startModel(50, 90); });
    var spS = k.seg("Vitesse de la descente", [["0.6", "Lente"], ["1.2", "Normale"], ["2.4", "Rapide"]], "1.2");
    var rotT = k.toggle("Rotation automatique de la maquette", true);
    var flT = k.toggle("Ligne du fond de la vallée (modèle)", true);
    k.button("Relancer la descente", function(){ restart(); }, true);
    var ro = k.readouts(["Noyau", "B/A (goutte liquide)", "Transformation suivante", "Chemin jusqu'au fond"]);
    var nt = k.note("", "ok");

    /* ----- chaîne en cours ----- */
    var chain = [], real = true, iStep = 0, prog = 0, hold = 0, T = 0, src = "u238";
    function start(id){
      src = id; var d = VS_REAL[id]; real = true;
      chain = d.c.map(function(s){ return {Z:s[0], N:s[1] - s[0], m:s[2] || null, t:s[3]}; });
      restart();
    }
    function startModel(Z, N){
      src = "souris"; real = false; preS.set("souris");
      chain = vsChainModel(Z, N); restart();
    }
    function restart(){ iStep = 0; prog = 0; hold = 0; k.redraw(); }
    start("u238");

    /* ----- maquette 3D ----- */
    var NMAX = 150, ZMAX = 96, HS = 0.66, DH = NMH - NU, DNn = NMN - NU, ATOP = 5;
    function WX(N){ return (N - NMAX / 2) / 15; }
    function WZ(Z){ return -(Z - ZMAX / 2) / 15; }
    /* altitude : excès de masse par nucléon Δ/A (MeV), formule sans appariement pour un relief lisse */
    function alt(N, Z){ var A = N + Z; if (A < 1) return ATOP; var d = (Z * DH + N * DNn - vsB(Z, A, false)) / A; if (!isFinite(d)) return ATOP; return Math.min(ATOP, d); }
    function WY(N, Z){ return (alt(N, Z) + 1.3) * HS; }
    /* bande qui suit la vallée : A le long, d = (N − Z) − (N − Z)_fond en travers, |d| ≤ DW(A) */
    function DW(A){ return Math.min(8 + 0.24 * A, 0.4 * A); }
    function dOf(N, Z){ var A = N + Z; return (N - Z) - (A - 2 * vsZ0(A)); }
    var AMAX = 244, SA = phone ? 6 : 4, NWd = phone ? 12 : 16, strip = [], CMAP = [[0, [22, 96, 128]], [0.12, [38, 140, 118]], [0.3, [96, 170, 92]], [0.5, [196, 178, 92]], [0.75, [150, 104, 66]], [1, [214, 219, 228]]];
    function cmap(t){ t = Math.max(0, Math.min(1, t)); for (var i = 1; i < CMAP.length; i++) if (t <= CMAP[i][0]){ var a = CMAP[i - 1], b = CMAP[i]; return nmix(a[1], b[1], (t - a[0]) / (b[0] - a[0])); } return CMAP[CMAP.length - 1][1]; }
    for (var Ar = 8; Ar <= AMAX; Ar += SA){
      var row = [], d0 = Ar - 2 * vsZ0(Ar), dw = Math.min(DW(Ar), Ar - Math.abs(d0) - 0.5);
      for (var iw = 0; iw <= NWd; iw++){
        var dd = -dw + 2 * dw * iw / NWd, Nn = (Ar + d0 + dd) / 2, Zz = (Ar - d0 - dd) / 2;
        Nn = Math.max(0, Math.min(Ar, Nn)); Zz = Ar - Nn;
        row.push([WX(Nn), WY(Nn, Zz), WZ(Zz), alt(Nn, Zz)]);
      }
      strip.push(row);
    }
    var floorPts = [];
    for (var A = 4; A <= AMAX; A += 2){ var z0 = vsZ0(A), n0 = A - z0; if (n0 > NMAX || z0 > ZMAX) break; floorPts.push([n0, z0]); }
    var v = new N3(); v.a = -0.15; v.b = phone ? 0.92 : 0.8; v.f = 26; v.set();
    norbit(c, v, k, [0.25, 1.35], function(p){ pick(p); });
    function pick(p){
      var best = null, bd = 1e9;
      for (var Z = 1; Z <= ZMAX; Z++) for (var N = 0; N <= NMAX; N++){
        if (N + Z < 4 || N + Z > AMAX || Math.abs(dOf(N, Z)) > DW(N + Z)) continue;
        var q = v.p(WX(N), WY(N, Z), WZ(Z)), d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d < bd){ bd = d; best = [Z, N]; }
      }
      if (best && bd < 30) startModel(best[0], best[1]);
    }
    function posOf(n, lift){ return [WX(n.N), WY(n.N, n.Z) + (lift || 0), WZ(n.Z)]; }

    var lp = k.loop(function(dt){
      T += dt;
      if (rotT.value && !v.user){ v.a = -0.15 + 0.4 * Math.sin(T * 0.16); v.set(); }
      var sp = +spS.value;
      if (iStep < chain.length - 1){ prog += dt * sp; if (prog >= 1){ prog = 0; iStep++; } }
      else { hold += dt; if (hold > 3.2 / Math.sqrt(sp)){ restart(); } }
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, j;
      nlab(ctx, W, H, "#1b2438", "#080c16");
      /* cadrage automatique : la table et la maquette tiennent dans le canevas */
      v.sc = 1; v.cx = 0; v.cy = 0;
      var fit = [];
      strip.forEach(function(r){ fit.push(v.p(r[0][0], r[0][1], r[0][2])); fit.push(v.p(r[NWd][0], r[NWd][1], r[NWd][2])); fit.push(v.p(r[0][0], -0.05, r[0][2])); fit.push(v.p(r[NWd][0], -0.05, r[NWd][2])); });
      var mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      fit.forEach(function(q){ mnx = Math.min(mnx, q.x); mxx = Math.max(mxx, q.x); mny = Math.min(mny, q.y); mxy = Math.max(mxy, q.y); });
      var mL = phone ? 8 : 30, mT = phone ? 40 : 48, mB = phone ? 30 : 36;
      v.sc = Math.min((W - 2 * mL) / (mxx - mnx), (H - mT - mB) / (mxy - mny));
      v.cx = W / 2 - v.sc * (mnx + mxx) / 2; v.cy = mT + (H - mT - mB) / 2 - v.sc * (mny + mxy) / 2; v.clear();
      /* table : la carte N-Z à plat, sous la maquette */
      var base = -0.05, tb = [[0, 0], [NMAX, 0], [NMAX, ZMAX], [0, ZMAX]].map(function(q){ return v.p(WX(q[0]), base, WZ(q[1])); });
      ctx.save(); ctx.beginPath(); tb.forEach(function(q, m){ if (m) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath();
      var tg = ctx.createLinearGradient(0, Math.min(tb[2].y, tb[3].y), 0, Math.max(tb[0].y, tb[1].y)); tg.addColorStop(0, "#1a2338"); tg.addColorStop(1, "#2a3654");
      ctx.fillStyle = tg; ctx.fill(); ctx.strokeStyle = "rgba(160,190,240,.35)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.strokeStyle = "rgba(150,180,230,.12)"; ctx.lineWidth = 1;
      for (i = 10; i < NMAX; i += 10){ var g0 = v.p(WX(i), base, WZ(0)), g1 = v.p(WX(i), base, WZ(ZMAX)); ctx.beginPath(); ctx.moveTo(g0.x, g0.y); ctx.lineTo(g1.x, g1.y); ctx.stroke(); }
      for (j = 10; j < ZMAX; j += 10){ var h0 = v.p(WX(0), base, WZ(j)), h1 = v.p(WX(NMAX), base, WZ(j)); ctx.beginPath(); ctx.moveTo(h0.x, h0.y); ctx.lineTo(h1.x, h1.y); ctx.stroke(); }
      ctx.restore();
      /* terrain : la bande de la vallée */
      var nr = strip.length;
      for (i = 0; i < nr - 1; i++) for (j = 0; j < NWd; j++){
        var r0 = strip[i], r1 = strip[i + 1], p00 = r0[j], p01 = r0[j + 1], p11 = r1[j + 1], p10 = r1[j];
        var ba = (p00[3] + p01[3] + p11[3] + p10[3]) / 4;
        v.face([p00, p10, p11, p01], cmap((ba + 1.2) / 6.2), {up:true, amb:-0.42, ns:true});
      }
      /* flancs de la maquette (bords de la bande et extrémités) */
      var side = "#3a4664";
      function wall(pts){ for (var q = 0; q < pts.length - 1; q++){ var a = pts[q], b = pts[q + 1]; v.face([[a[0], base, a[2]], [b[0], base, b[2]], [b[0], b[1], b[2]], [a[0], a[1], a[2]]], side, {amb:-0.3, ns:true, dz:-50}); } }
      wall(strip.map(function(r){ return r[0]; })); wall(strip.map(function(r){ return r[NWd]; })); wall(strip[0]); wall(strip[nr - 1]);
      v.render(ctx);
      /* N = Z */
      ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.3; ctx.beginPath();
      var nzOn = false, nzLast = 2;
      for (i = 2; i <= 96; i += 1){ if (Math.abs(dOf(i, i)) > DW(2 * i) || 2 * i > AMAX) break; nzLast = i; var q0 = v.p(WX(i), WY(i, i) + 0.03, WZ(i)); if (nzOn) ctx.lineTo(q0.x, q0.y); else { ctx.moveTo(q0.x, q0.y); nzOn = true; } }
      ctx.stroke(); ctx.restore();
      var qnz = v.p(WX(nzLast), WY(nzLast, nzLast) + 0.05, WZ(nzLast));
      /* fond de la vallée (modèle) */
      if (flT.value){
        ctx.save(); ctx.strokeStyle = "rgba(120,255,230,.85)"; ctx.lineWidth = 2.2; ctx.shadowColor = "rgba(120,255,230,.8)"; ctx.shadowBlur = 6; ctx.beginPath();
        floorPts.forEach(function(fp, m){ var q = v.p(WX(fp[0]), WY(fp[0], fp[1]) + 0.03, WZ(fp[1])); if (m) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
        ctx.stroke(); ctx.restore();
      }
      /* axes gradués */
      var fs = nfz(c, 10.5);
      for (i = 0; i <= NMAX; i += phone ? 50 : 25){ var qa = v.p(WX(i), base, WZ(0) + 0.05); if (qa.x > 12 && qa.x < W - 12 && qa.y < H - 8) nT(S, c, String(i), qa.x, qa.y + 10, {size:fs, color:"rgba(215,225,240,.85)", weight:700}); }
      for (j = 0; j <= 60; j += phone ? 30 : 20){ var qz = v.p(WX(0) - 0.08, base, WZ(j)); if (qz.x > 24 && qz.y > 40 && qz.y < H - 10) nT(S, c, String(j), qz.x - 10, qz.y + 4, {size:fs, color:"rgba(215,225,240,.85)", weight:700, align:"right"}); }
      var qNl = v.p(WX(NMAX * 0.78), base, WZ(0) + 0.05), qZl = v.p(WX(0) - 0.08, base, WZ(ZMAX * 0.7));
      /* trajet parcouru */
      var cur = chain[Math.min(iStep, chain.length - 1)], nxt = chain[Math.min(iStep + 1, chain.length - 1)];
      ctx.save(); ctx.lineCap = "round";
      for (i = 0; i < Math.min(iStep, chain.length - 1); i++){
        var a0 = v.p.apply(v, posOf(chain[i], 0.06)), a1 = v.p.apply(v, posOf(chain[i + 1], 0.06));
        ctx.strokeStyle = VS_COL[chain[i].m] || "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(a1.x, a1.y); ctx.stroke();
      }
      for (i = 0; i <= Math.min(iStep, chain.length - 1); i++){ var ap = v.p.apply(v, posOf(chain[i], 0.06)); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(ap.x, ap.y, 2.4, 0, TAU); ctx.fill(); }
      ctx.restore();
      /* bille du noyau : glisse (β, n, p) ou saute (α) */
      var P0 = posOf(cur, 0.12), P1 = posOf(nxt, 0.12), u = iStep < chain.length - 1 ? prog : 0;
      var ue = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
      var bp = [P0[0] + (P1[0] - P0[0]) * ue, P0[1] + (P1[1] - P0[1]) * ue + (cur.m === "a" ? Math.sin(PI * ue) * 0.55 : 0), P0[2] + (P1[2] - P0[2]) * ue];
      var bq = v.p(bp[0], bp[1], bp[2]), bs = v.p(bp[0], WY(cur.N + (nxt.N - cur.N) * ue, cur.Z + (nxt.Z - cur.Z) * ue) + 0.02, bp[2]);
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(bs.x, bs.y, 8, 3.5, 0, 0, TAU); ctx.fill(); ctx.restore();
      var bcol = iStep >= chain.length - 1 ? "#7dffb0" : VS_COL[cur.m] || "#ffffff";
      nglow(ctx, bq.x, bq.y, 22, bcol, 0.5); nball(ctx, bq.x, bq.y, phone ? 7 : 8.5, bcol);
      /* particule émise : petite bille qui s'envole */
      if (iStep < chain.length - 1 && u > 0.15 && u < 0.95 && cur.m){
        var fl = (u - 0.15) / 0.8, ex = bq.x + 60 * fl * (cur.m === "a" ? -0.5 : 0.7), ey = bq.y - 70 * fl;
        ctx.save(); ctx.globalAlpha = 1 - fl; nball(ctx, ex, ey, cur.m === "a" ? 5 : 3, VS_COL[cur.m]); ctx.restore();
        nT(S, c, cur.m === "a" ? "α" : cur.m === "b-" ? "e⁻" : cur.m === "b+" ? "e⁺" : cur.m === "ce" ? "ν" : cur.m, ex + 9, ey - 6, {size:nfz(c, 12), color:VS_COL[cur.m], align:"left"});
      }
      /* étiquettes : départ, noyau courant, arrivée */
      var first = chain[0], last = chain[chain.length - 1], qf = v.p.apply(v, posOf(first, 0.1)), ql = v.p.apply(v, posOf(last, 0.1));
      var shown = iStep >= chain.length - 1 ? last : cur;
      var list = [{s:nnuc(shown.Z, shown.Z + shown.N) + (iStep >= chain.length - 1 ? " stable" : ""), x:bq.x + 14, y:bq.y - 22, o:{size:12.5, color:"#ffffff", align:"left", border:bcol}}];
      if (iStep > 0) list.push({s:"départ " + nnuc(first.Z, first.Z + first.N), x:qf.x - 10, y:qf.y - 16, o:{size:10.5, color:"#dfe6f2", align:"right"}, dir:-1});
      if (iStep < chain.length - 1 && chain.length > 1) list.push({s:"fond : " + nnuc(last.Z, last.Z + last.N), x:ql.x + 10, y:ql.y + 18, o:{size:10.5, color:"#9fffd0", align:"left"}});
      if (flT.value){ var qfe = v.p(WX(30), WY(30, 26) + 0.04, WZ(26)); ctx.save(); ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(qfe.x, qfe.y, 3.2, 0, TAU); ctx.fill(); ctx.restore();
        list.push({s:"⁵⁶Fe : le plus bas", x:qfe.x, y:qfe.y + 20, o:{size:10.5, color:"#9fffe6"}}); }
      list.push({s:"N = Z", x:qnz.x + 6, y:qnz.y - 12, o:{size:10, color:"#e6ecf5", align:"left", weight:700}});
      list.push({s:"N (neutrons) →", x:qNl.x, y:qNl.y + 26, o:{size:10.5, color:"#cfe0ff", weight:700}});
      list.push({s:"Z (protons) →", x:qZl.x - 16, y:qZl.y - 14, o:{size:10.5, color:"#cfe0ff", align:"right", weight:700}});
      ntags(S, c, list);
      /* légende */
      var lx = 10, ly = 12, items = [["α", "a"], ["β⁻", "b-"], ["β⁺ / CE", "b+"]];
      if (!real) items.push(["n, p", "n"]);
      ctx.save(); ctx.font = "800 " + nfz(c, 11.5) + "px Mulish, system-ui, sans-serif";
      items.forEach(function(it){ var w = ctx.measureText(it[0]).width; ctx.fillStyle = VS_COL[it[1]]; ctx.beginPath(); ctx.arc(lx + 5, ly, 5, 0, TAU); ctx.fill(); ctx.fillStyle = "#e9eef8"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(it[0], lx + 14, ly + 0.5); lx += w + 28; });
      ctx.restore();
      nT(S, c, phone ? "glisse : tourner · clic : poser" : "glisse pour tourner · clique pour poser un noyau", W - 10, 12, {size:nfz(c, 11), color:"rgba(210,222,240,.72)", align:"right", weight:600});
      nT(S, c, "altitude = masse par nucléon (excès Δ/A)", W - 10, 30, {size:nfz(c, 10.5), color:"rgba(160,255,220,.75)", align:"right", weight:600});

      /* ---- isobares : masse M(Z) à A constant ---- */
      g.clear();
      var Ac = shown.Z + shown.N, Zc = shown.Z, z0 = vsZ0(Ac);
      var zl = Math.max(0, Math.min(Zc, Math.round(z0)) - 3), zr = Math.min(Ac, Math.max(Zc, Math.round(z0)) + 3);
      while (zr - zl < 8){ if (zl > 0) zl--; if (zr - zl < 8 && zr < Ac) zr++; if (zl === 0 && zr === Ac) break; }
      var pts = [], mmin = 1e9, mmax = -1e9, z;
      for (z = zl; z <= zr; z++){ var mm = vsM(z, Ac); if (isFinite(mm)){ pts.push([z, mm]); mmin = Math.min(mmin, mm); } }
      pts.forEach(function(pp){ pp[1] -= mmin; mmax = Math.max(mmax, pp[1]); });
      var ax = S.draw.axes(g, {x0:zl - 0.5, x1:zr + 0.5, y0:0, y1:Math.max(2, mmax * 1.12), xl:"Z", yl:"M(Z) − M_min (MeV)", l:46, b:30, t:40, r:14, stepX:zr - zl > 14 ? 2 : 1});
      var gx = g.ctx;
      [0, 1].forEach(function(par){
        gx.save(); gx.strokeStyle = par ? "rgba(47,111,214,.45)" : "rgba(192,50,29,.4)"; gx.lineWidth = 1.5; gx.setLineDash([4, 3]); gx.beginPath(); var st = false;
        pts.forEach(function(pp){ if (Ac % 2 === 0 && (pp[0] % 2) !== par) return; var X = ax.X(pp[0]), Y = ax.Y(pp[1]); if (st) gx.lineTo(X, Y); else { gx.moveTo(X, Y); st = true; } });
        gx.stroke(); gx.restore();
      });
      pts.forEach(function(pp){
        var X = ax.X(pp[0]), Y = ax.Y(pp[1]), on = pp[0] === Zc;
        nball(gx, X, Y, on ? 7 : 4.5, on ? bcol : pp[1] < 1e-6 ? "#2a9d6a" : "#8a95a3");
      });
      if (nxt !== cur && nxt.Z + nxt.N === Ac && iStep < chain.length - 1){
        var pn = pts.filter(function(pp){ return pp[0] === nxt.Z; })[0], pc = pts.filter(function(pp){ return pp[0] === Zc; })[0];
        if (pn && pc) S.draw.arrow(g, ax.X(pc[0]), ax.Y(pc[1]) - 9, ax.X(pn[0]), ax.Y(pn[1]) - 9, VS_COL[cur.m] === "#5ab4ff" ? "#2f7fd1" : "#c0321d", 2);
      }
      /* honnêteté : là où la formule de Weizsäcker ne suit pas la mesure, on le dit */
      if (real){
        var zmin = pts.reduce(function(m0, pp){ return pp[1] < m0[1] ? pp : m0; }, [0, 1e9])[0], warnTxt = "";
        if (iStep >= chain.length - 1 && zmin !== Zc) warnTxt = "modèle : minimum en Z = " + zmin + " ; mesure : " + nnuc(Zc, Ac) + " stable";
        else if (iStep < chain.length - 1 && (cur.m === "b-" || cur.m === "b+") && nxt.Z + nxt.N === Ac && vsM(nxt.Z, Ac) >= vsM(Zc, Ac)) warnTxt = "modèle faux de " + nN(vsM(nxt.Z, Ac) - vsM(Zc, Ac), 2) + " MeV ici : la mesure donne bien un β";
        if (warnTxt) nT(S, g, warnTxt, ax.R - 2, 28, {size:nfz(g, 10.5), color:"#c0321d", align:"right", halo:"#ffffff"});
      }
      nT(S, g, "Isobares A = " + Ac + (Ac % 2 === 0 ? " : deux paraboles (Z pair / Z impair)" : " : une parabole"), ax.L + 4, 12, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});

      /* ---- afficheurs ---- */
      var Bc = vsB(shown.Z, Ac, true) / Ac;
      ro.set(0, nnuc(shown.Z, Ac) + " · Z = " + shown.Z + ", N = " + shown.N);
      ro.set(1, nN(Bc, 2) + " MeV");
      var nextTxt;
      if (iStep >= chain.length - 1) nextTxt = "aucune : fond de la vallée";
      else if (real) nextTxt = VS_NAME[cur.m] + " · T½ = " + ndur(cur.t);
      else nextTxt = VS_NAME[cur.m] + " · Q ≈ " + nN(cur.q, 1) + " MeV";
      ro.set(2, nextTxt);
      var cnt = {}; chain.forEach(function(s){ if (s.m) cnt[s.m] = (cnt[s.m] || 0) + 1; });
      var parts = Object.keys(cnt).map(function(m){ return cnt[m] + " " + (m === "a" ? "α" : m === "b-" ? "β⁻" : m === "b+" ? "β⁺" : m === "ce" ? "CE" : m); });
      ro.set(3, parts.length ? parts.join(", ") + " → " + nnuc(last.Z, last.Z + last.N) : "déjà au fond");
      var msg = real ? "Famille réelle (demi-vies mesurées). Les β⁻ ramènent le noyau vers le fond en travers de la vallée ; les α le font descendre le long de la vallée, vers les noyaux plus légers."
        : "Noyau posé à la souris : chemin prévu par la formule de Weizsäcker, sans les effets de couches. Loin du fond, le noyau perd d'abord des neutrons ou des protons (au-delà des « lignes d'égouttement »).";
      var dN = shown.N - (Ac - vsZ0(Ac));
      if (iStep < chain.length - 1 && dN > 3) msg += " Ce noyau a " + Math.round(dN) + " neutrons de trop par rapport au fond : côté riche en neutrons, comme les produits de fission.";
      else if (iStep < chain.length - 1 && dN < -3) msg += " Ce noyau manque de " + Math.round(-dN) + " neutrons par rapport au fond : côté riche en protons.";
      nt.set(msg, real ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   2. Fission et fusion : monter vers le fer (pq11)
   ===================================================================== */
/* excès de masse atomiques (MeV, tables AME) */
var FF_D = {n:8.0713181, H1:7.2889706, H2:13.1357220, H3:14.9498103, He4:2.4249159, U235:40.9188, U236:42.4448, U238:47.3089, U239:50.5739,
  Ba141:-79.733, Kr92:-68.769, Xe140:-72.986, Sr94:-78.840, Sr96:-72.939};
var FF_ZA = {n:[0, 1], H2:[1, 2], H3:[1, 3], He4:[2, 4], U235:[92, 235], U236:[92, 236], U238:[92, 238], U239:[92, 239], Ba141:[56, 141], Kr92:[36, 92], Xe140:[54, 140], Sr94:[38, 94], Sr96:[38, 96]};
function ffB(k){ var z = FF_ZA[k][0], a = FF_ZA[k][1]; return z * FF_D.H1 + (a - z) * FF_D.n - FF_D[k]; }
/* cibles : énergie de séparation Sₙ du noyau composé (masses), barrière de fission (valeur mesurée, ≈) */
var FF_T = {
  U235:{nom:"²³⁵U", cn:"²³⁶U", A:235, Bf:5.7, ch:[{f:["Ba141", "Kr92"], nu:3}, {f:["Xe140", "Sr94"], nu:2}]},
  U238:{nom:"²³⁸U", cn:"²³⁹U", A:238, Bf:6.2, ch:[{f:["Xe140", "Sr96"], nu:3}]}
};
function ffSn(t){ return t === "U235" ? FF_D.U235 + FF_D.n - FF_D.U236 : FF_D.U238 + FF_D.n - FF_D.U239; }
function ffQ(t, ch){ var q = FF_D[t] + FF_D.n - ch.nu * FF_D.n; ch.f.forEach(function(k){ q -= FF_D[k]; }); return q; }
/* fusion D + T */
var FU_MU = NMD * NMT / (NMD + NMT), FU_EG = 2 * FU_MU * Math.pow(PI * NAF, 2) * 1000;   /* énergie de Gamow (keV) */
var FU_R = 1.2 * (Math.cbrt(2) + Math.cbrt(3)), FU_VC = NE2 / FU_R * 1000;              /* contact (fm), barrière (keV) */
var FU_Q = FF_D.H2 + FF_D.H3 - FF_D.He4 - FF_D.n;
function fuE0(kT){ return Math.cbrt(FU_EG * kT * kT / 4); }
function fuP(E){ return Math.exp(-Math.sqrt(FU_EG / E)); }
/* courbe d'Aston (goutte liquide, fond de la vallée) */
function ffAston(A){ var z = vsZ0(A); return vsB(z, A, false) / A; }
var FF_PTS = [["²H", 2, 2.2246 / 2], ["³H", 3, ffB("H3") / 3], ["⁴He", 4, ffB("He4") / 4], ["¹²C", 12, 7.6801], ["¹⁶O", 16, 7.9762], ["⁵⁶Fe", 56, 8.7903], ["²³⁸U", 238, ffB("U238") / 238]];
var FF_NOM = {Ba141:"¹⁴¹Ba", Kr92:"⁹²Kr", Xe140:"¹⁴⁰Xe", Sr94:"⁹⁴Sr", Sr96:"⁹⁶Sr"};

/* décor : un tokamak vu de biais, son plasma qui tourne et ses bobines */
function fuTokamak(S, c, x0, y0, rx, ry, T, kT){
  var ctx = c.ctx, i, ncoil = 10;
  function coil(i, front){
    var a = i / ncoil * TAU + 0.15, cs = Math.cos(a), sn = Math.sin(a);
    if ((sn > 0) !== front) return;
    var x = x0 + rx * cs, y = y0 + ry * sn, w = 10 + 6 * (sn + 1) / 2, h = ry * 2.1;
    var gr = ctx.createLinearGradient(x - w, 0, x + w, 0); gr.addColorStop(0, "#3c4a66"); gr.addColorStop(0.5, "#8b9ab8"); gr.addColorStop(1, "#2c3750");
    ctx.save(); ctx.globalAlpha = front ? 0.95 : 0.55; ctx.fillStyle = gr; nrr(ctx, x - w / 2, y - h / 2, w, h, w / 2); ctx.fill(); ctx.restore();
  }
  for (i = 0; i < ncoil; i++) coil(i, false);
  /* chambre torique */
  ctx.save(); ctx.lineWidth = ry * 0.9; ctx.strokeStyle = "rgba(70,84,112,.55)"; ctx.beginPath(); ctx.ellipse(x0, y0, rx, ry, 0, 0, TAU); ctx.stroke();
  /* plasma */
  var hot = Math.min(1, (kT - 5) / 45);
  ctx.lineWidth = ry * 0.55; ctx.strokeStyle = "rgba(" + Math.round(220 + 35 * hot) + "," + Math.round(110 + 60 * hot) + ",240,.35)"; ctx.shadowColor = "rgba(255,140,230,.9)"; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.ellipse(x0, y0, rx, ry, 0, 0, TAU); ctx.stroke();
  ctx.lineWidth = ry * 0.18; ctx.strokeStyle = "rgba(255,225,250,.55)"; ctx.beginPath(); ctx.ellipse(x0, y0, rx, ry, 0, 0, TAU); ctx.stroke(); ctx.restore();
  /* ions D (bleus) et T (verts) qui circulent */
  for (i = 0; i < 46; i++){
    var a = i * 2.39996 + T * (0.6 + (i % 5) * 0.08) * (1 + hot), rr = 1 + 0.16 * Math.sin(i * 1.7 + T * 1.3);
    var x = x0 + rx * rr * Math.cos(a), y = y0 + ry * rr * Math.sin(a) + 3 * Math.sin(i * 3.1 + T * 2);
    ctx.fillStyle = i % 2 ? "rgba(140,200,255,.9)" : "rgba(150,255,190,.9)"; ctx.beginPath(); ctx.arc(x, y, 1.7, 0, TAU); ctx.fill();
  }
  for (i = 0; i < ncoil; i++) coil(i, true);
}

SFA.sim({
  id:"pq-fission-fusion", ch:"pq11", tag:"Énergie nucléaire",
  titre:"Fission et fusion : monter vers le fer",
  resume:"Un noyau lourd qui se coupe, deux noyaux légers qui fusionnent : les deux réactions montent sur la courbe d'Aston vers le fer et libèrent de l'énergie.",
  but:"En fission, choisis la cible et l'énergie du neutron : la goutte ne se coupe que si l'énergie apportée dépasse la barrière de fission. En fusion, règle la température : le deutérium franchit la barrière coulombienne par effet tunnel. Glisse sur la scène pour la tourner.",
  aRetenir:"Fission et fusion libèrent de l'énergie parce que les produits ont une énergie de liaison par nucléon B/A plus grande : ils sont plus près du fer.",
  piege:"Le ²³⁸U ne fissionne pas avec un neutron lent : son noyau composé est moins excité (Sₙ plus faible, nombre de neutrons impair) que celui du ²³⁵U.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 390), g = k.canvas(phone ? 420 : 240);
    var modeS = k.seg("Réaction", [["fission", "Fission"], ["fusion", "Fusion D + T"]], "fission", function(){ showCtl(); restart(); });
    var tgS = k.select("Noyau cible", [["U235", "Uranium 235"], ["U238", "Uranium 238"]], "U235", function(){ restart(); });
    var enS = k.slider("Énergie du neutron Eₙ (0 = neutron lent)", 0, 3, 0.05, 0, "MeV", function(){ restart(); });
    var ktS = k.slider("Température du plasma kT", 5, 50, 1, 10, "keV", function(){ restart(); });
    var ro = k.readouts(["", "", "", ""]);
    var labs = ro.el.querySelectorAll("small");
    var nt = k.note("", "ok");
    function showCtl(){
      var fi = modeS.value === "fission";
      tgS.el.parentNode.style.display = fi ? "" : "none";
      enS.el.parentNode.style.display = fi ? "" : "none";
      ktS.el.parentNode.style.display = fi ? "none" : "";
      var L = fi ? ["Énergie apportée E* = Sₙ + Eₙ·A/(A+1)", "Barrière de fission B_f", "Ce qui se passe", "Énergie libérée Q"] : ["Barrière coulombienne", "Pic de Gamow E₀", "Passage par effet tunnel P(E₀)", "Énergie libérée Q"];
      L.forEach(function(s, i){ labs[i].textContent = s; });
    }
    showCtl();
    var T = 0, tc = 0, cyc = 0;
    function restart(){ tc = 0; k.redraw(); }

    var v = new N3(); v.a = 0.25; v.b = 0.32; v.f = 22; v.set();
    norbit(c, v, k, [-0.3, 1.2]);
    var protoHash = []; for (var i0 = 0; i0 < 997; i0++){ var hh = Math.sin(i0 * 12.9898 + 4.1) * 43758.5453; protoHash.push(hh - Math.floor(hh) < 0.39); }

    /* ---------- fission : état à l'instant tc ---------- */
    function fissionState(){
      var t = tgS.value, F = FF_T[t], Sn = ffSn(t), En = enS.value, Es = Sn + En * F.A / (F.A + 1), go = Es > F.Bf;
      var ch = F.ch[cyc % F.ch.length], st = {t:t, F:F, Sn:Sn, Es:Es, go:go, ch:ch, s:0, phase:"approche", nx:0, frag:0, gam:-1};
      /* s : déformation (1 = col du point selle, 1,6 = scission) */
      var sTurn = go ? 1.6 : ffTurn(Es / F.Bf);
      if (tc < 1.3){ st.phase = "approche"; st.nx = 1 - tc / 1.3; }
      else if (tc < 2.6){ st.phase = "excite"; var u = (tc - 1.3) / 1.3; st.s = Math.abs(Math.sin(u * PI * 2.5)) * Math.min(sTurn, 0.98) * u; }
      else if (go && tc < 3.7){ st.phase = "selle"; var w = (tc - 2.6) / 1.1; st.s = 1.6 * w * w * (3 - 2 * w); }
      else if (go){ st.phase = "fragments"; st.s = 1.6; st.frag = tc - 3.7; }
      else { st.phase = "gamma"; var dq = tc - 2.6; st.s = Math.abs(Math.sin(dq * PI * 2.5)) * sTurn * Math.exp(-dq * 2.2); st.gam = dq; }
      return st;
    }
    /* point de rebroussement : 3s² − 2s³ = e */
    function ffTurn(e){ e = Math.max(0, Math.min(1, e)); var lo = 0, hi = 1; for (var j = 0; j < 40; j++){ var m = (lo + hi) / 2; if (3 * m * m - 2 * m * m * m < e) lo = m; else hi = m; } return lo; }
    function ffE(s, Bf){ return Bf * (3 * s * s - 2 * s * s * s); }

    /* ---------- fusion : état ---------- */
    var NATT = 4;
    function fusionState(){
      var kT = ktS.value, E0 = fuE0(kT), rc = NE2 / (E0 / 1000), st = {kT:kT, E0:E0, rc:rc, P:fuP(E0), rmax:Math.max(30, rc * 1.25), r:0, ph:"vient", att:0, ghost:false, boom:-1};
      var per = 2.4, k0 = Math.floor(tc / per); st.att = Math.min(k0, NATT - 1);
      if (k0 < NATT - 1){ var u = (tc - k0 * per) / per; st.ph = u < 0.5 ? "vient" : "repart"; var w = u < 0.5 ? u * 2 : 2 - u * 2; st.r = rc + (st.rmax - rc) * Math.pow(1 - w, 2); }
      else {
        var t2 = tc - (NATT - 1) * per;
        if (t2 < 1.2){ st.ph = "vient"; st.r = rc + (st.rmax - rc) * Math.pow(1 - t2 / 1.2, 2); }
        else if (t2 < 1.9){ st.ph = "tunnel"; st.ghost = true; st.r = rc + (FU_R - rc) * (t2 - 1.2) / 0.7; }
        else { st.ph = "fusion"; st.r = 0; st.boom = t2 - 1.9; }
      }
      return st;
    }

    var lp = k.loop(function(dt){
      T += dt; tc += dt;
      var L = modeS.value === "fission" ? 6.4 : (NATT - 1) * 2.4 + 4.2;
      if (tc > L){ tc = 0; cyc++; }
      if (!v.user){ v.a = (modeS.value === "fission" ? 0.25 : 0.12) + (modeS.value === "fission" ? 0.3 : 0.18) * Math.sin(T * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();

    /* profil de la goutte : union douce de deux sphères (rayons r1, r2, centres z1 < z2) */
    function dropProfile(x, z1, z2, r1, r2, kap){
      var f1 = r1 * r1 - (x - z1) * (x - z1), f2 = r2 * r2 - (x - z2) * (x - z2);
      var m = Math.max(f1, f2), q = kap > 1e-4 ? m + kap * Math.log(Math.exp((f1 - m) / kap) + Math.exp((f2 - m) / kap)) - kap * Math.LN2 : m;
      return q > 0 ? Math.sqrt(q) : 0;
    }
    /* un nucléon (bille) posé sur chaque facette visible de la goutte */
    function nucAfter(pr){ return function(ctx, d, vw){
      var m = [0, 0, 0]; d.V.forEach(function(w){ m[0] += w[0]; m[1] += w[1]; m[2] += w[2]; }); var q = vw.pv([m[0] / 4, m[1] / 4, m[2] / 4]);
      var p0 = vw.pv(d.V[0]), p2 = vw.pv(d.V[2]), r = Math.max(1.5, Math.hypot(p2.x - p0.x, p2.y - p0.y) * 0.42);
      nball(ctx, q.x, q.y, r, pr ? "#e2473b" : "#a9b4c4");
    }; }
    function addDrop(x0, z1, z2, r1, r2, kap, nr, nth, seedOff){
      var xa = Math.min(z1 - r1, z2 - r2), xb = Math.max(z1 + r1, z2 + r2), rings = [], i, j;
      for (i = 0; i <= nr; i++){
        var x = xa + (xb - xa) * (0.5 - 0.5 * Math.cos(PI * i / nr)), rr = dropProfile(x, z1, z2, r1, r2, kap), ring = [];
        for (j = 0; j < nth; j++){ var th = j / nth * TAU; ring.push([x0 + x, rr * Math.cos(th), rr * Math.sin(th)]); }
        rings.push(ring);
      }
      for (i = 0; i < nr; i++) for (j = 0; j < nth; j++){
        var a = rings[i][j], b = rings[i][(j + 1) % nth], cc = rings[i + 1][(j + 1) % nth], d = rings[i + 1][j];
        var pr = protoHash[(i * nth + j + (seedOff || 0)) % protoHash.length];
        v.face([a, b, cc, d], "#c9895f", {cull:true, c:[x0 + (z1 + z2) / 2, 0, 0], amb:-0.45, after:nucAfter(pr)});
      }
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, fi = modeS.value === "fission", i;
      v.sc = fi ? Math.min(W / (phone ? 13 : 15), H / 8.2) : Math.min(W / (phone ? 12.4 : 13.4), H / 7.6); v.cx = W * (fi ? 0.5 : phone ? 0.56 : 0.53); v.cy = H * (fi ? 0.52 : phone ? 0.7 : 0.72); v.clear();
      nlab(ctx, W, H, fi ? "#1d2335" : "#1a1830", fi ? "#07090f" : "#08060f");
      var tags = [];
      if (fi){
        var st = fissionState(), F = st.F, ch = st.ch;
        var A1 = FF_ZA[ch.f[0]][1], A2 = FF_ZA[ch.f[1]][1], R0 = 1.2 * Math.cbrt(F.A + 1) / 3, R1 = 1.2 * Math.cbrt(A1) / 3, R2 = 1.2 * Math.cbrt(A2) / 3;
        /* sol de la scène : dalle de graphite du cœur, puis l'ombre de la goutte */
        v.box(-7, -3.4, -3, 7, -3.2, 3, "#2b3346"); v.render(ctx); v.clear();
        var shp = v.p(0, -3.2, 0), shw = st.phase === "fragments" ? 3 + st.frag * 2.2 : 3;
        ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(shp.x, shp.y, v.sc * shw, v.sc * 0.9 * Math.max(0.2, Math.sin(v.b + 0.15)), 0, 0, TAU); ctx.fill(); ctx.restore();
        var nr = phone ? 16 : 22, nth = phone ? 12 : 16;
        if (st.phase !== "fragments"){
          var sv = Math.min(st.s, 1.6) / 1.6, dsep = sv * (R1 + R2) * 1.02, w1 = A1 / (A1 + A2);
          var r1 = R0 + (R1 - R0) * sv, r2 = R0 + (R2 - R0) * sv, kap = 2.2 * (1 - sv) * (1 - sv);
          addDrop(0, -dsep * (1 - w1), dsep * w1, r1, r2, kap, nr, nth);
        } else {
          var tf = st.frag, ext = 0.9 * tf * tf + 2.2 * tf, d1 = (R1 + R2) * 0.55 + ext * A2 / (A1 + A2) * 2, d2 = (R1 + R2) * 0.55 + ext * A1 / (A1 + A2) * 2;
          addDrop(-d1, 0, 0, R1, R1, 0, nr - 4, nth, 0);
          addDrop(d2, 0, 0, R2, R2, 0, nr - 6, nth, 77);
        }
        v.render(ctx);
        /* neutron incident */
        if (st.phase === "approche"){
          var nx = R0 + 0.4 + st.nx * 7, qn = v.p(nx, 0.2, 0);
          ctx.save(); ctx.strokeStyle = "rgba(200,215,240,.45)"; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(qn.x, qn.y); var qe = v.p(nx + 3, 0.2, 0); ctx.lineTo(qe.x, qe.y); ctx.stroke(); ctx.restore();
          nglow(ctx, qn.x, qn.y, 16, "#cfe0ff", 0.5); nball(ctx, qn.x, qn.y, 0.42 * v.sc * qn.s, "#a6b2c4");
          tags.push({s:"neutron " + (enS.value < 0.01 ? "lent" : nN(enS.value, 2) + " MeV"), x:qn.x, y:qn.y - 26, o:{size:11.5, color:"#dfe8ff"}});
        }
        if (st.phase === "excite" || st.phase === "selle" || st.phase === "gamma"){
          var qc = v.p(0, R0 + 0.6, 0);
          tags.push({s:F.cn + "* excité : E* = " + nN(st.Es, 2) + " MeV", x:qc.x, y:qc.y - 18, o:{size:12, color:"#ffd9a8", border:"rgba(255,190,120,.6)"}});
        }
        if (st.phase === "excite" && tc < 1.6){ var qf = v.p(R0, 0.2, 0); nglow(ctx, qf.x, qf.y, 50 * (1.6 - tc) / 0.3, "#ffffff", 0.6); }
        if (st.phase === "gamma" && st.gam > 0.2){
          var gl = Math.min(1, (st.gam - 0.2) / 1.6), g0 = v.p(0.5, R0, 0), gxp = g0.x + gl * W * 0.35, gyp = g0.y - gl * H * 0.35;
          ctx.save(); ctx.strokeStyle = "#b28dff"; ctx.lineWidth = 2.2; ctx.beginPath();
          for (i = 0; i <= 40; i++){ var u = i / 40, px = g0.x + (gxp - g0.x) * u, py = g0.y + (gyp - g0.y) * u, off = Math.sin(u * 30 - T * 20) * 5; if (i) ctx.lineTo(px + off * 0.7, py + off * 0.7); else ctx.moveTo(px, py); }
          ctx.stroke(); ctx.restore();
          tags.push({s:"photon γ : pas de fission", x:gxp, y:gyp - 16, o:{size:11.5, color:"#d6c2ff"}});
          var qb = v.p(0, -R0 - 0.4, 0);
          tags.push({s:st.t === "U238" ? "²³⁹U formé (il donnera ²³⁹Pu par deux β⁻)" : "²³⁶U formé", x:qb.x, y:qb.y + 22, o:{size:11, color:"#e9eef8"}});
        }
        if (st.phase === "fragments"){
          var tf2 = st.frag, ext2 = 0.9 * tf2 * tf2 + 2.2 * tf2;
          var d1b = (R1 + R2) * 0.55 + ext2 * A2 / (A1 + A2) * 2, d2b = (R1 + R2) * 0.55 + ext2 * A1 / (A1 + A2) * 2;
          if (tf2 < 0.35){ var qs = v.p(0, 0, 0); nglow(ctx, qs.x, qs.y, 120 * (0.35 - tf2) / 0.35 + 20, "#fff2c0", 0.7); }
          for (i = 0; i < ch.nu; i++){
            var an = i / ch.nu * TAU + 0.7, rn = 1 + tf2 * 5.5, pn = v.p(rn * Math.cos(an) * 0.4, rn * Math.sin(an) * 0.9, rn * Math.cos(an) * 0.8);
            nglow(ctx, pn.x, pn.y, 12, "#cfe0ff", 0.5); nball(ctx, pn.x, pn.y, 0.42 * v.sc * pn.s, "#a6b2c4");
          }
          var qa1 = v.p(-d1b, R1 + 0.5, 0), qa2 = v.p(d2b, R2 + 0.5, 0);
          if (qa1.x > 0 && qa1.x < W) tags.push({s:FF_NOM[ch.f[0]], x:qa1.x, y:qa1.y - 14, o:{size:13, color:"#ffffff", border:"#df5a44"}});
          if (qa2.x > 0 && qa2.x < W) tags.push({s:FF_NOM[ch.f[1]], x:qa2.x, y:qa2.y - 14, o:{size:13, color:"#ffffff", border:"#df5a44"}});
          var qn2 = v.p(0, -2.4, 0);
          tags.push({s:"+ " + ch.nu + " neutrons rapides · Q ≈ " + nN(ffQ(st.t, ch), 0) + " MeV", x:qn2.x, y:qn2.y + 16, o:{size:11.5, color:"#ffe39a"}});
          tags.push({s:"(≈ 200 MeV au total avec les désintégrations β des fragments)", x:qn2.x, y:qn2.y + 42, o:{size:10.5, color:"#ffe39a", weight:600}});
        }
        if (st.phase === "approche"){ var q0 = v.p(0, -R0 - 0.3, 0); tags.push({s:F.nom + " : goutte de " + F.A + " nucléons", x:q0.x, y:q0.y + 18, o:{size:11.5, color:"#e9eef8"}}); }
        if (st.phase === "selle" && st.s > 0.9 && st.s < 1.4){ var qsd = v.p(0, -R0, 0); tags.push({s:"col franchi : la répulsion des protons l'emporte", x:qsd.x, y:qsd.y + 22, o:{size:11, color:"#ffcf9a"}}); }
        ntags(S, c, tags, 26);
      } else {
        var fs = fusionState(), rmax = fs.rmax, X = function(r){ return -4.9 + r / rmax * 10; };
        var tkx = W * 0.5, tky = H * (phone ? 0.2 : 0.22), tkrx = W * (phone ? 0.36 : 0.3), tkry = H * 0.075;
        fuTokamak(S, c, tkx, tky, tkrx, tkry, T, ktS.value);
        tags.push({s:"plasma D-T d'un tokamak · kT = " + nN(ktS.value, 0) + " keV", x:tkx, y:tky - tkry - 22, o:{size:11, color:"#ffd6f4"}});
        /* loupe : une collision, agrandie dans le rail */
        var lx = tkx + tkrx * 0.55, ly = tky + tkry * 0.8;
        ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(lx, ly, 9, 0, TAU); ctx.stroke();
        ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.beginPath(); ctx.moveTo(lx - 7, ly + 7); ctx.lineTo(W * 0.12, H * 0.5); ctx.moveTo(lx + 7, ly + 7); ctx.lineTo(W * 0.9, H * 0.5); ctx.stroke(); ctx.restore();
        var VH = 2.6, Y = function(Vk){ return -1.2 + Vk / FU_VC * VH; }, wz = 0.7;
        /* rail du potentiel V(r) : ruban en relief */
        var M = phone ? 70 : 110, prof = [], WD = -0.3;
        for (i = 0; i <= M; i++){
          var r = Math.pow(i / M, 1.6) * rmax, Vk = r < FU_R ? FU_VC * WD : NE2 / r * 1000;
          prof.push([X(r), Y(Math.min(Vk, FU_VC))]);
        }
        for (i = 0; i < M; i++){
          var a = prof[i], b = prof[i + 1], cola = i / M < 0.12 ? "#c9643c" : "#5f7fb8";
          v.face([[a[0], a[1], -wz], [b[0], b[1], -wz], [b[0], b[1], wz], [a[0], a[1], wz]], cola, {up:true, amb:-0.3});
          v.face([[a[0], -2.2, wz], [b[0], -2.2, wz], [b[0], b[1], wz], [a[0], a[1], wz]], "#33405e", {amb:-0.35});
          v.face([[a[0], -2.2, -wz], [b[0], -2.2, -wz], [b[0], b[1], -wz], [a[0], a[1], -wz]], "#33405e", {amb:-0.35});
        }
        v.render(ctx);
        /* niveau d'énergie E₀ et zone interdite */
        var yE = Y(fs.E0), pE0 = v.p(X(FU_R), yE, 0), pE1 = v.p(X(fs.rc), yE, 0), pE2 = v.p(X(rmax), yE, 0);
        ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = "rgba(255,226,120,.8)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(pE1.x, pE1.y); ctx.lineTo(pE2.x, pE2.y); ctx.stroke();
        ctx.strokeStyle = "rgba(255,120,200,.85)"; ctx.setLineDash([2, 4]); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(pE0.x, pE0.y); ctx.lineTo(pE1.x, pE1.y); ctx.stroke(); ctx.restore();
        /* noyaux : T au fond du puits, D sur le rail */
        var clT = ncluster(1, 2, 3), clD = ncluster(1, 1, 5), clA = ncluster(2, 2, 9);
        var pT = [X(0) + 0.15, Y(FU_VC * WD) + 0.42, 0];
        if (fs.boom < 0){
          ndrawCluster(ctx, v, clT, pT[0], pT[1], pT[2], 0.45, 0.3, 1);
          var rD = fs.r, VD = rD < FU_R ? FU_VC * WD : NE2 / Math.max(rD, 0.1) * 1000, yD = fs.ghost ? yE + 0.35 : Y(Math.min(VD, FU_VC)) + 0.4;
          ndrawCluster(ctx, v, clD, X(rD), yD, 0, 0.4, 0.3, fs.ghost ? 0.55 : 1);
          if (fs.ghost){ var pg = v.p(X(rD), yD, 0); nglow(ctx, pg.x, pg.y, 30, "#ff8ad0", 0.5); }
          var pD = v.p(X(rD), yD + 0.5, 0);
          tags.push({s:fs.ghost ? "effet tunnel" : "²H", x:pD.x, y:pD.y - 14, o:{size:12, color:fs.ghost ? "#ffc2e8" : "#ffffff"}});
          var pTl = v.p(pT[0], pT[1] - 0.6, 0);
          tags.push({s:"³H", x:pTl.x - 18, y:pTl.y + 14, o:{size:12, color:"#ffffff"}});
        } else {
          var bt = fs.boom, pc0 = v.p(pT[0], pT[1], 0);
          if (bt < 0.4) nglow(ctx, pc0.x, pc0.y, 140 * (0.4 - bt) / 0.4 + 25, "#fff1b8", 0.8);
          var la = 0.35 * bt * 3, ln = 1.4 * bt * 3;
          ndrawCluster(ctx, v, clA, pT[0] - la * 0.6, pT[1] + la, -la * 0.5, 0.5, 0.32, 1);
          var pn3 = v.p(pT[0] + ln * 0.5, pT[1] + ln * 0.55, ln * 0.6); nglow(ctx, pn3.x, pn3.y, 14, "#cfe0ff", 0.6); nball(ctx, pn3.x, pn3.y, 0.32 * v.sc * pn3.s, "#a6b2c4");
          var pa3 = v.p(pT[0] - la * 0.6, pT[1] + la + 0.7, -la * 0.5);
          tags.push({s:"⁴He · " + nN(FU_Q * NMN / (NMA + NMN), 1) + " MeV", x:pa3.x, y:pa3.y - 12, o:{size:12, color:"#ffe39a"}});
          tags.push({s:"n · " + nN(FU_Q * NMA / (NMA + NMN), 1) + " MeV", x:pn3.x + 10, y:pn3.y - 18, o:{size:12, color:"#dfe8ff", align:"left"}});
        }
        var pB = v.p(X(FU_R), Y(FU_VC) + 0.2, 0);
        tags.push({s:"barrière " + nN(FU_VC, 0) + " keV", x:pB.x + 8, y:pB.y - 10, o:{size:11.5, color:"#ffcfae", align:"left"}});
        tags.push({s:"E₀ = " + nN(fs.E0, 1) + " keV", x:pE2.x - 4, y:pE2.y - 16, o:{size:11.5, color:"#ffe08a", align:"right"}});
        var pW = v.p(X(0), -2.2, wz);
        tags.push({s:"puits nucléaire (profondeur pas à l'échelle)", x:pW.x, y:pW.y + 14, o:{size:10, color:"#e9c3a8", align:"left"}});
        if (fs.ph !== "tunnel" && fs.boom < 0){
          var tt = fs.att + 1;
          tags.push({s:"tentative " + tt + (tt < NATT ? " : rebond" : ""), x:W - 10, y:H * 0.47, o:{size:11, color:"#c7d3ea", align:"right"}});
        }
        ntags(S, c, tags, 26);
        nT(S, c, "accéléré : 1 passage sur " + NATT + " ; en vrai ≈ 1 sur " + nN(1 / fs.P, 0), 10, 14, {size:nfz(c, 10.5), color:"rgba(255,200,235,.85)", align:"left", weight:600});
      }
      nT(S, c, "glisse pour tourner", W - 10, 14, {size:nfz(c, 11), color:"rgba(210,222,240,.7)", align:"right", weight:600});

      /* ---------- graphiques : courbe d'Aston + barrière ---------- */
      g.clear();
      var GW = g.W, GH = g.H, half = phone ? GH / 2 : GW / 2, gx = g.ctx, AX1 = fi ? 250 : 70;
      var mA = phone ? {l:40, r:12, t:24, b:GH - half + 34} : {l:40, r:GW - half + 14, t:24, b:32};
      var axA = S.draw.axes(g, {x0:0, x1:AX1, y0:0, y1:9.4, xl:"A", yl:"B/A (MeV)", l:mA.l, b:mA.b, t:mA.t, r:mA.r, stepY:2, stepX:fi ? 50 : 10});
      gx.save(); gx.beginPath(); for (i = 12; i <= AX1; i += 2){ var yy = ffAston(i); if (i === 12) gx.moveTo(axA.X(i), axA.Y(yy)); else gx.lineTo(axA.X(i), axA.Y(yy)); }
      gx.strokeStyle = "#8a95a3"; gx.lineWidth = 1.8; gx.stroke(); gx.restore();
      FF_PTS.forEach(function(p){ if (p[1] <= AX1) S.draw.dot(g, axA.X(p[1]), axA.Y(p[2]), 3, "#8a95a3"); });
      var reac;
      if (fi){
        var st2 = fissionState(), t2 = st2.t, chn = st2.ch;
        reac = [[t2 === "U235" ? "²³⁵U" : "²³⁸U", FF_ZA[t2][1], ffB(t2) / FF_ZA[t2][1], "#c0321d"]];
        if (st2.go) chn.f.forEach(function(kf){ reac.push([FF_NOM[kf], FF_ZA[kf][1], ffB(kf) / FF_ZA[kf][1], "#24775a"]); });
        if (st2.go){ reac.slice(1).forEach(function(p){ S.draw.arrow(g, axA.X(reac[0][1]) - 6, axA.Y(reac[0][2]) - 4, axA.X(p[1]) + 6, axA.Y(p[2]) + 5, "rgba(36,119,90,.7)", 1.6); }); }
      } else {
        reac = [["²H", 2, ffB("H2") / 2, "#c0321d"], ["³H", 3, ffB("H3") / 3, "#c0321d"], ["⁴He", 4, ffB("He4") / 4, "#24775a"]];
        S.draw.arrow(g, axA.X(3.5), axA.Y(reac[1][2]) - 6, axA.X(3.9), axA.Y(reac[2][2]) + 8, "rgba(36,119,90,.8)", 1.6);
      }
      var gtags = [];
      reac.forEach(function(p, j){ S.draw.dot(g, axA.X(p[1]), axA.Y(p[2]), 5.5, p[3]); gtags.push([p[0] + " " + nN(p[2], 2), p[1], p[2], p[3], j]); });
      gtags.forEach(function(tg){
        var X0 = axA.X(tg[1]), Y0 = axA.Y(tg[2]), left = fi && tg[1] > 150, dy = fi ? (tg[4] === 0 ? 16 : tg[4] === 1 ? -14 : 16) : (tg[4] === 2 ? 14 : 0);
        nT(S, g, tg[0], X0 + (left ? -9 : 9), Y0 + dy, {size:nfz(g, 11), color:tg[3], align:left ? "right" : "left", halo:"#ffffff"});
      });
      var pfe = axA.X(56); nT(S, g, "⁵⁶Fe", pfe, axA.Y(8.79) + 13, {size:nfz(g, 10.5), color:"#5f6b7a", halo:"#ffffff"});
      nT(S, g, "Courbe d'Aston : " + (fi ? (fissionState().go ? "les fragments sont plus liés" : "pas de fragments, pas de gain") : "⁴He est bien plus lié"), axA.L, 10, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});
      /* deuxième graphique */
      var ox = phone ? {l:44, r:12, t:half + 30, b:32} : {l:half + 44, r:12, t:24, b:32};
      if (fi){
        var st3 = fissionState(), Bf = st3.F.Bf;
        var axB = S.draw.axes(g, {x0:0, x1:1.8, y0:-4, y1:Math.max(10, st3.Es + 1.5), xl:"", yl:"énergie (MeV)", l:ox.l, r:ox.r, t:ox.t, b:ox.b, stepX:0.5, stepY:2, hideZero:true});
        gx.save(); gx.beginPath(); gx.rect(axB.L, axB.T, axB.R - axB.L, axB.B - axB.T); gx.clip(); gx.beginPath(); for (i = 0; i <= 180; i++){ var s1 = i / 100, e1 = ffE(s1, Bf); if (i) gx.lineTo(axB.X(s1), axB.Y(e1)); else gx.moveTo(axB.X(s1), axB.Y(e1)); }
        gx.strokeStyle = "#c26a0c"; gx.lineWidth = 2.4; gx.stroke(); gx.restore();
        S.draw.line(g, axB.L, axB.Y(st3.Es), axB.R, axB.Y(st3.Es), st3.go ? "#24775a" : "#6236c4", 1.6, [6, 4]);
        nT(S, g, "E* = " + nN(st3.Es, 2) + " MeV", axB.R - 4, axB.Y(st3.Es) - 9, {size:nfz(g, 11), color:st3.go ? "#24775a" : "#6236c4", align:"right", halo:"#ffffff"});
        S.draw.line(g, axB.X(1), axB.Y(Bf), axB.X(1), axB.Y(0), "#c26a0c", 1, [3, 3]);
        nT(S, g, "B_f ≈ " + nN(Bf, 1) + " MeV", axB.X(1) + 5, axB.Y(Bf) + (st3.Es - Bf > 0 && st3.Es - Bf < 1.2 ? 12 : -10), {size:nfz(g, 11), color:"#c26a0c", align:"left", halo:"#ffffff"});
        var sb = Math.min(st3.s, 1.8), eb = ffE(sb, Bf);
        S.draw.dot(g, axB.X(sb), axB.Y(Math.max(-4, eb)), 6.5, "#df5a44");
        if (st3.go) nT(S, g, "↓ puis −" + nN(ffQ(st3.t, st3.ch), 0) + " MeV", axB.X(1.5), axB.Y(-3.2), {size:nfz(g, 10.5), color:"#5f6b7a", align:"right", halo:"#ffffff"});
        nT(S, g, "allongement →", axB.R, axB.B + 18, {size:nfz(g, 11), color:"#2c3a4e", align:"right"});
        nT(S, g, "Barrière de fission (goutte liquide, allure)", axB.L, ox.t - 14, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});
      } else {
        var fs2 = fusionState(), kT2 = fs2.kT, Emx = Math.max(60, 5 * fs2.E0);
        var axC = S.draw.axes(g, {x0:0, x1:Emx, y0:0, y1:1.12, xl:"E (keV)", yl:"relatif", l:ox.l, r:ox.r, t:ox.t, b:ox.b, stepY:0.5});
        var pm = fuP(Emx), prodMax = 0, Ee;
        for (i = 1; i <= 300; i++){ Ee = Emx * i / 300; prodMax = Math.max(prodMax, Math.exp(-Ee / kT2) * fuP(Ee)); }
        S.draw.fn(g, axC, function(E){ return Math.exp(-E / kT2); }, "#2f7fd1", 2);
        S.draw.fn(g, axC, function(E){ return E > 0 ? fuP(E) / pm : 0; }, "#c43a7a", 2, [5, 4]);
        S.draw.area(g, axC, function(E){ return E > 0 ? Math.exp(-E / kT2) * fuP(E) / prodMax : 0; }, 0.01, Emx, "#c26a0c", 0.25);
        S.draw.fn(g, axC, function(E){ return E > 0 ? Math.exp(-E / kT2) * fuP(E) / prodMax : 0; }, "#c26a0c", 2.6);
        S.draw.line(g, axC.X(fs2.E0), axC.T, axC.X(fs2.E0), axC.B, "#13233a", 1, [3, 3]);
        nT(S, g, "E₀", axC.X(fs2.E0) + 4, axC.T + 22, {size:nfz(g, 11), color:"#13233a", align:"left", halo:"#ffffff"});
        S.draw.legend(g, [["#2f7fd1", "e^(−E/kT) : particules"], ["#c43a7a", "P(E) : tunnel", true], ["#c26a0c", "produit : pic de Gamow"]], axC.R - 2, axC.B - 64, {align:"right"});
        nT(S, g, "Qui fusionne ? (courbes ramenées à 1)", axC.L, ox.t - 14, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});
      }

      /* ---------- afficheurs ---------- */
      if (fi){
        var s4 = fissionState();
        ro.set(0, nN(s4.Es, 2) + " MeV");
        ro.set(1, "≈ " + nN(s4.F.Bf, 1) + " MeV");
        ro.set(2, s4.go ? "fission" : "capture : photon γ");
        ro.set(3, s4.go ? "≈ " + nN(ffQ(s4.t, s4.ch), 0) + " MeV" : "≈ " + nN(s4.Es, 1) + " MeV (γ)");
        var thr = (s4.F.Bf - s4.Sn) * (s4.F.A + 1) / s4.F.A;
        nt.set((s4.t === "U235" ? "Avec ²³⁵U, le neutron capturé apporte Sₙ = " + nN(s4.Sn, 2) + " MeV, déjà plus que la barrière : un neutron lent suffit. (En réalité, environ 1 capture sur 7 se termine quand même par un photon γ.)"
          : "Avec ²³⁸U, le neutron capturé n'apporte que Sₙ = " + nN(s4.Sn, 2) + " MeV : il faut un neutron d'au moins " + nN(thr, 1) + " MeV pour passer la barrière. Sinon, ²³⁹U se forme et donne du plutonium.") + (s4.go ? " Q ≈ " + nN(ffQ(s4.t, s4.ch), 0) + " MeV à la scission (≈ 200 MeV au total avec les désintégrations β des fragments)." : ""), s4.go ? "ok" : "warn");
      } else {
        var f4 = fusionState();
        ro.set(0, nN(FU_VC, 0) + " keV");
        ro.set(1, nN(f4.E0, 1) + " keV");
        ro.set(2, nsci(f4.P, 2));
        ro.set(3, nN(FU_Q, 2) + " MeV");
        nt.set("À kT = " + nN(f4.kT, 0) + " keV, soit " + nsci(f4.kT * 1000 / 8.617333e-5, 2) + " K, les noyaux qui fusionnent ont environ E₀ = " + nN(f4.E0, 1) + " keV : " + nN(FU_VC / f4.E0, 0) + " fois moins que la barrière. Sans effet tunnel, aucune fusion.", "ok");
      }
    });
  }
});

/* =====================================================================
   3. Rutherford : trajectoires hyperboliques et section efficace (pq11)
   ===================================================================== */
var RU_T = {Au:{nom:"Or", Z:79, A:197, col:"#e8b93a"}, Ag:{nom:"Argent", Z:47, A:108, col:"#c9d1dc"}, Cu:{nom:"Cuivre", Z:29, A:64, col:"#d9824a"}, Al:{nom:"Aluminium", Z:13, A:27, col:"#b8c4d6"}};
var RU_BMAX = 250;   /* rayon du faisceau tiré au hasard (fm) */
/* trajectoire dans son plan (fm) : x le long du faisceau, y du côté du paramètre d'impact ; a = d/2 */
function ruPt(a, b, xi){
  var e = Math.sqrt(1 + (b / a) * (b / a)), th = 2 * Math.atan2(a, b), fp = th / 2 + PI / 2;
  var xp = a * (Math.cosh(xi) + e), yp = b * Math.sinh(xi);
  return [xp * Math.cos(fp) + yp * Math.sin(fp), xp * Math.sin(fp) - yp * Math.cos(fp)];
}
/* ξ tel que r = a(e cosh ξ + 1) = R */
function ruXi(a, b, R){ var e = Math.sqrt(1 + (b / a) * (b / a)); return Math.acosh(Math.max(1, (R / a - 1) / e)); }
function ruTime(a, b, xi){ var e = Math.sqrt(1 + (b / a) * (b / a)); return a * (e * Math.sinh(xi) + xi); }   /* temps × v∞ (fm) */
function ruXiAt(a, b, t){ var e = Math.sqrt(1 + (b / a) * (b / a)), x = Math.asinh(t / (a * (e + 1))); for (var i = 0; i < 30; i++){ var f = e * Math.sinh(x) + x - t / a, df = e * Math.cosh(x) + 1; x -= f / df; } return x; }

SFA.sim({
  id:"pq-rutherford-section-efficace", ch:"pq11", tag:"Diffusion",
  titre:"Rutherford : trajectoires hyperboliques et section efficace",
  resume:"Une particule α frôle un noyau d'or et suit une hyperbole. Avec des milliers d'α tirés au hasard, les angles de déviation suivent la loi en 1/sin⁴(θ/2).",
  but:"Mode « une particule » : attrape l'α à gauche et monte-le ou descends-le pour régler le paramètre d'impact b ; l'angle θ = 2 arctan(d/2b) s'affiche. Mode « faisceau » : des milliers d'α remplissent l'histogramme des angles. Glisse ailleurs pour tourner la vue.",
  aRetenir:"Plus l'α passe près du noyau, plus il est dévié : θ = 2 arctan(d/2b), et le nombre d'α par unité d'angle solide varie comme 1/sin⁴(θ/2).",
  piege:"Les rares α renvoyés en arrière ne heurtent pas le noyau : ils rebroussent chemin à une distance d bien plus grande que son rayon (pour l'or à 5 MeV : d ≈ 45 fm contre R ≈ 7 fm). Avec une cible légère et des α rapides, ce n'est plus vrai.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 340 : 400), g = k.canvas(phone ? 220 : 220);
    var mS = k.seg("Mode", [["une", "Une particule α"], ["faisceau", "Faisceau"]], "une", function(){ showCtl(); clearH(); });
    var tS = k.select("Feuille cible", Object.keys(RU_T).map(function(id){ return [id, RU_T[id].nom + " (Z = " + RU_T[id].Z + ")"]; }), "Au", function(){ clearH(); });
    var eS = k.slider("Énergie des α E", 2, 10, 0.1, 5, "MeV", function(){ clearH(); });
    var bS = k.slider("Paramètre d'impact b", 0, 120, 0.5, 30, "fm", function(){ auto = false; one.t = -1; });
    k.button("Vider l'histogramme", function(){ clearH(); });
    var ro = k.readouts(["Approche frontale d = zZe²/(4πε₀E)", "", "", ""]);
    var labs = ro.el.querySelectorAll("small");
    var nt = k.note("", "ok");
    var auto = true, T = 0, NB = 36, hist = new Float64Array(NB), nTot = 0, nBack = 0, shots = [], flashes = [], one = {t:-1, b:30, trail:[]};
    function showCtl(){
      var une = mS.value === "une";
      bS.el.parentNode.style.display = une ? "" : "none";
      ["Angle de déviation θ", "Distance minimale r_min", "Contact avec le noyau ?"].forEach(function(s, i){ labs[i + 1].textContent = une ? s : ["α tirés", "Renvoyés en arrière (θ > 90°)", "Prévu par Rutherford"][i]; });
    }
    function clearH(){ hist = new Float64Array(NB); nTot = 0; nBack = 0; shots = []; flashes = []; one.t = -1; k.redraw(); }
    showCtl();
    function tgt(){ return RU_T[tS.value]; }
    /* noyau supposé fixe (pas de correction de recul) : très bon pour l'or, approché pour l'aluminium */
    function aOf(){ return NE2 * 2 * tgt().Z / eS.value / 2; }
    var FIXE = " Noyau supposé fixe : très bon pour l'or, approché pour l'aluminium.";

    var SC = 30, LV = 138;   /* 1 unité monde = 30 fm ; demi-largeur de la vue (fm) */
    var v = new N3(); v.a = -0.35; v.b = 0.28; v.f = 24; v.set();
    var HB = null;
    norbit(c, v, k, [-0.9, 1.2], null, function(p){ if (mS.value === "une" && HB && Math.hypot(p.x - HB.x, p.y - HB.y) < 24){ auto = false; return false; } }, function(p){
      if (!HB) return;
      var q0 = v.p(-LV / SC, 0, 0), q1 = v.p(-LV / SC, 1, 0), den = q1.y - q0.y;
      if (Math.abs(den) < 1e-3) return;
      var bb = (p.y - q0.y) / den * SC; bS.set(Math.round(Math.max(0, Math.min(120, bb)) * 2) / 2); one.t = -1;
    });
    c.pointer(function(type, p){ if (type === "move") c.cv.style.cursor = mS.value === "une" && HB && Math.hypot(p.x - HB.x, p.y - HB.y) < 24 ? "ns-resize" : "grab"; });

    var lp = k.loop(function(dt){
      T += dt;
      var a = aOf(), i;
      if (!v.user){ v.a = -0.35 + 0.25 * Math.sin(T * 0.18); v.set(); }
      if (mS.value === "une"){
        var DUR = 2.6;
        if (one.t < 0 || one.t > DUR){
          if (one.t > DUR && one.trail.length){ one.old = (one.old || []).concat([{b:one.b, a:a}]).slice(-5); }
          one.t = 0; if (auto) bS.set(Math.round((4 + 52 * (0.5 + 0.5 * Math.sin(T * 0.45 + 1))) * 2) / 2); one.b = bS.value; one.a = a; one.trail = [];
        }
        one.t += dt;
      } else {
        /* tirages : beaucoup d'α comptés, quelques-uns dessinés */
        var nShot = Math.round(dt * 1500);
        for (i = 0; i < nShot; i++){
          var b = RU_BMAX * Math.sqrt(Math.random()), th = 2 * Math.atan2(a, b), bin = Math.min(NB - 1, Math.floor(th / PI * NB));
          hist[bin]++; nTot++; if (th > PI / 2) nBack++;
          if (th > PI / 4 && Math.random() < 0.5) flashes.push({th:th, ph:Math.random() * TAU, age:0});
        }
        if (Math.random() < dt * 9){ var bv = LV * 0.9 * Math.sqrt(Math.random()); if (Math.random() < 0.35) bv *= 0.25; shots.push({b:bv, ph:Math.random() * TAU, t:0, a:a}); }
        shots.forEach(function(s){ s.t += dt; }); shots = shots.filter(function(s){ return s.t < 2.4; });
      }
      flashes.forEach(function(f){ f.age += dt; }); flashes = flashes.filter(function(f){ return f.age < 1.2; }); if (flashes.length > 160) flashes = flashes.slice(-160);
      k.redraw();
    });
    lp.play();

    /* position monde (unités) d'un α à l'instant u ∈ [0, 1] du vol ; φ tourne le plan autour de l'axe du faisceau */
    function trajPts(a, b, ph, n){
      var xa = -ruXi(a, b, Math.hypot(LV, b)), xm = ruXi(a, b, LV), pts = [];
      for (var i = 0; i <= n; i++){ var xi = xa + (xm - xa) * i / n, q = ruPt(a, b, xi); pts.push([q[0] / SC, q[1] * Math.cos(ph) / SC, q[1] * Math.sin(ph) / SC]); }
      return pts;
    }
    function posAt(a, b, ph, u){
      var xi = ruXiU(a, b, u), q = ruPt(a, b, xi);
      return [q[0] / SC, q[1] * Math.cos(ph) / SC, q[1] * Math.sin(ph) / SC];
    }
    /* ξ à la fraction u du vol (temps uniforme), entre l'entrée (x = −LV) et l'écran (r = LV) */
    function ruXiU(a, b, u){ var xa = -ruXi(a, b, Math.hypot(LV, b)), xm = ruXi(a, b, LV), ta = ruTime(a, b, xa), tb = ruTime(a, b, xm); return ruXiAt(a, b, ta + (tb - ta) * u); }
    function ruIdx(a, b, xi, n){ var xa = -ruXi(a, b, Math.hypot(LV, b)), xm = ruXi(a, b, LV); return Math.round((xi - xa) / (xm - xa) * n); }
    function polyline(ctx, pts, upto, col, w, alpha){
      ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; ctx.beginPath();
      for (var i = 0; i <= upto && i < pts.length; i++){ var q = v.p(pts[i][0], pts[i][1], pts[i][2]); if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
      ctx.stroke(); ctx.restore();
    }
    var clNuc = {}, CLA = ncluster(2, 2, 4);
    function nucCluster(A, Z){ var key = A + "-" + Z; if (!clNuc[key]) clNuc[key] = ncluster(Math.min(Z, 40), Math.min(A - Z, 50), 11); return clNuc[key]; }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, a = aOf(), tg = tgt(), une = mS.value === "une", i;
      nlab(ctx, W, H, "#18213a", "#070b16");
      var RD = 4.6;
      v.sc = Math.min((W - 20) / (2 * RD + 2.6), (H - 56) / (2 * RD + 0.4)); v.cx = W * 0.54; v.cy = H * 0.53; v.clear();   /* écran de détection (sphère), en unités monde */
      /* sphère de l'écran : méridiens et parallèles en fil */
      ctx.save(); ctx.lineWidth = 1;
      for (i = 0; i < 12; i++){
        var phm = i / 12 * PI; ctx.beginPath();
        for (var j = 0; j <= 40; j++){ var tt = j / 40 * TAU, q = v.p(RD * Math.cos(tt), RD * Math.sin(tt) * Math.cos(phm), RD * Math.sin(tt) * Math.sin(phm)); if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
        ctx.strokeStyle = "rgba(120,210,170,.10)"; ctx.stroke();
      }
      for (i = 1; i < 6; i++){
        var thp = i / 6 * PI; ctx.beginPath();
        for (j = 0; j <= 40; j++){ var pp = j / 40 * TAU, q2 = v.p(RD * Math.cos(thp), RD * Math.sin(thp) * Math.cos(pp), RD * Math.sin(thp) * Math.sin(pp)); if (j) ctx.lineTo(q2.x, q2.y); else ctx.moveTo(q2.x, q2.y); }
        ctx.strokeStyle = "rgba(120,210,170,.13)"; ctx.stroke();
      }
      ctx.restore();
      /* axe du faisceau */
      var ax0 = v.p(-RD * 1.12, 0, 0), ax1 = v.p(RD * 1.12, 0, 0);
      S.draw.line(c, ax0.x, ax0.y, ax1.x, ax1.y, "rgba(255,255,255,.22)", 1, [4, 5]);
      /* collimateur de la source (bloc de plomb percé), à gauche */
      v.box(-RD - 1.3, -0.55, -0.55, -RD - 0.35, 0.55, 0.55, "#5d6675", {});
      v.render(ctx); v.clear();
      var qs = v.p(-RD - 0.35, 0, 0); nglow(ctx, qs.x, qs.y, 16, "#ffcf6a", 0.5);
      /* noyau cible : amas de nucléons à l'échelle (rayon 1,2 A^(1/3) fm) */
      var Rn = 1.2 * Math.cbrt(tg.A) / SC, qn = v.p(0, 0, 0);
      nglow(ctx, qn.x, qn.y, Math.max(14, Rn * v.sc * 3.2), "#ff8a5a", 0.35);
      ndrawCluster(ctx, v, nucCluster(tg.A, tg.Z), 0, 0, 0, Math.max(Rn, 0.12), Math.max(Rn, 0.12) * 0.32, 1);
      var tags = [];
      /* cercle de rebroussement frontal : rayon d */
      ctx.save(); ctx.strokeStyle = "rgba(255,120,120,.35)"; ctx.setLineDash([3, 4]); ctx.beginPath();
      for (i = 0; i <= 60; i++){ var ta = i / 60 * TAU, qd = v.p(2 * a / SC * Math.cos(ta), 2 * a / SC * Math.sin(ta), 0); if (i) ctx.lineTo(qd.x, qd.y); else ctx.moveTo(qd.x, qd.y); }
      ctx.stroke(); ctx.restore();
      if (une){
        var b = one.b, A1 = one.a || a, npt = 160, P = trajPts(A1, b, 0, npt);
        (one.old || []).forEach(function(o, m, arr){ polyline(ctx, trajPts(o.a, o.b, 0, 90), 90, "#ffd36a", 1.4, 0.12 + 0.1 * m / arr.length); });
        /* asymptotes et paramètre d'impact */
        var e = Math.sqrt(1 + (b / A1) * (b / A1)), th = 2 * Math.atan2(A1, b);
        var pIn0 = v.p(-LV / SC, b / SC, 0), pIn1 = v.p(0.6, b / SC, 0);
        S.draw.line(c, pIn0.x, pIn0.y, pIn1.x, pIn1.y, "rgba(255,255,255,.35)", 1, [5, 4]);
        var ex = [Math.cos(th), Math.sin(th)], far = ruPt(A1, b, ruXi(A1, b, LV)), ca = [far[0] - ex[0] * LV * 1.1, far[1] - ex[1] * LV * 1.1];
        var pOut0 = v.p(ca[0] / SC, ca[1] / SC, 0), pOut1 = v.p(far[0] / SC, far[1] / SC, 0);
        S.draw.line(c, pOut0.x, pOut0.y, pOut1.x, pOut1.y, "rgba(255,255,255,.35)", 1, [5, 4]);
        /* trajectoire complète en pâle, partie parcourue en vif */
        var u = Math.min(1, one.t / 2.6), idx = ruIdx(A1, b, ruXiU(A1, b, u), npt);
        polyline(ctx, P, npt, "#ffd36a", 1.3, 0.45);
        polyline(ctx, P, idx, "#ffd36a", 2.6, 0.95);
        var pa = posAt(A1, b, 0, u), qa = v.p(pa[0], pa[1], pa[2]);
        nglow(ctx, qa.x, qa.y, 18, "#ffd36a", 0.6); ndrawCluster(ctx, v, CLA, pa[0], pa[1], pa[2], 0.16, 0.07, 1);
        /* r_min */
        var rmin = A1 + Math.hypot(A1, b), fpp = th / 2 + PI / 2, qr = v.p(rmin * Math.cos(fpp) / SC, rmin * Math.sin(fpp) / SC, 0);
        S.draw.line(c, qn.x, qn.y, qr.x, qr.y, "rgba(140,220,255,.7)", 1.2, [2, 3]);
        /* poignée b */
        var hb = v.p(-LV / SC, b / SC, 0); HB = hb;
        ctx.save(); ctx.fillStyle = "#ffe7a6"; ctx.strokeStyle = "#7a5a12"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(hb.x, hb.y, 8, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
        nT(S, c, "↕", hb.x, hb.y + 0.5, {size:11, color:"#5a420a"});
        var hb0 = v.p(-LV / SC, 0, 0); S.draw.line(c, hb0.x - 10, hb0.y, hb0.x - 10, hb.y, "#ffe7a6", 1.4);
        tags.push({s:"b = " + nN(b, 1) + " fm", x:hb.x - 14, y:(hb.y + hb0.y) / 2, o:{size:12, color:"#ffe7a6", align:"right"}});
        tags.push({s:"θ = " + nN(th * 180 / PI, 1) + "°", x:pOut1.x + 8, y:pOut1.y - 14, o:{size:12.5, color:"#ffffff", border:"#ffd36a", align:"left"}});
        tags.push({s:"r_min = " + nN(rmin, 1) + " fm", x:(qn.x + qr.x) / 2 + 10, y:(qn.y + qr.y) / 2 - 6, o:{size:11, color:"#bfe8ff", align:"left"}});
      } else {
        HB = null;
        shots.forEach(function(s){
          var P2 = trajPts(s.a, s.b, s.ph, 70), u2 = Math.min(1, s.t / 2.2), id2 = ruIdx(s.a, s.b, ruXiU(s.a, s.b, u2), 70);
          polyline(ctx, P2, id2, "#ffd36a", 1.4, Math.max(0, 0.85 - s.t * 0.25));
          if (u2 < 1){ var pa2 = posAt(s.a, s.b, s.ph, u2), q3 = v.p(pa2[0], pa2[1], pa2[2]); nball(ctx, q3.x, q3.y, 3.2, "#ffd36a"); }
        });
      }
      /* scintillations sur l'écran (directions θ, φ) */
      flashes.forEach(function(f){
        var qf = v.p(RD * Math.cos(f.th), RD * Math.sin(f.th) * Math.cos(f.ph), RD * Math.sin(f.th) * Math.sin(f.ph));
        nglow(ctx, qf.x, qf.y, 9, "#9dffcf", 0.9 * (1 - f.age / 1.2));
      });
      if (une && one.t > 2.0 && one.t < 2.6){
        var th2 = 2 * Math.atan2(one.a || a, one.b), qf2 = v.p(RD * Math.cos(th2), RD * Math.sin(th2), 0);
        nglow(ctx, qf2.x, qf2.y, 16, "#9dffcf", 0.9);
      }
      var qd2 = v.p(2 * a / SC * Math.cos(2.4), 2 * a / SC * Math.sin(2.4), 0);
      tags.push({s:"d = " + nN(2 * a, 1) + " fm", x:qd2.x - 6, y:qd2.y - 10, o:{size:10.5, color:"#ffb3b3", align:"right"}});
      tags.push({s:"noyau " + nnuc(tg.Z, tg.A) + " (R ≈ " + nN(1.2 * Math.cbrt(tg.A), 1) + " fm)", x:qn.x + 12, y:qn.y + 26, o:{size:10.5, color:"#ffd2b8", align:"left"}});
      var qsc = v.p(RD * Math.cos(1.1), RD * Math.sin(1.1), 0);
      tags.push({s:"écran de ZnS", x:qsc.x + 6, y:qsc.y - 10, o:{size:10.5, color:"#a9f5d2", align:"left"}});
      tags.push({s:"source α", x:qs.x, y:qs.y + 26, o:{size:10.5, color:"#ffe3a6"}});
      ntags(S, c, tags, 26);
      nT(S, c, "glisse pour tourner", W - 10, 14, {size:nfz(c, 11), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      if (une) nT(S, c, "attrape l'α à gauche pour régler b", 10, 14, {size:nfz(c, 11), color:"rgba(255,231,166,.85)", align:"left", weight:600});
      else nT(S, c, "le noyau est à l'échelle, l'écran est très loin", 10, 14, {size:nfz(c, 11), color:"rgba(169,245,210,.85)", align:"left", weight:600});
      nT(S, c, "50 fm", 34, H - 26, {size:nfz(c, 10.5), color:"#e9eef8"});
      var e0 = v.p(0, 0, 0), e1 = v.p(50 / SC, 0, 0), wsb = Math.hypot(e1.x - e0.x, e1.y - e0.y);
      S.draw.line(c, 34 - wsb / 2, H - 14, 34 + wsb / 2, H - 14, "#e9eef8", 2);

      /* ---- graphique ---- */
      g.clear();
      if (une){
        var bm = 120, axg = S.draw.axes(g, {x0:0, x1:bm, y0:0, y1:180, xl:"b (fm)", yl:"θ (°)", l:44, b:32, t:24, r:14, stepY:45});
        S.draw.fn(g, axg, function(bb){ return 2 * Math.atan2(a, bb) * 180 / PI; }, "#c26a0c", 2.4);
        S.draw.line(g, axg.L, axg.Y(90), axg.R, axg.Y(90), "#8a95a3", 1, [3, 3]);
        S.draw.line(g, axg.X(a), axg.Y(90), axg.X(a), axg.B, "#8a95a3", 1, [3, 3]);
        nT(S, g, "b = d/2 → θ = 90°", axg.X(a) + 6, axg.Y(90) - 10, {size:nfz(g, 11), color:"#5f6b7a", align:"left", halo:"#ffffff"});
        var bb0 = one.b, th0 = 2 * Math.atan2(one.a || a, bb0) * 180 / PI;
        S.draw.dot(g, axg.X(Math.min(bb0, bm)), axg.Y(th0), 6, "#c0321d");
        nT(S, g, "Angle de déviation selon b : θ = 2 arctan(d / 2b)", axg.L, 11, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});
      } else {
        var thMin = 2 * Math.atan2(a, RU_BMAX), dens = [], ymx = 1, ymn = 1e9;
        for (i = 0; i < NB; i++){
          var t1 = i / NB * PI, t2 = (i + 1) / NB * PI, dO = TAU * (Math.cos(t1) - Math.cos(t2));
          var full = t1 >= thMin;
          dens.push(full && hist[i] > 0 ? hist[i] / dO : 0);
        }
        function pred(t){ var s2 = Math.sin(t / 2); return nTot * (a / 2) * (a / 2) / (Math.pow(s2, 4) * PI * RU_BMAX * RU_BMAX); }
        var lo = Math.max(1e-1, pred(PI) * 0.3), hi = Math.max(pred(Math.max(thMin, PI / NB)) * 2, 10);
        var L0 = Math.floor(Math.log10(lo)), L1 = Math.ceil(Math.log10(hi)); if (L1 - L0 < 2) L1 = L0 + 2;
        var axh = S.draw.axes(g, {x0:0, x1:180, y0:0, y1:L1 - L0, xl:"θ (°)", yl:"α par stéradian (log)", l:48, b:32, t:24, r:14, stepX:30, stepY:L1 - L0 > 6 ? 2 : 1});
        var YLh = axh.Y; axh.Y = function(l){ return YLh(l - L0); };
        var gx = g.ctx;
        for (i = 0; i < NB; i++){
          if (!(dens[i] > 0)) continue;
          var x0 = axh.X(i / NB * 180) + 1, x1 = axh.X((i + 1) / NB * 180) - 1, yv = axh.Y(Math.max(L0, Math.log10(dens[i])));
          gx.fillStyle = i >= NB / 2 ? "rgba(192,50,29,.75)" : "rgba(194,106,12,.7)"; gx.fillRect(x0, yv, x1 - x0, axh.B - yv);
        }
        S.draw.fn(g, axh, function(td){ var t = td * PI / 180; return t < thMin ? NaN : Math.log10(pred(t)); }, "#1f4b9e", 2.2);
        nT(S, g, "— Rutherford : ∝ 1/sin⁴(θ/2)", axh.R - 4, axh.T + 10, {size:nfz(g, 11.5), color:"#1f4b9e", align:"right", halo:"#ffffff"});
        nT(S, g, "Histogramme des angles (" + nN(nTot, 0) + " α)", axh.L, 11, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});
        /* graduations logarithmiques : 10ⁿ à la place des exposants */
        gx.save(); gx.fillStyle = "#ffffff"; gx.fillRect(0, axh.T - 8, axh.L - 3, axh.B - axh.T + 16); gx.restore();
        for (var Ly = L0; Ly <= L1; Ly += (L1 - L0 > 6 ? 2 : 1)) nT(S, g, "10" + nsup(Ly), axh.L - 6, axh.Y(Ly), {size:10, color:"#7b8694", align:"right", weight:600});
      }

      /* ---- afficheurs ---- */
      ro.set(0, nN(2 * a, 1) + " fm");
      var Rc = 1.2 * (Math.cbrt(tg.A) + Math.cbrt(4));
      if (une){
        var bq = one.b, aq = one.a || a, thq = 2 * Math.atan2(aq, bq) * 180 / PI, rq = aq + Math.hypot(aq, bq);
        ro.set(1, nN(thq, 1) + "°"); ro.set(2, nN(rq, 1) + " fm");
        ro.set(3, rq < Rc ? "oui : r_min < " + nN(Rc, 1) + " fm" : "non (contact à " + nN(Rc, 1) + " fm)");
        nt.set(rq < Rc ? "L'α touche le noyau : la force forte s'en mêle et la formule de Rutherford ne tient plus. C'est en cherchant cet écart qu'on a mesuré le rayon des noyaux." + FIXE
          : "L'α est repoussé par la force électrique seule et ne touche jamais le noyau : il rebrousse chemin à r_min = " + nN(rq, 1) + " fm, alors que les deux noyaux se toucheraient à " + nN(Rc, 1) + " fm." + FIXE, rq < Rc ? "warn" : "ok");
      } else {
        ro.set(1, nN(nTot, 0)); ro.set(2, nTot ? nN(nBack / nTot * 100, 3) + " %" : "—"); ro.set(3, nN(Math.pow(a / RU_BMAX, 2) * 100, 3) + " %");
        if (2 * a < Rc) nt.set("Attention : ici d = " + nN(2 * a, 1) + " fm, moins que la distance de contact " + nN(Rc, 1) + " fm. Les α les plus déviés touchent le noyau : la loi de Rutherford ne tient plus aux grands angles. L'histogramme la suit encore, une vraie mesure s'en écarterait." + FIXE, "warn");
        else nt.set("Le faisceau couvre un disque de rayon " + RU_BMAX + " fm autour de chaque noyau. Un α est renvoyé en arrière seulement si b < d/2 = " + nN(a, 1) + " fm : c'est rare, et d'autant plus rare que la cible est légère ou que l'α est rapide (σ ∝ Z²/E²)." + FIXE, "ok");
      }
    });
  }
});

/* =====================================================================
   4. Radioactivité α : la particule qui traverse la barrière (pq11)
   ===================================================================== */
/* modèle de Gamow : α préformée dans le noyau fils (Z − 2, A − 4), rayon R = 1,2 (A_f^(1/3) + 4^(1/3)) fm */
var GA_EL = {Po:{nom:"Polonium", Z:84, A:212, col:"#c0321d"}, Rn:{nom:"Radon", Z:86, A:222, col:"#6236c4"}, Ra:{nom:"Radium", Z:88, A:226, col:"#24775a"},
  Th:{nom:"Thorium", Z:90, A:232, col:"#c26a0c"}, U:{nom:"Uranium", Z:92, A:238, col:"#1f4b9e"}};
/* émetteurs pair-pair mesurés : Q (MeV), demi-vie (s) */
var GA_DATA = [["U", 238, 4.270, 4.468e9 * VY], ["U", 234, 4.858, 2.455e5 * VY], ["U", 232, 5.414, 68.9 * VY], ["Th", 232, 4.082, 1.405e10 * VY], ["Th", 230, 4.770, 7.54e4 * VY], ["Th", 228, 5.520, 1.912 * VY],
  ["Ra", 226, 4.871, 1600 * VY], ["Ra", 224, 5.789, 3.632 * VD], ["Rn", 222, 5.590, 3.8235 * VD], ["Rn", 220, 6.405, 55.6], ["Po", 218, 6.115, 3.098 * 60], ["Po", 216, 6.906, 0.145],
  ["Po", 214, 7.833, 164.3e-6], ["Po", 212, 8.954, 0.299e-6], ["Po", 210, 5.407, 138.376 * VD]];
var GA_CLA = ncluster(2, 2, 4);
function gaModel(Z, A, Ea){
  var Q = Ea * A / (A - 4), Md = (A - 4) * NU, mu = NMA * Md / (NMA + Md), kk = 2 * (Z - 2) * NE2;
  var R = 1.2 * (Math.cbrt(A - 4) + Math.cbrt(4)), rc = kk / Q, x = Math.min(1, R / rc);
  var G = Math.sqrt(2 * mu) / NHC * Math.sqrt(kk * rc) * (Math.acos(Math.sqrt(x)) - Math.sqrt(x * (1 - x)));
  var v = Math.sqrt(2 * Q / mu) * NC_FMS, f = v / (2 * R), lnP = -2 * G;
  return {Q:Q, R:R, rc:rc, VR:kk / R, G2:2 * G, lnP:lnP, f:f, T:Math.LN2 / f * Math.exp(2 * G), log10T:Math.log10(Math.LN2 / f) + 2 * G / Math.LN10};
}
/* 10^x écrit proprement, même pour des exposants énormes */
function gaPow(l10, d){ var e = Math.floor(l10), m = Math.pow(10, l10 - e); if (+m.toFixed(d) >= 10){ m /= 10; e++; } return (Math.abs(e) <= 2 ? nN(Math.pow(10, l10), Math.max(0, d - e)) : nN(m, d) + "·10" + nsup(e)); }
function gaDurL(l10){ /* demi-vie (log10 s) → texte */
  var yl = l10 - Math.log10(VY);
  if (l10 < Math.log10(1e4 * VY)) return ndur(Math.pow(10, l10));
  return gaPow(yl, 2) + " ans";
}

SFA.sim({
  id:"pq-tunnel-alpha-gamow", ch:"pq11", tag:"Effet tunnel",
  titre:"Radioactivité α : la particule qui traverse la barrière",
  resume:"Une particule α ballotte dans le noyau, enfermée par la barrière coulombienne. Elle n'en sort que par effet tunnel, et sa demi-vie dépend énormément de son énergie.",
  but:"Règle l'énergie Eα de la particule α et choisis l'élément : la largeur de barrière à traverser change, et la demi-vie calculée parcourt plus de vingt ordres de grandeur. Glisse sur le cratère pour le tourner.",
  aRetenir:"La probabilité de traverser vaut à peu près e^(−2G), où G croît avec la largeur et la hauteur de la barrière : vers 4–5 MeV, 1 MeV de plus divise la demi-vie par environ dix millions.",
  piege:"L'α ne gagne pas d'énergie pour franchir la barrière : elle la traverse avec son énergie Eα, bien plus faible que le sommet.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 340 : 400), g = k.canvas(phone ? 260 : 250);
    var elS = k.select("Élément émetteur", Object.keys(GA_EL).map(function(id){ return [id, GA_EL[id].nom + " (Z = " + GA_EL[id].Z + ")"]; }), "U", function(){ build3d(); restart(); });
    var eS = k.slider("Énergie de la particule α Eα", 3.8, 9.2, 0.01, 4.2, "MeV", function(){ restart(); });
    var rotT = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["Barrière au bord du noyau V(R)", "Épaisseur à traverser r_c − R", "Passage à chaque choc P", "Demi-vie calculée T½"]);
    var nt = k.note("", "ok");
    var T = 0, tc = 0;
    function restart(){ tc = 0; k.redraw(); }
    function el(){ return GA_EL[elS.value]; }

    var v = new N3(); v.a = -0.8; v.b = 0.62; v.f = 22; v.set();
    norbit(c, v, k, [0.1, 1.3]);
    /* géométrie du cratère pour l'élément choisi (rayon de la vue fixé par Eα = 3,8 MeV) */
    var G3 = {};
    function build3d(){
      var E = el(), m = gaModel(E.Z, E.A, 3.8);
      G3 = {R:m.R, rmax:m.rc * 1.12, VR:m.VR, kk:2 * (E.Z - 2) * NE2};
      G3.VH = 2.5 / G3.VR; G3.floor = -0.7;
    }
    build3d();
    /* rayon dans la vue : échelle en √r, qui agrandit le noyau et comprime le large */
    function RW(r){ var a = Math.abs(r), s = r < 0 ? -1 : 1, w = a < G3.R ? 4.4 * Math.sqrt(G3.R / G3.rmax) * a / G3.R : 4.4 * Math.sqrt(a / G3.rmax); return s * w; }
    function Vr(r){ return r < G3.R ? null : G3.kk / r; }
    function hY(r){ return r < G3.R ? G3.floor : Vr(r) * G3.VH; }
    var CUT0 = -0.15, CUT1 = PI / 2 + 0.15;   /* coin découpé du volcan (de φ = CUT0 à CUT1) */
    function rAt(i, n){ /* échantillonnage radial : serré près du bord */
      var u = i / n, rr = G3.R;
      return u < 0.12 ? rr * u / 0.12 * 0.999 : rr + (G3.rmax - rr) * Math.pow((u - 0.12) / 0.88, 1.7);
    }

    var lp = k.loop(function(dt){
      T += dt; tc += dt;
      if (rotT.value && !v.user){ v.a = -0.8 + 0.3 * Math.sin(T * 0.17); v.set(); }
      if (tc > 7.2) tc = 0;
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, E = el(), Ea = eS.value, m = gaModel(E.Z, E.A, Ea), i, j;
      nlab(ctx, W, H, "#1e1a2e", "#09070f");
      v.sc = Math.min(W / (phone ? 10.2 : 11.6), H / (phone ? 6.6 : 6.6)); v.cx = W * 0.5; v.cy = H * 0.56; v.clear();
      var nr = phone ? 22 : 30, nph = phone ? 24 : 32, rings = [];
      for (i = 0; i <= nr; i++){
        var r = rAt(i, nr), y = hY(r), row = [];
        for (j = 0; j <= nph; j++){ var ph = CUT1 + (TAU - (CUT1 - CUT0)) * j / nph; row.push([RW(r) * Math.cos(ph), y, RW(r) * Math.sin(ph)]); }
        rings.push({r:r, row:row});
      }
      /* volcan : cratère (noyau) orangé, pentes coulombiennes bleues */
      for (i = 0; i < nr; i++) for (j = 0; j < nph; j++){
        var A0 = rings[i].row[j], A1 = rings[i].row[j + 1], B1 = rings[i + 1].row[j + 1], B0 = rings[i + 1].row[j];
        var rm = (rings[i].r + rings[i + 1].r) / 2, col = rm < G3.R ? [214, 112, 60] : nmix([96, 132, 200], [40, 62, 110], Math.min(1, (rm - G3.R) / (G3.rmax - G3.R)));
        v.face([A0, A1, B1, B0], col, {up:true, amb:-0.38, ns:!phone ? false : true});
      }
      /* parois de la découpe : le profil V(r), comme une part de gâteau */
      [CUT0, CUT1].forEach(function(ph){
        var cs = Math.cos(ph), sn = Math.sin(ph);
        for (i = 0; i < nr; i++){
          var r0 = rings[i].r, r1 = rings[i + 1].r, y0 = hY(r0), y1 = hY(r1), yb = G3.floor - 0.35;
          v.face([[RW(r0) * cs, yb, RW(r0) * sn], [RW(r1) * cs, yb, RW(r1) * sn], [RW(r1) * cs, y1, RW(r1) * sn], [RW(r0) * cs, y0, RW(r0) * sn]], r1 <= G3.R ? "#8a3f22" : "#2b3a5e", {amb:-0.2});
        }
      });
      /* bord extérieur (socle) */
      var yb2 = G3.floor - 0.35, outer = rings[nr];
      for (j = 0; j < nph; j++){ var o0 = outer.row[j], o1 = outer.row[j + 1]; v.face([[o0[0], yb2, o0[2]], [o1[0], yb2, o1[2]], o1, o0], "#232c45", {cull:false, amb:-0.3}); }
      v.render(ctx);
      /* niveau d'énergie Eα : disque dans le cratère, anneau au-delà de r_c */
      var yE = Ea * G3.VH;
      function ringPath(rr, a0, a1, n){ var pts = []; for (var q = 0; q <= n; q++){ var ph = a0 + (a1 - a0) * q / n; pts.push(v.p(RW(rr) * Math.cos(ph), yE, RW(rr) * Math.sin(ph))); } return pts; }
      ctx.save(); ctx.fillStyle = "rgba(255,214,90,.16)"; ctx.strokeStyle = "rgba(255,214,90,.75)"; ctx.lineWidth = 1.3;
      var pin = ringPath(G3.R * 0.98, 0, TAU, 48); ctx.beginPath(); pin.forEach(function(q, n){ if (n) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fill(); ctx.stroke();
      var pout = ringPath(m.rc, 0, TAU, 64); ctx.setLineDash([5, 4]); ctx.beginPath(); pout.forEach(function(q, n){ if (n) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.stroke();
      ctx.restore();
      /* trajet tunnel le long de la découpe φ = CUT0 */
      var cs0 = Math.cos(CUT0), sn0 = Math.sin(CUT0);
      function P(rr, dy){ return v.p(RW(rr) * cs0, yE + (dy || 0), RW(rr) * sn0); }
      var t0 = P(G3.R), t1 = P(Math.min(m.rc, G3.rmax));
      var gr = ctx.createLinearGradient(t0.x, t0.y, t1.x, t1.y); gr.addColorStop(0, "rgba(255,120,210,.95)"); gr.addColorStop(1, "rgba(255,120,210,.12)");
      ctx.save(); ctx.strokeStyle = gr; ctx.lineWidth = 3; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.stroke(); ctx.restore();
      /* noyau fils au fond du cratère (quelques nucléons) */
      var tags = [];
      /* α : chocs dans le cratère, puis passage tunnel, puis départ */
      var NB = 7, tb = 0.42, tBounce = NB * tb, ar, ghost = false, phase;
      if (tc < tBounce){ var kb = Math.floor(tc / tb), u = (tc - kb * tb) / tb, side = kb % 2 ? -1 : 1; ar = side * (G3.R * 0.9) * (2 * u - 1); phase = "choc"; }
      else if (tc < tBounce + 1.0){ var u2 = (tc - tBounce) / 1.0; ar = G3.R + (m.rc - G3.R) * u2; ghost = true; phase = "tunnel"; }
      else if (tc < tBounce + 2.6){ var u3 = (tc - tBounce - 1.0) / 1.6; ar = m.rc + (G3.rmax - m.rc) * u3 * u3 * 1.0; phase = "sortie"; }
      else { ar = G3.rmax; phase = "fin"; }
      if (phase === "choc"){
        var hitU = (tc / tb) % 1, hitSide = Math.floor(tc / tb) % 2 ? 1 : -1;
        if (hitU < 0.18){ var ph2 = hitSide > 0 ? CUT0 : CUT0 + PI, qh = v.p(RW(G3.R) * Math.cos(ph2), yE, RW(G3.R) * Math.sin(ph2)); nglow(ctx, qh.x, qh.y, 26 * (1 - hitU / 0.18), "#ffe9a8", 0.9); }
      }
      var qa = v.p(RW(ar) * cs0, yE + 0.18, RW(ar) * sn0);
      if (phase !== "fin"){
        if (ghost) nglow(ctx, qa.x, qa.y, 30, "#ff8ad0", 0.55);
        ndrawCluster(ctx, v, GA_CLA, RW(ar) * cs0, yE + 0.18, RW(ar) * sn0, 0.16, 0.085, ghost ? 0.6 : 1);
      }
      var qtop = v.p(RW(G3.R) * Math.cos(CUT1 + 0.6), hY(G3.R) + 0.05, RW(G3.R) * Math.sin(CUT1 + 0.6));
      tags.push({s:"V(R) = " + nN(m.VR, 1) + " MeV", x:qtop.x, y:qtop.y - 16, o:{size:11.5, color:"#ffcfae"}});
      var qe2 = v.p(RW(G3.rmax) * Math.cos(CUT1 + 1.4), yE, RW(G3.rmax) * Math.sin(CUT1 + 1.4));
      tags.push({s:"Eα = " + nN(Ea, 2) + " MeV", x:qe2.x, y:qe2.y - 14, o:{size:11.5, color:"#ffe08a"}});
      var tm = P((G3.R + Math.min(m.rc, G3.rmax)) / 2, 0.1);
      tags.push({s:"zone interdite : " + nN(m.rc - G3.R, 1) + " fm", x:tm.x, y:tm.y + 20, o:{size:11, color:"#ffc2e8"}});
      var status = phase === "tunnel" ? "effet tunnel (accéléré : ≈ " + gaPow(-m.lnP / Math.LN10, 1) + " chocs sautés)" : phase === "choc" ? "choc " + (Math.floor(tc / tb) + 1) + " contre la paroi : rebond (P ≈ " + gaPow(m.lnP / Math.LN10, 1) + ")" : "l'α s'éloigne";
      ntag(S, c, status, 10, H - 18, {size:11.5, align:"left", color:phase === "tunnel" ? "#ffd2ee" : "#ffffff", border:phase === "tunnel" ? "#ff8ad0" : null});
      if (phase === "sortie" || phase === "fin"){ var qf = v.p(0, G3.floor + 0.3, 0); tags.push({s:"noyau fils " + nnuc(E.Z - 2, E.A - 4) + " + α", x:qf.x, y:qf.y - 26, o:{size:11.5, color:"#ffffff"}}); }
      ntags(S, c, tags, 26);
      var lgS = phone ? "cratère = noyau · pentes = barrière" : "cratère = noyau (R = " + nN(G3.R, 1) + " fm) · pentes = barrière coulombienne · rayons en √r", lgF = nfz(c, phone ? 10 : 11), hF = nfz(c, 11);
      ctx.save(); ctx.font = "600 " + lgF + "px Mulish, system-ui, sans-serif"; var lgW = ctx.measureText(lgS).width; ctx.font = "600 " + hF + "px Mulish, system-ui, sans-serif"; var hW = ctx.measureText("glisse pour tourner").width; ctx.restore();
      nT(S, c, "glisse pour tourner", W - 10, 10 + lgW + 24 + hW > W - 10 ? 32 : 14, {size:hF, color:"rgba(210,222,240,.7)", align:"right", weight:600});
      nT(S, c, lgS, 10, 14, {size:lgF, color:"rgba(255,207,174,.85)", align:"left", weight:600});

      /* ---- Geiger-Nuttall : demi-vie en fonction de Eα ---- */
      g.clear();
      var L0 = -8, L1 = 26, axg = S.draw.axes(g, {x0:3.8, x1:9.2, y0:0, y1:L1 - L0, xl:"Eα (MeV)", yl:"demi-vie T½ (échelle log)", l:phone ? 50 : 54, b:32, t:24, r:12, stepX:1, stepY:4}), gx = g.ctx;
      var YL = axg.Y; axg.Y = function(l){ return YL(l - L0); };
      gx.save(); gx.fillStyle = "#ffffff"; gx.fillRect(0, axg.T - 8, axg.L - 3, axg.B - axg.T + 16); gx.restore();
      for (var Ly = L0; Ly <= L1; Ly += 4) nT(S, g, "10" + nsup(Ly) + " s", axg.L - 5, axg.Y(Ly), {size:phone ? 9 : 10, color:"#7b8694", align:"right", weight:600});
      [[0, "1 s"], [Math.log10(VY), "1 an"], [Math.log10(13.8e9 * VY), "âge de l'Univers"]].forEach(function(rf){
        S.draw.line(g, axg.L, axg.Y(rf[0]), axg.R, axg.Y(rf[0]), "rgba(95,107,122,.45)", 1, [3, 4]);
        nT(S, g, rf[1], axg.R - 4, axg.Y(rf[0]) - 8, {size:nfz(g, 10.5), color:"#5f6b7a", align:"right", halo:"#ffffff"});
      });
      Object.keys(GA_EL).forEach(function(id){
        var El = GA_EL[id], on = id === elS.value;
        var st = false, q, ee, lt, X, Y;
        gx.save(); gx.beginPath(); gx.rect(axg.L, axg.T - 2, axg.R - axg.L, axg.B - axg.T + 4); gx.clip(); gx.beginPath();
        for (q = 0; q <= 120; q++){ ee = 3.8 + 5.4 * q / 120; lt = gaModel(El.Z, El.A, ee).log10T; X = axg.X(ee); Y = axg.Y(Math.max(L0 - 3, Math.min(L1 + 3, lt))); if (st) gx.lineTo(X, Y); else { gx.moveTo(X, Y); st = true; } }
        gx.strokeStyle = on ? El.col : S.draw.tint(El.col, 0.3); gx.lineWidth = on ? 2.4 : 1.2; gx.stroke(); gx.restore();
      });
      GA_DATA.forEach(function(d){
        var El = GA_EL[d[0]], Eap = d[2] * (d[1] - 4) / d[1], lt = Math.log10(d[3]), on = d[0] === elS.value;
        S.draw.dot(g, axg.X(Eap), axg.Y(lt), on ? 4.8 : 3.2, on ? El.col : S.draw.tint(El.col, 0.45));
        if (on) nT(S, g, nnuc(El.Z, d[1]), axg.X(Eap) + 6, axg.Y(lt) - 8, {size:nfz(g, 10.5), color:El.col, align:"left", halo:"#ffffff"});
      });
      var cy = Math.max(L0, Math.min(L1, m.log10T));
      S.draw.line(g, axg.X(Ea), axg.T, axg.X(Ea), axg.B, "rgba(19,35,58,.35)", 1, [2, 3]);
      S.draw.dot(g, axg.X(Ea), axg.Y(cy), 7, "#13233a");
      nT(S, g, "• mesures   — modèle de Gamow", axg.L + 8, axg.B - 12, {size:nfz(g, 11), color:"#2c3a4e", align:"left", halo:"#ffffff"});
      nT(S, g, "Loi de Geiger-Nuttall : " + E.nom.toLowerCase(), axg.L, 11, {size:nfz(g, 11.5), color:"#2c3a4e", align:"left"});

      /* ---- afficheurs ---- */
      ro.set(0, nN(m.VR, 1) + " MeV");
      ro.set(1, nN(m.rc - m.R, 1) + " fm");
      ro.set(2, gaPow(m.lnP / Math.LN10, 2));
      ro.set(3, gaDurL(m.log10T));
      nt.set("Dans le noyau, l'α (énergie Q = " + nN(m.Q, 2) + " MeV, recul compris) frappe la paroi environ " + gaPow(Math.log10(m.f), 1) + " fois par seconde. À chaque choc, elle passe avec la probabilité P : il lui faut en moyenne 1/P ≈ " + gaPow(-m.lnP / Math.LN10, 1) + " chocs pour sortir.", "ok");
    });
  }
});
})();
