/* Chapitre 4 · Acides et bases : couples, Ka et pH */
(function(){
var KW = 1e-14;
function bis(f, lo, hi){ /* racine de f (croissante en h) par dichotomie en échelle log, h dans [1e-15, 20] */
  var a = Math.log(lo), b = Math.log(hi), m, i;
  for (i = 0; i < 80; i++){ m = (a + b) / 2; if (f(Math.exp(m)) > 0) b = m; else a = m; }
  return Math.exp((a + b) / 2);
}
/* acide HA (pKa) de concentration c : h = [HA-] ... électroneutralité h = Kw/h + c·Ka/(Ka+h) */
function phAcide(pKa, c){ var Ka = Math.pow(10, -pKa); return -Math.log10(bis(function(h){ return h - KW / h - c * Ka / (Ka + h); }, 1e-15, 20)); }
/* base B de couple BH+/B (pKa) de concentration c : h + c·h/(Ka+h) = Kw/h */
function phBase(pKa, c){ var Ka = Math.pow(10, -pKa); return -Math.log10(bis(function(h){ return h + c * h / (Ka + h) - KW / h; }, 1e-15, 20)); }
var ACI = [
  {nom: "HCl (acide fort)", pKa: -7, f: "HCl", b: "Cl⁻"},
  {nom: "HNO₃ (acide fort)", pKa: -1.4, f: "HNO₃", b: "NO₃⁻"},
  {nom: "Acide méthanoïque, pKa 3,75", pKa: 3.75, f: "HCOOH", b: "HCOO⁻"},
  {nom: "Acide fluorhydrique, pKa 3,17", pKa: 3.17, f: "HF", b: "F⁻"},
  {nom: "Acide éthanoïque, pKa 4,76", pKa: 4.76, f: "CH₃COOH", b: "CH₃COO⁻"},
  {nom: "Ion ammonium, pKa 9,25", pKa: 9.25, f: "NH₄⁺", b: "NH₃"},
  {nom: "Acide cyanhydrique, pKa 9,21", pKa: 9.21, f: "HCN", b: "CN⁻"}
];
function pct(a){ var v = a * 100; return v < 0.01 && v > 0 ? S_sci(v) + " %" : null; }
function S_sci(v){ return window.SFA.sci(v, 1); }
SFA.sim({
  id: "c6-c04-dissociation", ch: "c04", tag: "Classique",
  titre: "Dans le bécher : acide fort ou acide faible ?",
  resume: "Même concentration, deux acides : combien de molécules ont cédé leur proton ? Lis le pH et le taux de dissociation.",
  but: "Choisis un acide et dilue-le (curseur de pc = −log c ou bouton ×10). Regarde la part de molécules dissociées (ions rouge et bleu qui apparaissent et disparaissent) et compare le pH à celui d'un acide fort.",
  aRetenir: "Un acide fort est totalement dissocié (HA + H₂O → A⁻ + H₃O⁺). Un acide faible l'est partiellement : HA + H₂O ⇌ A⁻ + H₃O⁺, avec un taux α = [A⁻]/c qui augmente quand on dilue. La force d'un acide (pKa) n'a rien à voir avec sa concentration.",
  piege: "Fort ou faible ne veut pas dire concentré ou dilué. Un acide faible concentré peut être très dangereux, un acide fort très dilué est inoffensif. Et pour un acide faible, pH ≠ −log c.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, H = window.C6, N = 110, tt = 0;
    var ac = k.select("Acide", ACI.map(function(a, j){ return [j, a.nom]; }), 4);
    var pc = k.slider("pc (c = 10^−pc mol/L)", 0, 4, 0.1, 1, "");
    k.button("Diluer ×10", function(){ pc.set(Math.min(4, pc.value + 1)); }, true); k.button("Concentrer ×10", function(){ pc.set(Math.max(0, pc.value - 1)); });
    var ro = k.readouts(["Concentration c", "pH", "Taux de dissociation α", "pH d'un acide fort"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var a = ACI[ac.value], cc = Math.pow(10, -pc.value), ph = phAcide(a.pKa, cc), h = Math.pow(10, -ph), Ka = Math.pow(10, -a.pKa), ctx = c.ctx, i;
      var alpha = Math.min(1, Ka / (Ka + h)), phF = Math.max(0, -Math.log10(cc));
      var bx = 12, by = 46, bw = c.W - 24, bh = 196, nd = 0;
      ctx.save(); S.draw.rrect(c, bx, by, bw, bh, 12); var g = ctx.createLinearGradient(0, by, 0, by + bh); g.addColorStop(0, "#e7f1fb"); g.addColorStop(1, "#cfe2f5"); ctx.fillStyle = g; ctx.fill(); ctx.clip();
      for (i = 0; i < N; i++){
        var p = H.wander(i, tt, 0.8), x = bx + 14 + p[0] * (bw - 28), y = by + 14 + p[1] * (bh - 28);
        var diss = ((tt * 0.33 + H.rnd(i, 9)) % 1) < alpha;
        if (!diss){
          ctx.fillStyle = "#8793a3"; ctx.beginPath(); ctx.arc(x, y, 8.5, 0, 7); ctx.fill(); ctx.fillStyle = "#f4f6fa"; ctx.beginPath(); ctx.arc(x + 7, y - 6, 4, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.25)"; ctx.lineWidth = 1; ctx.stroke();
        } else {
          nd++; var q = H.wander(300 + i, tt, 1.1), x2 = bx + 14 + q[0] * (bw - 28), y2 = by + 14 + q[1] * (bh - 28);
          ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x, y, 8.5, 0, 7); ctx.fill(); S.draw.line(c, x - 4, y, x + 4, y, "#fff", 2);
          ctx.fillStyle = P.blue; ctx.beginPath(); ctx.arc(x2, y2, 6.5, 0, 7); ctx.fill(); S.draw.line(c, x2 - 3.5, y2, x2 + 3.5, y2, "#fff", 2); S.draw.line(c, x2, y2 - 3.5, x2, y2 + 3.5, "#fff", 2);
        }
      }
      ctx.restore(); ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2; S.draw.rrect(c, bx, by, bw, bh, 12); ctx.stroke();
      /* légende */
      var lg = [["#8793a3", a.f], [P.red, a.b], [P.blue, "H₃O⁺"]];
      lg.forEach(function(it, j){ var lx = 14 + j * (c.W - 28) / 3; S.draw.dot(c, lx + 7, 22, 7, it[0]); S.draw.text(c, it[1], lx + 20, 22, {size: 13, align: "left", math: true, weight: 800}); });
      S.draw.text(c, "échantillon de " + N + " molécules (la dissociation va et vient)", c.W / 2, by + bh + 14, {size: 11, color: P.grey});
      /* pH-mètre et échelle de pH */
      S.draw.display(c, S.fmt(ph, 2), 76, by + bh + 64, {w: 118, h: 58, caption: "pH de la solution", size: 24});
      S.draw.text(c, "α ≈ " + (alpha > 0.995 ? "100 %" : alpha < 0.0095 ? S.fmt(alpha * 100, 2) + " %" : S.fmt(alpha * 100, 1) + " %"), 76, by + bh + 108, {size: 12.5, color: P.ink, weight: 800});
      var sx0 = 150, sx1 = c.W - 20, sy = by + bh + 70;
      for (i = 0; i < 70; i++){ ctx.fillStyle = H.phColor(i / 5); ctx.fillRect(sx0 + (sx1 - sx0) * i / 70, sy, (sx1 - sx0) / 70 + 1, 14); }
      S.draw.text(c, "0", sx0, sy + 26, {size: 10.5, color: P.grey}); S.draw.text(c, "7", sx0 + (sx1 - sx0) / 2, sy + 26, {size: 10.5, color: P.grey}); S.draw.text(c, "14", sx1, sy + 26, {size: 10.5, color: P.grey});
      var px = function(v){ return sx0 + (sx1 - sx0) * Math.max(0, Math.min(14, v)) / 14; };
      S.draw.dot(c, px(ph), sy + 7, 8, "#fff"); S.draw.dot(c, px(ph), sy + 7, 5, P.ink);
      S.draw.label(c, "ta solution " + S.fmt(ph, 2), Math.max(sx0 + 46, Math.min(sx1 - 46, px(ph))), sy - 12, {color: P.ink, size: 11});
      if (alpha < 0.995){ var tx = px(phF); ctx.save(); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.moveTo(tx, sy + 17); ctx.lineTo(tx - 6, sy + 30); ctx.lineTo(tx + 6, sy + 30); ctx.closePath(); ctx.fill(); ctx.restore();
        S.draw.label(c, "acide fort : " + S.fmt(phF, 2), Math.max(sx0 + 56, Math.min(sx1 - 56, tx)), sy + 44, {color: P.amber, size: 11}); }
      ro.set(0, S.sci(cc, 2) + " mol/L"); ro.set(1, S.fmt(ph, 2)); ro.set(2, alpha > 0.995 ? "≈ 100 % (fort)" : pct(alpha) || (S.fmt(alpha * 100, alpha < 0.1 ? 2 : 1) + " %")); ro.set(3, S.fmt(phF, 2));
      if (alpha > 0.995) nt.set("Acide fort : toutes les molécules sont dissociées, pH = −log c.", "ok");
      else if (alpha < 0.03) nt.set("Acide faible très peu dissocié : sur " + N + " molécules, il en apparaît seulement " + S.fmt(alpha * N, 1) + " en moyenne (α ≈ " + (pct(alpha) || (S.fmt(alpha * 100, 2) + " %")) + "). Le pH (" + S.fmt(ph, 2) + ") est bien plus élevé que celui d'un acide fort de même concentration (" + S.fmt(phF, 2) + ").", "warn");
      else nt.set("Acide faible : le pH (" + S.fmt(ph, 2) + ") est plus élevé que celui d'un acide fort de même concentration (" + S.fmt(phF, 2) + ").", "ok");
    });
  }
});

SFA.sim({
  id: "c6-c04-calcul-ph", ch: "c04", tag: "Graphes",
  titre: "Calculer un pH : formule approchée ou calcul exact ?",
  resume: "Trace le pH en fonction de la dilution et compare le calcul exact aux formules pH = −log c et pH = ½(pKa − log c).",
  but: "Choisis acide ou base, règle le pKa et le pc (c = 10^−pc). Observe où chaque formule approchée colle à la courbe exacte.",
  aRetenir: "Acide fort : pH = −log c. Acide faible (peu dissocié, α < 5 %) : pH ≈ ½(pKa − log c). Base forte : pH = 14 − pc ; base faible : pH ≈ 7 + ½(pKa − pc). Ces formules ne valent que dans leur domaine : très dilué, l'eau impose son pH de 7 à 25 °C.",
  piege: "Un acide, même fort, ne peut pas donner un pH supérieur à 7 en solution diluée : à c = 10⁻⁸ mol/L, le pH de HCl vaut environ 6,98 et non 8. Et la formule de l'acide faible échoue quand l'acide est trop dilué ou trop fort.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var ty = k.seg("Type", [["a", "Acide"], ["b", "Base"]], "a");
    var pk = k.slider("pKa du couple", -1, 13, 0.25, 4.75, "");
    var pc = k.slider("pc (c = 10^−pc mol/L)", 0, 6, 0.1, 1, "");
    var ro = k.readouts(["pH exact", "Formule approchée", "Écart", "Taux α (acide) ou β (base)"]);
    var nt = k.note("", "ok");
    c.pointer(function(type, pp){ if (type === "move" || type === "up" || !c._ax) return; pc.set(Math.round(Math.max(0, Math.min(6, c._ax.ix(pp.x))) * 10) / 10); k.redraw(); });
    function exact(p, q){ return ty.value === "a" ? phAcide(p, Math.pow(10, -q)) : phBase(p, Math.pow(10, -q)); }
    function faible(p, q){ return ty.value === "a" ? Math.max(0, 0.5 * (p + q)) : Math.min(14, 7 + 0.5 * (p - q)); }
    function fort(q){ return ty.value === "a" ? q : 14 - q; }
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 6, y0: 0, y1: 14, stepX: 1, stepY: 2, xl: "pc = −log c", yl: "pH"}); c._ax = ax;
      S.draw.fn(c, ax, function(x){ return fort(x); }, P.amber, 2, [6, 4]);
      S.draw.fn(c, ax, function(x){ return faible(pk.value, x); }, P.violet, 2, [2, 4]);
      S.draw.fn(c, ax, function(x){ return exact(pk.value, x); }, P.green, 3);
      var ph = exact(pk.value, pc.value), cc = Math.pow(10, -pc.value), h = Math.pow(10, -ph), Ka = Math.pow(10, -pk.value);
      S.draw.dot(c, ax.X(pc.value), ax.Y(ph), 6, P.green);
      S.draw.legend(c, [[P.green, "exact"], [P.amber, ty.value === "a" ? "acide fort : pH = −log c" : "base forte : pH = 14 − pc", true], [P.violet, "formule du faible", true]], ax.L + 8, ty.value === "a" ? ax.T + 6 : ax.B - 62, {});
      var al = ty.value === "a" ? Ka / (Ka + h) : h / (Ka + h);
      var ap = faible(pk.value, pc.value), usable = ty.value === "a" ? (al < 0.05 && ph < 6.5) : (al < 0.05 && ph > 7.5);
      ro.set(0, S.fmt(ph, 2)); ro.set(1, S.fmt(ap, 2)); ro.set(2, S.fmt(Math.abs(ph - ap), 2)); ro.set(3, S.fmt(al * 100, al < 0.1 ? 2 : 0) + " %");
      var strong = ty.value === "a" ? pk.value < 0 : false;
      nt.set(usable ? "La formule du faible est valable ici (écart faible)." : "La formule du faible n'est pas valable ici : taux > 5 % ou solution trop diluée.", usable ? "ok" : "warn");
    });
  }
});

var SYS = [
  {nom: "Acide éthanoïque / ion éthanoate", pk: [4.76], sp: ["CH₃COOH", "CH₃COO⁻"]},
  {nom: "Ion ammonium / ammoniac", pk: [9.25], sp: ["NH₄⁺", "NH₃"]},
  {nom: "Acide fluorhydrique / ion fluorure", pk: [3.17], sp: ["HF", "F⁻"]},
  {nom: "Dioxyde de carbone dissous (H₂CO₃, HCO₃⁻, CO₃²⁻)", pk: [6.35, 10.33], sp: ["H₂CO₃", "HCO₃⁻", "CO₃²⁻"]},
  {nom: "Acide phosphorique (3 acidités)", pk: [2.15, 7.20, 12.35], sp: ["H₃PO₄", "H₂PO₄⁻", "HPO₄²⁻", "PO₄³⁻"]}
];
function fractions(pk, pH){
  var t = [1], i, s = 1, cum = 0;
  for (i = 0; i < pk.length; i++){ cum += pk[i]; t.push(Math.pow(10, (i + 1) * pH - cum)); }
  /* t_j = 10^(j pH − Σ pKa) ; pH petit : forme la plus protonée (j = 0) */
  var out = []; s = 0; for (i = 0; i < t.length; i++){ s += t[i]; }
  /* t_j ∝ [forme avec j protons perdus] */
  for (i = 0; i < t.length; i++) out.push(t[i] / s);
  return out;
}
SFA.sim({
  id: "c6-c04-predominance", ch: "c04", tag: "Graphes",
  titre: "Diagramme de prédominance : quelle forme domine à ce pH ?",
  resume: "Fais glisser le pH et vois la forme acide ou basique qui prédomine ; essaie les espèces à plusieurs acidités.",
  but: "Choisis un couple (ou un polyacide) puis déplace le pH (curseur ou en glissant sur le graphique). Repère les croisements à pH = pKa.",
  aRetenir: "pH < pKa : la forme acide prédomine. pH > pKa : la forme basique prédomine. pH = pKa : les deux formes sont à parts égales. Pour [A⁻]/[HA] = 10^(pH − pKa) : un pH d'une unité au-dessus du pKa donne 10 fois plus de base que d'acide. Un ampholyte (comme HCO₃⁻) est à la fois base d'un couple et acide d'un autre.",
  piege: "« Prédominer » ne veut pas dire « être seul » : à pH = pKa + 1, il reste encore 9 % de forme acide. Et un polyacide a un pKa par acidité : le diagramme se découpe en plusieurs zones.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette, cols = [P.red, P.amber, P.green, P.acc];
    var sy = k.select("Espèce", SYS.map(function(s, i){ return [i, s.nom]; }), 0);
    var ph = k.slider("pH", 0, 14, 0.1, 4.8, "");
    var ro = k.readouts(["Forme prédominante", "Fractions"]);
    var nt = k.note("", "ok");
    c.pointer(function(t, p){ if (t === "move" || t === "up") return; var ax = c._ax; if (!ax) return; var v = Math.max(0, Math.min(14, ax.ix(p.x))); ph.set(Math.round(v * 10) / 10); k.redraw(); });
    k.draw(function(){
      c.clear();
      var s = SYS[sy.value], H = window.C6, frT = fractions(s.pk, ph.value), ctxT = c.ctx, xb = 14, wb = c.W - 28;
      H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      S.draw.text(c, "Composition à pH = " + S.fmt(ph.value, 1), 14, 14, {size: 12.5, color: P.ink, align: "left", weight: 800});
      ctxT.save(); S.draw.rrect(c, xb, 28, wb, 30, 10); ctxT.clip();
      frT.forEach(function(f, j){ ctxT.fillStyle = cols[j]; ctxT.fillRect(xb, 28, wb * f + 0.5, 30); if (f > 0.09){ S.draw.text(c, s.sp[j] + " " + S.fmt(f * 100, 0) + " %", xb + wb * f / 2, 43, {size: 11.5, color: "#fff", weight: 800, math: true}); } xb += wb * f; });
      ctxT.restore();
      var ax = S.draw.axes(c, {x0: 0, x1: 14, y0: 0, y1: 1.05, stepX: 2, stepY: 0.25, xl: "pH", yl: "fraction", t: 76}); c._ax = ax;
      var j;
      for (j = 0; j < s.sp.length; j++){ (function(jj){ S.draw.fn(c, ax, function(x){ return fractions(s.pk, x)[jj]; }, cols[jj], 2.6); })(j); }
      s.pk.forEach(function(p, i){ S.draw.line(c, ax.X(p), ax.T, ax.X(p), ax.B, P.light, 1.2, [4, 3]); S.draw.text(c, "pKa " + S.fmt(p, 2), ax.X(p) + 4, ax.T + 28 + i * 14, {size: 12, color: P.grey, align: "left"}); });
      S.draw.line(c, ax.X(ph.value), ax.T, ax.X(ph.value), ax.B, P.ink, 1.8);
      var fr = fractions(s.pk, ph.value), best = 0;
      fr.forEach(function(f, i){ if (f > fr[best]) best = i; S.draw.dot(c, ax.X(ph.value), ax.Y(f), 5, cols[i]); });
      var bx = ax.L, bw = ax.R - ax.L, yb = ax.B - 6, i2, x0 = 0, bounds = [0].concat(s.pk, [14]);
      for (i2 = 0; i2 < s.sp.length; i2++){
        S.draw.text(c, s.sp[i2], ax.X((bounds[i2] + bounds[i2 + 1]) / 2), ax.Y(0.5 + (i2 % 2) * 0.12), {size: 14, color: cols[i2]});
      }
      ro.set(0, s.sp[best]); ro.set(1, s.sp.map(function(n, i){ return n + " " + S.fmt(fr[i] * 100, 0) + " %"; }).join(" · "));
      var near = s.pk.filter(function(p){ return Math.abs(p - ph.value) < 0.06; });
      nt.set(near.length ? "pH ≈ pKa : les deux formes sont à parts à peu près égales (≈ 50 % / 50 %)." : "Rapport entre formes voisines : 10<sup>|pH − pKa|</sup> en faveur de la forme prédominante.", "ok");
    });
  }
});

var ANT = [
  {nom: "Carbonate de calcium CaCO₃", M: 100, z: 2},
  {nom: "Hydroxyde de magnésium Mg(OH)₂", M: 58, z: 2},
  {nom: "Hydrogénocarbonate de sodium NaHCO₃", M: 84, z: 1},
  {nom: "Hydroxyde d'aluminium Al(OH)₃", M: 78, z: 3}
];
SFA.sim({
  id: "c6-c04-antiacide", ch: "c04", tag: "Dans la vraie vie",
  titre: "Acide gastrique et antiacide : combien de comprimés ?",
  resume: "Quelle masse d'antiacide faut-il pour remonter le pH de l'estomac ? Compare 4 produits.",
  but: "Choisis l'antiacide et la masse ; l'estomac est un bécher de 300 mL à pH 1,5 (modèle). Observe le pH et trouve la masse pour atteindre pH 3.",
  aRetenir: "Un antiacide est une base : il consomme les ions H⁺ en excès. Pouvoir neutralisant = z × n(antiacide), avec z le nombre de H⁺ consommés par formule (CaCO₃ : 2, Mg(OH)₂ : 2, NaHCO₃ : 1, Al(OH)₃ : 3). Par gramme, c'est Al(OH)₃ puis Mg(OH)₂ qui neutralisent le plus.",
  piege: "Neutraliser tout l'acide n'est pas le but : l'estomac a besoin d'un pH acide pour digérer. De plus, le modèle est simplifié (volume constant, pas de renouvellement de l'acide, CO₂ dégagé ignoré) et ne calcule pas le pH au-delà de 3.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, H = window.C6, tt = 0;
    var an = k.select("Antiacide", ANT.map(function(a, i){ return [i, a.nom]; }), 0);
    var m = k.slider("Masse d'antiacide", 0, 900, 10, 250, "mg");
    var ro = k.readouts(["n(H⁺) au départ", "H⁺ neutralisés", "pH final", "H⁺ neutralisés par gramme"]);
    var nt = k.note("", "ok");
    var V = 0.3, ph0 = 1.5, nh0 = Math.pow(10, -ph0) * V * 1000;   /* mmol */
    function pHm(a, mg){ var nl = nh0 - a.z * mg / a.M; if (nl <= 0) return null; var p = -Math.log10(nl / 1000 / V); return p > 3 ? null : p; }
    var lpA = k.loop(function(dt, t){ tt = t; k.redraw(); }); lpA.play();
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var a0 = ANT[an.value], pp0 = pHm(a0, m.value), ph0 = pp0 === null ? 3.2 : pp0, nn0 = m.value / a0.M, cn0 = Math.min(nh0, a0.z * nn0);
      H.glass(c, "beaker", 28, 26, 100, 104, {level: 0.72, color: H.phColor(ph0).match(/\d+/g).map(Number), alpha: 0.9, shine: true,
        inside: function(top){ for (var q = 0; q < 8; q++){ var u = (tt * 0.6 + q / 8) % 1; if (m.value > 5) S.draw.dot(c, 40 + H.rnd(q, 1) * 76, 126 - u * (126 - top), 2.2, "rgba(255,255,255,.7)"); } }});
      var ctx_t = c.ctx; ctx_t.save(); ctx_t.fillStyle = "#f4f6fa"; ctx_t.strokeStyle = "rgba(15,27,45,.35)"; S.draw.rrect(c, 60, 118 - Math.min(14, m.value / 60), 36, Math.min(14, m.value / 60) + 4, 4); ctx_t.fill(); ctx_t.stroke(); ctx_t.restore();
      S.draw.text(c, "estomac (300 mL)", 78, 146, {size: 12, color: P.grey, weight: 700});
      S.draw.display(c, pp0 === null ? "> 3" : S.fmt(ph0, 2), c.W - 98, 56, {w: 120, h: 54, caption: "pH de l'estomac", size: 24});
      S.draw.text(c, S.fmt(cn0 / nh0 * 100, 0) + " % des H⁺ neutralisés", c.W - 98, 102, {size: 12, color: P.green, weight: 800});
      var ax = S.draw.axes(c, {x0: 0, x1: 900, y0: 1, y1: 3.5, stepX: 100, stepY: 0.5, xl: "masse / mg", yl: "pH", t: 176, b: 34});
      var cols = [P.acc, P.green, P.amber, P.violet], i;
      S.draw.line(c, ax.L, ax.Y(3), ax.R, ax.Y(3), P.light, 1.4, [4, 4]);
      S.draw.text(c, "modèle limité à pH 3", ax.R - 6, ax.Y(3) - 9, {size: 12, color: P.grey, align: "right"});
      for (i = 0; i < ANT.length; i++){
        (function(a, col){
          S.draw.fn(c, ax, function(x){ var p = pHm(a, x); return p === null ? NaN : p; }, col, i === +an.value ? 3.4 : 1.6);
        })(ANT[i], cols[i]);
        S.draw.text(c, ["CaCO₃", "Mg(OH)₂", "NaHCO₃", "Al(OH)₃"][i], ax.L + 56 + (i % 2) * 90, ax.T + 8 + Math.floor(i / 2) * 18, {size: 12, color: cols[i], align: "left"});
      }
      var a = ANT[an.value], nn = m.value / a.M, cons = Math.min(nh0, a.z * nn), p = pHm(a, m.value);
      if (p !== null) S.draw.dot(c, ax.X(m.value), ax.Y(p), 6, cols[an.value]);
      ro.set(0, S.fmt(nh0, 2) + " mmol"); ro.set(1, S.fmt(cons, 2) + " mmol (" + S.fmt(cons / nh0 * 100, 0) + " %)");
      ro.set(2, p === null ? (a.z * nn >= nh0 ? "> 3 (neutralisé)" : "> 3") : S.fmt(p, 2)); ro.set(3, S.fmt(a.z / a.M * 1000, 1) + " mmol/g");
      if (p === null) nt.set("Tout l'acide est neutralisé et l'on dépasse pH 3 : le modèle ne calcule plus le pH, et l'excès d'antiacide est inutile.", "warn");
      else nt.set("pH " + S.fmt(p, 2) + " : il reste " + S.fmt(nh0 - cons, 2) + " mmol de H⁺.", "ok");
    });
  }
});
})();
