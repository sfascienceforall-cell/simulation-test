/* Biologie 4e · chapitre 6 · Respiration cellulaire et fermentation */
SFA.sim({
  id:"b4-c06-bilan", ch:"c06", tag:"Classique · bilan",
  titre:"Respiration ou fermentation : le bilan en ATP",
  resume:"Un même glucose rapporte ≈ 30 ATP avec dioxygène, 2 ATP sans : règle l'oxygène et compare.",
  but:"Choisis le nombre de glucoses, la part qui peut être respirée (oxygène disponible) et le type de fermentation. Lis ATP, CO₂, O₂ et rendement.",
  aRetenir:"La glycolyse (cytoplasme) donne toujours 2 ATP nets par glucose. Avec dioxygène, les mitochondries poursuivent (Krebs, chaîne respiratoire) : ≈ 30 ATP au total et 6 CO₂ + 6 H₂O. Sans dioxygène, le pyruvate subit une fermentation (lactique ou alcoolique) : seulement 2 ATP, et l'énergie reste dans le lactate ou l'éthanol.",
  piege:"Les manuels comptent souvent 36 ou 38 ATP (anciens comptages) ; les mesures actuelles donnent ≈ 30 à 32 : on utilise 30. Rendement = énergie des ATP (≈ 30,5 kJ/mol) ÷ énergie du glucose (≈ 2 870 kJ/mol).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.2});
    var n = k.slider("Glucose consommé", 1, 10, 1, 1, "molécules");
    var f = k.slider("Part respirée (dioxygène disponible)", 0, 100, 5, 100, "%");
    var fe = k.seg("Fermentation de la part restante", [["l","Lactique"],["a","Alcoolique"]], "l");
    var ro = k.readouts(["ATP produits", "CO₂ libéré", "O₂ consommé", "Rendement énergétique"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, ff = f.value / 100, N = n.value, resp = N * ff, ferm = N * (1 - ff);
      var atpG = 2 * N, atpR = 28 * resp, atp = atpG + atpR;
      var co2 = 6 * resp + (fe.value === "a" ? 2 * ferm : 0), o2 = 6 * resp;
      var eff = atp * 30.5 / (N * 2870) * 100;
      var bw = (W - 40) / 3;
      function box(x, y, w, h, t1, t2, col){ B4.rr(c, x, y, w, h, 8, col, "#13233a", 1.5); B4.txt(c, t1, x + w / 2, y + 16, B4.pal.ink, 12); if (t2) B4.txt(c, t2, x + w / 2, y + 34, B4.pal.ink, 12); }
      box(W / 2 - 55, 8, 110, 42, "Glucose", S.fmt(N, 0) + " (C₆H₁₂O₆)", "rgba(254,243,199,.8)");
      S.draw.arrow(c, W / 2, 50, W / 2, 70, B4.pal.ink, 2.5);
      box(W / 2 - 110, 72, 220, 44, "Glycolyse (cytoplasme)", "+ " + S.fmt(atpG, 0) + " ATP · " + S.fmt(2 * N, 0) + " pyruvates", "rgba(219,234,254,.8)");
      S.draw.arrow(c, W * 0.3, 116, W * 0.2, 140, B4.pal.green, 2.5); S.draw.arrow(c, W * 0.7, 116, W * 0.8, 140, B4.pal.red, 2.5);
      B4.txt(c, "avec O₂ (" + S.fmt(f.value, 0) + " %)", W * 0.17, 132, B4.pal.green, 11); B4.txt(c, "sans O₂ (" + S.fmt(100 - f.value, 0) + " %)", W * 0.83, 132, B4.pal.red, 11);
      box(8, 142, W * 0.46, 76, "Mitochondrie", "+ " + S.fmt(atpR, 0) + " ATP", "rgba(220,252,231,.8)"); B4.txt(c, S.fmt(6 * resp, 0) + " CO₂ · " + S.fmt(6 * resp, 0) + " O₂ consommé", 8 + W * 0.23, 196, B4.pal.ink, 11);
      box(W * 0.52, 142, W * 0.46 - 8, 76, fe.value === "l" ? "Lactate" : "Éthanol + CO₂", "+ 0 ATP", "rgba(254,226,226,.8)"); B4.txt(c, fe.value === "l" ? S.fmt(2 * ferm, 0) + " lactates" : S.fmt(2 * ferm, 0) + " éthanols, " + S.fmt(2 * ferm, 0) + " CO₂", W * 0.52 + (W * 0.46 - 8) / 2, 196, B4.pal.ink, 11);
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:N * 32, xl:"part respirée (%)", yl:"ATP", stepX:25, stepY:N * 10, t:244, b:30, l:44});
      S.draw.fn(c, ax, function(x){ return N * (2 + 28 * x / 100); }, B4.pal.acc, 2.6);
      S.draw.dot(c, ax.X(f.value), ax.Y(atp), 7, B4.pal.red);
      ro.set(0, S.fmt(atp, 0) + " ATP"); ro.set(1, S.fmt(co2, 0)); ro.set(2, S.fmt(o2, 0)); ro.set(3, S.fmt(eff, 0) + " %");
      nt.set(f.value === 0 ? "Fermentation seule : 2 ATP par glucose (≈ 2 % de l'énergie récupérée). Il faut consommer beaucoup plus de glucose pour la même énergie." : f.value === 100 ? "Respiration complète : ≈ 30 ATP par glucose (≈ 32 % de l'énergie du glucose dans l'ATP), le reste part en chaleur." : "Régime mixte : " + S.fmt(resp, 1) + " glucose respiré(s), " + S.fmt(ferm, 1) + " fermenté(s). Même glucose, bilan bien meilleur quand le dioxygène est disponible.", f.value === 100 ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"b4-c06-levures", ch:"c06", tag:"Pain et bière · animation",
  titre:"Levures : sucre, température et bulles de CO₂",
  resume:"Une pâte ou un moût en fermentation : suis le sucre, l'éthanol et le CO₂ dégagé au cours du temps.",
  but:"Choisis la quantité de sucre, la température et la présence d'O₂, puis lance. Compare avec l'équation C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.",
  aRetenir:"En l'absence de dioxygène, les levures font une fermentation alcoolique : glucose → 2 éthanol + 2 CO₂ (+ 2 ATP). Les bulles de CO₂ font lever la pâte ; l'éthanol fait la bière. Par gramme de glucose : 0,51 g d'éthanol et 0,49 g de CO₂. La vitesse dépend de la température, avec un optimum vers 35 °C ; au-delà de ≈ 55 °C les levures meurent.",
  piege:"Avec du dioxygène, les levures respirent : plus de CO₂ par sucre (6 par glucose), mais pas d'éthanol. Modèle simplifié : même vitesse de consommation du sucre dans les deux cas, 1 s de simulation = 5 min.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.0});
    var g = k.slider("Sucre au départ", 2, 40, 2, 20, "g");
    var T = k.slider("Température", 0, 60, 1, 30, "°C");
    var ox = k.toggle("Dioxygène présent (récipient ouvert, agité)", false, function(){ rst(); lp.play(); });
    var ro = k.readouts(["Sucre restant", "Éthanol formé", "CO₂ dégagé", "Temps écoulé"]);
    var nt = k.note("", "");
    var st = {t:0, G:g.value, h:[], bub:[]}, geo = {};
    function fT(t){ if (t > 55) return 0; return t < 35 ? Math.exp(-Math.pow((t - 35) / 15, 2)) : Math.exp(-Math.pow((t - 35) / 8, 2)); }
    function rst(){ st.t = 0; st.G = g.value; st.h = [[0, g.value, 0, 0]]; st.cum = 0; }
    g.el.addEventListener("input", rst);
    var lp = k.loop(function(dt){
      var h = dt * 5;       /* min */
      for (var s = 0; s < 5; s++){ var hh = h / 5, d = Math.min(st.G, 1.2 * fT(T.value) * st.G / (st.G + 3) * hh); st.G -= d; st.cum += d; }
      st.t += h;
      if (!st.last || st.t - st.last >= 2){ st.last = st.t; var ge = st.cum, e = ox.value ? 0 : ge * 0.511, co = ge * (ox.value ? 264 / 180 : 88 / 180); st.h.push([st.t, st.G, e, co]); }
      if (Math.random() < Math.min(0.9, d * 6 + 0.02) && d > 1e-6) st.bub.push({x:0.2 + Math.random() * 0.6, y:1, v:0.3 + Math.random() * 0.4});
      st.bub.forEach(function(b){ b.y -= b.v * dt; }); st.bub = st.bub.filter(function(b){ return b.y > 0.05; });
      if (st.t >= 180) lp.pause(); k.redraw();
    });
    rst(); lp.play();
    k.button("↺ Recommencer", function(){ rst(); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    c.pointer(function(type, p){ if (type === "move" || !geo.th) return; if (type === "down" && Math.abs(p.x - geo.th[0]) > 26) return; T.set(Math.max(0, Math.min(60, Math.round((geo.th[2] - p.y) / (geo.th[2] - geo.th[1]) * 60)))); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, fh = H * 0.33;
      /* flacon : levures, bulles, mousse qui monte ; thermomètre à glisser ; sucre restant */
      var ge = st.cum || 0, eth = ox.value ? 0 : ge * 0.511, co2g = ge * (ox.value ? 264 / 180 : 88 / 180), vol = co2g / 44 * 0.082057 * (273.15 + T.value) * 1000;
      var P = S.draw.palette, jx = W * 0.28, jw = Math.min(130, W * 0.34), jy = 12, jh = fh, rise = 1 - Math.exp(-vol / 1500), liq = jh * 0.5, foam = jh * 0.32 * rise, top = jy + jh - liq - foam;
      ctx.save(); ctx.beginPath(); ctx.moveTo(jx - jw / 2, jy); ctx.lineTo(jx - jw / 2, jy + jh - 10); ctx.quadraticCurveTo(jx - jw / 2, jy + jh, jx - jw / 2 + 10, jy + jh); ctx.lineTo(jx + jw / 2 - 10, jy + jh); ctx.quadraticCurveTo(jx + jw / 2, jy + jh, jx + jw / 2, jy + jh - 10); ctx.lineTo(jx + jw / 2, jy); ctx.clip();
      var lg = ctx.createLinearGradient(0, jy + jh - liq, 0, jy + jh); lg.addColorStop(0, "#f6d77a"); lg.addColorStop(1, "#e6a93a"); ctx.fillStyle = lg; ctx.fillRect(jx - jw / 2, jy + jh - liq, jw, liq);
      ctx.fillStyle = "#fff8e3"; ctx.fillRect(jx - jw / 2, top, jw, foam + 2);
      for (var q = 0; q < 16; q++){ var yy = jy + jh - liq - foam * (0.15 + (q * 0.37 % 1)) ; ctx.beginPath(); ctx.arc(jx - jw / 2 + 8 + ((q * 53) % (jw - 16)), yy, 2 + (q % 3), 0, 6.3); ctx.strokeStyle = "rgba(180,120,40,.45)"; ctx.lineWidth = 1; ctx.stroke(); }
      var act = Math.min(1, fT(T.value) * (st.G > 0.05 ? 1 : 0));
      for (q = 0; q < 14; q++){ var yx = jx - jw / 2 + 10 + ((q * 37) % (jw - 20)), yv = jy + jh - liq + 10 + ((q * 29) % Math.max(10, liq - 22)) + Math.sin(st.t * 0.4 + q) * 3; ctx.beginPath(); ctx.ellipse(yx, yv, 5.5, 4.5, 0.4 * q, 0, 6.3); ctx.fillStyle = T.value > 55 ? "#b6a99a" : "#e9d1a5"; ctx.fill(); ctx.strokeStyle = "#8a6a2f"; ctx.lineWidth = 1; ctx.stroke(); if (q % 3 === 0 && act > 0.2){ ctx.beginPath(); ctx.arc(yx + 5, yv - 4, 2.4, 0, 6.3); ctx.fillStyle = "#e9d1a5"; ctx.fill(); ctx.stroke(); } }
      st.bub.forEach(function(b){ var bx = jx - jw / 2 + 6 + b.x * (jw - 12), by = jy + jh - 8 - (1 - b.y) * (liq + foam - 10); if (by < top) return; ctx.beginPath(); ctx.arc(bx, by, 3, 0, 6.3); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill(); ctx.strokeStyle = "#8a6a2f"; ctx.lineWidth = 1; ctx.stroke(); });
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(jx - jw / 2, jy); ctx.lineTo(jx - jw / 2, jy + jh - 10); ctx.quadraticCurveTo(jx - jw / 2, jy + jh, jx - jw / 2 + 10, jy + jh); ctx.lineTo(jx + jw / 2 - 10, jy + jh); ctx.quadraticCurveTo(jx + jw / 2, jy + jh, jx + jw / 2, jy + jh - 10); ctx.lineTo(jx + jw / 2, jy); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2.5; ctx.stroke();
      S.draw.text(c, "levures + sucre", jx, jy + jh + 12, {size:11, color:P.ink});
      /* thermomètre */
      var tx = W * 0.58, th0 = jy + 6, th1 = jy + jh - 14; S.draw.rrect(c, tx - 7, th0, 14, th1 - th0, 7); ctx.fillStyle = "#eef1f5"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; ctx.stroke();
      var tf = T.value / 60, tc = T.value > 55 ? P.red : T.value > 40 ? P.orange : T.value < 10 ? P.blue : P.green; S.draw.rrect(c, tx - 4, th1 - (th1 - th0) * tf, 8, (th1 - th0) * tf + 6, 4); ctx.fillStyle = tc; ctx.fill(); S.draw.dot(c, tx, th1 + 8, 8, tc);
      S.draw.dot(c, tx, th1 - (th1 - th0) * tf, 6, "#fff"); S.draw.text(c, S.fmt(T.value, 0) + " °C", tx + 14, th1 - (th1 - th0) * tf, {size:11, color:tc, align:"left"}); S.draw.text(c, "glisse", tx, th1 + 24, {size:9, color:"#5f6b7a"}); geo.th = [tx, th0, th1];
      /* sucre restant */
      var sx = W * 0.8, nsug = Math.round(st.G / 2); S.draw.text(c, "sucre", sx, jy + 6, {size:10.5, color:"#5f6b7a"}); for (q = 0; q < nsug; q++){ var cx2 = sx - 22 + (q % 4) * 14, cy2 = jy + jh - 10 - Math.floor(q / 4) * 12; ctx.fillStyle = "#fffdf5"; ctx.fillRect(cx2, cy2, 11, 10); ctx.strokeStyle = "#b8ab8a"; ctx.lineWidth = 1; ctx.strokeRect(cx2, cy2, 11, 10); }
      var ax = S.draw.axes(c, {x0:0, x1:180, y0:0, y1:Math.max(10, Math.ceil(g.value * (ox.value ? 1.5 : 1) / 5) * 5), xl:"t (min)", yl:"g", stepX:30, t:fh + 44, l:40});
      var pal = [B4.pal.amber, B4.pal.red, B4.pal.teal];
      [[1, pal[0], "sucre (g)"], [2, pal[1], "éthanol (g)"], [3, pal[2], "CO₂ (g)"]].forEach(function(s, q){
        ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = s[1]; ctx.lineWidth = 2.6; ctx.beginPath();
        st.h.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(p[s[0]]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore(); B4.txt(c, s[2], ax.R - 6, ax.T + 10 + q * 15, s[1], 12, "right"); });
      ro.set(0, S.fmt(st.G, 1) + " g"); ro.set(1, S.fmt(eth, 1) + " g"); ro.set(2, S.fmt(vol, 0) + " mL"); ro.set(3, S.fmt(st.t, 0) + " min");
      nt.set(T.value > 55 ? "Au-dessus de 55 °C, les levures sont tuées : plus de fermentation (la pâte ne lève pas)." : T.value < 8 ? "Très froid : les enzymes des levures sont presque inactives, la fermentation est très lente." : ox.value ? "Avec dioxygène, les levures respirent : beaucoup de CO₂ (264 g pour 180 g de glucose), pas d'éthanol." : "Fermentation alcoolique : pour 180 g de glucose, 92 g d'éthanol et 88 g de CO₂. Volume de CO₂ calculé à " + S.fmt(T.value, 0) + " °C sous 1 atm.", T.value > 55 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c06-effort", ch:"c06", tag:"Muscle · modèle",
  titre:"Effort : quand le muscle passe à l'anaérobie",
  resume:"Fais varier la puissance demandée et l'entraînement : le lactate s'accumule dès que la respiration ne suffit plus.",
  but:"Règle la puissance et la capacité aérobie. Lance l'effort et surveille le lactate : jusqu'à quand peux-tu tenir ?",
  aRetenir:"Tant que la demande reste sous la capacité aérobie, le muscle couvre ses besoins par la respiration (≈ 30 ATP par glucose) et le lactate reste bas. Au-delà, il complète par la fermentation lactique (2 ATP par glucose), le lactate s'accumule et l'effort devient insoutenable. L'entraînement augmente la capacité aérobie.",
  piege:"Le lactate n'est pas un « poison » à l'origine des courbatures du lendemain. Modèle simplifié en unités arbitraires : l'allure des courbes compte plus que les valeurs.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var P = k.slider("Puissance demandée", 50, 400, 10, 220, "W");
    var A = k.slider("Capacité aérobie (entraînement)", 100, 300, 10, 160, "W");
    var ro = k.readouts(["Apport aérobie", "Apport par fermentation", "Glucose consommé / s (relatif)", "Tenue de l'effort"]);
    var nt = k.note("", "");
    var st = {t:0, L:1, h:[[0, 1]], run:false};
    function stepL(L, dt){ var prod = 0.06 * Math.max(0, P.value - A.value); return L + (prod - 0.4 * (L - 1)) * dt; }
    var lp = k.loop(function(dt){
      var h = dt * 1;      /* 1 s réelle = 1 min */
      for (var s = 0; s < 5; s++) st.L = stepL(st.L, h / 5);
      st.t += h; st.h.push([st.t, st.L]); if (st.t >= 10 || st.L >= 12) lp.pause(); k.redraw();
    });
    lp.play();
    k.button("▶ Lancer l'effort", function(){ st.t = 0; st.L = 1; st.h = [[0, 1]]; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Repos", function(){ lp.pause(); st.t = 0; st.L = 1; st.h = [[0, 1]]; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, aer = Math.min(P.value, A.value), fer = Math.max(0, P.value - A.value), gl = aer / 30 + fer / 2, gl0 = P.value / 30;
      var hh = H * 0.28, bx = 10, bw = W - 20, tot = 400;
      var Pl = S.draw.palette, gcx = W / 2, gcy = 88, gr = Math.min(70, W * 0.24), a0 = Math.PI, fa = function(w){ return a0 + Math.PI * w / tot; };
      ctx.save(); ctx.lineCap = "butt"; ctx.lineWidth = 16; ctx.strokeStyle = "#e3e7ed"; ctx.beginPath(); ctx.arc(gcx, gcy, gr, a0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = Pl.green; ctx.beginPath(); ctx.arc(gcx, gcy, gr, a0, fa(aer)); ctx.stroke(); ctx.strokeStyle = Pl.red; ctx.beginPath(); ctx.arc(gcx, gcy, gr, fa(aer), fa(aer + fer)); ctx.stroke(); ctx.restore();
      var na = fa(P.value); ctx.save(); ctx.strokeStyle = Pl.ink; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gcx, gcy); ctx.lineTo(gcx + Math.cos(na) * (gr - 6), gcy + Math.sin(na) * (gr - 6)); ctx.stroke(); ctx.restore(); S.draw.dot(c, gcx, gcy, 6, Pl.ink);
      S.draw.text(c, S.fmt(P.value, 0) + " W", gcx, gcy + 18, {size:15, color:Pl.ink, weight:800}); S.draw.text(c, "0", gcx - gr, gcy + 14, {size:10, color:"#5f6b7a"}); S.draw.text(c, "400", gcx + gr, gcy + 14, {size:10, color:"#5f6b7a"});
      S.draw.legend(c, [[Pl.green, "aérobie"], [Pl.red, "lactique"]], 8, 8, {box:true});
      var ax = S.draw.axes(c, {x0:0, x1:10, y0:0, y1:16, xl:"t (min)", yl:"lactate (mmol/L)", stepX:2, stepY:4, t:132, l:46});
      S.draw.line(c, ax.L, ax.Y(12), ax.R, ax.Y(12), B4.pal.red, 1.5, [5, 4]); B4.txt(c, "épuisement (≈ 12)", ax.R - 4, ax.Y(12) - 9, B4.pal.red, 12, "right");
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = B4.pal.violet; ctx.lineWidth = 2.8; ctx.beginPath(); st.h.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(p[1]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore();
      /* lactate d'équilibre */
      var Leq = 1 + 0.06 * fer / 0.4; if (Leq < 16) S.draw.line(c, ax.L, ax.Y(Leq), ax.R, ax.Y(Leq), "rgba(98,54,196,.45)", 1.5, [3, 4]);
      ro.set(0, S.fmt(aer, 0) + " W"); ro.set(1, S.fmt(fer, 0) + " W"); ro.set(2, "× " + S.fmt(gl / gl0, 1) + " (vs tout aérobie)");
      var held = fer === 0 ? "durable" : Leq < 12 ? "stabilisée (lactate ≈ " + S.fmt(Leq, 1) + ")" : "limitée (épuisement)";
      ro.set(3, held);
      var m = st.L >= 12 ? "Épuisement atteint à t ≈ " + S.fmt(st.t, 1) + " min : le lactate dépasse 12 mmol/L." : fer === 0 ? "Puissance sous la capacité aérobie : le lactate reste proche de 1 mmol/L, l'effort peut durer longtemps." : Leq < 12 ? "Au-dessus de la capacité aérobie, le lactate monte puis se stabilise vers " + S.fmt(Leq, 1) + " mmol/L : effort difficile mais tenable." : "Le lactate monte sans se stabiliser avant l'épuisement (équilibre prévu ≈ " + S.fmt(Leq, 0) + " mmol/L) : l'effort ne peut pas durer. À la même puissance, la fermentation consomme " + S.fmt(15, 0) + " fois plus de glucose par ATP.";
      nt.set(m, st.L >= 12 ? "warn" : fer === 0 ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"b4-c06-etapes", ch:"c06", tag:"Cellule animée · défi",
  titre:"Où le CO₂ est-il libéré ? Où le dioxygène est-il consommé ?",
  resume:"Suis un glucose dans la cellule : glycolyse, matrice, chaîne respiratoire. Bloque le dioxygène ou la chaîne avec du cyanure.",
  but:"Regarde les molécules circuler (glucose, ATP, CO₂, O₂). Touche une zone de la cellule pour lire son bilan. Active ou non le dioxygène et le cyanure et observe ce qui s'arrête.",
  aRetenir:"Glycolyse (cytoplasme) : 2 ATP, pas de CO₂, pas d'O₂. Décarboxylation du pyruvate et cycle de Krebs (matrice) : 6 CO₂ en tout, 2 ATP. Chaîne respiratoire (membrane interne) : c'est là que O₂ est consommé (il devient H₂O) et que ≈ 26 ATP sont produits. Total : ≈ 30 ATP, 6 CO₂, 6 O₂ par glucose.",
  piege:"L'O₂ n'est pas utilisé dans la glycolyse : il est consommé à la toute fin, dans la chaîne respiratoire. Si cette chaîne est bloquée (cyanure, absence d'O₂), tout l'aval s'arrête et la cellule se rabat sur la fermentation (2 ATP).",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.02});
    var n = k.slider("Glucose consommé", 1, 10, 1, 2, "molécules", function(){ reset(); });
    var ox = k.toggle("Dioxygène disponible", true, function(){ reset(); });
    var cn = k.toggle("Cyanure présent (bloque la chaîne respiratoire)", false, function(){ reset(); });
    var ro = k.readouts(["ATP total", "CO₂ libéré", "O₂ consommé", "Lactate formé"]);
    var nt = k.note("", "");
    var st = {sel:0, tt:0, ev:[], parts:[], cnt:[0, 0, 0], done:false}, zones = {};
    var STG = [
      {n:"Glycolyse", lieu:"cytoplasme", atp:2, co2:0, o2:0, txt:"Un glucose (6 C) est coupé en 2 pyruvates (3 C). Bilan : 2 ATP nets, 2 NADH. Aucun CO₂, aucun O₂ : elle fonctionne aussi sans dioxygène."},
      {n:"Pyruvate + Krebs", lieu:"matrice", atp:2, co2:6, o2:0, txt:"Les pyruvates perdent chacun un CO₂, puis le cycle de Krebs en libère 4 de plus : 6 CO₂ par glucose, 2 ATP et beaucoup de NADH et FADH₂. Le cycle a besoin que la chaîne respiratoire régénère NAD⁺ : sans elle, il s'arrête."},
      {n:"Chaîne respiratoire", lieu:"membrane interne", atp:26, co2:0, o2:6, txt:"NADH et FADH₂ cèdent leurs électrons à une chaîne de protéines ; l'accepteur final est O₂, qui devient H₂O (6 O₂ → 12 H₂O). L'énergie libérée sert à fabriquer ≈ 26 ATP."}
    ];
    function run(){ return ox.value && !cn.value; }
    function spawn(path, o){ o.path = path; o.t0 = st.tt; st.parts.push(o); }
    function reset(){
      st.tt = 0; st.parts = []; st.cnt = [0, 0, 0]; st.ev = []; st.done = false;
      var gap = 1.5;
      for (var i = 0; i < n.value; i++){ (function(t0){
        st.ev.push([t0, function(){ spawn([[0, 0.05, 0.16], [1.2, 0.2, 0.3]], {k:"glc", life:1.2}); }]);
        st.ev.push([t0 + 1.2, function(){
          st.cnt[0] += 2;
          for (var q = 0; q < 2; q++){ spawn([[0, 0.2 + q * .03, 0.3], [1.8, 0.1 + q * 0.2, 0.12 - q * .02]], {k:"atp", life:1.8}); }
          if (run()){ for (q = 0; q < 2; q++) spawn([[0, 0.2, 0.3 + q * .03], [1.0, 0.36, 0.5 + q * .04]], {k:"pyr", life:1.0}); }
          else for (q = 0; q < 2; q++) spawn([[0, 0.2, 0.3 + q * .03], [1.0, 0.18 + q * .06, 0.46]], {k:"lac", life:6});
        }]);
        if (run()){
          st.ev.push([t0 + 2.2, function(){ st.cnt[1] += 2;
            for (var q = 0; q < 6; q++){ spawn([[0, 0.48 + (q % 3) * 0.05, 0.5 + (q % 2) * 0.05], [2.0, 0.95, 0.08 + q * 0.03]], {k:"co2", life:2.0}); }
            for (q = 0; q < 2; q++) spawn([[0, 0.5 + q * .08, 0.52], [1.6, 0.6 + q * 0.1, 0.14]], {k:"atp", life:1.6});
          }]);
          st.ev.push([t0 + 1.2, function(){ for (var q = 0; q < 6; q++) spawn([[0, 0.02, 0.88 - q * .02], [2.4, 0.56 + q * 0.04, 0.72]], {k:"o2", life:2.4}); }]);
          st.ev.push([t0 + 3.6, function(){ st.cnt[2] += 26; for (var q = 0; q < 13; q++) spawn([[0, 0.46 + q * 0.03, 0.72], [2.0, 0.55 + (q % 5) * 0.07, 0.95]], {k:"atp", life:2.0}); }]);
        }
      })(i * gap); }
      st.ev.sort(function(a, b){ return a[0] - b[0]; }); st.end = (n.value - 1) * gap + 6.5;
      if (typeof lp !== "undefined") lp.play();
    }
    var lp = k.loop(function(dt){
      st.tt += dt; while (st.ev.length && st.ev[0][0] <= st.tt){ st.ev.shift()[1](); }
      st.parts = st.parts.filter(function(p){ return st.tt - p.t0 < p.life + 0.4; });
      if (st.tt > st.end) lp.pause();
      k.redraw();
    });
    reset(); lp.play();
    k.button("↺ Relancer", function(){ reset(); lp.play(); }, true);
    c.pointer(function(type, p){ if (type !== "down") return; Object.keys(zones).forEach(function(z){ var b = zones[z]; if (p.x >= b[0] && p.x <= b[2] && p.y >= b[1] && p.y <= b[3]) st.sel = +z; }); k.redraw(); });
    function ease(x){ return x * x * (3 - 2 * x); }
    function hex(x, y, r, col){ var ctx = c.ctx; ctx.beginPath(); for (var i = 0; i < 6; i++){ var a = i * Math.PI / 3; i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#7a5b12"; ctx.lineWidth = 1.4; ctx.stroke(); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, N = n.value, rn = run();
      function X(u){ return u * W; } function Y(v){ return v * H; }
      /* cellule */
      S.draw.rrect(c, 6, 6, W - 12, H - 12, 46); var cg = ctx.createLinearGradient(0, 0, W, H); cg.addColorStop(0, "#fff6ee"); cg.addColorStop(1, "#fde9e0"); ctx.fillStyle = cg; ctx.fill(); ctx.strokeStyle = "#c97b63"; ctx.lineWidth = 3; ctx.stroke();
      S.draw.label(c, "CYTOPLASME", 22, Y(0.46), {color:"#a35a44", size:10, align:"left"});
      /* mitochondrie */
      var mx = X(0.34), my = Y(0.38), mw = W * 0.6, mh = H * 0.5;
      S.draw.rrect(c, mx, my, mw, mh, mh / 2); var og = ctx.createLinearGradient(mx, my, mx, my + mh); og.addColorStop(0, rn ? "#8fd0a8" : "#c9cfd8"); og.addColorStop(1, rn ? "#5eb584" : "#a8b0bc"); ctx.fillStyle = og; ctx.fill(); ctx.strokeStyle = rn ? "#2a7a55" : "#7b8594"; ctx.lineWidth = 3; ctx.stroke();
      S.draw.rrect(c, mx + 9, my + 9, mw - 18, mh - 18, (mh - 18) / 2); ctx.fillStyle = rn ? "#e4f6ea" : "#eceff3"; ctx.fill(); ctx.strokeStyle = rn ? "#2a7a55" : "#7b8594"; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.strokeStyle = rn ? "#2a7a55" : "#7b8594"; ctx.lineWidth = 2; ctx.lineCap = "round";
      for (var i = 0; i < 4; i++){ var cxx = mx + mw * (0.34 + i * 0.12); ctx.beginPath(); ctx.moveTo(cxx, my + mh - 9); ctx.lineTo(cxx, my + mh * 0.52); ctx.quadraticCurveTo(cxx + 3, my + mh * 0.46, cxx + 6, my + mh * 0.52); ctx.lineTo(cxx + 6, my + mh - 9); ctx.stroke(); } ctx.restore();
      S.draw.label(c, "MITOCHONDRIE", mx + mw / 2, my - 10, {color:rn ? P.green : P.grey, size:10});
      S.draw.text(c, "matrice", mx + mw * 0.3, my + mh * 0.3, {size:10, color:rn ? "#2a7a55" : "#7b8594"}); S.draw.text(c, "membrane interne (crêtes)", mx + mw * 0.55, my + mh * 0.86 - 2, {size:9.5, color:rn ? "#2a7a55" : "#7b8594"});
      zones = {0:[6, 6, mx - 4, H - 6], 1:[mx + 9, my + 9, mx + mw - 9, my + mh * 0.5], 2:[mx + 9, my + mh * 0.5, mx + mw - 9, my + mh - 9]};
      var zc = [[X(0.2), Y(0.3), P.acc], [X(0.58), Y(0.5), P.green], [X(0.62), Y(0.78), P.amber]][st.sel];
      S.draw.glow(c, zc[0], zc[1], 46, zc[2], 0.35);
      /* particules */
      st.parts.forEach(function(p){
        var a = st.tt - p.t0, pa = p.path, x, y; if (a < 0) return;
        if (a >= pa[pa.length - 1][0]){ x = pa[pa.length - 1][1]; y = pa[pa.length - 1][2]; }
        else for (var j = 0; j < pa.length - 1; j++) if (a >= pa[j][0] && a < pa[j + 1][0]){ var u = ease((a - pa[j][0]) / (pa[j + 1][0] - pa[j][0])); x = pa[j][1] + (pa[j + 1][1] - pa[j][1]) * u; y = pa[j][2] + (pa[j + 1][2] - pa[j][2]) * u; break; }
        var al = Math.max(0, Math.min(1, (p.life + 0.4 - a) / 0.4)); ctx.save(); ctx.globalAlpha = al;
        if (p.k === "glc") hex(X(x), Y(y), 9, "#f7dc7a");
        else if (p.k === "pyr"){ S.draw.dot(c, X(x), Y(y), 5, P.orange); }
        else if (p.k === "lac"){ S.draw.dot(c, X(x), Y(y), 5, P.pink); }
        else if (p.k === "atp"){ S.draw.glow(c, X(x), Y(y), 9, P.yellow, 0.6); ctx.beginPath(); ctx.arc(X(x), Y(y), 4, 0, 6.2832); ctx.fillStyle = "#f4c542"; ctx.fill(); ctx.strokeStyle = "#a9780a"; ctx.lineWidth = 1; ctx.stroke(); }
        else if (p.k === "co2"){ ctx.beginPath(); ctx.arc(X(x), Y(y), 5, 0, 6.2832); ctx.fillStyle = "#9aa4b2"; ctx.fill(); S.draw.text(c, "CO₂", X(x), Y(y) - 9, {size:8, color:"#5f6b7a"}); }
        else if (p.k === "o2"){ ctx.beginPath(); ctx.arc(X(x), Y(y), 5, 0, 6.2832); ctx.fillStyle = "#5aa0e8"; ctx.fill(); S.draw.text(c, "O₂", X(x), Y(y) - 9, {size:8, color:P.blue}); }
        ctx.restore();
      });
      /* compteurs */
      S.draw.label(c, "ATP : " + st.cnt[0], X(0.2), Y(0.12) - 6, {color:P.acc, size:11}); S.draw.label(c, "ATP : " + st.cnt[1], X(0.66), Y(0.26), {color:P.green, size:11}); S.draw.label(c, "ATP : " + st.cnt[2], X(0.72), Y(0.97) - 7, {color:P.amber, size:11});
      S.draw.text(c, "glucose →", 14, Y(0.22), {size:10, color:"#8a6d1a", align:"left"}); S.draw.text(c, "O₂ →", 14, Y(0.8), {size:10, color:P.blue, align:"left"}); S.draw.text(c, "→ CO₂", W - 14, Y(0.04) + 12, {size:10, color:"#5f6b7a", align:"right"});
      if (!rn){ S.draw.label(c, cn.value ? "chaîne bloquée (cyanure) : ARRÊT" : "sans O₂ : chaîne à l'arrêt", mx + mw / 2, my + mh / 2 - 4, {color:P.red, size:11}); }
      var atp = 2 * N + (rn ? (2 + 26) * N : 0), co2 = rn ? 6 * N : 0, o2 = rn ? 6 * N : 0, lac = rn ? 0 : 2 * N;
      ro.set(0, S.fmt(atp, 0) + " ATP"); ro.set(1, S.fmt(co2, 0)); ro.set(2, S.fmt(o2, 0)); ro.set(3, lac ? S.fmt(lac, 0) : "0");
      var s2 = STG[st.sel];
      nt.set("<b>" + s2.n + " (" + s2.lieu + ").</b> " + s2.txt + (rn ? "" : (cn.value ? " <b>Cyanure :</b> la chaîne respiratoire est bloquée, NADH ne se régénère plus : Krebs s'arrête. La cellule fait de la fermentation lactique : seulement 2 ATP par glucose, " : " <b>Sans dioxygène :</b> la chaîne n'a plus d'accepteur final : mêmes conséquences, ") + "ici " + S.fmt(2 * N, 0) + " ATP pour " + S.fmt(N, 0) + " glucose(s) au lieu de " + S.fmt(30 * N, 0) + "."), rn ? "" : "warn");
    });
  }
});
