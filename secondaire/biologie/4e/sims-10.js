/* Biologie 4e · chapitre 10 · Cycle cellulaire et mitose */
SFA.sim({
  id:"b4-c10-mitose", ch:"c10", tag:"Animation · défi",
  titre:"Mitose pas à pas : chromosomes, chromatides, ADN",
  resume:"Fais avancer le cycle d'une cellule à 6 chromosomes, glisse sur la frise des phases et relève chromosomes, chromatides et ADN.",
  but:"Anime le cycle ou glisse le curseur rouge sur la frise du bas (ou touche une phase). Relève les compteurs, puis relève les défis.",
  aRetenir:"L'ADN est répliqué pendant la phase S de l'interphase, pas pendant la mitose. Prophase : les chromosomes (à 2 chromatides) se condensent. Métaphase : alignés au centre. Anaphase : les chromatides sœurs se séparent et migrent vers les pôles. Télophase : deux noyaux se reforment, puis la cytocinèse sépare deux cellules filles à 2n chromosomes identiques à la cellule mère.",
  piege:"En anaphase, il y a momentanément 12 chromosomes (chaque chromatide devient un chromosome) dans la cellule, avant la division en deux cellules de 6. Une cellule fille a 2C d'ADN, comme la cellule en G1.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:.98});
    var ph = k.slider("Avancement du cycle", 0, 6.99, 0.01, 0, "");
    var ro = k.readouts(["Phase", "Chromosomes (dans la cellule)", "Chromatides", "ADN par noyau (2C = quantité en G1)"]);
    var ntD = k.note("", "");
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var u = ph.value + dt * 0.55; if (u >= 6.99){ ph.set(6.99); lp.pause(); } else ph.set(u); k.redraw(); });
    k.button("▶ Animer le cycle", function(){ if (ph.value >= 6.95) ph.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    var GOALS = [
      ["Trouve un moment où la cellule contient 12 chromosomes (et non 6).", function(u){ return u >= 5.05 && u < 6.6; }],
      ["Trouve un moment où il y a 12 chromatides mais seulement 6 chromosomes.", function(u){ return u >= 2 && u < 5; }],
      ["Arrête-toi quand la quantité d'ADN du noyau est en train de doubler.", function(u){ return u >= 1.1 && u < 1.95; }],
      ["Place les chromosomes alignés sur le plan équatorial.", function(u){ return u >= 4.15 && u < 5; }],
      ["Trouve l'instant où une cellule fille a 6 chromosomes et 2C d'ADN.", function(u){ return u >= 6.6; }]
    ], gi = 0;
    k.button("Défi suivant", function(){ gi = (gi + 1) % GOALS.length; });
    var NAMES = ["Interphase : G1", "Interphase : phase S", "Interphase : G2", "Prophase", "Métaphase", "Anaphase", "Télophase et cytocinèse"];
    var SHORT = ["G1", "S", "G2", "P", "M", "A", "T"];
    var TXT = [
      "La cellule croît et fonctionne. Chaque chromosome n'a qu'une chromatide (1 molécule d'ADN) ; la chromatine est étalée dans le noyau.",
      "L'ADN est répliqué (semi-conservatif) : chaque chromosome passe de 1 à 2 chromatides sœurs, jointes au centromère. Le nombre de chromosomes ne change pas.",
      "La réplication est finie, la cellule contrôle son ADN : 6 chromosomes à 2 chromatides = 12 chromatides, 4C.",
      "Les chromosomes se condensent et deviennent visibles ; l'enveloppe nucléaire se désagrège ; le fuseau se forme entre les deux centrosomes.",
      "Les chromosomes, accrochés aux fibres du fuseau par leur centromère, s'alignent dans le plan équatorial.",
      "Les chromatides sœurs se séparent et sont tirées vers les pôles ; chacune est désormais un chromosome : 12 chromosomes, 6 vers chaque pôle.",
      "Deux noyaux se reforment, les chromosomes se décondensent ; la cytocinèse sépare deux cellules filles à 6 chromosomes (2C), identiques à la mère."
    ];
    var LF = [1, 1, 0.82, 0.82, 0.64, 0.64], MAT = "#c0321d", PAT = "#1f4b9e";
    var BASE = [[-.28,-.22],[.22,-.3],[-.34,.12],[.3,.08],[-.05,.3],[.08,-.05]], ANG = [0.4, -0.7, 1.1, 0.2, -0.3, 0.9];
    function ease(x){ x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    /* chromosome à une ou deux chromatides : (x,y) centre, ang, longueur, couleur, condensation, duplication (0→1) */
    function chromo(x, y, ang, L, col, cd, dup, seed){
      var ctx = c.ctx, ca = Math.cos(ang), sa = Math.sin(ang), n = 14, g = lerp(2.2, 3.4, cd), A = (1 - cd) * 4.5 + 0.4;
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = col;
      var nch = dup > 0.02 ? 2 : 1;
      for (var s = 0; s < nch; s++){
        var sg = nch === 1 ? 0 : (s ? 1 : -1), lenS = (s === 1 && dup < 1) ? dup : 1;
        ctx.lineWidth = lerp(1.7, 5.2, cd); ctx.globalAlpha = s ? 0.82 : 1; ctx.beginPath();
        for (var q = 0; q <= n; q++){
          var t = q / n * 2 - 1; if (Math.abs(t) > lenS + 0.001 && s === 1) break;
          var tt = s === 1 && dup < 1 ? -1 + (q / n) * 2 * lenS : t;
          var off = sg * g * (cd > 0.3 ? Math.abs(tt) * 0.9 + 0.1 : 0.5) + Math.sin(tt * 4.2 + seed) * A;
          var lx = tt * L / 2, px = x + lx * ca - off * sa, py = y + lx * sa + off * ca;
          q ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
      if (cd > 0.5 && nch === 2){ ctx.save(); ctx.globalAlpha = (cd - 0.5) * 2; S.draw.dot(c, x, y, 3.2, "#13233a"); ctx.restore(); }
    }
    function vchrom(xc, yc, sg, L, col, cd, seed){      /* chromatide unique, centromère en tête vers le pôle sg */
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lerp(2, 5, cd); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(xc - sg * L * 0.42, yc - L * 0.5 * (cd > 0.3 ? 1 : 0.7)); ctx.lineTo(xc, yc); ctx.lineTo(xc - sg * L * 0.42, yc + L * 0.5 * (cd > 0.3 ? 1 : 0.7)); ctx.stroke(); ctx.restore();
      S.draw.dot(c, xc, yc, 2.8, "#13233a");
    }
    var tl = {};   /* frise cliquable */
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, u = ph.value, p = Math.min(6, Math.floor(u)), f = u - p;
      var hc = H * 0.68, cx = W / 2, cy = hc * 0.5 + 6, R = Math.min(W * 0.33, hc * 0.37);
      /* fond : milieu de culture subtil */
      var bg = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, Math.max(W, hc) * 0.7); bg.addColorStop(0, "#fbf7fb"); bg.addColorStop(1, "#f3eef6");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, hc + 6);
      /* forme de la cellule */
      var rx = R, ry = R, pinch = 0;
      if (p === 5){ rx = R * (1 + 0.36 * ease(f)); ry = R * (1 - 0.1 * ease(f)); }
      if (p === 6){ rx = R * 1.36; ry = R * 0.9; pinch = ease(f * 1.15); }
      if (p === 4){ rx = R * 1; }
      ctx.save();
      ctx.beginPath();
      for (var q = 0; q <= 140; q++){
        var th = q / 140 * 6.2832, xx = Math.cos(th) * rx, yy = Math.sin(th) * ry * (1 - pinch * 0.93 * Math.exp(-Math.pow(xx / (rx * 0.3), 2)));
        q ? ctx.lineTo(cx + xx, cy + yy) : ctx.moveTo(cx + xx, cy + yy);
      }
      ctx.closePath(); var cg = ctx.createRadialGradient(cx - R * .3, cy - R * .3, R * .1, cx, cy, R * 1.5); cg.addColorStop(0, "#fff4f4"); cg.addColorStop(1, "#f9d9dc");
      ctx.fillStyle = cg; ctx.shadowColor = "rgba(15,27,45,.16)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4; ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 3; ctx.strokeStyle = "#9f1239"; ctx.stroke(); ctx.restore();
      /* noyau */
      var nuA = p <= 2 ? 1 : p === 3 ? 1 - ease(f * 1.4) : 0;
      if (nuA > 0.02){ ctx.save(); ctx.globalAlpha = nuA; var ng = ctx.createRadialGradient(cx, cy, 2, cx, cy, R * 0.62); ng.addColorStop(0, "#e9f0ff"); ng.addColorStop(1, "#c9d9f7"); ctx.beginPath(); ctx.arc(cx, cy, R * 0.6, 0, 6.2832); ctx.fillStyle = ng; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = P.acc; ctx.stroke(); ctx.restore(); }
      if (p === 6){ [-1, 1].forEach(function(sg){ var nx = cx + sg * rx * 0.5; ctx.save(); ctx.globalAlpha = ease(f * 1.4); ctx.beginPath(); ctx.arc(nx, cy, R * 0.4, 0, 6.2832); ctx.fillStyle = "#dbe6fb"; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = P.acc; ctx.stroke(); ctx.restore(); }); }
      /* pôles / centrosomes */
      var polX = p <= 2 ? 0.22 : p === 3 ? lerp(0.22, 0.88, ease(f)) : 0.88, spA = p <= 2 ? (p === 2 ? f * 0.5 : 0) : 1;
      var pole = (p === 5 ? rx * 0.86 : p === 6 ? 0 : R * polX), showSp = p >= 3 && p <= 5;
      if (p <= 3 || showSp){
        [-1, 1].forEach(function(sg){ if (p === 6) return; var px = cx + sg * pole; ctx.save(); ctx.globalAlpha = p === 3 ? 0.4 + 0.6 * ease(f) : 1; S.draw.glow(c, px, cy, 14, P.amber, 0.45); S.draw.dot(c, px, cy, 4.8, P.amber); ctx.restore(); });
      }
      /* chromosomes */
      var plateSp = R * 0.31;
      for (var i = 0; i < 6; i++){
        var col = i % 2 ? PAT : MAT, L1 = LF[i] * R * 0.36, bx = cx + BASE[i][0] * R * 0.95, by = cy + BASE[i][1] * R * 0.95, py = cy + (i - 2.5) * plateSp;
        if (p <= 2){
          var dup = p === 0 ? 0 : p === 1 ? f : 1;
          chromo(bx, by, ANG[i], L1, col, 0, dup, i * 1.7);
        } else if (p === 3){
          var m = ease(f), x = lerp(bx, cx + BASE[i][0] * R * 0.7, m * 0.6), y = lerp(by, lerp(by, py, 0.5), m * 0.6);
          chromo(x, y, lerp(ANG[i], Math.PI / 2, m * 0.5), L1 * lerp(1, 0.82, m), col, m, 1, i * 1.7);
          if (f > 0.35){ S.draw.line(c, cx - pole, cy, x, y, "rgba(95,107,122," + (0.35 * ease((f - 0.35) * 1.5)) + ")", 1); S.draw.line(c, cx + pole, cy, x, y, "rgba(95,107,122," + (0.35 * ease((f - 0.35) * 1.5)) + ")", 1); }
        } else if (p === 4){
          var m2 = ease(f * 1.3), jit = Math.sin(i * 2.3 + u * 6) * (1 - m2) * 4;
          var x4 = lerp(cx + BASE[i][0] * R * 0.7, cx + jit + (i % 2 ? 1 : -1) * R * 0.05, m2), y4 = lerp(lerp(by, py, 0.5), py, m2);
          S.draw.line(c, cx - pole, cy, x4, y4, "rgba(95,107,122,.38)", 1); S.draw.line(c, cx + pole, cy, x4, y4, "rgba(95,107,122,.38)", 1);
          chromo(x4, y4, lerp(lerp(ANG[i], Math.PI / 2, 0.5), Math.PI / 2, m2), L1 * 0.82, col, 1, 1, i * 1.7);
        } else if (p === 5){
          var e5 = ease(f); [-1, 1].forEach(function(sg){
            var xc = cx + sg * lerp(2, rx * 0.66, e5), yy5 = py * 1 + (cy - py) * (e5 * 0.45) * 0 + (py - cy) * (1 - e5 * 0.3) - (py - cy);
            var ypos = cy + (py - cy) * lerp(1, 0.86, e5);
            S.draw.line(c, cx + sg * pole, cy, xc, ypos, "rgba(95,107,122,.4)", 1);
            if (f < 0.04) chromo(xc, ypos, Math.PI / 2, L1 * 0.82, col, 1, 1, i * 1.7); else vchrom(xc, ypos, sg, L1 * 0.82 * lerp(1, 0.9, e5), col, 1, i);
          });
        } else {
          var e6 = ease(f * 1.2); [-1, 1].forEach(function(sg){
            var xn = cx + sg * rx * 0.5, xp = cx + sg * rx * 0.66, ypos2 = cy + (py - cy) * lerp(0.86, 0.5, e6);
            chromo(lerp(xp, xn + BASE[i][0] * R * 0.55, e6), lerp(ypos2, cy + BASE[i][1] * R * 0.6, e6), lerp(Math.PI / 2, ANG[i], e6), L1 * lerp(0.82, 1.2, e6), col, 1 - e6, 0, i * 1.7);
          });
        }
      }
      /* plan équatorial */
      if (p === 4 && f > 0.4){ ctx.save(); ctx.globalAlpha = Math.min(0.7, (f - 0.4)); S.draw.line(c, cx, cy - R * 0.95, cx, cy + R * 0.95, P.amber, 1.5, [4, 4]); ctx.restore(); S.draw.label(c, "plan équatorial", cx, cy - R - 8, {color:P.amber, size:11}); }
      if (p === 1) S.draw.label(c, "réplication de l'ADN", cx, hc - 28, {color:P.red});
      if (p === 5 && f > 0.15) S.draw.label(c, "6 chromosomes vers chaque pôle", cx, hc - 28, {color:P.acc});
      if (p === 6 && f > 0.5) S.draw.label(c, "2 cellules filles : 6 chromosomes, 2C", cx, hc - 28, {color:P.green});
      S.draw.label(c, NAMES[p], 10, 16, {color:P.mat, align:"left", size:13});
      /* légende */
      S.draw.line(c, 12, hc - 10, 28, hc - 10, MAT, 3.5); S.draw.text(c, "maternel", 33, hc - 10, {size:11, color:"#5f6b7a", align:"left"}); S.draw.line(c, W - 78, hc - 10, W - 62, hc - 10, PAT, 3.5); S.draw.text(c, "paternel", W - 57, hc - 10, {size:11, color:"#5f6b7a", align:"left"});
      /* frise du cycle + courbe d'ADN */
      var fx0 = 34, fx1 = W - 14, fy0 = hc + 22, fy1 = H - 26, bw = (fx1 - fx0) / 7;
      tl = {x0:fx0, x1:fx1, y0:fy0 - 14, y1:H};
      var bands = ["#dbe7fb", "#fde9c4", "#cfe9de", "#e6dcfa", "#e6dcfa", "#e6dcfa", "#e6dcfa"];
      for (i = 0; i < 7; i++){
        ctx.fillStyle = bands[i]; ctx.globalAlpha = i === p ? 1 : 0.75; ctx.fillRect(fx0 + i * bw, fy0, bw - 1, fy1 - fy0); ctx.globalAlpha = 1;
        S.draw.text(c, SHORT[i], fx0 + (i + 0.5) * bw, fy1 + 11, {size:11, color:i === p ? P.ink : "#5f6b7a", weight:i === p ? 800 : 700});
      }
      S.draw.text(c, "interphase", fx0 + 1.5 * bw, fy0 - 7, {size:10, color:"#5f6b7a"}); S.draw.text(c, "mitose", fx0 + 5 * bw, fy0 - 7, {size:10, color:"#5f6b7a"});
      function Y(v){ return fy1 - (v / 5.4) * (fy1 - fy0); }
      S.draw.text(c, "4C", fx0 - 9, Y(4), {size:10, color:"#5f6b7a"}); S.draw.text(c, "2C", fx0 - 9, Y(2), {size:10, color:"#5f6b7a"});
      ctx.save(); ctx.strokeStyle = P.green; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.beginPath();
      var pts = [[0, 2], [1, 2], [2, 4], [6, 4], [6.55, 4], [6.99, 2]];
      pts.forEach(function(q, j){ var xq = fx0 + q[0] * bw, yq = Y(q[1]); j ? ctx.lineTo(xq, yq) : ctx.moveTo(xq, yq); }); ctx.stroke(); ctx.restore();
      S.draw.text(c, "ADN par noyau", fx1 - 2, fy1 - 8, {size:10, color:P.green, align:"right"});
      var ux = fx0 + u * bw; S.draw.line(c, ux, fy0 - 3, ux, fy1 + 2, P.red, 2); S.draw.dot(c, ux, fy0 - 3, 5.5, P.red);
      /* compteurs */
      var chr = p < 5 ? 6 : 12, chm = p === 0 ? 6 : p === 1 ? 6 + Math.round(6 * f) : 12, dna = p === 0 ? "2C" : p === 1 ? S.fmt(2 + 2 * f, 1) + "C" : p < 6 ? "4C" : (f < 0.55 ? "4C" : "2C par cellule fille");
      if (p === 6 && f >= 0.55) chr = "6 + 6";
      ro.set(0, NAMES[p]); ro.set(1, chr); ro.set(2, chm === 12 && p >= 5 ? "12 (1 par chromosome)" : chm); ro.set(3, dna);
      var ok = GOALS[gi][1](u);
      ntD.set("<b>Défi " + (gi + 1) + "/" + GOALS.length + ".</b> " + GOALS[gi][0] + (ok ? " <b>Réussi !</b>" : ""), ok ? "ok" : "warn");
      nt.set("<b>" + NAMES[p] + ".</b> " + TXT[p], p === 5 ? "warn" : "");
    });
    c.pointer(function(type, e){
      if (!tl.x0 || e.y < tl.y0 || type === "move") return;
      if (type === "down" || type === "drag"){ lp.pause(); ph.set(Math.max(0, Math.min(6.99, (e.x - tl.x0) / (tl.x1 - tl.x0) * 7))); k.redraw(); }
    });
    c.cv.style.touchAction = "pan-y";
  }
});

SFA.sim({
  id:"b4-c10-adn", ch:"c10", tag:"Graphes · comptage",
  titre:"Le cycle et la quantité d'ADN : courbe, histogramme, comptage",
  resume:"Règle la durée de chaque phase : la courbe d'ADN, la répartition d'une population et l'indice mitotique s'ajustent.",
  but:"Choisis la durée de G1, S, G2 et M. Observe la quantité d'ADN au cours du temps, puis compte 200 cellules sur une « lame » pour retrouver les durées.",
  aRetenir:"La quantité d'ADN par noyau passe de 2C à 4C pendant la phase S (réplication), reste à 4C en G2 et en mitose, puis retombe à 2C après la division. Dans une population de cellules non synchronisées, la proportion de cellules dans une phase est proportionnelle à la durée de cette phase : indice mitotique = durée de M ÷ durée du cycle.",
  piege:"Ce n'est pas la mitose qui double l'ADN : c'est la phase S. La mitose est la phase la plus courte (≈ 1 h sur un cycle de 24 h), d'où peu de cellules en mitose sur une lame. Un comptage de 200 cellules donne une estimation avec une marge d'erreur.",
  build:function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), c3 = k.canvas(120);
    var g1 = k.slider("Durée de G1", 4, 16, 1, 10, "h");
    var s = k.slider("Durée de S", 4, 12, 1, 8, "h");
    var g2 = k.slider("Durée de G2", 2, 8, 1, 4, "h");
    var m = k.slider("Durée de M (mitose)", 0.5, 2, 0.5, 1, "h");
    var ro = k.readouts(["Durée du cycle", "Cellules en G1", "Cellules en mitose (indice mitotique)", "Estimation de M par comptage"]);
    var nt = k.note("", "");
    var st = {cnt:null};
    k.button("Compter 200 cellules sur la lame", function(){ var T = g1.value + s.value + g2.value + m.value, d = [g1.value, s.value, g2.value, m.value], cnt = [0, 0, 0, 0]; for (var i = 0; i < 200; i++){ var u = Math.random() * T, q = 0; while (q < 3 && u >= d[q]){ u -= d[q]; q++; } cnt[q]++; } st.cnt = cnt; }, true);
    k.button("Effacer le comptage", function(){ st.cnt = null; });
    k.draw(function(){
      var d = [g1.value, s.value, g2.value, m.value], T = d[0] + d[1] + d[2] + d[3], fr = d.map(function(x){ return x / T; });
      c1.clear(); var ax = S.draw.axes(c1, {x0:0, x1:T, y0:0, y1:5, xl:"temps (h)", stepX:T > 30 ? 10 : 5, stepY:1, l:50});
      function dna(t){ if (t < d[0]) return 2; if (t < d[0] + d[1]) return 2 + 2 * (t - d[0]) / d[1]; if (t < d[0] + d[1] + d[2] + d[3] - 1e-9) return 4; return 2; }
      S.draw.fn(c1, ax, function(t){ return dna(t); }, B4.pal.acc, 3);
      var cum = 0, nm = ["G1", "S", "G2", "M"], cols = ["#cbd5e1", "#fde68a", "#bbf7d0", "#fecaca"];
      for (var i = 0; i < 4; i++){ var xa = ax.X(cum), xb = ax.X(cum + d[i]); c1.ctx.fillStyle = cols[i]; c1.ctx.globalAlpha = 0.5; c1.ctx.fillRect(xa, ax.T, xb - xa, ax.B - ax.T); c1.ctx.globalAlpha = 1; B4.txt(c1, nm[i], (xa + xb) / 2, ax.T + 10 + (i === 3 ? 14 : 0), B4.pal.ink, 12); cum += d[i]; }
      B4.txt(c1, "ADN par noyau (en C)", ax.L + 6, ax.Y(0.6), "#5f6b7a", 12, "left");
      S.draw.fn(c1, ax, function(t){ return dna(t); }, B4.pal.acc, 3);
      /* histogramme d'ADN d'une population */
      c2.clear(); var bx = S.draw.axes(c2, {x0:1.5, x1:4.5, y0:0, y1:1, xl:"ADN par cellule (C)", stepX:0.5, stepY:0.25, l:50});
      function dens(x){ var gs = function(mu){ return Math.exp(-Math.pow((x - mu) / 0.09, 2) / 2) / (0.09 * 2.5066); }; return fr[0] * gs(2) + (fr[2] + fr[3]) * gs(4) + fr[1] * (x > 2 && x < 4 ? 0.5 : 0); }
      var ctx2 = c2.ctx; ctx2.save(); ctx2.beginPath(); ctx2.moveTo(bx.X(1.5), bx.B);
      var maxd = 0; for (x = 1.5; x <= 4.5; x += 0.01) maxd = Math.max(maxd, dens(x));
      for (var x = 1.5; x <= 4.5; x += 0.01) ctx2.lineTo(bx.X(x), bx.Y(dens(x) / Math.max(1.2, maxd) * 0.95)); ctx2.lineTo(bx.X(4.5), bx.B); ctx2.closePath(); ctx2.fillStyle = "rgba(30,63,143,.25)"; ctx2.fill(); ctx2.strokeStyle = B4.pal.acc; ctx2.lineWidth = 2.4; ctx2.stroke(); ctx2.restore();
      B4.txt(c2, "G1 : " + S.fmt(fr[0] * 100, 0) + " %", bx.X(2), bx.Y(0.95) - 8, B4.pal.ink, 12); B4.txt(c2, "S : " + S.fmt(fr[1] * 100, 0) + " %", bx.X(3), bx.Y(0.3), B4.pal.ink, 12);  B4.txt(c2, "G2 + M : " + S.fmt((fr[2] + fr[3]) * 100, 0) + " %", bx.X(4), bx.Y(0.95) - 8, B4.pal.ink, 12);
      /* comptage */
      c3.clear(); var cnt = st.cnt, estM = null;
      B4.txt(c3, cnt ? "Comptage de 200 cellules (trait noir : proportion réelle)" : "Clique sur « Compter 200 cellules sur la lame »", 10, 12, "#5f6b7a", 12, "left");
      if (cnt){
        var w = (c3.W - 40) / 4;
        for (i = 0; i < 4; i++){ var h = cnt[i] / 200 * 80; c3.ctx.fillStyle = ["#94a3b8", "#f59e0b", "#22c55e", "#ef4444"][i]; c3.ctx.fillRect(20 + i * w + 10, 105 - h, w - 20, h); S.draw.line(c3, 20 + i * w + 6, 105 - fr[i] * 80, 20 + i * w + w - 6, 105 - fr[i] * 80, "#13233a", 2); B4.txt(c3, nm[i] + " : " + cnt[i], 20 + i * w + w / 2, 115, B4.pal.ink, 12); }
        estM = cnt[3] / 200 * T;
      }
      ro.set(0, S.fmt(T, 1) + " h"); ro.set(1, S.fmt(fr[0] * 100, 0) + " %"); ro.set(2, S.fmt(fr[3] * 100, 1) + " %"); ro.set(3, cnt ? S.fmt(estM, 1) + " h (réel : " + S.fmt(d[3], 1) + " h)" : "—");
      nt.set(cnt ? "Sur 200 cellules, " + cnt[3] + " en mitose : durée de M ≈ " + cnt[3] + " ÷ 200 × " + S.fmt(T, 1) + " h = " + S.fmt(estM, 1) + " h. L'estimation varie d'un comptage à l'autre : plus on compte de cellules, plus elle est précise." : "Plus une phase dure longtemps, plus on y trouve de cellules. À T = " + S.fmt(T, 1) + " h, la mitose (" + S.fmt(d[3], 1) + " h) ne représente que " + S.fmt(fr[3] * 100, 1) + " % des cellules.", "");
    });
  }
});

SFA.sim({
  id:"b4-c10-cancer", ch:"c10", tag:"Tissu vivant · modèle",
  titre:"Perdre le contrôle du cycle : naissance d'une tumeur",
  resume:"Un tissu en équilibre accueille quelques cellules altérées : regarde-les se multiplier (ou disparaître) selon les divisions et la mort cellulaire.",
  but:"Règle la durée du cycle, la part de cellules qui se divisent et l'apoptose, ou choisis un scénario. Le tissu vit en direct (le hasard joue) ; clique sur une cellule saine pour la remplacer par une cellule altérée.",
  aRetenir:"Dans un tissu normal, divisions et mort cellulaire (apoptose) s'équilibrent. Un oncogène activé pousse davantage de cellules à se diviser ; un gène suppresseur de tumeur muté (comme p53) supprime les freins : les cellules anormales ne s'arrêtent plus ni ne meurent. Quand les divisions dépassent la mort, la population croît exponentiellement, d'abord sans symptôme.",
  piege:"Une cellule cancéreuse ne se divise pas forcément plus vite : souvent c'est la proportion de cellules qui continuent à se diviser, ou qui échappent à la mort, qui change. Modèle simplifié : croissance exponentielle sans limite ni évolution. Une tumeur demande des années pour devenir détectable.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.12});
    var T = k.slider("Durée du cycle", 12, 96, 6, 48, "h");
    var g = k.slider("Cellules qui se divisent", 0, 100, 1, 10, "%");
    var d = k.slider("Mort cellulaire (apoptose)", 0, 30, 0.5, 3.5, "% par jour");
    var ro = k.readouts(["Croissance nette des cellules altérées", "Doublement tous les", "Temps pour 10⁹ cellules", "Cellules altérées dans le tissu"]);
    var nt = k.note("", "");
    var COLS = 18, ROWS = 10, slots = [], nb = [], ghosts = [], hist = [], tm = 0, rnd = B4.rng(7), sd = 7, running = true, geo = {};
    function reset(){
      sd += 11; rnd = B4.rng(sd); slots = []; ghosts = []; hist = []; tm = 0;
      for (var i = 0; i < COLS * ROWS; i++) slots.push(rnd() < 0.72 ? {t:0, b:-9} : null);
      for (var q = 0; q < COLS * ROWS; q++){ var r = Math.floor(q / COLS), cc = q % COLS, a = [];
        [[-1, 0], [1, 0], [r % 2 ? 0 : -1, -1], [r % 2 ? 1 : 0, -1], [r % 2 ? 0 : -1, 1], [r % 2 ? 1 : 0, 1]].forEach(function(o){ var x = cc + o[0], y = r + o[1]; if (x >= 0 && x < COLS && y >= 0 && y < ROWS) a.push(y * COLS + x); }); nb[q] = a; }
      var mid = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2);
      [mid, mid + 1, mid - 1].forEach(function(s){ slots[s] = {t:1, b:0}; });
    }
    reset();
    function rates(){ return {b:g.value / 100 * Math.LN2 * 24 / T.value, dd:d.value / 100}; }
    function step(dt){
      var R = rates(), bn = 0.1 * Math.LN2 * 24 / 48, dn = 0.0347, order = [], i;
      for (i = 0; i < slots.length; i++) if (slots[i]) order.push(i);
      order.forEach(function(i){
        var s = slots[i]; if (!s) return; var pb = (s.t ? R.b : bn) * dt, pd = (s.t ? R.dd : dn) * dt;
        if (rnd() < pd){ ghosts.push({i:i, t:s.t, a:1}); slots[i] = null; return; }
        if (rnd() < pb){
          var free = nb[i].filter(function(j){ return !slots[j]; }), tgt = -1;
          if (free.length) tgt = free[Math.floor(rnd() * free.length)];
          else if (s.t){ var nn = nb[i].filter(function(j){ return slots[j] && !slots[j].t; }); if (nn.length){ tgt = nn[Math.floor(rnd() * nn.length)]; ghosts.push({i:tgt, t:0, a:1}); } }
          if (tgt >= 0) slots[tgt] = {t:s.t, b:tm};
        }
      });
      tm += dt;
    }
    function counts(){ var a = 0, n = 0; slots.forEach(function(s){ if (s){ if (s.t) a++; else n++; } }); return [a, n]; }
    var lp = k.loop(function(dt){
      var days = dt * 9, n = Math.ceil(days / 0.25); for (var q = 0; q < n; q++) step(days / n);
      ghosts.forEach(function(gh){ gh.a -= dt * 2.2; }); ghosts = ghosts.filter(function(gh){ return gh.a > 0; });
      var ct = counts(); if (!hist.length || tm - hist[hist.length - 1][0] >= 2) hist.push([tm, ct[0], ct[1]]);
      if (tm > 700 || ct[0] === 0 || ct[1] === 0) lp.pause();
      k.redraw();
    });
    lp.play();
    function sc(a, b, c2){ T.set(a); g.set(b); d.set(c2); reset(); lp.play(); }
    k.button("Tissu normal", function(){ sc(48, 10, 3.5); }, true);
    k.button("Oncogène activé", function(){ sc(48, 30, 3.5); });
    k.button("Suppresseur de tumeur muté", function(){ sc(48, 10, 1); });
    k.button("Les deux altérations", function(){ sc(48, 30, 1); });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); });
    k.button("↺ Nouveau tissu", function(){ reset(); lp.play(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, th = H * 0.60, sp = Math.min((W - 16) / (COLS + 0.5), (th - 20) / (ROWS * 0.87 + 0.4)), r0 = sp * 0.43;
      var ox = (W - (COLS + 0.5) * sp) / 2 + sp * 0.5, oy = 12 + sp * 0.5;
      geo = {sp:sp, ox:ox, oy:oy};
      ctx.save(); S.draw.rrect(c, 4, 4, W - 8, th, 14); ctx.fillStyle = "#fbf3f1"; ctx.fill(); ctx.strokeStyle = "#e8d3cf"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      function pos(i){ var r = Math.floor(i / COLS), cc = i % COLS; return [ox + cc * sp + (r % 2 ? sp / 2 : 0), oy + r * sp * 0.87]; }
      slots.forEach(function(s, i){
        if (!s) return; var q = pos(i), young = Math.max(0, 1 - (tm - s.b) / 3);
        if (s.t){ S.draw.glow(c, q[0], q[1], r0 * 2.1, P.red, 0.25 + 0.25 * young); }
        ctx.beginPath(); ctx.arc(q[0], q[1], r0 * (1 + 0.25 * young), 0, 6.2832); ctx.fillStyle = s.t ? "#f4a79d" : "#c7d8f4"; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = s.t ? P.red : P.acc; ctx.stroke();
        ctx.beginPath(); ctx.arc(q[0] + (s.t ? 1 : 0), q[1], r0 * (s.t ? 0.5 : 0.36), 0, 6.2832); ctx.fillStyle = s.t ? "#7f1d12" : "#1f4b9e"; ctx.fill();
      });
      ghosts.forEach(function(gh){ var q = pos(gh.i); ctx.save(); ctx.globalAlpha = gh.a * 0.6; ctx.beginPath(); ctx.arc(q[0], q[1], r0 * (1.4 - 0.4 * gh.a), 0, 6.2832); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.restore(); });
      var ct = counts(), tot = COLS * ROWS;
      S.draw.label(c, "● saine", 12, th + 4 - 14, {color:P.acc, align:"left", size:11}); S.draw.label(c, "● altérée", 66, th + 4 - 14, {color:P.red, align:"left", size:11});
      S.draw.label(c, "jour " + S.fmt(tm, 0), W - 12, th + 4 - 14, {color:P.ink, align:"right", size:11});
      /* graphe */
      var gy0 = th + 20, gh = H - gy0 - 22, gx0 = 38, gx1 = W - 12, tmax = Math.max(120, Math.ceil(tm / 60) * 60 + 60);
      function X(t){ return gx0 + t / tmax * (gx1 - gx0); } function Y(v){ return gy0 + gh - v / tot * gh; }
      ctx.strokeStyle = "#e3e7ed"; ctx.lineWidth = 1; [0, 0.5, 1].forEach(function(f){ ctx.beginPath(); ctx.moveTo(gx0, Y(f * tot)); ctx.lineTo(gx1, Y(f * tot)); ctx.stroke(); S.draw.text(c, Math.round(f * 100) + " %", gx0 - 5, Y(f * tot), {size:10, color:"#5f6b7a", align:"right"}); });
      S.draw.text(c, "jours", gx1, gy0 + gh + 12, {size:10, color:"#5f6b7a", align:"right"}); S.draw.text(c, "part du tissu", gx0 + 2, gy0 - 8, {size:10, color:"#5f6b7a", align:"left"});
      [[1, P.red], [2, P.acc]].forEach(function(sr){ ctx.beginPath(); hist.forEach(function(h, j){ var x = X(h[0]), y = Y(h[sr[0]]); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.strokeStyle = sr[1]; ctx.lineWidth = 2.4; ctx.stroke(); });
      var Rr = rates(), rn = Rr.b - Rr.dd, tt = rn > 0.0005 ? 9 * Math.LN10 / rn : Infinity;
      ro.set(0, (rn >= 0 ? "+" : "") + S.fmt(rn * 100, 1) + " % / jour"); ro.set(1, rn > 0.0005 ? S.fmt(Math.LN2 / rn, 0) + " jours" : "jamais");
      ro.set(2, isFinite(tt) ? S.fmt(tt / 365, 1) + " an (" + S.fmt(tt, 0) + " j)" : "jamais"); ro.set(3, ct[0] + " / " + tot);
      nt.set(rn > 0.0005 ? "Naissances (" + S.fmt(Rr.b * 100, 1) + " %/jour) > morts (" + S.fmt(Rr.dd * 100, 1) + " %/jour) : la population altérée double tous les " + S.fmt(Math.LN2 / rn, 0) + " jours et chasse peu à peu les cellules saines. Sans freins, une seule cellule atteindrait 10⁹ cellules en ≈ " + S.fmt(tt / 365, 1) + " an, sans symptôme." : rn >= -0.0005 ? "Naissances ≈ morts : le tissu reste en équilibre ; les cellules altérées ne gagnent pas du terrain (le hasard les fait pourtant parfois disparaître ou dériver)." : "Les morts dépassent les naissances : les cellules altérées s'éteignent.", rn > 0.0005 ? "warn" : "ok");
    });
    c.pointer(function(type, e){
      if (type !== "down" || !geo.sp) return; var best = -1, bd = 1e9;
      slots.forEach(function(s, i){ var r = Math.floor(i / COLS), cc = i % COLS, x = geo.ox + cc * geo.sp + (r % 2 ? geo.sp / 2 : 0), y = geo.oy + r * geo.sp * 0.87, dd2 = Math.pow(x - e.x, 2) + Math.pow(y - e.y, 2); if (dd2 < bd){ bd = dd2; best = i; } });
      if (best >= 0 && bd < Math.pow(geo.sp * 0.6, 2)){ slots[best] = {t:1, b:tm}; k.redraw(); if (!lp.running) lp.play(); }
    });
  }
});

SFA.sim({
  id:"b4-c10-chimio", ch:"c10", tag:"Médecine · défi",
  titre:"Chimiothérapie : cibler les cellules qui se divisent",
  resume:"Un médicament antimitotique frappe les cellules en division : tumeur, mais aussi moelle, intestin, poils. Trouve le bon réglage.",
  but:"Règle la dose, l'intervalle et le nombre de cures, puis glisse le curseur rouge sur le graphique pour lire l'état de chaque tissu à un jour donné. Défi : tumeur sous 5 % sans que la moelle descende sous 40 %.",
  aRetenir:"Un médicament antimitotique atteint surtout les cellules qui se divisent : cellules cancéreuses, mais aussi cellules saines à renouvellement rapide (moelle osseuse, muqueuse intestinale, follicules pileux), d'où fatigue, nausées, perte de cheveux. Les cellules qui ne se divisent pas (neurones) sont peu touchées. On espace les cures pour laisser les tissus sains se régénérer.",
  piege:"Modèle illustratif en échelles relatives : les valeurs numériques ne sont pas celles d'un traitement réel. Aucune conclusion médicale à en tirer.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.1});
    var dose = k.slider("Dose du médicament", 10, 100, 5, 70, "%");
    var dt = k.slider("Intervalle entre deux cures", 7, 28, 7, 21, "jours");
    var n = k.slider("Nombre de cures", 1, 8, 1, 4, "");
    var ro = k.readouts(["Tumeur à la fin", "Moelle osseuse (minimum)", "Intestin (minimum)", "Follicules pileux (minimum)"]);
    var ntD = k.note("", ""); var nt = k.note("", "");
    var TIS = [
      {n:"Tumeur", g:0.8, col:P.red, tumor:true, ic:"●"},
      {n:"Moelle osseuse", g:0.5, h:0.15, col:P.violet},
      {n:"Intestin", g:0.4, h:0.12, col:P.amber},
      {n:"Follicules pileux", g:0.5, h:0.06, col:P.teal},
      {n:"Neurones", g:0, h:0.1, col:P.grey}
    ];
    var cur = 60;
    function sim(ti, TM){
      var E = dose.value / (dose.value + 10), a = 1, out = [[0, 1]], tm = 1, next = 0, cnt = 0, h = 0.25;
      for (var t = 0; t <= TM + 1e-9; t += h){
        if (cnt < n.value && t >= next - 1e-9){ a *= 1 - ti.g * E; cnt++; next += dt.value; }
        if (ti.tumor) a *= Math.exp(0.03 * h); else a += ti.h * (1 - a) * h;
        if (Math.abs(t / 2 - Math.round(t / 2)) < 1e-9) out.push([t, a]); tm = Math.min(tm, a);
      }
      return {pts:out, min:tm, end:a};
    }
    function at(r, t){ var i = Math.min(r.pts.length - 1, Math.max(0, Math.round(t / 2))); return r.pts[i][1]; }
    var gx = {};
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, TM = Math.max(140, Math.ceil(((n.value - 1) * dt.value + 70) / 10) * 10), gh = H * 0.56;
      cur = Math.min(cur, TM);
      var L = 46, Rr = W - 12, T0 = 24, B0 = gh;
      function X(t){ return L + t / TM * (Rr - L); } function Y(v){ return B0 - (Math.log10(Math.max(1e-3, v)) + 2.2) / 2.8 * (B0 - T0); }
      gx = {X:X, L:L, R:Rr, TM:TM, top:T0, bot:B0};
      ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, gh + 22);
      /* zone de danger moelle (< 40 %) */
      ctx.fillStyle = "rgba(192,50,29,.07)"; ctx.fillRect(L, Y(0.4), Rr - L, B0 - Y(0.4)); S.draw.line(c, L, Y(0.4), Rr, Y(0.4), "rgba(192,50,29,.55)", 1.2, [5, 4]); S.draw.text(c, "seuil moelle 40 %", Rr - 4, Y(0.4) - 8, {size:10, color:P.red, align:"right"});
      [1, 0.1, 0.01].forEach(function(v){ S.draw.line(c, L, Y(v), Rr, Y(v), "#e3e7ed", 1); S.draw.text(c, v >= 1 ? "100 %" : (v * 100) + " %", L - 5, Y(v), {size:10, color:"#5f6b7a", align:"right"}); });
      for (var q = 0; q * 20 <= TM; q++){ var xx = X(q * 20); S.draw.text(c, q * 20, xx, B0 + 11, {size:10, color:"#5f6b7a"}); }
      S.draw.text(c, "taille relative (échelle logarithmique) · temps en jours", L + 2, 11, {size:10, color:"#5f6b7a", align:"left"});
      for (q = 0; q < n.value; q++){ var xt = X(q * dt.value); if (q * dt.value <= TM){ ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(xt, B0 - 12); ctx.lineTo(xt - 4, B0); ctx.lineTo(xt + 4, B0); ctx.fill(); } }
      var res = TIS.map(function(ti){ var r = sim(ti, TM); ctx.save(); ctx.beginPath(); ctx.rect(L, T0 - 4, Rr - L, B0 - T0 + 8); ctx.clip(); ctx.strokeStyle = ti.col; ctx.lineWidth = ti.tumor ? 3.2 : 2.2; ctx.lineJoin = "round"; ctx.beginPath(); r.pts.forEach(function(p, i){ var x = X(p[0]), y = Y(p[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore(); return r; });
      /* curseur */
      var cx = X(cur); S.draw.line(c, cx, T0, cx, B0, P.ink, 1.4, [3, 3]); S.draw.dot(c, cx, T0, 6, P.ink);
      TIS.forEach(function(ti, i){ S.draw.dot(c, cx, Y(at(res[i], cur)), 4, ti.col); });
      /* barres des tissus au jour du curseur */
      var by0 = gh + 36, bh = (H - by0 - 8) / TIS.length, bl = 118, bw = W - bl - 56;
      S.draw.text(c, "État des tissus au jour " + S.fmt(cur, 0), 8, gh + 24, {size:11, color:P.ink, align:"left"});
      TIS.forEach(function(ti, i){
        var y = by0 + i * bh + bh / 2, v = at(res[i], cur), w = Math.min(1.15, v) / 1.15 * bw;
        S.draw.text(c, ti.n, 8, y, {size:11, color:"#2c3a4e", align:"left"});
        S.draw.rrect(c, bl, y - 5.5, bw, 11, 5.5); ctx.fillStyle = "#eef1f5"; ctx.fill();
        S.draw.rrect(c, bl, y - 5.5, Math.max(6, w), 11, 5.5); ctx.fillStyle = ti.col; ctx.fill();
        if (i === 1){ var tx = bl + 0.4 / 1.15 * bw; S.draw.line(c, tx, y - 8, tx, y + 8, P.red, 1.6); }
        S.draw.text(c, S.fmt(v * 100, 0) + " %", bl + bw + 6, y, {size:11, color:ti.col, align:"left"});
      });
      ro.set(0, S.fmt(res[0].end * 100, 0) + " % du départ"); ro.set(1, S.fmt(res[1].min * 100, 0) + " %"); ro.set(2, S.fmt(res[2].min * 100, 0) + " %"); ro.set(3, S.fmt(res[3].min * 100, 0) + " %");
      var win = res[0].end < 0.05 && res[1].min >= 0.4;
      ntD.set("<b>Défi.</b> Tumeur à moins de 5 % de sa taille de départ, moelle jamais sous 40 %. " + (win ? "<b>Réussi !</b>" : res[0].end < 0.05 ? "Tumeur vaincue, mais la moelle est trop atteinte : espace les cures ou baisse la dose." : "Tumeur encore à " + S.fmt(res[0].end * 100, 0) + " %."), win ? "ok" : "warn");
      var msg = "La tumeur (80 % de cellules en cycle) subit l'effet le plus fort ; les neurones, qui ne se divisent pas, ne sont pas touchés. ";
      if (res[1].min < 0.45) msg += "Moelle osseuse très atteinte (" + S.fmt(res[1].min * 100, 0) + " %) : moins de globules blancs, risque d'infection. ";
      if (res[0].end < 0.05) msg += "La tumeur est fortement réduite."; else if (res[0].end > 1) msg += "La tumeur est repartie au-delà de sa taille de départ : traitement insuffisant."; else msg += "La tumeur régresse mais subsiste.";
      nt.set(msg, res[1].min < 0.45 ? "warn" : "");
    });
    c.pointer(function(type, e){ if (type === "down" || type === "drag"){ if (type === "down" && e.y > c.H * 0.62) return; cur = Math.max(0, Math.min(gx.TM, (e.x - gx.L) / (gx.R - gx.L) * gx.TM)); k.redraw(); } });
    c.cv.style.touchAction = "pan-y";
  }
});
