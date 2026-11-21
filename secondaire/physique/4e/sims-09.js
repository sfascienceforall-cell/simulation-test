/* Physique 4e · chapitre 9 · Réfraction, réflexion totale et dispersion */
(function(){
var D2R = Math.PI / 180, R2D = 180 / Math.PI;
var MED = [["air","Air (n = 1,00)",1.00],["eau","Eau (n = 1,33)",1.33],["verre","Verre (n = 1,50)",1.50],["diam","Diamant (n = 2,42)",2.42]];
function nOf(k){ return MED.filter(function(m){ return m[0] === k; })[0][2]; }
/* fibre (modèle 2D agrandi) : axe = segment droit, arc de cercle (rayon Rb, angle phi, vers le haut), segment droit.
   Tracé du rayon pas à pas ; à chaque contact avec la gaine : réflexion totale si i ≥ angle limite, sinon fuite
   (rayon réfracté dans la gaine) et réflexion partielle (Fresnel, lumière non polarisée). */
function fibreGeom(x0, y0, L1, Rb, phi, L2){
  var g = {x0:x0, y0:y0, L1:L1, Rb:Rb, phi:phi, L2:L2, bend:Rb > 0 && phi > 0};
  g.Cx = x0 + L1; g.Cy = y0 - Rb;
  if (g.bend){ g.Ex = g.Cx + Rb * Math.sin(phi); g.Ey = g.Cy + Rb * Math.cos(phi); g.dx = Math.cos(phi); g.dy = -Math.sin(phi); }
  else { g.Ex = x0 + L1; g.Ey = y0; g.dx = 1; g.dy = 0; }
  g.len = L1 + (g.bend ? Rb * phi : 0) + L2;
  return g;
}
/* point de l'axe le plus proche : renvoie [distance, cx, cy, s (abscisse le long de l'axe)] */
function fibreNear(g, px, py){
  var best = null;
  function cand(d, cx, cy, s){ if (!best || d < best[0]) best = [d, cx, cy, s]; }
  var t = Math.max(-1e9, Math.min(g.L1, px - g.x0)); cand(Math.hypot(px - g.x0 - t, py - g.y0), g.x0 + t, g.y0, t);
  if (g.bend){ var vx = px - g.Cx, vy = py - g.Cy, th = Math.atan2(vx, vy), r = Math.hypot(vx, vy);
    if (th >= 0 && th <= g.phi && r > 1e-9) cand(Math.abs(r - g.Rb), g.Cx + g.Rb * vx / r, g.Cy + g.Rb * vy / r, g.L1 + g.Rb * th); }
  var u = Math.max(0, (px - g.Ex) * g.dx + (py - g.Ey) * g.dy); cand(Math.hypot(px - g.Ex - u * g.dx, py - g.Ey - u * g.dy), g.Ex + u * g.dx, g.Ey + u * g.dy, g.L1 + (g.bend ? g.Rb * g.phi : 0) + u);
  return best;
}
function fibreTrace(g, w, n1, n2, r1){
  var thc = Math.asin(n2 / n1), x = g.x0, y = g.y0, dx = Math.cos(r1), dy = -Math.sin(r1), I = 1, st = 0.5;
  var segs = [], leaks = [], hits = [], sx = x, sy = y, minI = 90, exited = false;
  for (var it = 0; it < 20000 && I > 0.004; it++){
    var nx = x + dx * st, ny = y + dy * st, nb = fibreNear(g, nx, ny);
    if (nb[3] >= g.len){ segs.push([sx, sy, nx, ny, I]); exited = true; break; }
    if (nb[0] >= w){
      var ax = x, ay = y, bx2 = nx, by2 = ny;
      for (var k = 0; k < 24; k++){ var mx = (ax + bx2) / 2, my = (ay + by2) / 2; if (fibreNear(g, mx, my)[0] < w){ ax = mx; ay = my; } else { bx2 = mx; by2 = my; } }
      var hb = fibreNear(g, ax, ay), ox = ax - hb[1], oy = ay - hb[2], on = Math.hypot(ox, oy) || 1; ox /= on; oy /= on;
      var ci = dx * ox + dy * oy, inc = Math.acos(Math.max(-1, Math.min(1, ci))) * 180 / Math.PI;
      segs.push([sx, sy, ax, ay, I]); hits.push([ax, ay, inc]); minI = Math.min(minI, inc);
      if (inc < thc * 180 / Math.PI - 1e-9){
        var si = Math.sqrt(1 - ci * ci), stt = n1 / n2 * si, ct = Math.sqrt(1 - stt * stt), tx = n1 / n2 * (dx - ci * ox) + ct * ox, ty = n1 / n2 * (dy - ci * oy) + ct * oy;
        var rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct), rp = (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct), R = (rs * rs + rp * rp) / 2;
        leaks.push([ax, ay, tx, ty, I * (1 - R)]); I *= R;
      }
      dx -= 2 * ci * ox; dy -= 2 * ci * oy; x = ax - ox * 0.05; y = ay - oy * 0.05; sx = x; sy = y; continue;
    }
    if (nb[3] < -1){ segs.push([sx, sy, nx, ny, I]); break; }
    x = nx; y = ny;
  }
  return {segs:segs, leaks:leaks, hits:hits, minI:minI, out:exited ? I : 0, exited:exited, thc:thc * 180 / Math.PI};
}

SFA.sim({
  id:"p4-c09-snell", ch:"c09", tag:"Classique",
  titre:"Réfraction à la surface de deux milieux",
  resume:"Un rayon qui passe de l'air à l'eau, du verre à l'air… : angle, loi de Snell-Descartes et réflexion totale.",
  but:"Glisse le laser (poignée jaune) pour changer l'angle. Choisis les deux milieux et l'angle d'incidence. Regarde le rayon réfracté, le rayon réfléchi, le rapporteur et le graphique de r en fonction de i.",
  aRetenir:"Loi de Snell-Descartes : n₁·sin i = n₂·sin r (angles mesurés par rapport à la NORMALE). Vers un milieu plus réfringent (n plus grand), le rayon se rapproche de la normale ; vers un milieu moins réfringent, il s'en éloigne. Si n₁·sin i > n₂, il n'y a plus de rayon réfracté : réflexion totale.",
  piege:"Le rayon ne se rapproche pas toujours de la normale : cela dépend du sens (n₁ < n₂ ou n₁ > n₂). Et l'angle limite n'existe que dans le sens milieu plus réfringent → moins réfringent (eau → air, verre → air).",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.7, 0.95), g1 = PX.canvas(k, 0.45, 0.62), Gs = {}, st = {s:0, hint:true};
    var m1 = k.select("Milieu du haut (n₁)", MED.map(function(m){ return [m[0], m[1]]; }), "air");
    var m2 = k.select("Milieu du bas (n₂)", MED.map(function(m){ return [m[0], m[1]]; }), "eau");
    k.button("⇅ Échanger les milieux", function(){ var a = m1.value; m1.set(m2.value); m2.set(a); });
    var ang = k.slider("Angle d'incidence i", 0, 89, 1, 40, "°", function(){ st.hint = false; });
    var ro = k.readouts(["Angle de réfraction r", "Angle limite", "n₁·sin i", "n₂·sin r"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.s = (st.s + dt * 0.9) % 1; k.redraw(); }); lp.play();
    var TINT = {air:[236,244,252], eau:[150,198,238], verre:[168,214,210], diam:[200,176,238]};
    PX.drag(k, c, function(){ return [{x:Gs.x, y:Gs.y, r:14, set:function(px, py){ st.hint = false; ang.set(Math.max(0, Math.min(89, Math.round(Math.atan2(-(px - Gs.cx), -(py - Gs.cy)) * R2D)))); }}]; });
    function pulses(c, x1, y1, x2, y2, col, n){
      for (var j = 0; j < n; j++){ var f = (st.s + j / n) % 1; S.draw.glow(c, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 11, col, 0.95); }
    }
    k.draw(function(){
      var n1 = nOf(m1.value), n2 = nOf(m2.value), I = ang.value * D2R, s = n1 * Math.sin(I) / n2, tir = s > 1, ctx = c.ctx, ph = PX.phone(c);
      var cx = c.W / 2, cy = c.H / 2, L = Math.min(c.W * 0.42, c.H * 0.44), t1 = TINT[m1.value], t2 = TINT[m2.value];
      c.clear();
      ctx.fillStyle = PX.lin(c, 0, 0, 0, cy, [[0, "rgba(" + t1 + ",.55)"], [1, "rgba(" + t1 + ",.9)"]]); ctx.fillRect(0, 0, c.W, cy);
      ctx.fillStyle = PX.lin(c, 0, cy, 0, c.H, [[0, "rgba(" + t2 + ",1)"], [1, "rgba(" + t2.map(function(v){ return Math.round(v * 0.82); }) + ",1)"]]); ctx.fillRect(0, cy, c.W, c.H - cy);
      if (m2.value === "eau"){ ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.4; for (var w = 0; w < 4; w++){ ctx.beginPath(); for (var xx = 0; xx <= c.W; xx += 6) ctx[xx ? "lineTo" : "moveTo"](xx, cy + 8 + w * 22 + 2.5 * Math.sin(xx / 17 + w * 2 + st.s * 6.28)); ctx.stroke(); } }
      S.draw.line(c, 0, cy, c.W, cy, "#13233a", 3);
      /* normale + rapporteur */
      S.draw.line(c, cx, cy - L - 14, cx, cy + L + 14, "#5f6b7a", 1.4, [5, 4]);
      var Rp = L * 0.55; ctx.save(); ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.fillStyle = "rgba(15,27,45,.55)"; ctx.lineWidth = 1; ctx.font = "700 9.5px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.beginPath(); ctx.arc(cx, cy, Rp, -Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, Rp, 0, Math.PI); ctx.stroke();
      for (var d = -90; d <= 90; d += 10){ var ur = d * D2R, big = d % 30 === 0; [-1, 1].forEach(function(sv){ var x1 = cx + Math.sin(ur) * Rp, y1 = cy - sv * Math.cos(ur) * Rp, x2 = cx + Math.sin(ur) * (Rp + (big ? 9 : 5)), y2 = cy - sv * Math.cos(ur) * (Rp + (big ? 9 : 5)); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); if (big && d !== -90 && d !== 90 && !ph) ctx.fillText(String(Math.abs(d)), cx + Math.sin(ur) * (Rp + 19), cy - sv * Math.cos(ur) * (Rp + 19)); }); }
      ctx.restore();
      var theta_c = n1 > n2 ? Math.asin(n2 / n1) * R2D : null;
      if (theta_c){ [-1, 1].forEach(function(sg){ var ur = theta_c * D2R; S.draw.line(c, cx + sg * Math.sin(ur) * (Rp - 6), cy - Math.cos(ur) * (Rp - 6), cx + sg * Math.sin(ur) * (Rp + 14), cy - Math.cos(ur) * (Rp + 14), P.red, 2.5); }); S.draw.label(c, "θc = " + S.fmt(theta_c, 1) + "°", cx + Math.sin(theta_c * D2R) * (Rp + 36), cy - Math.cos(theta_c * D2R) * (Rp + 30), {color:P.red, size:10.5}); }
      /* rayon incident */
      var ix = cx - L * Math.sin(I), iy = cy - L * Math.cos(I); Gs.x = ix; Gs.y = iy; Gs.cx = cx; Gs.cy = cy;
      ctx.save(); ctx.translate(ix, iy); ctx.rotate(-I); ctx.fillStyle = "#2c3a4e"; PX.rr(ctx, -9, -26, 18, 26, 4); ctx.fill(); ctx.fillStyle = P.red; ctx.fillRect(-3, -2, 6, 4); ctx.restore();
      S.draw.line(c, ix, iy, cx, cy, "rgba(255,170,40,.35)", 7); S.draw.line(c, ix, iy, cx, cy, P.amber, 2.6); pulses(c, ix, iy, cx, cy, "#ffd24a", 3);
      /* réfléchi */
      var rx = cx + L * Math.sin(I), ry = cy - L * Math.cos(I);
      S.draw.line(c, cx, cy, rx, ry, tir ? "rgba(192,50,29,.3)" : "rgba(192,50,29,.12)", tir ? 7 : 4); S.draw.line(c, cx, cy, rx, ry, tir ? P.red : "rgba(192,50,29,.5)", tir ? 2.6 : 1.4); if (tir) pulses(c, cx, cy, rx, ry, "#ff8a70", 3);
      var R;
      if (!tir){ R = Math.asin(s); var ex = cx + L * Math.sin(R), ey = cy + L * Math.cos(R);
        S.draw.line(c, cx, cy, ex, ey, "rgba(36,119,90,.3)", 7); S.draw.line(c, cx, cy, ex, ey, P.green, 2.6); pulses(c, cx, cy, ex, ey, "#7dffc0", 3);
        S.draw.line(c, cx, cy, cx + L * 0.85 * Math.sin(I), cy + L * 0.85 * Math.cos(I), "rgba(15,27,45,.3)", 1.2, [3, 4]);
        arcAng(c, cx, cy, Rp * 0.7, Math.PI / 2 + R, Math.PI / 2, P.green, "r = " + S.fmt(R * R2D, 0) + "°"); }
      arcAng(c, cx, cy, Rp * 0.7, -Math.PI / 2 - I, -Math.PI / 2, P.amber, "i = " + S.fmt(ang.value, 0) + "°");
      PX.grip(c, ix, iy - 0, P.amber, st.hint ? "tourne le laser" : null, 7);
      S.draw.label(c, "n₁ = " + S.fmt(n1, 2), 8, 14, {color:"#2c3a4e", align:"left", size:PX.fs(c, 12)}); S.draw.label(c, "n₂ = " + S.fmt(n2, 2), 8, c.H - 14, {color:"#2c3a4e", align:"left", size:PX.fs(c, 12)});
      if (tir) S.draw.label(c, "réflexion totale", c.W - 10, 14, {color:P.red, align:"right", size:12.5});
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:90, y0:0, y1:90, xl:"i (°)", yl:"r (°)", stepX:10, stepY:10});
      S.draw.line(g1, ax.X(0), ax.Y(0), ax.X(90), ax.Y(90), "#b8c0cc", 1.5, [5, 4]);
      if (theta_c){ g1.ctx.fillStyle = "rgba(180,35,24,.10)"; g1.ctx.fillRect(ax.X(theta_c), ax.T, ax.X(90) - ax.X(theta_c), ax.B - ax.T); P4.label(g1, "réflexion totale", ax.X((theta_c + 90) / 2), ax.Y(45), P.red); S.draw.line(g1, ax.X(theta_c), ax.B, ax.X(theta_c), ax.T, P.red, 1.5, [4, 3]); }
      S.draw.fn(g1, ax, function(x){ var q = n1 * Math.sin(x * D2R) / n2; return q > 1 ? NaN : Math.asin(q) * R2D; }, P.green, 3);
      if (!tir) S.draw.dot(g1, ax.X(ang.value), ax.Y(R * R2D), 6, P.red);
      ro.set(0, tir ? "aucun" : S.fmt(R * R2D, 1) + " °"); ro.set(1, theta_c ? S.fmt(theta_c, 1) + " °" : "n'existe pas"); ro.set(2, S.fmt(n1 * Math.sin(I), 3)); ro.set(3, tir ? "—" : S.fmt(n2 * Math.sin(R), 3));
      nt.set(tir ? "Réflexion totale : n₁·sin i = " + S.fmt(n1 * Math.sin(I), 2) + " dépasse n₂ = " + S.fmt(n2, 2) + ". Toute la lumière est réfléchie, selon la loi r = i." : n1 === n2 ? "Mêmes milieux : pas de déviation (r = i)." : n2 > n1 ? "Milieu 2 plus réfringent : le rayon se rapproche de la normale (r < i)." : "Milieu 2 moins réfringent : le rayon s'éloigne de la normale (r > i). Au-delà de l'angle limite, plus de rayon réfracté.", tir ? "warn" : "");
    });
    function arcAng(c, cx, cy, R, a1, a2, col, lab){
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, cy, R, Math.min(a1, a2), Math.max(a1, a2)); ctx.stroke(); ctx.restore();
      var am = (a1 + a2) / 2; S.draw.label(c, lab, cx + (R + 24) * Math.cos(am), cy + (R + 24) * Math.sin(am), {color:col, size:PX.fs(c, 11)});
    }
  }
});

SFA.sim({
  id:"p4-c09-fenetre-snell", ch:"c09", tag:"Réflexion totale",
  titre:"La fenêtre de Snell : voir le ciel depuis l'eau",
  resume:"Une lampe au fond d'une piscine : seule une zone de la surface la laisse sortir.",
  but:"Glisse la source vers le haut ou le bas pour changer sa profondeur. Choisis la profondeur de la source et le milieu. Les rayons qui frappent la surface avec un angle supérieur à l'angle limite sont totalement réfléchis.",
  aRetenir:"Une source placée sous la surface n'éclaire l'air que dans un disque de rayon R = h·tan θ<sub>c</sub>, avec sin θ<sub>c</sub> = n<sub>air</sub>/n. Pour l'eau, θ<sub>c</sub> ≈ 48,8° : un plongeur voit TOUT le ciel dans un cône d'environ 97° d'ouverture. Hors de ce cercle, la surface se comporte comme un miroir.",
  piege:"Plus la source est profonde, plus le disque est grand, mais l'angle limite ne change pas : il ne dépend que des milieux (eau → air : 48,8° ; verre → air : 41,8° ; diamant → air : 24,4°).",
  build:function(k,S){
    var c = PX.canvas(k, 0.7, 0.95), Gf = {};
    var md = k.seg("Milieu sous la surface", [["eau","Eau (1,33)"],["verre","Verre (1,50)"],["diam","Diamant (2,42)"]], "eau");
    var h = k.slider("Profondeur de la source", 0.5, 3, 0.1, 2, "m");
    var ro = k.readouts(["Angle limite θ<sub>c</sub>", "Rayon du disque lumineux", "Ouverture du cône vu d'en dessous"]);
    var nt = k.note("", "");
    PX.drag(k, c, function(){ return [{x:Gf.x, y:Gf.y, r:14, set:function(px, py){ h.set(Math.max(0.5, Math.min(3, Math.round((py - Gf.ys) / Gf.sc * 10) / 10))); }}]; });
    k.draw(function(){
      var P = SFA.draw.palette, n = nOf(md.value), H = h.value, tc = Math.asin(1 / n), ctx = c.ctx;
      var sc = (c.W - 30) / 8, cx = c.W / 2, ys = 54, Y = function(d){ return ys + d * sc; };
      c.clear(); PX.bg(c, "#bfe0fa", "#eaf5ff"); ctx.fillStyle = PX.lin(c, 0, ys, 0, c.H, [[0, md.value === "eau" ? "#5fa8e0" : md.value === "verre" ? "#8fc7c2" : "#b49be0"], [1, md.value === "eau" ? "#1c4f8f" : md.value === "verre" ? "#3f7f7c" : "#5a3e9a"]]); ctx.fillRect(0, ys, c.W, c.H - ys);
      if (md.value === "eau"){ ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1.5; ctx.beginPath(); for (var wx = 0; wx <= c.W; wx += 5) ctx[wx ? "lineTo" : "moveTo"](wx, ys + 3 + 2 * Math.sin(wx / 14)); ctx.stroke(); }
      S.draw.line(c, 0, ys, c.W, ys, "rgba(15,27,45,.7)", 2);
      P4.label(c, "air", 24, ys - 12, "#5f6b7a"); P4.label(c, md.value === "eau" ? "eau" : md.value === "verre" ? "verre" : "diamant", 30, ys + 18, "#5f6b7a");
      var R = H * Math.tan(tc);
      S.draw.glow(c, cx, ys, Math.max(30, R * sc * 1.2), P.yellow, 0.5); S.draw.line(c, cx - R * sc, ys, cx + R * sc, ys, P.yellow, 8);
      for (var j = -8; j <= 8; j++){
        var i = j * 10 * D2R, a = Math.abs(i), sx = Math.sin(i), cxs = cx + H * Math.tan(i) * sc; if (Math.abs(i) > 85 * D2R) continue;
        var hit = [cxs, ys + 0], src = [cx, Y(H)];
        if (hit[0] < 4 || hit[0] > c.W - 4) continue;
        var s2 = n * Math.sin(a);
        if (s2 <= 1){ S.draw.line(c, src[0], src[1], hit[0], hit[1], "#ffe9a8", 1.8); var r = Math.asin(s2), dx = Math.sign(i) * Math.sin(r), dy = -Math.cos(r); S.draw.line(c, hit[0], hit[1], hit[0] + dx * 60, hit[1] + dy * 60, P.green, 1.8); }
        else { S.draw.line(c, src[0], src[1], hit[0], hit[1], P.red, 1.6); var xr = hit[0] + (hit[0] - src[0]), yr = src[1]; S.draw.line(c, hit[0], hit[1], xr, yr, P.red, 1.6); }
      }
      Gf.x = cx; Gf.y = Y(H); Gf.ys = ys; Gf.sc = sc; PX.grip(c, cx, Y(H), P.amber, null, 8); S.draw.glow(c, cx, Y(H), 26, P.yellow, 0.6); P4.label(c, "source", cx + 36, Y(H) + 4, "#2c3a4e");
      P4.label(c, "disque lumineux : R = " + S.fmt(R, 2) + " m", cx, 14, "#b45309");
      ro.set(0, S.fmt(tc * R2D, 1) + " °"); ro.set(1, S.fmt(R, 2) + " m (diamètre " + S.fmt(2 * R, 2) + " m)"); ro.set(2, S.fmt(2 * tc * R2D, 1) + " °");
      nt.set("En vert : rayons qui sortent (i < θ<sub>c</sub>). En rouge : réflexion totale (i > θ<sub>c</sub>). Rayon du disque : " + S.fmt(H, 1) + " × tan " + S.fmt(tc * R2D, 1) + "° = " + S.fmt(R, 2) + " m.", "");
    });
  }
});

SFA.sim({
  id:"p4-c09-fibre", ch:"c09", tag:"Technologie",
  titre:"Fibre optique : piéger la lumière",
  resume:"La lumière avance en rebondissant par réflexion totale ; trop inclinée, elle s'échappe.",
  but:"Règle l'indice de la gaine (le cœur a n = 1,50), la forme de la fibre et l'angle d'entrée du rayon (tourne le laser à la souris ou au doigt). Observe s'il reste guidé ou s'échappe : le cône vert montre les angles acceptés (fibre droite).",
  aRetenir:"Dans une fibre, le cœur (n₁) est entouré d'une gaine (n₂ < n₁). Si l'angle d'incidence sur la paroi dépasse l'angle limite, il y a réflexion totale : le rayon est guidé, même si la fibre est courbée. Angle d'acceptation : sin α<sub>max</sub> = √(n₁² − n₂²).",
  piege:"Plus l'indice de la gaine est proche de celui du cœur, plus l'angle d'acceptation est petit : la fibre « accepte » moins de lumière. Il faut aussi une gaine : sans elle, une fibre sale ou en contact avec un objet perdrait la lumière.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.8, 0.82), st = {s:0, hint:true, sweep:false, ts:0}, geo = {}, cache = {};
    var n2s = k.slider("Indice de la gaine n₂", 1.30, 1.49, 0.01, 1.32, "");
    var al = k.slider("Angle du rayon à l'entrée α", 0, 60, 1, 15, "°", function(){ st.hint = false; st.sweep = false; });
    var fo = k.seg("Forme de la fibre", [["0", "Droite"], ["22", "Virage large"], ["7", "Virage serré"]], "22");
    k.button("▶ Balayer l'angle α", function(){ st.sweep = !st.sweep; st.ts = Math.acos(Math.max(-1, Math.min(1, 1 - al.value / 30))) / 0.7; }, true);
    var ro = k.readouts(["Angle d'acceptation α<sub>max</sub>", "Angle limite cœur/gaine", "Incidence sur la paroi (la plus faible)", "État du rayon"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.s += dt * 240; if (st.sweep){ st.ts += dt; al.set(Math.round(30 - 30 * Math.cos(st.ts * 0.7))); } k.redraw(); }); lp.play();
    PX.drag(k, c, function(){ return [{x:geo.hx, y:geo.hy, r:16, set:function(px, py){ st.hint = false; st.sweep = false; var a = Math.atan2(py - geo.cy, Math.max(2, geo.x0 - px)) * R2D; al.set(Math.max(0, Math.min(60, Math.round(a)))); }}]; });
    function path(ctx, g){ ctx.beginPath(); ctx.moveTo(g.x0 - 2, g.y0); ctx.lineTo(g.x0 + g.L1, g.y0); if (g.bend) ctx.arc(g.Cx, g.Cy, g.Rb, Math.PI / 2, Math.PI / 2 - g.phi, true); ctx.lineTo(g.Ex + g.dx * g.L2, g.Ey + g.dy * g.L2); }
    k.draw(function(){
      var n1 = 1.5, n2 = n2s.value, A = al.value * D2R, ctx = c.ctx, ph = PX.phone(c), W = c.W, H = c.H, kap = +fo.value, phi = 60 * D2R, i, j;
      var NA = Math.sqrt(n1 * n1 - n2 * n2), amax = NA >= 1 ? 90 : Math.asin(NA) * R2D, r1 = Math.asin(Math.sin(A) / n1), thc = Math.asin(n2 / n1);
      /* géométrie (en unités de w : demi-largeur du cœur) */
      var x0 = ph ? 104 : 150, y0 = kap ? H * 0.8 : H * 0.55;
      var w = Math.max(6, Math.min(16, (W - x0 - 70) / (10 + 22 * Math.sin(phi) + 3), (H * 0.8 - 50) / (22 * (1 - Math.cos(phi)) + 6 * Math.sin(phi))));
      var g;
      if (!kap){ w = Math.min(w * 1.5, H * 0.07); g = fibreGeom(x0, y0, W - x0 - 64, 0, 0, 0); }
      else { g = fibreGeom(x0, y0, 10 * w, kap * w, phi, 0); g.L2 = Math.max(20, Math.min((W - 84 - g.Ex) / g.dx, (g.Ey - 66) / -g.dy)); g = fibreGeom(x0, y0, 10 * w, kap * w, phi, g.L2); }
      var key = [W, H, n2, al.value, kap].join("|"), tr = cache.k === key ? cache.v : (cache.k = key, cache.v = fibreTrace(g, w, n1, n2, r1));
      var guided = tr.leaks.length === 0, col = "#ffcf3a";
      geo.x0 = x0; geo.cy = y0;
      c.clear();
      /* table optique (breadboard) */
      PX.bg(c, "#2f3642", "#1c2129");
      ctx.fillStyle = "rgba(0,0,0,.45)"; for (var hx = 14; hx < W; hx += 26) for (var hy = 14; hy < H; hy += 26){ ctx.beginPath(); ctx.arc(hx, hy, 3, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,.06)"; for (hx = 14; hx < W; hx += 26) for (hy = 15.5; hy < H; hy += 26){ ctx.beginPath(); ctx.arc(hx, hy, 3, 0.2, Math.PI - 0.2); ctx.fill(); }
      /* fibre : gaine de protection, gaine optique, cœur (vue en coupe) */
      ctx.save(); ctx.lineCap = "butt"; ctx.lineJoin = "round";
      path(ctx, g); ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 2 * w * 2.0 + 8; ctx.stroke();
      path(ctx, g); ctx.strokeStyle = "#e0761c"; ctx.lineWidth = 2 * w * 2.0; ctx.stroke();
      path(ctx, g); ctx.strokeStyle = "#f59a3c"; ctx.lineWidth = 2 * w * 1.75; ctx.stroke();
      path(ctx, g); ctx.strokeStyle = "#9fb4cc"; ctx.lineWidth = 2 * w * 1.5; ctx.stroke();
      path(ctx, g); ctx.strokeStyle = "#b9cbe0"; ctx.lineWidth = 2 * w * 1.25; ctx.stroke();
      path(ctx, g); ctx.strokeStyle = "#e9f3ff"; ctx.lineWidth = 2 * w; ctx.stroke();
      path(ctx, g); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.stroke();
      ctx.restore();
      /* connecteur d'entrée */
      ctx.fillStyle = PX.lin(c, 0, y0 - w * 2.3, 0, y0 + w * 2.3, [[0, "#d7dde6"], [0.5, "#8e99a8"], [1, "#596372"]]); PX.rr(ctx, x0 - 8, y0 - w * 2.3, 14, w * 4.6, 3); ctx.fill();
      ctx.fillStyle = "#e9f3ff"; ctx.fillRect(x0 - 2, y0 - w, 3, 2 * w);
      if (!ph || W > 380){ S.draw.label(c, "cœur n₁ = 1,50", x0 + Math.min(g.L1, 10 * w) * 0.55 + 14, y0 + w * 2 + 16, {color:"#2c3a4e", fill:"rgba(255,255,255,.9)", size:PX.fs(c, 11)}); S.draw.label(c, "gaine n₂ = " + S.fmt(n2, 2), x0 + Math.min(g.L1, 10 * w) * 0.55 + 14, y0 + w * 2 + 38, {color:"#2c3a4e", fill:"rgba(255,255,255,.9)", size:PX.fs(c, 11)}); }
      /* cône d'acceptation */
      var cone = ph ? 50 : 62, am = Math.min(amax, 80) * D2R;
      ctx.fillStyle = "rgba(60,200,140,.16)"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.arc(x0, y0, cone, Math.PI - am, Math.PI + am); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(60,200,140,.7)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 - cone * Math.cos(am), y0 - cone * Math.sin(am)); ctx.moveTo(x0, y0); ctx.lineTo(x0 - cone * Math.cos(am), y0 + cone * Math.sin(am)); ctx.stroke(); ctx.setLineDash([]);
      S.draw.label(c, "α max = " + S.fmt(amax, 1) + "°", x0 - cone * 0.55, Math.max(16, y0 - cone - 10), {color:P.green, fill:"rgba(255,255,255,.9)", size:10.5});
      /* rayon dans le cœur (intensité = opacité) */
      ctx.save(); ctx.lineCap = "round"; ctx.shadowColor = col; ctx.shadowBlur = 10;
      tr.segs.forEach(function(sg){ ctx.globalAlpha = Math.max(0.12, Math.min(1, 0.25 + sg[4])); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(sg[0], sg[1]); ctx.lineTo(sg[2], sg[3]); ctx.stroke(); });
      ctx.restore();
      /* fuites : la fibre s'illumine là où la lumière s'échappe */
      tr.leaks.forEach(function(L){ var a2 = Math.max(0.35, Math.min(1, L[4] * 1.4)); S.draw.glow(c, L[0] + L[2] * w * 1.4, L[1] + L[3] * w * 1.4, 26, "#ff5a3c", 0.7 * a2);
        ctx.save(); ctx.globalAlpha = a2; ctx.strokeStyle = "#ff6b4a"; ctx.lineWidth = 2.4; ctx.shadowColor = "#ff5a3c"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(L[0], L[1]); ctx.lineTo(L[0] + L[2] * 80, L[1] + L[3] * 80); ctx.stroke(); ctx.restore(); });
      if (tr.leaks.length){ var L0 = tr.leaks[0]; S.draw.label(c, "fuite", L0[0] + L0[2] * 92, L0[1] + L0[3] * 92, {color:P.red, size:11.5}); }
      /* impulsions de lumière qui voyagent */
      var tot = 0, lens = tr.segs.map(function(sg){ var d = Math.hypot(sg[2] - sg[0], sg[3] - sg[1]); tot += d; return d; });
      if (tot > 0){ for (var pk = 0; pk < 6; pk++){ var s = (st.s + pk * 150) % (tot + 150), acc = 0; if (s > tot) continue;
        for (j = 0; j < lens.length; j++){ if (s <= acc + lens[j]){ var f = (s - acc) / (lens[j] || 1), sg = tr.segs[j]; S.draw.glow(c, sg[0] + (sg[2] - sg[0]) * f, sg[1] + (sg[3] - sg[1]) * f, 16, "#fff3b0", Math.min(1, 0.2 + sg[4])); break; } acc += lens[j]; } } }
      /* incidence la plus faible : normale et angle */
      if (tr.hits.length){ var hm = tr.hits.reduce(function(a, b){ return b[2] < a[2] ? b : a; }), nb = fibreNear(g, hm[0], hm[1]), nx = hm[0] - nb[1], ny = hm[1] - nb[2], nn = Math.hypot(nx, ny) || 1; nx /= nn; ny /= nn;
        S.draw.line(c, hm[0] - nx * 22, hm[1] - ny * 22, hm[0] + nx * 22, hm[1] + ny * 22, "#c9d3df", 1.2, [3, 3]);
        S.draw.label(c, "i = " + S.fmt(hm[2], 1) + "°", hm[0] + nx * (w * 2 + 22) + (ph ? 0 : 6), hm[1] + ny * (w * 2 + 22), {color:hm[2] >= thc * R2D - 1e-9 ? P.violet : P.red, size:11}); }
      /* récepteur en sortie */
      var ex = g.Ex + g.dx * g.L2, ey = g.Ey + g.dy * g.L2, ang = Math.atan2(g.dy, g.dx), pct = tr.out * 100;
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(ang); ctx.fillStyle = PX.lin(c, 0, -w * 2.6, 0, w * 2.6, [[0, "#6b7787"], [1, "#2f3946"]]); PX.rr(ctx, 0, -w * 2.6, 34, w * 5.2, 5); ctx.fill(); ctx.fillStyle = "#11161d"; ctx.fillRect(0, -w, 4, 2 * w); ctx.restore();
      S.draw.glow(c, ex, ey, 30, "#ffe27a", Math.min(0.9, pct / 100));
      S.draw.display(c, S.fmt(pct, 0) + " %", kap ? Math.max(56, W * 0.3) : Math.min(W - 52, ex - 10), kap ? 44 : ey - w * 2 - 40, {w:ph ? 78 : 92, h:ph ? 36 : 42, caption:"LUMIÈRE REÇUE", size:ph ? 14 : 17});
      /* laser orientable */
      var Lr = ph ? 54 : 70, sx = x0 - Lr * Math.cos(A), sy = y0 + Lr * Math.sin(A); geo.hx = sx; geo.hy = sy;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x0, y0); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(-A); ctx.fillStyle = PX.lin(c, 0, -11, 0, 11, [[0, "#5d6878"], [0.5, "#323a46"], [1, "#1b2028"]]); PX.rr(ctx, -46, -11, 46, 22, 5); ctx.fill(); ctx.fillStyle = "#c0321d"; ctx.fillRect(-38, -11, 6, 22); ctx.fillStyle = "#11161d"; ctx.fillRect(-3, -5, 4, 10); ctx.restore();
      S.draw.glow(c, sx, sy, 12, col, 0.9);
      PX.grip(c, sx - 26 * Math.cos(A), sy + 26 * Math.sin(A), P.amber, st.hint && !ph ? "tourne le laser" : null, 7);
      geo.hx = sx - 26 * Math.cos(A); geo.hy = sy + 26 * Math.sin(A);
      S.draw.label(c, "α = " + al.value + "°", x0 - 30, Math.min(H - 12, y0 + (ph ? 46 : 56) + 14), {color:P.amber, size:11.5});
      S.draw.label(c, guided ? "rayon guidé : réflexion totale" : "fuites : la lumière s'échappe", W - 8, 16, {color:guided ? P.green : P.red, fill:"rgba(255,255,255,.92)", align:"right", size:12});
      ro.set(0, S.fmt(amax, 1) + " °"); ro.set(1, S.fmt(thc * R2D, 1) + " °"); ro.set(2, tr.hits.length ? S.fmt(tr.minI, 1) + " °" : "aucun contact"); ro.set(3, guided ? "guidé (100 %)" : "fuites (reçu : " + S.fmt(pct, pct < 10 ? 1 : 0) + " %)");
      var inA = al.value <= amax + 1e-9;
      nt.set(guided ? (tr.hits.length ? "Incidence la plus faible sur la paroi : " + S.fmt(tr.minI, 1) + " ° ≥ angle limite " + S.fmt(thc * R2D, 1) + " ° : réflexion totale à chaque rebond, aucune perte (modèle idéal)." : "Rayon dans l'axe : il ne touche pas la paroi, aucune perte.") + (kap ? " Le rayon suit la fibre même dans le virage." : "")
        : "Incidence sur la paroi : " + S.fmt(tr.minI, 1) + " ° &lt; angle limite " + S.fmt(thc * R2D, 1) + " ° : une partie de la lumière passe dans la gaine et s'échappe (le reste est réfléchi, formules de Fresnel)." + (inA && kap ? " Ici, c'est le <b>virage</b> qui fait fuir la lumière : dans une courbe serrée, le rayon frappe la paroi extérieure moins obliquement. (Modèle 2D très agrandi : une vraie fibre a un cœur de quelques µm et supporte des courbes de quelques cm.)" : " Diminue α (&lt; " + S.fmt(amax, 1) + " °)" + (kap ? " ou adoucis le virage." : ".")), guided ? "" : "warn");
    });
  }
});

var VERRES = {crown:[1.5046, 0.0042, "Crown"], flint:[1.600, 0.010, "Flint"], fort:[1.45, 0.035, "Verre à dispersion exagérée"]};
var COUL = [[0.68, "#e11d1d", "rouge"], [0.62, "#f59e0b", "orange"], [0.58, "#e5c800", "jaune"], [0.53, "#16a34a", "vert"], [0.49, "#0ea5e9", "cyan"], [0.45, "#2563eb", "bleu"], [0.41, "#7c3aed", "violet"]];
SFA.sim({
  id:"p4-c09-prisme", ch:"c09", tag:"Dispersion",
  titre:"Le prisme décompose la lumière blanche",
  resume:"L'indice du verre dépend de la couleur : le violet est plus dévié que le rouge.",
  but:"Glisse le rayon incident (poignée) pour changer l'incidence. Fais varier l'angle du prisme, l'angle d'incidence et le type de verre. Observe l'écart entre le rouge et le violet à la sortie.",
  aRetenir:"La lumière blanche est un mélange de couleurs. Dans le verre, l'indice n est plus grand pour le violet que pour le rouge : le violet est plus dévié. Le prisme ne colore pas la lumière : il la décompose (dispersion). L'arc-en-ciel est la dispersion de la lumière du Soleil par des gouttes d'eau.",
  piege:"Le prisme n'ajoute pas de couleurs à la lumière blanche : elles y sont déjà. Et si l'angle du prisme est trop grand ou l'incidence trop faible, la lumière peut être totalement réfléchie à l'intérieur et ne pas ressortir. (Modèle de dispersion simplifié : n = a + b/λ².)",
  build:function(k,S){
    var c = PX.canvas(k, 0.78, 1.0), Gp = {};
    var gl = k.seg("Verre", [["crown","Crown"],["flint","Flint"],["fort","Dispersion exagérée"]], "crown");
    var A = k.slider("Angle au sommet du prisme", 30, 70, 1, 60, "°");
    var i1 = k.slider("Angle d'incidence sur la 1re face", 20, 80, 1, 50, "°");
    var ro = k.readouts(["n rouge / n violet", "Déviation du rouge", "Déviation du violet", "Écart angulaire"]);
    var nt = k.note("", "");
    function nlam(g, lam){ var v = VERRES[g]; return v[0] + v[1] / (lam * lam); }
    function trace(a, I1, n){
      var r1 = Math.asin(Math.sin(I1) / n), i2 = r1 - a, s = n * Math.sin(i2);
      return {r1:r1, tir:Math.abs(s) > 1, e:Math.abs(s) > 1 ? 0 : Math.asin(s), i2:i2};
    }
    PX.drag(k, c, function(){ return Gp.x == null ? [] : [{x:Gp.x, y:Gp.y, r:12, set:function(px, py){ var phi = Math.atan2(Gp.pin[1] - (c.H - py), Gp.pin[0] - px); i1.set(Math.max(20, Math.min(80, Math.round((phi + Gp.a / 2) * R2D)))); }}]; });
    k.draw(function(){
      var P = SFA.draw.palette, a = A.value * D2R, I1 = i1.value * D2R, ctx = c.ctx, g = gl.value;
      var L = Math.min(150, c.W * 0.38), apex = [c.W * 0.42, 40], dirL = [-Math.sin(a / 2), -Math.cos(a / 2)], dirR = [Math.sin(a / 2), -Math.cos(a / 2)];
      /* repère mathématique (y vers le haut) → écran */
      var Sx = function(p){ return p[0]; }, Sy = function(p){ return c.H - p[1]; };
      var ap = [apex[0], c.H - apex[1]];
      var P0 = [ap[0], ap[1]];  /* sommet en repère math */
      var vL = [P0[0] + L * dirL[0], P0[1] + L * dirL[1]], vR = [P0[0] + L * dirR[0], P0[1] + L * dirR[1]];
      c.clear(); PX.bg(c, "#0d1426", "#1b2440");
      ctx.fillStyle = PX.lin(c, Sx(vL), 0, Sx(vR), 0, [[0, "rgba(200,225,255,.32)"], [0.5, "rgba(160,200,255,.14)"], [1, "rgba(200,225,255,.28)"]]); ctx.strokeStyle = "rgba(235,245,255,.9)"; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(Sx(P0), Sy(P0)); ctx.lineTo(Sx(vL), Sy(vL)); ctx.lineTo(Sx(vR), Sy(vR)); ctx.closePath(); ctx.fill(); ctx.stroke();
      var t = 0.45, Pin = [P0[0] + t * L * dirL[0], P0[1] + t * L * dirL[1]], phi0 = -a / 2 + I1, d0 = [Math.cos(phi0), Math.sin(phi0)];
      var st = [Pin[0] - 150 * d0[0], Pin[1] - 150 * d0[1]];
      S.draw.line(c, Sx(st), Sy(st), Sx(Pin), Sy(Pin), "rgba(255,255,255,.25)", 9); S.draw.line(c, Sx(st), Sy(st), Sx(Pin), Sy(Pin), "#ffffff", 3); S.draw.glow(c, Sx(Pin), Sy(Pin), 16, "#ffffff", 0.7); Gp.x = Sx(st); Gp.y = Sy(st); Gp.pin = [Sx(Pin), c.H - Sy(Pin)]; Gp.a = a; PX.grip(c, Gp.x, Gp.y, P.amber, null, 7);
      var xs = c.W - 22; ctx.fillStyle = "#e8edf5"; PX.rr(ctx, xs, 8, 14, c.H - 16, 4); ctx.fill(); P4.label(c, "écran", xs - 6, 14, "#5f6b7a", "right");
      var res = [], lost = [], loupe = [];
      COUL.forEach(function(co){
        var n = nlam(g, co[0]), T = trace(a, I1, n), phi1 = -a / 2 + T.r1, d1 = [Math.cos(phi1), Math.sin(phi1)];
        /* intersection avec la face droite : Pin + u d1 = P0 + s dirR */
        var det = d1[0] * (-dirR[1]) - d1[1] * (-dirR[0]), bx = P0[0] - Pin[0], by = P0[1] - Pin[1];
        var u = (bx * (-dirR[1]) - by * (-dirR[0])) / det, s = (d1[0] * by - d1[1] * bx) / det;
        if (!(u > 0 && s > 0 && s < L)){ lost.push(co[2] + " (sort par la base)"); return; }
        var P2 = [Pin[0] + u * d1[0], Pin[1] + u * d1[1]];
        S.draw.line(c, Sx(Pin), Sy(Pin), Sx(P2), Sy(P2), co[1], 2);
        if (T.tir){ lost.push(co[2] + " (réflexion totale)"); return; }
        var phi2 = a / 2 + T.e, d2 = [Math.cos(phi2), Math.sin(phi2)], tt = (xs - P2[0]) / d2[0];
        if (d2[0] <= 0.01) return;
        var Pe = [xs, P2[1] + tt * d2[1]];
        S.draw.line(c, Sx(P2), Sy(P2), Sx(Pe), Sy(Pe), co[1], 2);
        ctx.fillStyle = co[1]; loupe.push({y:Sy(Pe), col:co[1]}); ctx.fillRect(xs, Sy(Pe) - 3, 14, 6); S.draw.glow(c, xs + 7, Sy(Pe), 14, co[1], 0.6);
        res.push({name:co[2], D:(phi0 - phi2) * R2D, n:n});
      });
      if (loupe.length > 1){
        var ymn = Math.min.apply(null, loupe.map(function(q){ return q.y; })), ymx = Math.max.apply(null, loupe.map(function(q){ return q.y; })), spread = Math.max(0.01, ymx - ymn), bw = Math.min(230, c.W - 40), bx = 14, by = c.H - 62, K = (bw - 24) / spread;
        S.draw.panel(c, bx, by, bw, 50, {fill:"rgba(255,255,255,.95)", shadow:false});
        loupe.forEach(function(q){ ctx.fillStyle = q.col; ctx.fillRect(bx + 12 + (q.y - ymn) * K - 3, by + 8, 6, 22); });
        S.draw.text(c, "loupe sur l'écran (étalement × " + S.fmt(K, 0) + ")", bx + bw / 2, by + 41, {size:10.5, color:"#5f6b7a"});
      }
      var nr = nlam(g, 0.68), nv = nlam(g, 0.41), Tr = trace(a, I1, nr), Tv = trace(a, I1, nv);
      var Dr = Tr.tir ? NaN : I1 - Tr.e - a, Dv = Tv.tir ? NaN : I1 - Tv.e - a;
      ro.set(0, S.fmt(nr, 3) + " / " + S.fmt(nv, 3)); ro.set(1, isNaN(Dr) ? "—" : S.fmt(Dr * R2D, 1) + " °"); ro.set(2, isNaN(Dv) ? "—" : S.fmt(Dv * R2D, 1) + " °"); ro.set(3, isNaN(Dr) || isNaN(Dv) ? "—" : S.fmt((Dv - Dr) * R2D, 2) + " °");
      nt.set(res.length === 7 && !lost.length ? "Le violet (n plus grand) est plus dévié que le rouge. Rouge : " + S.fmt(Dr * R2D, 1) + " °, violet : " + S.fmt(Dv * R2D, 1) + " °." : lost.length ? "Pas de sortie pour : " + lost.join(", ") + ". Change l'angle du prisme ou l'incidence." : "Peu de couleurs sortent vers l'écran avec ces réglages.", res.length === 7 && !lost.length ? "" : "warn");
    });
  }
});
})();
