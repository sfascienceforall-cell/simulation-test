/* Chapitre 6 · Excrétion : reins et bilan hydrique */
(function(){
var TM = 225;     /* mg/min : transport maximal du glucose (seuil rénal ≈ 1,8 g/L pour un DFG de 125 mL/min) */

SFA.sim({
  id: "b5-c06-nephron", ch: "c06", tag: "Classique",
  titre: "Le néphron : filtrer, réabsorber, excréter",
  resume: "Débit de filtration, réabsorption de l'eau, glycémie → urine et bilan par jour.",
  but: "Suis les molécules dans le néphron : le glomérule filtre le plasma, le tubule réabsorbe presque tout. Fais varier le débit de filtration, la part d'eau réabsorbée (curseur ou point du graphique) et la glycémie. Cherche à partir de quelle glycémie le glucose apparaît dans l'urine, et ce que devient l'urée quand la filtration chute.",
  aRetenir: "Chaque jour environ 180 litres de filtrat se forment (DFG ≈ 125 mL/min) et plus de 99 % de l'eau est réabsorbée : il reste 1 à 2 L d'urine. Le glucose est filtré puis entièrement réabsorbé tant que la glycémie reste sous le seuil rénal (≈ 1,8 g/L) : au-delà, les transporteurs sont saturés et le glucose passe dans l'urine. L'urée n'est réabsorbée qu'en partie.",
  piege: "Excrétion ≠ défécation : excréter, c'est éliminer des déchets du métabolisme (urée, CO₂, eau en excès) du milieu intérieur ; les reins ne « fabriquent » pas l'urée (le foie la forme). Valeurs moyennes d'un modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var dfg = k.slider("Débit de filtration glomérulaire (DFG)", 20, 180, 5, 125, "mL/min");
    var rw = k.slider("Eau réabsorbée", 95, 99.9, 0.1, 99.2, "%");
    var gly = k.slider("Glycémie", 0.5, 4, 0.1, 1, "g/L");
    var ro = k.readouts(["Filtrat par jour", "Urine par jour", "Glucose dans l'urine", "Urée du sang à l'équilibre"]);
    var nt = k.note("", "");
    /* trajet du néphron en coordonnées relatives (x, y de 0 à 1) */
    var PTS = [[.20,.16],[.34,.12],[.48,.18],[.52,.30],[.40,.36],[.26,.34],[.24,.50],[.24,.80],[.34,.88],[.46,.80],[.46,.52],[.56,.46],[.70,.46],[.78,.36],[.86,.30],[.86,.94]];
    var SEG = [0, .09, .30, .52, .78, 1];             /* limites : capsule | proximal | anse | distal | collecteur */
    var N = 90, rnd = B5.rng(11), PW = [], PG = [], PU = [];
    for (var i = 0; i < N; i++) PW.push({u: (i + .5) / N, ph: rnd(), ex: .10 + rnd() * .5, side: rnd() < .5 ? -1 : 1});
    for (i = 0; i < 24; i++) PG.push({u: (i + .5) / 24, ph: rnd(), ex: .12 + rnd() * .12, side: rnd() < .5 ? -1 : 1});
    for (i = 0; i < 24; i++) PU.push({u: (i + .5) / 24, ph: rnd(), ex: .58 + rnd() * .2, side: rnd() < .5 ? -1 : 1});
    var tm = 0, geo = {}, drag = false;
    var lp = k.loop(function(dt){ tm += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down") drag = p.y > geo.gy;
      if (drag && (t === "down" || t === "drag") && geo.ax){ rw.set(Math.max(95, Math.min(99.9, Math.round(geo.ax.ix(p.x) * 10) / 10))); k.redraw(); }
      if (t === "up") drag = false;
    });
    k.draw(function(){
      var F = dfg.value * 1.44, U = F * (1 - rw.value / 100), load = gly.value * dfg.value, ex = Math.max(0, load - TM), gj = ex * 1.44, urea = 0.3 * 125 / dfg.value;
      var fracG = Math.min(1, TM / Math.max(load, 1));
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 372, ox = 8, sw = W - 16;
      D.rrect(c, 8, 8, sw, sh, 12); var bgr = ctx.createLinearGradient(0, 0, 0, sh); bgr.addColorStop(0, "#fff6f2"); bgr.addColorStop(1, "#fbe8e3"); ctx.fillStyle = bgr; ctx.fill();
      /* géométrie */
      var P = PTS.map(function(p){ return [ox + p[0] * sw, 8 + p[1] * sh]; }), L = [0], j;
      for (j = 1; j < P.length; j++) L.push(L[j - 1] + Math.hypot(P[j][0] - P[j - 1][0], P[j][1] - P[j - 1][1]));
      var TL = L[L.length - 1];
      function at(s){ var d = Math.max(0, Math.min(1, s)) * TL, q = 1; while (q < L.length - 1 && L[q] < d) q++; var f = (d - L[q - 1]) / (L[q] - L[q - 1] || 1), a = P[q - 1], b = P[q], nx = b[1] - a[1], ny = -(b[0] - a[0]), nl = Math.hypot(nx, ny) || 1; return {x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, nx: nx / nl, ny: ny / nl}; }
      /* capillaires péritubulaires (en arrière-plan) */
      ctx.save(); ctx.strokeStyle = "rgba(192,50,29,.18)"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); P.forEach(function(p, i2){ i2 ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
      /* tube : épaisseur selon l'eau restante */
      function wfrac(s){ return s < SEG[1] ? 1 : s < SEG[2] ? 1 - (s - SEG[1]) / (SEG[2] - SEG[1]) * .66 * (rw.value - 90) / 9.2 : Math.max(.12, 1 - .66 * (rw.value - 90) / 9.2 - (s - SEG[2]) / (1 - SEG[2]) * .22); }
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = "#e0a49a"; ctx.lineWidth = 13; ctx.beginPath(); P.forEach(function(p, i2){ i2 ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      ctx.strokeStyle = "#fdeaa8"; ctx.lineWidth = 9; ctx.stroke();
      ctx.restore();
      /* glomérule + capsule de Bowman */
      B5.circ(c, P[0][0] - 20, P[0][1], 28, "#fbd3cb", "#c0321d", 2.5);
      ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 3; ctx.beginPath(); for (var a = 0; a < 14; a++){ var an = a * 0.9, rr = 5 + a * 1.4; ctx.lineTo(P[0][0] - 20 + Math.cos(an) * rr, P[0][1] + Math.sin(an) * rr); } ctx.stroke();
      D.text(c, "glomérule", P[0][0] - 20, P[0][1] - 40, {size: 11, color: "#8a2a1a", weight: 800});
      D.arrow(c, P[0][0] - 60, P[0][1] + 40, P[0][0] - 34, P[0][1] + 16, pal.red, 2.5); D.text(c, "sang", P[0][0] - 60, P[0][1] + 52, {size: 10.5, color: pal.red, weight: 800});
      /* étiquettes des segments */
      D.label(c, "tube proximal", ox + .46 * sw, 8 + .05 * sh, {size: 10.5, color: pal.amber});
      D.label(c, "anse de Henle", ox + .36 * sw, 8 + .94 * sh, {size: 10.5, color: pal.teal});
      D.label(c, "tube distal", ox + .66 * sw, 8 + .56 * sh, {size: 10.5, color: pal.violet});
      D.label(c, "tube collecteur", ox + .86 * sw, 8 + .22 * sh, {size: 10.5, color: pal.green, align: "right"});
      /* particules */
      var sp = 0.07;
      function part(list, col, ring, rad, fracOut){
        list.forEach(function(p){
          var s = ((tm * sp + p.ph) % 1), out = p.u < fracOut(p), se = p.ex;
          if (out && s > se){ var q = at(se), d = (s - se) * 9 * 22, al = Math.max(0, 1 - (s - se) / 0.12); if (al <= 0) return; ctx.globalAlpha = al; B5.circ(c, q.x + p.side * q.nx * (8 + d), q.y + p.side * q.ny * (8 + d), rad, col, ring, 1); ctx.globalAlpha = 1; }
          else { var q2 = at(s); B5.circ(c, q2.x + Math.sin(tm * 3 + p.ph * 9) * 1.5, q2.y + Math.cos(tm * 3 + p.ph * 9) * 1.5, rad, col, ring, 1); }
        });
      }
      part(PW, "#4aa3e8", "#1f6fb5", 2.6, function(){ return rw.value / 100; });
      part(PG, "#f4c542", "#a56300", 3.8, function(){ return fracG; });
      part(PU, "#8a5a2b", "#4a2d10", 3.4, function(){ return .5; });
      /* urine à la sortie */
      var ue = at(1); D.arrow(c, ue.x, ue.y - 4, ue.x, ue.y + 18, pal.amber, 3);
      D.display(c, S.fmt(U, U < 10 ? 1 : 0) + " L", ue.x - 52, ue.y - 40, {w: 74, h: 42, caption: "urine / jour", size: 15});
      D.display(c, S.fmt(F, 0) + " L", P[0][0] + 20, P[0][1] + 66, {w: 74, h: 42, caption: "filtrat / jour", size: 15});
      D.legend(c, [["#4aa3e8", "eau"], ["#f4c542", "glucose"], ["#8a5a2b", "urée"]], 18, sh - 60, {box: true});
      if (gj > 0){ D.label(c, "glucose dans l'urine : " + S.fmt(gj, 0) + " g/j", ue.x - 10, ue.y - 70, {color: pal.red, align: "right", size: 11}); }
      /* graphique urine / réabsorption */
      var gy = sh + 20; geo.gy = gy - 6;
      D.panel(c, 8, gy - 4, sw, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 95, x1: 100, y0: 0, y1: 14, xl: "eau réabsorbée (%)  (glisse le point)", yl: "", stepX: 1, stepY: 4, t: gy + 8, b: 34, l: 40, r: 20});
      D.text(c, "urine (L/j)", 14, gy + 6, {size: 11, color: pal.grey, align: "left"});
      geo.ax = ax; var pts = []; for (var x = 95; x <= 100; x += 0.05) pts.push([x, dfg.value * 1.44 * (1 - x / 100)]);
      B5.poly(c, ax, pts, pal.violet, 3); D.glow(c, ax.X(rw.value), ax.Y(U), 18, pal.red, .5); D.dot(c, ax.X(rw.value), ax.Y(U), 7, pal.red);
      ro.set(0, S.fmt(F, 0) + " L"); ro.set(1, S.fmt(U, 2) + " L"); ro.set(2, gj > 0 ? S.fmt(gj, 0) + " g/j" : "aucun"); ro.set(3, S.fmt(urea, 2) + " g/L");
      if (dfg.value < 60) nt.set("DFG < 60 mL/min : insuffisance rénale. L'urée du sang monte (" + S.fmt(urea, 2) + " g/L au lieu de 0,30), car les reins n'éliminent plus assez.", "warn");
      else if (gj > 0) nt.set("Glycémie au-dessus du seuil rénal : le glucose dépasse la capacité de réabsorption (" + S.fmt(TM, 0) + " mg/min) et apparaît dans l'urine (glycosurie), signe possible de diabète.", "warn");
      else if (U > 3) nt.set("Urine > 3 L/j : polyurie. Une réabsorption réduite de l'eau (peu d'ADH) laisse passer beaucoup d'eau.", "warn");
      else if (U < 0.5) nt.set("Urine < 0,5 L/j : oligurie. Les déchets ne peuvent plus être éliminés avec assez d'eau.", "warn");
      else nt.set("Fonctionnement normal : " + S.fmt(100 * (1 - U / F), 1) + " % du filtrat est réabsorbé ; l'urine est un petit volume très concentré.", "ok");
    });
  }
});

/* ---------- hydratation et ADH ---------- */
SFA.sim({
  id: "b5-c06-adh", ch: "c06", tag: "Bilan hydrique",
  titre: "Boire, transpirer : l'ADH règle l'urine",
  resume: "Apports et pertes d'eau → volume d'urine, concentration, ADH, bilan.",
  but: "Règle ce que l'on boit et la sueur perdue sur une journée (curseurs, ou glisse sur les graphiques). Observe le tube collecteur : l'ADH ouvre des canaux à eau, l'eau retourne dans le sang et l'urine se concentre. Regarde le volume et la concentration de l'urine, le niveau d'ADH, et la limite où les reins ne peuvent plus compenser (déshydratation).",
  aRetenir: "Les reins doivent éliminer environ 600 mOsm de déchets par jour. Avec peu d'eau, l'ADH (hormone antidiurétique) augmente la réabsorption d'eau : l'urine est peu abondante et concentrée (jusqu'à 1 200 mOsm/L). Avec beaucoup d'eau, moins d'ADH : urine abondante et diluée (jusqu'à 50 mOsm/L). Bilan : entrées = sorties.",
  piege: "L'urine « jaune foncé » n'est pas un déchet « en plus » : c'est la même quantité de déchets dissoute dans moins d'eau. Quand la concentration maximale est atteinte, boire moins ne réduit plus l'urine : l'organisme se déshydrate. Valeurs moyennes simplifiées.",
  build: function(k, S){
    var c = k.canvas(500), pal = S.draw.palette, D = S.draw;
    var inp = k.slider("Eau absorbée (boissons + aliments)", 0.5, 6, 0.1, 2, "L/j");
    var sw = k.slider("Sueur", 0, 3, 0.1, 0.3, "L/j");
    var ro = k.readouts(["Urine", "Concentration de l'urine", "ADH", "Bilan de l'eau"]);
    var nt = k.note("", "");
    function calc(i, s){
      var bal = i + 0.3 - 0.9 - 0.1 - s, V = Math.max(0.5, bal), deficit = Math.max(0, 0.5 - bal), uo = Math.min(1200, 600 / V);
      return {bal: bal, V: V, deficit: deficit, uo: Math.max(50, uo), adh: Math.min(1, Math.max(0, (Math.max(50, uo) - 50) / 1150))};
    }
    var tm = 0, geo = {}, drag = 0, rnd = B5.rng(9), WD = [], AD = [], i;
    for (i = 0; i < 40; i++) WD.push({o: rnd(), y: rnd(), u: rnd()});
    for (i = 0; i < 16; i++) AD.push({o: rnd(), x: rnd()});
    var lp = k.loop(function(dt){ tm += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down"){ drag = p.y > geo.gy ? 1 : 0; } if (drag && (t === "down" || t === "drag") && geo.ax){ var xv = geo.ax.ix(p.x); inp.set(Math.max(0.5, Math.min(6, Math.round(xv * 10) / 10))); k.redraw(); } if (t === "up") drag = 0; });
    function glass(x, y, w, h, frac, col, label, sub){
      var ctx = c.ctx; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y + h); ctx.lineTo(x + w - 6, y + h); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fill();
      var lh = h * B5.cl(frac, 0, 1); ctx.save(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y + h); ctx.lineTo(x + w - 6, y + h); ctx.lineTo(x + w, y); ctx.closePath(); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(x, y + h - lh, w, lh); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(x + 6, y + h - lh, 6, lh); ctx.restore();
      ctx.strokeStyle = "#7b8694"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y + h); ctx.lineTo(x + w - 6, y + h); ctx.lineTo(x + w, y); ctx.stroke();
      D.text(c, label, x + w / 2, y - 14, {size: 11.5, color: pal.ink, weight: 800}); D.text(c, sub, x + w / 2, y + h + 14, {size: 11.5, color: pal.ink, weight: 900});
    }
    k.draw(function(){
      var r = calc(inp.value, sw.value);
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 250;
      D.rrect(c, 8, 8, W - 16, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#f3f7fc"); bg.addColorStop(1, "#e9eff8"); ctx.fillStyle = bg; ctx.fill();
      /* verres d'entrée */
      glass(24, 70, 56, 112, inp.value / 6, "rgba(90,170,235,.8)", "j'absorbe", S.fmt(inp.value, 1) + " L");
      for (i = 0; i < Math.round(sw.value * 5); i++){ var sx = 40 + (i % 5) * 9, sy = 214 + (i * 7) % 18; ctx.fillStyle = "rgba(47,127,209,.8)"; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 7); ctx.fill(); }
      D.text(c, "sueur " + S.fmt(sw.value, 1) + " L", 52, 246, {size: 10.5, color: pal.blue, weight: 800});
      /* tube collecteur */
      var tx0 = 112, tx1 = W - 130, ty = 150, th = 36, adh = r.adh, urcol = function(y){ return "rgb(" + Math.round(255 - 40 * y) + "," + Math.round(240 - 100 * y) + "," + Math.round(160 - 140 * y) + ")"; };
      D.text(c, "sang (capillaire)", (tx0 + tx1) / 2, 28, {size: 11, color: pal.red, weight: 800});
      ctx.fillStyle = "rgba(192,50,29,.14)"; D.rrect(c, tx0, 38, tx1 - tx0, 46, 14); ctx.fill();
      D.text(c, "tube collecteur", (tx0 + tx1) / 2, ty + th / 2 + 22, {size: 11, color: pal.amber, weight: 800});
      D.rrect(c, tx0, ty - th / 2, tx1 - tx0, th, th / 2); ctx.fillStyle = "#fdf2cf"; ctx.fill(); ctx.strokeStyle = "#d9a441"; ctx.lineWidth = 3; ctx.stroke();
      /* gradient de concentration le long du tube */
      ctx.save(); D.rrect(c, tx0 + 3, ty - th / 2 + 3, tx1 - tx0 - 6, th - 6, th / 2 - 3); ctx.clip(); var gg = ctx.createLinearGradient(tx0, 0, tx1, 0); gg.addColorStop(0, urcol(.05)); gg.addColorStop(1, urcol(Math.min(1, (r.uo - 50) / 1150))); ctx.fillStyle = gg; ctx.fillRect(tx0, ty - th / 2, tx1 - tx0, th); ctx.restore();
      /* canaux à eau (aquaporines) */
      var nq = 6, nopen = Math.round(adh * nq);
      for (i = 0; i < nq; i++){ var qx = tx0 + 40 + i * (tx1 - tx0 - 80) / (nq - 1), open = i < nopen; ctx.fillStyle = open ? pal.green : "#8a95a3"; ctx.fillRect(qx - 7, ty - th / 2 - 4, 5, 8); ctx.fillRect(qx + 2, ty - th / 2 - 4, 5, 8); if (open) D.glow(c, qx, ty - th / 2, 16, pal.green, .5); }
      /* eau qui part vers le sang (proportion adh), eau qui reste (1 − part) */
      WD.forEach(function(p, j){ var s = (tm * .18 + p.o) % 1, x = tx0 + 8 + s * (tx1 - tx0 - 16), y = ty + (p.y - .5) * (th - 14); var leave = p.u < adh * .92; var qx = tx0 + 40 + Math.floor(p.u / Math.max(.01, adh * .92) * Math.min(nq, Math.max(1, nopen))) * (tx1 - tx0 - 80) / (nq - 1);
        if (leave && s > .15){ var f = Math.min(1, (s - .15) * 2.2); var xq = tx0 + 40 + (j % Math.max(1, nopen)) * (tx1 - tx0 - 80) / (nq - 1); x = x + (xq - x) * f; y = y + (ty - th / 2 - 30 - y) * f; ctx.globalAlpha = 1 - Math.max(0, (f - .7) / .3) * .9; }
        else if (leave){} ctx.fillStyle = "#4aa3e8"; ctx.beginPath(); ctx.arc(x, y, 2.8, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
      /* ADH : molécules violettes qui arrivent du sang */
      var na = Math.round(2 + adh * 14); for (i = 0; i < na; i++){ var a = AD[i], ax2 = tx0 + 20 + a.x * (tx1 - tx0 - 40), s2 = (tm * .3 + a.o) % 1, ay = 46 + s2 * (ty - th / 2 - 52); B5.circ(c, ax2, ay, 4, pal.violet, "#fff", 1); }
      D.label(c, "ADH " + S.fmt(adh * 100, 0) + " %", tx1 - 8, 24, {color: pal.violet, size: 11.5, align: "right"});
      D.arrow(c, tx1 + 2, ty, tx1 + 34, ty, pal.amber, 3);
      /* verre d'urine */
      var ucol = urcol(Math.min(1, (r.uo - 50) / 1150)); glass(W - 100, 70, 64, 112, r.V / 6, ucol, "urine", S.fmt(r.V, 1) + " L/j");
      D.text(c, S.fmt(r.uo, 0) + " mOsm/L", W - 68, 214, {size: 11.5, color: "#8a6508", weight: 900});
      if (r.deficit > 0) D.label(c, "déshydratation", W / 2, sh - 4, {color: pal.red, size: 12});
      /* ---------- courbes ---------- */
      var gy = sh + 22; geo.gy = gy - 6; var mid = W / 2;
      D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0.5, x1: 6, y0: 0, y1: 6, xl: "eau absorbée (L/j)", stepX: 2, stepY: 2, t: gy + 24, b: 36, l: 34, r: mid + 10}); geo.ax = ax;
      D.text(c, "Urine (L/j)", 14, gy + 10, {size: 11.5, color: pal.ink, weight: 800, align: "left"});
      var p1 = [], p2 = [], x; for (x = 0.5; x <= 6.0001; x += 0.1){ p1.push([x, calc(x, sw.value).V]); p2.push([x, calc(x, sw.value).uo]); }
      B5.poly(c, ax, p1, pal.amber, 3); D.glow(c, ax.X(inp.value), ax.Y(r.V), 14, pal.red, .5); D.dot(c, ax.X(inp.value), ax.Y(r.V), 6, pal.red);
      var ax2 = D.axes(c, {x0: 0.5, x1: 6, y0: 0, y1: 1300, xl: "eau absorbée (L/j)", stepX: 2, stepY: 400, t: gy + 24, b: 36, l: mid + 38, r: 18});
      D.text(c, "Concentration (mOsm/L)", mid + 12, gy + 10, {size: 11.5, color: pal.ink, weight: 800, align: "left"});
      B5.poly(c, ax2, p2, pal.violet, 3); D.glow(c, ax2.X(inp.value), ax2.Y(r.uo), 14, pal.red, .5); D.dot(c, ax2.X(inp.value), ax2.Y(r.uo), 6, pal.red);
      D.line(c, ax2.L, ax2.Y(1200), ax2.R, ax2.Y(1200), pal.red, 1.2, [5, 4]); D.label(c, "maximum 1 200", ax2.R - 4, ax2.Y(1200) + 12, {color: pal.red, align: "right", size: 10.5});
      ro.set(0, S.fmt(r.V, 1) + " L/j"); ro.set(1, S.fmt(r.uo, 0) + " mOsm/L"); ro.set(2, S.fmt(r.adh * 100, 0) + " %"); ro.set(3, r.deficit > 0 ? "− " + S.fmt(r.deficit, 1) + " L/j" : "équilibré");
      if (r.deficit > 0) nt.set("Déshydratation : même avec l'urine la plus concentrée possible (0,5 L/j), il manque " + S.fmt(r.deficit, 1) + " L par jour, soit " + S.fmt(100 * r.deficit / 70, 1) + " % de la masse d'un adulte de 70 kg.", "warn");
      else if (r.uo <= 50.5) nt.set("Urine la plus diluée possible (50 mOsm/L) : ADH quasi nulle ; l'eau en excès est éliminée.", "ok");
      else nt.set("Le rein ajuste la concentration de l'urine pour maintenir le bilan : " + S.fmt(r.V, 1) + " L à " + S.fmt(r.uo, 0) + " mOsm/L, ADH à " + S.fmt(r.adh * 100, 0) + " %.", "ok");
    });
  }
});

/* ---------- analyse d'urine ---------- */
SFA.sim({
  id: "b5-c06-bandelette", ch: "c06", tag: "Diagnostic",
  titre: "La bandelette urinaire : lire une analyse",
  resume: "Glycémie, filtre abîmé, infection, hydratation → résultats de la bandelette.",
  but: "Règle quatre paramètres de la personne et lis les six cases de la bandelette. Retrouve quelle cause explique quelle anomalie : glucose, protéines, leucocytes, nitrites, sang, densité.",
  aRetenir: "Une urine normale ne contient ni glucose, ni protéines en quantité notable, ni leucocytes. Du glucose indique que la glycémie dépasse le seuil rénal ; des protéines, que le filtre glomérulaire est abîmé ; des leucocytes et des nitrites, une infection urinaire. La densité renseigne sur l'hydratation.",
  piege: "Une anomalie ne fait pas un diagnostic : la bandelette oriente, un médecin confirme. Par exemple une urine concentrée avec une trace de protéines n'est pas forcément une maladie. Seuils indicatifs d'un modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(230), pal = S.draw.palette;
    var gly = k.slider("Glycémie", 0.5, 4, 0.1, 1, "g/L");
    var les = k.slider("Atteinte du filtre glomérulaire", 0, 100, 5, 0, "%");
    var inf = k.slider("Infection urinaire", 0, 100, 5, 0, "%");
    var hyd = k.slider("Hydratation", 0, 100, 5, 60, "%");
    var ro = k.readouts(["Glucose urinaire", "Protéines", "Leucocytes", "Densité"]);
    var nt = k.note("", "");
    var ramp = ["#cfe3f1", "#f0dc86", "#e4a257", "#9e3f2a"], lab = ["négatif", "+", "++", "+++"];
    function lvl(v, c1, c2, c3){ return v < c1 ? 0 : v < c2 ? 1 : v < c3 ? 2 : 3; }
    k.draw(function(){
      var gj = Math.max(0, gly.value * 125 - TM) * 1.44, x = les.value / 100, prot = 0.1 + 8 * x * x, y = inf.value / 100, leu = 5 + 600 * y * y;
      var nit = y >= 0.3, sang = x >= 0.6 || y >= 0.6, dens = 1.030 - 0.027 * hyd.value / 100;
      var L = [lvl(gj, 0.5, 5, 20), lvl(prot, 0.15, 0.5, 2), lvl(leu, 10, 100, 400), nit ? 2 : 0, sang ? (x >= 0.8 || y >= 0.8 ? 2 : 1) : 0];
      var names = ["Glucose", "Protéines", "Leucocytes", "Nitrites", "Sang"], i;
      c.clear();
      var pw = (c.W - 40) / 6, x0 = 20;
      for (i = 0; i < 5; i++){
        B5.rect(c, x0 + i * pw + 4, 40, pw - 8, 90, ramp[L[i]], "#8a95a3", 1.5);
        S.draw.text(c, names[i], x0 + i * pw + pw / 2, 24, {size: 12});
        S.draw.text(c, i === 3 ? (nit ? "positif" : "négatif") : lab[Math.min(3, L[i])], x0 + i * pw + pw / 2, 148, {size: 12});
      }
      var cc = 1 - hyd.value / 100, dc = "rgb(" + Math.round(255 - 55 * cc) + "," + Math.round(245 - 95 * cc) + "," + Math.round(190 - 150 * cc) + ")";
      B5.rect(c, x0 + 5 * pw + 4, 40, pw - 8, 90, dc, "#8a95a3", 1.5);
      S.draw.text(c, "Densité", x0 + 5 * pw + pw / 2, 24, {size: 12}); S.draw.text(c, dens.toFixed(3).replace(".", ","), x0 + 5 * pw + pw / 2, 148, {size: 12});
      S.draw.text(c, "Lire la bandelette : plus la case est foncée, plus le résultat est positif.", c.W / 2, 190, {size: 12, color: pal.grey});
      S.draw.text(c, "Densité normale : 1,003 à 1,030", c.W / 2, 212, {size: 12, color: pal.grey});
      ro.set(0, gj > 0 ? S.fmt(gj, 0) + " g/j" : "0"); ro.set(1, S.fmt(prot, 2) + " g/24 h"); ro.set(2, S.fmt(leu, 0) + " /µL"); ro.set(3, dens.toFixed(3).replace(".", ","));
      var dg = [];
      if (gj > 0) dg.push("glycosurie : glycémie au-dessus du seuil rénal, évoque un diabète sucré (à confirmer)");
      if (prot >= 0.5) dg.push("protéinurie " + (prot > 3.5 ? "massive" : "marquée") + " : filtre glomérulaire abîmé");
      if (nit || leu >= 100) dg.push("leucocytes ± nitrites : évoque une infection urinaire");
      if (prot >= 0.15 && prot < 0.5) dg.push("trace de protéines : sans gravité si elle est isolée (effort, urine concentrée), à recontrôler");
      if (leu >= 10 && leu < 100 && !nit) dg.push("quelques leucocytes : à recontrôler, pas encore une infection nette");
      if (sang && !(nit || leu >= 100)) dg.push("sang dans l'urine : atteinte du filtre ou lésion des voies urinaires");
      nt.set(dg.length ? "Hypothèses : " + dg.join(" ; ") + "." : "Bandelette normale pour ces valeurs (densité " + dens.toFixed(3).replace(".", ",") + ").", dg.length ? "warn" : "ok");
    });
  }
});

/* ---------- dialyse ---------- */
function dialyse(n, dur, Qb, G){
  var days = {2: [0, 3], 3: [0, 2, 4], 4: [0, 2, 3, 5], 5: [0, 1, 2, 3, 4]}[n], K = 0.7 * Qb * 60 / 1000, V = 40, C = 0.5, dt = 0.05, out = [], w, st, t, on, j;
  for (w = 0; w < 6; w++){
    for (st = 0; st < 7 * 24 / dt; st++){
      t = st * dt; on = false;
      for (j = 0; j < days.length; j++){ var s = days[j] * 24 + 8; if (t >= s && t < s + dur) on = true; }
      C += (G / 24 / V - (on ? K / V * C : 0)) * dt;
      if (w === 5) out.push([t / 24, C, on]);
    }
  }
  return {out: out, K: K, days: days, ktv: K * dur / V};
}
SFA.sim({
  id: "b5-c06-dialyse", ch: "c06", tag: "Technique",
  titre: "Hémodialyse : épurer le sang d'un rein défaillant",
  resume: "Débit du sang, durée et fréquence des séances → urée sur une semaine.",
  but: "Un patient n'élimine plus l'urée par ses reins. Une machine filtre son sang à travers une membrane. Regarde une semaine défiler : l'urée s'accumule entre les séances, puis passe dans le liquide de dialyse. Règle le débit du sang, la durée et le nombre de séances. Objectif : Kt/V ≥ 1,2 par séance et une urée qui monte peu entre deux séances.",
  aRetenir: "Dans le dialyseur, le sang et le liquide de dialyse circulent de part et d'autre d'une membrane semi-perméable : l'urée et les petites molécules diffusent vers le liquide de dialyse, mais les cellules et les grosses protéines restent dans le sang. Entre les séances, l'urée s'accumule à nouveau : il faut en général trois séances par semaine.",
  piege: "La dialyse remplace seulement une partie de la fonction du rein (épuration, bilan en eau) : elle ne produit pas les hormones rénales ni la régulation fine. La séance fait baisser l'urée de 60 à 70 % mais pas à 0. Modèle à un compartiment, valeurs indicatives.",
  build: function(k, S){
    var c = k.canvas(500), pal = S.draw.palette, D = S.draw;
    var n = k.slider("Séances par semaine", 2, 5, 1, 3, "");
    var dur = k.slider("Durée d'une séance", 2, 6, 0.5, 4, "h");
    var qb = k.slider("Débit du sang dans le dialyseur", 200, 400, 25, 300, "mL/min");
    var G = k.slider("Production d'urée (apport en protéines)", 8, 25, 1, 15, "g/j");
    var ro = k.readouts(["Kt/V par séance", "Baisse d'urée par séance", "Urée max (avant séance)", "Urée moyenne"]);
    var nt = k.note("", "");
    var tm = 0.2, run = true, rnd = B5.rng(5), PB = [], i;
    for (i = 0; i < 46; i++) PB.push({ph: rnd(), y: rnd(), cr: rnd(), x: rnd()});
    var lp = k.loop(function(dt){ if (run){ tm += dt * 0.42; if (tm > 7) tm = 0; } k.redraw(); }); lp.play();
    k.button("Pause / reprise", function(){ run = !run; });
    k.button("Revenir au lundi", function(){ tm = 0; });
    var geo = {}, drag = false;
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") drag = p.y > geo.gy; if (drag && (t === "down" || t === "drag") && geo.ax){ tm = Math.max(0, Math.min(6.99, geo.ax.ix(p.x))); } if (t === "up") drag = false; });
    var dn = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    k.draw(function(){
      var m = dialyse(n.value, dur.value, qb.value, G.value), o = m.out;
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 262;
      var mx = Math.max.apply(null, o.map(function(p){ return p[1]; })), mn = Math.min.apply(null, o.map(function(p){ return p[1]; })), mean = o.reduce(function(a, p){ return a + p[1]; }, 0) / o.length;
      var idx = Math.min(o.length - 1, Math.round(tm * 24 / 0.05)), cur = o[idx][1], on = o[idx][2];
      /* ---------- scène ---------- */
      D.rrect(c, 8, 8, W - 16, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#f5f7fb"); bg.addColorStop(1, "#eaf0f8"); ctx.fillStyle = bg; ctx.fill();
      var px = 52, py = 120;
      /* patient */
      B5.circ(c, px, py - 36, 17, "#f0c7a4", "#c28b63", 2); D.rrect(c, px - 26, py - 16, 52, 70, 18); ctx.fillStyle = "#9bb8dd"; ctx.fill(); ctx.strokeStyle = "#5f84b6"; ctx.lineWidth = 2; ctx.stroke();
      var nu = Math.round(cur * 12); for (i = 0; i < nu; i++){ B5.circ(c, px - 18 + (i * 17) % 36, py - 6 + ((i * 11) % 7) * 7, 2.8, "#8a5a2b"); }
      D.text(c, "patient", px, py + 68, {size: 11, color: pal.ink, weight: 800});
      /* dialyseur */
      var dx = W * 0.24, dw = W * 0.44, dy = 52, dh = 150;
      D.rrect(c, dx, dy, dw, dh, 26); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = on ? pal.violet : "#a3adba"; ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); D.rrect(c, dx + 3, dy + 3, dw - 6, dh - 6, 23); ctx.clip();
      ctx.fillStyle = "rgba(192,50,29,.13)"; ctx.fillRect(dx, dy, dw, dh / 2); ctx.fillStyle = "rgba(47,127,209,.15)"; ctx.fillRect(dx, dy + dh / 2, dw, dh / 2);
      D.line(c, dx, dy + dh / 2, dx + dw, dy + dh / 2, "#6b7a8c", 2, [7, 5]);
      /* particules d'urée */
      var nb = Math.max(2, Math.round(cur * 14)), spd = on ? 0.22 * qb.value / 300 : 0;
      for (i = 0; i < 46; i++){
        var p = PB[i], xx, yy;
        if (i < nb){
          var s = (p.ph + tm * 24 * 0.0 + (on ? tmx() * spd : 0)) % 1; xx = dx + 10 + s * (dw - 20); yy = dy + 14 + p.y * (dh / 2 - 28);
          if (on && p.cr < 0.55){ var f = (s * 1.3 - 0.1); f = Math.max(0, Math.min(1, f)); yy += f * (dh / 2 + (p.y - .3) * 10); xx += f * 0; }
          B5.circ(c, xx, yy, 3.6, "#8a5a2b", "#4a2d10", 1);
        }
      }
      var nd = on ? Math.round(14 * Math.min(1, (cur + .2))) : 0;
      for (i = 0; i < nd; i++){ var q = PB[i + 10], s2 = (q.ph + tmx() * spd * 0.8) % 1; B5.circ(c, dx + dw - 10 - s2 * (dw - 20), dy + dh / 2 + 14 + q.y * (dh / 2 - 28), 3.2, "#b9863f"); }
      ctx.restore();
      function tmx(){ return tm * 24 * 0.35; }
      /* flèches et tuyaux */
      ctx.strokeStyle = pal.red; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(px + 26, py + 4); ctx.bezierCurveTo(dx - 10, py + 4, dx - 14, dy + dh * 0.25, dx, dy + dh * 0.25); ctx.stroke();
      ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(dx + dw, dy + dh * 0.25); ctx.lineTo(dx + dw + 16, dy + dh * 0.25); ctx.lineTo(dx + dw + 16, dy + dh + 36); ctx.lineTo(px, dy + dh + 36); ctx.lineTo(px, py + 56); ctx.stroke();
      D.text(c, "sang", dx - 18, dy + 6, {size: 10.5, color: pal.red, weight: 800});
      D.label(c, "sang → (urée élevée)", dx + 6, dy - 12, {size: 10.5, color: pal.red, align: "left"});
      D.label(c, "← liquide de dialyse", dx + dw - 6, dy + dh - 14, {size: 10.5, color: pal.blue, align: "right"});
      D.label(c, "membrane semi-perméable", dx + dw / 2, dy + dh / 2, {size: 10, color: "#4a5a6c"});
      /* afficheurs */
      D.display(c, S.fmt(cur, 2), W - 62, 52, {w: 92, h: 52, caption: "urée (g/L)", size: 20, color: cur > 1.2 ? "#a31d0e" : "#13233a"});
      D.label(c, on ? "SÉANCE" : "hors séance", W - 62, 94, {color: on ? pal.violet : pal.grey, size: 10.5});
      D.text(c, dn[Math.min(6, Math.floor(tm))] + " " + S.fmt(Math.floor((tm % 1) * 24), 0) + " h", W - 62, 118, {size: 12, color: pal.ink, weight: 800});
      /* ---------- courbe ---------- */
      var gy = sh + 20; geo.gy = gy - 6;
      D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 7, y0: 0, y1: Math.max(2, Math.ceil(mx * 2) / 2 + 0.5), xl: "jour de la semaine (glisse pour te déplacer)", stepX: 1, stepY: 0.5, t: gy + 10, b: 34, l: 40, r: 18});
      geo.ax = ax; D.text(c, "urée (g/L)", 14, gy + 4, {size: 11, color: pal.grey, align: "left"});
      ctx.fillStyle = "rgba(36,119,90,.13)"; ctx.fillRect(ax.X(0), ax.Y(0.45), ax.X(7) - ax.X(0), ax.Y(0.15) - ax.Y(0.45));
      D.text(c, "valeurs normales", ax.R - 6, ax.Y(0.3), {align: "right", size: 11, color: pal.green});
      m.days.forEach(function(d){ ctx.fillStyle = "rgba(98,54,196,.14)"; ctx.fillRect(ax.X(d + 8 / 24), ax.T, ax.X(d + 8 / 24 + dur.value / 24) - ax.X(d + 8 / 24), ax.B - ax.T); });
      B5.poly(c, ax, o.filter(function(p, i2){ return i2 % 4 === 0; }).map(function(p){ return [p[0], p[1]]; }), pal.violet, 3);
      D.line(c, ax.X(tm), ax.T, ax.X(tm), ax.B, pal.ink, 1.2, [3, 3]); D.glow(c, ax.X(tm), ax.Y(cur), 14, pal.red, .5); D.dot(c, ax.X(tm), ax.Y(cur), 5, pal.red);
      var urr = 1 - Math.exp(-m.ktv);
      ro.set(0, S.fmt(m.ktv, 2)); ro.set(1, S.fmt(urr * 100, 0) + " %"); ro.set(2, S.fmt(mx, 2) + " g/L"); ro.set(3, S.fmt(mean, 2) + " g/L");
      if (m.ktv >= 1.2) nt.set("Dose de dialyse atteinte (Kt/V ≥ 1,2). L'urée remonte entre deux séances de " + S.fmt(mx - mn, 2) + " g/L au plus.", "ok");
      else nt.set("Kt/V = " + S.fmt(m.ktv, 2) + " < 1,2 : épuration insuffisante par séance. Allonge la séance, augmente le débit du sang ou le nombre de séances.", "warn");
    });
  }
});
})();
