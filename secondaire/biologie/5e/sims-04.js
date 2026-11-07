/* Chapitre 4 · Homéostasie et thermorégulation */
(function(){
var CORE_C = 245;       /* kJ/K : 70 kg × 3,5 kJ/(kg·K) */
function dTh(net){ return net * 3600 / (CORE_C * 1000); }     /* K/h pour un bilan net en W */
/* bilan thermique d'un adulte au repos (modèle simplifié) */
function thermo(Ta, iso){
  var K = 14, loss0 = K * (33 - Ta) / (1 + 0.8 * iso), P0 = 80, o = {loss0: loss0, vc: 0, vd: 0, shiv: 0, E: 0, net: 0, loss: loss0, regime: ""};
  if (loss0 <= 0){ o.E = P0 - loss0; o.vd = 1; o.loss = loss0; o.regime = "chaud"; }
  else {
    var lC = loss0 * 0.65, lD = loss0 * 1.6;
    if (lC > P0){ o.vc = 1; o.shiv = Math.min(240, lC - P0); o.loss = lC; o.net = P0 + o.shiv - lC; o.regime = "froid"; }
    else if (lD >= P0){ var f = P0 / loss0; o.loss = P0; if (f < 1) o.vc = (1 - f) / 0.35; else o.vd = (f - 1) / 0.6; o.regime = "neutre"; }
    else { o.vd = 1; o.loss = lD; o.E = P0 - lD; o.regime = "chaud"; }
  }
  if (o.E > 700){ o.net = o.E - 700; o.E = 700; }
  o.prod = P0 + o.shiv; o.sweat = o.E / 0.675;
  return o;
}
SFA.sim({
  id: "b5-c04-temperature", ch: "c04", tag: "Classique",
  titre: "De −10 à 40 °C : les réponses du corps",
  resume: "Température extérieure et vêtements → vasomotricité, frissons, sudation.",
  but: "Fais varier la température de l'air (curseur, ou glisse sur le graphique) et l'épaisseur des vêtements. Observe le corps : vaisseaux de la peau, frissons, sueur. Repère les zones où le corps règle sa température par la peau seule, puis par les frissons, puis par la sueur, et la limite où la régulation est dépassée (température du corps qui dérive).",
  aRetenir: "La température du corps (≈ 37 °C) dépend du bilan chaleur produite − chaleur perdue. Quand il fait froid : vasoconstriction (moins de chaleur perdue par la peau), puis frissons (plus de chaleur produite). Quand il fait chaud : vasodilatation, puis sudation (l'évaporation refroidit). Le centre de régulation est l'hypothalamus.",
  piege: "La température du corps ne suit pas celle de l'extérieur tant que la régulation fonctionne. Et le froid « ne donne pas » la grippe : les infections sont dues à des virus. Valeurs d'un adulte au repos, modèle simplifié (chaleur produite au repos : 80 W).",
  build: function(k, S){
    var c = k.canvas(500), pal = S.draw.palette, D = S.draw;
    var Ta = k.slider("Température de l'air", -10, 40, 1, 10, "°C");
    var iso = k.slider("Vêtements (0 = nu, 1 = habits légers, 2 = tenue chaude)", 0, 2, 0.25, 1, "");
    var ro = k.readouts(["Production de chaleur", "Chaleur perdue", "Sudation", "Température du corps après 1 h"]);
    var nt = k.note("", "");
    var tm = 0, geo = {}, drag = false;
    var lp = k.loop(function(dt){ tm += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") drag = p.y > geo.gy; if (drag && (t === "down" || t === "drag") && geo.ax){ Ta.set(Math.max(-10, Math.min(40, Math.round(geo.ax.ix(p.x))))); k.redraw(); } if (t === "up") drag = false; });
    k.draw(function(){
      var r = thermo(Ta.value, iso.value), T, a = [], b = [], cc = [];
      for (T = -10; T <= 40; T += 1){ var q = thermo(T, iso.value); a.push([T, q.vc * 100]); b.push([T, q.shiv / 240 * 100]); cc.push([T, Math.max(q.E / 700 * 100, 0)]); }
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, sh = 262, ta = Ta.value;
      var warm = B5.cl((ta + 10) / 50, 0, 1);
      D.rrect(c, 8, 8, W - 16, sh, 12); var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "rgb(" + Math.round(190 + 62 * warm) + "," + Math.round(212 + 8 * warm) + "," + Math.round(245 - 70 * warm) + ")"); bg.addColorStop(1, "#f8f6f0"); ctx.fillStyle = bg; ctx.fill();
      ctx.save(); D.rrect(c, 8, 8, W - 16, sh, 12); ctx.clip();
      if (ta < 5){ for (var f = 0; f < 14; f++){ B5.circ(c, 20 + (f * 53) % (W - 40), 14 + ((f * 41 + tm * 28) % (sh - 20)), 2.4, "#fff", "#b8c6d6", 1); } }
      if (ta > 28){ D.glow(c, W - 50, 44, 60, pal.yellow, .85); B5.circ(c, W - 50, 44, 18, pal.yellow); }
      ctx.restore();
      D.text(c, "air " + S.fmt(ta, 0) + " °C", 20, 24, {align: "left", size: 13, color: pal.ink, weight: 900});
      /* ----- silhouette ----- */
      var fx = Math.min(130, W * 0.28), fy = 62, sc = Math.min(1, (sh - 80) / 190) * 1.0, shiv = B5.cl(r.shiv / 240, 0, 1), vd = r.vd, vc = r.vc;
      var skin = vd > vc ? "rgb(" + Math.round(244 + 8 * vd) + "," + Math.round(190 - 60 * vd) + "," + Math.round(170 - 50 * vd) + ")" : "rgb(" + Math.round(244 - 20 * vc) + "," + Math.round(200 + 10 * vc) + "," + Math.round(186 + 40 * vc) + ")";
      var jx = Math.sin(tm * 38) * shiv * 2.2, jy = Math.cos(tm * 33) * shiv * 1.6;
      ctx.save(); ctx.translate(fx + jx, fy + jy); ctx.scale(sc, sc);
      ctx.fillStyle = skin; ctx.strokeStyle = "#b9856a"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 21, 0, 7); ctx.fill(); ctx.stroke();                         /* tête */
      D.rrect(c, -9, 18, 18, 14, 5); ctx.fill(); ctx.stroke();                                  /* cou */
      D.rrect(c, -30, 30, 60, 86, 18); ctx.fill(); ctx.stroke();                                /* tronc */
      D.rrect(c, -46, 36, 17, 78, 8); ctx.fill(); ctx.stroke(); D.rrect(c, 29, 36, 17, 78, 8); ctx.fill(); ctx.stroke();   /* bras */
      D.rrect(c, -27, 112, 25, 86, 10); ctx.fill(); ctx.stroke(); D.rrect(c, 2, 112, 25, 86, 10); ctx.fill(); ctx.stroke(); /* jambes */
      /* vaisseaux de la peau */
      var vw = 1 + 4 * Math.abs(vd - vc), vcol = vd > vc ? "rgba(192,50,29," + (0.3 + .6 * vd) + ")" : "rgba(60,90,170," + (0.2 + .6 * vc) + ")";
      ctx.strokeStyle = vcol; ctx.lineWidth = vd > vc ? 1 + 3.5 * vd : 2.2 - 1.2 * vc;
      for (var v = -18; v <= 18; v += 12){ ctx.beginPath(); ctx.moveTo(v, 38); ctx.bezierCurveTo(v + 6, 62, v - 6, 84, v + 2, 108); ctx.stroke(); }
      /* vêtements */
      if (iso.value > 0){ var al = Math.min(.9, .25 + iso.value * .32); ctx.fillStyle = "rgba(60,110,170," + al + ")"; D.rrect(c, -31, 36, 62, 56 + iso.value * 14, 12); ctx.fill(); if (iso.value > 1){ ctx.fillStyle = "rgba(40,80,140," + al + ")"; D.rrect(c, -29, 112, 27, 60, 8); ctx.fill(); D.rrect(c, 2, 112, 27, 60, 8); ctx.fill(); D.rrect(c, -49, 36, 20, 60, 8); ctx.fill(); D.rrect(c, 29, 36, 20, 60, 8); ctx.fill(); } }
      /* visage */
      ctx.fillStyle = "#3a2a22"; ctx.beginPath(); ctx.arc(-7, -3, 2.2, 0, 7); ctx.arc(7, -3, 2.2, 0, 7); ctx.fill();
      ctx.strokeStyle = "#3a2a22"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, ta > 30 ? 10 : 6, 6, ta > 30 ? 1.2 * Math.PI : 0.15 * Math.PI, ta > 30 ? 1.8 * Math.PI : 0.85 * Math.PI); ctx.stroke();
      ctx.restore();
      /* sueur */
      var nsw = Math.round(r.sweat / 12); for (var s = 0; s < Math.min(14, nsw); s++){ var sx = fx + (s % 2 ? 1 : -1) * (14 + (s * 13) % 34) * sc, sy = fy + 20 + (((tm * 55 + s * 29) % 90)) * sc; ctx.fillStyle = "rgba(47,127,209,.8)"; ctx.beginPath(); ctx.arc(sx, sy, 3.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(sx - 2.6, sy - 1); ctx.lineTo(sx, sy - 7); ctx.lineTo(sx + 2.6, sy - 1); ctx.fill(); }
      if (shiv > 0.05) D.label(c, "frissons", fx - 62 * sc - 28, fy + 70 * sc, {color: pal.red, size: 11});
      if (r.sweat > 5) D.label(c, "sueur", fx + 62 * sc + 28, fy + 30 * sc, {color: pal.blue, size: 11});
      D.label(c, vd > vc + .05 ? "vasodilatation" : vc > .05 ? "vasoconstriction" : "vaisseaux normaux", fx, 8 + sh - 14, {color: vd > vc ? pal.red : pal.acc, size: 11});
      /* bilan chaleur : balance */
      var bx = fx + 90 * sc + 40, bw = W - bx - 24, pr = r.prod, lo = Math.max(0, r.loss) + r.E, dT = dTh(r.net);
      D.panel(c, bx - 10, 20, bw + 20, 230, {shadow: false, fill: "rgba(255,255,255,.88)"});
      D.text(c, "Bilan de chaleur", bx + bw / 2, 38, {size: 12, color: pal.ink, weight: 900});
      function bar(y, lab, val, col){ D.text(c, lab + " : " + S.fmt(val, 0) + " W", bx, y, {align: "left", size: 11.5, color: col, weight: 800}); D.rrect(c, bx, y + 10, bw, 16, 8); ctx.fillStyle = "#e3e7ed"; ctx.fill(); var wv = Math.max(6, bw * B5.cl(val / 400, 0, 1)); D.rrect(c, bx, y + 10, wv, 16, 8); ctx.fillStyle = col; ctx.fill(); }
      bar(62, "Production", pr, pal.red); bar(114, "Pertes (peau + évaporation)", lo, pal.teal);
      D.display(c, S.fmt(37 + dT, 1) + " °C", bx + bw / 2, 198, {w: Math.min(130, bw), h: 56, size: 22, caption: "température du corps (1 h)", color: Math.abs(dT) > .05 ? "#a31d0e" : "#13233a"});
      D.text(c, "échelle 0–400 W", bx + bw, 154, {align: "right", size: 10, color: pal.grey});
      /* ---------- courbes ---------- */
      var gy = sh + 22; geo.gy = gy - 6;
      D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: -10, x1: 40, y0: 0, y1: 100, xl: "T air (°C)  ·  glisse le repère", stepX: 10, stepY: 50, t: gy + 10, b: 36, l: 40, r: 18});
      geo.ax = ax; D.text(c, "% du maximum", 14, gy + 4, {size: 11, color: pal.grey, align: "left"});
      B5.poly(c, ax, a, pal.teal, 2.6); B5.poly(c, ax, b, pal.red, 2.6); B5.poly(c, ax, cc, pal.amber, 2.6);
      D.legend(c, [[pal.teal, "vasoconstriction"], [pal.red, "frissons"], [pal.amber, "sudation"]], ax.R - 4, ax.T + 2, {align: "right"});
      D.line(c, ax.X(ta), ax.T, ax.X(ta), ax.B, pal.ink, 1.5, [5, 4]);
      ro.set(0, S.fmt(pr, 0) + " W"); ro.set(1, S.fmt(Math.max(0, r.loss), 0) + " W"); ro.set(2, S.fmt(r.sweat, 0) + " g/h"); ro.set(3, S.fmt(37 + dT, 1) + " °C");
      if (dT < -0.05) nt.set("Régulation dépassée : malgré 4 fois la production de repos (frissons maximaux), le corps perd plus qu'il ne produit : hypothermie (≈ " + S.fmt(dT, 1) + " °C par heure).", "warn");
      else if (dT > 0.05) nt.set("Évaporation maximale dépassée dans ce modèle : la température du corps monte de " + S.fmt(dT, 1) + " °C par heure.", "warn");
      else if (r.regime === "froid") nt.set("Froid : vasoconstriction maximale puis frissons (" + S.fmt(r.shiv, 0) + " W supplémentaires) : la température se maintient à 37 °C.", "warn");
      else if (r.regime === "chaud") nt.set("Chaud : vasodilatation maximale puis sudation (" + S.fmt(r.sweat, 0) + " g/h d'eau évaporée) : 37 °C maintenus.", "warn");
      else nt.set("Zone de régulation par la seule circulation de la peau : vasoconstriction " + S.fmt(r.vc * 100, 0) + " %, vasodilatation " + S.fmt(r.vd * 100, 0) + " %.", "ok");
    });
  }
});

/* ---------- coup de chaleur ---------- */
function ps(T){ return 0.6112 * Math.exp(17.62 * T / (243.12 + T)); }    /* kPa */
SFA.sim({
  id: "b5-c04-chaleur", ch: "c04", tag: "Sécurité",
  titre: "Coup de chaleur : humidité, effort, température",
  resume: "Air chaud et humide + effort → la sueur peut-elle s'évaporer assez ?",
  but: "Règle la température, l'humidité et l'intensité de l'effort. Observe si l'évaporation possible couvre l'évaporation nécessaire. Sinon la chaleur s'accumule : cherche le temps avant d'atteindre 40 °C au centre du corps.",
  aRetenir: "Pour rester à 37 °C quand il fait chaud, le corps doit évaporer de la sueur. Mais l'évaporation est limitée par l'humidité de l'air : à 100 % d'humidité, la sueur ne s'évapore plus et ruisselle sans refroidir. L'effort produit de la chaleur (plusieurs centaines de watts). Au-delà de 40 °C : coup de chaleur, urgence vitale.",
  piege: "Boire ne suffit pas : si l'air est saturé d'eau, la sueur ne refroidit plus. Et le thermomètre de l'air seul ne dit rien : c'est la combinaison température, humidité et effort qui compte. Valeurs d'un modèle simplifié, non utilisables pour juger un risque réel.",
  build: function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(190), pal = S.draw.palette;
    var Ta = k.slider("Température de l'air", 20, 45, 1, 33, "°C");
    var RH = k.slider("Humidité relative", 10, 100, 5, 70, "%");
    var P = k.slider("Production de chaleur (effort)", 80, 800, 20, 400, "W");
    var ro = k.readouts(["Évaporation nécessaire", "Évaporation possible", "Chaleur stockée", "Temps avant 40 °C"]);
    var nt = k.note("", "");
    function emax(T, rh){ return Math.max(0, 74 * 1.8 * (ps(35) - rh / 100 * ps(T))); }
    k.draw(function(){
      var dry = 14 * (35 - Ta.value), Ereq = P.value - dry, Em = Math.min(emax(Ta.value, RH.value), 1000);
      var E = Math.max(0, Math.min(Ereq, Em)), stor = Ereq > 0 ? Math.max(0, Ereq - Em) : 0 - Math.max(0, -Ereq);
      var rate = dTh(stor);
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 120, y0: 36, y1: 42, xl: "t (min)", yl: "T corps (°C)", stepX: 20, stepY: 1});
      c1.ctx.fillStyle = "rgba(180,35,24,.10)"; c1.ctx.fillRect(ax.X(0), ax.Y(42), ax.X(120) - ax.X(0), ax.Y(40) - ax.Y(42));
      S.draw.text(c1, "coup de chaleur (≥ 40 °C)", ax.R - 6, ax.Y(41), {align: "right", size: 12, color: pal.red});
      var pts = []; for (var t = 0; t <= 120; t += 2){ pts.push([t, Math.min(42, Math.max(37, 37 + (rate > 0 ? rate * t / 60 : 0)))]); }
      B5.poly(c1, ax, pts, pal.violet, 3);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 10, x1: 100, y0: 0, y1: 1000, xl: "humidité (%)", yl: "W", stepX: 10, stepY: 250});
      var pe = []; for (var h = 10; h <= 100; h += 2) pe.push([h, Math.min(1000, emax(Ta.value, h))]);
      B5.poly(c2, ax2, pe, pal.teal, 2.6);
      var ev = Math.max(0, Math.min(1000, Ereq));
      S.draw.line(c2, ax2.X(10), ax2.Y(ev), ax2.X(100), ax2.Y(ev), pal.red, 2, [6, 4]);
      B5.leg(c2, [["évaporation possible", pal.teal], ["nécessaire", pal.red]], ax2.L + 8, ax2.T + 34);
      S.draw.dot(c2, ax2.X(RH.value), ax2.Y(Math.min(1000, emax(Ta.value, RH.value))), 6, pal.ink);
      var tmin = rate > 0.001 ? 3 / rate * 60 : Infinity;
      ro.set(0, S.fmt(Math.max(0, Ereq), 0) + " W"); ro.set(1, S.fmt(Em, 0) + " W"); ro.set(2, S.fmt(Math.max(0, stor), 0) + " W"); ro.set(3, isFinite(tmin) ? S.fmt(tmin, 0) + " min" : "jamais (régulation efficace)");
      if (Ereq <= 0) nt.set("L'air est assez frais pour que la peau perde la chaleur sans sudation : aucun risque de surchauffe.", "ok");
      else if (stor > 0) nt.set("L'air ne peut absorber que " + S.fmt(Em, 0) + " W de sueur pour " + S.fmt(Ereq, 0) + " W nécessaires : " + S.fmt(stor, 0) + " W s'accumulent, soit + " + S.fmt(rate, 1) + " °C par heure. Arrêter l'effort et se mettre à l'ombre !", "warn");
      else nt.set("Sudation de " + S.fmt(Ereq / 0.675, 0) + " g/h (≈ " + S.fmt(Ereq / 0.675 / 1000, 2) + " L/h) : suffisante, mais il faut boire pour compenser.", "ok");
    });
  }
});

/* ---------- lézard et mammifère ---------- */
SFA.sim({
  id: "b5-c04-ectotherme", ch: "c04", tag: "Comparaison",
  titre: "Lézard (ectotherme) contre mammifère (endotherme)",
  resume: "Température ambiante → température du corps, dépense d'énergie et activité.",
  but: "Compare deux animaux selon la température de l'air (curseur, ou glisse sur les graphiques). Observe qui garde sa température, qui dépense le plus d'énergie, et quand le lézard peut courir. Active le bain de soleil pour voir comment un ectotherme régule son comportement.",
  aRetenir: "Un endotherme produit sa chaleur : température constante, mais forte dépense d'énergie (surtout au froid). Un ectotherme dépend de la température extérieure : très économe, mais son activité dépend du milieu. Il règle sa température par son comportement (soleil, ombre).",
  piege: "Ectotherme ne veut pas dire « sang froid » : un lézard au soleil peut avoir un corps à 35 °C. Et endotherme ne veut pas dire « plus évolué » : chaque stratégie a des coûts et des avantages. Valeurs en unités arbitraires.",
  build: function(k, S){
    var c = k.canvas(500), pal = S.draw.palette, D = S.draw;
    var Ta = k.slider("Température de l'air", 0, 45, 1, 20, "°C");
    var sun = k.toggle("Le lézard prend un bain de soleil (+ 10 °C, max 36 °C)", false);
    var ro = k.readouts(["T corps lézard", "Activité du lézard", "Énergie mammifère", "Énergie lézard"]);
    var nt = k.note("", "");
    function tbL(T, s){ return s && T < 36 ? Math.min(T + 10, 36) : T; }
    function mrM(T){ return T < 28 ? 100 * (1 + 0.07 * (28 - T)) : (T > 35 ? 100 + 10 * (T - 35) : 100); }
    function mrL(Tb){ return 15 * Math.pow(2, (Tb - 37) / 10); }
    function perf(Tb){ return Tb < 8 || Tb > 42 ? 0 : Math.exp(-Math.pow((Tb - 35) / 8, 2)); }
    var lx = 0, dir = 1, ph = 0, geo = {}, drag = false;
    var lp = k.loop(function(dt){ var pf = perf(tbL(Ta.value, sun.value)); ph += dt; lx += dir * dt * pf * 120; if (lx > 1){ lx = 1; dir = -1; } if (lx < 0){ lx = 0; dir = 1; } k.redraw(); });
    lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (t === "down") drag = p.y > geo.gy;
      if (drag && (t === "down" || t === "drag") && geo.ax){ Ta.set(Math.max(0, Math.min(45, Math.round(p.x < geo.mid ? geo.ax.ix(p.x) : geo.ax2.ix(p.x)))));  k.redraw(); }
      if (t === "up") drag = false;
    });
    function mammal(x, y, s, shiv, col){
      var ctx = c.ctx, j = shiv ? Math.sin(ph * 40) * 1.2 : 0; ctx.save(); ctx.translate(x + j, y); ctx.scale(s, s);
      ctx.fillStyle = col; ctx.strokeStyle = "#7a3d12"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-34, -8); ctx.bezierCurveTo(-64, -46, -80, -6, -52, 8); ctx.bezierCurveTo(-60, -2, -52, -22, -34, -8); ctx.fill(); ctx.stroke();   /* queue */
      ctx.beginPath(); ctx.ellipse(-4, -6, 38, 22, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-14, 16, 6, 12, 0, 0, 7); ctx.ellipse(18, 16, 6, 12, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(36, -22, 17, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(26, -34); ctx.lineTo(28, -54); ctx.lineTo(38, -38); ctx.moveTo(40, -36); ctx.lineTo(48, -52); ctx.lineTo(50, -32); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(40, -4, 9, 6, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(41, -26, 2.4, 0, 7); ctx.arc(52, -20, 2.4, 0, 7); ctx.fill();
      ctx.restore();
    }
    function lizard(x, y, s, wig, col, still){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      var w = still ? 0 : Math.sin(ph * 9) * 4;
      ctx.fillStyle = col; ctx.strokeStyle = "#1b5e45"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-18, -2); ctx.bezierCurveTo(-50, -4 + w, -70, 14 - w, -100, 6 + w); ctx.bezierCurveTo(-66, 22 - w, -48, 6, -18, 12); ctx.fill(); ctx.stroke();
      [[-8, 1], [20, 1]].forEach(function(l){ ctx.beginPath(); ctx.moveTo(l[0], 10); ctx.lineTo(l[0] - 8 + w * .5, 24); ctx.lineTo(l[0] + 2, 24); ctx.stroke(); ctx.beginPath(); ctx.moveTo(l[0], -2); ctx.lineTo(l[0] - 6 - w * .5, -14); ctx.stroke(); });
      ctx.beginPath(); ctx.ellipse(6, 5, 28, 11, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(40, 2, 14, 8, 0.1, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(44, -1, 2.2, 0, 7); ctx.fill();
      ctx.restore();
    }
    function gauge(x, y, T, label, col){
      var ctx = c.ctx, h = 62; D.rrect(c, x - 5, y - h, 10, h, 5); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; ctx.stroke();
      var f = B5.cl(T / 45, 0, 1); D.rrect(c, x - 3, y - 2 - (h - 4) * f, 6, (h - 4) * f, 3); ctx.fillStyle = col; ctx.fill();
      D.label(c, S.fmt(T, 0) + " °C", x + 10, y - h + 8, {color: col, align: "left", size: 11.5});
      D.text(c, label, x, y + 12, {size: 10.5, color: pal.grey, weight: 800});
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, T = Ta.value, s = sun.value, tb = tbL(T, s), pf = perf(tb), em = mrM(T), el = mrL(tb);
      /* ---------- scène ---------- */
      var sh = 262, gy = sh - 52;
      var warm = B5.cl((T - 5) / 35, 0, 1), top = ctx.createLinearGradient(0, 0, 0, sh);
      top.addColorStop(0, "rgb(" + Math.round(190 + 60 * warm) + "," + Math.round(214 + 10 * warm) + "," + Math.round(240 - 50 * warm) + ")"); top.addColorStop(1, "#f6f1e4");
      D.rrect(c, 8, 8, W - 16, sh, 12); ctx.fillStyle = top; ctx.fill();
      ctx.save(); D.rrect(c, 8, 8, W - 16, sh, 12); ctx.clip();
      ctx.fillStyle = T < 6 ? "#eef3f8" : "#cfd8a8"; ctx.fillRect(8, gy, W - 16, sh);
      if (T < 6){ for (var f = 0; f < 10; f++) B5.circ(c, 30 + f * (W - 60) / 9, 24 + ((f * 37 + ph * 20) % 120), 2.6, "#fff", "#b8c6d6", 1); }
      if (T > 26 || s){ D.glow(c, W - 50, 50, 60, pal.yellow, .85); B5.circ(c, W - 50, 50, 20, pal.yellow); }
      /* rocher */
      ctx.fillStyle = "#a79a8a"; ctx.beginPath(); ctx.ellipse(W * 0.72, gy + 4, 70, 18, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(W * 0.72 - 70, gy + 4, 140, 6);
      D.text(c, "air " + S.fmt(T, 0) + " °C", 24, 24, {align: "left", size: 13, color: pal.ink, weight: 900});
      /* mammifère */
      var mx = W * 0.22; mammal(mx, gy - 26, 1.0, T < 14, "#e0a36b");
      if (T < 14) D.text(c, "frissons !", mx - 10, gy - 92, {size: 11, color: pal.red, weight: 800});
      gauge(mx + 78, gy + 38, 37, "corps", pal.red);
      D.text(c, "mammifère (endotherme)", mx, gy + 46, {size: 11, color: pal.ink, weight: 800});
      /* énergie mammifère */
      var flame = Math.min(1.9, em / 100); for (var q = 0; q < 3; q++){ ctx.fillStyle = q < flame * 1.5 ? pal.orange : "#e1d6c7"; ctx.beginPath(); ctx.arc(mx - 52 + q * 14, gy + 36, 5, 0, 7); ctx.fill(); }
      D.text(c, "énergie", mx - 36, gy + 22, {size: 10, color: pal.grey, weight: 800});
      /* lézard */
      var zx = (s ? W * 0.72 - 40 : W * 0.5 + lx * (W * 0.45 - 70) + 60) , zy = s ? gy - 18 : gy - 12, still = pf < 0.05 || s;
      lizard(zx, zy, 0.95, 0, pf < 0.2 ? "#8fb3a3" : "#3fa77c", still);
      if (pf < 0.2) D.text(c, "z z z", zx + 30, zy - 34, {size: 13, color: pal.grey, weight: 900});
      if (tb > 42) D.text(c, "trop chaud !", zx, zy - 40, {size: 11, color: pal.red, weight: 800});
      gauge(W * 0.5 + 8, gy + 38, tb, "corps", pal.green);
      D.text(c, "lézard (ectotherme)", W * 0.5 + 100, gy + 46, {size: 11, color: pal.ink, weight: 800});
      ctx.restore();
      /* ---------- graphiques ---------- */
      var gy2 = sh + 20, mid = W / 2; geo.gy = gy2 - 4; geo.mid = mid;
      var a = [], b = [], m = [], l = [], T2;
      for (T2 = 0; T2 <= 45; T2 += 1){ a.push([T2, 37]); b.push([T2, tbL(T2, s)]); m.push([T2, mrM(T2)]); l.push([T2, mrL(tbL(T2, s))]); }
      D.panel(c, 8, gy2, W - 16, H - gy2 - 8, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 45, y0: 0, y1: 45, xl: "T air (°C)", yl: "", stepX: 15, stepY: 15, t: gy2 + 24, b: 32, l: 36, r: mid + 10});
      D.text(c, "Température du corps (°C)", 14, gy2 + 12, {align: "left", size: 11.5, color: pal.ink, weight: 800});
      B5.poly(c, ax, a, pal.red, 2.8); B5.poly(c, ax, b, pal.green, 2.8);
      D.line(c, ax.X(T), ax.T, ax.X(T), ax.B, pal.ink, 1.2, [4, 3]); D.dot(c, ax.X(T), ax.Y(tb), 5, pal.green); D.dot(c, ax.X(T), ax.Y(37), 5, pal.red);
      geo.ax = ax;
      var ax2 = D.axes(c, {x0: 0, x1: 45, y0: 0, y1: 320, xl: "T air (°C)", yl: "", stepX: 15, stepY: 100, t: gy2 + 24, b: 32, l: mid + 34, r: 20});
      D.text(c, "Énergie dépensée (u.a.)", mid + 6, gy2 + 12, {align: "left", size: 11.5, color: pal.ink, weight: 800});
      B5.poly(c, ax2, m, pal.red, 2.8); B5.poly(c, ax2, l, pal.green, 2.8);
      D.line(c, ax2.X(T), ax2.T, ax2.X(T), ax2.B, pal.ink, 1.2, [4, 3]); D.dot(c, ax2.X(T), ax2.Y(em), 5, pal.red); D.dot(c, ax2.X(T), ax2.Y(el), 5, pal.green);
      geo.ax2 = ax2;
      ro.set(0, S.fmt(tb, 0) + " °C"); ro.set(1, S.fmt(pf * 100, 0) + " %"); ro.set(2, S.fmt(em, 0)); ro.set(3, S.fmt(el, 1) + " (÷ " + S.fmt(em / el, 0) + ")");
      if (tb > 42) nt.set("Au-dessus de 42 °C, le lézard est en danger (température critique) : il doit chercher l'ombre.", "warn");
      else if (pf < 0.2) nt.set("Trop froid pour être actif (" + S.fmt(pf * 100, 0) + " % de ses performances) : le lézard est engourdi. Le mammifère reste actif mais brûle " + S.fmt(em / el, 0) + " fois plus d'énergie.", "warn");
      else nt.set("Le lézard est actif à " + S.fmt(pf * 100, 0) + " % de ses performances, avec " + S.fmt(em / el, 0) + " fois moins d'énergie dépensée que le mammifère.", "ok");
    });
  }
});

/* ---------- fièvre ---------- */
SFA.sim({
  id: "b5-c04-fievre", ch: "c04", tag: "Original",
  titre: "La fièvre : l'hypothalamus remonte la consigne",
  resume: "Dose de pyrogène, antipyrétique → consigne, température et sensations au fil des heures.",
  but: "Une infection libère des pyrogènes à partir de la 2e heure et jusqu'à la 14e. Choisis leur intensité et déplace le curseur du temps. Observe comment la température du corps suit la consigne, quelles sensations apparaissent au début et à la fin, et l'effet d'un antipyrétique pris à la 8e heure.",
  aRetenir: "Dans la fièvre, la consigne de l'hypothalamus est relevée : le corps se comporte comme s'il avait froid (frissons, vasoconstriction) jusqu'à atteindre la nouvelle consigne. Quand la consigne revient à 37 °C, il se comporte comme s'il avait chaud (sueurs, vasodilatation). La thermorégulation fonctionne toujours : c'est la consigne qui change.",
  piege: "La fièvre n'est pas un dérèglement de la thermorégulation (contrairement au coup de chaleur) et n'est pas « la maladie » : c'est une réponse. Un antipyrétique abaisse la consigne, il ne soigne pas l'infection. Modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(280), pal = S.draw.palette;
    var lev = k.slider("Quantité de pyrogènes", 0, 100, 5, 60, "%");
    var anti = k.toggle("Antipyrétique pris à la 8e heure (effet 4 h)", false);
    var tm = k.slider("Instant observé", 0, 24, 0.5, 6, "h");
    var ro = k.readouts(["Consigne à cet instant", "T du corps", "Phase", "Maximum atteint"]);
    var nt = k.note("", "");
    function setp(t){ var s = 37 + 3.5 * lev.value / 100; if (t < 2 || t >= 14) return 37; if (anti.value && t >= 8 && t < 12) return 37; return s; }
    k.draw(function(){
      var T = 37, dt = 1 / 60, pts = [], sp = [], at = {}, mx = 37, t, i;
      for (t = 0; t <= 24 + 1e-9; t += dt){
        var s = setp(t), r = Math.max(-1, Math.min(1.5, 0.9 * (s - T)));
        T += r * dt; if (T > mx) mx = T;
        if (i === undefined) i = 0;
        pts.push([t, T]); sp.push([t, s]);
      }
      var idx = Math.round(tm.value * 60), Tn = pts[idx][1], Sn = sp[idx][1];
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 24, y0: 36, y1: 41, xl: "heure", yl: "T (°C)", stepX: 4, stepY: 1});
      c.ctx.fillStyle = "rgba(180,35,24,.08)"; c.ctx.fillRect(ax.X(0), ax.Y(41), ax.X(24) - ax.X(0), ax.Y(40) - ax.Y(41));
      B5.poly(c, ax, sp.filter(function(p, j){ return j % 2 === 0; }), pal.green, 2, [6, 4]); B5.poly(c, ax, pts, pal.violet, 3);
      B5.leg(c, [["T du corps", pal.violet], ["consigne", pal.green]], ax.L + 8, ax.T + 34);
      S.draw.line(c, ax.X(tm.value), ax.T, ax.X(tm.value), ax.B, pal.ink, 1.4, [5, 4]); S.draw.dot(c, ax.X(tm.value), ax.Y(Tn), 6, pal.red);
      var d = Sn - Tn, ph = d > 0.3 ? "froid (frissons)" : d < -0.3 ? "chaud (sueurs)" : "plateau";
      ro.set(0, S.fmt(Sn, 1) + " °C"); ro.set(1, S.fmt(Tn, 1) + " °C"); ro.set(2, ph); ro.set(3, S.fmt(mx, 1) + " °C");
      if (mx >= 40) nt.set("Fièvre très élevée (≥ 40 °C) : consulter. La limite de danger est 41 °C et plus.", "warn");
      else if (lev.value === 0) nt.set("Sans pyrogène : la consigne reste à 37 °C et la température aussi.", "");
      else nt.set("Fièvre de " + S.fmt(mx, 1) + " °C au maximum. Pendant la montée on grelotte alors que le corps est déjà chaud : l'écart consigne − température commande les frissons.", "ok");
    });
  }
});
})();
