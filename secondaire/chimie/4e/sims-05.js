/* Chimie 4e · chapitre 5 · Lire une équation */
SFA.sim({
  id:"c4-c05-avancement", ch:"c05", tag:"Classique",
  titre:"Tableau d'avancement visuel",
  resume:"Fais avancer la réaction : les réactifs diminuent, les produits augmentent, selon les coefficients.",
  but:"Choisis une réaction et les quantités initiales, puis fais glisser l'avancement ξ jusqu'à ce qu'un réactif soit épuisé.",
  aRetenir:"Quand la réaction avance de ξ (en mol), chaque espèce varie de « coefficient × ξ » : n(réactif) = n₀ − a·ξ ; n(produit) = b·ξ. L'avancement maximal est atteint quand un réactif est épuisé.",
  piege:"Les coefficients décrivent les variations de quantité de matière, pas les quantités présentes : on peut très bien avoir 10 mol d'un réactif et 3 mol d'un autre.",
  build:function(k, S){
    var c = k.canvas(300);
    var keys = ["eau","mgo","nh3","ch4","c3h8"];
    var rx = k.select("Réaction", keys.map(function(x){ return [x, C4.REAC[x].nom]; }), "eau");
    var a = k.slider("Quantité initiale du réactif 1", 0.5, 10, 0.5, 4, "mol");
    var b = k.slider("Quantité initiale du réactif 2", 0.5, 10, 0.5, 3, "mol");
    var xs = k.slider("Avancement ξ", 0, 10, 0.1, 0, "mol");
    var ro = k.readouts(["ξ réel", "ξ maximal", "Réactif limitant"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ xs.set(Math.min(10, xs.value + dt * 1.5)); var e = C4.REAC[rx.value], xm = Math.min(a.value / e.r[0][0], b.value / e.r[1][0]); if (xs.value >= xm){ lp.pause(); } k.redraw(); });
    k.button("▶ Lancer", function(){ xs.set(0); lp.play(); }, true); k.button("❚❚ Pause", function(){ lp.pause(); });
    k.draw(function(){
      var e = C4.REAC[rx.value], n0 = [a.value, b.value];
      var xm = Math.min(n0[0] / e.r[0][0], n0[1] / e.r[1][0]), x = Math.min(xs.value, xm);
      var sp = [];
      e.r.forEach(function(t, i){ sp.push({f:t[1], co:t[0], n0:n0[i], n:n0[i] - t[0] * x, r:true}); });
      e.p.forEach(function(t){ sp.push({f:t[1], co:t[0], n0:0, n:t[0] * x, r:false}); });
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, base = 230, mx = 12, hs = 170 / mx, cw = (W - 30) / sp.length;
      C4.label(c, C4.eqU(rx.value), W / 2, 14, "#2c3a4e", 13);
      sp.forEach(function(s, i){
        var x0 = 15 + i * cw, bw = cw * 0.34;
        ctx.fillStyle = "#dfe4ea"; ctx.fillRect(x0 + cw * 0.1, base - s.n0 * hs, bw, s.n0 * hs);
        ctx.fillStyle = s.r ? "#c0321d" : "#24775a"; ctx.fillRect(x0 + cw * 0.1 + bw + 3, base - s.n * hs, bw, s.n * hs);
        C4.label(c, S.fmt(s.n, 2), x0 + cw * 0.1 + bw + 3 + bw / 2, base - s.n * hs - 9, "#0f1b2d", 12);
        C4.label(c, (s.co > 1 ? s.co + " " : "") + C4.uni(s.f), x0 + cw / 2, base + 16, "#0f1b2d", 13);
        C4.label(c, "coef. " + s.co, x0 + cw / 2, base + 34, "#5f6b7a", 11);
      });
      C4.label(c, "gris : début · couleur : maintenant (mol)", W / 2, 285, "#5f6b7a", 12);
      var lim = (n0[0] / e.r[0][0] < n0[1] / e.r[1][0]) ? 0 : (n0[0] / e.r[0][0] > n0[1] / e.r[1][0]) ? 1 : -1;
      ro.set(0, S.fmt(x, 2) + " mol"); ro.set(1, S.fmt(xm, 2) + " mol"); ro.set(2, lim < 0 ? "aucun (proportions parfaites)" : C4.sub(e.r[lim][1]));
      nt.set(xs.value >= xm - 1e-9 ? "Réaction terminée : " + (lim < 0 ? "les deux réactifs sont épuisés ensemble." : C4.sub(e.r[lim][1]) + " est épuisé, " + C4.sub(e.r[1 - lim][1]) + " reste en excès (" + S.fmt(sp[1 - lim].n, 2) + " mol).") : "En cours : chaque fois que ξ augmente de 1 mol, " + e.r.map(function(t){ return t[0] + " mol de " + C4.sub(t[1]); }).join(" et ") + " disparaissent.", "");
    });
  }
});

SFA.sim({
  id:"c4-c05-niveaux", ch:"c05", tag:"Comparaison",
  titre:"Une équation, trois lectures",
  resume:"Moles, masses et volumes de gaz pour la même réaction : les coefficients valent pour les moles, pas pour les masses.",
  but:"Choisis une réaction et une quantité de réaction ξ. Compare les lignes « moles », « masses » et « volumes de gaz ».",
  aRetenir:"Les coefficients donnent les rapports de moles (et de volumes de gaz à T et p identiques). Les masses se calculent avec m = n·M. La masse totale se conserve (Lavoisier), pas le nombre de moles.",
  piege:"Dans 2 H₂ + O₂ → 2 H₂O, les coefficients sont 2 : 1 : 2, mais les masses sont 4 g : 32 g : 36 g.",
  build:function(k, S){
    var c = k.canvas(340);
    var keys = Object.keys(C4.REAC);
    var rx = k.select("Réaction", keys.map(function(x){ return [x, C4.REAC[x].nom]; }), "eau");
    var xi = k.slider("Avancement ξ (nombre de « fois » que la réaction a lieu)", 0.1, 5, 0.1, 1, "mol");
    var ro = k.readouts(["Σ m réactifs", "Σ m produits", "Σ n réactifs", "Σ n produits"]);
    var nt = k.note("", "");
    k.draw(function(){
      var e = C4.REAC[rx.value], x = xi.value, sp = [], Sm = [0, 0], Sn = [0, 0];
      e.r.forEach(function(t){ sp.push({f:t[1], co:t[0], r:1}); }); e.p.forEach(function(t){ sp.push({f:t[1], co:t[0], r:0}); });
      sp.forEach(function(s){ s.n = s.co * x; s.m = s.n * C4.M(s.f); s.v = C4.GAS[s.f] ? s.n * 24 : null; var q = s.r ? 0 : 1; Sm[q] += s.m; Sn[q] += s.n; });
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, cw = (W - 70) / sp.length, rows = [["n (mol)", "n"], ["m (g)", "m"], ["V gaz (L)", "v"]];
      rows.forEach(function(rw, ri){
        var y0 = 20 + ri * 105, mx = Math.max.apply(0, sp.map(function(s){ return s[rw[1]] || 0; })) || 1;
        C4.label(c, rw[0], 8, y0 + 4, "#5f6b7a", 12, "left");
        sp.forEach(function(s, i){
          var xx = 70 + i * cw, val = s[rw[1]];
          if (val === null){ C4.label(c, "pas un gaz", xx + cw / 2, y0 + 60, "#8a95a3", 11); }
          else { var h = 62 * val / mx; ctx.fillStyle = s.r ? "#c0321d" : "#24775a"; ctx.fillRect(xx + cw * 0.18, y0 + 78 - h, cw * 0.64, h); C4.label(c, S.fmt(val, val < 10 ? 2 : 1), xx + cw / 2, y0 + 78 - h - 9, "#0f1b2d", 11); }
          if (ri === 2) C4.label(c, (s.co > 1 ? s.co + " " : "") + C4.uni(s.f), xx + cw / 2, y0 + 96, "#0f1b2d", 12);
        });
        ctx.strokeStyle = "#cfd6df"; ctx.beginPath(); ctx.moveTo(70, y0 + 78); ctx.lineTo(W - 4, y0 + 78); ctx.stroke();
      });
      var nr = e.r.length; S.draw.line(c, 70 + nr * cw, 16, 70 + nr * cw, 330, "#8a95a3", 1, [4, 4]);
      ro.set(0, S.fmt(Sm[0], 1) + " g"); ro.set(1, S.fmt(Sm[1], 1) + " g"); ro.set(2, S.fmt(Sn[0], 2) + " mol"); ro.set(3, S.fmt(Sn[1], 2) + " mol");
      nt.set(Math.abs(Sm[0] - Sm[1]) < 1e-6 ? "✅ La masse se conserve (" + S.fmt(Sm[0], 1) + " g des deux côtés)." + (Math.abs(Sn[0] - Sn[1]) > 1e-9 ? " Mais le nombre de moles change : " + S.fmt(Sn[0], 2) + " → " + S.fmt(Sn[1], 2) + " mol." : " Ici le nombre de moles ne change pas, mais ce n'est pas une règle.") : "Vérifie l'équilibrage.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c05-lavoisier", ch:"c05", tag:"Expérience",
  titre:"La balance de Lavoisier : où est passée la masse ?",
  resume:"Ouvert ou fermé, le flacon ne donne pas la même pesée : la masse totale, elle, se conserve.",
  but:"Choisis une expérience, ouvre ou ferme le flacon, lance la réaction et regarde l'affichage de la balance.",
  aRetenir:"Dans un système fermé, la masse totale est constante. Dans un système ouvert, la balance peut indiquer plus (un gaz de l'air a été capté) ou moins (un gaz s'est échappé).",
  piege:"« La masse a disparu » ou « la masse a augmenté » signifie en réalité qu'un gaz est parti ou arrivé sans être pesé.",
  build:function(k, S){
    var c = k.canvas(300);
    var X = {
      mg:{nom:"Magnésium qui brûle : 2 Mg + O₂ → 2 MgO", fn:function(m){ return {gain:m / 24 * 16, gas:"O₂"}; }, solidName:"Mg → MgO"},
      fe:{nom:"Laine d'acier qui rouille : 4 Fe + 3 O₂ → 2 Fe₂O₃", fn:function(m){ return {gain:m / 56 * 0.75 * 32, gas:"O₂"}; }, solidName:"Fe → Fe₂O₃"},
      caco3:{nom:"Calcaire + acide : CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂", fn:function(m){ return {gain:-m / 100 * 44, gas:"CO₂"}; }, solidName:"flacon et contenu"}
    };
    var ex = k.select("Expérience", Object.keys(X).map(function(x){ return [x, X[x].nom]; }), "mg");
    var m = k.slider("Masse du solide de départ", 1, 10, 0.5, 2.4, "g");
    var cl = k.seg("Flacon", [["ouvert","Ouvert"],["ferme","Fermé"]], "ouvert");
    var ro = k.readouts(["Balance au début", "Balance à la fin", "Variation"]);
    var nt = k.note("", "");
    var st = {p:0}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) lp.pause(); k.redraw(); });
    [ex.el, m.el].forEach(function(e){ e.addEventListener("input", function(){ st.p = 0; }); e.addEventListener("change", function(){ st.p = 0; }); });
    k.button("▶ Lancer", function(){ st.p = 0; lp.play(); }, true); k.button("↺ Remettre à zéro", function(){ lp.pause(); st.p = 0; });
    k.draw(function(){
      var e = X[ex.value], r = e.fn(m.value), open = cl.value === "ouvert", isCa = ex.value === "caco3";
      var base = isCa ? m.value + 60 : m.value;                         /* masse initiale pesée */
      var ch = r.gain, wasClosed = !open;
      var reading = (wasClosed ? base : base + ch * st.p), r0 = base;
      if (!isCa && wasClosed) reading = base + 0;                       /* flacon fermé : le solide + l'air sont pesés ensemble */
      if (!isCa && wasClosed) { reading = base; }
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, cx = W * 0.35;
      /* balance */
      ctx.fillStyle = "#e3e7ed"; C4.rr(ctx, cx - 90, 220, 180, 50, 8); ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.fillRect(cx - 60, 232, 120, 28); C4.label(c, S.fmt(reading, 2) + " g", cx, 246, "#7CFC98", 17);
      /* flacon */
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.fillStyle = "rgba(200,225,240,.35)";
      ctx.beginPath(); ctx.moveTo(cx - 14, 90); ctx.lineTo(cx - 14, 120); ctx.lineTo(cx - 48, 214); ctx.lineTo(cx + 48, 214); ctx.lineTo(cx + 14, 120); ctx.lineTo(cx + 14, 90); ctx.fill(); ctx.stroke();
      if (!open){ ctx.fillStyle = "#c26a0c"; ctx.fillRect(cx - 18, 78, 36, 14); C4.label(c, "bouchon", cx, 66, "#5f6b7a", 11); }
      ctx.fillStyle = isCa ? "rgba(244,197,66,.45)" : "#6c7d90"; if (isCa) ctx.fillRect(cx - 40, 190, 80, 22); else ctx.fillRect(cx - 24, 204, 48, 8);
      /* flèches de gaz */
      if (open && st.p > 0 && st.p < 1){
        var up = isCa; for (var i = 0; i < 3; i++){ var yy = up ? 100 - ((st.p * 100 + i * 20) % 60) : 40 + ((st.p * 100 + i * 20) % 60); S.draw.arrow(c, cx + (i - 1) * 24 + 90, up ? yy + 20 : yy, cx + (i - 1) * 24 + 90, up ? yy : yy + 20, "#0e7f96", 2); }
        C4.label(c, r.gas + (up ? " s'échappe" : " entre"), cx + 110, 130, "#0e7f96", 12, "left");
      }
      if (!open) C4.label(c, "rien n'entre ni ne sort", cx + 62, 130, "#24775a", 12, "left");
      var fin = (wasClosed ? base : base + ch);
      ro.set(0, S.fmt(r0, 2) + " g"); ro.set(1, S.fmt(wasClosed ? base : fin, 2) + " g"); ro.set(2, S.fmt((wasClosed ? 0 : ch), 2) + " g");
      nt.set(wasClosed ? "Flacon fermé : toute la masse est pesée (solides, liquides, gaz). Variation nulle : la masse se conserve." : isCa ? "Flacon ouvert : le CO₂ (" + S.fmt(-ch, 2) + " g) s'échappe, la balance indique moins. Ce n'est pas une destruction de masse : le gaz est parti." : "Flacon ouvert : le solide capte " + S.fmt(ch, 2) + " g de O₂ pris dans l'air. La balance indique plus : le dioxygène est compté dans le solide formé.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c05-combustibles", ch:"c05", tag:"Comparaison",
  titre:"Brûler 1 kg : combien de CO₂ ?",
  resume:"Compare la masse de CO₂ émise par différents combustibles et vérifie Lavoisier.",
  but:"Choisis un combustible et une masse. Regarde la masse de dioxygène consommée, de CO₂ et d'eau produites.",
  aRetenir:"La masse de CO₂ émise se calcule avec l'équation : m(CO₂) = n(CO₂) · 44. Pour 1 g de carbone pur, on obtient 44/12 ≈ 3,7 g de CO₂ : le CO₂ pèse plus que le carbone brûlé car il contient aussi l'oxygène de l'air.",
  piege:"Le carbone ne « disparaît » pas : 12 g de carbone + 32 g de O₂ donnent 44 g de CO₂. Le carbone brûlé est devenu un gaz.",
  build:function(k, S){
    var c = k.canvas(300);
    var F = [["C","carbone (charbon pur)",1,1,0],["CH4","méthane (gaz naturel)",1,2,2],["C3H8","propane",1,5,3],["C4H10","butane",2,13,4],["C2H6O","éthanol",1,3,2],["C6H12O6","glucose",1,6,6]];
    /* forme : [formule, nom, coef carburant, coef O2, nCO2 par carburant*coef... on calcule CO2 depuis la formule] */
    var P = {C:{f:1,o:1,co:1,h:0}, CH4:{f:1,o:2,co:1,h:2}, C3H8:{f:1,o:5,co:3,h:4}, C4H10:{f:2,o:13,co:8,h:10}, C2H6O:{f:1,o:3,co:2,h:3}, C6H12O6:{f:1,o:6,co:6,h:6}};
    var fu = k.select("Combustible", F.map(function(x){ return [x[0], x[1]]; }), "CH4");
    var m = k.slider("Masse de combustible", 0.1, 20, 0.1, 1, "kg");
    var ro = k.readouts(["O₂ consommé", "CO₂ émis", "H₂O formée", "Volume de CO₂"]);
    var nt = k.note("", "");
    function per(f){ var p = P[f], M = C4.M(f) * p.f; return {o2:p.o * 32 / M, co2:p.co * 44 / M, h2o:p.h * 18 / M}; }
    k.draw(function(){
      var p = per(fu.value), mm = m.value;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, lw = 110;
      var rows = F.map(function(x){ return {f:x[0], v:per(x[0]).co2}; }).sort(function(a, b){ return b.v - a.v; });
      C4.label(c, "kg de CO₂ émis par kg de combustible brûlé", W / 2, 14, "#2c3a4e", 13);
      rows.forEach(function(r, i){ var y = 40 + i * 28; C4.label(c, C4.uni(r.f), 10, y + 9, "#0f1b2d", 13, "left"); C4.bar(c, lw, y, W - lw - 40, 18, r.v / 4, r.f === fu.value ? "#c0321d" : "#8a95a3"); C4.label(c, S.fmt(r.v, 2), lw + (W - lw - 40) * r.v / 4 + 4, y + 9, "#0f1b2d", 12, "left"); });
      var tot = mm + mm * p.o2, y2 = 225;
      C4.label(c, "Bilan pour " + S.fmt(mm, 1) + " kg :", 10, y2, "#2c3a4e", 13, "left");
      C4.label(c, "combustible " + S.fmt(mm, 1) + " + O₂ " + S.fmt(mm * p.o2, 1) + " = " + S.fmt(tot, 1) + " kg", 10, y2 + 24, "#1f4b9e", 13, "left");
      C4.label(c, "CO₂ " + S.fmt(mm * p.co2, 1) + " + H₂O " + S.fmt(mm * p.h2o, 1) + " = " + S.fmt(mm * (p.co2 + p.h2o), 1) + " kg", 10, y2 + 48, "#24775a", 13, "left");
      ro.set(0, S.fmt(mm * p.o2, 2) + " kg"); ro.set(1, S.fmt(mm * p.co2, 2) + " kg"); ro.set(2, S.fmt(mm * p.h2o, 2) + " kg"); ro.set(3, S.sci(mm * p.co2 * 1000 / 44 * 24, 3) + " L");
      nt.set("Masse de CO₂ par unité de masse, pas par unité d'énergie : la comparaison n'est valable que sur la masse brûlée. Volume à 20 °C (V<sub>m</sub> = 24 L/mol). L'eau formée est supposée liquide.", "");
    });
  }
});
