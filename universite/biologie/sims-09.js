/* Biologie BA1 · chapitre 9 : transmission des caractères */
(function(){
function erfc(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z); var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function phi(z){ return 0.5 * erfc(-z / Math.SQRT2); }
function pchi(x, df){ if (x <= 0) return 1; var p = erfc(Math.sqrt(x / 2)); if (df === 1) return p; return p + Math.sqrt(2 * x / Math.PI) * Math.exp(-x / 2); }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function pfmt(S, p){ return p < 0.001 ? "&lt; 0,001" : S.fmt(p, 3); }

/* 1. Croisements et chi² */
SFA.sim({
  id:"ub-c09-croisements-chi2", ch:"c09", tag:"Statistique",
  titre:"Croisements mono et dihybrides : le test du χ²",
  resume:"Tire un échantillon de descendants, compare à 3:1 ou 9:3:3:1 et teste l'écart.",
  but:"Choisis le croisement, la taille de l'échantillon et le vrai rapport ; tire des échantillons et regarde quand le χ² rejette (ou non) le rapport mendélien.",
  aRetenir:"χ² = Σ (O − E)² / E, avec E calculé sur l'effectif total d'après le rapport attendu. Degrés de liberté = nombre de classes − 1 (1 pour 3:1, 3 pour 9:3:3:1). On rejette l'hypothèse mendélienne si χ² dépasse 3,84 (1 ddl) ou 7,81 (3 ddl) au seuil de 5 %. Un χ² faible ne prouve pas l'hypothèse : il ne la contredit pas. Liaison génétique (r &lt; 50 %) : le rapport 9:3:3:1 est rejeté si l'échantillon est assez grand.",
  piege:"On compare des effectifs, jamais des pourcentages. Chaque effectif attendu doit être ≥ 5. Un échantillon trop petit ne détecte pas une déviation réelle (faible puissance) ; deux tirages du même croisement donnent des χ² différents (fluctuation d'échantillonnage). Tirage simulé, graine fixe : « Nouveau tirage » change l'échantillon.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette, seed = 12345;
    var mode = k.seg("Croisement", [["m","Monohybride (3:1)"],["d","Dihybride (9:3:3:1)"]], "m");
    var N = k.slider("Effectif N", 20, 2000, 20, 160, "");
    var q = k.slider("Vraie proportion du phénotype dominant (mono)", 50, 90, 1, 75, "%");
    var r = k.slider("Vraie fréquence de recombinaison r (di)", 0, 50, 1, 50, "%");
    k.button("Nouveau tirage", function(){ seed += 977; }, true);
    var ro = k.readouts(["χ²","ddl","Seuil 5 %","p"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var m = mode.value, probs, exp, names, df;
      if (m === "m"){ probs = [q.value / 100, 1 - q.value / 100]; exp = [0.75, 0.25]; names = ["Dominant", "Récessif"]; df = 1; }
      else { var rr = r.value / 100, rec = Math.pow((1 - rr) / 2, 2); probs = [0.5 + rec, 0.25 - rec, 0.25 - rec, rec]; exp = [9 / 16, 3 / 16, 3 / 16, 1 / 16]; names = ["A_B_", "A_bb", "aaB_", "aabb"]; df = 3; }
      var R = rng(seed + N.value * 31 + (m === "m" ? 1 : 2)), obs = probs.map(function(){ return 0; }), i, j;
      for (i = 0; i < N.value; i++){ var u = R(), acc = 0; for (j = 0; j < probs.length; j++){ acc += probs[j]; if (u < acc || j === probs.length - 1){ obs[j]++; break; } } }
      var E = exp.map(function(e){ return e * N.value; }), chi = 0;
      for (j = 0; j < E.length; j++) chi += Math.pow(obs[j] - E[j], 2) / E[j];
      var crit = df === 1 ? 3.841 : 7.815, p = pchi(chi, df);
      var mx = Math.max.apply(null, obs.concat(E)) * 1.15, bw = (c.W - 60) / names.length, ctx = c.ctx, base = 250;
      for (j = 0; j < names.length; j++){
        var x = 40 + j * bw, h1 = obs[j] / mx * 190, h2 = E[j] / mx * 190;
        ctx.fillStyle = pal.acc; ctx.fillRect(x + 8, base - h1, bw / 2 - 12, h1);
        ctx.fillStyle = "#cfd6e0"; ctx.fillRect(x + bw / 2 - 2, base - h2, bw / 2 - 12, h2);
        S.draw.text(c, obs[j] + "", x + bw / 4 + 2, base - h1 - 10, {size:12, color:pal.acc});
        S.draw.text(c, S.fmt(E[j], 1), x + 3 * bw / 4 - 8, base - h2 - 10, {size:11, color:pal.grey});
        S.draw.text(c, names[j], x + bw / 2 - 2, base + 16, {size:12});
      }
      S.draw.text(c, "bleu = observé · gris = attendu (rapport mendélien)", 20, 18, {align:"left", size:11, weight:600, color:pal.grey});
      ro.set(0, S.fmt(chi, 2)); ro.set(1, df); ro.set(2, S.fmt(crit, 2)); ro.set(3, pfmt(S, p));
      var low = Math.min.apply(null, E) < 5;
      note.set((chi > crit ? "χ² &gt; seuil : on rejette le rapport mendélien attendu (p &lt; 0,05)." : "χ² ≤ seuil : écart compatible avec le hasard, on ne rejette pas le rapport.") + (low ? " Attention : un effectif attendu est inférieur à 5 (" + S.fmt(Math.min.apply(null, E), 1) + ") : le test du χ² n'est pas fiable, augmente N." : ""), (chi > crit || low) ? "warn" : "ok");
    });
  }
});

/* 2. Liaison génétique */
SFA.sim({
  id:"ub-c09-liaison-trois-points", ch:"c09", tag:"Cartographie",
  titre:"Liaison génétique : croisement-test à trois points",
  resume:"Distances en cM, double crossing-over, coefficient de coïncidence.",
  but:"Fixe les distances A–B et B–C et la coïncidence ; observe les 8 classes de descendants et reconstruis la carte.",
  aRetenir:"Croisement-test ABC/abc × abc/abc : les classes parentales sont les plus fréquentes, les doubles recombinants (DCO) sont les plus rares et ne diffèrent des parentales que par le gène du milieu : cela donne l'ordre des gènes. Distance (cM) = % de recombinants. Coïncidence = DCO observés / DCO attendus (d₁·d₂) ; interférence = 1 − coïncidence. Distance A–C = d₁ + d₂ − 2·DCO : sans compter les DCO on sous-estime la distance.",
  piege:"1 cM ≈ 1 % de recombinants seulement pour les petites distances (≤ 20–30 cM) : la fréquence de recombinaison plafonne à 50 %. Deux gènes distants de plus de 50 cM sur un même chromosome peuvent donc sembler indépendants. Les valeurs affichées sont les effectifs attendus (arrondis), sans fluctuation d'échantillonnage.",
  build:function(k,S){
    var c = k.canvas(310), pal = S.draw.palette;
    var d1 = k.slider("Distance A–B", 1, 40, 1, 12, "cM");
    var d2 = k.slider("Distance B–C", 1, 40, 1, 18, "cM");
    var co = k.slider("Coïncidence", 0, 1, 0.1, 0.6, "");
    var N = k.slider("Descendants N", 500, 5000, 500, 2000, "");
    var ro = k.readouts(["Double CO attendus","Distance A–C apparente (sans les DCO)","d₁ + d₂ (distance réelle A–C)","Interférence"]);
    k.draw(function(){
      c.clear();
      var a = d1.value / 100, b = d2.value / 100, dco = co.value * a * b, n = N.value;
      var par = 1 - a - b + dco, s1 = a - dco, s2 = b - dco;
      var cls = [["A B C","Parentale",par / 2,"#2e6b55"],["a b c","Parentale",par / 2,"#2e6b55"],["A b c","Recombinant A–B",s1 / 2,"#b45309"],["a B C","Recombinant A–B",s1 / 2,"#b45309"],["A B c","Recombinant B–C",s2 / 2,"#1e3f8f"],["a b C","Recombinant B–C",s2 / 2,"#1e3f8f"],["A b C","Double CO",dco / 2,"#b42318"],["a B c","Double CO",dco / 2,"#b42318"]];
      var mx = Math.max(par / 2, 0.01), ctx = c.ctx, base = 25, bw = c.W - 230;
      cls.forEach(function(cl, i){
        var y = base + i * 26, cnt = Math.round(cl[2] * n);
        S.draw.text(c, cl[0], 14, y + 8, {align:"left", size:12, math:true});
        ctx.fillStyle = cl[3]; ctx.fillRect(66, y, Math.max(1, cl[2] / mx * bw), 16);
        S.draw.text(c, cnt + "", 66 + Math.max(1, cl[2] / mx * bw) + 6, y + 8, {align:"left", size:11});
        S.draw.text(c, cl[1], c.W - 14, y + 8, {align:"right", size:10, color:pal.grey});
      });
      /* carte génétique */
      var x0 = 30, x1 = c.W - 30, tot = Math.max(1, d1.value + d2.value), my = 270, sc = (x1 - x0) / tot;
      S.draw.line(c, x0, my, x1, my, pal.ink, 3);
      var xs = [x0, x0 + d1.value * sc, x1], nm = ["A","B","C"];
      xs.forEach(function(x, i){ S.draw.dot(c, x, my, 6, pal.acc); S.draw.text(c, nm[i], x, my + 18, {size:13}); });
      S.draw.text(c, d1.value + " cM", (xs[0] + xs[1]) / 2, my - 14, {size:11}); S.draw.text(c, d2.value + " cM", (xs[1] + xs[2]) / 2, my - 14, {size:11});
      var ac = (a + b - 2 * dco) * 100;
      ro.set(0, Math.round(dco * n)); ro.set(1, S.fmt(ac, 1) + " cM"); ro.set(2, S.fmt(d1.value + d2.value, 0) + " cM"); ro.set(3, S.fmt(1 - co.value, 1));
    });
  }
});

/* 3. Arbre généalogique : risque */
SFA.sim({
  id:"ub-c09-risque-heredite", ch:"c09", tag:"Génétique médicale",
  titre:"Calcul de risque : autosomique, dominant, lié à l'X",
  resume:"Échiquier de croisement et probabilité d'un enfant atteint, porteur, selon le sexe.",
  but:"Choisis le mode de transmission et le couple ; lis le risque par enfant, par garçon et par fille.",
  aRetenir:"Récessif autosomique : Aa × Aa → 1/4 atteints, 1/2 porteurs ; un sujet sain issu de ce couple est porteur avec probabilité 2/3. Dominant : un parent hétérozygote atteint transmet avec probabilité 1/2. Récessif lié à l'X : une mère porteuse a 1/2 de garçons atteints et 1/2 de filles porteuses ; un père atteint transmet son X à toutes ses filles (porteuses) et jamais à ses fils.",
  piege:"« 2/3, pas 1/2 » : on sait que l'individu n'est pas aa, il reste 3 génotypes (AA, Aa, Aa) dont 2 porteurs. Chaque grossesse est indépendante : après un enfant atteint, le risque reste 1/4. Lié à l'X : le sexe de l'enfant se lit dans le gamète paternel (Y → garçon).",
  build:function(k,S){
    var c = k.canvas(290), pal = S.draw.palette;
    var sit = k.select("Situation", [
      ["r1","Autosomique récessif : Aa × Aa"],["r2","Autosomique récessif : Aa × aa"],["r3","Autosomique récessif : Aa × AA"],
      ["r4","Récessif : frère atteint, partenaire pris au hasard"],
      ["d1","Autosomique dominant : Dd × dd"],["d2","Autosomique dominant : Dd × Dd"],
      ["x1","Récessif lié à l'X : mère porteuse × père sain"],["x2","Récessif lié à l'X : mère saine × père atteint"],["x3","Récessif lié à l'X : mère porteuse × père atteint"]], "r1");
    var f = k.slider("Partenaire : 1 porteur sur", 10, 500, 5, 25, "");
    var ro = k.readouts(["Enfant atteint","Garçon atteint","Fille atteinte","Enfant porteur (sain)"]);
    var note = k.note("", "ok");
    var defs = {
      r1:{t:"A", m:["A","a"], p:["A","a"]}, r2:{t:"A", m:["A","a"], p:["a","a"]}, r3:{t:"A", m:["A","a"], p:["A","A"]},
      d1:{t:"D", m:["D","d"], p:["d","d"]}, d2:{t:"D", m:["D","d"], p:["D","d"]},
      x1:{t:"X", m:["XA","Xa"], p:["XA","Y"]}, x2:{t:"X", m:["XA","XA"], p:["Xa","Y"]}, x3:{t:"X", m:["XA","Xa"], p:["Xa","Y"]}
    };
    k.draw(function(){
      c.clear();
      var v = sit.value, ctx = c.ctx;
      if (v === "r4"){
        var risk = 2 / 3 * (1 / f.value) * 0.25;
        S.draw.text(c, "Les parents du frère atteint sont tous deux porteurs (Aa × Aa).", c.W / 2, 40, {size:12});
        S.draw.text(c, "P(sujet sain est porteur) = 2/3", c.W / 2, 80, {size:14});
        S.draw.text(c, "P(partenaire porteur) = 1/" + f.value, c.W / 2, 112, {size:14});
        S.draw.text(c, "P(enfant atteint | les deux porteurs) = 1/4", c.W / 2, 144, {size:14});
        S.draw.text(c, "Risque = 2/3 × 1/" + f.value + " × 1/4 = 1/" + S.fmt(f.value * 6, 0) + " (" + S.fmt(risk * 100, 2) + " %)", c.W / 2, 200, {size:15, color:pal.red});
        ro.set(0, "1/" + S.fmt(f.value * 6, 0)); ro.set(1, "idem"); ro.set(2, "idem"); ro.set(3, "—");
        note.set("Pas d'échiquier : on combine des probabilités indépendantes (multiplication).", "ok"); return;
      }
      var d = defs[v], cells = [], aff = {all:0, b:0, g:0}, car = 0, nb = 0, ng = 0, i, j;
      for (i = 0; i < 2; i++) for (j = 0; j < 2; j++){
        var m = d.m[i], p = d.p[j], isAff, sex = null, isCar = false, lab;
        if (d.t === "X"){ sex = p === "Y" ? "G" : "F"; isAff = sex === "G" ? m === "Xa" : (m === "Xa" && p === "Xa"); isCar = sex === "F" && ((m === "Xa") !== (p === "Xa")); lab = (sex === "G" ? m + "Y" : m + p); }
        else { lab = d.t === "A" ? (m === p ? m + p : "Aa") : (m === p ? m + p : "Dd"); isAff = d.t === "A" ? (m === "a" && p === "a") : (m === "D" || p === "D"); isCar = d.t === "A" && m !== p; }
        cells.push({m:m, p:p, lab:lab, aff:isAff, car:isCar, sex:sex});
        if (isAff) aff.all += 0.25; if (isCar) car += 0.25;
      }
      var w = Math.min(130, (c.W - 80) / 2), x0 = 70, y0 = 60;
      S.draw.text(c, "gamètes du père →", x0 + w, 24, {size:11, color:pal.grey});
      for (j = 0; j < 2; j++) S.draw.text(c, d.p[j], x0 + w / 2 + j * w, 46, {size:13});
      for (i = 0; i < 2; i++) S.draw.text(c, d.m[i], 40, y0 + 32 + i * 64, {size:13});
      S.draw.text(c, "mère", 18, y0 - 4, {size:10, color:pal.grey});
      cells.forEach(function(cl, n){
        var x = x0 + (n % 2) * w, y = y0 + Math.floor(n / 2) * 64;
        ctx.fillStyle = cl.aff ? "#f6c6c0" : cl.car ? "#fff0c2" : "#e1f0e8"; ctx.fillRect(x, y, w - 4, 60);
        S.draw.text(c, cl.lab + (cl.sex ? (cl.sex === "G" ? " (garçon)" : " (fille)") : ""), x + (w - 4) / 2, y + 22, {size:12, math:true});
        S.draw.text(c, cl.aff ? "atteint" : cl.car ? "porteur" : "sain", x + (w - 4) / 2, y + 42, {size:11, color:cl.aff ? pal.red : pal.grey});
      });
      S.draw.text(c, "rouge = atteint · jaune = porteur sain · vert = sain non porteur", 20, 215, {align:"left", size:11, weight:600, color:pal.grey});
      if (d.t === "X"){
        cells.forEach(function(cl){ if (cl.sex === "G"){ nb += 1; if (cl.aff) aff.b += 1; } else { ng += 1; if (cl.aff) aff.g += 1; } });
        ro.set(0, S.fmt(aff.all * 100, 0) + " %"); ro.set(1, S.fmt(nb ? aff.b / nb * 100 : 0, 0) + " %"); ro.set(2, S.fmt(ng ? aff.g / ng * 100 : 0, 0) + " %"); ro.set(3, ng ? S.fmt(cells.filter(function(z){ return z.car; }).length / ng * 100, 0) + " % des filles" : "—");
      } else {
        ro.set(0, S.fmt(aff.all * 100, 0) + " %"); ro.set(1, S.fmt(aff.all * 100, 0) + " %"); ro.set(2, S.fmt(aff.all * 100, 0) + " %"); ro.set(3, d.t === "A" ? S.fmt(car * 100, 0) + " %" : "—");
      }
      note.set(d.t === "X" ? "Chaque case : gamète maternel × gamète paternel ; Y du père → garçon. Les proportions sont données par sexe." : "Chaque case a une probabilité de 1/4 ; garçons et filles ont le même risque (transmission autosomique).", "ok");
    });
  }
});

/* 4. Groupes sanguins */
SFA.sim({
  id:"ub-c09-groupes-sanguins", ch:"c09", tag:"Codominance",
  titre:"Groupes ABO et Rhésus : hérédité, transfusion, incompatibilité fœto-maternelle",
  resume:"Probabilités des groupes de l'enfant ; compatibilité donneur/receveur ; risque Rh.",
  but:"Choisis les génotypes des parents pour obtenir les groupes possibles de l'enfant, puis teste une transfusion : si le receveur possède des anticorps contre les antigènes du donneur, les globules s'agglutinent.",
  aRetenir:"ABO : allèles A et B codominants, O récessif. Un parent AB × O ne donne jamais d'enfant AB ni O. Rhésus : D (Rh+) dominant sur d (Rh−). Transfusion : les globules du donneur ne doivent porter aucun antigène (A, B, D) absent chez le receveur. Mère Rh− (dd) et père D_ : enfant Rh+ possible ; la mère peut s'immuniser (anticorps anti-D) à l'accouchement et menacer une grossesse ultérieure d'un fœtus Rh+.",
  piege:"Le groupe O n'a ni A ni B sur les globules rouges : donneur O universel pour les globules, mais son plasma contient des anticorps anti-A et anti-B. Un receveur Rh− n'a des anticorps anti-D qu'après immunisation (pas naturels). Génotype A ≠ groupe A : AO et AA donnent tous deux le groupe A.",
  build:function(k,S){
    var c = k.canvas(430), pal = S.draw.palette, B = S.bio, tt = 0, rnd = Math.random;
    var G = [["AA","AA (groupe A)"],["AO","AO (groupe A)"],["BB","BB (groupe B)"],["BO","BO (groupe B)"],["AB","AB (groupe AB)"],["OO","OO (groupe O)"]];
    var m = k.select("Génotype ABO de la mère", G, "AO"), p = k.select("Génotype ABO du père", G, "BO");
    var rm = k.select("Rhésus de la mère", [["DD","DD (Rh+)"],["Dd","Dd (Rh+)"],["dd","dd (Rh−)"]], "dd");
    var rp = k.select("Rhésus du père", [["DD","DD (Rh+)"],["Dd","Dd (Rh+)"],["dd","dd (Rh−)"]], "Dd");
    var don = k.select("Donneur (globules)", ["O−","O+","A−","A+","B−","B+","AB−","AB+"], "O−");
    var rec = k.select("Receveur", ["O−","O+","A−","A+","B−","B+","AB−","AB+"], "A+");
    var ro = k.readouts(["Transfusion","Enfant Rh+ ", "Enfant Rh−"]);
    var note = k.note("", "ok");
    function ph(g){ var s = g.indexOf("A") >= 0 && g.indexOf("B") >= 0 ? "AB" : g.indexOf("A") >= 0 ? "A" : g.indexOf("B") >= 0 ? "B" : "O"; return s; }
    function ant(grp){ var g = grp.replace(/[+−]/g, ""), r = grp.indexOf("+") >= 0; return {A:g.indexOf("A") >= 0, B:g.indexOf("B") >= 0, D:r}; }
    function antigens(x, y, r, grp, alpha){ var a = ant(grp), ctx = c.ctx, list = [];
      if (a.A) list.push(pal.red); if (a.B) list.push(pal.acc); if (a.D) list.push(pal.green);
      var n = 9; for (var q = 0; q < n; q++){ var col = list[q % Math.max(1, list.length)]; if (!list.length) break; var an = q * 6.2832 / n + .3; var ax = x + (r + 3) * Math.cos(an), ay = y + (r + 3) * Math.sin(an);
        ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + r * Math.cos(an), y + r * Math.sin(an)); ctx.lineTo(ax, ay); ctx.stroke(); ctx.beginPath(); ctx.arc(ax + 2.4 * Math.cos(an), ay + 2.4 * Math.sin(an), 3, 0, 7); ctx.fill(); ctx.restore(); } }
    function yab(x, y, col, s){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y + 8 * s); ctx.lineTo(x, y); ctx.lineTo(x - 6 * s, y - 8 * s); ctx.moveTo(x, y); ctx.lineTo(x + 6 * s, y - 8 * s); ctx.stroke(); ctx.restore(); }
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear(); B.bg(c, "#fbfdff", "#eef3f9"); tt += dt;
      var res = {A:0, B:0, AB:0, O:0}, i, j;
      for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) res[ph(m.value[i] + p.value[j])] += 0.25;
      var gm = rm.value === "DD" ? 0 : rm.value === "Dd" ? 0.5 : 1, gp = rp.value === "DD" ? 0 : rp.value === "Dd" ? 0.5 : 1, pneg = gm * gp;
      var names = ["A","B","AB","O"], cols = [pal.red, pal.acc, pal.violet, pal.green], bw = (W - 40) / 4;
      S.draw.text(c, "Groupes ABO possibles de l'enfant", 20, 18, {align:"left", size:12, color:pal.ink});
      names.forEach(function(nm, q){ var cx = 20 + bw * (q + .5), cy = 76, r = Math.min(24, bw * .26), pr = res[nm];
        ctx.save(); ctx.globalAlpha = pr > 0 ? 1 : .3; B.rbc(c, cx, cy, r, {mode:"disque"}); antigens(cx, cy, r, nm + "−"); ctx.restore();
        S.draw.text(c, nm, cx, cy + r + 18, {size:13, color:cols[q]});
        ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, cx - bw * .36, cy + r + 30, bw * .72, 10, 5); ctx.fill(); if (pr > 0){ ctx.fillStyle = cols[q]; S.draw.rrect(c, cx - bw * .36, cy + r + 30, Math.max(8, bw * .72 * pr), 10, 5); ctx.fill(); }
        S.draw.text(c, S.fmt(pr * 100, 0) + " %", cx, cy + r + 52, {size:12, color:pal.ink}); });
      /* transfusion */
      var ad = ant(don.value), ar = ant(rec.value), ok = (!ad.A || ar.A) && (!ad.B || ar.B) && (!ad.D || ar.D);
      var why = [];
      if (ad.A && !ar.A) why.push("antigène A du donneur reconnu par les anti-A du receveur");
      if (ad.B && !ar.B) why.push("antigène B du donneur reconnu par les anti-B du receveur");
      if (ad.D && !ar.D) why.push("antigène D (Rh+) : risque d'immunisation anti-D chez un receveur Rh−");
      var ty = 208, th = H - ty - 52;
      S.draw.panel(c, 10, ty, W - 20, th, {shadow:false});
      S.draw.text(c, "Transfusion de globules : " + don.value + " → " + rec.value, 22, ty + 16, {align:"left", size:12, color:pal.ink});
      var dx = W * .16, px0 = W * .38, px1 = W - 26, cy0 = ty + th * .6;
      B.rbc(c, dx, cy0, 22, {mode:"disque"}); antigens(dx, cy0, 22, don.value); S.draw.text(c, "donneur " + don.value, dx, cy0 + 40, {size:10.5, color:pal.grey});
      S.draw.arrow(c, dx + 40, cy0, px0 - 8, cy0, pal.grey, 2);
      ctx.fillStyle = "rgba(255,240,200,.55)"; S.draw.rrect(c, px0, ty + 28, px1 - px0, th - 38, 12); ctx.fill(); ctx.strokeStyle = "#e5cf93"; ctx.lineWidth = 1.5; ctx.stroke();
      S.draw.text(c, "plasma du receveur " + rec.value, (px0 + px1) / 2, ty + 42, {size:10.5, color:"#8a6d1c"});
      /* anticorps du receveur */
      var abs = []; if (!ar.A) abs.push([pal.red, "anti-A"]); if (!ar.B) abs.push([pal.acc, "anti-B"]);
      for (var q = 0; q < 8; q++){ var ab = abs[q % Math.max(1, abs.length)]; if (!ab) break; yab(px0 + 22 + ((q * 53) % Math.max(60, px1 - px0 - 50)), ty + 62 + (q % 3) * 12, ab[0], 1); }
      if (abs.length) S.draw.text(c, abs.map(function(a){ return a[1]; }).join(" + "), px0 + 8, ty + th - 22, {align:"left", size:10, color:pal.grey});
      /* globules donneurs dans le plasma */
      var n = 5, spread = ok ? 1 : .35;
      for (q = 0; q < n; q++){ var home = [px0 + 36 + q * ((px1 - px0 - 72) / (n - 1)), cy0 + 4 * Math.sin(tt * 1.5 + q)], clump = [(px0 + px1) / 2 + (q % 3 - 1) * 22 + (q > 2 ? 11 : 0), cy0 + (q > 2 ? 22 : -4)];
        var u = ok ? 0 : Math.min(1, tt * .5 % 3), x = home[0] + (clump[0] - home[0]) * (ok ? 0 : Math.min(1, (tt % 4) / 1.5)), y = home[1] + (clump[1] - home[1]) * (ok ? 0 : Math.min(1, (tt % 4) / 1.5));
        B.rbc(c, x, y, 13, {mode:"disque"}); antigens(x, y, 13, don.value); }
      if (!ok){ S.draw.label(c, "agglutination !", px1 - 70, ty + th - 22, {color:pal.red, size:12}); } else S.draw.label(c, "pas d'agglutination", px1 - 78, ty + th - 22, {color:pal.green, size:11.5});
      S.draw.text(c, ok ? "Compatible : aucun antigène étranger pour le receveur" : "Incompatible : " + why[0], 20, H - 22, {align:"left", size:11.5, weight:700, color:ok ? pal.green : pal.red});
      ro.set(0, ok ? "compatible" : "incompatible"); ro.set(1, S.fmt((1 - pneg) * 100, 0) + " %"); ro.set(2, S.fmt(pneg * 100, 0) + " %");
      note.set(rm.value === "dd" && pneg < 1 ? "Mère Rh− : un enfant Rh+ (probabilité " + S.fmt((1 - pneg) * 100, 0) + " %) peut immuniser la mère ; prévention par immunoglobulines anti-D." : "Pas d'incompatibilité Rh fœto-maternelle dans ce couple (mère Rh+ ou enfant forcément Rh−).", rm.value === "dd" && pneg < 1 ? "warn" : "ok");
    }
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 5. Caractère polygénique */
SFA.sim({
  id:"ub-c09-polygenique", ch:"c09", tag:"Hérédité complexe",
  titre:"Caractères polygéniques : gènes, milieu et pénétrance",
  resume:"Courbe en cloche, héritabilité h², seuil de maladie et pénétrance incomplète.",
  but:"Fais varier le nombre de gènes, l'effet du milieu et le seuil : la distribution devient une cloche, l'hérédité n'est plus « tout ou rien ».",
  aRetenir:"Modèle additif : n locus à 2 allèles de fréquence 1/2, score génétique G = nombre d'allèles « + » (moyenne n, variance n/2). Phénotype P = G + E (milieu E, variance σ²). Héritabilité au sens large h² = V<sub>G</sub> / V<sub>P</sub>. Plus n est grand, plus la distribution ressemble à une loi normale. Pénétrance = proportion de personnes d'un génotype donné qui expriment la maladie : elle est &lt; 100 % dès que le milieu compte.",
  piege:"L'héritabilité décrit une population, pas un individu : « h² = 0,6 » ne veut pas dire que 60 % de ta taille vient de tes gènes. Un h² élevé n'exclut pas l'effet du milieu (nutrition et taille). Les locus sont supposés indépendants, additifs, sans interaction : modèle d'école.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var n = k.slider("Nombre de locus n", 1, 20, 1, 6, "");
    var sg = k.slider("Écart-type du milieu σ", 0, 6, 0.5, 2, "");
    var th = k.slider("Seuil de maladie", 0, 40, 0.5, 11, "");
    var gs = k.slider("Score génétique d'un individu g", 0, 40, 1, 8, "");
    var ro = k.readouts(["V<sub>G</sub> = n/2","V<sub>P</sub>","h²","Atteints (population)","Atteints si score g"]);
    k.draw(function(){
      c.clear();
      var nn = n.value, s = sg.value, g, M = 2 * nn, bin = [], bc = 1, tot = Math.pow(2, M);
      for (g = 0; g <= M; g++){ bin.push(bc / tot); bc = bc * (M - g) / (g + 1); }
      var xmax = M + 8, ctx = c.ctx;
      function pdf(x){ var t = 0; for (var q = 0; q <= M; q++){ if (bin[q] < 1e-9) continue; t += bin[q] * (s < 0.01 ? 0 : Math.exp(-0.5 * Math.pow((x - q) / s, 2)) / (s * 2.5066)); } return t; }
      var ymax = 0.001; for (g = 0; g <= M; g++) ymax = Math.max(ymax, bin[g]); if (s > 0.01){ for (var xx = -4; xx <= xmax; xx += 0.25) ymax = Math.max(ymax, pdf(xx)); }
      ymax *= 1.15;
      var ax = S.draw.axes(c, {x0:-4, x1:xmax, y0:0, y1:ymax, xl:"score", yl:"", stepX:xmax > 24 ? 10 : 5, stepY:10, grid:false, t:20});
      var X = ax.X, Y = ax.Y;
      for (g = 0; g <= M; g++){ ctx.fillStyle = "rgba(142,153,168,.55)"; ctx.fillRect(X(g) - 3, Y(bin[g]), 6, Y(0) - Y(bin[g])); }
      if (s > 0.01){ ctx.save(); ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.4; ctx.beginPath(); for (var x = -4; x <= xmax; x += 0.2){ var yy = pdf(x); if (x === -4) ctx.moveTo(X(x), Y(yy)); else ctx.lineTo(X(x), Y(yy)); } ctx.stroke(); ctx.restore(); }
      S.draw.line(c, X(th.value), ax.T, X(th.value), ax.B, pal.red, 2, [5, 4]); S.draw.text(c, "seuil", X(th.value), ax.T + 4, {size:11, color:pal.red});
      S.draw.text(c, "barres = génotypes (score g) · courbe = phénotypes (g + milieu)", 20, 292, {align:"left", size:10, weight:600, color:pal.grey});
      var VG = nn / 2, VP = VG + s * s, aff = 0;
      for (g = 0; g <= M; g++) aff += bin[g] * (s < 0.01 ? (g > th.value ? 1 : 0) : 1 - phi((th.value - g) / s));
      var gg = Math.min(gs.value, M), pen = s < 0.01 ? (gg > th.value ? 1 : 0) : 1 - phi((th.value - gg) / s);
      ro.set(0, S.fmt(VG, 2)); ro.set(1, S.fmt(VP, 2)); ro.set(2, S.fmt(VG / VP, 2)); ro.set(3, S.fmt(aff * 100, 1) + " %"); ro.set(4, S.fmt(pen * 100, 1) + " %");
    });
  }
});
})();
