/* Chimie 4e · chapitre 6 · Calculs stœchiométriques */
SFA.sim({
  id:"c4-c06-guide", ch:"c06", tag:"Classique",
  titre:"Le calculateur guidé en 4 étapes",
  resume:"Choisis une réaction, une espèce connue et une espèce cherchée : les 4 étapes du calcul s'allument une à une, ou devine-les toi-même.",
  but:"Règle la masse de départ, puis clique sur « Étape suivante ». Active « Je devine d'abord » : tu dois taper le résultat de chaque étape avant qu'il s'affiche.",
  aRetenir:"Méthode : 1) masse → moles (n = m / M) ; 2) rapport des coefficients ; 3) moles de l'espèce cherchée ; 4) moles → masse (m = n · M), ou → volume de gaz (V = n · V_m).",
  piege:"On ne divise jamais directement les masses par les coefficients : il faut toujours passer par les moles.",
  build:function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var keys = Object.keys(C4.REAC), st = {step:0, ok:0};
    var rx = k.select("Réaction", keys.map(function(x){ return [x, C4.REAC[x].nom]; }), "ch4", function(){ refill(); st.step = 0; });
    var gv = k.select("Espèce connue", [["0","—"]], "0", function(){ st.step = 0; });
    var wn = k.select("Espèce cherchée", [["0","—"]], "0", function(){ st.step = 0; });
    var m = k.slider("Masse de l'espèce connue", 0.1, 100, 0.1, 16, "g", function(){ st.step = 0; });
    var gs = k.toggle("Je devine d'abord (tape ta valeur)", false, function(){ st.step = 0; fb.set("", ""); });
    var gi = k.input("Ma valeur pour l'étape suivante", "", function(){}, "text");
    var out = k.note("", "ok", "stage");
    var fb = k.note("", "");
    function species(){ var e = C4.REAC[rx.value]; return e.r.concat(e.p); }
    function refill(){
      var sp = species();
      [gv, wn].forEach(function(sel, j){
        sel.el.innerHTML = "";
        sp.forEach(function(t, i){ var o = document.createElement("option"); o.value = i; o.textContent = (i < C4.REAC[rx.value].r.length ? "réactif " : "produit ") + C4.uni(t[1]); sel.el.appendChild(o); });
        sel.el.value = j === 0 ? 0 : sp.length - 1;
      });
    }
    refill();
    function vals(){
      var sp = species(), g = sp[+gv.value], w = sp[+wn.value];
      if (gv.value === wn.value) return null;
      var Mg = C4.M(g[1]), Mw = C4.M(w[1]), n = m.value / Mg, ratio = w[0] / g[0], nw = n * ratio, mw = nw * Mw;
      return {g:g, w:w, Mg:Mg, Mw:Mw, n:n, ratio:ratio, nw:nw, mw:mw, gas:C4.GAS[w[1]]};
    }
    k.button("Étape suivante ▶", function(){
      var v = vals(); if (!v) return;
      if (gs.value && st.step < 4){
        var want = [v.n, v.ratio, v.nw, v.mw][st.step], got = parseFloat(String(gi.value).replace(",", "."));
        if (!isFinite(got)){ fb.set("Tape ta valeur (un nombre) avant de continuer.", "warn"); return; }
        if (Math.abs(got - want) <= 0.02 * Math.abs(want) + 1e-9){ st.ok++; fb.set("✅ Exact : " + S.fmt(want, 4) + ". Étape suivante.", "ok"); gi.set(""); }
        else { fb.set("Pas tout à fait (tu as " + S.fmt(got, 4) + "). Indice : " + ["n = m / M, avec M = " + S.fmt(v.Mg, 1) + " g/mol.", "coefficient cherché / coefficient connu = " + v.w[0] + " / " + v.g[0] + ".", "n(cherchée) = n(connue) × rapport.", "m = n × M, avec M = " + S.fmt(v.Mw, 1) + " g/mol."][st.step], "warn"); return; }
      } else if (!gs.value) fb.set("", "");
      st.step = Math.min(5, st.step + 1);
    }, true);
    k.button("↺ Recommencer", function(){ st.step = 0; fb.set("", ""); });
    k.draw(function(){
      var v = vals(), W = c.W, ctx = c.ctx, narrow = W < 500;
      c.clear(); C4.bg(c);
      S.draw.text(c, C4.eqU(rx.value), W / 2, 18, {size:narrow ? 13.5 : 16, color:P.ink, math:true});
      if (!v){ out.set("Choisis deux espèces différentes.", "warn"); C4.t(c, "Choisis deux espèces différentes", W / 2, 120, {color:P.red, size:14}); return; }
      var f = C4.sub, U = C4.uni, g = U(v.g[1]), w = U(v.w[1]);
      var cards = [["m(" + g + ")", S.fmt(m.value, 2) + " g", P.acc], ["n(" + g + ")", S.fmt(v.n, 4) + " mol", P.acc], ["n(" + w + ")", S.fmt(v.nw, 4) + " mol", P.green], ["m(" + w + ")", v.gas ? S.fmt(v.mw, 2) + " g" : S.fmt(v.mw, 2) + " g", P.green]];
      var ops = ["÷ M = " + S.fmt(v.Mg, 1), "× " + v.w[0] + "/" + v.g[0], "× M = " + S.fmt(v.Mw, 1)];
      var cw = narrow ? (W - 110) / 2 : (W - 40 - 3 * 44) / 4, ch = narrow ? 64 : 84, pos = [];
      if (narrow){ pos = [[14, 44], [W - 14 - cw, 44], [14, 150], [W - 14 - cw, 150]]; }
      else { for (var i = 0; i < 4; i++) pos.push([20 + i * (cw + 44), 70]); }
      for (i = 0; i < 4; i++){
        var shown = st.step > i, act = st.step === i, p = pos[i];
        ctx.save(); ctx.shadowColor = "rgba(15,27,45,.10)"; ctx.shadowBlur = act ? 14 : 6; S.draw.rrect(c, p[0], p[1], cw, ch, 12); ctx.fillStyle = shown ? S.draw.tint(cards[i][2], .12) : "#fff"; ctx.fill(); ctx.restore();
        ctx.lineWidth = act ? 3 : 1.6; ctx.strokeStyle = shown ? cards[i][2] : (act ? P.amber : "#cfd7e1"); S.draw.rrect(c, p[0], p[1], cw, ch, 12); ctx.stroke();
        S.draw.text(c, cards[i][0], p[0] + cw / 2, p[1] + 20, {size:12.5, color:P.grey, math:true});
        S.draw.text(c, shown ? cards[i][1] : "?", p[0] + cw / 2, p[1] + ch - 24, {size:shown ? (narrow ? 14.5 : 15.5) : 22, color:shown ? cards[i][2] : "#b8c0cc", mono:shown});
        S.draw.dot(c, p[0] + 12, p[1] + 12, 8, shown ? cards[i][2] : "#cfd7e1"); S.draw.text(c, i + 1, p[0] + 12, p[1] + 12.5, {size:10.5, color:"#fff"});
      }
      for (i = 0; i < 3; i++){
        var a = pos[i], b = pos[i + 1], on = st.step > i;
        if (!narrow || i !== 1){ var x1 = a[0] + cw + 4, x2 = b[0] - 4, y = a[1] + ch / 2; if (narrow && false) y = y; S.draw.arrow(c, x1, y, x2, y, on ? P.mat : "#b8c0cc", 2.4); C4.t(c, ops[i], (x1 + x2) / 2, y - 14, {size:narrow ? 11 : 12, color:on ? P.mat : P.grey, weight:700}); }
        else { var xa = a[0] + cw / 2, ya = a[1] + ch + 4, yb = b[1] - 4; S.draw.arrow(c, xa, ya, b[0] + cw / 2, yb, on ? P.mat : "#b8c0cc", 2.4); C4.t(c, ops[i], W / 2, (ya + yb) / 2, {size:12, color:on ? P.mat : P.grey, weight:700, bg:"#fff"}); }
      }
      if (v.gas && st.step >= 4) S.draw.label(c, "ou V = n · V_m = " + S.fmt(v.nw * 24, 2) + " L (20 °C, 1 atm)", W / 2, narrow ? 236 : 160, {color:P.teal, size:12.5});
      var h = "<b>Équation :</b> " + C4.eq(rx.value) + "<br>";
      if (st.step >= 1) h += "<b>1.</b> n(" + C4.sub(v.g[1]) + ") = m / M = " + S.fmt(m.value, 2) + " / " + S.fmt(v.Mg, 1) + " = <b>" + S.fmt(v.n, 4) + " mol</b><br>";
      if (st.step >= 2) h += "<b>2.</b> Rapport des coefficients : " + v.w[0] + " pour " + v.g[0] + " → n(" + C4.sub(v.w[1]) + ") / n(" + C4.sub(v.g[1]) + ") = " + v.w[0] + " / " + v.g[0] + " = " + S.fmt(v.ratio, 3) + "<br>";
      if (st.step >= 3) h += "<b>3.</b> n(" + C4.sub(v.w[1]) + ") = " + S.fmt(v.n, 4) + " × " + S.fmt(v.ratio, 3) + " = <b>" + S.fmt(v.nw, 4) + " mol</b><br>";
      if (st.step >= 4) h += "<b>4.</b> m(" + C4.sub(v.w[1]) + ") = n · M = " + S.fmt(v.nw, 4) + " × " + S.fmt(v.Mw, 1) + " = <b>" + S.fmt(v.mw, 2) + " g</b>" + (v.gas ? " ; ou V = n · V<sub>m</sub> = " + S.fmt(v.nw, 4) + " × 24 = <b>" + S.fmt(v.nw * 24, 2) + " L</b> (20 °C, 1 atm)" : "") + "<br>";
      if (st.step >= 5) h += "<b>Réponse :</b> " + S.fmt(m.value, 2) + " g de " + C4.sub(v.g[1]) + " donnent / nécessitent " + S.fmt(v.mw, 2) + " g de " + C4.sub(v.w[1]) + ".";
      if (st.step === 0) h += "<i>Clique sur « Étape suivante ».</i>";
      out.set(h, "ok");
    });
  }
});

SFA.sim({
  id:"c4-c06-methane", ch:"c06", tag:"Graphe",
  titre:"Combustion du méthane : proportionnalité",
  resume:"Plus on brûle de méthane, plus on consomme d'air et on rejette de CO₂ et d'eau, proportionnellement.",
  but:"Fais varier la masse de CH₄ et lis les masses de produits et le volume d'air nécessaire sur les droites.",
  aRetenir:"CH₄ + 2 O₂ → CO₂ + 2 H₂O. Toutes les masses sont proportionnelles à la masse de CH₄ : m(CO₂) = 2,75 × m(CH₄) ; m(H₂O) = 2,25 × m(CH₄) ; m(O₂) = 4 × m(CH₄).",
  piege:"L'air ne contient que 21 % de dioxygène en volume : il faut environ 5 fois plus d'air que de O₂, soit 9,5 fois le volume de CH₄ à même T et p.",
  build:function(k, S){
    var c = k.canvas(280);
    var m = k.slider("Masse de CH₄ brûlé", 1, 200, 1, 16, "g");
    var ro = k.readouts(["O₂ nécessaire", "Air nécessaire", "CO₂ émis", "H₂O formée"]);
    var nt = k.note("", "");
    k.draw(function(){
      var x = m.value, n = x / 16;
      c.clear(); C4.bg(c);
      var ax = S.draw.axes(c, {x0:0, x1:200, y0:0, y1:820, xl:"m(CH₄) en g", yl:"masse en g", l:48});
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(200), ax.Y(800), "#1f4b9e", 2.5); S.draw.line(c, ax.X(0), ax.Y(0), ax.X(200), ax.Y(550), "#c0321d", 2.5); S.draw.line(c, ax.X(0), ax.Y(0), ax.X(200), ax.Y(450), "#24775a", 2.5);
      C4.tag(c, "O₂ (×4)", ax.X(120), ax.Y(480) - 10, "#1f4b9e", 12); C4.tag(c, "CO₂ (×2,75)", ax.X(140), ax.Y(385) - 12, "#c0321d", 12); C4.tag(c, "H₂O (×2,25)", ax.X(150), ax.Y(337) + 14, "#24775a", 12);
      [[4 * x, "#1f4b9e"], [2.75 * x, "#c0321d"], [2.25 * x, "#24775a"]].forEach(function(p){ S.draw.dot(c, ax.X(x), ax.Y(p[0]), 6, p[1]); });
      S.draw.line(c, ax.X(x), ax.Y(0), ax.X(x), ax.Y(4 * x), "#b8c0cc", 1, [3, 3]);
      ro.set(0, S.fmt(64 * n, 1) + " g (" + S.fmt(2 * n * 24, 1) + " L)"); ro.set(1, S.fmt(2 * n * 24 / 0.21, 0) + " L"); ro.set(2, S.fmt(44 * n, 1) + " g"); ro.set(3, S.fmt(36 * n, 1) + " g");
      nt.set("n(CH₄) = " + S.fmt(n, 3) + " mol. Volumes à 20 °C et 1 atm (V<sub>m</sub> = 24 L/mol) ; l'eau est supposée liquide ; air = 21 % de O₂ en volume.", "");
    });
  }
});

SFA.sim({
  id:"c4-c06-chaux", ch:"c06", tag:"Pureté",
  titre:"Produire de la chaux : calcaire pur ou impur",
  resume:"CaCO₃ → CaO + CO₂ : l'impureté du calcaire change la masse de chaux obtenue et le CO₂ rejeté.",
  but:"Règle la masse de pierre et sa pureté. Observe la masse de chaux vive CaO et de CO₂ libéré.",
  aRetenir:"Masse de CaCO₃ pur = pureté × masse de pierre. n(CaO) = n(CaCO₃) ; m(CaO) = n · 56. Avec 1 tonne de CaCO₃ pur : 560 kg de CaO et 440 kg de CO₂.",
  piege:"Les impuretés (supposées inertes) ne réagissent pas : elles restent dans le solide final. 1 t de pierre à 80 % ne donne pas 560 kg de CaO, mais 448 kg.",
  build:function(k, S){
    var c = k.canvas(260);
    var m = k.slider("Masse de pierre", 100, 2000, 50, 1000, "kg");
    var p = k.slider("Pureté en CaCO₃", 60, 100, 1, 85, "%");
    var obj = k.slider("Objectif : masse de CaO voulue", 50, 1000, 10, 100, "kg");
    var ro = k.readouts(["CaCO₃ pur", "CaO obtenu", "CO₂ libéré", "Pierre pour l'objectif"]);
    k.draw(function(){
      var mi = m.value, pr = p.value / 100, mp = mi * pr, imp = mi - mp, nmol = mp / 100, mcao = nmol * 56, mco2 = nmol * 44;
      c.clear(); C4.bg(c); var W = c.W, hs = 190 / Math.max(mi, 1), base = 225;
      function col(x, parts){ var y = base; parts.forEach(function(q){ var h = q[0] * hs; c.ctx.fillStyle = q[2]; c.ctx.fillRect(x, y - h, 112, h); if (h > 16) C4.label(c, q[1] + " " + S.fmt(q[0], 0) + " kg", x + 56, y - h / 2, "#fff", 12); y -= h; }); }
      col(W * 0.04, [[mp, "CaCO₃", "#1f4b9e"], [imp, "impuretés", "#8a95a3"]]);
      C4.label(c, "avant", W * 0.04 + 56, base + 16, "#2c3a4e", 12); C4.label(c, "→ chaleur →", W * 0.5, 120, "#c26a0c", 13);
      col(W * 0.56, [[mcao, "CaO", "#24775a"], [imp, "impuretés", "#8a95a3"]]);
      C4.label(c, "solide après", W * 0.56 + 56, base + 16, "#2c3a4e", 12);
      var hc = mco2 * hs; c.ctx.fillStyle = "rgba(14,116,144,.6)"; c.ctx.fillRect(W * 0.56 + 120, base - hc, 40, hc); C4.label(c, "CO₂", W * 0.56 + 140, base - hc - 10, "#0e7f96", 12);
      ro.set(0, S.fmt(mp, 0) + " kg"); ro.set(1, S.fmt(mcao, 0) + " kg"); ro.set(2, S.fmt(mco2, 0) + " kg"); ro.set(3, S.fmt(obj.value / 0.56 / pr, 0) + " kg");
    });
    k.note("Impuretés supposées inertes. 56 = M(CaO) ; 100 = M(CaCO₃) ; 44 = M(CO₂) en g/mol. « Pierre pour l'objectif » = masse de calcaire à cette pureté qu'il faut chauffer pour obtenir la masse de CaO choisie.", "");
  }
});

SFA.sim({
  id:"c4-c06-fuite", ch:"c06", tag:"Sécurité",
  titre:"Neutraliser une fuite d'acide",
  resume:"Combien de base faut-il pour neutraliser un acide répandu ? Une quantité exacte, ni trop, ni trop peu : l'indicateur te le dit.",
  but:"Explorer : verse un pourcentage de la quantité exacte et suis la couleur. Défi calcul : calcule la masse de base à verser (n(acide) → rapport des coefficients → masse) puis vérifie sur la flaque.",
  aRetenir:"On neutralise quand n(H⁺ apportés) = n(H⁺ captés). Le calcul passe par les moles : n(base) = n(acide) × (rapport des coefficients). Les masses à utiliser sont différentes selon la base choisie.",
  piege:"Avec le bicarbonate (NaHCO₃), du CO₂ se dégage et mousse : on verse lentement. Un excès de base laisse une solution basique, elle aussi dangereuse. Dans la réalité, suivre les consignes de sécurité du laboratoire.",
  build:function(k, S){
    var c = k.canvas(340), P = S.draw.palette;
    var A = [["HCl",1,"HCl",36.5],["H2SO4",2,"H₂SO₄",98],["HNO3",1,"HNO₃",63]];
    var B = [["NaOH",1,"NaOH","Na",1,0],["Ca(OH)2",2,"Ca(OH)₂","Ca",2,0],["NaHCO3",1,"NaHCO₃","Na",1,1]];
    var st = {mode:"exp", poured:null, score:0, n:0, done:false, rnd:null};
    var md = k.seg("Mode", [["exp","Explorer"],["defi","Défi calcul"]], "exp", function(v){ st.mode = v; st.poured = null; vis(); });
    var a = k.select("Acide répandu", A.map(function(x, i){ return [i, x[2]]; }), 1, function(){ st.poured = null; an.stop(); });
    var b = k.select("Base de neutralisation", B.map(function(x, i){ return [i, x[2]]; }), 0, function(){ st.poured = null; an.stop(); });
    var m = k.slider("Masse d'acide pur répandu", 0.1, 20, 0.1, 4.9, "kg", function(){ st.poured = null; an.stop(); });
    var v = k.slider("Base versée (en % de la quantité exacte)", 0, 150, 5, 50, "%");
    var kg = k.input("Ma masse de base à verser (kg)", "2", function(){}, "number");
    var bt = k.button("🪣 Verser cette masse", function(){ var x = parseFloat(String(kg.value).replace(",", ".")); if (!isFinite(x) || x < 0) return; st.poured = x; st.done = false; an.go(); }, true);
    var nw = k.button("🎯 Nouveau déversement", function(){ a.set(Math.floor(Math.random() * 3)); b.set(Math.floor(Math.random() * 3)); m.set(Math.round((1 + Math.random() * 14) * 2) / 2); st.poured = null; st.done = false; an.stop(); st.n++; });
    var ro = k.readouts(["n(acide)", "Base nécessaire", "Base versée", "État"]);
    var nt = k.note("", "");
    var an = C4.anim(k, 2.4);
    var rd = C4.rnd(6), Bu = []; for (var i = 0; i < 14; i++) Bu.push([rd(), rd()]);
    function vis(){ v.el.parentNode.style.display = st.mode === "exp" ? "" : "none"; kg.el.parentNode.style.display = st.mode === "defi" ? "" : "none"; bt.style.display = nw.style.display = st.mode === "defi" ? "" : "none"; }
    vis();
    function model(){
      var ac = A[+a.value], ba = B[+b.value], n = ac[1], mm = ba[1], g = C4.gcd(n, mm), xa = mm / g, yb = n / g;
      var nA = m.value * 1000 / ac[3], nB = nA * yb / xa, mB = nB * C4.M(ba[0]) / 1000;
      var salt = C4.salt(C4.CAT.filter(function(i){ return i.s === ba[3] && i.q === ba[4]; })[0], C4.AN.filter(function(i){ return i.s === (ac[0] === "HCl" ? "Cl" : ac[0] === "H2SO4" ? "SO4" : "NO3"); })[0]).f;
      return {ac:ac, ba:ba, n:n, xa:xa, yb:yb, nA:nA, nB:nB, mB:mB, salt:salt};
    }
    k.draw(function(){
      var d = model(), W = c.W, ctx = c.ctx, defi = st.mode === "defi";
      var target = defi ? (st.poured == null ? 0 : st.poured) : d.mB * v.value / 100;
      var f = d.mB > 0 ? target / d.mB : 0, shown = f * (defi ? C4.ease(an.p) : 1);
      var state = shown < 0.98 ? 0 : shown > 1.02 ? 2 : 1;
      C4.bg(c, 250);
      var eqs = (d.xa > 1 ? d.xa + " " : "") + C4.uni(d.ac[0]) + " + " + (d.yb > 1 ? d.yb + " " : "") + C4.uni(d.ba[0]) + " → " + C4.uni(d.salt) + " + " + d.xa * d.n + " H₂O" + (d.ba[5] ? " + " + d.xa * d.n + " CO₂" : "");
      S.draw.text(c, eqs, W / 2, 18, {size:W < 480 ? 13.5 : 16, color:P.ink, math:true});
      /* indicateur universel */
      var ix = W * 0.1, iw = W * 0.8, iy = 52, gr = ctx.createLinearGradient(ix, 0, ix + iw, 0);
      [[0, "#d8362a"], [.22, "#ee8a2c"], [.38, "#f2cf3a"], [.5, "#4cae5a"], [.68, "#2f86c9"], [.85, "#5b4bc4"], [1, "#7b2f9e"]].forEach(function(q){ gr.addColorStop(q[0], q[1]); });
      ctx.fillStyle = gr; S.draw.rrect(c, ix, iy, iw, 14, 7); ctx.fill();
      var pos = shown <= 1 ? .06 + .44 * Math.pow(shown, 1.6) : .5 + Math.min(.44, (shown - 1) * 1.1);
      var mx = ix + iw * pos; ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(mx, iy + 16); ctx.lineTo(mx - 6, iy + 26); ctx.lineTo(mx + 6, iy + 26); ctx.closePath(); ctx.fill();
      C4.t(c, "acide", ix + 22, iy - 10, {size:11.5, color:P.red}); C4.t(c, "neutre", ix + iw * .5, iy - 10, {size:11.5, color:P.green}); C4.t(c, "basique", ix + iw - 24, iy - 10, {size:11.5, color:P.violet});
      var col = state === 0 ? C4.mix("#d8362a", "#4cae5a", Math.min(1, shown * .95)) : state === 1 ? "#4cae5a" : C4.mix("#2f86c9", "#7b2f9e", Math.min(1, (shown - 1) * 1.4));
      /* flaque */
      var rx = Math.min(W * 0.3, 54 + 62 * Math.sqrt(d.nA / 220)), fx = W * 0.3, fy = 234;
      ctx.save(); ctx.beginPath(); ctx.ellipse(fx, fy, rx, 20, 0, 0, 7); ctx.fillStyle = S.draw.tint(col.indexOf("#") === 0 ? col : "#4cae5a", .55); if (col.indexOf("rgb") === 0) ctx.fillStyle = col.replace("rgb", "rgba").replace(")", ",.6)"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.stroke(); ctx.restore();
      if (d.ba[5] && shown > 0 && shown < 1.3) for (var i = 0; i < 12; i++) S.draw.dot(c, fx - rx * .7 + Bu[i][0] * rx * 1.4, fy - 6 - ((Date.now() / 30 + i * 21) % 30) - Bu[i][1] * 8, 3 + Bu[i][1] * 2, "rgba(255,255,255,.9)");
      S.draw.label(c, state === 0 ? "milieu acide" : state === 1 ? "neutre" : "milieu basique", fx, fy + 32, {color:state === 1 ? P.green : state === 0 ? P.red : P.violet, size:13});
      /* panneau danger */
      ctx.fillStyle = P.amber; ctx.beginPath(); ctx.moveTo(fx, 112); ctx.lineTo(fx - 22, 150); ctx.lineTo(fx + 22, 150); ctx.closePath(); ctx.fill(); S.draw.text(c, "!", fx, 138, {size:18, color:"#fff"});
      /* seau de base qui verse */
      var tilt = (defi ? C4.ph(an.p, 0, .25) * (1 - C4.ph(an.p, .8, 1)) : (v.value > 0 ? 1 : 0)) * 0.62, bx = W * 0.74, by = 138;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(-tilt);
      ctx.beginPath(); ctx.moveTo(-34, -30); ctx.lineTo(34, -30); ctx.lineTo(26, 40); ctx.lineTo(-26, 40); ctx.closePath(); ctx.fillStyle = "#e6ecf3"; ctx.fill(); ctx.strokeStyle = "#6b7889"; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.fillStyle = P.acc; ctx.fillRect(-30, -10, 58, 14); ctx.restore();
      S.draw.text(c, C4.uni(d.ba[0]), bx, by + 5, {size:12.5, color:"#fff"});
      if (tilt > .1){ var th = -tilt, p0 = [bx + (-34) * Math.cos(th) - (-30) * Math.sin(th), by + (-34) * Math.sin(th) + (-30) * Math.cos(th)], p2 = [fx + rx * .45, fy - 4], p1 = [p0[0] - 30, p0[1] + 10]; ctx.save(); ctx.strokeStyle = S.draw.tint(P.acc, .7); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); for (var t = 0; t <= 1; t += .05){ var q = C4.bez(p0, p1, p2, t); t ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.restore(); }
      /* barres de moles */
      var nHb = d.nA * d.n, nOH = shown * nHb;
      C4.t(c, "H⁺ à neutraliser", 12, 290, {align:"left", size:11.5, color:P.red}); C4.t(c, "OH⁻ / base versée", 12, 310, {align:"left", size:11.5, color:P.acc});
      ctx.fillStyle = "#e4e9f0"; ctx.fillRect(W * .46, 285, W * .5, 10); ctx.fillRect(W * .46, 305, W * .5, 10);
      ctx.fillStyle = P.red; ctx.fillRect(W * .46, 285, W * .5 * Math.max(0, 1 - Math.min(1, shown)), 10); ctx.fillStyle = state === 2 ? P.violet : P.acc; ctx.fillRect(W * .46, 305, W * .5 * Math.min(1, shown), 10);
      var mDone = d.mB * shown;
      ro.set(0, S.fmt(d.nA, 1) + " mol"); ro.set(1, defi && !st.done && !(st.poured != null && an.p >= 1) ? "à calculer" : S.fmt(d.mB, 2) + " kg"); ro.set(2, S.fmt(mDone, 2) + " kg"); ro.set(3, ["acide restant", "neutralisé", "base en excès"][state]);
      if (defi){
        if (st.poured == null) nt.set("🎯 Défi : " + S.fmt(m.value, 1) + " kg de " + C4.sub(d.ac[0]) + " pur sont répandus. Calcule n(acide), le rapport " + d.yb + " base pour " + d.xa + " acide, puis la masse de " + C4.sub(d.ba[0]) + " (M = " + S.fmt(C4.M(d.ba[0]), 1) + " g/mol) à verser. Entre-la, puis verse.", "");
        else if (an.p < 1) nt.set("Versement en cours…", "");
        else { var err = Math.abs(f - 1); if (!st.done){ st.done = true; if (err <= 0.03) st.score++; } nt.set(err <= 0.03 ? "✅ Neutralisé à 3 % près ! Il fallait " + S.fmt(d.mB, 2) + " kg. Réussites : " + st.score + " / " + Math.max(st.n, 1) + "." : f < 1 ? "Il reste de l'acide (" + S.fmt(d.nA * (1 - f), 1) + " mol de H⁺ équivalents). Il fallait " + S.fmt(d.mB, 2) + " kg : revois ton calcul." : "Excès de base. Il fallait " + S.fmt(d.mB, 2) + " kg. Vérifie la conversion moles → masse.", err <= 0.03 ? "ok" : "warn"); }
      } else nt.set(state === 1 ? "✅ Neutralisation exacte : tout l'acide a réagi, il ne reste ni acide ni base." : state === 0 ? "Il reste " + S.fmt(d.nA * (1 - f), 1) + " mol d'acide non neutralisé." : "Excès de base : " + S.fmt(d.nB * (f - 1), 1) + " mol de base en trop. Mieux vaut doser que verser trop.", state === 1 ? "ok" : "warn");
    });
    k.loop(function(){ if (!B_anim()) return; k.redraw(); }).play();
    function B_anim(){ return b.value === "2"; }
  }
});
