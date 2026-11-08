/* Chimie BA1 · c02 · Liaison, mésomérie et hybridation — contenu SFA original */
(function(){
var H_NAMES = {2:"sp", 3:"sp²", 4:"sp³"};

/* ---------- 1. Hybridation : comptage σ / π ---------- */
/* atomes : [symbole, x, y, doublets non liants] ; liaisons : [i, j, ordre] */
var MOL = {
  ethane:{nom:"Éthane C₂H₆", at:[["C",0.38,0.5,0],["C",0.62,0.5,0],["H",0.2,0.3,0],["H",0.2,0.7,0],["H",0.3,0.15,0],["H",0.8,0.3,0],["H",0.8,0.7,0],["H",0.7,0.85,0]], b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[1,7,1]]},
  ethene:{nom:"Éthène C₂H₄", at:[["C",0.4,0.5,0],["C",0.6,0.5,0],["H",0.25,0.25,0],["H",0.25,0.75,0],["H",0.75,0.25,0],["H",0.75,0.75,0]], b:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]},
  ethyne:{nom:"Éthyne C₂H₂", at:[["C",0.4,0.5,0],["C",0.6,0.5,0],["H",0.2,0.5,0],["H",0.8,0.5,0]], b:[[0,1,3],[0,2,1],[1,3,1]]},
  propene:{nom:"Propène CH₃–CH=CH₂", at:[["C",0.3,0.55,0],["C",0.5,0.4,0],["C",0.7,0.55,0],["H",0.3,0.85,0],["H",0.12,0.4,0],["H",0.4,0.1,0],["H",0.5,0.7,0],["H",0.88,0.4,0],["H",0.75,0.85,0]],
          b:[[0,1,1],[1,2,2],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[2,7,1],[2,8,1]]},
  benzene:{nom:"Benzène C₆H₆ (Kekulé)", at:[["C",0.5,0.2,0],["C",0.68,0.3,0],["C",0.68,0.5,0],["C",0.5,0.6,0],["C",0.32,0.5,0],["C",0.32,0.3,0],["H",0.5,0.05,0],["H",0.82,0.2,0],["H",0.82,0.6,0],["H",0.5,0.78,0],["H",0.18,0.6,0],["H",0.18,0.2,0]],
          b:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[1,7,1],[2,8,1],[3,9,1],[4,10,1],[5,11,1]]},
  methanal:{nom:"Méthanal H₂C=O", at:[["C",0.45,0.5,0],["O",0.68,0.5,2],["H",0.3,0.25,0],["H",0.3,0.75,0]], b:[[0,1,2],[0,2,1],[0,3,1]]},
  hcn:{nom:"Cyanure d'hydrogène HC≡N", at:[["H",0.2,0.5,0],["C",0.45,0.5,0],["N",0.7,0.5,1]], b:[[0,1,1],[1,2,3]]},
  acetique:{nom:"Acide éthanoïque CH₃COOH", at:[["C",0.25,0.55,0],["C",0.47,0.45,0],["O",0.47,0.15,2],["O",0.68,0.6,2],["H",0.82,0.45,0],["H",0.1,0.35,0],["H",0.15,0.8,0],["H",0.35,0.85,0]], b:[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[0,5,1],[0,6,1],[0,7,1]]},
  acetamide:{nom:"Éthanamide CH₃CONH₂", at:[["C",0.25,0.55,0],["C",0.47,0.45,0],["O",0.47,0.15,2],["N",0.68,0.6,1],["H",0.82,0.45,0],["H",0.78,0.85,0],["H",0.1,0.35,0],["H",0.15,0.8,0],["H",0.35,0.85,0]], b:[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[3,5,1],[0,6,1],[0,7,1],[0,8,1]], conj:[3]}
};
var COL = {2:"#b45309", 3:"#1e3f8f", 4:"#2e6b55"};
SFA.sim({
  id:"uc-c02-hybridation", ch:"c02", tag:"Liaison",
  titre:"Hybridation sp, sp², sp³ : compter les liaisons σ et π",
  resume:"Pour 9 molécules, l'hybridation de chaque atome se déduit du nombre de voisins et de doublets non liants ; compte les σ et les π.",
  but:"Choisis une molécule : chaque atome lourd est coloré selon son hybridation (nombre de voisins σ + doublets libres). Clique sur un atome pour voir ses orbitales : les hybrides (σ ou doublet) et les orbitales p restantes qui font les π.",
  aRetenir:"Nombre stérique = voisins + doublets non liants : 2 → sp (180°), 3 → sp² (120°), 4 → sp³ (109,5°). Une liaison simple est une σ ; une double = 1 σ + 1 π ; une triple = 1 σ + 2 π. Les π se forment par recouvrement latéral des orbitales p non hybridées (une par π).",
  piege:"Dans un amide (ou un ester, ou un énol), l'atome N (ou O) porteur d'un doublet est hybridé sp² et non sp³ : son doublet est délocalisé (conjugué) avec la liaison π voisine. Le simple comptage donne sp³ : c'est l'une des rares exceptions à signaler. Une π n'est jamais une liaison entre deux atomes pas déjà liés par une σ.",
  build:function(k, S){
    var c = k.canvas(440);
    var st = {sel:-1}, hit = [];
    var ms = k.select("Molécule", Object.keys(MOL).map(function(m){ return [m, MOL[m].nom]; }), "ethene", function(){ st.sel = -1; });
    var tp = k.toggle("Montrer les orbitales p non hybridées et le nuage π", true);
    var ro = k.readouts(["Liaisons σ", "Liaisons π", "Atomes sp / sp² / sp³", "Atome (exception)"]);
    var nt = k.note("", "ok");
    c.pointer(function(type, p){
      if (type !== "down") return;
      var best = -1, bd = 30; hit.forEach(function(h){ var d = Math.hypot(p.x - h.x, p.y - h.y); if (d < bd){ bd = d; best = h.i; } });
      if (best >= 0){ st.sel = best; k.redraw(); }
    });
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, m = MOL[ms.value], W = c.W, H = c.H, ph = W < 420;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var Hm = Math.round(H * 0.56);
      var n = m.at.length, deg = [], pi = 0, sig = m.b.length, hyb = [], pis = [];
      for (var i = 0; i < n; i++){ deg.push(0); pis.push(0); }
      m.b.forEach(function(b){ deg[b[0]]++; deg[b[1]]++; pi += b[2] - 1; pis[b[0]] += b[2] - 1; pis[b[1]] += b[2] - 1; });
      var counts = {2:0, 3:0, 4:0}, exc = "—";
      function X(v){ return 24 + v * (W - 48); } function Y(v){ return 26 + v * (Hm - 56); }
      m.at.forEach(function(a, i){ if (a[0] !== "H"){ var real = deg[i] + a[3]; if (m.conj && m.conj.indexOf(i) >= 0) real = 3; hyb[i] = Math.min(4, real); } });
      if (st.sel < 0 || !m.at[st.sel] || m.at[st.sel][0] === "H"){ st.sel = 0; for (var q0 = 0; q0 < n; q0++) if (m.at[q0][0] !== "H" && pis[q0]){ st.sel = q0; break; } }
      /* nuage π : bandes translucides au-dessus et en dessous des liaisons multiples */
      if (tp.value) m.b.forEach(function(b){
        if (b[2] < 2) return; var p = m.at[b[0]], q = m.at[b[1]]; if (p[0] === "H" || q[0] === "H") return;
        var x1 = X(p[1]), y1 = Y(p[2]), x2 = X(q[1]), y2 = Y(q[2]), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1), an = Math.atan2(y2 - y1, x2 - x1);
        [-1, 1].forEach(function(sg){ ctx.save(); ctx.translate(mx, my); ctx.rotate(an); ctx.beginPath(); ctx.ellipse(0, sg * 15, L / 2 + 8, 11, 0, 0, 7); ctx.fillStyle = sg < 0 ? "rgba(47,127,209,.22)" : "rgba(214,57,47,.2)"; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = sg < 0 ? "rgba(47,127,209,.6)" : "rgba(214,57,47,.55)"; ctx.stroke(); ctx.restore(); });
      });
      m.b.forEach(function(b){
        var p = m.at[b[0]], q = m.at[b[1]], dx = X(q[1]) - X(p[1]), dy = Y(q[2]) - Y(p[2]), L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
        for (var o = 0; o < b[2]; o++){ var off = (o - (b[2] - 1) / 2) * 7; UC.stick(ctx, X(p[1]) + nx * off, Y(p[2]) + ny * off, X(q[1]) + nx * off, Y(q[2]) + ny * off, o === 0 ? 5 : 3, o === 0 ? "#8a95a3" : "#c0321d"); }
      });
      hit = [];
      m.at.forEach(function(a, i){
        var x = X(a[1]), y = Y(a[2]);
        if (a[0] === "H"){ UC.ball(ctx, x, y, 10, "#eef2f7"); S.draw.text(c, "H", x, y + 0.5, {size:11, color:P.ink}); return; }
        var real = hyb[i], isConj = m.conj && m.conj.indexOf(i) >= 0;
        if (isConj) exc = a[0] + " (sp², doublet délocalisé)";
        counts[Math.min(4, real)]++;
        hit.push({i:i, x:x, y:y});
        if (i === st.sel){ ctx.save(); ctx.strokeStyle = P.amber; ctx.lineWidth = 3; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.arc(x, y, 25, 0, 7); ctx.stroke(); ctx.restore(); }
        UC.ball(ctx, x, y, 17, COL[real] || P.grey);
        S.draw.text(c, a[0], x, y + 0.5, {size:14, color:"#fff"});
        S.draw.label(c, H_NAMES[real] || "", x, y + 31, {size:11, color:COL[real]});
        for (var d = 0; d < a[3]; d++){ var ang = -Math.PI / 2 + (d - (a[3] - 1) / 2) * 0.9 + (a[3] === 1 ? 0.8 : 0); S.draw.dot(c, x + Math.cos(ang) * 26, y + Math.sin(ang) * 26 - 6, 2.5, P.ink); S.draw.dot(c, x + Math.cos(ang) * 31, y + Math.sin(ang) * 31 - 6, 2.5, P.ink); }
        if (tp.value){
          var np = real === 2 ? 2 : real === 3 ? 1 : 0;
          for (var s = 0; s < np; s++){
            if (s === 0){ UC.lobe(ctx, x, y - 4, -Math.PI / 2, 24, 8, "#2f7fd1", 0.5); UC.lobe(ctx, x, y + 4, Math.PI / 2, 24, 8, "#d6392f", 0.5); }
            else { ctx.save(); ctx.beginPath(); ctx.ellipse(x + 9, y - 9, 14, 5, -0.6, 0, 7); ctx.fillStyle = "rgba(47,127,209,.30)"; ctx.fill(); ctx.strokeStyle = "rgba(47,127,209,.6)"; ctx.stroke(); ctx.beginPath(); ctx.ellipse(x - 9, y + 9, 14, 5, -0.6, 0, 7); ctx.fillStyle = "rgba(214,57,47,.28)"; ctx.fill(); ctx.strokeStyle = "rgba(214,57,47,.55)"; ctx.stroke(); ctx.restore(); }
          }
        }
      });
      S.draw.text(c, "clique sur un atome", W - 10, 14, {size:10.5, color:P.grey, align:"right", weight:700});
      /* panneau de l'atome choisi : orbitales */
      var a = m.at[st.sel], h = hyb[st.sel], d0 = deg[st.sel], lp0 = a[3], conj = m.conj && m.conj.indexOf(st.sel) >= 0, py0 = Hm + 4, ph2 = H - py0 - 8;
      S.draw.panel(c, 8, py0, W - 16, ph2, {shadow:false, title:"Orbitales de l'atome " + a[0] + " (n° " + (st.sel + 1) + ")"});
      var hy = py0 + 40, bxs = 18, bw2 = 34, bh2 = 26, nh = h, np2 = 4 - h, col = COL[h];
      var lbls = [], z; for (z = 0; z < nh; z++) lbls.push(z < d0 ? "σ" : "••");
      var pl = []; var picount = pis[st.sel]; for (z = 0; z < np2; z++) pl.push(z < picount ? "π" : (conj && z === 0 ? "••" : ""));
      S.draw.text(c, "2s + 3×2p  →  " + nh + " hybrides " + H_NAMES[h] + (np2 ? " + " + np2 + " p" : ""), bxs, hy - 2, {size:11.5, align:"left", color:col, weight:800});
      var rowY = hy + 12, per = Math.floor((W - 16 - bxs) / (bw2 + 6));
      lbls.forEach(function(t, i){ var bx = bxs + i * (bw2 + 6); ctx.save(); ctx.fillStyle = UC.rgba(col, 0.15); ctx.strokeStyle = col; ctx.lineWidth = 2; S.draw.rrect(c, bx, rowY, bw2, bh2, 6); ctx.fill(); ctx.stroke(); ctx.restore(); S.draw.text(c, t, bx + bw2 / 2, rowY + bh2 / 2 + 0.5, {size:t === "σ" ? 15 : 12, color:col, weight:800}); });
      pl.forEach(function(t, i){ var bx = bxs + (nh + i) * (bw2 + 6) + 6; ctx.save(); ctx.fillStyle = "rgba(192,50,29,.08)"; ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2; S.draw.rrect(c, bx, rowY, bw2, bh2, 6); ctx.fill(); ctx.stroke(); ctx.restore(); S.draw.text(c, t || "p", bx + bw2 / 2, rowY + bh2 / 2 + 0.5, {size:t === "π" ? 15 : 12, color:"#c0321d", weight:800}); });
      var info = d0 + " voisin" + (d0 > 1 ? "s" : "") + " + " + lp0 + " doublet" + (lp0 > 1 ? "s" : "") + " = " + (d0 + lp0) + (conj ? " → compté sp³, réel sp² (doublet dans la p)" : " → " + H_NAMES[h]);
      S.draw.text(c, info, bxs, rowY + bh2 + 20, {size:11.5, align:"left", color:P.ink, weight:700});
      S.draw.text(c, "σ : hybride en liaison · •• : doublet libre · π : orbitale p", bxs, rowY + bh2 + 38, {size:10, align:"left", color:P.grey, weight:600});
      /* petit schéma des lobes à droite si la place le permet */
      var lx = W - 78, ly = py0 + ph2 - 36, dirs = h === 2 ? [[1, 0], [-1, 0]] : h === 3 ? [[0, -1], [0.87, 0.5], [-0.87, 0.5]] : [[0, -1], [0.9, 0.45], [-0.9, 0.45], [0.25, 0.3]];
      if (!ph){ ly = py0 + ph2 - 52; dirs.forEach(function(v, i){ var L = i === 3 ? 20 : 34; UC.lobe(ctx, lx, ly, Math.atan2(v[1], v[0]), L, 9, col, 0.5); }); UC.ball(ctx, lx, ly, 5, col); }
      ro.set(0, String(sig)); ro.set(1, String(pi));
      ro.set(2, counts[2] + " / " + counts[3] + " / " + counts[4]);
      ro.set(3, exc);
      var note = "σ = " + sig + " ; π = " + pi + " ; orbitales p non hybridées utilisées : " + pi + ".";
      if (ms.value === "benzene") note += " Les 6 C sont sp² : les 3 π (Kekulé) se délocalisent en un nuage π unique au-dessus et au-dessous du cycle.";
      if (ms.value === "acetamide") note += " Le N a 3 voisins et 1 doublet : le comptage donne sp³, mais l'amide est plan et le doublet de N est conjugué avec C=O : on le considère sp².";
      if (ms.value === "acetique") note += " L'oxygène de OH a 2 voisins et 2 doublets (sp³ au comptage) ; l'O de C=O a 1 voisin et 2 doublets (sp²).";
      nt.set(note, ms.value === "acetamide" ? "warn" : "ok");
    });
  }
});

/* ---------- 2. Mésomérie : poids des structures limites ---------- */
var MES = {
  acetate:{nom:"Ion éthanoate CH₃COO⁻", eq:true, nstr:2,
    at:[["CH₃",0.2,0.5],["C",0.45,0.5],["O",0.68,0.25],["O",0.68,0.75]],
    bonds:[[0,1,[1,1]],[1,2,[2,1]],[1,3,[1,2]]], ch:[[0,0],[0,0],[0,-1],[-1,0]]},
  nitrate:{nom:"Ion nitrate NO₃⁻", eq:true, nstr:3,
    at:[["N",0.45,0.5],["O",0.45,0.12],["O",0.78,0.68],["O",0.12,0.68]],
    bonds:[[0,1,[2,1,1]],[0,2,[1,2,1]],[0,3,[1,1,2]]], ch:[[1,1,1],[0,-1,-1],[-1,0,-1],[-1,-1,0]]},
  carbonate:{nom:"Ion carbonate CO₃²⁻", eq:true, nstr:3,
    at:[["C",0.45,0.5],["O",0.45,0.12],["O",0.78,0.68],["O",0.12,0.68]],
    bonds:[[0,1,[2,1,1]],[0,2,[1,2,1]],[0,3,[1,1,2]]], ch:[[0,0,0],[0,-1,-1],[-1,0,-1],[-1,-1,0]]},
  ozone:{nom:"Ozone O₃", eq:true, nstr:2,
    at:[["O",0.2,0.65],["O",0.5,0.35],["O",0.8,0.65]],
    bonds:[[0,1,[2,1]],[1,2,[1,2]]], ch:[[0,-1],[1,1],[-1,0]]},
  benzene:{nom:"Benzène (deux formes de Kekulé)", eq:true, nstr:2, ring:true,
    at:[["C",0.5,0.12],["C",0.78,0.3],["C",0.78,0.65],["C",0.5,0.85],["C",0.22,0.65],["C",0.22,0.3]],
    bonds:[[0,1,[2,1]],[1,2,[1,2]],[2,3,[2,1]],[3,4,[1,2]],[4,5,[2,1]],[5,0,[1,2]]], ch:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]},
  enolate:{nom:"Ion énolate CH₂=CH–O⁻", eq:false, nstr:2, w1:"Poids de la forme avec C=C et charge sur O",
    at:[["CH₂",0.2,0.6],["CH",0.5,0.4],["O",0.8,0.6]],
    bonds:[[0,1,[2,1]],[1,2,[1,2]]], ch:[[0,-1],[0,0],[-1,0]]},
  amide:{nom:"Éthanamide : O=C–NH₂", eq:false, nstr:2, w1:"Poids de la forme neutre O=C–N",
    at:[["CH₃",0.15,0.6],["C",0.42,0.45],["O",0.62,0.15],["N",0.72,0.7]],
    bonds:[[0,1,[1,1]],[1,2,[2,1]],[1,3,[1,2]]], ch:[[0,0],[0,0],[0,-1],[0,1]]}
};
SFA.sim({
  id:"uc-c02-mesomerie", ch:"c02", tag:"Liaison",
  titre:"Mésomérie : structures limites et hybride de résonance",
  resume:"Fais varier le poids des structures limites : ordres de liaison moyens et charges partielles se mettent à jour.",
  but:"Choisis une espèce délocalisée. Les structures limites s'affichent en haut, l'hybride (moyenne pondérée des ordres de liaison et des charges formelles) en bas. Pour les espèces non symétriques, règle le poids de la structure principale.",
  aRetenir:"L'hybride n'est pas un équilibre entre structures : une seule espèce, dont les ordres de liaison et les charges sont des moyennes pondérées. Poids plus élevé : structure avec le plus de liaisons, octets complets, charges négatives sur l'atome le plus électronégatif, séparation de charges minimale. Les structures limites ne diffèrent que par la place des électrons (jamais des noyaux).",
  piege:"La double flèche ↔ n'est pas celle de l'équilibre ⇌. Dans les espèces à structures équivalentes (éthanoate, nitrate, carbonate, benzène, ozone), les poids sont égaux par symétrie. Les poids du curseur pour l'énolate et l'amide sont des ordres de grandeur pédagogiques, non des valeurs mesurées.",
  build:function(k, S){
    var c = k.canvas(420);
    var sp = k.select("Espèce", Object.keys(MES).map(function(m){ return [m, MES[m].nom]; }), "acetate");
    var w = k.slider("Poids de la 1ʳᵉ structure (espèces non symétriques)", 0.05, 0.95, 0.05, 0.65, "");
    var ro = k.readouts(["Liaison 1", "Liaison 2", "Charge atome A", "Charge atome B"]);
    var nt = k.note("", "ok");
    function drawStruct(m, idx, ox, oy, sw, sh, weights, hybrid){
      var P = S.draw.palette, ctx = c.ctx;
      function X(v){ return ox + v * sw; } function Y(v){ return oy + v * sh; }
      m.bonds.forEach(function(b){
        var p = m.at[b[0]], q = m.at[b[1]], ord = hybrid ? b[2].reduce(function(s, o, i){ return s + o * weights[i]; }, 0) : b[2][idx];
        var dx = X(q[1]) - X(p[1]), dy = Y(q[2]) - Y(p[2]), L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
        var full = Math.floor(ord + 1e-9), frac = ord - full;
        if (hybrid){
          var nline = Math.ceil(ord - 1e-9);
          for (var o = 0; o < nline; o++){ var off = (o - (nline - 1) / 2) * 5; S.draw.line(c, X(p[1]) + nx * off, Y(p[2]) + ny * off, X(q[1]) + nx * off, Y(q[2]) + ny * off, P.ink, 2.2, (o === nline - 1 && frac > 0.02) ? [5,4] : null); }
          S.draw.text(c, S.fmt(ord, 2), (X(p[1]) + X(q[1])) / 2 - ny * 14 * -1, (Y(p[2]) + Y(q[2])) / 2 + nx * 14 * -1 - 2, {size:11, color:P.red, bg:"#fff"});
        } else {
          for (var o2 = 0; o2 < ord; o2++){ var off2 = (o2 - (ord - 1) / 2) * 5; S.draw.line(c, X(p[1]) + nx * off2, Y(p[2]) + ny * off2, X(q[1]) + nx * off2, Y(q[2]) + ny * off2, P.ink, 2.2); }
        }
      });
      m.at.forEach(function(a, i){
        var q = hybrid ? m.ch[i].reduce(function(s, v, j){ return s + v * weights[j]; }, 0) : m.ch[i][idx];
        S.draw.dot(c, X(a[1]), Y(a[2]), 13, "#fff"); S.draw.text(c, a[0], X(a[1]), Y(a[2]), {size:14});
        if (Math.abs(q) > 0.01){ S.draw.text(c, hybrid ? (q > 0 ? "δ+" : "δ−") + " " + S.fmt(Math.abs(q), 2) : (q > 0 ? "+" : "−"), X(a[1]) + 17, Y(a[2]) - 15, {size:11, color:q > 0 ? P.red : P.acc, align:"left"}); }
      });
    }
    k.draw(function(){
      var P = S.draw.palette, m = MES[sp.value], W = c.W, H = c.H, n = m.nstr;
      c.clear();
      var wt = [];
      if (m.eq){ for (var i = 0; i < n; i++) wt.push(1 / n); }
      else wt = [w.value, 1 - w.value];
      var cw = (W - 20) / n;
      for (var s = 0; s < n; s++){
        drawStruct(m, s, 10 + s * cw + 10, 28, cw - 40, 120, wt, false);
        S.draw.text(c, "Structure " + (s + 1) + " (poids " + S.fmt(wt[s], 2) + ")", 10 + s * cw + cw / 2, 18, {size:11, color:P.grey});
        if (s < n - 1) S.draw.text(c, "↔", 10 + (s + 1) * cw, 90, {size:20, color:P.ink});
      }
      S.draw.line(c, 10, 180, W - 10, 180, P.light, 1.5);
      S.draw.text(c, "Hybride de résonance (moyenne pondérée)", W / 2, 196, {size:12, color:P.ink});
      drawStruct(m, 0, W / 2 - 150, 214, 300, 180, wt, true);
      /* on affiche les liaisons et les atomes dont l'ordre ou la charge change d'une structure à l'autre */
      var vb = m.bonds.filter(function(b){ return b[2].some(function(o){ return o !== b[2][0]; }); });
      if (vb.length < 2) vb = vb.concat(m.bonds.filter(function(b){ return vb.indexOf(b) < 0; })).slice(0, 2);
      var chg = m.ch.map(function(a){ return a.reduce(function(s2, v, i){ return s2 + v * wt[i]; }, 0); });
      var va = [];
      m.ch.forEach(function(a, i){ if (a.some(function(v){ return v !== 0; })) va.push(i); });
      for (var i2 = 0; va.length < 2 && i2 < m.at.length; i2++) if (va.indexOf(i2) < 0) va.push(i2);
      vb.slice(0, 2).forEach(function(b, j){
        var ord = b[2].reduce(function(s2, o, i){ return s2 + o * wt[i]; }, 0);
        ro.set(j, m.at[b[0]][0] + "–" + m.at[b[1]][0] + " : " + S.fmt(ord, 2));
      });
      ro.set(2, m.at[va[0]][0] + " : " + S.fmt(chg[va[0]], 2)); ro.set(3, m.at[va[1]][0] + " : " + S.fmt(chg[va[1]], 2));
      var tot = chg.reduce(function(a, b){ return a + b; }, 0);
      nt.set((m.eq ? "Structures équivalentes : poids égaux par symétrie, le curseur n'a pas d'effet. " : "Plus le poids de la structure 1 augmente, plus l'hybride lui ressemble : " + (sp.value === "amide" ? "C–N se rapproche d'une simple liaison et les charges partielles de O et N diminuent." : "la charge se concentre sur O et la liaison C–C se rapproche d'une double.") + " ") + "Charge totale : " + S.fmt(tot, 2) + " (la somme des charges formelles est conservée).", "ok");
    });
  }
});

/* ---------- 3. Ordre, longueur, énergie de liaison ---------- */
var BD = {
  CC:{nom:"C–C", v:[[1,154,347],[2,134,614],[3,120,839]]},
  CN:{nom:"C–N", v:[[1,147,305],[2,127,615],[3,116,891]]},
  CO:{nom:"C–O", v:[[1,143,358],[2,120,745]]},
  NN:{nom:"N–N", v:[[1,145,160],[2,125,418],[3,110,945]]},
  OO:{nom:"O–O", v:[[1,148,146],[2,121,498]]}
};
SFA.sim({
  id:"uc-c02-ordre-longueur-energie", ch:"c02", tag:"Liaison",
  titre:"Ordre de liaison, longueur et énergie",
  resume:"Plus l'ordre de liaison augmente, plus la liaison est courte et forte. Mais la 2ᵉ liaison (π) apporte moins d'énergie que la 1ʳᵉ (σ).",
  but:"Choisis un couple d'atomes et un ordre de liaison : place le point sur le graphique longueur–énergie et lis l'énergie apportée par chaque liaison supplémentaire.",
  aRetenir:"Ordre ↑ ⇒ longueur ↓ et énergie ↑. L'énergie d'une double liaison est inférieure à 2 fois celle d'une simple : la liaison π (recouvrement latéral) est plus faible que la σ (recouvrement axial). C'est pourquoi les alcènes réagissent par addition en ouvrant la π (≈ 270 kJ/mol).",
  piege:"Ces valeurs sont des moyennes de tables (± quelques %), pas des constantes exactes : elles varient avec l'environnement de la liaison. L'énergie de liaison est l'énergie nécessaire pour la rompre en phase gazeuse : elle se compte en kJ/mol de liaisons rompues.",
  build:function(k, S){
    var c = k.canvas(360);
    var ps = k.select("Couple d'atomes", Object.keys(BD).map(function(b){ return [b, BD[b].nom]; }), "CC");
    var od = k.seg("Ordre de liaison", [[1,"simple"],[2,"double"],[3,"triple"]], 1);
    var ro = k.readouts(["Longueur", "Énergie", "Gain par liaison supplémentaire", "E / E(simple)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, bd = BD[ps.value], o = +od.value, cur = bd.v.filter(function(v){ return v[0] === o; })[0];
      c.clear();
      var ax = S.draw.axes(c, {x0:100, x1:160, y0:0, y1:1000, xl:"longueur (pm)", yl:"énergie (kJ/mol)", stepX:10, stepY:200});
      var cols = {CC:P.acc, CN:P.green, CO:P.red, NN:P.violet, OO:P.amber};
      Object.keys(BD).forEach(function(key){
        var ctx = c.ctx; ctx.save(); ctx.strokeStyle = cols[key]; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.5; ctx.beginPath();
        BD[key].v.forEach(function(v, i){ var x = ax.X(v[1]), y = ax.Y(v[2]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
        BD[key].v.forEach(function(v){ S.draw.dot(c, ax.X(v[1]), ax.Y(v[2]), key === ps.value && v[0] === o ? 9 : 4, key === ps.value && v[0] === o ? P.red : cols[key]); });
        var last = BD[key].v[0]; S.draw.text(c, BD[key].nom, ax.X(last[1]) + 6, ax.Y(last[2]) - 12, {size:11, color:cols[key], align:"left"});
      });
      if (!cur){
        ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set("La liaison " + bd.nom + " n'existe pas avec un ordre " + o + " dans ce tableau (O≡O n'existe pas ; C≡O existe dans le monoxyde de carbone, ≈ 113 pm et 1 072 kJ/mol, mais ce n'est pas une valeur moyenne de table).", "warn"); return;
      }
      var prev = bd.v.filter(function(v){ return v[0] === o - 1; })[0], g = prev ? cur[2] - prev[2] : cur[2];
      var s = bd.v[0];
      ro.set(0, cur[1] + " pm"); ro.set(1, cur[2] + " kJ/mol"); ro.set(2, (prev ? "+" : "") + g + " kJ/mol"); ro.set(3, S.fmt(cur[2] / s[2], 2));
      nt.set(prev ? ("Passer de l'ordre " + (o - 1) + " à " + o + " raccourcit la liaison de " + (prev[1] - cur[1]) + " pm et ajoute " + g + " kJ/mol, soit " + S.fmt(g / s[2] * 100, 0) + " % de l'énergie de la simple liaison (π moins forte que σ).") : "Liaison simple σ : référence de comparaison.", "ok");
    });
  }
});

/* ---------- 4. Orbitales moléculaires des diatomiques de la 2ᵉ période ---------- */
var OMS = [["li2","Li₂",2,"inv"],["be2","Be₂",4,"inv"],["b2","B₂",6,"inv"],["c2","C₂",8,"inv"],["n2p","N₂⁺",9,"inv"],["n2","N₂",10,"inv"],["o2p","O₂⁺",11,"norm"],["o2","O₂",12,"norm"],["o2m","O₂⁻ (superoxyde)",13,"norm"],["o2mm","O₂²⁻ (peroxyde)",14,"norm"],["f2","F₂",14,"norm"],["ne2","Ne₂",16,"norm"]];
SFA.sim({
  id:"uc-c02-om-diatomiques", ch:"c02", tag:"Orbitales",
  titre:"Orbitales moléculaires des diatomiques : ordre de liaison et magnétisme",
  resume:"Remplis le diagramme d'OM (Pauli, Hund, énergie croissante) : l'ordre de liaison et le paramagnétisme apparaissent.",
  but:"Choisis une molécule ou un ion diatomique de la 2ᵉ période. Les électrons de valence (2s, 2p) remplissent les OM ; observe l'inversion σ₂p/π₂p avant O₂ et le nombre d'électrons célibataires.",
  aRetenir:"Ordre de liaison = (électrons liants − électrons antiliants)/2. Jusqu'à N₂ : π₂p sous σ₂p ; à partir de O₂ : σ₂p sous π₂p. O₂ (12 e⁻ de valence) a deux électrons célibataires dans les π*₂p : il est paramagnétique, ce que la structure de Lewis seule ne prédit pas. B₂ aussi est paramagnétique, C₂ ne l'est pas.",
  piege:"On ne compte que les électrons de valence : les OM 1s liante et antiliante se compensent. Une même charge ne détermine pas toujours l'ordre des OM : l'inversion dépend du mélange s–p et donc de l'atome ; ici on a pris N₂⁺ avec l'ordre de N₂ et O₂⁺ avec celui de O₂.",
  build:function(k, S){
    var c = k.canvas(400);
    var ms = k.select("Espèce", OMS.map(function(o){ return [o[0], o[1] + " (" + o[2] + " e⁻ de valence)"]; }), "o2");
    var ro = k.readouts(["Électrons liants", "Électrons antiliants", "Ordre de liaison", "Électrons célibataires", "Magnétisme"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, sp = OMS.filter(function(o){ return o[0] === ms.value; })[0], ne = sp[2];
      c.clear();
      var inv = sp[3] === "inv";
      var sets = inv
        ? [["σ₂s",1,"b"],["σ*₂s",1,"a"],["π₂p",2,"b"],["σ₂p",1,"b"],["π*₂p",2,"a"],["σ*₂p",1,"a"]]
        : [["σ₂s",1,"b"],["σ*₂s",1,"a"],["σ₂p",1,"b"],["π₂p",2,"b"],["π*₂p",2,"a"],["σ*₂p",1,"a"]];
      var rest = ne, nb = 0, na = 0, unp = 0, occ = [];
      sets.forEach(function(s){ var cap = 2 * s[1], e = Math.min(cap, rest); rest -= e; occ.push(e); if (s[2] === "b") nb += e; else na += e; var up = Math.min(e, s[1]), dn = Math.max(0, e - s[1]); unp += up - dn; });
      var energyY = [0, 1, 2, 3, 4, 5].map(function(i){ return H - 40 - i * ((H - 80) / 5.4); });
      var cx = W * 0.5, bw = 38;
      S.draw.text(c, "énergie ↑", 40, 16, {size:11, color:P.grey});
      /* AO */
      var ym2s = H - 40 - 0.5 * ((H - 80) / 5.4), ym2p = H - 40 - 3.2 * ((H - 80) / 5.4);
      [[cx - 190, "A"], [cx + 190, "B"]].forEach(function(p){
        S.draw.line(c, p[0] - 22, ym2s, p[0] + 22, ym2s, P.grey, 2); S.draw.text(c, "2s", p[0], ym2s + 12, {size:11, color:P.grey});
        for (var q = 0; q < 3; q++) S.draw.line(c, p[0] - 40 + q * 28, ym2p, p[0] - 40 + q * 28 + 24, ym2p, P.grey, 2);
        S.draw.text(c, "2p", p[0], ym2p + 12, {size:11, color:P.grey});
      });
      sets.forEach(function(s, i){
        var y = energyY[i], col = s[2] === "b" ? P.green : P.red;
        for (var d = 0; d < s[1]; d++){
          var x0 = cx - (s[1] * (bw + 8)) / 2 + d * (bw + 8);
          S.draw.line(c, x0, y, x0 + bw, y, col, 3);
          var upv = occ[i] > d, dnv = occ[i] > d + s[1];
          if (upv) S.draw.arrow(c, x0 + bw * 0.3, y - 2, x0 + bw * 0.3, y - 20, P.ink, 2);
          if (dnv) S.draw.arrow(c, x0 + bw * 0.7, y - 20, x0 + bw * 0.7, y - 2, P.ink, 2);
        }
        S.draw.text(c, s[0], cx + (s[1] * (bw + 8)) / 2 + 30, y, {size:12, color:col, align:"left"});
      });
      var bo = (nb - na) / 2;
      ro.set(0, String(nb)); ro.set(1, String(na)); ro.set(2, S.fmt(bo, 1)); ro.set(3, String(unp));
      ro.set(4, unp > 0 ? "paramagnétique" : "diamagnétique");
      nt.set("Ordre de liaison = (" + nb + " − " + na + ")/2 = " + S.fmt(bo, 1) + (bo <= 0 ? " : aucune liaison, la molécule n'est pas stable." : ".") + " " + (inv ? "Ordre d'énergie avec π₂p sous σ₂p (mélange s–p)." : "Ordre d'énergie avec σ₂p sous π₂p.") + (unp > 0 ? " " + unp + " électron(s) célibataire(s) : attiré(e) par un aimant." : ""), bo <= 0 ? "warn" : "ok");
    });
  }
});

/* ---------- 5. Électronégativité et caractère ionique ---------- */
var CHI = {H:2.20,Li:0.98,Na:0.93,K:0.82,Mg:1.31,Ca:1.00,Al:1.61,Si:1.90,C:2.55,P:2.19,N:3.04,S:2.58,Br:2.96,Cl:3.16,O:3.44,F:3.98,I:2.66};
SFA.sim({
  id:"uc-c02-electronegativite", ch:"c02", tag:"Liaison",
  titre:"Électronégativité, polarité de liaison et caractère ionique",
  resume:"Choisis deux éléments : Δχ (Pauling) classe la liaison (covalente, polaire, ionique) et estime son pourcentage de caractère ionique.",
  but:"Clique sur deux barres du diagramme (une pour A, puis une pour B) ou utilise les listes : le doublet de liaison se déplace vers l'atome le plus électronégatif. Lis Δχ, le type de liaison et le pourcentage ionique de Pauling.",
  aRetenir:"Δχ &lt; 0,4 : covalente (≈ apolaire) ; 0,4–1,7 : covalente polaire ; &gt; 1,7 : ionique (convention). Pauling : % ionique ≈ 100·[1 − exp(−Δχ²/4)]. Le dipôle de liaison pointe du pôle δ+ vers le pôle δ−, vers l'atome le plus électronégatif.",
  piege:"Il n'y a pas de frontière nette entre liaison polaire et ionique : un solide comme NaCl n'est pas à 100 % ionique ni HF à 0 %. La formule de Pauling est une estimation : pour HF elle donne ≈ 55 % alors que la valeur déduite du moment dipolaire mesuré est ≈ 41 %.",
  build:function(k, S){
    var c = k.canvas(470);
    var keys = Object.keys(CHI).sort(function(p, q){ return CHI[p] - CHI[q]; });
    var RC = {H:31, Li:128, Na:166, K:203, Mg:141, Ca:176, Al:121, Si:111, C:76, P:107, N:71, S:105, Br:120, Cl:102, O:66, F:57, I:139};
    var EC = {H:"#e6ebf2", C:"#4b5563", N:"#2f5fb3", O:"#d6392f", F:"#5fb85a", Cl:"#2fa84f", Br:"#9a2a1c", I:"#7b3fb0", S:"#d9b61c", P:"#e08a2a", Li:"#a78bfa", Na:"#8b6fd6", K:"#7c5cc4", Mg:"#6aa5a0", Ca:"#8fb98f", Al:"#9aa5b1", Si:"#8b7d6b"};
    var a = k.select("Élément A", keys.map(function(e){ return [e, e + " (χ = " + S.fmt(CHI[e], 2) + ")"]; }), "H");
    var b = k.select("Élément B", keys.map(function(e){ return [e, e + " (χ = " + S.fmt(CHI[e], 2) + ")"]; }), "F");
    k.seg("Paires classiques", [["H-H","H–H"],["C-H","C–H"],["O-H","O–H"],["H-F","H–F"],["Na-Cl","Na–Cl"]], "H-F", function(v){ var p = v.split("-"); a.set(p[0]); b.set(p[1]); });
    var ro = k.readouts(["Δχ", "Type de liaison", "% ionique (Pauling)", "Pôle δ+ → δ−"]);
    var nt = k.note("", "ok");
    var bars = [], nextA = true, tt = 0;
    c.pointer(function(type, p){
      if (type !== "down") return;
      bars.forEach(function(r){ if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h){ (nextA ? a : b).set(r.e); nextA = !nextA; k.redraw(); } });
    });
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, A = a.value, B = b.value, d = Math.abs(CHI[A] - CHI[B]), ph = W < 420;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var swap = CHI[A] > CHI[B], plus = swap ? B : A, minus = swap ? A : B, pI = 100 * (1 - Math.exp(-d * d / 4));
      var type = d < 0.4 ? "covalente apolaire" : d <= 1.7 ? "covalente polaire" : "ionique";
      /* molécule : taille des atomes ∝ rayon covalent, doublet déplacé vers le plus électronégatif */
      var my = 112, scl = Math.min(0.42, (W * 0.74) / (RC[A] + RC[B] + 260) * 1.0), rA = RC[A] * scl + 14, rB = RC[B] * scl + 14;
      var xa = W / 2 - (rA + rB) * 0.55 - 10, xb = W / 2 + (rA + rB) * 0.55 + 10, hl = Math.max(rA, rB);
      var shift = (CHI[B] > CHI[A] ? 1 : CHI[B] < CHI[A] ? -1 : 0) * Math.min(0.46, pI / 100 * 0.62 + 0.02 * Math.min(d, 1)), mid = (xa + xb) / 2 + shift * (xb - xa);
      var cm = CHI[B] > CHI[A] ? xb : xa, cp = CHI[B] > CHI[A] ? xa : xb;
      if (d >= 0.05){ S.draw.glow(c, cm, my, (CHI[B] > CHI[A] ? rB : rA) + 36, "#e0452f", 0.18 + 0.5 * Math.min(1, pI / 70)); S.draw.glow(c, cp, my, (CHI[B] > CHI[A] ? rA : rB) + 36, "#2f7fd1", 0.15 + 0.45 * Math.min(1, pI / 70)); }
      UC.ball(ctx, xa, my, rA, EC[A] || "#9aa5b1"); UC.ball(ctx, xb, my, rB, EC[B] || "#9aa5b1");
      /* nuage de liaison */
      var cw = (xb - xa) * 0.5 + 8, g = ctx.createRadialGradient(mid, my, 0, mid, my, cw);
      g.addColorStop(0, "rgba(255,214,102,.85)"); g.addColorStop(0.6, "rgba(255,190,60,.35)"); g.addColorStop(1, "rgba(255,190,60,0)");
      ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(mid, my, cw, Math.min(hl, 30) * 0.9, 0, 0, 7); ctx.fill(); ctx.restore();
      for (var e = 0; e < 2; e++){ var an = tt * 3 + e * Math.PI, ex = mid + Math.cos(an) * cw * 0.35, ey = my + Math.sin(an * 1.3) * 9; S.draw.dot(c, ex, ey, 3.4, "#b45309"); }
      S.draw.text(c, A, xa, my + 0.5, {size:Math.min(22, rA * 0.8), color:(A === "H" ? "#1f2937" : "#fff")}); S.draw.text(c, B, xb, my + 0.5, {size:Math.min(22, rB * 0.8), color:(B === "H" ? "#1f2937" : "#fff")});
      if (d >= 0.05){
        S.draw.label(c, "δ+", cp, my - hl - 22, {color:"#1f6fbf", size:14}); S.draw.label(c, "δ−", cm, my - hl - 22, {color:"#c0321d", size:14});
        S.draw.arrow(c, cp - (cm > cp ? -6 : 6), my + hl + 26, cm + (cm > cp ? -6 : 6), my + hl + 26, P.red, 3.2);
        S.draw.text(c, "dipôle de liaison", (cp + cm) / 2, my + hl + 44, {size:11, color:P.red, weight:700});
      }
      S.draw.label(c, A + "–" + B + " : " + type, W / 2, 16, {color:d < 0.4 ? P.green : d <= 1.7 ? P.amber : P.red, size:ph ? 12 : 13.5});
      /* barre de Δχ */
      var x0 = 24, x1 = W - 24, yb = 240; function X(v){ return x0 + v / 3.2 * (x1 - x0); }
      [[0, 0.4, "#d9f0e4"], [0.4, 1.7, "#fde9c8"], [1.7, 3.2, "#f6d3cf"]].forEach(function(z){ ctx.fillStyle = z[2]; ctx.fillRect(X(z[0]), yb, X(z[1]) - X(z[0]), 18); });
      S.draw.text(c, "covalente polaire", (X(0.4) + X(1.7)) / 2, yb + 9, {size:11, color:P.amber, weight:700}); S.draw.text(c, "ionique", (X(1.7) + X(3.2)) / 2, yb + 9, {size:11, color:P.red, weight:700});
      for (var t = 0; t <= 3; t++) S.draw.text(c, String(t), X(t), yb + 28, {size:10, color:P.grey});
      S.draw.text(c, "Δχ", x1, yb + 28, {size:10, color:P.grey, align:"right", weight:700});
      S.draw.line(c, X(Math.min(d, 3.2)), yb - 5, X(Math.min(d, 3.2)), yb + 23, P.ink, 3);
      S.draw.label(c, "Δχ = " + S.fmt(d, 2), Math.max(54, Math.min(W - 54, X(Math.min(d, 3.2)))), yb - 14, {color:P.ink, size:11.5});
      /* diagramme des électronégativités : cliquer = choisir A puis B */
      var by0 = 296, bh = H - by0 - 28, bw = (W - 16) / keys.length; bars = [];
      S.draw.text(c, "Électronégativité de Pauling : clique pour choisir " + (nextA ? "A" : "B"), 10, by0 - 10, {size:11, align:"left", color:P.grey, weight:700});
      keys.forEach(function(e, i){
        var h2 = CHI[e] / 4 * bh, x = 8 + i * bw, y = by0 + bh - h2, isA = e === A, isB = e === B;
        ctx.fillStyle = isA ? "#1f4b9e" : isB ? "#c0321d" : "#cdd6e2"; S.draw.rrect(c, x + 2, y, bw - 4, h2, 3); ctx.fill();
        if (isA || isB){ S.draw.text(c, isA ? "A" : "B", x + bw / 2, y - 8, {size:10.5, color:isA ? "#1f4b9e" : "#c0321d", weight:800}); }
        S.draw.text(c, e, x + bw / 2, by0 + bh + 11, {size:ph ? 9.5 : 10.5, color:isA || isB ? P.ink : P.grey, weight:isA || isB ? 800 : 600});
        bars.push({e:e, x:x, y:by0 - 20, w:bw, h:bh + 36});
      });
      ro.set(0, S.fmt(d, 2)); ro.set(1, type); ro.set(2, S.fmt(pI, 0) + " %"); ro.set(3, d < 0.05 ? "aucun" : plus + " → " + minus);
      var ex2 = d > 1.7 ? "Δχ élevé : transfert d'électrons quasi complet, solide à réseau ionique si un métal est impliqué." : d >= 0.4 ? "Liaison covalente polaire : doublet déplacé vers " + minus + "." : "Doublet partagé presque également.";
      nt.set(ex2 + " (Convention de seuils : valeurs usuelles, non absolues.)", "ok");
    });
  }
});
})();
