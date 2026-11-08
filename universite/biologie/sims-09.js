/* Biologie BA1 · chapitre 9 : transmission des caractères */
(function(){
function erfc(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z); var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function phi(z){ return 0.5 * erfc(-z / Math.SQRT2); }
function pchi(x, df){ if (x <= 0) return 1; var p = erfc(Math.sqrt(x / 2)); if (df === 1) return p; return p + Math.sqrt(2 * x / Math.PI) * Math.exp(-x / 2); }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function pfmt(S, p){ return p < 0.001 ? "&lt; 0,001" : S.fmt(p, 3); }
function axIn(S, c, r, o){ o = o || {}; o.l = r.x + (o.pl == null ? 44 : o.pl); o.r = Math.max(4, c.W - r.x - r.w + (o.pr == null ? 10 : o.pr)); o.t = r.y + (o.pt == null ? 16 : o.pt); o.b = Math.max(4, c.H - r.y - r.h + (o.pb == null ? 32 : o.pb)); return S.draw.axes(c, o); }

/* 1. Croisements et chi² */
SFA.sim({
  id:"ub-c09-croisements-chi2", ch:"c09", tag:"Statistique",
  titre:"Croisements mono et dihybrides : le test du χ²",
  resume:"Des pois de Mendel germent dans un plateau : compte les phénotypes, compare à 3:1 ou 9:3:3:1 et place ton χ² sur sa loi.",
  but:"Choisis le croisement, l'effectif et le vrai rapport ; touche le plateau pour un nouveau tirage. Le χ² observé se place sur la courbe de sa loi : au-delà du seuil (zone rouge), on rejette le rapport mendélien. Défi : la vraie proportion est 70 % (et non 75 %) ; trouve le plus petit effectif N qui détecte l'écart en moyenne.",
  aRetenir:"χ² = Σ (O − E)² / E, avec E calculé sur l'effectif total d'après le rapport attendu. Degrés de liberté = nombre de classes − 1 (1 pour 3:1, 3 pour 9:3:3:1). On rejette l'hypothèse mendélienne si χ² dépasse 3,84 (1 ddl) ou 7,81 (3 ddl) au seuil de 5 %. Un χ² faible ne prouve pas l'hypothèse : il ne la contredit pas. Plus N est grand, plus un petit écart réel est détecté (puissance) : le χ² moyen croît proportionnellement à N.",
  piege:"On compare des effectifs, jamais des pourcentages. Chaque effectif attendu doit être ≥ 5. Un échantillon trop petit ne détecte pas une déviation réelle (faible puissance) ; deux tirages du même croisement donnent des χ² différents (fluctuation d'échantillonnage). Liaison génétique (r &lt; 50 %) : le rapport 9:3:3:1 est rejeté si l'échantillon est assez grand. Au-delà de 200 graines, une graine dessinée représente plusieurs descendants.",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(600), seed = 12345, tpop = 0, key = "", obs = [], geo = null;
    c.cv.style.touchAction = "manipulation";
    var mode = k.seg("Croisement", [["m","Monohybride Aa × Aa (3:1)"],["d","Dihybride AaBb × AaBb (9:3:3:1)"]], "m");
    var N = k.slider("Effectif N", 20, 2000, 20, 160, "");
    var q = k.slider("Vraie proportion du phénotype dominant (mono)", 50, 90, 1, 75, "%");
    var r = k.slider("Vraie fréquence de recombinaison r (di)", 0, 50, 1, 50, "%");
    k.button("Nouveau tirage", function(){ seed += 977; }, true);
    var ro = k.readouts(["χ² observé", "ddl · seuil 5 %", "p", "χ² moyen attendu"]);
    var note = k.note("", "");
    function model(){
      if (mode.value === "m") return {probs:[q.value / 100, 1 - q.value / 100], exp:[0.75, 0.25], names:["jaune", "vert"], df:1, ph:[[1,1],[0,1]]};
      var rr = r.value / 100, rec = Math.pow((1 - rr) / 2, 2);
      return {probs:[0.5 + rec, 0.25 - rec, 0.25 - rec, rec], exp:[9 / 16, 3 / 16, 3 / 16, 1 / 16], names:["jaune lisse", "jaune ridé", "vert lisse", "vert ridé"], df:3, ph:[[1,1],[1,0],[0,1],[0,0]]};
    }
    function meanChi(m, n){ var a = 0, b = 0; for (var j = 0; j < m.probs.length; j++){ a += m.probs[j] * (1 - m.probs[j]) / m.exp[j]; b += Math.pow(m.probs[j] - m.exp[j], 2) / m.exp[j]; } return a + n * b; }
    function dens(x, df){ if (x <= 0) return df === 1 ? 2 : 0; return df === 1 ? Math.exp(-x / 2) / Math.sqrt(2 * Math.PI * x) : Math.sqrt(x) * Math.exp(-x / 2) / Math.sqrt(2 * Math.PI); }
    function pea(x, y, R, yellow, round, alpha){
      var ctx = c.ctx; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
      var base = yellow ? "#e9c53c" : "#86b443", dark = yellow ? "#b48a12" : "#4f7a22";
      var g = ctx.createRadialGradient(x - R * .35, y - R * .4, R * .1, x, y, R); g.addColorStop(0, yellow ? "#fff3b8" : "#d7f0a8"); g.addColorStop(.6, base); g.addColorStop(1, dark);
      ctx.fillStyle = g; ctx.beginPath();
      if (round) ctx.arc(x, y, R, 0, 6.2832);
      else { for (var i = 0; i <= 28; i++){ var a = i / 28 * 6.2832, rr = R * (0.86 + 0.1 * Math.sin(a * 7)); if (i) ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); else ctx.moveTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } ctx.closePath(); }
      ctx.fill(); ctx.strokeStyle = dark; ctx.lineWidth = 0.8; ctx.stroke();
      if (!round && R > 4){ ctx.strokeStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.arc(x - R * .1, y + R * .1, R * .45, 3.6, 5.6); ctx.stroke(); }
      ctx.restore();
    }
    function pod(x, y, w, lab){ var ctx = c.ctx; ctx.save(); ctx.fillStyle = "#7fae46"; ctx.strokeStyle = "#4f7a22"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y - 18, x + w / 2, y); ctx.quadraticCurveTo(x, y + 12, x - w / 2, y); ctx.fill(); ctx.stroke(); ctx.restore();
      for (var i = 0; i < 4; i++) pea(x - w * 0.3 + i * w * 0.2, y - 2, 4.6, true, true);
      S.draw.text(c, lab, x, y + 18, {size:11.5, math:true}); }
    function sample(m){
      var R = rng(seed + N.value * 31 + (m.df === 1 ? 1 : 2) + q.value * 7 + r.value * 13), o = m.probs.map(function(){ return 0; }), cls = [], i, j;
      for (i = 0; i < N.value; i++){ var u = R(), acc = 0; for (j = 0; j < m.probs.length; j++){ acc += m.probs[j]; if (u < acc || j === m.probs.length - 1){ o[j]++; break; } } }
      var nd = Math.min(200, N.value), rem = [], tot = 0;
      o.forEach(function(v, j){ var e = v * nd / N.value, f = Math.floor(e); rem.push([e - f, j]); for (var t = 0; t < f; t++) cls.push(j); tot += f; });
      rem.sort(function(a, b){ return b[0] - a[0]; }); for (i = 0; tot < nd; i++, tot++) cls.push(rem[i % rem.length][1]);
      for (i = cls.length - 1; i > 0; i--){ j = Math.floor(R() * (i + 1)); var t2 = cls[i]; cls[i] = cls[j]; cls[j] = t2; }
      return {o:o, cls:cls};
    }
    c.pointer(function(t, p){ if (t === "down" && geo && p.y < geo.trayB){ seed += 977; k.redraw(); } });
    var smp = null;
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, m = model(), i, j;
      var kk = [mode.value, N.value, q.value, r.value, seed].join("|"); if (kk !== key){ key = kk; smp = sample(m); tpop = 0; }
      tpop += dt || 0;
      c.clear();
      /* ---- parents et plateau ---- */
      var di = m.df === 3;
      pod(W * 0.25, 26, 64, di ? "AaBb (jaune, lisse)" : "Aa (jaune)"); pod(W * 0.75, 26, 64, di ? "AaBb (jaune, lisse)" : "Aa (jaune)");
      S.draw.text(c, "×", W / 2, 26, {size:18, color:pal.grey});
      var ty = 58, th = 196, tx = 8, tw = W - 16;
      ctx.fillStyle = "#efe6d6"; S.draw.rrect(c, tx, ty, tw, th, 12); ctx.fill(); ctx.strokeStyle = "#cdbb98"; ctx.lineWidth = 1.5; ctx.stroke();
      var nd = smp.cls.length, cols = Math.max(10, Math.ceil(Math.sqrt(nd * (tw - 12) / (th - 26)))), rows = Math.ceil(nd / cols), cw = (tw - 12) / cols, chh = (th - 26) / rows, R = Math.max(2.5, Math.min(9, Math.min(cw, chh) * 0.42));
      var shown = Math.min(nd, Math.floor(tpop * nd / 1.1));
      for (i = 0; i < nd; i++){
        var x = tx + 6 + cw * (i % cols + .5), y = ty + 6 + chh * (Math.floor(i / cols) + .5), ph = m.ph[smp.cls[i]];
        if (i < shown) pea(x, y, R, ph[0] === 1, ph[1] === 1); else { ctx.fillStyle = "rgba(160,140,100,.25)"; ctx.beginPath(); ctx.arc(x, y, R * 0.35, 0, 6.2832); ctx.fill(); }
      }
      S.draw.label(c, N.value + " descendants" + (N.value > nd ? " · 1 graine ≈ " + S.fmt(N.value / nd, 1) : "") + " · touche pour un nouveau tirage", W / 2, ty + th - 10, {size:10, color:"#6b5a3a", fill:"rgba(255,255,255,.85)"});
      geo = {trayB:ty + th};
      /* ---- χ² ---- */
      var E = m.exp.map(function(e){ return e * N.value; }), chi = 0, o = smp.o;
      for (j = 0; j < E.length; j++) chi += Math.pow(o[j] - E[j], 2) / E[j];
      var crit = m.df === 1 ? 3.841 : 7.815, pv = pchi(chi, m.df), done = shown >= nd;
      /* ---- barres observé / attendu ---- */
      var top = ty + th + 12, wide = W >= 500, rB, rC;
      if (wide){ rB = {x:0, y:top, w:W * 0.5, h:H - top}; rC = {x:W * 0.5, y:top, w:W * 0.5, h:H - top}; }
      else { var hh = (H - top) / 2; rB = {x:0, y:top, w:W, h:hh}; rC = {x:0, y:top + hh, w:W, h:hh}; }
      var mx = Math.max.apply(null, o.concat(E)) * 1.18, n2 = m.names.length, bx0 = rB.x + 40, bw = (rB.w - 50) / n2, base = rB.y + rB.h - 30, hmax = rB.h - 52;
      S.draw.text(c, "Effectifs : observé · attendu", rB.x + 8, rB.y + 8, {size:11, align:"left", color:pal.ink});
      S.draw.line(c, bx0 - 4, base, rB.x + rB.w - 6, base, "#a3adba", 1);
      for (j = 0; j < n2; j++){
        var xx = bx0 + j * bw, h1 = (done ? o[j] : 0) / mx * hmax, h2 = E[j] / mx * hmax, ww = Math.min(26, bw / 2 - 6);
        ctx.fillStyle = pal.acc; ctx.fillRect(xx + bw / 2 - ww - 2, base - h1, ww, h1);
        ctx.fillStyle = "#cfd6e0"; ctx.fillRect(xx + bw / 2 + 2, base - h2, ww, h2);
        if (done) S.draw.text(c, o[j] + "", xx + bw / 2 - ww / 2 - 2, base - h1 - 8, {size:10.5, color:pal.acc});
        S.draw.text(c, S.fmt(E[j], 1), xx + bw / 2 + ww / 2 + 2, base - h2 - 8, {size:9.5, color:pal.grey});
        pea(xx + bw / 2, base + 13, 6.5, m.ph[j][0] === 1, m.ph[j][1] === 1);
      }
      /* ---- loi du χ² ---- */
      var xm = Math.max(m.df === 1 ? 10 : 16, Math.min(40, chi * 1.15)), ymax = m.df === 1 ? 1 : 0.3;
      var ax = axIn(S, c, rC, {x0:0, x1:xm, y0:0, y1:ymax, xl:"χ²", yl:"densité (ddl = " + m.df + ")", stepY:m.df === 1 ? 0.25 : 0.1, pt:20});
      S.draw.area(c, ax, function(x){ return Math.min(ymax, dens(x, m.df)); }, crit, xm, pal.red, 0.18);
      S.draw.fn(c, ax, function(x){ return dens(x, m.df); }, pal.ink, 2);
      S.draw.line(c, ax.X(crit), ax.T, ax.X(crit), ax.B, pal.red, 1.4, [4, 3]);
      S.draw.text(c, "seuil " + S.fmt(crit, 2), ax.X(crit) + 4, ax.T + 24, {size:10, align:"left", color:pal.red, halo:"#fff"});
      S.draw.text(c, "rejet (5 %)", ax.X((crit + xm) / 2), ax.Y(ymax * 0.35), {size:10, color:pal.red, halo:"#fff"});
      var mc = meanChi(m, N.value);
      if (mc < xm){ S.draw.line(c, ax.X(mc), ax.B - 12, ax.X(mc), ax.B, pal.violet, 2); S.draw.text(c, "moyen", ax.X(mc), ax.B - 18, {size:9.5, color:pal.violet, halo:"#fff"}); }
      if (done){ var cx = ax.X(Math.min(chi, xm)); S.draw.dot(c, cx, ax.Y(0) - 1, 7, chi > crit ? pal.red : pal.green); S.draw.label(c, "χ² = " + S.fmt(chi, 2) + (chi > xm ? " →" : ""), Math.min(ax.R - 40, Math.max(ax.L + 40, cx)), ax.Y(ymax * 0.62), {size:10.5, color:chi > crit ? pal.red : pal.green}); }
      ro.set(0, done ? S.fmt(chi, 2) : "…"); ro.set(1, m.df + " · " + S.fmt(crit, 2)); ro.set(2, done ? pfmt(S, pv) : "…"); ro.set(3, S.fmt(mc, 2));
      /* ---- défi ---- */
      var dTxt, ok;
      if (m.df === 1){ ok = q.value === 70 && mc > crit && meanChi(m, N.value - 20) <= crit;
        dTxt = ok ? "✓ <b>Défi réussi</b> : avec N = " + N.value + ", le χ² moyen (" + S.fmt(mc, 2) + ") dépasse 3,84 pour la première fois. Un écart réel de 5 points (70 % au lieu de 75 %) passe inaperçu dans un petit échantillon."
          : "◎ <b>Défi</b> : règle la vraie proportion sur 70 % et trouve le plus petit N (pas de 20) pour lequel le χ² moyen attendu dépasse le seuil 3,84 (trait violet au-delà de la zone rouge)."; }
      else { ok = r.value === 40 && mc > crit && meanChi(m, N.value - 20) <= crit;
        dTxt = ok ? "✓ <b>Défi réussi</b> : avec r = 40 % (gènes liés), il faut N ≥ " + N.value + " pour que le χ² moyen dépasse 7,81 et révèle la liaison."
          : "◎ <b>Défi</b> : gènes liés à r = 40 % ; trouve le plus petit N (pas de 20) pour lequel le χ² moyen attendu dépasse 7,81."; }
      var low = Math.min.apply(null, E) < 5, res = !done ? "" : chi > crit ? " Ce tirage : χ² &gt; seuil, on rejette le rapport attendu (p &lt; 0,05)." : " Ce tirage : χ² ≤ seuil, écart compatible avec le hasard.";
      note.set(dTxt + res + (low ? " Attention : un effectif attendu est inférieur à 5 (" + S.fmt(Math.min.apply(null, E), 1) + ") : test peu fiable." : ""), ok ? "ok" : low ? "warn" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ if (tpop < 1.3) render(dt); }); lp.play();
  }
});

/* 2. Liaison génétique */
SFA.sim({
  id:"ub-c09-liaison-trois-points", ch:"c09", tag:"Cartographie",
  titre:"Liaison génétique : croisement-test à trois points",
  resume:"Des méioses animées avec leurs chiasmas, les 8 classes de descendants, et une carte mystère à reconstruire en glissant les gènes.",
  but:"Regarde les méioses : un chiasma entre deux chromatides échange les allèles situés au-delà. Glisse les gènes B et C sur le chromosome pour changer les distances. Défi « carte mystère » : retrouve les distances cachées à partir des effectifs observés.",
  aRetenir:"Croisement-test ABC/abc × abc/abc : les classes parentales sont les plus fréquentes, les doubles recombinants (DCO) sont les plus rares et ne diffèrent des parentales que par le gène du milieu : cela donne l'ordre des gènes. Distance (cM) = % de recombinants. Coïncidence = DCO observés / DCO attendus (d₁·d₂) ; interférence = 1 − coïncidence. Distance A–C = d₁ + d₂ ; sans compter les doubles crossing-over on la sous-estime (d₁ + d₂ − 2·DCO).",
  piege:"1 cM ≈ 1 % de recombinants seulement pour les petites distances (≤ 20–30 cM) : la fréquence de recombinaison plafonne à 50 %. Un chiasma ne concerne que 2 des 4 chromatides : une méiose avec un chiasma donne 2 gamètes recombinants et 2 parentaux. Modèle simplifié : au plus un chiasma par intervalle (distances ≤ 25 cM) ; les barres donnent les effectifs attendus, l'animation un échantillon qui fluctue.",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(520), RED = "#c0392b", BLU = "#2563c9", rs = rng(5), tally = [0,0,0,0,0,0,0,0], nme = 0, me = null, tm = 0, myst = null, geo = null, drag = null, key = "";
    c.cv.style.touchAction = "none";
    var d1 = k.slider("Distance A–B", 1, 25, 1, 12, "cM");
    var d2 = k.slider("Distance B–C", 1, 25, 1, 18, "cM");
    var co = k.slider("Coïncidence", 0, 1, 0.1, 0.6, "");
    var N = k.slider("Descendants N", 500, 5000, 500, 2000, "");
    var bM = k.button("Défi : carte mystère", function(){ if (myst){ myst = null; } else { var R = rng(Date.now() % 100000); myst = {d1:3 + Math.floor(R() * 20), d2:3 + Math.floor(R() * 20), co:Math.round(R() * 10) / 10}; } }, true);
    k.button("Vider le comptage", function(){ tally = [0,0,0,0,0,0,0,0]; nme = 0; });
    var ro = k.readouts(["Doubles CO attendus", "A–C sans les DCO", "A–C réelle d₁ + d₂", "Interférence"]);
    var note = k.note("", "");
    /* classes : bits [A, B, C] = 1 si allèle majuscule */
    var CL = [[1,1,1],[0,0,0],[1,0,0],[0,1,1],[1,1,0],[0,0,1],[1,0,1],[0,1,0]], CN = ["A B C","a b c","A b c","a B C","A B c","a b C","A b C","a B c"], KIND = ["Parentale","Parentale","Recomb. A–B","Recomb. A–B","Recomb. B–C","Recomb. B–C","Double CO","Double CO"], KC = ["#2e6b55","#2e6b55","#b45309","#b45309","#1e3f8f","#1e3f8f","#b42318","#b42318"];
    function freqs(a, b, cc){ var dco = cc * a * b, par = 1 - a - b + dco, s1 = a - dco, s2 = b - dco; return [par / 2, par / 2, s1 / 2, s1 / 2, s2 / 2, s2 / 2, dco / 2, dco / 2]; }
    function clsOf(bits){ for (var i = 0; i < 8; i++) if (CL[i][0] === bits[0] && CL[i][1] === bits[1] && CL[i][2] === bits[2]) return i; return 0; }
    function newMeiosis(){
      var a = d1.value / 100, b = d2.value / 100, dco = co.value * a * b, P = [1 - 2 * a - 2 * b + 2 * dco, 2 * (a - dco), 2 * (b - dco), 2 * dco], u = rs(), ev = 0, acc = 0;
      for (var i = 0; i < 4; i++){ acc += P[i]; if (u < acc){ ev = i; break; } ev = i; }
      me = {ev:ev, p1:0.15 + 0.7 * rs(), p2:0.15 + 0.7 * rs()}; tm = 0;
    }
    function products(){ /* 4 chromatides : [rouge autre, rouge participante, bleue participante, bleue autre] → bits */
      var ch = [[1,1,1],[1,1,1],[0,0,0],[0,0,0]];
      if (me.ev === 1 || me.ev === 3){ for (var g = 1; g < 3; g++){ var t = ch[1][g]; ch[1][g] = ch[2][g]; ch[2][g] = t; } }
      if (me.ev === 2 || me.ev === 3){ var t2 = ch[1][2]; ch[1][2] = ch[2][2]; ch[2][2] = t2; }
      return ch;
    }
    c.pointer(function(t, p){
      if (!geo) return;
      if (t === "down"){ drag = null; if (Math.abs(p.y - geo.y) < 40){ if (Math.abs(p.x - geo.xB) < 18) drag = "B"; else if (Math.abs(p.x - geo.xC) < 18) drag = "C"; } }
      if ((t === "down" || t === "drag") && drag){
        var cm = (p.x - geo.xA) / geo.sc;
        if (drag === "B"){ var tot = d1.value + d2.value, nb = Math.max(1, Math.min(25, Math.round(cm))); if (tot - nb >= 1 && tot - nb <= 25){ d1.set(nb); d2.set(tot - nb); } }
        else { d2.set(Math.max(1, Math.min(25, Math.round(cm - d1.value)))); }
        k.redraw();
      }
      if (t === "up") drag = null;
    });
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, i, j;
      var kk = [d1.value, d2.value, co.value].join("|"); if (kk !== key){ key = kk; tally = [0,0,0,0,0,0,0,0]; nme = 0; newMeiosis(); }
      tm += (dt || 0) / 2.4;
      if (tm >= 1){ products().forEach(function(b){ tally[clsOf(b)]++; }); nme++; newMeiosis(); }
      c.clear();
      /* ---- chromosomes ---- */
      var sc = Math.min(9, (W - 70) / 50), xA = W / 2 - (d1.value + d2.value) * sc / 2, xB = xA + d1.value * sc, xC = xB + d2.value * sc, x0 = Math.max(10, xA - 24), x1 = Math.min(W - 10, xC + 24);
      var e = tm, sep = Math.max(0, Math.min(1, (e - 0.62) / 0.3)), swap = e > 0.42, chi = Math.max(0, Math.min(1, (e - 0.18) / 0.22));
      S.draw.text(c, "Méiose n° " + (nme + 1) + " d'un hétérozygote ABC/abc", 6, 12, {size:11.5, align:"left", color:pal.ink});
      S.draw.text(c, ["aucun chiasma", "chiasma A–B", "chiasma B–C", "deux chiasmas"][me.ev], W - 6, 12, {size:10.5, align:"right", color:me.ev ? pal.red : pal.grey});
      var ys = [42, 58, 74, 90], yC = 66, ch = products(), pos = [xA, xB, xC], cx1 = xA + (xB - xA) * me.p1, cx2 = xB + (xC - xB) * me.p2;
      for (i = 0; i < 4; i++){
        var y = ys[i] + (i < 2 ? -1 : 1) * sep * 14 + (i % 2 ? 1 : -1) * sep * 0, orig = i < 2 ? 1 : 0;
        /* segments colorés selon l'origine */
        var cut = [x0], cols = [orig];
        if (swap && (i === 1 || i === 2)){ if (me.ev === 1 || me.ev === 3){ cut.push(cx1); cols.push(1 - orig); } if (me.ev === 2 || me.ev === 3){ cut.push(cx2); cols.push(me.ev === 3 ? orig : 1 - orig); } }
        cut.push(x1);
        for (j = 0; j < cols.length; j++){ ctx.strokeStyle = cols[j] ? RED : BLU; ctx.lineWidth = 8; ctx.lineCap = j === 0 || j === cols.length - 1 ? "round" : "butt"; ctx.beginPath(); ctx.moveTo(cut[j], y); ctx.lineTo(cut[j + 1], y); ctx.stroke(); }
        var bits = swap ? ch[i] : [orig, orig, orig];
        for (j = 0; j < 3; j++){ ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(pos[j], y, 5.5, 0, 6.2832); ctx.fill(); S.draw.text(c, bits[j] ? "ABC"[j] : "abc"[j], pos[j], y + 0.5, {size:9.5, color:bits[j] ? RED : BLU}); }
      }
      [[0, 1], [2, 3]].forEach(function(pr){ var ya = ys[pr[0]] + (pr[0] < 2 ? -1 : 1) * sep * 14, yb2 = ys[pr[1]] + (pr[1] < 2 ? -1 : 1) * sep * 14; ctx.fillStyle = pr[0] ? "#1e4a99" : "#8e2a20"; S.draw.rrect(c, x0 + 6, ya - 4, 9, yb2 - ya + 8, 4.5); ctx.fill(); });
      ctx.save(); ctx.globalAlpha = chi * (1 - sep);
      if (me.ev === 1 || me.ev === 3){ S.draw.line(c, cx1 - 6, ys[1] - 5, cx1 + 6, ys[2] + 5, pal.ink, 2); S.draw.line(c, cx1 + 6, ys[1] - 5, cx1 - 6, ys[2] + 5, pal.ink, 2); }
      if (me.ev === 2 || me.ev === 3){ S.draw.line(c, cx2 - 6, ys[1] - 5, cx2 + 6, ys[2] + 5, pal.ink, 2); S.draw.line(c, cx2 + 6, ys[1] - 5, cx2 - 6, ys[2] + 5, pal.ink, 2); }
      ctx.restore();
      /* poignées et carte */
      var my = 132;
      S.draw.line(c, xA, my, xC, my, pal.ink, 3);
      [["A", xA, false], ["B", xB, true], ["C", xC, true]].forEach(function(g){ S.draw.dot(c, g[1], my, g[2] ? 8 : 6, g[2] ? pal.amber : pal.ink); S.draw.text(c, g[0] + (g[2] ? " ↔" : ""), g[1], my + 18, {size:11.5}); });
      S.draw.text(c, d1.value + " cM", (xA + xB) / 2, my - 12, {size:10.5}); S.draw.text(c, d2.value + " cM", (xB + xC) / 2, my - 12, {size:10.5});
      geo = {xA:xA, xB:xB, xC:xC, y:my, sc:sc};
      if (sep > 0.3){ for (i = 0; i < 4; i++){ var cl = clsOf(ch[i]); S.draw.text(c, CN[cl], x1 + 2 > W - 50 ? W - 6 : x1 + 4, ys[i] + (i < 2 ? -1 : 1) * sep * 14, {size:9.5, align:x1 + 2 > W - 50 ? "right" : "left", color:KC[cl], math:true, halo:"#fff"}); } }
      /* ---- 8 classes ---- */
      var f = freqs(d1.value / 100, d2.value / 100, co.value), fm = myst ? freqs(myst.d1 / 100, myst.d2 / 100, myst.co) : null, n = myst ? 2000 : N.value;
      var top = 168, rowH = Math.min(36, (H - top - 22) / 8), lx = 54, bwmax = W - lx - 96, mx = Math.max(f[0], fm ? fm[0] : 0, 0.01);
      S.draw.text(c, myst ? (W < 420 ? "Mystère (gris) · ta carte (couleur)" : "Carte mystère (gris) contre ta carte (couleur) · N = 2 000") : (W < 420 ? "Attendus sur " + N.value + " · méioses (●)" : "Effectifs attendus sur " + N.value + " (barres) · comptage des méioses (●)"), 6, top - 6, {size:10.5, align:"left", color:pal.ink});
      var totT = tally.reduce(function(a, b){ return a + b; }, 0);
      for (i = 0; i < 8; i++){
        var y2 = top + 6 + i * rowH, bh = Math.min(14, rowH * 0.42), cnt = Math.round(f[i] * n);
        S.draw.text(c, CN[i], 6, y2 + rowH * 0.35, {size:11, align:"left", math:true, color:KC[i]});
        if (fm){ ctx.fillStyle = "#b8c0cc"; ctx.fillRect(lx, y2 + 2, Math.max(1, fm[i] / mx * bwmax), bh); S.draw.text(c, Math.round(fm[i] * 2000) + "", lx + Math.max(1, fm[i] / mx * bwmax) + 4, y2 + 2 + bh / 2, {size:10, align:"left", color:pal.grey}); }
        var yb = fm ? y2 + 3 + bh : y2 + 2 + bh / 2;
        ctx.fillStyle = KC[i]; ctx.fillRect(lx, yb, Math.max(1, f[i] / mx * bwmax), fm ? bh * 0.8 : bh);
        S.draw.text(c, cnt + "", lx + Math.max(1, f[i] / mx * bwmax) + 4, yb + (fm ? bh * 0.4 : bh / 2), {size:10.5, align:"left", color:KC[i]});
        if (!fm && totT > 0) S.draw.dot(c, lx + (tally[i] / totT) / mx * bwmax, yb + bh / 2, 3.5, pal.ink);
        S.draw.text(c, KIND[i], W - 4, y2 + rowH * 0.35, {size:9.5, align:"right", color:pal.grey});
      }
      var a = d1.value / 100, b = d2.value / 100, dco = co.value * a * b;
      ro.set(0, Math.round(dco * N.value)); ro.set(1, S.fmt((a + b - 2 * dco) * 100, 1) + " cM"); ro.set(2, (d1.value + d2.value) + " cM"); ro.set(3, S.fmt(1 - co.value, 1));
      bM.textContent = myst ? "Quitter la carte mystère" : "Défi : carte mystère";
      if (myst){
        var e1 = Math.abs(d1.value - myst.d1), e2 = Math.abs(d2.value - myst.d2), e3 = Math.abs(co.value - myst.co), ok = e1 <= 1 && e2 <= 1 && e3 <= 0.11;
        note.set(ok ? "✓ <b>Carte retrouvée</b> : A–B = " + myst.d1 + " cM, B–C = " + myst.d2 + " cM, coïncidence " + S.fmt(myst.co, 1) + ". Méthode : d₁ = (recombinants A–B + DCO)/N, d₂ = (recombinants B–C + DCO)/N, coïncidence = DCO observés / (d₁·d₂·N)."
          : "◎ <b>Carte mystère</b> : glisse B et C (ou les curseurs) et règle la coïncidence pour que tes barres colorées égalent les grises. " + (e1 > 1 ? "d₁ " + (d1.value < myst.d1 ? "trop petite" : "trop grande") + ". " : "d₁ ✓. ") + (e2 > 1 ? "d₂ " + (d2.value < myst.d2 ? "trop petite" : "trop grande") + ". " : "d₂ ✓. ") + (e3 > 0.11 ? "Coïncidence à ajuster (regarde les doubles CO)." : "Coïncidence ✓."), ok ? "ok" : "");
      } else note.set("Méioses comptées : " + nme + " (" + totT + " gamètes) ; les points ● rejoignent peu à peu les proportions attendues. Lance le défi « carte mystère » pour reconstruire une carte à partir des effectifs.", "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ render(dt); }); lp.play();
  }
});


/* 3. Arbre généalogique : risque */
SFA.sim({
  id:"ub-c09-risque-heredite", ch:"c09", tag:"Génétique médicale",
  titre:"Calcul de risque : autosomique, dominant, lié à l'X",
  resume:"Échiquier de croisement animé, probabilité d'un enfant atteint ou porteur selon le sexe, et une famille tirée au hasard dessinée en notation d'arbre généalogique.",
  but:"Choisis le mode de transmission et le couple ; lis le risque par enfant, par garçon et par fille. Touche l'échiquier pour faire naître des enfants au hasard (carré = garçon, rond = fille, plein = atteint, demi = porteur). Relève les défis.",
  aRetenir:"Récessif autosomique : Aa × Aa → 1/4 atteints, 1/2 porteurs ; un sujet sain issu de ce couple est porteur avec probabilité 2/3. Dominant : un parent hétérozygote atteint transmet avec probabilité 1/2. Récessif lié à l'X : une mère porteuse a 1/2 de garçons atteints et 1/2 de filles porteuses ; un père atteint transmet son X à toutes ses filles (porteuses) et jamais à ses fils.",
  piege:"« 2/3, pas 1/2 » : on sait que l'individu n'est pas aa, il reste 3 génotypes (AA, Aa, Aa) dont 2 porteurs. Chaque grossesse est indépendante : après un enfant atteint, le risque reste 1/4. Lié à l'X : le sexe de l'enfant se lit dans le gamète paternel (Y → garçon).",
  build:function(k,S){
    var c = k.canvas(400), pal = S.draw.palette, fam = [], flash = -1, ft = 0, ta = 1, lastSit = null, di = 0, rr = rng(77), geo = null, cellsNow = [];
    c.cv.style.touchAction = "manipulation";
    var sit = k.select("Situation", [
      ["r1","Autosomique récessif : Aa × Aa"],["r2","Autosomique récessif : Aa × aa"],["r3","Autosomique récessif : Aa × AA"],
      ["r4","Récessif : frère atteint, partenaire pris au hasard"],
      ["d1","Autosomique dominant : Dd × dd"],["d2","Autosomique dominant : Dd × Dd"],
      ["x1","Récessif lié à l'X : mère porteuse × père sain"],["x2","Récessif lié à l'X : mère saine × père atteint"],["x3","Récessif lié à l'X : mère porteuse × père atteint"]], "r1");
    var f = k.slider("Partenaire : 1 porteur sur", 10, 500, 5, 25, "");
    var ro = k.readouts(["Enfant atteint","Garçon atteint","Fille atteinte","Enfant porteur (sain)"]);
    k.button("Tirer un enfant", function(){ birth(); }, true);
    k.button("Nouvelle famille", function(){ fam = []; });
    k.button("Défi suivant", function(){ di = (di + 1) % DEF.length; });
    var note = k.note("", "ok");
    var DEF = [
      {t:"trouve un couple de deux parents sains qui peut avoir un enfant atteint, avec un risque de 1/4 par enfant.", ok:function(v){ return v === "r1"; }, sol:"Aa × Aa : deux porteurs sains, 1/4 d'enfants aa."},
      {t:"trouve un couple dont les garçons ont 50 % de risque d'être atteints et les filles 0 %.", ok:function(v){ return v === "x1"; }, sol:"Mère porteuse X<sup>A</sup>X<sup>a</sup> × père sain : le fils reçoit le X de sa mère (1/2 de Xa), la fille reçoit le X<sup>A</sup> du père."},
      {t:"trouve un couple dont aucun enfant n'est atteint mais dont toutes les filles sont porteuses.", ok:function(v){ return v === "x2"; }, sol:"Père atteint : il donne son X<sup>a</sup> à toutes ses filles (porteuses) et son Y à ses fils (sains)."},
      {t:"frère atteint, partenaire pris au hasard : règle la fréquence des porteurs pour que le risque par enfant vaille 1/150.", ok:function(v){ return v === "r4" && f.value === 25; }, sol:"2/3 × 1/25 × 1/4 = 1/150 (fréquence de porteurs de la mucoviscidose en Europe ≈ 1/25)."}
    ];
    function birth(){ if (sit.value === "r4" || !cellsNow.length) return; var n = Math.floor(rr() * 4), cl = cellsNow[n], sex = cl.sex || (rr() < 0.5 ? "G" : "F"); fam.push({sex:sex, aff:cl.aff, car:cl.car}); if (fam.length > 24) fam.shift(); flash = n; ft = 0.9; }
    c.pointer(function(t, p){ if (t === "down" && geo && p.x > geo.x0 && p.x < geo.x0 + 2 * geo.w && p.y > geo.y0 && p.y < geo.y0 + 128){ birth(); k.redraw(); } });
    function sym(x, y, r, sx, aff, car){ var ctx = c.ctx; ctx.save(); ctx.lineWidth = 1.6; ctx.strokeStyle = pal.ink; ctx.fillStyle = aff ? pal.red : "#fff"; ctx.beginPath(); if (sx === "G") ctx.rect(x - r, y - r, 2 * r, 2 * r); else ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      if (car && !aff){ ctx.save(); ctx.clip(); ctx.fillStyle = pal.amber; ctx.fillRect(x, y - r, r, 2 * r); ctx.restore(); } ctx.beginPath(); if (sx === "G") ctx.rect(x - r, y - r, 2 * r, 2 * r); else ctx.arc(x, y, r, 0, 6.2832); ctx.stroke(); ctx.restore(); }
    function defi(v){ var d = DEF[di], ok = d.ok(v); return [(ok ? "✓ <b>Défi " + (di + 1) + "/4 réussi</b> : " + d.sol : "◎ <b>Défi " + (di + 1) + "/4</b> : " + d.t), ok]; }
    var defs = {
      r1:{t:"A", m:["A","a"], p:["A","a"]}, r2:{t:"A", m:["A","a"], p:["a","a"]}, r3:{t:"A", m:["A","a"], p:["A","A"]},
      d1:{t:"D", m:["D","d"], p:["d","d"]}, d2:{t:"D", m:["D","d"], p:["D","d"]},
      x1:{t:"X", m:["XA","Xa"], p:["XA","Y"]}, x2:{t:"X", m:["XA","XA"], p:["Xa","Y"]}, x3:{t:"X", m:["XA","Xa"], p:["Xa","Y"]}
    };
    function render(dt){
      c.clear();
      var v = sit.value, ctx = c.ctx;
      if (v !== lastSit){ lastSit = v; ta = 0; fam = []; } ta = Math.min(1, ta + (dt || 0) / 0.8); ft = Math.max(0, ft - (dt || 0));
      if (v === "r4"){
        var risk = 2 / 3 * (1 / f.value) * 0.25;
        S.draw.text(c, "Les parents du frère atteint sont tous deux porteurs (Aa × Aa).", c.W / 2, 40, {size:12});
        S.draw.text(c, "P(sujet sain est porteur) = 2/3", c.W / 2, 80, {size:14});
        S.draw.text(c, "P(partenaire porteur) = 1/" + f.value, c.W / 2, 112, {size:14});
        S.draw.text(c, "P(enfant atteint | les deux porteurs) = 1/4", c.W / 2, 144, {size:14});
        S.draw.text(c, "Risque = 2/3 × 1/" + f.value + " × 1/4 = 1/" + S.fmt(f.value * 6, 0) + " (" + S.fmt(risk * 100, 2) + " %)", c.W / 2, 200, {size:15, color:pal.red});
        ro.set(0, "1/" + S.fmt(f.value * 6, 0)); ro.set(1, "idem"); ro.set(2, "idem"); ro.set(3, "—");
        cellsNow = []; geo = null;
        S.draw.text(c, "Pas d'échiquier ici : on multiplie des probabilités indépendantes.", c.W / 2, 240, {size:11, color:pal.grey});
        var dq = defi(v); note.set(dq[0], dq[1] ? "ok" : ""); return;
      }
      var d = defs[v], cells = [], aff = {all:0, b:0, g:0}, car = 0, nb = 0, ng = 0, i, j;
      for (i = 0; i < 2; i++) for (j = 0; j < 2; j++){
        var m = d.m[i], p = d.p[j], isAff, sex = null, isCar = false, lab;
        if (d.t === "X"){ sex = p === "Y" ? "G" : "F"; isAff = sex === "G" ? m === "Xa" : (m === "Xa" && p === "Xa"); isCar = sex === "F" && ((m === "Xa") !== (p === "Xa")); lab = (sex === "G" ? m + "Y" : m + p); }
        else { lab = d.t === "A" ? (m === p ? m + p : "Aa") : (m === p ? m + p : "Dd"); isAff = d.t === "A" ? (m === "a" && p === "a") : (m === "D" || p === "D"); isCar = d.t === "A" && m !== p; }
        cells.push({m:m, p:p, lab:lab, aff:isAff, car:isCar, sex:sex});
        if (isAff) aff.all += 0.25; if (isCar) car += 0.25;
      }
      cellsNow = cells;
      var w = Math.min(130, (c.W - 80) / 2), x0 = 70, y0 = 60;
      geo = {x0:x0, y0:y0, w:w};
      S.draw.text(c, "gamètes du père →", x0 + w, 24, {size:11, color:pal.grey});
      for (j = 0; j < 2; j++) S.draw.text(c, d.p[j], x0 + w / 2 + j * w, 46, {size:13});
      for (i = 0; i < 2; i++) S.draw.text(c, d.m[i], 40, y0 + 32 + i * 64, {size:13});
      S.draw.text(c, "mère", 18, y0 - 4, {size:10, color:pal.grey});
      cells.forEach(function(cl, n){
        var x = x0 + (n % 2) * w, y = y0 + Math.floor(n / 2) * 64;
        ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = cl.aff ? "#f6c6c0" : cl.car ? "#fff0c2" : "#e1f0e8"; ctx.fillRect(x, y, w - 4, 60); ctx.restore();
        if (flash === n && ft > 0){ ctx.save(); ctx.strokeStyle = pal.acc; ctx.lineWidth = 3; ctx.globalAlpha = ft / 0.9; ctx.strokeRect(x - 1, y - 1, w - 2, 62); ctx.restore(); }
        if (ta < 1){ var e = ta * ta * (3 - 2 * ta); S.draw.label(c, cl.m, 40 + (x + (w - 4) * 0.3 - 40) * e, y0 + 32 + Math.floor(n / 2) * 64 + (y + 22 - y0 - 32 - Math.floor(n / 2) * 64) * e, {size:10, color:pal.red}); S.draw.label(c, cl.p, x0 + w / 2 + (n % 2) * w + (x + (w - 4) * 0.7 - x0 - w / 2 - (n % 2) * w) * e, 46 + (y + 22 - 46) * e, {size:10, color:pal.acc}); }
        if (ta >= 1){ S.draw.text(c, cl.lab + (cl.sex ? (cl.sex === "G" ? " (garçon)" : " (fille)") : ""), x + (w - 4) / 2, y + 22, {size:12, math:true});
        S.draw.text(c, cl.aff ? "atteint" : cl.car ? "porteur" : "sain", x + (w - 4) / 2, y + 42, {size:11, color:cl.aff ? pal.red : pal.grey}); }
      });
      S.draw.text(c, "rouge = atteint · jaune = porteur sain · vert = sain non porteur", 10, 205, {align:"left", size:10.5, weight:600, color:pal.grey});
      /* famille tirée au hasard (notation d'arbre généalogique) */
      var fy = 238, nA = fam.filter(function(z){ return z.aff; }).length;
      S.draw.text(c, "Famille tirée au hasard : " + fam.length + " enfant" + (fam.length > 1 ? "s" : "") + (fam.length ? ", " + nA + " atteint" + (nA > 1 ? "s" : "") : " (touche l'échiquier)"), 10, fy, {align:"left", size:11, color:pal.ink});
      var per = Math.max(6, Math.floor((c.W - 30) / 28)), py0 = fy + 34;
      if (fam.length){ S.draw.line(c, 24, py0 - 20, 24 + (Math.min(fam.length, per) - 1) * 28, py0 - 20, pal.ink, 1.4); }
      fam.forEach(function(z, q){ var xx = 24 + (q % per) * 28, yy = py0 + Math.floor(q / per) * 36; if (q < per) S.draw.line(c, xx, py0 - 20, xx, yy - 10, pal.ink, 1.4); sym(xx, yy, 9, z.sex, z.aff, z.car); });
      S.draw.text(c, "□ garçon · ○ fille · plein = atteint · demi = porteur", 10, c.H - 12, {align:"left", size:10, color:pal.grey});
      if (d.t === "X"){
        cells.forEach(function(cl){ if (cl.sex === "G"){ nb += 1; if (cl.aff) aff.b += 1; } else { ng += 1; if (cl.aff) aff.g += 1; } });
        ro.set(0, S.fmt(aff.all * 100, 0) + " %"); ro.set(1, S.fmt(nb ? aff.b / nb * 100 : 0, 0) + " %"); ro.set(2, S.fmt(ng ? aff.g / ng * 100 : 0, 0) + " %"); ro.set(3, ng ? S.fmt(cells.filter(function(z){ return z.car; }).length / ng * 100, 0) + " % des filles" : "—");
      } else {
        ro.set(0, S.fmt(aff.all * 100, 0) + " %"); ro.set(1, S.fmt(aff.all * 100, 0) + " %"); ro.set(2, S.fmt(aff.all * 100, 0) + " %"); ro.set(3, d.t === "A" ? S.fmt(car * 100, 0) + " %" : "—");
      }
      note.set(d.t === "X" ? "Chaque case : gamète maternel × gamète paternel ; Y du père → garçon. Les proportions sont données par sexe." : "Chaque case a une probabilité de 1/4 ; garçons et filles ont le même risque (transmission autosomique).", "ok");
      var dq = defi(v); note.set(note.el.innerHTML + "<br>" + dq[0], dq[1] ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ if (ta < 1 || ft > 0) render(dt); }); lp.play();
  }
});

/* 4. Groupes sanguins */
SFA.sim({
  id:"ub-c09-groupes-sanguins", ch:"c09", tag:"Codominance",
  titre:"Groupes ABO et Rhésus : hérédité, transfusion, incompatibilité fœto-maternelle",
  resume:"Probabilités des groupes de l'enfant ; compatibilité donneur/receveur ; risque Rh.",
  but:"Choisis les génotypes des parents pour obtenir les groupes possibles de l'enfant, puis teste une transfusion : si le receveur possède des anticorps contre les antigènes du donneur, les globules s'agglutinent.",
  aRetenir:"ABO : allèles A et B codominants, O récessif. Un parent AB × O ne donne jamais d'enfant AB ni O. Rhésus : D (Rh+) dominant sur d (Rh−). Transfusion : les globules du donneur ne doivent porter aucun antigène (A, B, D) absent chez le receveur. Mère Rh− (dd) et père D_ : enfant Rh+ possible ; la mère peut s'immuniser (anticorps anti-D) à l'accouchement et menacer une grossesse ultérieure d'un fœtus Rh+.",
  piege:"Le groupe O n'a ni A ni B sur les globules rouges : donneur O universel pour les globules, mais son plasma contient des anticorps anti-A et anti-B. Un receveur Rh− n'a des anticorps anti-D qu'après immunisation (pas naturels). Génotype A ≠ groupe A : AO et AA donnent tous deux le groupe A.",
  build:function(k,S){
    var c = k.canvas(430), pal = S.draw.palette, B = S.bio, tt = 0, rnd = Math.random;
    var G = [["AA","AA (groupe A)"],["AO","AO (groupe A)"],["BB","BB (groupe B)"],["BO","BO (groupe B)"],["AB","AB (groupe AB)"],["OO","OO (groupe O)"]];
    var m = k.select("Génotype ABO de la mère", G, "AO"), p = k.select("Génotype ABO du père", G, "BO");
    var rm = k.select("Rhésus de la mère", [["DD","DD (Rh+)"],["Dd","Dd (Rh+)"],["dd","dd (Rh−)"]], "dd");
    var rp = k.select("Rhésus du père", [["DD","DD (Rh+)"],["Dd","Dd (Rh+)"],["dd","dd (Rh−)"]], "Dd");
    var don = k.select("Donneur (globules)", ["O−","O+","A−","A+","B−","B+","AB−","AB+"], "O−");
    var rec = k.select("Receveur", ["O−","O+","A−","A+","B−","B+","AB−","AB+"], "A+");
    var ro = k.readouts(["Transfusion","Enfant Rh+ ", "Enfant Rh−"]);
    var note = k.note("", "ok");
    function ph(g){ var s = g.indexOf("A") >= 0 && g.indexOf("B") >= 0 ? "AB" : g.indexOf("A") >= 0 ? "A" : g.indexOf("B") >= 0 ? "B" : "O"; return s; }
    function ant(grp){ var g = grp.replace(/[+−]/g, ""), r = grp.indexOf("+") >= 0; return {A:g.indexOf("A") >= 0, B:g.indexOf("B") >= 0, D:r}; }
    function antigens(x, y, r, grp, alpha){ var a = ant(grp), ctx = c.ctx, list = [];
      if (a.A) list.push(pal.red); if (a.B) list.push(pal.acc); if (a.D) list.push(pal.green);
      var n = 9; for (var q = 0; q < n; q++){ var col = list[q % Math.max(1, list.length)]; if (!list.length) break; var an = q * 6.2832 / n + .3; var ax = x + (r + 3) * Math.cos(an), ay = y + (r + 3) * Math.sin(an);
        ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + r * Math.cos(an), y + r * Math.sin(an)); ctx.lineTo(ax, ay); ctx.stroke(); ctx.beginPath(); ctx.arc(ax + 2.4 * Math.cos(an), ay + 2.4 * Math.sin(an), 3, 0, 7); ctx.fill(); ctx.restore(); } }
    function yab(x, y, col, s){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y + 8 * s); ctx.lineTo(x, y); ctx.lineTo(x - 6 * s, y - 8 * s); ctx.moveTo(x, y); ctx.lineTo(x + 6 * s, y - 8 * s); ctx.stroke(); ctx.restore(); }
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear(); B.bg(c, "#fbfdff", "#eef3f9"); tt += dt;
      var res = {A:0, B:0, AB:0, O:0}, i, j;
      for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) res[ph(m.value[i] + p.value[j])] += 0.25;
      var gm = rm.value === "DD" ? 0 : rm.value === "Dd" ? 0.5 : 1, gp = rp.value === "DD" ? 0 : rp.value === "Dd" ? 0.5 : 1, pneg = gm * gp;
      var names = ["A","B","AB","O"], cols = [pal.red, pal.acc, pal.violet, pal.green], bw = (W - 40) / 4;
      S.draw.text(c, "Groupes ABO possibles de l'enfant", 20, 18, {align:"left", size:12, color:pal.ink});
      names.forEach(function(nm, q){ var cx = 20 + bw * (q + .5), cy = 76, r = Math.min(24, bw * .26), pr = res[nm];
        ctx.save(); ctx.globalAlpha = pr > 0 ? 1 : .3; B.rbc(c, cx, cy, r, {mode:"disque"}); antigens(cx, cy, r, nm + "−"); ctx.restore();
        S.draw.text(c, nm, cx, cy + r + 18, {size:13, color:cols[q]});
        ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, cx - bw * .36, cy + r + 30, bw * .72, 10, 5); ctx.fill(); if (pr > 0){ ctx.fillStyle = cols[q]; S.draw.rrect(c, cx - bw * .36, cy + r + 30, Math.max(8, bw * .72 * pr), 10, 5); ctx.fill(); }
        S.draw.text(c, S.fmt(pr * 100, 0) + " %", cx, cy + r + 52, {size:12, color:pal.ink}); });
      /* transfusion */
      var ad = ant(don.value), ar = ant(rec.value), ok = (!ad.A || ar.A) && (!ad.B || ar.B) && (!ad.D || ar.D);
      var why = [];
      if (ad.A && !ar.A) why.push("antigène A du donneur reconnu par les anti-A du receveur");
      if (ad.B && !ar.B) why.push("antigène B du donneur reconnu par les anti-B du receveur");
      if (ad.D && !ar.D) why.push("antigène D (Rh+) : risque d'immunisation anti-D chez un receveur Rh−");
      var ty = 208, th = H - ty - 52;
      S.draw.panel(c, 10, ty, W - 20, th, {shadow:false});
      S.draw.text(c, "Transfusion de globules : " + don.value + " → " + rec.value, 22, ty + 16, {align:"left", size:12, color:pal.ink});
      var dx = W * .16, px0 = W * .38, px1 = W - 26, cy0 = ty + th * .6;
      B.rbc(c, dx, cy0, 22, {mode:"disque"}); antigens(dx, cy0, 22, don.value); S.draw.text(c, "donneur " + don.value, dx, cy0 + 40, {size:10.5, color:pal.grey});
      S.draw.arrow(c, dx + 40, cy0, px0 - 8, cy0, pal.grey, 2);
      ctx.fillStyle = "rgba(255,240,200,.55)"; S.draw.rrect(c, px0, ty + 28, px1 - px0, th - 38, 12); ctx.fill(); ctx.strokeStyle = "#e5cf93"; ctx.lineWidth = 1.5; ctx.stroke();
      S.draw.text(c, "plasma du receveur " + rec.value, (px0 + px1) / 2, ty + 42, {size:10.5, color:"#8a6d1c"});
      /* anticorps du receveur */
      var abs = []; if (!ar.A) abs.push([pal.red, "anti-A"]); if (!ar.B) abs.push([pal.acc, "anti-B"]);
      for (var q = 0; q < 8; q++){ var ab = abs[q % Math.max(1, abs.length)]; if (!ab) break; yab(px0 + 22 + ((q * 53) % Math.max(60, px1 - px0 - 50)), ty + 62 + (q % 3) * 12, ab[0], 1); }
      if (abs.length) S.draw.text(c, abs.map(function(a){ return a[1]; }).join(" + "), px0 + 8, ty + th - 22, {align:"left", size:10, color:pal.grey});
      /* globules donneurs dans le plasma */
      var n = 5, spread = ok ? 1 : .35;
      for (q = 0; q < n; q++){ var home = [px0 + 36 + q * ((px1 - px0 - 72) / (n - 1)), cy0 + 4 * Math.sin(tt * 1.5 + q)], clump = [(px0 + px1) / 2 + (q % 3 - 1) * 22 + (q > 2 ? 11 : 0), cy0 + (q > 2 ? 22 : -4)];
        var u = ok ? 0 : Math.min(1, tt * .5 % 3), x = home[0] + (clump[0] - home[0]) * (ok ? 0 : Math.min(1, (tt % 4) / 1.5)), y = home[1] + (clump[1] - home[1]) * (ok ? 0 : Math.min(1, (tt % 4) / 1.5));
        B.rbc(c, x, y, 13, {mode:"disque"}); antigens(x, y, 13, don.value); }
      if (!ok){ S.draw.label(c, "agglutination !", px1 - 70, ty + th - 22, {color:pal.red, size:12}); } else S.draw.label(c, "pas d'agglutination", px1 - 78, ty + th - 22, {color:pal.green, size:11.5});
      S.draw.text(c, ok ? "Compatible : aucun antigène étranger pour le receveur" : "Incompatible : " + why[0], 20, H - 22, {align:"left", size:11.5, weight:700, color:ok ? pal.green : pal.red});
      ro.set(0, ok ? "compatible" : "incompatible"); ro.set(1, S.fmt((1 - pneg) * 100, 0) + " %"); ro.set(2, S.fmt(pneg * 100, 0) + " %");
      note.set(rm.value === "dd" && pneg < 1 ? "Mère Rh− : un enfant Rh+ (probabilité " + S.fmt((1 - pneg) * 100, 0) + " %) peut immuniser la mère ; prévention par immunoglobulines anti-D." : "Pas d'incompatibilité Rh fœto-maternelle dans ce couple (mère Rh+ ou enfant forcément Rh−).", rm.value === "dd" && pneg < 1 ? "warn" : "ok");
    }
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* 5. Caractère polygénique */
SFA.sim({
  id:"ub-c09-polygenique", ch:"c09", tag:"Hérédité complexe",
  titre:"Caractères polygéniques : gènes, milieu et pénétrance",
  resume:"Une planche de Galton génétique : chaque allèle « + » dévie la bille, le milieu la disperse, la courbe en cloche se construit ; seuil de maladie et pénétrance.",
  but:"Fais naître des individus : à chaque rangée de clous, la bille reçoit un allèle « + » (à droite) ou « − » (à gauche), puis le milieu la décale au hasard. Glisse le seuil de maladie et le score g d'un individu sur le graphique. Défi : avec 10 locus, règle le milieu pour que l'héritabilité vaille h² = 0,80.",
  aRetenir:"Modèle additif : n locus à 2 allèles de fréquence 1/2, score génétique G = nombre d'allèles « + » parmi 2n (moyenne n, variance V<sub>G</sub> = n/2). Phénotype P = G + E (milieu E d'écart-type σ). Héritabilité au sens large h² = V<sub>G</sub> / V<sub>P</sub> = V<sub>G</sub> / (V<sub>G</sub> + σ²). Plus n est grand, plus la distribution ressemble à une loi normale. Pénétrance = proportion de personnes d'un génotype donné qui expriment la maladie : elle est &lt; 100 % dès que le milieu compte.",
  piege:"L'héritabilité décrit une population, pas un individu : « h² = 0,6 » ne veut pas dire que 60 % de ta taille vient de tes gènes. Un h² élevé n'exclut pas l'effet du milieu (nutrition et taille). Les locus sont supposés indépendants, additifs, sans interaction : modèle d'école. Au-delà de 16 rangées, la planche dessinée est simplifiée (le score, lui, est tiré sur les 2n allèles).",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(580), balls = [], bins = {}, total = 0, aff = 0, acc = 0, rs = rng(21), playing = true, key = "", geo = null, drag = null, bPlay;
    c.cv.style.touchAction = "none";
    var n = k.slider("Nombre de locus n", 1, 20, 1, 6, "");
    var sg = k.slider("Écart-type du milieu σ", 0, 6, 0.1, 2, "");
    var th = k.slider("Seuil de maladie", 0, 40, 0.5, 11, "");
    var gs = k.slider("Score génétique d'un individu g", 0, 40, 1, 8, "");
    bPlay = k.button("⏸ Pause", function(){ playing = !playing; }, true);
    k.button("Vider", function(){ bins = {}; total = 0; aff = 0; balls = []; });
    var ro = k.readouts(["V<sub>G</sub> = n/2", "V<sub>P</sub> = V<sub>G</sub> + σ²", "h²", "Atteints : théorie · observés", "Pénétrance pour g"]);
    var note = k.note("", "");
    function gauss(){ var u = 1 - rs(), v = rs(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }
    function prefill(M, s){ for (var q = 0; q < 250; q++){ var g = 0; for (var i = 0; i < M; i++) if (rs() < 0.5) g++; var v = g + (s > 0 ? gauss() * s : 0), bi = Math.round(v); bins[bi] = (bins[bi] || 0) + 1; total++; if (v > th.value) aff++; } }
    function binom(M){ var b = [], bc = 1, tot = Math.pow(2, M); for (var g = 0; g <= M; g++){ b.push(bc / tot); bc = bc * (M - g) / (g + 1); } return b; }
    c.pointer(function(t, p){
      if (!geo) return; var ax = geo.ax;
      if (t === "down"){ drag = null; if (p.y > ax.T - 10 && p.y < ax.B + 26){ drag = Math.abs(p.x - ax.X(th.value)) < 14 && p.y < ax.B ? "th" : p.y > ax.B - 6 ? "g" : Math.abs(p.x - ax.X(th.value)) < 30 ? "th" : null; } else if (p.y < geo.boardB){ playing = !playing; } }
      if ((t === "down" || t === "drag") && drag){
        var v = ax.ix(p.x);
        if (drag === "th") th.set(Math.max(0, Math.min(40, Math.round(v * 2) / 2))); else gs.set(Math.max(0, Math.min(40, Math.round(v))));
        k.redraw();
      }
      if (t === "up") drag = null;
    });
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, M = 2 * n.value, s = sg.value, i, g;
      var kk = [n.value, s, th.value].join("|"); if (kk !== key){ var nk = [n.value, s].join("|") !== key.split("|").slice(0, 2).join("|"); key = kk; if (nk){ bins = {}; total = 0; aff = 0; balls = []; prefill(M, s); } else { aff = 0; for (var kb0 in bins) if (+kb0 > th.value) aff += bins[kb0]; } }
      c.clear();
      var bin = binom(M), VG = n.value / 2, VP = VG + s * s;
      function pdf(x){ var t = 0; for (var q = 0; q <= M; q++){ if (bin[q] < 1e-9) continue; t += bin[q] * Math.exp(-0.5 * Math.pow((x - q) / Math.max(s, 0.35), 2)) / (Math.max(s, 0.35) * 2.5066); } return t; }
      var xmin = -4, xmax = Math.max(M + 5, 12), top = 250;
      var ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:xmin, x1:xmax, y0:0, y1:1, xl:"score phénotypique", stepX:xmax > 26 ? 10 : 5, stepY:2, grid:false, pl:16, pb:40});
      geo = {ax:ax, boardB:top};
      /* ---- planche de Galton ---- */
      var rows = Math.min(M, 16), y0 = 26, rowH = Math.min(11, 150 / rows), apex = ax.X(M / 2), stepX = (ax.X(M) - ax.X(0)) / (2 * rows), yb = y0 + rows * rowH;
      S.draw.text(c, "1 rangée de clous = 1 allèle : « + » → droite, « − » → gauche" + (rows < M ? " (" + rows + " rangées dessinées sur " + M + ")" : " (2n = " + M + ")"), W / 2, 10, {size:W < 420 ? 9.5 : 10.5, color:pal.ink});
      for (i = 0; i < rows; i++) for (var j = 0; j <= i; j++){ var px = apex + (j - i / 2) * 2 * stepX, py = y0 + i * rowH + rowH / 2; ctx.fillStyle = "#8a95a3"; ctx.beginPath(); ctx.arc(px, py, 1.8, 0, 6.2832); ctx.fill(); }
      /* bande du milieu */
      var ym0 = yb + 8, ym1 = top - 18, gr = ctx.createLinearGradient(0, ym0, 0, ym1); gr.addColorStop(0, "rgba(14,127,150,.06)"); gr.addColorStop(1, "rgba(14,127,150,.16)");
      ctx.fillStyle = gr; ctx.fillRect(ax.L, ym0, ax.R - ax.L, ym1 - ym0);
      S.draw.text(c, s > 0 ? "milieu : décalage aléatoire (σ = " + S.fmt(s, 1) + ")" : "milieu sans effet (σ = 0)", ax.L + 4, ym0 + 9, {size:10, align:"left", color:pal.teal});
      if (s > 0) for (i = 0; i < 4; i++){ var wy = ym0 + 20 + i * (ym1 - ym0 - 24) / 4, wx = ax.L + 30 + ((i * 97 + (total * 3)) % Math.max(40, ax.R - ax.L - 80)); S.draw.arrow(c, wx, wy, wx + (i % 2 ? -1 : 1) * Math.min(30, 6 + s * 6), wy, "rgba(14,127,150,.45)", 1.5); }
      /* billes en vol */
      balls.forEach(function(b){
        b.t += (dt || 0) * 1.6; var t = b.t, x, y;
        if (t < 1){ var f = t * rows, ri = Math.min(rows - 1, Math.floor(f)), fr = f - ri; var xs = b.path[ri], xe = b.path[ri + 1]; x = apex + (xs + (xe - xs) * fr) * stepX; y = y0 + f * rowH; }
        else if (t < 1.6){ var u = (t - 1) / 0.6; x = ax.X(b.g + b.e * u); y = yb + (ym1 - yb) * u; }
        else { var u2 = Math.min(1, (t - 1.6) / 0.3); x = ax.X(b.g + b.e); y = ym1 + (ax.B - ym1) * u2; }
        b.x = x; b.y = y;
        ctx.fillStyle = b.g + b.e > th.value ? pal.red : pal.acc; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 6.2832); ctx.fill();
      });
      balls = balls.filter(function(b){ if (b.t >= 1.9){ var bi = Math.round(b.g + b.e); bins[bi] = (bins[bi] || 0) + 1; total++; if (b.g + b.e > th.value) aff++; return false; } return true; });
      /* ---- histogramme ---- */
      var bmax = 0; for (var kb in bins) bmax = Math.max(bmax, bins[kb]);
      var pmax = 0; for (g = 0; g <= M; g++) pmax = Math.max(pmax, bin[g]); for (var xx = xmin; xx <= xmax; xx += 0.25) pmax = Math.max(pmax, pdf(xx));
      var sc = Math.max(total >= 40 ? bmax / total : 0, pmax) * 1.12, hp = ax.B - ax.T, w1 = Math.max(2, ax.X(1) - ax.X(0) - 1);
      for (g = 0; g <= M; g++){ var hb = bin[g] / sc * hp; ctx.fillStyle = "rgba(142,153,168,.28)"; ctx.fillRect(ax.X(g) - w1 / 2, ax.B - hb, w1, hb); }
      for (kb in bins){ var bv = +kb, h = Math.min(hp, bins[kb] / Math.max(total, 40) / sc * hp); ctx.fillStyle = bv > th.value ? "rgba(192,50,29,.75)" : "rgba(31,75,158,.72)"; ctx.fillRect(ax.X(bv) - w1 * 0.36, ax.B - h, w1 * 0.72, h); }
      if (s > 0.01){ ctx.save(); ctx.beginPath(); for (xx = xmin; xx <= xmax; xx += 0.2){ var yy = ax.B - pdf(xx) / sc * hp; if (xx === xmin) ctx.moveTo(ax.X(xx), yy); else ctx.lineTo(ax.X(xx), yy); } ctx.strokeStyle = pal.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
      var thx = ax.X(Math.min(th.value, xmax));
      S.draw.line(c, thx, ax.T, thx, ax.B, pal.red, 2, [5, 4]); S.draw.label(c, (th.value > xmax ? "seuil → " : "seuil ↔ ") + S.fmt(th.value, 1), Math.min(ax.R - 30, thx), ax.T + 8, {size:10, color:pal.red});
      var gx = ax.X(Math.min(gs.value, xmax)); ctx.fillStyle = pal.violet; ctx.beginPath(); ctx.moveTo(gx, ax.B + 2); ctx.lineTo(gx - 7, ax.B + 14); ctx.lineTo(gx + 7, ax.B + 14); ctx.closePath(); ctx.fill();
      S.draw.text(c, "g", gx + 10, ax.B + 10, {size:10.5, color:pal.violet, align:"left"});
      S.draw.text(c, "gris : génotypes · bleu : phénotypes · rouge : atteints · courbe : théorie", 6, H - 8, {size:9.5, align:"left", color:pal.grey});
      /* ---- lectures ---- */
      var affT = 0; for (g = 0; g <= M; g++) affT += bin[g] * (s < 0.01 ? (g > th.value ? 1 : 0) : 1 - phi((th.value - g) / s));
      var gg = Math.min(gs.value, M), pen = s < 0.01 ? (gg > th.value ? 1 : 0) : 1 - phi((th.value - gg) / s), h2 = VG / VP;
      ro.set(0, S.fmt(VG, 2)); ro.set(1, S.fmt(VP, 2)); ro.set(2, S.fmt(h2, 2)); aff = 0; for (kb in bins) if (+kb > th.value) aff += bins[kb];
      ro.set(3, S.fmt(affT * 100, 1) + " % · " + (total ? S.fmt(aff / total * 100, 1) + " %" : "—")); ro.set(4, S.fmt(pen * 100, 1) + " %" + (gs.value > M ? " (g ramené à 2n = " + M + ")" : ""));
      bPlay.textContent = playing ? "⏸ Pause" : "▶ Faire naître";
      var ok = n.value === 10 && Math.abs(h2 - 0.8) <= 0.02;
      note.set(ok ? "✓ <b>Défi réussi</b> : V<sub>G</sub> = 5, σ² = " + S.fmt(s * s, 2) + ", h² = " + S.fmt(h2, 3) + ". 20 % de la variance des phénotypes vient du milieu ; un individu de score g = " + gg + " est atteint dans " + S.fmt(pen * 100, 0) + " % des cas (pénétrance)."
        : "◎ <b>Défi</b> : avec n = 10 locus, règle l'écart-type du milieu σ pour que h² = 0,80 (± 0,02). Indice : h² = V<sub>G</sub>/(V<sub>G</sub> + σ²). Actuellement h² = " + S.fmt(h2, 3) + (n.value !== 10 ? " avec n = " + n.value : "") + ".", ok ? "ok" : "");
      return {M:M, rows:rows, s:s};
    }
    function spawn(info){
      var M = info.M, g = 0, path = [0], pos = 0, i, al = [];
      for (i = 0; i < M; i++) al.push(rs() < 0.5 ? 1 : 0);
      for (i = 0; i < M; i++) g += al[i];
      /* trajectoire dessinée : rows pas, dont round(g·rows/M) vers la droite (ordre aléatoire) */
      var right = Math.round(g * info.rows / M), steps = [];
      for (i = 0; i < info.rows; i++) steps.push(i < right ? 1 : -1);
      for (i = steps.length - 1; i > 0; i--){ var j = Math.floor(rs() * (i + 1)), t = steps[i]; steps[i] = steps[j]; steps[j] = t; }
      steps.forEach(function(st){ pos += st; path.push(pos); });
      var last = path[path.length - 1], target = (g - M / 2) * 2 * info.rows / M; for (i = 1; i < path.length; i++) path[i] += (target - last) * i / info.rows;
      balls.push({g:g, e:info.s > 0 ? gauss() * info.s : 0, path:path, t:0});
    }
    var info = null;
    k.draw(function(){ info = render(0); });
    var lp = k.loop(function(dt){ if (playing && balls.length < 70){ acc += dt * 14; while (acc > 1){ acc--; spawn(info); } } info = render(dt); }); lp.play();
  }
});
})();
