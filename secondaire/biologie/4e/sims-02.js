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
  resume:"Compare l'abondance des organites dans cinq types de cellules, puis devine une cellule d'après son profil.",
  but:"Choisis une cellule : les barres montrent l'abondance relative de chaque organite. En mode « Devine », retrouve la cellule d'après le profil.",
  aRetenir:"Une cellule spécialisée possède en abondance les organites liés à sa fonction : muscle cardiaque → mitochondries ; cellule sécrétrice → réticulum rugueux et Golgi ; hépatocyte → réticulum lisse ; cellule foliaire → chloroplastes. Chez le globule rouge mature des mammifères, noyau et organites ont disparu.",
  piege:"Une cellule spécialisée n'a pas de gènes en moins : toutes les cellules d'un organisme portent le même ADN, mais n'utilisent pas les mêmes gènes. Les niveaux affichés sont des abondances relatives (0 à 5), pas des comptages.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.78});
    var mode = k.seg("Mode", [["c","Comparer"],["d","Devine"]], "c");
    var cell = k.select("Cellule", [["coeur","Cellule musculaire cardiaque"],["pancr","Cellule sécrétrice du pancréas"],["foie","Hépatocyte (foie)"],["feuille","Cellule foliaire (palissade)"],["gr","Globule rouge mature"]], "coeur");
    var ro = k.readouts(["Organite le plus abondant", "Fonction de la cellule"]);
    var nt = k.note("", "");
    var orgs = ["Noyau", "Mitochondries", "Chloroplastes", "Réticulum rugueux", "Appareil de Golgi", "Réticulum lisse", "Lysosomes", "Grande vacuole"];
    var D = {
      coeur:{n:"Cellule musculaire cardiaque", v:[2, 5, 0, 1, 1, 3, 1, 0], f:"Se contracte sans arrêt : consomme beaucoup d'ATP, donc énormément de mitochondries ; le réticulum lisse stocke le calcium de la contraction."},
      pancr:{n:"Cellule sécrétrice du pancréas", v:[3, 3, 0, 5, 5, 1, 2, 0], f:"Fabrique et exporte des enzymes digestives : réticulum rugueux et Golgi très développés."},
      foie:{n:"Hépatocyte (foie)", v:[3, 4, 0, 3, 3, 5, 3, 0], f:"Détoxifie, stocke le glucose, fabrique des lipides : réticulum lisse très abondant, nombreux lysosomes et mitochondries."},
      feuille:{n:"Cellule foliaire (palissade)", v:[2, 2, 5, 1, 1, 1, 0, 4], f:"Fait la photosynthèse : chloroplastes en nombre ; grande vacuole centrale."},
      gr:{n:"Globule rouge mature", v:[0, 0, 0, 0, 0, 0, 0, 0], f:"Transporte le dioxygène grâce à l'hémoglobine ; sans noyau ni organites (chez les mammifères), il fait de la place à l'hémoglobine."}
    };
    var st = {q:"coeur", score:0, tot:0, shown:false};
    k.button("Nouvelle cellule mystère", function(){ var ks = Object.keys(D); st.q = ks[Math.floor(Math.random() * ks.length)]; st.shown = false; mode.set("d"); }, true);
    Object.keys(D).forEach(function(key){ k.button(D[key].n.split(" (")[0].replace("Cellule ", "").replace("musculaire cardiaque", "cardiaque").replace("sécrétrice du pancréas", "pancréas").replace("foliaire", "foliaire"), function(){ if (mode.value !== "d" || st.shown) return; st.shown = true; st.tot++; if (key === st.q) st.score++; st.last = key; }); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, key = mode.value === "c" ? cell.value : st.q, d = D[key], L = 128, bw = W - L - 40;
      var rowH = (H - 20) / 8;
      for (var i = 0; i < 8; i++){
        var y = 10 + i * rowH + rowH / 2;
        B4.txt(c, orgs[i], 6, y, B4.pal.ink, 12, "left");
        ctx.fillStyle = "#edf0f4"; ctx.fillRect(L, y - rowH * 0.32, bw, rowH * 0.64);
        ctx.fillStyle = ["#1e3f8f", "#B45309", "#2e6b55", "#0e7490", "#5B21B6", "#0e7490", "#be185d", "#0e7490"][i]; ctx.fillRect(L, y - rowH * 0.32, bw * d.v[i] / 5, rowH * 0.64);
        B4.txt(c, d.v[i] + "", L + bw + 14, y, B4.pal.ink, 12);
      }
      var mx = d.v.indexOf(Math.max.apply(null, d.v));
      if (mode.value === "c"){
        ro.set(0, Math.max.apply(null, d.v) === 0 ? "aucun (cellule sans organites)" : orgs[mx]); ro.set(1, d.n);
        nt.set("<b>" + d.n + ".</b> " + d.f, "");
      } else {
        ro.set(0, st.shown ? (Math.max.apply(null, d.v) === 0 ? "aucun" : orgs[mx]) : "?"); ro.set(1, st.shown ? d.n : "?");
        nt.set(st.shown ? (st.last === st.q ? "Bravo ! " : "Raté : c'était " + d.n + ". ") + d.f + " Score : " + st.score + "/" + st.tot + "." : "Quelle cellule a ce profil d'organites ? Clique sur un des boutons. Score : " + st.score + "/" + st.tot + ".", st.shown ? (st.last === st.q ? "ok" : "warn") : "warn");
      }
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
