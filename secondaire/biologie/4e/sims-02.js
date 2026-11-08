/* Biologie 4e · chapitre 2 · Organites et leurs fonctions */
SFA.sim({
  id:"b4-c02-visite", ch:"c02", tag:"Classique · défi",
  titre:"Visite guidée de la cellule",
  resume:"Touche un organite pour lire son rôle ; passe de la cellule animale à la végétale ; relève le défi.",
  but:"Clique ou touche un organite sur le dessin. Le mode « Défi » te donne un rôle : trouve l'organite qui le remplit.",
  aRetenir:"Chaque organite a une fonction précise : noyau (ADN), ribosomes (assemblent les protéines), réticulum et Golgi (fabriquent, modifient, trient), mitochondries (ATP), lysosomes (digestion), chloroplastes (photosynthèse), vacuole (eau, réserves, turgescence).",
  piege:"Le noyau n'est pas un « cerveau » qui pense : il contient l'ADN, dont des copies (ARN messagers) dirigent la fabrication des protéines. Et les cellules végétales ont aussi des mitochondries.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.72});
    var typ = k.seg("Cellule", [["a","Animale"],["v","Végétale"]], "a");
    var st = {sel:null, q:null, score:0, tot:0, hits:[]};
    var ORG = {
      noyau:{n:"Noyau", f:"Contient l'ADN (chromatine) entouré d'une enveloppe percée de pores ; c'est là qu'on recopie les gènes en ARN messager.", q:"contient l'ADN"},
      nucleole:{n:"Nucléole", f:"Zone du noyau où l'on fabrique les sous-unités des ribosomes.", q:"fabrique les sous-unités des ribosomes"},
      rer:{n:"Réticulum endoplasmique rugueux", f:"Réseau de sacs couvert de ribosomes : il fabrique et plie les protéines destinées à la membrane ou à l'exportation.", q:"reçoit et plie les protéines destinées à être exportées"},
      rel:{n:"Réticulum endoplasmique lisse", f:"Réseau de tubes sans ribosomes : synthèse de lipides, détoxication (foie), réserve de calcium (muscle).", q:"fabrique les lipides"},
      golgi:{n:"Appareil de Golgi", f:"Pile de sacs plats : modifie, trie et emballe les protéines dans des vésicules à destination de la membrane ou de l'extérieur.", q:"trie et emballe les protéines dans des vésicules"},
      mito:{n:"Mitochondrie", f:"Réalise la respiration cellulaire : elle libère l'énergie du glucose et fabrique la majeure partie de l'ATP.", q:"fabrique la majeure partie de l'ATP par respiration"},
      lyso:{n:"Lysosome", f:"Petite vésicule pleine d'enzymes digestives : digère les déchets et les particules captées.", q:"digère les déchets avec des enzymes"},
      ribo:{n:"Ribosomes", f:"Minuscules complexes qui assemblent les acides aminés en protéines (traduction) ; libres ou accrochés au réticulum.", q:"assemble les acides aminés en protéines"},
      chloro:{n:"Chloroplaste", f:"Contient la chlorophylle : réalise la photosynthèse (lumière + CO₂ + eau → glucose + O₂).", q:"réalise la photosynthèse"},
      vac:{n:"Grande vacuole", f:"Réserve d'eau, d'ions et de substances ; en se remplissant elle maintient la cellule gonflée (turgescence).", q:"stocke l'eau et maintient la turgescence"},
      paroi:{n:"Paroi cellulosique", f:"Enveloppe rigide autour de la membrane : donne la forme et protège contre l'éclatement.", q:"donne une forme rigide autour de la membrane"},
      memb:{n:"Membrane plasmique", f:"Fine enveloppe qui délimite la cellule et contrôle ce qui entre et sort (perméabilité sélective).", q:"contrôle ce qui entre et sort de la cellule"}
    };
    var ro = k.readouts(["Organite", "Rôle"]);
    var nt = k.note("", "");
    k.button("Défi : trouve l'organite", function(){
      var keys = Object.keys(ORG).filter(function(x){ return typ.value === "a" ? !{chloro:1, vac:1, paroi:1}[x] : x !== "lyso"; });
      st.q = keys[Math.floor(Math.random() * keys.length)]; st.sel = null;
    }, true);
    k.button("Arrêter le défi", function(){ st.q = null; });
    c.pointer(function(type, p){
      if (type !== "down") return;
      var best = null, bd = 1e9;
      st.hits.forEach(function(h){ var d = Math.hypot(p.x - h.x, p.y - h.y) / h.r; if (d < bd){ bd = d; best = h; } });
      if (!best || bd > 1.15) return;
      if (st.q){ st.tot++; if (best.k === st.q){ st.score++; st.msg = "Exact : " + ORG[best.k].n + ". " + ORG[best.k].f; st.q = null; st.sel = best.k; } else { st.msg = "Ce n'est pas " + ORG[best.k].n + " (" + ORG[best.k].f.split(" : ")[0].split(".")[0].toLowerCase() + "). Réessaie."; } }
      else { st.sel = best.k; st.msg = null; }
      k.redraw();
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, a = typ.value === "a", u = Math.min(W, H * 1.4);
      st.hits = [];
      function hit(key, x, y, r){ st.hits.push({k:key, x:x, y:y, r:r}); if (st.sel === key){ ctx.save(); ctx.strokeStyle = "#f4c542"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 6.3); ctx.stroke(); ctx.restore(); } }
      function mito(x, y, s, rot){ B4.ell(c, x, y, s, s * 0.5, "rgba(251,191,36,.55)", B4.pal.amber, 1.8, rot); ctx.save(); ctx.strokeStyle = B4.pal.amber; ctx.lineWidth = 1; ctx.beginPath(); for (var i = -2; i <= 2; i++){ ctx.moveTo(x + i * s * 0.28 * Math.cos(rot), y + i * s * 0.28 * Math.sin(rot) - 5); ctx.lineTo(x + i * s * 0.28 * Math.cos(rot), y + i * s * 0.28 * Math.sin(rot) + 5); } ctx.stroke(); ctx.restore(); hit("mito", x, y, s); }
      function noyau(x, y, r){ B4.ell(c, x, y, r, r, "rgba(147,197,253,.5)", B4.pal.acc, 2.5); B4.ell(c, x - r * 0.15, y - r * 0.1, r * 0.3, r * 0.3, "rgba(30,63,143,.7)"); hit("noyau", x, y, r); hit("nucleole", x - r * 0.15, y - r * 0.1, r * 0.3); }
      function rer(x, y, s){ ctx.save(); ctx.strokeStyle = "#0e7490"; ctx.lineWidth = 3; for (var i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(x - s, y - s * 0.6 + i * s * 0.4); ctx.bezierCurveTo(x - s * 0.3, y - s * 0.9 + i * s * 0.4, x + s * 0.3, y - s * 0.3 + i * s * 0.4, x + s, y - s * 0.6 + i * s * 0.4); ctx.stroke(); for (var j = 0; j < 6; j++){ var tx = x - s + j * s * 0.4; S.draw.dot(c, tx, y - s * 0.6 + i * s * 0.4 - 4 + Math.sin(j) * 2, 1.8, "#334155"); } } ctx.restore(); hit("rer", x, y, s); }
      function rel(x, y, s){ ctx.save(); ctx.strokeStyle = "#0e7490"; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x - s, y); ctx.bezierCurveTo(x - s * 0.5, y - s * 0.8, x, y + s * 0.8, x + s * 0.3, y); ctx.bezierCurveTo(x + s * 0.6, y - s * 0.7, x + s * 0.8, y + s * 0.2, x + s, y - s * 0.2); ctx.moveTo(x - s * 0.6, y + s * 0.4); ctx.bezierCurveTo(x - s * 0.2, y + s * 0.9, x + s * 0.3, y + s * 0.3, x + s * 0.7, y + s * 0.7); ctx.stroke(); ctx.restore(); hit("rel", x, y, s); }
      function golgi(x, y, s){ ctx.save(); ctx.strokeStyle = "#5B21B6"; ctx.lineWidth = 4.5; ctx.lineCap = "round"; for (var i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(x - s * 0.3 + i * s * 0.22, y, s * (0.75 - i * 0.04), 3.6, 5.8); ctx.stroke(); } ctx.restore(); S.draw.dot(c, x + s * 0.9, y - s * 0.5, 3.5, "#5B21B6"); S.draw.dot(c, x + s * 1.05, y - s * 0.1, 3.5, "#5B21B6"); hit("golgi", x, y, s); }
      function lyso(x, y, r){ B4.ell(c, x, y, r, r, "rgba(244,114,182,.55)", "#9d174d", 2); S.draw.dot(c, x - r * 0.3, y, 1.8, "#9d174d"); S.draw.dot(c, x + r * 0.3, y + 2, 1.8, "#9d174d"); hit("lyso", x, y, r); }
      function chloro(x, y, s, rot){ B4.ell(c, x, y, s, s * 0.55, "rgba(34,197,94,.65)", "#14532d", 2, rot); for (var i = -1; i <= 1; i++) B4.ell(c, x + i * s * 0.4 * Math.cos(rot), y + i * s * 0.4 * Math.sin(rot), s * 0.12, s * 0.28, "rgba(21,128,61,.85)", null, 0, rot); hit("chloro", x, y, s); }
      if (a){
        var cx = W / 2, cy = H / 2, rx = W * 0.47, ry = H * 0.46;
        B4.ell(c, cx, cy, rx, ry, "rgba(254,242,242,.8)", "#9f1239", 3.5); hit("memb", cx + rx * 0.95, cy, 12);
        noyau(W * 0.34, H * 0.5, H * 0.17);
        rer(W * 0.58, H * 0.3, H * 0.09); golgi(W * 0.7, H * 0.56, H * 0.09); rel(W * 0.55, H * 0.76, H * 0.08);
        mito(W * 0.82, H * 0.3, H * 0.07, 0.4); mito(W * 0.4, H * 0.86, H * 0.07, -0.2); mito(W * 0.84, H * 0.72, H * 0.07, 1.1);
        lyso(W * 0.2, H * 0.22, H * 0.04); lyso(W * 0.14, H * 0.74, H * 0.04);
        var r1 = B4.rng(4); for (var i = 0; i < 24; i++){ var an = r1() * 6.28, rr = 0.25 + r1() * 0.7, px = cx + Math.cos(an) * rx * rr, py = cy + Math.sin(an) * ry * rr; S.draw.dot(c, px, py, 1.9, "#334155"); if (i < 4) st.hits.push({k:"ribo", x:px, y:py, r:10}); }
      } else {
        var x0 = W * 0.04, y0 = H * 0.06, w = W * 0.92, h = H * 0.88;
        B4.rr(c, x0 - 4, y0 - 4, w + 8, h + 8, 10, "rgba(34,120,70,.35)", "#2e6b55", 3); B4.rr(c, x0, y0, w, h, 8, "rgba(240,253,244,.9)", "#2e6b55", 1.2);
        hit("paroi", x0 + w + 2, y0 + h * 0.2, 11); hit("memb", x0 + 3, y0 + h * 0.8, 10);
        B4.rr(c, W * 0.3, H * 0.22, W * 0.5, H * 0.52, H * 0.18, "rgba(186,230,253,.7)", B4.pal.teal, 2); hit("vac", W * 0.55, H * 0.48, H * 0.2);
        noyau(W * 0.15, H * 0.32, H * 0.12);
        chloro(W * 0.2, H * 0.84, H * 0.075, 0); chloro(W * 0.5, H * 0.88, H * 0.075, 0.1); chloro(W * 0.85, H * 0.82, H * 0.075, -0.2); chloro(W * 0.52, H * 0.12, H * 0.075, 0);
        mito(W * 0.88, H * 0.42, H * 0.06, 0.5); mito(W * 0.15, H * 0.62, H * 0.06, -0.3);
        rer(W * 0.18, H * 0.12 + 0, H * 0.06); golgi(W * 0.84, H * 0.16, H * 0.07); rel(W * 0.86, H * 0.64, H * 0.06);
        var r2 = B4.rng(8); for (i = 0; i < 12; i++){ px = x0 + 12 + r2() * (w - 24); py = y0 + 12 + r2() * (h - 24); if (px > W * 0.3 && px < W * 0.8 && py > H * 0.22 && py < H * 0.74) continue; S.draw.dot(c, px, py, 1.9, "#334155"); if (i < 3) st.hits.push({k:"ribo", x:px, y:py, r:10}); }
      }
      if (st.q){ ro.set(0, "?"); ro.set(1, "à trouver"); nt.set("<b>Défi (" + st.score + "/" + st.tot + ")</b> : clique sur l'organite qui <b>" + ORG[st.q].q + "</b>." + (st.msg ? "<br>" + st.msg : ""), "warn"); }
      else if (st.sel){ ro.set(0, ORG[st.sel].n); ro.set(1, ORG[st.sel].f.split(" ; ")[0].split(" : ")[0]); nt.set("<b>" + ORG[st.sel].n + ".</b> " + ORG[st.sel].f + (st.msg && st.score ? "<br>Score défi : " + st.score + "/" + st.tot : ""), "ok"); }
      else { ro.set(0, "—"); ro.set(1, "—"); nt.set((st.msg ? st.msg + "<br>" : "") + "Touche un organite (noyau, mitochondries, réticulum, Golgi…). La cellule " + (a ? "animale n'a ni paroi ni chloroplaste." : "végétale a une paroi, des chloroplastes et une grande vacuole.") + (st.tot ? " Score défi : " + st.score + "/" + st.tot + "." : ""), ""); }
    });
  }
});

SFA.sim({
  id:"b4-c02-secretion", ch:"c02", tag:"Marquage · original",
  titre:"Le trajet d'une protéine exportée (marquage radioactif)",
  resume:"Suis un « paquet » de protéines marquées du réticulum jusqu'à l'extérieur, et bloque une étape.",
  but:"Fais avancer le temps après l'impulsion de marquage : où se trouve le marquage ? Change la température ou bloque le transport vers le Golgi.",
  aRetenir:"Une protéine exportée suit toujours : ribosome du réticulum rugueux → Golgi → vésicules de sécrétion → membrane → extérieur (exocytose). Le marquage se déplace d'un compartiment au suivant, d'où le « pulse-chase ».",
  piege:"Ce modèle est volontairement simplifié (chaque étape a un taux constant) : les temps réels dépendent des cellules. Retiens l'ORDRE des compartiments, pas les valeurs exactes.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var t = k.slider("Temps après le marquage", 0, 180, 1, 0, "min");
    var T = k.slider("Température du milieu", 4, 37, 1, 37, "°C");
    var blk = k.toggle("Bloquer le transport réticulum → Golgi", false);
    var ro = k.readouts(["Réticulum", "Golgi", "Vésicules", "Extérieur"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var v = Math.min(180, t.value + dt * 30); t.set(v); if (v >= 180) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ if (t.value >= 180) t.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Zéro", function(){ lp.pause(); t.set(0); });
    function run(tm){
      var f = Math.pow(2, (T.value - 37) / 10), k1 = blk.value ? 0 : 0.07 * f, k2 = 0.05 * f, k3 = 0.03 * f, R = 1, G = 0, V = 0, E = 0, dt = 0.05, n = Math.round(tm / dt);
      var hist = [[0, 1, 0, 0, 0]];
      for (var i = 1; i <= n; i++){ var a = k1 * R * dt, b = k2 * G * dt, cc = k3 * V * dt; R -= a; G += a - b; V += b - cc; E += cc; if (i % 20 === 0) hist.push([i * dt, R, G, V, E]); }
      return {R:R, G:G, V:V, E:E, hist:hist};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, r = run(t.value), cols = ["#0e7490", "#5B21B6", "#B45309", "#2e6b55"], names = ["Réticulum", "Golgi", "Vésicules", "Extérieur"];
      var vals = [r.R, r.G, r.V, r.E];
      var boxW = (W - 40) / 4, by = 14, bh = H * 0.26;
      for (var i = 0; i < 4; i++){
        var x = 10 + i * (boxW + 6);
        B4.rr(c, x, by, boxW - 4, bh, 8, "rgba(" + [14, 91, 180, 46][i] + "," + [116, 33, 83, 107][i] + "," + [144, 182, 9, 85][i] + "," + (0.08 + vals[i] * 0.75) + ")", cols[i], 2);
        B4.txt(c, names[i], x + boxW / 2 - 2, by + 14, B4.pal.ink, 12);
        B4.txt(c, S.fmt(vals[i] * 100, 0) + " %", x + boxW / 2 - 2, by + bh / 2 + 6, B4.pal.ink, 15);
        if (i < 3) S.draw.arrow(c, x + boxW - 2, by + bh / 2, x + boxW + 6, by + bh / 2, "#5f6b7a", 2);
      }
      if (blk.value) B4.txt(c, "✖ blocage", 10 + boxW + 3, by + bh + 14, B4.pal.red, 12);
      var ax = S.draw.axes(c, {x0:0, x1:180, y0:0, y1:100, xl:"min", yl:"% du marquage", stepX:30, stepY:25, t:by + bh + 24});
      for (i = 0; i < 4; i++){
        (function(j){ S.draw.fn(c, ax, function(x){ var rr = run(x), v = [rr.R, rr.G, rr.V, rr.E][j]; return v * 100; }, cols[j], 2.4); })(i);
      }
      S.draw.line(c, ax.X(t.value), ax.T, ax.X(t.value), ax.B, "#13233a", 1.5, [4, 3]);
      ro.set(0, S.fmt(r.R * 100, 0) + " %"); ro.set(1, S.fmt(r.G * 100, 0) + " %"); ro.set(2, S.fmt(r.V * 100, 0) + " %"); ro.set(3, S.fmt(r.E * 100, 0) + " %");
      var imax = vals.indexOf(Math.max.apply(null, vals));
      nt.set(blk.value ? "Transport bloqué : tout le marquage reste dans le réticulum, rien n'atteint le Golgi ni l'extérieur." : T.value < 15 ? "À basse température tout est ralenti (diffusion et enzymes) : le marquage avance beaucoup plus lentement." : "Le marquage est surtout dans : <b>" + names[imax] + "</b>.", blk.value ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c02-specialisees", ch:"c02", tag:"Comparaison · défi",
  titre:"Cellules spécialisées : qui a quoi ?",
  resume:"Cinq cellules dessinées et vivantes (cœur, pancréas, foie, feuille, globule rouge) : leurs organites suivent leur fonction. Puis construis toi-même le profil d'une cellule.",
  but:"Mode « Observer » : choisis une cellule, regarde-la fonctionner et touche une barre (ou un organite) pour le repérer. Mode « Construis » : glisse les barres pour donner à la cellule les organites que sa fonction exige, puis vérifie.",
  aRetenir:"Une cellule spécialisée possède en abondance les organites liés à sa fonction : muscle cardiaque → mitochondries ; cellule sécrétrice → réticulum rugueux et Golgi ; hépatocyte → réticulum lisse ; cellule foliaire → chloroplastes. Chez le globule rouge mature des mammifères, noyau et organites ont disparu.",
  piege:"Une cellule spécialisée n'a pas de gènes en moins : toutes les cellules d'un organisme portent le même ADN, mais n'utilisent pas les mêmes gènes. Les niveaux affichés (0 à 5) sont des abondances relatives, pas des comptages.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.3}); B4.adapt(c, 1.3, 0.92, 480);
    var mode = k.seg("Mode", [["o","Observer"],["b","Construis le profil (défi)"]], "o", function(v){ if (v === "b" && !st.built) nouveau(); });
    var cell = k.select("Cellule", [["coeur","Cellule musculaire cardiaque"],["pancr","Cellule sécrétrice du pancréas"],["foie","Hépatocyte (foie)"],["feuille","Cellule foliaire (palissade)"],["gr","Globule rouge mature"]], "coeur", function(){ if (mode.value === "b") nouveau(cell.value); });
    var ro = k.readouts(["Organite le plus abondant", "Organite repéré", "Score du défi"]);
    var nt = k.note("", "");
    var ORG = [
      ["Noyau", "contient l'ADN", "#1e3f8f"], ["Mitochondries", "respiration : fabriquent l'ATP", "#c26a0c"], ["Chloroplastes", "photosynthèse", "#24775a"],
      ["Réticulum rugueux", "fabrique les protéines à exporter", "#0e7f96"], ["Appareil de Golgi", "trie et emballe les protéines", "#6236c4"],
      ["Réticulum lisse", "lipides, détoxication, réserve de calcium", "#3d8fb0"], ["Lysosomes", "digestion des déchets", "#c43a7a"], ["Grande vacuole", "eau, réserves, turgescence", "#2f7fd1"]
    ];
    var D = {
      coeur:{n:"Cellule musculaire cardiaque", v:[2, 5, 0, 1, 1, 3, 1, 0], ar:2.1, f:"Se contracte sans arrêt : consomme énormément d'ATP, d'où les mitochondries serrées entre les myofibrilles ; le réticulum lisse (sarcoplasmique) stocke le calcium qui déclenche la contraction."},
      pancr:{n:"Cellule sécrétrice du pancréas", v:[3, 3, 0, 5, 5, 1, 2, 0], ar:0.95, f:"Fabrique et exporte des enzymes digestives : réticulum rugueux et Golgi très développés, grains de sécrétion au pôle qui donne sur le canal."},
      foie:{n:"Hépatocyte (foie)", v:[3, 4, 0, 3, 3, 5, 3, 0], ar:1.15, f:"Détoxifie le sang, stocke le glucose (glycogène), fabrique des lipides : réticulum lisse très abondant, nombreux lysosomes et mitochondries."},
      feuille:{n:"Cellule foliaire (palissade)", v:[2, 2, 5, 1, 1, 1, 0, 4], ar:0.62, f:"Fait la photosynthèse : chloroplastes nombreux, plaqués contre la paroi autour d'une grande vacuole ; le cytoplasme circule (cyclose) et les entraîne."},
      gr:{n:"Globule rouge mature", v:[0, 0, 0, 0, 0, 0, 0, 0], ar:1, f:"Transporte le dioxygène grâce à l'hémoglobine ; chez les mammifères il perd noyau et organites, ce qui laisse toute la place à l'hémoglobine."}
    };
    var st = {sel:-1, t:0, q:"coeur", lev:[0, 0, 0, 0, 0, 0, 0, 0], checked:false, score:0, tot:0, built:false, drag:-1, bars:null, hits:[], parts:[]}, rr = B4.rng(7);
    function nouveau(key){ var ks = Object.keys(D).filter(function(x){ return x !== "gr" || Math.random() < 0.3; }); st.q = key || ks[Math.floor(Math.random() * ks.length)]; cell.set(st.q); st.lev = [1, 1, 1, 1, 1, 1, 1, 1]; st.checked = false; st.built = true; }
    k.button("Nouvelle cellule à construire", function(){ mode.set("b"); nouveau(); }, true);
    k.button("Vérifier mon profil", function(){ if (mode.value !== "b" || st.checked) return; st.checked = true; st.tot++; if (good() >= 6) st.score++; });
    function levels(){ return mode.value === "b" ? st.lev : D[cell.value].v; }
    function good(){ var t = D[st.q].v, n = 0; for (var i = 0; i < 8; i++) if (Math.abs(st.lev[i] - t[i]) <= (i === 0 ? 0 : 1) && (t[i] === 0) === (st.lev[i] === 0)) n++; return n; }
    /* ---- emplacements des organites, en coordonnées 0..1 de la boîte de la cellule ---- */
    var SH = {
      coeur:{inside:function(u, v){ return u > 0.05 && u < 0.95 && v > 0.22 && v < 0.78; }, nuc:[0.5, 0.5, 0.075, 0.13]},
      pancr:{inside:function(u, v){ var hw = 0.17 + 0.3 * (v - 0.1) / 0.85; return v > 0.1 && v < 0.95 && Math.abs(u - 0.5) < hw; }, nuc:[0.5, 0.76, 0.13, 0.12]},
      foie:{inside:function(u, v){ var x = u - 0.5, y = v - 0.5; return Math.abs(y) < 0.41 && Math.abs(y) * 0.577 + Math.abs(x) < 0.45; }, nuc:[0.4, 0.42, 0.1, 0.09]},
      feuille:{inside:function(u, v){ return u > 0.1 && u < 0.9 && v > 0.04 && v < 0.96; }, nuc:[0.2, 0.22, 0.08, 0.045]},
      gr:{inside:function(u, v){ return Math.hypot(u - 0.5, v - 0.5) < 0.43; }, nuc:[0.5, 0.5, 0.12, 0.12]}
    };
    var slots = {};
    Object.keys(SH).forEach(function(key){
      var r = B4.rng(key.length * 31 + 5), out = [], sh = SH[key], n = SH[key].nuc;
      for (var tries = 0; out.length < 70 && tries < 6000; tries++){
        var u = r(), v = r(); if (!sh.inside(u, v)) continue;
        if (Math.pow((u - n[0]) / (n[2] + 0.06), 2) + Math.pow((v - n[1]) / (n[3] + 0.06), 2) < 1) continue;
        if (key === "feuille" && u > 0.24 && u < 0.76 && v > 0.12 && v < 0.88) continue;
        if (key === "coeur"){ v = [0.31, 0.41, 0.59, 0.69][out.length % 4]; }
        if (out.some(function(o){ return Math.hypot((o[0] - u) * 1.3, o[1] - v) < 0.06; })) continue;
        out.push([u, v, r() * 3.1416]);
      }
      slots[key] = out;
    });
    var CNT = {1:[0, 3, 6, 10, 16, 24], 2:[0, 2, 5, 9, 14, 20], 3:[0, 1, 2, 3, 4, 6], 4:[0, 1, 1, 2, 2, 3], 5:[0, 1, 2, 4, 6, 9], 6:[0, 1, 2, 4, 6, 9]};
    /* ---- dessin des organites ---- */
    function mito(x, y, s, rot, hl){ var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); S.draw.rrect(c, -s, -s * 0.48, 2 * s, s * 0.96, s * 0.48); ctx.fillStyle = "#f6c87a"; ctx.fill(); ctx.strokeStyle = hl ? "#13233a" : "#a85d0c"; ctx.lineWidth = hl ? 2 : 1.2; ctx.stroke(); ctx.beginPath(); for (var i = -2; i <= 2; i++){ ctx.moveTo(i * s * 0.36, -s * 0.4); ctx.lineTo(i * s * 0.36 + s * 0.08, s * 0.15 * (i % 2 ? 1 : -1)); } ctx.strokeStyle = "#c26a0c"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
    function chloro(x, y, s, rot, hl){ var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.55, 0, 0, 6.2832); ctx.fillStyle = "#5dbb6e"; ctx.fill(); ctx.strokeStyle = hl ? "#13233a" : "#1d6b35"; ctx.lineWidth = hl ? 2 : 1.2; ctx.stroke(); ctx.fillStyle = "#257a3e"; for (var i = -1; i <= 1; i++){ ctx.fillRect(i * s * 0.45 - s * 0.12, -s * 0.25, s * 0.24, s * 0.5); } ctx.restore(); }
    function rer(x, y, w, hl, curve){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = hl ? "#13233a" : "#0e7f96"; ctx.lineWidth = 2.6; for (var i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(x - w / 2, y + i * 5); ctx.quadraticCurveTo(x, y + i * 5 - (curve || 4), x + w / 2, y + i * 5); ctx.stroke(); } ctx.restore(); for (i = 0; i < 3; i++) for (var j = 0; j <= 5; j++) S.draw.dot(c, x - w / 2 + j * w / 5, y + i * 5 - 2.4 - (curve || 4) * 0.5 * (1 - Math.pow(j / 2.5 - 1, 2)), 1.1, "#334155"); }
    function golgi(x, y, s, hl){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = hl ? "#13233a" : "#6236c4"; ctx.lineWidth = 3; ctx.lineCap = "round"; for (var i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(x, y + s * 1.2 + i * 4, s * (1.25 - i * 0.12), 3.75, 5.67); ctx.stroke(); } ctx.restore(); S.draw.dot(c, x + s * 1.1, y - s * 0.1, 2.6, "#8b68d6"); S.draw.dot(c, x - s * 1.05, y + s * 0.05, 2.2, "#8b68d6"); }
    function rel(x, y, s, hl){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = hl ? "#13233a" : "#3d8fb0"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.bezierCurveTo(x - s * 0.5, y - s * 0.8, x, y + s * 0.8, x + s * 0.3, y); ctx.bezierCurveTo(x + s * 0.6, y - s * 0.6, x + s * 0.8, y + s * 0.3, x + s, y - s * 0.1); ctx.stroke(); ctx.restore(); }
    function lyso(x, y, r, hl){ B4.ell(c, x, y, r, r, "#f3a9c9", hl ? "#13233a" : "#a3245c", hl ? 2 : 1.2); S.draw.dot(c, x - r * 0.3, y, 1, "#a3245c"); S.draw.dot(c, x + r * 0.3, y + 1, 1, "#a3245c"); }
    function nucleus(x, y, rx, ry, hl){ B4.ell(c, x, y, rx, ry, "#b9cdf2", hl ? "#13233a" : "#1e3f8f", hl ? 2.6 : 1.8); B4.ell(c, x - rx * 0.18, y - ry * 0.12, rx * 0.3, ry * 0.3, "#3c5fae"); var r = B4.rng(3); for (var i = 0; i < 8; i++) S.draw.dot(c, x + (r() - 0.5) * rx * 1.3, y + (r() - 0.5) * ry * 1.3, 1, "rgba(30,63,143,.6)"); }
    /* ---- une cellule complète ---- */
    function drawCell(key, lv, bx, by, bw, bh){
      var ctx = c.ctx, t = st.t, sel = st.sel, s0 = Math.min(bw, bh), sl = slots[key], U = function(u){ return bx + u * bw; }, V = function(v){ return by + v * bh; };
      st.hits = [];
      function hit(i, x, y){ st.hits.push([i, x, y]); }
      /* membrane / paroi */
      ctx.save();
      if (key === "coeur"){
        var sq = 1 - 0.035 * Math.max(0, Math.sin(t * 5.5));
        ctx.translate(U(0.5), V(0.5)); ctx.scale(sq, 1); ctx.translate(-U(0.5), -V(0.5));
        S.draw.rrect(c, U(0.04), V(0.2), bw * 0.92, bh * 0.6, 10); ctx.fillStyle = "#fbe1dd"; ctx.fill(); ctx.strokeStyle = "#a33c4f"; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.save(); S.draw.rrect(c, U(0.04), V(0.2), bw * 0.92, bh * 0.6, 10); ctx.clip();
        for (var x = 0.06; x < 0.95; x += 0.035){ ctx.fillStyle = "rgba(163,60,79,.16)"; ctx.fillRect(U(x), V(0.2), bw * 0.012, bh * 0.6); }
        ctx.restore();
        ctx.strokeStyle = "#7a2335"; ctx.lineWidth = 2; [0.04, 0.96].forEach(function(u){ ctx.beginPath(); for (var q = 0; q <= 8; q++) ctx.lineTo(U(u) + (q % 2 ? 4 : -4), V(0.2 + q * 0.075)); ctx.stroke(); });
      } else if (key === "pancr"){
        ctx.beginPath(); ctx.moveTo(U(0.33), V(0.1)); ctx.lineTo(U(0.67), V(0.1)); ctx.lineTo(U(0.97), V(0.95)); ctx.lineTo(U(0.03), V(0.95)); ctx.closePath(); ctx.fillStyle = "#fdf0e6"; ctx.fill(); ctx.strokeStyle = "#b5733f"; ctx.lineWidth = 2.5; ctx.stroke();
        S.draw.rrect(c, U(0.3), V(0.0), bw * 0.4, bh * 0.08, 6); ctx.fillStyle = "#e6f1fb"; ctx.fill(); ctx.strokeStyle = "#8fb6d9"; ctx.lineWidth = 1; ctx.stroke();
      } else if (key === "foie"){
        ctx.beginPath(); for (var q = 0; q < 6; q++){ var a = q * Math.PI / 3; ctx.lineTo(U(0.5) + Math.cos(a) * bw * 0.46, V(0.5) + Math.sin(a) * bh * 0.46); } ctx.closePath(); ctx.fillStyle = "#f7ead8"; ctx.fill(); ctx.strokeStyle = "#9a6a3a"; ctx.lineWidth = 2.5; ctx.stroke();
        S.draw.line(c, U(0.73), V(0.1), U(0.73), V(0.9), "rgba(110,160,60,.55)", 3, [4, 3]);
      } else if (key === "feuille"){
        S.draw.rrect(c, U(0.06), V(0.01), bw * 0.88, bh * 0.98, 10); ctx.fillStyle = "#bfe3b0"; ctx.fill(); ctx.strokeStyle = "#3f7a33"; ctx.lineWidth = 3; ctx.stroke();
        S.draw.rrect(c, U(0.1), V(0.03), bw * 0.8, bh * 0.94, 8); ctx.fillStyle = "#effae8"; ctx.fill();
        var vf = [0, 0.15, 0.3, 0.5, 0.75, 1][lv[7]], vw = 0.56 * Math.sqrt(vf), vh = 0.78 * Math.sqrt(vf);
        if (vf > 0){ S.draw.rrect(c, U(0.5 - vw / 2), V(0.5 - vh / 2), bw * vw, bh * vh, 12); ctx.fillStyle = "rgba(186,222,250,.8)"; ctx.fill(); ctx.strokeStyle = sel === 7 ? "#13233a" : "#2f7fd1"; ctx.lineWidth = sel === 7 ? 2.5 : 1.5; ctx.stroke(); hit(7, U(0.5), V(0.5)); }
      } else {
        var gr0 = ctx.createRadialGradient(U(0.5), V(0.5), s0 * 0.05, U(0.5), V(0.5), s0 * 0.44); gr0.addColorStop(0, "#f6c3c3"); gr0.addColorStop(0.45, "#e98585"); gr0.addColorStop(1, "#c23b3b");
        var pul = 1 + 0.015 * Math.sin(t * 2); ctx.beginPath(); ctx.arc(U(0.5), V(0.5), s0 * 0.44 * pul, 0, 6.2832); ctx.fillStyle = gr0; ctx.fill(); ctx.strokeStyle = "#8e2020"; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.restore();
      if (key !== "feuille" && lv[7] > 0){ var vr = s0 * 0.07 * lv[7]; B4.ell(c, U(0.5), V(0.5), vr, vr * 0.8, "rgba(186,222,250,.8)", sel === 7 ? "#13233a" : "#2f7fd1", 1.5); hit(7, U(0.5), V(0.5)); }
      /* noyau */
      var nu = SH[key].nuc;
      if (lv[0] > 0){ var fz = [0, 0.6, 0.8, 1, 1.15, 1.3][lv[0]], nn = key === "foie" && lv[0] >= 3 ? 2 : 1;
        for (var q2 = 0; q2 < nn; q2++){ nucleus(U(nu[0] + q2 * 0.2), V(nu[1] + q2 * 0.16), bw * nu[2] * fz, bh * nu[3] * fz, sel === 0); hit(0, U(nu[0] + q2 * 0.2), V(nu[1] + q2 * 0.16)); } }
      /* organites dénombrables */
      var used = 0, mk = Math.max(5, s0 * 0.042);
      function take(n){ var out = sl.slice(used, used + n); used += n; return out; }
      var arr;
      arr = take(CNT[6][lv[5]]); arr.forEach(function(p){ rel(U(p[0]), V(p[1]), mk * 1.4, sel === 5); hit(5, U(p[0]), V(p[1])); });
      if (key === "pancr"){
        for (var i = 0; i < CNT[3][lv[3]]; i++){ var yy = 0.56 + i * 0.065, side = i % 2 ? 0.7 : 0.3; rer(U(side + (i % 2 ? 0.02 : -0.02) * i), V(yy + 0.02 * (i > 3)), bw * (0.16 + 0.02 * i), sel === 3); hit(3, U(side), V(yy)); }
      } else { arr = take(CNT[3][lv[3]]); arr.forEach(function(p){ rer(U(p[0]), V(p[1]), mk * 3, sel === 3); hit(3, U(p[0]), V(p[1])); }); }
      var gn = CNT[4][lv[4]];
      for (i = 0; i < gn; i++){ var gp = key === "pancr" ? [0.5 + (i - (gn - 1) / 2) * 0.16, 0.5] : sl[used + i]; golgi(U(gp[0]), V(gp[1]), mk * (0.8 + lv[4] * 0.12), sel === 4); hit(4, U(gp[0]), V(gp[1])); }
      used += gn;
      arr = take(CNT[6][lv[6]]); arr.forEach(function(p){ lyso(U(p[0]), V(p[1]), mk * 0.55, sel === 6); hit(6, U(p[0]), V(p[1])); });
      arr = take(CNT[1][lv[1]]); arr.forEach(function(p, j){ var rot = key === "coeur" ? 0 : p[2]; mito(U(p[0]), V(p[1]), mk * 0.95, rot, sel === 1); hit(1, U(p[0]), V(p[1]));
        if (key === "coeur" && Math.sin(t * 5.5 + j) > 0.95) S.draw.glow(c, U(p[0]), V(p[1]), mk * 2, P.yellow, 0.7); });
      if (key === "feuille"){
        var nc = CNT[2][lv[2]];
        for (i = 0; i < nc; i++){ var ph = (i / Math.max(1, nc) + t * 0.025) % 1, pu, pv, per = 2 * (0.62 + 0.84);
          var d = ph * per; if (d < 0.62){ pu = 0.19 + d; pv = 0.08; } else if (d < 1.46){ pu = 0.81; pv = 0.08 + (d - 0.62); } else if (d < 2.08){ pu = 0.81 - (d - 1.46); pv = 0.92; } else { pu = 0.19; pv = 0.92 - (d - 2.08); }
          chloro(U(pu), V(pv), mk * 1.1, (d < 0.62 || (d >= 1.46 && d < 2.08)) ? 0 : 1.5708, sel === 2); hit(2, U(pu), V(pv)); }
      } else { arr = take(CNT[2][lv[2]]); arr.forEach(function(p){ chloro(U(p[0]), V(p[1]), mk, p[2], sel === 2); hit(2, U(p[0]), V(p[1])); }); }
      /* animations propres à la fonction */
      if (key === "pancr" && lv[3] > 0 && lv[4] > 0){
        for (i = 0; i < 6 + lv[4]; i++){ var ph2 = (t * 0.22 + i / (6 + lv[4])) % 1, gx = 0.5 + Math.sin(i * 2.3) * 0.12 * (1 - ph2), gy = 0.5 - ph2 * 0.42; B4.ell(c, U(gx), V(gy), mk * 0.6, mk * 0.6, "#f2b33d", "#9a6a12", 1); }
        S.draw.label(c, "enzymes exportées ↑", U(0.5), V(0.04), {color:"#1f4b9e", size:9.5});
      }
      if (key === "foie" && lv[5] > 0){ for (i = 0; i < 10; i++){ var ph3 = (t * 0.15 + i * 0.1) % 1; S.draw.dot(c, U(0.12 + ph3 * 0.6), V(0.25 + (i * 0.37 % 0.5)), 2.6, ph3 > 0.5 ? "#7cb85c" : "#c0321d"); } S.draw.label(c, "toxine → produit inoffensif", U(0.5), V(0.03), {color:"#5f6b7a", size:9.5}); }
      if (key === "feuille" && lv[2] > 0){ for (i = 0; i < 4; i++){ var ph4 = (t * 0.3 + i * 0.25) % 1; B4.ell(c, U(0.96) + 6, V(0.85 - ph4 * 0.75), 3.2, 3.2, "rgba(130,190,240,.8)", "#2f7fd1", 1); } S.draw.text(c, "O₂", U(0.96) + 6, V(0.04), {size:10, color:P.blue}); }
      if (key === "gr"){ for (i = 0; i < 8; i++){ var ph5 = (t * 0.35 + i / 8) % 1, ang = i * 0.785; var rad = s0 * (0.62 - 0.36 * ph5); S.draw.dot(c, U(0.5) + Math.cos(ang) * rad, V(0.5) + Math.sin(ang) * rad, 2.8, ph5 > 0.9 ? "#c0321d" : P.blue); } S.draw.label(c, "O₂ fixé par l'hémoglobine", U(0.5), V(0.5), {color:"#8e2020", size:9.5}); }
      if (key === "coeur") S.draw.label(c, "contraction", U(0.5), V(0.12), {color:"#a33c4f", size:9.5});
    }
    /* ---- barres d'abondance ---- */
    function bars(X0, y0, W0, h, lv, cols){
      var ctx = c.ctx, per = 8 / cols, rowH = h / per, w = (W0 - (cols - 1) * 14) / cols, lw = Math.min(118, w * 0.48), bw = w - lw - 26, target = D[st.q].v, build = mode.value === "b";
      st.bars = {X0:X0, cw:w + 14, lw:lw, w:bw, y0:y0, rh:rowH, per:per, cols:cols};
      for (var i = 0; i < 8; i++){
        var x0 = X0 + Math.floor(i / per) * (w + 14), y = y0 + (i % per) * rowH + rowH / 2, on = st.sel === i;
        if (on){ S.draw.rrect(c, x0 - 4, y - rowH / 2 + 1, w + 4, rowH - 2, 6); ctx.fillStyle = "rgba(244,197,66,.22)"; ctx.fill(); }
        S.draw.text(c, ORG[i][0], x0 + lw - 6, y, {size:lw < 100 ? 9.5 : 10.5, color:"#2c3a4e", align:"right", weight:on ? 800 : 600});
        S.draw.rrect(c, x0 + lw, y - rowH * 0.28, bw, rowH * 0.56, 4); ctx.fillStyle = "#edf0f4"; ctx.fill();
        for (var q = 1; q < 5; q++){ ctx.fillStyle = "#fff"; ctx.fillRect(x0 + lw + q * bw / 5 - 0.5, y - rowH * 0.28, 1, rowH * 0.56); }
        if (lv[i] > 0){ S.draw.rrect(c, x0 + lw, y - rowH * 0.28, bw * lv[i] / 5, rowH * 0.56, 4); ctx.fillStyle = ORG[i][2]; ctx.fill(); }
        if (build){ S.draw.dot(c, x0 + lw + bw * lv[i] / 5, y, 6.5, st.drag === i ? P.red : P.ink); }
        if (build && st.checked){ var tx = x0 + lw + bw * target[i] / 5, okk = Math.abs(lv[i] - target[i]) <= (i === 0 ? 0 : 1) && (target[i] === 0) === (lv[i] === 0); S.draw.line(c, tx, y - rowH * 0.42, tx, y + rowH * 0.42, P.ink, 2.2); S.draw.text(c, okk ? "✓" : "✗", x0 + lw + bw + 14, y, {size:12, color:okk ? P.green : P.red}); }
        else S.draw.text(c, String(lv[i]), x0 + lw + bw + 12, y, {size:11, color:"#2c3a4e"});
      }
    }
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); }); lp.play();
    c.pointer(function(type, p){
      var b = st.bars;
      if (type === "down"){
        st.drag = -1;
        if (b && p.y >= b.y0 && p.y <= b.y0 + b.per * b.rh && p.x >= b.X0){ var col = Math.min(b.cols - 1, Math.floor((p.x - b.X0) / b.cw)), i = col * b.per + Math.floor((p.y - b.y0) / b.rh); st.sel = i; st.bx = b.X0 + col * b.cw + b.lw; if (mode.value === "b" && p.x >= st.bx - 12) st.drag = i; }
        else { var best = -1, bd = 26; st.hits.forEach(function(h){ var d = Math.hypot(p.x - h[1], p.y - h[2]); if (d < bd){ bd = d; best = h[0]; } }); if (best >= 0) st.sel = best; }
      }
      if ((type === "down" || type === "drag") && st.drag >= 0 && b && !st.checked){ st.lev[st.drag] = Math.max(0, Math.min(5, Math.round((p.x - st.bx) / b.w * 5))); }
      if (type === "up") st.drag = -1;
      k.redraw();
    });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, key = mode.value === "b" ? st.q : cell.value, lv = levels(), d = D[key];
      var dx, dy, dw, dh, bx, by, bw2, bh2;
      if (wide){ dx = 10; dy = 26; dw = W - 20; dh = H * 0.6 - 34; bx = 8; by = H * 0.6 + 14; bw2 = W - 16; bh2 = H * 0.4 - 18; }
      else { dx = 10; dy = 24; dw = W - 20; dh = H * 0.5 - 34; bx = 6; by = H * 0.5 + 8; bw2 = W - 12; bh2 = H * 0.5 - 14; }
      var ar = d.ar, cw = Math.min(dw, dh * ar), ch = cw / ar;
      ctx.fillStyle = "#f8fafc"; S.draw.rrect(c, dx - 4, dy - 4, dw + 8, dh + 8, 12); ctx.fill();
      drawCell(key, lv, dx + (dw - cw) / 2, dy + (dh - ch) / 2, cw, ch);
      var title = mode.value === "b" ? "À construire : " + d.n : d.n;
      S.draw.text(c, title, dx, 11, {size:wide ? 12 : 11, color:P.ink, align:"left"});
      S.draw.text(c, mode.value === "b" ? (st.checked ? "Abondance : ta réponse (barres) et la vraie valeur (trait)" : "Glisse les barres : abondance de 0 à 5") : "Abondance relative des organites (0 à 5)", bx, by - 12, {size:wide ? 10.5 : 9.5, color:"#5f6b7a", align:"left"});
      bars(bx, by, bw2, bh2, lv, wide ? 2 : 1);
      var mxv = Math.max.apply(null, lv), mx = lv.indexOf(mxv);
      ro.set(0, mxv === 0 ? "aucun organite" : ORG[mx][0]); ro.set(1, st.sel >= 0 ? ORG[st.sel][0] + " : " + ORG[st.sel][1] : "touche une barre"); ro.set(2, st.tot ? st.score + " / " + st.tot : "—");
      if (mode.value === "o") nt.set("<b>" + d.n + ".</b> " + d.f, "");
      else if (!st.checked) nt.set("<b>Défi.</b> Donne à la " + d.n.charAt(0).toLowerCase() + d.n.slice(1) + " le profil d'organites qu'exige sa fonction : glisse chaque barre de 0 à 5, regarde la cellule changer, puis « Vérifier ». Réussi si au moins 6 organites sur 8 sont justes (à 1 niveau près ; le noyau et les absences doivent être exacts).", "warn");
      else { var g = good(); nt.set((g >= 6 ? "<b>Réussi : " + g + " / 8.</b> " : "<b>" + g + " / 8 seulement.</b> Compare tes barres aux traits noirs. ") + d.f + " Score : " + st.score + " / " + st.tot + ".", g >= 6 ? "ok" : "warn"); }
    });
  }
});

SFA.sim({
  id:"b4-c02-mito", ch:"c02", tag:"Cellule musculaire · modèle",
  titre:"Mitochondries malades : l'effort impossible",
  resume:"Une fibre musculaire vit : ses mitochondries fournissent l'ATP. Retire-en, abîme-les et pousse l'effort.",
  but:"Règle le nombre de mitochondries, la part défaillante et l'effort (ou glisse le point rouge sur le graphique). Cherche l'effort à partir duquel le muscle passe en fermentation, puis en épuisement.",
  aRetenir:"Le muscle couvre sa demande en ATP surtout par respiration (mitochondries). Quand elles sont moins nombreuses ou défaillantes, la capacité aérobie baisse : à effort plus faible la cellule doit recourir à la fermentation lactique (peu rentable) et s'épuise vite.",
  piege:"Modèle simplifié en unités relatives : 100 = capacité aérobie d'un muscle sain. La fermentation ne fournit qu'un complément limité (ici 15 unités) et fait monter le lactate.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.2});
    var N = k.slider("Nombre de mitochondries (100 % = normal)", 10, 150, 5, 100, "%");
    var dy = k.slider("Part de mitochondries défaillantes", 0, 100, 5, 0, "%");
    var e = k.slider("Effort musculaire", 0, 100, 1, 50, "%");
    var ro = k.readouts(["Demande en ATP", "Apport aérobie", "Apport par fermentation", "Seuil d'effort aérobie"]);
    var nt = k.note("", "");
    k.button("Muscle sain", function(){ N.set(100); dy.set(0); });
    k.button("Myopathie mitochondriale (60 % défaillantes)", function(){ N.set(100); dy.set(60); });
    var ANA = 15, rr = B4.rng(21), slots = [], parts = [], tt = 0, geo = {};
    for (var i = 0; i < 30; i++) slots.push({x:0.04 + (i % 10) * 0.095 + (rr() - .5) * 0.02, y:i < 10 ? 0.12 : i < 20 ? 0.5 : 0.84, a:rr() * 6.28, order:rr()});
    var order = slots.map(function(s, i){ return i; }).sort(function(a, b){ return slots[a].order - slots[b].order; });
    function model(){ var cap = 100 * N.value / 100 * (1 - dy.value / 100), dem = 10 + 0.9 * e.value; return {cap:cap, dem:dem, aer:Math.min(dem, cap), ana:Math.min(Math.max(dem - cap, 0), ANA), def:Math.max(dem - cap - ANA, 0)}; }
    var lp = k.loop(function(dt){
      tt += dt; var m = model(), nm = Math.round(N.value / 100 * 20), healthy = [];
      order.slice(0, nm).forEach(function(ix, j){ if (j >= Math.round(nm * dy.value / 100)) healthy.push(ix); });
      if (healthy.length && rr() < m.aer / 100 * 14 * dt * 3){ var s = slots[healthy[Math.floor(rr() * healthy.length)]]; parts.push({k:"atp", x:s.x, y:s.y, tx:0.1 + rr() * 0.8, ty:0.5, t:0, d:1.2}); }
      if (m.ana > 0 && rr() < m.ana / 15 * 3 * dt) parts.push({k:"lac", x:0.2 + rr() * 0.6, y:0.5, tx:0.2 + rr() * 0.6, ty:0.1, t:0, d:2});
      parts.forEach(function(p){ p.t += dt; }); parts = parts.filter(function(p){ return p.t < p.d; });
      k.redraw();
    });
    lp.play();
    function ease(x){ return x * x * (3 - 2 * x); }
    k.draw(function(){
      var m = model(), cap = m.cap, dem = m.dem, aer = m.aer, ana = m.ana, def = m.def;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, fh = H * 0.36, nm = Math.round(N.value / 100 * 20), nbad = Math.round(nm * dy.value / 100);
      /* fibre musculaire */
      var fx = 8, fw = W - 16, fy = 8;
      S.draw.rrect(c, fx, fy, fw, fh, 22); var fg = ctx.createLinearGradient(0, fy, 0, fy + fh); fg.addColorStop(0, "#fde3df"); fg.addColorStop(1, "#f7c9c4"); ctx.fillStyle = fg; ctx.fill(); ctx.strokeStyle = def > 0 ? P.red : "#c97b73"; ctx.lineWidth = def > 0 ? 3.5 : 2.5; ctx.stroke();
      var amp = def > 0 ? 0.15 : 0.08 + e.value / 100 * 0.45, sp = 14, sh = Math.sin(tt * (3 + e.value / 25)) * amp * (def > 0 ? 0.3 : 1);
      ctx.save(); ctx.beginPath(); S.draw.rrect(c, fx, fy, fw, fh, 22); ctx.clip();
      for (var x = fx + 12; x < fx + fw; x += sp + sh * 4){ ctx.fillStyle = "rgba(160,50,60,.22)"; ctx.fillRect(x, fy + 5, 3, fh - 10); ctx.fillStyle = "rgba(160,50,60,.1)"; ctx.fillRect(x + 6 + sh * 3, fy + 12, 1.5, fh - 24); }
      ctx.restore();
      /* mitochondries */
      for (var i = 0; i < nm; i++){ var s = slots[order[i]], bad = i < nbad, x = fx + 14 + s.x * (fw - 40), y = fy + 16 + (s.y) * (fh - 44) * 0.98;
        ctx.save(); ctx.translate(x + 8, y + 5); ctx.rotate(Math.sin(s.a) * 0.4); S.draw.rrect(c, -11, -6, 22, 12, 6); var mg = ctx.createLinearGradient(0, -6, 0, 6); mg.addColorStop(0, bad ? "#d5d9e0" : "#8fd6ad"); mg.addColorStop(1, bad ? "#aeb6c2" : "#4fb584"); ctx.fillStyle = mg; ctx.fill(); ctx.strokeStyle = bad ? "#6b7585" : "#1f7a52"; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(-5, 2); ctx.moveTo(0, 4); ctx.lineTo(0, -2); ctx.moveTo(5, -4); ctx.lineTo(5, 2); ctx.strokeStyle = bad ? "#6b7585" : "#1f7a52"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
        if (bad){ S.draw.text(c, "×", x + 8, y + 5, {size:12, color:P.red}); } }
      /* particules */
      parts.forEach(function(p){ var u = ease(p.t / p.d), x = fx + 14 + (p.x + (p.tx - p.x) * u) * (fw - 40), y = fy + 16 + (p.y + (p.ty - p.y) * u) * (fh - 44); var al = p.t > p.d - 0.3 ? (p.d - p.t) / 0.3 : 1; ctx.save(); ctx.globalAlpha = Math.max(0, al);
        if (p.k === "atp"){ S.draw.glow(c, x, y, 8, P.yellow, 0.6); S.draw.dot(c, x, y, 3.4, "#f4c542"); } else { S.draw.dot(c, x, y, 3.6, P.pink); } ctx.restore(); });
      S.draw.label(c, "fibre musculaire · " + nm + " mitochondries" + (nbad ? " dont " + nbad + " défaillantes" : ""), 14, fy + fh + 12, {color:P.ink, size:10.5, align:"left"});
      S.draw.label(c, "● ATP", W - 100, fy + fh + 12, {color:P.amber, size:10}); S.draw.label(c, "● lactate", W - 50, fy + fh + 12, {color:P.pink, size:10});
      if (def > 0) S.draw.label(c, "ÉPUISEMENT", W / 2, fy + fh / 2, {color:P.red, size:14});
      /* barre demande / apports */
      var by = fy + fh + 40, bw = W - 28, sc = bw / 170, bx = 14;
      S.draw.text(c, "Demande en ATP couverte par :", bx, by - 10, {size:10.5, color:"#5f6b7a", align:"left"});
      S.draw.rrect(c, bx, by, bw, 16, 8); ctx.fillStyle = "#eef1f5"; ctx.fill();
      var segs = [[aer, P.green], [ana, P.amber], [def, P.red]], acc = 0; segs.forEach(function(sg){ if (sg[0] > 0.01){ ctx.fillStyle = sg[1]; ctx.fillRect(bx + acc * sc, by + 1, sg[0] * sc, 14); acc += sg[0]; } });
      S.draw.line(c, bx + dem * sc, by - 4, bx + dem * sc, by + 20, P.ink, 2); S.draw.text(c, "demande " + S.fmt(dem, 0), Math.min(W - 40, bx + dem * sc), by + 28, {size:10, color:P.ink});
      /* graphe */
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:170, xl:"effort (%)", yl:"ATP (unités rel.)", stepX:20, stepY:50, t:by + 44, b:30, l:44});
      geo = {ax:ax};
      S.draw.line(c, ax.X(0), ax.Y(10), ax.X(100), ax.Y(100), P.red, 3);
      S.draw.line(c, ax.X(0), ax.Y(cap), ax.X(100), ax.Y(cap), P.green, 3);
      S.draw.line(c, ax.X(0), ax.Y(cap + ANA), ax.X(100), ax.Y(cap + ANA), P.amber, 2, [6, 4]);
      S.draw.label(c, "demande", ax.X(80), ax.Y(10 + 0.9 * 80) - 16, {color:P.red, size:10}); S.draw.label(c, "capacité aérobie", ax.X(24), ax.Y(cap) + (cap > 140 ? 16 : -12), {color:P.green, size:10}); S.draw.label(c, "+ fermentation", ax.X(62), ax.Y(cap + ANA) - 10 + (cap + ANA > 150 ? 22 : 0), {color:P.amber, size:10});
      S.draw.dot(c, ax.X(e.value), ax.Y(dem), 8, P.red);
      var thr = (cap - 10) / 0.9, thr2 = (cap + ANA - 10) / 0.9;
      ro.set(0, S.fmt(dem, 0)); ro.set(1, S.fmt(aer, 0)); ro.set(2, S.fmt(ana, 0));
      ro.set(3, thr < 0 ? "dès le repos" : thr >= 100 ? "> 100 % (jamais)" : S.fmt(thr, 0) + " %");
      var msg, kind;
      if (def > 0){ msg = "Épuisement : demande " + S.fmt(dem, 0) + " > aérobie " + S.fmt(cap, 0) + " + fermentation " + ANA + ". Il manque " + S.fmt(def, 0) + " unités d'ATP : arrêt de l'effort."; kind = "bad"; }
      else if (ana > 0){ msg = "Zone de fermentation lactique : le complément (" + S.fmt(ana, 0) + ") vient de la glycolyse seule, peu rentable ; le lactate s'accumule. L'effort est tenable peu de temps."; kind = "warn"; }
      else { msg = "La respiration couvre toute la demande : effort durable, pas d'accumulation de lactate."; kind = "ok"; }
      nt.set((cap < 10 ? "Même au repos (demande 10), l'apport aérobie (" + S.fmt(cap, 0) + ") est insuffisant. " : "") + msg + (thr2 >= 0 && thr2 < 100 ? " Effort maximal tenable (avec fermentation) : " + S.fmt(thr2, 0) + " %." : ""), kind);
    });
    c.pointer(function(type, p){ if (type === "move" || !geo.ax) return; if (type === "down" && (p.y < geo.ax.T - 6 || p.y > geo.ax.B + 6)) return; e.set(Math.max(0, Math.min(100, Math.round(geo.ax.ix(p.x))))); k.redraw(); });
    c.cv.style.touchAction = "pan-y";
  }
});
