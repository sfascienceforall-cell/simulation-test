/* Biologie 4e · chapitre 5 · Photosynthèse : phases et facteurs */
SFA.sim({
  id:"b4-c05-bilan", ch:"c05", tag:"Marquage isotopique · original",
  titre:"Bilan de la photosynthèse et origine de l'oxygène",
  resume:"Marque toi-même des molécules à l'¹⁸O, lance la réaction et suis chaque atome : le dioxygène vient de l'eau, pas du CO₂. Les atomes se conservent.",
  but:"Touche des molécules de CO₂ ou d'eau pour marquer leur oxygène (¹⁸O, en violet), puis lance la photosynthèse ou glisse l'avancement : chaque atome rejoint sa place dans le glucose, le dioxygène ou l'eau reformée. Les barres comptent où arrive l'¹⁸O. Relève les défis.",
  aRetenir:"6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O (soit, en net, 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂), grâce à la lumière captée par la chlorophylle. Les atomes se conservent : 6 C, 24 H, 24 O de chaque côté. L'oxygène marqué de l'eau se retrouve dans O₂ : le dioxygène provient de la photolyse de l'eau. Celui du CO₂ se retrouve dans le glucose et dans l'eau reformée.",
  piege:"On lit souvent que l'O₂ vient du CO₂ : c'est faux. L'écriture détaillée, avec 12 H₂O consommées et 6 H₂O reformées, est la seule qui rende compte des expériences de marquage. Modèle d'atomes simplifié : les étapes intermédiaires (ATP, NADPH, cycle de Calvin) ne sont pas détaillées.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.35}); B4.adapt(c, 1.38, 1.0, 480);
    var av = k.slider("Avancement de la réaction", 0, 100, 1, 0, "%");
    var light = k.toggle("Lumière allumée", true);
    var ro = k.readouts(["O₂ marqué", "O du glucose marqué", "O de l'eau reformée marqué", "Atomes C · H · O (avant = après)"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var st = {mk:{}, run:false, mol:[], defi:null, score:0, tot:0, t:0};   /* mk["c3"] / mk["w7"] = marqué */
    var lp = k.loop(function(dt){ st.t += dt; if (st.run && light.value){ av.set(Math.min(100, av.value + dt * 22)); if (av.value >= 100) st.run = false; } k.redraw(); });
    lp.play();
    k.button("▶ Lancer la photosynthèse", function(){ if (av.value >= 100) av.set(0); st.run = true; }, true);
    k.button("↺ Remettre les réactifs", function(){ st.run = false; av.set(0); });
    k.button("Marquer toute l'eau", function(){ for (var i = 0; i < 12; i++) st.mk["w" + i] = true; av.set(0); });
    k.button("Marquer tout le CO₂", function(){ for (var i = 0; i < 6; i++) st.mk["c" + i] = true; av.set(0); });
    k.button("Effacer les marquages", function(){ st.mk = {}; av.set(0); });
    var DEFS = [
      {txt:"Obtiens du dioxygène marqué à 100 %.", ok:function(r){ return r.o2 === 12; }},
      {txt:"Obtiens un glucose dont la moitié des atomes d'oxygène est marquée, sans marquer le dioxygène.", ok:function(r){ return r.gl === 3 && r.o2 === 0; }},
      {txt:"Obtiens exactement 25 % de dioxygène marqué.", ok:function(r){ return r.o2 === 3; }},
      {txt:"Marque des molécules pour que toute l'eau reformée soit marquée, mais aucun O₂.", ok:function(r){ return r.wr === 6 && r.o2 === 0; }},
      {txt:"Obtiens 50 % d'O₂ marqué ET 50 % d'eau reformée marquée.", ok:function(r){ return r.o2 === 6 && r.wr === 3; }}
    ];
    k.button("Défi suivant", function(){ var d; do { d = DEFS[Math.floor(Math.random() * DEFS.length)]; } while (st.defi && d.txt === st.defi.txt); st.defi = {txt:d.txt, ok:d.ok, done:false}; st.tot++; st.mk = {}; av.set(0); });
    function layout(W, H, wide){
      var L = {}, pad = 12, r = wide ? 9.5 : 6.4, cw = W - 2 * pad;
      L.r = r; L.co2 = []; L.w = [];
      for (var j = 0; j < 6; j++) L.co2.push([pad + cw * (j + 0.5) / 6, H * 0.085]);
      for (var i = 0; i < 12; i++) L.w.push([pad + cw * ((i % 6) + 0.5) / 6, H * (i < 6 ? 0.165 : 0.235)]);
      L.chl = [W / 2, H * 0.4, Math.min(W * 0.36, 170), H * 0.065];
      var gx = W * 0.25, gy = H * 0.68, rg = r * 3.2; L.g = [gx, gy, rg];
      var ring = []; for (var q = 0; q < 6; q++){ var a = -Math.PI / 2 + q * Math.PI / 3; ring.push([gx + rg * Math.cos(a), gy + rg * Math.sin(a), a]); }
      L.ring = ring;
      var out = function(p, f, da){ var a2 = p[2] + (da || 0); return [p[0] + Math.cos(a2) * r * f, p[1] + Math.sin(a2) * r * f, p[2]]; };
      L.gC = [ring[1], ring[2], ring[3], ring[4], ring[5], out(ring[5], 2.4)];
      L.gO = [ring[0], out(ring[1], 2.5), out(ring[2], 2.5), out(ring[3], 2.5), out(ring[4], 2.5), out(ring[5], 4.6)];
      L.gH = []; [1, 2, 3, 4].forEach(function(q){ var o = out(ring[q], 3.7); L.gH.push([o[0], o[1]]); var o2 = out(ring[q], 2, 1.9); L.gH.push([o2[0], o2[1]]); });
      var h1 = out(ring[5], 6.0), h2 = out(L.gC[5], 1.6, 1.5708), h3 = out(L.gC[5], 1.6, -1.5708), h4 = out(ring[5], 2, -1.9);
      L.gH.push([h1[0], h1[1]]); L.gH.push([h2[0], h2[1]]); L.gH.push([h3[0], h3[1]]); L.gH.push([h4[0], h4[1]]);
      L.o2 = []; for (j = 0; j < 6; j++){ var ox = W * 0.56 + (j % 3) * W * 0.145, oy = H * (0.575 + Math.floor(j / 3) * 0.075); L.o2.push([[ox - r * 0.95, oy], [ox + r * 0.95, oy]]); }
      L.wr = []; for (j = 0; j < 6; j++) L.wr.push([W * 0.5 + (j % 3) * W * 0.17 + W * 0.04, H * (0.735 + Math.floor(j / 3) * 0.062)]);
      L.bars = [pad, H * 0.84, W - 2 * pad, H * 0.15];
      return L;
    }
    function atoms(L){
      var A = [], r = L.r;
      for (var j = 0; j < 6; j++){
        var p = L.co2[j], m = !!st.mk["c" + j];
        A.push({e:"C", a:[p[0], p[1]], b:L.gC[j], s:"c"});
        A.push({e:"O", a:[p[0] - r * 1.9, p[1]], b:L.gO[j], mk:m, s:"c", dest:"gl"});
        var w = L.wr[j]; A.push({e:"O", a:[p[0] + r * 1.9, p[1]], b:w, mk:m, s:"c", dest:"wr"});
      }
      for (var i = 0; i < 12; i++){
        var q = L.w[i], mw = !!st.mk["w" + i];
        A.push({e:"O", a:[q[0], q[1]], b:L.o2[Math.floor(i / 2)][i % 2], mk:mw, s:"w", dest:"o2"});
        var hb1, hb2;
        if (i < 6){ hb1 = L.gH[2 * i]; hb2 = L.gH[2 * i + 1]; } else { var wr = L.wr[i - 6]; hb1 = [wr[0] - r * 1.5, wr[1] + r * 1.1]; hb2 = [wr[0] + r * 1.5, wr[1] + r * 1.1]; }
        A.push({e:"H", a:[q[0] - r * 1.45, q[1] + r * 1.05], b:hb1, s:"w"}); A.push({e:"H", a:[q[0] + r * 1.45, q[1] + r * 1.05], b:hb2, s:"w"});
      }
      return A;
    }
    function frac(s, p){ var a = s === "w" ? 0 : 0.35, b = s === "w" ? 0.55 : 1; return B4.ease((p - a) / (b - a)); }
    function pos(at, p, L){ var u = frac(at.s, p); if (u <= 0) return at.a; if (u >= 1) return at.b; var cx = L.chl[0] + (at.a[0] - L.chl[0]) * 0.25, cy = L.chl[1]; var x = (1 - u) * (1 - u) * at.a[0] + 2 * u * (1 - u) * cx + u * u * at.b[0], y = (1 - u) * (1 - u) * at.a[1] + 2 * u * (1 - u) * cy + u * u * at.b[1]; return [x, y]; }
    function atom(x, y, e, mk, r){
      var ctx = c.ctx, rad = e === "H" ? r * 0.62 : r, col = e === "C" ? "#3b3f46" : e === "H" ? "#f4f6f8" : mk ? "#7b3fc4" : "#d6453d";
      if (mk) S.draw.glow(c, x, y, rad * 2.2, "#9b5de5", 0.45);
      var g = ctx.createRadialGradient(x - rad * 0.35, y - rad * 0.35, rad * 0.1, x, y, rad); g.addColorStop(0, "#ffffff"); g.addColorStop(0.25, col); g.addColorStop(1, col);
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = mk ? "#f4c542" : e === "H" ? "#9aa4b2" : "rgba(0,0,0,.35)"; ctx.lineWidth = mk ? 2 : 1; ctx.stroke();
      if (mk && r > 6.5) S.draw.text(c, "18", x, y + 0.5, {size:7, color:"#fff", weight:800});
    }
    c.pointer(function(type, p){
      if (type !== "down" || !st.mol.length) return;
      var best = null, bd = 1e9; st.mol.forEach(function(m){ var d = Math.hypot(p.x - m.x, p.y - m.y); if (d < bd){ bd = d; best = m; } });
      if (best && bd < best.r){ st.mk[best.k] = !st.mk[best.k]; st.run = false; av.set(0); k.redraw(); }
    });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, L = layout(W, H, wide), A = atoms(L), p = av.value / 100, r = L.r, fs = wide ? 11 : 9.5;
      st.mol = [];
      /* fonds : réactifs, chloroplaste, produits */
      S.draw.rrect(c, 4, H * 0.025, W - 8, H * 0.255, 10); ctx.fillStyle = "#f6f8fb"; ctx.fill();
      S.draw.rrect(c, 4, H * 0.52, W - 8, H * 0.305, 10); ctx.fillStyle = "#f6fbf4"; ctx.fill();
      S.draw.text(c, "RÉACTIFS · 6 CO₂ + 12 H₂O (touche pour marquer)", 10, H * 0.025 + 8, {size:fs - 0.5, color:"#5f6b7a", align:"left", weight:800});
      S.draw.text(c, "PRODUITS · C₆H₁₂O₆ + 6 O₂ + 6 H₂O", 10, H * 0.52 + 9, {size:fs - 0.5, color:"#2a6b45", align:"left", weight:800});
      var ch = L.chl, lit = light.value;
      if (lit){ S.draw.glow(c, ch[0] + ch[2] + 18, ch[1] - ch[3] - 10, 34, P.yellow, 0.7); ctx.beginPath(); ctx.arc(ch[0] + ch[2] + 18, ch[1] - ch[3] - 10, 9, 0, 6.2832); ctx.fillStyle = "#f4c542"; ctx.fill(); for (var q = 0; q < 3; q++){ var off = ((st.t * 30 + q * 14) % 40); S.draw.line(c, ch[0] + ch[2] + 6 - off * 0.5, ch[1] - ch[3] - 2 + off * 0.3, ch[0] + ch[2] - off * 0.5, ch[1] - ch[3] + 2 + off * 0.3, "#e0a91b", 2); } }
      B4.ell(c, ch[0], ch[1], ch[2], ch[3], lit ? "#cfeed2" : "#dfe5dc", "#2f8a5e", 2.5);
      for (q = 0; q < 5; q++){ var tx = ch[0] - ch[2] * 0.6 + q * ch[2] * 0.3; for (var j = 0; j < 3; j++){ S.draw.rrect(c, tx - 9, ch[1] - 8 + j * 5.5, 18, 4, 2); ctx.fillStyle = lit ? "#3f9d62" : "#8aa392"; ctx.fill(); } }
      S.draw.label(c, lit ? "chloroplaste · lumière + chlorophylle" : "chloroplaste dans le noir : rien ne se passe", ch[0], ch[1] + ch[3] + 11, {color:lit ? "#1f6b43" : P.red, size:fs - 1});
      if (p > 0.02 && p < 0.55 && lit) S.draw.label(c, "photolyse de l'eau", ch[0] - ch[2] * 0.55, ch[1] - ch[3] - 8, {color:P.blue, size:fs - 1.5});
      if (p > 0.4 && p < 0.98 && lit) S.draw.label(c, "fixation du CO₂", ch[0] + ch[2] * 0.4, ch[1] - ch[3] - 8, {color:"#3b3f46", size:fs - 1.5});
      /* liaisons des réactifs (s'effacent) et des produits (apparaissent) */
      function bond(a, b, al, col){ if (al <= 0.02) return; ctx.save(); ctx.globalAlpha = al; S.draw.line(c, a[0], a[1], b[0], b[1], col || "#8a95a3", 3); ctx.restore(); }
      var aw = 1 - frac("w", p) * 3, ac = 1 - frac("c", p) * 3;
      for (j = 0; j < 6; j++){ var cc = L.co2[j]; bond([cc[0] - r * 1.9, cc[1]], [cc[0] + r * 1.9, cc[1]], ac); st.mol.push({k:"c" + j, x:cc[0], y:cc[1], r:r * 3}); }
      for (var i = 0; i < 12; i++){ var w = L.w[i]; bond([w[0] - r * 1.45, w[1] + r * 1.05], w, aw); bond([w[0] + r * 1.45, w[1] + r * 1.05], w, aw); st.mol.push({k:"w" + i, x:w[0], y:w[1] + r * 0.5, r:r * 2.4}); }
      var pw = (frac("w", p) - 0.85) / 0.15, pc = (frac("c", p) - 0.85) / 0.15;
      L.o2.forEach(function(o){ bond(o[0], o[1], pw); });
      L.wr.forEach(function(w2){ bond(w2, [w2[0] - r * 1.5, w2[1] + r * 1.1], pc); bond(w2, [w2[0] + r * 1.5, w2[1] + r * 1.1], pc); });
      if (pc > 0){ ctx.save(); ctx.globalAlpha = Math.min(1, pc); ctx.beginPath(); L.ring.forEach(function(v, q2){ q2 ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]); }); ctx.closePath(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 3; ctx.stroke();
        [1, 2, 3, 4].forEach(function(q3){ S.draw.line(c, L.ring[q3][0], L.ring[q3][1], L.gO[q3][0], L.gO[q3][1], "#8a95a3", 2.6); }); S.draw.line(c, L.ring[5][0], L.ring[5][1], L.gC[5][0], L.gC[5][1], "#8a95a3", 2.6); S.draw.line(c, L.gC[5][0], L.gC[5][1], L.gO[5][0], L.gO[5][1], "#8a95a3", 2.6); ctx.restore();
        S.draw.text(c, "glucose", L.g[0], L.g[1], {color:"#8a6d1a", size:fs - 1.5, weight:800}); }
      /* atomes : d'abord ceux qui ne bougent pas, puis ceux en vol */
      var order = A.slice().sort(function(a, b){ var ua = frac(a.s, p), ub = frac(b.s, p); return (ua > 0 && ua < 1) - (ub > 0 && ub < 1); });
      order.forEach(function(at){ var q4 = pos(at, lit ? p : 0, L); atom(q4[0], q4[1], at.e, at.mk, r); });
      /* comptage de l'¹⁸O arrivé */
      var cnt = {o2:0, gl:0, wr:0}, tot = 0;
      A.forEach(function(at){ if (!at.mk) return; tot++; if (frac(at.s, lit ? p : 0) >= 1) cnt[at.dest]++; });
      /* barres liées : où va l'oxygène marqué */
      var B = L.bars, bw = (B[2] - 20) / 3, names = [["o2", "dans O₂", 12, P.blue], ["gl", "dans le glucose", 6, "#c9a227"], ["wr", "dans l'eau reformée", 6, P.teal]];
      S.draw.text(c, "¹⁸O arrivé à destination (sur le nombre d'O de chaque produit)", B[0], B[1], {size:fs - 0.5, color:"#5f6b7a", align:"left", weight:700});
      names.forEach(function(nm, q5){
        var x = B[0] + q5 * (bw + 10), y = B[1] + 12, hh = B[3] - 30, f = cnt[nm[0]] / nm[2];
        S.draw.rrect(c, x, y, bw, hh, 6); ctx.fillStyle = "#eef1f5"; ctx.fill();
        if (f > 0){ S.draw.rrect(c, x, y + hh * (1 - f), bw, hh * f, 6); ctx.fillStyle = "#7b3fc4"; ctx.fill(); }
        S.draw.text(c, cnt[nm[0]] + " / " + nm[2] + " O · " + S.fmt(f * 100, 0) + " %", x + bw / 2, y + hh / 2, {size:fs, color:f > 0.55 ? "#fff" : P.ink, weight:800});
        S.draw.text(c, nm[1], x + bw / 2, y + hh + 9, {size:fs - 1, color:nm[3], weight:700});
      });
      ro.set(0, S.fmt(cnt.o2 / 12 * 100, 0) + " %"); ro.set(1, S.fmt(cnt.gl / 6 * 100, 0) + " %"); ro.set(2, S.fmt(cnt.wr / 6 * 100, 0) + " %"); ro.set(3, "6 · 24 · 24");
      var nmw = 0, nmc = 0; for (i = 0; i < 12; i++) if (st.mk["w" + i]) nmw++; for (j = 0; j < 6; j++) if (st.mk["c" + j]) nmc++;
      var msg;
      if (!lit) msg = "Sans lumière, pas de photolyse de l'eau ni de fabrication de glucose : les réactifs restent tels quels.";
      else if (p < 1) msg = "Avancement " + S.fmt(p * 100, 0) + " % : l'eau est scindée d'abord (photolyse, l'O₂ part), puis le CO₂ est fixé et réduit en glucose avec les H venus de l'eau. Marqués : " + nmw + " H₂O, " + nmc + " CO₂.";
      else msg = "Bilan : 6 C, 24 H et 24 O de chaque côté — rien ne se perd. " + (tot === 0 ? "Marque des molécules pour suivre l'oxygène." : "L'¹⁸O de l'eau est dans O₂ (" + cnt.o2 + "), celui du CO₂ dans le glucose (" + cnt.gl + ") et l'eau reformée (" + cnt.wr + ") : le dioxygène vient de l'eau.");
      nt.set(msg, !lit ? "warn" : p >= 1 ? "ok" : "");
      if (st.defi){ if (!st.defi.done && p >= 1 && lit && st.defi.ok(cnt)){ st.defi.done = true; st.score++; }
        nd.set("<b>Défi " + st.tot + ".</b> " + st.defi.txt + " Marque les bonnes molécules puis lance la réaction. " + (st.defi.done ? "<b>Réussi !</b>" : p >= 1 ? "Pas encore : modifie tes marquages et relance." : "") + " Score : " + st.score + " / " + st.tot + ".", st.defi.done ? "ok" : "warn"); }
      else nd.set("Clique « Défi suivant » : un objectif de marquage à atteindre.", "");
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
  resume:"L'expérience de l'élodée : rapproche la lampe, ajoute du CO₂, chauffe l'eau et compte les bulles d'O₂. La courbe montre compensation, saturation et facteur limitant.",
  but:"Glisse la lampe le long du banc (ou règle la distance), le CO₂ dissous et la température. Compte les bulles qui montent dans le tube : le point rouge suit sur la courbe échange net d'O₂ / lumière. Relève les défis.",
  aRetenir:"Le bilan net d'O₂ = photosynthèse − respiration. Au point de compensation, ils s'équilibrent (aucune bulle) ; au-dessus la plante dégage de l'O₂. La lumière reçue baisse vite avec la distance (÷ 4 quand la distance double). À forte lumière, la courbe sature : un autre facteur (CO₂, température) devient limitant. Dans l'obscurité, la plante respire : elle consomme de l'O₂.",
  piege:"Une plante respire aussi le jour ; le jour, la photosynthèse la masque. Modèle simplifié : valeurs en µmol d'O₂ par m² et par seconde, d'allure réaliste mais illustratives ; on suppose que toutes les bulles sont de l'O₂ de même taille.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.2}); B4.adapt(c, 1.25, 0.95, 480);
    var dist = k.slider("Distance lampe – élodée", 10, 60, 1, 15, "cm");
    var CO = k.slider("CO₂ disponible (hydrogénocarbonate ajouté)", 0.01, 0.15, 0.01, 0.04, "% équiv. air");
    var T = k.slider("Température de l'eau", 0, 45, 1, 25, "°C");
    var on = k.toggle("Lampe allumée", true);
    var ro = k.readouts(["Lumière reçue", "Photosynthèse − respiration", "Bulles d'O₂ par minute", "Facteur le plus limitant"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var IK = 25;
    function fT(t){ return t < 28 ? Math.exp(-Math.pow((t - 28) / 14, 2)) : Math.exp(-Math.pow((t - 28) / 9, 2)); }
    function Pm(co, t){ return 30 * co / (co + 0.04) * fT(t); }
    function Ph(i, co, t){ return Pm(co, t) * i / (i + IK); }
    function R(t){ return 2 * Math.pow(2, (t - 20) / 10); }
    function net(i, co, t){ return Ph(i, co, t) - R(t); }
    function I(){ return on.value ? Math.min(100, 100 * Math.pow(10 / dist.value, 2)) : 0; }
    var st = {bub:[], gas:0, acc:0, t:0, drag:null, geo:{}, defi:null, score:0, tot:0}, rr = B4.rng(3);
    var DEF = [
      function(){ return {txt:"Fais dégager au moins 30 bulles par minute.", ok:function(n){ return n.bpm >= 30; }}; },
      function(){ CO.set(0.04); T.set(20); return {txt:"À 0,04 % de CO₂ et 20 °C, place la lampe au point de compensation (plus aucune bulle, échange net entre −0,3 et +0,3).", ok:function(n){ return Math.abs(n.net) <= 0.3 && Math.abs(CO.value - 0.04) < 1e-6 && T.value === 20; }}; },
      function(){ return {txt:"Calcule puis règle : à quelle distance la plante reçoit-elle 25 % de la lumière reçue à 10 cm ?", ok:function(n){ return dist.value === 20; }, sol:"20 cm : distance × 2 → lumière ÷ 4"}; },
      function(){ dist.set(10); T.set(25); CO.set(0.01); return {txt:"Lampe à 10 cm, 25 °C, CO₂ très bas : trouve le facteur limitant et double le nombre de bulles sans bouger la lampe.", base:null, ok:function(n){ if (this.base === null) this.base = n.bpm; return dist.value === 10 && n.bpm >= 2 * this.base && this.base > 0; }}; }
    ];
    k.button("Défi suivant", function(){ st.defi = DEF[Math.floor(Math.random() * DEF.length)](); st.defi.done = false; st.tot++; }, true);
    k.button("Vider le tube", function(){ st.gas = 0; });
    var lp = k.loop(function(dt){
      st.t += dt; var n = net(I(), CO.value, T.value), bpm = Math.max(0, n) * 3;
      st.acc += bpm / 60 * dt * 6;           /* 1 s affichée = 6 s d'expérience */
      while (st.acc >= 1){ st.acc -= 1; st.bub.push({x:(rr() - 0.5) * 6, y:0, v:0.55 + rr() * 0.25, r:2.4 + rr() * 1.2}); }
      st.bub.forEach(function(b){ b.y += b.v * dt; }); st.bub = st.bub.filter(function(b){ if (b.y >= 1){ st.gas = Math.min(1, st.gas + 0.004); return false; } return true; });
      k.redraw();
    });
    lp.play();
    c.pointer(function(type, p){
      var g = st.geo;
      if (type === "down") st.drag = g.lamp && Math.abs(p.y - g.lamp.y) < 40 && p.x < g.bx ? "lamp" : null;
      if ((type === "down" || type === "drag") && st.drag === "lamp"){ var d = Math.round((g.bx - p.x) / g.ppc); dist.set(Math.max(10, Math.min(60, d))); k.redraw(); }
      if (type === "up") st.drag = null;
    });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, sh = H * 0.52, fs = wide ? 10.5 : 9.5;
      var i = I(), ph = Ph(i, CO.value, T.value), r = R(T.value), n = ph - r, bpm = Math.max(0, n) * 3;
      /* banc d'optique */
      var bw = Math.min(150, W * 0.3), bx = W - bw - 16, by0 = sh * 0.12, by1 = sh * 0.92, ppc = (bx - 40) / 60;
      st.geo = {bx:bx, ppc:ppc};
      var rail = sh * 0.55; S.draw.line(c, 10, rail + 26, bx, rail + 26, "#8a95a3", 3);
      for (var q = 0; q <= 60; q += 10){ var xq = bx - q * ppc; S.draw.line(c, xq, rail + 22, xq, rail + 30, "#8a95a3", 1.5); if (q >= 10) S.draw.text(c, q + "", xq, rail + 39, {size:9, color:"#5f6b7a"}); }
      S.draw.text(c, "cm", 14, rail + 39, {size:9, color:"#5f6b7a", align:"left"});
      /* lampe */
      var lx = bx - dist.value * ppc, ly = rail; st.geo.lamp = {x:lx, y:ly};
      if (on.value){ var gr = ctx.createLinearGradient(lx, 0, bx, 0); gr.addColorStop(0, "rgba(255,226,120,.55)"); gr.addColorStop(1, "rgba(255,226,120," + (0.08 + 0.4 * i / 100) + ")"); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(lx + 8, ly - 10); ctx.lineTo(bx + 10, ly - 46); ctx.lineTo(bx + 10, ly + 30); ctx.lineTo(lx + 8, ly + 10); ctx.closePath(); ctx.fill(); S.draw.glow(c, lx + 10, ly, 30, P.yellow, 0.8); }
      S.draw.line(c, lx - 6, ly + 6, lx - 6, rail + 24, "#3d4f6b", 3);
      ctx.beginPath(); ctx.moveTo(lx - 14, ly - 14); ctx.lineTo(lx + 6, ly - 10); ctx.lineTo(lx + 6, ly + 10); ctx.lineTo(lx - 14, ly + 14); ctx.closePath(); ctx.fillStyle = st.drag === "lamp" ? P.red : "#3d4f6b"; ctx.fill();
      ctx.beginPath(); ctx.arc(lx + 8, ly, 7, -1.5708, 1.5708); ctx.fillStyle = on.value ? "#ffe08a" : "#c9ced6"; ctx.fill();
      S.draw.label(c, "lampe ↔ glisse", lx, ly - 26, {color:st.drag === "lamp" ? P.red : P.ink, size:fs - 0.5});
      /* bécher */
      var top = by0 + 6, wy = top + (by1 - top) * 0.12;
      var tint = Math.min(1, (CO.value - 0.01) / 0.14);
      ctx.fillStyle = "rgba(" + Math.round(205 - 30 * tint) + "," + Math.round(232 - 10 * tint) + ",245,.75)"; ctx.fillRect(bx, wy, bw, by1 - wy);
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx, by1); ctx.lineTo(bx + bw, by1); ctx.lineTo(bx + bw, top); ctx.stroke();
      /* entonnoir + tube à essai */
      var fx = bx + bw * 0.5, fy = by1 - (by1 - wy) * 0.42, tw = 16, ty0 = by0 - 4, ty1 = fy - 22;
      ctx.beginPath(); ctx.moveTo(fx - bw * 0.38, by1 - 6); ctx.lineTo(fx - tw / 2 + 2, fy); ctx.lineTo(fx - tw / 2 + 2, ty1 + 6); ctx.moveTo(fx + bw * 0.38, by1 - 6); ctx.lineTo(fx + tw / 2 - 2, fy); ctx.lineTo(fx + tw / 2 - 2, ty1 + 6); ctx.strokeStyle = "rgba(90,105,125,.7)"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.rrect(c, fx - tw / 2, ty0, tw, ty1 - ty0 + 10, 7); ctx.fillStyle = "rgba(205,232,245,.85)"; ctx.fill(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 1.5; ctx.stroke();
      var gh = (ty1 - ty0) * st.gas; if (gh > 0){ S.draw.rrect(c, fx - tw / 2 + 2, ty0 + 2, tw - 4, gh, 5); ctx.fillStyle = "#ffffff"; ctx.fill(); }
      S.draw.label(c, "O₂", fx + tw / 2 + 12, ty0 + 8, {color:P.blue, size:fs});
      /* élodée */
      var ex = fx, ey = by1 - 6;
      ctx.save(); ctx.strokeStyle = "#2f7a3b"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(ex + 6, (ey + fy) / 2 + 10, ex, fy + 6); ctx.stroke(); ctx.restore();
      for (q = 0; q < 9; q++){ var sy = ey - 6 - q * (ey - fy - 10) / 9, side = q % 2 ? 1 : -1; ctx.save(); ctx.translate(ex + Math.sin(q) * 2, sy); ctx.rotate(side * 0.9); ctx.beginPath(); ctx.ellipse(side * 7, 0, 8, 2.8, 0, 0, 6.2832); ctx.fillStyle = on.value ? "#4caf5a" : "#6b8f6e"; ctx.fill(); ctx.restore(); }
      /* bulles */
      st.bub.forEach(function(b){ var y = fy + 4 - b.y * (fy + 4 - ty0 - (ty1 - ty0) * st.gas - 4), x = fx + b.x * (1 - b.y * 0.6); B4.ell(c, x, y, b.r, b.r, "rgba(255,255,255,.9)", "#5a87b5", 1); });
      /* thermomètre */
      var thx = bx + bw - 12, th0 = wy + 4, th1 = by1 - 10, tf = T.value / 45, tc = T.value > 35 ? P.red : T.value < 10 ? P.blue : P.green;
      S.draw.rrect(c, thx - 4, th0, 8, th1 - th0, 4); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; ctx.stroke();
      S.draw.rrect(c, thx - 2, th1 - (th1 - th0) * tf, 4, (th1 - th0) * tf, 2); ctx.fillStyle = tc; ctx.fill(); S.draw.dot(c, thx, th1 + 3, 5, tc);
      S.draw.label(c, S.fmt(T.value, 0) + " °C", thx - 4, th0 - 10, {color:tc, size:fs - 0.5});
      /* compteur */
      S.draw.display(c, S.fmt(bpm, 0), 56, 30, {w:84, h:44, caption:"bulles / min", size:18});
      S.draw.label(c, "lumière " + S.fmt(i, 0) + " %", 56, 66, {color:"#8a6d1a", size:fs});
      /* courbe */
      var yl1 = Math.ceil((Math.max(net(100, CO.value, T.value), net(100, 0.04, 20), 4) + 2) / 4) * 4, yl0 = -Math.max(4, Math.ceil(r + 1));
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:yl0, y1:yl1, yl:"échange net d'O₂", stepX:20, t:sh + 26, l:40, b:30});
      S.draw.text(c, "lumière reçue (%) →", ax.R, ax.B + 22, {size:10, color:"#2c3a4e", align:"right"});
      S.draw.fn(c, ax, function(x){ return net(x, 0.04, 20); }, "#b8c0cc", 2, [5, 4]);
      S.draw.area(c, ax, function(x){ return net(x, CO.value, T.value); }, 0, 100, P.green, 0.08);
      S.draw.fn(c, ax, function(x){ return net(x, CO.value, T.value); }, P.green, 3);
      S.draw.text(c, "tirets : 0,04 % CO₂, 20 °C", ax.R - 4, ax.B - 10, {size:9, color:"#8a95a3", align:"right"});
      var pm = Pm(CO.value, T.value);
      if (pm > r){ var ic = r * IK / (pm - r); if (ic <= 100){ S.draw.dot(c, ax.X(ic), ax.Y(0), 5.5, P.amber); S.draw.label(c, "compensation " + S.fmt(ic, 0) + " %", ax.X(ic) + 8, ax.Y(0) - 12, {color:P.amber, size:9.5, align:"left"}); } }
      S.draw.line(c, ax.X(i), ax.Y(0), ax.X(i), ax.Y(n), P.red, 1.5, [3, 3]); S.draw.dot(c, ax.X(i), ax.Y(n), 7.5, P.red);
      var sat = pm - r; S.draw.line(c, ax.L, ax.Y(sat), ax.R, ax.Y(sat), "rgba(36,119,90,.45)", 1.2, [2, 4]); S.draw.text(c, "plafond " + S.fmt(sat, 1), ax.R - 4, ax.Y(sat) - 8, {size:9, color:P.green, align:"right"});
      /* facteur limitant : plus grand gain en améliorant un seul facteur */
      var g1 = net(Math.min(100, i * 2 + 5), CO.value, T.value) - n, g2 = net(i, Math.min(0.15, CO.value * 2), T.value) - n, g3 = net(i, CO.value, 28) - n;
      var best = [["la lumière", g1], ["le CO₂", g2], ["la température", g3]].sort(function(a, b){ return b[1] - a[1]; })[0];
      ro.set(0, S.fmt(i, 0) + " %" + (on.value ? "" : " (éteinte)")); ro.set(1, (n >= 0 ? "+" : "") + S.fmt(n, 1)); ro.set(2, S.fmt(bpm, 0)); ro.set(3, best[1] < 0.4 ? "aucun net" : best[0].replace("la ", "").replace("le ", ""));
      var msg = n < -0.3 ? "Bilan négatif : la respiration (" + S.fmt(r, 1) + ") l'emporte sur la photosynthèse (" + S.fmt(ph, 1) + ") ; aucune bulle, la plante consomme de l'O₂." : n <= 0.3 ? "Point de compensation : photosynthèse = respiration, plus de bulles." : "La plante dégage de l'O₂ : " + S.fmt(bpm, 0) + " bulles par minute.";
      msg += " À " + dist.value + " cm, la plante reçoit (10 ÷ " + dist.value + ")² = " + S.fmt(i, 0) + " % de la lumière reçue à 10 cm.";
      if (best[1] >= 0.4) msg += " Facteur le plus limitant : <b>" + best[0] + "</b>.";
      nt.set(msg, n > 0.3 ? "ok" : "warn");
      if (st.defi){ if (!st.defi.done && st.defi.ok({bpm:bpm, net:n})){ st.defi.done = true; st.score++; }
        nd.set("<b>Défi " + st.tot + ".</b> " + st.defi.txt + (st.defi.done ? " <b>Réussi !</b>" + (st.defi.sol ? " (" + st.defi.sol + ")" : "") : "") + " Score : " + st.score + " / " + st.tot + ".", st.defi.done ? "ok" : "warn"); }
      else nd.set("Clique « Défi suivant » pour un objectif chiffré.", "");
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
