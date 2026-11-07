/* Chapitre 5 · Chaleur, température et effet thermique */
C5.MAT = {
  eau: {n: "Eau (liquide)", c: 4.18, lim: 100, limTxt: "elle bout"}, eth: {n: "Éthanol", c: 2.44, lim: 78, limTxt: "il bout"},
  al: {n: "Aluminium", c: 0.90, lim: 660, limTxt: "il fond"}, fe: {n: "Fer", c: 0.45, lim: 1538, limTxt: "il fond"},
  cu: {n: "Cuivre", c: 0.385, lim: 1085, limTxt: "il fond"}, pb: {n: "Plomb", c: 0.129, lim: 327, limTxt: "il fond"}
};

SFA.sim({
  id: "c5-c05-q-mc-dt", ch: "c05", tag: "Classique",
  titre: "Q = m · c · ΔT : combien d'énergie pour chauffer ?",
  resume: "Matériau, masse, énergie fournie → échauffement, et comparaison des six matériaux.",
  but: "Choisis un matériau, une masse et une énergie fournie. Lis ΔT, puis regarde ce que les autres matériaux feraient avec la même énergie. Relève le défi : amène 200 g d'eau de 20 °C à 70 °C.",
  aRetenir: "Q = m·c·ΔT (Q en J, m en g, c en J/(g·K), ΔT en K ou °C). Plus la chaleur massique c est grande, plus il faut d'énergie pour la même masse et le même ΔT : l'eau (4,18) chauffe lentement, les métaux (0,1 à 0,9) chauffent vite.",
  piege: "Chaleur et température sont deux grandeurs différentes : Q (en joules) est une énergie échangée, T (en °C) mesure l'agitation. Et la formule ne vaut que tant qu'il n'y a pas de changement d'état : au-delà de la limite (ébullition, fusion), le modèle ne s'applique plus. c(eau) arrondie à 4,18 J/(g·K).",
  build: function(k, S){
    var pal = S.draw.palette, MAT = C5.MAT, keys = Object.keys(MAT);
    var c = k.canvas(250);
    var mat = k.select("Matériau", keys.map(function(x){ return [x, MAT[x].n + " (c = " + S.fmt(MAT[x].c, 3) + ")"]; }), "eau");
    var m = k.slider("Masse m", 10, 1000, 10, 200, "g");
    var Q = k.slider("Énergie fournie Q", 0, 100, 0.5, 20, "kJ");
    var T0 = k.slider("Température initiale", 0, 40, 1, 20, "°C");
    k.button("Défi : 200 g d'eau de 20 °C à 70 °C", function(){ mat.set("eau"); m.set(200); T0.set(20); Q.set(10); defi = true; }, true);
    var defi = false;
    var ro = k.readouts(["Capacité thermique m·c", "Échauffement ΔT", "Température finale"]);
    var nt = k.note("", "");
    k.draw(function(){
      var mt = MAT[mat.value], mc = m.value * mt.c, dT = Q.value * 1000 / mc, Tf = T0.value + dT; c.clear();
      var x0 = 130, W = c.W - x0 - 14, rowH = (c.H - 30) / keys.length, mx = 0;
      keys.forEach(function(q){ var d = Q.value * 1000 / (m.value * MAT[q].c); mx = Math.max(mx, Math.min(d, MAT[q].lim - T0.value)); });
      mx = Math.max(mx, 10);
      S.draw.text(c, "ΔT avec la même masse et la même énergie (K)", 6, 10, {size: 12, align: "left", color: pal.grey});
      keys.forEach(function(q, i){
        var d = Q.value * 1000 / (m.value * MAT[q].c), lim = MAT[q].lim - T0.value, over = d > lim, y = 30 + i * rowH + rowH / 2, w = Math.min(d, lim) / mx * W;
        S.draw.text(c, MAT[q].n.replace(" (liquide)", ""), 6, y, {size: 12, align: "left", color: q === mat.value ? pal.ink : pal.grey, weight: q === mat.value ? 800 : 600});
        c.ctx.fillStyle = over ? pal.red : (q === mat.value ? pal.acc : "#a9b8d8"); c.ctx.fillRect(x0, y - rowH * 0.3, Math.max(1, w), rowH * 0.6);
        if (over) S.draw.text(c, "limite (" + MAT[q].lim + " °C)", x0 + Math.max(1, w) - 5, y, {size: 11.5, align: "right", color: "#ffffff"}); else S.draw.text(c, S.fmt(d, 1), x0 + Math.max(1, w) + 4, y, {size: 12, align: "left", color: pal.ink});
      });
      var over2 = Tf > mt.lim;
      ro.set(0, S.fmt(mc, 1) + " J/K"); ro.set(1, S.fmt(dT, over2 ? 0 : 1) + " K" + (over2 ? " (non valide)" : "")); ro.set(2, over2 ? "> " + mt.lim + " °C" : S.fmt(Tf, 1) + " °C");
      if (over2) nt.set("À " + mt.lim + " °C " + mt.limTxt + " : au-delà, Q = m·c·ΔT ne décrit plus l'échauffement (il faut ajouter l'énergie de changement d'état). Réduis Q ou augmente la masse.", "warn");
      else if (defi){ var ok = Math.abs(Tf - 70) <= 1 && mat.value === "eau" && m.value === 200; nt.set(ok ? "Réussi : Q = 200 × 4,18 × 50 ≈ 41,8 kJ." : "Défi : place Q pour que la température finale soit 70 °C (±1). Pense à Q = m·c·ΔT.", ok ? "ok" : ""); }
      else nt.set("ΔT = Q / (m·c). Pour doubler l'échauffement, double Q ou divise m ou c par 2.", "");
    });
  }
});

SFA.sim({
  id: "c5-c05-diagramme", ch: "c05", tag: "Graphe",
  titre: "Diagramme énergétique : exothermique ou endothermique ?",
  resume: "Niveaux des réactifs et des produits, barrière d'activation, signe de ΔH.",
  but: "Choisis une réaction (ou règle ΔH à la main). Observe si les produits sont plus bas ou plus haut que les réactifs, lis Eₐ directe et inverse, et dis si le milieu se réchauffe ou se refroidit.",
  aRetenir: "ΔH = H(produits) − H(réactifs). ΔH < 0 : exothermique, la réaction libère de l'énergie vers le milieu (il se réchauffe). ΔH > 0 : endothermique, elle en absorbe (il se refroidit). Eₐ(inverse) = Eₐ(directe) − ΔH.",
  piege: "Casser des liaisons COÛTE de l'énergie, en former en libère : le signe de ΔH est le bilan des deux. Et exothermique ne veut pas dire « rapide » : c'est Eₐ qui décide de la vitesse. Les Eₐ des exemples sont purement illustratives, seules les valeurs de ΔH sont des valeurs de tables (arrondies).",
  build: function(k, S){
    var pal = S.draw.palette;
    var P = {
      man: ["Réglage manuel", null, null],
      ch4: ["Combustion du méthane (par mol de CH₄)", -890, 150], neu: ["Neutralisation H⁺ + OH⁻ → H₂O", -57, 30],
      nh3: ["N₂ + 3 H₂ → 2 NH₃", -92, 230], nh4: ["Dissolution de NH₄NO₃ dans l'eau", 26, 40], caco3: ["CaCO₃ → CaO + CO₂", 178, 400]
    };
    var c = k.canvas(300);
    var pre = k.select("Réaction", Object.keys(P).map(function(x){ return [x, P[x][0]]; }), "nh3", function(v){ if (P[v][1] !== null){ dH.set(P[v][1]); Ea.set(P[v][2]); } });
    var dH = k.slider("ΔH", -900, 900, 1, -92, "kJ/mol");
    var Ea = k.slider("Énergie d'activation Eₐ (directe)", 10, 900, 10, 230, "kJ/mol");
    var ro = k.readouts(["ΔH", "Nature", "Eₐ directe", "Eₐ inverse", "Le milieu…"]);
    var nt = k.note("", "");
    k.draw(function(){
      var d = dH.value, e = Math.max(Ea.value, Math.max(0, d) + 10), adj = e !== Ea.value; c.clear();
      var lo = Math.min(0, d) - 60, hi = Math.max(e, d) + 80;
      var ax = S.draw.axes(c, {x0: 0, x1: 1, y0: lo, y1: hi, yl: "H (kJ/mol)", stepX: 5, l: 62, b: 30, hideZero: true});
      var sm = function(x){ return x * x * (3 - 2 * x); };
      var A = 0, f;
      var peak = function(a){ var mxv = -1e9; for (var i = 0; i <= 100; i++){ var x = i / 100, v = d * sm(x) + a * 4 * x * (1 - x); if (v > mxv) mxv = v; } return mxv; };
      var lo2 = 0, hi2 = 20 * (e + Math.abs(d) + 10); for (var it = 0; it < 60; it++){ var mid = (lo2 + hi2) / 2; if (peak(mid) < e) lo2 = mid; else hi2 = mid; } A = (lo2 + hi2) / 2;
      f = function(x){ return d * sm(x) + A * 4 * x * (1 - x); };
      S.draw.fn(c, ax, f, pal.acc, 3);
      var xr = 0.12, xp = 0.88;
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(0.3), ax.Y(0), pal.green, 2, [4, 3]); S.draw.text(c, "réactifs", ax.X(0.05), ax.Y(0) - 12, {size: 12, color: pal.green, align: "left"});
      S.draw.line(c, ax.X(0.7), ax.Y(d), ax.X(1), ax.Y(d), pal.red, 2, [4, 3]); S.draw.text(c, "produits", ax.X(0.95), ax.Y(d) + (d >= 0 ? -12 : 14), {size: 12, color: pal.red, align: "right"});
      var xe = 0.5; for (var i = 0; i <= 100; i++){ if (f(i / 100) > f(xe)) xe = i / 100; }
      S.draw.arrow(c, ax.X(0.15), ax.Y(0), ax.X(0.15), ax.Y(e), pal.violet, 2.4); S.draw.text(c, "Eₐ", ax.X(0.15) + 6, ax.Y(e / 2), {size: 13, color: pal.violet, align: "left"});
      S.draw.arrow(c, ax.X(0.86), ax.Y(0), ax.X(0.86), ax.Y(d), d < 0 ? pal.red : pal.acc, 2.8); S.draw.text(c, "ΔH", ax.X(0.86) - 6, ax.Y(d / 2), {size: 13, color: d < 0 ? pal.red : pal.acc, align: "right"});
      var eInv = e - d;
      ro.set(0, (d > 0 ? "+" : "") + S.fmt(d, 0) + " kJ/mol"); ro.set(1, d < 0 ? "exothermique" : d > 0 ? "endothermique" : "athermique"); ro.set(2, S.fmt(e, 0) + " kJ/mol"); ro.set(3, S.fmt(eInv, 0) + " kJ/mol");
      ro.set(4, d < 0 ? "se réchauffe" : d > 0 ? "se refroidit" : "ne change pas");
      nt.set(adj ? "Eₐ a été relevée : elle ne peut pas être inférieure à ΔH (le sommet doit dominer les produits)." : d < 0 ? "Les produits sont plus bas : de l'énergie " + S.fmt(-d, 0) + " kJ/mol est libérée vers le milieu." : d > 0 ? "Les produits sont plus haut : le milieu doit fournir " + S.fmt(d, 0) + " kJ/mol." : "ΔH = 0 : pas d'échange net de chaleur.", adj ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "c5-c05-melange", ch: "c05", tag: "Défi",
  titre: "Plonger un bloc chaud dans l'eau : température d'équilibre et métal mystère",
  resume: "Tf à partir des masses et températures ; ou retrouve c d'un métal inconnu.",
  but: "Règle le bloc et l'eau puis plonge le bloc : les deux températures convergent vers Tf. Les énergies perdue et gagnée sont égales. En mode mystère, déduis c et identifie le métal.",
  aRetenir: "La chaleur perdue par le corps chaud est égale à la chaleur gagnée par le corps froid : m₁c₁(T₁ − T_f) = m₂c₂(T_f − T₂) (+ C(T_f − T₂) pour le calorimètre). On isole T_f, ou c₁ si T_f est mesuré. Mélange eau–eau : moyenne pondérée par les masses.",
  piege: "T_f n'est pas la moyenne simple de T₁ et T₂ sauf si m₁c₁ = m₂c₂. Le calorimètre est lui aussi chauffé : l'oublier fausse c₁. Modèle sans pertes vers l'extérieur ; chaleurs massiques arrondies (J/(g·K)).",
  build: function(k, S){
    var pal = S.draw.palette, MAT = C5.MAT, cw = 4.18;
    var HOT = ["cu", "fe", "al", "pb", "eau"];
    var c = k.canvas(270);
    var mode = k.seg("Mode", [["lib", "Libre"], ["mys", "Métal mystère"]], "lib");
    var hot = k.select("Corps chaud", HOT.map(function(x){ return [x, MAT[x].n]; }), "cu");
    var m1 = k.slider("Masse du corps chaud", 20, 400, 10, 100, "g"), T1 = k.slider("Température du corps chaud", 50, 100, 1, 90, "°C");
    var m2 = k.slider("Masse d'eau", 50, 400, 10, 200, "g"), T2 = k.slider("Température de l'eau", 5, 40, 1, 20, "°C");
    var cal = k.toggle("Calorimètre (C = 50 J/K)", false);
    var mys = "fe", t0 = 0, verdict = "";
    var guess = k.select("Mon métal", ["cu", "fe", "al", "pb"].map(function(x){ return [x, MAT[x].n + " (c = " + S.fmt(MAT[x].c, 3) + ")"]; }), "cu");
    k.button("Plonger le bloc", function(){ t0 = 0; run = true; }, true);
    k.button("Nouveau mystère", function(){ mys = ["cu", "fe", "al", "pb"][Math.floor(Math.random() * 4)]; verdict = ""; mode.set("mys"); t0 = 0; });
    k.button("Vérifier mon métal", function(){ verdict = guess.value === mys ? "ok" : "warn"; });
    var run = true;
    var ro = k.readouts(["Température d'équilibre", "Chaleur perdue", "Chaleur gagnée", "c du corps chaud"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ if (run){ t0 += dt; if (t0 > 14) run = false; } k.redraw(); }); lp.play();
    k.draw(function(){
      var key = mode.value === "mys" ? mys : hot.value, c1 = MAT[key].c, C = cal.value ? 50 : 0;
      var a = m1.value * c1, b = m2.value * cw + C, Tf = (a * T1.value + b * T2.value) / (a + b);
      var tau = 3, f = 1 - Math.exp(-t0 / tau), Tb = T1.value + (Tf - T1.value) * f, Tw = T2.value + (Tf - T2.value) * f;
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 14, y0: 0, y1: 110, xl: "temps simulé (s)", yl: "T (°C)", stepX: 2, stepY: 20, l: 46});
      S.draw.fn(c, ax, function(t){ return T1.value + (Tf - T1.value) * (1 - Math.exp(-t / tau)); }, pal.red, 2.4);
      S.draw.fn(c, ax, function(t){ return T2.value + (Tf - T2.value) * (1 - Math.exp(-t / tau)); }, pal.acc, 2.4);
      S.draw.line(c, ax.X(0), ax.Y(Tf), ax.X(14), ax.Y(Tf), pal.green, 1.5, [6, 4]);
      S.draw.text(c, "T_f = " + S.fmt(Tf, 1) + " °C", ax.X(14) - 4, ax.Y(Tf) - 10, {size: 12, color: pal.green, align: "right"});
      S.draw.dot(c, ax.X(Math.min(t0, 14)), ax.Y(Tb), 6, pal.red); S.draw.dot(c, ax.X(Math.min(t0, 14)), ax.Y(Tw), 6, pal.acc);
      S.draw.text(c, "corps chaud", ax.X(0.4), ax.Y(T1.value) - 12, {size: 12, color: pal.red, align: "left"}); S.draw.text(c, "eau", ax.X(0.4), ax.Y(T2.value) + 14, {size: 12, color: pal.acc, align: "left"});
      var Qp = a * (T1.value - Tf), Qg = b * (Tf - T2.value);
      var known = mode.value === "lib" || verdict;
      ro.set(0, S.fmt(Tf, 1) + " °C"); ro.set(1, S.fmt(Qp, 0) + " J"); ro.set(2, S.fmt(Qg, 0) + " J");
      ro.set(3, mode.value === "mys" && !verdict ? "à calculer" : S.fmt(c1, 3) + " J/(g·K)");
      if (mode.value === "mys") nt.set(verdict === "ok" ? "Bravo : c'est " + MAT[mys].n + " (c = " + MAT[mys].c + "). Formule : c₁ = (m₂·c_eau + C)(T_f − T₂) / (m₁(T₁ − T_f))." : verdict === "warn" ? "Pas celui-là : recalcule c₁ = (m₂·c_eau + C)(T_f − T₂) / (m₁(T₁ − T_f)) avec T_f lu sur le graphe, et compare au tableau." : "Mesure T_f (ligne verte), calcule c₁ = (m₂·c_eau + C)(T_f − T₂) / (m₁(T₁ − T_f)), puis choisis le métal.", verdict === "ok" ? "ok" : "");
      else nt.set(key === "eau" ? "Eau chaude + eau froide : T_f = (m₁T₁ + m₂T₂)/(m₁ + m₂)." : "Les énergies perdue et gagnée sont égales (modèle sans pertes).", "");
    });
  }
});

SFA.sim({
  id: "c5-c05-plage-mer", ch: "c05", tag: "Niche utile",
  titre: "Pourquoi la plage brûle et la mer reste fraîche",
  resume: "Même énergie solaire, sable (c = 0,80) contre eau (c = 4,18).",
  but: "Fais varier la puissance reçue et la durée. Compare l'échauffement de 1 kg de sable et de 1 kg d'eau, puis de 1 L de chaque. Trouve combien de fois le sable chauffe plus vite.",
  aRetenir: "À énergie égale, ΔT = Q/(m·c) : plus c est grand, moins ça chauffe. L'eau (c = 4,18 J/(g·K)) a une grande capacité thermique : elle stocke beaucoup d'énergie pour peu d'élévation de température. C'est ce qui rend la mer plus fraîche le jour et plus chaude la nuit que la plage.",
  piege: "Ne confonds pas « même masse » et « même volume » : 1 L de sable sec pèse 1,6 kg (masse volumique 1,6 kg/L), donc le rapport change (≈ 3,3 au lieu de ≈ 5,2). Modèle simplifié : pas de mélange de l'eau, pas d'évaporation, pas de pertes.",
  build: function(k, S){
    var pal = S.draw.palette, CS = 0.80, CW = 4.18, RS = 1.6;
    var c = k.canvas(280);
    var comp = k.seg("Comparer", [["m", "Même masse (1 kg)"], ["v", "Même volume (1 L)"]], "m");
    var P = k.slider("Puissance reçue par chaque échantillon", 5, 60, 1, 30, "W");
    var t = k.slider("Durée d'exposition", 0, 60, 1, 30, "min");
    var ro = k.readouts(["Énergie reçue", "ΔT du sable", "ΔT de l'eau", "Rapport ΔT sable / ΔT eau"]);
    var nt = k.note("", "");
    k.draw(function(){
      var ms = comp.value === "m" ? 1000 : 1000 * RS, mw = 1000, T0 = 20;
      function Ts(tt){ return T0 + P.value * tt * 60 / (ms * CS); } function Tw(tt){ return T0 + P.value * tt * 60 / (mw * CW); }
      c.clear();
      var ymax = Math.max(60, Math.ceil(Math.max(Ts(60), Tw(60)) / 20) * 20);
      var ax = S.draw.axes(c, {x0: 0, x1: 60, y0: 0, y1: ymax, xl: "durée (min)", yl: "T (°C)", stepX: 10, stepY: ymax > 200 ? 50 : 20, l: 50});
      S.draw.fn(c, ax, Ts, pal.amber, 2.8); S.draw.fn(c, ax, Tw, pal.acc, 2.8);
      S.draw.text(c, "sable", ax.X(60) - 6, ax.Y(Ts(60)) + 12, {size: 12, color: pal.amber, align: "right"}); S.draw.text(c, "eau", ax.X(60) - 6, ax.Y(Tw(60)) - 12, {size: 12, color: pal.acc, align: "right"});
      S.draw.line(c, ax.X(t.value), ax.T, ax.X(t.value), ax.B, pal.grey, 1.2, [4, 4]);
      S.draw.dot(c, ax.X(t.value), ax.Y(Ts(t.value)), 6, pal.amber); S.draw.dot(c, ax.X(t.value), ax.Y(Tw(t.value)), 6, pal.acc);
      if (ymax >= 100) S.draw.line(c, ax.X(0), ax.Y(100), ax.X(60), ax.Y(100), pal.red, 1, [3, 4]);
      var ds = Ts(t.value) - T0, dw = Tw(t.value) - T0, E = P.value * t.value * 60;
      ro.set(0, S.fmt(E / 1000, 1) + " kJ"); ro.set(1, S.fmt(ds, 1) + " K → " + S.fmt(Ts(t.value), 0) + " °C"); ro.set(2, S.fmt(dw, 1) + " K → " + S.fmt(Tw(t.value), 0) + " °C"); ro.set(3, dw > 0 ? S.fmt(ds / dw, 1) : "—");
      var ratioTheo = comp.value === "m" ? CW / CS : CW / (CS * RS);
      nt.set(Tw(t.value) > 100 ? "L'eau dépasserait 100 °C : elle bouillirait, le modèle n'est plus valable. (Rapport théorique " + S.fmt(ratioTheo, 1) + ".)" : "Rapport théorique = c(eau)/c(sable)" + (comp.value === "v" ? " ÷ 1,6 (masse volumique du sable)" : "") + " = " + S.fmt(ratioTheo, 1) + " : il ne dépend ni de P ni de t.", Tw(t.value) > 100 ? "warn" : "");
    });
  }
});
