/* Biologie BA1 · chapitre 7 : expression et perpétuation du génome */
(function(){
var CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", B = "UCAG";
function aaOf(c){ var i = B.indexOf(c[0]), j = B.indexOf(c[1]), l = B.indexOf(c[2]); return (i < 0 || j < 0 || l < 0) ? "?" : CODE[16 * i + 4 * j + l]; }
function codons(s){ var r = []; for (var i = 0; i + 2 < s.length; i += 3) r.push(s.substr(i, 3)); return r; }
function prot(cs){ var r = []; for (var i = 0; i < cs.length; i++){ var a = aaOf(cs[i]); r.push(a); if (a === "*") break; } return r; }
var AA3 = {F:"Phe",L:"Leu",S:"Ser",Y:"Tyr","*":"Stop",C:"Cys",W:"Trp",P:"Pro",H:"His",Q:"Gln",R:"Arg",I:"Ile",M:"Met",T:"Thr",N:"Asn",K:"Lys",V:"Val",A:"Ala",D:"Asp",E:"Glu",G:"Gly"};

/* 1. Traduction et mutations */
SFA.sim({
  id:"ub-c07-traduction-mutations", ch:"c07", tag:"Mutations",
  titre:"Lire le code : mutations ponctuelles et décalage du cadre",
  resume:"Mute un ARNm et classe : silencieuse, faux-sens, non-sens, décalage.",
  but:"Choisis un fragment d'ARNm, une mutation (substitution, insertion, délétion), sa position, et compare les protéines.",
  aRetenir:"Substitution : silencieuse (même acide aminé, code dégénéré), faux-sens (autre acide aminé) ou non-sens (codon stop prématuré). Insertion/délétion d'un nombre de nucléotides non multiple de 3 : décalage du cadre, tout l'aval change. Multiple de 3 : le cadre est conservé (acide aminé en plus ou en moins). Exemple réel : Glu→Val en position 6 de la β-globine (GAG→GUG) = drépanocytose (position 6 sans compter la Met initiale ; c'est le 7<sup>e</sup> codon du fragment ici, nucléotides 19 à 21).",
  piege:"Une mutation silencieuse change la séquence d'ADN mais pas la protéine (elle peut cependant affecter l'épissage ou la vitesse de traduction). Une substitution au 3<sup>e</sup> nucléotide d'un codon est le plus souvent silencieuse (dégénérescence), au 2<sup>e</sup> rarement. Le code est lu sur l'ARNm 5'→3' à partir de l'AUG.",
  build:function(k,S){
    var seqs = {
      a:{n:"Peptide fictif", s:"AUGGCUGAACGUAAAUUCGGACCUUGGAAGUGA"},
      b:{n:"Début de β-globine (fragment, stop ajouté)", s:"AUGGUGCACCUGACUCCUGAGGAGAAGUCUUAA"}
    };
    var c = k.canvas(300);
    var sel = k.select("Fragment d'ARNm", [["a",seqs.a.n],["b",seqs.b.n]], "b");
    var typ = k.seg("Mutation", [["s","Substitution"],["i","Insertion"],["d","Délétion"]], "s");
    var pos = k.slider("Position (nucléotide)", 1, 33, 1, 20, "");
    var base = k.select("Nucléotide", ["A","C","G","U"], "U");
    var sz = k.slider("Taille de l'indel", 1, 3, 1, 1, "nt");
    var ro = k.readouts(["Type","Protéine normale","Protéine mutée"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var s0 = seqs[sel.value].s, p = Math.min(pos.value, s0.length) - 1, t = typ.value, n = sz.value, b = base.value, s1;
      if (t === "s") s1 = s0.slice(0, p) + b + s0.slice(p + 1);
      else if (t === "i") s1 = s0.slice(0, p + 1) + new Array(n + 1).join(b) + s0.slice(p + 1);
      else s1 = s0.slice(0, p) + s0.slice(p + n);
      var c0 = codons(s0), c1 = codons(s1), p0 = prot(c0), p1 = prot(c1);
      var m = Math.max(p0.length, p1.length, 1), w = Math.min(56, (c.W - 70) / m), ctx = c.ctx;
      var rows = [["Normal", c0, p0, 70], ["Muté", c1, p1, 190]];
      rows.forEach(function(r){
        S.draw.text(c, r[0], 6, r[3] - 28, {align:"left", size:12});
        for (var i = 0; i < r[2].length; i++){
          var cdn = r[1][i], other = (r[0] === "Normal" ? c1 : c0)[i], pr = (r[0] === "Normal" ? p1 : p0)[i];
          var diff = cdn !== other, adiff = r[2][i] !== pr;
          ctx.fillStyle = adiff ? "#fdd8d4" : diff ? "#fff0c2" : "#eef2f8";
          ctx.fillRect(10 + i * w, r[3] - 18, w - 3, 66);
          S.draw.text(c, cdn, 10 + i * w + (w - 3) / 2, r[3], {size: w > 40 ? 13 : 10, math:true});
          S.draw.text(c, r[2][i] === "*" ? "Stop" : AA3[r[2][i]], 10 + i * w + (w - 3) / 2, r[3] + 26, {size: w > 40 ? 12 : 9});
        }
      });
      var res;
      if (t === "s"){
        var ci = Math.floor(p / 3), a0 = aaOf(c0[ci]), a1 = aaOf(c1[ci]);
        res = a0 === a1 ? "Silencieuse" : a1 === "*" ? "Non-sens" : a0 === "*" ? "Perte du stop" : "Faux-sens";
        if (s0[p] === b) res = "Aucun changement (même base)";
      } else res = n % 3 === 0 ? "Indel en phase (" + (t === "i" ? "+" : "−") + n / 3 + " acide aminé)" : "Décalage du cadre de lecture";
      var l0 = p0.length - (p0[p0.length - 1] === "*" ? 1 : 0), l1 = p1.length - (p1[p1.length - 1] === "*" ? 1 : 0);
      ro.set(0, res); ro.set(1, l0 + " aa"); ro.set(2, l1 + " aa" + (p1[p1.length - 1] === "*" ? "" : " (pas de stop)"));
      note.set(t !== "s" && n % 3 !== 0 ? "Décalage : tous les codons en aval changent ; un stop apparaît vite par hasard (3 codons stop sur 64)." : res === "Silencieuse" ? "Code dégénéré : plusieurs codons pour le même acide aminé." : res === "Faux-sens" ? "Un acide aminé est remplacé : l'effet dépend de sa position et de sa nature (ex. Glu→Val en β-globine)." : res === "Non-sens" ? "Codon stop prématuré : protéine tronquée, souvent dégradée (NMD)." : "Rouge = acide aminé différent, jaune = codon différent mais même acide aminé.", "ok");
    });
  }
});

/* 2. Réplication */
SFA.sim({
  id:"ub-c07-replication", ch:"c07", tag:"Réplication",
  titre:"Réplication : fourches, origines et fragments d'Okazaki",
  resume:"Combien de temps, combien d'origines, combien de fragments pour copier un génome ?",
  but:"Lance la réplication : les bulles s'ouvrent à partir de chaque origine et les fourches avancent. Choisis un organisme (ou règle les curseurs) : durée de réplication, origines nécessaires, nombre de fragments d'Okazaki.",
  aRetenir:"Une origine bidirectionnelle = 2 fourches. Durée t = G / (2·N·v), avec G taille répliquée (pb), N origines actives, v vitesse d'une fourche (nt/s). Brin avancé : synthèse continue ; brin retardé : fragments d'Okazaki (≈ 1 000 à 2 000 nt chez les procaryotes, ≈ 100 à 200 nt chez les eucaryotes), chacun amorcé par une amorce d'ARN. E. coli : une origine, ≈ 40 min ; humain : des milliers d'origines.",
  piege:"« Temps minimal » : il suppose que toutes les origines s'activent en même temps ; chez l'humain elles s'activent de façon échelonnée, la phase S dure ≈ 8 h et ≈ 30 000 à 50 000 origines sont utilisées. Les vitesses sont des ordres de grandeur.",
  build:function(k,S){
    var c = k.canvas(400), B = S.bio, pal = S.draw.palette, prog = 0, play = true;
    var org = k.seg("Organisme", [["e","E. coli"],["h","Cellule humaine (2n)"]], "e", function(v){
      if (v === "e"){ vit.set(1000); ori.set(1); frag.set(1500); } else { vit.set(50); ori.set(40000); frag.set(200); } prog = 0; play = true;
    });
    var vit = k.slider("Vitesse d'une fourche", 10, 1000, 10, 1000, "nt/s");
    var ori = k.slider("Origines actives", 1, 50000, 1, 1, "");
    var frag = k.slider("Taille d'un fragment d'Okazaki", 100, 2000, 100, 1500, "nt");
    var ro = k.readouts(["Durée minimale","Origines pour S = 8 h","Fragments d'Okazaki","Amorces d'ARN"]);
    function fmtT(t){ return t < 1 ? S.fmt(t * 1000, 1) + " ms" : t < 120 ? S.fmt(t, 1) + " s" : t < 7200 ? S.fmt(t / 60, 1) + " min" : S.fmt(t / 3600, 1) + " h"; }
    function fmtN(n){ return Math.round(n).toLocaleString("fr-BE"); }
    c.pointer(function(t, p){ if(t === "down" || t === "drag"){ play = false; prog = Math.max(0, Math.min(1, (p.x - 20) / (c.W - 40))); k.redraw(); } });
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear(); B.bg(c, "#fbfdff", "#eef3f9");
      var g = org.value === "e" ? 4.6e6 : 6.4e9, N = ori.value, v = vit.value, L = frag.value;
      var t = g / (2 * N * v), need = g / (2 * v * 28800), nfr = g / L, forks = 2 * N;
      if (play){ prog = Math.min(1, prog + dt / 5); if (prog >= 1) play = false; }
      var n = Math.min(N, 5), x0 = 24, x1 = W - 24, seg = (x1 - x0) / n, y = 118, th = 12;
      S.draw.text(c, n < N ? "Chromosome (" + n + " origines dessinées sur " + fmtN(N) + ")" : org.value === "e" ? "Chromosome circulaire d'E. coli (représenté à plat)" : "Un chromosome humain (représenté à plat)", x0, 20, {align:"left", size:11.5, color:pal.ink});
      /* ADN parental */
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y + 22); ctx.lineTo(x1, y + 22); ctx.stroke();
      for (var i = 0; i < n; i++){
        var cx = x0 + seg * (i + .5), half = seg / 2 * prog;
        /* bulle : deux brins parentaux écartés, brins fils */
        var bh = 16 * Math.min(1, prog * 6) + 4;
        if (half > 1){
          ctx.fillStyle = "#fbfdff"; ctx.fillRect(cx - half, y - 1, half * 2, 24);
          ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - half, y); ctx.quadraticCurveTo(cx, y - bh, cx + half, y); ctx.moveTo(cx - half, y + 22); ctx.quadraticCurveTo(cx, y + 22 + bh, cx + half, y + 22); ctx.stroke();
          /* brins fils : avancé vers la fourche, retardé en fragments */
          ctx.lineWidth = 3; ctx.strokeStyle = pal.green; ctx.beginPath(); ctx.moveTo(cx, y - bh * .5 + 2); ctx.lineTo(cx + half - 2, y - 2); ctx.stroke();
          ctx.strokeStyle = pal.green; ctx.beginPath(); ctx.moveTo(cx, y + 22 + bh * .5 - 2); ctx.lineTo(cx - half + 2, y + 24); ctx.stroke();
          var nf = Math.max(2, Math.min(14, Math.round(half / 14)));
          ctx.strokeStyle = pal.red; ctx.lineWidth = 3; for (var q = 0; q < nf; q++){ var u0 = (q + .1) / nf, u1 = (q + .85) / nf; ctx.beginPath(); ctx.moveTo(cx + half * u1, y - 3 - bh * .5 * (1 - u1) + 0); ctx.lineTo(cx + half * u0, y - 3 - bh * .5 * (1 - u0)); ctx.stroke(); }
          for (q = 0; q < nf; q++){ var w0 = (q + .1) / nf, w1 = (q + .85) / nf; ctx.beginPath(); ctx.moveTo(cx - half * w0, y + 25 + bh * .5 * (1 - w0)); ctx.lineTo(cx - half * w1, y + 25 + bh * .5 * (1 - w1)); ctx.stroke(); }
          B.ball(c, cx + half, y + 11, 6.5, pal.violet); B.ball(c, cx - half, y + 11, 6.5, pal.violet);
        }
        B.ball(c, cx, y + 11, 4.5, pal.amber); if (prog < .12) S.draw.label(c, "origine", cx, y + 46, {size:9.5, color:pal.amber});
      }
      /* légende */
      S.draw.legend(c, [[pal.green, "brin avancé (continu)"], [pal.red, "brin retardé : fragments d'Okazaki"], [pal.violet, "hélicase (fourche)"]], 14, 168, {box:false});
      /* barre durée */
      var by = H - 100, bw = W - 40, fr = Math.min(1, t / 28800);
      S.draw.text(c, "Durée comparée à la phase S (8 h)", 20, by - 12, {align:"left", size:12, color:pal.ink});
      ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, 20, by, bw, 18, 9); ctx.fill(); ctx.fillStyle = t <= 28800 ? pal.green : pal.red; S.draw.rrect(c, 20, by, Math.max(14, fr * bw), 18, 9); ctx.fill();
      S.draw.text(c, (t > 28800 ? "dépasse la phase S : " : "") + fmtT(t), fr > .6 ? 30 : 20 + fr * bw + 10, by + 9, {align:"left", size:11, color:fr > .6 ? "#fff" : pal.ink});
      /* curseur de lecture */
      var sx = 20 + prog * (W - 40); ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, 34); ctx.lineTo(sx, y - 14); ctx.stroke(); B.ball(c, sx, 32, 5, pal.acc);
      S.draw.label(c, "t = " + fmtT(t * prog) + " · " + Math.round(prog * 100) + " % copié · " + fmtN(nfr * prog) + " fragments", W / 2, H - 38, {size:11.5, color:pal.acc});
      S.draw.text(c, "Fourches actives : " + fmtN(forks), 20, H - 14, {align:"left", size:11.5, color:pal.ink});
      if (W > 560) S.draw.text(c, "glisse sur le schéma pour avancer dans le temps", W - 20, H - 14, {align:"right", size:10, color:pal.grey});
      ro.set(0, fmtT(t)); ro.set(1, Math.max(1, Math.ceil(need)).toLocaleString("fr-BE")); ro.set(2, fmtN(nfr)); ro.set(3, S.sci(nfr + forks, 2));
    }
    k.button("▶ Lancer la réplication", function(){ prog = 0; play = true; }, true);
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 3. Transcription et maturation */
SFA.sim({
  id:"ub-c07-maturation-arn", ch:"c07", tag:"Épissage",
  titre:"Maturation de l'ARN pré-messager : coiffe, épissage, queue poly(A)",
  resume:"Un gène de 5 exons : saut d'exon, cadre de lecture, stabilité de l'ARNm.",
  but:"Clique sur les exons 2 à 4 pour les sauter (ou utilise les interrupteurs), active la coiffe et la queue poly(A), puis regarde l'épissage se faire. Active la coiffe et la queue poly(A), saute des exons (épissage alternatif) et regarde la longueur et le cadre de lecture.",
  aRetenir:"Chez les eucaryotes, le pré-ARNm est coiffé en 5' (7-méthylguanosine), épissé (introns retirés par le splicéosome) et polyadénylé en 3'. Coiffe et queue poly(A) protègent l'ARNm de la dégradation et permettent l'initiation de la traduction. L'épissage alternatif produit plusieurs ARNm (donc protéines) à partir d'un gène ; un exon dont la longueur n'est pas multiple de 3 déplace le cadre de lecture s'il est sauté.",
  piege:"Les introns sont retirés, les exons conservés (« exons = expressed »). Le saut d'un exon de longueur multiple de 3 conserve le cadre ; sinon décalage. Gène didactique : longueurs choisies pour l'exercice, la partie 5' et 3' non traduite n'est pas séparée.",
  build:function(k,S){
    var c = k.canvas(330), B = S.bio;
    var ex = [120, 90, 100, 60, 209], intr = [1800, 2500, 900, 3200], pal = S.draw.palette;
    var cap = k.toggle("Coiffe 5'", true);
    var pa = k.slider("Queue poly(A)", 0, 250, 10, 200, "nt");
    var sk = [2, 3, 4].map(function(i){ return k.toggle("Sauter l'exon " + i, false); });
    var ro = k.readouts(["Pré-ARNm","ARNm mature","Cadre de lecture","Stabilité"]);
    var note = k.note("", "ok"), sp = 1, lastKey = "", boxes = [];
    var COL = [pal.acc, pal.teal, pal.violet, pal.green, pal.amber];
    function key(){ return [cap.value, pa.value, sk[0].value, sk[1].value, sk[2].value].join(); }
    c.pointer(function(t, p){ if(t === "down") boxes.forEach(function(b){ if(p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h && b.i >= 1 && b.i <= 3){ sk[b.i - 1].set(!sk[b.i - 1].value); sp = 0; k.redraw(); } }); });
    function run(){ sp = 0; }
    function frame(dt){
      var ctx = c.ctx, W = c.W; c.clear(); B.bg(c, "#fbfdff", "#eef3f9");
      var kk = key(); if(kk !== lastKey){ lastKey = kk; sp = 0; }
      sp = Math.min(1, sp + dt * .55); var e = sp < .5 ? 2 * sp * sp : 1 - Math.pow(-2 * sp + 2, 2) / 2;
      var inc = [true, !sk[0].value, !sk[1].value, !sk[2].value, true], len = 0, tot = 0, i;
      for (i = 0; i < 5; i++){ tot += ex[i]; if (inc[i]) len += ex[i]; } for (i = 0; i < 4; i++) tot += intr[i];
      var m = 24, gap = Math.max(26, W * .07), avail = W - 2 * m - 4 * gap, sq = ex.map(function(v){ return Math.sqrt(v); }), ss = sq.reduce(function(a, b){ return a + b; }, 0);
      var bw = sq.map(function(s){ return s / ss * avail; });
      var yT = 78, yB = 220, h = 38;
      boxes = [];
      S.draw.text(c, "Pré-ARNm (transcrit du gène)", m, 24, {align:"left", size:12, color:pal.ink});
      /* pré-ARNm */
      var x = m + 20, px = [];
      for (i = 0; i < 5; i++){ px.push(x); x += bw[i] + gap; }
      var capR = 9;
      ctx.save(); ctx.fillStyle = pal.amber; ctx.beginPath(); ctx.arc(m + 9, yT + h / 2, capR, 0, 7); ctx.fill(); ctx.restore(); S.draw.text(c, "m⁷G", m + 9, yT + h / 2, {size:7.5, color:"#fff"});
      for (i = 0; i < 5; i++){
        if (i < 4){ ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px[i] + bw[i], yT + h / 2); ctx.lineTo(px[i + 1], yT + h / 2); ctx.stroke(); S.draw.label(c, W < 520 ? "i" + (i + 1) : "intron " + (i + 1) + " · " + intr[i], px[i] + bw[i] + gap / 2, yT - 14, {size:9, color:pal.grey}); }
        ctx.fillStyle = COL[i]; S.draw.rrect(c, px[i], yT, bw[i], h, 7); ctx.fill();
        S.draw.text(c, "E" + (i + 1), px[i] + bw[i] / 2, yT + 13, {size:12, color:"#fff"}); S.draw.text(c, ex[i] + " nt", px[i] + bw[i] / 2, yT + 28, {size:9.5, color:"#fff", weight:600});
        boxes.push({x:px[i], y:yT, w:bw[i], h:h, i:i});
        if (i >= 1 && i <= 3 && !inc[i]){ S.draw.text(c, "sauté", px[i] + bw[i] / 2, yT + h + 12, {size:10, color:pal.red}); }
      }
      /* flèche d'épissage */
      S.draw.arrow(c, W / 2, yT + h + 30, W / 2, yB - 54, pal.grey, 2); S.draw.label(c, "épissage + coiffe + polyadénylation", W / 2, (yT + yB) / 2 - 8 + 8, {size:10.5, color:pal.grey});
      /* ARNm : mise en place animée */
      var tx = m + 28, mpos = [], tw = 0; for (i = 0; i < 5; i++) if (inc[i]) tw += bw[i];
      var x2 = Math.max(m + 26, (W - tw) / 2 - (cap.value ? 8 : 0) - 40); var xm = x2;
      for (i = 0; i < 5; i++){ mpos.push(xm); if (inc[i]) xm += bw[i]; }
      S.draw.text(c, "ARNm mature", m, yB - 40, {align:"left", size:12, color:pal.ink});
      /* introns qui se détachent (boucle) */
      for (i = 0; i < 4; i++){ var ix0 = px[i] + bw[i], ix1 = px[i + 1], mid = (ix0 + ix1) / 2, hh = 6 + 26 * e;
        ctx.save(); ctx.globalAlpha = 1 - e * .85; ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(mid + (px[i + 1] - px[i]) * (1 - e) * 0 , yT + h + 4 + hh * 0, 0, 0, 0, 0, 0); ctx.restore(); }
      ctx.save(); for (i = 0; i < 5; i++){
        var gx = px[i], tx2 = mpos[i], cx2 = gx + (tx2 - gx) * e, yy = yB + (yT - yB) * 0, drop = inc[i] ? 0 : e * 22;
        ctx.globalAlpha = inc[i] ? 1 : 1 - e * .85;
        ctx.fillStyle = COL[i]; S.draw.rrect(c, cx2, yB + drop, bw[i], h, 7); ctx.fill();
        S.draw.text(c, "E" + (i + 1), cx2 + bw[i] / 2, yB + drop + 13, {size:12, color:"#fff"}); S.draw.text(c, ex[i] + " nt", cx2 + bw[i] / 2, yB + drop + 28, {size:9.5, color:"#fff", weight:600});
        if (i < 4){ var a0 = px[i] + bw[i] + (mpos[i] + bw[i] - px[i] - bw[i]) * 0, ia = a0 + (inc[i] ? 0 : 0); ctx.globalAlpha = Math.max(0, 1 - e * 1.4); ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx2 + bw[i], yB + h / 2); ctx.lineTo(px[i + 1] + (mpos[i + 1] - px[i + 1]) * e, yB + h / 2); ctx.stroke(); }
      } ctx.restore();
      /* coiffe + queue à l'état final */
      var fin = e; ctx.save(); ctx.globalAlpha = cap.value ? 1 : .18; ctx.fillStyle = pal.amber; ctx.beginPath(); ctx.arc(x2 - 12 + (m + 9 - (x2 - 12)) * (1 - e), yB + h / 2, capR, 0, 7); ctx.fill(); ctx.restore();
      S.draw.text(c, cap.value ? "m⁷G" : "✕", x2 - 12 + (m + 9 - (x2 - 12)) * (1 - e), yB + h / 2, {size:7.5, color:"#fff"});
      var nA = Math.round(pa.value / 250 * 14); for (i = 0; i < nA; i++){ ctx.globalAlpha = e; S.draw.text(c, "A", x2 + tw + 10 + i * Math.min(9, (W - (x2 + tw + 10) - 8) / Math.max(1, nA)), yB + h / 2 + 1, {size:11, color:pal.green}); ctx.globalAlpha = 1; }
      var ok = len % 3 === 0, stable = cap.value && pa.value >= 30;
      var codons = len / 3;
      /* règle de cadre : codons */
      if (e > .9){ ctx.save(); ctx.globalAlpha = (e - .9) * 10; var nn = Math.floor(len / 3); for (var q = 0; q < Math.min(nn, 80); q++){ var cxn = x2 + (q * 3 + 1.5) / len * tw; ctx.fillStyle = q % 2 ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.0)"; } ctx.restore(); }
      S.draw.label(c, "ARNm : " + len + " nt " + (ok ? "(= " + (len / 3) + " codons)" : "(" + len % 3 + " nt hors codon : cadre décalé)"), W / 2, c.H - 18, {size:11, color:ok ? pal.green : pal.red});
      ro.set(0, tot + " nt"); ro.set(1, len + " nt"); ro.set(2, ok ? "conservé (" + (len - 3) / 3 + " aa)" : "décalé"); ro.set(3, !cap.value ? "traduction impossible" : stable ? "stable" : "labile");
      note.set(!ok ? "Longueur non multiple de 3 : décalage du cadre, protéine aberrante probable." : !cap.value ? "Sans coiffe, les ribosomes ne se fixent pas et l'ARNm est vite dégradé par les exonucléases 5'→3'." : pa.value < 30 ? "Queue poly(A) courte : l'ARNm est dégradé rapidement (désadénylation)." : "ARNm complet : traduisible, stable.", ok && stable ? "ok" : "warn");
    }
    k.button("▶ Rejouer l'épissage", run, true);
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 4. Opéron lac */
SFA.sim({
  id:"ub-c07-operon-lac", ch:"c07", tag:"Régulation",
  titre:"L'opéron lactose : induction, répression, mutants",
  resume:"Lactose, glucose et mutants lacI, lacO, lacP, lacZ : niveau d'expression.",
  but:"Choisis la souche, la présence de lactose et de glucose, puis lis le niveau de β-galactosidase.",
  aRetenir:"Le répresseur LacI se fixe à l'opérateur et bloque l'ARN polymérase ; l'allolactose (dérivé du lactose) l'inactive : induction. Le complexe CAP–AMPc, présent quand le glucose manque, stimule la transcription : répression catabolique. Expression maximale = lactose présent ET glucose absent. Mutants : lacI⁻ constitutif ; lacI<sup>s</sup> (super-répresseur, insensible à l'allolactose) jamais induit ; lacO<sup>c</sup> constitutif (cis-dominant) ; lacP⁻ jamais exprimé.",
  piege:"Le lactose ne se fixe pas directement sur le répresseur : c'est l'allolactose. Glucose + lactose : l'opéron n'est que faiblement exprimé. Niveaux donnés en unités relatives qualitatives (répression ≈ 1, induction maximale ≈ 100).",
  build:function(k,S){
    var c = k.canvas(360), pal = S.draw.palette, B = S.bio, tt = 0, mol = [], rnd = Math.random;
    for (var q = 0; q < 26; q++) mol.push({x:rnd(), y:rnd(), vx:rnd() - .5, vy:rnd() - .5});
    var st = k.select("Souche", [["wt","Sauvage"],["I-","lacI⁻ (répresseur inactif)"],["Is","lacIˢ (super-répresseur)"],["Oc","lacOᶜ (opérateur muté)"],["P-","lacP⁻ (promoteur muté)"],["Z-","lacZ⁻ (gène de la β-galactosidase muté)"]], "wt");
    var lac = k.toggle("Lactose présent", true);
    var glu = k.toggle("Glucose présent", false);
    var ro = k.readouts(["Répresseur sur l'opérateur","CAP–AMPc","β-galactosidase"]);
    var note = k.note("", "ok");
    function model(){ var m = st.value, cap = !glu.value;
      var repActive = (m === "I-") ? false : (m === "Is") ? true : !lac.value, opOk = m !== "Oc", bound = repActive && opOk;
      var tr = (m === "P-") ? 0 : bound ? 1 : (cap ? 100 : 5); return {m:m, cap:cap, bound:bound, tr:tr, lev:m === "Z-" ? 0 : tr, repActive:repActive}; }
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H, M = model(), m = M.m, tr = M.tr, lev = M.lev; tt += dt; c.clear();
      B.bg(c, "#fbfdff", "#eef3f9");
      ctx.fillStyle = "rgba(190,230,205,.22)"; S.draw.rrect(c, 8, 8, W - 16, H - 16, 18); ctx.fill();
      S.draw.text(c, "Cytoplasme de la bactérie", 18, 22, {align:"left", size:11, color:pal.grey});
      /* ADN */
      var small = W < 520, sc = Math.min(1, (W - 20) / 520), y = H * .5, x0 = Math.max(10, (W - 500 * sc) / 2);
      var parts = [["lacI",70,"#8a95a3"],["P",34,m === "P-" ? pal.red : pal.amber],["O",30,m === "Oc" ? pal.red : pal.violet],["lacZ",90,m === "Z-" ? pal.red : pal.green],["lacY",72,pal.teal],["lacA",72,pal.teal]], x = x0;
      ctx.strokeStyle = "#5b6b80"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 4, y + 22); ctx.lineTo(x0 + 400 * sc + 80, y + 22); ctx.stroke();
      parts.forEach(function(p){ var w = p[1] * sc; ctx.fillStyle = p[2]; S.draw.rrect(c, x, y, w, 22, 5); ctx.fill(); S.draw.text(c, p[0], x + w / 2, y + 11, {color:"#fff", size:small ? 9.5 : 11}); p[3] = x; p[4] = w; x += w + 5 * sc; });
      var xP = parts[1][3] + parts[1][4] / 2, xO = parts[2][3] + parts[2][4] / 2, xZ = parts[3][3], xEnd = parts[5][3] + parts[5][4];
      /* CAP */
      if (M.cap && m !== "P-"){ var cx = parts[1][3] - 12 * sc; ctx.fillStyle = pal.green; ctx.beginPath(); ctx.moveTo(cx - 9, y - 6); ctx.lineTo(cx + 9, y - 6); ctx.lineTo(cx, y - 24); ctx.closePath(); ctx.fill(); S.draw.text(c, "CAP", cx, y - 10, {size:8, color:"#fff"}); B.ball(c, cx + 12, y - 28, 4, pal.amber); S.draw.text(c, "AMPc", cx + 20, y - 36, {size:9, color:pal.green, align:"left"}); }
      /* répresseur */
      var bound = M.bound;
      function repressor(rx, ry, act, ally){ B.ball(c, rx - 9, ry, 10, pal.red); B.ball(c, rx + 9, ry, 10, pal.red); B.ball(c, rx, ry - 9, 9, B.mix(pal.red, .15)); S.draw.text(c, "LacI", rx, ry + 1, {size:8.5, color:"#fff"}); if (ally) B.ball(c, rx + 16, ry - 13, 4.2, pal.pink); }
      if (bound){ repressor(xO, y - 16, true, false); S.draw.label(c, "LacI bloque l'opérateur", xO, y - 48 - (M.cap ? 10 : 0), {size:10.5, color:pal.red}); }
      else if (m !== "Oc" || true){
        var fl = m === "I-" ? .0 : 1; if (m !== "I-"){ var rx = xO + 30 + 60 * ((tt * .25) % 1), ry = y - 60 - 8 * Math.sin(tt * 2); if (!M.repActive || true) repressor(Math.min(rx, W - 30), ry, false, lac.value && m !== "Is"); S.draw.text(c, lac.value && m !== "Is" ? "répresseur + allolactose : décroché" : m === "Oc" ? "LacI libre (l'opérateur muté ne le fixe plus)" : "répresseur libre", Math.min(W - 10, rx + 24), ry - 18, {size:9.5, color:pal.red, align:"left"}); }
        else S.draw.text(c, "LacI non fonctionnel", xO + 20, y - 52, {size:10, color:pal.grey});
      }
      /* ARN polymérase + ARNm */
      if (m === "P-"){ S.draw.text(c, "l'ARN polymérase ne reconnaît plus le promoteur", xP, y + 58, {size:10.5, color:pal.red}); B.ball(c, xP - 12, y + 40, 12, "#9aa6b6"); }
      else if (tr <= 1){ B.ball(c, xP - 4, y + 40, 12, pal.acc); ctx.save(); ctx.strokeStyle = pal.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xO + 4, y + 30); ctx.lineTo(xO + 4, y + 52); ctx.stroke(); ctx.restore(); S.draw.text(c, "ARN polymérase bloquée", xP, y + 66, {size:10.5, color:pal.red}); }
      else { var span = xEnd - xP, u = (tt * (tr > 5 ? .35 : .12)) % 1, px = xP + span * u; B.ball(c, px, y + 36, 12, pal.acc);
        ctx.strokeStyle = pal.green; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xP, y + 36); for (var xx = xP; xx < px - 8; xx += 4) ctx.lineTo(xx, y + 36 + 9 * Math.sin(xx * .28 + 1) * ((xx - xP) / span + .2)); ctx.stroke();
        S.draw.text(c, tr > 5 ? "transcription forte" : "transcription faible", xP, y + 70, {size:10.5, color:pal.acc, align:"left"}); }
      /* molécules : lactose, glucose */
      mol.forEach(function(p, i){ p.x += p.vx * dt * .07; p.y += p.vy * dt * .07; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; p.vx += (rnd() - .5) * dt * 2; p.vy += (rnd() - .5) * dt * 2;
        var px = 20 + p.x * (W - 40), py = H - 90 + p.y * 56; if (i < 10 && lac.value){ ctx.save(); ctx.fillStyle = pal.pink; ctx.translate(px, py); ctx.beginPath(); ctx.rect(-5, -5, 10, 10); ctx.fill(); ctx.restore(); } else if (i >= 10 && i < 18 && glu.value){ ctx.save(); ctx.translate(px, py); ctx.fillStyle = pal.amber; ctx.beginPath(); for (var a = 0; a < 6; a++) ctx.lineTo(6 * Math.cos(a * 1.047), 6 * Math.sin(a * 1.047)); ctx.fill(); ctx.restore(); }
        else if (i >= 18 && lev > 0 && i - 18 < Math.round(lev / 100 * 8) + (lev > 0 ? 1 : 0)){ B.ball(c, px, py, 6, pal.green, {text:"β", size:8}); } });
      var lg = [[pal.pink, "lactose"], [pal.amber, "glucose"], [pal.green, "β-galactosidase"]]; var lx = 18; lg.forEach(function(q){ ctx.fillStyle = q[0]; ctx.fillRect(lx, H - 24, 9, 9); S.draw.text(c, q[1], lx + 14, H - 19, {size:10, color:pal.ink, align:"left"}); lx += 28 + q[1].length * 6; });
      S.draw.label(c, "β-galactosidase : " + S.fmt(lev, 0) + " / 100", W - 18, W < 520 ? H - 44 : H - 19, {align:"right", size:11, color:lev > 20 ? pal.green : lev > 0 ? pal.amber : pal.grey});
      ro.set(0, bound ? "oui" : "non"); ro.set(1, M.cap && m !== "P-" ? "oui (glucose absent)" : "non"); ro.set(2, S.fmt(lev, 0) + " / 100");
      note.set(m === "Z-" ? "lacZ⁻ : l'opéron est transcrit comme chez le sauvage, mais la β-galactosidase est inactive (la perméase lacY et la transacétylase lacA peuvent encore être faites)." : m === "P-" ? "lacP⁻ : l'ARN polymérase ne reconnaît pas le promoteur, aucune expression." : lev === 100 ? (m === "wt" ? "Lactose présent ET glucose absent : induction maximale." : "Expression constitutive : le répresseur ne bloque plus l'opérateur (mutation), et sans glucose CAP–AMPc stimule la transcription : expression maximale même sans lactose.") : lev === 5 ? "Pas de répression par LacI, mais sans CAP–AMPc (glucose présent) la transcription reste faible." : "Opérateur occupé par le répresseur : expression basale.", "ok");
    }
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 5. PCR et électrophorèse */
SFA.sim({
  id:"ub-c07-pcr-gel", ch:"c07", tag:"Technique",
  titre:"PCR et gel d'agarose",
  resume:"Copies après n cycles, efficacité, plateau, position de la bande sur un gel.",
  but:"Règle le nombre de cycles, l'efficacité et la taille de l'amplicon : lis le nombre de copies et la position de la bande sur le gel.",
  aRetenir:"Si l'efficacité vaut E (1 = 100 %), N<sub>n</sub> = N<sub>0</sub>(1 + E)<sup>n</sup> ; à E = 1, N<sub>n</sub> = N<sub>0</sub>·2<sup>n</sup> (30 cycles ≈ 10<sup>9</sup> fois). Un cycle : dénaturation (≈ 95 °C), hybridation des amorces, élongation par une polymérase thermostable. Sur gel, les fragments migrent vers le pôle + (ADN chargé −) ; la distance parcourue est approximativement linéaire en log(taille) : les petits fragments migrent le plus loin.",
  piege:"La PCR amplifie exponentiellement au début, puis atteint un plateau (réactifs limitants) : on ne peut pas retrouver la quantité de départ à partir d'une bande au plateau. Contamination : de très petites quantités d'ADN étranger sont amplifiées. Modèle simplifié, plateau fixé à 10<sup>12</sup> copies.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var n0 = k.slider("Copies initiales (puissance de 10)", 0, 6, 1, 3, "");
    var cy = k.slider("Nombre de cycles", 0, 40, 1, 30, "");
    var ef = k.slider("Efficacité", 70, 100, 5, 100, "%");
    var sz = k.slider("Taille de l'amplicon", 100, 2000, 100, 500, "pb");
    var ro = k.readouts(["Copies après n cycles","Facteur d'amplification","Bande visible ?"]);
    k.draw(function(){
      c.clear();
      var N0 = Math.pow(10, n0.value), E = ef.value / 100, plat = 1e12, N = N0, i, hist = [N0];
      for (i = 0; i < cy.value; i++){ N = N + E * N * (1 - N / plat); hist.push(N); }
      var gx = 20, gw = 110, ctx = c.ctx;
      ctx.fillStyle = "#13233a"; ctx.fillRect(gx, 20, gw, 260);
      var ladder = [100, 200, 300, 500, 750, 1000, 1500, 2000, 3000];
      function ypos(s){ return 30 + (Math.log10(3000) - Math.log10(s)) / (Math.log10(3000) - Math.log10(100)) * 230; }
      ladder.forEach(function(s){ var y = ypos(s); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(gx + 8, y, 30, 3); S.draw.text(c, s + "", gx + 44, y + 1, {align:"left", size:9, color:"#9fb3c8", weight:600}); });
      var vis = N > 1e10, br = Math.min(1, Math.max(0, (Math.log10(Math.max(N, 1)) - 10) / 2));
      S.draw.text(c, "échelle", gx + 24, 12, {size:10, color:pal.grey}); S.draw.text(c, "PCR", gx + 82, 12, {size:10, color:pal.grey});
      if (vis){ ctx.fillStyle = "rgba(255,170,60," + (0.3 + 0.7 * br) + ")"; ctx.fillRect(gx + 68, ypos(sz.value), 34, 5); }
      S.draw.text(c, "−", gx + gw + 8, 30, {size:14}); S.draw.text(c, "+", gx + gw + 8, 270, {size:14});
      var ax = S.draw.axes(c, {x0:0, x1:40, y0:0, y1:12, l:190, xl:"cycles", yl:"log₁₀(copies)", stepX:10, stepY:2, t:16, b:34});
      c.ctx.save(); c.ctx.beginPath(); c.ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); c.ctx.clip();
      c.ctx.strokeStyle = pal.acc; c.ctx.lineWidth = 2.5; c.ctx.beginPath();
      hist.forEach(function(h, j){ var X = ax.X(j), Y = ax.Y(Math.log10(Math.max(h, 1))); if (j === 0) c.ctx.moveTo(X, Y); else c.ctx.lineTo(X, Y); });
      c.ctx.stroke(); c.ctx.restore();
      S.draw.dot(c, ax.X(cy.value), ax.Y(Math.log10(Math.max(N, 1))), 5, pal.red);
      ro.set(0, S.sci(N, 2)); ro.set(1, N0 > 0 ? "×" + S.sci(N / N0, 2) : "—"); ro.set(2, vis ? "oui (> 10¹⁰ copies)" : "non");
    });
  }
});
})();









/* BIO3D-BEGIN:s_c07_adn.js */
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
  id:"ub-c07-3d-adn-fourche-replication", ch:"c07", tag:"ADN · 3D",
  titre:"La double hélice d'ADN en 3D et la fourche de réplication",
  resume:"Une hélice qui tourne et se réplique : hélicase, brin continu, fragments d'Okazaki, amorces d'ARN, ligase. Semi-conservatif.",
  but:"Fais tourner la double hélice, compare procaryote et eucaryote, retire la ligase ou masque les amorces, et lis combien de tours l'hélicase doit dérouler par seconde.",
  aRetenir:"La double hélice (pas de 3,4 nm, 10,5 pb par tour, deux brins antiparallèles) s'ouvre sous l'hélicase. Les ADN polymérases n'allongent qu'en 5'→3' et à partir d'une amorce d'ARN : un brin est synthétisé en continu (brin avancé), l'autre en fragments d'Okazaki (≈ 1 000 à 2 000 nt chez les procaryotes, 100 à 200 chez les eucaryotes) : amorces retirées, trous comblés, coupures scellées par l'ADN ligase. Chaque ADN fille garde un brin parental : réplication semi-conservative (Meselson et Stahl).",
  piege:"La polymérase ne peut pas démarrer seule : sans amorce d'ARN (primase), pas de réplication. Et les fragments d'Okazaki ne sont pas sur « l'autre côté » par magie : ils sont dus à l'orientation 5'→3' de la polymérase face à un brin matrice antiparallèle. Vitesse et longueur d'animation non à l'échelle ; seuls le pas de l'hélice (10,5 pb) et les rapports de taille des fragments sont respectés.",
  build:function(k,S){
    var c = k.canvas(420), pal = P(S), v = V3(c, S, {yaw:0.35, pit:0.28, D:11, sc:48});
    var org = k.seg("Organisme", [["p","Procaryote"],["e","Eucaryote"]], "p");
    var spd = k.slider("Vitesse d'animation", 0, 2, 0.1, 1, "×");
    var lig = k.toggle("ADN ligase active", true);
    var prim = k.toggle("Montrer les amorces d'ARN", true);
    var bas = k.toggle("Montrer les bases (A, T, G, C)", true);
    var ro = k.readouts(["Vitesse de la fourche", "Tours déroulés / s", "Taille d'un fragment", "Fragments / s"]);
    var info = k.note("", "ok");
    var DS = 1.5 / 10.5, K = 2 * Math.PI / 1.5, RP = 0.34, RD = 0.3, L = 3.3, AL = 0.62;
    var s0 = 0, tt = 0, ca = Math.cos(AL), sa = Math.sin(AL);
    var BC = ["#22c55e", "#eab308", "#0ea5e9", "#f472b6"], BN = ["A", "T", "G", "C"];
    function base(j){ var x = Math.sin(j * 12.9898 + 1.7) * 43758.5453; return Math.floor((x - Math.floor(x)) * 4); }
    /* position d'un point à l'abscisse s sur l'axe, angle th, pour l'hélice d'un tronçon (0 parent, 1 fille A, 2 fille B) */
    function pt(seg, s, th, r){
      var cs = Math.cos(th), sn = Math.sin(th);
      if (seg === 0) return [s, r * cs, r * sn];
      var dy = seg === 1 ? sa : -sa, d = [ca, dy, 0], u = [0, 0, 1], w = [dy, -ca, 0];   /* w = d × u */
      if (seg === 2){ w = [-sa * -1 * 0 + (-sa) * 1 * 0 + (-sa), -ca, 0]; w = [-sa, -ca, 0]; w = [ -sa, -ca, 0 ]; w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], 0]; }
      else w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], 0];
      return [d[0] * s + r * (cs * u[0] + sn * w[0]), d[1] * s + r * (cs * u[1] + sn * w[1]), d[2] * s + r * (cs * u[2] + sn * w[2])];
    }
    function R(){
      c.clear(); v.sc = Math.min(58, c.W / 8.2); v.ox = -8;
      var Lf = org.value === "p" ? 1.5 : 0.5, pl = 0.3, cph = (s0 / Lf) % 1;
      var COLP1 = "#1e3f8f", COLP2 = "#0e7490", NEWL = "#dc2626", NEWD = "#f97316", PRIM = "#a21caf";
      /* troncs : 0 parent (s<0), 1 fille A (s>0), 2 fille B (s>0) */
      [0, 1, 2].forEach(function(sg){
        var smin = sg === 0 ? -L : 0.02, smax = sg === 0 ? -0.02 : L;
        var jmin = Math.ceil((smin - s0) / DS), jmax = Math.floor((smax - s0) / DS);
        var prev = {};
        for (var j = jmin; j <= jmax; j++){
          var s = j * DS + s0, th = K * j * DS, r = sg === 0 ? RP : RD, b = base(j);
          /* brin 1 (angle th) et brin 2 (angle th + π) */
          var A1 = pt(sg, s, th, r), A2 = pt(sg, s, th + Math.PI, r);
          var has1 = true, has2 = true, c1, c2, b1 = b, b2 = b ^ 1, pr1 = false, pr2 = false, nick = false;
          if (sg === 0){ c1 = COLP1; c2 = COLP2; }
          else if (sg === 1){ c1 = COLP1; c2 = NEWL; }              /* fille A : brin parental 1 + brin avancé continu */
          else {
            c1 = NEWD; c2 = COLP2; b1 = b;                           /* fille B : brin parental 2 + fragments */
            var m = Math.floor((s / Lf) - cph);  /* fragment : borne b_m = (m + cph)·Lf */
            var rel = s - (m + cph) * Lf;          /* distance depuis le début du fragment courant */
            var bm = (m + cph) * Lf;
            if (m < 0) { bm = 0; rel = s; }
            if (s < 0.02) has1 = false;
            if (prim.value && rel < pl && s < 1.25 * Lf + 0.5 && s > 0.02 && (bm > -1e-6 || m < 0)) pr1 = true;
            if (!lig.value && rel < 0.06 && m >= 0) nick = true;
            if (lig.value && rel < 0.06 && m >= 0 && s < 1.8 * Lf) nick = true;
          }
          if (sg === 2 && !has1){ }
          /* barreaux */
          if (bas.value){
            var mid = pt(sg, s, th, 0), cc = [mid[0], mid[1], mid[2]];
            if (has1) v.seg(A1, cc, 0.05, BC[b1]); if (has2) v.seg(A2, cc, 0.05, sg === 2 || sg === 0 || sg === 1 ? BC[sg === 2 ? b2 : b2] : BC[b2]);
          } else v.seg(A1, A2, 0.03, "#cbd5e1", 0.6);
          /* squelette */
          var key = j;
          if (prev.A1 && has1 && !(nick && sg === 2)) v.seg(prev.A1, A1, 0.085, pr1 ? PRIM : c1);
          else if (prev.A1 && has1 && nick && sg === 2) v.ball(A1[0], A1[1], A1[2], 0.07, "#ef4444");
          if (prev.A2 && has2) v.seg(prev.A2, A2, 0.085, c2);
          prev.A1 = has1 ? A1 : null; prev.A2 = A2;
          if (has1) v.ball(A1[0], A1[1], A1[2], 0.055, pr1 ? PRIM : c1);
          v.ball(A2[0], A2[1], A2[2], 0.055, c2);
        }
      });
      /* hélicase et polymérases */
      var hp = v.ball(0, 0, 0, 0.3, "#7c3aed", 0.9);
      v.label("Hélicase", -0.1, 0.6, 0.4, "#5B21B6", 11);
      v.ball(0.55 * ca, 0.55 * sa, 0, 0.2, "#dc2626"); v.label("Brin continu (pol)", 2.0, 1.75, 0, "#b42318", 10);
      v.ball(cph * Lf * ca + 0.1, -(cph * Lf + 0.1) * sa, 0, 0.2, "#f97316"); 
      v.label("ADN parental", -1.9, 0.75, 0, "#1e3f8f", 11);
      v.label("Brin discontinu : fragments d'Okazaki", 2.0, -2.0, 0, "#c2410c", 10);
      v.flush();
      /* légende */
      var lg = [["#1e3f8f","parent"],["#0e7490","parent"],["#dc2626","nouveau (continu)"],["#f97316","nouveau (discontinu)"],[PRIM,"amorce ARN"]];
      S.draw.text(c, "Bases :", 6, c.H - 40, {size:10, align:"left", color:pal.grey});
      BN.forEach(function(n, i){ c.ctx.fillStyle = BC[i]; c.ctx.fillRect(48 + i * 26, c.H - 46, 10, 10); S.draw.text(c, n, 62 + i * 26, c.H - 40, {size:10, align:"left"}); });
      S.draw.text(c, "bleu / vert : brins parentaux · rouge / orange : brins néoformés", 6, c.H - 20, {size:10, align:"left", color:pal.grey});
      S.draw.text(c, "Glisse pour tourner la molécule", 6, 12, {size:10, align:"left", color:pal.grey});
      var sp = org.value === "p" ? 1000 : 50, lf = org.value === "p" ? 1500 : 150;
      ro.set(0, S.fmt(sp, 0) + " pb/s"); ro.set(1, S.fmt(sp / 10.5, 1)); ro.set(2, "≈ " + S.fmt(lf, 0) + " nt"); ro.set(3, S.fmt(sp / lf, 2));
      info.set(lig.value ? (org.value === "p" ? "Procaryote : fourche très rapide (≈ 1000 pb/s), longs fragments d'Okazaki ; l'hélicase doit dérouler ≈ 95 tours d'hélice par seconde." : "Eucaryote : fourche plus lente (≈ 50 pb/s), fragments courts (≈ 150 nt, un par nucléosome), nombreuses origines de réplication.") : "Sans ADN ligase, les coupures entre fragments ne sont pas scellées : le brin néoformé reste discontinu (points rouges) et se fragmente (cassures).", lig.value ? "ok" : "bad");
    }
    k.draw(R);
    var lp = k.loop(function(dt){ tt += dt; v.spin(dt); s0 += dt * spd.value * (org.value === "p" ? 0.5 : 0.22); R(); }); lp.play();
  }
});

})();
/* BIO3D-END:s_c07_adn.js */

/* BIO3D-BEGIN:s_c07_ribosome.js */
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
  id:"ub-c07-3d-ribosome-traduction", ch:"c07", tag:"Traduction · 3D",
  titre:"Le ribosome en 3D : lire l'ARNm, ajouter un acide aminé à la fois",
  resume:"Sites A, P et E, arrivée de l'ARNt, liaison peptidique, translocation, terminaison : suis le cycle d'élongation codon par codon.",
  but:"Choisis un ARNm (sauvage ou muté) ou écris le tien, avance étape par étape ou en automatique, tourne le ribosome et observe la chaîne polypeptidique sortir par le tunnel.",
  aRetenir:"Le ribosome (grande et petite sous-unités) lit l'ARNm de 5' vers 3', un codon à la fois. Cycle d'élongation : (1) l'ARNt aminoacylé dont l'anticodon est complémentaire entre au site A (aidé par EF-Tu·GTP) ; (2) la grande sous-unité catalyse la liaison peptidique (ribozyme) : la chaîne passe sur l'ARNt du site A ; (3) translocation (EF-G·GTP) : l'ARNm avance d'un codon, A → P, P → E, et l'ARNt déchargé quitte. Un codon stop (UAA, UAG, UGA) est reconnu par un facteur de terminaison, pas par un ARNt : la chaîne est libérée.",
  piege:"Aucun ARNt ne reconnaît les codons stop. Une mutation qui insère ou supprime une base (non multiple de 3) décale tout le cadre de lecture en aval ; une substitution, elle, ne change qu'un codon (silencieuse, faux-sens ou non-sens). Les sous-unités sont schématisées par des nuages de billes et le tunnel n'est pas à l'échelle.",
  build:function(k,S){
    var c = k.canvas(430), pal = P(S), v = V3(c, S, {yaw:0.25, pit:0.2, D:12, sc:50, auto:false});
    var WILD = "AUGGCUUACGAACUGAAAUGGUAA";
    var PRE = {w:WILD, s:"AUGGCUUACGAGCUGAAAUGGUAA", m:"AUGGCUUACGUACUGAAAUGGUAA", n:"AUGGCUUAAGAACUGAAAUGGUAA", f:"AUGAGCUUACGAACUGAAAUGGUAA"};
    var NOTE = {w:"ARNm sauvage : Met-Ala-Tyr-Glu-Leu-Lys-Trp puis stop.", s:"Mutation silencieuse : GAA → GAG, toujours Glu : même protéine.", m:"Mutation faux-sens : GAA → GUA : Glu devient Val.", n:"Mutation non-sens : UAC → UAA : stop prématuré, protéine tronquée (Met-Ala).", f:"Décalage du cadre de lecture : un A inséré après AUG : tout le message en aval est changé."};
    var seqIn = null;
    var TAB = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", B = "UCAG";
    var N3 = {F:"Phe",L:"Leu",S:"Ser",Y:"Tyr",C:"Cys",W:"Trp",P:"Pro",H:"His",Q:"Gln",R:"Arg",I:"Ile",M:"Met",T:"Thr",N:"Asn",K:"Lys",V:"Val",A:"Ala",D:"Asp",E:"Glu",G:"Gly","*":"Stop"};
    var AC = {F:"#f97316",L:"#fb923c",S:"#10b981",Y:"#14b8a6",C:"#eab308",W:"#a855f7",P:"#6366f1",H:"#3b82f6",Q:"#0ea5e9",R:"#2563eb",I:"#f43f5e",M:"#16a34a",T:"#34d399",N:"#06b6d4",K:"#1d4ed8",V:"#ef4444",A:"#f59e0b",D:"#dc2626",E:"#e11d48",G:"#9ca3af"};
    var BC = {A:"#22c55e", U:"#eab308", G:"#0ea5e9", C:"#f472b6"}, COMP = {A:"U", U:"A", G:"C", C:"G"};
    var seq = WILD, nCod = 8, ic = 0, ics = 0, stage = 0, sp = 0, bond = false, done = "", gtp = 0, stepping = false, relT = 0, startOff = 0, seed = 9;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function aaOf(j){ var cd = seq.substr(3 * j, 3); if (cd.length < 3) return null; var a = B.indexOf(cd[0]), b = B.indexOf(cd[1]), d = B.indexOf(cd[2]); if (a < 0 || b < 0 || d < 0) return null; return TAB[16 * a + 4 * b + d]; }
    var sel = k.select("ARNm", [["w","Sauvage"],["s","Mutation silencieuse"],["m","Mutation faux-sens"],["n","Mutation non-sens"],["f","Insertion d'un A (décalage)"]], "w", function(x){ inp.set(PRE[x]); load(PRE[x]); curNote = NOTE[x]; });
    var curNote = NOTE.w;
    var inp = k.input("Ou ta séquence ARNm (5'→3')", WILD, function(x){ load(x); curNote = "Séquence personnalisée."; });
    var spd = k.slider("Vitesse", 0.3, 3, 0.1, 1, "×");
    var auto = k.toggle("Déroulement automatique", false);
    var ro = k.readouts(["Codon A", "Acide aminé", "Longueur de la chaîne", "GTP consommés"]);
    var info = k.note("", "ok");
    function load(x){
      x = String(x).toUpperCase().replace(/T/g, "U").replace(/[^ACGU]/g, "");
      var p = x.indexOf("AUG"); startOff = p < 0 ? 0 : p;
      seq = p < 0 ? x : x.slice(p); nCod = Math.floor(seq.length / 3);
      ic = 0; ics = 0; stage = 0; sp = 0; bond = false; done = (p < 0 || nCod < 1) ? "Pas de codon d'initiation AUG dans cette séquence : le ribosome ne démarre pas." : ""; gtp = 0; stepping = false; relT = 0;
    }
    function isStop(j){ return aaOf(j) === "*"; }
    function peptide(){ var h = bond ? ic + 1 : ic, out = []; for (var j = 0; j <= h; j++){ var a = aaOf(j); if (a && a !== "*") out.push(a); } return out; }
    /* nuages */
    function cloud(n, rx, ry, rz, cy){ var o = []; for (var i = 0; i < n; i++){ var th = rnd() * 6.28, ph = Math.acos(2 * rnd() - 1), r = Math.pow(rnd(), 0.33); o.push([rx * r * Math.sin(ph) * Math.cos(th), cy + ry * r * Math.cos(ph), rz * r * Math.sin(ph) * Math.sin(th), 0.38 + rnd() * 0.12]); } return o; }
    var big = cloud(30, 1.85, 0.8, 1.0, 0.7), small = cloud(22, 1.7, 0.42, 0.85, -0.85);
    var Dx = 1.0, YM = -0.4;
    function trna(j, x, y, z, al, ph2){
      var a = aaOf(j) || "M", cd = seq.substr(3 * j, 3);
      for (var m = 0; m < 3; m++){ var cx = x + (m - 1) * 0.3; v.ball(cx, y + 0.0, z, 0.095, BC[COMP[cd[m]]], al); }
      v.seg([x, y + 0.1, z], [x, y + 0.65, z], 0.1, "#0e7490", al); v.seg([x, y + 0.65, z], [x - 0.22, y + 1.15, z], 0.1, "#0e7490", al); v.seg([x, y + 0.65, z], [x + 0.25, y + 1.0, z + 0.1], 0.08, "#0e7490", al * 0.8);
      v.ball(x - 0.22, y + 1.2, z, 0.16, AC[a] || "#999", al);
      v.label(N3[a], x - 0.55, y + 1.28, z, "#0f1b2d", 10);
      return [x - 0.22, y + 1.2, z];
    }
    var tunnel = [[0, 0], [-0.6, 0.5], [-1.5, 1.0], [-2.4, 1.4], [-3.3, 1.9]];
    function chainDraw(att, aas, rel){
      /* chemin : point d'attache, puis le tunnel vers la gauche et le haut */
      var pts = [[att[0], att[1], att[2]], [att[0] - 0.1, att[1] + 0.8, 0.1], [-1.4, 1.75, 0.0], [-2.3, 2.15, 0.2], [-3.2, 2.55, 0.0], [-4.2, 2.9, 0.3]];
      var cum = [0], i; for (i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
      var prev = null;
      for (var b = 0; b < aas.length; b++){
        var d = Math.min(b * 0.3 + 0.0, cum[cum.length - 1]), q = 1; while (q < cum.length - 1 && cum[q] < d) q++;
        var f = (d - cum[q - 1]) / (cum[q] - cum[q - 1] || 1), P0 = pts[q - 1], P1 = pts[q];
        var px = P0[0] + (P1[0] - P0[0]) * f - (rel ? rel * 1.2 : 0), py = P0[1] + (P1[1] - P0[1]) * f + (rel ? rel * 0.8 : 0), pz = P0[2] + (P1[2] - P0[2]) * f + 0.08 * Math.sin(b * 1.7);
        var al = rel ? Math.max(0, 1 - rel * 0.8) : 1;
        if (prev) v.seg(prev, [px, py, pz], 0.06, "#6b7280", al);
        v.ball(px, py, pz, 0.14, AC[aas[aas.length - 1 - b]] || "#999", al); prev = [px, py, pz];
      }
    }
    function R(){
      c.clear(); v.sc = Math.min(62, c.W / 7.7); v.oy = 22; v.ox = 24;
      /* sous-unités */
      big.forEach(function(b){ v.ball(b[0], b[1], b[2], b[3], "#60a5fa", 0.15); });
      small.forEach(function(b){ v.ball(b[0], b[1], b[2], b[3], "#fbbf24", 0.18); });
      /* ARNm */
      var last = null;
      for (var n = -5 * 3 - 1; n < (nCod + 6) * 3; n++){
        var j = Math.floor(n / 3), x = (j - ics) * Dx + ((n % 3 + 3) % 3 - 1) * 0.3;
        if (x < -3.5 || x > 3.7) { last = null; continue; }
        var ch = n >= 0 && n < nCod * 3 + (seq.length % 3) ? seq[n] : null, pos = [x, YM - 0.35, 0];
        if (n >= 0 && n < seq.length){ if (last) v.seg(last, pos, 0.05, "#475569", 0.95); v.ball(pos[0], pos[1], pos[2], 0.12, BC[ch]); v.label(ch, pos[0], pos[1] - 0.3, 0, "#0f1b2d", 9); last = pos; }
        else if (n < 0 || n >= seq.length){ if (last) v.seg(last, pos, 0.04, "#94a3b8", 0.6); v.ball(pos[0], pos[1], pos[2], 0.07, "#cbd5e1", 0.7); last = pos; }
      }
      v.label("5'", -3.4, YM - 0.35, 0, pal.grey, 11); v.label("3'", 3.55, YM - 0.35, 0, pal.grey, 11);
      v.label("E", -Dx, -1.75, 0, "#475569", 12); v.label("P", 0, -1.75, 0, "#475569", 12); v.label("A", Dx, -1.75, 0, "#475569", 12);
      /* ARNt : codons ic-2 .. ic+1 */
      var holderPos = null, holder = bond ? ic + 1 : ic;
      for (var q = ic - 2; q <= ic + 1; q++){
        if (q < 0 || q >= nCod) continue;
        var xq = (q - ics) * Dx, al = 1, yq = YM + 0.05, zq = 0;
        if (q === ic + 1 && stage === 0 && !isStop(q)){ var e = 1 - Math.pow(1 - Math.min(1, sp), 2); xq = Dx + (1 - e) * 1.6; yq += (1 - e) * 1.4; zq = (1 - e) * 1.5; al = 0.35 + 0.65 * e; }
        else if (q === ic + 1 && isStop(q)) continue;
        if (xq < -1.2 * Dx){ al = Math.max(0, 1 - (-1.2 * Dx - xq) * 1.6); yq += (-1.2 * Dx - xq) * 0.5; zq += (-1.2 * Dx - xq) * 0.7; }
        if (al <= 0.02) continue;
        var at = trna(q, xq, yq, zq, al);
        if (q === holder) holderPos = at;
      }
      /* facteur de terminaison */
      var rf = false;
      if (isStop(ic + 1) && ic + 1 < nCod && !done.length || (isStop(ic + 1) && done)){
        var e2 = stage === 0 ? 1 - Math.pow(1 - Math.min(1, sp), 2) : 1;
        v.ball(Dx + (1 - e2) * 1.6, YM + 0.4 + (1 - e2) * 1.4, (1 - e2) * 1.5, 0.3, "#16a34a", 0.4 + 0.6 * e2); v.label("RF", Dx + (1 - e2) * 1.6, YM + 0.4 + (1 - e2) * 1.4, (1 - e2) * 1.5, "#fff", 11); rf = true;
      }
      /* peptide */
      var aas = peptide();
      if (holderPos) chainDraw(holderPos, aas, 0);
      else if (relT > 0) chainDraw([-0.2, YM + 0.8, 0], aas, relT);
      if (stage === 1 && sp > 0.4 && sp < 0.85 && !isStop(ic + 1)) v.ball(0.5 * Dx, YM + 1.05, 0.2, 0.25, "#fde047", 0.8 * Math.sin((sp - 0.4) / 0.45 * 3.14));
      v.flush();
      if (rf && stage >= 1 && stage <= 2) S.draw.text(c, "Terminaison : le facteur RF libère la chaîne", c.W / 2, c.H - 14, {size:11, color:pal.green});
      var cdA = seq.substr(3 * (ic + 1), 3), aa2 = aaOf(ic + 1);
      ro.set(0, cdA.length === 3 ? cdA : "—"); ro.set(1, aa2 ? (aa2 === "*" ? "Stop (RF)" : N3[aa2]) : "—"); ro.set(2, aas.length + " aa"); ro.set(3, gtp);
      var txt = peptide().map(function(a){ return N3[a]; }).join("–");
      var m = "<b>Chaîne : </b>" + (txt || "—") + "<br>";
      if (done) m += "<b>" + done + "</b>";
      else if (stage === 0) m += isStop(ic + 1) ? "Étape 1 : le codon A est un codon stop : un facteur de terminaison (RF) entre au site A, aucun ARNt ne le reconnaît." : "Étape 1 : un ARNt-" + N3[aa2] + " (anticodon 3'-" + cdA.split("").map(function(x){ return COMP[x]; }).join("") + "-5') se fixe au codon " + cdA + " du site A (EF-Tu·GTP).";
      else if (stage === 1) m += isStop(ic + 1) ? "Étape 2 : hydrolyse de la liaison ARNt–peptide : la chaîne est libérée." : "Étape 2 : liaison peptidique catalysée par l'ARN ribosomique : la chaîne passe sur l'ARNt du site A.";
      else m += isStop(ic + 1) ? "Étape 3 : dissociation des sous-unités, fin de la traduction." : "Étape 3 : translocation (EF-G·GTP) : le ribosome avance d'un codon, l'ARNt déchargé sort par E.";
      info.set(curNote + "<br>" + m, done ? "warn" : "ok");
    }
    function advance(dt){
      if (done) return;
      var run = auto.value || stepping; if (!run) return;
      sp += dt * spd.value / 1.3;
      if (stage === 1 && sp > 0.5) bond = true;
      if (stage === 1 && sp > 0.5 && isStop(ic + 1)){ relT += dt * spd.value * 0.7; }
      if (sp >= 1){
        sp = 0; stepping = false;
        if (stage === 0){ stage = 1; if (!isStop(ic + 1)) gtp++; }
        else if (stage === 1){ stage = 2; }
        else {
          if (isStop(ic + 1)){ done = "Traduction terminée : protéine de " + peptide().length + " acides aminés."; relT = Math.max(relT, 0.01); stage = 2; return; }
          ic++; stage = 0; bond = false; gtp++;
          if (ic + 1 >= nCod || seq.substr(3 * (ic + 1), 3).length < 3){ done = "Fin de l'ARNm sans codon stop : la traduction ne se termine pas correctement (ribosome bloqué, chaîne non libérée)."; }
        }
        if (stage === 2 && isStop(ic + 1)){ stepping = auto.value; }
      }
      if (stage === 2){ var tgt = isStop(ic + 1) ? ic : ic + 1; ics = ic + (isStop(ic + 1) ? 0 : (1 - Math.pow(1 - Math.min(1, sp), 2))); } else ics = ic;
    }
    k.button("Étape suivante", function(){ auto.set(false); if (!done) stepping = true; }, true);
    k.button("Recommencer", function(){ load(inp.value); });
    load(WILD); k.draw(R);
    var lp = k.loop(function(dt){ advance(dt); if (done && relT > 0 && relT < 1.5) relT += dt; v.spin(dt); R(); }); lp.play();
  }
});

})();
/* BIO3D-END:s_c07_ribosome.js */
