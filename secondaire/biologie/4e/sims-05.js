/* Biologie 4e · chapitre 5 · Photosynthèse : phases et facteurs */
SFA.sim({
  id:"b4-c05-bilan", ch:"c05", tag:"Marquage isotopique · original",
  titre:"Bilan de la photosynthèse et origine de l'oxygène",
  resume:"Compte les atomes et suis le marquage ¹⁸O : le dioxygène vient de l'eau, pas du CO₂.",
  but:"Choisis la quantité de glucose formée et le composé marqué (¹⁸O) ; l'équation détaillée est toujours affichée. Les barres rouges montrent où va l'oxygène marqué.",
  aRetenir:"6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ (bilan net, lumière + chlorophylle). Les atomes se conservent : 18 O de chaque côté. Avec de l'eau marquée (H₂¹⁸O), le marquage se retrouve dans O₂ : le dioxygène provient de la photolyse de l'eau. Avec du CO₂ marqué, il se retrouve dans le glucose et dans l'eau produite, pas dans O₂.",
  piege:"On lit souvent que l'O₂ vient du CO₂ : c'est faux. L'écriture détaillée 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O montre que 12 molécules d'eau sont d'abord scindées, et que 6 sont reformées.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.92});
    var n = k.slider("Glucose formé", 0.5, 5, 0.5, 1, "mol");
    var lab = k.seg("Marquage ¹⁸O", [["0","Aucun"],["w","Sur l'eau"],["c","Sur le CO₂"]], "w");
    var ro = k.readouts(["Masse des réactifs", "Masse des produits", "O₂ marqué", "Atomes d'oxygène"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, m = n.value, L = lab.value;
      var inp = [
        {s:"6 CO₂", q:6 * m, o:12 * m, m:44, lab:L === "c" ? 12 * m : 0},
        {s:"12 H₂O", q:12 * m, o:12 * m, m:18, lab:L === "w" ? 12 * m : 0}
      ];
      var out = [
        {s:"C₆H₁₂O₆", q:m, o:6 * m, m:180, lab:L === "c" ? 6 * m : 0},
        {s:"6 O₂", q:6 * m, o:12 * m, m:32, lab:L === "w" ? 12 * m : 0},
        {s:"6 H₂O (reformées)", q:6 * m, o:6 * m, m:18, lab:L === "c" ? 6 * m : 0}
      ];
      var mr = 0, mp = 0;
      inp.forEach(function(r){ mr += r.q * r.m; }); out.forEach(function(r){ mp += r.q * r.m; });
      var bx = 16, bw = W - 32, rh = (H - 50) / 5.4, y = 22;
      function bar(r, yy){
        var wTot = bw * r.o / (12 * m);
        B4.txt(c, r.s + " : " + S.fmt(r.q, 1) + " mol · O : " + S.fmt(r.o, 1) + (r.lab ? " dont " + S.fmt(r.lab, 1) + " marqués" : ""), bx, yy, B4.pal.ink, 12, "left");
        ctx.fillStyle = "#cbd5e1"; ctx.fillRect(bx, yy + 10, wTot, 14);
        ctx.fillStyle = B4.pal.red; ctx.fillRect(bx, yy + 10, r.o ? wTot * r.lab / r.o : 0, 14);
      }
      B4.txt(c, "ENTRÉES (barre = atomes d'oxygène, rouge = ¹⁸O)", bx, 10, B4.pal.acc, 12, "left");
      inp.forEach(function(r, j){ bar(r, y + 8 + j * rh); });
      var y2 = y + 8 + 2 * rh + 6;
      B4.txt(c, "SORTIES", bx, y2 - 4, B4.pal.green, 12, "left");
      out.forEach(function(r, j){ bar(r, y2 + 14 + j * rh); });
      ro.set(0, S.fmt(mr, 0) + " g"); ro.set(1, S.fmt(mp, 0) + " g"); ro.set(2, L === "0" ? "—" : S.fmt(out[1].lab / out[1].o * 100, 0) + " %"); ro.set(3, S.fmt(24 * m, 0) + " mol = " + S.fmt(24 * m, 0) + " mol");
      var msg;
      if (L === "0") msg = "Atomes conservés (" + S.fmt(24 * m, 0) + " mol d'O de chaque côté) et masse conservée (" + S.fmt(mr, 0) + " g). En simplifiant 6 H₂O de chaque côté, on retrouve le bilan net 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂. Choisis un marquage pour suivre l'oxygène.";
      else if (L === "w") msg = "Eau marquée : 100 % de l'oxygène de O₂ est marqué ; le glucose et l'eau reformée n'en contiennent pas. Le dioxygène provient de la photolyse de l'eau.";
      else msg = "CO₂ marqué : le marquage va dans le glucose (6 O) et dans l'eau reformée (6 O) ; O₂ n'est pas marqué. Le dioxygène ne vient pas du CO₂.";
      nt.set(msg, L === "0" ? "" : "ok");
    });
  }
});

SFA.sim({
  id:"b4-c05-spectre", ch:"c05", tag:"Classique · Engelmann",
  titre:"Spectre d'absorption et expérience d'Engelmann",
  resume:"Quelles couleurs absorbent les pigments ? Les bactéries d'Engelmann se rassemblent là où l'O₂ est produit.",
  but:"Active ou retire des pigments et déplace la longueur d'onde : lis l'absorption et regarde où se concentrent les bactéries sous le spectre.",
  aRetenir:"Les chlorophylles absorbent surtout le bleu-violet (≈ 430-450 nm) et le rouge (≈ 640-680 nm) ; les caroténoïdes complètent dans le bleu-vert. Le vert est peu absorbé, il est réfléchi : c'est pourquoi les feuilles sont vertes. Le spectre d'action de la photosynthèse ressemble au spectre d'absorption.",
  piege:"Les courbes sont schématiques (valeurs arrondies d'après l'allure connue des pigments). Le vert est un peu absorbé quand même : une feuille ne réfléchit pas 100 % du vert.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var lam = k.slider("Longueur d'onde λ", 400, 700, 5, 450, "nm");
    var pa = k.toggle("Chlorophylle a", true), pb = k.toggle("Chlorophylle b", true), pc = k.toggle("Caroténoïdes", true);
    var ro = k.readouts(["Couleur", "Absorbé à λ", "Pigment dominant", "Photosynthèse relative"]);
    var nt = k.note("", "");
    function g(x, mu, sg, a){ return a * Math.exp(-Math.pow((x - mu) / sg, 2) / 2); }
    function A(x){ return {a:g(x, 430, 12, 0.95) + g(x, 662, 13, 0.8) + g(x, 410, 10, 0.4), b:g(x, 453, 13, 0.75) + g(x, 642, 12, 0.6), c:g(x, 450, 18, 0.55) + g(x, 480, 16, 0.55)}; }
    function tot(x){ var p = A(x), s = (pa.value ? p.a : 0) + (pb.value ? p.b : 0) + (pc.value ? p.c : 0); return (pa.value || pb.value || pc.value) ? 1 - Math.exp(-1.6 * (s + 0.04)) : 0; }
    function rgb(l){
      var r = 0, g2 = 0, b = 0;
      if (l < 440){ r = -(l - 440) / 60; b = 1; } else if (l < 490){ g2 = (l - 440) / 50; b = 1; } else if (l < 510){ g2 = 1; b = -(l - 510) / 20; } else if (l < 580){ r = (l - 510) / 70; g2 = 1; } else if (l < 645){ r = 1; g2 = -(l - 645) / 65; } else r = 1;
      var f = l < 420 ? 0.4 + 0.6 * (l - 400) / 20 : l > 680 ? 0.4 + 0.6 * (700 - l) / 20 : 1;
      return "rgb(" + Math.round(255 * r * f) + "," + Math.round(255 * g2 * f) + "," + Math.round(255 * b * f) + ")";
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, L0 = 40, R0 = W - 14, sy = 24, sh = 56;
      function PX(l){ return L0 + (l - 400) / 300 * (R0 - L0); }
      for (var x = L0; x < R0; x += 2){ ctx.fillStyle = rgb(400 + (x - L0) / (R0 - L0) * 300); ctx.fillRect(x, sy, 2, sh); }
      var r = B4.rng(11), cnt = 0, tries = 0;
      ctx.fillStyle = "rgba(15,27,45,.8)";
      while (cnt < 260 && tries < 6000){ tries++; var l = 400 + r() * 300, y = sy + 4 + r() * (sh - 8); if (r() < tot(l) * tot(l)){ cnt++; ctx.beginPath(); ctx.arc(PX(l), y, 2.2, 0, 6.3); ctx.fill(); } }
      B4.txt(c, "Bactéries d'Engelmann : elles vont où l'O₂ se forme", L0, 12, B4.pal.ink, 11, "left");
      var ax = S.draw.axes(c, {x0:400, x1:700, y0:0, y1:1, xl:"λ (nm)", stepX:50, stepY:0.25, t:sy + sh + 24, l:L0, r:14});
      if (pa.value) S.draw.fn(c, ax, function(x){ return A(x).a; }, B4.pal.green, 2.4);
      if (pb.value) S.draw.fn(c, ax, function(x){ return A(x).b; }, B4.pal.teal, 2.4);
      if (pc.value) S.draw.fn(c, ax, function(x){ return A(x).c; }, B4.pal.amber, 2.4);
      S.draw.fn(c, ax, tot, B4.pal.ink, 2.2, [6, 4]);
      B4.txt(c, "chlorophylle a", ax.X(555), ax.Y(0.9), B4.pal.green, 12); B4.txt(c, "chlorophylle b", ax.X(555), ax.Y(0.75), B4.pal.teal, 12); B4.txt(c, "caroténoïdes", ax.X(555), ax.Y(0.6), B4.pal.amber, 12); B4.txt(c, "tirets : feuille", ax.X(555), ax.Y(0.45), B4.pal.ink, 12);
      var xm = ax.X(lam.value); S.draw.line(c, xm, ax.T, xm, ax.B, B4.pal.red, 2.4);
      var L1 = lam.value, p = A(L1), t = tot(L1);
      var best = [["chlorophylle a", pa.value ? p.a : 0], ["chlorophylle b", pb.value ? p.b : 0], ["caroténoïdes", pc.value ? p.c : 0]].sort(function(a, b){ return b[1] - a[1]; })[0];
      var names = L1 < 450 ? "violet" : L1 < 495 ? "bleu" : L1 < 570 ? "vert" : L1 < 590 ? "jaune" : L1 < 620 ? "orange" : "rouge";
      ro.set(0, names); ro.set(1, S.fmt(t * 100, 0) + " %"); ro.set(2, best[1] < 0.05 ? "aucun (lumière peu absorbée)" : best[0]);
      var mx = 0; for (var q = 400; q <= 700; q++) mx = Math.max(mx, tot(q)); ro.set(3, mx > 0 ? S.fmt(t / mx * 100, 0) + " %" : "0 %");
      nt.set(!(pa.value || pb.value || pc.value) ? "Sans pigment, la feuille n'absorbe presque rien : plus de photosynthèse, les bactéries se dispersent." : t < 0.3 ? "Lumière " + names + " peu absorbée : elle est surtout réfléchie ou transmise, la photosynthèse est faible. Les bactéries y sont rares." : "Lumière " + names + " bien absorbée : forte photosynthèse, beaucoup de bactéries attirées par l'O₂ dégagé.", t < 0.3 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"b4-c05-facteurs", ch:"c05", tag:"Classique · facteur limitant",
  titre:"Lumière, CO₂, température : qui limite la photosynthèse ?",
  resume:"Une courbe lumière-rendement avec point de compensation et saturation, sous l'influence du CO₂ et de la température.",
  but:"Règle les trois facteurs et lis l'échange net d'O₂. Le simulateur indique quel facteur limite le plus. Cherche un échange net ≥ 15.",
  aRetenir:"Le bilan net d'O₂ = photosynthèse − respiration. Au point de compensation, ils s'équilibrent (échange net nul) ; au-dessus la plante dégage de l'O₂. À forte lumière, la courbe sature : un autre facteur (CO₂, température) devient limitant. Dans l'obscurité, la plante respire : elle consomme de l'O₂.",
  piege:"Une plante respire aussi le jour et la nuit ; le jour, la photosynthèse la masque. Modèle simplifié : valeurs en µmol d'O₂ par m² et par seconde, d'allure réaliste mais illustratives.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var I = k.slider("Lumière (% du plein soleil)", 0, 100, 1, 40, "%");
    var CO = k.slider("CO₂ de l'air", 0.01, 0.15, 0.01, 0.04, "%");
    var T = k.slider("Température", 0, 45, 1, 25, "°C");
    var ro = k.readouts(["Photosynthèse", "Respiration", "Échange net d'O₂", "Facteur le plus limitant"]);
    var nt = k.note("", "");
    var IK = 25;
    function fT(t){ return t < 28 ? Math.exp(-Math.pow((t - 28) / 14, 2)) : Math.exp(-Math.pow((t - 28) / 9, 2)); }
    function Pm(co, t){ return 30 * co / (co + 0.04) * fT(t); }
    function P(i, co, t){ return Pm(co, t) * i / (i + IK); }
    function R(t){ return 2 * Math.pow(2, (t - 20) / 10); }
    function net(i, co, t){ return P(i, co, t) - R(t); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:-12, y1:24, xl:"lumière (%)", yl:"O₂ net", stepX:20, stepY:6});
      S.draw.fn(c, ax, function(x){ return net(x, 0.04, 25); }, "#b8c0cc", 2.2, [5, 4]);
      S.draw.fn(c, ax, function(x){ return net(x, CO.value, T.value); }, B4.pal.green, 3);
      B4.txt(c, "gris : air ambiant, 25 °C", ax.R - 4, ax.T + 10, "#5f6b7a", 12, "right");
      var pm = Pm(CO.value, T.value), r = R(T.value), p = P(I.value, CO.value, T.value), nn = p - r;
      if (pm > r){ var ic = r * IK / (pm - r); if (ic <= 100){ S.draw.dot(c, ax.X(ic), ax.Y(0), 7, B4.pal.amber); B4.txt(c, "compensation ≈ " + S.fmt(ic, 0) + " %", ax.X(ic) + 8, ax.Y(0) - 12, B4.pal.amber, 12, "left"); } }
      S.draw.line(c, ax.X(0), ax.Y(-r), ax.X(100), ax.Y(-r), B4.pal.red, 1.2, [3, 3]); B4.txt(c, "−respiration", ax.X(99), ax.Y(-r) + 12, B4.pal.red, 11, "right");
      S.draw.dot(c, ax.X(I.value), ax.Y(nn), 7, "#13233a");
      /* facteur limitant : plus grand gain net */
      var g1 = net(Math.min(100, I.value * 1.5 + 5), CO.value, T.value) - nn, g2 = net(I.value, Math.min(0.15, CO.value * 2), T.value) - nn, g3 = net(I.value, CO.value, 28) - nn;
      var best = [["la lumière", g1], ["le CO₂", g2], ["la température", g3]].sort(function(a, b){ return b[1] - a[1]; })[0];
      ro.set(0, S.fmt(p, 1)); ro.set(1, S.fmt(r, 1)); ro.set(2, (nn >= 0 ? "+" : "") + S.fmt(nn, 1)); ro.set(3, best[1] < 0.4 ? "aucun net" : best[0].replace("la ", "").replace("le ", ""));
      var msg = nn < -0.05 ? "Bilan négatif : la plante consomme plus d'O₂ qu'elle n'en produit (la respiration l'emporte)." : nn < 0.05 ? "Point de compensation : photosynthèse = respiration, échange net nul." : "La plante dégage de l'O₂ (+" + S.fmt(nn, 1) + ").";
      if (best[1] >= 0.4) msg += " Facteur le plus limitant ici : <b>" + best[0] + "</b> (l'améliorer ferait gagner ≈ " + S.fmt(best[1], 1) + ").";
      if (nn >= 15) msg += " Défi réussi !";
      nt.set(msg, nn >= 15 ? "ok" : nn < 0 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c05-phases", ch:"c05", tag:"Chloroplaste animé · modèle",
  titre:"Phase lumineuse et cycle de Calvin : qui travaille quand ?",
  resume:"Dans un chloroplaste vivant, la lumière charge une réserve d'ATP et de NADPH que le cycle de Calvin consomme. Coupe la lumière ou le CO₂.",
  but:"Pendant que la simulation tourne, règle la lumière et le CO₂ : suis les jetons d'énergie, la réserve, l'O₂ dégagé et le sucre fabriqué.",
  aRetenir:"Phase lumineuse (thylacoïdes) : lumière → photolyse de l'eau, libération d'O₂, production d'ATP et de NADPH. Cycle de Calvin (stroma) : le CO₂ est fixé puis transformé en sucre en utilisant cet ATP et ce NADPH. Les deux phases s'enchaînent : sans lumière, le cycle s'arrête quand les réserves sont épuisées ; sans CO₂, les réserves se remplissent et la phase lumineuse se bloque.",
  piege:"La « phase sombre » n'a pas lieu dans le noir : elle ne demande pas la lumière directement, mais dépend de ce qu'elle produit. Modèle qualitatif en unités arbitraires.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.16});
    var L = k.slider("Lumière", 0, 100, 5, 100, "%");
    var CO = k.slider("CO₂ disponible", 0, 100, 5, 100, "%");
    var ro = k.readouts(["Réserve ATP + NADPH", "Débit d'O₂", "Débit de fixation du CO₂", "Sucre fabriqué"]);
    var nt = k.note("", "");
    var st = {t:0, P:60, sug:0, h:[], parts:[], acc:0, sa:0}, W0 = 150, rr = B4.rng(5);
    function rates(){ var Lg = L.value / 100, C = CO.value / 100, prod = 8 * Lg * (1 - st.P / 100), cons = 4 * C * st.P / (st.P + 15); return {prod:prod, cons:cons}; }
    function add(k2, a, b, life, extra){ var o = {k:k2, a:a, b:b, t:0, life:life}; if (extra) for (var q in extra) o[q] = extra[q]; st.parts.push(o); }
    var lp = k.loop(function(dt){
      var r = rates();
      for (var s = 0; s < 5; s++){ r = rates(); var h = dt / 5; st.P = Math.max(0, Math.min(100, st.P + (r.prod - r.cons) * h)); st.sug += r.cons * h / 10; }
      st.t += dt; st.acc += dt; if (st.acc >= 0.5){ st.acc = 0; var r2 = rates(); st.h.push([st.t, st.P, r2.prod * 0.6 * 10, r2.cons * 10]); if (st.h.length > 2 * W0) st.h.shift(); }
      /* génération de particules (positions relatives à la scène) */
      function chance(rate){ return rr() < rate * dt; }
      if (chance(L.value / 100 * 4)) add("ph", [0.06 + rr() * 0.05, 0.08], [0.1 + rr() * 0.24, 0.5], 0.9);
      if (chance(r.prod * 0.9)){ add("o2", [0.1 + rr() * 0.24, 0.45], [0.02 + rr() * 0.3, -0.12], 1.6); add("tok", [0.3, 0.55 + rr() * 0.1], [0.47, 0.8 - rr() * 0.3], 1.0); }
      if (chance(r.cons * 1.6)){ add("tok2", [0.47, 0.7 - rr() * 0.3], [0.7, 0.58], 0.9); add("adp", [0.7, 0.58], [0.25, 0.9], 1.6); }
      if (chance(CO.value / 100 * (r.cons / 4) * 5)) add("co2", [0.92, -0.05], [0.76, 0.5], 1.1);
      if (st.sa >= 1){ st.sa -= 1; add("sug", [0.8, 0.66], [0.96, 1.05], 1.4); }
      st.sa += r.cons * dt * 0.35;
      st.parts.forEach(function(p){ p.t += dt; }); st.parts = st.parts.filter(function(p){ return p.t < p.life; });
      k.redraw();
    });
    lp.play();
    k.button("Éteindre la lumière", function(){ L.set(0); }, true);
    k.button("Rallumer", function(){ L.set(100); });
    k.button("Retirer le CO₂", function(){ CO.set(0); });
    k.button("Remettre le CO₂", function(){ CO.set(100); });
    k.button("↺ Recommencer", function(){ st.t = 0; st.P = 60; st.sug = 0; st.h = []; st.parts = []; });
    function ease(x){ return x * x * (3 - 2 * x); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, r = rates(), hs = H * 0.52;
      function X(u){ return u * W; } function Y(v){ return v * hs; }
      /* chloroplaste */
      S.draw.rrect(c, 6, Y(0.16), W - 12, hs * 0.82, 30); var eg = ctx.createLinearGradient(0, 0, W, hs); eg.addColorStop(0, "#e2f5e6"); eg.addColorStop(1, "#cfeed9"); ctx.fillStyle = eg; ctx.fill(); ctx.strokeStyle = "#2f8a5e"; ctx.lineWidth = 3; ctx.stroke();
      S.draw.rrect(c, 12, Y(0.16) + 6, W - 24, hs * 0.82 - 12, 24); ctx.strokeStyle = "rgba(47,138,94,.35)"; ctx.lineWidth = 1.2; ctx.stroke();
      /* soleil */
      var sl = L.value / 100; S.draw.glow(c, 26, 20, 34, P.yellow, 0.25 + 0.6 * sl); ctx.beginPath(); ctx.arc(26, 20, 11, 0, 6.2832); ctx.fillStyle = sl > 0 ? "#f4c542" : "#c9ced6"; ctx.fill();
      /* grana */
      for (var s = 0; s < 3; s++){ for (var j = 0; j < 4; j++){ S.draw.rrect(c, X(0.1 + s * 0.11) - 15, Y(0.5) + j * 9, 30, 6.5, 3); ctx.fillStyle = "#3f9d62"; ctx.fill(); ctx.strokeStyle = "#1f6b43"; ctx.lineWidth = 1; ctx.stroke(); } }
      S.draw.label(c, "Thylacoïdes", X(0.22), Y(0.4), {color:"#1f6b43", size:10});
      /* réserve */
      var tx = X(0.455), tw = 20, ty0 = Y(0.34), th = Y(0.5);
      S.draw.rrect(c, tx, ty0, tw, th, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = P.violet; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); S.draw.rrect(c, tx, ty0, tw, th, 7); ctx.clip(); var lvl = th * st.P / 100; var tg = ctx.createLinearGradient(0, ty0 + th - lvl, 0, ty0 + th); tg.addColorStop(0, "#ffd45e"); tg.addColorStop(1, "#c8a2ec"); ctx.fillStyle = tg; ctx.fillRect(tx, ty0 + th - lvl, tw, lvl); ctx.restore();
      S.draw.label(c, "réserve", tx + tw / 2, ty0 - 9, {color:P.violet, size:10}); S.draw.text(c, "ATP + NADPH", tx + tw / 2, ty0 + th + 11, {size:9, color:P.violet});
      /* Calvin */
      var ccx = X(0.74), ccy = Y(0.62), cr = Math.min(W * 0.1, hs * 0.2); ctx.save(); ctx.lineWidth = 6; ctx.strokeStyle = "rgba(36,119,90,.25)"; ctx.beginPath(); ctx.arc(ccx, ccy, cr, 0, 6.2832); ctx.stroke(); ctx.setLineDash([10, 8]); ctx.lineDashOffset = -st.t * r.cons * 14; ctx.strokeStyle = P.green; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ccx, ccy, cr, 0, 6.2832); ctx.stroke(); ctx.restore();
      S.draw.text(c, "cycle de", ccx, ccy - 6, {size:10, color:P.green}); S.draw.text(c, "Calvin", ccx, ccy + 6, {size:10, color:P.green}); S.draw.label(c, "Stroma", ccx, Y(0.34), {color:P.green, size:10});
      /* particules */
      st.parts.forEach(function(p){
        var u = ease(Math.min(1, p.t / p.life)), x = X(p.a[0] + (p.b[0] - p.a[0]) * u), y = Y(p.a[1] + (p.b[1] - p.a[1]) * u), al = p.t > p.life - 0.25 ? (p.life - p.t) / 0.25 : 1; ctx.save(); ctx.globalAlpha = Math.max(0, al);
        if (p.k === "ph"){ ctx.strokeStyle = "#f4c542"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 3, y - 4); ctx.lineTo(x + 3, y + 4); ctx.stroke(); }
        else if (p.k === "o2"){ ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.2832); ctx.fillStyle = "#5aa0e8"; ctx.fill(); S.draw.text(c, "O₂", x + 9, y - 3, {size:8, color:P.blue}); }
        else if (p.k === "tok" || p.k === "tok2"){ S.draw.glow(c, x, y, 9, P.yellow, 0.5); ctx.beginPath(); ctx.arc(x, y, 3.6, 0, 6.2832); ctx.fillStyle = p.k === "tok" ? "#f4c542" : "#d9a521"; ctx.fill(); }
        else if (p.k === "adp"){ ctx.beginPath(); ctx.arc(x, y, 2.8, 0, 6.2832); ctx.fillStyle = "#b9a0cf"; ctx.fill(); }
        else if (p.k === "co2"){ ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.2832); ctx.fillStyle = "#9aa4b2"; ctx.fill(); S.draw.text(c, "CO₂", x - 11, y - 2, {size:8, color:"#5f6b7a"}); }
        else if (p.k === "sug"){ ctx.beginPath(); for (var q = 0; q < 6; q++){ var a = q * Math.PI / 3; q ? ctx.lineTo(x + 6 * Math.cos(a), y + 6 * Math.sin(a)) : ctx.moveTo(x + 6 * Math.cos(a), y + 6 * Math.sin(a)); } ctx.closePath(); ctx.fillStyle = "#f7dc7a"; ctx.fill(); ctx.strokeStyle = "#7a5b12"; ctx.lineWidth = 1; ctx.stroke(); }
        ctx.restore();
      });
      S.draw.text(c, "sucre →", W - 12, hs - 2, {size:10, color:"#8a6d1a", align:"right"});
      /* graphe */
      var ax = S.draw.axes(c, {x0:0, x1:W0, y0:0, y1:100, xl:"t (s, fenêtre glissante)", stepX:30, stepY:25, t:hs + 24, l:40});
      var t0 = Math.max(0, st.t - W0);
      var cols = [P.violet, P.green, P.acc], names = ["réserve ATP+NADPH", "débit d'O₂", "fixation du CO₂"];
      for (s = 0; s < 3; s++){
        ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = cols[s]; ctx.lineWidth = 2.4; ctx.beginPath(); var first = true;
        st.h.forEach(function(p){ var x = ax.X(p[0] - t0), y = ax.Y(p[1 + s]); if (first){ ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore();
        S.draw.text(c, names[s], ax.L + 6, ax.T + 10 + s * 14, {size:11, color:cols[s], align:"left"});
      }
      ro.set(0, S.fmt(st.P, 0)); ro.set(1, S.fmt(r.prod * 6, 1)); ro.set(2, S.fmt(r.cons * 10, 1)); ro.set(3, S.fmt(st.sug, 1) + " u.a.");
      var msg;
      if (L.value === 0 && st.P > 5) msg = "Plus de lumière : plus d'O₂ ni de nouvel ATP/NADPH, mais le cycle de Calvin continue en puisant dans la réserve (" + S.fmt(st.P, 0) + ").";
      else if (L.value === 0) msg = "Réserve épuisée : le cycle de Calvin s'arrête. Il dépend des produits de la phase lumineuse.";
      else if (CO.value === 0) msg = "Sans CO₂, le cycle ne consomme plus ATP/NADPH : la réserve se remplit, la phase lumineuse se bloque (débit d'O₂ qui tombe).";
      else msg = "Régime établi : la phase lumineuse alimente le cycle de Calvin, qui fabrique du sucre.";
      nt.set(msg, L.value === 0 || CO.value === 0 ? "warn" : "ok");
    });
  }
});
