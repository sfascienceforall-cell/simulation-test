/* Chimie BA1 · lot P3-CB (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-kirchhoff · ch-catalyse-heterogene · ch-transfert-proton · ch-pile-daniell-zoom · ch-electrode-hydrogene
   Fichier autonome : toutes les aides sont ici, préfixe cb. */
(function(){
var PI = Math.PI;

/* ---------- aides de dessin (préfixe cb) ---------- */
function cbHex(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function cbShade(hex, f){
  var c = cbHex(hex);
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function cbRgba(hex, a){ var c = cbHex(hex); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
function cbBall(ctx, x, y, r, hex, alpha){
  if (!(r > 0.4)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, cbShade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, cbShade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
function cbRR(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function cbFmt(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
function cbSigned(x, d){ var s = cbFmt(x, d); return (x > 0 && s.replace(/[0,]/g, "") !== "") ? "+" + s : s; }
var SUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻", "−":"⁻", "+":"⁺", ",":"˒"};
function cbSup(n){ return String(n).split("").map(function(c){ return SUP[c] || c; }).join(""); }
/* 3,7·10⁻¹⁴ en texte simple */
function cbSci(x, d){
  if (!isFinite(x) || x === 0) return cbFmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.9995){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return cbFmt(x, Math.max(0, d - e));
  return cbFmt(m, d) + "·10" + cbSup(e);
}
function cbFont(w, s){ return w + " " + Math.round(s) + "px Mulish, system-ui, sans-serif"; }
function cbText(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = cbFont(o.w || 700, o.size || 12); ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.halo){ ctx.lineJoin = "round"; ctx.lineWidth = o.hw || 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.fillText(s, x, y); ctx.restore();
}
function cbTw(ctx, s, size, w){ ctx.save(); ctx.font = cbFont(w || 700, size); var m = ctx.measureText(s).width; ctx.restore(); return m; }
/* pastille de texte ; renvoie {x0, y0, w, h} */
function cbTag(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 11.5;
  ctx.save(); ctx.font = cbFont(o.w || 800, size);
  var w = ctx.measureText(s).width + 14, h = size + 9, al = o.align || "center";
  var x0 = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  if (o.clampW){ x0 = Math.max(4, Math.min(o.clampW - w - 4, x0)); }
  cbRR(ctx, x0, y - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "rgba(255,255,255,.93)"; ctx.fill();
  if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x0 + w / 2, y + 0.5);
  ctx.restore(); return {x0:x0, y0:y - h / 2, w:w, h:h};
}
/* texte sur plusieurs lignes ; renvoie le nombre de lignes */
function cbWrap(ctx, s, x, y, maxW, lh, o){
  o = o || {}; ctx.save(); ctx.font = cbFont(o.w || 700, o.size || 12);
  var words = s.split(" "), lines = [], cur = "";
  words.forEach(function(wd){ var t = cur ? cur + " " + wd : wd; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = wd; } else cur = t; });
  if (cur) lines.push(cur);
  ctx.restore();
  if (!o.measure) lines.forEach(function(L, i){ cbText(ctx, L, x, y + i * lh, o); });
  return lines.length;
}
function cbArrow(ctx, x1, y1, x2, y2, col, w, head){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
  var a = Math.atan2(dy, dx), h = Math.min(head || (7 + w * 1.6), L * 0.6);
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
  ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill(); ctx.restore();
}
function cbShadow(ctx, x, y, rx, ry, a){ ctx.save(); ctx.fillStyle = "rgba(0,0,0," + (a || 0.3) + ")"; ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, 7); ctx.fill(); ctx.restore(); }
/* canevas dont la hauteur suit la largeur (plus haut sur téléphone) ; jamais de hauteur nulle */
function cbCanvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = (w > 0 && w < 480) ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
/* rotation de vue : lacet a, tangage b (b > 0 : vu d'en haut) */
function cbRot(p, a, b){
  var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1];
  return [x, y * cb - z * sb, y * sb + z * cb];
}
/* rotation autour d'un axe unitaire (Rodrigues) */
function cbRotAx(v, a, th){
  var c0 = Math.cos(th), s0 = Math.sin(th), d = v[0] * a[0] + v[1] * a[1] + v[2] * a[2];
  return [v[0] * c0 + (a[1] * v[2] - a[2] * v[1]) * s0 + a[0] * d * (1 - c0), v[1] * c0 + (a[2] * v[0] - a[0] * v[2]) * s0 + a[1] * d * (1 - c0), v[2] * c0 + (a[0] * v[1] - a[1] * v[0]) * s0 + a[2] * d * (1 - c0)];
}
function cbOut(sl, html){ var o = sl.el && sl.el.parentNode ? sl.el.parentNode.querySelector("output") : null; if (o) o.innerHTML = html; }
function cbSmooth(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function cbHash(i, j){ var x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); }
function cbClamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
/* boîte 3D (faces visibles seulement) ; P : projection monde → écran {x, y, z} ; cols : [haut, côtés] */
function cbBox(ctx, P, x0, x1, y0, y1, z0, z1, col, a, b, o){
  o = o || {};
  var V = [];
  for (var i = 0; i < 8; i++) V.push(P([i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0]));
  var F = [[[0, 1, 3, 2], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, 1]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 3, 7, 6], [0, 1, 0]], [[0, 2, 6, 4], [-1, 0, 0]], [[1, 3, 7, 5], [1, 0, 0]]];
  var L = [-0.45, 0.75, 0.5];
  F.forEach(function(f){
    var n = cbRot(f[1], a, b); if (n[2] <= 0.002) return;
    var lit = 0.35 + 0.65 * Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
    ctx.beginPath(); f[0].forEach(function(vi, j){ j ? ctx.lineTo(V[vi].x, V[vi].y) : ctx.moveTo(V[vi].x, V[vi].y); }); ctx.closePath();
    var g = ctx.createLinearGradient(V[f[0][0]].x, V[f[0][0]].y, V[f[0][2]].x, V[f[0][2]].y);
    g.addColorStop(0, cbShade(col, (lit - 0.62) * 0.9 + 0.12)); g.addColorStop(1, cbShade(col, (lit - 0.62) * 0.9 - 0.1));
    ctx.fillStyle = g; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fill(); ctx.globalAlpha = 1;
    if (o.edge !== false){ ctx.strokeStyle = o.edge || "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.stroke(); }
  });
  return V;
}
/* petit personnage en volume (vu de côté), pieds en (x, y) ; h = taille ; ph = phase de marche */
function cbWalker(ctx, x, y, h, ph, dir, col){
  var s = h / 60, sw = Math.sin(ph) * 0.5;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir < 0 ? -s : s, s);
  cbShadow(ctx, 0, 1, 13, 3.2, 0.28);
  ctx.lineCap = "round"; ctx.strokeStyle = "#233047"; ctx.lineWidth = 6;
  /* jambes */
  ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(Math.sin(sw) * 12, 0); ctx.moveTo(0, -22); ctx.lineTo(-Math.sin(sw) * 12, 0); ctx.stroke();
  /* corps */
  var g = ctx.createLinearGradient(-8, -46, 8, -20); g.addColorStop(0, cbShade(col, 0.35)); g.addColorStop(1, cbShade(col, -0.3));
  ctx.fillStyle = g; cbRR(ctx, -8, -46, 16, 27, 7); ctx.fill();
  /* bras */
  ctx.strokeStyle = cbShade(col, -0.15); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-Math.sin(sw) * 11 + 2, -24); ctx.moveTo(0, -40); ctx.lineTo(Math.sin(sw) * 11 + 2, -24); ctx.stroke();
  /* tête */
  var gh = ctx.createRadialGradient(-2, -57, 1, 0, -54, 9); gh.addColorStop(0, "#ffe0c7"); gh.addColorStop(1, "#d79a74");
  ctx.fillStyle = gh; ctx.beginPath(); ctx.arc(1, -54, 8.5, 0, 7); ctx.fill();
  ctx.fillStyle = "#3a2618"; ctx.beginPath(); ctx.arc(0, -57, 8.6, PI * 1.05, PI * 1.95); ctx.fill();
  ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.arc(5, -54, 1.2, 0, 7); ctx.fill();
  ctx.restore();
}

/* =====================================================================
   1. Cycle de Kirchhoff : ΔH à une autre température (c05)
   ===================================================================== */
/* Cp,m à 298 K (J·mol⁻¹·K⁻¹), ΔrH° à 298 K (kJ/mol) : tables usuelles, Cp supposés constants */
var KREAC = {
  nh3:{nom:"synthèse de l'ammoniac", eq:"N₂ + 3 H₂ → 2 NH₃", dH:-92.22, T:700,
       R:[[1, "N₂", 29.12, "#4f6fd9", 2], [3, "H₂", 28.82, "#e8edf3", 2]], P:[[2, "NH₃", 35.06, "#4f6fd9", 4]]},
  vap:{nom:"vaporeformage du méthane", eq:"CH₄ + H₂O → CO + 3 H₂", dH:206.10, T:1000,
       R:[[1, "CH₄", 35.31, "#4a5568", 5], [1, "H₂O", 33.58, "#d6392f", 3]], P:[[1, "CO", 29.14, "#4a5568", 2], [3, "H₂", 28.82, "#e8edf3", 2]]},
  h2o:{nom:"combustion du dihydrogène", eq:"H₂ + ½ O₂ → H₂O(g)", dH:-241.82, T:1000,
       R:[[1, "H₂", 28.82, "#e8edf3", 2], [0.5, "O₂", 29.36, "#d6392f", 2]], P:[[1, "H₂O", 33.58, "#d6392f", 3]]}
};
function kCp(list){ var s = 0; list.forEach(function(e){ s += e[0] * e[2]; }); return s; }
function kSteps(R, T2){
  var cr = kCp(R.R), cp = kCp(R.P), d = T2 - 298;
  var h1 = cr * (298 - T2) / 1000, h3 = cp * d / 1000;
  return {cr:cr, cp:cp, dCp:cp - cr, h1:h1, h2:R.dH, h3:h3, dHT:h1 + R.dH + h3};
}

SFA.sim({
  id:"ch-kirchhoff", ch:"c05", tag:"Thermochimie",
  titre:"ΔH à une autre température : le cycle de Kirchhoff",
  resume:"Un escalier d'enthalpie en 3D : on refroidit les réactifs jusqu'à 298 K, on fait la réaction à 298 K (valeur des tables), puis on réchauffe les produits. Fais glisser T₂ : seules les marches « chauffer / refroidir » changent, et ΔH(T₂) suit la droite de pente ΔCp.",
  but:"Regarde le petit personnage parcourir le cycle : marche 1, refroidir les réactifs de T₂ à 298 K ; marche 2, la réaction à 298 K (ΔH° des tables) ; marche 3, réchauffer les produits jusqu'à T₂. Le chemin direct (flèche orange) a la même variation d'enthalpie. Fais glisser le thermomètre (ou le curseur T₂) et glisse sur l'escalier pour le tourner. Compare la synthèse de l'ammoniac (ΔCp < 0) au vaporeformage (ΔCp > 0).",
  aRetenir:"H est une fonction d'état : ΔH(T₂) = ΔH₁ + ΔH°(298 K) + ΔH₃, avec ΔH₁ = Cp(réactifs)·(298 K − T₂) et ΔH₃ = Cp(produits)·(T₂ − 298 K). En regroupant : ΔH(T₂) = ΔH°(298 K) + ΔCp·(T₂ − 298 K), où ΔCp = ΣCp(produits) − ΣCp(réactifs), chaque Cp multiplié par son coefficient. Si ΔCp < 0, ΔH diminue quand T monte (une réaction exothermique le devient davantage) ; si ΔCp > 0, ΔH augmente. Pour N₂ + 3 H₂ → 2 NH₃ : ΔCp = −45,5 J/K, et ΔH passe de −92,2 kJ à 298 K à −110,5 kJ à 700 K.",
  piege:"ΔCp est en J/K et ΔH en kJ : divise par 1000 avant d'additionner. N'oublie pas les coefficients (3 H₂ compte trois fois Cp(H₂)). La formule suppose des Cp constants et aucun changement d'état entre 298 K et T₂ : si l'eau se condense, il faut une marche de plus (l'enthalpie de vaporisation). Enfin, l'effet est souvent modeste : quelques dizaines de kJ pour 400 K d'écart.",
  build:function(k, S){
    var c = cbCanvas(k, 1.0, 1.32);
    var st = {t:0, a:-0.3, b:0.3, walk:0, drag:null, T:700};
    var rS = k.seg("Réaction (1 mol d'avancement)", [["nh3", "Synthèse de NH₃"], ["vap", "Vaporeformage"], ["h2o", "Combustion de H₂"]], "nh3", function(v){ st.T = KREAC[v].T; tS.set(st.T); st.walk = 0; });
    var tS = k.slider("Température T₂ de la réaction", 298, 1000, 1, 700, "K", function(v){ st.T = v; });
    var aT = k.toggle("Le personnage parcourt le cycle", true);
    var ro = k.readouts(["ΔH₁ : refroidir les réactifs", "ΔH° à 298 K (tables)", "ΔH₃ : réchauffer les produits", "ΔH(T₂) = ΔH₁ + ΔH° + ΔH₃", "ΔCp = ΣCp(produits) − ΣCp(réactifs)"]);
    var nt = k.note("", "ok");

    /* ---------- souris : thermomètre (T₂) ou rotation de la vue ---------- */
    var thermo = {x:0, y0:0, y1:0, w:0};
    c.pointer(function(type, p){
      if (type === "down"){
        if (p.x > thermo.x - 22 && p.x < thermo.x + 22 && p.y > thermo.y0 - 16 && p.y < thermo.y1 + 22){ st.drag = "T"; setT(p.y); return; }
        st.drag = "v"; st.lx = p.x; st.ly = p.y;
      }
      if (type === "drag"){
        if (st.drag === "T") setT(p.y);
        else if (st.drag === "v"){ st.a = cbClamp(st.a + (p.x - st.lx) * 0.01, -0.7, 0.3); st.b = cbClamp(st.b + (p.y - st.ly) * 0.008, 0.08, 0.5); st.lx = p.x; st.ly = p.y; }
      }
      if (type === "up") st.drag = null;
      if (type === "move"){ var on = p.x > thermo.x - 22 && p.x < thermo.x + 22 && p.y > thermo.y0 - 16 && p.y < thermo.y1 + 22; c.cv.style.cursor = on ? "ns-resize" : "grab"; }
    });
    c.cv.style.cursor = "grab";
    function setT(y){ var f = cbClamp((thermo.y1 - y) / (thermo.y1 - thermo.y0), 0, 1); st.T = Math.round(298 + f * 702); tS.set(st.T); k.redraw(); }

    var lp = k.loop(function(dt){
      st.t += dt;
      if (aT.value) st.walk = (st.walk + dt / 9) % 1;
      k.redraw();
    });
    lp.play();

    /* molécule miniature (boules) posée sur une marche */
    function mol(ctx, x, y, r, sp, t, amp){
      var n = sp[4], col = sp[3], jx = Math.sin(t * 11 + x) * amp, jy = Math.cos(t * 13 + y) * amp * 0.6;
      x += jx; y += jy;
      cbShadow(ctx, x, y + r * 1.7, r * 1.6, r * 0.45, 0.22);
      if (sp[1] === "NH₃"){ [[-0.8, 0.35], [0.8, 0.35], [0, 0.75]].forEach(function(q){ cbBall(ctx, x + q[0] * r, y + q[1] * r, r * 0.55, "#e8edf3"); }); cbBall(ctx, x, y - r * 0.1, r * 0.95, col); }
      else if (sp[1] === "CH₄"){ [[-0.85, 0.45], [0.85, 0.45], [0, -0.9], [0.1, 0.9]].forEach(function(q){ cbBall(ctx, x + q[0] * r, y + q[1] * r, r * 0.55, "#e8edf3"); }); cbBall(ctx, x, y, r * 0.95, col); }
      else if (sp[1] === "H₂O"){ cbBall(ctx, x - r * 0.85, y + r * 0.45, r * 0.55, "#e8edf3"); cbBall(ctx, x + r * 0.85, y + r * 0.45, r * 0.55, "#e8edf3"); cbBall(ctx, x, y, r * 0.95, col); }
      else if (sp[1] === "CO"){ cbBall(ctx, x - r * 0.55, y, r * 0.85, "#4a5568"); cbBall(ctx, x + r * 0.55, y, r * 0.85, "#d6392f"); }
      else { var rr = sp[1] === "H₂" ? r * 0.62 : r * 0.85, cc = sp[1] === "H₂" ? "#e8edf3" : col; cbBall(ctx, x - rr * 0.7, y, rr, cc); cbBall(ctx, x + rr * 0.7, y, rr, cc); }
    }
    function fmtKJ(v){ return cbSigned(v, 1) + " kJ"; }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, R = KREAC[rS.value], T2 = st.T, Q = kSteps(R, T2);
      ctx.clearRect(0, 0, W, H);
      /* ---------- décor : hall d'usine sombre, sol en carrelage ---------- */
      var gH = H * 0.7;            /* hauteur de la scène 3D */
      var bg = ctx.createLinearGradient(0, 0, 0, gH); bg.addColorStop(0, "#1d2a40"); bg.addColorStop(0.7, "#2c3d59"); bg.addColorStop(1, "#3b4d6b");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, gH);
      /* silhouettes de cuves et de tuyaux au fond */
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = "#0d1626";
      for (var i = 0; i < 6; i++){ var xx = W * (0.08 + i * 0.17), hh = gH * (0.35 + 0.18 * cbHash(i, 2)), ww = W * 0.07; cbRR(ctx, xx, gH * 0.62 - hh, ww, hh + gH * 0.4, ww * 0.45); ctx.fill(); }
      ctx.fillRect(0, gH * 0.28, W, 5); ctx.fillRect(0, gH * 0.34, W, 3);
      ctx.restore();

      /* ---------- géométrie de l'escalier ---------- */
      /* hauteurs : origine = réactifs à 298 K ; échelle fixe pour la réaction (T₂ de 298 à 1000 K) */
      var Qmax = kSteps(R, 1000), lv = [-Q.h1, 0, R.dH, R.dH + Q.h3];
      var all = [0, -Qmax.h1, R.dH, R.dH + Qmax.h3], hmin = Math.min.apply(null, all), hmax = Math.max.apply(null, all);
      var span = hmax - hmin, floorH = hmin - span * 0.12;
      var colW = 1, gap = 0.08, depth = 0.95, unitH = 2.5 / span;      /* 2,5 unités de hauteur pour toute l'étendue */
      function Y(h){ return (h - floorH) * unitH; }
      var Ytop = Y(hmax), xMid = 2 * (colW + gap) - gap / 2, Xend = 4 * (colW + gap) - gap;
      /* cadrage automatique : toutes les arêtes des colonnes et la flèche directe tiennent dans la zone libre */
      var zx0 = ph ? 50 : 62, zx1 = W - 10, zy0 = ph ? 44 : 48, zy1 = gH - (ph ? 34 : 38);
      var pts = [];
      [0, Xend].forEach(function(xx){ [0, Ytop].forEach(function(yy){ [-depth / 2, depth / 2].forEach(function(zz){ pts.push([xx, yy, zz]); }); }); });
      pts.push([xMid, Ytop + 0.75, 0]);
      var bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
      pts.forEach(function(p){ var q = cbRot([p[0] - xMid, p[1] - Ytop / 2, p[2]], st.a, st.b); bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]); by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]); });
      var sc = Math.min((zx1 - zx0) / (bx1 - bx0), (zy1 - zy0) / (by1 - by0)) * 0.9;
      var cx = (zx0 + zx1) / 2 - (bx0 + bx1) / 2 * sc, cy = (zy0 + zy1) / 2 + (by0 + by1) / 2 * sc;
      function P(p){ var q = cbRot([p[0] - xMid, p[1] - Ytop / 2, p[2]], st.a, st.b), s = 1 / (1 - q[2] * 0.03); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2]}; }
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, gH); ctx.clip();
      /* sol */
      var f0 = P([-0.6, 0, -1.2]), f1 = P([4 * (colW + gap) + 0.5, 0, -1.2]), f2 = P([4 * (colW + gap) + 0.5, 0, 1.9]), f3 = P([-0.6, 0, 1.9]);
      var gf = ctx.createLinearGradient(0, Math.min(f0.y, f1.y), 0, Math.max(f2.y, f3.y)); gf.addColorStop(0, "#56657f"); gf.addColorStop(1, "#7d8ba3");
      ctx.fillStyle = gf; ctx.beginPath(); ctx.moveTo(f0.x, f0.y); ctx.lineTo(f1.x, f1.y); ctx.lineTo(f2.x, f2.y); ctx.lineTo(f3.x, f3.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.08)"; ctx.lineWidth = 1;
      for (var gx = -0.6; gx <= 4 * (colW + gap) + 0.5; gx += 0.45){ var a1 = P([gx, 0, -1.2]), a2 = P([gx, 0, 1.9]); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke(); }
      for (var gz = -1.2; gz <= 1.9; gz += 0.45){ var b1 = P([-0.6, 0, gz]), b2 = P([4 * (colW + gap) + 0.5, 0, gz]); ctx.beginPath(); ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.stroke(); }

      /* colonnes : réactifs T₂ (chaud), réactifs 298 K, produits 298 K, produits T₂ (chaud) */
      var cols = [{h:lv[0], col:"#e0793a", hot:true, sp:R.R, lab:"réactifs", T:T2},
                  {h:lv[1], col:"#4a86c9", hot:false, sp:R.R, lab:"réactifs", T:298},
                  {h:lv[2], col:"#3f9b6e", hot:false, sp:R.P, lab:"produits", T:298},
                  {h:lv[3], col:"#e0793a", hot:true, sp:R.P, lab:"produits", T:T2}];
      var order = cols.map(function(cl, i){ var q = P([i * (colW + gap) + colW / 2, 0, 0]); return {i:i, z:q.z}; }).sort(function(u, v){ return u.z - v.z; });
      var tops = [];
      cols.forEach(function(cl, i){ var x0 = i * (colW + gap); tops[i] = {x0:x0, x1:x0 + colW, y:Y(cl.h)}; });
      order.forEach(function(o){
        var cl = cols[o.i], tp = tops[o.i], hue = cl.hot ? (T2 > 300 ? cl.col : "#4a86c9") : cl.col;
        cbBox(ctx, P, tp.x0, tp.x1, 0, Math.max(0.02, tp.y), -depth / 2, depth / 2, hue, st.a, st.b, {edge:"rgba(255,255,255,.28)"});
        /* molécules sur la marche, agitées selon T */
        var amp = 0.6 + 2.6 * Math.sqrt(cl.T / 1000), n = 0, list = [];
        cl.sp.forEach(function(sp){ var m = Math.max(1, Math.round(sp[0] * (sp[0] < 1 ? 2 : 1))); for (var j = 0; j < m; j++) list.push(sp); });
        list.forEach(function(sp, j){
          var u = (j + 0.5) / list.length, zz = -0.25 + 0.5 * ((j % 2) ? 0.15 : 0.75);
          var q = P([tp.x0 + 0.15 + u * 0.7, tp.y + 0.16, zz]);
          mol(ctx, q.x, q.y, Math.max(3.5, sc * 0.085), sp, st.t + o.i * 1.7 + j, amp * (ph ? 0.8 : 1));
          n++;
        });
      });

      /* ---------- flèches des marches ---------- */
      var lbl = ph ? 10 : 11.5;
      function stepArrow(i, txt, colr){
        var A = P([tops[i].x1 + gap / 2, tops[i].y, depth / 2 + 0.08]), B = P([tops[i + 1].x0 - gap / 2, tops[i + 1].y, depth / 2 + 0.08]);
        if (Math.abs(B.y - A.y) > 6) cbArrow(ctx, A.x, A.y, B.x, B.y, colr, ph ? 2.6 : 3.2);
        return {x:(A.x + B.x) / 2, y:(A.y + B.y) / 2};
      }
      var m1 = stepArrow(0, "", "#ffd08a"), m2 = stepArrow(1, "", "#ffffff"), m3 = stepArrow(2, "", "#ffd08a");
      /* chemin direct : arche orange au-dessus de l'escalier (même ΔH que les trois marches) */
      var D0 = P([tops[0].x0 + colW * 0.5, tops[0].y + 0.05, 0]), D1 = P([tops[3].x0 + colW * 0.5, tops[3].y + 0.05, 0]);
      var Dc = P([xMid, Ytop + 1.15, 0]);
      ctx.save(); ctx.strokeStyle = "rgba(255,154,46,.95)"; ctx.lineWidth = ph ? 3.2 : 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(D0.x, D0.y); ctx.quadraticCurveTo(Dc.x, Dc.y, D1.x, D1.y); ctx.stroke(); ctx.restore();
      var tq = 0.94, ex = (1 - tq) * (1 - tq) * D0.x + 2 * (1 - tq) * tq * Dc.x + tq * tq * D1.x, ey = (1 - tq) * (1 - tq) * D0.y + 2 * (1 - tq) * tq * Dc.y + tq * tq * D1.y;
      cbArrow(ctx, ex, ey, D1.x, D1.y, "#ff9a2e", ph ? 3.2 : 4, 13);
      var md = {x:0.25 * D0.x + 0.5 * Dc.x + 0.25 * D1.x, y:0.25 * D0.y + 0.5 * Dc.y + 0.25 * D1.y};
      /* ---------- le personnage parcourt le cycle ---------- */
      var wph = st.walk, seg = Math.floor(wph * 4), u = wph * 4 - seg, wx, wy, hop = 0;
      /* 4 phases : marcher sur la marche i (65 %) puis sauter vers la suivante (35 %) ; la 4e revient par le chemin direct */
      if (seg < 3){
        var tA = tops[seg], tB = tops[seg + 1];
        if (u < 0.65){ wx = tA.x0 + 0.15 + (colW - 0.25) * (u / 0.65); wy = tA.y; }
        else { var v = (u - 0.65) / 0.35; wx = tA.x1 - 0.1 + (tB.x0 + 0.12 - tA.x1 + 0.1) * v; wy = tA.y + (tB.y - tA.y) * v; hop = Math.sin(v * PI) * 0.35; }
      } else {
        wx = tops[3].x0 + 0.2 + (colW - 0.3) * Math.min(1, u * 2); wy = tops[3].y;
      }
      var fade = seg === 3 ? 1 - cbSmooth((u - 0.6) / 0.35) : seg === 0 ? cbSmooth(u / 0.12) : 1;
      if (aT.value && fade > 0.02){
        var WP = P([wx, wy + hop, 0.05]);
        ctx.save(); ctx.globalAlpha = fade; cbWalker(ctx, WP.x, WP.y, Math.max(26, sc * 0.5), st.t * 9, 1, "#7b5cd6"); ctx.restore();
      }
      var active = seg < 3 && u >= 0.5 ? seg : -1;

      /* ---------- étiquettes des marches (dans la zone libre au-dessus) ---------- */
      function lab(m, txt, on, dx, dy){
        cbTag(ctx, txt, m.x + dx, m.y + dy, {size:lbl, bg:on ? "#ffd08a" : "rgba(15,27,45,.82)", color:on ? "#3b2300" : "#fff", clampW:W});
      }
      var lift = ph ? 18 : 22;
      lab(m1, "ΔH₁ " + fmtKJ(Q.h1), active === 0, 0, 0);
      lab(m2, "ΔH° " + fmtKJ(Q.h2), active === 1, 0, 0);
      lab(m3, "ΔH₃ " + fmtKJ(Q.h3), active === 2, 0, 0);
      cbTag(ctx, "ΔH(" + Math.round(T2) + " K) = " + fmtKJ(Q.dHT), md.x, Math.min(md.y - 2, Math.min(m1.y, m2.y) - (ph ? 30 : 34)), {size:ph ? 11 : 12.5, bg:"#ff9a2e", color:"#2a1500", clampW:W});
      /* noms des colonnes, au pied */
      cols.forEach(function(cl, i){
        var q = P([tops[i].x0 + colW / 2, 0, depth / 2 + 0.12]);
        cbText(ctx, cl.lab, q.x, q.y + 11, {size:ph ? 9.5 : 11, color:"#fff", w:800, halo:"rgba(15,27,45,.85)"});
        cbText(ctx, Math.round(cl.T) + " K", q.x, q.y + (ph ? 23 : 25), {size:ph ? 9.5 : 11, color:cl.hot && T2 > 300 ? "#ffc08a" : "#bcd6ff", w:800, halo:"rgba(15,27,45,.85)"});
      });

      /* ---------- thermomètre (glisser pour régler T₂) ---------- */
      var tx = ph ? 22 : 30, ty0 = ph ? 44 : 50, ty1 = gH - (ph ? 46 : 52);
      thermo = {x:tx, y0:ty0, y1:ty1};
      var fT = (T2 - 298) / 702, yT = ty1 - fT * (ty1 - ty0);
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.92)"; cbRR(ctx, tx - 7, ty0 - 8, 14, ty1 - ty0 + 16, 7); ctx.fill();
      var gm = ctx.createLinearGradient(0, ty1, 0, ty0); gm.addColorStop(0, "#d43b2a"); gm.addColorStop(1, "#ff8a3a");
      ctx.fillStyle = gm; cbRR(ctx, tx - 3.5, yT, 7, ty1 - yT + 6, 3.5); ctx.fill();
      cbBall(ctx, tx, ty1 + 10, 10, "#d43b2a");
      ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.lineWidth = 1;
      [298, 500, 700, 900].forEach(function(T){ var yy = ty1 - (T - 298) / 702 * (ty1 - ty0); ctx.beginPath(); ctx.moveTo(tx + 7, yy); ctx.lineTo(tx + 12, yy); ctx.stroke(); });
      ctx.restore();
      cbTag(ctx, "T₂ = " + Math.round(T2) + " K", tx - 6, ty0 - 24, {size:ph ? 10.5 : 11.5, align:"left", bg:"rgba(255,255,255,.95)", color:"#a3341f"});
      if (!ph) cbText(ctx, "glisse", tx, ty1 + 28, {size:10, color:"#cfd9ea", w:700});
      /* équation */
      cbTag(ctx, R.eq, W - 8, ph ? 16 : 20, {size:ph ? 10.5 : 12, align:"right", bg:"rgba(255,255,255,.95)", color:"#0f1b2d"});

      ctx.restore();
      /* ---------- graphique ΔH(T) : une droite de pente ΔCp ---------- */
      var gy0 = gH, gh = H - gH;
      ctx.fillStyle = "#f7f9fc"; ctx.fillRect(0, gy0, W, gh);
      var L = ph ? 44 : 54, Rm = 14, Tm = gy0 + 22, Bm = H - 26;
      var vals = [R.dH, R.dH + Qmax.dCp * (1000 - 298) / 1000], vlo = Math.min.apply(null, vals), vhi = Math.max.apply(null, vals);
      var pad = Math.max(6, (vhi - vlo) * 0.25); vlo -= pad; vhi += pad;
      function GX(T){ return L + (T - 298) / 702 * (W - L - Rm); }
      function GY(v){ return Bm - (v - vlo) / (vhi - vlo) * (Bm - Tm); }
      ctx.strokeStyle = "#c9d2de"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L, Tm - 4); ctx.lineTo(L, Bm); ctx.lineTo(W - Rm, Bm); ctx.stroke();
      [300, 500, 700, 900].forEach(function(T){ var xx = GX(T); ctx.beginPath(); ctx.moveTo(xx, Bm); ctx.lineTo(xx, Bm + 4); ctx.stroke(); cbText(ctx, String(T), xx, Bm + 12, {size:10, color:"#6b7889", w:600}); });
      var stepV = (vhi - vlo) > 60 ? 20 : (vhi - vlo) > 24 ? 10 : 5, v0 = Math.ceil(vlo / stepV) * stepV, nTick = 0, nAll = Math.floor((vhi - v0) / stepV) + 1;
      for (var vv = v0; vv <= vhi && nTick < 12; vv += stepV, nTick++){ var yy2 = GY(vv); ctx.strokeStyle = "#eef1f5"; ctx.beginPath(); ctx.moveTo(L + 1, yy2); ctx.lineTo(W - Rm, yy2); ctx.stroke(); if (nAll <= 5 || nTick % 2 === 0) cbText(ctx, cbFmt(vv, 0), L - 5, yy2, {size:10, color:"#6b7889", w:600, align:"right"}); }
      cbText(ctx, "T (K)", W - Rm, Bm - 9, {size:10.5, color:"#2c3a4e", w:800, align:"right"});
      cbText(ctx, "ΔH (kJ)", L + 6, Tm - 10, {size:10.5, color:"#2c3a4e", w:800, align:"left"});
      ctx.strokeStyle = "#ff9a2e"; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(GX(298), GY(R.dH + Q.dCp * (298 - 298) / 1000)); ctx.lineTo(GX(1000), GY(R.dH + Q.dCp * (1000 - 298) / 1000)); ctx.stroke();
      var px = GX(T2), py = GY(Q.dHT);
      ctx.setLineDash([3, 3]); ctx.strokeStyle = "#a9b4c3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, Bm); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
      cbBall(ctx, px, py, 6, "#ff9a2e");
      cbBall(ctx, GX(298), GY(R.dH), 4.5, "#3f9b6e");
      var slopeTxt = "pente ΔCp = " + cbSigned(Q.dCp, 1) + " J/K";
      var right = px > W * 0.55;
      cbTag(ctx, slopeTxt, right ? L + 8 : W - Rm - 4, Tm + 8, {size:ph ? 10 : 11, align:right ? "left" : "right", bg:"rgba(255,154,46,.16)", color:"#8a4a00"});

      /* ---------- afficheurs ---------- */
      ro.set(0, fmtKJ(Q.h1)); ro.set(1, fmtKJ(Q.h2)); ro.set(2, fmtKJ(Q.h3));
      ro.set(3, cbSigned(Q.dHT, 1) + " kJ"); ro.set(4, cbSigned(Q.dCp, 2) + " J/K");
      var sens = Q.dCp < 0 ? "plus exothermique" : "plus endothermique";
      if (rS.value === "h2o") sens = Q.dCp < 0 ? "un peu plus exothermique" : "un peu plus endothermique";
      nt.set("Cp(réactifs) = " + cbFmt(Q.cr, 2) + " J/K, Cp(produits) = " + cbFmt(Q.cp, 2) + " J/K. " +
        "ΔH(" + Math.round(T2) + " K) = " + cbSigned(R.dH, 2) + " " + (Q.dCp < 0 ? "−" : "+") + " " + cbFmt(Math.abs(Q.dCp), 2) + " J/K × " + cbFmt(T2 - 298, 0) + " K / 1000 = <b>" + cbSigned(Q.dHT, 1) + " kJ</b>. " +
        (T2 > 300 ? "Ici ΔCp " + (Q.dCp < 0 ? "< 0" : "> 0") + " : en chauffant, la réaction devient " + sens + "." : "À 298 K, les marches 1 et 3 disparaissent : ΔH = ΔH° des tables.") +
        " <i>Cp supposés constants (valeurs à 298 K) ; aucun changement d'état dans l'intervalle.</i>", "ok");
    });
  }
});

/* =====================================================================
   2. Catalyse hétérogène : la surface du nickel au travail (c07)
   ===================================================================== */
var CAT_EA_SANS = 180, CAT_EA_NI = 40, CAT_DH = -136, CAT_R = 8.314;
/* profils d'énergie (kJ/mol) : extrêmes successifs, raccordés par des demi-cosinus */
var CAT_PROF = {
  sans:[[0, 0], [0.5, 180], [0.96, -136]],
  ni:[[0, 0], [0.13, -30], [0.29, 10], [0.45, -50], [0.6, -15], [0.8, -152], [0.96, -136]]
};
function catCurve(pts, x){
  if (x <= pts[0][0]) return pts[0][1];
  for (var i = 1; i < pts.length; i++) if (x <= pts[i][0]){ var u = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (1 - Math.cos(u * PI)) / 2; }
  return pts[pts.length - 1][1];
}
var CAT_NX = 8, CAT_NZ = 6;
var CAT_COL = {C:"#4a5568", H:"#eef2f6", S:"#e3c22b"};

SFA.sim({
  id:"ch-catalyse-heterogene", ch:"c07", tag:"Catalyse",
  titre:"Catalyse hétérogène : la surface du nickel au travail",
  resume:"Une surface de nickel en 3D sous un mélange de H₂ et d'éthylène. Les molécules s'adsorbent sur les sites, H₂ se coupe en deux, les H glissent jusqu'à l'éthylène et l'éthane repart. Sans catalyseur, tout rebondit. Bouche des sites avec du soufre et regarde la vitesse chuter.",
  but:"Observe la surface : H₂ se pose sur deux sites voisins et se coupe en deux atomes H ; l'éthylène se couche sur deux sites ; un H puis un autre passent sur l'éthylène, et l'éthane quitte la surface (halo vert). En bas, la bille parcourt le profil d'énergie : avec le nickel, aucune bosse ne dépasse 40 kJ/mol. Passe en « sans catalyseur » : les molécules rebondissent et la bille retombe. Clique sur des atomes de nickel (ou utilise le curseur) pour les couvrir de soufre. Glisse pour tourner la surface.",
  aRetenir:"Un catalyseur hétérogène (ici un métal solide, la réaction en phase gaz) offre un autre chemin : adsorption des réactifs sur des sites actifs, rupture de H–H sur le métal, réaction en surface, puis désorption du produit. Chaque étape a une petite énergie d'activation (≈ 40 kJ/mol au lieu de ≈ 180 kJ/mol), donc la vitesse augmente énormément : k(Ni)/k(sans) = e^((Ea,sans − Ea,Ni)/RT), environ 10¹⁸ à 400 K. ΔH (−136 kJ/mol) ne change pas, ni l'équilibre. La réaction se fait sur les sites : moins de sites actifs, moins de vitesse. Un poison (soufre, CO, plomb) s'accroche fort aux sites et les bloque.",
  piege:"Le catalyseur n'est pas consommé, mais il peut être empoisonné : c'est sa surface qui compte, pas sa masse. C'est pour cela qu'on l'utilise finement divisé (nickel de Raney, poudre sur support). Le catalyseur abaisse Ea dans les deux sens et ne déplace pas l'équilibre ; il ne rend pas possible une réaction défavorable (ΔG > 0). Dans ce modèle simple, la vitesse est proportionnelle au nombre de sites actifs : v/v₀ = 1 − θ (θ = fraction de sites empoisonnés).",
  build:function(k, S){
    var c = cbCanvas(k, 1.02, 1.5);
    var NS = CAT_NX * CAT_NZ;
    var st = {t:0, a:0.28, b:0.48, mode:"ni", made:0, ballX:0, ballDir:1, poison:[], ents:[], occ:[], idn:1, down:null, moved:0};
    for (var i = 0; i < NS; i++){ st.poison.push(false); st.occ.push(0); }
    var mS = k.seg("Surface", [["ni", "Nickel (catalyseur)"], ["sans", "Sans catalyseur (verre)"]], "ni", function(v){ st.mode = v; reset(); });
    var tS = k.slider("Température", 300, 700, 10, 400, "K");
    var pS = k.slider("Atomes de soufre (poison) sur les " + NS + " sites", 0, 40, 1, 0, "", function(v){ setPoison(Math.round(v)); });
    var ro = k.readouts(["Énergie d'activation", "Fraction de chocs assez énergétiques e^(−Ea/RT)", "Gain du nickel k(Ni)/k(sans)", "Sites actifs (sans soufre)", "Vitesse relative v/v₀ = 1 − θ"]);
    var nt = k.note("", "ok");

    function sitePos(s){ var i = s % CAT_NX, j = Math.floor(s / CAT_NX); return [(i - (CAT_NX - 1) / 2), 0, (j - (CAT_NZ - 1) / 2)]; }
    function neigh(s){ var i = s % CAT_NX, j = Math.floor(s / CAT_NX), o = []; if (i > 0) o.push(s - 1); if (i < CAT_NX - 1) o.push(s + 1); if (j > 0) o.push(s - CAT_NX); if (j < CAT_NZ - 1) o.push(s + CAT_NX); return o; }
    function free(s){ return !st.poison[s] && !st.occ[s]; }
    function shuffle(a){ for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function nPoison(){ var n = 0; st.poison.forEach(function(p){ if (p) n++; }); return n; }
    function setPoison(n){
      var cur = nPoison(), idx;
      if (n > cur){ idx = shuffle(st.poison.map(function(p, i){ return i; }).filter(function(i){ return !st.poison[i]; })); for (var q = 0; q < n - cur && q < idx.length; q++){ evict(idx[q]); st.poison[idx[q]] = true; } }
      else if (n < cur){ idx = shuffle(st.poison.map(function(p, i){ return i; }).filter(function(i){ return st.poison[i]; })); for (var r = 0; r < cur - n && r < idx.length; r++) st.poison[idx[r]] = false; }
    }
    /* un site qu'on empoisonne chasse ce qui s'y trouvait (renvoyé dans le gaz) */
    function evict(s){
      var id = st.occ[s]; if (!id) return;
      st.ents.forEach(function(e){ if (e.id === id){ e.sites.forEach(function(q){ st.occ[q] = 0; }); e.dead = true; } });
    }

    /* ---------- molécules : géométries locales ---------- */
    function geomH2(){ return [["H", -0.3, 0, 0], ["H", 0.3, 0, 0]]; }
    function geomC2H4(){ return [["C", -0.36, 0, 0], ["C", 0.36, 0, 0], ["H", -0.72, 0, 0.42], ["H", -0.72, 0, -0.42], ["H", 0.72, 0, 0.42], ["H", 0.72, 0, -0.42]]; }
    function geomC2H6(){ return [["C", -0.4, 0, 0], ["C", 0.4, 0, 0], ["H", -0.75, 0.4, 0], ["H", -0.75, -0.2, 0.35], ["H", -0.75, -0.2, -0.35], ["H", 0.75, -0.4, 0], ["H", 0.75, 0.2, 0.35], ["H", 0.75, 0.2, -0.35]]; }
    function randAxis(){ var v = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
    function spawn(kind){
      var g = kind === "H2" ? geomH2() : geomC2H4();
      var sp = 1.6 + Math.random() * 0.8, th = Math.random() * 2 * PI;
      st.ents.push({id:st.idn++, kind:kind, state:"gas", g:g, ax:randAxis(), w:1.5 + Math.random() * 2,
        p:[(Math.random() - 0.5) * 8, 2.4 + Math.random() * 1.8, (Math.random() - 0.5) * 6], v:[Math.cos(th) * sp * 0.5, -sp, Math.sin(th) * sp * 0.4], sites:[], age:0, hs:0});
    }
    function reset(){ st.ents = []; for (var i = 0; i < NS; i++) st.occ[i] = 0; st.made = 0; st.ballX = 0; st.ballDir = 1; for (var q = 0; q < 7; q++) spawn(q < 4 ? "H2" : "E"); st.ents.forEach(function(e){ e.p[1] = 1.4 + Math.random() * 3.6; }); }
    reset();

    /* paire de sites voisins libres (au hasard) sous un point */
    function pairNear(x, z){
      var best = null, bd = 1e9;
      for (var s = 0; s < NS; s++){
        if (!free(s)) continue;
        var p = sitePos(s), d = Math.hypot(p[0] - x, p[2] - z); if (d > 1.6 || d >= bd) continue;
        var nb = shuffle(neigh(s).filter(free)); if (!nb.length) continue;
        best = [s, nb[0]]; bd = d;
      }
      return best;
    }
    function lerp3(a, b, u){ return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }

    /* ---------- évolution ---------- */
    function step(dt){
      var T = tS.value, spd = Math.sqrt(T / 400), ni = st.mode === "ni";
      var nGasH = 0, nGasE = 0;
      st.ents.forEach(function(e){
        e.age += dt;
        if (e.state === "gas" || e.state === "leave"){
          e.p = [e.p[0] + e.v[0] * dt * spd, e.p[1] + e.v[1] * dt * spd, e.p[2] + e.v[2] * dt * spd];
          e.g = e.g.map(function(a){ var r = cbRotAx([a[1], a[2], a[3]], e.ax, e.w * dt * spd); return [a[0], r[0], r[1], r[2]]; });
          if (Math.abs(e.p[0]) > 4.6) e.v[0] = -e.v[0] * 0.98, e.p[0] = cbClamp(e.p[0], -4.6, 4.6);
          if (Math.abs(e.p[2]) > 3.4) e.v[2] = -e.v[2] * 0.98, e.p[2] = cbClamp(e.p[2], -3.4, 3.4);
          if (e.state === "leave"){ if (e.p[1] > 5.6) e.dead = true; return; }
          if (e.p[1] > 4.3){ e.v[1] = -Math.abs(e.v[1]); }
          if (e.p[1] < (ni ? 0.95 : 0.3) && e.v[1] < 0){
            var pr = ni && Math.random() < 0.85 ? pairNear(e.p[0], e.p[2]) : null;
            if (pr){
              e.sites = pr; e.state = e.kind === "H2" ? "h2ads" : "eads"; e.age = 0; e.from = e.p.slice(); e.fromG = e.g.map(function(a){ return a.slice(); });
              pr.forEach(function(s){ st.occ[s] = e.id; });
            } else { e.v[1] = Math.abs(e.v[1]) * (0.85 + Math.random() * 0.3); e.v[0] += (Math.random() - 0.5) * 0.8; e.v[2] += (Math.random() - 0.5) * 0.6; e.bounce = 0.35; }
          }
          if (e.bounce) e.bounce = Math.max(0, e.bounce - dt);
          if (e.kind === "H2") nGasH++; else nGasE++;
        }
        else if (e.state === "h2ads" && e.age > 0.45 / spd){
          /* H–H se coupe : deux atomes H, un par site */
          e.dead = true;
          e.sites.forEach(function(s){ st.ents.push({id:st.idn++, kind:"H", state:"hads", sites:[s], age:Math.random() * 0.3, hop:0.4 + Math.random() * 0.6}); });
          e.sites.forEach(function(s){ st.occ[s] = 0; });
          st.ents.forEach(function(h){ if (h.kind === "H" && h.state === "hads" && h.age < 0.4 && !h.dead) st.occ[h.sites[0]] = h.id; });
        }
        else if (e.state === "hads"){
          if (e.mv){ e.mv.u += dt * 3.2 * spd; if (e.mv.u >= 1){ e.mv = null; } return; }
          e.hop -= dt * spd;
          if (e.hop <= 0){
            e.hop = 0.35 + Math.random() * 0.7;
            var s0 = e.sites[0];
            /* un éthylène adsorbé sur un site voisin ? le H s'y ajoute */
            var tgt = null;
            st.ents.forEach(function(m){ if (!tgt && !m.dead && (m.state === "eads") && !m.busy && neigh(s0).some(function(q){ return m.sites.indexOf(q) >= 0; })) tgt = m; });
            if (tgt){ tgt.busy = {h:e, u:0, from:s0}; e.dead = true; st.occ[s0] = 0; return; }
            var nb = shuffle(neigh(s0).filter(free));
            if (nb.length){ st.occ[s0] = 0; st.occ[nb[0]] = e.id; e.mv = {from:s0, u:0}; e.sites = [nb[0]]; }
          }
        }
        else if (e.state === "eads"){
          if (e.busy){
            e.busy.u += dt * 2.2 * spd;
            if (e.busy.u >= 1){ e.hs++; e.busy = null; if (e.hs >= 2){ /* éthane : il quitte la surface */
              e.sites.forEach(function(s){ st.occ[s] = 0; }); e.state = "leave"; e.g = geomC2H6(); e.ax = randAxis(); e.w = 2; e.v = [(Math.random() - 0.5) * 0.6, 1.5, (Math.random() - 0.5) * 0.5];
              var c0 = sitePos(e.sites[0]), c1 = sitePos(e.sites[1]); e.p = [(c0[0] + c1[0]) / 2, 0.75, (c0[2] + c1[2]) / 2]; e.sites = []; e.age = 0; st.made++;
            } }
          }
        }
      });
      st.ents = st.ents.filter(function(e){ return !e.dead; });
      /* le gaz se renouvelle : 4 H₂ et 3 C₂H₄ en vol */
      var nadsH = 0; st.ents.forEach(function(e){ if (e.kind === "H" || e.state === "h2ads") nadsH++; });
      if (nGasH < 4 && nadsH < 14) spawnTop("H2");
      if (nGasE < 3) spawnTop("E");
    }
    function spawnTop(kind){ spawn(kind); var e = st.ents[st.ents.length - 1]; e.p[1] = 5.2; }

    /* ---------- souris : clic sur un site = soufre ; glisser = tourner ---------- */
    var proj = [];
    c.pointer(function(type, p){
      if (type === "down"){ st.down = {x:p.x, y:p.y}; st.moved = 0; st.lx = p.x; st.ly = p.y; }
      if (type === "drag" && st.down){
        st.moved += Math.abs(p.x - st.lx) + Math.abs(p.y - st.ly);
        st.a += (p.x - st.lx) * 0.01; st.b = cbClamp(st.b + (p.y - st.ly) * 0.008, 0.25, 1.15); st.lx = p.x; st.ly = p.y;
      }
      if (type === "up" && st.down){
        if (st.moved < 6 && st.mode === "ni"){
          var best = -1, bd = 1e9;
          proj.forEach(function(q, s){ var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd){ bd = d; best = s; } });
          if (best >= 0 && bd < Math.max(14, st.rpx * 1.3)){
            if (st.poison[best]) st.poison[best] = false; else if (nPoison() < 40){ evict(best); st.poison[best] = true; }
            pS.set(nPoison()); k.redraw();
          }
        }
        st.down = null;
      }
    });
    c.cv.style.cursor = "grab";

    var lp = k.loop(function(dt){
      st.t += dt; step(dt);
      /* bille sur le profil d'énergie */
      if (st.mode === "ni"){ st.ballX += dt * 0.22 * Math.sqrt(tS.value / 400) * (1 - nPoison() / NS); if (st.ballX > 1.15) st.ballX = 0; }
      else { st.ballX += dt * 0.2 * st.ballDir; if (st.ballX > 0.3){ st.ballDir = -1; } if (st.ballX < 0){ st.ballX = 0; st.ballDir = 1; } }
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, ni = st.mode === "ni", T = tS.value;
      ctx.clearRect(0, 0, W, H);
      var gH = Math.round(H * (ph ? 0.62 : 0.64));
      /* décor : intérieur d'un réacteur en acier */
      var bg = ctx.createLinearGradient(0, 0, 0, gH); bg.addColorStop(0, "#202a3a"); bg.addColorStop(1, "#3a4659");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, gH);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 8;
      for (var r = 0; r < 5; r++){ ctx.beginPath(); ctx.arc(W / 2, -gH * 0.6, gH * (0.9 + r * 0.22), 0.2, PI - 0.2); ctx.stroke(); }
      ctx.restore();
      var sc = Math.min(W / (ph ? 10.6 : 11.4), gH / 7.4), cx = W / 2, cy = gH * 0.6;
      st.rpx = sc * 0.42;
      function P(p){ var q = cbRot(p, st.a, st.b), s = 1 / (1 - q[2] * 0.025); return {x:cx + q[0] * sc * s, y:cy - (q[1] - 1.2) * sc * s, z:q[2], s:s}; }
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, gH); ctx.clip();
      /* dalle du support */
      var hx = CAT_NX / 2 + 0.1, hz = CAT_NZ / 2 + 0.1;
      cbBox(ctx, P, -hx, hx, -1.25, -0.42, -hz, hz, ni ? "#5d6775" : "#9fc6dc", st.a, st.b, {edge:"rgba(255,255,255,.18)", alpha:ni ? 1 : 0.85});
      var items = [];
      proj = [];
      for (var s = 0; s < NS; s++){
        var q = P(sitePos(s)); proj.push(q);
        if (ni) items.push({z:q.z, f:(function(q, s){ return function(){
          var col = st.poison[s] ? "#8b8f7a" : "#a8b2bd";
          cbBall(ctx, q.x, q.y, sc * 0.46 * q.s, col);
          if (!st.poison[s] && !st.occ[s]){ ctx.save(); ctx.globalAlpha = 0.28 + 0.12 * Math.sin(st.t * 3 + s); ctx.strokeStyle = "#7fe0ff"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(q.x, q.y - sc * 0.05, sc * 0.3 * q.s, sc * 0.3 * q.s * Math.sin(st.b), 0, 0, 7); ctx.stroke(); ctx.restore(); }
        }; })(q, s)});
        if (ni && st.poison[s]){ var qs = P([sitePos(s)[0], 0.45, sitePos(s)[2]]); items.push({z:qs.z + 0.01, f:(function(qs){ return function(){ cbBall(ctx, qs.x, qs.y, sc * 0.34 * qs.s, CAT_COL.S); }; })(qs)}); }
      }
      if (!ni){
        /* plaque de verre : reflets */
        var g0 = P([-hx, -0.42, -hz]), g1 = P([hx, -0.42, hz]);
        ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(g0.x + 20, g0.y); ctx.lineTo(g1.x - 40, g1.y); ctx.stroke(); ctx.restore();
      }
      /* adsorbats et molécules du gaz */
      st.ents.forEach(function(e){
        var atoms = [], bonds = [], glow = null;
        if (e.state === "gas" || e.state === "leave"){
          e.g.forEach(function(a){ atoms.push([a[0], e.p[0] + a[1], e.p[1] + a[2], e.p[2] + a[3]]); });
          if (e.state === "leave") glow = "#59e08f";
        } else if (e.state === "h2ads"){
          var u = cbSmooth(e.age / 0.25), a0 = sitePos(e.sites[0]), a1 = sitePos(e.sites[1]), m = lerp3(a0, a1, 0.5), d = [(a1[0] - a0[0]) * 0.3, 0, (a1[2] - a0[2]) * 0.3];
          var tgtC = [m[0], 0.62, m[2]], cen = lerp3(e.from, tgtC, u);
          atoms.push(["H", cen[0] - d[0], cen[1], cen[2] - d[2]], ["H", cen[0] + d[0], cen[1], cen[2] + d[2]]);
        } else if (e.state === "hads"){
          var pH = sitePos(e.sites[0]);
          if (e.mv){ var pf = sitePos(e.mv.from), uu = cbSmooth(e.mv.u); pH = lerp3(pf, pH, uu); pH[1] = Math.sin(uu * PI) * 0.25; }
          atoms.push(["H", pH[0], 0.55 + pH[1], pH[2]]);
        } else if (e.state === "eads"){
          var c0 = sitePos(e.sites[0]), c1 = sitePos(e.sites[1]), land = cbSmooth(e.age / 0.3);
          var dx = c1[0] - c0[0], dz = c1[2] - c0[2], px = -dz, pz = dx;
          var C0 = [c0[0] + dx * 0.14, 0.72, c0[2] + dz * 0.14], C1 = [c1[0] - dx * 0.14, 0.72, c1[2] - dz * 0.14];
          if (land < 1){ var mid = lerp3(c0, c1, 0.5); var off = lerp3(e.from, [mid[0], 0.72, mid[2]], land); C0 = [off[0] - dx * 0.36, off[1], off[2] - dz * 0.36]; C1 = [off[0] + dx * 0.36, off[1], off[2] + dz * 0.36]; }
          atoms.push(["C", C0[0], C0[1], C0[2]], ["C", C1[0], C1[1], C1[2]]);
          [[C0, -1], [C1, 1]].forEach(function(cc){ [-1, 1].forEach(function(sd){ atoms.push(["H", cc[0][0] + px * 0.42 * sd + dx * 0.25 * cc[1], cc[0][1] + 0.38, cc[0][2] + pz * 0.42 * sd + dz * 0.25 * cc[1]]); }); });
          /* H déjà ajoutés (par-dessous, côté métal) */
          for (var hI = 0; hI < e.hs; hI++){ var cc2 = hI ? C1 : C0; atoms.push(["H", cc2[0], cc2[1] - 0.05, cc2[2] + 0.001, true]); cc2[1] += 0.0; }
          if (e.busy){ var pf2 = sitePos(e.busy.from), tg = e.hs ? C1 : C0, ub = cbSmooth(e.busy.u); var pp = lerp3([pf2[0], 0.55, pf2[2]], [tg[0], tg[1] - 0.05, tg[2]], ub); atoms.push(["H", pp[0], pp[1] + Math.sin(ub * PI) * 0.2, pp[2]]); }
        }
        var pr = atoms.map(function(a){ return {e:a[0], q:P([a[1], a[2], a[3]]), hid:a[4]}; });
        var zc = 0; pr.forEach(function(a){ zc += a.q.z; }); zc /= Math.max(1, pr.length);
        items.push({z:zc + 0.3, f:function(){
          if (glow){ var gq = pr[0].q; var gg = ctx.createRadialGradient(gq.x, gq.y, 0, gq.x, gq.y, sc * 1.1); gg.addColorStop(0, "rgba(89,224,143,.45)"); gg.addColorStop(1, "rgba(89,224,143,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gq.x, gq.y, sc * 1.1, 0, 7); ctx.fill(); }
          /* liaisons : chaque H à son C le plus proche ; C–C ; H–H */
          ctx.save(); ctx.lineCap = "round";
          pr.forEach(function(a, i){
            if (a.hid) return;
            var bj = -1, bd = 1e9;
            pr.forEach(function(b, j){ if (j === i || b.hid) return; if (a.e === "H" && b.e === "H" && pr.length > 2) return; var d = Math.hypot(a.q.x - b.q.x, a.q.y - b.q.y); if (d < bd && (b.e === "C" || a.e === b.e)){ bd = d; bj = j; } });
            if (bj > i || (bj >= 0 && a.e === "H")){ var b = pr[bj]; ctx.strokeStyle = "#cfd6df"; ctx.lineWidth = Math.max(2, sc * 0.11); ctx.beginPath(); ctx.moveTo(a.q.x, a.q.y); ctx.lineTo(b.q.x, b.q.y); ctx.stroke(); }
          });
          ctx.restore();
          pr.slice().sort(function(u, v){ return u.q.z - v.q.z; }).forEach(function(a){ if (a.hid) return; cbBall(ctx, a.q.x, a.q.y, (a.e === "C" ? 0.27 : 0.19) * sc * a.q.s, CAT_COL[a.e]); });
        }});
      });
      items.sort(function(u, v){ return u.z - v.z; }).forEach(function(it){ it.f(); });
      ctx.restore();

      /* ---------- bandeau de la scène ---------- */
      var fs = ph ? 10.5 : 12;
      cbTag(ctx, ni ? "Nickel : " + st.made + " molécule" + (st.made > 1 ? "s" : "") + " d'éthane formée" + (st.made > 1 ? "s" : "") : "Verre : les molécules rebondissent", 8, 18, {align:"left", size:fs, bg:ni ? "rgba(89,224,143,.92)" : "rgba(255,255,255,.92)", color:"#0f1b2d"});
      cbTag(ctx, "C₂H₄ + H₂ → C₂H₆", W - 8, 18, {align:"right", size:fs, bg:"rgba(255,255,255,.92)"});
      /* légende */
      var ly = gH - 15, lx = 10, items2 = [["#a8b2bd", "Ni (site)"], [CAT_COL.H, "H"], [CAT_COL.C, "C"], [CAT_COL.S, "S (poison)"]];
      if (!ni) items2 = [[CAT_COL.H, "H"], [CAT_COL.C, "C"]];
      items2.forEach(function(it){ var tw = cbTw(ctx, it[1], ph ? 10 : 11, 800); ctx.save(); ctx.fillStyle = "rgba(15,27,45,.72)"; cbRR(ctx, lx, ly - 10, tw + 28, 20, 10); ctx.fill(); ctx.restore(); cbBall(ctx, lx + 11, ly, 6, it[0]); cbText(ctx, it[1], lx + 21, ly, {align:"left", size:ph ? 10 : 11, color:"#fff", w:800}); lx += tw + 34; });
      if (ni && !ph) cbTag(ctx, "clic sur un atome de Ni : soufre", W - 8, ly, {align:"right", size:10.5, bg:"rgba(15,27,45,.72)", color:"#e3ecf7"});

      /* ---------- profil d'énergie ---------- */
      var y0 = gH; ctx.fillStyle = "#f7f9fc"; ctx.fillRect(0, y0, W, H - y0);
      var L = ph ? 40 : 50, Rm = 12, Tp = y0 + 30, Bp = H - 14, emin = -170, emax = 205;
      function EX(x){ return L + x * (W - L - Rm); } function EY(e){ return Bp - (e - emin) / (emax - emin) * (Bp - Tp); }
      cbText(ctx, "Énergie (kJ/mol)", L - 2, y0 + 13, {align:"left", size:ph ? 10 : 11, color:"#2c3a4e", w:800});
      ctx.strokeStyle = "#c9d2de"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Tp - 4); ctx.lineTo(L, Bp); ctx.stroke();
      [-100, 0, 100, 200].forEach(function(e){ var yy = EY(e); ctx.strokeStyle = "#eef1f5"; ctx.beginPath(); ctx.moveTo(L + 1, yy); ctx.lineTo(W - Rm, yy); ctx.stroke(); if (e <= emax) cbText(ctx, cbFmt(e, 0), L - 5, yy, {align:"right", size:10, color:"#6b7889", w:600}); });
      function curve(pts, col, w, dash){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); for (var i = 0; i <= 160; i++){ var x = i / 160 * 0.96, yy = EY(catCurve(pts, x)); i ? ctx.lineTo(EX(x), yy) : ctx.moveTo(EX(x), yy); } ctx.stroke(); ctx.restore(); }
      curve(CAT_PROF.sans, ni ? "#c3cad4" : "#d2452f", ni ? 1.8 : 3.2, ni ? [5, 4] : null);
      curve(CAT_PROF.ni, ni ? "#1f9a5a" : "#b9d9c6", ni ? 3.2 : 1.8, ni ? null : [5, 4]);
      /* cotes Ea et ΔH */
      var xs = EX(0.5), yTop = EY(180), yR = EY(0);
      ctx.strokeStyle = "#d2452f"; ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(EX(0.02), yR); ctx.lineTo(xs + 16, yR); ctx.stroke(); ctx.setLineDash([]);
      cbArrow(ctx, xs + 14, yR, xs + 14, yTop + 1, "#d2452f", 1.6, 7);
      cbTag(ctx, "sans : Ea ≈ " + CAT_EA_SANS + " kJ/mol", xs + 22, (yR + yTop) / 2, {align:"left", size:ph ? 9.5 : 10.5, bg:"rgba(255,255,255,.95)", color:"#a3341f", stroke:"#f1c9c1"});
      var xt = EX(0.29), yw = EY(-30), yt = EY(10);
      cbArrow(ctx, xt - 12, yw, xt - 12, yt + 1, "#1f9a5a", 1.6, 6);
      cbTag(ctx, "Ni : Ea ≈ " + CAT_EA_NI, xt - 18, EY(-78), {align:"right", size:ph ? 9.5 : 10.5, bg:"rgba(255,255,255,.95)", color:"#15623a", stroke:"#bfe3cc"});
      var xp = EX(0.93);
      cbArrow(ctx, xp, yR, xp, EY(CAT_DH), "#4b5a70", 1.6, 7);
      cbTag(ctx, "ΔH = " + cbFmt(CAT_DH, 0), xp - 6, EY(-60), {align:"right", size:ph ? 9.5 : 10.5, bg:"rgba(255,255,255,.95)", color:"#2c3a4e"});
      cbText(ctx, "éthane", EX(0.96), EY(-136) + 11, {align:"right", size:ph ? 9.5 : 10, color:"#4b5a70", w:700});
      /* la bille */
      var bx = Math.min(0.96, st.ballX), by = catCurve(ni ? CAT_PROF.ni : CAT_PROF.sans, bx);
      if (st.ballX <= 1.0) cbBall(ctx, EX(bx), EY(by) - 7, 7, ni ? "#1f9a5a" : "#d2452f");

      /* ---------- afficheurs ---------- */
      var RT = CAT_R * T / 1000, Ea = ni ? CAT_EA_NI : CAT_EA_SANS, np = nPoison(), th = np / NS;
      ro.set(0, (ni ? "≈ " : "≈ ") + Ea + " kJ/mol");
      ro.set(1, cbSci(Math.exp(-Ea / RT), 1));
      ro.set(2, cbSci(Math.exp((CAT_EA_SANS - CAT_EA_NI) / RT), 1));
      ro.set(3, ni ? (NS - np) + " sur " + NS : "aucun");
      ro.set(4, ni ? cbFmt((1 - th) * 100, 0) + " %" : "≈ 0 %");
      if (ni) nt.set("À " + T + " K, RT = " + cbFmt(RT, 3) + " kJ/mol : e^(−40/RT) = " + cbSci(Math.exp(-CAT_EA_NI / RT), 1) + " contre e^(−180/RT) = " + cbSci(Math.exp(-CAT_EA_SANS / RT), 1) + " sans catalyseur, soit un gain de " + cbSci(Math.exp((CAT_EA_SANS - CAT_EA_NI) / RT), 1) + ". " +
        (np ? np + " site" + (np > 1 ? "s" : "") + " sur " + NS + " couvert" + (np > 1 ? "s" : "") + " de soufre : θ = " + cbFmt(th, 2) + ", la vitesse tombe à " + cbFmt((1 - th) * 100, 0) + " %." : "Tous les sites sont actifs : clique sur des atomes de nickel pour les empoisonner.") +
        " <i>Ea : ordres de grandeur ; même ΔH = −136 kJ/mol avec ou sans catalyseur.</i>", "ok");
      else nt.set("Sans catalyseur, un choc H₂ + C₂H₄ doit apporter ≈ 180 kJ/mol : à " + T + " K, seule une fraction " + cbSci(Math.exp(-CAT_EA_SANS / RT), 1) + " des chocs y parvient. À l'échelle de la simulation, aucune réaction ne se produit : les molécules rebondissent sur la paroi inerte.", "warn");
    });
  }
});

/* =====================================================================
   3. Le proton qui saute : deux couples acide-base en 3D (L12)
   ===================================================================== */
function tpAdd(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function tpMul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function tpNrm(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function tpCross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
/* 4 directions tétraédriques dont la première est d0 */
function tpTetra(d0, tw){
  d0 = tpNrm(d0);
  var e1 = tpCross(d0, [0, 0, 1]); if (Math.hypot(e1[0], e1[1], e1[2]) < 0.1) e1 = tpCross(d0, [0, 1, 0]); e1 = tpNrm(e1);
  var e2 = tpCross(d0, e1), out = [d0];
  for (var i = 0; i < 3; i++){ var f = (tw || 0) + i * 2 * PI / 3; out.push(tpAdd(tpMul(d0, -1 / 3), tpMul(tpAdd(tpMul(e1, Math.cos(f)), tpMul(e2, Math.sin(f))), Math.sqrt(8) / 3))); }
  return out;
}
var TP_COL = {H:"#eef2f6", O:"#d6392f", N:"#3b5fd6", C:"#4a5568", Cl:"#2fa84f", P:"#e08a2b"};
var TP_RAD = {H:0.27, O:0.42, N:0.42, C:0.42, Cl:0.6, P:0.55};
var TP_XH = {O:0.97, N:1.01, Cl:1.27};
/* une famille = la forme la moins protonée + des sites où un H⁺ peut se fixer (d0 = vers le partenaire) */
function tpFamily(f, side){
  var sx = side < 0 ? 1 : -1, A = [], B = [], sites = [];
  function at(el, p){ A.push({el:el, p:p}); return A.length - 1; }
  function bond(i, j){ B.push([i, j]); }
  if (f === "Cl"){
    var c = at("Cl", [0, 0, 0]), td = tpTetra([sx, 0, 0], 0.3);
    sites.push({host:c, dir:td[0]});
    return {A:A, B:B, sites:sites, q0:-1, names:["Cl⁻", "HCl"], pKa:[-7], fort:true, xlp:[[c, td[1]], [c, td[2]], [c, td[3]]]};
  }
  if (f === "N"){
    var n = at("N", [0, 0, 0]), tn = tpTetra([sx, 0, 0], 0.5);
    for (var i = 1; i < 4; i++){ var h = at("H", tpMul(tn[i], 1.01)); bond(n, h); }
    sites.push({host:n, dir:tn[0]});
    return {A:A, B:B, sites:sites, q0:0, names:["NH₃", "NH₄⁺"], pKa:[9.25]};
  }
  if (f === "W"){
    var o = at("O", [0, 0, 0]), tw = tpTetra([sx, 0, 0], 0.9);
    for (var j = 2; j < 4; j++){ var hh = at("H", tpMul(tw[j], 0.97)); bond(o, hh); }
    sites.push({host:o, dir:tw[0]});
    return {A:A, B:B, sites:sites, q0:0, names:["H₂O", "H₃O⁺"], pKa:[0], xlp:[[o, tw[1]]]};
  }
  if (f === "Ac"){
    /* O–H vers le partenaire ; C=O, CH₃ dans le plan */
    var O2 = at("O", [0, 0, 0]), u = [-sx * 0.334, 0.943, 0], C2p = tpMul(u, 1.36), C2 = at("C", C2p);
    var back = tpMul(u, -1);
    function rz(v, a){ return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a), 0]; }
    var u1 = rz(back, sx * 2 * PI / 3), u2 = rz(back, -sx * 2 * PI / 3);
    var O1 = at("O", tpAdd(C2p, tpMul(u1, 1.21))), C1p = tpAdd(C2p, tpMul(u2, 1.52)), C1 = at("C", C1p);
    bond(O2, C2); bond(C2, O1); bond(C2, C1);
    var tm = tpTetra(tpMul(u2, -1), 0.4);
    for (var m = 1; m < 4; m++){ var hm = at("H", tpAdd(C1p, tpMul(tm[m], 1.09))); bond(C1, hm); }
    sites.push({host:O2, dir:tpNrm([sx, 0.08, 0.05])});
    var r = {A:A, B:B, sites:sites, q0:-1, names:["CH₃COO⁻", "CH₃COOH"], pKa:[4.76], dbl:[[C2, O1]]};
    return r;
  }
  if (f === "P"){
    var P = at("P", [0, 0, 0]), tp = tpTetra([-sx, -0.25, 0.1], 0.2), Os = [];
    for (var q = 0; q < 4; q++){ Os.push(at("O", tpMul(tp[q], 1.54))); bond(P, Os[q]); }
    /* O[0] : P=O, côté opposé ; O[1..3] portent les H (le 1er parti est le plus proche du partenaire) */
    var cand = [1, 2, 3].sort(function(a, b){ return sx * (A[Os[b]].p[0] - A[Os[a]].p[0]); });
    cand.forEach(function(qi){
      var d = tpNrm(A[Os[qi]].p), w = tpCross(d, [0, 0, 1]); if (Math.hypot(w[0], w[1], w[2]) < 0.2) w = tpCross(d, [0, 1, 0]); w = tpNrm(w);
      if (w[0] * sx < 0) w = tpMul(w, -1);
      var hd = tpNrm(tpAdd(tpMul(d, Math.cos(65 * PI / 180)), tpMul(w, Math.sin(65 * PI / 180))));
      sites.push({host:Os[qi], dir:hd});
    });
    /* ordre des départs : le dernier site rempli part en premier */
    sites.reverse();
    return {A:A, B:B, sites:sites, q0:-3, names:["PO₄³⁻", "HPO₄²⁻", "H₂PO₄⁻", "H₃PO₄"], pKa:[12.35, 7.2, 2.15], dbl:[[P, Os[0]]], poly:true};
  }
}
var TP_ACIDS = {HCl:"Cl", CH3COOH:"Ac", NH4:"N", H3PO4:"P"};
var TP_BASES = {H2O:"W", NH3:"N"};
function tpCharge(q){ return q === 0 ? "" : q === 1 ? "⁺" : q === -1 ? "⁻" : cbSup(Math.abs(q)) + (q > 0 ? "⁺" : "⁻"); }
/* K = 10^(pKa du couple qui capte − pKa du couple qui cède) */
function tpK(pA, pB){ return Math.pow(10, pB - pA); }

SFA.sim({
  id:"ch-transfert-proton", ch:"L12", tag:"Acides et bases",
  titre:"Le proton qui saute : deux couples acide-base en 3D",
  resume:"Un acide et une base en 3D, dans l'eau. Attrape le proton de l'acide et dépose-le sur le doublet libre de la base : chaque molécule devient sa forme conjuguée et les deux couples s'éclairent. Avec H₃PO₄, les trois protons partent un par un et chaque pKa s'affiche.",
  but:"Attrape le proton entouré de jaune (sur l'acide, à gauche) et dépose-le sur le doublet libre de la base (le lobe bleu, à droite). Regarde les noms changer : l'acide devient sa base conjuguée, la base devient son acide conjugué. Tu peux aussi ramener le proton : c'est la réaction inverse. Choisis H₃PO₄ pour enlever les protons un par un. Glisse ailleurs sur l'image pour tourner les molécules. L'échelle de pKa donne K.",
  aRetenir:"Selon Brønsted, un acide cède un proton H⁺ et une base le capte grâce à un doublet libre. Une réaction acido-basique est un transfert de proton entre deux couples : acide₁ + base₂ ⇄ base₁ + acide₂. Chaque acide a sa base conjuguée (HA/A⁻), qui diffère d'un seul H⁺. La constante vaut K = Ka₁/Ka₂ = 10^(pKa₂ − pKa₁) : le proton passe facilement de l'acide le plus fort (pKa le plus petit) à la base la plus forte. Un polyacide comme H₃PO₄ cède ses protons un par un, avec un pKa par étape (2,15 ; 7,20 ; 12,35) : chaque proton part plus difficilement que le précédent.",
  piege:"Le « H⁺ » n'existe pas seul dans l'eau : il est toujours porté par une molécule (H₃O⁺ dans l'eau). Le proton part sans ses électrons : la liaison O–H (ou Cl–H) laisse son doublet sur l'acide, qui devient plus négatif d'une unité. La base conjuguée d'un acide fort (Cl⁻) n'a pratiquement aucune force basique. Et H₂PO₄⁻ est à la fois la base conjuguée de H₃PO₄ et l'acide du couple suivant : c'est un ampholyte.",
  build:function(k, S){
    var c = cbCanvas(k, 0.9, 1.3);
    var st = {t:0, a:0.35, b:0.18, auto:true, ph:"idle", u:0, hold:0, drag:null, bx:0, swap:0, given:[], reverse:false};
    var aS = k.seg("Acide (il cède H⁺)", [["HCl", "HCl"], ["CH3COOH", "CH₃COOH"], ["NH4", "NH₄⁺"], ["H3PO4", "H₃PO₄"]], "CH3COOH", function(){ resetAll(); });
    var bS = k.seg("Base (elle capte H⁺)", [["H2O", "H₂O"], ["NH3", "NH₃"]], "H2O", function(){ resetAll(); });
    var auT = k.toggle("Transfert automatique", true, function(v){ st.auto = v; st.ph = "idle"; st.hold = 0; });
    k.button("Remettre les protons", function(){ resetAll(); });
    var ro = k.readouts(["Couple 1 : l'acide qui cède H⁺", "Couple 2 : la base qui capte H⁺", "K = 10^(pKa₂ − pKa₁)", "La réaction"]);
    var nt = k.note("", "ok");
    var AC, BA, nA, nB;
    function resetAll(){
      AC = tpFamily(TP_ACIDS[aS.value], -1); BA = tpFamily(TP_BASES[bS.value], 1);
      [AC, BA].forEach(function(F){ var m = [0, 0, 0]; F.A.forEach(function(a){ m = tpAdd(m, a.p); }); F.cen = tpMul(m, 1 / F.A.length); });
      nA = AC.sites.length; nB = 0; st.ph = "idle"; st.u = 0; st.hold = 0; st.swap = 0; st.given = []; st.drag = null; st.fail = false; st.failed = false;
    }
    resetAll();
    /* pKa du couple dont l'acide a n protons sur les sites */
    function pKaA(n){ return AC.pKa[n - 1]; }
    function nameA(n){ return AC.names[n]; }
    function chg(F, n){ return F.q0 + n; }

    /* ---------- géométrie à l'écran ---------- */
    var view = {};
    function layout(W, H, ph){
      var sceneW = ph ? W : W * 0.76, sceneH = ph ? H - 108 : H;
      var sc = Math.min(sceneW / (ph ? 7.8 : 6.7), sceneH / 4.4);
      view = {W:W, H:H, ph:ph, sc:sc, cA:[sceneW * 0.26, sceneH * 0.47], cB:[sceneW * 0.76, sceneH * 0.47], sceneW:sceneW, sceneH:sceneH};
    }
    function proj(F, p, which){
      var cen = which === "A" ? view.cA : view.cB, off = which === "B" ? st.bx * view.sc : 0;
      var q = cbRot([p[0] - F.cen[0], p[1] - F.cen[1], p[2] - F.cen[2]], st.a * (which === "A" ? 1 : -1), st.b), s = 1 / (1 - q[2] * 0.06);
      return {x:cen[0] + off + q[0] * view.sc * s, y:cen[1] - q[1] * view.sc * s, z:q[2], s:s};
    }
    function siteH(F, i){ var s = F.sites[i], h = F.A[s.host]; return tpAdd(h.p, tpMul(s.dir, TP_XH[h.el])); }
    /* position écran du proton mobile : site de l'acide (index nA−1) ou de la base (index 0) */
    function pA(){ return proj(AC, siteH(AC, nA - 1), "A"); }
    function pB(){ return proj(BA, siteH(BA, 0), "B"); }
    function lone(F, i, which){ var s = F.sites[i], h = F.A[s.host]; return proj(F, tpAdd(h.p, tpMul(s.dir, 0.8)), which); }

    function forward(){ if (nA > 0 && nB === 0 && st.swap === 0){ st.ph = "fwd"; st.u = 0; } }
    function backward(){ if (nB === 1 && nA < AC.sites.length && !AC.poly){ st.ph = "back"; st.u = 0; } }
    function doneFwd(){
      nA--; nB = 1; st.ph = "idle"; st.hold = 0;
      st.flash = 1.6;
      if (AC.poly){ st.given.push(AC.sites.length - nA); st.swap = 0.001; }
    }
    function doneBack(){ nA++; nB = 0; st.ph = "idle"; st.hold = 0; st.flash = 1.6; }

    /* ---------- souris ---------- */
    c.pointer(function(type, p){
      if (type === "down"){
        var hit = null;
        if (st.ph === "idle" && nA > 0 && nB === 0 && st.swap === 0){ var q = pA(); if (Math.hypot(q.x - p.x, q.y - p.y) < Math.max(18, view.sc * 0.55)) hit = "A"; }
        if (!hit && st.ph === "idle" && nB === 1 && !AC.poly){ var q2 = pB(); if (Math.hypot(q2.x - p.x, q2.y - p.y) < Math.max(18, view.sc * 0.55)) hit = "B"; }
        if (hit){ st.drag = {from:hit, x:p.x, y:p.y}; st.auto = false; auT.set(false); st.ph = "drag"; return; }
        st.drag = {view:true}; st.lx = p.x; st.ly = p.y; st.user = true;
      }
      if (type === "drag" && st.drag){
        if (st.drag.view){ st.a = cbClamp(st.a + (p.x - st.lx) * 0.012, -1.3, 1.3); st.b = cbClamp(st.b + (p.y - st.ly) * 0.012, -1.1, 1.1); st.lx = p.x; st.ly = p.y; }
        else { st.drag.x = p.x; st.drag.y = p.y; }
      }
      if (type === "up" && st.drag){
        if (!st.drag.view){
          var to = st.drag.from === "A" ? lone(BA, 0, "B") : lone(AC, nA, "A");
          var ok = Math.hypot(to.x - p.x, to.y - p.y) < Math.max(34, view.sc * 1.1);
          if (ok){ if (st.drag.from === "A") doneFwd(); else doneBack(); }
          else { st.ph = "ret"; st.u = 0; st.ret = {x:p.x, y:p.y, from:st.drag.from}; }
        }
        st.drag = null;
      }
      if (type === "move"){
        var on = false;
        if (nA > 0 && nB === 0){ var q3 = pA(); on = Math.hypot(q3.x - p.x, q3.y - p.y) < Math.max(18, view.sc * 0.55); }
        if (!on && nB === 1 && !AC.poly){ var q4 = pB(); on = Math.hypot(q4.x - p.x, q4.y - p.y) < Math.max(18, view.sc * 0.55); }
        c.cv.style.cursor = on ? "pointer" : "grab";
      }
    });
    c.cv.style.cursor = "grab";

    var lp = k.loop(function(dt){
      st.t += dt;
      if (!st.drag && !st.user) st.a = 0.35 + 0.4 * Math.sin(st.t * 0.35);
      if (st.flash) st.flash = Math.max(0, st.flash - dt);
      if (st.ph === "fwd" || st.ph === "back"){ st.u += dt / 0.9; if (st.u >= 1){
        /* K < 10⁻³ : le transfert ne dure pas, le proton revient sur l'acide */
        if (st.ph === "fwd" && st.fail){ var qf = pB(); st.fail = false; st.failed = true; st.ph = "ret"; st.u = 0; st.ret = {x:qf.x, y:qf.y, from:"A", slow:true}; }
        else if (st.ph === "fwd") doneFwd(); else doneBack(); } }
      if (st.ph === "ret"){ st.u += dt / (st.ret && st.ret.slow ? 0.9 : 0.35); if (st.u >= 1) st.ph = "idle"; }
      /* échange de la base (polyacide) : l'acide formé s'en va, une base neuve arrive */
      if (st.swap > 0){
        st.swap += dt / 1.8;
        if (st.swap < 0.5) st.bx = cbSmooth(st.swap / 0.5) * 7;
        else { if (nB === 1){ nB = 0; } st.bx = 7 * (1 - cbSmooth((st.swap - 0.5) / 0.5)); }
        if (st.swap >= 1){ st.swap = 0; st.bx = 0; }
      }
      if (st.auto && st.ph === "idle" && st.swap === 0){
        st.hold += dt;
        if (st.hold > 2.6){
          st.hold = 0;
          if (AC.poly && st.failed) resetAll();
          else if (nA > 0 && nB === 0){ st.fail = tpK(pKaA(nA), BA.pKa[0]) < 1e-3; forward(); }
          else if (nB === 1 && !AC.poly) backward();
          else if (AC.poly && nA === 0){ resetAll(); }
        }
      }
      k.redraw();
    });
    lp.play();

    /* ---------- dessin d'une molécule (sans le proton mobile) ---------- */
    function drawMol(ctx, F, n, which, skipSite, alpha, ring){
      var P = F.A.map(function(a){ return proj(F, a.p, which); }), sc = view.sc, items = [];
      F.B.forEach(function(b){ items.push({z:(P[b[0]].z + P[b[1]].z) / 2 - 0.01, bond:b}); });
      F.A.forEach(function(a, i){ items.push({z:P[i].z, atom:i}); });
      /* H sur les sites remplis (sauf le proton mobile) */
      var Hs = [];
      for (var i = 0; i < n; i++){ if (i === skipSite) continue; var hp = proj(F, siteH(F, i), which); Hs.push({p:hp, host:F.sites[i].host}); items.push({z:hp.z, hs:Hs.length - 1}); items.push({z:(hp.z + P[F.sites[i].host].z) / 2 - 0.01, hb:Hs.length - 1}); }
      /* doublets libres des sites vides */
      var lps = [];
      for (var j = n; j < F.sites.length; j++){ if (j === skipSite) continue; var lq = proj(F, tpAdd(F.A[F.sites[j].host].p, tpMul(F.sites[j].dir, 0.8)), which); lps.push(lq); items.push({z:lq.z, lp:lps.length - 1}); }
      (F.xlp || []).forEach(function(x){ if (n > 0 && F === AC && false) return; var lq = proj(F, tpAdd(F.A[x[0]].p, tpMul(x[1], F.A[x[0]].el === "Cl" ? 0.95 : 0.8)), which); lps.push(lq); items.push({z:lq.z, lp:lps.length - 1}); });
      items.sort(function(u, v){ return u.z - v.z; });
      ctx.save(); ctx.globalAlpha = alpha;
      if (ring){ var cx0 = which === "A" ? view.cA[0] : view.cB[0] + st.bx * sc, cy0 = view.cA[1]; var gr = ctx.createRadialGradient(cx0, cy0, sc * 0.5, cx0, cy0, sc * 2.6); gr.addColorStop(0, cbRgba(ring, 0.22)); gr.addColorStop(1, cbRgba(ring, 0)); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx0, cy0, sc * 2.6, 0, 7); ctx.fill(); }
      items.forEach(function(it){
        if (it.bond || it.hb != null){
          var p1, p2, dbl = false;
          if (it.bond){ p1 = P[it.bond[0]]; p2 = P[it.bond[1]]; (F.dbl || []).forEach(function(d){ if ((d[0] === it.bond[0] && d[1] === it.bond[1]) || (d[1] === it.bond[0] && d[0] === it.bond[1])) dbl = true; }); }
          else { p1 = P[Hs[it.hb].host]; p2 = Hs[it.hb].p; }
          ctx.lineCap = "round";
          if (dbl){ var dx = p2.x - p1.x, dy = p2.y - p1.y, L = Math.hypot(dx, dy) || 1, ox = -dy / L * sc * 0.09, oy = dx / L * sc * 0.09; [1, -1].forEach(function(sg){ ctx.strokeStyle = "#8d98a8"; ctx.lineWidth = sc * 0.1; ctx.beginPath(); ctx.moveTo(p1.x + ox * sg, p1.y + oy * sg); ctx.lineTo(p2.x + ox * sg, p2.y + oy * sg); ctx.stroke(); }); }
          else { ctx.strokeStyle = "#8d98a8"; ctx.lineWidth = sc * 0.16; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = sc * 0.05; ctx.beginPath(); ctx.moveTo(p1.x, p1.y - sc * 0.03); ctx.lineTo(p2.x, p2.y - sc * 0.03); ctx.stroke(); }
        } else if (it.atom != null){ var a = F.A[it.atom], q = P[it.atom]; cbBall(ctx, q.x, q.y, TP_RAD[a.el] * sc * q.s, TP_COL[a.el]); }
        else if (it.hs != null){ var h = Hs[it.hs].p; cbBall(ctx, h.x, h.y, TP_RAD.H * sc * h.s, TP_COL.H); }
        else if (it.lp != null){ var l = lps[it.lp]; var g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, sc * 0.4); g.addColorStop(0, "rgba(90,170,255,.85)"); g.addColorStop(0.6, "rgba(90,170,255,.35)"); g.addColorStop(1, "rgba(90,170,255,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y, sc * 0.4, 0, 7); ctx.fill(); ctx.fillStyle = "#1d3f7a"; ctx.beginPath(); ctx.arc(l.x - sc * 0.07, l.y, sc * 0.045, 0, 7); ctx.arc(l.x + sc * 0.07, l.y, sc * 0.045, 0, 7); ctx.fill(); }
      });
      ctx.restore();
      return P;
    }
    function drawProton(ctx, x, y, s, hostP, glow){
      var sc = view.sc;
      if (hostP){ ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(255,210,77,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hostP.x, hostP.y); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
      if (glow){ var g = ctx.createRadialGradient(x, y, 0, x, y, sc * 0.75); g.addColorStop(0, "rgba(255,210,77,.6)"); g.addColorStop(1, "rgba(255,210,77,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, sc * 0.75, 0, 7); ctx.fill(); }
      cbBall(ctx, x, y, TP_RAD.H * sc * (s || 1), TP_COL.H);
      ctx.save(); ctx.strokeStyle = "#ffd24d"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, TP_RAD.H * sc * (s || 1) + 3, 0, 7); ctx.stroke(); ctx.restore();
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      layout(W, H, ph);
      var sc = view.sc;
      ctx.clearRect(0, 0, W, H);
      /* ---------- décor : l'intérieur d'un bécher d'eau ---------- */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#d9eefb"); bg.addColorStop(0.18, "#a9d3ef"); bg.addColorStop(1, "#5d97c6");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2;
      ctx.beginPath(); for (var x = 0; x <= W; x += 8){ var yy = H * 0.06 + Math.sin(x * 0.03 + st.t * 1.4) * 3; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); ctx.restore();
      /* molécules d'eau du solvant, floues, qui dérivent */
      for (var w = 0; w < 14; w++){
        var wx = ((cbHash(w, 1) * W + st.t * (6 + 10 * cbHash(w, 2))) % (W + 40)) - 20, wy = H * 0.12 + cbHash(w, 3) * H * 0.82, r = sc * (0.08 + 0.05 * cbHash(w, 4));
        cbBall(ctx, wx, wy, r * 1.5, "#d6392f", 0.2); cbBall(ctx, wx - r * 1.4, wy + r * 0.9, r, "#ffffff", 0.25); cbBall(ctx, wx + r * 1.4, wy + r * 0.9, r, "#ffffff", 0.25);
      }
      /* reflet du verre */
      ctx.save(); ctx.globalAlpha = 0.25; var gl = ctx.createLinearGradient(W * 0.02, 0, W * 0.08, 0); gl.addColorStop(0, "rgba(255,255,255,0)"); gl.addColorStop(0.5, "#fff"); gl.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = gl; ctx.fillRect(W * 0.02, 0, W * 0.06, H); ctx.restore();

      var colA = "#ef7d2a", colB = "#2f7fd8";
      var nTot = AC.sites.length, mobileA = (st.ph === "fwd" || (st.ph === "drag" && st.drag && st.drag.from === "A") || (st.ph === "ret" && st.ret && st.ret.from === "A"));
      var mobileB = (st.ph === "back" || (st.ph === "drag" && st.drag && st.drag.from === "B") || (st.ph === "ret" && st.ret && st.ret.from === "B"));
      /* l'acide (à gauche) et la base (à droite) */
      var PA = drawMol(ctx, AC, nA, "A", mobileA ? nA - 1 : -1, 1, colA);
      var bAlpha = st.swap > 0 ? (st.swap < 0.5 ? 1 - cbSmooth(st.swap / 0.5) : cbSmooth((st.swap - 0.5) / 0.5)) : 1;
      var PB = drawMol(ctx, BA, nB, "B", mobileB ? 0 : -1, bAlpha, colB);
      /* doublet visé quand on tient le proton */
      if (st.ph === "drag" && st.drag && !st.drag.view){
        var tgt = st.drag.from === "A" ? lone(BA, 0, "B") : lone(AC, nA, "A");
        ctx.save(); ctx.strokeStyle = "rgba(47,127,216,.9)"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(tgt.x, tgt.y, Math.max(20, sc * 0.6) + 3 * Math.sin(st.t * 6), 0, 7); ctx.stroke(); ctx.restore();
      }
      /* le proton mobile */
      if (st.ph === "drag" && st.drag && !st.drag.view){
        var host = st.drag.from === "A" ? PA[AC.sites[nA - 1].host] : PB[BA.sites[0].host];
        drawProton(ctx, st.drag.x, st.drag.y, 1.1, host, true);
      } else if (st.ph === "fwd" || st.ph === "back"){
        var p0 = st.ph === "fwd" ? pA() : pB(), p1 = st.ph === "fwd" ? lone(BA, 0, "B") : lone(AC, nA, "A"), u = cbSmooth(st.u);
        var mx = (p0.x + p1.x) / 2, my = Math.min(p0.y, p1.y) - sc * 1.4;
        var xx = (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * mx + u * u * p1.x, yy2 = (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * my + u * u * p1.y;
        drawProton(ctx, xx, yy2, 1.1, null, true);
      } else if (st.ph === "ret" && st.ret){
        var home = st.ret.from === "A" ? pA() : pB(), ur = cbSmooth(st.u);
        drawProton(ctx, st.ret.x + (home.x - st.ret.x) * ur, st.ret.y + (home.y - st.ret.y) * ur, 1.1, null, true);
      } else {
        /* proton prêt à partir : halo pulsé */
        var pr = null;
        if (nA > 0 && nB === 0 && st.swap === 0) pr = pA(); else if (nB === 1 && !AC.poly) pr = pB();
        if (pr){ ctx.save(); ctx.globalAlpha = 0.78 + 0.22 * Math.sin(st.t * 4); ctx.strokeStyle = "#ffd24d"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(pr.x, pr.y, TP_RAD.H * sc * pr.s + 5, 0, 7); ctx.stroke(); ctx.restore(); }
      }

      /* ---------- noms (couleur du couple) ---------- */
      var fs = ph ? 13 : 15, nyA = view.cA[1] + sc * 1.75;
      var nameNowA = nameA(nA) + "", nameNowB = BA.names[nB];
      var conjA = nA < nTot, conjB = nB === 1;
      var fl = st.flash ? Math.min(1, st.flash) : 0;
      cbTag(ctx, nameNowA, view.cA[0], nyA, {size:fs, bg:conjA ? "#fff3e8" : colA, color:conjA ? "#a34a0b" : "#fff", stroke:colA});
      var roleA = nA === nTot ? "acide" : (AC.poly && nA > 0 && nB === 0 && st.swap === 0) ? "ampholyte : acide du couple suivant" : "base conjuguée";
      cbText(ctx, roleA, view.cA[0], nyA + fs + 6, {size:ph ? 10 : 11, color:"#0f2a44", w:800, halo:"rgba(255,255,255,.7)"});
      if (bAlpha > 0.05){
        ctx.save(); ctx.globalAlpha = bAlpha;
        var xb = view.cB[0] + st.bx * sc;
        cbTag(ctx, nameNowB, xb, nyA, {size:fs, bg:conjB ? colB : "#eaf3fd", color:conjB ? "#fff" : "#1f5aa3", stroke:colB});
        cbText(ctx, conjB ? "acide conjugué" : "base", xb, nyA + fs + 6, {size:ph ? 10 : 11, color:"#0f2a44", w:800, halo:"rgba(255,255,255,.7)"});
        ctx.restore();
      }
      if (fl > 0){ ctx.save(); ctx.globalAlpha = fl * 0.5; ctx.strokeStyle = "#ffd24d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(view.cA[0], view.cA[1], sc * (2.4 - fl * 0.5), 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(view.cB[0], view.cB[1], sc * (2.4 - fl * 0.5), 0, 7); ctx.stroke(); ctx.restore(); }

      /* ---------- équation colorée par couple ---------- */
      var acidNow = nA > 0 ? nA : 1;     /* couple en jeu : acide à acidNow protons */
      if (AC.poly && nB === 0 && nA < nTot && st.swap === 0) acidNow = nA;
      if (nA === 0 && AC.poly) acidNow = 1;
      if (!AC.poly) acidNow = 1;
      if (AC.poly && (nB === 1 || st.swap > 0)) acidNow = nA + 1;
      var a1 = AC.names[acidNow], b1 = AC.names[acidNow - 1], a2 = BA.names[1], b2 = BA.names[0];
      var parts = [[a1, colA], [" + ", "#0f1b2d"], [b2, colB], ["  ⇄  ", "#0f1b2d"], [b1, colA], [" + ", "#0f1b2d"], [a2, colB]];
      var efs = ph ? 12.5 : 14, tot = 0; parts.forEach(function(pp){ tot += cbTw(ctx, pp[0], efs, 800); });
      var ey = ph ? 20 : 22, ex = view.sceneW / 2 - tot / 2;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.88)"; cbRR(ctx, ex - 10, ey - 13, tot + 20, 26, 13); ctx.fill(); ctx.restore();
      parts.forEach(function(pp){ cbText(ctx, pp[0], ex, ey, {size:efs, color:pp[1], w:800, align:"left"}); ex += cbTw(ctx, pp[0], efs, 800); });
      /* polyacide : pKa des protons déjà partis */
      if (AC.poly && !ph){
        var lx = 8, ly = H - 3 * 24 - 4;
        var labs = ["1er H⁺", "2e H⁺", "3e H⁺"];
        for (var g = 0; g < 3; g++){
          var done = st.given.indexOf(g + 1) >= 0, nxt = !done && g === nTot - nA;
          var txt = labs[g] + " : pKa" + ["₁", "₂", "₃"][g] + " = " + cbFmt(AC.pKa[2 - g], 2);
          cbTag(ctx, txt, lx, ly + g * (ph ? 22 : 24), {align:"left", size:ph ? 10 : 11, bg:done ? colA : nxt ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.55)", color:done ? "#fff" : "#7a3a08", stroke:nxt ? colA : null});
        }
      }

      /* ---------- échelle de pKa ---------- */
      var pk1 = pKaA(acidNow), pk2 = BA.pKa[0], K = tpK(pk1, pk2);
      var lo = -8, hi = 15;
      if (!ph){
        var X0 = view.sceneW + 8, X1 = W - 8, top = 52, bot = H - 34, xa = X0 + (X1 - X0) * 0.42;
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.82)"; cbRR(ctx, X0, top - 30, X1 - X0, bot - top + 48, 12); ctx.fill(); ctx.restore();
        cbText(ctx, "pKa", xa, top - 16, {size:12, color:"#0f1b2d", w:800});
        var Yk = function(v){ return bot - (v - lo) / (hi - lo) * (bot - top); };
        var gr2 = ctx.createLinearGradient(0, top, 0, bot); gr2.addColorStop(0, "#2f7fd8"); gr2.addColorStop(1, "#ef7d2a");
        ctx.fillStyle = gr2; cbRR(ctx, xa - 4, top, 8, bot - top, 4); ctx.fill();
        [-5, 0, 5, 10, 14].forEach(function(v){ var yv = Yk(v); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xa - 7, yv); ctx.lineTo(xa - 4, yv); ctx.stroke(); cbText(ctx, cbFmt(v, 0), xa - 10, yv, {size:10, color:"#4b5a70", w:600, align:"right"}); });
        cbText(ctx, "acides plus forts ↓", (X0 + X1) / 2, bot + 11, {size:9.5, color:"#a34a0b", w:800});
        function mark(v, col, lab){ var yv = Yk(cbClamp(v, lo, hi)); cbBall(ctx, xa, yv, 7, col); cbTag(ctx, lab, xa + 12, yv, {align:"left", size:10.5, bg:"#fff", color:col, stroke:col}); return yv; }
        if (AC.poly) AC.pKa.forEach(function(v){ var yv = Yk(v); ctx.fillStyle = "rgba(239,125,42,.6)"; ctx.beginPath(); ctx.arc(xa, yv, 4, 0, 7); ctx.fill(); });
        var y1 = mark(pk1, colA, AC.fort ? "≈ " + cbFmt(pk1, 0) : cbFmt(pk1, 2)), y2 = mark(pk2, colB, cbFmt(pk2, 2));
        if (Math.abs(y1 - y2) > 18) cbArrow(ctx, xa - 16, y1, xa - 16, y2 + (y2 > y1 ? -6 : 6), "#0f1b2d", 1.6, 7);
      } else {
        var Y0 = view.sceneH + 2, xL = 26, xR = W - 26, yb = Y0 + 54;
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.86)"; cbRR(ctx, 6, Y0, W - 12, H - Y0 - 6, 12); ctx.fill(); ctx.restore();
        var Xk = function(v){ return xL + (v - lo) / (hi - lo) * (xR - xL); };
        cbText(ctx, "échelle de pKa (acides plus forts à gauche)", W / 2, Y0 + 13, {size:10.5, color:"#0f1b2d", w:800});
        var gr3 = ctx.createLinearGradient(xL, 0, xR, 0); gr3.addColorStop(0, "#ef7d2a"); gr3.addColorStop(1, "#2f7fd8");
        ctx.fillStyle = gr3; cbRR(ctx, xL, yb - 4, xR - xL, 8, 4); ctx.fill();
        [-5, 0, 5, 10, 14].forEach(function(v){ cbText(ctx, cbFmt(v, 0), Xk(v), yb + 15, {size:10, color:"#4b5a70", w:600}); });
        if (AC.poly) AC.pKa.forEach(function(v){ var xv = Xk(v); ctx.fillStyle = "rgba(239,125,42,.55)"; ctx.beginPath(); ctx.arc(xv, yb, 4, 0, 7); ctx.fill(); });
        function markH(v, col, lab, up){ var xv = Xk(cbClamp(v, lo, hi)); cbBall(ctx, xv, yb, 7, col); cbTag(ctx, lab, xv, yb + (up ? -20 : 34), {size:10, bg:"#fff", color:col, stroke:col, clampW:W}); }
        var close = Math.abs(Xk(pk1) - Xk(pk2)) < 52;
        markH(pk1, colA, AC.fort ? "≈ " + cbFmt(pk1, 0) : cbFmt(pk1, 2), true); markH(pk2, colB, cbFmt(pk2, 2), !close);
      }
      /* ---------- afficheurs ---------- */
      ro.set(0, a1 + " / " + b1 + " · pKa " + (AC.fort ? "≈ " + cbFmt(pk1, 0) : cbFmt(pk1, 2)));
      ro.set(1, a2 + " / " + b2 + " · pKa " + cbFmt(pk2, 2));
      var Ktxt = AC.fort ? "≈ 10" + cbSup(cbFmt(pk2 - pk1, 0)) : (Math.abs(pk2 - pk1) < 1e-9 ? "1" : cbSci(K, 1));
      ro.set(2, Ktxt.replace("≈ ", "≈ "));
      var sens = K >= 1e3 ? "quasi totale (→)" : K > 1e-3 ? "équilibre (⇄)" : "très limitée (←)";
      ro.set(3, sens);
      var pk1t = AC.fort ? cbFmt(pk1, 0) : cbFmt(pk1, 2);
      var msg = a1 + " (pKa " + (AC.fort ? "≈ " : "") + pk1t + ") cède son proton à " + b2 + " (pKa du couple " + a2 + "/" + b2 + " : " + cbFmt(pk2, 2) + "). K = 10^(" + cbFmt(pk2, 2) + " − " + (pk1 < 0 ? "(" + pk1t + ")" : pk1t) + ") " + (AC.fort ? Ktxt : "= " + Ktxt) + " : ";
      msg += K >= 1e3 ? "le proton passe presque complètement à la base." : K > 1e-3 ? "les deux sens se font, aucune forme ne l'emporte nettement." : "le proton revient presque toujours sur " + b1 + " : à l'équilibre, " + a1 + " reste très majoritaire.";
      if (AC.poly && nA === 0) msg = "Les trois protons sont partis : PO₄³⁻ n'a plus de proton à céder. Les pKa augmentent (2,15 ; 7,20 ; 12,35) : il est de plus en plus difficile d'arracher un H⁺ à un ion de plus en plus négatif.";
      nt.set(msg, "ok");
    });
  }
});

/* =====================================================================
   Banc de pile en 3D (commun aux simulations 4 et 5)
   ===================================================================== */
var BENCH = {xL:-2.75, xR:2.75, R:1.45, h:3.6, liq:2.7, plateOff:0.55, top:4.75, wireY:6.05};
function cbHull(pts){
  pts = pts.slice().sort(function(a, b){ return a.x - b.x || a.y - b.y; });
  function cr(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
  var lo = [], up = [];
  pts.forEach(function(p){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
  for (var i = pts.length - 1; i >= 0; i--){ var p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function cbPoly(ctx, pts){ ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); }
function cbRing(P, cx, cz, R, y, n){ var o = []; for (var i = 0; i < (n || 44); i++){ var t = i / (n || 44) * 2 * PI; o.push(P([cx + R * Math.cos(t), y, cz + R * Math.sin(t)])); } return o; }
/* cylindre vertical (gradient gauche-droite) */
function cbCyl(ctx, P, cx, cz, R, y0, y1, col, alpha, topCol){
  var r0 = cbRing(P, cx, cz, R, y0), r1 = cbRing(P, cx, cz, R, y1), hull = cbHull(r0.concat(r1));
  var xs = hull.map(function(p){ return p.x; }), mn = Math.min.apply(null, xs), mx = Math.max.apply(null, xs);
  var g = ctx.createLinearGradient(mn, 0, mx, 0);
  g.addColorStop(0, cbRgba(col, alpha * 0.95)); g.addColorStop(0.35, cbRgba(col, alpha * 0.7)); g.addColorStop(0.75, cbRgba(col, alpha * 0.85)); g.addColorStop(1, cbRgba(col, alpha));
  ctx.fillStyle = g; cbPoly(ctx, hull); ctx.fill();
  if (topCol){ ctx.fillStyle = topCol; cbPoly(ctx, r1); ctx.fill(); }
  return {hull:hull, top:r1, bot:r0, mn:mn, mx:mx};
}
/* tube épais le long d'une polyligne 3D (pont salin, fil) */
function cbTube(ctx, pts, w, col, hi){
  ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.strokeStyle = cbShade(col, -0.35); ctx.lineWidth = w; ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = w * 0.72; ctx.stroke();
  if (hi !== false){ ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = Math.max(1, w * 0.18); ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p.x - w * 0.15, p.y - w * 0.18) : ctx.moveTo(p.x - w * 0.15, p.y - w * 0.18); }); ctx.stroke(); }
  ctx.restore();
}
/* points d'une polyligne 3D à coins arrondis */
function cbPath3(list, rr){
  var out = [list[0]];
  for (var i = 1; i < list.length - 1; i++){
    var a = list[i - 1], b = list[i], c = list[i + 1];
    var d1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], d2 = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
    var l1 = Math.hypot(d1[0], d1[1], d1[2]), l2 = Math.hypot(d2[0], d2[1], d2[2]), r = Math.min(rr, l1 / 2, l2 / 2);
    var p0 = [b[0] - d1[0] / l1 * r, b[1] - d1[1] / l1 * r, b[2] - d1[2] / l1 * r], p1 = [b[0] + d2[0] / l2 * r, b[1] + d2[1] / l2 * r, b[2] + d2[2] / l2 * r];
    for (var k = 0; k <= 8; k++){ var u = k / 8, q0 = [p0[0] + (b[0] - p0[0]) * u, p0[1] + (b[1] - p0[1]) * u, p0[2] + (b[2] - p0[2]) * u], q1 = [b[0] + (p1[0] - b[0]) * u, b[1] + (p1[1] - b[1]) * u, b[2] + (p1[2] - b[2]) * u]; out.push([q0[0] + (q1[0] - q0[0]) * u, q0[1] + (q1[1] - q0[1]) * u, q0[2] + (q1[2] - q0[2]) * u]); }
  }
  out.push(list[list.length - 1]); return out;
}
/* position à la fraction s le long d'une polyligne 3D */
function cbAlong(pts, s){
  var L = [0], i; for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
  var t = cbClamp(s, 0, 1) * L[L.length - 1];
  for (i = 1; i < pts.length; i++) if (t <= L[i]){ var u = (t - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u, pts[i - 1][2] + (pts[i][2] - pts[i - 1][2]) * u]; }
  return pts[pts.length - 1];
}
/* paillasse et mur du labo */
function cbLab(ctx, W, H, P){
  var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#e9eef4"); bg.addColorStop(0.55, "#d5dde7"); bg.addColorStop(1, "#c3ccd8");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  /* carrelage du mur */
  ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1;
  for (var y = 14; y < H; y += 26){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (var x = 0; x < W; x += 26){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  ctx.restore();
  /* plan de travail */
  var a = P([-7, 0, -2.6]), b = P([7, 0, -2.6]), c = P([7, 0, 2.6]), d = P([-7, 0, 2.6]), e = P([7, -0.5, 2.6]), f = P([-7, -0.5, 2.6]);
  var g = ctx.createLinearGradient(0, Math.min(a.y, b.y), 0, Math.max(c.y, d.y)); g.addColorStop(0, "#4b5563"); g.addColorStop(1, "#2f3742");
  ctx.fillStyle = g; cbPoly(ctx, [a, b, c, d]); ctx.fill();
  ctx.fillStyle = "#1f252d"; cbPoly(ctx, [d, c, e, f]); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(c.x, c.y); ctx.stroke();
}
/* bécher : arrière (avant le contenu) */
function cbBeakerBack(ctx, P, cx, R, h, liqH, liqCol, liqA, sc){
  cbShadow(ctx, P([cx + 0.3, 0, 0.3]).x, P([cx + 0.3, 0, 0.3]).y, R * sc * 1.15, R * sc * 0.35, 0.25);
  var glass = cbCyl(ctx, P, cx, 0, R, 0, h, "#dfe9f2", 0.35);
  var liq = cbCyl(ctx, P, cx, 0, R * 0.97, 0.05, liqH, liqCol, liqA, null);
  return {glass:glass, liq:liq};
}
/* bécher : avant (après le contenu) : teinte du liquide devant, surface, verre */
function cbBeakerFront(ctx, P, cx, R, h, liqH, liqCol, liqA){
  var r0 = cbRing(P, cx, 0, R * 0.97, 0.05), r1 = cbRing(P, cx, 0, R * 0.97, liqH);
  var hull = cbHull(r0.concat(r1));
  ctx.save(); ctx.fillStyle = cbRgba(liqCol, liqA * 0.45); cbPoly(ctx, hull); ctx.fill();
  ctx.fillStyle = cbRgba(liqCol, Math.min(1, liqA * 0.55 + 0.12)); cbPoly(ctx, r1); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.2; cbPoly(ctx, r1); ctx.stroke();
  var top = cbRing(P, cx, 0, R, h), bot = cbRing(P, cx, 0, R, 0), gh = cbHull(top.concat(bot));
  ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.6; cbPoly(ctx, gh); ctx.stroke();
  ctx.strokeStyle = "rgba(140,160,185,.9)"; ctx.lineWidth = 1.3; cbPoly(ctx, top); ctx.stroke();
  /* reflets verticaux */
  var xs = gh.map(function(p){ return p.x; }), mn = Math.min.apply(null, xs), mx = Math.max.apply(null, xs);
  var ys = gh.map(function(p){ return p.y; }), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  ctx.globalAlpha = 0.5; ctx.fillStyle = "#fff"; ctx.fillRect(mn + (mx - mn) * 0.12, y0 + 10, Math.max(2, (mx - mn) * 0.05), (y1 - y0) * 0.7);
  ctx.globalAlpha = 0.25; ctx.fillRect(mn + (mx - mn) * 0.82, y0 + 16, Math.max(1.5, (mx - mn) * 0.025), (y1 - y0) * 0.6);
  ctx.restore();
  return {hull:gh};
}
/* électrode (plaque) en boîte 3D */
function cbPlate(ctx, P, x, col, a, b, yb, yt){
  cbBox(ctx, P, x - 0.07, x + 0.07, yb == null ? 0.45 : yb, yt == null ? BENCH.top : yt, -0.55, 0.55, col, a, b, {edge:"rgba(255,255,255,.3)"});
}
/* boîtier du voltmètre (affichage) et ampoule */
/* voltmètre posé entre les deux lames, sous le fil : il est branché EN DÉRIVATION sur les bornes de la pile
   (deux fils de mesure, rouge V et noir COM, vont chacun à une lame) ; renvoie ses deux bornes */
var CB_VM = {x:0.8, y0:4.9, y1:5.62, z:0.45};
function cbVoltmeter(ctx, P, a, b, txt, sc, ph, tL, tR, colL, colR, labL, labR){
  var m = CB_VM, ym = (m.y0 + m.y1) / 2, lw = Math.max(1.8, sc * 0.055);
  /* fils de mesure : de chaque borne du voltmètre vers la lame (pince sur la lame) */
  [[-1, tL, colL], [1, tR, colR]].forEach(function(q){
    var sx = q[0], t = q[1], bx = sx * (m.x - 0.05);
    var path = cbPath3([[bx, ym, m.z], [t[0] - sx * 0.32, ym, m.z], [t[0] - sx * 0.32, t[1] - 0.18, m.z * 0.6], [t[0] - sx * 0.06, t[1] - 0.18, 0.12]], 0.18);
    cbTube(ctx, path.map(P), lw, q[2], false);
    var pc = P([t[0] - sx * 0.06, t[1] - 0.18, 0.12]); ctx.save(); ctx.fillStyle = cbShade(q[2], -0.2); cbRR(ctx, pc.x - lw * 1.4, pc.y - lw * 0.9, lw * 2.8, lw * 1.8, lw * 0.5); ctx.fill(); ctx.restore();
  });
  cbBox(ctx, P, -m.x, m.x, m.y0, m.y1, m.z - 0.3, m.z + 0.3, "#f2c94c", a, b, {edge:"rgba(0,0,0,.25)"});
  var c = P([0, ym + 0.04, m.z + 0.31]), w = Math.max(58, sc * 1.1), hh = Math.max(17, sc * 0.4);
  ctx.save(); ctx.fillStyle = "#14231a"; cbRR(ctx, c.x - w / 2, c.y - hh / 2, w, hh, 4); ctx.fill();
  ctx.fillStyle = "#7dff9b"; ctx.font = "800 " + Math.round(hh * 0.62) + "px 'JetBrains Mono', ui-monospace, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, c.x, c.y + 1); ctx.restore();
  if (labL){ var la = P([-m.x - 0.05, m.y1 + 0.2, m.z]), lr = P([m.x + 0.05, m.y1 + 0.2, m.z]);
    cbText(ctx, labL, la.x, la.y, {size:ph ? 8.5 : 9.5, color:"#3a2a00", w:800, halo:"rgba(255,255,255,.85)"}); cbText(ctx, labR, lr.x, lr.y, {size:ph ? 8.5 : 9.5, color:"#3a2a00", w:800, halo:"rgba(255,255,255,.85)"}); }
}
/* récepteur dans la boucle principale, au milieu du fil du haut : une lampe ou une résistance */
function cbLoad(ctx, P, a, b, sc, lamp, kind){
  var y = BENCH.wireY;
  if (kind === "R"){
    cbBox(ctx, P, -0.55, 0.55, y - 0.2, y + 0.2, -0.2, 0.2, "#d9c7a3", a, b, {edge:"rgba(0,0,0,.25)"});
    ["#7a4a1a", "#111", "#d2452f"].forEach(function(cl, i){ var x = -0.3 + i * 0.22; cbBox(ctx, P, x, x + 0.08, y - 0.205, y + 0.205, -0.205, 0.205, cl, a, b); });
    return;
  }
  cbBox(ctx, P, -0.3, 0.3, y - 0.22, y + 0.22, -0.22, 0.22, "#9aa3ad", a, b, {edge:"rgba(0,0,0,.25)"});
  var lb = P([0, y + 0.85, 0]), r = Math.max(9, sc * 0.3), so = P([0, y + 0.22, 0]);
  ctx.fillStyle = "#8a939d"; ctx.fillRect(lb.x - r * 0.45, lb.y + r * 0.7, r * 0.9, Math.max(2, so.y - lb.y - r * 0.7));
  if (lamp > 0.02){ var gl = ctx.createRadialGradient(lb.x, lb.y, 0, lb.x, lb.y, r * 4); gl.addColorStop(0, "rgba(255,230,120," + (0.75 * lamp) + ")"); gl.addColorStop(1, "rgba(255,230,120,0)"); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(lb.x, lb.y, r * 4, 0, 7); ctx.fill(); }
  var g = ctx.createRadialGradient(lb.x - r * 0.3, lb.y - r * 0.3, 1, lb.x, lb.y, r);
  g.addColorStop(0, lamp > 0.05 ? "#fffbe0" : "#ffffff"); g.addColorStop(1, lamp > 0.05 ? "rgba(255,214,90," + (0.6 + 0.4 * lamp) + ")" : "rgba(200,210,220,.7)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lb.x, lb.y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = "rgba(120,130,140,.8)"; ctx.lineWidth = 1; ctx.stroke();
}
/* signes « + » ou « − » d'un pôle */
function cbPole(ctx, x, y, s, plus, ph){
  ctx.save(); ctx.fillStyle = plus ? "#d2452f" : "#2f6fd6"; ctx.beginPath(); ctx.arc(x, y, ph ? 10 : 12, 0, 7); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "800 " + (ph ? 15 : 17) + "px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(plus ? "+" : "−", x, y + 1); ctx.restore();
}

/* =====================================================================
   4. La pile Daniell vue de près : électrons, ions et pont salin (c08)
   ===================================================================== */
var DAN_E0 = 1.10, DAN_F = 96485, DAN_DH = -218.7;   /* E° = 0,34 − (−0,76) V ; ΔrH° (Zn + Cu²⁺) en kJ/mol */
function danE(zn, cu){ return DAN_E0 - 0.0592 / 2 * Math.log10(zn / cu); }
/* boule d'ion avec sa charge écrite */
function danIon(ctx, x, y, r, col, lab, alpha){
  cbBall(ctx, x, y, r, col, alpha);
  if (lab && r > 6){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.round(Math.max(8, r * 0.85)) + "px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(lab, x, y + 0.5); ctx.restore(); }
}
function danElec(ctx, x, y, r){
  var g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4); g.addColorStop(0, "rgba(255,226,90,.75)"); g.addColorStop(1, "rgba(255,226,90,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, 7); ctx.fill();
  cbBall(ctx, x, y, r, "#f5c518");
}

SFA.sim({
  id:"ch-pile-daniell-zoom", ch:"c08", tag:"Piles",
  titre:"La pile Daniell vue de près : électrons, ions et pont salin",
  resume:"Une grande pile Daniell en 3D qui allume une lampe. Promène la loupe : des atomes de zinc partent en ions Zn²⁺, des ions Cu²⁺ se déposent en cuivre, les électrons filent dans le fil et les ions migrent dans le pont salin. Retire le pont : le courant s'arrête. Plonge le zinc directement dans le sulfate de cuivre : ça ne fait que chauffer.",
  but:"Laisse la loupe faire le tour (lame de zinc, fil, lame de cuivre, pont salin) ou attrape-la pour la promener ; glisse ailleurs pour tourner le montage. Retire le pont salin et regarde les charges s'accumuler dans les solutions et la lampe s'éteindre. Change les concentrations pour voir la force électromotrice suivre la loi de Nernst. Passe ensuite en « zinc dans CuSO₄ » : même réaction, mais sans circuit, donc sans courant.",
  aRetenir:"Dans la pile Daniell, le zinc s'oxyde (Zn → Zn²⁺ + 2 e⁻) : c'est l'anode, le pôle −. Les ions Cu²⁺ se réduisent sur le cuivre (Cu²⁺ + 2 e⁻ → Cu) : c'est la cathode, le pôle +. Les électrons circulent dans le fil du zinc vers le cuivre ; dans le pont salin, les cations (K⁺) vont vers la cathode et les anions (NO₃⁻) vers l'anode, ce qui garde chaque solution neutre. E° = 0,34 − (−0,76) = 1,10 V et, hors conditions standard, E = E° − (0,0592/2)·log([Zn²⁺]/[Cu²⁺]). L'énergie électrique maximale vaut −ΔG = 2·F·E ≈ 212 kJ par mole de zinc.",
  piege:"Les électrons ne traversent jamais la solution ni le pont : dans le pont, ce sont des ions qui bougent. Sans pont, le circuit est ouvert : le zinc qui s'oxyde rendrait sa solution positive, le cuivre rendrait la sienne négative, et la réaction s'arrête aussitôt (ici au ralenti pour qu'on le voie). Si on plonge le zinc dans CuSO₄, la même réaction a lieu, mais les électrons passent directement : toute l'énergie part en chaleur (ΔH ≈ −219 kJ/mol), aucun courant utilisable.",
  build:function(k, S){
    var c = cbCanvas(k, 0.95, 1.12);
    var st = {t:0, a:0.22, b:0.3, I:1, q:0, prog:0, lx:null, loupe:{x:0, y:0, auto:true, ti:0, idx:0, init:false}, drag:null, anchors:{}, ph:0};
    var mS = k.seg("Montage", [["pile", "Pile Daniell"], ["contact", "Zinc plongé dans CuSO₄"]], "pile", function(){ st.prog = 0; st.loupe.idx = 0; st.loupe.ti = 0; st.loupe.auto = true; lT.set(true); });
    var bT = k.toggle("Pont salin en place", true), bEl = k.ctrl.lastElementChild;
    var znS = k.slider("[Zn²⁺]", 0.05, 2, 0.05, 1, "mol/L"), znEl = k.ctrl.lastElementChild;
    var cuS = k.slider("[Cu²⁺]", 0.05, 2, 0.05, 1, "mol/L");
    var lT = k.toggle("Loupe automatique (fait le tour)", true, function(v){ st.loupe.auto = v; st.loupe.ti = 0; });
    k.button("Recommencer", function(){ st.prog = 0; st.q = 0; st.I = 1; });
    var ro = k.readouts(["Force électromotrice E", "Électrons", "Pont salin", "Énergie par mole de Zn"]);
    var nt = k.note("", "ok");
    var TOUR = {pile:["zn", "fil", "cu", "pont"], contact:["zc", "zc2"]};

    c.pointer(function(type, p){
      var L = st.loupe;
      if (type === "down"){
        if (Math.hypot(p.x - L.x, p.y - L.y) < L.r){ st.drag = {loupe:true, dx:p.x - L.x, dy:p.y - L.y}; L.auto = false; lT.set(false); return; }
        st.drag = {view:true}; st.lx = p.x; st.ly = p.y;
      }
      if (type === "drag" && st.drag){
        if (st.drag.loupe){ L.x = p.x - st.drag.dx; L.y = p.y - st.drag.dy; }
        else { st.a = cbClamp(st.a + (p.x - st.lx) * 0.009, -0.75, 0.75); st.b = cbClamp(st.b + (p.y - st.ly) * 0.006, 0.08, 0.7); st.lx = p.x; st.ly = p.y; st.user = true; }
      }
      if (type === "up") st.drag = null;
      if (type === "move") c.cv.style.cursor = Math.hypot(p.x - L.x, p.y - L.y) < (L.r || 0) ? "move" : "grab";
    });
    c.cv.style.cursor = "grab";

    var lp = k.loop(function(dt){
      st.t += dt;
      var pile = mS.value === "pile";
      /* courant : coupé (au ralenti) sans pont */
      var target = pile ? (bT.value ? 1 : 0) : 1;
      if (pile){ if (target > st.I) st.I = Math.min(1, st.I + dt * 1.5); else st.I *= Math.exp(-dt / 0.7); if (st.I < 0.004) st.I = 0; }
      else st.I = 1;
      if (pile){ if (!bT.value) st.q = Math.min(1, st.q + dt * st.I * 0.9 + dt * 0.02 * (st.q < 0.98 ? 1 : 0) * (st.I > 0 ? 1 : 0)); else st.q = Math.max(0, st.q - dt * 0.8); }
      st.ph += dt * st.I;
      if (!pile) st.prog = Math.min(1, st.prog + dt / 45);
      if (!st.drag && !st.user) st.a = 0.22 + 0.16 * Math.sin(st.t * 0.25);
      /* loupe automatique */
      var L = st.loupe, tour = TOUR[mS.value];
      if (L.auto && L.init){
        L.ti += dt; if (L.ti > 4.6){ L.ti = 0; L.idx = (L.idx + 1) % tour.length; }
        var A = st.anchors[tour[L.idx % tour.length]];
        if (A){ var f = 1 - Math.exp(-dt * 3); L.x += (A.lx - L.x) * f; L.y += (A.ly - L.y) * f; }
      }
      k.redraw();
    });
    lp.play();

    /* ---------- contenus de la loupe ---------- */
    function lattice(ctx, x0, x1, y0, y1, d, col, skip){
      for (var j = 0; y0 + j * d <= y1 + d; j++) for (var i = 0; x0 + i * d <= x1 + d * 0.5; i++){
        var x = x0 + i * d + (j % 2 ? d * 0.5 : 0), y = y0 + j * d * 0.87;
        if (skip && skip(i, j, x, y)) continue;
        cbBall(ctx, x, y, d * 0.47, col);
      }
    }
    function zoomZn(ctx, cx, cy, r, ph, I, q, contact, prog){
      var d = r * 0.2, xs = cx - r * 0.12;           /* surface du métal */
      ctx.fillStyle = contact ? "#cfe0f7" : "#eef4fa"; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      var gm = ctx.createLinearGradient(cx - r, 0, xs, 0); gm.addColorStop(0, "#5f6b79"); gm.addColorStop(1, "#8794a4");
      ctx.fillStyle = gm; ctx.fillRect(cx - r, cy - r, xs - cx + r + d * 0.4, 2 * r);
      var phi = (ph / 2.2) % 1, jy = cy - d * 0.2;
      lattice(ctx, cx - r - d * 0.2, xs, cy - r - d, cy + r + d, d, "#aab6c4", function(i, j, x, y){ return x > xs - d * 0.6 && Math.abs(y - jy) < d * 0.45 && phi > 0.02 && phi < 0.93; });
      /* ions déjà en solution, et sulfates */
      for (var n = 0; n < 4; n++){ var ox = xs + r * (0.35 + 0.15 * n) + Math.sin(ph * 0.7 + n) * d * 0.3, oy = cy + (n - 1.5) * r * 0.42 + Math.cos(ph + n) * d * 0.2; if (ox < cx + r) danIon(ctx, ox, oy, d * 0.4, "#9b8cf0", "2+"); }
      if (contact){
        for (var m = 0; m < 3; m++){ var ux = cx + r * (0.25 + 0.22 * m) + Math.sin(ph + m * 2) * d * 0.3, uy = cy + (m - 1) * r * 0.55 + d * 0.9; danIon(ctx, ux, uy, d * 0.42, "#3d7fe0", "2+"); }
        /* dépôt de cuivre sur la surface */
        var nd = Math.round(prog * 6);
        for (var k2 = 0; k2 < nd; k2++){ var yy = cy + (k2 % 2 ? 1 : -1) * (1 + Math.floor(k2 / 2)) * d * 0.95 + d * 0.5; cbBall(ctx, xs + d * 0.45, yy, d * 0.46, "#c8743c"); }
      }
      if (I > 0.01 || contact){
        var u = cbSmooth(phi / 0.6), ix = xs - d * 0.2 + u * r * 0.5, iy = jy + Math.sin(u * PI) * d * 0.5;
        if (phi > 0.02 && phi < 0.93) danIon(ctx, ix, iy, d * (0.47 - 0.07 * u), u > 0.3 ? "#9b8cf0" : "#aab6c4", u > 0.3 ? "2+" : "");
        if (contact){
          /* Cu²⁺ qui arrive et prend les 2 e⁻ directement */
          var v = cbSmooth(phi / 0.45), cxu = xs + r * 0.75 - v * (r * 0.75 - d * 0.5), cyu = jy + d * 1.05;
          danIon(ctx, cxu, cyu, d * 0.44, v >= 1 ? "#c8743c" : "#3d7fe0", v >= 1 ? "" : "2+");
          if (phi > 0.3 && phi < 0.5){ var w = (phi - 0.3) / 0.2; for (var e = 0; e < 2; e++) danElec(ctx, xs - d * 0.1 + w * d * 0.5, jy + d * (0.3 + 0.35 * e) + w * d * 0.4, d * 0.14); }
          /* chaleur */
          ctx.save(); ctx.strokeStyle = "rgba(236,110,40,.65)"; ctx.lineWidth = 2;
          for (var h = 0; h < 3; h++){ var hx = xs + r * (0.15 + 0.2 * h), hy = cy - r * 0.35 - ((ph * 18 + h * 9) % 22); ctx.beginPath(); for (var s = 0; s < 14; s++){ var yy2 = hy - s * 2; s ? ctx.lineTo(hx + Math.sin(s * 0.9 + ph * 3) * 3, yy2) : ctx.moveTo(hx, yy2); } ctx.stroke(); }
          ctx.restore();
        } else {
          /* les 2 e⁻ montent dans le métal vers le fil */
          if (phi > 0.05 && phi < 0.95){ var w2 = (phi - 0.05) / 0.9; for (var e2 = 0; e2 < 2; e2++) danElec(ctx, xs - d * (0.7 + 0.8 * w2) - e2 * d * 0.35, jy - w2 * r * 1.05 + e2 * d * 0.3, d * 0.15); }
        }
      }
      if (!contact && q > 0.05){
        var nq = Math.round(q * 9);
        for (var p2 = 0; p2 < nq; p2++){ var px = xs + r * (0.2 + 0.68 * cbHash(p2, 1)), py = cy - r * 0.7 + r * 1.4 * cbHash(p2, 2); cbText(ctx, "+", px, py, {size:r * 0.16, color:"#d2452f", w:800}); }
      }
    }
    function zoomCu(ctx, cx, cy, r, ph, I, q){
      var d = r * 0.2, xs = cx + r * 0.12;
      ctx.fillStyle = "#cfe0f7"; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      var gm = ctx.createLinearGradient(xs, 0, cx + r, 0); gm.addColorStop(0, "#b8743f"); gm.addColorStop(1, "#7d4521");
      ctx.fillStyle = gm; ctx.fillRect(xs - d * 0.4, cy - r, cx + r - xs + d * 0.4, 2 * r);
      var phi = (ph / 2.2) % 1, jy = cy - d * 0.2;
      lattice(ctx, xs + d * 0.25, cx + r + d, cy - r - d, cy + r + d, d, "#d58a52");
      for (var n = 0; n < 3; n++){ var ox = xs - r * (0.45 + 0.17 * n) + Math.sin(ph * 0.7 + n) * d * 0.3, oy = cy + (n - 1) * r * 0.5 + d * 0.8 + Math.cos(ph + n) * d * 0.2; danIon(ctx, ox, oy, d * 0.42, "#3d7fe0", "2+"); }
      if (I > 0.01){
        var u = cbSmooth(phi / 0.6), ix = xs - r * 0.75 + u * (r * 0.75 - d * 0.5), iy = jy;
        if (phi < 0.95) danIon(ctx, ix, iy, d * 0.45, u >= 1 ? "#d58a52" : "#3d7fe0", u >= 1 ? "" : "2+", phi > 0.85 ? (0.95 - phi) * 10 : 1);
        if (phi < 0.62){ var w = phi / 0.62; for (var e = 0; e < 2; e++) danElec(ctx, xs + d * (0.9 - 0.4 * w) + e * d * 0.35, jy - r * (1.05 - w * 1.05) + e * d * 0.3, d * 0.15); }
      }
      if (q > 0.05){
        var nq = Math.round(q * 9);
        for (var p2 = 0; p2 < nq; p2++){ var px = xs - r * (0.2 + 0.68 * cbHash(p2, 3)), py = cy - r * 0.7 + r * 1.4 * cbHash(p2, 4); cbText(ctx, "−", px, py, {size:r * 0.2, color:"#2f6fd6", w:800}); }
      }
    }
    function zoomFil(ctx, cx, cy, r, ph, I){
      var d = r * 0.2;
      ctx.fillStyle = "#f3f5f8"; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      var g = ctx.createLinearGradient(0, cy - r * 0.42, 0, cy + r * 0.42); g.addColorStop(0, "#9a5a2c"); g.addColorStop(0.5, "#d08a52"); g.addColorStop(1, "#8a4d22");
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r * 0.42, 2 * r, r * 0.84);
      ctx.fillStyle = "#cfd6df"; ctx.fillRect(cx - r, cy - r * 0.55, 2 * r, r * 0.13); ctx.fillRect(cx - r, cy + r * 0.42, 2 * r, r * 0.13);
      lattice(ctx, cx - r, cx + r, cy - r * 0.3, cy + r * 0.32, d * 0.9, "#e09a60");
      for (var i = 0; i < 12; i++){
        var x = cx - r + ((i * 0.37 * r + ph * r * 0.5) % (2 * r)), y = cy - r * 0.3 + (i % 4) * r * 0.2 + Math.sin(st.t * 7 + i) * d * 0.12;
        if (I < 0.01) x = cx - r + (i * 0.37 * r) % (2 * r) + Math.sin(st.t * 9 + i * 2) * d * 0.15;
        danElec(ctx, x, y, d * 0.16);
      }
      if (I > 0.01) cbArrow(ctx, cx - r * 0.35, cy + r * 0.72, cx + r * 0.35, cy + r * 0.72, "#b88a00", 2.4, 9);
    }
    function zoomPont(ctx, cx, cy, r, ph, I){
      var d = r * 0.2;
      ctx.fillStyle = "#e8eef5"; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      var g = ctx.createLinearGradient(0, cy - r * 0.5, 0, cy + r * 0.5); g.addColorStop(0, "#c9d6e4"); g.addColorStop(0.5, "#f7fafc"); g.addColorStop(1, "#c3d0de");
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r * 0.5, 2 * r, r);
      ctx.strokeStyle = "rgba(120,140,165,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - r, cy - r * 0.5); ctx.lineTo(cx + r, cy - r * 0.5); ctx.moveTo(cx - r, cy + r * 0.5); ctx.lineTo(cx + r, cy + r * 0.5); ctx.stroke();
      for (var i = 0; i < 6; i++){
        var xk = cx - r + ((i * 0.34 * r + ph * r * 0.22) % (2 * r)), yk = cy - r * 0.25 + (i % 2) * r * 0.22;
        var xn = cx + r - ((i * 0.34 * r + 0.17 * r + ph * r * 0.22) % (2 * r)), yn = cy + r * 0.05 + (i % 2) * r * 0.22;
        danIon(ctx, xk, yk, d * 0.38, "#9b59d0", "+"); danIon(ctx, xn, yn, d * 0.38, "#2fa36b", "−");
      }
      cbText(ctx, "vers Zn", cx - r * 0.42, cy - r * 0.62, {size:Math.max(9, r * 0.12), color:"#2f6fd6", w:800});
      cbText(ctx, "vers Cu", cx + r * 0.42, cy - r * 0.62, {size:Math.max(9, r * 0.12), color:"#d2452f", w:800});
      if (I < 0.01) cbText(ctx, "pont retiré", cx, cy, {size:r * 0.18, color:"#d2452f", w:800, halo:"#fff"});
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, pile = mS.value === "pile", B = BENCH, bridge = pile && bT.value;
      if (bEl) bEl.style.display = pile ? "" : "none"; if (znEl) znEl.style.display = pile ? "" : "none";
      var zn = znS.value, cu = cuS.value, E = danE(zn, cu);
      ctx.clearRect(0, 0, W, H);
      var sc = pile ? Math.min(W * 0.95 / 9.0, H * 0.86 / 7.4) : Math.min(W * 0.95 / 6.6, H * 0.86 / 7.0), cx = pile ? W / 2 : W * 0.6, cy = H * 0.5;
      function P(p){ var q = cbRot([p[0], p[1] - 3.2, p[2]], st.a, st.b), s = 1 / (1 - q[2] * 0.03); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2]}; }
      cbLab(ctx, W, H, P);
      var anchors = {};
      if (pile){
        var xZn = B.xL - B.plateOff, xCu = B.xR + B.plateOff, colZn = "#eef3f8", colCu = "#2f78d0", aCu = 0.25 + 0.35 * Math.min(1, cu / 1.2);
        var order = st.a > 0 ? ["R", "L"] : ["L", "R"];
        /* arrières des béchers */
        cbBeakerBack(ctx, P, B.xL, B.R, B.h, B.liq, "#b9cadb", 0.45, sc);
        cbBeakerBack(ctx, P, B.xR, B.R, B.h, B.liq, colCu, aCu, sc);
        /* lames */
        cbPlate(ctx, P, xZn, "#9aa6b4", st.a, st.b);
        cbPlate(ctx, P, xCu, "#c87a45", st.a, st.b);
        /* pont salin */
        var bp = cbPath3([[B.xL + 0.55, 1.2, 0], [B.xL + 0.55, 4.35, 0], [B.xR - 0.55, 4.35, 0], [B.xR - 0.55, 1.2, 0]], 0.6);
        if (bridge){
          cbTube(ctx, bp.map(P), Math.max(8, sc * 0.42), "#e6edf4");
          /* ions dans le pont */
          for (var i = 0; i < 7; i++){
            var sK = (i / 7 + st.ph * 0.09) % 1, sN = 1 - ((i / 7 + 0.07 + st.ph * 0.09) % 1);
            var pk = P(cbAlong(bp, sK)), pn = P(cbAlong(bp, sN));
            cbBall(ctx, pk.x, pk.y - 1, Math.max(2.2, sc * 0.07), "#9b59d0"); cbBall(ctx, pn.x, pn.y + 1, Math.max(2.2, sc * 0.07), "#2fa36b");
          }
        } else {
          /* le pont posé sur la paillasse, devant */
          var off = cbPath3([[B.xL + 0.9, 0.12, 1.9], [B.xL + 0.9, 0.12, 2.2], [B.xR - 0.9, 0.12, 2.2], [B.xR - 0.9, 0.12, 1.9]], 0.3);
          cbTube(ctx, off.map(P), Math.max(7, sc * 0.36), "#e6edf4");
        }
        /* ions dans les solutions */
        for (var j = 0; j < 7; j++){
          var u = (j / 7 + st.ph * 0.11) % 1;
          var pz = P([xZn + 0.12 + u * 1.3, 0.6 + (j % 4) * 0.5, -0.4 + (j % 3) * 0.4]);
          cbBall(ctx, pz.x, pz.y, Math.max(2.2, sc * 0.075), "#9b8cf0", st.I > 0.01 ? Math.min(1, (1 - u) * 2) : 0.5);
          var pc = P([xCu - 0.12 - (1 - u) * 1.3, 0.6 + (j % 4) * 0.5, -0.4 + (j % 3) * 0.4]);
          cbBall(ctx, pc.x, pc.y, Math.max(2.2, sc * 0.075), "#3d7fe0", st.I > 0.01 ? Math.min(1, u * 2) : 0.5);
        }
        cbBeakerFront(ctx, P, B.xL, B.R, B.h, B.liq, "#b9cadb", 0.45);
        cbBeakerFront(ctx, P, B.xR, B.R, B.h, B.liq, colCu, aCu);
        /* signes des charges accumulées (sans pont) */
        if (st.q > 0.03){
          var nq = Math.round(st.q * 10);
          for (var s2 = 0; s2 < nq; s2++){
            var a1 = P([B.xL - 0.9 + 1.8 * cbHash(s2, 5), 0.5 + 1.9 * cbHash(s2, 6), 0.9]), a2 = P([B.xR - 0.9 + 1.8 * cbHash(s2, 7), 0.5 + 1.9 * cbHash(s2, 8), 0.9]);
            cbText(ctx, "+", a1.x, a1.y, {size:ph ? 15 : 18, color:"#d2452f", w:800, halo:"rgba(255,255,255,.8)"});
            cbText(ctx, "−", a2.x, a2.y, {size:ph ? 17 : 20, color:"#1f4fa8", w:800, halo:"rgba(255,255,255,.8)"});
          }
        }
        /* boucle principale : fil et lampe en série ; voltmètre en dérivation sur les bornes de la pile */
        var wp = [[xZn, B.top, 0], [xZn, B.wireY, 0], [-0.3, B.wireY, 0]], wq = [[0.3, B.wireY, 0], [xCu, B.wireY, 0], [xCu, B.top, 0]];
        cbTube(ctx, cbPath3(wp, 0.35).map(P), Math.max(3, sc * 0.11), "#b87333", false);
        cbTube(ctx, cbPath3(wq, 0.35).map(P), Math.max(3, sc * 0.11), "#b87333", false);
        cbLoad(ctx, P, st.a, st.b, sc, st.I, "L");
        var reading = E * (bridge ? 1 : st.I);
        cbVoltmeter(ctx, P, st.a, st.b, cbFmt(reading, 2) + " V", sc, ph, [xZn, B.top], [xCu, B.top], "#2c3e50", "#c0392b", "COM", "V");
        /* électrons dans le fil */
        var wire = cbPath3([[xZn, B.top, 0], [xZn, B.wireY, 0], [xCu, B.wireY, 0], [xCu, B.top, 0]], 0.35);
        for (var e = 0; e < 14; e++){ var se = (e / 14 + st.ph * 0.07) % 1, pe = P(cbAlong(wire, se)); if (Math.abs(cbAlong(wire, se)[0]) < 0.36 && cbAlong(wire, se)[1] > B.wireY - 0.1) continue; danElec(ctx, pe.x, pe.y, Math.max(2, sc * 0.06)); }
        /* pôles et étiquettes */
        var tz = P([xZn, B.top + 0.35, 0]), tc = P([xCu, B.top + 0.35, 0]);
        cbPole(ctx, tz.x - (ph ? 16 : 20), tz.y, sc, false, ph); cbPole(ctx, tc.x + (ph ? 16 : 20), tc.y, sc, true, ph);
        var lz = P([B.xL, 0.25, B.R]), lc = P([B.xR, 0.25, B.R]), fs = ph ? 10 : 11.5;
        cbTag(ctx, "Zn | ZnSO₄ " + cbFmt(zn, 2) + " M", lz.x, Math.min(lz.y + (ph ? 14 : 16), H - 12), {size:fs, bg:"rgba(255,255,255,.92)", color:"#334155", clampW:W});
        cbTag(ctx, "Cu | CuSO₄ " + cbFmt(cu, 2) + " M", lc.x, Math.min(lc.y + (ph ? 14 : 16), H - 12), {size:fs, bg:"rgba(255,255,255,.92)", color:"#1f4fa8", clampW:W});
        /* points d'ancrage de la loupe */
        anchors.zn = P([xZn + 0.07, 1.5, 0.3]); anchors.cu = P([xCu - 0.07, 1.5, 0.3]); anchors.fil = P([xZn, B.wireY - 0.45, 0]); anchors.pont = bridge ? P([0, 4.35, 0]) : P([0, 0.12, 2.2]);
      } else {
        /* zinc plongé directement dans le sulfate de cuivre */
        var pr = st.prog, aC = (0.25 + 0.35 * Math.min(1, cu / 1.2)) * (1 - 0.8 * pr);
        cbBeakerBack(ctx, P, 0, B.R * 1.2, B.h, B.liq, "#2f78d0", Math.max(0.06, aC), sc);
        cbPlate(ctx, P, -0.35, "#9aa6b4", st.a, st.b, 0.45, B.top + 0.4);
        /* dépôt de cuivre sur la lame */
        ctx.save(); ctx.globalAlpha = Math.min(0.95, pr * 1.6);
        for (var dI = 0; dI < 26; dI++){ var dq = P([-0.35 + 0.08, 0.5 + 2.1 * cbHash(dI, 1), -0.5 + cbHash(dI, 2)]); ctx.fillStyle = dI % 2 ? "#a0522d" : "#7a3b1c"; ctx.beginPath(); ctx.ellipse(dq.x, dq.y, sc * 0.09, sc * 0.06, 0, 0, 7); ctx.fill(); }
        ctx.restore();
        /* thermomètre */
        var T0 = 25, dTmax = Math.abs(DAN_DH) * 1000 * cu * 0.1 / (100 * 4.18), Tn = T0 + dTmax * pr;
        var th0 = P([0.75, 0.5, 0.2]), th1 = P([0.75, B.top + 1.0, 0.2]);
        ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = Math.max(7, sc * 0.2); ctx.beginPath(); ctx.moveTo(th0.x, th0.y); ctx.lineTo(th1.x, th1.y); ctx.stroke();
        var fT = cbClamp((Tn - 10) / 90, 0, 1); ctx.strokeStyle = "#d43b2a"; ctx.lineWidth = Math.max(3, sc * 0.08); ctx.beginPath(); ctx.moveTo(th0.x, th0.y); ctx.lineTo(th0.x + (th1.x - th0.x) * fT, th0.y + (th1.y - th0.y) * fT); ctx.stroke(); ctx.restore();
        cbBall(ctx, th0.x, th0.y, Math.max(5, sc * 0.15), "#d43b2a");
        cbBeakerFront(ctx, P, 0, B.R * 1.2, B.h, B.liq, "#2f78d0", Math.max(0.06, aC));
        var tt = P([0.75, B.top + 1.1, 0.2]);
        cbTag(ctx, "T = " + cbFmt(Tn, 0) + " °C", tt.x, tt.y - 14, {size:ph ? 11 : 12.5, bg:"#fff", color:"#a3341f", stroke:"#f1c9c1", clampW:W});
        var lb = P([0, 0.25, B.R * 1.2]);
        cbTag(ctx, "Zn dans CuSO₄ " + cbFmt(cu, 2) + " M (100 mL)", lb.x, lb.y + (ph ? 14 : 16), {size:ph ? 10 : 11.5, bg:"rgba(255,255,255,.92)", color:"#1f4fa8", clampW:W});
        anchors.zc = P([-0.35 + 0.07, 1.4, 0.3]); anchors.zc2 = P([-0.35 + 0.07, 2.2, -0.2]);
        st.dTmax = dTmax; st.Tn = Tn;
      }

      /* ---------- loupe ---------- */
      var L = st.loupe, rL = Math.round(Math.min(W, H) * (ph ? 0.21 : 0.19));
      L.r = rL;
      Object.keys(anchors).forEach(function(kk){ var A = anchors[kk], ox = pile ? 0 : -rL * 1.25; A.lx = cbClamp(A.x + ox, rL + 6, W - rL - 6); A.ly = cbClamp(A.y, rL + 6, H - rL - 6); });
      st.anchors = anchors;
      if (!L.init){ var A0 = anchors[TOUR[mS.value][0]]; L.x = A0.lx; L.y = A0.ly; L.init = true; }
      L.x = cbClamp(L.x, rL + 4, W - rL - 4); L.y = cbClamp(L.y, rL + 4, H - rL - 4);
      var best = null, bd = 1e9;
      Object.keys(anchors).forEach(function(kk){ var A = anchors[kk], d = Math.hypot(A.x - L.x, A.y - L.y); if (d < bd){ bd = d; best = kk; } });
      var kind = bd < rL * (pile ? 1.35 : 2.2) ? best : null;
      if (kind){ var A1 = anchors[kind]; if (Math.hypot(A1.x - L.x, A1.y - L.y) > rL * 0.9){ ctx.save(); ctx.strokeStyle = "rgba(15,27,45,.6)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(A1.x, A1.y); ctx.lineTo(L.x, L.y); ctx.stroke(); ctx.restore(); } ctx.save(); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(A1.x, A1.y, 6, 0, 7); ctx.stroke(); ctx.restore(); }
      /* manche */
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#5b3a1e"; ctx.lineWidth = Math.max(8, rL * 0.16);
      var hx = L.x + rL * 0.72, hy = L.y + rL * 0.72; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + rL * 0.42, hy + rL * 0.42); ctx.stroke(); ctx.restore();
      cbShadow(ctx, L.x + 6, L.y + 8, rL, rL, 0.18);
      ctx.save(); ctx.beginPath(); ctx.arc(L.x, L.y, rL, 0, 7); ctx.clip();
      var cap = "", cap2 = "", zph = st.ph * 1.2;
      if (kind === "zn"){ zoomZn(ctx, L.x, L.y, rL, zph, st.I, st.q, false, 0); cap = "Zn → Zn²⁺ + 2 e⁻"; cap2 = "anode (−) : oxydation"; }
      else if (kind === "cu"){ zoomCu(ctx, L.x, L.y, rL, zph, st.I, st.q); cap = "Cu²⁺ + 2 e⁻ → Cu"; cap2 = "cathode (+) : réduction"; }
      else if (kind === "fil"){ zoomFil(ctx, L.x, L.y, rL, zph, st.I); cap = st.I > 0.01 ? "e⁻ : du zinc vers le cuivre" : "plus de courant"; cap2 = "fil métallique"; }
      else if (kind === "pont"){ zoomPont(ctx, L.x, L.y, rL, zph, bridge ? st.I : 0); cap = "K⁺ → Cu, NO₃⁻ → Zn"; cap2 = "pont salin (KNO₃)"; }
      else if (kind === "zc" || kind === "zc2"){ zoomZn(ctx, L.x, L.y, rL, st.t * 1.2, 1, 0, true, st.prog); cap = "Zn + Cu²⁺ → Zn²⁺ + Cu"; cap2 = "e⁻ échangés au contact : chaleur"; }
      else { ctx.fillStyle = "rgba(240,245,250,.9)"; ctx.fillRect(L.x - rL, L.y - rL, 2 * rL, 2 * rL); cbWrap(ctx, "Approche la loupe d'une lame, du fil ou du pont", L.x, L.y - 10, rL * 1.5, 15, {size:12, color:"#334155"}); }
      if (kind === "zn" && st.q > 0.05) cbTag(ctx, "solution positive", L.x + rL * 0.35, L.y - rL * 0.72, {size:Math.max(9, rL * 0.1), bg:"#fff", color:"#d2452f"});
      if (kind === "cu" && st.q > 0.05) cbTag(ctx, "solution négative", L.x - rL * 0.35, L.y - rL * 0.72, {size:Math.max(9, rL * 0.1), bg:"#fff", color:"#1f4fa8"});
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "#2b2f36"; ctx.lineWidth = Math.max(5, rL * 0.08); ctx.beginPath(); ctx.arc(L.x, L.y, rL, 0, 7); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(L.x, L.y, rL - 5, PI * 1.05, PI * 1.45); ctx.stroke(); ctx.restore();
      /* légende de la loupe : au-dessus du verre, sinon dessous */
      if (cap){
        var cs = ph ? 11 : 12.5, above = L.y - rL - 42 > 2, y1 = above ? L.y - rL - 31 : L.y + rL + 17, y2 = above ? L.y - rL - 11 : L.y + rL + 37;
        cbTag(ctx, cap, L.x, y1, {size:cs, bg:"rgba(15,27,45,.88)", color:"#fff", clampW:W});
        cbTag(ctx, cap2, L.x, y2, {size:cs * 0.9, bg:"rgba(255,255,255,.95)", color:"#7a4b00", clampW:W});
      }

      /* ---------- afficheurs ---------- */
      if (pile){
        var Wel = 2 * DAN_F * E / 1000;
        ro.set(0, bridge ? cbFmt(E, 3) + " V" : "circuit ouvert");
        ro.set(1, st.I > 0.01 ? "du Zn (−) vers le Cu (+)" : "arrêtés : plus de courant");
        ro.set(2, bridge ? "K⁺ → Cu, NO₃⁻ → Zn" : "retiré : charges bloquées");
        ro.set(3, "−ΔG = 2FE = " + cbFmt(Wel, 0) + " kJ");
        var Qr = zn / cu;
        nt.set(bridge ? "E = E° − (0,0592/2)·log([Zn²⁺]/[Cu²⁺]) = 1,10 − 0,0296 × log(" + cbFmt(Qr, 3) + ") = <b>" + cbFmt(E, 3) + " V</b>. " +
          "Énergie électrique maximale : 2 × 96 485 × " + cbFmt(E, 3) + " = " + cbFmt(Wel, 0) + " kJ par mole de zinc oxydé. " + (Math.abs(Qr - 1) < 1e-9 ? "Concentrations égales : E = E°." : Qr < 1 ? "Moins de Zn²⁺ que de Cu²⁺ : E > E°." : "Plus de Zn²⁺ que de Cu²⁺ : E < E°.") + " Le voltmètre est branché en dérivation sur les bornes de la pile : la lecture affichée est la f.é.m. (mesurée à courant nul) ; en débit, la tension aux bornes est un peu plus faible."
          : "Pont retiré : la solution de zinc se charge positivement (Zn²⁺ en trop), celle de cuivre négativement (SO₄²⁻ en trop). Ces charges repoussent les nouveaux ions : la réaction et le courant s'arrêtent (en vrai presque instantanément ; ici au ralenti). Remets le pont.", bridge ? "ok" : "warn");
      } else {
        ro.set(0, "aucune : pas de circuit");
        ro.set(1, "directement de Zn à Cu²⁺");
        ro.set(2, "inutile : un seul bécher");
        ro.set(3, "≈ " + cbFmt(-DAN_DH, 0) + " kJ de chaleur");
        nt.set("Même réaction Zn + Cu²⁺ → Zn²⁺ + Cu, mais les électrons passent au contact : aucun courant ne sort, tout part en chaleur. Avec 100 mL de CuSO₄ à " + cbFmt(cu, 2) + " mol/L : n = " + cbFmt(cu * 0.1, 3) + " mol, Q = " + cbFmt(cu * 0.1 * Math.abs(DAN_DH), 1) + " kJ, soit au plus ΔT ≈ " + cbFmt(st.dTmax, 0) + " °C (sans pertes, c = 4,18 J·g⁻¹·K⁻¹). La couleur bleue de Cu²⁺ pâlit et du cuivre rouge se dépose sur le zinc.", "warn");
      }
    });
  }
});

/* =====================================================================
   5. L'électrode standard à hydrogène (c08)
   ===================================================================== */
/* E° (V, 25 °C) ; couleur de la solution et du métal */
var SHE_M = {
  Zn:{E:-0.76, n:2, ion:"Zn²⁺", sol:"#d6e0ea", sa:0.35, met:"#9aa6b4", nom:"le zinc", de:"du zinc"},
  Fe:{E:-0.44, n:2, ion:"Fe²⁺", sol:"#9fd49a", sa:0.4, met:"#6d7076", nom:"le fer", de:"du fer"},
  Ni:{E:-0.25, n:2, ion:"Ni²⁺", sol:"#4fb877", sa:0.45, met:"#b9bcae", nom:"le nickel", de:"du nickel"},
  Pb:{E:-0.13, n:2, ion:"Pb²⁺", sol:"#d6e0ea", sa:0.35, met:"#5f6670", nom:"le plomb", de:"du plomb"},
  Cu:{E:0.34, n:2, ion:"Cu²⁺", sol:"#2f78d0", sa:0.5, met:"#c87a45", nom:"le cuivre", de:"du cuivre"},
  Ag:{E:0.80, n:1, ion:"Ag⁺", sol:"#d6e0ea", sa:0.35, met:"#dfe3e8", nom:"l'argent", de:"de l'argent"}
};
var SHE_ORDER = ["Zn", "Fe", "Ni", "Pb", "Cu", "Ag"];
/* E(H⁺/H₂) = −0,0592·pH − (0,0592/2)·log(p(H₂)/1 bar) */
function sheE(pH, p){ return -0.0592 * pH - 0.0296 * Math.log10(p); }

SFA.sim({
  id:"ch-electrode-hydrogene", ch:"c08", tag:"Piles",
  titre:"L'électrode standard à hydrogène",
  resume:"Une lame de platine où bulle du dihydrogène sous 1 bar, dans un acide à pH 0 : c'est la référence des potentiels. Relie-la à une demi-pile au choix : le voltmètre lit directement E°, positif si le métal est plus noble que H₂, négatif sinon.",
  but:"Choisis la demi-pile de droite (Zn, Fe, Ni, Pb, Cu, Ag) : le voltmètre, borne COM sur l'électrode à hydrogène, affiche E° du couple. Regarde le signe : il change quand on passe du plomb au cuivre. Laisse la pile débiter pour voir dans quel sens vont les électrons et ce qui se passe sur le platine. Puis sors des conditions standard (pH, pression de H₂) : la lecture n'est plus E°. Glisse sur le montage pour le tourner.",
  aRetenir:"L'électrode standard à hydrogène (ESH) est une lame de platine platiné, plongée dans une solution où a(H⁺) = 1 (pH 0), balayée par H₂ sous 1 bar. Par convention, E°(H⁺/H₂) = 0 V à toute température. Une pile ESH | demi-pile X a donc une f.é.m. égale à E°(X) : c'est ainsi qu'on mesure (et qu'on définit) l'échelle des potentiels standard. Si E°(X) > 0, X est le pôle + (Cu²⁺ s'y réduit, H₂ s'oxyde sur le platine) ; si E°(X) < 0, X est le pôle − (Zn s'oxyde, H⁺ se réduit en H₂ sur le platine).",
  piege:"« 0 V » n'est pas une mesure : c'est un choix de référence. Le signe lu dépend du branchement : inverse les bornes du voltmètre et la valeur change de signe, mais E°(X) ne change pas. Hors conditions standard, l'électrode à hydrogène ne vaut plus 0 V : E(H⁺/H₂) = −0,0592·pH − 0,0296·log p(H₂) (en bar). Enfin, le platine ne réagit pas : il sert seulement de support aux électrons (électrode inerte).",
  build:function(k, S){
    var c = cbCanvas(k, 0.92, 1.28);
    var st = {t:0, a:0.2, b:0.3, ph:0, bub:[]};
    var mS = k.seg("Demi-pile reliée à l'électrode à hydrogène", SHE_ORDER.map(function(m){ return [m, SHE_M[m].ion + "/" + m]; }), "Cu");
    var dT = k.toggle("La pile débite (une résistance ferme le circuit)", true);
    var iT = k.toggle("Inverser les bornes du voltmètre", false);
    var pHS = k.slider("pH de la solution d'acide", 0, 3, 0.1, 0, "");
    var pS = k.slider("Pression de H₂", 0.1, 2, 0.1, 1, "bar");
    var ro = k.readouts(["Électrode à hydrogène : E(H⁺/H₂)", "Lecture du voltmètre (V − COM)", "Pôle + de la pile", "Sur le platine"]);
    var nt = k.note("", "ok");
    c.pointer(function(type, p){
      if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
      if (type === "drag" && st.drag){ st.a = cbClamp(st.a + (p.x - st.lx) * 0.009, -0.75, 0.75); st.b = cbClamp(st.b + (p.y - st.ly) * 0.006, 0.08, 0.7); st.lx = p.x; st.ly = p.y; st.user = true; }
      if (type === "up") st.drag = false;
    });
    c.cv.style.cursor = "grab";
    var lp = k.loop(function(dt){
      st.t += dt; if (dT.value) st.ph += dt;
      if (!st.drag && !st.user) st.a = 0.2 + 0.15 * Math.sin(st.t * 0.25);
      /* bulles de H₂ : arrivent par la cloche et remontent le long du platine */
      var rate = 9 * Math.sqrt(pS.value);
      if (Math.random() < rate * dt) st.bub.push({x:(Math.random() - 0.5) * 0.5, z:(Math.random() - 0.5) * 0.5, y:0.95 + Math.random() * 0.2, r:0.05 + Math.random() * 0.05, v:0.9 + Math.random() * 0.6});
      st.bub.forEach(function(b){ b.y += b.v * dt; b.x += Math.sin(st.t * 5 + b.v * 9) * dt * 0.05; });
      st.bub = st.bub.filter(function(b){ return b.y < BENCH.liq - 0.05; }).slice(-60);
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, B = BENCH, M = SHE_M[mS.value];
      var pH = pHS.value, pH2 = pS.value, Eh = sheE(pH, pH2), U = M.E - Eh, inv = iT.value, read = inv ? -U : U, deb = dT.value;
      var std = Math.abs(pH) < 1e-9 && Math.abs(pH2 - 1) < 1e-9;
      var benchW = ph ? W : W * 0.74, benchH = ph ? H - 96 : H;
      ctx.clearRect(0, 0, W, H);
      var sc = Math.min(benchW * 0.95 / 9.0, benchH * 0.86 / 7.4), cx = benchW / 2, cy = benchH * 0.5;
      function P(p){ var q = cbRot([p[0], p[1] - 3.2, p[2]], st.a, st.b), s = 1 / (1 - q[2] * 0.03); return {x:cx + q[0] * sc * s, y:cy - q[1] * sc * s, z:q[2]}; }
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, benchW, benchH); ctx.clip();
      cbLab(ctx, benchW, benchH, P);
      var xPt = B.xL - 0.35, xM = B.xR + B.plateOff, acid = "#e8eef5";
      /* béchers (arrière) */
      cbBeakerBack(ctx, P, B.xL, B.R, B.h, B.liq, "#cfe1ee", 0.38, sc);
      cbBeakerBack(ctx, P, B.xR, B.R, B.h, B.liq, M.sol, M.sa, sc);
      /* cloche de verre autour du platine, arrivée de H₂ */
      var bell = cbCyl(ctx, P, xPt, 0, 0.5, 0.75, 5.0, "#e3edf6", 0.28);
      ctx.save(); ctx.strokeStyle = "rgba(150,170,195,.8)"; ctx.lineWidth = 1.2; cbPoly(ctx, bell.hull); ctx.stroke(); ctx.restore();
      var inlet = cbPath3([[xPt - 2.2, 5.6, 0], [xPt - 0.9, 5.6, 0], [xPt - 0.9, 4.4, 0], [xPt - 0.48, 4.4, 0]], 0.3);
      cbTube(ctx, inlet.map(P), Math.max(6, sc * 0.2), "#e6edf4");
      /* bulles dans l'arrivée */
      for (var ib = 0; ib < 5; ib++){ var sb = (ib / 5 + st.t * 0.5) % 1, pb = P(cbAlong(inlet, sb)); cbBall(ctx, pb.x, pb.y, Math.max(1.6, sc * 0.045), "#ffffff", 0.9); }


      /* platine platiné (noir) et son fil */
      cbPlate(ctx, P, xPt, "#2f343b", st.a, st.b, 0.8, 2.0);
      var ptw = [[xPt, 2.0, 0], [xPt, 5.35, 0]];
      cbTube(ctx, ptw.map(P), Math.max(2.5, sc * 0.07), "#c9ced6", false);
      /* bulles de H₂ autour du platine */
      st.bub.forEach(function(b){ var q = P([xPt + b.x * 0.9, b.y, b.z]); cbBall(ctx, q.x, q.y, Math.max(1.4, b.r * sc), "#ffffff", 0.85); });
      /* lame métallique */
      cbPlate(ctx, P, xM, M.met, st.a, st.b);
      /* pont salin */
      var bp = cbPath3([[B.xL + 0.6, 1.2, 0], [B.xL + 0.6, 4.35, 0], [B.xR - 0.55, 4.35, 0], [B.xR - 0.55, 1.2, 0]], 0.6);
      cbTube(ctx, bp.map(P), Math.max(8, sc * 0.42), "#e6edf4");
      if (deb){ for (var i = 0; i < 6; i++){ var s1 = (i / 6 + st.ph * 0.08) % 1, pk = P(cbAlong(bp, U > 0 ? s1 : 1 - s1)), pn = P(cbAlong(bp, U > 0 ? 1 - ((s1 + 0.08) % 1) : (s1 + 0.08) % 1)); cbBall(ctx, pk.x, pk.y - 1, Math.max(2.2, sc * 0.07), "#9b59d0"); cbBall(ctx, pn.x, pn.y + 1, Math.max(2.2, sc * 0.07), "#2fa36b"); } }
      cbBeakerFront(ctx, P, B.xL, B.R, B.h, B.liq, "#cfe1ee", 0.38);
      cbBeakerFront(ctx, P, B.xR, B.R, B.h, B.liq, M.sol, M.sa);
      /* boucle principale (si la pile débite) : fil et résistance en série */
      if (deb){
        var wPt = cbPath3([[xPt, 5.35, 0], [xPt, B.wireY, 0], [-0.55, B.wireY, 0]], 0.35), wM = cbPath3([[0.55, B.wireY, 0], [xM, B.wireY, 0], [xM, B.top, 0]], 0.35);
        cbTube(ctx, wPt.map(P), Math.max(3, sc * 0.11), "#b87333", false);
        cbTube(ctx, wM.map(P), Math.max(3, sc * 0.11), "#b87333", false);
        cbLoad(ctx, P, st.a, st.b, sc, 0, "R");
      }
      /* voltmètre en dérivation sur les bornes : COM (noir) et V (rouge) */
      cbVoltmeter(ctx, P, st.a, st.b, (read >= 0 ? "+" : "−") + cbFmt(Math.abs(read), 2) + " V", sc, ph, [xPt, 5.35], [xM, B.top], inv ? "#c0392b" : "#2c3e50", inv ? "#2c3e50" : "#c0392b", inv ? "V" : "COM", inv ? "COM" : "V");
      /* électrons : du pôle − vers le pôle + */
      if (deb){
        var full = cbPath3([[xPt, 5.35, 0], [xPt, B.wireY, 0], [xM, B.wireY, 0], [xM, B.top, 0]], 0.35);
        for (var e = 0; e < 14; e++){ var se = (e / 14 + st.ph * 0.07) % 1; if (U < 0) se = 1 - se; var w3 = cbAlong(full, se); if (Math.abs(w3[0]) < 0.6 && w3[1] > B.wireY - 0.1) continue; var pe = P(w3); danElec(ctx, pe.x, pe.y, Math.max(2, sc * 0.06)); }
      }
      /* pôles */
      var tp = P([xPt, 5.1, 0]), tm = P([xM, B.top + 0.35, 0]);
      cbPole(ctx, tp.x - (ph ? 15 : 19), tp.y, sc, U < 0, ph); cbPole(ctx, tm.x + (ph ? 16 : 20), tm.y, sc, U > 0, ph);
      var hl = P([xPt - 2.2, 5.6, 0]);
      cbTag(ctx, "H₂ · " + cbFmt(pH2, 1) + " bar", Math.max(hl.x, 6), hl.y + (ph ? 42 : 48), {align:"left", size:ph ? 10 : 11.5, bg:std ? "rgba(255,255,255,.95)" : "#fff3d6", color:"#334155", clampW:benchW});
      /* étiquettes des demi-piles et réactions */
      var lz = P([B.xL, 0.25, B.R]), lc = P([B.xR, 0.25, B.R]), fs = ph ? 9.5 : 11; var yz = Math.min(lz.y + (ph ? 13 : 16), benchH - (ph ? 36 : 42)), yc = Math.min(lc.y + (ph ? 13 : 16), benchH - (ph ? 36 : 42));
      cbTag(ctx, "Pt | H₂ | H⁺ (pH " + cbFmt(pH, 1) + ")", lz.x, yz, {size:fs, bg:std ? "rgba(255,255,255,.93)" : "#fff3d6", color:"#334155", clampW:benchW});
      cbTag(ctx, mS.value + " | " + M.ion + " 1 M", lc.x, yc, {size:fs, bg:"rgba(255,255,255,.93)", color:"#334155", clampW:benchW});
      var rPt = U > 0 ? "H₂ → 2 H⁺ + 2 e⁻" : "2 H⁺ + 2 e⁻ → H₂", rM = U > 0 ? M.ion + " + " + (M.n > 1 ? M.n + " " : "") + "e⁻ → " + mS.value : mS.value + " → " + M.ion + " + " + (M.n > 1 ? M.n + " " : "") + "e⁻";
      if (deb){
        cbTag(ctx, rPt, lz.x, yz + (ph ? 22 : 24), {size:fs, bg:"rgba(15,27,45,.85)", color:"#fff", clampW:benchW});
        cbTag(ctx, rM, lc.x, yc + (ph ? 22 : 24), {size:fs, bg:"rgba(15,27,45,.85)", color:"#fff", clampW:benchW});
      }
      ctx.restore();

      /* ---------- échelle des E° ---------- */
      var lo = -0.9, hi = 0.95, list = SHE_ORDER.map(function(m){ return [m, SHE_M[m].E, SHE_M[m].ion + "/" + m]; });
      list.splice(4, 0, ["H", 0, "H⁺/H₂"]);
      if (!ph){
        var X0 = benchW + 6, X1 = W - 6, top = 40, bot = H - 20, xa = X0 + 50;
        ctx.save(); ctx.fillStyle = "#f7f9fc"; ctx.fillRect(benchW, 0, W - benchW, H); ctx.restore();
        cbText(ctx, "E° (V)", X0 + 6, 18, {size:12, color:"#0f1b2d", w:800, align:"left"});
        var Y = function(v){ return bot - (v - lo) / (hi - lo) * (bot - top); };
        var g = ctx.createLinearGradient(0, top, 0, bot); g.addColorStop(0, "#d2452f"); g.addColorStop(1, "#2f6fd6");
        ctx.fillStyle = g; cbRR(ctx, xa - 3, top, 6, bot - top, 3); ctx.fill();
        list.forEach(function(it){
          var y = Y(it[1]), on = it[0] === mS.value, ref = it[0] === "H";
          cbBall(ctx, xa, y, on || ref ? 6.5 : 4, ref ? "#0f1b2d" : on ? "#f2a900" : "#9aa6b4");
          cbText(ctx, it[2], xa + 11, y - (on || ref ? 6 : 0), {size:on || ref ? 11 : 10, color:on ? "#7a4b00" : ref ? "#0f1b2d" : "#5b6778", w:on || ref ? 800 : 700, align:"left"});
          if (on || ref) cbText(ctx, (it[1] > 0 ? "+" : it[1] < 0 ? "−" : "") + cbFmt(Math.abs(it[1]), 2) + " V", xa + 11, y + 7, {size:10, color:on ? "#7a4b00" : "#0f1b2d", w:700, align:"left"});
        });
        if (!std){ var yh = Y(cbClamp(Eh, lo, hi)); ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#a3341f"; ctx.beginPath(); ctx.moveTo(xa - 14, yh); ctx.lineTo(xa + 4, yh); ctx.stroke(); ctx.restore(); cbText(ctx, "ESH ici", xa - 16, yh, {size:9, color:"#a3341f", w:800, align:"right"}); }
        cbText(ctx, "oxydant plus fort ↑", (X0 + X1) / 2, bot + 11, {size:9, color:"#5b6778", w:700});
      } else {
        var Y0 = H - 96, xL = 20, xR = W - 20, yb = Y0 + 50;
        ctx.save(); ctx.fillStyle = "#f7f9fc"; ctx.fillRect(0, Y0, W, H - Y0); ctx.restore();
        cbText(ctx, "échelle des E° (V)", W / 2, Y0 + 12, {size:10.5, color:"#0f1b2d", w:800});
        var X = function(v){ return xL + (v - lo) / (hi - lo) * (xR - xL); };
        var g2 = ctx.createLinearGradient(xL, 0, xR, 0); g2.addColorStop(0, "#2f6fd6"); g2.addColorStop(1, "#d2452f");
        ctx.fillStyle = g2; cbRR(ctx, xL, yb - 3, xR - xL, 6, 3); ctx.fill();
        list.forEach(function(it, i){
          var x = X(it[1]), on = it[0] === mS.value, ref = it[0] === "H", up = i % 2 === 0;
          cbBall(ctx, x, yb, on || ref ? 6 : 3.8, ref ? "#0f1b2d" : on ? "#f2a900" : "#9aa6b4");
          cbText(ctx, ref ? "H₂" : it[0], x, yb + (up ? -14 : 15), {size:on || ref ? 11 : 10, color:on ? "#7a4b00" : ref ? "#0f1b2d" : "#5b6778", w:800});
        });
        cbText(ctx, mS.value + " : " + (M.E > 0 ? "+" : "−") + cbFmt(Math.abs(M.E), 2) + " V   ·   H⁺/H₂ : " + (std ? "0 V" : cbFmt(Eh, 3) + " V ici"), W / 2, yb + 33, {size:10.5, color:"#7a4b00", w:800});
      }

      /* ---------- afficheurs ---------- */
      ro.set(0, (Eh > 0.0005 ? "+" : "") + cbFmt(Eh, 3) + " V" + (std ? " (standard)" : ""));
      ro.set(1, (read >= 0 ? "+" : "−") + cbFmt(Math.abs(read), 3) + " V");
      ro.set(2, U > 0 ? M.nom : "l'électrode à H₂");
      ro.set(3, deb ? (U > 0 ? "oxydation de H₂" : "réduction de H⁺ en H₂") : "rien (pas de courant)");
      var txt = std
        ? "Conditions standard : E(H⁺/H₂) = 0 V, donc la lecture V − COM = E°(" + M.ion + "/" + mS.value + ") − 0 = <b>" + (M.E > 0 ? "+" : "−") + cbFmt(Math.abs(M.E), 2) + " V</b>. "
        : "Hors conditions standard : E(H⁺/H₂) = −0,0592 × " + cbFmt(pH, 1) + " − 0,0296 × log(" + cbFmt(pH2, 1) + ") = " + cbFmt(Eh, 3) + " V. La lecture vaut " + cbFmt(M.E, 2) + " − (" + cbFmt(Eh, 3) + ") = <b>" + cbFmt(U, 3) + " V</b> : ce n'est plus E°. ";
      txt += (U > 0 ? mS.value + " est plus noble que H₂ : la lame est le pôle +, les électrons vont du platine vers " + M.nom + "." : mS.value + " est moins noble que H₂ : la lame est le pôle −, les électrons vont " + M.de + " vers le platine, où H⁺ est réduit en H₂.");
      if (inv) txt += " Bornes inversées : le voltmètre affiche l'opposé, E° ne change pas.";
      txt += " Le voltmètre est branché en dérivation sur les bornes de la pile : la lecture affichée est la f.é.m. (mesurée à courant nul) ; en débit, la tension aux bornes est un peu plus faible.";
      nt.set(txt, std ? "ok" : "warn");
    });
  }
});

})();
