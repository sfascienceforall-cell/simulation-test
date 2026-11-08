/* Chapitre 9 · Cycle menstruel, fécondation et contraception */
(function(){
var g = B5.g;
/* niveaux relatifs (0 à 1) des hormones, ovulation au jour o = L − 14 ; modèle qualitatif */
function hormones(d, L){
  var o = L - 14;
  var fsh = 0.15 + 0.45 * g(d, 3, 3) + 0.35 * g(d, o, 1.0);
  var lh = 0.12 + 0.88 * g(d, o - 0.2, 0.7);
  var e2 = 0.1 + 0.9 * g(d, o - 1, 3.0) + 0.5 * g(d, o + 7, 3.5);
  var p = d > o - 0.5 ? 0.05 + 0.95 * g(d, o + 7, 3.5) : 0.05;
  return {fsh: fsh, lh: lh, e2: Math.min(1, e2), p: p};
}
function endo(d, L){ var o = L - 14; return B5.interp([[1, 4], [3, 2], [5, 2.5], [o, 9], [o + 7, 12], [L - 1, 10], [L, 6], [40, 6]], d); }
function folliculeMm(d, L){ var o = L - 14; if (d <= o) return 4 + 16 * Math.pow(Math.max(0, d - 1) / Math.max(1, o - 1), 2.2); return B5.interp([[o, 20], [o + 7, 16], [L, 8]], d); }
function phase(d, L){ var o = L - 14; if (d <= 5) return "phase menstruelle"; if (d < o) return "phase folliculaire (proliférative)"; if (d === o) return "ovulation"; return "phase lutéale (sécrétoire)"; }
SFA.sim({
  id: "b5-c09-cycle", ch: "c09", tag: "Classique",
  titre: "Le cycle menstruel : hormones, follicule, endomètre",
  resume: "Jour du cycle et durée du cycle → quatre hormones, follicule, endomètre, température.",
  but: "Lance la lecture du cycle (ou glisse le repère sur le graphique) et observe l'ovaire, l'utérus et les quatre hormones en même temps. Puis change la durée du cycle (21 à 35 jours) : repère le jour de l'ovulation. Quelle phase dure toujours environ 14 jours ?",
  aRetenir: "Un cycle commence le 1er jour des règles. La FSH fait mûrir un follicule, qui sécrète des œstrogènes ; leur pic provoque un pic de LH (rétrocontrôle positif), qui déclenche l'ovulation. Le corps jaune sécrète ensuite progestérone et œstrogènes, qui préparent l'endomètre à la nidation. Sans fécondation, le corps jaune dégénère et les règles surviennent. La phase lutéale dure toujours ≈ 14 jours : l'ovulation a lieu environ 14 jours avant les règles suivantes.",
  piege: "L'ovulation n'a pas toujours lieu le 14e jour : dans un cycle de 35 jours, c'est vers le 21e jour ; dans un cycle de 21 jours, vers le 7e. Seule la phase lutéale (≈ 14 jours) est constante. Courbes qualitatives, niveaux relatifs.",
  build: function(k, S){
    var c = k.canvas(540), pal = S.draw.palette, D = S.draw;
    var L = k.slider("Durée du cycle", 21, 35, 1, 28, "jours");
    var dd = k.slider("Jour du cycle", 1, 35, 1, 14, "");
    var ro = k.readouts(["Phase", "Jour de l'ovulation", "Follicule / corps jaune", "Endomètre"]);
    var nt = k.note("", "");
    var playing = false, acc = 0, geo = {}, drag = false;
    var lp = k.loop(function(dt){ if (!playing) return; acc += dt; if (acc > 0.35){ acc = 0; var l = L.value, nd = dd.value + 1; if (nd > l) nd = 1; dd.set(nd); } k.redraw(); });
    k.button("Lire le cycle / pause", function(){ playing = !playing; if (playing) lp.play(); }, true);
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") drag = p.y > geo.gy; if (drag && (t === "down" || t === "drag") && geo.ax){ dd.set(Math.max(1, Math.min(L.value, Math.round(geo.ax.ix(p.x))))); k.redraw(); } if (t === "up") drag = false; });
    k.draw(function(){
      var l = L.value, d = Math.min(dd.value, l), o = l - 14, x;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 232, hs = hormones(d, l);
      D.rrect(c, 8, 8, W - 16, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#fdf6f4"); bg.addColorStop(1, "#f8e6e1"); ctx.fillStyle = bg; ctx.fill();
      var half = (W - 16) / 2;
      /* ---------- ovaire ---------- */
      var ox = 8 + half * 0.5, oy = 8 + sh * 0.52, orad = Math.min(88, half * 0.42);
      ctx.beginPath(); ctx.ellipse(ox, oy, orad, orad * .88, 0, 0, 7); var og = ctx.createRadialGradient(ox - 14, oy - 14, 8, ox, oy, orad); og.addColorStop(0, "#fbe0c4"); og.addColorStop(1, "#efb98c"); ctx.fillStyle = og; ctx.fill(); ctx.strokeStyle = "#c9954a"; ctx.lineWidth = 3; ctx.stroke();
      D.text(c, "ovaire", ox, 8 + sh - 12, {size: 11, color: "#8a5a2b", weight: 800});
      var fm = folliculeMm(d, l), fr = 7 + fm * 1.9, fxp = ox + orad * .12, fyp = oy - orad * .1;
      var postO = d > o, fresh = d === o;
      /* petits follicules en arrière-plan */
      [[-.5, -.35], [-.45, .35], [.5, .45], [.15, .6], [-.2, -.6]].forEach(function(q, qi){ B5.circ(c, ox + q[0] * orad, oy + q[1] * orad, 5 + (qi % 3) * 1.5, "rgba(255,255,255,.7)", "#d9a76a", 1); });
      if (!postO){
        B5.circ(c, fxp, fyp, fr, "#fff", "#c9954a", 2.5); B5.circ(c, fxp, fyp, Math.max(3, fr * .45) * 0 + fr - 6, "#eaf5fc", "#9fc4de", 1.5);
        B5.circ(c, fxp - fr * .25, fyp + fr * .2, 4.2, "#f6c8bd", "#c0321d", 1.5);
        D.label(c, S.fmt(fm, 0) + " mm", fxp, fyp - fr - 10, {size: 10.5, color: pal.red});
      } else {
        var cj = Math.max(.35, 1 - (d - o) / 16 * (d > l - 3 ? 1.1 : .4)), rcj = 8 + 12 * cj;
        B5.circ(c, fxp, fyp, rcj, d > l - 2 ? "#e7c98c" : "#f4c542", "#b8860b", 2); D.glow(c, fxp, fyp, rcj * 2, pal.yellow, .3 * cj);
        D.label(c, "corps jaune", fxp, fyp - rcj - 10, {size: 10.5, color: "#8a6508"});
        /* ovocyte libéré en route vers la trompe (jour o + 0 à 1) */
      }
      if (fresh){ B5.circ(c, fxp + fr + 10, fyp - fr - 4, 6, "#fff1ef", pal.red, 2); D.glow(c, fxp + fr + 10, fyp - fr - 4, 24, pal.red, .5); D.arrow(c, fxp + fr * .4, fyp - fr * .4, fxp + fr + 4, fyp - fr - 1, pal.red, 2); D.label(c, "ovulation", fxp + fr + 14, fyp - fr - 22, {size: 10.5, color: pal.red, align: "left"}); }
      /* ---------- utérus : endomètre ---------- */
      var ux = 8 + half + half * 0.5, uy = 8 + sh * 0.5, uw = Math.min(150, half * .66), uh = sh - 64, em = endo(d, l);
      ctx.beginPath(); ctx.moveTo(ux - uw / 2, uy - uh / 2 + 10); ctx.bezierCurveTo(ux - uw / 2, uy + 10, ux - 14, uy + uh * .35, ux - 12, uy + uh / 2); ctx.lineTo(ux + 12, uy + uh / 2); ctx.bezierCurveTo(ux + 14, uy + uh * .35, ux + uw / 2, uy + 10, ux + uw / 2, uy - uh / 2 + 10); ctx.bezierCurveTo(ux + uw * .25, uy - uh / 2 - 8, ux - uw * .25, uy - uh / 2 - 8, ux - uw / 2, uy - uh / 2 + 10); ctx.closePath();
      ctx.fillStyle = "#e9a99c"; ctx.fill(); ctx.strokeStyle = "#c9695b"; ctx.lineWidth = 3; ctx.stroke();
      /* cavité + endomètre (épaisseur px = mm × 3,2) */
      ctx.save(); ctx.clip();
      var th = em * 2.6, cx0 = ux - uw / 2 + 12, cx1 = ux + uw / 2 - 12, cy0 = uy - uh / 2 + 22, cy1 = uy + uh / 2 - 8;
      ctx.fillStyle = "#f8d3c8"; ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(cx0 + th * .3, cy0 + th * .1); ctx.lineTo(cx1 - th * .3, cy0 + th * .1); ctx.lineTo(cx1, cy0); ctx.lineTo(cx1 - 6, cy0 + uh * .5); ctx.lineTo(cx0 + 6, cy0 + uh * .5); ctx.closePath(); ctx.fill();
      /* tapisserie : endomètre = bande sur les parois */
      ctx.fillStyle = d > o ? "#e26b66" : "#ee8f86"; ctx.fillRect(cx0, cy0, uw - 24, Math.max(6, th * .5)); /* fond */
      ctx.fillStyle = "#fff4f1"; ctx.fillRect(cx0 + th * .6, cy0 + th * .5, uw - 24 - th * 1.2, uh * .55);
      ctx.restore();
      var bleed = d <= 5; if (bleed){ for (var q = 0; q < 6; q++){ var fy = cy1 - 26 + ((q * 17 + (d * 11)) % 24); B5.circ(c, ux - 10 + q * 4 + (q % 2) * 3, fy, 3, pal.red); } }
      D.text(c, "utérus · endomètre " + S.fmt(em, 0) + " mm", ux, 8 + sh - 12, {size: 11, color: "#8a2a1a", weight: 800});
      D.display(c, "J" + d, 8 + half, sh - 36, {w: 72, h: 40, size: 18, caption: phase(d, l).split(" ")[1] || phase(d, l)});
      /* ---------- hormones ---------- */
      var gy = sh + 22; geo.gy = gy - 6;
      D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 1, x1: l, y0: 0, y1: 1.05, xl: "jour du cycle  ·  glisse pour te déplacer", stepX: l > 28 ? 5 : 4, stepY: 0.5, t: gy + 10, b: 36, l: 40, r: 18});
      geo.ax = ax; D.text(c, "niveau relatif", 14, gy + 4, {size: 11, color: pal.grey, align: "left"});
      var P = {fsh: [], lh: [], e2: [], p: []};
      for (x = 1; x <= l + 0.01; x += 0.25){ var h = hormones(x, l); P.fsh.push([x, h.fsh]); P.lh.push([x, h.lh]); P.e2.push([x, h.e2]); P.p.push([x, h.p]); }
      ctx.fillStyle = "rgba(192,50,29,.10)"; ctx.fillRect(ax.X(1), ax.T, ax.X(5.5) - ax.X(1), ax.B - ax.T);
      B5.poly(c, ax, P.fsh, pal.amber, 2.6); B5.poly(c, ax, P.lh, pal.teal, 2.6); B5.poly(c, ax, P.e2, pal.red, 2.6); B5.poly(c, ax, P.p, pal.violet, 2.6);
      D.line(c, ax.X(o), ax.T, ax.X(o), ax.B, pal.green, 1.3, [3, 4]); D.label(c, "ovulation", ax.X(o), ax.B - 12, {size: 10.5, color: pal.green});
      D.line(c, ax.X(d), ax.T, ax.X(d), ax.B, pal.ink, 1.4, [5, 4]);
      [[hs.fsh, pal.amber], [hs.lh, pal.teal], [hs.e2, pal.red], [hs.p, pal.violet]].forEach(function(q){ D.dot(c, ax.X(d), ax.Y(q[0]), 5, q[1]); });
      D.legend(c, [[pal.amber, "FSH"], [pal.teal, "LH"], [pal.red, "œstrogènes"], [pal.violet, "progestérone"]], ax.R - 4, ax.T + 2, {align: "right"});
      ro.set(0, phase(d, l)); ro.set(1, "jour " + o); ro.set(2, S.fmt(fm, 0) + " mm"); ro.set(3, S.fmt(em, 0) + " mm");
      var dom = d <= 5 ? "Les œstrogènes et la progestérone sont au plus bas : l'endomètre se détache (règles)." : d < o - 1 ? "La FSH fait grandir des follicules ; le follicule dominant sécrète de plus en plus d'œstrogènes, qui épaississent l'endomètre." : d <= o ? "Pic d'œstrogènes puis pic de LH : l'ovulation a lieu environ 24 à 36 h après le début du pic de LH." : "Le corps jaune sécrète progestérone et œstrogènes : l'endomètre se prépare à la nidation. Sans fécondation, ils chutent et les règles reviennent.";
      nt.set(dom + (l !== 28 ? " Dans un cycle de " + l + " jours, l'ovulation a lieu le jour " + o + ", pas le 14e." : ""), "ok");
    });
  }
});

/* ---------- pilule ---------- */
function pilule2(forg){                 /* forg[i] = true si le comprimé du jour i (29 à 49) est oublié */
  var days = 84, taken = [], i;
  for (i = 1; i <= days; i++){ var pk = (i - 1) % 28; taken[i] = pk < 21 && !(forg[i]); }
  var F = 4, out = [], runMax = 0, run = 0, ov = -1;
  for (i = 1; i <= days; i++){
    if (taken[i]){ F = Math.max(4, F - 1.5); run = 0; } else { F += 1.3; run++; runMax = i >= 25 && i <= 60 ? Math.max(runMax, run) : runMax; }
    if (F >= 18 && ov < 0 && i >= 29 && i <= 70) ov = i;
    out.push([i, F]);
  }
  return {taken: taken, F: out, run: runMax, ov: ov};
}
SFA.sim({
  id: "b5-c09-pilule", ch: "c09", tag: "Contraception",
  titre: "La pilule combinée : pourquoi un oubli peut compter",
  resume: "Touche les comprimés pour les « oublier » : jours sans hormone, freinage de l'hypophyse et croissance du follicule.",
  but: "Voici la 2e plaquette (21 comprimés puis 7 jours de pause). Touche un comprimé pour l'oublier (ou utilise les réglages rapides), puis regarde les jours défiler : tant que les hormones de la pilule sont là, l'hypophyse est freinée et le follicule ne grandit pas. Défi : oublie 3 comprimés sans jamais dépasser 7 jours d'affilée sans hormone.",
  aRetenir: "La pilule apporte œstrogène et progestatif de synthèse : par rétrocontrôle négatif, FSH et LH restent bas, le follicule ne mûrit pas, il n'y a pas de pic de LH, donc pas d'ovulation ; la glaire cervicale est épaisse et l'endomètre mince. Ce qui compte, c'est la durée sans hormone : un oubli au début ou à la fin d'une plaquette allonge la pause et laisse un follicule croître.",
  piege: "La pilule n'agit pas seulement comme une « barrière » : elle empêche surtout l'ovulation. Cette simulation est pédagogique : les chiffres sont des illustrations, pas des règles. En cas d'oubli réel, il faut suivre la notice ou demander conseil à un médecin ou un pharmacien. La pilule ne protège pas des infections sexuellement transmissibles.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var forg = {}, i;
    function preset(){ forg = {}; var mm = m.value, s0 = pos.value === "d" ? 29 : pos.value === "m" ? 36 : 49 - mm + 1; for (i = s0; i < s0 + mm && i <= 49; i++) forg[i] = true; }
    var m = k.slider("Comprimés oubliés (réglage rapide)", 0, 7, 1, 2, "", function(){ preset(); });
    var pos = k.seg("Où dans la plaquette ?", [["d", "début"], ["m", "milieu"], ["f", "fin"]], "d", function(){ preset(); });
    var ro = k.readouts(["Comprimés oubliés", "Jours sans hormone d'affilée", "Taille max du follicule", "Ovulation possible ?"]);
    var nt = k.note("", "");
    preset();
    var day = 22, an = 0, play = true, geo = {}, drag = false, rnd = B5.rng(3), Q = [];
    for (i = 0; i < 20; i++) Q.push({o: rnd(), u: rnd()});
    k.button("Lecture / pause des jours", function(){ play = !play; if (play && day >= 56.9) day = 22; }, true);
    k.button("Aucun oubli", function(){ forg = {}; });
    var lp = k.loop(function(dt){ an += dt; if (play){ day += dt * 2.5; if (day >= 56.99){ day = 56.99; play = false; } } k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down"){
        drag = false;
        if (geo.ax && p.y > geo.gy){ drag = true; }
        else if (geo.cs){ var col = Math.floor((p.x - geo.bx) / geo.cs), row = Math.floor((p.y - geo.by) / geo.cs); if (col >= 0 && col < 7 && row >= 0 && row < 3){ var d = 29 + row * 7 + col; forg[d] = !forg[d]; } }
      }
      if (drag && (t === "down" || t === "drag")){ day = B5.cl(geo.ax.ix(p.x), 22, 56.99); play = false; }
      if (t === "up") drag = false;
    });
    k.draw(function(){
      var r = pilule2(forg), nF = 0, d0 = Math.floor(day), Fd = r.F[d0 - 1][1] + (r.F[Math.min(83, d0)][1] - r.F[d0 - 1][1]) * (day - d0);
      for (i = 29; i <= 49; i++) if (forg[i]) nF++;
      var hormone = r.taken[d0], off = 0; for (i = d0; i >= 1 && !r.taken[i]; i--) off++;
      var block = hormone ? 1 : off <= 7 ? 0.6 : 0;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 250;
      D.rrect(c, 6, 6, W - 12, sh, 12); ctx.fillStyle = "#f5f3f8"; ctx.fill();
      /* plaquette */
      var cs = Math.min(36, (W * 0.6 - 30) / 7), bx = 20, by = 46; geo.cs = cs; geo.bx = bx; geo.by = by;
      D.text(c, "2e plaquette", bx, 22, {align: "left", size: 11.5, color: pal.ink, weight: 900});
      D.rrect(c, bx - 8, by - 10, 7 * cs + 16, 4 * cs + 22, 10); var gm = ctx.createLinearGradient(0, by, 0, by + 4 * cs); gm.addColorStop(0, "#eef1f5"); gm.addColorStop(1, "#cfd6df"); ctx.fillStyle = gm; ctx.fill(); ctx.strokeStyle = "#9aa6b5"; ctx.lineWidth = 1.5; ctx.stroke();
      for (i = 0; i < 28; i++){
        var dd = 29 + i, col = i % 7, row = Math.floor(i / 7), X = bx + col * cs + cs / 2, Y = by + row * cs + cs / 2, rr = cs * 0.36;
        B5.circ(c, X, Y, rr + 2, "rgba(255,255,255,.7)", "#aeb8c5", 1);
        if (i < 21 && !forg[dd]){ var gp = ctx.createRadialGradient(X - rr * 0.3, Y - rr * 0.3, 1, X, Y, rr); gp.addColorStop(0, "#fff"); gp.addColorStop(1, dd < day ? "#e7b8c7" : "#f3c9d6"); ctx.fillStyle = gp; ctx.beginPath(); ctx.arc(X, Y, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = "#c27a95"; ctx.lineWidth = 1.2; ctx.stroke(); if (dd < day){ D.line(c, X - rr * 0.5, Y, X + rr * 0.5, Y, "rgba(120,60,80,.5)", 1.5); } }
        else if (i < 21){ B5.circ(c, X, Y, rr, "#fff", pal.red, 2); D.text(c, "✕", X, Y + 0.5, {size: Math.max(10, rr), color: pal.red, weight: 900}); }
        else { D.text(c, "–", X, Y, {size: 12, color: "#8a95a3", weight: 800}); }
        if (dd === d0) { ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(X, Y, rr + 4, 0, 6.283); ctx.stroke(); }
      }
      D.text(c, "touche un comprimé pour l'oublier", bx - 4, by + 4 * cs + 22, {size: 9.5, color: pal.grey, weight: 800, align: "left"});
      /* hypophyse → ovaire */
      var rx0 = bx + 7 * cs + 22, rw = W - rx0 - 14, rcx = rx0 + rw / 2;
      ctx.fillStyle = "#f6c9d3"; ctx.strokeStyle = "#c27a8a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(rcx, 32, Math.min(56, rw / 2), 18, 0, Math.PI, 2 * Math.PI); ctx.fill(); ctx.stroke();
      B5.circ(c, rcx, 38, 7, "#e48aa2", "#9b2c4a", 1.6);
      D.text(c, "hypophyse", rcx, 55, {size: 10, color: "#9b2c4a", weight: 800});
      var oy = 184, fol = B5.cl(Fd, 4, 24);
      ctx.fillStyle = "#f6cdd4"; ctx.strokeStyle = "#c27a8a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(rcx, oy, Math.min(50, rw / 2 - 2), 30, 0, 0, 6.283); ctx.fill(); ctx.stroke();
      var frp = 3 + fol * 0.9; B5.circ(c, rcx + 8, oy - 2, frp, "rgba(255,248,225,.95)", fol >= 18 ? pal.red : "#c99a3a", 2); B5.circ(c, rcx + 8 + frp * 0.35, oy - 2 - frp * 0.2, 3, "#f4b6c2", "#9b2c4a", 1);
      D.text(c, "ovaire · follicule " + S.fmt(Fd, 0) + " mm", rcx, oy + 42, {size: 10, color: fol >= 18 ? pal.red : "#8a5a10", weight: 800});
      var nP = Math.round((1 - block) * 10 + (block < 1 ? 2 : 1));
      for (i = 0; i < nP; i++){ var f = (Q[i].o + an * 0.45) % 1, py = 60 + f * (oy - 40 - 60); if (block >= 1 && py > 96) continue; B5.circ(c, rcx - 14 + Q[i].u * 28, py, 3, i % 2 ? pal.teal : pal.blue, "#fff", 1); }
      D.text(c, "FSH, LH", rcx + Math.min(46, rw / 2 - 4), 82, {size: 9.5, color: pal.teal, weight: 800, align: "right"});
      if (block > 0){ D.rrect(c, rcx - Math.min(44, rw / 2 - 4), 104, 2 * Math.min(44, rw / 2 - 4), 10, 5); ctx.fillStyle = block >= 1 ? "rgba(192,50,29,.85)" : "rgba(192,50,29,.4)"; ctx.fill(); D.text(c, hormone ? "freinage par la pilule" : "freinage faiblit", rcx, 124, {size: 9.5, color: pal.red, weight: 800}); }
      else D.text(c, "hypophyse libérée !", rcx, 124, {size: 9.5, color: pal.red, weight: 800});
      D.label(c, (d0 < 29 ? "pause" : "jour " + (d0 - 28) + "/28") + (hormone ? " · hormone prise" : " · sans hormone : " + off + " j"), bx, by + 4 * cs + 42, {size: 10.5, color: hormone ? pal.green : pal.red, align: "left"});
      /* ---------- courbe ---------- */
      var gy = sh + 14; geo.gy = gy - 4; D.panel(c, 6, gy - 2, W - 12, H - gy - 2, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 22, x1: 57, y0: 0, y1: 24, xl: "jour (1 = début de la 1re plaquette) · glisse", stepX: 7, stepY: 6, t: gy + 40, b: 34, l: 40, r: 16}); geo.ax = ax;
      D.text(c, "follicule (mm)", 14, gy + 12, {size: 11, color: pal.grey, align: "left"});
      for (i = 22; i <= 56; i++){ ctx.fillStyle = r.taken[i] ? "rgba(36,119,90,.75)" : (i >= 29 && i <= 49 ? pal.red : "#c8ceda"); ctx.fillRect(ax.X(i) + 0.5, gy + 22, Math.max(1, ax.X(i + 1) - ax.X(i) - 1), 8); }
      D.text(c, "hormone prise", ax.R, gy + 12, {align: "right", size: 9.5, color: pal.green});
      ctx.fillStyle = "rgba(180,35,24,.08)"; ctx.fillRect(ax.L, ax.Y(24), ax.R - ax.L, ax.Y(18) - ax.Y(24));
      D.line(c, ax.L, ax.Y(18), ax.R, ax.Y(18), pal.red, 1.4, [5, 4]); D.text(c, "18 mm : ovulation possible", ax.R - 4, ax.Y(21), {align: "right", size: 10.5, color: pal.red});
      var pts = r.F.filter(function(p){ return p[0] >= 22 && p[0] <= 57; });
      B5.poly(c, ax, pts, "rgba(98,54,196,.25)", 2); B5.poly(c, ax, pts.filter(function(p){ return p[0] <= day; }).concat([[day, Fd]]), pal.violet, 3);
      D.line(c, ax.X(day), ax.T, ax.X(day), ax.B, pal.ink, 1.2, [4, 3]); D.dot(c, ax.X(day), ax.Y(Fd), 5, pal.violet);
      var mx = Math.max.apply(null, pts.filter(function(p){ return p[0] >= 29; }).map(function(p){ return p[1]; }));
      ro.set(0, String(nF)); ro.set(1, r.run + " j"); ro.set(2, S.fmt(mx, 1) + " mm"); ro.set(3, mx >= 18 ? "oui (dans ce modèle)" : "non");
      if (nF === 3 && r.run <= 7) nt.set("Défi réussi : 3 oublis, mais jamais plus de 7 jours d'affilée sans hormone. Les oublis loin de la pause sont les moins risqués ; ils restent des oublis (suivre la notice).", "ok");
      else if (r.run <= 7) nt.set("Pause de 7 jours maximum : le freinage hormonal est repris avant que le follicule ne mûrisse. Les règles de privation viennent de la chute d'hormones pendant la pause." + (nF !== 3 ? " Défi : oublie exactement 3 comprimés en restant à 7 jours maximum." : ""), "ok");
      else if (mx >= 18) nt.set(r.run + " jours sans hormone : le follicule atteint " + S.fmt(mx, 1) + " mm dans ce modèle, une ovulation devient possible. En pratique, un oubli demande de suivre la notice (comprimé à prendre dès que possible, précautions supplémentaires) et parfois la contraception d'urgence.", "warn");
      else nt.set(r.run + " jours sans hormone d'affilée (au lieu de 7 au maximum) : les oublis collés à la pause l'allongent. Le follicule grandit jusqu'à " + S.fmt(mx, 1) + " mm : risque non négligeable. Demande conseil (notice, pharmacien).", "warn");
    });
  }
});

/* ---------- fenêtre de fertilité ---------- */
var CONC = {"-5": 0.10, "-4": 0.16, "-3": 0.14, "-2": 0.27, "-1": 0.31, "0": 0.33};
var EVT = [[0, "Ovulation : l'ovocyte II quitte l'ovaire et entre dans la trompe"], [0.5, "Fécondation dans l'ampoule de la trompe : le zygote a 46 chromosomes"], [1.5, "1ʳᵉ division : 2 cellules (segmentation)"], [3, "Morula (≈ 16 cellules), qui arrive dans l'utérus"], [5, "Blastocyste (≈ 100 cellules) : le massif embryonnaire et le trophoblaste se distinguent"], [7, "Nidation : le blastocyste s'implante dans l'endomètre"], [10, "Nidation terminée : sécrétion d'hCG (détectable dans le sang)"]];
SFA.sim({
  id: "b5-c09-fenetre", ch: "c09", tag: "Calendrier",
  titre: "La fenêtre de fertilité : quels jours risquent une fécondation ?",
  resume: "Durée du cycle et jour du rapport → probabilité de conception ; jours suivant l'ovulation.",
  but: "Touche un jour du calendrier pour y placer un rapport non protégé (ou utilise le curseur) et change la durée du cycle : lis la probabilité de conception et repère la fenêtre fertile (6 jours). Déplace ensuite le curseur du temps après l'ovulation pour suivre le trajet de l'embryon, de la fécondation à la nidation.",
  aRetenir: "L'ovocyte reste fécondable environ 12 à 24 h, mais les spermatozoïdes peuvent survivre jusqu'à 5 jours dans les voies génitales féminines : la fenêtre fertile compte donc les 5 jours avant l'ovulation et le jour de l'ovulation. Fécondation (dans la trompe) et nidation (dans l'utérus, vers 6 à 10 jours) sont deux événements différents.",
  piege: "Fécondation et nidation ne sont pas la même chose ; l'ovulation n'est pas le 14e jour de tous les cycles ; et la méthode du calendrier (ou « Ogino ») est peu fiable comme contraception parce que le jour de l'ovulation varie d'un cycle à l'autre. Probabilités : ordre de grandeur d'études d'observation (couples cherchant une grossesse).",
  build: function(k, S){
    var c = k.canvas(470), pal = S.draw.palette, D = S.draw;
    var L = k.slider("Durée du cycle", 21, 35, 1, 28, "jours");
    var d = k.slider("Jour du rapport", 1, 35, 1, 12, "");
    var t = k.slider("Temps écoulé depuis l'ovulation", 0, 10, 0.5, 0, "jours");
    var ro = k.readouts(["Jour de l'ovulation", "Fenêtre fertile", "Probabilité de conception (ce jour)", "Étape"]);
    var nt = k.note("", "");
    var geo = {};
    c.cv.style.touchAction = "none";
    c.pointer(function(ty, p){ if (ty !== "down" || !geo.cells) return; geo.cells.forEach(function(q){ if (p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h){ d.set(q.d); k.redraw(); } }); });
    k.draw(function(){
      var l = L.value, o = l - 14, dj = Math.min(d.value, l), rel = dj - o;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H;
      /* ---------- calendrier ---------- */
      var cols = 7, rows = Math.ceil(l / cols), gap = 4, cw = (W - 32 - gap * 6) / cols, chh = 36, top = 62;
      D.rrect(c, 8, 8, W - 16, top + rows * (chh + gap) + 10, 12); ctx.fillStyle = "#faf8fd"; ctx.fill();
      D.text(c, "Cycle de " + l + " jours · touche un jour pour y placer le rapport", 18, 24, {align: "left", size: 12, color: pal.ink, weight: 800});
      geo.cells = [];
      for (var i = 1; i <= l; i++){
        var r = i - o, p = CONC[String(r)] || 0, col = (i - 1) % cols, row = Math.floor((i - 1) / cols), x = 16 + col * (cw + gap), y = top + row * (chh + gap);
        geo.cells.push({x: x, y: y, w: cw, h: chh, d: i});
        D.rrect(c, x, y, cw, chh, 8); ctx.fillStyle = p > 0 ? D.tint(pal.violet, .12 + 2.0 * p) : (i <= 5 ? "#fde9e6" : "#f1f3f7"); ctx.fill();
        if (i === dj){ ctx.strokeStyle = pal.red; ctx.lineWidth = 3; ctx.stroke(); }
        else if (p > 0){ ctx.strokeStyle = "rgba(98,54,196,.5)"; ctx.lineWidth = 1.2; ctx.stroke(); }
        D.text(c, i, x + 9, y + 11, {size: 10.5, color: p > .2 ? "#fff" : pal.grey, weight: 800, align: "left"});
        if (p > 0) D.text(c, S.fmt(p * 100, 0) + " %", x + cw / 2, y + chh - 11, {size: 11, color: p > .2 ? "#fff" : pal.violet, weight: 900});
        else if (i <= 5) D.text(c, "règles", x + cw / 2, y + chh - 11, {size: 10, color: pal.red, weight: 700});
        if (i === o){ B5.circ(c, x + cw - 11, y + 11, 6, "#fff", pal.green, 2.5); }
        if (i === dj){ B5.circ(c, x + cw - 11, y + 11, 5, pal.red); }
      }
      var ly = top + rows * (chh + gap) - 2;
      B5.circ(c, 24, 42, 5, "#fff", pal.green, 2.5); D.text(c, "ovulation", 34, 42, {align: "left", size: 11, color: pal.ink, weight: 700}); B5.circ(c, 104, 42, 5, pal.red); D.text(c, "rapport choisi", 114, 42, {align: "left", size: 11, color: pal.ink, weight: 700}); D.text(c, "% = chance de conception", W - 18, 42, {align: "right", size: 11, color: pal.violet, weight: 700});
      /* ---------- trajet de l'embryon ---------- */
      var sy = ly + 28, sh = H - sy - 8;
      D.rrect(c, 8, sy, W - 16, sh, 12); ctx.fillStyle = "#fdf4f2"; ctx.fill();
      D.text(c, "Après l'ovulation : jour " + S.fmt(t.value, t.value % 1 ? 1 : 0), 18, sy + 16, {align: "left", size: 12, color: pal.ink, weight: 800});
      var x0 = 40, x1 = W - 34, yc = sy + sh * .56;
      /* trompe */
      ctx.lineCap = "round"; ctx.strokeStyle = "#e8a99e"; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x0, yc); ctx.bezierCurveTo(x0 + (x1 - x0) * .3, yc - 22, x0 + (x1 - x0) * .5, yc + 22, x0 + (x1 - x0) * .62, yc); ctx.stroke();
      ctx.strokeStyle = "#fbe4df"; ctx.lineWidth = 18; ctx.stroke();
      /* utérus */
      var ux = x0 + (x1 - x0) * .62, uw = x1 - ux + 12; D.rrect(c, ux, yc - sh * .3, uw, sh * .6, 24); ctx.fillStyle = "#fbe4df"; ctx.fill(); ctx.strokeStyle = "#e8a99e"; ctx.lineWidth = 3; ctx.stroke();
      D.rrect(c, ux + 6, yc + sh * .2, uw - 12, 9, 4); ctx.fillStyle = "#e08a7a"; ctx.fill();
      D.text(c, "endomètre", ux + uw / 2, yc + sh * .2 + 21, {size: 10, color: "#a5463a", weight: 700});
      D.text(c, "trompe", x0 + 24, yc - 24, {size: 10.5, color: "#a5463a", weight: 800}); D.text(c, "utérus", ux + uw / 2, yc - sh * .3 - 9, {size: 10.5, color: "#a5463a", weight: 800});
      var ticks = [[0, "ovulation"], [0.5, "fécond."], [1.5, "2 cell."], [3, "morula"], [5, "blastocyste"], [7, "nidation"]];
      function px(tt){ return x0 + 14 + (ux + uw * .4 - x0 - 14) * Math.min(1, tt / 7); }
      ticks.forEach(function(e){ var xx = px(e[0]); D.line(c, xx, yc + 22, xx, yc + 30, pal.grey, 1.2); if (e[0] === 0.5 || e[0] === 1.5) return; D.text(c, "J" + e[0], xx, yc + 40, {size: 9.5, color: pal.grey, weight: 700}); });
      var tv = t.value, xe = px(tv), ye = tv >= 7 ? yc + sh * .2 - 10 : yc + Math.sin(tv * 1.1) * 3;
      /* spermatozoïdes près de l'ampoule avant J1 */
      if (tv < 1){ for (var q = 0; q < 6; q++){ var sx = x0 + 22 + q * 12, sy2 = yc + (q % 2 ? 7 : -7); ctx.strokeStyle = pal.violet; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sx, sy2); ctx.lineTo(sx - 9, sy2 + 3); ctx.stroke(); B5.circ(c, sx, sy2, 2.2, pal.violet); } }
      /* embryon : dessin selon le stade */
      var R = 11;
      D.glow(c, xe, ye, 40, pal.amber, .4);
      if (tv < 0.5){ B5.circ(c, xe, ye, R, "#fff1ef", pal.red, 2); B5.circ(c, xe, ye, 4, "#f2b8ad"); }
      else if (tv < 1.5){ B5.circ(c, xe, ye, R, "#fff1ef", pal.red, 2); B5.circ(c, xe - 3.5, ye, 3.2, "#c9a7e8"); B5.circ(c, xe + 3.5, ye, 3.2, "#9bb8dd"); }
      else if (tv < 3){ [[-5, 0], [5, 0]].forEach(function(o2){ B5.circ(c, xe + o2[0] * 1.3, ye, 8, "#fff1ef", pal.red, 2); }); }
      else if (tv < 5){ B5.circ(c, xe, ye, R + 3, "#fff1ef", pal.red, 2); for (q = 0; q < 9; q++){ B5.circ(c, xe + Math.cos(q * 2.4) * (3 + q * .9), ye + Math.sin(q * 2.4) * (3 + q * .9), 3.2, "#f6c8bd", "#c9695b", 1); } }
      else if (tv < 7){ B5.circ(c, xe, ye, R + 5, "#e9f4fb", pal.red, 2); B5.circ(c, xe - 3, ye - 2, 6, "#f0a79b", "#c9695b", 1.5); D.text(c, "massif embryonnaire", xe, ye - R - 14, {size: 9.5, color: "#a5463a", weight: 700}); }
      else { B5.circ(c, xe, ye, R + 4, "#e9f4fb", pal.red, 2); B5.circ(c, xe, ye - 3, 6, "#f0a79b", "#c9695b", 1.5); ctx.fillStyle = "#b3392b"; ctx.fillRect(xe - 18, ye + R + 1, 36, 5); }
      var p0 = CONC[String(rel)] || 0, ev = EVT[0];
      EVT.forEach(function(e){ if (t.value >= e[0]) ev = e; });
      D.text(c, ev[1].split(":")[0], W / 2, sy + sh - 12, {size: 11.5, color: pal.ink, weight: 800});
      ro.set(0, "jour " + o); ro.set(1, "jours " + (o - 5) + " à " + o); ro.set(2, p0 > 0 ? S.fmt(p0 * 100, 0) + " %" : "≈ 0 %"); ro.set(3, ev[1]);
      nt.set(p0 > 0 ? "Rapport " + (rel < 0 ? Math.abs(rel) + " jour" + (rel < -1 ? "s" : "") + " avant" : "le jour de") + " l'ovulation : environ " + S.fmt(p0 * 100, 0) + " % de chances de conception pour ce rapport (ordre de grandeur). Un rapport 2 jours avant l'ovulation est le plus favorable avec celui de la veille et du jour même." : "Hors de la fenêtre fertile : la probabilité de conception est très faible dans ce modèle, mais l'estimation du jour d'ovulation reste incertaine d'un cycle à l'autre.", p0 > 0 ? "ok" : "warn");
    });
  }
});

/* ---------- test de grossesse ---------- */
function hcg(d){ return d < 8 ? 0 : Math.min(1e5, 4 * Math.pow(2, (d - 9) / 1.8)); }
SFA.sim({
  id: "b5-c09-hcg", ch: "c09", tag: "Biologie médicale",
  titre: "Test de grossesse : l'hCG double tous les 2 jours",
  resume: "Nidation, sécrétion d'hCG par le trophoblaste, corps jaune maintenu ; test urinaire positif ou non.",
  but: "Glisse le jour après l'ovulation sur le graphique : suis le blastocyste jusqu'à la nidation, puis l'hCG sécrétée par le trophoblaste qui maintient le corps jaune. Choisis la sensibilité du test et appuie sur « Faire le test » pour voir l'urine migrer sur la bandelette. Défi : trouve le premier jour où ce test devient positif.",
  aRetenir: "L'hCG est sécrétée par le trophoblaste de l'embryon après la nidation. Elle augmente d'environ le double tous les 2 jours au début : on la détecte dans le sang vers 8 à 10 jours après l'ovulation, et dans l'urine par un test dès le jour du retard de règles (seuil ≈ 25 mUI/mL). Elle maintient le corps jaune, qui continue de sécréter la progestérone.",
  piege: "Un test négatif très tôt ne prouve pas l'absence de grossesse (faux négatif) : l'hCG n'a pas encore atteint le seuil. Un test positif doit être confirmé par un médecin. Courbe : moyenne théorique, la variation individuelle est grande.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var d = k.slider("Jours après l'ovulation", 0, 42, 1, 6, "j", function(){ mig = -1; });
    var th = k.seg("Sensibilité du test", [["10", "10 mUI/mL"], ["25", "25 mUI/mL"], ["50", "50 mUI/mL"]], "25", function(){ mig = -1; });
    var ro = k.readouts(["hCG estimée", "Test", "Semaines d'aménorrhée (SA)", "Corps jaune"]);
    var nt = k.note("", "");
    var an = 0, mig = -1, geo = {}, drag = false, rnd = B5.rng(8), Q = [], i;
    for (i = 0; i < 30; i++) Q.push({o: rnd(), u: rnd()});
    k.button("Faire le test ce jour-là", function(){ mig = 0; }, true);
    var lp = k.loop(function(dt){ an += dt; if (mig >= 0 && mig < 1) mig = Math.min(1, mig + dt / 2.2); k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down") drag = geo.ax && p.y > geo.gy;
      if (drag && (t === "down" || t === "drag")){ var v = B5.cl(Math.round(geo.ax.ix(p.x)), 0, 42); if (v !== d.value){ d.set(v); mig = -1; } }
      if (t === "up") drag = false;
    });
    k.draw(function(){
      var T = parseInt(th.value, 10), dd = d.value, h = hcg(dd), pos = h >= T, first = null, j;
      for (j = 8; j <= 42; j++) if (hcg(j) >= T){ first = j; break; }
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 250;
      D.rrect(c, 6, 6, W - 12, sh, 12); ctx.fillStyle = "#f8f3f5"; ctx.fill();
      /* utérus, trompe, ovaire */
      var bw = Math.min(110, W * 0.28), bx = W - bw - 18, sw = Math.min(W - 150, 330), ux = 16 + sw * 0.45, uy = 120, uw = sw * 0.27;
      ctx.fillStyle = "#e9a7b4"; ctx.strokeStyle = "#a94f63"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(ux - uw, uy - 60); ctx.quadraticCurveTo(ux, uy - 78, ux + uw, uy - 60); ctx.quadraticCurveTo(ux + uw * 1.05, uy + 30, ux + 16, uy + 92); ctx.lineTo(ux - 16, uy + 92); ctx.quadraticCurveTo(ux - uw * 1.05, uy + 30, ux - uw, uy - 60); ctx.closePath(); ctx.fill(); ctx.stroke();
      var endo = 0.55 + 0.45 * B5.cl(dd / 7, 0, 1);
      ctx.fillStyle = "#f6d1d8"; ctx.beginPath(); ctx.moveTo(ux - uw * 0.62, uy - 48); ctx.quadraticCurveTo(ux, uy - 56, ux + uw * 0.62, uy - 48); ctx.quadraticCurveTo(ux + uw * 0.55, uy + 20, ux + 6, uy + 70); ctx.lineTo(ux - 6, uy + 70); ctx.quadraticCurveTo(ux - uw * 0.55, uy + 20, ux - uw * 0.62, uy - 48); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff4f6"; var cw = uw * (0.62 - 0.3 * endo); ctx.beginPath(); ctx.moveTo(ux - cw, uy - 40); ctx.quadraticCurveTo(ux, uy - 46, ux + cw, uy - 40); ctx.quadraticCurveTo(ux + cw * 0.8, uy + 20, ux + 2, uy + 64); ctx.lineTo(ux - 2, uy + 64); ctx.quadraticCurveTo(ux - cw * 0.8, uy + 20, ux - cw, uy - 40); ctx.closePath(); ctx.fill();
      D.text(c, "utérus · endomètre", ux, uy + 104, {size: 9.5, color: "#a94f63", weight: 800});
      /* trompe droite + ovaire avec corps jaune */
      var tx0 = ux + uw, ty0 = uy - 58, ox = Math.min(bx - 34, ux + uw + 50), oy = uy - 24;
      ctx.strokeStyle = "#d48a9c"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tx0 - 6, ty0); ctx.quadraticCurveTo(ox - 10, ty0 - 34, ox + 6, oy - 26); ctx.stroke();
      ctx.strokeStyle = "#f6d1d8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx0 - 6, ty0); ctx.quadraticCurveTo(ox - 10, ty0 - 34, ox + 6, oy - 26); ctx.stroke();
      ctx.fillStyle = "#f6cdd4"; ctx.strokeStyle = "#c27a8a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ox, oy, 26, 17, 0.3, 0, 6.283); ctx.fill(); ctx.stroke();
      var cjAlive = dd < 12 || h >= 3, cjR = cjAlive ? 9 + Math.min(4, dd / 6) : Math.max(3, 9 - (dd - 12) * 0.8);
      B5.circ(c, ox + 4, oy - 2, cjR, cjAlive ? "#f2c94c" : "#d8cfb8", cjAlive ? "#b58a10" : "#9a9280", 1.6);
      D.text(c, "corps jaune", ox, oy + 28, {size: 9.5, color: "#8a6508", weight: 800});
      if (cjAlive && dd >= 8){ for (i = 0; i < 4; i++){ var fp = (Q[i].o + an * 0.5) % 1; B5.circ(c, ox - 6 - fp * (ox - ux - 18), oy + 6 + fp * 40, 2.6, pal.amber); } D.text(c, "progestérone", (ox + ux) / 2 + 8, oy + 52, {size: 9, color: pal.amber, weight: 800}); }
      /* l'embryon : trajet, nidation, trophoblaste */
      var ex, ey, er;
      if (dd < 5){ var f = dd / 5, u = 1 - f; ex = u * u * (ox + 6) + 2 * u * f * (ox - 10) + f * f * (tx0 - 6); ey = u * u * (oy - 26) + 2 * u * f * (ty0 - 34) + f * f * ty0; er = 4 + dd * 0.4; }
      else if (dd < 7){ var f2 = (dd - 5) / 2; ex = tx0 - 6 - f2 * (tx0 - 6 - ux - cw * 0.5); ey = ty0 + f2 * 34; er = 6; }
      else { ex = ux + cw * 0.55; ey = uy - 20; er = 6 + Math.min(14, (dd - 7) * 0.5); }
      if (dd >= 7){ ctx.fillStyle = "rgba(196,58,122,.35)"; ctx.beginPath(); ctx.arc(ex + er * 0.4, ey, er + 6, -1.2, 1.2); ctx.fill(); }
      B5.circ(c, ex, ey, er, "#fff6e6", "#c43a7a", 2); B5.circ(c, ex - er * 0.35, ey, er * 0.45, "#e6a7c3");
      var lab = dd === 0 ? "ovocyte fécondé" : dd < 3 ? "segmentation" : dd < 5 ? "morula" : dd < 7 ? "blastocyste" : dd < 10 ? "nidation" : "embryon + trophoblaste";
      D.label(c, lab, Math.min(Math.max(ex, 60), W - 190), ey - er - 14, {size: 10, color: "#c43a7a"});
      var nh = h > 0 ? Math.min(18, Math.round(Math.log10(h + 1) * 4)) : 0;
      for (i = 0; i < nh; i++){ var q = Q[i + 6], fh = (q.o + an * 0.4) % 1; var hx = ex + er + fh * (ox - ex - er - 20), hy = ey + Math.sin(fh * 3.14) * -24 + (q.u - 0.5) * 16; ctx.fillStyle = pal.violet; ctx.save(); ctx.translate(hx, hy); ctx.rotate(an + i); ctx.fillRect(-2.5, -2.5, 5, 5); ctx.restore(); }
      if (nh) D.text(c, "hCG", (ex + ox) / 2, ey - 36, {size: 10.5, color: pal.violet, weight: 900});
      D.label(c, "J" + dd + " après l'ovulation", 16, 22, {align: "left", size: 10.5, color: pal.ink});
      /* bandelette de test */
      var by = 24, bh = 212;
      D.rrect(c, bx, by, bw, bh, 18); ctx.fillStyle = "#fdfdfd"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; ctx.stroke();
      var wx = bx + bw * 0.3, ww = bw * 0.4, wy = by + 40, wh = 110;
      D.rrect(c, wx, wy, ww, wh, 6); ctx.fillStyle = "#f4f6f9"; ctx.fill(); ctx.strokeStyle = "#aeb8c5"; ctx.stroke();
      var fill = mig < 0 ? 0 : mig; if (fill > 0){ ctx.fillStyle = "rgba(244,197,66,.22)"; ctx.fillRect(wx + 2, wy + wh - 2 - (wh - 4) * fill, ww - 4, (wh - 4) * fill); }
      var yT = wy + wh * 0.62, yC = wy + wh * 0.25;
      if (fill > 0.5){ ctx.fillStyle = "#c2185b"; ctx.fillRect(wx + 4, yC - 3, ww - 8, 6); }
      if (fill > 0.85 && pos){ ctx.globalAlpha = Math.min(1, 0.25 + 0.75 * Math.log10(h / T + 1) / 2) * Math.min(1, (fill - 0.85) / 0.15); ctx.fillStyle = "#c2185b"; ctx.fillRect(wx + 4, yT - 3, ww - 8, 6); ctx.globalAlpha = 1; }
      D.text(c, "C", wx - 10, yC, {size: 11, color: pal.grey}); D.text(c, "T", wx - 10, yT, {size: 11, color: pal.grey});
      D.rrect(c, bx + bw / 2 - 12, by + bh - 34, 24, 22, 6); ctx.fillStyle = "#e3e7ed"; ctx.fill();
      D.text(c, "urine ↑", bx + bw / 2, by + bh - 46, {size: 9.5, color: pal.grey, weight: 800});
      D.text(c, mig < 0 ? "« Faire le test »" : fill < 1 ? "migration…" : pos ? "POSITIF" : "négatif", bx + bw / 2, by + 20, {size: mig >= 1 ? 12 : 10, color: mig >= 1 ? (pos ? pal.red : pal.grey) : pal.grey, weight: 900});
      /* ---------- courbe ---------- */
      var gy = sh + 14; geo.gy = gy - 4; D.panel(c, 6, gy - 2, W - 12, H - gy - 2, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 42, y0: 0, y1: 5.5, xl: "jours après l'ovulation · glisse", stepX: 7, stepY: 1, t: gy + 24, b: 34, l: 40, r: 16}); geo.ax = ax;
      D.text(c, "log₁₀ hCG (mUI/mL)", 14, gy + 12, {size: 11, color: pal.grey, align: "left"});
      ctx.fillStyle = "rgba(196,58,122,.08)"; ctx.fillRect(ax.X(7), ax.T, ax.X(10) - ax.X(7), ax.B - ax.T); D.text(c, "nidation", ax.X(8.5), ax.B - 10, {size: 9.5, color: "#c43a7a"});
      var pts = []; for (var x = 8; x <= 42; x += 0.5) pts.push([x, Math.log10(Math.max(1, hcg(x)))]);
      B5.poly(c, ax, pts, pal.violet, 2.8);
      D.line(c, ax.L, ax.Y(Math.log10(T)), ax.R, ax.Y(Math.log10(T)), pal.red, 1.5, [5, 4]); D.label(c, "seuil du test " + T, ax.R - 4, ax.Y(Math.log10(T)) + 12, {align: "right", size: 10, color: pal.red});
      D.line(c, ax.X(14), ax.T, ax.X(14), ax.B, pal.green, 1.2, [3, 4]); D.text(c, "règles attendues", ax.X(14) + 4, ax.T + 10, {align: "left", size: 10, color: pal.green});
      D.line(c, ax.X(dd), ax.T, ax.X(dd), ax.B, pal.ink, 1.3, [5, 4]);
      D.dot(c, ax.X(dd), ax.Y(Math.log10(Math.max(1, h))), 6, pos ? pal.red : pal.violet);
      ro.set(0, h > 0 ? S.fmt(h, h < 10 ? 1 : 0) + " mUI/mL" : "indétectable (avant nidation)"); ro.set(1, mig >= 1 ? (pos ? "positif" : "négatif") : "pas encore fait"); ro.set(2, S.fmt((14 + dd) / 7, 1) + " SA (cycle de 28 j)"); ro.set(3, dd < 12 ? "actif (cycle normal)" : cjAlive ? "maintenu par l'hCG" : "régresse");
      if (dd === first) nt.set("Défi réussi : avec un test à " + T + " mUI/mL, le premier jour positif est J" + first + " après l'ovulation" + (first > 14 ? ", soit " + (first - 14) + " jour(s) après le retard de règles." : first < 14 ? ", " + (14 - first) + " jour(s) avant les règles attendues : test très sensible." : ", le jour des règles attendues."), "ok");
      else if (dd < 8) nt.set("Avant la nidation, il n'y a pas d'hCG : un test est forcément négatif, même en cas de fécondation. Défi : trouve le premier jour positif.", "warn");
      else if (!pos) nt.set("hCG (" + S.fmt(h, 1) + " mUI/mL) encore sous le seuil : faux négatif possible. Refaire 2 à 3 jours plus tard.", "warn");
      else nt.set("hCG ≥ seuil : la bande T apparaît. " + (first !== null && dd > first ? "Mais ce n'est pas le premier jour positif : recule." : ""), "ok");
    });
  }
});
})();
