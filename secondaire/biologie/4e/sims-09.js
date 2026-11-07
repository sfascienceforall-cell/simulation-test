/* Biologie 4e · chapitre 9 · Du gène à la protéine */
(function(){
  var BASES = "UCAG", AAS = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  var NAMES = {F:"Phe", L:"Leu", S:"Ser", Y:"Tyr", "*":"Stop", C:"Cys", W:"Trp", P:"Pro", H:"His", Q:"Gln", R:"Arg", I:"Ile", M:"Met", T:"Thr", N:"Asn", K:"Lys", V:"Val", A:"Ala", D:"Asp", E:"Glu", G:"Gly"};
  B4.aa = function(cod){ /* cod : 3 lettres ARN */
    var i = BASES.indexOf(cod[0]) * 16 + BASES.indexOf(cod[1]) * 4 + BASES.indexOf(cod[2]); return AAS[i];
  };
  B4.aaName = function(a){ return NAMES[a] || "?"; };
  B4.GENES = {
    hbb:{n:"β-globine (début du gène)", s:"ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTTAA"},
    art:{n:"Gène court n° 1", s:"ATGAAATTTGGCTAA"},
    art2:{n:"Gène court n° 2", s:"ATGCCCTGGAGCGACTGA"}
  };
  /* traduit un brin codant (ADN) ; commence au 1er codon, qui doit être ATG ; renvoie {aa:[...], stop:bool, started:bool} */
  B4.translate = function(dna){
    var rna = dna.replace(/T/g, "U"), out = [], stop = false;
    if (rna.slice(0, 3) !== "AUG") return {aa:[], stop:false, started:false};
    for (var i = 0; i + 3 <= rna.length; i += 3){ var a = B4.aa(rna.slice(i, i + 3)); if (a === "*"){ stop = true; break; } out.push(a); }
    return {aa:out, stop:stop, started:true};
  };
  B4.comp = {A:"T", T:"A", G:"C", C:"G"};
})();

SFA.sim({
  id:"b4-c09-transcription", ch:"c09", tag:"Classique · animation",
  titre:"Transcription : de l'ADN à l'ARN messager",
  resume:"Fais avancer l'ARN polymérase : le brin matrice est copié en ARNm, où T devient U.",
  but:"Choisis un gène et déplace la position de l'ARN polymérase. Lis les trois brins : codant, matrice et ARNm.",
  aRetenir:"L'ARN polymérase lit le brin matrice de l'ADN (3' → 5') et fabrique un ARN messager complémentaire (5' → 3'), avec U à la place de T. L'ARNm a donc la même séquence que le brin codant (non transcrit), U au lieu de T. L'ARNm quitte ensuite le noyau par les pores.",
  piege:"L'ARN contient de l'uracile (U), jamais de thymine (T). La transcription copie un seul des deux brins (le brin matrice), sur la région du gène seulement, pas tout l'ADN.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.7});
    var gene = k.select("Gène", [["hbb","β-globine (début du gène)"],["art","Gène court n° 1"],["art2","Gène court n° 2"]], "hbb");
    var pos = k.slider("Position de l'ARN polymérase", 0, 39, 1, 8, "bases");
    var showT = k.toggle("Afficher le brin matrice", true);
    var ro = k.readouts(["Bases transcrites", "ARNm déjà formé", "Brin lu par l'enzyme"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var n = B4.GENES[gene.value].s.length; var v = Math.min(n, pos.value + dt * 4); pos.set(Math.round(v * 10) / 10); if (v >= n) lp.pause(); k.redraw(); });
    k.button("▶ Animer", function(){ if (pos.value >= B4.GENES[gene.value].s.length) pos.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    var COL = {A:"#2e6b55", T:"#b42318", G:"#1e3f8f", C:"#B45309", U:"#5B21B6"};
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, cs = B4.GENES[gene.value].s, n = cs.length, p = Math.min(n, Math.floor(pos.value + 1e-6)), vis = 13, cw = Math.min(30, (W - 30) / vis);
      var off = Math.max(0, Math.min(n - vis, p - 8)), x0 = (W - cw * vis) / 2;
      var y1 = H * 0.14, y2 = y1 + cw + 10, y3 = H * 0.62;
      function cell(x, y, b, fill){ B4.rr(c, x + 1, y, cw - 2, cw - 2, 4, fill ? COL[b] : "#f1f5f9", fill ? null : "#cbd5e1", 1); if (fill) B4.txt(c, b, x + cw / 2, y + (cw - 2) / 2, "#fff", Math.min(15, cw * 0.55)); }
      B4.txt(c, "Brin codant (non transcrit) 5' → 3'", x0, y1 - 12, "#5f6b7a", 12, "left");
      if (showT.value) B4.txt(c, "Brin matrice (transcrit) 3' → 5'", x0, y2 + cw + 12, "#5f6b7a", 12, "left");
      B4.txt(c, "ARNm en cours de formation 5' → 3'", x0, y3 - 14, B4.pal.violet, 12, "left");
      for (var i = 0; i < vis; i++){
        var j = off + i; if (j >= n) break; var b = cs[j], x = x0 + i * cw;
        cell(x, y1, b, true); if (showT.value) cell(x, y2, B4.comp[b], true);
        if (showT.value) S.draw.line(c, x + cw / 2, y1 + cw - 2, x + cw / 2, y2, "#cbd5e1", 1.5);
        cell(x, y3, b === "T" ? "U" : b, j < p);
      }
      var rx = x0 + (Math.min(Math.max(p - off, 0), vis)) * cw;
      B4.ell(c, rx, y1 + cw + 4, cw * 1.1, cw * 1.5, "rgba(244,197,66,.3)", B4.pal.amber, 2.5);
      B4.txt(c, "ARN polymérase ↑", Math.max(60, Math.min(W - 60, rx)), y3 + cw + 12, B4.pal.amber, 12);
      var m = cs.slice(0, p).replace(/T/g, "U");
      ro.set(0, p + " / " + n); ro.set(1, p ? (m.length > 16 ? "…" + m.slice(-16) : m) : "—"); ro.set(2, "matrice (3' → 5')");
      nt.set(p === 0 ? "L'ARN polymérase est au début du gène. Elle va lire le brin matrice." : p >= n ? "Fin de la transcription : l'ARNm " + m + " est identique au brin codant, avec U à la place de T. Il quitte le noyau." : "Chaque base du brin matrice est lue : A→U, T→A, G→C, C→G. L'ARNm formé : " + m + ". Compare-le au brin codant (même séquence, U au lieu de T).", p >= n ? "ok" : "");
    });
    gene.el.addEventListener("change", function(){ pos.el.max = B4.GENES[gene.value].s.length; pos.set(Math.min(pos.value, pos.el.max)); k.redraw(); });
  }
});

SFA.sim({
  id:"b4-c09-traduction", ch:"c09", tag:"Animation · code génétique",
  titre:"Traduction : le ribosome lit l'ARNm codon par codon",
  resume:"Avance le ribosome sur l'ARNm : à chaque codon, un ARNt apporte l'acide aminé correspondant et la chaîne s'allonge.",
  but:"Choisis un gène, fais avancer le ribosome (curseur, bouton ou animation). Touche une case du tableau : tous les codons du même acide aminé s'allument (le code est redondant).",
  aRetenir:"Le ribosome lit l'ARNm par groupes de 3 bases (codons). Chaque codon correspond à un acide aminé (code génétique), amené par un ARNt dont l'anticodon est complémentaire. La traduction commence au codon AUG (Met) et s'arrête à un codon stop (UAA, UAG, UGA). Le code est redondant : plusieurs codons pour un même acide aminé, mais jamais un codon pour deux acides aminés.",
  piege:"Un codon = 3 bases d'ARNm ; un anticodon = 3 bases de l'ARNt, complémentaires du codon. Les codons stop ne codent aucun acide aminé.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:.98}), tb = k.canvas(258);
    var gene = k.select("Gène", [["hbb","β-globine (début du gène)"],["art","Gène court n° 1"],["art2","Gène court n° 2"]], "hbb");
    var pos = k.slider("Codon lu (site A)", 0, 12, 1, 3, "");
    var ro = k.readouts(["Codon", "Anticodon de l'ARNt", "Acide aminé", "Chaîne en cours"]);
    var nt = k.note("", "");
    var disp = 3, probe = null, tgt = 3;
    var COL = {A:P.green, U:P.violet, G:P.acc, C:P.amber};
    var anim = k.loop(function(dt){ var d = tgt - disp; if (Math.abs(d) < 0.01){ disp = tgt; anim.pause(); } else disp += d * Math.min(1, dt * 7); k.redraw(); });
    var auto = k.loop(function(dt, t){ if (!auto._a) auto._a = 0; auto._a += dt; if (auto._a > 1.1){ auto._a = 0; var n = B4.GENES[gene.value].s.length / 3 - 1; if (pos.value >= n){ auto.pause(); return; } pos.set(pos.value + 1); go(); } });
    function go(){ tgt = pos.value; anim.play(); }
    pos.el.addEventListener("input", go);
    gene.el.addEventListener("change", function(){ pos.el.max = B4.GENES[gene.value].s.length / 3 - 1; pos.set(Math.min(pos.value, pos.el.max)); disp = tgt = pos.value; k.redraw(); });
    k.button("▶ Lecture automatique", function(){ if (pos.value >= pos.el.max) pos.set(0); go(); auto.play(); }, true);
    k.button("Codon suivant", function(){ auto.pause(); pos.set(Math.min(+pos.el.max, pos.value + 1)); go(); });
    k.button("❚❚ Pause", function(){ auto.pause(); });
    var HYD = "AVLIMFWPGC", POS = "KRH", NEG = "DE";
    function aaCol(a){ return POS.indexOf(a) >= 0 ? P.blue : NEG.indexOf(a) >= 0 ? P.red : HYD.indexOf(a) >= 0 ? P.amber : P.teal; }
    function tRNA(x, y, anti, aa, col, ghost){
      var ctx = c.ctx; ctx.save(); if (ghost) ctx.globalAlpha = 0.55;
      ctx.strokeStyle = "#5b6f94"; ctx.lineWidth = 3.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x - 9, y - 22); ctx.moveTo(x + 9, y); ctx.lineTo(x + 9, y - 22); ctx.stroke();
      ctx.fillStyle = "#dbe4f5"; ctx.beginPath(); ctx.moveTo(x - 9, y - 22); ctx.lineTo(x + 9, y - 22); ctx.lineTo(x + 9, y - 36); ctx.lineTo(x - 9, y - 36); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 9, y - 30); ctx.lineTo(x - 22, y - 30); ctx.moveTo(x + 9, y - 30); ctx.lineTo(x + 22, y - 30); ctx.stroke();
      S.draw.dot(c, x, y - 44, 11, col); ctx.fillStyle = "#fff"; ctx.font = "800 9px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(aa, x, y - 44);
      ctx.restore();
      for (var i = 0; i < 3; i++) S.draw.text(c, anti[i], x + (i - 1) * 14, y + 8, {size:12, color:COL[anti[i]]});
    }
    k.draw(function(){
      var rna = B4.GENES[gene.value].s.replace(/T/g, "U"), nc = rna.length / 3, p = Math.min(nc - 1, pos.value);
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cw = Math.min(54, (W - 20) / 5.5), cx = W / 2 - cw * 0.15, ym = H * 0.58, bh = 30;
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f7f4fc"); bg.addColorStop(1, "#efeaf8"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* ribosome : grande sous-unité (haut) et petite (bas) */
      var rl = cx - cw * 1.8, rr = cx + cw * 1.8;
      ctx.save(); var lg = ctx.createLinearGradient(0, ym - 118, 0, ym - 20); lg.addColorStop(0, "#c9bde8"); lg.addColorStop(1, "#ddd5f2");
      ctx.beginPath(); ctx.moveTo(rl, ym - 20); ctx.bezierCurveTo(rl - 6, ym - 130, rr + 6, ym - 130, rr, ym - 20); ctx.closePath(); ctx.fillStyle = lg; ctx.shadowColor = "rgba(98,54,196,.2)"; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowColor = "transparent"; ctx.strokeStyle = "#8f7bd0"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rl + 10, ym + 22); ctx.bezierCurveTo(rl + 14, ym + 66, rr - 14, ym + 66, rr - 10, ym + 22); ctx.closePath(); ctx.fillStyle = "#b6a6e2"; ctx.fill(); ctx.strokeStyle = "#8f7bd0"; ctx.stroke(); ctx.restore();
      S.draw.text(c, "grande sous-unité", cx + cw * 0.7, ym - 96, {size:10, color:"#6a58a8", align:"left"}); S.draw.text(c, "petite sous-unité", cx, ym + 52, {size:10, color:"#5a4896"});
      /* sites E P A */
      [["E", -1], ["P", 0], ["A", 1]].forEach(function(s){ var sx = cx + s[1] * cw; ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "rgba(98,54,196,.35)"; ctx.strokeRect(sx - cw / 2 + 2, ym - 52, cw - 4, 90); ctx.restore(); S.draw.text(c, s[0], sx, ym + 36, {size:11, color:"#6236c4", weight:800}); });
      /* ARNm : codons qui défilent */
      ctx.strokeStyle = "#cbd2de"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(8, ym + bh / 2); ctx.lineTo(W - 8, ym + bh / 2); ctx.stroke();
      S.draw.text(c, "ARNm 5'", 8, ym + bh + 12, {size:10, color:"#5f6b7a", align:"left"}); S.draw.text(c, "3'", W - 8, ym + bh + 12, {size:10, color:"#5f6b7a", align:"right"});
      for (var j = 0; j < nc; j++){
        var x = cx + (j - disp + 1) * cw; if (x < -cw || x > W + cw) continue;
        var cod = rna.slice(3 * j, 3 * j + 3), onA = j === p, hit = probe && B4.aa(cod) === probe;
        B4.rr(c, x - cw / 2 + 2, ym, cw - 4, bh, 7, onA ? "#fde9a8" : hit ? "#d8f0e4" : "#ffffff", onA ? P.amber : hit ? P.green : "#cfd6e2", onA ? 2.4 : 1.2);
        for (var q = 0; q < 3; q++) S.draw.text(c, cod[q], x + (q - 1) * cw * 0.27, ym + bh / 2, {size:Math.min(15, cw * 0.3), color:COL[cod[q]]});
      }
      var cod0 = rna.slice(3 * p, 3 * p + 3), a0 = B4.aa(cod0), ant = cod0.split("").map(function(b){ return {A:"U", U:"A", G:"C", C:"G"}[b]; }).join("");
      /* tRNA en P (codon précédent) et en A */
      if (p >= 1){ var cp = rna.slice(3 * (p - 1), 3 * p), ap = B4.aa(cp), antp = cp.split("").map(function(b){ return {A:"U", U:"A", G:"C", C:"G"}[b]; }).join(""); tRNA(cx, ym - 16, antp, B4.aaName(ap), aaCol(ap)); }
      if (a0 === "*"){ B4.rr(c, cx + cw - 20, ym - 52, 40, 34, 7, "#fbe1dd", P.red, 2); S.draw.text(c, "facteur de", cx + cw, ym - 42, {size:9, color:P.red}); S.draw.text(c, "libération", cx + cw, ym - 31, {size:9, color:P.red}); }
      else tRNA(cx + cw, ym - 16, ant, B4.aaName(a0), aaCol(a0));
      /* chaîne polypeptidique */
      var chain = []; for (var i = 0; i < p + (a0 === "*" ? 0 : 1); i++){ var a = B4.aa(rna.slice(3 * i, 3 * i + 3)); if (a === "*") break; chain.push(a); }
      var inRib = a0 === "*" ? chain.length : chain.length - 1, bx0 = cx, by0 = ym - 60;
      var shown = chain.slice(Math.max(0, inRib - 9), inRib);
      /* beads : de la tRNA P vers le haut-gauche */
      for (i = shown.length - 1; i >= 0; i--){ var idx = shown.length - 1 - i, bx = bx0 - 14 - idx * 17 - (idx > 3 ? 3 : 0), by = ym - 100 - (idx % 2 ? 7 : 0) - Math.min(idx, 5) * 3 + 8; if (idx === 0){ bx = bx0; by = ym - 60; }
        if (idx > 0){ var pbx = idx === 1 ? bx0 : bx0 - 14 - (idx - 1) * 17 - (idx - 1 > 3 ? 3 : 0), pby = idx === 1 ? ym - 60 : ym - 100 - ((idx - 1) % 2 ? 7 : 0) - Math.min(idx - 1, 5) * 3 + 8; S.draw.line(c, pbx, pby, bx, by, "#8a95a3", 2); }
        if (idx > 0){ S.draw.dot(c, bx, by, 8.5, aaCol(shown[i])); S.draw.text(c, B4.aaName(shown[i]), bx, by, {size:7.5, color:"#fff"}); } }
      if (inRib > 9) S.draw.label(c, "+ " + (inRib - 9) + " aa", 12, ym - 118, {color:P.ink, size:10, align:"left"});
      if (a0 === "*") S.draw.label(c, "chaîne libérée : " + chain.length + " aa", W / 2, 14, {color:P.green, size:12});
      else S.draw.label(c, "chaîne qui s'allonge : " + chain.length + " aa", W / 2, 14, {color:P.violet, size:12});
      S.draw.legend(c, [[P.amber, "hydrophobe"], [P.teal, "polaire"], [P.blue, "basique (+)"], [P.red, "acide (−)"]], 6, H - 82, {box:true});
      /* tableau du code génétique */
      tb.clear(); var tx = tb.ctx, TW = tb.W, cwd = (TW - 40) / 4, ch = 56, bases = "UCAG";
      B4.txt(tb, "2e base →", 28 + 2 * cwd, 9, "#5f6b7a", 11);
      for (var b2 = 0; b2 < 4; b2++) B4.txt(tb, bases[b2], 28 + (b2 + 0.5) * cwd, 22, COL[bases[b2]], 13);
      for (var b1 = 0; b1 < 4; b1++){
        B4.txt(tb, bases[b1], 12, 30 + (b1 + 0.5) * (ch - 2), COL[bases[b1]], 13);
        for (b2 = 0; b2 < 4; b2++){
          var qx = 28 + b2 * cwd, qy = 30 + b1 * (ch - 2);
          tx.strokeStyle = "#cbd5e1"; tx.strokeRect(qx, qy, cwd - 2, ch - 4);
          for (var b3 = 0; b3 < 4; b3++){
            var code = bases[b1] + bases[b2] + bases[b3], aa = B4.aa(code), hl = code === cod0, pr = probe && aa === probe;
            if (hl || pr){ tx.fillStyle = hl ? "rgba(244,197,66,.7)" : "rgba(36,119,90,.22)"; tx.fillRect(qx + 1, qy + 1 + b3 * 12.6, cwd - 4, 12.6); }
            B4.txt(tb, bases[b3] + " " + (aa === "*" ? "stop" : B4.aaName(aa)), qx + 6, qy + 8 + b3 * 12.6, hl ? P.red : B4.pal.ink, 11, "left");
          }
        }
      }
      B4.txt(tb, "1re base ↓ · 3e base = lettre dans chaque case · touche une case", TW / 2, 250, "#5f6b7a", 10.5);
      var syn = 0; if (probe) for (i = 0; i < 64; i++) if (B4.AAS_ALL(i) === probe) syn++;
      ro.set(0, cod0); ro.set(1, ant); ro.set(2, a0 === "*" ? "aucun (stop)" : B4.aaName(a0)); ro.set(3, chain.length + " aa");
      nt.set(a0 === "*" ? "Codon stop " + cod0 + " : aucun ARNt ne le reconnaît, un facteur de libération détache la chaîne (" + chain.length + " acides aminés)." : probe ? B4.aaName(probe === "*" ? "*" : probe) + " est codé par " + syn + " codon" + (syn > 1 ? "s" : "") + " différent" + (syn > 1 ? "s" : "") + " (en vert dans le tableau) : le code est redondant, mais chaque codon n'a qu'un seul sens." : p === 0 ? "AUG est le codon d'initiation : il code la méthionine (Met), premier acide aminé." : "Codon " + cod0 + " lu par l'ARNt d'anticodon " + ant + " : acide aminé " + B4.aaName(a0) + ".", a0 === "*" ? "ok" : "");
    });
    B4.AAS_ALL = function(i){ return "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"[i]; };
    tb.pointer(function(type, e){
      if (type !== "down") return; var cwd = (tb.W - 40) / 4, ch = 56, b2 = Math.floor((e.x - 28) / cwd), b1 = Math.floor((e.y - 30) / (ch - 2));
      if (b2 < 0 || b2 > 3 || b1 < 0 || b1 > 3) { probe = null; k.redraw(); return; }
      var b3 = Math.max(0, Math.min(3, Math.floor((e.y - 30 - b1 * (ch - 2) - 1) / 12.6))); probe = B4.AAS_ALL(b1 * 16 + b2 * 4 + b3); k.redraw();
    });
    go();
  }
});

SFA.sim({
  id:"b4-c09-mutation", ch:"c09", tag:"Mutations · défi",
  titre:"Une base change, la protéine aussi ? Classer les mutations",
  resume:"Touche une base du gène de la β-globine et lis l'effet sur la protéine : silencieuse, faux-sens, non-sens, décalage.",
  but:"Touche directement une base du gène pour la choisir (chaque touche suivante la change), ou règle type, position et base. Compare la protéine normale et la mutée, puis relève les défis.",
  aRetenir:"Substitution silencieuse : même acide aminé (code redondant). Faux-sens : un autre acide aminé. Non-sens : apparition d'un codon stop, protéine tronquée. Insertion ou délétion d'une base : décalage du cadre de lecture, tous les codons suivants changent. Toutes les mutations ne sont pas nocives ; la drépanocytose vient d'un seul acide aminé changé (Glu → Val).",
  piege:"Une mutation de l'ADN n'a pas toujours d'effet sur la protéine (silencieuse), et n'est pas toujours nocive. Une mutation dans le codon d'initiation ATG supprime le démarrage de la traduction.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.02});
    var ty = k.seg("Type", [["s","Substitution"],["i","Insertion"],["d","Délétion"]], "s");
    var pos = k.slider("Position de la mutation", 1, 39, 1, 20, "");
    var nb = k.seg("Nouvelle base", [["A","A"],["T","T"],["G","G"],["C","C"]], "T");
    var ro = k.readouts(["Type de mutation", "Acides aminés modifiés ou perdus", "Taille de la protéine", "Conséquence"]);
    var ntD = k.note("", ""); var nt = k.note("", "");
    var ORIG = B4.GENES.hbb.s, hit = [], cls = "";
    var GOALS = [["Provoque une mutation silencieuse.", "silencieuse"], ["Provoque un faux-sens (un acide aminé change).", "faux-sens"], ["Provoque un non-sens (protéine tronquée).", "non-sens"], ["Provoque un décalage du cadre de lecture.", "décalage du cadre de lecture"], ["Reproduis la drépanocytose : GAG → GTG en position 20.", "dre"]], gi = 0;
    k.button("Drépanocytose (GAG → GTG)", function(){ ty.set("s"); pos.set(20); nb.set("T"); }, true);
    k.button("Silencieuse (CCT → CCC)", function(){ ty.set("s"); pos.set(18); nb.set("C"); });
    k.button("Non-sens (GAG → TAG)", function(){ ty.set("s"); pos.set(19); nb.set("T"); });
    k.button("Défi suivant", function(){ gi = (gi + 1) % GOALS.length; });
    function rbc(x, y, r, sick){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y);
      if (!sick){ ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.9, 0, 0, 6.2832); ctx.fillStyle = "#d9534f"; ctx.fill(); ctx.strokeStyle = "#9f2b28"; ctx.lineWidth = 1.6; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.45, r * 0.38, 0, 0, 6.2832); ctx.fillStyle = "#ee8a86"; ctx.fill(); }
      else { ctx.rotate(-0.5); ctx.beginPath(); ctx.moveTo(-r * 1.15, 0); ctx.quadraticCurveTo(0, -r * 1.2, r * 1.15, 0); ctx.quadraticCurveTo(0, -r * 0.35, -r * 1.15, 0); ctx.fillStyle = "#b0302d"; ctx.fill(); ctx.strokeStyle = "#7a1c1a"; ctx.lineWidth = 1.6; ctx.stroke(); }
      ctx.restore();
    }
    var geo = {};
    k.draw(function(){
      var p = pos.value - 1, mut, T = ty.value, b = nb.value;
      if (T === "s") mut = ORIG.slice(0, p) + b + ORIG.slice(p + 1);
      else if (T === "i") mut = ORIG.slice(0, p + 1) + b + ORIG.slice(p + 1);
      else mut = ORIG.slice(0, p) + ORIG.slice(p + 1);
      var A = B4.translate(ORIG), Bm = B4.translate(mut), mi = T === "i" ? p + 1 : p;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, per = 7, cwid = (W - 14) / per, bw = (cwid - 6) / 3;
      geo = {per:per, cwid:cwid, bw:bw, blocks:[]};
      var rowH = 102, y0 = 22;
      S.draw.text(c, "Touche une base du gène pour la modifier", W / 2, 10, {size:11, color:"#5f6b7a"});
      var ncod = 13;
      for (var q = 0; q < ncod + (mut.length > 39 ? 1 : 0); q++){
        var rr = Math.floor(q / per), cc = q % per, x = 7 + cc * cwid, y = y0 + rr * rowH;
        var cn = ORIG.slice(3 * q, 3 * q + 3), cm = mut.slice(3 * q, 3 * q + 3);
        var an = A.aa[q], am = Bm.started ? Bm.aa[q] : undefined, stN = A.stop && q === A.aa.length, stM = Bm.stop && q === Bm.aa.length;
        /* ADN normal */
        for (var i = 0; i < 3; i++){ var bi = 3 * q + i; B4.rr(c, x + i * bw + 1, y, bw - 1, 22, 3, "#dbe4f0", bi === p ? P.amber : null, 2); S.draw.text(c, cn[i] || "", x + i * bw + bw / 2, y + 11, {size:Math.min(14, bw - 2), color:P.ink}); }
        geo.blocks.push({x:x, y:y, kind:"n", q:q});
        /* ADN muté */
        for (i = 0; i < 3; i++){ bi = 3 * q + i; if (!cm[i]) continue; var ch2 = T === "s" ? ORIG[bi] !== cm[i] : (T === "i" ? bi === p + 1 : false), sh = T !== "s" && bi >= (T === "i" ? p + 1 : p);
          B4.rr(c, x + i * bw + 1, y + 26, bw - 1, 22, 3, ch2 ? "#fbe1dd" : sh ? "#fdf0d8" : "#eef2f7", ch2 ? P.red : null, 2); S.draw.text(c, cm[i], x + i * bw + bw / 2, y + 37, {size:Math.min(14, bw - 2), color:ch2 ? P.red : P.ink}); }
        geo.blocks.push({x:x, y:y + 26, kind:"m", q:q});
        /* protéines */
        function aaBox(yy, a, isStop, diff, show){
          if (!show){ ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#c7cfdb"; ctx.strokeRect(x + 2, yy, cwid - 6, 22); ctx.restore(); return; }
          B4.rr(c, x + 2, yy, cwid - 6, 22, 5, isStop ? "#e6e9ef" : diff ? "#fbe1dd" : "#dcf3e6", isStop ? "#8a95a3" : diff ? P.red : P.green, diff ? 2.2 : 1.2);
          S.draw.text(c, isStop ? "stop" : B4.aaName(an === undefined ? am : (yy < y + 70 ? an : am)), x + cwid / 2 - 1, yy + 11, {size:11.5, color:isStop ? "#5f6b7a" : P.ink});
        }
        var diffA = (am !== an) || (stM !== stN);
        /* normal */
        aaBox(y + 54, an, stN, false, an !== undefined || stN);
        /* muté */
        if (!Bm.started){ aaBox(y + 78, undefined, false, false, false); } else aaBox(y + 78, am, stM, diffA, am !== undefined || stM);
      }
      S.draw.text(c, "Dans chaque colonne (un codon) : ① ADN normal · ② ADN muté", W / 2, y0 + 2 * rowH + 8, {size:10, color:"#5f6b7a"}); S.draw.text(c, "③ protéine normale · ④ protéine mutée", W / 2, y0 + 2 * rowH + 22, {size:10, color:"#5f6b7a"});
      if (!Bm.started) S.draw.label(c, "aucune protéine : pas de codon initiateur AUG", W / 2, y0 + 2 * rowH + 44, {color:P.red, size:11});
      /* globules rouges pour la drépanocytose */
      var sick = T === "s" && p === 19 && b === "T";
      var ry = H - 40; rbc(W * 0.3, ry, 17, false); rbc(W * 0.7, ry, 17, sick); S.draw.text(c, "globule normal", W * 0.3, ry + 28, {size:10, color:"#5f6b7a"}); S.draw.text(c, sick ? "globule en faucille" : "globule du mutant", W * 0.7, ry + 28, {size:10, color:sick ? P.red : "#5f6b7a"});
      var nchg = 0, L = Math.max(A.aa.length, Bm.aa.length); for (i = 0; i < L; i++) if (A.aa[i] !== Bm.aa[i]) nchg++;
      var cons;
      if (!Bm.started){ cls = "perte du démarrage"; cons = "pas de protéine"; }
      else if (T !== "s"){ cls = "décalage du cadre de lecture"; cons = nchg ? "protéine très altérée à partir du codon " + (Math.floor(p / 3) + 1) : "sans effet visible"; }
      else if (nchg === 0){ cls = "silencieuse"; cons = "protéine identique"; }
      else if (A.stop && !Bm.stop){ cls = "perte du codon stop"; cons = "plus de codon stop : la lecture continue et la protéine est allongée"; }
      else if (Bm.aa.length < A.aa.length){ cls = "non-sens"; cons = "protéine tronquée (" + Bm.aa.length + " aa au lieu de " + A.aa.length + ")"; }
      else { cls = "faux-sens"; cons = "1 acide aminé remplacé"; }
      ro.set(0, cls); ro.set(1, nchg); ro.set(2, Bm.started ? Bm.aa.length + " aa" : "—"); ro.set(3, cons);
      var extra = sick ? " C'est la mutation de la drépanocytose : Glu → Val dans la β-globine, l'hémoglobine S forme des fibres et déforme les globules rouges en faucille." : "";
      nt.set("<b>" + cls.charAt(0).toUpperCase() + cls.slice(1) + ".</b> " + (T === "s" && ORIG[p] === b ? "Tu as « remplacé » la base par elle-même : aucune mutation. " : "") + cons + "." + (cls === "silencieuse" ? " Le code est redondant : le nouveau codon code le même acide aminé." : cls === "faux-sens" ? " Les conséquences dépendent de l'acide aminé et de sa place dans la protéine." : cls === "non-sens" ? " Un codon stop apparaît trop tôt." : cls === "décalage du cadre de lecture" ? " Tous les codons après la mutation sont lus autrement." : "") + extra, cls === "silencieuse" ? "ok" : "warn");
      var g = GOALS[gi], ok = g[1] === "dre" ? sick : cls === g[1];
      ntD.set("<b>Défi " + (gi + 1) + "/" + GOALS.length + ".</b> " + g[0] + (ok ? " <b>Réussi !</b>" : ""), ok ? "ok" : "");
    });
    c.pointer(function(type, e){
      if (type !== "down" || !geo.blocks) return;
      for (var j = 0; j < geo.blocks.length; j++){ var bk = geo.blocks[j];
        if (e.x >= bk.x && e.x < bk.x + 3 * geo.bw + 2 && e.y >= bk.y && e.y < bk.y + 24){
          var i = Math.min(2, Math.floor((e.x - bk.x) / geo.bw)), bi = 3 * bk.q + i; if (bi > 38) return;
          var same = ty.value === "s" && pos.value === bi + 1;
          pos.set(bi + 1);
          if (ty.value === "s"){ var opts = "ATGC".split("").filter(function(x){ return x !== ORIG[bi]; }), cur = opts.indexOf(nb.value); nb.set(same ? opts[(cur + 1) % 3] : (cur >= 0 ? nb.value : opts[0])); }
          k.redraw(); return; } }
    });
  }
});

SFA.sim({
  id:"b4-c09-polysome", ch:"c09", tag:"Polysome · animation",
  titre:"Polysome : plusieurs ribosomes sur un même ARNm",
  resume:"Charge plusieurs ribosomes sur un ARNm et calcule le nombre de protéines produites.",
  but:"Règle la longueur du gène, la vitesse des ribosomes, leur nombre et la durée de vie de l'ARNm. Touche l'ARNm pour y poser un ribosome de plus. Regarde les chaînes s'allonger et le compteur de protéines.",
  aRetenir:"Plusieurs ribosomes lisent le même ARNm en même temps (polysome). Une protéine de L acides aminés demande un temps L ÷ v. Avec N ribosomes, il sort une protéine toutes les (L ÷ v) ÷ N secondes : débit = N·v ÷ L. Plus l'ARNm vit longtemps, plus il donne de protéines.",
  piege:"Les ribosomes ne peuvent pas se chevaucher : environ un ribosome par 10 codons au maximum. Vitesses d'ordre de grandeur : ≈ 20 aa/s chez les bactéries, ≈ 5 aa/s chez les eucaryotes. Régime établi supposé.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:.92});
    var L = k.slider("Longueur de la protéine", 50, 500, 10, 200, "acides aminés");
    var v = k.slider("Vitesse du ribosome", 2, 20, 1, 5, "aa/s");
    var N = k.slider("Ribosomes sur l'ARNm", 1, 50, 1, 5, "");
    var T = k.slider("Durée de vie de l'ARNm", 30, 1800, 30, 300, "s");
    var ro = k.readouts(["Temps pour 1 protéine", "Débit", "Protéines produites", "Ribosomes maximum"]);
    var nt = k.note("", "");
    var st = {t:0, done:0, ph:0, out:[]}, geo = {};
    var lp = k.loop(function(dt){
      var Nn = Math.min(N.value, Math.floor(L.value / 10)), before = st.t * Nn * v.value / L.value;
      st.ph += dt * v.value / L.value; if (st.ph >= 1) st.ph -= 1; st.t += dt; st.done = Math.floor(st.t * Nn * v.value / L.value);
      var nb = Math.floor(st.t * Nn * v.value / L.value) - Math.floor(before); for (var q = 0; q < nb; q++) st.out.push({t:0, dx:(Math.random() - .5) * 20});
      st.out.forEach(function(o){ o.t += dt; }); st.out = st.out.filter(function(o){ return o.t < 1.6; });
      k.redraw();
    });
    lp.play();
    k.button("↺ Remettre à zéro", function(){ st.t = 0; st.ph = 0; st.done = 0; st.out = []; }, true);
    c.pointer(function(type, p){ if (type === "down" && geo.y && Math.abs(p.y - geo.y) < 30){ N.set(Math.min(50, N.value + 1)); k.redraw(); } });
    function ribo(x, y, s){ var ctx = c.ctx; ctx.beginPath(); ctx.ellipse(x, y - s * 0.55, s * 0.95, s * 0.7, 0, 0, 6.2832); var g = ctx.createLinearGradient(0, y - 2 * s, 0, y); g.addColorStop(0, "#d6cbf2"); g.addColorStop(1, "#a692dc"); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#6a58a8"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.ellipse(x, y + s * 0.05, s * 0.8, s * 0.42, 0, 0, 6.2832); ctx.fillStyle = "#8f7bd0"; ctx.fill(); ctx.stroke(); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, Lc = L.value, vv = v.value, Nmax = Math.floor(Lc / 10), Nn = Math.min(N.value, Nmax);
      var x0 = 26, x1 = W - 26, y0 = H * 0.78, chH = H * 0.5;
      geo = {y:y0};
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f8f5fd"); bg.addColorStop(1, "#efeaf8"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* ARNm */
      ctx.strokeStyle = P.violet; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 - 12, y0 + 8); ctx.lineTo(x1 + 12, y0 + 8); ctx.stroke();
      S.draw.text(c, "5'", x0 - 18, y0 + 24, {size:11, color:P.violet}); S.draw.text(c, "3'", x1 + 18, y0 + 24, {size:11, color:P.violet}); S.draw.text(c, "ARNm (" + Lc * 3 + " nucléotides) · touche-le pour ajouter un ribosome", W / 2, y0 + 28, {size:10, color:P.violet});
      for (var i = 0; i < Nn; i++){
        var f = (st.ph + i / Nn) % 1, x = x0 + f * (x1 - x0), hh = f * chH, nb = Math.max(1, Math.round(f * 14));
        ctx.strokeStyle = "#5cae82"; ctx.lineWidth = 2.4; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x, y0 - 18);
        for (var q = 1; q <= 20; q++){ var u = q / 20; ctx.lineTo(x - 14 * f * u + Math.sin(u * 14 + i) * 3 * f, y0 - 18 - hh * u); } ctx.stroke();
        for (q = 1; q <= nb; q++){ var uu = q / nb; S.draw.dot(c, x - 14 * f * uu + Math.sin(uu * 14 + i) * 3 * f, y0 - 18 - hh * uu, 3, q % 2 ? "#2f8a5e" : "#e8a317"); }
        ribo(x, y0 + 4, 11);
      }
      /* protéines libérées */
      st.out.forEach(function(o){ var u = o.t / 1.6, xx = x1 + 6 + o.dx * 0.5, yy = y0 - 20 - u * H * 0.35; ctx.save(); ctx.globalAlpha = 1 - u * u; S.draw.glow(c, xx, yy, 14, P.green, 0.5); ctx.beginPath(); ctx.arc(xx, yy, 7, 0, 6.2832); ctx.fillStyle = "#4aa877"; ctx.fill(); ctx.strokeStyle = "#1f6b43"; ctx.stroke(); ctx.restore(); });
      S.draw.label(c, "chaînes d'acides aminés de plus en plus longues →", W / 2, 14, {color:P.green, size:10.5});
      var t1 = Lc / vv, rate = Nn * vv / Lc, lifeT = T.value, n1 = Math.floor(Math.max(0, lifeT - t1) * rate);
      S.draw.label(c, "Protéines terminées : " + st.done, W - 10, H * 0.14, {color:P.ink, size:13, align:"right"});
      ro.set(0, S.fmt(t1, 0) + " s"); ro.set(1, S.fmt(rate * 60, 1) + " / min"); ro.set(2, "≈ " + S.fmt(n1, 0) + " pendant " + S.fmt(lifeT, 0) + " s"); ro.set(3, Nmax);
      nt.set((N.value > Nmax ? "Trop de ribosomes pour cette longueur : un ribosome occupe ≈ 10 codons, seuls " + Nmax + " tiennent. " : "") + "Un ribosome met " + S.fmt(t1, 0) + " s (= " + Lc + " ÷ " + vv + "). Avec " + Nn + " ribosomes, une protéine est libérée toutes les " + S.fmt(t1 / Nn, 1) + " s. Sur la durée de vie de l'ARNm : ≈ " + S.fmt(n1, 0) + " protéines" + (lifeT <= t1 ? " : aucune, l'ARNm est dégradé avant la fin de la 1re protéine." : "."), lifeT <= t1 ? "warn" : "");
    });
  }
});
