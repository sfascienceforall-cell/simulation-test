/* Chapitre 7 · Oxydoréduction : transferts d'électrons */
(function(){
function wrap(c, S, txt, x, y, maxW, opt){
  var ctx = c.ctx, size = opt.size || 13, words = String(txt).split(" "), line = "", lines = [], i;
  ctx.save(); ctx.font = (opt.weight || 700) + " " + size + "px " + (opt.math ? "'STIX Two Text', serif" : "Mulish, system-ui, sans-serif");
  for (i = 0; i < words.length; i++){ var t = line ? line + " " + words[i] : words[i]; if (ctx.measureText(t).width > maxW && line){ lines.push(line); line = words[i]; } else line = t; }
  lines.push(line); ctx.restore();
  lines.forEach(function(l, j){ S.draw.text(c, l, x, y + j * (size + 4), opt); });
  return lines.length;
}
/* métaux : E° du couple M^n+/M (V), masse molaire arrondie (g/mol) */
var MET = [
  {s: "Mg", E: -2.37, n: 2, M: 24, ion: "Mg²⁺", col: [160, 165, 170], ic: null},
  {s: "Al", E: -1.66, n: 3, M: 27, ion: "Al³⁺", col: [175, 180, 185], ic: null},
  {s: "Zn", E: -0.76, n: 2, M: 65, ion: "Zn²⁺", col: [150, 160, 170], ic: null},
  {s: "Fe", E: -0.44, n: 2, M: 56, ion: "Fe²⁺", col: [110, 115, 120], ic: [170, 205, 150]},
  {s: "Pb", E: -0.13, n: 2, M: 207, ion: "Pb²⁺", col: [95, 100, 110], ic: null},
  {s: "Cu", E: 0.34, n: 2, M: 63.5, ion: "Cu²⁺", col: [196, 106, 60], ic: [90, 150, 230]},
  {s: "Ag", E: 0.80, n: 1, M: 108, ion: "Ag⁺", col: [215, 220, 226], ic: null}
];
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
function mixc(c1, c2, t){ return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(c1[i] + (c2[i] - c1[i]) * t); }).join(",") + ")"; }
SFA.sim({
  id: "c6-c07-plaque", ch: "c07", tag: "Classique",
  titre: "Une plaque de métal dans une solution de cations",
  resume: "Plonge un métal dans une solution d'ions : y a-t-il dépôt ? Prévois-le avec les potentiels standards.",
  but: "Choisis le métal de la plaque et le cation en solution. Fais avancer la réaction (50 mL de solution à 0,100 mol/L, curseur ou bouton « Animer ») et observe les ions, la couleur, le dépôt et la variation de masse de la plaque.",
  aRetenir: "La plaque (réducteur M₁) réagit avec le cation (oxydant M₂ⁿ⁺) si E°(M₂ⁿ⁺/M₂) > E°(M₁ⁿ⁺/M₁) : M₁ cède des électrons, M₂ se dépose. Exemples : Zn + Cu²⁺ → Zn²⁺ + Cu ; Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag. Les charges et les atomes doivent être équilibrés : le nombre d'électrons cédés égale le nombre d'électrons captés.",
  piege: "La plaque ne perd pas d'électrons « en plus » : le métal le moins noble (E° le plus bas) s'oxyde. Un métal plus noble ne réagit pas avec le cation d'un métal moins noble (Cu dans Zn²⁺ : rien). Attention : l'aluminium, protégé par sa couche d'oxyde, réagit en pratique très lentement malgré son E° très bas.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, H = window.C6, tt = 0, go = false;
    var pl = k.select("Plaque (réducteur)", MET.map(function(m, i){ return [i, m.s]; }), 2);
    var ca = k.select("Solution de cations (oxydant)", MET.map(function(m, i){ return [i, m.ion]; }), 5);
    var av = k.slider("Avancement (part du cation consommée)", 0, 100, 1, 0, "%");
    var lp = k.loop(function(dt, t){ tt = t; if (go){ var v = av.value + dt * 14; if (v >= 100){ v = 100; go = false; } av.set(v); } k.redraw(); });
    lp.play();
    k.button("▶ Animer", function(){ av.set(0); go = true; }, true); k.button("↺ Recommencer", function(){ go = false; av.set(0); });
    var ro = k.readouts(["Réaction ?", "E°(ox) − E°(red)", "Δm de la plaque", "Dépôt"]);
    var nt = k.note("", "ok");
    var IONC = {Mg: "#9fb0c8", Al: "#b9a7d8", Zn: "#7fa3b8", Fe: "#8fc27a", Pb: "#8a8f9c", Cu: "#3d82e0", Ag: "#c2cad4"};
    function metalGrad(x, y, w, h, col){ var g = c.ctx.createLinearGradient(x, 0, x + w, 0), b = "rgb(" + col.join(",") + ")"; g.addColorStop(0, H.shade ? H.shade("#" + col.map(function(v){ return ("0" + v.toString(16)).slice(-2); }).join(""), 0.25) : b); g.addColorStop(0.45, "rgb(" + col.map(function(v){ return Math.min(255, v + 40); }).join(",") + ")"); g.addColorStop(1, H.shade("#" + col.map(function(v){ return ("0" + v.toString(16)).slice(-2); }).join(""), -0.2)); return g; }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var A = MET[pl.value], B = MET[ca.value], ok = B.E > A.E && A !== B, f = ok ? av.value / 100 : 0, ctx = c.ctx, i;
      var n1 = A.n, n2 = B.n, L = n1 * n2 / gcd(n1, n2), a = L / n1, b = L / n2;
      var nc = f * 5.0, dm = nc * B.M - nc * (n2 / n1) * A.M;
      var bx = 22, bw = c.W - 44, by = 70, bh = 290;
      var colLiq = B.ic ? mixc(B.ic, A.ic || [235, 240, 245], f) : mixc([235, 240, 245], A.ic || [235, 240, 245], f);
      var rgb = colLiq.match(/\d+/g).map(Number);
      H.glass(c, "beaker", bx, by, bw, bh, {level: 0.8, color: rgb, alpha: 0.82, shine: false});
      var lvTop = by + bh - (bh - 6) * 0.8, pw = 46, px = c.W / 2 - pw / 2, py = 30, ph = by + bh - 24 - py, wear = 1 - 0.28 * f * (ok ? 1 : 0);
      /* ions du cation (disparaissent) et de la plaque (apparaissent) */
      var NB = 26, nB = Math.round(NB * (1 - f)), nA = Math.round(NB * f * b / a * (n2 === n1 ? 1 : 1)), cb = IONC[B.s], ca2 = IONC[A.s];
      for (i = 0; i < NB; i++){
        var wp = H.wander(i, tt, 0.7), ix = bx + 14 + wp[0] * (bw - 28), iy = lvTop + 18 + wp[1] * (by + bh - lvTop - 36);
        if (Math.abs(ix - (px + pw / 2)) < pw / 2 + 12) ix += (ix < px + pw / 2 ? -1 : 1) * (pw / 2 + 12);
        if (i < nB){ H.ball(c, ix, iy, 10, cb, "", {}); S.draw.text(c, B.ion.replace(/[A-Za-z]/g, "").replace("²", "").replace("³", ""), ix, iy, {size: 11, color: "#fff", weight: 800}); }
        else if (i - nB < nA && ok){ H.ball(c, ix, iy, 10, ca2, "", {}); S.draw.text(c, A.ion.replace(/[A-Za-z]/g, "").replace("²", "").replace("³", ""), ix, iy, {size: 11, color: "#fff", weight: 800}); }
      }
      /* plaque */
      var ppx = px + pw * (1 - wear) / 2, ppw = pw * wear;
      ctx.save(); ctx.fillStyle = metalGrad(ppx, py, ppw, ph, A.col); S.draw.rrect(c, ppx, py, ppw, ph, 3); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1.4; ctx.stroke();
      if (f > 0){ var dcol = "rgb(" + B.col.join(",") + ")"; ctx.fillStyle = dcol;
        for (i = 0; i < 70; i++){ var yy = lvTop + 8 + H.rnd(i, 5) * (py + ph - lvTop - 16), th = (1.5 + 8 * f * (0.4 + H.rnd(i, 6))), hh = 6 + H.rnd(i, 7) * 10; ctx.fillRect(ppx - th, yy, th, hh); ctx.fillRect(ppx + ppw, yy, th, hh); } }
      ctx.restore();
      S.draw.line(c, c.W / 2, 12, c.W / 2, py, "#5b6e86", 2);
      S.draw.text(c, "plaque de " + A.s, c.W / 2 + 14, 16, {size: 12.5, color: P.ink, weight: 800, align: "left"});
      /* électrons dans la plaque */
      if (ok && f > 0 && f < 1){ for (i = 0; i < 4; i++){ var u = ((tt * 0.8 + i / 4) % 1); S.draw.dot(c, c.W / 2 + Math.sin(i * 2) * 6, py + ph - 20 - u * (ph - 90), 3.2, "#f4c542"); } }
      /* étiquettes */
      S.draw.label(c, "solution de " + B.ion, bx + 10, lvTop + 18, {color: P.acc, align: "left"});
      if (ok){ S.draw.label(c, "E°(" + B.ion + "/" + B.s + ") = " + S.fmt(B.E, 2) + " V", bx + bw - 10, lvTop + 18, {color: P.green, align: "right"});
        if (f > 0.02){ S.draw.label(c, A.s + " → " + A.ion + " + " + n1 + " e⁻", bx + 10, by + bh - 16, {color: P.red, align: "left"}); S.draw.label(c, B.ion + " + " + n2 + " e⁻ → " + B.s, bx + bw - 10, by + bh - 16, {color: P.green, align: "right"}); } }
      else if (A !== B){ S.draw.text(c, "✕ aucune réaction", c.W / 2, by - 12, {size: 14, color: P.red, weight: 800}); }
      ro.set(0, A === B ? "non (même métal)" : ok ? "oui" : "non"); ro.set(1, S.fmt(B.E - A.E, 2) + " V");
      ro.set(2, ok ? (dm >= 0 ? "+" : "") + S.fmt(dm, 0) + " mg" : "0"); ro.set(3, ok ? S.fmt(nc, 2) + " mmol de " + B.s : "aucun");
      if (A === B) nt.set("Même couple : aucune réaction.", "ok");
      else if (!ok) nt.set(A.s + " est plus noble que " + B.s + " (E° " + S.fmt(A.E, 2) + " V > " + S.fmt(B.E, 2) + " V) : le cation " + B.ion + " n'est pas réduit par " + A.s + ". Aucun dépôt.", "warn");
      else nt.set((a > 1 ? a + " " : "") + A.s + " + " + (b > 1 ? b + " " : "") + B.ion + " → " + (a > 1 ? a + " " : "") + A.ion + " + " + (b > 1 ? b + " " : "") + B.s + "  (" + L + " électron" + (L > 1 ? "s" : "") + " échangé" + (L > 1 ? "s" : "") + ")" + (A.s === "Al" ? ". Dans la réalité, la couche d'oxyde ralentit fortement la réaction." : "."), "ok");
    });
  }
});

/* ---------- équilibreur de demi-équations ---------- */
var CP = [
  {nom: "MnO₄⁻ / Mn²⁺", ox: "MnO₄⁻", rd: "Mn²⁺", a: 1, h: 8, n: 5, b: 1, w: 4, E: 1.51, at: {ox: {Mn: 1, O: 4}, rd: {Mn: 1}, q: [-1, 2]}},
  {nom: "Cr₂O₇²⁻ / Cr³⁺", ox: "Cr₂O₇²⁻", rd: "Cr³⁺", a: 1, h: 14, n: 6, b: 2, w: 7, E: 1.33, at: {ox: {Cr: 2, O: 7}, rd: {Cr: 1}, q: [-2, 3]}},
  {nom: "H₂O₂ / H₂O", ox: "H₂O₂", rd: "H₂O", a: 1, h: 2, n: 2, b: 2, w: 0, E: 1.78, at: {ox: {H: 2, O: 2}, rd: {H: 2, O: 1}, q: [0, 0]}},
  {nom: "O₂ / H₂O", ox: "O₂", rd: "H₂O", a: 1, h: 4, n: 4, b: 2, w: 0, E: 1.23, at: {ox: {O: 2}, rd: {H: 2, O: 1}, q: [0, 0]}},
  {nom: "Cl₂ / Cl⁻", ox: "Cl₂", rd: "Cl⁻", a: 1, h: 0, n: 2, b: 2, w: 0, E: 1.36, at: {ox: {Cl: 2}, rd: {Cl: 1}, q: [0, -1]}},
  {nom: "Ag⁺ / Ag", ox: "Ag⁺", rd: "Ag", a: 1, h: 0, n: 1, b: 1, w: 0, E: 0.80, at: {ox: {Ag: 1}, rd: {Ag: 1}, q: [1, 0]}},
  {nom: "Fe³⁺ / Fe²⁺", ox: "Fe³⁺", rd: "Fe²⁺", a: 1, h: 0, n: 1, b: 1, w: 0, E: 0.77, at: {ox: {Fe: 1}, rd: {Fe: 1}, q: [3, 2]}},
  {nom: "I₂ / I⁻", ox: "I₂", rd: "I⁻", a: 1, h: 0, n: 2, b: 2, w: 0, E: 0.54, at: {ox: {I: 2}, rd: {I: 1}, q: [0, -1]}},
  {nom: "Cu²⁺ / Cu", ox: "Cu²⁺", rd: "Cu", a: 1, h: 0, n: 2, b: 1, w: 0, E: 0.34, at: {ox: {Cu: 1}, rd: {Cu: 1}, q: [2, 0]}},
  {nom: "Sn⁴⁺ / Sn²⁺", ox: "Sn⁴⁺", rd: "Sn²⁺", a: 1, h: 0, n: 2, b: 1, w: 0, E: 0.15, at: {ox: {Sn: 1}, rd: {Sn: 1}, q: [4, 2]}},
  {nom: "S₄O₆²⁻ / S₂O₃²⁻", ox: "S₄O₆²⁻", rd: "S₂O₃²⁻", a: 1, h: 0, n: 2, b: 2, w: 0, E: 0.08, at: {ox: {S: 4, O: 6}, rd: {S: 2, O: 3}, q: [-2, -2]}},
  {nom: "Fe²⁺ / Fe", ox: "Fe²⁺", rd: "Fe", a: 1, h: 0, n: 2, b: 1, w: 0, E: -0.44, at: {ox: {Fe: 1}, rd: {Fe: 1}, q: [2, 0]}},
  {nom: "Zn²⁺ / Zn", ox: "Zn²⁺", rd: "Zn", a: 1, h: 0, n: 2, b: 1, w: 0, E: -0.76, at: {ox: {Zn: 1}, rd: {Zn: 1}, q: [2, 0]}}
];
function term(co, sp){ return (co === 1 ? "" : co + " ") + sp; }
function side(items){ return items.filter(function(x){ return x[0] > 0; }).map(function(x){ return term(x[0], x[1]); }).join(" + "); }
/* équation globale pour deux couples (hi réduit, lo oxydé) et facteurs f1, f2 */
function globale(hi, lo, f1, f2){
  function add(map, sp, k){ map[sp] = (map[sp] || 0) + k; }
  var left = {}, right = {};
  add(left, hi.ox, hi.a * f1); add(left, "H⁺", hi.h * f1); add(right, hi.rd, hi.b * f1); add(right, "H₂O", hi.w * f1);
  add(left, lo.rd, lo.b * f2); add(left, "H₂O", lo.w * f2); add(right, lo.ox, lo.a * f2); add(right, "H⁺", lo.h * f2);
  ["H⁺", "H₂O"].forEach(function(sp){
    var l = left[sp] || 0, r = right[sp] || 0, d = Math.min(l, r); left[sp] = l - d; right[sp] = r - d;
  });
  /* espèces identiques des deux côtés (cas H₂O/H₂O non concerné ici) */
  Object.keys(left).forEach(function(sp){ if (right[sp] !== undefined && sp !== "H⁺" && sp !== "H₂O"){ var d = Math.min(left[sp], right[sp]); left[sp] -= d; right[sp] -= d; } });
  function fmtSide(m){ return Object.keys(m).filter(function(sp){ return m[sp] > 0; }).map(function(sp){ return term(m[sp], sp); }).join(" + "); }
  return fmtSide(left) + " → " + fmtSide(right);
}
SFA.sim({
  id: "c6-c07-demi-equations", ch: "c07", tag: "Défi",
  titre: "Équilibrer une équation d'oxydoréduction",
  resume: "Choisis deux couples : multiplie les demi-équations pour égaliser les électrons, puis lis l'équation globale.",
  but: "Choisis les deux couples. Règle les facteurs f₁ et f₂ : les électrons captés (plateau gauche) doivent égaler les électrons cédés (plateau droit). Quand la balance est à l'équilibre, coche « solution » pour vérifier l'équation globale.",
  aRetenir: "On écrit chaque demi-équation (a Ox + h H⁺ + n e⁻ ⇌ b Red + w H₂O en milieu acide), on multiplie pour avoir le même nombre d'électrons, on additionne, puis on simplifie H⁺ et H₂O. Toujours vérifier : atomes ET charges. Le couple dont E° est le plus élevé fournit l'oxydant qui réagit.",
  piege: "Équilibrer seulement les atomes ne suffit pas : si les charges totales ne sont pas égales des deux côtés, l'équation est fausse. Ne pas oublier non plus les H⁺ et H₂O en milieu acide. Enfin, une réaction prévue par les potentiels standards est possible, mais pas forcément rapide.",
  _data: CP, _fn: function(h, l, f1, f2){ return globale(h, l, f1, f2); },
  build: function(k, S){
    var c = k.canvas(480), P = S.draw.palette, H = window.C6, ang = 0, tt = 0;
    var A = k.select("Couple 1", CP.map(function(p, i){ return [i, p.nom + " (" + S.fmt(p.E, 2) + " V)"]; }), 0);
    var B = k.select("Couple 2", CP.map(function(p, i){ return [i, p.nom + " (" + S.fmt(p.E, 2) + " V)"]; }), 6);
    var f1 = k.slider("Facteur f₁ (couple qui capte)", 1, 12, 1, 1, "");
    var f2 = k.slider("Facteur f₂ (couple qui cède)", 1, 12, 1, 1, "");
    k.button("f₁ + 1", function(){ f1.set(f1.value + 1); }); k.button("f₂ + 1", function(){ f2.set(f2.value + 1); });
    var sol = k.toggle("Afficher l'équation globale", false);
    var ro = k.readouts(["Oxydant qui réagit", "ΔE°", "Électrons captés / cédés"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    function demi(cp, f, red){
      var l = red ? [[f * cp.a, cp.ox], [f * cp.h, "H⁺"], [f * cp.n, "e⁻"]] : [[f * cp.b, cp.rd], [f * cp.w, "H₂O"]];
      var r = red ? [[f * cp.b, cp.rd], [f * cp.w, "H₂O"]] : [[f * cp.a, cp.ox], [f * cp.h, "H⁺"], [f * cp.n, "e⁻"]];
      return side(l) + " → " + side(r);
    }
    function tray(cx, y, n, col, lab){
      var ctx = c.ctx, w = 120; S.draw.line(c, cx - w / 2 + 6, y, cx, y - 46, "#8a95a3", 1.5); S.draw.line(c, cx + w / 2 - 6, y, cx, y - 46, "#8a95a3", 1.5);
      ctx.save(); ctx.fillStyle = "#e6ebf2"; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - w / 2, y); ctx.lineTo(cx + w / 2, y); ctx.quadraticCurveTo(cx + w / 2 - 8, y + 18, cx + w / 2 - 22, y + 18); ctx.lineTo(cx - w / 2 + 22, y + 18); ctx.quadraticCurveTo(cx - w / 2 + 8, y + 18, cx - w / 2, y); ctx.fill(); ctx.stroke(); ctx.restore();
      var perRow = 8, shown = Math.min(n, 48);
      for (var i = 0; i < shown; i++){ var rr = Math.floor(i / perRow), cc = i % perRow, px = cx - (Math.min(perRow, shown - rr * perRow) - 1) * 6.5 + cc * 13, py = y - 8 - rr * 12; S.draw.dot(c, px, py, 5.2, col); S.draw.line(c, px - 2.4, py, px + 2.4, py, "#fff", 1.3); }
      S.draw.text(c, n + " e⁻", cx, y + 36, {size: 14, color: col, weight: 800}); S.draw.text(c, lab, cx, y + 54, {size: 11, color: P.grey});
    }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var a = CP[A.value], b = CP[B.value], ctx = c.ctx;
      if (a === b){ S.draw.text(c, "Choisis deux couples différents.", c.W / 2, c.H / 2, {size: 15, color: P.red}); nt.set("Il faut deux couples différents pour une réaction.", "warn"); ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); return; }
      var hi = a.E > b.E ? a : b, lo = a.E > b.E ? b : a, cap = hi.n * f1.value, ced = lo.n * f2.value, ok = cap === ced;
      /* demi-équations */
      S.draw.panel(c, 10, 8, c.W - 20, 118, {shadow: false});
      var yy = 22; S.draw.text(c, "CAPTE · réduction de " + hi.ox, 20, yy, {size: 11, color: P.acc, weight: 800, align: "left"}); yy += 18;
      var n1 = H.wrap(c, "× " + f1.value + " :  " + demi(hi, f1.value, true), 20, yy + 2, c.W - 44, {size: 14, math: true, align: "left", color: P.acc});
      yy += n1 * 18 + 10; S.draw.text(c, "CÈDE · oxydation de " + lo.rd, 20, yy, {size: 11, color: P.amber, weight: 800, align: "left"}); yy += 18;
      H.wrap(c, "× " + f2.value + " :  " + demi(lo, f2.value, false), 20, yy + 2, c.W - 44, {size: 14, math: true, align: "left", color: P.amber});
      /* balance */
      var px = c.W / 2, py = 230, L = Math.min(c.W - 130, 300), target = Math.max(-0.28, Math.min(0.28, 0.035 * (ced - cap)));
      ang += (target - ang) * 0.14; if (Math.abs(ang - target) < 0.0005) ang = target;
      S.draw.line(c, px, py, px, py + 100, "#8a95a3", 5); S.draw.rrect(c, px - 34, py + 98, 68, 10, 4); ctx.fillStyle = "#8a95a3"; ctx.fill();
      var lx = px - Math.cos(ang) * L / 2, ly = py - Math.sin(ang) * L / 2, rx = px + Math.cos(ang) * L / 2, ry = py + Math.sin(ang) * L / 2;
      S.draw.line(c, lx, ly, rx, ry, ok ? P.green : "#56627a", 6); S.draw.dot(c, px, py, 8, ok ? P.green : "#56627a");
      tray(lx, ly + 52, cap, P.acc, "captés"); tray(rx, ry + 52, ced, P.amber, "cédés");
      if (ok) S.draw.glow(c, px, py, 70, P.green, 0.5);
      S.draw.text(c, ok ? "✔ électrons égaux" : cap > ced ? "trop d'électrons captés → augmente f₂" : "trop d'électrons cédés → augmente f₁", c.W / 2, 372, {size: 13, color: ok ? P.green : P.red, weight: 800});
      /* équation globale */
      S.draw.panel(c, 10, 388, c.W - 20, 84, {shadow: false, fill: ok ? "#eef8f2" : "rgba(255,255,255,.96)", stroke: ok ? P.green : "#e3e7ed"});
      if (ok){ S.draw.text(c, "ÉQUATION GLOBALE", 20, 402, {size: 10, color: P.grey, align: "left", weight: 800}); if (sol.value) H.wrap(c, globale(hi, lo, f1.value, f2.value), c.W / 2, 428, c.W - 40, {size: 14, math: true, color: P.ink}); else S.draw.text(c, "(masquée : coche « Afficher l'équation globale »)", c.W / 2, 432, {size: 12, color: P.grey}); }
      else S.draw.text(c, "Égalise les électrons pour additionner les deux demi-équations.", c.W / 2, 430, {size: 12.5, color: P.grey, weight: 700});
      ro.set(0, hi.ox); ro.set(1, S.fmt(hi.E - lo.E, 2) + " V"); ro.set(2, cap + " / " + ced);
      var Lc = hi.n * lo.n / gcd(hi.n, lo.n);
      nt.set(ok ? ((f1.value === Lc / hi.n && f2.value === Lc / lo.n) ? "Facteurs minimaux (" + Lc + " électrons échangés)." : "Électrons égaux, mais les facteurs ne sont pas minimaux (le plus petit commun multiple est " + Lc + ").") : "Pas encore : il faut " + hi.n + " × f₁ = " + lo.n + " × f₂.", ok ? "ok" : "warn");
    });
  }
});

/* ---------- nombres d'oxydation ---------- */
var ESP = [
  {f: "MnO₄⁻", q: -1, at: [["Mn", 1, null], ["O", 4, -2]], rep: 7},
  {f: "Cr₂O₇²⁻", q: -2, at: [["Cr", 2, null], ["O", 7, -2]], rep: 6},
  {f: "H₂SO₄", q: 0, at: [["H", 2, 1], ["S", 1, null], ["O", 4, -2]], rep: 6},
  {f: "ClO₄⁻", q: -1, at: [["Cl", 1, null], ["O", 4, -2]], rep: 7},
  {f: "HNO₃", q: 0, at: [["H", 1, 1], ["N", 1, null], ["O", 3, -2]], rep: 5},
  {f: "NH₃", q: 0, at: [["N", 1, null], ["H", 3, 1]], rep: -3},
  {f: "CO₂", q: 0, at: [["C", 1, null], ["O", 2, -2]], rep: 4},
  {f: "CH₄", q: 0, at: [["C", 1, null], ["H", 4, 1]], rep: -4},
  {f: "Fe₂O₃", q: 0, at: [["Fe", 2, null], ["O", 3, -2]], rep: 3},
  {f: "H₂O₂", q: 0, at: [["H", 2, 1], ["O", 2, null]], rep: -1},
  {f: "NaH", q: 0, at: [["Na", 1, 1], ["H", 1, null]], rep: -1},
  {f: "S₄O₆²⁻", q: -2, at: [["S", 4, null], ["O", 6, -2]], rep: 2.5, moy: true},
  {f: "CH₃CH₂OH (éthanol)", q: 0, at: [["C", 2, null], ["H", 6, 1], ["O", 1, -2]], rep: -2, moy: true},
  {f: "CH₃CHO (éthanal)", q: 0, at: [["C", 2, null], ["H", 4, 1], ["O", 1, -2]], rep: -1, moy: true},
  {f: "CH₃COOH (acide éthanoïque)", q: 0, at: [["C", 2, null], ["H", 4, 1], ["O", 2, -2]], rep: 0, moy: true},
  {f: "Cl₂", q: 0, at: [["Cl", 2, null]], rep: 0}
];
SFA.sim({
  id: "c6-c07-nombre-oxydation", ch: "c07", tag: "Défi",
  titre: "Trouve le nombre d'oxydation",
  resume: "Règle le n.o. de l'atome inconnu jusqu'à ce que la somme des n.o. égale la charge de l'espèce.",
  but: "Choisis une espèce, puis règle le n.o. de l'atome marqué « ? » (curseur, boutons ou clic sur la boule dorée : moitié haute = +1, moitié basse = −1). Quand la somme est égale à la charge, la balance se met à l'équilibre. Essaie les carbones de l'éthanol, de l'éthanal et de l'acide éthanoïque.",
  aRetenir: "Règles : somme des n.o. = charge de l'espèce ; O = −2 (sauf peroxydes : −1) ; H = +1 (sauf hydrures : −1) ; corps simple : 0. Une oxydation fait augmenter le n.o., une réduction le fait diminuer. Pour la série éthanol → éthanal → acide éthanoïque, le n.o. moyen du carbone passe de −2 à −1 puis à 0 : deux oxydations successives (2 électrons cédés par molécule à chaque étape).",
  piege: "Le n.o. n'est pas la charge réelle : dans CO₂, le carbone n'a pas une charge de +4. Un n.o. moyen peut être fractionnaire (S₄O₆²⁻ : +2,5) ; il décrit alors une moyenne sur les atomes équivalents.",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette, H = window.C6, tt = 0;
    var es = k.select("Espèce", ESP.map(function(e, i){ return [i, e.f]; }), 0);
    var g = k.slider("n.o. de l'atome « ? »", -4, 8, 0.5, 0, "");
    k.button("n.o. −1", function(){ g.set(g.value - 1); }); k.button("n.o. +1", function(){ g.set(g.value + 1); });
    var ro = k.readouts(["Σ des n.o.", "Charge de l'espèce", "Verdict"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    var geo = {};
    c.pointer(function(type, p){ if (type !== "down" || !geo.ux) return; if (Math.hypot(p.x - geo.ux, p.y - geo.uy) < 32){ g.set(g.value + (p.y < geo.uy ? 1 : -1)); k.redraw(); } });
    var EN = {Mn: "Mn", Cr: "Cr", Cl: "Cl"};
    var COLS = {O: "#d9382b", H: "#f4f6fa", N: "#3b6fd6", C: "#4a5568", S: "#d9b92b", Cl: "#3aa860", Na: "#8a5cd6", Mn: "#8e3fa8", Cr: "#2f9aa0", Fe: "#b06a3a"};
    function sg(v){ return (v > 0 ? "+" : v < 0 ? "−" : "") + S.fmt(Math.abs(v), 1); }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var e = ESP[es.value], ctx = c.ctx, i, j, tot = 0, ok;
      var nG = e.at.length, cw = (c.W - 24) / nG, y0 = 150;
      S.draw.text(c, e.f, c.W / 2, 26, {size: 20, math: true, color: P.ink});
      for (i = 0; i < nG; i++){
        var a = e.at[i], unk = a[2] === null, no = unk ? g.value : a[2], cx = 12 + cw * (i + 0.5), cnt = a[1], r = unk ? 24 : (a[0] === "H" ? 14 : 19);
        tot += cnt * no;
        /* grappe d'atomes identiques */
        var perRow = cnt > 4 ? 3 : 2, rows = Math.ceil(cnt / perRow), gapx = r * 2 + 4, gapy = r * 1.85;
        if (unk) cnt = Math.max(1, cnt);
        for (j = 0; j < cnt; j++){
          var rr = Math.floor(j / perRow), cc2 = j % perRow, inRow = Math.min(perRow, cnt - rr * perRow);
          var bx = cx + (cc2 - (inRow - 1) / 2) * gapx, by = y0 + (rr - (rows - 1) / 2) * gapy;
          if (unk){ S.draw.glow(c, bx, by, 44 + 5 * Math.sin(tt * 4), "#f4c542", 0.6); geo.ux = bx; geo.uy = by; }
          H.ball(c, bx, by, r, COLS[a[0]] || "#8a95a3", a[0], {size: r * 0.85, color: a[0] === "H" ? P.ink : "#fff"});
        }
        /* pastille n.o. au-dessus */
        var py = y0 - rows * gapy / 2 - 30, col = no > 0 ? P.red : no < 0 ? P.acc : P.grey;
        ctx.save(); S.draw.rrect(c, cx - 30, py - 14, 60, 28, 14); ctx.fillStyle = unk ? "#fff6d6" : "#fff"; ctx.fill(); ctx.strokeStyle = unk ? P.amber : col; ctx.lineWidth = unk ? 2.4 : 1.6; ctx.stroke(); ctx.restore();
        S.draw.text(c, unk ? "?  " + sg(no) : sg(no), cx, py, {size: 15, color: col, weight: 800});
        /* sous-total */
        var sy = y0 + rows * gapy / 2 + 26;
        S.draw.text(c, "× " + a[1] + " = " + sg(a[1] * no), cx, sy, {size: 13, color: P.ink, weight: 700});
      }
      /* balance : droite graduée de la somme */
      var lo = -12, hi = 16, rx0 = 30, rx1 = c.W - 30, ry = 300, X = function(v){ return rx0 + (rx1 - rx0) * (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo); };
      ok = Math.abs(tot - e.q) < 1e-9;
      ctx.save(); S.draw.rrect(c, rx0, ry - 5, rx1 - rx0, 10, 5); ctx.fillStyle = "#dfe5ee"; ctx.fill(); ctx.restore();
      for (i = lo; i <= hi; i += 4){ S.draw.line(c, X(i), ry + 7, X(i), ry + 12, P.grey, 1.4); S.draw.text(c, i > 0 ? "+" + i : i === 0 ? "0" : "−" + Math.abs(i), X(i), ry + 24, {size: 10.5, color: P.grey}); }
      S.draw.line(c, X(e.q), ry - 16, X(e.q), ry + 6, P.green, 3); S.draw.label(c, "charge " + sg(e.q).replace(/^\+?0,0$/, "0"), X(e.q), ry - 28, {color: P.green, size: 11});
      var sx = X(tot); S.draw.dot(c, sx, ry, 10, ok ? P.green : "#fff"); S.draw.dot(c, sx, ry, 6.5, ok ? "#fff" : P.red);
      if (!ok) S.draw.line(c, sx, ry, X(e.q), ry, "rgba(192,50,29,.35)", 4);
      S.draw.text(c, "Σ = " + sg(tot), sx, ry + 44, {size: 14, color: ok ? P.green : P.red, weight: 800});
      S.draw.text(c, ok ? "✔ équilibre : Σ = charge" : tot < e.q ? "trop bas : augmente le n.o." : "trop haut : diminue le n.o.", c.W / 2, 386, {size: 13, color: ok ? P.green : P.amber, weight: 800});
      ro.set(0, S.fmt(tot, 1)); ro.set(1, S.fmt(e.q, 0)); ro.set(2, ok ? "juste" : (tot < e.q ? "trop bas" : "trop haut"));
      nt.set(ok ? "Juste : le n.o. de « ? » vaut " + (e.rep > 0 ? "+" : "") + S.fmt(e.rep, 1) + (e.moy ? " (n.o. moyen)." : ".") : "Ajuste le curseur : la somme doit valoir " + S.fmt(e.q, 0) + ".", ok ? "ok" : "warn");
    });
  }
});

/* ---------- rouille ---------- */
/* refonte 21/11/2026 : vrai clou couché dans un bécher, taches de rouille qui apparaissent, zoom 3D sur le réseau du fer */
function shadeF(hex,f){ var m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); if(!m) return hex; var v=[1,2,3].map(function(i){ var x=parseInt(m[i],16); x=f<0?x*(1+f):x+(255-x)*f; return Math.max(0,Math.min(255,Math.round(x))); }); return "rgb("+v.join(",")+")"; }
function ballF(g,x,y,r,hex,al){ if(!(r>0)||!isFinite(x)||!isFinite(y)) return; g.save(); if(al!=null) g.globalAlpha=al; var gr=g.createRadialGradient(x-r*.38,y-r*.42,r*.05,x,y,r*1.05); gr.addColorStop(0,shadeF(hex,.75)); gr.addColorStop(.45,hex); gr.addColorStop(1,shadeF(hex,-.45)); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,6.2832); g.fill(); g.restore(); }
function rot3F(p,a,b){ var x=p[0]*Math.cos(a)+p[2]*Math.sin(a), z=-p[0]*Math.sin(a)+p[2]*Math.cos(a), y=p[1]; return [x,y*Math.cos(b)-z*Math.sin(b),y*Math.sin(b)+z*Math.cos(b)]; }
function proj3F(p,st,sc,cx,cy){ var r=rot3F(p,st.a,st.b), s=1/(1-r[2]*0.1); return {x:cx+r[0]*sc*s, y:cy-r[1]*sc*s, z:r[2], s:s}; }
/* réseau cubique centré du fer (3 × 3 × 2 mailles) ; surf = atome de la face du dessus, au contact de l'eau */
var FE3 = (function(){ var A = [], i, j, k2;
  for (i = 0; i <= 3; i++) for (j = 0; j <= 2; j++) for (k2 = 0; k2 <= 3; k2++) A.push([i-1.5, j-1, k2-1.5]);
  for (i = 0; i < 3; i++) for (j = 0; j < 2; j++) for (k2 = 0; k2 < 3; k2++) A.push([i-1, j-0.5, k2-1]);
  return A.map(function(p, n){ return {p:p, surf:p[1] >= 0.99, th:((n*0.618)%1)*0.8+0.05}; }); })();
SFA.sim({
  id: "c6-c07-rouille", ch: "c07", tag: "Original",
  titre: "La rouille d'un clou : eau, air, sel, contact",
  resume: "Quelles conditions font rouiller le fer ? Un vrai clou dans un bécher : seul, dans l'eau salée, au contact du cuivre, du zinc ou du magnésium. La rouille apparaît au fil des jours.",
  but: "Active ou non l'eau, l'oxygène, le sel, puis choisis un métal au contact. Fais passer les jours : les taches de rouille apparaissent et la rouille se dépose au fond (indice qualitatif). En bleu, le fer s'oxyde (indicateur ferroxyle) ; en rose, les ions OH⁻ se forment. En haut à droite, glisse pour faire tourner le réseau d'atomes de fer.",
  aRetenir: "Il faut du fer, de l'eau et du dioxygène : à l'anode, Fe → Fe²⁺ + 2 e⁻ ; à la cathode, O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻. Le sel rend la solution plus conductrice et accélère la corrosion. Au contact d'un métal moins noble (zinc), c'est ce métal qui s'oxyde à la place du fer, qui est protégé ; au contact d'un métal plus noble (cuivre), le fer est sacrifié et rouille plus vite.",
  piege: "Modèle qualitatif : l'indice de corrosion n'est pas une mesure, seulement un classement relatif (0 à 10). L'eau seule sans dioxygène (eau bouillie sous huile) ne fait pas rouiller le fer, et l'air sec non plus.",
  build: function(k, S){
    var c = k.canvas(0, {ratio:0.95}), P = S.draw.palette, H = window.C6, tt = 0, go = false, view = {a:0.6, b:0.45, drag:false}, box3 = null;
    Object.defineProperty(c, "ratio", {get:function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; return w < 460 ? 1.3 : 0.95; }, configurable:true}); c.resize();
    var tw = k.toggle("Eau liquide", true), to = k.toggle("Dioxygène (air dissous)", true), ts = k.toggle("Sel (NaCl)", false);
    var ct = k.seg("Métal au contact du clou", [["0", "Aucun"], ["cu", "Cuivre"], ["zn", "Zinc"], ["mg", "Magnésium"]], "0");
    var jr = k.slider("Durée", 0, 60, 1, 20, "jours");
    var lp = k.loop(function(dt, t){ tt = t; if (go){ var v = jr.value+dt*9; if (v >= 60){ v = 60; go = false; } jr.set(v); } if (!view.drag) view.a += dt*0.35; k.redraw(); }); lp.play();
    k.button("▶ Faire passer les jours", function(){ jr.set(0); go = true; }, true);
    var ro = k.readouts(["Indice de corrosion (0–10)", "Quantité de rouille", "Qui s'oxyde ?"]);
    var nt = k.note("", "ok");
    c.pointer(function(type, p){
      if (type === "down" && box3 && p.x > box3.x && p.x < box3.x+box3.w && p.y > box3.y && p.y < box3.y+box3.h){ view.drag = true; view.lx = p.x; view.ly = p.y; }
      else if (type === "drag" && view.drag){ view.a += (p.x-view.lx)*0.012; view.b = Math.max(-1.2, Math.min(1.3, view.b+(p.y-view.ly)*0.012)); view.lx = p.x; view.ly = p.y; }
      else if (type === "up") view.drag = false;
    });
    /* taches de rouille : position le long du clou (u), côté (v), seuil d'apparition ; plus nombreuses près de la tête et de la pointe */
    var SP = []; (function(){ for (var i = 0; i < 46; i++){ var r1 = H.rnd(i, 7), u = i%3 === 0 ? r1*0.18 : i%3 === 1 ? 0.82+r1*0.18 : r1; SP.push({u:u, v:H.rnd(i, 8)*2-1, th:H.rnd(i, 9)*0.75, s:0.6+H.rnd(i, 10)*0.9, k:i}); } })();
    function blob(ctx, x, y, r, seed){ ctx.beginPath(); for (var j = 0; j <= 8; j++){ var a = j/8*6.2832, rr = r*(0.7+0.45*H.rnd(seed, j)); j ? ctx.lineTo(x+Math.cos(a)*rr, y+Math.sin(a)*rr*0.8) : ctx.moveTo(x+Math.cos(a)*rr, y+Math.sin(a)*rr*0.8); } ctx.closePath(); }
    k.draw(function(){
      var W = c.W, Hc = c.H, ctx = c.ctx, ph1 = W < 460, i;
      c.clear();
      /* modèle (inchangé) */
      var idx = 0, ox = "le fer (Fe → Fe²⁺)", wet = tw.value, air = to.value;
      if (wet && air){
        idx = 2+(ts.value ? 4 : 0);
        if (ct.value === "cu") idx = Math.min(10, idx*1.6);
        if (ct.value === "zn" || ct.value === "mg"){ idx = 0.1; ox = ct.value === "zn" ? "le zinc (Zn → Zn²⁺) : le fer est protégé" : "le magnésium (Mg → Mg²⁺) : le fer est protégé"; }
      } else ox = "rien : il manque eau ou dioxygène";
      var rust = (wet && air) ? 1-Math.exp(-idx*jr.value/30) : 0, prot = ct.value === "zn" || ct.value === "mg", corr = wet && air && !prot;
      /* décor : mur carrelé + paillasse */
      var benchY = Hc*0.9, gw = ctx.createLinearGradient(0, 0, 0, benchY); gw.addColorStop(0, "#f1f4f8"); gw.addColorStop(1, "#dfe6ee"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, benchY);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; for (var yy = 20; yy < benchY; yy += 28){ ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); } for (var xx = 14; xx < W; xx += 36){ ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, benchY); ctx.stroke(); } ctx.restore();
      var gbn = ctx.createLinearGradient(0, benchY, 0, Hc); gbn.addColorStop(0, "#4a5566"); gbn.addColorStop(1, "#2b323d"); ctx.fillStyle = gbn; ctx.fillRect(0, benchY, W, Hc-benchY);
      /* bécher */
      var bx = W*0.06, bw = W*0.88, by = Hc*(ph1 ? 0.44 : 0.42), bh = benchY-by-2, lvl = 0.8, top = by+bh-(bh-6)*lvl;
      var wcol = rust > 0.05 && corr ? [Math.round(214-15*rust), Math.round(230-30*rust), Math.round(244-60*rust)] : ts.value ? [200, 225, 240] : [214, 232, 246];
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.25)"; ctx.beginPath(); ctx.ellipse(bx+bw/2, benchY, bw*0.52, 5, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      if (wet) H.glass(c, "beaker", bx, by, bw, bh, {level:lvl, color:wcol, alpha:0.55, shine:true});
      else H.glass(c, "beaker", bx, by, bw, bh, {level:0, shine:true});
      /* couche d'huile quand il n'y a pas de dioxygène (eau bouillie sous huile) */
      if (wet && !air){ ctx.save(); var go2 = ctx.createLinearGradient(0, top-10, 0, top+4); go2.addColorStop(0, "rgba(232,190,60,.75)"); go2.addColorStop(1, "rgba(214,160,30,.85)"); ctx.fillStyle = go2; ctx.fillRect(bx+1, top-10, bw-2, 12); ctx.restore(); S.draw.label(c, "eau bouillie + huile (pas d'O₂)", bx+bw/2, top-22, {color:"#8a5a00", size:11}); }
      /* clou couché au fond */
      var nl = bw*0.72, nx0 = bx+bw*0.12, ny = by+bh-30, nr = Math.max(9, Math.min(15, bw*0.03)), hx = nx0, tipx = nx0+nl;
      /* dépôt de rouille au fond */
      if (corr && rust > 0.08){ ctx.save(); ctx.fillStyle = "rgba(150,64,18,"+Math.min(0.85, rust).toFixed(2)+")"; for (i = 0; i < 24; i++){ var sx0 = bx+12+H.rnd(i, 21)*(bw-24); if (H.rnd(i, 22) > rust+0.15) continue; blob(ctx, sx0, by+bh-4, 3+H.rnd(i, 23)*6*rust, i+90); ctx.fill(); } ctx.restore(); }
      /* halos de l'indicateur ferroxyle */
      if (corr){ var ia = Math.min(1, idx/8)*Math.min(1, 0.25+jr.value/25);
        S.draw.glow(c, hx+6, ny, 50, "#2f5fd0", 0.5*ia); S.draw.glow(c, tipx, ny, 50, "#2f5fd0", 0.55*ia);
        for (i = 1; i <= 3; i++) S.draw.glow(c, nx0+nl*i/4, ny-6, 46, "#e0509c", 0.3*ia);
        if (ia > 0.1){ S.draw.label(c, "Fe²⁺ (bleu)", tipx-8, ny-62, {color:"#2f5fd0", size:11, align:"right"}); S.draw.label(c, "OH⁻ (rose)", nx0+nl*0.76, ny-38, {color:"#c43a7a", size:11}); } }
      if (prot && wet && air){ for (i = 1; i <= 3; i++) S.draw.glow(c, nx0+nl*i/4, ny-4, 46, "#e0509c", 0.32); }
      ctx.save();
      /* tige (dégradé cylindrique), stries sous la tête, pointe, tête */
      var gn = ctx.createLinearGradient(0, ny-nr, 0, ny+nr); gn.addColorStop(0, "#8d97a3"); gn.addColorStop(0.35, "#eef1f4"); gn.addColorStop(0.6, "#aab3bd"); gn.addColorStop(1, "#5d6772");
      function shank(){ ctx.beginPath(); ctx.moveTo(hx+4, ny-nr*0.62); ctx.lineTo(tipx-nr*2.4, ny-nr*0.62); ctx.lineTo(tipx, ny+nr*0.05); ctx.lineTo(tipx-nr*2.4, ny+nr*0.62); ctx.lineTo(hx+4, ny+nr*0.62); ctx.closePath(); }
      shank(); ctx.fillStyle = gn; ctx.fill();
      ctx.save(); shank(); ctx.clip();
      ctx.strokeStyle = "rgba(60,68,80,.45)"; ctx.lineWidth = 1; for (i = 0; i < 7; i++){ ctx.beginPath(); ctx.moveTo(hx+10+i*4, ny-nr*0.62); ctx.lineTo(hx+6+i*4, ny+nr*0.62); ctx.stroke(); }
      if (rust > 0){ ctx.fillStyle = "rgba(140,60,20,"+(0.55*rust).toFixed(2)+")"; ctx.fillRect(hx, ny-nr, nl, nr*2); }
      SP.forEach(function(sp){ var a = Math.max(0, Math.min(1, (rust-sp.th)/0.2)); if (a <= 0) return; var x = hx+8+sp.u*(nl-14), y = ny+sp.v*nr*0.45, r = nr*sp.s*(0.35+0.65*a); ctx.fillStyle = "rgba("+(150+H.rnd(sp.k, 3)*40|0)+","+(62+H.rnd(sp.k, 4)*30|0)+",18,"+(0.85*a).toFixed(2)+")"; blob(ctx, x, y, r, sp.k); ctx.fill(); if (a > 0.6){ ctx.fillStyle = "rgba(95,38,10,.45)"; blob(ctx, x+r*0.15, y+r*0.1, r*0.45, sp.k+50); ctx.fill(); } });
      ctx.restore();
      shank(); ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.lineWidth = 1.2; ctx.stroke();
      var gh = ctx.createLinearGradient(hx-4, 0, hx+5, 0); gh.addColorStop(0, "#7b8592"); gh.addColorStop(0.5, "#e6eaee"); gh.addColorStop(1, "#8d97a3");
      ctx.fillStyle = gh; ctx.beginPath(); ctx.ellipse(hx, ny, 5, nr*1.7, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
      if (rust > 0.2){ ctx.fillStyle = "rgba(140,60,20,"+(0.7*rust).toFixed(2)+")"; ctx.beginPath(); ctx.ellipse(hx, ny, 5, nr*1.7, 0, 0, 6.2832); ctx.fill(); }
      ctx.restore();
      S.draw.label(c, "clou en fer", hx-4, ny-nr*1.7-30, {size:11, color:"#4b586a", align:"left"});
      /* métal au contact : fil de cuivre enroulé ou ruban de zinc / magnésium */
      if (ct.value !== "0"){
        var mx = nx0+nl*0.42, cw = nl*0.16;
        if (ct.value === "cu"){ ctx.save(); ctx.lineWidth = 2.6; ctx.lineCap = "round"; for (i = 0; i < 9; i++){ var x1 = mx+i*cw/9; ctx.strokeStyle = "#8a4a22"; ctx.beginPath(); ctx.moveTo(x1+cw/18, ny-nr*0.72); ctx.lineTo(x1, ny+nr*0.72); ctx.stroke(); ctx.strokeStyle = "#e09060"; ctx.beginPath(); ctx.moveTo(x1, ny+nr*0.72); ctx.lineTo(x1+cw/9, ny-nr*0.72); ctx.stroke(); } ctx.restore(); }
        else {
          var dep = 1-Math.exp(-jr.value/40), base = ct.value === "zn" ? "#9aa5b1" : "#c7ccd2", gz = ctx.createLinearGradient(0, ny-nr, 0, ny+nr); gz.addColorStop(0, shadeF(base, -0.2)); gz.addColorStop(0.4, shadeF(base, 0.5)); gz.addColorStop(1, shadeF(base, -0.35));
          var th2 = nr*(1.05-0.25*(wet && air ? dep : 0)); ctx.save(); ctx.fillStyle = gz; S.draw.rrect(c, mx, ny-th2, cw, th2*2, 3); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1; ctx.stroke();
          if (wet && air){ ctx.fillStyle = "rgba(255,255,255,"+(0.75*dep).toFixed(2)+")"; for (i = 0; i < 12; i++){ blob(ctx, mx+3+H.rnd(i, 31)*(cw-6), ny+(H.rnd(i, 32)-0.5)*th2*1.6, 2+H.rnd(i, 33)*3*dep, i+200); ctx.fill(); } }
          ctx.restore();
          if (wet && air && ct.value === "mg") for (i = 0; i < 6; i++){ var v2 = (tt*0.45+i/6)%1; ctx.strokeStyle = "rgba(255,255,255,"+(0.9*(1-v2)).toFixed(2)+")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx+cw*(0.2+0.12*i), ny-th2-v2*(ny-th2-top-6), 2.2, 0, 6.2832); ctx.stroke(); }
          if (wet && air){ for (i = 0; i < 5; i++){ var w2 = (tt*0.6+i/5)%1, ex = mx-w2*(mx-hx-20); S.draw.dot(c, ex, ny+nr*0.1, 2.6, "#f4c542"); } S.draw.label(c, "e⁻ → fer", (hx+mx)/2+12, ny-nr-16, {color:P.amber, size:10.5}); }
        }
        S.draw.label(c, {cu:"fil de Cu", zn:"ruban de Zn", mg:"ruban de Mg"}[ct.value], mx+cw/2, ny-nr-16, {color:P.ink, size:10.5});
      }
      /* particules dans l'eau : O₂ dissous, ions du sel, flocons de rouille qui tombent */
      if (wet){
        if (air) for (i = 0; i < 14; i++){ var p = H.wander(i, tt, 0.6), ox2 = bx+14+p[0]*(bw-28), oy = top+12+p[1]*(ny-nr*2-top-24); ballF(ctx, ox2-4, oy, 4.2, "#d9382b"); ballF(ctx, ox2+4, oy, 4.2, "#d9382b"); }
        if (ts.value) for (i = 0; i < 14; i++){ var q = H.wander(50+i, tt, 0.5), sx = bx+14+q[0]*(bw-28), sy = top+12+q[1]*(by+bh-top-24); ballF(ctx, sx, sy, i%2 ? 3.6 : 4.4, i%2 ? "#8a5cd6" : "#3aa860"); }
        if (corr && rust > 0.1) for (i = 0; i < Math.round(10*rust); i++){ var u2 = (tt*0.18+H.rnd(i, 41))%1; blob(ctx, nx0+H.rnd(i, 42)*nl, ny+nr+u2*(by+bh-ny-nr-6), 2.2, i+300); ctx.fillStyle = "rgba(150,64,18,"+(0.8*(1-u2*0.5)).toFixed(2)+")"; ctx.fill(); }
      }
      S.draw.label(c, wet ? (air ? "eau aérée" : "eau sans O₂") + (ts.value ? " + sel" : "") : "air sec, sans eau", bx+12, by+14, {color:P.acc, align:"left", size:11});
      /* calendrier (jours) + légende */
      S.draw.display(c, "J "+Math.round(jr.value), 16+(ph1 ? 38 : 48), 30, {w:ph1 ? 76 : 96, h:ph1 ? 36 : 42, caption:"JOURS ÉCOULÉS", size:ph1 ? 15 : 18});
      S.draw.legend(c, [["#d9382b", "O₂ dissous"]].concat(ts.value ? [["#8a5cd6", "Na⁺ / Cl⁻"]] : []).concat(corr && rust > 0.05 ? [["#96401a", "rouille Fe₂O₃·nH₂O"]] : []), 12, ph1 ? 58 : 62, {});
      /* zoom 3D : réseau cubique centré du fer, la surface s'oxyde */
      var iw = Math.min(ph1 ? 170 : 210, W*0.46), ih = Math.min(by-16, iw*0.92), ix = W-iw-10, iy = 8; box3 = {x:ix, y:iy, w:iw, h:ih};
      S.draw.panel(c, ix, iy, iw, ih, {title:"À l'échelle des atomes", fill:"rgba(20,28,40,.94)", stroke:"#2c3a4e", titleColor:"#c9d3df"});
      var sc3 = Math.min(iw, ih)*0.14, cx3 = ix+iw/2, cy3 = iy+ih*0.58, items = [];
      FE3.forEach(function(a2){ var pp = proj3F(a2.p, view, sc3, cx3, cy3), gone = corr && a2.surf && rust > a2.th; items.push({x:pp.x, y:pp.y, z:pp.z, r:sc3*0.27*pp.s, col:gone ? "#b5531c" : "#9aa3ad", al:gone ? 0.9 : 1});
        if (gone && a2.th < rust-0.05){ var ph3 = (tt*0.35+a2.th*3)%1, up = proj3F([a2.p[0], a2.p[1]+0.4+ph3*1.4, a2.p[2]], view, sc3, cx3, cy3); items.push({x:up.x, y:up.y, z:up.z, r:sc3*0.2*up.s, col:"#3f7fe0", al:1-ph3, ion:true}); } });
      if (wet && air) for (i = 0; i < 4; i++){ var w3 = H.wander(70+i, tt, 0.5), cp = [(w3[0]-0.5)*3, 1.6+w3[1]*0.8, (H.rnd(i, 5)-0.5)*3], ax3 = [Math.cos(tt+i)*0.2, 0, Math.sin(tt+i)*0.2], q1 = proj3F([cp[0]+ax3[0], cp[1], cp[2]+ax3[2]], view, sc3, cx3, cy3), q2 = proj3F([cp[0]-ax3[0], cp[1], cp[2]-ax3[2]], view, sc3, cx3, cy3); items.push({x:q1.x, y:q1.y, z:q1.z, r:sc3*0.17*q1.s, col:"#e0453a", al:1}); items.push({x:q2.x, y:q2.y, z:q2.z, r:sc3*0.17*q2.s, col:"#e0453a", al:1}); }
      ctx.save(); ctx.beginPath(); ctx.rect(ix+2, iy+22, iw-4, ih-24); ctx.clip();
      items.sort(function(a, b){ return a.z-b.z; }).forEach(function(it){ ballF(ctx, it.x, it.y, it.r, it.col, it.al); });
      ctx.restore();
      S.draw.text(c, prot && wet && air ? "fer protégé : "+(ct.value === "zn" ? "Zn" : "Mg")+" s'oxyde à sa place" : corr ? "surface : Fe → Fe²⁺ (bleu) + 2 e⁻" : "pas de réaction", cx3, iy+ih-11, {size:ph1 ? 9.5 : 10.5, color:"#dfe7f2", weight:700});
      S.draw.text(c, "↻", ix+iw-12, iy+12, {size:12, color:"#c9d3df"});
      ro.set(0, S.fmt(idx, 1)); ro.set(1, S.fmt(rust*100, 0)+" %"); ro.set(2, ox);
      nt.set((idx === 0 && !(wet && air) ? "Sans eau liquide ou sans dioxygène : pas de corrosion." : prot ? "Protection cathodique : le métal moins noble est consommé, le clou reste intact." : ct.value === "cu" ? "Le fer est moins noble que le cuivre : il s'oxyde plus vite au contact du cuivre." : ts.value ? "L'eau salée conduit mieux : la corrosion est nettement plus rapide." : "Eau aérée : corrosion lente.")+"<br>Anode : Fe → Fe²⁺ + 2 e⁻ · cathode : O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻ · bilan : 2 Fe + O₂ + 2 H₂O → 2 Fe(OH)₂, puis oxydation en rouille (Fe₂O₃·nH₂O).", "ok");
    });
  }
});
})();
