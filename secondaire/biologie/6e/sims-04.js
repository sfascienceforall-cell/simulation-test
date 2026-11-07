/* Chapitre 4 · Génétique humaine, mutations et maladies génétiques */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c04-risque", ch: "c04", tag: "Classique",
  titre: "Mucoviscidose : parents porteurs, fratrie, population",
  resume: "Trois situations, trois risques très différents : deux porteurs, la sœur saine d'un malade, un couple au hasard.",
  but: "La mucoviscidose est une maladie autosomique récessive (N normal, m allèle de la maladie). Choisis la situation et lis le risque pour un enfant ; en mode « Deux porteurs », simule 20 familles.",
  aRetenir: "Deux porteurs (Nm × Nm) : 1/4 d'enfants atteints à chaque naissance. Un enfant sain de parents porteurs est porteur avec la probabilité 2/3 (et non 1/2), car mm est exclu. Dans la population, le risque pour un couple pris au hasard est (f²)/4 si f est la proportion de porteurs : très faible, mais pas nul.",
  piege: "« 1/4 » est un risque pour chaque enfant, pas une garantie sur la fratrie : une famille de 4 enfants peut très bien n'avoir aucun enfant atteint (probabilité (3/4)⁴ ≈ 32 %) ou en avoir deux. Et être porteur ne rend pas malade.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var mode = k.seg("Situation", [["p", "Deux porteurs"], ["s", "Fratrie saine"], ["g", "Au hasard"]], "p");
    var F = k.slider("Porteurs dans la population : 1 personne sur", 10, 100, 1, 30, "");
    var n = k.slider("Enfants par famille (mode « Deux porteurs »)", 1, 6, 1, 4, "");
    var seed = 1; k.button("Nouveau tirage des familles", function(){ seed++; });
    var ro = k.readouts(["Risque pour un enfant", "Soit 1 sur", "Familles avec au moins 1 enfant atteint"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, m = mode.value, f = 1 / F.value, risk, i, j;
      var rP = 0.25, rS = 2 / 3 * f * 0.25, rG = f * f * 0.25;
      risk = m === "p" ? rP : m === "s" ? rS : rG;
      /* échiquier */
      var cell = 40, ox = 58, oy = 30, gam = ["N", "m"], hide = (m === "s");
      S.draw.text(c, "Parent porteur", ox + cell, 10, {size: 12, color: P.acc});
      for (i = 0; i < 2; i++){
        S.draw.text(c, gam[i], ox + cell * (i + 0.5), oy - 8, {size: 14, color: P.acc}); S.draw.text(c, gam[i], ox - 14, oy + cell * (i + 0.5), {size: 14, color: P.red});
        for (j = 0; j < 2; j++){
          var g = gam[i] === gam[j] ? gam[i] + gam[j] : "Nm", col = g === "mm" ? P.red : g === "NN" ? P.green : P.amber;
          ctx.globalAlpha = (hide && g === "mm") ? 0.25 : 1; ctx.fillStyle = col; ctx.fillRect(ox + j * cell, oy + i * cell, cell - 2, cell - 2); ctx.globalAlpha = 1;
          S.draw.text(c, g, ox + j * cell + cell / 2 - 1, oy + i * cell + cell / 2, {size: 14, color: "#fff"});
          if (hide && g === "mm"){ S.draw.line(c, ox + j * cell + 4, oy + i * cell + 4, ox + j * cell + cell - 6, oy + i * cell + cell - 6, P.ink, 2); }
        }
      }
      var tx = ox + 2 * cell + 18;
      var lines = m === "p" ? ["1/4 sain (NN)", "1/2 porteur (Nm)", "1/4 atteint (mm)"] : m === "s" ? ["Enfant sain : mm exclu", "reste 3 cas : NN, Nm, Nm", "P(porteur) = 2/3"] : ["Risque = P(couple de porteurs)", "× 1/4 = f² / 4", "avec f = 1/" + F.value];
      lines.forEach(function(l, q){ S.draw.text(c, l, tx, oy + 14 + q * 26, {align: "left", size: 13}); });
      /* échelle des risques (logarithmique) */
      var ly = 134, L = 20, W = c.W - 40;
      S.draw.text(c, "Échelle des risques pour un enfant (échelle logarithmique)", c.W / 2, ly, {size: 12, color: P.grey});
      [[rP, "Deux porteurs", "p"], [rS, "Fratrie saine d'un malade", "s"], [rG, "Couple au hasard", "g"]].forEach(function(r, q){
        var wv = Math.max(2, (Math.log10(r[0]) + 5) / 5 * W), y = ly + 14 + q * 26; ctx.globalAlpha = m === r[2] ? 1 : 0.35;
        ctx.fillStyle = m === r[2] ? P.red : P.acc; ctx.fillRect(L, y, wv, 18); ctx.globalAlpha = 1;
        S.draw.text(c, r[1] + " : " + S.fmt(r[0] * 100, r[0] < 0.01 ? 3 : 2) + " %", L + 4, y + 9, {align: "left", size: 12, color: wv > 190 ? "#fff" : P.ink, bg: wv > 190 ? null : "rgba(255,255,255,.75)"});
      });
      /* familles simulées */
      if (m === "p"){
        var rg = B.rng(seed * 4409 + n.value), fy = 250, cols = 5, bw = (c.W - 30) / cols, aff = 0, withAff = 0, N = n.value;
        S.draw.text(c, "20 familles de " + N + " enfant" + (N > 1 ? "s" : "") + " (rouge = atteint)", c.W / 2, fy - 8, {size: 12, color: P.grey});
        for (i = 0; i < 20; i++){
          var bx = 15 + (i % cols) * bw, by = fy + Math.floor(i / cols) * 40, any = false;
          ctx.strokeStyle = "#c6cdd6"; ctx.strokeRect(bx, by, bw - 6, 34);
          for (j = 0; j < N; j++){ var isA = rg() < 0.25; if (isA){ aff++; any = true; } ctx.fillStyle = isA ? P.red : "#9fb7a8"; ctx.fillRect(bx + 5 + (j % 3) * ((bw - 20) / 3), by + 4 + Math.floor(j / 3) * 14, (bw - 20) / 3 - 3, 11); }
          if (any) withAff++;
        }
        ro.set(2, withAff + " sur 20 (attendu " + S.fmt(20 * (1 - Math.pow(0.75, N)), 1) + ")");
        note.set("Sur ces " + (20 * N) + " enfants, " + aff + " sont atteints (" + S.fmt(aff / (20 * N) * 100, 0) + " %) : proche de 25 % mais jamais exactement, car le hasard joue.", "");
      } else {
        ro.set(2, "—");
        note.set(m === "s" ? "Une personne saine dont le frère est atteint est porteuse avec la probabilité 2/3. Si elle fonde un couple avec une personne choisie au hasard : 2/3 × (1/" + F.value + ") × 1/4. Le risque est environ " + S.fmt(rS / rG, 0) + " fois plus élevé que pour un couple au hasard." : "Pour un couple pris au hasard : (1/" + F.value + ")² × 1/4. Chiffre réel d'ordre de grandeur en Europe : environ 1 personne sur 25 à 30 est porteuse, soit une naissance atteinte sur 2 500 à 3 600 environ.", "");
      }
      ro.set(0, S.fmt(risk * 100, risk < 0.01 ? 3 : 2) + " %"); ro.set(1, S.fmt(Math.round(1 / risk), 0));
    });
  }
});

var CODON = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", BASES = "UCAG";
var AA3 = {F: "Phe", L: "Leu", S: "Ser", Y: "Tyr", "*": "Stop", C: "Cys", W: "Trp", P: "Pro", H: "His", Q: "Gln", R: "Arg", I: "Ile", M: "Met", T: "Thr", N: "Asn", K: "Lys", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gly"};
function translate(rna){
  var out = [];
  for (var i = 0; i + 3 <= rna.length; i += 3){
    var c = rna.substr(i, 3), idx = BASES.indexOf(c[0]) * 16 + BASES.indexOf(c[1]) * 4 + BASES.indexOf(c[2]);
    out.push({c: c, a: AA3[CODON[idx]]});
    if (CODON[idx] === "*") break;
  }
  return out;
}

SFA.sim({
  id: "b6-c04-mutation", ch: "c04", tag: "Originale",
  titre: "Une mutation, une protéine : de l'ADN à la drépanocytose",
  resume: "Change une lettre de l'ADN, insère ou supprime une base : lis l'effet sur la suite des acides aminés.",
  but: "Début du gène de la chaîne β de l'hémoglobine (30 nucléotides, brin codant). Touche une base de l'ADN du haut pour choisir la position (ou utilise le curseur), puis le type de mutation et la nouvelle base. Les perles en rouge sont les acides aminés qui changent. Le bouton reproduit la mutation de la drépanocytose.",
  aRetenir: "Une substitution peut être silencieuse (même acide aminé), faux-sens (autre acide aminé) ou non-sens (codon stop prématuré). Une insertion ou une délétion d'un nombre de bases non multiple de 3 décale tout le cadre de lecture : tous les acides aminés suivants changent. Dans la drépanocytose, un seul changement GAG → GTG remplace Glu par Val (6e acide aminé de la chaîne β, 7e codon avec l'AUG initial).",
  piege: "Une mutation ne change pas toujours la protéine (code redondant) et un seul acide aminé modifié peut suffire à provoquer une maladie. Une mutation n'est pas forcément héréditaire : seules celles des cellules de la lignée germinale se transmettent.",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 400 : 390), P = S.draw.palette;
    var SEQ = "ATGGTGCACCTGACTCCTGAGGAGAAGTCT";
    var type = k.seg("Mutation", [["s", "Substitution"], ["i", "Insertion"], ["d", "Délétion"]], "s");
    var pos = k.slider("Position dans la séquence (1 à 30)", 1, 30, 1, 20, "");
    var nb = k.select("Nouvelle base", ["A", "C", "G", "T"], "T");
    k.button("Drépanocytose (A → T en position 20)", function(){ type.set("s"); pos.set(20); nb.set("T"); });
    var ro = k.readouts(["Type de mutation", "Acides aminés modifiés"]);
    var note = k.note("", "");
    var BC = {A: "#2f7fd1", T: "#e07a1f", G: "#24775a", C: "#c43a7a"};
    function rna(s){ return s.replace(/T/g, "U"); }
    c.pointer(function(t, p){ if (t !== "down" && t !== "drag") return; if (c._hit){ c._hit.forEach(function(h){ if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) pos.set(h.i + 1); }); } });
    k.draw(function(){
      c.clear(); var t = type.value, p = pos.value - 1, b = nb.value, mut = SEQ, ctx = c.ctx, W = c.W, i;
      if (t === "s") mut = SEQ.slice(0, p) + b + SEQ.slice(p + 1); else if (t === "i") mut = SEQ.slice(0, p) + b + SEQ.slice(p); else mut = SEQ.slice(0, p) + SEQ.slice(p + 1);
      var o = translate(rna(SEQ)), m = translate(rna(mut)), mo = rna(SEQ), mm = rna(mut), changed = 0;
      var bs = (W - 20) / 15, bh = Math.min(22, bs - 2); c._hit = [];
      S.draw.text(c, "ADN (brin codant) : touche une base", 10, 10, {align: "left", size: 12.5, color: P.acc});
      for (var line = 0; line < 2; line++){
        var yn = 24 + line * 62, ym = yn + 27;
        for (i = 0; i < 15; i++){
          var gi = line * 15 + i, x = 10 + i * bs, base = SEQ[gi], isSel = gi === p;
          ctx.fillStyle = BC[base]; S.draw.rrect(c, x + 1, yn, bs - 2, bh, 4); ctx.fill();
          if (isSel){ ctx.lineWidth = 2.4; ctx.strokeStyle = P.ink; S.draw.rrect(c, x - 1, yn - 2, bs + 2, bh + 4, 5); ctx.stroke(); }
          S.draw.text(c, base, x + bs / 2, yn + bh / 2 + 0.5, {size: 12, color: "#fff"});
          c._hit.push({x: x, y: yn - 4, w: bs, h: bh + 8, i: gi});
          if (gi % 3 === 0) S.draw.line(c, x + 0.5, yn - 4, x + 0.5, yn - 1, "#7b8694", 1);
        }
        /* version mutée alignée sous la ligne */
        for (i = 0; i < 15; i++){
          var gj = line * 15 + i, x2 = 10 + i * bs, mb, hl = false;
          if (t === "s"){ mb = mut[gj]; hl = gj === p && mut[gj] !== SEQ[gj]; }
          else if (t === "i"){ if (gj < p) mb = mut[gj]; else if (gj === p){ mb = mut[gj]; hl = true; } else mb = mut[gj]; }
          else { mb = mut[gj]; if (gj === p) hl = true; }
          if (!mb) continue;
          var shifted = t !== "s" && gj >= p;
          ctx.fillStyle = hl ? BC[mb] : S.draw.tint(BC[mb], shifted ? 0.45 : 0.28); S.draw.rrect(c, x2 + 1, ym, bs - 2, bh, 4); ctx.fill();
          if (hl){ ctx.lineWidth = 2.2; ctx.strokeStyle = P.red; S.draw.rrect(c, x2 - 1, ym - 2, bs + 2, bh + 4, 5); ctx.stroke(); }
          S.draw.text(c, mb, x2 + bs / 2, ym + bh / 2 + 0.5, {size: 12, color: hl ? "#fff" : BC[mb]});
        }
        S.draw.text(c, "muté", 10, ym + bh + 8, {align: "left", size: 9.5, color: P.grey});
      }
      /* protéines : chaînes de perles */
      var py0 = 160, pr = Math.min(19, (W - 20) / 10 / 2 - 2), step = (W - 20) / 10;
      function chain(list, y, title, cmp){
        S.draw.text(c, title, 10, y - 24, {align: "left", size: 12.5, color: P.acc});
        ctx.strokeStyle = "#c3cbd5"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10 + step / 2, y); ctx.lineTo(10 + step * (Math.max(list.length, 1) - 0.5), y); ctx.stroke();
        for (var q = 0; q < 10; q++){
          var x = 10 + step * (q + 0.5);
          if (q >= list.length){ ctx.beginPath(); ctx.arc(x, y, pr * 0.55, 0, 6.2832); ctx.fillStyle = "#eef1f5"; ctx.fill(); continue; }
          var diff = cmp && (!cmp[q] || cmp[q].a !== list[q].a), stop = list[q].a === "Stop";
          if (diff) S.draw.glow(c, x, y, pr * 2, P.red, 0.35);
          ctx.beginPath(); ctx.arc(x, y, pr, 0, 6.2832); ctx.fillStyle = stop ? "#13233a" : diff ? "#e0594a" : "#3a9c78"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.stroke();
          S.draw.text(c, list[q].a.slice(0, 3), x, y + 0.5, {size: pr > 15 ? 10.5 : 9, color: "#fff"});
          S.draw.text(c, mo2(q, list === o ? mo : mm), x, y + pr + 11, {size: 9.5, color: diff ? P.red : P.grey, weight: 600});
        }
      }
      function mo2(q, rn){ return rn.slice(q * 3, q * 3 + 3); }
      chain(o, py0 + 30, "Protéine normale (ARNm → acides aminés)", null);
      chain(m, py0 + 112, "Protéine mutée", o);
      for (i = 0; i < 10; i++) if (!m[i] || !o[i] || m[i].a !== o[i].a) if (o[i]) changed++;
      /* globule rouge si drépanocytose */
      var sick = t === "s" && m[6] && m[6].a === "Val" && o[6].a === "Glu";
      var ry = 328, rcx = 60;
      if (sick){
        ctx.beginPath(); ctx.arc(rcx, ry, 18, 0, 6.2832); ctx.fillStyle = "#d65248"; ctx.fill(); ctx.beginPath(); ctx.arc(rcx, ry, 7, 0, 6.2832); ctx.fillStyle = "rgba(120,20,20,.25)"; ctx.fill();
        S.draw.text(c, "globule normal", rcx, ry + 30, {size: 10.5, color: P.grey});
        S.draw.arrow(c, rcx + 28, ry, rcx + 70, ry, P.grey, 2);
        var sx = rcx + 130; ctx.beginPath(); ctx.moveTo(sx - 26, ry + 10); ctx.quadraticCurveTo(sx, ry - 28, sx + 26, ry + 10); ctx.quadraticCurveTo(sx, ry - 10, sx - 26, ry + 10); ctx.fillStyle = "#b02e25"; ctx.fill();
        S.draw.text(c, "globule en faucille", sx, ry + 30, {size: 10.5, color: P.red});
        S.draw.text(c, "Glu → Val : l'hémoglobine S forme des fibres", Math.min(W - 10, sx + 60), ry - 10, {align: "left", size: 11, color: P.red});
      }
      var kind;
      if (t !== "s") kind = "décalage du cadre de lecture";
      else { var q2 = Math.floor(p / 3); kind = q2 === 0 && mut !== SEQ ? "mutation du codon d'initiation AUG (la traduction ne démarre plus normalement)" : m[q2] && o[q2] && m[q2].a === o[q2].a ? (mut === SEQ ? "aucun changement (même base)" : "silencieuse") : (m[q2] && m[q2].a === "Stop" ? "non-sens (codon stop)" : "faux-sens"); }
      ro.set(0, kind); ro.set(1, changed + " sur 10");
      var extra = "";
      if (t === "s" && p === 19 && b === "T") extra = " C'est la mutation de la drépanocytose : Glu (acide glutamique) devient Val (valine) en position 6 de la chaîne β de l'hémoglobine (7e codon si l'on compte l'AUG initial) ; l'hémoglobine S forme des fibres qui déforment les globules rouges.";
      note.set("Résultat : <b>" + kind + "</b>. " + (t === "s" ? "" : "Tous les codons situés après la mutation sont lus autrement. ") + (m.length < 10 && m[m.length - 1] && m[m.length - 1].a === "Stop" ? "La traduction s'arrête prématurément (protéine tronquée). " : "") + extra, kind === "silencieuse" || kind === "aucun changement (même base)" ? "ok" : "warn");
    });
  }
});


var LEN = {1: 248, 2: 242, 3: 198, 4: 190, 5: 181, 6: 171, 7: 159, 8: 145, 9: 138, 10: 134, 11: 135, 12: 133, 13: 114, 14: 107, 15: 102, 16: 90, 17: 83, 18: 80, 19: 59, 20: 64, 21: 47, 22: 51, X: 156, Y: 57};
var KAR = {
  xx: ["46,XX : femme normale", {}, "XX", "Caryotype normal féminin."],
  xy: ["46,XY : homme normal", {}, "XY", "Caryotype normal masculin."],
  t21: ["47,XX,+21 : trisomie 21", {21: 3}, "XX", "Trois chromosomes 21 (syndrome de Down). L'âge de la mère augmente le risque d'une non-disjonction."],
  t18: ["47,XX,+18 : trisomie 18", {18: 3}, "XX", "Trois chromosomes 18 (syndrome d'Edwards), très grave."],
  t13: ["47,XY,+13 : trisomie 13", {13: 3}, "XY", "Trois chromosomes 13 (syndrome de Patau), très grave."],
  tu: ["45,X : syndrome de Turner", {}, "X", "Un seul chromosome X : femme de petite taille, souvent stérile."],
  kl: ["47,XXY : syndrome de Klinefelter", {}, "XXY", "Homme avec un chromosome X de plus ; souvent diagnostiqué à l'adolescence ou à l'âge adulte."],
  xxx: ["47,XXX : triple X", {}, "XXX", "Femme avec un X supplémentaire ; souvent peu ou pas de signes."],
  xyy: ["47,XYY", {}, "XYY", "Homme avec un Y supplémentaire ; souvent peu de signes."]
};
SFA.sim({
  id: "b6-c04-caryotype", ch: "c04", tag: "Classique",
  titre: "Lire un caryotype et comprendre la non-disjonction",
  resume: "Compte les chromosomes, repère l'anomalie, puis vois comment une erreur de méiose la produit.",
  but: "Choisis un caryotype : les chromosomes sont dessinés à une taille proportionnelle à leur longueur ; ceux dont le nombre est anormal sont entourés. Dans la partie basse, simule une erreur de méiose sur une paire de chromosomes et lis le contenu des quatre gamètes.",
  aRetenir: "Un caryotype normal compte 46 chromosomes : 22 paires d'autosomes et 2 chromosomes sexuels. Une trisomie (3 exemplaires) ou une monosomie (1 exemplaire) vient le plus souvent d'une non-disjonction pendant la méiose : une cellule reçoit un chromosome de trop et l'autre un de moins. Après la fécondation par un gamète normal : 47 ou 45 chromosomes.",
  piege: "Une anomalie de nombre ne vient pas d'un « gène défectueux » mais d'un mauvais partage des chromosomes. Et la majorité des trisomies et monosomies (autres que 21, 18, 13, X, Y) ne permettent pas le développement jusqu'à la naissance.",
  build: function(k, S){
    var c = k.canvas(500), P = S.draw.palette;
    var sel = k.select("Caryotype", Object.keys(KAR).map(function(x){ return [x, KAR[x][0]]; }), "t21");
    var err = k.seg("Erreur de méiose", [["0", "Aucune"], ["1", "Méiose I"], ["2", "Méiose II"]], "1");
    var ro = k.readouts(["Nombre de chromosomes", "Anomalie"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, K = KAR[sel.value], cnt = {}, i, tot = 0, abn = [], key;
      for (i = 1; i <= 22; i++) cnt[i] = 2 + ((K[1][i] || 2) - 2);
      var sx = K[2]; cnt.X = (sx.match(/X/g) || []).length; cnt.Y = (sx.match(/Y/g) || []).length;
      var list = []; for (i = 1; i <= 22; i++) list.push(i); list.push("X"); list.push("Y");
      var cw = (c.W - 12) / 8, maxH = 70;
      list.forEach(function(ch, q){
        var x0 = 6 + (q % 8) * cw, y0 = 8 + Math.floor(q / 8) * 96, n = cnt[ch], norm = ch === "X" ? (sx === "XY" || sx === "X" ? 1 : 2) : ch === "Y" ? 0 : 2;
        if (ch === "X") norm = (sx === "XX" || sx === "XXY" || sx === "XXX" || sx === "XYY" ? 2 : 1); /* affichage : écart par rapport à un caryotype normal selon le sexe */
        var expected = ch === "X" ? (sx.indexOf("Y") >= 0 ? 1 : 2) : ch === "Y" ? (sx.indexOf("Y") >= 0 ? 1 : 0) : 2;
        var bad = n !== expected; if (bad) abn.push(ch); tot += n;
        if (n === 0) return;
        var h = LEN[ch] / 248 * maxH + 8, bw = 7, gap = 3, tw = n * bw + (n - 1) * gap, xs = x0 + (cw - tw) / 2;
        if (bad){ ctx.strokeStyle = P.red; ctx.lineWidth = 2; ctx.strokeRect(x0 + 1, y0 - 2, cw - 4, maxH + 36); }
        for (var j = 0; j < n; j++){ ctx.fillStyle = ch === "X" ? P.violet : ch === "Y" ? P.teal : (bad && j === 2 ? P.red : P.acc); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(xs + j * (bw + gap), y0 + (maxH + 8 - h), bw, h, 3) : ctx.rect(xs + j * (bw + gap), y0 + (maxH + 8 - h), bw, h); ctx.fill(); }
        S.draw.text(c, ch, x0 + cw / 2, y0 + maxH + 22, {size: 12, color: bad ? P.red : P.grey, weight: 700});
      });
      ro.set(0, tot); ro.set(1, abn.length ? "chromosome " + abn.join(", ") : "aucune");
      /* méiose */
      var my = 322; S.draw.text(c, "Les 4 gamètes après une erreur (paire n° 21)", c.W / 2, my, {size: 12, color: P.grey});
      var g = err.value === "0" ? [1, 1, 1, 1] : err.value === "1" ? [2, 2, 0, 0] : [2, 0, 1, 1];
      g.forEach(function(v, q){
        var x = 14 + q * ((c.W - 28) / 4), w = (c.W - 28) / 4 - 8, ab = v !== 1;
        ctx.fillStyle = ab ? "#fde8e6" : "#eef6f1"; ctx.fillRect(x, my + 16, w, 50); ctx.strokeStyle = ab ? P.red : "#b8c4cf"; ctx.strokeRect(x, my + 16, w, 50);
        for (var j = 0; j < v; j++){ ctx.fillStyle = ab ? P.red : P.acc; ctx.fillRect(x + w / 2 - v * 6 + j * 12 + 1, my + 22, 8, 22); }
        S.draw.text(c, v + (v > 1 ? " copies" : " copie"), x + w / 2, my + 56, {size: 12, color: ab ? P.red : P.ink});
      });
      var nab = g.filter(function(v){ return v !== 1; }).length;
      S.draw.text(c, "Fécondation par un gamète normal (1 exemplaire) :", c.W / 2, my + 86, {size: 12, color: P.grey});
      var zy = g.map(function(v){ return v + 1; }).filter(function(v, q, a){ return a.indexOf(v) === q; }).sort(function(a, b){ return b - a; });
      S.draw.text(c, zy.map(function(v){ return v === 3 ? "trisomie (3)" : v === 1 ? "monosomie (1)" : "normal (2)"; }).join(" · "), c.W / 2, my + 106, {size: 13});
      S.draw.text(c, nab + " gamète" + (nab > 1 ? "s anormaux" : " anormal") + " sur 4", c.W / 2, my + 128, {size: 13, color: nab ? P.red : P.green});
      note.set(K[3], abn.length ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c04-depistage", ch: "c04", tag: "Niche utile",
  titre: "Dépistage prénatal : que vaut un test positif ?",
  resume: "Âge de la mère, sensibilité et spécificité : calcule combien de tests positifs correspondent vraiment à une trisomie 21.",
  but: "Sur 100 000 grossesses, on applique un test de dépistage de la trisomie 21. Règle l'âge de la mère (qui fixe la fréquence de départ), la sensibilité et la spécificité du test, et lis combien de tests positifs sont de vrais positifs.",
  aRetenir: "Sensibilité : part des malades que le test détecte. Spécificité : part des non-malades que le test déclare négatifs. La valeur prédictive positive (VPP) = vrais positifs / tous les positifs dépend de la fréquence de la maladie : quand la maladie est rare, même un très bon test donne une proportion notable de faux positifs.",
  piege: "Un test de dépistage positif n'est pas un diagnostic : il doit être confirmé (amniocentèse, par exemple). Et la VPP n'est pas égale à la sensibilité : un test à 99 % de sensibilité peut avoir une VPP d'environ 50 % chez une femme jeune. Les valeurs de fréquence sont des ordres de grandeur.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var age = k.slider("Âge de la mère", 20, 45, 1, 30, "ans");
    var se = k.slider("Sensibilité du test", 80, 100, 0.5, 99, "%");
    var sp = k.slider("Spécificité du test", 95, 100, 0.1, 99.9, "%");
    var ro = k.readouts(["Fréquence de la trisomie 21", "Vrais positifs", "Faux positifs", "Valeur prédictive positive"]);
    var AG = [20, 25, 30, 35, 40, 45], OD = [1667, 1250, 950, 380, 105, 30];
    function prev(a){ for (var i = 0; i < AG.length - 1; i++) if (a <= AG[i + 1]){ var t = (a - AG[i]) / (AG[i + 1] - AG[i]); return Math.exp(Math.log(1 / OD[i]) * (1 - t) + Math.log(1 / OD[i + 1]) * t); } return 1 / OD[5]; }
    function ppv(a){ var pv = prev(a), tp = pv * se.value / 100, fp = (1 - pv) * (1 - sp.value / 100); return tp / (tp + fp); }
    k.draw(function(){
      c.clear(); var N = 100000, pv = prev(age.value), sick = pv * N, tp = sick * se.value / 100, fn = sick - tp, healthy = N - sick, fp = healthy * (1 - sp.value / 100), tn = healthy - fp, pos = tp + fp, V = tp / pos;
      var L = [["Sur 100 000 grossesses : " + S.fmt(sick, 0) + " trisomies 21", P.ink],
        ["Vrais positifs : " + S.fmt(tp, 0) + " · cas manqués : " + S.fmt(fn, 0), P.green],
        ["Faux positifs : " + S.fmt(fp, 0) + " (test + sans trisomie)", P.red],
        ["Tests positifs : " + S.fmt(pos, 0) + ", dont " + S.fmt(V * 100, 0) + " % de vrais", P.acc]];
      L.forEach(function(l, i){ S.draw.text(c, l[0], 10, 14 + i * 20, {align: "left", size: 12, color: l[1]}); });
      /* barre des tests positifs */
      var bx = 10, bw = c.W - 20, by = 100, ctx = c.ctx; ctx.fillStyle = P.red; ctx.fillRect(bx, by, bw, 26); ctx.fillStyle = P.green; ctx.fillRect(bx, by, bw * V, 26);
      S.draw.text(c, "Parmi les tests positifs : vert = vrais, rouge = faux", c.W / 2, by + 42, {size: 12, color: P.grey});
      /* courbe VPP selon l'âge */
      var ax = S.draw.axes(c, {x0: 20, x1: 45, y0: 0, y1: 100, stepX: 5, stepY: 25, t: 170, b: 34, xl: "âge de la mère", yl: "VPP (%)"});
      S.draw.fn(c, ax, function(a){ return ppv(a) * 100; }, P.acc, 2.6);
      S.draw.dot(c, ax.X(age.value), ax.Y(V * 100), 7, P.red); S.draw.text(c, S.fmt(V * 100, 0) + " %", ax.X(age.value), ax.Y(V * 100) - 16, {size: 12, color: P.red});
      ro.set(0, "1 sur " + S.fmt(Math.round(1 / pv), 0)); ro.set(1, S.fmt(tp, 0)); ro.set(2, S.fmt(fp, 0)); ro.set(3, S.fmt(V * 100, 1) + " %");
    });
  }
});
})();
