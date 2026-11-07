/* Biostatistique BA1 · chapitre 1 : statistique descriptive
   Ce fichier est chargé d'office avant les autres chapitres : il porte aussi les aides communes SFA.st
   (lois de probabilité, générateur aléatoire, canevas adaptatif, glisser-déposer). */
(function(){
var S0 = window.SFA, P = S0.draw.palette, F = S0.fmt;

/* ================= aides partagées du cours ================= */
var ST = S0.st = S0.st || {};
ST.rng = function(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
ST.gauss = function(r){ var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
ST.phi = function(x){ return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); };
ST.Phi = function(x){ if (x < 0) return 1 - ST.Phi(-x); if (x > 8) return 1; var t = x, s = x, k = 1; for (var i = 0; i < 300; i++){ k += 2; t *= x * x / k; s += t; if (t < 1e-17 * s) break; } return 0.5 + s * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); };
ST.invPhi = function(p){ var lo = -9, hi = 9; for (var i = 0; i < 60; i++){ var m = (lo + hi) / 2; if (ST.Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
ST.lgam = function(x){ var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5], y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); var s = 1.000000000190015; for (var j = 0; j < 6; j++) s += c[j] / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
function betacf(a, b, x){ var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; var h = d;
  for (var m = 1; m <= 300; m++){ var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; var del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break; } return h; }
ST.betai = function(a, b, x){ if (x <= 0) return 0; if (x >= 1) return 1; var bt = Math.exp(ST.lgam(a + b) - ST.lgam(a) - ST.lgam(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; };
ST.tcdf = function(t, df){ var x = df / (df + t * t), p = 0.5 * ST.betai(df / 2, 0.5, x); return t > 0 ? 1 - p : p; };
ST.tpdf = function(t, df){ return Math.exp(ST.lgam((df + 1) / 2) - ST.lgam(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + t * t / df, -(df + 1) / 2); };
ST.tppf = function(p, df){ var lo = -200, hi = 200; for (var i = 0; i < 90; i++){ var m = (lo + hi) / 2; if (ST.tcdf(m, df) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
var LF = [0]; for (var li = 1; li <= 800; li++) LF.push(LF[li - 1] + Math.log(li));
ST.binom = function(n, p, k){ if (k < 0 || k > n) return 0; if (p <= 0) return k === 0 ? 1 : 0; if (p >= 1) return k === n ? 1 : 0; return Math.exp(LF[n] - LF[k] - LF[n - k] + k * Math.log(p) + (n - k) * Math.log(1 - p)); };
ST.pois = function(l, k){ return k < 0 ? 0 : Math.exp(-l + k * Math.log(l) - LF[k]); };
ST.mean = function(a){ var t = 0; a.forEach(function(x){ t += x; }); return t / a.length; };
ST.sd = function(a){ var m = ST.mean(a), t = 0; a.forEach(function(x){ t += (x - m) * (x - m); }); return Math.sqrt(t / (a.length - 1)); };
ST.med = function(a){ var n = a.length, m = n >> 1; return n % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
/* quartiles : médiane des deux moitiés (médiane exclue si n impair), sur un tableau trié */
ST.quart = function(s){ var n = s.length, h = n >> 1; return [ST.med(s.slice(0, h)), ST.med(s), ST.med(s.slice(n % 2 ? h + 1 : h))]; };
ST.asc = function(a){ return a.slice().sort(function(x, y){ return x - y; }); };
ST.pct = function(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; };
ST.clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
/* canevas dont la hauteur suit la largeur (ratio), bornée : pas de vide sous la simulation, lisible sur téléphone */
ST.canvas = function(k, hmin, ratio, hmax){
  var c = k.canvas(hmin);
  c.resize = function(){
    var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600), hh = Math.max(hmin, Math.min(hmax || 1e9, Math.round(w * ratio))), dpr = window.devicePixelRatio || 1;
    c.cv.width = Math.round(w * dpr); c.cv.height = Math.round(hh * dpr); c.cv.style.height = hh + "px";
    c.W = w; c.H = hh; c.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (k._draw) k._draw();
  };
  c.resize(); return c;
};
/* glisser-déposer : handles() → [{x, y, r?, id, dist?(p)}] ; move(id, pos) ; end() ; le plus proche dans le rayon (18 px au doigt) est saisi */
ST.drag = function(c, handles, move, end){
  var cur = null, cv = c.cv;
  function near(p){ var hs = handles(), best = null, bd = 1e9; hs.forEach(function(h){ var d = h.dist ? h.dist(p) : Math.hypot(h.x - p.x, h.y - p.y); if (d < Math.max(h.r || 0, 18) && d < bd){ bd = d; best = h; } }); return best; }
  c.pointer(function(type, p){
    if (type === "down"){ cur = near(p); if (cur){ cv.style.cursor = "grabbing"; move(cur.id, p, cur); } }
    else if (type === "drag"){ if (cur) move(cur.id, p, cur); }
    else if (type === "up"){ if (cur && end) end(cur.id); cur = null; cv.style.cursor = near(p) ? "grab" : "default"; }
    else { cv.style.cursor = near(p) ? "grab" : "default"; }
  });
};
/* pastille « glisse-moi » */
ST.hint = function(c, s, x, y, col){ SFA.draw.label(c, s, x, y, {color: col || P.mat, size: 11}); };
/* axe horizontal simple (valeurs, titre) */
function haxis(c, x0, x1, L, R, y, step, lab){
  var ctx = c.ctx; ctx.save(); ctx.strokeStyle = P.axis; ctx.fillStyle = "#6b7685"; ctx.lineWidth = 1.25; ctx.font = "600 11.5px Mulish, system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(c.W - R, y); ctx.stroke();
  for (var v = Math.ceil(x0 / step) * step; v <= x1 + 1e-9; v += step){ var X = L + (v - x0) / (x1 - x0) * (c.W - L - R); ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X, y + 4); ctx.stroke(); ctx.fillText(F(v, 3), X, y + 7); }
  ctx.restore(); if (lab) SFA.draw.text(c, lab, c.W - R, y + 29, {size: 12, align: "right", color: "#3d4b5f"});
}
ST.haxis = haxis;
/* quantile de Student pour l'IC */
var TQ = [12.706,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.101,2.093,2.086,2.080,2.074,2.069,2.064,2.060,2.056,2.052,2.048,2.045,2.042];
function tq(df){ if (df <= 30) return TQ[df - 1]; var z = 1.959964, d = df; return z + (Math.pow(z, 3) + z) / (4 * d) + (5 * Math.pow(z, 5) + 16 * Math.pow(z, 3) + 3 * z) / (96 * d * d); }

var rng = ST.rng, gauss = ST.gauss, med = ST.med, quart = ST.quart, mean = ST.mean, sd = ST.sd, invPhi = ST.invPhi, asc = ST.asc;

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-aberrante", ch: "c01", tag: "Centre et dispersion",
  titre: "Une valeur extrême : qui bouge, qui résiste ?",
  resume: "Glisse n'importe quel point : la moyenne (point d'équilibre) le suit, la médiane résiste.",
  but: "Dix temps d'attente aux urgences (en minutes). Attrape un point à la souris ou au doigt et fais-le glisser : la moyenne est le point d'équilibre de la balance, la médiane le milieu de la file.",
  aRetenir: "La médiane et l'intervalle interquartile sont résistants à une valeur extrême ; la moyenne et l'écart-type ne le sont pas. Distribution asymétrique ou valeurs atypiques : médiane [Q1 ; Q3].",
  piege: "Moyenne et médiane proches ne prouvent pas que la distribution soit symétrique, mais un grand écart entre elles est un signal d'asymétrie.",
  build: function(k, S){
    var c = ST.canvas(k, 280, .62, 400);
    var BASE = [32, 35, 38, 40, 42, 45, 47, 50, 55, 60], data = BASE.slice(), moved = {};
    var X0 = 20, X1 = 320, ghost = {m: mean(BASE), q: quart(asc(BASE))};
    var v = k.slider("Dixième valeur (ou glisse un point)", 20, 300, 1, 60, "min", function(val){ data[9] = val; moved[9] = 1; });
    k.button("Remettre les valeurs d'origine", function(){ data = BASE.slice(); moved = {}; v.set(60); });
    var ro = k.readouts(["Moyenne", "Médiane", "Écart-type s", "Q1 – Q3"]);
    var nt = k.note("", "");
    var lay = {};
    function place(){
      var order = data.map(function(x, i){ return {x: x, i: i}; }).sort(function(a, b){ return a.x - b.x || a.i - b.i; }), lv = [], r = 7;
      order.forEach(function(o){ o.px = lay.X(o.x); var l = 0; while (lv[l] !== undefined && o.px - lv[l] < 2 * r + 1) l++; lv[l] = o.px; o.l = l; o.py = lay.y - 13 - l * (2 * r + 1); });
      return order;
    }
    ST.drag(c, function(){ return lay.X ? place().map(function(o){ return {x: o.px, y: o.py, id: o.i, r: 14}; }) : []; },
      function(id, p){ var val = ST.clamp(Math.round(lay.ix(p.x)), 20, 300); if (id === 9) v.set(val); data[id] = val; moved[id] = 1; k.redraw(); });
    k.draw(function(){
      c.clear();
      var L = 28, R = 20, y = c.H - 56; lay.y = y;
      lay.X = function(t){ return L + (t - X0) / (X1 - X0) * (c.W - L - R); }; lay.ix = function(px){ return X0 + (px - L) / (c.W - L - R) * (X1 - X0); };
      var d = asc(data), m = mean(d), q = quart(d), s = sd(d), ctx = c.ctx;
      /* zone interquartile */
      ctx.fillStyle = S.draw.tint(P.amber, 0.13); ctx.fillRect(lay.X(q[0]), 30, lay.X(q[2]) - lay.X(q[0]), y - 30);
      S.draw.label(c, "Q1 – Q3 : la moitié centrale", (lay.X(q[0]) + lay.X(q[2])) / 2, 20, {color: P.amber, size: 11});
      haxis(c, X0, X1, L, R, y, 40, "temps d'attente (min)");
      /* fantômes : valeurs d'origine */
      S.draw.line(c, lay.X(ghost.m), y - 6, lay.X(ghost.m), y + 6, P.red, 2); S.draw.line(c, lay.X(ghost.q[1]), y - 6, lay.X(ghost.q[1]), y + 6, P.green, 2);
      /* médiane */
      S.draw.line(c, lay.X(q[1]), 44, lay.X(q[1]), y, P.green, 3);
      S.draw.label(c, "médiane " + F(q[1], 1), lay.X(q[1]), 44, {color: P.green, base: "bottom"});
      /* points empilés */
      place().forEach(function(o){ S.draw.dot(c, o.px, o.py, 7, moved[o.i] ? P.orange : P.mat); });
      /* point d'équilibre : triangle sous l'axe */
      var xm = lay.X(m); ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(xm, y + 3); ctx.lineTo(xm - 9, y + 20); ctx.lineTo(xm + 9, y + 20); ctx.closePath(); ctx.fill();
      var flip = xm > c.W - 90;
      S.draw.label(c, "moyenne " + F(m, 1), xm + (flip ? -14 : 14), y + 30 + (c.W < 420 ? 0 : 0), {color: P.red, align: flip ? "right" : "left"});
      ST.hint(c, "glisse un point", c.W - 80, 46, P.mat);
      ro.set(0, F(m, 1) + " min"); ro.set(1, F(q[1], 1) + " min"); ro.set(2, F(s, 1) + " min"); ro.set(3, F(q[0], 1) + " – " + F(q[2], 1));
      var dm = m - ghost.m, dd = q[1] - ghost.q[1];
      if (Object.keys(moved).length === 0) nt.set("Défi : déplace une seule valeur pour faire monter la moyenne de plus de 15 minutes. Que devient la médiane ? Les repères rouge et vert sous l'axe rappellent la moyenne et la médiane d'origine.", "");
      else if (Object.keys(moved).length === 1 && dm > 15) nt.set("Une seule personne (" + F(d[9], 0) + " min) a déplacé la moyenne de +" + F(dm, 1) + " min, la médiane de " + (dd >= 0 ? "+" : "") + F(dd, 1) + " min seulement. Voilà la résistance de la médiane. Écart-type : " + F(s, 1) + " min.", "warn");
      else nt.set("Moyenne : " + (dm >= 0 ? "+" : "") + F(dm, 1) + " min par rapport au départ ; médiane : " + (dd >= 0 ? "+" : "") + F(dd, 1) + " min. Quartiles : médiane de chaque moitié.", "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-histogramme", ch: "c01", tag: "Représenter",
  titre: "Histogramme : la forme dépend du découpage",
  resume: "Largeur de classe et origine : la même série de 150 durées de séjour prend des allures différentes.",
  but: "Change la largeur des classes puis le point de départ de la première classe (ou lance l'animation) : la forme change, les 150 données non.",
  aRetenir: "Une classe trop étroite montre du bruit, une classe trop large écrase la forme. Vérifie qu'une forme (asymétrie, deux bosses) résiste à un changement d'origine avant de l'interpréter.",
  piege: "L'aire des barres (pas leur hauteur) représente la fréquence quand les classes ont des largeurs inégales : ici les classes sont égales, la hauteur suffit.",
  build: function(k, S){
    var c = ST.canvas(k, 300, .72, 400);
    var r = rng(11), data = [];
    for (var i = 0; i < 150; i++){ data.push(Math.round((1.5 + Math.exp(1.1 + 0.55 * gauss(r))) * 10) / 10); }
    data.sort(function(a, b){ return a - b; });
    var mn = data[0], mx = data[data.length - 1];
    var w = k.slider("Largeur de classe", 0.5, 8, 0.5, 2, "jours");
    var o = k.slider("Décalage de la 1re borne", 0, 1, 0.05, 0, "× largeur");
    var ani = k.loop(function(dt, t){ o.set((Math.sin(t * 0.9) + 1) / 2); k.redraw(); });
    k.button("Animer le décalage / arrêter", function(){ if (ani.running) ani.pause(); else ani.play(); }, true);
    var ro = k.readouts(["Classes", "Classe modale", "Effectif max", "Moyenne / médiane"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var W = w.value, start = Math.floor(mn / W) * W - o.value * W, nb = Math.ceil((mx - start) / W + 1e-9), cnt = [], j;
      for (j = 0; j < nb; j++) cnt.push(0);
      data.forEach(function(t){ var b = Math.floor((t - start) / W + 1e-9); if (b >= nb) b = nb - 1; if (b < 0) b = 0; cnt[b]++; });
      var cm = Math.max.apply(null, cnt), ymax = Math.ceil(cm * 1.18 / 5) * 5, x1 = start + nb * W;
      var ax = S.draw.axes(c, {x0: start, x1: x1, y0: 0, y1: ymax, xl: "durée de séjour (jours)", yl: "effectif", stepX: W >= 2 ? W : undefined, b: 40, l: 42});
      var best = 0; cnt.forEach(function(n, b){ if (n > cnt[best]) best = b; });
      cnt.forEach(function(n, b){ var xa = ax.X(start + b * W), xb = ax.X(start + (b + 1) * W), isb = b === best;
        c.ctx.fillStyle = isb ? S.draw.tint(P.orange, 0.85) : S.draw.tint(P.mat, 0.62); c.ctx.fillRect(xa + 0.5, ax.Y(n), Math.max(1, xb - xa - 1), ax.Y(0) - ax.Y(n));
        if (n && xb - xa > 18) S.draw.text(c, n, (xa + xb) / 2, ax.Y(n) - 8, {size: 11, color: isb ? P.orange : "#4a5a6e"}); });
      /* rug : les 150 données en bas */
      data.forEach(function(t){ S.draw.line(c, ax.X(t), ax.Y(0) - 1, ax.X(t), ax.Y(0) - 7, S.draw.tint(P.ink, 0.35), 1); });
      var mo = mean(data), me = med(data);
      S.draw.line(c, ax.X(mo), ax.Y(0), ax.X(mo), ax.T + 6, P.red, 1.8, [5, 4]); S.draw.line(c, ax.X(me), ax.Y(0), ax.X(me), ax.T + 6, P.green, 1.8, [5, 4]);
      S.draw.legend(c, [[P.red, "moyenne", 1], [P.green, "médiane", 1], [P.orange, "classe modale"]], c.W - 12, 12, {align: "right"});
      ro.set(0, nb); ro.set(1, F(start + best * W, 1) + " – " + F(start + (best + 1) * W, 1)); ro.set(2, cm); ro.set(3, F(mo, 1) + " / " + F(me, 1) + " j");
      if (W <= 1) nt.set("Classes très étroites : beaucoup de barres de 0 ou 1 individu, la forme se perd dans le bruit.", "warn");
      else if (W >= 6) nt.set("Classes très larges : presque tout tombe dans une ou deux barres, l'asymétrie disparaît.", "warn");
      else nt.set("Asymétrie à droite : la moyenne (" + F(mo, 1) + ") dépasse la médiane (" + F(me, 1) + "). Les petits traits en bas sont les 150 données. Déplace la 1re borne : la barre modale (orange) peut changer de classe.", "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-boite", ch: "c01", tag: "Quartiles",
  titre: "Boîte à moustaches : lire, comparer, repérer l'atypique",
  resume: "Deux groupes de 20 : glisse les points, regarde la boîte, les moustaches et les valeurs atypiques réagir.",
  but: "Le groupe A est fixé. Fais glisser n'importe quel point du groupe B (ou règle sa moyenne et sa dispersion) : la boîte, les moustaches et les barrières de 1,5 × EIQ se recalculent.",
  aRetenir: "Boîte = de Q1 à Q3 (50 % des valeurs), trait = médiane. Moustaches : jusqu'à la dernière valeur dans [Q1 − 1,5·EIQ ; Q3 + 1,5·EIQ]. Au-delà : valeur atypique (point isolé).",
  piege: "Des boîtes qui se chevauchent ne permettent pas de conclure à « pas de différence » : cela dépend aussi de n. Et un point isolé est atypique, pas forcément une erreur de mesure.",
  build: function(k, S){
    var c = ST.canvas(k, 290, .64, 400);
    function grp(m, s){ var a = []; for (var i = 0; i < 20; i++) a.push(m + s * invPhi((i + 0.5) / 20)); return a; }
    var A = grp(100, 15), Bz = grp(0, 1), moved = {}, off = Bz.map(function(){ return 0; });
    var mb = k.slider("Moyenne de B", 70, 140, 1, 115, "", function(){ off = Bz.map(function(){ return 0; }); moved = {}; });
    var sb = k.slider("Écart-type de B", 5, 35, 1, 15, "", function(){ off = Bz.map(function(){ return 0; }); moved = {}; });
    k.button("Replacer les points de B", function(){ off = Bz.map(function(){ return 0; }); moved = {}; });
    var ro = k.readouts(["Q1 de B", "Médiane de B", "Q3 de B", "Atypiques B"]);
    var nt = k.note("", "");
    function Bv(){ return Bz.map(function(z, i){ return mb.value + sb.value * z + off[i]; }); }
    function stats(d){
      var s = asc(d), q = quart(s), e = q[2] - q[0], lf = q[0] - 1.5 * e, hf = q[2] + 1.5 * e;
      var inn = s.filter(function(t){ return t >= lf && t <= hf; }), out = s.filter(function(t){ return t < lf || t > hf; });
      return {q: q, lo: inn[0], hi: inn[inn.length - 1], out: out, iqr: e, lf: lf, hf: hf};
    }
    var lay = {}, jit = rng(4), jA = [], jB = []; for (var i = 0; i < 20; i++){ jA.push(jit() - .5); jB.push(jit() - .5); }
    ST.drag(c, function(){ if (!lay.X) return []; return Bv().map(function(t, i){ return {x: lay.X(t), y: lay.yB + jB[i] * 30, id: i, r: 12}; }); },
      function(id, p){ var base = mb.value + sb.value * Bz[id]; off[id] = ST.clamp(lay.ix(p.x), 20, 280) - base; moved[id] = 1; k.redraw(); });
    k.draw(function(){
      c.clear();
      var L = 46, R = 22, x0 = 20, x1 = 280, y = c.H - 52, ctx = c.ctx;
      lay.X = function(t){ return L + (t - x0) / (x1 - x0) * (c.W - L - R); }; lay.ix = function(px){ return x0 + (px - L) / (c.W - L - R) * (x1 - x0); };
      var yA = 64 + (y - 160) * 0.15, yB = y - 62 - (y - 160) * 0.1; lay.yB = yB;
      haxis(c, x0, x1, L, R, y, 20, "valeur du paramètre");
      var B = Bv(), sa = stats(A), sb2 = stats(B);
      function box(st, d, yc, col, name, jt, handles){
        var X = lay.X, hh = 26;
        /* barrières */
        S.draw.line(c, X(st.lf), yc - hh - 6, X(st.lf), yc + hh + 6, S.draw.tint(col, 0.35), 1.2, [3, 3]); S.draw.line(c, X(st.hf), yc - hh - 6, X(st.hf), yc + hh + 6, S.draw.tint(col, 0.35), 1.2, [3, 3]);
        S.draw.line(c, X(st.lo), yc, X(st.hi), yc, col, 2); S.draw.line(c, X(st.lo), yc - 9, X(st.lo), yc + 9, col, 2); S.draw.line(c, X(st.hi), yc - 9, X(st.hi), yc + 9, col, 2);
        ctx.fillStyle = S.draw.tint(col, 0.16); ctx.strokeStyle = col; ctx.lineWidth = 2; S.draw.rrect(c, X(st.q[0]), yc - 20, X(st.q[2]) - X(st.q[0]), 40, 4); ctx.fill(); ctx.stroke();
        S.draw.line(c, X(st.q[1]), yc - 20, X(st.q[1]), yc + 20, col, 4);
        d.forEach(function(t, i){ var out = t < st.lf || t > st.hf; S.draw.dot(c, X(t), yc + jt[i] * 30, handles ? 5 : 4, out ? P.red : col); });
        S.draw.label(c, name, 24, yc, {color: col, size: 13});
      }
      box(sa, A, yA, P.mat, "A", jA, false); box(sb2, B, yB, P.orange, "B", jB, true);
      ST.hint(c, "glisse les points de B", c.W - 100, yB - 44, P.orange);
      ro.set(0, F(sb2.q[0], 1)); ro.set(1, F(sb2.q[1], 1)); ro.set(2, F(sb2.q[2], 1)); ro.set(3, sb2.out.length);
      var ov = sb2.q[0] < sa.q[2] && sa.q[0] < sb2.q[2];
      nt.set((sb2.out.length ? "Le groupe B a " + sb2.out.length + " valeur(s) atypique(s) (en rouge) : au-delà des barrières pointillées, à 1,5 fois l'écart interquartile (" + F(sb2.iqr, 1) + ") de la boîte. " : "") + (ov ? "Les deux boîtes se chevauchent : à vue, la différence de niveau est modérée, un test est nécessaire pour conclure." : "Les boîtes ne se chevauchent pas : les centres sont nettement séparés."), sb2.out.length ? "warn" : "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-et-contre-es", ch: "c01", tag: "Barres d'erreur",
  titre: "Écart-type, erreur standard, IC : trois barres, trois messages",
  resume: "Quand n augmente, l'écart-type reste, l'erreur standard fond. Ne confonds pas les barres d'erreur d'un graphique.",
  but: "Fixe l'écart-type σ de la population et fais varier n : les points sont les individus, les trois barres sont centrées sur la moyenne observée. Tire un nouvel échantillon pour voir bouger la moyenne.",
  aRetenir: "Écart-type = dispersion des individus (ne dépend pas de n). Erreur standard = s/√n = précision de la moyenne (diminue avec n). IC 95 % ≈ moyenne ± t·ES.",
  piege: "Une barre d'erreur « ± ES » est toujours plus courte qu'une barre « ± ET » : elle fait paraître les données moins dispersées qu'elles ne le sont. Lis toujours la légende.",
  build: function(k, S){
    var c = ST.canvas(k, 320, .8, 440);
    var sg = k.slider("Écart-type σ de la population", 5, 30, 1, 15, "");
    var nn = k.slider("Effectif n", 2, 400, 1, 25, "");
    var seed = 5, zs = [], jit = [];
    function regen(){ var rr = rng(seed * 101 + 7); zs = []; jit = []; for (var i = 0; i < 400; i++){ jit.push(rr()); zs.push(gauss(rr)); } }
    regen();
    k.button("Nouvel échantillon", function(){ seed++; regen(); }, true);
    var ro = k.readouts(["Écart-type s", "Erreur standard", "Demi-largeur IC 95 %", "t(0,975 ; n−1)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var n = nn.value, s0 = sg.value, mu = 100, ctx = c.ctx, vals = [], i;
      for (i = 0; i < n; i++) vals.push(mu + s0 * zs[i]);
      var m = mean(vals), s = n > 1 ? sd(vals) : s0, se = s / Math.sqrt(n), t = tq(n - 1);
      var L = 50, T = 18, B = 40, y0 = 10, y1 = 190;
      function Y(v){ return T + (y1 - v) / (y1 - y0) * (c.H - T - B); }
      ctx.save(); ctx.strokeStyle = P.grid; ctx.fillStyle = "#6b7685"; ctx.font = "600 11.5px Mulish, system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 20; g <= 180; g += 20){ ctx.beginPath(); ctx.moveTo(L, Y(g) + .5); ctx.lineTo(c.W - 10, Y(g) + .5); ctx.stroke(); ctx.fillText(g, L - 7, Y(g)); } ctx.restore();
      var zone = (c.W - L - 10) * 0.46;
      for (i = 0; i < n; i++){ var v = vals[i], px = L + 14 + jit[i] * (zone - 28); if (v > y0 && v < y1) S.draw.dot(c, px, Y(v), n > 150 ? 2.2 : 3.2, S.draw.tint(P.mat, n > 150 ? 0.4 : 0.6)); }
      S.draw.text(c, "n = " + n + " individus", L + zone / 2, c.H - 16, {size: 12, color: "#4a5a6e"});
      S.draw.line(c, L, Y(mu), c.W - 10, Y(mu), P.grey, 1.2, [5, 4]); S.draw.legend(c, [[P.grey, "vraie moyenne μ = 100", 1]], L + 6, 6);
      var bars = [["± ET", s, P.mat], ["± ES", se, P.orange], ["IC 95 %", t * se, P.red]];
      ctx.save(); ctx.strokeStyle = S.draw.tint(P.grey, .5); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(L + zone + 6, T); ctx.lineTo(L + zone + 6, c.H - B); ctx.stroke(); ctx.restore();
      bars.forEach(function(b, q){
        var x = L + zone + (c.W - L - 10 - zone) * (q + 0.5) / 3;
        S.draw.line(c, x, Y(m - b[1]), x, Y(m + b[1]), b[2], 4.5);
        S.draw.line(c, x - 11, Y(m - b[1]), x + 11, Y(m - b[1]), b[2], 4.5); S.draw.line(c, x - 11, Y(m + b[1]), x + 11, Y(m + b[1]), b[2], 4.5);
        S.draw.dot(c, x, Y(m), 5.5, P.ink);
        S.draw.label(c, b[0], x, c.H - 16, {color: b[2], size: 12});
        S.draw.label(c, "± " + F(b[1], 1), x, Math.max(T + 8, Y(m + b[1]) - 14), {color: b[2], size: 11});
      });
      ro.set(0, F(s, 1)); ro.set(1, F(se, 2)); ro.set(2, F(t * se, 2)); ro.set(3, F(t, 3));
      var inc = Math.abs(m - mu) <= t * se;
      nt.set(n < 10 ? "Petit n : l'IC utilise le quantile de Student (" + F(t, 2) + ") et non 1,96. " + (inc ? "" : "Cet IC ne contient pas μ : ça arrive 1 fois sur 20.") : "Avec n = " + n + ", l'ES (" + F(se, 2) + ") est " + F(s / se, 1) + " fois plus petite que l'écart-type : une barre ± ES donne une impression de faible dispersion. " + (inc ? "L'IC contient la vraie moyenne." : "Cet IC ne contient pas μ (cela arrive 1 fois sur 20)."), n < 10 || !inc ? "warn" : "ok");
    });
  }
});
})();
