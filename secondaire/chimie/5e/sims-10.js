/* Chapitre 10 · Introduction à la chimie organique : alcanes et combustion */
C5.CHAIN = ["", "méthane", "éthane", "propane", "butane", "pentane", "hexane", "heptane", "octane", "nonane", "décane"];
C5.BP = [null, -162, -89, -42, -1, 36, 69, 98, 126, 151, 174, 196, 216, 235, 254, 271, 287, 302, 316, 330, 343];
C5.ALK_NAME = function(m){   /* nom d'un alcane ramifié : m = {L, subs:[{p: indice 0..L-1, len: 1|2}]} */
  var L = m.L, SUB = ["", "méthyl", "éthyl"], MULT = ["", "", "di", "tri", "tétra"];
  function loc(rev){ return m.subs.map(function(s){ return {p: rev ? L - s.p : s.p + 1, len: s.len}; }); }
  var f = loc(false), r = loc(true), fs = f.map(function(s){ return s.p; }).sort(function(a, b){ return a - b; }), rs = r.map(function(s){ return s.p; }).sort(function(a, b){ return a - b; });
  var useRev = false; for (var i = 0; i < fs.length; i++){ if (rs[i] < fs[i]){ useRev = true; break; } if (rs[i] > fs[i]) break; }
  var list = useRev ? r : f;
  if (!list.length) return C5.CHAIN[L];
  var g = {}; list.forEach(function(s){ (g[s.len] = g[s.len] || []).push(s.p); });
  var parts = Object.keys(g).sort(function(a, b){ return SUB[a].localeCompare(SUB[b], "fr"); }).map(function(len){ var ps = g[len].sort(function(a, b){ return a - b; }); return ps.join(",") + "-" + MULT[ps.length] + SUB[len]; });
  return parts.join("-") + C5.CHAIN[L];
};
C5.ALK_POINTS = function(m, x0, y0, dx, dy){   /* positions des carbones : chaîne en zigzag + substituants */
  var pts = [], i;
  for (i = 0; i < m.L; i++) pts.push({x: x0 + i * dx, y: y0 + (i % 2 ? -dy : dy) / 2, main: true, idx: i, nb: []});
  for (i = 0; i < m.L - 1; i++){ pts[i].nb.push(i + 1); pts[i + 1].nb.push(i); }
  var cnt = {}, seen = {};
  m.subs.forEach(function(s){ cnt[s.p] = (cnt[s.p] || 0) + 1; });
  m.subs.forEach(function(s){
    var base = pts[s.p], up = base.y < y0 ? -1 : 1, prev = s.p;
    var j = seen[s.p] === undefined ? 0 : seen[s.p] + 1; seen[s.p] = j;
    var off = cnt[s.p] > 1 ? (j === 0 ? -0.4 : 0.4) * dx : 0;   /* deux substituants sur le même carbone : côte à côte, pas superposés */
    for (var k = 0; k < s.len; k++){
      var np = {x: base.x + off + (k % 2 ? dx * 0.45 : 0), y: base.y + up * dy * 0.9 * (k + 1), main: false, nb: [prev]};
      pts.push(np); pts[prev].nb.push(pts.length - 1); prev = pts.length - 1;
    }
  });
  return pts;
};
C5.ALK_DRAW = function(c, S, m, o){
  o = o || {}; var pal = S.draw.palette, W = c.W, ctx = c.ctx, dx = Math.min(46, (W - 70) / Math.max(1, m.L - 1)), dy = 36, x0 = (W - dx * (m.L - 1)) / 2, y0 = o.y0 || c.H / 2;
  var pts = C5.ALK_POINTS(m, x0, y0, dx, dy), i;
  /* chaîne principale : bande colorée sous le dessin */
  if (o.chain){
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "rgba(192,50,29,.16)"; ctx.lineWidth = 26; ctx.beginPath();
    for (i = 0; i < m.L; i++) i ? ctx.lineTo(pts[i].x, pts[i].y) : ctx.moveTo(pts[i].x, pts[i].y); ctx.stroke(); ctx.restore();
  }
  if (o.H){
    pts.forEach(function(p){
      var hn = 4 - p.nb.length; if (hn <= 0) return; var sx = 0, sy = 0;
      p.nb.forEach(function(b){ var q = pts[b], ux = q.x - p.x, uy = q.y - p.y, l = Math.hypot(ux, uy) || 1; sx += ux / l; sy += uy / l; });
      var base = (sx || sy) ? Math.atan2(-sy, -sx) : -Math.PI / 2;
      for (var j = 0; j < hn; j++){ var a = base + (hn === 1 ? 0 : (j - (hn - 1) / 2) * 0.95), hx = p.x + Math.cos(a) * dx * 0.5, hy = p.y + Math.sin(a) * dx * 0.5; S.draw.line(c, p.x, p.y, hx, hy, "#9aa6b6", 2); C5.atom(c, hx, hy, 5.5, C5.CPK.H, ""); }
    });
  }
  pts.forEach(function(p, a){ p.nb.forEach(function(b){ if (b > a){ var q = pts[b], hl = o.chain && p.main && q.main; S.draw.line(c, p.x, p.y, q.x, q.y, hl ? pal.red : "#2c3a4e", hl ? 5 : 3.2); } }); });
  pts.forEach(function(p, a){
    var h = 4 - p.nb.length, lab = h === 0 ? "C" : h === 1 ? "CH" : "CH" + C5.sub(h);
    if (h > 3) lab = "CH₄";
    var hl = o.chain && p.main;
    if (o.H) C5.atom(c, p.x, p.y, 10, C5.CPK.C, "C", "#ffffff");
    else { ctx.save(); S.draw.rrect(c, p.x - 16, p.y - 10, 32, 20, 7); ctx.fillStyle = hl ? "#fde2df" : "#ffffff"; ctx.fill(); ctx.strokeStyle = hl ? pal.red : "#9aa6b6"; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore(); S.draw.text(c, lab, p.x, p.y, {size: 12.5, color: hl ? pal.red : pal.ink}); }
    if (o.num && p.main){ var n = o.rev ? m.L - p.idx : p.idx + 1, by = p.y < y0 ? 26 : -26; ctx.beginPath(); ctx.arc(p.x, p.y + by, 10, 0, 6.3); ctx.fillStyle = pal.acc; ctx.fill(); S.draw.text(c, String(n), p.x, p.y + by, {size: 12, color: "#ffffff"}); }
    if (o.chain && !p.main && p.nb.length && pts[p.nb[0]].main){
      var two = pts.some(function(q, qi){ return !q.main && q.nb[0] === a; });
      S.draw.label(c, two ? "éthyl" : "méthyl", p.x + (two ? 30 : 30), p.y, {color: pal.amber, size: 11.5, align: "left"});
    }
  });
  return pts;
};

SFA.sim({
  id: "c5-c10-constructeur", ch: "c10", tag: "Classique",
  titre: "Constructeur d'alcanes : de CH₄ à C₁₀H₂₂",
  resume: "Nombre de carbones → nom, formule, masse molaire, état, T d'ébullition, isomères.",
  but: "Fais varier n de 1 à 10. Lis le nom, la formule brute CₙH₂ₙ₊₂, la masse molaire et l'état à 20 °C. Pour n = 4, 5 et 6, parcours les isomères et compare leurs températures d'ébullition.",
  aRetenir: "Les alcanes ont pour formule brute CₙH₂ₙ₊₂ et ne comportent que des liaisons simples C–C et C–H. Chaque carbone a 4 liaisons. Du méthane au butane : gaz ; du pentane au décane : liquides à 20 °C (sauf l'isomère le plus ramifié du pentane, le 2,2-diméthylpropane, qui bout à 10 °C : c'est un gaz). Plus la chaîne est longue, plus T_eb est élevée. Les isomères de chaîne ont la même formule brute mais des enchaînements différents.",
  piege: "Deux molécules de même formule brute ne sont pas forcément la même molécule : le butane et le 2-méthylpropane sont tous deux C₄H₁₀. Plus une molécule est ramifiée (compacte), plus sa température d'ébullition est BASSE à même formule. Masses molaires arrondies (C : 12 ; H : 1).",
  build: function(k, S){
    var pal = S.draw.palette;
    var ISO = {
      4: [{L: 4, subs: [], bp: -1}, {L: 3, subs: [{p: 1, len: 1}], bp: -12}],
      5: [{L: 5, subs: [], bp: 36}, {L: 4, subs: [{p: 1, len: 1}], bp: 28}, {L: 3, subs: [{p: 1, len: 1}, {p: 1, len: 1}], bp: 10}],
      6: [{L: 6, subs: [], bp: 69}, {L: 5, subs: [{p: 1, len: 1}], bp: 60}, {L: 5, subs: [{p: 2, len: 1}], bp: 63}, {L: 4, subs: [{p: 1, len: 1}, {p: 1, len: 1}], bp: 50}, {L: 4, subs: [{p: 1, len: 1}, {p: 2, len: 1}], bp: 58}]
    };
    var NISO = [0, 1, 1, 1, 2, 3, 5, 9, 18, 35, 75];
    var c = k.canvas(250), g = k.canvas(180);
    var n = k.slider("Nombre d'atomes de carbone n", 1, 10, 1, 4, "", function(){ iso.el.max = ISO[n.value] ? ISO[n.value].length : 1; iso.set(1); });
    var iso = k.slider("Isomère affiché", 1, 2, 1, 1, "");
    var showH = k.toggle("Montrer tous les atomes d'hydrogène (formule développée)", false);
    var tmm = 0; k.loop(function(dt, t){ tmm = t; k.redraw(); }).play();
    var ro = k.readouts(["Nom", "Formule brute", "Masse molaire", "État à 20 °C", "T d'ébullition", "Nombre d'isomères (de chaîne)"]);
    var nt = k.note("", "");
    function struct(nn, ii){ if (ISO[nn]) return ISO[nn][Math.min(ii, ISO[nn].length) - 1]; return {L: nn, subs: [], bp: C5.BP[nn]}; }
    k.draw(function(){
      var nn = n.value, m = struct(nn, iso.value), nm = C5.ALK_NAME(m), M = 14 * nn + 2; c.clear(); g.clear();
      C5.ALK_DRAW(c, S, m, {y0: 118, H: showH.value});
      /* éprouvette : gaz ou liquide à 20 °C */
      var isGas = m.bp <= 20, tx = c.W - 44, ty = 30, ctx0 = c.ctx;
      ctx0.save(); ctx0.strokeStyle = "#51627a"; ctx0.lineWidth = 2.2; ctx0.beginPath(); ctx0.moveTo(tx - 13, ty); ctx0.lineTo(tx - 13, ty + 52); ctx0.arc(tx, ty + 52, 13, Math.PI, 0, true); ctx0.lineTo(tx + 13, ty); ctx0.stroke();
      if (!isGas){ ctx0.fillStyle = "rgba(120,170,230,.6)"; ctx0.beginPath(); ctx0.moveTo(tx - 12, ty + 20); ctx0.lineTo(tx - 12, ty + 52); ctx0.arc(tx, ty + 52, 12, Math.PI, 0, true); ctx0.lineTo(tx + 12, ty + 20); ctx0.closePath(); ctx0.fill(); }
      else for (var bb = 0; bb < 6; bb++){ var ph = (tmm * 0.5 + bb * 0.17) % 1; S.draw.dot(c, tx - 7 + (bb * 5) % 14, ty + 56 - ph * 70, 2.5, "rgba(120,140,180,.7)"); }
      ctx0.restore(); S.draw.label(c, isGas ? "gaz" : "liquide", tx, ty + 82, {color: isGas ? pal.amber : pal.acc, size: 12});
      var shown = ISO[nn] && ISO[nn].length > 1 ? "isomère " + Math.min(iso.value, ISO[nn].length) + " sur " + ISO[nn].length : "";
      S.draw.text(c, shown, 8, 12, {size: 12, align: "left", color: pal.grey});
      S.draw.text(c, showH.value ? "chaque carbone : 4 liaisons exactement" : "CHₓ : les H qui complètent les 4 liaisons de chaque C", c.W / 2, c.H - 12, {size: 12, color: pal.grey});
      var ax = S.draw.axes(g, {x0: 0, x1: 11, y0: -180, y1: 200, stepX: 100, stepY: 100, l: 48, t: 22, b: 30});
      for (var tx = 1; tx <= 10; tx++) S.draw.text(g, String(tx), ax.X(tx), g.H - 12, {size: 12, color: pal.grey}); S.draw.text(g, "n", g.W - 8, g.H - 12, {size: 12, color: pal.grey, align: "right"});
      S.draw.text(g, "T d'ébullition des n-alcanes (°C)", 52, 10, {size: 12, align: "left", color: pal.grey});
      for (var q = 1; q <= 10; q++){ S.draw.dot(g, ax.X(q), ax.Y(C5.BP[q]), q === nn ? 7 : 4, q === nn ? pal.red : pal.acc); if (q > 1) S.draw.line(g, ax.X(q - 1), ax.Y(C5.BP[q - 1]), ax.X(q), ax.Y(C5.BP[q]), pal.light, 1.5); }
      S.draw.line(g, ax.X(0), ax.Y(20), ax.X(11), ax.Y(20), pal.green, 1.2, [5, 4]); S.draw.text(g, "20 °C", ax.X(11) - 2, ax.Y(20) - 9, {size: 12, color: pal.green, align: "right"});
      if (ISO[nn]) ISO[nn].forEach(function(s, i2){ S.draw.dot(g, ax.X(nn), ax.Y(s.bp), 5, i2 === Math.min(iso.value, ISO[nn].length) - 1 ? pal.amber : "#d9b27a"); });
      var bp = m.bp, state = bp > 20 ? "liquide" : "gaz";
      ro.set(0, nm); ro.set(1, "C" + (nn > 1 ? C5.sub(nn) : "") + "H" + C5.sub(2 * nn + 2)); ro.set(2, M + " g/mol"); ro.set(3, state); ro.set(4, bp + " °C"); ro.set(5, NISO[nn]);
      nt.set(ISO[nn] && ISO[nn].length > 1 ? "Points ocre : les isomères de chaîne. Le plus ramifié bout le plus bas : surface de contact plus petite entre molécules compactes → forces de van der Waals plus faibles." : (NISO[nn] > 1 ? "Il existe " + NISO[nn] + " isomères de chaîne pour n = " + nn + " (seuls ceux de n = 4, 5 et 6 sont dessinés ici)." : "Un seul enchaînement possible pour n ≤ 3."), "");
      ro.set(0, nm);
    });
  }
});

SFA.sim({
  id: "c5-c10-nomenclature", ch: "c10", tag: "Défi",
  titre: "Nommer un alcane en quatre gestes",
  resume: "Chaîne la plus longue, numérotation, substituants : un nom construit pas à pas.",
  but: "Choisis une molécule, avance dans les étapes (chaîne principale, numérotation), inverse le sens si besoin pour obtenir les plus petits numéros, puis choisis le bon nom.",
  aRetenir: "1) Chaîne carbonée la plus longue → nom de base (pentane…). 2) Numérote de l'extrémité qui donne les plus petits numéros aux ramifications (substituants). 3) Nomme les substituants (méthyl, éthyl), avec di-, tri-… s'ils se répètent ; classe-les dans l'ordre alphabétique (éthyl avant méthyl). 4) Écris : numéros-substituants + chaîne.",
  piege: "La chaîne principale n'est pas forcément la chaîne « horizontale » du dessin : il faut compter. On compare les ENSEMBLES de numéros dès le premier numéro (2,4 est plus petit que 3,5). Un même numéro se répète pour chaque substituant : 2,2-diméthyl (pas 2-diméthyl).",
  build: function(k, S){
    var pal = S.draw.palette;
    var MOL = [
      {m: {L: 4, subs: [{p: 1, len: 1}]}, opts: ["2-méthylbutane", "3-méthylbutane", "2-méthylpropane", "2-éthylpropane"]},
      {m: {L: 6, subs: [{p: 2, len: 1}]}, opts: ["3-méthylhexane", "4-méthylhexane", "2-éthylpentane", "3-méthylheptane"]},
      {m: {L: 4, subs: [{p: 1, len: 1}, {p: 1, len: 1}]}, opts: ["2,2-diméthylbutane", "3,3-diméthylbutane", "2-diméthylbutane", "2,2-diméthylpropane"]},
      {m: {L: 5, subs: [{p: 1, len: 1}, {p: 2, len: 1}]}, opts: ["2,3-diméthylpentane", "3,4-diméthylpentane", "2,3-diméthylhexane", "2,3-méthylpentane"]},
      {m: {L: 5, subs: [{p: 1, len: 1}, {p: 1, len: 1}, {p: 3, len: 1}]}, opts: ["2,2,4-triméthylpentane", "2,4,4-triméthylpentane", "2,2,4-diméthylpentane", "2,2,4-triméthylhexane"]},
      {m: {L: 6, subs: [{p: 1, len: 1}, {p: 3, len: 2}]}, opts: ["4-éthyl-2-méthylhexane", "3-éthyl-5-méthylhexane", "2-méthyl-4-éthylhexane", "4-éthyl-2-méthylheptane"]}
    ];
    var c = k.canvas(250);
    var sel = k.select("Molécule", MOL.map(function(x, i){ return [i, "Molécule " + (i + 1) + " (C" + (x.m.L + x.m.subs.reduce(function(a, s){ return a + s.len; }, 0)) + ")"]; }), 0, function(){ rev = false; picked = null; shuffle(); });
    var step = k.seg("Étape", [["0", "Molécule"], ["1", "1 · Chaîne"], ["2", "2 · Numéros"]], "2");
    var rev = false;
    k.button("Inverser le sens de numérotation", function(){ rev = !rev; }, true);
    var ro = k.readouts(["Chaîne principale", "Substituants", "Numéros dans ce sens", "Numéros dans l'autre sens", "Ensemble retenu"]);
    var opts = [], picked = null, ans;
    function shuffle(){ var m = MOL[sel.value], a = m.opts.slice(), i, j, t; for (i = a.length - 1; i > 0; i--){ j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } opts = a; ans.el.innerHTML = ""; a.forEach(function(o){ var op = document.createElement("option"); op.value = o; op.textContent = o; ans.el.appendChild(op); }); ans.el.insertBefore(Object.assign(document.createElement("option"), {value: "", textContent: "— choisis —"}), ans.el.firstChild); ans.el.value = ""; }
    ans = k.select("Ton nom", [["", "— choisis —"]], "", function(v){ picked = v || null; });
    var nt = k.note("", "");
    shuffle();
    c.pointer(function(type, p){ if (type === "down"){ rev = p.x > c.W / 2; k.redraw(); } });
    k.draw(function(){
      var mo = MOL[sel.value], m = mo.m, name = C5.ALK_NAME(m); c.clear();
      var st = parseInt(step.value, 10);
      C5.ALK_DRAW(c, S, m, {y0: 130, chain: st >= 1, num: st >= 2, rev: rev});
      S.draw.text(c, st >= 2 ? "clique à gauche / à droite : sens de la numérotation" : "avance dans les étapes pour voir la chaîne puis les numéros", c.W / 2, c.H - 12, {size: 12, color: pal.grey});
      var f = m.subs.map(function(s){ return s.p + 1; }).sort(function(a, b){ return a - b; }), r = m.subs.map(function(s){ return m.L - s.p; }).sort(function(a, b){ return a - b; });
      var sNames = m.subs.map(function(s){ return s.len === 1 ? "méthyl" : "éthyl"; });
      var dirNow = rev ? r : f, dirOther = rev ? f : r;
      var better = true; for (var i = 0; i < dirNow.length; i++){ if (dirNow[i] < dirOther[i]){ break; } if (dirNow[i] > dirOther[i]){ better = false; break; } }
      var correct = (function(){ for (var q = 0; q < f.length; q++){ if (r[q] < f[q]) return true; if (r[q] > f[q]) return false; } return false; })();
      ro.set(0, C5.CHAIN[m.L] + " (" + m.L + " C)"); ro.set(1, sNames.join(", ")); ro.set(2, "(" + (st >= 2 ? dirNow.join(", ") : "…") + ")"); ro.set(3, "(" + (st >= 2 ? dirOther.join(", ") : "…") + ")");
      ro.set(4, st >= 2 ? (better ? "ce sens est le bon : plus petit ensemble" : "l'autre sens donne un ensemble plus petit") : "…");
      if (picked){ var okn = picked === name; nt.set(okn ? "Bravo : " + name + ". " : "Pas tout à fait (« " + picked + " »). Vérifie : chaîne la plus longue ? numéros les plus petits ? di-/tri- ? ordre alphabétique ?", okn ? "ok" : "warn"); }
      else nt.set("Avance dans les étapes, puis choisis ton nom dans la liste.", "");
    });
  }
});

SFA.sim({
  id: "c5-c10-combustion", ch: "c10", tag: "Expérience virtuelle",
  titre: "Combustion complète ou incomplète : le rôle du dioxygène",
  resume: "Un alcane, une quantité d'O₂ : CO₂ + H₂O, ou CO, ou suie ? Et l'énergie libérée.",
  but: "Choisis un alcane et fais baisser l'apport de O₂ sous la quantité nécessaire pour la combustion complète. Regarde la flamme, les produits et l'énergie libérée. À partir de quand le monoxyde de carbone apparaît-il ?",
  aRetenir: "Combustion complète : CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → n CO₂ + (n+1) H₂O (flamme bleue, énergie maximale). Si O₂ manque : monoxyde de carbone CO (gaz toxique, invisible, inodore), puis carbone C (suie, flamme jaune) ; il se libère moins d'énergie, le reste est « dans » le CO et le C qui pourraient encore brûler.",
  piege: "Une flamme jaune n'est pas « plus chaude » : elle signale une combustion incomplète (suie incandescente). Le CO ne se voit pas et ne sent pas : c'est la cause d'intoxications avec des chauffe-eau mal ventilés. Modèle simplifié : l'hydrogène brûle d'abord entièrement en eau, le carbone se répartit ensuite entre CO₂, CO et C selon l'O₂ restant ; enthalpies de combustion à partir de valeurs de table arrondies.",
  build: function(k, S){
    var pal = S.draw.palette;
    var DH = [0, 890, 1560, 2220, 2877, 3509, 4163, 4817, 5470];
    var c = k.canvas(380);
    var sel = k.select("Alcane", [1, 2, 3, 4, 5, 6, 7, 8].map(function(n){ return [n, C5.CHAIN[n] + " (C" + (n > 1 ? C5.sub(n) : "") + "H" + C5.sub(2 * n + 2) + ")"]; }), 3);
    var r = k.slider("O₂ fourni / O₂ nécessaire (combustion complète)", 0.3, 1.5, 0.05, 1, "×");
    var ro = k.readouts(["CO₂ formé", "CO formé", "Suie (C) formée", "H₂O formée", "Énergie libérée", "Part de l'énergie maximale"]);
    var nt = k.note("", "");
    var tm = 0, soot = 0;
    k.loop(function(dt, t){ tm = t; k.redraw(); }).play();
    var O2 = [[-4.5, 0, 5, "#e8594a"], [4.5, 0, 5, "#e8594a"]], CO2m = [[-8, 0, 4.6, "#e8594a"], [0, 0, 5.6, "#59636f"], [8, 0, 4.6, "#e8594a"]], H2Om = [[0, 0, 5, "#e8594a"], [-5, 5, 3, "#f4f6fa"], [5, 5, 3, "#f4f6fa"]], COm = [[-4, 0, 5.4, "#59636f"], [4.5, 0, 4.8, "#e8594a"]];
    function mols(list, mol, cx0, w, y0, hgt, T, speed, seed){
      for (var i = 0; i < list; i++){
        var ph = (T * speed + i * 0.211 + seed) % 1, x = cx0 + Math.sin(i * 2.7 + seed * 9 + T) * w * 0.5 + (((i * 0.618 + seed) % 1) - 0.5) * w, y = y0 - ph * hgt, a = T + i, cs = Math.cos(a), sn = Math.sin(a);
        c.ctx.globalAlpha = Math.min(1, ph * 6) * Math.min(1, (1 - ph) * 4);
        mol.forEach(function(m){ C5.atom(c, x + (m[0] * cs - m[1] * sn) * 0.8, y + (m[0] * sn + m[1] * cs) * 0.8, m[2] * 0.8, m[3], ""); });
        c.ctx.globalAlpha = 1;
      }
    }
    k.draw(function(){
      var n = parseInt(sel.value, 10), a = r.value * (3 * n + 1) / 2, Rr = a - (n + 1) / 2, x = 0, y = 0, s = 0, valid = true, eq;
      if (Rr < 0) valid = false;
      else if (Rr >= n){ x = n; }
      else if (Rr >= n / 2){ y = 2 * (n - Rr); x = n - y; }
      else { y = 2 * Rr; s = n - y; }
      var E = DH[n] - 283 * y - 394 * s, part = E / DH[n]; c.clear();
      var ctx = c.ctx, wide = c.W >= 440, cx = wide ? c.W * 0.36 : c.W / 2, by = 246, T = tm;
      C5.bench(c, by + 44);
      /* bec : tube, virole d'air, pied */
      var gr = ctx.createLinearGradient(cx - 12, 0, cx + 12, 0); gr.addColorStop(0, "#8e9aab"); gr.addColorStop(0.45, "#e1e7ef"); gr.addColorStop(1, "#7b8798");
      ctx.fillStyle = gr; ctx.fillRect(cx - 11, by, 22, 44); ctx.fillStyle = "#4a5568"; ctx.fillRect(cx - 15, by + 14, 30, 11); ctx.fillStyle = "#1f2937"; ctx.fillRect(cx - 5, by + 17, 10, 5);
      S.draw.rrect(c, cx - 32, by + 40, 64, 8, 4); ctx.fillStyle = "#3a4558"; ctx.fill();
      if (valid){
        var sootY = s > 0.05, coY = y > 0.05, h = 70 + 80 * Math.min(1, r.value), wob = Math.sin(T * 8) * 3;
        var oc = sootY ? "255,176,40" : coY ? "150,170,255" : "70,110,255";
        S.draw.glow(c, cx, by - h / 2, 120, sootY ? "#ffb23a" : "#6b8cff", 0.3);
        ctx.fillStyle = "rgba(" + oc + ",.55)"; C5.flame(ctx, cx, by, h, 24, wob); ctx.fill();
        ctx.fillStyle = "rgba(" + (sootY ? "255,205,70" : oc) + ",.6)"; C5.flame(ctx, cx, by, h * 0.68, 15, wob * 0.7); ctx.fill();
        ctx.fillStyle = "rgba(55,85,255,.85)"; C5.flame(ctx, cx, by, h * 0.28, 7, wob * 0.3); ctx.fill();
        /* capsule en porcelaine au-dessus : la suie s'y dépose */
        var dyy = by - 190; soot += (Math.min(1, s / n * 2.6) - soot) * 0.03;
        S.draw.rrect(c, cx - 58, dyy, 116, 12, 5); ctx.fillStyle = "#f1f4f8"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.fillStyle = "rgba(20,20,24," + (0.88 * soot) + ")"; ctx.beginPath(); ctx.ellipse(cx, dyy + 12, 12 + 36 * soot, 3 + 5 * soot, 0, 0, Math.PI); ctx.fill();
        S.draw.text(c, "capsule en porcelaine", cx, dyy - 11, {size: 11.5, color: pal.grey});
        /* molécules : O₂ entrent à gauche, produits montent */
        mols(Math.round(4 * Math.min(1.5, r.value)), O2, cx - 74, 24, by + 20, 70, T, 0.35, 0.1);
        S.draw.arrow(c, cx - 110, by + 26, cx - 40, by + 26, pal.acc, 2); S.draw.text(c, "O₂", cx - 122, by + 26, {size: 12, color: pal.acc});
        mols(Math.min(9, Math.round(x * 2.2 / Math.max(1, n / 3))), CO2m, cx + 52, 26, by - 20, 140, T, 0.28, 0.4);
        mols(Math.min(9, Math.round((n + 1) * 1.1 / Math.max(1, n / 3))), H2Om, cx - 52, 26, by - 20, 140, T, 0.3, 0.7);
        mols(Math.min(9, Math.round(y * 2.2 / Math.max(1, n / 3))), COm, cx + 80, 20, by - 20, 140, T, 0.32, 0.2);
        if (sootY) for (var q = 0; q < 14; q++){ var ph = (T * 0.5 + q * 0.17) % 1; S.draw.dot(c, cx + Math.sin(q * 2.3 + T) * 22 * (0.4 + ph), by - h - ph * 60, 2 + (q % 3), "rgba(35,35,40," + (0.75 * (1 - ph)) + ")"); }
        eq = "C" + (n > 1 ? C5.sub(n) : "") + "H" + C5.sub(2 * n + 2) + " + " + S.fmt(a, 1) + " O₂ → " + (x > 0.005 ? S.fmt(x, 1) + " CO₂ + " : "") + (y > 0.005 ? S.fmt(y, 1) + " CO + " : "") + (s > 0.005 ? S.fmt(s, 1) + " C + " : "") + (n + 1) + " H₂O";
        S.draw.text(c, eq, c.W / 2, 14, {size: 12.5});
        S.draw.label(c, y > 0.05 ? "flamme bleue pâle : CO invisible" : s > 0.05 ? "flamme jaune : suie" : "flamme bleue", cx, by + 64, {color: y > 0.05 || s > 0.05 ? pal.red : pal.green, size: 12});
        /* détecteur de CO + légende des produits */
        var px = wide ? c.W * 0.7 : c.W - 56;
        if (wide){ S.draw.display(c, S.fmt(y, 2) + " mol", c.W * 0.84, 80, {w: 112, h: 52, caption: "détecteur de CO", size: 18, color: y > 0.05 ? "#a02b1c" : "#1e7a46"}); S.draw.legend(c, [["#e8594a", "CO₂ : C gris + 2 O"], ["#c0c8d4", "H₂O : O + 2 H"], [pal.amber, "CO : C + O (toxique)"], ["#23232a", "suie : C"]], c.W * 0.62, 130); }
        else S.draw.display(c, S.fmt(y, 2) + " mol", c.W - 56, 62, {w: 92, h: 46, caption: "détecteur CO", size: 15, color: y > 0.05 ? "#a02b1c" : "#1e7a46"});
        var bw = c.W - 40, yb = c.H - 22; ctx.fillStyle = "#e3e7ed"; ctx.fillRect(20, yb, bw, 12);
        ctx.fillStyle = pal.green; ctx.fillRect(20, yb, bw * x / n, 12); ctx.fillStyle = pal.amber; ctx.fillRect(20 + bw * x / n, yb, bw * y / n, 12); ctx.fillStyle = "#23232a"; ctx.fillRect(20 + bw * (x + y) / n, yb, bw * s / n, 12);
        S.draw.text(c, "devenir des " + n + " C : vert CO₂, orange CO, noir suie", c.W / 2, yb - 10, {size: 12, color: pal.grey});
      } else S.draw.text(c, "O₂ vraiment insuffisant : même l'hydrogène ne brûle plus complètement", c.W / 2, 100, {size: 13, color: pal.red});
      ro.set(0, valid ? S.fmt(x, 2) + " mol" : "—"); ro.set(1, valid ? S.fmt(y, 2) + " mol" : "—"); ro.set(2, valid ? S.fmt(s, 2) + " mol" : "—"); ro.set(3, valid ? (n + 1) + " mol" : "—");
      ro.set(4, valid ? S.fmt(E, 0) + " kJ/mol" : "—"); ro.set(5, valid ? S.fmt(100 * part, 0) + " %" : "—");
      nt.set(!valid ? "En dessous de ce seuil, le modèle simplifié (« l'hydrogène brûle en premier ») ne s'applique plus." : r.value >= 1 ? "Combustion complète (O₂ en excès : " + S.fmt(a - (3 * n + 1) / 2, 1) + " mol). Énergie maximale : " + DH[n] + " kJ/mol." : y > 0.005 || s > 0.005 ? "Combustion incomplète : " + S.fmt(y, 2) + " mol de CO et " + S.fmt(s, 2) + " mol de suie par mole d'alcane. Énergie perdue = 283·n(CO) + 394·n(C) = " + S.fmt(283 * y + 394 * s, 0) + " kJ (CO et C peuvent encore brûler)." : "Juste assez de O₂ pour tout brûler.", r.value >= 1 ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "c5-c10-raffinage", ch: "c10", tag: "Niche utile",
  titre: "Le raffinage : séparer le pétrole par distillation",
  resume: "Chauffe le brut : les alcanes courts s'évaporent d'abord ; chaque fraction a ses usages.",
  but: "Glisse sur le graphe (ou le curseur) pour changer la température. Les alcanes dont T_eb est inférieure à T passent en vapeur. Repère les fractions : gaz, essence, kérosène, gazole, résidus.",
  aRetenir: "Le pétrole est un mélange d'hydrocarbures de longueurs de chaîne très variées. À la distillation fractionnée, les molécules courtes (T_eb basse) s'évaporent d'abord et sortent en haut de la colonne ; les longues (T_eb élevée) restent en bas. On sépare ainsi des fractions : gaz, essences, kérosène, gazole, résidus lourds.",
  piege: "Une fraction n'est pas une substance pure : c'est un mélange d'alcanes (et d'autres hydrocarbures) dont les T_eb sont dans un intervalle. Les limites entre fractions utilisées ici sont des conventions simplifiées. Et on sépare par différence de T_eb : c'est l'ensemble du pétrole qu'on exploite, pas un seul alcane.",
  build: function(k, S){
    var pal = S.draw.palette;
    var FR = [
      {n: "Gaz (C₁–C₄)", a: 1, b: 4, col: "#b8d8f0", use: "butane/propane : bouteilles de gaz, chauffage"},
      {n: "Essences (C₅–C₁₀)", a: 5, b: 10, col: "#f6d9a8", use: "carburant des voitures à essence, solvants"},
      {n: "Kérosène (C₁₁–C₁₄)", a: 11, b: 14, col: "#d8f0b8", use: "carburant des avions"},
      {n: "Gazole (C₁₅–C₂₀)", a: 15, b: 20, col: "#f0b8b8", use: "diesel, mazout de chauffage"}
    ];
    var c = k.canvas(310);
    var T = k.slider("Température de chauffe", 0, 400, 5, 150, "°C");
    var ro = k.readouts(["Alcanes passés en vapeur", "Plus long alcane vaporisé", "Fraction en cours", "Usage"]);
    var nt = k.note("", "");
    var ax0 = null;
    c.pointer(function(type, p){ if ((type === "down" || type === "drag") && ax0){ T.set(Math.max(0, Math.min(400, Math.round(ax0.iy(p.y) / 5) * 5))); k.redraw(); } });
    k.draw(function(){
      var t = T.value; c.clear();
      var ax = S.draw.axes(c, {x0: 0.5, x1: 20.5, y0: -180, y1: 400, stepX: 100, stepY: 100, l: 50, t: 22, b: 32}); ax0 = ax;
      S.draw.text(c, "T d'ébullition des n-alcanes (°C)", 54, 10, {size: 12, align: "left", color: pal.grey});
      FR.forEach(function(f){ c.ctx.fillStyle = f.col; c.ctx.globalAlpha = 0.55; c.ctx.fillRect(ax.X(f.a - 0.5), ax.T, ax.X(f.b + 0.5) - ax.X(f.a - 0.5), ax.B - ax.T); c.ctx.globalAlpha = 1; });
      ax = S.draw.axes(c, {x0: 0.5, x1: 20.5, y0: -180, y1: 400, stepX: 100, stepY: 100, l: 50, t: 22, b: 32, grid: false});
      for (var tx = 2; tx <= 20; tx += 2) S.draw.text(c, String(tx), ax.X(tx), c.H - 20, {size: 12, color: pal.grey}); S.draw.text(c, "nombre de carbones n", c.W / 2, c.H - 6, {size: 12, color: pal.grey});
      FR.forEach(function(f){ S.draw.text(c, f.n.split(" ")[0], (ax.X(f.a - 0.5) + ax.X(f.b + 0.5)) / 2, ax.T + 10, {size: 12, color: pal.ink}); });
      S.draw.line(c, ax.L, ax.Y(t), ax.R, ax.Y(t), pal.red, 2.4); S.draw.text(c, t + " °C", ax.R - 2, ax.Y(t) - 10, {size: 13, color: pal.red, align: "right"});
      var maxN = 0, vap = 0;
      for (var q = 1; q <= 20; q++){ var gas = C5.BP[q] <= t; if (gas){ vap++; maxN = q; } S.draw.dot(c, ax.X(q), ax.Y(C5.BP[q]), gas ? 6 : 5, gas ? pal.red : "#8a95a3"); if (q > 1) S.draw.line(c, ax.X(q - 1), ax.Y(C5.BP[q - 1]), ax.X(q), ax.Y(C5.BP[q]), pal.light, 1.2); }
      var fr = null; FR.forEach(function(f){ if (maxN >= f.a && maxN <= f.b) fr = f; });
      ro.set(0, vap + " sur 20 (C₁ à C₂₀)"); ro.set(1, maxN ? C5.CHAIN[Math.min(maxN, 10)] && maxN <= 10 ? C5.CHAIN[maxN] + " (C" + maxN + ")" : "C" + maxN : "aucun"); ro.set(2, fr ? fr.n : (maxN === 0 ? "rien ne bout encore" : "—")); ro.set(3, fr ? fr.use : "—");
      nt.set(maxN === 20 ? "Au-dessus de 343 °C, tous les alcanes jusqu'à C₂₀ sont en vapeur : les résidus (plus de 20 C) restent en bas de la colonne." : maxN === 0 ? "En dessous de −162 °C même le méthane est liquide : chauffe !" : "À " + t + " °C, les alcanes jusqu'à C" + maxN + " sont gazeux ; les suivants restent liquides. En colonne, la vapeur monte, refroidit et se condense à différents étages.", "");
    });
  }
});
