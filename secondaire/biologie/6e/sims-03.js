/* Chapitre 3 · Hérédité liée au sexe et gènes liés */
(function(){
var B = window.B6;
function frac(n, d){ var g = B.gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }

/* ---------- arbres généalogiques et moteur d'inférence ---------- */
var PEDS = {
  A: {t: "Famille A", out: ["II-4"], key: "Une fille atteinte (II-1) a des parents sains : l'allèle est donc récessif (deux parents sains ne peuvent avoir un enfant atteint si l'allèle est dominant). Le père (I-1) est sain : il ne peut donc pas porter l'allèle sur son unique X, ce qui exclut la transmission liée à X.",
    people: [["I-1","M",0,.30,0],["I-2","F",0,.52,0],["II-1","F",1,.14,1],["II-2","M",0,.34,1],["II-3","F",0,.56,1],["II-4","M",0,.78,1],["III-1","M",0,.56,2],["III-2","F",0,.78,2]],
    unions: [["I-1","I-2",["II-1","II-2","II-3"]],["II-3","II-4",["III-1","III-2"]]]},
  B: {t: "Famille B", out: ["I-1","II-4"], key: "Seuls des garçons sont atteints (II-1, III-1), toujours nés d'une mère saine : le père de III-1 (II-4) vient d'une autre famille et ne porte pas l'allèle. Un garçon atteint de père non porteur ne peut s'expliquer que par une mère porteuse d'un allèle récessif sur le chromosome X.",
    people: [["I-1","M",0,.30,0],["I-2","F",0,.52,0],["II-1","M",1,.12,1],["II-3","M",0,.30,1],["II-2","F",0,.52,1],["II-4","M",0,.74,1],["III-1","M",1,.44,2],["III-2","F",0,.60,2],["III-3","M",0,.76,2]],
    unions: [["I-1","I-2",["II-1","II-3","II-2"]],["II-2","II-4",["III-1","III-2","III-3"]]]},
  C: {t: "Famille C", out: ["I-2","II-4"], key: "Chaque personne atteinte a un parent atteint, dans toutes les générations, et les deux sexes sont touchés : transmission verticale d'un allèle dominant. Le père I-1 transmet l'allèle à son fils II-3 (père → fils) : le chromosome X du fils vient de sa mère, donc la transmission n'est pas liée à X.",
    people: [["I-1","M",1,.30,0],["I-2","F",0,.52,0],["II-1","F",1,.14,1],["II-2","M",0,.34,1],["II-3","M",1,.56,1],["II-4","F",0,.78,1],["III-1","F",1,.56,2],["III-2","M",0,.78,2]],
    unions: [["I-1","I-2",["II-1","II-2","II-3"]],["II-3","II-4",["III-1","III-2"]]]}
};
var HYPS = {ar: "Autosomique récessive", ad: "Autosomique dominante", xr: "Récessive liée à X", xd: "Dominante liée à X"};
function aff(h, s, d){
  if (h === "ar") return d === 2; if (h === "ad") return d >= 1;
  if (h === "xr") return s === "F" ? d === 2 : d === 1; return s === "F" ? d >= 1 : d === 1;
}
function lab(h, s, d){
  if (h === "ar" || h === "ad") return ["NN", "Nm", "mm"][d];
  return s === "F" ? ["XᴺXᴺ", "XᴺXᵐ", "XᵐXᵐ"][d] : ["XᴺY", "XᵐY"][d];
}
function alleles(d){ return d === 0 ? [0] : d === 1 ? [0, 1] : [1]; }
function compat(h, cs, dc, dm, df){
  var A = alleles(dm), i, j;
  if (h === "ar" || h === "ad"){ var Bf = alleles(df); for (i = 0; i < A.length; i++) for (j = 0; j < Bf.length; j++) if (A[i] + Bf[j] === dc) return true; return false; }
  if (cs === "M") return A.indexOf(dc) >= 0;
  for (i = 0; i < A.length; i++) if (A[i] + df === dc) return true; return false;
}
function solve(ped, h){
  var P = ped.people.map(function(p){ return {id: p[0], s: p[1], a: p[2], y: p[4], d: -1}; }), byId = {}, par = {}, sets = {};
  P.forEach(function(p){ byId[p.id] = p; sets[p.id] = {}; });
  ped.unions.forEach(function(u){ var m = byId[u[0]].s === "F" ? u[0] : u[1], f = m === u[0] ? u[1] : u[0]; u[2].forEach(function(k){ par[k] = [m, f]; }); });
  P.sort(function(a, b){ return a.y - b.y; });
  var found = false;
  (function dfs(i){
    if (i === P.length){ found = true; P.forEach(function(p){ sets[p.id][lab(h, p.s, p.d)] = 1; }); return; }
    var p = P[i], opts = (h === "xr" || h === "xd") && p.s === "M" ? [0, 1] : [0, 1, 2];
    if (ped.out.indexOf(p.id) >= 0) opts = [0];
    opts.forEach(function(d){
      if (aff(h, p.s, d) !== !!p.a) return;
      if (par[p.id] && !compat(h, p.s, d, byId[par[p.id][0]].d, byId[par[p.id][1]].d)) return;
      p.d = d; dfs(i + 1); p.d = -1;
    });
  })(0);
  return {ok: found, sets: sets};
}

SFA.sim({
  id: "b6-c03-daltonisme", ch: "c03", tag: "Classique",
  titre: "Daltonisme : filles, garçons et chromosome X",
  resume: "Un père et une mère aux génotypes choisis : qui est atteint, qui est porteur ? Puis passe à l'échelle d'une population.",
  but: "Le gène du daltonisme est sur le chromosome X (Xᴰ vision normale, Xᵈ daltonisme, récessif). Choisis les parents et lis le risque pour les filles et pour les garçons. Le mode « Population » compare les fréquences chez les hommes et chez les femmes.",
  aRetenir: "Un garçon (XY) reçoit son X de sa mère et son Y de son père : un seul allèle récessif suffit à l'atteindre. Une fille (XX) doit recevoir deux allèles récessifs. Une mère porteuse (XᴰXᵈ) a une chance sur deux de transmettre Xᵈ à chaque enfant. Si Xᵈ a la fréquence q, les hommes atteints sont une proportion q, les femmes atteintes q².",
  piege: "Les femmes peuvent être atteintes (XᵈXᵈ) : il faut un père daltonien et une mère porteuse ou atteinte. Un père atteint ne transmet jamais son Xᵈ à ses fils : il leur donne le Y.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette;
    var mode = k.seg("Mode", [["f", "Famille"], ["p", "Population"]], "f");
    var mo = k.select("Mère", [["DD", "XᴰXᴰ (vision normale, non porteuse)"], ["Dd", "XᴰXᵈ (vision normale, porteuse)"], ["dd", "XᵈXᵈ (daltonienne)"]], "Dd");
    var fa = k.select("Père", [["D", "XᴰY (vision normale)"], ["d", "XᵈY (daltonien)"]], "D");
    var q = k.slider("Fréquence de l'allèle Xᵈ (population)", 0.5, 30, 0.5, 8, "%");
    var ro = k.readouts(["Filles atteintes", "Garçons atteints", "Filles porteuses", "Enfants atteints (au total)"]);
    var X = function(a){ return "X" + (a === "D" ? "ᴰ" : "ᵈ"); };
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      if (mode.value === "p"){
        var f = q.value / 100, men = f * 100, wom = f * f * 100, car = 2 * f * (1 - f) * 100;
        S.draw.text(c, "Dans une population : % de personnes concernées", c.W / 2, 16, {size: 13});
        B.bars(c, S, [{l: "Hommes atteints", v: men, c: P.red}, {l: "Femmes atteintes", v: wom, c: P.amber}, {l: "Femmes porteuses", v: car, c: P.teal}], 24, 44, c.W - 40, 270, Math.max(10, Math.ceil(Math.max(men, car) / 10) * 10), function(v){ return S.fmt(v, 2) + " %"; });
        S.draw.text(c, "Il y a environ " + S.fmt(men / wom, 1) + " fois plus d'hommes atteints que de femmes atteintes (1/q).", c.W / 2, 360, {size: 12, color: P.grey});
        ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "Hommes " + S.fmt(men, 1) + " % · femmes " + S.fmt(wom, 2) + " %");
        return;
      }
      var m = mo.value.split(""), fa1 = fa.value, cell = 78, ox = 70, oy = 70, nF = {a: 0, c: 0, n: 0}, nM = {a: 0, n: 0};
      S.draw.text(c, "Père →", ox - 36, oy - 38, {size: 12, color: P.grey});
      S.draw.text(c, "Gamètes du père", ox + cell, oy - 46, {size: 12, color: P.acc});
      S.draw.text(c, X(fa1), ox + cell * 0.5, oy - 18, {size: 15, color: P.acc}); S.draw.text(c, "Y", ox + cell * 1.5, oy - 18, {size: 15, color: P.acc});
      for (var i = 0; i < 2; i++){
        S.draw.text(c, X(m[i]), ox - 30, oy + cell * (i + 0.5), {size: 15, color: P.red});
        for (var j = 0; j < 2; j++){
          var x = ox + j * cell, y = oy + i * cell, txt, col, tc = "#fff";
          if (j === 0){ var g = [m[i], fa1].sort().join(""); /* D avant d */ var nd = (m[i] === "d" ? 1 : 0) + (fa1 === "d" ? 1 : 0);
            txt = X(g[0]) + X(g[1]) + " ♀"; if (nd === 2){ col = P.red; nF.a++; } else if (nd === 1){ col = P.amber; nF.c++; } else { col = P.green; nF.n++; } }
          else { txt = X(m[i]) + "Y ♂"; if (m[i] === "d"){ col = P.red; nM.a++; } else { col = P.green; nM.n++; } }
          ctx.fillStyle = col; ctx.fillRect(x, y, cell - 3, cell - 3);
          S.draw.text(c, txt, x + cell / 2 - 1, y + cell / 2 - 7, {size: 14, color: tc});
          S.draw.text(c, j === 0 ? (col === P.red ? "atteinte" : col === P.amber ? "porteuse" : "normale") : (col === P.red ? "atteint" : "normal"), x + cell / 2 - 1, y + cell / 2 + 14, {size: 12, color: tc, weight: 600});
        }
      }
      var lx = ox + 2 * cell + 20; if (c.W - lx > 110){ [[P.green, "normal(e)"], [P.amber, "porteuse"], [P.red, "atteint(e)"]].forEach(function(l, n2){ ctx.fillStyle = l[0]; ctx.fillRect(lx, oy + n2 * 28, 18, 18); S.draw.text(c, l[1], lx + 26, oy + 9 + n2 * 28, {align: "left", size: 12}); }); }
      S.draw.text(c, "Chaque case = 1/4 des enfants (2 cases filles, 2 cases garçons)", c.W / 2, oy + 2 * cell + 22, {size: 12, color: P.grey});
      var nt = nF.a + nM.a;
      var part = function(n, tot, nom, fem){ return n === 0 ? (fem ? "aucune " : "aucun ") + nom : n === tot ? (fem ? "toutes les " : "tous les ") + nom + "s" : frac(n, tot) + " des " + nom + "s"; };
      ro.set(0, part(nF.a, 2, "fille", true)); ro.set(1, part(nM.a, 2, "garçon", false)); ro.set(2, part(nF.c, 2, "fille", true)); ro.set(3, nt + " sur 4 (" + S.fmt(nt * 25, 0) + " %)");
      var tx = oy + 2 * cell + 50;
      S.draw.text(c, "Filles : " + nF.a + " atteinte, " + nF.c + " porteuse, " + nF.n + " normale", c.W / 2, tx, {size: 13});
      S.draw.text(c, "Garçons : " + nM.a + " atteint, " + nM.n + " normal", c.W / 2, tx + 24, {size: 13});
    });
  }
});

SFA.sim({
  id: "b6-c03-arbre", ch: "c03", tag: "Raisonnement",
  titre: "Arbre généalogique : quel mode de transmission ?",
  resume: "Trois familles, quatre hypothèses : un moteur teste chacune et te montre les génotypes possibles de chaque personne.",
  but: "Choisis une famille et une hypothèse. Le simulateur cherche s'il existe une attribution de génotypes compatible avec l'arbre. Touche une personne pour voir ses génotypes possibles. Carrés = hommes, ronds = femmes, plein = atteint, pointillé = conjoint venu de l'extérieur.",
  aRetenir: "Deux parents sains avec un enfant atteint : allèle récessif. Un garçon atteint avec une mère saine et un père non porteur : récessif lié à X. Atteints dans chaque génération, un père atteint qui transmet à son fils : dominant autosomique. N désigne l'allèle normal, m l'allèle de la maladie.",
  piege: "Un arbre ne prouve jamais à lui seul un mode de transmission : il peut seulement en exclure. On suppose ici l'allèle rare, donc les conjoints venus de l'extérieur n'en sont pas porteurs ; sans cette hypothèse, plusieurs modes resteraient possibles.",
  build: function(k, S){
    var c = k.canvas(350), P = S.draw.palette;
    var fam = k.seg("Famille", [["A", "A"], ["B", "B"], ["C", "C"]], "A", function(){ sel = null; });
    var hyp = k.select("Hypothèse testée", Object.keys(HYPS).map(function(h){ return [h, HYPS[h]]; }), "ar", function(){ sel = null; });
    var show = k.toggle("Montrer l'indice décisif", false);
    var ro = k.readouts(["Hypothèse testée", "Personne choisie"]);
    var note = k.note("", ""), sel = null, pos = {};
    var cache = {};
    function res(f, h){ var key = f + h; if (!cache[key]) cache[key] = solve(PEDS[f], h); return cache[key]; }
    c.pointer(function(t, p){
      if (t !== "down") return; sel = null;
      Object.keys(pos).forEach(function(id){ if (Math.abs(pos[id][0] - p.x) < 20 && Math.abs(pos[id][1] - p.y) < 22) sel = id; });
      k.redraw();
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, ped = PEDS[fam.value], by = {}, R = res(fam.value, hyp.value), i;
      pos = {};
      ped.people.forEach(function(p){ pos[p[0]] = [p[3] * c.W * 0.94 + c.W * 0.03, 58 + p[4] * 100, p]; by[p[0]] = pos[p[0]]; });
      /* liens */
      ctx.strokeStyle = "#4b5868"; ctx.lineWidth = 1.6;
      ped.unions.forEach(function(u){
        var a = pos[u[0]], b = pos[u[1]], y = a[1], mx = (a[0] + b[0]) / 2;
        ctx.beginPath(); ctx.moveTo(a[0] + 15, y); ctx.lineTo(b[0] - 15, y); ctx.stroke();
        var kx = u[2].map(function(id){ return pos[id][0]; }), yb = y + 46, x1 = Math.min.apply(null, kx.concat(mx)), x2 = Math.max.apply(null, kx.concat(mx));
        ctx.beginPath(); ctx.moveTo(mx, y); ctx.lineTo(mx, yb); ctx.moveTo(x1, yb); ctx.lineTo(x2, yb); ctx.stroke();
        u[2].forEach(function(id){ ctx.beginPath(); ctx.moveTo(pos[id][0], yb); ctx.lineTo(pos[id][0], pos[id][1] - 15); ctx.stroke(); });
      });
      ped.people.forEach(function(p){
        var x = pos[p[0]][0], y = pos[p[0]][1], out = ped.out.indexOf(p[0]) >= 0;
        ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = sel === p[0] ? P.red : "#13233a"; if (out) ctx.setLineDash([4, 3]);
        ctx.fillStyle = p[2] ? "#13233a" : "#fff"; ctx.beginPath();
        if (p[1] === "M") ctx.rect(x - 15, y - 15, 30, 30); else ctx.arc(x, y, 16, 0, 6.2832);
        ctx.fill(); ctx.stroke(); ctx.restore();
        if (sel === p[0]){ ctx.strokeStyle = P.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 24, 0, 6.2832); ctx.stroke(); }
        S.draw.text(c, p[0], x, y + 26, {size: 11, color: P.grey, weight: 600});
        if (R.ok && R.sets[p[0]]){ var gk = Object.keys(R.sets[p[0]]); S.draw.text(c, gk.length === 1 ? gk[0] : gk.length <= 2 ? gk.join(" ou ") : "?", x, y + 40, {size: 11, color: gk.length === 1 ? P.green : P.amber, weight: 800}); }
      });
      S.draw.label(c, R.ok ? "Hypothèse compatible" : "Hypothèse impossible", c.W / 2, 14, {color: R.ok ? P.green : P.red, size: 12.5});
      S.draw.text(c, "vert = génotype certain · orange = plusieurs possibles", c.W / 2, c.H - 12, {size: 10.5, color: P.grey});
      ro.set(0, HYPS[hyp.value] + (R.ok ? " : compatible" : " : impossible"));
      var tx = "";
      if (sel && R.ok){ tx = "<b>" + sel + "</b> : génotype(s) possible(s) → " + Object.keys(R.sets[sel]).join(" ou "); ro.set(1, sel + " : " + Object.keys(R.sets[sel]).join(" / ")); }
      else if (sel){ ro.set(1, "—"); } else ro.set(1, "Touche une personne");
      var base = R.ok ? "Hypothèse « " + HYPS[hyp.value] + " » : <b>compatible</b> avec l'arbre." : "Hypothèse « " + HYPS[hyp.value] + " » : <b>impossible</b> — aucune attribution de génotypes ne respecte à la fois les phénotypes et les lois de transmission.";
      note.set(base + (tx ? "<br>" + tx : "") + (show.value ? "<br><i>Indice : " + ped.key + "</i>" : ""), R.ok ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "b6-c03-recombinaison", ch: "c03", tag: "Classique",
  titre: "Gènes liés : crossing-over et fréquence de recombinants",
  resume: "Deux gènes sur le même chromosome : plus ils sont éloignés, plus souvent un crossing-over les sépare.",
  but: "Chez une drosophile AB/ab (les deux allèles dominants sur un chromosome, les deux récessifs sur l'autre), on réalise un test-cross avec ab/ab. Fais glisser le gène B (ou le curseur) : la proportion de descendants recombinés Ab et aB suit la distance.",
  aRetenir: "Plus deux gènes sont éloignés, plus la probabilité d'un crossing-over entre eux est grande. Par définition, 1 unité génétique (1 centimorgan) = 1 % de gamètes recombinés. Les descendants parentaux (AB, ab) sont majoritaires ; les recombinés (Ab, aB) sont minoritaires et en nombres égaux.",
  piege: "Les gènes liés ne sont pas « collés » pour toujours : ils se séparent avec la fréquence de recombinaison. Et la fréquence de recombinants ne dépasse jamais 50 % : à partir de là, les gènes se comportent comme des gènes indépendants (1 : 1 : 1 : 1).",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette;
    var d = k.slider("Distance entre A et B (unités génétiques)", 0, 60, 1, 15, "u.g.");
    var nn = k.select("Descendants du test-cross", [50, 200, 1000, 5000], 200);
    var seed = 1; k.button("Nouveau test-cross", function(){ seed++; });
    var ro = k.readouts(["Recombinants attendus", "Recombinants observés", "Distance estimée"]);
    var note = k.note("", "");
    var xA = 50, scale = function(){ return (c.W - xA - 40) / 60; };
    c.pointer(function(t, p){ if (t === "up" || t === "move" || p.y > 130) return; var v = Math.max(0, Math.min(60, Math.round((p.x - xA) / scale()))); d.set(v); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, D = d.value, r = Math.min(D, 50) / 100, N = +nn.value, sc = scale(), xB = xA + D * sc;
      /* chromosomes */
      [[34, "A", "B", P.acc, 1], [74, "a", "b", P.red, 0]].forEach(function(h){
        ctx.fillStyle = h[3]; ctx.globalAlpha = 0.25; ctx.fillRect(xA - 20, h[0] - 7, c.W - xA - 12, 14); ctx.globalAlpha = 1;
        ctx.fillStyle = h[3]; ctx.fillRect(xA - 4, h[0] - 11, 8, 22); ctx.fillRect(xB - 4, h[0] - 11, 8, 22);
        S.draw.text(c, h[1], xA, h[0] - 21, {size: 13, color: h[3]}); S.draw.text(c, h[2], xB, h[0] - 21, {size: 13, color: h[3]});
      });
      var mx = (xA + xB) / 2; if (D > 0){ ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx, 24); ctx.lineTo(mx + 6, 54); ctx.lineTo(mx, 84); ctx.stroke(); ctx.setLineDash([]); S.draw.text(c, "crossing-over possible ici", mx, 104, {size: 12, color: P.amber}); }
      S.draw.text(c, D === 0 ? "A et B au même endroit : jamais séparés" : "Distance A–B : " + D + " u.g. (glisse sur le dessin)", c.W / 2, 124, {size: 12, color: P.grey});
      /* échantillon */
      var rg = B.rng(seed * 3571 + N + D), cnt = [0, 0, 0, 0];
      for (var i = 0; i < N; i++){ var u = rg(), g = u < r ? (u < r / 2 ? 2 : 3) : (u < r + (1 - r) / 2 ? 0 : 1); cnt[g]++; }
      var items = ["AB", "ab", "Ab", "aB"].map(function(l, q){ return {l: l + (q < 2 ? " (parental)" : " (recomb.)"), v: cnt[q] / N * 100, e: (q < 2 ? (1 - r) / 2 : r / 2) * 100, c: q < 2 ? P.acc : P.red}; });
      S.draw.text(c, "% observé · attendu en pointillés (n = " + N + ")", c.W / 2, 152, {size: 12});
      B.bars(c, S, items.map(function(it){ it.l = it.l.replace(" (parental)", "").replace(" (recomb.)", ""); return it; }), 24, 172, c.W - 40, 190, 55, function(v){ return S.fmt(v, 1) + " %"; });
      S.draw.text(c, "parentaux              recombinés", c.W / 2, 398, {size: 12, color: P.grey});
      var obs = (cnt[2] + cnt[3]) / N * 100;
      ro.set(0, S.fmt(r * 100, 0) + " %"); ro.set(1, S.fmt(obs, 1) + " %"); ro.set(2, S.fmt(obs, 1) + " u.g.");
      note.set(D >= 50 ? "À 50 u.g. ou plus : 50 % de recombinants, comme pour des gènes indépendants. La distance n'est plus mesurable par un seul test-cross." : "Distance estimée = % de descendants recombinés : " + S.fmt(obs, 1) + " u.g. (vraie valeur : " + D + " u.g.). Plus l'échantillon est grand, plus l'estimation est précise.", D >= 50 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c03-ecaille", ch: "c03", tag: "Originale",
  titre: "Chats écaille de tortue : l'inactivation d'un chromosome X",
  resume: "Chez une chatte XᴼXᴺ, chaque cellule de l'embryon inactive au hasard l'un de ses deux X : le pelage devient une mosaïque.",
  but: "Le gène de la couleur orange est porté par le chromosome X (Xᴼ orange, Xᴺ non-orange, noir). Choisis un génotype, le nombre de cellules fondatrices et fais avancer le développement pour voir se former les plages de couleur.",
  aRetenir: "Dans chaque cellule d'une femelle, un des deux X est inactivé au hasard très tôt dans l'embryon ; toutes les cellules filles gardent le même choix. Une chatte XᴼXᴺ est donc une mosaïque de plages orange et noires. Il y a peu de cellules fondatrices : plages grandes ; beaucoup : plages petites.",
  piege: "Ce n'est pas un mélange de couleurs dans chaque cellule : chaque cellule exprime un seul X. Les mâles écaille de tortue sont rares et ont un chromosome X en trop (XᴼXᴺY), ils sont souvent stériles. Modèle simplifié : le motif réel dépend aussi d'un autre gène (taches blanches).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.95}), P = S.draw.palette;
    var gt = k.select("Génotype", [["f", "Femelle XᴼXᴺ (écaille de tortue)"], ["o", "Femelle XᴼXᴼ (orange)"], ["n", "Femelle XᴺXᴺ (noire)"], ["mo", "Mâle XᴼY (orange)"], ["mn", "Mâle XᴺY (noir)"], ["kl", "Mâle XᴼXᴺY (rare, stérile)"]], "f");
    var N = k.slider("Cellules fondatrices (au moment de l'inactivation)", 2, 64, 1, 12, "");
    var st = k.slider("Stade du développement", 5, 100, 5, 100, "%");
    var seed = 1; k.button("Nouvel embryon", function(){ seed++; });
    var ro = k.readouts(["Cellules orange", "Plages (zones d'une couleur)"]);
    var note = k.note("", "");
    var G = 30;
    function build(){
      var r = B.rng(seed * 8191 + N.value * 31), col = new Array(G * G), order = [], fr = [], i, mosaic = gt.value === "f" || gt.value === "kl";
      for (i = 0; i < G * G; i++) col[i] = -1;
      var sc = gt.value === "o" || gt.value === "mo" ? 1 : 0;
      function nb(i2){ var x = i2 % G, y = Math.floor(i2 / G), a = []; if (x > 0) a.push(i2 - 1); if (x < G - 1) a.push(i2 + 1); if (y > 0) a.push(i2 - G); if (y < G - 1) a.push(i2 + G); return a; }
      var n = 0; while (n < N.value){ var s = Math.floor(r() * G * G); if (col[s] < 0){ col[s] = mosaic ? (r() < 0.5 ? 1 : 0) : sc; order.push(s); n++; } }
      order.slice().forEach(function(s){ nb(s).forEach(function(q){ fr.push(q); }); });
      while (order.length < G * G){
        var j = Math.floor(r() * fr.length), q = fr[j]; fr[j] = fr[fr.length - 1]; fr.pop();
        if (col[q] >= 0) continue;
        var nbs = nb(q).filter(function(z){ return col[z] >= 0; }); col[q] = col[nbs[Math.floor(r() * nbs.length)]]; order.push(q);
        nb(q).forEach(function(z){ if (col[z] < 0) fr.push(z); });
      }
      return {col: col, order: order};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, M = build(), shown = Math.ceil(st.value / 100 * G * G), cs = Math.min((c.W - 16) / G, (c.H - 16) / G), ox = (c.W - cs * G) / 2, oy = (c.H - cs * G) / 2;
      var vis = new Array(G * G), i; for (i = 0; i < G * G; i++) vis[i] = -1;
      for (i = 0; i < shown; i++) vis[M.order[i]] = M.col[M.order[i]];
      for (i = 0; i < G * G; i++){ var x = i % G, y = Math.floor(i / G); ctx.fillStyle = vis[i] < 0 ? "#e9edf2" : vis[i] === 1 ? "#e8872b" : "#23262b"; ctx.fillRect(ox + x * cs, oy + y * cs, cs + 0.6, cs + 0.6); }
      /* comptages */
      var orange = 0, tot = 0, seen = new Array(G * G), plages = 0;
      for (i = 0; i < G * G; i++){ if (vis[i] < 0) continue; tot++; if (vis[i] === 1) orange++; }
      for (i = 0; i < G * G; i++){ if (vis[i] < 0 || seen[i]) continue; plages++; var stack = [i]; seen[i] = 1;
        while (stack.length){ var z = stack.pop(), zx = z % G, zy = Math.floor(z / G), a = []; if (zx > 0) a.push(z - 1); if (zx < G - 1) a.push(z + 1); if (zy > 0) a.push(z - G); if (zy < G - 1) a.push(z + G);
          a.forEach(function(w){ if (!seen[w] && vis[w] === vis[i]){ seen[w] = 1; stack.push(w); } }); } }
      if (gt.value === "o" || gt.value === "n" || gt.value === "mo" || gt.value === "mn") plages = tot > 0 ? 1 : 0;
      ro.set(0, S.fmt(orange / tot * 100, 0) + " %"); ro.set(1, plages);
      var g = gt.value;
      note.set(g === "f" || g === "kl" ? "Mosaïque : chaque plage descend d'une cellule fondatrice qui a inactivé l'un des deux X. Environ la moitié des plages sont orange en moyenne." : "Un seul type d'allèle (ou un seul X actif) : pelage uniforme, aucune mosaïque, même s'il y a inactivation d'un X chez les femelles homozygotes.", g === "f" || g === "kl" ? "ok" : "");
    });
  }
});
})();
