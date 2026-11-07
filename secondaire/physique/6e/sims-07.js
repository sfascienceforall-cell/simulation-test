/* Chapitre 7 · Le son */
SFA.sim({
  id: "p6-c07-generateur", ch: "c07", tag: "Classique",
  titre: "Générateur de fréquences : hauteur, intensité, note",
  resume: "La fréquence donne la hauteur, l'amplitude donne l'intensité : deux grandeurs indépendantes.",
  but: "Règle la fréquence (de 20 Hz à 20 kHz) et l'amplitude. L'écran montre toujours 4 périodes. Coche « Écouter » pour entendre le son (volume modéré).",
  aRetenir: "Un son pur est une onde sinusoïdale. Sa fréquence f (en hertz) fixe la hauteur : plus f est grande, plus le son est aigu. Son amplitude fixe l'intensité (le « volume ») : à fréquence égale, une amplitude plus grande donne un son plus fort. Dans l'air, λ = v/f avec v ≈ 340 m/s. L'oreille humaine perçoit environ de 20 Hz à 20 kHz : en dessous, ce sont des infrasons ; au-dessus, des ultrasons.",
  piege: "Fort ne veut pas dire aigu : amplitude et fréquence sont deux réglages indépendants. Doubler l'amplitude n'a aucun effet sur la note. Monter d'une octave, c'est doubler la fréquence (pas ajouter 100 Hz).",
  build: function(k, S){
    var c = k.canvas(250), kb = k.canvas(150), P = S.draw.palette;
    var gam = k.seg("Gamme", [["1", "20 Hz à 2 kHz"], ["10", "200 Hz à 20 kHz"]], "1");
    var f = k.slider("Fréquence (× gamme)", 20, 2000, 10, 440, "Hz");
    var A = k.slider("Amplitude", 0.1, 1, 0.1, 0.6, "");
    var ear = k.toggle("Écouter (volume modéré)", false, function(on){ audio(on); });
    var ro = k.readouts(["Fréquence réelle", "Période", "Longueur d'onde dans l'air", "Note la plus proche", "Niveau relatif"]);
    var nt = k.note("", "ok");
    var ctxA = null, osc = null, gain = null, timer = null, names = ["do", "do♯", "ré", "ré♯", "mi", "fa", "fa♯", "sol", "sol♯", "la", "la♯", "si"];
    function freq(){ return f.value * parseFloat(gam.value); }
    function audio(on){
      try {
        if (on){
          if (!ctxA) ctxA = new (window.AudioContext || window.webkitAudioContext)();
          if (ctxA.resume) ctxA.resume();
          osc = ctxA.createOscillator(); gain = ctxA.createGain(); osc.type = "sine"; osc.frequency.value = freq(); gain.gain.value = 0.12 * A.value;
          osc.connect(gain); gain.connect(ctxA.destination); osc.start();
          timer = setInterval(function(){ if (!document.body.contains(c.cv)) stopA(); }, 400);
        } else stopA();
      } catch (e) { stopA(); }
    }
    function stopA(){ try { if (osc){ osc.stop(); osc.disconnect(); } if (gain) gain.disconnect(); if (ctxA){ ctxA.close(); ctxA = null; } } catch (e) {} osc = null; gain = null; if (timer){ clearInterval(timer); timer = null; } }
    var blackPat = [1, 3, 6, 8, 10];
    k.draw(function(){
      c.clear(); kb.clear(); var fr = freq(), T = 1 / fr, W = c.W, H = c.H, ctx = c.ctx;
      if (osc){ try { osc.frequency.value = fr; gain.gain.value = 0.12 * A.value; } catch (e) {} }
      /* écran d'oscilloscope */
      var x0 = 14, y0 = 12, w = W - 28, h = H - 24, cy = y0 + h / 2, dx = w / 8, dy = h / 6;
      S.draw.rrect(c, x0 - 6, y0 - 6, w + 12, h + 12, 12); ctx.fillStyle = "#26303f"; ctx.fill();
      S.draw.rrect(c, x0, y0, w, h, 8); var bgc = ctx.createLinearGradient(0, y0, 0, y0 + h); bgc.addColorStop(0, "#0a1b17"); bgc.addColorStop(1, "#06100e"); ctx.fillStyle = bgc; ctx.fill();
      ctx.save(); S.draw.rrect(c, x0, y0, w, h, 8); ctx.clip();
      ctx.strokeStyle = "rgba(120,220,170,.16)"; ctx.lineWidth = 1;
      for (var i = 1; i < 8; i++){ ctx.beginPath(); ctx.moveTo(x0 + i * dx, y0); ctx.lineTo(x0 + i * dx, y0 + h); ctx.stroke(); }
      for (var j = 1; j < 6; j++){ ctx.beginPath(); ctx.moveTo(x0, y0 + j * dy); ctx.lineTo(x0 + w, y0 + j * dy); ctx.stroke(); }
      ctx.strokeStyle = "rgba(120,220,170,.4)"; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 + w, cy); ctx.moveTo(x0 + w / 2, y0); ctx.lineTo(x0 + w / 2, y0 + h); ctx.stroke();
      var amp = A.value * 2.5 * dy, n = Math.max(200, Math.round(w));
      [[8, "rgba(80,255,170,.18)"], [3, "#5dffb1"]].forEach(function(st){
        ctx.beginPath(); ctx.lineWidth = st[0]; ctx.strokeStyle = st[1]; ctx.lineJoin = "round";
        for (var q = 0; q <= n; q++){ var u = q / n, px = x0 + u * w, py = cy - amp * Math.sin(2 * Math.PI * 4 * u); q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      });
      /* mesures : période et amplitude */
      var tx0 = x0 + w / 8 * 0 + 0, per = w / 4;
      S.draw.line(c, x0 + per, y0 + 18, x0 + 2 * per, y0 + 18, "#ffc34d", 2); S.draw.line(c, x0 + per, y0 + 12, x0 + per, y0 + 24, "#ffc34d", 2); S.draw.line(c, x0 + 2 * per, y0 + 12, x0 + 2 * per, y0 + 24, "#ffc34d", 2);
      S.draw.text(c, "T = " + S.fmt(T * 1000, T < 0.001 ? 3 : 2) + " ms", x0 + 1.5 * per, y0 + 34, {size: 12.5, color: "#ffc34d"});
      S.draw.arrow(c, x0 + 14, cy, x0 + 14, cy - amp, "#ff8f7a", 2.4);
      S.draw.text(c, "A = " + S.fmt(A.value, 1), x0 + 40, cy - amp / 2 - (amp < 24 ? 12 : 0), {size: 12.5, color: "#ff8f7a", align: "left", bg: "rgba(6,16,14,.85)"});
      ctx.restore();
      S.draw.text(c, "4 périodes à l'écran · 1 div = T / 2 = " + S.fmt(T * 500, T < 0.001 ? 3 : 2) + " ms", W / 2, H - 16, {size: 11, color: "#8fd9b8", weight: 600, base: "bottom"});
      /* clavier : 3 octaves do2 → do5, + règle d'audibilité */
      var kw = kb.W - 20, nW = 22, wk = kw / nW, ky = 8, kh = 62, midi0 = 48, n = Math.round(12 * Math.log(fr / 440) / Math.LN2), midi = n + 69, kx0 = 10, kc = kb.ctx;
      var whites = []; for (var mm = midi0; mm < midi0 + 36; mm++) if (blackPat.indexOf(mm % 12) < 0) whites.push(mm);
      whites.push(midi0 + 36);
      whites.forEach(function(mk, i){ var on = mk === midi; S.draw.rrect(kb, kx0 + i * wk + 0.5, ky, wk - 1, kh, 3); kc.fillStyle = on ? P.acc : "#fff"; kc.fill(); kc.strokeStyle = "#9aa6b6"; kc.lineWidth = 1; kc.stroke(); if (mk % 12 === 0) S.draw.text(kb, "do" + (Math.floor(mk / 12) - 2), kx0 + i * wk + wk / 2, ky + kh - 9, {size: 10, color: on ? "#fff" : "#5f6b7a", weight: 700}); });
      whites.forEach(function(mk, i){ if (mk >= midi0 + 36) return; var nx = mk + 1; if (blackPat.indexOf(nx % 12) >= 0 && nx < midi0 + 36){ var on = nx === midi; S.draw.rrect(kb, kx0 + (i + 1) * wk - wk * 0.3, ky, wk * 0.6, kh * 0.6, 2); kc.fillStyle = on ? P.acc : "#1b2638"; kc.fill(); } });
      if (midi < midi0 || midi > midi0 + 36) S.draw.label(kb, midi < midi0 ? "◄ plus grave que le clavier" : "plus aigu que le clavier ►", kb.W / 2, ky + 30, {color: P.acc});
      /* règle d'audibilité (échelle logarithmique 10 Hz → 100 kHz) */
      var ry = 108, rx0 = 24, rx1 = kb.W - 24, lg = function(v){ return rx0 + (Math.log10(Math.max(10, Math.min(1e5, v))) - 1) / 4 * (rx1 - rx0); };
      kc.fillStyle = "#f4d6d0"; kc.fillRect(rx0, ry, lg(20) - rx0, 10); kc.fillStyle = "#cfe6d8"; kc.fillRect(lg(20), ry, lg(20000) - lg(20), 10); kc.fillStyle = "#d9d0f0"; kc.fillRect(lg(20000), ry, rx1 - lg(20000), 10);
      [10, 100, 1000, 10000, 100000].forEach(function(v){ S.draw.line(kb, lg(v), ry + 10, lg(v), ry + 15, "#6b7686", 1.2); S.draw.text(kb, v >= 1000 ? (v / 1000) + " kHz" : v + " Hz", lg(v), ry + 26, {size: 10.5, color: "#4a5668", weight: 600}); });
      S.draw.text(kb, "infrasons", (rx0 + lg(20)) / 2 + 6, ry - 8, {size: 10.5, color: P.red}); S.draw.text(kb, "audible", lg(1000), ry - 8, {size: 10.5, color: P.green}); S.draw.text(kb, "ultrasons", (lg(20000) + rx1) / 2, ry - 8, {size: 10.5, color: P.violet});
      var mx = lg(fr); kc.beginPath(); kc.moveTo(mx, ry - 1); kc.lineTo(mx - 6, ry - 11); kc.lineTo(mx + 6, ry - 11); kc.closePath(); kc.fillStyle = P.acc; kc.fill();
      var cents = 1200 * Math.log(fr / (440 * Math.pow(2, n / 12))) / Math.LN2, fn = 440 * Math.pow(2, n / 12);
      var nom = names[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 2);
      ro.set(0, S.fmt(fr, 0) + " Hz"); ro.set(1, S.fmt(T * 1000, T < 0.001 ? 3 : 2) + " ms"); ro.set(2, 340 / fr >= 1 ? S.fmt(340 / fr, 2) + " m" : S.fmt(34000 / fr, 1) + " cm");
      ro.set(3, nom + " (" + S.fmt(fn, 1) + " Hz, " + (cents >= 0 ? "+" : "−") + S.fmt(Math.abs(cents), 0) + " cents)"); ro.set(4, S.fmt(20 * Math.log10(A.value), 1) + " dB");
      nt.set(fr < 20 ? "Infrason : inaudible." : fr > 20000 ? "Ultrason : inaudible." : fr > 16000 ? "Très aigu : beaucoup d'adultes n'entendent plus cette fréquence." : "Fréquence dans le domaine audible. Repère : la₃ = 440 Hz (diapason), do₃ ≈ 262 Hz, voix parlée ≈ 100 à 250 Hz.", fr < 20 || fr > 20000 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c07-doppler", ch: "c07", tag: "Animation · Doppler",
  titre: "Effet Doppler et mur du son",
  resume: "Une source qui se déplace : fronts d'onde serrés devant, étirés derrière ; au-delà de 340 m/s, cône de Mach. Déplace l'ambulance toi-même.",
  but: "La source (ambulance, avion) émet toujours la même fréquence f₀. Règle sa vitesse ou attrape-la et déplace-la : chaque observateur s'illumine quand un front d'onde l'atteint, et son afficheur donne la fréquence perçue. Dépasse la vitesse du son pour voir le cône de Mach.",
  aRetenir: "Si la source s'approche de l'observateur à la vitesse v_s (< v), il perçoit f' = f₀·v/(v − v_s), plus aiguë ; si elle s'éloigne, f' = f₀·v/(v + v_s), plus grave. La fréquence émise par la source, elle, ne change pas : ce sont les fronts d'onde qui se serrent ou s'étirent. À v_s > v apparaît un cône de Mach, d'angle sin α = v/v_s, avec une onde de choc (le « bang »).",
  piege: "L'ambulance ne change pas de note : elle émet toujours f₀. C'est la perception qui change. Et la formule de Doppler ne s'applique pas à v_s ≥ v : devant la source, il n'y a plus de son avant son arrivée. Dessin : fréquence d'émission très ralentie pour qu'on voie les fronts.",
  build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette, Pm = window.PH6;
    var f0 = k.slider("Fréquence émise f₀", 200, 1000, 10, 500, "Hz");
    var vs = k.slider("Vitesse de la source v_s", 0, 600, 10, 100, "m/s", function(){ man = false; });
    var ro = k.readouts(["Mach (v_s/v)", "Perçue devant (observateur à droite)", "Perçue derrière (à gauche)", "Angle du cône"]);
    var nt = k.note("", "ok");
    var VS = 340, cv = 90, t = 0, ems = [], nextE = 0, xs = 40, man = false, vman = 0, lastX = 0, lastT = 0, dirS = 1, flash = [0, 0], hits = [0, 0], geo = {};
    k.button("Repartir de la gauche", function(){ reset(); }, true);
    function reset(){ t = 0; ems = []; nextE = 0; xs = 40; dirS = 1; man = false; vman = 0; }
    function Msig(){ return man ? Math.max(-3, Math.min(3, vman / cv)) : dirS * vs.value / VS; }
    var lp = k.loop(function(dt){
      var W = c.W, M = Msig(), Te = 110 / f0.value;
      if (!man){ xs += M * cv * dt; if (xs > W - 40 || xs < 40){ if (xs > W - 40) reset(); else xs = 40; } } else vman *= Math.pow(0.02, dt);
      t += dt;
      while (nextE <= t){ ems.push({x: xs, t: nextE}); nextE += Te; }
      var ox = [26, W - 26];
      ems.forEach(function(e){ var rp = cv * (t - dt - e.t), rn = cv * (t - e.t); for (var o = 0; o < 2; o++){ var dd = Math.abs(ox[o] - e.x); if (rp < dd && rn >= dd){ flash[o] = 1; hits[o] = t; } } });
      flash[0] *= Math.pow(0.02, dt); flash[1] *= Math.pow(0.02, dt);
      ems = ems.filter(function(e){ return cv * (t - e.t) < W * 1.3; });
      k.redraw();
    });
    lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(tp, p){
      if (tp === "down"){ man = true; lastX = xs; lastT = performance.now(); vman = 0; }
      if ((tp === "down" || tp === "drag") && man){ var nx = Math.max(40, Math.min(c.W - 40, p.x)), now = performance.now(), dtt = Math.max(0.012, (now - lastT) / 1000); vman = 0.6 * vman + 0.4 * (nx - xs) / dtt; xs = nx; lastT = now; }
      if (tp === "up"){ if (Math.abs(vman) < 8) vman = 0; man = false; if (vman !== 0) dirS = vman > 0 ? 1 : -1; }
    });
    k.draw(function(){
      c.clear(); Pm.bg(c, "#f4f7fb", "#e6ecf4"); var ctx = c.ctx, W = c.W, H = c.H, cy = H * 0.42, M = Msig(), aM = Math.abs(M);
      /* route */
      ctx.fillStyle = "#cfd6e0"; ctx.fillRect(0, cy + 18, W, 30); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(0, cy + 33); ctx.lineTo(W, cy + 33); ctx.stroke(); ctx.setLineDash([]);
      ems.forEach(function(e){ var r = cv * (t - e.t); if (r <= 0) return; ctx.beginPath(); ctx.arc(e.x, cy, r, 0, 7); ctx.strokeStyle = "rgba(31,75,158," + Math.max(0.12, 0.6 - r / (W * 1.6)) + ")"; ctx.lineWidth = 1.7; ctx.stroke(); });
      if (aM > 1){ var al = Math.asin(1 / aM), L = W * 1.2, sgn = M > 0 ? 1 : -1; ctx.strokeStyle = P.red; ctx.lineWidth = 2.6;
        [1, -1].forEach(function(s2){ ctx.beginPath(); ctx.moveTo(xs, cy); ctx.lineTo(xs - sgn * L * Math.cos(al), cy - s2 * L * Math.sin(al)); ctx.stroke(); }); }
      /* ambulance */
      var dsg = M < 0 ? -1 : 1; ctx.save(); ctx.translate(xs, cy + 22); ctx.scale(dsg, 1);
      Pm.metal(c, -24, -14, 48, 26, 5, "#f6f7f9"); ctx.fillStyle = P.red; ctx.fillRect(-24, -2, 48, 4); ctx.fillStyle = "#9cc3e8"; ctx.fillRect(10, -11, 11, 9);
      var blink = Math.floor(t * 6) % 2; ctx.fillStyle = blink ? P.red : P.blue; ctx.fillRect(-12, -18, 12, 5);
      S.draw.text({ctx: ctx}, "+", -8, -4, {size: 12, color: P.red}); ctx.restore();
      [-13, 13].forEach(function(dx){ S.draw.dot(c, xs + dx, cy + 36, 5.2, "#2a3444"); });
      Pm.glow = Pm.glow; S.draw.glow(c, xs, cy + 8, 26, blink ? P.red : P.blue, 0.3);
      S.draw.arrow(c, xs - dsg * 6, cy - 22, xs + dsg * (6 + Math.min(70, 14 + aM * 90)), cy - 22, P.ink, 2.6);
      if (!man && vs.value === 0) S.draw.label(c, "attrape l'ambulance et déplace-la", W / 2, 16, {color: P.grey, size: 11.5});
      /* observateurs */
      var fd = M < 1 ? f0.value / (1 - M) : null, fb = f0.value / (1 + M);
      if (M < 0){ fd = f0.value / (1 - M); fb = aM < 1 ? f0.value / (1 + M) : null; }
      var ox = [26, W - 26], vals = [fb, fd], names = ["derrière", "devant"];
      for (var o = 0; o < 2; o++){
        var xo = ox[o], yo = cy + 78;
        if (flash[o] > 0.05) S.draw.glow(c, xo, cy + 4, 22 + 14 * flash[o], P.green, 0.55 * flash[o]);
        S.draw.dot(c, xo, cy, 8, P.green); S.draw.line(c, xo, cy + 8, xo, cy + 52, "rgba(36,119,90,.35)", 1.5, [3, 3]);
        var txt = vals[o] === null ? "choc" : S.fmt(vals[o], 0);
        S.draw.display(c, txt, Math.max(52, Math.min(W - 52, xo + (o ? -24 : 24))), yo + 6, {w: 94, h: 46, caption: names[o] + " · Hz", size: 20});
      }
      /* f₀ source */
      S.draw.label(c, "f₀ = " + S.fmt(f0.value, 0) + " Hz (inchangée)", xs, cy - 40, {color: P.red, size: 11.5});
      var Mt = aM;
      ro.set(0, S.fmt(Mt, 2)); ro.set(1, fd === null ? "pas de son avant le passage" : S.fmt(fd, 0) + " Hz" + (M > 0.97 ? " (très aigu)" : "")); ro.set(2, fb === null ? "pas de son avant le passage" : S.fmt(fb, 0) + " Hz"); ro.set(3, Mt > 1 ? S.fmt(Math.asin(1 / Mt) * 180 / Math.PI, 1) + " °" : "—");
      nt.set(Mt < 0.97 ? (Mt < 0.01 ? "Source immobile : fronts concentriques, f perçue = f₀." : "Source subsonique : devant, les fronts se rapprochent (son plus aigu) ; derrière, ils s'écartent (son plus grave).") : Mt < 1 ? "On approche du mur du son : les fronts s'accumulent devant la source." : Mt === 1 ? "Mach 1 : les fronts s'empilent devant la source (mur du son)." : "Supersonique : la source dépasse ses propres ondes, le cône de Mach se forme.", Mt >= 1 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c07-decibels", ch: "c07", tag: "Santé auditive",
  titre: "Niveau sonore : décibels, distance et nombre de sources",
  resume: "60 dB + 60 dB ≠ 120 dB : l'échelle logarithmique du décibel, et le temps d'exposition admissible.",
  but: "Une source émet un niveau connu à 1 m. Fais varier ce niveau, la distance et le nombre de sources identiques. Lis le niveau reçu, la durée d'exposition maximale indicative et compare aux repères.",
  aRetenir: "Niveau sonore L = 10·log(I/I₀) avec I₀ = 10⁻¹² W/m². Doubler le nombre de sources identiques ajoute seulement 3 dB ; multiplier par 10 ajoute 10 dB. En champ libre, doubler la distance retire 6 dB (L = L₁ − 20·log r). À partir d'environ 85 dB (A), le risque auditif apparaît : chaque +3 dB divise par deux la durée d'exposition tolérable.",
  piege: "Deux sources de 60 dB ne donnent pas 120 dB mais 63 dB. Le niveau en dB n'est pas proportionnel à l'intensité : +10 dB = intensité ×10. Modèle simplifié : source ponctuelle en champ libre, sans réflexion, dB assimilés à des dB(A) ; la durée limite 8 h × 2^(−(L−85)/3) est une règle indicative.",
  build: function(k, S){
    var c = k.canvas(250), g = k.canvas(220), P = S.draw.palette, H = PH6;
    var L1 = k.slider("Niveau d'une source à 1 m", 50, 120, 1, 90, "dB");
    var r = k.slider("Distance à la source (ou glisse l'auditeur)", 1, 100, 1, 10, "m");
    var n = k.slider("Nombre de sources identiques", 1, 64, 1, 1, "");
    var ro = k.readouts(["Niveau reçu L", "Intensité I", "Intensité par rapport à 1 source à 1 m", "Durée d'exposition max (indicatif)"]);
    var nt = k.note("", "ok");
    var geo = {}, t = 0;
    function Lr(l1, nn, rr){ return l1 + 10 * Math.log10(nn) - 20 * Math.log10(rr); }
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(tp, p){ if (tp === "move" || tp === "up" || !geo.sx) return; var u = (p.x - geo.sx) / (geo.ex - geo.sx); u = Math.max(0, Math.min(1, u)); r.set(Math.max(1, Math.round(Math.pow(100, u)))); k.redraw(); });
    function zoneCol(L){ return L < 60 ? "#24775a" : L < 85 ? "#a98b00" : L < 100 ? "#c26a0c" : L < 120 ? "#c0321d" : "#8e1f12"; }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, L = Lr(L1.value, n.value, r.value);
      H.bg(c, "#f8fafd", "#eaf0f7");
      /* jauge de niveau */
      var lo = 0, hi = 140, x0 = 16, x1 = W - 16, gy = 62;
      function X(v){ return x0 + (v - lo) / (hi - lo) * (x1 - x0); }
      var zones = [[0, 60, "#9ed8b5"], [60, 85, "#f4e29a"], [85, 100, "#f6b26b"], [100, 120, "#ea8a6f"], [120, 140, "#c0392b"]];
      zones.forEach(function(z){ ctx.fillStyle = z[2]; ctx.fillRect(X(z[0]), gy, X(z[1]) - X(z[0]), 14); });
      [[0, "0"], [60, "60"], [85, "85"], [120, "120"]].forEach(function(m){ S.draw.line(c, X(m[0]), gy, X(m[0]), gy + 18, P.ink, 1); S.draw.text(c, m[1] + " dB", Math.min(Math.max(X(m[0]), 20), W - 20), gy + 28, {size: 10.5, color: "#4a5668", weight: 600}); });
      [[2, "audition"], [72, "conversation"], [92, "risque"], [110, "concert"], [131, "douleur"]].forEach(function(m, i){ if (W < 420 && (m[1] === "concert" || m[1] === "risque")) return; S.draw.text(c, m[1], Math.min(Math.max(X(m[0]), 34), W - 30), gy - 9 - (i % 2) * 0, {size: 10.5, color: "#2c3a4e", weight: 700}); });
      var Lc = Math.max(0, Math.min(140, L)); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(X(Lc), gy + 15); ctx.lineTo(X(Lc) - 6, gy + 25); ctx.lineTo(X(Lc) + 6, gy + 25); ctx.closePath(); ctx.fill();
      S.draw.display(c, S.fmt(L, 1) + " dB", Math.min(Math.max(X(Lc), 60), W - 60), 26, {w: 112, h: 38, size: 20, color: zoneCol(L), caption: null});
      /* scène : sources à gauche, auditeur sur une échelle logarithmique de 1 à 100 m */
      var sy = 170, sx = 44, ex = W - 30; geo.sx = sx; geo.ex = ex; geo.y = sy;
      ctx.fillStyle = "#cfd8e4"; ctx.fillRect(0, sy + 22, W, 10);
      [1, 2, 5, 10, 20, 50, 100].forEach(function(v){ var xx = sx + Math.log(v) / Math.log(100) * (ex - sx); S.draw.line(c, xx, sy + 22, xx, sy + 28, "#6b7686", 1.2); S.draw.text(c, v + " m", xx, sy + 43, {size: 10.5, color: "#4a5668", weight: 600}); });
      var lx = sx + Math.log(r.value) / Math.log(100) * (ex - sx);
      var amp = Math.max(0, (L - 20) / 100);
      for (var q = 0; q < 6; q++){ var ph = ((t * 0.9 + q / 6) % 1), rr = 18 + ph * (lx - sx - 14); if (rr < 8) continue; ctx.beginPath(); ctx.arc(sx, sy, rr, -0.85, 0.85); ctx.strokeStyle = "rgba(31,75,158," + (0.5 * (1 - ph) * (0.25 + amp)) + ")"; ctx.lineWidth = 2 + 4 * amp; ctx.stroke(); }
      var cnt = Math.min(n.value, 9), cols = cnt > 3 ? 3 : cnt, rows = Math.ceil(cnt / cols);
      for (var s2 = 0; s2 < cnt; s2++){ var cx2 = sx - 10 - (s2 % cols) * 11, cy2 = sy - 14 + Math.floor(s2 / cols) * 14 - (rows - 1) * 7 + 10; H.metal(c, cx2 - 6, cy2 - 8, 12, 16, 3, "#4b5565"); S.draw.dot(c, cx2, cy2 + 2, 3.2, "#9aa6b6"); }
      S.draw.label(c, n.value + (n.value > 1 ? " sources" : " source") + " · " + L1.value + " dB à 1 m", sx + 56, sy - 44, {color: P.acc, size: 11});
      var zc = zoneCol(L); S.draw.glow(c, lx, sy - 6, 30, zc, 0.35 + 0.3 * Math.min(1, Math.max(0, (L - 60) / 60)));
      ctx.fillStyle = "#e6b58c"; ctx.beginPath(); ctx.arc(lx, sy - 14, 8, 0, 7); ctx.fill(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.fillStyle = "#3a5ea8"; S.draw.rrect(c, lx - 8, sy - 5, 16, 22, 5); ctx.fill();
      S.draw.dot(c, lx - 8, sy - 14, 3, "#13233a"); S.draw.dot(c, lx + 8, sy - 14, 3, "#13233a");
      S.draw.label(c, "r = " + r.value + " m", lx, sy - 36, {color: P.ink, size: 11.5});
      if (t < 5) S.draw.label(c, "glisse l'auditeur", W / 2, Hh - 6, {color: P.grey, size: 10.5, base: "bottom"});
      var I = 1e-12 * Math.pow(10, L / 10), t8 = L > 85 ? 8 * 60 * Math.pow(2, -(L - 85) / 3) : null, tx;
      if (t8 === null) tx = "pas de limite pour 8 h"; else if (t8 >= 60) tx = S.fmt(t8 / 60, 1) + " h"; else if (t8 >= 1) tx = S.fmt(t8, 0) + " min"; else tx = S.fmt(t8 * 60, 0) + " s";
      ro.set(0, S.fmt(L, 1) + " dB"); ro.set(1, I >= 0.01 ? S.fmt(I, 3) + " W/m²" : S.sci(I) + " W/m²"); ro.set(2, "× " + S.fmt(Math.pow(10, (L - L1.value) / 10), 3)); ro.set(3, tx);
      nt.set(L > 120 ? "Dangereux : seuil de la douleur, lésions possibles en quelques secondes." : L > 85 ? "Au-dessus de 85 dB : risque pour l'audition si l'exposition dure. Protège-toi ou éloigne-toi." : L < 30 ? "Très calme." : "Niveau sans danger pour une exposition normale. Repère : conversation ≈ 60 dB, circulation ≈ 80 dB.", L > 120 ? "bad" : L > 85 ? "warn" : "ok");
      var ax = S.draw.axes(g, {x0: 0, x1: 100, y0: 20, y1: 140, xl: "distance (m)", yl: "L (dB)", l: 50, t: 20, stepX: 20, stepY: 20});
      S.draw.area(g, ax, function(){ return 140; }, 0, 100, "#c0321d", 0.06, 85);
      S.draw.line(g, ax.L, ax.Y(85), ax.R, ax.Y(85), P.red, 1.5, [6, 4]); S.draw.text(g, "seuil de risque 85 dB", ax.R - 4, ax.Y(85) - 9, {size: 11, color: P.red, align: "right"});
      S.draw.fn(g, ax, function(x){ return x < 1 ? NaN : Lr(L1.value, 1, x); }, P.grey, 2, [5, 4]);
      S.draw.fn(g, ax, function(x){ return x < 1 ? NaN : Lr(L1.value, n.value, x); }, P.acc, 3);
      S.draw.dot(g, ax.X(r.value), ax.Y(Math.max(20, Math.min(140, L))), 6, P.red);
      S.draw.legend(g, n.value === 1 ? [[P.acc, "une seule source"]] : [[P.grey, "1 source", true], [P.acc, n.value + " sources"]], ax.R - 8, ax.T + 6, {align: "right"});
    });
  }
});

SFA.sim({
  id: "p6-c07-tuyau", ch: "c07", tag: "Instruments",
  titre: "Tuyau sonore : ouvert ou fermé, fondamental et harmoniques",
  resume: "Flûte, orgue, clarinette : f = n·v/(2L) pour un tuyau ouvert ; f = (2k−1)·v/(4L) pour un tuyau fermé. Étire le tuyau à la main et accorde-le.",
  but: "Choisis le type de tuyau et le mode, puis tire la poignée rouge pour changer la longueur L. Les particules d'air vibrent : ventres de déplacement aux extrémités ouvertes, nœud à l'extrémité fermée. Lance le défi pour accorder le tuyau sur une note.",
  aRetenir: "L'air du tuyau vibre en onde stationnaire. Tuyau ouvert aux deux bouts : ventre de déplacement aux deux bouts, f_n = n·v/(2L), tous les harmoniques. Tuyau fermé à un bout : nœud au bout fermé, f = (2k−1)·v/(4L), harmoniques impairs seulement, fondamental une octave plus bas. La vitesse du son dépend de la température : v ≈ 331 + 0,6·θ (m/s, θ en °C).",
  piege: "À longueur égale, le tuyau fermé est une octave plus grave que l'ouvert. Et un instrument à vent se désaccorde quand il chauffe : v augmente donc f aussi. Modèle : correction de bout négligée (en réalité l'extrémité ouverte se comporte comme un tuyau un peu plus long).",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette, Pm = window.PH6;
    var typ = k.seg("Tuyau", [["o", "Ouvert aux 2 bouts"], ["f", "Fermé à un bout"]], "o");
    var L = k.slider("Longueur L", 0.1, 2, 0.05, 1, "m");
    var th = k.slider("Température de l'air", -10, 40, 1, 20, "°C");
    var md = k.seg("Mode", [["1", "1er"], ["2", "2e"], ["3", "3e"]], "1");
    var goal = null, t = 0, geo = {}, NOTES = [["do₄", 261.63], ["mi₄", 329.63], ["sol₄", 392], ["la₄", 440], ["do₅", 523.25]];
    k.button("Défi : accorde le tuyau sur une note", function(){ goal = NOTES[Math.floor(Math.random() * NOTES.length)]; }, true);
    var ro = k.readouts(["Vitesse du son v", "Fréquence du mode", "Longueur d'onde du mode", "Fondamental"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    function noteName(f){ var NN = ["do", "do♯", "ré", "ré♯", "mi", "fa", "fa♯", "sol", "sol♯", "la", "la♯", "si"], m = Math.round(69 + 12 * Math.log(f / 440) / Math.LN2), cents = Math.round(1200 * Math.log(f / (440 * Math.pow(2, (m - 69) / 12))) / Math.LN2); return NN[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1) + (cents ? " " + (cents > 0 ? "+" : "−") + Math.abs(cents) + "¢" : ""); }
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(tp, p){ if ((tp === "down" || tp === "drag") && geo.u){ L.set(Math.round(Math.max(0.1, Math.min(2, (p.x - geo.x0) / geo.u)) / 0.05) * 0.05); } });
    k.draw(function(){
      c.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, v = 331.3 + 0.606 * th.value, open = typ.value === "o", j = parseInt(md.value, 10);
      var n = open ? j : 2 * j - 1, f = open ? n * v / (2 * L.value) : n * v / (4 * L.value), lam = v / f, f1 = open ? v / (2 * L.value) : v / (4 * L.value);
      var x0 = 30, uMax = W - 78, u = uMax / 2.0; geo.u = u; geo.x0 = x0;   /* px par mètre : échelle fixe pour voir la longueur changer */
      var x1 = x0 + L.value * u, cy = 84, h = 30, w = 2 * Math.PI * 0.8 * t;
      /* tube : paroi métallique et intérieur */
      var gi = ctx.createLinearGradient(0, cy - h, 0, cy + h); gi.addColorStop(0, "#eef3fb"); gi.addColorStop(1, "#dbe5f3");
      ctx.fillStyle = gi; ctx.fillRect(x0, cy - h, x1 - x0, 2 * h);
      /* densité (pression) : bandes colorées sous le tube */
      var amp = 13;
      function xi(uu){ return open ? Math.cos(n * Math.PI * uu) : Math.sin(n * Math.PI * uu / 2); }
      function dxi(uu){ return open ? -n * Math.PI * Math.sin(n * Math.PI * uu) : n * Math.PI / 2 * Math.cos(n * Math.PI * uu / 2); }
      var nb = 90; for (var a = 0; a < nb; a++){ var u0 = a / nb, pr = -dxi(u0) * Math.cos(w) * 0.34, al = Math.min(0.55, Math.abs(pr) * 0.55); ctx.fillStyle = pr > 0 ? "rgba(192,50,29," + al + ")" : "rgba(31,75,158," + al + ")"; ctx.fillRect(x0 + u0 * (x1 - x0), cy - h, (x1 - x0) / nb + 0.6, 2 * h); }
      Pm.metal(c, x0 - 2, cy - h - 7, x1 - x0 + 4, 8, 3, "#9aa6b8"); Pm.metal(c, x0 - 2, cy + h - 1, x1 - x0 + 4, 8, 3, "#9aa6b8");
      if (!open) Pm.metal(c, x0 - 10, cy - h - 7, 12, 2 * h + 16, 4, "#6b7686");
      /* particules d'air */
      for (var q = 0; q <= 44; q++){ var uq = q / 44; for (var b = -1; b <= 1; b++){ var px = x0 + uq * (x1 - x0) + amp * xi(uq) * Math.cos(w), py = cy + b * 18; ctx.fillStyle = "rgba(19,35,58,.6)"; ctx.beginPath(); ctx.arc(px, py, 2, 0, 7); ctx.fill(); } }
      /* enveloppe du déplacement */
      ctx.strokeStyle = P.green; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var i = 0; i <= 200; i++){ var uu = i / 200, yy = cy + h + 26 - 18 * Math.abs(xi(uu)); if (i) ctx.lineTo(x0 + uu * (x1 - x0), yy); else ctx.moveTo(x0 + uu * (x1 - x0), yy); } ctx.stroke(); ctx.setLineDash([]);
      S.draw.line(c, x0, cy + h + 26, x1, cy + h + 26, "#d5dce6", 1);
      /* ventres et nœuds */
      for (var m2 = 0; m2 <= (open ? n : n); m2++){ /* repères selon le mode */ }
      var marks = []; for (var s2 = 0; s2 <= 2 * n + 0.001; s2++){ var uu2 = open ? s2 / (2 * n) * 1 : s2 / (2 * n) * 1; if (uu2 > 1.0001) break; var isV = Math.abs(xi(uu2)) > 0.99; marks.push([uu2, isV]); }
      marks.forEach(function(mk){ S.draw.dot(c, x0 + mk[0] * (x1 - x0), cy + h + 26 - (mk[1] ? 18 : 0), 3.6, mk[1] ? P.green : P.red); });
      /* poignée de longueur */
      S.draw.arrow(c, x1 + 4, cy, x1 + 26, cy, P.red, 3); S.draw.arrow(c, x1 - 4, cy, x1 - 26, cy, P.red, 3);
      S.draw.dot(c, x1, cy, 8, P.red);
      S.draw.line(c, x0, cy - h - 20, x1, cy - h - 20, P.ink, 1.5); S.draw.line(c, x0, cy - h - 25, x0, cy - h - 15, P.ink, 1.5); S.draw.line(c, x1, cy - h - 25, x1, cy - h - 15, P.ink, 1.5);
      S.draw.label(c, "L = " + S.fmt(L.value, 2) + " m", (x0 + x1) / 2, cy - h - 38, {color: P.ink, size: 12});
      S.draw.text(c, open ? "ventre" : "nœud (fermé)", x0 + (open ? 0 : 0), cy + h + 54, {size: 11.5, color: open ? P.green : P.red, align: "left"});
      S.draw.text(c, "● ventre de déplacement   ● nœud", W - 10, cy + h + 54, {size: 11, color: P.grey, align: "right"});
      /* afficheur */
      S.draw.display(c, S.fmt(f, 0) + " Hz", 78, H - 50, {w: 128, h: 54, caption: "FRÉQUENCE · " + noteName(f), size: 22});
      if (goal){ var ok = Math.abs(f / goal[1] - 1) < 0.015; S.draw.display(c, S.fmt(goal[1], 0) + " Hz", W - 78, H - 50, {w: 128, h: 54, caption: "CIBLE · " + goal[0], size: 22, color: ok ? P.green : P.ink}); }
      var harm = []; for (var qq = 1; qq <= 4; qq++) harm.push(S.fmt(open ? qq * f1 : (2 * qq - 1) * f1, 0));
      ro.set(0, S.fmt(v, 1) + " m/s"); ro.set(1, S.fmt(f, 1) + " Hz (n = " + n + ")"); ro.set(2, S.fmt(lam, 3) + " m"); ro.set(3, S.fmt(f1, 1) + " Hz");
      if (goal){ var ok2 = Math.abs(f / goal[1] - 1) < 0.015; nt.set("<b>Défi :</b> joue " + goal[0] + " (" + S.fmt(goal[1], 0) + " Hz) à 1,5 % près. " + (ok2 ? "Accordé : L = " + S.fmt(L.value, 2) + " m en " + (open ? "tuyau ouvert" : "tuyau fermé") + ", mode " + md.value + "." : "Pour l'instant : " + S.fmt(f, 0) + " Hz. Astuce : f = n·v/(2L) (ouvert) ou n·v/(4L) (fermé)."), ok2 ? "ok" : "warn"); }
      else nt.set("Quatre premiers modes de ce tuyau : " + harm.join(" ; ") + " Hz." + (open ? "" : " (harmoniques impairs seulement)"), "ok");
    });
  }
});

