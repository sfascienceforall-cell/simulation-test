/* Chapitre 7 · Gravitation universelle et mouvement des astres */
(function(){
var G = 6.674e-11, MT = 5.972e24, RT = 6.371e6, ML = 7.348e22, DL = 3.844e8, GMT = G * MT;
SFA.sim({
  id: "p5-c07-terre-lune", ch: "c07", tag: "Classique",
  titre: "Terre et Lune : la loi de gravitation universelle",
  resume: "Masses et distance → force, vitesse et période.",
  but: "Fais varier la distance entre la Terre et la Lune, puis les masses. Que devient la force quand la distance double ? Les deux astres subissent-ils la même force ? Compare la période obtenue (27 jours) avec les valeurs réelles.",
  aRetenir: "F = G·m₁·m₂/r². Doubler la distance divise la force par 4 ; doubler une masse double la force. Les deux astres exercent l'un sur l'autre des forces de même valeur (troisième loi), mais le plus léger accélère le plus.",
  piege: "La force sur la Lune n'est pas plus petite que sur la Terre : elle est égale. C'est l'accélération (a = F/m) qui est plus grande pour la Lune. Et la loi est en 1/r², pas en 1/r.",
  build: function(k, S){
    var c = k.canvas(270), gr = k.canvas(190);
    var d = k.slider("Distance Terre-Lune (centre à centre)", 50, 800, 1, 384, "·10³ km");
    var fT = k.slider("Masse de la Terre (en masses terrestres)", 0.5, 5, 0.1, 1, "M⊕");
    var fL = k.slider("Masse de la Lune (en masses lunaires)", 0.1, 10, 0.1, 1, "M☾");
    k.button("Distance réelle (384 000 km)", function(){ d.set(384); });
    k.button("Doubler la distance", function(){ d.set(Math.min(800, d.value * 2)); });
    var ro = k.readouts(["Force F (sur chaque astre)", "Accélération de la Lune", "Accélération de la Terre", "Période de révolution", "Vitesse de la Lune"]);
    var nt = k.note("", ""), ph = 0, G0 = {cx: 0, cy: 0, sc: 1, mx: 0, my: 0}, gx = null;
    var lp = k.loop(function(dt){ ph += dt * 2 * Math.PI / 9; k.redraw(); }); lp.play();
    /* manipulation directe : on tire la Lune sur son orbite (distance) ; sur le graphe, on glisse le point */
    P5x.drag(c, k, function(){ return [{x: G0.mx, y: G0.my, r: 30, set: function(px, py){ d.set(Math.round(P5.clamp(Math.hypot(px - G0.cx, py - G0.cy) / G0.sc, 50, 800))); }}]; });
    P5x.drag(gr, k, function(){ if (!gx) return null; var F = G * MT * fT.value * ML * fL.value / Math.pow(d.value * 1e6, 2) / 1e20; return [{x: gx.X(d.value), y: gx.Y(Math.min(F, gx.y1)), r: 30, set: function(px){ d.set(Math.round(P5.clamp(gx.ix(px), 50, 800))); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, M1 = MT * fT.value, M2 = ML * fL.value, r = d.value * 1e6;
      var F = G * M1 * M2 / (r * r), aL = F / M2, aT = F / M1, T = 2 * Math.PI * Math.sqrt(r * r * r / (G * (M1 + M2))), rL = r * M1 / (M1 + M2), vL = 2 * Math.PI * rL / T;
      P5x.space(c);
      var cx = c.W / 2, cy = 136, sc = Math.min(c.W / 2 - 40, 130) / 800, rr = r / 1e6 * sc;
      var rE = rr * (M2 / (M1 + M2)), rM = rr * (M1 / (M1 + M2));
      G0.cx = cx; G0.cy = cy; G0.sc = sc * M1 / (M1 + M2);
      ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, rM, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, rE, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      var ex = cx - rE * Math.cos(ph), ey = cy + rE * Math.sin(ph), mx = cx + rM * Math.cos(ph), my = cy - rM * Math.sin(ph);
      G0.mx = mx; G0.my = my;
      S.draw.line(c, ex, ey, mx, my, "rgba(255,255,255,.3)", 1.3, [3, 4]);
      var rEp = 18 + 5 * Math.cbrt(fT.value), rMp = 5 + 3.4 * Math.cbrt(fL.value);
      S.draw.dot(c, cx, cy, 2.5, "#ffd66b");
      P5x.planet(c, ex, ey, rEp, "#2f6fc4", "#7fc0ff"); P5x.planet(c, mx, my, rMp, "#b4bcc9");
      var L0 = Math.hypot(mx - ex, my - ey), ux = (mx - ex) / L0, uy = (my - ey) / L0, La = 30 + 14 * Math.log10(Math.max(F, 1e18) / 1e18 + 1) * 4;
      La = P5.clamp(26 + 18 * Math.log10(F / 1e18 + 1), 26, 96);
      P5.vec(c, mx, my, mx - ux * La, my - uy * La, "#ff8a78", "F", {size: 14, w: 3.2});
      P5.vec(c, ex, ey, ex + ux * La, ey + uy * La, "#ff8a78", "F", {size: 14, w: 3.2});
      P5x.handle(c, mx, my, "#c9d3e3", 7);
      P5x.banner(c, "Mêmes valeurs de force : 3e loi de Newton", "#ff9f90", 20, {fill: "rgba(10,20,45,.8)"});
      P5x.hint(c, "Tire la Lune pour changer d · astres hors échelle · mouvement accéléré", {y: c.H - 10, color: "#9fb4da", size: 10.5});
      P5x.tag(c, "d = " + S.fmt(d.value, 0) + " 000 km", (ex + mx) / 2, (ey + my) / 2 - 12, "#e6eefc", {size: 11, fill: "rgba(10,20,45,.75)"});
      /* graphe F(r) avec le point à 2d */
      gr.clear();
      var Fs = function(x){ return G * M1 * M2 / Math.pow(x * 1e6, 2) / 1e20; }, ymax = Fs(100) * 1.05;
      gx = S.draw.axes(gr, {x0: 0, x1: 800, y0: 0, y1: ymax, xl: "r (10³ km)", yl: "F (10²⁰ N)", stepX: 100, l: 54});
      S.draw.area(gr, gx, function(x){ return x < 45 ? ymax : Fs(x); }, 50, 800, pal.red, 0.07);
      S.draw.fn(gr, gx, function(x){ return x < 40 ? Infinity : Fs(x); }, pal.red, 2.8);
      var d2 = d.value * 2;
      if (d2 <= 800){ S.draw.line(gr, gx.X(d2), gx.Y(0), gx.X(d2), gx.Y(Fs(d2)), pal.grey, 1.2, [4, 4]); S.draw.dot(gr, gx.X(d2), gx.Y(Fs(d2)), 5, "#ffffff"); gr.ctx.strokeStyle = pal.red; gr.ctx.lineWidth = 2; gr.ctx.beginPath(); gr.ctx.arc(gx.X(d2), gx.Y(Fs(d2)), 5, 0, 7); gr.ctx.stroke(); P5x.tag(gr, "2r : F ÷ 4", gx.X(d2) + (gx.X(d2) > gr.W - 110 ? -8 : 8), Math.min(gx.Y(Fs(d2)) - 16, gx.Y(0) - 40), pal.red, {align: gx.X(d2) > gr.W - 110 ? "right" : "left", size: 11}); }
      S.draw.line(gr, gx.X(d.value), gx.Y(0), gx.X(d.value), gx.Y(Fs(d.value)), pal.acc, 1.2, [4, 4]);
      P5x.handle(gr, gx.X(d.value), gx.Y(Math.min(Fs(d.value), ymax)), pal.acc, 8);
      var rl = gx.X(d.value) > gr.W - 120; P5x.tag(gr, "r = " + S.fmt(d.value, 0) + "·10³ km", gx.X(d.value) + (rl ? -12 : 12), gx.Y(0) - 14, pal.acc, {align: rl ? "right" : "left", size: 11});
      ro.set(0, S.sci(F, 2) + " N"); ro.set(1, S.sci(aL, 2) + " m/s²"); ro.set(2, S.sci(aT, 2) + " m/s²");
      ro.set(3, S.fmt(T / 86400, 1) + " jours"); ro.set(4, S.fmt(vL / 1000, 2) + " km/s");
      nt.set("F = G·M·m/r² = " + S.sci(F, 2) + " N. À la distance moyenne réelle (384 000 km, masses réelles), on trouve 1,98·10²⁰ N et 27,3 jours. Période : T = 2π·√(r³/(G·(M + m))).", "");
    });
  }
});


SFA.sim({
  id: "p5-c07-satellite", ch: "c07", tag: "Orbites",
  titre: "Satellite : altitude, vitesse, période et satellite géostationnaire",
  resume: "Altitude → g, vitesse orbitale, période. Trouve l'orbite géostationnaire.",
  but: "Change l'altitude du satellite. Repère à quelle altitude sa période est de 24 h : le satellite reste alors au-dessus du même point de l'équateur (point jaune). Remarque la valeur de g en orbite.",
  aRetenir: "Un satellite en orbite circulaire est en chute libre : la gravité est la force centripète, G·M·m/r² = m·v²/r, donc v = √(G·M/r) et T = 2π·√(r³/(G·M)). Plus on est haut, plus on va lentement et plus la période est longue. Géostationnaire : T = 23 h 56 min, h ≈ 35 800 km.",
  piege: "En orbite, la gravité n'est pas nulle : à 400 km d'altitude, g vaut encore ≈ 8,7 m/s² (89 % de sa valeur au sol). Les astronautes flottent parce qu'ils tombent en même temps que leur vaisseau, pas parce qu'il n'y a plus de gravité.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.86});
    var h = k.slider("Altitude du satellite", 200, 60000, 100, 400, "km");
    k.button("Station spatiale (400 km)", function(){ h.set(400); });
    k.button("GPS (20 200 km)", function(){ h.set(20200); });
    k.button("Géostationnaire (35 786 km)", function(){ h.set(35786); });
    k.button("Remettre la vue", function(){ yaw = 0.5; pit = 0.5; });
    var ro = k.readouts(["g à cette altitude", "Vitesse orbitale", "Période", "g / g au sol"]);
    var nt = k.note("", ""), t = 0, Tsid = 86164, yaw = 0.5, pit = 0.5;
    var lp = k.loop(function(dt){ t += dt * 1800; k.redraw(); }); lp.play();      /* 1 s = 30 min */
    /* vue 3D tournable : on glisse sur la scène */
    var lx = 0, ly = 0;
    c.pointer(function(type, p){
      if (type === "down"){ lx = p.x; ly = p.y; c.cv.style.cursor = "grabbing"; }
      else if (type === "drag"){ yaw += (p.x - lx) * 0.012; pit = P5.clamp(pit + (p.y - ly) * 0.012, -1.35, 1.35); lx = p.x; ly = p.y; k.redraw(); }
      else if (type === "up") c.cv.style.cursor = "grab";
    });
    c.cv.style.cursor = "grab"; c.cv.style.touchAction = "none";
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, H = h.value * 1000, r = RT + H, g = GMT / (r * r), v = Math.sqrt(GMT / r), T = 2 * Math.PI * Math.sqrt(r * r * r / GMT);
      P5x.space(c);
      var cx = c.W / 2, cy = c.H / 2 + 6, R = Math.min(c.W, c.H) / 2 - 26, epx = Math.max(RT / r * R, 9), D = 5 * R;
      var cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
      function pr(x, y, z){ var x1 = x * cy0 + z * sy0, z1 = -x * sy0 + z * cy0, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = D / (D - z2); return {x: cx + x1 * f, y: cy - y2 * f, z: z2, f: f}; }
      var eA = 2 * Math.PI * t / Tsid, sA = 2 * Math.PI * t / T;
      function ring(rad, col, w, dash, front){
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []);
        var seg = null; ctx.beginPath();
        for (var i = 0; i <= 120; i++){ var a = i / 120 * 2 * Math.PI, p = pr(rad * Math.cos(a), 0, rad * Math.sin(a)), vis = front ? p.z >= 0 : p.z < 0; if (vis){ if (seg) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); seg = true; } else seg = null; }
        ctx.stroke(); ctx.restore();
      }
      var rg = R * (RT + 35786e3) / r, showGeo = rg <= R * 1.7 && Math.abs(H - 35786e3) > 1500e3;
      if (showGeo){ ring(rg, "rgba(244,197,66,.45)", 1.3, [3, 5], false); }
      ring(R, "rgba(255,120,100,.45)", 2.2, null, false);
      var sp3 = pr(R * Math.cos(sA), 0, R * Math.sin(sA)), sBehind = sp3.z < 0;
      function sat(){
        var p = sp3; S.draw.glow(c, p.x, p.y, 14, "#ff8a78", 0.6);
        ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = "#cfd8e6"; ctx.fillRect(-3, -3, 6, 6); ctx.fillStyle = "#4d8be0"; ctx.fillRect(-12, -2, 8, 4); ctx.fillRect(4, -2, 8, 4); ctx.restore();
        var ex = pr(0, 0, 0); var dx = ex.x - p.x, dy = ex.y - p.y, d = Math.hypot(dx, dy) || 1;
        P5.vec(c, p.x, p.y, p.x + dx / d * 34, p.y + dy / d * 34, "#ff8a78", "", {w: 2.2});
      }
      if (sBehind && Math.hypot(sp3.x - cx, sp3.y - cy) > epx) sat();
      /* Terre : sphère, océan, continents (calottes), méridiens */
      P5x.planet(c, cx, cy, epx, "#2f6fc4", "#7fc0ff");
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, epx, 0, 7); ctx.clip();
      function sph(lat, lon){ var la = lat * Math.PI / 180, lo = lon * Math.PI / 180 + eA; return pr(epx * Math.cos(la) * Math.cos(lo), epx * Math.sin(la), epx * Math.cos(la) * Math.sin(lo)); }
      [[48, 15, 26], [5, 20, 30], [40, -100, 28], [-12, -58, 22], [48, 95, 34], [-25, 135, 14]].forEach(function(L){
        var pts = [], vis = 0; for (var i = 0; i < 28; i++){ var a = i / 28 * 2 * Math.PI, lat = L[0] + L[2] * 0.7 * Math.sin(a), lon = L[1] + L[2] * 1.1 * Math.cos(a), p = sph(lat, lon); if (p.z > 0) vis++; pts.push(p); }
        if (vis < 2) return; ctx.fillStyle = "rgba(76,160,96,.8)"; ctx.beginPath();
        pts.forEach(function(p, i){ var X = p.x, Y = p.y; if (p.z <= 0){ var dx = X - cx, dy = Y - cy, d = Math.hypot(dx, dy) || 1; X = cx + dx / d * epx * 0.999; Y = cy + dy / d * epx * 0.999; } if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }); ctx.closePath(); ctx.fill();
      });
      ctx.lineWidth = 0.9; ctx.strokeStyle = "rgba(255,255,255,.28)";
      for (var lo = 0; lo < 360; lo += 30){ ctx.beginPath(); var on = false; for (var la = -90; la <= 90; la += 6){ var p = sph(la, lo); if (p.z > 0){ if (on) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); on = true; } else on = false; } ctx.stroke(); }
      for (var la2 = -60; la2 <= 60; la2 += 30){ ctx.beginPath(); on = false; for (var lo2 = 0; lo2 <= 360; lo2 += 6){ var p2 = sph(la2, lo2); if (p2.z > 0){ if (on) ctx.lineTo(p2.x, p2.y); else ctx.moveTo(p2.x, p2.y); on = true; } else on = false; } ctx.stroke(); }
      ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); on = false; for (var lo3 = 0; lo3 <= 360; lo3 += 4){ var p3 = sph(0, lo3); if (p3.z > 0){ if (on) ctx.lineTo(p3.x, p3.y); else ctx.moveTo(p3.x, p3.y); on = true; } else on = false; } ctx.stroke();
      ctx.restore();
      /* un lieu de l'équateur (point jaune) */
      var pj = sph(0, 0); if (pj.z > 0) S.draw.dot(c, pj.x, pj.y, 4.5, pal.yellow);
      /* axe des pôles */
      var pn = pr(0, epx * 1.25, 0), ps = pr(0, 0, 0); S.draw.line(c, pn.x, pn.y, cx + (pn.x - cx) * 0.8, cy + (pn.y - cy) * 0.8, "rgba(255,255,255,.4)", 1.2, [2, 3]); P5x.tag(c, "N", pn.x, pn.y - 8, "#cfdcf5", {size: 11, fill: "rgba(10,20,45,.6)"});
      ring(R, "#ff7864", 2.6, null, true);
      if (showGeo) ring(rg, "rgba(244,197,66,.9)", 1.5, [3, 5], true);
      if (!(sBehind && Math.hypot(sp3.x - cx, sp3.y - cy) > epx) && !(sBehind)) sat();
      else if (sBehind && Math.hypot(sp3.x - cx, sp3.y - cy) <= epx){ /* masqué par la Terre */ }
      if (showGeo){ var gp = pr(rg * Math.cos(eA), 0, rg * Math.sin(eA)); if (gp.z > -epx * 0.3) P5x.tag(c, "géostationnaire", gp.x, gp.y - 12, "#ffd66b", {size: 11, fill: "rgba(10,20,45,.7)"}); }
      P5x.hint(c, "Glisse pour faire tourner la vue 3D", {y: 14, color: "#cfdcf5"});
      P5x.hint(c, "1 s à l'écran = 30 min · point jaune : un lieu de l'équateur", {y: c.H - 10, color: "#9fb4da", size: 11});
      ro.set(0, S.fmt(g, 2) + " m/s²"); ro.set(1, S.fmt(v / 1000, 2) + " km/s (" + S.fmt(v * 3.6, 0) + " km/h)"); ro.set(2, S.fmt(T / 3600, 2) + " h (" + S.fmt(T / 60, 0) + " min)"); ro.set(3, S.fmt(100 * g / 9.82, 0) + " %");
      var geo = Math.abs(T - Tsid) < 120;
      if (geo) P5x.banner(c, "Orbite géostationnaire : le satellite suit le point jaune", "#7be0ae", 40, {fill: "rgba(10,20,45,.8)"});
      nt.set(geo ? "Orbite géostationnaire : T ≈ 24 h (un jour sidéral), le satellite reste au-dessus du même point de l'équateur." : "Le satellite tombe en permanence vers la Terre avec a = g = " + S.fmt(g, 2) + " m/s², mais sa vitesse horizontale est assez grande pour que le sol se « dérobe » : il reste à la même altitude.", geo ? "ok" : "");
    });
  }
});


SFA.sim({
  id: "p5-c07-newton", ch: "c07", tag: "Niche utile",
  titre: "Le canon de Newton : de la chute à l'orbite et à l'évasion",
  resume: "Vitesse de tir depuis une montagne → impact, orbite, évasion.",
  but: "Tire horizontalement depuis une très haute montagne. Augmente la vitesse initiale : repère le moment où le projectile ne retombe plus (orbite) et celui où il s'échappe. Le bouton « Vitesse circulaire » règle la valeur exacte.",
  aRetenir: "À une vitesse horizontale donnée au-dessus d'une planète : v < v_c : le projectile retombe (ou orbite en ellipse s'il évite le sol) ; v = v_c = √(G·M/r) : orbite circulaire ; v_c < v < √2·v_c : ellipse ; v ≥ √2·v_c : évasion. Au niveau du sol terrestre, v_c ≈ 7,9 km/s et v_évasion ≈ 11,2 km/s.",
  piege: "Satelliser, ce n'est pas monter très haut : c'est surtout aller très vite horizontalement. Un projectile en orbite circulaire est en chute libre permanente, et il n'y a pas de limite « d'atmosphère » dans ce modèle (on néglige l'air).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8});
    var h0 = k.slider("Altitude de la montagne", 0, 1500, 50, 300, "km");
    var v0 = k.slider("Vitesse horizontale de tir", 1, 12, 0.01, 6, "km/s");
    k.button("Vitesse circulaire", function(){ v0.set(Math.round(Math.sqrt(GMT / (RT + h0.value * 1000)) / 10) / 100); });
    k.button("Vitesse d'évasion", function(){ v0.set(Math.min(12, Math.ceil(Math.sqrt(2 * GMT / (RT + h0.value * 1000)) / 10) / 100)); });
    k.button("Tirer à nouveau", function(){ ptr = 0; lp.play(); }, true);
    var ro = k.readouts(["Vitesse circulaire v_c", "Vitesse d'évasion", "Résultat", "Altitude min.", "Altitude max."]);
    var nt = k.note("", "");
    function orbit(r0, V){
      var mu = GMT, pts = [], x = r0, y = 0, vx = 0, vy = V, dt = 15, ang = 0, minr = r0, maxr = r0, impact = false, lastA = 0, swept = 0;
      function acc(px, py){ var r = Math.hypot(px, py), q = -mu / (r * r * r); return [q * px, q * py]; }
      for (var i = 0; i < 40000; i++){
        var a1 = acc(x, y), x2 = x + vx * dt / 2, y2 = y + vy * dt / 2, vx2 = vx + a1[0] * dt / 2, vy2 = vy + a1[1] * dt / 2, a2 = acc(x2, y2);
        var x3 = x + vx2 * dt / 2, y3 = y + vy2 * dt / 2, vx3 = vx + a2[0] * dt / 2, vy3 = vy + a2[1] * dt / 2, a3 = acc(x3, y3);
        var x4 = x + vx3 * dt, y4 = y + vy3 * dt, vx4 = vx + a3[0] * dt, vy4 = vy + a3[1] * dt, a4 = acc(x4, y4);
        x += dt / 6 * (vx + 2 * vx2 + 2 * vx3 + vx4); y += dt / 6 * (vy + 2 * vy2 + 2 * vy3 + vy4);
        vx += dt / 6 * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]); vy += dt / 6 * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
        var r = Math.hypot(x, y); minr = Math.min(minr, r); maxr = Math.max(maxr, r);
        if (i % 6 === 0) pts.push([x, y]);
        if (r <= RT){ impact = true; pts.push([x, y]); break; }
        var A = Math.atan2(y, x); var dA = A - lastA; if (dA < -Math.PI) dA += 2 * Math.PI; if (dA > Math.PI) dA -= 2 * Math.PI; swept += dA; lastA = A;
        if (r > 6 * r0 + 3e7) break;
        if (Math.abs(swept) > 2 * Math.PI * 1.02) break;
      }
      return {pts: pts, impact: impact, minr: minr, maxr: maxr};
    }
    var cache = null, ptr = 0, hd = {x: 0, y: 0, sx: 0, sy: 0, kx: 1};
    var lp = k.loop(function(dt){ if (cache){ ptr += dt * cache.pts.length / 4.5; if (ptr >= cache.pts.length + 20){ lp.pause(); } } k.redraw(); });
    /* manipulation directe : on tire la pointe de la flèche de vitesse au départ */
    P5x.drag(c, k, function(){ return [{x: hd.x, y: hd.y, r: 32, set: function(px){ v0.set(Math.round(P5.clamp((px - hd.sx - 10) / hd.kx, 1, 12) * 20) / 20); ptr = 0; lp.play(); }}]; });
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r0 = RT + h0.value * 1000, V = v0.value * 1000, vc = Math.sqrt(GMT / r0), ve = Math.SQRT2 * vc;
      var key = h0.value + "|" + v0.value;
      if (!cache || cache.key !== key){ cache = orbit(r0, V); cache.key = key; ptr = 0; if (!lp.running) lp.play(); }
      var o = cache; P5x.space(c);
      var q = V * V / (vc * vc), rpe = V < vc ? r0 * q / (2 - q) : r0, rap = V >= vc ? (q < 2 ? r0 * q / (2 - q) : Infinity) : r0;
      var impact = V < vc && rpe <= RT, minr = impact ? 0 : rpe, maxr = rap;
      var view = Math.max(r0 * 2.6, 1.6 * Math.min(maxr, r0 * 6)), cx = c.W / 2, cy = c.H / 2;
      var sc = Math.min((c.W / 2 - 14) / (view / 2), (c.H / 2 - 14) / (view / 2)), sy0 = cy - r0 * sc;
      P5x.planet(c, cx, cy, RT * sc, "#3d7fd1", "#7fc0ff");
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, RT * sc, 0, 7); ctx.clip(); ctx.fillStyle = "rgba(60,150,90,.55)"; ctx.beginPath(); ctx.ellipse(cx - RT * sc * 0.3, cy - RT * sc * 0.55, RT * sc * 0.35, RT * sc * 0.2, 0.5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + RT * sc * 0.45, cy + RT * sc * 0.2, RT * sc * 0.25, RT * sc * 0.35, -0.3, 0, 7); ctx.fill(); ctx.restore();
      /* orbite circulaire de référence */
      ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, r0 * sc, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      /* montagne (haute ici de h0, plus large en bas) */
      var mw = Math.max(8, RT * sc * 0.14), sb = Math.sqrt(Math.max(0, Math.pow(RT * sc, 2) - mw * mw));
      if (h0.value > 0){ ctx.fillStyle = P5x.lin(ctx, 0, sy0, 0, cy - sb, [[0, "#eef2f6"], [0.3, "#8d98a8"], [1, "#5b6676"]]); ctx.beginPath(); ctx.moveTo(cx - mw, cy - sb + 2); ctx.lineTo(cx, sy0); ctx.lineTo(cx + mw, cy - sb + 2); ctx.closePath(); ctx.fill(); }
      /* trajectoire animée */
      var n = Math.min(o.pts.length, Math.floor(ptr)), col = impact ? "#ff6b57" : "#7fd1ff";
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      for (var pass = 0; pass < 2; pass++){ ctx.strokeStyle = pass ? col : S.draw.tint(col, 0.25); ctx.lineWidth = pass ? 2.6 : 7; ctx.beginPath(); for (var i = 0; i < n; i++){ var p = o.pts[i], X = cx + p[1] * sc, Y = cy - p[0] * sc; if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke(); }
      if (n > 0 && n <= o.pts.length){ var pp = o.pts[Math.min(n, o.pts.length) - 1], bx = cx + pp[1] * sc, by = cy - pp[0] * sc; S.draw.glow(c, bx, by, 16, "#ffd66b", 0.8); S.draw.dot(c, bx, by, 4.5, "#ffe9a8"); }
      if (impact && n >= o.pts.length){ var ip = o.pts[o.pts.length - 1]; S.draw.glow(c, cx + ip[1] * sc, cy - ip[0] * sc, 22, "#ff7a45", 0.9); }
      /* canon et flèche de vitesse */
      S.draw.dot(c, cx, sy0, 5, "#ffb02e");
      var kx = 12, hx = cx + 10 + (V / 1000) * kx; if (hx > c.W - 14){ kx = (c.W - 24 - cx) / (V / 1000); hx = cx + 10 + (V / 1000) * kx; } hd.kx = kx; hd.sx = cx;
      P5.vec(c, cx + 6, sy0, hx, sy0, "#ffd66b", "", {w: 3}); hd.x = hx; hd.y = sy0; P5x.handle(c, hx, sy0, "#ffb02e", 6.5);
      P5x.tag(c, "v₀ = " + S.fmt(v0.value, 2) + " km/s", cx + 10, sy0 - 18, "#ffd66b", {align: "left", size: 11.5, fill: "rgba(10,20,45,.8)"});
      P5x.hint(c, "Tire la pointe jaune pour régler v₀", {y: 14, color: "#cfdcf5"});
      P5x.hint(c, "échelle : rayon de la Terre = " + S.fmt(RT / 1000, 0) + " km", {y: c.H - 10, color: "#9fb4da", size: 11});
      var res, kind;
      if (V >= ve - 1) { res = "évasion (trajectoire ouverte)"; kind = "ok"; }
      else if (impact) { res = "retombe au sol"; kind = "warn"; }
      else if (Math.abs(V - vc) < 0.012 * 1000) { res = "orbite quasi circulaire"; kind = "ok"; }
      else { res = "orbite elliptique"; kind = "ok"; }
      if (n >= o.pts.length - 1) P5x.banner(c, res.charAt(0).toUpperCase() + res.slice(1), kind === "warn" ? "#ff8a78" : "#7be0ae", c.H - 36, {fill: "rgba(10,20,45,.8)"});
      ro.set(0, S.fmt(vc / 1000, 2) + " km/s"); ro.set(1, S.fmt(ve / 1000, 2) + " km/s"); ro.set(2, res);
      ro.set(3, impact ? "0 (impact)" : S.fmt((minr - RT) / 1000, 0) + " km"); ro.set(4, V >= ve - 1 ? "∞" : S.fmt((maxr - RT) / 1000, 0) + " km");
      nt.set(V >= ve - 1 ? "v ≥ √2·v_c : l'énergie est suffisante pour échapper à l'attraction de la Terre (modèle sans air et sans autres astres)." : impact ? "La vitesse est inférieure à v_c : la trajectoire finit par couper le sol. Plus v est grande, plus l'impact est loin." : V < vc ? "v est inférieure à v_c, mais le point le plus bas de l'ellipse reste au-dessus du sol : le projectile tourne autour de la Terre (le point de tir est l'apogée)." : "v est comprise entre v_c et √2·v_c (ou égale à v_c) : le projectile ne touche plus le sol, il tourne autour de la Terre.", kind);
    });
  }
});


SFA.sim({
  id: "p5-c07-kepler", ch: "c07", tag: "Kepler",
  titre: "Lois de Kepler : ellipse, aires égales et T² = a³",
  resume: "Excentricité, distance moyenne, masse de l'étoile → trajectoire et période.",
  but: "Règle le demi-grand axe a, l'excentricité e et la masse de l'étoile. Observe que la planète va plus vite près de l'étoile (secteurs d'aires égales). Cherche comment T dépend de a.",
  aRetenir: "1) Orbite elliptique dont l'étoile occupe un foyer ; 2) aires balayées égales en durées égales (plus rapide près de l'étoile) ; 3) T²/a³ est constant pour un même astre central : T² = a³/M (T en années, a en UA, M en masses solaires).",
  piege: "Ce n'est pas la distance qui fixe la période seule : elle dépend de a (demi-grand axe) et de la masse centrale, pas de l'excentricité. Et l'étoile est au foyer, pas au centre de l'ellipse.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.7});
    var a = k.slider("Demi-grand axe a", 0.4, 5, 0.1, 1, "UA");
    var e = k.slider("Excentricité e", 0, 0.8, 0.01, 0.5, "");
    var M = k.slider("Masse de l'étoile", 0.5, 2, 0.1, 1, "M☉");
    var sp = k.seg("Vitesse du temps", [[0.25, "0,25 an/s"], [0.1, "0,1 an/s"]], 0.25);
    var secs = k.toggle("Montrer des secteurs d'aires égales (durées égales)", true);
    var ro = k.readouts(["Période T", "T²/a³ (an²/UA³)", "Distance mini", "Distance maxi", "Vitesse au périhélie", "Vitesse à l'aphélie"]);
    var nt = k.note("", ""), t = 0;
    var lp = k.loop(function(dt){ t += dt * sp.value; k.redraw(); }); lp.play();
    function kep(Mm, ee){ var E = Mm; for (var i = 0; i < 30; i++){ E = E - (E - ee * Math.sin(E) - Mm) / (1 - ee * Math.cos(E)); } return E; }
    function pos(aa, ee, E){ return [aa * (Math.cos(E) - ee), aa * Math.sqrt(1 - ee * ee) * Math.sin(E)]; }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, A = a.value, ee = e.value, T = Math.sqrt(A * A * A / M.value); c.clear();
      var rmax = A * (1 + ee), rmin = A * (1 - ee), bb = A * Math.sqrt(1 - ee * ee), xr0 = -rmax, xr1 = A * (1 + ee) , yr = Math.max(bb, 0.3);
      var wU = (A * (1 + ee)) + A * (1 + ee) * 0 + A;      /* largeur utile : de −A(1+e) à +A(1−e)… on centre */
      var xmin = -A * (1 + ee), xmax = A * (1 - ee) * 1 + 0, span = Math.max(A * 2 + 0.01, 1), u = Math.min((c.W - 40) / (2 * A + 2 * A * ee * 0 + 0.001) , (c.H - 40) / (2 * bb + 0.001));
      /* Étoile à l'origine du repère (foyer) ; périhélie à droite : x de −A(1+e)… A(1−e)  (ellipse centre à (−A·e, 0)) */
      var ox = c.W / 2 + A * ee * u, oy = c.H / 2;
      function X(x){ return ox + x * u; } function Y(y){ return oy - y * u; }
      ctx.strokeStyle = "#aab4c3"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (var i = 0; i <= 200; i++){ var E = i / 200 * 2 * Math.PI, p = pos(A, ee, E); if (i === 0) ctx.moveTo(X(p[0]), Y(p[1])); else ctx.lineTo(X(p[0]), Y(p[1])); }
      ctx.stroke();
      if (secs.value){
        var n = 12, tm = (t % T) / T * n, cur = Math.floor(tm);
        for (var s = 0; s < n; s++){
          var E0 = kep(2 * Math.PI * s / n, ee), E1 = kep(2 * Math.PI * (s + 1) / n, ee);
          ctx.beginPath(); ctx.moveTo(X(0), Y(0));
          for (var j = 0; j <= 12; j++){ var EE = E0 + (E1 - E0) * j / 12, p2 = pos(A, ee, EE); ctx.lineTo(X(p2[0]), Y(p2[1])); }
          ctx.closePath(); ctx.fillStyle = s === cur ? "rgba(180,83,9,.45)" : (s % 2 ? "rgba(30,63,143,.12)" : "rgba(30,63,143,.26)"); ctx.fill();
        }
      }
      var Ec = kep(2 * Math.PI * ((t % T) / T), ee), pp = pos(A, ee, Ec);
      S.draw.dot(c, X(0), Y(0), 10, pal.yellow); ctx.strokeStyle = pal.amber; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(0), Y(0), 10, 0, 2 * Math.PI); ctx.stroke();
      S.draw.dot(c, X(pp[0]), Y(pp[1]), 7, pal.acc);
      var rnow = A * (1 - ee * Math.cos(Ec)), vnow = 29.78 * Math.sqrt(M.value * (2 / rnow - 1 / A));
      S.draw.text(c, "étoile au foyer", X(0), Y(0) + 22, {size: 12, color: pal.amber});
      S.draw.text(c, "r = " + S.fmt(rnow, 2) + " UA ; v = " + S.fmt(vnow, 1) + " km/s", 10, 16, {align: "left", size: 12, color: pal.ink});
      var vp = 29.78 * Math.sqrt(M.value * (2 / rmin - 1 / A)), va = 29.78 * Math.sqrt(M.value * (2 / rmax - 1 / A));
      ro.set(0, S.fmt(T, 2) + " ans"); ro.set(1, S.fmt(T * T / (A * A * A), 2) + " = 1/M"); ro.set(2, S.fmt(rmin, 2) + " UA"); ro.set(3, S.fmt(rmax, 2) + " UA");
      ro.set(4, S.fmt(vp, 1) + " km/s"); ro.set(5, S.fmt(va, 1) + " km/s");
      nt.set("T² = a³/M : T = " + S.fmt(T, 2) + " ans. Les 12 secteurs ont la même aire : plus la planète est proche de l'étoile, plus elle est rapide (" + S.fmt(vp / va, 1) + " fois plus au périhélie qu'à l'aphélie). Avec M = 1 et a = 1, on retrouve la Terre : 1 an, 29,8 km/s.", "");
    });
  }
});
})();
