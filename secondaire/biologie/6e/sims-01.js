/* Chapitre 1 · Hérédité monohybride : gènes et allèles */
(function(){
var B = window.B6;
function frac(n, d){ var g = B.gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
function sortG(a, b){ return a <= b ? a + b : b + a; }   /* "A" < "a" en ASCII : AA, Aa, aa */

SFA.sim({
  id: "b6-c01-echiquier", ch: "c01", tag: "Classique",
  titre: "Échiquier de croisement et descendants tirés au sort",
  resume: "Choisis les génotypes des parents, lis l'échiquier, puis tire au sort des descendants et compare aux proportions attendues.",
  but: "Choisis le génotype des deux parents et le type de dominance. L'échiquier de fleurs donne les proportions attendues ; avec le curseur, tire au sort des descendants (chaque fleur est un descendant) et compare (trait pointillé = attendu).",
  aRetenir: "Chaque parent transmet un seul allèle par gamète, au hasard. L'échiquier donne des probabilités : Aa × Aa donne 1/4 AA, 1/2 Aa, 1/4 aa, soit 3 phénotypes dominants pour 1 récessif en dominance complète, mais 1 : 2 : 1 en dominance incomplète.",
  piege: "« Dominant » ne veut pas dire « le plus fréquent » : c'est l'allèle qui s'exprime chez l'hétérozygote. Et 3 : 1 n'est qu'une probabilité : sur 4 descendants, on peut très bien obtenir 4 : 0.",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 500 : 470), P = S.draw.palette;
    var mode = k.seg("Dominance", [["c", "Complète"], ["i", "Incomplète"]], "c");
    var opts = [["AA", "AA (homozygote dominant)"], ["Aa", "Aa (hétérozygote)"], ["aa", "aa (homozygote récessif)"]];
    var p1 = k.select("Parent 1", opts, "Aa"), p2 = k.select("Parent 2", opts, "Aa");
    var n = k.slider("Descendants tirés au sort", 0, 400, 10, 0, "");
    var seed = 1; k.button("Nouveau tirage", function(){ seed++; });
    var ro = k.readouts(["Attendu", "Observé", "Génotypes attendus"]);
    var colors = {c: ["#d23a2c", "#fbfbf7"], i: ["#d23a2c", "#f29ab1", "#fbfbf7"]};
    var names = {c: ["rouge", "blanche"], i: ["rouge", "rose", "blanche"]};
    function ph(g){ var nA = (g.match(/A/g) || []).length; if (mode.value === "c") return nA > 0 ? 0 : 1; return 2 - nA; }
    function flower(x, y, r, color){
      var ctx = c.ctx, i; ctx.save(); ctx.translate(x, y);
      for (i = 0; i < 5; i++){ var a = i / 5 * 6.2832 - 1.5708; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * .55, Math.sin(a) * r * .55, r * .5, r * .36, a, 0, 6.2832); ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 0.9; ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, 0, r * .22, 0, 6.2832); ctx.fillStyle = "#f4c542"; ctx.fill(); ctx.restore();
    }
    k.draw(function(){
      c.clear(); var m = mode.value, ctx = c.ctx, W = c.W;
      var g1 = p1.value.split(""), g2 = p2.value.split(""), cell = Math.min(66, (W - 100) / 4), ox = 40, oy = 44;
      S.draw.text(c, "Gamètes du parent 1 →", ox + cell, 12, {size: 11, color: P.grey});
      S.draw.text(c, "Parent 2 ↓", 4, oy - 12, {size: 11, color: P.grey, align: "left"});
      var cnt = {AA: 0, Aa: 0, aa: 0}, pc = m === "c" ? [0, 0] : [0, 0, 0], cells = [];
      for (var i = 0; i < 2; i++){
        S.draw.label(c, g1[i], ox + cell * (i + 0.5), oy - 12, {color: P.acc, size: 14});
        S.draw.label(c, g2[i], ox - 18, oy + cell * (i + 0.5), {color: P.red, size: 14});
        for (var j = 0; j < 2; j++){
          var g = sortG(g1[j], g2[i]); cnt[g]++; var q = ph(g); pc[q]++; cells.push(q);
          S.draw.rrect(c, ox + j * cell + 1, oy + i * cell + 1, cell - 3, cell - 3, 9); ctx.fillStyle = "#f6f8fb"; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = "#cfd6df"; ctx.stroke();
          flower(ox + j * cell + cell / 2 - 1, oy + i * cell + cell / 2 - 7, cell * .3, colors[m][q]);
          S.draw.text(c, g, ox + j * cell + cell / 2 - 1, oy + i * cell + cell - 11, {size: 12.5, color: P.ink});
        }
      }
      /* légende */
      var lx = ox + 2 * cell + 22;
      for (var q2 = 0; q2 < pc.length; q2++){
        flower(lx + 10, oy + 14 + q2 * 32, 11, colors[m][q2]);
        S.draw.text(c, "fleur " + names[m][q2] + " : " + frac(pc[q2], 4), lx + 28, oy + 14 + q2 * 32, {align: "left", size: 13});
      }
      /* tirage au sort */
      var r = B.rng(seed * 7919 + 13), obs = pc.map(function(){ return 0; }), draws = [];
      for (var t = 0; t < n.value; t++){ var qq = cells[Math.floor(r() * 4)]; obs[qq]++; draws.push(qq); }
      var gy = oy + 2 * cell + 20;
      S.draw.text(c, n.value ? n.value + " descendants tirés au sort" : "Descendants : augmente le curseur pour les tirer au sort", 10, gy, {align: "left", size: 12.5});
      var fs = Math.max(4, Math.min(9, Math.sqrt((W - 20) * 60 / Math.max(draws.length, 1)) / 2)), per = Math.floor((W - 20) / (fs * 2 + 1)), shown = Math.min(draws.length, per * 6);
      for (var d = 0; d < shown; d++) flower(12 + fs + (d % per) * (fs * 2 + 1), gy + 18 + fs + Math.floor(d / per) * (fs * 2 + 1), fs, colors[m][draws[d]]);
      var by = gy + 18 + (n.value ? 6 * (fs * 2 + 1) : 0) + 22;
      var items = pc.map(function(v, q3){ var exp = v * 25; return {l: names[m][q3], v: n.value ? obs[q3] / n.value * 100 : exp, e: exp, c: colors[m][q3] === "#fbfbf7" ? "#c8ccd2" : colors[m][q3]}; });
      S.draw.text(c, n.value ? "Pourcentage observé (pointillé = attendu)" : "Pourcentage attendu parmi les descendants", W / 2, by - 10, {size: 12.5, color: P.grey});
      B.bars(c, S, items, 40, by + 6, W - 60, Math.max(70, c.H - by - 44), 100, function(v){ return S.fmt(v, 1) + " %"; });
      var exTxt = pc.filter(function(v){ return v > 0; }), gg = 0; exTxt.forEach(function(v){ gg = B.gcd(gg, v); });
      ro.set(0, exTxt.map(function(v){ return v / gg; }).join(" : "));
      ro.set(1, n.value ? obs.filter(function(v, q4){ return pc[q4] > 0 || v > 0; }).join(" : ") : "—");
      ro.set(2, ["AA", "Aa", "aa"].filter(function(g){ return cnt[g] > 0; }).map(function(g){ return frac(cnt[g], 4) + " " + g; }).join(" · "));
    });
  }
});



SFA.sim({
  id: "b6-c01-grands-nombres", ch: "c01", tag: "Hasard",
  titre: "Pourquoi 3 : 1 n'apparaît que sur de grands effectifs",
  resume: "30 familles Aa × Aa de taille n : plus n est grand, plus les résultats se resserrent autour de 75 %.",
  but: "Chaque point est une famille (un échantillon) de n descendants d'un croisement Aa × Aa. Il montre le pourcentage de descendants au phénotype dominant. Augmente n et regarde le nuage se resserrer autour de 75 %.",
  aRetenir: "La proportion attendue (75 % de dominants) est une probabilité. Sur n descendants, l'écart typique vaut √(0,75 × 0,25 / n) : il est divisé par 2 quand on multiplie n par 4. Mendel a obtenu ses beaux 3 : 1 en comptant des centaines de plantes.",
  piege: "Avec 4 descendants, obtenir 4 dominants (ou 2 dominants et 2 récessifs) n'infirme pas la loi de Mendel : l'échantillon est simplement trop petit pour que les proportions apparaissent.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var n = k.select("Descendants par famille (n)", [4, 8, 16, 32, 64, 128, 256, 512, 1024], 16);
    var seed = 1; k.button("Nouveau tirage de 30 familles", function(){ seed++; });
    var ro = k.readouts(["Famille n° 1 (dominants : récessifs)", "Moyenne des 30 familles", "Écart-type attendu"]);
    k.draw(function(){
      c.clear(); var N = +n.value, r = B.rng(seed * 104729 + N);
      var ax = S.draw.axes(c, {x0: 0, x1: 31, y0: 0, y1: 100, stepX: 5, stepY: 25, xl: "famille", yl: "% de dominants"});
      var sd = Math.sqrt(0.75 * 0.25 / N) * 100, lo = Math.max(0, 75 - 2 * sd), hi = Math.min(100, 75 + 2 * sd), ctx = c.ctx;
      ctx.fillStyle = "rgba(46,107,85,.13)"; ctx.fillRect(ax.L, ax.Y(hi), ax.R - ax.L, ax.Y(lo) - ax.Y(hi));
      S.draw.line(c, ax.L, ax.Y(75), ax.R, ax.Y(75), P.green, 1.6, [6, 4]);
      var sum = 0, out = 0, first = null;
      for (var i = 1; i <= 30; i++){
        var d = B.binom(N, 0.75, r), pc = d / N * 100; sum += pc; if (i === 1) first = d;
        var inside = pc >= lo - 1e-9 && pc <= hi + 1e-9; if (!inside) out++;
        S.draw.dot(c, ax.X(i), ax.Y(pc), i === 1 ? 7 : 5, inside ? P.green : P.red);
      }
      S.draw.text(c, "bande verte : 75 % ± 2 écarts-types", ax.L + 8, ax.T + 10, {align: "left", size: 12, color: P.green});
      ro.set(0, first + " : " + (N - first) + (first < N ? " (≈ " + S.fmt(first / (N - first), 2) + " : 1)" : ""));
      ro.set(1, S.fmt(sum / 30, 1) + " %");
      ro.set(2, "± " + S.fmt(sd, 1) + " points");
    });
  }
});

SFA.sim({
  id: "b6-c01-testcross", ch: "c01", tag: "Niche utile",
  titre: "Test-cross : AA ou Aa ? Combien de descendants faut-il ?",
  resume: "Un individu au phénotype dominant est croisé avec un aa. À partir de combien de descendants peut-on conclure ?",
  but: "Un individu mystère a le phénotype dominant. On le croise avec un individu aa et on observe n descendants (des pois verts ou jaunes). Augmente n et lis la probabilité de se tromper si tous les descendants sont dominants ; la ligne pointillée marque le seuil de 1 %.",
  aRetenir: "Un seul descendant récessif suffit pour prouver que l'individu mystère est Aa (il a donné un allèle a). Par contre, si tous les descendants sont dominants, la conclusion « AA » n'est que probable : un Aa passe inaperçu avec la probabilité (1/2)ⁿ.",
  piege: "Tous les descendants dominants ne prouvent pas que le parent est AA : avec 3 descendants, un Aa se fait passer pour un AA dans 12,5 % des cas.",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette;
    var n = k.slider("Descendants observés (n)", 1, 20, 1, 3, "");
    var seed = 1; k.button("Nouvel individu mystère", function(){ seed++; });
    var rev = k.toggle("Révéler le génotype de l'individu mystère", false);
    var ro = k.readouts(["Descendants récessifs", "Verdict", "Erreur possible si tous dominants"]);
    var note = k.note("", "");
    function pea(x, y, r, rec){
      var ctx = c.ctx, g = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r);
      if (rec){ g.addColorStop(0, "#fff3b0"); g.addColorStop(1, "#d9a914"); } else { g.addColorStop(0, "#bfe8a8"); g.addColorStop(1, "#2f8a4f"); }
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.stroke();
    }
    k.draw(function(){
      c.clear(); var r = B.rng(seed * 6007 + 5), isAa = r() < 0.5, u = [], i, W = c.W, ctx = c.ctx;
      for (i = 0; i < 20; i++) u.push(r());
      /* individu mystère x aa */
      var rr = Math.min(17, (W - 150) / 22);
      S.draw.panel(c, 8, 8, W - 16, 78, {shadow: false});
      pea(40, 44, 20, false); S.draw.text(c, rev.value ? (isAa ? "Aa" : "AA") : "A ?", 40, 44, {size: 14, color: "#fff"});
      S.draw.text(c, "×", 76, 44, {size: 20, color: P.grey});
      pea(110, 44, 20, true); S.draw.text(c, "aa", 110, 44, {size: 14, color: P.ink});
      S.draw.text(c, "mystère", 40, 72, {size: 10, color: P.grey}); S.draw.text(c, "testeur", 110, 72, {size: 10, color: P.grey});
      var rec = 0, perRow = Math.max(5, Math.floor((W - 156) / (rr * 2 + 3)));
      for (i = 0; i < n.value; i++){
        var isRec = isAa && u[i] >= 0.5; if (isRec) rec++;
        var x = 148 + rr + (i % perRow) * (rr * 2 + 3), y = 24 + rr + Math.floor(i / perRow) * (rr * 2 + 3);
        pea(x, y, rr, isRec);
        if (rr > 11) S.draw.text(c, isRec ? "aa" : "A–", x, y, {size: 10.5, color: isRec ? P.ink : "#fff"});
      }
      S.draw.text(c, "vert = dominant · jaune = récessif", W - 14, 100, {align: "right", size: 11, color: P.grey});
      /* courbe de l'erreur, en échelle logarithmique */
      var L = 56, R = W - 16, T = 126, Bm = 360;
      function Y(p){ return Bm - (Math.log10(p) + 7) / 7 * (Bm - T); }
      ctx.save(); ctx.font = "600 11px Mulish, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      [[100, "100 %"], [10, "10 %"], [1, "1 %"], [0.1, "0,1 %"], [0.01, "0,01 %"], [0.001, "0,001 %"], [0.0001, "0,0001 %"], [0.00001, "0,00001 %"]].forEach(function(g){
        ctx.strokeStyle = g[0] === 1 ? "rgba(36,119,90,.7)" : "#edf0f4"; ctx.setLineDash(g[0] === 1 ? [5, 4] : []); ctx.beginPath(); ctx.moveTo(L, Y(g[0] / 100)); ctx.lineTo(R, Y(g[0] / 100)); ctx.stroke(); ctx.fillText(g[1], L - 4, Y(g[0] / 100));
      });
      ctx.setLineDash([]); ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (i = 1; i <= 20; i += (W < 420 ? 3 : 1)){ var xx = L + (i - 1) / 19 * (R - L); ctx.fillText(i, xx, Bm + 4); }
      ctx.restore();
      S.draw.text(c, "seuil 1 %", R - 4, Y(0.01) - 9, {align: "right", size: 10.5, color: P.green});
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2.6; ctx.beginPath();
      for (i = 1; i <= 20; i++){ var px = L + (i - 1) / 19 * (R - L), py = Y(Math.pow(0.5, i)); if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      for (i = 1; i <= 20; i++) S.draw.dot(c, L + (i - 1) / 19 * (R - L), Y(Math.pow(0.5, i)), 2.4, i <= n.value ? P.acc : "#c3cbd5");
      var cx = L + (n.value - 1) / 19 * (R - L); S.draw.dot(c, cx, Y(Math.pow(0.5, n.value)), 7, rec > 0 ? P.grey : P.red);
      S.draw.text(c, "n = nombre de descendants", (L + R) / 2, Bm + 28, {size: 12, color: P.grey});
      S.draw.label(c, "P(Aa passe pour AA) = (1/2)ⁿ", L + 8, T + 8, {align: "left", color: P.acc, size: 11.5});
      var err = Math.pow(0.5, n.value) * 100;
      ro.set(0, rec + " sur " + n.value);
      ro.set(1, rec > 0 ? "Aa (certain)" : "AA probable");
      ro.set(2, rec > 0 ? "aucune" : S.fmt(err, err < 0.001 ? 6 : err < 0.1 ? 4 : 2) + " %");
      var txt = rec > 0 ? "Un descendant aa existe : l'individu mystère a forcément donné un allèle a, donc il est Aa." : "Tous dominants : pour être sûr à 99 % (erreur < 1 %), il faut au moins 7 descendants (1/2⁷ = 0,78 %).";
      if (rev.value) txt += " <b>Génotype réel : " + (isAa ? "Aa" : "AA") + ".</b>";
      note.set(txt, rec > 0 ? "ok" : "warn");
    });
  }
});



SFA.sim({
  id: "b6-c01-abo", ch: "c01", tag: "Allèles multiples",
  titre: "Groupes sanguins ABO : codominance et exclusion de paternité",
  resume: "Choisis les génotypes des parents : quels groupes sanguins peuvent avoir leurs enfants, avec quelles probabilités ?",
  but: "Trois allèles (A, B, O) existent pour ce gène. Choisis le génotype de chaque parent, lis les probabilités de chaque groupe chez l'enfant (les globules rouges montrent les marqueurs A et B à leur surface), puis teste si un groupe observé est possible.",
  aRetenir: "A et B sont codominants (un hétérozygote AB exprime les deux) ; A et B sont tous deux dominants sur O. Un individu a seulement 2 allèles, mais la population en compte 3 : le groupe O exige le génotype OO.",
  piege: "Deux parents du groupe A peuvent avoir un enfant du groupe O (AO × AO : 1/4). Un groupe sanguin impossible permet d'exclure une paternité, mais un groupe possible ne la prouve pas.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette, T = 0;
    var opts = [["AA", "A (génotype AA)"], ["AO", "A (génotype AO)"], ["BB", "B (génotype BB)"], ["BO", "B (génotype BO)"], ["AB", "AB (génotype AB)"], ["OO", "O (génotype OO)"]];
    var p1 = k.select("Parent 1 (père)", opts, "AO"), p2 = k.select("Parent 2 (mère)", opts, "BO");
    var obs = k.select("Groupe observé chez l'enfant", [["-", "(aucun)"], ["A", "A"], ["B", "B"], ["AB", "AB"], ["O", "O"]], "-");
    var ro = k.readouts(["Groupes possibles", "Génotypes possibles"]);
    var note = k.note("", "");
    var col = {A: "#c0321d", B: "#1f4b9e", AB: "#6236c4", O: "#8a95a3"};
    var lp = k.loop(function(dt, t){ T = t; k.redraw(); }); lp.play();
    function grp(g){ var a = g.indexOf("A") >= 0, b = g.indexOf("B") >= 0; return a && b ? "AB" : a ? "A" : b ? "B" : "O"; }
    function sg(a, b){ return [a, b].sort().join(""); }
    /* globule rouge vu de dessus, avec ses marqueurs (A : carrés rouges, B : ronds bleus) */
    function rbc(x, y, r, q, wob){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y);
      var g = ctx.createRadialGradient(-r * .25, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, "#f3a3a0"); g.addColorStop(1, "#c4352f");
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, r * .42, 0, 6.2832); ctx.fillStyle = "rgba(120,20,20,.22)"; ctx.fill();
      var n = Math.max(8, Math.round(r * 0.55)), i;
      for (i = 0; i < n; i++){
        var a = i / n * 6.2832 + (wob || 0), ex = Math.cos(a) * (r + 5), ey = Math.sin(a) * (r + 5), bx = Math.cos(a) * r, by = Math.sin(a) * r, m = q === "AB" ? (i % 2 ? "B" : "A") : q;
        if (q === "O") continue;
        ctx.strokeStyle = "#5b6676"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.fillStyle = m === "A" ? "#f4c542" : "#2f7fd1";
        if (m === "A"){ ctx.fillRect(ex - 2.6, ey - 2.6, 5.2, 5.2); } else { ctx.beginPath(); ctx.arc(ex, ey, 3, 0, 6.2832); ctx.fill(); }
      }
      ctx.restore();
    }
    k.draw(function(){
      c.clear(); var g1 = p1.value.split(""), g2 = p2.value.split(""), W = c.W, cell = Math.min(78, (W - 80) / 4), ox = 38, oy = 62, ctx = c.ctx, cnt = {A: 0, B: 0, AB: 0, O: 0}, gens = {};
      S.draw.text(c, "Gamètes du père →", ox + cell, 12, {size: 11, color: P.grey});
      for (var i = 0; i < 2; i++){
        S.draw.label(c, g1[i], ox + cell * (i + 0.5), oy - 14, {color: P.acc, size: 14});
        S.draw.label(c, g2[i], ox - 20, oy + cell * (i + 0.5), {color: P.red, size: 14});
        for (var j = 0; j < 2; j++){
          var g = sg(g1[j], g2[i]), q = grp(g); cnt[q]++; gens[g] = (gens[g] || 0) + 1;
          var x0 = ox + j * cell, y0 = oy + i * cell;
          S.draw.rrect(c, x0 + 1, y0 + 1, cell - 3, cell - 3, 9); ctx.fillStyle = S.draw.tint(col[q], 0.13); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = S.draw.tint(col[q], 0.6); ctx.stroke();
          rbc(x0 + cell / 2 - 1, y0 + cell / 2 - 8, cell * 0.24, q, T * 0.2);
          S.draw.text(c, g + " · " + q, x0 + cell / 2 - 1, y0 + cell - 11, {size: 11.5, color: col[q]});
        }
      }
      S.draw.text(c, "Mère ↓", ox - 20, oy - 2 - 24, {size: 11, color: P.grey});
      /* probabilités */
      var bx = ox + 2 * cell + 24, bw = W - bx - 12, wide = bw > 120;
      var by = wide ? oy : oy + 2 * cell + 24;
      if (!wide){ bx = 14; bw = W - 28; }
      S.draw.text(c, "Probabilité du groupe de l'enfant", bx, by - 16, {align: "left", size: 12.5});
      var qs = ["A", "B", "AB", "O"], rh = wide ? Math.min(34, (2 * cell) / 4) : 32;
      qs.forEach(function(q, n){
        var y = by + n * rh + rh / 2, p = cnt[q] * 25, isObs = obs.value === q;
        rbc(bx + 12, y, 9, q, T * 0.2);
        ctx.fillStyle = "#eef1f5"; S.draw.rrect(c, bx + 32, y - 8, bw - 74, 16, 8); ctx.fill();
        if (p > 0){ ctx.fillStyle = col[q]; S.draw.rrect(c, bx + 32, y - 8, Math.max(14, (bw - 74) * p / 100), 16, 8); ctx.fill(); }
        S.draw.text(c, q, bx + 32 + 9, y + 0.5, {size: 10.5, color: p > 0 ? "#fff" : col[q]});
        S.draw.text(c, p + " %", bx + bw - 8, y + 0.5, {align: "right", size: 12.5, color: p > 0 ? P.ink : P.grey});
        if (isObs){ ctx.lineWidth = 2.2; ctx.strokeStyle = p > 0 ? P.green : P.red; S.draw.rrect(c, bx - 2, y - rh / 2 + 2, bw + 4, rh - 4, 9); ctx.stroke(); }
      });
      /* légende des marqueurs */
      var ly = c.H - 22;
      ctx.fillStyle = "#f4c542"; ctx.fillRect(16, ly - 4, 8, 8); S.draw.text(c, "marqueur A", 30, ly, {align: "left", size: 11, color: P.grey});
      ctx.fillStyle = "#2f7fd1"; ctx.beginPath(); ctx.arc(120, ly, 4.5, 0, 6.2832); ctx.fill(); S.draw.text(c, "marqueur B", 130, ly, {align: "left", size: 11, color: P.grey});
      S.draw.text(c, "O : aucun marqueur", 226, ly, {align: "left", size: 11, color: P.grey});
      if (obs.value !== "-"){ var okk = cnt[obs.value] > 0; S.draw.label(c, okk ? "Groupe " + obs.value + " possible" : "Groupe " + obs.value + " IMPOSSIBLE : paternité exclue", W / 2, c.H - 48, {color: okk ? P.green : P.red, size: 12.5}); }
      ro.set(0, qs.filter(function(q){ return cnt[q] > 0; }).join(", "));
      ro.set(1, Object.keys(gens).map(function(g){ return gens[g] + "/4 " + g; }).join(" · "));
      if (obs.value === "-") note.set("Choisis un groupe observé chez l'enfant pour tester la compatibilité.", "");
      else if (cnt[obs.value] > 0) note.set("Groupe " + obs.value + " possible (probabilité " + (cnt[obs.value] * 25) + " %). Cela ne prouve pas la filiation : d'autres personnes ont aussi ce groupe.", "ok");
      else note.set("Groupe " + obs.value + " impossible avec ces deux parents : ils ne peuvent pas être les parents biologiques de cet enfant (en l'absence de mutation).", "warn");
    });
  }
});



})();
