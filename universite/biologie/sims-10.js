/* Biologie BA1 · chapitre 10 : populations (évolution, génétique des populations, écologie) */
(function(){
function erfc(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z); var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
var PI2 = Math.PI * 2, CA = "#2f6fd1", Ca = "#e0a01b";
/* repère dans un sous-rectangle r = {x, y, w, h} du canevas */
function axIn(S, c, r, o){ o = o || {}; o.l = r.x + (o.pl == null ? 44 : o.pl); o.r = Math.max(4, c.W - r.x - r.w + (o.pr == null ? 10 : o.pr)); o.t = r.y + (o.pt == null ? 16 : o.pt); o.b = Math.max(4, c.H - r.y - r.h + (o.pb == null ? 32 : o.pb)); return S.draw.axes(c, o); }
function clip(c, ax){ var x = c.ctx; x.save(); x.beginPath(); x.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); x.clip(); }
function poly(c, pts, col, w, dash, alpha){ var x = c.ctx; if (!pts.length) return; x.save(); x.strokeStyle = col; x.lineWidth = w || 2; x.lineJoin = "round"; x.lineCap = "round"; if (dash) x.setLineDash(dash); if (alpha != null) x.globalAlpha = alpha; x.beginPath(); pts.forEach(function(p, i){ if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); x.stroke(); x.restore(); }
/* individu diploïde : disque à deux moitiés (allèle gauche, allèle droit) ; null = moitié vide */
function ind(c, x, y, r, a1, a2, alpha){ var ctx = c.ctx; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fillStyle = a1 == null ? "#fff" : (a1 ? CA : Ca); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fillStyle = a2 == null ? "#fff" : (a2 ? CA : Ca); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, PI2); ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
function dot(c, x, y, r, col, alpha){ var ctx = c.ctx; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; var g = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r); g.addColorStop(0, "#fff"); g.addColorStop(.35, col); g.addColorStop(1, col); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, PI2); ctx.fill(); ctx.restore(); }
function alleleKey(c, S, x, y, la, lb){ la = la || "A"; ind(c, x, y, 5, 1, 1); S.draw.text(c, la, x + 9, y, {size:10.5, align:"left", color:"#2c3a4e"}); c.ctx.save(); c.ctx.font = "700 10.5px Mulish, system-ui, sans-serif"; var w = c.ctx.measureText(la).width; c.ctx.restore(); ind(c, x + w + 24, y, 5, 0, 0); S.draw.text(c, lb || "a", x + w + 33, y, {size:10.5, align:"left", color:"#2c3a4e"}); }
function touch(c){ c.cv.style.touchAction = "none"; }
function playLabel(b, on){ if (b) b.textContent = on ? "⏸ Pause" : "▶ Lancer"; }

/* 1. Hardy-Weinberg */
SFA.sim({
  id:"ub-c10-hardy-weinberg", ch:"c10", tag:"Génétique des populations",
  titre:"Hardy-Weinberg : porteurs, incidence et test d'équilibre",
  resume:"Un échiquier dont les aires valent p², 2pq et q² : glisse q, regarde naître 100 enfants, relève les défis porteurs/malades et teste un échantillon par le χ².",
  but:"Glisse la frontière A | a de l'échiquier (ou le trait vertical du graphique) pour régler q. Les cases ont l'aire des fréquences génotypiques ; 100 naissances tirées au hasard montrent la fluctuation. Relève les défis, puis entre un échantillon observé : s'il est à l'équilibre, ses trois points tombent sur les courbes.",
  aRetenir:"À l'équilibre (population grande, panmixie, sans mutation, migration ni sélection) : p + q = 1 ; fréquences AA = p², Aa = 2pq, aa = q². Incidence q² → q = √incidence. Les porteurs sont bien plus nombreux que les malades : rapport 2pq / q² = 2p/q. Mucoviscidose (incidence ≈ 1/2 500) : q = 0,02, porteurs 2pq ≈ 3,9 % (≈ 1 sur 25,5). 2pq vaut au plus 50 % (p = q = 0,5). Test d'équilibre : χ² sur 3 classes avec 1 degré de liberté (3 classes − 1 − 1 paramètre estimé), seuil à 5 % = 3,84.",
  piege:"Ne pas confondre q (fréquence de l'allèle) et q² (fréquence des malades). Les attendus se calculent avec les fréquences alléliques estimées sur l'échantillon, d'où 1 seul degré de liberté. L'équilibre n'est pas une preuve d'absence de sélection : il est atteint en une génération de panmixie.",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(560), di = 0, born = [], tb = 0, bseed = 7, geo = null, drag = null, keyq = null;
    touch(c);
    var qs = k.slider("q (fréquence de l'allèle a)", 0.005, 0.95, 0.005, 0.3, "");
    var a1 = k.slider("Échantillon observé : AA", 0, 1000, 10, 640, "");
    var a2 = k.slider("Échantillon observé : Aa", 0, 1000, 10, 310, "");
    var a3 = k.slider("Échantillon observé : aa", 0, 1000, 10, 50, "");
    k.button("Défi suivant", function(){ di = (di + 1) % DEF.length; }, true);
    k.button("100 nouvelles naissances", function(){ bseed += 31; newBirths(); });
    var ro = k.readouts(["p · q", "AA · Aa · aa", "Incidence aa", "Porteurs / malades", "χ² de l'échantillon (1 ddl)"]);
    var note = k.note("", "");
    var DEF = [
      {t:"trouve q pour que les porteurs (Aa) soient 10 fois plus nombreux que les malades (aa).", ok:function(q){ return Math.abs(2 * (1 - q) / q - 10) <= 0.5; }, sol:"2p/q = 10 ⇒ q = 1/6 ≈ 0,167."},
      {t:"mucoviscidose : 1 nouveau-né sur 2 500 est atteint. Règle q.", ok:function(q){ return q * q >= 1 / 2700 && q * q <= 1 / 2300; }, sol:"q = √(1/2 500) = 0,02 ; porteurs 2pq ≈ 3,9 %, soit 1 personne sur 25,5."},
      {t:"rends les hétérozygotes aussi fréquents que possible.", ok:function(q){ return Math.abs(q - 0.5) < 0.006; }, sol:"2pq = 2q(1 − q) est maximal pour q = 0,5 : 50 % d'hétérozygotes, jamais plus."},
      {t:"trouve q pour qu'une personne sur 10 soit porteuse hétérozygote.", ok:function(q){ return Math.abs(2 * q * (1 - q) - 0.1) <= 0.006; }, sol:"2q(1 − q) = 0,1 ⇒ q ≈ 0,053."}
    ];
    function newBirths(){ var r = rng(bseed), q = qs.value; born = []; for (var i = 0; i < 100; i++) born.push([r() < 1 - q ? 1 : 0, r() < 1 - q ? 1 : 0]); tb = 0; }
    function setQ(v){ v = Math.max(0.005, Math.min(0.95, Math.round(v * 1000) / 1000)); qs.set(v); }
    c.pointer(function(t, p){
      if (!geo) return;
      if (t === "down"){
        if (Math.abs(p.x - geo.sx) < 14 && p.y > geo.y - 16 && p.y < geo.y + geo.s + 8) drag = "sq";
        else if (Math.abs(p.y - geo.sy) < 14 && p.x > geo.x - 16 && p.x < geo.x + geo.s) drag = "sq2";
        else if (p.y > geo.ax.T - 6 && p.y < geo.ax.B + 6 && p.x > geo.ax.L - 6 && p.x < geo.ax.R + 6) drag = "gr";
        else drag = null;
      }
      if ((t === "down" || t === "drag") && drag){
        if (drag === "sq") setQ(1 - (p.x - geo.x) / geo.s);
        else if (drag === "sq2") setQ(1 - (p.y - geo.y) / geo.s);
        else setQ(geo.ax.ix(p.x));
        k.redraw();
      }
      if (t === "up") drag = null;
    });
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, q = qs.value, p = 1 - q, f = [p * p, 2 * p * q, q * q];
      if (keyq !== q){ keyq = q; newBirths(); }
      tb += dt || 0;
      c.clear();
      /* ---- échiquier de Punnett aux aires proportionnelles ---- */
      var s = Math.max(120, Math.min(W * 0.5 - 40, 210)), x0 = 34, y0 = 44, sx = x0 + s * p, sy = y0 + s * p;
      S.draw.text(c, "Échiquier des gamètes", 6, 12, {size:11.5, align:"left", color:pal.ink});
      S.draw.text(c, "♀", x0 - 20, y0 - 14, {size:12, color:pal.grey});
      var cols = {AA:"#cfe0f8", Aa:"#e6dcf4", aa:"#f8e3b8"};
      var cells = [[x0, y0, s * p, s * p, "AA", "p²", cols.AA], [sx, y0, s * q, s * p, "Aa", "pq", cols.Aa], [x0, sy, s * p, s * q, "Aa", "pq", cols.Aa], [sx, sy, s * q, s * q, "aa", "q²", cols.aa]];
      cells.forEach(function(r){ ctx.fillStyle = r[6]; ctx.fillRect(r[0], r[1], r[2], r[3]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.strokeRect(r[0], r[1], r[2], r[3]);
        if (r[2] > 30 && r[3] > 26){ S.draw.text(c, r[4], r[0] + r[2] / 2, r[1] + r[3] / 2 - 7, {size:12, math:true}); S.draw.text(c, r[5], r[0] + r[2] / 2, r[1] + r[3] / 2 + 9, {size:10.5, color:pal.grey, math:true}); } });
      /* bordure gamètes */
      ctx.fillStyle = CA; ctx.fillRect(x0, y0 - 9, s * p, 6); ctx.fillStyle = Ca; ctx.fillRect(sx, y0 - 9, s * q, 6);
      ctx.fillStyle = CA; ctx.fillRect(x0 - 9, y0, 6, s * p); ctx.fillStyle = Ca; ctx.fillRect(x0 - 9, sy, 6, s * q);
      S.draw.text(c, "A (p)", x0 + Math.max(16, s * p / 2), y0 - 20, {size:10.5, color:CA});
      if (s * q > 24) S.draw.text(c, "a", sx + s * q / 2, y0 - 20, {size:10.5, color:"#a8740c"}); else S.draw.text(c, "a", sx + 6, y0 - 20, {size:10.5, color:"#a8740c"});
      S.draw.text(c, "♂", x0 - 22, y0 + s + 10, {size:12, color:pal.grey});
      /* poignée */
      S.draw.line(c, sx, y0 - 14, sx, y0 + s + 6, pal.ink, 2);
      S.draw.dot(c, sx, y0 + s + 8, 6.5, pal.mat || pal.acc);
      S.draw.text(c, "↔ q = " + S.fmt(q, 3), Math.min(x0 + s - 34, Math.max(x0 + 34, sx)), y0 + s + 24, {size:10.5, color:pal.ink});
      geo = {x:x0, y:y0, s:s, sx:sx, sy:sy, ax:null};
      /* ---- 100 naissances ---- */
      var gx = x0 + s + 18, gw = W - gx - 6, cell = Math.min(gw / 10, 19), gy = y0 - 2;
      S.draw.text(c, W < 420 ? "100 naissances" : "100 naissances tirées au hasard", gx, 12, {size:11, align:"left", color:pal.ink});
      var shown = Math.min(100, Math.floor(tb / 0.025)), obs = [0, 0, 0];
      for (var i = 0; i < 100; i++){
        var cx = gx + cell * (i % 10 + .5), cy = gy + cell * (Math.floor(i / 10) + .5), b = born[i];
        if (i < shown){ var g = b[0] + b[1]; obs[2 - g]++; ind(c, cx, cy, cell * 0.38, b[0], b[1]); if (g === 0) { ctx.save(); ctx.strokeStyle = pal.red; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, cell * 0.46, 0, PI2); ctx.stroke(); ctx.restore(); } }
        else { ctx.fillStyle = "#eef1f5"; ctx.beginPath(); ctx.arc(cx, cy, cell * 0.2, 0, PI2); ctx.fill(); }
      }
      var ty = gy + cell * 10 + 12;
      S.draw.text(c, "AA " + obs[0] + " · Aa " + obs[1] + " · aa " + obs[2], gx, ty, {size:10.5, align:"left", color:pal.ink});
      S.draw.text(c, "attendu " + S.fmt(f[0] * 100, 0) + " · " + S.fmt(f[1] * 100, 0) + " · " + S.fmt(f[2] * 100, 1), gx, ty + 15, {size:10, align:"left", color:pal.grey});
      alleleKey(c, S, gx + 6, ty + 31, "A", "a");
      /* ---- courbes p², 2pq, q² ---- */
      var top = Math.max(y0 + s + 36, ty + 44), ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:1, y0:0, y1:1, stepX:0.1, stepY:0.25, xl:"q", yl:"fréquence"});
      geo.ax = ax;
      S.draw.fn(c, ax, function(x){ return (1 - x) * (1 - x); }, CA, 2.4);
      S.draw.fn(c, ax, function(x){ return 2 * x * (1 - x); }, pal.violet, 2.4);
      S.draw.fn(c, ax, function(x){ return x * x; }, "#c9850e", 2.4);
      S.draw.text(c, "AA = p²", ax.X(0.13), ax.Y(0.88), {size:10.5, color:CA, halo:true});
      S.draw.text(c, "Aa = 2pq", ax.X(0.5), ax.Y(0.5) - 11, {size:10.5, color:pal.violet, halo:true});
      S.draw.text(c, "aa = q²", ax.X(0.98), ax.Y(0.68), {size:10.5, color:"#a8740c", halo:"#fff", align:"right"});
      S.draw.line(c, ax.X(q), ax.T, ax.X(q), ax.B, pal.ink, 1.6, [4, 3]);
      [f[0], f[1], f[2]].forEach(function(v, j){ S.draw.dot(c, ax.X(q), ax.Y(v), 5, [CA, pal.violet, "#c9850e"][j]); });
      /* échantillon observé */
      var n = a1.value + a2.value + a3.value, chi = NaN, lowE = false;
      if (n > 0){
        var ph = (2 * a1.value + a2.value) / (2 * n), qh = 1 - ph, ex = [ph * ph * n, 2 * ph * qh * n, qh * qh * n], ob = [a1.value, a2.value, a3.value];
        chi = 0; for (i = 0; i < 3; i++){ if (ex[i] > 0) chi += Math.pow(ob[i] - ex[i], 2) / ex[i]; if (ex[i] < 5) lowE = true; }
        ob.forEach(function(o, j){ var X = ax.X(qh), Y = ax.Y(o / n); ctx.save(); ctx.strokeStyle = [CA, pal.violet, "#c9850e"][j]; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.rect(X - 5, Y - 5, 10, 10); ctx.stroke(); ctx.restore(); });
        S.draw.label(c, "□ échantillon : q̂ = " + S.fmt(qh, 3), ax.R - 4, ax.T + 4, {size:10, align:"right", color:pal.ink, fill:"rgba(255,255,255,.92)"});
      }
      /* lectures */
      ro.set(0, S.fmt(p, 3) + " · " + S.fmt(q, 3));
      ro.set(1, S.fmt(f[0] * 100, 1) + " · " + S.fmt(f[1] * 100, 1) + " · " + S.fmt(f[2] * 100, 2) + " %");
      ro.set(2, "1 sur " + (f[2] > 0 ? S.fmt(1 / f[2], f[2] > 0.01 ? 1 : 0) : "—"));
      ro.set(3, S.fmt(2 * p / q, 1));
      ro.set(4, isNaN(chi) ? "—" : S.fmt(chi, 2) + (chi > 3.841 ? " &gt; 3,84" : " ≤ 3,84"));
      var d = DEF[di], ok = d.ok(q);
      var chiTxt = isNaN(chi) ? " Échantillon vide." : chi > 3.841 ? " Échantillon : χ² = " + S.fmt(chi, 2) + " &gt; 3,84 : écart significatif à l'équilibre (p &lt; 0,05)." : " Échantillon : χ² = " + S.fmt(chi, 2) + " ≤ 3,84 : compatible avec l'équilibre (points □ sur les courbes).";
      if (lowE) chiTxt += " Un effectif attendu est inférieur à 5 : test peu fiable.";
      note.set((ok ? "✓ <b>Défi " + (di + 1) + "/4 réussi</b> : " + d.sol : "◎ <b>Défi " + (di + 1) + "/4</b> : " + d.t) + chiTxt, ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ if (tb < 3 || drag) render(dt); }); lp.play();
  }
});

/* 2. Dérive génétique */
SFA.sim({
  id:"ub-c10-derive", ch:"c10", tag:"Dérive",
  titre:"Dérive génétique : le hasard dans les petites populations",
  resume:"Les gamètes d'une génération sont tirés au hasard pour former la suivante : 20 populations en parallèle, fixation, perte, goulot d'étranglement.",
  but:"Lance les générations : à gauche les individus de la génération t, à droite ceux de t + 1, formés de gamètes tirés au hasard. Touche une courbe pour suivre sa population, glisse sur le graphique pour remonter le temps. Défi : fais perdre toute variation (p = 0 ou 1) à au moins 15 populations sur 20 avant la génération 100.",
  aRetenir:"Dérive : variation aléatoire des fréquences alléliques due à l'échantillonnage des gamètes, d'autant plus forte que l'effectif N est petit (variance ≈ p(1−p)/2N par génération). Sans sélection, la probabilité de fixation d'un allèle égale sa fréquence initiale ; l'hétérozygotie décroît comme H<sub>t</sub> = H<sub>0</sub>(1 − 1/2N)<sup>t</sup> (divisée par 2 en ≈ 1,4·N générations). Effet fondateur et goulot d'étranglement : réduction brutale et aléatoire de la diversité.",
  piege:"La dérive ne favorise pas l'allèle « le plus adapté » : elle est aveugle. Ce n'est pas de la sélection. Des populations identiques au départ divergent. Modèle de Wright-Fisher simplifié : effectif constant (sauf goulot), générations séparées, pas de sélection ni de mutation ; au-delà de 48 individus, le dessin n'en montre qu'un échantillon.",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(560), G = 100, R = 20, seed = 4242, tr = [], cn = [], cur = 0, u = 0, playing = false, first = true, hl = 0, key = "", axG = null, trans = null, top = 0, bPlay;
    touch(c);
    var N = k.slider("Effectif N (individus diploïdes)", 5, 300, 5, 50, "");
    var p0 = k.slider("Fréquence initiale p₀ (allèle A)", 0.1, 0.9, 0.05, 0.5, "");
    var gob = k.toggle("Goulot d'étranglement (générations 40 à 49 : N = 5)", false);
    var vit = k.seg("Vitesse", [["l","Lente : voir les gamètes"],["r","Rapide"]], "l");
    bPlay = k.button("▶ Lancer", function(){ if (cur >= G){ cur = 0; u = 0; prep(); } playing = !playing; }, true);
    k.button("↺ Génération 0", function(){ cur = 0; u = 0; playing = false; prep(); });
    k.button("Nouveau tirage", function(){ seed += 1013; });
    var ro = k.readouts(["Génération", "p (population suivie)", "Fixées / perdues", "H moyenne : observée / théorie"]);
    var note = k.note("", "");
    function Ng(g){ return gob.value && g >= 40 && g < 50 ? 5 : N.value; }
    function sim(){
      var rnd = rng(seed + N.value * 7 + Math.round(p0.value * 100) + (gob.value ? 5 : 0)); tr = []; cn = [];
      for (var r = 0; r < R; r++){
        var n0 = 2 * Ng(0), x = Math.round(p0.value * n0), a = [x / n0], cc = [x];
        for (var g = 1; g <= G; g++){ var p = a[g - 1], n2 = 2 * Ng(g), y = 0, i;
          if (p > 0 && p < 1){ for (i = 0; i < n2; i++) if (rnd() < p) y++; } else y = p >= 1 ? n2 : 0;
          a.push(y / n2); cc.push(y); }
        tr.push(a); cn.push(cc);
      }
    }
    function inds(g){ var n = Ng(g), n2 = 2 * n, x = cn[hl][g], a = [], i, r = rng(seed * 7 + g * 131 + hl * 17 + 3);
      for (i = 0; i < n2; i++) a.push(i < x ? 1 : 0);
      for (i = n2 - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      var M = Math.min(n, 48); return {n:n, M:M, al:a.slice(0, 2 * M)}; }
    function grid(P, M){ var iw = P.w - 12, ih = P.h - 40, cols = Math.max(1, Math.ceil(Math.sqrt(M * iw / ih))), rows = Math.ceil(M / cols), cw = iw / cols, chh = ih / rows, r = Math.max(3, Math.min(13, Math.min(cw, chh) * 0.4)), out = [];
      for (var i = 0; i < M; i++) out.push({x:P.x + 6 + cw * (i % cols + .5), y:P.y + 24 + chh * (Math.floor(i / cols) + .5), r:r});
      return out; }
    function prep(){
      if (cur >= G){ trans = null; return; }
      var A = inds(cur), B = inds(cur + 1), r = rng(seed + cur * 977 + hl), src = [], by = [[], []];
      A.al.forEach(function(v, i){ by[v].push(i); });
      B.al.forEach(function(v){ var L = by[v]; src.push(L.length ? L[Math.floor(r() * L.length)] : -1); });
      trans = {A:A, B:B, src:src};
    }
    function check(){ var kk = [N.value, p0.value, gob.value, seed].join("|"); if (kk !== key){ key = kk; sim(); cur = 0; u = 0; playing = first; first = false; if (hl >= R) hl = 0; prep(); } }
    c.pointer(function(t, p){
      if (!axG) return;
      if ((t === "down" || t === "drag") && p.y > top){
        var g = Math.max(0, Math.min(G, Math.round(axG.ix(p.x))));
        if (t === "down"){ var best = -1, bd = 12; for (var r = 0; r < R; r++){ var d = Math.abs(axG.Y(tr[r][g]) - p.y); if (d < bd){ bd = d; best = r; } } if (best >= 0) hl = best; }
        cur = g; u = 0; playing = false; prep(); render();
      } else if (t === "down" && p.y <= top){ if (cur >= G){ cur = 0; prep(); } playing = !playing; }
    });
    function render(){
      var ctx = c.ctx, W = c.W, H = c.H, i, j, r;
      top = Math.round(H * 0.45);
      c.clear();
      var gap = 26, pw = (W - gap - 8) / 2, P1 = {x:4, y:4, w:pw, h:top - 28}, P2 = {x:4 + pw + gap, y:4, w:pw, h:top - 28};
      S.draw.panel(c, P1.x, P1.y, P1.w, P1.h, {shadow:false, title:"Génération " + cur + " · parents"});
      S.draw.panel(c, P2.x, P2.y, P2.w, P2.h, {shadow:false, title:cur < G ? "Génération " + (cur + 1) + " · enfants" : "Fin : génération " + G});
      S.draw.arrow(c, P1.x + P1.w + 3, P1.y + P1.h / 2, P2.x - 3, P1.y + P1.h / 2, pal.grey, 2);
      var A = trans ? trans.A : inds(cur), pa = grid(P1, A.M);
      for (i = 0; i < A.M; i++) ind(c, pa[i].x, pa[i].y, pa[i].r, A.al[2 * i], A.al[2 * i + 1]);
      if (trans){
        var B = trans.B, pb = grid(P2, B.M), anim = playing && vit.value === "l", L = B.al.length, ts = [];
        for (j = 0; j < L; j++) ts.push(anim ? Math.max(0, Math.min(1, (u - j / L * 0.55) / 0.4)) : 1);
        for (j = 0; j < B.M; j++) ind(c, pb[j].x, pb[j].y, pb[j].r, ts[2 * j] >= 1 ? B.al[2 * j] : null, ts[2 * j + 1] >= 1 ? B.al[2 * j + 1] : null);
        if (anim) for (j = 0; j < L; j++){ var t = ts[j]; if (t <= 0 || t >= 1) continue;
          var s = trans.src[j], fr = s >= 0 ? pa[Math.floor(s / 2)] : {x:P1.x + P1.w, y:P1.y + P1.h / 2}, to = pb[Math.floor(j / 2)], e = t * t * (3 - 2 * t);
          dot(c, fr.x + (to.x - fr.x) * e, fr.y + (to.y - fr.y) * e - Math.sin(e * Math.PI) * 26, Math.max(2.5, to.r * 0.42), B.al[j] ? CA : Ca); }
        if (B.n > B.M) S.draw.text(c, B.M + " montrés sur " + B.n, P2.x + P2.w / 2, P2.y + P2.h - 8, {size:9.5, color:pal.grey, weight:600});
      }
      if (A.n > A.M) S.draw.text(c, A.M + " montrés sur " + A.n, P1.x + P1.w / 2, P1.y + P1.h - 8, {size:9.5, color:pal.grey, weight:600});
      alleleKey(c, S, 12, top - 12, "allèle A", "allèle a");
      S.draw.text(c, "chaque enfant = 2 gamètes tirés au hasard", W - 6, top - 12, {size:10, align:"right", color:pal.grey, weight:600});
      /* graphique */
      var ax = axG = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:G, y0:0, y1:1, xl:"générations", yl:"p (fréquence de A)", stepX:20, stepY:0.25, pt:18});
      if (gob.value){ ctx.fillStyle = "rgba(192,50,29,.08)"; ctx.fillRect(ax.X(40), ax.T, ax.X(50) - ax.X(40), ax.B - ax.T); S.draw.text(c, "goulot", ax.X(45), ax.T + 8, {size:10, color:pal.red}); }
      var gEnd = Math.min(G, cur + (playing ? u : 0)), fix = 0, lost = 0, hs = 0;
      clip(c, ax);
      for (r = 0; r < R; r++){
        var pts = []; for (i = 0; i <= Math.floor(gEnd); i++) pts.push([ax.X(i), ax.Y(tr[r][i])]);
        if (gEnd > Math.floor(gEnd) && Math.floor(gEnd) < G){ var f = gEnd - Math.floor(gEnd), a0 = tr[r][Math.floor(gEnd)], a1v = tr[r][Math.floor(gEnd) + 1]; pts.push([ax.X(gEnd), ax.Y(a0 + (a1v - a0) * f)]); }
        if (r !== hl) poly(c, pts, "#5b7bb5", 1.2, null, 0.4);
      }
      var ph = []; for (i = 0; i <= Math.floor(gEnd); i++) ph.push([ax.X(i), ax.Y(tr[hl][i])]);
      poly(c, ph, pal.acc, 3);
      ctx.restore();
      S.draw.line(c, ax.X(cur), ax.T, ax.X(cur), ax.B, pal.ink, 1.2, [4, 3]);
      S.draw.dot(c, ax.X(cur), ax.Y(tr[hl][cur]), 5.5, pal.acc);
      for (r = 0; r < R; r++){ var v = tr[r][cur]; if (v >= 1) fix++; else if (v <= 0) lost++; hs += 2 * v * (1 - v); }
      var Ht = 2 * p0.value * (1 - p0.value); for (i = 1; i <= cur; i++) Ht *= 1 - 1 / (2 * Ng(i));
      S.draw.label(c, "fixées " + fix + " · perdues " + lost, ax.R - 4, ax.T + 8, {align:"right", size:10.5, color:fix + lost >= 15 ? pal.green : pal.ink});
      ro.set(0, cur + " / " + G); ro.set(1, S.fmt(tr[hl][cur], 3)); ro.set(2, fix + " / " + lost + " (sur " + R + ")"); ro.set(3, S.fmt(hs / R, 3) + " / " + S.fmt(Ht, 3));
      playLabel(bPlay, playing);
      var ok = fix + lost >= 15;
      note.set(ok ? "✓ <b>Défi réussi</b> : à la génération " + cur + ", " + (fix + lost) + " populations sur 20 ont perdu toute variation avec N = " + N.value + ". Plus N est petit, plus la dérive est rapide (H divisée par 2 en ≈ " + S.fmt(1.39 * N.value, 0) + " générations). Parmi elles, A s'est fixé " + fix + " fois : en moyenne une fraction p₀ = " + S.fmt(p0.value, 2) + "."
        : "◎ <b>Défi</b> : choisis l'effectif pour qu'au moins 15 populations sur 20 aient perdu toute variation (p = 0 ou 1) avant la génération 100. Actuellement " + (fix + lost) + "/20 à la génération " + cur + ".", ok ? "ok" : "");
    }
    function draw(){ check(); render(); }
    k.draw(draw);
    var lp = k.loop(function(dt){
      if (playing){ u += dt / (vit.value === "l" ? 1.5 : 0.07); while (u >= 1 && playing){ u -= 1; cur++; prep(); if (cur >= G){ playing = false; u = 0; } } }
      render();
    }); lp.play();
  }
});

/* 3. Sélection naturelle */
SFA.sim({
  id:"ub-c10-selection", ch:"c10", tag:"Sélection",
  titre:"Sélection naturelle : avantage de l'hétérozygote",
  resume:"Naissances, survie selon la valeur sélective, gamètes : la drépanocytose se maintient là où sévit le paludisme. Glisse les w directement sur le dessin.",
  but:"Chaque génération : les génotypes naissent en proportions de Hardy-Weinberg, une partie meurt selon sa valeur sélective w (glisse les barres w sur le dessin), les survivants donnent les gamètes. Défi : avec w(Aa) = 1 et w(aa) = 0,2, trouve w(AA) pour que l'allèle a (HbS) se stabilise à q̂ = 0,10.",
  aRetenir:"Valeur sélective (fitness) w : survie et reproduction relatives. q' = (pq·w<sub>Aa</sub> + q²·w<sub>aa</sub>) / w̄ avec w̄ = p²w<sub>AA</sub> + 2pq·w<sub>Aa</sub> + q²w<sub>aa</sub>. Si w<sub>Aa</sub> dépasse les deux homozygotes, un équilibre stable polymorphe existe : q̂ = (w<sub>Aa</sub> − w<sub>AA</sub>) / (2w<sub>Aa</sub> − w<sub>AA</sub> − w<sub>aa</sub>) = s/(s + t) avec s = 1 − w<sub>AA</sub>, t = 1 − w<sub>aa</sub>. Drépanocytose : l'hétérozygote HbAS est protégé du paludisme grave, l'homozygote SS est très défavorisé : l'allèle S se maintient dans les régions impaludées.",
  piege:"Contre un allèle récessif létal (w<sub>aa</sub> = 0), la fréquence de a diminue lentement quand a est rare (les hétérozygotes l'abritent) : q<sub>t</sub> = q₀ / (1 + t·q₀). Les valeurs de w de la drépanocytose sont des ordres de grandeur pédagogiques, variables selon l'environnement. Modèle déterministe (population infinie, panmixie).",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(560), wA, wH, wa, g = 0, u = 0, playing = true, tr = [], key = "", geo = null, drag = null, bPlay;
    touch(c);
    var pre = k.select("Situation type", [["c","Personnalisée"],["s","Drépanocytose en zone impaludée (HbA = A, HbS = a)"],["l","Contre un allèle récessif létal"],["d","Avantage de l'allèle dominant A"],["n","Neutre"]], "s", function(v){
      var P = {s:[0.85,1,0.2], l:[1,1,0], d:[1,1,0.7], n:[1,1,1]}[v];
      if (P){ wA.set(P[0]); wH.set(P[1]); wa.set(P[2]); }
    });
    wA = k.slider("w(AA)", 0, 1, 0.01, 0.85, "");
    wH = k.slider("w(Aa)", 0, 1, 0.01, 1, "");
    wa = k.slider("w(aa)", 0, 1, 0.01, 0.2, "");
    var q0 = k.slider("q₀ (fréquence initiale de a)", 0.01, 0.99, 0.01, 0.02, "");
    var gens = k.slider("Générations", 10, 200, 10, 60, "");
    var vit = k.seg("Animation", [["l","Lente (une génération à la fois)"],["r","Rapide"]], "l");
    bPlay = k.button("▶ Lancer", function(){ if (g >= gens.value){ g = 0; } playing = !playing; u = 0; }, true);
    k.button("↺ Génération 0", function(){ g = 0; u = 1; playing = false; });
    var ro = k.readouts(["Génération", "q = fréquence de a", "q̂ d'équilibre", "w̄", "Régime"]);
    var note = k.note("", "");
    function W3(){ return [wA.value, wH.value, wa.value]; }
    function step(q){ var p = 1 - q, w = W3(), wb = p * p * w[0] + 2 * p * q * w[1] + q * q * w[2]; return wb > 0 ? (p * q * w[1] + q * q * w[2]) / wb : q; }
    function traj(){ tr = [q0.value]; for (var i = 0; i < gens.value; i++) tr.push(step(tr[i])); }
    function check(){ var kk = [W3().join(","), q0.value, gens.value].join("|"); if (kk !== key){ key = kk; traj(); if (g > gens.value) g = gens.value; } }
    function setW(i, v){ v = Math.max(0, Math.min(1, Math.round(v * 100) / 100)); [wA, wH, wa][i].set(v); pre.set("c"); }
    c.pointer(function(t, p){
      if (!geo) return;
      if (t === "down"){ drag = null;
        for (var i = 0; i < 3; i++){ var b = geo.bars[i]; if (p.x > b.x - 10 && p.x < b.x + b.w + 10 && Math.abs(p.y - b.y) < 16) drag = {k:"w", i:i}; }
        if (!drag && geo.ax && p.y > geo.ax.T - 8){ drag = Math.abs(p.x - geo.ax.X(0)) < 22 ? {k:"q0"} : {k:"t"}; }
      }
      if ((t === "down" || t === "drag") && drag){
        if (drag.k === "w"){ var bb = geo.bars[drag.i]; setW(drag.i, (p.x - bb.x) / bb.w); }
        else if (drag.k === "q0"){ q0.set(Math.max(0.01, Math.min(0.99, Math.round(geo.ax.iy(p.y) * 100) / 100))); g = 0; u = 1; playing = false; }
        else { g = Math.max(0, Math.min(gens.value, Math.round(geo.ax.ix(p.x)))); u = 1; playing = false; }
        k.redraw();
      }
      if (t === "up") drag = null;
    });
    function rbc(x, y, r, kind){ var ctx = c.ctx; ctx.save();
      if (kind === 2){ ctx.translate(x, y); ctx.rotate(-0.5); ctx.beginPath(); ctx.moveTo(-r * 1.1, 0); ctx.quadraticCurveTo(0, -r * 1.25, r * 1.1, 0); ctx.quadraticCurveTo(0, -r * 0.35, -r * 1.1, 0); ctx.closePath(); ctx.fillStyle = "#b8323d"; ctx.fill(); ctx.strokeStyle = "#7a1d26"; ctx.lineWidth = 1; ctx.stroke(); }
      else { var gr = ctx.createRadialGradient(x, y, r * .1, x, y, r); gr.addColorStop(0, "#f2a7ab"); gr.addColorStop(.5, "#d94a52"); gr.addColorStop(1, "#a8313a"); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, PI2); ctx.fill(); ctx.strokeStyle = "#7a1d26"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore(); }
    function mosquito(x, y){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = "#3b3f46"; ctx.fillStyle = "#3b3f46"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 7, 2.2, -0.3, 0, PI2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 7, y + 2); ctx.lineTo(x - 13, y + 5); ctx.moveTo(x - 2, y); ctx.lineTo(x - 5, y + 8); ctx.moveTo(x + 2, y - 1); ctx.lineTo(x + 2, y + 8); ctx.moveTo(x + 5, y - 2); ctx.lineTo(x + 9, y + 6); ctx.stroke();
      ctx.fillStyle = "rgba(160,190,230,.6)"; ctx.beginPath(); ctx.ellipse(x - 1, y - 5, 5, 2.5, -0.9, 0, PI2); ctx.fill(); ctx.restore(); }
    function render(){
      var ctx = c.ctx, W = c.W, H = c.H, i, w = W3(), dr = pre.value === "s";
      c.clear();
      var q = tr[g], p = 1 - q, fb = [p * p, 2 * p * q, q * q], wb = fb[0] * w[0] + fb[1] * w[1] + fb[2] * w[2], qn = g < gens.value ? tr[g + 1] : step(q);
      var e = Math.max(0, Math.min(1, u)), ph1 = Math.min(1, e / 0.35), ph2 = Math.max(0, Math.min(1, (e - 0.35) / 0.35)), ph3 = Math.max(0, Math.min(1, (e - 0.7) / 0.3));
      var phase = e < 0.35 ? "1. naissances (p², 2pq, q²)" : e < 0.7 ? "2. sélection : survie ∝ w" : "3. survivants → gamètes : nouveau q";
      S.draw.text(c, "Génération " + g + " · " + phase, 6, 12, {size:11.5, align:"left", color:pal.ink});
      /* pool de gamètes */
      var qq = q + (qn - q) * ph3, px = W - 22, py = 40;
      ctx.save(); ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, 15, -Math.PI / 2, -Math.PI / 2 + PI2 * (1 - qq)); ctx.closePath(); ctx.fillStyle = CA; ctx.fill();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, 15, -Math.PI / 2 + PI2 * (1 - qq), -Math.PI / 2 + PI2); ctx.closePath(); ctx.fillStyle = Ca; ctx.fill(); ctx.restore();
      S.draw.text(c, "gamètes", px - 4, py + 24, {size:9.5, color:pal.grey}); S.draw.text(c, "q = " + S.fmt(qq, 3), W - 4, py + 38, {size:10, align:"right", color:"#a8740c"});
      var colW = (W - 70) / 3, nm = ["AA", "Aa", "aa"], sub = dr ? ["HbA/HbA", "HbA/HbS", "HbS/HbS"] : ["", "", ""], cause = dr ? ["paludisme", "", "anémie falciforme"] : ["", "", ""], base = 250, hmax = 130, bars = [];
      for (i = 0; i < 3; i++){
        var x0 = 6 + i * colW, cx = x0 + colW / 2;
        /* en-tête */
        if (dr){ if (i === 0) rbc(x0 + 12, 36, 8, 0); else if (i === 1){ rbc(x0 + 8, 36, 7, 0); rbc(x0 + 20, 38, 7, 2); } else rbc(x0 + 12, 37, 8, 2); }
        else ind(c, x0 + 12, 36, 8, i < 2 ? 1 : 0, i === 0 ? 1 : 0);
        S.draw.text(c, nm[i], x0 + 30, 31, {size:13, align:"left", math:true});
        if (sub[i]) S.draw.text(c, sub[i], x0 + 30, 45, {size:9, align:"left", color:pal.grey, weight:600});
        /* barre de valeur sélective (manipulable) */
        var bx = x0 + 8, bw = colW - 20, by = 72;
        S.draw.text(c, "w = " + S.fmt(w[i], 2), bx, by - 11, {size:10.5, align:"left", color:pal.green});
        ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, bx, by - 4, bw, 8, 4); ctx.fill(); ctx.fillStyle = pal.green; S.draw.rrect(c, bx, by - 4, Math.max(8, bw * w[i]), 8, 4); ctx.fill();
        S.draw.dot(c, bx + bw * w[i], by, 6.5, pal.green);
        bars.push({x:bx, w:bw, y:by});
        /* population : naissances puis survivants */
        var hb = fb[i] * hmax * ph1, hs = hb * w[i], bwid = Math.min(46, colW * 0.5), lx = cx - bwid / 2;
        ctx.fillStyle = i === 0 ? "#cfe0f8" : i === 1 ? "#e6dcf4" : "#f8e3b8"; ctx.fillRect(lx, base - hb, bwid, hb);
        if (ph2 > 0 && hb > 0){
          var dead = (hb - hs) * ph2;
          ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = "#fff"; ctx.fillRect(lx, base - hb, bwid, dead); ctx.strokeStyle = "rgba(192,50,29,.55)"; ctx.lineWidth = 1;
          for (var hh = 0; hh < dead; hh += 5){ ctx.beginPath(); ctx.moveTo(lx, base - hb + hh); ctx.lineTo(lx + bwid, base - hb + hh + 5); ctx.stroke(); } ctx.restore();
          if (dead > 3){ ctx.strokeStyle = pal.red; ctx.lineWidth = 1.2; ctx.strokeRect(lx, base - hb, bwid, dead); }
          if (cause[i] && w[i] < 0.99 && ph2 > 0.3){ if (i === 0) mosquito(lx + bwid + 10, base - hb - 4); S.draw.text(c, cause[i], cx, base - hb - 18, {size:9.5, color:pal.red}); }
        }
        ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = 1; ctx.strokeRect(lx, base - hb, bwid, hb);
        S.draw.text(c, S.fmt(fb[i] * 100, fb[i] < 0.1 ? 1 : 0) + " %", cx, base + 12, {size:10.5, color:pal.ink});
        if (ph2 > 0.5) S.draw.text(c, "survivants " + S.fmt(fb[i] * w[i] * 100, fb[i] * w[i] < 0.1 ? 1 : 0) + " %", cx, base + 25, {size:9.5, color:pal.green, weight:600});
      }
      S.draw.line(c, 6, base, W - 64, base, "#a3adba", 1);
      geo = {bars:bars, ax:null};
      /* graphique q(t) */
      var top = 286, ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:gens.value, y0:0, y1:1, xl:"générations", yl:"q (fréquence de a)", stepY:0.25, pt:18});
      geo.ax = ax;
      var den = 2 * w[1] - w[0] - w[2], qh = NaN, regime;
      if (w[1] > w[0] && w[1] > w[2]){ qh = (w[1] - w[0]) / den; regime = "Avantage de l'hétérozygote : polymorphisme stable"; }
      else if (w[1] < w[0] && w[1] < w[2]){ qh = (w[1] - w[0]) / den; regime = "Désavantage de l'hétérozygote : équilibre instable"; }
      else if (w[0] === w[1] && w[1] === w[2]) regime = "Neutre : q ne change pas";
      else regime = w[2] > w[0] ? "Directionnelle : a tend à se fixer" : "Directionnelle : a tend à disparaître";
      if (!isNaN(qh) && qh >= 0 && qh <= 1){ S.draw.line(c, ax.L, ax.Y(qh), ax.R, ax.Y(qh), pal.red, 1.5, [5, 4]); S.draw.text(c, "q̂ = " + S.fmt(qh, 3), ax.R - 4, ax.Y(qh) - 9, {size:10.5, color:pal.red, align:"right", halo:true}); }
      clip(c, ax);
      var all = tr.map(function(v, j){ return [ax.X(j), ax.Y(v)]; }); poly(c, all, pal.acc, 1.6, [3, 4], 0.45);
      poly(c, all.slice(0, g + 1), pal.acc, 3);
      c.ctx.restore();
      S.draw.dot(c, ax.X(g), ax.Y(q), 6, pal.acc);
      S.draw.dot(c, ax.X(0), ax.Y(q0.value), 5, pal.ink); S.draw.text(c, "q₀ ↕", ax.X(0) + 8, ax.Y(q0.value) - 11, {size:10, align:"left", color:pal.ink, halo:true});
      ro.set(0, g + " / " + gens.value); ro.set(1, S.fmt(q, 3) + " (p = " + S.fmt(p, 3) + ")"); ro.set(2, isNaN(qh) ? "—" : S.fmt(qh, 3)); ro.set(3, S.fmt(wb, 3)); ro.set(4, regime);
      playLabel(bPlay, playing);
      var ok = !isNaN(qh) && w[1] > w[0] && w[1] > w[2] && Math.abs(qh - 0.1) <= 0.005;
      note.set(ok ? "✓ <b>Défi réussi</b> : q̂ = " + S.fmt(qh, 3) + ". Avec t = 1 − w(aa) = " + S.fmt(1 - w[2], 2) + ", il suffit d'un désavantage s = 1 − w(AA) = " + S.fmt(1 - w[0], 2) + " des homozygotes AA (paludisme) pour maintenir HbS à 10 % : q̂ = s/(s + t)."
        : "◎ <b>Défi</b> : avec w(Aa) = 1 et w(aa) = 0,2, trouve w(AA) pour que l'allèle a se stabilise à q̂ = 0,10 (± 0,005). Glisse les barres w sur le dessin ; q̂ actuel : " + (isNaN(qh) ? "pas d'équilibre polymorphe" : S.fmt(qh, 3)) + ".", ok ? "ok" : "");
    }
    k.draw(function(){ check(); render(); });
    var lp = k.loop(function(dt){
      if (playing){ if (vit.value === "r"){ u = 1; g = Math.min(gens.value, g + 1); if (g >= gens.value) playing = false; }
        else { u += dt / 1.8; if (u >= 1){ if (g < gens.value){ g++; u = 0; } else { u = 1; playing = false; } } } }
      render();
    }); lp.play();
  }
});

/* 4. Croissance de population */
SFA.sim({
  id:"ub-c10-logistique", ch:"c10", tag:"Écologie",
  titre:"Croissance exponentielle et logistique ; instabilité du modèle discret",
  resume:"Une boîte de Petri qui se remplit : divisions, ressources qui s'épuisent, capacité de charge K, point d'inflexion ; cycles et chaos du modèle de Ricker.",
  but:"Lance le temps : les cellules se divisent dans la boîte et la gélose s'épuise. Glisse la droite K ou le point N₀ sur le graphique, ou glisse le long du temps. Défi (continu) : trouve r pour que N atteigne K/2 à t = 10. Défi (discret) : trouve le plus petit r qui fait osciller la population.",
  aRetenir:"Exponentielle : dN/dt = rN. Logistique : dN/dt = rN(1 − N/K), N(t) = K / (1 + ((K − N₀)/N₀)·e<sup>−rt</sup>). Vitesse maximale rK/4 pour N = K/2 (point d'inflexion), atteint à t = ln((K − N₀)/N₀)/r. Modèle discret de Ricker N<sub>t+1</sub> = N<sub>t</sub>·e<sup>r(1−N<sub>t</sub>/K)</sup> : équilibre stable si r &lt; 2, cycles de période 2 puis 4 au-delà, comportement chaotique vers r ≈ 2,7.",
  piege:"K n'est pas un maximum « absolu » : c'est l'équilibre dépendant des ressources. Le taux de croissance par individu diminue avec la densité (rétroaction négative) ; la population totale accélère puis ralentit. Dans le modèle discret, un grand r déstabilise : la population dépasse K puis s'effondre. Le dessin est schématique (un point représente plusieurs individus).",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(560), t = 0, playing = true, cells = [], clock = 0, rs = rng(99), geo = null, drag = null, bPlay, key = "";
    touch(c);
    var mode = k.seg("Modèle", [["c","Continu (logistique)"],["d","Discret (Ricker)"]], "c");
    var r = k.slider("Taux de croissance r", 0.1, 3, 0.05, 0.5, "");
    var K = k.slider("Capacité de charge K", 100, 1000, 50, 500, "");
    var n0 = k.slider("Effectif initial N₀", 1, 200, 1, 10, "");
    var T = k.slider("Durée", 20, 100, 10, 40, "");
    bPlay = k.button("▶ Lancer", function(){ if (t >= T.value) t = 0; playing = !playing; }, true);
    k.button("↺ t = 0", function(){ t = 0; playing = false; });
    var ro = k.readouts(["Temps t", "N(t)", "Vitesse max rK/4", "N = K/2 atteint à", "Comportement"]);
    var note = k.note("", "");
    function N0(){ return Math.min(n0.value, K.value * 1.5); }
    function Nc(x){ var a = N0(); return K.value / (1 + (K.value - a) / a * Math.exp(-r.value * x)); }
    function seqD(n){ var a = [N0()]; for (var i = 1; i <= n; i++){ var v = a[i - 1]; a.push(v * Math.exp(r.value * (1 - v / K.value))); } return a; }
    function Nnow(){ return mode.value === "c" ? Nc(t) : seqD(Math.floor(t))[Math.floor(t)]; }
    c.pointer(function(tp, p){
      if (!geo) return;
      var ax = geo.ax;
      if (tp === "down"){
        drag = null;
        if (p.y > ax.T - 10){
          if (Math.hypot(p.x - ax.X(0), p.y - ax.Y(N0())) < 16) drag = "n0";
          else if (Math.abs(p.y - ax.Y(K.value)) < 10 && p.x > ax.L + 20) drag = "K";
          else drag = "t";
        } else if (Math.hypot(p.x - geo.cx, p.y - geo.cy) < geo.R){ if (t >= T.value) t = 0; playing = !playing; }
      }
      if ((tp === "down" || tp === "drag") && drag){
        if (drag === "n0"){ n0.set(Math.max(1, Math.min(200, Math.round(ax.iy(p.y))))); t = 0; }
        else if (drag === "K"){ K.set(Math.max(100, Math.min(1000, Math.round(ax.iy(p.y) / 50) * 50))); }
        else { t = Math.max(0, Math.min(T.value, ax.ix(p.x))); if (mode.value === "d") t = Math.round(t); playing = false; }
        k.redraw();
      }
      if (tp === "up") drag = null;
    });
    function syncCells(N, dt){
      var scale = K.value / 120, target = Math.min(420, Math.round(N / scale)), alive = cells.filter(function(z){ return z.die == null; });
      var R = geo.R - 7;
      function inside(x, y){ return Math.hypot(x - geo.cx, y - geo.cy) < R; }
      var add = target - alive.length;
      for (var i = 0; i < add; i++){
        var par = alive.length ? alive[Math.floor(rs() * alive.length)] : null, x, y, tries = 0;
        if (par && rs() < 0.45) par = null;
        do { var a = rs() * PI2, d = par ? 7 + rs() * 12 : Math.sqrt(rs()) * R; x = (par ? par.x : geo.cx) + Math.cos(a) * d; y = (par ? par.y : geo.cy) + Math.sin(a) * d; tries++; } while (!inside(x, y) && tries < 12);
        if (!inside(x, y)){ var a2 = rs() * PI2, d2 = Math.sqrt(rs()) * R; x = geo.cx + Math.cos(a2) * d2; y = geo.cy + Math.sin(a2) * d2; }
        var z = {x:x, y:y, fx:par ? par.x : x, fy:par ? par.y : y, b:clock}; cells.push(z); alive.push(z);
      }
      for (i = 0; i < -add; i++){ var j = Math.floor(rs() * alive.length); alive[j].die = clock; alive.splice(j, 1); }
      cells = cells.filter(function(z){ return z.die == null || clock - z.die < 0.5; });
    }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, i, disc = mode.value === "d", N = Nnow(), Kv = K.value;
      clock += dt || 0;
      c.clear();
      var kk = [mode.value, r.value, Kv, n0.value].join("|"); if (kk !== key){ key = kk; cells = []; rs = rng(99); }
      /* ---- boîte de Petri ---- */
      var top = 236, Rd = Math.max(70, Math.min(100, W * 0.27)), cx = Rd + 10, cy = 20 + Rd + 6;
      geo = {cx:cx, cy:cy, R:Rd, ax:null};
      S.draw.text(c, disc ? "Générations successives (Ricker)" : "Culture en boîte de Petri", 6, 12, {size:11.5, align:"left", color:pal.ink});
      var dep = Math.max(0, Math.min(1, N / Kv)), g1 = ctx.createRadialGradient(cx - Rd * .3, cy - Rd * .3, 4, cx, cy, Rd);
      var rich = [246, 226, 168], poor = [214, 210, 198], mix = function(j){ return Math.round(rich[j] + (poor[j] - rich[j]) * dep); };
      g1.addColorStop(0, "rgb(" + Math.min(255, mix(0) + 8) + "," + Math.min(255, mix(1) + 10) + "," + Math.min(255, mix(2) + 14) + ")"); g1.addColorStop(1, "rgb(" + mix(0) + "," + mix(1) + "," + mix(2) + ")");
      ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(cx, cy, Rd, 0, PI2); ctx.fill();
      ctx.strokeStyle = "#9fb0c4"; ctx.lineWidth = 4; ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, Rd - 4, -2.6, -1.2); ctx.stroke();
      syncCells(N, dt || 0);
      cells.forEach(function(z){ var a = Math.min(1, (clock - z.b) / 0.35), al = z.die != null ? Math.max(0, 1 - (clock - z.die) / 0.5) : 1, x = z.fx + (z.x - z.fx) * a, y = z.fy + (z.y - z.fy) * a;
        ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = z.die != null ? "#9a9a9a" : "#6b8e23"; ctx.beginPath(); ctx.ellipse(x, y, 4.2, 3, (z.x * 7) % 3, 0, PI2); ctx.fill(); ctx.strokeStyle = "rgba(60,90,20,.6)"; ctx.lineWidth = 0.8; ctx.stroke();
        if (a < 1){ ctx.strokeStyle = "rgba(107,142,35,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(z.fx, z.fy); ctx.lineTo(x, y); ctx.stroke(); } ctx.restore(); });
      S.draw.text(c, "N ≈ " + S.fmt(N, 0) + " · 1 point ≈ " + S.fmt(Kv / 120, 1) + " ind.", cx, cy + Rd + 12, {size:10, color:pal.grey});
      S.draw.label(c, "ressources : " + (dep < 0.3 ? "abondantes" : dep < 0.85 ? "en baisse" : "limitantes"), cx, cy - Rd + 18, {size:9.5, color:dep < 0.85 ? "#8a6d1c" : pal.red, fill:"rgba(255,255,255,.9)"});
      /* ---- petit graphique à droite : dN/dt = f(N) ou carte de retour ---- */
      var rx = cx + Rd + 14, rw = W - rx - 4;
      if (rw > 110){
        if (!disc){
          var a2 = axIn(S, c, {x:rx, y:6, w:rw, h:top - 6}, {x0:0, x1:Kv * 1.1, y0:0, y1:r.value * Kv / 4 * 1.25, xl:"N", yl:"dN/dt", pl:38, pt:16, pb:30});
          S.draw.fn(c, a2, function(x){ return r.value * x * (1 - x / Kv); }, pal.green, 2.2);
          S.draw.line(c, a2.X(Kv / 2), a2.T, a2.X(Kv / 2), a2.B, pal.grey, 1, [3, 3]); S.draw.text(c, "K/2", a2.X(Kv / 2), a2.B - 8, {size:9.5, color:pal.grey, halo:true});
          S.draw.dot(c, a2.X(Math.min(N, Kv * 1.1)), a2.Y(Math.max(0, r.value * N * (1 - N / Kv))), 5.5, pal.red);
        } else {
          var sq = seqD(Math.max(1, Math.floor(t))), mxv = Math.max(Kv * 2, Math.max.apply(null, sq) * 1.05), a3 = axIn(S, c, {x:rx, y:6, w:rw, h:top - 6}, {x0:0, x1:mxv, y0:0, y1:mxv, xl:"Nₜ", yl:"Nₜ₊₁", pl:38, pt:16, pb:30});
          S.draw.fn(c, a3, function(x){ return x; }, pal.grey, 1, [3, 3]);
          S.draw.fn(c, a3, function(x){ return x * Math.exp(r.value * (1 - x / Kv)); }, pal.green, 2.2);
          clip(c, a3); var pts = [[a3.X(sq[0]), a3.Y(0)]];
          for (i = 0; i < Math.floor(t) && i + 1 < sq.length; i++){ pts.push([a3.X(sq[i]), a3.Y(sq[i + 1])]); pts.push([a3.X(sq[i + 1]), a3.Y(sq[i + 1])]); }
          poly(c, pts, pal.red, 1.4); ctx.restore();
          S.draw.text(c, "toile d'araignée", a3.R - 4, a3.T + 6, {size:9.5, align:"right", color:pal.red, halo:true});
        }
      }
      /* ---- N(t) ---- */
      var ymax = Math.max(Kv * 1.6, 200, n0.value * 1.1, disc && r.value > 1 ? Kv * Math.exp(r.value - 1) / r.value * 1.1 : 0);
      var ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:T.value, y0:0, y1:ymax, xl:"t", yl:"N", stepX:T.value > 50 ? 20 : 10, pt:18});
      geo.ax = ax;
      S.draw.line(c, ax.L, ax.Y(Kv), ax.R, ax.Y(Kv), pal.grey, 1.8, [6, 4]); S.draw.label(c, "K = " + Kv + " ↕", ax.R - 4, ax.Y(Kv) - 11, {align:"right", size:10, color:pal.grey});
      var beh = "", tinf = NaN, a0 = N0();
      if (!disc){
        S.draw.fn(c, ax, function(x){ return a0 * Math.exp(r.value * x); }, pal.red, 1.6, [4, 4]);
        S.draw.fn(c, ax, function(x){ return x <= t ? NaN : Nc(x); }, pal.acc, 1.6, [2, 4]);
        S.draw.fn(c, ax, function(x){ return x <= t + 1e-9 ? Nc(x) : NaN; }, pal.acc, 3);
        S.draw.text(c, "exponentielle", ax.X(Math.min(T.value * 0.25, Math.log(ymax * 0.8 / a0) / r.value)), ax.Y(ymax * 0.82), {size:10, color:pal.red, halo:true});
        if (a0 < Kv / 2){ tinf = Math.log((Kv - a0) / a0) / r.value; if (tinf <= T.value){ S.draw.line(c, ax.X(tinf), ax.Y(Kv / 2), ax.X(tinf), ax.B, pal.green, 1.2, [3, 3]); S.draw.dot(c, ax.X(tinf), ax.Y(Kv / 2), 4.5, pal.green); S.draw.text(c, "K/2 à t = " + S.fmt(tinf, 1), ax.X(tinf) + 6, ax.Y(Kv / 2) + 12, {size:10, align:"left", color:pal.green, halo:true}); } }
        beh = "Convergence vers K";
      } else {
        var sd = seqD(T.value); clip(c, ax);
        poly(c, sd.map(function(v, j){ return [ax.X(j), ax.Y(v)]; }), pal.acc, 1.2, [2, 3], 0.6);
        sd.forEach(function(v, j){ if (j <= t){ S.draw.line(c, ax.X(j), ax.B, ax.X(j), ax.Y(v), "rgba(31,75,158,.25)", 1); S.draw.dot(c, ax.X(j), ax.Y(v), 3, pal.acc); } });
        ctx.restore();
        beh = r.value <= 2 ? "Équilibre stable" : r.value < 2.52 ? "Cycle de période 2" : r.value < 2.69 ? "Cycles de période ≥ 4" : "Chaotique";
      }
      S.draw.line(c, ax.X(t), ax.T, ax.X(t), ax.B, pal.ink, 1, [4, 3]);
      S.draw.dot(c, ax.X(t), ax.Y(Math.min(N, ymax)), 6, pal.acc);
      S.draw.dot(c, ax.X(0), ax.Y(a0), 5.5, pal.ink); S.draw.text(c, "N₀ ↕", ax.X(0) + 9, ax.Y(a0) - 11, {size:10, align:"left", halo:true});
      ro.set(0, S.fmt(t, disc ? 0 : 1)); ro.set(1, S.fmt(N, 0));
      ro.set(2, disc ? "— (continu)" : S.fmt(r.value * Kv / 4, 1) + " ind./unité"); ro.set(3, disc ? "— (continu)" : a0 < Kv / 2 ? "t = " + S.fmt(tinf, 1) : "déjà dépassé"); ro.set(4, beh);
      playLabel(bPlay, playing);
      var ok, msg;
      if (!disc){ ok = !isNaN(tinf) && Math.abs(tinf - 10) <= 0.5;
        msg = ok ? "✓ <b>Défi réussi</b> : N = K/2 à t = " + S.fmt(tinf, 2) + ". C'est le point d'inflexion : la croissance y est la plus rapide (rK/4 = " + S.fmt(r.value * Kv / 4, 1) + " ind./unité de temps), visible au sommet de la parabole dN/dt."
          : "◎ <b>Défi</b> : trouve r pour que la population atteigne K/2 à t = 10 (± 0,5). Indice : t = ln((K − N₀)/N₀)/r. Actuellement : " + (isNaN(tinf) ? "N₀ ≥ K/2" : "t = " + S.fmt(tinf, 2)) + "."; }
      else { ok = r.value > 2 && r.value <= 2.05 + 1e-9;
        msg = ok ? "✓ <b>Défi réussi</b> : dès r &gt; 2, l'équilibre K devient instable : la population oscille entre deux valeurs (cycle de période 2), visible dans la toile d'araignée."
          : "◎ <b>Défi</b> : en mode discret, trouve la plus petite valeur de r (pas de 0,05) pour laquelle la population ne se stabilise plus mais oscille. Lance le temps et regarde la toile d'araignée."; }
      note.set(msg, ok ? "ok" : "");
    }
    k.draw(function(){ if (t > T.value) t = T.value; render(0); });
    var lp = k.loop(function(dt){
      if (playing){ t += dt * (mode.value === "d" ? 2.2 : T.value / 8); if (t >= T.value){ t = T.value; playing = false; } }
      render(dt);
    }); lp.play();
  }
});

/* 5. Lotka-Volterra */
SFA.sim({
  id:"ub-c10-lotka-volterra", ch:"c10", tag:"Dynamique",
  titre:"Proies et prédateurs : oscillations de Lotka-Volterra",
  resume:"Un pré où lapins et renards se succèdent : séries temporelles, portrait de phase, équilibre et capacité de charge des proies.",
  but:"Regarde le pré : lapins et renards suivent les oscillations calculées. Glisse le point de départ dans le portrait de phase (droite ou bas). Défi : place-le pour que les proies ne s'écartent jamais de plus de 10 % de leur équilibre x*.",
  aRetenir:"dx/dt = αx − βxy (proies x), dy/dt = δxy − γy (prédateurs y). Équilibre : x* = γ/δ, y* = α/β. Autour de l'équilibre, la période est ≈ 2π/√(αγ). Le pic des prédateurs suit celui des proies (décalage ≈ 1/4 de période). Avec une capacité de charge K pour les proies, les oscillations s'amortissent vers l'équilibre.",
  piege:"Les oscillations de la version de base sont neutres (l'amplitude dépend des conditions de départ) : modèle idéal, sans capacité de charge ni refuge ni stochasticité. Dans une vraie population, de petits effectifs mènent à l'extinction. Les prédateurs ne « causent » pas seuls les cycles : le modèle montre une rétroaction négative couplée. Les animaux dessinés sont proportionnels aux effectifs calculés (un dessin = plusieurs individus).",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(600), T = 60, DT = 0.1, X = [], Y = [], ti = 0, playing = true, key = "", geo = null, drag = false, bounds = null, rab = [], fox = [], rs = rng(11), bPlay;
    touch(c);
    var al = k.slider("α (croissance des proies)", 0.2, 1.2, 0.05, 0.6, "");
    var be = k.slider("β (prédation)", 0.01, 0.05, 0.005, 0.025, "");
    var ga = k.slider("γ (mortalité des prédateurs)", 0.2, 1, 0.05, 0.5, "");
    var de = k.slider("δ (conversion)", 0.005, 0.02, 0.001, 0.01, "");
    var x0 = k.slider("Proies initiales", 10, 100, 1, 40, "");
    var y0 = k.slider("Prédateurs initiaux", 5, 60, 1, 15, "");
    var kk = k.toggle("Proies : capacité de charge K", false);
    var Ks = k.slider("K", 60, 400, 10, 150, "");
    bPlay = k.button("⏸ Pause", function(){ if (ti >= X.length - 1) ti = 0; playing = !playing; }, true);
    k.button("↺ t = 0", function(){ ti = 0; });
    var ro = k.readouts(["Temps t", "Proies · prédateurs", "Équilibre x*, y*", "Période ≈ 2π/√(αγ)"]), nt = k.note("", "");
    function integ(){
      var dt = 0.02, steps = T / dt, x = x0.value, y = y0.value, i, useK = kk.value, K = Ks.value;
      function f(x, y){ return [al.value * x * (useK ? (1 - x / K) : 1) - be.value * x * y, de.value * x * y - ga.value * y]; }
      X = [x]; Y = [y];
      for (i = 0; i < steps; i++){
        var a = f(x, y), b = f(x + dt / 2 * a[0], y + dt / 2 * a[1]), cc = f(x + dt / 2 * b[0], y + dt / 2 * b[1]), d = f(x + dt * cc[0], y + dt * cc[1]);
        x += dt / 6 * (a[0] + 2 * b[0] + 2 * cc[0] + d[0]); y += dt / 6 * (a[1] + 2 * b[1] + 2 * cc[1] + d[1]); x = Math.max(x, 1e-6); y = Math.max(y, 1e-6);
        if (i % 5 === 4){ X.push(x); Y.push(y); }
      }
    }
    function check(){ var kq = [al.value, be.value, ga.value, de.value, x0.value, y0.value, kk.value, Ks.value].join("|"); if (kq !== key){ key = kq; integ(); if (!drag){ bounds = null; ti = 0; } } }
    c.pointer(function(t, p){
      if (!geo) return;
      var a = geo.ph;
      if (t === "down"){ drag = p.x > a.L - 10 && p.x < a.R + 10 && p.y > a.T - 10 && p.y < a.B + 10; if (!drag && p.y < geo.top){ playing = !playing; } else if (!drag && geo.ts && p.y > geo.ts.T && p.y < geo.ts.B){ ti = Math.max(0, Math.min(X.length - 1, Math.round(geo.ts.ix(p.x) / DT))); playing = false; } }
      if ((t === "down" || t === "drag") && drag){
        x0.set(Math.max(10, Math.min(100, Math.round(a.ix(p.x))))); y0.set(Math.max(5, Math.min(60, Math.round(a.iy(p.y))))); ti = 0; k.redraw();
      }
      if (t === "up" && drag){ drag = false; bounds = null; k.redraw(); }
    });
    function rabbit(x, y, s, al2, dir){ var ctx = c.ctx; ctx.save(); ctx.globalAlpha = al2; ctx.translate(x, y); ctx.scale(dir, 1);
      ctx.fillStyle = "#d9d2c5"; ctx.strokeStyle = "#8c8170"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.ellipse(0, 0, 6 * s, 4.3 * s, 0, 0, PI2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(5.5 * s, -2.5 * s, 2.8 * s, 0, PI2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(5 * s, -7 * s, 1 * s, 3.2 * s, -0.2, 0, PI2); ctx.ellipse(7 * s, -6.6 * s, 1 * s, 3 * s, 0.3, 0, PI2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-6 * s, -1 * s, 1.8 * s, 0, PI2); ctx.fill(); ctx.restore(); }
    function foxD(x, y, s, al2, dir){ var ctx = c.ctx; ctx.save(); ctx.globalAlpha = al2; ctx.translate(x, y); ctx.scale(dir, 1);
      ctx.fillStyle = "#d4691e"; ctx.strokeStyle = "#8a3f0d"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.ellipse(0, 0, 9 * s, 4.2 * s, 0, 0, PI2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8 * s, -1 * s); ctx.quadraticCurveTo(-17 * s, -6 * s, -18 * s, 2 * s); ctx.quadraticCurveTo(-13 * s, 2 * s, -8 * s, 2 * s); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-17 * s, 1 * s, 1.6 * s, 0, PI2); ctx.fill(); ctx.fillStyle = "#d4691e";
      ctx.beginPath(); ctx.moveTo(7 * s, -3 * s); ctx.lineTo(14 * s, -1 * s); ctx.lineTo(8 * s, 3 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8 * s, -3 * s); ctx.lineTo(9 * s, -8 * s); ctx.lineTo(11 * s, -2.5 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(14 * s, -1 * s, 0.9 * s, 0, PI2); ctx.fill(); ctx.restore(); }
    function herd(list, target, Wd, y1, y2, dt){
      var alive = list.filter(function(a){ return !a.d; });
      for (var i = alive.length; i < target; i++) list.push({x:10 + rs() * (Wd - 20), y:y1 + rs() * (y2 - y1), vx:(rs() - .5) * 20, vy:(rs() - .5) * 8, a:0, d:false});
      for (i = alive.length; i > target; i--){ var j = Math.floor(rs() * alive.length); alive[j].d = true; alive.splice(j, 1); }
      list.forEach(function(a){ a.a = a.d ? a.a - dt * 2 : Math.min(1, a.a + dt * 2); a.vx += (rs() - .5) * 30 * dt; a.vy += (rs() - .5) * 12 * dt; a.vx = Math.max(-16, Math.min(16, a.vx)); a.vy = Math.max(-6, Math.min(6, a.vy));
        a.x += a.vx * dt; a.y += a.vy * dt; if (a.x < 12 || a.x > Wd - 12) a.vx *= -1; if (a.y < y1 || a.y > y2) a.vy *= -1; a.x = Math.max(12, Math.min(Wd - 12, a.x)); a.y = Math.max(y1, Math.min(y2, a.y)); });
      return list.filter(function(a){ return !(a.d && a.a <= 0); });
    }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, x = X[ti], y = Y[ti], i;
      c.clear();
      var mx = Math.max.apply(null, X), my = Math.max.apply(null, Y);
      var xs = ga.value / de.value, ys = kk.value ? al.value * (1 - xs / Ks.value) / be.value : al.value / be.value;
      if (!bounds) bounds = {x:Math.max(mx, xs, 100) * 1.1, y:Math.max(my, ys, 60) * 1.1, top:Math.max(mx, my) * 1.1};
      /* ---- le pré ---- */
      var top = 170, gr = ctx.createLinearGradient(0, 0, 0, top); gr.addColorStop(0, "#dff0d0"); gr.addColorStop(1, "#b9d99b");
      ctx.fillStyle = gr; S.draw.rrect(c, 2, 2, W - 4, top - 10, 10); ctx.fill();
      ctx.strokeStyle = "rgba(70,120,40,.35)"; ctx.lineWidth = 1; for (i = 0; i < W; i += 9){ var hy = 30 + ((i * 37) % (top - 50)); ctx.beginPath(); ctx.moveTo(i, hy + 6); ctx.lineTo(i + 2, hy); ctx.stroke(); }
      var sR = Math.max(1, Math.ceil(bounds.x / 1.1 / 45)), sF = Math.max(1, Math.ceil(bounds.y / 1.1 / 18));
      rab = herd(rab, Math.round(x / sR), W, 34, top - 22, dt || 0); fox = herd(fox, Math.round(y / sF), W, 40, top - 26, dt || 0);
      rab.forEach(function(a){ rabbit(a.x, a.y, 1.25, Math.max(0, a.a), a.vx >= 0 ? 1 : -1); });
      fox.forEach(function(a){ foxD(a.x, a.y, 1.05, Math.max(0, a.a), a.vx >= 0 ? 1 : -1); });
      S.draw.label(c, "lapins " + S.fmt(x, 0) + " · renards " + S.fmt(y, 0), 10, 16, {align:"left", size:10.5, color:pal.ink, fill:"rgba(255,255,255,.88)"});
      S.draw.text(c, "1 lapin dessiné = " + sR + " · 1 renard = " + sF, W - 10, top - 18, {size:9.5, align:"right", color:"#3d5a2a", halo:"#cde5b6"});
      /* ---- graphiques ---- */
      var wide = W >= 500, rTS, rPH;
      if (wide){ rTS = {x:0, y:top, w:W * 0.56, h:H - top}; rPH = {x:W * 0.56, y:top, w:W * 0.44, h:H - top}; }
      else { var hh = (H - top) / 2; rTS = {x:0, y:top, w:W, h:hh}; rPH = {x:0, y:top + hh, w:W, h:hh}; }
      var ax = axIn(S, c, rTS, {x0:0, x1:T, y0:0, y1:bounds.top, xl:"t", yl:"effectifs", stepX:10, pt:16});
      clip(c, ax);
      poly(c, X.map(function(v, j){ return [ax.X(j * DT), ax.Y(v)]; }), pal.green, 2.2);
      poly(c, Y.map(function(v, j){ return [ax.X(j * DT), ax.Y(v)]; }), pal.red, 2.2);
      ctx.restore();
      S.draw.line(c, ax.X(ti * DT), ax.T, ax.X(ti * DT), ax.B, pal.ink, 1, [4, 3]);
      S.draw.dot(c, ax.X(ti * DT), ax.Y(x), 5, pal.green); S.draw.dot(c, ax.X(ti * DT), ax.Y(y), 5, pal.red);
      S.draw.legend(c, [[pal.green, "proies"], [pal.red, "prédateurs"]], ax.R - 2, ax.T, {align:"right"});
      var a2 = axIn(S, c, rPH, {x0:0, x1:bounds.x, y0:0, y1:bounds.y, xl:"proies", yl:"prédateurs", pt:16});
      clip(c, a2);
      poly(c, X.map(function(v, j){ return [a2.X(v), a2.Y(Y[j])]; }), pal.acc, 1.4, null, 0.45);
      poly(c, X.slice(0, ti + 1).map(function(v, j){ return [a2.X(v), a2.Y(Y[j])]; }), pal.acc, 2.4);
      ctx.restore();
      if (ys > 0){ S.draw.dot(c, a2.X(xs), a2.Y(ys), 5, pal.ink); S.draw.text(c, "équilibre", a2.X(xs) + 7, a2.Y(ys) + 11, {size:9.5, align:"left", halo:true}); }
      S.draw.dot(c, a2.X(x0.value), a2.Y(y0.value), 7, pal.amber); S.draw.text(c, "départ (glisse-moi)", a2.X(x0.value), a2.Y(y0.value) + 15, {size:10, color:"#8a4b07", halo:"#fff"});
      S.draw.dot(c, a2.X(x), a2.Y(y), 5, pal.acc);
      geo = {top:top, ph:a2, ts:ax};
      var mnX = Math.min.apply(null, X), mnY = Math.min.apply(null, Y), dev = Math.max(mx - xs, xs - mnX) / xs;
      ro.set(0, S.fmt(ti * DT, 1)); ro.set(1, S.fmt(x, 0) + " · " + S.fmt(y, 0)); ro.set(2, S.fmt(xs, 1) + " · " + (ys > 0 ? S.fmt(ys, 1) : "0 (K ≤ x*)")); ro.set(3, S.fmt(2 * Math.PI / Math.sqrt(al.value * ga.value), 1) + (kk.value ? " (sans K, indicatif)" : ""));
      playLabel(bPlay, playing);
      var ok = ys > 0 && dev <= 0.1, warn = mnX < 1 || mnY < 1;
      nt.set((ok ? "✓ <b>Défi réussi</b> : les proies restent à ± " + S.fmt(dev * 100, 0) + " % de x* = " + S.fmt(xs, 1) + ". Près de l'équilibre (x* = γ/δ, y* = α/β), les oscillations sont petites ; leur période tend vers 2π/√(αγ)."
        : "◎ <b>Défi</b> : glisse le point de départ (orange) dans le portrait de phase pour que les proies ne s'écartent jamais de plus de 10 % de x* = γ/δ = " + S.fmt(xs, 1) + ". Écart actuel : ± " + S.fmt(dev * 100, 0) + " %.")
        + (warn ? " Attention : un effectif descend sous 1 individu (" + (mnX < 1 ? "proies" : "prédateurs") + ") ; dans une vraie population, il y aurait extinction." : ""), ok ? "ok" : warn ? "warn" : "");
    }
    k.draw(function(){ check(); render(0); });
    var lp = k.loop(function(dt){ if (playing){ ti += Math.max(1, Math.round(dt / DT * 0.5 * 6)) ; if (ti >= X.length - 1){ ti = 0; } } render(dt); }); lp.play();
  }
});
})();

/* BIO3D-BEGIN:s_c10_selection.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c10-vis-selection-phalenes", ch:"c10", tag:"Sélection · animé",
  titre:"Sélection naturelle sur une population : les phalènes du bouleau",
  resume:"Des oiseaux mangent les phalènes les plus visibles : suis génération après génération la fréquence de l'allèle sombre, avec la dérive en prime.",
  but:"Règle la couleur de l'écorce (pollution), la pression de prédation et la taille de la population, puis lance les générations : compare la population simulée à la prédiction déterministe.",
  aRetenir:"Sélection naturelle : les génotypes dont les porteurs survivent mieux (valeur sélective w plus élevée) deviennent plus fréquents. Avec l'allèle sombre D dominant (DD et Dd sombres, dd clair), p' = p·w<sub>sombre</sub> / w̄ avec w̄ = (1 − q²)·w<sub>sombre</sub> + q²·w<sub>clair</sub>. Sur écorce claire, le clair est favorisé ; sur écorce noircie, le sombre. Dans une petite population, la dérive ajoute du hasard : la fréquence peut s'écarter de la prédiction, voire fixer un allèle.",
  piege:"La sélection n'a pas de but et les individus ne s'adaptent pas : ils survivent ou non, ce sont les fréquences alléliques de la population qui changent. L'environnement (couleur de l'écorce) fixe quel phénotype est avantagé, il ne « fabrique » pas la mutation. Et un allèle dominant n'est pas forcément le plus fréquent : seule la valeur sélective compte. Modèle simplifié : accouplement au hasard, générations discrètes, prédation selon le contraste avec l'écorce.",
  build:function(k,S){
    var c = k.canvas(470), pal = P(S);
    var bark = k.slider("Écorce (0 = claire, 100 = noircie)", 0, 100, 5, 20, "");
    var pre = k.slider("Pression de prédation", 10, 90, 5, 60, "%");
    var nn = k.slider("Taille de la population (individus)", 20, 200, 10, 60, "");
    var p0 = k.slider("Fréquence initiale de l'allèle sombre (D)", 0.05, 0.95, 0.05, 0.3, "");
    var auto = k.toggle("Enchaîner les générations", false);
    var ro = k.readouts(["Génération", "Fréquence p(D)", "Fitness sombres / clairs", "Phénotype sombre"]);
    var info = k.note("", "ok");
    var seed = 4;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var moths = [], hist = [], gen = 0, p = p0.value, phase = 0, tm = 0, birds = [], running = false, tt = 0, lastN = 0;
    function fit(){
      var b = bark.value / 100, s = pre.value / 100;
      var vd = Math.abs(0.12 - (0.9 - 0.8 * b)), vl = Math.abs(0.85 - (0.9 - 0.8 * b));   /* contraste avec l'écorce (ton 0 = noir, 1 = blanc) */
      return {wd:1 - s * vd / 0.9 * 1.0, wl:1 - s * vl / 0.9 * 1.0, vd:vd, vl:vl};
    }
    function spawn(){
      moths = [];
      var N = nn.value;
      for (var i = 0; i < N; i++){
        var g = (rnd() < p ? 1 : 0) + (rnd() < p ? 1 : 0);   /* nombre d'allèles D */
        moths.push({g:g, dark:g > 0, x:30 + rnd() * (c.W - 60), y:30 + rnd() * (c.H * 0.56 - 40), r:rnd() * 6.28, eaten:false, a:1, tgt:null});
      }
      lastN = N;
    }
    function reset(){ seed = 4; p = p0.value; gen = 0; hist = [p]; phase = 0; tm = 0; birds = []; running = false; spawn(); }
    function predict(from, n){
      var f = fit(), out = [from], q = from;
      for (var i = 0; i < n; i++){ var qq = 1 - q, wb = (1 - qq * qq) * f.wd + qq * qq * f.wl; q = q * f.wd / wb; out.push(q); }
      return out;
    }
    function R(){
      c.clear(); var ctx = c.ctx, H1 = Math.round(c.H * 0.6);
      var b = bark.value / 100, tone = Math.round(235 - 190 * b);
      /* écorce */
      ctx.fillStyle = "rgb(" + tone + "," + tone + "," + Math.round(tone * 0.95) + ")"; ctx.fillRect(0, 0, c.W, H1);
      ctx.strokeStyle = "rgba(0,0,0,0.13)"; ctx.lineWidth = 2;
      for (var x = 8; x < c.W; x += 26){ ctx.beginPath(); ctx.moveTo(x, 0); for (var y = 0; y <= H1; y += 16) ctx.lineTo(x + 5 * Math.sin(y * 0.09 + x), y); ctx.stroke(); }
      /* phalènes */
      moths.forEach(function(m){
        if (m.a <= 0.02) return;
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.r); ctx.globalAlpha = m.a;
        var col = m.dark ? "#2b2b30" : "#f0eee6", edge = m.dark ? "#000" : "#a9a69a";
        ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(-11, 5); ctx.lineTo(-7, 9); ctx.lineTo(0, 5); ctx.lineTo(7, 9); ctx.lineTo(11, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, 1, 2.2, 7, 0, 0, 6.3); ctx.fillStyle = m.dark ? "#000" : "#8a8678"; ctx.fill();
        ctx.restore();
      });
      /* oiseaux */
      birds.forEach(function(bd){
        ctx.save(); ctx.translate(bd.x, bd.y); ctx.fillStyle = "#b45309"; ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(0, 0, 12, 7, 0, 0, 6.3); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, -2); ctx.lineTo(19, 1); ctx.lineTo(10, 3); ctx.closePath(); ctx.fillStyle = "#facc15"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(-8, -13 + 4 * Math.sin(tt * 20)); ctx.lineTo(3, -3); ctx.fillStyle = "#92400e"; ctx.fill(); ctx.restore();
      });
      /* graphique p(t) */
      var ax = S.draw.axes(c, {t:28,x0:0, x1:Math.max(10, hist.length + 2), y0:0, y1:1, l:40, r:12, t:H1 + 18, b:26, stepY:0.25, xl:"génération"});
      var pr = predict(hist[0], Math.max(10, hist.length + 2));
      c.ctx.save(); c.ctx.setLineDash([5, 4]); c.ctx.strokeStyle = pal.grey; c.ctx.lineWidth = 2; c.ctx.beginPath();
      pr.forEach(function(q, i){ var X = ax.X(i), Y = ax.Y(q); if (i) c.ctx.lineTo(X, Y); else c.ctx.moveTo(X, Y); }); c.ctx.stroke(); c.ctx.restore();
      c.ctx.strokeStyle = pal.acc; c.ctx.lineWidth = 2.5; c.ctx.beginPath();
      hist.forEach(function(q, i){ var X = ax.X(i), Y = ax.Y(q); if (i) c.ctx.lineTo(X, Y); else c.ctx.moveTo(X, Y); }); c.ctx.stroke();
      hist.forEach(function(q, i){ S.draw.dot(c, ax.X(i), ax.Y(q), 3.5, pal.acc); });
      S.draw.text(c, "p(D) : simulée (bleu) · prédite sans dérive (pointillés)", ax.L + 6, H1 + 28, {size:10.5, align:"left", color:pal.grey});
      var f = fit(), nd = moths.filter(function(m){ return m.dark; }).length;
      ro.set(0, gen); ro.set(1, S.fmt(p, 3)); ro.set(2, S.fmt(f.wd, 2) + " / " + S.fmt(f.wl, 2)); ro.set(3, S.fmt(nd / Math.max(1, moths.length) * 100, 0) + " %");
      var fav = f.wd > f.wl + 0.01 ? "les sombres sont favorisés (mieux camouflés)" : f.wl > f.wd + 0.01 ? "les clairs sont favorisés (mieux camouflés)" : "aucun phénotype n'est favorisé";
      var s = f.wd - f.wl;
      info.set("Écorce " + (b < 0.4 ? "claire" : b > 0.6 ? "noircie" : "intermédiaire") + " : " + fav + ". Coefficient de sélection contre le moins bien camouflé : s ≈ " + S.fmt(Math.abs(s), 2) + ". " + (phase === 1 ? "Les oiseaux chassent…" : phase === 2 ? "Les survivants se reproduisent : nouvelle fréquence allélique." : ""), "ok");
    }
    function cycle(dt){
      tm += dt;
      if (phase === 0){ if (tm > 0.8){ phase = 1; tm = 0; var f = fit(), cand = [];
          moths.forEach(function(m){ var w = m.dark ? f.wd : f.wl; if (rnd() > w) m.eaten = true; });
          cand = moths.filter(function(m){ return m.eaten; }); birds = [];
          var nb = Math.min(3, Math.max(1, Math.ceil(cand.length / 8)));
          for (var i = 0; i < nb; i++) birds.push({x:-30 - i * 40, y:20 + i * 40, hits:cand.filter(function(_, j){ return j % nb === i; }), k:0, t:0});
        } }
      else if (phase === 1){
        var done = true;
        birds.forEach(function(bd){
          var m = bd.hits[bd.k];
          if (!m){ bd.x += 260 * dt; bd.y -= 40 * dt; return; }
          done = false; bd.x += (m.x - bd.x) * Math.min(1, dt * 4.5); bd.y += (m.y - bd.y) * Math.min(1, dt * 4.5);
          if (Math.hypot(m.x - bd.x, m.y - bd.y) < 10){ m.a = 0; bd.k++; }
        });
        if (done && birds.every(function(b2){ return b2.x > c.W + 20 || !b2.hits[b2.k]; }) && (tm > 0.5)){ if (birds.every(function(b2){ return !b2.hits[b2.k]; })){ phase = 2; tm = 0; birds = []; } }
        if (tm > 6){ moths.forEach(function(m){ if (m.eaten) m.a = 0; }); phase = 2; tm = 0; birds = []; }
      }
      else if (phase === 2){
        if (tm > 0.9){
          var surv = moths.filter(function(m){ return !m.eaten; }), tot = 0, dd = 0;
          surv.forEach(function(m){ dd += m.g; tot += 2; });
          if (tot === 0) { p = p; } else p = dd / tot;
          gen++; hist.push(p); spawn(); phase = 0; tm = 0;
          if (!auto.value) running = false;
        }
      }
    }
    k.button("Génération suivante", function(){ if (!running){ running = true; phase = 0; tm = 0; } }, true);
    k.button("Réinitialiser", function(){ reset(); });
    var pp = p0.el;
    p0.el.addEventListener("change", function(){ reset(); });
    nn.el.addEventListener("change", function(){ reset(); });
    reset(); k.draw(R);
    var lp = k.loop(function(dt){ tt += dt; if (auto.value && !running) running = true; if (running) cycle(dt * 1.0); moths.forEach(function(m){ if (!m.eaten) m.r += (rnd() - 0.5) * 0.02; }); R(); }); lp.play();
  }
});

})();
/* BIO3D-END:s_c10_selection.js */
