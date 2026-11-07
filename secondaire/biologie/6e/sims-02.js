/* Chapitre 2 · Dihybridisme et indépendance des gènes */
(function(){
var B = window.B6;
function sortG(a, b){ return a <= b ? a + b : b + a; }
function frac(n, d){ var g = B.gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }

SFA.sim({
  id: "b6-c02-dihybride", ch: "c02", tag: "Classique",
  titre: "Croisement dihybride : l'échiquier 4 × 4",
  resume: "Deux gènes indépendants (forme et couleur des graines) : choisis les parents et fais apparaître 9 : 3 : 3 : 1.",
  but: "Chez le pois, rond (A) domine ridé (a) et jaune (B) domine vert (b). Choisis les génotypes des parents ; l'échiquier de 16 cases se remplit. Surligne un phénotype pour compter ses cases.",
  aRetenir: "Un dihybride AaBb produit 4 types de gamètes en proportions égales (AB, Ab, aB, ab) car les deux gènes, sur des chromosomes différents, se séparent indépendamment. AaBb × AaBb donne 9 : 3 : 3 : 1 ; AaBb × aabb (test-cross) donne 1 : 1 : 1 : 1.",
  piege: "Les gamètes ne contiennent qu'un allèle de chaque gène : AB, Ab, aB ou ab, jamais « Aa » ni « AaBb ». Et 9 : 3 : 3 : 1 suppose des gènes indépendants (sur des chromosomes différents).",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette;
    var gl = ["AaBb", "AABB", "AABb", "AaBB", "AAbb", "aaBB", "Aabb", "aaBb", "aabb"];
    var opts = gl.map(function(g){ return [g, g]; });
    var p1 = k.select("Parent 1", opts, "AaBb"), p2 = k.select("Parent 2", opts, "AaBb");
    var hi = k.select("Surligner un phénotype", [["-", "(aucun)"], ["0", "rond jaune (A–B–)"], ["1", "rond vert (A–bb)"], ["2", "ridé jaune (aaB–)"], ["3", "ridé vert (aabb)"]], "-");
    var ro = k.readouts(["Rapport phénotypique", "Gamètes du parent 1", "Gamètes du parent 2"]);
    var cols = ["#e0b21c", "#5aa05a", "#f4e3a1", "#bfe0bf"], names = ["rond jaune", "rond vert", "ridé jaune", "ridé vert"];
    function gam(g){ var a = [g[0], g[1]], b = [g[2], g[3]], r = []; a.forEach(function(x){ b.forEach(function(y){ r.push(x + y); }); }); return r; }
    function ph(g){ return (g.indexOf("A") >= 0 ? 0 : 2) + (g.indexOf("B") >= 0 ? 0 : 1); }
    function seed(ctx, x, y, r, round, col){
      ctx.fillStyle = col; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1; ctx.beginPath();
      if (round) ctx.arc(x, y, r, 0, 6.2832); else for (var i = 0; i < 10; i++){ var a = i / 10 * 6.2832, rr = r * (i % 2 ? 0.72 : 1.05); ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, G1 = gam(p1.value), G2 = gam(p2.value);
      var cell = Math.min(66, Math.floor((c.W - 56) / 4)), ox = 40, oy = 52, cnt = [0, 0, 0, 0], h = hi.value === "-" ? -1 : +hi.value;
      S.draw.text(c, "Gamètes du parent 1 →", ox + 2 * cell, 12, {size: 12, color: P.acc});
      S.draw.text(c, "Parent 2", 22, oy - 18, {size: 12, color: P.red});
      for (var i = 0; i < 4; i++){
        S.draw.text(c, G1[i], ox + cell * (i + 0.5), oy - 12, {size: 13, color: P.acc});
        S.draw.text(c, G2[i], ox - 16, oy + cell * (i + 0.5), {size: 13, color: P.red});
        for (var j = 0; j < 4; j++){
          var g = sortG(G1[j][0], G2[i][0]) + sortG(G1[j][1], G2[i][1]), q = ph(g); cnt[q]++;
          var x = ox + j * cell, y = oy + i * cell; ctx.globalAlpha = (h < 0 || h === q) ? 1 : 0.22;
          ctx.fillStyle = cols[q]; ctx.fillRect(x, y, cell - 2, cell - 2);
          seed(ctx, x + cell / 2 - 1, y + cell / 2 - 10, 8, q < 2, "rgba(255,255,255,.35)");
          S.draw.text(c, g, x + cell / 2 - 1, y + cell - 14, {size: 12, color: P.ink});
          ctx.globalAlpha = 1;
        }
      }
      var items = cnt.map(function(v, q){ return {l: names[q].replace(" ", "\n"), v: v, c: cols[q]}; });
      var by = oy + 4 * cell + 28;
      S.draw.text(c, "Nombre de cases (sur 16)", c.W / 2, by - 8, {size: 12, color: P.grey});
      items.forEach(function(it){ it.l = it.l.split("\n")[0].slice(0, 5) + "."; });
      B.bars(c, S, items.map(function(it, q){ return {l: ["R.J.", "R.V.", "r.J.", "r.V."][q], v: it.v, c: it.c}; }), 20, by + 4, c.W - 40, 70, 16, function(v){ return v; });
      var gg = 0; cnt.forEach(function(v){ gg = B.gcd(gg, v); });
      ro.set(0, cnt.filter(function(v){ return v > 0; }).map(function(v){ return v / gg; }).join(" : "));
      var u = function(a){ var s = {}; a.forEach(function(x){ s[x] = 1; }); return Object.keys(s).join(" "); };
      ro.set(1, u(G1)); ro.set(2, u(G2));
    });
  }
});

SFA.sim({
  id: "b6-c02-produit", ch: "c02", tag: "Calcul",
  titre: "La règle du produit : calculer sans échiquier",
  resume: "Pour des gènes indépendants, on multiplie les probabilités de chaque gène : bien plus rapide qu'un échiquier de 256 cases.",
  but: "Les deux parents sont hétérozygotes pour 4 gènes indépendants (AaBbCcDd × AaBbCcDd). Choisis ce que tu cherches pour chaque gène : le produit des probabilités s'affiche, avec le schéma en aires.",
  aRetenir: "Pour un gène : P(phénotype dominant) = 3/4, P(récessif) = 1/4, P(AA) = 1/4, P(Aa) = 1/2. Pour plusieurs gènes indépendants, on multiplie. Exemple : dominant pour A et B, récessif pour C : 3/4 × 3/4 × 1/4 = 9/64.",
  piege: "On ne multiplie que si les gènes sont indépendants. Et ne confonds pas « génotype Aa » (1/2) et « phénotype dominant » (3/4) : ce dernier regroupe AA et Aa.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var T = [["d", "Phénotype dominant (3/4)", 3, 4], ["r", "Phénotype récessif (1/4)", 1, 4], ["h", "Génotype hétérozygote (1/2)", 1, 2], ["o", "Génotype homozygote dominant (1/4)", 1, 4], ["x", "Peu importe (1)", 1, 1]];
    var sels = ["A", "B", "C", "D"].map(function(g, i){ return k.select("Gène " + g, T.map(function(t){ return [t[0], t[1]]; }), i === 0 ? "d" : i === 1 ? "d" : i === 2 ? "r" : "x"); });
    var ro = k.readouts(["Produit", "Pourcentage", "Sur 1 000 descendants", "Taille de l'échiquier équivalent"]);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, num = 1, den = 1, facs = [];
      sels.forEach(function(s, i){ var t = T.filter(function(x){ return x[0] === s.value; })[0]; if (t[0] !== "x"){ num *= t[2]; den *= t[3]; facs.push([t[2], t[3]]); } });
      /* schéma en aires */
      var sz = Math.min(c.W - 40, 210), x0 = 20, y0 = 16, w = sz, h = sz;
      ctx.fillStyle = "#eef1f5"; ctx.fillRect(x0, y0, w, h);
      var cx = x0, cy = y0, cw = w, ch = h;
      facs.forEach(function(f, i){
        var p = f[0] / f[1];
        if (i % 2 === 0){ cw = cw * p; } else { ch = ch * p; }
      });
      ctx.fillStyle = P.acc; ctx.fillRect(cx, cy, cw, ch);
      /* quadrillage progressif */
      cw = w; ch = h; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
      facs.forEach(function(f, i){
        var p = f[0] / f[1];
        if (i % 2 === 0){ ctx.beginPath(); ctx.moveTo(cx + cw * p, cy); ctx.lineTo(cx + cw * p, cy + ch); ctx.stroke(); cw *= p; }
        else { ctx.beginPath(); ctx.moveTo(cx, cy + ch * p); ctx.lineTo(cx + cw, cy + ch * p); ctx.stroke(); ch *= p; }
      });
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y0, w, h);
      S.draw.text(c, "Aire bleue = probabilité (carré entier = 100 %)", c.W / 2, y0 + sz + 14, {size: 12, color: P.grey});
      var bars = [], cum = 1; facs.forEach(function(f, i){ cum *= f[0] / f[1]; bars.push({l: "×" + (i + 1), v: cum * 100, c: P.acc}); });
      S.draw.text(c, facs.length ? facs.map(function(f){ return f[0] + "/" + f[1]; }).join(" × ") + " = " + frac(num, den) : "Aucune condition : probabilité 1", c.W / 2, y0 + sz + 38, {size: 14, color: P.acc});
      if (bars.length){
        S.draw.text(c, "Probabilité cumulée après chaque gène (%)", c.W / 2, y0 + sz + 66, {size: 12, color: P.grey});
        B.bars(c, S, bars, 30, y0 + sz + 84, c.W - 60, 56, 100, function(v){ return S.fmt(v, v < 10 ? 1 : 0) + " %"; });
      }
      ro.set(0, frac(num, den)); ro.set(1, S.fmt(num / den * 100, 2) + " %"); ro.set(2, "≈ " + S.fmt(1000 * num / den, 0));
      ro.set(3, "256 cases (16 × 16)");
    });
  }
});

SFA.sim({
  id: "b6-c02-khi2", ch: "c02", tag: "Statistique",
  titre: "Le test du khi-deux : l'écart est-il dû au hasard ?",
  resume: "Compare des effectifs observés aux proportions attendues : le khi-deux (χ²) et la probabilité de l'écart décident.",
  but: "Choisis un jeu de données (Mendel, Morgan…) ou modifie toi-même les effectifs observés : fais glisser le sommet d'une barre à la souris ou au doigt. Le simulateur calcule χ² = Σ (observé − attendu)² / attendu et le place sur la courbe de la loi du χ², face au seuil de 5 %.",
  aRetenir: "Si χ² est inférieur au seuil (3,84 pour 1 degré de liberté, 7,81 pour 3), l'écart est compatible avec le hasard : on ne rejette pas le modèle. Au-dessus, le modèle est rejeté. Pour les données de Morgan, un χ² énorme signale que les gènes ne sont pas indépendants : ils sont liés.",
  piege: "« Ne pas rejeter » ne veut pas dire « prouver » : on dit que les données sont compatibles avec le modèle. Le test exige des effectifs attendus d'au moins 5 par classe.",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 440 : 430), P = S.draw.palette, vfix = null, drag = -1, bars = [];
    var DATA = {
      pois: {m: "d", v: [315, 108, 101, 32], t: "Pois de Mendel (rond/ridé, jaune/vert)"},
      mois: {m: "t", v: [787, 277, 0, 0], t: "Pois de Mendel (tige haute/naine)"},
      dros: {m: "u", v: [965, 944, 206, 185], t: "Drosophile, test-cross de Morgan"},
      perso: {m: "d", v: [90, 30, 30, 10], t: "Données personnalisées"}
    };
    var pre = k.select("Jeu de données", Object.keys(DATA).map(function(x){ return [x, DATA[x].t]; }), "pois", function(v){ var d = DATA[v]; model.value = d.m; model.set(d.m); for (var i = 0; i < 4; i++) sl[i].set(d.v[i]); vfix = null; });
    var model = k.seg("Modèle attendu", [["d", "9:3:3:1"], ["u", "1:1:1:1"], ["t", "3:1"]], "d");
    var sl = [0, 1, 2, 3].map(function(i){ return k.slider("Effectif de la classe " + (i + 1), 0, 1000, 1, DATA.pois.v[i], ""); });
    var ro = k.readouts(["Total", "χ²", "Degrés de liberté", "Probabilité (p)"]);
    var note = k.note("", "");
    var FR = {d: [9 / 16, 3 / 16, 3 / 16, 1 / 16], u: [0.25, 0.25, 0.25, 0.25], t: [0.75, 0.25]};
    c.pointer(function(t, p){
      if (t === "down"){ drag = -1; bars.forEach(function(b, i){ if (p.x >= b.x0 - 6 && p.x <= b.x1 + 6 && p.y >= b.top - 14 && p.y <= b.base + 8) drag = i; }); if (drag >= 0){ vfix = bars.vmax; } }
      if ((t === "down" || t === "drag") && drag >= 0){ var b = bars[drag], v = Math.round((b.base - p.y) / (b.base - b.ytop) * vfix); sl[drag].set(Math.max(0, Math.min(1000, v))); }
      if (t === "up"){ drag = -1; vfix = null; }
    });
    k.draw(function(){
      c.clear(); var fr = FR[model.value], nc = fr.length, O = [], N = 0, i, ctx = c.ctx, W = c.W;
      for (i = 0; i < nc; i++){ O.push(sl[i].value); N += sl[i].value; }
      var E = fr.map(function(f){ return f * N; }), chi = 0, small = false;
      if (N > 0) for (i = 0; i < nc; i++){ chi += E[i] > 0 ? Math.pow(O[i] - E[i], 2) / E[i] : 0; if (E[i] < 5) small = true; }
      var df = nc - 1, p = df === 1 ? B.erfc(Math.sqrt(chi / 2)) : B.erfc(Math.sqrt(chi / 2)) + Math.sqrt(2 * chi / Math.PI) * Math.exp(-chi / 2);
      if (N === 0) p = 1;
      var crit = df === 1 ? 3.84 : 7.81, vmax = vfix || Math.max(20, Math.max.apply(null, O.concat(E))) * 1.18;
      /* barres (le sommet se glisse) */
      var x0 = 40, w = W - 56, base = 196, ytop = 34, bw = Math.min(64, w / nc * 0.62); bars = []; bars.vmax = vmax;
      S.draw.text(c, "Effectifs observés (glisse un sommet) et attendus (pointillés)", W / 2, 12, {size: 12, color: P.grey});
      ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0 - 8, base); ctx.lineTo(x0 + w, base); ctx.stroke();
      var cols = ["#1f4b9e", "#24775a", "#c26a0c", "#6236c4"];
      O.forEach(function(v, q){
        var cx = x0 + w * (q + 0.5) / nc, bh = (base - ytop) * Math.min(1, v / vmax), eh = (base - ytop) * Math.min(1, E[q] / vmax);
        var g = ctx.createLinearGradient(0, base - bh, 0, base); g.addColorStop(0, cols[q]); g.addColorStop(1, S.draw.tint(cols[q], 0.7));
        ctx.fillStyle = g; S.draw.rrect(c, cx - bw / 2, base - bh, bw, bh, 5); ctx.fill();
        ctx.strokeStyle = P.ink; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(cx - bw / 2 - 5, base - eh); ctx.lineTo(cx + bw / 2 + 5, base - eh); ctx.stroke(); ctx.setLineDash([]);
        /* poignée */
        S.draw.dot(c, cx, base - bh, 7, drag === q ? P.red : "#fff"); ctx.beginPath(); ctx.arc(cx, base - bh, 7, 0, 6.2832); ctx.lineWidth = 2.2; ctx.strokeStyle = cols[q]; ctx.stroke();
        S.draw.text(c, S.fmt(v, 0), cx, base - bh - 18, {size: 12.5});
        S.draw.text(c, "classe " + (q + 1), cx, base + 12, {size: 11.5, weight: 600});
        S.draw.text(c, "att. " + S.fmt(E[q], 1), cx, base + 26, {size: 10.5, color: P.grey, weight: 600});
        bars.push({x0: cx - bw / 2, x1: cx + bw / 2, top: base - bh, base: base, ytop: ytop});
      });
      /* loi du khi-deux */
      var gy = 250, ax = S.draw.axes(c, {x0: 0, x1: 14, y0: 0, y1: 0.5, t: gy, b: 28, l: 40, r: 14, stepX: 2, stepY: 0.25, xl: "χ²", grid: true});
      var f = df === 1 ? function(x){ return Math.min(0.5, Math.exp(-x / 2) / Math.sqrt(2 * Math.PI * Math.max(x, 1e-4))); } : function(x){ return Math.sqrt(x) * Math.exp(-x / 2) / 2.5066; };
      S.draw.area(c, ax, f, crit, 14, P.red, 0.28); S.draw.area(c, ax, f, 0, crit, P.green, 0.12);
      S.draw.fn(c, ax, f, P.ink, 2);
      S.draw.line(c, ax.X(crit), ax.T, ax.X(crit), ax.B, P.red, 1.6, [5, 4]);
      S.draw.text(c, "seuil 5 % : " + S.fmt(crit, 2), ax.X(crit) + 5, ax.T + 8, {align: "left", size: 11, color: P.red});
      S.draw.text(c, "loi du χ² (" + df + " ddl)", ax.R - 4, ax.T + 8, {align: "right", size: 11, color: P.grey});
      var cc = Math.min(13.6, chi), yy = Math.min(0.46, f(Math.max(cc, 0.15)));
      if (N > 0){ S.draw.line(c, ax.X(cc), ax.B, ax.X(cc), ax.Y(yy), chi > crit ? P.red : P.green, 2); S.draw.dot(c, ax.X(cc), ax.Y(yy), 6.5, chi > crit ? P.red : P.green); S.draw.label(c, "χ² = " + S.fmt(chi, 2) + (chi > 13.6 ? " →" : ""), Math.min(W - 60, Math.max(60, ax.X(cc))), ax.B - 14, {color: chi > crit ? P.red : P.green, size: 11.5}); }
      ro.set(0, N); ro.set(1, S.fmt(chi, 2)); ro.set(2, df); ro.set(3, p < 0.001 ? "< 0,001" : S.fmt(p, 3));
      if (N === 0) note.set("Aucun effectif : règle les curseurs ou glisse les barres.", "warn");
      else if (chi > crit) note.set("χ² = " + S.fmt(chi, 2) + " &gt; seuil " + S.fmt(crit, 2) + " : l'écart est trop grand pour être dû au seul hasard (p &lt; 5 %). <b>On rejette le modèle</b>." + (model.value === "u" ? " Pour un test-cross dihybride, cela signale des gènes liés." : ""), "warn");
      else note.set("χ² = " + S.fmt(chi, 2) + " ≤ seuil " + S.fmt(crit, 2) + " : l'écart est compatible avec le hasard. <b>Le modèle n'est pas rejeté.</b>", "ok");
      if (model.value === "t" && N > 0) note.set(note.el.innerHTML + " <i>Modèle 3 : 1 : seules les classes 1 et 2 comptent ; les curseurs 3 et 4 sont ignorés.</i>", chi > crit ? "warn" : "ok");
      if (small && N > 0) note.set(note.el.innerHTML + " <i>Attention : un effectif attendu est inférieur à 5, le test est peu fiable.</i>", "warn");
    });
  }
});


SFA.sim({
  id: "b6-c02-explosion", ch: "c02", tag: "Niche utile",
  titre: "Combien de gènes ? L'explosion des combinaisons",
  resume: "Avec n gènes hétérozygotes, les gamètes différents sont 2ⁿ et les cases d'un échiquier 4ⁿ : obtenir un double récessif devient vite improbable.",
  but: "Fais varier le nombre n de gènes hétérozygotes indépendants chez deux parents (AaBb… × AaBb…). Le haut montre les gamètes différents (une pastille pleine = allèle dominant, creuse = récessif) ; le graphique logarithmique compare 2ⁿ, 3ⁿ et 4ⁿ à des ordres de grandeur connus. Lis la probabilité d'un descendant entièrement récessif et le nombre de descendants nécessaires.",
  aRetenir: "Pour n gènes hétérozygotes indépendants : 2ⁿ gamètes différents, 3ⁿ génotypes possibles, 2ⁿ phénotypes, 4ⁿ cases d'échiquier, et P(tout récessif) = (1/4)ⁿ. Chez l'humain (23 paires), 2²³ ≈ 8,4 millions de gamètes différents avant même le crossing-over.",
  piege: "Ces calculs supposent des gènes indépendants et tous hétérozygotes. Les gènes liés (même chromosome) ne se combinent pas librement, et la plupart des gènes ne sont pas hétérozygotes chez un individu donné.",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 470 : 450), P = S.draw.palette;
    var n = k.slider("Gènes hétérozygotes indépendants (n)", 1, 23, 1, 4, "");
    var m = k.slider("Descendants obtenus", 1, 200, 1, 16, "");
    var ro = k.readouts(["Gamètes différents 2ⁿ", "Génotypes 3ⁿ", "Cases de l'échiquier 4ⁿ", "P(tout récessif)", "P(au moins un) parmi les descendants", "Descendants pour 95 % de chances"]);
    var cols = ["#1f4b9e", "#c0321d", "#24775a", "#c26a0c", "#6236c4", "#0e7f96", "#c43a7a", "#8a95a3"];
    k.draw(function(){
      c.clear(); var N = n.value, M = m.value, ctx = c.ctx, W = c.W, i, j;
      /* gamètes */
      var tot = Math.pow(2, N), show = Math.min(tot, 32), dn = Math.min(N, 8), sz = Math.min(10, Math.floor((W - 24) / (8 * 2 + 3) / 1.4)) ;
      S.draw.text(c, N <= 5 ? "Les " + tot + " gamètes différents d'un individu à " + N + " gène" + (N > 1 ? "s" : "") + " hétérozygote" + (N > 1 ? "s" : "") : "Les 32 premiers des " + S.sci(tot, 3) + " gamètes différents", 10, 12, {align: "left", size: 12.5});
      var cellW = Math.max(sz * 2 * dn / 2 + 8, 0), gw = dn * (sz * 1.5 + 1) + 10, per = Math.max(1, Math.floor((W - 16) / gw)), rows = Math.ceil(show / per);
      for (i = 0; i < show; i++){
        var gx = 8 + (i % per) * gw, gy = 30 + Math.floor(i / per) * (sz * 1.5 + 8);
        for (j = 0; j < dn; j++){
          var dom = !((i >> (N - 1 - j)) & 1), px = gx + j * (sz * 1.5 + 1) + sz * .75, py = gy + sz * .75;
          ctx.beginPath(); ctx.arc(px, py, sz * .65, 0, 6.2832); if (dom){ ctx.fillStyle = cols[j]; ctx.fill(); } else { ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = cols[j]; ctx.stroke(); }
        }
      }
      if (N > 8) S.draw.text(c, "(8 premiers gènes dessinés)", W - 10, 12, {align: "right", size: 10.5, color: P.grey});
      /* graphique log */
      var top = Math.max(60, 30 + rows * (sz * 1.5 + 8) + 14);
      var ax = S.draw.axes(c, {x0: 0, x1: 24, y0: 0, y1: 14, stepX: 2, stepY: 2, xl: "n (gènes)", yl: "puissance de 10", l: 44, t: top, b: 34});
      var f2 = function(x){ return x * Math.LOG10E * Math.LN2; }, f3 = function(x){ return x * Math.log10(3); }, f4 = function(x){ return x * Math.log10(4); };
      [[7.07, "Belgique : 10⁷ habitants"], [10.9, "Terre : 8·10⁹ humains"]].forEach(function(rf){ S.draw.line(c, ax.L, ax.Y(rf[0]), ax.R, ax.Y(rf[0]), "#9aa6b5", 1.2, [3, 4]); S.draw.text(c, rf[1], ax.L + 8, ax.Y(rf[0]) - 8, {align: "left", size: 10.5, color: P.grey}); });
      S.draw.fn(c, ax, f4, P.red, 2.4); S.draw.fn(c, ax, f3, P.amber, 2.4); S.draw.fn(c, ax, f2, P.acc, 2.4);
      S.draw.label(c, "4ⁿ", ax.X(Math.min(21.5, 12.2 / Math.log10(4))), ax.Y(f4(Math.min(21.5, 12.2 / Math.log10(4)))) - 4, {color: P.red, size: 12, math: true});
      S.draw.label(c, "3ⁿ", ax.X(23), ax.Y(f3(23)) - 8, {color: P.amber, size: 12, math: true});
      S.draw.label(c, "2ⁿ", ax.X(23), ax.Y(f2(23)) + 12, {color: P.acc, size: 12, math: true});
      S.draw.line(c, ax.X(N), ax.T, ax.X(N), ax.B, P.grey, 1.2, [4, 3]);
      S.draw.dot(c, ax.X(N), ax.Y(f2(N)), 5.5, P.acc); S.draw.dot(c, ax.X(N), ax.Y(f3(N)), 5.5, P.amber); S.draw.dot(c, ax.X(N), ax.Y(f4(N)), 5.5, P.red);
      var p = Math.pow(0.25, N), pa = -Math.expm1(M * Math.log1p(-p)), need = Math.log(0.05) / Math.log1p(-p);
      ro.set(0, S.sci(Math.pow(2, N), 3)); ro.set(1, S.sci(Math.pow(3, N), 3)); ro.set(2, S.sci(Math.pow(4, N), 3));
      ro.set(3, "1/" + S.sci(Math.pow(4, N), 3) + " ≈ " + S.sci(p, 2));
      ro.set(4, pa < 0.0001 ? S.sci(pa, 2) : S.fmt(pa * 100, 2) + " %");
      ro.set(5, need > 1e9 ? "plus de 10⁹" : S.fmt(Math.ceil(need - 1e-9), 0));
    });
  }
});


})();
