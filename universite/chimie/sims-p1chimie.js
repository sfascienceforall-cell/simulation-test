/* Chimie BA1 · lot p1-chimie (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-orbitales-3d · ch-de-broglie · ch-reaction-piston · ch-bombe-calorimetrique · ch-entropie-microetats */
(function(){
var PI = Math.PI;
/* ---------- constantes (CODATA 2018) ---------- */
var H_PL = 6.62607015e-34, M_E = 9.1093837015e-31, Q_E = 1.602176634e-19, C_L = 2.99792458e8;
var K_B = 1.380649e-23, R_GP = 8.314462618, A0_PM = 52.917721, RY_EV = 13.605693;

/* ---------- aides de dessin (préfixe p1) ---------- */
function p1shade(hex, f){
  var n = parseInt(String(hex).replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function p1rgba(hex, a){ var n = parseInt(String(hex).replace("#", ""), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function p1ball(ctx, x, y, r, hex, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, p1shade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, p1shade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, 7); ctx.fill(); ctx.restore();
}
function p1rr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function p1ell(ctx, cx, cy, rx, ry){ ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, 2 * PI); }
/* dégradé horizontal « métal / verre » pour un cylindre vertical */
function p1cylGrad(ctx, x0, x1, cols){
  var g = ctx.createLinearGradient(x0, 0, x1, 0);
  cols.forEach(function(c, i){ g.addColorStop(i / (cols.length - 1), c); });
  return g;
}
/* cylindre vertical plein : corps + fond + couvercle elliptiques */
function p1cyl(ctx, cx, yTop, yBot, rx, ry, base, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.fillStyle = p1cylGrad(ctx, cx - rx, cx + rx, [p1shade(base, -0.45), p1shade(base, 0.25), p1shade(base, 0.6), base, p1shade(base, -0.55)]);
  ctx.beginPath(); ctx.moveTo(cx - rx, yTop); ctx.lineTo(cx - rx, yBot); ctx.ellipse(cx, yBot, rx, ry, 0, PI, 0, true); ctx.lineTo(cx + rx, yTop); ctx.closePath(); ctx.fill();
  p1ell(ctx, cx, yTop, rx, ry); ctx.fillStyle = p1shade(base, 0.35); ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = p1shade(base, -0.4); ctx.stroke();
  ctx.restore();
}
function p1fz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
var SUPD = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
/* notation scientifique pour le canevas : 1,01·10²⁹ */
function p1sci(x, d){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.9995 && d <= 3){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return fmtN(x, Math.max(0, d - e));
  return fmtN(m, d) + "·10" + String(e).split("").map(function(ch){ return SUPD[ch]; }).join("");
}
function fmtN(x, d){
  var s = Number(x).toFixed(d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  return s.replace("-", "−").replace(".", ",");
}
/* même chose, version HTML pour les afficheurs */
function p1sciH(x, d){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.9995 && d <= 3){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return fmtN(x, Math.max(0, d - e));
  return fmtN(m, d) + "·10<sup>" + String(e).replace("-", "−") + "</sup>";
}
/* entier avec espaces fines : 126 410 606 437 752 */
function p1int(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function p1txt(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }

/* =====================================================================
   1. Orbitales s, p et d de l'hydrogène en 3D (L03)
   ===================================================================== */
function p1fact(n){ var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }
/* polynôme de Laguerre généralisé L_k^α(x) par récurrence */
function p1lag(k, al, x){
  if (k === 0) return 1;
  var L0 = 1, L1 = 1 + al - x;
  for (var i = 1; i < k; i++){ var L2 = ((2 * i + 1 + al - x) * L1 - (i + al) * L0) / (i + 1); L0 = L1; L1 = L2; }
  return L1;
}
/* partie radiale normée de l'hydrogène (Z = 1, r en a₀) */
function p1R(n, l, r){
  var rho = 2 * r / n, N = Math.sqrt(Math.pow(2 / n, 3) * p1fact(n - l - 1) / (2 * n * p1fact(n + l)));
  return N * Math.exp(-rho / 2) * Math.pow(rho, l) * p1lag(n - l - 1, 2 * l + 1, rho);
}
var YC0 = 0.5 / Math.sqrt(PI), YC1 = Math.sqrt(3 / (4 * PI)), YCZ = Math.sqrt(5 / (16 * PI)), YCX = Math.sqrt(15 / (4 * PI)), YCD = Math.sqrt(15 / (16 * PI)), IR2 = 1 / Math.SQRT2;
/* harmoniques sphériques réelles (x, y, z = vecteur unitaire) ; pl = normales des plans nodaux */
var P1ORB = {
  0:[{sub:"", m:"0", f:function(){ return YC0; }, mx:YC0, pl:[], ang:"aucun (le nuage est sphérique)"}],
  1:[{sub:"z", m:"0", f:function(x, y, z){ return YC1 * z; }, mx:YC1, pl:[[0, 0, 1]], ang:"plan nodal xy"},
     {sub:"x", m:"±1", f:function(x){ return YC1 * x; }, mx:YC1, pl:[[1, 0, 0]], ang:"plan nodal yz"},
     {sub:"y", m:"±1", f:function(x, y){ return YC1 * y; }, mx:YC1, pl:[[0, 1, 0]], ang:"plan nodal xz"}],
  2:[{sub:"z²", m:"0", f:function(x, y, z){ return YCZ * (3 * z * z - 1); }, mx:2 * YCZ, pl:[], cone:true, ang:"deux cônes nodaux (θ = 54,7° et 125,3°)"},
     {sub:"xz", m:"±1", f:function(x, y, z){ return YCX * x * z; }, mx:YCX / 2, pl:[[1, 0, 0], [0, 0, 1]], ang:"plans nodaux yz et xy"},
     {sub:"yz", m:"±1", f:function(x, y, z){ return YCX * y * z; }, mx:YCX / 2, pl:[[0, 1, 0], [0, 0, 1]], ang:"plans nodaux xz et xy"},
     {sub:"xy", m:"±2", f:function(x, y){ return YCX * x * y; }, mx:YCX / 2, pl:[[1, 0, 0], [0, 1, 0]], ang:"plans nodaux yz et xz"},
     {sub:"x²−y²", m:"±2", f:function(x, y){ return YCD * (x * x - y * y); }, mx:YCD, pl:[[IR2, IR2, 0], [IR2, -IR2, 0]], ang:"plans nodaux x = y et x = −y"}]
};
var LETTER = ["s", "p", "d"];

SFA.sim({
  id:"ch-orbitales-3d", ch:"L03", tag:"Orbitales",
  titre:"Orbitales s, p et d de l'hydrogène en 3D",
  resume:"Le nuage de probabilité de l'électron, tiré des vraies fonctions d'onde de l'hydrogène : fais-le tourner, coupe-le et compte ses nœuds radiaux et angulaires.",
  but:"Choisis n, ℓ puis l'orbitale (mₗ). Chaque point du nuage est une position possible de l'électron, tirée au hasard selon |ψ|² : bleu là où ψ > 0, orange là où ψ < 0. Fais tourner le nuage à la souris, active la vue en coupe pour voir les nœuds radiaux cachés à l'intérieur, et lis la probabilité radiale P(r) en dessous.",
  aRetenir:"Une orbitale est fixée par n, ℓ et mₗ (ℓ ≤ n − 1, −ℓ ≤ mₗ ≤ ℓ). Elle compte n − 1 nœuds : ℓ nœuds angulaires (plans ou cônes) et n − ℓ − 1 nœuds radiaux (sphères). Pour l'hydrogène, Eₙ = −13,6 eV/n² ne dépend que de n. Le rayon moyen ⟨r⟩ = (3n² − ℓ(ℓ + 1))·a₀/2, avec a₀ = 52,9 pm : l'orbitale grossit avec n.",
  piege:"La couleur des lobes est le signe de ψ, pas une charge : elle compte quand deux orbitales se recouvrent pour former une liaison. pₓ et p_y (et les orbitales d autres que d_z²) sont des combinaisons réelles de mₗ = +1 et −1 (ou ±2) : on ne peut pas leur attribuer un seul mₗ. Sur un nœud, la probabilité de trouver l'électron est nulle, et pourtant il occupe les deux côtés : c'est une onde stationnaire, pas une bille qui traverse.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 330 : 370), g = k.canvas(150);
    var st = {a:0.75, b:0.38, spin:true};
    var nS = k.seg("Nombre quantique principal n", [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]], "3", function(){ fixL(); rebuildM(); gen(); });
    var lS = k.seg("Nombre quantique secondaire ℓ", [["0", "0 (s)"], ["1", "1 (p)"], ["2", "2 (d)"]], "1", function(){ fixL(); rebuildM(); gen(); });
    var mS = k.select("Orbitale (mₗ)", [["0", "—"]], "0", function(){ gen(); });
    var nodT = k.toggle("Montrer les surfaces nodales", true);
    var cutT = k.toggle("Vue en coupe (tranche fine face à toi)", false);
    var spT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Orbitale", "Nombres quantiques", "Nœuds radiaux / angulaires", "Énergie Eₙ", "r le plus probable", "Rayon moyen ⟨r⟩"]);
    var nt = k.note("", "ok");
    var warn = "";
    function fixL(){
      var n = +nS.value, l = +lS.value;
      warn = "";
      if (l > n - 1){ warn = "Pour n = " + n + ", ℓ ne peut valoir que 0" + (n > 1 ? " à " + (n - 1) : "") + " (ℓ ≤ n − 1) : ℓ ramené à " + (n - 1) + ". "; lS.set(String(n - 1)); }
    }
    function rebuildM(){
      var n = +nS.value, l = +lS.value, el = mS.el;
      el.innerHTML = "";
      P1ORB[l].forEach(function(o, i){ var op = document.createElement("option"); op.value = String(i); op.textContent = "mₗ = " + o.m + " · " + n + LETTER[l] + o.sub + (o.m.indexOf("±") === 0 ? " (combinaison)" : ""); el.appendChild(op); });
      el.value = "0";
    }
    /* ---- nuage de points tiré selon |ψ|² ---- */
    var D = {};
    var NPOOL = phone ? 18000 : 28000, NFULL = phone ? 5500 : 9000;
    function orb(){ var l = +lS.value; return P1ORB[l][+mS.value] || P1ORB[l][0]; }
    function gen(){
      var n = +nS.value, l = +lS.value, o = orb();
      var rT = 6 * n * n + 12, M = 2400, dr = rT / M, pr = new Float64Array(M + 1), cdf = new Float64Array(M + 1), i;
      for (i = 0; i <= M; i++){ var r = i * dr, R = p1R(n, l, r); pr[i] = r * r * R * R; }
      for (i = 1; i <= M; i++) cdf[i] = cdf[i - 1] + 0.5 * (pr[i] + pr[i - 1]) * dr;
      var tot = cdf[M]; for (i = 0; i <= M; i++) cdf[i] /= tot;
      var rD = rT, imx = 0;
      for (i = 0; i <= M; i++){ if (cdf[i] >= 0.99){ rD = i * dr; break; } }
      for (i = 0; i <= M; i++) if (pr[i] > pr[imx]) imx = i;
      /* affinage du maximum (parabole sur trois points) */
      var rmp = imx * dr;
      if (imx > 0 && imx < M){ var y0 = pr[imx - 1], y1 = pr[imx], y2 = pr[imx + 1], den = y0 - 2 * y1 + y2; if (den !== 0) rmp += 0.5 * (y0 - y2) / den * dr; }
      /* nœuds radiaux : changements de signe de R, affinés par dichotomie */
      var roots = [], prev = p1R(n, l, dr);
      for (i = 2; i <= M; i++){
        var cur = p1R(n, l, i * dr);
        if (prev * cur < 0){ var a = (i - 1) * dr, b = i * dr; for (var it = 0; it < 50; it++){ var mid = 0.5 * (a + b); if (p1R(n, l, a) * p1R(n, l, mid) <= 0) b = mid; else a = mid; } roots.push(0.5 * (a + b)); }
        prev = cur;
      }
      D = {n:n, l:l, o:o, M:M, dr:dr, pr:pr, cdf:cdf, rD:rD, rmp:rmp, roots:roots, pmax:pr[imx]};
      D.X = new Float32Array(NPOOL); D.Y = new Float32Array(NPOOL); D.Z = new Float32Array(NPOOL); D.G = new Int8Array(NPOOL);
      for (i = 0; i < NPOOL; i++) samp(i);
      k.redraw();
    }
    function samp(i){
      var u = Math.random(), cdf = D.cdf, lo = 0, hi = D.M;
      while (hi - lo > 1){ var md = (lo + hi) >> 1; if (cdf[md] < u) lo = md; else hi = md; }
      var f = cdf[hi] > cdf[lo] ? (u - cdf[lo]) / (cdf[hi] - cdf[lo]) : 0, r = (lo + f) * D.dr;
      var o = D.o, x, y, z, Y, m2 = o.mx * o.mx;
      for (var t = 0; t < 400; t++){
        z = 2 * Math.random() - 1; var ph = 2 * PI * Math.random(), s = Math.sqrt(1 - z * z); x = s * Math.cos(ph); y = s * Math.sin(ph);
        Y = o.f(x, y, z); if (Math.random() * m2 <= Y * Y) break;
      }
      D.X[i] = x * r; D.Y[i] = y * r; D.Z[i] = z * r; D.G[i] = p1R(D.n, D.l, r) * Y >= 0 ? 1 : -1;
    }
    /* ---- vue : glisser pour tourner ---- */
    c.pointer(function(type, p){
      if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
      if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.011; st.b = Math.max(-1.5, Math.min(1.5, st.b + (p.y - st.ly) * 0.011)); st.lx = p.x; st.ly = p.y; if (st.spin){ st.spin = false; spT.set(false); } k.redraw(); }
      if (type === "up"){ st.lx = null; st.drag = false; }
    });
    c.cv.style.cursor = "grab";
    var lp = k.loop(function(dt){
      if (st.spin && !st.drag) st.a += dt * 0.38;
      /* le nuage « vit » : une petite part des positions est remesurée à chaque image */
      if (D.X) for (var j = 0; j < 140; j++) samp((Math.random() * NPOOL) | 0);
      k.redraw();
    });
    lp.play();
    /* rotation : coordonnées physiques (x, y, z) → écran (x vers toi, y à droite, z en haut) */
    var ca, sa, cb, sb;
    function R3(x, y, z){
      var X = y, Y = z, Z = x, x1 = X * ca + Z * sa, z1 = -X * sa + Z * ca;
      return [x1, Y * cb - z1 * sb, Y * sb + z1 * cb];
    }
    function nameAt(ctx, x, y, main, sub, size, col){
      ctx.save(); ctx.fillStyle = col; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      ctx.font = "800 " + size + "px Mulish, system-ui, sans-serif"; ctx.fillText(main, x, y);
      var w = ctx.measureText(main).width;
      ctx.font = "800 " + Math.round(size * 0.6) + "px Mulish, system-ui, sans-serif"; ctx.fillText(sub, x + w + 1, y + size * 0.22);
      ctx.restore();
    }
    var lastNote = "";
    k.draw(function(){
      if (!D.X) return;
      var ctx = c.ctx, W = c.W, H = c.H, i;
      ca = Math.cos(st.a); sa = Math.sin(st.a); cb = Math.cos(st.b); sb = Math.sin(st.b);
      /* fond : chambre sombre */
      var bg = ctx.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H / 2, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#1d2c4f"); bg.addColorStop(0.6, "#0d1730"); bg.addColorStop(1, "#060b18");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2 + (phone ? 14 : 8), rD = D.rD, sc = Math.min(W * 0.92, H) * 0.5 / rD, persp = rD * 5.5;
      function P(v){ var s = 1 / (1 - v[2] / persp); return {x:cx + v[0] * sc * s, y:cy - v[1] * sc * s, z:v[2], s:s}; }
      /* axes */
      var LA = rD * 1.05;
      [[[1, 0, 0], "x"], [[0, 1, 0], "y"], [[0, 0, 1], "z"]].forEach(function(a){
        var p0 = P(R3(-LA * a[0][0], -LA * a[0][1], -LA * a[0][2])), p1 = P(R3(LA * a[0][0], LA * a[0][1], LA * a[0][2]));
        ctx.save(); ctx.strokeStyle = "rgba(200,215,240,.28)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.restore();
        p1txt(S, c, a[1], p1.x + (p1.x - cx) * 0.06, p1.y + (p1.y - cy) * 0.06, {size:13, color:"rgba(220,230,250,.85)", math:true, italic:true});
      });
      /* points : moitié arrière, surfaces nodales, moitié avant */
      var cut = cutT.value, slab = rD * 0.075, n0 = cut ? NPOOL : NFULL;
      var back = [], front = [];
      for (i = 0; i < n0; i++){
        var v = R3(D.X[i], D.Y[i], D.Z[i]);
        if (cut && Math.abs(v[2]) > slab) continue;
        var pp = P(v);
        (v[2] < 0 ? back : front).push(pp.x, pp.y, D.G[i]);
      }
      function dots(arr, alpha, sz){
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        ["#3d8bff", "#ff7a2f"].forEach(function(col, k2){
          var sg = k2 === 0 ? 1 : -1; ctx.fillStyle = p1rgba(col, alpha);
          for (var j = 0; j < arr.length; j += 3) if (arr[j + 2] === sg) ctx.fillRect(arr[j] - sz / 2, arr[j + 1] - sz / 2, sz, sz);
        });
        ctx.restore();
      }
      var szB = cut ? 2.3 : 1.7, szF = cut ? 2.6 : 2.1;
      dots(back, cut ? 0.75 : 0.42, szB);
      /* noyau */
      S.draw.glow(c, cx, cy, 9, "#ffe08a", 0.9); p1ball(ctx, cx, cy, 2.6, "#ffd34d");
      if (nodT.value){
        ctx.save();
        /* nœuds radiaux : sphères */
        D.roots.forEach(function(r0){
          ctx.beginPath(); ctx.arc(cx, cy, r0 * sc, 0, 2 * PI);
          ctx.fillStyle = "rgba(255,214,102,.05)"; ctx.fill();
          ctx.setLineDash([6, 4]); ctx.lineWidth = 1.6; ctx.strokeStyle = "rgba(255,214,102,.85)"; ctx.stroke();
        });
        ctx.setLineDash([]);
        /* nœuds angulaires : plans */
        var Lp = rD * 0.95;
        D.o.pl.forEach(function(nv){
          var u = Math.abs(nv[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
          var e1 = [nv[1] * u[2] - nv[2] * u[1], nv[2] * u[0] - nv[0] * u[2], nv[0] * u[1] - nv[1] * u[0]], l1 = Math.hypot(e1[0], e1[1], e1[2]);
          e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1];
          var e2 = [nv[1] * e1[2] - nv[2] * e1[1], nv[2] * e1[0] - nv[0] * e1[2], nv[0] * e1[1] - nv[1] * e1[0]];
          ctx.beginPath();
          [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(function(sg, j){
            var q = P(R3(Lp * (sg[0] * e1[0] + sg[1] * e2[0]), Lp * (sg[0] * e1[1] + sg[1] * e2[1]), Lp * (sg[0] * e1[2] + sg[1] * e2[2])));
            if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y);
          });
          ctx.closePath(); ctx.fillStyle = "rgba(255,214,102,.09)"; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(255,214,102,.6)"; ctx.stroke();
        });
        /* cônes nodaux de d_z² : tan θ = √2 */
        if (D.o.cone){
          var hc = rD * 0.62, rc = hc * Math.SQRT2;
          [-1, 1].forEach(function(sg){
            ctx.beginPath();
            for (var j = 0; j <= 48; j++){ var t = j / 48 * 2 * PI, q = P(R3(rc * Math.cos(t), rc * Math.sin(t), sg * hc)); if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
            ctx.fillStyle = "rgba(255,214,102,.07)"; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(255,214,102,.65)"; ctx.stroke();
            for (var j2 = 0; j2 < 8; j2++){ var t2 = j2 / 8 * 2 * PI, q2 = P(R3(rc * Math.cos(t2), rc * Math.sin(t2), sg * hc)); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(q2.x, q2.y); ctx.strokeStyle = "rgba(255,214,102,.3)"; ctx.stroke(); }
          });
        }
        ctx.restore();
      }
      dots(front, cut ? 0.85 : 0.55, szF);
      /* nom de l'orbitale */
      var n = D.n, l = D.l, o = D.o;
      nameAt(ctx, 14, phone ? 34 : 40, n + LETTER[l], o.sub, phone ? 26 : 32, "#ffffff");
      p1txt(S, c, "n = " + n + " · ℓ = " + l + " · mₗ = " + o.m, 15, phone ? 52 : 60, {size:p1fz(c, 12.5), color:"#c7d3ea", align:"left", weight:700});
      /* barre d'échelle */
      var nice = [10, 20, 50, 100, 200, 500, 1000], Lpm = 50;
      for (i = 0; i < nice.length; i++){ if (nice[i] / A0_PM * sc >= 45){ Lpm = nice[i]; break; } }
      var Lpx = Lpm / A0_PM * sc, by = H - 16;
      ctx.save(); ctx.strokeStyle = "#e9eef8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, by - 4); ctx.lineTo(14, by); ctx.lineTo(14 + Lpx, by); ctx.lineTo(14 + Lpx, by - 4); ctx.stroke(); ctx.restore();
      p1txt(S, c, Lpm + " pm", 14 + Lpx / 2, by - 11, {size:p1fz(c, 11.5), color:"#e9eef8"});
      /* légende */
      var lx = W - (phone ? 92 : 104), ly = H - 50;
      ctx.save(); ctx.fillStyle = "rgba(6,11,24,.55)"; p1rr(ctx, lx - 8, ly - 12, phone ? 88 : 98, 54, 7); ctx.fill(); ctx.restore();
      [["#3d8bff", "ψ > 0"], ["#ff7a2f", "ψ < 0"]].forEach(function(it, j){ S.draw.dot(c, lx + 4, ly + j * 16, 3.5, it[0]); p1txt(S, c, it[1], lx + 14, ly + j * 16, {size:p1fz(c, 11.5), color:"#e9eef8", align:"left", math:true}); });
      ctx.save(); ctx.strokeStyle = "rgba(255,214,102,.9)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(lx - 2, ly + 32); ctx.lineTo(lx + 10, ly + 32); ctx.stroke(); ctx.restore();
      p1txt(S, c, "nœud", lx + 14, ly + 32, {size:p1fz(c, 11.5), color:"#e9eef8", align:"left"});
      p1txt(S, c, "glisse pour tourner", W - 12, 16, {size:p1fz(c, 11), color:"rgba(199,211,234,.75)", align:"right", weight:600});
      if (cut) p1txt(S, c, "coupe : tranche de " + fmtN(2 * slab * A0_PM, 0) + " pm d'épaisseur", W - 12, 32, {size:p1fz(c, 11), color:"#ffd666", align:"right", weight:700});

      /* ---- probabilité radiale P(r) = r²R² ---- */
      g.clear();
      var gx = g.ctx, xmax = rD * 1.12 * A0_PM, toY = 100 / A0_PM; /* P(r) par 100 pm */
      var ax = S.draw.axes(g, {x0:0, x1:xmax, y0:0, y1:D.pmax * toY * 1.22, xl:"r (pm)", yl:"P(r) par 100 pm", l:46, b:30, t:10, r:14});
      gx.save(); gx.beginPath();
      var step = Math.max(1, Math.floor(D.M / 600));
      gx.moveTo(ax.X(0), ax.Y(0));
      for (i = 0; i <= D.M; i += step){ var rp = i * D.dr * A0_PM; if (rp > xmax) break; gx.lineTo(ax.X(rp), ax.Y(D.pr[i] * toY)); }
      gx.lineTo(ax.X(Math.min(xmax, D.M * D.dr * A0_PM)), ax.Y(0)); gx.closePath();
      var gg = gx.createLinearGradient(0, ax.T, 0, ax.B); gg.addColorStop(0, "rgba(47,111,214,.45)"); gg.addColorStop(1, "rgba(47,111,214,.06)");
      gx.fillStyle = gg; gx.fill(); gx.lineWidth = 2.2; gx.strokeStyle = "#1f4b9e"; gx.stroke(); gx.restore();
      S.draw.line(g, ax.X(D.rmp * A0_PM), ax.T + 4, ax.X(D.rmp * A0_PM), ax.B, "#c26a0c", 1.4, [5, 4]);
      var rmpTxt = "r max = " + fmtN(D.rmp * A0_PM, 0) + " pm", rx0 = ax.X(D.rmp * A0_PM) + 5, alR = rx0 > g.W - 110 ? "right" : "left";
      p1txt(S, g, rmpTxt, alR === "left" ? rx0 : rx0 - 10, ax.T + 8, {size:p1fz(g, 11), color:"#c26a0c", align:alR, halo:true});
      D.roots.forEach(function(r0){ S.draw.dot(g, ax.X(r0 * A0_PM), ax.Y(0), 5, "#c0321d"); });
      if (D.roots.length) p1txt(S, g, "● nœud radial", ax.R - 2, ax.T + 24, {size:p1fz(g, 10.5), color:"#c0321d", align:"right", halo:true});
      var rm = (3 * n * n - l * (l + 1)) / 2;
      gx.save(); gx.fillStyle = "#24775a"; gx.beginPath(); var xm = ax.X(rm * A0_PM); gx.moveTo(xm, ax.B - 1); gx.lineTo(xm - 5, ax.B - 10); gx.lineTo(xm + 5, ax.B - 10); gx.closePath(); gx.fill(); gx.restore();
      p1txt(S, g, "⟨r⟩", xm, ax.B - 17, {size:11, color:"#24775a", halo:true});

      /* ---- afficheurs ---- */
      ro.set(0, n + LETTER[l] + (o.sub ? "<sub>" + o.sub + "</sub>" : ""));
      ro.set(1, "n = " + n + ", ℓ = " + l + ", mₗ = " + o.m);
      ro.set(2, (n - l - 1) + " / " + l);
      ro.set(3, S.fmt(-RY_EV / (n * n), 2) + " eV");
      ro.set(4, S.fmt(D.rmp * A0_PM, 0) + " pm");
      ro.set(5, S.fmt(rm * A0_PM, 0) + " pm");
      var rad = D.roots.length ? (D.roots.length === 1 ? "Nœud radial (sphère) à r = " : "Nœuds radiaux (sphères) à r = ") + D.roots.map(function(r0){ return S.fmt(r0, 2) + " a₀ (" + S.fmt(r0 * A0_PM, 0) + " pm)"; }).join(" et ") + ". " : "Aucun nœud radial. ";
      var msg = warn + rad + "Angulaire : " + o.ang + ". Total : " + (n - 1) + " nœud" + (n - 1 > 1 ? "s" : "") + " = n − 1." + (o.m.indexOf("±") === 0 ? " Cette orbitale réelle combine mₗ = +" + o.m.slice(1) + " et −" + o.m.slice(1) + "." : "");
      if (msg !== lastNote){ nt.set(msg, warn ? "warn" : "ok"); lastNote = msg; }
    });
    rebuildM(); gen();
  }
});

/* =====================================================================
   2. Électron ou balle de tennis : longueur d'onde de de Broglie (c01)
   ===================================================================== */
var D_GR = [0.213e-9, 0.123e-9], L_TUBE = 0.135, M_BALL = 0.058, D_BALL = 0.067;
function p1lambdaE(U){ return H_PL / Math.sqrt(2 * M_E * Q_E * U); }
function p1ring(U, d){ var s = p1lambdaE(U) / (2 * d); return s >= 1 ? NaN : L_TUBE * Math.tan(2 * Math.asin(s)); }

SFA.sim({
  id:"ch-de-broglie", ch:"c01", tag:"Dualité onde-corpuscule",
  titre:"Électron ou balle de tennis : la longueur d'onde de de Broglie",
  resume:"Un canon à électrons tire à travers une feuille de graphite : des anneaux de diffraction apparaissent et se resserrent quand la tension monte. La balle de tennis, elle, ne diffracte jamais.",
  but:"Règle la tension d'accélération U (curseur, ou glisse sur le tube) et regarde les anneaux sur l'écran fluorescent : ils se resserrent quand U augmente, car λ diminue. En dessous, compare avec une balle de tennis servie à la vitesse que tu choisis.",
  aRetenir:"Toute particule de quantité de mouvement p a une longueur d'onde λ = h/p (de Broglie). Un électron accéléré sous U a une énergie cinétique eU, donc p = √(2meU) et λ = h/√(2meU) ≈ 1,23 nm/√(U en V). Les anneaux viennent de la réflexion de Bragg sur les plans du graphite : 2d·sin θ = λ. Pour une balle de 58 g à 50 m/s, λ ≈ 2·10⁻³⁴ m : rien d'ondulatoire n'est observable à notre échelle.",
  piege:"La formule non relativiste suffit tant que eU ≪ mc² = 511 keV : à 10 kV l'erreur sur λ n'atteint que 0,5 %. Les anneaux sont plus petits quand U monte (λ plus courte) : ce n'est pas l'inverse. Et la longueur d'onde de la balle n'est pas « petite mais mesurable » : elle est 10³³ fois plus petite que la balle elle-même.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 430 : 330), g = k.canvas(phone ? 190 : 175);
    var uS = k.slider("Tension d'accélération U", 1.5, 10, 0.1, 4, "kV");
    var vS = k.slider("Vitesse de la balle de tennis", 5, 70, 1, 50, "m/s");
    var ro = k.readouts(["λ de l'électron", "Vitesse de l'électron", "Rayon de l'anneau 1 (d = 0,213 nm)", "Rayon de l'anneau 2 (d = 0,123 nm)", "Écart dû à la relativité", "λ de la balle de tennis"]);
    var nt = k.note("", "ok");
    k.note("Montage : feuille de graphite, écran à L = 13,5 cm (supposé plan), anneaux de rayon R = L·tan 2θ. Balle : m = 58 g, diamètre 6,7 cm. h = 6,626·10⁻³⁴ J·s ; mₑ = 9,109·10⁻³¹ kg ; e = 1,602·10⁻¹⁹ C.", "");
    var t0 = 0, tt = 0, el = [];
    for (var i = 0; i < 90; i++){ var u = Math.random(); el.push({ph:Math.random(), kind:u < 0.42 ? 0 : u < 0.75 ? 1 : 2, ang:Math.random() * 2 * PI}); }
    var drag = null;
    c.pointer(function(type, p){
      if (type === "down") drag = {x:p.x, U:uS.value};
      if (type === "drag" && drag){ uS.set(Math.round((drag.U + (p.x - drag.x) * 0.03) * 10) / 10); k.redraw(); }
      if (type === "up") drag = null;
    });
    c.cv.style.cursor = "ew-resize";
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, U = uS.value * 1000;
      var lam = p1lambdaE(U), v = Math.sqrt(2 * Q_E * U / M_E), R1 = p1ring(U, D_GR[0]), R2 = p1ring(U, D_GR[1]);
      var rel = (Math.sqrt(1 + Q_E * U / (2 * M_E * C_L * C_L)) - 1) * 100;
      /* fond : paillasse dans une salle sombre */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1a2335"); bg.addColorStop(1, "#2a3448"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var tx0 = W * 0.04, tx1 = phone ? W * 0.96 : W * 0.64, Lt = tx1 - tx0, Rb = Lt * 0.275;
      var cy = phone ? Rb + 24 : H * 0.42, benchY = phone ? cy + Rb + 10 : H * 0.8;
      var wood = ctx.createLinearGradient(0, benchY, 0, H); wood.addColorStop(0, "#6b4a2e"); wood.addColorStop(1, "#3c2918");
      ctx.fillStyle = wood; ctx.fillRect(0, benchY, W, H - benchY);
      if (phone){ ctx.fillStyle = "#212b3d"; ctx.fillRect(0, benchY + 12, W, H - benchY - 12); }
      /* géométrie du tube */
      var nr = Math.max(9, Lt * 0.04), xc = tx0 + Lt * 0.06, xa = tx0 + Lt * 0.25, xf = tx0 + Lt * 0.45, bx = xf + Rb, pxcm = 2 * Rb / 13.5;
      var xs = bx + Rb * 0.66, rScr = 5 * pxcm * 0.86;
      /* support et ombre */
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; p1ell(ctx, bx, cy + Rb + 6, Rb * 0.9, 7); ctx.fill(); ctx.restore();
      ctx.fillStyle = "#4a5568"; ctx.fillRect(bx - 4, cy + Rb * 0.9, 8, benchY - cy - Rb * 0.9); if (!phone) ctx.fillRect(xa - 3, cy + nr, 6, benchY - cy - nr);
      /* col du tube (verre) */
      var neck = ctx.createLinearGradient(0, cy - nr, 0, cy + nr); neck.addColorStop(0, "rgba(220,235,255,.35)"); neck.addColorStop(0.3, "rgba(255,255,255,.12)"); neck.addColorStop(1, "rgba(160,180,210,.30)");
      ctx.fillStyle = neck; p1rr(ctx, tx0, cy - nr, xf - tx0 + 4, 2 * nr, nr); ctx.fill(); ctx.strokeStyle = "rgba(220,235,255,.55)"; ctx.lineWidth = 1.2; ctx.stroke();
      /* ampoule (verre) */
      var bulb = ctx.createRadialGradient(bx - Rb * 0.35, cy - Rb * 0.4, Rb * 0.1, bx, cy, Rb);
      bulb.addColorStop(0, "rgba(255,255,255,.22)"); bulb.addColorStop(0.7, "rgba(170,195,230,.10)"); bulb.addColorStop(1, "rgba(200,220,255,.35)");
      ctx.fillStyle = bulb; ctx.beginPath(); ctx.arc(bx, cy, Rb, 0, 2 * PI); ctx.fill(); ctx.strokeStyle = "rgba(220,235,255,.6)"; ctx.lineWidth = 1.4; ctx.stroke();
      /* écran fluorescent (vu de biais) */
      ctx.save(); ctx.fillStyle = "rgba(60,140,80,.25)"; p1ell(ctx, xs, cy, rScr * 0.3, rScr); ctx.fill(); ctx.restore();
      /* cathode chauffée et anode */
      S.draw.glow(c, xc, cy, nr * 1.4, "#ff9a3c", 0.7);
      ctx.fillStyle = "#8a6a4a"; ctx.fillRect(tx0 + 2, cy - 3, xc - tx0, 6);
      ctx.strokeStyle = "#ffb15c"; ctx.lineWidth = 2; ctx.beginPath(); for (var j = 0; j <= 8; j++){ var xx = xc - 6 + j * 1.5, yy = cy + (j % 2 ? -4 : 4); if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } ctx.stroke();
      var an = ctx.createLinearGradient(0, cy - nr * 0.8, 0, cy + nr * 0.8); an.addColorStop(0, "#c9ced6"); an.addColorStop(0.4, "#f1f3f6"); an.addColorStop(1, "#6b7280");
      ctx.fillStyle = an; ctx.fillRect(xa - 9, cy - nr * 0.78, 18, nr * 0.5); ctx.fillRect(xa - 9, cy + nr * 0.28, 18, nr * 0.5);
      /* feuille de graphite (grille hexagonale) */
      ctx.save(); ctx.fillStyle = "#3b3f46"; p1ell(ctx, xf, cy, 3, nr * 0.85); ctx.fill(); ctx.strokeStyle = "#9aa3ad"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
      /* électrons : du canon à la feuille, puis vers l'anneau ou la tache centrale */
      var spd = 0.35 + 0.13 * Math.sqrt(U / 1000);
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      el.forEach(function(e){
        var ph = (e.ph + tt * spd) % 1, x, y;
        if (ph < 0.45){ x = xc + (xf - xc) * ph / 0.45; y = cy + Math.sin(e.ang * 3) * 1.2; }
        else {
          var f = (ph - 0.45) / 0.55, rr2 = e.kind === 0 ? 1.5 * Math.random() : (e.kind === 1 ? R1 : R2) * pxcm;
          if (!isFinite(rr2)) rr2 = 0;
          var ex = xs + rr2 * Math.cos(e.ang) * 0.3, ey = cy - rr2 * Math.sin(e.ang);
          x = xf + (ex - xf) * f; y = cy + (ey - cy) * f;
        }
        ctx.fillStyle = "rgba(120,200,255,.9)"; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 2 * PI); ctx.fill();
      });
      ctx.restore();
      /* anneaux sur l'écran du tube (ellipses) */
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      [R1, R2].forEach(function(R, j){ if (!isFinite(R)) return; var rp = R * pxcm; ctx.strokeStyle = j ? "rgba(120,255,150,.55)" : "rgba(140,255,160,.8)"; ctx.lineWidth = 2.4; p1ell(ctx, xs, cy, rp * 0.3, rp); ctx.stroke(); });
      S.draw.glow(c, xs, cy, 7, "#9dff9d", 0.9);
      ctx.restore();
      /* reflet sur le verre */
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, cy, Rb * 0.86, PI * 1.12, PI * 1.38); ctx.stroke(); ctx.restore();
      var fs = p1fz(c, 11.5);
      p1txt(S, c, "cathode", xc, cy + nr + 12, {size:fs, color:"#e6ebf2"});
      p1txt(S, c, "anode", xa, cy - nr - 10, {size:fs, color:"#e6ebf2"});
      p1txt(S, c, "graphite", xf, cy - nr - 10, {size:fs, color:"#e6ebf2"});
      p1txt(S, c, "écran", xs + 8, cy - Rb - 8 > 8 ? cy - Rb - 8 : cy - rScr - 8, {size:fs, color:"#a7f3b5"});
      /* alimentation haute tension */
      var bxw = phone ? W * 0.4 : W * 0.27, bxh = phone ? Math.min(66, benchY - cy - nr - 22) : 66, bx0 = W * 0.04, by0 = benchY - bxh;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      var box = ctx.createLinearGradient(0, by0, 0, by0 + bxh); box.addColorStop(0, "#4b5a70"); box.addColorStop(1, "#28323f");
      ctx.fillStyle = box; p1rr(ctx, bx0, by0, bxw, bxh, 7); ctx.fill(); ctx.restore();
      S.draw.display(c, (U / 1000).toFixed(1).replace(".", ",") + " kV", bx0 + bxw * 0.42, by0 + bxh * 0.45, {w:bxw * 0.62, h:bxh * 0.62, caption:"HAUTE TENSION", size:Math.min(18, bxw * 0.11), screen:"#ffe9c2", color:"#7a3a00"});
      var kx = bx0 + bxw * 0.86, ky = by0 + bxh * 0.45, kr = Math.min(14, bxw * 0.09), ka = -PI * 0.75 + (U / 1000 - 1.5) / 8.5 * PI * 1.5;
      p1ball(ctx, kx, ky, kr, "#9aa3ad"); S.draw.line(c, kx, ky, kx + Math.cos(ka) * kr * 0.8, ky + Math.sin(ka) * kr * 0.8, "#1b2433", 2.4);
      /* câble vers l'anode */
      ctx.save(); ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx0 + bxw * 0.5, by0); ctx.bezierCurveTo(bx0 + bxw * 0.5, by0 - 30, xa, cy + nr + 40, xa, cy + nr * 0.6); ctx.stroke(); ctx.restore();
      p1txt(S, c, "⟷ glisse sur l'image pour changer U", phone ? W / 2 : W * 0.35, 14, {size:p1fz(c, 11), color:"rgba(230,236,245,.8)", weight:600});
      /* écran vu de face, à l'échelle */
      var ix = phone ? W * 0.7 : W * 0.835, iy = phone ? H * 0.74 : H * 0.42, ir = phone ? Math.min(W * 0.27, H * 0.22) : Math.min(W * 0.15, H * 0.36), ipx = ir / 5;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 12;
      var scr = ctx.createRadialGradient(ix, iy, 2, ix, iy, ir); scr.addColorStop(0, "#14301c"); scr.addColorStop(1, "#06140b");
      ctx.fillStyle = scr; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 2 * PI); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#9aa3ad"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 2 * PI); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(ix, iy, ir - 1.5, 0, 2 * PI); ctx.clip(); ctx.globalCompositeOperation = "lighter";
      [R1, R2].forEach(function(R, j){
        if (!isFinite(R)) return; var rp = R * 100 * ipx;
        for (var w = 3; w >= 1; w--){ ctx.strokeStyle = "rgba(110,255,140," + (j ? 0.16 : 0.22) * (4 - w) + ")"; ctx.lineWidth = w * 2.6; ctx.beginPath(); ctx.arc(ix, iy, rp, 0, 2 * PI); ctx.stroke(); }
      });
      S.draw.glow(c, ix, iy, 12, "#b6ffb6", 1);
      ctx.restore();
      /* règle en cm */
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ix, iy + ir * 0.0); ctx.lineTo(ix + ir - 4, iy);
      for (var q = 1; q <= 4; q++){ ctx.moveTo(ix + q * ipx, iy - 3); ctx.lineTo(ix + q * ipx, iy + 3); }
      ctx.stroke(); ctx.restore();
      for (var q2 = 1; q2 <= 4; q2++) p1txt(S, c, String(q2), ix + q2 * ipx, iy + 11, {size:9.5, color:"rgba(255,255,255,.8)", weight:600});
      p1txt(S, c, "écran vu de face (cm)", ix, iy + ir + 13, {size:fs, color:"#e6ebf2"});
      if (isFinite(R1)) p1txt(S, c, "R₁", ix - R1 * 100 * ipx * 0.71 - 6, iy + R1 * 100 * ipx * 0.71 + 6, {size:fs, color:"#b6ffb6"});
      if (isFinite(R2)) p1txt(S, c, "R₂", ix - R2 * 100 * ipx * 0.71 - 6, iy - R2 * 100 * ipx * 0.71 - 6, {size:fs, color:"#b6ffb6"});
      if (phone){
        p1txt(S, c, "λ = " + fmtN(lam * 1e12, 1) + " pm", W * 0.06, H * 0.88, {size:15, color:"#ffe9c2", align:"left", weight:800});
        p1txt(S, c, "λ = h/√(2meU)", W * 0.06, H * 0.94, {size:12, color:"#c7d3ea", align:"left", math:true});
      } else {
        p1txt(S, c, "λ = h/√(2meU) = " + fmtN(lam * 1e12, 1) + " pm", W * 0.35, benchY + (H - benchY) / 2, {size:14, color:"#ffe9c2", weight:800});
      }

      /* ---- la balle de tennis ---- */
      var gx = g.ctx, GW = g.W, GH = g.H, vb = vS.value, lb = H_PL / (M_BALL * vb);
      var sky = gx.createLinearGradient(0, 0, 0, GH); sky.addColorStop(0, "#cfe6f7"); sky.addColorStop(0.55, "#eef6fb"); sky.addColorStop(0.56, "#3f8f5b"); sky.addColorStop(1, "#2c6e44");
      gx.fillStyle = sky; gx.fillRect(0, 0, GW, GH);
      var gy = GH * 0.56;
      gx.fillStyle = "#2f7fb8"; gx.beginPath(); gx.moveTo(0, GH); gx.lineTo(GW * 0.08, gy + 4); gx.lineTo(GW * 0.92, gy + 4); gx.lineTo(GW, GH); gx.closePath(); gx.fill();
      gx.strokeStyle = "#ffffff"; gx.lineWidth = 2; gx.beginPath(); gx.moveTo(GW * 0.02, GH - 6); gx.lineTo(GW * 0.98, GH - 6); gx.moveTo(GW * 0.1, gy + 8); gx.lineTo(GW * 0.9, gy + 8); gx.stroke();
      /* filet */
      var nx = GW * 0.58;
      gx.save(); gx.strokeStyle = "rgba(30,30,30,.55)"; gx.lineWidth = 1; for (var yy2 = gy - 26; yy2 < GH - 4; yy2 += 5){ gx.beginPath(); gx.moveTo(nx - 3, yy2); gx.lineTo(nx + 3, yy2 + 3); gx.stroke(); } gx.restore();
      gx.fillStyle = "#f4f6f9"; gx.fillRect(nx - 3, gy - 28, 6, 4); gx.fillStyle = "#6b7280"; gx.fillRect(nx - 2, gy - 28, 4, GH - gy + 24);
      /* joueuse */
      var px0 = GW * (phone ? 0.13 : 0.1), py0 = GH - 10, sc2 = GH / 175;
      var ph2 = (tt * (0.5 + vb / 90)) % 1, swing = ph2 < 0.18 ? ph2 / 0.18 : 1;
      gx.save(); gx.translate(px0, py0); gx.scale(sc2, sc2);
      gx.fillStyle = "rgba(0,0,0,.25)"; p1ell(gx, 0, 0, 22, 5); gx.fill();
      gx.strokeStyle = "#2c3a4e"; gx.lineWidth = 7; gx.lineCap = "round";
      gx.beginPath(); gx.moveTo(-6, -46); gx.lineTo(-12, -2); gx.moveTo(6, -46); gx.lineTo(12, -2); gx.stroke();
      gx.fillStyle = "#f4f6f9"; p1rr(gx, -11, -50, 22, 10, 3); gx.fill();
      var shirt = gx.createLinearGradient(-14, 0, 14, 0); shirt.addColorStop(0, "#b8322a"); shirt.addColorStop(0.5, "#e2574c"); shirt.addColorStop(1, "#9c2a22");
      gx.fillStyle = shirt; p1rr(gx, -13, -92, 26, 46, 8); gx.fill();
      p1ball(gx, 0, -104, 11, "#e8b48c");
      gx.fillStyle = "#4a2f1d"; gx.beginPath(); gx.arc(0, -108, 11, PI, 2 * PI); gx.fill();
      var aa = -2.4 + swing * 2.6, hx = 10 + Math.cos(aa) * 30, hy = -86 + Math.sin(aa) * 30;
      gx.strokeStyle = "#e8b48c"; gx.lineWidth = 6; gx.beginPath(); gx.moveTo(10, -86); gx.lineTo(hx, hy); gx.stroke();
      gx.strokeStyle = "#1f2937"; gx.lineWidth = 3; gx.beginPath(); gx.moveTo(hx, hy); var rkx = hx + Math.cos(aa) * 20, rky = hy + Math.sin(aa) * 20; gx.lineTo(rkx, rky); gx.stroke();
      gx.save(); gx.translate(rkx + Math.cos(aa) * 10, rky + Math.sin(aa) * 10); gx.rotate(aa); gx.strokeStyle = "#1f2937"; gx.lineWidth = 2.5; p1ell(gx, 0, 0, 12, 8); gx.stroke(); gx.strokeStyle = "rgba(31,41,55,.4)"; gx.lineWidth = 0.8; for (var s2 = -8; s2 <= 8; s2 += 4){ gx.beginPath(); gx.moveTo(s2, -7); gx.lineTo(s2, 7); gx.stroke(); } gx.restore();
      gx.strokeStyle = "#e8b48c"; gx.lineWidth = 6; gx.beginPath(); gx.moveTo(-10, -86); gx.lineTo(-22, -64); gx.stroke();
      gx.restore();
      /* balle en vol */
      if (ph2 > 0.18){
        var f2 = (ph2 - 0.18) / 0.82, bxp = px0 + 40 * sc2 + f2 * (GW * 0.92 - px0 - 40 * sc2), byp = GH * 0.22 + f2 * f2 * (GH * 0.62);
        for (var tr = 1; tr <= 5; tr++){ var f3 = Math.max(0, f2 - tr * 0.025); gx.fillStyle = "rgba(220,240,60," + (0.3 - tr * 0.05) + ")"; gx.beginPath(); gx.arc(px0 + 40 * sc2 + f3 * (GW * 0.92 - px0 - 40 * sc2), GH * 0.22 + f3 * f3 * GH * 0.62, 5 * sc2, 0, 2 * PI); gx.fill(); }
        p1ball(gx, bxp, byp, 5.5 * sc2, "#d8f03c");
      }
      /* cartouche des valeurs */
      var cw = phone ? GW * 0.6 : Math.min(300, GW * 0.5), chh = phone ? 70 : 66, cxx = GW - cw - 8, cyy = 8;
      S.draw.panel(g, cxx, cyy, cw, chh, {fill:"rgba(255,255,255,.93)"});
      p1txt(S, g, "λ = h/(mv) = " + p1sci(lb, 2) + " m", cxx + 10, cyy + 18, {size:p1fz(g, 13), align:"left", color:"#0f1b2d", weight:800});
      p1txt(S, g, "λ / diamètre = " + p1sci(lb / D_BALL, 1), cxx + 10, cyy + 38, {size:p1fz(g, 12), align:"left", color:"#c0321d", weight:700});
      p1txt(S, g, "électron : λ/d = " + fmtN(lam / D_GR[0], 3) + " → ça diffracte", cxx + 10, cyy + 56, {size:p1fz(g, 11), align:"left", color:"#24775a", weight:700});

      ro.set(0, S.fmt(lam * 1e12, 2) + " pm");
      ro.set(1, p1sciH(v, 3) + " m/s (" + S.fmt(v / C_L * 100, 1) + " % de c)");
      ro.set(2, isFinite(R1) ? S.fmt(R1 * 100, 2) + " cm" : "—");
      ro.set(3, isFinite(R2) ? S.fmt(R2 * 100, 2) + " cm" : "—");
      ro.set(4, S.fmt(rel, 2) + " %");
      ro.set(5, p1sciH(lb, 2) + " m");
      var msg = "eU = " + S.fmt(U / 1000, 1) + " keV ≪ mₑc² = 511 keV : la formule non relativiste est justifiée (λ trop grande de " + S.fmt(rel, 2) + " % seulement). Anneau 1 : sin θ = λ/(2d) = " + S.fmt(lam / (2 * D_GR[0]), 4) + ", 2θ = " + S.fmt(2 * Math.asin(lam / (2 * D_GR[0])) * 180 / PI, 2) + "°. Si U est multipliée par 4, λ et les rayons sont divisés par 2 environ.";
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});


/* =====================================================================
   3. Une réaction qui pousse un piston : Q, W, ΔU, ΔH (c05)
   ===================================================================== */
var ZN_M = 65.38, DRH_ZN = -153.89e3, T_K = 298.15, P_ATM = 101325, A_PIST = PI * 0.03 * 0.03, V_LIQ = 50e-6, V0_GAS = 150e-6, M_DISK = 1, G_N = 9.81, N_DISK = 6;

SFA.sim({
  id:"ch-reaction-piston", ch:"c05", tag:"Premier principe",
  titre:"Une réaction qui pousse un piston : Q, W, ΔU et ΔH",
  resume:"Du zinc dans l'acide chlorhydrique dégage du dihydrogène qui soulève un piston : la chaleur échangée, le travail −pΔV, ΔU et ΔH se construisent sous tes yeux.",
  but:"Choisis la masse de zinc et regarde la réaction : chaque bulle de H₂ pousse le piston contre la pression extérieure. Clique sur les masses de l'étagère pour charger le piston (clique sur le piston pour les reprendre), puis bloque le piston pour comparer une transformation à pression constante et à volume constant.",
  aRetenir:"Premier principe : ΔU = Q + W, avec W = −p<sub>ext</sub>·ΔV (le système perd de l'énergie quand il pousse). À pression constante, la chaleur échangée est l'enthalpie : Q<sub>p</sub> = ΔH. À volume constant, W = 0 et Q<sub>V</sub> = ΔU. Pour des gaz parfaits à T constante, ΔH − ΔU = Δn(gaz)·RT : ici Δn = +1 mol de H₂ par mole de zinc, donc ΔU = ΔH − RT par mole.",
  piege:"Le signe : le gaz fait un travail sur l'extérieur, donc W < 0 pour le système. Charger le piston ne change pas W : p<sub>ext</sub> augmente mais ΔV = nRT/p<sub>ext</sub> diminue d'autant, et W = −nRT. Bloquer le piston ne change pas ΔH ni ΔU (fonctions d'état) : c'est la chaleur échangée qui change (Q<sub>V</sub> = ΔU au lieu de Q<sub>p</sub> = ΔH).",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 410 : 390), g = k.canvas(phone ? 168 : 150);
    var st = {t:0, disks:0, bub:[], gas:[]};
    var mS = k.slider("Masse de zinc", 0.1, 1.5, 0.05, 0.65, "g", restart);
    var lockT = k.toggle("Bloquer le piston (volume constant)", false, restart);
    k.button("Recommencer la réaction", restart, true);
    var ro = k.readouts(["H₂ formé n(H₂)", "Variation de volume ΔV", "Chaleur échangée Q", "Travail W = −p·ΔV", "ΔU = Q + W", "ΔH = ΔU + Δn(gaz)·RT"]);
    var nt = k.note("", "ok");
    k.note("Zn(s) + 2 H⁺(aq) → Zn²⁺(aq) + H₂(g) ; ΔrH° = −153,9 kJ/mol (ΔfH° de Zn²⁺(aq), les ions Cl⁻ sont spectateurs). HCl en excès (50 mL à 1 mol/L), bain thermostaté à 25 °C, piston de 6 cm de diamètre sans masse ni frottement, 150 mL d'air au départ, gaz parfaits. Masses de 1 kg.", "");
    for (var i = 0; i < 70; i++) st.gas.push({x:Math.random(), y:Math.random(), vx:(Math.random() - 0.5), vy:(Math.random() - 0.5), h2:i >= 14});
    function restart(){ st.t = 0; st.bub = []; }
    var TAU = 2.1, TEND = 5 * TAU, THOLD = 4.5;
    function frac(t){ return t >= TEND ? 1 : (1 - Math.exp(-t / TAU)) / (1 - Math.exp(-5)); }
    var hit = {};
    c.pointer(function(type, p){
      if (type !== "down") return;
      function inside(b){ return b && p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h; }
      if (inside(hit.shelf) && st.disks < N_DISK){ st.disks++; restart(); k.redraw(); }
      else if (inside(hit.stack) && st.disks > 0){ st.disks--; restart(); k.redraw(); }
    });
    var lp = k.loop(function(dt){
      st.t += dt; if (st.t > TEND + THOLD) restart();
      var f0 = frac(st.t), rate = st.t < TEND ? Math.exp(-st.t / TAU) : 0;
      if (Math.random() < rate * 0.9 * (0.4 + mS.value)) st.bub.push({g:(Math.random() * 5) | 0, y:0, dx:(Math.random() - 0.5) * 6, r:1.5 + Math.random() * 2.2});
      st.bub.forEach(function(b){ b.y += dt * (30 + b.r * 8); });
      st.bub = st.bub.filter(function(b){ return b.y < 999; });
      st.gas.forEach(function(m){ m.x += m.vx * dt * 0.9; m.y += m.vy * dt * 0.9; if (m.x < 0 || m.x > 1){ m.vx = -m.vx; m.x = Math.max(0, Math.min(1, m.x)); } if (m.y < 0 || m.y > 1){ m.vy = -m.vy; m.y = Math.max(0, Math.min(1, m.y)); } });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, m0 = mS.value, n0 = m0 / ZN_M, f = frac(st.t), n = n0 * f, lock = lockT.value;
      var pext = P_ATM + st.disks * M_DISK * G_N / A_PIST, RT = R_GP * T_K;
      var dV = lock ? 0 : n * RT / pext, Wk = -pext * dV, dH = n * DRH_ZN, dU = n * (DRH_ZN - RT), Q = dU - Wk;
      var pgas = lock ? P_ATM + st.disks * M_DISK * G_N / A_PIST + n * RT / V0_GAS : pext;
      /* décor : mur carrelé et paillasse */
      var wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, "#eef3f8"); wall.addColorStop(1, "#dce5ef"); ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(160,175,195,.25)"; ctx.lineWidth = 1;
      for (var yy = 0; yy < H; yy += 28){ ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      for (var xx = 0; xx < W; xx += 28){ ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, H); ctx.stroke(); }
      var yb = H - 30;
      var wood = ctx.createLinearGradient(0, yb, 0, H); wood.addColorStop(0, "#9b6b43"); wood.addColorStop(1, "#5e3d22"); ctx.fillStyle = wood; ctx.fillRect(0, yb, W, H - yb);
      ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, yb, W, 3);
      /* géométrie du cylindre */
      var cx = phone ? W * 0.42 : W * 0.36, rx = Math.min(W * 0.12, 60), ry = rx * 0.26, yBot = yb - 8;
      var pxcm = (yBot - 92) / 27.2, hL = V_LIQ / A_PIST * 100, h0 = V0_GAS / A_PIST * 100;
      var ySurf = yBot - hL * pxcm, yPist = ySurf - (h0 + dV / A_PIST * 100) * pxcm, yTop = yBot - 27.6 * pxcm;
      /* bain thermostaté (arrière) */
      var bwx = rx * 1.55, byT = ySurf - 6 * pxcm;
      ctx.fillStyle = "rgba(120,170,215,.18)"; ctx.fillRect(cx - bwx, byT, 2 * bwx, yb - byT);
      /* ombre */
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.18)"; p1ell(ctx, cx, yb, bwx * 1.05, 6); ctx.fill(); ctx.restore();
      /* liquide */
      var liq = p1cylGrad(ctx, cx - rx, cx + rx, ["rgba(110,160,210,.55)", "rgba(190,225,250,.45)", "rgba(110,160,210,.6)"]);
      ctx.fillStyle = liq; ctx.beginPath(); ctx.moveTo(cx - rx, ySurf); ctx.lineTo(cx - rx, yBot); ctx.ellipse(cx, yBot, rx, ry, 0, PI, 0, true); ctx.lineTo(cx + rx, ySurf); ctx.closePath(); ctx.fill();
      p1ell(ctx, cx, ySurf, rx, ry); ctx.fillStyle = "rgba(170,210,240,.7)"; ctx.fill();
      /* granules de zinc qui fondent */
      var zr = 3 + 7 * Math.cbrt(Math.max(0, (1 - f) * m0 / 1.5));
      var gpos = [-0.6, -0.25, 0.1, 0.42, 0.7];
      if (zr > 3.05) gpos.forEach(function(gx2, j){ p1ball(ctx, cx + gx2 * rx, yBot - zr * 0.7 + (j % 2) * 2, zr * (0.8 + 0.25 * (j % 3) / 2), "#9aa3ad"); });
      /* bulles de H₂ */
      st.bub.forEach(function(b){
        var by2 = yBot - zr - b.y; if (by2 < ySurf + 2){ b.y = 1000; return; }
        ctx.beginPath(); ctx.arc(cx + gpos[b.g] * rx + b.dx, by2, b.r, 0, 2 * PI); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fill(); ctx.strokeStyle = "rgba(90,130,170,.6)"; ctx.lineWidth = 0.8; ctx.stroke();
      });
      /* gaz : air (gris) et H₂ (blanc) */
      var nH2dots = Math.round(56 * n / (1.5 / ZN_M));
      st.gas.forEach(function(m2, j){
        if (m2.h2 && j - 14 >= nH2dots) return;
        var gxp = cx - rx + 6 + m2.x * (2 * rx - 12), gyp = yPist + 6 + m2.y * Math.max(1, ySurf - yPist - 12);
        p1ball(ctx, gxp, gyp, m2.h2 ? 2.6 : 3.2, m2.h2 ? "#f4f8ff" : "#8a95a3");
      });
      /* paroi de verre */
      ctx.save();
      var glass = p1cylGrad(ctx, cx - rx - 3, cx + rx + 3, ["rgba(200,220,240,.55)", "rgba(255,255,255,.08)", "rgba(255,255,255,.35)", "rgba(255,255,255,.05)", "rgba(180,200,225,.6)"]);
      ctx.fillStyle = glass; ctx.fillRect(cx - rx - 3, yTop, 2 * rx + 6, yBot - yTop);
      ctx.strokeStyle = "rgba(90,110,140,.6)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - rx - 3, yTop); ctx.lineTo(cx - rx - 3, yBot); ctx.ellipse(cx, yBot, rx + 3, ry + 1, 0, PI, 0, true); ctx.lineTo(cx + rx + 3, yTop); ctx.stroke();
      p1ell(ctx, cx, yTop, rx + 3, ry + 1); ctx.stroke();
      ctx.restore();
      /* graduations (mL de gaz) */
      ctx.save(); ctx.strokeStyle = "rgba(40,55,75,.55)"; ctx.fillStyle = "#2c3a4e"; ctx.font = "600 9.5px Mulish, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      for (var mL = 0; mL <= 750; mL += 50){
        var yg = ySurf - mL * 1e-6 / A_PIST * 100 * pxcm; if (yg < yTop + 4) break;
        ctx.beginPath(); ctx.moveTo(cx + rx - 1, yg); ctx.lineTo(cx + rx - (mL % 100 ? 6 : 11), yg); ctx.stroke();
        if (mL % 100 === 0 && mL > 0 && yg < byT - 52) ctx.fillText(String(mL), cx + rx + 6, yg);
      }
      ctx.fillText("mL de gaz", cx + rx + 6, yTop - 8); ctx.restore();
      /* piston et masses */
      var pH = 13, drx = rx * 0.7, dh = 9;
      p1cyl(ctx, cx, yPist - pH, yPist, rx - 1, ry, "#9aa3ad");
      for (var d2 = 0; d2 < st.disks; d2++){ var yd = yPist - pH - (d2 + 1) * dh; p1cyl(ctx, cx, yd, yd + dh, drx, drx * 0.26, "#4b5563"); }
      hit.stack = {x:cx - rx, y:yPist - pH - st.disks * dh - 10, w:2 * rx, h:st.disks * dh + pH + 10};
      if (lock){
        [-1, 1].forEach(function(sg){ var px2 = cx + sg * (rx + 3); ctx.fillStyle = "#c0321d"; p1rr(ctx, sg < 0 ? px2 - 14 : px2 - 2, yPist - pH - 9, 16, 7, 2); ctx.fill(); });
        p1txt(S, c, "bloqué", cx + rx + 18, yPist - pH - 6, {size:p1fz(c, 11), color:"#c0321d", align:"left"});
      }
      /* flèches : pression extérieure et travail */
      var topStack = yPist - pH - st.disks * dh;
      S.draw.arrow(c, cx, topStack - 40, cx, topStack - 8, "#1f4b9e", 2.6);
      p1txt(S, c, "p ext = " + fmtN(pext / 1e5, 3) + " bar", cx - 10, topStack - 32, {size:p1fz(c, 12), color:"#1f4b9e", align:"right", halo:true});
      if (!lock && f < 1){ S.draw.arrow(c, cx - rx * 0.55, yPist + 26, cx - rx * 0.55, yPist + 4, "#c26a0c", 2.4); }
      /* chaleur cédée au bain (ondulations) */
      var rate = st.t < TEND ? Math.exp(-st.t / TAU) : 0;
      if (rate > 0.05){
        ctx.save(); ctx.strokeStyle = "rgba(214,57,47," + Math.min(0.9, rate + 0.15) + ")"; ctx.lineWidth = 2;
        [-1, 1].forEach(function(sg){ for (var w2 = 0; w2 < 2; w2++){ var y0 = ySurf + 4 + w2 * 12; ctx.beginPath(); for (var q = 0; q <= 16; q++){ var xq = cx + sg * (rx + 6 + q * 1.4), yq = y0 + Math.sin(q * 0.9 - st.t * 8) * 2.5; if (q) ctx.lineTo(xq, yq); else ctx.moveTo(xq, yq); } ctx.stroke(); } });
        ctx.restore();
        p1txt(S, c, "Q → bain", cx + bwx + 4, ySurf + 16, {size:p1fz(c, 11), color:"#c0321d", align:"left", halo:true});
      }
      /* bain : paroi avant + thermomètre */
      ctx.save(); ctx.strokeStyle = "rgba(90,120,160,.55)"; ctx.lineWidth = 1.4; ctx.strokeRect(cx - bwx, byT, 2 * bwx, yb - byT); ctx.fillStyle = "rgba(160,200,235,.15)"; ctx.fillRect(cx - bwx, byT, 2 * bwx, yb - byT); ctx.restore();
      var thx = cx + bwx - 10; ctx.fillStyle = "#f4f6f9"; p1rr(ctx, thx - 3, byT - 46, 6, 70, 3); ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.stroke();
      ctx.fillStyle = "#d6392f"; ctx.fillRect(thx - 1.2, byT - 18, 2.4, 40); p1ball(ctx, thx, byT + 25, 4.2, "#d6392f");
      p1txt(S, c, "25,0 °C", thx + 6, byT - 40, {size:p1fz(c, 11), color:"#2c3a4e", align:"left", halo:true});
      /* manomètre relié au gaz */
      var mx = cx - rx - (phone ? 40 : 54), my = Math.max(yTop + 30, ySurf - 2.4 * pxcm - 34), mr = phone ? 19 : 23;
      ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + mr * 0.7, my + mr * 0.7); ctx.lineTo(cx - rx - 3, ySurf - 1.2 * pxcm); ctx.stroke();
      p1ball(ctx, mx, my, mr + 3, "#9aa3ad"); ctx.fillStyle = "#fbfcfd"; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 2 * PI); ctx.fill();
      for (var b2 = 0; b2 <= 6; b2++){ var aa = PI * 0.75 + b2 / 6 * PI * 1.5; S.draw.line(c, mx + Math.cos(aa) * mr * 0.78, my + Math.sin(aa) * mr * 0.78, mx + Math.cos(aa) * mr * 0.95, my + Math.sin(aa) * mr * 0.95, "#2c3a4e", 1.2); }
      var an = PI * 0.75 + Math.min(6, pgas / 1e5) / 6 * PI * 1.5;
      S.draw.line(c, mx, my, mx + Math.cos(an) * mr * 0.85, my + Math.sin(an) * mr * 0.85, "#c0321d", 2);
      p1txt(S, c, fmtN(pgas / 1e5, 2) + " bar", mx, my + mr + 12, {size:p1fz(c, 11), color:"#2c3a4e", halo:true});
      /* étagère des masses */
      var shx = phone ? W * 0.8 : W * 0.7, shy = phone ? yb - 150 : yb - 120, sw = phone ? 62 : 80;
      var shelfG = ctx.createLinearGradient(0, shy, 0, shy + 8); shelfG.addColorStop(0, "#b07a4c"); shelfG.addColorStop(1, "#6d4a2c");
      ctx.fillStyle = shelfG; ctx.fillRect(shx - sw / 2, shy, sw, 8); ctx.fillStyle = "#6d4a2c"; ctx.fillRect(shx - sw / 2 + 4, shy + 8, 4, yb - shy - 8); ctx.fillRect(shx + sw / 2 - 8, shy + 8, 4, yb - shy - 8);
      var left = N_DISK - st.disks;
      for (var d3 = 0; d3 < left; d3++){ var yd3 = shy - (d3 + 1) * dh; p1cyl(ctx, shx, yd3, yd3 + dh, drx, drx * 0.26, "#4b5563"); }
      hit.shelf = {x:shx - sw / 2, y:shy - left * dh - 14, w:sw, h:left * dh + 22};
      p1txt(S, c, left ? "clique : + 1 kg" : "étagère vide", shx, shy + 18, {size:p1fz(c, 11), color:"#2c3a4e", halo:true});
      if (st.disks) p1txt(S, c, "clique le piston : − 1 kg", phone ? W - 6 : shx, phone ? shy + 34 : shy + 34, {size:p1fz(c, 10.5), color:"#5f6b7a", align:phone ? "right" : "center", halo:true});
      /* équation */
      S.draw.label(c, "Zn(s) + 2 H⁺(aq) → Zn²⁺(aq) + H₂(g)", phone ? W / 2 : W - 10, 16, {color:"#1f4b9e", size:p1fz(c, 12.5), align:phone ? "center" : "right"});
      p1txt(S, c, "avancement : " + fmtN(f * 100, 0) + " %", phone ? W / 2 : W - 10, 38, {size:p1fz(c, 11.5), color:"#2c3a4e", align:phone ? "center" : "right", halo:true});

      /* ---- bilan énergétique en barres ---- */
      g.clear(); var gx = g.ctx, GW = g.W, GH = g.H;
      var bg2 = gx.createLinearGradient(0, 0, 0, GH); bg2.addColorStop(0, "#fbfcfe"); bg2.addColorStop(1, "#f1f5f9"); gx.fillStyle = bg2; gx.fillRect(0, 0, GW, GH);
      var full = Math.abs(n0 * (DRH_ZN - RT)) * 1.04, xL = phone ? 92 : 210, xR = GW - (phone ? 70 : 92), rows = [["Q", Q, "#d6392f", lock ? "Q = ΔU (volume constant)" : "Q = ΔH (pression constante)"], ["W", Wk, "#c26a0c", lock ? "W = 0 (pas de déplacement)" : "W = −p ΔV = −n RT"], ["ΔU", dU, "#1f4b9e", "ΔU = Q + W"], ["ΔH", dH, "#24775a", "ΔH = ΔU + Δn RT"]];
      var rh = (GH - 26) / 4;
      p1txt(S, g, "J (≤ 0 : cédé par le système)", xR, GH - 8, {size:p1fz(g, 10.5), color:"#5f6b7a", align:"right", weight:600});
      S.draw.line(g, xR, 6, xR, GH - 20, "#2c3a4e", 1.4);
      rows.forEach(function(r, j){
        var y = 6 + j * rh, w = Math.abs(r[1]) / full * (xR - xL);
        gx.save(); var gr = gx.createLinearGradient(0, y, 0, y + rh - 8); gr.addColorStop(0, p1shade(r[2], 0.25)); gr.addColorStop(1, r[2]);
        gx.fillStyle = gr; p1rr(gx, xR - w, y + 4, Math.max(w, 1.5), rh - 9, 4); gx.fill(); gx.restore();
        p1txt(S, g, r[0], 8, y + rh / 2, {size:13.5, color:r[2], align:"left", weight:800});
        if (!phone) p1txt(S, g, r[3], 34, y + rh / 2, {size:10.5, color:"#5f6b7a", align:"left", weight:600});
        p1txt(S, g, S.fmt(r[1], Math.abs(r[1]) < 100 ? 1 : 0) + " J", xR + 6, y + rh / 2, {size:p1fz(g, 12), color:"#0f1b2d", align:"left"});
      });

      ro.set(0, S.fmt(n * 1000, 2) + " mmol");
      ro.set(1, S.fmt(dV * 1e6, 1) + " mL");
      ro.set(2, S.fmt(Q, Math.abs(Q) < 100 ? 1 : 0) + " J");
      ro.set(3, S.fmt(Wk, 1) + " J");
      ro.set(4, S.fmt(dU, 0) + " J");
      ro.set(5, S.fmt(dH, 0) + " J");
      var fin = n0 * RT;
      var msg = lock ? "Piston bloqué : V constant, W = 0, toute l'énergie part en chaleur : Q<sub>V</sub> = ΔU = " + S.fmt(n0 * (DRH_ZN - RT), 0) + " J en fin de réaction. Le H₂ comprimé fait monter la pression à " + S.fmt((P_ATM + st.disks * M_DISK * G_N / A_PIST + fin / V0_GAS) / 1e5, 2) + " bar. ΔH reste " + S.fmt(n0 * DRH_ZN, 0) + " J : ΔH − ΔU = Δn·RT = " + S.fmt(fin, 1) + " J."
        : "Pression constante : Q<sub>p</sub> = ΔH = " + S.fmt(n0 * DRH_ZN, 0) + " J en fin de réaction. Le gaz pousse le piston de " + S.fmt(n0 * RT / pext * 1e6, 1) + " mL : W = −p·ΔV = −n·RT = " + S.fmt(-fin, 1) + " J, à peine " + S.fmt(fin / Math.abs(n0 * DRH_ZN) * 100, 1) + " % de Q. Ajoute des masses : ΔV diminue, mais W ne change pas.";
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   4. La bombe calorimétrique : ΔT → ΔU → ΔH (c05)
   ===================================================================== */
/* ΔcU en kJ/mol à 25 °C (déduit de ΔcH° tabulé : ΔU = ΔH − Δn·RT ; acide benzoïque : étalon, −26,434 kJ/g) */
var FUELS = {
  glucose:{nom:"glucose", eq:"C₆H₁₂O₆(s) + 6 O₂(g) → 6 CO₂(g) + 6 H₂O(l)", M:180.156, dU:-2803.0, gin:6, gout:6},
  saccharose:{nom:"saccharose", eq:"C₁₂H₂₂O₁₁(s) + 12 O₂(g) → 12 CO₂(g) + 11 H₂O(l)", M:342.297, dU:-5644.0, gin:12, gout:12},
  benzoique:{nom:"acide benzoïque (étalon)", eq:"C₇H₆O₂(s) + 15/2 O₂(g) → 7 CO₂(g) + 3 H₂O(l)", M:122.123, dU:-3228.2, gin:7.5, gout:7},
  naphtalene:{nom:"naphtalène", eq:"C₁₀H₈(s) + 12 O₂(g) → 10 CO₂(g) + 4 H₂O(l)", M:128.174, dU:-5151.3, gin:12, gout:10},
  ethanol:{nom:"éthanol (en capsule)", eq:"C₂H₅OH(l) + 3 O₂(g) → 2 CO₂(g) + 3 H₂O(l)", M:46.069, dU:-1364.3, gin:3, gout:2}
};
var T0_BOMB = 24.5;

SFA.sim({
  id:"ch-bombe-calorimetrique", ch:"c05", tag:"Calorimétrie",
  titre:"La bombe calorimétrique : de ΔT à ΔU, puis à ΔH",
  resume:"Une pastille de glucose brûle dans une bombe d'acier fermée, plongée dans l'eau : on lit ΔT, on en tire ΔU, puis ΔH = ΔU + Δn(gaz)·RT.",
  but:"Choisis le combustible et la masse de la pastille. La mise à feu a lieu à 2 min (ou clique le bouton rouge plus tôt) : suis la température de l'eau, lis ΔT, puis suis la chaîne de calcul jusqu'à ΔcH. Glisse sur le calorimètre pour le faire tourner.",
  aRetenir:"La bombe est fermée et rigide : V constant, donc W = 0 et la chaleur dégagée vaut ΔU. q = C<sub>cal</sub>·ΔT ; ΔcU = −q/n. Pour passer à l'enthalpie : ΔcH = ΔcU + Δn(gaz)·RT, où Δn(gaz) ne compte que les gaz (l'eau formée est liquide à 25 °C). Pour le glucose, 6 O₂ donnent 6 CO₂ : Δn = 0, donc ΔcH = ΔcU ≈ −2 803 kJ/mol.",
  piege:"Le signe : la température de l'eau monte (ΔT > 0) parce que la réaction cède de la chaleur, donc ΔcU < 0. Dans Δn(gaz), on ne compte ni les solides ni l'eau liquide. Et l'écart ΔH − ΔU est petit (quelques kJ/mol, RT = 2,48 kJ/mol) devant ΔcU (des milliers de kJ/mol) : il ne compte qu'en calcul précis.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 400 : 350), g = k.canvas(phone ? 170 : 165);
    var fS = k.select("Combustible", [["glucose", "glucose"], ["saccharose", "saccharose"], ["benzoique", "acide benzoïque (étalon)"], ["naphtalene", "naphtalène"], ["ethanol", "éthanol"]], "glucose", restart);
    var mS = k.slider("Masse de la pastille", 0.2, 1.5, 0.01, 1, "g", restart);
    var cS = k.slider("Capacité thermique du calorimètre C", 8, 14, 0.05, 10, "kJ/K", restart);
    k.button("Recommencer la mesure", restart, true);
    var ro = k.readouts(["ΔT lu", "q = C·ΔT", "Quantité brûlée n", "ΔcU = −q/n", "Δn(gaz)", "ΔcH = ΔcU + Δn·RT"]);
    var nt = k.note("", "ok");
    k.note("Bombe remplie de dioxygène en excès (30 bar), 25 °C. On néglige la chaleur du fil d'allumage. RT = 8,314 × 298,15 = 2,479 kJ/mol. Le temps est accéléré.", "");
    var st = {tm:0, tig:2, az:0.5, drag:null};
    function restart(){ st.tm = 0; st.tig = 2; }
    var hit = {};
    c.pointer(function(type, p){
      if (type === "down"){
        var b = hit.fire; if (b && Math.hypot(p.x - b.x, p.y - b.y) < b.r + 6 && st.tm < st.tig){ st.tig = st.tm; return; }
        st.drag = {x:p.x, a:st.az};
      }
      if (type === "drag" && st.drag){ st.az = st.drag.a + (p.x - st.drag.x) * 0.012; k.redraw(); }
      if (type === "up") st.drag = null;
    });
    g.pointer(function(type, p){ if (type === "down" || type === "drag" || type === "move") { st.hover = p.x; } });
    g.cv.addEventListener("pointerleave", function(){ st.hover = null; });
    var lp = k.loop(function(dt, t){ st.rt = t; if (st.tm < 13) st.tm += dt / 1.1; if (!st.drag) st.az += dt * 0.12; k.redraw(); });
    lp.play();
    function phi(tm){ var s = (tm - st.tig) / 0.55; return s <= 0 ? 0 : 1 - (1 + s) * Math.exp(-s); }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, F = FUELS[fS.value], m = mS.value, C = cS.value, nmol = m / F.M;
      var dTex = nmol * -F.dU / C, dTr = Math.round(dTex * 1000) / 1000, Tnow = T0_BOMB + dTex * phi(st.tm), fired = st.tm >= st.tig;
      var q = C * dTr, dU = -q / nmol, dn = F.gout - F.gin, RT = R_GP * T_K / 1000, dH = dU + dn * RT;
      /* décor */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#eaf0f6"); bg.addColorStop(1, "#d8e1eb"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var yb = H - 26; var wood = ctx.createLinearGradient(0, yb, 0, H); wood.addColorStop(0, "#9b6b43"); wood.addColorStop(1, "#5e3d22"); ctx.fillStyle = wood; ctx.fillRect(0, yb, W, H - yb);
      /* calorimètre en coupe */
      var cx = phone ? W * 0.37 : W * 0.36, Rj = phone ? Math.min(W * 0.32, 125) : Math.min(W * 0.25, 140), ry = Rj * 0.24, yJ = phone ? 96 : 84, yB = yb - 6;
      var Ri = Rj * 0.86, Rw = Ri * 0.92, yW = yJ + 34, Rbm = Rw * 0.42, ybT = yW + 30, ybB = yB - 26;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.2)"; p1ell(ctx, cx, yb, Rj * 1.05, 8); ctx.fill(); ctx.restore();
      /* enveloppe isolante : corps */
      p1cyl(ctx, cx, yJ, yB, Rj, ry, "#7d8796");
      /* fenêtre de coupe : intérieur */
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx - Ri, yJ); ctx.lineTo(cx - Ri, yB - 8); ctx.ellipse(cx, yB - 8, Ri, ry * 0.86, 0, PI, 0, true); ctx.lineTo(cx + Ri, yJ); ctx.ellipse(cx, yJ, Ri, ry * 0.86, 0, 0, PI, false); ctx.closePath();
      var inner = p1cylGrad(ctx, cx - Ri, cx + Ri, ["#3b4452", "#5c6676", "#3b4452"]); ctx.fillStyle = inner; ctx.fill(); ctx.clip();
      /* seau d'eau */
      var warm = Math.min(1, (Tnow - T0_BOMB) / 3);
      var water = p1cylGrad(ctx, cx - Rw, cx + Rw, ["rgba(" + Math.round(40 + 40 * warm) + ",110,190,.85)", "rgba(140,195,240,.75)", "rgba(" + Math.round(40 + 40 * warm) + ",110,190,.9)"]);
      ctx.fillStyle = water; ctx.beginPath(); ctx.moveTo(cx - Rw, yW); ctx.lineTo(cx - Rw, yB - 12); ctx.ellipse(cx, yB - 12, Rw, ry * 0.8, 0, PI, 0, true); ctx.lineTo(cx + Rw, yW); ctx.closePath(); ctx.fill();
      p1ell(ctx, cx, yW, Rw, ry * 0.8); ctx.fillStyle = "rgba(170,215,245,.85)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.stroke();
      /* objets autour de l'axe (agitateur, sonde) : derrière ou devant la bombe */
      var items = [{k:"stir", a:st.az}, {k:"probe", a:st.az + 2.3}];
      function drawItem(it){
        var x = cx + Math.cos(it.a) * Rw * 0.66, z = Math.sin(it.a), sc = 1 + z * 0.08;
        if (it.k === "stir"){
          S.draw.line(c, x, yJ - 40, x, yB - 34, "#9aa3ad", 3 * sc);
          var ph = (st.rt || 0) * 9, bw = Math.abs(Math.cos(ph)) * 13 * sc + 2;
          ctx.fillStyle = "#c9ced6"; p1rr(ctx, x - bw, yB - 40, 2 * bw, 8, 2); ctx.fill(); ctx.strokeStyle = "#6b7280"; ctx.stroke();
        } else {
          S.draw.line(c, x, yJ - 40, x, yB - 50, "#e6e9ee", 4 * sc); S.draw.line(c, x, yB - 62, x, yB - 50, "#c0321d", 4 * sc);
        }
      }
      items.forEach(function(it){ if (Math.sin(it.a) < 0) drawItem(it); });
      /* bombe en acier (avec fenêtre) */
      p1cyl(ctx, cx, ybT, ybB, Rbm, Rbm * 0.24, "#8b95a3");
      p1cyl(ctx, cx, ybT - 10, ybT + 2, Rbm * 1.08, Rbm * 0.26, "#6b7480");
      var wx = Rbm * 0.62, wy0 = ybT + 14, wy1 = ybB - 12;
      ctx.fillStyle = "#1c232e"; p1rr(ctx, cx - wx, wy0, 2 * wx, wy1 - wy0, 6); ctx.fill();
      var flash = fired ? Math.exp(-(st.tm - st.tig) / 0.12) : 0, hot = fired ? Math.exp(-(st.tm - st.tig) / 0.9) : 0;
      if (hot > 0.02){ ctx.save(); ctx.globalAlpha = hot * 0.6; ctx.fillStyle = "#ff6a2a"; p1rr(ctx, cx - wx, wy0, 2 * wx, wy1 - wy0, 6); ctx.fill(); ctx.restore(); }
      /* creuset, pastille, fil d'allumage */
      var cuy = wy1 - 16;
      ctx.fillStyle = "#c9ced6"; ctx.beginPath(); ctx.moveTo(cx - wx * 0.55, cuy); ctx.lineTo(cx + wx * 0.55, cuy); ctx.lineTo(cx + wx * 0.4, cuy + 10); ctx.lineTo(cx - wx * 0.4, cuy + 10); ctx.closePath(); ctx.fill();
      var pel = fired ? Math.max(0, 1 - (st.tm - st.tig) / 0.25) : 1;
      if (pel > 0){ ctx.save(); ctx.globalAlpha = pel; p1cyl(ctx, cx, cuy - 7, cuy, wx * 0.3, wx * 0.08, fired ? "#ffb347" : "#f4efe4"); ctx.restore(); }
      ctx.strokeStyle = fired && flash > 0.1 ? "#ffd34d" : "#b08d57"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - wx * 0.7, wy0 + 6); ctx.quadraticCurveTo(cx, cuy - 14, cx + wx * 0.7, wy0 + 6); ctx.stroke();
      if (flash > 0.02){ S.draw.glow(c, cx, cuy - 6, wx * 2.2 * (0.6 + flash), "#ffcf4d", flash); }
      p1txt(S, c, "O₂", cx + wx * 0.5, wy0 + 14, {size:10, color:"#9fb3c8"});
      items.forEach(function(it){ if (Math.sin(it.a) >= 0) drawItem(it); });
      ctx.restore();
      /* tranche de l'isolant (bords de la coupe) */
      ctx.save(); ctx.strokeStyle = "#e9c46a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - Ri, yJ); ctx.lineTo(cx - Ri, yB - 8); ctx.moveTo(cx + Ri, yJ); ctx.lineTo(cx + Ri, yB - 8); ctx.stroke(); ctx.restore();
      /* couvercle (anneau) et moteur */
      ctx.save(); p1ell(ctx, cx, yJ, Rj, ry); ctx.strokeStyle = "#5c6676"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      var sx = cx + Math.cos(st.az) * Rw * 0.66;
      p1cyl(ctx, sx, yJ - 62, yJ - 40, 11, 3, "#2f5fb3");
      /* fils vers le boîtier de mise à feu */
      var fx = phone ? W * 0.83 : W * 0.8, fy = phone ? H * 0.6 : H * 0.66, fbw = phone ? 84 : 104, fbh = 60;
      ctx.save(); ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - Rbm * 0.4, ybT - 10); ctx.bezierCurveTo(cx - Rbm * 0.4, yJ - 80, fx - fbw / 2, fy - 80, fx - fbw / 2 + 6, fy); ctx.stroke();
      ctx.strokeStyle = "#1f2937"; ctx.beginPath(); ctx.moveTo(cx + Rbm * 0.4, ybT - 10); ctx.bezierCurveTo(cx + Rbm * 0.4, yJ - 70, fx - fbw / 2, fy - 60, fx - fbw / 2 + 6, fy + 10); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      var bxg = ctx.createLinearGradient(0, fy - fbh / 2, 0, fy + fbh / 2); bxg.addColorStop(0, "#4b5a70"); bxg.addColorStop(1, "#28323f"); ctx.fillStyle = bxg; p1rr(ctx, fx - fbw / 2, fy - fbh / 2, fbw, fbh, 8); ctx.fill(); ctx.restore();
      var bR = 15, can = !fired;
      p1ball(ctx, fx, fy - 4, bR + 3, "#3b4452"); p1ball(ctx, fx, fy - 4, bR, can ? "#e0392b" : "#7a2a24");
      if (can) S.draw.glow(c, fx, fy - 4, bR * 2, "#ff5a4a", 0.25 + 0.2 * Math.sin((st.rt || 0) * 5));
      p1txt(S, c, "MISE À FEU", fx, fy + bR + 7, {size:9.5, color:"#e6ebf2"});
      hit.fire = {x:fx, y:fy - 4, r:bR};
      /* afficheur de température */
      var dx = fx, dy = phone ? 44 : 50;
      S.draw.display(c, Tnow.toFixed(3).replace(".", ",") + " °C", dx, dy, {w:phone ? 120 : 140, h:52, caption:"THERMOMÈTRE (EAU)", size:phone ? 17 : 20});
      p1txt(S, c, fired ? (st.tm - st.tig < 0.3 ? "mise à feu !" : "t = " + fmtN(st.tm, 1) + " min") : "mise à feu à " + fmtN(st.tig, 0) + " min", dx, dy + 38, {size:p1fz(c, 11.5), color:fired ? "#c0321d" : "#2c3a4e", halo:true});
      p1txt(S, c, "glisse pour tourner", 10, 14, {size:p1fz(c, 10.5), color:"#5f6b7a", align:"left", weight:600});
      S.draw.label(c, F.eq, W / 2, H - 13, {color:"#1f4b9e", size:p1fz(c, phone ? 10.5 : 11.5), fill:"rgba(255,255,255,.92)"});
      p1txt(S, c, "eau", cx + Rw * 0.62, yB - 30, {size:11, color:"#e6f2ff"});
      p1txt(S, c, "bombe", cx, ybB + 12, {size:p1fz(c, 11), color:"#e6ebf2"});

      /* ---- courbe T(t) ---- */
      g.clear(); var gx = g.ctx;
      var ax = S.draw.axes(g, {x0:0, x1:12, y0:T0_BOMB - 0.1 * Math.max(1, dTex), y1:T0_BOMB + dTex * 1.18 + 0.05, xl:"t (min)", yl:"T (°C)", l:50, b:30, t:12, r:14, stepX:2});
      var tEnd = Math.min(12, st.tm);
      gx.save(); gx.beginPath();
      for (var i2 = 0; i2 <= 240; i2++){ var tt = tEnd * i2 / 240, Ty = T0_BOMB + dTex * phi(tt); if (i2) gx.lineTo(ax.X(tt), ax.Y(Ty)); else gx.moveTo(ax.X(tt), ax.Y(Ty)); }
      gx.lineWidth = 2.6; gx.strokeStyle = "#c0321d"; gx.stroke(); gx.restore();
      S.draw.dot(g, ax.X(tEnd), ax.Y(Tnow), 5, "#c0321d");
      if (fired) S.draw.line(g, ax.X(st.tig), ax.T, ax.X(st.tig), ax.B, "#c26a0c", 1.2, [4, 4]);
      if (st.tm > st.tig + 3.5){
        var xr = ax.X(11.3);
        S.draw.line(g, ax.X(0), ax.Y(T0_BOMB), ax.X(12), ax.Y(T0_BOMB), "#1f4b9e", 1, [5, 4]);
        S.draw.line(g, ax.X(st.tig), ax.Y(T0_BOMB + dTex), ax.X(12), ax.Y(T0_BOMB + dTex), "#1f4b9e", 1, [5, 4]);
        S.draw.arrow(g, xr, ax.Y(T0_BOMB), xr, ax.Y(T0_BOMB + dTex), "#1f4b9e", 2);
        p1txt(S, g, "ΔT = " + dTr.toFixed(3).replace(".", ",") + " K", xr - 8, ax.Y(T0_BOMB + dTex / 2), {size:p1fz(g, 12.5), color:"#1f4b9e", align:"right", halo:true});
      }
      if (st.hover != null && st.hover > ax.L && st.hover < ax.R){
        var th = ax.ix(st.hover); if (th <= tEnd){ var Th = T0_BOMB + dTex * phi(th); S.draw.line(g, st.hover, ax.T, st.hover, ax.B, "#8a95a3", 1); S.draw.dot(g, st.hover, ax.Y(Th), 4, "#1f4b9e"); p1txt(S, g, fmtN(th, 1) + " min : " + Th.toFixed(3).replace(".", ",") + " °C", Math.min(st.hover + 6, g.W - 150), ax.T + 8, {size:11, color:"#1f4b9e", align:"left", halo:true}); }
      }

      var done = st.tm > st.tig + 3.5;
      ro.set(0, done ? dTr.toFixed(3).replace(".", ",") + " K" : "mesure en cours…");
      ro.set(1, done ? S.fmt(q, 2) + " kJ" : "—");
      ro.set(2, S.fmt(nmol * 1000, 3) + " mmol");
      ro.set(3, done ? S.fmt(dU, 1) + " kJ/mol" : "—");
      ro.set(4, (dn > 0 ? "+" : "") + S.fmt(dn, 1) + " mol");
      ro.set(5, done ? S.fmt(dH, 1) + " kJ/mol" : "—");
      var msg = "Δn(gaz) = " + S.fmt(F.gout, 1) + " (CO₂) − " + S.fmt(F.gin, 1) + " (O₂) = " + S.fmt(dn, 1) + " mol. " + (dn === 0 ? "Autant de moles de gaz avant et après : ΔcH = ΔcU, la combustion ne fait aucun travail même à pression constante." : "Δn·RT = " + S.fmt(dn * RT, 2) + " kJ/mol : ΔcH est " + (dn < 0 ? "plus négatif" : "moins négatif") + " que ΔcU (à pression constante, l'atmosphère pousse sur le système qui se contracte, et cette énergie sort aussi en chaleur).") + (done ? " Pouvoir calorifique : " + S.fmt(q / m, 2) + " kJ/g." : "");
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   5. L'entropie en direct : S = k·ln W (c05)
   ===================================================================== */
var LF = [0]; for (var iL = 1; iL <= 400; iL++) LF[iL] = LF[iL - 1] + Math.log(iL);
function p1lnC(N, n){ return LF[N] - LF[n] - LF[N - n]; }
function p1C(N, n){ var r = 1; n = Math.min(n, N - n); for (var i = 1; i <= n; i++) r = r * (N - n + i) / i; return Math.round(r); }

SFA.sim({
  id:"ch-entropie-microetats", ch:"c05", tag:"Entropie",
  titre:"L'entropie en direct : on retire la cloison",
  resume:"N molécules serrées à gauche, on retire la cloison : elles se répandent et le nombre de micro-états W s'envole. S = k·ln W se calcule en direct.",
  but:"Règle le nombre de molécules N, puis regarde : la cloison se lève et les molécules se répartissent. Le compteur affiche W, le nombre de façons de choisir quelles molécules sont à gauche, et S = k·ln W. Clique sur la cloison (ou fais-la glisser) pour la baisser ou la lever.",
  aRetenir:"Boltzmann : S = k·ln W, avec k = 1,381·10⁻²³ J/K. Avec n molécules à gauche parmi N, W = N!/(n!·(N − n)!). W est maximal pour n = N/2 : c'est l'état d'équilibre, de loin le plus probable. Pour une mole de gaz qui double son volume, ΔS = R·ln 2 = 5,76 J·K⁻¹·mol⁻¹ > 0 : la détente dans le vide est spontanée et irréversible.",
  piege:"L'état « toutes à gauche » n'est pas interdit, il est seulement très improbable : sa probabilité vaut 1/2ᴺ (≈ 8·10⁻³¹ pour N = 100). Ici W ne compte que la répartition gauche/droite ; l'entropie de détente complète vaut N·k·ln 2, et k·ln W s'en approche quand N grandit (ln W<sub>max</sub> ≈ N·ln 2 − ½·ln(πN/2)).",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 360 : 340), g = k.canvas(phone ? 300 : 165);
    var nS = k.slider("Nombre de molécules N", 2, 300, 1, 100, "", reset);
    k.button("Tout remettre à gauche", reset, true);
    var wb = k.button("Baisser la cloison", function(){ st.target = st.target > 0.5 ? 0 : 1; st.auto = -1; });
    var ro = k.readouts(["À gauche / à droite", "Micro-états W = C(N, n)", "ln W", "S = k·ln W", "S à l'équilibre (n = N/2)", "P(toutes à gauche) = 1/2ᴺ"]);
    var nt = k.note("", "ok");
    var st = {P:[], lift:0, target:0, auto:1.3, hist:[], t:0, drag:null};
    function reset(){
      var N = Math.round(nS.value); st.P = [];
      for (var i = 0; i < N; i++){ var a = Math.random() * 2 * PI, v = 0.25 + Math.random() * 0.25; st.P.push({x:0.03 + Math.random() * 0.44, y:0.04 + Math.random() * 0.92, z:Math.random(), vx:Math.cos(a) * v, vy:Math.sin(a) * v, vz:(Math.random() - 0.5) * 0.3}); }
      st.lift = 0; st.target = 0; st.auto = 1.3; st.hist = []; st.t = 0;
    }
    reset();
    var geo = {};
    c.pointer(function(type, p){
      if (type === "down" && geo.wx != null && Math.abs(p.x - geo.wx) < 26 && p.y > geo.top - 40 && p.y < geo.bot){ st.drag = {y:p.y, l:st.lift, moved:false}; st.auto = -1; }
      if (type === "drag" && st.drag){ var l = st.drag.l + (st.drag.y - p.y) / (geo.bot - geo.top); st.lift = st.target = Math.max(0, Math.min(1, l)); if (Math.abs(p.y - st.drag.y) > 4) st.drag.moved = true; }
      if (type === "up" && st.drag){ if (!st.drag.moved) st.target = st.lift > 0.5 ? 0 : 1; st.drag = null; }
    });
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto > 0){ st.auto -= dt; if (st.auto <= 0){ st.target = 1; st.auto = -1; } }
      if (!st.drag) st.lift += Math.max(-dt * 1.6, Math.min(dt * 1.6, st.target - st.lift));
      var gap = st.lift, r = 0.012;
      st.P.forEach(function(q){
        var x0 = q.x; q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt;
        if (q.x < r){ q.x = r; q.vx = Math.abs(q.vx); } if (q.x > 1 - r){ q.x = 1 - r; q.vx = -Math.abs(q.vx); }
        if (q.y < r){ q.y = r; q.vy = Math.abs(q.vy); } if (q.y > 1 - r){ q.y = 1 - r; q.vy = -Math.abs(q.vy); }
        if (q.z < 0){ q.z = 0; q.vz = Math.abs(q.vz); } if (q.z > 1){ q.z = 1; q.vz = -Math.abs(q.vz); }
        /* cloison en x = 0,5 : passage seulement sous son bord inférieur (y < lift) */
        if ((x0 - 0.5) * (q.x - 0.5) <= 0 && q.y > gap && x0 !== 0.5){ q.x = x0 < 0.5 ? 0.5 - r : 0.5 + r; q.vx = -q.vx; }
      });
      var nL = 0; st.P.forEach(function(q){ if (q.x < 0.5) nL++; });
      st.nL = nL;
      st.hist.push(p1lnC(st.P.length, nL)); if (st.hist.length > 900) st.hist.shift();
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, N = st.P.length, nL = st.nL == null ? N : st.nL, nR = N - nL;
      var lnW = p1lnC(N, nL), Wv = Math.exp(lnW), Sv = K_B * lnW, lnMax = p1lnC(N, Math.floor(N / 2));
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f3f6fa"); bg.addColorStop(1, "#e2e9f1"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* compteur */
      var topH = phone ? 92 : 74;
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2;
      var cg = ctx.createLinearGradient(0, 8, 0, topH); cg.addColorStop(0, "#1b2638"); cg.addColorStop(1, "#0d1522"); ctx.fillStyle = cg; p1rr(ctx, 10, 8, W - 20, topH - 12, 10); ctx.fill(); ctx.restore();
      var wStr = lnW < Math.log(1e15) ? p1int(p1C(N, nL)) : p1sci(Wv, 3);
      var big = phone ? 22 : 27;
      p1txt(S, c, "W =", 24, phone ? 32 : 40, {size:big * 0.75, color:"#9fb3c8", align:"left"});
      p1txt(S, c, wStr, 24 + big * 2.1, phone ? 32 : 40, {size:big, color:"#ffd34d", align:"left", weight:800});
      var sStr = "S = k·ln W = " + (Sv === 0 ? "0" : p1sci(Sv, 3)) + " J/K";
      p1txt(S, c, sStr, phone ? 24 : W - 24, phone ? 64 : 40, {size:phone ? 14 : 15, color:"#a7f3b5", align:phone ? "left" : "right", weight:800});
      if (!phone) p1txt(S, c, "micro-états : façons de choisir les " + nL + " molécules de gauche parmi " + N, 24, 60, {size:10.5, color:"#9fb3c8", align:"left", weight:600});
      /* boîte en perspective */
      var bx0 = W * 0.06, bw = W * 0.82, by0 = topH + 46, bh = H - by0 - 18, ox = bw * 0.1, oy = -26;
      function P3(x, y, z){ return [bx0 + x * bw + z * ox, by0 + bh - y * bh + z * oy]; }
      /* fond et arêtes arrière */
      ctx.save(); ctx.fillStyle = "rgba(205,220,236,.55)";
      var b00 = P3(0, 0, 1), b10 = P3(1, 0, 1), b11 = P3(1, 1, 1), b01 = P3(0, 1, 1);
      ctx.beginPath(); ctx.moveTo(b00[0], b00[1]); ctx.lineTo(b10[0], b10[1]); ctx.lineTo(b11[0], b11[1]); ctx.lineTo(b01[0], b01[1]); ctx.closePath(); ctx.fill();
      var f00 = P3(0, 0, 0), f10 = P3(1, 0, 0);
      ctx.fillStyle = "rgba(170,185,205,.55)"; ctx.beginPath(); ctx.moveTo(f00[0], f00[1]); ctx.lineTo(f10[0], f10[1]); ctx.lineTo(b10[0], b10[1]); ctx.lineTo(b00[0], b00[1]); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(90,110,140,.45)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
      /* molécules (de l'arrière vers l'avant) */
      var rp = Math.max(3.2, Math.min(9, 72 / Math.sqrt(Math.max(N, 4)))) * (phone ? 0.85 : 1);
      var order = st.P.slice().sort(function(a, b){ return b.z - a.z; });
      order.forEach(function(q){ var p = P3(q.x, q.y, q.z); p1ball(ctx, p[0], p[1], rp * (1 - 0.22 * q.z), q.x < 0.5 ? "#2f6fd6" : "#e0702a"); });
      /* cloison (plaque de verre qui coulisse vers le haut) */
      var lift = st.lift, c0 = P3(0.5, lift, 0), c1 = P3(0.5, lift, 1), c2 = P3(0.5, 1 + lift, 1), c3 = P3(0.5, 1 + lift, 0);
      ctx.save(); ctx.beginPath(); ctx.rect(0, topH + 2, W, H); ctx.clip(); ctx.fillStyle = "rgba(140,190,230,.32)"; ctx.strokeStyle = "rgba(40,90,150,.8)"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(c3[0], c3[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
      var hx = (c2[0] + c3[0]) / 2, hy = (c2[1] + c3[1]) / 2;
      ctx.fillStyle = "#2c3a4e"; p1rr(ctx, hx - 14, hy - 8, 28, 9, 4); ctx.fill(); ctx.restore();
      geo.wx = (c0[0] + c1[0]) / 2; geo.top = Math.min(c2[1], c3[1]); geo.bot = by0 + bh; 
      /* arêtes avant (verre) */
      var f11 = P3(1, 1, 0), f01 = P3(0, 1, 0);
      ctx.save(); ctx.strokeStyle = "rgba(60,80,110,.7)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(f00[0], f00[1]); ctx.lineTo(f10[0], f10[1]); ctx.lineTo(f11[0], f11[1]); ctx.lineTo(f01[0], f01[1]); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(f01[0], f01[1]); ctx.lineTo(b01[0], b01[1]); ctx.lineTo(b11[0], b11[1]); ctx.lineTo(f11[0], f11[1]); ctx.moveTo(f10[0], f10[1]); ctx.lineTo(b10[0], b10[1]); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.fillRect(f01[0], f01[1], f11[0] - f01[0], f10[1] - f01[1]);
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f01[0] + 10, f01[1] + 12); ctx.lineTo(f01[0] + 40, f01[1] + 12); ctx.stroke();
      ctx.restore();
      p1txt(S, c, "gauche : " + nL, P3(0.25, 0, 0)[0], by0 + bh + 10, {size:p1fz(c, 12), color:"#2f6fd6"});
      p1txt(S, c, "droite : " + nR, P3(0.75, 0, 0)[0], by0 + bh + 10, {size:p1fz(c, 12), color:"#e0702a"});
      p1txt(S, c, st.lift > 0.5 ? "clique la cloison pour la baisser" : "clique la cloison pour la lever", W - 10, topH + 8, {size:p1fz(c, 10.5), color:"#5f6b7a", align:"right", weight:600});
      wb.textContent = st.target > 0.5 ? "Baisser la cloison" : "Lever la cloison";

      /* ---- distribution C(N, n)/2ᴺ et évolution de ln W ---- */
      g.clear(); var gx = g.ctx, GW = g.W, GH = g.H;
      var r1 = phone ? {x:0, y:0, w:GW, h:GH / 2} : {x:0, y:0, w:GW * 0.55, h:GH}, r2 = phone ? {x:0, y:GH / 2, w:GW, h:GH / 2} : {x:GW * 0.55, y:0, w:GW * 0.45, h:GH};
      var L1 = r1.x + 40, R1 = r1.x + r1.w - 10, T1 = r1.y + 22, B1 = r1.y + r1.h - 26;
      var pmax = Math.exp(lnMax - N * Math.LN2);
      p1txt(S, g, "Probabilité de n molécules à gauche", L1, r1.y + 10, {size:p1fz(g, 11.5), align:"left", color:"#2c3a4e"});
      var bwd = (R1 - L1) / (N + 1);
      for (var n2 = 0; n2 <= N; n2++){
        var pv = Math.exp(p1lnC(N, n2) - N * Math.LN2), hh = pv / pmax * (B1 - T1);
        gx.fillStyle = n2 === nL ? "#c26a0c" : "rgba(47,111,214,.55)";
        gx.fillRect(L1 + n2 * bwd + (bwd > 3 ? 0.5 : 0), B1 - hh, Math.max(1, bwd - (bwd > 3 ? 1 : 0)), hh);
      }
      S.draw.line(g, L1, B1, R1, B1, "#a3adba", 1);
      var xn = L1 + (nL + 0.5) * bwd;
      S.draw.line(g, xn, T1 - 4, xn, B1, "#c26a0c", 1.4, [3, 3]);
      [0, Math.floor(N / 2), N].forEach(function(v){ p1txt(S, g, String(v), L1 + (v + 0.5) * bwd, B1 + 10, {size:10, color:"#5f6b7a", weight:600}); });
      p1txt(S, g, "n = " + nL, Math.max(L1 + 20, Math.min(R1 - 20, xn)), B1 + 21, {size:p1fz(g, 11), color:"#c26a0c"});
      /* trace ln W(t) */
      var L2 = r2.x + 44, R2 = r2.x + r2.w - 12, T2 = r2.y + 22, B2 = r2.y + r2.h - 26, ymax = Math.max(1, N * Math.LN2) * 1.05;
      p1txt(S, g, "ln W au cours du temps", L2, r2.y + 10, {size:p1fz(g, 11.5), align:"left", color:"#2c3a4e"});
      S.draw.line(g, L2, B2, R2, B2, "#a3adba", 1); S.draw.line(g, L2, T2, L2, B2, "#a3adba", 1);
      var yMx = B2 - lnMax / ymax * (B2 - T2), yN2 = B2 - N * Math.LN2 / ymax * (B2 - T2);
      S.draw.line(g, L2, yMx, R2, yMx, "#24775a", 1.2, [5, 4]); S.draw.line(g, L2, yN2, R2, yN2, "#6236c4", 1, [2, 3]);
      p1txt(S, g, "ln W max = " + fmtN(lnMax, 1), R2, yMx + 9, {size:10, color:"#24775a", align:"right", halo:true});
      p1txt(S, g, "N ln 2 = " + fmtN(N * Math.LN2, 1), R2, yN2 - 8, {size:10, color:"#6236c4", align:"right", halo:true});
      gx.save(); gx.beginPath(); var hs = st.hist, nh = hs.length;
      for (var j = 0; j < nh; j++){ var xh = L2 + j / 900 * (R2 - L2), yh = B2 - hs[j] / ymax * (B2 - T2); if (j) gx.lineTo(xh, yh); else gx.moveTo(xh, yh); }
      gx.lineWidth = 2; gx.strokeStyle = "#1f4b9e"; gx.stroke(); gx.restore();
      p1txt(S, g, "0", L2 - 6, B2, {size:10, color:"#5f6b7a", align:"right", weight:600});
      p1txt(S, g, "temps →", R2, B2 + 11, {size:10, color:"#5f6b7a", align:"right", weight:600});

      ro.set(0, nL + " / " + nR);
      ro.set(1, lnW < Math.log(1e15) ? p1int(p1C(N, nL)) : p1sciH(Wv, 3));
      ro.set(2, S.fmt(lnW, 2));
      ro.set(3, Sv === 0 ? "0 J/K" : p1sciH(Sv, 3) + " J/K");
      ro.set(4, p1sciH(K_B * lnMax, 3) + " J/K");
      ro.set(5, p1sciH(Math.pow(2, -N), 2));
      var msg = "Pour N = " + N + " : ln W<sub>max</sub> = " + S.fmt(lnMax, 2) + ", proche de N·ln 2 = " + S.fmt(N * Math.LN2, 2) + " (écart ½·ln(πN/2) = " + S.fmt(0.5 * Math.log(PI * N / 2), 2) + "). À l'échelle d'une mole (N = 6,022·10²³), la détente donne ΔS = R·ln 2 = " + S.fmt(R_GP * Math.LN2, 2) + " J/K et le retour spontané de toutes les molécules à gauche n'arrive jamais.";
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

})();
