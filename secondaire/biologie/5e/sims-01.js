/* Chapitre 1 · Neurone, influx nerveux et système nerveux */
/* Légende en pastilles (remplace B5.leg : lisible sur fond de courbe, retour à la ligne sur téléphone) */
B5.leg = function(c, items, x, y){
  var ctx = c.ctx, px = x, py = y, lh = 20;
  ctx.save(); ctx.font = "700 11.5px Mulish, system-ui, sans-serif";
  items.forEach(function(it){
    var wd = 34 + ctx.measureText(it[0]).width;
    if (px + wd > c.W - 6 && px > x){ px = x; py += lh; }
    ctx.fillStyle = "rgba(255,255,255,.92)"; SFA.draw.rrect(c, px - 4, py - 10, wd, 18, 9); ctx.fill();
    ctx.strokeStyle = it[1]; ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(px + 3, py - 1); ctx.lineTo(px + 17, py - 1); ctx.stroke();
    ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(it[0], px + 23, py - 1); px += wd + 4;
  });
  ctx.restore();
};
(function(){
var REST = -70, THR = -55;
/* forme du potentiel d'action (modèle simplifié), t en ms depuis le franchissement du seuil */
function ap(t){
  if (t < 0) return null;
  if (t < 0.7) return THR + 95 * Math.sin(Math.PI / 2 * t / 0.7);
  if (t < 2.0) return 40 - 120 * (1 - Math.cos(Math.PI * (t - 0.7) / 1.3)) / 2;
  return REST - 10 * Math.exp(-(t - 2.0) / 1.0);
}
function trace(I, t){            /* réponse à un stimulus bref d'intensité I (mV de dépolarisation) à t = 0 */
  if (t < 0) return REST;
  if (I < 15) return REST + I * (t < 0.4 ? t / 0.4 : Math.exp(-(t - 0.4) / 2));
  var tc = 15 * 0.4 / I;
  if (t < tc) return REST + I * t / 0.4;
  return ap(t - tc);
}

SFA.sim({
  id: "b5-c01-seuil", ch: "c01", tag: "Classique",
  titre: "Seuil et loi du tout-ou-rien",
  resume: "Règle l'intensité du stimulus : réponse locale ou potentiel d'action, toujours de même hauteur.",
  but: "Glisse la poignée rouge de l'oscilloscope (ou le curseur) pour changer l'intensité du stimulus, puis presse « Stimuler » pour voir l'axone réagir. Trouve le plus petit stimulus qui déclenche un potentiel d'action, puis compare la hauteur du PA pour 16 mV et 40 mV. En mode « soutenu », observe ce qui change.",
  aRetenir: "Sous le seuil (−55 mV ici), la réponse est locale et s'éteint. Au-dessus, le potentiel d'action a toujours la même amplitude (tout-ou-rien). Une stimulation plus forte se traduit par une plus grande fréquence de potentiels d'action, pas par un potentiel plus grand.",
  piege: "« Un stimulus plus fort donne un potentiel plus grand » est faux : l'amplitude est fixe, c'est la fréquence qui code l'intensité.",
  build: function(k, S){
    var c = k.canvas(430), pal = S.draw.palette, D = S.draw;
    var mode = k.seg("Stimulus", [["b", "Bref"], ["s", "Soutenu (60 ms)"]], "b");
    var I = k.slider("Intensité du stimulus (dépolarisation)", 0, 40, 1, 8, "mV");
    var ro = k.readouts(["Potentiel atteint", "Potentiel d'action ?", "Amplitude du PA", "Fréquence"]);
    var nt = k.note("", "");
    var tt = null, best = null, tries = 0;       /* tt : temps de balayage (ms) ou null */
    var lp = k.loop(function(dt){ tt += dt * (mode.value === "s" ? 40 : 5); if (tt > (mode.value === "s" ? 60 : 8)){ tt = null; lp.pause(); } k.redraw(); });
    k.button("Stimuler", function(){ tt = 0; tries++; if (I.value >= 15 && (best === null || I.value < best)) best = I.value; lp.play(); }, true);
    var geo = {}, drag = false;
    c.cv.style.touchAction = "none";
    c.pointer(function(type, p){
      if (type === "down" || type === "drag"){
        if (type === "down" && (Math.abs(p.x - geo.hx) > 44 || p.y < geo.top)) { drag = false; return; } if (type === "down") drag = true; if (!drag) return;
        var v = geo.ay.iy ? geo.ay.iy(p.y) : 0; I.set(Math.round(Math.max(0, Math.min(40, v - REST)))); k.redraw();
      }
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, soutenu = mode.value === "s", T = soutenu ? 60 : 8, i = I.value;
      /* ---- axone ---- */
      var ay0 = 58, ok = i >= 15, ph = tt === null ? null : (soutenu ? (ok ? 1 : 0) : tt);
      var x0 = 30, x1 = W - 30, tube = 38;
      var g = ctx.createLinearGradient(0, ay0 - tube / 2, 0, ay0 + tube / 2); g.addColorStop(0, "#e7defa"); g.addColorStop(1, "#c9b8ea");
      D.rrect(c, x0, ay0 - tube / 2, x1 - x0, tube, 19); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#8d77cf"; ctx.lineWidth = 2; ctx.stroke();
      D.text(c, "axone", (x0 + x1) / 2, ay0 + 2, {size: 11, color: "#6a55a8", weight: 800});
      /* canaux Na+ : portes sur la membrane */
      var nch = Math.max(3, Math.min(6, Math.floor((x1 - x0) / 90)));
      for (var q = 0; q < nch; q++){
        var cx = x0 + 70 + q * (x1 - x0 - 140) / (nch - 1), open;
        if (soutenu) open = ok && tt !== null; else { var lag = q * 0.35; open = ok && tt !== null && tt - 0.0 > lag && tt - lag < 1.4 + 0; }
        [-1, 1].forEach(function(s){
          var y = ay0 + s * tube / 2;
          ctx.fillStyle = open ? pal.green : "#7a6aa8"; ctx.fillRect(cx - 9, y - 5, 6, 10); ctx.fillRect(cx + 3, y - 5, 6, 10);
          if (open){ D.arrow(c, cx, y - s * 22, cx, y + s * 2, pal.green, 2); }
        });
        if (open) D.glow(c, cx, ay0, 34, pal.amber, 0.5);
      }
      D.label(c, "Na⁺ entre", x1 - 6, ay0 - tube / 2 - 22, {color: pal.green, align: "right", size: 11});
      /* électrode de stimulation */
      ctx.strokeStyle = pal.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 - 6, ay0 - 40); ctx.lineTo(x0 + 8, ay0 - tube / 2 + 2); ctx.stroke();
      var pulse = tt !== null && tt < (soutenu ? 60 : 0.6);
      D.glow(c, x0 + 8, ay0 - tube / 2 + 2, pulse ? 24 : 14, pal.red, pulse ? 0.8 : 0.35);
      D.dot(c, x0 + 8, ay0 - tube / 2 + 2, 4, pal.red); D.text(c, "stimulus", x0 + 14, ay0 - 40, {align: "left", size: 11, color: pal.red});
      /* ---- oscilloscope ---- */
      var top = 118; geo.top = top;
      D.panel(c, 8, top - 6, W - 16, c.H - top - 2, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: T, y0: -90, y1: 50, xl: "t (ms)", yl: "V (mV)", stepY: 20, stepX: soutenu ? 10 : 1, t: top + 6, b: 36, l: 54});
      geo.ay = ax; geo.hx = ax.L + 14;
      D.line(c, ax.L, ax.Y(THR), ax.R, ax.Y(THR), pal.red, 1.5, [6, 4]);
      D.label(c, "seuil −55 mV", ax.R - 4, ax.Y(THR) - 11, {color: pal.red, align: "right"});
      D.label(c, "repos −70 mV", ax.R - 4, ax.Y(REST) + 11, {color: pal.grey, align: "right"});
      var pts = [], vmax = REST, f = 0, n = 0, t, tend = tt === null ? T : tt;
      if (!soutenu){ for (t = 0; t <= tend + 1e-9; t += 0.05){ var v = trace(i, t); pts.push([t, v]); if (v > vmax) vmax = v; } f = ok ? 1 : 0; }
      else {
        f = ok ? Math.min(400, 20 + 8 * (i - 15)) : 0; var per = f ? 1000 / f : 1e9;
        for (t = 0; t <= tend + 1e-9; t += 0.1){ var v2 = REST; if (f){ var a1 = ap(t % per); v2 = a1 === null ? REST : a1; } pts.push([t, v2]); if (v2 > vmax) vmax = v2; }
        n = f ? Math.floor(T / per + 1e-9) + 1 : 0;
      }
      B5.poly(c, ax, pts, pal.violet, 3);
      if (tt !== null){ var lastp = pts[pts.length - 1]; D.glow(c, ax.X(lastp[0]), ax.Y(lastp[1]), 16, pal.violet, 0.6); D.dot(c, ax.X(lastp[0]), ax.Y(lastp[1]), 4, pal.violet); }
      /* flèche d'amplitude du PA */
      if (ok && !soutenu && tt === null){ var tc = 15 * 0.4 / i; D.line(c, ax.X(tc + 0.7) + 14, ax.Y(REST), ax.X(tc + 0.7) + 14, ax.Y(40), pal.amber, 1.5, [3, 3]); D.label(c, "110 mV", ax.X(tc + 0.7) + 20, ax.Y(22), {color: pal.amber, align: "left"}); }
      /* poignée de stimulus */
      var hy = ax.Y(REST + i); D.line(c, geo.hx, ax.Y(REST), geo.hx, hy, pal.red, 3);
      D.glow(c, geo.hx, hy, 20, pal.red, 0.35); D.dot(c, geo.hx, hy, 8, pal.red);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(geo.hx, hy, 3, 0, 7); ctx.fill();
      D.label(c, "+" + S.fmt(i, 0) + " mV", geo.hx + 14, hy - 12, {color: pal.red, align: "left"});
      if (best !== null) D.label(c, "plus petit stimulus efficace : " + S.fmt(best, 0) + " mV", ax.L + 8, ax.T + 12, {color: pal.green, align: "left"});
      ro.set(0, S.fmt(soutenu && ok ? 40 : (tt === null ? vmax : vmax), 0) + " mV");
      ro.set(1, ok ? "oui" : "non");
      ro.set(2, ok ? "110 mV (toujours)" : (i ? S.fmt(i, 0) + " mV (local)" : "0"));
      ro.set(3, soutenu ? (ok ? S.fmt(f, 0) + " Hz (≈ " + n + " PA en 60 ms)" : "0 Hz") : (ok ? "1 PA" : "0 PA"));
      if (!ok) nt.set(i === 0 ? "Aucun stimulus : le neurone reste au repos (−70 mV)." : "Dépolarisation de " + S.fmt(i, 0) + " mV < 15 mV : on n'atteint pas −55 mV, les canaux Na⁺ restent fermés, la réponse locale s'éteint.", i ? "warn" : "");
      else nt.set(soutenu ? "Chaque potentiel d'action culmine à +40 mV. À 40 mV de stimulus on a " + S.fmt(f, 0) + " Hz contre 20 Hz au seuil : seule la fréquence change." : "Seuil franchi : les canaux Na⁺ s'ouvrent, un potentiel d'action de 110 mV (de −70 à +40 mV). Essaie 16 puis 40 mV : même hauteur.", "ok");
    });
  }
});

/* ---------- vitesse de conduction ---------- */
function vUnmy(d){ return 1.1 * Math.sqrt(d); }      /* m/s, d en µm (ordre de grandeur) */
function vMy(d){ return 6 * d; }                      /* m/s, d = diamètre total de la fibre en µm */
SFA.sim({
  id: "b5-c01-myeline", ch: "c01", tag: "Course",
  titre: "Course d'influx : fibre myélinisée ou non",
  resume: "Diamètre, longueur, myéline → vitesse et temps de trajet de l'influx.",
  but: "Deux fibres de même diamètre et de même longueur : l'une est nue, l'autre myélinisée. Lance la course (au ralenti) : l'influx de la fibre myélinisée saute de nœud en nœud. Compare les temps réels, puis modifie le diamètre et la longueur.",
  aRetenir: "La myéline isole l'axone : le potentiel d'action « saute » de nœud de Ranvier en nœud de Ranvier (conduction saltatoire). Pour un même diamètre, c'est bien plus rapide : v ≈ 6 m/s par µm de diamètre (fibre myélinisée) contre v ≈ 1,1·√d (fibre nue). Une fibre plus grosse conduit plus vite.",
  piege: "L'influx n'est pas un courant électrique dans un fil (qui irait à plus de 10⁸ m/s) : c'est une onde de potentiel d'action qui se régénère le long de la membrane. Valeurs : ordres de grandeur d'un modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(400), pal = S.draw.palette, D = S.draw;
    var d = k.slider("Diamètre de la fibre", 1, 20, 0.5, 10, "µm");
    var L = k.slider("Longueur du trajet", 0.1, 1.5, 0.1, 1, "m");
    var ro = k.readouts(["v fibre nue", "v fibre myélinisée", "Temps (nue)", "Temps (myélinisée)"]);
    var nt = k.note("", "");
    var tt = 0, run = false, slow = 1, NODES = 12;
    function tims(){ return {a: L.value / vUnmy(d.value), b: L.value / vMy(d.value)}; }
    function fmtT(s){ return s >= 1 ? S.fmt(s, 2) + " s" : (s * 1000 < 10 ? S.fmt(s * 1000, 1) : S.fmt(s * 1000, 0)) + " ms"; }
    var lp = k.loop(function(dt){ tt += dt; var T = tims(); if (tt > Math.max(T.a, T.b) * slow + 1.2){ lp.pause(); run = false; } k.redraw(); });
    k.button("Lancer la course (au ralenti)", function(){ var T = tims(); slow = 5 / Math.max(T.a, T.b); tt = 0; run = true; lp.play(); }, true);
    k.button("Remettre à zéro", function(){ lp.pause(); run = false; tt = 0; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, T = tims();
      var x0 = 78, x1 = W - 52, Wd = x1 - x0, th = Math.max(5, Math.min(13, d.value * 0.8));   /* épaisseur selon le diamètre */
      var ta = Math.min(tt / slow, T.a), tb = Math.min(tt / slow, T.b), started = run || tt > 0;
      function lane(y, my, tcur, ttot, col, name){
        D.panel(c, 8, y - 62, W - 16, 124, {shadow: false, fill: "#fbfcfe"});
        D.text(c, name, 20, y - 46, {align: "left", size: 12.5, color: pal.ink, weight: 800});
        /* corps cellulaire */
        D.glow(c, 46, y + 6, 30, "#c9b8ea", .5); B5.circ(c, 46, y + 6, 20, "#d9ccf3", "#8d77cf", 2); B5.circ(c, 46, y + 6, 7, "#8d77cf");
        /* axone */
        ctx.fillStyle = "#b9a5e6"; ctx.fillRect(x0 - 8, y + 6 - th / 2, Wd + 8, th);
        var frac = ttot > 0 ? tcur / ttot : 0, px;
        if (my){
          var seg = Wd / NODES;
          for (var i = 0; i < NODES; i++){
            var a = x0 + i * seg + 5, w = seg - 10, hh = th + 12;
            var gr = ctx.createLinearGradient(0, y + 6 - hh / 2, 0, y + 6 + hh / 2); gr.addColorStop(0, "#fbe7a0"); gr.addColorStop(.5, "#f4c542"); gr.addColorStop(1, "#d9a21b");
            D.rrect(c, a, y + 6 - hh / 2, w, hh, hh / 2.6); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = "#b8860b"; ctx.lineWidth = 1; ctx.stroke();
          }
          var ib = Math.min(NODES, Math.floor(frac * NODES + 1e-9)), fr = frac * NODES - ib; px = x0 + ib * seg;
          if (started && frac < 1){
            D.glow(c, px, y + 6, 32, pal.red, .7); D.dot(c, px, y + 6, 8, pal.red);
            if (ib < NODES){ ctx.strokeStyle = "rgba(192,50,29,.5)"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(px, y + 6 - 8); ctx.quadraticCurveTo(px + seg / 2, y + 6 - 38, px + seg, y + 6 - 8); ctx.stroke(); ctx.setLineDash([]); }
          }
          D.label(c, "nœud de Ranvier", x0 + seg * 3, y + 54, {size: 10.5, color: pal.amber, weight: 700});
          D.line(c, x0 + seg * 3, y + 42, x0 + seg * 3, y + 24, pal.amber, 1.2);
          D.label(c, "myéline", x0 + seg * 6.5, y + 54, {size: 10.5, color: "#8a6508", weight: 700});
        } else {
          px = x0 + Wd * frac;
          if (started && frac < 1){ D.glow(c, px, y + 6, 32, pal.red, .7); D.dot(c, px, y + 6, 8, pal.red); }
          ctx.strokeStyle = "rgba(192,50,29,.35)"; ctx.lineWidth = th;
          if (started){ ctx.beginPath(); ctx.moveTo(x0, y + 6); ctx.lineTo(Math.min(px, x1), y + 6); ctx.stroke(); }
        }
        /* cible (muscle) */
        D.rrect(c, x1 + 8, y - 14, 30, 40, 8); ctx.fillStyle = frac >= 1 ? "#f5b3a6" : "#efe3e0"; ctx.fill(); ctx.strokeStyle = pal.red; ctx.lineWidth = 1.5; ctx.stroke();
        D.text(c, "muscle", x1 + 23, y + 34, {size: 10, color: pal.red, weight: 700});
        if (frac >= 1) { D.glow(c, x1 + 23, y + 6, 30, pal.red, .6); D.label(c, fmtT(ttot), x1 - 6, y - 24, {color: pal.green, align: "right", size: 12}); }
      }
      lane(78, false, ta, T.a, pal.red, "Fibre nue (sans myéline)");
      lane(222, true, tb, T.b, pal.red, "Fibre myélinisée : conduction saltatoire");
      /* chronomètre */
      var tm = Math.min(tt / slow, Math.max(T.a, T.b));
      D.display(c, started ? fmtT(tm) : "0 ms", c.W / 2, 346, {w: 130, h: 44, caption: "temps réel écoulé"});
      D.text(c, "départ : corps cellulaire", 12, 388, {align: "left", size: 10.5, color: pal.grey});
      D.text(c, "arrivée à " + S.fmt(L.value, 1) + " m", c.W - 12, 388, {align: "right", size: 10.5, color: pal.grey});
      ro.set(0, S.fmt(vUnmy(d.value), 1) + " m/s"); ro.set(1, S.fmt(vMy(d.value), 0) + " m/s");
      ro.set(2, fmtT(T.a)); ro.set(3, fmtT(T.b));
      nt.set("Fibre myélinisée ≈ " + S.fmt(vMy(d.value) / vUnmy(d.value), 0) + " × plus rapide. Animation ralentie ×" + S.fmt(slow, 0) + " (les temps réels sont dans les cases).", "ok");
    });
  }
});

/* ---------- période réfractaire ---------- */
function thr2(dt){ return dt < 2 ? Infinity : 15 + 60 * Math.exp(-(dt - 2) / 2); }   /* seuil du 2e stimulus (mV) */
SFA.sim({
  id: "b5-c01-refractaire", ch: "c01", tag: "Oscilloscope",
  titre: "Deux stimuli : période réfractaire",
  resume: "Écart entre deux stimuli → le deuxième déclenche-t-il un potentiel d'action ?",
  but: "Deux stimuli sont appliqués au même point de l'axone. Règle l'écart Δt et l'intensité du second. Cherche le plus petit écart pour lequel un second potentiel d'action est possible, puis la fréquence maximale du neurone.",
  aRetenir: "Juste après un potentiel d'action, les canaux Na⁺ sont inactivés : période réfractaire absolue (≈ 2 ms ici), aucun stimulus ne déclenche de PA. Ensuite vient la période réfractaire relative : il faut un stimulus plus fort que d'habitude. Cela impose une fréquence maximale (≈ 1/2 ms = 500 Hz) et force l'influx à avancer dans un seul sens.",
  piege: "La période réfractaire n'est pas de la fatigue du neurone : c'est l'état des canaux ioniques juste après le PA. Valeurs d'un modèle simplifié.",
  build: function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), pal = S.draw.palette;
    var dt = k.slider("Écart Δt entre les deux stimuli", 0.5, 12, 0.5, 6, "ms");
    var I2 = k.slider("Intensité du 2e stimulus", 10, 60, 1, 20, "mV");
    var ro = k.readouts(["Seuil du 2e stimulus", "2e PA ?", "Fréquence max."]);
    var nt = k.note("", "");
    k.draw(function(){
      var d = dt.value, i2 = I2.value, th = thr2(d), ok = i2 >= th;
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 12, y0: 0, y1: 80, xl: "Δt (ms)", yl: "seuil du 2e stimulus (mV)", stepX: 1, stepY: 20});
      var pts = []; for (var x = 2; x <= 12; x += 0.1) pts.push([x, thr2(x)]);
      B5.poly(c1, ax, pts, pal.violet, 2.6);
      c1.ctx.fillStyle = "rgba(138,42,26,.12)"; c1.ctx.fillRect(ax.X(0), ax.T, ax.X(2) - ax.X(0), ax.B - ax.T);
      S.draw.text(c1, "absolue", ax.X(1), ax.T + 14, {size: 12, color: pal.red});
      S.draw.text(c1, "relative", ax.X(4.2), ax.T + 14, {size: 12, color: pal.amber});
      S.draw.dot(c1, ax.X(d), ax.Y(i2), 7, ok ? pal.green : pal.red);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: -1, x1: 16, y0: -90, y1: 50, xl: "t (ms)", yl: "V (mV)", stepY: 40, stepX: 2});
      S.draw.line(c2, ax2.X(-1), ax2.Y(THR), ax2.X(16), ax2.Y(THR), pal.red, 1.2, [5, 4]);
      var p2 = [], tc1 = 15 * 0.4 / 40, tcc = 15 * 0.4 / i2;
      for (var t = 0; t <= 16; t += 0.05){
        var v = t < tc1 ? REST + 40 * t / 0.4 : ap(t - tc1);
        if (t >= d){
          var s2 = t - d;
          if (ok) v = s2 < tcc ? v + i2 * s2 / 0.4 : ap(s2 - tcc);
          else v = v + Math.min(i2, 14) * (s2 < 0.4 ? s2 / 0.4 : Math.exp(-(s2 - 0.4) / 2));
        }
        p2.push([t, v]);
      }
      B5.poly(c2, ax2, p2, pal.violet, 2.4);
      S.draw.text(c2, "stimulus 1", ax2.X(0) + 4, ax2.B - 8, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c2, "stimulus 2", ax2.X(d) + 4, ax2.B - 22, {align: "left", size: 12, color: pal.grey});
      ro.set(0, isFinite(th) ? S.fmt(th, 0) + " mV" : "impossible"); ro.set(1, ok ? "oui" : "non"); ro.set(2, "≈ 500 Hz");
      if (d < 2) nt.set("Période réfractaire absolue (Δt < 2 ms) : quelle que soit l'intensité, pas de second PA.", "warn");
      else if (ok) nt.set("Période réfractaire relative : le seuil vaut " + S.fmt(th, 0) + " mV et ton stimulus (" + S.fmt(i2, 0) + " mV) le dépasse : second PA.", "ok");
      else nt.set("Seuil encore relevé à " + S.fmt(th, 0) + " mV : ton stimulus de " + S.fmt(i2, 0) + " mV est insuffisant. Augmente l'intensité ou l'écart.", "warn");
    });
  }
});

/* ---------- anesthésique local / sclérose en plaques ---------- */
SFA.sim({
  id: "b5-c01-blocage", ch: "c01", tag: "Santé",
  titre: "Quand l'influx est bloqué : anesthésique et sclérose en plaques",
  resume: "Canaux Na⁺ bloqués ou myéline abîmée → influx affaibli, ralenti ou arrêté.",
  but: "Choisis la cause. Augmente l'atteinte et observe l'amplitude du potentiel d'action dans la zone touchée, le temps de trajet vers l'encéphale et le moment où le signal n'arrive plus (douleur supprimée ou perte de fonction).",
  aRetenir: "Un anesthésique local bloque les canaux Na⁺ : sans entrée de Na⁺, pas de dépolarisation, donc pas de PA, donc pas de message de douleur. Dans la sclérose en plaques, la myéline est détruite par plaques : l'influx ralentit puis se bloque.",
  piege: "L'anesthésique ne « supprime pas la douleur » : il empêche le message de partir. Le récepteur de douleur est stimulé, mais aucun PA n'arrive à l'encéphale. Modèle très simplifié, valeurs indicatives.",
  build: function(k, S){
    var c = k.canvas(280), pal = S.draw.palette;
    var cause = k.seg("Cause", [["an", "Anesthésique local"], ["ms", "Sclérose en plaques"]], "an");
    var a = k.slider("Atteinte (dose d'anesthésique ou fibre démyélinisée)", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Atteinte", "Amplitude du PA", "Temps de trajet", "Message arrivé ?"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var ctx = c.ctx, an = cause.value === "an", v = a.value;
      var x0 = 30, x1 = c.W - 30, W = x1 - x0;
      var b, amp, time, ok, lab;
      var vm = vMy(10), Ltot = 1;                 /* fibre de 10 µm, trajet de 1 m */
      if (an){
        var C = v / 100 * 12; b = C / (C + 1.5); amp = 110 * (1 - b); ok = amp >= 15;
        time = ok ? Ltot / vm * (1 + 0.1 * b / (1 - b + 0.05)) : Infinity; lab = S.fmt(100 * b, 0) + " % des canaux Na⁺ bloqués";
      } else {
        var x = v / 100; b = x; amp = 110; ok = x < 0.8;
        time = ok ? Ltot / vm * (1 + x * (1 / 0.35 - 1)) : Infinity; lab = S.fmt(100 * x, 0) + " % de la fibre démyélinisée";
      }
      S.draw.text(c, "Nocicepteur (peau)  →  fibre sensitive  →  moelle / encéphale", c.W / 2, 22, {size: 13});
      var y = 100;
      ctx.fillStyle = "#c9b8ea"; ctx.fillRect(x0, y - 4, W, 8);
      var n = 12;
      for (var i = 0; i < n; i++){
        var xa = x0 + W * i / n + 3, w = W / n - 8, seg = (i + 0.5) / n, hit = an ? (v > 0 && seg > 0.4 && seg < 0.6) : (seg < b);
        ctx.fillStyle = hit ? (an ? "#e8b4ac" : "#d9dde3") : "#f4c542"; ctx.fillRect(xa, y - 9, w, 18);
        ctx.strokeStyle = hit ? pal.red : "#B45309"; ctx.strokeRect(xa, y - 9, w, 18);
      }
      if (an){ if (v > 0) S.draw.text(c, "zone injectée", x0 + W * 0.5, y + 34, {size: 12, color: pal.red}); }
      else { S.draw.text(c, "manchons de myéline détruits (gris)", x0 + W * 0.3, y + 34, {size: 12, color: pal.grey}); }
      B5.circ(c, x0 - 4, y, 7, pal.red); S.draw.text(c, "stimulus", x0 + 4, y - 26, {align: "left", size: 12, color: pal.red});
      B5.circ(c, x1 + 2, y, 7, ok ? pal.green : pal.grey); S.draw.text(c, ok ? "reçu" : "rien", x1 - 2, y - 26, {align: "right", size: 12, color: ok ? pal.green : pal.grey});
      /* jauge d'amplitude */
      S.draw.text(c, "Amplitude du potentiel d'action dans la zone touchée", x0, 170, {align: "left", size: 12});
      B5.bar(c, x0, 182, W, 16, amp / 110, ok ? pal.violet : pal.red);
      var tx = x0 + W * 15 / 110; S.draw.line(c, tx, 176, tx, 204, pal.red, 1.5, [4, 3]); S.draw.text(c, "minimum pour se propager (15 mV)", tx + 4, 216, {align: "left", size: 12, color: pal.red});
      S.draw.text(c, "temps : " + (isFinite(time) ? S.fmt(time * 1000, 0) + " ms" : "∞"), x0, 250, {align: "left", size: 13, color: pal.ink});
      ro.set(0, lab); ro.set(1, S.fmt(amp, 0) + " mV"); ro.set(2, isFinite(time) ? S.fmt(time * 1000, 0) + " ms" : "pas d'arrivée"); ro.set(3, ok ? "oui" : "non");
      nt.set(ok ? (v === 0 ? "Fibre saine : 17 ms pour 1 m (fibre myélinisée de 10 µm)." : "Le signal passe encore, " + (an ? "avec une marge de sécurité réduite." : "mais il est ralenti.")) : (an ? "Trop de canaux bloqués : l'amplitude (" + S.fmt(amp, 0) + " mV) est sous le minimum, le PA ne se propage plus : pas de douleur ressentie." : "Au moins 80 % de la fibre est démyélinisée : bloc de conduction, perte de la fonction commandée par cette fibre."), ok ? "ok" : "warn");
    });
  }
});
})();
