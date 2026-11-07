/* Chapitre 7 · Spéciation, preuves de l'évolution et phylogénie */
(function(){
var B = window.B6;

/* ---------- arbre phylogénétique ---------- */
var CHARS = ["mâchoires", "quatre membres", "amnios", "deux fenêtres temporales", "plumes", "poils et glandes mammaires"];
function node(name, ch, kids, chr){ return {name: name, ch: ch, kids: kids || null, chr: chr}; }
function makeTree(){
  return node("racine", null, [
    node("Lamproie", null, null, null),
    node("N2", 0, [node("Truite", null, null, null), node("N3", 1, [node("Grenouille", null, null, null), node("N4", 2, [node("Souris", 5, null, null), node("N5", 3, [node("Lézard", null, null, null), node("Pigeon", 4, null, null)])])])])
  ]);
}

SFA.sim({
  id: "b6-c07-arbre", ch: "c07", tag: "Classique",
  titre: "Lire un arbre phylogénétique : qui est le plus proche de qui ?",
  resume: "Touche deux espèces : l'arbre montre leur ancêtre commun le plus récent et les caractères dérivés qu'elles partagent.",
  but: "Chaque nombre sur une branche est un caractère dérivé apparu chez un ancêtre. Touche deux noms d'espèces pour voir leur ancêtre commun le plus récent. Le bouton retourne les branches : l'arbre ne change pas, seule sa présentation change.",
  aRetenir: "La parenté se lit par l'ancêtre commun le plus récent, et non par la proximité sur le dessin : lézard et pigeon partagent un ancêtre commun plus récent qu'avec la souris. Un groupe naturel (clade) comprend un ancêtre et tous ses descendants. Les caractères dérivés partagés (innovations) fondent la parenté.",
  piege: "On ne lit pas un arbre comme une échelle vers l'humain ni comme un classement du plus « primitif » au plus « évolué » : toutes les espèces actuelles ont la même durée d'évolution depuis l'ancêtre commun. Le groupe « reptiles » sans les oiseaux n'est pas un clade : les oiseaux descendent d'ancêtres reptiles (ici, le pigeon est plus proche du lézard que de la souris).",
  build: function(k, S){
    var c = k.canvas(460), P = S.draw.palette, sel = [];
    var flip = k.toggle("Retourner les branches (même arbre)", false);
    k.button("Effacer la sélection", function(){ sel = []; });
    var ro = k.readouts(["Ancêtre commun le plus récent", "Caractères dérivés partagés", "Branches à parcourir entre les deux"]);
    var note = k.note("", ""), leafPos = [];
    var tr = makeTree();
    function layout(){
      var T = makeTree(), y = 0, depthMax = 5, W = c.W, tw = W - 118, rowH = 46;
      function rec(n, d){
        if (flip.value && n.kids) n.kids.reverse();
        if (!n.kids){ n.y = 34 + y * rowH; y++; n.x = 14 + tw; n.d = depthMax; return; }
        n.kids.forEach(function(q){ rec(q, d + 1); });
        n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2; n.x = 14 + d * tw / depthMax; n.d = d;
      }
      rec(T, 0); return T;
    }
    function leaves(n){ return n.kids ? n.kids.reduce(function(a, q){ return a.concat(leaves(q)); }, []) : [n.name]; }
    function path(n, name, acc){ if (!n.kids) return n.name === name ? acc.concat([n]) : null; for (var i = 0; i < n.kids.length; i++){ var r = path(n.kids[i], name, acc.concat([n])); if (r) return r; } return null; }
    c.pointer(function(t, p){ if (t !== "down") return; leafPos.forEach(function(l){ if (Math.abs(p.y - l[1]) < 22 && p.x > l[2]){ if (sel.indexOf(l[0]) >= 0) sel.splice(sel.indexOf(l[0]), 1); else { if (sel.length >= 2) sel = []; sel.push(l[0]); } } }); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, T = layout(), onP = {}, mrca = null;
      leafPos = [];
      if (sel.length === 2){ var a = path(T, sel[0], []), b = path(T, sel[1], []), i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; mrca = a[i - 1]; a.concat(b).forEach(function(n){ onP[n.name] = 1; }); }
      function inPath(n){ return mrca && onP[n.name] && n.d >= mrca.d; }
      function drawNode(n, par){
        if (par){
          var hot = inPath(n) && n !== mrca; ctx.strokeStyle = hot ? P.red : "#4b5868"; ctx.lineWidth = hot ? 3.4 : 2;
          ctx.beginPath(); ctx.moveTo(par.x, par.y); ctx.lineTo(par.x, n.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          if (n.ch !== null && n.ch !== undefined || (!n.kids && n.chr !== null)){}
        }
        if (n.kids) n.kids.forEach(function(q){ drawNode(q, n); });
        var ci = n.ch !== null && n.ch !== undefined ? n.ch : null; if (ci !== null && par){ var mx = par.x + (n.x - par.x) * 0.5; ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(mx, n.y, 9, 0, 6.2832); ctx.fill(); S.draw.text(c, String(ci + 1), mx, n.y, {size: 12, color: "#fff"}); }
        if (!n.kids){
          var on = sel.indexOf(n.name) >= 0; S.draw.text(c, n.name, n.x + 8, n.y, {align: "left", size: 13, color: on ? P.red : P.ink, weight: on ? 800 : 700});
          leafPos.push([n.name, n.y, n.x]);
        }
      }
      drawNode(T, null);
      var T2 = T; (function chr(n, par){ if (n.kids) n.kids.forEach(function(q){ chr(q, n); }); if (n.chr !== null && n.chr !== undefined && par){ var mx = par.x + (n.x - par.x) * 0.5; ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(mx, n.y, 9, 0, 6.2832); ctx.fill(); S.draw.text(c, String(n.chr + 1), mx, n.y, {size: 12, color: "#fff"}); } })(T, null);
      if (mrca) S.draw.dot(c, mrca.x, mrca.y, 8, P.red);
      CHARS.forEach(function(t, q){ S.draw.text(c, (q + 1) + ". " + t, 14, 330 + q * 19, {align: "left", size: 12, color: P.ink}); });
      /* lectures */
      if (sel.length < 2){ ro.set(0, "Touche 2 espèces"); ro.set(1, "—"); ro.set(2, "—"); note.set(sel.length === 1 ? sel[0] + " sélectionné(e) : touche une deuxième espèce." : "Touche deux noms d'espèces pour comparer leur parenté.", ""); return; }
      var a2 = path(T, sel[0], []), b2 = path(T, sel[1], []), j = 0; while (j < a2.length && j < b2.length && a2[j] === b2[j]) j++;
      var m = a2[j - 1], shared = []; a2.slice(0, j).forEach(function(n){ if (n.ch !== null && n.ch !== undefined) shared.push(n.ch + 1); });
      var dist = (a2.length - j) + (b2.length - j);   /* branches de l'ancêtre commun à chaque espèce */
      ro.set(0, "ancêtre de " + leaves(m).join(", ")); ro.set(1, shared.length ? shared.join(", ") : "aucun"); ro.set(2, dist);
      var all = leaves(T).filter(function(x){ return x !== sel[0] && x !== sel[1]; }), nm = {};
      all.forEach(function(x){ var pp = path(T, x, []), q = 0; while (q < pp.length && q < a2.length && pp[q] === a2[q]) q++; nm[x] = q; });
      note.set("<b>" + sel[0] + "</b> et <b>" + sel[1] + "</b> ont pour ancêtre commun le plus récent celui des " + leaves(m).length + " espèces : " + leaves(m).join(", ") + ". Caractères partagés : " + (shared.length ? shared.join(", ") : "aucun") + ".", "ok");
    });
  }
});

/* ---------- spéciation ---------- */
SFA.sim({
  id: "b6-c07-speciation", ch: "c07", tag: "Originale",
  titre: "Spéciation : isolement, migration et sélection",
  resume: "Deux populations coupées l'une de l'autre divergent. Quelques migrants par génération suffisent à les maintenir semblables.",
  but: "Deux populations (20 gènes indépendants) partent avec les mêmes fréquences. Règle leur taille, le nombre de migrants échangés par génération et une éventuelle sélection divergente (un allèle avantagé dans chaque milieu). Le graphe suit leur différenciation génétique F<sub>ST</sub> : 0 = identiques, 1 = totalement différentes.",
  aRetenir: "Sans échange (barrière géographique), la dérive seule différencie les deux populations, d'autant plus vite qu'elles sont petites. Dès qu'il y a au moins quelques migrants par génération, les gènes circulent et les populations restent semblables. Une sélection divergente forte peut cependant les différencier malgré la migration. Une fois la différenciation importante, l'isolement reproductif apparaît : deux espèces.",
  piege: "Le seuil F<sub>ST</sub> = 0,5 est ici arbitraire (modèle pédagogique) : en réalité, l'isolement reproductif dépend de nombreux caractères (comportement, période de reproduction, incompatibilité génétique). Chaque simulation est un tirage au hasard : refais-la plusieurs fois.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette, cur = null;
    var N = k.select("Individus par population (N)", [20, 50, 100, 200], 50, function(){ cur = null; });
    var nm = k.slider("Migrants échangés par génération", 0, 3, 0.25, 0, "", function(){ cur = null; });
    var sl = k.slider("Sélection divergente (s)", 0, 10, 1, 0, "%", function(){ cur = null; });
    var seed = 1; var lp = k.loop(function(dt){ cur += dt * 40; if (cur >= 200){ cur = null; lp.pause(); } k.redraw(); });
    k.button("Nouveau tirage", function(){ seed++; cur = null; });
    k.button("Rejouer l'animation", function(){ cur = 0; lp.play(); }, true);
    var ro = k.readouts(["Différenciation F<sub>ST</sub> affichée", "Statut"]);
    var note = k.note("", "");
    var L = 20, GEN = 200;
    k.draw(function(){
      c.clear(); var ctx = c.ctx, n = +N.value, M = 2 * n, m = Math.min(0.5, nm.value / n), s = sl.value / 100, r = B.rng(seed * 7717 + n * 3 + Math.round(nm.value * 4) * 101 + sl.value), p1 = [], p2 = [], i, g, fst = [0];
      for (i = 0; i < L; i++){ p1.push(0.5); p2.push(0.5); }
      for (g = 1; g <= GEN; g++){
        var num = 0, den = 0;
        for (i = 0; i < L; i++){
          var a = (1 - m) * p1[i] + m * p2[i], b = (1 - m) * p2[i] + m * p1[i];
          a = a * (1 + s) / (1 + s * a); b = b / (b + (1 - b) * (1 + s));
          p1[i] = B.binom(M, a, r) / M; p2[i] = B.binom(M, b, r) / M;
          var pm = (p1[i] + p2[i]) / 2; num += Math.pow(p1[i] - p2[i], 2) / 4; den += pm * (1 - pm);
        }
        fst.push(den > 0 ? num / den : 0);
      }
      var upto = cur === null ? GEN : Math.floor(cur);
      /* îles et flèches */
      var cy = 34; [[c.W * 0.15, "Pop. 1"], [c.W * 0.85, "Pop. 2"]].forEach(function(p){ ctx.fillStyle = "#c9dfd0"; ctx.beginPath(); ctx.ellipse(p[0], cy, 36, 20, 0, 0, 6.2832); ctx.fill(); S.draw.text(c, p[1], p[0], cy, {size: 12}); });
      ctx.fillStyle = "#b9d3e6"; ctx.fillRect(c.W * 0.15 + 42, cy - 10, c.W * 0.7 - 84, 20); S.draw.text(c, nm.value === 0 ? "barrière totale" : S.fmt(nm.value, 2) + " migrant(s)/gén.", c.W / 2, cy, {size: 12});
      var ax = S.draw.axes(c, {x0: 0, x1: GEN, y0: 0, y1: 1, stepX: 50, stepY: 0.25, t: 74, b: 34, xl: "générations", yl: "F_ST", l: 44});
      S.draw.line(c, ax.L, ax.Y(0.5), ax.R, ax.Y(0.5), P.red, 1.4, [5, 4]); S.draw.text(c, "divergence forte (seuil arbitraire)", ax.R - 4, ax.Y(0.5) - 9, {size: 12, color: P.red, align: "right"});
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2.8; ctx.beginPath(); for (g = 0; g <= upto; g++){ var X = ax.X(g), Y = ax.Y(Math.min(1, fst[g])); if (g === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke();
      S.draw.dot(c, ax.X(upto), ax.Y(Math.min(1, fst[upto])), 6, P.red);
      var f = fst[upto]; ro.set(0, S.fmt(f, 2)); ro.set(1, f > 0.5 ? "très différenciées : espèces probables" : f > 0.15 ? "différenciation nette" : "encore une seule population génétique");
      note.set(nm.value === 0 && s === 0 ? "Isolement total : seule la dérive agit. Petite taille = divergence rapide ; essaie N = 20 puis N = 200." : nm.value > 0 && s === 0 ? "Avec " + nm.value + " migrant(s) par génération, les gènes circulent et la différenciation reste faible." : s > 0 ? "La sélection divergente (s = " + sl.value + " %) pousse les deux populations dans des directions opposées ; elle l'emporte sur la migration quand s dépasse le taux de migration (" + S.fmt(m * 100, 1) + " %)." : "", "");
    });
  }
});

/* ---------- séquences et horloge moléculaire ---------- */
(function(){
  var BASE = "ATGCCGTAGCTAAGCTTGACGATCCGATATCGGTAC", NAMES = ["Humain", "Chimpanzé", "Gorille", "Orang-outan", "Macaque"];
  var L0 = BASE + "AGCT"; /* 40 nucléotides */
  var CYC = {A: "C", C: "G", G: "T", T: "A"};
  function mut(seq, pos){ var a = seq.split(""); a[pos] = CYC[a[pos]]; return a.join(""); }
  function apply(seq, list){ list.forEach(function(p){ seq = mut(seq, p); }); return seq; }
  /* positions de mutations (toutes distinctes) le long des branches */
  var ROOT = L0, N1 = apply(ROOT, [3, 17]), N2 = apply(N1, [8, 26]), N3 = apply(N2, [11, 33]);
  var SEQ = [apply(N3, [5]), apply(N3, [22]), apply(N2, [14, 29, 37]), apply(N1, [0, 7, 19, 24, 35]), apply(ROOT, [1, 6, 12, 16, 21, 28, 31, 38])];
  function dist(a, b){ var d = 0; for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; }
  var D = SEQ.map(function(a){ return SEQ.map(function(b){ return dist(a, b); }); });

  SFA.sim({
    id: "b6-c07-sequences", ch: "c07", tag: "Quantitatif",
    titre: "Comparer des séquences : matrice des différences et arbre",
    resume: "Compte les différences entre séquences, construis l'arbre étape par étape (regroupement des plus proches) et estime une date de divergence.",
    but: "Cinq séquences d'ADN fictives de 40 nucléotides (inventées pour l'exercice). Choisis deux espèces pour voir leurs différences, puis clique sur « Étape suivante » pour regrouper les deux groupes les plus proches. Le curseur de vitesse de mutation donne une date de divergence.",
    aRetenir: "Plus deux espèces ont divergé depuis longtemps, plus leurs séquences diffèrent : le nombre de différences sert de mesure de parenté. Le regroupement répété des deux séquences les plus proches (méthode UPGMA) donne un arbre. Si les mutations s'accumulent à vitesse à peu près constante (horloge moléculaire), temps de divergence ≈ différences par site ÷ (2 × vitesse).",
    piege: "L'horloge moléculaire est une approximation : la vitesse de mutation varie selon les gènes et les lignées. Des séquences fictives courtes ne donnent pas de dates fiables ; les vraies études comparent des milliers de sites. Les différences mesurent la parenté, pas un « degré d'évolution ».",
    build: function(k, S){
      var c = k.canvas(520), P = S.draw.palette, step = 0, clusters, merges;
      var sa = k.select("Séquence 1", NAMES.map(function(n, i){ return [i, n]; }), 0), sb = k.select("Séquence 2", NAMES.map(function(n, i){ return [i, n]; }), 1);
      var mu = k.slider("Vitesse de mutation (×10⁻⁹ par site et par an)", 0.5, 5, 0.5, 1, "");
      k.button("Étape suivante", function(){ if (step < 4) step++; }, true); k.button("Recommencer", function(){ step = 0; });
      var ro = k.readouts(["Différences entre les deux séquences", "Distance par site", "Divergence estimée"]);
      var note = k.note("", "");
      function upgma(nsteps){
        var cl = NAMES.map(function(n, i){ return {m: [i], h: 0, t: {name: n, leaf: true, i: i}}; }), log = [];
        for (var s = 0; s < nsteps; s++){
          var best = null; for (var i = 0; i < cl.length; i++) for (var j = i + 1; j < cl.length; j++){ var d = 0, n = 0; cl[i].m.forEach(function(x){ cl[j].m.forEach(function(y){ d += D[x][y]; n++; }); }); d /= n; if (!best || d < best.d - 1e-9) best = {i: i, j: j, d: d}; }
          var a = cl[best.i], b = cl[best.j], nc = {m: a.m.concat(b.m), h: best.d / 2, t: {kids: [a.t, b.t], h: best.d / 2}}; log.push([a.m.map(function(x){ return NAMES[x]; }).join("+"), b.m.map(function(x){ return NAMES[x]; }).join("+"), best.d]);
          cl.splice(best.j, 1); cl.splice(best.i, 1); cl.push(nc);
        }
        return {cl: cl, log: log};
      }
      function leaf(t, out){ if (t.leaf){ out.push(t.i); } else t.kids.forEach(function(q){ leaf(q, out); }); }
      k.draw(function(){
        c.clear(); var ctx = c.ctx, i = +sa.value, j = +sb.value, A = SEQ[i], Bq = SEQ[j], cw = Math.min(12, (c.W - 84) / 20);
        S.draw.text(c, NAMES[i].slice(0, 9), 6, 18, {align: "left", size: 12, color: P.acc}); S.draw.text(c, NAMES[j].slice(0, 9), 6, 70, {align: "left", size: 12, color: P.red});
        ctx.font = "700 12px JetBrains Mono, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (var q = 0; q < 40; q++){ var row = Math.floor(q / 20), col = q % 20, x = 78 + col * cw + cw / 2, diff = A[q] !== Bq[q], y1 = 14 + row * 20, y2 = 66 + row * 20; ctx.fillStyle = diff ? "#fde8e6" : "#fff"; ctx.fillRect(78 + col * cw, y1 - 9, cw, 18); ctx.fillRect(78 + col * cw, y2 - 9, cw, 18); ctx.fillStyle = diff ? P.red : P.ink; ctx.fillText(A[q], x, y1); ctx.fillText(Bq[q], x, y2); }
        S.draw.text(c, "rouge = site différent", c.W - 8, 52, {size: 12, color: P.red, align: "right"});
        /* matrice */
        var my = 114, cs = Math.min(52, (c.W - 70) / 5);
        S.draw.text(c, "Nombre de différences (sur 40 sites)", c.W / 2, my, {size: 12, color: P.grey});
        for (var a = 0; a < 5; a++){ S.draw.text(c, NAMES[a].slice(0, 4) + ".", 62 + cs * (a + 0.5), my + 16, {size: 12, color: P.grey, weight: 700}); S.draw.text(c, NAMES[a].slice(0, 4) + ".", 28, my + 36 + a * 20, {size: 12, color: P.grey, weight: 700});
          for (var b = 0; b < 5; b++){ var v = D[a][b], hot = (a === i && b === j) || (a === j && b === i); ctx.fillStyle = a === b ? "#f1f3f6" : hot ? "#fde8e6" : "rgba(30,63,143," + (0.08 + v / 20 * 0.4) + ")"; ctx.fillRect(62 + cs * b + 1, my + 26 + a * 20, cs - 2, 18); if (a !== b) S.draw.text(c, v, 62 + cs * (b + 0.5), my + 35 + a * 20, {size: 12}); } }
        /* arbre */
        var res = upgma(step), ty = my + 142, th = 190, tw = c.W - 130;
        S.draw.text(c, step === 0 ? "Arbre : appuie sur « Étape suivante »" : "Arbre construit (étape " + step + " sur 4)", c.W / 2, ty - 6, {size: 12, color: P.grey});
        var order = []; res.cl.forEach(function(cc){ leaf(cc.t, order); });
        var rowH = th / 5, ypos = {}; order.forEach(function(x, q){ ypos[x] = ty + 10 + q * rowH; });
        var hmax = Math.max(1, D[0][4] / 2) ;
        function X(h){ return 14 + tw - h / hmax * (tw - 20); }
        function draw(t){
          if (t.leaf){ S.draw.text(c, t.name, 14 + tw + 8, ypos[t.i], {align: "left", size: 12}); return {y: ypos[t.i], h: 0}; }
          var a = draw(t.kids[0]), b = draw(t.kids[1]); ctx.strokeStyle = P.acc; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(X(a.h), a.y); ctx.lineTo(X(t.h), a.y); ctx.lineTo(X(t.h), b.y); ctx.lineTo(X(b.h), b.y); ctx.stroke(); return {y: (a.y + b.y) / 2, h: t.h};
        }
        res.cl.forEach(function(cc){ draw(cc.t); });
        if (res.log.length){ var lg = res.log[res.log.length - 1]; note.set("Étape " + step + " : regroupement de <b>" + lg[0] + "</b> et <b>" + lg[1] + "</b> (distance moyenne " + S.fmt(lg[2], 1) + " différences).", "ok"); } else note.set("Les deux séquences les plus proches se regrouperont en premier.", "");
        var d = D[i][j]; ro.set(0, i === j ? "0" : d + " sur 40"); ro.set(1, S.fmt(d / 40, 3));
        var yrs = d / 40 / (2 * mu.value * 1e-9); ro.set(2, i === j ? "—" : "≈ " + S.fmt(yrs / 1e6, 1) + " Ma");
      });
    }
  });
})();

/* ---------- datation radiométrique ---------- */
SFA.sim({
  id: "b6-c07-datation", ch: "c07", tag: "Niche utile",
  titre: "Datation radiométrique : quel chronomètre pour quel âge ?",
  resume: "La quantité d'isotope père diminue de moitié à chaque demi-vie : on en déduit l'âge d'une roche ou d'un fossile, à condition de choisir le bon isotope.",
  but: "Mode « Désintégration » : choisis un isotope et le pourcentage d'isotope père encore présent ; l'âge s'affiche. Mode « Quel chronomètre ? » : fixe l'âge d'un échantillon et vois quels isotopes sont utilisables.",
  aRetenir: "Après n demi-vies, il reste (1/2)ⁿ de l'isotope père : âge = demi-vie × log₂(1/f), où f est la fraction restante. Les demi-vies : carbone 14 : 5 730 ans ; potassium 40 : 1,25 milliard d'années ; uranium 238 : 4,47 milliards d'années. Un chronomètre est fiable pour des âges de l'ordre de 0,1 à 10 demi-vies.",
  piege: "Le carbone 14 ne date pas les dinosaures (plus de 60 millions d'années) ni les roches : il n'en reste plus rien de mesurable au-delà d'environ 50 000 ans. On date un fossile grâce aux roches volcaniques encadrantes avec un isotope à longue demi-vie. Les valeurs de demi-vie sont arrondies.",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette;
    var ISO = {c14: ["Carbone 14", 5730, "ans"], k40: ["Potassium 40", 1.25e9, "ans"], u238: ["Uranium 238", 4.47e9, "ans"]};
    var mode = k.seg("Mode", [["d", "Désintégration"], ["q", "Quel chronomètre ?"]], "d");
    var iso = k.select("Isotope (mode Désintégration)", Object.keys(ISO).map(function(x){ return [x, ISO[x][0] + " (demi-vie " + (ISO[x][1] < 1e6 ? S.fmt(ISO[x][1], 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ans" : S.fmt(ISO[x][1] / 1e9, 2) + " Ga") + ")"]; }), "c14");
    var fr = k.slider("Isotope père restant (mode Désintégration)", 0.1, 100, 0.1, 25, "%");
    var la = k.slider("Âge (mode Chronomètre) : exposant de 10, en années", 3, 9.7, 0.1, 4.5, "");
    var ro = k.readouts(["Âge", "Demi-vies écoulées", "Fiabilité"]);
    var note = k.note("", "");
    function fmtAge(y){ return y >= 1e9 ? S.fmt(y / 1e9, 2) + " Ga" : y >= 1e6 ? S.fmt(y / 1e6, 1) + " Ma" : S.fmt(Math.round(y / 10) * 10, 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ans"; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      if (mode.value === "d"){
        var T = ISO[iso.value][1], f = fr.value / 100, n = Math.log2(1 / f), age = T * n;
        /* atomes */
        var cols = 20, rows = 5, cs = Math.min(15, (c.W - 28) / cols), ox = (c.W - cs * cols) / 2, rg = B.rng(5), order = []; for (var i = 0; i < 100; i++) order.push(i);
        for (i = 99; i > 0; i--){ var j = Math.floor(rg() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
        var remain = Math.round(f * 100);
        for (i = 0; i < 100; i++){ var idx = order.indexOf(i), isP = idx < remain; ctx.fillStyle = isP ? P.acc : "#e0942b"; ctx.beginPath(); ctx.arc(ox + (i % cols) * cs + cs / 2, 12 + Math.floor(i / cols) * cs + cs / 2, cs / 2 - 1.5, 0, 6.2832); ctx.fill(); }
        S.draw.text(c, "100 atomes : bleu = père (reste " + remain + "), orange = fils", c.W / 2, 12 + rows * cs + 14, {size: 12, color: P.grey});
        var ax = S.draw.axes(c, {x0: 0, x1: 10, y0: 0, y1: 100, stepX: 1, stepY: 25, t: 12 + rows * cs + 30, b: 32, xl: "demi-vies écoulées", yl: "% de père restant", l: 44});
        S.draw.fn(c, ax, function(x){ return 100 * Math.pow(0.5, x); }, P.acc, 2.8);
        S.draw.line(c, ax.X(n), ax.Y(f * 100), ax.X(n), ax.B, P.red, 1.3, [4, 3]); S.draw.line(c, ax.L, ax.Y(f * 100), ax.X(n), ax.Y(f * 100), P.red, 1.3, [4, 3]); S.draw.dot(c, ax.X(n), ax.Y(f * 100), 6, P.red);
        ro.set(0, fmtAge(age)); ro.set(1, S.fmt(n, 2));
        var rel = f < 0.001 ? "peu fiable (moins de 0,1 % restant)" : f > 0.9 ? "peu fiable (variation trop faible)" : "bonne";
        ro.set(2, rel);
        note.set(f < 0.001 ? "Il reste moins de 0,1 % d'isotope père : la quantité est trop faible pour une mesure précise." : f > 0.9 ? "Moins d'une demi-vie écoulée de façon marquée : il faut mesurer une très petite variation, d'où une grande incertitude." : "Âge = T½ × log₂(1/f) = " + fmtAge(T) + " × " + S.fmt(n, 2) + " = " + fmtAge(age) + ".", f < 0.001 || f > 0.9 ? "warn" : "ok");
      } else {
        var Y = Math.pow(10, la.value), items = Object.keys(ISO), ok = [];
        S.draw.text(c, "Âge de l'échantillon : " + fmtAge(Y), c.W / 2, 16, {size: 14, color: P.acc});
        items.forEach(function(x, q){
          var Th = ISO[x][1], fo = Math.pow(0.5, Y / Th), good = fo <= 0.9 && fo >= 0.001, y = 44 + q * 80;
          S.draw.text(c, ISO[x][0], 10, y, {align: "left", size: 13});
          ctx.fillStyle = "#e5e9ee"; ctx.fillRect(10, y + 14, c.W - 20, 22); ctx.fillStyle = good ? P.green : "#b0b9c4"; ctx.fillRect(10, y + 14, (c.W - 20) * Math.max(fo, 0.004), 22);
          S.draw.text(c, "reste " + (fo < 0.0001 ? "< 0,01" : S.fmt(fo * 100, fo < 0.1 ? 2 : 1)) + " % du père (" + S.fmt(Y / Th, 2) + (Y / Th >= 2 ? " demi-vies)" : " demi-vie)"), 16, y + 25, {align: "left", size: 12, color: good ? "#fff" : P.ink, bg: good ? null : "rgba(255,255,255,.7)"});
          S.draw.text(c, good ? "utilisable" : fo > 0.9 ? "trop peu désintégré" : "trop désintégré", c.W - 16, y, {align: "right", size: 12, color: good ? P.green : P.red}); if (good) ok.push(ISO[x][0]);
        });
        ro.set(0, fmtAge(Y)); ro.set(1, "—"); ro.set(2, ok.length ? ok.join(", ") : "aucun isotope utilisable");
        note.set(ok.length ? "Chronomètre(s) utilisable(s) : " + ok.join(", ") + " (entre 0,1 % et 90 % de père restant)." : "Aucun de ces trois isotopes ne convient à cet âge.", ok.length ? "ok" : "warn");
      }
    });
  }
});
})();
