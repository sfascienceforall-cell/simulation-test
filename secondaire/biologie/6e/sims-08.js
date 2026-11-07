/* Chapitre 8 · Origine de la vie, classification et diversité */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c08-miller", ch: "c08", tag: "Classique",
  titre: "L'expérience de Miller : quelles conditions fabriquent des molécules du vivant ?",
  resume: "Étincelles dans un mélange de gaz simulant l'atmosphère primitive : l'indice de production dépend fortement de la nature des gaz.",
  but: "Choisis les gaz (source de carbone, source d'azote, dihydrogène), l'énergie des étincelles et la durée. Les gaz circulent dans l'appareil, les éclairs frappent le ballon et le piège se colore à mesure que des molécules organiques s'accumulent. L'indice est un repère relatif (modèle qualitatif), pas un pourcentage réel.",
  aRetenir: "En 1953, Miller a soumis à des étincelles un mélange d'eau, de méthane, d'ammoniac et de dihydrogène : après quelques jours, il a obtenu des acides aminés. Cela montre que des molécules organiques peuvent se former à partir de molécules simples sans intervention du vivant. Les gaz réducteurs (CH₄, NH₃, H₂) donnent bien plus de molécules que le CO₂ et le N₂.",
  piege: "Miller n'a pas créé la vie : il a obtenu des briques (acides aminés), pas une cellule. On pense aujourd'hui que l'atmosphère primitive était moins réductrice que celle de Miller, mais des synthèses analogues sont possibles localement (volcans, fontaines hydrothermales) et des acides aminés existent aussi dans des météorites. Indice de la simulation : valeurs pédagogiques.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, T = 0;
    var cs = k.seg("Source de carbone", [["CH4", "Méthane CH₄"], ["CO2", "Dioxyde de carbone CO₂"]], "CH4");
    var ns = k.seg("Source d'azote", [["NH3", "Ammoniac NH₃"], ["N2", "Diazote N₂"]], "NH3");
    var h2 = k.toggle("Dihydrogène H₂ présent", true);
    var en = k.slider("Énergie des étincelles", 0, 10, 1, 5, "");
    var dj = k.slider("Durée", 0, 14, 1, 7, "jours");
    var lp = k.loop(function(dt, t){ T = t; k.redraw(); }); lp.play();
    var ro = k.readouts(["Indice de production (0 à 100)", "Molécules détectées"]);
    var note = k.note("", "");
    function Y(d){ var Cf = cs.value === "CH4" ? 1 : 0.04, Nf = ns.value === "NH3" ? 1 : 0.15, Hf = h2.value ? 1 : 0.4, E = en.value / (en.value + 2) * 1.2; return 100 * Cf * Nf * Hf * Math.min(1, E) * (1 - Math.exp(-d / 4)); }
    function bolt(ctx, x1, y1, x2, y2, seed, col){
      var n = 7, px = x1, py = y1, i; ctx.beginPath(); ctx.moveTo(x1, y1);
      for (i = 1; i < n; i++){ var f = i / n, r = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453; r = r - Math.floor(r) - 0.5; ctx.lineTo(x1 + (x2 - x1) * f + r * 22, y1 + (y2 - y1) * f + (Math.sin(seed + i * 3.1)) * 9); }
      ctx.lineTo(x2, y2); ctx.strokeStyle = col; ctx.stroke();
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, y = Y(dj.value), narrow = W < 440;
      var sx = W * 0.5, sy = 78, sr = Math.min(52, W * 0.12), fx = Math.max(54, W * 0.15), fy = 176, fr = 34, rx = W - 36;
      var path = [[fx, fy - fr + 2], [fx, 78], [sx - sr, 78], [sx + sr, 78], [rx, 78], [rx, 150], [rx, 178], [fx + fr - 6, 190]];
      var seg = [], tot = 0, i;
      for (i = 1; i < path.length; i++){ var dd = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(dd); tot += dd; }
      function at(s){ s = ((s % tot) + tot) % tot; for (var j = 0; j < seg.length; j++){ if (s <= seg[j]){ var f = s / seg[j]; return [path[j][0] + (path[j + 1][0] - path[j][0]) * f, path[j][1] + (path[j + 1][1] - path[j][1]) * f, j]; } s -= seg[j]; } return path[path.length - 1].concat([0]); }
      /* tuyaux */
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      [["#c9d3df", 11], ["#f6f9fc", 7]].forEach(function(st){ ctx.strokeStyle = st[0]; ctx.lineWidth = st[1]; ctx.beginPath(); ctx.moveTo(path[0][0], path[0][1]); for (var j = 1; j < path.length; j++) ctx.lineTo(path[j][0], path[j][1]); ctx.stroke(); });
      /* réfrigérant (manchon d'eau froide) */
      ctx.fillStyle = "rgba(120,180,230,.35)"; ctx.strokeStyle = "#7fa9cf"; ctx.lineWidth = 1.5; S.draw.rrect(c, rx - 13, 98, 26, 46, 6); ctx.fill(); ctx.stroke();
      /* piège : tube en U coloré */
      var cr = 215 - y * 1.0, cg = 225 - y * 1.5, cb = 245 - y * 2.2, tc = "rgba(" + Math.round(cr) + "," + Math.round(cg) + "," + Math.round(cb) + ",.95)";
      var lv = 12 + 16 * Math.min(1, y / 70); ctx.fillStyle = tc; S.draw.rrect(c, rx - 15, 186, 30, 30, 9); ctx.fill(); ctx.strokeStyle = "#7b8694"; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
      /* ballon des gaz + électrodes */
      var gl = ctx.createRadialGradient(sx - sr * .3, sy - sr * .3, 4, sx, sy, sr);
      gl.addColorStop(0, "#ffffff"); gl.addColorStop(1, y > 40 ? "#fbe9cf" : "#e8f1fa");
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 6.2832); ctx.fillStyle = gl; ctx.fill(); ctx.strokeStyle = "#7b8694"; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.fillRect(sx - sr * .55 - 3, sy - sr - 12, 6, sr * .55 + 12); ctx.fillRect(sx + sr * .55 - 3, sy - sr - 12, 6, sr * .55 + 12);
      var ex1 = sx - sr * .55, ex2 = sx + sr * .55, ey = sy - sr * .45;
      var on = en.value > 0 && Math.sin(T * 17) + Math.sin(T * 7.3) > 0.2;
      if (on){ S.draw.glow(c, sx, ey + 4, sr * (0.8 + en.value * 0.05), "#f4c542", 0.18 + en.value * 0.045); ctx.lineWidth = 1.5 + en.value * 0.25; bolt(ctx, ex1, ey, ex2, ey + 2, Math.floor(T * 17), "#d98a07"); ctx.lineWidth = 1; bolt(ctx, ex1, ey, ex2, ey + 2, Math.floor(T * 17) + 3, "#fff6c9"); }
      /* ballon d'eau + bulles */
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 6.2832); ctx.fillStyle = "#f6f9fc"; ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, fr - 1, 0, 6.2832); ctx.clip();
      ctx.fillStyle = "rgba(70,140,210,.55)"; ctx.fillRect(fx - fr, fy + 2, 2 * fr, fr); 
      for (i = 0; i < 6; i++){ var ph = (T * 0.9 + i * 0.37) % 1; ctx.beginPath(); ctx.arc(fx - 16 + i * 6.5, fy + 30 - ph * 32, 1.6 + (i % 3) * .8, 0, 6.2832); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fill(); }
      ctx.restore(); ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 6.2832); ctx.strokeStyle = "#7b8694"; ctx.lineWidth = 2.4; ctx.stroke();
      /* flamme */
      var fl = 6 + Math.sin(T * 14) * 2; ctx.fillStyle = "#e07a1f"; ctx.beginPath(); ctx.moveTo(fx - 8, fy + fr + 16); ctx.quadraticCurveTo(fx, fy + fr + 16 - fl - 8, fx + 8, fy + fr + 16); ctx.fill();
      ctx.fillStyle = "#f4c542"; ctx.beginPath(); ctx.moveTo(fx - 4, fy + fr + 16); ctx.quadraticCurveTo(fx, fy + fr + 16 - fl, fx + 4, fy + fr + 16); ctx.fill();
      /* particules de gaz qui circulent ; elles se teintent quand le produit s'accumule */
      var np = 26, spd = 38 + en.value * 2;
      for (i = 0; i < np; i++){
        var s = i * tot / np + T * spd, p = at(s), prod = p[2] >= 5 ? Math.min(1, y / 60) : 0, col = i % 3 === 0 ? P.amber : i % 3 === 1 ? P.blue : P.grey;
        if (cs.value === "CO2" && i % 3 === 0) col = P.teal;
        if (prod > 0 && i % 2) col = P.violet;
        S.draw.dot(c, p[0], p[1], 3.2, col);
      }
      /* flèches de sens et étiquettes */
      S.draw.arrow(c, fx, 120, fx, 98, P.grey, 1.6);
      S.draw.label(c, "Eau chauffée (océan)", fx + 6, fy + fr + 44, {color: P.acc, size: 11});
      S.draw.label(c, cs.value === "CH4" ? "CH₄ · " + (ns.value === "NH3" ? "NH₃" : "N₂") + (h2.value ? " · H₂" : "") : "CO₂ · " + (ns.value === "NH3" ? "NH₃" : "N₂") + (h2.value ? " · H₂" : ""), sx, sy + sr + 16, {color: P.amber, size: 11});
      S.draw.label(c, "Étincelles", sx, sy - sr - 18, {color: P.orange, size: 11});
      S.draw.label(c, "Réfrigérant", rx - 20, 121, {color: P.teal, size: 11, align: "right"});
      S.draw.label(c, "Piège", rx, 236, {color: P.violet, size: 11});
      /* graphique */
      var ax = S.draw.axes(c, {x0: 0, x1: 14, y0: 0, y1: 100, stepX: 2, stepY: 25, t: 284, b: 32, xl: "jours", yl: "indice", l: 40});
      S.draw.area(c, ax, Y, 0, dj.value, P.violet, 0.14);
      S.draw.fn(c, ax, Y, P.acc, 2.8); S.draw.dot(c, ax.X(dj.value), ax.Y(y), 6.5, P.red);
      var th = [[3, "HCN, aldéhydes"], [10, "glycine"], [25, "alanine, autres acides aminés"], [45, "acide aspartique, acide glutamique"]], found = th.filter(function(t){ return y >= t[0]; }).map(function(t){ return t[1]; });
      ro.set(0, S.fmt(y, 0)); ro.set(1, found.length ? found.join(" ; ") : "aucune molécule organique notable");
      note.set(cs.value === "CO2" || ns.value === "N2" ? "Avec un gaz peu réducteur (CO₂ ou N₂), l'indice reste faible : les réactions qui forment les acides aminés sont bien moins efficaces." : y > 0 ? "Mélange réducteur : les étincelles (éclairs) transforment CH₄, NH₃ et H₂ en HCN et aldéhydes, qui réagissent dans l'eau (synthèse de Strecker) pour donner des acides aminés." : "Sans étincelles ou sans durée, rien ne se forme : règle l'énergie et la durée.", y > 25 ? "ok" : "warn");
    });
  }
});

/* ---------- Quel domaine ? ---------- */
var FEAT = [["noyau", "Noyau délimité par une membrane", {B: "non", A: "non", E: "oui"}], ["paroi", "Peptidoglycane dans la paroi", {B: "oui", A: "non", E: "non"}], ["ribo", "Ribosomes", {B: "70S", A: "70S", E: "80S"}], ["lip", "Liaison des lipides de membrane", {B: "ester", A: "éther", E: "ester"}], ["hist", "Histones associées à l'ADN", {B: "non", A: "oui", E: "oui"}], ["adn", "Chromosome", {B: "circulaire", A: "circulaire", E: "linéaires"}], ["mito", "Mitochondries", {B: "non", A: "non", E: "oui"}]];
var DOMN = {B: "Bactéries", A: "Archées", E: "Eucaryotes"};
var MYST = [["B", "Une cellule de 2 µm vivant dans l'intestin, capable de doubler toutes les 20 minutes."], ["A", "Une cellule vivant dans la vase sans oxygène, produisant du méthane."], ["E", "Une cellule de 8 µm qui fait lever la pâte à pain."], ["A", "Une cellule vivant dans un lac saturé de sel."], ["B", "Une cellule en chaînes, qui réalise la photosynthèse."], ["E", "Une cellule de 100 µm qui se déplace en émettant des pseudopodes."]];
SFA.sim({
  id: "b6-c08-domaine", ch: "c08", tag: "Défi",
  titre: "Cellule mystère : bactérie, archée ou eucaryote ?",
  resume: "Révèle les critères un par un, élimine des domaines et identifie la cellule avec le moins d'indices possible.",
  but: "Une cellule mystère est tirée au sort. Touche un « ? » sur le dessin de la cellule (ou le bouton) pour révéler un critère : le tableau grise les domaines incompatibles. Dès que tu penses savoir, donne ta réponse. Essaie d'utiliser le moins d'indices possible.",
  aRetenir: "Les trois domaines du vivant : Bactéries, Archées (procaryotes sans noyau) et Eucaryotes (cellules à noyau). Les archées ressemblent aux bactéries par l'organisation (pas de noyau, chromosome circulaire) mais aux eucaryotes par certains processus moléculaires (histones, machinerie de lecture de l'ADN). Les critères les plus décisifs : le noyau, la paroi, les ribosomes et les lipides.",
  piege: "Un critère isolé est rarement suffisant : « pas de noyau » ne départage pas bactéries et archées. « Procaryote » n'est pas un groupe de parenté : archées et eucaryotes sont plus proches entre eux que chacun ne l'est des bactéries. Tableau simplifié : il existe des exceptions (par exemple, certaines parois ou membranes atypiques).",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 520 : 480), P = S.draw.palette, seed = 1, shown = [], done = false, msg = "", ok = true, spots = [], best = null;
    var SHORT = {noyau: "Noyau", paroi: "Peptidoglycane", ribo: "Ribosomes", lip: "Lipides de membrane", hist: "Histones", adn: "Chromosome", mito: "Mitochondries"};
    function cur(){ return MYST[(seed - 1) % MYST.length]; }
    function reveal(fi){ if (done || shown.indexOf(fi) >= 0) return; shown.push(fi); k.redraw(); }
    var guess = k.seg("Ma réponse", [["B", "Bactérie"], ["A", "Archée"], ["E", "Eucaryote"]], "", function(v){
      if (done) return; var m = cur();
      if (v === m[0]){ done = true; msg = "Bravo : c'est " + (v === "E" ? "un eucaryote" : v === "A" ? "une archée" : "une bactérie") + ", trouvé" + (v === "E" ? "" : "e") + " avec " + shown.length + " indice(s)." + (shown.length <= 2 ? " Excellent : très peu d'indices !" : ""); ok = true; if (best === null || shown.length < best) best = shown.length; }
      else { msg = "Non : " + DOMN[v].toLowerCase() + " est incompatible avec au moins un indice. Révèle un critère de plus ou réfléchis."; ok = false; }
      k.redraw(); });
    k.button("Révéler un critère", function(){ if (shown.length < FEAT.length && !done){ var order = FEAT.map(function(f, i){ return i; }), r = B.rng(seed * 31 + 7); for (var i = order.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; } reveal(order.filter(function(o){ return shown.indexOf(o) < 0; })[0]); } }, true);
    k.button("Nouvelle cellule", function(){ seed++; shown = []; done = false; msg = ""; ok = true; });
    var ro = k.readouts(["Indices révélés", "Domaines encore possibles", "Record"]);
    var note = k.note("", "");
    c.pointer(function(t, p){ if (t !== "down") return; spots.forEach(function(s){ if (Math.hypot(p.x - s.x, p.y - s.y) < 20) reveal(s.i); }); });
    function seedr(i){ var r = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453; return r - Math.floor(r); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, m = cur(), d = m[0], keys = ["B", "A", "E"], i, j; spots = [];
      var words = m[1].split(" "), line = "", ly = 14, maxc = Math.floor((W - 16) / 6.8);
      words.forEach(function(w){ if ((line + " " + w).length > maxc){ S.draw.text(c, line, 8, ly, {align: "left", size: 12.5, color: P.ink}); ly += 17; line = w; } else line = line ? line + " " + w : w; });
      S.draw.text(c, line, 8, ly, {align: "left", size: 12.5, color: P.ink});
      /* ---- la cellule ---- */
      var cx = W / 2, cy = 126, rx = Math.min(W * 0.40, 190), ry = 66, isE = d === "E", sh = function(key){ return shown.indexOf(FEAT.map(function(f){ return f[0]; }).indexOf(key)) >= 0; };
      var fi = function(key){ return FEAT.map(function(f){ return f[0]; }).indexOf(key); };
      var rod = false;
      function body(){ ctx.beginPath(); if (rod) S.draw.rrect(c, cx - rx, cy - ry * 0.75, 2 * rx, ry * 1.5, ry * 0.75); else ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); }
      var g = ctx.createRadialGradient(cx - rx * .3, cy - ry * .4, 6, cx, cy, rx); g.addColorStop(0, "#fffdf6"); g.addColorStop(1, isE ? "#e6f1ea" : "#e8eefa");
      body(); ctx.fillStyle = g; ctx.fill();
      /* paroi / membrane */
      if (sh("paroi")){ body(); ctx.lineWidth = d === "B" ? 7 : 2; ctx.strokeStyle = d === "B" ? "#d9a23c" : "#9aa6b5"; ctx.stroke(); if (d === "B"){ body(); ctx.lineWidth = 1.2; ctx.strokeStyle = "#7b8694"; ctx.stroke(); } }
      else { body(); ctx.lineWidth = 2.2; ctx.strokeStyle = "#8a95a3"; ctx.setLineDash(shown.length ? [] : [6, 4]); ctx.stroke(); ctx.setLineDash([]); }
      /* noyau / nucléoïde */
      var nx = cx - rx * 0.18, ny = cy + 2, nr = isE ? ry * 0.55 : ry * 0.38;
      if (sh("noyau") || (sh("adn") || sh("hist"))){
        if (isE && sh("noyau")){ ctx.beginPath(); ctx.arc(nx, ny, nr, 0, 6.2832); ctx.fillStyle = "#dfe6fb"; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = "#4a63c9"; ctx.stroke(); ctx.beginPath(); ctx.arc(nx, ny, nr + 3.5, 0, 6.2832); ctx.lineWidth = 1; ctx.stroke(); }
        else if (sh("noyau")){ ctx.beginPath(); ctx.ellipse(nx, ny, nr, nr * .8, 0.3, 0, 6.2832); ctx.fillStyle = "rgba(98,54,196,.10)"; ctx.fill(); ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.strokeStyle = P.violet; ctx.stroke(); ctx.setLineDash([]); S.draw.text(c, "nucléoïde", nx, ny + nr * .8 + 11, {size: 10, color: P.violet}); }
      }
      /* chromosome */
      if (sh("adn")){
        ctx.lineWidth = 2.2; ctx.strokeStyle = P.violet;
        if (isE){ for (j = 0; j < 3; j++){ var a = j * 1.1 + 0.3, ox = nx + Math.cos(a) * 12, oy = ny + Math.sin(a) * 9; ctx.beginPath(); ctx.moveTo(ox - 9, oy - 9); ctx.lineTo(ox + 9, oy + 9); ctx.moveTo(ox + 9, oy - 9); ctx.lineTo(ox - 9, oy + 9); ctx.stroke(); } }
        else { ctx.beginPath(); ctx.ellipse(nx, ny, nr * .75, nr * .55, 0.3, 0, 6.2832); ctx.stroke(); }
      }
      /* histones : perles sur le fil */
      if (sh("hist")){ var hn = isE ? 7 : 8; for (j = 0; j < hn; j++){ var ha = j / hn * 6.2832, hxx = nx + Math.cos(ha) * nr * (isE ? .5 : .6), hyy = ny + Math.sin(ha) * nr * (isE ? .5 : .45); if (d === "B") break; S.draw.dot(c, hxx, hyy, 3.2, P.red); } if (d === "B") S.draw.text(c, "pas d'histones", nx, ny - nr - 8, {size: 10, color: P.grey}); }
      /* ribosomes */
      if (sh("ribo")){ var rr = isE ? 3.6 : 2.4; for (i = 0; i < 30; i++){ var ra = seedr(i) * 6.2832, rd = Math.sqrt(seedr(i + 50)) * 0.86, px = cx + Math.cos(ra) * rx * rd, py = cy + Math.sin(ra) * ry * rd * (rod ? 0.7 : 1); if (Math.hypot(px - nx, py - ny) < nr + 4) continue; S.draw.dot(c, px, py, rr, P.amber); } }
      /* mitochondries */
      if (sh("mito") && isE){ [[cx + rx * .5, cy - ry * .3, .4], [cx + rx * .45, cy + ry * .42, -.5], [cx - rx * .62, cy + ry * .32, .2]].forEach(function(mt){ ctx.save(); ctx.translate(mt[0], mt[1]); ctx.rotate(mt[2]); ctx.beginPath(); ctx.ellipse(0, 0, 15, 8, 0, 0, 6.2832); ctx.fillStyle = "#f6d3c4"; ctx.fill(); ctx.strokeStyle = P.red; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-9, 0); ctx.quadraticCurveTo(-5, -5, -2, 0); ctx.quadraticCurveTo(2, 5, 5, 0); ctx.quadraticCurveTo(8, -3, 10, 0); ctx.stroke(); ctx.restore(); }); }
      /* lipides de membrane (agrandissement) */
      if (sh("lip")){
        var lx = cx + rx - 4, ly2 = cy - ry - 2, lr = 27; ctx.beginPath(); ctx.arc(lx, ly2, lr, 0, 6.2832); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = "#7b8694"; ctx.stroke();
        var eth = d === "A"; for (j = 0; j < 3; j++){ var hx2 = lx - 14 + j * 14; S.draw.dot(c, hx2, ly2 - 9, 3.5, P.teal); S.draw.line(c, hx2, ly2 - 6, hx2 - 1.5, ly2 + 5, P.teal, 1.3); S.draw.line(c, hx2, ly2 - 6, hx2 + 1.5, ly2 + 5, P.teal, 1.3); S.draw.dot(c, hx2, ly2 + 14, 3.5, P.teal); S.draw.line(c, hx2, ly2 + 11, hx2 - 1.5, ly2 + 1, P.teal, 1.3); S.draw.line(c, hx2, ly2 + 11, hx2 + 1.5, ly2 + 1, P.teal, 1.3); }
        S.draw.text(c, FEAT[fi("lip")][2][d] + (eth ? " (monocouche possible)" : ""), lx, ly2 + lr + 10, {size: 10, color: P.teal});
      }
      /* points d'interrogation cliquables pour les critères non révélés */
      var anchors = {noyau: [nx - 2, ny], paroi: [cx, cy - ry + (rod ? ry * .25 : 0) - 1], ribo: [cx + rx * .55, cy - ry * .1], lip: [cx + rx - 4, cy - ry - 2], hist: [nx, ny - ry * .62], adn: [nx, ny + ry * .62], mito: [cx - rx * .65, cy + ry * .3]};
      FEAT.forEach(function(f, q){ if (shown.indexOf(q) >= 0 || done) return; var a = anchors[f[0]]; spots.push({x: a[0], y: a[1], i: q}); S.draw.glow(c, a[0], a[1], 17, P.amber, .35); S.draw.dot(c, a[0], a[1], 9, "#fff"); S.draw.text(c, "?", a[0], a[1] + 0.5, {size: 12, color: P.amber}); });
      /* ---- tableau ---- */
      var y0 = 238, nw = Math.max(92, W * 0.3), cw = (W - nw - 6) / 3, rh = 26;
      keys.forEach(function(dd, q){ S.draw.text(c, DOMN[dd], nw + cw * (q + 0.5), y0, {size: 11.5, color: P.acc}); });
      var alive = {B: 1, A: 1, E: 1};
      shown.forEach(function(q){ keys.forEach(function(dd){ if (FEAT[q][2][dd] !== FEAT[q][2][d]) alive[dd] = 0; }); });
      FEAT.forEach(function(f, r){
        var y = y0 + 14 + r * rh, rev = shown.indexOf(r) >= 0;
        ctx.fillStyle = rev ? "#fff7e0" : "#f3f5f8"; S.draw.rrect(c, 3, y, W - 6, rh - 3, 6); ctx.fill();
        S.draw.text(c, SHORT[f[0]], 9, y + rh / 2 - 1, {align: "left", size: 11, color: rev ? P.ink : P.grey, weight: rev ? 800 : 600});
        keys.forEach(function(dd, q){ var match = f[2][dd] === f[2][d]; S.draw.text(c, rev ? f[2][dd] : "?", nw + cw * (q + 0.5), y + rh / 2 - 1, {size: 11.5, color: !rev ? "#9aa6b5" : match ? P.green : P.red}); });
      });
      keys.forEach(function(dd, q){ if (!alive[dd]){ ctx.fillStyle = "rgba(255,255,255,.72)"; ctx.fillRect(nw + cw * q + 1, y0 + 8, cw - 2, FEAT.length * rh + 8); S.draw.text(c, "exclu", nw + cw * (q + 0.5), y0 + 14 + FEAT.length * rh - 8, {size: 11, color: P.red}); } });
      ro.set(0, shown.length + " / " + FEAT.length); var left = keys.filter(function(dd){ return alive[dd]; }); ro.set(1, left.map(function(dd){ return DOMN[dd]; }).join(", ")); ro.set(2, best === null ? "—" : best + " indice(s)");
      note.set(msg || (shown.length === 0 ? "Touche un « ? » sur la cellule ou le bouton « Révéler un critère »." : left.length === 1 ? "Un seul domaine reste possible : tu peux répondre." : left.length + " domaines restent possibles : continue."), done ? "ok" : ok ? "" : "warn");
    });
  }
});



/* ---------- hominisation ---------- */
var HOM = [
  ["Sahelanthropus", 7.0, 360, 7, 6, 0], ["Ardipithecus ramidus", 4.4, 325, 5.8, 4.4, 0], ["A. afarensis", 3.2, 450, 3.9, 2.9, 0], ["A. africanus", 2.5, 460, 3.3, 2.1, 0],
  ["P. boisei", 2.0, 520, 2.3, 1.2, 1], ["H. habilis", 1.9, 610, 2.4, 1.4, 2], ["H. erectus", 1.2, 950, 1.9, 0.1, 2], ["H. naledi", 0.3, 560, 0.335, 0.236, 2],
  ["H. heidelbergensis", 0.4, 1200, 0.7, 0.3, 2], ["H. neanderthalensis", 0.08, 1500, 0.4, 0.04, 2], ["H. floresiensis", 0.06, 420, 0.1, 0.05, 2], ["H. sapiens", 0.01, 1350, 0.3, 0, 2]
];
SFA.sim({
  id: "b6-c08-hominisation", ch: "c08", tag: "Données",
  titre: "Hominisation : volume crânien et buisson des hominidés",
  resume: "Volume crânien en fonction de l'âge, et espèces qui coexistaient : l'évolution humaine n'est pas une file indienne.",
  but: "Chaque point est une espèce d'hominine (valeurs moyennes arrondies, ordres de grandeur). Filtre les genres, touche un point pour lire ses données, active la droite de tendance pour le genre Homo. Le curseur de temps montre combien d'espèces coexistaient.",
  aRetenir: "En moyenne, le volume crânien augmente quand on se rapproche du présent, surtout dans le genre Homo (environ 450 cm³ chez les australopithèques à plus de 1 300 cm³ chez Homo sapiens et Neandertal). Mais à presque toutes les époques, plusieurs espèces d'hominines coexistaient : l'évolution humaine ressemble à un buisson ramifié, pas à une file indienne.",
  piege: "Une droite de tendance résume une tendance moyenne, pas une loi : Homo floresiensis, très récente, avait un petit cerveau ; Neandertal avait un cerveau en moyenne aussi grand que le nôtre. Et l'espèce humaine ne descend pas d'un chimpanzé actuel : humains et chimpanzés ont un ancêtre commun.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, pick = null;
    var fl = k.seg("Espèces affichées", [["a", "Toutes"], ["h", "Genre Homo"], ["o", "Autres"]], "a");
    var tr = k.toggle("Droite de tendance (genre Homo)", false);
    var tm = k.slider("Il y a… (temps)", 0, 7, 0.1, 2, "Ma");
    var ro = k.readouts(["Espèce touchée", "Espèces qui coexistaient à cette date", "Pente de la droite (Homo)"]);
    var note = k.note("", ""), pts = [];
    var col = ["#8a95a3", "#b45309", "#1e3f8f"];
    c.pointer(function(t, p){ if (t !== "down") return; var best = null, bd = 400; pts.forEach(function(q){ var d = Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2); if (d < bd){ bd = d; best = q.i; } }); pick = best; k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      var ax = S.draw.axes(c, {x0: 7.5, x1: -0.3, y0: 200, y1: 1700, stepX: 1, stepY: 300, t: 14, b: 214, yl: "volume crânien (cm³)", l: 54});
      /* axes X inversés : ax.X est correct car x0 > x1 */
      for (var tk = 0; tk <= 7; tk++){ S.draw.line(c, ax.X(tk), ax.T, ax.X(tk), ax.B, "#edf0f4", 1); S.draw.text(c, String(tk), ax.X(tk), ax.B + 12, {size: 12, color: "#5f6b7a", weight: 600}); }
      pts = []; var hx = [], hy = [];
      HOM.forEach(function(h, i){ var show = fl.value === "a" || (fl.value === "h" && h[5] === 2) || (fl.value === "o" && h[5] !== 2); if (h[5] === 2){ hx.push(h[1]); hy.push(h[2]); } if (!show) return; var X = ax.X(h[1]), Y = ax.Y(h[2]); pts.push({x: X, y: Y, i: i}); S.draw.dot(c, X, Y, pick === i ? 8 : 5.5, col[h[5]]); if (pick === i) S.draw.text(c, h[0], Math.min(c.W - 70, Math.max(70, X)), Y - 16, {size: 12, color: P.ink, bg: "rgba(255,255,255,.85)"}); });
      var sl = 0;
      if (tr.value){ var n = hx.length, mx = hx.reduce(function(a, b){ return a + b; }, 0) / n, my = hy.reduce(function(a, b){ return a + b; }, 0) / n, sxy = 0, sxx = 0; for (var i = 0; i < n; i++){ sxy += (hx[i] - mx) * (hy[i] - my); sxx += Math.pow(hx[i] - mx, 2); } sl = sxy / sxx; var b0 = my - sl * mx; S.draw.line(c, ax.X(2.3), ax.Y(b0 + sl * 2.3), ax.X(0), ax.Y(b0), P.red, 2, [6, 4]); }
      S.draw.line(c, ax.X(tm.value), ax.T, ax.X(tm.value), ax.B, P.green, 1.6, [4, 3]);
      /* chronologie des espèces */
      var by = ax.B + 40, rh = 13; S.draw.text(c, "Barres : périodes d'existence (Ma)", c.W / 2, by - 8, {size: 12, color: P.grey});
      var alive = [];
      HOM.forEach(function(h, i){ var y = by + 4 + i * rh, x1 = ax.X(h[3]), x2 = ax.X(Math.max(h[4], 0)); ctx.fillStyle = col[h[5]]; ctx.globalAlpha = 0.85; ctx.fillRect(x1, y, Math.max(3, x2 - x1), rh - 3); ctx.globalAlpha = 1; if (tm.value <= h[3] && tm.value >= h[4]) alive.push(h[0]); });
      S.draw.line(c, ax.X(tm.value), by, ax.X(tm.value), by + 4 + HOM.length * rh, P.green, 1.6, [4, 3]);
      ro.set(0, pick !== null ? HOM[pick][0] + " : ≈ " + HOM[pick][2] + " cm³, ≈ " + (HOM[pick][1] < 0.05 ? "actuel" : S.fmt(HOM[pick][1], HOM[pick][1] < 1 ? 2 : 1) + " Ma") : "Touche un point");
      ro.set(1, alive.length + (alive.length ? " : " + alive.join(", ") : "")); ro.set(2, tr.value ? S.fmt(-sl, 0) + " cm³ de plus par million d'années" : "—");
      note.set(alive.length > 1 ? "À cette date, " + alive.length + " espèces d'hominines coexistaient : un buisson, pas une file." : alive.length === 1 ? "À cette date, une seule espèce de la liste est connue." : "Aucune espèce de la liste n'est connue à cette date.", "");
    });
  }
});

/* ---------- Horloge de la Terre ---------- */
var EV = [["Formation de la Terre", 4.54], ["Premiers océans (≈)", 4.3], ["Premières traces de vie", 3.5], ["Photosynthèse (O₂)", 2.7], ["Oxygène dans l'atmosphère", 2.4], ["Premiers eucaryotes", 1.8], ["Animaux pluricellulaires", 0.57], ["Explosion cambrienne", 0.54], ["Plantes terrestres", 0.47], ["Vertébrés terrestres", 0.37], ["Premiers dinosaures", 0.23], ["Fin des dinosaures non aviens", 0.066], ["Genre Homo", 0.0028], ["Homo sapiens", 0.0003]];
SFA.sim({
  id: "b6-c08-horloge", ch: "c08", tag: "Échelle",
  titre: "L'histoire de la Terre ramenée à une année",
  resume: "4,54 milliards d'années en 365 jours : à quelle date apparaissent les eucaryotes, les dinosaures, l'espèce humaine ?",
  but: "Fais glisser le curseur pour remonter dans le temps : l'aiguille tourne sur le calendrier de l'année terrestre et les événements déjà survenus s'allument. Compare l'horloge annuelle (échelle linéaire, où presque tout est écrasé en fin d'année) et la frise logarithmique (où chaque événement est lisible). Touche un événement pour le lire.",
  aRetenir: "Sur une échelle linéaire ramenée à une année, la vie existe depuis le printemps, mais les animaux pluricellulaires n'apparaissent que vers la mi-novembre, les dinosaures vers la mi-décembre et Homo sapiens environ une demi-heure avant la fin de l'année. L'histoire de la vie est surtout une histoire de micro-organismes. Les dates sont des ordres de grandeur, parfois discutées.",
  piege: "Les dates anciennes sont incertaines (les premiers océans, les premières traces de vie : certains indices sont encore débattus). Et une échelle de temps réduite à une année ne dit pas que l'évolution est « allée vers » l'espèce humaine : elle n'a pas de but.",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 610 : 480), P = S.draw.palette, pick = -1, hit = [];
    var sc = k.seg("Échelle du temps", [["l", "Horloge annuelle"], ["g", "Frise logarithmique"]], "l");
    var ag = k.slider("Il y a…", 0, 4.54, 0.01, 0, "Ga");
    var ro = k.readouts(["Date dans l'année terrestre", "Événements déjà survenus"]);
    var note = k.note("", "");
    var MON = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"], ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var MS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    function dateOf(a){ var d = Math.min(365 - 1e-6, (4.54 - a) / 4.54 * 365), day = Math.floor(d), m = 0; while (m < 11 && day >= ML[m]){ day -= ML[m]; m++; } var hh = (d - Math.floor(d)) * 24, h = Math.floor(hh), mn = Math.floor((hh - h) * 60); return (day + 1) + " " + MON[m] + (a < 0.02 ? ", " + h + " h " + (mn < 10 ? "0" : "") + mn : ""); }
    c.pointer(function(t, p){ if (t !== "down") return; var b = -1, bd = 22 * 22; hit.forEach(function(q){ var d = Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2); if (d < bd){ bd = d; b = q.i; } }); pick = b; k.redraw(); });
    var COL = ["#8a95a3", "#2f7fd1", "#24775a", "#24775a", "#0e7f96", "#6236c4", "#c26a0c", "#c26a0c", "#24775a", "#c26a0c", "#c0321d", "#c0321d", "#1f4b9e", "#1f4b9e"];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, a0 = ag.value, past = 0; hit = [];
      var n = EV.length;
      if (sc.value === "l"){
        var R = Math.min(W * 0.28, 112), cx = W / 2, cy = R + 44, r0 = R - 20, i, mo = 0, ang0 = -Math.PI / 2;
        function A(a){ return ang0 + (4.54 - a) / 4.54 * 2 * Math.PI; }
        /* anneau des mois */
        var acc = 0; for (i = 0; i < 12; i++){
          var a1 = ang0 + acc / 365 * 2 * Math.PI, a2 = ang0 + (acc + ML[i]) / 365 * 2 * Math.PI; acc += ML[i];
          ctx.beginPath(); ctx.arc(cx, cy, R, a1, a2); ctx.arc(cx, cy, r0, a2, a1, true); ctx.closePath();
          ctx.fillStyle = i % 2 ? "#eef2f7" : "#e3e9f1"; ctx.fill();
          var am = (a1 + a2) / 2; S.draw.text(c, MS[i], cx + Math.cos(am) * (R - 10), cy + Math.sin(am) * (R - 10), {size: 11, color: "#5f6b7a"});
        }
        /* portion écoulée */
        var ae = A(a0); ctx.beginPath(); ctx.arc(cx, cy, R, ang0, ae); ctx.arc(cx, cy, r0, ae, ang0, true); ctx.closePath(); ctx.fillStyle = S.draw.tint(P.green, 0.28); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.strokeStyle = "#b8c2cf"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r0, 0, 6.2832); ctx.stroke();
        S.draw.text(c, "1ᵉʳ janvier", cx, cy - R - 32, {size: 10.5, color: P.grey});
        /* événements numérotés (un rayon alterné pour les dates voisines) */
        var angs = EV.map(function(e){ return A(e[1]); }), pl = angs.slice(), gap = 0.2;
        for (i = n - 2; i >= 0; i--){ if (pl[i] > pl[i + 1] - gap) pl[i] = pl[i + 1] - gap; }
        EV.forEach(function(e, j){
          var happened = e[1] >= a0 - 1e-9; if (happened) past++;
          var rr = j === 0 ? r0 - 14 : R + 17; if (j === 0) pl[j] = angs[j]; var x = cx + Math.cos(pl[j]) * rr, y = cy + Math.sin(pl[j]) * rr, xr = cx + Math.cos(angs[j]) * r0, yr = cy + Math.sin(angs[j]) * r0;
          S.draw.line(c, xr, yr, cx + Math.cos(pl[j]) * (R + 8), cy + Math.sin(pl[j]) * (R + 8), happened ? COL[j] : "#c3cbd5", 1.2);
          S.draw.dot(c, xr, yr, 3, happened ? COL[j] : "#c3cbd5");
          ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.2832); ctx.fillStyle = happened ? COL[j] : "#d3dae3"; ctx.fill(); if (pick === j){ ctx.lineWidth = 2.5; ctx.strokeStyle = P.ink; ctx.stroke(); }
          S.draw.text(c, String(j + 1), x, y + 0.5, {size: 10, color: "#fff"}); hit.push({x: x, y: y, i: j});
        });
        /* aiguille */
        S.draw.line(c, cx, cy, cx + Math.cos(ae) * (R + 2), cy + Math.sin(ae) * (R + 2), P.red, 2.4);
        S.draw.dot(c, cx, cy, 5, P.red);
        S.draw.text(c, a0 < 0.001 ? "aujourd'hui" : S.fmt(a0, 2) + " Ga", cx, cy + 22, {size: 12, color: P.ink});
        /* liste */
        var ly = cy + R + 28, col2 = W >= 440, rh = 19, half = col2 ? Math.ceil(n / 2) : n;
        EV.forEach(function(e, j){
          var happened = e[1] >= a0 - 1e-9, cc = col2 ? Math.floor(j / half) : 0, rr2 = col2 ? j % half : j, x = 8 + cc * (W / 2), y = ly + rr2 * rh;
          if (pick === j){ ctx.fillStyle = "rgba(15,27,45,.07)"; S.draw.rrect(c, x - 4, y - 9, W / (col2 ? 2 : 1) - 10, rh - 1, 5); ctx.fill(); }
          ctx.beginPath(); ctx.arc(x + 7, y, 7, 0, 6.2832); ctx.fillStyle = happened ? COL[j] : "#d3dae3"; ctx.fill();
          S.draw.text(c, String(j + 1), x + 7, y + 0.5, {size: 9, color: "#fff"});
          S.draw.text(c, e[0].replace(" non aviens", ""), x + 19, y, {align: "left", size: 11, color: happened ? P.ink : "#a0aab6", weight: happened ? 700 : 600});
          if (col2 || pick === j) S.draw.text(c, dateOf(e[1]).replace(/, .*/, ""), x + W / (col2 ? 2 : 1) - 18, y, {align: "right", size: 10.5, color: happened ? P.grey : "#b5bdc8", weight: 600});
        });
        c.canvas && (c.canvas.style.height = "");
      } else {
        var lx = 8, L = W - 14, w = L - lx, rh2 = 24, top = 52, i2, lo = Math.log10(0.0002), hi = Math.log10(4.54);
        function pos(a){ return lx + (hi - Math.log10(Math.max(a, 0.0002))) / (hi - lo) * w; }
        [4, 3, 2, 1, 0.1, 0.01, 0.001].forEach(function(g){ var x = pos(g); S.draw.line(c, x, top - 12, x, top + n * rh2 - 8, "#e6eaf0", 1); S.draw.text(c, g >= 1 ? g + " Ga" : g === 0.1 ? "100 Ma" : g === 0.01 ? "10 Ma" : "1 Ma", x, top - 22, {size: 10, color: P.grey}); });
        EV.forEach(function(e, j){
          var y = top + j * rh2, happened = e[1] >= a0 - 1e-9; if (happened) past++;
          var x = pos(e[1]);
          S.draw.dot(c, x, y, pick === j ? 8 : 6, happened ? COL[j] : "#c3cbd5"); hit.push({x: x, y: y, i: j});
          var left = x > W * 0.55; S.draw.text(c, e[0], left ? x - 12 : x + 12, y, {align: left ? "right" : "left", size: 11, color: happened ? P.ink : "#a0aab6", weight: 700});
        });
        var xc = pos(Math.max(a0, 0.0002)); S.draw.line(c, xc, top - 12, xc, top + n * rh2 - 8, P.green, 2, [5, 3]);
        S.draw.text(c, "← il y a longtemps          échelle logarithmique          récent →", W / 2, top + n * rh2 + 14, {size: 11, color: P.grey});
      }
      if (pick >= 0){ var e0 = EV[pick]; S.draw.label(c, e0[0] + " : " + dateOf(e0[1]), W / 2, c.H - 14, {color: P.acc, size: 12}); }
      ro.set(0, dateOf(a0)); ro.set(1, past + " sur " + n);
      note.set(sc.value === "l" ? "Horloge annuelle : la vie apparaît au printemps, les dinosaures en décembre, Homo sapiens quelques minutes avant minuit le 31 décembre. Touche un numéro pour lire sa date." : "Échelle logarithmique : chaque événement est lisible, mais les intervalles de temps ne sont plus proportionnels : ne compare pas les distances.", "");
    });
  }
});

})();
