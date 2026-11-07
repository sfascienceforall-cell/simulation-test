/* Biologie BA1 · chapitre 6 : métabolisme énergétique */
(function(){
var P = function(S){ return S.draw.palette; };

/* 1. Bilan de l'oxydation complète du glucose */
SFA.sim({
  id:"ub-c06-bilan-glucose", ch:"c06", tag:"Bilan",
  titre:"Bilan ATP d'une molécule de glucose",
  resume:"D'où viennent les 30 à 32 ATP : substrat, NADH, FADH₂, navettes.",
  but:"Choisis la navette des NADH cytosoliques et les rendements ATP par coenzyme, puis regarde d'où vient chaque ATP.",
  aRetenir:"Par glucose : 4 ATP (ou GTP) de phosphorylation au niveau du substrat (2 nets en glycolyse + 2 au cycle de Krebs), 10 NADH et 2 FADH₂. Avec 2,5 ATP/NADH et 1,5 ATP/FADH₂ : 4 + 25 + 3 = 32 ATP (navette malate-aspartate) ; avec la navette glycérol-phosphate, les 2 NADH cytosoliques ne valent plus que 1,5 : 30 ATP. Les anciennes valeurs 3 et 2 donnaient 36 à 38.",
  piege:"Les 2 NADH de la glycolyse sont cytosoliques : ils ne traversent pas la membrane interne, leur rendement dépend de la navette. Et le carbone : 2 CO₂ viennent de la pyruvate déshydrogénase, 4 du cycle de Krebs, 0 de la chaîne respiratoire (l'O₂ finit en H₂O).",
  build:function(k,S){
    var c = k.canvas(330), pal = P(S);
    var nav = k.seg("Navette des NADH cytosoliques", [["ma","Malate-aspartate"],["gp","Glycérol-phosphate"]], "ma");
    var pn = k.slider("ATP par NADH (matrice)", 1.5, 3, 0.1, 2.5, "");
    var pf = k.slider("ATP par FADH₂", 1, 2, 0.1, 1.5, "");
    var ro = k.readouts(["ATP substrat","ATP oxydatif","Total / glucose","CO₂ libérés"]);
    k.draw(function(){
      c.clear();
      var n = pn.value, f = pf.value, gp = nav.value === "gp";
      var cyt = gp ? 2 * f : 2 * n;
      var items = [["Substrat (glycolyse 2 + Krebs 2)", 4, pal.amber], ["NADH glycolyse (×2)", cyt, pal.teal], ["NADH pyruvate DH (×2)", 2 * n, pal.acc], ["NADH Krebs (×6)", 6 * n, pal.violet], ["FADH₂ Krebs (×2)", 2 * f, pal.green]];
      var tot = 0; items.forEach(function(it){ tot += it[1]; });
      var x0 = 20, wmax = c.W - 40, sc = wmax / 40, y = 60, x = x0;
      S.draw.text(c, "Total : " + S.fmt(tot, 1) + " ATP par glucose", c.W / 2, 22, {size:16});
      items.forEach(function(it){
        var w = it[1] * sc; c.ctx.fillStyle = it[2]; c.ctx.fillRect(x, y, w, 46);
        if (w > 26) S.draw.text(c, S.fmt(it[1], 1), x + w / 2, y + 23, {color:"#fff", size:13});
        x += w;
      });
      var ly = 130;
      items.forEach(function(it, i){
        c.ctx.fillStyle = it[2]; c.ctx.fillRect(x0, ly + i * 24, 14, 14);
        S.draw.text(c, it[0] + " : " + S.fmt(it[1], 1) + " ATP", x0 + 22, ly + i * 24 + 7, {align:"left", size:12, weight:600});
      });
      S.draw.text(c, "Carbone : C₆ → 2 pyruvate (C₃) → 2 CO₂ + 2 acétyl (C₂) → 4 CO₂ (Krebs)", c.W / 2, 275, {size:12, weight:600, color:pal.grey});
      S.draw.text(c, "10 NADH + 2 FADH₂ réoxydés par la chaîne respiratoire · bilan : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", c.W / 2, 298, {size:11, weight:600, color:pal.grey});
      ro.set(0, "4"); ro.set(1, S.fmt(tot - 4, 1)); ro.set(2, S.fmt(tot, 1)); ro.set(3, "6");
    });
  }
});

/* 2. Chimiosmose */
SFA.sim({
  id:"ub-c06-chimiosmose", ch:"c06", tag:"Chimiosmose",
  titre:"Force protonmotrice et ATP synthase",
  resume:"Δp = ΔΨ + 61,5·ΔpH : assez d'énergie pour fabriquer l'ATP ? Découplant, oligomycine, cyanure.",
  but:"Règle le gradient de la membrane interne, ajoute un inhibiteur ou un découplant, et compare l'énergie fournie par les protons à celle qu'exige la synthèse d'ATP.",
  aRetenir:"Force protonmotrice (37 °C) : Δp = ΔΨ + 2,303·RT/F·ΔpH = ΔΨ + 61,5 mV × ΔpH, avec ΔΨ la valeur absolue du potentiel (matrice négative) et ΔpH = pH matrice − pH espace intermembranaire. Les protons qui rentrent fournissent n·F·Δp par ATP (n ≈ 3,7 H⁺ : ≈ 2,7 pour l'ATP synthase humaine + 1 pour le transport du phosphate). Même pont qu'en chimie avec l'équation de Nernst (électrochimie).",
  piege:"Un découplant (DNP, UCP1) ne bloque pas la chaîne : il la fait tourner plus vite (plus d'O₂ consommé) mais l'énergie part en chaleur. L'oligomycine, elle, bloque l'ATP synthase : Δp monte et la respiration ralentit (contrôle respiratoire). Modèle simplifié : le gradient est imposé, pas calculé à partir des flux.",
  build:function(k,S){
    var c = k.canvas(440), pal = P(S), B = S.bio, ps = [], cloud = [], acc = {p:0, s:0, l:0}, rot = 0, atps = [], rnd = Math.random;
    for (var q = 0; q < 34; q++) cloud.push({x:rnd(), y:rnd(), vx:rnd() - .5, vy:rnd() - .5});
    var dph = k.slider("ΔpH (matrice − espace)", 0, 1.2, 0.05, 0.5, "");
    var dpsi = k.slider("ΔΨ (valeur absolue)", 0, 200, 5, 150, "mV");
    var dnp = k.slider("Découplant (fuite de protons)", 0, 100, 5, 0, "%");
    var dg = k.slider("ΔG de synthèse de l'ATP (cellule)", 40, 70, 1, 55, "kJ/mol");
    var cond = k.seg("Condition", [["n","Normale"],["o","Oligomycine"],["c","Cyanure"]], "n");
    var ro = k.readouts(["Δp","n·F·Δp par ATP","Marge","État"]);
    var note = k.note("", "ok");
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear();
      var d = dnp.value / 100, n = 3.7, F = 96.485;
      var dp = (dpsi.value + 61.5 * dph.value) * (1 - d); if (cond.value === "c") dp = 0;
      var E = n * F * dp / 1000, marge = E - dg.value;
      /* géométrie */
      var my = H * .42, mh = 26, mx0 = 8, mx1 = W - 8;
      var xI = W * .17, xIII = W * .34, xIV = W * .5, xU = W * .64, xS = W * .82;
      /* fond */
      var g1 = ctx.createLinearGradient(0, 0, 0, my); g1.addColorStop(0, "#fff7e6"); g1.addColorStop(1, "#ffecc9"); ctx.fillStyle = g1; ctx.fillRect(mx0, 8, mx1 - mx0, my - mh / 2 - 8);
      var g2 = ctx.createLinearGradient(0, my, 0, my + 170); g2.addColorStop(0, "#e1ecfb"); g2.addColorStop(1, "#cfdff5"); ctx.fillStyle = g2; ctx.fillRect(mx0, my + mh / 2, mx1 - mx0, H * .3);
      S.draw.text(c, "Espace intermembranaire · pH bas, charge +", mx0 + 8, 22, {align:"left", size:11, color:"#a2650c"});
      S.draw.text(c, "Matrice · pH plus haut, charge −", mx0 + 8, my + mh / 2 + 30, {align:"left", size:11, color:"#2c5aa0"});
      /* membrane */
      ctx.fillStyle = "#f2e3b8"; ctx.fillRect(mx0, my - mh / 2, mx1 - mx0, mh); for (var x = mx0 + 6; x < mx1; x += 12){ B.ball(c, x, my - mh / 2 + 2, 3.6, "#e8b94a"); B.ball(c, x, my + mh / 2 - 2, 3.6, "#e8b94a"); }
      /* complexes */
      var blocked = cond.value === "c";
      function cplx(x, w, h, col, lab){ ctx.fillStyle = blocked && lab === "IV" ? "#9aa6b6" : col; S.draw.rrect(c, x - w / 2, my - h / 2, w, h, 8); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1.5; ctx.stroke(); S.draw.text(c, lab, x, my, {size:12, color:"#fff"}); }
      cplx(xI, 40, 56, pal.violet, "I"); cplx(xIII, 40, 56, pal.acc, "III"); cplx(xIV, 40, 56, pal.teal, "IV");
      if (blocked) S.draw.text(c, "✕ CN⁻", xIV, my - 42, {size:11, color:pal.red});
      /* UCP */
      ctx.fillStyle = d > 0 ? pal.amber : "#c9d3df"; S.draw.rrect(c, xU - 11, my - mh / 2 - 2, 22, mh + 4, 5); ctx.fill(); S.draw.text(c, "fuite", xU, my + mh / 2 + 14, {size:9.5, color:d > 0 ? pal.amber : pal.grey});
      /* ATP synthase : stator + rotor */
      var run = cond.value === "n" && marge >= 0, spin = run ? 3 * (1 - d * .3) : 0; rot += dt * spin;
      ctx.fillStyle = "#c9d3df"; S.draw.rrect(c, xS - 15, my - mh / 2 - 4, 30, mh + 8, 6); ctx.fill();
      ctx.fillStyle = pal.green; S.draw.rrect(c, xS - 7, my + mh / 2, 14, 24, 3); ctx.fill();
      ctx.save(); ctx.translate(xS, my + mh / 2 + 52); for (var q = 0; q < 3; q++){ var a = rot + q * 2.0944; ctx.fillStyle = [pal.green, "#4aa383", "#7cc3a8"][q]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 30, a, a + 1.75); ctx.closePath(); ctx.fill(); } ctx.restore();
      S.draw.text(c, "ATP synthase", xS, my + mh / 2 + 98, {size:10.5, color:pal.green}); S.draw.text(c, "ADP + Pi → ATP", xS, my + mh / 2 + 112, {size:9.5, color:pal.grey});
      /* particules H+ */
      var pump = blocked ? 0 : cond.value === "o" ? 3 : 6, flow = run ? 7 * (1 - d) : 0, leak = blocked ? 0 : d * 8;
      acc.p += dt * pump; acc.s += dt * flow; acc.l += dt * leak;
      while (acc.p > 1){ acc.p--; ps.push({k:"p", x:[xI, xIII, xIV][Math.floor(rnd() * 3)] + (rnd() - .5) * 14, y:my, t:0, ty:30 + rnd() * (my - 70)}); }
      while (acc.s > 1){ acc.s--; ps.push({k:"s", x:xS, y:my - mh / 2 - 36, t:0}); }
      while (acc.l > 1){ acc.l--; ps.push({k:"l", x:xU, y:my - mh / 2 - 36, t:0}); }
      ps.forEach(function(p){ p.t += dt * 1.1; var u = Math.min(1, p.t), y;
        if (p.k === "p"){ y = p.y + (p.ty - p.y) * u; } else { y = p.y + (mh + 90) * u; }
        p.draw = [p.x, y, p.k === "p" ? 1 : 1 - u * .3]; });
      ps = ps.filter(function(p){ if (p.t >= 1){ if (p.k === "s" && rnd() < .5) atps.push({x:xS + 20, y:my + 80, t:0}); if (p.k === "p") cloud.push({x:Math.max(0, Math.min(1, (p.x - 8) / (W - 16))), y:Math.max(0, Math.min(1, (p.ty - 20) / (my - 40))), vx:rnd() - .5, vy:rnd() - .5}); return false; } return true; });
      var nC = blocked ? 4 : Math.round(8 + 26 * Math.min(1, dp / 250)); while (cloud.length > nC) cloud.shift();
      cloud.forEach(function(p){ p.x += p.vx * dt * .08; p.y += p.vy * dt * .08; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; p.vx += (rnd() - .5) * dt * 3; p.vy += (rnd() - .5) * dt * 3; B.ball(c, mx0 + 6 + p.x * (mx1 - mx0 - 12), 34 + p.y * (my - mh / 2 - 48), 5.2, pal.red, {text:"H⁺", size:6.5}); });
      ps.forEach(function(p){ B.ball(c, p.draw[0], p.draw[1], 5.2, pal.red, {text:"H⁺", size:6.5, alpha:p.draw[2]}); });
      atps.forEach(function(a){ a.t += dt; a.x += dt * 24; S.draw.label(c, "ATP", a.x, a.y + 10 * Math.sin(a.t * 3), {color:pal.green, size:10}); }); atps = atps.filter(function(a){ return a.t < 2.2; });
      /* flèches de légende */
      S.draw.arrow(c, xI, my - 36, xI, my - 62, pal.red, 2); S.draw.text(c, "pompes à H⁺ (chaîne respiratoire)", xIII, my - 80 > 40 ? 38 : 38, {size:10, color:pal.grey}); 
      /* barres d'énergie */
      var by = H - 50, bx = 110, bw = W - bx - 26, sc = bw / 100;
      S.draw.text(c, "fournie", 14, by, {align:"left", size:11, color:pal.ink});
      ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, bx, by - 9, bw, 18, 9); ctx.fill(); ctx.fillStyle = marge >= 0 ? pal.green : pal.red; S.draw.rrect(c, bx, by - 9, Math.max(14, Math.min(100, E) * sc), 18, 9); ctx.fill();
      S.draw.text(c, S.fmt(E, 0) + " kJ/mol", E < 25 ? bx + Math.max(14, E * sc) + 8 : bx + 8, by, {align:"left", size:10.5, color:E < 25 ? pal.ink : "#fff"});
      S.draw.line(c, bx + dg.value * sc, by - 20, bx + dg.value * sc, by + 20, pal.ink, 2, [4, 3]);
      S.draw.text(c, "exigée : " + dg.value, bx + dg.value * sc, by + 30, {size:11, color:pal.ink});
      var state = cond.value === "o" ? "ATP synthase bloquée" : (marge >= 0 ? "Synthèse d'ATP" : "Synthèse impossible (hydrolyse)");
      ro.set(0, S.fmt(dp, 0) + " mV"); ro.set(1, S.fmt(E, 1) + " kJ"); ro.set(2, S.fmt(marge, 1) + " kJ"); ro.set(3, state);
      if (cond.value === "o") note.set("Oligomycine : les protons ne peuvent plus rentrer par l'ATP synthase. Δp reste élevé, la chaîne se heurte à ce gradient et l'O₂ consommé chute (contrôle respiratoire).", "warn");
      else if (cond.value === "c") note.set("Cyanure : le complexe IV est bloqué, plus de pompage de H⁺ en aval : Δp s'effondre, plus d'ATP mitochondrial.", "warn");
      else if (marge < 0) note.set("Avec cette fuite, n·F·Δp est inférieur au ΔG exigé : l'ATP synthase ne peut plus synthétiser (elle pourrait même hydrolyser l'ATP).", "warn");
      else if (d > 0) note.set("Découplage partiel : la chaîne tourne, le gradient est dissipé ; l'énergie de l'oxydation part en chaleur (thermogenèse).", "warn");
      else note.set("Situation normale : l'énergie des protons dépasse celle exigée pour synthétiser l'ATP.", "ok");
    }
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 3. Fermentation contre respiration */
SFA.sim({
  id:"ub-c06-fermentation", ch:"c06", tag:"Effort",
  titre:"Fermentation lactique et respiration : le prix de l'anaérobie",
  resume:"Pour un même besoin en ATP, combien de glucose et de lactate selon l'oxygénation.",
  but:"Fixe le besoin en ATP et la part produite sans oxygène ; lis la consommation de glucose et le lactate formé.",
  aRetenir:"Fermentation lactique : 2 ATP par glucose et 2 lactates ; respiration : 30 à 32 ATP par glucose. Si une fraction f de l'ATP vient de la fermentation, la consommation de glucose est multipliée par 1 + (Y/2 − 1)·f, soit 1 + 15·f pour Y = 32. Le lactate formé vaut exactement f × (ATP demandé) en mmol (1 lactate par ATP). Rôle de la fermentation : régénérer le NAD⁺ pour que la glycolyse continue sans O₂.",
  piege:"La fermentation ne produit pas d'ATP par elle-même : c'est la glycolyse qui en fait 2 ; la réduction du pyruvate en lactate sert uniquement à régénérer le NAD⁺. L'acidification du muscle vient surtout de l'hydrolyse de l'ATP qui libère des H⁺ : le lactate est le marqueur, pas la seule cause.",
  build:function(k,S){
    var c = k.canvas(300), pal = P(S);
    var d = k.slider("Besoin en ATP", 10, 200, 10, 100, "mmol/min");
    var f = k.slider("Part d'ATP produite sans O₂", 0, 100, 5, 0, "%");
    var y = k.slider("Rendement aérobie", 30, 32, 1, 32, "ATP/glucose");
    var ro = k.readouts(["Glucose","Lactate","Facteur / aérobie","ATP moyen par glucose"]);
    k.draw(function(){
      c.clear();
      var ff = f.value / 100, D = d.value, Y = y.value;
      var g = D * ((1 - ff) / Y + ff / 2), lac = ff * D, fac = g / (D / Y);
      var ax = S.draw.axes(c, {t:28,x0:0, x1:100, y0:0, y1:Y / 2 + 1, xl:"% sans O₂", yl:"× glucose", stepX:10, stepY:Y > 31 ? 4 : 4});
      S.draw.fn(c, ax, function(x){ return 1 + (Y / 2 - 1) * x / 100; }, pal.acc);
      S.draw.dot(c, ax.X(f.value), ax.Y(fac), 6, pal.red);
      S.draw.text(c, "×" + S.fmt(fac, 1), ax.X(f.value) + 10, ax.Y(fac) - 12, {align:"left", color:pal.red});
      ro.set(0, S.fmt(g, 2) + " mmol/min"); ro.set(1, S.fmt(lac, 1) + " mmol/min"); ro.set(2, "×" + S.fmt(fac, 2)); ro.set(3, S.fmt(D / g, 1));
    });
  }
});

/* 4. Photosynthèse */
SFA.sim({
  id:"ub-c06-photosynthese", ch:"c06", tag:"Photosynthèse",
  titre:"Réactions claires et cycle de Calvin : quel facteur limite ?",
  resume:"3 ATP + 2 NADPH par CO₂ fixé : équilibrer ATP/NADPH, lumière, CO₂.",
  but:"Fais varier la lumière, le flux cyclique et le CO₂ disponible : le cycle de Calvin est freiné par le plus rare des trois.",
  aRetenir:"Calvin : chaque CO₂ fixé coûte 3 ATP et 2 NADPH (soit 18 ATP + 12 NADPH par glucose). Le flux linéaire d'électrons donne ≈ 1,3 ATP par NADPH (valeur théorique ≈ 1,29 pour des ATP synthases à 14 sous-unités c) : il manque ≈ 0,2 ATP/NADPH, comblé en partie par le flux cyclique autour du photosystème I (ATP sans NADPH ni O₂).",
  piege:"L'O₂ vient de l'eau (photolyse), pas du CO₂. La phase « sombre » n'est pas indépendante de la lumière : elle consomme l'ATP et le NADPH des réactions claires. Modèle simplifié : pas de photorespiration ni de régulation stomatique.",
  build:function(k,S){
    var c = k.canvas(300), pal = P(S);
    var L = k.slider("Lumière (NADPH produit)", 0, 10, 0.5, 6, "u/s");
    var cy = k.slider("ATP cyclique ajouté", 0, 0.6, 0.05, 0.2, "ATP/NADPH");
    var co = k.slider("CO₂ disponible", 0, 6, 0.25, 6, "u/s");
    var ro = k.readouts(["ATP produit","ATP/NADPH","CO₂ fixé","Facteur limitant"]);
    k.draw(function(){
      c.clear();
      var nadph = L.value, atp = L.value * (1.29 + cy.value);
      var a = nadph / 2, b = atp / 3, cc = co.value, v = Math.min(a, b, cc);
      var names = ["NADPH (÷2)","ATP (÷3)","CO₂ présent"], vals = [a, b, cc], cols = [pal.acc, pal.amber, pal.green];
      var mx = Math.max(5.5, a, b, cc), bw = c.W - 190, i, lim = -1, mn = Math.min(a, b, cc);
      for (i = 0; i < 3; i++) if (Math.abs(vals[i] - mn) < 1e-9 && lim < 0) lim = i;
      var ties = vals.filter(function(x){ return Math.abs(x - mn) < 1e-9; }).length;
      for (i = 0; i < 3; i++){
        var y = 50 + i * 60;
        S.draw.text(c, names[i], 20, y, {align:"left", size:12});
        c.ctx.fillStyle = "#e3e7ed"; c.ctx.fillRect(130, y - 12, bw, 24);
        c.ctx.fillStyle = Math.abs(vals[i] - mn) < 1e-9 ? pal.red : cols[i]; c.ctx.fillRect(130, y - 12, vals[i] / mx * bw, 24);
        S.draw.text(c, S.fmt(vals[i], 2), 136 + vals[i] / mx * bw, y, {align:"left", size:11});
      }
      S.draw.text(c, "CO₂ fixables par seconde = le plus petit des trois (en rouge)", 20, 240, {align:"left", size:12, weight:600, color:pal.grey});
      S.draw.text(c, "Glucose équivalent : " + S.fmt(v / 6, 2) + " u/s (6 CO₂ par glucose)", 20, 266, {align:"left", size:12, weight:600});
      ro.set(0, S.fmt(atp, 2)); ro.set(1, nadph > 0 ? S.fmt(atp / nadph, 2) : "—"); ro.set(2, S.fmt(v, 2));
      ro.set(3, nadph === 0 ? "pas de lumière" : ties > 1 ? "équilibre ATP/NADPH/CO₂" : ["NADPH","ATP","CO₂"][lim]);
    });
  }
});

/* 5. Régulation : nourri / jeûne */
SFA.sim({
  id:"ub-c06-jeune", ch:"c06", tag:"Régulation",
  titre:"De l'état nourri au jeûne : glycogène puis néoglucogenèse",
  resume:"Qui fournit le glucose du foie au fil des heures ? Modèle qualitatif, ordres de grandeur.",
  but:"Déplace le curseur du temps et regarde la bascule glycogénolyse → néoglucogenèse, avec les hormones.",
  aRetenir:"Après les repas, l'insuline domine : stockage (glycogène, lipides). Le jeûne court fait monter le glucagon : le foie libère du glucose par glycogénolyse, puis, quand le glycogène hépatique (≈ 80 à 100 g) s'épuise, par néoglucogenèse (lactate, glycérol, acides aminés). Au-delà de 1 à 2 jours, les corps cétoniques épargnent le glucose au cerveau.",
  piege:"Le glycogène musculaire n'alimente pas la glycémie (pas de glucose-6-phosphatase dans le muscle). Les acides gras ne donnent pas de glucose net chez l'être humain (pas de conversion nette de l'acétyl-CoA en oxaloacétate). Les valeurs du modèle sont des ordres de grandeur, pas des mesures individuelles.",
  build:function(k,S){
    var c = k.canvas(320), pal = P(S);
    var t = k.slider("Temps depuis la fin de la digestion", 0, 72, 1, 12, "h");
    var g0 = k.slider("Glycogène hépatique initial", 50, 120, 10, 90, "g");
    var ro = k.readouts(["Glycogène restant","Glycogénolyse","Néoglucogenèse","Hormones"]);
    k.draw(function(){
      c.clear();
      var dt = 0.05, G = g0.value, ts = [], gl = [], ng = [], Gs = [], cur = null;
      for (var x = 0; x <= 72.0001; x += dt){
        var D = x <= 24 ? 8.4 : 8.4 - 3.4 * (x - 24) / 48;
        var s = D * G / (G + 30); if (s * dt > G) s = G / dt;
        ts.push(x); gl.push(s); ng.push(D - s); Gs.push(G);
        if (cur === null && x >= t.value - 1e-9) cur = ts.length - 1;
        G -= s * dt;
      }
      if (cur === null) cur = ts.length - 1;
      var ax = S.draw.axes(c, {t:28,x0:0, x1:72, y0:0, y1:10, xl:"h", yl:"g de glucose/h", stepX:12, stepY:2});
      var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.fillStyle = "rgba(180,83,9,.35)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0));
      for (var i = 0; i < ts.length; i += 4) ctx.lineTo(ax.X(ts[i]), ax.Y(gl[i])); ctx.lineTo(ax.X(72), ax.Y(0)); ctx.fill();
      ctx.fillStyle = "rgba(30,63,143,.35)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(gl[0]));
      for (i = 0; i < ts.length; i += 4) ctx.lineTo(ax.X(ts[i]), ax.Y(gl[i] + ng[i]));
      for (i = ts.length - 1; i >= 0; i -= 4) ctx.lineTo(ax.X(ts[i]), ax.Y(gl[i])); ctx.fill();
      ctx.restore();
      S.draw.line(c, ax.X(ts[cur]), ax.T, ax.X(ts[cur]), ax.B, pal.red, 2, [4, 3]);
      S.draw.text(c, "glycogénolyse", ax.X(6), ax.Y(2), {color:pal.amber, size:11});
      S.draw.text(c, "néoglucogenèse", ax.X(48), ax.Y(3), {color:pal.acc, size:11});
      var out = gl[cur] + ng[cur];
      ro.set(0, S.fmt(Gs[cur], 0) + " g"); ro.set(1, S.fmt(gl[cur], 1) + " g/h (" + S.fmt(100 * gl[cur] / out, 0) + " %)"); ro.set(2, S.fmt(ng[cur], 1) + " g/h (" + S.fmt(100 * ng[cur] / out, 0) + " %)");
      ro.set(3, ts[cur] < 6 ? "glucagon↑ / insuline↓" : ts[cur] < 24 ? "glucagon↑, cortisol" : "glucagon↑↑, corps cétoniques");
    });
  }
});
})();















/* BIO3D-BEGIN:s_c06_atpsynthase.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c06-3d-atp-synthase", ch:"c06", tag:"ATP synthase · 3D",
  titre:"L'ATP synthase en 3D : un moteur rotatif alimenté par les protons",
  resume:"Les H⁺ font tourner l'anneau c et l'axe γ ; à chaque tiers de tour, un ATP est libéré (changement de liaison de Boyer).",
  but:"Fais pivoter le moteur. Règle la force protonmotrice Δp, la taille de l'anneau c et l'énergie qu'exige l'ATP, puis observe le sens et la vitesse de rotation, et les trois états des sous-unités β.",
  aRetenir:"Les protons passent de l'espace intermembranaire vers la matrice par le canal de la sous-unité a et font tourner l'anneau c (Fo) ; l'axe γ tourne avec lui dans F1 et force les 3 sous-unités β à changer de conformation : ouverte (libère l'ATP), lâche (fixe ADP + Pi), serrée (forme l'ATP). Un tour complet = 3 ATP ; un anneau de n sous-unités c consomme n H⁺ par tour, soit n/3 H⁺ par ATP (8 chez les mammifères : 2,7 ; 10 chez la levure ; 14 dans le chloroplaste : 4,7). Pour synthétiser, il faut Δp ≥ ΔG(ATP) / (n·F).",
  piege:"Ce n'est pas le flux de H⁺ qui « fabrique » l'ATP chimiquement : il fait tourner une pièce mécanique, et la rotation déforme les sites catalytiques. L'enzyme est réversible : si Δp tombe sous le seuil, elle hydrolyse l'ATP et pompe des H⁺ (d'où des inhibiteurs comme IF1). L'oligomycine bloque Fo : la rotation s'arrête. Vitesse d'animation fortement ralentie (le moteur réel tourne à des dizaines de tours par seconde) ; le rendement ATP/NADH réel inclut aussi le transport du phosphate (≈ +1 H⁺ par ATP).",
  build:function(k,S){
    var c = k.canvas(430), pal = P(S), v = V3(c, S, {yaw:0.5, pit:0.42, D:13, sc:46, auto:false});
    var dp = k.slider("Force protonmotrice Δp", 80, 250, 5, 220, "mV");
    var dg = k.slider("ΔG de synthèse de l'ATP", 40, 65, 1, 50, "kJ/mol");
    var csz = k.seg("Anneau c (nombre de sous-unités)", [["8","c₈ mammifère"],["10","c₁₀ levure"],["14","c₁₄ chloroplaste"]], "8");
    var oli = k.toggle("Oligomycine (bloque Fo)", false);
    var ro = k.readouts(["H⁺ par ATP", "Δp minimal", "Sens", "ATP net produits"]);
    var info = k.note("", "ok");
    var phi = 0, nATP = 0, tt = 0, seed = 5, parts = [], emit = 0, bg = [];
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 40; i++) bg.push({x:-3 + rnd() * 6, y:1.0 + rnd() * 2.2, z:-2.2 + rnd() * 4.4});
    for (i = 0; i < 6; i++) bg.push({x:-3 + rnd() * 6, y:-3.4 + rnd() * 0.6, z:-2.2 + rnd() * 4.4});
    var mem = [];
    for (i = -5; i <= 5; i++) for (var j = -4; j <= 4; j++){ if (Math.hypot(i * 0.62, j * 0.62) < 1.75) continue; mem.push([i * 0.62, j * 0.62]); }
    var TWO = 2 * Math.PI;
    function omega(){
      var n = +csz.value, nH = n / 3, thr = dg.value * 1000 / (nH * 96485) * 1000;
      if (oli.value) return 0;
      return Math.max(-1, Math.min(1, (dp.value - thr) / 40)) * 1.9;
    }
    function R(){
      c.clear(); v.sc = Math.min(52, c.W / 6.2); v.oy = -8;
      var n = +csz.value, nH = n / 3, thr = dg.value * 1000 / (nH * 96485) * 1000, w = omega();
      var rc = 0.3 + 0.047 * n, cw = Math.min(0.28, TWO * rc / n * 0.42);
      /* membrane */
      mem.forEach(function(m){ v.ball(m[0], 0.5, m[1], 0.12, "#e3b13a", 0.8); v.ball(m[0], -0.5, m[1], 0.12, "#e3b13a", 0.8); v.seg([m[0], 0.5, m[1]], [m[0], 0.1, m[1]], 0.06, "#cfc7a6", 0.9); v.seg([m[0], -0.5, m[1]], [m[0], -0.1, m[1]], 0.06, "#cfc7a6", 0.9); });
      /* anneau c */
      for (var q = 0; q < n; q++){
        var th = phi + q / n * TWO, ex = ((th - 0) % TWO + TWO) % TWO / TWO;
        var x = rc * Math.cos(th), z = rc * Math.sin(th), prot = ex < 1 - 1 / n;
        v.seg([x, -0.5, z], [x, 0.5, z], cw, q === 0 ? "#dc2626" : "#0e7490", 1);
        if (prot) v.ball(x * 1.18, 0.22, z * 1.18, 0.1, "#ffffff");
      }
      /* sous-unité a avec ses demi-canaux */
      var ax = (rc + cw + 0.18);
      v.seg([ax, -0.5, 0.18], [ax, 0.5, 0.18], 0.5, "#b42318", 1); v.seg([ax, -0.5, -0.2], [ax, 0.5, -0.2], 0.5, "#b42318", 1);
      v.label("a", ax + 0.35, 0.1, 0, "#7f1d1d", 12);
      /* bras périphérique b (stator) jusqu'à F1 */
      v.seg([ax + 0.1, -0.5, 0], [ax + 0.3, -1.9, 0], 0.13, "#6b7280", 1);
      v.label("b (stator)", ax + 0.9, -1.2, 0, pal.grey, 10);
      /* axe γ (tourne) */
      v.seg([0, -0.5, 0], [0, -1.35, 0], 0.15, "#5B21B6", 1);
      v.seg([0, -1.35, 0], [0.3 * Math.cos(phi), -2.15, 0.3 * Math.sin(phi)], 0.15, "#5B21B6", 1);
      v.seg([0, -0.5, 0], [rc * 0.9 * Math.cos(phi), -0.52, rc * 0.9 * Math.sin(phi)], 0.1, "#5B21B6", 1);
      /* F1 : 3 α (gris) + 3 β (colorés par l'état) sur deux étages */
      var stateTxt = [];
      for (q = 0; q < 3; q++){
        var ab = Math.PI / 2 + q * TWO / 3 + 0.2, aa = ab + TWO / 6;
        var d = (((phi - ab) % TWO) + TWO) % TWO / TWO, st = d < 1 / 3 ? 0 : d < 2 / 3 ? 1 : 2;
        var colB = ["#16a34a", "#f59e0b", "#dc2626"][st];
        [-1.5, -2.0].forEach(function(y){ v.ball(0.62 * Math.cos(ab), y, 0.62 * Math.sin(ab), 0.4, colB); v.ball(0.62 * Math.cos(aa), y, 0.62 * Math.sin(aa), 0.4, "#9ca3af"); });
      }
      /* protons */
      bg.forEach(function(b){ b.x += (rnd() - 0.5) * 0.05; b.z += (rnd() - 0.5) * 0.05; b.y += (rnd() - 0.5) * 0.05; if (Math.abs(b.x) > 3) b.x *= 0.98; if (Math.abs(b.z) > 2.3) b.z *= 0.98; if (b.y > 0) { if (b.y < 0.9) b.y = 0.9; if (b.y > 3.2) b.y = 3.2; } else { if (b.y > -2.9) b.y = -2.9; if (b.y < -3.8) b.y = -3.8; }
        v.ball(b.x, b.y, b.z, 0.07, "#fb923c", 0.85); });
      parts.forEach(function(p){ var y = w >= 0 ? 1.4 - p.t * 2.5 : -1.1 + p.t * 2.5; if (p.t >= 0 && p.t <= 1) v.ball(ax + 0.02, y, 0.0, 0.1, "#fb923c"); });
      v.label("Espace intermembranaire : H⁺ nombreux", 0, 3.5, 0, pal.ink, 11);
      v.label("Matrice : peu de H⁺", 1.4, -3.9, 0, pal.ink, 11);
      v.flush();
      /* légende */
      [["#16a34a","β ouverte (libère ATP)"],["#f59e0b","β lâche (ADP + Pi)"],["#dc2626","β serrée (forme ATP)"]].forEach(function(l, i){
        c.ctx.fillStyle = l[0]; c.ctx.beginPath(); c.ctx.arc(10, c.H - 58 + i * 16, 5, 0, 6.3); c.ctx.fill(); S.draw.text(c, l[1], 20, c.H - 58 + i * 16, {size:10.5, align:"left", color:pal.ink}); });
      ro.set(0, S.fmt(nH, 1)); ro.set(1, S.fmt(thr, 0) + " mV"); ro.set(2, oli.value ? "bloqué" : w > 0.02 ? "synthèse" : w < -0.02 ? "hydrolyse" : "équilibre"); ro.set(3, S.fmt(nATP, 0));
      if (oli.value) info.set("Oligomycine : Fo est bloqué, l'anneau c ne tourne plus, le gradient de H⁺ n'est plus dissipé par l'ATP synthase.", "warn");
      else if (w > 0.02) info.set("Δp (" + dp.value + " mV) dépasse le seuil de " + S.fmt(thr, 0) + " mV : les protons font tourner le rotor, 1 ATP libéré à chaque tiers de tour (" + n + " H⁺ par tour).", "ok");
      else if (w < -0.02) info.set("Δp est sous le seuil (" + S.fmt(thr, 0) + " mV) : l'enzyme tourne à l'envers, hydrolyse l'ATP et pompe des H⁺ (vitesse réduite).", "bad");
      else info.set("Δp ≈ seuil : synthèse et hydrolyse s'équilibrent, pas de rotation nette.", "warn");
    }
    k.button("Tourner la vue : auto / manuel", function(){ v.auto = !v.auto; });
    k.draw(R);
    var lp = k.loop(function(dt){
      tt += dt; v.spin(dt); var w = omega(), step = Math.floor(phi / (TWO / 3));
      phi += w * dt; var st2 = Math.floor(phi / (TWO / 3)); nATP += st2 - step; if (nATP < 0) nATP = 0;
      emit += Math.abs(w) / TWO * (+csz.value) * dt;
      while (emit > 1){ emit -= 1; parts.push({t:0}); }
      parts.forEach(function(p){ p.t += dt * 1.5; }); parts = parts.filter(function(p){ return p.t < 1; });
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c06_atpsynthase.js */

/* BIO3D-BEGIN:s_c06_krebs.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c06-vis-cycle-krebs", ch:"c06", tag:"Krebs · animé",
  titre:"Le cycle de Krebs animé : suis les carbones",
  resume:"Un jeton parcourt les 8 réactions ; NADH, FADH₂, GTP et CO₂ apparaissent, et chaque carbone est suivi tour après tour.",
  but:"Lance l'animation ou avance réaction par réaction. Coupe l'O₂, ajoute du malonate, augmente la charge énergétique, et regarde d'où viennent réellement les CO₂.",
  aRetenir:"Un tour : acétyl-CoA (C₂) + oxaloacétate (C₄) → citrate (C₆) ; 2 décarboxylations (isocitrate DH et α-cétoglutarate DH) libèrent 2 CO₂ ; on récolte 3 NADH, 1 FADH₂ (succinate DH, complexe II) et 1 GTP/ATP, et l'oxaloacétate est régénéré. Par glucose (2 acétyl-CoA) : 2 tours, soit 6 NADH, 2 FADH₂, 2 GTP, 4 CO₂. Le cycle n'utilise pas O₂ directement, mais dépend de lui pour régénérer NAD⁺ et FAD.",
  piege:"Les 2 CO₂ d'un tour ne proviennent pas des 2 carbones de l'acétyl-CoA qui vient d'entrer, mais de carbones entrés plus tôt (ceux de l'oxaloacétate) : regarde les couleurs. Et sans O₂, le cycle s'arrête, même si aucune de ses réactions ne consomme O₂ : il n'y a plus de NAD⁺. Le modèle donne au cycle un réservoir de NAD⁺ limité (5) et de FAD (2) pour rendre ce blocage visible vite ; une vraie cellule en a plus.",
  build:function(k,S){
    var c = k.canvas(500), pal = P(S);
    var spd = k.slider("Vitesse", 0.3, 3, 0.1, 1.2, "×");
    var chg = k.slider("Charge énergétique (ATP, NADH élevés)", 0, 100, 5, 0, "%");
    var o2 = k.toggle("O₂ présent (chaîne respiratoire active)", true);
    var mal = k.toggle("Malonate (inhibe la succinate déshydrogénase)", false);
    var auto = k.toggle("Animation automatique", true);
    var ro = k.readouts(["Tours", "NADH", "FADH₂", "GTP", "CO₂", "ATP équiv."]);
    var info = k.note("", "ok");
    var NODES = ["Oxaloacétate C₄","Citrate C₆","Isocitrate C₆","α-cétoglutarate C₅","Succinyl-CoA C₄","Succinate C₄","Fumarate C₄","Malate C₄"];
    var ENZ = ["citrate synthase","aconitase","isocitrate déshydrogénase","α-cétoglutarate déshydrogénase","succinyl-CoA synthétase","succinate déshydrogénase","fumarase","malate déshydrogénase"];
    var PROD = ["+ acétyl-CoA (C₂)","isomérisation","NADH + CO₂","NADH + CO₂","GTP (≈ ATP)","FADH₂","+ H₂O","NADH"];
    var PCOL = [pal.amber, pal.grey, pal.red, pal.red, pal.green, pal.violet, pal.grey, pal.red];
    var TC = ["#9ca3af","#2563eb","#dc2626","#16a34a","#f59e0b","#7c3aed","#0891b2"];
    var s = 0, p = 0, turn = 0, nadh = 0, fadh = 0, gtp = 0, co2 = 0, nadPool = 0, fadPool = 0;
    var pool = [0, 0, 0, 0], out = [], stall = "", seed = 11, msg = "";
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var newC = [];
    function blocked(){
      if (s === 5 && mal.value) return "Malonate : la succinate déshydrogénase est inhibée (inhibiteur compétitif du succinate) : le succinate s'accumule, le cycle s'arrête ici.";
      if ((s === 2 || s === 3 || s === 7) && nadPool >= 5) return "Plus de NAD⁺ disponible : sans O₂ la chaîne respiratoire ne réoxyde plus le NADH, la déshydrogénase attend.";
      if (s === 5 && fadPool >= 2) return "Plus de FAD disponible : sans O₂, le FADH₂ n'est pas réoxydé.";
      return "";
    }
    function finish(){
      if (s === 0){ turn++; newC = [turn, turn]; msg = "Citrate synthase : l'acétyl-CoA du tour " + turn + " entre (carbones de couleur n°" + turn + "). Le citrate a 6 carbones : 4 anciens + 2 nouveaux."; }
      if (s === 1) msg = "Aconitase : le citrate est isomérisé en isocitrate (même nombre de carbones).";
      if (s === 2 || s === 3){
        var i = Math.floor(rnd() * pool.length), t = pool.splice(i, 1)[0]; out.push(t); co2++; nadh++; nadPool++;
        msg = "Décarboxylation : un CO₂ part, et son carbone vient du tour " + (t === 0 ? "0 (oxaloacétate de départ)" : t) + (t < turn ? ", pas de l'acétyl-CoA qui vient d'entrer (tour " + turn + ")." : ", ce qui est possible seulement après la symétrisation du succinate.") + " 1 NADH formé.";
        if (s === 3){ pool = pool.concat(newC); newC = []; }
      }
      if (s === 4){ gtp++; msg = "Succinyl-CoA synthétase : phosphorylation au niveau du substrat : 1 GTP (≈ 1 ATP)."; }
      if (s === 5){ fadh++; fadPool++; msg = "Succinate déshydrogénase (complexe II, membrane interne) : 1 FADH₂."; }
      if (s === 6) msg = "Fumarase : hydratation de la double liaison, fumarate → malate.";
      if (s === 7){ nadh++; nadPool++; msg = "Malate déshydrogénase : 1 NADH et l'oxaloacétate est régénéré, prêt pour un nouveau tour."; }
      s = (s + 1) % 8; p = 0;
    }
    function pos(i, cx, cy, Rr){ var a = (-90 + i * 45) * Math.PI / 180; return [cx + Rr * Math.cos(a), cy + Rr * Math.sin(a), a]; }
    function R(){
      c.clear(); var ctx = c.ctx;
      var cx = c.W / 2, cy = 190, Rr = Math.min(c.W * 0.31, 140), fs = c.W < 380 ? 9.5 : 11;
      for (var i = 0; i < 8; i++){
        var a0 = (-90 + i * 45 + 11) * Math.PI / 180, a1 = (-90 + (i + 1) * 45 - 11) * Math.PI / 180, on = (i === s);
        ctx.strokeStyle = on ? pal.acc : "#b6c0cd"; ctx.lineWidth = on ? 3 : 2; ctx.beginPath(); ctx.arc(cx, cy, Rr, a0, a1); ctx.stroke();
        var ex = cx + Rr * Math.cos(a1), ey = cy + Rr * Math.sin(a1), tg = a1 + Math.PI / 2;
        ctx.fillStyle = on ? pal.acc : "#b6c0cd"; ctx.beginPath(); ctx.moveTo(ex + 7 * Math.cos(tg), ey + 7 * Math.sin(tg)); ctx.lineTo(ex + 4 * Math.cos(tg + 2.2), ey + 4 * Math.sin(tg + 2.2)); ctx.lineTo(ex + 4 * Math.cos(tg - 2.2), ey + 4 * Math.sin(tg - 2.2)); ctx.fill();
        var am = (-90 + i * 45 + 22.5) * Math.PI / 180, lx = cx + (Rr + 34) * Math.cos(am), ly = cy + (Rr + 34) * Math.sin(am);
        var al = Math.cos(am) > 0.3 ? "left" : Math.cos(am) < -0.3 ? "right" : "center";
        S.draw.text(c, PROD[i], lx + (al === "left" ? -14 : al === "right" ? 14 : 0), ly, {size:fs - 0.5, color:on ? PCOL[i] : "#6b7280", weight:on ? 800 : 700, align:al});
      }
      for (i = 0; i < 8; i++){
        var q = pos(i, cx, cy, Rr), act = (i === s && p < 0.5) || (i === (s + 1) % 8 && p >= 0.5);
        ctx.fillStyle = act ? "#e8eefc" : "#ffffff"; ctx.strokeStyle = act ? pal.acc : "#8a95a3"; ctx.lineWidth = act ? 2.5 : 1.5;
        ctx.beginPath(); ctx.arc(q[0], q[1], 9, 0, 6.3); ctx.fill(); ctx.stroke();
        var out2 = Math.cos(q[2]) > 0.3 ? "left" : Math.cos(q[2]) < -0.3 ? "right" : "center";
        S.draw.text(c, NODES[i], q[0] + (out2 === "left" ? 14 : out2 === "right" ? -14 : 0), q[1] + (out2 === "center" ? (Math.sin(q[2]) < 0 ? -18 : 18) : 0), {size:fs, align:out2 === "left" ? "left" : out2 === "right" ? "right" : "center", color:act ? pal.acc : pal.ink});
      }
      /* jeton */
      var f = (s + p), tq = pos(f, cx, cy, Rr); ctx.fillStyle = "#f4c542"; ctx.strokeStyle = "#92400e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tq[0], tq[1], 7, 0, 6.3); ctx.fill(); ctx.stroke();
      S.draw.text(c, "Tour " + turn, cx, cy - 18, {size:16, color:pal.ink});
      S.draw.text(c, ENZ[s], cx, cy + 2, {size:fs - 0.5, color:pal.acc, weight:800});
      S.draw.text(c, "réaction " + (s + 1) + " / 8", cx, cy + 20, {size:fs - 1, color:pal.grey});
      /* carbones */
      var y0 = 372;
      S.draw.text(c, "Carbones du cycle (couleur = tour d'entrée)", 8, y0, {size:fs, align:"left", color:pal.ink});
      var all = pool.concat(newC);
      all.forEach(function(t, j){ ctx.fillStyle = TC[t % 7]; ctx.beginPath(); ctx.arc(20 + j * 22, y0 + 20, 8, 0, 6.3); ctx.fill(); S.draw.text(c, t === 0 ? "0" : String(t), 20 + j * 22, y0 + 20, {size:9, color:"#fff"}); });
      S.draw.text(c, "CO₂ libérés (tour d'origine du carbone)", 8, y0 + 50, {size:fs, align:"left", color:pal.ink});
      out.slice(-14).forEach(function(t, j){ ctx.fillStyle = TC[t % 7]; ctx.beginPath(); ctx.arc(20 + j * 22, y0 + 70, 8, 0, 6.3); ctx.fill(); S.draw.text(c, t === 0 ? "0" : String(t), 20 + j * 22, y0 + 70, {size:9, color:"#fff"}); });
      if (!out.length) S.draw.text(c, "(aucun pour l'instant)", 20, y0 + 70, {size:fs - 1, align:"left", color:pal.grey});
      var b = blocked();
      ro.set(0, turn); ro.set(1, nadh); ro.set(2, fadh); ro.set(3, gtp); ro.set(4, co2); ro.set(5, S.fmt(2.5 * nadh + 1.5 * fadh + gtp, 1));
      if (b && p === 0) info.set("<b>Bloqué.</b> " + b, "bad"); else info.set(msg || "Appuie sur « Étape suivante » ou laisse tourner l'animation.", "ok");
    }
    function rate(){ var r = spd.value; if (s === 2 || s === 3) r *= (1 - 0.88 * chg.value / 100); return r; }
    k.button("Étape suivante", function(){ auto.set(false); if (!blocked()) { p = 1; finish(); } }, true);
    k.button("Remettre à zéro", function(){ s = 0; p = 0; turn = 0; nadh = fadh = gtp = co2 = nadPool = fadPool = 0; pool = [0,0,0,0]; out = []; newC = []; msg = ""; });
    k.draw(R);
    var lp = k.loop(function(dt){
      if (o2.value){ var r = Math.min(nadPool, dt * 3); nadPool -= r; var r2 = Math.min(fadPool, dt * 3); fadPool -= r2; }
      if (auto.value && !blocked()){ p += dt * rate() / 1.1; if (p >= 1){ finish(); } }
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c06_krebs.js */
