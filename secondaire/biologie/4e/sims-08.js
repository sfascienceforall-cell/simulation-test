/* Biologie 4e · chapitre 8 · ADN, chromosomes et réplication */
SFA.sim({
  id:"b4-c08-adn", ch:"c08", tag:"Classique · défi",
  titre:"Construis ton ADN : appariement des bases",
  resume:"Tape une séquence, lis son brin complémentaire, ses liaisons hydrogène et son %GC ; ou joue à compléter le brin.",
  but:"Mode « Analyser » : écris une séquence (A, T, G, C). Mode « Jeu » : complète le brin complémentaire en choisissant les bases.",
  aRetenir:"Dans l'ADN, A s'apparie avec T (2 liaisons hydrogène) et G avec C (3 liaisons). Les deux brins sont complémentaires et antiparallèles. Dans toute molécule d'ADN double brin : %A = %T et %G = %C. Plus il y a de G–C, plus la molécule est stable.",
  piege:"A ne s'apparie jamais avec G ou C. L'ARN remplace T par U (uracile), mais pas l'ADN. Les bactéries ont aussi de l'ADN, même sans noyau.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.62});
    var mode = k.seg("Mode", [["a","Analyser"],["j","Jeu"]], "a");
    var inp = k.input("Séquence du brin 1 (5' → 3')", "ATGCCGTTAGCA", function(){});
    var ro = k.readouts(["Longueur", "%GC", "Liaisons hydrogène", "Brin complémentaire"]);
    var nt = k.note("", "");
    var COMP = {A:"T", T:"A", G:"C", C:"G"}, COL = {A:"#2e6b55", T:"#b42318", G:"#1e3f8f", C:"#B45309"};
    var st = {tpl:[], idx:0, err:0, msg:"", done:false};
    function nouvelle(){ st.tpl = []; for (var i = 0; i < 10; i++) st.tpl.push("ATGC"[Math.floor(Math.random() * 4)]); st.idx = 0; st.err = 0; st.msg = ""; st.done = false; }
    nouvelle();
    function choisir(b){ if (mode.value !== "j" || st.done) return; if (COMP[st.tpl[st.idx]] === b){ st.idx++; st.msg = ""; if (st.idx >= st.tpl.length){ st.done = true; } } else { st.err++; st.msg = b + " ne s'apparie pas avec " + st.tpl[st.idx] + " (" + st.tpl[st.idx] + " ↔ " + COMP[st.tpl[st.idx]] + ")."; } }
    ["A","T","G","C"].forEach(function(b){ k.button("Base " + b, function(){ choisir(b); }); });
    k.button("Nouvelle séquence (jeu)", function(){ nouvelle(); mode.set("j"); }, true);
    function base(x, y, w, b, fill){ B4.rr(c, x + 1, y, w - 2, w - 2, 4, fill ? COL[b] : "#f1f5f9", fill ? null : "#8a95a3", 1.2); if (fill) B4.txt(c, b, x + w / 2, y + (w - 2) / 2, "#fff", Math.min(15, w * 0.6)); else B4.txt(c, "?", x + w / 2, y + (w - 2) / 2, "#8a95a3", Math.min(14, w * 0.55)); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, game = mode.value === "j", seq, raw = inp.value.toUpperCase(), bad = /[^ATGC]/.test(raw);
      seq = game ? st.tpl.slice() : raw.replace(/[^ATGC]/g, "").slice(0, 24).split("");
      var n = seq.length, cw = Math.min(34, (W - 40) / Math.max(n, 1)), x0 = (W - cw * n) / 2, y1 = H * 0.2, y2 = H * 0.2 + cw * 2.1 + 14;
      B4.txt(c, "5'", x0 - 14, y1 + cw / 2, B4.pal.ink, 12); B4.txt(c, "3'", x0 + cw * n + 14, y1 + cw / 2, B4.pal.ink, 12);
      B4.txt(c, "3'", x0 - 14, y2 + cw / 2, B4.pal.ink, 12); B4.txt(c, "5'", x0 + cw * n + 14, y2 + cw / 2, B4.pal.ink, 12);
      var gc = 0, hb = 0, comp = "";
      seq.forEach(function(b, i){
        var x = x0 + i * cw, filled = !game || i < st.idx;
        base(x, y1, cw, b, true); base(x, y2, cw, COMP[b], filled);
        if (filled){ var mx = x + cw / 2, ya = y1 + cw - 2, yb = y2, hbn = (b === "A" || b === "T") ? 2 : 3; hb += hbn; if (b === "G" || b === "C") gc++; comp += COMP[b];
          for (var q = 0; q < hbn; q++){ var dx = (q - (hbn - 1) / 2) * 5; S.draw.line(c, mx + dx, ya + 2, mx + dx, yb - 1, "#5f6b7a", 1.6, [3, 2]); } }
        if (game && i === st.idx) { S.draw.line(c, x + 2, y1 + cw + 4, x + cw - 2, y1 + cw + 4, B4.pal.red, 3); }
      });
      if (n === 0){ B4.txt(c, "Écris des bases A, T, G ou C", W / 2, H / 2, B4.pal.grey, 14); }
      var cnt = {A:0, T:0, G:0, C:0}; seq.forEach(function(b){ cnt[b]++; });
      var tot2 = n * 2;
      ro.set(0, n + " paires" ); ro.set(1, n ? S.fmt((game ? (function(){ var g = 0; for (var i = 0; i < n; i++) if (seq[i] === "G" || seq[i] === "C") g++; return g; })() : (cnt.G + cnt.C)) / n * 100, 0) + " %" : "—");
      ro.set(2, game ? hb + " (partiel)" : (cnt.A + cnt.T) * 2 + (cnt.G + cnt.C) * 3); ro.set(3, game ? comp + "…" : seq.map(function(b){ return COMP[b]; }).join(""));
      if (game) nt.set(st.done ? "Brin complété avec " + st.err + " erreur(s). Les deux brins sont complémentaires : A↔T (2 liaisons), G↔C (3 liaisons)." : (st.msg ? "<b>Non.</b> " + st.msg + " " : "") + "Quelle base s'apparie avec " + st.tpl[st.idx] + " ? Erreurs : " + st.err + ".", st.done ? "ok" : st.msg ? "warn" : "");
      else nt.set(bad ? "Seules les lettres A, T, G, C sont acceptées dans l'ADN : les autres sont ignorées (le U n'existe que dans l'ARN)." : n === 0 ? "Entre une séquence." : "Le brin 2 est le complément du brin 1 : " + seq.map(function(b){ return COMP[b]; }).join("") + ". Il y a " + (cnt.A + cnt.T) + " paires A–T (2 liaisons chacune) et " + (cnt.G + cnt.C) + " paires G–C (3 liaisons). Sur les deux brins ensemble : A = T = " + (cnt.A + cnt.T) + " et G = C = " + (cnt.G + cnt.C) + " (règle de Chargaff).", bad ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c08-meselson", ch:"c08", tag:"Expérience · original",
  titre:"Meselson et Stahl : la réplication est semi-conservative",
  resume:"Compare les trois modèles de réplication aux bandes d'ADN observées après centrifugation.",
  but:"Choisis un modèle et une génération : compare les bandes prévues avec les bandes observées, et regarde les brins anciens (rouge) et nouveaux (bleu).",
  aRetenir:"Réplication semi-conservative : chaque molécule fille contient un brin ancien et un brin nouveau. Après n générations dans un milieu « léger » (¹⁴N), on obtient 2ⁿ molécules dont 2 seulement sont hybrides. Seul ce modèle prévoit : 1 bande hybride à la 1re génération, puis 2 bandes (hybride et légère) à la 2e.",
  piege:"Le modèle conservatif est éliminé dès la 1re génération (il prévoirait 2 bandes, lourde et légère) ; le modèle dispersif dès la 2e (il prévoirait une seule bande de plus en plus légère). Ne confonds pas « hybride » (¹⁵N et ¹⁴N) et « mutant ».",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.0});
    var mod = k.seg("Modèle testé", [["s","Semi-conservatif"],["c","Conservatif"],["d","Dispersif"]], "s");
    var g = k.slider("Génération (dans ¹⁴N) pour le détail", 0, 4, 1, 2, "");
    var ro = k.readouts(["Molécules d'ADN", "Brins anciens (¹⁵N)", "Bandes prévues", "Verdict"]);
    var nt = k.note("", "");
    function bands(model, n){
      /* renvoie une liste de {pos: 0 (léger) à 1 (lourd), frac} */
      if (n === 0) return [{pos:1, frac:1}];
      if (model === "s"){ var h = 2 / Math.pow(2, n); return n === 1 ? [{pos:0.5, frac:1}] : [{pos:0.5, frac:h}, {pos:0, frac:1 - h}]; }
      if (model === "c"){ var f = 1 / Math.pow(2, n); return [{pos:1, frac:f}, {pos:0, frac:1 - f}]; }
      return [{pos:1 / Math.pow(2, n), frac:1}];
    }
    function same(a, b){ if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++){ if (Math.abs(a[i].pos - b[i].pos) > 0.02 || Math.abs(a[i].frac - b[i].frac) > 0.02) return false; } return true; }
    function sortb(a){ return a.slice().sort(function(x, y){ return y.pos - x.pos; }); }
    function tubes(y, hh, model, title, hl){
      var ctx = c.ctx, W = c.W, L = 16, R = 12, cw = (W - L - R) / 5;
      B4.txt(c, title, L, y - 14, B4.pal.ink, 12, "left");
      for (var n = 0; n <= 4; n++){
        var cx = L + (n + 0.5) * cw, bs = bands(model, n);
        B4.rr(c, cx - 13, y, 26, hh, 12, "#f8fafc", n === hl ? B4.pal.red : "#13233a", n === hl ? 3.5 : 1.6);
        bs.forEach(function(b){ var yy = y + hh * (0.18 + 0.7 * b.pos), th = 3 + 9 * b.frac; ctx.fillStyle = b.pos > 0.7 ? "#b42318" : b.pos > 0.3 ? "#5B21B6" : "#1e3f8f"; if (n === 0 || b.frac > 0) ctx.fillRect(cx - 12, yy - th / 2, 24, th); });
        B4.txt(c, "G" + n, cx, y + hh + 12, B4.pal.ink, 11);
      }
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, n = g.value, M = mod.value, hh = H * 0.15;
      tubes(32, hh, "s", "Observé (Meselson et Stahl)", n);
      tubes(32 + hh + 52, hh, M, "Prévu : modèle " + (M === "s" ? "semi-conservatif" : M === "c" ? "conservatif" : "dispersif"), n);
      /* molécules à la génération n */
      var my = 32 + 2 * hh + 100, mh = H * 0.14, cnt = Math.pow(2, n), cw = Math.min(34, (W - 24) / cnt);
      B4.txt(c, "Génération " + n + " : " + cnt + " molécule" + (cnt > 1 ? "s" : ""), 12, my - 14, B4.pal.ink, 12, "left"); B4.txt(c, "rouge = brin ancien (¹⁵N) · bleu = brin nouveau (¹⁴N)", 12, my + mh + 18, "#5f6b7a", 11, "left");
      var x0 = (W - cw * cnt) / 2;
      for (var i = 0; i < cnt; i++){
        var xa = x0 + i * cw + cw * 0.3, xb = x0 + i * cw + cw * 0.7;
        function strand(x, kind){
          if (kind === "r") S.draw.line(c, x, my, x, my + mh, "#b42318", 4);
          else if (kind === "b") S.draw.line(c, x, my, x, my + mh, "#1e3f8f", 4);
          else { var seg = 8, f = Math.round(seg / Math.pow(2, n)); for (var q = 0; q < seg; q++) S.draw.line(c, x, my + q * mh / seg, x, my + (q + 1) * mh / seg, (q * 7 % seg) < Math.max(f, n === 0 ? 8 : 0) ? "#b42318" : "#1e3f8f", 4); }
        }
        var ka, kb;
        if (n === 0){ ka = "r"; kb = "r"; }
        else if (M === "s"){ ka = i < 2 ? "r" : "b"; kb = "b"; }
        else if (M === "c"){ ka = i === 0 ? "r" : "b"; kb = i === 0 ? "r" : "b"; }
        else { ka = "m"; kb = "m"; }
        strand(xa, ka); strand(xb, kb);
      }
      var ob = sortb(bands("s", n)), pr = sortb(bands(M, n)), ok = same(ob, pr);
      var old = M === "s" ? (n === 0 ? 2 : 2) : M === "c" ? 2 : 2;
      ro.set(0, cnt); ro.set(1, n === 0 ? "2 (tous)" : (M === "d" ? "dispersés" : "2")); ro.set(2, pr.length + (pr.length > 1 ? " bandes" : " bande")); ro.set(3, ok ? "compatible" : "incompatible");
      nt.set(ok ? (M === "s" ? "Le modèle semi-conservatif prévoit exactement les bandes observées à toutes les générations. " : "À la génération " + n + ", ce modèle prévoit les mêmes bandes que l'observation : il faut regarder une autre génération pour le départager. ") + (n === 0 ? "Génération 0 : une molécule entièrement ancienne (¹⁵N). " : (M === "d" ? "Génération " + n + " : " + cnt + " molécules, toutes mêlant ancien et nouveau. " : "Génération " + n + " : " + cnt + " molécules, dont 2 contiennent un brin ancien. ")) + "(Tubes : bas = ADN lourd ¹⁵N, haut = léger ¹⁴N.)" : "Désaccord avec l'observation à la génération " + n + " : " + (M === "c" ? "ce modèle prévoit une bande lourde et une bande légère (pas de bande hybride)." : "ce modèle prévoit une seule bande de plus en plus légère, alors qu'on observe deux bandes.") + " Il est donc réfuté.", ok ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c08-caryotype", ch:"c08", tag:"Caryotype · comptage",
  titre:"Caryotype : chromosomes, chromatides et molécules d'ADN",
  resume:"Compte chromosomes et chromatides dans des cellules normales ou porteuses d'anomalies, avant et après réplication.",
  but:"Choisis la cellule et le stade (avant ou après réplication de l'ADN). Lis le nombre de chromosomes, de chromatides et de molécules d'ADN.",
  aRetenir:"Une cellule humaine somatique possède 46 chromosomes : 22 paires d'autosomes et 1 paire de chromosomes sexuels (XX ou XY). Les gamètes n'en ont que 23. Avant la réplication, chaque chromosome est formé d'une chromatide (1 molécule d'ADN) ; après, de deux chromatides sœurs : le nombre de chromosomes ne change pas, celui des chromatides double.",
  piege:"Ne confonds pas chromosome (une unité entière) et chromatide (une moitié de chromosome répliqué). 46 chromosomes à deux chromatides = 92 chromatides, pas 92 chromosomes.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var cell = k.select("Cellule", [["xx","Cellule de femme (46,XX)"],["xy","Cellule d'homme (46,XY)"],["t21","Trisomie 21 (47,XX,+21)"],["tur","Syndrome de Turner (45,X)"],["kli","Syndrome de Klinefelter (47,XXY)"],["ov","Ovule (23,X)"],["sp","Spermatozoïde (23,Y)"]], "xx");
    var rep = k.seg("Stade", [["0","Avant réplication (G1)"],["1","Après réplication (G2, début de mitose)"]], "0");
    var ro = k.readouts(["Chromosomes", "Chromatides", "Molécules d'ADN", "Quantité d'ADN"]);
    var nt = k.note("", "");
    var LEN = [1, .97, .8, .76, .74, .7, .65, .6, .58, .56, .55, .54, .48, .45, .44, .4, .38, .36, .31, .3, .24, .26];
    var DEF = {xx:{c:[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], sx:"XX", d:"46,XX"}, xy:{sx:"XY", d:"46,XY"}, t21:{sx:"XX", d:"47,XX,+21", extra:20}, tur:{sx:"X", d:"45,X"}, kli:{sx:"XXY", d:"47,XXY"}, ov:{sx:"X", d:"23,X", hap:true}, sp:{sx:"Y", d:"23,Y", hap:true}};
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, d = DEF[cell.value], hap = !!d.hap, r2 = rep.value === "1" && !hap, ncols = 12, cwid = (W - 16) / ncols, rowH = H * 0.44;
      var auto = 0, sexn = d.sx.length;
      function chrom(x, y, len, col){
        var h = len * rowH * 0.62;
        if (r2){ B4.rr(c, x - 5, y, 4, h, 2, col, null, 0); B4.rr(c, x + 1, y, 4, h, 2, col, null, 0); S.draw.dot(c, x, y + h * 0.4, 3, "#13233a"); }
        else { B4.rr(c, x - 2, y, 4, h, 2, col, null, 0); S.draw.dot(c, x, y + h * 0.4, 2.4, "#13233a"); }
      }
      for (var i = 0; i < 22; i++){
        var row = i < 12 ? 0 : 1, col = i < 12 ? i : i - 12, cx = 8 + (col + 0.5) * cwid, y = 14 + row * (rowH + 18), nco = hap ? 1 : (d.extra === i ? 3 : 2);
        for (var q = 0; q < nco; q++) chrom(cx + (q - (nco - 1) / 2) * (r2 ? 12 : 9), y, LEN[i], d.extra === i && q === 2 ? B4.pal.red : "#1e3f8f");
        auto += nco; B4.txt(c, i + 1 + "", cx, y + rowH * 0.62 + 12, "#5f6b7a", 11);
      }
      var sc = 8 + (10 + 0.5) * cwid, sy = 14 + (rowH + 18);
      B4.txt(c, "sexuels", 8 + 11.5 * cwid - 4, sy + rowH * 0.62 + 24, "#5f6b7a", 11);
      for (q = 0; q < sexn; q++){ var ch = d.sx[q]; chrom(8 + (10.2 + q * 0.5) * cwid + 2, sy + (ch === "Y" ? rowH * 0.3 * 0.62 : 0), ch === "X" ? 0.62 : 0.3, B4.pal.green); B4.txt(c, ch, 8 + (10.2 + q * 0.5) * cwid + 2, sy + rowH * 0.62 + 12, B4.pal.green, 12); }
      var nc = auto + sexn, nch = r2 ? 2 * nc : nc, ndna = nch, ploidy = hap ? "n = 23" : "2n";
      ro.set(0, nc); ro.set(1, nch); ro.set(2, ndna); ro.set(3, hap ? "1C (haploïde)" : r2 ? "4C" : "2C");
      var msg = "<b>" + d.d + ".</b> " + nc + " chromosomes";
      msg += hap ? " : un seul exemplaire de chaque (cellule haploïde, n = 23). " : " (" + auto + " autosomes + " + sexn + " sexuels). ";
      if (d.extra !== undefined) msg += "Trois exemplaires du chromosome 21 (en rouge) : trisomie 21. ";
      if (cell.value === "tur") msg += "Un seul chromosome sexuel X : syndrome de Turner. ";
      if (cell.value === "kli") msg += "Deux X et un Y : syndrome de Klinefelter. ";
      if (r2) msg += "Après réplication, chaque chromosome a 2 chromatides sœurs : " + nc + " chromosomes = " + nch + " chromatides = " + nch + " molécules d'ADN.";
      else msg += (hap ? "" : "Avant réplication, une chromatide par chromosome : " + nc + " chromatides.");
      nt.set(msg, d.extra !== undefined || cell.value === "tur" || cell.value === "kli" ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c08-genome", ch:"c08", tag:"Échelles · original",
  titre:"L'ADN bout à bout : quelle longueur ?",
  resume:"Compare la longueur d'ADN d'une cellule de plusieurs organismes à la taille de son noyau, puis mets-en bout à bout.",
  but:"Choisis un organisme et un nombre de cellules : lis la longueur d'ADN, le facteur de compaction et compare à des distances connues.",
  aRetenir:"Longueur d'ADN = nombre de paires de bases × 0,34 nm. Une cellule humaine contient ≈ 6,2·10⁹ paires de bases (2 jeux de 3,1·10⁹), soit ≈ 2 m d'ADN dans un noyau d'≈ 6 µm : l'ADN est compacté ≈ 350 000 fois, enroulé autour de protéines (histones) puis replié en chromosomes. Bout à bout, l'ADN des cellules d'un corps humain dépasse des centaines de fois la distance Terre–Soleil.",
  piege:"Ordres de grandeur seulement (valeurs arrondies, nombre de cellules du corps ≈ 4·10¹³). La taille du génome ne mesure pas la « complexité » d'un organisme.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var org = k.select("Organisme", [["ec","Bactérie E. coli (1 chromosome)"],["ye","Levure (cellule haploïde)"],["dm","Mouche drosophile (diploïde)"],["hu","Humain (diploïde)"]], "hu");
    var ne = k.slider("Nombre de cellules : 10 puissance", 0, 14, 1, 0, "");
    var ro = k.readouts(["Paires de bases par cellule", "ADN par cellule", "Compaction (ADN ÷ cellule/noyau)", "Longueur d'ADN totale"]);
    var nt = k.note("", "");
    var D = {ec:{n:"E. coli", bp:4.6e6, d:2e-6, lab:"bactérie (2 µm)"}, ye:{n:"levure", bp:1.2e7, d:5e-6, lab:"cellule (5 µm)"}, dm:{n:"drosophile", bp:2.8e8, d:5e-6, lab:"noyau (≈ 5 µm)"}, hu:{n:"humain", bp:6.2e9, d:6e-6, lab:"noyau (6 µm)"}};
    var BM = [["1 m", 1], ["tour de la Terre", 4.0e7], ["Terre–Lune", 3.84e8], ["Terre–Soleil", 1.5e11], ["Soleil–Neptune", 4.5e12]];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, d = D[org.value], Lc = d.bp * 0.34e-9, N = Math.pow(10, ne.value), Lt = Lc * N;
      var lo = -7, hi = 15, L = 14, Rr = W - 14;
      function PX(m){ return L + (Math.log10(m) - lo) / (hi - lo) * (Rr - L); }
      var ay = H * 0.34;
      S.draw.line(c, L, ay, Rr, ay, B4.pal.ink, 2);
      for (var e = lo; e <= hi; e += 2){ S.draw.line(c, PX(Math.pow(10, e)), ay - 5, PX(Math.pow(10, e)), ay + 5, B4.pal.ink, 1.5); B4.txt(c, "10" + (e < 0 ? "⁻" : "") + String(Math.abs(e)).replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }), PX(Math.pow(10, e)), ay + 18, "#5f6b7a", 11); }
      B4.txt(c, "longueur (m), échelle logarithmique", W / 2, ay + 38, "#5f6b7a", 12);
      S.draw.dot(c, PX(d.d), ay, 6, B4.pal.teal); B4.txt(c, d.lab, PX(d.d) + 4, ay - 30, B4.pal.teal, 12, "left"); S.draw.line(c, PX(d.d), ay - 24, PX(d.d), ay, B4.pal.teal, 1);
      S.draw.dot(c, PX(Lc), ay, 6, B4.pal.amber); B4.txt(c, "ADN d'une cellule", PX(Lc), ay - 58, B4.pal.amber, 12, Lc > 1e-2 ? "center" : "left"); S.draw.line(c, PX(Lc), ay - 52, PX(Lc), ay, B4.pal.amber, 1);
      S.draw.dot(c, PX(Lt), ay, 8, B4.pal.red); S.draw.line(c, PX(Lt), ay, PX(Lt), ay + 48, B4.pal.red, 2); B4.txt(c, "ADN de " + (N < 10 ? "1 cellule" : "10" + String(ne.value).replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }) + " cellules"), Math.min(W - 80, Math.max(80, PX(Lt))), ay + 58, B4.pal.red, 12);
      BM.forEach(function(b, i){ S.draw.line(c, PX(b[1]), ay - 4, PX(b[1]), ay + 5, B4.pal.green, 2.5); B4.txt(c, b[0], PX(b[1]), ay + 86 + i * 14, B4.pal.green, 11, i > 2 ? "right" : "left"); });
      var nbp = d.bp, comp = Lc / d.d, ratioSun = Lt / 1.5e11, txt;
      ro.set(0, S.sci(nbp, 2).replace(/<\/?sup>/g, function(t){ return t === "<sup>" ? "^" : ""; })); ro.set(1, B4.len(Lc)); ro.set(2, "× " + S.fmt(comp, 0)); ro.set(3, Lt >= 1e4 ? S.sci(Lt / 1000, 2) + " km" : B4.len(Lt));
      txt = "Chaque cellule de " + d.n + " renferme " + B4.len(Lc) + " d'ADN dans " + d.lab.replace(/\(.*\)/, "").trim() + " de " + (d.d * 1e6) + " µm : compaction ≈ " + S.fmt(comp, 0) + " fois. ";
      if (Lt > 1.5e11) txt += "Bout à bout, 10^" + ne.value + " cellules donneraient ≈ " + S.fmt(ratioSun, 0) + " fois la distance Terre–Soleil.";
      else if (Lt > 1) txt += "À cette échelle, la longueur dépasse déjà le mètre.";
      nt.set(txt, "");
    });
  }
});

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

/*B3D-ADD:b4-3d-adn*/
SFA.sim({
  id:"b4-3d-adn", ch:"c08", tag:"3D · réplication",
  titre:"La double hélice en 3D et sa réplication semi-conservative",
  resume:"Tourne la double hélice, puis fais avancer la fourche de réplication : une molécule devient deux molécules identiques.",
  but:"Glisse pour tourner la molécule. Avance la fourche (curseur ou lecture) : l'hélicase ouvre la double hélice, l'ADN polymérase construit un brin neuf (orange) en face de chaque brin ancien (bleu).",
  aRetenir:"L'ADN est une double hélice de deux brins antiparallèles unis par des paires de bases : A–T (2 liaisons) et G–C (3 liaisons). La réplication est semi-conservative : chaque molécule fille garde un brin ancien et reçoit un brin neuf. Les deux molécules filles sont identiques à la molécule mère, car chaque base ancienne impose sa base complémentaire.",
  piege:"« Semi-conservative » ne veut pas dire que la moitié de l'ADN est perdue : chaque molécule fille est complète (deux brins), mais un seul des deux est neuf. Et A ne s'apparie jamais avec C ni G avec T.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(440), cam = B.cam(0.5, 0.18, 8);
    var N = 30, DH = 0.2, R = 0.5, TW = 0.628, SEQ = "ATGCGTACCTAGGCATTCGAATGCCGTAAC";
    var COMP = {A:"T", T:"A", G:"C", C:"G"};
    var BASE = {A:B.hex("#2e9e5b"), T:B.hex("#d64545"), G:B.hex("#2563eb"), C:B.hex("#e0a100")};
    var OLD = B.hex("#1e3f8f"), NEW = B.hex("#ea7a1a"), NEU = B.hex("#64748b");
    var prog = k.slider("Avancement de la fourche", 0, 100, 1, 0, "%");
    var colo = k.toggle("Colorer brins anciens / neufs", true);
    var rot = k.toggle("Rotation automatique", true, function(v){ cam.auto = v; });
    var ro = k.readouts(["Paires de bases copiées", "Molécules filles", "Brins anciens par molécule"]);
    var nt = k.note("", "");
    var playing = false, free = [];
    for (var i = 0; i < 7; i++) free.push({ph:Math.random()*6.3, b:"ATGC"[i % 4]});
    k.button("Lecture / pause", function(){ playing = !playing; if (playing && prog.value >= 100) prog.set(0); }, true);
    k.button("Recommencer", function(){ prog.set(0); playing = false; });
    B.drag(c, cam, function(){ render(); });
    function yy(i){ return (N / 2 - i) * DH; }
    function pos(i, ang, shift){ return [R * Math.sin(ang) + shift, yy(i), -R * Math.cos(ang)]; }
    var tclock = 0;
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, c.H * 0.115, 4);
      var f = N - (prog.value / 100) * N;      /* indice de la fourche : i < f = ADN parent */
      var fi = Math.floor(f);
      var useCol = colo.value;
      var cOld1 = useCol ? OLD : NEU, cOld2 = useCol ? OLD : NEU, cNew = useCol ? NEW : NEU;
      function sep(i){ return i < f ? 0 : 1.15 * Math.min(1, (i - f) / 7); }
      var prev = {};
      for (var i = 0; i < N; i++){
        var a1 = -i * TW, a2 = a1 + Math.PI, s = sep(i), b1 = SEQ[i], b2 = COMP[b1];
        var p1 = pos(i, a1, -s), p2 = pos(i, a2, s);
        var par = i < f, open = (i >= f - 2 && i < f);
        /* brin ancien 1 et brin ancien 2 */
        var q1 = pos(i, a1, -s), q2 = pos(i, a2, par ? 0 : s);
        if (par){ q1 = pos(i, a1, 0); }
        var cur = {o1:q1, o2:q2};
        if (i > 0){
          sc.tube(prev.o1, cur.o1, 0.075, cOld1);
          sc.tube(prev.o2, cur.o2, 0.075, cOld2);
        }
        sc.sphere(cur.o1, 0.11, cOld1); sc.sphere(cur.o2, 0.11, cOld2);
        /* barreaux */
        if (par){
          var mid = [(q1[0] + q2[0]) / 2, q1[1], (q1[2] + q2[2]) / 2], g = open ? 0.28 : 0;
          var m1 = [q1[0] + (mid[0] - q1[0]) * (1 - g), q1[1], q1[2] + (mid[2] - q1[2]) * (1 - g)];
          var m2 = [q2[0] + (mid[0] - q2[0]) * (1 - g), q2[1], q2[2] + (mid[2] - q2[2]) * (1 - g)];
          if (g){ m1 = [q1[0] + (mid[0] - q1[0]) * 0.55, q1[1], q1[2] + (mid[2] - q1[2]) * 0.55]; m2 = [q2[0] + (mid[0] - q2[0]) * 0.55, q2[1], q2[2] + (mid[2] - q2[2]) * 0.55]; }
          sc.tube(q1, m1, 0.05, BASE[b1]); sc.tube(q2, m2, 0.05, BASE[b2]);
          if (!g){ sc.sphere(mid, 0.05, B.hex("#f8fafc")); }
        } else if (i >= f + 1){
          /* brins neufs : en face de chaque brin ancien */
          var n1 = pos(i, a2, -s), n2 = pos(i, a1, s);
          var pn = prev.n1 ? prev : null;
          if (prev.n1 && prev.ok){ sc.tube(prev.n1, n1, 0.075, cNew); sc.tube(prev.n2, n2, 0.075, cNew); }
          sc.sphere(n1, 0.11, cNew); sc.sphere(n2, 0.11, cNew);
          sc.tube(q1, [(q1[0] + n1[0]) / 2, q1[1], (q1[2] + n1[2]) / 2], 0.05, BASE[b1]);
          sc.tube(n1, [(q1[0] + n1[0]) / 2, q1[1], (q1[2] + n1[2]) / 2], 0.05, BASE[b2]);
          sc.tube(q2, [(q2[0] + n2[0]) / 2, q2[1], (q2[2] + n2[2]) / 2], 0.05, BASE[b2]);
          sc.tube(n2, [(q2[0] + n2[0]) / 2, q2[1], (q2[2] + n2[2]) / 2], 0.05, BASE[b1]);
          cur.n1 = n1; cur.n2 = n2; cur.ok = true;
        } else if (i >= f){
          /* juste derrière la fourche : bases exposées, nucléotides libres attendus */
          sc.tube(q1, [q1[0] + (-q1[0] * 0 + 0.0), q1[1], q1[2]], 0.01, BASE[b1]);
          var e1 = [q1[0] * 0.55 + (-s * 0.45), q1[1], q1[2] * 0.55], e2 = [q2[0] * 0.55 + (s * 0.45), q2[1], q2[2] * 0.55];
          sc.tube(q1, e1, 0.05, BASE[b1]); sc.tube(q2, e2, 0.05, BASE[b2]);
        }
        prev = cur;
      }
      /* nucléotides libres autour de la fourche + enzymes */
      if (prog.value > 0 && prog.value < 100){
        var fy = yy(f), fs = 0.0;
        for (var j = 0; j < free.length; j++){
          var fr = free[j], ang = fr.ph + tclock * 1.3, side = j % 2 ? 1 : -1;
          var P = [side * (1.25 + 0.35 * Math.sin(ang * 0.7)) + side * 0.2, fy - 0.45 - 0.25 * j % 1.2 - 0.2 * Math.sin(ang), 0.8 * Math.cos(ang)];
          sc.sphere(P, 0.1, BASE[fr.b], 0.9);
        }
        sc.sphere([0, fy + 0.18, 0], 0.34, B.hex("#8b5cf6"), 0.9);
        sc.label([0, fy + 0.18, 0], "hélicase", "#5b21b6", 12, 0, -26);
        sc.label([-1.25, fy - 0.9, 0], "ADN polymérase", "#b45309", 11, -4, 0, "right");
      }
      if (prog.value === 0) sc.label([0, yy(0) + 0.6, 0], "ADN parent", "#0f1b2d", 12, 0, 0);
      if (prog.value > 50){ sc.label([-1.6, yy(N - 1) - 0.4, 0], "molécule fille 1", "#1e3f8f", 12, 0, 0); sc.label([1.6, yy(N - 1) - 0.4, 0], "molécule fille 2", "#1e3f8f", 12, 0, 0); }
      sc.flush();
      /* légende */
      var ctx = c.ctx, lx = 12, ly = c.H - 64; ctx.save(); ctx.font = "700 11px Mulish,system-ui,sans-serif"; ctx.textBaseline = "middle";
      [["A", "#2e9e5b"], ["T", "#d64545"], ["G", "#2563eb"], ["C", "#e0a100"]].forEach(function(q, n){ ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(lx + 8 + n * 34, ly, 7, 0, 6.3); ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(q[0], lx + 8 + n * 34, ly + 1); });
      ctx.textAlign = "left"; ctx.fillStyle = "#1e3f8f"; ctx.fillText("■ brin ancien", lx, ly + 24); ctx.fillStyle = "#ea7a1a"; ctx.fillText("■ brin neuf", lx + 86, ly + 24);
      ctx.restore();
      B.hint(c);
      var done = Math.round(prog.value / 100 * N);
      ro.set(0, done + " / " + N); ro.set(1, prog.value >= 100 ? "2 (terminée)" : (prog.value === 0 ? "1 (mère)" : "en cours")); ro.set(2, "1 ancien + 1 neuf");
      if (prog.value === 0) nt.set("Avant la réplication : une seule molécule, deux brins complémentaires. Avance la fourche.", "");
      else if (prog.value < 100) nt.set("L'hélicase ouvre la double hélice. Face à chaque base ancienne, l'ADN polymérase place la base complémentaire (A–T, G–C). Regarde : les deux nouvelles molécules sont déjà identiques entre elles.", "");
      else nt.set("Réplication terminée : deux molécules identiques, chacune formée d'un brin ancien (bleu) et d'un brin neuf (orange). C'est le principe semi-conservatif (expérience de Meselson et Stahl).", "ok");
    }
    k.draw(render);
    var L = k.loop(function(dt){
      tclock += dt; B.spin(cam, dt);
      if (playing){ var v = prog.value + dt * 6; if (v >= 100){ v = 100; playing = false; } prog.set(v); }
      render();
    });
    L.play();
  }
});
/*B3D-ADD-END:b4-3d-adn*/
