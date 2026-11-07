/* Chimie 4e · chapitre 7 · Réactif limitant, excès, rendement */
SFA.sim({
  id:"c4-c07-burger", ch:"c07", tag:"Classique",
  titre:"Le burger chimique",
  resume:"Une recette (2 pains + 1 steak + 2 tranches de fromage) : qui manque en premier, que reste-t-il ?",
  but:"Règle le nombre d'ingrédients (curseurs, ou touche les ingrédients dessinés). Le plus petit nombre de « burgers permis » limite tout. Défi : ne gaspille rien !",
  aRetenir:"Le réactif limitant est celui qui permet de faire le moins de « portions » : on divise chaque quantité par son coefficient. Les autres restent en excès.",
  piege:"Le réactif limitant n'est pas forcément celui dont on a le moins : 12 pains et 7 steaks limitent à 6 burgers à cause des pains (12 / 2 = 6), pas des steaks.",
  build:function(k, S){
    var c = k.canvas(370), P = S.draw.palette;
    var p = k.slider("Pains", 0, 30, 1, 12, ""), s = k.slider("Steaks", 0, 20, 1, 7, ""), f = k.slider("Tranches de fromage", 0, 30, 1, 20, "");
    var ro = k.readouts(["Burgers possibles", "Limitant", "Reste"]);
    var nt = k.note("", "ok");
    var st = {defi:false, won:false, score:0, hits:[]};
    var names = ["pains", "steaks", "fromage"], need = [2, 1, 2], sl = [p, s, f], cols = ["#d9a05b", "#7a4a2b", "#f4c542"];
    k.button("🎯 Défi : zéro gaspillage", function(){
      var B = 3 + Math.floor(Math.random() * 3);
      p.set(2 * B + 2 * (1 + Math.floor(Math.random() * 4))); s.set(B + 1 + Math.floor(Math.random() * 6)); f.set(2 * B + 2 * (1 + Math.floor(Math.random() * 4)));
      st.defi = true; st.won = false;
    }, true);
    k.button("Mode libre", function(){ st.defi = false; });
    c.pointer(function(type, pt){
      if (type !== "down") return;
      st.hits.forEach(function(h){ if (pt.x >= h.x - 1 && pt.x <= h.x + h.w + 1 && pt.y >= h.y - 1 && pt.y <= h.y + h.h + 1) sl[h.r].set(h.r === 1 && h.i + 1 === s.value ? h.i : (h.i + 1 === sl[h.r].value ? h.i : h.i + 1)); });
      k.redraw();
    });
    function icon(kind, x, y, u, a){
      var ctx = c.ctx; ctx.save(); ctx.globalAlpha = a;
      if (kind === 0){ ctx.fillStyle = cols[0]; ctx.beginPath(); ctx.ellipse(x + u / 2, y + u * .6, u * .5, u * .4, 0, Math.PI, 0); ctx.lineTo(x + u, y + u * .75); ctx.lineTo(x, y + u * .75); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#b9803a"; ctx.fillRect(x, y + u * .72, u, u * .22); }
      else if (kind === 1){ ctx.fillStyle = cols[1]; S.draw.rrect(c, x, y + u * .2, u, u * .6, u * .28); ctx.fill(); }
      else { ctx.fillStyle = cols[2]; ctx.beginPath(); ctx.moveTo(x, y + u * .22); ctx.lineTo(x + u, y + u * .22); ctx.lineTo(x + u * .88, y + u * .82); ctx.lineTo(x + u * .12, y + u * .82); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(160,120,0,.5)"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
    }
    function burger(x, y, w){   /* x,y = coin haut-gauche de la pile */
      var ctx = c.ctx, h1 = w * .42, y0 = y;
      ctx.fillStyle = "#d9a05b"; ctx.beginPath(); ctx.ellipse(x + w / 2, y0 + h1, w / 2, h1, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff3c4"; [[.28, .45], [.5, .3], [.7, .5]].forEach(function(q){ ctx.fillRect(x + w * q[0], y0 + h1 * q[1], 2, 1.6); });
      var yy = y0 + h1;
      ctx.fillStyle = "#f4c542"; ctx.fillRect(x - 1, yy, w + 2, w * .1); yy += w * .1;
      ctx.fillStyle = "#7a4a2b"; S.draw.rrect(c, x - 1, yy, w + 2, w * .2, w * .1); ctx.fill(); yy += w * .2;
      ctx.fillStyle = "#f4c542"; ctx.fillRect(x - 1, yy, w + 2, w * .1); yy += w * .1;
      ctx.fillStyle = "#c98a3e"; S.draw.rrect(c, x, yy, w, w * .2, w * .08); ctx.fill();
    }
    k.draw(function(){
      var W = c.W, ctx = c.ctx, have = [p.value, s.value, f.value], q = [Math.floor(have[0] / 2), have[1], Math.floor(have[2] / 2)], B = Math.min.apply(0, q);
      C4.bg(c);
      var u = Math.min(19, (W - 24) / 16), per = Math.floor((W - 24) / (u + 3)), y = 8; st.hits = [];
      var lim = []; q.forEach(function(v, i){ if (v === B) lim.push(names[i]); });
      for (var r = 0; r < 3; r++){
        var isLim = q[r] === B && have[r] >= 0;
        S.draw.text(c, names[r] + "  (" + need[r] + " par burger)", 12, y + 8, {size:12.5, color:P.ink, align:"left"});
        S.draw.text(c, S.fmt(have[r] / need[r], 1) + " burger" + (have[r] / need[r] >= 2 ? "s" : ""), W - 12, y + 8, {size:12.5, color:isLim ? P.red : P.grey, align:"right"});
        if (isLim) S.draw.label(c, "⛔ limitant", W - 12 - 82, y + 8, {color:P.red, size:11.5, align:"right"});
        y += 20;
        for (var i = 0; i < have[r]; i++){
          var col = i % per, row = Math.floor(i / per), x = 12 + col * (u + 3), yy = y + row * (u + 3), used = i < B * need[r];
          icon(r, x, yy, u, used ? 1 : .32);
          if (!used){ ctx.save(); ctx.strokeStyle = "rgba(120,130,145,.55)"; ctx.setLineDash([2, 2]); ctx.strokeRect(x - .5, yy + u * .12, u + 1, u * .76); ctx.restore(); }
        }
        var rows = Math.max(1, Math.ceil(Math.max(have[r], 1) / per)); var tgt = Math.max(30, rows * (u + 3));
        for (i = 0; i < Math.max(1, Math.ceil(sl[r].el.max / per)) * per && i < +sl[r].el.max; i++) st.hits.push({r:r, i:i, x:12 + (i % per) * (u + 3), y:y + Math.floor(i / per) * (u + 3), w:u, h:u});
        y += Math.ceil(+sl[r].el.max / per) * (u + 3) + 6;
      }
      /* burgers préparés */
      var by = Math.max(y + 4, 214);
      ctx.fillStyle = "rgba(255,255,255,.6)"; S.draw.rrect(c, 8, by - 8, W - 16, 370 - by - 4, 10); ctx.fill();
      S.draw.text(c, "Burgers préparés : " + B, 14, by + 8, {size:14, color:P.acc, align:"left"});
      var bu = Math.min(30, (W - 40) / 10.5);
      for (i = 0; i < Math.min(B, 10); i++) burger(14 + i * (bu + 4), by + 30, bu);
      if (B > 10) S.draw.text(c, "+" + (B - 10), W - 22, by + 48, {size:14, color:P.acc});
      S.draw.text(c, "recette : 2 P + 1 S + 2 F → 1 B  ·  en grisé : les restes", 14, 354, {size:12, color:P.grey, align:"left", weight:600});
      var rest = [have[0] - 2 * B, have[1] - B, have[2] - 2 * B];
      var zero = rest[0] === 0 && rest[1] === 0 && rest[2] === 0 && B >= 2;
      if (st.defi && zero && !st.won){ st.won = true; st.score++; }
      ro.set(0, B); ro.set(1, lim.join(" et ")); ro.set(2, rest[0] + " p. · " + rest[1] + " s. · " + rest[2] + " f.");
      if (st.defi) nt.set(zero ? "✅ Zéro gaspillage : " + B + " burgers, tout est utilisé ! (réussis : " + st.score + ")" : "🎯 Défi : change les quantités (sans toucher à ce qui est déjà parfait) pour que tous les ingrédients soient utilisés. Reste : " + rest[0] + " pain(s), " + rest[1] + " steak(s), " + rest[2] + " fromage(s). Pense : pains = 2 × burgers, steaks = burgers, fromage = 2 × burgers.", zero ? "ok" : "");
      else nt.set(B === 0 ? "Impossible de faire un burger : il manque au moins un ingrédient." : "Il manque d'abord : " + lim.join(" / ") + ". Les autres ingrédients sont « en excès ».", B === 0 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"c4-c07-melange", ch:"c07", tag:"Original",
  titre:"Mélange de réactifs : qui est limitant ?",
  resume:"Deux masses de réactifs, une équation : compare n / coefficient pour trouver le limitant et ce qui reste.",
  but:"Choisis une réaction et deux masses. Regarde les barres « n / coefficient » : la plus petite désigne le réactif limitant.",
  aRetenir:"Pour chaque réactif : n = m / M puis n / coefficient. Le plus petit rapport désigne le limitant ; ξ_max est ce rapport. Excès restant : n − coefficient × ξ_max.",
  piege:"Avec 10 g de magnésium et 8 g de dioxygène (2 Mg + O₂), c'est le magnésium le limitant, alors qu'il y a plus de grammes de Mg que de O₂ !",
  build:function(k, S){
    var c = k.canvas(300);
    var keys = ["mgo","eau","nh3","ch4","fe","al","fes","zn","mghcl","acid"];
    var rx = k.select("Réaction", keys.map(function(x){ return [x, C4.REAC[x].nom]; }), "mgo");
    var a = k.slider("Masse du réactif 1", 0.5, 100, 0.5, 10, "g"), b = k.slider("Masse du réactif 2", 0.5, 100, 0.5, 8, "g");
    var ro = k.readouts(["Limitant", "ξ max", "Produit principal", "Excès qui reste"]);
    var nt = k.note("", "");
    k.draw(function(){
      var e = C4.REAC[rx.value], m = [a.value, b.value], M = e.r.map(function(t){ return C4.M(t[1]); }), n = [m[0] / M[0], m[1] / M[1]], rt = [n[0] / e.r[0][0], n[1] / e.r[1][0]];
      var xm = Math.min(rt[0], rt[1]), li = rt[0] <= rt[1] ? 0 : 1, eq = Math.abs(rt[0] - rt[1]) < 1e-9, ex = 1 - li;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, mx = Math.max(rt[0], rt[1]);
      C4.label(c, C4.eqU(rx.value), W / 2, 14, "#2c3a4e", 13);
      C4.label(c, "n / coefficient (mol)", 8, 40, "#5f6b7a", 12, "left");
      e.r.forEach(function(t, i){
        var y = 56 + i * 40, w = (W - 130) * rt[i] / mx; ctx.fillStyle = i === li ? "#c0321d" : "#8a95a3"; ctx.fillRect(100, y, Math.max(2, w), 24);
        C4.label(c, C4.uni(t[1]) + " (" + S.fmt(m[i], 1) + " g)", 8, y + 12, "#0f1b2d", 12, "left");
        C4.tag(c, S.fmt(n[i], 3) + " / " + t[0] + " = " + S.fmt(rt[i], 3), 104, y + 12, "#fff", 12, "left");
      });
      /* avant / après en grammes */
      var sp = e.r.map(function(t, i){ return {f:t[1], m0:m[i], m1:(n[i] - t[0] * xm) * M[i]}; }).concat(e.p.map(function(t){ return {f:t[1], m0:0, m1:t[0] * xm * C4.M(t[1])}; }));
      var mxm = Math.max.apply(0, sp.map(function(s){ return Math.max(s.m0, s.m1); })) || 1, cw = (W - 20) / sp.length, base = 262, hs = 100 / mxm;
      sp.forEach(function(s, i){ var x0 = 10 + i * cw;
        ctx.fillStyle = "#dfe4ea"; ctx.fillRect(x0 + cw * 0.1, base - s.m0 * hs, cw * 0.36, s.m0 * hs);
        ctx.fillStyle = i < e.r.length ? "#c0321d" : "#24775a"; ctx.fillRect(x0 + cw * 0.5, base - s.m1 * hs, cw * 0.36, s.m1 * hs);
        C4.label(c, S.fmt(s.m1, 1), x0 + cw * 0.68, base - s.m1 * hs - 8, "#0f1b2d", 11); C4.label(c, C4.uni(s.f), x0 + cw / 2, base + 14, "#0f1b2d", 12); });
      C4.label(c, "masses (g) : gris = avant, couleur = après", W / 2, 290, "#5f6b7a", 12);
      var pr = e.p[0], mp = pr[0] * xm * C4.M(pr[1]), left = (n[ex] - e.r[ex][0] * xm) * M[ex];
      ro.set(0, eq ? "aucun (proportions exactes)" : C4.sub(e.r[li][1])); ro.set(1, S.fmt(xm, 3) + " mol"); ro.set(2, C4.sub(pr[1]) + " : " + S.fmt(mp, 2) + " g"); ro.set(3, eq ? "0 g" : C4.sub(e.r[ex][1]) + " : " + S.fmt(left, 2) + " g");
      nt.set(eq ? "Les réactifs sont dans les proportions exactes de l'équation : ils sont consommés ensemble." : "Limitant : " + C4.sub(e.r[li][1]) + ". Comparer les grammes ne suffit pas : " + (li === (m[0] <= m[1] ? 0 : 1) ? "ici, le réactif de plus petite masse est aussi le limitant, mais ce n'est pas une règle." : "ici, le limitant n'est pas celui qu'on a en plus petite masse."), "");
    });
  }
});

SFA.sim({
  id:"c4-c07-rendement", ch:"c07", tag:"Rendement",
  titre:"Rendement d'une synthèse d'aspirine",
  resume:"Acide salicylique + anhydride acétique → aspirine + acide acétique : compare ce que tu pèses avec le maximum possible.",
  but:"Choisis les quantités de réactifs, détermine le limitant, puis règle la masse d'aspirine réellement obtenue.",
  aRetenir:"Rendement = masse (ou quantité) obtenue / masse (ou quantité) théorique × 100. La quantité théorique se calcule avec le réactif limitant, comme si la réaction était totale.",
  piege:"Un rendement supérieur à 100 % est impossible : il signale un produit encore humide ou impur. Et un rendement de 70 % ne veut pas dire que 30 % de la masse a disparu : les atomes sont ailleurs (pertes, produits secondaires).",
  build:function(k, S){
    var c = k.canvas(260);
    var ms = k.slider("Acide salicylique C₇H₆O₃", 1, 5, 0.1, 2, "g");
    var va = k.slider("Anhydride acétique C₄H₆O₃", 0.5, 8, 0.5, 5, "mL");
    var mo = k.slider("Aspirine réellement obtenue", 0, 5, 0.05, 1.85, "g");
    var ro = k.readouts(["Limitant", "Théorique", "Rendement"]);
    var nt = k.note("", "");
    k.draw(function(){
      var ns = ms.value / 138, na = va.value * 1.08 / 102, li = ns <= na ? "acide salicylique" : "anhydride acétique", xm = Math.min(ns, na), th = xm * 180, rd = mo.value / th * 100;
      c.clear(); C4.bg(c); var W = c.W, sc = 200 / Math.max(th, mo.value, 0.01) * 0.85;
      C4.rr(c.ctx, 40, 235 - th * sc, 90, th * sc, 4); c.ctx.fillStyle = "#dfe4ea"; c.ctx.fill(); c.ctx.strokeStyle = "#8a95a3"; c.ctx.stroke();
      C4.rr(c.ctx, 160, 235 - mo.value * sc, 90, Math.max(2, mo.value * sc), 4); c.ctx.fillStyle = rd > 100.5 ? "#c0321d" : "#24775a"; c.ctx.fill();
      C4.label(c, "théorique", 85, 250, "#2c3a4e", 12); C4.label(c, S.fmt(th, 2) + " g", 85, 230 - th * sc, "#2c3a4e", 13);
      C4.label(c, "obtenu", 205, 250, "#2c3a4e", 12); C4.label(c, S.fmt(mo.value, 2) + " g", 205, 230 - mo.value * sc, "#2c3a4e", 13);
      C4.label(c, S.fmt(rd, 0) + " %", W * 0.78, 110, rd > 100.5 ? "#c0321d" : "#1f4b9e", 34);
      C4.label(c, "n(acide sal.) = " + S.fmt(ns * 1000, 1) + " mmol", W * 0.55, 160, "#5f6b7a", 12, "left"); C4.label(c, "n(anhydride) = " + S.fmt(na * 1000, 1) + " mmol", W * 0.55, 180, "#5f6b7a", 12, "left");
      ro.set(0, li); ro.set(1, S.fmt(th, 2) + " g"); ro.set(2, S.fmt(rd, 1) + " %");
      nt.set(rd > 100.5 ? "Rendement > 100 % : impossible. Le produit est sans doute humide ou impur." : rd > 85 ? "Très bon rendement pour une synthèse au laboratoire." : "Les pertes viennent des transferts, de la recristallisation, des produits secondaires.", rd > 100.5 ? "warn" : "");
    });
    k.note("Données : M(acide salicylique) = 138 ; M(anhydride acétique) = 102 ; M(aspirine) = 180 g/mol ; masse volumique de l'anhydride 1,08 g/mL ; équation 1 : 1 → 1.", "");
  }
});

SFA.sim({
  id:"c4-c07-cloche", ch:"c07", tag:"Animation",
  titre:"La flamme sous la cloche",
  resume:"Un brûleur à méthane dans un bocal fermé : la flamme s'éteint quand un réactif est épuisé.",
  but:"Choisis le volume du bocal et la quantité de méthane. Lance la combustion et observe lequel des deux réactifs disparaît en premier.",
  aRetenir:"Quand la réaction cesse, c'est qu'un réactif est épuisé : le limitant. Ici, soit le méthane, soit le dioxygène de l'air du bocal (21 % du volume).",
  piege:"Modèle idéalisé : dans un vrai bocal, la flamme s'éteint dès que la teneur en O₂ tombe vers 15 %, bien avant l'épuisement total. Ce n'est pas un réactif « épuisé » à 100 %, mais l'ordre de grandeur du raisonnement reste valable.",
  build:function(k, S){
    var c = k.canvas(280);
    var V = k.slider("Volume d'air du bocal", 0.5, 5, 0.5, 1, "L");
    var F = k.slider("Méthane introduit (volume gazeux à 20 °C)", 20, 400, 10, 150, "mL");
    var ro = k.readouts(["n(O₂) initial", "n(CH₄) initial", "Limitant", "CO₂ formé"]);
    var nt = k.note("", "");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 4); if (st.p >= 1) lp.pause(); k.redraw(); });
    [V.el, F.el].forEach(function(e){ e.addEventListener("input", function(){ st.p = 1; }); });
    k.button("▶ Allumer", function(){ st.p = 0; lp.play(); }, true); k.button("↺ Remettre", function(){ lp.pause(); st.p = 0; });
    k.draw(function(){
      var nO = 0.21 * V.value / 24, nC = F.value / 1000 / 24, xm = Math.min(nC, nO / 2), li = nC < nO / 2 ? "CH₄" : nC > nO / 2 ? "O₂" : "aucun", x = xm * st.p;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, cx = W * 0.25;
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.fillStyle = "rgba(200,225,240,.3)"; C4.rr(ctx, cx - 62, 30, 124, 190, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(cx - 5, 190, 10, 30);
      var alive = st.p < 1 && st.p > 0, fl = alive ? 38 : (st.p === 0 ? 20 : 0), jit = alive ? Math.sin(Date.now() / 90) * 3 : 0;
      if (fl > 0){ ctx.fillStyle = "#f4a640"; ctx.beginPath(); ctx.moveTo(cx - 8, 190); ctx.quadraticCurveTo(cx + jit, 190 - fl * 1.6, cx + 8, 190); ctx.fill(); }
      C4.label(c, st.p === 0 ? "prête" : alive ? "flamme" : "flamme éteinte", cx, 240, alive ? "#c26a0c" : "#5f6b7a", 13);
      var bx = W * 0.5, bw = (W - bx - 20) / 3, base = 235, hs = 160 / Math.max(nO, nC * 2, 1e-9) / 1.1;
      var vals = [[nO - 2 * x, "O₂", "#1f4b9e", nO], [nC - x, "CH₄", "#c0321d", nC], [x, "CO₂", "#24775a", 0]];
      vals.forEach(function(v, i){ var xx = bx + i * bw; ctx.fillStyle = "#e6eaf0"; ctx.fillRect(xx + 4, base - v[3] * hs, bw - 14, v[3] * hs); ctx.fillStyle = v[2]; ctx.fillRect(xx + 4, base - Math.max(0, v[0]) * hs, bw - 14, Math.max(0, v[0]) * hs); C4.label(c, v[1], xx + bw / 2 - 3, base + 14, "#0f1b2d", 12); C4.label(c, S.fmt(Math.max(0, v[0]) * 1000, 1), xx + bw / 2 - 3, base - Math.max(0, v[0]) * hs - 9, "#0f1b2d", 11); });
      C4.label(c, "mmol", bx - 2, 50, "#5f6b7a", 12, "left");
      ro.set(0, S.fmt(nO * 1000, 2) + " mmol"); ro.set(1, S.fmt(nC * 1000, 2) + " mmol"); ro.set(2, li); ro.set(3, S.fmt(xm * 1000, 2) + " mmol (" + S.fmt(xm * 24000, 0) + " mL)");
      nt.set(li === "O₂" ? "Il y a plus de méthane que le dioxygène n'en peut brûler : O₂ est limitant, il reste " + S.fmt((nC - xm) * 24000, 0) + " mL de CH₄." : li === "CH₄" ? "Le méthane est limitant : la flamme s'éteint faute de combustible, il reste " + S.fmt((nO - 2 * xm) * 1000, 2) + " mmol de O₂." : "Proportions exactes.", "");
    });
  }
});
