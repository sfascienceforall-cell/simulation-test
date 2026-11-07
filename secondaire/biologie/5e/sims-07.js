/* Chapitre 7 · Reproduction asexuée, sexuée et méiose */
(function(){
var RED = "#b42318", BLU = "#1e3f8f", GRN = "#2e6b55";

/* dessine un chromosome vertical : n chromatides, deux segments de couleur (haut, bas) par chromatide */
function chrom(c, x, y, h, chr, sc){
  var ctx = c.ctx, w = 6 * sc, gap = 1.5 * sc, n = chr.length;
  chr.forEach(function(ch, i){
    var x0 = x - ((n * w + (n - 1) * gap) / 2) + i * (w + gap), cut = ch.cut === undefined ? 1 : ch.cut;
    ctx.fillStyle = ch.top; ctx.fillRect(x0, y - h / 2, w, h * cut);
    if (cut < 1){ ctx.fillStyle = ch.bot; ctx.fillRect(x0, y - h / 2 + h * cut, w, h * (1 - cut)); }
    ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.lineWidth = 1; ctx.strokeRect(x0, y - h / 2, w, h);
  });
  ctx.fillStyle = "#f4c542"; ctx.beginPath(); ctx.arc(x, y, 3.2 * sc, 0, 2 * Math.PI); ctx.fill();
}

var STAGES = [
  ["Cellule diploïde avant réplication", 1, 4, 1, 2, "2n = 4 chromosomes à 1 chromatide, 2C d'ADN."],
  ["Après réplication de l'ADN (phase S)", 1, 4, 2, 4, "Chaque chromosome a deux chromatides identiques : l'ADN double (4C), mais il y a toujours 4 chromosomes."],
  ["Prophase I : appariement des homologues", 1, 4, 2, 4, "Les homologues s'apparient (bivalents). Des échanges (crossing-over) ont lieu entre chromatides non sœurs."],
  ["Métaphase I", 1, 4, 2, 4, "Les bivalents s'alignent sur le plan équatorial. L'orientation de chaque paire est aléatoire (brassage interchromosomique)."],
  ["Anaphase I : séparation des homologues", 1, 4, 2, 4, "Ce sont les chromosomes homologues qui se séparent (pas les chromatides) : réduction du nombre de chromosomes."],
  ["Fin de la méiose I : 2 cellules haploïdes", 2, 2, 2, 2, "Chaque cellule a n = 2 chromosomes à 2 chromatides (2C) : la cellule est haploïde, mais l'ADN n'est pas encore à 1C."],
  ["Anaphase II : séparation des chromatides", 2, 4, 1, 2, "Les chromatides se séparent (comme dans une mitose) : 4 chromosomes à 1 chromatide dans chaque cellule, 2C."],
  ["Fin de la méiose II : 4 cellules haploïdes", 4, 2, 1, 1, "4 gamètes (ou cellules haploïdes) avec n = 2 chromosomes à 1 chromatide, 1C d'ADN chacun."]
];
SFA.sim({
  id: "b5-c07-meiose", ch: "c07", tag: "Classique",
  titre: "La méiose pas à pas avec compteur de chromosomes",
  resume: "Avance étape par étape : cellules, chromosomes, chromatides et quantité d'ADN.",
  but: "Fais défiler les 8 étapes de la méiose d'une cellule 2n = 4 (une longue paire et une courte, chromosomes maternels en rouge et paternels en bleu). Observe le compteur : que deviennent le nombre de chromosomes et la quantité d'ADN ? Change l'orientation des paires et le crossing-over.",
  aRetenir: "La méiose comprend une réplication et deux divisions. À la méiose I, les chromosomes homologues se séparent : on passe de 2n à n chromosomes. À la méiose II, les chromatides se séparent. Résultat : 4 cellules haploïdes génétiquement différentes. L'orientation aléatoire des paires et le crossing-over créent le brassage.",
  piege: "La méiose ne double pas les chromosomes : c'est la réplication qui double l'ADN, pas le nombre de chromosomes. Autre confusion : à la fin de la méiose I, il y a n chromosomes mais ils ont encore deux chromatides (2C). Mitose et méiose ne donnent pas le même résultat (2 cellules 2n identiques contre 4 cellules n différentes).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62}), pal = S.draw.palette;
    var st = k.slider("Étape", 0, 7, 1, 0, "");
    var ori = k.seg("Orientation de la courte paire à la métaphase I", [["a", "mêmes côtés"], ["b", "côtés opposés"]], "a");
    var cr = k.toggle("Crossing-over sur la longue paire", false);
    var ro = k.readouts(["Cellules", "Chromosomes par cellule", "Chromatides par chromosome", "ADN par cellule"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var s = st.value, W = c.W, H = c.H, ctx = c.ctx, R, cross = cr.value && s >= 2, o = ori.value === "b";
      function chr(orig, type, nch, side){            /* construit un chromosome (liste de chromatides) */
        var col = orig === "m" ? RED : BLU, oth = orig === "m" ? BLU : RED, arr = [], i;
        for (i = 0; i < nch; i++){
          var ch = {top: col, bot: col, cut: 1};
          if (cross && type === "L" && nch === 2 && i === 1){ ch.bot = oth; ch.cut = 0.55; }
          arr.push(ch);
        }
        return arr;
      }
      function cell(cx, cy, r){ ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fillStyle = "#faf7ff"; ctx.fill(); ctx.strokeStyle = pal.violet; ctx.lineWidth = 2; ctx.stroke(); }
      var HL = 74, HS = 46, sc = 1;
      if (s <= 4){
        R = Math.min(H * 0.42, W * 0.36); cell(W / 2, H / 2 + 8, R);
        var nch = s === 0 ? 1 : 2;
        var P;
        if (s <= 1) P = [["m", "L", -R * 0.55, -R * 0.1], ["p", "L", R * 0.5, -R * 0.2], ["m", "S", -R * 0.2, R * 0.28], ["p", "S", R * 0.35, R * 0.3]];
        else if (s === 2) P = [["m", "L", -R * 0.62, -R * 0.12], ["p", "L", -R * 0.62 + 17, -R * 0.12], ["m", "S", R * 0.3, R * 0.2], ["p", "S", R * 0.3 + 17, R * 0.2]];
        else if (s === 3) P = [["m", "L", -R * 0.16, -R * 0.34], ["p", "L", R * 0.16, -R * 0.34], [o ? "p" : "m", "S", -R * 0.16, R * 0.32], [o ? "m" : "p", "S", R * 0.16, R * 0.32]];
        else P = [["m", "L", -R * 0.7, -R * 0.3], ["p", "L", R * 0.7, -R * 0.3], [o ? "p" : "m", "S", -R * 0.7, R * 0.32], [o ? "m" : "p", "S", R * 0.7, R * 0.32]];
        if (s === 3) S.draw.line(c, W / 2, H / 2 - R, W / 2, H / 2 + R, pal.grey, 1.2, [4, 4]);
        if (s === 4){ S.draw.arrow(c, W / 2 - 6, H / 2, W / 2 - R * 0.45, H / 2, pal.grey, 1.6); S.draw.arrow(c, W / 2 + 6, H / 2, W / 2 + R * 0.45, H / 2, pal.grey, 1.6); }
        P.forEach(function(p){ chrom(c, W / 2 + p[2], H / 2 + p[3], p[1] === "L" ? HL : HS, chr(p[0], p[1], nch), 1.3); });
      } else {
        var cxs = s === 5 || s === 6 ? [W * 0.27, W * 0.73] : [W * 0.27, W * 0.73];
        var leftSet = [["m", "L"], [o ? "p" : "m", "S"]], rightSet = [["p", "L"], [o ? "m" : "p", "S"]];
        if (s <= 6){
          R = Math.min(H * 0.42, W * 0.22);
          [leftSet, rightSet].forEach(function(set, ci){
            var cx = cxs[ci], cy = H / 2; cell(cx, cy, R);
            set.forEach(function(p, pi){
              var type = pi === 0 ? "L" : "S", h = type === "L" ? HL * 0.8 : HS * 0.8, yy = (pi === 0 ? -1 : 1) * R * 0.3;
              if (s === 5){ chrom(c, cx + (pi ? 14 : -14), cy + yy * (pi ? 0.8 : 0.9), h, chr(p[0], type, 2), 1.1); }
              else {
                var a = chr(p[0], type, 2);
                chrom(c, cx - R * 0.45, cy + yy, h, [a[0]], 1.1); chrom(c, cx + R * 0.45, cy + yy, h, [a[1]], 1.1);
              }
            });
            if (s === 6){ S.draw.line(c, cx, cy - R, cx, cy + R, pal.grey, 1, [4, 4]); }
          });
        } else {
          R = Math.min(H * 0.22, W * 0.16);
          var pos = [[W * 0.2, H * 0.27], [W * 0.2, H * 0.73], [W * 0.62, H * 0.27], [W * 0.62, H * 0.73]], q;
          for (q = 0; q < 4; q++){
            var side = q < 2 ? leftSet : rightSet, ch1 = q % 2;
            cell(pos[q][0] + R * 0.0 + (q >= 2 ? 0 : 0), pos[q][1], R);
            side.forEach(function(p, pi){
              var type = pi === 0 ? "L" : "S", a = chr(p[0], type, 2);
              chrom(c, pos[q][0] + (pi ? 14 : -14), pos[q][1], type === "L" ? HL * 0.55 : HS * 0.55, [a[ch1]], 0.9);
            });
          }
          S.draw.text(c, "4 gamètes", W * 0.88, H * 0.5, {size: 13, color: pal.violet});
        }
      }
      S.draw.text(c, STAGES[s][0], 10, 16, {align: "left", size: 13, color: pal.ink});
      S.draw.text(c, "rouge : mère · bleu : père", 10, H - 12, {align: "left", size: 12, color: pal.grey});
      var d = STAGES[s];
      ro.set(0, String(d[1])); ro.set(1, d[2] + (d[2] === 4 && s === 4 ? "" : "") + (s <= 4 ? " (2n)" : s === 6 ? " (n = 2 par pôle)" : " (n)")); ro.set(2, String(d[3])); ro.set(3, d[4] + "C");
      var txt = d[5];
      if (s === 7){
        txt += o ? " Avec ces orientations : gamètes {L♀, S♂} et {L♂, S♀}" + (cr.value ? " (la moitié des chromatides L portent un segment échangé)." : ", chacun en double.") : " Avec ces orientations : gamètes {L♀, S♀} et {L♂, S♂}" + (cr.value ? " (la moitié des chromatides L portent un segment échangé)." : ", chacun en double.");
      }
      nt.set(txt, "ok");
    });
  }
});

/* ---------- brassage interchromosomique ---------- */
function binom(n, k){ var r = 1, i; for (i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
SFA.sim({
  id: "b5-c07-brassage", ch: "c07", tag: "Probabilités",
  titre: "Brassage interchromosomique : 2ⁿ gamètes",
  resume: "Nombre de paires de chromosomes → nombre de gamètes possibles et tirage de 1 000 gamètes.",
  but: "Chaque paire d'homologues s'oriente au hasard à la méiose I. Touche une paire de la cellule pour retourner son orientation et vois le gamète obtenu changer. Fais varier le nombre n de paires (jusqu'à 23, comme l'espèce humaine), lis le nombre de gamètes différents possibles, puis produis 1 000 gamètes et compare la répartition observée à la théorie.",
  aRetenir: "Avec n paires de chromosomes, une personne peut produire 2ⁿ gamètes différents (sans compter le crossing-over) : 2²³ = 8 388 608 pour l'espèce humaine. Deux parents donnent (2ⁿ)² = 4ⁿ combinaisons : plus de 70 000 milliards. Le brassage explique que des frères et sœurs, sauf jumeaux, soient tous différents.",
  piege: "2ⁿ est un nombre de combinaisons possibles, pas un nombre de gamètes produits par une méiose : une méiose ne donne que 4 cellules, au plus 2 types différents (sans crossing-over). Et le crossing-over s'ajoute encore à ce brassage.",
  build: function(k, S){
    var c = k.canvas(540), pal = S.draw.palette, D = S.draw, MAT = "#c0321d", PAT = "#1f4b9e";
    var n = k.slider("Nombre de paires de chromosomes", 1, 23, 1, 3, "");
    var ro = k.readouts(["Gamètes différents (2ⁿ)", "Zygotes possibles (4ⁿ)", "Chance d'un gamète précis", "Gamètes 100 % d'une origine"]);
    var nt = k.note("", "");
    var counts = null, total = 0, ori = [], i, geo = {};
    for (i = 0; i < 23; i++) ori.push(Math.random() < .5 ? 0 : 1);       /* 0 : maternel à gauche */
    k.button("Orientation au hasard", function(){ for (var q = 0; q < 23; q++) ori[q] = Math.random() < .5 ? 0 : 1; }, true);
    k.button("Produire 1 000 gamètes", function(){
      var nn = n.value, q, j; counts = []; for (q = 0; q <= nn; q++) counts.push(0);
      for (q = 0; q < 1000; q++){ var m = 0; for (j = 0; j < nn; j++) if (Math.random() < 0.5) m++; counts[m]++; }
      total = 1000;
    });
    k.button("Effacer", function(){ counts = null; });
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t !== "down" || !geo.rows) return; var best = -1, bd = 1e9; geo.rows.forEach(function(r, q){ var d = Math.abs(p.y - r); if (d < bd && p.x > geo.cx0 && p.x < geo.cx1){ bd = d; best = q; } }); if (best >= 0 && bd < geo.rh) { ori[best] = 1 - ori[best]; k.redraw(); } });
    var lastN = null;
    k.draw(function(){
      var nn = n.value; if (lastN !== null && lastN !== nn){ counts = null; } lastN = nn;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 292;
      D.rrect(c, 8, 8, W - 16, sh, 12); ctx.fillStyle = "#f6f4fc"; ctx.fill();
      /* cellule en métaphase I */
      var cw = Math.min(250, W * 0.52), cx0 = 20, cy0 = 58, ch = sh - 66;
      D.rrect(c, cx0, cy0, cw, ch, 30); var cg = ctx.createLinearGradient(cx0, cy0, cx0 + cw, cy0 + ch); cg.addColorStop(0, "#fdf9ff"); cg.addColorStop(1, "#e9def9"); ctx.fillStyle = cg; ctx.fill(); ctx.strokeStyle = "#8d77cf"; ctx.lineWidth = 2.5; ctx.stroke();
      D.text(c, "Métaphase I : " + nn + (nn > 1 ? " paires" : " paire") + " (touche une paire)", cx0 + cw / 2, cy0 + 14, {size: 11.5, color: "#4b3a8a", weight: 800});
      var mid = cx0 + cw / 2, rh = Math.min(30, (ch - 56) / nn), bw = Math.min(54, cw * .27), bh = Math.max(3.5, Math.min(13, rh * .62));
      D.line(c, mid, cy0 + 6, mid, cy0 + ch - 6, "#9a8ac8", 1.5, [4, 4]); D.text(c, "plaque équatoriale", mid, cy0 + ch + 10, {size: 10, color: pal.grey, weight: 700});
      geo.rows = []; geo.cx0 = cx0; geo.cx1 = cx0 + cw; geo.rh = Math.max(rh, 10);
      var y0 = cy0 + ch / 2 + 6 - (nn - 1) * rh / 2, mL = 0;
      for (i = 0; i < nn; i++){
        var y = y0 + i * rh; geo.rows.push(y);
        var leftMat = ori[i] === 0; if (leftMat) mL++;
        [[mid - bw - 6, leftMat ? MAT : PAT], [mid + 6, leftMat ? PAT : MAT]].forEach(function(b){ D.rrect(c, b[0], y - bh / 2, bw, bh, bh / 2.4); ctx.fillStyle = b[1]; ctx.fill(); if (bh > 6){ ctx.fillStyle = "#fff"; ctx.fillRect(b[0] + bw / 2 - 2, y - bh / 2, 4, bh); } });
      }
      D.text(c, "pôle 1", cx0 + 28, cy0 + ch - 8, {size: 10, color: pal.grey, weight: 700}); D.text(c, "pôle 2", cx0 + cw - 28, cy0 + ch - 8, {size: 10, color: pal.grey, weight: 700});
      /* gamètes */
      var gx = cx0 + cw + 24, gwid = W - gx - 16;
      function gam(cy, side, name){
        var r = Math.min(58, gwid / 2 - 4, (sh - 80) / 4); var gc = gx + gwid / 2;
        B5.circ(c, gc, cy, r, "#fff", "#8d77cf", 2.5);
        var cols = Math.ceil(Math.sqrt(nn * 1.6)), cell = Math.min(r * 1.5 / cols, 15), mm = 0;
        for (var q = 0; q < nn; q++){
          var mat = (ori[q] === 0) === (side === 0), col = q % cols, row = Math.floor(q / cols), rows = Math.ceil(nn / cols);
          var bx = gc - cols * cell / 2 + col * cell + cell * .15, by = cy - rows * cell * .5 + row * cell * .9 + cell * .1;
          D.rrect(c, bx, by, cell * .7, Math.max(3, cell * .55), 2); ctx.fillStyle = mat ? MAT : PAT; ctx.fill(); if (mat) mm++;
        }
        D.text(c, name, gc, cy - r - 11, {size: 11, color: pal.ink, weight: 800});
        D.text(c, mm + " mat. + " + (nn - mm) + " pat.", gc, cy + r + 12, {size: 10.5, color: pal.grey, weight: 700});
        return mm;
      }
      var gy1 = 74, gy2 = sh - 62, mm1 = gam(gy1 + 8, 0, "Gamète 1 (n = " + nn + ")"); gam(gy2 + 2, 1, "Gamète 2");
      D.arrow(c, cx0 + cw + 2, cy0 + ch * .3, gx + 2, gy1 + 8, "#8d77cf", 2); D.arrow(c, cx0 + cw + 2, cy0 + ch * .7, gx + 2, gy2 + 2, "#8d77cf", 2);
      D.legend(c, [[MAT, "chromosome maternel"], [PAT, "chromosome paternel"]], 16, 10, {box: false});
      /* distribution */
      var gy = sh + 22, th = [], mxp = 0; D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      for (i = 0; i <= nn; i++){ var pp = binom(nn, i) / Math.pow(2, nn); th.push(pp); if (pp > mxp) mxp = pp; }
      var ymax = Math.min(1, Math.max(0.2, Math.ceil(mxp * 1.3 * 10) / 10)); if (counts){ counts.forEach(function(q){ ymax = Math.max(ymax, Math.ceil(q / total * 1.2 * 10) / 10); }); }
      var ax = D.axes(c, {x0: -0.5, x1: nn + 0.5, y0: 0, y1: ymax, xl: "chromosomes d'origine maternelle dans le gamète", stepX: nn > 12 ? 2 : 1, stepY: ymax <= 0.5 ? 0.1 : 0.2, t: gy + 8, b: 36, l: 40, r: 18});
      D.text(c, "fréquence", 14, gy + 4, {size: 11, color: pal.grey, align: "left"});
      var bwd = (ax.X(1) - ax.X(0)) * 0.7;
      for (i = 0; i <= nn; i++){
        if (counts){ var v = counts[i] / total; ctx.fillStyle = "rgba(98,54,196,.55)"; ctx.fillRect(ax.X(i) - bwd / 2, ax.Y(v), bwd, ax.Y(0) - ax.Y(v)); }
        D.dot(c, ax.X(i), ax.Y(th[i]), 4.5, pal.red);
      }
      D.glow(c, ax.X(mm1), ax.Y(th[mm1]), 18, pal.amber, .8); B5.circ(c, ax.X(mm1), ax.Y(th[mm1]), 8, null, pal.amber, 2.5);
      D.legend(c, [[pal.red, "théorie (binomiale)"], [pal.violet, "1 000 gamètes tirés"], [pal.amber, "ton gamète 1"]], ax.R - 4, ax.T, {align: "right"});
      ro.set(0, S.sci(Math.pow(2, nn), 3)); ro.set(1, S.sci(Math.pow(4, nn), 3)); ro.set(2, "1 sur " + S.sci(Math.pow(2, nn), 3)); ro.set(3, nn <= 10 ? S.fmt(200 / Math.pow(2, nn), 2) + " % des gamètes" : "1 sur " + S.sci(Math.pow(2, nn - 1), 3) + " (2 gamètes sur " + S.sci(Math.pow(2, nn), 3) + ")");
      nt.set(nn >= 23 ? "n = 23 : environ 8,4 millions de gamètes possibles par personne et 7,0·10¹³ zygotes possibles, avant même le crossing-over." : "Avec " + nn + " paires : " + Math.pow(2, nn) + " gamètes possibles (le tirage montre que les cas « équilibrés » sont les plus fréquents).", "ok");
    });
  }
});

/* ---------- crossing-over ---------- */
SFA.sim({
  id: "b5-c07-crossing", ch: "c07", tag: "Original",
  titre: "Crossing-over : place l'échange et mesure la recombinaison",
  resume: "Point d'échange et distance entre deux gènes → gamètes parentaux et recombinés.",
  but: "Fais glisser le point de crossing-over sur la paire de chromosomes. Regarde si les gènes A et B sont séparés (gamètes recombinés Ab et aB). Puis fais varier la distance entre les deux gènes et simule 1 000 gamètes : la fréquence des recombinants augmente avec la distance.",
  aRetenir: "Le crossing-over est un échange de segments entre deux chromatides non sœurs d'homologues, en prophase I. Il crée de nouvelles combinaisons d'allèles (brassage intrachromosomique). Plus deux gènes sont éloignés, plus un échange a de chances de les séparer : la fréquence de recombinaison approche 50 % pour des gènes très éloignés.",
  piege: "Un crossing-over qui ne tombe pas entre les deux gènes ne change pas leur combinaison. Et à l'échelle d'une méiose, seules 2 des 4 chromatides sont recombinées par un crossing-over. Modèle simplifié : un seul échange, fréquence de recombinaison r = ½·(1 − e^(−2d/100)).",
  build: function(k, S){
    var c1 = k.canvas(205), c2 = k.canvas(210), pal = S.draw.palette;
    var dist = k.slider("Distance entre A et B", 1, 80, 1, 25, "cM");
    var xco = 50;
    var ro = k.readouts(["Échange entre A et B ?", "Fréquence théorique r", "Gamètes recombinés observés", "Tirage"]);
    var nt = k.note("Glisse sur le chromosome pour placer le crossing-over.", "");
    var cnt = null;
    var pa = 10;
    function ax1(){ return {x0: 20, x1: c1.W - 20}; }
    c1.pointer(function(t, p){
      if (t === "down" || t === "drag"){ var a = ax1(); xco = Math.max(0, Math.min(100, (p.x - a.x0) / (a.x1 - a.x0) * 100)); k.redraw(); }
    });
    k.button("Simuler 1 000 gamètes", function(){
      var r = 0.5 * (1 - Math.exp(-2 * dist.value / 100)), cc = [0, 0, 0, 0], i;
      for (i = 0; i < 1000; i++){ var u = Math.random(); if (u < r / 2) cc[2]++; else if (u < r) cc[3]++; else if (u < r + (1 - r) / 2) cc[0]++; else cc[1]++; }
      cnt = cc;
    }, true);
    var lastD = null;
    k.draw(function(){
      if (lastD !== dist.value){ cnt = null; lastD = dist.value; }
      c1.clear();
      var a = ax1(), W = a.x1 - a.x0, ctx = c1.ctx, pb = pa + dist.value, between = xco > pa && xco < pb;
      function X(cm){ return a.x0 + W * cm / 100; }
      function bar(y, segs){ segs.forEach(function(s){ ctx.fillStyle = s[2]; ctx.fillRect(X(s[0]), y - 7, X(s[1]) - X(s[0]), 14); }); ctx.strokeStyle = "rgba(15,27,45,.6)"; ctx.lineWidth = 1; ctx.strokeRect(X(0), y - 7, W, 14); }
      /* chromatides : A B maternelle (rouge) / a b paternelle (bleu) ; la chromatide interne de chaque homologue participe à l'échange */
      S.draw.text(c1, "Prophase I : 2 chromatides non sœurs (rouge : maternelle, bleu : paternelle)", a.x0, 16, {align: "left", size: 12, color: pal.grey});
      bar(50, [[0, 100, RED]]); bar(80, [[0, 100, BLU]]);
      [[50, "A", "B", RED], [80, "a", "b", BLU]].forEach(function(r){
        S.draw.text(c1, r[1], X(pa), r[0] - 14, {size: 13, color: r[3]}); S.draw.text(c1, r[2], X(pb), r[0] - 14, {size: 13, color: r[3]});
        S.draw.dot(c1, X(pa), r[0], 3, "#f4c542"); S.draw.dot(c1, X(pb), r[0], 3, "#f4c542");
      });
      S.draw.line(c1, X(xco), 34, X(xco), 98, pal.amber, 2.4, [5, 3]); S.draw.text(c1, "✕", X(xco), 66, {size: 16, color: pal.amber});
      S.draw.text(c1, "Après échange (x = " + S.fmt(xco, 0) + " cM) : chromatides recombinées", a.x0, 118, {align: "left", size: 12, color: pal.grey});
      bar(138, [[0, xco, RED], [xco, 100, BLU]]); bar(168, [[0, xco, BLU], [xco, 100, RED]]);
      var l1 = (pa < xco ? "A" : "a") + (pb < xco ? "B" : "b"), l2 = (pa < xco ? "a" : "A") + (pb < xco ? "b" : "B");
      S.draw.text(c1, l1, a.x1 - 2, 138, {align: "right", size: 13, bg: "#fff"}); S.draw.text(c1, l2, a.x1 - 2, 168, {align: "right", size: 13, bg: "#fff"});
      /* gamètes */
      var r = 0.5 * (1 - Math.exp(-2 * dist.value / 100));
      c2.clear();
      var ax = S.draw.axes(c2, {x0: -0.5, x1: 3.5, y0: 0, y1: 0.6, xl: "", yl: "fréquence", stepX: 1, stepY: 0.1, b: 48});
      ["AB", "ab", "Ab", "aB"].forEach(function(nm, i){
        var th = i < 2 ? (1 - r) / 2 : r / 2, bw = (ax.X(1) - ax.X(0)) * 0.55;
        if (cnt){ var v = cnt[i] / 1000; c2.ctx.fillStyle = i < 2 ? "rgba(46,107,85,.6)" : "rgba(180,35,24,.6)"; c2.ctx.fillRect(ax.X(i) - bw / 2, ax.Y(v), bw, ax.Y(0) - ax.Y(v)); }
        S.draw.dot(c2, ax.X(i), ax.Y(th), 5, pal.ink); S.draw.text(c2, nm, ax.X(i), ax.B + 32, {size: 13});
      });
      B5.leg(c2, [["parentaux", pal.green], ["recombinés", pal.red]], ax.L + 8, ax.T + 34); S.draw.text(c2, "points noirs : théorie", ax.R - 4, ax.T + 14, {align: "right", size: 12, color: pal.grey});
      ro.set(0, between ? "oui" : "non"); ro.set(1, S.fmt(r * 100, 1) + " %"); ro.set(2, cnt ? S.fmt((cnt[2] + cnt[3]) / 10, 1) + " %" : "—"); ro.set(3, cnt ? "AB " + cnt[0] + " · ab " + cnt[1] + " · Ab " + cnt[2] + " · aB " + cnt[3] : "—");
      nt.set(between ? "Le crossing-over est entre A et B : 2 des 4 chromatides sont recombinées (" + l1 + " et " + l2 + "), les 2 autres restent AB et ab." : "Le crossing-over est hors de la zone A–B : les gènes A et B ne sont pas séparés, aucun gamète recombiné pour ces deux gènes.", between ? "ok" : "warn");
    });
  }
});

/* ---------- non-disjonction ---------- */
var AGE = [[20, 1667], [25, 1250], [30, 952], [35, 378], [40, 106], [45, 30]];
function riskAge(a){ var l = B5.interp(AGE.map(function(p){ return [p[0], Math.log(p[1])]; }), a); return Math.exp(l); }
SFA.sim({
  id: "b5-c07-nondisjonction", ch: "c07", tag: "Santé",
  titre: "Non-disjonction et trisomie 21",
  resume: "Erreur en méiose I ou II → gamètes à 0, 1 ou 2 chromosomes 21 ; risque selon l'âge.",
  but: "Choisis le moment de l'erreur (méiose I ou II) et observe les quatre gamètes obtenus : combien de copies du chromosome 21 ? Puis regarde ce que donne la fécondation par un gamète normal. Déplace l'âge de la mère pour voir le risque de trisomie 21 à la naissance.",
  aRetenir: "Une non-disjonction est un défaut de séparation à la méiose : un gamète reçoit deux copies du chromosome 21, un autre aucune. Après fécondation par un gamète normal, le zygote a 3 copies (trisomie 21, 47 chromosomes) ou 1 (monosomie, non viable pour un autosome). En méiose I, les deux copies sont différentes (maternelle et paternelle de la mère) ; en méiose II, elles sont identiques.",
  piege: "La trisomie 21 n'est pas due à une « maladie héritée » dans la grande majorité des cas : c'est un accident de la méiose. Le risque augmente avec l'âge de la mère mais la plupart des enfants porteurs naissent de mères de moins de 35 ans (parce qu'elles sont plus nombreuses). Valeurs d'ordre de grandeur (données d'études de naissances).",
  build: function(k, S){
    var c = k.canvas(250), pal = S.draw.palette;
    var err = k.seg("Erreur", [["0", "Aucune"], ["1", "Méiose I"], ["2", "Méiose II"]], "1");
    var age = k.slider("Âge de la mère", 20, 45, 1, 35, "ans");
    var ro = k.readouts(["Copies du chr. 21 dans les 4 gamètes", "Gamètes anormaux", "Zygotes après fécondation", "Risque à la naissance (âge)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var e = err.value, W = c.W, ctx = c.ctx;
      var G = e === "0" ? [[RED], [BLU], [RED], [BLU]] : e === "1" ? [[RED, BLU], [RED, BLU], [], []] : [[RED, RED], [], [BLU], [BLU]];
      if (e === "1") G = [[RED, BLU], [], [RED, BLU], []];
      if (e === "2") G = [[RED, RED], [], [BLU], [BLU]];
      if (e === "0") G = [[RED], [RED], [BLU], [BLU]];
      var gx = W / 5, i;
      S.draw.text(c, "Les 4 gamètes de la mère (chromosome 21 : maternel en rouge, paternel en bleu)", 10, 16, {align: "left", size: 12, color: pal.grey});
      for (i = 0; i < 4; i++){
        var cx = gx * (i + 0.75) + 10, cy = 62;
        B5.circ(c, cx, cy, 30, "#faf7ff", G[i].length === 1 ? pal.violet : pal.red, 2);
        G[i].forEach(function(col, j){ chrom(c, cx + (j - (G[i].length - 1) / 2) * 14, cy, 38, [{top: col, bot: col}], 1.2); });
        S.draw.text(c, G[i].length + " copie" + (G[i].length > 1 ? "s" : ""), cx, cy + 46, {size: 12, color: G[i].length === 1 ? pal.green : pal.red});
      }
      S.draw.text(c, "Fécondation par un spermatozoïde normal (1 copie)", 10, 138, {align: "left", size: 12, color: pal.grey});
      for (i = 0; i < 4; i++){
        var cx2 = gx * (i + 0.75) + 10, n2 = G[i].length + 1;
        var txt = n2 === 2 ? "normal" : n2 === 3 ? "trisomie 21" : "monosomie 21";
        var colr = n2 === 2 ? pal.green : n2 === 3 ? pal.red : pal.grey;
        B5.rect(c, cx2 - 47, 150, 94, 34, n2 === 2 ? "#e6f3ec" : n2 === 3 ? "#fde3d6" : "#eceff3", colr, 1.5);
        S.draw.text(c, (n2 === 2 ? 46 : n2 === 3 ? 47 : 45) + " chr.", cx2, 162, {size: 12, color: colr}); S.draw.text(c, txt, cx2, 177, {size: 12, color: colr});
      }
      B5.wrap(c, e === "0" ? "Sans erreur, les 4 gamètes sont normaux." : e === "1" ? "Méiose I : 2 gamètes à 2 copies différentes (maternelle + paternelle), 2 gamètes sans chromosome 21." : "Méiose II : 1 gamète à 2 copies identiques, 1 gamète sans copie, 2 gamètes normaux.", 10, 208, W - 20, 16, {size: 12});
      var bad = e === "0" ? 0 : e === "1" ? 4 : 2, z3 = e === "0" ? 0 : e === "1" ? 2 : 1, z1 = e === "0" ? 0 : e === "1" ? 2 : 1;
      var rk = riskAge(age.value), rkr = rk < 200 ? Math.round(rk / 5) * 5 : Math.round(rk / 10) * 10;
      ro.set(0, e === "0" ? "1 + 1 + 1 + 1" : e === "1" ? "2 + 2 + 0 + 0" : "2 + 0 + 1 + 1"); ro.set(1, bad + " sur 4"); ro.set(2, z3 + " trisomie, " + z1 + " monosomie");
      ro.set(3, "≈ 1 sur " + S.fmt(rkr, 0) + " (" + S.fmt(100 / rk, 2) + " %)");
      nt.set("À " + age.value + " ans : environ 1 naissance sur " + S.fmt(Math.round(rk / 10) * 10, 0) + " avec trisomie 21 (ordre de grandeur) ; à 20 ans : 1 sur 1 667 ; à 45 ans : 1 sur 30. Les gamètes à 3 copies n'existent pas : l'erreur donne 0 ou 2 copies.", "ok");
    });
  }
});
})();
