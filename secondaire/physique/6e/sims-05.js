/* Chapitre 5 · Oscillations et vibrations */
SFA.sim({
  id: "p6-c05-masse-ressort", ch: "c05", tag: "Classique",
  titre: "Masse-ressort : période, graphe et énergie",
  resume: "T = 2π·√(m/k) : la période dépend de m et de k, pas de l'amplitude.",
  but: "Une masse oscille sans frottement au bout d'un ressort. Change m, k et l'amplitude : lis la période sur le graphe x(t) et vois l'énergie passer de cinétique à élastique.",
  aRetenir: "Pour un oscillateur masse-ressort, T = 2π·√(m/k) et f = 1/T. Plus la masse est grande, plus la période augmente ; plus le ressort est raide, plus elle diminue. L'amplitude n'a aucune influence sur T. L'énergie mécanique E = ½·k·A² se conserve : elle passe sans cesse de l'élastique au cinétique.",
  piege: "Doubler l'amplitude ne change pas la période (la masse va plus vite sur un chemin plus long). Pour doubler T, il faut multiplier la masse par 4 (racine carrée !). Modèle : ressort idéal, sans frottement.",
  build: function(k, S){
    var c = k.canvas(250), g = k.canvas(190), eb = k.canvas(96), P = S.draw.palette, H = PH6;
    var m = k.slider("Masse m", 0.1, 2, 0.1, 0.5, "kg", function(){ rst(); });
    var K = k.slider("Raideur k", 5, 100, 5, 20, "N/m", function(){ rst(); });
    var A = k.slider("Amplitude A (ou glisse la masse)", 2, 20, 1, 10, "cm", function(){ rst(); });
    var vec = k.toggle("Montrer vitesse v et force F", true);
    var ro = k.readouts(["Période T", "Fréquence f", "Vitesse maximale", "Énergie mécanique"]);
    var target = null, nt = k.note("Défi : choisis m et k pour obtenir une période cible. Appuie sur « Lancer le défi ».", "");
    k.button("Lancer le défi", function(){ target = Math.round((0.4 + Math.random() * 1.6) * 10) / 10; chk(); k.redraw(); }, true);
    var x = 0.10, v = 0, drag = false, hist = [], tt = 0, lay = {};
    function w0(){ return Math.sqrt(K.value / m.value); }
    function rst(){ x = A.value / 100; v = 0; hist = []; tt = 0; chk(); }
    function chk(){
      var T = 2 * Math.PI / w0();
      if (target === null) return;
      var ok = Math.abs(T - target) / target < 0.03;
      nt.set("Défi : obtiens T = <b>" + S.fmt(target, 1) + " s</b> (à 3 % près). Ta période : " + S.fmt(T, 2) + " s. " + (ok ? "Réussi !" : T > target ? "Trop lente : diminue m ou augmente k." : "Trop rapide : augmente m ou diminue k."), ok ? "ok" : "warn");
    }
    var lp = k.loop(function(dt){
      if (!drag){ var w = w0(), co = Math.cos(w * dt), si = Math.sin(w * dt), nx = x * co + v / w * si, nv = -x * w * si + v * co; x = nx; v = nv; tt += dt; hist.push([tt, x * 100]); }
      var T = 2 * Math.PI / w0(); while (hist.length && tt - hist[0][0] > 3 * T) hist.shift();
      k.redraw();
    }); lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, p){
      if (t === "down" || (t === "drag")){
        var xm = (p.x - lay.cx) / lay.sc; xm = Math.max(-0.2, Math.min(0.2, xm));
        if (t === "down" && Math.abs(p.x - (lay.cx + x * lay.sc)) > 60 && p.y < c.H * 0.25) return;
        drag = true; x = xm; v = 0; hist = []; tt = 0; A.set(Math.max(2, Math.round(Math.abs(xm) * 100))); k.redraw();
      } else if (t === "up"){ if (drag){ drag = false; chk(); } }
    });
    function spring(ctx, x0, x1, y, n, amp){
      var lead = 14, a = x0 + lead, b = x1 - lead; if (b < a + 10) b = a + 10;
      ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
      [["rgba(15,27,45,.18)", 5, 3], [P.ink, 2.4, 0]].forEach(function(st){
        ctx.beginPath(); ctx.strokeStyle = st[0]; ctx.lineWidth = st[1]; ctx.moveTo(x0, y + st[2]); ctx.lineTo(a, y + st[2]);
        for (var i = 0; i <= n * 8; i++){ var u = i / (n * 8); ctx.lineTo(a + (b - a) * u + 3 * Math.cos(u * n * 2 * Math.PI), y + st[2] + amp * Math.sin(u * n * 2 * Math.PI)); }
        ctx.lineTo(x1, y + st[2]); ctx.stroke();
      }); ctx.restore();
    }
    k.draw(function(){
      c.clear(); g.clear(); eb.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, w = w0(), T = 2 * Math.PI / w;
      var E = 0.5 * K.value * Math.pow(A.value / 100, 2), Ep = 0.5 * K.value * x * x, Ec = 0.5 * m.value * v * v;
      H.bg(c, "#f8fafd", "#eaf0f7");
      var cy = Hh * 0.46, cx = W / 2 + 14, sc = (W / 2 - 62) / 0.2; lay.cx = cx; lay.sc = sc;
      var fy = cy + 38 + 8, xm = cx + x * sc, s = 30 + 16 * m.value;
      /* sol gradué */
      ctx.fillStyle = "#cfd8e4"; ctx.fillRect(0, fy, W, 12); ctx.fillStyle = "#b3bfce"; ctx.fillRect(0, fy + 12, W, Hh);
      for (var q = -20; q <= 20; q += 5){ var gx = cx + q / 100 * sc; S.draw.line(c, gx, fy, gx, fy + (q % 10 ? 5 : 9), "#6b7686", 1.2); if (q % 10 === 0) S.draw.text(c, q, gx, fy + 21, {size: 11, color: "#4a5668", weight: 700}); }
      S.draw.text(c, "x (cm)", W - 28, fy + 38, {size: 11, color: "#4a5668"});
      /* mur hachuré */
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(10, cy - 50, 9, 100); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.3;
      for (var h = cy - 46; h < cy + 50; h += 10){ ctx.beginPath(); ctx.moveTo(10, h + 8); ctx.lineTo(3, h + 14); ctx.stroke(); }
      S.draw.line(c, cx, cy - 56, cx, fy, P.grey, 1.2, [4, 4]);
      S.draw.label(c, "x = 0", cx, cy - 64, {color: P.grey, size: 11});
      spring(ctx, 19, xm - s / 2 + 2, cy, 12, 13);
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      var g2 = ctx.createLinearGradient(0, cy - s / 2, 0, cy + s / 2 + 0.01); g2.addColorStop(0, "#4f7fd6"); g2.addColorStop(1, P.acc);
      S.draw.rrect(c, xm - s / 2, cy - s / 2, s, s, 5); ctx.fillStyle = g2; ctx.fill(); ctx.restore();
      S.draw.text(c, S.fmt(m.value, 1) + " kg", xm, cy, {size: 12, color: "#fff"});
      if (!drag && tt < 2.5) S.draw.label(c, "glisse la masse !", xm, cy - s / 2 - 16, {color: P.acc});
      if (vec.value){
        var vs = Math.max(-1, Math.min(1, v / (0.2 * 6))) * 70;
        if (Math.abs(vs) > 3) S.draw.arrow(c, xm, cy + s / 2 + 12, xm + vs, cy + s / 2 + 12, P.green, 3);
        var Fs = -K.value * x / (K.value * 0.2) * 60;
        if (Math.abs(Fs) > 3) S.draw.arrow(c, xm, cy - s / 2 - 8, xm + Fs, cy - s / 2 - 8, P.red, 3);
        S.draw.legend(c, [[P.green, "vitesse v"], [P.red, "force de rappel F = −k·x"]], 28, 8, {box: true});
      }
      S.draw.label(c, "x = " + S.fmt(x * 100, 1) + " cm", W - 56, 18, {color: P.acc, size: 13});
      /* graphe */
      var ax = S.draw.axes(g, {x0: 0, x1: 3 * T, y0: -20, y1: 20, xl: "t (s)", yl: "x (cm)", l: 46, t: 18, stepY: 10});
      var cg = g.ctx; cg.save(); cg.beginPath(); cg.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); cg.clip(); cg.strokeStyle = P.acc; cg.lineWidth = 2.6; cg.lineJoin = "round"; cg.beginPath();
      var off = Math.max(0, tt - 3 * T); hist.forEach(function(p, i){ var X = ax.X(p[0] - off), Y = ax.Y(p[1]); if (i) cg.lineTo(X, Y); else cg.moveTo(X, Y); }); cg.stroke(); cg.restore();
      S.draw.dot(g, ax.X(Math.min(tt, 3 * T)), ax.Y(x * 100), 5.5, P.red);
      /* période mesurée entre deux sommets */
      S.draw.line(g, ax.X(T), ax.T + 14, ax.X(2 * T), ax.T + 14, P.amber, 2); S.draw.line(g, ax.X(T), ax.T + 8, ax.X(T), ax.T + 20, P.amber, 2); S.draw.line(g, ax.X(2 * T), ax.T + 8, ax.X(2 * T), ax.T + 20, P.amber, 2);
      S.draw.label(g, "T = " + S.fmt(T, 2) + " s", ax.X(1.5 * T), ax.T + 32, {color: P.amber, size: 12});
      /* énergie */
      var bw = eb.W - 150, e = eb.ctx, rows = [["Cinétique ½mv²", Ec, P.green], ["Élastique ½kx²", Ep, P.amber], ["Mécanique (constante)", Ec + Ep, P.acc]];
      rows.forEach(function(r, i){
        var yy = 14 + i * 28; S.draw.text(eb, r[0], 8, yy + 8, {size: 12, align: "left", color: "#2c3a4e"});
        S.draw.rrect(eb, 150, yy, bw, 16, 8); e.fillStyle = "#e3e7ed"; e.fill();
        if (r[1] > 1e-9){ S.draw.rrect(eb, 150, yy, Math.max(8, bw * Math.min(1, r[1] / E)), 16, 8); e.fillStyle = r[2]; e.fill(); }
      });
      ro.set(0, S.fmt(T, 3) + " s"); ro.set(1, S.fmt(1 / T, 2) + " Hz"); ro.set(2, S.fmt(A.value / 100 * w, 2) + " m/s"); ro.set(3, S.fmt(E * 1000, 1) + " mJ");
    });
    rst();
  }
});

SFA.sim({
  id: "p6-c05-pendule", ch: "c05", tag: "Classique",
  titre: "Le pendule simple : qui compte vraiment ?",
  resume: "T ≈ 2π·√(L/g) : longueur et pesanteur comptent ; masse et (petite) amplitude, non.",
  but: "Le pendule oscille vraiment (le mouvement est calculé, pas imposé). Change L, la planète (g), l'angle de départ et la masse. Compare la période mesurée à la formule des petits angles.",
  aRetenir: "Pour les petits angles (moins de ≈ 15°), T = 2π·√(L/g) : indépendant de la masse et de l'amplitude. Il faut une longueur 4 fois plus grande pour doubler T. Sur la Lune (g = 1,62 m/s²), le même pendule bat plus lentement.",
  piege: "La masse n'intervient pas du tout (curseur à essayer !). L'amplitude n'a d'effet qu'aux grands angles : à 60° la vraie période dépasse la formule d'environ 7 %. La formule T = 2π√(L/g) n'est exacte que pour de petits angles.",
  build: function(k, S){
    var c = k.canvas(330), g = k.canvas(170), P = S.draw.palette, H = PH6;
    var L = k.slider("Longueur L", 0.1, 3, 0.1, 1, "m", reset);
    var pl = k.select("Lieu", [["9.81", "Terre (9,81 m/s²)"], ["1.62", "Lune (1,62 m/s²)"], ["3.71", "Mars (3,71 m/s²)"], ["24.8", "Jupiter (24,8 m/s²)"]], "9.81", reset);
    var th0 = k.slider("Angle de départ θ₀ (ou glisse la masse)", 5, 80, 5, 10, "°", reset);
    var ms = k.slider("Masse du pendule (sans effet !)", 0.1, 2, 0.1, 1, "kg");
    var gh = k.toggle("Pendule « petits angles » (fantôme)", true);
    var ro = k.readouts(["T formule (petits angles)", "T réel (grand angle)", "Écart", "Période mesurée"]);
    var th, om, t, hist, lastCross, meas, drag = false, lay = {}, trail = [];
    function reset(){ th = th0.value * Math.PI / 180; om = 0; t = 0; hist = []; trail = []; lastCross = null; meas = null; }
    function agm(a, b){ for (var i = 0; i < 30; i++){ var an = (a + b) / 2, bn = Math.sqrt(a * b); a = an; b = bn; } return a; }
    reset();
    var lp = k.loop(function(dt){
      if (!drag){
        var gg = parseFloat(pl.value), l = L.value, n = 20, h = dt / n;
        var acc = function(x){ return -gg / l * Math.sin(x); };
        for (var i = 0; i < n; i++){
          var k1 = om, a1 = acc(th), k2 = om + 0.5 * h * a1, a2 = acc(th + 0.5 * h * k1), k3 = om + 0.5 * h * a2, a3 = acc(th + 0.5 * h * k2), k4 = om + h * a3, a4 = acc(th + h * k3);
          var thn = th + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4), omn = om + h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
          if (om > 0 && omn <= 0){ if (lastCross !== null) meas = t - lastCross; lastCross = t; }
          th = thn; om = omn; t += h;
        }
        hist.push([t, th]); while (hist.length && t - hist[0][0] > 8) hist.shift();
        trail.push([t, th]); while (trail.length && t - trail[0][0] > 0.9) trail.shift();
      }
      k.redraw();
    }); lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(ty, p){
      if (ty === "up"){ drag = false; return; }
      if (ty === "down"){ var dx = p.x - lay.bx, dy = p.y - lay.by; if (dx * dx + dy * dy > 50 * 50) return; drag = true; }
      if (drag){ var a = Math.atan2(p.x - lay.px, p.y - lay.py) * 180 / Math.PI; a = Math.max(5, Math.min(80, Math.round(Math.abs(a) / 5) * 5)); th0.set(a); reset(); th = (p.x < lay.px ? -1 : 1) * a * Math.PI / 180; k.redraw(); }
    });
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, gg = parseFloat(pl.value), l = L.value;
      var T0 = 2 * Math.PI * Math.sqrt(l / gg), a0 = th0.value * Math.PI / 180, Tr = T0 / agm(1, Math.cos(a0 / 2));
      H.bg(c, "#f8fafd", "#eaf0f7");
      var px = W / 2, py = 34, R = (Hh - 76) * (0.3 + 0.7 * l / 3);
      lay.px = px; lay.py = py;
      var bx = px + R * Math.sin(th), by = py + R * Math.cos(th), br = 11 + 8 * ms.value; lay.bx = bx; lay.by = by;
      /* rapporteur */
      ctx.save(); ctx.strokeStyle = "#c9d3df"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(px, py, R * 0.55, Math.PI / 2 - 1.4, Math.PI / 2 + 1.4); ctx.stroke(); ctx.restore();
      for (var d = -80; d <= 80; d += 20){ var ar = d * Math.PI / 180; S.draw.line(c, px + R * 0.55 * Math.sin(ar), py + R * 0.55 * Math.cos(ar), px + (R * 0.55 + 7) * Math.sin(ar), py + (R * 0.55 + 7) * Math.cos(ar), "#9aa6b6", 1.2); if (d && R > 120) S.draw.text(c, Math.abs(d) + "°", px + (R * 0.55 + 20) * Math.sin(ar), py + (R * 0.55 + 20) * Math.cos(ar), {size: 10.5, color: "#7b8694", weight: 600}); }
      S.draw.line(c, px, py, px, py + R + 20, P.grey, 1.2, [4, 4]);
      /* fantôme petits angles */
      if (gh.value){ var tg = a0 * Math.cos(2 * Math.PI / T0 * t), gx = px + R * Math.sin(tg), gy = py + R * Math.cos(tg);
        S.draw.line(c, px, py, gx, gy, "rgba(138,149,163,.6)", 1.6, [5, 4]); ctx.beginPath(); ctx.arc(gx, gy, br, 0, 7); ctx.strokeStyle = "rgba(138,149,163,.9)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.6; ctx.stroke(); ctx.setLineDash([]); }
      /* traînée stroboscopique */
      trail.forEach(function(q, i){ if (i % 3) return; var a = i / trail.length; ctx.beginPath(); ctx.arc(px + R * Math.sin(q[1]), py + R * Math.cos(q[1]), br * 0.7, 0, 7); ctx.fillStyle = "rgba(31,75,158," + (0.05 + 0.18 * a) + ")"; ctx.fill(); });
      /* support */
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(px - 50, py - 16, 100, 10); ctx.fillStyle = "#5f6b7a"; ctx.fillRect(px - 50, py - 8, 100, 2);
      S.draw.line(c, px, py - 4, bx, by, P.ink, 2);
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.3)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      var rg = ctx.createRadialGradient(bx - br * 0.35, by - br * 0.35, br * 0.1, bx, by, br); rg.addColorStop(0, "#7ea3e6"); rg.addColorStop(1, P.acc);
      ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fillStyle = rg; ctx.fill(); ctx.restore();
      S.draw.dot(c, px, py, 3.5, P.ink);
      S.draw.label(c, "θ = " + S.fmt(Math.abs(th) * 180 / Math.PI, 0) + " °", px, py + R + 30 > Hh - 12 ? Hh - 12 : py + R + 30, {color: P.acc, size: 13});
      S.draw.label(c, "L = " + S.fmt(l, 1) + " m", 52, 18, {color: P.grey}); S.draw.label(c, "g = " + S.fmt(gg, 2) + " m/s²", 52, 40, {color: P.grey});
      if (t < 4) S.draw.label(c, "glisse la masse pour changer θ₀", W / 2, Hh - 14, {color: P.acc, size: 11});
      /* graphe θ(t) : vrai (rouge) et petits angles (gris pointillé) */
      var ym = th0.value > 45 ? 90 : th0.value > 20 ? 45 : 20, x0 = Math.max(0, t - 8), ax = S.draw.axes(g, {x0: x0, x1: x0 + 8, y0: -ym, y1: ym, xl: "t (s)", yl: "θ (°)", l: 46, t: 14, stepY: ym > 50 ? 45 : ym / 2});
      var c2 = g.ctx; c2.save(); c2.beginPath(); c2.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); c2.clip();
      if (gh.value) S.draw.fn(g, ax, function(tq){ return th0.value * Math.cos(2 * Math.PI / T0 * tq); }, "rgba(138,149,163,.9)", 1.6, [5, 4]);
      c2.strokeStyle = P.red; c2.lineWidth = 2.4; c2.beginPath(); hist.forEach(function(p, i){ var X = ax.X(p[0]), Y = ax.Y(p[1] * 180 / Math.PI); if (i) c2.lineTo(X, Y); else c2.moveTo(X, Y); }); c2.stroke(); c2.restore();
      ro.set(0, S.fmt(T0, 3) + " s"); ro.set(1, S.fmt(Tr, 3) + " s"); ro.set(2, S.fmt((Tr / T0 - 1) * 100, 1) + " %"); ro.set(3, meas ? S.fmt(meas, 3) + " s" : "…");
    });
  }
});

SFA.sim({
  id: "p6-c05-amortissement", ch: "c05", tag: "Amortissement",
  titre: "Oscillations amorties : trois régimes",
  resume: "Frottement faible, critique ou fort : pseudo-périodique, critique, apériodique.",
  but: "Écarte la masse de 10 cm et lâche-la. Augmente le coefficient de frottement b : l'amplitude décroît en exponentielle, jusqu'à ne plus osciller du tout.",
  aRetenir: "Un frottement fluide −b·v dissipe l'énergie : l'amplitude décroît comme e^(−b·t/2m) (enveloppe en pointillés). Si b est faible (b < 2√(k·m)), le mouvement est pseudo-périodique, de pseudo-période un peu plus grande que T₀. Au-delà, il n'y a plus d'oscillation : régime critique (retour le plus rapide) puis apériodique (retour lent). Les amortisseurs d'une voiture visent le régime critique.",
  piege: "L'amortissement ne fait pas disparaître l'oscillation « d'un coup » : l'amplitude décroît progressivement, et le régime critique est le plus rapide pour revenir à zéro, pas le plus fort frottement. Modèle : frottement proportionnel à la vitesse.",
  build: function(k, S){
    var c = k.canvas(210), g = k.canvas(260), P = S.draw.palette, H = PH6;
    var m = k.slider("Masse m", 0.2, 2, 0.1, 0.5, "kg", rst);
    var K = k.slider("Raideur k", 5, 50, 5, 20, "N/m", rst);
    var b = k.slider("Frottement b", 0, 14, 0.2, 1, "kg/s", rst);
    var env = k.toggle("Enveloppe e^(−bt/2m)", true);
    var ro = k.readouts(["Régime", "Pseudo-période", "Temps pour amplitude ÷ 2", "b critique 2√(k·m)"]);
    var t = 0, F = null, tm = 4, regime = "";
    k.button("Relâcher à nouveau", function(){ t = 0; k.redraw(); }, true);
    function rst(){ t = 0; }
    var lp = k.loop(function(dt){ t += dt; if (t > tm + 1.5) t = 0; k.redraw(); }); lp.play();
    var x0 = 10;
    function model(){
      var w0 = Math.sqrt(K.value / m.value), g = b.value / (2 * m.value), bc = 2 * Math.sqrt(K.value * m.value), T = 2 * Math.PI / w0, reg, f;
      if (Math.abs(b.value - bc) < 0.11){ reg = "critique"; f = function(tt){ return x0 * (1 + w0 * tt) * Math.exp(-w0 * tt); }; T = NaN; }
      else if (g < w0){ var wd = Math.sqrt(w0 * w0 - g * g); reg = "pseudo-périodique"; f = function(tt){ return x0 * Math.exp(-g * tt) * (Math.cos(wd * tt) + g / wd * Math.sin(wd * tt)); }; T = 2 * Math.PI / wd; }
      else { var s = Math.sqrt(g * g - w0 * w0), l1 = -g + s, l2 = -g - s; reg = "apériodique"; f = function(tt){ return x0 * (l2 * Math.exp(l1 * tt) - l1 * Math.exp(l2 * tt)) / (l2 - l1); }; T = NaN; }
      return {w0: w0, g: g, bc: bc, T: T, reg: reg, f: f};
    }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, M = model(), f = M.f, w0 = M.w0, gam = M.g;
      var T0 = 2 * Math.PI / w0; tm = Math.max(4 * T0, 3); if (M.reg === "pseudo-périodique") tm = Math.max(tm, 6 / Math.max(gam, 0.4)); tm = Math.min(tm, 20);
      /* scène : ressort + piston dans un cylindre d'huile */
      H.bg(c, "#f8fafd", "#eaf0f7");
      var cy = Hh * 0.44, cx = W / 2 + 20, sc = (W / 2 - 70) / 12, xx = f(t % (tm + 1.5)), xm = cx + xx * sc, s = 30 + 14 * m.value, fy = cy + 52;
      ctx.fillStyle = "#cfd8e4"; ctx.fillRect(0, fy, W, 10); ctx.fillStyle = "#b3bfce"; ctx.fillRect(0, fy + 10, W, Hh);
      S.draw.line(c, cx, cy - 58, cx, fy, P.grey, 1.2, [4, 4]);
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(10, cy - 56, 9, 112);
      /* ressort (haut) */
      var sy = cy - 24; ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(19, sy);
      var a = 33, bb = xm - s / 2; if (bb < a + 12) bb = a + 12; for (var i = 0; i <= 80; i++){ var u = i / 80; ctx.lineTo(a + (bb - a) * u, sy + 9 * Math.sin(u * 10 * 2 * Math.PI)); } ctx.lineTo(xm - s / 2 + 2, sy); ctx.stroke(); ctx.restore();
      /* amortisseur (bas) : cylindre fixe + piston lié à la masse */
      var dy = cy + 24, cylx0 = 19, cylx1 = cx + 12 * sc * 0 + 0, cl = cx - 40 - cylx0;
      ctx.fillStyle = "rgba(194,106,12," + (0.15 + Math.min(0.5, b.value / 14 * 0.5)) + ")"; S.draw.rrect(c, 33, dy - 12, cl, 24, 4); ctx.fill(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.stroke();
      var px = Math.max(40, Math.min(33 + cl - 8, xm - s / 2 - 22)); ctx.fillStyle = P.amber; ctx.fillRect(px - 3, dy - 10, 6, 20);
      S.draw.line(c, px, dy, xm - s / 2, dy, P.ink, 3);
      S.draw.text(c, "huile (frottement b)", 33 + cl / 2, dy + 25, {size: 11, color: P.amber});
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      var g2 = ctx.createLinearGradient(0, cy - s / 2, 0, cy + s / 2); g2.addColorStop(0, "#4f7fd6"); g2.addColorStop(1, P.acc);
      S.draw.rrect(c, xm - s / 2, cy - s / 2, s, s, 5); ctx.fillStyle = g2; ctx.fill(); ctx.restore();
      S.draw.text(c, "m", xm, cy, {size: 13, color: "#fff", math: true});
      S.draw.label(c, "x = " + S.fmt(xx, 1) + " cm", W - 56, 18, {color: P.acc, size: 13});
      S.draw.label(c, M.reg, 70, 18, {color: M.reg === "pseudo-périodique" ? P.acc : M.reg === "critique" ? P.green : P.amber, size: 12});
      /* graphe */
      var ax = S.draw.axes(g, {x0: 0, x1: tm, y0: -11, y1: 11, xl: "t (s)", yl: "x (cm)", l: 46, t: 18, stepY: 5});
      if (env.value && gam > 0 && M.reg === "pseudo-périodique"){ var wd = Math.sqrt(w0 * w0 - gam * gam), ev = Math.sqrt(1 + Math.pow(gam / wd, 2)); S.draw.fn(g, ax, function(q){ return x0 * Math.exp(-gam * q) * ev; }, P.grey, 1.6, [6, 4]); S.draw.fn(g, ax, function(q){ return -x0 * Math.exp(-gam * q) * ev; }, P.grey, 1.6, [6, 4]); }
      S.draw.fn(g, ax, f, "rgba(31,75,158,.35)", 2);
      var tt = Math.min(t, tm), cg = g.ctx; cg.save(); cg.beginPath(); cg.rect(ax.L, ax.T, ax.X(tt) - ax.L, ax.B - ax.T); cg.clip(); S.draw.fn(g, ax, f, P.acc, 3); cg.restore();
      if (t <= tm) S.draw.dot(g, ax.X(t), ax.Y(f(t)), 5.5, P.red);
      var half; if (gam > 0){ var lo = 0, hi = 200; for (var q = 0; q < 60; q++){ var mid = (lo + hi) / 2; if (f(mid) > x0 / 2) lo = mid; else hi = mid; } half = lo; }
      ro.set(0, M.reg); ro.set(1, isNaN(M.T) ? "pas d'oscillation" : S.fmt(M.T, 2) + " s"); ro.set(2, gam > 0 ? S.fmt(half, 2) + " s" : "∞ (pas d'amortissement)"); ro.set(3, S.fmt(M.bc, 2) + " kg/s");
    });
  }
});

SFA.sim({
  id: "p6-c05-resonance", ch: "c05", tag: "Résonance",
  titre: "Résonance : trouve la fréquence qui fait tout bouger",
  resume: "Un oscillateur excité à sa fréquence propre atteint une grande amplitude, d'autant plus que l'amortissement est faible.",
  but: "Un moteur secoue le support à la fréquence f. Balaye f et observe l'amplitude de la masse (jauge et courbe de résonance). Change la masse (donc f₀) et l'amortissement. Au-delà de 20 cm la structure cède !",
  aRetenir: "Quand la fréquence de l'excitation f est proche de la fréquence propre f₀ = (1/2π)·√(k/m), l'amplitude est maximale : c'est la résonance. Moins il y a d'amortissement, plus le pic est haut et étroit. En-dessous de f₀ la masse suit le moteur ; au-dessus, elle ne suit presque plus. La phase du mouvement par rapport à l'excitation passe de 0° à 180° en traversant f₀.",
  piege: "La résonance « casse » seulement si l'amplitude dépasse ce que la structure supporte et si l'amortissement est faible. Le pont de Tacoma (1940), souvent cité en exemple, s'est surtout effondré par un flottement aéroélastique (le vent entretenait les oscillations), pas par une simple excitation à fréquence fixe. Modèle : régime permanent.",
  build: function(k, S){
    var c = k.canvas(230), g = k.canvas(210), P = S.draw.palette, H = PH6, KK = 80, F0 = 2;
    var f = k.slider("Fréquence d'excitation f (ou glisse sur la courbe)", 0.2, 4, 0.05, 0.5, "Hz");
    var m = k.slider("Masse m (k = 80 N/m)", 0.5, 2, 0.1, 0.5, "kg");
    var qs = k.seg("Amortissement", [["10", "Faible (Q = 10)"], ["3", "Moyen (Q = 3)"], ["1.2", "Fort (Q = 1,2)"]], "10");
    var ro = k.readouts(["Fréquence propre f₀", "Amplitude de la masse", "Amplitude ÷ statique", "Phase (retard)"]);
    var nt = k.note("", "ok");
    var ph = 0, ax = null, peak = 0;
    var lp = k.loop(function(dt){ ph += 2 * Math.PI * f.value * dt; k.redraw(); }); lp.play();
    function amp(fr, mm, Q){
      var w0 = Math.sqrt(KK / mm), w = 2 * Math.PI * fr, bb = Math.sqrt(KK * mm) / Q;
      var d = Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(bb * w / mm, 2));
      return {A: (F0 / mm) / d, ph: Math.atan2(bb * w / mm, w0 * w0 - w * w)};
    }
    g.cv.style.touchAction = "none"; g.cv.style.cursor = "ew-resize";
    g.pointer(function(t, p){ if (t === "move" || t === "up" || !ax) return; f.set(Math.round(ax.ix(p.x) * 20) / 20); k.redraw(); });
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, Q = parseFloat(qs.value), f0 = Math.sqrt(KK / m.value) / (2 * Math.PI);
      var r = amp(f.value, m.value, Q), As = F0 / KK, Acm = r.A * 100, broken = Acm > 20;
      H.bg(c, broken ? "#fdf1ee" : "#f8fafd", broken ? "#f6d9d3" : "#eaf0f7");
      var cy = Hh * 0.45, sc = (W / 2 - 60) / 0.25, fy = cy + 52;
      ctx.fillStyle = "#cfd8e4"; ctx.fillRect(0, fy, W, 10); ctx.fillStyle = "#b3bfce"; ctx.fillRect(0, fy + 10, W, Hh);
      /* moteur : disque excentrique qui pousse le support */
      var mr = 26, mxc = 46, dx = 0.02 * sc * Math.sin(ph), ex = mxc + mr * 0.6 * Math.cos(ph);
      var gr = ctx.createRadialGradient(mxc - 6, cy - 6, 3, mxc, cy, mr); gr.addColorStop(0, "#f2b45b"); gr.addColorStop(1, P.amber);
      ctx.beginPath(); ctx.arc(mxc, cy, mr, 0, 7); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = "#7a4306"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.dot(c, mxc + mr * 0.6 * Math.cos(ph), cy + mr * 0.6 * Math.sin(ph), 4.5, "#fff"); S.draw.dot(c, mxc, cy, 3, "#7a4306");
      var sx = mxc + mr + 12 + 0.02 * sc * Math.cos(ph) * 0 + mr * 0.6 * Math.cos(ph) * 0.35;
      ctx.fillStyle = "#6b7686"; ctx.fillRect(sx, cy - 22, 10, 44);
      var cx0 = W / 2 + 40, xm = r.A * Math.sin(ph - r.ph), mx = cx0 + Math.max(-0.26, Math.min(0.26, xm)) * sc, s = 30 + 14 * m.value;
      S.draw.line(c, cx0, cy - 56, cx0, fy, P.grey, 1.2, [4, 4]);
      ctx.beginPath(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.moveTo(sx + 10, cy); var a = sx + 24, bb = mx - s / 2; for (var i = 0; i <= 90; i++){ var u = i / 90; ctx.lineTo(a + (bb - a) * u, cy + 12 * Math.sin(u * 12 * 2 * Math.PI)); } ctx.lineTo(mx - s / 2 + 2, cy); ctx.stroke();
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      S.draw.rrect(c, mx - s / 2, cy - s / 2, s, s, 5); ctx.fillStyle = broken ? P.red : P.acc; ctx.fill(); ctx.restore();
      /* jauge d'amplitude (cm) */
      var gx0 = cx0 - 0.2 * sc, gx1 = cx0 + 0.2 * sc; S.draw.line(c, gx0, fy + 22, gx1, fy + 22, "#6b7686", 1.4);
      for (var q = -20; q <= 20; q += 10){ S.draw.line(c, cx0 + q / 100 * sc, fy + 18, cx0 + q / 100 * sc, fy + 26, "#6b7686", 1.4); S.draw.text(c, q, cx0 + q / 100 * sc, fy + 37 > Hh - 6 ? Hh - 6 : fy + 37, {size: 10.5, color: "#4a5668", weight: 600}); }
      S.draw.label(c, "moteur", mxc, cy + mr + 16, {color: P.amber, size: 11});
      S.draw.label(c, "amplitude " + S.fmt(Acm, 1) + " cm", W - 78, 18, {color: broken ? P.red : P.acc, size: 12.5});
      if (broken) S.draw.label(c, "STRUCTURE EN DANGER", W / 2, 44, {color: P.red, size: 13});
      /* courbe de résonance cliquable */
      var ymax = 30; ax = S.draw.axes(g, {x0: 0, x1: 4, y0: 0, y1: ymax, xl: "f (Hz)", yl: "amplitude (cm)", l: 52, t: 20, stepX: 0.5, stepY: 10});
      S.draw.area(g, ax, function(fr){ return fr < 0.01 ? 0 : Math.min(ymax, amp(fr, m.value, Q).A * 100); }, 0, 4, P.acc, 0.1);
      S.draw.line(g, ax.L, ax.Y(20), ax.R, ax.Y(20), P.red, 1.5, [6, 4]); S.draw.text(g, "limite 20 cm", ax.R - 4, ax.Y(20) - 9, {size: 12, color: P.red, align: "right"});
      S.draw.fn(g, ax, function(fr){ return fr < 0.01 ? NaN : amp(fr, m.value, Q).A * 100; }, P.acc, 2.8);
      S.draw.line(g, ax.X(f0), ax.T, ax.X(f0), ax.B, P.green, 1.5, [4, 4]); S.draw.label(g, "f₀ = " + S.fmt(f0, 2) + " Hz", ax.X(f0) + (ax.X(f0) > ax.R - 80 ? -48 : 46), ax.T + 10, {color: P.green, size: 11.5});
      S.draw.dot(g, ax.X(f.value), ax.Y(Math.min(ymax, Acm)), 7, P.red);
      ro.set(0, S.fmt(f0, 2) + " Hz"); ro.set(1, S.fmt(Acm, 1) + " cm"); ro.set(2, "× " + S.fmt(r.A / As, 1)); ro.set(3, S.fmt(r.ph * 180 / Math.PI, 0) + " °");
      nt.set(Math.abs(f.value - f0) < 0.1 * f0 ? "Tu es à la résonance : la masse accumule l'énergie de chaque poussée." : f.value < f0 ? "Excitation lente : la masse suit le moteur sans amplification." : "Excitation rapide : la masse n'a pas le temps de suivre, l'amplitude chute.", broken ? "bad" : "ok");
    });
  }
});

