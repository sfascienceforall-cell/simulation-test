/* Biologie BA1 · chapitre 10 : populations (évolution, génétique des populations, écologie) */
(function(){
function erfc(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z); var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* 1. Hardy-Weinberg */
SFA.sim({
  id:"ub-c10-hardy-weinberg", ch:"c10", tag:"Génétique des populations",
  titre:"Hardy-Weinberg : porteurs, incidence et test d'équilibre",
  resume:"De l'incidence d'une maladie récessive à la fréquence des porteurs ; test χ² d'équilibre.",
  but:"Prédis les fréquences génotypiques à partir de q ou de l'incidence, puis teste un échantillon observé contre l'équilibre.",
  aRetenir:"À l'équilibre (population grande, panmixie, sans mutation, migration ni sélection) : p + q = 1 ; fréquences AA = p², Aa = 2pq, aa = q². Incidence q² → q = √incidence. Les porteurs sont bien plus nombreux que les malades : rapport 2pq / q² = 2p/q. Mucoviscidose (incidence ≈ 1/2 500) : q = 0,02, porteurs 2pq ≈ 3,9 % (≈ 1 sur 25,5). Test d'équilibre : χ² sur 3 classes avec 1 degré de liberté (3 classes − 1 − 1 paramètre estimé), seuil à 5 % = 3,84.",
  piege:"Ne pas confondre q (fréquence de l'allèle) et q² (fréquence des malades). Les attendus se calculent avec les fréquences alléliques estimées sur l'échantillon, d'où 1 seul degré de liberté. L'équilibre n'est pas une preuve d'absence de sélection : il est atteint en une génération de panmixie.",
  build:function(k,S){
    var c = k.canvas(290), pal = S.draw.palette;
    var mode = k.seg("Prédiction à partir de", [["q","q"],["i","L'incidence 1/N"]], "i");
    var qs = k.slider("q (si choisi)", 0.005, 0.5, 0.005, 0.02, "");
    var ns = k.slider("Incidence : 1 sur N", 100, 10000, 100, 2500, "");
    var a1 = k.slider("Échantillon : AA", 0, 1000, 10, 640, "");
    var a2 = k.slider("Échantillon : Aa", 0, 1000, 10, 310, "");
    var a3 = k.slider("Échantillon : aa", 0, 1000, 10, 50, "");
    var ro = k.readouts(["q","Porteurs 2pq","Porteurs / malades","χ² (échantillon)","p"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var q = mode.value === "q" ? qs.value : Math.sqrt(1 / ns.value), p = 1 - q, f = [p * p, 2 * p * q, q * q], ctx = c.ctx, pal2 = [pal.green, pal.amber, pal.red], nm = ["AA","Aa (porteurs)","aa (malades)"];
      S.draw.text(c, "Équilibre prédit", 20, 18, {align:"left", size:12, weight:600});
      f.forEach(function(v, i){ var y = 36 + i * 28; ctx.fillStyle = "#e3e7ed"; ctx.fillRect(110, y, c.W - 190, 18); ctx.fillStyle = pal2[i]; ctx.fillRect(110, y, Math.max(1, v * (c.W - 190)), 18);
        S.draw.text(c, nm[i], 14, y + 9, {align:"left", size:11}); S.draw.text(c, S.fmt(v * 100, 2) + " %", c.W - 76, y + 9, {align:"left", size:11}); });
      var n = a1.value + a2.value + a3.value, chi = NaN, pv = NaN;
      S.draw.text(c, "Échantillon observé (attendus avec p̂ estimé)", 20, 140, {align:"left", size:12, weight:600});
      if (n > 0){
        var ph = (2 * a1.value + a2.value) / (2 * n), qh = 1 - ph, ex = [ph * ph * n, 2 * ph * qh * n, qh * qh * n], ob = [a1.value, a2.value, a3.value], i;
        chi = 0; for (i = 0; i < 3; i++) if (ex[i] > 0) chi += Math.pow(ob[i] - ex[i], 2) / ex[i];
        pv = erfc(Math.sqrt(chi / 2));
        var mx = Math.max.apply(null, ob.concat(ex)) * 1.1 || 1, bw = (c.W - 60) / 3;
        for (i = 0; i < 3; i++){ var x = 30 + i * bw, h1 = ob[i] / mx * 90, h2 = ex[i] / mx * 90;
          ctx.fillStyle = pal.acc; ctx.fillRect(x + 6, 250 - h1, bw / 2 - 10, h1); ctx.fillStyle = "#cfd6e0"; ctx.fillRect(x + bw / 2 - 2, 250 - h2, bw / 2 - 10, h2);
          S.draw.text(c, nm[i].split(" ")[0], x + bw / 2 - 2, 266, {size:11}); S.draw.text(c, ob[i] + "", x + bw / 4 + 1, 250 - h1 - 8, {size:10, color:pal.acc}); S.draw.text(c, S.fmt(ex[i], 0), x + 3 * bw / 4 - 7, 250 - h2 - 8, {size:10, color:pal.grey}); }
      }
      ro.set(0, S.fmt(q, 4)); ro.set(1, S.fmt(2 * p * q * 100, 2) + " % (1/" + S.fmt(1 / (2 * p * q), 1) + ")"); ro.set(2, S.fmt(2 * p / q, 1));
      ro.set(3, isNaN(chi) ? "—" : S.fmt(chi, 2)); ro.set(4, isNaN(pv) ? "—" : (pv < 0.001 ? "&lt; 0,001" : S.fmt(pv, 3)));
      var lowE = n > 0 && (2 * ((2 * a1.value + a2.value) / (2 * n)) * (1 - (2 * a1.value + a2.value) / (2 * n)) * n < 5 || Math.pow(1 - (2 * a1.value + a2.value) / (2 * n), 2) * n < 5 || Math.pow((2 * a1.value + a2.value) / (2 * n), 2) * n < 5);
      note.set(isNaN(chi) ? "Choisis un échantillon non vide." : (chi > 3.841 ? "χ² &gt; 3,84 (1 ddl) : écart significatif à l'équilibre (p &lt; 0,05)." : "χ² ≤ 3,84 : échantillon compatible avec l'équilibre de Hardy-Weinberg.") + (lowE ? " Attention : au moins un effectif attendu est inférieur à 5 : le test du χ² est peu fiable." : ""), (chi > 3.841 || lowE) ? "warn" : "ok");
    });
  }
});

/* 2. Dérive génétique */
SFA.sim({
  id:"ub-c10-derive", ch:"c10", tag:"Dérive",
  titre:"Dérive génétique : le hasard dans les petites populations",
  resume:"20 populations simulées : fixation, perte d'allèle, goulot d'étranglement.",
  but:"Fais varier l'effectif et la fréquence initiale ; ajoute un goulot et compte les populations où l'allèle se fixe ou disparaît.",
  aRetenir:"Dérive : variation aléatoire des fréquences alléliques due à l'échantillonnage des gamètes, d'autant plus forte que l'effectif N est petit (variance ≈ p(1−p)/2N par génération). Sans sélection, la probabilité de fixation d'un allèle égale sa fréquence initiale ; l'hétérozygotie décroît comme H<sub>t</sub> = H<sub>0</sub>(1 − 1/2N)<sup>t</sup>. Effet fondateur et goulot d'étranglement : réduction brutale et aléatoire de la diversité.",
  piege:"La dérive ne favorise pas l'allèle « le plus adapté » : elle est aveugle. Ce n'est pas de la sélection. Des populations identiques au départ divergent. Modèle de Wright-Fisher simplifié : effectif constant (sauf goulot), générations séparées, pas de sélection ni de mutation.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette, seed = 4242;
    var N = k.slider("Effectif N (individus diploïdes)", 5, 300, 5, 50, "");
    var p0 = k.slider("Fréquence initiale p₀", 0.1, 0.9, 0.05, 0.5, "");
    var gob = k.toggle("Goulot d'étranglement (générations 40 à 50 : N = 5)", false);
    k.button("Nouveau tirage", function(){ seed += 1013; }, true);
    var ro = k.readouts(["Fixées (p = 1)","Perdues (p = 0)","H observée moyenne","H théorique (sans goulot)"]);
    k.draw(function(){
      c.clear();
      var G = 100, R = 20, rnd = rng(seed + N.value * 7 + Math.round(p0.value * 100)), runs = [], r, g, i, fix = 0, lost = 0, hsum = 0;
      for (r = 0; r < R; r++){
        var p = p0.value, tr = [p];
        for (g = 1; g <= G; g++){ var n2 = 2 * ((gob.value && g >= 40 && g < 50) ? 5 : N.value), cnt = 0; if (p > 0 && p < 1){ for (i = 0; i < n2; i++) if (rnd() < p) cnt++; p = cnt / n2; } tr.push(p); }
        runs.push(tr); if (p >= 1) fix++; else if (p <= 0) lost++; hsum += 2 * p * (1 - p);
      }
      var ax = S.draw.axes(c, {t:28,x0:0, x1:G, y0:0, y1:1, xl:"générations", yl:"p", stepX:20, stepY:0.25});
      var cols = [pal.acc, pal.red, pal.green, pal.violet, pal.amber, pal.teal];
      runs.forEach(function(tr, j){ c.ctx.save(); c.ctx.strokeStyle = cols[j % 6]; c.ctx.globalAlpha = 0.75; c.ctx.lineWidth = 1.6; c.ctx.beginPath(); tr.forEach(function(v, t){ if (t === 0) c.ctx.moveTo(ax.X(t), ax.Y(v)); else c.ctx.lineTo(ax.X(t), ax.Y(v)); }); c.ctx.stroke(); c.ctx.restore(); });
      if (gob.value){ c.ctx.fillStyle = "rgba(180,35,24,.08)"; c.ctx.fillRect(ax.X(40), ax.T, ax.X(50) - ax.X(40), ax.B - ax.T); }
      ro.set(0, fix + " / " + R); ro.set(1, lost + " / " + R); ro.set(2, S.fmt(hsum / R, 3)); ro.set(3, S.fmt(2 * p0.value * (1 - p0.value) * Math.pow(1 - 1 / (2 * N.value), G), 3));
    });
  }
});

/* 3. Sélection naturelle */
SFA.sim({
  id:"ub-c10-selection", ch:"c10", tag:"Sélection",
  titre:"Sélection naturelle : avantage de l'hétérozygote",
  resume:"Évolution de p selon les valeurs sélectives ; drépanocytose et paludisme.",
  but:"Règle les valeurs sélectives des trois génotypes, suis p génération après génération et compare à l'équilibre prévu.",
  aRetenir:"Valeur sélective (fitness) w : survie et reproduction relatives. p' = (p²·w<sub>AA</sub> + p·q·w<sub>Aa</sub>) / w̄ avec w̄ = p²w<sub>AA</sub> + 2pq·w<sub>Aa</sub> + q²w<sub>aa</sub>. Si w<sub>Aa</sub> est supérieur aux deux homozygotes, un équilibre stable polymorphe existe : p̂ = (w<sub>Aa</sub> − w<sub>aa</sub>) / (2w<sub>Aa</sub> − w<sub>AA</sub> − w<sub>aa</sub>). Drépanocytose : l'hétérozygote HbAS est protégé du paludisme grave, l'homozygote SS est très défavorisé : l'allèle S se maintient dans les régions impaludées.",
  piege:"Contre un allèle récessif létal (w<sub>aa</sub> = 0), la fréquence de a diminue lentement quand a est rare (les hétérozygotes l'abritent) : q<sub>t</sub> = q₀ / (1 + t·q₀). Les valeurs de w de la drépanocytose sont des exemples pédagogiques ordre de grandeur, variables selon l'environnement.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var wA, wH, wa, p0, gens;
    var pre = k.select("Situation type", [["c","Personnalisée"],["s","Drépanocytose en zone impaludée (HbA = A, HbS = a)"],["l","Contre un allèle récessif létal"],["d","Avantage de l'allèle dominant A"],["n","Neutre (dérive absente)"]], "s", function(v){
      var P = {s:[0.85,1,0.2], l:[1,1,0], d:[1,1,0.7], n:[1,1,1]}[v];
      if (P){ wA.set(P[0]); wH.set(P[1]); wa.set(P[2]); }
    });
    wA = k.slider("w(AA)", 0, 1, 0.05, 0.85, "");
    wH = k.slider("w(Aa)", 0, 1, 0.05, 1, "");
    wa = k.slider("w(aa)", 0, 1, 0.05, 0.2, "");
    p0 = k.slider("p₀ (fréquence de A)", 0.01, 0.99, 0.01, 0.9, "");
    gens = k.slider("Générations", 10, 200, 10, 100, "");
    var ro = k.readouts(["p final","p̂ d'équilibre","w̄ final","Régime"]);
    k.draw(function(){
      c.clear();
      var p = p0.value, tr = [p], g, wb;
      for (g = 0; g < gens.value; g++){ var q = 1 - p; wb = p * p * wA.value + 2 * p * q * wH.value + q * q * wa.value; if (wb > 0) p = (p * p * wA.value + p * q * wH.value) / wb; tr.push(p); }
      var q2 = 1 - p; wb = p * p * wA.value + 2 * p * q2 * wH.value + q2 * q2 * wa.value;
      var ax = S.draw.axes(c, {t:28,x0:0, x1:gens.value, y0:0, y1:1, xl:"générations", yl:"p(A)", stepX:gens.value > 100 ? 50 : 20, stepY:0.25});
      S.draw.fn(c, ax, function(x){ var i = Math.min(tr.length - 1, Math.round(x)); return tr[i]; }, pal.acc, 2.6);
      var den = 2 * wH.value - wA.value - wa.value, ph = NaN, regime;
      if (wH.value > wA.value && wH.value > wa.value){ ph = (wH.value - wa.value) / den; regime = "Avantage de l'hétérozygote : polymorphisme stable"; }
      else if (wH.value < wA.value && wH.value < wa.value){ ph = (wH.value - wa.value) / den; regime = "Désavantage de l'hétérozygote : équilibre instable"; }
      else if (wA.value === wH.value && wH.value === wa.value) regime = "Neutre";
      else regime = (wA.value >= wa.value) ? "Sélection directionnelle : A tend à se fixer" : "Sélection directionnelle : a tend à se fixer";
      if (!isNaN(ph) && ph >= 0 && ph <= 1) S.draw.line(c, ax.L, ax.Y(ph), ax.R, ax.Y(ph), pal.red, 1.5, [5, 4]);
      ro.set(0, S.fmt(p, 3)); ro.set(1, isNaN(ph) ? "—" : S.fmt(ph, 3)); ro.set(2, S.fmt(wb, 3)); ro.set(3, regime);
    });
  }
});

/* 4. Croissance de population */
SFA.sim({
  id:"ub-c10-logistique", ch:"c10", tag:"Écologie",
  titre:"Croissance exponentielle et logistique ; instabilité du modèle discret",
  resume:"Capacité de charge K, taux r, point d'inflexion, cycles et chaos du modèle de Ricker.",
  but:"Compare la croissance exponentielle à la logistique, puis passe au modèle discret et augmente r pour voir apparaître des oscillations.",
  aRetenir:"Exponentielle : dN/dt = rN. Logistique : dN/dt = rN(1 − N/K), N(t) = K / (1 + ((K − N₀)/N₀)·e<sup>−rt</sup>). Vitesse maximale rK/4 pour N = K/2 (point d'inflexion). Modèle discret de Ricker N<sub>t+1</sub> = N<sub>t</sub>·e<sup>r(1−N<sub>t</sub>/K)</sup> : équilibre stable si r &lt; 2, cycles de période 2 puis 4 au-delà, comportement chaotique vers r ≈ 2,7.",
  piege:"K n'est pas un maximum « absolu » : c'est l'équilibre dépendant des ressources. Le taux r de croissance par individu diminue avec la densité (rétroaction négative), la population totale accélère puis ralentit. Dans le modèle discret, un grand r déstabilise : la population dépasse K puis s'effondre.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var mode = k.seg("Modèle", [["c","Continu (logistique)"],["d","Discret (Ricker)"]], "c");
    var r = k.slider("r", 0.1, 3, 0.05, 0.5, "");
    var K = k.slider("K", 100, 1000, 50, 500, "");
    var n0 = k.slider("N₀", 1, 200, 1, 10, "");
    var T = k.slider("Durée", 20, 100, 10, 40, "");
    var ro = k.readouts(["Vitesse max rK/4","N = K/2 atteint à","Temps de doublement initial","Comportement"]);
    k.draw(function(){
      c.clear();
      var ymax = Math.max(K.value * 1.6, 200, n0.value * 1.1, (mode.value === "d" && r.value > 1) ? K.value * Math.exp(r.value - 1) / r.value * 1.1 : 0), ax = S.draw.axes(c, {t:28,x0:0, x1:T.value, y0:0, y1:ymax, xl:"t", yl:"N", stepX:T.value > 50 ? 20 : 10});
      var N0 = Math.min(n0.value, K.value * 1.5), beh = "";
      S.draw.line(c, ax.L, ax.Y(K.value), ax.R, ax.Y(K.value), pal.grey, 1.5, [5, 4]); S.draw.text(c, "K", ax.L + 8, ax.Y(K.value) - 9, {size:12, color:pal.grey});
      if (mode.value === "c"){
        S.draw.fn(c, ax, function(t){ return N0 * Math.exp(r.value * t); }, pal.red, 1.8, [4, 4]);
        S.draw.fn(c, ax, function(t){ return K.value / (1 + (K.value - N0) / N0 * Math.exp(-r.value * t)); }, pal.acc, 2.6);
        beh = "Convergence vers K";
      } else {
        var N = N0, ctx = c.ctx, mn = 1e9, mxv = 0; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(N));
        for (var t = 1; t <= T.value; t++){ N = N * Math.exp(r.value * (1 - N / K.value)); ctx.lineTo(ax.X(t), ax.Y(N)); if (t > T.value / 2){ mn = Math.min(mn, N); mxv = Math.max(mxv, N); } }
        ctx.stroke(); ctx.fillStyle = pal.acc; N = N0; for (t = 0; t <= T.value; t++){ ctx.beginPath(); ctx.arc(ax.X(t), ax.Y(N), 2.6, 0, 6.3); ctx.fill(); N = N * Math.exp(r.value * (1 - N / K.value)); } ctx.restore();
        beh = r.value < 2 ? "Équilibre stable" : r.value < 2.52 ? "Cycle de période 2" : r.value < 2.69 ? "Cycles de période ≥ 4" : "Chaotique";
      }
      var inf = N0 < K.value / 2 ? Math.log((K.value - N0) / N0) / r.value : 0;
      ro.set(0, mode.value === "d" ? "— (modèle continu seulement)" : S.fmt(r.value * K.value / 4, 1) + " ind./unité"); ro.set(1, mode.value === "d" ? "— (modèle continu seulement)" : N0 < K.value / 2 ? "t = " + S.fmt(inf, 1) : "déjà dépassé"); ro.set(2, S.fmt(Math.LN2 / r.value, 2)); ro.set(3, beh);
    });
  }
});

/* 5. Lotka-Volterra */
SFA.sim({
  id:"ub-c10-lotka-volterra", ch:"c10", tag:"Dynamique",
  titre:"Proies et prédateurs : oscillations de Lotka-Volterra",
  resume:"Deux populations couplées : cycles, équilibre, effet d'une capacité de charge des proies.",
  but:"Modifie les taux, les effectifs de départ et ajoute (ou non) une capacité de charge des proies ; compare la série temporelle et le portrait de phase.",
  aRetenir:"dx/dt = αx − βxy (proies x), dy/dt = δxy − γy (prédateurs y). Équilibre : x* = γ/δ, y* = α/β. Autour de l'équilibre, la période est ≈ 2π/√(αγ). Le pic des prédateurs suit celui des proies (décalage ≈ 1/4 de période). Avec une capacité de charge K pour les proies, les oscillations s'amortissent vers l'équilibre.",
  piege:"Les oscillations de la version de base sont neutres (l'amplitude dépend des conditions de départ) : modèle idéal, sans capacité de charge ni refuge ni stochasticité. Dans une vraie population, de petits effectifs mènent à l'extinction. Les prédateurs ne « causent » pas seuls les cycles : le modèle montre une rétroaction négative couplée.",
  build:function(k,S){
    var c1 = k.canvas(200), c2 = k.canvas(200), pal = S.draw.palette;
    var al = k.slider("α (croissance des proies)", 0.2, 1.2, 0.05, 0.6, "");
    var be = k.slider("β (prédation)", 0.01, 0.05, 0.005, 0.025, "");
    var ga = k.slider("γ (mortalité des prédateurs)", 0.2, 1, 0.05, 0.5, "");
    var de = k.slider("δ (conversion)", 0.005, 0.02, 0.001, 0.01, "");
    var x0 = k.slider("Proies initiales", 10, 100, 5, 40, "");
    var y0 = k.slider("Prédateurs initiaux", 5, 60, 5, 15, "");
    var kk = k.toggle("Proies : capacité de charge K", false);
    var Ks = k.slider("K", 60, 400, 10, 150, "");
    var ro = k.readouts(["Équilibre proies x*","Équilibre prédateurs y*","Période ≈ 2π/√(αγ)","Max proies"]), nt = k.note("", "ok");
    k.draw(function(){
      c1.clear(); c2.clear();
      var dt = 0.02, T = 60, steps = T / dt, x = x0.value, y = y0.value, X = [x], Y = [y], i, useK = kk.value, K = Ks.value;
      function f(x, y){ return [al.value * x * (useK ? (1 - x / K) : 1) - be.value * x * y, de.value * x * y - ga.value * y]; }
      for (i = 0; i < steps; i++){
        var a = f(x, y), b = f(x + dt / 2 * a[0], y + dt / 2 * a[1]), cc = f(x + dt / 2 * b[0], y + dt / 2 * b[1]), d = f(x + dt * cc[0], y + dt * cc[1]);
        x += dt / 6 * (a[0] + 2 * b[0] + 2 * cc[0] + d[0]); y += dt / 6 * (a[1] + 2 * b[1] + 2 * cc[1] + d[1]); x = Math.max(x, 1e-6); y = Math.max(y, 1e-6);
        if (i % 5 === 4){ X.push(x); Y.push(y); }
      }
      var mx = Math.max.apply(null, X), my = Math.max.apply(null, Y), top = Math.max(mx, my) * 1.1;
      var ax = S.draw.axes(c1, {x0:0, x1:T, y0:0, y1:top, xl:"t", yl:"effectifs", stepX:10, t:14, b:28});
      var ctx = c1.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      [[X, pal.green], [Y, pal.red]].forEach(function(s){ ctx.strokeStyle = s[1]; ctx.lineWidth = 2; ctx.beginPath(); s[0].forEach(function(v, j){ var t = j * 5 * dt; if (j === 0) ctx.moveTo(ax.X(t), ax.Y(v)); else ctx.lineTo(ax.X(t), ax.Y(v)); }); ctx.stroke(); }); ctx.restore();
      S.draw.text(c1, "proies", ax.R - 50, ax.T + 8, {size:11, color:pal.green}); S.draw.text(c1, "prédateurs", ax.R - 50, ax.T + 28, {size:11, color:pal.red});
      var xs = de.value > 0 ? ga.value / de.value : 0, ys = useK ? al.value * (1 - xs / K) / be.value : al.value / be.value;
      var ax2 = S.draw.axes(c2, {x0:0, x1:Math.max(mx, xs) * 1.1, y0:0, y1:Math.max(my, ys) * 1.1, xl:"proies", yl:"prédateurs", t:14, b:28});
      c2.ctx.save(); c2.ctx.beginPath(); c2.ctx.rect(ax2.L, ax2.T, ax2.R - ax2.L, ax2.B - ax2.T); c2.ctx.clip(); c2.ctx.strokeStyle = pal.acc; c2.ctx.lineWidth = 1.8; c2.ctx.beginPath();
      X.forEach(function(v, j){ if (j === 0) c2.ctx.moveTo(ax2.X(v), ax2.Y(Y[j])); else c2.ctx.lineTo(ax2.X(v), ax2.Y(Y[j])); }); c2.ctx.stroke(); c2.ctx.restore();
      if (ys > 0) S.draw.dot(c2, ax2.X(xs), ax2.Y(ys), 5, pal.ink);
      ro.set(0, S.fmt(xs, 1)); ro.set(1, ys > 0 ? S.fmt(ys, 1) : "0 (K ≤ x*)"); ro.set(2, S.fmt(2 * Math.PI / Math.sqrt(al.value * ga.value), 1) + (useK ? " (sans K, indicatif)" : "")); ro.set(3, S.fmt(mx, 0));
      var mnX = Math.min.apply(null, X), mnY = Math.min.apply(null, Y);
      nt.set(mnX < 1 || mnY < 1 ? "Un effectif descend sous 1 individu (" + (mnX < 1 ? "proies" : "prédateurs") + ") : dans une vraie population, il y aurait extinction. Le modèle déterministe ne le voit pas ; ce n'est plus réaliste." : "Effectifs en individus (unités arbitraires) ; modèle déterministe.", mnX < 1 || mnY < 1 ? "warn" : "ok");
    });
  }
});
})();

/* BIO3D-BEGIN:s_c10_selection.js */
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
  id:"ub-c10-vis-selection-phalenes", ch:"c10", tag:"Sélection · animé",
  titre:"Sélection naturelle sur une population : les phalènes du bouleau",
  resume:"Des oiseaux mangent les phalènes les plus visibles : suis génération après génération la fréquence de l'allèle sombre, avec la dérive en prime.",
  but:"Règle la couleur de l'écorce (pollution), la pression de prédation et la taille de la population, puis lance les générations : compare la population simulée à la prédiction déterministe.",
  aRetenir:"Sélection naturelle : les génotypes dont les porteurs survivent mieux (valeur sélective w plus élevée) deviennent plus fréquents. Avec l'allèle sombre D dominant (DD et Dd sombres, dd clair), p' = p·w<sub>sombre</sub> / w̄ avec w̄ = (1 − q²)·w<sub>sombre</sub> + q²·w<sub>clair</sub>. Sur écorce claire, le clair est favorisé ; sur écorce noircie, le sombre. Dans une petite population, la dérive ajoute du hasard : la fréquence peut s'écarter de la prédiction, voire fixer un allèle.",
  piege:"La sélection n'a pas de but et les individus ne s'adaptent pas : ils survivent ou non, ce sont les fréquences alléliques de la population qui changent. L'environnement (couleur de l'écorce) fixe quel phénotype est avantagé, il ne « fabrique » pas la mutation. Et un allèle dominant n'est pas forcément le plus fréquent : seule la valeur sélective compte. Modèle simplifié : accouplement au hasard, générations discrètes, prédation selon le contraste avec l'écorce.",
  build:function(k,S){
    var c = k.canvas(470), pal = P(S);
    var bark = k.slider("Écorce (0 = claire, 100 = noircie)", 0, 100, 5, 20, "");
    var pre = k.slider("Pression de prédation", 10, 90, 5, 60, "%");
    var nn = k.slider("Taille de la population (individus)", 20, 200, 10, 60, "");
    var p0 = k.slider("Fréquence initiale de l'allèle sombre (D)", 0.05, 0.95, 0.05, 0.3, "");
    var auto = k.toggle("Enchaîner les générations", false);
    var ro = k.readouts(["Génération", "Fréquence p(D)", "Fitness sombres / clairs", "Phénotype sombre"]);
    var info = k.note("", "ok");
    var seed = 4;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var moths = [], hist = [], gen = 0, p = p0.value, phase = 0, tm = 0, birds = [], running = false, tt = 0, lastN = 0;
    function fit(){
      var b = bark.value / 100, s = pre.value / 100;
      var vd = Math.abs(0.12 - (0.9 - 0.8 * b)), vl = Math.abs(0.85 - (0.9 - 0.8 * b));   /* contraste avec l'écorce (ton 0 = noir, 1 = blanc) */
      return {wd:1 - s * vd / 0.9 * 1.0, wl:1 - s * vl / 0.9 * 1.0, vd:vd, vl:vl};
    }
    function spawn(){
      moths = [];
      var N = nn.value;
      for (var i = 0; i < N; i++){
        var g = (rnd() < p ? 1 : 0) + (rnd() < p ? 1 : 0);   /* nombre d'allèles D */
        moths.push({g:g, dark:g > 0, x:30 + rnd() * (c.W - 60), y:30 + rnd() * (c.H * 0.56 - 40), r:rnd() * 6.28, eaten:false, a:1, tgt:null});
      }
      lastN = N;
    }
    function reset(){ seed = 4; p = p0.value; gen = 0; hist = [p]; phase = 0; tm = 0; birds = []; running = false; spawn(); }
    function predict(from, n){
      var f = fit(), out = [from], q = from;
      for (var i = 0; i < n; i++){ var qq = 1 - q, wb = (1 - qq * qq) * f.wd + qq * qq * f.wl; q = q * f.wd / wb; out.push(q); }
      return out;
    }
    function R(){
      c.clear(); var ctx = c.ctx, H1 = Math.round(c.H * 0.6);
      var b = bark.value / 100, tone = Math.round(235 - 190 * b);
      /* écorce */
      ctx.fillStyle = "rgb(" + tone + "," + tone + "," + Math.round(tone * 0.95) + ")"; ctx.fillRect(0, 0, c.W, H1);
      ctx.strokeStyle = "rgba(0,0,0,0.13)"; ctx.lineWidth = 2;
      for (var x = 8; x < c.W; x += 26){ ctx.beginPath(); ctx.moveTo(x, 0); for (var y = 0; y <= H1; y += 16) ctx.lineTo(x + 5 * Math.sin(y * 0.09 + x), y); ctx.stroke(); }
      /* phalènes */
      moths.forEach(function(m){
        if (m.a <= 0.02) return;
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.r); ctx.globalAlpha = m.a;
        var col = m.dark ? "#2b2b30" : "#f0eee6", edge = m.dark ? "#000" : "#a9a69a";
        ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(-11, 5); ctx.lineTo(-7, 9); ctx.lineTo(0, 5); ctx.lineTo(7, 9); ctx.lineTo(11, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, 1, 2.2, 7, 0, 0, 6.3); ctx.fillStyle = m.dark ? "#000" : "#8a8678"; ctx.fill();
        ctx.restore();
      });
      /* oiseaux */
      birds.forEach(function(bd){
        ctx.save(); ctx.translate(bd.x, bd.y); ctx.fillStyle = "#b45309"; ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(0, 0, 12, 7, 0, 0, 6.3); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, -2); ctx.lineTo(19, 1); ctx.lineTo(10, 3); ctx.closePath(); ctx.fillStyle = "#facc15"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(-8, -13 + 4 * Math.sin(tt * 20)); ctx.lineTo(3, -3); ctx.fillStyle = "#92400e"; ctx.fill(); ctx.restore();
      });
      /* graphique p(t) */
      var ax = S.draw.axes(c, {t:28,x0:0, x1:Math.max(10, hist.length + 2), y0:0, y1:1, l:40, r:12, t:H1 + 18, b:26, stepY:0.25, xl:"génération"});
      var pr = predict(hist[0], Math.max(10, hist.length + 2));
      c.ctx.save(); c.ctx.setLineDash([5, 4]); c.ctx.strokeStyle = pal.grey; c.ctx.lineWidth = 2; c.ctx.beginPath();
      pr.forEach(function(q, i){ var X = ax.X(i), Y = ax.Y(q); if (i) c.ctx.lineTo(X, Y); else c.ctx.moveTo(X, Y); }); c.ctx.stroke(); c.ctx.restore();
      c.ctx.strokeStyle = pal.acc; c.ctx.lineWidth = 2.5; c.ctx.beginPath();
      hist.forEach(function(q, i){ var X = ax.X(i), Y = ax.Y(q); if (i) c.ctx.lineTo(X, Y); else c.ctx.moveTo(X, Y); }); c.ctx.stroke();
      hist.forEach(function(q, i){ S.draw.dot(c, ax.X(i), ax.Y(q), 3.5, pal.acc); });
      S.draw.text(c, "p(D) : simulée (bleu) · prédite sans dérive (pointillés)", ax.L + 6, H1 + 28, {size:10.5, align:"left", color:pal.grey});
      var f = fit(), nd = moths.filter(function(m){ return m.dark; }).length;
      ro.set(0, gen); ro.set(1, S.fmt(p, 3)); ro.set(2, S.fmt(f.wd, 2) + " / " + S.fmt(f.wl, 2)); ro.set(3, S.fmt(nd / Math.max(1, moths.length) * 100, 0) + " %");
      var fav = f.wd > f.wl + 0.01 ? "les sombres sont favorisés (mieux camouflés)" : f.wl > f.wd + 0.01 ? "les clairs sont favorisés (mieux camouflés)" : "aucun phénotype n'est favorisé";
      var s = f.wd - f.wl;
      info.set("Écorce " + (b < 0.4 ? "claire" : b > 0.6 ? "noircie" : "intermédiaire") + " : " + fav + ". Coefficient de sélection contre le moins bien camouflé : s ≈ " + S.fmt(Math.abs(s), 2) + ". " + (phase === 1 ? "Les oiseaux chassent…" : phase === 2 ? "Les survivants se reproduisent : nouvelle fréquence allélique." : ""), "ok");
    }
    function cycle(dt){
      tm += dt;
      if (phase === 0){ if (tm > 0.8){ phase = 1; tm = 0; var f = fit(), cand = [];
          moths.forEach(function(m){ var w = m.dark ? f.wd : f.wl; if (rnd() > w) m.eaten = true; });
          cand = moths.filter(function(m){ return m.eaten; }); birds = [];
          var nb = Math.min(3, Math.max(1, Math.ceil(cand.length / 8)));
          for (var i = 0; i < nb; i++) birds.push({x:-30 - i * 40, y:20 + i * 40, hits:cand.filter(function(_, j){ return j % nb === i; }), k:0, t:0});
        } }
      else if (phase === 1){
        var done = true;
        birds.forEach(function(bd){
          var m = bd.hits[bd.k];
          if (!m){ bd.x += 260 * dt; bd.y -= 40 * dt; return; }
          done = false; bd.x += (m.x - bd.x) * Math.min(1, dt * 4.5); bd.y += (m.y - bd.y) * Math.min(1, dt * 4.5);
          if (Math.hypot(m.x - bd.x, m.y - bd.y) < 10){ m.a = 0; bd.k++; }
        });
        if (done && birds.every(function(b2){ return b2.x > c.W + 20 || !b2.hits[b2.k]; }) && (tm > 0.5)){ if (birds.every(function(b2){ return !b2.hits[b2.k]; })){ phase = 2; tm = 0; birds = []; } }
        if (tm > 6){ moths.forEach(function(m){ if (m.eaten) m.a = 0; }); phase = 2; tm = 0; birds = []; }
      }
      else if (phase === 2){
        if (tm > 0.9){
          var surv = moths.filter(function(m){ return !m.eaten; }), tot = 0, dd = 0;
          surv.forEach(function(m){ dd += m.g; tot += 2; });
          if (tot === 0) { p = p; } else p = dd / tot;
          gen++; hist.push(p); spawn(); phase = 0; tm = 0;
          if (!auto.value) running = false;
        }
      }
    }
    k.button("Génération suivante", function(){ if (!running){ running = true; phase = 0; tm = 0; } }, true);
    k.button("Réinitialiser", function(){ reset(); });
    var pp = p0.el;
    p0.el.addEventListener("change", function(){ reset(); });
    nn.el.addEventListener("change", function(){ reset(); });
    reset(); k.draw(R);
    var lp = k.loop(function(dt){ tt += dt; if (auto.value && !running) running = true; if (running) cycle(dt * 1.0); moths.forEach(function(m){ if (!m.eaten) m.r += (rnd() - 0.5) * 0.02; }); R(); }); lp.play();
  }
});

})();
/* BIO3D-END:s_c10_selection.js */
