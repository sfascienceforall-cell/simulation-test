/* Chimie 4e · chapitre 9 · pH, acides et bases */
SFA.sim({
  id:"c4-c09-titrage", ch:"c09", tag:"Classique",
  titre:"Titrer un acide fort par la soude",
  resume:"Une vraie paillasse : burette de soude à 0,100 mol/L, bécher d'acide sur agitateur, pH-mètre et indicateur. Verse goutte à goutte, trace la courbe point par point, repère le saut de pH.",
  but:"Ouvre le robinet de la burette (maintiens le doigt dessus) ou utilise les boutons pour verser la soude. Chaque mesure du pH-mètre s'ajoute au graphe. Note V_eq au virage et calcule c_a. Défi « Acide inconnu » : détermine une concentration cachée à 2 % près.",
  aRetenir:"À l'équivalence, n(OH⁻ versés) = n(H₃O⁺ initiaux) : c_a · V_a = c_b · V_eq. Pour un acide fort et une base forte, pH = 7 à l'équivalence et le saut de pH est très raide ; l'indicateur doit virer dans ce saut. Près de l'équivalence, on verse goutte à goutte.",
  piege:"Le virage de l'indicateur n'est pas exactement le point d'équivalence, mais il doit tomber dans le saut de pH. Un indicateur qui vire loin de 7 (hélianthine, 3,1–4,4) se trouve encore dans la partie raide ici, mais pour un acide faible il donnerait un V_eq faux. Et verser trop vite fait dépasser l'équivalence.",
  build:function(k, S){
    var c = k.canvas(300), g = k.canvas(220), P = S.draw.palette, cb = 0.1, KW = 1e-14;
    var mode = k.seg("Mode", [["libre","Libre"],["inc","Défi : acide inconnu"]], "libre", function(v){ if (v === "inc"){ hid = 0.06 + 0.005 * Math.floor(Math.random() * 25); } reset(); ca.el.closest(".ctl").style.display = v === "inc" ? "none" : ""; });
    var ca = k.slider("c_a de l'acide (HCl)", 0.05, 0.20, 0.005, 0.1, "mol/L", function(){ reset(); });
    var va = k.slider("Volume d'acide V_a", 10, 20, 1, 20, "mL", function(){ reset(); });
    var IND = {bbt:["bleu de bromothymol", 6.0, 7.6, [235,200,40], [40,90,200]], php:["phénolphtaléine", 8.2, 10, [255,255,255], [225,40,140]], hel:["hélianthine", 3.1, 4.4, [225,50,50], [245,205,40]]};
    var ind = k.select("Indicateur", Object.keys(IND).map(function(x){ return [x, IND[x][0]]; }), "bbt");
    var vb = k.slider("Volume de soude versé V_b", 0, 50, 0.05, 0, "mL", function(){ rec(); });
    var th = k.toggle("Afficher la courbe théorique", false);
    var ro = k.readouts(["pH mesuré", "V_b versé", "V_eq noté", "c_a calculée"]);
    var nt = k.note("", "");
    var hid = 0.1, pts = [], veq = null, pour = 0, tt = 0, drops = [];
    function CA(){ return mode.value === "inc" ? hid : ca.value; }
    function pH(Vb){ var d = (CA() * va.value - cb * Vb) / (va.value + Vb); var h = (d + Math.sqrt(d * d + 4 * KW)) / 2; return -Math.log10(h); }
    function rec(){ var v = Math.round(vb.value * 100) / 100; if (!pts.some(function(p){ return Math.abs(p[0] - v) < 0.02; })) pts.push([v, pH(v)]); }
    function reset(){ pts = []; veq = null; vb.set(0); rec(); }
    function addV(dv){ var old = vb.value; vb.set(Math.min(50, Math.round((vb.value + dv) * 100) / 100)); if (vb.value > old){ drops.push({t:0}); } rec(); }
    k.button("Verser 1 mL", function(){ addV(1); }, true);
    k.button("Verser une goutte (0,05 mL)", function(){ addV(0.05); });
    k.button("Noter V_eq = V_b", function(){ veq = vb.value; });
    k.button("Recommencer (bécher neuf)", function(){ reset(); });
    var lp = k.loop(function(dt){ tt += dt; if (pour) { var acc = (pour.acc || 0) + dt * 1.2; var n = Math.floor(acc / 0.05); pour.acc = acc - n * 0.05; for (var i = 0; i < n; i++) addV(0.05); }
      drops.forEach(function(d){ d.t += dt; }); drops = drops.filter(function(d){ return d.t < 0.5; }); k.redraw(); });
    lp.play();
    var G = {};
    c.pointer(function(type, p){
      if (type === "down" && G.tap && Math.hypot(p.x - G.tap[0], p.y - G.tap[1]) < 30) pour = {acc:0};
      if (type === "up") pour = 0;
    });
    var gx = null;
    rec();
    k.draw(function(){
      var W = c.W, H = c.H, ctx = c.ctx, I = IND[ind.value], p = pH(vb.value), small = W < 420;
      C4.bg(c, H - 22);
      /* potence */
      var bx = small ? W * 0.36 : W * 0.32, top = 12, bh = H * 0.5, bwid = 16;
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(bx - 70, H - 30, 20, 8); ctx.fillRect(bx - 63, top, 6, H - 34); ctx.fillRect(bx - 63, top + 30, 63 - bwid / 2, 5);
      /* burette (0 en haut, 50 mL en bas) */
      var fr = 1 - vb.value / 50;
      C4.vessel(c, function(cc){ cc.beginPath(); cc.rect(bx - bwid / 2, top, bwid, bh); }, {x:bx - bwid / 2, y:top + 6, w:bwid, h:bh - 6}, Math.max(0, fr), "#c7d8f0", {alpha:.8, shine:false});
      for (var t = 0; t <= 50; t += 5){ var yy = top + 6 + (bh - 6) * t / 50; S.draw.line(c, bx + bwid / 2 - (t % 10 ? 4 : 7), yy, bx + bwid / 2, yy, "#5f6b7a", 1); if (t % 10 === 0) S.draw.text(c, String(t), bx + bwid / 2 + 12, yy, {size:10.5, color:"#5f6b7a"}); }
      C4.tag(c, "burette : NaOH 0,100 mol/L", bx + 34, top + 12, "#2c3a4e", 11, "left");
      /* robinet */
      var tapY = top + bh + 10; G.tap = [bx, tapY];
      ctx.fillStyle = "#c7d8f0"; ctx.fillRect(bx - 3, top + bh, 6, 22);
      ctx.save(); ctx.translate(bx, tapY); ctx.rotate(pour ? 0 : Math.PI / 2); ctx.fillStyle = pour ? P.green : "#2c3a4e"; C4.rr(ctx, -13, -3.5, 26, 7, 3); ctx.fill(); ctx.restore();
      S.draw.glow(c, bx, tapY, 24, pour ? P.green : P.amber, 0.22);
      /* bécher sur agitateur magnétique */
      var bw = small ? 74 : 90, bht = small ? 58 : 70, bxx = bx - bw / 2, byy = H - 30 - 16 - bht;
      ctx.fillStyle = "#5f6b7a"; C4.rr(ctx, bx - bw / 2 - 14, H - 46, bw + 28, 18, 4); ctx.fill(); ctx.fillStyle = "#24775a"; ctx.beginPath(); ctx.arc(bx + bw / 2 + 2, H - 37, 3, 0, 7); ctx.fill();
      var tcol = Math.max(0, Math.min(1, (p - I[1]) / (I[2] - I[1]))), col = "#" + I[3].map(function(a, j){ var v = Math.round(a + (I[4][j] - a) * tcol); return ("0" + v.toString(16)).slice(-2); }).join("");
      var lvl = 0.45 + 0.4 * (va.value + vb.value) / 70;
      C4.beaker2(c, bxx, byy, bw, bht, lvl, col, {alpha:.75, ticks:3});
      var sa = tt * 9; ctx.save(); ctx.translate(bx, byy + bht - 6); ctx.scale(1, 0.35); ctx.rotate(sa); ctx.fillStyle = "#f4f4f4"; C4.rr(ctx, -12, -3, 24, 6, 3); ctx.fill(); ctx.restore();
      /* gouttes */
      drops.forEach(function(d){ var y = tapY + 14 + d.t / 0.5 * (byy + bht * (1 - lvl) - tapY - 14); ctx.fillStyle = "#9fbbe3"; ctx.beginPath(); ctx.ellipse(bx, y, 3, 4.5, 0, 0, 7); ctx.fill(); });
      if (pour){ ctx.fillStyle = "rgba(159,187,227,.8)"; ctx.fillRect(bx - 1.2, tapY + 12, 2.4, byy + bht * (1 - lvl) - tapY - 12); }
      /* pH-mètre */
      var mx = small ? W - 56 : W * 0.74, my = small ? H * 0.62 : H * 0.5;
      S.draw.display(c, p.toFixed(2).replace(".", ","), mx, my, {w:small ? 96 : 120, h:small ? 50 : 58, caption:"pH-MÈTRE"});
      ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx - (small ? 48 : 60), my); ctx.bezierCurveTo(bx + bw * 0.3 + 40, my, bx + bw * 0.3, byy - 40, bx + bw * 0.3, byy + 6); ctx.stroke();
      ctx.fillStyle = "#e8ecf1"; ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.2; C4.rr(ctx, bx + bw * 0.3 - 4, byy - 14, 8, bht * 0.75, 3); ctx.fill(); ctx.stroke();
      C4.tag(c, I[0], mx, my + (small ? 38 : 44), "#2c3a4e", 11, "center");
      C4.tag(c, small ? "← maintiens" : "← maintiens le robinet", bx + 20, top + bh + 12, "#5f6b7a", 11, "left");
      /* graphe pH(V_b) */
      g.clear();
      var Veq = CA() * va.value / cb;
      gx = S.draw.axes(g, {x0:0, x1:50, y0:0, y1:14, xl:"V_b (mL)", yl:"pH", stepX:10, stepY:2, l:36});
      g.ctx.fillStyle = "rgba(244,197,66,.25)"; g.ctx.fillRect(gx.X(0), gx.Y(I[2]), gx.X(50) - gx.X(0), gx.Y(I[1]) - gx.Y(I[2]));
      C4.tag(g, "virage de l'indicateur", gx.X(49), gx.Y((I[1] + I[2]) / 2), "#7a5d00", 11, "right");
      if (th.value) S.draw.fn(g, gx, pH, "#9bb0d8", 2, [5, 4]);
      pts.slice().sort(function(a, b){ return a[0] - b[0]; }).forEach(function(q){ S.draw.dot(g, gx.X(q[0]), gx.Y(q[1]), 3.2, P.acc); });
      S.draw.dot(g, gx.X(vb.value), gx.Y(p), 6.5, P.red);
      if (veq !== null){ S.draw.line(g, gx.X(veq), gx.Y(0), gx.X(veq), gx.Y(14), P.green, 2, [5, 4]); C4.tag(g, "V_eq = " + S.fmt(veq, 2) + " mL", gx.X(veq) + 4, 14, P.green, 11, "left"); }
      ro.set(0, S.fmt(p, 2)); ro.set(1, S.fmt(vb.value, 2) + " mL"); ro.set(2, veq === null ? "—" : S.fmt(veq, 2) + " mL"); ro.set(3, veq === null ? "—" : S.fmt(cb * veq / va.value, 4) + " mol/L");
      var found = veq === null ? null : cb * veq / va.value, okc = found !== null && Math.abs(found - CA()) / CA() <= 0.02;
      var state = vb.value < Veq - 0.05 ? "il reste de l'acide (pH < 7)" : vb.value > Veq + 0.05 ? "la soude est en excès (pH > 7)" : "on est à l'équivalence (pH ≈ 7)";
      if (mode.value === "inc") nt.set("<b>Défi : acide inconnu</b> (V_a = " + S.fmt(va.value, 0) + " mL). " + (veq === null ? "Verse jusqu'au virage, puis note V_eq. Ici, " + state + "." : "c_a = c_b · V_eq / V_a = " + S.fmt(cb, 3) + " × " + S.fmt(veq, 2) + " / " + S.fmt(va.value, 0) + " = " + S.fmt(found, 4) + " mol/L. " + (okc ? "✅ Bravo : valeur cachée " + S.fmt(CA(), 3) + " mol/L." : "❌ Trop loin de la valeur cachée (plus de 2 %) : recommence, plus doucement près du saut.")), okc ? "ok" : veq === null ? "" : "warn");
      else nt.set(veq === null ? "Verse la soude, de plus en plus doucement quand le pH commence à monter : " + state + ". Note V_eq au milieu du saut (V_eq théorique : " + S.fmt(Veq, 2) + " mL)." : "c_a = c_b · V_eq / V_a = " + S.fmt(cb, 3) + " × " + S.fmt(veq, 2) + " / " + S.fmt(va.value, 0) + " = " + S.fmt(found, 4) + " mol/L (réglée : " + S.fmt(CA(), 3) + ").", okc ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"c4-c09-dilution-infinie", ch:"c09", tag:"Original",
  titre:"Diluer indéfiniment un acide : le pH ne dépasse jamais 7",
  resume:"Dilue un acide fort ×10, encore ×10… L'indicateur universel tend vers le vert sans jamais passer au bleu : à la loupe, les ions de l'eau finissent par dominer ceux de l'acide.",
  but:"Dilue la solution (bouton ×10, curseur, ou point du graphe). L'indicateur universel montre le pH réel ; la loupe compare les ions H₃O⁺ apportés par l'acide (rouges) à ceux que fournit l'eau elle-même (orange), avec les OH⁻ (bleus). Défis : atteins les pH demandés.",
  aRetenir:"pH = −log [H₃O⁺]. Pour un acide fort, pH ≈ −log c tant que c ≫ 10⁻⁷ mol/L. Mais l'eau fournit elle-même des ions H₃O⁺ et OH⁻ (10⁻⁷ mol/L chacun dans l'eau pure à 25 °C) : quand l'acide devient plus rare que ces ions-là, le pH tend vers 7 sans jamais le dépasser. Même chose pour une base, par le haut.",
  piege:"Dire qu'une solution de HCl à 10⁻⁸ mol/L a pH = 8 est impossible : un acide, même très dilué, ne rend jamais une solution basique. Le pH réel vaut environ 6,98.",
  build:function(k, S){
    var c = k.canvas(260), g = k.canvas(200), P = S.draw.palette, KW = 1e-14;
    var md = k.seg("Soluté", [["a","Acide fort (HCl)"],["b","Base forte (NaOH)"]], "a");
    var pc = k.slider("pc = −log c (chaque unité = dilution ×10)", 0, 9, 0.1, 1, "");
    var ro = k.readouts(["c", "pH naïf (−log c)", "pH réel", "Part des H₃O⁺ venant de l'acide"]);
    var nt = k.note("", "");
    var DEF = [["a", "obtiens un pH réel de 6,0 avec l'acide", function(r){ return Math.abs(r.pr - 6) <= 0.02; }], ["a", "trouve le premier pc (au dixième) où le pH naïf se trompe de plus de 0,1", function(r){ return r.err >= 0.1 && r.err <= 0.13; }], ["b", "obtiens un pH réel de 7,5 avec la base", function(r){ return Math.abs(r.pr - 7.5) <= 0.05; }]], di = -1, won = [0, 0, 0];
    k.button("Diluer ×10", function(){ if (pc.value <= 8){ an = {t:0, from:pc.value}; lp.play(); } }, true);
    k.button("Défi suivant", function(){ di = (di + 1) % 3; md.set(DEF[di][0]); pc.set(1); an = null; });
    var an = null, tt = 0;
    var lp = k.loop(function(dt){ tt += dt; if (an){ an.t += dt / 1.6; if (an.t >= 1){ pc.set(Math.min(9, Math.round((an.from + 1) * 10) / 10)); an = null; } } k.redraw(); });
    lp.play();
    var gx = null;
    g.pointer(function(type, p){ if (!gx || (type !== "down" && type !== "drag")) return; pc.set(Math.round(Math.max(0, Math.min(9, gx.ix(p.x))) * 10) / 10); an = null; k.redraw(); });
    function real(pcv, acid){ var cc = Math.pow(10, -pcv), h = acid ? (cc + Math.sqrt(cc * cc + 4 * KW)) / 2 : 2 * KW / (cc + Math.sqrt(cc * cc + 4 * KW)); return -Math.log10(h); }
    function uni(pH){ var st = [[0, "#d7263d"], [2, "#e8562a"], [4, "#f2a53a"], [5.5, "#e9d84a"], [7, "#4caf50"], [8.5, "#2a9d8f"], [10, "#2f6fcf"], [12, "#4a3fb5"], [14, "#5b2a86"]];
      for (var i = 0; i < st.length - 1; i++) if (pH <= st[i + 1][0]){ var f = (pH - st[i][0]) / (st[i + 1][0] - st[i][0]); return C4.mix(st[i][1], st[i + 1][1], Math.max(0, Math.min(1, f))); } return st[st.length - 1][1]; }
    function seed(i){ var x = Math.sin(i * 78.233) * 43758.5453; return x - Math.floor(x); }
    k.draw(function(){
      var W = c.W, H = c.H, ctx = c.ctx, ac = md.value === "a", small = W < 420;
      var pcv = pc.value, cc = Math.pow(10, -pcv), pr = real(pcv, ac), pn = ac ? pcv : 14 - pcv, h = Math.pow(10, -pr), oh = KW / h;
      C4.bg(c, H - 18);
      /* bécher avec indicateur universel */
      var bw = small ? 86 : 110, bh = small ? 96 : 130, bx = small ? 18 : 40, by = H - 18 - bh;
      C4.beaker2(c, bx, by, bw, bh, 0.72, uni(pr), {alpha:.8, ticks:4});
      S.draw.display(c, pr.toFixed(2).replace(".", ","), bx + bw / 2, small ? 26 : 30, {w:small ? 84 : 100, h:small ? 40 : 46, caption:"pH RÉEL"});
      C4.t(c, (ac ? "HCl" : "NaOH") + " " + C4.sciU(cc, 1) + " mol/L", bx + bw / 2, by - 12, {size:11.5, color:"#2c3a4e"});
      /* animation de dilution : pipette 10 mL → fiole complétée à 100 mL */
      if (an){ var p = an.t, px = C4.lerp(bx + bw / 2, bx + bw + (small ? 60 : 90), C4.ph(p, 0.15, 0.55)), py = by - 30 + 30 * Math.sin(Math.PI * C4.ph(p, 0.15, 0.55));
        ctx.fillStyle = "rgba(235,243,250,.9)"; ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.5; ctx.fillRect(px - 3, py - 50, 6, 60); ctx.strokeRect(px - 3, py - 50, 6, 60);
        ctx.fillStyle = uni(real(an.from, ac)); ctx.fillRect(px - 2, py - 10, 4, 18 * (1 - C4.ph(p, 0.55, 0.75)));
        C4.label(c, "×10", px, py - 62, P.violet, 12); }
      /* loupe */
      var lr = small ? 62 : Math.min(98, H * 0.42), lx = small ? W - lr - 10 : bx + bw + 60 + lr, ly = small ? H / 2 + 6 : H / 2;
      S.draw.line(c, bx + bw * 0.7, by + bh * 0.6, lx - lr * 0.8, ly + lr * 0.4, "rgba(15,27,45,.3)", 1.4, [4, 4]);
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.fillStyle = "#f2f8fd"; ctx.fill(); ctx.clip();
      /* 14 H₃O⁺ dessinés (ou 14 OH⁻ pour la base) ; on répartit selon l'origine */
      var N = 14, nA, nW, nOH;
      if (ac){ nA = Math.round(N * cc / h); nW = N - nA; nOH = Math.round(N * oh / h); }
      else { nOH = N; nW = Math.round(N * h / oh); nA = 0; }
      var list = [], i;
      for (i = 0; i < nA; i++) list.push(["#c0321d", "H₃O⁺"]);
      for (i = 0; i < nW; i++) list.push(["#f08c2a", "H₃O⁺ (eau)"]);
      for (i = 0; i < nOH; i++) list.push([ac ? "#2f64c8" : (i < Math.round(N * cc / oh) ? "#1f3f8f" : "#6fa0e8"), "OH⁻"]);
      list.forEach(function(q, j){ var x = lx + (seed(j + 1) - .5) * lr * 1.5 + Math.sin(tt * 1.3 + j) * 4, y = ly + (seed(j + 50) - .5) * lr * 1.5 + Math.cos(tt * 1.1 + j) * 4; C4.ion(c, x, y, small ? 6 : 7.5, q[0], "", {}); });
      ctx.restore(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.stroke();
      var lgd = ac ? [["#c0321d", "H₃O⁺ de l'acide"], ["#f08c2a", "H₃O⁺ de l'eau"], ["#2f64c8", "OH⁻"]] : [["#1f3f8f", "OH⁻ de la base"], ["#6fa0e8", "OH⁻ de l'eau"], ["#f08c2a", "H₃O⁺"]];
      lgd.forEach(function(q, j){ var yy = small ? 14 + j * 16 : ly - lr + 6 + j * 18, xx = small ? W - 128 : lx + lr + 14; if (!small && xx + 110 > W) xx = W - 118; C4.ion(c, xx, yy, 5.5, q[0], "", {}); S.draw.text(c, q[1], xx + 10, yy, {size:11, align:"left", color:"#2c3a4e"}); });
      C4.t(c, "loupe (proportions)", lx, Math.min(H - 8, ly + lr + 12), {size:11, color:"#5f6b7a", weight:600});
      /* graphe */
      g.clear();
      gx = S.draw.axes(g, {x0:0, x1:9, y0:0, y1:14, xl:"pc = −log c", yl:"pH", stepX:1, stepY:2, l:36});
      S.draw.fn(g, gx, function(x){ return ac ? x : 14 - x; }, "#b8c0cc", 2, [6, 4]);
      S.draw.fn(g, gx, function(x){ return real(x, ac); }, P.acc, 3);
      S.draw.line(g, gx.X(0), gx.Y(7), gx.X(9), gx.Y(7), P.green, 1.4, [4, 4]); C4.tag(g, "pH 7 (eau pure)", gx.X(9) - 4, gx.Y(7) + (ac ? -11 : 12), P.green, 11, "right");
      C4.tag(g, "gris : pH naïf · bleu : pH réel", gx.X(0.7), ac ? 14 : g.H - 48, "#2c3a4e", 11, "left");
      if (di === 0) S.draw.line(g, gx.X(0), gx.Y(6), gx.X(9), gx.Y(6), P.amber, 1.4, [3, 3]);
      if (di === 2) S.draw.line(g, gx.X(0), gx.Y(7.5), gx.X(9), gx.Y(7.5), P.amber, 1.4, [3, 3]);
      S.draw.dot(g, gx.X(pcv), gx.Y(pn), 5, "#8a95a3"); C4.ion(g, gx.X(pcv), gx.Y(pr), 7.5, uni(pr), "", {ring:"#13233a"});
      var err = Math.abs(pr - pn);
      ro.set(0, C4.sciU(cc, 2) + " mol/L"); ro.set(1, S.fmt(pn, 2)); ro.set(2, S.fmt(pr, 2));
      ro.set(3, ac ? S.fmt(100 * cc / h, cc / h < 0.1 ? 1 : 0) + " %" : "—");
      if (di >= 0){ var D = DEF[di], okk = md.value === D[0] && D[2]({pr:pr, err:err}); if (okk) won[di] = 1;
        nt.set("<b>Défi " + (di + 1) + "/3</b> : " + D[1] + ". " + (md.value !== D[0] ? "Change de soluté." : okk ? "✅ Réussi à pc = " + S.fmt(pcv, 1) + " (c = " + C4.sciU(cc, 2) + " mol/L) : pH réel " + S.fmt(pr, 2) + ", pH naïf " + S.fmt(pn, 2) + "." : "Ici pH réel = " + S.fmt(pr, 2) + " (écart avec le pH naïf : " + S.fmt(err, 2) + ").") + " · " + (won[0] + won[1] + won[2]) + "/3 réussis.", okk ? "ok" : "");
      } else nt.set(err > 0.1 ? "Le pH naïf (" + S.fmt(pn, 1) + ") est faux" + ((ac ? pn > 7 : pn < 7) ? " : il passerait de l'autre côté de 7, ce qui est impossible." : " : il s'écarte du pH réel.") + " Les ions de l'eau ne sont plus négligeables : pH réel = " + S.fmt(pr, 2) + ". Hypothèses : 25 °C, K<sub>w</sub> = 10<sup>−14</sup>." : "À cette concentration, la formule simple est très bonne (écart < 0,1) : presque tous les H₃O⁺ viennent " + (ac ? "de l'acide." : "de l'eau, mais les OH⁻ viennent de la base."), "");
    });
  }
});

SFA.sim({
  id:"c4-c09-echelle", ch:"c09", tag:"Échelle",
  titre:"L'échelle logarithmique du pH",
  resume:"Chaque unité de pH correspond à un facteur 10 sur la concentration en ions H₃O⁺.",
  but:"Clique sur l'échelle ou glisse le curseur pour choisir deux pH, et compare combien de fois l'une est plus acide que l'autre.",
  aRetenir:"[H₃O⁺] = 10⁻ᵖᴴ mol/L. Passer de pH 3 à pH 2 multiplie [H₃O⁺] par 10 ; de pH 3 à pH 1, par 100. À 25 °C : [H₃O⁺]·[OH⁻] = 10⁻¹⁴, donc pH + pOH = 14.",
  piege:"pH 3 n'est pas « un peu plus acide » que pH 4 : c'est 10 fois plus de H₃O⁺. Et le pH n'est pas limité à 0–14 : un acide concentré peut avoir un pH négatif.",
  build:function(k, S){
    var c = k.canvas(260);
    var pa = k.slider("pH de A", -1, 15, 0.1, 2.5, ""), pb = k.slider("pH de B", -1, 15, 0.1, 7, "");
    var ro = k.readouts(["[H₃O⁺] de A", "[OH⁻] de A", "[H₃O⁺] de B", "A / B"]);
    var nt = k.note("", "ok");
    var ex = [[2, "citron ≈ 2"], [5, "café ≈ 5"], [7, "eau pure = 7"], [8, "eau de mer ≈ 8"], [10, "savon ≈ 10"], [12.5, "Javel ≈ 12,5"]];
    var cs = c;
    var curs = "a";
    c.pointer(function(type, p){ if (type === "up") return; var L = 20, R = c.W - 20, v = Math.round(((p.x - L) / (R - L) * 16 - 1) * 10) / 10; v = Math.max(-1, Math.min(15, v)); (p.y < 130 ? pa : pb).set(v); k.redraw(); });
    k.draw(function(){
      var A = pa.value, B = pb.value;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, L = 20, R = W - 20, X = function(v){ return L + (v + 1) / 16 * (R - L); };
      var gr = ctx.createLinearGradient(L, 0, R, 0); gr.addColorStop(0, "#e5484d"); gr.addColorStop(0.35, "#f4a640"); gr.addColorStop(0.5, "#46a758"); gr.addColorStop(0.75, "#3e9bd5"); gr.addColorStop(1, "#6236c4");
      ctx.fillStyle = gr; ctx.fillRect(L, 100, R - L, 24);
      for (var v = -1; v <= 15; v++){ S.draw.line(c, X(v), 124, X(v), 130, "#5f6b7a", 1); if (v % 2 === 1 || v === 0 || v === 14) C4.label(c, String(v).replace("-", "−"), X(v), 142, "#2c3a4e", 12); }
      C4.label(c, "acide ←", L + 24, 158, "#c0321d", 12); C4.label(c, "→ basique", R - 28, 158, "#6236c4", 12);
      ex.forEach(function(e, i){ var y = 90 - (i % 3) * 22; S.draw.line(c, X(e[0]), 100, X(e[0]), y + 8, "#8a95a3", 1); C4.tag(c, e[1], X(e[0]), y, "#2c3a4e", 12, "center"); });
      [[A, "A", "#c0321d", 30], [B, "B", "#1f4b9e", 190]].forEach(function(q){ S.draw.dot(c, X(q[0]), q[3] === 30 ? 112 : 112, 8, q[2]); C4.label(c, q[1] + " " + S.fmt(q[0], 1), X(q[0]), q[3] === 30 ? 178 : 198, q[2], 13); });
      var ratio = Math.pow(10, B - A);
      C4.label(c, A < B ? "A est " + C4.sciU(ratio, 2) + " fois plus acide que B" : A > B ? "B est " + C4.sciU(1 / ratio, 2) + " fois plus acide que A" : "A et B ont le même pH", W / 2, 232, "#1f4b9e", 13);
      ro.set(0, S.sci(Math.pow(10, -A), 2) + " mol/L"); ro.set(1, S.sci(Math.pow(10, A - 14), 2) + " mol/L"); ro.set(2, S.sci(Math.pow(10, -B), 2) + " mol/L"); ro.set(3, S.sci(Math.pow(10, B - A), 2));
      nt.set(A < 0 || A > 14 ? "pH hors de 0–14 : possible pour un acide ou une base concentrés (≥ 1 mol/L)." : A < 7 ? "A est acide (pH < 7) : [H₃O⁺] > [OH⁻]." : A > 7 ? "A est basique (pH > 7) : [OH⁻] > [H₃O⁺]." : "A est neutre : [H₃O⁺] = [OH⁻] = 10⁻⁷ mol/L. Neutre ne veut pas dire « sans ions ».", A < 0 || A > 14 ? "warn" : "ok");
    });
    k.note("Valeurs usuelles arrondies (≈), à 25 °C. Clique dans la moitié haute de l'échelle pour déplacer A, dans la moitié basse pour B (ou utilise les curseurs).", "");
  }
});

SFA.sim({
  id:"c4-c09-fort-faible", ch:"c09", tag:"Comparaison",
  titre:"Acide fort ou acide faible : même concentration, pH différent",
  resume:"HCl est entièrement ionisé ; l'acide éthanoïque ne l'est que très partiellement.",
  but:"Choisis une concentration. Compare les deux béchers : nombre d'ions, pH et conductivité (proportionnelle au nombre d'ions).",
  aRetenir:"Acide fort : toutes les molécules réagissent avec l'eau, [H₃O⁺] = c. Acide faible : seule une petite fraction réagit, [H₃O⁺] ≪ c. À même concentration, un acide faible a un pH plus élevé.",
  piege:"« Acide fort » ne veut pas dire « acide concentré ». Fort/faible concerne l'ionisation, concentré/dilué concerne la quantité dissoute. Un acide faible se dissocie davantage quand on le dilue.",
  build:function(k, S){
    var c = k.canvas(300), KA = 1.8e-5;
    var lg = k.slider("log₁₀ c (c = 10 puissance …)", -3, 0, 0.1, -1, "");
    var ro = k.readouts(["c", "pH de HCl", "pH de CH₃COOH", "[H₃O⁺] fort / faible"]);
    var nt = k.note("", "");
    k.draw(function(){
      var cc = Math.pow(10, lg.value), hS = cc, hW = (-KA + Math.sqrt(KA * KA + 4 * KA * cc)) / 2, al = hW / cc;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, bw = (W - 40) / 2, cell = Math.min(15, (bw - 10) / 10);
      [[10, "HCl (fort)", 1, hS], [20 + bw, "CH₃COOH (faible)", al, hW]].forEach(function(b, bi){
        var x0 = b[0], n = Math.round(b[2] * 100);
        ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.strokeRect(x0, 30, bw, cell * 10 + 12);
        for (var i = 0; i < 100; i++){ var cx = x0 + 8 + (i % 10) * cell + cell / 2, cy = 36 + Math.floor(i / 10) * cell + cell / 2;
          if (i < n){ S.draw.dot(c, cx - 3, cy, cell * 0.2, "#c0321d"); S.draw.dot(c, cx + 3, cy, cell * 0.2, "#24775a"); } else { S.draw.dot(c, cx, cy, cell * 0.3, "#8a95a3"); } }
        C4.label(c, b[1], x0 + bw / 2, 20, "#0f1b2d", 13);
        C4.label(c, S.fmt(-Math.log10(b[3]), 2), x0 + bw / 2, 30 + cell * 10 + 34, "#1f4b9e", 22); C4.label(c, "pH", x0 + bw / 2, 30 + cell * 10 + 56, "#5f6b7a", 12);
        C4.bar(c, x0, 30 + cell * 10 + 72, bw, 10, b[3] / cc * (bi ? 1 : 1) * Math.min(1, 1), bi ? "#8a95a3" : "#24775a");
        C4.label(c, "ions : " + S.fmt(b[3] * 1000, b[3] * 1000 < 1 ? 3 : 1) + " mmol/L", x0 + bw / 2, 30 + cell * 10 + 96, "#2c3a4e", 12);
      });
      C4.label(c, "gris : HA · rouge : H₃O⁺ · vert : anion", W / 2, 290, "#5f6b7a", 11);
      ro.set(0, S.sci(cc, 2) + " mol/L"); ro.set(1, S.fmt(-Math.log10(hS), 2)); ro.set(2, S.fmt(-Math.log10(hW), 2)); ro.set(3, S.fmt(hS / hW, 0) + " ×");
      nt.set("Acide éthanoïque : " + S.fmt(al * 100, al < 0.1 ? 1 : 0) + " % des molécules sont ionisées. HCl : 100 %. L'acide faible est d'autant plus ionisé qu'il est dilué.", "");
    });
    k.note("Pour calculer le pH de l'acide éthanoïque, on utilise la constante K<sub>a</sub> = 1,8·10<sup>−5</sup> (donnée hors programme, juste pour le calcul de la simulation).", "");
  }
});
