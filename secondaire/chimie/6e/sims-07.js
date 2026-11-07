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
SFA.sim({
  id: "c6-c07-rouille", ch: "c07", tag: "Original",
  titre: "La rouille d'un clou : eau, air, sel, contact",
  resume: "Quelles conditions font rouiller le fer ? Compare un clou seul, dans l'eau salée, au contact du cuivre ou du zinc.",
  but: "Active ou non l'eau, l'oxygène, le sel, puis choisis un métal au contact. Fais passer les jours et suis la quantité de rouille (indice qualitatif) : en bleu, le fer s'oxyde (indicateur ferroxyle) ; en rose, les ions OH⁻ se forment.",
  aRetenir: "Il faut du fer, de l'eau et du dioxygène : à l'anode, Fe → Fe²⁺ + 2 e⁻ ; à la cathode, O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻. Le sel rend la solution plus conductrice et accélère la corrosion. Au contact d'un métal moins noble (zinc), c'est ce métal qui s'oxyde à la place du fer, qui est protégé ; au contact d'un métal plus noble (cuivre), le fer est sacrifié et rouille plus vite.",
  piege: "Modèle qualitatif : l'indice de corrosion n'est pas une mesure, seulement un classement relatif (0 à 10). L'eau seule sans dioxygène (eau bouillie sous huile) ne fait pas rouiller le fer, et l'air sec non plus.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, H = window.C6, tt = 0, go = false;
    var tw = k.toggle("Eau liquide", true), to = k.toggle("Dioxygène (air dissous)", true), ts = k.toggle("Sel (NaCl)", false);
    var ct = k.seg("Métal au contact du clou", [["0", "Aucun"], ["cu", "Cuivre"], ["zn", "Zinc"], ["mg", "Magnésium"]], "0");
    var jr = k.slider("Durée", 0, 60, 1, 20, "jours");
    var lp = k.loop(function(dt, t){ tt = t; if (go){ var v = jr.value + dt * 9; if (v >= 60){ v = 60; go = false; } jr.set(v); } k.redraw(); }); lp.play();
    k.button("▶ Faire passer les jours", function(){ jr.set(0); go = true; }, true);
    var ro = k.readouts(["Indice de corrosion (0–10)", "Quantité de rouille", "Qui s'oxyde ?"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var idx = 0, ctx = c.ctx, ox = "le fer (Fe → Fe²⁺)", i, wet = tw.value, air = to.value;
      if (wet && air){
        idx = 2 + (ts.value ? 4 : 0);
        if (ct.value === "cu") idx = Math.min(10, idx * 1.6);
        if (ct.value === "zn" || ct.value === "mg"){ idx = 0.1; ox = ct.value === "zn" ? "le zinc (Zn → Zn²⁺) : le fer est protégé" : "le magnésium (Mg → Mg²⁺) : le fer est protégé"; }
      } else ox = "rien : il manque eau ou dioxygène";
      var rust = (wet && air) ? 1 - Math.exp(-idx * jr.value / 30) : 0, prot = ct.value === "zn" || ct.value === "mg";
      /* récipient */
      var bx = 20, bw = c.W - 40, by = 120, bh = 270, lvl = 0.78, top = by + bh - (bh - 6) * lvl;
      if (wet) H.glass(c, "beaker", bx, by, bw, bh, {level: lvl, color: ts.value ? [200, 225, 240] : [214, 232, 246], alpha: 0.55, shine: true});
      else { ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke(); S.draw.text(c, "air sec (pas d'eau liquide)", c.W / 2, by + bh / 2, {size: 13, color: P.grey}); }
      /* particules : O₂, ions Na⁺/Cl⁻ */
      if (wet){
        if (air) for (i = 0; i < 16; i++){ var p = H.wander(i, tt, 0.6), ox2 = bx + 12 + p[0] * (bw - 24), oy = top + 14 + p[1] * (by + bh - top - 28); H.ball(c, ox2 - 5, oy, 5, P.red, ""); H.ball(c, ox2 + 5, oy, 5, P.red, ""); }
        if (ts.value) for (i = 0; i < 14; i++){ var q = H.wander(50 + i, tt, 0.5), sx = bx + 12 + q[0] * (bw - 24), sy = top + 14 + q[1] * (by + bh - top - 28); S.draw.dot(c, sx, sy, 3.8, i % 2 ? "#3aa860" : "#8a5cd6"); }
      }
      /* clou */
      var cx = c.W * 0.42, cy = 28, chh = 230, nw = 22;
      var gN = ctx.createLinearGradient(cx - nw / 2, 0, cx + nw / 2, 0); gN.addColorStop(0, "#9aa4b0"); gN.addColorStop(0.45, "#e1e5ea"); gN.addColorStop(1, "#8a95a2");
      function nailPath(){ ctx.beginPath(); ctx.moveTo(cx - nw / 2, cy); ctx.lineTo(cx - nw / 2, cy + chh); ctx.lineTo(cx, cy + chh + 30); ctx.lineTo(cx + nw / 2, cy + chh); ctx.lineTo(cx + nw / 2, cy); ctx.closePath(); }
      /* halos ferroxyle : bleu = anode (Fe²⁺), rose = cathode (OH⁻) */
      if (wet && air && !prot){
        var ia = Math.min(1, idx / 8) * Math.min(1, 0.25 + jr.value / 25);
        S.draw.glow(c, cx, cy + chh + 24, 46, "#2f5fd0", 0.55 * ia); S.draw.glow(c, cx, top + 6, 46, "#2f5fd0", 0.35 * ia);
        S.draw.glow(c, cx, cy + 150, 56, "#e0509c", 0.35 * ia);
        if (ia > 0.1) { S.draw.label(c, "Fe²⁺ (bleu)", cx - 40, cy + chh + 46, {color: "#2f5fd0", size: 11, align: "right"}); S.draw.label(c, "OH⁻ (rose)", cx + 60, cy + 150, {color: "#c43a7a", size: 11, align: "left"}); }
      }
      ctx.save(); nailPath(); ctx.fillStyle = gN; ctx.fill();
      ctx.clip(); ctx.fillStyle = "rgba(150,64,18," + Math.min(0.92, rust * 1.1).toFixed(2) + ")"; ctx.fillRect(cx - nw, cy, nw * 2, chh + 40);
      for (i = 0; i < 40 * rust; i++){ ctx.fillStyle = "rgba(120,48,12,.5)"; ctx.fillRect(cx - nw / 2 + H.rnd(i, 1) * nw, cy + 40 + H.rnd(i, 2) * (chh - 20), 2 + H.rnd(i, 3) * 4, 2 + H.rnd(i, 4) * 5); }
      ctx.restore(); ctx.save(); nailPath(); ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
      S.draw.rrect(c, cx - 22, cy - 8, 44, 10, 4); ctx.fillStyle = "#b9c0c8"; ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.4)"; ctx.stroke();
      S.draw.text(c, "clou en fer", cx - 34, cy + 14, {size: 12, color: P.grey, align: "right"});
      /* Fe²⁺ qui s'échappent de la pointe */
      if (wet && air && !prot && rust > 0.02) for (i = 0; i < 6; i++){ var u = (tt * 0.5 + i / 6) % 1; S.draw.dot(c, cx + Math.sin(i * 2.4 + tt) * 14, cy + chh + 30 + u * 26, 3.2, "rgba(47,95,208," + (1 - u).toFixed(2) + ")"); }
      /* métal au contact */
      if (ct.value !== "0"){
        var mc = {cu: "#c46a3c", zn: "#9aa5b1", mg: "#c7ccd2"}[ct.value], mx = cx + 86, mh = 120 * (prot ? Math.max(0.35, 1 - 0.4 * (1 - Math.exp(-jr.value / 40))) : 1), mw = 28, my = by + bh - 20 - mh;
        ctx.save(); ctx.fillStyle = mc; S.draw.rrect(c, mx - mw / 2, my, mw, mh, 3); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.stroke(); ctx.restore();
        ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, cy + 40); ctx.lineTo(cx + nw / 2, cy + 40); ctx.stroke(); ctx.restore();
        S.draw.label(c, {cu: "Cu", zn: "Zn", mg: "Mg"}[ct.value] + " · fil", mx + 20, cy + 52, {color: P.ink, size: 11, align: "left"});
        if (prot && wet && air && jr.value > 1) for (i = 0; i < 5; i++){ var v2 = (tt * 0.45 + i / 5) % 1; S.draw.dot(c, mx + Math.sin(i * 3) * 10, my - v2 * 40, 2.6, "rgba(255,255,255,.8)"); }
        if (prot && wet && air){ for (i = 0; i < 4; i++){ var w2 = ((tt * 0.7 + i / 4) % 1); S.draw.dot(c, mx - w2 * (mx - cx), cy + 40 + (1 - w2) * 0, 3, "#f4c542"); } S.draw.label(c, "e⁻ vers le clou", (mx + cx) / 2, cy + 24, {color: P.amber, size: 10.5}); }
      }
      S.draw.label(c, wet ? (air ? "eau aérée" : "eau sans O₂") + (ts.value ? " + sel" : "") : "sans eau", bx + 10, by + 16, {color: P.acc, align: "left"});
      S.draw.legend(c, [[P.red, "O₂ dissous"]].concat(ts.value ? [["#8a5cd6", "Na⁺ / Cl⁻"]] : []), c.W - 14, 14, {align: "right"});
      ro.set(0, S.fmt(idx, 1)); ro.set(1, S.fmt(rust * 100, 0) + " %"); ro.set(2, ox);
      nt.set((idx === 0 && !(wet && air) ? "Sans eau liquide ou sans dioxygène : pas de corrosion." : prot ? "Protection cathodique : le métal moins noble est consommé, le clou reste intact." : ct.value === "cu" ? "Le fer est moins noble que le cuivre : il s'oxyde plus vite au contact du cuivre." : ts.value ? "L'eau salée conduit mieux : la corrosion est nettement plus rapide." : "Eau aérée : corrosion lente.") + "<br>Anode : Fe → Fe²⁺ + 2 e⁻ · cathode : O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻ · bilan : 2 Fe + O₂ + 2 H₂O → 2 Fe(OH)₂, puis oxydation en rouille (Fe₂O₃·nH₂O).", "ok");
    });
  }
});
})();
