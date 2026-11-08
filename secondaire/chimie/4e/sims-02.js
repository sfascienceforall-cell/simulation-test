/* Chimie 4e · chapitre 2 · La mole et le nombre d'Avogadro */
SFA.sim({
  id:"c4-c02-echelle", ch:"c02", tag:"Échelle",
  titre:"Où se range une mole sur l'échelle des grands nombres ?",
  resume:"Fais glisser le curseur sur une échelle logarithmique : combien de particules dans n mol, face à des repères connus ?",
  but:"Glisse le curseur bleu (ou règle n) de 10⁻¹⁴ mol à 100 mol. N = n·N_A se place parmi des nombres qu'on connaît. Défi : retrouve quelle quantité de matière donne autant de particules que de grains de sable !",
  aRetenir:"1 mol = 6,02·10²³ entités (N_A). N = n · N_A. Une mole est un paquet, comme une douzaine, mais énorme : même une toute petite quantité de matière contient un nombre gigantesque de particules.",
  piege:"Une mole n'est pas une masse : 1 mol d'eau pèse 18 g, 1 mol d'or pèse 197 g. Ce qui est identique, c'est le nombre d'entités.",
  build:function(k, S){
    var c = k.canvas(340), NA = 6.02e23, LNA = Math.log10(NA), P = S.draw.palette;
    var sub = k.select("Substance", [["H2O","Eau H₂O (molécules)"],["NaCl","Sel NaCl (unités formulaires)"],["Au","Or Au (atomes)"],["O2","Dioxygène O₂ (molécules)"]], "H2O");
    var lg = k.slider("log₁₀ de n (n = 10 puissance …)", -14, 2, 0.05, 0, "");
    var ro = k.readouts(["n", "N = n·N_A", "Masse m", "Repère le plus proche"]);
    var nt = k.note("", "ok");
    var marks = [[9.9, "humains sur Terre", "8·10⁹", P.teal], [13.57, "cellules d'un corps humain", "4·10¹³", P.violet], [17.64, "secondes depuis le Big Bang", "4·10¹⁷", P.amber], [18.88, "grains de sable sur Terre", "7,5·10¹⁸", P.orange], [21.22, "molécules dans une goutte d'eau", "1,7·10²¹", P.blue], [LNA, "1 mole", "6,02·10²³", P.red]];
    var st = {goal:-1, won:0, tries:0}, X0 = 8.5, X1 = 26.3, L = 22, drag = false;
    function ax(){ var R = c.W - 22; return {X:function(v){ return L + (v - X0) / (X1 - X0) * (R - L); }, inv:function(px){ return X0 + (px - L) / (R - L) * (X1 - X0); }, R:R}; }
    c.pointer(function(type, p){
      if (type === "down" || type === "drag"){ var a = ax(); lg.set(Math.round((a.inv(p.x) - LNA) * 20) / 20); k.redraw(); }
    });
    k.button("🎯 Défi : trouve la bonne quantité", function(){ var i = [3, 4, 1, 0][Math.floor(Math.random() * 4)]; st.goal = i; st.tries++; }, true);
    k.button("Mode libre", function(){ st.goal = -1; });
    k.draw(function(){
      var n = Math.pow(10, lg.value), N = n * NA, e = lg.value + LNA, M = C4.M(sub.value), m = n * M, W = c.W, a = ax(), y0 = 296, ctx = c.ctx;
      C4.bg(c);
      /* graduations */
      ctx.save(); ctx.strokeStyle = P.axis; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(a.R, y0); ctx.stroke();
      ctx.lineWidth = 1; for (var v = 9; v <= 26; v++){ ctx.beginPath(); ctx.moveTo(a.X(v), y0 - (v % 3 ? 4 : 7)); ctx.lineTo(a.X(v), y0 + (v % 3 ? 4 : 7)); ctx.stroke(); if (v % 3 === 0) C4.t(c, "10" + C4.supU(v), a.X(v), y0 + 20, {size:12, color:P.grey, weight:600}); }
      ctx.restore();
      /* repères : drapeaux à des hauteurs différentes */
      var near = 0, dn = 99;
      marks.forEach(function(mk, i){
        var x = a.X(mk[0]), top = 34 + i * 40, hit = Math.abs(e - mk[0]) < 0.12;
        S.draw.line(c, x, top + 12, x, y0, T0(mk[3]), 1.5, [3, 3]); S.draw.dot(c, x, y0, 4, mk[3]);
        var right = x < W * 0.5, txt = mk[1] + " ≈ " + mk[2];
        if (i === 5) txt = "1 mole = 6,02·10²³";
        ctx.save(); ctx.font = "700 12px Mulish, system-ui, sans-serif"; var tw = ctx.measureText(txt).width; ctx.restore();
        var fx = right ? Math.min(x + 8, W - 8 - tw - 12) : Math.max(8, x - 8 - tw - 12);
        S.draw.label(c, txt, fx, top, {color:hit ? P.green : mk[3], align:"left", size:12, fill:hit ? "rgba(36,119,90,.2)" : undefined});
        if (st.goal === i) S.draw.label(c, "🎯", x, top - 15, {size:12, fill:"rgba(255,255,255,0)"});
        if (Math.abs(e - mk[0]) < dn){ dn = Math.abs(e - mk[0]); near = i; }
      });
      function T0(col){ return S.draw.tint(col, .45); }
      /* curseur */
      var xs = a.X(Math.max(X0, Math.min(X1, e)));
      S.draw.line(c, xs, 20, xs, y0, P.acc, 2.5);
      S.draw.glow(c, xs, y0, 22, P.acc, .35); S.draw.dot(c, xs, y0, 9, P.acc);
      S.draw.label(c, "N = " + C4.sciU(N, 2), Math.max(80, Math.min(W - 80, xs)), 12, {color:P.acc, size:12.5});
      var r = Math.abs(e - marks[near][0]);
      ro.set(0, S.sci(n, 2) + " mol"); ro.set(1, S.sci(N, 2)); ro.set(2, S.sci(m, 2) + " g"); ro.set(3, marks[near][1]);
      var g = st.goal;
      if (g >= 0){
        var okk = Math.abs(e - marks[g][0]) < 0.12;
        nt.set(okk ? "✅ Bravo : N ≈ " + marks[g][2] + ", c'est bien " + marks[g][1] + ". Il fallait n ≈ " + S.sci(Math.pow(10, marks[g][0]) / NA, 2) + " mol." : "🎯 Défi : place le curseur pour que N soit égal au nombre de « " + marks[g][1] + " » (≈ " + marks[g][2] + "). Glisse sur l'échelle ou règle n.", okk ? "ok" : "");
      } else nt.set("N vaut environ " + S.sci(N / 7.5e18, 2) + " fois le nombre de grains de sable sur Terre (≈ 7,5·10¹⁸) et " + S.sci(N / 8e9, 2) + " fois le nombre d'humains. 1 mol de " + (sub.value === "Au" ? "or" : sub.value === "NaCl" ? "sel" : sub.value === "O2" ? "dioxygène" : "eau") + " pèse " + S.fmt(M, 1) + " g.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c02-sacs", ch:"c02", tag:"Classique",
  titre:"Même nombre de particules, masses différentes",
  resume:"Six sacs : à quantité de matière égale, les masses diffèrent ; à masse égale, c'est le nombre de particules qui diffère.",
  but:"Choisis ce qu'on garde identique : la quantité de matière n, ou la masse m. Compte les particules dans chaque sac et compare les masses. Clique sur un sac pour le détailler.",
  aRetenir:"À quantité de matière égale, le nombre d'entités est égal, mais la masse dépend de la masse molaire : m = n · M. À masse égale, c'est le sac de plus petite M qui contient le plus de particules.",
  piege:"« 1 mol d'eau et 1 mol de fer ont la même masse » est faux : 18 g contre 56 g. Et 100 g de chacun ne contiennent pas le même nombre de particules.",
  build:function(k, S){
    var c = k.canvas(350), P = S.draw.palette;
    var subs = [["C","carbone",P.ink],["H2O","eau",P.teal],["Fe","fer","#8a4b2b"],["NaCl","sel",P.violet],["Cu","cuivre",P.orange],["Au","or","#b8860b"]];
    var mode = k.seg("On garde identique", [["n","la quantité de matière n"],["m","la masse m"]], "n", function(v){ nS.el.parentNode.style.display = v === "n" ? "" : "none"; mS.el.parentNode.style.display = v === "m" ? "" : "none"; });
    var nS = k.slider("Quantité de matière n (chaque sac)", 0.1, 3, 0.1, 1, "mol");
    var mS = k.slider("Masse m (chaque sac)", 20, 300, 10, 100, "g");
    mS.el.parentNode.style.display = "none";
    var ro = k.readouts(["N dans chaque sac", "Sac le plus lourd", "Sac le plus léger"]);
    var nt = k.note("", "");
    var st = {sel:-1}, rd = C4.rnd(13), J = []; for (var i = 0; i < 60; i++) J.push([rd(), rd()]);
    c.pointer(function(type, p){ if (type !== "down") return; var bw = (c.W - 16) / 6, i = Math.floor((p.x - 8) / bw); st.sel = (i === st.sel || i < 0 || i > 5) ? -1 : i; k.redraw(); });
    k.draw(function(){
      var byN = mode.value === "n", W = c.W, ctx = c.ctx, bw = (W - 16) / 6, base = 262, small = W < 460;
      var nn = subs.map(function(s){ return byN ? nS.value : mS.value / C4.M(s[0]); });
      var ms = subs.map(function(s, i){ return nn[i] * C4.M(s[0]); }), mmax = Math.max.apply(0, ms);
      C4.bg(c, base + 4);
      var cnt = subs.map(function(s, i){ return byN ? Math.max(1, Math.round(nS.value * 5)) : Math.min(45, Math.max(1, Math.round(nn[i] * 1.8))); });
      subs.forEach(function(s, i){
        var cx = 8 + (i + .5) * bw, sw = bw * .8, h = byN ? Math.max(Math.ceil(cnt[i] / 5) * (small ? 9 : 11) + 30, 34 + 130 * ms[i] / mmax) : 160, top = base - h, tw = sw * .15;
        function path(cx0){ ctx.beginPath(); ctx.moveTo(cx - tw, top); ctx.bezierCurveTo(cx - sw / 2 - 4, top + h * .2, cx - sw / 2, top + h * .55, cx - sw / 2 + 3, base - 7); ctx.quadraticCurveTo(cx - sw / 2 + 5, base, cx - sw / 2 + 14, base); ctx.lineTo(cx + sw / 2 - 14, base); ctx.quadraticCurveTo(cx + sw / 2 - 5, base, cx + sw / 2 - 3, base - 7); ctx.bezierCurveTo(cx + sw / 2, top + h * .55, cx + sw / 2 + 4, top + h * .2, cx + tw, top); ctx.closePath(); }
        ctx.save(); ctx.shadowColor = "rgba(15,27,45,.16)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; path(); ctx.fillStyle = "#f3ead7"; ctx.fill(); ctx.restore();
        ctx.save(); path(); ctx.clip();
        for (var j = 0; j < cnt[i]; j++){ var col = j % 5, row = Math.floor(j / 5), px = cx - sw * .36 + (col + .5 + (J[j][0] - .5) * .4) * sw * .72 / 5, py = base - 10 - row * (small ? 9 : 11) - J[j][1] * 3; if (py > top + 6) S.draw.dot(c, px, py, small ? 3 : 3.6, s[2]); }
        ctx.restore();
        ctx.lineWidth = st.sel === i ? 3 : 1.6; ctx.strokeStyle = st.sel === i ? P.acc : "#a08a5c"; path(); ctx.stroke();
        S.draw.line(c, cx - tw - 2, top + 4, cx + tw + 2, top + 4, P.red, 3);
        S.draw.label(c, byN ? S.fmt(ms[i], 1) + " g" : S.fmt(nn[i], 2) + " mol", cx, top - 14, {size:small ? 11.5 : 12.5, color:P.ink});
        S.draw.text(c, C4.uni(s[0]), cx, base + 20, {size:small ? 13 : 14.5, color:P.ink, math:true});
        if (!small) C4.t(c, s[1], cx, base + 38, {size:12, color:P.grey, weight:600});
      });
      C4.t(c, byN ? "Chaque sac : même nombre de particules (" + C4.sciU(nS.value * 6.02e23, 2) + ")" : "Chaque sac pèse " + S.fmt(mS.value, 0) + " g : les nombres de particules diffèrent", W / 2, 16, {size:12.5, color:P.acc});
      var iMax = ms.indexOf(mmax), iMin = ms.indexOf(Math.min.apply(0, ms));
      if (byN){ ro.set(0, S.sci(nS.value * 6.02e23, 2)); ro.set(1, subs[iMax][1] + " : " + S.fmt(mmax, 1) + " g"); ro.set(2, subs[iMin][1] + " : " + S.fmt(ms[iMin], 1) + " g"); }
      else { var iN = nn.indexOf(Math.max.apply(0, nn)); ro.set(0, "différent selon le sac"); ro.set(1, subs[iN][1] + " : " + S.sci(nn[iN] * 6.02e23, 2)); ro.set(2, subs[5][1] + " : " + S.sci(nn[5] * 6.02e23, 2)); }
      if (st.sel >= 0){ var q = st.sel; nt.set("<b>" + subs[q][1] + " " + C4.sub(subs[q][0]) + "</b> : M = " + S.fmt(C4.M(subs[q][0]), 1) + " g/mol ; n = " + S.fmt(nn[q], 3) + " mol ; m = n·M = " + S.fmt(ms[q], 1) + " g ; N = " + S.sci(nn[q] * 6.02e23, 2) + " entités.", "ok"); }
      else nt.set(byN ? "Même n, même N : seule la masse change, parce que M change." : "Même masse, mais M différente : n = m / M n'est pas le même, donc le nombre de particules non plus.", "");
    });
  }
});

SFA.sim({
  id:"c4-c02-oleique", ch:"c02", tag:"Expérience",
  titre:"Estimer N_A avec un film d'acide oléique",
  resume:"Une goutte d'acide oléique s'étale en une couche d'une seule molécule d'épaisseur : on en déduit un ordre de grandeur de N_A.",
  but:"Règle la masse d'acide et la surface mesurée du film, puis compare l'estimation de N_A avec 6,02·10²³ pour deux modèles de molécule.",
  aRetenir:"Épaisseur du film e = V / S. En comptant le volume occupé par une molécule, N = V / V_molécule puis N_A = N / n avec n = m / M. Même avec un modèle grossier, on trouve un ordre de grandeur de 10²² à 10²⁴.",
  piege:"Un modèle trop simple (molécule « cubique ») donne, avec les réglages de départ, un résultat 20 à 30 fois trop petit : la molécule est longue et mince, pas cubique. Le résultat dépend fortement de la surface mesurée (au cube dans le modèle cubique).",
  build:function(k, S){
    var c = k.canvas(300), RHO = 0.895, MO = 282;
    var m = k.slider("Masse d'acide dans la goutte", 0.02, 0.10, 0.01, 0.05, "mg");
    var Sf = k.slider("Surface du film mesurée", 100, 800, 10, 220, "cm²");
    var mod = k.seg("Modèle de molécule", [["cube","Cube (arête e)"],["baton","Bâtonnet 0,5 nm × 0,5 nm"]], "baton");
    var ro = k.readouts(["Épaisseur e", "n d'acide oléique", "N molécules", "N_A estimé"]);
    var nt = k.note("", "");
    k.draw(function(){
      var mg = m.value / 1000, V = mg / RHO, Sc = Sf.value, e = V / Sc;      /* cm³, cm */
      var enm = e * 1e7, n = mg / MO, Vnm = V * 1e21, N;
      if (mod.value === "cube") N = Vnm / Math.pow(enm, 3); else N = Vnm / (enm * 0.25);
      var NA = N / n;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx;
      var cx = W * 0.27, cy = 100, rad = Math.min(80, 20 + Math.sqrt(Sc / 800) * 70);
      ctx.fillStyle = "#cfe3f0"; ctx.fillRect(10, 20, W * 0.5 - 20, 160); ctx.strokeStyle = "#5f6b7a"; ctx.strokeRect(10, 20, W * 0.5 - 20, 160);
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fillStyle = "rgba(244,197,66,.75)"; ctx.fill(); ctx.strokeStyle = "#c26a0c"; ctx.stroke();
      C4.label(c, "vue de dessus", cx, 195, "#5f6b7a", 12);
      C4.label(c, "S = " + S.fmt(Sc, 0) + " cm²", cx, cy, "#7a3d00", 13);
      var sx = W * 0.54, sw = W * 0.42, ey = 120, ht = Math.max(4, Math.min(110, enm * 36));
      ctx.fillStyle = "#cfe3f0"; ctx.fillRect(sx, ey, sw, 60); ctx.strokeStyle = "#5f6b7a"; ctx.strokeRect(sx, ey, sw, 60);
      var nb = 9;
      for (var i = 0; i < nb; i++){
        var x = sx + (i + 0.5) * sw / nb, wd = mod.value === "cube" ? ht : Math.max(3, 0.5 * 36 * 0.9);
        ctx.fillStyle = "#c26a0c"; ctx.fillRect(x - wd / 2 + 1, ey - ht, Math.max(2, wd - 2), ht);
        S.draw.dot(c, x, ey + 2, 3, "#0e7f96");
      }
      C4.label(c, "vue de côté : e = " + S.fmt(enm, 2) + " nm", sx + sw / 2, 195, "#5f6b7a", 12);
      C4.label(c, "(échelle dilatée)", sx + sw / 2, 212, "#5f6b7a", 11);
      var ratio = NA / 6.02e23;
      C4.label(c, "Estimation : " + C4.sciU(NA, 2) + " mol⁻¹  (" + S.fmt(100 * ratio, 0) + " % de N_A)", W / 2, 256, "#1f4b9e", 14);
      C4.label(c, "valeur de référence : 6,02·10²³ mol⁻¹", W / 2, 278, "#5f6b7a", 12);
      ro.set(0, S.fmt(enm, 2) + " nm"); ro.set(1, S.sci(n, 3) + " mol"); ro.set(2, S.sci(N, 2)); ro.set(3, S.sci(NA, 2));
      nt.set(ratio > 0.5 && ratio < 2 ? "Bon ordre de grandeur : à un facteur 2 près." : ratio < 0.5 ? "Trop petit : ce modèle sous-estime le nombre de molécules (ou la surface est trop petite)." : "Trop grand : la surface ou le modèle surestime N.", ratio > 0.5 && ratio < 2 ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"c4-c02-souffle", ch:"c02", tag:"Niche",
  titre:"Combien de molécules dans un souffle ?",
  resume:"Souffle dans un ballon : la loupe montre les molécules d'air qui s'agitent, le compteur en annonce des milliers de milliards de milliards. n = V / V_m, puis N = n·N_A.",
  but:"Souffle dans le ballon (bouton) ou étire-le à la main, change la température et le type d'air. La loupe montre la composition, le graphe relie le volume au nombre de molécules. Défis : remplis le ballon avec exactement ce qui est demandé.",
  aRetenir:"Pour un gaz : n = V / V<sub>m</sub> (V<sub>m</sub> ≈ 24 L/mol à 20 °C et 1 atm), puis N = n · N<sub>A</sub> (N<sub>A</sub> = 6,02·10<sup>23</sup> mol<sup>−1</sup>). Le nombre de molécules est proportionnel au volume ; à volume égal, il diminue quand la température augmente (le gaz se dilate).",
  piege:"Même un petit volume de gaz contient un nombre énorme de molécules, mais elles sont très espacées : une mole de gaz occupe 24 L, pas un dé à coudre. Et V<sub>m</sub> = 24 L/mol ne vaut qu'à 20 °C et 1 atm : à 37 °C (air expiré chaud), une mole occupe environ 25,4 L.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.62}), g = k.canvas(170), P = S.draw.palette;
    var V = k.slider("Volume d'air dans le ballon", 0.1, 6, 0.05, 0.5, "L");
    var T = k.slider("Température du gaz", 0, 40, 1, 20, "°C");
    var air = k.seg("Air", [["in","Air inspiré"],["ex","Air expiré"]], "in");
    var ro = k.readouts(["V_m à cette température", "Quantité de matière n", "Nombre de molécules N", "Masse d'air", "dont O₂", "dont CO₂"]);
    var nt = k.note("", "");
    var COMP = {in:[["N₂", .78, 28, "#2f56b3"], ["O₂", .21, 32, "#c23a2f"], ["Ar", .01, 40, "#7b3fb0"], ["CO₂", 0.0004, 44, "#3b4656"]],
                ex:[["N₂", .78, 28, "#2f56b3"], ["O₂", .17, 32, "#c23a2f"], ["CO₂", .04, 44, "#3b4656"], ["Ar", .01, 40, "#7b3fb0"]]};
    var DEF = [["1,0·10²² molécules", function(v){ return v.N / 1e22; }], ["1,0 g d'air", function(v){ return v.m / 1; }], ["0,10 mol de gaz", function(v){ return v.n / 0.1; }]], di = -1, won = [0, 0, 0];
    k.button("Défi suivant", function(){ di = (di + 1) % 3; });
    var blow = null;
    k.button("Souffler (+0,5 L)", function(){ if (V.value < 6) blow = {t:0, from:V.value, to:Math.min(6, V.value + 0.5)}; }, true);
    k.button("Vider le ballon", function(){ V.set(0.1); blow = null; });
    /* molécules de la loupe */
    var rnd = C4.rnd(11), mol = [];
    for (var i = 0; i < 46; i++) mol.push({x:rnd(), y:rnd(), vx:rnd() - .5, vy:rnd() - .5, a:rnd() * 6.28, w:(rnd() - .5) * 4, r:rnd()});
    var lp = k.loop(function(dt){
      var sp = 0.16 * Math.sqrt((T.value + 273) / 293);
      mol.forEach(function(m){ m.x += m.vx * sp * dt; m.y += m.vy * sp * dt; m.a += m.w * dt; if (m.x < 0 || m.x > 1){ m.vx = -m.vx; m.x = Math.max(0, Math.min(1, m.x)); } if (m.y < 0 || m.y > 1){ m.vy = -m.vy; m.y = Math.max(0, Math.min(1, m.y)); } });
      if (blow){ blow.t += dt / 1.1; V.set(Math.round(C4.lerp(blow.from, blow.to, C4.ease(blow.t)) * 100) / 100); if (blow.t >= 1){ V.set(blow.to); blow = null; } }
      k.redraw();
    });
    lp.play();
    function vals(){ var Vm = 24 * (T.value + 273) / 293, n = V.value / Vm, comp = COMP[air.value], M = 0; comp.forEach(function(q){ M += q[1] * q[2]; }); return {Vm:Vm, n:n, N:n * 6.02e23, m:n * M, M:M, comp:comp}; }
    var G = {}, gx = null;
    c.pointer(function(type, p){
      if (!G.r || (type !== "down" && type !== "drag")) return;
      if (type === "down") G.on = Math.abs(Math.hypot(p.x - G.bx, p.y - G.by) - G.r) < 30 || Math.hypot(p.x - G.bx, p.y - G.by) < G.r;
      if (!G.on) return;
      var rr = Math.max(6, Math.hypot(p.x - G.bx, p.y - G.by)), v = 6 * Math.pow(Math.min(1, rr / G.R0), 3);
      blow = null; V.set(Math.round(Math.max(0.1, v) * 20) / 20); k.redraw();
    });
    g.pointer(function(type, p){ if (!gx || (type !== "down" && type !== "drag")) return; blow = null; V.set(Math.round(Math.max(0.1, Math.min(6, gx.ix(p.x))) * 20) / 20); k.redraw(); });
    function molecule(ctx, x, y, a, s, kind, col){
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      function at(dx, r, cc){ var gr = ctx.createRadialGradient(dx - r * .35, -r * .35, r * .1, dx, 0, r); gr.addColorStop(0, "rgba(255,255,255,.85)"); gr.addColorStop(.35, cc); gr.addColorStop(1, cc); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(dx, 0, r, 0, 7); ctx.fill(); }
      if (kind === "Ar") at(0, s * 1.05, col);
      else if (kind === "CO₂"){ at(-s * 1.1, s * .85, "#c23a2f"); at(s * 1.1, s * .85, "#c23a2f"); at(0, s * .9, "#3b4656"); }
      else { at(-s * .55, s * .8, col); at(s * .55, s * .8, col); }
      ctx.restore();
    }
    k.draw(function(){
      var v = vals(), W = c.W, H = c.H, ctx = c.ctx, small = W < 420;
      C4.bg(c, H - 18);
      /* personne de profil */
      var hx = small ? 46 : 70, hy = H * 0.5, hr = small ? 30 : 40;
      ctx.save(); ctx.fillStyle = "#f0c8a0"; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 7); ctx.fill();
      ctx.fillStyle = "#5b3b25"; ctx.beginPath(); ctx.arc(hx - 4, hy - 6, hr * 1.02, Math.PI * 0.95, Math.PI * 1.9); ctx.fill();
      ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(hx + hr * 0.45, hy - hr * 0.2, 3, 0, 7); ctx.fill();
      var puff = blow ? 1 + 0.25 * Math.sin(Math.min(1, blow.t) * Math.PI) : 1;
      ctx.fillStyle = "#e9a98a"; ctx.beginPath(); ctx.ellipse(hx + hr * 0.55, hy + hr * 0.38, 7 * puff, 6 * puff, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#3f5f9f"; ctx.fillRect(hx - hr * 0.7, hy + hr * 0.85, hr * 1.3, H - 18 - hy - hr * 0.85); ctx.restore();
      /* ballon : V ∝ r³ */
      var R0 = Math.min(H * 0.44, (W - hx - hr - 30) * 0.42), r = R0 * Math.cbrt(V.value / 6), bx = hx + hr + 22 + r, by = hy;
      G = {R0:R0, r:r, bx:bx, by:by, on:G.on};
      ctx.save(); ctx.strokeStyle = "#a3271a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx + hr * 0.62, hy + hr * 0.38); ctx.lineTo(bx - r - 2, by + 4); ctx.stroke();
      var gb = ctx.createRadialGradient(bx - r * .35, by - r * .4, r * .1, bx, by, r); gb.addColorStop(0, "rgba(255,200,190,.75)"); gb.addColorStop(1, "rgba(224,80,70,.55)");
      ctx.fillStyle = gb; ctx.beginPath(); ctx.arc(bx, by, r, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(160,40,30,.7)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      /* filet d'air pendant le souffle */
      if (blow) for (var j = 0; j < 6; j++){ var f = ((blow.t * 3 + j / 6) % 1); S.draw.dot(c, C4.lerp(hx + hr * 0.62, bx - r, f), C4.lerp(hy + hr * 0.38, by + 4, f) + Math.sin(f * 9 + j) * 2, 2.6, "rgba(47,86,179,.55)"); }
      /* loupe */
      var lr = Math.min(small ? 62 : 86, H * 0.36), lx = W - lr - 12, ly = lr + 14;
      S.draw.line(c, bx + r * 0.5, by - r * 0.3, lx - lr * 0.7, ly + lr * 0.6, "rgba(15,27,45,.35)", 1.5, [4, 4]);
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.fillStyle = "#fbfcfe"; ctx.fill(); ctx.clip();
      var cum = [], acc = 0; v.comp.forEach(function(q){ acc += q[1]; cum.push([acc, q]); });
      var dens = Math.max(0.35, Math.min(1, 293 / (T.value + 273)));
      mol.forEach(function(m, mi){
        if (mi >= Math.round(46 * dens)) return;
        var q = cum.filter(function(z){ return m.r < z[0]; })[0]; q = q ? q[1] : v.comp[0];
        if (air.value === "in" && q[0] === "CO₂") q = v.comp[0];
        molecule(ctx, lx - lr + 8 + m.x * (2 * lr - 16), ly - lr + 8 + m.y * (2 * lr - 16), m.a, small ? 3.6 : 4.6, q[0], q[3]);
      });
      ctx.restore(); ctx.save(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 7); ctx.stroke(); ctx.restore();
      var lg = v.comp.filter(function(q){ return q[1] >= 0.01; });
      lg.forEach(function(q, i){ var yy = ly + lr + 14 + Math.floor(i / 2) * 16, xx = lx - lr + (i % 2) * lr; molecule(ctx, xx + 6, yy, 0, 3.6, q[0], q[3]); S.draw.text(c, q[0] + " " + S.fmt(q[1] * 100, 0) + " %", xx + 15, yy, {size:11, align:"left", color:"#2c3a4e"}); });
      S.draw.display(c, C4.sciU(v.N, 2), small ? 66 : 84, 28, {w:small ? 120 : 150, h:40, size:small ? 15 : 17, caption:"MOLÉCULES (N)"});
      C4.t(c, "glisse le bord du ballon", bx, Math.min(H - 28, by + r + 16), {size:11.5, color:"#5f6b7a", weight:600});
      /* graphe N(V) */
      g.clear();
      var Nmax = 6 / 24 * 293 / 273 * 6.02e23 / 1e22 * 1.02;
      gx = S.draw.axes(g, {x0:0, x1:6, y0:0, y1:Nmax, xl:"V (L)", yl:"N (×10²²)", stepX:1, l:44});
      S.draw.fn(g, gx, function(x){ return x / 24 * 6.02e23 / 1e22; }, "#b8c0cc", 1.6, [5, 4]);
      S.draw.fn(g, gx, function(x){ return x / v.Vm * 6.02e23 / 1e22; }, P.acc, 3);
      C4.tag(g, "pointillé : 20 °C · bleu : " + S.fmt(T.value, 0) + " °C", g.W - 12, gx.Y(2.2), "#2c3a4e", 11, "right");
      if (di === 0) S.draw.line(g, gx.X(0), gx.Y(1), gx.X(6), gx.Y(1), P.amber, 1.6, [3, 3]);
      S.draw.line(g, gx.X(V.value), gx.Y(0), gx.X(V.value), gx.Y(v.N / 1e22), "#b8c0cc", 1, [3, 3]);
      C4.ion(g, gx.X(V.value), gx.Y(v.N / 1e22), 7, P.red, "", {});
      ro.set(0, S.fmt(v.Vm, 1) + " L/mol"); ro.set(1, S.fmt(v.n, 4) + " mol"); ro.set(2, S.sci(v.N, 2)); ro.set(3, S.fmt(v.m, 3) + " g");
      var o2 = v.comp.filter(function(q){ return q[0] === "O₂"; })[0][1], co2 = v.comp.filter(function(q){ return q[0] === "CO₂"; })[0][1];
      ro.set(4, S.sci(o2 * v.N, 2)); ro.set(5, S.sci(co2 * v.N, 2));
      var base = "Modèle : gaz parfait, V<sub>m</sub> = 24 L/mol à 20 °C proportionnel à la température absolue ; air sec (vapeur d'eau négligée), M moyenne = " + S.fmt(v.M, 1) + " g/mol.";
      if (di >= 0){ var rr2 = DEF[di][1](v), okk = Math.abs(rr2 - 1) <= 0.03; if (okk) won[di] = 1;
        nt.set("<b>Défi " + (di + 1) + "/3 : mets " + DEF[di][0] + " dans le ballon</b> (à " + S.fmt(T.value, 0) + " °C). " + (okk ? "✅ Réussi avec V = " + S.fmt(V.value, 2) + " L." : "Pour l'instant : " + S.fmt(rr2 * 100, 0) + " % de la cible.") + " · " + (won[0] + won[1] + won[2]) + "/3 réussis.", okk ? "ok" : "");
      } else nt.set("Un ballon de " + S.fmt(V.value, 2) + " L contient " + S.sci(v.N, 2) + " molécules. " + base, "");
    });
  }
});
