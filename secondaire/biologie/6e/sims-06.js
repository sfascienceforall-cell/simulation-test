/* Chapitre 6 · Évolution : sélection naturelle et adaptation */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c06-phalenes", ch: "c06", tag: "Classique",
  titre: "Phalènes du bouleau : l'environnement trie les phénotypes",
  resume: "Selon la couleur de l'écorce, les oiseaux mangent plus souvent la forme claire ou la forme foncée : la population évolue génération après génération.",
  but: "Règle le noircissement de l'écorce (suie), l'intensité de la prédation et la proportion initiale de phalènes foncées, puis lance les générations. Le graphe montre la proportion de formes foncées ; les phalènes visibles sur l'écorce sont celles de la génération affichée.",
  aRetenir: "Variation héréditaire (formes claire et foncée) + survie différentielle (les phalènes mal camouflées sont davantage mangées) = changement de la fréquence des formes au fil des générations. Les individus ne changent pas de couleur : c'est la composition de la population qui change. Avec les valeurs par défaut, la forme foncée passe d'environ 1 % à plus de 95 % en une cinquantaine de générations, comme à Manchester au 19e siècle.",
  piege: "La population ne « décide » pas de s'adapter : la sélection ne crée pas la forme foncée, elle trie des formes déjà présentes. Si l'écorce est à moitié noircie (50 %), aucune forme n'est avantagée. Modèle simplifié : un seul gène, grande population, générations séparées.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, g = 0;
    var t = k.slider("Noircissement de l'écorce (suie)", 0, 100, 5, 100, "%", function(){ g = 0; lp.pause(); showAll = true; });
    var m = k.slider("Intensité de la prédation", 0, 0.6, 0.05, 0.2, "", function(){ showAll = true; });
    var p0 = k.slider("Phalènes foncées au départ", 1, 99, 1, 1, "%", function(){ showAll = true; });
    var showAll = true, GEN = 60;
    var lp = k.loop(function(dt){ g += dt * 6; if (g >= GEN){ g = GEN; lp.pause(); } k.redraw(); });
    k.button("Lancer les générations", function(){ g = 0; showAll = false; lp.play(); }, true);
    var ro = k.readouts(["Survie forme foncée", "Survie forme claire", "% de foncées à la génération affichée", "Générations pour dépasser 50 %"]);
    var note = k.note("", "");
    var pos = [], r = B.rng(99); for (var i = 0; i < 90; i++) pos.push([r(), r()]);
    function moth(x, y, dark){ var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.fillStyle = dark ? "#1f2227" : "#f3efe4"; ctx.strokeStyle = dark ? "#d8d6cf" : "#2c3a4e"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 8, 4.5, 0, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.restore(); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, tt = t.value / 100, mm = m.value;
      var wd = 1 - mm * (0.25 + 0.75 * (1 - tt)), wl = 1 - mm * (0.25 + 0.75 * tt), pr = [p0.value / 100], q;
      for (q = 1; q <= GEN; q++){ var pp = pr[q - 1]; pr.push(pp * wd / (pp * wd + (1 - pp) * wl)); }
      var gi = showAll ? GEN : Math.floor(g), pc = pr[gi];
      /* écorce et phalènes */
      var by = 8, bh = 120, lum = Math.round(215 - tt * 165); ctx.fillStyle = "rgb(" + lum + "," + (lum - 3) + "," + (lum - 8) + ")"; ctx.fillRect(10, by, c.W - 20, bh);
      for (q = 0; q < 8; q++){ ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.beginPath(); ctx.moveTo(10 + q * (c.W - 20) / 8 + 10, by); ctx.lineTo(10 + q * (c.W - 20) / 8 + 3, by + bh); ctx.stroke(); }
      var nd = Math.round(pc * 90); for (q = 0; q < 90; q++) moth(22 + pos[q][0] * (c.W - 44), by + 12 + pos[q][1] * (bh - 24), q < nd);
      S.draw.text(c, "Génération " + gi + " : " + nd + " foncées sur 90", c.W - 14, by + bh + 14, {size: 12, align: "right", color: P.grey});
      var ax = S.draw.axes(c, {x0: 0, x1: GEN, y0: 0, y1: 100, stepX: 10, stepY: 25, t: by + bh + 28, b: 30, xl: "générations", yl: "% de foncées", l: 44});
      ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); for (q = 0; q <= gi; q++){ var X = ax.X(q), Y = ax.Y(pr[q] * 100); if (q === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke();
      S.draw.dot(c, ax.X(gi), ax.Y(pc * 100), 6, P.red);
      var n50 = "—"; if (pr[0] < 0.5 && wd > wl){ var pp2 = pr[0], n = 0; while (pp2 < 0.5 && n < 5000){ pp2 = pp2 * wd / (pp2 * wd + (1 - pp2) * wl); n++; } n50 = n >= 5000 ? "plus de 5 000" : n; } else if (pr[0] >= 0.5) n50 = "déjà dépassé";
      ro.set(0, S.fmt(wd * 100, 1) + " %"); ro.set(1, S.fmt(wl * 100, 1) + " %"); ro.set(2, S.fmt(pc * 100, 1) + " %"); ro.set(3, n50);
      note.set(Math.abs(wd - wl) < 1e-9 ? "Les deux formes ont la même chance de survie : la sélection ne favorise aucune forme, la composition reste inchangée." : wd > wl ? "Écorce sombre : la forme foncée, mieux camouflée, survit davantage et devient majoritaire." : "Écorce claire : c'est la forme claire qui est avantagée ; la proportion de foncées diminue.", "");
    });
  }
});

SFA.sim({
  id: "b6-c06-antibiotiques", ch: "c06", tag: "Santé",
  titre: "Résistance aux antibiotiques : traiter trop court ou trop peu ?",
  resume: "Une infection contient quelques bactéries déjà résistantes : l'antibiotique tue les autres et leur laisse la place.",
  but: "À partir de 10⁸ bactéries au moment du diagnostic, règle la durée du traitement, l'efficacité de l'antibiotique et la fraction initiale de bactéries résistantes. Observe les deux populations (sensible, résistante) et le résultat final.",
  aRetenir: "L'antibiotique ne crée pas la résistance : des bactéries résistantes existent déjà (mutations aléatoires) et sont sélectionnées quand les sensibles disparaissent. Plus il y a de bactéries au départ, plus il y a de chances d'en trouver une résistante. Le système immunitaire peut éliminer un petit nombre de bactéries résistantes, mais pas un grand nombre.",
  piege: "Arrêter trop tôt n'est pas toujours « meilleur pour la flore » : si des bactéries sensibles survivent, elles repoussent. Et prolonger à l'infini n'aide pas contre les résistantes : seul un antibiotique différent agit. Modèle simplifié : croissance ×4 par jour, coût de la résistance 5 %, immunité efficace sous 1 000 bactéries (valeurs pédagogiques).",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var D = k.slider("Durée du traitement", 0, 14, 1, 5, "jours");
    var kl = k.slider("Efficacité (log₁₀ de sensibles tuées par jour)", 1, 4, 0.5, 2, "log");
    var f0 = k.select("Fraction initiale de résistantes", [[1e-8, "1 sur 100 millions"], [1e-7, "1 sur 10 millions"], [1e-6, "1 sur 1 million"], [1e-5, "1 sur 100 000"], [1e-4, "1 sur 10 000"]], 1e-6);
    var ro = k.readouts(["Résistantes au départ", "Résultat", "Au jour 30 : résistantes / total"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, Sn = 1e8 * (1 - +f0.value), R = 1e8 * +f0.value, g = 4, cost = 0.05, K = 1e10, DAYS = 30, i;
      var sa = [Sn], ra = [R], cleared = -1;
      for (i = 1; i <= DAYS; i++){
        if (cleared >= 0){ sa.push(0); ra.push(0); continue; }
        Sn = Sn * g * (i <= D.value ? Math.pow(10, -kl.value) : 1); R = R * g * (1 - cost);
        var tot = Sn + R; if (tot > K){ Sn *= K / tot; R *= K / tot; }
        if (Sn + R < 1000){ Sn = 0; R = 0; cleared = i; }
        sa.push(Sn); ra.push(R);
      }
      var ax = S.draw.axes(c, {x0: 0, x1: DAYS, y0: 0, y1: 10, stepX: 5, stepY: 2, xl: "jours", yl: "log₁₀(nombre de bactéries)", l: 46});
      var lg = function(v){ return v < 1 ? 0 : Math.log10(v); };
      if (D.value > 0){ ctx.fillStyle = "rgba(30,63,143,.09)"; ctx.fillRect(ax.X(0), ax.T, ax.X(D.value) - ax.X(0), ax.B - ax.T); S.draw.text(c, "traitement", ax.X(D.value / 2), ax.B - 12, {size: 12, color: P.acc}); }
      S.draw.line(c, ax.L, ax.Y(3), ax.R, ax.Y(3), P.green, 1.2, [4, 4]); S.draw.text(c, "seuil d'élimination par l'immunité (10³)", ax.R - 4, ax.Y(3) - 9, {size: 12, color: P.green, align: "right"});
      [[sa, P.acc, "sensibles"], [ra, P.red, "résistantes"]].forEach(function(s){
        ctx.strokeStyle = s[1]; ctx.lineWidth = 2.8; ctx.beginPath(); s[0].forEach(function(v, q){ var X = ax.X(q), Y = ax.Y(lg(v)); if (q === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }); ctx.stroke();
      });
      S.draw.text(c, "sensibles", ax.X(22), ax.T + 44, {size: 12, color: P.acc}); S.draw.text(c, "résistantes", ax.X(22), ax.T + 62, {size: 12, color: P.red});
      var R0 = 1e8 * +f0.value; ro.set(0, R0 < 1.5 ? "1 bactérie" : S.sci(R0, 2) + " bactéries");
      var tot30 = sa[DAYS] + ra[DAYS], res = cleared >= 0 ? "Éliminée au jour " + cleared : (ra[DAYS] > sa[DAYS] ? "Échec : souche résistante" : "Infection persistante (sensibles)");
      ro.set(1, res); ro.set(2, cleared >= 0 ? "0" : S.fmt(ra[DAYS] / tot30 * 100, 1) + " %");
      note.set(cleared >= 0 ? "Les bactéries sensibles ont été éliminées par l'antibiotique et les rares résistantes sont maîtrisées par le système immunitaire : guérison." : ra[DAYS] > sa[DAYS] ? "Les résistantes, sans concurrence des sensibles, se sont multipliées pendant le traitement et ont dépassé ce que l'immunité sait éliminer : elles repartent, l'antibiotique n'a plus d'effet." : "Des bactéries sensibles ont survécu ou sont revenues après l'arrêt du traitement : l'infection persiste.", cleared >= 0 ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "b6-c06-derive", ch: "c06", tag: "Hasard",
  titre: "Dérive génétique : le hasard seul fait évoluer les fréquences",
  resume: "Plusieurs populations identiques au départ : sans aucune sélection, leurs allèles dérivent au hasard, surtout quand elles sont petites.",
  but: "Chaque courbe est une population de N individus (2N copies du gène) suivie pendant 100 générations. Compare petites et grandes populations. Avec « s », tu peux ajouter une sélection en faveur de l'allèle A et voir quand elle l'emporte sur le hasard.",
  aRetenir: "La dérive est la variation aléatoire des fréquences alléliques due à l'échantillonnage des gamètes. Elle est d'autant plus forte que la population est petite. Elle fait fixer ou disparaître des allèles sans qu'ils soient avantageux ou désavantageux. La diversité génétique diminue en moyenne d'un facteur (1 − 1/2N) à chaque génération.",
  piege: "Fréquence moyenne inchangée ≠ aucune évolution : en moyenne sur beaucoup de populations la fréquence reste p₀ (trait noir), mais chaque population individuelle s'en éloigne. La dérive n'a pas de direction, contrairement à la sélection.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette, cur = null;
    var N = k.select("Individus par population (N)", [5, 10, 20, 50, 100, 250, 500], 20, function(){ cur = null; });
    var s = k.slider("Avantage sélectif de l'allèle A (s)", 0, 10, 1, 0, "%", function(){ cur = null; });
    var p0 = k.slider("Fréquence initiale de A", 10, 90, 10, 50, "%", function(){ cur = null; });
    var seed = 1; var lp = k.loop(function(dt){ cur += dt * 25; if (cur >= 100){ cur = null; lp.pause(); } k.redraw(); });
    k.button("Nouvelles populations", function(){ seed++; cur = null; });
    k.button("Rejouer l'animation", function(){ cur = 0; lp.play(); }, true);
    var ro = k.readouts(["A fixé (100 %)", "A perdu (0 %)", "Encore variable", "Diversité moyenne (observée / attendue)"]);
    var REP = 16, GEN = 100;
    k.draw(function(){
      c.clear(); var ctx = c.ctx, M = 2 * +N.value, r = B.rng(seed * 6151 + M * 7 + s.value), runs = [], i, g;
      for (i = 0; i < REP; i++){ var p = p0.value / 100, a = [p]; for (g = 1; g <= GEN; g++){ var pe = p * (1 + s.value / 100) / (1 + s.value / 100 * p); p = B.binom(M, pe, r) / M; a.push(p); } runs.push(a); }
      var ax = S.draw.axes(c, {x0: 0, x1: GEN, y0: 0, y1: 100, stepX: 20, stepY: 25, xl: "générations", yl: "% de l'allèle A", l: 44});
      var upto = cur === null ? GEN : Math.floor(cur);
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      runs.forEach(function(a, q){ ctx.strokeStyle = "hsl(" + (q * 360 / REP) + ",65%,45%)"; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.6; ctx.beginPath(); for (var j = 0; j <= upto; j++){ var X = ax.X(j), Y = ax.Y(a[j] * 100); if (j === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke(); });
      ctx.globalAlpha = 1; ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.beginPath();
      for (g = 0; g <= upto; g++){ var mean = 0; runs.forEach(function(a){ mean += a[g]; }); mean /= REP; if (g === 0) ctx.moveTo(ax.X(g), ax.Y(mean * 100)); else ctx.lineTo(ax.X(g), ax.Y(mean * 100)); } ctx.stroke(); ctx.restore();
      S.draw.text(c, "pointillé noir = moyenne des " + REP + " populations", ax.R - 6, ax.T + 30, {size: 12, align: "right", color: P.ink, bg: "rgba(255,255,255,.85)"});
      var fx = 0, lo = 0, H = 0; runs.forEach(function(a){ var e = a[upto]; if (e >= 1) fx++; else if (e <= 0) lo++; H += 2 * e * (1 - e); }); H /= REP;
      var H0 = 2 * (p0.value / 100) * (1 - p0.value / 100), He = H0 * Math.pow(1 - 1 / M, upto);
      ro.set(0, fx + " sur " + REP); ro.set(1, lo + " sur " + REP); ro.set(2, (REP - fx - lo) + " sur " + REP); ro.set(3, S.fmt(H, 2) + " / " + (s.value === 0 ? S.fmt(He, 2) : "—"));
    });
  }
});

SFA.sim({
  id: "b6-c06-selection-dirigee", ch: "c06", tag: "Quantitatif",
  titre: "Sélection d'un caractère : la réponse dépend de l'héritabilité",
  resume: "On ne garde pour reproducteurs qu'une fraction des individus : de combien la moyenne avance-t-elle à chaque génération ?",
  but: "Un caractère varie de façon continue (longueur de bec, en mm). Choisis la proportion d'individus retenus comme reproducteurs et l'héritabilité h² (part de la variation due aux gènes). Fais défiler les générations ou lance l'animation.",
  aRetenir: "Réponse à la sélection : R = h² × S, où S est l'écart entre la moyenne des reproducteurs choisis et la moyenne de la population. Plus on est sélectif, plus S est grand ; plus le caractère est héritable (h² proche de 1), plus la descendance ressemble aux reproducteurs. Si h² = 0, la sélection n'a aucun effet évolutif.",
  piege: "Le caractère doit être héréditaire : un bec large dû uniquement à l'alimentation ne se transmet pas (h² = 0). La moyenne ne progresse pas indéfiniment dans la réalité : la variation génétique s'épuise et le milieu impose des limites. Modèle idéalisé : écart-type constant, distribution normale.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var h2 = k.slider("Héritabilité h²", 0, 1, 0.05, 0.5, "");
    var pr = k.slider("Proportion de reproducteurs retenus", 5, 90, 5, 20, "%");
    var stop = k.slider("Dernière génération de reproducteurs triés", 0, 20, 1, 20, "");
    var gen = k.slider("Génération affichée", 0, 20, 1, 0, "");
    var lp = k.loop(function(dt, t){ acc += dt * 3; if (acc >= 1){ acc = 0; if (gen.value < 20) gen.set(gen.value + 1); else lp.pause(); } k.redraw(); }), acc = 0;
    k.button("Jouer les générations", function(){ gen.set(0); lp.play(); }, true);
    var ro = k.readouts(["Valeur z du seuil", "Écart sélectionné S (mm)", "Réponse R = h²·S (mm/génération)", "Moyenne affichée (mm)"]);
    var mu0 = 10, sd = 0.6;
    function zq(p){ var lo = -6, hi = 6; for (var i = 0; i < 60; i++){ var mid = (lo + hi) / 2; if (1 - B.Phi(mid) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, p = pr.value / 100, z = zq(p), i_ = B.phi(z) / p, Sd = i_ * sd, R = h2.value * Sd, G = gen.value;
      var mean = function(g){ return mu0 + R * Math.min(g, stop.value); };
      var top = mean(20), XM = Math.max(16, Math.ceil(top + 3 * sd + 0.5)), YM = Math.max(14, Math.ceil(top + 1));   /* axes adaptés : la moyenne peut dépasser 30 mm si la sélection est forte */
      var m = mean(G), ax = S.draw.axes(c, {x0: 6, x1: XM, y0: 0, y1: 0.8, stepX: XM > 26 ? 4 : 2, stepY: 0.2, xl: "longueur du bec (mm)", yl: "fréquence relative", t: 14, b: 190, l: 44});
      var f = function(x, mu){ return B.phi((x - mu) / sd) / sd; };
      if (G <= stop.value){ var thr = m + z * sd; ctx.fillStyle = "rgba(180,35,24,.25)"; ctx.beginPath(); ctx.moveTo(ax.X(thr), ax.Y(0)); for (var x = thr; x <= XM; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(f(x, m))); ctx.lineTo(ax.X(XM), ax.Y(0)); ctx.closePath(); ctx.fill(); S.draw.line(c, ax.X(thr), ax.T, ax.X(thr), ax.B, P.red, 1.6, [5, 4]); S.draw.text(c, "reproducteurs", ax.X(Math.min(thr + 1.8, XM - 1.2)), ax.T + 14, {size: 12, color: P.red}); }
      S.draw.fn(c, ax, function(x){ return f(x, mu0); }, "#9aa6b5", 1.8, [5, 4]);
      S.draw.fn(c, ax, function(x){ return f(x, m); }, P.acc, 3);
      S.draw.line(c, ax.X(m), ax.Y(f(m, m)), ax.X(m), ax.B, P.acc, 1.4, [3, 3]);
      /* moyenne selon les générations */
      var ay = S.draw.axes(c, {x0: 0, x1: 20, y0: 8, y1: YM, stepX: 5, stepY: YM > 28 ? 8 : 4, xl: "générations", yl: "moyenne (mm)", t: ax.B + 46, b: 34, l: 44});
      ctx.strokeStyle = P.green; ctx.lineWidth = 2.6; ctx.beginPath(); for (var g = 0; g <= 20; g++){ var X = ay.X(g), Y = ay.Y(mean(g)); if (g === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke();
      S.draw.dot(c, ay.X(G), ay.Y(m), 6, P.red);
      ro.set(0, S.fmt(z, 2)); ro.set(1, S.fmt(Sd, 2)); ro.set(2, S.fmt(R, 2)); ro.set(3, S.fmt(m, 2));
    });
  }
});
})();

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b6-3d-paysage*/
SFA.sim({
  id:"b6-3d-paysage", ch:"c06", tag:"3D · paysage adaptatif",
  titre:"Paysage adaptatif : une population gravit la montagne de la fitness",
  resume:"Deux caractères héréditaires définissent un paysage en relief : plus on est haut, plus on se reproduit. Observe la population grimper, rester coincée sur un petit sommet ou suivre un milieu qui change.",
  but:"Lance les générations. Chaque point est un individu décrit par deux caractères (par exemple la longueur et la profondeur du bec). Règle l'intensité de la sélection, la mutation et la taille de la population. Déplace l'optimum avec le curseur « Changement du milieu » et regarde si la population suit. Glisse pour tourner la vue.",
  aRetenir:"La sélection naturelle favorise les individus dont les caractères héréditaires donnent le plus de descendants fertiles (fitness élevée). Au fil des générations, la valeur moyenne des caractères se rapproche d'un sommet du paysage. Sans variation (mutation, recombinaison), la population ne peut plus progresser ; dans une petite population, le hasard (dérive) pèse davantage. Si le milieu change, le sommet se déplace et la population doit le suivre : elle disparaît si elle en est incapable.",
  piege:"La population n'« essaie » pas d'atteindre le sommet : c'est un effet de tri. Les individus ne changent pas pendant leur vie ; ce sont les proportions dans la population qui changent d'une génération à l'autre. Et la sélection ne mène pas forcément au meilleur sommet possible : une population peut rester sur un sommet local. Le paysage est un modèle simplifié.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(400), cam = B.cam(0.6, 0.62, 7.2);
    var beta = k.slider("Intensité de la sélection", 0, 8, 0.5, 3, "");
    var mut = k.slider("Mutation (variation héréditaire)", 0.01, 0.2, 0.01, 0.06, "");
    var npop = k.slider("Taille de la population", 10, 120, 5, 60, "", function(){ init(); });
    var env = k.slider("Changement du milieu", 0, 1, 0.05, 0, "", function(){ });
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    var lp = k.loop(function(dt){ step(dt); render(); });
    k.button("Lancer / pause", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("Une génération", function(){ lp.pause(); nextGen(); u = 0; });
    k.button("Recommencer", function(){ init(); });
    var ro = k.readouts(["Génération", "Fitness moyenne", "Caractère 1 moyen", "Caractère 2 moyen"]);
    var nt = k.note("", "");
    cam.auto = false;
    var pop = [], gen = 0, u = 1, T = 0, N0 = 24, GEN = 0.8;
    function peakA(){ var e = env.value; return {x:0.55 - 1.0 * e, y:0.4 + 0.3 * e}; }
    function fit(x, y){
      var a = peakA(), b = {x:-0.6, y:-0.5};
      var wa = Math.exp(-((x - a.x) * (x - a.x) + (y - a.y) * (y - a.y)) / (2 * 0.3 * 0.3));
      var wb = 0.55 * Math.exp(-((x - b.x) * (x - b.x) + (y - b.y) * (y - b.y)) / (2 * 0.26 * 0.26));
      return Math.min(1, wa + wb);
    }
    function gauss(){ var s = 0; for (var i = 0; i < 6; i++) s += Math.random(); return (s - 3) * 1.414; }
    function init(){
      pop = []; gen = 0; u = 1;
      for (var i = 0; i < npop.value; i++){ var x = -0.45 + gauss() * 0.07, y = -0.3 + gauss() * 0.07; pop.push({x:x, y:y, px:x, py:y}); }
    }
    function nextGen(){
      var n = npop.value, ws = [], tot = 0, i, r, j, acc;
      for (i = 0; i < pop.length; i++){ var w = Math.pow(Math.max(fit(pop[i].x, pop[i].y), 1e-6), beta.value); ws.push(w); tot += w; }
      var nw = [];
      for (j = 0; j < n; j++){
        r = Math.random() * tot; acc = 0; var p = pop[pop.length - 1];
        for (i = 0; i < pop.length; i++){ acc += ws[i]; if (r <= acc){ p = pop[i]; break; } }
        var x = Math.max(-1, Math.min(1, p.x + gauss() * mut.value)), y = Math.max(-1, Math.min(1, p.y + gauss() * mut.value));
        nw.push({x:x, y:y, px:p.x, py:p.y});
      }
      pop = nw; gen++;
    }
    function step(dt){
      T += dt; B.spin(cam, dt, 0.3);
      if (u < 1) u = Math.min(1, u + dt / 0.45);
      else { acc2 += dt; if (acc2 > GEN){ acc2 = 0; nextGen(); u = 0; } }
    }
    var acc2 = 0;
    B.drag(c, cam, function(){ render(); });
    function H(x, y){ return fit(x, y) * 0.9; }
    var LOW = B.hex("#cfe3d4"), MID = B.hex("#7cc08a"), HIGH = B.hex("#f4b740");
    function hcol(h){ return h < 0.5 ? B.mix(LOW, MID, h / 0.5) : B.mix(MID, HIGH, (h - 0.5) / 0.5); }
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W / 4.4, c.H / 2.9), 4), M = 22, i, j, e = 0.0001;
      var X = function(t){ return t * 1.5; };
      for (i = 0; i < M; i++) for (j = 0; j < M; j++){
        var x0 = -1 + 2 * i / M, x1 = -1 + 2 * (i + 1) / M, y0 = -1 + 2 * j / M, y1 = -1 + 2 * (j + 1) / M;
        var hm = fit((x0 + x1) / 2, (y0 + y1) / 2);
        var gx = (H(x1, y0) - H(x0, y0)) / (X(x1) - X(x0)), gy = (H(x0, y1) - H(x0, y0)) / (X(y1) - X(y0));
        sc.poly([[X(x0), H(x0, y0), X(y0)], [X(x1), H(x1, y0), X(y0)], [X(x1), H(x1, y1), X(y1)], [X(x0), H(x0, y1), X(y1)]], hcol(hm), [-gx, 1, -gy], 1, "rgba(60,90,70,.18)");
      }
      var sx = 0, sy = 0, sw = 0, f;
      pop.forEach(function(p){
        var uu = u * u * (3 - 2 * u), x = p.px + (p.x - p.px) * uu, y = p.py + (p.y - p.py) * uu;
        f = fit(x, y); sx += x; sy += y; sw += f;
        sc.sphere([X(x), H(x, y) + 0.06, X(y)], 0.055, B.mix(B.hex("#2563eb"), B.hex("#d64545"), 1 - f), 1, "rgba(255,255,255,.7)");
      });
      var n = pop.length || 1, mx = sx / n, my = sy / n;
      sc.sphere([X(mx), H(mx, my) + 0.14, X(my)], 0.045, [20, 20, 40], 1, "#fff");
      sc.label([X(mx), H(mx, my) + 0.14, X(my)], "moyenne", "#0f1b2d", 10, 0, -12);
      var a = peakA();
      sc.label([X(a.x), 1.06, X(a.y)], "sommet principal", "#a35f00", 11);
      sc.label([X(-0.6), 0.64, X(-0.5)], "sommet local", "#2a7a45", 11);
      sc.label([X(1), 0.0, X(-1.12)], "caractère 1 →", "#5b6675", 10);
      sc.label([X(-1.12), 0.0, X(1)], "caractère 2 →", "#5b6675", 10);
      sc.flush(); B.hint(c);
      ro.set(0, gen); ro.set(1, S.fmt(sw / n, 2)); ro.set(2, S.fmt(mx, 2)); ro.set(3, S.fmt(my, 2));
      var wm = sw / n;
      if (wm < 0.1) nt.set("Le milieu a changé : la population est loin du sommet, très peu d'individus se reproduisent. Elle risque de disparaître.", "bad");
      else if (beta.value === 0) nt.set("Sans sélection, la fitness ne compte pas : la population dérive au hasard.", "warn");
      else if (npop.value <= 20) nt.set("Population très petite : la dérive génétique peut l'emporter sur la sélection.", "warn");
      else if (gen > 5 && Math.abs(mx + 0.6) < 0.2 && Math.abs(my + 0.5) < 0.2 && env.value < 0.5) nt.set("Population installée sur un sommet local : plus basse que le sommet principal, mais toute mutation la désavantage.", "warn");
      else nt.set("Chaque point est un individu ; sa couleur passe du bleu (fitness basse) au rouge (fitness haute).", "ok");
    }
    k.draw(render);
    init();
  }
});
