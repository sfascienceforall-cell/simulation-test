/* Chimie BA1 · lot P2-CD (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-vitesse-tangente (c07) · ch-collisions-3d (c07) · ch-enzyme-site-actif (c07) · ch-autoprotolyse (L12) */
(function(){
var PI = Math.PI;
var CD_R = 8.314462618;

/* ---------- aides de dessin (préfixe cd) ---------- */
function cdShade(hex, f){
  var n = parseInt(String(hex).replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function cdRgba(hex, a){ var n = parseInt(String(hex).replace("#", ""), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function cdBall(ctx, x, y, r, hex, alpha){
  if (!(r > 0.3) || !isFinite(x) || !isFinite(y)) return;
  ctx.save(); if (alpha != null) ctx.globalAlpha = alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, cdShade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, cdShade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill(); ctx.restore();
}
function cdRR(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function cdEll(ctx, cx, cy, rx, ry){ ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, 2 * PI); }
function cdFz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
/* nombre à décimales fixes, virgule, signe moins typographique */
function cdF(x, d){ if (x == null || !isFinite(x)) return "—"; var s = Number(x).toFixed(d); if (/^-0(\.0+)?$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); }
/* nombre à 3 chiffres significatifs (sans notation scientifique pour 0,001 ≤ |x| < 10000) */
function cdS(x, n){
  if (x == null || !isFinite(x)) return "—"; n = n || 3;
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), d = Math.max(0, n - 1 - e);
  return cdF(x, d);
}
/* écriture scientifique en texte simple : 1,01·10⁻¹⁴ */
var CD_SUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
function cdSci(x, d){
  if (!isFinite(x) || x === 0) return cdF(x, d);
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(Number(m.toFixed(d))) >= 10){ m /= 10; e += 1; }
  return cdF(m, d) + "·10" + String(e).split("").map(function(ch){ return CD_SUP[ch]; }).join("");
}
function cdT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function cdRot(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}
/* rotation d'un vecteur v autour d'un axe unitaire ax (formule de Rodrigues) */
function cdRotAx(v, ax, an){
  var cs = Math.cos(an), sn = Math.sin(an), d = v[0] * ax[0] + v[1] * ax[1] + v[2] * ax[2];
  var cr = [ax[1] * v[2] - ax[2] * v[1], ax[2] * v[0] - ax[0] * v[2], ax[0] * v[1] - ax[1] * v[0]];
  return [v[0] * cs + cr[0] * sn + ax[0] * d * (1 - cs), v[1] * cs + cr[1] * sn + ax[1] * d * (1 - cs), v[2] * cs + cr[2] * sn + ax[2] * d * (1 - cs)];
}
function cdShadeHex(hex, f){ var m = /rgb\((\d+),(\d+),(\d+)\)/.exec(cdShade(hex, f)); return "#" + [m[1], m[2], m[3]].map(function(v){ return ("0" + (+v).toString(16)).slice(-2); }).join(""); }
function cdNorm(v){ var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
/* tirage gaussien (Box-Muller) */
function cdGauss(){ var u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * v); }
/* fond de laboratoire : mur carrelé + paillasse */
function cdLab(ctx, x, y, w, h, benchY, dark){
  var bg = ctx.createLinearGradient(0, y, 0, benchY);
  if (dark){ bg.addColorStop(0, "#1b2438"); bg.addColorStop(1, "#2b3754"); }
  else { bg.addColorStop(0, "#e9eef4"); bg.addColorStop(1, "#d5dde8"); }
  ctx.fillStyle = bg; ctx.fillRect(x, y, w, benchY - y);
  ctx.save(); ctx.strokeStyle = dark ? "rgba(255,255,255,.05)" : "rgba(120,140,165,.18)"; ctx.lineWidth = 1;
  for (var gy = benchY - 28; gy > y; gy -= 28){ ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); }
  for (var gx = x + 14; gx < x + w; gx += 28){ ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, benchY); ctx.stroke(); }
  ctx.restore();
  var wd = ctx.createLinearGradient(0, benchY, 0, y + h);
  wd.addColorStop(0, dark ? "#46526a" : "#5d6b80"); wd.addColorStop(0.12, dark ? "#2f394d" : "#3f4a5c"); wd.addColorStop(1, dark ? "#1a2130" : "#283141");
  ctx.fillStyle = wd; ctx.fillRect(x, benchY, w, y + h - benchY);
  ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(x, benchY, w, 2);
}

/* =====================================================================
   1. Vitesse moyenne et vitesse instantanée : la tangente (c07)
   ===================================================================== */
var VT_K25 = 0.010, VT_EA = 60000, VT_EPS = 8.7e4;   /* s⁻¹ à 25 °C ; J/mol ; L·mol⁻¹·cm⁻¹ à 590 nm */
function vtK(Tc){ return VT_K25 * Math.exp(-VT_EA / CD_R * (1 / (Tc + 273.15) - 1 / 298.15)); }
function vtTmax(k){ var h = Math.LN2 / k, L = [60, 90, 120, 180, 240, 300, 420, 600]; for (var i = 0; i < L.length; i++) if (L[i] >= 4 * h) return L[i]; return 600; }

SFA.sim({
  id:"ch-vitesse-tangente", ch:"c07", tag:"Vitesse de réaction",
  titre:"Vitesse moyenne, vitesse instantanée : la tangente",
  resume:"Un colorant violet se décolore dans un erlenmeyer ; une sonde de spectrophotomètre trace [A](t) en direct. Deux points donnent la corde (vitesse moyenne), un troisième la tangente (vitesse instantanée).",
  but:"Regarde la solution pâlir pendant que l'écran trace [A](t). Glisse les deux points orange le long de la courbe : la pente de la corde donne la vitesse moyenne entre t₁ et t₂. Glisse le point bleu : la pente de la tangente donne la vitesse instantanée à cet instant. Change la température ou la concentration de départ et compare.",
  aRetenir:"Pour A → produits, la vitesse est v = −d[A]/dt (positive, en mol·L⁻¹·s⁻¹). La <b>vitesse moyenne</b> entre t₁ et t₂ est −Δ[A]/Δt : c'est la pente (changée de signe) de la <b>corde</b>. La <b>vitesse instantanée</b> en t est la pente (changée de signe) de la <b>tangente</b> en ce point. La vitesse diminue au cours du temps parce que [A] diminue ; ici (ordre 1 apparent) v = k'·[A]. Une température plus élevée augmente k', donc toutes les pentes.",
  piege:"Ne lis pas une vitesse instantanée comme Δ[A]/Δt entre deux points éloignés : sur une courbe, la corde ne donne qu'une moyenne. La corde a la même pente que la tangente en un instant intermédiaire, mais pas au milieu de l'intervalle : la courbe est plus raide au début. Et la pente de [A](t) est négative alors que la vitesse est positive : v = −pente.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 560 : 440);
    var st = {ta:0, hold:0, u:[0.1, 0.4, 0.2], drag:-1, stir:0, seed:3, noise:[]};
    var TS = k.slider("Température du bain", 15, 45, 1, 25, "°C", resetRun);
    var AS = k.slider("Concentration de départ [A]₀", 5, 30, 1, 20, "µmol/L", resetRun);
    var autoT = k.toggle("La tangente glisse toute seule", false);
    k.button("Relancer la mesure", resetRun, true);
    var ro = k.readouts(["Intervalle t₁ → t₂", "Vitesse moyenne (corde)", "Point de la tangente", "Vitesse instantanée (tangente)", "k' à cette température", "Demi-vie t½ = ln 2 / k'"]);
    var nt = k.note("", "ok");
    k.note("Modèle : décoloration d'un colorant violet par OH⁻ en large excès, ordre 1 apparent : [A] = [A]₀·e<sup>−k't</sup>, v = k'·[A]. k' = 0,010 s⁻¹ à 25 °C et E<sub>a</sub> = 60 kJ/mol (valeurs de modèle). La sonde mesure l'absorbance à 590 nm : A = ε·ℓ·[A] avec ε = 8,7·10⁴ L·mol⁻¹·cm⁻¹ et ℓ = 1 cm. L'acquisition est accélérée : toute la mesure défile en 10 s.", "");
    function rnd(){ st.seed = (st.seed * 16807) % 2147483647; return (st.seed - 1) / 2147483646; }
    function resetRun(){ st.ta = 0; st.hold = 0; st.seed = 3; st.noise = []; for (var i = 0; i <= 60; i++) st.noise.push((rnd() - 0.5) * 0.012); }
    resetRun();
    function model(){ var kk = vtK(TS.value), A0 = AS.value, tm = vtTmax(kk); return {k:kk, A0:A0, tm:tm, A:function(t){ return A0 * Math.exp(-kk * t); }}; }
    var geo = {};
    function hit(p){
      if (!geo.ax) return -1;
      var best = -1, bd = phone ? 26 : 20;
      geo.h.forEach(function(h, i){ var d = Math.hypot(h[0] - p.x, h[1] - p.y); if (d < bd){ bd = d; best = i; } });
      return best;
    }
    c.pointer(function(type, p){
      if (type === "down"){ st.drag = hit(p); if (st.drag === 2) autoT.set(false); }
      if (type === "move") c.cv.style.cursor = hit(p) >= 0 ? "grab" : "default";
      if (type === "drag" && st.drag >= 0 && geo.ax){
        var m = model(), t = Math.max(0, Math.min(m.tm, geo.ax.ix(p.x))), u = t / m.tm;
        if (st.drag === 0) u = Math.min(u, st.u[1] - 0.03);
        if (st.drag === 1) u = Math.max(u, st.u[0] + 0.03);
        st.u[st.drag] = Math.max(0, Math.min(1, u));
        k.redraw();
      }
      if (type === "up") st.drag = -1;
    });
    var lp = k.loop(function(dt){
      var m = model();
      if (st.ta < m.tm) st.ta = Math.min(m.tm, st.ta + dt * m.tm / 10);
      else { st.hold += dt; if (st.hold > 4) { st.ta = 0; st.hold = 0; } }
      st.stir += dt * 9;
      if (autoT.value && st.drag !== 2){ st.u[2] += dt * 0.05; if (st.u[2] > 0.92) st.u[2] = 0.03; }
      k.redraw();
    });
    lp.play();

    function flask(ctx, cx, by, s, conc, Tc){
      /* plaque chauffante agitatrice */
      var pw = 120 * s, ph = 30 * s, px = cx - pw / 2, py = by - ph;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.28)"; cdEll(ctx, cx + 4, by + 2, pw * 0.56, 6 * s); ctx.fill(); ctx.restore();
      var gp = ctx.createLinearGradient(0, py, 0, by); gp.addColorStop(0, "#f4f6f9"); gp.addColorStop(0.5, "#d6dce5"); gp.addColorStop(1, "#9aa5b4");
      ctx.fillStyle = gp; cdRR(ctx, px, py, pw, ph, 6 * s); ctx.fill(); ctx.strokeStyle = "#8a95a5"; ctx.lineWidth = 1; ctx.stroke();
      var gt = ctx.createLinearGradient(0, py - 6 * s, 0, py); gt.addColorStop(0, "#c8ced8"); gt.addColorStop(1, "#7f8a99");
      ctx.fillStyle = gt; cdRR(ctx, px + 8 * s, py - 6 * s, pw - 16 * s, 7 * s, 3 * s); ctx.fill();
      /* afficheur de température */
      ctx.fillStyle = "#13233a"; cdRR(ctx, px + 10 * s, py + 7 * s, 50 * s, 17 * s, 3); ctx.fill();
      cdT(S, {ctx:ctx}, cdF(Tc, 1) + " °C", px + 35 * s, py + 15.5 * s, {size:Math.max(9, 11 * s), color:"#ff9c5b", mono:true, weight:600});
      cdBall(ctx, px + pw - 22 * s, py + 15 * s, 7 * s, "#c0392b"); cdBall(ctx, px + pw - 42 * s, py + 15 * s, 6 * s, "#6b7a8f");
      /* erlenmeyer */
      var bw = 92 * s, bh = 112 * s, nw = 26 * s, nh = 40 * s, y0 = py - 6 * s, yt = y0 - bh;
      function body(){
        ctx.beginPath(); ctx.moveTo(cx - nw / 2, yt - nh); ctx.lineTo(cx - nw / 2, yt);
        ctx.lineTo(cx - bw / 2 + 4 * s, y0 - 8 * s); ctx.quadraticCurveTo(cx - bw / 2, y0, cx - bw / 2 + 10 * s, y0);
        ctx.lineTo(cx + bw / 2 - 10 * s, y0); ctx.quadraticCurveTo(cx + bw / 2, y0, cx + bw / 2 - 4 * s, y0 - 8 * s);
        ctx.lineTo(cx + nw / 2, yt); ctx.lineTo(cx + nw / 2, yt - nh); ctx.closePath();
      }
      /* liquide (jusqu'à 55 % de la hauteur du cône) */
      var ly = y0 - bh * 0.55, fr = (ly - yt) / bh, half = nw / 2 + (bw / 2 - nw / 2) * fr;
      var alpha = 1 - Math.pow(10, -conc * VT_EPS * 1e-6 * 0.55);
      ctx.save(); body(); ctx.clip();
      ctx.beginPath(); ctx.moveTo(cx - half, ly); ctx.lineTo(cx + half, ly); ctx.lineTo(cx + bw / 2, y0); ctx.lineTo(cx - bw / 2, y0); ctx.closePath();
      var gl = ctx.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0);
      gl.addColorStop(0, "rgba(" + Math.round(205 - 120 * alpha) + "," + Math.round(225 - 205 * alpha) + "," + Math.round(240 - 70 * alpha) + ",.9)");
      gl.addColorStop(0.5, "rgba(" + Math.round(225 - 110 * alpha) + "," + Math.round(238 - 195 * alpha) + "," + Math.round(250 - 50 * alpha) + ",.85)");
      gl.addColorStop(1, "rgba(" + Math.round(190 - 125 * alpha) + "," + Math.round(212 - 200 * alpha) + "," + Math.round(232 - 90 * alpha) + ",.92)");
      ctx.fillStyle = gl; ctx.fill();
      cdEll(ctx, cx, ly, half, 4 * s); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
      /* tourbillon et barreau aimanté */
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.2;
      for (var q = 0; q < 3; q++){ ctx.beginPath(); ctx.ellipse(cx, ly + (y0 - ly) * (0.3 + q * 0.2), half * (0.25 + q * 0.18), 3 * s, 0, st.stir * 0.3 + q, st.stir * 0.3 + q + 2.2); ctx.stroke(); }
      var a = st.stir, bl = 20 * s;
      ctx.save(); ctx.translate(cx, y0 - 4 * s); ctx.scale(1, 0.32); ctx.rotate(a);
      ctx.fillStyle = "#f8f9fb"; cdRR(ctx, -bl / 2, -3.2 * s, bl, 6.4 * s, 3.2 * s); ctx.fill(); ctx.restore();
      ctx.restore();
      /* verre */
      body();
      var gg = ctx.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0);
      gg.addColorStop(0, "rgba(180,205,230,.35)"); gg.addColorStop(0.3, "rgba(255,255,255,.08)"); gg.addColorStop(1, "rgba(160,190,220,.35)");
      ctx.fillStyle = gg; ctx.fill(); ctx.strokeStyle = "rgba(110,140,175,.9)"; ctx.lineWidth = 1.5; ctx.stroke();
      cdEll(ctx, cx, yt - nh, nw / 2 + 2 * s, 2.5 * s); ctx.strokeStyle = "rgba(110,140,175,.9)"; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.moveTo(cx - nw / 2 + 4 * s, yt - nh + 6 * s); ctx.lineTo(cx - nw / 2 + 7 * s, yt - nh + 6 * s); ctx.lineTo(cx - bw / 2 + 16 * s, y0 - 14 * s); ctx.lineTo(cx - bw / 2 + 11 * s, y0 - 14 * s); ctx.closePath(); ctx.fill();
      return {ly:ly, yt:yt - nh, y0:y0};
    }
    function spectro(ctx, x, y, w, h, absb, s){
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.25)"; cdEll(ctx, x + w / 2 + 3, y + h + 2, w * 0.55, 5); ctx.fill(); ctx.restore();
      /* boîtier en volume : dessus + face + côté */
      var d = 10 * s;
      ctx.fillStyle = "#c9d1dc"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d); ctx.lineTo(x + w + d, y - d); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8f9bab"; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d); ctx.lineTo(x + w + d, y + h - d); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
      var gb = ctx.createLinearGradient(0, y, 0, y + h); gb.addColorStop(0, "#eef1f5"); gb.addColorStop(1, "#b9c3d0");
      ctx.fillStyle = gb; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "#8793a4"; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.fillStyle = "#13233a"; cdRR(ctx, x + 6 * s, y + 6 * s, w - 12 * s, h * 0.52, 4); ctx.fill();
      ctx.fillStyle = "#cfe9d6"; cdRR(ctx, x + 9 * s, y + 9 * s, w - 18 * s, h * 0.52 - 6 * s, 3); ctx.fill();
      cdT(S, {ctx:ctx}, "A = " + cdF(absb, 3), x + w / 2, y + 9 * s + (h * 0.52 - 6 * s) / 2, {size:Math.max(10, 13 * s), color:"#13233a", mono:true, weight:600});
      cdT(S, {ctx:ctx}, "λ = 590 nm", x + w / 2, y + h * 0.75, {size:Math.max(8.5, 10 * s), color:"#2c3a4e", weight:800});
      ctx.fillStyle = "#3aa76d"; ctx.beginPath(); ctx.arc(x + w - 9 * s, y + h - 8 * s, 2.6 * s, 0, 7); ctx.fill();
    }
    function monitor(ctx, x, y, w, h){
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.25)"; cdEll(ctx, x + w / 2, y + h + 22, w * 0.22, 5); ctx.fill(); ctx.restore();
      var gs = ctx.createLinearGradient(0, y + h, 0, y + h + 22); gs.addColorStop(0, "#3a4458"); gs.addColorStop(1, "#1d2433");
      ctx.fillStyle = gs; ctx.fillRect(x + w / 2 - 12, y + h, 24, 18); cdRR(ctx, x + w / 2 - w * 0.16, y + h + 15, w * 0.32, 7, 3); ctx.fill();
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
      var gz = ctx.createLinearGradient(0, y, 0, y + h); gz.addColorStop(0, "#2d3646"); gz.addColorStop(1, "#151b26");
      ctx.fillStyle = gz; cdRR(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
      ctx.fillStyle = "#fbfcfe"; cdRR(ctx, x + 8, y + 8, w - 16, h - 16, 4); ctx.fill();
      ctx.fillStyle = "#58657a"; ctx.beginPath(); ctx.arc(x + w / 2, y + 4.5, 1.6, 0, 7); ctx.fill();
      return {x:x + 8, y:y + 8, w:w - 16, h:h - 16};
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, m = model(), Tc = TS.value, sz = phone ? 0.8 : Math.min(1, W / 560);
      c.clear();
      var benchY = phone ? 196 : H * 0.84;
      cdLab(ctx, 0, 0, W, H, benchY, false);
      if (phone){ var gw = ctx.createLinearGradient(0, benchY + 14, 0, H); gw.addColorStop(0, "#dfe5ed"); gw.addColorStop(1, "#cdd5df"); ctx.fillStyle = gw; ctx.fillRect(0, benchY + 14, W, H - benchY - 14); }
      var Anow = m.A(st.ta), absb = VT_EPS * 1e-6 * Anow;
      /* --- scène : erlenmeyer + sonde + spectrophotomètre --- */
      var fx = phone ? W * 0.26 : W * 0.17, fbY = benchY + (phone ? 2 : 6);
      var fl = flask(ctx, fx, fbY, sz, Anow, Tc);
      var sx = phone ? W * 0.56 : W * 0.03, sy = phone ? benchY - 70 : H * 0.07, sw = phone ? 112 : Math.max(118, W * 0.25), sh = phone ? 58 : 66;
      spectro(ctx, sx, sy, sw, sh, absb, phone ? 0.85 : sz);
      /* sonde à immersion + fibre optique */
      var prx = fx + 8 * sz, pry = fl.ly + 30 * sz;
      ctx.save(); ctx.strokeStyle = "#2f3a4d"; ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.beginPath();
      if (phone){ ctx.moveTo(sx + 6, sy + sh * 0.7); ctx.bezierCurveTo(sx - 40, sy + sh, prx + 10, fl.yt - 50, prx, fl.yt - 14); }
      else { ctx.moveTo(sx + sw * 0.5, sy + sh); ctx.bezierCurveTo(sx + sw * 0.5, sy + sh + 50, prx + 30, fl.yt - 60, prx, fl.yt - 14); }
      ctx.stroke(); ctx.restore();
      var gpb = ctx.createLinearGradient(prx - 4, 0, prx + 4, 0); gpb.addColorStop(0, "#9aa6b6"); gpb.addColorStop(0.5, "#f3f5f8"); gpb.addColorStop(1, "#7d8899");
      ctx.fillStyle = gpb; ctx.fillRect(prx - 3.5 * sz, fl.yt - 16, 7 * sz, pry - fl.yt + 16);
      /* fenêtre de mesure : faisceau */
      ctx.fillStyle = "rgba(255,240,120,.85)"; ctx.fillRect(prx - 3.5 * sz, pry - 12 * sz, 7 * sz, 6 * sz);
      S.draw.glow(c, prx, pry - 9 * sz, 12 * sz, "#ffe66d", 0.5);
      if (!phone || W > 330) cdT(S, c, "sonde", prx + 12 * sz, fl.yt - 2, {size:cdFz(c, 10), color:"#2c3a4e", align:"left", weight:700, halo:"rgba(233,238,244,.9)"});
      /* câble vers l'écran */
      var mon;
      if (phone) mon = monitor(ctx, 8, benchY + 22, W - 16, H - benchY - 40);
      else mon = monitor(ctx, W * 0.36, 12, W * 0.64 - 12, benchY - 46);
      ctx.save(); ctx.strokeStyle = "#3b4558"; ctx.lineWidth = 2.4; ctx.beginPath();
      if (phone){ ctx.moveTo(sx + sw, sy + sh * 0.6); ctx.quadraticCurveTo(W - 4, sy + sh, W - 14, benchY + 30); }
      else { ctx.moveTo(sx + sw, sy + sh * 0.6); ctx.bezierCurveTo(sx + sw + 30, sy + sh, mon.x - 30, mon.y + mon.h * 0.6, mon.x - 8, mon.y + mon.h * 0.6); }
      ctx.stroke(); ctx.restore();

      /* --- graphe sur l'écran --- */
      var gx = {ctx:ctx, W:mon.x + mon.w, H:mon.y + mon.h};
      var ymax = Math.max(5, Math.ceil(m.A0 * 1.12 / 5) * 5);
      var ax = S.draw.axes(gx, {x0:0, x1:m.tm, y0:0, y1:ymax, l:mon.x + (phone ? 38 : 44), r:10, t:mon.y + 32, b:34, xl:"t (s)", yl:"[A] (µmol/L)"});
      geo.ax = ax;
      cdT(S, c, st.ta < m.tm ? "acquisition…  t = " + cdF(st.ta, 0) + " s" : "mesure terminée", mon.x + mon.w - 8, mon.y + 13, {size:cdFz(c, 11), color:st.ta < m.tm ? "#c0392b" : "#24775a", align:"right", weight:800});
      if (st.ta < m.tm && Math.floor(st.ta * 4 / m.tm * 10) % 2 === 0){ ctx.fillStyle = "#e74c3c"; ctx.beginPath(); ctx.arc(mon.x + 10, mon.y + 13, 4, 0, 7); ctx.fill(); }
      /* courbe attendue (fine) puis mesures */
      S.draw.fn(gx, ax, m.A, "rgba(123,47,190,.28)", 1.4, [4, 4]);
      var npt = 60;
      for (var i = 0; i <= npt; i++){
        var ti = m.tm * i / npt; if (ti > st.ta + 1e-9) break;
        var yi = m.A(ti) + st.noise[i] * m.A0;
        cdBall(ctx, ax.X(ti), ax.Y(yi), phone ? 2.6 : 3, "#7b2fbe");
      }
      S.draw.fn(gx, ax, function(t){ return t <= st.ta ? m.A(t) : NaN; }, "#7b2fbe", 2.4);
      /* corde */
      var t1 = st.u[0] * m.tm, t2 = st.u[1] * m.tm, t3 = st.u[2] * m.tm, A1 = m.A(t1), A2 = m.A(t2), A3 = m.A(t3);
      var vm = (A1 - A2) / (t2 - t1), vi = m.k * A3;
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      var ex = (t2 - t1) * 0.25;
      S.draw.line(gx, ax.X(t1 - ex), ax.Y(A1 + vm * ex), ax.X(t2 + ex), ax.Y(A2 - vm * ex), "#e07a1f", 2.6);
      /* triangle de pente de la corde */
      S.draw.line(gx, ax.X(t1), ax.Y(A1), ax.X(t2), ax.Y(A1), "rgba(224,122,31,.65)", 1.4, [4, 3]);
      S.draw.line(gx, ax.X(t2), ax.Y(A1), ax.X(t2), ax.Y(A2), "rgba(224,122,31,.65)", 1.4, [4, 3]);
      /* tangente */
      var span = m.tm * 0.22;
      S.draw.line(gx, ax.X(t3 - span), ax.Y(A3 + vi * span), ax.X(t3 + span), ax.Y(A3 - vi * span), "#1f6fd1", 2.6);
      ctx.restore();
      cdT(S, c, "Δt", (ax.X(t1) + ax.X(t2)) / 2, ax.Y(A1) - 9, {size:cdFz(c, 11), color:"#b65f12", weight:800, halo:true});
      cdT(S, c, "Δ[A]", ax.X(t2) + 6, (ax.Y(A1) + ax.Y(A2)) / 2, {size:cdFz(c, 11), color:"#b65f12", align:"left", weight:800, halo:true});
      geo.h = [[ax.X(t1), ax.Y(A1)], [ax.X(t2), ax.Y(A2)], [ax.X(t3), ax.Y(A3)]];
      [[t1, A1, "#e07a1f", "t₁"], [t2, A2, "#e07a1f", "t₂"], [t3, A3, "#1f6fd1", "t"]].forEach(function(q, j){
        var X = ax.X(q[0]), Y = ax.Y(q[1]);
        if (st.drag === j) S.draw.glow(c, X, Y, 20, q[2], 0.45);
        S.draw.dot(gx, X, Y, phone ? 7.5 : 7, q[2]);
        S.draw.line(gx, X, Y + 9, X, ax.B, cdRgba(q[2] === "#1f6fd1" ? "#1f6fd1" : "#e07a1f", 0.35), 1, [2, 3]);
        cdT(S, c, q[3], X, ax.B - 9, {size:cdFz(c, 11), color:q[2], weight:800, halo:true});
      });
      /* étiquettes de pente, en haut à droite du graphe */
      var lx = ax.R - 6, ly = ax.T + 12, fs = cdFz(c, 12);
      cdT(S, c, "corde : v moy = " + cdS(vm, 3), lx, ly, {size:fs, color:"#b65f12", align:"right", weight:800, bg:"rgba(255,255,255,.9)"});
      cdT(S, c, "tangente : v = " + cdS(vi, 3), lx, ly + fs + 9, {size:fs, color:"#1a58a8", align:"right", weight:800, bg:"rgba(255,255,255,.9)"});
      cdT(S, c, "(en µmol·L⁻¹·s⁻¹)", lx, ly + 2 * (fs + 9) - 2, {size:cdFz(c, 10.5), color:"#5f6b7a", align:"right", weight:700, bg:"rgba(255,255,255,.9)"});
      if (!phone) cdT(S, c, "glisse les points orange et bleu le long de la courbe", mon.x + mon.w / 2, benchY + (H - benchY) / 2, {size:11, color:"rgba(230,236,245,.85)", weight:700});

      /* --- afficheurs --- */
      ro.set(0, cdF(t1, 0) + " s → " + cdF(t2, 0) + " s");
      ro.set(1, cdS(vm, 3) + " µmol·L⁻¹·s⁻¹");
      ro.set(2, "t = " + cdF(t3, 0) + " s ; [A] = " + cdS(A3, 3) + " µmol/L");
      ro.set(3, cdS(vi, 3) + " µmol·L⁻¹·s⁻¹");
      ro.set(4, cdS(m.k, 3) + " s⁻¹");
      ro.set(5, cdS(Math.LN2 / m.k, 3) + " s");
      var ts = Math.log(m.A0 / vm * m.k) / m.k, mid = (t1 + t2) / 2;
      var msg = "La corde a la même pente que la tangente en t ≈ " + cdF(ts, 0) + " s, pas au milieu de l'intervalle (" + cdF(mid, 0) + " s). Vitesse initiale : v₀ = k'·[A]₀ = " + cdS(m.k * m.A0, 3) + " µmol·L⁻¹·s⁻¹ ; absorbance de départ A₀ = ε·ℓ·[A]₀ = " + cdF(VT_EPS * 1e-6 * m.A0, 3) + ".";
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   2. Les collisions efficaces en 3D : énergie et orientation (c07)
   ===================================================================== */
var CL_R = 0.1, CL_COS = 0.5;   /* rayon des molécules (boîte de demi-côté 1) ; orientation correcte si l'angle ≤ 60° */
var CL_P = (1 - CL_COS) / 2;      /* facteur d'orientation : fraction de l'espace des directions = 0,25 */
var CL_KT300 = 1.0;              /* kT à 300 K en unités de l'animation (masse 1) */
var CL_SOL = {
  bloc:{n:1, s:0.64, pos:[[0, 0, 0]]},
  morceaux:{n:8, s:0.32, pos:(function(){ var o = []; [-0.45, 0.45].forEach(function(x){ [-0.45, 0.45].forEach(function(y){ [-0.45, 0.45].forEach(function(z){ o.push([x, y, z]); }); }); }); return o; })()},
  poudre:{n:64, s:0.16, pos:(function(){ var o = [], g = [-0.69, -0.23, 0.23, 0.69]; g.forEach(function(x){ g.forEach(function(y){ g.forEach(function(z){ o.push([x, y, z]); }); }); }); return o; })()}
};
function clArea(m){ var d = CL_SOL[m]; return d.n * 6 * d.s * d.s; }
/* surface « offerte aux chocs » : cube élargi du rayon d'une molécule (faces + quarts de cylindre sur les arêtes + huitièmes de sphère aux coins) */
function clAreaEff(m){ var d = CL_SOL[m]; return d.n * (6 * d.s * d.s + 6 * PI * CL_R * d.s + 4 * PI * CL_R * CL_R); }

SFA.sim({
  id:"ch-collisions-3d", ch:"c07", tag:"Théorie des collisions",
  titre:"Les collisions efficaces en 3D : énergie et orientation",
  resume:"Des molécules A et B s'agitent dans une boîte 3D qu'on fait tourner. Seuls les chocs assez énergétiques et bien orientés font un éclair et donnent un produit. Température, concentrations, énergie d'activation et division d'un solide : un compteur suit les chocs efficaces par seconde.",
  but:"Regarde la boîte : une molécule A (bleue) n'a qu'un bout réactif (la sphère verte). Un choc A–B ne réagit que si l'énergie du choc dépasse E<sub>a</sub> <b>et</b> si le bout vert pointe vers B (éclair blanc). Choc assez fort mais mal orienté : étincelle orange. Glisse pour tourner la boîte. Monte la température, change les nombres de molécules, puis remplace B par un solide en bloc, en morceaux ou en poudre.",
  aRetenir:"Une réaction a lieu lors d'un <b>choc efficace</b> : énergie suffisante (≥ E<sub>a</sub>) et bonne orientation. Fraction des chocs assez énergétiques : e<sup>−Ea/RT</sup> ; elle augmente très vite avec T. Le facteur d'orientation p (ici 0,25) ne dépend pas de T. Le nombre de chocs par seconde est proportionnel à [A]·[B] : doubler une concentration double la vitesse. Avec un solide, seuls les chocs sur sa surface comptent : diviser le solide augmente la surface, donc la vitesse.",
  piege:"« Plus chaud, donc plus de chocs, donc plus rapide » : la hausse du nombre de chocs est faible (√T) ; ce qui explose, c'est la fraction des chocs qui dépassent E<sub>a</sub>. Et une poudre ne change ni E<sub>a</sub> ni la fraction efficace : elle multiplie seulement les chocs possibles. Les E<sub>a</sub> de l'animation sont petites (quelques kJ/mol) pour qu'on voie des réactions ; une vraie réaction a souvent 50 à 100 kJ/mol.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 390 : 420), g = k.canvas(phone ? 330 : 200);
    var st = {a:0.6, b:0.32, spin:true, drag:null, t:0, mol:[], prod:[], fl:[], ev:[], hist:[], n:0, ne:0, nf:0, t0:0, Tprev:300, rate:[]};
    var TS = k.slider("Température", 200, 800, 10, 300, "K", function(v){ var f = Math.sqrt(v / st.Tprev); st.mol.forEach(function(m){ m.v = [m.v[0] * f, m.v[1] * f, m.v[2] * f]; }); st.Tprev = v; resetCount(); });
    var ES = k.slider("Énergie d'activation Eₐ (réduite)", 1, 12, 0.5, 3, "kJ/mol", resetCount);
    var NA = k.slider("Molécules A dans la boîte", 4, 30, 1, 20, "", rebuild);
    var NB = k.slider("Molécules B dans la boîte (B dissous)", 4, 30, 1, 20, "", rebuild);
    var BS = k.seg("Réactif B", [["dissous", "dissous"], ["bloc", "solide en bloc"], ["morceaux", "en morceaux"], ["poudre", "en poudre"]], "dissous", rebuild);
    var spinT = k.toggle("Rotation automatique de la boîte", true);
    k.button("Remettre les compteurs à zéro", resetCount, true);
    var ro = k.readouts(["Chocs A–B par seconde", "Chocs efficaces par seconde", "Énergie suffisante : mesurée", "Énergie suffisante : e^(−Ea/RT)", "Efficaces : mesurée", "Efficaces : p·e^(−Ea/RT)"]);
    var nt = k.note("", "ok");
    k.note("Modèle : sphères dures de même masse, chocs élastiques, vitesses de Maxwell-Boltzmann à la température T. Énergie d'un choc = énergie cinétique selon la ligne des centres (½·μ·v², μ masse réduite) ; un choc la dépasse avec la probabilité e<sup>−Ea/RT</sup>. Orientation correcte si le bout réactif de A fait un angle ≤ 60° avec la direction de B : p = (1 − cos 60°)/2 = 0,25. Après une réaction, le produit s'en va et des réactifs neufs sont ajoutés (concentrations constantes) ; le solvant (non dessiné) échange sans cesse de l'énergie avec les molécules et garde la température constante. Le solide, à la température T, renvoie les molécules qui le heurtent avec une vitesse thermique ; il garde toujours le même volume (on néglige son usure). Mesures : chocs des 5 dernières secondes de l'animation.", "");
    function kT(){ return CL_KT300 * TS.value / 300; }
    function rv(){ return Math.random() * 2 - 1; }
    function solid(){ return BS.value !== "dissous" ? CL_SOL[BS.value] : null; }
    function inSolid(p, marg){
      var sd = solid(); if (!sd) return false;
      for (var i = 0; i < sd.n; i++){ var q = sd.pos[i], h = sd.s / 2 + marg; if (Math.abs(p[0] - q[0]) < h && Math.abs(p[1] - q[1]) < h && Math.abs(p[2] - q[2]) < h) return true; }
      return false;
    }
    function place(m){
      for (var tr = 0; tr < 200; tr++){
        var p = [rv() * 0.88, rv() * 0.88, rv() * 0.88], ok = !inSolid(p, CL_R * 1.2);
        for (var j = 0; ok && j < st.mol.length; j++){ var o = st.mol[j]; if (o !== m && o.on && Math.hypot(o.p[0] - p[0], o.p[1] - p[1], o.p[2] - p[2]) < 2.3 * CL_R) ok = false; }
        if (ok){ m.p = p; break; }
      }
      var s = Math.sqrt(kT());
      m.v = [cdGauss() * s, cdGauss() * s, cdGauss() * s];
      m.u = cdNorm([rv(), rv(), rv()]); m.ax = cdNorm([rv(), rv(), rv()]); m.w = 1 + Math.random() * 2; m.on = true;
    }
    function rebuild(){
      st.mol = []; st.prod = []; st.fl = [];
      var nb = solid() ? 0 : NB.value, i;
      for (i = 0; i < NA.value + nb; i++){ var m = {A:i < NA.value, p:[9, 9, 9]}; st.mol.push(m); place(m); }
      st.Tprev = TS.value; resetCount();
    }
    function resetCount(){ st.ev = []; st.hist = []; st.n = 0; st.ne = 0; st.nf = 0; st.t0 = st.t; st.rate = []; }
    rebuild();
    function collide(A, nAB, E, flashP, B){
      /* nAB : direction unitaire de A vers son partenaire */
      var Ea = ES.value * 1000, e0 = Ea / (CD_R * TS.value) * kT();
      var hot = E >= e0, good = A.u[0] * nAB[0] + A.u[1] * nAB[1] + A.u[2] * nAB[2] >= CL_COS, kind = hot ? (good ? 2 : 1) : 0;
      st.n++; if (hot) st.ne++; if (kind === 2) st.nf++;
      st.ev.push([st.t, kind]); if (st.hist.length < 4000) st.hist.push(E / kT() * CD_R * TS.value / 1000);
      if (kind) st.fl.push({p:flashP.slice(), t:0, kind:kind});
      if (kind === 2){
        A.on = false; if (B) B.on = false;
        var v = B ? [(A.v[0] + B.v[0]) / 2, (A.v[1] + B.v[1]) / 2, (A.v[2] + B.v[2]) / 2] : [-A.v[0] * 0.5, -A.v[1] * 0.5, -A.v[2] * 0.5];
        st.prod.push({p:flashP.slice(), v:v, life:1.6, A:A, B:B, u:A.u.slice(), ang:0});
      }
    }
    function step(h){
      var L = 1 - CL_R, sd = solid(), i, j, q;
      st.mol.forEach(function(m){
        if (!m.on) return;
        for (q = 0; q < 3; q++){ m.p[q] += m.v[q] * h; if (m.p[q] > L){ m.p[q] = 2 * L - m.p[q]; m.v[q] = -Math.abs(m.v[q]); } if (m.p[q] < -L){ m.p[q] = -2 * L - m.p[q]; m.v[q] = Math.abs(m.v[q]); } }
        if (m.A) m.u = cdNorm(cdRotAx(m.u, m.ax, m.w * h));
      });
      var M = st.mol, n = M.length;
      for (i = 0; i < n; i++){
        var a = M[i]; if (!a.on) continue;
        for (j = i + 1; j < n; j++){
          var b = M[j]; if (!b.on) continue;
          var dx = b.p[0] - a.p[0], dy = b.p[1] - a.p[1], dz = b.p[2] - a.p[2], d2 = dx * dx + dy * dy + dz * dz;
          if (d2 >= 4 * CL_R * CL_R || d2 < 1e-12) continue;
          var wx = b.v[0] - a.v[0], wy = b.v[1] - a.v[1], wz = b.v[2] - a.v[2], dw = dx * wx + dy * wy + dz * wz;
          if (dw >= 0) continue;
          /* on revient à l'instant exact du contact (sinon la ligne des centres est faussée et l'énergie du choc sous-estimée) */
          var ww = wx * wx + wy * wy + wz * wz, tau = Math.min(2 * h, (dw + Math.sqrt(Math.max(0, dw * dw - ww * (d2 - 4 * CL_R * CL_R)))) / ww);
          for (q = 0; q < 3; q++){ a.p[q] -= a.v[q] * tau; b.p[q] -= b.v[q] * tau; }
          var cx0 = b.p[0] - a.p[0], cy0 = b.p[1] - a.p[1], cz0 = b.p[2] - a.p[2], d = Math.hypot(cx0, cy0, cz0) || 1e-9, nx = cx0 / d, ny = cy0 / d, nz = cz0 / d;
          var vn = wx * nx + wy * ny + wz * nz;
          a.v[0] += vn * nx; a.v[1] += vn * ny; a.v[2] += vn * nz; b.v[0] -= vn * nx; b.v[1] -= vn * ny; b.v[2] -= vn * nz;
          for (q = 0; q < 3; q++){ a.p[q] += a.v[q] * tau; b.p[q] += b.v[q] * tau; }
          if (a.A !== b.A){
            var AA = a.A ? a : b, BB = a.A ? b : a, sg = a.A ? 1 : -1;
            collide(AA, [nx * sg, ny * sg, nz * sg], 0.25 * vn * vn, [(a.p[0] + b.p[0]) / 2, (a.p[1] + b.p[1]) / 2, (a.p[2] + b.p[2]) / 2], BB);
          }
        }
      }
      if (sd){
        M.forEach(function(m){
          if (!m.on || !m.A) return;
          for (var g2 = 0; g2 < sd.n; g2++){
            var c0 = sd.pos[g2], hs = sd.s / 2, qp = [0, 0, 0];
            for (var w = 0; w < 3; w++) qp[w] = Math.max(c0[w] - hs, Math.min(c0[w] + hs, m.p[w]));
            var ex = m.p[0] - qp[0], ey = m.p[1] - qp[1], ez = m.p[2] - qp[2], dd = Math.hypot(ex, ey, ez);
            if (dd >= CL_R || dd < 1e-9) continue;
            var nn = [ex / dd, ey / dd, ez / dd], vv = m.v[0] * nn[0] + m.v[1] * nn[1] + m.v[2] * nn[2];
            if (vv >= 0) continue;
            /* retour à l'instant du contact (dichotomie), pour que la normale au point touché soit la bonne (arêtes et coins) */
            var lo = 0, hi = 2 * h, it, pc = m.p.slice();
            for (it = 0; it < 14; it++){
              var mid = (lo + hi) / 2, pm = [m.p[0] - m.v[0] * mid, m.p[1] - m.v[1] * mid, m.p[2] - m.v[2] * mid], qm = [0, 0, 0];
              for (w = 0; w < 3; w++) qm[w] = Math.max(c0[w] - hs, Math.min(c0[w] + hs, pm[w]));
              if (Math.hypot(pm[0] - qm[0], pm[1] - qm[1], pm[2] - qm[2]) < CL_R) lo = mid; else hi = mid;
            }
            pc = [m.p[0] - m.v[0] * hi, m.p[1] - m.v[1] * hi, m.p[2] - m.v[2] * hi];
            for (w = 0; w < 3; w++) qp[w] = Math.max(c0[w] - hs, Math.min(c0[w] + hs, pc[w]));
            var fx = pc[0] - qp[0], fy = pc[1] - qp[1], fz = pc[2] - qp[2], fd = Math.hypot(fx, fy, fz) || 1e-9;
            nn = [fx / fd, fy / fd, fz / fd]; vv = m.v[0] * nn[0] + m.v[1] * nn[1] + m.v[2] * nn[2];
            if (vv >= 0){ vv = -1e-6; }
            var Ein = 0.5 * vv * vv;
            /* le cristal est à la température T : la molécule repart avec une vitesse thermique (réflexion diffuse) */
            var t1 = cdNorm(Math.abs(nn[0]) < 0.9 ? [0, -nn[2], nn[1]] : [-nn[2], 0, nn[0]]), t2 = [nn[1] * t1[2] - nn[2] * t1[1], nn[2] * t1[0] - nn[0] * t1[2], nn[0] * t1[1] - nn[1] * t1[0]];
            var sq = Math.sqrt(kT()), vnn = Math.sqrt(-2 * kT() * Math.log(Math.random() || 1e-9)), ga = cdGauss() * sq, gb = cdGauss() * sq;
            for (w = 0; w < 3; w++){ m.v[w] = nn[w] * vnn + t1[w] * ga + t2[w] * gb; m.p[w] = pc[w] + m.v[w] * hi; }
            collide(m, [-nn[0], -nn[1], -nn[2]], Ein, qp, null);
            if (!m.on) break;
          }
        });
      }
    }
    var geo = {};
    c.pointer(function(type, p){
      if (type === "down") st.drag = {lx:p.x, ly:p.y};
      if (type === "drag" && st.drag){ st.a += (p.x - st.drag.lx) * 0.012; st.b = Math.max(-1.3, Math.min(1.3, st.b + (p.y - st.drag.ly) * 0.012)); st.drag.lx = p.x; st.drag.ly = p.y; spinT.set(false); }
      if (type === "up") st.drag = null;
    });
    c.cv.style.cursor = "grab";
    var acc = 0;
    var lp = k.loop(function(dt){
      st.t += dt;
      for (var s2 = 0; s2 < 3; s2++) step(dt / 3);
      /* solvant thermostaté (thermostat d'Andersen) : chaque molécule reçoit en moyenne 1,5 fois par seconde une vitesse neuve tirée à la température T.
         Sans lui, les réactions emportent les molécules les plus rapides et la queue de la distribution s'appauvrit. */
      var pr = 1 - Math.exp(-1.5 * dt), sq = Math.sqrt(kT());
      st.mol.forEach(function(m){ if (m.on && Math.random() < pr) m.v = [cdGauss() * sq, cdGauss() * sq, cdGauss() * sq]; });
      st.prod = st.prod.filter(function(P){
        P.life -= dt; P.ang += dt * 4;
        for (var q = 0; q < 3; q++){ P.p[q] += P.v[q] * dt; if (Math.abs(P.p[q]) > 0.92){ P.v[q] = -P.v[q]; P.p[q] = Math.max(-0.92, Math.min(0.92, P.p[q])); } }
        if (P.life <= 0){ place(P.A); if (P.B) place(P.B); return false; }
        return true;
      });
      st.fl = st.fl.filter(function(f){ f.t += dt; return f.t < (f.kind === 2 ? 0.9 : 0.45); });
      while (st.ev.length && st.ev[0][0] < st.t - 5) st.ev.shift();
      acc += dt;
      if (acc >= 0.5){ acc = 0; var w5 = Math.min(5, st.t - st.t0), nf = 0; st.ev.forEach(function(e){ if (e[1] === 2) nf++; }); if (w5 > 0.4){ st.rate.push([st.t - st.t0, nf / w5]); if (st.rate.length > 120) st.rate.shift(); } }
      if (spinT.value && !st.drag) st.a += dt * 0.18;
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Tk = TS.value, Ea = ES.value, sd = solid();
      var benchY = H * 0.86;
      cdLab(ctx, 0, 0, W, H, benchY, true);
      S.draw.glow(c, W * 0.5, H * 0.08, W * 0.5, "#5b7bd6", 0.16);
      var cx = W * 0.5, cy = H * 0.47, bs = Math.min(W * 0.3, H * 0.33);
      function P3(p){ var r = cdRot(p, st.a, st.b), s = 1 / (1 - r[2] * 0.14); return {x:cx + r[0] * bs * s, y:cy - r[1] * bs * s, z:r[2], s:s}; }
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; cdEll(ctx, cx + 6, benchY + 4, bs * 1.45, bs * 0.15); ctx.fill(); ctx.restore();
      var V = [], i;
      for (i = 0; i < 8; i++) V.push(P3([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]));
      var F = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
      function face(f, front){
        var z = (V[f[0]].z + V[f[1]].z + V[f[2]].z + V[f[3]].z) / 4;
        if ((z >= 0) !== front) return;
        ctx.beginPath(); f.forEach(function(ix, j){ if (j) ctx.lineTo(V[ix].x, V[ix].y); else ctx.moveTo(V[ix].x, V[ix].y); }); ctx.closePath();
        ctx.fillStyle = front ? "rgba(190,215,255,.05)" : "rgba(120,150,210,.10)"; ctx.fill();
        ctx.strokeStyle = front ? "rgba(200,225,255,.6)" : "rgba(160,185,230,.28)"; ctx.lineWidth = front ? 1.5 : 1; ctx.stroke();
      }
      F.forEach(function(f){ face(f, false); });
      var rr = bs * CL_R, items = [];
      st.mol.forEach(function(m){
        if (!m.on) return;
        var P = P3(m.p);
        if (m.A){
          var tip = P3([m.p[0] + m.u[0] * CL_R * 0.95, m.p[1] + m.u[1] * CL_R * 0.95, m.p[2] + m.u[2] * CL_R * 0.95]);
          items.push({z:P.z, f:function(){
            if (tip.z < P.z) cdBall(ctx, tip.x, tip.y, rr * 0.62 * tip.s, "#5fd35a");
            cdBall(ctx, P.x, P.y, rr * P.s, "#2f6fd1");
            if (tip.z >= P.z) cdBall(ctx, tip.x, tip.y, rr * 0.62 * tip.s, "#5fd35a");
          }});
        } else items.push({z:P.z, f:function(){ cdBall(ctx, P.x, P.y, rr * P.s, "#d6453a"); }});
      });
      st.prod.forEach(function(Pd){
        var P = P3(Pd.p), al = Math.min(1, Pd.life / 0.5), d = [Math.cos(Pd.ang) * CL_R, 0, Math.sin(Pd.ang) * CL_R];
        var p1 = P3([Pd.p[0] + d[0], Pd.p[1], Pd.p[2] + d[2]]), p2 = P3([Pd.p[0] - d[0], Pd.p[1], Pd.p[2] - d[2]]);
        items.push({z:P.z, f:function(){ var o = [p1, p2].sort(function(x, y){ return x.z - y.z; }); o.forEach(function(q){ cdBall(ctx, q.x, q.y, rr * 0.95 * q.s, "#9b4fd6", al); }); }});
      });
      if (sd){
        sd.pos.forEach(function(q){
          var hs = sd.s / 2, cv = [], j;
          for (j = 0; j < 8; j++) cv.push(P3([q[0] + (j & 1 ? hs : -hs), q[1] + (j & 2 ? hs : -hs), q[2] + (j & 4 ? hs : -hs)]));
          var Pc = P3(q);
          items.push({z:Pc.z, f:function(){
            var faces = [[0, 1, 3, 2, [0, 0, -1]], [4, 5, 7, 6, [0, 0, 1]], [0, 1, 5, 4, [0, -1, 0]], [2, 3, 7, 6, [0, 1, 0]], [0, 2, 6, 4, [-1, 0, 0]], [1, 3, 7, 5, [1, 0, 0]]];
            faces.forEach(function(f){
              var nr = cdRot(f[4], st.a, st.b); if (nr[2] <= 0) return;
              var lit = 0.35 + 0.65 * Math.max(0, nr[2] * 0.6 + nr[1] * 0.5 - nr[0] * 0.2);
              ctx.beginPath(); for (var e = 0; e < 4; e++){ var v = cv[f[e]]; if (e) ctx.lineTo(v.x, v.y); else ctx.moveTo(v.x, v.y); } ctx.closePath();
              ctx.fillStyle = cdShade("#c0392b", Math.min(0.5, lit - 0.55)); ctx.fill();
              ctx.strokeStyle = "rgba(255,200,190,.35)"; ctx.lineWidth = 0.8; ctx.stroke();
            });
          }});
        });
      }
      st.fl.forEach(function(f){
        var P = P3(f.p), u = f.t / (f.kind === 2 ? 0.9 : 0.45);
        items.push({z:P.z + 0.01, f:function(){
          if (f.kind === 2){ S.draw.glow(c, P.x, P.y, rr * (3 + 6 * u) * P.s, "#fffbe0", 0.95 * (1 - u)); S.draw.glow(c, P.x, P.y, rr * 2 * P.s, "#ffffff", 0.9 * (1 - u)); }
          else S.draw.glow(c, P.x, P.y, rr * (1.5 + 3 * u) * P.s, "#ff9a3c", 0.8 * (1 - u));
        }});
      });
      items.sort(function(x, y){ return x.z - y.z; }).forEach(function(it){ it.f(); });
      F.forEach(function(f){ face(f, true); });
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(V[6].x + (V[4].x - V[6].x) * 0.15, V[6].y + (V[4].y - V[6].y) * 0.15); ctx.lineTo(V[6].x + (V[4].x - V[6].x) * 0.45, V[6].y + (V[4].y - V[6].y) * 0.45); ctx.stroke(); ctx.restore();
      /* thermomètre au mur */
      var thx = W - (phone ? 20 : 28), thy0 = phone ? 44 : 40, thy1 = benchY - 26, fr = (Tk - 200) / 600;
      ctx.fillStyle = "rgba(255,255,255,.85)"; cdRR(ctx, thx - 5, thy0, 10, thy1 - thy0, 5); ctx.fill();
      ctx.fillStyle = "#e74c3c"; cdRR(ctx, thx - 2.5, thy0 + 4 + (thy1 - thy0 - 8) * (1 - fr), 5, (thy1 - thy0 - 8) * fr + 4, 2.5); ctx.fill();
      cdBall(ctx, thx, thy1 + 6, 9, "#e74c3c");
      cdT(S, c, cdF(Tk, 0) + " K", thx, thy0 - 12, {size:cdFz(c, 11.5), color:"#ffd2c8", weight:800});
      /* légende */
      var fs = cdFz(c, 11), lx = 14, ly = H - (phone ? 76 : 80);
      ctx.save(); ctx.fillStyle = "rgba(10,15,28,.62)"; cdRR(ctx, lx - 8, ly - 12, phone ? 168 : 192, phone ? 72 : 74, 8); ctx.fill(); ctx.restore();
      cdBall(ctx, lx + 4, ly, 6, "#2f6fd1"); cdBall(ctx, lx + 10, ly - 3, 3.8, "#5fd35a");
      cdT(S, c, "A (bout réactif en vert)", lx + 20, ly, {size:fs, color:"#dbe6fb", align:"left", weight:700});
      if (sd){ ctx.fillStyle = "#b83226"; ctx.fillRect(lx - 1, ly + 12, 11, 11); } else cdBall(ctx, lx + 4, ly + 17, 6, "#d6453a");
      cdT(S, c, sd ? "B solide (cristaux)" : "B dissous", lx + 20, ly + 17, {size:fs, color:"#ffd0c8", align:"left", weight:700});
      S.draw.glow(c, lx + 4, ly + 34, 9, "#fffbe0", 0.9);
      cdT(S, c, "choc efficace → produit", lx + 20, ly + 34, {size:fs, color:"#fff4c2", align:"left", weight:700});
      S.draw.glow(c, lx + 4, ly + 51, 8, "#ff9a3c", 0.9);
      cdT(S, c, "assez fort, mal orienté", lx + 20, ly + 51, {size:fs, color:"#ffc896", align:"left", weight:700});
      /* compteur */
      var w5 = Math.max(0.001, Math.min(5, st.t - st.t0)), nc = 0, ne = 0, nf = 0;
      st.ev.forEach(function(e){ nc++; if (e[1] >= 1) ne++; if (e[1] === 2) nf++; });
      var rc = nc / w5, rf = nf / w5;
      S.draw.display(c, cdF(rf, 1), phone ? 54 : 64, phone ? 34 : 38, {w:phone ? 88 : 104, h:phone ? 46 : 52, caption:"chocs efficaces / s", color:"#13233a"});
      cdT(S, c, cdF(rc, 1) + " chocs A–B / s", phone ? 106 : 126, phone ? 24 : 26, {size:cdFz(c, 12), color:"#ffffff", align:"left", weight:800});
      cdT(S, c, sd ? "surface du solide ×" + cdF(clArea(BS.value) / clArea("bloc"), 0) + " (même volume)" : "N(A) = " + NA.value + "   N(B) = " + NB.value, phone ? 106 : 126, phone ? 42 : 46, {size:cdFz(c, 11), color:"#c7d3ea", align:"left", weight:700});
      cdT(S, c, phone ? "glisse pour tourner" : "glisse pour tourner la boîte", W - (phone ? 40 : 52), H - 16, {size:cdFz(c, 10.5), color:"rgba(199,211,234,.8)", align:"right", weight:600});

      /* ---------- graphes ---------- */
      g.clear();
      var gc = g.ctx, GW = g.W, GH = g.H, RT = CD_R * Tk / 1000;
      gc.fillStyle = "#ffffff"; gc.fillRect(0, 0, GW, GH);
      var emax = Math.max(4 * RT, Ea * 1.6), nb = 24, bw = emax / nb, cnt = [], tot = st.hist.length;
      for (i = 0; i < nb; i++) cnt.push(0);
      st.hist.forEach(function(e){ var b = Math.floor(e / bw); if (b < nb) cnt[b]++; });
      var dens = cnt.map(function(n0){ return tot ? n0 / tot / bw : 0; }), ymax = 1.15 / RT;
      dens.forEach(function(d){ ymax = Math.max(ymax, d * 1.05); });
      var a1 = phone ? S.draw.axes(g, {x0:0, x1:emax, y0:0, y1:ymax, l:40, r:12, t:20, b:GH / 2 + 24, yl:"part des chocs (" + tot + " chocs)"})
                     : S.draw.axes(g, {x0:0, x1:emax, y0:0, y1:ymax, l:40, r:GW / 2 + 10, t:20, b:34, yl:"part des chocs (" + tot + " chocs)"});
      cdT(S, g, "énergie du choc (kJ/mol)", a1.R, a1.B + 22, {size:10.5, color:"#2c3a4e", align:"right", weight:700});
      for (i = 0; i < nb; i++){
        var x0 = a1.X(i * bw), x1 = a1.X((i + 1) * bw), y = a1.Y(dens[i]), hot = (i + 0.5) * bw >= Ea;
        gc.fillStyle = hot ? "rgba(224,122,31,.75)" : "rgba(47,111,209,.45)"; gc.fillRect(x0 + 0.5, y, x1 - x0 - 1, a1.B - y);
      }
      S.draw.fn(g, a1, function(e){ return Math.exp(-e / RT) / RT; }, "#13233a", 1.6, [4, 3]);
      S.draw.line(g, a1.X(Ea), a1.T + 16, a1.X(Ea), a1.B, "#c0392b", 2);
      cdT(S, g, "Eₐ", a1.X(Ea) + 4, a1.T + (a1.B - a1.T) * 0.42, {size:cdFz(g, 11.5), color:"#c0392b", align:"left", weight:800, halo:true});
      cdT(S, g, "e^(−Eₐ/RT) = " + cdS(Math.exp(-Ea / RT), 3), a1.R - 2, a1.T + 26, {size:cdFz(g, 10.5), color:"#a2510f", align:"right", weight:800, halo:true});
      var rmax = 2; st.rate.forEach(function(r){ rmax = Math.max(rmax, r[1] * 1.2); });
      var tm = Math.max(20, st.rate.length ? st.rate[st.rate.length - 1][0] : 0), tz = Math.max(0, tm - 60);
      var a2 = phone ? S.draw.axes(g, {x0:tz, x1:tm, y0:0, y1:rmax, l:40, r:12, t:GH / 2 + 22, b:30, yl:"chocs efficaces / s"})
                     : S.draw.axes(g, {x0:tz, x1:tm, y0:0, y1:rmax, l:GW / 2 + 36, r:12, t:20, b:34, yl:"chocs efficaces / s"});
      cdT(S, g, "t depuis la remise à zéro (s)", a2.R, a2.B + 22, {size:10.5, color:"#2c3a4e", align:"right", weight:700});
      gc.save(); gc.strokeStyle = "#e07a1f"; gc.lineWidth = 2.2; gc.lineJoin = "round"; gc.beginPath();
      st.rate.forEach(function(r, j){ if (r[0] < tz) return; var X = a2.X(r[0]), Y = a2.Y(r[1]); if (j && st.rate[j - 1][0] >= tz) gc.lineTo(X, Y); else gc.moveTo(X, Y); });
      gc.stroke(); gc.restore();

      /* ---------- afficheurs ---------- */
      var fE = Math.exp(-Ea / RT);
      ro.set(0, cdF(rc, 1) + " /s");
      ro.set(1, cdF(rf, 2) + " /s");
      ro.set(2, st.n ? cdF(100 * st.ne / st.n, 1) + " %" : "—");
      ro.set(3, cdF(100 * fE, 1) + " %");
      ro.set(4, st.n ? cdF(100 * st.nf / st.n, 1) + " %" : "—");
      ro.set(5, cdF(100 * CL_P * fE, 2) + " %");
      var Rr = function(T2){ return Math.exp(-Ea / (CD_R * T2 / 1000)); };
      var msg = "À " + cdF(Tk, 0) + " K, RT = " + cdF(RT, 2) + " kJ/mol : " + cdF(100 * fE, 1) + " % des chocs dépassent Eₐ = " + cdF(Ea, 1) + " kJ/mol. À +100 K, cette fraction serait multipliée par " + cdF(Rr(Tk + 100) / fE, 2) + ", alors que le nombre de chocs ne serait multiplié que par √((T+100)/T) = " + cdF(Math.sqrt((Tk + 100) / Tk), 2) + "." + (sd ? " Solide : surface des cristaux ×" + cdF(clArea(BS.value) / clArea("bloc"), 0) + " par rapport au bloc, pour le même volume (" + sd.n + " cube" + (sd.n > 1 ? "s" : "") + " de côté " + cdF(sd.s, 2) + " au lieu d'un cube de côté 0,64). Les chocs augmentent encore plus vite : une molécule a une taille et touche aussi les arêtes et les coins ; la surface offerte aux chocs (cube élargi du rayon d'une molécule) est ×" + cdF(clAreaEff(BS.value) / clAreaEff("bloc"), 1) + "." : "");
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   3. Enzyme et substrat : le site actif en 3D (c07)
   ===================================================================== */
var EZ_KCAT = 0.8, EZ_KM = 2, EZ_KI = 1, EZ_KOFFI = 0.5;   /* cycles/s (animation ralentie) ; mmol/L ; mmol/L ; s⁻¹ */
var EZ_KON = EZ_KCAT / EZ_KM, EZ_KONI = EZ_KOFFI / EZ_KI;   /* L·mmol⁻¹·s⁻¹ (on néglige la dissociation de ES) */
function ezCross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function ezDot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function ezAdd(a, b, s){ return [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]; }
/* formes des molécules, dans le repère de la poche : (p le long de l'axe de la poche, q, r) */
var EZ_SHAPES = {
  S:{atoms:[[0, 0, 0, "#4a5568", 0.16], [-0.17, 0.29, 0, "#d6392f", 0.15], [-0.17, -0.29, 0, "#d6392f", 0.15]], nom:"substrat S"},
  I:{atoms:[[0, 0, 0, "#7b3fb0", 0.16], [-0.17, 0.29, 0, "#d6392f", 0.15], [-0.17, -0.29, 0, "#d6392f", 0.15]], nom:"inhibiteur I"},
  R:{atoms:[[0, -0.48, 0, "#6f9a5b", 0.15], [0, -0.16, 0, "#6f9a5b", 0.15], [0, 0.16, 0, "#6f9a5b", 0.15], [0, 0.48, 0, "#6f9a5b", 0.15]], nom:"autre molécule"},
  T:{atoms:[[0, 0, 0, "#9c7448", 0.19], [0.19, 0.19, 0.19, "#c49a62", 0.17], [0.19, -0.19, -0.19, "#c49a62", 0.17], [-0.19, 0.19, -0.19, "#c49a62", 0.17], [-0.19, -0.19, 0.19, "#c49a62", 0.17]], nom:"autre molécule"},
  P1:{atoms:[[0, 0, 0, "#2e8b57", 0.16], [-0.17, 0.29, 0, "#7ed37e", 0.15]]},
  P2:{atoms:[[-0.17, -0.29, 0, "#7ed37e", 0.15]]}
};
function ezBuild(){
  var seed = 11; function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var P = cdNorm([0.2, 0.25, 0.95]), Q = cdNorm(ezCross([0, 1, 0], P)), Rv = ezCross(P, Q), C = [P[0] * 0.55, P[1] * 0.55, P[2] * 0.55];
  function loc(p, q, r){ return [C[0] + P[0] * p + Q[0] * q + Rv[0] * r, C[1] + P[1] * p + Q[1] * q + Rv[1] * r, C[2] + P[2] * p + Q[2] * q + Rv[2] * r]; }
  var at = [], N = 320, i, pal = ["#8fb3de", "#8fb3de", "#a3c2e6", "#b7a6dd", "#9fd1c2"];
  var sub = EZ_SHAPES.S.atoms.map(function(a){ return loc(a[0], a[1], a[2]); });
  var chg = [loc(-0.3, 0.52, 0), loc(-0.3, -0.52, 0)];
  for (i = 0; i < N; i++){
    var y = 1 - 2 * (i + 0.5) / N, rr = Math.sqrt(1 - y * y), ph = i * 2.39996323, n = [Math.cos(ph) * rr, y, Math.sin(ph) * rr];
    var d = ezDot(n, P); if (d > 0.77) continue;
    var bump = 1 + 0.045 * Math.sin(5 * n[0] + 2) * Math.cos(4 * n[1] - 1) + 0.03 * Math.sin(7 * n[2]);
    var patch = Math.sin(3.1 * n[0] + 1.3 * n[2]) + Math.cos(2.7 * n[1] - 1.9 * n[0]);
    var col = patch > 1.1 ? pal[3] : patch < -1.2 ? pal[4] : pal[(i * 7) % 3];
    at.push({p:[n[0] * bump, n[1] * bump, n[2] * bump], r:0.165 + rnd() * 0.03, c:col, rim:d > 0.62 ? (d - 0.62) / 0.15 : 0});
  }
  for (i = 0; i < 14; i++){
    var a = i / 14 * 2 * PI, q = Math.cos(a) * 0.6, r = Math.sin(a) * 0.6;
    at.push({p:[P[0] * 0.76 + Q[0] * q + Rv[0] * r, P[1] * 0.76 + Q[1] * q + Rv[1] * r, P[2] * 0.76 + Q[2] * q + Rv[2] * r], r:0.16, c:i % 3 ? "#8fb3de" : "#a3c2e6", rim:1});
  }
  for (i = 0; i < 130; i++){
    var y2 = 1 - 2 * (i + 0.5) / 130, r2 = Math.sqrt(1 - y2 * y2), p2 = i * 2.39996323, dir = [Math.cos(p2) * r2, y2, Math.sin(p2) * r2];
        /* direction exprimée dans le repère (P, Q, Rv) */
    var w = [P[0] * dir[0] + Q[0] * dir[1] + Rv[0] * dir[2], P[1] * dir[0] + Q[1] * dir[1] + Rv[1] * dir[2], P[2] * dir[0] + Q[2] * dir[1] + Rv[2] * dir[2]];
    if (dir[0] > 0.3) continue;
    var pos = [C[0] + w[0] * 0.55, C[1] + w[1] * 0.55, C[2] + w[2] * 0.55], ok = true;
    sub.concat(chg).forEach(function(s2){ if (Math.hypot(pos[0] - s2[0], pos[1] - s2[1], pos[2] - s2[2]) < 0.3) ok = false; });
    if (ok) at.push({p:pos, r:0.15, c:(i % 4) ? "#f2c14e" : "#e3a23b", rim:0, lin:true});
  }
  chg.forEach(function(p3){ at.push({p:p3, r:0.15, c:"#2f62d6", rim:0, lin:true, plus:true}); });
  return {at:at, P:P, Q:Q, Rv:Rv, C:C};
}

SFA.sim({
  id:"ch-enzyme-site-actif", ch:"c07", tag:"Enzymes",
  titre:"Enzyme et substrat : le site actif en 3D",
  resume:"Une enzyme en 3D avec sa poche, au milieu de molécules qui flottent : seule la forme complémentaire s'y loge, la poche se referme (ajustement induit), puis le produit repart. On augmente [S] jusqu'à la saturation et on ajoute un inhibiteur compétitif qui occupe la poche.",
  but:"Regarde la poche jaune de l'enzyme : seul le substrat en V (bouts rouges chargés −, en face des deux résidus bleus + de la poche) s'y loge. La poche se referme, une étincelle, et deux produits verts repartent. Attrape une molécule à la souris et lâche-la devant la poche pour tester sa forme ; glisse à côté pour tourner l'enzyme. Augmente [S] : la poche est occupée de plus en plus souvent, jusqu'à la saturation. Ajoute un inhibiteur compétitif.",
  aRetenir:"L'enzyme est <b>sélective</b> : le site actif a une forme et des charges complémentaires de celles du substrat, et il se referme autour de lui (<b>ajustement induit</b>). La vitesse suit Michaelis-Menten : v = V<sub>max</sub>·[S]/(K<sub>M</sub> + [S]) ; v/V<sub>max</sub> est la fraction du temps où la poche est occupée par S. À forte [S], la poche est presque toujours pleine : v → V<sub>max</sub> (saturation, ordre 0). Un <b>inhibiteur compétitif</b> occupe la poche sans réagir : K<sub>M</sub> apparent = K<sub>M</sub>·(1 + [I]/K<sub>I</sub>), V<sub>max</sub> inchangée.",
  piege:"« Plus de substrat, toujours plus vite » : non, une seule poche ne traite qu'une molécule à la fois ; au-delà de quelques K<sub>M</sub>, ajouter du substrat ne sert presque plus à rien. Un inhibiteur compétitif ne baisse pas V<sub>max</sub> : à très forte [S], le substrat gagne la compétition pour la poche. Et l'enzyme n'est pas consommée : elle recommence.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 420 : 440), g = k.canvas(phone ? 220 : 190);
    var EZ = ezBuild();
    var st = {a:0, b:0.2, auto:true, t:0, mol:[], prod:[], state:"E", next:null, dock:null, close:0, flash:0, meas:{t:0, tES:0, n:0}, msg:null, grab:null, view:null, trial:3, seed:5};
    var SS = k.slider("Concentration en substrat [S]", 0.2, 20, 0.2, 2, "mmol/L", changed);
    var IS = k.slider("Inhibiteur compétitif [I] (K<sub>I</sub> = 1 mmol/L)", 0, 5, 0.25, 0, "mmol/L", changed);
    var autoT = k.toggle("Mouvement automatique de l'enzyme", true);
    k.button("Remettre la mesure à zéro", function(){ resetMeas(); }, true);
    var ro = k.readouts(["[S] / K<sub>M</sub>", "v / V<sub>max</sub> (théorie)", "K<sub>M</sub> apparent", "v théorique (cycles/s)", "v mesurée (cycles/s)", "Poche occupée par S (mesuré)"]);
    var nt = k.note("", "ok");
    k.note("Modèle : une seule enzyme, réactions au hasard. E + S → ES avec la constante k₁ = k<sub>cat</sub>/K<sub>M</sub> (on néglige le retour ES → E + S), ES → E + P avec k<sub>cat</sub> = 0,8 /s ; E + I ⇄ EI avec K<sub>I</sub> = 1 mmol/L. K<sub>M</sub> = 2 mmol/L. Animation très ralentie : une vraie enzyme fait de moins de 1 à environ 10⁷ cycles par seconde. Le nombre de molécules dessinées augmente avec la concentration, sans lui être proportionnel. Mesures : depuis le dernier réglage.", "");
    function rnd(){ return Math.random(); }
    function expo(rate){ return rate > 0 ? -Math.log(1 - rnd() * 0.999999) / rate : Infinity; }
    function resetMeas(){ st.meas = {t:0, tES:0, n:0}; }
    function nWanted(kind){ if (kind === "S") return Math.max(1, Math.min(14, Math.round(3 * Math.sqrt(SS.value)))); if (kind === "I") return IS.value > 0 ? Math.max(1, Math.round(3 * Math.sqrt(IS.value))) : 0; return 2; }
    function newMol(kind){
      var th = rnd() * 2 * PI, ph = (rnd() - 0.5) * 1.6, rad = 1.55 + rnd() * 0.55;
      var f1 = cdNorm([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), f2 = cdNorm(ezCross(f1, [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]));
      return {k:kind, p:[Math.cos(th) * rad * 1.1, Math.sin(th) * rad * 0.85, (rnd() - 0.5) * 1.4], f1:f1, f2:f2, ax:cdNorm([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), w:0.6 + rnd() * 1.2, ph:rnd() * 6.3, busy:false, v:[0, 0, 0]};
    }
    function syncMols(){
      ["S", "I", "R", "T"].forEach(function(kind){
        var want = kind === "R" || kind === "T" ? 1 : nWanted(kind), have = st.mol.filter(function(m){ return m.k === kind; });
        for (var i = have.length; i < want; i++) st.mol.push(newMol(kind));
        for (var j = have.length - 1; j >= want; j--){ var m = have[j]; if (!m.busy) st.mol.splice(st.mol.indexOf(m), 1); }
      });
    }
    function cancelApproach(){ if (st.dock && st.dock.phase === "in"){ st.dock.m.busy = false; st.dock = null; } }
    function drawNext(){
      var tS = expo(EZ_KON * SS.value), tI = expo(EZ_KONI * IS.value);
      st.next = tS <= tI ? {t:st.t + tS, kind:"S"} : {t:st.t + tI, kind:"I"};
    }
    function changed(){ syncMols(); resetMeas(); if (st.state === "E"){ cancelApproach(); drawNext(); } }
    function enter(state){
      st.state = state;
      if (state === "E") drawNext();
      else st.next = {t:st.t + expo(state === "ES" ? EZ_KCAT : EZ_KOFFI), kind:state};
    }
    syncMols(); enter("E");
    /* --- géométrie de l'écran --- */
    var geo = {};
    function view(p){ return cdRot(p, st.a, st.b); }
    function pocketFrame(){ return {P:view(EZ.P), Q:view(EZ.Q), R:view(EZ.Rv), C:view(EZ.C)}; }
    function scr(p){ var s = 1 / (1 - p[2] * 0.12); return {x:geo.cx + p[0] * geo.R * s, y:geo.cy - p[1] * geo.R * s, z:p[2], s:s}; }
    function molAtoms(m, fr){
      /* positions (espace de la caméra) des atomes de la molécule m ; fr : repère imposé (posée dans la poche) */
      var sh = EZ_SHAPES[m.k].atoms, o = fr ? fr.o : m.p, e1 = fr ? fr.e1 : m.f1, e2 = fr ? fr.e2 : m.f2, e3 = ezCross(e1, e2);
      return sh.map(function(a){ return {p:[o[0] + e1[0] * a[0] + e2[0] * a[1] + e3[0] * a[2], o[1] + e1[1] * a[0] + e2[1] * a[1] + e3[1] * a[2], o[2] + e1[2] * a[0] + e2[2] * a[1] + e3[2] * a[2]], c:a[3], r:a[4]}; });
    }
    function lerpFrame(m, pf, u, o){
      var e1 = cdNorm([m.f1[0] + (pf.P[0] - m.f1[0]) * u, m.f1[1] + (pf.P[1] - m.f1[1]) * u, m.f1[2] + (pf.P[2] - m.f1[2]) * u]);
      var e2 = [m.f2[0] + (pf.Q[0] - m.f2[0]) * u, m.f2[1] + (pf.Q[1] - m.f2[1]) * u, m.f2[2] + (pf.Q[2] - m.f2[2]) * u], d = ezDot(e2, e1);
      e2 = cdNorm([e2[0] - e1[0] * d, e2[1] - e1[1] * d, e2[2] - e1[2] * d]);
      return {o:o, e1:e1, e2:e2};
    }
    function say(t, col){ st.msg = {t:t, c:col || "#ffffff", life:2.8}; }
    function nearestMol(p){
      var best = null, bd = phone ? 30 : 24;
      st.mol.forEach(function(m){ if (m.busy) return; var q = scr(m.p), d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd){ bd = d; best = m; } });
      return best;
    }
    c.pointer(function(type, p){
      if (type === "down"){
        var m = nearestMol(p);
        if (m){ st.grab = {m:m, lx:p.x, ly:p.y}; m.busy = true; }
        else st.view = {lx:p.x, ly:p.y};
      }
      if (type === "move") c.cv.style.cursor = nearestMol(p) ? "grab" : "default";
      if (type === "drag"){
        if (st.grab){ var m2 = st.grab.m, s = 1 / (1 - m2.p[2] * 0.12); m2.p[0] += (p.x - st.grab.lx) / (geo.R * s); m2.p[1] -= (p.y - st.grab.ly) / (geo.R * s); st.grab.lx = p.x; st.grab.ly = p.y; }
        if (st.view){ st.a += (p.x - st.view.lx) * 0.01; st.b = Math.max(-1.2, Math.min(1.2, st.b + (p.y - st.view.ly) * 0.01)); st.view.lx = p.x; st.view.ly = p.y; autoT.set(false); }
      }
      if (type === "up"){
        if (st.grab){
          var mg = st.grab.m, pf = pocketFrame(), mouth = scr([pf.P[0] * 1.35, pf.P[1] * 1.35, pf.P[2] * 1.35]), q = scr(mg.p);
          mg.busy = false;
          if (Math.hypot(q.x - mouth.x, q.y - mouth.y) < (phone ? 60 : 55) && pf.P[2] > -0.2){
            if (mg.k === "R" || mg.k === "T"){ say("Mauvaise forme : cette molécule ne rentre pas dans la poche.", "#ffb3a6"); mg.v = [pf.P[0] * 1.4, pf.P[1] * 1.4, pf.P[2] * 1.4]; }
            else if (st.state !== "E" || st.dock){ say("La poche est déjà occupée : attends qu'elle se libère.", "#ffe39a"); mg.v = [pf.P[0], pf.P[1], pf.P[2]]; }
            else {
              mg.busy = true; st.dock = {m:mg, phase:"in", t0:st.t, t1:st.t + 0.35, from:mg.p.slice(), f1:mg.f1.slice(), f2:mg.f2.slice()};
              enter(mg.k === "S" ? "ES" : "EI"); resetMeas();
              say(mg.k === "S" ? "Forme complémentaire : le substrat se loge et la poche se referme." : "L'inhibiteur a la bonne forme : il bloque la poche, sans réagir.", mg.k === "S" ? "#b8f5c8" : "#e3c8ff");
            }
          }
          st.grab = null;
        }
        st.view = null;
      }
    });
    function startApproach(kind, tEvent){
      var cand = st.mol.filter(function(m){ return m.k === kind && !m.busy; });
      if (!cand.length){ st.mol.push(newMol(kind)); cand = [st.mol[st.mol.length - 1]]; }
      var pf = pocketFrame(), best = cand[0], bd = 1e9;
      cand.forEach(function(m){ var d = Math.hypot(m.p[0] - pf.P[0] * 1.5, m.p[1] - pf.P[1] * 1.5, m.p[2] - pf.P[2] * 1.5); if (d < bd){ bd = d; best = m; } });
      best.busy = true;
      st.dock = {m:best, phase:"in", t0:st.t, t1:tEvent, from:best.p.slice(), f1:best.f1.slice(), f2:best.f2.slice()};
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (autoT.value && !st.view){ st.a = 0.38 * Math.sin(st.t * 0.22); st.b = 0.1 + 0.12 * Math.sin(st.t * 0.15); }
      /* mesure */
      st.meas.t += dt; if (st.state === "ES") st.meas.tES += dt;
      /* événements de la cinétique */
      if (st.state === "E" && st.next && !st.dock && st.next.t - st.t < 0.7) startApproach(st.next.kind, st.next.t);
      if (st.next && st.t >= st.next.t){
        if (st.state === "E"){
          if (st.dock && st.dock.phase === "try"){ var dq = st.dock.m, pq = pocketFrame(); dq.busy = false; dq.p = [pq.P[0] * 1.55, pq.P[1] * 1.55, pq.P[2] * 1.55]; dq.v = [pq.P[0], pq.P[1], pq.P[2]]; st.dock = null; }
          if (!st.dock) startApproach(st.next.kind, st.t + 0.25);
          enter(st.next.kind === "S" ? "ES" : "EI");
        }
        else if (st.state === "ES"){
          st.meas.n++; st.flash = 1;
          var pf = pocketFrame();
          if (st.dock){ var m = st.dock.m; st.mol.splice(st.mol.indexOf(m), 1); st.dock = null; }
          ["P1", "P2"].forEach(function(kk, j){ st.prod.push({k:kk, p:pf.C.slice(), f1:pf.P.slice(), f2:pf.Q.slice(), v:[pf.P[0] * 0.9 + pf.Q[0] * (j ? -0.5 : 0.5), pf.P[1] * 0.9 + pf.Q[1] * (j ? -0.5 : 0.5), pf.P[2] * 0.9 + pf.Q[2] * (j ? -0.5 : 0.5)], ax:cdNorm([rnd(), rnd(), rnd()]), life:2.6}); });
          syncMols(); enter("E");
        } else if (st.state === "EI"){
          var pf2 = pocketFrame();
          if (st.dock){ var mi = st.dock.m; mi.busy = false; mi.p = [pf2.P[0] * 1.3, pf2.P[1] * 1.3, pf2.P[2] * 1.3]; mi.f1 = pf2.P.slice(); mi.f2 = pf2.Q.slice(); mi.v = [pf2.P[0] * 0.8, pf2.P[1] * 0.8, pf2.P[2] * 0.8]; st.dock = null; }
          syncMols(); enter("E");
        }
      }
      st.close += ((st.state !== "E" && (!st.dock || st.t >= st.dock.t1) ? 1 : 0) - st.close) * Math.min(1, dt * 5);
      st.flash = Math.max(0, st.flash - dt * 1.6);
      /* molécules libres : dérive brownienne, culbutes, rappel dans la zone visible */
      st.mol.forEach(function(m){
        if (m.busy) return;
        m.ph += dt;
        for (var q = 0; q < 3; q++){ m.v[q] = m.v[q] * Math.exp(-dt * 1.5) + (rnd() - 0.5) * dt * 1.2; }
        var lim = [phone ? 1.6 : 2.1, phone ? 1.85 : 1.65, 0.9];
        for (q = 0; q < 3; q++){ if (Math.abs(m.p[q]) > lim[q]) m.v[q] -= Math.sign(m.p[q]) * dt * 1.5; }
        /* on les garde hors du disque de l'enzyme vu de face, pour qu'elles restent visibles */
        var r = Math.hypot(m.p[0], m.p[1]) || 1e-3;
        if (r < 1.5){ var u = 1.5 - r; m.v[0] += m.p[0] / r * u * dt * 12; m.v[1] += m.p[1] / r * u * dt * 12; }
        m.p = ezAdd(m.p, m.v, dt);
        m.f1 = cdNorm(cdRotAx(m.f1, m.ax, m.w * dt)); m.f2 = cdNorm(cdRotAx(m.f2, m.ax, m.w * dt));
      });
      /* tentative d'une molécule de mauvaise forme (pour le spectacle) */
      st.trial -= dt;
      if (st.trial <= 0 && !st.dock && st.state === "E" && st.next && st.next.t - st.t > 1.6){
        var dec = st.mol.filter(function(m){ return (m.k === "R" || m.k === "T") && !m.busy; });
        if (dec.length){ var dm = dec[Math.floor(rnd() * dec.length)], pf3 = pocketFrame(); dm.busy = true; st.dock = {m:dm, phase:"try", t0:st.t, t1:st.t + 1.4, from:dm.p.slice(), f1:dm.f1.slice(), f2:dm.f2.slice()}; }
        st.trial = 5 + rnd() * 3;
      }
      if (st.dock && st.dock.phase === "try" && st.t >= st.dock.t1){ var dm2 = st.dock.m, pf4 = pocketFrame(); dm2.busy = false; dm2.p = [pf4.P[0] * 1.55, pf4.P[1] * 1.55, pf4.P[2] * 1.55]; dm2.v = [pf4.P[0] * 1.2, pf4.P[1] * 1.2, pf4.P[2] * 1.2]; st.dock = null; }
      st.prod = st.prod.filter(function(P){ P.life -= dt; P.p = ezAdd(P.p, P.v, dt); P.v = [P.v[0] * Math.exp(-dt * 0.8), P.v[1] * Math.exp(-dt * 0.8), P.v[2] * Math.exp(-dt * 0.8)]; P.f1 = cdNorm(cdRotAx(P.f1, P.ax, dt * 2)); P.f2 = cdNorm(cdRotAx(P.f2, P.ax, dt * 2)); return P.life > 0; });
      if (st.msg){ st.msg.life -= dt; if (st.msg.life <= 0) st.msg = null; }
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Sv = SS.value, Iv = IS.value;
      geo.cx = W * (phone ? 0.47 : 0.43); geo.cy = H * (phone ? 0.47 : 0.5); geo.R = Math.min(W * (phone ? 0.24 : 0.19), H * 0.26);
      /* --- décor : intérieur d'une cellule --- */
      var bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#1d4a5c"); bg.addColorStop(0.6, "#12303f"); bg.addColorStop(1, "#0a1a24");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* membrane (bicouche) en bas à gauche, mitochondrie floue en haut à droite */
      ctx.save(); ctx.globalAlpha = 0.5;
      for (var j = 0; j < 46; j++){
        var ang = PI * 0.52 + j * 0.022, rx = W * 0.95, cx0 = -W * 0.35, cy0 = H * 1.55;
        var x1 = cx0 + Math.cos(ang) * rx, y1 = cy0 - Math.sin(ang) * rx * 0.62;
        cdBall(ctx, x1, y1, 5, "#6aa2b8"); cdBall(ctx, cx0 + Math.cos(ang) * (rx + 26), cy0 - Math.sin(ang) * (rx + 26) * 0.62, 5, "#6aa2b8");
      }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = "#c98a5a"; cdEll(ctx, W * 0.9, H * 0.13, W * 0.16, H * 0.08); ctx.fill();
      ctx.strokeStyle = "#f0c49c"; ctx.lineWidth = 3; ctx.beginPath(); for (var z0 = 0; z0 < 5; z0++){ ctx.moveTo(W * 0.78 + z0 * W * 0.05, H * 0.08); ctx.quadraticCurveTo(W * 0.8 + z0 * W * 0.05, H * 0.15, W * 0.78 + z0 * W * 0.05, H * 0.19); } ctx.stroke(); ctx.restore();
      for (var d0 = 0; d0 < 40; d0++){ var xx = (d0 * 97.13 + st.t * 6 * (d0 % 3 + 1)) % W, yy = (d0 * 53.7 + Math.sin(st.t * 0.5 + d0) * 8) % H; ctx.fillStyle = "rgba(180,230,255," + (0.06 + (d0 % 4) * 0.03) + ")"; ctx.beginPath(); ctx.arc(xx, yy, 1.5 + d0 % 3, 0, 7); ctx.fill(); }
      /* --- enzyme --- */
      var pf = pocketFrame(), items = [], cl = st.close;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.28)"; cdEll(ctx, geo.cx + 8, geo.cy + geo.R * 1.25, geo.R * 1.1, geo.R * 0.18); ctx.fill(); ctx.restore();
      S.draw.glow(c, geo.cx, geo.cy, geo.R * 1.7, "#8fd3ff", 0.12);
      EZ.at.forEach(function(a){
        var p0 = a.p;
        if (a.rim && cl > 0.01){
          var d = ezDot(p0, EZ.P), perp = [p0[0] - EZ.P[0] * d, p0[1] - EZ.P[1] * d, p0[2] - EZ.P[2] * d], pl = Math.hypot(perp[0], perp[1], perp[2]) || 1;
          p0 = ezAdd(p0, perp, -cl * 0.14 * a.rim / pl);
        }
        var v = view(p0); if (v[2] < -0.5) return;
        var q = scr(v), depth = (v[2] + 1) / 2;
        items.push({z:v[2], f:function(){ cdBall(ctx, q.x, q.y, a.r * geo.R * q.s, depth < 0.45 && !a.lin ? cdShadeHex(a.c, -0.25) : a.c); if (a.plus && v[2] > 0.2) cdT(S, c, "+", q.x, q.y, {size:Math.max(9, a.r * geo.R * 1.2), color:"#ffffff", weight:900}); }});
      });
      /* molécules */
      function pushMol(m, fr, alpha){
        molAtoms(m, fr).forEach(function(a){ var q = scr(a.p); items.push({z:a.p[2], f:function(){ cdBall(ctx, q.x, q.y, a.r * geo.R * q.s, a.c, alpha); }}); });
      }
      st.mol.forEach(function(m){
        if (st.dock && st.dock.m === m){
          var D = st.dock, u = Math.max(0, Math.min(1, (st.t - D.t0) / Math.max(0.05, D.t1 - D.t0))), E1 = [pf.P[0] * 1.5, pf.P[1] * 1.5, pf.P[2] * 1.5], o, fr;
          var mm = {f1:D.f1, f2:D.f2};
          if (D.phase === "try"){
            var u2 = u < 0.6 ? u / 0.6 : 1 - (u - 0.6) / 0.4 * 0.3, e = u2 * u2 * (3 - 2 * u2);
            o = [D.from[0] + (E1[0] * 0.88 - D.from[0]) * e, D.from[1] + (E1[1] * 0.88 - D.from[1]) * e, D.from[2] + (E1[2] * 0.88 - D.from[2]) * e];
            fr = lerpFrame(mm, pf, Math.min(1, u * 1.4), o);
            pushMol(m, fr);
            if (u > 0.55 && u < 0.95){ var qx = scr(E1); items.push({z:9, f:function(){ cdT(S, c, "✕", qx.x, qx.y - 4, {size:22, color:"#ff7a66", weight:900, halo:"rgba(10,26,36,.8)"}); }}); }
            return;
          }
          if (u < 0.65){ var e1 = u / 0.65; e1 = e1 * e1 * (3 - 2 * e1); o = [D.from[0] + (E1[0] - D.from[0]) * e1, D.from[1] + (E1[1] - D.from[1]) * e1, D.from[2] + (E1[2] - D.from[2]) * e1]; fr = lerpFrame(mm, pf, u / 0.65, o); }
          else { var e2 = (u - 0.65) / 0.35; o = [E1[0] + (pf.C[0] - E1[0]) * e2, E1[1] + (pf.C[1] - E1[1]) * e2, E1[2] + (pf.C[2] - E1[2]) * e2]; fr = {o:o, e1:pf.P, e2:pf.Q}; }
          pushMol(m, fr);
          return;
        }
        pushMol(m, null);
      });
      st.prod.forEach(function(P){ pushMol(P, null, Math.min(1, P.life / 0.6)); });
      items.sort(function(x, y){ return x.z - y.z; }).forEach(function(it){ it.f(); });
      var qc = scr(pf.C), qm = scr([pf.P[0] * 1.12, pf.P[1] * 1.12, pf.P[2] * 1.12]);
      if (st.flash > 0){ S.draw.glow(c, qc.x, qc.y, geo.R * (0.5 + 0.6 * (1 - st.flash)), "#fff6c8", 0.95 * st.flash); }
      if (st.state === "ES" && cl > 0.6 && (!st.dock || st.t >= st.dock.t1)) S.draw.glow(c, qc.x, qc.y, geo.R * 0.35, "#ffe066", 0.25 + 0.15 * Math.sin(st.t * 12));
      /* étiquettes */
      var fs = cdFz(c, 11.5);
      if (pf.P[2] > -0.1){
        var lx = qm.x + (qm.x > geo.cx ? 1 : -1) * geo.R * 0.9, ly = qm.y - geo.R * 0.75;
        S.draw.line(c, qm.x, qm.y, lx, ly + 8, "rgba(255,236,170,.75)", 1.2);
        cdT(S, c, "site actif (poche)", lx, ly, {size:fs, color:"#ffe9a8", weight:800, halo:"rgba(10,26,36,.85)"});
      }
      cdT(S, c, "enzyme", geo.cx - geo.R * 0.55, geo.cy + geo.R * 1.12, {size:fs, color:"#cfe6ff", weight:800, halo:"rgba(10,26,36,.85)"});
      var stTxt = st.state === "ES" ? "ES : le substrat réagit" : st.state === "EI" ? "EI : poche bloquée par l'inhibiteur" : (st.dock && st.dock.phase === "in" ? "une molécule arrive…" : "E : poche libre");
      var stCol = st.state === "ES" ? "#b8f5c8" : st.state === "EI" ? "#e3c8ff" : "#ffffff";
      cdT(S, c, stTxt, 12, 18, {size:cdFz(c, 12.5), color:stCol, align:"left", weight:800, bg:"rgba(5,15,22,.6)"});
      cdT(S, c, "produits formés : " + st.meas.n, 12, 42, {size:cdFz(c, 11.5), color:"#c7e3d4", align:"left", weight:700});
      /* légende */
      var lgx = W - (phone ? 140 : 168), lgy = H - (phone ? 84 : 86), lfs = cdFz(c, 10.5);
      ctx.save(); ctx.fillStyle = "rgba(5,15,22,.6)"; cdRR(ctx, lgx - 8, lgy - 12, phone ? 144 : 164, 80, 8); ctx.fill(); ctx.restore();
      function mini(kind, x, y, sc){ EZ_SHAPES[kind].atoms.forEach(function(a){ cdBall(ctx, x + a[1] * sc, y - a[0] * sc - a[2] * sc * 0.5, a[4] * sc, a[3]); }); }
      mini("S", lgx + 8, lgy + 2, 30); cdT(S, c, "substrat S", lgx + 26, lgy, {size:lfs, color:"#ffd3cc", align:"left", weight:700});
      mini("I", lgx + 8, lgy + 21, 30); cdT(S, c, "inhibiteur I", lgx + 26, lgy + 19, {size:lfs, color:"#e3c8ff", align:"left", weight:700});
      mini("P1", lgx + 6, lgy + 40, 30); cdT(S, c, "produits", lgx + 26, lgy + 38, {size:lfs, color:"#c4f0c4", align:"left", weight:700});
      cdBall(ctx, lgx + 2, lgy + 57, 3.6, "#6f9a5b"); cdBall(ctx, lgx + 9, lgy + 57, 3.6, "#6f9a5b"); cdBall(ctx, lgx + 16, lgy + 57, 3.6, "#6f9a5b");
      cdT(S, c, "autres formes", lgx + 26, lgy + 57, {size:lfs, color:"#d7e8cf", align:"left", weight:700});
      if (!phone) cdT(S, c, "attrape une molécule et lâche-la devant la poche · glisse ailleurs pour tourner", 12, H - 12, {size:10.5, color:"rgba(199,226,240,.75)", align:"left", weight:600});
      else cdT(S, c, "attrape une molécule · glisse pour tourner", 10, H - 10, {size:9.5, color:"rgba(199,226,240,.75)", align:"left", weight:600});
      if (st.msg){ cdT(S, c, st.msg.t, W / 2, phone ? 64 : 70, {size:cdFz(c, 12), color:st.msg.c, weight:800, bg:"rgba(5,15,22,.82)"}); }

      /* --- graphe v/Vmax contre [S] --- */
      g.clear();
      var gc = g.ctx, GW = g.W, GH = g.H, KMa = EZ_KM * (1 + Iv / EZ_KI);
      gc.fillStyle = "#ffffff"; gc.fillRect(0, 0, GW, GH);
      var ax = S.draw.axes(g, {x0:0, x1:20, y0:0, y1:1.1, l:44, r:14, t:22, b:34, yl:"v / Vmax", stepY:0.2});
      cdT(S, g, "[S] (mmol/L)", ax.R, ax.B + 22, {size:10.5, color:"#2c3a4e", align:"right", weight:700});
      S.draw.line(g, ax.L, ax.Y(1), ax.R, ax.Y(1), "rgba(36,119,90,.55)", 1.2, [5, 4]);
      cdT(S, g, "Vmax (poche toujours pleine)", ax.R - 4, ax.Y(1) - 9, {size:cdFz(g, 10.5), color:"#24775a", align:"right", weight:800, halo:true});
      if (Iv > 0) S.draw.fn(g, ax, function(x){ return x / (EZ_KM + x); }, "rgba(47,111,209,.45)", 1.6, [4, 4]);
      S.draw.fn(g, ax, function(x){ return x / (KMa + x); }, Iv > 0 ? "#7b3fb0" : "#2f6fd1", 2.6);
      S.draw.line(g, ax.X(KMa), ax.Y(0.5), ax.X(KMa), ax.B, "rgba(224,122,31,.7)", 1.2, [3, 3]);
      S.draw.line(g, ax.L, ax.Y(0.5), ax.X(KMa), ax.Y(0.5), "rgba(224,122,31,.7)", 1.2, [3, 3]);
      cdT(S, g, Iv > 0 ? "Kₘ apparent" : "Kₘ", ax.X(KMa) + 4, ax.B - 10, {size:cdFz(g, 10.5), color:"#b65f12", align:"left", weight:800, halo:true});
      var th = Sv / (KMa + Sv);
      S.draw.dot(g, ax.X(Sv), ax.Y(th), 6.5, Iv > 0 ? "#7b3fb0" : "#2f6fd1");
      if (st.meas.t > 10){ var vm = st.meas.n / st.meas.t / EZ_KCAT; gc.save(); gc.strokeStyle = "#e07a1f"; gc.lineWidth = 2.2; gc.beginPath(); gc.arc(ax.X(Sv), ax.Y(Math.min(1.08, vm)), 7, 0, 7); gc.stroke(); gc.restore(); }
      cdT(S, g, "● théorie   ○ mesuré", ax.R - 4, ax.Y(0.3), {size:cdFz(g, 10.5), color:"#5f6b7a", align:"right", weight:700});

      /* --- afficheurs --- */
      ro.set(0, cdS(Sv / EZ_KM, 3));
      ro.set(1, cdF(th, 3));
      ro.set(2, cdS(KMa, 3) + " mmol/L");
      ro.set(3, cdF(EZ_KCAT * th, 3) + " /s");
      ro.set(4, st.meas.t > 3 ? cdF(st.meas.n / st.meas.t, 2) + " /s (" + st.meas.n + " en " + cdF(st.meas.t, 0) + " s)" : "mesure en cours…");
      ro.set(5, st.meas.t > 3 ? cdF(100 * st.meas.tES / st.meas.t, 0) + " % du temps" : "…");
      var msg = "Théorie : v/V<sub>max</sub> = [S]/(K<sub>M,app</sub> + [S]) = " + cdS(Sv, 3) + "/(" + cdS(KMa, 3) + " + " + cdS(Sv, 3) + ") = " + cdF(th, 3) + ", c'est aussi la fraction du temps où la poche contient S. Pour atteindre 90 % de V<sub>max</sub>, il faut [S] = 9·K<sub>M,app</sub> = " + cdS(9 * KMa, 3) + " mmol/L." + (Iv > 0 ? " Inhibiteur : K<sub>M,app</sub> = K<sub>M</sub>·(1 + [I]/K<sub>I</sub>) = " + cdS(KMa, 3) + " mmol/L ; la poche est bloquée " + cdF(100 * (Iv / EZ_KI) / (1 + Sv / EZ_KM + Iv / EZ_KI), 0) + " % du temps." : "");
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   4. L'eau pure n'est jamais pure : l'autoprotolyse (L12)
   ===================================================================== */
/* pKe de l'eau liquide (pression de vapeur saturante) et masse volumique, tables usuelles ; interpolation linéaire */
var AP_T = [0, 10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
var AP_PKE = [14.946, 14.528, 14.163, 14.000, 13.836, 13.542, 13.275, 13.034, 12.814, 12.613, 12.428, 12.265];
var AP_RHO = [999.84, 999.70, 998.21, 997.05, 995.65, 992.22, 988.04, 983.20, 977.76, 971.79, 965.31, 958.35];
var AP_M = 18.015, AP_SCAN = 2.2e8;   /* g/mol ; molécules « passées en revue » par seconde d'animation */
/* interpolation linéaire en 1/T (forme de Van 't Hoff) entre deux températures de la table */
function apInterp(tab, T){
  if (T <= AP_T[0]) return tab[0];
  for (var i = 1; i < AP_T.length; i++) if (T <= AP_T[i]){ var u0 = 1 / (AP_T[i - 1] + 273.15), u1 = 1 / (AP_T[i] + 273.15), f = (u0 - 1 / (T + 273.15)) / (u0 - u1); return tab[i - 1] + (tab[i] - tab[i - 1]) * f; }
  return tab[tab.length - 1];
}
function apState(T){
  var pKe = apInterp(AP_PKE, T), Ke = Math.pow(10, -pKe), h = Math.sqrt(Ke), cw = apInterp(AP_RHO, T) / AP_M;
  return {pKe:pKe, Ke:Ke, h:h, pH:pKe / 2, cw:cw, ratio:cw / h};
}
function apBig(x){
  if (x >= 1e9) return cdF(x / 1e9, 2) + " milliard" + (x >= 2e9 ? "s" : "");
  return cdS(x / 1e6, 3) + " millions";
}

SFA.sim({
  id:"ch-autoprotolyse", ch:"L12", tag:"Acides et bases",
  titre:"L'eau pure n'est jamais pure : l'autoprotolyse",
  resume:"Une boîte de molécules d'eau en 3D : de temps en temps, une molécule cède un proton à sa voisine (H₃O⁺ + OH⁻), puis la paire se recombine. Un compteur montre la rareté : environ 1 paire pour 550 millions de molécules à 25 °C. En chauffant, Ke augmente et le pH de l'eau pure descend sous 7, tout en restant neutre.",
  but:"Regarde la boîte : un éclair, un proton saute d'une molécule d'eau à sa voisine ; un H₃O⁺ (orange, +) et un OH⁻ (bleu, −) apparaissent puis se recombinent. Le compteur passe en revue des centaines de millions de molécules avant de trouver une paire. Fais varier la température : Ke, [H₃O⁺] et le pH de l'eau pure changent. Glisse pour tourner la boîte ; clique une molécule pour lui faire céder un proton.",
  aRetenir:"Autoprotolyse : 2 H₂O ⇌ H₃O⁺ + OH⁻, K<sub>e</sub> = [H₃O⁺]·[OH⁻] = 1,0·10⁻¹⁴ à 25 °C (pK<sub>e</sub> = 14,00). Dans l'eau pure, [H₃O⁺] = [OH⁻] = √K<sub>e</sub> = 1,0·10⁻⁷ mol/L : avec [H₂O] ≈ 55,3 mol/L, il y a environ 1 paire pour 5,5·10⁸ molécules. La réaction est endothermique : K<sub>e</sub> augmente avec T. Une solution est <b>neutre</b> quand [H₃O⁺] = [OH⁻], c'est-à-dire pH = pK<sub>e</sub>/2 : 7,00 à 25 °C, 6,81 à 37 °C, 6,13 à 100 °C.",
  piege:"« À 37 °C, l'eau pure a un pH de 6,8 : elle est acide » : faux. Elle reste neutre ([H₃O⁺] = [OH⁻]) ; c'est la limite de neutralité qui vaut pK<sub>e</sub>/2, pas 7. « pH 7 = neutre » n'est vrai qu'à 25 °C. Et l'équilibre est dynamique : des paires se forment et se recombinent sans arrêt, leur nombre moyen reste constant.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 480 : 440), g = k.canvas(phone ? 220 : 190);
    var st = {a:0.5, b:0.3, t:0, mol:[], ev:[], scan:0, found:0, drag:null, lens:0};
    var TS = k.slider("Température de l'eau", 0, 100, 1, 25, "°C", function(){ st.found = 0; st.scan = 0; });
    var spinT = k.toggle("Rotation automatique de la boîte", true);
    k.button("Faire céder un proton maintenant", function(){ trigger(null); }, true);
    var ro = k.readouts(["K<sub>e</sub> à cette température", "[H₃O⁺] = [OH⁻] = √K<sub>e</sub>", "pH de l'eau pure (neutre)", "pK<sub>e</sub> = pH + pOH", "[H₂O] = ρ / M", "1 paire H₃O⁺/OH⁻ pour"]);
    var nt = k.note("", "ok");
    k.note("Valeurs : pK<sub>e</sub> et masse volumique de l'eau liquide tirées des tables usuelles (0 à 100 °C, pK<sub>e</sub> arrondi à 14,00 à 25 °C), interpolées en 1/T entre les températures de la table. La boîte montre 64 molécules autour d'une paire qui vient de se former : dans la réalité, il faudrait passer en revue des centaines de millions de molécules pour en trouver une. La fréquence des transferts dans la boîte est proportionnelle à [H₃O⁺]/[H₂O], pour que la comparaison entre températures soit juste (au plus 9 paires dessinées à la fois).", "");
    var seed = 9; function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var g4 = [-0.68, -0.227, 0.227, 0.68];
    g4.forEach(function(x){ g4.forEach(function(y){ g4.forEach(function(z){
      var f1 = cdNorm([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), t = cdNorm([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), d = ezDot(t, f1), f2 = cdNorm([t[0] - f1[0] * d, t[1] - f1[1] * d, t[2] - f1[2] * d]);
      st.mol.push({h:[x + (rnd() - 0.5) * 0.12, y + (rnd() - 0.5) * 0.12, z + (rnd() - 0.5) * 0.12], ph:[rnd() * 6.3, rnd() * 6.3, rnd() * 6.3], f1:f1, f2:f2, ax:cdNorm([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), w:0.5 + rnd(), kind:"w", p:[x, y, z]});
    }); }); });
    var HL = 0.155, HA = 104.5 * PI / 180;
    function hs(m){
      var c1 = Math.cos(HA / 2), s1 = Math.sin(HA / 2);
      return [[m.p[0] + HL * (c1 * m.f1[0] + s1 * m.f2[0]), m.p[1] + HL * (c1 * m.f1[1] + s1 * m.f2[1]), m.p[2] + HL * (c1 * m.f1[2] + s1 * m.f2[2])],
              [m.p[0] + HL * (c1 * m.f1[0] - s1 * m.f2[0]), m.p[1] + HL * (c1 * m.f1[1] - s1 * m.f2[1]), m.p[2] + HL * (c1 * m.f1[2] - s1 * m.f2[2])]];
    }
    function trigger(donor){
      if (st.ev.length >= 9) return false;
      var free = st.mol.filter(function(m){ return m.kind === "w" && !m.ev; });
      if (!free.length) return false;
      var D = donor && donor.kind === "w" && !donor.ev ? donor : null;
      if (!D){
        /* de préférence une molécule vers l'avant de la boîte */
        free.sort(function(x, y){ return cdRot(y.p, st.a, st.b)[2] - cdRot(x.p, st.a, st.b)[2]; });
        D = free[Math.floor(rnd() * Math.min(free.length, 20))];
      }
      var best = null, bd = 0.62;
      free.forEach(function(m){ if (m === D) return; var d = Math.hypot(m.p[0] - D.p[0], m.p[1] - D.p[1], m.p[2] - D.p[2]); if (d < bd){ bd = d; best = m; } });
      if (!best) return false;
      D.ev = best.ev = true;
      st.ev.push({D:D, A:best, t:0, life:2.2 + rnd() * 1.2});
      return true;
    }
    c.pointer(function(type, p){
      if (type === "down") st.drag = {x:p.x, y:p.y, lx:p.x, ly:p.y, moved:false};
      if (type === "drag" && st.drag){
        if (Math.abs(p.x - st.drag.x) + Math.abs(p.y - st.drag.y) > 5) st.drag.moved = true;
        st.a += (p.x - st.drag.lx) * 0.012; st.b = Math.max(-1.3, Math.min(1.3, st.b + (p.y - st.drag.ly) * 0.012)); st.drag.lx = p.x; st.drag.ly = p.y;
        if (st.drag.moved) spinT.set(false);
      }
      if (type === "up" && st.drag){
        if (!st.drag.moved && st.scr){
          var best = null, bd = 16;
          st.scr.forEach(function(o){ var d = Math.hypot(o.x - p.x, o.y - p.y); if (d < bd){ bd = d; best = o.m; } });
          if (best) trigger(best);
        }
        st.drag = null;
      }
    });
    c.cv.style.cursor = "grab";
    var lp = k.loop(function(dt){
      st.t += dt; st.lens += dt;
      var T = TS.value, A = apState(T), amp = Math.sqrt((T + 273.15) / 298.15);
      st.mol.forEach(function(m){
        m.p = [m.h[0] + 0.05 * amp * Math.sin(st.t * 1.3 + m.ph[0]), m.h[1] + 0.05 * amp * Math.sin(st.t * 1.1 + m.ph[1]), m.h[2] + 0.05 * amp * Math.sin(st.t * 1.7 + m.ph[2])];
        if (!m.ev){ m.f1 = cdNorm(cdRotAx(m.f1, m.ax, m.w * amp * dt)); m.f2 = cdNorm(cdRotAx(m.f2, m.ax, m.w * amp * dt)); }
      });
      /* compteur : on « passe en revue » AP_SCAN molécules par seconde ; une paire tous les A.ratio */
      st.scan += AP_SCAN * dt;
      while (st.scan >= A.ratio){ st.scan -= A.ratio; st.found++; trigger(null); }
      st.ev = st.ev.filter(function(e){
        e.t += dt;
        if (e.t > 0.7 + e.life + 0.6){ e.D.ev = e.A.ev = false; e.D.kind = e.A.kind = "w"; return false; }
        if (e.t > 0.7 && e.t < 0.7 + e.life){ e.D.kind = "oh"; e.A.kind = "h3o"; }
        else { e.D.kind = e.A.kind = "w"; }
        return true;
      });
      if (spinT.value && !st.drag) st.a += dt * 0.16;
      k.redraw();
    });
    lp.play();

    function beaker(ctx, cx, by, s, T){
      /* plaque chauffante */
      var pw = 118 * s, ph = 26 * s, glow = T / 100;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.3)"; cdEll(ctx, cx + 4, by + 2, pw * 0.55, 5 * s); ctx.fill(); ctx.restore();
      var gp = ctx.createLinearGradient(0, by - ph, 0, by); gp.addColorStop(0, "#eef1f5"); gp.addColorStop(1, "#98a3b2");
      ctx.fillStyle = gp; cdRR(ctx, cx - pw / 2, by - ph, pw, ph, 5 * s); ctx.fill();
      var gt = ctx.createLinearGradient(0, by - ph - 6 * s, 0, by - ph);
      gt.addColorStop(0, "rgb(" + Math.round(120 + 130 * glow) + "," + Math.round(125 - 40 * glow) + "," + Math.round(135 - 90 * glow) + ")"); gt.addColorStop(1, "#59606b");
      ctx.fillStyle = gt; cdRR(ctx, cx - pw / 2 + 7 * s, by - ph - 6 * s, pw - 14 * s, 7 * s, 3 * s); ctx.fill();
      if (glow > 0.3) S.draw.glow({ctx:ctx}, cx, by - ph - 3 * s, pw * 0.5, "#ff6a2a", 0.35 * glow);
      cdBall(ctx, cx + pw / 2 - 16 * s, by - ph / 2, 6 * s, glow > 0.05 ? "#e74c3c" : "#6b7a8f");
      /* bécher */
      var bw = 84 * s, bh = 100 * s, x0 = cx - bw / 2, y0 = by - ph - 6 * s - bh, wl = y0 + bh * 0.22;
      var gw = ctx.createLinearGradient(x0, 0, x0 + bw, 0); gw.addColorStop(0, "rgba(160,200,235,.55)"); gw.addColorStop(0.5, "rgba(215,236,252,.35)"); gw.addColorStop(1, "rgba(150,190,228,.55)");
      ctx.fillStyle = gw; ctx.fillRect(x0, wl, bw, y0 + bh - wl);
      cdEll(ctx, cx, wl, bw / 2, 4 * s); ctx.fillStyle = "rgba(235,246,255,.7)"; ctx.fill();
      if (T > 85){ for (var b = 0; b < 6; b++){ var yy = y0 + bh - ((st.t * 40 * s + b * 17 * s) % (bh * 0.75)); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x0 + bw * (0.2 + 0.12 * b), yy, 2.2 * s, 0, 7); ctx.stroke(); } }
      ctx.strokeStyle = "rgba(110,140,175,.9)"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + bh - 6 * s); ctx.quadraticCurveTo(x0, y0 + bh, x0 + 6 * s, y0 + bh); ctx.lineTo(x0 + bw - 6 * s, y0 + bh); ctx.quadraticCurveTo(x0 + bw, y0 + bh, x0 + bw, y0 + bh - 6 * s); ctx.lineTo(x0 + bw, y0); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(x0 + bw * 0.1, y0 + 8 * s, bw * 0.05, bh - 18 * s);
      /* thermomètre et électrode de pH */
      ctx.fillStyle = "rgba(255,255,255,.9)"; cdRR(ctx, x0 + bw * 0.22 - 3 * s, y0 - 30 * s, 6 * s, bh * 0.95, 3 * s); ctx.fill();
      var tf = T / 100; ctx.fillStyle = "#e74c3c"; cdRR(ctx, x0 + bw * 0.22 - 1.6 * s, y0 - 26 * s + (bh * 0.85) * (1 - tf), 3.2 * s, bh * 0.85 * tf + 2, 1.6 * s); ctx.fill();
      cdBall(ctx, x0 + bw * 0.22, y0 - 30 * s + bh * 0.95, 4.5 * s, "#e74c3c");
      var ex = x0 + bw * 0.68, ge = ctx.createLinearGradient(ex - 5 * s, 0, ex + 5 * s, 0); ge.addColorStop(0, "#8a96a6"); ge.addColorStop(0.5, "#eef1f5"); ge.addColorStop(1, "#7a8697");
      ctx.fillStyle = ge; cdRR(ctx, ex - 5 * s, y0 - 36 * s, 10 * s, bh * 0.9, 4 * s); ctx.fill();
      cdBall(ctx, ex, y0 - 36 * s + bh * 0.9, 6 * s, "#dfe9f2", 0.9);
      return {x0:x0, y0:y0, bw:bw, bh:bh, wl:wl, ex:ex};
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, T = TS.value, A = apState(T);
      var benchY = phone ? H * 0.9 : H * 0.86;
      cdLab(ctx, 0, 0, W, H, benchY, true);
      /* --- bécher, pH-mètre --- */
      var bs = phone ? 0.62 : Math.min(0.95, W / 560), bx = phone ? W * 0.17 : W * 0.15;
      var B = beaker(ctx, bx, benchY + 2, bs, T);
      var dx = phone ? W * 0.75 : W * 0.15, dy = phone ? benchY - 34 : H * 0.12;
      S.draw.display(c, cdF(A.pH, 2), dx, dy, {w:phone ? 108 : 116, h:phone ? 46 : 54, caption:phone ? "pH · " + cdF(T, 0) + " °C" : "pH-mètre · " + cdF(T, 0) + " °C"});
      ctx.save(); ctx.strokeStyle = "#2f3a4d"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(dx, dy + (phone ? 23 : 27)); ctx.bezierCurveTo(dx, dy + 60, B.ex, B.y0 - 70 * bs, B.ex, B.y0 - 36 * bs); ctx.stroke(); ctx.restore();
      /* loupe qui balaie l'eau du bécher */
      var lx = B.x0 + B.bw * (0.45 + 0.18 * Math.sin(st.lens * 0.7)), ly = B.wl + (B.y0 + B.bh - B.wl) * (0.5 + 0.22 * Math.sin(st.lens * 1.1)), lr = 15 * bs;
      /* --- boîte 3D --- */
      var cx = phone ? W * 0.5 : W * 0.65, cy = phone ? H * 0.42 : H * 0.54, bsz = phone ? Math.min(W * 0.26, H * 0.22) : Math.min(W * 0.2, H * 0.28);
      ctx.save(); ctx.strokeStyle = "rgba(255,230,150,.25)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(lx, ly - lr); ctx.lineTo(cx - bsz * 1.1, cy - bsz * 1.2); ctx.moveTo(lx, ly + lr); ctx.lineTo(cx - bsz * 1.1, cy + bsz * 1.2); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.lineWidth = 3.5; ctx.strokeStyle = "#c9a44a"; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.stroke();
      ctx.fillStyle = "rgba(255,245,210,.18)"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = "#5a4630"; ctx.beginPath(); ctx.moveTo(lx + lr * 0.7, ly + lr * 0.7); ctx.lineTo(lx + lr * 1.7, ly + lr * 1.7); ctx.stroke(); ctx.restore();
      function P3(p){ var r = cdRot(p, st.a, st.b), s = 1 / (1 - r[2] * 0.14); return {x:cx + r[0] * bsz * s, y:cy - r[1] * bsz * s, z:r[2], s:s}; }
      var V = [], i;
      for (i = 0; i < 8; i++) V.push(P3([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]));
      var F = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
      function face(f, front){
        var z = (V[f[0]].z + V[f[1]].z + V[f[2]].z + V[f[3]].z) / 4;
        if ((z >= 0) !== front) return;
        ctx.beginPath(); f.forEach(function(ix, j){ if (j) ctx.lineTo(V[ix].x, V[ix].y); else ctx.moveTo(V[ix].x, V[ix].y); }); ctx.closePath();
        ctx.fillStyle = front ? "rgba(160,210,255,.05)" : "rgba(90,150,215,.16)"; ctx.fill();
        ctx.strokeStyle = front ? "rgba(200,225,255,.6)" : "rgba(160,185,230,.28)"; ctx.lineWidth = front ? 1.5 : 1; ctx.stroke();
      }
      F.forEach(function(f){ face(f, false); });
      var items = [], RO = bsz * 0.105, RH = bsz * 0.065;
      st.scr = [];
      st.mol.forEach(function(m){
        var O = P3(m.p), H2 = hs(m), list = [], e = null;
        st.ev.forEach(function(q){ if (q.D === m || q.A === m) e = q; });
        if (m.kind === "oh"){ list.push(H2[1]); }
        else if (m.kind === "h3o"){ list.push(H2[0], H2[1]); var dn = e.D.p, dv = cdNorm([dn[0] - m.p[0], dn[1] - m.p[1], dn[2] - m.p[2]]); list.push([m.p[0] + dv[0] * HL, m.p[1] + dv[1] * HL, m.p[2] + dv[2] * HL]); }
        else if (e && e.D === m){
          /* donneur pendant le saut : H1 voyage vers l'accepteur (aller 0,7 s, retour 0,6 s) */
          list.push(H2[1]);
          var u = e.t < 0.7 ? e.t / 0.7 : Math.max(0, 1 - (e.t - 0.7 - e.life) / 0.6);
          var tgt = cdNorm([m.p[0] - e.A.p[0], m.p[1] - e.A.p[1], m.p[2] - e.A.p[2]]), end = [e.A.p[0] + tgt[0] * HL, e.A.p[1] + tgt[1] * HL, e.A.p[2] + tgt[2] * HL];
          var hp = [H2[0][0] + (end[0] - H2[0][0]) * u, H2[0][1] + (end[1] - H2[0][1]) * u, H2[0][2] + (end[2] - H2[0][2]) * u], q2 = P3(hp);
          items.push({z:q2.z + 0.02, f:function(){ S.draw.glow(c, q2.x, q2.y, RH * 4 * q2.s, "#fff3a0", 0.85); cdBall(ctx, q2.x, q2.y, RH * 1.1 * q2.s, "#ffffff"); }});
        } else list.push(H2[0], H2[1]);
        var col = m.kind === "h3o" ? "#f08a24" : m.kind === "oh" ? "#2f7be0" : "#d6392f";
        var hq = list.map(function(h){ return P3(h); });
        items.push({z:O.z, f:function(){
          if (m.kind !== "w") S.draw.glow(c, O.x, O.y, RO * 3.2 * O.s, m.kind === "h3o" ? "#ffb066" : "#6fb2ff", 0.6);
          hq.filter(function(h){ return h.z < O.z; }).forEach(function(h){ cdBall(ctx, h.x, h.y, RH * h.s, "#eef2f7"); });
          cdBall(ctx, O.x, O.y, RO * O.s, col);
          hq.filter(function(h){ return h.z >= O.z; }).forEach(function(h){ cdBall(ctx, h.x, h.y, RH * h.s, "#eef2f7"); });
          if (m.kind !== "w") cdT(S, c, m.kind === "h3o" ? "+" : "−", O.x + RO * O.s * 0.95, O.y - RO * O.s * 0.95, {size:Math.max(11, 13 * O.s), color:"#ffffff", weight:900, halo:m.kind === "h3o" ? "#a5520c" : "#164a99"});
        }});
        st.scr.push({x:O.x, y:O.y, m:m});
      });
      items.sort(function(x, y){ return x.z - y.z; }).forEach(function(it){ it.f(); });
      F.forEach(function(f){ face(f, true); });
      /* --- compteur de la loupe --- */
      var fs = cdFz(c, 11.5), tx = phone ? 12 : W * 0.36, ty = phone ? 18 : 20;
      cdT(S, c, "molécules d'eau passées en revue", tx, ty, {size:fs, color:"#c7d3ea", align:"left", weight:700});
      cdT(S, c, cdSci(st.scan, 2) + " / " + cdSci(A.ratio, 2), tx, ty + 20, {size:cdFz(c, 14), color:"#ffffff", align:"left", weight:800, mono:true});
      var pw = phone ? W * 0.5 : W * 0.3, pr = st.scan / A.ratio;
      ctx.fillStyle = "rgba(255,255,255,.15)"; cdRR(ctx, tx, ty + 32, pw, 6, 3); ctx.fill();
      ctx.fillStyle = "#ffd34d"; cdRR(ctx, tx, ty + 32, Math.max(6, pw * pr), 6, 3); ctx.fill();
      cdT(S, c, "paires H₃O⁺/OH⁻ trouvées : " + st.found, tx, ty + 52, {size:fs, color:"#ffd34d", align:"left", weight:800});
      /* légende */
      var lfs = cdFz(c, 10.5);
      function lg(x, y, col, gl, t, tc){ if (gl) S.draw.glow(c, x, y, 12, gl, 0.6); cdBall(ctx, x, y, 6, col); cdT(S, c, t, x + 12, y, {size:lfs, color:tc, align:"left", weight:700}); }
      if (!phone){
        var lgx = 22, lgy = H * 0.24;
        ctx.save(); ctx.fillStyle = "rgba(10,15,28,.55)"; cdRR(ctx, lgx - 12, lgy - 13, 150, 64, 8); ctx.fill(); ctx.restore();
        lg(lgx, lgy, "#d6392f", null, "H₂O", "#ffd0c8"); lg(lgx, lgy + 19, "#f08a24", "#ffb066", "H₃O⁺ (ion oxonium)", "#ffd2a6"); lg(lgx, lgy + 38, "#2f7be0", "#6fb2ff", "OH⁻ (ion hydroxyde)", "#bcd8ff");
        cdT(S, c, "2 H₂O ⇌ H₃O⁺ + OH⁻", cx, Math.min(H - 34, cy + bsz * 1.38), {size:cdFz(c, 13), color:"#ffffff", weight:800, bg:"rgba(10,15,28,.6)"});
      } else {
        var py = cy + bsz * 1.36;
        cdT(S, c, "2 H₂O ⇌ H₃O⁺ + OH⁻", W * 0.5, py, {size:cdFz(c, 13), color:"#ffffff", weight:800, bg:"rgba(10,15,28,.6)"});
        lg(W * 0.5 - 70, py + 22, "#f08a24", "#ffb066", "H₃O⁺", "#ffd2a6"); lg(W * 0.5 + 18, py + 22, "#2f7be0", "#6fb2ff", "OH⁻", "#bcd8ff");
      }
      cdT(S, c, phone ? "glisse · clique une molécule" : "glisse pour tourner · clique une molécule pour lui faire céder un proton", W - 12, H - 12, {size:cdFz(c, 10.5), color:"rgba(199,211,234,.8)", align:"right", weight:600});

      /* --- graphe : pH de l'eau pure selon T --- */
      g.clear();
      var gc = g.ctx; gc.fillStyle = "#ffffff"; gc.fillRect(0, 0, g.W, g.H);
      var ax = S.draw.axes(g, {x0:0, x1:100, y0:6, y1:7.6, l:44, r:14, t:22, b:34, yl:"pH de l'eau pure (neutre)", stepX:10, stepY:0.2});
      cdT(S, g, "T (°C)", ax.R, ax.B + 22, {size:10.5, color:"#2c3a4e", align:"right", weight:700});
      S.draw.line(g, ax.L, ax.Y(7), ax.R, ax.Y(7), "rgba(95,107,122,.6)", 1.2, [5, 4]);
      cdT(S, g, "pH = 7", ax.R - 4, ax.Y(7) - 9, {size:cdFz(g, 10.5), color:"#5f6b7a", align:"right", weight:800, halo:true});
      S.draw.fn(g, ax, function(t){ return apState(t).pH; }, "#24775a", 2.6);
      cdT(S, g, "acide (pH < pKe/2)", ax.X(12), ax.Y(6.25), {size:cdFz(g, 10.5), color:"#c0392b", weight:800, halo:true});
      cdT(S, g, "basique (pH > pKe/2)", ax.X(78), ax.Y(7.4), {size:cdFz(g, 10.5), color:"#1f5fbf", weight:800, halo:true});
      var p37 = apState(37).pH; S.draw.dot(g, ax.X(37), ax.Y(p37), 4, "#7b3fb0");
      cdT(S, g, "37 °C : " + cdF(p37, 2), ax.X(37) + 6, ax.Y(p37) + 12, {size:cdFz(g, 10.5), color:"#7b3fb0", align:"left", weight:800, halo:true});
      S.draw.line(g, ax.X(T), ax.Y(A.pH), ax.X(T), ax.B, "rgba(36,119,90,.45)", 1.2, [3, 3]);
      S.draw.dot(g, ax.X(T), ax.Y(A.pH), 7, "#24775a");
      cdT(S, g, cdF(A.pH, 2), ax.X(T) + (T > 80 ? -10 : 10), ax.Y(A.pH) + (A.pH > 7.3 ? 18 : -12), {size:cdFz(g, 12), color:"#24775a", align:T > 80 ? "right" : "left", weight:800, halo:true});

      /* --- afficheurs --- */
      ro.set(0, cdSci(A.Ke, 2));
      ro.set(1, cdSci(A.h, 2) + " mol/L");
      ro.set(2, cdF(A.pH, 2));
      ro.set(3, cdF(A.pKe, 2));
      ro.set(4, cdF(A.cw, 1) + " mol/L");
      ro.set(5, apBig(A.ratio));
      var dev = A.pH - 7, msg = "À " + cdF(T, 0) + " °C : K<sub>e</sub> = " + cdSci(A.Ke, 2) + ", soit " + cdS(A.Ke / 1e-14, 3) + " fois K<sub>e</sub>(25 °C). L'eau pure est neutre ([H₃O⁺] = [OH⁻] = " + cdSci(A.h, 2) + " mol/L) et son pH vaut pK<sub>e</sub>/2 = " + cdF(A.pH, 2) + (Math.abs(dev) < 0.005 ? "." : ", " + cdF(Math.abs(dev), 2) + (dev < 0 ? " sous 7 : elle n'est pas acide pour autant." : " au-dessus de 7 : elle n'est pas basique pour autant.")) + " Une paire H₃O⁺/OH⁻ pour " + apBig(A.ratio) + " de molécules d'eau.";
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

})();
