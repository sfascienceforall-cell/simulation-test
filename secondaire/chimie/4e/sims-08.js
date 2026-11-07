/* Chimie 4e · chapitre 8 · Concentration, dilution */
SFA.sim({
  id:"c4-c08-preparation", ch:"c08", tag:"Classique",
  titre:"Préparer une solution dans une fiole jaugée",
  resume:"Pèse un soluté, dissous-le, complète jusqu'au trait : la concentration se déduit de n et du volume de la fiole.",
  but:"Choisis un soluté, une masse et une fiole jaugée, puis lance la préparation : pesée, dissolution, ajustage au trait. Défi : calcule la masse pour obtenir la concentration visée.",
  aRetenir:"c = n / V avec n = m / M et V le volume de la solution (celui de la fiole). Concentration massique c_m = m / V = c · M.",
  piege:"Le volume de la fiole est le volume de la solution, pas celui de l'eau versée : on dissout dans un peu d'eau, puis on complète jusqu'au trait de jauge. Pense aussi à convertir les mL en L.",
  build:function(k, S){
    var c = k.canvas(360), P = S.draw.palette;
    var SO = {NaCl:["NaCl",58.5,"sel de cuisine",null,360], CuSO4:["CuSO4.5H2O",249.5,"sulfate de cuivre hydraté",[30,110,210],320], KMnO4:["KMnO4",158,"permanganate de potassium",[130,20,160],64], glu:["C6H12O6",180,"glucose",null,900]};
    var st = {defi:false, goal:null, checked:true, score:0, n:0};
    function hex(a){ return "#" + a.map(function(v){ return ("0" + v.toString(16)).slice(-2); }).join(""); }
    var so = k.select("Soluté", Object.keys(SO).map(function(x){ return [x, SO[x][2]]; }), "CuSO4", function(){ st.checked = !st.defi; });
    var m = k.slider("Masse de soluté pesée", 0.1, 20, 0.05, 6.2, "g", function(){ if (st.defi){ st.checked = false; an.stop(); } });
    var fi = k.seg("Fiole jaugée", [[50,"50 mL"],[100,"100 mL"],[250,"250 mL"],[500,"500 mL"],[1000,"1 L"]], 250, function(){ if (st.defi){ st.checked = false; } });
    var ro = k.readouts(["n", "c (mol/L)", "c_m (g/L)"]);
    var nt = k.note("", "");
    var an = C4.anim(k, 5.5, function(){ st.checked = true; });
    k.button("▶ Préparer la solution", function(){ an.go(); if (st.defi) st.checked = false; }, true);
    k.button("🎯 Défi : concentration visée", function(){
      var keys = Object.keys(SO), t = 0, kk, V, cc, mm;
      do { kk = keys[Math.floor(Math.random() * 4)]; V = [100, 250, 500][Math.floor(Math.random() * 3)]; cc = [0.02, 0.05, 0.1, 0.2][Math.floor(Math.random() * 4)]; mm = cc * V / 1000 * SO[kk][1]; t++; } while ((mm < 0.3 || mm > 19 || (kk === "KMnO4" && cc > .05)) && t < 60);
      so.set(kk); fi.set(V); st.goal = {c:cc, V:V, m:mm, k:kk}; st.defi = true; st.checked = false; st.n++; m.set(1); an.stop();
    });
    k.button("Mode libre", function(){ st.defi = false; st.checked = true; });
    k.draw(function(){
      var s = SO[so.value], Mm = s[1], V = +fi.value / 1000, n = m.value / Mm, cm = n / V, cg = m.value / V, W = c.W, ctx = c.ctx, p = an.p, ph = C4.ph;
      C4.bg(c, 258);
      var ref = so.value === "KMnO4" ? 0.015 : 0.18, al = Math.min(.8, .1 + cm / ref * .7);
      var col = s[3] ? hex(s[3]) : "#9cc7e8", inten = s[3] ? al : .28;
      /* balance */
      var bx = 64, by = 150;
      ctx.fillStyle = "#c9d2de"; S.draw.rrect(c, bx - 54, by + 40, 108, 46, 10); ctx.fill(); ctx.fillStyle = "#dfe5ed"; S.draw.rrect(c, bx - 54, by + 40, 108, 14, 8); ctx.fill();
      ctx.fillStyle = "#aab4c1"; ctx.beginPath(); ctx.ellipse(bx, by + 38, 46, 9, 0, 0, 7); ctx.fill();
      var mShown = m.value * (p >= 1 ? 1 : ph(p, 0, .25)) * (p >= 1 ? 1 : 1);
      var moved = ph(p, .25, .45), pile = (1 - moved) * (p >= 1 ? 0 : 1);
      if (p < 1 || true){ var amt = p >= 1 ? .6 : (p < .25 ? ph(p, 0, .25) : 1 - moved); ctx.fillStyle = s[3] ? hex(s[3]) : "#f2f4f7"; ctx.strokeStyle = "#9aa5b4"; if (amt > .02){ ctx.beginPath(); ctx.ellipse(bx, by + 30, 8 + 16 * amt, 3 + 11 * amt, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); } }
      S.draw.display(c, S.fmt(p >= 1 ? m.value : mShown * (1 - moved), 2) + " g", bx, by + 66, {w:90, h:38, size:15});
      C4.t(c, "balance", bx, by + 100, {size:12, color:P.grey, weight:700});
      var stp = p >= 1 ? -1 : p < .45 ? 0 : p < .72 ? 1 : 2;
      ["1  Peser le soluté", "2  Dissoudre dans un peu d'eau", "3  Compléter jusqu'au trait"].forEach(function(t, i){ S.draw.label(c, t, 12, 22 + i * 28, {align:"left", size:12, color:stp === i ? P.amber : P.grey, fill:stp === i ? "rgba(194,106,12,.16)" : "rgba(255,255,255,.7)"}); });
      /* fiole jaugée */
      var fh = 120 + 70 * (Math.log10(+fi.value / 50) / Math.log10(20)), fx = W * 0.62, fy = 250 - fh;
      var full = .8528, lvl = p >= 1 ? full : (p < .45 ? 0 : p < .72 ? .3 * ph(p, .45, .6) : .3 + (full - .3) * ph(p, .72, 1));
      var dis = p >= 1 ? 1 : ph(p, .5, .75);
      var info = C4.volflask(c, fx, fy, fh, lvl, col, {alpha:inten * (p >= 1 ? 1 : .15 + .85 * dis)});
      if (p < 1 && p > .3 && p < .5){ var tt = ph(p, .3, .5); ctx.fillStyle = s[3] ? hex(s[3]) : "#e7ebf0"; for (var q = 0; q < 6; q++){ var pt = C4.bez([bx, by + 22], [(bx + fx) / 2, fy - 50], [fx + (q - 3) * 2, fy + 8], Math.min(1, tt * 1.1 - q * .02)); ctx.beginPath(); ctx.arc(pt[0], pt[1], 2.6, 0, 7); ctx.fill(); } }
      if (p >= .72 && p < 1){ S.draw.line(c, fx + 36, fy - 20, fx + 6, fy + 2, "#7fb4de", 4); ctx.fillStyle = "#cfe3f3"; S.draw.rrect(c, fx + 34, fy - 36, 40, 22, 6); ctx.fill(); C4.t(c, "eau", fx + 54, fy - 25, {size:11.5, color:P.blue}); }
      C4.t(c, "trait de jauge", fx + info.neck / 2 + 12, info.trait, {align:"left", size:11.5, color:P.red, weight:700});
      S.draw.text(c, S.fmt(V * 1000, 0) + " mL", fx, 270, {size:14, color:P.ink});
      /* calcul */
      var cy0 = 292;
      C4.t(c, "n = m / M = " + S.fmt(m.value, 2) + " / " + S.fmt(Mm, 1) + " = " + S.fmt(n, 4) + " mol", 12, cy0, {align:"left", size:13, color:P.ink});
      var showC = !st.defi || st.checked;
      C4.t(c, showC ? "c = n / V = " + S.fmt(n, 4) + " / " + S.fmt(V, 3) + " = " + S.fmt(cm, 3) + " mol/L" : "c = n / V = ? (lance « Préparer » pour vérifier)", 12, cy0 + 24, {align:"left", size:13.5, color:P.acc});
      C4.t(c, C4.uni(s[0].replace(".", "·")) + "   ·   M = " + S.fmt(Mm, 1) + " g/mol", 12, cy0 + 46, {align:"left", size:12, color:P.grey});
      ro.set(0, S.fmt(n, 4) + " mol"); ro.set(1, showC ? S.fmt(cm, 3) + " mol/L" : "?"); ro.set(2, showC ? S.fmt(cg, 1) + " g/L" : "?");
      if (st.defi && st.goal){
        var g = st.goal;
        if (!st.checked) nt.set("🎯 Défi : prépare <b>" + S.fmt(g.V, 0) + " mL</b> de solution de " + SO[g.k][2] + " à <b>" + S.fmt(g.c, 3) + " mol/L</b>. Calcule n = c · V puis m = n · M (M = " + S.fmt(SO[g.k][1], 1) + " g/mol), règle la masse, puis lance la préparation.", "");
        else { var ok = Math.abs(cm - g.c) <= 0.04 * g.c; nt.set(ok ? "✅ c = " + S.fmt(cm, 3) + " mol/L : c'est la concentration visée (" + S.fmt(g.c, 3) + " mol/L). La masse exacte était " + S.fmt(g.m, 2) + " g." : "c = " + S.fmt(cm, 3) + " mol/L, la cible est " + S.fmt(g.c, 3) + " mol/L : " + (cm < g.c ? "trop dilué, pèse plus de soluté." : "trop concentré, pèse moins de soluté.") + " (m attendue ≈ " + S.fmt(g.m, 2) + " g)", ok ? "ok" : "warn"); }
      } else nt.set(cg > s[4] ? "Au-delà de la solubilité (≈ " + s[4] + " g/L à 20 °C) : tout le soluté ne se dissoudrait pas." : "Solubilité approximative à 20 °C : ≈ " + s[4] + " g/L ; tu es en dessous, tout se dissout.", cg > s[4] ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c08-dilution", ch:"c08", tag:"Animation",
  titre:"Diluer : la quantité de soluté ne change pas",
  resume:"Prélève un volume de solution mère et complète : la solution fille est plus pâle, mais contient les mêmes particules.",
  but:"Règle la concentration de la mère, celle de la fille et le volume voulu, puis clique sur « Diluer » : la pipette prélève V₁, les particules rouges passent dans la fiole, on complète au trait. Compte-les : elles ne changent pas !",
  aRetenir:"n(mère prélevée) = n(fille) : c₁ · V₁ = c₂ · V₂. Facteur de dilution F = c₁ / c₂ = V₂ / V₁. Concentration divisée par F, mêmes particules, volume multiplié par F.",
  piege:"Il faut compléter jusqu'au trait de jauge, pas ajouter V₂ d'eau : V₂ est le volume total de la solution fille.",
  build:function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var c1 = k.slider("c₁ (solution mère)", 1, 5, 0.5, 2, "mol/L");
    var c2 = k.slider("c₂ (solution fille voulue)", 0.05, 1, 0.05, 0.2, "mol/L");
    var v2 = k.slider("V₂ (volume de fille)", 50, 1000, 50, 250, "mL");
    var ro = k.readouts(["V₁ à prélever", "Facteur F", "n transféré"]);
    var nt = k.note("", "");
    var an = C4.anim(k, 6.5);
    k.button("▶ Diluer", function(){ if (c2.value < c1.value) an.go(); }, true); k.button("↺ Remettre", function(){ an.stop(); });
    var rnd = C4.rnd(5), J = []; for (var i = 0; i < 160; i++) J.push([rnd(), rnd()]);
    var DOT = 1 / 8;
    function rgba(a){ return "rgba(47,127,209," + a + ")"; }
    k.draw(function(){
      var C1 = c1.value, C2 = c2.value, V2 = v2.value, V1 = C2 * V2 / C1, F = C1 / C2, n = C2 * V2 / 1000, W = c.W, ctx = c.ctx, p = an.p, ph = C4.ph, ok = C2 < C1;
      C4.bg(c, 330);
      var K = Math.max(1, Math.round(n * 1000 * DOT));
      var mw = Math.min(100, W * .26), mx = 14, my = 190, mh = 130, mcx = mx + mw / 2;
      var fcx = W - Math.min(80, W * .2) - 6, fy = 150, fh = 175;
      /* bécher mère */
      var nMd = Math.min(90, Math.round(C1 * 100 * DOT)), mLvl = .8 - (p < 1 ? .06 * ph(p, .1, .25) * (1 - ph(p, .5, .6)) : 0);
      C4.beaker2(c, mx, my, mw, mh, mLvl, "#2f7fd1", {alpha:.12 + .5 * C1 / 5, ticks:0});
      for (var i = 0; i < nMd; i++) S.draw.dot(c, mx + 8 + J[i][0] * (mw - 16), my + mh * (1 - mLvl) + 8 + J[i][1] * (mh * mLvl - 16), 2.2, "rgba(31,75,158,.7)");
      S.draw.text(c, "mère", mcx, my + mh + 18, {size:13, color:P.ink}); C4.t(c, S.fmt(C1, 1) + " mol/L", mcx, my + mh + 36, {size:12.5, color:P.acc});
      /* pipette : position selon la phase */
      var ptx, pty, fill = 0;
      var down = ph(p, 0, .15), up = ph(p, .15, .3), move = ph(p, .32, .5), out = ph(p, .5, .62), back = ph(p, .64, .72);
      if (p >= 1){ ptx = W * .5; pty = 40; fill = 0; }
      else {
        ptx = mcx + (fcx - mcx) * move; if (p > .64) ptx = fcx + (W * .5 - fcx) * back;
        pty = p < .15 ? 20 + 84 * down : p < .3 ? 104 - 84 * up : 20; fill = p < .3 ? up : (p < .5 ? 1 : 1 - out);
      }
      var pw = 13, ph0 = 130, py0 = pty + 24;
      var pipePath = function(cx){ return function(cc){ cc.beginPath(); cc.moveTo(cx - pw / 2 - 2, py0); cc.lineTo(cx - pw / 2, py0 + 2); cc.lineTo(cx - pw / 2, py0 + ph0 - 14); cc.lineTo(cx, py0 + ph0 + 8); cc.lineTo(cx + pw / 2, py0 + ph0 - 14); cc.lineTo(cx + pw / 2, py0 + 2); cc.lineTo(cx + pw / 2 + 2, py0); cc.closePath(); }; };
      C4.vessel(c, pipePath(ptx), {x:ptx - pw / 2, y:py0, w:pw, h:ph0 + 8}, .62 * fill, "#2f7fd1", {alpha:.12 + .5 * C1 / 5, shine:false});
      var kd = Math.min(8, Math.max(2, Math.round(K * .6)));
      if (fill > .05) for (i = 0; i < Math.min(K, 9); i++) S.draw.dot(c, ptx - 2 + (J[i][0] - .5) * 7, py0 + ph0 - 6 - fill * 62 * (.15 + J[i][1] * .8), 2.5, P.red);
      C4.t(c, "pipette " + S.fmt(V1, V1 < 10 ? 2 : 1) + " mL", ptx + 12, py0 + 36, {align:"left", size:12, color:P.red});
      /* fiole fille */
      var full = .8528, lvl = p >= 1 ? full : p < .5 ? 0 : p < .64 ? .1 * out : .1 + (full - .1) * ph(p, .7, 1);
      var fcol = "#2f7fd1", fal = .16 + .5 * C2 / 5;
      var info = C4.volflask(c, fcx, fy, fh, lvl, fcol, {alpha:p >= 1 ? fal : (p < .7 ? .12 + .5 * C1 / 5 : C4.lerp(.12 + .5 * C1 / 5, fal, ph(p, .7, 1)))});
      var shownK = (p >= 1 || p > .5) ? K : 0, sp = p >= 1 ? 1 : ph(p, .7, 1);
      for (i = 0; i < shownK; i++){
        var R = info.bulbR * .82, ang = J[i + 40][0] * 6.283, rr = Math.sqrt(J[i + 40][1]) * R, tx = fcx + Math.cos(ang) * rr, ty = info.bulbY + Math.sin(ang) * rr;
        var bx = fcx + (J[i + 40][0] - .5) * info.bulbR * .7, by = info.bulbY + info.bulbR * .72 - J[i + 40][1] * 10;
        var xx = C4.lerp(bx, tx, sp), yy = C4.lerp(by, ty, sp); if (p < .5) continue;
        S.draw.dot(c, xx, yy, 2.5, P.red);
      }
      S.draw.text(c, "fille", fcx, fy + fh + 18, {size:13, color:P.ink}); C4.t(c, S.fmt(C2, 2) + " mol/L · " + S.fmt(V2, 0) + " mL", fcx, fy + fh + 36, {size:12.5, color:P.acc});
      /* compte de particules */
      S.draw.label(c, "● " + K + " particules transférées (rouges)", W / 2, 16, {color:P.red, size:12.5});
      if (p >= 1 && ok) C4.t(c, "mêmes " + K + " ●, volume × " + S.fmt(F, 1), W / 2, 36, {size:12, color:P.grey, weight:700});
      if (!ok) S.draw.label(c, "c₂ doit être plus petite que c₁", W / 2, 60, {color:P.red, size:13});
      ro.set(0, S.fmt(V1, 2) + " mL"); ro.set(1, S.fmt(F, 1)); ro.set(2, S.fmt(n * 1000, 1) + " mmol");
      nt.set(C2 >= C1 ? "c₂ ≥ c₁ : ce n'est pas une dilution (on ne peut pas diluer pour concentrer)." : V1 > V2 ? "Volume à prélever supérieur à V₂ : impossible." : "Prélève " + S.fmt(V1, 2) + " mL de mère, place-les dans une fiole de " + S.fmt(V2, 0) + " mL et complète jusqu'au trait avec de l'eau. Il y a " + S.fmt(F, 1) + " fois moins de particules par litre. (1 point rouge = 8 mmol, dessin qualitatif.)", C2 >= C1 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c08-teinte", ch:"c08", tag:"Étalonnage",
  titre:"Échelle de teinte : trouver une concentration inconnue",
  resume:"Une solution bleue de concentration cachée : compare sa couleur et son absorbance à celles d'une gamme étalon.",
  but:"Observe la gamme étalon et l'absorbance de l'inconnue. Déplace le curseur sur la droite d'étalonnage pour lire sa concentration, puis vérifie.",
  aRetenir:"Dans le domaine de linéarité, l'absorbance est proportionnelle à la concentration : A = k · c (loi de Beer-Lambert). On lit c sur la droite d'étalonnage à l'absorbance mesurée.",
  piege:"Modèle simplifié (A = 10 L/mol × c pour 1 cm de cuve) : au-delà de A ≈ 1, la proportionnalité n'est plus fiable, il vaut mieux diluer l'échantillon.",
  build:function(k, S){
    var c = k.canvas(330), K = 10, st = {cx:0.05, rev:false};
    var cl = k.slider("Concentration lue sur la droite", 0, 0.12, 0.001, 0.05, "mol/L");
    var ro = k.readouts(["A de l'inconnue", "A à la valeur lue", "c lue"]);
    var nt = k.note("Place le curseur pour que l'absorbance de la droite égale celle de l'inconnue.", "");
    k.button("Révéler", function(){ st.rev = true; }, true); k.button("Nouvelle inconnue", function(){ st.cx = Math.round((0.012 + Math.random() * 0.08) * 1000) / 1000; st.rev = false; cl.set(0.05); });
    st.cx = 0.047;
    function colr(A){ var f = Math.min(1, A / 1.2); return "rgb(" + Math.round(255 - f * 215) + "," + Math.round(255 - f * 125) + "," + Math.round(255 - f * 40) + ")"; }
    k.draw(function(){
      var Ax = K * st.cx, cc = cl.value, Ac = K * cc;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, ref = [0, 0.02, 0.04, 0.06, 0.08, 0.10], tw = (W - 40) / 7;
      ref.concat([null]).forEach(function(v, i){
        var x = 14 + i * (tw + 2), A = v === null ? Ax : K * v;
        ctx.fillStyle = colr(A); ctx.fillRect(x, 30, tw - 8, 70); ctx.strokeStyle = v === null ? "#c0321d" : "#5f6b7a"; ctx.lineWidth = v === null ? 3 : 2; ctx.strokeRect(x, 30, tw - 8, 70);
        C4.label(c, v === null ? "?" : S.fmt(v, 2), x + (tw - 8) / 2, 114, v === null ? "#c0321d" : "#2c3a4e", 12);
      });
      C4.label(c, "gamme étalon (mol/L) et solution inconnue", W / 2, 14, "#5f6b7a", 12);
      var g = {x0:0, x1:0.12, y0:0, y1:1.2}, L = 48, R = W - 16, T = 140, B = 300;
      var X = function(x){ return L + x / g.x1 * (R - L); }, Y = function(y){ return B - y / g.y1 * (B - T); };
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      for (var a = 0; a <= 1.2; a += 0.2){ C4.label(c, S.fmt(a, 1), L - 5, Y(a), "#5f6b7a", 11, "right"); }
      for (var q = 0; q <= 0.12; q += 0.02){ C4.label(c, S.fmt(q, 2), X(q), B + 12, "#5f6b7a", 11); }
      C4.label(c, "c (mol/L)", R, B + 26, "#2c3a4e", 12, "right"); C4.label(c, "A", L + 6, T - 8, "#2c3a4e", 12, "left");
      S.draw.line(c, X(0), Y(0), X(0.12), Y(1.2), "#1f4b9e", 2.5);
      ref.forEach(function(v){ S.draw.dot(c, X(v), Y(K * v), 5, "#1f4b9e"); });
      S.draw.line(c, L, Y(Ax), R, Y(Ax), "#c0321d", 1.5, [5, 4]); C4.tag(c, "A inconnue = " + S.fmt(Ax, 3), R, Y(Ax) - 10, "#c0321d", 12, "right");
      S.draw.line(c, X(cc), B, X(cc), Y(Ac), "#24775a", 2); S.draw.dot(c, X(cc), Y(Ac), 6, "#24775a");
      ro.set(0, S.fmt(Ax, 3)); ro.set(1, S.fmt(Ac, 3)); ro.set(2, S.fmt(cc, 3) + " mol/L");
      if (st.rev) nt.set("Concentration réelle : " + S.fmt(st.cx, 3) + " mol/L. Ton résultat : " + S.fmt(cc, 3) + " mol/L (écart " + S.fmt(Math.abs(cc - st.cx) / st.cx * 100, 1) + " %).", Math.abs(cc - st.cx) / st.cx < 0.05 ? "ok" : "warn");
      else nt.set(Ax > 1 ? "Absorbance trop élevée (> 1) : dilue l'échantillon avant de mesurer." : "Place le curseur vert pour que A(curseur) = A(inconnue), puis clique sur « Révéler ».", Ax > 1 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c08-mer", ch:"c08", tag:"Niche",
  titre:"Évaporer l'eau de mer : une saumure de plus en plus concentrée",
  resume:"Quand l'eau s'évapore, le sel reste : la concentration augmente jusqu'à la saturation, puis le sel cristallise.",
  but:"Fais s'évaporer une part de 10 L d'eau de mer (35 g/L de sel) et regarde c, la limite de solubilité et les cristaux.",
  aRetenir:"La masse de sel dissous ne change pas tant que rien ne cristallise : c = m(sel) / V, donc c augmente quand V diminue. Au-delà de la solubilité (≈ 360 g/L pour NaCl à 20 °C), l'excès cristallise.",
  piege:"Modèle simplifié : on suppose que seul NaCl est dissous (35 g/L, M = 58,5 g/mol). Dans la vraie eau de mer, d'autres sels existent et cristallisent à d'autres moments (c'est pourquoi les marais salants se font par étapes).",
  build:function(k, S){
    var c = k.canvas(280), V0 = 10, c0 = 35, SAT = 360;
    var f = k.slider("Part de l'eau évaporée", 0, 95, 1, 0, "%");
    var ro = k.readouts(["Volume restant", "c dissous", "c (mol/L)", "Sel cristallisé"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ f.set(Math.min(95, f.value + dt * 12)); if (f.value >= 95) lp.pause(); k.redraw(); });
    k.button("▶ Évaporer", function(){ if (f.value >= 95) f.set(0); lp.play(); }, true); k.button("❚❚ Pause", function(){ lp.pause(); }); k.button("↺ Départ", function(){ lp.pause(); f.set(0); });
    k.draw(function(){
      var fr = f.value / 100, V = V0 * (1 - fr), cmax = c0 * V0 / V, cd = Math.min(cmax, SAT), cr = Math.max(0, c0 * V0 - SAT * V);
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, cx = W * 0.22, hf = 150 * V / V0 + 4;
      ctx.fillStyle = "rgba(60,150,200," + Math.min(0.9, 0.2 + cd / 500) + ")"; ctx.fillRect(cx - 50, 200 - hf, 100, hf);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 50, 40); ctx.lineTo(cx - 50, 200); ctx.lineTo(cx + 50, 200); ctx.lineTo(cx + 50, 40); ctx.stroke();
      var nc = Math.round(Math.min(60, cr / 5)); var rnd = C4.rnd(3); for (var i = 0; i < nc; i++){ ctx.fillStyle = "#f4f7fb"; ctx.fillRect(cx - 46 + rnd() * 88, 192 - rnd() * 8, 6, 6); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; }
      if (f.value > 0 && f.value < 95) for (i = 0; i < 4; i++){ S.draw.dot(c, cx - 30 + i * 20, 30 - ((Date.now() / 25 + i * 17) % 22), 3, "rgba(120,170,210,.5)"); }
      C4.label(c, S.fmt(V, 1) + " L", cx, 222, "#2c3a4e", 13);
      var gx = W * 0.5, gw = W * 0.45, gb = 220;
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gx, 40); ctx.lineTo(gx, gb); ctx.lineTo(gx + gw, gb); ctx.stroke();
      var Y = function(y){ return gb - y / 450 * (gb - 40); }, X = function(p){ return gx + p / 95 * gw; };
      S.draw.line(c, gx, Y(SAT), gx + gw, Y(SAT), "#c0321d", 1.5, [5, 4]); C4.tag(c, "saturation ≈ 360 g/L", gx + 4, Y(SAT) - 10, "#c0321d", 12, "left");
      ctx.strokeStyle = "#1f4b9e"; ctx.lineWidth = 3; ctx.beginPath(); for (var p = 0; p <= 95; p += 1){ var vv = V0 * (1 - p / 100), cc = Math.min(c0 * V0 / vv, SAT); if (p) ctx.lineTo(X(p), Y(cc)); else ctx.moveTo(X(p), Y(cc)); } ctx.stroke();
      S.draw.dot(c, X(f.value), Y(cd), 6, "#c0321d");
      C4.label(c, "c dissous (g/L)", gx + 4, 30, "#2c3a4e", 12, "left"); C4.label(c, "% évaporé →", gx + gw, gb + 18, "#2c3a4e", 12, "right");
      ro.set(0, S.fmt(V, 2) + " L"); ro.set(1, S.fmt(cd, 0) + " g/L"); ro.set(2, S.fmt(cd / 58.5, 2) + " mol/L"); ro.set(3, S.fmt(cr, 0) + " g");
      nt.set(cr > 0 ? "Saturation atteinte : le sel en excès cristallise (" + S.fmt(cr, 0) + " g sur 350 g). Sans cristallisation, c vaudrait " + S.fmt(cmax, 0) + " g/L." : "Rien ne cristallise encore : c = 350 g / " + S.fmt(V, 2) + " L = " + S.fmt(cmax, 0) + " g/L.", "");
    });
  }
});
