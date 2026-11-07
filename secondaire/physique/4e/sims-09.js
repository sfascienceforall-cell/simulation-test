/* Physique 4e · chapitre 9 · Réfraction, réflexion totale et dispersion */
(function(){
var D2R = Math.PI / 180, R2D = 180 / Math.PI;
var MED = [["air","Air (n = 1,00)",1.00],["eau","Eau (n = 1,33)",1.33],["verre","Verre (n = 1,50)",1.50],["diam","Diamant (n = 2,42)",2.42]];
function nOf(k){ return MED.filter(function(m){ return m[0] === k; })[0][2]; }

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
  but:"Règle l'indice de la gaine (le cœur a n = 1,50) et l'angle d'entrée du rayon (glisse le laser à la souris ou au doigt). Observe s'il reste guidé ou s'échappe : le cône vert montre les angles acceptés.",
  aRetenir:"Dans une fibre, le cœur (n₁) est entouré d'une gaine (n₂ < n₁). Si l'angle d'incidence sur la paroi dépasse l'angle limite, il y a réflexion totale : le rayon est guidé, même si la fibre est courbée. Angle d'acceptation : sin α<sub>max</sub> = √(n₁² − n₂²).",
  piege:"Plus l'indice de la gaine est proche de celui du cœur, plus l'angle d'acceptation est petit : la fibre « accepte » moins de lumière. Il faut aussi une gaine : sans elle, une fibre sale ou en contact avec un objet perdrait la lumière.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.52, 0.8), st = {s:0, hint:true}, geo = {};
    var n2s = k.slider("Indice de la gaine n₂", 1.30, 1.49, 0.01, 1.44, "");
    var al = k.slider("Angle du rayon à l'entrée α", 0, 60, 1, 15, "°", function(){ st.hint = false; });
    var ro = k.readouts(["Angle d'acceptation α<sub>max</sub>", "Angle limite cœur/gaine", "Incidence sur la paroi", "État du rayon"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.s += dt * 260; k.redraw(); }); lp.play();
    PX.drag(k, c, function(){ return [{x:geo.hx, y:geo.hy, r:11, set:function(px, py){ st.hint = false; var a = Math.atan2(geo.cy - py, Math.max(2, geo.x0 - px)) * R2D; al.set(Math.max(0, Math.min(60, Math.round(a)))); }}]; });
    k.draw(function(){
      var n1 = 1.5, n2 = n2s.value, A = al.value * D2R, ctx = c.ctx, ph = PX.phone(c);
      var NA = Math.sqrt(n1 * n1 - n2 * n2), amax = NA >= 1 ? 90 : Math.asin(NA) * R2D, r1 = Math.asin(Math.sin(A) / n1), i2 = Math.PI / 2 - r1, thc = Math.asin(n2 / n1), guided = i2 >= thc - 1e-9;
      var x0 = ph ? 96 : 112, x1 = c.W - 8, cy = c.H / 2, w = ph ? 30 : 40, col = guided ? P.green : P.amber;
      geo.x0 = x0; geo.cy = cy;
      c.clear();
      PX.bg(c, "#eef2f8", "#dde4ee");
      /* gaine et cœur */
      var jg = ctx.createLinearGradient(0, cy - w - 14, 0, cy + w + 14); jg.addColorStop(0, "#7d8aa0"); jg.addColorStop(0.5, "#aab4c6"); jg.addColorStop(1, "#7d8aa0");
      ctx.fillStyle = jg; PX.rr(ctx, x0, cy - w - 14, x1 - x0 + 6, 2 * w + 28, 6); ctx.fill();
      ctx.fillStyle = "#c9d7ea"; ctx.fillRect(x0, cy - w - 7, x1 - x0, 2 * w + 14);
      var cg = ctx.createLinearGradient(0, cy - w, 0, cy + w); cg.addColorStop(0, "#e8f3ff"); cg.addColorStop(0.5, "#f7fbff"); cg.addColorStop(1, "#e8f3ff"); ctx.fillStyle = cg; ctx.fillRect(x0, cy - w, x1 - x0, 2 * w);
      ctx.strokeStyle = "rgba(15,27,45,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, cy - w); ctx.lineTo(x1, cy - w); ctx.moveTo(x0, cy + w); ctx.lineTo(x1, cy + w); ctx.stroke();
      S.draw.label(c, "cœur n₁ = 1,50", (x0 + x1) / 2, cy + w - 13, {color:"#5f6b7a", size:PX.fs(c, 11.5)});
      S.draw.label(c, "gaine n₂ = " + S.fmt(n2, 2), (x0 + x1) / 2, cy - w - 20, {color:"#2c3a4e", size:PX.fs(c, 11.5)});
      /* cône d'acceptation */
      var cone = 62, am = Math.min(amax, 80) * D2R;
      ctx.fillStyle = "rgba(36,119,90,.14)"; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 - cone * Math.cos(am), cy - cone * Math.sin(am)); ctx.arc(x0, cy, cone, Math.PI + am, Math.PI - am, true); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(36,119,90,.55)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 - cone * Math.cos(am), cy - cone * Math.sin(am)); ctx.moveTo(x0, cy); ctx.lineTo(x0 - cone * Math.cos(am), cy + cone * Math.sin(am)); ctx.stroke(); ctx.setLineDash([]);
      S.draw.label(c, "α max = " + S.fmt(amax, 1) + "°", x0 - cone * 0.55, cy + cone * 0.95 > c.H - 14 ? c.H - 14 : cy + cone * 0.95, {color:P.green, size:10.5});
      /* trajet du rayon */
      var pts = [[x0, cy]], slope = Math.tan(r1), x = x0, y = cy, dir = -1, leak = null;
      for (var it = 0; it < 90 && x < x1; it++){
        var dyTo = dir < 0 ? (y - (cy - w)) : ((cy + w) - y), dx = slope > 1e-6 ? dyTo / slope : 1e9;
        if (x + dx >= x1 || slope < 1e-6){ var xx = Math.min(x1, x + (slope > 1e-6 ? dx : x1 - x)); pts.push([xx, y + dir * slope * (xx - x)]); break; }
        x += dx; y += dir * dyTo; pts.push([x, y]);
        if (!guided){ var e = Math.asin(Math.min(1, n1 * Math.sin(i2) / n2)); leak = [x, y, e, dir]; break; }
        dir = -dir;
      }
      /* rayon incident (air) et réfraction à l'entrée */
      var Lr = ph ? 52 : 70, sx = x0 - Lr * Math.cos(A), sy = cy + Lr * Math.sin(A); geo.hx = sx; geo.hy = sy;
      S.draw.line(c, sx, sy, x0, cy, "#6b7787", 1.2, [3, 3]);
      S.draw.line(c, x0, cy - w - 4, x0, cy + w + 4, "rgba(15,27,45,.2)", 1, [2, 3]);
      S.draw.arrow(c, sx, sy, x0 - 1, cy, P.amber, 3);
      ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach(function(p, j){ j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      if (leak){ var lx = leak[0], ly = leak[1]; ctx.strokeStyle = P.red; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 60 * Math.sin(leak[2]), ly + leak[3] * 60 * Math.cos(leak[2])); ctx.stroke(); ctx.setLineDash([]); S.draw.glow(c, lx, ly, 22, P.red, 0.45); S.draw.label(c, "fuite", lx + 36 * Math.sin(leak[2]) + 12, ly + leak[3] * 44 * Math.cos(leak[2]), {color:P.red, size:11.5}); }
      /* grain de lumière qui voyage */
      var tot = 0, seg = [], j; for (j = 1; j < pts.length; j++){ var dd = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(dd); tot += dd; }
      if (tot > 0){ var s = st.s % (tot + 40), acc = 0; for (j = 0; j < seg.length; j++){ if (s <= acc + seg[j]){ var f = (s - acc) / seg[j]; if (guided || s < tot) S.draw.glow(c, pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f, 14, "#ffd24a", 0.9); break; } acc += seg[j]; } }
      if (pts.length > 1){ var p1 = pts[1]; S.draw.line(c, p1[0], p1[1] - 18, p1[0], p1[1] + 18, "#6b7787", 1.1, [3, 3]); S.draw.label(c, "i", p1[0] + 12, p1[1] + (p1[1] < cy ? 16 : -16), {color:P.violet, size:11.5}); }
      S.draw.label(c, "α = " + al.value + "°", x0 - 30, cy - 26, {color:P.amber, align:"right", size:11.5});
      PX.grip(c, sx, sy, P.amber, st.hint ? "tourne le laser" : null, 8);
      S.draw.label(c, guided ? "rayon guidé : réflexion totale" : "rayon perdu : trop incliné", c.W - 8, 14, {color:guided ? P.green : P.red, align:"right", size:12});
      ro.set(0, S.fmt(amax, 1) + " °"); ro.set(1, S.fmt(thc * R2D, 1) + " °"); ro.set(2, S.fmt(i2 * R2D, 1) + " °"); ro.set(3, guided ? "guidé" : "perdu");
      nt.set(guided ? "Incidence sur la paroi : " + S.fmt(i2 * R2D, 1) + " ° ≥ angle limite " + S.fmt(thc * R2D, 1) + " ° : réflexion totale à chaque rebond, aucune perte (modèle idéal)." : "Incidence sur la paroi : " + S.fmt(i2 * R2D, 1) + " ° < angle limite " + S.fmt(thc * R2D, 1) + " ° : une partie de la lumière passe dans la gaine et s'échappe. Diminue α (< " + S.fmt(amax, 1) + " °).", guided ? "" : "warn");
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
