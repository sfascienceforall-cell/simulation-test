/* Chimie 4e · chapitre 4 · Gaz */
SFA.sim({
  id:"c4-c04-piston", ch:"c04", tag:"Animation",
  titre:"Le piston : p, V, T et n",
  resume:"Un gaz dans un cylindre : fais varier V, T et n et regarde la pression et l'agitation des molécules.",
  but:"Modifie le volume, la température et la quantité de gaz. La pression se calcule avec p·V = n·R·T ; la courbe en bas est l'isotherme.",
  aRetenir:"p·V = n·R·T avec T en kelvins (T = θ + 273). À T et n constants, p·V est constant (Boyle) : diviser V par 2 double p.",
  piege:"Dans p·V = n·R·T, la température doit être en kelvins. À 0 °C la température n'est pas nulle : T = 273 K.",
  build:function(k, S){
    var c = k.canvas(190), g = k.canvas(230), R = 8.31;
    var V = k.slider("Volume V", 0.3, 3, 0.1, 1.5, "L");
    var T = k.slider("Température θ", -20, 200, 5, 20, "°C");
    var n = k.slider("Quantité de gaz n", 0.01, 0.10, 0.01, 0.05, "mol");
    var ro = k.readouts(["T absolue", "Pression p", "p·V"]);
    var nt = k.note("", "");
    var rnd = C4.rnd(11), P = [];
    for (var i = 0; i < 100; i++) P.push({x:rnd(), y:rnd(), a:rnd() * 6.28});
    var lp = k.loop(function(dt){
      var sp = 0.35 * Math.sqrt((T.value + 273) / 293), cnt = Math.round(n.value * 1000);
      for (var i = 0; i < cnt; i++){ var q = P[i]; q.x += Math.cos(q.a) * sp * dt; q.y += Math.sin(q.a) * sp * dt * 1.6;
        if (q.x < 0){ q.x = 0; q.a = Math.PI - q.a; } if (q.x > 1){ q.x = 1; q.a = Math.PI - q.a; } if (q.y < 0){ q.y = 0; q.a = -q.a; } if (q.y > 1){ q.y = 1; q.a = -q.a; } }
      k.redraw();
    });
    lp.play();
    function pres(v, Tc, nn){ return nn * R * (Tc + 273) / (v / 1000); }
    k.draw(function(){
      var v = V.value, Tk = T.value + 273, p = pres(v, T.value, n.value);
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, bw = W - 70, pw = (v / 3) * bw;
      ctx.fillStyle = "#f6f9fc"; ctx.fillRect(20, 20, pw, 130); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.strokeRect(20, 20, bw, 130);
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(20 + pw, 14, 12, 142); ctx.fillRect(32 + pw, 80, Math.max(0, Math.min(40, W - 60 - pw - 12)), 6);
      var cnt = Math.round(n.value * 1000);
      for (var i = 0; i < cnt; i++){ var q = P[i]; S.draw.dot(c, 24 + q.x * (pw - 8), 24 + q.y * 122, 3.2, "#1f4b9e"); }
      C4.label(c, "V = " + S.fmt(v, 1) + " L", 20 + pw / 2, 170, "#2c3a4e", 13);
      var gx = S.draw.axes(g, {x0:0, x1:3, y0:0, y1:Math.max(1, pres(0.3, T.value, n.value) * 1.1 / 1000), xl:"V (L)", yl:"p (kPa)", l:48});
      g.clear(); gx = S.draw.axes(g, {x0:0, x1:3, y0:0, y1:Math.max(1, pres(0.3, T.value, n.value) * 1.1 / 1000), xl:"V (L)", yl:"p (kPa)", l:48});
      S.draw.fn(g, gx, function(x){ return x < 0.3 ? NaN : pres(x, T.value, n.value) / 1000; }, "#1f4b9e", 3);
      S.draw.fn(g, gx, function(x){ return x < 0.3 ? NaN : pres(x, 20, n.value) / 1000; }, "#b8c0cc", 1.5, [5, 4]);
      S.draw.dot(g, gx.X(v), gx.Y(p / 1000), 7, "#c0321d");
      C4.label(g, "trait gris : isotherme à 20 °C", g.W - 12, gx.T + 24, "#5f6b7a", 11, "right");
      ro.set(0, Tk + " K"); ro.set(1, S.fmt(p / 1000, 1) + " kPa"); ro.set(2, S.fmt(p * v / 1000, 1) + " J");
      nt.set(p > 1000000 ? "Au-delà de 1 000 kPa le modèle du gaz parfait devient peu fiable." : "1 atm = 101,3 kPa. Ici p = " + S.fmt(p / 101300, 2) + " atm.", p > 1000000 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c04-azote", ch:"c04", tag:"Original",
  titre:"Un ballon dans l'azote liquide",
  resume:"À pression constante, le volume d'un gaz est proportionnel à sa température absolue : Charles.",
  but:"Refroidis ou chauffe le ballon (curseur, ou glisse le point rouge sur la courbe). Compare la formule correcte (en kelvins) avec l'erreur classique (en °C).",
  aRetenir:"À p et n constants : V / T = constante, avec T en kelvins. La droite V(θ) coupe l'axe V = 0 en θ = −273 °C : le zéro absolu.",
  piege:"Utiliser des °C dans V₂ = V₁·T₂/T₁ donne n'importe quoi : à 0 °C on trouverait un volume nul, à −50 °C un volume négatif.",
  build:function(k, S){
    var c = k.canvas(220), g = k.canvas(250), V0 = 2.0, P = S.draw.palette;
    var th = k.slider("Température θ", -190, 100, 5, 20, "°C");
    var md = k.seg("Formule utilisée", [["K","Kelvins (correct)"],["C","°C (erreur)"]], "K");
    var ro = k.readouts(["T", "Volume V", "V / V₀"]);
    var nt = k.note("", "");
    var rd = C4.rnd(8), Q = []; for (var i = 0; i < 26; i++) Q.push({x:rd(), y:rd(), a:rd() * 6.28});
    var st = {ax:null};
    var lp = k.loop(function(dt){ var sp = .5 * Math.sqrt(Math.max(.2, (th.value + 273) / 293)); Q.forEach(function(q){ q.a += (Math.random() - .5) * 2; q.x += Math.cos(q.a) * sp * dt; q.y += Math.sin(q.a) * sp * dt; if (q.x < .08 || q.x > .92){ q.a = Math.PI - q.a; q.x = Math.max(.08, Math.min(.92, q.x)); } if (q.y < .08 || q.y > .92){ q.a = -q.a; q.y = Math.max(.08, Math.min(.92, q.y)); } }); k.redraw(); });
    lp.play();
    g.pointer(function(type, p){ if ((type === "down" || type === "drag") && st.ax){ th.set(Math.max(-190, Math.min(100, Math.round(st.ax.ix(p.x) / 5) * 5))); k.redraw(); } });
    k.draw(function(){
      var tc = th.value, Tk = tc + 273, V = V0 * Tk / 293, Vw = V0 * tc / 20, use = md.value === "K" ? V : Vw, W = c.W, ctx = c.ctx;
      c.clear(); C4.bg(c); g.clear();
      C4.bg(c, 196);
      var cx = W * 0.4, cy = 96, r = Math.min(88, 64 * Math.cbrt(Math.max(use, 0) / V0));
      var cold = Math.max(0, Math.min(1, (20 - tc) / 210)), hot = Math.max(0, Math.min(1, (tc - 20) / 80));
      var fill = md.value === "C" ? P.red : (cold > hot ? P.blue : P.orange);
      /* bain froid */
      if (tc < -100){ ctx.save(); S.draw.rrect(c, cx - 78, 168, 156, 40, 8); ctx.fillStyle = "rgba(120,190,240,.45)"; ctx.fill(); ctx.strokeStyle = "#7aa7c7"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); C4.t(c, "N₂ liquide −196 °C", cx, 190, {size:12, color:"#1c5f8f"}); for (var b = 0; b < 5; b++) S.draw.dot(c, cx - 50 + b * 25, 160 - ((Date.now() / 40 + b * 17) % 40), 2.6, "rgba(160,200,230,.9)"); }
      if (use > 0.001){
        ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.0, r * 1.1, 0, 0, 7); var gr = ctx.createRadialGradient(cx - r * .3, cy - r * .4, r * .1, cx, cy, r * 1.1); gr.addColorStop(0, S.draw.tint(fill, .2)); gr.addColorStop(1, S.draw.tint(fill, .45)); ctx.fillStyle = gr; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = fill; ctx.stroke();
        ctx.clip(); Q.forEach(function(q){ S.draw.dot(c, cx - r + q.x * 2 * r, cy - r * 1.1 + q.y * 2.2 * r, 2.6, S.draw.tint(fill, .85)); }); ctx.restore();
        S.draw.line(c, cx, cy + r * 1.1, cx, cy + r * 1.1 + 12, "#8a95a3", 2);
        S.draw.label(c, S.fmt(use, 2) + " L", cx, cy, {size:14, color:fill});
      } else { S.draw.label(c, "volume nul ou négatif : absurde", cx, cy, {color:P.red, size:13}); }
      /* thermomètre */
      var tx = W * 0.82, ty0 = 24, ty1 = 176, f = (tc + 200) / 300;
      S.draw.rrect(c, tx - 6, ty0, 12, ty1 - ty0, 6); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = cold > hot ? P.blue : P.red; S.draw.rrect(c, tx - 3.5, ty1 - (ty1 - ty0) * f, 7, (ty1 - ty0) * f, 3); ctx.fill();
      S.draw.dot(c, tx, ty1 + 6, 9, cold > hot ? P.blue : P.red);
      C4.t(c, S.fmt(tc, 0) + " °C", tx, 12, {size:12.5, color:P.ink}); C4.t(c, S.fmt(Tk, 0) + " K", tx, ty1 + 26, {size:12.5, color:P.acc});
      if (tc < -183 && md.value === "K") C4.t(c, "O₂ liquide sous −183 °C : modèle limite", cx, 22, {size:12, color:P.amber});
      /* graphique */
      var ax = S.draw.axes(g, {x0:-300, x1:120, y0:0, y1:3, xl:"θ (°C)", yl:"V (L)", stepX:50, l:40}); st.ax = ax;
      S.draw.area(g, ax, function(x){ return V0 * (x + 273) / 293; }, -273, 120, P.acc, .07);
      S.draw.fn(g, ax, function(x){ return V0 * (x + 273) / 293; }, P.acc, 3);
      if (md.value === "C") S.draw.fn(g, ax, function(x){ return V0 * x / 20; }, P.red, 2, [6, 4]);
      S.draw.dot(g, ax.X(-273), ax.Y(0), 5, P.green); S.draw.label(g, "zéro absolu −273 °C", ax.X(-273) + 8, ax.Y(0) - 16, {color:P.green, align:"left", size:12});
      S.draw.dot(g, ax.X(-196), ax.Y(V0 * 77 / 293), 4, P.blue);
      S.draw.dot(g, ax.X(tc), ax.Y(Math.max(0, Math.min(3, use))), 8, md.value === "K" ? P.acc : P.red);
      C4.t(g, "↔ glisse le point", ax.X(55), ax.Y(0.45), {size:11.5, color:P.grey, weight:600});
      ro.set(0, Tk + " K"); ro.set(1, use > 0 ? S.fmt(use, 2) + " L" : "impossible"); ro.set(2, S.fmt(use / V0, 2));
      if (md.value === "C") nt.set("Avec les °C, la formule ne vaut rien : seul le résultat en kelvins correspond à l'expérience (V = " + S.fmt(V, 2) + " L).", "warn");
      else nt.set(tc < -183 ? "Sous −183 °C le dioxygène de l'air se liquéfie : le modèle du gaz parfait ne s'applique plus (le vrai ballon rétrécit encore davantage)." : "Ballon de " + V0 + " L à 20 °C, pression constante : V = V₀·T/293.", tc < -183 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c04-hydrogene", ch:"c04", tag:"Expérience",
  titre:"Mesurer le volume d'hydrogène dégagé",
  resume:"Du magnésium dans de l'acide chlorhydrique libère du dihydrogène : prédis le volume avant de le mesurer.",
  but:"Choisis la masse de magnésium, le volume d'acide (1,0 mol/L) et la température. Lance la réaction et lis le volume sur l'éprouvette.",
  aRetenir:"Mg + 2 HCl → MgCl₂ + H₂. n(H₂) = n(Mg) si l'acide est en excès, puis V = n · V_m. Si l'acide manque, c'est lui qui limite : n(H₂) = n(HCl)/2.",
  piege:"Plus de magnésium ne donne pas plus de gaz si l'acide est épuisé : le volume plafonne.",
  build:function(k, S){
    var c = k.canvas(320);
    var m = k.slider("Masse de Mg", 0.05, 0.40, 0.01, 0.20, "g");
    var Va = k.slider("Acide HCl (1,0 mol/L)", 5, 50, 1, 30, "mL");
    var T = k.slider("Température", 10, 30, 1, 20, "°C");
    var ro = k.readouts(["n(Mg)", "n(HCl)", "n(H₂)", "V(H₂)"]);
    var nt = k.note("", "");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) lp.pause(); k.redraw(); });
    [m, Va, T].forEach(function(s){ s.el.addEventListener("input", function(){ st.p = 1; }); });
    k.button("▶ Lancer la réaction", function(){ st.p = 0; lp.play(); }, true);
    k.draw(function(){
      var nMg = m.value / 24, nH = Va.value / 1000 * 1.0, xi = Math.min(nMg, nH / 2), Vm = 24 * (T.value + 273) / 293;
      var Vfin = xi * Vm * 1000, Vnow = Vfin * st.p;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, tx = W * 0.62, tw = 60, top = 20, hh = 270, scale = hh / 500;
      /* éprouvette renversée dans la cuve */
      ctx.fillStyle = "rgba(60,150,200,.25)"; ctx.fillRect(10, 200, W - 20, 100);
      ctx.fillStyle = "rgba(60,150,200,.35)"; ctx.fillRect(tx - tw / 2 + 2, top + 4 + Vnow * scale, tw - 4, hh - Vnow * scale - 4);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx - tw / 2, top + hh); ctx.lineTo(tx - tw / 2, top); ctx.lineTo(tx + tw / 2, top); ctx.lineTo(tx + tw / 2, top + hh); ctx.stroke();
      for (var v = 0; v <= 500; v += 100){ var yy = top + 4 + v * scale; S.draw.line(c, tx + tw / 2, yy, tx + tw / 2 + 8, yy, "#5f6b7a", 1.5); C4.label(c, v + " mL", tx + tw / 2 + 12, yy, "#5f6b7a", 11, "left"); }
      S.draw.line(c, tx - tw / 2 - 8, top + 4 + Vnow * scale, tx + tw / 2, top + 4 + Vnow * scale, "#c0321d", 2);
      C4.label(c, "gaz H₂ recueilli", tx - tw / 2 - 12, top + 4 + Vnow * scale / 2, "#2c3a4e", 12, "right");
      /* erlenmeyer */
      var fx = W * 0.17; ctx.fillStyle = "rgba(244,197,66,.25)"; ctx.beginPath(); ctx.moveTo(fx - 12, 215); ctx.lineTo(fx + 12, 215); ctx.lineTo(fx + 34, 290); ctx.lineTo(fx - 34, 290); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#5f6b7a"; ctx.stroke();
      ctx.fillStyle = "#6c7d90"; var ml = 8 + m.value * 60; ctx.fillRect(fx - ml / 2, 272, ml, 6);
      if (st.p < 1) for (var b = 0; b < 6; b++) S.draw.dot(c, fx - 18 + b * 7, 265 - ((st.p * 200 + b * 17) % 50), 2.5, "rgba(255,255,255,.9)");
      S.draw.line(c, fx + 8, 215, fx + 8, 190, "#5f6b7a", 2); S.draw.line(c, fx + 8, 190, tx - 8, 190, "#5f6b7a", 2); S.draw.line(c, tx - 8, 190, tx - 8, top + hh + 16, "#5f6b7a", 2);
      C4.label(c, "Mg + HCl", fx, 305, "#2c3a4e", 12);
      ro.set(0, S.fmt(nMg * 1000, 2) + " mmol"); ro.set(1, S.fmt(nH * 1000, 1) + " mmol"); ro.set(2, S.fmt(xi * 1000, 2) + " mmol"); ro.set(3, S.fmt(Vfin, 0) + " mL");
      nt.set(nMg <= nH / 2 ? "Le magnésium est limitant : tout le Mg disparaît, l'acide est en excès." : "L'acide est limitant : il reste du magnésium. Le volume de H₂ ne dépend plus de la masse de Mg.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c04-airbag", ch:"c04", tag:"Défi",
  titre:"Airbag : combien d'azoture de sodium ?",
  resume:"2 NaN₃ → 2 Na + 3 N₂ : choisis la masse d'azoture pour que le sac gonfle exactement au volume visé, ni trop, ni trop peu.",
  but:"Règle la masse de NaN₃ et la température du gaz, puis déclenche l'airbag. Le sac doit remplir l'espace entre le volant et le mannequin (cible ± 3 L). Relève des défis à cible aléatoire.",
  aRetenir:"n(N₂) = 1,5 × n(NaN₃) ; puis V = n(N₂) · V_m. Le coefficient 3/2 vient de l'équation 2 NaN₃ → 2 Na + 3 N₂.",
  piege:"Le rapport 3/2 s'applique aux quantités de matière, pas aux masses : 1 g de NaN₃ ne donne pas 1,5 g de N₂. Modèle simplifié : un airbag réel contient d'autres réactifs pour neutraliser le sodium formé.",
  build:function(k, S){
    var c = k.canvas(350), P = S.draw.palette;
    var m = k.slider("Masse de NaN₃", 20, 150, 1, 70, "g");
    var T = k.slider("Température du gaz", 20, 100, 5, 20, "°C");
    var ro = k.readouts(["n(NaN₃)", "n(N₂)", "V(N₂)", "Masse de Na formé"]);
    var nt = k.note("", "");
    var st = {goal:60, defi:false, score:0, tries:0, scored:false}, an = C4.anim(k, 1.1);
    var rd = C4.rnd(3), J = []; for (var i = 0; i < 70; i++) J.push({x:rd(), y:rd(), a:rd() * 6.28});
    var jig = k.loop(function(dt){ J.forEach(function(q){ q.a += (Math.random() - .5) * 2.4; q.x += Math.cos(q.a) * dt * .35; q.y += Math.sin(q.a) * dt * .35; q.x = Math.max(.05, Math.min(.95, q.x)); q.y = Math.max(.05, Math.min(.95, q.y)); }); k.redraw(); });
    jig.play();
    [m.el, T.el].forEach(function(e){ e.addEventListener("input", function(){ an.stop(); st.scored = false; }); });
    k.button("▶ Déclencher l'airbag", function(){ an.go(); st.scored = false; }, true);
    k.button("🎯 Nouveau défi (cible aléatoire)", function(){ st.goal = 40 + 5 * Math.floor(Math.random() * 9); st.defi = true; st.tries++; an.stop(); st.scored = false; });
    k.button("Cible libre : 60 L", function(){ st.goal = 60; st.defi = false; });
    k.draw(function(){
      var nA = m.value / 65, nN = 1.5 * nA, Vm = 24 * (T.value + 273) / 293, V = nN * Vm, W = c.W, ctx = c.ctx, p = C4.ease(an.p);
      var Vn = V * (an.p < 1 ? Math.min(1.08, p * 1.08 - Math.sin(an.p * 3.14) * .02) : 1);
      C4.bg(c, 318);
      var hx = 34, hy = 196, rt = Math.min(92, (W - 120) / 2.15), sc = rt / Math.cbrt(3 * st.goal / (4 * Math.PI)), r = Math.cbrt(3 * Vn / (4 * Math.PI)) * sc;
      var headX = hx + 2 * rt + 22, d = V - st.goal, ok = Math.abs(d) <= 3;
      /* tableau de bord et volant */
      ctx.fillStyle = "#d6dde6"; ctx.fillRect(0, 232, 22, 90); S.draw.line(c, 8, 232, 8, 318, "#aab4c1", 3);
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#44546a"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(18, hy - 52); ctx.lineTo(24, hy - 52 + 4); ctx.lineTo(24, hy + 52); ctx.lineTo(18, hy + 56); ctx.stroke(); ctx.restore();
      /* mannequin */
      ctx.fillStyle = "#c7cfda"; S.draw.rrect(c, headX - 26, hy + 34, 52, 90, 12); ctx.fill();
      ctx.fillStyle = "#e6c9a8"; ctx.beginPath(); ctx.arc(headX, hy - 6, 24, 0, 7); ctx.fill(); ctx.strokeStyle = "#a88c6a"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#44546a"; ctx.beginPath(); ctx.arc(headX - 8, hy - 11, 2.6, 0, 7); ctx.fill();
      ctx.fillRect(headX - 10, hy + 28, 20, 14);
      /* cible */
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = P.green; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx + rt, hy, rt, 0, 7); ctx.stroke(); ctx.restore();
      S.draw.label(c, "cible : " + st.goal + " L", hx + rt, hy - rt - 14, {color:P.green, size:12.5});
      /* sac */
      if (r > 2){
        var col = Vn > st.goal + 3.5 ? P.red : (Math.abs(Vn - st.goal) <= 3 ? P.green : P.acc);
        ctx.save(); ctx.beginPath(); ctx.arc(hx + r, hy, r, 0, 7); var g = ctx.createRadialGradient(hx + r * .75, hy - r * .3, r * .1, hx + r, hy, r); g.addColorStop(0, S.draw.tint(col, .22)); g.addColorStop(1, S.draw.tint(col, .42)); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
        ctx.clip(); var nd = Math.round(Math.min(1, nN / 3.5) * 60);
        for (var i = 0; i < nd; i++) S.draw.dot(c, hx + (J[i].x * 2 * r), hy - r + J[i].y * 2 * r, 2.8, "rgba(31,75,158,.8)");
        ctx.restore();
        S.draw.text(c, S.fmt(Vn, 0) + " L", hx + r, hy + 3, {size:Math.min(22, Math.max(14, r * .4)), color:col});
      }
      S.draw.display(c, S.fmt(V, 1) + " L", W - 66, 46, {w:112, h:50, caption:"V(N₂) FORMÉ"});
      /* thermomètre simple */
      C4.t(c, "gaz à " + T.value + " °C", W - 66, 88, {size:12, color:P.grey, weight:700});
      if (an.p >= 1 && !st.scored && st.defi && ok){ st.scored = true; st.score++; }
      ro.set(0, S.fmt(nA, 2) + " mol"); ro.set(1, S.fmt(nN, 2) + " mol"); ro.set(2, S.fmt(V, 1) + " L"); ro.set(3, S.fmt(nA * 23, 1) + " g");
      nt.set(ok ? "✅ Objectif atteint : " + S.fmt(V, 1) + " L pour une cible de " + st.goal + " L." + (st.defi ? " Défis réussis : " + st.score + "." : "") : d < 0 ? "Sac insuffisamment gonflé : il manque " + S.fmt(-d, 1) + " L, la tête du mannequin touchera le volant. Augmente la masse." : "Trop de gaz : " + S.fmt(d, 1) + " L en trop, le sac claque contre le mannequin. Réduis la masse.", ok ? "ok" : "warn");
    });
  }
});
