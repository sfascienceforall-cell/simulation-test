/* Chapitre 9 · Électrolyse et applications industrielles */
(function(){
var F = 96500, VM = 24;   /* F arrondie (C/mol) ; Vm ≈ 24 L/mol à 20 °C, 1 atm */
function bubbles(c, k, x0, x1, ytop, ybot, rate, col, t){
  var n = Math.round(rate), i;
  for (i = 0; i < n; i++){
    var ph = (t * (0.6 + (i % 5) * 0.12) + i * 0.37) % 1, x = x0 + (x1 - x0) * (((i * 7919) % 100) / 100), y = ybot - (ybot - ytop) * ph;
    c.ctx.beginPath(); c.ctx.arc(x + Math.sin(ph * 9 + i) * 3, y, 2.6, 0, 7); c.ctx.fillStyle = col; c.ctx.fill();
  }
}
SFA.sim({
  id: "c6-c09-eau", ch: "c09", tag: "Classique",
  titre: "L'électrolyse de l'eau : deux fois plus de H₂ que de O₂",
  resume: "Applique une tension, règle la durée : lis les volumes de gaz et vérifie le rapport 2 pour 1.",
  but: "Augmente la tension : il faut dépasser un seuil pour que le courant passe. Puis fais varier la durée. Compare le volume de H₂ à la cathode et celui de O₂ à l'anode.",
  aRetenir: "Électrolyse = réaction forcée par un générateur. Cathode (−) : 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻ (réduction). Anode (+) : 2 H₂O → O₂ + 4 H⁺ + 4 e⁻ (oxydation). Bilan : 2 H₂O → 2 H₂ + O₂. Faraday : n(e⁻) = I·t/F ; n(H₂) = n(e⁻)/2 ; n(O₂) = n(e⁻)/4, donc V(H₂) = 2 V(O₂).",
  piege: "Dans une électrolyse, l'anode est le pôle + (oxydation) et la cathode le pôle − (réduction) : l'inverse de la pile pour les signes, pas pour les réactions (oxydation à l'anode, toujours). L'eau pure conduit mal : on ajoute un peu de H₂SO₄ ou de Na₂SO₄. Seuil pratique 1,8 V (1,23 V théorique, plus la surtension). Modèle simplifié : cellule de 2 Ω, V<sub>m</sub> = 24 L/mol.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette, tt = 0;
    var U = k.slider("Tension appliquée", 0, 6, 0.1, 3, "V");
    var T = k.slider("Durée", 0, 300, 10, 120, "s");
    var ro = k.readouts(["Intensité I", "n(e⁻) échangés", "V(H₂) cathode", "V(O₂) anode"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){ tt += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear();
      var I = U.value > 1.8 ? (U.value - 1.8) / 2.0 : 0, ne = I * T.value / F, vh = ne / 2 * VM * 1000, vo = ne / 4 * VM * 1000, ctx = c.ctx;
      var cx = c.W / 2, tw = 70, th = 190, ty = 50, gap = Math.min(110, c.W * 0.22);
      var capacity = 100;
      function tube(x, label, v, col, sign){
        ctx.fillStyle = "rgba(120,170,230,.22)"; ctx.fillRect(x - tw / 2, ty, tw, th + 40);
        var gh = Math.min(th, v / capacity * th); ctx.fillStyle = col; ctx.globalAlpha = .35; ctx.fillRect(x - tw / 2, ty, tw, gh); ctx.globalAlpha = 1;
        ctx.strokeStyle = P.ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x - tw / 2, ty); ctx.lineTo(x - tw / 2, ty + th + 40); ctx.lineTo(x + tw / 2, ty + th + 40); ctx.lineTo(x + tw / 2, ty); ctx.stroke();
        ctx.fillStyle = "#6b7684"; ctx.fillRect(x - 3, ty + th - 40, 6, 80);
        for (var m = 0; m <= 100; m += 25){ var yy = ty + m / capacity * th; S.draw.line(c, x + tw / 2, yy, x + tw / 2 + 6, yy, P.grey, 1.2); }
        S.draw.text(c, label + " (" + sign + ")", x, ty - 18, {size: 13, color: P.ink});
        S.draw.text(c, S.fmt(v, 1) + " mL", x, ty + th + 58, {size: 13, color: P.ink});
        if (I > 0) bubbles(c, k, x - 20, x + 20, ty + th - 40 * 0 - 120, ty + th + 36, Math.min(14, 2 + I * 8) * (label === "H₂" ? 1 : 0.5), "rgba(40,60,90,.75)", tt);
      }
      tube(cx - gap, "H₂", vh, P.acc, "cathode −"); tube(cx + gap, "O₂", vo, P.red, "anode +");
      S.draw.text(c, "échelle des tubes : 0 à 100 mL", c.W / 2, c.H - 10, {size: 12, color: P.grey});
      ro.set(0, S.fmt(I, 2) + " A"); ro.set(1, S.sci(ne, 3) + " mol"); ro.set(2, S.fmt(vh, 1) + " mL"); ro.set(3, S.fmt(vo, 1) + " mL");
      nt.set(U.value <= 1.8 ? "Tension insuffisante (≤ 1,8 V) : l'électrolyse ne démarre pas, I = 0." : vo > 0 ? "Rapport V(H₂)/V(O₂) = " + S.fmt(vh / vo, 1) + " : on retrouve 2 pour 1 (2 H₂ pour 1 O₂)." + (vh > capacity ? " Le tube de H₂ déborde (au-delà de 100 mL)." : "") : "Règle la durée pour voir apparaître les gaz.", U.value <= 1.8 || vh > capacity ? "warn" : "ok");
    });
  }
});

var MET = [
  {s: "Cu", ion: "Cu²⁺", z: 2, M: 63.5, rho: 8.96, nom: "cuivre"},
  {s: "Ag", ion: "Ag⁺", z: 1, M: 108, rho: 10.5, nom: "argent"},
  {s: "Ni", ion: "Ni²⁺", z: 2, M: 59, rho: 8.9, nom: "nickel"},
  {s: "Zn", ion: "Zn²⁺", z: 2, M: 65, rho: 7.1, nom: "zinc"},
  {s: "Au", ion: "Au⁺ (complexe cyanuré)", z: 1, M: 197, rho: 19.3, nom: "or"}
];
SFA.sim({
  id: "c6-c09-faraday", ch: "c09", tag: "Dans la vraie vie",
  titre: "Cuivrage et loi de Faraday : quelle épaisseur déposer ?",
  resume: "Intensité, durée, métal, surface : calcule la masse déposée et l'épaisseur de la couche.",
  but: "Choisis le métal, règle l'intensité, la durée, la surface à recouvrir et le rendement. Défi : dépose environ 20 µm de métal.",
  aRetenir: "Loi de Faraday : n(e⁻) = I·t/F et n(métal) = n(e⁻)/z, donc m = M·I·t/(z·F) (× rendement). L'épaisseur vaut h = m/(ρ·S). Le dépôt est proportionnel à l'intensité et à la durée ; à charge égale, un métal à petite masse molaire et à z élevé donne moins de masse.",
  piege: "Pour un même courant et une même durée, la masse déposée dépend de M et de z : l'argent (z = 1, M = 108) dépose 3,4 fois plus de masse que le cuivre (z = 2, M = 63,5) à charge égale. Le rendement n'est jamais tout à fait 100 % : une partie des électrons sert à d'autres réactions (dégagement de H₂, impuretés). Valeurs arrondies (F = 96 500 C/mol, ρ en g/cm³).",
  build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette;
    var me = k.select("Métal déposé", MET.map(function(m, i){ return [i, m.nom + " (" + m.ion.split(" ")[0] + ")"]; }), 0);
    var I = k.slider("Intensité", 0.1, 5, 0.1, 1, "A");
    var T = k.slider("Durée", 1, 120, 1, 30, "min");
    var Sf = k.slider("Surface de l'objet", 10, 200, 5, 50, "cm²");
    var eta = k.slider("Rendement faradique", 50, 100, 5, 100, "%");
    var ro = k.readouts(["Charge Q", "m déposée", "Épaisseur", "Temps pour 20 µm"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var m = MET[me.value], Q = I.value * T.value * 60, mass = eta.value / 100 * m.M * Q / (m.z * F), h = mass / (m.rho * Sf.value) * 1e4, tw = 20e-4 * m.rho * Sf.value * m.z * F / (m.M * I.value * eta.value / 100) / 60;
      var ax = S.draw.axes(c, {x0: 0, x1: 120, y0: 0, y1: Math.max(10, h * 1.4, 22), stepX: 20, xl: "durée / min", yl: "épaisseur / µm"});
      S.draw.fn(c, ax, function(x){ return eta.value / 100 * m.M * I.value * x * 60 / (m.z * F) / (m.rho * Sf.value) * 1e4; }, P.green, 3);
      S.draw.line(c, ax.L, ax.Y(20), ax.R, ax.Y(20), P.amber, 1.5, [5, 4]); S.draw.text(c, "objectif 20 µm", ax.R - 6, ax.Y(20) + 12, {size: 12, color: P.amber, align: "right"});
      S.draw.dot(c, ax.X(T.value), ax.Y(h), 6, P.red);
      ro.set(0, S.fmt(Q, 0) + " C"); ro.set(1, S.fmt(mass, mass < 1 ? 3 : 2) + " g"); ro.set(2, S.fmt(h, 1) + " µm"); ro.set(3, S.fmt(tw, 0) + " min");
      nt.set(Math.abs(h - 20) <= 1 ? "Objectif atteint : " + S.fmt(h, 1) + " µm de " + m.nom + " (m = " + S.fmt(mass, 2) + " g)." : "Épaisseur actuelle : " + S.fmt(h, 1) + " µm. Ajuste l'intensité, la durée ou la surface pour viser 20 µm (± 1 µm).", Math.abs(h - 20) <= 1 ? "ok" : "warn");
    });
  }
});

var ELE = [
  {nom: "NaCl fondu (≈ 800 °C)", cat: "Na⁺ + e⁻ → Na (liquide)", an: "2 Cl⁻ → Cl₂ + 2 e⁻", cp: {n: "Na", z: 1, M: 23, type: "l", col: "#c9ced4"}, ap: {n: "Cl₂", z: 2, M: 71, type: "g", col: "rgba(170,200,60,.8)"}, bil: "2 NaCl → 2 Na + Cl₂", obs: "Sodium liquide à la cathode, dichlore jaune-vert à l'anode. Le sodium ne peut pas être obtenu en solution aqueuse : il réagirait violemment avec l'eau."},
  {nom: "NaCl en solution aqueuse concentrée", cat: "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻", an: "2 Cl⁻ → Cl₂ + 2 e⁻", cp: {n: "H₂", z: 2, M: 2, type: "g", col: "rgba(40,60,90,.75)"}, ap: {n: "Cl₂", z: 2, M: 71, type: "g", col: "rgba(170,200,60,.8)"}, bil: "2 Cl⁻ + 2 H₂O → Cl₂ + H₂ + 2 OH⁻", obs: "H₂ à la cathode, Cl₂ à l'anode. Il se forme des ions OH⁻ : la phénolphtaléine devient rose près de la cathode (soude). C'est le procédé chlore-soude industriel."},
  {nom: "CuCl₂ en solution aqueuse", cat: "Cu²⁺ + 2 e⁻ → Cu (solide)", an: "2 Cl⁻ → Cl₂ + 2 e⁻", cp: {n: "Cu", z: 2, M: 63.5, type: "s", col: "#c46a3c"}, ap: {n: "Cl₂", z: 2, M: 71, type: "g", col: "rgba(170,200,60,.8)"}, bil: "Cu²⁺ + 2 Cl⁻ → Cu + Cl₂", obs: "Dépôt rouge-orangé de cuivre à la cathode, dichlore à l'anode. Le cuivre est plus facile à réduire que l'eau."},
  {nom: "KI en solution aqueuse", cat: "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻", an: "2 I⁻ → I₂ + 2 e⁻", cp: {n: "H₂", z: 2, M: 2, type: "g", col: "rgba(40,60,90,.75)"}, ap: {n: "I₂", z: 2, M: 254, type: "s", col: "#7a4a1a"}, bil: "2 I⁻ + 2 H₂O → I₂ + H₂ + 2 OH⁻", obs: "H₂ à la cathode (milieu basique, phénolphtaléine rose), diiode brun à l'anode (bleu-noir avec de l'empois d'amidon)."},
  {nom: "H₂SO₄ dilué", cat: "2 H⁺ + 2 e⁻ → H₂", an: "2 H₂O → O₂ + 4 H⁺ + 4 e⁻", cp: {n: "H₂", z: 2, M: 2, type: "g", col: "rgba(40,60,90,.75)"}, ap: {n: "O₂", z: 4, M: 32, type: "g", col: "rgba(180,35,24,.6)"}, bil: "2 H₂O → 2 H₂ + O₂", obs: "H₂ à la cathode, O₂ à l'anode : c'est l'électrolyse de l'eau, rendue possible par les ions de l'acide."},
  {nom: "Na₂SO₄ en solution aqueuse", cat: "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻", an: "2 H₂O → O₂ + 4 H⁺ + 4 e⁻", cp: {n: "H₂", z: 2, M: 2, type: "g", col: "rgba(40,60,90,.75)"}, ap: {n: "O₂", z: 4, M: 32, type: "g", col: "rgba(180,35,24,.6)"}, bil: "2 H₂O → 2 H₂ + O₂", obs: "H₂ à la cathode et O₂ à l'anode : Na⁺ et SO₄²⁻ ne réagissent pas (ions spectateurs). Avec du bleu de bromothymol : bleu (basique) à la cathode, jaune (acide) à l'anode."}
];
SFA.sim({
  id: "c6-c09-electrolytes", ch: "c09", tag: "Classique",
  titre: "Quels produits à la cathode et à l'anode ?",
  resume: "NaCl fondu, NaCl en solution, CuCl₂, KI… : choisis l'électrolyte et lis les produits et les quantités formées.",
  but: "Choisis l'électrolyte, puis règle l'intensité et la durée. Les ions migrent vers les électrodes ; les bulles et dépôts montrent les produits ; les quantités viennent de la loi de Faraday.",
  aRetenir: "La cathode (−) réduit l'espèce la plus facile à réduire, l'anode (+) oxyde l'espèce la plus facile à oxyder. En solution aqueuse, l'eau peut aussi réagir : Na⁺ et K⁺ ne sont jamais réduits, l'eau l'est à leur place (H₂ + OH⁻). Dans le sel fondu, il n'y a pas d'eau : Na⁺ est réduit en sodium.",
  piege: "NaCl fondu et NaCl en solution ne donnent pas les mêmes produits à la cathode : Na liquide dans le fondu, H₂ dans l'eau. Ne confonds pas non plus avec une pile : ici le générateur impose la réaction. Vm ≈ 24 L/mol (20 °C) ; masses molaires arrondies.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, H = window.C6, tt = 0;
    var el = k.select("Électrolyte", ELE.map(function(e, i){ return [i, e.nom]; }), 1);
    var I = k.slider("Intensité", 0.1, 2, 0.1, 1, "A");
    var T = k.slider("Durée", 0, 600, 10, 300, "s");
    var ro = k.readouts(["Cathode (−)", "Anode (+)", "Bilan"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    var CAT = ["Na⁺", "Na⁺", "Cu²⁺", "K⁺", "H⁺", "Na⁺"], ANI = ["Cl⁻", "Cl⁻", "Cl⁻", "I⁻", "SO₄²⁻", "SO₄²⁻"], LIQ = [[240, 160, 70], [214, 232, 246], [120, 200, 190], [225, 235, 245], [220, 235, 246], [220, 235, 246]];
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var ei = +el.value, e = ELE[ei], ctx = c.ctx, ne = I.value * T.value / F, i;
      var bx = 24, bw = c.W - 48, by = 96, bh = 232, lvl = 0.78, top = by + bh - (bh - 6) * lvl, xc = bx + bw * 0.27, xa = bx + bw * 0.73;
      /* générateur */
      S.draw.panel(c, c.W / 2 - 62, 8, 124, 40, {shadow: true});
      S.draw.text(c, "−", c.W / 2 - 46, 28, {size: 22, color: P.acc, weight: 800}); S.draw.text(c, "+", c.W / 2 + 46, 28, {size: 22, color: P.red, weight: 800});
      S.draw.text(c, "générateur", c.W / 2, 22, {size: 11, color: P.grey}); S.draw.text(c, S.fmt(I.value, 1) + " A", c.W / 2, 37, {size: 12, color: P.ink, weight: 800});
      S.draw.line(c, c.W / 2 - 62, 28, xc, 28, "#2c3a4e", 2.4); S.draw.line(c, xc, 28, xc, by - 20, "#2c3a4e", 2.4); S.draw.line(c, c.W / 2 + 62, 28, xa, 28, "#2c3a4e", 2.4); S.draw.line(c, xa, 28, xa, by - 20, "#2c3a4e", 2.4);
      for (i = 0; i < 4; i++){ var u = (tt * 0.5 + i / 4) % 1; S.draw.dot(c, xc + (c.W / 2 - 62 - xc) * (1 - u), 28, 2.6, "#f4c542"); }
      H.glass(c, "beaker", bx, by, bw, bh, {level: lvl, color: LIQ[ei], alpha: ei === 0 ? 0.55 : 0.5, shine: true});
      /* électrodes de graphite */
      [xc, xa].forEach(function(x){ var g = ctx.createLinearGradient(x - 8, 0, x + 8, 0); g.addColorStop(0, "#2c3440"); g.addColorStop(0.5, "#5b6676"); g.addColorStop(1, "#2c3440"); ctx.fillStyle = g; S.draw.rrect(c, x - 8, by - 24, 16, bh - 52, 3); ctx.fill(); });
      /* ions qui migrent */
      var nIon = 9;
      for (i = 0; i < nIon; i++){
        var u1 = (tt * 0.14 + i / nIon) % 1, yy = top + 16 + H.rnd(i, 3) * (by + bh - top - 40);
        var xcat = bx + 12 + (xc - 14 - bx - 12) * 0 + (xc + 4 - (bx + 16)) * 0; var xs = xc + 12 + (xa - xc - 24) * (1 - u1), xs2 = xc + 12 + (xa - xc - 24) * u1;
        /* cations : de l'anode vers la cathode ; anions : de la cathode vers l'anode */
        H.ball(c, xs, yy, 7.5, P.blue, "", {}); S.draw.text(c, "+", xs, yy, {size: 11, color: "#fff", weight: 800});
        var yy2 = top + 16 + H.rnd(i + 20, 3) * (by + bh - top - 40);
        H.ball(c, xs2, yy2, 7.5, P.red, "", {}); S.draw.text(c, "−", xs2, yy2, {size: 11, color: "#fff", weight: 800});
      }
      S.draw.label(c, CAT[ei] + " → cathode", xc + 14, top + 12, {color: P.blue, size: 10.5, align: "left"}); S.draw.label(c, ANI[ei] + " → anode", xa - 14, top + 32, {color: P.red, size: 10.5, align: "right"});
      var rate = Math.min(14, 2 + I.value * 6);
      if (e.cp.type === "g") bubbles(c, k, xc - 22, xc + 22, top + 30, by + bh - 40, rate * (e.cp.z === 2 ? 1 : 0.6), e.cp.col, tt);
      else if (T.value > 0){ var th = Math.min(11, 2 + ne * 700); ctx.fillStyle = e.cp.col; ctx.fillRect(xc - 8 - th, by + 30, th, bh - 100); ctx.fillRect(xc + 8, by + 30, th, bh - 100); }
      if (e.ap.type === "g") bubbles(c, k, xa - 22, xa + 22, top + 30, by + bh - 40, rate * (e.ap.z === 4 ? 0.5 : 1), e.ap.col, tt);
      else if (T.value > 0){ S.draw.glow(c, xa, by + bh - 70, 56, "#7a4a1a", Math.min(0.7, 0.2 + ne * 200)); }
      S.draw.text(c, "cathode (−)", xc, by + bh + 16, {size: 13, color: P.acc, weight: 800}); S.draw.text(c, "anode (+)", xa, by + bh + 16, {size: 13, color: P.red, weight: 800});
      S.draw.text(c, e.cat, xc, by + bh + 38, {size: 12.5, color: P.acc, math: true}); S.draw.text(c, e.an, xa, by + bh + 38, {size: 12.5, color: P.red, math: true});
      function qty(p){ var n = ne / p.z; return p.type === "g" ? S.fmt(n * VM * 1000, 1) + " mL de " + p.n : S.fmt(n * p.M, 3) + " g de " + p.n; }
      ro.set(0, qty(e.cp)); ro.set(1, qty(e.ap)); ro.set(2, e.bil);
      nt.set(e.obs, "ok");
    });
  }
});

var ANO = [
  {s: "Zn", z: 2, M: 65, eta: 0.9, E: -0.76, nom: "zinc"},
  {s: "Al", z: 3, M: 27, eta: 0.85, E: -1.66, nom: "aluminium (alliage)"},
  {s: "Mg", z: 2, M: 24, eta: 0.5, E: -2.37, nom: "magnésium"}
];
SFA.sim({
  id: "c6-c09-anode", ch: "c09", tag: "Original",
  titre: "Anode sacrificielle : combien de temps protège-t-elle une coque ?",
  resume: "Un bloc de métal moins noble que le fer se consomme à la place de la coque : calcule sa durée de vie.",
  but: "Choisis le métal et la masse du bloc, règle le courant de protection, puis fais passer les années (curseur ou bouton « Animer ») : quand le bloc est épuisé, la coque n'est plus protégée et rouille.",
  aRetenir: "Le métal sacrificiel (E° plus bas que le fer) s'oxyde : M → Mⁿ⁺ + n e⁻, et fournit les électrons qui empêchent le fer de s'oxyder (protection cathodique). Durée de protection : t = η·m·z·F/(M·I). À courant égal, c'est la capacité par gramme (z/M) qui compte : Al > Mg > Zn en théorie.",
  piege: "La capacité théorique n'est pas la capacité réelle : une partie du métal sacrificiel se corrode sans fournir de courant utile. Rendements typiques (ordres de grandeur, selon l'alliage) : Zn ≈ 90 %, Al ≈ 85 %, Mg ≈ 50 %. Un métal plus noble que le fer (cuivre) aggraverait la corrosion au lieu de la freiner.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, H = window.C6, tt = 0, go = false;
    var me = k.seg("Métal du bloc", ANO.map(function(a, i){ return [i, a.s]; }), "0");
    var ms = k.slider("Masse du bloc", 1, 50, 1, 20, "kg");
    var I = k.slider("Courant de protection moyen", 0.1, 5, 0.1, 1, "A");
    var re = k.toggle("Rendements réalistes (sinon 100 %)", true);
    var an = k.slider("Temps écoulé", 0, 10, 0.1, 1, "ans");
    var lp = k.loop(function(dt, t){ tt = t; if (go){ var v = an.value + dt * 0.9; if (v >= 10){ v = 10; go = false; } an.set(v); } k.redraw(); }); lp.play();
    k.button("▶ Faire passer les années", function(){ an.set(0); go = true; }, true);
    var ro = k.readouts(["Durée de protection", "Bloc restant", "Coque"]);
    var nt = k.note("", "ok");
    function dur(a){ return (re.value ? a.eta : 1) * ms.value * 1000 / a.M * a.z * F / I.value / (365.25 * 86400); }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#f4f9fd", bottom: "#eef2f7"});
      var a = ANO[me.value], d = dur(a), ctx = c.ctx, rem = Math.max(0, 1 - an.value / d), i;
      /* scène : coque + eau + bloc */
      var wy = 62, sh = 200, rustT = rem > 0 ? 0 : Math.min(1, (an.value - d) / 2.5 + 0.15);
      ctx.save(); S.draw.rrect(c, 10, 8, c.W - 20, sh - 8, 12); ctx.clip();
      var gw = ctx.createLinearGradient(0, wy, 0, sh); gw.addColorStop(0, "#9fd0f2"); gw.addColorStop(1, "#4f95cf"); ctx.fillStyle = gw; ctx.fillRect(10, wy, c.W - 20, sh);
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); for (i = 0; i <= 40; i++){ var wx = 10 + (c.W - 20) * i / 40, wyy = wy + 3 + Math.sin(i * 0.9 + tt * 2) * 2.4; i ? ctx.lineTo(wx, wyy) : ctx.moveTo(wx, wyy); } ctx.stroke();
      /* coque : plaque d'acier (devient rouille) */
      var hullG = ctx.createLinearGradient(0, 14, 0, wy); hullG.addColorStop(0, rustT > 0 ? "#b0643a" : "#8e9aab"); hullG.addColorStop(1, rustT > 0 ? "#80401f" : "#5f6c7e");
      ctx.fillStyle = "#6b7684"; ctx.fillRect(10, 14, c.W - 20, wy - 14); ctx.fillStyle = hullG; ctx.fillRect(10, 14, c.W - 20, wy - 14);
      if (rustT > 0){ ctx.fillStyle = "rgba(150,64,18," + (0.35 + 0.5 * rustT).toFixed(2) + ")"; for (i = 0; i < 26; i++){ ctx.beginPath(); ctx.arc(14 + H.rnd(i, 1) * (c.W - 28), 16 + H.rnd(i, 2) * (wy - 20), 4 + H.rnd(i, 3) * 10 * rustT, 0, 7); ctx.fill(); } }
      for (i = 0; i < 12; i++) S.draw.dot(c, 24 + i * (c.W - 48) / 11, 22, 2.2, "rgba(255,255,255,.35)");
      S.draw.text(c, "coque en acier", 20, 36, {size: 12, color: "#fff", align: "left", weight: 800});
      /* ions du métal sacrificiel qui partent dans l'eau */
      var bxm = c.W / 2, bw = 30 + 70 * Math.sqrt(rem), bh = 8 + 48 * Math.sqrt(rem);
      if (rem > 0){
        for (i = 0; i < 8; i++){ var u = (tt * 0.3 + i / 8) % 1, ix = bxm + (H.rnd(i, 5) - 0.5) * (bw + 120) * u, iy = wy + bh + 10 + u * 70; S.draw.dot(c, ix, iy, 3.4, "rgba(255,255,255," + (0.9 - u * 0.8).toFixed(2) + ")"); }
        var ag = ctx.createLinearGradient(0, wy, 0, wy + bh); ag.addColorStop(0, "#dfe4ea"); ag.addColorStop(1, "#8793a3");
        ctx.beginPath(); ctx.moveTo(bxm - bw / 2, wy); ctx.lineTo(bxm + bw / 2, wy); ctx.lineTo(bxm + bw / 2 - 8, wy + bh); ctx.lineTo(bxm - bw / 2 + 8, wy + bh); ctx.closePath(); ctx.fillStyle = ag; ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.lineWidth = 1.6; ctx.stroke();
        S.draw.text(c, a.s, bxm, wy + bh / 2 + 1, {size: Math.max(11, 9 + bh / 4), color: P.ink, weight: 800});
        for (i = 0; i < 4; i++){ var v = (tt * 0.8 + i / 4) % 1; S.draw.dot(c, bxm - 70 * (v < .5 ? v * 2 : 0) - 0, 0, 0, "#fff"); }
        for (i = 0; i < 5; i++){ var e = (tt * 0.6 + i / 5) % 1; S.draw.dot(c, bxm + (e - 0.5) * (c.W * 0.62), wy - 12, 3, "#f4c542"); }
        S.draw.label(c, "e⁻ vers la coque", c.W - 24, wy - 12, {color: P.amber, size: 10.5, align: "right"});
      }
      ctx.restore();
      S.draw.text(c, rem > 0 ? "coque protégée" : "bloc épuisé : le fer s'oxyde", c.W / 2, sh - 10, {size: 12, color: rem > 0 ? "#0f3f63" : "#fff", weight: 800, bg: rem > 0 ? "rgba(255,255,255,.55)" : "rgba(192,50,29,.85)"});
      /* graphe de décharge */
      var ax = S.draw.axes(c, {x0: 0, x1: 10, y0: 0, y1: 100, stepX: 1, stepY: 20, xl: "ans", yl: "bloc restant (%)", t: sh + 18, b: 34});
      var cl = [P.violet, P.acc, P.amber];
      ANO.forEach(function(q, j){ var dd = dur(q); S.draw.fn(c, ax, function(x){ return Math.max(0, 100 * (1 - x / dd)); }, cl[j], j === +me.value ? 3.6 : 1.6); });
      S.draw.legend(c, ANO.map(function(q, j){ return [cl[j], q.s + " : " + S.fmt(dur(q), 1) + " ans"]; }), ax.R - 6, ax.T + 4, {align: "right"});
      S.draw.dot(c, ax.X(an.value), ax.Y(rem * 100), 6.5, P.red);
      ro.set(0, S.fmt(d, 1) + " ans"); ro.set(1, S.fmt(rem * 100, 0) + " %"); ro.set(2, rem > 0 ? "protégée" : "non protégée : corrosion du fer");
      nt.set(rem > 0 ? "Le bloc se consomme (" + a.s + " → " + a.s + (a.z > 1 ? "<sup>" + a.z + "+</sup>" : "<sup>+</sup>") + " + " + a.z + " e⁻) et protège la coque." : "Bloc épuisé après " + S.fmt(d, 1) + " ans : il faut le remplacer avant, sinon le fer s'oxyde.", rem > 0 ? "ok" : "warn");
    });
  }
});
})();
