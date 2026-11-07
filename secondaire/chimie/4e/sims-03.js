/* Chimie 4e · chapitre 3 · Masse molaire et calculs de masse */
SFA.sim({
  id:"c4-c03-calculateur", ch:"c03", tag:"Classique",
  titre:"Le calculateur de masse molaire",
  resume:"Écris une formule (même avec parenthèses ou hydrate) : la masse molaire et la composition s'affichent atome par atome.",
  but:"Choisis un exemple ou tape ta formule (Ca(OH)2, Al2(SO4)3, CuSO4.5H2O…), puis règle une masse pour trouver n.",
  aRetenir:"M = somme des masses de tous les atomes de la formule. Un indice multiplie l'atome ; un indice après une parenthèse multiplie tout le groupe. Puis n = m / M.",
  piege:"Dans Ca(OH)₂ il y a 2 O et 2 H : l'indice 2 s'applique au groupe entier. Dans un hydrate, le point « · » ajoute la masse de l'eau : CuSO₄·5H₂O.",
  build:function(k, S){
    var c = k.canvas(280);
    var ex = k.select("Exemples", [["Ca(OH)2","Ca(OH)₂ — hydroxyde de calcium"],["Al2(SO4)3","Al₂(SO₄)₃ — sulfate d'aluminium"],["C6H12O6","C₆H₁₂O₆ — glucose"],["CuSO4.5H2O","CuSO₄·5H₂O — sulfate de cuivre hydraté"],["(NH4)2SO4","(NH₄)₂SO₄ — sulfate d'ammonium"],["NaHCO3","NaHCO₃ — bicarbonate de sodium"],["Ca3(PO4)2","Ca₃(PO₄)₂ — phosphate de calcium"]], "Ca(OH)2", function(v){ f.set(v); });
    var f = k.input("Formule", "Ca(OH)2");
    var m = k.slider("Masse de l'échantillon", 0, 200, 1, 37, "g");
    var ro = k.readouts(["Masse molaire M", "n = m / M", "N molécules"]);
    var nt = k.note("", "");
    k.draw(function(){
      var cmp = C4.parse(f.value); c.clear(); C4.bg(c);
      if (!cmp){ nt.set("Formule non reconnue. Respecte les majuscules (Ca, pas CA) et utilise des parenthèses ( ). Éléments connus : H, C, N, O, Na, Mg, Al, S, Cl, K, Ca, Fe, Cu, Zn, Ag, Ba, Pb, P, F, Br, I, Li, Mn, Cr, Au.", "warn"); ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); return; }
      var els = Object.keys(cmp), Mt = C4.M(f.value);
      var y = 28; C4.label(c, C4.uni(f.value.replace(/\./g, "·")), c.W / 2, 22, "#0f1b2d", 20);
      var x0 = 20, wbar = c.W - 40, acc = 0, cols = ["#1f4b9e", "#c0321d", "#24775a", "#c26a0c", "#6236c4", "#0e7f96", "#8a95a3", "#c8a600"];
      els.forEach(function(e, i){
        var mm = cmp[e] * C4.MM[e], fr = mm / Mt;
        c.ctx.fillStyle = cols[i % cols.length]; c.ctx.fillRect(x0 + acc * wbar, 44, fr * wbar - 1, 26); acc += fr;
        var ty = 96 + i * 22;
        c.ctx.fillStyle = cols[i % cols.length]; c.ctx.fillRect(x0, ty - 7, 14, 14);
        C4.label(c, e + " : " + cmp[e] + " × " + S.fmt(C4.MM[e], 1) + " = " + S.fmt(mm, 1) + " g/mol  (" + S.fmt(100 * fr, 1) + " %)", x0 + 22, ty, "#2c3a4e", 13, "left");
      });
      C4.label(c, "M = " + S.fmt(Mt, 1) + " g/mol", c.W / 2, Math.min(c.H - 14, 100 + els.length * 22 + 12), "#1f4b9e", 16);
      var n = m.value / Mt;
      ro.set(0, S.fmt(Mt, 1) + " g/mol"); ro.set(1, S.fmt(n, 3) + " mol"); ro.set(2, S.sci(n * 6.02e23, 2));
      nt.set("Masses atomiques arrondies (H 1 ; C 12 ; N 14 ; O 16 ; Na 23 ; S 32 ; Cl 35,5 ; Ca 40 ; Cu 63,5…). Barre : part de chaque élément dans la masse.", "");
    });
  }
});

SFA.sim({
  id:"c4-c03-balance", ch:"c03", tag:"Graphe",
  titre:"La balance et la droite m = n·M",
  resume:"Pèse une substance : la masse est proportionnelle à la quantité de matière, la pente de la droite est M.",
  but:"Choisis deux substances, règle la masse ou la quantité et compare les deux droites m en fonction de n.",
  aRetenir:"n = m / M et m = n · M. Sur le graphique m(n), la pente est la masse molaire : plus M est grand, plus la droite est raide.",
  piege:"Ne confonds pas g (masse), mol (quantité) et g/mol (masse molaire). Si tu obtiens des « g/mol » au lieu de « mol », tu as multiplié au lieu de diviser.",
  build:function(k, S){
    var c = k.canvas(300);
    var L = [["H2O","eau H₂O"],["NaCl","sel NaCl"],["CO2","dioxyde de carbone CO₂"],["CaCO3","calcaire CaCO₃"],["C6H12O6","glucose C₆H₁₂O₆"],["H2SO4","acide sulfurique H₂SO₄"],["Fe2O3","oxyde de fer Fe₂O₃"],["Fe","fer"],["Au","or"]];
    var A = k.select("Substance A (bleu)", L.map(function(x){ return [x[0], x[1]]; }), "H2O");
    var B = k.select("Substance B (rouge)", L.map(function(x){ return [x[0], x[1]]; }), "CaCO3");
    var n = k.slider("Quantité de matière n", 0, 3, 0.05, 1, "mol");
    var ro = k.readouts(["M(A)", "m(A)", "M(B)", "m(B)"]);
    k.draw(function(){
      var MA = C4.M(A.value), MB = C4.M(B.value), nn = n.value, mx = Math.max(MA, MB) * 3 * 1.05;
      c.clear(); C4.bg(c);
      var ax = S.draw.axes(c, {x0:0, x1:3, y0:0, y1:mx, xl:"n (mol)", yl:"m (g)"});
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(3), ax.Y(MA * 3), "#1f4b9e", 3);
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(3), ax.Y(MB * 3), "#c0321d", 3);
      [[MA, "#1f4b9e"], [MB, "#c0321d"]].forEach(function(p){
        S.draw.line(c, ax.X(nn), ax.Y(0), ax.X(nn), ax.Y(p[0] * nn), p[1], 1, [3, 3]); S.draw.line(c, ax.X(0), ax.Y(p[0] * nn), ax.X(nn), ax.Y(p[0] * nn), p[1], 1, [3, 3]);
        S.draw.dot(c, ax.X(nn), ax.Y(p[0] * nn), 6, p[1]);
      });
      ro.set(0, S.fmt(MA, 1) + " g/mol"); ro.set(1, S.fmt(nn * MA, 1) + " g"); ro.set(2, S.fmt(MB, 1) + " g/mol"); ro.set(3, S.fmt(nn * MB, 1) + " g");
    });
  }
});

SFA.sim({
  id:"c4-c03-hydrate", ch:"c03", tag:"Expérience",
  titre:"Chauffer un hydrate : trouver x",
  resume:"Un sel hydraté perd son eau quand on le chauffe : la perte de masse donne le nombre x de molécules d'eau.",
  but:"Choisis un hydrate et une masse, chauffe pendant plusieurs minutes, puis calcule x à partir des masses avant et après.",
  aRetenir:"x = n(H₂O) / n(sel anhydre), avec n(H₂O) = (m avant − m après) / 18 et n(anhydre) = m après / M(anhydre). Il faut chauffer jusqu'à masse constante.",
  piege:"Si tu arrêtes trop tôt, il reste de l'eau : la masse n'est pas constante et x calculé est trop petit.",
  build:function(k, S){
    var c = k.canvas(300);
    var H = [["CuSO4","5","CuSO₄·5H₂O"],["MgSO4","7","MgSO₄·7H₂O"],["Na2CO3","10","Na₂CO₃·10H₂O"],["CaCl2","2","CaCl₂·2H₂O"]];
    var h = k.select("Hydrate", H.map(function(x, i){ return [i, x[2]]; }), 0);
    var m0 = k.slider("Masse de départ", 5, 25, 0.5, 12.5, "g");
    var t = k.slider("Durée de chauffage", 0, 10, 0.5, 0, "min");
    var ro = k.readouts(["Masse mesurée", "Eau perdue", "x trouvé"]);
    var nt = k.note("", "");
    function frac(tt){ var u = Math.min(1, tt / 8); return u * u * (3 - 2 * u); }
    var lp = k.loop(function(dt){ var v = Math.min(10, t.value + dt * 1.2); t.set(v); if (v >= 10) lp.pause(); k.redraw(); });
    k.button("▶ Chauffer", function(){ if (t.value >= 10) t.set(0); lp.play(); }, true); k.button("❚❚ Pause", function(){ lp.pause(); }); k.button("↺ Refroidir", function(){ lp.pause(); t.set(0); });
    k.draw(function(){
      var hh = H[+h.value], x = +hh[1], Man = C4.M(hh[0]), Mh = Man + 18 * x, mi = m0.value;
      var mw = mi * 18 * x / Mh, f = frac(t.value), mnow = mi - f * mw;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx;
      var ax = S.draw.axes(c, {x0:0, x1:10, y0:0, y1:Math.ceil(mi / 5) * 5, xl:"t (min)", yl:"m (g)", l:42});
      var pts = []; for (var i = 0; i <= 100; i++){ var tt = i / 10; pts.push([tt, mi - frac(tt) * mw]); }
      ctx.save(); ctx.strokeStyle = "#1f4b9e"; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach(function(p, j){ if (j) ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); else ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); }); ctx.stroke(); ctx.restore();
      S.draw.dot(c, ax.X(t.value), ax.Y(mnow), 7, "#c0321d");
      var mfin = mi - mw; S.draw.line(c, ax.X(8), ax.Y(mfin), ax.X(10), ax.Y(mfin), "#24775a", 1.5, [4, 4]);
      var done = t.value >= 8, lost = mi - mnow, xe = (lost / 18) / (mnow / Man);
      /* creuset */
      var cx = W * 0.82, cy = 70, col = hh[0] === "CuSO4" ? "rgb(" + Math.round(47 + 200 * f) + "," + Math.round(111 + 130 * f) + "," + Math.round(208 + 30 * f) + ")" : "#f3f1ea";
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - 32, cy); ctx.lineTo(cx + 32, cy); ctx.lineTo(cx + 20, cy + 26); ctx.lineTo(cx - 20, cy + 26); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.stroke();
      if (t.value > 0 && t.value < 8){ for (var q = 0; q < 4; q++) S.draw.dot(c, cx - 15 + q * 10 + Math.sin(t.value * 3 + q) * 4, cy - 10 - ((t.value * 20 + q * 9) % 30), 3, "rgba(120,160,200,.6)"); }
      C4.label(c, "creuset", cx, cy + 42, "#5f6b7a", 12);
      ro.set(0, S.fmt(mnow, 2) + " g"); ro.set(1, S.fmt(lost, 2) + " g"); ro.set(2, t.value > 0 ? S.fmt(xe, 2) : "—");
      if (t.value === 0) nt.set("Pèse l'hydrate, puis lance le chauffage.", "");
      else if (!done) nt.set("La masse diminue encore : l'eau n'est pas toute partie. Le x trouvé (" + S.fmt(xe, 2) + ") est trop petit. Continue jusqu'à masse constante.", "warn");
      else nt.set("Masse constante : " + S.fmt(mnow, 2) + " g de " + C4.sub(hh[0]) + ". n(eau) = " + S.fmt(lost / 18, 3) + " mol, n(anhydre) = " + S.fmt(mnow / Man, 3) + " mol, donc x = " + S.fmt(xe, 1) + " → " + C4.sub(hh[0]) + "·" + hh[1] + "H₂O.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c03-centesimale", ch:"c03", tag:"Niche",
  titre:"Quel engrais, quel minerai est le plus riche ?",
  resume:"Compare le pourcentage massique d'un élément dans plusieurs composés et calcule la masse d'élément contenue dans un sac.",
  but:"Choisis une famille, puis une masse de produit : le classement des composés les plus riches s'affiche.",
  aRetenir:"Pourcentage massique d'un élément = (nombre d'atomes × M(élément)) / M(composé) × 100. Le composé le plus riche n'est pas celui qui a le plus d'atomes, mais celui où l'élément pèse le plus dans la molécule.",
  piege:"Un engrais « 46 % d'azote » ne contient pas 46 % de N₂ : il contient 46 % de sa masse sous forme de l'élément azote, lié dans la molécule.",
  build:function(k, S){
    var c = k.canvas(300);
    var G = {
      N:{nom:"Azote (N) dans des engrais", el:"N", l:["CO(NH2)2","NH4NO3","(NH4)2SO4","NaNO3","KNO3","NH3"]},
      Fe:{nom:"Fer (Fe) dans des minerais", el:"Fe", l:["FeO","Fe3O4","Fe2O3","FeCO3","FeS2"]},
      Ca:{nom:"Calcium (Ca) dans des composés", el:"Ca", l:["CaO","Ca(OH)2","CaCl2","CaCO3","CaSO4"]},
      Cl:{nom:"Chlore (Cl) dans des composés", el:"Cl", l:["HCl","CaCl2","NaCl","KCl","NaClO"]}
    };
    var g = k.select("Famille", Object.keys(G).map(function(x){ return [x, G[x].nom]; }), "N");
    var m = k.slider("Masse de produit", 1, 100, 1, 50, "kg");
    var ro = k.readouts(["Le plus riche", "% massique", "Masse d'élément (plus riche)"]);
    k.draw(function(){
      var gg = G[g.value], rows = gg.l.map(function(f){ var cmp = C4.parse(f); return {f:f, p:100 * cmp[gg.el] * C4.MM[gg.el] / C4.M(f)}; }).sort(function(a, b){ return b.p - a.p; });
      c.clear(); C4.bg(c);
      var W = c.W, y = 22, rh = Math.min(40, 250 / rows.length), lw = 100;
      rows.forEach(function(r, i){
        var yy = 20 + i * rh;
        C4.label(c, C4.uni(r.f), 10, yy + rh / 2, "#0f1b2d", 13, "left");
        C4.bar(c, lw, yy + 4, W - lw - 16, rh - 10, r.p / 100, i === 0 ? "#24775a" : "#1f4b9e");
        C4.label(c, S.fmt(r.p, 1) + " %", lw + 6, yy + rh / 2, "#fff", 12, "left");
        C4.label(c, S.fmt(r.p * m.value / 100, 1) + " kg", W - 22, yy + rh / 2, lw + (r.p / 100) * (W - lw - 16) > W - 90 ? "#fff" : "#2c3a4e", 12, "right");
      });
      C4.label(c, "Barres : % massique de " + gg.el + " ; à droite : masse de " + gg.el + " dans " + S.fmt(m.value, 0) + " kg de produit", W / 2, c.H - 16, "#5f6b7a", 11);
      ro.set(0, C4.sub(rows[0].f)); ro.set(1, S.fmt(rows[0].p, 1) + " %"); ro.set(2, S.fmt(rows[0].p * m.value / 100, 1) + " kg");
    });
  }
});
