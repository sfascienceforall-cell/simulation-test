/* Chimie BA1 · lot P2-CC (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-exo-endo-mains · ch-entropie-univers (c05) · ch-minimum-g (c05) · ch-equilibre-dynamique (c06) */
(function(){
var PI = Math.PI;
var R_GP = 8.314462618;

/* ---------- aides de dessin (préfixe cc) ---------- */
function ccShade(hex, f){
  var n = parseInt(String(hex).replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function ccRgba(hex, a){ var n = parseInt(String(hex).replace("#", ""), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function ccBall(ctx, x, y, r, hex, alpha){
  if (!(r > 0.3)) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, ccShade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, ccShade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill(); ctx.restore();
}
function ccRR(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function ccEll(ctx, cx, cy, rx, ry){ ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, 2 * PI); }
function ccFz(c, b){ return c.W < 440 ? Math.max(9.5, b - 1.5) : b; }
function ccN(x, d){
  if (x == null || !isFinite(x)) return "—";
  var s = Number(x).toFixed(d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0$/.test(s)) s = "0";
  return s.replace("-", "−").replace(".", ",");
}
/* nombre avec décimales fixes (pas de zéros retirés) */
function ccF(x, d){ if (x == null || !isFinite(x)) return "—"; var s = Number(x).toFixed(d); if (/^-0(\.0+)?$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); }
function ccSg(x, d){ return (x > 0 && Math.abs(x) >= 0.5 * Math.pow(10, -d) ? "+" : "") + ccF(x, d); }
function ccT(S, c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
/* palette « caméra thermique » : 0 °C bleu nuit → 60 °C blanc chaud */
var CC_TH = [[0, [24, 10, 96]], [0.18, [40, 80, 230]], [0.36, [30, 200, 220]], [0.5, [60, 205, 90]], [0.64, [245, 225, 60]], [0.8, [250, 130, 30]], [0.92, [230, 40, 30]], [1, [255, 235, 220]]];
function ccThermal(T, a){
  var u = Math.max(0, Math.min(1, T / 60)), i = 0;
  while (i < CC_TH.length - 2 && u > CC_TH[i + 1][0]) i++;
  var p = CC_TH[i], q = CC_TH[i + 1], f = (u - p[0]) / (q[0] - p[0]);
  var r = Math.round(p[1][0] + (q[1][0] - p[1][0]) * f), g = Math.round(p[1][1] + (q[1][1] - p[1][1]) * f), b = Math.round(p[1][2] + (q[1][2] - p[1][2]) * f);
  return a == null ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
/* flèche ondulée (chaleur) */
function ccHeat(S, c, x1, y1, x2, y2, col, ph){
  var ctx = c.ctx, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 4) return;
  var ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
  for (var i = 0; i <= 30; i++){ var s = i / 30 * (L - 9), w = Math.sin(s / 6 - ph * 6) * 3.2; var x = x1 + ux * s + nx * w, y = y1 + uy * s + ny * w; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
  S.draw.arrow(c, x2 - ux * 10, y2 - uy * 10, x2, y2, col, 3);
}
/* petite algèbre 3D (projection à la main, comme sims-L15) */
function ccRot(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}

/* =====================================================================
   1. Chaufferette et poche de froid : le signe de ΔH (c05)
   ===================================================================== */
var CC_SALTS = [
  {nom:"CaCl₂", M:110.98, dH:-81.3, react:"CaCl₂(s) + eau", prod:"Ca²⁺(aq) + 2 Cl⁻(aq)", cat:{c:"#b9c2cf", r:1.0, q:"2+"}, an:{c:"#3fb24f", r:1.15, q:"−"}, ratio:2, use:"chaufferette"},
  {nom:"NH₄NO₃", M:80.04, dH:25.7, react:"NH₄NO₃(s) + eau", prod:"NH₄⁺(aq) + NO₃⁻(aq)", cat:{c:"#4f6fd8", r:1.05, q:"+", nh4:true}, an:{c:"#d6493a", r:1.15, q:"−", no3:true}, ratio:1, use:"poche de froid"}
];
var CC_CP = 4.18, CC_T0 = 20, CC_SKIN = 33;
function ccMix(i, m, V){
  var s = CC_SALTS[i], n = m / s.M, dHt = n * s.dH, dT = -dHt * 1000 / ((V + m) * CC_CP);
  return {n:n, dH:dHt, dT:dT, Tf:CC_T0 + dT};
}

SFA.sim({
  id:"ch-exo-endo-mains", ch:"c05", tag:"Enthalpie",
  titre:"Chaufferette et poche de froid : le signe de ΔH",
  resume:"Deux béchers, deux sels : le chlorure de calcium chauffe l'eau, le nitrate d'ammonium la refroidit. Ta main, vue à la caméra thermique, sent la différence ; le diagramme d'enthalpie montre la flèche vers le bas ou vers le haut.",
  but:"Choisis la masse de sel et le volume d'eau, puis regarde : la spatule verse CaCl₂ à gauche et NH₄NO₃ à droite. Les mains et les solutions prennent les couleurs d'une caméra thermique, le thermomètre affiche la température. Glisse le viseur dans un bécher pour voir, à la loupe, les ions s'entourer de molécules d'eau.",
  aRetenir:"Le <b>système</b> est le sel qui se dissout ; le <b>milieu</b> est l'eau du bécher, le verre, ta main, l'air. ΔH < 0 (exothermique) : le système cède de la chaleur au milieu, qui se réchauffe (CaCl₂, chaufferette). ΔH > 0 (endothermique) : le système prend de la chaleur au milieu, qui se refroidit (NH₄NO₃, poche de froid). Bilan : q(eau) = −n·Δ<sub>sol</sub>H = m<sub>solution</sub>·c·ΔT.",
  piege:"« La solution est froide, donc le système a perdu de la chaleur » : faux. C'est le milieu (l'eau, ta main) qui a perdu de la chaleur ; le système l'a reçue, donc ΔH > 0. Le thermomètre mesure le milieu, pas l'énergie des ions. Et la masse de la solution compte le sel dissous, pas seulement l'eau.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 400 : 410), g = k.canvas(phone ? 210 : 176);
    var st = {t:0, vx:null, vy:null, drag:false, bub:[], ions:[[], []], wat:[], seed:1};
    var mS = k.slider("Masse de sel dans chaque bécher", 2, 30, 1, 10, "g", restart);
    var vS = k.slider("Volume d'eau dans chaque bécher", 50, 200, 10, 100, "mL", restart);
    var thT = k.toggle("Caméra thermique (mains et solutions)", true);
    var loopT = k.toggle("Recommencer en boucle", true);
    k.button("Verser à nouveau", restart, true);
    var ro = k.readouts(["CaCl₂ dissous", "ΔH (CaCl₂)", "T finale (CaCl₂)", "NH₄NO₃ dissous", "ΔH (NH₄NO₃)", "T finale (NH₄NO₃)"]);
    var nt = k.note("", "ok");
    k.note("Δ<sub>sol</sub>H° (25 °C, dilution infinie) : CaCl₂ −81,3 kJ/mol ; NH₄NO₃ +25,7 kJ/mol. Eau à 20 °C au départ, bécher isolé (on lit ΔT juste après la dissolution), c = 4,18 J·g⁻¹·K⁻¹ pour la solution, masse = eau (1,00 g/mL) + sel. M(CaCl₂) = 110,98 g/mol ; M(NH₄NO₃) = 80,04 g/mol. Valeur à dilution infinie : ΔT un peu surestimé pour les solutions concentrées.", "");
    function rnd(){ st.seed = (st.seed * 16807) % 2147483647; return (st.seed - 1) / 2147483646; }
    function restart(){
      st.t = 0; st.seed = 7;
      for (var i = 0; i < 2; i++){
        st.ions[i] = [];
        var SL = [[-0.42, -0.5], [0.12, -0.62], [0.55, -0.22], [-0.62, 0.02], [-0.02, -0.08], [0.5, 0.3], [-0.3, 0.38]];
        for (var j = 0; j < 7; j++) st.ions[i].push({x:SL[j][0], y:SL[j][1], ph:rnd() * 6.3, an:CC_SALTS[i].ratio === 2 ? (j % 3 !== 0) : (j % 2 === 1), rot:rnd() * 6.3});
      }
      st.wat = [];
      for (var w = 0; w < 14; w++) st.wat.push({x:rnd() * 2 - 1, y:rnd() * 2 - 1, vx:rnd() - 0.5, vy:rnd() - 0.5, a:rnd() * 6.3, va:rnd() - 0.5});
      st.dots = [[], []];
      for (var d = 0; d < 2; d++) for (var e = 0; e < 40; e++) st.dots[d].push({x:rnd(), y:rnd(), ph:rnd() * 6.3});
    }
    restart();
    var TP = 0.9, TAU = 1.4;
    function prog(t){ return t < TP ? 0 : 1 - Math.exp(-(t - TP) / TAU); }
    var geo = {};
    c.pointer(function(type, p){
      if (type === "down"){ st.drag = true; st.vx = p.x; st.vy = p.y; }
      if (type === "drag" && st.drag){ st.vx = Math.max(6, Math.min(c.W - 6, p.x)); st.vy = Math.max(6, Math.min(c.H - 6, p.y)); }
      if (type === "up") st.drag = false;
    });
    c.cv.style.cursor = "crosshair";
    var lp = k.loop(function(dt){
      st.t += dt;
      if (loopT.value && st.t > 11.5) restart();
      /* molécules d'eau de la loupe */
      st.wat.forEach(function(w){ w.x += w.vx * dt * st.sp * 0.9; w.y += w.vy * dt * st.sp * 0.9; w.a += w.va * dt * st.sp * 3;
        if (w.x * w.x + w.y * w.y > 0.9){ w.vx = -w.vx; w.vy = -w.vy; w.x *= 0.97; w.y *= 0.97; } });
      k.redraw();
    });
    lp.play();
    st.sp = 1;

    /* main posée contre la paroi (dir = +1 : vient de la gauche) ; colorée par la température */
    function hand(ctx, xw, y, dir, u, Tc, thermal){
      ctx.save(); ctx.translate(xw, y); ctx.scale(dir * u, u);
      var gr;
      if (thermal){
        gr = ctx.createLinearGradient(40, 0, -120, 0);
        gr.addColorStop(0, ccThermal(Tc)); gr.addColorStop(0.35, ccThermal(Tc + (CC_SKIN - Tc) * 0.55)); gr.addColorStop(0.75, ccThermal(CC_SKIN)); gr.addColorStop(1, ccThermal(CC_SKIN));
      } else {
        gr = ctx.createLinearGradient(0, -24, 0, 24); gr.addColorStop(0, "#f2c7a5"); gr.addColorStop(0.6, "#e3a983"); gr.addColorStop(1, "#c98a66");
      }
      /* manche de blouse */
      ctx.fillStyle = "rgba(0,0,0,.16)"; ccRR(ctx, -260, 30, 220, 10, 5); ctx.fill();
      var sl = ctx.createLinearGradient(0, -22, 0, 22); sl.addColorStop(0, "#ffffff"); sl.addColorStop(0.55, "#e7ebf0"); sl.addColorStop(1, "#b9c1cc");
      ctx.fillStyle = sl; ccRR(ctx, -260, -22, 190, 44, 14); ctx.fill(); ctx.strokeStyle = "#a9b2be"; ctx.lineWidth = 1 / u; ctx.stroke();
      /* avant-bras + paume */
      ctx.fillStyle = gr;
      ccRR(ctx, -84, -15, 60, 30, 12); ctx.fill();
      ccEll(ctx, -16, 0, 25, 21); ctx.fill();
      /* pouce (au-dessus) */
      ctx.save(); ctx.translate(-22, -16); ctx.rotate(-0.45); ccRR(ctx, 0, -6, 30, 12, 6); ctx.fill(); ctx.restore();
      /* doigts qui enserrent le bécher (devant le verre) */
      [[-13, 40], [-4, 46], [5, 44], [14, 36]].forEach(function(f){ ccRR(ctx, -6, f[0] - 4.6, f[1] + 6, 9.2, 4.6); ctx.fill(); });
      ctx.strokeStyle = thermal ? "rgba(255,255,255,.35)" : "rgba(120,70,45,.45)"; ctx.lineWidth = 1 / u;
      [[-13, 40], [-4, 46], [5, 44], [14, 36]].forEach(function(f){ ccRR(ctx, -6, f[0] - 4.6, f[1] + 6, 9.2, 4.6); ctx.stroke(); });
      /* ongles */
      if (!thermal){ ctx.fillStyle = "rgba(255,230,220,.8)"; [[-13, 40], [-4, 46], [5, 44], [14, 36]].forEach(function(f){ ccRR(ctx, f[1] - 6, f[0] - 3, 6, 6, 2.5); ctx.fill(); }); }
      ctx.restore();
    }
    function beakerBack(ctx, x0, y0, w, h){
      ctx.save();
      var gb = ctx.createLinearGradient(x0, 0, x0 + w, 0);
      gb.addColorStop(0, "rgba(190,210,230,.30)"); gb.addColorStop(0.5, "rgba(235,245,255,.10)"); gb.addColorStop(1, "rgba(170,195,220,.32)");
      ctx.fillStyle = gb; ctx.fillRect(x0, y0, w, h);
      ctx.restore();
    }
    function beakerFront(ctx, x0, y0, w, h, ry){
      ctx.save();
      ctx.strokeStyle = "rgba(120,150,180,.85)"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + h - ry); ctx.quadraticCurveTo(x0, y0 + h, x0 + ry * 1.5, y0 + h); ctx.lineTo(x0 + w - ry * 1.5, y0 + h); ctx.quadraticCurveTo(x0 + w, y0 + h, x0 + w, y0 + h - ry); ctx.lineTo(x0 + w, y0); ctx.stroke();
      ccEll(ctx, x0 + w / 2, y0, w / 2, ry); ctx.strokeStyle = "rgba(140,170,200,.9)"; ctx.stroke();
      /* bec verseur */
      ctx.beginPath(); ctx.moveTo(x0 + 2, y0 - 1); ctx.quadraticCurveTo(x0 - 7, y0 - 6, x0 - 9, y0 - 2); ctx.stroke();
      /* reflets */
      ctx.fillStyle = "rgba(255,255,255,.38)"; ctx.fillRect(x0 + w * 0.1, y0 + ry + 6, w * 0.05, h - ry * 2 - 14);
      ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(x0 + w * 0.82, y0 + ry + 10, w * 0.03, h - ry * 2 - 22);
      /* graduations */
      ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1;
      for (var q = 1; q <= 4; q++){ var yy = y0 + h - h * 0.92 * (q * 50) / 230; ctx.beginPath(); ctx.moveTo(x0 + w * 0.6, yy); ctx.lineTo(x0 + w * (q % 2 ? 0.7 : 0.76), yy); ctx.stroke(); }
      ctx.restore();
    }
    /* ion dans la loupe, avec sa couche d'hydratation orientée */
    function ion(ctx, x, y, s, sp, rot, wob, isAn){
      var rr = 6.5 * s * sp.r, shell = 4, d = rr + 7 * s;
      for (var k2 = 0; k2 < shell; k2++){
        var a = rot + k2 * 2 * PI / shell + Math.sin(wob + k2) * 0.12, wx = x + Math.cos(a) * d, wy = y + Math.sin(a) * d;
        /* O vers le cation, H vers l'anion */
        water(ctx, wx, wy, s * 0.95, isAn ? a + PI : a, 0.95);
      }
      if (sp.nh4){
        ccBall(ctx, x, y, rr * 0.8, "#3d5fcf");
        for (var h2 = 0; h2 < 4; h2++){ var ah = rot * 1.3 + h2 * PI / 2; ccBall(ctx, x + Math.cos(ah) * rr * 0.75, y + Math.sin(ah) * rr * 0.75, rr * 0.42, "#eef2f7"); }
      } else if (sp.no3){
        for (var o2 = 0; o2 < 3; o2++){ var ao = rot + o2 * 2 * PI / 3; ccBall(ctx, x + Math.cos(ao) * rr * 0.72, y + Math.sin(ao) * rr * 0.72, rr * 0.5, "#d6392f"); }
        ccBall(ctx, x, y, rr * 0.45, "#3d5fcf");
      } else ccBall(ctx, x, y, rr, sp.c);
      S.draw.text({ctx:ctx}, sp.q, x + rr * 0.8, y - rr * 0.85, {size:Math.max(8, 8.5 * s), color:"#0f1b2d", weight:800, halo:"rgba(255,255,255,.85)"});
    }
    /* molécule d'eau : O rouge et deux H ; a = direction dans laquelle pointe l'O */
    function water(ctx, x, y, s, a, al){
      var h1 = a + PI + 0.91, h2 = a + PI - 0.91, d = 4.4 * s;
      ccBall(ctx, x + Math.cos(h1) * d, y + Math.sin(h1) * d, 2.4 * s, "#eef2f7", al);
      ccBall(ctx, x + Math.cos(h2) * d, y + Math.sin(h2) * d, 2.4 * s, "#eef2f7", al);
      ccBall(ctx, x, y, 3.9 * s, "#d6392f", al);
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, t = st.t, p = prog(t), th = thT.value, m = mS.value, V = vS.value;
      var R = [ccMix(0, m, V), ccMix(1, m, V)], Tn = [CC_T0 + R[0].dT * p, CC_T0 + R[1].dT * p];
      /* --- décor : mur carrelé, étagère, paillasse --- */
      var wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, "#e7edf3"); wall.addColorStop(1, "#cfd8e2");
      ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1;
      for (var gx = 0; gx < W; gx += 34){ ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); ctx.stroke(); }
      for (var gy = 0; gy < H; gy += 34){ ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.stroke(); }
      if (th){ ctx.fillStyle = "rgba(10,14,40,.55)"; ctx.fillRect(0, 0, W, H); }
      var benchY = H * 0.8;
      var wood = ctx.createLinearGradient(0, benchY, 0, H); wood.addColorStop(0, "#8a6542"); wood.addColorStop(0.12, "#6d4c30"); wood.addColorStop(1, "#4a321f");
      ctx.fillStyle = wood; ctx.fillRect(0, benchY, W, H - benchY);
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(0, benchY, W, 3);
      if (th){ ctx.fillStyle = "rgba(10,14,40,.45)"; ctx.fillRect(0, benchY, W, H - benchY); }
      /* --- géométrie --- */
      var bw = Math.min(W * 0.27, 150), bh = Math.min(H * 0.42, bw * 1.25), ry = bw * 0.1, yb = benchY - 2, y0 = yb - bh;
      var cxs = [W * 0.27, W * 0.73];
      geo.b = [];
      for (var i = 0; i < 2; i++){
        var cx = cxs[i], x0 = cx - bw / 2, lh = bh * 0.92 * (V + m * 0.45 * p) / 230, ly = yb - lh;
        geo.b.push({x0:x0, x1:x0 + bw, ly:ly, yb:yb});
        /* ombre */
        ctx.save(); ctx.fillStyle = "rgba(0,0,0,.28)"; ccEll(ctx, cx + 6, yb + 3, bw * 0.56, ry * 0.9); ctx.fill(); ctx.restore();
        beakerBack(ctx, x0, y0, bw, bh);
        /* solution */
        var lc = th ? ccThermal(Tn[i]) : null;
        var lg = ctx.createLinearGradient(x0, 0, x0 + bw, 0);
        if (th){ lg.addColorStop(0, ccThermal(Tn[i] - 3, 0.95)); lg.addColorStop(0.45, ccThermal(Tn[i] + 1.5, 0.95)); lg.addColorStop(1, ccThermal(Tn[i] - 4, 0.95)); }
        else { lg.addColorStop(0, "rgba(120,175,220,.55)"); lg.addColorStop(0.5, "rgba(190,225,250,.45)"); lg.addColorStop(1, "rgba(110,160,210,.6)"); }
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x0 + 1, ly); ctx.lineTo(x0 + 1, yb - ry); ctx.quadraticCurveTo(x0 + 1, yb, x0 + ry * 1.5, yb); ctx.lineTo(x0 + bw - ry * 1.5, yb); ctx.quadraticCurveTo(x0 + bw - 1, yb, x0 + bw - 1, yb - ry); ctx.lineTo(x0 + bw - 1, ly); ctx.closePath(); ctx.fill();
        ccEll(ctx, cx, ly, bw / 2 - 1, ry * 0.85); ctx.fillStyle = th ? ccThermal(Tn[i] + 2, 0.9) : "rgba(215,238,252,.75)"; ctx.fill();
        /* ions dissous (points fins qui dérivent) */
        var nd = Math.round(p * 34);
        ctx.fillStyle = th ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.85)";
        for (var d = 0; d < nd; d++){ var dd = st.dots[i][d]; var px = x0 + 6 + (bw - 12) * ((dd.x + 0.04 * Math.sin(t * 0.7 + dd.ph)) % 1), py = ly + 6 + (lh - 14) * ((dd.y + 0.03 * Math.cos(t * 0.5 + dd.ph) + 1) % 1); ctx.fillRect(px, py, 1.8, 1.8); }
        /* tas de cristaux au fond, qui fond */
        var nc = Math.round((t < TP ? 0 : 1 - p) * (4 + m * 0.9));
        for (var q = 0; q < nc; q++){
          var row = Math.floor(Math.sqrt(q)), col = q - row * row, sx = cx + (col - row) * 6.2 + (row % 2) * 1.5, sy = yb - 5 - (Math.sqrt(nc) - row) * 4.6;
          ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.fillRect(sx - 2.6, sy - 2.6, 5.2, 5.2); ctx.strokeStyle = "rgba(150,170,190,.9)"; ctx.lineWidth = 0.8; ctx.strokeRect(sx - 2.6, sy - 2.6, 5.2, 5.2);
        }
        /* sonde du thermomètre */
        var prx = cx + bw * (i ? -0.26 : 0.26);
        var pg = ctx.createLinearGradient(prx - 3, 0, prx + 3, 0); pg.addColorStop(0, "#7d8794"); pg.addColorStop(0.5, "#eef1f4"); pg.addColorStop(1, "#6b7480");
        ctx.fillStyle = pg; ctx.fillRect(prx - 2.5, y0 - 12, 5, yb - y0 - 2); ccBall(ctx, prx, yb - 14, 3.2, "#9aa3ad");
        ctx.fillStyle = "#2b3442"; ccRR(ctx, prx - 5, y0 - 24, 10, 14, 3); ctx.fill();
        /* câble vers l'afficheur (par l'arrière, entre les béchers) */
        var dxp = cx, dyp = benchY + (H - benchY) * 0.5, sgc = i ? -1 : 1;
        ctx.save(); ctx.strokeStyle = "#1f2733"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(prx, y0 - 24); ctx.bezierCurveTo(prx + sgc * 20, y0 - 40, cx + sgc * bw * 0.6, y0 - 10, cx + sgc * bw * 0.6, y0 + bh * 0.4); ctx.lineTo(cx + sgc * bw * 0.6, benchY + 3); ctx.quadraticCurveTo(cx + sgc * bw * 0.6, dyp - 4, cx + sgc * bw * 0.4, dyp - 4); ctx.stroke(); ctx.restore();
        beakerFront(ctx, x0, y0, bw, bh, ry);
        /* étiquette */
        var tw = Math.min(bw * 0.62, 84), tx = cx - tw / 2, ty = y0 + bh * 0.16;
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.2)"; ctx.shadowBlur = 3; ctx.fillStyle = "rgba(255,255,255,.92)"; ccRR(ctx, tx, ty, tw, 22, 4); ctx.fill(); ctx.restore();
        ccT(S, c, CC_SALTS[i].nom, cx, ty + 11, {size:ccFz(c, 13), color:"#0f1b2d", weight:800});
        /* afficheur numérique */
        var dw = Math.min(bw * 0.8, 108), dh = Math.min(44, (H - benchY) * 0.62);
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
        S.draw.display(c, ccF(Tn[i], 1) + " °C", dxp, dyp, {w:dw, h:dh, caption:CC_SALTS[i].use.toUpperCase(), size:Math.min(17, dw * 0.16), screen:Tn[i] > CC_T0 + 0.05 ? "#ffe6cf" : Tn[i] < CC_T0 - 0.05 ? "#d7ecff" : "#e8f3ec", color:Tn[i] > CC_T0 + 0.05 ? "#8a2b00" : Tn[i] < CC_T0 - 0.05 ? "#0b3f7a" : "#13233a"});
        ctx.restore();
      }
      /* --- spatules et cristaux qui tombent --- */
      for (i = 0; i < 2; i++){
        var sx0 = cxs[i], sy0 = y0 - (phone ? 30 : 40), dir = i ? 1 : -1;
        var tilt = t < TP ? Math.min(1, t / (TP * 0.6)) * 0.75 : Math.max(0, 0.75 - (t - TP) * 0.8);
        ctx.save(); ctx.translate(sx0, sy0); ctx.rotate(-dir * tilt);
        var hg = ctx.createLinearGradient(0, -4, 0, 4); hg.addColorStop(0, "#c9d0d8"); hg.addColorStop(0.5, "#8d97a3"); hg.addColorStop(1, "#5d6672");
        ctx.strokeStyle = hg; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(dir * 8, -2); ctx.lineTo(dir * bw * 0.85, -bw * 0.42); ctx.stroke();
        ctx.fillStyle = hg; ccEll(ctx, 0, 0, 11, 5); ctx.fill(); ctx.strokeStyle = "#6b7480"; ctx.lineWidth = 1; ctx.stroke();
        if (t < TP * 0.5){ ctx.fillStyle = "#ffffff"; ccEll(ctx, 0, -3, 8, 4); ctx.fill(); }
        ctx.restore();
        if (t > TP * 0.3 && t < TP + 0.4){
          for (var f = 0; f < 14; f++){
            var tf = (t - TP * 0.3) - f * 0.035; if (tf < 0) continue;
            var fy = sy0 + 4 + 0.5 * 900 * tf * tf, fx = sx0 + Math.sin(f * 2.3) * 5;
            if (fy > geo.b[i].ly) continue;
            ctx.fillStyle = "#ffffff"; ctx.fillRect(fx - 2, fy - 2, 4, 4);
          }
        }
      }
      /* --- mains (teinte caméra thermique) --- */
      var u = bw / 150, hy = yb - bh * 0.36;
      for (i = 0; i < 2; i++){
        var Tc = Tn[i] + (CC_SKIN - Tn[i]) * 0.3;
        hand(ctx, i ? geo.b[1].x1 : geo.b[0].x0, hy, i ? -1 : 1, u, Tc, th);
      }
      /* --- flèches de chaleur (milieu ↔ système) --- */
      if (p > 0.02){
        var ph = t;
        for (i = 0; i < 2; i++){
          var exo = R[i].dH < 0, xw = i ? geo.b[1].x1 : geo.b[0].x0, sgn = i ? 1 : -1, col = exo ? "#ff7a1a" : "#2d8cff";
          var al = Math.min(1, p * 1.6);
          ctx.save(); ctx.globalAlpha = al;
          for (var a = 0; a < 2; a++){
            var yA = hy - 44 * u - a * 30 * u, xin = xw - sgn * 10, xout = xw + sgn * 46 * u + sgn * 8;
            if (exo) ccHeat(S, c, xin, yA, xout, yA - 12 * u, col, ph + a); else ccHeat(S, c, xout, yA - 12 * u, xin, yA, col, ph + a);
          }
          ctx.restore();
          ccT(S, c, exo ? "chaleur → milieu" : "chaleur → système", xw + sgn * 26, y0 - 10, {size:ccFz(c, 11), color:th ? "#ffffff" : col, weight:800, align:i ? "right" : "left", bg:th ? "rgba(10,14,40,.75)" : "rgba(255,255,255,.9)"});
        }
      }
      /* --- barre de couleurs de la caméra --- */
      if (th){
        var cbw = phone ? 96 : 130, cbx = 10, cby = 10;
        for (var cb = 0; cb < cbw; cb++){ ctx.fillStyle = ccThermal(cb / cbw * 60); ctx.fillRect(cbx + cb, cby + 12, 1.2, 7); }
        ccT(S, c, "0 °C", cbx, cby + 4, {size:9.5, color:"#dfe7f2", align:"left", weight:700});
        ccT(S, c, "60 °C", cbx + cbw, cby + 4, {size:9.5, color:"#dfe7f2", align:"right", weight:700});
        ccT(S, c, "30", cbx + cbw / 2, cby + 4, {size:9.5, color:"#dfe7f2", weight:700});
      }
      /* --- viseur et loupe --- */
      if (st.vx == null){ st.vx = cxs[0] - bw * 0.05; st.vy = yb - Math.min(26, bh * 0.2); }
      var LR = phone ? 50 : 70, LX = W / 2, LY = LR + (phone ? 30 : 10);
      var which = -1;
      for (i = 0; i < 2; i++){ var bb = geo.b[i]; if (st.vx > bb.x0 + 2 && st.vx < bb.x1 - 2 && st.vy > bb.ly && st.vy < bb.yb) which = i; }
      st.sp = Math.sqrt((which >= 0 ? Tn[which] + 273.15 : 293.15) / 293.15) * (0.8 + 0.2 * Math.max(0, Math.min(2, (which >= 0 ? Tn[which] : 20) / 20)));
      ctx.save(); ctx.strokeStyle = th ? "rgba(255,255,255,.75)" : "rgba(20,30,50,.7)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(st.vx - 10, st.vy - 6); ctx.lineTo(LX - LR * 0.7, LY + LR * 0.7); ctx.moveTo(st.vx + 10, st.vy - 6); ctx.lineTo(LX + LR * 0.7, LY + LR * 0.7); ctx.stroke();
      ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(st.vx, st.vy, 11, 0, 2 * PI); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(LX, LY, LR + 5, 0, 2 * PI); var rim = ctx.createLinearGradient(LX - LR, LY - LR, LX + LR, LY + LR); rim.addColorStop(0, "#4a5565"); rim.addColorStop(0.5, "#b8c0ca"); rim.addColorStop(1, "#353d49"); ctx.fillStyle = rim; ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(LX, LY, LR, 0, 2 * PI); ctx.clip();
      var Tw = which >= 0 ? Tn[which] : 20;
      ctx.fillStyle = which < 0 ? "#dfe7ef" : (th ? ccThermal(Tw, 1) : "#cfe7f7"); ctx.fillRect(LX - LR, LY - LR, 2 * LR, 2 * LR);
      if (th && which >= 0){ ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillRect(LX - LR, LY - LR, 2 * LR, 2 * LR); }
      var s = LR / 70;
      if (which >= 0){
        var sp = CC_SALTS[which], ni = Math.round(p * (phone ? 5 : 7));
        /* eau libre */
        st.wat.forEach(function(w){ water(ctx, LX + w.x * LR, LY + w.y * LR, s, w.a, 0.9); });
        /* reste du cristal, en bas de la loupe */
        var rows = t < TP ? 3 : Math.max(0, Math.ceil((1 - p) * 3 - 0.05));
        for (var rr2 = 0; rr2 < rows; rr2++) for (var cc2 = -5; cc2 <= 5; cc2++){
          var an = (rr2 + cc2) % 2 !== 0, spc = an ? sp.an : sp.cat, xx = LX + cc2 * 11 * s, yy = LY + LR - 8 * s - rr2 * 11 * s;
          if (sp.ratio === 2) { an = ((rr2 + cc2) % 3 + 3) % 3 !== 0; spc = an ? sp.an : sp.cat; }
          ccBall(ctx, xx, yy, 5.2 * s * spc.r, spc.c);
        }
        /* ions hydratés */
        for (var q2 = 0; q2 < ni; q2++){
          var io = st.ions[which][q2], ix = LX + (io.x + 0.06 * Math.sin(t * 0.8 + io.ph)) * LR, iy = LY + (io.y + 0.05 * Math.cos(t * 0.6 + io.ph)) * LR;
          ion(ctx, ix, iy, s, io.an ? sp.an : sp.cat, io.rot + t * 0.3, t * 3 + io.ph, io.an);
        }
      } else {
        ccT(S, c, "place le viseur", LX, LY - 8, {size:ccFz(c, 11), color:"#2c3a4e", weight:700});
        ccT(S, c, "dans une solution", LX, LY + 8, {size:ccFz(c, 11), color:"#2c3a4e", weight:700});
      }
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(LX, LY, LR - 5, PI * 1.1, PI * 1.4); ctx.stroke(); ctx.restore();
      if (which >= 0) ccT(S, c, "loupe · " + CC_SALTS[which].nom + " · " + ccF(Tn[which], 1) + " °C", LX, LY + LR + 14, {size:ccFz(c, 11), color:"#ffffff", weight:800, bg:"rgba(15,27,45,.82)"});
      ccT(S, c, phone ? "glisse le viseur" : "glisse le viseur dans un bécher", W - 10, phone ? 18 : 16, {size:ccFz(c, 11), color:th ? "rgba(230,236,245,.85)" : "#4a5565", align:"right", weight:600});

      /* ---------- diagrammes d'enthalpie ---------- */
      g.clear();
      var gc = g.ctx, GW = g.W, GH = g.H;
      var pap = gc.createLinearGradient(0, 0, 0, GH); pap.addColorStop(0, "#fbfcfe"); pap.addColorStop(1, "#eef2f7"); gc.fillStyle = pap; gc.fillRect(0, 0, GW, GH);
      var mx = Math.max(Math.abs(R[0].dH), Math.abs(R[1].dH)), top = 34, bot = GH - 14, sc = (bot - top - 26) / mx;
      for (i = 0; i < 2; i++){
        var gx0 = i * GW / 2, gw = GW / 2, exo2 = R[i].dH < 0, L = Math.abs(R[i].dH) * sc;
        var yR = exo2 ? top + 8 : bot - 6, yP = exo2 ? yR + L : yR - L, col2 = exo2 ? "#d4560f" : "#1f6fd1";
        if (i) S.draw.line(g, gx0, 8, gx0, GH - 8, "#dfe5ec", 1);
        ccT(S, g, CC_SALTS[i].nom + (exo2 ? " · exothermique" : " · endothermique"), gx0 + gw / 2, 13, {size:ccFz(g, 12), color:col2, weight:800});
        /* axe H */
        var ax0 = gx0 + 14;
        S.draw.arrow(g, ax0, bot, ax0, top - 8, "#8a95a3", 1.4);
        ccT(S, g, "H", ax0 - 7, top - 2, {size:12, color:"#5f6b7a", math:true, italic:true});
        var lx0 = gx0 + 24, lx1 = gx0 + gw * 0.58;
        S.draw.line(g, lx0, yR, lx1, yR, "#0f1b2d", 2.6);
        var pa = Math.min(1, p * 1.2), yPa = yR + (yP - yR) * pa;
        S.draw.line(g, lx0, yP, lx1, yP, ccRgba(exo2 ? "#d4560f" : "#1f6fd1", 0.25 + 0.75 * pa), 2.6);
        var fs = ccFz(g, 11);
        ccT(S, g, CC_SALTS[i].react, lx0 + 2, yR + (exo2 ? -9 : 10), {size:fs, color:"#0f1b2d", align:"left", weight:700});
        ccT(S, g, CC_SALTS[i].prod, lx0 + 2, yP + (exo2 ? 10 : -9), {size:fs, color:col2, align:"left", weight:700});
        var axr = phone ? gx0 + gw - 12 : gx0 + gw * 0.66, tx2 = phone ? axr - 6 : axr + 7, al2 = phone ? "right" : "left";
        if (Math.abs(yPa - yR) > 2) S.draw.arrow(g, axr, yR, axr, yPa, col2, 3);
        ccT(S, g, "ΔH = " + ccSg(R[i].dH * pa, 2) + " kJ", tx2, (yR + yP) / 2 - 8, {size:ccFz(g, 12), color:col2, align:al2, weight:800});
        ccT(S, g, exo2 ? "cédés au milieu" : "pris au milieu", tx2, (yR + yP) / 2 + 8, {size:ccFz(g, 10.5), color:"#4a5565", align:al2, weight:600});
      }

      /* ---------- afficheurs ---------- */
      ro.set(0, S.fmt(R[0].n * 1000, 1) + " mmol");
      ro.set(1, ccSg(R[0].dH, 2) + " kJ");
      ro.set(2, ccF(R[0].Tf, 1) + " °C");
      ro.set(3, S.fmt(R[1].n * 1000, 1) + " mmol");
      ro.set(4, ccSg(R[1].dH, 2) + " kJ");
      ro.set(5, ccF(R[1].Tf, 1) + " °C");
      var msg = "CaCl₂ : ΔH = " + ccSg(R[0].dH, 2) + " kJ &lt; 0, le système cède " + ccF(-R[0].dH, 2) + " kJ au milieu ; " + S.fmt(V + m, 0) + " g de solution montent de " + ccF(R[0].dT, 1) + " °C et ta main reçoit de la chaleur. " +
        "NH₄NO₃ : ΔH = " + ccSg(R[1].dH, 2) + " kJ &gt; 0, le système prend " + ccF(R[1].dH, 2) + " kJ au milieu : la solution descend de " + ccF(-R[1].dT, 1) + " °C et ta main perd de la chaleur.";
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   2. Le congélateur et l'univers : ΔS du système et du milieu (c05)
   ===================================================================== */
var CC_HFUS = 6010, CC_TF = 273.15, CC_SFUS = CC_HFUS / CC_TF;
function ccUniv(Tc, fus){
  var T = Tc + 273.15, sg = fus ? 1 : -1, dH = sg * CC_HFUS, dSs = sg * CC_SFUS, dSm = -dH / T;
  return {T:T, dH:dH, dSs:dSs, dSm:dSm, dSu:dSs + dSm, dG:dH - T * dSs};
}

SFA.sim({
  id:"ch-entropie-univers", ch:"c05", tag:"Entropie",
  titre:"Le congélateur et l'univers : ΔS du système et du milieu",
  resume:"De l'eau gèle dans une pièce dont tu règles la température : l'entropie du système baisse, celle du milieu monte, et c'est leur somme, ΔS de l'univers, qui décide si la glace se forme ou fond.",
  but:"Tourne le thermostat (ou glisse sur la scène) pour régler la température de la pièce. Regarde l'eau du bocal : sous 0 °C elle gèle, au-dessus la glace fond. La loupe montre les molécules qui s'accrochent au cristal ou s'en détachent. En dessous, les deux barres ΔS(système) et ΔS(milieu) s'additionnent en ΔS(univers).",
  aRetenir:"Pour la congélation de l'eau, ΔS(système) = −ΔH<sub>fus</sub>/T<sub>f</sub> = −22,0 J·K⁻¹·mol⁻¹ < 0 : la glace est plus ordonnée. La chaleur cédée réchauffe la pièce : ΔS(milieu) = −ΔH(système)/T = +6 010/T. La transformation est spontanée si ΔS(univers) = ΔS(système) + ΔS(milieu) > 0, c'est-à-dire sous 0 °C. Lien avec l'enthalpie libre : ΔG = ΔH − TΔS(système) = −T·ΔS(univers).",
  piege:"Une entropie du système qui diminue n'empêche pas une transformation spontanée : il faut regarder l'univers entier. Le milieu gagne d'autant plus d'entropie que T est basse (la même chaleur « désordonne » plus un milieu froid). À 0 °C pile, ΔS(univers) = 0 : glace et eau coexistent, c'est l'équilibre. On suppose ici ΔH et ΔS indépendants de T.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 390 : 400), g = k.canvas(phone ? 380 : 210);
    var st = {f:0, hold:0, t:0, off:0, drag:null, liq:[], snow:[]};
    var tS = k.slider("Température de la pièce", -30, 30, 1, -10, "°C");
    var pS = k.seg("Transformation étudiée", [["cong", "Congélation eau → glace"], ["fus", "Fusion glace → eau"]], "cong");
    var loopT = k.toggle("Recommencer en boucle", true);
    k.button("Remettre de l'eau liquide", function(){ st.f = 0; st.hold = 0; }, true);
    k.button("Remettre de la glace", function(){ st.f = 1; st.hold = 0; });
    var ro = k.readouts(["ΔH (système)", "ΔS système", "ΔS milieu = −ΔH/T", "ΔS univers", "ΔG = −T·ΔS univers", "Dans la pièce"]);
    var nt = k.note("", "ok");
    k.note("Eau : Δ<sub>fus</sub>H = 6,01 kJ/mol à 0 °C, donc Δ<sub>fus</sub>S = 6 010/273,15 = 22,0 J·K⁻¹·mol⁻¹ ; ΔH et ΔS supposés indépendants de T. La pièce est un grand réservoir de chaleur à la température T (en K = °C + 273,15). Valeurs par mole d'eau.", "");
    var seed = 3; function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < 18; i++) st.liq.push({x:rnd() * 2 - 1, y:rnd(), vx:rnd() - 0.5, vy:rnd() - 0.5, a:rnd() * 6.3, va:rnd() - 0.5});
    for (i = 0; i < 40; i++) st.snow.push({x:rnd(), y:rnd(), v:0.3 + rnd() * 0.5, ph:rnd() * 6.3});
    var geo = {};
    function setT(v){ tS.set(Math.round(Math.max(-30, Math.min(30, v)))); }
    c.pointer(function(type, p){
      if (type === "down"){
        var d = geo.dial && Math.hypot(p.x - geo.dial.x, p.y - geo.dial.y) < geo.dial.r + 12;
        st.drag = d ? {mode:"dial"} : {mode:"slide", x:p.x, T:tS.value};
      }
      if (type === "drag" && st.drag){
        if (st.drag.mode === "dial"){
          var a = Math.atan2(p.y - geo.dial.y, p.x - geo.dial.x);   /* −30 °C à 225°, +30 °C à −45° (sens horaire) */
          var deg = a * 180 / PI; if (deg < -90) deg += 360;
          setT(-30 + (225 - deg) / 270 * 60);
        } else setT(st.drag.T + (p.x - st.drag.x) * 0.15);
      }
      if (type === "up") st.drag = null;
    });
    c.cv.style.cursor = "ew-resize";
    var lp = k.loop(function(dt){
      st.t += dt;
      var U = ccUniv(tS.value, false), rate = 0.11 * U.dSu;   /* > 0 : l'eau gèle */
      if (st.hold > 0){ st.hold -= dt; if (st.hold <= 0 && loopT.value){ st.f = st.f >= 1 ? 0 : 1; } }
      else {
        st.f = Math.max(0, Math.min(1, st.f + rate * dt));
        if ((st.f >= 1 && rate > 0) || (st.f <= 0 && rate < 0)) st.hold = 2.5;
      }
      st.rate = st.hold > 0 ? 0 : rate;
      st.off += st.rate * dt * 60;
      st.liq.forEach(function(w){ w.x += w.vx * dt * 0.5; w.y += w.vy * dt * 0.5; w.a += w.va * dt * 3; if (w.x < -1 || w.x > 1) w.vx = -w.vx; if (w.y < 0 || w.y > 1) w.vy = -w.vy; w.x = Math.max(-1, Math.min(1, w.x)); w.y = Math.max(0, Math.min(1, w.y)); });
      st.snow.forEach(function(f){ f.y += f.v * dt * 0.25; if (f.y > 1) { f.y = 0; f.x = Math.random(); } });
      k.redraw();
    });
    lp.play();
    function water(ctx, x, y, s, a, al){
      var h1 = a + PI + 0.91, h2 = a + PI - 0.91, d = 4.6 * s;
      ccBall(ctx, x + Math.cos(h1) * d, y + Math.sin(h1) * d, 2.5 * s, "#eef2f7", al);
      ccBall(ctx, x + Math.cos(h2) * d, y + Math.sin(h2) * d, 2.5 * s, "#eef2f7", al);
      ccBall(ctx, x, y, 4.1 * s, "#d6392f", al);
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, Tc = tS.value, fus = pS.value === "fus", t = st.t;
      var U = ccUniv(Tc, fus), Ucong = ccUniv(Tc, false), cold = Tc < 0;
      /* --- pièce : mur, plinthe, sol, fenêtre --- */
      var wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, cold ? "#dfe6ee" : "#f3e9dc"); wall.addColorStop(1, cold ? "#c6d1dd" : "#e4d4c0");
      ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      var tabY = H * 0.76, floorY = H * 0.9;
      ctx.fillStyle = "#8b6b4e"; ctx.fillRect(0, floorY, W, H - floorY); ctx.fillStyle = "#6f533b"; ctx.fillRect(0, floorY, W, 4);
      var wx0 = 12, wy0 = 14, ww = phone ? W * 0.26 : W * 0.25, wh = phone ? H * 0.36 : H * 0.42;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 6; ctx.fillStyle = "#f7f7f5"; ctx.fillRect(wx0 - 6, wy0 - 6, ww + 12, wh + 12); ctx.restore();
      var sky = ctx.createLinearGradient(0, wy0, 0, wy0 + wh);
      if (cold){ sky.addColorStop(0, "#9fb3c8"); sky.addColorStop(1, "#dfe8f1"); } else { sky.addColorStop(0, "#5fa8e8"); sky.addColorStop(1, "#cfe8fb"); }
      ctx.fillStyle = sky; ctx.fillRect(wx0, wy0, ww, wh);
      ctx.save(); ctx.beginPath(); ctx.rect(wx0, wy0, ww, wh); ctx.clip();
      if (!cold){ S.draw.glow(c, wx0 + ww * 0.72, wy0 + wh * 0.25, 26, "#fff3a0", 0.9); ccBall(ctx, wx0 + ww * 0.72, wy0 + wh * 0.25, 9, "#ffd84d"); }
      ctx.fillStyle = cold ? "#f4f8fc" : "#5aa64b"; ctx.beginPath(); ctx.moveTo(wx0, wy0 + wh * 0.78); ctx.quadraticCurveTo(wx0 + ww * 0.5, wy0 + wh * 0.66, wx0 + ww, wy0 + wh * 0.76); ctx.lineTo(wx0 + ww, wy0 + wh); ctx.lineTo(wx0, wy0 + wh); ctx.fill();
      /* sapin */
      var trx = wx0 + ww * 0.28, trY = wy0 + wh * 0.74;
      ctx.fillStyle = "#5b3b22"; ctx.fillRect(trx - 2, trY - 8, 4, 10);
      ctx.fillStyle = "#2f6b3a"; ctx.beginPath(); ctx.moveTo(trx, trY - wh * 0.42); ctx.lineTo(trx - ww * 0.12, trY - 6); ctx.lineTo(trx + ww * 0.12, trY - 6); ctx.fill();
      if (cold){
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(trx, trY - wh * 0.42); ctx.lineTo(trx - ww * 0.05, trY - wh * 0.28); ctx.lineTo(trx + ww * 0.05, trY - wh * 0.28); ctx.fill();
        var ns = Math.round(Math.min(40, -Tc * 2 + 6));
        ctx.fillStyle = "rgba(255,255,255,.95)";
        for (var q = 0; q < ns; q++){ var sf = st.snow[q]; ctx.beginPath(); ctx.arc(wx0 + ((sf.x + 0.03 * Math.sin(t + sf.ph)) % 1) * ww, wy0 + sf.y * wh, 1.6, 0, 2 * PI); ctx.fill(); }
        if (Tc < -5){ var fr = ctx.createRadialGradient(wx0 + ww / 2, wy0 + wh / 2, Math.min(ww, wh) * 0.3, wx0 + ww / 2, wy0 + wh / 2, Math.max(ww, wh) * 0.75); fr.addColorStop(0, "rgba(255,255,255,0)"); fr.addColorStop(1, "rgba(255,255,255," + Math.min(0.7, (-Tc - 5) / 30) + ")"); ctx.fillStyle = fr; ctx.fillRect(wx0, wy0, ww, wh); }
      }
      ctx.restore();
      ctx.strokeStyle = "#e9e9e6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx0 + ww / 2, wy0); ctx.lineTo(wx0 + ww / 2, wy0 + wh); ctx.moveTo(wx0, wy0 + wh * 0.45); ctx.lineTo(wx0 + ww, wy0 + wh * 0.45); ctx.stroke();
      /* --- thermostat mural --- */
      var dr = phone ? 26 : 30, dx = wx0 + ww / 2, dy = wy0 + wh + 22 + dr;
      geo.dial = {x:dx, y:dy, r:dr};
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
      var dg = ctx.createRadialGradient(dx - dr * 0.3, dy - dr * 0.3, 2, dx, dy, dr + 8); dg.addColorStop(0, "#ffffff"); dg.addColorStop(1, "#b9c1cc");
      ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(dx, dy, dr + 7, 0, 2 * PI); ctx.fill(); ctx.restore();
      for (var tk = -30; tk <= 30; tk += 10){
        var ta = (225 - (tk + 30) / 60 * 270) * PI / 180;
        ctx.strokeStyle = tk < 0 ? "#2f6fd1" : tk > 0 ? "#d4560f" : "#0f1b2d"; ctx.lineWidth = tk === 0 ? 2.4 : 1.4;
        ctx.beginPath(); ctx.moveTo(dx + Math.cos(ta) * (dr + 1), dy - Math.sin(ta) * (dr + 1)); ctx.lineTo(dx + Math.cos(ta) * (dr + 6), dy - Math.sin(ta) * (dr + 6)); ctx.stroke();
      }
      var na = (225 - (Tc + 30) / 60 * 270) * PI / 180;
      ccBall(ctx, dx, dy, dr * 0.78, cold ? "#7fa7d9" : "#e59a62");
      S.draw.line(c, dx, dy, dx + Math.cos(na) * dr * 0.7, dy - Math.sin(na) * dr * 0.7, "#0f1b2d", 3);
      ccBall(ctx, dx, dy, 3.5, "#0f1b2d");
      ccT(S, c, ccSg(Tc, 0) + " °C", dx, dy + dr + 18, {size:ccFz(c, 13), color:"#0f1b2d", weight:800, bg:"rgba(255,255,255,.9)"});
      /* --- table --- */
      var tw = ctx.createLinearGradient(0, tabY, 0, tabY + 14); tw.addColorStop(0, "#a27a52"); tw.addColorStop(1, "#6f5034");
      ctx.fillStyle = tw; ctx.fillRect(W * 0.28, tabY, W * 0.72, 14);
      ctx.fillStyle = "#5e4430"; ctx.fillRect(W * 0.33, tabY + 14, 10, floorY - tabY - 14); ctx.fillRect(W - 24, tabY + 14, 10, floorY - tabY - 14);
      /* --- bocal (objet principal) --- */
      var jx = phone ? W * 0.55 : W * 0.5, jw = phone ? W * 0.32 : Math.min(W * 0.3, 170), jh = phone ? H * 0.46 : H * 0.55, jb = tabY - 1, jt = jb - jh, ery = jw * 0.12, x0 = jx - jw / 2;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.25)"; ccEll(ctx, jx + 8, jb + 2, jw * 0.58, ery * 0.8); ctx.fill(); ctx.restore();
      var hl0 = jh * 0.62, f = st.f, hw = hl0 * (1 - f), hi = hl0 * f * 1.09, yIce = jb - hw - hi, yInt = jb - hw;
      /* verre arrière */
      ctx.fillStyle = "rgba(200,220,240,.25)"; ctx.fillRect(x0, jt, jw, jh);
      /* eau liquide */
      if (hw > 0.5){
        var lg = ctx.createLinearGradient(x0, 0, x0 + jw, 0); lg.addColorStop(0, "rgba(70,140,200,.75)"); lg.addColorStop(0.45, "rgba(140,195,235,.6)"); lg.addColorStop(1, "rgba(60,120,185,.8)");
        ctx.fillStyle = lg; ctx.fillRect(x0 + 1, yInt, jw - 2, hw - ery * 0.5); ccEll(ctx, jx, jb - ery * 0.5, jw / 2 - 1, ery * 0.6); ctx.fill();
      }
      /* glace (au-dessus : elle flotte et gèle par la surface) */
      if (hi > 0.5){
        var ig = ctx.createLinearGradient(x0, 0, x0 + jw, 0); ig.addColorStop(0, "rgba(205,228,245,.95)"); ig.addColorStop(0.4, "rgba(245,251,255,.95)"); ig.addColorStop(1, "rgba(185,212,235,.95)");
        ctx.fillStyle = ig; ctx.fillRect(x0 + 1, yIce, jw - 2, hi);
        ctx.save(); ctx.beginPath(); ctx.rect(x0 + 1, yIce, jw - 2, hi); ctx.clip();
        ctx.strokeStyle = "rgba(140,180,215,.55)"; ctx.lineWidth = 1;
        for (var cr = 0; cr < 7; cr++){ var cxr = x0 + jw * (0.12 + cr * 0.13), cyr = yIce + hi * ((cr * 37) % 10) / 10; ctx.beginPath(); ctx.moveTo(cxr, cyr); ctx.lineTo(cxr + 9, cyr + 6); ctx.lineTo(cxr + 4, cyr + 14); ctx.stroke(); }
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0 + 2, yInt); ctx.lineTo(x0 + jw - 2, yInt); ctx.stroke();
      }
      /* surface du haut */
      ccEll(ctx, jx, yIce, jw / 2 - 1, ery * 0.85); ctx.fillStyle = hi > 0.5 ? "rgba(235,246,255,.98)" : "rgba(175,215,242,.85)"; ctx.fill();
      /* verre avant */
      ctx.strokeStyle = "rgba(120,150,180,.9)"; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x0, jt); ctx.lineTo(x0, jb - ery); ctx.quadraticCurveTo(x0, jb + ery * 0.4, jx, jb + ery * 0.4); ctx.quadraticCurveTo(x0 + jw, jb + ery * 0.4, x0 + jw, jb - ery); ctx.lineTo(x0 + jw, jt); ctx.stroke();
      ccEll(ctx, jx, jt, jw / 2, ery); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(x0 + jw * 0.1, jt + ery + 6, jw * 0.05, jh - ery * 2 - 12);
      ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(x0 + jw * 0.84, jt + ery + 10, jw * 0.03, jh - ery * 2 - 20);
      if (Tc < 0) { ctx.fillStyle = "rgba(255,255,255," + Math.min(0.35, -Tc / 60) + ")"; ctx.fillRect(x0, jt, jw, jh); }
      ccT(S, c, Math.round(f * 100) + " % de glace", jx, jt - ery - 12, {size:ccFz(c, 12), color:"#0f1b2d", weight:800, bg:"rgba(255,255,255,.9)"});
      /* --- flèches de chaleur entre le bocal et la pièce --- */
      var rate = st.rate || 0;
      if (Math.abs(rate) > 1e-4){
        var al = Math.min(1, Math.abs(rate) * 6 + 0.35), out = rate > 0;
        ctx.save(); ctx.globalAlpha = al;
        for (var sd = -1; sd <= 1; sd += 2) for (var a2 = 0; a2 < 2; a2++){
          var yA = yInt - 10 + a2 * 26, xa = jx + sd * (jw / 2 + 6), xb = jx + sd * (jw / 2 + (phone ? 34 : 46));
          if (out) ccHeat(S, c, xa, yA, xb, yA - 10, "#ff7a1a", t + a2); else ccHeat(S, c, xb, yA - 10, xa, yA, "#ff7a1a", t + a2);
        }
        ctx.restore();
        ccT(S, c, out ? "chaleur cédée à la pièce" : "chaleur prise à la pièce", jx, jb + (phone ? 22 : 26), {size:ccFz(c, 11.5), color:"#b4460c", weight:800, bg:"rgba(255,255,255,.9)"});
      } else if (Tc === 0) ccT(S, c, "0 °C : glace et eau coexistent", jx, jb + (phone ? 22 : 26), {size:ccFz(c, 11.5), color:"#24775a", weight:800, bg:"rgba(255,255,255,.9)"});
      /* --- loupe sur l'interface glace / eau --- */
      var LR = phone ? 56 : 76, LX = phone ? W - LR - 8 : W - LR - 14, LY = phone ? LR + 12 : LR + 18;
      var vx = jx + jw * 0.18, vy = hi > 0.5 && hw > 0.5 ? yInt : (hi > 0.5 ? jb - 14 : yIce + 14);
      ctx.save(); ctx.strokeStyle = "rgba(20,30,50,.55)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(vx, vy - 9); ctx.lineTo(LX - LR * 0.6, LY + LR * 0.8); ctx.moveTo(vx + 9, vy); ctx.lineTo(LX + LR * 0.2, LY + LR * 0.98); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(vx, vy, 9, 0, 2 * PI); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(LX, LY, LR + 5, 0, 2 * PI);
      var rim = ctx.createLinearGradient(LX - LR, LY - LR, LX + LR, LY + LR); rim.addColorStop(0, "#4a5565"); rim.addColorStop(0.5, "#c3cad3"); rim.addColorStop(1, "#353d49"); ctx.fillStyle = rim; ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(LX, LY, LR, 0, 2 * PI); ctx.clip();
      var sL = LR / 76, b = 21 * sL, YI = LY + (hi > 0.5 && hw > 0.5 ? 0 : (hi > 0.5 ? LR * 2 : -LR * 2));
      var bgL = ctx.createLinearGradient(0, LY - LR, 0, LY + LR); bgL.addColorStop(0, "#e8f3fb"); bgL.addColorStop(Math.max(0, Math.min(1, (YI - LY + LR) / (2 * LR))), "#d9ecf8"); bgL.addColorStop(Math.max(0, Math.min(1, (YI - LY + LR + b) / (2 * LR))), "#a9d2ee"); bgL.addColorStop(1, "#8fc3e8");
      ctx.fillStyle = bgL; ctx.fillRect(LX - LR, LY - LR, 2 * LR, 2 * LR);
      /* eau liquide : molécules désordonnées sous l'interface */
      st.liq.forEach(function(w){ var yy = YI + b * 1.2 + w.y * (LY + LR - YI - b * 1.2); if (yy < LY + LR + 6) water(ctx, LX + w.x * LR, yy, sL, w.a + t * w.va, 1); });
      /* glace : réseau hexagonal qui avance (gel) ou recule (fusion) */
      var per = 3 * b, off = ((st.off * sL) % per + per) % per, sites = [];
      for (var j = -2; j < 40; j++){
        var yA0 = YI - j * 1.5 * b + off - per;
        if (yA0 < LY - LR - 2 * b) break;
        for (var ii = -6; ii <= 6; ii++){
          var xA = LX + ii * Math.sqrt(3) * b + ((j % 2 + 2) % 2 ? Math.sqrt(3) * b / 2 : 0);
          sites.push([xA, yA0, (ii * 7 + j * 3 + 40) % 3]); sites.push([xA, yA0 - b, (ii * 5 + j + 41) % 3]);
        }
      }
      var vis = sites.filter(function(p){ return p[1] < YI + b && Math.abs(p[0] - LX) < LR + 10; });
      ctx.save(); ctx.setLineDash([2, 3]); ctx.strokeStyle = "rgba(40,90,150,.55)"; ctx.lineWidth = 1;
      for (var a3 = 0; a3 < vis.length; a3++) for (var b3 = a3 + 1; b3 < vis.length; b3++){
        var P = vis[a3], Q = vis[b3]; if (P[1] > YI || Q[1] > YI) continue;
        var dd = Math.hypot(P[0] - Q[0], P[1] - Q[1]); if (dd < b * 1.05 && dd > b * 0.9){ ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(Q[0], Q[1]); ctx.stroke(); }
      }
      ctx.restore();
      vis.forEach(function(P, idx){
        var o = Math.max(0, Math.min(1, 1 - (P[1] - YI) / b)), jit = (1 - o) * 10 * sL;
        var px = P[0] + jit * Math.sin(t * 5 + idx * 1.7), py = P[1] + jit * Math.cos(t * 4.3 + idx * 2.3);
        /* les deux H pointent vers deux des trois voisines (liaisons H du réseau) */
        var dirs = [], up = Math.abs((P[1] - YI) % (1.5 * b));
        sites.forEach(function(Q){ var d2 = Math.hypot(P[0] - Q[0], P[1] - Q[1]); if (d2 > b * 0.9 && d2 < b * 1.05) dirs.push(Math.atan2(Q[1] - P[1], Q[0] - P[0])); });
        var ang = t * 2 + idx;
        if (dirs.length >= 3){ dirs.sort(); var k1 = P[2], d1 = dirs[(k1 + 1) % 3], d2b = dirs[(k1 + 2) % 3]; var mx = Math.cos(d1) + Math.cos(d2b), my = Math.sin(d1) + Math.sin(d2b); var la = Math.atan2(my, mx) + PI; ang = o > 0.98 ? la : la + (1 - o) * (t * 3 + idx); }
        water(ctx, px, py, sL * 0.85, ang, 1);
      });
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(LX, LY, LR - 5, PI * 1.1, PI * 1.4); ctx.stroke(); ctx.restore();
      if (hi > 0.5 && hw > 0.5){
        ccT(S, c, "glace", LX + LR * 0.55, LY - LR * 0.6, {size:ccFz(c, 11), color:"#0f1b2d", weight:800, bg:"rgba(255,255,255,.85)"});
        ccT(S, c, "eau", LX + LR * 0.55, LY + LR * 0.62, {size:ccFz(c, 11), color:"#0f1b2d", weight:800, bg:"rgba(255,255,255,.85)"});
      }
      var lab = rate > 1e-4 ? "les molécules s'accrochent" : rate < -1e-4 ? "les molécules se détachent" : (hi > 0.5 && hw > 0.5 ? "autant s'accrochent que se détachent" : (hi > 0.5 ? "tout est gelé" : "tout est liquide"));
      ccT(S, c, lab, phone ? W - 6 : LX, LY + LR + 15, {size:ccFz(c, 11), color:"#ffffff", weight:800, bg:"rgba(15,27,45,.82)", align:phone ? "right" : "center"});
      if (!phone) ccT(S, c, "⟷ glisse sur la scène ou tourne le thermostat", W - 12, H - 10, {size:11, color:"#f3eee8", align:"right", weight:600});

      /* ---------- les barres d'entropie et ΔS univers(T) ---------- */
      g.clear();
      var gc = g.ctx, GW = g.W, GH = g.H;
      gc.fillStyle = "#fbfcfe"; gc.fillRect(0, 0, GW, GH);
      var bx0 = 0, bw2 = phone ? GW : GW * 0.5, bh2 = phone ? GH * 0.52 : GH;
      var y0b = phone ? 30 : 30, y1b = bh2 - 16, ymid = (y0b + y1b) / 2, sc = (y1b - y0b) / 2 / 28;
      var axL = bx0 + 38;
      S.draw.line(g, axL, ymid, bx0 + bw2 - 8, ymid, "#8a95a3", 1.2);
      S.draw.line(g, axL, y0b, axL, y1b, "#8a95a3", 1.2);
      [-20, -10, 10, 20].forEach(function(v){ S.draw.line(g, axL - 3, ymid - v * sc, axL, ymid - v * sc, "#8a95a3", 1); ccT(S, g, (v > 0 ? "+" : "−") + Math.abs(v), axL - 5, ymid - v * sc, {size:9.5, color:"#7b8694", align:"right", weight:600}); S.draw.line(g, axL, ymid - v * sc, bx0 + bw2 - 8, ymid - v * sc, "#eef1f5", 1); });
      ccT(S, g, "ΔS (J·K⁻¹·mol⁻¹)", axL + 4, 12, {size:ccFz(g, 11), color:"#2c3a4e", align:"left", weight:700});
      var colW = (bx0 + bw2 - 8 - axL) / 3, bwid = Math.min(46, colW * 0.5);
      function bar(cx, ya, yb, col, alpha){ var y1 = Math.min(ya, yb), h = Math.abs(yb - ya); var gr = gc.createLinearGradient(cx - bwid / 2, 0, cx + bwid / 2, 0); gr.addColorStop(0, ccShade(col, -0.2)); gr.addColorStop(0.4, ccShade(col, 0.25)); gr.addColorStop(1, ccShade(col, -0.35)); gc.save(); gc.globalAlpha = alpha; gc.fillStyle = gr; gc.fillRect(cx - bwid / 2, y1, bwid, Math.max(1, h)); gc.restore(); }
      var cS = axL + colW * 0.5, cM = axL + colW * 1.5, cU = axL + colW * 2.5;
      var ySys = ymid - U.dSs * sc, yMil = ymid - U.dSm * sc;
      bar(cS, ymid, ySys, "#2f6fd1", 1);
      bar(cM, ymid, yMil, "#e07a1f", 1);
      /* addition tête-à-queue dans la colonne univers */
      bar(cU - bwid * 0.28, ymid, ySys, "#2f6fd1", 0.35);
      bar(cU + bwid * 0.28, ySys, ySys - U.dSm * sc, "#e07a1f", 0.35);
      var good = U.dSu > 0.005, uc = Math.abs(U.dSu) < 0.005 ? "#5f6b7a" : good ? "#24775a" : "#c0321d";
      gc.save(); gc.fillStyle = uc; gc.fillRect(cU - bwid / 2 - 4, Math.min(ymid, ymid - U.dSu * sc), bwid + 8, Math.max(2.5, Math.abs(U.dSu * sc))); gc.restore();
      S.draw.line(g, cU - bwid, ySys, cU + bwid * 0.6, ySys, "#2f6fd1", 1, [3, 3]);
      var fsb = ccFz(g, 11.5);
      ccT(S, g, ccSg(U.dSs, 2), cS, ySys + (U.dSs < 0 ? 11 : -11), {size:fsb, color:"#1f4b9e", weight:800});
      ccT(S, g, ccSg(U.dSm, 2), cM, yMil + (U.dSm < 0 ? 11 : -11), {size:fsb, color:"#a2510f", weight:800});
      var yUl = U.dSu >= 0 ? ymid - U.dSu * sc - 13 : ymid - U.dSu * sc + 13;
      ccT(S, g, ccSg(U.dSu, 2), cU, yUl, {size:fsb, color:uc, weight:800, bg:"rgba(255,255,255,.92)"});
      ccT(S, g, "système", cS, y1b + 8, {size:ccFz(g, 11), color:"#1f4b9e", weight:700});
      ccT(S, g, "milieu", cM, y1b + 8, {size:ccFz(g, 11), color:"#a2510f", weight:700});
      ccT(S, g, "univers", cU, y1b + 8, {size:ccFz(g, 11), color:uc, weight:800});
      ccT(S, g, "+", (cS + cM) / 2, ymid + 14, {size:16, color:"#5f6b7a", weight:800});
      ccT(S, g, "=", (cM + cU) / 2 - 6, ymid + 14, {size:16, color:"#5f6b7a", weight:800});
      /* courbe ΔS univers(T) */
      var gax = phone ? S.draw.axes(g, {x0:-30, x1:30, y0:-3.2, y1:3.2, l:44, r:12, t:bh2 + 18, b:30, yl:"ΔS univers", stepX:10, stepY:1})
                      : S.draw.axes(g, {x0:-30, x1:30, y0:-3.2, y1:3.2, l:GW * 0.5 + 44, r:12, t:16, b:30, yl:"ΔS univers", stepX:10, stepY:1});
      ccT(S, g, "T (°C)", gax.R, gax.Y(0) + 27, {size:11, color:"#2c3a4e", align:"right", weight:700, halo:true});
      var fU = function(x){ return ccUniv(x, fus).dSu; };
      S.draw.area(g, gax, function(x){ return Math.max(0, fU(x)); }, -30, 30, "#24775a", 0.18);
      S.draw.area(g, gax, function(x){ return Math.min(0, fU(x)); }, -30, 30, "#c0321d", 0.14);
      S.draw.fn(g, gax, fU, "#0f1b2d", 2.2);
      S.draw.dot(g, gax.X(Tc), gax.Y(U.dSu), 6, uc);
      ccT(S, g, "spontanée", fus ? gax.X(19) : gax.X(-19), gax.Y(1.0), {size:ccFz(g, 10.5), color:"#24775a", weight:800, halo:true});
      ccT(S, g, "non spontanée", fus ? gax.X(-17) : gax.X(17), gax.Y(-1.0), {size:ccFz(g, 10.5), color:"#c0321d", weight:800, halo:true});

      /* ---------- afficheurs ---------- */
      ro.set(0, ccSg(U.dH / 1000, 2) + " kJ/mol");
      ro.set(1, ccSg(U.dSs, 2) + " J/(K·mol)");
      ro.set(2, ccSg(U.dSm, 2) + " J/(K·mol)");
      ro.set(3, ccSg(U.dSu, 2) + " J/(K·mol)");
      ro.set(4, ccSg(U.dG / 1000, 3) + " kJ/mol");
      ro.set(5, Tc < 0 ? "l'eau gèle" : Tc > 0 ? "la glace fond" : "équilibre");
      var nm = fus ? "fusion" : "congélation", sp = Math.abs(U.dSu) < 0.005 ? null : U.dSu > 0;
      var msg = "À " + ccSg(Tc, 0) + " °C (T = " + ccF(U.T, 2) + " K), pour la " + nm + " : ΔS(système) = " + ccSg(U.dSs, 2) + ", ΔS(milieu) = " + (fus ? "−" : "+") + "6 010/" + ccF(U.T, 2) + " = " + ccSg(U.dSm, 2) + ", donc ΔS(univers) = " + ccSg(U.dSu, 2) + " J·K⁻¹·mol⁻¹. " +
        (sp === null ? "La somme est nulle : glace et eau sont en équilibre." : sp ? "La somme est positive : la " + nm + " est spontanée." : "La somme est négative : la " + nm + " n'a pas lieu, c'est la transformation inverse qui se produit.");
      if (msg !== nt._m){ nt.set(msg, sp === false ? "warn" : "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   3. G en fonction de l'avancement : pourquoi la réaction n'est pas totale (c05)
   ===================================================================== */
/* A(g) ⇌ B(g), 1 mol de A au départ, p totale = 1 bar, gaz parfaits ; G mesuré à partir de A pur (μ°A = 0) */
function ccG(x, dG0, T){ var RT = R_GP * T; return x * dG0 + RT * ((x > 0 ? x * Math.log(x) : 0) + (x < 1 ? (1 - x) * Math.log(1 - x) : 0)); }
function ccdG(x, dG0, T){ return dG0 + R_GP * T * Math.log(x / (1 - x)); }

SFA.sim({
  id:"ch-minimum-g", ch:"c05", tag:"Enthalpie libre",
  titre:"G en fonction de l'avancement : pourquoi la réaction n'est pas totale",
  resume:"Une bille roule sur la courbe G(ξ) de la réaction A ⇌ B et s'arrête au fond : c'est l'équilibre. En dessous, une boîte de molécules montre la composition. Règle ΔrG° et regarde le minimum glisser vers A ou vers B.",
  but:"Lâche la bille depuis A pur ou B pur, ou attrape-la et pose-la où tu veux : elle descend toujours vers le minimum de G. La pente sous la bille vaut ΔrG = ΔrG° + RT ln Q. Règle ΔrG° et T : le fond de la vallée se déplace et K = e<sup>−ΔrG°/RT</sup> se lit au minimum. Glisse sur la boîte pour la faire tourner.",
  aRetenir:"À T et p constantes, une réaction avance tant que G diminue. La pente de G(ξ) est ΔrG = ΔrG° + RT·ln Q : négative, la réaction avance (→) ; positive, elle recule (←) ; nulle au minimum, c'est l'équilibre, où Q = K et ΔrG° = −RT·ln K. Pour A ⇌ B, ξ<sub>éq</sub> = K/(1 + K). ΔrG° < 0 place le minimum du côté des produits (K > 1), ΔrG° > 0 du côté des réactifs (K < 1).",
  piege:"Le signe de ΔrG° ne dit pas si la réaction « se fait » : même avec ΔrG° > 0, un peu de B se forme, car le mélange abaisse G (terme RT[ξ ln ξ + (1 − ξ) ln(1 − ξ)]). C'est ΔrG (avec Q), pas ΔrG°, qui donne le sens d'évolution. À l'équilibre la réaction ne s'arrête pas : A → B et B → A continuent à la même vitesse.",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 540 : 500);
    var st = {x:0.02, v:0, hold:0, from:0, drag:null, a:0.6, b:0.32, spin:true, t:0, mol:[], flash:0};
    var gS = k.slider("ΔrG° de A → B", -12, 12, 0.5, -4, "kJ/mol");
    var tS = k.slider("Température T", 250, 600, 1, 298, "K");
    var loopT = k.toggle("Relancer la bille en boucle", true);
    k.button("Lâcher depuis A pur", function(){ drop(0); }, true);
    k.button("Lâcher depuis B pur", function(){ drop(1); });
    var ro = k.readouts(["K = e^(−ΔrG°/RT)", "ξ à l'équilibre = K/(1 + K)", "ξ sous la bille", "Q = p(B)/p(A) sous la bille", "Pente ΔrG = ΔrG° + RT ln Q", "G au minimum = −RT ln(1 + K)"]);
    var nt = k.note("", "ok");
    k.note("Réaction A(g) ⇌ B(g) entre deux isomères, 1 mol de A au départ, p totale = 1 bar, gaz parfaits. G est compté à partir de A pur : G(ξ) = ξ·ΔrG° + RT[ξ ln ξ + (1 − ξ) ln(1 − ξ)]. R = 8,314 J·K⁻¹·mol⁻¹.", "");
    var N = phone ? 36 : 44;
    for (var i = 0; i < N; i++) st.mol.push({p:[Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], v:[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], B:false, fl:0});
    function drop(side){ st.x = side ? 0.98 : 0.02; st.v = 0; st.hold = 0; st.from = side; }
    var geo = {};
    function X(x){ return geo.gx0 + x * geo.gw; }
    function Yg(G){ return geo.gy0 + (geo.Gt - G) * geo.sy; }
    c.pointer(function(type, p){
      if (type === "down"){
        var bx = X(st.x), by = Yg(ccG(st.x, gS.value * 1000, tS.value)) - geo.br;
        if (Math.hypot(p.x - bx, p.y - by) < geo.br + 16 || (p.y < geo.gyb && p.y > geo.gy0 - 10)) st.drag = {m:"ball"};
        else st.drag = {m:"box", lx:p.x, ly:p.y};
      }
      if (type === "drag" && st.drag){
        if (st.drag.m === "ball"){ st.x = Math.max(0.004, Math.min(0.996, (p.x - geo.gx0) / geo.gw)); st.v = 0; st.hold = 0; }
        else { st.a += (p.x - st.drag.lx) * 0.012; st.b = Math.max(-1.2, Math.min(1.2, st.b + (p.y - st.drag.ly) * 0.012)); st.drag.lx = p.x; st.drag.ly = p.y; st.spin = false; }
      }
      if (type === "up") st.drag = null;
    });
    c.cv.style.cursor = "grab";
    var lp = k.loop(function(dt){
      st.t += dt;
      var dG0 = gS.value * 1000, T = tS.value, K = Math.exp(-dG0 / (R_GP * T)), xe = K / (1 + K);
      if (!(st.drag && st.drag.m === "ball") && geo.gw){
        /* bille sur un rail : x'' = −g·h'/(1 + h'²) − γx' (coordonnées écran) */
        var gpx = 1400, gam = 2.2, n = 10, h = dt / n;
        for (var j = 0; j < n; j++){
          var hp = geo.sy * ccdG(st.x, dG0, T) / geo.gw;
          var acc = -gpx * hp / (1 + hp * hp) - gam * st.v;
          st.v += acc * h; st.x += st.v * h / geo.gw;
          if (st.x < 0.002){ st.x = 0.002; st.v = Math.abs(st.v) * 0.3; }
          if (st.x > 0.998){ st.x = 0.998; st.v = -Math.abs(st.v) * 0.3; }
        }
        if (Math.abs(st.v) < 6 && Math.abs(st.x - xe) < 0.012){ st.hold += dt; if (st.hold > 2.6 && loopT.value) drop(1 - st.from); }
        else st.hold = 0;
      }
      if (st.spin) st.a += dt * 0.25;
      /* molécules de la boîte : composition = celle sous la bille */
      var nb = 0; st.mol.forEach(function(m){ if (m.B) nb++; m.fl = Math.max(0, m.fl - dt * 2); for (var q = 0; q < 3; q++){ m.p[q] += m.v[q] * dt * 0.9; if (m.p[q] > 1 || m.p[q] < -1){ m.v[q] = -m.v[q]; m.p[q] = Math.max(-1, Math.min(1, m.p[q])); } } });
      var target = Math.round(st.x * N);
      st.flash += dt;
      if (st.flash > 0.06 && nb !== target){
        st.flash = 0; var want = nb < target, cand = st.mol.filter(function(m){ return m.B !== want; });
        if (cand.length){ var m = cand[(Math.random() * cand.length) | 0]; m.B = want; m.fl = 1; }
      } else if (st.flash > 0.7 && nb === target && target > 0 && target < N){
        /* équilibre dynamique : un A devient B pendant qu'un B devient A */
        st.flash = 0; var As = st.mol.filter(function(m){ return !m.B; }), Bs = st.mol.filter(function(m){ return m.B; });
        var m1 = As[(Math.random() * As.length) | 0], m2 = Bs[(Math.random() * Bs.length) | 0]; m1.B = true; m2.B = false; m1.fl = 1; m2.fl = 1;
      }
      k.redraw();
    });
    lp.play();

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, dG0 = gS.value * 1000, T = tS.value, RT = R_GP * T;
      var K = Math.exp(-dG0 / RT), xe = K / (1 + K), Gmin = -RT * Math.log(1 + K), x = st.x, Gx = ccG(x, dG0, T), slope = ccdG(x, dG0, T), Q = x / (1 - x);
      /* fond */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f6f8fc"); bg.addColorStop(1, "#e6ebf3"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* --- repère de G(ξ) --- */
      var top = 30, gyb = phone ? H * 0.5 : H * 0.56, gx0 = phone ? 46 : 58, gw = W - gx0 - (phone ? 18 : 26);
      var Ghi = Math.max(0, dG0), span = Ghi - Gmin, Gt = Ghi + span * 0.22, Gb = Gmin - span * 0.12;
      geo.gx0 = gx0; geo.gw = gw; geo.gy0 = top; geo.gyb = gyb; geo.Gt = Gt; geo.sy = (gyb - top) / (Gt - Gb); geo.br = phone ? 11 : 13;
      ctx.fillStyle = "#ffffff"; ccRR(ctx, gx0 - 8, top - 18, gw + 16, gyb - top + 26, 10); ctx.fill(); ctx.strokeStyle = "#dfe5ec"; ctx.lineWidth = 1; ctx.stroke();
      /* graduations de G */
      var stp = [0.2, 0.5, 1, 2, 5].map(function(v){ return v * 1000; }).filter(function(v){ return (Gt - Gb) / v <= 7; })[0] || 5000;
      ctx.save(); ctx.font = "600 10px Mulish, system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var gv = Math.ceil(Gb / stp) * stp; gv <= Gt; gv += stp){
        var yy = Yg(gv); ctx.strokeStyle = Math.abs(gv) < 1e-6 ? "#a3adba" : "#eef1f5"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, yy + 0.5); ctx.lineTo(gx0 + gw, yy + 0.5); ctx.stroke();
        ctx.fillStyle = "#7b8694"; ctx.fillText(ccN(gv / 1000, 1), gx0 - 6, yy);
      }
      ctx.restore();
      ccT(S, c, "G (kJ)", gx0 - 4, top - 9, {size:ccFz(c, 11.5), color:"#2c3a4e", align:"left", weight:800});
      for (var xt = 0; xt <= 1.0001; xt += 0.25){ S.draw.line(c, X(xt), gyb + 2, X(xt), gyb + 6, "#a3adba", 1); ccT(S, c, ccN(xt, 2), X(xt), gyb + 14, {size:10, color:"#7b8694", weight:600}); }
      ccT(S, c, "ξ (mol de B formées)", gx0 + gw, gyb + 28, {size:ccFz(c, 11), color:"#2c3a4e", align:"right", weight:700});
      /* --- le rail G(ξ) en relief --- */
      var npt = 160, pts = [];
      for (var i = 0; i <= npt; i++){ var xx = 0.0005 + 0.999 * i / npt; pts.push([X(xx), Yg(ccG(xx, dG0, T))]); }
      var dep = phone ? 7 : 9;
      ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0], gyb); pts.forEach(function(p){ ctx.lineTo(p[0], p[1]); }); ctx.lineTo(pts[npt][0], gyb); ctx.closePath();
      var fill = ctx.createLinearGradient(0, top, 0, gyb); fill.addColorStop(0, "rgba(98,54,196,.10)"); fill.addColorStop(1, "rgba(98,54,196,.02)"); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
      /* face arrière puis dessus du rail */
      ctx.save();
      var rg = ctx.createLinearGradient(X(0), 0, X(1), 0); rg.addColorStop(0, "#2f6fd1"); rg.addColorStop(1, "#e07a1f");
      ctx.beginPath(); pts.forEach(function(p, j){ if (j) ctx.lineTo(p[0] + dep, p[1] - dep * 0.6); else ctx.moveTo(p[0] + dep, p[1] - dep * 0.6); });
      for (i = npt; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath(); ctx.fillStyle = rg; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath(); pts.forEach(function(p, j){ if (j) ctx.lineTo(p[0] + dep, p[1] - dep * 0.6); else ctx.moveTo(p[0] + dep, p[1] - dep * 0.6); }); ctx.strokeStyle = "rgba(60,60,90,.35)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); pts.forEach(function(p, j){ if (j) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.strokeStyle = rg; ctx.lineWidth = 4.5; ctx.lineJoin = "round"; ctx.stroke();
      ctx.restore();
      /* extrémités */
      S.draw.dot(c, X(0), Yg(0), 5, "#2f6fd1"); S.draw.dot(c, X(1), Yg(dG0), 5, "#e07a1f");
      ccT(S, c, "A pur : G = 0", X(0) + 10, Yg(0) - 12, {size:ccFz(c, 10.5), color:"#1f4b9e", align:"left", weight:800, halo:true});
      ccT(S, c, "B pur : G = ΔrG°", X(1) - 4, Yg(dG0) - 14, {size:ccFz(c, 10.5), color:"#a2510f", align:"right", weight:800, halo:true});
      /* minimum et K */
      var xm = X(xe), ym = Yg(Gmin);
      S.draw.line(c, xm, ym + 6, xm, gyb, "#24775a", 1.4, [4, 4]);
      ccT(S, c, "minimum : ξ = " + ccF(xe, 3), xm, gyb - 10, {size:ccFz(c, 11), color:"#24775a", weight:800, bg:"rgba(255,255,255,.92)", align:xe > 0.75 ? "right" : xe < 0.25 ? "left" : "center"});
      /* tangente sous la bille : pente = ΔrG */
      var bx = X(x), by = Yg(Gx), dYdX = -geo.sy * slope / gw, Lt = phone ? 46 : 62, ux = 1 / Math.sqrt(1 + dYdX * dYdX), uy = dYdX * ux;
      S.draw.line(c, bx - ux * Lt, by - uy * Lt, bx + ux * Lt, by + uy * Lt, "#c0321d", 2, [6, 4]);
      /* bille */
      var nrx = -uy, nry = ux; if (nry > 0){ nrx = -nrx; nry = -nry; }
      var bcx = bx + nrx * geo.br, bcy = by + nry * geo.br;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.18)"; ccEll(ctx, bx + 3, by + 2, geo.br * 0.9, geo.br * 0.35); ctx.fill(); ctx.restore();
      ccBall(ctx, bcx, bcy, geo.br, "#6236c4");
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1.5; var rot = x * gw / geo.br; ctx.beginPath(); ctx.arc(bcx, bcy, geo.br * 0.6, rot, rot + 1.2); ctx.stroke(); ctx.restore();
      var sl = slope / 1000, dirTxt = Math.abs(sl) < 0.05 ? "ΔrG ≈ 0 : équilibre" : "ΔrG = " + ccSg(sl, 2) + " kJ/mol " + (sl < 0 ? "→" : "←");
      var lx = Math.max(gx0 + 70, Math.min(gx0 + gw - 70, bcx)), ly = bcy - geo.br - (Math.abs(bcx - X(1)) < 150 ? 36 : 16);
      if (ly < top + 4) ly = bcy + geo.br + 18;
      ccT(S, c, dirTxt, lx, ly, {size:ccFz(c, 12), color:Math.abs(sl) < 0.05 ? "#24775a" : "#c0321d", weight:800, bg:"rgba(255,255,255,.93)"});
      if (!phone) ccT(S, c, "attrape la bille · glisse sur la boîte pour la tourner", W - 12, 12, {size:10.5, color:"#7b8694", align:"right", weight:600});

      /* --- boîte de molécules en 3D --- */
      var bs = phone ? Math.min(W * 0.15, 54) : 58, bxc = phone ? W * 0.3 : W * 0.28, byc = gyb + 44 + bs * 1.4;
      function P3(p){ var r = ccRot(p, st.a, st.b), s = 1 / (1 - r[2] * 0.12); return {x:bxc + r[0] * bs * s, y:byc - r[1] * bs * s, z:r[2], s:s}; }
      var Vv = [], ii, jj;
      for (ii = 0; ii < 8; ii++) Vv.push(P3([ii & 1 ? 1.15 : -1.15, ii & 2 ? 1.15 : -1.15, ii & 4 ? 1.15 : -1.15]));
      var E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.14)"; ccEll(ctx, bxc + 6, byc + bs * 1.3, bs * 1.35, bs * 0.22); ctx.fill(); ctx.restore();
      ctx.save(); ctx.lineWidth = 1.2;
      E.forEach(function(e){ var p1 = Vv[e[0]], p2 = Vv[e[1]]; if (p1.z + p2.z < 0){ ctx.strokeStyle = "rgba(90,110,140,.4)"; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } });
      ctx.restore();
      var ms = st.mol.map(function(m){ return {m:m, q:P3(m.p)}; }).sort(function(a, b){ return a.q.z - b.q.z; });
      ms.forEach(function(o){
        var r0 = bs / 74 * (phone ? 6.4 : 6.6) * o.q.s, col = o.m.B ? "#e07a1f" : "#2f6fd1";
        if (o.m.fl > 0) S.draw.glow(c, o.q.x, o.q.y, r0 * 3, "#fff3a0", o.m.fl * 0.9);
        if (o.m.B){ ccBall(ctx, o.q.x - r0 * 0.45, o.q.y, r0 * 0.8, col); ccBall(ctx, o.q.x + r0 * 0.45, o.q.y - r0 * 0.15, r0 * 0.8, col); }
        else ccBall(ctx, o.q.x, o.q.y, r0, col);
      });
      ctx.save(); ctx.lineWidth = 1.4;
      E.forEach(function(e){ var p1 = Vv[e[0]], p2 = Vv[e[1]]; if (p1.z + p2.z >= 0){ ctx.strokeStyle = "rgba(60,80,110,.75)"; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } });
      ctx.restore();
      /* composition sous la bille */
      var nB = st.mol.filter(function(m){ return m.B; }).length, cx0 = phone ? W * 0.64 : W * 0.56, cw = W - cx0 - 14, cy0 = gyb + 52;
      ccT(S, c, "composition sous la bille", cx0, cy0, {size:ccFz(c, 11.5), color:"#2c3a4e", align:"left", weight:800});
      [["A", 1 - x, "#2f6fd1"], ["B", x, "#e07a1f"]].forEach(function(r, j){
        var yb = cy0 + 16 + j * 30, bwid = cw - 8;
        ctx.fillStyle = "#e6ebf2"; ccRR(ctx, cx0, yb, bwid, 13, 6); ctx.fill();
        var gr = ctx.createLinearGradient(0, yb, 0, yb + 13); gr.addColorStop(0, ccShade(r[2], 0.35)); gr.addColorStop(1, r[2]);
        ctx.fillStyle = gr; ccRR(ctx, cx0, yb, Math.max(4, bwid * r[1]), 13, 6); ctx.fill();
        ccT(S, c, "p(" + r[0] + ") = " + ccF(r[1], 2) + " bar", cx0 + 2, yb + 23, {size:ccFz(c, 11), color:r[2] === "#2f6fd1" ? "#1f4b9e" : "#a2510f", align:"left", weight:800});
      });
      var qy = cy0 + 86, qk = Math.abs(Math.log(Q / K)) < 0.03 ? "Q = K" : Q < K ? "Q < K → vers B" : "Q > K → vers A";
      ccT(S, c, qk, cx0, qy, {size:ccFz(c, 12.5), color:qk === "Q = K" ? "#24775a" : "#c0321d", align:"left", weight:800});
      ccBall(ctx, cx0 + 6, qy + 22, 5, "#2f6fd1"); ccT(S, c, "A", cx0 + 15, qy + 22, {size:11, align:"left", color:"#1f4b9e"});
      ccBall(ctx, cx0 + 40, qy + 22, 4, "#e07a1f"); ccBall(ctx, cx0 + 46, qy + 21, 4, "#e07a1f"); ccT(S, c, "B (isomère)", cx0 + 55, qy + 22, {size:11, align:"left", color:"#a2510f"});

      /* --- afficheurs --- */
      function sciH(v){ if (v >= 0.01 && v < 1000) return ccF(v, v < 1 ? 3 : 2); var e = Math.floor(Math.log10(v)), m2 = v / Math.pow(10, e); return ccF(m2, 2) + "·10<sup>" + String(e).replace("-", "−") + "</sup>"; }
      ro.set(0, sciH(K));
      ro.set(1, ccF(xe, 3) + " mol");
      ro.set(2, ccF(x, 3) + " mol");
      ro.set(3, sciH(Q));
      ro.set(4, ccSg(sl, 2) + " kJ/mol");
      ro.set(5, ccSg(Gmin / 1000, 2) + " kJ");
      var msg = "ΔrG° = " + ccSg(dG0 / 1000, 1) + " kJ/mol à " + T + " K : RT = " + ccF(RT / 1000, 3) + " kJ/mol, K = e^(" + ccSg(-dG0 / RT, 3) + ") = " + sciH(K) + ", donc le minimum est à ξ = K/(1 + K) = " + ccF(xe, 3) + " mol. " +
        (dG0 < 0 ? "ΔrG° < 0 : le fond de la vallée est du côté de B (K > 1)." : dG0 > 0 ? "ΔrG° > 0 : le fond est du côté de A (K < 1), mais un peu de B se forme quand même." : "ΔrG° = 0 : K = 1, le minimum est au milieu.");
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

/* =====================================================================
   4. L'équilibre est dynamique : le marquage isotopique (c06)
   ===================================================================== */
/* A : chaîne de trois atomes ; B : cycle de trois atomes (isomères). L'atome marqué (¹³C) est l'atome n° 1. */
var CC_GA = [[-0.13, 0, 0], [0, 0, 0], [0.13, 0, 0]];
var CC_GB = [[-0.075, -0.043, 0], [0, 0.087, 0], [0.075, -0.043, 0]];

SFA.sim({
  id:"ch-equilibre-dynamique", ch:"c06", tag:"Équilibre",
  titre:"L'équilibre est dynamique : le marquage isotopique",
  resume:"Dans une boîte 3D, des molécules A se transforment en B et des B redeviennent A. Les vitesses aller et retour se rejoignent : c'est l'équilibre. On injecte alors des molécules marquées : les quantités ne bougent plus, mais la marque passe dans les deux espèces.",
  but:"Regarde la boîte : chaque éclair est une molécule qui change d'espèce (chaîne A ⇄ cycle B). Le graphe suit la vitesse aller k₁·N(A) et la vitesse retour k₋₁·N(B), qui se rejoignent. À l'équilibre, des molécules A marquées au ¹³C (atome doré) sont injectées à la place de molécules A ordinaires : suis la marque. Glisse pour tourner la boîte, clique une molécule pour la marquer toi-même.",
  aRetenir:"À l'équilibre, la réaction ne s'arrête pas : v<sub>aller</sub> = v<sub>retour</sub>, donc les quantités restent constantes. Pour A ⇌ B (deux réactions d'ordre 1) : k₁·[A] = k₋₁·[B] à l'équilibre, d'où K = [B]/[A] = k₁/k₋₁. Le marquage isotopique le prouve : la marque passe de A à B alors que N(A) et N(B) ne changent pas, et elle finit répartie comme les molécules : B*/A* = K.",
  piege:"« À l'équilibre, plus rien ne se passe » : faux, chaque molécule continue de changer d'espèce, mais autant dans un sens que dans l'autre. Équilibre ne veut pas dire [A] = [B] : c'est le rapport [B]/[A] qui vaut K. Et l'atome marqué ne change pas la chimie : un ¹³C réagit comme un ¹²C (l'effet isotopique est négligé).",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 560;
    var c = k.canvas(phone ? 380 : 400), g = k.canvas(phone ? 360 : 210);
    var st = {t:0, a:0.55, b:0.38, spin:true, drag:null, mol:[], hist:[], inj:null, flips:0, sample:0};
    var k1S = k.slider("Constante aller k₁ (A → B)", 0.05, 0.5, 0.01, 0.2, "s⁻¹", restart);
    var k2S = k.slider("Constante retour k₋₁ (B → A)", 0.05, 0.5, 0.01, 0.1, "s⁻¹", restart);
    var nS = k.slider("Nombre de molécules", 20, 90, 2, 60, "", restart);
    var autoT = k.toggle("Injection automatique à l'équilibre et boucle", true);
    k.button("Recommencer (tout en A)", restart, true);
    k.button("Injecter des molécules marquées", function(){ inject(); });
    var ro = k.readouts(["N(A) / N(B)", "v aller = k₁·N(A)", "v retour = k₋₁·N(B)", "Q = N(B)/N(A)", "K = k₁/k₋₁", "Marquées : A* / B*"]);
    var nt = k.note("", "ok");
    k.note("Modèle : chaque molécule A a une probabilité k₁·Δt de devenir B pendant Δt, chaque B une probabilité k₋₁·Δt de redevenir A (réactions d'ordre 1, tirage au hasard). Même volume pour tous : Q = [B]/[A] = N(B)/N(A). Les courbes en pointillé sont la loi cinétique moyenne ; les molécules, elles, fluctuent.", "");
    function rv(){ return Math.random() * 2 - 1; }
    function restart(){
      var N = nS.value; st.mol = []; st.hist = []; st.inj = null; st.t = 0; st.sample = 0;
      for (var i = 0; i < N; i++){
        var ax = [rv(), rv(), rv()], l = Math.hypot(ax[0], ax[1], ax[2]) || 1;
        st.mol.push({p:[rv() * 0.85, rv() * 0.85, rv() * 0.85], v:[rv() * 0.4, rv() * 0.4, rv() * 0.4], B:false, m:false, mo:0, fl:0, ax:[ax[0] / l, ax[1] / l, ax[2] / l], ang:Math.random() * 6.3, w:0.6 + Math.random() * 1.6});
      }
      record();
    }
    function counts(){ var o = {A:0, B:0, Am:0, Bm:0}; st.mol.forEach(function(m){ if (m.B){ o.B++; if (m.m) o.Bm++; } else { o.A++; if (m.m) o.Am++; } }); return o; }
    function record(){ var o = counts(); st.hist.push([st.t, o.A, o.B, o.Am, o.Bm]); }
    function inject(){
      var cand = st.mol.filter(function(m){ return !m.B && !m.m; }), n = Math.min(cand.length, Math.round(nS.value / 4));
      for (var i = 0; i < n; i++){ var j = i + Math.floor(Math.random() * (cand.length - i)), tmp = cand[i]; cand[i] = cand[j]; cand[j] = tmp; cand[i].m = true; cand[i].fl = 1.2; }
      st.inj = {t:st.t, n:n};
    }
    restart();
    var geo = {};
    c.pointer(function(type, p){
      if (type === "down") st.drag = {x:p.x, y:p.y, lx:p.x, ly:p.y, moved:false};
      if (type === "drag" && st.drag){
        if (Math.abs(p.x - st.drag.x) + Math.abs(p.y - st.drag.y) > 5) st.drag.moved = true;
        st.a += (p.x - st.drag.lx) * 0.012; st.b = Math.max(-1.3, Math.min(1.3, st.b + (p.y - st.drag.ly) * 0.012)); st.drag.lx = p.x; st.drag.ly = p.y; st.spin = false;
      }
      if (type === "up" && st.drag){
        if (!st.drag.moved && geo.scr){
          var best = null, bd = 18;
          geo.scr.forEach(function(o){ var d = Math.hypot(o.x - p.x, o.y - p.y); if (d < bd){ bd = d; best = o.m; } });
          if (best){ best.m = !best.m; best.fl = 1; }
        }
        st.drag = null;
      }
    });
    c.cv.style.cursor = "grab";
    var lp = k.loop(function(dt){
      st.t += dt;
      var k1 = k1S.value, k2 = k2S.value, p1 = 1 - Math.exp(-k1 * dt), p2 = 1 - Math.exp(-k2 * dt);
      st.mol.forEach(function(m){
        if (Math.random() < (m.B ? p2 : p1)){ m.B = !m.B; m.fl = 1; }
        m.mo += ((m.B ? 1 : 0) - m.mo) * Math.min(1, dt * 7);
        m.fl = Math.max(0, m.fl - dt * 2.2);
        m.ang += m.w * dt;
        for (var q = 0; q < 3; q++){ m.p[q] += m.v[q] * dt; if (m.p[q] > 0.9 || m.p[q] < -0.9){ m.v[q] = -m.v[q]; m.p[q] = Math.max(-0.9, Math.min(0.9, m.p[q])); } }
      });
      st.sample += dt;
      if (st.sample >= 0.25){ st.sample = 0; record(); }
      if (autoT.value){
        var tInj = Math.max(15, 5 / (k1 + k2));
        if (!st.inj && st.t >= tInj) inject();
        if (st.t >= (st.inj ? st.inj.t : tInj) + 27) restart();
      }
      if (st.spin) st.a += dt * 0.2;
      k.redraw();
    });
    lp.play();
    function rotAx(v, ax, an){
      var cs = Math.cos(an), sn = Math.sin(an), d = v[0] * ax[0] + v[1] * ax[1] + v[2] * ax[2];
      var cr = [ax[1] * v[2] - ax[2] * v[1], ax[2] * v[0] - ax[0] * v[2], ax[0] * v[1] - ax[1] * v[0]];
      return [v[0] * cs + cr[0] * sn + ax[0] * d * (1 - cs), v[1] * cs + cr[1] * sn + ax[1] * d * (1 - cs), v[2] * cs + cr[2] * sn + ax[2] * d * (1 - cs)];
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, k1 = k1S.value, k2 = k2S.value, N = st.mol.length, K = k1 / k2, o = counts();
      /* --- décor : labo sombre et paillasse --- */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1c2740"); bg.addColorStop(0.7, "#2a3654"); bg.addColorStop(1, "#151c2c");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var benchY = H * 0.84;
      var wood = ctx.createLinearGradient(0, benchY, 0, H); wood.addColorStop(0, "#4a5568"); wood.addColorStop(1, "#262f3e");
      ctx.fillStyle = wood; ctx.fillRect(0, benchY, W, H - benchY); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(0, benchY, W, 2);
      S.draw.glow(c, W * 0.5, H * 0.1, W * 0.45, "#5b7bd6", 0.18);
      /* --- cuve cubique en 3D --- */
      var cx = W * 0.5, cy = phone ? H * 0.47 : H * 0.46, bs = Math.min(W * 0.27, H * 0.3);
      function P3(p){ var r = ccRot(p, st.a, st.b), s = 1 / (1 - r[2] * 0.14); return {x:cx + r[0] * bs * s, y:cy - r[1] * bs * s, z:r[2], s:s}; }
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; ccEll(ctx, cx + 6, benchY + 4, bs * 1.45, bs * 0.16); ctx.fill(); ctx.restore();
      var V = [], i;
      for (i = 0; i < 8; i++) V.push(P3([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]));
      var F = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
      function face(f, front){
        var z = (V[f[0]].z + V[f[1]].z + V[f[2]].z + V[f[3]].z) / 4;
        if ((z >= 0) !== front) return;
        ctx.beginPath(); f.forEach(function(ix, j){ if (j) ctx.lineTo(V[ix].x, V[ix].y); else ctx.moveTo(V[ix].x, V[ix].y); }); ctx.closePath();
        ctx.fillStyle = front ? "rgba(190,215,255,.06)" : "rgba(120,150,210,.10)"; ctx.fill();
        ctx.strokeStyle = front ? "rgba(200,225,255,.65)" : "rgba(160,185,230,.3)"; ctx.lineWidth = front ? 1.5 : 1; ctx.stroke();
      }
      F.forEach(function(f){ face(f, false); });
      /* molécules, de l'arrière vers l'avant */
      var sc = bs, list = st.mol.map(function(m){ return {m:m, c:P3(m.p)}; }).sort(function(a, b){ return a.c.z - b.c.z; });
      geo.scr = [];
      list.forEach(function(L){
        var m = L.m, f = m.mo, at = [];
        for (var j = 0; j < 3; j++){
          var loc = [CC_GA[j][0] + (CC_GB[j][0] - CC_GA[j][0]) * f, CC_GA[j][1] + (CC_GB[j][1] - CC_GA[j][1]) * f, 0];
          var r = rotAx(loc, m.ax, m.ang);
          at.push(P3([m.p[0] + r[0], m.p[1] + r[1], m.p[2] + r[2]]));
        }
        var col = f > 0.5 ? "#e07a1f" : "#2f6fd1", rr = sc * 0.048;
        if (m.fl > 0) S.draw.glow(c, L.c.x, L.c.y, rr * 5 * L.c.s, "#fff1a8", Math.min(1, m.fl) * 0.85);
        ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = ccShade(col, -0.3); ctx.lineWidth = rr * 0.7 * L.c.s;
        ctx.beginPath(); ctx.moveTo(at[0].x, at[0].y); ctx.lineTo(at[1].x, at[1].y); ctx.lineTo(at[2].x, at[2].y);
        if (f > 0.5){ ctx.globalAlpha = Math.min(1, (f - 0.5) * 2); ctx.lineTo(at[0].x, at[0].y); }
        ctx.stroke(); ctx.restore();
        at.map(function(a, j){ return [a, j]; }).sort(function(a, b){ return a[0].z - b[0].z; }).forEach(function(q){
          var isM = m.m && q[1] === 1;
          if (isM) S.draw.glow(c, q[0].x, q[0].y, rr * 2.6 * q[0].s, "#ffd34d", 0.7);
          ccBall(ctx, q[0].x, q[0].y, rr * q[0].s * (isM ? 1.12 : 1), isM ? "#f2b705" : col);
        });
        geo.scr.push({x:L.c.x, y:L.c.y, m:m});
      });
      F.forEach(function(f){ face(f, true); });
      /* reflet sur la vitre */
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(V[6].x + (V[4].x - V[6].x) * 0.15, V[6].y + (V[4].y - V[6].y) * 0.15); ctx.lineTo(V[6].x + (V[4].x - V[6].x) * 0.45, V[6].y + (V[4].y - V[6].y) * 0.45); ctx.stroke(); ctx.restore();
      /* légende */
      var lx = 12, ly = H - 58, fs = ccFz(c, 11);
      ctx.save(); ctx.fillStyle = "rgba(10,15,28,.6)"; ccRR(ctx, lx - 6, ly - 11, 134, 62, 8); ctx.fill(); ctx.restore();
      ccBall(ctx, lx + 3, ly, 4, "#2f6fd1"); ccBall(ctx, lx + 11, ly, 4, "#2f6fd1"); ccBall(ctx, lx + 19, ly, 4, "#2f6fd1");
      ccT(S, c, "A (chaîne)", lx + 30, ly, {size:fs, color:"#dbe6fb", align:"left", weight:700});
      ccBall(ctx, lx + 11, ly + 16, 3.6, "#e07a1f"); ccBall(ctx, lx + 5, ly + 23, 3.6, "#e07a1f"); ccBall(ctx, lx + 17, ly + 23, 3.6, "#e07a1f");
      ccT(S, c, "B (cycle)", lx + 30, ly + 20, {size:fs, color:"#ffd9b8", align:"left", weight:700});
      S.draw.glow(c, lx + 11, ly + 40, 9, "#ffd34d", 0.7); ccBall(ctx, lx + 11, ly + 40, 4.5, "#f2b705");
      ccT(S, c, "atome marqué ¹³C", lx + 30, ly + 40, {size:fs, color:"#ffe39a", align:"left", weight:700});
      /* compteurs et horloge */
      ccT(S, c, "t = " + ccF(st.t, 1) + " s", 12, 16, {size:ccFz(c, 12.5), color:"#ffffff", align:"left", weight:800});
      ccT(S, c, "N(A) = " + o.A + "   N(B) = " + o.B, 12, 34, {size:ccFz(c, 12), color:"#c7d3ea", align:"left", weight:700});
      if (st.inj) ccT(S, c, "A* = " + o.Am + "   B* = " + o.Bm, 12, 52, {size:ccFz(c, 12), color:"#ffd34d", align:"left", weight:800});
      if (!phone) ccT(S, c, "glisse pour tourner · clique une molécule pour la marquer", W - 12, 16, {size:10.5, color:"rgba(199,211,234,.8)", align:"right", weight:600});
      else ccT(S, c, "glisse · clique", W - 10, 16, {size:10, color:"rgba(199,211,234,.8)", align:"right", weight:600});
      var ph = st.inj ? (st.t - st.inj.t < 2.5 ? "injection de " + st.inj.n + " A marquées" : "la marque se répand") : (st.t < 3 / (k1 + k2) ? "A → B domine" : "équilibre atteint");
      ccT(S, c, ph, W - 12, H - 16, {size:ccFz(c, 12), color:st.inj ? "#ffd34d" : "#ffffff", align:"right", weight:800, bg:"rgba(10,15,28,.7)"});

      /* ---------- graphes : vitesses et marquage ---------- */
      g.clear();
      var gc = g.ctx, GW = g.W, GH = g.H, h = st.hist, tmax = Math.max(30, Math.ceil(st.t / 10) * 10), t0 = Math.max(0, tmax - 45);
      gc.fillStyle = "#ffffff"; gc.fillRect(0, 0, GW, GH);
      var vmax = Math.max(k1 * N, 1) * 1.12;
      var a1 = phone ? S.draw.axes(g, {x0:t0, x1:tmax, y0:0, y1:vmax, l:40, r:12, t:20, b:GH / 2 + 22, yl:"v (molécules/s)"})
                     : S.draw.axes(g, {x0:t0, x1:tmax, y0:0, y1:vmax, l:40, r:GW / 2 + 12, t:20, b:34, yl:"v (molécules/s)"});
      ccT(S, g, "t (s)", a1.R, a1.B + 22, {size:10.5, color:"#2c3a4e", align:"right", weight:700});
      var s0 = k1 + k2, NAe = N / (1 + K);
      function NAth(t){ return NAe + (N - NAe) * Math.exp(-s0 * t); }
      S.draw.fn(g, a1, function(t){ return k1 * NAth(t); }, "#2f6fd1", 1.3, [4, 4]);
      S.draw.fn(g, a1, function(t){ return k2 * (N - NAth(t)); }, "#e07a1f", 1.3, [4, 4]);
      function trace(ax, fy, col){
        gc.save(); gc.beginPath(); gc.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); gc.clip();
        gc.strokeStyle = col; gc.lineWidth = 2.2; gc.lineJoin = "round"; gc.beginPath(); var st2 = false;
        h.forEach(function(r){ if (r[0] < t0) return; var X1 = ax.X(r[0]), Y1 = ax.Y(fy(r)); if (st2) gc.lineTo(X1, Y1); else { gc.moveTo(X1, Y1); st2 = true; } });
        gc.stroke(); gc.restore();
      }
      trace(a1, function(r){ return k1 * r[1]; }, "#2f6fd1");
      trace(a1, function(r){ return k2 * r[2]; }, "#e07a1f");
      ccT(S, g, "aller k₁·N(A)", a1.R - 2, a1.T + 8, {size:ccFz(g, 10.5), color:"#1f4b9e", align:"right", weight:800, halo:true});
      ccT(S, g, "retour k₋₁·N(B)", a1.R - 2, a1.T + 22, {size:ccFz(g, 10.5), color:"#a2510f", align:"right", weight:800, halo:true});
      var veq = k1 * NAe;
      S.draw.line(g, a1.L, a1.Y(veq), a1.R, a1.Y(veq), "rgba(36,119,90,.5)", 1, [2, 3]);
      ccT(S, g, "équilibre : " + ccF(veq, 2) + "/s", a1.L + 4, a1.Y(veq) - 8, {size:ccFz(g, 10), color:"#24775a", align:"left", weight:800, halo:true});
      var mm = st.inj ? Math.max(4, st.inj.n) : Math.max(4, Math.round(N / 4));
      var a2 = phone ? S.draw.axes(g, {x0:t0, x1:tmax, y0:0, y1:mm * 1.15, l:40, r:12, t:GH / 2 + 22, b:30, yl:"molécules marquées"})
                     : S.draw.axes(g, {x0:t0, x1:tmax, y0:0, y1:mm * 1.15, l:GW / 2 + 36, r:12, t:20, b:34, yl:"molécules marquées"});
      ccT(S, g, "t (s)", a2.R, a2.B + 22, {size:10.5, color:"#2c3a4e", align:"right", weight:700});
      if (st.inj){
        var ti = st.inj.t, mi = st.inj.n;
        S.draw.line(g, a1.X(ti), a1.T, a1.X(ti), a1.B, "rgba(194,106,12,.6)", 1.2, [3, 3]);
        S.draw.line(g, a2.X(ti), a2.T, a2.X(ti), a2.B, "rgba(194,106,12,.6)", 1.2, [3, 3]);
        S.draw.fn(g, a2, function(t){ return t < ti ? NaN : mi * K / (1 + K) * (1 - Math.exp(-s0 * (t - ti))); }, "#e07a1f", 1.3, [4, 4]);
        S.draw.fn(g, a2, function(t){ return t < ti ? NaN : mi - mi * K / (1 + K) * (1 - Math.exp(-s0 * (t - ti))); }, "#2f6fd1", 1.3, [4, 4]);
        var hh = h.filter(function(r){ return r[0] >= ti - 0.01; });
        var save = h; h = hh; trace(a2, function(r){ return r[3]; }, "#2f6fd1"); trace(a2, function(r){ return r[4]; }, "#e07a1f"); h = save;
        ccT(S, g, "A* (dans A)", a2.R - 2, a2.T + 22, {size:ccFz(g, 10.5), color:"#1f4b9e", align:"right", weight:800, halo:true});
        ccT(S, g, "B* (dans B)", a2.R - 2, a2.T + 36, {size:ccFz(g, 10.5), color:"#a2510f", align:"right", weight:800, halo:true});
      } else ccT(S, g, "pas encore de molécules marquées", (a2.L + a2.R) / 2, (a2.T + a2.B) / 2, {size:ccFz(g, 11), color:"#8a95a3", weight:700});

      /* ---------- afficheurs ---------- */
      ro.set(0, o.A + " / " + o.B);
      ro.set(1, ccF(k1 * o.A, 2) + " /s");
      ro.set(2, ccF(k2 * o.B, 2) + " /s");
      ro.set(3, o.A ? ccF(o.B / o.A, 2) : "∞");
      ro.set(4, ccF(K, 2));
      ro.set(5, st.inj || o.Am + o.Bm ? o.Am + " / " + o.Bm : "aucune");
      var NBe = N - NAe, msg = "Équilibre attendu : N(A) = N/(1 + K) = " + ccF(NAe, 1) + " et N(B) = " + ccF(NBe, 1) + " ; v aller = v retour = " + ccF(veq, 2) + " molécules/s ; temps caractéristique 1/(k₁ + k₋₁) = " + ccF(1 / s0, 1) + " s." +
        (st.inj ? " Après l'injection de " + st.inj.n + " A*, la marque se partage comme les molécules : B* → " + ccF(st.inj.n * K / (1 + K), 1) + ", A* → " + ccF(st.inj.n / (1 + K), 1) + " (B*/A* = K)." : "");
      if (msg !== nt._m){ nt.set(msg, "ok"); nt._m = msg; }
    });
  }
});

})();
