(function(){
var P = SFA.draw.palette, F = SFA.fmt;
/*@@H:m5-c02-escalier-boule*/
/* décor d'hiver : montagnes, sapins, flocons, escalier de pierre enneigé, enfant en anorak, boule de neige qui roule */
var ESB = (function(){
  var T = {}, seed = 3;
  function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  T.flakes = []; for (var i = 0; i < 70; i++) T.flakes.push({x:rnd(), y:rnd(), r:0.8 + rnd() * 1.8, v:0.03 + rnd() * 0.05, p:rnd() * 6.28});
  T.lumps = []; for (i = 0; i < 11; i++) T.lumps.push({a:rnd() * 6.28, d:0.25 + rnd() * 0.6, s:0.08 + rnd() * 0.1});
  T.trees = []; for (i = 0; i < 9; i++) T.trees.push({x:rnd(), s:0.7 + rnd() * 0.6});
  function lin(ctx, x0, y0, x1, y1, st){ var g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(s){ g.addColorStop(s[0], s[1]); }); return g; }
  T.lin = lin;
  T.sky = function(c, yG, tt){
    var ctx = c.ctx, W = c.W, H = c.H;
    ctx.fillStyle = lin(ctx, 0, 0, 0, yG, [[0, "#aecbea"], [1, "#eaf2fb"]]); ctx.fillRect(0, 0, W, yG);
    /* montagnes lointaines */
    [[0.55, "#c5d3e4", 0.0], [0.72, "#a9bdd4", 0.4]].forEach(function(m, k){
      ctx.fillStyle = m[1]; ctx.beginPath(); ctx.moveTo(0, yG);
      for (var x = 0; x <= W + 40; x += 40){ var h = (Math.sin(x * 0.011 + m[2] * 7) * 0.5 + Math.sin(x * 0.023 + k) * 0.3 + 0.8) * yG * (0.28 - k * 0.09); ctx.lineTo(x, yG * m[0] + yG * 0.18 - h * 0.7 + k * 12); }
      ctx.lineTo(W, yG); ctx.closePath(); ctx.fill();
    });
    /* sapins */
    T.trees.forEach(function(t){
      var x = t.x * W, s = t.s * Math.max(16, yG * 0.09), y = yG + 2;
      ctx.fillStyle = "#5b4a3a"; ctx.fillRect(x - s * 0.08, y - s * 0.35, s * 0.16, s * 0.35);
      for (var j = 0; j < 3; j++){ var yy = y - s * 0.3 - j * s * 0.38, w = s * (0.62 - j * 0.15);
        ctx.fillStyle = "#3f6f5a"; ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.lineTo(x, yy - s * 0.62); ctx.lineTo(x + w, yy); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.moveTo(x - w * 0.45, yy - s * 0.33); ctx.lineTo(x, yy - s * 0.62); ctx.lineTo(x + w * 0.45, yy - s * 0.33); ctx.closePath(); ctx.fill(); }
    });
  };
  T.snowGround = function(c, yG){
    var ctx = c.ctx; ctx.fillStyle = lin(ctx, 0, yG, 0, c.H, [[0, "#ffffff"], [1, "#dbe6f2"]]); ctx.fillRect(0, yG, c.W, c.H - yG);
    ctx.fillStyle = "rgba(120,150,190,.25)"; ctx.fillRect(0, yG, c.W, 1.5);
  };
  T.snowfall = function(c, tt){
    var ctx = c.ctx; ctx.save(); ctx.fillStyle = "rgba(255,255,255,.9)";
    T.flakes.forEach(function(f){ var y = ((f.y + tt * f.v) % 1) * c.H, x = (f.x * c.W + Math.sin(tt * 0.8 + f.p) * 8 + c.W) % c.W; ctx.beginPath(); ctx.arc(x, y, f.r, 0, 6.2832); ctx.fill(); });
    ctx.restore();
  };
  /* marche de pierre enneigée : de yTop à yBot */
  T.step = function(c, x, w, yTop, yBot, hot){
    var ctx = c.ctx; if (Math.abs(yBot - yTop) < 0.5) yBot = yTop + 0.5;
    var a = Math.min(yTop, yBot), b = Math.max(yTop, yBot);
    ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, hot ? "#a6b6cf" : "#9aa7b8"], [1, hot ? "#8394b0" : "#7d8a9c"]]); ctx.fillRect(x, a, w, b - a);
    ctx.strokeStyle = "rgba(15,27,45,.25)"; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, a + 0.5, w - 1, b - a - 1);
    /* joints de pierre */
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.beginPath();
    for (var yy = a + 14; yy < b - 4; yy += 14){ ctx.moveTo(x + 2, yy); ctx.lineTo(x + w - 2, yy); }
    ctx.stroke();
    /* neige sur la marche */
    ctx.fillStyle = "#ffffff"; SFA.draw.rrect(c, x - 1, yTop - 4, w + 2, 6, 3); ctx.fill();
    ctx.fillStyle = "rgba(160,185,215,.45)"; ctx.fillRect(x, yTop + 2, w, 1.5);
  };
  /* enfant en anorak : (x, y) = pieds, h = taille en px, ph = phase de pas, jump = 0..1 */
  T.kid = function(c, x, y, h, ph, up){
    var ctx = c.ctx, u = h / 100; ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; ctx.lineJoin = "round";
    var s = Math.sin(ph);
    /* jambes */
    ctx.strokeStyle = "#1f3a68"; ctx.lineWidth = 11 * u;
    ctx.beginPath(); ctx.moveTo(-4 * u, -40 * u); ctx.lineTo((-4 - 9 * s) * u, (-4 - (up ? 8 : 0) * Math.max(0, s)) * u); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4 * u, -40 * u); ctx.lineTo((4 + 9 * s) * u, (-4 - (up ? 8 : 0) * Math.max(0, -s)) * u); ctx.stroke();
    ctx.fillStyle = "#3b2a1c";
    [[-4 - 9 * s, -(up ? 8 : 0) * Math.max(0, s)], [4 + 9 * s, -(up ? 8 : 0) * Math.max(0, -s)]].forEach(function(f){ ctx.beginPath(); ctx.ellipse((f[0] + 3) * u, (f[1] - 2) * u, 8 * u, 5 * u, 0, 0, 6.2832); ctx.fill(); });
    /* anorak */
    ctx.fillStyle = lin(ctx, -16 * u, 0, 16 * u, 0, [[0, "#e0662a"], [1, "#b8461a"]]); SFA.draw.rrect(c, -16 * u, -80 * u, 32 * u, 44 * u, 12 * u); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.moveTo(0, -76 * u); ctx.lineTo(0, -38 * u); ctx.stroke();
    /* bras */
    ctx.strokeStyle = "#c9531f"; ctx.lineWidth = 9 * u;
    ctx.beginPath(); ctx.moveTo(-12 * u, -72 * u); ctx.lineTo((-17 + 8 * s) * u, -48 * u); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12 * u, -72 * u); ctx.lineTo((17 - 8 * s) * u, -48 * u); ctx.stroke();
    ctx.fillStyle = "#24775a"; [[-17 + 8 * s], [17 - 8 * s]].forEach(function(m){ ctx.beginPath(); ctx.arc(m[0] * u, -46 * u, 4.5 * u, 0, 6.2832); ctx.fill(); });
    /* écharpe */
    ctx.fillStyle = "#24775a"; SFA.draw.rrect(c, -12 * u, -84 * u, 24 * u, 8 * u, 4 * u); ctx.fill(); ctx.fillRect(6 * u, -80 * u, 6 * u, 16 * u);
    /* tête et bonnet */
    ctx.fillStyle = "#f2cfa8"; ctx.beginPath(); ctx.arc(0, -95 * u, 11 * u, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#e8807a"; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(6 * u, -92 * u, 3 * u, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(5 * u, -97 * u, 1.4 * u, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#1f4b9e"; ctx.beginPath(); ctx.arc(0, -98 * u, 11.5 * u, Math.PI, 0); ctx.fill(); ctx.fillRect(-12 * u, -100 * u, 24 * u, 5 * u);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(-12.5 * u, -99 * u, 25 * u, 4 * u); ctx.beginPath(); ctx.arc(0, -111 * u, 4.5 * u, 0, 6.2832); ctx.fill();
    ctx.restore();
  };
  /* boule de neige : centre (x, y), rayon r, rotation a */
  T.ball = function(c, x, y, r, a){
    var ctx = c.ctx; if (r < 0.6) r = 0.6; ctx.save();
    ctx.fillStyle = "rgba(80,110,150,.25)"; ctx.beginPath(); ctx.ellipse(x + r * 0.15, y + r * 0.98, r * 1.05, Math.max(1.5, r * 0.16), 0, 0, 6.2832); ctx.fill();
    var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.08, x, y, r * 1.02);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.6, "#eef3fa"); g.addColorStop(1, "#b7c8de");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    if (r > 6){
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.clip();
      T.lumps.forEach(function(l){ var q = l.a + a, px = x + Math.cos(q) * l.d * r, py = y + Math.sin(q) * l.d * r;
        ctx.fillStyle = "rgba(150,175,205,.35)"; ctx.beginPath(); ctx.ellipse(px, py, l.s * r, l.s * r * 0.7, q, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.ellipse(px - l.s * r * 0.3, py - l.s * r * 0.3, l.s * r * 0.5, l.s * r * 0.35, q, 0, 6.2832); ctx.fill(); });
      /* brindille prise dans la neige */
      var bq = a + 2.2; ctx.strokeStyle = "#6b4f36"; ctx.lineWidth = Math.max(1, r * 0.04); ctx.beginPath(); ctx.moveTo(x + Math.cos(bq) * r * 0.55, y + Math.sin(bq) * r * 0.55); ctx.lineTo(x + Math.cos(bq + 0.25) * r * 0.85, y + Math.sin(bq + 0.25) * r * 0.85); ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(90,120,160,.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke();
    ctx.restore();
  };
  return T;
})();
/*@@E:m5-c02-escalier-boule*/
function money(x){ return F(Math.round(x * 100) / 100, 2).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

/* 1. Escalier et boule de neige */
SFA.sim({
  id:"m5-c02-escalier-boule", ch:"c02", tag:"Classique",
  titre:"L'escalier et la boule de neige",
  resume:"Suite arithmétique (on ajoute r) ou géométrique (on multiplie par q).",
  but:"Choisis le type de suite, u₀ et la raison. L'enfant monte l'escalier (chaque marche ajoute r) pendant que la boule de neige roule et grossit (son diamètre est multiplié par q à chaque tour) : les deux sont dessinés à la même échelle. Glisse dans la scène pour choisir n, ou glisse le premier point du graphique pour changer u₀.",
  aRetenir:"Arithmétique : uₙ = u₀ + n·r, somme de u₀ à u_N = (N + 1)(u₀ + u_N)/2. Géométrique : uₙ = u₀·qⁿ, somme = u₀(q^(N+1) − 1)/(q − 1) si q ≠ 1.",
  piege:"De u₀ à u_N il y a N + 1 termes mais seulement N raisons. « Augmente de 5 % » signifie q = 1,05, pas q = 5.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), gc = k.canvas(0, {ratio:0.36});
    var type = k.seg("Suite", [["A", "Arithmétique"], ["G", "Géométrique"], ["B", "Les deux"]], "B", function(){ restart(); });
    var u0 = k.slider("u₀", 1, 10, 1, 3, "", function(){ restart(); });
    var r = k.slider("r (raison arithmétique)", -3, 5, 0.5, 2, "", function(){ restart(); });
    var q = k.slider("q (raison géométrique)", 0.5, 1.8, 0.05, 1.2, "", function(){ restart(); });
    var N = k.slider("N (dernier indice)", 3, 15, 1, 10, "", function(){ restart(); });
    var st = {prog:0, tt:0, hold:0, scrub:false}, SPEED = 1.25, HOLD = 2.4;
    function restart(){ st.prog = 0; st.hold = 0; if (!anim.running) anim.play(); }
    var anim = k.loop(function(dt){
      st.tt += dt;
      if (!st.scrub){
        if (st.prog < N.value) st.prog = Math.min(N.value, st.prog + dt * SPEED);
        else { st.hold += dt; if (st.hold > HOLD){ st.prog = 0; st.hold = 0; } }
      }
      k.redraw();
    });
    k.button("▶ Monter l'escalier / rouler la boule", function(){ st.prog = 0; st.hold = 0; anim.play(); }, true);
    k.button("❚❚ Pause", function(){ if (anim.running) anim.pause(); else anim.play(); });
    var ro = k.readouts(["u_N arithmétique", "Somme arith.", "u_N géométrique", "Somme géom."]);
    var nt = k.note("", "ok");
    function ua(n){ return u0.value + n * r.value; } function ug(n){ return u0.value * Math.pow(q.value, n); }
    function sa(n){ return (n + 1) * (u0.value + ua(n)) / 2; }
    function sg(n){ return Math.abs(q.value - 1) < 1e-9 ? (n + 1) * u0.value : u0.value * (Math.pow(q.value, n + 1) - 1) / (q.value - 1); }
    var ax = null, drag = false, geo = {};
    gc.pointer(function(type_, p){
      if (!ax) return;
      if (type_ === "down"){ var y = ax.Y(u0.value), x = ax.X(0); drag = Math.hypot(p.x - x, p.y - y) < 26; }
      if (type_ === "drag" && drag){ u0.set(Math.max(1, Math.min(10, Math.round(ax.iy(p.y))))); st.prog = 0; k.redraw(); }
      if (type_ === "up") drag = false;
    });
    /* glisser dans la scène : choisir n */
    c.pointer(function(t, p){
      if (!geo.w) return;
      if (t === "down" || t === "drag"){ st.scrub = true; st.prog = Math.max(0, Math.min(N.value, Math.round((p.x - geo.x0) / geo.w * N.value * 2) / 2)); st.hold = 0; k.redraw(); }
      if (t === "up"){ st.scrub = false; st.prog = Math.round(st.prog); st.hold = -3; }
    });
    function txt(s){ return String(s).replace(/<[^>]+>/g, ""); }
    k.draw(function(){
      var want = c.W < 520 ? 0.82 : 0.62; if (c.ratio !== want){ c.ratio = want; gc.ratio = c.W < 520 ? 0.62 : 0.36; c.resize(); gc.resize(); return; }
      var n = N.value, t = type.value, i, A = [], G = [], showA = t !== "G", showG = t !== "A";
      if (st.prog > n) st.prog = n;
      for (i = 0; i <= n; i++){ A.push(ua(i)); G.push(ug(i)); }
      var pr = st.prog, ni = Math.floor(pr + 1e-9), fr = pr - ni;
      /* ---------- scène ---------- */
      var W = c.W, H = c.H, ctx = c.ctx, phone = W < 520, top = phone ? 54 : 50, bot = H - (phone ? 26 : 24);
      var hi = 0, lo = 0;
      if (showA) A.forEach(function(v){ hi = Math.max(hi, v); lo = Math.min(lo, v); });
      if (showG) G.forEach(function(v){ hi = Math.max(hi, v); });
      var L = 34, split = showA && showG ? L + (W - L) * 0.5 : (showA ? W - 8 : L);
      var laneA = [L + 8, (showG ? split : W) - 10], laneG = [showA ? split + 10 : L + 8, W - 10];
      var s = (bot - top) / (hi - lo || 1);
      if (showG){ var mg = 0; G.forEach(function(v){ mg = Math.max(mg, v); }); s = Math.min(s, (laneG[1] - laneG[0]) * 0.86 / mg); }
      var yG = bot + lo * s, Y = function(v){ return yG - v * s; };
      if (lo >= 0) yG = bot;
      c.clear();
      ESB.sky(c, Math.min(yG, bot), st.tt);
      ESB.snowGround(c, Math.min(yG, bot));
      /* règle verticale commune (même échelle pour l'escalier et la boule) */
      var span = (bot - top) / s, stp = Math.pow(10, Math.floor(Math.log10(span / 5))), mm = span / 5 / stp; stp *= mm < 1.5 ? 1 : mm < 3.5 ? 2 : mm < 7.5 ? 5 : 10;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.7)"; SFA.draw.rrect(c, 3, top - 22, L - 4, bot - top + 30, 7); ctx.fill();
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L - 3, Y(lo)); ctx.lineTo(L - 3, top - 4); ctx.stroke();
      ctx.font = "800 10px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var vv = Math.ceil(lo / stp) * stp; Y(vv) > top - 6; vv += stp){ if (Y(vv) > bot + 1) continue; ctx.beginPath(); ctx.moveTo(L - 8, Y(vv)); ctx.lineTo(L - 3, Y(vv)); ctx.stroke(); ctx.fillText(txt(F(vv, stp < 1 ? 1 : 0)), L - 10, Y(vv)); }
      ctx.textAlign = "center"; ctx.fillText("uₙ", L / 2, top - 14); ctx.restore();
      var kidH = 0, sw = 0, x0A = laneA[0];
      if (showA){
        sw = (laneA[1] - laneA[0]) / (n + 1);
        if (lo < 0){ ctx.fillStyle = "rgba(90,110,140,.35)"; ctx.fillRect(laneA[0], yG, laneA[1] - laneA[0], Y(lo) - yG + 4); }
        for (i = 0; i <= n; i++) ESB.step(c, x0A + i * sw, sw + 0.5, Y(A[i]), A[i] >= 0 ? yG : Y(lo) + 4, i === ni);
        if (sw > 17) for (i = 0; i <= n; i++){ if (i > ni) break; S.draw.text(c, txt(F(A[i], 1)), x0A + (i + 0.5) * sw, Math.min(Y(A[i]), yG) + 13, {size:sw < 24 ? 8.5 : 10, weight:800, color:"#ffffff"}); }
        /* l'enfant saute d'une marche à la suivante */
        kidH = Math.max(34, Math.min((bot - top) * 0.24, 76));
        var j = Math.min(n, ni + 1), e = ni >= n ? 0 : fr, ease = e * e * (3 - 2 * e);
        var kx = x0A + (ni + 0.5 + ease) * sw, ky = Y(A[ni]) + (Y(A[j]) - Y(A[ni])) * ease - Math.sin(e * Math.PI) * Math.max(8, Math.abs(r.value) * s * 0.6 + 8);
        ESB.kid(c, kx, ky - 2, kidH, e > 0 ? e * Math.PI * 2 : 0, e > 0);
        geo.x0 = x0A; geo.w = laneA[1] - laneA[0] - sw;
      }
      if (showG){
        var gx0 = laneG[0], gx1 = laneG[1], rB = ug(pr) * s / 2, rB0 = G[0] * s / 2, rBn = G[n] * s / 2;
        var cx = gx0 + rB0 + (gx1 - gx0 - rB0 - rBn) * (pr / n) + (rB - rB0) * 0;
        cx = Math.max(gx0 + rB, Math.min(gx1 - rB, cx));
        /* sillon laissé dans la neige */
        ctx.save(); ctx.strokeStyle = "rgba(150,175,205,.55)"; ctx.lineCap = "round"; ctx.lineWidth = Math.max(2, rB * 0.22); ctx.beginPath(); ctx.moveTo(gx0 + 4, yG + 2); ctx.lineTo(cx, yG + 2); ctx.stroke(); ctx.restore();
        /* anciennes tailles : contours en pointillé */
        ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(192,50,29,.35)"; ctx.lineWidth = 1.2;
        for (i = 0; i < ni && i <= n; i++){ var ri = G[i] * s / 2; ctx.beginPath(); ctx.arc(cx, yG - ri, ri, 0, 6.2832); ctx.stroke(); }
        ctx.restore();
        ESB.ball(c, cx, yG - rB, rB, (cx - gx0) / Math.max(4, rB));
        if (!showA){ geo.x0 = gx0; geo.w = gx1 - gx0; }
        /* cote du diamètre */
        var dx = Math.min(gx1 - 4, cx + rB + 10);
        if (rB > 5){ S.draw.line(c, dx, yG, dx, yG - 2 * rB, P.red, 1.5); S.draw.line(c, dx - 4, yG, dx + 4, yG, P.red, 1.5); S.draw.line(c, dx - 4, yG - 2 * rB, dx + 4, yG - 2 * rB, P.red, 1.5); }
      }
      /* niveaux comparés */
      if (showA){ var ya = Y(A[ni]); S.draw.line(c, L, ya, W - 6, ya, S.draw.tint(P.acc, 0.6), 1.3, [6, 5]); }
      if (showG){ var yg = Y(G[ni]); S.draw.line(c, L, yg, W - 6, yg, S.draw.tint(P.red, 0.6), 1.3, [6, 5]); }
      ESB.snowfall(c, st.tt);
      /* étiquettes */
      var labY = 16;
      S.draw.label(c, "n = " + ni, L + 8, labY, {color:P.ink, align:"left", size:phone ? 12 : 13.5});
      if (showA) S.draw.label(c, "escalier : u" + sub(ni) + " = " + txt(F(A[ni], 2)) + "  (+ " + txt(F(r.value, 1)) + ")", phone ? L + 60 : L + 70, labY, {color:P.acc, align:"left", size:phone ? 10.5 : 12});
      if (showG) S.draw.label(c, "boule : u" + sub(ni) + " = " + txt(F(G[ni], 2)) + "  (× " + txt(F(q.value, 2)) + ")", W - 8, showA ? labY + (phone ? 22 : 0) + (phone ? 0 : 0) : labY, {color:P.red, align:"right", size:phone ? 10.5 : 12});
      /* ---------- graphique ---------- */
      gc.clear(); var glo = 0, ghi = 0.5;
      for (i = 0; i <= n; i++){ if (showA){ glo = Math.min(glo, A[i]); ghi = Math.max(ghi, A[i]); } if (showG){ ghi = Math.max(ghi, G[i]); } }
      var pad = (ghi - glo) * 0.1 + 0.5;
      ax = S.draw.axes(gc, {x0:-0.7, x1:n + 0.7, y0:glo - pad, y1:ghi + pad, stepX:n > 10 ? 2 : 1, xl:"n", yl:"uₙ", t:12, b:30, l:42});
      for (i = 0; i <= n; i++){
        if (i > pr + 0.001) break;
        if (showA){ if (i) S.draw.line(gc, ax.X(i - 1), ax.Y(A[i - 1]), ax.X(i), ax.Y(A[i]), S.draw.tint(P.acc, 0.3), 1.6); S.draw.dot(gc, ax.X(i), ax.Y(A[i]), 5, P.acc); }
        if (showG){ if (i) S.draw.line(gc, ax.X(i - 1), ax.Y(G[i - 1]), ax.X(i), ax.Y(G[i]), S.draw.tint(P.red, 0.3), 1.6); S.draw.dot(gc, ax.X(i), ax.Y(G[i]), 5, P.red); }
      }
      S.draw.glow(gc, ax.X(0), ax.Y(u0.value), 16, P.amber, 0.4);
      S.draw.label(gc, "↕ glisse u₀", ax.X(0) + 12, ax.Y(u0.value) + 20, {color:P.amber, align:"left", size:11});
      ro.set(0, F(A[n], 2)); ro.set(1, F(sa(n), 2)); ro.set(2, F(G[n], 2)); ro.set(3, F(sg(n), 2));
      var msg = "Bleu : arithmétique (points alignés, marches de même hauteur). Rouge : géométrique (rapport constant : la boule grossit de plus en plus vite).";
      if (Math.abs(q.value - 1) < 1e-9) msg += " Avec q = 1, la suite géométrique est constante.";
      else if (q.value < 1 - 1e-9) msg += " Avec q < 1, la boule fond : la suite géométrique tend vers 0, elle converge.";
      if (r.value < 0) msg += " Avec r < 0, l'escalier descend.";
      nt.set(msg + " (" + (n + 1) + " termes de u₀ à u_" + n + ")", "ok");
    });
    function sub(n){ return String(n).split("").map(function(d){ return "₀₁₂₃₄₅₆₇₈₉"[+d]; }).join(""); }
  }
});

/* 2. Intérêts simples et composés : deux bocaux de pièces sur une étagère */
var JAR = (function(){
  var T = {};
  function lin(ctx, x0, y0, x1, y1, st){ var g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(s){ g.addColorStop(s[0], s[1]); }); return g; }
  T.lin = lin;
  /* pièces empilées dans un bocal : couches [montant, couleur] de bas en haut ; renvoie le haut en px */
  T.coins = function(c, x, w, yB, s, layers){
    var ctx = c.ctx, th = 5, cols = Math.max(2, Math.floor(w / 30)), cw = w / cols, y = yB, acc = 0;
    layers.forEach(function(L){
      var h = L[0] * s, yTop = y - h;
      for (var yy = y; yy > yTop + 0.01; yy -= th){
        var hh = Math.min(th, yy - yTop);
        for (var k = 0; k < cols; k++){
          var cx = x + cw * (k + 0.5) + ((Math.round(yy / th) + k) % 2 ? 1.5 : -1.5);
          ctx.fillStyle = shade(L[1], -0.28); ctx.beginPath(); ctx.ellipse(cx, yy - hh * 0.5, cw * 0.47, 3.2, 0, 0, 6.2832); ctx.fill();
          ctx.fillStyle = L[1]; ctx.beginPath(); ctx.ellipse(cx, yy - hh, cw * 0.47, 3.2, 0, 0, 6.2832); ctx.fill();
        }
      }
      /* reflet du dessus */
      if (h > 1){ for (var k2 = 0; k2 < cols; k2++){ var cx2 = x + cw * (k2 + 0.5); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx2, yTop, cw * 0.32, 1.8, 0, 0, 6.2832); ctx.stroke(); } }
      y = yTop; acc += h;
    });
    return y;
  };
  T.coin = function(c, x, y, r, a){
    var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.15, Math.abs(Math.cos(a))), 1);
    var g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); g.addColorStop(0, "#fff2b3"); g.addColorStop(0.5, "#f0c94a"); g.addColorStop(1, "#b8860b");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#9a6f08"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = "#9a6f08"; ctx.font = "800 " + Math.round(r * 1.1) + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("€", 0, 0.5);
    ctx.restore();
  };
  /* bocal en verre (devant les pièces : reflets) */
  T.jarBack = function(c, x, yT, w, h){
    var ctx = c.ctx; ctx.save();
    ctx.fillStyle = "rgba(15,27,45,.18)"; ctx.beginPath(); ctx.ellipse(x + w / 2, yT + h + 4, w * 0.55, 7, 0, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "rgba(220,235,248,.35)"; SFA.draw.rrect(c, x, yT, w, h, 16); ctx.fill();
    ctx.restore();
  };
  T.jarFront = function(c, x, yT, w, h, col, title){
    var ctx = c.ctx; ctx.save();
    ctx.strokeStyle = "rgba(120,150,180,.75)"; ctx.lineWidth = 2.2; SFA.draw.rrect(c, x, yT, w, h, 16); ctx.stroke();
    ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, "rgba(255,255,255,.0)"], [0.12, "rgba(255,255,255,.45)"], [0.2, "rgba(255,255,255,.05)"], [0.85, "rgba(255,255,255,.0)"], [0.93, "rgba(255,255,255,.25)"], [1, "rgba(255,255,255,0)"]]);
    SFA.draw.rrect(c, x, yT, w, h, 16); ctx.fill();
    /* couvercle */
    ctx.fillStyle = lin(ctx, 0, yT - 14, 0, yT, [[0, shade(col, 0.15)], [1, shade(col, -0.25)]]); SFA.draw.rrect(c, x - 6, yT - 14, w + 12, 14, 5); ctx.fill();
    ctx.fillStyle = "#13233a"; SFA.draw.rrect(c, x + w / 2 - 16, yT - 10, 32, 4, 2); ctx.fill();   /* fente */
    /* étiquette */
    var lw = Math.min(w - 16, 112), ly = yT + h * 0.1;
    ctx.fillStyle = "rgba(255,253,245,.95)"; SFA.draw.rrect(c, x + w / 2 - lw / 2, ly, lw, 22, 5); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = col; ctx.font = "800 11px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(title, x + w / 2, ly + 11.5);
    ctx.restore();
  };
  function hex(h){ var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [128, 128, 128]; }
  function shade(col, f){ return "rgb(" + hex(col).map(function(v){ return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }).join(",") + ")"; }
  T.shade = shade;
  /* décor : mur, fenêtre, étagère en bois */
  T.room = function(c, yShelf, tt){
    var ctx = c.ctx, W = c.W, H = c.H;
    ctx.fillStyle = lin(ctx, 0, 0, 0, yShelf, [[0, "#f3ede2"], [1, "#e6dccb"]]); ctx.fillRect(0, 0, W, yShelf);
    ctx.strokeStyle = "rgba(170,150,120,.18)"; ctx.lineWidth = 1; ctx.beginPath(); for (var x = 12; x < W; x += 24){ ctx.moveTo(x, 0); ctx.lineTo(x, yShelf); } ctx.stroke();
    /* fenêtre */
    if (W < 520) { ctx.fillStyle = lin(ctx, 0, yShelf, 0, yShelf + 16, [[0, "#b07a45"], [1, "#7e5330"]]); ctx.fillRect(0, yShelf, W, 16); ctx.fillStyle = lin(ctx, 0, yShelf + 16, 0, H, [[0, "#d9cdb8"], [1, "#cbbda5"]]); ctx.fillRect(0, yShelf + 16, W, H - yShelf - 16); return; }
    var fw = Math.min(140, W * 0.18), fx = W * 0.5 - fw / 2, fy = 10, fh = Math.min(yShelf * 0.3, 78);
    ctx.fillStyle = "#ffffff"; SFA.draw.rrect(c, fx - 6, fy - 6, fw + 12, fh + 12, 6); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, fy, 0, fy + fh, [[0, "#8fc0ec"], [1, "#d6e9f8"]]); ctx.fillRect(fx, fy, fw, fh);
    ctx.fillStyle = "#9fb4c9"; for (var b = 0; b < 6; b++){ var bh = fh * (0.25 + ((b * 37) % 5) * 0.08); ctx.fillRect(fx + b * fw / 6 + 2, fy + fh - bh, fw / 6 - 4, bh); }
    ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(fx + ((tt * 6) % (fw + 40)) - 20, fy + 18, 7, 0, 6.2832); ctx.arc(fx + ((tt * 6) % (fw + 40)) - 10, fy + 15, 9, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.fillRect(fx + fw / 2 - 2, fy, 4, fh); ctx.fillRect(fx, fy + fh / 2 - 2, fw, 4);
    /* étagère */
    ctx.fillStyle = lin(ctx, 0, yShelf, 0, yShelf + 16, [[0, "#b07a45"], [1, "#7e5330"]]); ctx.fillRect(0, yShelf, W, 16);
    ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(0, yShelf, W, 2);
    ctx.fillStyle = lin(ctx, 0, yShelf + 16, 0, H, [[0, "#d9cdb8"], [1, "#cbbda5"]]); ctx.fillRect(0, yShelf + 16, W, H - yShelf - 16);
  };
  return T;
})();
SFA.sim({
  id:"m5-c02-interets", ch:"c02", tag:"Classique",
  titre:"Intérêts simples ou composés ?",
  resume:"Deux bocaux, le même capital : chaque année les pièces tombent, un seul bocal s'emballe.",
  but:"Règle le capital, le taux et la durée, puis fais passer les années : chaque année, les intérêts tombent dans les bocaux (pièces dessinées à la même échelle). Dans le bocal « composé », la couche rouge, ce sont les intérêts des intérêts. Fais en sorte que le capital double : combien d'années en simple ? en composé ?",
  aRetenir:"Simple : Cₙ = C₀(1 + t·n), suite arithmétique. Composé : Cₙ = C₀(1 + t)ⁿ, suite géométrique de raison 1 + t. Le composé gagne parce que les intérêts rapportent eux-mêmes des intérêts.",
  piege:"Un taux de 3 % par an ne donne pas 3 % × 5 = 15 % de gain en 5 ans avec des intérêts composés : 1,03⁵ ≈ 1,1593, soit 15,93 %.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.56}), g = k.canvas(0, {ratio:0.36});
    var cap = k.slider("Capital C₀", 100, 5000, 100, 1000, "€", function(){ restart(); });
    var tx = k.slider("Taux annuel t", 1, 10, 0.5, 4, "%", function(){ restart(); });
    var dur = k.slider("Durée n", 0, 40, 1, 20, "ans", function(){ restart(); });
    var st = {y:0, hold:0, tt:0};
    function restart(){ st.y = 0; st.hold = 0; if (!lp.running) lp.play(); }
    var lp = k.loop(function(dt){
      st.tt += dt; var n = dur.value, sp = Math.max(1.6, n / 9);
      if (st.y < n) st.y = Math.min(n, st.y + dt * sp); else { st.hold += dt; if (st.hold > 2.6){ st.y = 0; st.hold = 0; } }
      k.redraw();
    });
    k.button("▶ Faire passer les années", function(){ st.y = 0; st.hold = 0; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ if (lp.running) lp.pause(); else lp.play(); });
    var ro = k.readouts(["Simple Cₙ", "Composé Cₙ", "Écart", "Doublement"]);
    var nt = k.note("", "ok"), axi = null;
    g.pointer(function(t, p){ if ((t === "down" || t === "drag") && axi){ dur.set(Math.round(Math.max(0, Math.min(40, axi.ix(p.x))))); st.y = dur.value; st.hold = 0; k.redraw(); } });
    lp.play();
    function txt(s){ return String(s).replace(/<[^>]+>/g, ""); }
    k.draw(function(){
      var want = c.W < 520 ? 0.9 : 0.56; if (c.ratio !== want){ c.ratio = want; g.ratio = c.W < 520 ? 0.6 : 0.36; c.resize(); g.resize(); return; }
      var C0 = cap.value, t = tx.value / 100, n = dur.value;
      var cs = function(x){ return C0 * (1 + t * x); }, cc = function(x){ return C0 * Math.pow(1 + t, x); };
      var yr = Math.min(n, st.y), yi = Math.floor(yr + 1e-9), fr = yr - yi;
      /* ---------- scène ---------- */
      var W = c.W, H = c.H, ctx = c.ctx, phone = W < 520, yShelf = H - (phone ? 30 : 34);
      c.clear(); JAR.room(c, yShelf, st.tt);
      var jw = Math.min(phone ? W * 0.36 : W * 0.25, 190), jh = yShelf - (phone ? 104 : 96), jT = yShelf - jh;
      var xS = W * (phone ? 0.27 : 0.25) - jw / 2, xC = W * (phone ? 0.73 : 0.75) - jw / 2;
      var inner = jh - 34, sc = inner / Math.max(cc(n), cs(n), C0);
      /* ligne « capital doublé » */
      var y2 = yShelf - 4 - 2 * C0 * sc;
      JAR.jarBack(c, xS, jT, jw, jh); JAR.jarBack(c, xC, jT, jw, jh);
      var GOLD = "#c9951c", INT = "#f0c94a", II = "#e0704a";
      var vS = cs(yi), vC = cc(yi);
      JAR.coins(c, xS + 8, jw - 16, yShelf - 4, sc, [[C0, GOLD], [vS - C0, INT]]);
      JAR.coins(c, xC + 8, jw - 16, yShelf - 4, sc, [[C0, GOLD], [vS - C0, INT], [vC - vS, II]]);
      /* pièces qui tombent pendant l'année en cours */
      if (yi < n && fr > 0){
        [[xS, cs(yi + 1) - vS, vS], [xC, cc(yi + 1) - vC, vC]].forEach(function(q, j){
          var m = Math.max(1, Math.min(5, Math.round(q[1] / (C0 * t) * 2))), topY = yShelf - 4 - q[2] * sc;
          for (var i = 0; i < m; i++){ var f = Math.min(1, Math.max(0, fr * 1.4 - i * 0.12)); if (f <= 0 || f >= 1) continue; var yy = jT - 10 + (topY - jT + 4) * f * f; JAR.coin(c, q[0] + jw / 2 + (i - (m - 1) / 2) * 13, yy, 8, st.tt * 9 + i + j); }
        });
      }
      JAR.jarFront(c, xS, jT, jw, jh, P.acc, phone ? "SIMPLES" : "INTÉRÊTS SIMPLES"); JAR.jarFront(c, xC, jT, jw, jh, P.red, phone ? "COMPOSÉS" : "INTÉRÊTS COMPOSÉS");
      if (y2 > jT + 30){
        S.draw.line(c, 8, y2, W - 8, y2, "rgba(36,119,90,.8)", 1.4, [6, 5]);
        S.draw.text(c, "2 × C₀", W / 2, y2 - 9, {size:10, weight:800, color:P.green, bg:"rgba(255,255,255,.9)"}); if (!phone) S.draw.text(c, money(2 * C0) + " €", W / 2, y2 + 10, {size:10, weight:800, color:P.green, bg:"rgba(255,255,255,.9)"});
      }
      /* montants au-dessus des bocaux */
      [[xS, vS, P.acc, cs(yi + 1) - vS], [xC, vC, P.red, cc(yi + 1) - vC]].forEach(function(q){
        S.draw.text(c, money(q[1]) + " €", q[0] + jw / 2, jT - (phone ? 52 : 42), {size:phone ? 13 : 16, weight:800, color:q[2], bg:"rgba(255,255,255,.95)"});
        if (yi < n) S.draw.text(c, "+ " + money(q[3]) + " € cette année", q[0] + jw / 2, jT - (phone ? 30 : 22), {size:phone ? 9.5 : 10.5, weight:700, color:"#5f6b7a"});
      });
      /* calendrier */
      var cw = 72, cx = W / 2 - cw / 2, cy = jT + jh * 0.42;
      if (phone) S.draw.label(c, "Année " + yi + " sur " + n, W / 2, 14, {color:P.ink, size:12.5});
      else {
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 6; ctx.fillStyle = "#ffffff"; SFA.draw.rrect(c, cx, cy, cw, cw * 0.95, 6); ctx.fill(); ctx.restore();
      ctx.fillStyle = P.red; SFA.draw.rrect(c, cx, cy, cw, 16, 6); ctx.fill(); ctx.fillRect(cx, cy + 8, cw, 8);
      S.draw.text(c, "ANNÉE", cx + cw / 2, cy + 8.5, {size:9, weight:800, color:"#ffffff"});
      S.draw.text(c, String(yi), cx + cw / 2, cy + cw * 0.55, {size:phone ? 22 : 27, weight:800, color:P.ink, mono:true});
      S.draw.text(c, "sur " + n, cx + cw / 2, cy + cw * 0.83, {size:9.5, weight:700, color:"#5f6b7a"});
      }
      /* légende */
      var lg = [[GOLD, "capital C₀"], [INT, "intérêts (même montant chaque année en simple)"], [II, "intérêts des intérêts"]];
      if (phone) lg[1][1] = "intérêts";
      var lx = 10, ly = yShelf + 9 + (phone ? 4 : 6);
      ctx.save(); ctx.font = "700 " + (phone ? 9.5 : 11) + "px Mulish, system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      lg.forEach(function(L){ ctx.fillStyle = L[0]; ctx.beginPath(); ctx.ellipse(lx + 6, ly, 6, 3.5, 0, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#3c2a14"; ctx.fillText(L[1], lx + 16, ly); lx += ctx.measureText(L[1]).width + 30; });
      ctx.restore();
      /* ---------- graphique ---------- */
      g.clear();
      var ax = axi = S.draw.axes(g, {x0:0, x1:40, y0:0, y1:Math.max(cs(40), cc(40)) * 1.05, l:58, xl:"années", stepX:5});
      S.draw.fn(g, ax, cs, P.acc, 2.4); S.draw.fn(g, ax, cc, P.red, 2.4);
      S.draw.line(g, ax.L, ax.Y(2 * C0), ax.R, ax.Y(2 * C0), P.green, 1, [4, 4]);
      S.draw.line(g, ax.X(n), ax.B, ax.X(n), ax.Y(cc(n)), P.grey, 1, [3, 3]);
      S.draw.dot(g, ax.X(yi), ax.Y(cs(yi)), 6, P.acc); S.draw.glow(g, ax.X(yi), ax.Y(cc(yi)), 16, P.red, 0.4); S.draw.dot(g, ax.X(yi), ax.Y(cc(yi)), 6.5, P.red);
      S.draw.label(g, "↔ glisse n = " + n, ax.X(n) + 10, ax.B - 14, {color:P.ink, align:ax.X(n) > ax.R - 110 ? "right" : "left", size:11});
      var dS = 1 / t, dC = Math.log(2) / Math.log(1 + t);
      ro.set(0, money(cs(n)) + " €"); ro.set(1, money(cc(n)) + " €"); ro.set(2, money(cc(n) - cs(n)) + " €");
      ro.set(3, F(dS, 1) + " / " + F(dC, 1) + " ans");
      nt.set("Bleu : simple (droite, +" + money(C0 * t) + " € par an). Rouge : composé (×" + F(1 + t, 3) + " par an). Le capital double après " + F(dS, 1) + " ans en simple, après " + F(dC, 1) + " ans en composé." + (n === 0 ? " À n = 0, les deux valent C₀." : ""), "ok");
    });
  }
});

/* 3. Somme de Gauss généralisée */
SFA.sim({
  id:"m5-c02-gauss", ch:"c02", tag:"Preuve visuelle",
  titre:"La somme de Gauss en rectangle",
  resume:"Deux copies de la suite forment un rectangle : S = n(u₁ + uₙ)/2.",
  but:"Choisis u₁, la raison et n : la suite (bleu) et sa copie retournée (orange) forment un rectangle de hauteur constante u₁ + uₙ.",
  aRetenir:"Chaque colonne du rectangle vaut u₁ + uₙ, il y a n colonnes : 2S = n(u₁ + uₙ), donc S = n(u₁ + uₙ)/2. Pour 1 + 2 + … + n, cela donne n(n + 1)/2.",
  piege:"On divise par 2 parce qu'on a compté la somme deux fois. Et n est le nombre de termes, pas le dernier indice si la suite commence à u₀.",
  build:function(k, S){
    var c = k.canvas(420);
    var u1 = k.slider("u₁ (premier terme)", 1, 10, 1, 1, "");
    var r = k.slider("r (raison)", 0, 4, 1, 1, "");
    var n = k.slider("n (nombre de termes)", 2, 12, 1, 8, "");
    var mode = k.seg("Mode", [["L", "Libre"], ["D", "Défi : S = 60"]], "L");
    var ro = k.readouts(["uₙ", "u₁ + uₙ", "Somme S"]);
    var nt = k.note("", "ok");
    var fl = 1, anim = k.loop(function(dt){ fl += dt * 0.7; if (fl >= 1){ fl = 1; anim.pause(); } k.redraw(); });
    k.button("▶ Retourner la copie", function(){ fl = 0; anim.play(); }, true);
    c.pointer(function(t, q){ if (t === "up") return; var Lm = 40, w = (c.W - Lm - 16) / n.value; n.set(Math.max(2, Math.min(12, Math.floor((q.x - Lm) / w) + 1))); k.redraw(); });
    k.draw(function(){
      c.clear(); var N = n.value, a = u1.value, d = r.value, un = a + (N - 1) * d, h = a + un;
      var ctx = c.ctx, L = 40, Rr = 16, T = 34, B = 30, w = (c.W - L - Rr) / N, hm = fl < 1 ? Math.max(h, 2 * Math.max(a, un)) : h, sc = (c.H - T - B) / hm, i;
      for (i = 1; i <= N; i++){
        var v = a + (i - 1) * d, x = L + (i - 1) * w, y0 = c.H - B, o = (1 - fl) * v + fl * (h - v);
        ctx.fillStyle = "rgba(30,63,143,.85)"; ctx.fillRect(x + 1, y0 - v * sc, w - 2, v * sc);
        ctx.fillStyle = "rgba(180,83,9,.8)"; ctx.fillRect(x + 1, y0 - v * sc - o * sc, w - 2, o * sc);
        if (w > 18){ S.draw.text(c, F(v, 0), x + w/2, y0 - v * sc/2, {color:"#fff", size:12}); if (o * sc > 14) S.draw.text(c, F(o, 0), x + w/2, y0 - v * sc - o * sc/2, {color:"#fff", size:12}); }
        S.draw.text(c, String(i), x + w/2, y0 + 14, {size:12, color:P.grey});
      }
      if (fl >= 1){ ctx.save(); ctx.strokeStyle = P.ink; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeRect(L + 0.5, c.H - B - h * sc, c.W - L - Rr, h * sc); ctx.restore(); }
      S.draw.text(c, fl < 1 ? "la copie orange se retourne…" : "u₁ + uₙ = " + F(h, 0) + " par colonne · touche pour changer n", L, 14, {align:"left", size:12, color:P.amber});
      ro.set(0, F(un, 0)); ro.set(1, F(h, 0)); ro.set(2, F(N * h / 2, 1));
      var s = 0; for (i = 1; i <= N; i++) s += a + (i - 1) * d;
      if (mode.value === "D"){ var ok60 = Math.abs(N * h / 2 - 60) < 1e-9; nt.set(ok60 ? "<b>Bravo : S = " + F(N, 0) + " × " + F(h, 0) + " / 2 = 60.</b> Il y a plusieurs solutions : en trouves-tu une autre ?" : "Défi : règle u₁, r et n pour que la somme vale exactement 60. Pour l'instant S = " + F(N * h / 2, 1) + ".", ok60 ? "ok" : "warn"); return; }
      nt.set("Rectangle : " + N + " × " + F(h, 0) + " = " + F(N * h, 0) + " cases, soit deux fois la somme. S = " + F(N * h, 0) + " / 2 = " + F(N * h / 2, 1) + ". Vérification en additionnant terme à terme : " + F(s, 0) + ".", "ok");
    });
  }
});

/* 4. Crédit et amortissement */
SFA.sim({
  id:"m5-c02-credit", ch:"c02", tag:"Finance",
  titre:"Rembourser un crédit : où vont les paiements ?",
  resume:"Annuités constantes : la part d'intérêts diminue chaque année.",
  but:"Règle le prêt, le taux et la durée. Fais glisser l'année k : combien d'intérêts, combien de capital remboursé, combien reste dû ?",
  aRetenir:"Avec une annuité constante A, la dette suit D_k = D_{k−1}(1 + t) − A. Les intérêts sont calculés sur ce qui reste dû : ils diminuent, la part de capital augmente. A = K·t / (1 − (1 + t)^(−n)).",
  piege:"Modèle simplifié : un seul paiement par an (les vrais crédits sont mensuels). Un crédit plus long a une annuité plus faible, mais un coût total en intérêts plus élevé.",
  build:function(k, S){
    var c = k.canvas(420);
    var K = k.slider("Capital emprunté", 5000, 50000, 1000, 20000, "€");
    var tx = k.slider("Taux annuel", 0, 10, 0.5, 5, "%");
    var n = k.slider("Durée", 1, 20, 1, 10, "ans");
    var kk = k.slider("Année k à examiner", 1, 20, 1, 1, "");
    var ro = k.readouts(["Annuité A", "Intérêts totaux", "Intérêts année k", "Capital remboursé", "Dette après k"]);
    var nt = k.note("", "ok"), axc = null;
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && axc){ var N0 = n.value; kk.set(Math.max(1, Math.min(N0, Math.floor(axc.ix(p.x)) + 1))); k.redraw(); } });
    k.draw(function(){
      c.clear(); var cap = K.value, t = tx.value / 100, N = n.value, i;
      var A = t === 0 ? cap / N : cap * t / (1 - Math.pow(1 + t, -N));
      var D = cap, rows = [], tot = 0;
      for (i = 1; i <= N; i++){ var it = D * t, cp = A - it; D = D - cp; rows.push({i:it, c:cp, d:Math.max(0, Math.abs(D) < 1e-6 ? 0 : D)}); tot += it; }
      var sel = Math.min(kk.value, N), ctx = c.ctx, L = 56, Rr = 12, T = 40, B = 30, w = (c.W - L - Rr) / N, sc = (c.H - T - B) / (A * 1.08);
      var ax = axc = S.draw.axes(c, {x0:0, x1:N, y0:0, y1:A * 1.08, l:56, r:12, t:40, b:30, xl:"année", stepX:N > 10 ? 2 : 1, grid:false});
      for (i = 0; i < N; i++){
        var x = L + i * w, y0 = c.H - B, hc = rows[i].c * sc, hi = rows[i].i * sc;
        ctx.fillStyle = (i + 1 === sel) ? P.green : "rgba(46,107,85,.6)"; ctx.fillRect(x + 1, y0 - hc, w - 2, hc);
        ctx.fillStyle = (i + 1 === sel) ? P.red : "rgba(180,35,24,.6)"; ctx.fillRect(x + 1, y0 - hc - hi, w - 2, hi);
      }
      S.draw.legend(c, [[P.green, "capital remboursé"], [P.red, "intérêts"]], c.W - 150, 8); S.draw.label(c, "touche une barre : année k", 12, 18, {color:P.grey, align:"left", size:11});
      var rw = rows[sel - 1];
      ro.set(0, money(A) + " €"); ro.set(1, money(tot) + " €"); ro.set(2, money(rw.i) + " €"); ro.set(3, money(rw.c) + " €"); ro.set(4, money(rw.d) + " €");
      nt.set("Tu rembourses " + money(A * N) + " € au total pour " + money(cap) + " € empruntés. En année " + sel + ", " + F(rw.i / A * 100, 0) + " % de l'annuité sont des intérêts" + (kk.value > N ? " (k limité à la durée " + N + ")." : "."), "ok");
    });
  }
});
})();
