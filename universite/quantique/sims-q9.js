/* Physique quantique · lot Q9 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-laser-emission-stimulee · pq-fermions-bosons-remplissage · pq-condensat-bose-einstein (pq16)
   Fichier autonome (aides préfixées n9). Aucune ressource externe : la 3D est une projection faite main. */
(function(){
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018) ---------- */
var HP = 6.62607015e-34, HB = HP / TAU, ME = 9.1093837015e-31, QE = 1.602176634e-19, CL = 2.99792458e8;
var UMA = 1.66053906660e-27, KB = 1.380649e-23, MUB = 9.2740100783e-24, A0PM = 52.917721, RYEV = 13.605693;
var HC_EVNM = HP * CL / QE * 1e9; /* 1239,84 eV·nm */
var N9TAGS = []; /* étiquettes déjà posées dans la vue en cours (anti-chevauchement) */

/* ---------- petites aides (préfixe q) ---------- */
function n9rgb(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function n9shade(col, f){
  var c = typeof col === "string" ? n9rgb(col) : col;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function n9a(col, a){ var c = typeof col === "string" ? n9rgb(col) : col; return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
function n9fz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function n9N(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d == null ? 2 : d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
var SUPD = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
/* notation scientifique : d chiffres après la virgule de la mantisse */
function n9sci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return n9N(x, Math.max(0, d - e));
  return n9N(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : String(e).split("").map(function(ch){ return SUPD[ch]; }).join(""));
}
function n9T(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function n9rr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function n9ball(ctx, x, y, r, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, n9shade(col, 0.75)); g.addColorStop(0.45, n9shade(col, 0)); g.addColorStop(1, n9shade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, TAU); ctx.fill(); ctx.restore();
}
function n9glow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, n9a(col, a == null ? 0.8 : a)); g.addColorStop(1, n9a(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
/* couleur perçue d'une longueur d'onde (nm) ; en dehors du visible : violet pâle (UV) ou rouge sombre (IR) */
function n9wl(nm){
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
function n9step(span, n){ var s = span / n, p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }

/* ---------- moteur 3D minimal : vue orbitale, faces planes éclairées, triées par profondeur ---------- */
function N93(){ this.a = -0.5; this.b = 0.35; this.sc = 40; this.cx = 0; this.cy = 0; this.f = 14; this.L = []; this.set(); }
N93.prototype.set = function(){ this.ca = Math.cos(this.a); this.sa = Math.sin(this.a); this.cb = Math.cos(this.b); this.sb = Math.sin(this.b); };
/* monde (x, y vers le haut, z) → vue (x à droite, y en haut, z vers toi) */
N93.prototype.rot = function(x, y, z){
  var x1 = x * this.ca + z * this.sa, z1 = -x * this.sa + z * this.ca;
  return [x1, y * this.cb - z1 * this.sb, y * this.sb + z1 * this.cb];
};
N93.prototype.pv = function(v){ var s = this.f ? this.f / (this.f - v[2]) : 1; return {x:this.cx + v[0] * this.sc * s, y:this.cy - v[1] * this.sc * s, z:v[2], s:s}; };
N93.prototype.p = function(x, y, z){ return this.pv(this.rot(x, y, z)); };
N93.prototype.clear = function(){ this.L = []; };
/* face : points monde, couleur ; o.c = centre de l'objet (oriente la normale vers l'extérieur), o.cull, o.alpha, o.glow (sans ombrage) */
N93.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
N93.prototype.sprite = function(x, y, z, fn){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + 1e-3, fn:fn, v:v}); };
N93.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], q = {c:c, cull:true, alpha:o.alpha, line:o.line, tag:o.tag};
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    var cc = o.cols ? o.cols[i] || col : col, qq = q;
    if (o.after && o.afterFace === i){ qq = {c:c, cull:true, alpha:o.alpha, line:o.line, after:o.after}; }
    this.face(f.map(function(j){ return P[j]; }), cc, qq);
  }, this);
};
/* cylindre de l'axe p0 → p1, rayon r, n côtés */
N93.prototype.cyl = function(p0, p1, r, n, col, o){
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
N93.prototype.render = function(ctx){
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
    var fill = d.o.glow ? d.col : n9shade(d.col, -0.5 + 0.72 * dif);
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
function n9orbit(c, v, k, lim, onDrag){
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
function n9lab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* étiquette claire sur fond sombre, bornée au cadre */
function n9tag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = n9fz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  bx = Math.max(3, Math.min(c.W - w - 3, bx)); var by = Math.max(3, Math.min(c.H - h - 3, y - h / 2));
  var by0 = by, hitR = function(){ return N9TAGS.filter(function(r){ return r.c === c && bx < r.x + r.w && r.x < bx + w && by < r.y + r.h && r.y < by + h; }); };
  for (var t = 0; t < 4 && hitR().length; t++) by = Math.max(3, Math.min(c.H - h - 3, by + (t % 2 ? -(t + 1) : (t + 1)) * (h + 2)));
  /* toujours caché (étiquettes serrées en colonne) : on revient à la hauteur voulue et on se pousse sur le côté */
  if (hitR().length){ by = by0; for (var t2 = 0, hr; t2 < 3 && (hr = hitR()).length; t2++){
    var xr = Math.max.apply(null, hr.map(function(r){ return r.x + r.w + 2; })), xl = Math.min.apply(null, hr.map(function(r){ return r.x - w - 2; }));
    bx = xr + w <= c.W - 3 && (al !== "right" || xl < 3) ? xr : Math.max(3, xl); } }
  N9TAGS.push({c:c, x:bx, y:by, w:w, h:h});
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.72)"; n9rr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  n9T(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}

/* ---------- sprites en cache (billes et halos) : beaucoup plus rapides que des dégradés recalculés ---------- */
var N9SPR = {};
function n9spr(col, kind){
  var key = String(col) + kind; if (N9SPR[key]) return N9SPR[key];
  var cv = document.createElement("canvas"); cv.width = cv.height = 64; var g = cv.getContext("2d");
  if (kind === "b") n9ball(g, 32, 32, 30, col); else n9glow(g, 32, 32, 32, col, 1);
  N9SPR[key] = cv; return cv;
}
function n9fball(ctx, x, y, r, col, alpha){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var a0 = ctx.globalAlpha; if (alpha != null) ctx.globalAlpha = a0 * alpha;
  var R = r * 32 / 30; ctx.drawImage(n9spr(col, "b"), x - R, y - R, 2 * R, 2 * R); ctx.globalAlpha = a0;
}
function n9fglow(ctx, x, y, r, col, alpha){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var a0 = ctx.globalAlpha; ctx.globalAlpha = a0 * Math.max(0, Math.min(1, alpha == null ? 0.8 : alpha));
  ctx.drawImage(n9spr(col, "g"), x - r, y - r, 2 * r, 2 * r); ctx.globalAlpha = a0;
}
/* bille entourée d'un halo, en une seule image */
function n9gball(ctx, x, y, r, col, alpha){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var key = String(col) + "gb", cv = N9SPR[key];
  if (!cv){ cv = document.createElement("canvas"); cv.width = cv.height = 96; var g = cv.getContext("2d"); n9glow(g, 48, 48, 48, col, 0.38); n9ball(g, 48, 48, 16, col); N9SPR[key] = cv; }
  var a0 = ctx.globalAlpha; if (alpha != null) ctx.globalAlpha = a0 * alpha;
  ctx.drawImage(cv, x - 3 * r, y - 3 * r, 6 * r, 6 * r); ctx.globalAlpha = a0;
}
/* =====================================================================
   1. Laser à rubis : émission stimulée et seuil (pq16)
   ===================================================================== */
/* Modèle à trois niveaux (rubis, Cr³⁺ dans Al₂O₃), temps en unités de τ₂₁ :
   dn₂/dt = P n₁ − n₂ − ψ (n₂ − n₁)          (n₁ + n₂ = 1, niveau 3 vidé tout de suite)
   dψ/dt  = ψ (Δ − x) / (x τc) + s n₂        (ψ = taux d'émission induite par atome, en 1/τ₂₁)
   P = W_p τ₂₁ (pompage), x = inversion qui compense juste les pertes de la cavité. */
var LZ = {tau:3e-3, lam:694.3, TC:0.004, SEED:1e-3, TS:1.4};
function lzStep(st, P, x, h){
  var n2 = st.n2, n1 = 1 - n2, D = n2 - n1;
  st.n2 = Math.max(0, Math.min(1, n2 + (P * n1 - n2 - st.psi * D) * h));
  st.psi = st.psi * Math.exp((D - x) / (x * LZ.TC) * h) + LZ.SEED * n2 * h;
  if (!(st.psi < 1e4)) st.psi = 1e4;
}
function lzPth(x){ return (1 + x) / (1 - x); }

SFA.sim({
  id:"pq-laser-emission-stimulee", ch:"pq16", tag:"Émission stimulée",
  titre:"Dans un laser : l'avalanche de photons identiques",
  resume:"Un barreau de rubis entre deux miroirs, pompé par une lampe flash : au-dessus du seuil, l'émission induite clone les photons et le faisceau sort.",
  but:"Règle la puissance de pompage et regarde les atomes du rubis : verts quand la lampe les monte, rouges quand ils attendent sur le niveau métastable. Sous le seuil, la lumière part dans tous les sens ; au-dessus, l'avalanche de photons identiques sort par le miroir de droite. Glisse sur la scène pour tourner autour du laser.",
  aRetenir:"Un photon qui passe près d'un atome excité en fait naître un second identique (même direction, même phase) : avec l'inversion de population et les miroirs, c'est l'avalanche du laser.",
  piege:"Inverser la population ne suffit pas : il faut que le gain dépasse les pertes de la cavité, sinon pas de faisceau.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 400), f = k.canvas(phone ? 420 : 250);
    var wS = k.slider("Pompage par la lampe W<sub>p</sub>", 0, 1000, 10, 600, "s⁻¹", function(){ });
    var xS = k.seg("Pertes de la cavité", [["0.05", "Faibles"], ["0.1", "Moyennes"], ["0.2", "Fortes"]], "0.1");
    var mS = k.seg("Lampe", [["cont", "Continue"], ["puls", "Impulsions"]], "cont", function(){ tLamp = 0; });
    k.button("Rallumer (atomes au repos)", function(){ reset(); });
    var ro = k.readouts(["Atomes excités N₂/N", "Inversion (N₂ − N₁)/N", "Seuil de pompage", "Induites / spontanées (régime continu)"]);
    var nt = k.note("", "ok");
    var XS = phone ? 4.0 : 5.0, st = {n2:0, psi:0}, tLamp = 0, tSim = 0, trace = [], NA = phone ? 110 : 150, atoms = [], sp = [], pk = [], beam = [], flashV = 0;
    function reset(){
      st.n2 = 0; st.psi = 0; trace = []; sp = []; pk = []; beam = []; tSim = 0; tLamp = 0;
      atoms.forEach(function(a){ a.s = 1; a.fl = 0; });
    }
    for (var i = 0; i < NA; i++){
      var rr = 0.34 * Math.sqrt(Math.random()), th = Math.random() * TAU;
      atoms.push({x:-2.5 + 5 * Math.random(), y:rr * Math.cos(th), z:rr * Math.sin(th), s:1, fl:0});
    }
    function pumpNow(){
      var P = wS.value * LZ.tau;
      if (mS.value === "cont") return P;
      var ph = tLamp % 4;   /* une impulsion de 1,5 τ toutes les 4 τ */
      return ph < 1.5 ? P * Math.pow(Math.sin(PI * ph / 1.5), 2) : 0;
    }
    var v = new N93(); v.a = -0.42; v.b = 0.34; v.f = 22; v.set();
    n9orbit(c, v, k, [-0.25, 1.15]);
    var lp = k.loop(function(dt, t){
      var x = +xS.value, dtau = dt / LZ.TS, nsub = Math.max(1, Math.ceil(dtau / 2e-4)), h = dtau / nsub, j;
      for (j = 0; j < nsub; j++){ tLamp += h; lzStep(st, pumpNow(), x, h); }
      tSim += dtau;
      var P = pumpNow(); flashV = Math.min(1, P / 3);
      trace.push([tSim, 2 * st.n2 - 1, st.psi]);
      while (trace.length && trace[0][0] < tSim - 8) trace.shift();
      /* atomes dessinés : tirages avec les mêmes taux que le modèle */
      for (j = 0; j < atoms.length; j++){
        var a = atoms[j], u = Math.random();
        a.fl = Math.max(0, a.fl - dt * 2.5);
        if (a.s === 1){
          if (u < P * dtau){ a.s = 3; a.fl = 1; }
          else if (u < (P + st.psi) * dtau){ a.s = 2; }                 /* absorption d'un photon laser */
        } else if (a.s === 3){
          if (u < 25 * dtau) a.s = 2;                                     /* chute rapide, sans lumière */
        } else {
          if (u < dtau){                                                  /* émission spontanée : direction au hasard */
            a.s = 1; var cz = 2 * Math.random() - 1, ph = Math.random() * TAU, sq = Math.sqrt(1 - cz * cz);
            if (sp.length < 60) sp.push({x:a.x, y:a.y, z:a.z, dx:sq * Math.cos(ph), dy:cz, dz:sq * Math.sin(ph), t:0});
          } else if (u < (1 + st.psi) * dtau){                            /* émission induite : photon cloné le long de l'axe */
            a.s = 1; a.fl = 1;
            if (pk.length < 46) pk.push({x:a.x, y:a.y, z:a.z, d:Math.random() < 0.5 ? 1 : -1, ph:Math.random() * TAU});
          }
        }
      }
      for (j = sp.length - 1; j >= 0; j--){ var q = sp[j]; q.t += dt; q.x += q.dx * dt * 3; q.y += q.dy * dt * 3; q.z += q.dz * dt * 3; if (q.t > 0.95) sp.splice(j, 1); }
      var keep = Math.min(46, Math.round(46 * st.psi / (st.psi + 1.2)));
      for (j = pk.length - 1; j >= 0; j--){
        var p = pk[j]; p.x += p.d * dt * 5.5;
        if (p.x > 2.95){ p.x = 2.95; p.d = -1; if (Math.random() < 0.3 || pk.length > keep + 2){ beam.push({x:3.05, y:p.y, z:p.z}); pk.splice(j, 1); continue; } }
        if (p.x < -2.95){ p.x = -2.95; p.d = 1; if (pk.length > keep + 2){ pk.splice(j, 1); continue; } }
      }
      for (j = beam.length - 1; j >= 0; j--){ beam[j].x += dt * 5.5; if (beam[j].x > XS) beam.splice(j, 1); }
      if (!v.user){ v.a = -0.42 + 0.12 * Math.sin(t * 0.22); v.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      N9TAGS.length = 0;
      var ctx = c.ctx, W = c.W, H = c.H, x = +xS.value, P = wS.value * LZ.tau, Pth = lzPth(x), Iout = st.psi / (st.psi + 1.5), i;
      n9lab(ctx, W, H, "#1c2338", "#07090f");
      v.sc = phone ? Math.min(W / 7.5, H / 4.0) : Math.min(W / 9.6, H / 4.4); v.cx = W * (phone ? 0.42 : 0.43); v.cy = H * (phone ? 0.47 : 0.5); v.clear();
      /* banc optique et supports */
      v.box(-3.6, -1.42, -1.0, XS + 0.45, -1.25, 1.0, "#4a3a2c", {cols:[null, null, null, "#6b5440"]});
      v.box(-3.4, -1.25, -0.22, XS + 0.25, -1.12, 0.22, "#5b6575");
      [-3.0, 3.0].forEach(function(xx){ v.box(xx - 0.14, -1.12, -0.18, xx + 0.14, -0.62, 0.18, "#3f4756"); });
      [-1.8, 1.8].forEach(function(xx){ v.box(xx - 0.12, -1.12, -0.12, xx + 0.12, -0.42, 0.12, "#3f4756"); });
      /* miroirs : 100 % à gauche, partiellement réfléchissant à droite */
      v.cyl([-3.08, 0, 0], [-2.98, 0, 0], 0.62, 22, "#c7d0db", {cap1:"#e9eef5"});
      v.cyl([2.98, 0, 0], [3.08, 0, 0], 0.62, 22, "#8fb6d8", {alpha:0.55, cap0:"#bcd6ee"});
      /* écran de sortie */
      v.box(XS, -1.12, -0.7, XS + 0.13, 0.75, 0.7, "#e7e2d6", {afterFace:4, after:function(ctx2){
        if (Iout < 0.01) return; var q = v.p(XS, 0, 0);
        n9fglow(ctx2, q.x, q.y, (14 + 22 * Iout) * q.s, "#ff3020", 0.4 + 0.5 * Iout); n9fglow(ctx2, q.x, q.y, 5 * q.s, "#ffe0d0", 0.9 * Iout);
      }});
      /* barreau de rubis */
      v.cyl([-2.6, 0, 0], [2.6, 0, 0], 0.42, 20, "#c3203d", {alpha:0.42, cap0:"#e2506a", cap1:"#e2506a"});
      /* fluorescence (atomes excités) et champ dans la cavité */
      v.sprite(0, 0, 0.01, function(ctx2){
        var A = v.p(-2.6, 0, 0), B = v.p(2.6, 0, 0);
        ctx2.save(); ctx2.lineCap = "round"; ctx2.globalCompositeOperation = "lighter";
        ctx2.strokeStyle = "rgba(255,60,50," + (0.08 + 0.22 * st.n2) + ")"; ctx2.lineWidth = 0.75 * v.sc * A.s;
        ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.stroke();
        if (Iout > 0.01){
          var M0 = v.p(-2.98, 0, 0), M1 = v.p(2.98, 0, 0);
          ctx2.strokeStyle = "rgba(255,70,50," + 0.55 * Iout + ")"; ctx2.lineWidth = 0.22 * v.sc * A.s;
          ctx2.beginPath(); ctx2.moveTo(M0.x, M0.y); ctx2.lineTo(M1.x, M1.y); ctx2.stroke();
        }
        ctx2.restore();
      });
      /* atomes */
      atoms.forEach(function(a){
        v.sprite(a.x, a.y, a.z, function(ctx2, q){
          var r = 0.055 * v.sc * q.s;
          if (a.s === 1){ n9fball(ctx2, q.x, q.y, r * 0.85, "#8a5260", 0.9); if (a.fl > 0) n9fglow(ctx2, q.x, q.y, r * 4, "#ff5040", 0.5 * a.fl); }
          else if (a.s === 3){ n9fglow(ctx2, q.x, q.y, r * 4, "#5cf0a0", 0.7); n9fball(ctx2, q.x, q.y, r, "#6dffb0"); }
          else { n9fglow(ctx2, q.x, q.y, r * 3.4, "#ff3b30", 0.55); n9fball(ctx2, q.x, q.y, r, "#ff6a4a"); }
        });
      });
      /* photons spontanés (dans tous les sens) et photons induits (le long de l'axe) */
      function photon(ctx2, q, dx, dy, col){
        ctx2.save(); ctx2.strokeStyle = n9a(col, 0.55); ctx2.lineWidth = 1.6; ctx2.beginPath(); ctx2.moveTo(q.x, q.y); ctx2.lineTo(q.x - dx, q.y - dy); ctx2.stroke(); ctx2.restore();
        n9fglow(ctx2, q.x, q.y, 6 * q.s, col, 0.85); n9fball(ctx2, q.x, q.y, 1.8 * q.s, "#ffd0c0");
      }
      sp.forEach(function(q0){
        v.sprite(q0.x, q0.y, q0.z, function(ctx2, q){ var b = v.p(q0.x - q0.dx * 0.3, q0.y - q0.dy * 0.3, q0.z - q0.dz * 0.3); photon(ctx2, q, q.x - b.x, q.y - b.y, "#ff6050"); });
      });
      pk.concat(beam.map(function(b){ return {x:b.x, y:b.y, z:b.z, d:1}; })).forEach(function(p){
        v.sprite(p.x, p.y, p.z, function(ctx2, q){ var b = v.p(p.x - p.d * 0.35, p.y, p.z); photon(ctx2, q, q.x - b.x, q.y - b.y, "#ff2a1a"); });
      });
      /* faisceau de sortie */
      if (Iout > 0.01) v.sprite((3.08 + XS) / 2, 0, 0, function(ctx2){
        var A = v.p(3.08, 0, 0), B = v.p(XS, 0, 0);
        ctx2.save(); ctx2.lineCap = "round"; ctx2.globalCompositeOperation = "lighter";
        ctx2.strokeStyle = "rgba(255,40,30," + 0.35 * Iout + ")"; ctx2.lineWidth = 0.34 * v.sc * A.s; ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.stroke();
        ctx2.strokeStyle = "rgba(255,200,180," + 0.85 * Iout + ")"; ctx2.lineWidth = 0.07 * v.sc * A.s; ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.stroke();
        ctx2.restore();
      });
      /* lampe flash hélicoïdale autour du barreau */
      var NT = 7, NSG = NT * 22, RH = 0.8, X0 = -2.35, X1 = 2.35;
      function hp(s){ var a = s * NT * TAU; return [X0 + (X1 - X0) * s, RH * Math.cos(a), RH * Math.sin(a)]; }
      for (i = 0; i < NSG; i++){
        (function(s0, s1){
          var m = hp((s0 + s1) / 2);
          v.sprite(m[0], m[1], m[2], function(ctx2, q){
            var p0 = hp(s0), p1 = hp(s1), A = v.p(p0[0], p0[1], p0[2]), B = v.p(p1[0], p1[1], p1[2]), lw = 0.13 * v.sc * q.s;
            ctx2.save(); ctx2.lineCap = "round";
            if (flashV > 0.02){ ctx2.strokeStyle = "rgba(200,230,255," + 0.35 * flashV + ")"; ctx2.lineWidth = lw * 2.6; ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.stroke(); }
            ctx2.strokeStyle = flashV > 0.02 ? "rgba(" + Math.round(190 + 65 * flashV) + "," + Math.round(205 + 50 * flashV) + ",255,0.95)" : "rgba(190,205,225,0.75)";
            ctx2.lineWidth = lw; ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.stroke();
            ctx2.restore();
          });
        })(i / NSG, (i + 1) / NSG);
      }
      v.render(ctx);
      /* étiquettes */
      var Lm = v.p(-3.03, 0.85, 0), Rm = v.p(3.03, -0.95, 0), Rb = v.p(0.4, 1.15, 0), La = v.p(-1.6, -1.0, 0), Ec = v.p(XS, 1.05, 0);
      var fs = phone ? 10 : 11.5;
      n9tag(S, c, phone ? "miroir 100 %" : "miroir total", Lm.x, Lm.y, {size:fs});
      n9tag(S, c, phone ? "miroir de sortie" : "miroir de sortie (laisse passer un peu)", Rm.x, Rm.y + 6, {size:fs});
      n9tag(S, c, "lampe flash", La.x, La.y + 4, {size:fs, color:flashV > 0.02 ? "#d8ecff" : "#aab8cc"});
      n9tag(S, c, "barreau de rubis", Rb.x, Rb.y - 6, {size:fs, color:"#ffb3bf"});
      if (!phone) n9tag(S, c, Iout > 0.01 ? "faisceau 694,3 nm" : "écran", Ec.x, Ec.y, {size:fs, color:Iout > 0.01 ? "#ff8a7a" : "#eef3fb"});
      n9T(S, c, "glisse pour tourner", W - 10, 14, {size:n9fz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      /* légende des atomes */
      var lx = 10, ly = H - 16, items = [["#8a5260", "au repos (E₁)"], ["#6dffb0", "pompé (E₃)"], ["#ff6a4a", "excité (E₂)"]];
      ctx.save(); ctx.font = "700 " + n9fz(c, 11) + "px Mulish, system-ui, sans-serif";
      var tw = 0; items.forEach(function(it){ tw += ctx.measureText(it[1]).width + 26; }); ctx.restore();
      ctx.fillStyle = "rgba(8,14,28,.72)"; n9rr(ctx, lx - 4, ly - 11, tw + 4, 22, 6); ctx.fill();
      items.forEach(function(it){
        n9fball(ctx, lx + 7, ly, 5, it[0]);
        ctx.save(); ctx.font = "700 " + n9fz(c, 11) + "px Mulish, system-ui, sans-serif"; var w0 = ctx.measureText(it[1]).width; ctx.restore();
        n9T(S, c, it[1], lx + 16, ly + 0.5, {size:n9fz(c, 11), color:"#eef3fb", align:"left", weight:700}); lx += w0 + 26;
      });

      /* ---- niveaux d'énergie + courbes en fonction du temps ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f6f8fb"; g.fillRect(0, 0, FW, FH);
      var dx0 = 10, dx1 = phone ? FW - 10 : FW * 0.36, dy0 = 8, dy1 = phone ? FH * 0.46 : FH - 8;
      var tx0 = phone ? 54 : FW * 0.36 + 56, tx1 = FW - (phone ? 40 : 48), ty0 = phone ? FH * 0.46 + 30 : 30, ty1 = FH - 26;
      /* diagramme : E₁, E₂ (métastable), bandes E₃ */
      g.save(); g.fillStyle = "#ffffff"; g.strokeStyle = "#dfe4ec"; n9rr(g, dx0, dy0, dx1 - dx0, dy1 - dy0, 10); g.fill(); g.stroke(); g.restore();
      var lvX0 = dx0 + 60, lvX1 = dx1 - 14, yE1 = dy1 - 26, yE2 = dy0 + (dy1 - dy0) * 0.47, yE3a = dy0 + 34, yE3b = dy0 + (dy1 - dy0) * 0.3;
      n9T(S, f, "Niveaux du Cr³⁺", dx0 + 10, dy0 + 13, {size:n9fz(f, 12), color:"#13233a", align:"left"});
      var bg = g.createLinearGradient(0, yE3a, 0, yE3b); bg.addColorStop(0, "rgba(140,90,230,.35)"); bg.addColorStop(1, "rgba(60,200,120,.35)");
      g.fillStyle = bg; g.fillRect(lvX0, yE3a, lvX1 - lvX0, yE3b - yE3a);
      g.strokeStyle = "#13233a"; g.lineWidth = 2;
      [yE1, yE2].forEach(function(yy){ g.beginPath(); g.moveTo(lvX0, yy); g.lineTo(lvX1, yy); g.stroke(); });
      n9T(S, f, "E₃", dx0 + 12, (yE3a + yE3b) / 2, {size:n9fz(f, 12), color:"#4d3a8a", align:"left"});
      n9T(S, f, "E₂", dx0 + 12, yE2, {size:n9fz(f, 12), color:"#c0392b", align:"left"});
      n9T(S, f, "E₁", dx0 + 12, yE1, {size:n9fz(f, 12), color:"#13233a", align:"left"});
      n9T(S, f, "1,79 eV", dx0 + 34, (yE1 + yE2) / 2, {size:n9fz(f, 10.5), color:"#5f6b7a", align:"left", weight:600});
      /* flèches : pompage, chute rapide, laser */
      function arr(x0, y0, x1, y1, col, wavy){
        g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2.2; g.beginPath();
        if (wavy){ var L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / 7)); for (var q = 0; q <= n; q++){ var s = q / n, px = x0 + (x1 - x0) * s + 3.5 * Math.sin(s * n * PI), py = y0 + (y1 - y0) * s; if (q) g.lineTo(px, py); else g.moveTo(px, py); } }
        else { g.moveTo(x0, y0); g.lineTo(x1, y1); }
        g.stroke(); var an = Math.atan2(y1 - y0, x1 - x0); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - 8 * Math.cos(an - 0.45), y1 - 8 * Math.sin(an - 0.45)); g.lineTo(x1 - 8 * Math.cos(an + 0.45), y1 - 8 * Math.sin(an + 0.45)); g.closePath(); g.fill(); g.restore();
      }
      var ax1 = lvX0 + (lvX1 - lvX0) * 0.16, ax2 = lvX0 + (lvX1 - lvX0) * 0.42, ax3 = lvX0 + (lvX1 - lvX0) * 0.72;
      arr(ax1, yE1 - 2, ax1, yE3a + 6, flashV > 0.02 ? "#2e9e5a" : "#9fb3a5");
      arr(ax2, yE3b + 2, ax2 + 4, yE2 - 3, "#7a8597");
      arr(ax3, yE2 + 2, ax3, yE1 - 3, "#e0302a", true);
      n9T(S, f, "pompage", ax1 + 6, yE3a + 10, {size:n9fz(f, 10), color:"#2e7d4f", align:"left", weight:700});
      n9T(S, f, "métastable, 3 ms", ax1 + 8, yE2 + 11, {size:n9fz(f, 10.5), color:"#c0392b", weight:700, align:"left"});
      n9T(S, f, "694 nm", ax3 + 8, (yE1 + yE2) / 2 + 2, {size:n9fz(f, 10), color:"#c0392b", align:"left", weight:700});
      /* populations : billes sur les niveaux */
      function pop(yy, frac, col){
        var n = Math.round(frac * 12), sx = lvX0 + 6, w0 = (lvX1 - lvX0 - 12) / 12;
        for (var q = 0; q < n; q++) n9fball(g, sx + (q + 0.5) * w0, yy - 6, Math.min(4.6, w0 * 0.42), col);
      }
      pop(yE1, 1 - st.n2, "#8a5260"); pop(yE2, st.n2, "#ff5a3a");
      /* courbes : inversion et intensité du faisceau */
      g.save(); g.fillStyle = "#ffffff"; g.strokeStyle = "#dfe4ec"; n9rr(g, tx0 - (phone ? 38 : 44), ty0 - 24, tx1 - tx0 + (phone ? 76 : 88), ty1 - ty0 + 44, 10); g.fill(); g.stroke(); g.restore();
      n9T(S, f, "Au cours du temps (8 τ affichés, τ = 3 ms)", tx0 - (phone ? 30 : 36), ty0 - 12, {size:n9fz(f, 12), color:"#13233a", align:"left"});
      var Yd = function(d){ return ty1 - (d + 1) / 2 * (ty1 - ty0); };
      g.strokeStyle = "#e6eaf0"; g.lineWidth = 1;
      [-1, -0.5, 0, 0.5, 1].forEach(function(d){ g.beginPath(); g.moveTo(tx0, Yd(d)); g.lineTo(tx1, Yd(d)); g.stroke(); n9T(S, f, (d > 0 ? "+" : "") + n9N(d * 100, 0) + " %", tx0 - 4, Yd(d), {size:n9fz(f, 10), color:"#2f6fd6", align:"right", weight:600}); });
      g.save(); g.setLineDash([5, 4]); g.strokeStyle = "#e08a2a"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(tx0, Yd(x)); g.lineTo(tx1, Yd(x)); g.stroke(); g.restore();
      n9T(S, f, "seuil", tx0 + 6, Yd(x) - 9, {size:n9fz(f, 10), color:"#c06a10", align:"left"});
      var psMax = 2; trace.forEach(function(p){ psMax = Math.max(psMax, p[2]); });
      psMax = Math.ceil(psMax / 2) * 2;
      var Xt = function(tt){ return tx1 - (tSim - tt) / 8 * (tx1 - tx0); }, Yp = function(p){ return ty1 - Math.min(1, p / psMax) * (ty1 - ty0); };
      if (trace.length > 1){
        g.save(); g.beginPath(); trace.forEach(function(p, j){ var X = Xt(p[0]), Y = Yp(p[2]); if (j) g.lineTo(X, Y); else g.moveTo(X, Y); });
        g.lineTo(Xt(trace[trace.length - 1][0]), ty1); g.lineTo(Xt(trace[0][0]), ty1); g.closePath(); g.fillStyle = "rgba(224,48,42,.16)"; g.fill();
        g.beginPath(); trace.forEach(function(p, j){ var X = Xt(p[0]), Y = Yp(p[2]); if (j) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.strokeStyle = "#e0302a"; g.lineWidth = 2; g.stroke();
        g.beginPath(); trace.forEach(function(p, j){ var X = Xt(p[0]), Y = Yd(p[1]); if (j) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.strokeStyle = "#2f6fd6"; g.lineWidth = 2.2; g.stroke();
        g.restore();
      }
      g.strokeStyle = "#a3adba"; g.beginPath(); g.moveTo(tx0, ty0); g.lineTo(tx0, ty1); g.lineTo(tx1, ty1); g.lineTo(tx1, ty0); g.stroke();
      n9T(S, f, "inversion", tx0 + 6, ty1 + 13, {size:n9fz(f, 10.5), color:"#2f6fd6", align:"left"});
      n9T(S, f, "faisceau (u. arb.)", tx1, ty1 + 13, {size:n9fz(f, 10.5), color:"#e0302a", align:"right"});

      /* ---- afficheurs ---- */
      var D = 2 * st.n2 - 1, Wth = Pth / LZ.tau;
      ro.set(0, n9N(st.n2 * 100, 0) + " %");
      ro.set(1, (D > 0.005 ? "+" : "") + n9N(D * 100, 0) + " %");
      ro.set(2, n9N(Wth, 0) + " s⁻¹");
      ro.set(3, P > Pth ? n9N(P / Pth - 1, 2) : "0 (sous le seuil)");
      var msg;
      if (mS.value === "puls") msg = "Impulsions : à chaque éclair, l'inversion monte, franchit le seuil, puis s'effondre d'un coup quand l'avalanche vide le niveau E₂ : le laser sort en pics.";
      else if (P <= 1) msg = "Pas d'inversion : avec W<sub>p</sub>τ = " + n9N(P, 2) + " < 1, il reste plus d'atomes sur E₁ que sur E₂. Les photons spontanés partent dans tous les sens.";
      else if (P <= Pth) msg = "Inversion obtenue, mais trop faible : un photon cloné se perd plus vite qu'il ne se multiplie. Il faut " + n9N(Wth, 0) + " s⁻¹ pour franchir le seuil.";
      else msg = "Au-dessus du seuil : l'inversion reste bloquée à " + n9N(x * 100, 0) + " % (le gain compense juste les pertes) et tout le pompage en plus part dans le faisceau.";
      nt.set(msg + " Ralenti : 1 s à l'écran = " + n9N(LZ.tau / LZ.TS * 1e3, 1) + " ms.", P > Pth || mS.value === "puls" ? "ok" : "warn");
    });
  }
});
/* =====================================================================
   2. Remplir des niveaux : fermions, bosons, particules classiques (pq16)
   ===================================================================== */
var FB = {NL:6, G:4, CAP:13, KB_MEV:8.617333262e-2, Y0:-1.72, SP:0.66, rb:1.3};
var FB_COL = {fd:"#3d8bff", be:"#ff9a1f", mb:"#3fb57a"};
var FB_NOM = {fd:"Fermi-Dirac", be:"Bose-Einstein", mb:"Maxwell-Boltzmann"};
/* occupation moyenne d'un état d'énergie e (meV) */
function fbF(st, e, mu, kT){
  var x = (e - mu) / kT;
  if (st === "fd") return 1 / (Math.exp(Math.min(60, x)) + 1);
  if (st === "be") return x > 1e-9 ? 1 / (Math.exp(Math.min(60, x)) - 1) : Infinity;
  return Math.exp(Math.min(60, -x));
}
/* processus de naissance et de mort d'une case : son équilibre est la loi exacte de la statistique choisie */
function fbUp(st, n, x){
  if (n >= FB.CAP) return 0;
  var b = Math.exp(Math.max(-50, Math.min(50, -x)));
  return st === "fd" ? (n >= 1 ? 0 : b) : st === "be" ? b * (n + 1) : b;
}
/* tirage d'une occupation selon la loi d'équilibre (tronquée à CAP) */
function fbDraw(st, x){
  var w = [1], s = 1, n;
  for (n = 0; n < FB.CAP; n++){ var r = fbUp(st, n, x) / (n + 1); w.push(w[n] * r); s += w[n + 1]; if (!(s < 1e300)) break; }
  var u = Math.random() * s;
  for (n = 0; n < w.length; n++){ u -= w[n]; if (u <= 0) return n; }
  return w.length - 1;
}

SFA.sim({
  id:"pq-fermions-bosons-remplissage", ch:"pq16", tag:"Statistiques quantiques",
  titre:"Remplir des niveaux : fermions, bosons et particules classiques",
  resume:"Des billes tombent sur une étagère de niveaux d'énergie : une par case pour les fermions, en tas dans le fondamental pour les bosons.",
  but:"Choisis le type de particules, puis règle la température T et le potentiel chimique μ. Les billes vont et viennent entre le réservoir et les cases ; en moyenne, leur nombre par case suit la courbe f(ε) du graphe. Glisse sur l'étagère pour la tourner.",
  aRetenir:"Fermions : au plus 1 par état, remplissage jusqu'à μ ; bosons : ils s'entassent dans l'état le plus bas ; loin au-dessus de μ, les trois lois se confondent avec Maxwell-Boltzmann.",
  piege:"f(ε) est le nombre moyen de particules par état, pas une probabilité : pour des bosons il peut dépasser 1.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 380 : 450), f = k.canvas(phone ? 300 : 270);
    var stat = "fd", muMem = null;
    var sS = k.seg("Particules", [["fd", "Fermions"], ["be", "Bosons"], ["mb", "Classiques"]], "fd", function(vv){
      stat = vv;
      if (vv === "be" && muS.value > -0.1){ muMem = muS.value; muS.set(-0.5); }
      else if (vv !== "be" && muMem != null){ muS.set(muMem); muMem = null; }
      init();
    });
    var tS = k.slider("Température T", 2, 40, 1, 6, "K", function(){ resetAvg(); });
    var muS = k.slider("Potentiel chimique μ", -4, 4, 0.1, 2.5, "meV", function(vv){ if (stat === "be" && vv > -0.1) muS.set(-0.1); muMem = null; resetAvg(); });
    var ro = k.readouts(["k<sub>B</sub>T", "Occupation du niveau 0 (par état)", "Particules en moyenne ⟨N⟩", "Billes sur l'étagère"]);
    var nt = k.note("", "ok");
    /* cases : occ[j][s] ; billes en vol ; moyenne glissante par niveau */
    var occ = [], fly = [], avg = [], avgT = 0, i, j;
    function kT(){ return FB.KB_MEV * tS.value; }
    function xOf(jj){ return (jj - muS.value) / kT(); }
    function init(){
      occ = []; for (j = 0; j < FB.NL; j++){ occ.push([]); for (var s = 0; s < FB.G; s++) occ[j].push(fbDraw(stat, xOf(j))); }
      fly = []; resetAvg();
    }
    function lvlMean(jj){ var m = 0; for (var s = 0; s < FB.G; s++) m += occ[jj][s]; return m / FB.G; }
    function resetAvg(){ avg = []; for (var jj = 0; jj < FB.NL; jj++) avg.push(occ.length ? lvlMean(jj) : 0); avgT = 0; }
    init();
    /* billes dans une case : 1re couche 3 × 3, 2e couche 2 × 2 */
    var BR = 0.155, SLOT = [[0, 0, 0], [-0.32, 0, 0], [0.32, 0, 0], [0, 0, -0.3], [0, 0, 0.3], [-0.32, 0, -0.3], [0.32, 0, 0.3], [-0.32, 0, 0.3], [0.32, 0, -0.3],
      [-0.16, 0.25, -0.15], [0.16, 0.25, 0.15], [-0.16, 0.25, 0.15], [0.16, 0.25, -0.15]];
    function slotX(s){ return -1.65 + 1.1 * s; }
    function yOf(e){ return FB.Y0 + FB.SP * e; }
    var HOP = yOf(5) + 0.75;
    var v = new N93(); v.a = -0.32; v.b = 0.22; v.f = 20; v.set();
    n9orbit(c, v, k, [-0.1, 0.8, -1.1, 0.9]);
    var lp = k.loop(function(dt, t){
      var j2, s;
      for (j2 = 0; j2 < FB.NL; j2++){
        var x = xOf(j2);
        for (s = 0; s < FB.G; s++){
          /* la paire n ↔ n + 1 reçoit un même facteur d'échelle : l'équilibre ne change pas, le tas se forme plus vite */
          var n = occ[j2][s], up = fbUp(stat, n, x), A = FB.rb * Math.min(n + 1, 6) / Math.max(up, n + 1, 1e-300);
          var dn = n > 0 ? FB.rb * Math.min(n, 6) / Math.max(fbUp(stat, n - 1, x), n, 1e-300) * n : 0;
          var u = Math.random();
          if (u < A * up * dt){ occ[j2][s]++; fly.push({j:j2, s:s, k:occ[j2][s] - 1, t:0, inb:true}); }
          else if (u < A * up * dt + dn * dt){ occ[j2][s]--; fly.push({j:j2, s:s, k:occ[j2][s], t:0, inb:false}); }
        }
        avg[j2] += (lvlMean(j2) - avg[j2]) * Math.min(1, dt / Math.min(14, 1 + avgT));
      }
      avgT += dt;
      for (i = fly.length - 1; i >= 0; i--){ fly[i].t += dt / 0.7; if (fly[i].t >= 1) fly.splice(i, 1); }
      if (fly.length > 60) fly.splice(0, fly.length - 60);
      if (!v.user){ v.a = -0.32 + 0.14 * Math.sin(t * 0.2); v.set(); }
      k.redraw();
    });
    lp.play();
    function ballPos(jj, s, kk){ var o = SLOT[Math.min(kk, FB.CAP - 1)]; return [slotX(s) + o[0], yOf(jj) + BR + o[1], o[2]]; }
    k.draw(function(){
      N9TAGS.length = 0;
      var ctx = c.ctx, W = c.W, H = c.H, mu = muS.value, kt = kT(), col = FB_COL[stat];
      n9lab(ctx, W, H, "#25304a", "#0b0f1a");
      v.sc = phone ? Math.min(W / 7.2, H / 6.3) : Math.min(W / 8.4, H / 6.3); v.cx = W * (phone ? 0.47 : 0.48); v.cy = H * 0.5 + 0.55 * v.sc; v.clear();
      /* sol, meuble, étagères */
      v.box(-3.2, yOf(0) - 0.5, -1.3, 3.2, yOf(0) - 0.38, 1.4, "#3b3f4a");
      v.box(-2.5, yOf(0) - 0.38, -0.72, -2.32, yOf(5) + 0.5, 0.62, "#8a5a36");
      v.box(2.32, yOf(0) - 0.38, -0.72, 2.5, yOf(5) + 0.5, 0.62, "#8a5a36");
      v.box(-2.5, yOf(0) - 0.38, -0.78, 2.5, yOf(5) + 0.5, -0.66, "#5c3b22");
      for (j = 0; j < FB.NL; j++){
        var y = yOf(j);
        v.box(-2.32, y - 0.05, -0.66, 2.32, y, 0.6, "#c9d6e3", {alpha:0.85});
        for (var d = 1; d < FB.G; d++) v.box(-1.65 + 1.1 * d - 0.55 - 0.02, y, -0.5, -1.65 + 1.1 * d - 0.55 + 0.02, y + 0.16, 0.5, "#9fb2c6", {alpha:0.8});
      }
      /* réservoir (thermostat à T, potentiel μ) : trémie au-dessus du meuble */
      v.cyl([0, HOP, 0], [0, HOP + 0.62, 0], 0.22, 18, "#9cc3e6", {alpha:0.35, open:true, r1:0.85});
      v.box(-0.5, yOf(5) + 0.5, -0.12, 0.5, HOP, 0.12, "#6d4a2c");
      for (i = 0; i < 22; i++){
        (function(ii){ var a = ii * 2.4, rr = 0.12 + 0.5 * ((ii * 7) % 10) / 10, hy = HOP + 0.2 + 0.24 * Math.floor(ii / 8) + 0.25 * rr;
          v.sprite(rr * Math.cos(a), hy, rr * Math.sin(a), function(ctx2, q){ n9fball(ctx2, q.x, q.y, BR * v.sc * q.s, col, 0.9); }); })(i);
      }
      /* plan du potentiel chimique */
      var ym = yOf(mu);
      if (mu > -0.6 && mu < 5.6){
        v.face([[-2.32, ym, -0.66], [2.32, ym, -0.66], [2.32, ym, 0.6], [-2.32, ym, 0.6]], "#ffd34d", {alpha:0.2, glow:true});
      }
      /* billes posées */
      for (j = 0; j < FB.NL; j++) for (var s = 0; s < FB.G; s++){
        var n = occ[j][s], shown = Math.min(n, FB.CAP);
        for (var kk = 0; kk < shown; kk++){
          var inFly = fly.some(function(p){ return p.inb && p.j === j && p.s === s && p.k === kk; });
          if (inFly) continue;
          (function(P){ v.sprite(P[0], P[1], P[2], function(ctx2, q){ n9fball(ctx2, q.x, q.y, BR * v.sc * q.s, col); }); })(ballPos(j, s, kk));
        }
      }
      /* billes en vol entre le réservoir et les cases */
      fly.forEach(function(p){
        var B = ballPos(p.j, p.s, p.k), A = [0, HOP + 0.4, 0.3], C = [B[0], HOP + 0.3, 1.5], s0 = p.inb ? p.t : 1 - p.t, w0 = (1 - s0) * (1 - s0), w1 = 2 * s0 * (1 - s0), w2 = s0 * s0;
        var x = w0 * A[0] + w1 * C[0] + w2 * B[0], y = w0 * A[1] + w1 * C[1] + w2 * B[1], z = w0 * A[2] + w1 * C[2] + w2 * B[2];
        v.sprite(x, y, z, function(ctx2, q){ n9fglow(ctx2, q.x, q.y, 0.3 * v.sc * q.s, col, 0.4); n9fball(ctx2, q.x, q.y, BR * v.sc * q.s, col); });
      });
      v.render(ctx);
      /* étiquettes : énergie des niveaux (à gauche), occupation prévue (à droite) */
      var fs = phone ? 9.5 : 11;
      for (j = 0; j < FB.NL; j++){
        var pl = v.p(-2.5, yOf(j) + 0.1, 0.62), fv = fbF(stat, j, mu, kt);
        n9tag(S, c, (phone ? "" : "ε = ") + j + " meV", pl.x - 4, pl.y, {size:fs, align:"right", weight:700});
        var full = fv > 3.5;
        var pr = v.p(2.5, yOf(j) + 0.1, 0.62);
        n9tag(S, c, (phone ? "" : "f = ") + (isFinite(fv) ? (fv >= 100 ? n9sci(fv, 1) : fv < 0.001 ? "< 0,001" : fv < 0.01 ? n9N(fv, 3) : n9N(fv, 2)) : "∞") + (full ? (phone ? " (tas coupé)" : " (tas coupé à " + FB.CAP + ")") : ""), pr.x + 4, pr.y, {size:fs, align:"left", color:n9shade(col, 0.45), weight:800});
      }
      if (mu > -0.6 && mu < 5.6){ var pm = v.p(-2.32, ym, -0.66); n9tag(S, c, stat === "fd" ? "μ (niveau de Fermi)" : "μ", pm.x + 4, pm.y - 12, {size:fs, align:"left", color:"#ffd34d"}); }
      else if (mu <= -0.6){ var pb = v.p(0, yOf(0) - 0.45, 0.62); n9tag(S, c, "μ = " + n9N(mu, 1) + " meV : sous le niveau 0", pb.x, pb.y + 12, {size:fs, color:"#ffd34d"}); }
      var pj = v.p(0.9, HOP + 0.5, 0);
      n9tag(S, c, phone ? "réservoir (T, μ)" : "réservoir à T et μ", pj.x + 6, pj.y, {size:fs, align:"left"});
      n9T(S, c, "glisse pour tourner", W - 10, 14, {size:n9fz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      n9tag(S, c, FB_NOM[stat] + " · " + FB.G + " cases par niveau", 8, 18, {size:fs + 0.5, align:"left", color:n9shade(col, 0.5)});

      /* ---- graphe f(ε) ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f6f8fb"; g.fillRect(0, 0, FW, FH);
      var L = 40, R = phone ? 12 : 150, T = 28, Bm = phone ? 46 : 34, E0 = -4.5, E1 = 6, YM = 2.5;
      var X = function(e){ return L + (e - E0) / (E1 - E0) * (FW - L - R); }, Y = function(y){ return FH - Bm - y / YM * (FH - T - Bm); };
      n9T(S, f, phone ? "Occupation d'un état f(ε), ε en meV" : "Occupation moyenne d'un état f(ε)", L, 13, {size:n9fz(f, 12.5), color:"#13233a", align:"left"});
      g.strokeStyle = "#e6eaf0"; g.lineWidth = 1;
      for (var yy = 0; yy <= YM + 1e-9; yy += 0.5){ g.beginPath(); g.moveTo(L, Y(yy)); g.lineTo(FW - R, Y(yy)); g.stroke(); n9T(S, f, n9N(yy, 1), L - 5, Y(yy), {size:n9fz(f, 10), color:"#5f6b7a", align:"right", weight:600}); }
      for (var ee = -4; ee <= 6; ee += 2){ n9T(S, f, n9N(ee, 0), X(ee), FH - Bm + 11, {size:n9fz(f, 10), color:"#5f6b7a", weight:600}); }
      if (!phone) n9T(S, f, "ε (meV)", FW - R, FH - 8, {size:n9fz(f, 10.5), color:"#5f6b7a", align:"right"});
      /* niveaux de l'étagère */
      for (j = 0; j < FB.NL; j++){ g.strokeStyle = "rgba(120,135,155,.35)"; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(X(j), T); g.lineTo(X(j), FH - Bm); g.stroke(); g.setLineDash([]); }
      g.strokeStyle = "#a3adba"; g.beginPath(); g.moveTo(L, T - 4); g.lineTo(L, FH - Bm); g.lineTo(FW - R, FH - Bm); g.stroke();
      /* μ */
      g.save(); g.strokeStyle = "#d9a200"; g.lineWidth = 1.6; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(X(mu), T - 4); g.lineTo(X(mu), FH - Bm); g.stroke(); g.restore();
      n9T(S, f, "μ", X(mu) + (mu > 4 ? -8 : 8), T + 2, {size:n9fz(f, 12), color:"#b08300"});
      /* trois courbes */
      g.save(); g.beginPath(); g.rect(L, T - 4, FW - L - R, FH - Bm - T + 4); g.clip();
      ["mb", "be", "fd"].forEach(function(sx){
        var on = sx === stat; g.beginPath(); var started = false;
        for (var px = 0; px <= FW - L - R; px += 1.5){
          var e = E0 + px / (FW - L - R) * (E1 - E0), fv = fbF(sx, e, mu, kt);
          if (!isFinite(fv) || fv > YM * 3){ started = false; continue; }
          if (started) g.lineTo(L + px, Y(fv)); else { g.moveTo(L + px, Y(fv)); started = true; }
        }
        g.strokeStyle = FB_COL[sx]; g.globalAlpha = on ? 1 : 0.55; g.lineWidth = on ? 3.2 : 1.8; g.setLineDash(on ? [] : [6, 4]); g.stroke();
      });
      g.restore();
      /* moyennes mesurées sur l'étagère */
      for (j = 0; j < FB.NL; j++){
        var fe = fbF(stat, j, mu, kt); if (!(fe < 2.5) || avg[j] > YM) continue;
        n9fball(g, X(j), Y(avg[j]), 5.5, col); g.strokeStyle = "#13233a"; g.lineWidth = 1; g.beginPath(); g.arc(X(j), Y(avg[j]), 5.5, 0, TAU); g.stroke();
      }
      /* légende */
      var lg = [["fd", "Fermi-Dirac"], ["be", "Bose-Einstein"], ["mb", "Maxwell-Boltzmann"]];
      if (phone){
        var lx = 8, ly = FH - 12, fsz = n9fz(f, 10);
        lg.forEach(function(it){
          g.fillStyle = FB_COL[it[0]]; g.fillRect(lx, ly - 1.5, 12, 3.5);
          n9T(S, f, it[1], lx + 15, ly, {size:fsz, color:it[0] === "be" ? "#c06a00" : n9shade(FB_COL[it[0]], -0.25), align:"left", weight:it[0] === stat ? 800 : 600});
          g.save(); g.font = "800 " + fsz + "px Mulish, system-ui, sans-serif"; lx += g.measureText(it[1]).width + 24; g.restore();
        });
      } else {
        lg.forEach(function(it, q){
          var yq = T + 14 + q * 24, xq = FW - R + 14;
          g.strokeStyle = FB_COL[it[0]]; g.lineWidth = it[0] === stat ? 3.2 : 1.8; g.setLineDash(it[0] === stat ? [] : [6, 4]); g.beginPath(); g.moveTo(xq, yq); g.lineTo(xq + 20, yq); g.stroke(); g.setLineDash([]);
          n9T(S, f, it[1], xq + 26, yq, {size:n9fz(f, 11), color:it[0] === "be" ? "#c06a00" : n9shade(FB_COL[it[0]], -0.25), align:"left", weight:it[0] === stat ? 800 : 600});
        });
        var yq2 = T + 14 + 3 * 24; n9fball(g, FW - R + 24, yq2, 5.5, col);
        n9T(S, f, "billes (moyenne)", FW - R + 40, yq2, {size:n9fz(f, 11), color:"#13233a", align:"left", weight:600});
        n9T(S, f, "pointillés : niveaux", FW - R + 14, yq2 + 22, {size:n9fz(f, 10), color:"#7b8694", align:"left", weight:600});
      }

      /* ---- afficheurs ---- */
      var f0 = fbF(stat, 0, mu, kt), NN = 0; for (j = 0; j < FB.NL; j++) NN += FB.G * fbF(stat, j, mu, kt);
      var nb = 0; for (j = 0; j < FB.NL; j++) for (var s2 = 0; s2 < FB.G; s2++) nb += occ[j][s2];
      ro.set(0, n9N(kt, 2) + " meV");
      ro.set(1, f0 >= 1000 ? n9sci(f0, 2, true) : n9N(f0, 2));
      ro.set(2, NN >= 1000 ? n9sci(NN, 2, true) : n9N(NN, 1));
      ro.set(3, String(nb));
      var msg = stat === "fd" ? "Fermions : au plus une bille par case (principe de Pauli). Les cases sous μ sont presque toutes pleines, celles au-dessus presque vides ; la marche s'adoucit sur quelques k<sub>B</sub>T." :
        stat === "be" ? "Bosons : chaque bille déjà présente favorise l'arrivée de la suivante (facteur 1 + n), sans aucune force. μ doit rester sous le niveau le plus bas ; quand il s'en approche, le niveau 0 se remplit en masse." :
        "Particules classiques : f = exp[−(ε − μ)/k<sub>B</sub>T], sans limite par case et sans attraction entre billes.";
      var far = (5 - mu) / kt;
      msg += far > 3 ? " Au niveau 5, ε − μ = " + n9N(far, 1) + " k<sub>B</sub>T : les trois lois y donnent presque la même valeur." : " Monte la température ou baisse μ : là où ε − μ ≫ k<sub>B</sub>T, les trois lois se confondent.";
      nt.set(msg, "ok");
    });
  }
});
/* =====================================================================
   3. Condensat de Bose-Einstein : refroidir un nuage de rubidium 87 (pq16)
   ===================================================================== */
/* Piège harmonique isotrope de pulsation ω, gaz sans interactions :
   Tc = (ħω/k_B) (N/ζ(3))^(1/3) ; sous Tc : N₀/N = 1 − (T/Tc)³.
   Évaporation (modèle) : N = N_i (T/T_i)^(1/2), N_i = 4·10⁶ atomes à T_i = 2 µK
   (chaque fois que T est divisée par 4, la moitié des atomes est partie). */
var BEC = {m:86.909180527 * UMA, Ni:4e6, Ti:2000, Z3:1.2020569031595942, eta:6, NA:320};
var HBAR_ = HP / TAU;
function becA(fHz){ return HBAR_ * TAU * fHz / KB * 1e9; }                 /* ħω/k_B en nK */
function becN(T){ return BEC.Ni * Math.sqrt(T / BEC.Ti); }
function becTc(N, fHz){ return becA(fHz) * Math.pow(N / BEC.Z3, 1 / 3); }
/* température où la trajectoire d'évaporation croise Tc : T^(5/6) = a (N_i/ζ(3))^(1/3) T_i^(−1/6) */
function becTcStar(fHz){ return Math.pow(becA(fHz) * Math.pow(BEC.Ni / BEC.Z3, 1 / 3) * Math.pow(BEC.Ti, -1 / 6), 1.2); }
function becFrac(T, fHz){ var tc = becTc(becN(T), fHz); return T < tc ? 1 - Math.pow(T / tc, 3) : 0; }
function becSig(T){ return Math.sqrt(KB * T * 1e-9 / BEC.m); }               /* m/s */
function becSig0(fHz){ return Math.sqrt(HBAR_ * TAU * fHz / (2 * BEC.m)); }   /* m/s, état fondamental */
/* fonction d'erreur (Abramowitz-Stegun 7.1.26) */
function becErf(x){ var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x);
  var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
function becCell(a, b, s){ return 0.5 * (becErf(b / (s * Math.SQRT2)) - becErf(a / (s * Math.SQRT2))); }
function becRand(){ var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
/* palette « image d'absorption » : bleu nuit → cyan → jaune → rouge → blanc */
function becCol(t){
  var S = [[0, [20, 30, 90]], [0.25, [30, 120, 220]], [0.5, [60, 220, 200]], [0.7, [250, 225, 60]], [0.86, [240, 80, 40]], [1, [255, 245, 235]]];
  t = Math.max(0, Math.min(1, t));
  for (var i = 1; i < S.length; i++) if (t <= S[i][0]){ var a = S[i - 1], b = S[i], u = (t - a[0]) / (b[0] - a[0]); return [a[1][0] + (b[1][0] - a[1][0]) * u, a[1][1] + (b[1][1] - a[1][1]) * u, a[1][2] + (b[1][2] - a[1][2]) * u]; }
  return S[S.length - 1][1];
}

SFA.sim({
  id:"pq-condensat-bose-einstein", ch:"pq16", tag:"Condensat de Bose-Einstein",
  titre:"Refroidir des atomes jusqu'au condensat de Bose-Einstein",
  resume:"Un nuage de rubidium 87 piégé se refroidit par évaporation ; sous la température critique, un pic étroit jaillit au centre de la distribution des vitesses.",
  but:"Regarde le nuage d'atomes se refroidir : le couteau RF chasse les plus rapides. En dessous, l'image des vitesses en relief, comme dans les expériences : sous Tc, un pic jaillit au centre. Tu peux aussi régler toi-même la température, et glisser sur chaque vue pour la tourner.",
  aRetenir:"Sous la température critique, une fraction N₀/N = 1 − (T/Tc)³ des bosons occupe le même état, le plus bas : c'est le pic étroit des vitesses.",
  piege:"Le condensat n'est pas un solide ni un liquide : c'est un gaz très dilué dont une partie des atomes partage un seul état quantique.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 380), f = k.canvas(phone ? 470 : 300);
    var auto = true, tA = 0;
    k.button("Évaporer (cycle automatique)", function(){ auto = true; tA = 0; }, true);
    var TS = k.slider("Température du nuage T", 10, 4000, 10, 1500, "nK", function(){ auto = false; });
    var fS = k.seg("Fréquence du piège ω/2π", [["50", "50 Hz"], ["100", "100 Hz"], ["200", "200 Hz"]], "100", function(){ tA = 0; hist = []; setupAtoms(); });
    var ro = k.readouts(["Atomes restants N", "Température critique T<sub>c</sub>", "Fraction condensée N₀/N", "Agitation thermique √(k<sub>B</sub>T/m)"]);
    var nt = k.note("", "ok");
    var hist = [], atoms = [], esc = [], tPh = 0;
    function fq(){ return +fS.value; }
    function cycT(){ var ts = becTcStar(fq()); return {a:2.6 * ts, b:0.12 * ts}; }
    function setupAtoms(){
      atoms = [];
      for (var i = 0; i < BEC.NA; i++){
        var a = [becRand(), becRand(), becRand()], b = [becRand(), becRand(), becRand()];
        atoms.push({a:a, b:b, e:a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + b[0] * b[0] + b[1] * b[1] + b[2] * b[2], ph:Math.random() * TAU});
      }
      atoms.sort(function(p, q){ return p.e - q.e; });   /* les moins énergétiques d'abord : ce sont eux qui restent */
      if (auto) TS.set(cycT().a);
    }
    setupAtoms();
    var nShow = BEC.NA;
    /* ---- vues 3D : le montage (c) et l'image des vitesses en relief (f) ---- */
    var v = new N93(); v.a = -0.55; v.b = 0.3; v.f = 18; v.set();
    n9orbit(c, v, k, [-0.3, 1.2]);
    var w = new N93(); w.a = -0.7; w.b = 0.62; w.f = 0; w.set();
    n9orbit(f, w, k, [0.25, 1.35]);
    var lp = k.loop(function(dt, t){
      var fz = fq();
      if (auto){
        var cy = cycT(), tau = 4.2, tDown = tau * Math.log(cy.a / cy.b);
        tA += dt;
        if (tA < tDown) TS.set(cy.a * Math.exp(-tA / tau));
        else if (tA < tDown + 3.5) TS.set(cy.b);
        else { tA = 0; TS.set(cy.a); hist = []; }
      }
      var T = TS.value, fr = becFrac(T, fz), tc = becTc(becN(T), fz);
      hist.push([T / tc, fr]); if (hist.length > 400) hist.shift();
      /* nombre d'atomes dessinés ∝ N ; ceux qui partent s'échappent au-delà du couteau RF */
      var target = Math.max(40, Math.round(BEC.NA * Math.min(1, becN(T) / becN(cycT().a))));
      while (nShow > target){ nShow--; var a = atoms[nShow]; esc.push({a:a, t:0, d:[a.a[0], a.a[1], a.a[2]]}); }
      if (target > nShow) nShow = target;
      for (var i = esc.length - 1; i >= 0; i--){ esc[i].t += dt; if (esc[i].t > 1.2) esc.splice(i, 1); }
      if (esc.length > 50) esc.splice(0, esc.length - 50);
      tPh += dt * 1.6;
      if (!v.user){ v.a = -0.55 + 0.25 * Math.sin(t * 0.18); v.set(); }
      if (!w.user){ w.a = -0.7 + 0.35 * Math.sin(t * 0.15); w.set(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      N9TAGS.length = 0;
      var ctx = c.ctx, W = c.W, H = c.H, fz = fq(), T = TS.value, N = becN(T), tc = becTc(N, fz), fr = becFrac(T, fz);
      var ts = becTcStar(fz), sx = 0.36 * Math.sqrt(T / ts), s0 = 0.36 * Math.sqrt(becA(fz) / (2 * ts));   /* tailles dessinées (σ en unités de scène) */
      n9lab(ctx, W, H, "#1a2236", "#06080f");
      v.sc = phone ? Math.min(W / 6.6, H / 4.5) : Math.min(W / 9.2, H / 4.6); v.cx = W * 0.5; v.cy = H * 0.5; v.clear();
      /* table optique */
      v.box(-4.6, -2.05, -1.9, 4.6, -1.9, 1.9, "#2c3340", {cols:[null, null, null, "#3a4352"]});
      /* tube vers la pompe à vide */
      v.cyl([-4.3, 0, 0], [-1.25, 0, 0], 0.32, 16, "#8b95a5");
      v.cyl([-4.4, 0, 0], [-4.1, 0, 0], 0.55, 18, "#6d7686");
      v.box(-4.0, -1.9, -0.25, -3.6, -0.32, 0.25, "#4b5362");
      /* bobines du piège magnétique (au-dessus et en dessous de la cellule) */
      [1.25, -1.25].forEach(function(yy){
        var n = 36, R = 1.15;
        for (var q = 0; q < n; q++){
          (function(a0, a1){
            v.sprite(R * Math.cos((a0 + a1) / 2), yy, R * Math.sin((a0 + a1) / 2), function(ctx2, qq){
              var A = v.p(R * Math.cos(a0), yy, R * Math.sin(a0)), B = v.p(R * Math.cos(a1), yy, R * Math.sin(a1)), lw = 0.34 * v.sc * qq.s;
              ctx2.save(); ctx2.lineCap = "round";
              ctx2.strokeStyle = "#7a4519"; ctx2.lineWidth = lw; ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.stroke();
              ctx2.strokeStyle = "#c98142"; ctx2.lineWidth = lw * 0.62; ctx2.beginPath(); ctx2.moveTo(A.x, A.y - lw * 0.12); ctx2.lineTo(B.x, B.y - lw * 0.12); ctx2.stroke();
              ctx2.strokeStyle = "rgba(255,214,160,.55)"; ctx2.lineWidth = lw * 0.18; ctx2.beginPath(); ctx2.moveTo(A.x, A.y - lw * 0.26); ctx2.lineTo(B.x, B.y - lw * 0.26); ctx2.stroke();
              ctx2.restore();
            });
          })(q / n * TAU, (q + 1) / n * TAU);
        }
      });
      v.box(-0.18, -1.9, -1.45, 0.18, -1.42, -1.1, "#4b5362");
      /* cellule en verre (faces transparentes) */
      var gx = 1.25, gy = 0.95, gz = 0.95;
      v.box(-gx, -gy, -gz, gx, gy, gz, "#a9d4f5", {alpha:0.13, line:"rgba(190,225,255,.55)"});
      /* antenne RF */
      v.sprite(1.6, 0, 0, function(ctx2, qq){
        ctx2.save(); ctx2.strokeStyle = "#d9c27a"; ctx2.lineWidth = Math.max(2, 0.07 * v.sc * qq.s); ctx2.beginPath();
        for (var q2 = 0; q2 <= 32; q2++){ var b0 = q2 / 32 * TAU, P = v.p(1.6, 0.45 * Math.cos(b0), 0.45 * Math.sin(b0)); if (q2) ctx2.lineTo(P.x, P.y); else ctx2.moveTo(P.x, P.y); }
        ctx2.stroke(); ctx2.restore();
      });
      /* caméra */
      v.box(2.6, -0.42, -0.4, 3.7, 0.42, 0.4, "#2a2f3a");
      v.cyl([2.25, 0, 0], [2.6, 0, 0], 0.3, 16, "#1b1f27", {cap0:"#3d5a80"});
      v.box(2.95, -1.9, -0.18, 3.35, -0.42, 0.18, "#4b5362");
      /* couteau RF : coquille où ½mω²r² = η k_B T */
      var rc = Math.sqrt(2 * BEC.eta) * sx;
      v.sprite(0, 0, 0, function(ctx2, q){
        var R = Math.min(rc, 0.92) * v.sc * q.s;
        ctx2.save(); ctx2.setLineDash([5, 5]); ctx2.strokeStyle = "rgba(240,210,110,.55)"; ctx2.lineWidth = 1.4;
        ctx2.beginPath(); ctx2.arc(q.x, q.y, R, 0, TAU); ctx2.stroke(); ctx2.restore();
        /* condensat : cœur lumineux */
        if (fr > 0){ n9fglow(ctx2, q.x, q.y, Math.max(7, 4 * s0 * v.sc) + 10 * fr, "#fff3c4", 0.5 + 0.45 * fr); n9fglow(ctx2, q.x, q.y, 5 + 4 * fr, "#ffffff", 0.9); }
      });
      /* atomes : chacun oscille dans le piège (ralenti) */
      var nC = Math.round(nShow * fr), cs = Math.cos(tPh), sn = Math.sin(tPh);
      for (var i = 0; i < nShow; i++){
        (function(a, cond){
          var ss = cond ? s0 : sx, ph = a.ph;
          var cp = Math.cos(tPh + ph), sp2 = Math.sin(tPh + ph);
          var x = ss * (a.a[0] * cp + a.b[0] * sp2), y = ss * (a.a[1] * cp + a.b[1] * sp2), z = ss * (a.a[2] * cp + a.b[2] * sp2);
          if (!cond && Math.hypot(x, y, z) > 0.95) { var sc2 = 0.95 / Math.hypot(x, y, z); x *= sc2; y *= sc2; z *= sc2; }
          v.sprite(x, y, z, function(ctx2, q){
            var r = (cond ? 0.035 : 0.045) * v.sc * q.s;
            if (cond) n9fball(ctx2, q.x, q.y, r, "#ffe9a0");
            else n9gball(ctx2, q.x, q.y, r, "#9cc8ff");
          });
        })(atoms[i], i < nC);
      }
      esc.forEach(function(e){
        var d = e.d, L = Math.hypot(d[0], d[1], d[2]) || 1, r0 = Math.min(rc, 0.9), rr = r0 + e.t * 2.2;
        v.sprite(d[0] / L * rr, d[1] / L * rr, d[2] / L * rr, function(ctx2, q){ n9fglow(ctx2, q.x, q.y, 9 * q.s, "#ff9a5a", 0.6 * (1 - e.t / 1.2)); n9fball(ctx2, q.x, q.y, 2.2 * q.s, "#ffc29a", 1 - e.t / 1.2); });
      });
      v.render(ctx);
      var fs = phone ? 10 : 11.5;
      var pC = v.p(0, 1.5, 0), pR = v.p(1.6, -0.6, 0), pK = v.p(3.15, 0.6, 0), pV = v.p(-3.6, 0.6, 0), pB = v.p(-1.15, 1.25, 1.15);
      n9tag(S, c, phone ? "nuage de ⁸⁷Rb" : "nuage d'atomes de rubidium 87", pC.x, pC.y - 6, {size:fs});
      n9tag(S, c, phone ? "couteau RF" : "antenne RF (couteau)", pR.x, pR.y + 10, {size:fs, color:"#f0d27a"});
      n9tag(S, c, "caméra", pK.x, pK.y - 4, {size:fs});
      if (!phone) n9tag(S, c, "vers la pompe à vide", pV.x, pV.y - 6, {size:fs, color:"#b9c3d2"});
      if (!phone) n9tag(S, c, "bobine du piège", pB.x, pB.y + 16, {size:fs, color:"#f0b27a"});
      n9T(S, c, "glisse pour tourner", W - 10, 14, {size:n9fz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      var stT = T < tc ? "sous Tc : condensat !" : "au-dessus de Tc";
      n9tag(S, c, "T = " + n9N(T, 0) + " nK · " + stT, 8, H - 16, {size:fs + 0.5, align:"left", color:T < tc ? "#ffe08a" : "#bcd6ff"});
      if (auto) n9tag(S, c, tA > 0 && TS.value <= cycT().b + 1e-6 ? "fin de l'évaporation" : "évaporation en cours", W - 8, H - 16, {size:fs, align:"right", color:"#ffb08a"});

      /* ---- image des vitesses en relief ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      var bgG = g.createLinearGradient(0, 0, 0, FH); bgG.addColorStop(0, "#111a2e"); bgG.addColorStop(1, "#05080f"); g.fillStyle = bgG; g.fillRect(0, 0, FW, FH);
      var rx0 = 0, rx1 = phone ? FW : FW * 0.6, ry0 = 0, ry1 = phone ? FH * 0.6 : FH;
      var M = phone ? 44 : 56, Lv = 4 * becSig(ts), sT = becSig(T), sC = becSig0(fz), Nth = N * (1 - fr), N0 = N * fr;
      var hx = Lv / (M - 1), Px = [], P0 = [], ii, jj;
      for (ii = 0; ii < M; ii++){ var vv = -Lv + ii * 2 * hx; Px.push(becCell(vv - hx, vv + hx, sT)); P0.push(becCell(vv - hx, vv + hx, sC)); }
      var Dmax = 0, D = [];
      for (ii = 0; ii < M; ii++){ D.push([]); for (jj = 0; jj < M; jj++){ var dd = Nth * Px[ii] * Px[jj] + N0 * P0[ii] * P0[jj]; D[ii].push(dd); if (dd > Dmax) Dmax = dd; } }
      /* échelle : la hauteur du nuage thermique à Tc sert de repère (moitié de la boîte) */
      var Nts = becN(ts), mid = (M - 1) / 2, ref = Nts * Math.pow(becCell(-hx, hx, becSig(ts)), 2);
      var hS = Math.max(Dmax, 2 * ref);
      w.sc = phone ? Math.min(FW / 4.2, ry1 / 3.3) : Math.min(rx1 / 4.4, FH / 3.4); w.cx = (rx0 + rx1) / 2; w.cy = phone ? ry1 * 0.6 : FH * 0.6;
      var G = 1.6, HZ = 1.5, PJ = [];
      for (ii = 0; ii < M; ii++){ PJ.push([]); for (jj = 0; jj < M; jj++){ var X3 = -G + ii * 2 * G / (M - 1), Z3 = -G + jj * 2 * G / (M - 1), hh3 = Math.sqrt(D[ii][jj] / hS), Y3 = hh3 * HZ; var r3 = w.rot(X3, Y3, Z3); PJ[ii].push({r:r3, p:w.pv(r3), h:hh3}); } }
      /* socle */
      var cr = [w.p(-G, 0, -G), w.p(G, 0, -G), w.p(G, 0, G), w.p(-G, 0, G)];
      g.save(); g.beginPath(); cr.forEach(function(p, q){ if (q) g.lineTo(p.x, p.y); else g.moveTo(p.x, p.y); }); g.closePath(); g.fillStyle = "rgba(30,50,90,.55)"; g.fill(); g.strokeStyle = "rgba(150,180,230,.5)"; g.stroke(); g.restore();
      /* relief en « crêtes » : une tranche par rangée, de la plus lointaine à la plus proche (peu d'appels de dessin) */
      var alongI = Math.abs(PJ[M - 1][0].p.x - PJ[0][0].p.x) >= Math.abs(PJ[0][M - 1].p.x - PJ[0][0].p.x);
      var rows = [];
      for (jj = 0; jj < M; jj++){
        var pts = [], zz = 0, hmx = 0;
        for (ii = 0; ii < M; ii++){ var P = alongI ? PJ[ii][jj] : PJ[jj][ii]; pts.push(P); zz += P.r[2]; if (P.h > hmx) hmx = P.h; }
        rows.push({pts:pts, z:zz / M, hm:hmx, k:jj});
      }
      rows.sort(function(p, q){ return p.z - q.z; });
      var hpx = HZ * w.sc * Math.cos(w.b);
      rows.forEach(function(rw){
        var pts = rw.pts, X0 = alongI ? -G : -G + rw.k * 2 * G / (M - 1);
        var base = pts.map(function(P, q){ var X3 = alongI ? -G + q * 2 * G / (M - 1) : -G + rw.k * 2 * G / (M - 1), Z3 = alongI ? -G + rw.k * 2 * G / (M - 1) : -G + q * 2 * G / (M - 1); return w.p(X3, 0, Z3); });
        var yb = (base[0].y + base[M - 1].y) / 2, gr = g.createLinearGradient(0, yb, 0, yb - hpx);
        for (var q = 0; q <= 6; q++){ var cc = becCol(q / 6); gr.addColorStop(q / 6, "rgb(" + Math.round(cc[0]) + "," + Math.round(cc[1]) + "," + Math.round(cc[2]) + ")"); }
        g.beginPath(); pts.forEach(function(P, q){ if (q) g.lineTo(P.p.x, P.p.y); else g.moveTo(P.p.x, P.p.y); });
        for (q = M - 1; q >= 0; q--) g.lineTo(base[q].x, base[q].y);
        g.closePath(); g.fillStyle = gr; g.globalAlpha = 0.94; g.fill(); g.globalAlpha = 1;
        if (rw.hm > 0.004){ g.beginPath(); pts.forEach(function(P, q){ if (q) g.lineTo(P.p.x, P.p.y); else g.moveTo(P.p.x, P.p.y); }); g.strokeStyle = "rgba(235,245,255," + (0.25 + 0.5 * Math.min(1, rw.hm * 3)) + ")"; g.lineWidth = 1; g.stroke(); }
      });
      /* axes v_x, v_y */
      var ax = w.p(G + 0.25, 0, -G), az = w.p(-G, 0, G + 0.25);
      var clx = function(x){ return Math.max(rx0 + 34, Math.min(rx1 - 34, x)); }, cly = function(y){ return Math.max(44, Math.min(ry1 - 10, y)); };
      n9T(S, f, "v selon x", clx(ax.x), cly(ax.y), {size:n9fz(f, 11), color:"#bcd0ee"}); n9T(S, f, "v selon y", clx(az.x), cly(az.y), {size:n9fz(f, 11), color:"#bcd0ee"});
      n9T(S, f, "Vitesses des atomes (image après temps de vol)", 10, 14, {size:n9fz(f, 12), color:"#eef3fb", align:"left"});
      n9T(S, f, "± " + n9N(Lv * 1e3, 0) + " mm/s · hauteur : √(nombre d'atomes)", 10, 31, {size:n9fz(f, 10.5), color:"#9fb3d0", align:"left", weight:600});
      if (fr > 0){ var pk = PJ[Math.round(mid)][Math.round(mid)].p; n9tag(S, f, "condensat", Math.max(60, Math.min(rx1 - 60, pk.x)), Math.max(48, pk.y - 14), {size:n9fz(f, 11), color:"#ffe08a"}); }
      /* ---- N₀/N en fonction de T/Tc ---- */
      var gx0 = phone ? 50 : FW * 0.6 + 46, gx1 = FW - 14, gy0 = phone ? FH * 0.6 + 30 : 46, gy1 = FH - 34;
      g.save(); g.fillStyle = "#f6f8fb"; n9rr(g, gx0 - 40, gy0 - 30, gx1 - gx0 + 48, gy1 - gy0 + 58, 10); g.fill(); g.restore();
      n9T(S, f, "Fraction condensée N₀/N", gx0 - 30, gy0 - 15, {size:n9fz(f, 12), color:"#13233a", align:"left"});
      var GX = function(tt){ return gx0 + tt / 2 * (gx1 - gx0); }, GY = function(y){ return gy1 - y * (gy1 - gy0); };
      g.strokeStyle = "#e3e8ef"; g.lineWidth = 1;
      [0, 0.5, 1].forEach(function(y){ g.beginPath(); g.moveTo(gx0, GY(y)); g.lineTo(gx1, GY(y)); g.stroke(); n9T(S, f, n9N(y, 1), gx0 - 5, GY(y), {size:n9fz(f, 10), color:"#5f6b7a", align:"right", weight:600}); });
      [0, 0.5, 1, 1.5, 2].forEach(function(tt){ n9T(S, f, n9N(tt, 1), GX(tt), gy1 + 11, {size:n9fz(f, 10), color:"#5f6b7a", weight:600}); });
      n9T(S, f, "T / Tc", gx1, gy1 + 24, {size:n9fz(f, 10.5), color:"#5f6b7a", align:"right"});
      g.save(); g.setLineDash([4, 4]); g.strokeStyle = "#e08a2a"; g.beginPath(); g.moveTo(GX(1), gy0); g.lineTo(GX(1), gy1); g.stroke(); g.restore();
      g.beginPath(); for (var px = 0; px <= 100; px++){ var tt = px / 50, yv = tt < 1 ? 1 - tt * tt * tt : 0; if (px) g.lineTo(GX(tt), GY(yv)); else g.moveTo(GX(tt), GY(yv)); }
      g.strokeStyle = "#2f6fd6"; g.lineWidth = 2.4; g.stroke();
      g.strokeStyle = "#a3adba"; g.lineWidth = 1; g.beginPath(); g.moveTo(gx0, gy0); g.lineTo(gx0, gy1); g.lineTo(gx1, gy1); g.stroke();
      n9T(S, f, "1 − (T/Tc)³", GX(0.06), GY(0.3), {size:n9fz(f, 10.5), color:"#2f6fd6", align:"left"});
      if (hist.length > 1){ g.save(); g.beginPath(); var st0 = Math.max(1, Math.floor(hist.length / 80)), first = true;
        for (var hq = 0; hq < hist.length; hq += st0){ var hp = hist[hq]; if (hp[0] > 2 || (hq >= st0 && Math.abs(hp[0] - hist[hq - st0][0]) > 0.08)){ first = true; if (hp[0] > 2) continue; } if (first){ g.moveTo(GX(hp[0]), GY(hp[1])); first = false; } else g.lineTo(GX(hp[0]), GY(hp[1])); }
        g.strokeStyle = "rgba(224,102,42,.55)"; g.lineWidth = 3; g.lineJoin = "round"; g.stroke(); g.restore(); }
      var tNow = T / tc; if (tNow <= 2){ n9fball(g, GX(tNow), GY(fr), 6.5, "#e0662a"); g.strokeStyle = "#13233a"; g.beginPath(); g.arc(GX(tNow), GY(fr), 6.5, 0, TAU); g.stroke(); }
      else n9T(S, f, "T > 2 Tc →", gx1 - 4, GY(0) - 12, {size:n9fz(f, 10), color:"#e0662a", align:"right"});

      /* ---- afficheurs ---- */
      ro.set(0, n9sci(N, 2, true));
      ro.set(1, n9N(tc, 0) + " nK");
      ro.set(2, fr > 0.999 ? "> 99,9 %" : n9N(fr * 100, 1) + " %");
      ro.set(3, n9N(sT * 1e3, 2) + " mm/s");
      var msg = T >= tc ? "Au-dessus de T<sub>c</sub> : les atomes se répartissent sur de nombreux états, la distribution des vitesses est une large bosse gaussienne. Le couteau RF retire les plus rapides et le nuage se refroidit."
        : "Sous T<sub>c</sub> = " + n9N(tc, 0) + " nK : " + (fr > 0.995 ? "presque tous les atomes sont" : n9N(fr * 100, 0) + " % des atomes sont") + " dans l'état fondamental du piège. Leur dispersion de vitesse vaut √(ħω/2m) = " + n9N(sC * 1e3, 2) + " mm/s, bien moins que l'agitation thermique : d'où le pic étroit.";
      nt.set(msg + " Modèle d'évaporation : chaque fois que T est divisée par 4, la moitié des atomes est partie ; gaz sans interactions.", T < tc ? "ok" : "warn");
    });
  }
});
})();
