/* ===== PX : aides de dessin et d'interaction communes aux simulations de Physique 4e (chargé avec sims-01.js) ===== */
window.PX = (function(){
  var S = window.SFA, X = {};
  function pal(){ return S.draw.palette; }
  X.G = 9.8;
  X.ink = "#0f1b2d"; X.mute = "#5f6b7a";
  /* canvas dont la hauteur dépend de la largeur : ratio « bureau » au-dessus de 460 px, ratio « téléphone » en dessous */
  X.canvas = function(k, desk, phone){
    var c = k.canvas(0, {ratio:desk});
    Object.defineProperty(c, "ratio", {get:function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; return w < 460 ? (phone || desk) : desk; }, configurable:true});
    c.resize();
    return c;
  };
  X.phone = function(c){ return c.W < 460; };
  X.lin = function(c, x0, y0, x1, y1, stops){
    var g = c.ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(function(s){ g.addColorStop(s[0], s[1]); }); return g;
  };
  /* fond dégradé sur tout le canevas (ciel, laboratoire…) */
  X.bg = function(c, top, bot){
    var ctx = c.ctx; ctx.save(); ctx.fillStyle = X.lin(c, 0, 0, 0, c.H, [[0, top], [1, bot]]); ctx.fillRect(0, 0, c.W, c.H); ctx.restore();
  };
  /* sol : bande herbe/terre/dalle */
  X.ground = function(c, y, col, h){
    var ctx = c.ctx; h = h || (c.H - y); ctx.save();
    ctx.fillStyle = X.lin(c, 0, y, 0, y + h, [[0, col || "#9aa7b5"], [1, S.draw.tint(col || "#9aa7b5", 0.55)]]); ctx.fillRect(0, y, c.W, h);
    ctx.fillStyle = "rgba(15,27,45,.18)"; ctx.fillRect(0, y, c.W, 1.5); ctx.restore();
  };
  /* sphère ombrée */
  X.ball = function(c, x, y, r, col, opt){
    var ctx = c.ctx; opt = opt || {}; ctx.save();
    if (opt.shadowY != null){ ctx.fillStyle = "rgba(15,27,45," + (opt.shadowA || 0.18) + ")"; ctx.beginPath(); ctx.ellipse(x, opt.shadowY, r * 0.95, r * 0.28, 0, 0, 6.2832); ctx.fill(); }
    var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.4, r * 0.1, x, y, r * 1.05);
    g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.28, col); g.addColorStop(1, shade(col, -0.42));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.stroke(); ctx.restore();
  };
  function hex2rgb(h){ h = String(h); if (/^#[0-9a-f]{3}$/i.test(h)) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [128, 128, 128]; }
  function shade(col, f){ var r = hex2rgb(col); return "rgb(" + r.map(function(v){ return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }).join(",") + ")"; }
  X.shade = shade;
  /* personnage : (x, y) = pieds ; h = hauteur ; dir = ±1 ; opt {col, skin, arm} */
  X.person = function(c, x, y, h, opt){
    opt = opt || {}; var ctx = c.ctx, col = opt.col || "#1f4b9e", dir = opt.dir || 1, sk = opt.skin || "#f0c9a0";
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.lineCap = "round"; ctx.lineJoin = "round";
    var u = h / 100, sw = opt.step || 0;   /* sw : balancement des jambes (−1 à 1) */
    ctx.fillStyle = "rgba(15,27,45,.16)"; ctx.beginPath(); ctx.ellipse(0, 0, 17 * u, 4 * u, 0, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = "#233047"; ctx.lineWidth = 8 * u;
    ctx.beginPath(); ctx.moveTo(-3 * u, -46 * u); ctx.lineTo((-3 + 11 * sw) * u, -3 * u); ctx.moveTo(3 * u, -46 * u); ctx.lineTo((3 - 11 * sw) * u, -3 * u); ctx.stroke();
    ctx.fillStyle = col; X.rr(ctx, -12 * u, -84 * u, 24 * u, 42 * u, 9 * u); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 7 * u; ctx.beginPath(); ctx.moveTo(0, -76 * u);
    ctx.lineTo((opt.armX == null ? 9 : opt.armX) * u, (opt.armY == null ? -56 : opt.armY) * u); ctx.stroke();
    ctx.fillStyle = sk; ctx.beginPath(); ctx.arc(0, -92 * u, 10 * u, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#3b2a1c"; ctx.beginPath(); ctx.arc(-1 * u, -95 * u, 10 * u, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    ctx.restore();
  };
  X.rr = function(ctx, x, y, w, h, r){ r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  X.cloud = function(c, x, y, s, a){
    var ctx = c.ctx; ctx.save(); ctx.fillStyle = "rgba(255,255,255," + (a == null ? 0.85 : a) + ")";
    [[0, 0, 14], [14, -6, 17], [32, 0, 13], [16, 4, 14]].forEach(function(p){ ctx.beginPath(); ctx.arc(x + p[0] * s, y + p[1] * s, p[2] * s, 0, 6.2832); ctx.fill(); });
    ctx.restore();
  };
  /* règle verticale graduée : (x, yBas) → yHaut pour v0…v1 ; renvoie la fonction v→y */
  X.vruler = function(c, x, yb, yt, v0, v1, step, unit, opt){
    opt = opt || {}; var ctx = c.ctx, Y = function(v){ return yb - (v - v0) / (v1 - v0) * (yb - yt); };
    ctx.save(); ctx.strokeStyle = opt.col || "#8a95a3"; ctx.fillStyle = opt.col || "#5f6b7a"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, yt); ctx.stroke();
    ctx.font = "700 10.5px Mulish, system-ui, sans-serif"; ctx.textAlign = opt.right ? "left" : "right"; ctx.textBaseline = "middle";
    var minpx = 22, k = Math.max(1, Math.ceil(minpx / Math.abs(Y(v0 + step) - Y(v0))));
    for (var v = Math.ceil(v0 / step) * step, i = 0; v <= v1 + 1e-9; v += step, i++){
      var y = Y(v), big = Math.round((v - v0) / step) % k === 0;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (opt.right ? 1 : -1) * (big ? 7 : 4), y); ctx.stroke();
      if (big) ctx.fillText(S.fmt(v, step < 1 ? 1 : 0), x + (opt.right ? 1 : -1) * 10, y);
    }
    if (unit){ ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(unit, x, yt - 4); }
    ctx.restore(); return Y;
  };
  /* ligne de cote : double flèche entre (x1,y1) et (x2,y2) avec étiquette au milieu */
  X.dim = function(c, x1, y1, x2, y2, txt, col, off){
    var D = S.draw; col = col || pal().amber; D.line(c, x1, y1, x2, y2, col, 1.6);
    var a = Math.atan2(y2 - y1, x2 - x1), t = 6;
    [[x1, y1, 1], [x2, y2, -1]].forEach(function(p){ var ctx = c.ctx; ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(p[0], p[1]);
      ctx.lineTo(p[0] + p[2] * t * Math.cos(a - 0.4), p[1] + p[2] * t * Math.sin(a - 0.4)); ctx.lineTo(p[0] + p[2] * t * Math.cos(a + 0.4), p[1] + p[2] * t * Math.sin(a + 0.4)); ctx.fill(); ctx.restore(); });
    if (txt) D.label(c, txt, (x1 + x2) / 2 + (off ? off[0] : 0), (y1 + y2) / 2 + (off ? off[1] : 0), {color:col});
  };
  /* poignée à saisir : disque blanc cerclé de la couleur + éclat ; hint = texte facultatif */
  X.grip = function(c, x, y, col, hint, r){
    var ctx = c.ctx; r = r || 9; col = col || pal().red; ctx.save();
    S.draw.glow(c, x, y, r * 3, col, 0.32);
    ctx.fillStyle = "#fff"; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, 6.2832); ctx.fill(); ctx.restore();
    if (hint) S.draw.label(c, hint, x, y - r - 12, {color:col, size:11});
  };
  /* saisie à la souris / au doigt : get() renvoie des poignées {x, y, r, set(px, py), tip?} ; redessin par k.redraw() */
  X.drag = function(k, c, get, onEnd){
    var act = null;
    function near(p){
      var best = null, bd = 1e9, hs = get() || [];
      hs.forEach(function(h){ if (!h) return; var d = Math.hypot(h.x - p.x, h.y - p.y), rr = (h.r || 12) + 12; if (d < rr && d < bd){ best = h; bd = d; } });
      return best;
    }
    c.pointer(function(type, p){
      if (type === "down"){ act = near(p); if (act){ c.cv.style.cursor = "grabbing"; act.set(p.x, p.y); k.redraw(); } }
      else if (type === "drag"){ if (act){ act.set(p.x, p.y); k.redraw(); } }
      else if (type === "move"){ c.cv.style.cursor = near(p) ? "grab" : "default"; }
      else if (type === "up"){ if (act && onEnd) onEnd(); act = null; c.cv.style.cursor = "default"; }
    });
  };
  /* pastille d'état (✓ / ✗) en haut du canevas */
  X.badge = function(c, txt, ok, x, y){
    var P = pal(); S.draw.label(c, txt, x == null ? c.W / 2 : x, y == null ? 16 : y, {color:ok ? P.green : P.red, size:12, weight:800});
  };

  /* route : ciel, collines, herbe, bitume avec lignes ; renvoie le centre vertical de la chaussée */
  X.road = function(c, y, h, off, opt){
    opt = opt || {}; var ctx = c.ctx; if (opt.bg !== false) X.bg(c, "#cfe3f7", "#eef6fd");
    ctx.save(); ctx.fillStyle = "#cfe3cf"; ctx.beginPath(); ctx.moveTo(0, y);
    for (var x = 0; x <= c.W; x += 8) ctx.lineTo(x, y - 14 - 9 * Math.sin(x / 70 + 1) - 5 * Math.sin(x / 31)); ctx.lineTo(c.W, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = X.lin(c, 0, y - 6, 0, c.H, [[0, "#9fc58b"], [1, "#82ae72"]]); ctx.fillRect(0, y - 6, c.W, c.H - y + 6);
    ctx.fillStyle = X.lin(c, 0, y, 0, y + h, [[0, "#6b7787"], [1, "#4c5767"]]); ctx.fillRect(0, y, c.W, h);
    ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(0, y + 2, c.W, 1.5); ctx.fillRect(0, y + h - 3.5, c.W, 1.5);
    if (!opt.nodash){ ctx.fillStyle = "rgba(255,255,255,.75)"; var o = ((off || 0) % 36 + 36) % 36; for (var q = -36 + o; q < c.W; q += 36) ctx.fillRect(q, y + h / 2 - 1, 18, 2.2); }
    ctx.restore(); return y + h / 2;
  };
  X.fs = function(c, a){ return c.W < 460 ? Math.max(10.5, a - 1) : a; };
  return X;
})();

/* ---- remplacements plus soignés des aides de page.js (mêmes signatures) : étiquettes lisibles, barres arrondies, voiture dessinée ---- */
(function(){
  var S = window.SFA, P4 = window.P4;
  if (!P4 || P4._px) return; P4._px = true;
  /* étiquette sur pastille blanche : reste lisible sur une grille ou une courbe, 11,5 px minimum */
  P4.label = function(c, s, x, y, color, align){
    S.draw.text(c, s, x, y, {size:c.W < 460 ? 11.5 : 12, color:color || "#2c3a4e", align:align || "center", bg:"rgba(255,255,255,.8)"});
  };
  P4.bars = function(c, items, opts){
    var ctx = c.ctx, ph = c.W < 460, L = 0, R = ph ? 66 : 78, rowH = c.H / items.length, lo = opts.lo, hi = opts.hi;
    var X = function(v){ return L + (v - lo) / (hi - lo) * (c.W - L - R); };
    ctx.save(); ctx.font = "800 " + (ph ? 12 : 13) + "px Mulish, system-ui, sans-serif"; items.forEach(function(it){ L = Math.max(L, ctx.measureText(it.n).width + 14); }); ctx.restore(); L = Math.max(L, ph ? 40 : 52);
    var X = function(v){ return L + (v - lo) / (hi - lo) * (c.W - L - R); };
    c.clear();
    ctx.save(); ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X(0), 3); ctx.lineTo(X(0), c.H - 3); ctx.stroke(); ctx.restore();
    items.forEach(function(it, i){
      var y = i * rowH + rowH / 2, h = Math.min(24, rowH * 0.62), x0 = X(0), x1 = X(it.v), bx = Math.min(x0, x1), bw = Math.max(2, Math.abs(x1 - x0));
      ctx.save(); ctx.fillStyle = "#eef1f5"; PX.rr(ctx, L, y - h / 2, c.W - L - R, h, 6); ctx.fill();
      var g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, it.col); g.addColorStop(1, PX.shade(it.col, -0.25));
      ctx.fillStyle = g; PX.rr(ctx, bx, y - h / 2, bw, h, 6); ctx.fill(); ctx.restore();
      S.draw.text(c, it.n, 6, y, {size:ph ? 12 : 13, color:it.col, align:"left", weight:800});
      S.draw.text(c, (opts.fmt || function(v){ return S.fmt(v, 0); })(it.v) + " " + (opts.unit || ""), c.W - R + 8, y, {size:ph ? 11.5 : 12.5, color:"#2c3a4e", align:"left"});
    });
  };
  /* voiture de profil : carrosserie dégradée, vitres, roues à jantes ; (x, y) = milieu de la voiture, y = sol */
  P4.car = function(c, x, y, w, color, dir){
    var ctx = c.ctx, h = w * 0.4, col = color || "#1e3f8f", u = w / 100; ctx.save(); ctx.translate(x, y); if (dir < 0) ctx.scale(-1, 1);
    ctx.fillStyle = "rgba(15,27,45,.18)"; ctx.beginPath(); ctx.ellipse(0, 0, w * 0.5, 3.5 * u + 1, 0, 0, 6.2832); ctx.fill();
    var g = ctx.createLinearGradient(0, -h, 0, -4 * u); g.addColorStop(0, PX.shade(col, 0.25)); g.addColorStop(1, PX.shade(col, -0.2));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-50 * u, -9 * u); ctx.lineTo(-50 * u, -20 * u); ctx.quadraticCurveTo(-48 * u, -27 * u, -38 * u, -28 * u); ctx.lineTo(-24 * u, -30 * u);
    ctx.lineTo(-14 * u, -43 * u); ctx.lineTo(16 * u, -43 * u); ctx.lineTo(30 * u, -29 * u); ctx.lineTo(44 * u, -26 * u); ctx.quadraticCurveTo(50 * u, -24 * u, 50 * u, -16 * u); ctx.lineTo(50 * u, -9 * u); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.stroke();
    ctx.fillStyle = "rgba(214,232,250,.95)"; ctx.beginPath(); ctx.moveTo(-18 * u, -30 * u); ctx.lineTo(-11 * u, -40 * u); ctx.lineTo(-1 * u, -40 * u); ctx.lineTo(-1 * u, -30 * u); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(3 * u, -30 * u); ctx.lineTo(3 * u, -40 * u); ctx.lineTo(14 * u, -40 * u); ctx.lineTo(24 * u, -30 * u); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.fillRect(46 * u, -21 * u, 4 * u, 4 * u); ctx.fillStyle = "#e0562f"; ctx.fillRect(-50 * u, -20 * u, 3 * u, 4 * u);
    [-30, 30].forEach(function(dx){ ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(dx * u, -8 * u, 9 * u, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#c9d1dc"; ctx.beginPath(); ctx.arc(dx * u, -8 * u, 4.2 * u, 0, 6.2832); ctx.fill(); });
    ctx.restore();
  };
})();

/* Physique 4e · chapitre 1 · Mouvement et vitesse */
SFA.sim({
  id:"p4-c01-voiture", ch:"c01", tag:"Graphes",
  titre:"La voiture et son graphique x(t)",
  resume:"Fais rouler une voiture : la position et la vitesse se lisent sur le graphique.",
  but:"Choisis la vitesse et la position de départ (ou glisse la voiture et la flèche rouge), lance l'animation, puis regarde comment la droite x(t) change. Tu peux aussi cliquer sur le graphique pour choisir l'instant.",
  aRetenir:"Pour un MRU, x(t) est une droite et sa pente est la vitesse : v = Δx/Δt. Pour passer de m/s à km/h, on multiplie par 3,6.",
  piege:"La pente du graphique donne la vitesse, pas la position. Deux droites parallèles = même vitesse, même si elles ne démarrent pas au même endroit.",
  build:function(k,S){
    var P = S.draw.palette, road = PX.canvas(k, 0.34, 0.46), g = PX.canvas(k, 0.5, 0.65), st = {t:0, hint:true}, geo = {}, A = {};
    var v = k.slider("Vitesse v", -20, 30, 1, 10, "m/s", function(){ st.hint = false; });
    var x0 = k.slider("Position de départ x₀", -40, 40, 5, -20, "m", function(){ st.hint = false; });
    var ts = k.slider("Instant t", 0, 10, 0.1, 0, "s", function(val){ st.t = val; });
    var ro = k.readouts(["Position x(t)", "v en m/s", "v en km/h", "Δx entre 6 s et 8 s"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t = Math.min(10, st.t + dt); ts.set(st.t); if (st.t >= 10) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ if (st.t >= 10){ st.t = 0; ts.set(0); } st.hint = false; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Départ", function(){ lp.pause(); st.t = 0; ts.set(0); });
    PX.drag(k, road, function(){ return [
      {x:geo.cx, y:geo.cy - 8, r:34, set:function(px){ st.hint = false; x0.set(Math.max(-40, Math.min(40, Math.round((geo.lo + (px - geo.pad) / geo.rs - v.value * st.t) / 5) * 5))); }},
      {x:geo.ax, y:geo.ay, r:11, set:function(px){ st.hint = false; v.set(Math.max(-20, Math.min(30, Math.round((px - geo.cx) / 3.2)))); }}
    ]; });
    g.pointer(function(type, p){ if (type === "up" || type === "move" || !A.ax) return; lp.pause(); st.t = Math.max(0, Math.min(10, Math.round(A.ax.ix(p.x) * 10) / 10)); ts.set(st.t); k.redraw(); });
    k.draw(function(){
      var V = v.value, X0 = x0.value, T = st.t, X = X0 + V * T, xe = X0 + V * 10, ph = PX.phone(road);
      var lo = Math.min(X0, xe) - 10, hi = Math.max(X0, xe) + 10;
      if (hi - lo < 60){ var m = (hi + lo) / 2; lo = m - 30; hi = m + 30; }
      lo = Math.floor(lo / 10) * 10; hi = Math.ceil(hi / 10) * 10;
      var pad = 36, RX = function(x){ return pad + (x - lo) / (hi - lo) * (road.W - 2 * pad); }, ry = road.H - (ph ? 70 : 62), rh = 34;
      geo.pad = pad; geo.lo = lo; geo.rs = (road.W - 2 * pad) / (hi - lo);
      road.clear(); var cx = road.ctx;
      PX.road(road, ry, rh, -X * geo.rs);
      var step = P4.nice((hi - lo) / 6);
      for (var q = Math.ceil(lo / step) * step; q <= hi + 1e-9; q += step){
        var xx = RX(q); cx.fillStyle = "#ffffff"; cx.fillRect(xx - 1, ry + rh + 2, 2, 8); S.draw.text(road, S.fmt(q, 0), xx, ry + rh + 20, {size:PX.fs(road, 11.5), color:"#13233a", bg:"rgba(255,255,255,.75)"});
      }
      S.draw.label(road, "x (m)", road.W - 26, ry + rh + 20, {color:"#13233a", size:11});
      /* repère x = 0 */
      if (lo < 0 && hi > 0){ cx.fillStyle = "#c0321d"; cx.fillRect(RX(0) - 1.5, ry - 22, 3, 22); cx.beginPath(); cx.moveTo(RX(0) + 1.5, ry - 22); cx.lineTo(RX(0) + 16, ry - 17); cx.lineTo(RX(0) + 1.5, ry - 12); cx.fill(); }
      var carW = ph ? 74 : 92; geo.cx = RX(X); geo.cy = ry + rh * 0.82;
      P4.car(road, RX(X), ry + rh * 0.82, carW, P.acc, V < 0 ? -1 : 1);
      var ax2 = RX(X) + (V >= 0 ? 1 : -1) * (Math.min(120, 8 + Math.abs(V) * 3.2)); geo.ax = V === 0 ? RX(X) + 14 : ax2; geo.ay = ry - 40;
      if (V !== 0){ S.draw.arrow(road, RX(X), ry - 40, ax2, ry - 40, P.red, 3.4); S.draw.label(road, "v = " + S.fmt(V, 0) + " m/s", (RX(X) + ax2) / 2, ry - 62, {color:P.red, size:PX.fs(road, 11.5)}); }
      if (st.hint){ PX.grip(road, geo.ax, geo.ay, P.red, "tire", 7); }
      g.clear();
      var ax = S.draw.axes(g, {x0:0, x1:10, y0:lo, y1:hi, xl:"t (s)", yl:"x (m)", stepX:1}); A.ax = ax;
      S.draw.line(g, ax.X(0), ax.Y(X0), ax.X(10), ax.Y(xe), P.acc, 3);
      var a = X0 + V * 6, b = X0 + V * 8;
      S.draw.line(g, ax.X(6), ax.Y(a), ax.X(8), ax.Y(a), P.amber, 2, [5, 4]);
      S.draw.line(g, ax.X(8), ax.Y(a), ax.X(8), ax.Y(b), P.amber, 2, [5, 4]);
      S.draw.label(g, "Δt = 2 s", ax.X(7), ax.Y(a) + (V >= 0 ? 14 : -14), {color:P.amber, size:11.5});
      S.draw.label(g, "Δx", ax.X(8) + 16, (ax.Y(a) + ax.Y(b)) / 2, {color:P.amber, size:11.5});
      S.draw.line(g, ax.X(T), ax.B, ax.X(T), ax.Y(X), "#b8c0cc", 1, [3, 3]);
      S.draw.dot(g, ax.X(T), ax.Y(X), 6.5, P.red);
      ro.set(0, S.fmt(X, 1) + " m"); ro.set(1, S.fmt(V, 0)); ro.set(2, S.fmt(V * 3.6, 1)); ro.set(3, S.fmt(2 * V, 0) + " m");
      nt.set(V === 0 ? "v = 0 : la voiture est immobile, la droite est horizontale." : V < 0 ? "v < 0 : la voiture recule (vers les x négatifs), la droite descend." : "v > 0 : la voiture avance, la droite monte. Plus v est grand, plus la droite est raide.", V === 0 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c01-rattrapage", ch:"c01", tag:"Rencontre",
  titre:"Le rattrapage : où et quand se croisent-ils ?",
  resume:"Deux mobiles, une avance, deux vitesses : trouve l'instant et le lieu de la rencontre.",
  but:"Le mobile A part avec une avance sur B (glisse la voiture A pour changer l'avance). Règle les vitesses, puis cherche le point où les deux droites se coupent.",
  aRetenir:"Ils se rencontrent quand leurs positions sont égales : d + v<sub>A</sub>·t = v<sub>B</sub>·t, donc t = d/(v<sub>B</sub> − v<sub>A</sub>). Si v<sub>B</sub> ≤ v<sub>A</sub>, B ne rattrape jamais A.",
  piege:"Ce qui compte pour rattraper, c'est la DIFFÉRENCE des vitesses (la vitesse relative), pas les vitesses séparément.",
  build:function(k,S){
    var P = S.draw.palette, road = PX.canvas(k, 0.4, 0.55), g = PX.canvas(k, 0.5, 0.66), st = {f:0, hint:true}, geo = {}, A0 = {};
    var d = k.slider("Avance de A sur B", 0, 200, 10, 100, "m", function(){ st.hint = false; });
    var vA = k.slider("Vitesse de A", 0, 30, 1, 10, "m/s");
    var vB = k.slider("Vitesse de B", 0, 40, 1, 20, "m/s");
    var fs = k.slider("Film (0 à 100 % de la durée affichée)", 0, 100, 1, 0, "%", function(val){ st.f = val; });
    var ro = k.readouts(["Instant de rencontre", "Lieu de la rencontre", "Écart à l'instant choisi"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.f = Math.min(100, st.f + dt * 20); fs.set(st.f); if (st.f >= 100) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ if (st.f >= 100){ st.f = 0; fs.set(0); } st.hint = false; lp.play(); }, true);
    k.button("↺ Départ", function(){ lp.pause(); st.f = 0; fs.set(0); });
    PX.drag(k, road, function(){ return [{x:geo.xa, y:geo.ya - 10, r:32, set:function(px){ st.hint = false; var m = (px - geo.pad) / geo.rs - (st.f ? geo.xAnow - geo.D : 0); d.set(Math.max(0, Math.min(200, Math.round((m) / 10) * 10))); }}]; });
    g.pointer(function(type, p){ if (type === "up" || type === "move" || !A0.ax) return; lp.pause(); st.f = Math.max(0, Math.min(100, Math.round(A0.ax.ix(p.x) / A0.tmax * 100))); fs.set(st.f); k.redraw(); });
    k.draw(function(){
      var D = d.value, a = vA.value, b = vB.value, rel = b - a, ph = PX.phone(road);
      var meet = rel > 0 && D > 0 ? D / rel : null;
      var tmax = meet !== null ? [10,20,30,50,100,200,300].filter(function(z){ return z >= 1.3 * meet; })[0] || 300 : 30;
      var T = tmax * st.f / 100, xA = D + a * T, xB = b * T;
      var ymax = Math.max(D + a * tmax, b * tmax, 20) * 1.05;
      var pad = 40, rs = (road.W - 2 * pad) / ymax, RX = function(x){ return pad + x * rs; };
      geo.pad = pad; geo.rs = rs; geo.D = D; geo.xAnow = xA; A0.tmax = tmax;
      var rh = 64, ry = road.H - rh - 34;
      road.clear(); var cx = road.ctx;
      PX.road(road, ry, rh, -T * 8, {nodash:true});
      cx.fillStyle = "rgba(255,255,255,.75)"; for (var q = 0; q < road.W; q += 36) cx.fillRect(q, ry + rh / 2 - 1, 18, 2.2);
      var ya = ry + rh * 0.4, yb = ry + rh * 0.86, cw = ph ? 62 : 80;
      geo.xa = RX(xA); geo.ya = ya;
      if (meet !== null && meet <= tmax){ var xm = RX(b * meet); cx.fillStyle = "rgba(244,197,66,.55)"; cx.fillRect(xm - 1.5, ry - 18, 3, rh + 18); S.draw.label(road, "rencontre", xm, ry - 28, {color:P.amber, size:11}); }
      P4.car(road, RX(xA), ya, cw, P.red, 1); P4.car(road, RX(xB), yb, cw, P.acc, 1);
      S.draw.label(road, "A", RX(xA), ya - cw * 0.5 - 6, {color:"#fff", fill:P.red, size:12}); S.draw.label(road, "B", RX(xB), yb - cw * 0.5 - 6 + 0, {color:"#fff", fill:P.acc, size:12});
      S.draw.line(road, RX(0), ry + rh + 6, RX(0), ry + rh + 14, "#13233a", 1.5); S.draw.label(road, "0", RX(0), ry + rh + 24, {color:"#13233a", size:11});
      S.draw.label(road, S.fmt(ymax, 0) + " m", road.W - 26, ry + rh + 24, {color:"#13233a", size:11});
      if (D > 0) PX.dim(road, RX(xB), ry - 4, RX(xA), ry - 4, "écart " + S.fmt(xA - xB, 0) + " m", P.amber, [0, -12]);
      if (st.hint) PX.grip(road, RX(xA), ya - 26, P.red, "glisse A", 7);
      g.clear();
      var ax = S.draw.axes(g, {x0:0, x1:tmax, y0:0, y1:ymax, xl:"t (s)", yl:"x (m)"}); A0.ax = ax;
      S.draw.line(g, ax.X(0), ax.Y(D), ax.X(tmax), ax.Y(D + a * tmax), P.red, 3);
      S.draw.line(g, ax.X(0), ax.Y(0), ax.X(tmax), ax.Y(b * tmax), P.acc, 3);
      S.draw.label(g, "A", ax.X(tmax) - 10, ax.Y(D + a * tmax) - 14, {color:P.red, size:12}); S.draw.label(g, "B", ax.X(tmax) - 10, ax.Y(b * tmax) + 14, {color:P.acc, size:12});
      if (meet !== null){
        S.draw.line(g, ax.X(meet), ax.B, ax.X(meet), ax.Y(b * meet), "#8a95a3", 1.5, [4, 4]);
        S.draw.dot(g, ax.X(meet), ax.Y(b * meet), 7, P.amber);
      }
      S.draw.line(g, ax.X(T), ax.B, ax.X(T), ax.T, "#b8c0cc", 1, [3, 3]);
      S.draw.dot(g, ax.X(T), ax.Y(xA), 5, P.red); S.draw.dot(g, ax.X(T), ax.Y(xB), 5, P.acc);
      if (meet !== null){ ro.set(0, S.fmt(meet, 1) + " s"); ro.set(1, S.fmt(b * meet, 0) + " m"); }
      else { ro.set(0, D === 0 ? "dès le départ" : "jamais"); ro.set(1, D === 0 ? "0 m" : "—"); }
      ro.set(2, S.fmt(xA - xB, 0) + " m (t = " + S.fmt(T, 1) + " s)");
      if (D === 0) nt.set("Avance nulle : A et B partent du même point. Ils ne sont ensemble qu'à t = 0 (puis B devance A si v<sub>B</sub> > v<sub>A</sub>).", "warn");
      else if (meet === null) nt.set("v<sub>B</sub> ≤ v<sub>A</sub> : l'écart ne se réduit pas, B ne rattrape jamais A. Les droites ne se coupent pas (pour t > 0).", "bad");
      else nt.set("Vitesse relative : " + S.fmt(rel, 0) + " m/s. L'écart de " + S.fmt(D, 0) + " m diminue de " + S.fmt(rel, 0) + " m chaque seconde : " + S.fmt(D, 0) + " / " + S.fmt(rel, 0) + " = " + S.fmt(meet, 1) + " s.", "");
    });
  }
});

SFA.sim({
  id:"p4-c01-moyenne", ch:"c01", tag:"Piège",
  titre:"Aller à 60, retour à 120 : vitesse moyenne ?",
  resume:"Pourquoi la vitesse moyenne n'est pas la moyenne des vitesses.",
  but:"Choisis la vitesse à l'aller et au retour sur la même distance. Compare la vraie vitesse moyenne avec la moyenne arithmétique, puis essaie le cas « même durée ».",
  aRetenir:"v<sub>moy</sub> = distance totale / durée totale. Sur des distances égales, on passe plus de temps à la vitesse lente : v<sub>moy</sub> = 2·v₁·v₂/(v₁ + v₂) (moyenne harmonique), toujours plus petite que (v₁ + v₂)/2.",
  piege:"« (60 + 120)/2 = 90 km/h » est faux pour un aller-retour de même distance : la vraie valeur est 80 km/h. La moyenne arithmétique n'est correcte que si les DURÉES sont égales.",
  build:function(k,S){
    var P0 = S.draw.palette, race = PX.canvas(k, 0.4, 0.62), g = PX.canvas(k, 0.55, 0.7), st = {u:0, run:false, last:null};
    var mode = k.seg("Les deux trajets ont…", [["d","même distance"],["t","même durée"]], "d");
    var v1 = k.slider("Vitesse 1 (aller)", 20, 150, 5, 60, "km/h");
    var v2 = k.slider("Vitesse 2 (retour)", 20, 150, 5, 120, "km/h");
    var dd = k.slider("Distance de chaque trajet", 60, 300, 20, 120, "km");
    var ro = k.readouts(["Durée totale", "Distance totale", "Vitesse moyenne", "Moyenne arithmétique"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.u += dt / 6; if (st.u >= 1.35){ st.u = 1.35; lp.pause(); } k.redraw(); });
    k.button("▶ Lancer la course des trois voitures", function(){ st.u = 0; lp.play(); }, true);
    k.button("↺ Départ", function(){ st.u = 0; lp.pause(); k.redraw(); });
    k.draw(function(){
      var A = v1.value, B = v2.value, m = mode.value, D = dd.value, d1, d2, t1, t2;
      if (m === "d"){ d1 = D; d2 = D; t1 = D / A; t2 = D / B; }
      else { t1 = D / A; t2 = t1; d1 = A * t1; d2 = B * t2; }   /* même durée : celle du trajet 1 */
      var T = t1 + t2, Dt = d1 + d2, vm = Dt / T, va = (A + B) / 2;
      /* course : réel (v₁ puis v₂), vitesse moyenne constante, moyenne arithmétique */
      race.clear(); var rc = race.ctx, ph = PX.phone(race), tt = st.u * T, Wl = race.W, rowH = race.H / 3, x0 = ph ? 40 : 52, x1 = Wl - 22;
      PX.bg(race, "#cfe3f7", "#eef6fd");
      var pos = [tt <= t1 ? A * tt : d1 + B * Math.min(tt - t1, t2), vm * tt, va * tt].map(function(q){ return Math.min(1, q / Dt); });
      var cols = [P0.acc, P0.green, P0.amber], names = ["trajet réel", "à v moyenne : " + S.fmt(vm, 0), "à (v₁+v₂)/2 : " + S.fmt(va, 0)];
      for (var r = 0; r < 3; r++){
        var yy = r * rowH, cyr = yy + rowH * 0.62;
        rc.fillStyle = r % 2 ? "#586377" : "#4c5767"; rc.fillRect(0, yy + 2, Wl, rowH - 4);
        rc.fillStyle = "rgba(255,255,255,.55)"; for (var q2 = 6; q2 < Wl; q2 += 28) rc.fillRect(q2, cyr + rowH * 0.3, 14, 1.6);
        var cw = Math.min(70, rowH * 1.55), xc = x0 + (x1 - x0 - cw * 0.5) * pos[r] + cw * 0.1;
        P4.car(race, xc, yy + rowH - 6, cw, cols[r], 1);
        S.draw.label(race, names[r], 8, yy + 11, {color:cols[r], align:"left", size:ph ? 10 : 11, fill:"rgba(255,255,255,.92)"});
      }
      rc.fillStyle = "#fff"; rc.fillRect(x1 + 8, 0, 4, race.H); for (var cq = 0; cq < race.H; cq += 8){ rc.fillStyle = (cq / 8) % 2 ? "#0f1b2d" : "#fff"; rc.fillRect(x1 + 8, cq, 4, 8); }
      S.draw.label(race, "t = " + S.fmt(Math.min(tt, T * 1.35), 2) + " h", Wl - 40, race.H - 11, {color:P0.ink, size:11.5, fill:"rgba(255,255,255,.95)"});
      g.clear();
      var ax = S.draw.axes(g, {x0:0, x1:T * 1.05, y0:0, y1:Math.max(Dt, va * T) * 1.08, xl:"t (h)", yl:"distance parcourue (km)"});
      S.draw.line(g, ax.X(0), ax.Y(0), ax.X(T), ax.Y(Dt), SFA.draw.palette.green, 2.5, [7, 5]);
      S.draw.line(g, ax.X(0), ax.Y(0), ax.X(T), ax.Y(va * T), SFA.draw.palette.amber, 2, [2, 4]);
      var ctx = g.ctx; ctx.save(); ctx.strokeStyle = SFA.draw.palette.acc; ctx.lineWidth = 3.5; ctx.beginPath();
      ctx.moveTo(ax.X(0), ax.Y(0)); ctx.lineTo(ax.X(t1), ax.Y(d1)); ctx.lineTo(ax.X(T), ax.Y(Dt)); ctx.stroke(); ctx.restore();
      S.draw.dot(g, ax.X(t1), ax.Y(d1), 5, SFA.draw.palette.acc);
      if (st.u > 0){ var tq = Math.min(tt, T); S.draw.dot(g, ax.X(tq), ax.Y(tq <= t1 ? A * tq : d1 + B * (tq - t1)), 6, SFA.draw.palette.red); }
      P4.label(g, "trajet réel", ax.X(t1) - 6, ax.Y(d1) - 14, SFA.draw.palette.acc, "right");
      P4.label(g, "pente = v moyenne", ax.X(T) - 4, ax.Y(Dt) + 14, SFA.draw.palette.green, "right");
      P4.label(g, "pente = (v₁+v₂)/2", ax.X(T) - 4, ax.Y(va * T) + (Math.abs(va - vm) < 4 ? 30 : 14), SFA.draw.palette.amber, "right");
      ro.set(0, S.fmt(T, 2) + " h"); ro.set(1, S.fmt(Dt, 0) + " km"); ro.set(2, S.fmt(vm, 1) + " km/h"); ro.set(3, S.fmt(va, 1) + " km/h");
      if (m === "d") nt.set("Même distance : t₁ = " + S.fmt(t1, 2) + " h, t₂ = " + S.fmt(t2, 2) + " h. On reste plus longtemps à la vitesse lente, donc v<sub>moy</sub> (" + S.fmt(vm, 1) + ") est plus proche de la plus petite." + (A === B ? " Ici v₁ = v₂ : les deux valeurs coïncident." : ""), A === B ? "" : "warn");
      else nt.set("Même durée (" + S.fmt(t1, 2) + " h chacun) : les distances sont " + S.fmt(d1, 0) + " km et " + S.fmt(d2, 0) + " km. Cette fois v<sub>moy</sub> est bien la moyenne arithmétique.", "");
    });
  }
});

SFA.sim({
  id:"p4-c01-referentiel", ch:"c01", tag:"Référentiel",
  titre:"Dans le train : quelle vitesse, par rapport à quoi ?",
  resume:"Un passager marche dans un train : sa vitesse change selon le référentiel choisi.",
  but:"Règle la vitesse du train et celle du passager (marche dans le train), ou tire sur les flèches. Les deux scènes montrent le même moment, vu du quai (en haut) et vu du train (en bas).",
  aRetenir:"Une vitesse n'a de sens que par rapport à un référentiel. Si tout se passe sur une même droite : v(passager/quai) = v(train/quai) + v(passager/train).",
  piege:"Marcher vers l'arrière du train : la vitesse du passager par rapport au quai est v<sub>train</sub> − v<sub>marche</sub>. Il peut même être immobile par rapport au quai !",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.74, 0.98), st = {hint:true};
    var vt = k.slider("Vitesse du train / quai", 0, 30, 1, 20, "m/s", function(){ st.hint = false; });
    var w = k.slider("Marche du passager / train", -5, 5, 0.5, 1.5, "m/s", function(){ st.hint = false; });
    var ref = k.seg("Je suis dans le référentiel…", [["q","Quai"],["t","Train"]], "q");
    var ro = k.readouts(["Train / quai", "Passager / train", "Passager / quai", "Quai / train"]);
    var nt = k.note("", "");
    var T = {x:0, p:-4, ph:0}, geo = {};
    var lp = k.loop(function(dt){ T.x += vt.value * dt; T.p += w.value * dt; T.ph += Math.abs(w.value) * dt * 2.2; if (w.value >= 0 && T.p > 7) T.p = -7; if (w.value < 0 && T.p < -7) T.p = 7; k.redraw(); });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Départ", function(){ T.x = 0; T.p = -4; });
    lp.play();
    var AS = 3.4, lenOf = function(v){ return Math.min(120, Math.abs(v) * AS + (v ? 8 : 0)); };
    PX.drag(k, c, function(){ return [
      {x:geo.t1x, y:geo.t1y, r:10, set:function(px){ st.hint = false; vt.set(Math.max(0, Math.min(30, Math.round((px - geo.t1x0 - 8) / AS)))); }},
      {x:geo.p2x, y:geo.p2y, r:10, set:function(px){ st.hint = false; w.set(Math.max(-5, Math.min(5, Math.round((px - geo.p2x0) / AS * 2) / 2))); }}
    ]; });
    function row(y0, h, frame, VT, W){
      var ctx = c.ctx, sc = c.W / 42, s = Math.min(1.25, h / 140), yg = y0 + h - 22, loop = 40 * (Math.ceil(c.W / sc / 40) + 1), i;
      ctx.save(); ctx.beginPath(); ctx.rect(0, y0, c.W, h); ctx.clip();
      ctx.fillStyle = PX.lin(c, 0, y0, 0, yg, [[0, "#cfe3f7"], [1, "#eef5fc"]]); ctx.fillRect(0, y0, c.W, h);
      ctx.fillStyle = "#9fb4a0"; ctx.fillRect(0, yg - 2, c.W, h);
      ctx.fillStyle = "#6b7787"; ctx.fillRect(0, yg - 2, c.W, 3);
      var offM = frame === "q" ? 0 : T.x;
      for (i = 0; i < loop / 40; i++){
        var xm = (((i * 40 - offM) % loop) + loop) % loop, xp = xm * sc - 20;
        if (xp > -20 && xp < c.W + 20){ ctx.fillStyle = "#8a95a3"; ctx.fillRect(xp - 2, yg - 46 * s, 4, 46 * s); ctx.fillStyle = P.red; PX.rr(ctx, xp - 7, yg - 54 * s, 14, 9 * s, 2); ctx.fill(); }
      }
      var L = 16 * sc, tx = frame === "q" ? ((T.x * sc) % (c.W + L + 40)) - L - 20 : c.W / 2 - L / 2, ty = yg - 62 * s, th = 52 * s;
      ctx.fillStyle = PX.lin(c, 0, ty, 0, ty + th, [[0, "#2c5db8"], [1, "#1a3a80"]]); PX.rr(ctx, tx, ty, L, th, 8 * s); ctx.fill();
      ctx.fillStyle = "#e7f0ff"; var nw = 4, ww = L / nw - 8; for (i = 0; i < nw; i++){ PX.rr(ctx, tx + 5 + i * (L / nw), ty + 6 * s, ww, 24 * s, 3); ctx.fill(); }
      ctx.fillStyle = "#f4c542"; ctx.fillRect(tx + 4, ty + th - 10 * s, L - 8, 3);
      ctx.fillStyle = "#13233a"; [0.16, 0.84].forEach(function(q){ ctx.beginPath(); ctx.arc(tx + L * q, yg - 4 * s, 7 * s, 0, 6.2832); ctx.fill(); });
      var px = tx + L / 2 + T.p * sc;
      PX.person(c, px, ty + th - 8 * s, 44 * s, {col:P.amber, step:Math.sin(T.ph) * (W === 0 ? 0 : 0.8), dir:W < 0 ? -1 : 1});
      var vTr = frame === "q" ? VT : 0, vPa = frame === "q" ? VT + W : W;
      var ay1 = ty - 20 * s, ay2 = ty - 42 * s;
      ctx.restore();
      var arrow = function(x, y, v, col, lab){
        if (v === 0){ S.draw.label(c, lab + " : 0", x, y, {color:col, size:PX.fs(c, 11.5)}); return null; }
        var d = v > 0 ? 1 : -1, x2 = x + d * lenOf(v); S.draw.arrow(c, x, y, x2, y, col, 3.4);
        S.draw.label(c, lab + " " + S.fmt(Math.abs(v), 1).replace(/,0$/, "") + " m/s", x + d * lenOf(v) / 2, y - 12, {color:col, size:PX.fs(c, 11.5)}); return x2;
      };
      var tcx = tx + L / 2, xe;
      xe = arrow(tcx, ay1, vTr, P.acc, "train");
      if (frame === "q"){ geo.t1x = xe == null ? tcx + 8 : xe; geo.t1y = ay1; geo.t1x0 = tcx; }
      xe = arrow(px, ay2, vPa, P.amber, "passager");
      if (frame === "t"){ geo.p2x = xe == null ? px : xe; geo.p2y = ay2; geo.p2x0 = px; }
      if (frame === "t" && VT > 0){ arrow(c.W * 0.78, yg - 70 * s, -VT, P.grey, "quai"); }
    }
    k.draw(function(){
      var VT = vt.value, W = w.value, R = ref.value, h = (c.H - 8) / 2;
      c.clear(); var ctx = c.ctx;
      row(0, h, "q", VT, W); row(h + 8, h, "t", VT, W);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, h, c.W, 8);
      [["q", 0], ["t", h + 8]].forEach(function(r){
        var on = R === r[0];
        S.draw.label(c, (on ? "Tu es sur le " : "Vu du ") + (r[0] === "q" ? "quai" : "train") + (on ? " (ton référentiel)" : ""), 10, r[1] + h - 9, {align:"left", color:on ? P.ink : P.grey, size:PX.fs(c, 12), fill:on ? "rgba(244,197,66,.55)" : "rgba(255,255,255,.8)"});
        if (!on){ ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, r[1], c.W, h); }
      });
      if (st.hint) PX.grip(c, geo.t1x, geo.t1y, P.acc, "tire", 7);
      var vP = R === "q" ? VT + W : W;
      ro.set(0, S.fmt(VT, 1) + " m/s"); ro.set(1, S.fmt(W, 1) + " m/s"); ro.set(2, S.fmt(VT + W, 1) + " m/s = " + S.fmt((VT + W) * 3.6, 0) + " km/h"); ro.set(3, S.fmt(-VT, 1) + " m/s");
      nt.set("Ici, dans ton référentiel (" + (R === "q" ? "le quai" : "le train") + "), le passager va à " + S.fmt(vP, 1) + " m/s." + (VT + W === 0 ? " Par rapport au quai il est immobile (sa marche annule celle du train)." : ""), VT + W === 0 ? "warn" : "");
    });
  }
});
