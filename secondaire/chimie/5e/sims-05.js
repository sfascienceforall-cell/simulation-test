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

/* canevas dont la hauteur est une fonction de la largeur (scène + graphe) */
C5.cvF = C5.cvF || function(k, fn){
  var c = k.canvas(0, {ratio: 0.6});
  Object.defineProperty(c, "ratio", {get: function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); return fn(w) / w; }, configurable: true});
  c.resize(); return c;
};

SFA.sim({
  id: "c5-c05-plage-mer", ch: "c05", tag: "Niche utile",
  titre: "Pourquoi la plage brûle et la mer reste fraîche",
  resume: "Même soleil, même énergie : le sable (c = 0,80) chauffe bien plus vite que l'eau (c = 4,18).",
  but: "Lance l'exposition au soleil : les deux thermomètres montent, mais pas à la même vitesse. Fais varier la puissance reçue et la durée, compare 1 kg de sable et 1 kg d'eau, puis 1 L de chaque. Trouve combien de fois le sable chauffe plus vite.",
  aRetenir: "À énergie égale, ΔT = Q/(m·c) : plus c est grand, moins ça chauffe. L'eau (c = 4,18 J/(g·K)) a une grande capacité thermique : elle stocke beaucoup d'énergie pour peu d'élévation de température. C'est ce qui rend la mer plus fraîche le jour et plus chaude la nuit que la plage.",
  piege: "Ne confonds pas « même masse » et « même volume » : 1 L de sable sec pèse 1,6 kg (masse volumique 1,6 kg/L), donc le rapport change (≈ 3,3 au lieu de ≈ 5,2). Modèle simplifié : pas de mélange de l'eau, pas d'évaporation, pas de pertes (c'est pourquoi le sable peut monter très haut). Les réactions du baigneur sont illustratives.",
  build: function(k, S){
    var pal = S.draw.palette, CS = 0.80, CW = 4.18, RS = 1.6, GH = 230;
    var c = C5.cvF(k, function(w){ return w >= 760 ? Math.round(w * 0.52) : Math.round(w * (w < 460 ? 1.08 : 0.8)) + GH; });
    var an = {on: false}, tm = 0;
    var comp = k.seg("Comparer", [["m", "Même masse (1 kg)"], ["v", "Même volume (1 L)"]], "m");
    var P = k.slider("Puissance reçue par chaque échantillon", 5, 60, 1, 30, "W");
    var t = k.slider("Durée d'exposition", 0, 60, 1, 30, "min", function(){ an.on = false; });
    k.button("▶ Exposer au soleil (0 → 60 min)", function(){ t.set(0); an.on = true; }, true);
    k.button("❚❚ Pause", function(){ an.on = false; });
    var ro = k.readouts(["Énergie reçue", "ΔT du sable", "ΔT de l'eau", "Rapport ΔT sable / ΔT eau"]);
    var nt = k.note("", "");
    /* grains de sable (tirés une fois) */
    var rnd = (function(s){ return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(17), grains = [];
    for (var i = 0; i < 190; i++) grains.push([rnd(), rnd(), 0.5 + rnd() * 1.3, rnd() < 0.5]);
    t.set(0); an.on = true;   /* l'exposition démarre à l'ouverture */
    k.loop(function(dt, tt){ tm = tt; if (an.on){ var v = Math.min(60, t.value + dt * 6); t.set(v); if (v >= 60) an.on = false; } k.redraw(); }).play();

    function lin(x0, y0, x1, y1, st){ var g = c.ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(q){ g.addColorStop(q[0], q[1]); }); return g; }
    function cloud(x, y, s, a){ var ctx = c.ctx; ctx.save(); ctx.fillStyle = "rgba(255,255,255," + a + ")"; [[0, 0, 14], [14, -7, 17], [32, 0, 13], [16, 4, 14]].forEach(function(q){ ctx.beginPath(); ctx.arc(x + q[0] * s, y + q[1] * s, q[2] * s, 0, 6.2832); ctx.fill(); }); ctx.restore(); }
    function bubble(txt, x, y, col, size){
      var ctx = c.ctx; ctx.save(); ctx.font = "800 " + size + "px Mulish, system-ui, sans-serif"; var w = ctx.measureText(txt).width + 16, h = size + 12;
      ctx.fillStyle = "rgba(255,255,255,.96)"; ctx.strokeStyle = col; ctx.lineWidth = 1.6; S.draw.rrect(c, x - w / 2, y - h, w, h, 9); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 6, y - 1); ctx.lineTo(x + 2, y + 9); ctx.lineTo(x + 6, y - 1); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 2, y + 9); ctx.lineTo(x + 6, y); ctx.stroke();
      ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, x, y - h / 2); ctx.restore();
    }
    /* enfant de profil (pieds en (x, y)), qui sautille quand le sable brûle */
    function kid(x, y, hh, mood){
      var ctx = c.ctx, u = hh / 100, hop = mood === 2, ph = tm * 11;
      var l0 = hop ? Math.max(0, Math.sin(ph)) * 11 * u : 0, l1 = hop ? Math.max(0, Math.sin(ph + Math.PI)) * 11 * u : 0, bob = hop ? -Math.abs(Math.sin(ph)) * 3 * u : 0;
      var skin = "#e7b08a", skD = "#c98a63";
      ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.fillStyle = "rgba(90,60,20,.22)"; ctx.beginPath(); ctx.ellipse(2 * u, 1.5 * u, 20 * u, 4.5 * u, 0, 0, 6.2832); ctx.fill();
      [[-3, l1, skD], [3, l0, skin]].forEach(function(L){
        ctx.strokeStyle = L[2]; ctx.lineWidth = 9 * u; ctx.beginPath(); ctx.moveTo(L[0] * u, -44 * u + bob); ctx.lineTo((L[0] + 1) * u, -6 * u - L[1]); ctx.stroke();
        ctx.fillStyle = L[2]; ctx.beginPath(); ctx.ellipse((L[0] + 6) * u, -3 * u - L[1], 9 * u, 3.6 * u, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(120,70,40,.5)"; ctx.lineWidth = 1; ctx.stroke();
      });
      ctx.translate(0, bob);
      ctx.fillStyle = "#1f8fbf"; S.draw.rrect(c, -11 * u, -56 * u, 22 * u, 16 * u, 5 * u); ctx.fill();
      ctx.fillStyle = "#f4c542"; ctx.fillRect(-11 * u, -50 * u, 22 * u, 2.4 * u);
      var arm = hop ? Math.sin(ph * 0.5) : 0;
      ctx.strokeStyle = skD; ctx.lineWidth = 6.5 * u; ctx.beginPath(); ctx.moveTo(-2 * u, -80 * u); ctx.lineTo((-12 - 4 * arm) * u, (hop ? -98 : -58) * u); ctx.stroke();
      ctx.fillStyle = lin(0, -86 * u, 0, -54 * u, [[0, "#f07a63"], [1, "#d65a45"]]); S.draw.rrect(c, -11 * u, -86 * u, 22 * u, 33 * u, 8 * u); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.font = "800 " + Math.round(9 * u) + "px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.fillText("SFA", 0, -66 * u);
      ctx.strokeStyle = skin; ctx.lineWidth = 6.5 * u; ctx.beginPath(); ctx.moveTo(3 * u, -80 * u); ctx.lineTo((14 + 4 * arm) * u, (hop ? -100 : -58) * u); ctx.stroke();
      ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(3 * u, -97 * u, 11.5 * u, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#5a3a22"; ctx.beginPath(); ctx.arc(1 * u, -100 * u, 11.8 * u, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
      ctx.fillStyle = "#f4c542"; ctx.beginPath(); ctx.ellipse(2 * u, -108 * u, 15 * u, 3.5 * u, 0, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.arc(2 * u, -108 * u, 9 * u, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#1d2433"; ctx.beginPath(); ctx.arc(9 * u, -98 * u, 1.5 * u, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#8a3b2a"; ctx.lineWidth = 1.6 * u; ctx.beginPath();
      if (mood === 2){ ctx.fillStyle = "#8a3b2a"; ctx.ellipse(10 * u, -91 * u, 2 * u, 2.6 * u, 0, 0, 6.2832); ctx.fill(); } else if (mood === 1){ ctx.moveTo(7 * u, -91 * u); ctx.lineTo(12 * u, -91 * u); ctx.stroke(); } else { ctx.arc(9 * u, -93 * u, 3.4 * u, 0.3, 1.9); ctx.stroke(); }
      ctx.restore();
    }
    /* thermomètre planté : xT, yG = niveau du sol (0 °C), L = longueur visible */
    function thermo(xT, yG, L, T, ymax, step, buried){
      var ctx = c.ctx, tw = Math.max(11, L * 0.07), yTop = yG - L, yBulb = yG + tw * 1.4, f = Math.max(0, Math.min(1.02, T / ymax));
      ctx.save(); ctx.beginPath(); ctx.rect(xT - L, yTop - 30, 2 * L, yG - yTop + 32); ctx.clip();
      ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 6; ctx.shadowOffsetX = 2;
      ctx.fillStyle = lin(xT - tw / 2, 0, xT + tw / 2, 0, [[0, "#dfe8f2"], [0.45, "#ffffff"], [1, "#c5d2e0"]]);
      S.draw.rrect(c, xT - tw / 2, yTop - 4, tw, yBulb - yTop + 4, tw / 2); ctx.fill(); ctx.shadowColor = "transparent";
      ctx.strokeStyle = "#7d8ea3"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(xT, yBulb, tw * 0.95, 0, 6.2832); ctx.fillStyle = "#fff"; ctx.fill(); ctx.stroke();
      ctx.fillStyle = lin(xT - tw, 0, xT + tw, 0, [[0, "#b8261a"], [0.4, "#ef5a43"], [1, "#a01e14"]]);
      ctx.beginPath(); ctx.arc(xT, yBulb, tw * 0.68, 0, 6.2832); ctx.fill();
      var yl = yG - f * (L - 8); ctx.fillRect(xT - tw * 0.2, yl, tw * 0.4, yBulb - yl);
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(xT - tw * 0.32, yTop + 2, tw * 0.12, yBulb - yTop - 6);
      ctx.strokeStyle = "#51627a"; ctx.lineWidth = 1; ctx.font = "700 9.5px Mulish, sans-serif"; ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var v = 0; v <= ymax + 1e-9; v += step / 2){ var yy = yG - v / ymax * (L - 8), big = Math.abs(v / step - Math.round(v / step)) < 1e-6; ctx.beginPath(); ctx.moveTo(xT + tw / 2, yy); ctx.lineTo(xT + tw / 2 + (big ? 6 : 3), yy); ctx.stroke(); if (big && v > 0) ctx.fillText(String(v), xT - tw / 2 - 3, yy); }
      ctx.restore();
      buried(yG, yBulb + tw);
      return yTop;
    }
    k.draw(function(){
      var W = c.W, H = c.H, wide = W >= 760, ctx = c.ctx, PW = P.value;
      var ms = comp.value === "m" ? 1000 : 1000 * RS, mw = 1000, T0 = 20;
      function Ts(tt){ return T0 + PW * tt * 60 / (ms * CS); } function Tw(tt){ return T0 + PW * tt * 60 / (mw * CW); }
      var tv = t.value, ts = Ts(tv), tw = Tw(tv);
      var ymax = Math.max(60, Math.ceil(Math.max(Ts(60), Tw(60)) / 20) * 20), step = ymax > 200 ? 50 : 20;
      var sw = wide ? Math.round(W * 0.6) : W, sh = wide ? H : H - GH, x0 = 0, y0 = 0, us = Math.min(sw / 540, sh / 430);
      c.clear();
      /* ---------- scène ---------- */
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, sw, sh); ctx.clip();
      var yH = y0 + sh * 0.36, yS = yH + sh * 0.07, yB = y0 + sh;
      ctx.fillStyle = lin(0, y0, 0, yH, [[0, "#4ea7e4"], [1, "#cdebf9"]]); ctx.fillRect(x0, y0, sw, yH - y0 + 1);
      var sx = x0 + sw * 0.5, sy = y0 + sh * 0.12, rs = (13 + PW * 0.3) * us;
      S.draw.glow(c, sx, sy, rs * 3.6, "#ffd34d", 0.35 + PW / 200);
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(tm * 0.25); ctx.strokeStyle = "rgba(255,200,60,.75)"; ctx.lineWidth = 2.5 * us; ctx.lineCap = "round";
      for (var r = 0; r < 12; r++){ ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(rs * 1.25, 0); ctx.lineTo(rs * (1.55 + 0.12 * Math.sin(tm * 3 + r)), 0); ctx.stroke(); }
      ctx.restore();
      var sg = ctx.createRadialGradient(sx - rs * 0.3, sy - rs * 0.3, rs * 0.1, sx, sy, rs); sg.addColorStop(0, "#fffbe0"); sg.addColorStop(0.6, "#ffd84a"); sg.addColorStop(1, "#f9b51f");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, rs, 0, 6.2832); ctx.fill();
      cloud(x0 + ((tm * 9 + 40) % (sw + 160)) - 80, y0 + sh * 0.09, 0.9 * us, 0.85); cloud(x0 + ((tm * 6 + sw * 0.7) % (sw + 160)) - 80, y0 + sh * 0.2, 0.65 * us, 0.75);
      /* mer */
      ctx.fillStyle = lin(0, yH, 0, yB, [[0, "#2f86c4"], [0.25, "#3ea6d4"], [1, "#56c6d3"]]); ctx.fillRect(x0, yH, sw, yB - yH);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x0, yH, sw, 1.5);
      var wash = Math.sin(tm * 1.3) * sw * 0.012;
      function shore(y, e){ return x0 + sw * (0.30 + 0.27 * (y - yS) / (yB - yS)) + (e || 0) + Math.sin(y * 0.07 + tm * 1.1) * 3 * us; }
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1.4;
      for (var wv = 0; wv < 9; wv++){ var wy = yH + 8 + wv * (yB - yH) / 9, amp = 1.5 + wv * 0.35; ctx.beginPath(); for (var wx = shore(wy, 24) ; wx < x0 + sw; wx += 6){ var yy = wy + Math.sin(wx * 0.045 + tm * 1.6 + wv) * amp; wx <= shore(wy, 24) ? ctx.moveTo(wx, yy) : ctx.lineTo(wx, yy); } ctx.stroke(); }
      ctx.restore();
      /* sable : sable mouillé puis sable sec, avec écume */
      function sandPath(e){ ctx.beginPath(); ctx.moveTo(x0, yS); for (var y = yS; y <= yB + 2; y += 6) ctx.lineTo(shore(y, e), y); ctx.lineTo(x0, yB + 2); ctx.closePath(); }
      sandPath(wash + 14 * us); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fill();
      sandPath(wash + 8 * us); ctx.fillStyle = "#c9a56a"; ctx.fill();
      sandPath(-4 * us); ctx.fillStyle = lin(0, yS, 0, yB, [[0, "#f3dca6"], [1, "#e2bf7c"]]); ctx.fill();
      ctx.save(); sandPath(-4 * us); ctx.clip();
      grains.forEach(function(g){ ctx.fillStyle = g[3] ? "rgba(150,110,50,.35)" : "rgba(255,255,255,.55)"; ctx.fillRect(x0 + g[0] * sw * 0.6, yS + g[1] * (yB - yS), g[2] * us, g[2] * us); });
      var hot = Math.max(0, Math.min(1, (ts - 22) / 120)); ctx.fillStyle = "rgba(255,95,30," + (0.32 * hot) + ")"; ctx.fillRect(x0, yS, sw, yB - yS);
      ctx.restore();
      /* parasol et serviette */
      var px = x0 + sw * 0.07, py = y0 + sh * 0.70;
      ctx.save(); ctx.fillStyle = "rgba(90,60,20,.18)"; ctx.beginPath(); ctx.ellipse(px + 14 * us, py + 4 * us, 46 * us, 9 * us, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#2f7fd1"; ctx.beginPath(); ctx.moveTo(px - 10 * us, py + 14 * us); ctx.lineTo(px + 52 * us, py + 14 * us); ctx.lineTo(px + 40 * us, py - 2 * us); ctx.lineTo(px - 18 * us, py - 2 * us); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff"; for (var st2 = 0; st2 < 3; st2++){ ctx.beginPath(); var a1 = st2 * 0.33 + 0.08; ctx.moveTo(px - 10 * us + 62 * us * a1, py + 14 * us); ctx.lineTo(px - 10 * us + 62 * us * (a1 + 0.12), py + 14 * us); ctx.lineTo(px - 18 * us + 58 * us * (a1 + 0.12), py - 2 * us); ctx.lineTo(px - 18 * us + 58 * us * a1, py - 2 * us); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = "#6b5a48"; ctx.lineWidth = 3 * us; ctx.beginPath(); ctx.moveTo(px, py + 6 * us); ctx.lineTo(px + 6 * us, py - 92 * us); ctx.stroke();
      ctx.translate(px + 6 * us, py - 92 * us); ctx.rotate(0.12);
      for (var sgm = 0; sgm < 6; sgm++){ ctx.beginPath(); ctx.moveTo(0, -4 * us); var aa = Math.PI + sgm * Math.PI / 6, bb = aa + Math.PI / 6; ctx.arc(0, 4 * us, 44 * us, aa, bb); ctx.closePath(); ctx.fillStyle = sgm % 2 ? "#ffffff" : "#e8513e"; ctx.fill(); }
      ctx.restore();
      /* empreintes de pas vers la mer */
      ctx.save(); ctx.fillStyle = "rgba(150,105,45,.35)";
      for (var fp = 0; fp < 5; fp++){ var fx = x0 + sw * (0.43 + fp * 0.022), fy = y0 + sh * (0.93 - fp * 0.012) + (fp % 2 ? 5 : -2) * us; ctx.beginPath(); ctx.ellipse(fx, fy, 5 * us, 2 * us, -0.15, 0, 6.2832); ctx.fill(); }
      ctx.restore();
      /* rayons du soleil : même énergie vers les deux échantillons */
      var xs = x0 + sw * 0.22, ysg = y0 + sh * 0.84, xw = x0 + sw * 0.86, ywg = y0 + sh * 0.80, Lt = sh * 0.42;
      ctx.save(); ctx.strokeStyle = "rgba(255,186,30,.9)"; ctx.lineWidth = 2.2 * us; ctx.setLineDash([9, 7]); ctx.lineDashOffset = -tm * 34;
      [[xs, ysg], [xw, ywg]].forEach(function(q){ for (var j = -1; j <= 1; j++){ ctx.beginPath(); ctx.moveTo(sx + j * rs * 0.5, sy + rs * 0.9); ctx.lineTo(q[0] + j * 26 * us + (q[0] < sx ? 22 : -22) * us, q[1] - 6 * us); ctx.stroke(); } });
      ctx.restore();
      S.draw.label(c, "même soleil : " + PW + " W pour chacun", sx, sy + rs * 1.9 + 8, {color: pal.amber, size: Math.max(10.5, 12 * us)});
      /* chaleur qui ondule au-dessus du sable brûlant */
      var shim = Math.max(0, Math.min(1, (ts - 35) / 40));
      if (shim > 0){ ctx.save(); ctx.strokeStyle = "rgba(255,255,255," + (0.5 * shim) + ")"; ctx.lineWidth = 1.6;
        for (var hs = 0; hs < 7; hs++){ var hx = x0 + sw * (0.03 + hs * 0.06), base = y0 + sh * (0.62 + (hs % 3) * 0.08), ph2 = (tm * 0.6 + hs * 0.37) % 1; ctx.globalAlpha = Math.sin(ph2 * Math.PI);
          ctx.beginPath(); for (var q2 = 0; q2 <= 30; q2 += 3){ var yy2 = base - ph2 * 22 * us - q2 * us; q2 ? ctx.lineTo(hx + Math.sin(q2 * 0.35 + tm * 6 + hs) * 3 * us, yy2) : ctx.moveTo(hx, yy2); } ctx.stroke(); }
        ctx.restore(); }
      /* baigneur dans la mer */
      var bx = x0 + sw * 0.70, by = y0 + sh * 0.60 + Math.sin(tm * 2) * 2 * us, ur = us;
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(bx, by + 9 * ur, 22 * ur, 4 * ur, 0, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = "#e7b08a"; ctx.lineWidth = 5 * ur; ctx.lineCap = "round"; var sa = tm * 2.4;
      ctx.beginPath(); ctx.moveTo(bx - 8 * ur, by + 6 * ur); ctx.lineTo(bx - 8 * ur - Math.cos(sa) * 16 * ur, by + 6 * ur - Math.abs(Math.sin(sa)) * 14 * ur); ctx.stroke();
      ctx.fillStyle = "#e7b08a"; ctx.beginPath(); ctx.arc(bx, by, 9 * ur, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#e8513e"; ctx.beginPath(); ctx.arc(bx, by - 1 * ur, 9.4 * ur, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#1d2433"; ctx.fillRect(bx + 1 * ur, by + 0.5 * ur, 7 * ur, 2.6 * ur);
      ctx.fillStyle = "rgba(62,166,212,.85)"; ctx.fillRect(bx - 14 * ur, by + 6 * ur, 28 * ur, 6 * ur); ctx.restore();
      /* thermomètres */
      /* partie enfouie : petit monticule de sable ; partie immergée : vue à travers l'eau */
      var sandBury = function(yG){ ctx.save(); ctx.fillStyle = "rgba(150,105,45,.25)"; ctx.beginPath(); ctx.ellipse(xs + 4, yG + 4, 30 * us, 6 * us, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = lin(0, yG - 9 * us, 0, yG + 5, [[0, "#f6e2b4"], [1, "#d8b471"]]); ctx.beginPath(); ctx.moveTo(xs - 26 * us, yG + 4); ctx.quadraticCurveTo(xs - 10 * us, yG - 12 * us, xs, yG - 9 * us); ctx.quadraticCurveTo(xs + 12 * us, yG - 12 * us, xs + 26 * us, yG + 4); ctx.closePath(); ctx.fill(); ctx.restore(); };
      var seaBury = function(yG, yEnd){ ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = "#c9e4f2"; S.draw.rrect(c, xw - 6 * us, yG, 12 * us, yEnd - yG - 10 * us, 5); ctx.fill(); ctx.fillStyle = "#d8402e"; ctx.beginPath(); ctx.arc(xw + 3, yEnd - 8 * us, 7 * us, 0, 6.2832); ctx.fill(); ctx.restore();
        ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.5; for (var rr = 0; rr < 2; rr++){ var ph3 = (tm * 0.5 + rr * 0.5) % 1; ctx.globalAlpha = 1 - ph3; ctx.beginPath(); ctx.ellipse(xw, yG, (10 + ph3 * 22) * us, (2.5 + ph3 * 4) * us, 0, 0, 6.2832); ctx.stroke(); } ctx.restore(); };
      var ys = thermo(xs, ysg, Lt, ts, ymax, step, sandBury), yw = thermo(xw, ywg, Lt, tw, ymax, step, seaBury);
      var dw = Math.max(72, 86 * us), dh = Math.max(36, 42 * us);
      S.draw.display(c, S.fmt(ts, 0) + " °C", xs, ys - dh / 2 - 8, {w: dw, h: dh, caption: "SABLE", size: Math.round(dh * 0.42), screen: ts > 45 ? "#ffe1d2" : "#e8f3ec", color: ts > 45 ? "#b0261a" : "#13233a"});
      S.draw.display(c, S.fmt(tw, 0) + " °C", xw, yw - dh / 2 - 8, {w: dw, h: dh, caption: "MER", size: Math.round(dh * 0.42), screen: "#dff0fb"});
      var lab1 = comp.value === "m" ? "1 kg de sable · c = 0,80" : "1 L de sable (1,6 kg) · c = 0,80", lab2 = comp.value === "m" ? "1 kg d'eau · c = 4,18" : "1 L d'eau (1 kg) · c = 4,18";
      S.draw.label(c, lab1, Math.max(x0 + 70 * us + 20, xs), yB - 12 * us - 4, {color: "#8a5a12", size: Math.max(10, 11.5 * us)});
      S.draw.label(c, lab2, Math.min(x0 + sw - 64 * us - 18, xw - 10), yB - 12 * us - 4, {color: pal.acc, size: Math.max(10, 11.5 * us)});
      /* l'enfant sur le sable */
      var mood = ts >= 45 ? 2 : ts >= 35 ? 1 : 0, kx = x0 + sw * 0.41, ky = y0 + sh * 0.91;
      kid(kx, ky, sh * 0.3, mood);
      if (mood === 2) bubble("Aïe ! Ça brûle !", kx + 4, ky - sh * 0.3 - 22 * us, pal.red, Math.max(11, 13 * us));
      else if (mood === 1) bubble("C'est chaud…", kx + 4, ky - sh * 0.3 - 22 * us, pal.amber, Math.max(11, 13 * us));
      if (mood === 2 && tw < 30) bubble("Ici, c'est frais !", bx, by - 16 * us, pal.acc, Math.max(10, 12 * us));
      S.draw.display(c, S.fmt(tv, 0) + " min", x0 + 50 * Math.max(0.8, us), y0 + 30 * Math.max(0.8, us), {w: Math.max(80, 92 * us), h: Math.max(36, 42 * us), caption: "AU SOLEIL", size: Math.round(Math.max(36, 42 * us) * 0.4)});
      ctx.restore();
      /* ---------- graphe ---------- */
      var gx = wide ? sw : 0, gy = wide ? 0 : sh, gw = wide ? W - sw : W, gh = wide ? H : GH;
      ctx.save(); ctx.fillStyle = "#ffffff"; ctx.fillRect(gx, gy, gw, gh); ctx.fillStyle = "#e3e7ed"; if (wide) ctx.fillRect(gx, gy, 1, gh); else ctx.fillRect(gx, gy, gw, 1); ctx.restore();
      S.draw.text(c, "Température des deux échantillons", gx + 12, gy + 14, {size: 12, align: "left", color: pal.grey});
      var ax = S.draw.axes(c, {x0: 0, x1: 60, y0: 0, y1: ymax, xl: "durée (min)", yl: "T (°C)", stepX: 10, stepY: step, l: gx + 50, r: W - gx - gw + 14, t: gy + 30, b: H - gy - gh + 34});
      S.draw.fn(c, ax, Ts, S.draw.tint(pal.amber, 0.3), 2); S.draw.fn(c, ax, Tw, S.draw.tint(pal.acc, 0.3), 2);
      S.draw.fn(c, ax, function(x){ return x <= tv + 1e-9 ? Ts(x) : NaN; }, pal.amber, 3.2); S.draw.fn(c, ax, function(x){ return x <= tv + 1e-9 ? Tw(x) : NaN; }, pal.acc, 3.2);
      S.draw.text(c, "sable", ax.X(60) - 6, ax.Y(Ts(60)) + 12, {size: 12, color: pal.amber, align: "right"}); S.draw.text(c, "eau", ax.X(60) - 6, ax.Y(Tw(60)) - 12, {size: 12, color: pal.acc, align: "right"});
      S.draw.line(c, ax.X(tv), ax.T, ax.X(tv), ax.B, pal.grey, 1.2, [4, 4]);
      S.draw.dot(c, ax.X(tv), ax.Y(ts), 6, pal.amber); S.draw.dot(c, ax.X(tv), ax.Y(tw), 6, pal.acc);
      if (ymax >= 100) S.draw.line(c, ax.X(0), ax.Y(100), ax.X(60), ax.Y(100), pal.red, 1, [3, 4]);
      var ds = ts - T0, dw2 = tw - T0, E = PW * tv * 60;
      ro.set(0, S.fmt(E / 1000, 1) + " kJ"); ro.set(1, S.fmt(ds, 1) + " K → " + S.fmt(ts, 0) + " °C"); ro.set(2, S.fmt(dw2, 1) + " K → " + S.fmt(tw, 0) + " °C"); ro.set(3, dw2 > 1e-9 ? S.fmt(ds / dw2, 1) : "—");
      var ratioTheo = comp.value === "m" ? CW / CS : CW / (CS * RS);
      nt.set(tw > 100 ? "L'eau dépasserait 100 °C : elle bouillirait, le modèle n'est plus valable. (Rapport théorique " + S.fmt(ratioTheo, 1) + ".)" : "Rapport théorique = c(eau)/c(sable)" + (comp.value === "v" ? " ÷ 1,6 (masse volumique du sable)" : "") + " = " + S.fmt(ratioTheo, 1) + " : il ne dépend ni de P ni de t.", tw > 100 ? "warn" : "");
    });
  }
});
