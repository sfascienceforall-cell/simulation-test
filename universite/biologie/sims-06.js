/* Biologie BA1 · chapitre 6 : métabolisme énergétique */
(function(){
var P = function(S){ return S.draw.palette; };
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function axIn(S, c, r, o){ o = o || {}; o.l = r.x + (o.pl == null ? 44 : o.pl); o.r = Math.max(4, c.W - r.x - r.w + (o.pr == null ? 10 : o.pr)); o.t = r.y + (o.pt == null ? 16 : o.pt); o.b = Math.max(4, c.H - r.y - r.h + (o.pb == null ? 32 : o.pb)); return S.draw.axes(c, o); }
function cl(x){ return Math.max(0, Math.min(1, x)); }
function ease(t){ t = cl(t); return t * t * (3 - 2 * t); }
/* jeton moléculaire : pastille arrondie avec texte */
function tok(c, S, x, y, txt, col, al, sz){ var ctx = c.ctx; sz = sz || 9.5; ctx.save(); ctx.globalAlpha = al == null ? 1 : al; ctx.font = "800 " + sz + "px Mulish, system-ui, sans-serif"; var w = ctx.measureText(txt).width + 8, h = sz + 6;
  ctx.fillStyle = col; S.draw.rrect(c, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, x, y + 0.5); ctx.restore(); }
/* position le long d'une ligne brisée pts à la fraction u */
function along(pts, u){ u = cl(u); var L = 0, i, seg = []; for (i = 1; i < pts.length; i++){ var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  var s = u * L; for (i = 0; i < seg.length; i++){ if (s <= seg[i] || i === seg.length - 1){ var f = seg[i] ? Math.min(1, s / seg[i]) : 1; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } s -= seg[i]; } return pts[pts.length - 1]; }
/* flux de particules : spawn(rate) + avance le long d'un chemin */
function Stream(path, dur, col, txt, sz){ this.path = path; this.dur = dur; this.col = col; this.txt = txt; this.sz = sz; this.ps = []; this.acc = 0; }
Stream.prototype.step = function(dt, rate){ this.acc += dt * rate; while (this.acc > 1){ this.acc--; this.ps.push(0); } for (var i = 0; i < this.ps.length; i++) this.ps[i] += dt / this.dur; this.ps = this.ps.filter(function(u){ return u < 1; }); };
Stream.prototype.draw = function(c, S, path){ var self = this; if (path) this.path = path; this.ps.forEach(function(u){ var p = along(self.path, u), al = u > 0.85 ? (1 - u) / 0.15 : u < 0.08 ? u / 0.08 : 1;
  if (self.txt == null) ball(c, p[0], p[1], self.sz || 4, self.col, al); else tok(c, S, p[0], p[1], self.txt, self.col, al, self.sz); }); };
function ball(c, x, y, r, col, al){ var ctx = c.ctx; ctx.save(); ctx.globalAlpha = al == null ? 1 : al; var g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(.35, col); g.addColorStop(1, col); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore(); }
function route(c, pts, col){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha = 0.22; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach(function(p, i){ if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore(); }
function keyRow(c, S, items, x, y, W){ var cx = x; items.forEach(function(it){ c.ctx.save(); c.ctx.font = "700 10px Mulish, system-ui, sans-serif"; var w = c.ctx.measureText(it[1]).width; c.ctx.restore(); if (cx + w + 18 > W){ cx = x; y += 15; } ball(c, cx + 4, y, 4, it[0]); S.draw.text(c, it[1], cx + 11, y, {size:10, align:"left", color:"#2c3a4e"}); cx += w + 24; }); }
function mito(c, x, y, w, h){ var ctx = c.ctx; ctx.save(); ctx.fillStyle = "#fde7d4"; ctx.strokeStyle = "#c46a2b"; ctx.lineWidth = 2.5; S0rr(ctx, x, y, w, h, Math.min(h / 2, 40)); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "rgba(196,106,43,.6)"; ctx.fillStyle = "#f9d6b8"; ctx.lineWidth = 1.4; var n = Math.max(3, Math.floor(w / 40)), dep = Math.min(26, h * 0.2); for (var i = 0; i < n; i++){ var cx = x + w * (i + 0.5) / n, up = i % 2 === 0, y0 = up ? y + 3 : y + h - 3, y1 = up ? y + 3 + dep : y + h - 3 - dep; ctx.beginPath(); ctx.moveTo(cx - 5, y0); ctx.lineTo(cx - 4, y1); ctx.arc(cx, y1, 4, Math.PI, 0, !up); ctx.lineTo(cx + 5, y0); ctx.fill(); ctx.stroke(); }
  ctx.restore(); }
function S0rr(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

/* 1. Bilan de l'oxydation complète du glucose */
SFA.sim({
  id:"ub-c06-bilan-glucose", ch:"c06", tag:"Bilan",
  titre:"Bilan ATP d'une molécule de glucose",
  resume:"Suis une molécule de glucose du cytosol à la chaîne respiratoire : chaque NADH, FADH₂ et ATP apparaît à sa place et remplit le compteur.",
  but:"Regarde l'oxydation d'un glucose : glycolyse, pyruvate déshydrogénase, cycle de Krebs puis chaîne respiratoire. Touche la navette (sur la membrane mitochondriale) ou choisis-la, règle les rendements par coenzyme et relève les défis du bilan.",
  aRetenir:"Par glucose : 4 ATP (ou GTP) de phosphorylation au niveau du substrat (2 nets en glycolyse + 2 au cycle de Krebs), 10 NADH et 2 FADH₂. Avec 2,5 ATP/NADH et 1,5 ATP/FADH₂ : 4 + 25 + 3 = 32 ATP (navette malate-aspartate) ; avec la navette glycérol-phosphate, les 2 NADH cytosoliques ne valent plus que 1,5 : 30 ATP. Les anciennes valeurs 3 et 2 donnaient 36 à 38.",
  piege:"Les 2 NADH de la glycolyse sont cytosoliques : ils ne traversent pas la membrane interne, leur rendement dépend de la navette. Et le carbone : 2 CO₂ viennent de la pyruvate déshydrogénase, 4 du cycle de Krebs, 0 de la chaîne respiratoire (l'O₂ finit en H₂O).",
  build:function(k,S){
    var c = k.canvas(480), pal = P(S), tl = 0, playing = true, di = 0, geo = null;
    c.cv.style.touchAction = "manipulation";
    var nav = k.seg("Navette des NADH cytosoliques", [["ma","Malate-aspartate"],["gp","Glycérol-phosphate"]], "ma");
    var pn = k.slider("ATP par NADH (matrice)", 1.5, 3, 0.1, 2.5, "");
    var pf = k.slider("ATP par FADH₂", 1, 2, 0.1, 1.5, "");
    k.button("▶ Rejouer l'oxydation", function(){ tl = 0; playing = true; }, true);
    k.button("Défi suivant", function(){ di = (di + 1) % DEF.length; });
    var ro = k.readouts(["ATP substrat", "ATP oxydatif", "Total / glucose", "CO₂ libérés"]);
    var note = k.note("", "");
    var DEF = [
      {t:"retrouve le bilan « historique » des anciens manuels : 38 ATP par glucose.", ok:function(T){ return Math.abs(T - 38) < 0.05; }, sol:"3 ATP par NADH, 2 par FADH₂ et navette malate-aspartate : 4 + 10 × 3 + 2 × 2 = 38."},
      {t:"avec les rendements actuels (2,5 et 1,5), obtiens 30 ATP.", ok:function(T, n, f){ return Math.abs(T - 30) < 0.05 && Math.abs(n - 2.5) < 0.01 && Math.abs(f - 1.5) < 0.01; }, sol:"Navette glycérol-phosphate : les 2 NADH cytosoliques cèdent leurs électrons au FAD (1,5 ATP chacun) : 4 + 3 + 20 + 3 = 30."},
      {t:"navette malate-aspartate et 1,5 ATP par FADH₂ : quel rendement par NADH donne 34 ATP ?", ok:function(T, n, f, g){ return !g && Math.abs(f - 1.5) < 0.01 && Math.abs(T - 34) < 0.05; }, sol:"4 + 10n + 3 = 34 ⇒ n = 2,7 ATP par NADH."}
    ];
    c.pointer(function(t, p){ if (t === "down" && geo && Math.hypot(p.x - geo.sx, p.y - geo.sy) < 22){ nav.set(nav.value === "ma" ? "gp" : "ma"); k.redraw(); } });
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, n = pn.value, f = pf.value, gp = nav.value === "gp";
      if (playing){ tl += (dt || 0); if (tl > 9.5){ tl = 9.5; playing = false; } }
      c.clear();
      var cyt = gp ? 2 * f : 2 * n, items = [["Substrat (glycolyse 2 + Krebs 2)", 4, pal.amber, 0], ["NADH glycolyse (×2)", cyt, pal.teal, 1], ["NADH pyruvate DH (×2)", 2 * n, pal.acc, 2], ["NADH Krebs (×6)", 6 * n, pal.violet, 3], ["FADH₂ Krebs (×2)", 2 * f, pal.green, 4]];
      var tot = 0; items.forEach(function(it){ tot += it[1]; });
      /* ---- cellule ---- */
      var top = 318;
      ctx.fillStyle = "#f4f8ee"; S.draw.rrect(c, 2, 2, W - 4, top - 6, 14); ctx.fill(); ctx.strokeStyle = "#9cc08a"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, "cytosol", 10, 14, {size:10, align:"left", color:"#5c7d4c"});
      var gx = Math.max(46, W * 0.14), mx = Math.max(gx + 44, W * 0.3), my = 40, mw = W - mx - 10, mh = top - my - 14;
      mito(c, mx, my, mw, mh);
      S.draw.text(c, "mitochondrie (matrice)", mx + mw / 2, my + 14, {size:10, color:"#9a4d17"});
      /* glycolyse */
      var gY0 = 30, gY1 = 170;
      S.draw.line(c, gx, gY0 + 10, gx, gY1 - 10, "#b8c7aa", 3);
      S.draw.text(c, "glycolyse", gx, gY1 + 34, {size:9.5, color:"#5c7d4c"});
      var pdh = [mx + mw * 0.2, my + 52], kr = [mx + mw * 0.58, my + mh * 0.42], kR = Math.min(38, mw * 0.18), ch = [mx + 18, my + mh - 18], syn = [mx + mw - 26, my + mh - 18];
      /* chaîne respiratoire sur la membrane interne (bas) */
      ctx.fillStyle = "#f2e3b8"; ctx.fillRect(mx + 8, my + mh - 30, mw - 16, 14);
      ["I", "II", "III", "IV"].forEach(function(lab, i){ var x = mx + 22 + i * (mw - 80) / 4; ctx.fillStyle = [pal.violet, pal.green, pal.acc, pal.teal][i]; S.draw.rrect(c, x, my + mh - 36, 20, 26, 5); ctx.fill(); S.draw.text(c, lab, x + 10, my + mh - 23, {size:9, color:"#fff"}); });
      ctx.fillStyle = "#24775a"; S.draw.rrect(c, syn[0] - 9, my + mh - 40, 18, 32, 6); ctx.fill(); S.draw.text(c, "ATP synthase", syn[0] - 4, my + mh - 50, {size:9, color:pal.green, align:"right"});
      /* cycle de Krebs */
      var spin = tl > 3.8 && tl < 6.2 ? (tl - 3.8) * 3 : 0;
      ctx.save(); ctx.strokeStyle = "#c46a2b"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(kr[0], kr[1], kR, 0, 6.2832); ctx.stroke();
      for (var q = 0; q < 8; q++){ var a = spin + q * 0.785; S.draw.dot(c, kr[0] + Math.cos(a) * kR, kr[1] + Math.sin(a) * kR, 2.6, "#c46a2b"); } ctx.restore();
      S.draw.text(c, "cycle de", kr[0], kr[1] - 6, {size:9.5, color:"#9a4d17"}); S.draw.text(c, "Krebs", kr[0], kr[1] + 7, {size:9.5, color:"#9a4d17"});
      S.draw.text(c, "PDH", pdh[0], pdh[1] - 16, {size:9.5, color:"#9a4d17"});
      /* navette (cliquable) */
      var sx = mx, sy = 230; S.draw.dot(c, sx, sy, 9, gp ? pal.green : pal.teal); S.draw.text(c, gp ? "G3P" : "M-A", sx, sy + 18, {size:9, color:pal.ink}); S.draw.text(c, "navette ↻", sx - 12, sy - 15, {size:9, color:pal.grey, align:"right"});
      geo = {sx:sx, sy:sy};
      /* ---- jetons selon la ligne du temps ---- */
      var t = tl;
      if (t < 2.0){ var u0 = ease(t / 0.8), yG = gY0 + (gY1 - 40 - gY0) * ease((t - 0.8) / 1.2); tok(c, S, gx, t < 0.8 ? 10 + 30 * u0 : yG, "glucose C₆", "#7a5c2e"); }
      if (t >= 1.6 && t < 3.2){ for (var i = 0; i < 2; i++){ var u = ease((t - 2.0) / 1.0), p = along([[gx, gY1 - 30 + i * 18], [gx + 10, gY1 + i * 18 - 12], [pdh[0], pdh[1] + (i ? 10 : -10)]], u); tok(c, S, p[0], p[1], "pyruvate", "#8a6a3a", 1, 8.5); } }
      if (t >= 1.7 && t < 3.6){ for (i = 0; i < 2; i++){ var u2 = ease((t - 1.7) / 1.6), p2 = along([[gx, 120 + i * 14], [sx - 20, sy + (i ? 8 : -8)], [sx + 30, sy + (i ? 8 : -8)], [ch[0] + 10, my + mh - 46]], u2); tok(c, S, p2[0], p2[1], u2 > 0.6 && gp ? "FADH₂" : "NADH", u2 > 0.6 && gp ? pal.green : pal.teal, 1, 8.5); } }
      if (t >= 1.7){ for (i = 0; i < 2; i++){ var u3 = ease((t - 1.7) / 0.9); tok(c, S, gx - (gx - 22) * u3, 210 + i * 18 - (1 - u3) * 90, "ATP", pal.amber, t > 9 ? 0.4 : 1, 8.5); } }
      if (t >= 3.2 && t < 4.4){ for (i = 0; i < 2; i++){ var u4 = ease((t - 3.2) / 1.2), p4 = along([pdh, [kr[0] - kR, kr[1] - (i ? 0 : 12)]], u4); tok(c, S, p4[0], p4[1], "acétyl-CoA", "#8a6a3a", 1, 8); } }
      function puff(t0, n2, txt, col, from, to, sz){ if (t < t0) return; for (var j = 0; j < n2; j++){ var uu = ease((t - t0 - j * 0.12) / 1.3); if (uu <= 0) continue; var dx = (j - (n2 - 1) / 2) * 13, p5 = along([from, [to[0] + dx, to[1]]], uu); tok(c, S, p5[0], p5[1], txt, col, t > 9 && txt !== "CO₂" ? 0.35 : 1, sz || 8); } }
      puff(3.3, 2, "CO₂", "#7b8694", pdh, [pdh[0], my + 6]);
      puff(3.4, 2, "NADH", pal.acc, pdh, [ch[0] + 50, my + mh - 46]);
      puff(4.2, 4, "CO₂", "#7b8694", kr, [kr[0] + kR * 0.3, my - 4]);
      puff(4.4, 6, "NADH", pal.violet, kr, [mx + mw * 0.45, my + mh - 46]);
      puff(4.6, 2, "FADH₂", pal.green, kr, [mx + 54, my + mh - 54]);
      puff(4.6, 2, "GTP", pal.amber, kr, [kr[0] + kR + 24, kr[1] - kR]);
      /* ATP de la chaîne */
      var ox = tot - 4, nOx = Math.round(ox), shown = Math.floor(cl((t - 6.2) / 2.2) * nOx);
      if (t > 6.2){ var pulses = Math.min(nOx, shown); for (i = 0; i < Math.min(8, pulses); i++){ var ua = ((t * 1.3 + i * 0.13) % 1); tok(c, S, syn[0] - 4 + 0, my + mh - 50 - ua * 60, "ATP", pal.green, 1 - ua, 8.5); } S.draw.glow(c, syn[0], my + mh - 24, 26, pal.green, 0.35); }
      S.draw.display(c, S.fmt(2 * cl((t - 1.7) / 0.9) + 2 * cl((t - 4.6) / 1.3) + ox * cl((t - 6.2) / 2.2), 1), Math.max(40, gx - 4), top - 34, {w:76, h:38, caption:"ATP produits"});
      if (!playing && t >= 9.5) S.draw.text(c, "bilan : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", mx + mw / 2, my + mh * 0.78, {size:10, color:"#9a4d17", halo:"#fde7d4"});
      /* ---- comptabilité (barre empilée) ---- */
      var x0 = 14, wmax = W - 28, sc = wmax / 40, y = top + 30, x = x0;
      S.draw.text(c, "Total : " + S.fmt(tot, 1) + " ATP par glucose", W / 2, top + 12, {size:14});
      var starts = [1.7, 6.2, 6.4, 6.8, 7.2];
      items.forEach(function(it, j){ var fill = j === 0 ? (t >= 1.7 ? (t >= 4.6 ? 1 : 0.5) : 0) : cl((t - starts[j]) / 1.4), w = it[1] * sc;
        ctx.fillStyle = "#eef1f5"; ctx.fillRect(x, y, w, 40); ctx.fillStyle = it[2]; ctx.fillRect(x, y, w * fill, 40); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, 40);
        if (w > 26) S.draw.text(c, S.fmt(it[1], 1), x + w / 2, y + 20, {color:fill > 0.5 ? "#fff" : pal.grey, size:12}); x += w; });
      items.forEach(function(it, j){ var yy = y + 54 + Math.floor(j / (W < 480 ? 1 : 2)) * 20, xx = x0 + (W < 480 ? 0 : (j % 2) * (W / 2)); ctx.fillStyle = it[2]; ctx.fillRect(xx, yy - 6, 12, 12); S.draw.text(c, it[0] + " : " + S.fmt(it[1], 1), xx + 18, yy, {align:"left", size:11, weight:600}); });
      ro.set(0, "4"); ro.set(1, S.fmt(tot - 4, 1)); ro.set(2, S.fmt(tot, 1)); ro.set(3, "6 (2 PDH + 4 Krebs)");
      var d = DEF[di], ok = d.ok(tot, n, f, gp);
      note.set(ok ? "✓ <b>Défi " + (di + 1) + "/3 réussi</b> : " + d.sol : "◎ <b>Défi " + (di + 1) + "/3</b> : " + d.t + " Total actuel : " + S.fmt(tot, 1) + " ATP.", ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ render(dt); }); lp.play();
  }
});

/* 2. Chimiosmose */
SFA.sim({
  id:"ub-c06-chimiosmose", ch:"c06", tag:"Chimiosmose",
  titre:"Force protonmotrice et ATP synthase",
  resume:"Δp = ΔΨ + 61,5·ΔpH : assez d'énergie pour fabriquer l'ATP ? Découplant, oligomycine, cyanure.",
  but:"Règle le gradient de la membrane interne, ajoute un inhibiteur ou un découplant, et compare l'énergie fournie par les protons à celle qu'exige la synthèse d'ATP.",
  aRetenir:"Force protonmotrice (37 °C) : Δp = ΔΨ + 2,303·RT/F·ΔpH = ΔΨ + 61,5 mV × ΔpH, avec ΔΨ la valeur absolue du potentiel (matrice négative) et ΔpH = pH matrice − pH espace intermembranaire. Les protons qui rentrent fournissent n·F·Δp par ATP (n ≈ 3,7 H⁺ : ≈ 2,7 pour l'ATP synthase humaine + 1 pour le transport du phosphate). Même pont qu'en chimie avec l'équation de Nernst (électrochimie).",
  piege:"Un découplant (DNP, UCP1) ne bloque pas la chaîne : il la fait tourner plus vite (plus d'O₂ consommé) mais l'énergie part en chaleur. L'oligomycine, elle, bloque l'ATP synthase : Δp monte et la respiration ralentit (contrôle respiratoire). Modèle simplifié : le gradient est imposé, pas calculé à partir des flux.",
  build:function(k,S){
    var c = k.canvas(440), pal = P(S), B = S.bio, ps = [], cloud = [], acc = {p:0, s:0, l:0}, rot = 0, atps = [], rnd = Math.random;
    for (var q = 0; q < 34; q++) cloud.push({x:rnd(), y:rnd(), vx:rnd() - .5, vy:rnd() - .5});
    var dph = k.slider("ΔpH (matrice − espace)", 0, 1.2, 0.05, 0.5, "");
    var dpsi = k.slider("ΔΨ (valeur absolue)", 0, 200, 5, 150, "mV");
    var dnp = k.slider("Découplant (fuite de protons)", 0, 100, 5, 0, "%");
    var dg = k.slider("ΔG de synthèse de l'ATP (cellule)", 40, 70, 1, 55, "kJ/mol");
    var cond = k.seg("Condition", [["n","Normale"],["o","Oligomycine"],["c","Cyanure"]], "n");
    var ro = k.readouts(["Δp","n·F·Δp par ATP","Marge","État"]);
    var note = k.note("", "ok");
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear();
      var d = dnp.value / 100, n = 3.7, F = 96.485;
      var dp = (dpsi.value + 61.5 * dph.value) * (1 - d); if (cond.value === "c") dp = 0;
      var E = n * F * dp / 1000, marge = E - dg.value;
      /* géométrie */
      var my = H * .42, mh = 26, mx0 = 8, mx1 = W - 8;
      var xI = W * .17, xIII = W * .34, xIV = W * .5, xU = W * .64, xS = W * .82;
      /* fond */
      var g1 = ctx.createLinearGradient(0, 0, 0, my); g1.addColorStop(0, "#fff7e6"); g1.addColorStop(1, "#ffecc9"); ctx.fillStyle = g1; ctx.fillRect(mx0, 8, mx1 - mx0, my - mh / 2 - 8);
      var g2 = ctx.createLinearGradient(0, my, 0, my + 170); g2.addColorStop(0, "#e1ecfb"); g2.addColorStop(1, "#cfdff5"); ctx.fillStyle = g2; ctx.fillRect(mx0, my + mh / 2, mx1 - mx0, H * .3);
      S.draw.text(c, "Espace intermembranaire · pH bas, charge +", mx0 + 8, 22, {align:"left", size:11, color:"#a2650c"});
      S.draw.text(c, "Matrice · pH plus haut, charge −", mx0 + 8, my + mh / 2 + 30, {align:"left", size:11, color:"#2c5aa0"});
      /* membrane */
      ctx.fillStyle = "#f2e3b8"; ctx.fillRect(mx0, my - mh / 2, mx1 - mx0, mh); for (var x = mx0 + 6; x < mx1; x += 12){ B.ball(c, x, my - mh / 2 + 2, 3.6, "#e8b94a"); B.ball(c, x, my + mh / 2 - 2, 3.6, "#e8b94a"); }
      /* complexes */
      var blocked = cond.value === "c";
      function cplx(x, w, h, col, lab){ ctx.fillStyle = blocked && lab === "IV" ? "#9aa6b6" : col; S.draw.rrect(c, x - w / 2, my - h / 2, w, h, 8); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1.5; ctx.stroke(); S.draw.text(c, lab, x, my, {size:12, color:"#fff"}); }
      cplx(xI, 40, 56, pal.violet, "I"); cplx(xIII, 40, 56, pal.acc, "III"); cplx(xIV, 40, 56, pal.teal, "IV");
      if (blocked) S.draw.text(c, "✕ CN⁻", xIV, my - 42, {size:11, color:pal.red});
      /* UCP */
      ctx.fillStyle = d > 0 ? pal.amber : "#c9d3df"; S.draw.rrect(c, xU - 11, my - mh / 2 - 2, 22, mh + 4, 5); ctx.fill(); S.draw.text(c, "fuite", xU, my + mh / 2 + 14, {size:9.5, color:d > 0 ? pal.amber : pal.grey});
      /* ATP synthase : stator + rotor */
      var run = cond.value === "n" && marge >= 0, spin = run ? 3 * (1 - d * .3) : 0; rot += dt * spin;
      ctx.fillStyle = "#c9d3df"; S.draw.rrect(c, xS - 15, my - mh / 2 - 4, 30, mh + 8, 6); ctx.fill();
      ctx.fillStyle = pal.green; S.draw.rrect(c, xS - 7, my + mh / 2, 14, 24, 3); ctx.fill();
      ctx.save(); ctx.translate(xS, my + mh / 2 + 52); for (var q = 0; q < 3; q++){ var a = rot + q * 2.0944; ctx.fillStyle = [pal.green, "#4aa383", "#7cc3a8"][q]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 30, a, a + 1.75); ctx.closePath(); ctx.fill(); } ctx.restore();
      S.draw.text(c, "ATP synthase", xS, my + mh / 2 + 98, {size:10.5, color:pal.green}); S.draw.text(c, "ADP + Pi → ATP", xS, my + mh / 2 + 112, {size:9.5, color:pal.grey});
      /* particules H+ */
      var pump = blocked ? 0 : cond.value === "o" ? 3 : 6, flow = run ? 7 * (1 - d) : 0, leak = blocked ? 0 : d * 8;
      acc.p += dt * pump; acc.s += dt * flow; acc.l += dt * leak;
      while (acc.p > 1){ acc.p--; ps.push({k:"p", x:[xI, xIII, xIV][Math.floor(rnd() * 3)] + (rnd() - .5) * 14, y:my, t:0, ty:30 + rnd() * (my - 70)}); }
      while (acc.s > 1){ acc.s--; ps.push({k:"s", x:xS, y:my - mh / 2 - 36, t:0}); }
      while (acc.l > 1){ acc.l--; ps.push({k:"l", x:xU, y:my - mh / 2 - 36, t:0}); }
      ps.forEach(function(p){ p.t += dt * 1.1; var u = Math.min(1, p.t), y;
        if (p.k === "p"){ y = p.y + (p.ty - p.y) * u; } else { y = p.y + (mh + 90) * u; }
        p.draw = [p.x, y, p.k === "p" ? 1 : 1 - u * .3]; });
      ps = ps.filter(function(p){ if (p.t >= 1){ if (p.k === "s" && rnd() < .5) atps.push({x:xS + 20, y:my + 80, t:0}); if (p.k === "p") cloud.push({x:Math.max(0, Math.min(1, (p.x - 8) / (W - 16))), y:Math.max(0, Math.min(1, (p.ty - 20) / (my - 40))), vx:rnd() - .5, vy:rnd() - .5}); return false; } return true; });
      var nC = blocked ? 4 : Math.round(8 + 26 * Math.min(1, dp / 250)); while (cloud.length > nC) cloud.shift();
      cloud.forEach(function(p){ p.x += p.vx * dt * .08; p.y += p.vy * dt * .08; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; p.vx += (rnd() - .5) * dt * 3; p.vy += (rnd() - .5) * dt * 3; B.ball(c, mx0 + 6 + p.x * (mx1 - mx0 - 12), 34 + p.y * (my - mh / 2 - 48), 5.2, pal.red, {text:"H⁺", size:6.5}); });
      ps.forEach(function(p){ B.ball(c, p.draw[0], p.draw[1], 5.2, pal.red, {text:"H⁺", size:6.5, alpha:p.draw[2]}); });
      atps.forEach(function(a){ a.t += dt; a.x += dt * 24; S.draw.label(c, "ATP", a.x, a.y + 10 * Math.sin(a.t * 3), {color:pal.green, size:10}); }); atps = atps.filter(function(a){ return a.t < 2.2; });
      /* flèches de légende */
      S.draw.arrow(c, xI, my - 36, xI, my - 62, pal.red, 2); S.draw.text(c, "pompes à H⁺ (chaîne respiratoire)", xIII, my - 80 > 40 ? 38 : 38, {size:10, color:pal.grey}); 
      /* barres d'énergie */
      var by = H - 50, bx = 110, bw = W - bx - 26, sc = bw / 100;
      S.draw.text(c, "fournie", 14, by, {align:"left", size:11, color:pal.ink});
      ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, bx, by - 9, bw, 18, 9); ctx.fill(); ctx.fillStyle = marge >= 0 ? pal.green : pal.red; S.draw.rrect(c, bx, by - 9, Math.max(14, Math.min(100, E) * sc), 18, 9); ctx.fill();
      S.draw.text(c, S.fmt(E, 0) + " kJ/mol", E < 25 ? bx + Math.max(14, E * sc) + 8 : bx + 8, by, {align:"left", size:10.5, color:E < 25 ? pal.ink : "#fff"});
      S.draw.line(c, bx + dg.value * sc, by - 20, bx + dg.value * sc, by + 20, pal.ink, 2, [4, 3]);
      S.draw.text(c, "exigée : " + dg.value, bx + dg.value * sc, by + 30, {size:11, color:pal.ink});
      var state = cond.value === "o" ? "ATP synthase bloquée" : (marge >= 0 ? "Synthèse d'ATP" : "Synthèse impossible (hydrolyse)");
      ro.set(0, S.fmt(dp, 0) + " mV"); ro.set(1, S.fmt(E, 1) + " kJ"); ro.set(2, S.fmt(marge, 1) + " kJ"); ro.set(3, state);
      if (cond.value === "o") note.set("Oligomycine : les protons ne peuvent plus rentrer par l'ATP synthase. Δp reste élevé, la chaîne se heurte à ce gradient et l'O₂ consommé chute (contrôle respiratoire).", "warn");
      else if (cond.value === "c") note.set("Cyanure : le complexe IV est bloqué, plus de pompage de H⁺ en aval : Δp s'effondre, plus d'ATP mitochondrial.", "warn");
      else if (marge < 0) note.set("Avec cette fuite, n·F·Δp est inférieur au ΔG exigé : l'ATP synthase ne peut plus synthétiser (elle pourrait même hydrolyser l'ATP).", "warn");
      else if (d > 0) note.set("Découplage partiel : la chaîne tourne, le gradient est dissipé ; l'énergie de l'oxydation part en chaleur (thermogenèse).", "warn");
      else note.set("Situation normale : l'énergie des protons dépasse celle exigée pour synthétiser l'ATP.", "ok");
    }
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 3. Fermentation contre respiration */
SFA.sim({
  id:"ub-c06-fermentation", ch:"c06", tag:"Effort",
  titre:"Fermentation lactique et respiration : le prix de l'anaérobie",
  resume:"Une fibre musculaire et son capillaire : sans assez d'O₂, le pyruvate devient lactate pour recycler le NAD⁺, et le glucose est consommé beaucoup plus vite.",
  but:"Fixe le besoin en ATP et la part produite sans oxygène (ou glisse le point sur la courbe) : regarde le glucose entrer, le pyruvate partir vers la mitochondrie ou devenir lactate, et la boucle NAD⁺/NADH tourner. Défi : trouve la part anaérobie qui multiplie par 5 la consommation de glucose.",
  aRetenir:"Fermentation lactique : 2 ATP par glucose et 2 lactates ; respiration : 30 à 32 ATP par glucose. Si une fraction f de l'ATP vient de la fermentation, la consommation de glucose est multipliée par 1 + (Y/2 − 1)·f, soit 1 + 15·f pour Y = 32. Le lactate formé vaut exactement f × (ATP demandé) en mmol (1 lactate par ATP). Rôle de la fermentation : régénérer le NAD⁺ pour que la glycolyse continue sans O₂.",
  piege:"La fermentation ne produit pas d'ATP par elle-même : c'est la glycolyse qui en fait 2 ; la réduction du pyruvate en lactate sert uniquement à régénérer le NAD⁺. L'acidification du muscle vient surtout de l'hydrolyse de l'ATP qui libère des H⁺ : le lactate est le marqueur, pas la seule cause. Les jetons animés sont proportionnels aux flux (échelle arbitraire).",
  build:function(k,S){
    var c = k.canvas(560), pal = P(S), geo = null, drag = false, spin = 0, st = null, bobs = [];
    c.cv.style.touchAction = "none";
    var d = k.slider("Besoin en ATP", 10, 200, 10, 100, "mmol/min");
    var f = k.slider("Part d'ATP produite sans O₂", 0, 100, 1, 20, "%");
    var y = k.slider("Rendement aérobie", 30, 32, 1, 32, "ATP/glucose");
    var ro = k.readouts(["Glucose consommé", "Lactate formé", "Facteur / aérobie pur", "ATP moyen par glucose"]);
    var note = k.note("", "");
    c.pointer(function(t, p){ if (!geo) return; if (t === "down") drag = p.y > geo.ax.T - 10; if ((t === "down" || t === "drag") && drag){ f.set(Math.max(0, Math.min(100, Math.round(geo.ax.ix(p.x))))); k.redraw(); } if (t === "up") drag = false; });
    function paths(W, top){
      var cap = 34, gx = cap + 60, gy0 = 40, gy1 = 150, mx = W * 0.58;
      return {cap:cap, gx:gx, gy1:gy1, mx:mx,
        glu:[[cap * 0.5, 30], [gx, gy0], [gx, gy1]],
        aer:[[gx, gy1], [mx + 20, gy1 - 40], [W - 60, gy1 - 50]],
        lac:[[gx, gy1], [gx, top - 60], [cap * 0.5, top - 40], [cap * 0.5, top - 6]],
        atpG:[[gx, 95], [gx + 70, 95]],
        atpM:[[W - 60, gy1 - 50], [W - 50, 40]],
        o2:[[cap * 0.5, top - 90], [mx + 10, gy1 - 10], [W - 70, gy1 - 40]]};
    }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, ff = f.value / 100, D = d.value, Y = y.value, top = 300;
      var g = D * ((1 - ff) / Y + ff / 2), lac = ff * D, fac = g / (D / Y), ga = D * (1 - ff) / Y, gn = D * ff / 2;
      c.clear();
      var Pp = paths(W, top);
      if (!st){ st = {glu:new Stream(Pp.glu, 1.6, "#8a5a2b", null, 5), aer:new Stream(Pp.aer, 1.3, "#c9a26b", null, 3.6), lac:new Stream(Pp.lac, 1.8, "#c0321d", null, 3.8), atpG:new Stream(Pp.atpG, 0.9, "#e0a01b", null, 3.2), atpM:new Stream(Pp.atpM, 1.0, "#24775a", null, 3.2), o2:new Stream(Pp.o2, 1.6, "#2f7fd1", null, 3.2)}; }
      ["glu", "aer", "lac", "o2"].forEach(function(kk){ route(c, Pp[kk], st[kk].col); });
      /* fond : fibre musculaire */
      ctx.fillStyle = "#fbeff0"; S.draw.rrect(c, Pp.cap + 6, 4, W - Pp.cap - 10, top - 10, 14); ctx.fill(); ctx.strokeStyle = "#d9a1a6"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "rgba(200,120,130,.18)"; ctx.lineWidth = 6; for (var sx = Pp.cap + 24; sx < W - 10; sx += 26){ ctx.beginPath(); ctx.moveTo(sx, 10); ctx.lineTo(sx, top - 10); ctx.stroke(); }
      S.draw.text(c, "fibre musculaire", W - 12, 16, {size:10, align:"right", color:"#a0525a"});
      /* capillaire */
      var gr = ctx.createLinearGradient(0, 0, Pp.cap, 0); gr.addColorStop(0, "#c94a52"); gr.addColorStop(1, "#e7868c"); ctx.fillStyle = gr; S.draw.rrect(c, 2, 4, Pp.cap, top - 8, 10); ctx.fill();
      bobs = bobs.filter(function(b){ return b.y < top; }); if (bobs.length < 7 && Math.random() < 0.05) bobs.push({y:-10}); bobs.forEach(function(b){ b.y += (dt || 0) * 40; S.bio && S.bio.rbc ? S.bio.rbc(c, Pp.cap / 2 + 2, b.y, 9, {mode:"disque"}) : 0; });
      ctx.save(); ctx.translate(12, top / 2); ctx.rotate(-Math.PI / 2); S.draw.text(c, "capillaire", 0, 0, {size:9.5, color:"#fff"}); ctx.restore();
      /* mitochondrie */
      var oxy = 1 - ff; mito(c, Pp.mx, 26, W - Pp.mx - 14, 120);
      ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * oxy; S.draw.text(c, "mitochondrie", Pp.mx + (W - Pp.mx - 14) / 2, 40, {size:10, color:"#9a4d17"}); ctx.restore();
      S.draw.text(c, "+ " + S.fmt(Y - 2, 0) + " ATP / glucose", Pp.mx + (W - Pp.mx - 14) / 2, 138, {size:9.5, color:pal.green, halo:"#fde7d4"});
      /* glycolyse et LDH */
      S.draw.text(c, "glycolyse", Pp.gx + 8, 70, {size:10, align:"left", color:"#5c3b1e"}); S.draw.text(c, "+2 ATP", Pp.gx + 8, 84, {size:9.5, align:"left", color:pal.amber});
      var ldh = [Pp.gx, (Pp.gy1 + top - 60) / 2 + 10];
      S.draw.text(c, "LDH", ldh[0] + 10, ldh[1], {size:10, align:"left", color:pal.red});
      /* boucle NAD+/NADH */
      spin += (dt || 0) * 4 * ff; var lc = [ldh[0] + 70, ldh[1] - 26], lr = 22;
      ctx.save(); ctx.strokeStyle = ff > 0 ? pal.teal : "#cfd6e0"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(lc[0], lc[1], lr, 0, 6.2832); ctx.stroke(); ctx.restore();
      S.draw.dot(c, lc[0] + Math.cos(spin) * lr, lc[1] + Math.sin(spin) * lr, 4, pal.teal);
      S.draw.text(c, "NAD⁺", lc[0] + lr + 6, lc[1] - 8, {size:9.5, align:"left", color:pal.teal}); S.draw.text(c, "NADH", lc[0] + lr + 6, lc[1] + 10, {size:9.5, align:"left", color:pal.teal});
      /* flux animés : échelle commune 1 jeton = D/40 mmol (glucose ×8 pour rester visible) */
      var k0 = 40 / D;
      st.glu.step(dt || 0, g * k0 * 0.8); st.aer.step(dt || 0, 2 * ga * k0 * 0.8); st.lac.step(dt || 0, lac * k0 * 0.2);
      st.atpG.step(dt || 0, 2 * g * k0 * 0.2); st.atpM.step(dt || 0, ga * (Y - 2) * k0 * 0.2); st.o2.step(dt || 0, 6 * ga * k0 * 0.3);
      ["o2", "glu", "aer", "lac", "atpG", "atpM"].forEach(function(key){ st[key].draw(c, S, Pp[key]); });
      keyRow(c, S, [["#8a5a2b", "glucose"], ["#c9a26b", "pyruvate"], ["#c0321d", "lactate"], ["#2f7fd1", "O₂"], ["#e0a01b", "ATP (glycolyse)"], ["#24775a", "ATP (respiration)"]], Pp.cap + 16, top - 44, W - 10);
      if (ff > 0.6) S.draw.label(c, "O₂ insuffisant", W * 0.62, Pp.gy1 + 30, {color:pal.red, size:10.5});
      /* ---- courbe facteur(f) ---- */
      var ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:100, y0:0, y1:Y / 2 + 1, xl:"% d'ATP sans O₂", yl:"× glucose (par rapport à l'aérobie)", stepX:10, stepY:4, pt:20});
      geo = {ax:ax};
      S.draw.area(c, ax, function(x){ return 1 + (Y / 2 - 1) * x / 100; }, 0, f.value, pal.red, 0.08);
      S.draw.fn(c, ax, function(x){ return 1 + (Y / 2 - 1) * x / 100; }, pal.acc, 2.6);
      S.draw.line(c, ax.L, ax.Y(5), ax.R, ax.Y(5), pal.grey, 1, [3, 4]); S.draw.text(c, "× 5", ax.R - 4, ax.Y(5) - 8, {size:10, align:"right", color:pal.grey});
      S.draw.dot(c, ax.X(f.value), ax.Y(fac), 7, pal.red);
      S.draw.label(c, "×" + S.fmt(fac, 2) + " ↔", ax.X(f.value) + (f.value > 80 ? -12 : 12), ax.Y(fac) - 14, {align:f.value > 80 ? "right" : "left", color:pal.red, size:10.5});
      ro.set(0, S.fmt(g, 2) + " mmol/min"); ro.set(1, S.fmt(lac, 1) + " mmol/min"); ro.set(2, "×" + S.fmt(fac, 2)); ro.set(3, S.fmt(D / g, 1));
      var ok = Math.abs(fac - 5) <= 0.1;
      note.set(ok ? "✓ <b>Défi réussi</b> : avec " + f.value + " % d'ATP anaérobie, le muscle brûle " + S.fmt(fac, 2) + " fois plus de glucose (1 + (Y/2 − 1)·f = 5 ⇒ f = 4/(Y/2 − 1) = " + S.fmt(400 / (Y / 2 - 1), 1) + " %) et forme " + S.fmt(lac, 0) + " mmol/min de lactate."
        : "◎ <b>Défi</b> : trouve la part d'ATP produite sans O₂ pour laquelle la consommation de glucose est multipliée par 5 (± 0,1). Glisse le point rouge sur la courbe. Actuellement ×" + S.fmt(fac, 2) + ".", ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ render(dt); }); lp.play();
  }
});

/* 4. Photosynthèse */
SFA.sim({
  id:"ub-c06-photosynthese", ch:"c06", tag:"Photosynthèse",
  titre:"Réactions claires et cycle de Calvin : quel facteur limite ?",
  resume:"Une membrane de thylakoïde éclairée : électrons, protons, ATP et NADPH alimentent le cycle de Calvin, freiné par le plus rare des trois (ATP, NADPH, CO₂).",
  but:"Fais varier la lumière (ou glisse le point sur la courbe de réponse), le flux cyclique autour du PSI et le CO₂. Le cycle de Calvin tourne à la vitesse permise par la ressource la plus rare. Défi : règle le flux cyclique pour fournir exactement 3 ATP pour 2 NADPH.",
  aRetenir:"Calvin : chaque CO₂ fixé coûte 3 ATP et 2 NADPH (soit 18 ATP + 12 NADPH par glucose) : il faut ATP/NADPH = 1,5. Le flux linéaire d'électrons donne ≈ 1,3 ATP par NADPH (valeur théorique ≈ 1,29 pour des ATP synthases à 14 sous-unités c) : il manque ≈ 0,2 ATP/NADPH, comblé en partie par le flux cyclique autour du photosystème I (ATP sans NADPH ni O₂).",
  piege:"L'O₂ vient de l'eau (photolyse au PSII), pas du CO₂. La phase « sombre » n'est pas indépendante de la lumière : elle consomme l'ATP et le NADPH des réactions claires. Modèle simplifié (unités arbitraires) : pas de photorespiration ni de régulation stomatique.",
  build:function(k,S){
    var c = k.canvas(580), pal = P(S), geo = null, drag = false, wheel = 0, st = null, tt = 0;
    c.cv.style.touchAction = "none";
    var L = k.slider("Lumière (NADPH produit)", 0, 10, 0.5, 6, "u/s");
    var cy = k.slider("ATP cyclique ajouté", 0, 0.6, 0.05, 0.1, "ATP/NADPH");
    var co = k.slider("CO₂ disponible", 0, 6, 0.25, 6, "u/s");
    var ro = k.readouts(["ATP produit", "ATP / NADPH", "CO₂ fixé", "Facteur limitant"]);
    var note = k.note("", "");
    c.pointer(function(t, p){ if (!geo) return; if (t === "down") drag = p.y > geo.ax.T - 10; if ((t === "down" || t === "drag") && drag){ L.set(Math.max(0, Math.min(10, Math.round(geo.ax.ix(p.x) * 2) / 2))); k.redraw(); } if (t === "up") drag = false; });
    function vOf(l){ return Math.min(l / 2, l * (1.29 + cy.value) / 3, co.value); }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, nadph = L.value, atp = L.value * (1.29 + cy.value), a = nadph / 2, b = atp / 3, cc = co.value, v = Math.min(a, b, cc), top = 300;
      tt += dt || 0;
      c.clear();
      var my = 150, x2 = W * 0.13, xb = W * 0.33, x1 = W * 0.53, xs = W * 0.74;
      /* stroma et lumen */
      ctx.fillStyle = "#eef7e6"; S.draw.rrect(c, 2, 2, W - 4, my - 12, 12); ctx.fill();
      ctx.fillStyle = "#dceccf"; ctx.fillRect(2, my + 12, W - 4, 70);
      S.draw.text(c, "stroma", W - 10, 14, {size:10, align:"right", color:"#4f7a22"}); S.draw.text(c, "lumen du thylakoïde (H⁺ concentrés)", 10, my + 74, {size:9.5, align:"left", color:"#4f7a22"});
      ctx.fillStyle = "#b9d99b"; ctx.fillRect(2, my - 12, W - 4, 24);
      /* soleil */
      var sunA = L.value / 10; S.draw.glow(c, 22, 22, 26 + 20 * sunA, "#f4c542", 0.2 + 0.6 * sunA); S.draw.dot(c, 22, 22, 9, L.value > 0 ? "#f4c542" : "#cfd6e0");
      for (var q = 0; q < Math.round(L.value / 1.5); q++){ var u = ((tt * 0.9 + q * 0.17) % 1), tx = [x2, x1][q % 2] - 6, px = 22 + (tx - 22) * u, py = 22 + (my - 26 - 22) * u, an = Math.atan2(my - 48, tx - 22); ctx.save(); ctx.translate(px, py); ctx.rotate(an); ctx.strokeStyle = "#e0a400"; ctx.lineWidth = 1.6; ctx.beginPath(); for (var wv = -12; wv <= 0; wv += 1) ctx.lineTo(wv, Math.sin(wv * 1.3) * 2.5); ctx.stroke(); ctx.restore(); }
      for (q = 0; q < Math.round(4 + L.value * 2); q++){ var hxp = 14 + ((q * 53) % Math.max(40, W - 30)), hyp = my + 22 + ((q * 29) % 40); ball(c, hxp, hyp, 2.4, "#c0321d", 0.7); }
      /* complexes */
      function cplx(x, w, h, col, lab){ ctx.fillStyle = col; S.draw.rrect(c, x - w / 2, my - h / 2, w, h, 7); ctx.fill(); S.draw.text(c, lab, x, my, {size:9.5, color:"#fff"}); }
      cplx(x2, 34, 46, "#2f7a4a", "PSII"); cplx(xb, 30, 38, "#6d8a3a", "b₆f"); cplx(x1, 34, 46, "#2f7a4a", "PSI");
      ctx.fillStyle = "#24775a"; S.draw.rrect(c, xs - 10, my - 18, 20, 36, 6); ctx.fill();
      var rot = tt * 4 * (atp / 13); ctx.save(); ctx.translate(xs, my - 34); for (q = 0; q < 3; q++){ var an = rot + q * 2.094; ctx.fillStyle = ["#24775a", "#4aa383", "#7cc3a8"][q]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 14, an, an + 1.7); ctx.closePath(); ctx.fill(); } ctx.restore();
      S.draw.text(c, "ATP synthase", xs, my + 30, {size:9, color:pal.green});
      /* eau → O₂ au PSII */
      S.draw.text(c, "2 H₂O → O₂ + 4 H⁺", x2, my + 50, {size:9, color:"#2f6fd1"});
      if (L.value > 0) for (q = 0; q < 3; q++){ var ub = ((tt * 0.6 + q * 0.33) % 1); S.draw.dot(c, x2 - 18 - ub * 10, my + 36 - ub * 0, 2.5 + ub * 2, "rgba(47,111,209," + (0.7 - ub * 0.6) + ")"); }
      /* électrons : linéaire PSII → b6f → PSI → NADPH */
      var lin = [[x2, my - 6], [xb, my], [x1, my - 6], [x1 + 30, my - 34]];
      var ne = Math.round(L.value * 1.2); for (q = 0; q < ne; q++){ var ue = ((tt * 0.7 + q / Math.max(1, ne)) % 1), pe = along(lin, ue); S.draw.dot(c, pe[0], pe[1], 3.2, "#f4c542"); }
      /* cyclique autour du PSI */
      if (cy.value > 0 && L.value > 0){ var cyc = [[x1, my + 4], [x1 - 20, my + 22], [xb + 14, my + 14], [xb, my + 4]]; S.draw.text(c, "flux cyclique", (x1 + xb) / 2, my + 32, {size:9, color:"#b07a00"});
        var nc = Math.max(1, Math.round(cy.value * L.value * 3)); for (q = 0; q < nc; q++){ var uc = ((tt * 0.8 + q / nc) % 1), pc = along(cyc, uc); S.draw.dot(c, pc[0], pc[1], 3, "#e0a01b"); } }
      /* cycle de Calvin */
      var cx = W * 0.7, cyy = 70, R = Math.min(42, W * 0.1); wheel += (dt || 0) * v * 0.9;
      ctx.save(); ctx.strokeStyle = "#4f7a22"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cyy, R, 0, 6.2832); ctx.stroke(); for (q = 0; q < 6; q++){ var aw = wheel + q * 1.047; S.draw.dot(c, cx + Math.cos(aw) * R, cyy + Math.sin(aw) * R, 3, "#4f7a22"); } ctx.restore();
      S.draw.text(c, "Calvin", cx, cyy - 6, {size:10, color:"#3d5a2a"}); S.draw.text(c, S.fmt(v, 2) + " CO₂/s", cx, cyy + 8, {size:9.5, color:"#3d5a2a"});
      if (!st) st = {n:new Stream([[x1 + 30, my - 34], [cx - R - 6, cyy + 10]], 1.1, "#2f6fd1", "NADPH", 8), a:new Stream([[xs, my - 50], [cx + 4, cyy + R + 4]], 1.1, pal.amber, "ATP", 8), c:new Stream([[W - 10, 44], [cx + R + 4, cyy - 8]], 1.2, "#7b8694", "CO₂", 8), g:new Stream([[cx - R, cyy - 10], [cx - R - 50, 14]], 1.4, "#7a5c2e", "trioses-P", 8)};
      st.n.step(dt || 0, v * 2 * 0.22); st.a.step(dt || 0, v * 3 * 0.22); st.c.step(dt || 0, v * 0.3); st.g.step(dt || 0, v / 3 * 0.3);
      st.n.draw(c, S, [[x1 + 30, my - 34], [cx - R - 6, cyy + 10]]); st.a.draw(c, S, [[xs, my - 50], [cx + 4, cyy + R + 4]]); st.c.draw(c, S, [[W - 10, 44], [cx + R + 4, cyy - 8]]); st.g.draw(c, S, [[cx - R, cyy - 10], [cx - R - 50, 14]]);
      /* jauges d'approvisionnement */
      var names = ["NADPH ÷ 2", "ATP ÷ 3", "CO₂"], vals = [a, b, cc], cols = ["#2f6fd1", pal.amber, "#7b8694"], mn = Math.min(a, b, cc), mx = Math.max(5.5, a, b, cc), gy = my + 92, gw = W - 120;
      S.draw.text(c, "Ce que chaque ressource permet de fixer (CO₂/s) : le minimum gagne", 8, gy, {size:W < 420 ? 9.5 : 10.5, align:"left", color:pal.ink});
      for (q = 0; q < 3; q++){ var yy = gy + 16 + q * 20, lim = Math.abs(vals[q] - mn) < 1e-9 && L.value > 0;
        S.draw.text(c, names[q], 8, yy, {size:10, align:"left", color:lim ? pal.red : pal.ink}); ctx.fillStyle = "#e3e7ed"; ctx.fillRect(84, yy - 6, gw, 12); ctx.fillStyle = lim ? pal.red : cols[q]; ctx.fillRect(84, yy - 6, vals[q] / mx * gw, 12);
        S.draw.text(c, S.fmt(vals[q], 2) + (lim ? " ◀" : ""), 88 + vals[q] / mx * gw, yy, {size:9.5, align:"left", color:lim ? pal.red : pal.ink}); }
      /* ---- courbe de réponse à la lumière ---- */
      var top2 = gy + 76, ax = axIn(S, c, {x:0, y:top2, w:W, h:H - top2}, {x0:0, x1:10, y0:0, y1:Math.max(6.5, 0.1 + Math.max(vOf(10), 1)), xl:"lumière (u/s)", yl:"CO₂ fixé (u/s)", stepX:1, pt:18});
      geo = {ax:ax};
      S.draw.fn(c, ax, function(l){ return l / 2; }, "#2f6fd1", 1.3, [3, 4]); S.draw.fn(c, ax, function(l){ return l * (1.29 + cy.value) / 3; }, pal.amber, 1.3, [3, 4]);
      S.draw.line(c, ax.L, ax.Y(cc), ax.R, ax.Y(cc), "#7b8694", 1.3, [3, 4]);
      S.draw.fn(c, ax, vOf, pal.green, 3);
      S.draw.dot(c, ax.X(L.value), ax.Y(v), 7, pal.green); S.draw.label(c, "↔ " + S.fmt(v, 2), ax.X(L.value) + (L.value > 8 ? -10 : 10), ax.Y(v) - 14, {align:L.value > 8 ? "right" : "left", color:pal.green, size:10.5});
      S.draw.text(c, "plateau : CO₂ limitant", ax.X(9.6), ax.Y(cc) - 9, {size:9.5, align:"right", color:"#5f6b7a", halo:"#fff"});
      var ratio = nadph > 0 ? atp / nadph : NaN, ties = vals.filter(function(x){ return Math.abs(x - mn) < 1e-9; }).length, lim0 = vals.indexOf(mn);
      ro.set(0, S.fmt(atp, 2)); ro.set(1, nadph > 0 ? S.fmt(ratio, 2) : "—"); ro.set(2, S.fmt(v, 2)); ro.set(3, nadph === 0 ? "pas de lumière" : ties > 1 ? "équilibre" : ["NADPH", "ATP", "CO₂"][lim0]);
      var ok = nadph > 0 && Math.abs(ratio - 1.5) <= 0.02;
      note.set(ok ? "✓ <b>Défi réussi</b> : ATP/NADPH = " + S.fmt(ratio, 2) + ", exactement les 3 ATP pour 2 NADPH qu'exige le cycle de Calvin : ni ATP ni NADPH ne s'accumule. Le flux cyclique ajoute " + S.fmt(cy.value, 2) + " ATP par NADPH."
        : "◎ <b>Défi</b> : règle le flux cyclique pour que la membrane fournisse exactement 3 ATP pour 2 NADPH (ATP/NADPH = 1,5 ± 0,02). Actuellement " + (nadph > 0 ? S.fmt(ratio, 2) : "pas de lumière") + ".", ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ render(dt); }); lp.play();
  }
});

/* 5. Régulation : nourri / jeûne */
SFA.sim({
  id:"ub-c06-jeune", ch:"c06", tag:"Régulation",
  titre:"De l'état nourri au jeûne : glycogène puis néoglucogenèse",
  resume:"Le foie vide ses réserves de glycogène puis fabrique du glucose à partir du lactate, du glycérol et des acides aminés ; hormones et corps cétoniques au fil des heures.",
  but:"Lance le temps (ou glisse le curseur sur le graphique) : regarde le glycogène du foie fondre, le pancréas passer de l'insuline au glucagon, les précurseurs de la néoglucogenèse affluer et le cerveau recevoir des corps cétoniques. Défi : trouve l'heure où la néoglucogenèse fournit autant de glucose que la glycogénolyse.",
  aRetenir:"Après les repas, l'insuline domine : stockage (glycogène, lipides). Le jeûne court fait monter le glucagon : le foie libère du glucose par glycogénolyse, puis, quand le glycogène hépatique (≈ 80 à 100 g) s'épuise, par néoglucogenèse (lactate, glycérol, acides aminés). Au-delà de 1 à 2 jours, les corps cétoniques épargnent le glucose au cerveau.",
  piege:"Le glycogène musculaire n'alimente pas la glycémie (pas de glucose-6-phosphatase dans le muscle). Les acides gras ne donnent pas de glucose net chez l'être humain (pas de conversion nette de l'acétyl-CoA en oxaloacétate). Les valeurs du modèle sont des ordres de grandeur, pas des mesures individuelles.",
  build:function(k,S){
    var c = k.canvas(600), pal = P(S), playing = true, geo = null, drag = false, tt = 0, st = null, gran = [], rs = rng(8);
    c.cv.style.touchAction = "none";
    var t = k.slider("Temps depuis la fin de la digestion", 0, 72, 0.5, 0, "h");
    var g0 = k.slider("Glycogène hépatique initial", 50, 120, 10, 90, "g");
    var bP = k.button("⏸ Pause", function(){ if (t.value >= 72) t.set(0); playing = !playing; }, true);
    var ro = k.readouts(["Glycogène restant", "Glycogénolyse", "Néoglucogenèse", "Hormones"]);
    var note = k.note("", "");
    for (var i = 0; i < 60; i++){ var a = rs() * 6.2832, r = Math.sqrt(rs()); gran.push([Math.cos(a) * r, Math.sin(a) * r * 0.7]); }
    c.pointer(function(tp, p){ if (!geo) return; if (tp === "down") drag = p.y > geo.ax.T - 10; if ((tp === "down" || tp === "drag") && drag){ t.set(Math.max(0, Math.min(72, Math.round(geo.ax.ix(p.x) * 2) / 2))); playing = false; k.redraw(); } if (tp === "up") drag = false; });
    function model(){
      var dt = 0.05, G = g0.value, ts = [], gl = [], ng = [], Gs = [], cur = null, tc = NaN;
      for (var x = 0; x <= 72.0001; x += dt){
        var D = x <= 24 ? 8.4 : 8.4 - 3.4 * (x - 24) / 48, s = D * G / (G + 30); if (s * dt > G) s = G / dt;
        ts.push(x); gl.push(s); ng.push(D - s); Gs.push(G);
        if (isNaN(tc) && D - s >= s) tc = x;
        if (cur === null && x >= t.value - 1e-9) cur = ts.length - 1;
        G -= s * dt;
      }
      if (cur === null) cur = ts.length - 1;
      return {ts:ts, gl:gl, ng:ng, Gs:Gs, cur:cur, tc:tc};
    }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, M = model(), cur = M.cur, tv = M.ts[cur], G = M.Gs[cur], gl = M.gl[cur], ng = M.ng[cur], top = W < 420 ? 300 : 280, q;
      tt += dt || 0;
      c.clear();
      ctx.fillStyle = "#fbf7f2"; S.draw.rrect(c, 2, 2, W - 4, top - 8, 12); ctx.fill();
      /* vaisseau sanguin */
      var vy = 150; ctx.fillStyle = "#f3c9c3"; ctx.fillRect(2, vy - 12, W - 4, 24); S.draw.text(c, "sang : glycémie maintenue ≈ 5 mmol/L", W / 2, vy + 22, {size:9.5, color:"#a0525a"});
      /* foie */
      var lx = W * 0.3, ly = 80, lw = Math.min(110, W * 0.24), lh = 52;
      ctx.fillStyle = "#9b4a2e"; ctx.beginPath(); ctx.moveTo(lx - lw, ly); ctx.quadraticCurveTo(lx - lw * 0.6, ly - lh, lx + lw * 0.5, ly - lh * 0.7); ctx.quadraticCurveTo(lx + lw, ly - lh * 0.5, lx + lw * 0.9, ly + 4); ctx.quadraticCurveTo(lx, ly + lh * 0.75, lx - lw, ly); ctx.fill();
      S.draw.text(c, "foie", lx - lw + 14, ly - 34, {size:11, color:"#fff", align:"left"});
      var nG = Math.round(60 * G / 120); for (q = 0; q < nG; q++){ S.draw.dot(c, lx + gran[q][0] * lw * 0.6, ly - 12 + gran[q][1] * lh * 0.6, 3, "#f4d9a6"); }
      S.draw.text(c, "glycogène " + S.fmt(G, 0) + " g", lx, ly + 34, {size:10, color:"#7a3a20"});
      /* pancréas */
      var px = W * 0.72, py = 40, ins = tv < 3 ? 1 - tv / 3 : 0, glu = Math.min(1, tv / 8 + (tv > 24 ? 0.3 : 0));
      ctx.fillStyle = "#e7b77c"; ctx.beginPath(); ctx.ellipse(px, py, Math.min(54, W * 0.12), 14, -0.15, 0, 6.2832); ctx.fill(); S.draw.text(c, "pancréas", px, py, {size:9.5, color:"#6b4a1e"});
      for (q = 0; q < 6; q++){ var u = ((tt * 0.5 + q / 6) % 1), hx = px - 20 + (lx + lw * 0.6 - px + 20) * u, hy = py + 16 + (ly - 30 - py - 16) * u; if (q / 6 < ins) S.draw.dot(c, hx, hy, 3.2, pal.acc); else if (q / 6 < glu) S.draw.dot(c, hx, hy, 3.2, pal.amber); }
      S.draw.text(c, "insuline", px + 4, py + 26, {size:9, color:pal.acc, align:"left"}); S.draw.text(c, "glucagon", px + 4, py + 38, {size:9, color:pal.amber, align:"left"});
      /* muscle et tissu adipeux : précurseurs */
      var mxp = W * 0.12, myp = 200, ax2 = W * 0.42, ay2 = 200;
      ctx.fillStyle = "#c86b74"; ctx.beginPath(); ctx.ellipse(mxp, myp, 34, 13, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; for (q = -24; q <= 24; q += 6){ ctx.beginPath(); ctx.moveTo(mxp + q, myp - 11); ctx.lineTo(mxp + q, myp + 11); ctx.stroke(); } S.draw.text(c, "muscle", mxp, myp + 22, {size:9.5, color:"#a0525a"});
      ctx.fillStyle = "#f2dc9b"; ctx.beginPath(); ctx.arc(ax2 - 10, ay2, 14, 0, 6.2832); ctx.arc(ax2 + 12, ay2 + 2, 13, 0, 6.2832); ctx.fill(); S.draw.text(c, "tissu adipeux", ax2, ay2 + 24, {size:9, color:"#8a6d1c"});
      /* cerveau */
      var bx = W * 0.85, by = 196; ctx.fillStyle = "#f0c4cf"; ctx.beginPath(); ctx.ellipse(bx, by, 34, 24, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#c48a99"; ctx.lineWidth = 1.5; for (q = 0; q < 4; q++){ ctx.beginPath(); ctx.arc(bx - 18 + q * 12, by - 4, 8, 3.4, 6); ctx.stroke(); } S.draw.text(c, "cerveau", bx, by + 32, {size:9.5, color:"#a0525a"});
      var R6 = {gl:[[lx + lw * 0.5, ly + 14], [lx + lw * 0.7, vy - 4], [bx - 30, vy - 4], [bx - 10, by - 20]], ng:[[lx - lw * 0.4, ly + 10], [lx - lw * 0.2, vy + 4], [bx - 30, vy + 4], [bx - 4, by - 20]],
        aa:[[mxp - 10, myp - 14], [mxp - 6, vy], [lx - lw * 0.55, ly + 6]], la:[[mxp + 12, myp - 14], [mxp + 18, vy], [lx - lw * 0.35, ly + 12]], gy:[[ax2, ay2 - 14], [ax2 - 12, vy], [lx - lw * 0.05, ly + 18]], kb:[[lx + lw * 0.85, ly + 2], [lx + lw * 1.05, vy - 8], [bx - 34, by - 28]]};
      if (!st) st = {gl:new Stream(R6.gl, 1.8, "#e0a01b", null, 4), ng:new Stream(R6.ng, 1.8, "#2f6fd1", null, 4), aa:new Stream(R6.aa, 1.6, "#8e2a3a", null, 3.4), la:new Stream(R6.la, 1.6, "#c0321d", null, 3.4), gy:new Stream(R6.gy, 1.6, "#b8901c", null, 3.4), kb:new Stream(R6.kb, 2, "#6236c4", null, 3.6)};
      ["aa", "la", "gy", "kb"].forEach(function(kk){ route(c, R6[kk], st[kk].col); });
      var r0 = 0.55, keto = tv > 24 ? (tv - 24) / 48 : 0;
      st.gl.step(dt || 0, gl * r0); st.ng.step(dt || 0, ng * r0); st.aa.step(dt || 0, ng * r0 * 0.4); st.la.step(dt || 0, ng * r0 * 0.4); st.gy.step(dt || 0, ng * r0 * 0.3); st.kb.step(dt || 0, keto * 2.2);
      ["kb", "aa", "la", "gy", "gl", "ng"].forEach(function(kk){ st[kk].draw(c, S, R6[kk]); });
      keyRow(c, S, [["#e0a01b", "glucose (glycogène)"], ["#2f6fd1", "glucose (néoglucogenèse)"], ["#c0321d", "lactate"], ["#8e2a3a", "alanine"], ["#b8901c", "glycérol"], ["#6236c4", "corps cétoniques"]], 10, top - 34, W - 8);
      S.draw.display(c, S.fmt(tv, 1) + " h", 46, 24, {w:76, h:36, caption:"depuis le repas"});
      /* ---- graphique ---- */
      var ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:72, y0:0, y1:10, xl:"h", yl:"glucose libéré par le foie (g/h)", stepX:12, stepY:2, pt:20});
      geo = {ax:ax};
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.fillStyle = "rgba(194,106,12,.35)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); for (i = 0; i < M.ts.length; i += 4) ctx.lineTo(ax.X(M.ts[i]), ax.Y(M.gl[i])); ctx.lineTo(ax.X(72), ax.Y(0)); ctx.fill();
      ctx.fillStyle = "rgba(31,75,158,.32)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(M.gl[0])); for (i = 0; i < M.ts.length; i += 4) ctx.lineTo(ax.X(M.ts[i]), ax.Y(M.gl[i] + M.ng[i])); for (i = M.ts.length - 1; i >= 0; i -= 4) ctx.lineTo(ax.X(M.ts[i]), ax.Y(M.gl[i])); ctx.fill();
      ctx.restore();
      S.draw.text(c, "glycogénolyse", ax.X(6), ax.Y(2), {size:10.5, color:"#a8560a", halo:"#fff"}); S.draw.text(c, "néoglucogenèse", ax.X(50), ax.Y(3), {size:10.5, color:pal.acc, halo:"#fff"});
      S.draw.line(c, ax.X(tv), ax.T, ax.X(tv), ax.B, pal.red, 2, [4, 3]); S.draw.label(c, "↔ " + S.fmt(tv, 1) + " h", ax.X(tv) > ax.R - 60 ? ax.X(tv) - 8 : ax.X(tv) + 8, ax.B - 12, {align:ax.X(tv) > ax.R - 60 ? "right" : "left", size:10, color:pal.red});
      var out = gl + ng;
      ro.set(0, S.fmt(G, 0) + " g"); ro.set(1, S.fmt(gl, 1) + " g/h (" + S.fmt(100 * gl / out, 0) + " %)"); ro.set(2, S.fmt(ng, 1) + " g/h (" + S.fmt(100 * ng / out, 0) + " %)");
      ro.set(3, tv < 3 ? "insuline↓, glucagon↑" : tv < 24 ? "glucagon↑, cortisol" : "glucagon↑↑, corps cétoniques");
      bP.textContent = playing ? "⏸ Pause" : "▶ Lancer";
      var ok = !isNaN(M.tc) && Math.abs(tv - M.tc) <= 1;
      note.set(ok ? "✓ <b>Défi réussi</b> : vers " + S.fmt(M.tc, 1) + " h, néoglucogenèse et glycogénolyse fournissent chacune la moitié du glucose. Avec un glycogène initial plus faible, cette bascule arrive plus tôt (essaie 50 g)."
        : "◎ <b>Défi</b> : arrête le temps à l'heure où la néoglucogenèse fournit autant de glucose que la glycogénolyse (± 1 h). Actuellement : " + S.fmt(100 * ng / out, 0) + " % de néoglucogenèse.", ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ if (playing){ t.set(Math.min(72, t.value + dt * 4)); if (t.value >= 72) playing = false; } render(dt); }); lp.play();
  }
});
})();


/* BIO3D-BEGIN:s_c06_atpsynthase.js */
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
  id:"ub-c06-3d-atp-synthase", ch:"c06", tag:"ATP synthase · 3D",
  titre:"L'ATP synthase en 3D : un moteur rotatif alimenté par les protons",
  resume:"Les H⁺ font tourner l'anneau c et l'axe γ ; à chaque tiers de tour, un ATP est libéré (changement de liaison de Boyer).",
  but:"Fais pivoter le moteur. Règle la force protonmotrice Δp, la taille de l'anneau c et l'énergie qu'exige l'ATP, puis observe le sens et la vitesse de rotation, et les trois états des sous-unités β.",
  aRetenir:"Les protons passent de l'espace intermembranaire vers la matrice par le canal de la sous-unité a et font tourner l'anneau c (Fo) ; l'axe γ tourne avec lui dans F1 et force les 3 sous-unités β à changer de conformation : ouverte (libère l'ATP), lâche (fixe ADP + Pi), serrée (forme l'ATP). Un tour complet = 3 ATP ; un anneau de n sous-unités c consomme n H⁺ par tour, soit n/3 H⁺ par ATP (8 chez les mammifères : 2,7 ; 10 chez la levure ; 14 dans le chloroplaste : 4,7). Pour synthétiser, il faut Δp ≥ ΔG(ATP) / (n·F).",
  piege:"Ce n'est pas le flux de H⁺ qui « fabrique » l'ATP chimiquement : il fait tourner une pièce mécanique, et la rotation déforme les sites catalytiques. L'enzyme est réversible : si Δp tombe sous le seuil, elle hydrolyse l'ATP et pompe des H⁺ (d'où des inhibiteurs comme IF1). L'oligomycine bloque Fo : la rotation s'arrête. Vitesse d'animation fortement ralentie (le moteur réel tourne à des dizaines de tours par seconde) ; le rendement ATP/NADH réel inclut aussi le transport du phosphate (≈ +1 H⁺ par ATP).",
  build:function(k,S){
    var c = k.canvas(430), pal = P(S), v = V3(c, S, {yaw:0.5, pit:0.42, D:13, sc:46, auto:false});
    var dp = k.slider("Force protonmotrice Δp", 80, 250, 5, 220, "mV");
    var dg = k.slider("ΔG de synthèse de l'ATP", 40, 65, 1, 50, "kJ/mol");
    var csz = k.seg("Anneau c (nombre de sous-unités)", [["8","c₈ mammifère"],["10","c₁₀ levure"],["14","c₁₄ chloroplaste"]], "8");
    var oli = k.toggle("Oligomycine (bloque Fo)", false);
    var ro = k.readouts(["H⁺ par ATP", "Δp minimal", "Sens", "ATP net produits"]);
    var info = k.note("", "ok");
    var phi = 0, nATP = 0, tt = 0, seed = 5, parts = [], emit = 0, bg = [];
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 40; i++) bg.push({x:-3 + rnd() * 6, y:1.0 + rnd() * 2.2, z:-2.2 + rnd() * 4.4});
    for (i = 0; i < 6; i++) bg.push({x:-3 + rnd() * 6, y:-3.4 + rnd() * 0.6, z:-2.2 + rnd() * 4.4});
    var mem = [];
    for (i = -5; i <= 5; i++) for (var j = -4; j <= 4; j++){ if (Math.hypot(i * 0.62, j * 0.62) < 1.75) continue; mem.push([i * 0.62, j * 0.62]); }
    var TWO = 2 * Math.PI;
    function omega(){
      var n = +csz.value, nH = n / 3, thr = dg.value * 1000 / (nH * 96485) * 1000;
      if (oli.value) return 0;
      return Math.max(-1, Math.min(1, (dp.value - thr) / 40)) * 1.9;
    }
    function R(){
      c.clear(); v.sc = Math.min(52, c.W / 6.2); v.oy = -8;
      var n = +csz.value, nH = n / 3, thr = dg.value * 1000 / (nH * 96485) * 1000, w = omega();
      var rc = 0.3 + 0.047 * n, cw = Math.min(0.28, TWO * rc / n * 0.42);
      /* membrane */
      mem.forEach(function(m){ v.ball(m[0], 0.5, m[1], 0.12, "#e3b13a", 0.8); v.ball(m[0], -0.5, m[1], 0.12, "#e3b13a", 0.8); v.seg([m[0], 0.5, m[1]], [m[0], 0.1, m[1]], 0.06, "#cfc7a6", 0.9); v.seg([m[0], -0.5, m[1]], [m[0], -0.1, m[1]], 0.06, "#cfc7a6", 0.9); });
      /* anneau c */
      for (var q = 0; q < n; q++){
        var th = phi + q / n * TWO, ex = ((th - 0) % TWO + TWO) % TWO / TWO;
        var x = rc * Math.cos(th), z = rc * Math.sin(th), prot = ex < 1 - 1 / n;
        v.seg([x, -0.5, z], [x, 0.5, z], cw, q === 0 ? "#dc2626" : "#0e7490", 1);
        if (prot) v.ball(x * 1.18, 0.22, z * 1.18, 0.1, "#ffffff");
      }
      /* sous-unité a avec ses demi-canaux */
      var ax = (rc + cw + 0.18);
      v.seg([ax, -0.5, 0.18], [ax, 0.5, 0.18], 0.5, "#b42318", 1); v.seg([ax, -0.5, -0.2], [ax, 0.5, -0.2], 0.5, "#b42318", 1);
      v.label("a", ax + 0.35, 0.1, 0, "#7f1d1d", 12);
      /* bras périphérique b (stator) jusqu'à F1 */
      v.seg([ax + 0.1, -0.5, 0], [ax + 0.3, -1.9, 0], 0.13, "#6b7280", 1);
      v.label("b (stator)", ax + 0.9, -1.2, 0, pal.grey, 10);
      /* axe γ (tourne) */
      v.seg([0, -0.5, 0], [0, -1.35, 0], 0.15, "#5B21B6", 1);
      v.seg([0, -1.35, 0], [0.3 * Math.cos(phi), -2.15, 0.3 * Math.sin(phi)], 0.15, "#5B21B6", 1);
      v.seg([0, -0.5, 0], [rc * 0.9 * Math.cos(phi), -0.52, rc * 0.9 * Math.sin(phi)], 0.1, "#5B21B6", 1);
      /* F1 : 3 α (gris) + 3 β (colorés par l'état) sur deux étages */
      var stateTxt = [];
      for (q = 0; q < 3; q++){
        var ab = Math.PI / 2 + q * TWO / 3 + 0.2, aa = ab + TWO / 6;
        var d = (((phi - ab) % TWO) + TWO) % TWO / TWO, st = d < 1 / 3 ? 0 : d < 2 / 3 ? 1 : 2;
        var colB = ["#16a34a", "#f59e0b", "#dc2626"][st];
        [-1.5, -2.0].forEach(function(y){ v.ball(0.62 * Math.cos(ab), y, 0.62 * Math.sin(ab), 0.4, colB); v.ball(0.62 * Math.cos(aa), y, 0.62 * Math.sin(aa), 0.4, "#9ca3af"); });
      }
      /* protons */
      bg.forEach(function(b){ b.x += (rnd() - 0.5) * 0.05; b.z += (rnd() - 0.5) * 0.05; b.y += (rnd() - 0.5) * 0.05; if (Math.abs(b.x) > 3) b.x *= 0.98; if (Math.abs(b.z) > 2.3) b.z *= 0.98; if (b.y > 0) { if (b.y < 0.9) b.y = 0.9; if (b.y > 3.2) b.y = 3.2; } else { if (b.y > -2.9) b.y = -2.9; if (b.y < -3.8) b.y = -3.8; }
        v.ball(b.x, b.y, b.z, 0.07, "#fb923c", 0.85); });
      parts.forEach(function(p){ var y = w >= 0 ? 1.4 - p.t * 2.5 : -1.1 + p.t * 2.5; if (p.t >= 0 && p.t <= 1) v.ball(ax + 0.02, y, 0.0, 0.1, "#fb923c"); });
      v.label("Espace intermembranaire : H⁺ nombreux", 0, 3.5, 0, pal.ink, 11);
      v.label("Matrice : peu de H⁺", 1.4, -3.9, 0, pal.ink, 11);
      v.flush();
      /* légende */
      [["#16a34a","β ouverte (libère ATP)"],["#f59e0b","β lâche (ADP + Pi)"],["#dc2626","β serrée (forme ATP)"]].forEach(function(l, i){
        c.ctx.fillStyle = l[0]; c.ctx.beginPath(); c.ctx.arc(10, c.H - 58 + i * 16, 5, 0, 6.3); c.ctx.fill(); S.draw.text(c, l[1], 20, c.H - 58 + i * 16, {size:10.5, align:"left", color:pal.ink}); });
      ro.set(0, S.fmt(nH, 1)); ro.set(1, S.fmt(thr, 0) + " mV"); ro.set(2, oli.value ? "bloqué" : w > 0.02 ? "synthèse" : w < -0.02 ? "hydrolyse" : "équilibre"); ro.set(3, S.fmt(nATP, 0));
      if (oli.value) info.set("Oligomycine : Fo est bloqué, l'anneau c ne tourne plus, le gradient de H⁺ n'est plus dissipé par l'ATP synthase.", "warn");
      else if (w > 0.02) info.set("Δp (" + dp.value + " mV) dépasse le seuil de " + S.fmt(thr, 0) + " mV : les protons font tourner le rotor, 1 ATP libéré à chaque tiers de tour (" + n + " H⁺ par tour).", "ok");
      else if (w < -0.02) info.set("Δp est sous le seuil (" + S.fmt(thr, 0) + " mV) : l'enzyme tourne à l'envers, hydrolyse l'ATP et pompe des H⁺ (vitesse réduite).", "bad");
      else info.set("Δp ≈ seuil : synthèse et hydrolyse s'équilibrent, pas de rotation nette.", "warn");
    }
    k.button("Tourner la vue : auto / manuel", function(){ v.auto = !v.auto; });
    k.draw(R);
    var lp = k.loop(function(dt){
      tt += dt; v.spin(dt); var w = omega(), step = Math.floor(phi / (TWO / 3));
      phi += w * dt; var st2 = Math.floor(phi / (TWO / 3)); nATP += st2 - step; if (nATP < 0) nATP = 0;
      emit += Math.abs(w) / TWO * (+csz.value) * dt;
      while (emit > 1){ emit -= 1; parts.push({t:0}); }
      parts.forEach(function(p){ p.t += dt * 1.5; }); parts = parts.filter(function(p){ return p.t < 1; });
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c06_atpsynthase.js */

/* BIO3D-BEGIN:s_c06_krebs.js */
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
  id:"ub-c06-vis-cycle-krebs", ch:"c06", tag:"Krebs · animé",
  titre:"Le cycle de Krebs animé : suis les carbones",
  resume:"Un jeton parcourt les 8 réactions ; NADH, FADH₂, GTP et CO₂ apparaissent, et chaque carbone est suivi tour après tour.",
  but:"Lance l'animation ou avance réaction par réaction. Coupe l'O₂, ajoute du malonate, augmente la charge énergétique, et regarde d'où viennent réellement les CO₂.",
  aRetenir:"Un tour : acétyl-CoA (C₂) + oxaloacétate (C₄) → citrate (C₆) ; 2 décarboxylations (isocitrate DH et α-cétoglutarate DH) libèrent 2 CO₂ ; on récolte 3 NADH, 1 FADH₂ (succinate DH, complexe II) et 1 GTP/ATP, et l'oxaloacétate est régénéré. Par glucose (2 acétyl-CoA) : 2 tours, soit 6 NADH, 2 FADH₂, 2 GTP, 4 CO₂. Le cycle n'utilise pas O₂ directement, mais dépend de lui pour régénérer NAD⁺ et FAD.",
  piege:"Les 2 CO₂ d'un tour ne proviennent pas des 2 carbones de l'acétyl-CoA qui vient d'entrer, mais de carbones entrés plus tôt (ceux de l'oxaloacétate) : regarde les couleurs. Et sans O₂, le cycle s'arrête, même si aucune de ses réactions ne consomme O₂ : il n'y a plus de NAD⁺. Le modèle donne au cycle un réservoir de NAD⁺ limité (5) et de FAD (2) pour rendre ce blocage visible vite ; une vraie cellule en a plus.",
  build:function(k,S){
    var c = k.canvas(500), pal = P(S);
    var spd = k.slider("Vitesse", 0.3, 3, 0.1, 1.2, "×");
    var chg = k.slider("Charge énergétique (ATP, NADH élevés)", 0, 100, 5, 0, "%");
    var o2 = k.toggle("O₂ présent (chaîne respiratoire active)", true);
    var mal = k.toggle("Malonate (inhibe la succinate déshydrogénase)", false);
    var auto = k.toggle("Animation automatique", true);
    var ro = k.readouts(["Tours", "NADH", "FADH₂", "GTP", "CO₂", "ATP équiv."]);
    var info = k.note("", "ok");
    var NODES = ["Oxaloacétate C₄","Citrate C₆","Isocitrate C₆","α-cétoglutarate C₅","Succinyl-CoA C₄","Succinate C₄","Fumarate C₄","Malate C₄"];
    var ENZ = ["citrate synthase","aconitase","isocitrate déshydrogénase","α-cétoglutarate déshydrogénase","succinyl-CoA synthétase","succinate déshydrogénase","fumarase","malate déshydrogénase"];
    var PROD = ["+ acétyl-CoA (C₂)","isomérisation","NADH + CO₂","NADH + CO₂","GTP (≈ ATP)","FADH₂","+ H₂O","NADH"];
    var PCOL = [pal.amber, pal.grey, pal.red, pal.red, pal.green, pal.violet, pal.grey, pal.red];
    var TC = ["#9ca3af","#2563eb","#dc2626","#16a34a","#f59e0b","#7c3aed","#0891b2"];
    var s = 0, p = 0, turn = 0, nadh = 0, fadh = 0, gtp = 0, co2 = 0, nadPool = 0, fadPool = 0;
    var pool = [0, 0, 0, 0], out = [], stall = "", seed = 11, msg = "";
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var newC = [];
    function blocked(){
      if (s === 5 && mal.value) return "Malonate : la succinate déshydrogénase est inhibée (inhibiteur compétitif du succinate) : le succinate s'accumule, le cycle s'arrête ici.";
      if ((s === 2 || s === 3 || s === 7) && nadPool >= 5) return "Plus de NAD⁺ disponible : sans O₂ la chaîne respiratoire ne réoxyde plus le NADH, la déshydrogénase attend.";
      if (s === 5 && fadPool >= 2) return "Plus de FAD disponible : sans O₂, le FADH₂ n'est pas réoxydé.";
      return "";
    }
    function finish(){
      if (s === 0){ turn++; newC = [turn, turn]; msg = "Citrate synthase : l'acétyl-CoA du tour " + turn + " entre (carbones de couleur n°" + turn + "). Le citrate a 6 carbones : 4 anciens + 2 nouveaux."; }
      if (s === 1) msg = "Aconitase : le citrate est isomérisé en isocitrate (même nombre de carbones).";
      if (s === 2 || s === 3){
        var i = Math.floor(rnd() * pool.length), t = pool.splice(i, 1)[0]; out.push(t); co2++; nadh++; nadPool++;
        msg = "Décarboxylation : un CO₂ part, et son carbone vient du tour " + (t === 0 ? "0 (oxaloacétate de départ)" : t) + (t < turn ? ", pas de l'acétyl-CoA qui vient d'entrer (tour " + turn + ")." : ", ce qui est possible seulement après la symétrisation du succinate.") + " 1 NADH formé.";
        if (s === 3){ pool = pool.concat(newC); newC = []; }
      }
      if (s === 4){ gtp++; msg = "Succinyl-CoA synthétase : phosphorylation au niveau du substrat : 1 GTP (≈ 1 ATP)."; }
      if (s === 5){ fadh++; fadPool++; msg = "Succinate déshydrogénase (complexe II, membrane interne) : 1 FADH₂."; }
      if (s === 6) msg = "Fumarase : hydratation de la double liaison, fumarate → malate.";
      if (s === 7){ nadh++; nadPool++; msg = "Malate déshydrogénase : 1 NADH et l'oxaloacétate est régénéré, prêt pour un nouveau tour."; }
      s = (s + 1) % 8; p = 0;
    }
    function pos(i, cx, cy, Rr){ var a = (-90 + i * 45) * Math.PI / 180; return [cx + Rr * Math.cos(a), cy + Rr * Math.sin(a), a]; }
    function R(){
      c.clear(); var ctx = c.ctx;
      var cx = c.W / 2, cy = 190, Rr = Math.min(c.W * 0.31, 140), fs = c.W < 380 ? 9.5 : 11;
      for (var i = 0; i < 8; i++){
        var a0 = (-90 + i * 45 + 11) * Math.PI / 180, a1 = (-90 + (i + 1) * 45 - 11) * Math.PI / 180, on = (i === s);
        ctx.strokeStyle = on ? pal.acc : "#b6c0cd"; ctx.lineWidth = on ? 3 : 2; ctx.beginPath(); ctx.arc(cx, cy, Rr, a0, a1); ctx.stroke();
        var ex = cx + Rr * Math.cos(a1), ey = cy + Rr * Math.sin(a1), tg = a1 + Math.PI / 2;
        ctx.fillStyle = on ? pal.acc : "#b6c0cd"; ctx.beginPath(); ctx.moveTo(ex + 7 * Math.cos(tg), ey + 7 * Math.sin(tg)); ctx.lineTo(ex + 4 * Math.cos(tg + 2.2), ey + 4 * Math.sin(tg + 2.2)); ctx.lineTo(ex + 4 * Math.cos(tg - 2.2), ey + 4 * Math.sin(tg - 2.2)); ctx.fill();
        var am = (-90 + i * 45 + 22.5) * Math.PI / 180, lx = cx + (Rr + 34) * Math.cos(am), ly = cy + (Rr + 34) * Math.sin(am);
        var al = Math.cos(am) > 0.3 ? "left" : Math.cos(am) < -0.3 ? "right" : "center";
        S.draw.text(c, PROD[i], lx + (al === "left" ? -14 : al === "right" ? 14 : 0), ly, {size:fs - 0.5, color:on ? PCOL[i] : "#6b7280", weight:on ? 800 : 700, align:al});
      }
      for (i = 0; i < 8; i++){
        var q = pos(i, cx, cy, Rr), act = (i === s && p < 0.5) || (i === (s + 1) % 8 && p >= 0.5);
        ctx.fillStyle = act ? "#e8eefc" : "#ffffff"; ctx.strokeStyle = act ? pal.acc : "#8a95a3"; ctx.lineWidth = act ? 2.5 : 1.5;
        ctx.beginPath(); ctx.arc(q[0], q[1], 9, 0, 6.3); ctx.fill(); ctx.stroke();
        var out2 = Math.cos(q[2]) > 0.3 ? "left" : Math.cos(q[2]) < -0.3 ? "right" : "center";
        S.draw.text(c, NODES[i], q[0] + (out2 === "left" ? 14 : out2 === "right" ? -14 : 0), q[1] + (out2 === "center" ? (Math.sin(q[2]) < 0 ? -18 : 18) : 0), {size:fs, align:out2 === "left" ? "left" : out2 === "right" ? "right" : "center", color:act ? pal.acc : pal.ink});
      }
      /* jeton */
      var f = (s + p), tq = pos(f, cx, cy, Rr); ctx.fillStyle = "#f4c542"; ctx.strokeStyle = "#92400e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tq[0], tq[1], 7, 0, 6.3); ctx.fill(); ctx.stroke();
      S.draw.text(c, "Tour " + turn, cx, cy - 18, {size:16, color:pal.ink});
      S.draw.text(c, ENZ[s], cx, cy + 2, {size:fs - 0.5, color:pal.acc, weight:800});
      S.draw.text(c, "réaction " + (s + 1) + " / 8", cx, cy + 20, {size:fs - 1, color:pal.grey});
      /* carbones */
      var y0 = 372;
      S.draw.text(c, "Carbones du cycle (couleur = tour d'entrée)", 8, y0, {size:fs, align:"left", color:pal.ink});
      var all = pool.concat(newC);
      all.forEach(function(t, j){ ctx.fillStyle = TC[t % 7]; ctx.beginPath(); ctx.arc(20 + j * 22, y0 + 20, 8, 0, 6.3); ctx.fill(); S.draw.text(c, t === 0 ? "0" : String(t), 20 + j * 22, y0 + 20, {size:9, color:"#fff"}); });
      S.draw.text(c, "CO₂ libérés (tour d'origine du carbone)", 8, y0 + 50, {size:fs, align:"left", color:pal.ink});
      out.slice(-14).forEach(function(t, j){ ctx.fillStyle = TC[t % 7]; ctx.beginPath(); ctx.arc(20 + j * 22, y0 + 70, 8, 0, 6.3); ctx.fill(); S.draw.text(c, t === 0 ? "0" : String(t), 20 + j * 22, y0 + 70, {size:9, color:"#fff"}); });
      if (!out.length) S.draw.text(c, "(aucun pour l'instant)", 20, y0 + 70, {size:fs - 1, align:"left", color:pal.grey});
      var b = blocked();
      ro.set(0, turn); ro.set(1, nadh); ro.set(2, fadh); ro.set(3, gtp); ro.set(4, co2); ro.set(5, S.fmt(2.5 * nadh + 1.5 * fadh + gtp, 1));
      if (b && p === 0) info.set("<b>Bloqué.</b> " + b, "bad"); else info.set(msg || "Appuie sur « Étape suivante » ou laisse tourner l'animation.", "ok");
    }
    function rate(){ var r = spd.value; if (s === 2 || s === 3) r *= (1 - 0.88 * chg.value / 100); return r; }
    k.button("Étape suivante", function(){ auto.set(false); if (!blocked()) { p = 1; finish(); } }, true);
    k.button("Remettre à zéro", function(){ s = 0; p = 0; turn = 0; nadh = fadh = gtp = co2 = nadPool = fadPool = 0; pool = [0,0,0,0]; out = []; newC = []; msg = ""; });
    k.draw(R);
    var lp = k.loop(function(dt){
      if (o2.value){ var r = Math.min(nadPool, dt * 3); nadPool -= r; var r2 = Math.min(fadPool, dt * 3); fadPool -= r2; }
      if (auto.value && !blocked()){ p += dt * rate() / 1.1; if (p >= 1){ finish(); } }
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c06_krebs.js */
