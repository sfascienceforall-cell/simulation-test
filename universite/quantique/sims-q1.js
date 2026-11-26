/* Physique quantique · lot Q1 (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   pq-young-impact-par-impact · pq-effet-photoelectrique · pq-barriere-tunnel · pq-boite-quantique
   pq-orbitales-hydrogene-3d · pq-stern-gerlach
   Aucune ressource externe : la 3D est une projection faite main (faces triées par profondeur). */
(function(){
var PI = Math.PI, TAU = 2 * PI;
/* ---------- constantes (CODATA 2018) ---------- */
var HP = 6.62607015e-34, HB = HP / TAU, ME = 9.1093837015e-31, QE = 1.602176634e-19, CL = 2.99792458e8;
var UMA = 1.66053906660e-27, KB = 1.380649e-23, MUB = 9.2740100783e-24, A0PM = 52.917721, RYEV = 13.605693;
var HC_EVNM = HP * CL / QE * 1e9; /* 1239,84 eV·nm */

/* ---------- petites aides (préfixe q) ---------- */
function qrgb(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function qshade(col, f){
  var c = typeof col === "string" ? qrgb(col) : col;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function qa(col, a){ var c = typeof col === "string" ? qrgb(col) : col; return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
function qfz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function qN(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d == null ? 2 : d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
var SUPD = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
/* notation scientifique : d chiffres après la virgule de la mantisse */
function qsci(x, d, html){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return qN(x, Math.max(0, d - e));
  return qN(m, d) + "·10" + (html ? "<sup>" + String(e).replace("-", "−") + "</sup>" : String(e).split("").map(function(ch){ return SUPD[ch]; }).join(""));
}
function qT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function qrr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function qball(ctx, x, y, r, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, qshade(col, 0.75)); g.addColorStop(0.45, qshade(col, 0)); g.addColorStop(1, qshade(col, -0.55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, TAU); ctx.fill(); ctx.restore();
}
function qglow(ctx, x, y, r, col, a){
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, qa(col, a == null ? 0.8 : a)); g.addColorStop(1, qa(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
/* couleur perçue d'une longueur d'onde (nm) ; en dehors du visible : violet pâle (UV) ou rouge sombre (IR) */
function qwl(nm){
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
function qstep(span, n){ var s = span / n, p = Math.pow(10, Math.floor(Math.log10(s))), m = s / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }

/* ---------- moteur 3D minimal : vue orbitale, faces planes éclairées, triées par profondeur ---------- */
function Q3(){ this.a = -0.5; this.b = 0.35; this.sc = 40; this.cx = 0; this.cy = 0; this.f = 14; this.L = []; this.set(); }
Q3.prototype.set = function(){ this.ca = Math.cos(this.a); this.sa = Math.sin(this.a); this.cb = Math.cos(this.b); this.sb = Math.sin(this.b); };
/* monde (x, y vers le haut, z) → vue (x à droite, y en haut, z vers toi) */
Q3.prototype.rot = function(x, y, z){
  var x1 = x * this.ca + z * this.sa, z1 = -x * this.sa + z * this.ca;
  return [x1, y * this.cb - z1 * this.sb, y * this.sb + z1 * this.cb];
};
Q3.prototype.pv = function(v){ var s = this.f ? this.f / (this.f - v[2]) : 1; return {x:this.cx + v[0] * this.sc * s, y:this.cy - v[1] * this.sc * s, z:v[2], s:s}; };
Q3.prototype.p = function(x, y, z){ return this.pv(this.rot(x, y, z)); };
Q3.prototype.clear = function(){ this.L = []; };
/* face : points monde, couleur ; o.c = centre de l'objet (oriente la normale vers l'extérieur), o.cull, o.alpha, o.glow (sans ombrage) */
Q3.prototype.face = function(pts, col, o){ this.L.push({t:0, pts:pts, col:col, o:o || {}}); };
Q3.prototype.sprite = function(x, y, z, fn){ var v = this.rot(x, y, z); this.L.push({t:1, z:v[2] + 1e-3, fn:fn, v:v}); };
Q3.prototype.box = function(x0, y0, z0, x1, y1, z1, col, o){
  o = o || {}; var c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], q = {c:c, cull:true, alpha:o.alpha, line:o.line, tag:o.tag};
  var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(f, i){
    var cc = o.cols ? o.cols[i] || col : col, qq = q;
    if (o.after && o.afterFace === i){ qq = {c:c, cull:true, alpha:o.alpha, line:o.line, after:o.after}; }
    this.face(f.map(function(j){ return P[j]; }), cc, qq);
  }, this);
};
/* cylindre de l'axe p0 → p1, rayon r, n côtés */
Q3.prototype.cyl = function(p0, p1, r, n, col, o){
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
Q3.prototype.render = function(ctx){
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
    var fill = d.o.glow ? d.col : qshade(d.col, -0.5 + 0.72 * dif);
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
function qorbit(c, v, k, lim, onDrag){
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
function qlab(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top || "#1c2740"); g.addColorStop(1, bot || "#090e1a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(255,255,255,0.05)"); v.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
/* étiquette claire sur fond sombre, bornée au cadre */
function qtag(S, c, s, x, y, o){
  o = o || {}; var ctx = c.ctx, size = qfz(c, o.size || 12);
  ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px Mulish, system-ui, sans-serif";
  var w = ctx.measureText(s).width + 12, h = size + 8; ctx.restore();
  var al = o.align || "center", bx = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  bx = Math.max(3, Math.min(c.W - w - 3, bx)); var by = Math.max(3, Math.min(c.H - h - 3, y - h / 2));
  ctx.save(); ctx.fillStyle = o.bg || "rgba(8,14,28,.72)"; qrr(ctx, bx, by, w, h, 6); ctx.fill();
  if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  qT(S, c, s, bx + w / 2, by + h / 2 + 0.5, {size:size, color:o.color || "#eef3fb", weight:o.weight || 800});
  return {x:bx, y:by, w:w, h:h};
}

/* =====================================================================
   1. Young un impact à la fois (pq02)
   ===================================================================== */
/* montages modèles : d = écart des fentes, a = largeur d'une fente, L = distance fentes-écran, X = demi-largeur d'écran vue */
var YG = {
  photon:{nom:"photon", d:0.20e-3, a:0.04e-3, L:1.0, X:18e-3, u:"mm", uf:1e3, src:"laser très atténué", col:"#ffd34d"},
  electron:{nom:"électron", d:0.50e-6, a:0.10e-6, L:1.0, X:200e-6, u:"µm", uf:1e6, src:"canon à électrons", col:"#7fd4ff", m:ME},
  na:{nom:"atome Na", d:0.20e-6, a:0.04e-6, L:1.0, X:600e-6, u:"µm", uf:1e6, src:"four à sodium", col:"#ffb04d", m:22.98977 * UMA},
  na2:{nom:"molécule Na₂", d:0.20e-6, a:0.04e-6, L:1.0, X:600e-6, u:"µm", uf:1e6, src:"four à sodium (jet de Na₂)", col:"#ff8a5c", m:2 * 22.98977 * UMA}
};
/* longueur d'onde (m) : photon → λ donnée ; matière → λ = h/p, p relativiste */
function ygLambda(kind, lamNm, v){
  if (kind === "photon") return lamNm * 1e-9;
  var m = YG[kind].m, g = 1 / Math.sqrt(1 - v * v / (CL * CL));
  return HP / (g * m * v);
}
/* intensité relative sur l'écran en x (m) */
function ygI(x, P, lam, mode){
  var ua = PI * P.a * x / (lam * P.L), env = Math.abs(ua) < 1e-9 ? 1 : Math.pow(Math.sin(ua) / ua, 2);
  if (mode === "deux") return env * Math.pow(Math.cos(PI * P.d * x / (lam * P.L)), 2);
  return env;  /* une fente ouverte, ou détecteur de passage : pas de franges */
}

SFA.sim({
  id:"pq-young-impact-par-impact", ch:"pq02", tag:"Dualité onde-corpuscule",
  titre:"Young un impact à la fois : photons, électrons, atomes, molécules",
  resume:"Un canon tire une particule à la fois vers deux fentes : les impacts tombent au hasard, puis dessinent des franges.",
  but:"Une seule particule traverse le montage à la fois. Regarde les impacts s'accumuler sur l'écran, puis change de particule ou de vitesse, bouche une fente ou allume le détecteur de passage. Glisse sur la scène pour tourner autour du montage.",
  aRetenir:"Chaque particule arrive en un point, mais la répartition des impacts suit |ψ|² : franges d'interfrange i = λL/d, avec λ = h/p.",
  piege:"Savoir par quelle fente passe la particule détruit les franges : ce n'est pas un défaut du détecteur, c'est la mesure.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 300 : 360), f = k.canvas(phone ? 250 : 270);
    var kind = "electron", mode = "deux";
    var pS = k.seg("Particule", [["photon", "Photon"], ["electron", "Électron"], ["na", "Atome Na"], ["na2", "Molécule Na₂"]], "electron", function(v){ kind = v; showSl(); clearAll(); });
    var lamS = k.slider("Longueur d'onde du laser λ", 400, 700, 5, 550, "nm", function(){ clearAll(); });
    var veS = k.slider("Vitesse de l'électron v (× 10⁷ m/s)", 1, 15, 0.5, 5, "", function(){ clearAll(); });
    var vaS = k.slider("Vitesse du jet v", 300, 3000, 50, 1000, "m/s", function(){ clearAll(); });
    var mS = k.seg("Fentes", [["deux", "Deux fentes"], ["haut", "Une seule"], ["det", "Deux + détecteur"]], "deux", function(v){ mode = v; clearAll(); });
    var rS = k.seg("Cadence", [["4", "4 par s"], ["40", "40 par s"], ["400", "400 par s"]], "40");
    var thT = k.toggle("Courbe prévue (|ψ|² sur l'écran)", true);
    k.button("Effacer l'écran", function(){ clearAll(); });
    var ro = k.readouts(["Longueur d'onde λ", "Interfrange i = λL/d", "Impacts", "Quantité de mouvement p"]);
    var nt = k.note("", "ok");
    function showSl(){
      lamS.el.parentNode.style.display = kind === "photon" ? "" : "none";
      veS.el.parentNode.style.display = kind === "electron" ? "" : "none";
      vaS.el.parentNode.style.display = kind === "na" || kind === "na2" ? "" : "none";
    }
    showSl();
    var NB = 90, hist = new Float64Array(NB), imp = [], nTot = 0, fly = [], acc = 0, flash = 0;
    function lam(){ return ygLambda(kind, lamS.value, kind === "electron" ? veS.value * 1e7 : vaS.value); }
    /* assez de colonnes pour résoudre les franges : au moins 4 par interfrange */
    function clearAll(){ NB = Math.max(90, Math.min(400, Math.ceil(8 * YG[kind].X / (lam() * YG[kind].L / YG[kind].d)))); hist = new Float64Array(NB); imp = []; nTot = 0; fly = []; tex = null; k.redraw(); }
    /* tirage d'un point d'impact selon |ψ|² (rejet), x en mètres */
    function draw1(){
      var P = YG[kind], l = lam();
      for (var t = 0; t < 2000; t++){ var x = (2 * Math.random() - 1) * P.X; if (Math.random() < ygI(x, P, l, mode === "deux" ? "deux" : "un")) return x; }
      return 0;
    }
    /* texture de l'écran (impacts accumulés), redessinée seulement si besoin */
    var tex = null, texN = 0, TW = 360, TH = 150;
    function addImp(u, y){
      if (!tex){ tex = document.createElement("canvas"); tex.width = TW; tex.height = TH; texN = 0; }
      var tc = tex.getContext("2d"), col = YG[kind].col, px = (u + 1) / 2 * TW, py = (y + 1) / 2 * TH;
      tc.fillStyle = qa(col, 0.25); tc.beginPath(); tc.arc(px, py, 1.6, 0, TAU); tc.fill();
      tc.fillStyle = qa("#ffffff", 0.9); tc.fillRect(px - 0.7, py - 0.7, 1.4, 1.4); texN++;
    }
    function land(p){
      var P = YG[kind], u = p.x / P.X, b = Math.floor((u + 1) / 2 * NB);
      if (b >= 0 && b < NB) hist[b]++;
      nTot++; imp.push(p.x); addImp(u, p.y); flash = 1;
    }
    /* ---- vue 3D ---- */
    var v = new Q3(); v.a = 0.5; v.b = 0.34; v.f = 30; v.set();
    qorbit(c, v, k, [-0.2, 1.2]);
    clearAll();
    var lp = k.loop(function(dt, t){
      var rate = +rS.value; acc += dt * rate;
      /* une seule particule dans le montage : le vol dure moins que l'intervalle entre deux tirs */
      var tf = Math.min(0.9, 0.9 / rate);
      while (acc >= 1){
        acc -= 1;
        while (fly.length) land(fly.shift());
        var P = YG[kind], slit = mode === "haut" ? 1 : (Math.random() < 0.5 ? 1 : -1);
        var p = {x:draw1(), y:(Math.random() * 2 - 1) * 0.55, t:0, tf:tf, s:slit};
        if (rate > 100){ land(p); } else fly.push(p);
      }
      for (var i = fly.length - 1; i >= 0; i--){ fly[i].t += dt; if (fly[i].t >= fly[i].tf){ land(fly[i]); fly.splice(i, 1); } }
      flash = Math.max(0, flash - dt * 3);
      if (!v.user) { v.a = 0.5 + 0.16 * Math.sin(t * 0.25); v.set(); }
      k.redraw();
    });
    lp.play();
    /* positions dans la scène : canon x = -3,3 → fentes x = 0 → écran x = 3 ; franges le long de z */
    var ZS = 1.8, YS = 1.05, SEP = 0.2;
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, P = YG[kind], l = lam(), i;
      qlab(ctx, W, H, "#1e2a45", "#0a0f1c");
      v.sc = Math.min(W / 7.6, H / 4.0); v.cx = W * 0.5; v.cy = H * 0.55; v.clear();
      /* table, rail et supports */
      v.box(-4.3, -1.62, -1.9, 3.9, -1.45, 1.9, "#7a5232", {cols:[null, null, null, "#9c6b40"]});
      v.box(-4.0, -1.45, -0.18, 3.6, -1.33, 0.18, "#5d6878");
      /* canon */
      var gc = kind === "photon" ? "#3c4a5e" : kind === "electron" ? "#6b7a8e" : "#8a5a3a";
      v.cyl([-3.8, 0, 0], [-2.7, 0, 0], 0.42, 18, gc, {cap1:"#20262f"});
      v.cyl([-2.7, 0, 0], [-2.45, 0, 0], 0.18, 12, "#9aa7b8", {cap1:"#0b0f16"});
      v.box(-3.5, -1.33, -0.2, -3.0, -0.42, 0.2, "#4a5566");
      /* plaque à deux fentes (fentes verticales en z = ±SEP) */
      var w = 0.06, pc = "#a9b3c2";
      v.box(-0.05, 0.55, -1.15, 0.05, 1.15, 1.15, pc); v.box(-0.05, -1.15, -1.15, 0.05, -0.55, 1.15, pc);
      v.box(-0.05, -0.55, -1.15, 0.05, 0.55, -SEP - w, pc); v.box(-0.05, -0.55, -SEP + w, 0.05, 0.55, SEP - w, pc); v.box(-0.05, -0.55, SEP + w, 0.05, 0.55, 1.15, pc);
      v.box(-0.12, -1.33, -0.25, 0.12, -1.15, 0.25, "#4a5566");
      /* cache sur la fente z = +SEP : les particules passent par la fente z = −SEP */
      if (mode === "haut") v.box(-0.2, -0.6, SEP - w - 0.06, -0.06, 0.6, SEP + w + 0.06, "#c0392b");
      if (mode === "det"){
        v.cyl([-0.25, 0.75, SEP], [-0.25, 0.75, -SEP], 0.09, 10, "#d9a23b");
        [SEP, -SEP].forEach(function(zz){ v.sprite(-0.25, 0.75, zz, function(ctx2, q){ qglow(ctx2, q.x, q.y, 16 * q.s, "#ffd34d", 0.25 + 0.6 * flash); }); });
      }
      /* écran : impacts sur la face côté source (x = 3), texture posée en affine */
      v.box(3.0, -YS, -ZS, 3.1, YS, ZS, "#16301f", {afterFace:4, after:function(ctx2){
        var A = v.p(3.0, YS, -ZS), B = v.p(3.0, YS, ZS), C = v.p(3.0, -YS, -ZS), D = v.p(3.0, -YS, ZS);
        ctx2.save(); ctx2.beginPath(); ctx2.moveTo(A.x, A.y); ctx2.lineTo(B.x, B.y); ctx2.lineTo(D.x, D.y); ctx2.lineTo(C.x, C.y); ctx2.closePath();
        ctx2.fillStyle = "#0b2215"; ctx2.fill(); ctx2.clip();
        if (tex){ var dpr = ctx2.canvas.width / W; ctx2.globalCompositeOperation = "lighter";
          ctx2.setTransform(dpr * (B.x - A.x) / TW, dpr * (B.y - A.y) / TW, dpr * (C.x - A.x) / TH, dpr * (C.y - A.y) / TH, dpr * A.x, dpr * A.y); ctx2.drawImage(tex, 0, 0); }
        ctx2.restore();
      }});
      v.box(3.0, -1.33, -0.25, 3.25, -YS, 0.25, "#4a5566");
      /* particules en vol */
      fly.forEach(function(p){
        var s = p.t / p.tf, x, y, z;
        if (s < 0.47){ var q = s / 0.47; x = -2.45 + q * 2.45; y = 0; z = mode === "det" || mode === "haut" ? q * q * p.s * SEP * (mode === "haut" ? -1 : 1) : 0; }
        else { var q2 = (s - 0.47) / 0.53, z0 = mode === "deux" ? 0 : (mode === "haut" ? -SEP : p.s * SEP); x = q2 * 3; y = q2 * p.y * YS; z = z0 + q2 * (p.x / P.X * ZS - z0); }
        v.sprite(x, y, z, function(ctx2, q){
          if (mode === "deux" && s >= 0.47){ /* onde qui sort des deux fentes : on ne sait pas où est la particule */
            ctx2.save(); ctx2.strokeStyle = qa(P.col, 0.5 * (1 - (s - 0.47) / 0.53)); ctx2.lineWidth = 1.5;
            [SEP, -SEP].forEach(function(zz){ var o = v.p(0.06, 0, zz), rr = (s - 0.47) / 0.53 * 3 * v.sc; ctx2.beginPath(); ctx2.ellipse(o.x, o.y, rr * 0.55, rr * 0.35, 0, -1.2, 1.2); ctx2.stroke(); });
            ctx2.restore(); return;
          }
          qglow(ctx2, q.x, q.y, 11 * q.s, P.col, 0.85); qball(ctx2, q.x, q.y, 3 * q.s, P.col);
        });
      });
      v.render(ctx);
      /* étiquettes */
      var g0 = v.p(-3.3, 0.55, 0), s0 = v.p(0, 1.25, 0), e0 = v.p(3.05, YS + 0.25, 0);
      qtag(S, c, P.src, g0.x, g0.y, {size:11.5});
      qtag(S, c, mode === "haut" ? "une fente bouchée" : mode === "det" ? "détecteur allumé" : "deux fentes", s0.x, s0.y, {size:11.5, color:mode === "deux" ? "#eef3fb" : "#ffd34d"});
      qtag(S, c, "écran", e0.x, e0.y, {size:11.5});
      qT(S, c, "glisse pour tourner", W - 10, 14, {size:qfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      qtag(S, c, "une seule particule à la fois dans le montage", 8, 16, {size:10.5, align:"left", weight:700});

      /* ---- écran vu de face + histogramme ---- */
      var g = f.ctx, FW = f.W, FH = f.H;
      g.fillStyle = "#f4f6fa"; g.fillRect(0, 0, FW, FH);
      var mx = 14, sw = FW - 2 * mx, sh = Math.round(FH * 0.42), sy = 26;
      qT(S, f, "Écran vu de face", mx, 13, {size:qfz(f, 12.5), color:"#13233a", align:"left"});
      qT(S, f, nTot + " impact" + (nTot > 1 ? "s" : ""), FW - mx, 13, {size:qfz(f, 12), color:"#2f6fd6", align:"right"});
      g.save(); qrr(g, mx, sy, sw, sh, 8); g.fillStyle = "#081a10"; g.fill(); g.clip();
      if (tex){ g.globalCompositeOperation = "lighter"; g.drawImage(tex, mx, sy, sw, sh); }
      g.restore();
      /* histogramme */
      var hy = sy + sh + 12, hh = FH - hy - 30, mxh = 0;
      for (i = 0; i < NB; i++) mxh = Math.max(mxh, hist[i]);
      /* courbe prévue, normalisée au nombre d'impacts */
      var NS = Math.max(300, 4 * NB), curve = [], Z = 0, mode2 = mode === "deux" ? "deux" : "un";
      for (i = 0; i < NS; i++){ var xx = (-1 + (i + 0.5) * 2 / NS) * P.X, Iv = ygI(xx, P, l, mode2); curve.push(Iv); Z += Iv; }
      var expMax = 0; for (i = 0; i < NS; i++) expMax = Math.max(expMax, curve[i] / Z * NS / NB * nTot);
      var top = Math.max(mxh, expMax, 1) * 1.08, bw = sw / NB;
      for (i = 0; i < NB; i++){
        var hb = hist[i] / top * hh; if (hb <= 0) continue;
        var gr = g.createLinearGradient(0, hy + hh - hb, 0, hy + hh); gr.addColorStop(0, "#4f8ff0"); gr.addColorStop(1, "#2457a8");
        g.fillStyle = gr; g.fillRect(mx + i * bw + 0.5, hy + hh - hb, Math.max(1, bw - 1), hb);
      }
      if (thT.value && nTot > 0){
        g.save(); g.beginPath();
        for (i = 0; i < NS; i++){ var px = mx + (i + 0.5) / NS * sw, py = hy + hh - curve[i] / Z * NS / NB * nTot / top * hh; if (i) g.lineTo(px, py); else g.moveTo(px, py); }
        g.strokeStyle = "#e0662a"; g.lineWidth = 2; g.stroke(); g.restore();
      }
      g.strokeStyle = "#a3adba"; g.lineWidth = 1; g.beginPath(); g.moveTo(mx, hy + hh + 0.5); g.lineTo(mx + sw, hy + hh + 0.5); g.stroke();
      /* graduations en mm ou µm */
      var span = 2 * P.X * P.uf, st = qstep(span, phone ? 4 : 6), x0 = Math.ceil(-P.X * P.uf / st) * st;
      for (var xv = x0; xv <= P.X * P.uf + 1e-9; xv += st){
        var X = mx + (xv / (P.X * P.uf) + 1) / 2 * sw;
        g.strokeStyle = "#a3adba"; g.beginPath(); g.moveTo(X, hy + hh); g.lineTo(X, hy + hh + 4); g.stroke();
        qT(S, f, qN(xv, st < 1 ? 1 : 0), Math.max(mx + 12, Math.min(FW - mx - 12, X)), hy + hh + 12, {size:qfz(f, 10.5), color:"#5f6b7a", weight:600});
      }
      qT(S, f, "x (" + P.u + ")", mx + sw - 2, hy + hh + 24, {size:qfz(f, 10.5), color:"#5f6b7a", align:"right"});
      if (thT.value && nTot > 0) qT(S, f, "— prévu", mx + 2, hy + hh + 24, {size:qfz(f, 10.5), color:"#e0662a", align:"left"});

      /* ---- afficheurs ---- */
      var i0 = l * P.L / P.d;
      ro.set(0, kind === "photon" ? qN(l * 1e9, 0) + " nm" : qN(l * 1e12, 2) + " pm");
      ro.set(1, qN(i0 * P.uf, i0 * P.uf < 10 ? 2 : 1) + " " + P.u);
      ro.set(2, String(nTot));
      ro.set(3, qsci(HP / l, 2, true) + " kg·m/s");
      var mont = "Montage : d = " + (P.d < 1e-4 ? qN(P.d * 1e9, 0) + " nm" : qN(P.d * 1e3, 2) + " mm") + ", L = " + qN(P.L, 1) + " m. ";
      var msg = mode === "deux" ? "Chaque impact est un point isolé, à une place imprévisible ; les franges n'apparaissent qu'avec des centaines d'impacts." :
        mode === "haut" ? "Une seule fente : plus de franges, il reste la tache de diffraction d'une fente (largeur 2λL/a)." :
        "Le détecteur dit par quelle fente passe chaque particule : les franges disparaissent, il reste la somme des deux taches de diffraction.";
      nt.set(mont + msg + (kind !== "photon" ? " λ = h/p : plus la particule est lourde ou rapide, plus les franges sont serrées." : ""), mode === "deux" ? "ok" : "warn");
    });
  }
});
/* =====================================================================
   2. Effet photoélectrique (pq02)
   ===================================================================== */
/* travaux d'extraction typiques (eV) : ils dépendent de l'état de la surface */
var PE_MET = {
  Cs:{nom:"césium", W:2.14, col:"#d8b860"}, K:{nom:"potassium", W:2.29, col:"#c9ccd4"}, Na:{nom:"sodium", W:2.36, col:"#d5d9e0"},
  Zn:{nom:"zinc", W:4.30, col:"#9fb0c4"}, Cu:{nom:"cuivre", W:4.70, col:"#c98352"}
};
var PE_P = 1e-6, PE_ETA = 0.10;   /* puissance lumineuse maximale sur la cathode (W), rendement quantique supposé */
/* courant (A) pour λ (nm), intensité (0-1), tension de freinage U (V), métal ; modèle : énergies réparties uniformément entre 0 et T_max */
function peCurrent(lam, f, U, Wx){
  var E = HC_EVNM / lam, T = E - Wx; if (T <= 0 || f <= 0) return 0;
  var Is = PE_ETA * QE * (f * PE_P) / (HP * CL / (lam * 1e-9));
  if (U <= 0) return Is;
  return Is * Math.max(0, 1 - U / T);
}

SFA.sim({
  id:"pq-effet-photoelectrique", ch:"pq02", tag:"Photon",
  titre:"Effet photoélectrique : la couleur compte, pas l'intensité",
  resume:"Une cellule sous vide éclairée : les électrons ne sortent que si hν dépasse le travail d'extraction, et la droite T(ν) a pour pente h.",
  but:"Change la couleur de la lampe (curseur ou clic sur la bande de couleurs), son intensité et le métal. Tourne le bouton du générateur (glisse vers le haut) pour freiner les électrons, ou lance la mesure de U₀ : le point (ν, eU₀) se place sur le graphe.",
  aRetenir:"T_max = hν − W : sous la fréquence seuil ν₀ = W/h, aucun électron ne sort, quelle que soit l'intensité.",
  piege:"L'intensité change le nombre d'électrons (le courant), jamais leur énergie maximale.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 370), g = k.canvas(phone ? 230 : 240);
    var metS = k.select("Métal de la cathode", Object.keys(PE_MET).map(function(m){ return [m, m + " · " + PE_MET[m].nom + " (W = " + qN(PE_MET[m].W, 2) + " eV)"]; }), "Na");
    var PE_L0 = 200, PE_L1 = 700;   /* bande de la lampe (nm) */
    var lamS = k.slider("Longueur d'onde λ", PE_L0, PE_L1, 5, 400, "nm");
    var intS = k.slider("Intensité de la lampe", 0, 100, 5, 60, "%");
    var uS = k.slider("Tension de freinage U", -2, 7, 0.05, 0, "V");
    k.button("Mesurer U₀ (balayage)", function(){ startSweep(); }, true);
    k.button("Effacer le graphe", function(){ pts = []; });
    var ro = k.readouts(["Énergie du photon hν", "Fréquence ν", "T_max = hν − W", "Tension d'arrêt U₀", "Courant I"]);
    var nt = k.note("", "ok");
    var pts = [], el = [], ph = [], accE = 0, accP = 0, sweep = null, knob = null, strip = null, dragK = null;
    function st(){
      var M = PE_MET[metS.value], lam = lamS.value, E = HC_EVNM / lam, T = E - M.W;
      return {M:M, lam:lam, E:E, T:T, nu:CL / (lam * 1e-9), f:intS.value / 100, U:uS.value, I:peCurrent(lam, intS.value / 100, uS.value, M.W)};
    }
    function startSweep(){ var s0 = st(); sweep = {u0:uS.value, phase:0, hold:0}; uS.set(0); }
    function addPoint(){
      var s0 = st(); pts = pts.filter(function(p){ return !(p.m === metS.value && Math.abs(p.lam - s0.lam) < 1e-9); });
      pts.push({m:metS.value, lam:s0.lam, nu:s0.nu, T:Math.max(0, s0.T), off:s0.T <= 0});
    }
    /* souris : bouton du générateur (glisser verticalement) et bande de couleurs (clic) */
    c.cv.style.touchAction = "none";
    c.pointer(function(type, p){
      if (type === "down"){
        if (knob && Math.hypot(p.x - knob.x, p.y - knob.y) < knob.r + 14){ dragK = {y:p.y, u:uS.value}; sweep = null; return; }
        if (strip && p.x >= strip.x0 && p.x <= strip.x1 && p.y >= strip.y0 - 8 && p.y <= strip.y1 + 8){ lamS.set(Math.round((PE_L0 + (p.x - strip.x0) / (strip.x1 - strip.x0) * (PE_L1 - PE_L0)) / 5) * 5); dragK = {strip:true}; k.redraw(); }
      }
      if (type === "drag" && dragK){
        if (dragK.strip){ lamS.set(Math.round((PE_L0 + Math.max(0, Math.min(1, (p.x - strip.x0) / (strip.x1 - strip.x0))) * (PE_L1 - PE_L0)) / 5) * 5); }
        else uS.set(Math.round((dragK.u + (dragK.y - p.y) * 0.025) / 0.05) * 0.05);
        k.redraw();
      }
      if (type === "move"){ var on = (knob && Math.hypot(p.x - knob.x, p.y - knob.y) < knob.r + 14) || (strip && p.x >= strip.x0 && p.x <= strip.x1 && p.y >= strip.y0 - 8 && p.y <= strip.y1 + 8); c.cv.style.cursor = on ? "pointer" : "default"; }
      if (type === "up") dragK = null;
    });
    var GEO = {};
    var lp = k.loop(function(dt, t){
      var s0 = st();
      /* balayage automatique de U jusqu'à l'arrêt du courant */
      if (sweep){
        if (sweep.phase === 0){
          if (s0.T <= 0){ addPoint(); sweep.phase = 1; }
          else { var nu = Math.min(s0.T, uS.value + dt * 1.2); uS.set(nu); if (nu >= s0.T - 1e-9){ uS.set(s0.T); addPoint(); sweep.phase = 1; } }
        } else { sweep.hold += dt; if (sweep.hold > 1.6){ uS.set(sweep.u0); sweep = null; } }
      }
      if (t > 1.2 && !lp.auto){ lp.auto = true; if (!pts.length) startSweep(); }
      /* photons : petits trains d'ondes de la lampe à la cathode */
      accP += dt * (4 + 22 * s0.f);
      while (accP >= 1){ accP -= 1; if (s0.f > 0) ph.push({s:0, o:(Math.random() - 0.5) * 0.7}); }
      for (var i = ph.length - 1; i >= 0; i--){ ph[i].s += dt * 1.4; if (ph[i].s >= 1) ph.splice(i, 1); }
      /* électrons : vitesse ∝ √T, freinage uniforme entre cathode (x = 0) et anode (x = 1) */
      if (s0.T > 0 && s0.f > 0){ accE += dt * 34 * s0.f; while (accE >= 1){ accE -= 1; el.push({x:0, T:Math.random() * s0.T, y:(Math.random() - 0.5) * 0.8, v:null, age:0}); } }
      var c0 = 1.25, U = uS.value;
      for (i = el.length - 1; i >= 0; i--){
        var e = el[i]; if (e.v === null) e.v = c0 * Math.sqrt(e.T);
        e.v += -c0 * c0 * U / 2 * dt; e.x += e.v * dt; e.age += dt;
        if (e.x >= 1 || e.x < 0 || e.age > 5) el.splice(i, 1);
      }
      if (el.length > 400) el.splice(0, el.length - 400);
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, s0 = st(), i, col = qwl(s0.lam), vis = s0.lam >= 380;
      qlab(ctx, W, H, "#202b42", "#0b101d");
      /* paillasse */
      var ty = H * 0.66; var gT = ctx.createLinearGradient(0, ty, 0, H); gT.addColorStop(0, "#8a5c36"); gT.addColorStop(0.08, "#6d4628"); gT.addColorStop(1, "#3e2716");
      ctx.fillStyle = gT; ctx.fillRect(0, ty, W, H - ty);
      ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(0, ty, W, 2);
      /* ampoule (cellule sous vide) */
      var cx = W * (phone ? 0.58 : 0.56), cy = H * 0.4, Lb = W * (phone ? 0.3 : 0.27), Rb = H * 0.2;
      var xc = cx - Lb * 0.62, xa = cx + Lb * 0.62;
      GEO = {xc:xc, xa:xa, cy:cy, Rb:Rb};
      /* pied et culot */
      ctx.save(); var gb = ctx.createLinearGradient(cx - 30, 0, cx + 30, 0); gb.addColorStop(0, "#2b3240"); gb.addColorStop(0.5, "#6b7486"); gb.addColorStop(1, "#22283a");
      ctx.fillStyle = gb; ctx.fillRect(cx - 12, cy + Rb * 0.9, 24, ty - cy - Rb * 0.9 + 4); qrr(ctx, cx - 42, ty - 4, 84, 12, 5); ctx.fill(); ctx.restore();
      /* verre : intérieur */
      ctx.save(); qrr(ctx, cx - Lb, cy - Rb, 2 * Lb, 2 * Rb, Rb); var gv = ctx.createLinearGradient(0, cy - Rb, 0, cy + Rb);
      gv.addColorStop(0, "rgba(160,200,255,.20)"); gv.addColorStop(0.5, "rgba(120,160,220,.07)"); gv.addColorStop(1, "rgba(160,200,255,.18)"); ctx.fillStyle = gv; ctx.fill(); ctx.restore();
      /* cathode : plaque métallique incurvée */
      var M = s0.M, hc = Rb * 0.78;
      ctx.save(); var gc = ctx.createLinearGradient(xc - 10, 0, xc + 6, 0); gc.addColorStop(0, qshade(M.col, -0.55)); gc.addColorStop(0.6, qshade(M.col, 0.25)); gc.addColorStop(1, qshade(M.col, -0.2));
      ctx.fillStyle = gc; ctx.beginPath(); ctx.moveTo(xc - 8, cy - hc); ctx.quadraticCurveTo(xc + 10, cy, xc - 8, cy + hc); ctx.lineTo(xc - 16, cy + hc); ctx.quadraticCurveTo(xc + 2, cy, xc - 16, cy - hc); ctx.closePath(); ctx.fill(); ctx.restore();
      /* anode : grille */
      ctx.save(); ctx.strokeStyle = "#c4ccd8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa, cy - hc * 0.9); ctx.lineTo(xa, cy + hc * 0.9); ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(196,204,216,.6)"; for (i = -3; i <= 3; i++){ ctx.beginPath(); ctx.moveTo(xa - 5, cy + i * hc * 0.26); ctx.lineTo(xa + 5, cy + i * hc * 0.26); ctx.stroke(); } ctx.restore();
      /* lampe et faisceau */
      var lx = cx + Lb * 0.05, ly = H * 0.075, hit = {x:xc + 4, y:cy}, ang = Math.atan2(hit.y - ly, hit.x - lx);
      if (s0.f > 0){
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        var gl = ctx.createLinearGradient(lx, ly, hit.x, hit.y); gl.addColorStop(0, qa(col, vis ? 0.55 * s0.f + 0.1 : 0.25)); gl.addColorStop(1, qa(col, vis ? 0.25 * s0.f + 0.05 : 0.12));
        var px = -Math.sin(ang), py = Math.cos(ang);
        ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(lx + px * 12, ly + py * 12); ctx.lineTo(hit.x + px * 30, hit.y + py * 30 * 1.3); ctx.lineTo(hit.x - px * 30, hit.y - py * 30 * 1.3); ctx.lineTo(lx - px * 12, ly - py * 12); ctx.closePath(); ctx.fill();
        qglow(ctx, hit.x + 4, hit.y, 34, col, 0.45 * s0.f + 0.1);
        /* photons */
        ctx.strokeStyle = qa(col, 0.95); ctx.lineWidth = 1.6;
        ph.forEach(function(q){
          var bx = lx + (hit.x - lx) * q.s + px * q.o * 30 * q.s, by = ly + (hit.y - ly) * q.s + py * q.o * 30 * q.s;
          ctx.beginPath(); for (var j = 0; j <= 16; j++){ var u = (j - 8) * 1.3, w = Math.sin(j / 16 * TAU * 2.5) * 4 * Math.exp(-Math.pow((j - 8) / 5, 2)); var X = bx + Math.cos(ang) * u - Math.sin(ang) * w, Y = by + Math.sin(ang) * u + Math.cos(ang) * w; if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke();
        });
        ctx.restore();
      }
      /* boîtier de la lampe */
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang);
      var gh = ctx.createLinearGradient(0, -18, 0, 18); gh.addColorStop(0, "#5c677a"); gh.addColorStop(0.45, "#2f3747"); gh.addColorStop(1, "#151a24");
      ctx.fillStyle = gh; qrr(ctx, -46, -17, 52, 34, 7); ctx.fill();
      ctx.fillStyle = qa(col, 0.35 + 0.6 * s0.f); ctx.beginPath(); ctx.ellipse(6, 0, 5, 14, 0, 0, TAU); ctx.fill();
      ctx.restore();
      /* électrons */
      el.forEach(function(e){ var X = xc + (xa - xc) * e.x, Y = cy + e.y * hc; qglow(ctx, X, Y, 7, "#7fd4ff", 0.6); qball(ctx, X, Y, 2.4, "#7fd4ff"); });
      /* verre : reflets */
      ctx.save(); qrr(ctx, cx - Lb, cy - Rb, 2 * Lb, 2 * Rb, Rb); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(190,215,255,.55)"; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - Lb * 0.55, cy - Rb * 0.78); ctx.lineTo(cx + Lb * 0.5, cy - Rb * 0.78); ctx.stroke(); ctx.restore();
      /* fils, générateur et microampèremètre */
      var gx0 = W * 0.04, gy0 = H * 0.71, gw = W * (phone ? 0.42 : 0.36), gh2 = H * 0.24;
      var mxc = W * (phone ? 0.8 : 0.82), myc = H * 0.83, mr = Math.min(H * 0.13, W * 0.13);
      ctx.save(); ctx.lineWidth = 2.4; ctx.lineJoin = "round";
      ctx.strokeStyle = "#e0533d"; ctx.beginPath(); ctx.moveTo(xc - 12, cy + hc); ctx.lineTo(xc - 12, cy + Rb + 8); ctx.lineTo(gx0 + gw * 0.82, cy + Rb + 8); ctx.lineTo(gx0 + gw * 0.82, gy0); ctx.stroke();
      ctx.strokeStyle = "#3d7be0"; ctx.beginPath(); ctx.moveTo(xa, cy + hc * 0.9); ctx.lineTo(xa, cy + Rb + 18); ctx.lineTo(mxc, cy + Rb + 18); ctx.lineTo(mxc, myc - mr); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mxc - mr, myc + mr * 0.5); ctx.lineTo(gx0 + gw, myc + mr * 0.5); ctx.stroke();
      ctx.restore();
      /* générateur */
      ctx.save(); var gg2 = ctx.createLinearGradient(0, gy0, 0, gy0 + gh2); gg2.addColorStop(0, "#3a4458"); gg2.addColorStop(1, "#1b2130");
      ctx.fillStyle = gg2; qrr(ctx, gx0, gy0, gw, gh2, 8); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.stroke();
      ctx.fillStyle = "#0e1a10"; qrr(ctx, gx0 + 8, gy0 + 8, gw * 0.58, gh2 * 0.5, 5); ctx.fill(); ctx.restore();
      qT(S, c, (uS.value >= 0 ? "" : "−") + qN(Math.abs(uS.value), 2).replace("−", "") + " V", gx0 + 8 + gw * 0.29, gy0 + 8 + gh2 * 0.25 + 1, {size:qfz(c, phone ? 13 : 15), color:"#7dff9a", mono:true});
      qT(S, c, uS.value >= 0 ? "freinage" : "accélération", gx0 + 8 + gw * 0.29, gy0 + gh2 * 0.78, {size:qfz(c, 10.5), color:"#c7d3ea", weight:700});
      var kx = gx0 + gw * 0.82, ky = gy0 + gh2 * 0.5, kr = Math.min(gh2 * 0.3, 20); knob = {x:kx, y:ky, r:kr};
      qball(ctx, kx, ky, kr, "#8d97a8"); var ka = -PI * 0.75 + (uS.value + 2) / 9 * PI * 1.5;
      ctx.save(); ctx.strokeStyle = "#111822"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + Math.sin(ka) * kr * 0.8, ky - Math.cos(ka) * kr * 0.8); ctx.stroke(); ctx.restore();
      /* microampèremètre à aiguille */
      ctx.save(); var gm = ctx.createRadialGradient(mxc - mr * 0.3, myc - mr * 0.3, 2, mxc, myc, mr * 1.1); gm.addColorStop(0, "#fbfcfe"); gm.addColorStop(1, "#c9d0dc");
      ctx.fillStyle = "#2a3242"; ctx.beginPath(); ctx.arc(mxc, myc, mr + 5, 0, TAU); ctx.fill(); ctx.fillStyle = gm; ctx.beginPath(); ctx.arc(mxc, myc, mr, 0, TAU); ctx.fill();
      var Imax = 50e-9, a0 = -PI * 0.8, a1 = -PI * 0.2;
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1;
      for (i = 0; i <= 5; i++){ var aa = a0 + (a1 - a0) * i / 5; ctx.beginPath(); ctx.moveTo(mxc + Math.cos(aa) * mr * 0.72, myc + Math.sin(aa) * mr * 0.72); ctx.lineTo(mxc + Math.cos(aa) * mr * 0.88, myc + Math.sin(aa) * mr * 0.88); ctx.stroke(); }
      var an = a0 + (a1 - a0) * Math.min(1.04, s0.I / Imax);
      ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mxc, myc + mr * 0.1); ctx.lineTo(mxc + Math.cos(an) * mr * 0.85, myc + Math.sin(an) * mr * 0.85); ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(mxc, myc + mr * 0.1, 3, 0, TAU); ctx.fill(); ctx.restore();
      qT(S, c, qN(s0.I * 1e9, 1) + " nA", mxc, myc + mr * 0.48, {size:qfz(c, 11.5), color:"#13233a", mono:true});
      /* bande de couleurs sous la lampe */
      var sx0 = 12, sx1 = W * (phone ? 0.4 : 0.32), sy0 = 24, sy1 = sy0 + 12; strip = {x0:sx0, x1:sx1, y0:sy0, y1:sy1};
      var NBd = (PE_L1 - PE_L0) / 5; for (i = 0; i < NBd; i++){ var lw = PE_L0 + i * 5; ctx.fillStyle = lw < 380 ? (i % 2 ? "#6a4bc9" : "#8466e0") : qa(qwl(lw), 1); ctx.fillRect(sx0 + (sx1 - sx0) * i / NBd, sy0, (sx1 - sx0) / NBd + 0.6, sy1 - sy0); }
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.strokeRect(sx0 + 0.5, sy0 + 0.5, sx1 - sx0 - 1, sy1 - sy0 - 1);
      var mk = sx0 + (s0.lam - PE_L0) / (PE_L1 - PE_L0) * (sx1 - sx0);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(mk, sy1 + 1); ctx.lineTo(mk - 5, sy1 + 8); ctx.lineTo(mk + 5, sy1 + 8); ctx.closePath(); ctx.fill();
      qT(S, c, "UV", sx0 + (380 - PE_L0) / (PE_L1 - PE_L0) * (sx1 - sx0) * 0.5, sy0 - 8, {size:qfz(c, 10), color:"#b9a6ff"});
      qT(S, c, qN(s0.lam, 0) + " nm", Math.max(sx0 + 22, Math.min(sx1 - 22, mk)), sy1 + 17, {size:qfz(c, 11), color:"#eef3fb"});
      /* étiquettes */
      qtag(S, c, "cathode (" + metS.value + ")", cx - Lb - 4, cy - Rb * 0.45, {size:11, align:"right"});
      qtag(S, c, "anode", cx + Lb + 4, cy - Rb * 0.45, {size:11, align:phone ? "right" : "left"});
      if (!vis) qtag(S, c, "UV : invisible à l'œil", lx + 40, ly + 4, {size:10.5, color:"#d9ccff", align:"left"});
      if (s0.T <= 0 && s0.f > 0) qtag(S, c, "hν < W : aucun électron ne sort", cx, cy + Rb + 34, {size:11.5, color:"#ffd34d"});
      if (sweep && sweep.phase === 0) qtag(S, c, "mesure : U monte jusqu'à l'arrêt du courant", cx, cy + Rb + 34, {size:11, color:"#7dff9a"});

      /* ---- graphe T_max(ν) ---- */
      g.clear();
      var gx = g.ctx, BW = phone ? 0 : 92;
      var ax = S.draw.axes(g, {x0:0, x1:21, y0:0, y1:7, xl:"ν (10¹⁴ Hz)", yl:"eU₀ = T_max (eV)", l:44, b:32, t:26, r:14 + BW, stepX:phone ? 5 : 2, stepY:1});
      /* droites ajustées par métal (moindres carrés sur les points au-dessus du seuil) */
      var fits = {};
      Object.keys(PE_MET).forEach(function(m){
        var q = pts.filter(function(p){ return p.m === m && !p.off; });
        if (q.length < 2) return;
        var n = q.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
        q.forEach(function(p){ var x = p.nu / 1e14; sx += x; sy += p.T; sxx += x * x; sxy += x * p.T; });
        var den = n * sxx - sx * sx; if (Math.abs(den) < 1e-12) return;
        var a = (n * sxy - sx * sy) / den, b = (sy - a * sx) / n; fits[m] = {a:a, b:b};
        var x0 = -b / a;
        gx.save(); gx.beginPath(); gx.moveTo(ax.X(Math.max(0, x0)), ax.Y(Math.max(0, a * Math.max(0, x0) + b))); gx.lineTo(ax.X(21), ax.Y(a * 21 + b));
        gx.strokeStyle = qshade(PE_MET[m].col, -0.35); gx.lineWidth = 2; gx.stroke();
        gx.setLineDash([4, 4]); gx.beginPath(); gx.moveTo(ax.X(x0), ax.Y(0)); gx.lineTo(ax.X(0), ax.Y(b)); gx.stroke(); gx.restore();
        S.draw.dot(g, ax.X(x0), ax.Y(0), 4.5, "#c0321d");
      });
      pts.forEach(function(p){
        var X = ax.X(p.nu / 1e14), Y = ax.Y(p.T), cc = qshade(PE_MET[p.m].col, -0.3);
        gx.save(); gx.beginPath(); gx.arc(X, Y, 5, 0, TAU); gx.fillStyle = p.off ? "#fff" : cc; gx.fill(); gx.lineWidth = 1.6; gx.strokeStyle = qshade(PE_MET[p.m].col, -0.6); gx.stroke(); gx.restore();
      });
      /* position actuelle */
      var Xc = ax.X(s0.nu / 1e14); S.draw.line(g, Xc, ax.T, Xc, ax.B, qa(col, 0.9), 1.5, [3, 3]);
      var f0 = fits[metS.value];
      if (f0){
        var hm = f0.a / 1e14 * QE, nu0 = -f0.b / f0.a;
        qT(S, g, "pente = " + qsci(hm, 3) + " J·s", ax.R - 6, ax.T + 12, {size:qfz(g, 11.5), color:"#13233a", align:"right", halo:true});
        qT(S, g, "ν₀ = " + qN(nu0, 2) + "·10¹⁴ Hz", ax.R - 6, ax.T + 28, {size:qfz(g, 11.5), color:"#c0321d", align:"right", halo:true});
      } else qT(S, g, "mesure U₀ pour 2 couleurs au moins", ax.R - 6, ax.T + 12, {size:qfz(g, 11.5), color:"#5f6b7a", align:"right", halo:true});
      /* bilan d'énergie (barre) */
      if (BW){
        var bx = g.W - BW + 10, bw = 30, by0 = ax.B, sc = (ax.B - ax.T) / 9;
        var hE = s0.E * sc, hW = Math.min(s0.E, s0.M.W) * sc;
        gx.save(); gx.fillStyle = qa(col, 0.9); qrr(gx, bx, by0 - Math.min(hE, ax.B - ax.T), bw, Math.min(hE, ax.B - ax.T), 4); gx.fill();
        gx.fillStyle = "#8a95a3"; gx.fillRect(bx + bw + 6, by0 - s0.M.W * sc, bw, s0.M.W * sc);
        if (s0.T > 0){ gx.fillStyle = "#2e9e6a"; gx.fillRect(bx + bw + 6, by0 - Math.min(s0.E * sc, ax.B - ax.T), bw, s0.T * sc); }
        gx.restore();
        qT(S, g, "hν", bx + bw / 2, by0 + 10, {size:11, color:"#13233a"});
        qT(S, g, "W", bx + bw * 1.5 + 6, by0 + 10, {size:11, color:"#5f6b7a"});
        if (s0.T > 0) qT(S, g, "T", bx + bw * 1.5 + 6, by0 - s0.M.W * sc - Math.min(s0.T * sc, ax.B - ax.T - s0.M.W * sc) / 2, {size:11, color:"#fff"});
      }
      /* ---- afficheurs ---- */
      ro.set(0, qN(s0.E, 2) + " eV");
      ro.set(1, qN(s0.nu / 1e14, 2) + "·10<sup>14</sup> Hz");
      ro.set(2, s0.T > 0 ? qN(s0.T, 2) + " eV" : "aucun électron");
      ro.set(3, s0.T > 0 ? qN(s0.T, 2) + " V" : "—");
      ro.set(4, qN(s0.I * 1e9, 1) + " nA");
      var lam0 = HC_EVNM / s0.M.W;
      nt.set("Seuil du " + s0.M.nom + " : λ₀ = hc/W = " + qN(lam0, 0) + " nm (ν₀ = " + qN(CL / (lam0 * 1e-9) / 1e14, 2) + "·10¹⁴ Hz). " +
        (s0.T > 0 ? (uS.value >= s0.T ? "U ≥ U₀ : même les électrons les plus rapides rebroussent chemin, I = 0." : uS.value > 0 ? "Les électrons dont T < eU rebroussent chemin : le courant baisse." : "Tous les électrons émis atteignent l'anode : courant de saturation, proportionnel à l'intensité.")
          : "Augmenter l'intensité n'y change rien : chaque photon a trop peu d'énergie.") +
        " Modèle simplifié : rendement quantique exagéré (10 %), énergies des électrons supposées uniformes de 0 à T_max, " + qN(PE_P * 1e6, 0) + " µW au maximum sur la cathode.", s0.T > 0 ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   3. Paquet d'ondes contre une barrière : effet tunnel (pq05)
   ===================================================================== */
var TU_HB = 0.6582119569, TU_K = 0.0380998;   /* ħ en eV·fs, ħ²/2mₑ en eV·nm² */
/* transmission |T|² d'une onde plane d'énergie E (eV) sur une barrière V₀ (eV), largeur a (nm) */
function tuT(E, V0, a){
  if (E <= 0) return 0;
  if (V0 === 0) return 1;
  if (Math.abs(E - V0) < 1e-9) return 1 / (1 + V0 * a * a / (4 * TU_K));
  if (E < V0){ var kap = Math.sqrt((V0 - E) / TU_K), sh = Math.sinh(kap * a); return 1 / (1 + V0 * V0 * sh * sh / (4 * E * (V0 - E))); }
  var q = Math.sqrt((E - V0) / TU_K), sn = Math.sin(q * a); return 1 / (1 + V0 * V0 * sn * sn / (4 * E * (E - V0)));
}
/* nombres complexes [re, im] */
function cm(a, b){ return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
function cdv(a, b){ var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
function cex(z){ var e = Math.exp(z[0]); return [e * Math.cos(z[1]), e * Math.sin(z[1])]; }
/* état stationnaire : e^{ikx} + r e^{-ikx} (x < 0), C e^{iqx} + D e^{-iqx} (0 < x < a), t e^{ikx} (x > a) */
function tuStat(E, V0, a){
  var k = Math.sqrt(E / TU_K), dE = E - V0; if (Math.abs(dE) < 1e-7) dE = 1e-7;
  var q = dE > 0 ? [Math.sqrt(dE / TU_K), 0] : [0, Math.sqrt(-dE / TU_K)];
  var kq = cdv([k, 0], q), iqa = cm([0, 1], [q[0] * a, q[1] * a]);
  var eP = cex([-iqa[0], -iqa[1]]), eM = cex(iqa), eka = cex([0, k * a]);
  /* C = t e^{ika}(1 + k/q)e^{-iqa}/2 ; D = t e^{ika}(1 − k/q)e^{iqa}/2 (par unité de t) */
  var C1 = cm(cm(eka, [(1 + kq[0]) / 2, kq[1] / 2]), eP), D1 = cm(cm(eka, [(1 - kq[0]) / 2, -kq[1] / 2]), eM);
  var qk = cdv(q, [k, 0]);
  /* 2 = (C + D) + (q/k)(C − D) */
  var S1 = [C1[0] + D1[0], C1[1] + D1[1]], Df = cm(qk, [C1[0] - D1[0], C1[1] - D1[1]]);
  var t = cdv([2, 0], [S1[0] + Df[0], S1[1] + Df[1]]);
  var C = cm(C1, t), D = cm(D1, t), r = [C[0] + D[0] - 1, C[1] + D[1]];
  return {k:k, q:q, r:r, t:t, C:C, D:D, a:a};
}
function tuPsiStat(s, x){
  if (x < 0){ var e1 = cex([0, s.k * x]), e2 = cex([0, -s.k * x]), re = cm(s.r, e2); return [e1[0] + re[0], e1[1] + re[1]]; }
  if (x > s.a){ return cm(s.t, cex([0, s.k * x])); }
  var iq = cm([0, 1], [s.q[0] * x, s.q[1] * x]), A = cm(s.C, cex(iq)), B = cm(s.D, cex([-iq[0], -iq[1]]));
  return [A[0] + B[0], A[1] + B[1]];
}

SFA.sim({
  id:"pq-barriere-tunnel", ch:"pq05", tag:"Effet tunnel",
  titre:"Un paquet d'ondes contre une barrière : réflexion et effet tunnel",
  resume:"Un électron, décrit par un paquet d'ondes, se coupe en une partie réfléchie et une partie transmise, même quand son énergie est inférieure à la barrière.",
  but:"Règle l'énergie E de l'électron, la hauteur V₀ et la largeur a de la barrière (tu peux aussi attraper le haut de la barrière). Le paquet se coupe en deux : compare la part transmise mesurée à |T|². Passe en état stationnaire pour voir la décroissance dans la barrière. Glisse ailleurs pour tourner la vue.",
  aRetenir:"Pour E < V₀, ψ décroît comme e^(−κx) dans la barrière, avec κ = √(2m(V₀ − E))/ħ : la transmission chute très vite avec la largeur.",
  piege:"Au-dessus de la barrière (E > V₀), l'électron peut quand même être réfléchi ; la transmission n'atteint 1 qu'aux résonances.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 360), g = k.canvas(phone ? 200 : 210);
    var eS = k.slider("Énergie de l'électron E", 0.05, 1.2, 0.01, 0.3, "eV", function(){ reset(); });
    var vS = k.slider("Hauteur de la barrière V₀", 0, 1, 0.01, 0.5, "eV", function(){ reset(); });
    var aS = k.slider("Largeur de la barrière a", 0.1, 2, 0.05, 0.6, "nm", function(){ reset(); });
    var mS = k.seg("Affichage", [["paquet", "Paquet d'ondes"], ["stat", "État stationnaire"]], "paquet", function(){ reset(); });
    k.button("Relancer le paquet", function(){ reset(); });
    var ro = k.readouts(["|T|² (onde d'énergie E)", "|R|² = 1 − |T|²", "Part transmise prévue (paquet)", "Part transmise mesurée", "Pénétration 1/κ"]);
    var nt = k.note("", "ok");
    /* grille : x de 0 à 120 nm, barrière à partir de XB */
    var N = 2400, DX = 0.05, XB = 60, X0 = 42, SIG = 3, DT = 0.08;
    var re = new Float64Array(N), im = new Float64Array(N), V = new Float64Array(N);
    var cpR = new Float64Array(N), cpI = new Float64Array(N), ivR = new Float64Array(N), ivI = new Float64Array(N), dR = new Float64Array(N), dI = new Float64Array(N);
    var tfs = 0, done = false, Tmes = null, Tpaq = 0, fade = 0;
    function setup(){
      var E = eS.value, V0 = vS.value, a = aS.value, k0 = Math.sqrt(E / TU_K), nrm = Math.pow(2 * PI * SIG * SIG, -0.25), j;
      for (j = 0; j < N; j++){
        var x = j * DX; V[j] = x >= XB && x < XB + a ? V0 : 0;
        var env = nrm * Math.exp(-Math.pow(x - X0, 2) / (4 * SIG * SIG)); re[j] = env * Math.cos(k0 * x); im[j] = env * Math.sin(k0 * x);
      }
      re[0] = im[0] = re[N - 1] = im[N - 1] = 0;
      /* Crank-Nicolson : (1 + iβH) ψⁿ⁺¹ = (1 − iβH) ψⁿ, β = Δt/2ħ ; H tridiagonale (diag 2α + V, hors-diag −α) */
      var al = TU_K / (DX * DX), be = DT / (2 * TU_HB), aI = -be * al; /* a = c = i·aI */
      var pR = 0, pI = 0;
      for (j = 0; j < N; j++){
        var gR = 1, gI = be * (2 * al + V[j]);
        if (j > 0){ /* diag − a·c'ⱼ₋₁ */ var mr = -aI * cpI[j - 1] * -1, mi = aI * cpR[j - 1]; /* a·c' = i aI (cpR + i cpI) = −aI cpI + i aI cpR */
          gR -= -aI * cpI[j - 1]; gI -= aI * cpR[j - 1]; }
        var dd = gR * gR + gI * gI; ivR[j] = gR / dd; ivI[j] = -gI / dd;
        /* c'ⱼ = c · inv = i aI (ivR + i ivI) */
        cpR[j] = -aI * ivI[j]; cpI[j] = aI * ivR[j];
      }
      TU.al = al; TU.be = be; TU.aI = aI;
      /* part transmise prévue pour le paquet : moyenne de |T(k)|² sur |φ(k)|² (gaussienne d'écart-type 1/2σ) */
      var sk = 1 / (2 * SIG), sw = 0, st = 0;
      for (j = -300; j <= 300; j++){ var kk = k0 + j / 300 * 5 * sk; if (kk <= 0) continue; var w = Math.exp(-Math.pow(kk - k0, 2) / (2 * sk * sk)); sw += w; st += w * tuT(TU_K * kk * kk, V0, a); }
      Tpaq = st / sw;
    }
    var TU = {};
    function step(){
      var al = TU.al, be = TU.be, aI = TU.aI, j;
      /* second membre b = (1 − iβH)ψ = ψ − iβ[(2α+V)ψ − α(ψⱼ₋₁ + ψⱼ₊₁)] */
      for (j = 0; j < N; j++){
        var hR = (2 * al + V[j]) * re[j] - al * ((j ? re[j - 1] : 0) + (j < N - 1 ? re[j + 1] : 0));
        var hI = (2 * al + V[j]) * im[j] - al * ((j ? im[j - 1] : 0) + (j < N - 1 ? im[j + 1] : 0));
        var bR = re[j] + be * hI, bI = im[j] - be * hR;
        /* d'ⱼ = (b − a d'ⱼ₋₁)·inv ; a·d' = i aI (dR + i dI) = −aI dI + i aI dR */
        if (j){ bR -= -aI * dI[j - 1]; bI -= aI * dR[j - 1]; }
        dR[j] = bR * ivR[j] - bI * ivI[j]; dI[j] = bR * ivI[j] + bI * ivR[j];
      }
      re[N - 1] = dR[N - 1]; im[N - 1] = dI[N - 1];
      for (j = N - 2; j >= 0; j--){ var nr = re[j + 1], ni = im[j + 1]; re[j] = dR[j] - (cpR[j] * nr - cpI[j] * ni); im[j] = dI[j] - (cpR[j] * ni + cpI[j] * nr); }
      tfs += DT;
    }
    function probs(){
      var L = 0, R = 0, M = 0, eL = 0, eR = 0, a = aS.value, j;
      for (j = 0; j < N; j++){ var p = (re[j] * re[j] + im[j] * im[j]) * DX, x = j * DX;
        if (x < XB) L += p; else if (x >= XB + a) R += p;
        if (x > XB - 14 && x < XB + a + 14) M += p;
        if (x < 10) eL += p; if (x > N * DX - 10) eR += p; }
      return {L:L, R:R, M:M, e:eL + eR};
    }
    function reset(){ tfs = 0; done = false; Tmes = null; fade = 0; setup(); k.redraw(); }
    setup();
    /* vue 3D légère : x le long de l'écran, énergie vers le haut, Im ψ en profondeur */
    var v = new Q3(); v.a = 0.32; v.b = 0.3; v.f = 22; v.set();
    var grab = null, GB = null;
    qorbit(c, v, k, [-0.15, 0.9, -0.8, 0.8], function(type, p){ if (GB && Math.abs(p.x - GB.x) < GB.w + 12 && Math.abs(p.y - GB.y) < 16){ grab = {y:p.y, v0:vS.value}; return false; } });
    c.pointer(function(type, p){
      if (type === "drag" && grab){ vS.set(Math.round(Math.max(0, Math.min(1, grab.v0 + (grab.y - p.y) / GB.k)) * 100) / 100); reset(); }
      if (type === "move"){ c.cv.style.cursor = GB && Math.abs(p.x - GB.x) < GB.w + 12 && Math.abs(p.y - GB.y) < 16 ? "ns-resize" : "grab"; }
      if (type === "up") grab = null;
    });
    var tAnim = 0;
    var lp = k.loop(function(dt){
      tAnim += dt;
      if (mS.value === "paquet"){
        var E = eS.value, vg = 2 * TU_K * Math.sqrt(E / TU_K) / TU_HB; /* nm/fs */
        var n = Math.max(1, Math.min(34, Math.round(10 * dt / (vg * DT))));
        if (fade > 0){ fade += dt; if (fade > 0.8){ var keep = Tmes; reset(); Tmes = keep; } }
        else { for (var i = 0; i < n; i++) step();
          var P = probs();
          if (!done && tfs > 15 && P.M < 0.004){ done = true; Tmes = P.R / (P.L + P.R); }
          if (P.e > 0.003 || tfs > 1500){ if (!done){ done = true; Tmes = P.R / (P.L + P.R); } fade = 0.0001; } }
      }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, E = eS.value, V0 = vS.value, a = aS.value, i;
      qlab(ctx, W, H, "#18223a", "#070b16");
      var xa = 28, xb = 96, Emax = Math.max(0.7, V0, E) * 1.3;
      function WX(x){ return (x - (xa + xb) / 2) / (xb - xa) * 8.4; }
      function WY(e){ return -1.3 + e / Emax * 3.1; }
      v.sc = Math.min(W / 9.0, H / 3.3); v.cx = W * 0.5; v.cy = H * 0.5; v.clear();
      /* sol quadrillé */
      v.box(WX(xa), WY(0) - 0.08, -1.1, WX(xb), WY(0), 1.1, "#24314d");
      /* barrière : bloc de verre de hauteur V₀ */
      var b0 = WX(XB), b1 = WX(XB + a);
      if (V0 > 0) v.box(b0, WY(0), -1.0, b1, WY(V0), 1.0, "#e0662a", {alpha:0.55, line:"rgba(255,190,140,.8)"});
      v.render(ctx);
      /* grille du sol */
      ctx.save(); ctx.strokeStyle = "rgba(150,180,230,.16)"; ctx.lineWidth = 1;
      for (var gx2 = xa; gx2 <= xb; gx2 += 5){ var p1 = v.p(WX(gx2), WY(0), -1.1), p2 = v.p(WX(gx2), WY(0), 1.1); ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
      ctx.restore();
      /* niveau d'énergie E */
      var e0 = v.p(WX(xa), WY(E), 0), e1 = v.p(WX(xb), WY(E), 0);
      S.draw.line(c, e0.x, e0.y, e1.x, e1.y, "rgba(255,220,120,.55)", 1.2, [6, 5]);
      /* ψ : hélice (Re vers le haut, Im en profondeur) et |ψ|² */
      var stat = mS.value === "stat", sst = stat ? tuStat(E, V0, a) : null, ph = -E / TU_HB * tAnim * 0.9;
      var amp = stat ? 0.45 : 1.75, j0 = Math.round(xa / DX), j1 = Math.round(xb / DX), stp = phone ? 3 : 2;
      var cosP = Math.cos(ph), sinP = Math.sin(ph), col = [], dens = [];
      ctx.save(); ctx.globalAlpha = fade > 0 ? Math.max(0, 1 - fade / 0.8) : 1;
      /* densité |ψ|² : surface remplie au-dessus du niveau E */
      ctx.beginPath();
      for (i = j0; i <= j1; i += stp){
        var x = i * DX, pr, pi_;
        if (stat){ var z = tuPsiStat(sst, x - XB); pr = z[0] * cosP - z[1] * sinP; pi_ = z[0] * sinP + z[1] * cosP; }
        else { pr = re[i]; pi_ = im[i]; }
        col.push([x, pr, pi_]);
        var d = (pr * pr + pi_ * pi_) * (stat ? 0.25 : 6.5); dens.push(d);
        var q = v.p(WX(x), WY(E) + d * 1.0, -1.0);
        if (i === j0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      }
      var qe = v.p(WX(xb), WY(E), -1.0), qs = v.p(WX(xa), WY(E), -1.0); ctx.lineTo(qe.x, qe.y); ctx.lineTo(qs.x, qs.y); ctx.closePath();
      var gd = ctx.createLinearGradient(0, qs.y - 80, 0, qs.y); gd.addColorStop(0, "rgba(90,200,255,.55)"); gd.addColorStop(1, "rgba(90,200,255,.08)");
      ctx.fillStyle = gd; ctx.fill(); ctx.strokeStyle = "rgba(140,220,255,.9)"; ctx.lineWidth = 1.4; ctx.stroke();
      /* rayons colorés selon la phase, puis l'hélice */
      for (i = 0; i < col.length; i += 2){
        var cc = col[i], mag = Math.hypot(cc[1], cc[2]); if (mag * amp < 0.02) continue;
        var hue = (Math.atan2(cc[2], cc[1]) / TAU * 360 + 360) % 360, a0 = v.p(WX(cc[0]), WY(E), 0), a1 = v.p(WX(cc[0]), WY(E) + cc[1] * amp, cc[2] * amp);
        ctx.strokeStyle = "hsla(" + hue.toFixed(0) + ",85%,62%,.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(a1.x, a1.y); ctx.stroke();
      }
      ctx.beginPath();
      for (i = 0; i < col.length; i++){ var q2 = v.p(WX(col[i][0]), WY(E) + col[i][1] * amp, col[i][2] * amp); if (i) ctx.lineTo(q2.x, q2.y); else ctx.moveTo(q2.x, q2.y); }
      ctx.strokeStyle = "#f2f6ff"; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.restore();
      /* poignée de la barrière */
      var top = v.p((b0 + b1) / 2, WY(V0), 1.0), top2 = v.p((b0 + b1) / 2, WY(V0) + 0.1, 1.0);
      GB = {x:top.x, y:top.y, w:Math.max(10, Math.abs(v.p(b1, WY(V0), 1).x - v.p(b0, WY(V0), 1).x) / 2), k:Math.abs(top.y - v.p((b0 + b1) / 2, WY(V0 + 0.1), 1.0).y) * 10};
      ctx.save(); ctx.fillStyle = "#ffd0a8"; ctx.strokeStyle = "#8a3b12"; ctx.lineWidth = 1.2; qrr(ctx, top.x - 14, top.y - 5, 28, 10, 5); ctx.fill(); ctx.stroke(); ctx.restore();
      /* étiquettes */
      qtag(S, c, "V₀ = " + qN(V0, 2) + " eV", top.x, top.y - 20, {size:11, color:"#ffcfae"});
      qtag(S, c, "E = " + qN(E, 2) + " eV", e0.x + 4, e0.y - 14, {size:11, color:"#ffe08a", align:"left"});
      if (!stat){
        var P = probs();
        if (tfs > 20){
          var pl = v.p(WX(XB - 20), WY(0) - 0.08, 1.1), pr2 = v.p(WX(XB + a + 20), WY(0) - 0.08, 1.1);
          qtag(S, c, "réfléchi " + qN(P.L * 100, 0) + " %", pl.x, pl.y + 16, {size:11, color:"#9fd8ff"});
          qtag(S, c, "transmis " + qN(P.R * 100, 1) + " %", pr2.x, pr2.y + 16, {size:11, color:"#9fd8ff"});
        }
        qT(S, c, "t = " + qN(tfs, 0) + " fs", 10, 14, {size:qfz(c, 11.5), color:"#c7d3ea", align:"left", mono:true});
      } else qT(S, c, "ψ(x)·e^(−iEt/ħ) : seule la phase tourne", 10, 14, {size:qfz(c, 11), color:"#c7d3ea", align:"left"});
      qT(S, c, "glisse pour tourner", W - 10, 14, {size:qfz(c, 11), color:"rgba(210,222,240,.7)", align:"right", weight:600});
      /* barre d'échelle : 5 nm */
      var s0p = v.p(WX(xa + 2), WY(0) - 0.08, 1.1), s1p = v.p(WX(xa + 7), WY(0) - 0.08, 1.1);
      ctx.save(); ctx.strokeStyle = "#e9eef8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s0p.x, s0p.y + 12); ctx.lineTo(s1p.x, s1p.y + 12); ctx.stroke(); ctx.restore();
      qT(S, c, "5 nm", (s0p.x + s1p.x) / 2, s0p.y + 24, {size:qfz(c, 10.5), color:"#e9eef8"});

      /* ---- |T|²(E) ---- */
      g.clear();
      var Ex = Math.max(1.2, 2.2 * V0);
      var ax = S.draw.axes(g, {x0:0, x1:Ex, y0:0, y1:1.05, xl:"E (eV)", yl:"probabilité", l:42, b:30, t:12, r:12, stepY:0.25});
      var gx = g.ctx;
      gx.save(); gx.beginPath(); for (i = 0; i <= 400; i++){ var ee = Ex * Math.max(i, 0.5) / 400, tt = tuT(ee, V0, a); if (i) gx.lineTo(ax.X(ee), ax.Y(tt)); else gx.moveTo(ax.X(ee), ax.Y(tt)); }
      gx.strokeStyle = "#2f6fd6"; gx.lineWidth = 2.2; gx.stroke();
      gx.beginPath(); for (i = 0; i <= 400; i++){ var e2 = Ex * Math.max(i, 0.5) / 400, t2 = 1 - tuT(e2, V0, a); if (i) gx.lineTo(ax.X(e2), ax.Y(t2)); else gx.moveTo(ax.X(e2), ax.Y(t2)); }
      gx.strokeStyle = "#e0662a"; gx.lineWidth = 1.8; gx.setLineDash([5, 4]); gx.stroke(); gx.restore();
      if (V0 > 0){ S.draw.line(g, ax.X(V0), ax.T, ax.X(V0), ax.B, "#8a95a3", 1.2, [3, 3]); qT(S, g, "V₀", ax.X(V0) + 4, ax.T + (ax.X(V0) < ax.L + 90 ? 26 : 8), {size:11, color:"#5f6b7a", align:"left", halo:true}); }
      var T0 = tuT(E, V0, a);
      S.draw.dot(g, ax.X(E), ax.Y(T0), 5, "#13233a");
      qT(S, g, "— |T|² transmis", ax.R - 4, ax.Y(0.6), {size:qfz(g, 11.5), color:"#2f6fd6", align:"right", halo:true});
      qT(S, g, "- - |R|² réfléchi", ax.R - 4, ax.Y(0.45), {size:qfz(g, 11.5), color:"#e0662a", align:"right", halo:true});
      /* ---- afficheurs ---- */
      var eqV = V0 > 0 && Math.abs(E - V0) < 0.005;
      ro.set(0, qN(T0 * 100, T0 < 0.01 ? 3 : 1) + " %");
      ro.set(1, qN((1 - T0) * 100, 1) + " %");
      ro.set(2, stat ? "—" : qN(Tpaq * 100, 1) + " %");
      ro.set(3, stat ? "—" : Tmes == null ? "en cours…" : qN(Tmes * 100, 1) + " %");
      ro.set(4, eqV ? "infinie (κ = 0)" : E < V0 ? qN(1 / Math.sqrt((V0 - E) / TU_K), 3) + " nm" : "pas de décroissance");
      var msg = eqV ? "E = V₀ : cas limite, ψ n'oscille plus et ne décroît pas dans la barrière : elle y varie en ligne droite. |T|² = 1/(1 + V₀a²·m/(2ħ²)) = " + qN(T0 * 100, 1) + " %." :
        E < V0 ? "E < V₀ : classiquement, l'électron rebondirait toujours. Ici une part traverse : κa = " + qN(Math.sqrt((V0 - E) / TU_K) * a, 2) + "." :
        V0 === 0 ? "V₀ = 0 : pas de barrière, tout passe." :
        "E > V₀ : classiquement, tout passerait. Ici une part est réfléchie, sauf aux résonances (q·a = nπ).";
      nt.set(msg + (stat ? "" : " Le paquet contient plusieurs énergies autour de E : sa part transmise est la moyenne de |T|² sur ces énergies."), E < V0 || eqV ? "ok" : "warn");
    });
  }
});

/* =====================================================================
   4. Particule dans une boîte et points quantiques (pq05)
   ===================================================================== */
var BX_E1 = HP * HP / (8 * ME) / QE * 1e18;   /* h²/8mₑ en eV·nm² (0,376) */
var QD = {Eg:1.74, me:0.13, mh:0.45};          /* CdSe : gap (eV), masses effectives (en mₑ) */
function qdE(d){ return QD.Eg + BX_E1 / (d * d) * (1 / QD.me + 1 / QD.mh); }   /* modèle « boîte » : gap + confinement en 1/d² */

SFA.sim({
  id:"pq-boite-quantique", ch:"pq05", tag:"Quantification",
  titre:"Particule dans une boîte et points quantiques",
  resume:"L'onde ψ d'un électron enfermé entre deux murs ne peut former que certains modes, comme une corde de guitare : ses énergies valent n²E₁. Des cristaux plus petits émettent plus bleu.",
  but:"Choisis le niveau n (curseur ou clic sur l'échelle des niveaux) et la largeur a de la boîte ; glisse sur la scène pour la tourner. Active la superposition de deux niveaux pour voir la densité osciller. Dans l'onglet « points quantiques », clique une fiole et change la taille de son cristal.",
  aRetenir:"Les murs imposent ψ = 0 aux bords : λₙ = 2a/n et Eₙ = n²h²/(8ma²). Plus la boîte est petite, plus les niveaux sont écartés.",
  piege:"Le niveau le plus bas n'est pas d'énergie nulle : E₁ = h²/(8ma²) > 0, la particule ne peut pas être au repos.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 360 : 400);
    var tab = k.seg("Vue", [["boite", "Boîte à murs infinis"], ["qd", "Points quantiques"]], "boite", function(){ showCtl(); });
    var nS = k.slider("Niveau n", 1, 6, 1, 2, "");
    var aS = k.slider("Largeur de la boîte a", 0.5, 2, 0.05, 1, "nm");
    var supT = k.toggle("Superposition des niveaux n et n + 1", false);
    var dS = k.slider("Diamètre du cristal choisi d", 1.8, 8, 0.1, 2.9, "nm", function(v){ vials[sel] = v; });
    var ro = k.readouts(["E₁ = h²/(8ma²)", "Énergie Eₙ", "Longueur d'onde λₙ = 2a/n", "Photon émis n → n − 1"]);
    var nt = k.note("", "ok");
    var vials = [2.0, 2.4, 2.9, 3.6, 4.8, 7.0], sel = 2, hit = [], ladder = null;
    function showCtl(){
      var b = tab.value === "boite";
      [nS, aS].forEach(function(o){ o.el.parentNode.style.display = b ? "" : "none"; });
      supT.set(supT.value); var tg = c.cv.parentNode.parentNode.querySelectorAll ? null : null;
      dS.el.parentNode.style.display = b ? "none" : "";
      supEl.style.display = b ? "" : "none";
    }
    var supEl = k.ctrl.querySelectorAll(".ctl.tg"); supEl = supEl[supEl.length - 1];
    var v = new Q3(); v.a = 0.42; v.b = 0.42; v.f = 18; v.set();
    qorbit(c, v, k, [-0.1, 1.1, -1.2, 1.2], function(type, p){
      if (tab.value === "qd"){ for (var i = 0; i < hit.length; i++){ var h = hit[i]; if (p.x > h.x0 && p.x < h.x1 && p.y > h.y0 && p.y < h.y1){ sel = i; dS.set(vials[i]); k.redraw(); } } return false; }
      if (ladder && p.x > ladder.x0 && p.x < ladder.x1 && p.y > ladder.y0 - 10 && p.y < ladder.y1 + 10){
        var best = 1, bd = 1e9; ladder.ys.forEach(function(y, j){ if (Math.abs(p.y - y) < bd){ bd = Math.abs(p.y - y); best = j + 1; } }); nS.set(best); k.redraw(); return false;
      }
    });
    showCtl();
    var T = 0;
    var lp = k.loop(function(dt){ T += dt; if (!v.user && tab.value === "boite"){ v.a = 0.42 + 0.25 * Math.sin(T * 0.3); v.set(); } k.redraw(); });
    lp.play();
    function drawBox(){
      var ctx = c.ctx, W = c.W, H = c.H, n = nS.value, a = aS.value, sup = supT.value, i;
      qlab(ctx, W, H, "#1b2640", "#080c18");
      var ladW = phone ? 92 : 128, sw = W - ladW;
      var hw = 1.0 + 1.3 * a, NB = phone ? 60 : 90, depth = 0.75;
      v.sc = Math.min(sw / Math.max(phone ? 6.8 : 8.0, 2 * hw + 2.6), H / 4.2); v.cx = sw * 0.5 + 6; v.cy = H * 0.56; v.clear();
      var E1 = BX_E1 / (a * a);
      /* phase : ω ∝ n² (rapport réel des fréquences) ; densité de la superposition */
      var w0 = 1.3, p1 = -w0 * n * n * T, p2 = -w0 * (n + 1) * (n + 1) * T;
      function psi(x){ /* x ∈ [0, 1] ; renvoie [Re, Im] normalisés (max ≈ 1) */
        var s1 = Math.sin(n * PI * x);
        if (!sup) return [s1 * Math.cos(p1), s1 * Math.sin(p1)];
        var s2 = Math.sin((n + 1) * PI * x), r = 1 / Math.SQRT2;
        return [r * (s1 * Math.cos(p1) + s2 * Math.cos(p2)), r * (s1 * Math.sin(p1) + s2 * Math.sin(p2))];
      }
      /* sol, murs « infinis » */
      v.box(-hw - 0.5, -1.25, -depth - 0.25, hw + 0.5, -1.1, depth + 0.25, "#2c3a58");
      v.box(-hw - 0.32, -1.1, -depth - 0.2, -hw, 1.9, depth + 0.2, "#c8472c", {alpha:0.92});
      v.box(hw, -1.1, -depth - 0.2, hw + 0.32, 1.9, depth + 0.2, "#c8472c", {alpha:0.92});
      /* relief de |ψ|² */
      var dens = [], mx = 0;
      for (i = 0; i <= NB; i++){ var z = psi(i / NB), d = z[0] * z[0] + z[1] * z[1]; dens.push(d); mx = Math.max(mx, d); }
      var hs = 1.15 / (sup ? 2 : 1);
      for (i = 0; i < NB; i++){
        var x0 = -hw + 2 * hw * i / NB, x1 = -hw + 2 * hw * (i + 1) / NB, h0 = -1.1 + dens[i] * hs, h1 = -1.1 + dens[i + 1] * hs, dm = (dens[i] + dens[i + 1]) / 2 / (sup ? 2 : 1);
        var col = [Math.round(40 + 215 * Math.min(1, dm * 1.3)), Math.round(110 + 120 * Math.min(1, dm)), Math.round(230 - 150 * dm)];
        var hex = "#" + col.map(function(u){ return ("0" + Math.max(0, Math.min(255, u)).toString(16)).slice(-2); }).join("");
        v.face([[x0, h0, -depth], [x1, h1, -depth], [x1, h1, depth], [x0, h0, depth]], hex, {});
        v.face([[x0, -1.1, depth], [x1, -1.1, depth], [x1, h1, depth], [x0, h0, depth]], hex, {});
        v.face([[x0, -1.1, -depth], [x1, -1.1, -depth], [x1, h1, -depth], [x0, h0, -depth]], hex, {});
      }
      v.render(ctx);
      /* corde : Re ψ (vibre) */
      var yb = 1.0, A = 0.62 * (sup ? 1 : 1);
      ctx.save(); ctx.lineCap = "round";
      [["rgba(255,220,140,.25)", 7], ["#ffe6a8", 2.4]].forEach(function(st){
        ctx.strokeStyle = st[0]; ctx.lineWidth = st[1]; ctx.beginPath();
        for (var j = 0; j <= 120; j++){ var xx = j / 120, q = v.p(-hw + 2 * hw * xx, yb + A * psi(xx)[0], 0); if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
        ctx.stroke();
      });
      /* enveloppe ±|ψ| (pointillés) et nœuds */
      ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(255,230,168,.35)"; ctx.lineWidth = 1;
      [1, -1].forEach(function(sg){ ctx.beginPath(); for (var j = 0; j <= 80; j++){ var xx = j / 80, z = psi(xx), q = v.p(-hw + 2 * hw * xx, yb + sg * A * Math.hypot(z[0], z[1]), 0); if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); } ctx.stroke(); });
      ctx.setLineDash([]); ctx.restore();
      if (!sup) for (i = 1; i < n; i++){ var qn = v.p(-hw + 2 * hw * i / n, yb, 0); qball(ctx, qn.x, qn.y, 3.5, "#ff7a5c"); }
      /* étiquettes */
      var wl = v.p(-hw - 0.16, 1.95, 0), wr = v.p(hw + 0.16, 1.95, 0), fl = v.p(0, -1.25, depth + 0.25);
      qtag(S, c, "V = ∞", wl.x, wl.y - 12, {size:11, color:"#ffc2b0"}); qtag(S, c, "V = ∞", wr.x, wr.y - 12, {size:11, color:"#ffc2b0"});
      qtag(S, c, "a = " + qN(a, 2) + " nm", fl.x - (phone ? 40 : 30), fl.y + 14, {size:11});
      var sl = v.p(0, yb + A + 0.42, 0);
      qtag(S, c, sup ? "Re ψ (superposition)" : "Re ψ" + ["", "₁", "₂", "₃", "₄", "₅", "₆"][n] + " : la corde vibre", sl.x, sl.y, {size:11, color:"#ffe6a8"});
      qtag(S, c, "|ψ|² en relief", 8, H - 16, {size:11, color:"#bfe3ff", align:"left"});
      qT(S, c, "glisse pour tourner", 10, 14, {size:qfz(c, 11), color:"rgba(210,222,240,.7)", align:"left", weight:600});
      /* échelle des niveaux */
      var lx0 = W - ladW + 8, lx1 = W - 12, ly0 = 48, ly1 = H - 30, nTop = sup && n === 6 ? 7 : 6, Etop = Math.max(36, (sup ? (n + 1) * (n + 1) : 0)) * E1;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.05)"; qrr(ctx, lx0 - 4, ly0 - 26, lx1 - lx0 + 8, ly1 - ly0 + 44, 8); ctx.fill(); ctx.restore();
      qT(S, c, "Eₙ = n²E₁", (lx0 + lx1) / 2, ly0 - 14, {size:qfz(c, 11.5), color:"#eef3fb"});
      var ys = [];
      for (i = 1; i <= nTop; i++){
        var y = ly1 - (i * i * E1) / Etop * (ly1 - ly0), on = i === n || (sup && i === n + 1); ys.push(y);
        ctx.save(); ctx.strokeStyle = on ? "#ffd34d" : "rgba(200,215,240,.55)"; ctx.lineWidth = on ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(lx0 + 16, y); ctx.lineTo(lx1 - (phone ? 30 : 46), y); ctx.stroke(); ctx.restore();
        qT(S, c, String(i), lx0 + 6, y, {size:qfz(c, 11), color:on ? "#ffd34d" : "#c7d3ea"});
        if (i >= 3 || !phone) qT(S, c, qN(i * i * E1, i * i * E1 < 10 ? 2 : 1), lx1 - 2, y, {size:qfz(c, 10.5), color:on ? "#ffd34d" : "#9fb0c8", align:"right", mono:true});
      }
      qT(S, c, "eV", lx1 - 2, ly1 + 14, {size:qfz(c, 10), color:"#9fb0c8", align:"right"});
      ladder = {x0:lx0, x1:lx1, y0:ly0, y1:ly1, ys:ys};
      /* afficheurs */
      var En = n * n * E1, dE = (n * n - (n - 1) * (n - 1)) * E1;
      ro.set(0, qN(E1, 3) + " eV");
      ro.set(1, qN(En, 3) + " eV");
      ro.set(2, qN(2 * a / n, 3) + " nm");
      ro.set(3, n > 1 ? qN(HC_EVNM / dE, 0) + " nm" : "— (n = 1 : niveau le plus bas)");
      nt.set((sup ? "Superposition : |ψ|² oscille entre les deux moitiés de la boîte, à la fréquence (Eₙ₊₁ − Eₙ)/h. Un état stationnaire seul, lui, a une densité immobile. " : "ψₙ a " + (n - 1) + " nœud" + (n > 2 ? "s" : "") + " à l'intérieur ; |ψₙ|² ne bouge pas : seul le signe de la corde change. ") +
        "Électron : E₁ = h²/(8mₑa²) = " + qN(BX_E1, 3) + " eV·nm² / a².", "ok");
    }
    function drawQD(){
      var ctx = c.ctx, W = c.W, H = c.H, i;
      /* pièce sombre éclairée en UV */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#160f2e"); bg.addColorStop(1, "#05040c"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var zoomW = phone ? 0 : W * 0.34, aw = W - zoomW;
      /* lampe UV */
      var ly = 24, lx0 = aw * 0.08, lx1 = aw * 0.92;
      ctx.save(); var gu = ctx.createLinearGradient(0, ly + 6, 0, H * 0.75); gu.addColorStop(0, "rgba(140,90,255,.35)"); gu.addColorStop(1, "rgba(140,90,255,0)");
      ctx.fillStyle = gu; ctx.beginPath(); ctx.moveTo(lx0, ly + 8); ctx.lineTo(lx1, ly + 8); ctx.lineTo(aw, H * 0.78); ctx.lineTo(0, H * 0.78); ctx.closePath(); ctx.fill();
      var gl = ctx.createLinearGradient(0, ly - 7, 0, ly + 7); gl.addColorStop(0, "#efe6ff"); gl.addColorStop(0.5, "#a98bff"); gl.addColorStop(1, "#5a3cc4");
      ctx.fillStyle = "#2a2440"; qrr(ctx, lx0 - 10, ly - 14, lx1 - lx0 + 20, 12, 4); ctx.fill();
      ctx.fillStyle = gl; qrr(ctx, lx0, ly - 4, lx1 - lx0, 10, 5); ctx.fill(); ctx.restore();
      qT(S, c, "lampe UV (365 nm)", phone ? 12 : aw / 2, ly + 18, {size:qfz(c, 11), color:"#d9ccff", align:phone ? "left" : "center"});
      /* étagère */
      var sy = H * 0.8; var gs = ctx.createLinearGradient(0, sy, 0, sy + 16); gs.addColorStop(0, "#6b4a2e"); gs.addColorStop(1, "#2e1d10");
      ctx.fillStyle = gs; ctx.fillRect(0, sy, aw, 16);
      /* fioles */
      var nV = vials.length, slot = aw / nV, vw = Math.min(slot * 0.62, 46), vh = H * (phone ? 0.35 : 0.42); hit = [];
      for (i = 0; i < nV; i++){
        var cx = slot * (i + 0.5), top = sy - vh, d = vials[i], E = qdE(d), lam = HC_EVNM / E, rgb = qwl(lam), on = i === sel;
        var tw = 0.6 + 0.4 * Math.sin(T * 2 + i);
        ctx.save(); ctx.globalCompositeOperation = "lighter"; qglow(ctx, cx, sy - vh * 0.35, vw * 1.5, rgb, 0.35 + 0.05 * tw); ctx.restore();
        /* liquide luminescent */
        var gq = ctx.createLinearGradient(cx - vw / 2, 0, cx + vw / 2, 0);
        gq.addColorStop(0, qshade(rgb, -0.35)); gq.addColorStop(0.35, qshade(rgb, 0.35)); gq.addColorStop(0.6, qshade(rgb, 0.05)); gq.addColorStop(1, qshade(rgb, -0.45));
        ctx.fillStyle = gq; qrr(ctx, cx - vw / 2 + 3, top + vh * 0.3, vw - 6, vh * 0.7 - 3, 8); ctx.fill();
        /* verre, bouchon */
        ctx.strokeStyle = on ? "#ffd34d" : "rgba(220,230,255,.55)"; ctx.lineWidth = on ? 2.5 : 1.4; qrr(ctx, cx - vw / 2, top + 10, vw, vh - 10, 9); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(cx - vw / 2 + 5, top + 16, 3, vh - 30);
        var gc = ctx.createLinearGradient(cx - vw / 2, 0, cx + vw / 2, 0); gc.addColorStop(0, "#1b1b22"); gc.addColorStop(0.5, "#4a4a58"); gc.addColorStop(1, "#15151b");
        ctx.fillStyle = gc; qrr(ctx, cx - vw / 2 - 2, top - 6, vw + 4, 18, 4); ctx.fill();
        qT(S, c, qN(d, 1) + " nm", cx, sy + 28, {size:qfz(c, phone ? 10.5 : 12), color:on ? "#ffd34d" : "#e6ebf5"});
        qT(S, c, qN(lam, 0), cx, sy + 44, {size:qfz(c, phone ? 10 : 11), color:qa(rgb, 1), mono:true});
        hit.push({x0:cx - slot / 2, x1:cx + slot / 2, y0:top - 10, y1:sy + 50});
      }
      if (phone) qtag(S, c, "sous les fioles : d, puis λ (nm)", 8, ly + 42, {size:10, color:"#d9ccff", align:"left"});
      else qtag(S, c, "sous chaque fiole : diamètre d du cristal, puis λ émise (nm)", aw / 2, ly + 42, {size:10.5, color:"#d9ccff"});
      /* zoom : le cristal et ses niveaux */
      var d0 = vials[sel], E0 = qdE(d0), lam0 = HC_EVNM / E0, rgb0 = qwl(lam0);
      var zx = phone ? W - 132 : aw + 8, zy = phone ? 40 : 40, zw = phone ? 124 : zoomW - 16, zh = phone ? 84 : H - 60;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.strokeStyle = "rgba(255,255,255,.18)"; qrr(ctx, zx, zy, zw, zh, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      if (!phone){
        /* cristal en 3D : boules sur un réseau cubique, rayon ∝ d */
        var ccx = zx + zw / 2, ccy = zy + zh * 0.28, R = Math.min(zw * 0.42, zh * 0.24) * (0.35 + 0.65 * d0 / 8), ng = Math.max(2, Math.round(d0 / 0.6)), pts = [];
        var ca = Math.cos(T * 0.5), sa = Math.sin(T * 0.5);
        for (var ix = -ng; ix <= ng; ix++) for (var iy = -ng; iy <= ng; iy++) for (var iz = -ng; iz <= ng; iz++){
          if (ix * ix + iy * iy + iz * iz > ng * ng) continue;
          var X = ix / ng, Y = iy / ng, Z = iz / ng, X2 = X * ca + Z * sa, Z2 = -X * sa + Z * ca, Y2 = Y * 0.94 - Z2 * 0.34, Z3 = Y * 0.34 + Z2 * 0.94;
          pts.push([X2, Y2, Z3, (ix + iy + iz) & 1]);
        }
        pts.sort(function(p, q){ return p[2] - q[2]; });
        ctx.save(); ctx.globalCompositeOperation = "lighter"; qglow(ctx, ccx, ccy, R * 1.6, rgb0, 0.5); ctx.restore();
        var br = Math.max(1.6, R / ng * 0.55);
        pts.forEach(function(p){ qball(ctx, ccx + p[0] * R, ccy - p[1] * R, br, p[3] ? "#d8c46a" : "#8fa1b8"); });
        qT(S, c, "nanocristal de CdSe, d = " + qN(d0, 1) + " nm", ccx, zy + zh * 0.52, {size:11, color:"#eef3fb"});
      }
      /* schéma des bandes */
      var bx0 = zx + 10, bx1 = zx + zw - 10, byT = phone ? zy + 8 : zy + zh * 0.6, byB = zy + zh - 12, Emx = 3.4, Emn = -0.9;
      function EY(e){ return byB - (e - Emn) / (Emx - Emn) * (byB - byT); }
      var conf = E0 - QD.Eg, fe = (1 / QD.me) / (1 / QD.me + 1 / QD.mh);
      ctx.save(); ctx.fillStyle = "rgba(90,140,255,.25)"; ctx.fillRect(bx0, EY(QD.Eg), bx1 - bx0, EY(QD.Eg) - EY(Emx) < 0 ? 0 : -(EY(QD.Eg) - EY(Emx)));
      ctx.fillRect(bx0, EY(QD.Eg), bx1 - bx0, -(EY(QD.Eg) - byT)); ctx.fillStyle = "rgba(255,150,90,.25)"; ctx.fillRect(bx0, EY(0), bx1 - bx0, byB - EY(0)); ctx.restore();
      var ye = EY(QD.Eg + conf * fe), yh = EY(-conf * (1 - fe));
      S.draw.line(c, bx0 + 4, ye, bx1 - 4, ye, "#9fd0ff", 2); S.draw.line(c, bx0 + 4, yh, bx1 - 4, yh, "#ffbf8f", 2);
      var axX = (bx0 + bx1) / 2;
      ctx.save(); ctx.strokeStyle = qa(rgb0, 1); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(axX, ye + 3);
      for (var s2 = 0; s2 <= 30; s2++){ var yy = ye + 3 + (yh - ye - 6) * s2 / 30; ctx.lineTo(axX + Math.sin(s2 * 1.2 + T * 8) * 4, yy); } ctx.stroke();
      ctx.fillStyle = qa(rgb0, 1); ctx.beginPath(); ctx.moveTo(axX - 5, yh - 9); ctx.lineTo(axX + 5, yh - 9); ctx.lineTo(axX, yh - 2); ctx.closePath(); ctx.fill(); ctx.restore();
      qball(ctx, axX - 18, ye, 4, "#7fd4ff"); qball(ctx, axX + 18, yh, 4, "#ff9b6a");
      qT(S, c, qN(E0, 2) + " eV", axX + (phone ? 14 : 30), (ye + yh) / 2, {size:qfz(c, phone ? 10.5 : 11.5), color:"#fff", align:"left", halo:"#2a2440"});
      if (!phone){ qT(S, c, "bande de conduction", bx0 + 4, byT + 9, {size:10, color:"#bcd2ff", align:"left"}); qT(S, c, "bande de valence", bx0 + 4, byB - 8, {size:10, color:"#ffd2b5", align:"left"}); }
      /* afficheurs */
      ro.set(0, qN(QD.Eg, 2) + " eV");
      ro.set(1, qN(conf, 3) + " eV");
      ro.set(2, qN(lam0, 0) + " nm");
      ro.set(3, qN(E0, 3) + " eV");
      nt.set("Modèle simplifié : E = E_g + h²/(8d²)·(1/mₑ* + 1/mₕ*), avec mₑ* = 0,13 mₑ et mₕ* = 0,45 mₑ (électron et trou confinés comme dans une boîte de largeur d). Les cristaux réels donnent des couleurs voisines. Plus le cristal est petit, plus l'énergie de confinement est grande : la lumière passe du rouge au bleu.", "ok");
    }
    var labels0 = ["E₁ = h²/(8ma²)", "Énergie Eₙ", "Longueur d'onde λₙ = 2a/n", "Photon émis n → n − 1"], labels1 = ["Gap E_g (CdSe massif)", "Énergie de confinement", "Couleur émise λ", "Énergie du photon"];
    k.draw(function(){
      var lab = tab.value === "boite" ? labels0 : labels1;
      Array.prototype.forEach.call(ro.el.querySelectorAll("small"), function(s, i){ if (s.textContent !== lab[i]) s.textContent = lab[i]; });
      if (tab.value === "boite") drawBox(); else drawQD();
    });
  }
});

/* =====================================================================
   5. Orbitales de l'hydrogène en 3D : surfaces d'égale densité (pq06)
   ===================================================================== */
function hyFact(n){ var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }
function hyBin(a, b){ return hyFact(a) / (hyFact(b) * hyFact(a - b)); }
/* Laguerre généralisé par la somme explicite Σ (−1)^i C(k+α, k−i) xⁱ/i! */
function hyLag(k, al, x){ var s = 0; for (var i = 0; i <= k; i++) s += (i % 2 ? -1 : 1) * hyBin(k + al, k - i) * Math.pow(x, i) / hyFact(i); return s; }
/* partie radiale normée de l'hydrogène, r en a₀ */
function hyR(n, l, r){
  var rho = 2 * r / n, N = Math.sqrt(Math.pow(2 / n, 3) * hyFact(n - l - 1) / (2 * n * hyFact(n + l)));
  return N * Math.exp(-rho / 2) * Math.pow(rho, l) * hyLag(n - l - 1, 2 * l + 1, rho);
}
/* harmoniques sphériques réelles (x, y, z unitaires) */
var HYY = [
  [{nm:"s", m:"m = 0", f:function(){ return 0.28209479; }}],
  [{nm:"p_z", m:"m = 0", f:function(x, y, z){ return 0.48860251 * z; }}, {nm:"p_x", m:"|m| = 1", f:function(x){ return 0.48860251 * x; }}, {nm:"p_y", m:"|m| = 1", f:function(x, y){ return 0.48860251 * y; }}],
  [{nm:"d_z²", m:"m = 0", f:function(x, y, z){ return 0.31539157 * (3 * z * z - 1); }}, {nm:"d_xz", m:"|m| = 1", f:function(x, y, z){ return 1.09254843 * x * z; }},
   {nm:"d_yz", m:"|m| = 1", f:function(x, y, z){ return 1.09254843 * y * z; }}, {nm:"d_xy", m:"|m| = 2", f:function(x, y){ return 1.09254843 * x * y; }},
   {nm:"d_x²−y²", m:"|m| = 2", f:function(x, y){ return 0.54627422 * (x * x - y * y); }}],
  [{nm:"f_z³", m:"m = 0", f:function(x, y, z){ return 0.37317633 * z * (5 * z * z - 3); }}, {nm:"f_xz²", m:"|m| = 1", f:function(x, y, z){ return 0.45704580 * x * (5 * z * z - 1); }},
   {nm:"f_yz²", m:"|m| = 1", f:function(x, y, z){ return 0.45704580 * y * (5 * z * z - 1); }}, {nm:"f_xyz", m:"|m| = 2", f:function(x, y, z){ return 2.89061144 * x * y * z; }},
   {nm:"f_z(x²−y²)", m:"|m| = 2", f:function(x, y, z){ return 1.44530572 * z * (x * x - y * y); }}, {nm:"f_x(x²−3y²)", m:"|m| = 3", f:function(x, y){ return 0.59004359 * x * (x * x - 3 * y * y); }},
   {nm:"f_y(3x²−y²)", m:"|m| = 3", f:function(x, y){ return 0.59004359 * y * (3 * x * x - y * y); }}]
];
var HYL = ["s", "p", "d", "f"];
function hySub(nm){ var p = nm.split("_"); return {main:p[0], sub:p[1] || ""}; }

SFA.sim({
  id:"pq-orbitales-hydrogene-3d", ch:"pq06", tag:"Atome d'hydrogène",
  titre:"Orbitales de l'hydrogène en 3D : ψₙℓₘ qu'on fait tourner",
  resume:"La surface d'égale densité de chaque orbitale, colorée selon le signe de ψ, et un plan de coupe qui révèle les nœuds cachés à l'intérieur.",
  but:"Choisis n, ℓ et l'orbitale. La surface enferme 85 % de la probabilité de présence ; bleu : ψ > 0, orange : ψ < 0. Fais-la tourner à la souris et active un plan de coupe pour voir les nœuds radiaux (anneaux sombres). En dessous : la probabilité radiale r²R².",
  aRetenir:"ψₙℓₘ a n − 1 nœuds : ℓ nœuds angulaires (plans ou cônes) et n − ℓ − 1 nœuds radiaux (sphères).",
  piege:"La couleur est le signe de ψ, pas une charge : |ψ|² est toujours positif, et deux lobes symétriques de signes opposés ont la même densité.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 340 : 400), g = k.canvas(phone ? 150 : 160);
    var nS = k.seg("Nombre quantique principal n", [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]], "3", function(){ fix(); gen(); });
    var lS = k.seg("Nombre quantique orbital ℓ", [["0", "0 (s)"], ["1", "1 (p)"], ["2", "2 (d)"], ["3", "3 (f)"]], "1", function(){ fix(); gen(); });
    var mS = k.select("Orbitale", [["0", "—"]], "0", function(){ gen(); });
    var cS = k.seg("Plan de coupe", [["non", "Aucun"], ["xz", "Plan xz"], ["xy", "Plan xy"]], "xz");
    var spT = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["Orbitale", "Énergie Eₙ = −13,6 eV/n²", "Nœuds radiaux / angulaires", "Rayon moyen ⟨r⟩", "r le plus probable"]);
    var nt = k.note("", "ok");
    var warn = "";
    function fix(){
      var n = +nS.value, l = +lS.value; warn = "";
      if (l > n - 1){ warn = "ℓ ≤ n − 1 : pour n = " + n + ", ℓ ramené à " + (n - 1) + ". "; lS.set(String(n - 1)); l = n - 1; }
      var e = mS.el; e.innerHTML = "";
      HYY[l].forEach(function(o, i){ var op = document.createElement("option"); op.value = String(i); op.textContent = n + o.nm.replace("_", "") + "  (" + o.m + ")"; e.appendChild(op); });
      e.value = "0";
    }
    var D = null, G = phone ? 26 : 32;
    function gen(){
      var n = +nS.value, l = +lS.value, o = HYY[l][+mS.value] || HYY[l][0], i, j, kk;
      /* rayon qui contient 99,5 % de la probabilité radiale */
      var M = 3000, rT = 8 * n * n + 10, dr = rT / M, cum = 0, Lh = rT, pmax = 0, rmp = 0, P = new Float64Array(M + 1);
      for (i = 0; i <= M; i++){ var r = i * dr, R = hyR(n, l, r); P[i] = r * r * R * R; }
      var tot = 0; for (i = 1; i <= M; i++) tot += 0.5 * (P[i] + P[i - 1]) * dr;
      for (i = 1; i <= M; i++){ cum += 0.5 * (P[i] + P[i - 1]) * dr; if (cum >= 0.995 * tot){ Lh = i * dr; break; } }
      for (i = 0; i <= M; i++) if (P[i] > pmax){ pmax = P[i]; rmp = i * dr; }
      var roots = [], prev = hyR(n, l, dr * 0.5);
      for (i = 1; i <= M; i++){ var cur = hyR(n, l, i * dr); if (prev * cur < 0){ var a0 = (i - 1) * dr, b0 = i * dr; for (var it = 0; it < 40; it++){ var md = (a0 + b0) / 2; if (hyR(n, l, a0) * hyR(n, l, md) <= 0) b0 = md; else a0 = md; } roots.push((a0 + b0) / 2); } prev = cur; }
      Lh *= 0.92;
      /* grille de ψ (coordonnées physiques x, y, z) */
      var N = G + 1, h = 2 * Lh / G, F = new Float32Array(N * N * N), vals = [];
      for (i = 0; i < N; i++) for (j = 0; j < N; j++) for (kk = 0; kk < N; kk++){
        var x = -Lh + i * h, y = -Lh + j * h, z = -Lh + kk * h, rr = Math.sqrt(x * x + y * y + z * z) || 1e-6;
        var ps = hyR(n, l, rr) * o.f(x / rr, y / rr, z / rr); F[(i * N + j) * N + kk] = ps; vals.push(ps * ps);
      }
      /* seuil : la région |ψ|² > seuil contient 85 % de la probabilité (somme sur la grille) */
      vals.sort(function(p, q){ return q - p; });
      var sum = 0; vals.forEach(function(u){ sum += u; });
      var acc = 0, iso = vals[0] * 0.5;
      for (i = 0; i < vals.length; i++){ acc += vals[i]; if (acc >= 0.85 * sum){ iso = vals[i]; break; } }
      /* marching tetrahedra sur f = ψ² − seuil */
      var tris = [], TET = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
      var CO = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
      var pv = new Array(8), fv = new Array(8), sv = new Array(8);
      function ed(a, b){ var t = fv[a] / (fv[a] - fv[b]); return [pv[a][0] + t * (pv[b][0] - pv[a][0]), pv[a][1] + t * (pv[b][1] - pv[a][1]), pv[a][2] + t * (pv[b][2] - pv[a][2])]; }
      function psiAt(x, y, z){ var rr = Math.sqrt(x * x + y * y + z * z) || 1e-6; return hyR(n, l, rr) * o.f(x / rr, y / rr, z / rr); }
      var eps = h * 0.25;
      function tri(A, B, C, toward, sg){
        var m = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
        /* normale lisse : −∇|ψ| au centre du triangle (vers l'extérieur de la région dense) */
        var nn = [Math.abs(psiAt(m[0] - eps, m[1], m[2])) - Math.abs(psiAt(m[0] + eps, m[1], m[2])), Math.abs(psiAt(m[0], m[1] - eps, m[2])) - Math.abs(psiAt(m[0], m[1] + eps, m[2])), Math.abs(psiAt(m[0], m[1], m[2] - eps)) - Math.abs(psiAt(m[0], m[1], m[2] + eps))];
        var ln = Math.hypot(nn[0], nn[1], nn[2]);
        if (ln < 1e-14){ var u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], w = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]; nn = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; ln = Math.hypot(nn[0], nn[1], nn[2]); if (ln < 1e-14) return;
          if ((toward[0] - m[0]) * nn[0] + (toward[1] - m[1]) * nn[1] + (toward[2] - m[2]) * nn[2] < 0) nn = [-nn[0], -nn[1], -nn[2]]; }
        tris.push(A[0], A[1], A[2], B[0], B[1], B[2], C[0], C[1], C[2], nn[0] / ln, nn[1] / ln, nn[2] / ln, sg);
      }
      var sIso = Math.sqrt(iso);
      for (i = 0; i < G; i++) for (j = 0; j < G; j++) for (kk = 0; kk < G; kk++){
        var any = 0, all = 0;
        for (var q = 0; q < 8; q++){ var ii = i + CO[q][0], jj = j + CO[q][1], k2 = kk + CO[q][2], ps2 = F[(ii * N + jj) * N + k2]; sv[q] = ps2; fv[q] = Math.abs(ps2) - sIso; if (fv[q] > 0) any++; pv[q] = [-Lh + ii * h, -Lh + jj * h, -Lh + k2 * h]; }
        if (any === 0 || any === 8) continue;
        TET.forEach(function(T){
          var ins = T.filter(function(q){ return fv[q] > 0; }), out = T.filter(function(q){ return fv[q] <= 0; });
          if (ins.length === 0 || ins.length === 4) return;
          var sg = sv[ins[0]] >= 0 ? 1 : -1;
          if (ins.length === 1){ var a = ins[0]; tri(ed(a, out[0]), ed(a, out[1]), ed(a, out[2]), pv[out[0]], sg); }
          else if (ins.length === 3){ var o2 = out[0]; tri(ed(ins[0], o2), ed(ins[1], o2), ed(ins[2], o2), pv[o2], sg); }
          else { var p1 = ed(ins[0], out[0]), p2 = ed(ins[0], out[1]), p3 = ed(ins[1], out[1]), p4 = ed(ins[1], out[0]); tri(p1, p2, p3, pv[out[0]], sg); tri(p1, p3, p4, pv[out[0]], sg); }
        });
      }
      D = {n:n, l:l, o:o, Lh:Lh, tris:new Float32Array(tris), nt:tris.length / 13, P:P, M:M, dr:dr, pmax:pmax, rmp:rmp, roots:roots, iso:iso};
      /* textures de coupe : ψ sur les plans y = 0 et z = 0 */
      D.tex = {};
      ["xz", "xy"].forEach(function(pl){
        var TS = 150, cv = document.createElement("canvas"); cv.width = TS; cv.height = TS; var cx2 = cv.getContext("2d"), im = cx2.createImageData(TS, TS), mx = 0, A = new Float32Array(TS * TS);
        for (var a = 0; a < TS; a++) for (var b = 0; b < TS; b++){
          var u = -Lh + (a + 0.5) / TS * 2 * Lh, w2 = -Lh + (b + 0.5) / TS * 2 * Lh, X = u, Y = pl === "xz" ? 0 : w2, Z = pl === "xz" ? w2 : 0, rr = Math.sqrt(X * X + Y * Y + Z * Z) || 1e-6;
          var ps = hyR(n, l, rr) * o.f(X / rr, Y / rr, Z / rr); A[b * TS + a] = ps; mx = Math.max(mx, Math.abs(ps));
        }
        for (var t = 0; t < TS * TS; t++){
          var s = A[t] / (mx || 1), m2 = Math.pow(Math.abs(s), 0.5), base = s >= 0 ? [61, 139, 255] : [255, 138, 61];
          im.data[4 * t] = 12 + base[0] * m2; im.data[4 * t + 1] = 16 + base[1] * m2; im.data[4 * t + 2] = 34 + base[2] * m2; im.data[4 * t + 3] = Math.round(70 + 185 * Math.min(1, m2 * 1.4));
        }
        cx2.putImageData(im, 0, 0); D.tex[pl] = cv;
      });
      k.redraw();
    }
    var v = new Q3(); v.a = 0.6; v.b = 0.32; v.f = 0; v.set();
    qorbit(c, v, k, [-1.4, 1.4], function(){ if (spT.value){ spT.set(false); } });
    var tau = 0;
    var lp = k.loop(function(dt){ if (spT.value){ tau += dt; if (cS.value === "non") v.a += dt * 0.3; else v.a = 0.35 + 0.45 * Math.sin(tau * 0.45);
      var bt = cS.value === "xy" ? 0.75 : 0.3; v.b += (bt - v.b) * Math.min(1, dt * 2); v.set(); } k.redraw(); });
    lp.play();
    /* physique (x, y, z) → monde (x, z, −y) : z vers le haut */
    function W3(x, y, z){ return v.rot(x, z, -y); }
    var order = new Uint32Array(1), keys = new Float32Array(1), PV = new Float32Array(1);
    k.draw(function(){
      if (!D) return;
      var ctx = c.ctx, W = c.W, H = c.H, i, cut = cS.value;
      var bg = ctx.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H / 2, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#1c2a4b"); bg.addColorStop(0.6, "#0c152c"); bg.addColorStop(1, "#050915"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var Lh = D.Lh; v.sc = Math.min(W, H) * 0.47 / (Lh * 1.0); v.cx = W / 2; v.cy = H / 2 + 8;
      function P2(x, y, z){ var q = W3(x, y, z); return {x:v.cx + q[0] * v.sc, y:v.cy - q[1] * v.sc, z:q[2]}; }
      /* axes */
      [[[1, 0, 0], "x"], [[0, 1, 0], "y"], [[0, 0, 1], "z"]].forEach(function(a){
        var p0 = P2(-Lh * a[0][0], -Lh * a[0][1], -Lh * a[0][2]), p1 = P2(Lh * a[0][0] * 1.08, Lh * a[0][1] * 1.08, Lh * a[0][2] * 1.08);
        S.draw.line(c, p0.x, p0.y, p1.x, p1.y, "rgba(200,215,240,.3)", 1, [3, 4]);
        qT(S, c, a[1], p1.x, p1.y, {size:14, color:"rgba(225,233,250,.9)", math:true, italic:true, halo:"#0c152c"});
      });
      /* triangles visibles */
      var T = D.tris, ntr = D.nt;
      if (order.length < ntr){ order = new Uint32Array(ntr); keys = new Float32Array(ntr); PV = new Float32Array(ntr * 9); }
      var m = 0, cutAx = cut === "xz" ? 1 : cut === "xy" ? 2 : -1;
      /* on enlève la moitié tournée vers toi : le plan de coupe reste visible */
      var nrm = cut === "xz" ? W3(0, 1, 0) : W3(0, 0, 1), keepSg = nrm[2] > 0 ? -1 : 1;
      for (i = 0; i < ntr; i++){
        var o = i * 13;
        if (cutAx >= 0 && keepSg * (T[o + cutAx] + T[o + 3 + cutAx] + T[o + 6 + cutAx]) < 0) continue;
        var nq = W3(T[o + 9], T[o + 10], T[o + 11]);
        if (cutAx < 0 && nq[2] < 0) continue;
        var zs = 0;
        for (var j = 0; j < 3; j++){ var q = W3(T[o + 3 * j], T[o + 3 * j + 1], T[o + 3 * j + 2]); PV[i * 9 + 3 * j] = v.cx + q[0] * v.sc; PV[i * 9 + 3 * j + 1] = v.cy - q[1] * v.sc; zs += q[2]; }
        order[m] = i; keys[i] = zs; m++;
      }
      var ord = Array.prototype.slice.call(order, 0, m); ord.sort(function(p, q){ return keys[p] - keys[q]; });
      var Lt = [-0.45, 0.6, 0.66], ll = Math.hypot(Lt[0], Lt[1], Lt[2]);
      function drawTris(){
        ctx.save(); ctx.lineJoin = "round"; ctx.lineWidth = 0.6;
        for (var t = 0; t < ord.length; t++){
          var id = ord[t], o = id * 13, nq = W3(T[o + 9], T[o + 10], T[o + 11]), back = nq[2] < 0;
          if (back) nq = [-nq[0], -nq[1], -nq[2]];
          var dif = Math.max(0, (nq[0] * Lt[0] + nq[1] * Lt[1] + nq[2] * Lt[2]) / ll), spec = Math.pow(Math.max(0, nq[2] * 0.6 + dif * 0.5), 18);
          var base = T[o + 12] > 0 ? [61, 139, 255] : [255, 138, 61], f = back ? 0.32 : 0.38 + 0.62 * dif;
          var col = "rgb(" + Math.min(255, Math.round(base[0] * f + 255 * spec * 0.5)) + "," + Math.min(255, Math.round(base[1] * f + 255 * spec * 0.5)) + "," + Math.min(255, Math.round(base[2] * f + 255 * spec * 0.5)) + ")";
          var b9 = id * 9; ctx.beginPath(); ctx.moveTo(PV[b9], PV[b9 + 1]); ctx.lineTo(PV[b9 + 3], PV[b9 + 4]); ctx.lineTo(PV[b9 + 6], PV[b9 + 7]); ctx.closePath();
          ctx.fillStyle = col; ctx.strokeStyle = col; ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      function drawPlane(){
        var tx = D.tex[cut]; if (!tx) return;
        var A, B, C;
        if (cut === "xz"){ A = P2(-Lh, 0, -Lh); B = P2(Lh, 0, -Lh); C = P2(-Lh, 0, Lh); }
        else { A = P2(-Lh, -Lh, 0); B = P2(Lh, -Lh, 0); C = P2(-Lh, Lh, 0); }
        var dpr = ctx.canvas.width / W, Dp = {x:B.x + C.x - A.x, y:B.y + C.y - A.y};
        ctx.save(); ctx.globalAlpha = 0.92; ctx.setTransform(dpr * (B.x - A.x) / tx.width, dpr * (B.y - A.y) / tx.width, dpr * (C.x - A.x) / tx.height, dpr * (C.y - A.y) / tx.height, dpr * A.x, dpr * A.y);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(tx, 0, 0); ctx.restore();
        ctx.save(); ctx.strokeStyle = "rgba(255,214,102,.75)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(Dp.x, Dp.y); ctx.lineTo(C.x, C.y); ctx.closePath(); ctx.stroke(); ctx.restore();
        /* nœuds radiaux : cercles en pointillés dans le plan */
        D.roots.forEach(function(r0){
          ctx.save(); ctx.strokeStyle = "rgba(255,214,102,.9)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.3; ctx.beginPath();
          for (var s = 0; s <= 64; s++){ var th = s / 64 * TAU, q = cut === "xz" ? P2(r0 * Math.cos(th), 0, r0 * Math.sin(th)) : P2(r0 * Math.cos(th), r0 * Math.sin(th), 0); if (s) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
          ctx.stroke(); ctx.restore();
        });
      }
      drawTris(); if (cutAx >= 0) drawPlane();
      /* noyau */
      var nu = P2(0, 0, 0); qglow(ctx, nu.x, nu.y, 8, "#ffe08a", 0.8); qball(ctx, nu.x, nu.y, 2.5, "#ffd34d");
      /* nom */
      var nmS = hySub(D.o.nm);
      ctx.save(); ctx.fillStyle = "#fff"; ctx.font = "800 " + (phone ? 26 : 30) + "px Mulish, system-ui, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.fillText(D.n + nmS.main, 14, phone ? 34 : 40);
      var wN = ctx.measureText(D.n + nmS.main).width; ctx.font = "800 " + (phone ? 14 : 16) + "px Mulish, system-ui, sans-serif"; ctx.fillText(nmS.sub, 16 + wN, phone ? 40 : 47); ctx.restore();
      qT(S, c, "n = " + D.n + " · ℓ = " + D.l + " · " + D.o.m, 15, phone ? 54 : 62, {size:qfz(c, 12), color:"#c7d3ea", align:"left", weight:700});
      qT(S, c, "glisse pour tourner", W - 10, 14, {size:qfz(c, 11), color:"rgba(199,211,234,.75)", align:"right", weight:600});
      /* légende */
      var lx = W - (phone ? 96 : 112), ly = H - (cutAx >= 0 && D.roots.length ? 62 : 46);
      ctx.save(); ctx.fillStyle = "rgba(5,9,21,.6)"; qrr(ctx, lx - 8, ly - 12, phone ? 92 : 106, cutAx >= 0 && D.roots.length ? 58 : 42, 7); ctx.fill(); ctx.restore();
      [["#3d8bff", "ψ > 0"], ["#ff8a3d", "ψ < 0"]].forEach(function(it, j){ qball(ctx, lx + 3, ly + j * 16, 4.5, it[0]); qT(S, c, it[1], lx + 13, ly + j * 16, {size:qfz(c, 11.5), color:"#e9eef8", align:"left"}); });
      if (cutAx >= 0 && D.roots.length){ S.draw.line(c, lx - 3, ly + 32, lx + 9, ly + 32, "rgba(255,214,102,.9)", 1.6, [4, 3]); qT(S, c, "nœud radial", lx + 13, ly + 32, {size:qfz(c, 11), color:"#e9eef8", align:"left"}); }
      /* barre d'échelle */
      var nice = [0.5, 1, 2, 5, 10, 20], Ls = 1; for (i = 0; i < nice.length; i++){ if (nice[i] * v.sc >= 40){ Ls = nice[i]; break; } }
      var by = H - 16; S.draw.line(c, 14, by, 14 + Ls * v.sc, by, "#e9eef8", 2);
      qT(S, c, qN(Ls, 1) + " a₀ = " + qN(Ls * A0PM, 0) + " pm", 14, by - 11, {size:qfz(c, 11), color:"#e9eef8", align:"left"});
      /* ---- probabilité radiale ---- */
      g.clear();
      var gx = g.ctx, xmax = Lh * 1.05;
      var ax = S.draw.axes(g, {x0:0, x1:xmax, y0:0, y1:D.pmax * 1.25, xl:"r (a₀)", yl:"r²R²", l:40, b:28, t:10, r:12});
      gx.save(); gx.beginPath(); gx.moveTo(ax.X(0), ax.Y(0));
      for (i = 0; i <= D.M; i += 4){ var rp = i * D.dr; if (rp > xmax) break; gx.lineTo(ax.X(rp), ax.Y(D.P[i])); }
      gx.lineTo(ax.X(Math.min(xmax, D.M * D.dr)), ax.Y(0)); gx.closePath();
      var gg = gx.createLinearGradient(0, ax.T, 0, ax.B); gg.addColorStop(0, "rgba(47,111,214,.45)"); gg.addColorStop(1, "rgba(47,111,214,.05)");
      gx.fillStyle = gg; gx.fill(); gx.strokeStyle = "#1f4b9e"; gx.lineWidth = 2; gx.stroke(); gx.restore();
      D.roots.forEach(function(r0){ S.draw.dot(g, ax.X(r0), ax.Y(0), 4.5, "#c0321d"); });
      var rm = (3 * D.n * D.n - D.l * (D.l + 1)) / 2;
      S.draw.line(g, ax.X(rm), ax.T + 14, ax.X(rm), ax.B, "#24775a", 1.4, [5, 4]);
      qT(S, g, "⟨r⟩ = " + qN(rm, 1) + " a₀", ax.X(rm) + (ax.X(rm) > g.W - 110 ? -6 : 6), ax.T + 8, {size:qfz(g, 11), color:"#24775a", align:ax.X(rm) > g.W - 110 ? "right" : "left", halo:true});
      if (D.roots.length) qT(S, g, "● nœud radial", ax.R - 2, ax.T + 26, {size:qfz(g, 10.5), color:"#c0321d", align:"right", halo:true});
      /* ---- afficheurs ---- */
      ro.set(0, D.n + nmS.main + (nmS.sub ? "<sub>" + nmS.sub + "</sub>" : ""));
      ro.set(1, qN(-RYEV / (D.n * D.n), 2) + " eV");
      ro.set(2, (D.n - D.l - 1) + " / " + D.l);
      ro.set(3, qN(rm, 1) + " a₀ = " + qN(rm * A0PM, 0) + " pm");
      ro.set(4, qN(D.rmp, 2) + " a₀");
      var ang = D.l === 0 ? "aucun nœud angulaire" : D.l + " nœud" + (D.l > 1 ? "s" : "") + " angulaire" + (D.l > 1 ? "s" : "") + " (plans ou cônes où ψ change de signe)";
      nt.set(warn + (D.roots.length ? "Nœuds radiaux à r = " + D.roots.map(function(r0){ return qN(r0, 2) + " a₀"; }).join(" et ") + " ; " : "Aucun nœud radial ; ") + ang + ". " +
        (cutAx < 0 && D.roots.length ? "Les nœuds radiaux sont cachés à l'intérieur : active un plan de coupe." : "Surface : |ψ|² = seuil qui enferme 85 % de la probabilité de présence (sur la grille de calcul)."), warn ? "warn" : "ok");
    });
    fix(); gen();
  }
});

/* =====================================================================
   6. Stern et Gerlach (pq08)
   ===================================================================== */
var SG = {m:107.8682 * UMA, g:2.00232, L:0.035, D:0.02, slit:0.4e-3, sw:0.012e-3, X:0.6e-3};   /* demi-hauteur de plaque : ZH() dans la simulation */
/* déviation (m) au niveau de la plaque d'un atome de moment μ_z (J/T) à la vitesse v, gradient G (T/m) */
function sgDev(muz, v, G){ return muz * G / SG.m * SG.L / (v * v) * (SG.L / 2 + SG.D); }
function sgVmean(T){ return Math.sqrt(9 * PI * KB * T / (8 * SG.m)); }  /* vitesse moyenne du jet (effusif) */

SFA.sim({
  id:"pq-stern-gerlach", ch:"pq08", tag:"Spin",
  titre:"Stern et Gerlach : un jet d'argent coupé en deux",
  resume:"Des atomes d'argent traversent un champ magnétique non uniforme : au lieu d'une traînée continue, ils se déposent en deux taches.",
  but:"Regarde le dépôt se former sur la plaque, fais tourner le montage à la souris, tourne l'aimant ou change d'atome. Passe ensuite aux mesures successives : un premier aimant trie les atomes selon z, un second les mesure selon un autre axe, un troisième de nouveau selon z.",
  aRetenir:"La composante du moment magnétique selon le champ ne prend que des valeurs discrètes : deux pour un spin ½ (m = ±½), 2J + 1 en général.",
  piege:"Après une mesure selon x, l'atome a « oublié » son tri selon z : une nouvelle mesure selon z redonne 50 % / 50 %.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 320 : 370), f = k.canvas(phone ? 210 : 230);
    var modeS = k.seg("Expérience", [["un", "Un aimant"], ["chaine", "Mesures successives"]], "un", function(){ showCtl(); clearAll(); });
    var atS = k.select("Atome", [["ag", "Argent : spin ½ (2 taches)"], ["j1", "Atome J = 1 (3 taches, modèle)"], ["cl", "Aimant classique (orienté au hasard)"]], "ag", function(){ clearAll(); });
    var gS = k.slider("Gradient du champ dB/dz", 0, 2000, 50, 1000, "T/m", function(){ clearAll(); });
    /* demi-hauteur de plaque vue (m) : l'atome J = 1 (μ_z = 2 μ_B) est dévié deux fois plus */
    function ZH(){ return atS.value === "j1" ? 0.9e-3 : 0.45e-3; }
    var tS = k.slider("Température du four", 1000, 1600, 20, 1300, "K", function(){ clearAll(); });
    var thS = k.slider("Rotation de l'aimant autour du jet", 0, 90, 5, 0, "°", function(){ clearAll(); });
    var chS = k.seg("Chaîne d'appareils", [["zz", "z puis z"], ["zx", "z puis θ"], ["zxz", "z, θ, puis z"]], "zxz", function(){ showCtl(); clearAll(); });
    var t2S = k.slider("Orientation θ du 2e aimant", 0, 180, 5, 90, "°", function(){ clearAll(); });
    var clT = k.toggle("Montrer la prévision classique", true);
    k.button("Effacer", function(){ clearAll(); });
    var ro = k.readouts(["Vitesse moyenne du jet", "Écart le plus probable au centre", "Atomes déposés", "Moment μ_z possible"]);
    var LAB1 = ["Vitesse moyenne du jet", "Écart le plus probable au centre", "Atomes déposés", "Moment μ_z possible"], LAB2 = ["Après chaque aimant", "Loi pour un spin ½", "Atomes comptés", "Moment μ_z possible"];
    function relab(L){ Array.prototype.forEach.call(ro.el.querySelectorAll("small"), function(sm, i){ if (sm.textContent !== L[i]) sm.textContent = L[i]; }); }
    var nt = k.note("", "ok");
    function showCtl(){
      var u = modeS.value === "un";
      [atS, gS, tS, thS].forEach(function(o){ o.el.parentNode.style.display = u ? "" : "none"; });
      clEl.style.display = u ? "" : "none";
      chEl.style.display = u ? "none" : ""; t2S.el.parentNode.style.display = u || chS.value === "zz" ? "none" : "";
    }
    var tgs = k.ctrl.querySelectorAll(".ctl.tg"), clEl = tgs[tgs.length - 1];
    var segs = k.ctrl.querySelectorAll(".ctl .seg"), chEl = segs[segs.length - 1].parentNode;
    /* dépôt sur la plaque (texture) et profil */
    var TW = 300, TH = 220, tex = null, nDep = 0, fly = [], acc = 0, cnt = null, flyC = [];
    function clearAll(){ tex = null; nDep = 0; fly = []; flyC = []; cnt = {p:0, m:0, in3:0, b:0}; k.redraw(); }
    clearAll();
    function deposit(x, z){
      if (!tex){ tex = document.createElement("canvas"); tex.width = TW; tex.height = TH; }
      var tc = tex.getContext("2d"), px = (x / SG.X + 1) / 2 * TW, pz = (1 - (z / ZH() + 1) / 2) * TH;
      tc.fillStyle = "rgba(30,34,42,.17)"; tc.beginPath(); tc.arc(px, pz, 1.25, 0, TAU); tc.fill(); nDep++;
    }
    function muList(){ var a = atS.value; if (a === "ag") return [SG.g * 0.5 * MUB, -SG.g * 0.5 * MUB]; if (a === "j1") return [2 * MUB, 0, -2 * MUB]; return null; }
    function sampleAtom(){
      var T = tS.value, s = Math.sqrt(KB * T / SG.m), u = -Math.log(Math.random() * Math.random() + 1e-12), v = s * Math.sqrt(2 * u);
      var x = (Math.random() * 2 - 1) * SG.slit, G = gS.value * Math.max(0, 1 - Math.pow(x / (SG.slit * 1.12), 2));
      var L = muList(), mu = L ? L[(Math.random() * L.length) | 0] : SG.g * 0.5 * MUB * (2 * Math.random() - 1);
      var d = sgDev(mu, Math.max(v, 50), G), th = thS.value * PI / 180, w = (Math.random() + Math.random() + Math.random() - 1.5) * 2 * SG.sw;
      /* déviation le long de l'axe de l'aimant (tourné de θ autour du jet) */
      return {x:x + (d + w) * Math.sin(th), z:(d + w) * Math.cos(th), dz:d};
    }
    var v = new Q3(); v.a = 0.55; v.b = 0.32; v.f = 26; v.set();
    qorbit(c, v, k, [-0.3, 1.2]);
    var T0 = 0;
    var lp = k.loop(function(dt, t){
      T0 += dt;
      if (!v.user){ v.a = 0.55 + 0.2 * Math.sin(t * 0.25); v.set(); }
      acc += dt * (modeS.value === "un" ? 320 : 14);
      while (acc >= 1){
        acc -= 1;
        if (modeS.value === "un"){ var a = sampleAtom(); if (fly.length < 6) fly.push({p:a, s:0}); else if (Math.abs(a.z) < ZH() && Math.abs(a.x) < SG.X) deposit(a.x, a.z); }
        else { flyC.push(chainAtom()); }
      }
      for (var i = fly.length - 1; i >= 0; i--){ fly[i].s += dt * 0.7; if (fly[i].s >= 1){ var p = fly[i].p; if (Math.abs(p.z) < ZH() && Math.abs(p.x) < SG.X) deposit(p.x, p.z); fly.splice(i, 1); } }
      for (i = flyC.length - 1; i >= 0; i--){ var q = flyC[i]; q.s += dt * 0.55; if (q.s >= q.end){ finish(q); flyC.splice(i, 1); } }
      k.redraw();
    });
    lp.play();
    /* ---- chaîne : chaque aimant mesure le spin selon son axe ; on garde la voie + ---- */
    function axes(){ var th = t2S.value * PI / 180, ch = chS.value; return ch === "zz" ? [0, 0] : ch === "zx" ? [0, th] : [0, th, 0]; }
    function chainAtom(){
      var A = axes(), st = Math.random() < 0.5 ? 0 : PI, out = [], s;   /* st : direction du spin (angle polaire), avant le 1er aimant au hasard */
      for (var i = 0; i < A.length; i++){
        var p = Math.pow(Math.cos((st - A[i]) / 2), 2); s = Math.random() < p ? 1 : -1; out.push(s);
        st = s > 0 ? A[i] : A[i] + PI;
        if (s < 0 && i < A.length - 1) break;   /* voie − arrêtée par un cache */
      }
      return {out:out, s:0, end:(out.length) / A.length};
    }
    function finish(q){ var A = axes(); if (q.out.length < A.length){ cnt.b++; return; } cnt.in3++; if (q.out[A.length - 1] > 0) cnt.p++; else cnt.m++; }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, i, un = modeS.value === "un";
      qlab(ctx, W, H, "#1e2a45", "#0a0f1c");
      v.sc = Math.min(W / (un ? 8.4 : 8.0), H / 4.0); v.cx = W * 0.5; v.cy = H * 0.55; v.clear();
      v.box(-4.6, -1.62, -1.6, 4.2, -1.45, 1.6, "#7a5232");
      if (un) drawOne(ctx, W, H); else drawChain(ctx, W, H);
      qT(S, c, "glisse pour tourner", W - 10, 14, {size:qfz(c, 11), color:"rgba(210,222,240,.75)", align:"right", weight:600});
      if (un) drawPlate(); else drawCounts();
    });
    /* aimant à pièces polaires (lame en haut, gorge en bas), tourné de th autour de l'axe x, centré en (x0, cy, cz) */
    function magnet(x0, x1, th, cy, cz, sc){
      var cs = Math.cos(th), sn = Math.sin(th);
      function R(p){ return [p[0], cy + (p[1] * cs - p[2] * sn) * sc, cz + (p[1] * sn + p[2] * cs) * sc]; }
      function boxR(y0, y1, z0, z1, col){
        var P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(R), cc = R([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]);
        [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(function(fc){ v.face(fc.map(function(j){ return P[j]; }), col, {c:cc, cull:true}); });
      }
      boxR(0.42, 1.15, -0.75, 0.75, "#c0392b");
      /* lame : prisme triangulaire */
      var A = [[x0, 0.42, -0.5], [x0, 0.42, 0.5], [x0, 0.1, 0]].map(R), B = [[x1, 0.42, -0.5], [x1, 0.42, 0.5], [x1, 0.1, 0]].map(R), ce = R([(x0 + x1) / 2, 0.3, 0]);
      v.face([A[0], A[1], A[2]], "#c0392b", {c:ce, cull:true}); v.face([B[0], B[1], B[2]], "#c0392b", {c:ce, cull:true});
      v.face([A[0], B[0], B[2], A[2]], "#d2553f", {c:ce, cull:true}); v.face([A[1], B[1], B[2], A[2]], "#d2553f", {c:ce, cull:true});
      boxR(-1.15, -0.42, -0.75, 0.75, "#2f5fa8");
      boxR(-0.42, -0.24, -0.75, -0.16, "#3b6fc0"); boxR(-0.42, -0.24, 0.16, 0.75, "#3b6fc0");
    }
    function drawOne(ctx, W, H){
      var th = thS.value * PI / 180, i;
      /* four, fentes, aimant, plaque */
      v.cyl([-4.3, 0, 0], [-3.3, 0, 0], 0.48, 16, "#6b5a4a", {cap1:"#2a1d14"});
      v.sprite(-3.28, 0, 0, function(ctx2, q){ qglow(ctx2, q.x, q.y, 22 * q.s, "#ff8a3d", 0.8); });
      [-2.5, -1.7].forEach(function(xs){ v.box(xs - 0.04, -1.45, -0.9, xs + 0.04, -0.06, 0.9, "#8a95a6"); v.box(xs - 0.04, 0.06, -0.9, xs + 0.04, 1.0, 0.9, "#8a95a6"); v.box(xs - 0.04, -0.06, -0.9, xs + 0.04, 0.06, -0.55, "#8a95a6"); v.box(xs - 0.04, -0.06, 0.55, xs + 0.04, 0.06, 0.9, "#8a95a6"); });
      magnet(-0.9, 1.7, th, 0, 0, 1);
      var PZ = 1.05, PX = 1.25, xp = 3.4;
      v.box(xp, -PZ, -PX, xp + 0.06, PZ, PX, "#9fc4d8", {alpha:0.75, afterFace:4, after:function(ctx2){
        var A = v.p(xp, PZ, -PX), B = v.p(xp, PZ, PX), C = v.p(xp, -PZ, -PX);
        if (!tex) return; var dpr = ctx2.canvas.width / W; ctx2.save();
        ctx2.setTransform(dpr * (B.x - A.x) / TW, dpr * (B.y - A.y) / TW, dpr * (C.x - A.x) / TH, dpr * (C.y - A.y) / TH, dpr * A.x, dpr * A.y); ctx2.drawImage(tex, 0, 0); ctx2.restore();
      }});
      v.box(xp - 0.1, -1.45, -0.2, xp + 0.16, -PZ, 0.2, "#4a5566");
      /* atomes en vol : droite, parabole dans l'aimant, droite */
      fly.forEach(function(a){
        var s = a.s, x = -3.3 + s * (xp + 3.3), zf = a.p.z / ZH() * PZ, xf = a.p.x / SG.X * PX, d = 0;
        if (x > -0.9){ var u = Math.min(1, (x + 0.9) / 2.6); d = x < 1.7 ? u * u * 0.4 : 0.4 + 0.6 * (x - 1.7) / (xp - 1.7); }
        var yy = zf * d, zz = xf * Math.min(1, Math.max(0, (x + 1.7) / (xp + 1.7)));
        v.sprite(x, yy, zz, function(ctx2, q){ qglow(ctx2, q.x, q.y, 9 * q.s, "#e8eef8", 0.7); qball(ctx2, q.x, q.y, 2.6 * q.s, "#c8d0dc"); });
      });
      v.render(ctx);
      var o0 = v.p(-3.8, 0.75, 0), m0 = v.p(0.4, 1.4, 0), p0 = v.p(xp, PZ + 0.3, 0);
      qtag(S, c, "four (" + qN(tS.value, 0) + " K)", o0.x, o0.y, {size:11});
      qtag(S, c, "aimant : B non uniforme", m0.x, m0.y, {size:11});
      qtag(S, c, "plaque de verre", p0.x, p0.y, {size:11});
    }
    function drawChain(ctx, W, H){
      var A = axes(), n = A.length, xs = n === 2 ? [-1.6, 1.4] : [-2.4, 0, 2.4], len = 1.3, sc = 0.42, i;
      v.cyl([-4.4, 0, 0], [-3.6, 0, 0], 0.4, 14, "#6b5a4a", {cap1:"#2a1d14"});
      v.sprite(-3.58, 0, 0, function(ctx2, q){ qglow(ctx2, q.x, q.y, 18 * q.s, "#ff8a3d", 0.8); });
      /* centres successifs : la voie + d'un aimant entre dans le suivant */
      var cen = [[0, 0]], gap = 0.32;
      for (i = 0; i < n; i++){
        var th = A[i]; magnet(xs[i] - len / 2, xs[i] + len / 2, th, cen[i][0], cen[i][1], sc);
        if (i < n - 1){
          cen.push([cen[i][0] + gap * Math.cos(th), cen[i][1] + gap * Math.sin(th)]);
          /* cache sur la voie − */
          var bx = xs[i] + len / 2 + 0.55, by = cen[i][0] - gap * Math.cos(th), bz = cen[i][1] - gap * Math.sin(th);
          v.box(bx - 0.06, by - 0.16, bz - 0.16, bx + 0.06, by + 0.16, bz + 0.16, "#15181f");
        }
      }
      /* écran final à deux compteurs */
      var xe = xs[n - 1] + len / 2 + 1.4, thL = A[n - 1], cl = cen[n - 1];
      [[1, "#2e9e6a"], [-1, "#c0392b"]].forEach(function(o){ var yy = cl[0] + o[0] * gap * 1.6 * Math.cos(thL), zz = cl[1] + o[0] * gap * 1.6 * Math.sin(thL); v.cyl([xe, yy, zz], [xe + 0.3, yy, zz], 0.2, 12, o[1]); });
      /* faisceaux */
      function pt(x, y, z){ return v.p(x, y, z); }
      v.render(ctx);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
      function beam(P, a){ ctx.strokeStyle = "rgba(220,230,255," + (0.22 * a) + ")"; ctx.lineWidth = 5; ctx.beginPath(); P.forEach(function(p, j){ var q = pt(p[0], p[1], p[2]); if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.stroke(); }
      beam([[-3.6, 0, 0], [xs[0] - len / 2, 0, 0]], 1);
      for (i = 0; i < n; i++){
        var th2 = A[i], c0 = cen[i], xo = xs[i] + len / 2, xn = i < n - 1 ? xs[i + 1] - len / 2 : xe;
        [1, -1].forEach(function(sg){
          var keep = sg > 0 || i === n - 1, ex = keep ? xn : xo + 0.55, f2 = i === n - 1 ? 1.6 : 1;
          beam([[xs[i] - len / 2, c0[0], c0[1]], [xo, c0[0] + sg * gap * 0.5 * Math.cos(th2), c0[1] + sg * gap * 0.5 * Math.sin(th2)], [ex, c0[0] + sg * gap * f2 * Math.cos(th2), c0[1] + sg * gap * f2 * Math.sin(th2)]], keep ? 1 : 0.6);
          if (keep && i < n - 1 && sg > 0) beam([[ex, cen[i + 1][0], cen[i + 1][1]], [xs[i + 1] - len / 2, cen[i + 1][0], cen[i + 1][1]]], 1);
        });
      }
      ctx.restore();
      /* atomes : position le long du chemin, selon les résultats */
      flyC.forEach(function(q){
        var segL = 1 / n, i2 = Math.min(n - 1, Math.floor(q.s / segL)), u = (q.s - i2 * segL) / segL, c0 = cen[i2], th3 = A[i2];
        var xa = i2 === 0 ? -3.6 : xs[i2 - 1] + len / 2 + 0.55, xb = i2 < n - 1 ? xs[i2] + len / 2 + 0.55 : xe, x = xa + u * (xb - xa), y = c0[0], z = c0[1];
        if (x > xs[i2] - len / 2){ var w = Math.min(1, (x - (xs[i2] - len / 2)) / (len + 0.55)), sg = q.out[i2] || 1, ff = i2 === n - 1 ? 1.6 : 1; y += sg * gap * w * ff * Math.cos(th3); z += sg * gap * w * ff * Math.sin(th3); }
        var pp = pt(x, y, z); qglow(ctx, pp.x, pp.y, 8, "#e8eef8", 0.8); qball(ctx, pp.x, pp.y, 2.4, "#c8d0dc");
      });
      for (i = 0; i < n; i++){ var lb = v.p(xs[i], cen[i][0] + 0.75, cen[i][1]); qtag(S, c, i === 1 && chS.value !== "zz" ? "aimant θ = " + qN(t2S.value, 0) + "°" : "aimant z", lb.x, lb.y - 6, {size:10.5}); }
      var e0 = v.p(xe + 0.15, cl[0] - 1.0, cl[1]); qtag(S, c, "compteurs + / −", e0.x, e0.y, {size:10.5, align:"right"});
    }
    function drawPlate(){
      var g = f.ctx, FW = f.W, FH = f.H, mx = 12, i;
      g.fillStyle = "#f4f6fa"; g.fillRect(0, 0, FW, FH);
      var pw = FW - 2 * mx - (phone ? 0 : 0), ph = FH - 58, py = 26;
      qT(S, f, "Plaque vue de face (dépôt d'argent)", mx, 13, {size:qfz(f, 12.5), color:"#13233a", align:"left"});
      qT(S, f, nDep + " atomes", FW - mx, 13, {size:qfz(f, 12), color:"#2f6fd6", align:"right"});
      g.save(); qrr(g, mx, py, pw, ph, 8); var gg = g.createLinearGradient(0, py, 0, py + ph); gg.addColorStop(0, "#e3f0f6"); gg.addColorStop(1, "#c9dde8"); g.fillStyle = gg; g.fill(); g.clip();
      if (tex) g.drawImage(tex, mx, py, pw, ph);
      /* prévision classique : enveloppe de la traînée continue */
      if (clT.value){
        var vm = sgVmean(tS.value), th = thS.value * PI / 180, muC = atS.value === "j1" ? 2 * MUB : SG.g * 0.5 * MUB;   /* moment classique de même valeur maximale */
        g.setLineDash([6, 4]); g.strokeStyle = "#c26a0c"; g.lineWidth = 1.8; g.beginPath();
        for (i = 0; i <= 60; i++){ var xx = -SG.slit + 2 * SG.slit * i / 60, G = gS.value * Math.max(0, 1 - Math.pow(xx / (SG.slit * 1.12), 2)), d = sgDev(muC, vm, G);
          var X = mx + (xx / SG.X + 1) / 2 * pw + d * Math.sin(th) / SG.X / 2 * pw, Y = py + (1 - (d * Math.cos(th) / ZH() + 1) / 2) * ph; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }
        for (i = 60; i >= 0; i--){ var x2 = -SG.slit + 2 * SG.slit * i / 60, G2 = gS.value * Math.max(0, 1 - Math.pow(x2 / (SG.slit * 1.12), 2)), d2 = -sgDev(muC, vm, G2);
          g.lineTo(mx + (x2 / SG.X + 1) / 2 * pw + d2 * Math.sin(th) / SG.X / 2 * pw, py + (1 - (d2 * Math.cos(th) / ZH() + 1) / 2) * ph); }
        g.closePath(); g.fillStyle = "rgba(226,140,40,.13)"; g.fill(); g.stroke(); g.setLineDash([]);
      }
      g.restore();
      /* graduations (mm) */
      [-0.4, -0.2, 0, 0.2, 0.4].forEach(function(xv){ var X = mx + (xv * 1e-3 / SG.X + 1) / 2 * pw; qT(S, f, qN(xv, 1), X, py + ph + 11, {size:qfz(f, 10.5), color:"#5f6b7a", weight:600}); });
      qT(S, f, "x (mm)", FW - mx, py + ph + (phone && clT.value ? 11 : 22), {size:qfz(f, 10.5), color:"#5f6b7a", align:"right"});
      (atS.value === "j1" ? [-0.8, -0.4, 0, 0.4, 0.8] : [-0.4, 0, 0.4]).forEach(function(zv){ var Y = py + (1 - (zv * 1e-3 / ZH() + 1) / 2) * ph; qT(S, f, (zv > 0 ? "+" : "") + qN(zv, 1), mx + 4, Y, {size:qfz(f, 10), color:"#5f6b7a", align:"left", weight:600}); });
      if (clT.value) qT(S, f, "zone orange : prévision classique pour v moyenne", mx, py + ph + 22, {size:qfz(f, 10.5), color:"#c26a0c", align:"left"});
      /* afficheurs */
      /* pic du dépôt (centre de la fente) : d ∝ 1/v², v tirée d'un jet effusif → maximum pour v = √(6kT/m) */
      relab(LAB1);
      var vm2 = sgVmean(tS.value), vp = Math.sqrt(6 * KB * tS.value / SG.m), d0 = sgDev(SG.g * 0.5 * MUB, vp, gS.value), dj = sgDev(2 * MUB, vp, gS.value);
      ro.set(0, qN(vm2, 0) + " m/s");
      ro.set(1, atS.value === "j1" ? "0 et ± " + qN(dj * 1e3, 3) + " mm" : (atS.value === "cl" ? "jusqu'à ± " : "± ") + qN(d0 * 1e3, 3) + " mm");
      ro.set(2, String(nDep));
      ro.set(3, atS.value === "ag" ? "± " + qN(SG.g / 2, 3) + " μ_B" : atS.value === "j1" ? "−2, 0, +2 μ_B" : "continu");
      nt.set("Force F_z = μ_z·dB/dz, déviation Δz = (F_z/m)·(L/v²)·(L/2 + D) avec L = " + qN(SG.L * 100, 1) + " cm (aimant) et D = " + qN(SG.D * 100, 1) + " cm (jusqu'à la plaque). Pour v moyenne (" + qN(vm2, 0) + " m/s), Δz = " + qN(sgDev(atS.value === "j1" ? 2 * MUB : SG.g * 0.5 * MUB, vm2, gS.value) * 1e3, 3) + " mm" + (atS.value === "j1" ? " (m = ±1)" : atS.value === "cl" ? " au plus" : "") + ". Les atomes lents sont plus déviés, d'où des taches étirées ; le gradient est plus faible aux bords de la fente, d'où la forme en lèvres." + (atS.value === "j1" ? " Modèle : J = 1, g_J = 2, même masse et même vitesse que l'argent." : ""), atS.value === "cl" ? "warn" : "ok");
    }
    function drawCounts(){
      var g = f.ctx, FW = f.W, FH = f.H, mx = 14, A = axes(), n = A.length, th = t2S.value * PI / 180;
      g.fillStyle = "#f4f6fa"; g.fillRect(0, 0, FW, FH);
      var last = n === 2 ? (chS.value === "zz" ? "z" : "θ") : "z";
      var pP = n === 2 && chS.value === "zz" ? 1 : Math.pow(Math.cos(th / 2), 2);
      qT(S, f, "Sortie du dernier aimant (mesure selon " + last + ")", mx, 14, {size:qfz(f, 12.5), color:"#13233a", align:"left"});
      var tot = cnt.p + cnt.m, bw = Math.min(110, (FW - 2 * mx) / 4), base = FH - 36, hmax = FH - 84;
      [[cnt.p, pP, "+", "#2e9e6a"], [cnt.m, 1 - pP, "−", "#c0392b"]].forEach(function(o, j){
        var x = FW / 2 + (j ? 0.25 : -1.25) * bw * 1.4, frac = tot ? o[0] / tot : 0, h = frac * hmax;
        var gr = g.createLinearGradient(x, 0, x + bw, 0); gr.addColorStop(0, qshade(o[3], -0.25)); gr.addColorStop(0.5, qshade(o[3], 0.2)); gr.addColorStop(1, qshade(o[3], -0.35));
        g.fillStyle = gr; g.fillRect(x, base - h, bw, h);
        S.draw.line(f, x - 6, base - o[1] * hmax, x + bw + 6, base - o[1] * hmax, "#13233a", 2, [5, 4]);
        qT(S, f, "voie " + o[2] + " : " + o[0], x + bw / 2, base + 14, {size:qfz(f, 12), color:o[3]});
        qT(S, f, (tot ? qN(frac * 100, 0) : "—") + " %", x + bw / 2, Math.max(44, base - h - 10), {size:qfz(f, 12), color:"#13233a", halo:true});
      });
      S.draw.line(f, mx, base, FW - mx, base, "#a3adba", 1);
      qT(S, f, "- - prévu : " + qN(pP * 100, 0) + " % / " + qN((1 - pP) * 100, 0) + " %", FW - mx, 30, {size:qfz(f, 11), color:"#13233a", align:"right"});
      relab(LAB2);
      ro.set(0, "voie + gardée");
      ro.set(1, "P(+) = cos²(Δθ/2)");
      ro.set(2, String(tot) + " (arrêtés : " + cnt.b + ")");
      ro.set(3, "± " + qN(SG.g / 2, 3) + " μ_B");
      nt.set(chS.value === "zz" ? "Deux mesures selon z à la suite : les atomes gardés (voie +) sortent tous dans la voie + : la mesure est reproductible." :
        chS.value === "zx" ? "Un atome trié « + selon z » mesuré selon un axe à θ = " + qN(t2S.value, 0) + "° : P(+) = cos²(θ/2) = " + qN(pP * 100, 1) + " %." :
        "Le 2e aimant (θ = " + qN(t2S.value, 0) + "°) a remplacé l'état « + selon z » par « ± selon θ » : au 3e aimant, P(+z) = cos²(θ/2) = " + qN(pP * 100, 1) + " %. Avec θ = 90°, le premier tri est complètement effacé.", "ok");
    }
    showCtl();
  }
});

})();
