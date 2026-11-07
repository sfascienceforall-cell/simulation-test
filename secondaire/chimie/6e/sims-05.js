/* Chapitre 5 · Titrages, solutions tampons et pH des sels */
(function(){
var KW = 1e-14;
function bis(f, lo, hi){ var a = Math.log(lo), b = Math.log(hi), m, i; for (i = 0; i < 90; i++){ m = (a + b) / 2; if (f(Math.exp(m)) > 0) b = m; else a = m; } return Math.exp((a + b) / 2); }
/* titrage : mode "a" = acide HA (pKa) par base forte ; "b" = base B (pKa de BH+) par acide fort. V en mL, c en mol/L. */
function phTit(mode, pKa, Ca, Va, Ct, Vt){
  var Ka = Math.pow(10, -pKa), V = Va + Vt, C = Ca * Va / V, T = Ct * Vt / V;
  if (mode === "a") return -Math.log10(bis(function(h){ return T + h - KW / h - C * Ka / (Ka + h); }, 1e-15, 20));
  return -Math.log10(bis(function(h){ return h + C * h / (Ka + h) - KW / h - T; }, 1e-15, 20));
}
var T1 = [
  {id: "hcl", nom: "Acide fort (HCl) par NaOH", mode: "a", pKa: -7},
  {id: "ac", nom: "Acide éthanoïque (pKa 4,76) par NaOH", mode: "a", pKa: 4.76},
  {id: "hcn", nom: "Acide très faible (pKa 9,2) par NaOH", mode: "a", pKa: 9.2},
  {id: "nh3", nom: "Ammoniac (NH₄⁺/NH₃, pKa 9,25) par HCl", mode: "b", pKa: 9.25}
];
SFA.sim({
  id: "c6-c05-titrage", ch: "c05", tag: "Classique",
  titre: "Courbe de titrage : équivalence et demi-équivalence",
  resume: "Verse la base goutte à goutte dans un acide : suis le pH, repère l'équivalence et lis le pKa à la demi-équivalence.",
  but: "Choisis l'acide ou la base, ses concentrations, puis fais glisser le volume versé (ou clique sur la courbe). Repère V_eq et le pH à V_eq / 2.",
  aRetenir: "À l'équivalence, les réactifs ont été mélangés dans les proportions de l'équation : n(titrant versé) = n(titré) soit c_t·V_eq = c_a·V_a. Pour un acide faible titré par une base forte, le pH à la demi-équivalence est égal au pKa, et le pH à l'équivalence est supérieur à 7.",
  piege: "L'équivalence n'est pas toujours à pH 7 : acide faible + base forte → pH > 7 (la base conjuguée A⁻ est une base) ; base faible + acide fort → pH < 7. Elle n'est à 7 que pour un acide fort et une base forte.",
  build: function(k, S){
    var c = k.canvas(480), P = S.draw.palette, H = window.C6;
    var sc = k.select("Titrage", T1.map(function(t, i){ return [i, t.nom]; }), 1);
    var ca = k.slider("Concentration du titré", 0.01, 0.5, 0.01, 0.1, "mol/L");
    var va = k.slider("Volume du titré", 10, 50, 1, 20, "mL");
    var ct = k.slider("Concentration du titrant", 0.01, 0.5, 0.01, 0.1, "mol/L");
    var xv = k.slider("Volume de titrant versé (en V_eq)", 0, 2, 0.01, 0.5, "× V_eq");
    var ro = k.readouts(["V versé", "pH", "V_eq", "pH à V_eq"]);
    var nt = k.note("", "ok");
    var ax0 = null;
    c.pointer(function(t, p){ if (t === "move" || t === "up" || !ax0) return; var Veq = ca.value * va.value / ct.value, v = ax0.ix(p.x); xv.set(Math.max(0, Math.min(2, Math.round(v / Veq * 100) / 100))); k.redraw(); });
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var s = T1[sc.value], Veq = ca.value * va.value / ct.value, vt = xv.value * Veq, ctx0 = c.ctx;
      /* scène : burette, erlenmeyer à l'indicateur universel, pH-mètre */
      var ph0 = phTit(s.mode, s.pKa, ca.value, va.value, ct.value, vt), bx0 = 70, lev = Math.max(0, 1 - vt / (2.0 * Math.max(Veq, 1) * 1.0));
      ctx0.save(); S.draw.rrect(c, bx0 - 7, 10, 14, 90, 4); ctx0.fillStyle = "rgba(255,255,255,.7)"; ctx0.fill(); ctx0.clip(); ctx0.fillStyle = "rgba(120,170,230,.55)"; ctx0.fillRect(bx0 - 7, 10 + 90 * (1 - lev), 14, 90 * lev); ctx0.restore();
      ctx0.strokeStyle = "#5b6e86"; ctx0.lineWidth = 1.8; S.draw.rrect(c, bx0 - 7, 10, 14, 90, 4); ctx0.stroke(); S.draw.line(c, bx0, 100, bx0, 110, "#5b6e86", 3);
      S.draw.text(c, "titrant " + S.fmt(ct.value, 2) + " mol/L", bx0 + 20, 20, {size: 10.5, color: P.grey, align: "left"}); S.draw.text(c, S.fmt(vt, 2) + " mL versés", bx0 + 20, 36, {size: 12.5, color: P.ink, align: "left", weight: 800});
      H.glass(c, "flask", bx0 - 50, 112, 100, 84, {level: 0.55, color: (function(){ var m = H.phColor(Math.max(0, Math.min(14, ph0))).match(/\d+/g); return m.map(Number); })(), alpha: 0.9, shine: true});
      S.draw.text(c, "indicateur universel", bx0, 208, {size: 10.5, color: P.grey});
      S.draw.display(c, S.fmt(ph0, 2), c.W - 70, 62, {w: 112, h: 52, caption: "pH-mètre", size: 22});
      S.draw.text(c, "V_eq = " + S.fmt(Veq, 2) + " mL", c.W - 70, 104, {size: 12, color: P.green, weight: 800});
      var ax = S.draw.axes(c, {x0: 0, x1: 2 * Veq, y0: 0, y1: 14, stepY: 2, xl: "V titrant / mL", yl: "pH", t: 230, b: 34}); ax0 = ax;
      S.draw.fn(c, ax, function(x){ return phTit(s.mode, s.pKa, ca.value, va.value, ct.value, x); }, P.acc, 3);
      var phEq = phTit(s.mode, s.pKa, ca.value, va.value, ct.value, Veq), phHalf = phTit(s.mode, s.pKa, ca.value, va.value, ct.value, Veq / 2);
      S.draw.line(c, ax.X(Veq), ax.T, ax.X(Veq), ax.B, P.green, 1.4, [5, 4]);
      S.draw.dot(c, ax.X(Veq), ax.Y(phEq), 5, P.green);
      S.draw.text(c, "équivalence", ax.X(Veq) + 6, ax.T + 12, {size: 12, color: P.green, align: "left"});
      var weak = s.pKa > 1;
      if (weak){ S.draw.dot(c, ax.X(Veq / 2), ax.Y(phHalf), 5, P.amber); S.draw.text(c, "V_eq/2", ax.X(Veq / 2), ax.Y(phHalf) + (s.mode === "a" ? 16 : -16), {size: 12, color: P.amber}); }
      var ph = phTit(s.mode, s.pKa, ca.value, va.value, ct.value, vt);
      S.draw.dot(c, ax.X(vt), ax.Y(ph), 6, P.red);
      ro.set(0, S.fmt(vt, 2) + " mL"); ro.set(1, S.fmt(ph, 2)); ro.set(2, S.fmt(Veq, 2) + " mL"); ro.set(3, S.fmt(phEq, 2));
      var msg;
      if (Math.abs(xv.value - 1) < 0.005) msg = "Équivalence : pH = " + S.fmt(phEq, 2) + (Math.abs(phEq - 7) > 0.3 ? " (≠ 7 : l'espèce formée est une base ou un acide faible)." : " : solution neutre.");
      else if (weak && Math.abs(xv.value - 0.5) < 0.005) msg = "Demi-équivalence : pH = " + S.fmt(phHalf, 2) + " ≈ pKa = " + S.fmt(s.pKa, 2) + " : [acide] = [base].";
      else msg = xv.value < 1 ? "Avant l'équivalence, le titré est encore en excès." : "Après l'équivalence, c'est le titrant qui est en excès.";
      nt.set(msg, "ok");
    });
  }
});

/* ---------- choix d'un indicateur ---------- */
var IND = [
  {nom: "Hélianthine (méthylorange)", lo: 3.1, hi: 4.4, c1: [214, 40, 40], c2: [245, 197, 24], t1: "rouge", t2: "jaune"},
  {nom: "Rouge de méthyle", lo: 4.4, hi: 6.2, c1: [214, 40, 40], c2: [245, 197, 24], t1: "rouge", t2: "jaune"},
  {nom: "Bleu de bromothymol", lo: 6.0, hi: 7.6, c1: [245, 197, 24], c2: [40, 90, 200], t1: "jaune", t2: "bleu"},
  {nom: "Rouge de phénol", lo: 6.8, hi: 8.4, c1: [245, 197, 24], c2: [214, 40, 40], t1: "jaune", t2: "rouge"},
  {nom: "Phénolphtaléine", lo: 8.2, hi: 10.0, c1: [240, 240, 240], c2: [233, 30, 140], t1: "incolore", t2: "rose"}
];
SFA.sim({
  id: "c6-c05-indicateur", ch: "c05", tag: "Défi",
  titre: "Quel indicateur coloré choisir ?",
  resume: "Verse le titrant dans l'erlenmeyer, regarde l'indicateur changer de couleur et compare son virage à l'équivalence.",
  but: "Choisis le titrage puis l'indicateur. Fais glisser le point sur la courbe (ou le curseur) pour verser le titrant : la couleur de l'erlenmeyer suit le pH. Vérifie l'erreur sur V_eq. Défi : trouve, pour chaque titrage, les indicateurs valides (erreur < 0,5 %).",
  aRetenir: "Un bon indicateur a une zone de virage qui contient le pH à l'équivalence, dans le saut de pH. Le volume lu au virage (pH du milieu de la zone) est alors égal à V_eq à 0,5 % près. Titrage acide faible/base forte : phénolphtaléine ; base faible/acide fort : rouge de méthyle ou hélianthine ; fort/fort : presque tous conviennent.",
  piege: "Le virage n'est pas l'équivalence : l'indicateur change de couleur sur une zone de pH d'environ 2 unités. Si cette zone est loin du pH à l'équivalence, la couleur change trop tôt (ou ne change pas), et le dosage est faux. Un acide très faible (pKa ≈ 9 ou plus) ne donne aucun saut net : aucun indicateur n'est précis. Concentrations : 0,100 mol/L ; volume du titré : 20,0 mL.",
  build: function(k, S){
    var c = k.canvas(500), P = S.draw.palette, H = window.C6;
    var sc = k.select("Titrage", T1.slice(0, 4).map(function(t, i){ return [i, t.nom]; }), 1);
    var ii = k.select("Indicateur", IND.map(function(t, i){ return [i, t.nom + " (" + t.lo + "–" + t.hi + ")"]; }), 4);
    var vt = k.slider("Volume de titrant versé", 0, 40, 0.05, 10, "mL");
    var ro = k.readouts(["pH", "Couleur de l'indicateur", "V au virage (milieu de zone)", "Erreur sur V_eq"]);
    var nt = k.note("", "ok");
    var tdrop = -9;
    function f(s, v){ return phTit(s.mode, s.pKa, 0.1, 20, 0.1, v); }
    function color(I, ph){ var t = Math.max(0, Math.min(1, (ph - I.lo) / (I.hi - I.lo))); return [0, 1, 2].map(function(j){ return Math.round(I.c1[j] + (I.c2[j] - I.c1[j]) * t); }); }
    function veqCross(s, pT){ var a = 0, b = 40, up = s.mode === "a", m, i; if ((f(s, a) - pT) * (f(s, b) - pT) > 0) return null;
      for (i = 0; i < 70; i++){ m = (a + b) / 2; var v = f(s, m) - pT; if ((v > 0) === up) b = m; else a = m; } return (a + b) / 2; }
    var geo = {};
    c.pointer(function(type, p){ if (type === "move" || type === "up" || !geo.ax) return; if (p.y < geo.ax.T - 14) return; vt.set(Math.round(Math.max(0, Math.min(40, geo.ax.ix(p.x))) * 20) / 20); k.redraw(); });
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var s = T1[sc.value], I = IND[ii.value], ctx = c.ctx;
      var ph = f(s, vt.value), col = color(I, ph), acidCurve = s.mode === "a";
      /* burette + erlenmeyer */
      var bx = 106, level = 1 - vt.value / 40;
      ctx.save(); S.draw.rrect(c, bx - 7, 12, 14, 84, 4); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fill(); ctx.clip(); ctx.fillStyle = "rgba(120,170,230,.55)"; ctx.fillRect(bx - 7, 12 + 84 * (1 - level), 14, 84 * level); ctx.restore();
      ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 1.8; S.draw.rrect(c, bx - 7, 12, 14, 84, 4); ctx.stroke(); S.draw.line(c, bx, 96, bx, 106, "#5b6e86", 3);
      for (var q = 0; q <= 4; q++) S.draw.line(c, bx + 7, 12 + q * 21, bx + 12, 12 + q * 21, "#5b6e86", 1);
      S.draw.text(c, "burette", bx - 38, 22, {size: 10.5, color: P.grey}); S.draw.text(c, S.fmt(vt.value, 1) + " mL", bx - 38, 36, {size: 11, color: P.ink, weight: 800});
      var fw = 100, fh = 86, fx = bx - fw / 2 - 2, fy = 112;
      H.glass(c, "flask", fx, fy, fw, fh, {level: 0.55, color: col, alpha: 0.9, shine: true, inside: function(top){ ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(fx, top, fw, 4); }});
      S.draw.text(c, "titré + indicateur", fx + fw / 2, fy + fh + 14, {size: 10.5, color: P.grey});
      /* nuancier de l'indicateur */
      var gx0 = 196, gx1 = c.W - 18, gy = 126;
      for (var i = 0; i < 60; i++){ ctx.fillStyle = "rgb(" + color(I, I.lo - 1.2 + (I.hi - I.lo + 2.4) * i / 59).join(",") + ")"; ctx.fillRect(gx0 + (gx1 - gx0) * i / 60, gy, (gx1 - gx0) / 60 + 1, 22); }
      ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 1.5; S.draw.rrect(c, gx0, gy, gx1 - gx0, 22, 4); ctx.stroke();
      var gp = function(v){ return gx0 + (gx1 - gx0) * (v - (I.lo - 1.2)) / (I.hi - I.lo + 2.4); };
      S.draw.text(c, I.nom, gx0, gy - 14, {size: 12.5, color: P.ink, align: "left", weight: 800});
      S.draw.text(c, "zone de virage " + I.lo + " – " + I.hi, gx0, gy + 40, {size: 11, color: P.grey, align: "left"});
      var mx = Math.max(gx0, Math.min(gx1, gp(ph))); ctx.save(); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(mx, gy - 2); ctx.lineTo(mx - 6, gy - 11); ctx.lineTo(mx + 6, gy - 11); ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.display(c, S.fmt(ph, 2), gx1 - 52, 66, {w: 104, h: 46, caption: "pH", size: 20});
      /* courbe */
      var ax = S.draw.axes(c, {x0: 0, x1: 40, y0: 0, y1: 14, stepX: 5, stepY: 2, xl: "V / mL", yl: "pH", t: 232, b: 34}); geo.ax = ax;
      var zg = ctx.createLinearGradient(0, ax.Y(I.hi), 0, ax.Y(I.lo)); zg.addColorStop(0, "rgb(" + I.c2.join(",") + ")"); zg.addColorStop(1, "rgb(" + I.c1.join(",") + ")");
      ctx.save(); ctx.globalAlpha = 0.38; ctx.fillStyle = zg; ctx.fillRect(ax.L, ax.Y(I.hi), ax.R - ax.L, ax.Y(I.lo) - ax.Y(I.hi)); ctx.restore();
      S.draw.text(c, "zone de virage", ax.R - 6, ax.Y((I.lo + I.hi) / 2), {size: 11, color: P.ink, align: "right"});
      S.draw.fn(c, ax, function(x){ return f(s, x); }, P.acc, 3);
      S.draw.line(c, ax.X(20), ax.T, ax.X(20), ax.B, P.green, 1.4, [5, 4]); S.draw.text(c, "V_eq = 20 mL", ax.X(20) + 4, ax.B - 10, {size: 11, color: P.green, align: "left"});
      var pT = (I.lo + I.hi) / 2, vv = veqCross(s, pT), err = vv === null ? null : (vv - 20) / 20 * 100;
      if (vv !== null){ S.draw.line(c, ax.X(vv), ax.T, ax.X(vv), ax.B, P.red, 1.3, [2, 3]); S.draw.label(c, "virage " + S.fmt(vv, 1), ax.X(vv), ax.T + 8, {color: P.red, size: 10.5}); }
      S.draw.dot(c, ax.X(vt.value), ax.Y(ph), 7.5, P.red);
      var cname = ph <= I.lo ? I.t1 : ph >= I.hi ? I.t2 : "teinte intermédiaire";
      if (!acidCurve){ var tmp = cname; }
      ro.set(0, S.fmt(ph, 2)); ro.set(1, cname); ro.set(2, vv === null ? "ne vire jamais" : S.fmt(vv, 2) + " mL"); ro.set(3, err === null ? "—" : (err > 0 ? "+" : "") + S.fmt(err, 1) + " %");
      if (vv === null) nt.set("Le pH du milieu de la zone de virage (" + S.fmt(pT, 2) + ") n'est jamais traversé pendant ce titrage : l'indicateur garde la même couleur du début à la fin et ne signale rien.", "warn");
      else if (Math.abs(err) <= 0.5) nt.set("Indicateur adapté : le virage a lieu à " + S.fmt(vv, 2) + " mL, à " + S.fmt(Math.abs(err), 1) + " % de V_eq = 20,00 mL.", "ok");
      else nt.set("Indicateur inadapté : le virage a lieu à " + S.fmt(vv, 2) + " mL, soit " + S.fmt(Math.abs(err), 0) + " % d'erreur sur V_eq = 20,00 mL.", "warn");
    });
  }
});

/* ---------- solution tampon ---------- */
var TAM = [
  {nom: "Éthanoïque / éthanoate", pKa: 4.76, a: "CH₃COOH", b: "CH₃COO⁻"},
  {nom: "Dihydrogénophosphate / hydrogénophosphate", pKa: 7.20, a: "H₂PO₄⁻", b: "HPO₄²⁻"},
  {nom: "Ion ammonium / ammoniac", pKa: 9.25, a: "NH₄⁺", b: "NH₃"},
  {nom: "Acide carbonique / hydrogénocarbonate", pKa: 6.35, a: "H₂CO₃", b: "HCO₃⁻"}
];
SFA.sim({
  id: "c6-c05-tampon", ch: "c05", tag: "Graphes",
  titre: "Solution tampon contre eau pure",
  resume: "Ajoute de l'acide ou de la base à un tampon et à de l'eau pure : compare les variations de pH.",
  but: "Choisis le couple, la concentration totale et le rapport base/acide. Ajoute HCl ou NaOH (100 mL de solution) et compare à l'eau pure. Défi : dépasse la capacité du tampon.",
  aRetenir: "Un tampon contient un acide faible et sa base conjuguée en quantités comparables : pH = pKa + log([base]/[acide]). L'ajout d'un peu d'acide ou de base ne change presque pas le pH : l'acide ajouté est consommé par la base du tampon, et inversement. Efficacité maximale pour pH ≈ pKa (rapport entre 0,1 et 10).",
  piege: "Un tampon n'empêche pas tout changement de pH : il l'atténue, tant qu'il reste de la base (pour absorber un acide) ou de l'acide (pour absorber une base). Une fois la réserve épuisée, le pH s'effondre comme dans l'eau.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, H = window.C6;
    var sy = k.select("Couple du tampon", TAM.map(function(t, i){ return [i, t.nom + " (pKa " + t.pKa + ")"]; }), 0);
    var ct = k.slider("Concentration totale", 0.02, 0.5, 0.01, 0.1, "mol/L");
    var rt = k.slider("log([base]/[acide])", -1, 1, 0.1, 0, "");
    var ty = k.seg("Ajout", [["h", "HCl (acide)"], ["o", "NaOH (base)"]], "h");
    var ad = k.slider("Quantité ajoutée (dans 100 mL)", 0, 20, 0.5, 2, "mmol");
    var ro = k.readouts(["pH initial", "pH après ajout", "pH de l'eau après ajout", "Réserve restante"]);
    var nt = k.note("", "ok");
    var V = 0.1;
    function phT(s, nA, nB, delta){ var Ka = Math.pow(10, -s.pKa), C = (nA + nB) / 1000 / V, nb = nB / 1000 / V + delta / 1000 / V;
      return -Math.log10(bis(function(h){ return nb + h - KW / h - C * Ka / (Ka + h); }, 1e-15, 20)); }
    function phW(delta){ var d = delta / 1000 / V; return -Math.log10(bis(function(h){ return d + h - KW / h; }, 1e-15, 20)); }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var s = TAM[sy.value], tot = ct.value * V * 1000, r = Math.pow(10, rt.value), nA = tot / (1 + r), nB = tot - nA, sg = ty.value === "h" ? -1 : 1;
      /* deux béchers : tampon et eau pure, à l'indicateur universel, avant/après ajout */
      var pT0 = phT(s, nA, nB, 0), pT1 = phT(s, nA, nB, sg * ad.value), pW1 = phW(sg * ad.value), cc0 = c.ctx;
      function rgbOf(p){ return H.phColor(Math.max(0, Math.min(14, p))).match(/\d+/g).map(Number); }
      var half = c.W / 2;
      [[half / 2, "Tampon", pT0, pT1, P.green], [half + half / 2, "Eau pure", 7, pW1, P.grey]].forEach(function(b2){
        var bx2 = b2[0] - 40;
        H.glass(c, "beaker", bx2, 52, 80, 84, {level: 0.7, color: rgbOf(b2[3]), alpha: 0.88, shine: true});
        S.draw.text(c, b2[1], b2[0], 20, {size: 13, color: b2[4], weight: 800});
        S.draw.display(c, S.fmt(b2[3], 2), b2[0], 168, {w: 96, h: 44, caption: "pH après ajout", size: 18});
        S.draw.text(c, "avant : " + S.fmt(b2[2], 2), b2[0], 40, {size: 11, color: P.grey});
      });
      S.draw.text(c, "+ " + S.fmt(ad.value, 1) + " mmol " + (sg < 0 ? "HCl" : "NaOH"), c.W / 2, 90, {size: 12, color: P.red, weight: 800, bg: "rgba(255,255,255,.9)"});
      var ax = S.draw.axes(c, {x0: 0, x1: 20, y0: 0, y1: 14, stepX: 2, stepY: 2, xl: "ajouté / mmol", yl: "pH", t: 220, b: 34});
      S.draw.fn(c, ax, function(x){ return phT(s, nA, nB, sg * x); }, P.green, 3);
      S.draw.fn(c, ax, function(x){ return phW(sg * x); }, P.grey, 2.2, [6, 4]);
      S.draw.text(c, "— tampon", ax.L + 56, ax.T + 10, {size: 12, color: P.green, align: "left"});
      S.draw.text(c, "- - eau pure", ax.L + 56, ax.T + 28, {size: 12, color: P.grey, align: "left"});
      var p0 = phT(s, nA, nB, 0), p1 = phT(s, nA, nB, sg * ad.value), pw = phW(sg * ad.value);
      S.draw.dot(c, ax.X(ad.value), ax.Y(p1), 6, P.green); S.draw.dot(c, ax.X(ad.value), ax.Y(pw), 6, P.grey);
      var res = sg < 0 ? nB : nA;
      ro.set(0, S.fmt(p0, 2)); ro.set(1, S.fmt(p1, 2)); ro.set(2, S.fmt(pw, 2)); ro.set(3, S.fmt(Math.max(0, res - ad.value), 2) + " mmol de " + (sg < 0 ? s.b : s.a));
      var over = ad.value > res;
      nt.set(over ? "Capacité dépassée : tu as ajouté plus (" + S.fmt(ad.value, 1) + " mmol) que la réserve (" + S.fmt(res, 1) + " mmol de " + (sg < 0 ? s.b : s.a) + "). Le pH chute comme dans l'eau." : "Variation du tampon : ΔpH = " + S.fmt(p1 - p0, 2) + ", contre " + S.fmt(pw - 7, 2) + " pour l'eau pure.", over ? "warn" : "ok");
    });
  }
});

/* ---------- pH des sels ---------- */
var CARB = [6.35, 10.33], PHOS = [2.15, 7.20, 12.35];
var SELS = [
  {nom: "NaCl", cat: 1, an: 1, sys: [], txt: "Na⁺ et Cl⁻ sont des ions spectateurs (acide et base conjugués d'un acide et d'une base forts) : pH = 7."},
  {nom: "CH₃COONa (éthanoate de sodium)", cat: 1, an: 0, sys: [{pk: [4.76], q0: 0}], txt: "L'ion éthanoate est la base conjuguée d'un acide faible (pKa 4,76) : CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻ → pH > 7."},
  {nom: "NH₄Cl (chlorure d'ammonium)", cat: 0, an: 1, sys: [{pk: [9.25], q0: 1}], txt: "L'ion ammonium est un acide faible (pKa 9,25) : NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺ → pH < 7."},
  {nom: "NaF (fluorure de sodium)", cat: 1, an: 0, sys: [{pk: [3.17], q0: 0}], txt: "F⁻ est la base conjuguée de HF (pKa 3,17) : base très faible, pH légèrement > 7."},
  {nom: "Na₂CO₃ (carbonate de sodium)", cat: 2, an: 0, sys: [{pk: CARB, q0: 0}], txt: "CO₃²⁻ est la base d'un couple de pKa 10,33 : base assez forte, pH nettement > 7."},
  {nom: "NaHCO₃ (hydrogénocarbonate de sodium)", cat: 1, an: 0, sys: [{pk: CARB, q0: 0}], txt: "HCO₃⁻ est un ampholyte : acide du couple HCO₃⁻/CO₃²⁻ (10,33), base du couple H₂CO₃/HCO₃⁻ (6,35). pH ≈ ½(6,35 + 10,33) = 8,34, presque indépendant de la concentration."},
  {nom: "NaH₂PO₄ (dihydrogénophosphate de sodium)", cat: 1, an: 0, sys: [{pk: PHOS, q0: 0}], txt: "H₂PO₄⁻ est un ampholyte : pH ≈ ½(2,15 + 7,20) = 4,68 (légèrement acide)."},
  {nom: "Na₂HPO₄ (hydrogénophosphate de sodium)", cat: 2, an: 0, sys: [{pk: PHOS, q0: 0}], txt: "HPO₄²⁻ est un ampholyte : pH ≈ ½(7,20 + 12,35) = 9,78 (basique)."},
  {nom: "CH₃COONH₄ (éthanoate d'ammonium)", cat: 0, an: 0, sys: [{pk: [9.25], q0: 1}, {pk: [4.76], q0: 0}], txt: "NH₄⁺ (acide, pKa 9,25) et CH₃COO⁻ (base, pKa 4,76) se compensent presque : pH ≈ ½(4,76 + 9,25) = 7,0."}
];
function frac(pk, ph){ var t = [1], i, cum = 0, s = 1; for (i = 0; i < pk.length; i++){ cum += pk[i]; t.push(Math.pow(10, (i + 1) * ph - cum)); s += t[i + 1]; } return t.map(function(x){ return x / s; }); }
function phSel(sel, c){
  return -Math.log10(bis(function(h){
    var ph = -Math.log10(h), q = sel.cat * c - sel.an * c, i, j;
    sel.sys.forEach(function(sy){ var f = frac(sy.pk, ph); for (j = 0; j < f.length; j++) q += c * (sy.q0 - j) * f[j]; });
    return q + h - KW / h;
  }, 1e-15, 20));
}
SFA.sim({
  id: "c6-c05-sels", ch: "c05", tag: "Original",
  titre: "Le pH d'un sel dissous : acide, neutre ou basique ?",
  resume: "Dissous un sel dans l'eau : quel ion réagit avec l'eau ? Suis le pH selon la concentration.",
  but: "Choisis un sel et fais varier sa concentration. Observe le pH, la dépendance (ou non) à la concentration, et l'ion responsable.",
  aRetenir: "Un sel se dissocie en ions ; ceux qui sont acide ou base d'un couple faible réagissent avec l'eau. Anion d'un acide faible → solution basique ; cation d'une base faible (NH₄⁺) → solution acide ; ions d'acide et de base forts (Na⁺, Cl⁻) → neutre. Un ampholyte (HCO₃⁻, H₂PO₄⁻…) a un pH ≈ ½(pKa₁ + pKa₂), presque indépendant de c.",
  piege: "« Sel » ne veut pas dire « neutre » : seul un sel d'acide fort et de base forte l'est. Le bicarbonate de soude (NaHCO₃) est basique (pH ≈ 8,3), le carbonate de sodium plus encore. Calcul exact (modèle idéal, 25 °C), les pKa sont arrondis.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, H = window.C6;
    var se = k.select("Sel", SELS.map(function(s, i){ return [i, s.nom]; }), 1);
    var pc = k.slider("pc (c = 10^−pc mol/L)", 0.5, 3, 0.1, 1, "");
    var ro = k.readouts(["Concentration", "pH", "Caractère"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var s = SELS[se.value], ph1 = phSel(s, Math.pow(10, -pc.value));
      H.glass(c, "beaker", 30, 24, 96, 100, {level: 0.7, color: H.phColor(Math.max(0, Math.min(14, ph1))).match(/\d+/g).map(Number), alpha: 0.88, shine: true});
      S.draw.text(c, s.nom.split(" (")[0], 78, 144, {size: 12.5, color: P.ink, weight: 800});
      S.draw.display(c, S.fmt(ph1, 2), c.W - 100, 54, {w: 120, h: 54, caption: "pH de la solution", size: 24});
      S.draw.label(c, ph1 < 6.9 ? "acide" : ph1 > 7.1 ? "basique" : "neutre", c.W - 100, 100, {color: ph1 < 6.9 ? P.red : ph1 > 7.1 ? P.acc : P.green, size: 12});
      var ax = S.draw.axes(c, {x0: 0.5, x1: 3, y0: 0, y1: 14, stepX: 0.5, stepY: 2, xl: "pc = −log c", yl: "pH", t: 170, b: 34});
      S.draw.line(c, ax.L, ax.Y(7), ax.R, ax.Y(7), P.light, 1.6, [5, 4]);
      S.draw.text(c, "neutre", ax.R - 4, ax.Y(7) - 9, {size: 12, color: P.grey, align: "right"});
      S.draw.fn(c, ax, function(x){ return phSel(s, Math.pow(10, -x)); }, P.green, 3);
      var cc = Math.pow(10, -pc.value), ph = phSel(s, cc);
      S.draw.dot(c, ax.X(pc.value), ax.Y(ph), 6, P.red);
      ro.set(0, S.sci(cc, 2) + " mol/L"); ro.set(1, S.fmt(ph, 2)); ro.set(2, ph < 6.9 ? "acide" : ph > 7.1 ? "basique" : "neutre");
      nt.set(s.txt, "ok");
    });
  }
});
})();
