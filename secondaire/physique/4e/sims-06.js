/* Physique 4e · chapitre 6 · Conservation et dégradation de l'énergie */
(function(){
var G = 9.8;

SFA.sim({
  id:"p4-c06-rebonds", ch:"c06", tag:"Animation",
  titre:"Une balle qui rebondit : où va l'énergie ?",
  resume:"À chaque rebond, la hauteur diminue : l'énergie mécanique devient chaleur, mais le total reste le même.",
  but:"Attrape la balle pour choisir la hauteur de départ (ou utilise les curseurs), la masse et la part d'énergie conservée à chaque rebond. La barre du bas montre mécanique + thermique = constante.",
  aRetenir:"L'énergie totale se conserve. À chaque rebond, une partie de l'énergie mécanique est transformée en énergie thermique (balle, sol, air) : on dit que l'énergie se dégrade. La hauteur du n-ième rebond est h<sub>n</sub> = h₀·f<sup>n</sup>.",
  piege:"« La balle perd de l'énergie » : non, elle la cède à l'environnement sous forme de chaleur (très faible ici, mais bien réelle). C'est l'énergie MÉCANIQUE qui diminue, pas l'énergie totale.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.82, 1.1), st = {t:0, hint:true}, geo = {};
    var h0 = k.slider("Hauteur de départ", 0.5, 3, 0.5, 2, "m", function(){ st.t = 0; st.hint = false; });
    var m = k.slider("Masse de la balle", 0.05, 1, 0.05, 0.2, "kg");
    var f = k.slider("Énergie conservée à chaque rebond", 30, 95, 5, 70, "%", function(){ st.t = 0; });
    var ro = k.readouts(["Énergie totale m·g·h₀", "Énergie mécanique", "Énergie thermique", "Rebonds avant < 1 cm"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); });
    k.button("▶ Lâcher", function(){ st.t = 0; st.hint = false; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    function state(t){
      var H = h0.value, F = f.value / 100, t0 = Math.sqrt(2 * H / G);
      if (t < t0) return {y:H - 0.5 * G * t * t, ap:H, n:0, ph:t / t0};
      var s = t - t0, n = 1, hn = H * F, Tn;
      while (n < 400){
        if (hn < 0.005) return {y:0, ap:0, n:n, rest:true, ph:1};
        Tn = 2 * Math.sqrt(2 * hn / G);
        if (s < Tn){ var v = Math.sqrt(2 * G * hn); return {y:v * s - 0.5 * G * s * s, ap:hn, n:n, ph:s / Tn}; }
        s -= Tn; n++; hn *= F;
      }
      return {y:0, ap:0, n:n, rest:true, ph:1};
    }
    PX.drag(k, c, function(){ return [{x:geo.bx0, y:geo.by0, r:14, set:function(px, py){ lp.pause(); st.t = 0; st.hint = false; h0.set(Math.max(0.5, Math.min(3, Math.round((geo.gnd - py) / geo.sc * 2) / 2))); }}]; });
    k.draw(function(){
      var H = h0.value, M = m.value, F = f.value / 100, s = state(st.t), ph = PX.phone(c);
      var gnd = c.H - 62, top = 34, sc = (gnd - top) / (H * 1.02), x0 = 70, nShow = 7, wb = Math.min(58, (c.W - x0 - 24) / nShow);
      geo.gnd = gnd; geo.sc = sc;
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#eef3fa", "#dde6f2"); PX.ground(c, gnd, "#b9c3d1", c.H - gnd);
      ctx.fillStyle = "#6b7787"; ctx.fillRect(0, gnd, c.W, 5);
      var Y = PX.vruler(c, 38, gnd, top, 0, H * 1.02, P4.nice(H / 4), "m");
      /* hauteurs successives */
      var xAt = function(n, ph2){ return x0 + Math.min(n - 1 + ph2, nShow) * wb + (n >= 1 ? 0 : 0); };
      ctx.save(); ctx.lineWidth = 1.6; var xx = x0 - 0;
      for (var n = 0; n <= nShow; n++){
        var hn = H * Math.pow(F, n); if (hn * sc < 1.5) break;
        var done = (s.n > n) || (s.rest && s.n >= n) || (s.n === n && s.ph >= 1);
        if (n === 0){
          ctx.strokeStyle = "rgba(95,107,122,.35)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0, gnd - H * sc); ctx.lineTo(x0, gnd); ctx.stroke();
        } else {
          var xa = x0 + (n - 1) * wb, xb = x0 + n * wb;
          ctx.setLineDash(done ? [] : [3, 5]); ctx.strokeStyle = done ? "rgba(192,50,29,.75)" : "rgba(95,107,122,.35)";
          ctx.beginPath(); for (var q = 0; q <= 24; q++){ var u = q / 24, yy = 4 * hn * u * (1 - u); q ? ctx.lineTo(xa + (xb - xa) * u, gnd - yy * sc) : ctx.moveTo(xa, gnd - yy * sc); } ctx.stroke();
          if (hn * sc > 16) S.draw.label(c, "h" + n + " = " + S.fmt(hn, 2) + " m", (xa + xb) / 2, gnd - hn * sc - 12, {color:done ? P.red : P.grey, size:ph ? 9.5 : 10.5});
        }
      }
      ctx.restore();
      S.draw.line(c, 42, gnd - H * sc, x0 + 6, gnd - H * sc, P.green, 1.2, [4, 3]); S.draw.label(c, "départ " + S.fmt(H, 1) + " m", x0 + 10, gnd - H * sc - 12, {color:P.green, align:"left", size:11});
      /* balle */
      var bxr = s.n === 0 ? x0 : x0 + Math.min(s.n - 1 + s.ph, nShow) * wb, byr = gnd - s.y * sc, r = 8 + M * 12;
      var sq = s.y * sc < 4 && s.n > 0 ? 0.78 : 1;
      ctx.save(); ctx.translate(bxr, byr - r * sq); ctx.scale(1 / sq, sq); PX.ball(c, 0, 0, r, "#e8622d", {}); ctx.restore();
      geo.bx0 = x0; geo.by0 = gnd - H * sc - r;
      if (st.t === 0){ PX.grip(c, x0, gnd - H * sc - r, P.red, st.hint ? "attrape-moi" : null, 7); }
      /* barre d'énergie : mécanique + thermique = total */
      var E0 = M * G * H, Em = M * G * s.ap, Et = E0 - Em, bw2 = c.W - 40, bx2 = 20, by2 = c.H - 36;
      ctx.fillStyle = "#e3e7ed"; PX.rr(ctx, bx2, by2, bw2, 22, 7); ctx.fill();
      ctx.save(); PX.rr(ctx, bx2, by2, bw2, 22, 7); ctx.clip(); ctx.fillStyle = P.acc; ctx.fillRect(bx2, by2, bw2 * Em / E0, 22); ctx.fillStyle = P.red; ctx.fillRect(bx2 + bw2 * Em / E0, by2, bw2 * Et / E0, 22); ctx.restore();
      S.draw.label(c, "mécanique " + S.fmt(Em, 2) + " J", bx2 + 4, by2 - 11, {color:P.acc, align:"left", size:11}); S.draw.label(c, "thermique " + S.fmt(Et, 2) + " J", bx2 + bw2 - 4, by2 - 11, {color:P.red, align:"right", size:11});
      S.draw.text(c, "total = " + S.fmt(E0, 2) + " J (constant)", c.W / 2, by2 + 11, {size:11, color:"#fff", bg:"rgba(15,27,45,.55)"});
      var n1 = H > 0.01 ? Math.ceil(Math.log(0.01 / H) / Math.log(F)) : 0;
      ro.set(0, S.fmt(E0, 2) + " J"); ro.set(1, S.fmt(Em, 2) + " J"); ro.set(2, S.fmt(Et, 2) + " J"); ro.set(3, n1 + " rebonds");
      nt.set(s.rest ? "La balle est immobile : toute l'énergie de départ (" + S.fmt(E0, 2) + " J) est devenue énergie thermique." : "Mécanique + thermique = " + S.fmt(Em + Et, 2) + " J à tout instant. Rebond n° " + s.n + " : hauteur max. " + S.fmt(s.ap, 2) + " m.", "");
    });
  }
});

SFA.sim({
  id:"p4-c06-pendule-frottement", ch:"c06", tag:"Bilan",
  titre:"Pendule avec frottements : le bilan d'énergie",
  resume:"L'énergie mécanique décroît, l'énergie thermique croît, et leur somme est constante.",
  but:"Attrape la boule pour choisir l'amplitude, règle le frottement de l'air. Suis les courbes d'énergie au cours du temps et le thermomètre. Avec 0 frottement, l'énergie mécanique reste constante.",
  aRetenir:"Avec frottements, E<sub>mécanique</sub> diminue et E<sub>thermique</sub> = E<sub>départ</sub> − E<sub>mécanique</sub> augmente : l'énergie totale est constante. L'énergie thermique dispersée est difficile à récupérer : l'énergie se dégrade.",
  piege:"Quand le pendule s'arrête, son énergie n'a pas « disparu » : l'air, le fil et le support se sont légèrement réchauffés. La conservation concerne l'énergie totale, pas l'énergie mécanique seule.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.55, 0.85), g1 = PX.canvas(k, 0.5, 0.65), st = {th:0, w:0, t:0, hist:[], hint:true}, geo = {};
    var th0, lam, sp;
    function reset(){ st.th = (th0 ? th0.value : 50) * Math.PI / 180; st.w = 0; st.t = 0; st.hist = []; }
    th0 = k.slider("Amplitude de départ", 20, 80, 5, 50, "°", function(){ st.hint = false; reset(); });
    lam = k.slider("Frottement de l'air", 0, 1, 0.05, 0.15, "s⁻¹", reset);
    sp = k.seg("Vitesse", [[1,"×1"],[4,"×4"]], 4);
    var ro = k.readouts(["E départ (m = 0,5 kg, L = 1 m)", "E mécanique", "E thermique", "Somme"]);
    var nt = k.note("", "");
    var M = 0.5, L = 1;
    var lp = k.loop(function(dt){
      var tot = dt * sp.value, n = Math.ceil(tot / 0.001), d = tot / n, i;
      for (i = 0; i < n; i++){ st.w += (-G / L * Math.sin(st.th) - lam.value * st.w) * d; st.th += st.w * d; st.t += d; }
      var Em = 0.5 * M * L * L * st.w * st.w + M * G * L * (1 - Math.cos(st.th));
      if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.15) st.hist.push([st.t, Em]);
      if (st.t > 30) lp.pause();
      k.redraw();
    });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Relâcher", function(){ reset(); lp.play(); });
    reset(); lp.play();
    PX.drag(k, c, function(){ return [{x:geo.bx, y:geo.by, r:16, set:function(px, py){ st.hint = false; lp.pause(); var a = Math.abs(Math.atan2(px - geo.px, py - geo.py)) * 180 / Math.PI; th0.set(Math.max(20, Math.min(80, Math.round(a / 5) * 5))); reset(); }}]; }, function(){ lp.play(); });
    k.draw(function(){
      var T0 = th0.value * Math.PI / 180, E0 = M * G * L * (1 - Math.cos(T0)), ph = PX.phone(c);
      var Em = Math.min(E0, 0.5 * M * L * L * st.w * st.w + M * G * L * (1 - Math.cos(st.th))), Et = Math.max(0, E0 - Em), fr = E0 > 0 ? Et / E0 : 0;
      var aw = c.W * 0.74, px = aw * 0.5, py = 22, r = Math.min(c.H - 52, aw * 0.5 / Math.max(0.3, Math.sin(T0)) - 10), bx = px + r * Math.sin(st.th), by = py + r * Math.cos(st.th);
      geo.bx = bx; geo.by = by; geo.px = px; geo.py = py;
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#f6f3ef", "#ece6de");
      S.draw.glow(c, px, py, 70, "#e0562f", 0.1 + 0.5 * fr);
      ctx.fillStyle = "#6b7787"; ctx.fillRect(px - 46, py - 12, 92, 9);
      ctx.save(); ctx.strokeStyle = "rgba(36,119,90,.5)"; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(px, py, r, Math.PI / 2 - T0, Math.PI / 2 + T0); ctx.stroke(); ctx.restore();
      S.draw.line(c, px, py, px, py + r + 14, "#d3cbbf", 1.3, [4, 4]);
      var ex = Em > 0 ? Math.max(0.02, Em / E0) : 0.02;
      S.draw.line(c, px, py, bx, by, "#46515f", 2.2);
      PX.ball(c, bx, by, 13, "rgb(" + Math.round(192) + "," + Math.round(50 + 120 * fr) + "," + Math.round(29 + 120 * fr) + ")", {shadowY:py + r + 16, shadowA:0.15});
      S.draw.label(c, "amplitude " + S.fmt(Math.abs(Math.acos(Math.max(-1, Math.min(1, 1 - Em / (M * G * L)))) * 180 / Math.PI), 0) + "°", px, c.H - 12, {color:P.grey, size:11});
      if (st.hint) PX.grip(c, bx, by, P.red, "attrape", 11);
      /* thermomètre : énergie thermique accumulée */
      var tx = aw + (c.W - aw) / 2, ty0 = 36, ty1 = c.H - 40;
      S.draw.panel(c, aw + 4, 6, c.W - aw - 10, c.H - 12, {title:ph ? "Chaleur" : "Chaleur dégagée", shadow:false});
      ctx.fillStyle = "#e3e7ed"; PX.rr(ctx, tx - 8, ty0, 16, ty1 - ty0, 8); ctx.fill();
      ctx.fillStyle = PX.lin(c, 0, ty1, 0, ty0, [[0, "#e0562f"], [1, "#f4a23a"]]); var hh = (ty1 - ty0) * fr; PX.rr(ctx, tx - 8, ty1 - hh, 16, Math.max(hh, 0.1), 8); ctx.fill();
      ctx.beginPath(); ctx.arc(tx, ty1 + 6, 12, 0, 6.2832); ctx.fillStyle = "#e0562f"; ctx.fill();
      S.draw.label(c, S.fmt(fr * 100, 0) + " %", tx, ty0 - 4 + 0 > ty1 - hh - 10 ? ty1 - hh + 10 : ty1 - hh - 12, {color:P.red, size:11.5});
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:30, y0:0, y1:E0 * 1.15, xl:"t (s)", yl:"E (J)", stepX:5});
      S.draw.line(g1, ax.X(0), ax.Y(E0), ax.X(30), ax.Y(E0), "#13233a", 2, [6, 4]); S.draw.label(g1, "total", ax.X(29), ax.Y(E0) - 12, {color:"#13233a", align:"right", size:11.5});
      var ctx2 = g1.ctx; ctx2.save(); ctx2.lineWidth = 3;
      if (st.hist.length > 1){ ctx2.beginPath(); st.hist.forEach(function(p, j){ var q = Math.max(0, E0 - p[1]); j ? ctx2.lineTo(ax.X(p[0]), ax.Y(q)) : ctx2.moveTo(ax.X(p[0]), ax.Y(q)); }); ctx2.lineTo(ax.X(st.hist[st.hist.length - 1][0]), ax.Y(0)); ctx2.lineTo(ax.X(0), ax.Y(0)); ctx2.closePath(); ctx2.fillStyle = "rgba(192,50,29,.10)"; ctx2.fill(); }
      ctx2.strokeStyle = P.acc; ctx2.beginPath(); st.hist.forEach(function(p, j){ j ? ctx2.lineTo(ax.X(p[0]), ax.Y(Math.min(E0, p[1]))) : ctx2.moveTo(ax.X(p[0]), ax.Y(Math.min(E0, p[1]))); }); ctx2.stroke();
      ctx2.strokeStyle = P.red; ctx2.beginPath(); st.hist.forEach(function(p, j){ var q = Math.max(0, E0 - p[1]); j ? ctx2.lineTo(ax.X(p[0]), ax.Y(q)) : ctx2.moveTo(ax.X(p[0]), ax.Y(q)); }); ctx2.stroke(); ctx2.restore();
      S.draw.label(g1, "mécanique", ax.X(1), ax.Y(E0 * 0.86), {color:P.acc, align:"left", size:11.5}); S.draw.label(g1, "thermique", ax.X(29), ax.Y(E0 * 0.1), {color:P.red, align:"right", size:11.5});
      ro.set(0, S.fmt(E0, 2) + " J"); ro.set(1, S.fmt(Em, 2) + " J"); ro.set(2, S.fmt(Et, 2) + " J"); ro.set(3, S.fmt(Em + Et, 2) + " J");
      nt.set(lam.value === 0 ? "Frottement nul : l'énergie mécanique reste (pratiquement) constante, aucune chaleur n'apparaît." : "t = " + S.fmt(st.t, 1) + " s : " + S.fmt(Et / E0 * 100, 0) + " % de l'énergie de départ est devenue énergie thermique.", "");
    });
  }
});

function gauss(t, m, s){ return Math.exp(-Math.pow((t - m) / s, 2)); }
function demand(t, w){ return 8 + 2.2 * gauss(t, 8.5, 2.2) + 3.2 * gauss(t, 19, 2.5) + 0.8 * gauss(t, 13, 3) - 0.6 * gauss(t, 3.5, 2.5) + (w ? 1.5 : 0); }
function cfSol(t, w){ var r = w ? 8.5 : 5.5, s = w ? 16.5 : 21.5, p = w ? 0.15 : 0.6; return t > r && t < s ? p * Math.pow(Math.sin(Math.PI * (t - r) / (s - r)), 1.3) : 0; }
function cfWind(t, w){ return Math.min(0.95, Math.max(0.04, 0.32 + 0.2 * Math.sin(2 * Math.PI * (t - 9) / 24) + 0.12 * Math.sin(2 * Math.PI * t / 7.3 + 1) + (w ? 0.1 : 0))); }
SFA.sim({
  id:"p4-c06-mix-electrique", ch:"c06", tag:"Jeu de rôle",
  titre:"Le mix électrique d'un pays sur 24 heures",
  resume:"Combine nucléaire, éolien, solaire et gaz pour suivre la demande, sans déficit et avec peu de CO₂.",
  but:"Règle les puissances installées et la saison. L'objectif : que la production couvre la demande (ligne noire) à chaque heure, avec le moins de CO₂.",
  aRetenir:"L'électricité doit être produite au moment où elle est consommée. Le solaire et l'éolien dépendent du temps qu'il fait (intermittence) ; le nucléaire est stable ; le gaz est modulable mais émet du CO₂. Renouvelable ne veut pas dire disponible à toute heure.",
  piege:"Une « puissance installée » n'est pas une production : un panneau solaire de 1 GW donne bien moins de 1 GW en moyenne (nuit, nuages, saison). Valeurs chiffrées : modèle pédagogique très simplifié, pas la Belgique réelle.",
  build:function(k,S){
    var c = k.canvas(300);
    var sea = k.seg("Saison", [[0,"Été"],[1,"Hiver"]], 0);
    var nuc = k.slider("Nucléaire installé", 0, 6, 0.5, 2, "GW");
    var sol = k.slider("Solaire installé", 0, 10, 0.5, 4, "GW");
    var win = k.slider("Éolien installé", 0, 10, 0.5, 4, "GW");
    var gaz = k.slider("Gaz (centrales modulables)", 0, 12, 1, 8, "GW");
    var ro = k.readouts(["Part renouvelable utilisée", "Part sans gaz", "CO₂ émis sur 24 h", "Énergie manquante", "Surplus perdu"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, w = +sea.value, i, tot = {n:0, s:0, w:0, g:0, d:0, def:0, sur:0};
      var rows = [], ymax = 14;
      for (i = 0; i < 24; i++){
        var t = i + 0.5, D = demand(t, w), N = nuc.value * 0.9, Sn = sol.value * cfSol(t, w), W = win.value * cfWind(t, w), nf = N + Sn + W;
        var Gg = Math.min(Math.max(D - nf, 0), gaz.value), def = Math.max(0, D - nf - Gg), sur = Math.max(0, nf - D);
        rows.push({D:D, N:N, S:Sn, W:W, G:Gg, def:def, sur:sur});
        tot.n += N; tot.s += Sn; tot.w += W; tot.g += Gg; tot.d += D; tot.def += def; tot.sur += sur;
        ymax = Math.max(ymax, D + 1, N + Sn + W + Gg);
      }
      c.clear(); var ax = S.draw.axes(c, {x0:0, x1:24, y0:0, y1:Math.ceil(ymax / 2) * 2, xl:"heure", yl:"GW", stepX:4, stepY:2, t:26});
      var bw = (ax.R - ax.L) / 24, ctx = c.ctx;
      rows.forEach(function(r, j){
        var x = ax.X(j), y = 0, parts = [[r.N, P.violet], [r.W, P.teal], [r.S, P.amber], [r.G, "#8a95a3"]];
        parts.forEach(function(p){ ctx.fillStyle = p[1]; ctx.fillRect(x + 1, ax.Y(y + p[0]), bw - 2, ax.Y(y) - ax.Y(y + p[0])); y += p[0]; });
        if (r.def > 0){ ctx.fillStyle = "rgba(180,35,24,.55)"; ctx.fillRect(x + 1, ax.Y(r.D), bw - 2, ax.Y(y) - ax.Y(r.D)); }
        if (r.sur > 0){ ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x + 1, ax.Y(y), bw - 2, ax.Y(r.D) - ax.Y(y)); ctx.fillRect(x + 1, ax.Y(y), bw - 2, 0); }
      });
      ctx.save(); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 3; ctx.beginPath(); rows.forEach(function(r, j){ var x = ax.X(j) + bw / 2; if (j) ctx.lineTo(x, ax.Y(r.D)); else ctx.moveTo(x, ax.Y(r.D)); }); ctx.stroke(); ctx.restore();
      var key = [["demande", "#0f1b2d"], ["nucléaire", P.violet], ["éolien", P.teal], ["solaire", P.amber], ["gaz", "#8a95a3"]];
      key.forEach(function(q, j){ ctx.fillStyle = q[1]; ctx.fillRect(ax.L + 8 + j * 64, 6, 10, 10); SFA.draw.text(c, q[0], ax.L + 22 + j * 64, 11, {size:12, color:"#2c3a4e", align:"left"}); });
      var co2 = (tot.g * 0.4 + tot.s * 0.04 + tot.w * 0.012 + tot.n * 0.012);   /* GWh × t/MWh = kt */
      ro.set(0, S.fmt(Math.max(0, (tot.s + tot.w) - tot.sur) / (tot.d - tot.def) * 100, 0) + " %"); ro.set(1, S.fmt((tot.d - tot.def - tot.g) / (tot.d - tot.def) * 100, 0) + " %");
      ro.set(2, S.fmt(co2, 1) + " kt"); ro.set(3, S.fmt(tot.def, 1) + " GWh"); ro.set(4, S.fmt(tot.sur, 1) + " GWh");
      nt.set(tot.def > 0.05 ? "Déficit : il manque de la production à certaines heures (zones rouges). Ajoute des centrales modulables ou de la production stable." : tot.sur > 0.05 ? "Surplus : à certaines heures, la production non modulable dépasse la demande (zones claires) : cette énergie est perdue ou doit être stockée." : "La demande est couverte à chaque heure. Regarde maintenant le CO₂ : peux-tu le réduire ?", tot.def > 0.05 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c06-perpetuel", ch:"c06", tag:"Défi impossible",
  titre:"Perpétuel mobile : le défi impossible",
  resume:"Un moteur alimente une dynamo qui alimente le moteur… peut-il tourner indéfiniment ?",
  but:"Lance la machine : le paquet d'énergie fait le tour du circuit et perd un peu de chaleur à chaque étape. Règle les rendements du moteur et de la dynamo (et l'énergie prélevée pour une lampe), puis essaie de la faire tourner pour toujours. Le bouton « Relancer » remet 100 J.",
  aRetenir:"À chaque transformation, une partie de l'énergie devient chaleur : rendement < 100 %. Après chaque tour il reste moins d'énergie utilisable qu'avant. Un perpétuel mobile de première espèce (qui crée de l'énergie) violerait la conservation ; un perpétuel mobile qui ne perd rien est impossible dès qu'un frottement existe.",
  piege:"Même avec des rendements de 99 %, l'énergie diminue lentement mais sûrement. Ce n'est pas que l'énergie disparaît : elle part en chaleur dans l'air et le support, où on ne peut plus la récupérer pour faire tourner la machine.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.55, 0.85), g1 = PX.canvas(k, 0.42, 0.6), st = {E:100, lap:0, ph:0, ang:0, ang2:0, puffs:[], done:false};
    var e1 = k.slider("Rendement du moteur", 50, 99, 1, 90, "%");
    var e2 = k.slider("Rendement de la dynamo", 50, 99, 1, 90, "%");
    var x = k.slider("Énergie prélevée par tour pour une lampe", 0, 50, 5, 0, "%");
    var ro = k.readouts(["Énergie après 1 tour", "Énergie après 10 tours", "Tours pour tomber sous 50 %", "Tours pour tomber sous 1 %"]);
    var nt = k.note("", "");
    function q(){ return e1.value / 100 * e2.value / 100 * (1 - x.value / 100); }
    function eAt(E0, ph){
      var a = e1.value / 100, b = e2.value / 100, p = x.value / 100;
      if (ph < 0.25) return E0 * (1 - (1 - a) * ph / 0.25);
      if (ph < 0.5) return E0 * a * (1 - (1 - b) * (ph - 0.25) / 0.25);
      if (ph < 0.6) return E0 * a * b * (1 - p * (ph - 0.5) / 0.1);
      return E0 * a * b * (1 - p);
    }
    var lp = k.loop(function(dt){
      var T = 2.4; st.ph += dt / T * (st.E < 0.3 ? 0 : 1);
      var sp = 5 * Math.sqrt(Math.max(0, st.E) / 100); st.ang += dt * sp; st.ang2 += dt * sp;
      if (st.E >= 0.3 && Math.random() < dt * 30 * (1 - e1.value / 100 + 0.02) && st.ph < 0.3) st.puffs.push({x:0, y:0, w:0, t:0, who:0});
      if (st.E >= 0.3 && Math.random() < dt * 30 * (1 - e2.value / 100 + 0.02) && st.ph > 0.25 && st.ph < 0.55) st.puffs.push({x:0, y:0, w:0, t:0, who:1});
      if (st.ph >= 1){ st.ph -= 1; st.E *= q(); st.lap++; }
      st.puffs.forEach(function(p){ p.t += dt; }); st.puffs = st.puffs.filter(function(p){ return p.t < 1.2; });
      k.redraw();
    });
    lp.play();
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Relancer à 100 J", function(){ st.E = 100; st.lap = 0; st.ph = 0; st.puffs = []; k.redraw(); });
    function wheel(cx, cy, r, ang, col){
      var ctx = c.ctx; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
      var g = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r); g.addColorStop(0, "#3a4a66"); g.addColorStop(1, col);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 2.4; ctx.lineCap = "round";
      for (var i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.82 * Math.cos(i * 1.0472), r * 0.82 * Math.sin(i * 1.0472)); ctx.stroke(); }
      ctx.fillStyle = "#e8edf5"; ctx.beginPath(); ctx.arc(0, 0, r * 0.14, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    k.draw(function(){
      var a = e1.value / 100, b = e2.value / 100, p = x.value / 100, qq = q(), ph = PX.phone(c), ctx = c.ctx;
      c.clear(); PX.bg(c, "#eef2f8", "#dde4ee");
      var r = Math.min(c.H * 0.2, (c.W - 60) / 6, 40), xm = c.W * 0.2, xd = c.W * 0.8, ym = c.H * 0.4, yb = c.H * 0.82;
      /* circuit : arbre en haut, fil de retour en bas */
      ctx.lineCap = "round"; S.draw.line(c, xm, ym, xd, ym, "#8a95a3", 7); S.draw.line(c, xm, ym, xm, yb, "#c9d1dc", 4); S.draw.line(c, xm, yb, xd, yb, "#c9d1dc", 4); S.draw.line(c, xd, ym, xd, yb, "#c9d1dc", 4);
      S.draw.line(c, xm + r, ym, xd - r, ym, "#5f6b7a", 2, [2, 6]);
      wheel(xm, ym, r, st.ang, "#1f4b9e");
      /* dynamo : stator + rotor */
      var dw = r * 1.6; ctx.fillStyle = "#1f4b3a"; PX.rr(ctx, xd - dw, ym - r, 2 * dw, 2 * r, 8); ctx.fill(); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "#e0a043"; ctx.lineWidth = 3; for (var i = -2; i <= 2; i++){ ctx.beginPath(); ctx.moveTo(xd - dw + 6, ym + i * r * 0.32); ctx.lineTo(xd + dw - 6, ym + i * r * 0.32); ctx.stroke(); }
      ctx.save(); ctx.translate(xd, ym); ctx.rotate(st.ang2); ctx.fillStyle = "#e8edf5"; ctx.fillRect(-r * 0.7, -4, r * 1.4, 8); ctx.fillStyle = P.red; ctx.fillRect(-r * 0.7, -4, r * 0.35, 8); ctx.restore();
      S.draw.label(c, "Moteur " + S.fmt(a * 100, 0) + " %", xm, ym - r - 14, {color:P.acc, size:PX.fs(c, 11.5)});
      S.draw.label(c, "Dynamo " + S.fmt(b * 100, 0) + " %", xd, ym - r - 14, {color:P.green, size:PX.fs(c, 11.5)});
      /* lampe */
      var lx = xd, ly = yb + 0; ctx.fillStyle = "#13233a"; ctx.fillRect(lx - 4, ly - 6, 8, 6);
      S.draw.glow(c, lx, ly + 12, 12 + 40 * p * Math.sqrt(st.E / 100), "#ffd24a", Math.min(0.9, 0.15 + p * 1.6 * Math.sqrt(st.E / 100)));
      PX.ball(c, lx, ly + 12, 8, p > 0 && st.E > 0.5 ? "#fff3b0" : "#c9d1dc");
      /* chaleur */
      st.puffs.forEach(function(pf){ var bx = pf.who ? xd : xm, f = pf.t / 1.2; ctx.fillStyle = "rgba(192,50,29," + (0.5 * (1 - f)) + ")"; ctx.beginPath(); ctx.arc(bx + Math.sin(pf.t * 9 + pf.who) * 8, ym - r - 4 - f * 26, 4 + f * 4, 0, 6.2832); ctx.fill(); });
      /* paquet d'énergie qui voyage */
      var path = [[xm, ym], [xd, ym], [xd, yb], [xm, yb], [xm, ym]], tot = 0, segs = [], j;
      for (j = 1; j < path.length; j++){ var dd = Math.hypot(path[j][0] - path[j - 1][0], path[j][1] - path[j - 1][1]); segs.push(dd); tot += dd; }
      var s = st.ph * tot, acc = 0, px = xm, py = ym; for (j = 0; j < segs.length; j++){ if (s <= acc + segs[j]){ var f2 = (s - acc) / segs[j]; px = path[j][0] + (path[j + 1][0] - path[j][0]) * f2; py = path[j][1] + (path[j + 1][1] - path[j][1]) * f2; break; } acc += segs[j]; }
      var Ecur = eAt(st.E, st.ph), rr = 4 + 12 * Math.sqrt(Math.max(0, Ecur) / 100);
      S.draw.glow(c, px, py, rr * 2.6, P.yellow, 0.8); PX.ball(c, px, py, rr, "#ffd24a");
      S.draw.label(c, S.fmt(Ecur, 0) + " J", px, py - rr - 12, {color:"#a9741a", size:11.5});
      /* réservoir */
      S.draw.label(c, "tour " + st.lap + " · énergie utile " + S.fmt(st.E, 1) + " J", c.W / 2, 14, {color:st.E < 1 ? P.red : P.ink, size:PX.fs(c, 12)});
      if (st.E < 0.3) S.draw.label(c, "la machine s'arrête", c.W / 2, (ym + yb) / 2, {color:P.red, size:13});
      S.draw.label(c, "retour au moteur : " + S.fmt(100 * qq, 1) + " J pour 100 J", c.W / 2, yb + 18, {color:P.acc, size:PX.fs(c, 11.5)});
      /* graphe */
      g1.clear(); var N = 40, ax = S.draw.axes(g1, {x0:0, x1:N, y0:0, y1:105, xl:"tours", yl:"énergie (J)", stepX:5, stepY:20});
      var g = g1.ctx; g.save(); g.strokeStyle = P.acc; g.lineWidth = 3; g.beginPath(); for (var n = 0; n <= N; n++){ var yy = 100 * Math.pow(qq, n); if (n) g.lineTo(ax.X(n), ax.Y(yy)); else g.moveTo(ax.X(n), ax.Y(yy)); } g.stroke(); g.restore();
      S.draw.line(g1, ax.X(0), ax.Y(100), ax.X(N), ax.Y(100), P.green, 1.5, [6, 4]); S.draw.label(g1, "« perpétuel » = 100 J à chaque tour", ax.X(N) - 4, ax.Y(100) + 14, {color:P.green, align:"right", size:11});
      var lapX = Math.min(N, st.lap + st.ph); S.draw.dot(g1, ax.X(lapX), ax.Y(Math.max(0, Math.min(105, eAt(st.E, st.ph)))), 6, P.red);
      var n50 = Math.log(0.5) / Math.log(qq), n1 = Math.log(0.01) / Math.log(qq);
      ro.set(0, S.fmt(100 * qq, 1) + " J"); ro.set(1, S.fmt(100 * Math.pow(qq, 10), 1) + " J"); ro.set(2, S.fmt(Math.ceil(n50), 0) + " tours"); ro.set(3, S.fmt(Math.ceil(n1), 0) + " tours");
      nt.set("Facteur par tour : " + S.fmt(a, 2) + " × " + S.fmt(b, 2) + (p > 0 ? " × " + S.fmt(1 - p, 2) : "") + " = " + S.fmt(qq, 3) + " < 1. Pour tourner indéfiniment, il faudrait un facteur ≥ 1 : impossible, car chaque rendement est inférieur à 1.", "warn");
    });
  }
});
})();
