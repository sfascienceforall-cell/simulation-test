/* Chapitre 6 · Solubilité et précipitation (Ks) */
(function(){
function bis(f, lo, hi){ var a = Math.log(lo), b = Math.log(hi), m, i; for (i = 0; i < 100; i++){ m = (a + b) / 2; if (f(Math.exp(m)) > 0) b = m; else a = m; } return Math.exp((a + b) / 2); }
/* sel M_x A_y : x cations (charge y), y anions ; Ks = [M]^x [A]^y ; valeurs arrondies, 25 °C */
var SEL = [
  {nom: "AgCl", cat: "Ag⁺", an: "Cl⁻", x: 1, y: 1, Ks: 1.8e-10, M: 143.5},
  {nom: "BaSO₄", cat: "Ba²⁺", an: "SO₄²⁻", x: 1, y: 1, Ks: 1.1e-10, M: 233},
  {nom: "PbI₂", cat: "Pb²⁺", an: "I⁻", x: 1, y: 2, Ks: 9.8e-9, M: 461},
  {nom: "CaF₂", cat: "Ca²⁺", an: "F⁻", x: 1, y: 2, Ks: 3.9e-11, M: 78},
  {nom: "Mg(OH)₂", cat: "Mg²⁺", an: "OH⁻", x: 1, y: 2, Ks: 5.6e-12, M: 58},
  {nom: "Ag₂CrO₄", cat: "Ag⁺", an: "CrO₄²⁻", x: 2, y: 1, Ks: 1.1e-12, M: 332}
];
function sol(s){ return Math.pow(s.Ks / (Math.pow(s.x, s.x) * Math.pow(s.y, s.y)), 1 / (s.x + s.y)); }
function pw(a, n){ return Math.pow(a, n); }
SFA.sim({
  id: "c6-c06-dissolution", ch: "c06", tag: "Classique",
  titre: "Dissolution d'un sel peu soluble : jusqu'à la saturation",
  resume: "Ajoute du sel dans 1 L d'eau : les ions s'accumulent jusqu'à la solubilité, puis le solide reste au fond.",
  but: "Choisis le sel et la quantité ajoutée (en multiples de la solubilité). Repère la saturation, puis compare les solubilités de tous les sels sur le diagramme.",
  aRetenir: "Équilibre de dissolution : M<sub>x</sub>A<sub>y</sub>(s) ⇌ x M + y A, avec K<sub>s</sub> = [M]<sup>x</sup>·[A]<sup>y</sup>. Tant que Q < K<sub>s</sub>, tout se dissout ; à saturation, Q = K<sub>s</sub>, et ajouter du solide ne change plus les concentrations. Solubilité s (mol/L) : pour AB, s = √K<sub>s</sub> ; pour AB₂, s = ∛(K<sub>s</sub>/4).",
  piege: "On ne peut comparer directement les K<sub>s</sub> que pour des sels de même formule (même x et y). AgCl (K<sub>s</sub> = 1,8·10⁻¹⁰) est moins soluble que Ag₂CrO₄ (K<sub>s</sub> = 1,1·10⁻¹²) alors que son K<sub>s</sub> est plus grand ! Valeurs de K<sub>s</sub> arrondies (elles varient légèrement selon les tables).",
  build: function(k, S){
    var c = k.canvas(480), P = S.draw.palette;
    var se = k.select("Sel", SEL.map(function(s, i){ return [i, s.nom + " (Ks = " + S.sci(s.Ks, 2).replace(/<[^>]+>/g, function(t){ return t === "<sup>" ? "^" : ""; }) + ")"]; }), 0);
    var ad = k.slider("Quantité ajoutée dans 1,00 L", 0, 5, 0.1, 0.5, "× solubilité");
    var ro = k.readouts(["Solubilité s", "Solide restant", "[cation] · [anion]", "Q / K<sub>s</sub>"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var s = SEL[se.value], s0 = sol(s), wide = c.W >= 520, ctx = c.ctx, i;
      var m = Math.min(ad.value, 1), res = Math.max(0, ad.value - 1);
      var cm = s.x * s0 * m, ca = s.y * s0 * m, Q = pw(cm, s.x) * pw(ca, s.y);
      var bx = 20, by = 30, bw = wide ? c.W * 0.46 : c.W - 40, bh = wide ? 300 : 190;
      ctx.fillStyle = "rgba(120,170,230,.18)"; ctx.fillRect(bx, by + 18, bw, bh - 18); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      var seed = 11; function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      var n = Math.round(m * 16);
      for (i = 0; i < n; i++){ var x = bx + 14 + rnd() * (bw - 28), y = by + 30 + rnd() * (bh - 80); S.draw.dot(c, x, y, 4.5, P.acc); S.draw.dot(c, x + 8, y + 5, s.y > 1 ? 3.5 : 4.5, P.red); if (s.y > 1) S.draw.dot(c, x - 7, y + 6, 3.5, P.red); }
      var g = Math.round(res * 7);
      for (i = 0; i < g; i++){ var gx = bx + 14 + (i % 14) * ((bw - 40) / 14), gy = by + bh - 14 - Math.floor(i / 14) * 12; ctx.fillStyle = "#e9ecef"; ctx.strokeStyle = P.grey; ctx.lineWidth = 1.2; ctx.fillRect(gx, gy - 4, 14, 10); ctx.strokeRect(gx, gy - 4, 14, 10); }
      S.draw.text(c, ad.value >= 1 ? "solution saturée" : "solution non saturée", bx + bw / 2, by + 8, {size: 13, color: ad.value >= 1 ? P.amber : P.green});
      S.draw.text(c, "● " + s.cat, bx + 6, by + bh + 16, {size: 12, color: P.acc, align: "left"}); S.draw.text(c, "● " + s.an, bx + 90, by + bh + 16, {size: 12, color: P.red, align: "left"});
      /* comparaison des solubilités (échelle log) */
      var cx = wide ? bx + bw + 40 : 20, cy = wide ? 60 : by + bh + 52, cw = wide ? c.W - cx - 20 : c.W - 40, rh = wide ? 34 : 28;
      S.draw.text(c, "Solubilités s (mol/L), échelle log", cx, cy - 22, {size: 12, color: P.grey, align: "left"});
      SEL.forEach(function(q, j){
        var sj = sol(q), frac = (Math.log10(sj) + 6) / 5, yy = cy + j * rh;
        ctx.fillStyle = j === +se.value ? P.green : "#c9d3de"; ctx.fillRect(cx + 70, yy, Math.max(2, Math.min(1, frac) * (cw - 150)), rh - 10);
        S.draw.text(c, q.nom, cx, yy + (rh - 10) / 2, {size: 12, align: "left", color: P.ink});
        S.draw.text(c, sj.toExponential(2).replace(".", ",").replace("e-", "e−"), cx + 70 + Math.max(2, Math.min(1, frac) * (cw - 150)) + 4, yy + (rh - 10) / 2, {size: 12, align: "left", color: P.grey});
      });
      ro.set(0, S.sci(s0, 2) + " mol/L (" + S.sci(s0 * s.M, 2) + " g/L)");
      ro.set(1, res > 0 ? S.sci(res * s0 * s.M * 1000, 2) + " mg" : "aucun");
      ro.set(2, S.sci(cm, 2) + " · " + S.sci(ca, 2) + " mol/L"); ro.set(3, S.fmt(Q / s.Ks, 2));
      nt.set(ad.value < 1 ? "Tout est dissous : Q < K<sub>s</sub>. Il reste de la place pour dissoudre davantage." : ad.value === 1 ? "Juste à saturation : Q = K<sub>s</sub>, plus rien ne se dissoudra de plus." : "Excès de solide : les concentrations restent celles de la saturation (Q = K<sub>s</sub>).", ad.value > 1 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "c6-c06-melange", ch: "c06", tag: "Graphes",
  titre: "Mélange de deux solutions : précipité ou pas ?",
  resume: "Mélange une solution de cation et une d'anion : compare le quotient Q au K<sub>s</sub>, sur un diagramme de pC.",
  but: "Choisis le sel, les concentrations (c = 10^−pc) et les volumes des deux solutions. Le point du mélange tombe dans la zone « précipité » ou « solution limpide » du diagramme.",
  aRetenir: "Après mélange (dilution !), Q = [M]ˣ·[A]ʸ. Si Q < K<sub>s</sub> : pas de précipité. Si Q > K<sub>s</sub> : précipité jusqu'à ce que le quotient redevienne égal à K<sub>s</sub>. Sur le diagramme pM–pA, la droite x·pM + y·pA = pK<sub>s</sub> sépare les deux zones.",
  piege: "Il faut calculer les concentrations après mélange, pas celles des solutions de départ : chaque solution est diluée par l'autre. Deux solutions qui précipiteraient chacune à 1 mol/L peuvent ne rien donner une fois mélangées et diluées.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var se = k.select("Sel formé", SEL.map(function(s, i){ return [i, s.nom + " (" + s.cat + " + " + s.an + ")"]; }), 0);
    var pm = k.slider("Solution de cation : pc", 1, 6, 0.1, 3, "");
    var pa = k.slider("Solution d'anion : pc", 1, 6, 0.1, 3, "");
    var v1 = k.slider("Volume de la solution de cation", 10, 100, 5, 50, "mL");
    var v2 = k.slider("Volume de la solution d'anion", 10, 100, 5, 50, "mL");
    var ro = k.readouts(["[cation] après mélange", "[anion] après mélange", "Q / K<sub>s</sub>", "Précipité"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var s = SEL[se.value], V = v1.value + v2.value, M0 = Math.pow(10, -pm.value) * v1.value / V, A0 = Math.pow(10, -pa.value) * v2.value / V;
      var pK = -Math.log10(s.Ks), pM = -Math.log10(M0), pA = -Math.log10(A0), Q = pw(M0, s.x) * pw(A0, s.y);
      var ax = S.draw.axes(c, {x0: 0, x1: 8, y0: 0, y1: 8, stepX: 1, stepY: 1, xl: "pM = −log[cation]", yl: "pA = −log[anion]"});
      var ctx = c.ctx;
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.fillStyle = "rgba(180,35,24,.12)";
      /* zone sous la droite x·pM + y·pA = pK */
      var xs = [0, 8], ys = xs.map(function(xx){ return (pK - s.x * xx) / s.y; });
      ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); ctx.lineTo(ax.X(0), ax.Y(ys[0])); ctx.lineTo(ax.X(8), ax.Y(ys[1])); ctx.lineTo(ax.X(8), ax.Y(0)); ctx.closePath(); ctx.fill();
      ctx.restore();
      S.draw.line(c, ax.X(0), ax.Y((pK - 0) / s.y), ax.X(8), ax.Y((pK - s.x * 8) / s.y), P.red, 2.4);
      S.draw.text(c, "précipité", ax.X(0.9), ax.Y(0.8), {size: 13, color: P.red}); S.draw.text(c, "solution limpide", ax.X(6.2), ax.Y(7.3), {size: 13, color: P.green});
      var inP = Q > s.Ks;
      S.draw.dot(c, ax.X(Math.min(8, pM)), ax.Y(Math.min(8, pA)), 7, inP ? P.red : P.green);
      ro.set(0, S.sci(M0, 2) + " mol/L"); ro.set(1, S.sci(A0, 2) + " mol/L"); ro.set(2, S.sci(Q / s.Ks, 2));
      if (!inP){ ro.set(3, "non"); nt.set("Q = " + S.sci(Q, 2) + " < K<sub>s</sub> = " + S.sci(s.Ks, 2) + " : aucun précipité, les ions restent dissous.", "ok"); }
      else {
        var mx = Math.min(M0 / s.x, A0 / s.y);
        var lo = 0, hi = mx, mid, i;
        for (i = 0; i < 200; i++){ mid = (lo + hi) / 2; if (pw(M0 - s.x * mid, s.x) * pw(A0 - s.y * mid, s.y) > s.Ks) lo = mid; else hi = mid; }
        var z = (lo + hi) / 2, mg = z * V / 1000 * s.M * 1000;
        ro.set(3, S.sci(mg, 2) + " mg de " + s.nom);
        nt.set("Q = " + S.sci(Q, 2) + " > K<sub>s</sub> = " + S.sci(s.Ks, 2) + " : " + s.nom + " précipite jusqu'à Q = K<sub>s</sub>. Après précipitation : [" + s.cat + "] = " + S.sci(M0 - s.x * z, 2) + " mol/L, [" + s.an + "] = " + S.sci(A0 - s.y * z, 2) + " mol/L.", "warn");
      }
    });
  }
});

var COM = [
  {sel: 0, nom: "AgCl + NaCl (ion Cl⁻)"}, {sel: 1, nom: "BaSO₄ + Na₂SO₄ (ion SO₄²⁻)"}, {sel: 2, nom: "PbI₂ + KI (ion I⁻)"}, {sel: 3, nom: "CaF₂ + NaF (ion F⁻)"}
];
SFA.sim({
  id: "c6-c06-ion-commun", ch: "c06", tag: "Graphes",
  titre: "L'effet d'ion commun : un sel moins soluble avec un ion en plus",
  resume: "Ajoute un ion que le sel possède déjà : la solubilité s'effondre.",
  but: "Choisis le sel et l'ion commun ajouté (concentration en échelle log). Lis la nouvelle solubilité et le facteur de réduction.",
  aRetenir: "Si on ajoute un des ions du sel, l'équilibre de dissolution se déplace vers le solide (Le Chatelier) : la solubilité diminue. Pour AgCl avec [Cl⁻] ajouté = c : s ≈ K<sub>s</sub> / c quand c ≫ s. À 0,10 mol/L de Cl⁻, s ≈ 1,8·10⁻⁹ mol/L, 7 000 fois moins qu'en eau pure.",
  piege: "K<sub>s</sub> ne change pas ; c'est la solubilité s qui change. Et l'effet n'est pas illimité : en réalité, dès quelques millimoles par litre de Cl⁻, une partie de l'argent reste dissoute sous forme de complexes (AgCl dissous, AgCl₂⁻), si bien que la vraie solubilité est plus grande que K<sub>s</sub>/c, et elle remonte nettement au-delà de 0,1 mol/L. Ce modèle simplifié (sans complexes, limité à 0,10 mol/L) ignore cet effet : il donne la tendance, pas la valeur exacte aux fortes concentrations.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var cs = k.select("Sel et ion commun", COM.map(function(t, i){ return [i, t.nom]; }), 0);
    var tg = k.toggle("Ajouter l'ion commun", true);
    var lc = k.slider("log de la concentration ajoutée", -6, -1, 0.1, -2, "");
    var ro = k.readouts(["Solubilité dans l'eau pure", "Solubilité avec l'ion commun", "Réduction"]);
    var nt = k.note("", "ok");
    function sAvec(s, cadd){ return bis(function(sv){ return pw(s.x * sv, s.x) * pw(s.y * sv + cadd, s.y) - s.Ks; }, 1e-25, 1); }
    k.draw(function(){
      c.clear();
      var s = SEL[COM[cs.value].sel], s0 = sol(s);
      var ax = S.draw.axes(c, {x0: -6.5, x1: -1, y0: -9, y1: -1, stepX: 1, stepY: 1, xl: "log c ajouté", yl: "log s"});
      S.draw.line(c, ax.L, ax.Y(Math.log10(s0)), ax.R, ax.Y(Math.log10(s0)), P.grey, 1.6, [6, 4]);
      S.draw.text(c, "eau pure", ax.R - 4, ax.Y(Math.log10(s0)) - 9, {size: 12, color: P.grey, align: "right"});
      S.draw.fn(c, ax, function(x){ return Math.log10(sAvec(s, Math.pow(10, x))); }, P.green, 3);
      var cadd = tg.value ? Math.pow(10, lc.value) : 0, sa = sAvec(s, cadd);
      S.draw.dot(c, ax.X(tg.value ? lc.value : -6.5), ax.Y(Math.log10(sa)), 6, P.red);
      ro.set(0, S.sci(s0, 2) + " mol/L"); ro.set(1, S.sci(sa, 2) + " mol/L"); ro.set(2, "÷ " + S.fmt(s0 / sa, s0 / sa > 100 ? 0 : 1));
      nt.set(tg.value ? "Avec " + S.sci(cadd, 2) + " mol/L de l'ion commun, la solubilité est divisée par " + S.fmt(s0 / sa, s0 / sa > 100 ? 0 : 1) + " (à K<sub>s</sub> inchangé)." : "Sans ion ajouté : solubilité de l'eau pure.", "ok");
    });
  }
});

var KS1 = 1.8e-10, KS2 = 1.1e-12;
SFA.sim({
  id: "c6-c06-selective", ch: "c06", tag: "Original",
  titre: "Précipitation sélective : le dosage de Mohr",
  resume: "On verse Ag⁺ dans un mélange de chlorure et de chromate : AgCl blanc d'abord, Ag₂CrO₄ rouge ensuite.",
  but: "Verse le nitrate d'argent (0,100 mol/L) dans 50,0 mL de Cl⁻ (0,0100 mol/L) et CrO₄²⁻ (0,00500 mol/L). Repère le volume où la couleur rouge apparaît.",
  aRetenir: "Quand plusieurs précipités sont possibles, celui qui exige le moins d'ions Ag⁺ se forme en premier : ici AgCl (il faut [Ag⁺] = K<sub>s</sub>/[Cl⁻] ≈ 2·10⁻⁸ mol/L), puis seulement Ag₂CrO₄ (il faut [Ag⁺] ≈ 1,5·10⁻⁵ mol/L). L'apparition du rouge signale que presque tous les chlorures ont précipité : c'est le principe du dosage de Mohr.",
  piege: "Ne conclus pas avec les K<sub>s</sub> seuls : AgCl a un K<sub>s</sub> plus grand que Ag₂CrO₄ (1,8·10⁻¹⁰ contre 1,1·10⁻¹²), et pourtant il précipite en premier. Ce qui compte, c'est la valeur de [Ag⁺] à atteindre pour chaque sel, qui dépend aussi des concentrations de départ et de la stœchiométrie.",
    build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette;
    var va = k.slider("Volume de AgNO₃ (0,100 mol/L) versé", 0, 12, 0.05, 2, "mL");
    var ro = k.readouts(["[Ag⁺]", "[Cl⁻]", "[CrO₄²⁻]", "Précipités"]);
    var nt = k.note("", "ok");
    var V0 = 50, nCl = 0.5, nCr = 0.25;   /* mmol */
    function etat(v){
      var V = V0 + v, nAg = 0.1 * v;
      if (nAg === 0) return {a: 0, cl: nCl / V, cr: nCr / V, n1: 0, n2: 0};
      var a = bis(function(a){ var n1 = Math.max(0, nCl - KS1 * V / a), n2 = Math.max(0, nCr - KS2 * V / (a * a)); return a * V + n1 + 2 * n2 - nAg; }, 1e-14, 1);
      var n1 = Math.max(0, nCl - KS1 * V / a), n2 = Math.max(0, nCr - KS2 * V / (a * a));
      return {a: a, cl: (nCl - n1) / V, cr: (nCr - n2) / V, n1: n1, n2: n2};
    }
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 12, y0: -10, y1: -1, stepX: 2, stepY: 1, xl: "V(AgNO₃) / mL", yl: "log [ ]", b: 100});
      var cols = {a: P.violet, cl: P.green, cr: P.amber};
      function curve(key, col){ S.draw.fn(c, ax, function(x){ var e = etat(x), v = e[key]; return v > 0 ? Math.log10(v) : NaN; }, col, 2.6); }
      curve("a", cols.a); curve("cl", cols.cl); curve("cr", cols.cr);
      S.draw.text(c, "Ag⁺", ax.X(0.9), ax.Y(-9.5), {size: 12, color: cols.a}); S.draw.text(c, "Cl⁻", ax.X(9), ax.Y(-3.5), {size: 12, color: cols.cl}); S.draw.text(c, "CrO₄²⁻", ax.X(9), ax.Y(-2.6), {size: 12, color: cols.cr});
      var e = etat(va.value);
      S.draw.line(c, ax.X(va.value), ax.T, ax.X(va.value), ax.B, P.ink, 1.4, [4, 3]);
      /* bandes de précipités */
      var ctx = c.ctx, x0 = ax.L, wb = ax.R - ax.L, y1 = c.H - 62, f1 = e.n1 / nCl, f2 = e.n2 / nCr;
      function bar(y, f, col, lab){ ctx.fillStyle = "#eef1f5"; ctx.fillRect(x0, y, wb, 18); ctx.fillStyle = col; ctx.fillRect(x0, y, wb * f, 18); ctx.strokeStyle = P.grey; ctx.lineWidth = 1; ctx.strokeRect(x0, y, wb, 18); S.draw.text(c, lab, x0 + 4, y + 9, {size: 12, align: "left", color: f > 0.6 ? "#fff" : P.ink}); }
      bar(y1, f1, "#8a95a3", "AgCl précipité : " + S.fmt(f1 * 100, 1) + " % des Cl⁻");
      bar(y1 + 24, f2, "#b5402a", "Ag₂CrO₄ précipité : " + S.fmt(f2 * 100, 1) + " % des CrO₄²⁻");
      ro.set(0, e.a ? S.sci(e.a, 2) + " mol/L" : "0"); ro.set(1, S.sci(e.cl, 2) + " mol/L"); ro.set(2, S.sci(e.cr, 2) + " mol/L");
      ro.set(3, e.n2 > 1e-9 ? "AgCl (blanc) + Ag₂CrO₄ (rouge)" : e.n1 > 1e-9 ? "AgCl (blanc) seul" : "aucun");
      if (e.n2 > 1e-9) nt.set("Le rouge apparaît : il ne reste que " + S.fmt(e.cl / (nCl / (V0 + va.value)) * 100, 2) + " % des Cl⁻ en solution. Fin du dosage de Mohr (équivalence : 5,0 mL).", "warn");
      else if (e.n1 > 1e-9) nt.set("Seul AgCl blanc précipite : [Ag⁺] reste très faible (≈ K<sub>s</sub>/[Cl⁻]).", "ok");
      else nt.set("Pas encore de précipité. Verse un peu d'argent.", "ok");
    });
  }
});
})();
