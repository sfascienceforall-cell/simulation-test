/* Biologie 4e · chapitre 8 · ADN, chromosomes et réplication */
SFA.sim({
  id:"b4-c08-adn", ch:"c08", tag:"Classique · défi",
  titre:"Construis ton ADN : appariement des bases",
  resume:"Une double hélice qui tourne : écris une séquence, lis le brin complémentaire, ses liaisons hydrogène et son %GC ; chauffe-la pour voir les régions riches en A–T s'ouvrir d'abord ; ou complète toi-même le brin.",
  but:"Mode « Analyser » : écris une séquence (A, T, G, C) et monte la température : les paires s'ouvrent là où la courbe de stabilité passe sous la température. Mode « Jeu » : touche (ou glisse) la bonne base du plateau vers la case qui clignote.",
  aRetenir:"Dans l'ADN, A s'apparie avec T (2 liaisons hydrogène) et G avec C (3 liaisons). Les deux brins sont complémentaires et antiparallèles (5'→3' face à 3'→5'). Dans toute molécule d'ADN double brin : %A = %T et %G = %C (règle de Chargaff). Plus il y a de paires G–C, plus il faut chauffer pour séparer les brins.",
  piege:"A ne s'apparie jamais avec G ou C. L'ARN remplace T par U (uracile), mais pas l'ADN. Températures d'ouverture illustratives (règle simplifiée : une paire A–T s'ouvre vers 62 °C, une G–C vers 82 °C, moyennées avec les voisines).",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.0}); B4.adapt(c, 1.12, 0.78, 480);
    var mode = k.seg("Mode", [["a","Analyser"],["j","Jeu"]], "a", function(v){ if (v === "j" && !st.tpl.length) nouvelle(); });
    var inp = k.input("Séquence du brin 1 (5' → 3')", "ATGCCGTTAGCAATTA", function(){});
    var hel = k.toggle("Hélice en rotation (sinon échelle à plat)", true);
    var T = k.slider("Température", 20, 100, 1, 37, "°C");
    var ro = k.readouts(["Longueur", "%GC (et A = T, G = C)", "Liaisons hydrogène", "Brin complémentaire (3' → 5')"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var COMP = {A:"T", T:"A", G:"C", C:"G"}, COL = {A:"#2e8b57", T:"#c0392b", G:"#1f4b9e", C:"#d18a1b"};
    var st = {tpl:[], idx:0, err:0, msg:"", done:false, t:0, tw:1, open:[], shake:0, drag:null, geo:{}, score:0, tot:0, fly:null};
    function nouvelle(){ st.tpl = []; for (var i = 0; i < 12; i++) st.tpl.push("ATGC"[Math.floor(Math.random() * 4)]); st.idx = 0; st.err = 0; st.msg = ""; st.done = false; st.tot++; }
    function choisir(b){ if (mode.value !== "j" || st.done) return; if (COMP[st.tpl[st.idx]] === b){ st.idx++; st.msg = ""; if (st.idx >= st.tpl.length){ st.done = true; if (st.err === 0) st.score++; } } else { st.err++; st.shake = 0.5; st.msg = b + " ne s'apparie pas avec " + st.tpl[st.idx] + " (" + st.tpl[st.idx] + " ↔ " + COMP[st.tpl[st.idx]] + ")."; } }
    ["A","T","G","C"].forEach(function(b){ k.button("Base " + b, function(){ choisir(b); }); });
    k.button("Nouvelle séquence (jeu)", function(){ nouvelle(); mode.set("j"); }, true);
    function seq(){ return mode.value === "j" ? st.tpl.slice() : inp.value.toUpperCase().replace(/[^ATGC]/g, "").slice(0, 20).split(""); }
    function thr(sq){ return sq.map(function(b, i){ var v = 0, n = 0; for (var j = i - 1; j <= i + 1; j++) if (sq[j]){ v += (sq[j] === "A" || sq[j] === "T") ? 62 : 82; n++; } return v / n; }); }
    var lp = k.loop(function(dt){
      st.t += dt; var target = (hel.value && mode.value === "a") ? 1 : 0; st.tw += (target - st.tw) * Math.min(1, dt * 3); st.shake = Math.max(0, st.shake - dt);
      var sq = seq(), th = thr(sq); while (st.open.length < sq.length) st.open.push(0); st.open.length = sq.length;
      for (var i = 0; i < sq.length; i++){ var o = mode.value === "a" && T.value >= th[i] ? 1 : 0; st.open[i] += (o - st.open[i]) * Math.min(1, dt * 4); }
      if (st.fly){ st.fly.t += dt; if (st.fly.t > 0.35){ var b = st.fly.b; st.fly = null; choisir(b); } }
      k.redraw();
    });
    lp.play();
    c.pointer(function(type, p){
      var g = st.geo;
      if (type === "down" && g.tray && mode.value === "j"){ g.tray.forEach(function(tb){ if (Math.hypot(p.x - tb[1], p.y - tb[2]) < tb[3] + 6) st.drag = {b:tb[0], x:p.x, y:p.y, x0:p.x, y0:p.y}; }); }
      if (type === "drag" && st.drag){ st.drag.x = p.x; st.drag.y = p.y; }
      if (type === "up" && st.drag){ var d = st.drag; st.drag = null;
        if (Math.hypot(d.x - d.x0, d.y - d.y0) < 8 || (g.slot && Math.hypot(d.x - g.slot[0], d.y - g.slot[1]) < 40)){ if (!st.done && st.tpl.length) st.fly = {b:d.b, t:0, x:d.x0, y:d.y0}; } }
      k.redraw();
    });
    c.cv.style.touchAction = "pan-y";
    function sugar(x, y, r, col){ var ctx = c.ctx; ctx.beginPath(); for (var i = 0; i < 5; i++){ var a = -Math.PI / 2 + i * 2 * Math.PI / 5; i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1; ctx.stroke(); }
    function baseBar(x, y0, y1, w, b, alpha){ var ctx = c.ctx; ctx.save(); ctx.globalAlpha = alpha; S.draw.rrect(c, x - w / 2, Math.min(y0, y1), w, Math.abs(y1 - y0), Math.min(4, w / 3)); ctx.fillStyle = COL[b]; ctx.fill(); ctx.restore(); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, fs = wide ? 11 : 9.5, game = mode.value === "j", sq = seq(), n = sq.length, th = thr(sq), tw = st.tw;
      var hy = H * (game ? 0.3 : 0.27), amp = Math.min(H * 0.15, 70), x0 = 30, x1 = W - 30, dx = n > 1 ? (x1 - x0) / (n - 1) : 0, w = Math.max(6, Math.min(18, dx * 0.5));
      if (n === 0){ S.draw.text(c, "Écris des bases A, T, G ou C", W / 2, hy, {size:13, color:P.grey}); }
      var pts = [];
      for (var i = 0; i < n; i++){
        var ph = i * 0.62832 + st.t * 0.9, cs = Math.cos(ph), sn = Math.sin(ph), op = st.open[i] || 0;
        var half = amp * (1 - tw + tw * Math.abs(cs)) * 0.62 + op * amp * 0.45, sgn = tw > 0.5 && cs < 0 ? -1 : 1;
        var ya = hy - half * (tw > 0.5 ? (cs >= 0 ? 1 : -1) : 1), yb = hy + half * (tw > 0.5 ? (cs >= 0 ? 1 : -1) : 1);
        var depth = tw * sn; pts.push({x:x0 + i * dx, ya:ya, yb:yb, d:depth, op:op});
      }
      /* squelettes (sucre–phosphate) : derrière d'abord */
      function backbone(key, col){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach(function(q, j){ var y = q[key]; j ? ctx.lineTo(q.x, y) : ctx.moveTo(q.x, y); }); ctx.stroke(); ctx.restore(); }
      backbone("ya", "rgba(98,54,196,.55)"); backbone("yb", "rgba(14,127,150,.55)");
      /* barreaux : paires de bases */
      var order = pts.map(function(q, j){ return j; }).sort(function(a, b){ return pts[a].d - pts[b].d; });
      order.forEach(function(j){
        var q = pts[j], b = sq[j], cb = COMP[b], filled = !game || j < st.idx, mid = (q.ya + q.yb) / 2, gap = 4 + q.op * 20, al = 0.55 + 0.45 * (1 - Math.max(0, -q.d));
        var top = Math.min(q.ya, q.yb), bot = Math.max(q.ya, q.yb), upper = q.ya <= q.yb ? b : cb, lower = q.ya <= q.yb ? cb : b, upFill = q.ya <= q.yb ? true : filled, loFill = q.ya <= q.yb ? filled : true;
        if (bot - top > gap + 4){
          if (upFill) baseBar(q.x, top + 6, mid - gap / 2, w, upper, al);
          if (loFill) baseBar(q.x, mid + gap / 2, bot - 6, w, lower, al);
          else { ctx.save(); ctx.setLineDash([3, 3]); S.draw.rrect(c, q.x - w / 2, mid + gap / 2, w, bot - 6 - mid - gap / 2, 4); ctx.strokeStyle = j === st.idx ? (st.shake > 0 ? P.red : "#13233a") : "#a3adba"; ctx.lineWidth = j === st.idx ? 2.2 : 1.2; ctx.stroke(); ctx.restore();
            if (j === st.idx){ st.geo.slot = [q.x, (mid + bot) / 2]; S.draw.glow(c, q.x, (mid + bot) / 2, 18 + 4 * Math.sin(st.t * 6), P.yellow, 0.6); } }
          if (filled && q.op < 0.5){ var hb = (b === "A" || b === "T") ? 2 : 3; for (var z = 0; z < hb; z++){ var xx = q.x + (z - (hb - 1) / 2) * Math.min(5, w / 3); S.draw.line(c, xx, mid - gap / 2 + 1, xx, mid + gap / 2 - 1, "rgba(15,27,45," + (0.7 * al) + ")", 1.4, [2, 1.5]); } }
          if (w >= 9 && bot - top > 36){ S.draw.text(c, upper, q.x, top + 14, {size:Math.min(13, w * 0.8), color:"#fff", weight:800}); if (loFill) S.draw.text(c, lower, q.x, bot - 14, {size:Math.min(13, w * 0.8), color:"#fff", weight:800}); }
        }
      });
      /* sucres et phosphates par-dessus */
      pts.forEach(function(q){ var al = 0.6 + 0.4 * (1 - Math.max(0, -q.d)); ctx.save(); ctx.globalAlpha = al; sugar(q.x, q.ya, 5.5, "#b9a3ea"); sugar(q.x, q.yb, 5.5, "#8fd0dc"); ctx.restore(); });
      for (i = 0; i < n - 1; i++){ var p1 = pts[i], p2 = pts[i + 1]; S.draw.dot(c, (p1.x + p2.x) / 2, (p1.ya + p2.ya) / 2, 3, "#e0a91b"); S.draw.dot(c, (p1.x + p2.x) / 2, (p1.yb + p2.yb) / 2, 3, "#e0a91b"); }
      if (n){ S.draw.text(c, "5'", x0 - 16, pts[0].ya, {size:12, color:P.violet}); S.draw.text(c, "3'", x1 + 16, pts[n - 1].ya, {size:12, color:P.violet}); S.draw.text(c, "3'", x0 - 16, pts[0].yb, {size:12, color:P.teal}); S.draw.text(c, "5'", x1 + 16, pts[n - 1].yb, {size:12, color:P.teal}); }
      S.draw.text(c, "● sucre (désoxyribose)  ● phosphate", 8, 10, {size:fs - 1, color:"#5f6b7a", align:"left", weight:600});
      /* plateau de bases (jeu) */
      st.geo.tray = [];
      if (game){
        var ty = H * 0.6, tw2 = Math.min(64, (W - 40) / 4);
        S.draw.text(c, st.done ? "Brin complété !" : "Plateau : touche ou glisse la base qui s'apparie avec " + st.tpl[st.idx], W / 2, ty - 26, {size:fs, color:P.ink});
        ["A", "T", "G", "C"].forEach(function(b, q2){ var x = W / 2 + (q2 - 1.5) * (tw2 + 10); S.draw.rrect(c, x - tw2 / 2, ty - 16, tw2, 32, 8); ctx.fillStyle = COL[b]; ctx.fill(); S.draw.text(c, b, x, ty, {size:16, color:"#fff", weight:800}); st.geo.tray.push([b, x, ty, tw2 / 2]); });
        if (st.drag){ S.draw.rrect(c, st.drag.x - 14, st.drag.y - 14, 28, 28, 6); ctx.fillStyle = COL[st.drag.b]; ctx.fill(); S.draw.text(c, st.drag.b, st.drag.x, st.drag.y, {size:14, color:"#fff", weight:800}); }
        if (st.fly && st.geo.slot){ var u = B4.ease(st.fly.t / 0.35), fx = st.fly.x + (st.geo.slot[0] - st.fly.x) * u, fy = st.fly.y + (st.geo.slot[1] - st.fly.y) * u; S.draw.rrect(c, fx - 12, fy - 12, 24, 24, 6); ctx.fillStyle = COL[st.fly.b]; ctx.fill(); }
      }
      /* profil : liaisons H et température d'ouverture */
      var gy0 = game ? H * 0.72 : H * 0.55;
      var ax = S.draw.axes(c, {x0:-0.5, x1:Math.max(n, 1) - 0.5, y0:20, y1:100, yl:"ouverture (°C)", stepX:Math.max(1, Math.ceil(n / 10)), stepY:20, t:gy0 + 14, l:40, b:24, grid:false});
      for (i = 0; i < n; i++){ var hb2 = (sq[i] === "A" || sq[i] === "T") ? 2 : 3, filled2 = !game || i < st.idx; ctx.fillStyle = S.draw.tint(COL[sq[i]], 0.35); var xb = ax.X(i), yt = ax.Y(filled2 ? (hb2 === 2 ? 62 : 82) : 20); ctx.fillRect(xb - Math.min(9, dx * 0.35), yt, Math.min(18, dx * 0.7), ax.B - yt); if (filled2) S.draw.text(c, hb2 + "", xb, ax.B - 8, {size:9, color:COL[sq[i]]}); }
      if (!game && n){ ctx.save(); ctx.strokeStyle = P.violet; ctx.lineWidth = 2.4; ctx.beginPath(); th.forEach(function(v, j){ var x = ax.X(j), y = ax.Y(v); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
        S.draw.line(c, ax.L, ax.Y(T.value), ax.R, ax.Y(T.value), P.red, 1.6, [5, 4]); S.draw.label(c, S.fmt(T.value, 0) + " °C", ax.R - 4, ax.Y(T.value) - 10, {color:P.red, size:9.5, align:"right"});
        S.draw.text(c, "barres : paire seule (chiffre = liaisons H) · courbe : avec ses voisines", ax.L + 4, gy0 + 2, {size:fs - 1.5, color:"#5f6b7a", align:"left", weight:600}); }
      /* lectures */
      var cnt = {A:0, T:0, G:0, C:0}, hbt = 0, k2 = game ? st.idx : n; for (i = 0; i < k2; i++){ cnt[sq[i]]++; hbt += (sq[i] === "A" || sq[i] === "T") ? 2 : 3; }
      var gc = k2 ? (cnt.G + cnt.C) / k2 * 100 : 0, comp = sq.slice(0, k2).map(function(b){ return COMP[b]; }).join("");
      ro.set(0, n + " paires"); ro.set(1, k2 ? S.fmt(gc, 0) + " %" : "—"); ro.set(2, hbt + (game && !st.done ? " (partiel)" : "")); ro.set(3, comp ? "3'-" + comp + (game && !st.done ? "…" : "") + "-5'" : "—");
      var nOpen = st.open.filter(function(o){ return o > 0.5; }).length;
      if (game){ nt.set(st.done ? "Brin complété avec " + st.err + " erreur(s) : A↔T (2 liaisons), G↔C (3 liaisons), brins antiparallèles." : (st.msg ? "<b>Non.</b> " + st.msg + " " : "") + "Quelle base s'apparie avec " + st.tpl[st.idx] + " ? Erreurs : " + st.err + ".", st.done ? "ok" : st.msg ? "warn" : "");
        nd.set("<b>Défi.</b> Complète le brin de 12 bases sans erreur. " + (st.done ? (st.err === 0 ? "<b>Parfait !</b>" : "Recommence pour un sans-faute.") : "") + " Brins parfaits : " + st.score + " / " + st.tot + ".", st.done && st.err === 0 ? "ok" : "warn"); }
      else {
        var bad = /[^ATGC]/.test(inp.value.toUpperCase());
        nt.set(bad ? "Seules les lettres A, T, G, C existent dans l'ADN : les autres sont ignorées (U n'existe que dans l'ARN)." : n === 0 ? "Entre une séquence." : "Paires A–T : " + (cnt.A + cnt.T) + " (2 liaisons chacune), paires G–C : " + (cnt.G + cnt.C) + " (3 liaisons) → " + hbt + " liaisons H. Sur les deux brins : A = T = " + (cnt.A + cnt.T) + " et G = C = " + (cnt.G + cnt.C) + " (Chargaff). À " + S.fmt(T.value, 0) + " °C : " + nOpen + " paire(s) ouverte(s) sur " + n + (nOpen && nOpen < n ? ", d'abord là où il y a des A–T." : "."), bad ? "warn" : nOpen === n && n ? "warn" : "");
        nd.set("Essaie : une séquence riche en G–C (GCGCGGCC) et une riche en A–T (ATATTAAT) : laquelle faut-il chauffer le plus pour séparer les brins ?", "");
      }
    });
  }
});

SFA.sim({
  id:"b4-c08-meselson", ch:"c08", tag:"Expérience · original",
  titre:"Meselson et Stahl : la réplication est semi-conservative",
  resume:"Compare les trois modèles de réplication aux bandes d'ADN observées après centrifugation.",
  but:"Choisis un modèle et une génération : compare les bandes prévues avec les bandes observées, et regarde les brins anciens (rouge) et nouveaux (bleu).",
  aRetenir:"Réplication semi-conservative : chaque molécule fille contient un brin ancien et un brin nouveau. Après n générations dans un milieu « léger » (¹⁴N), on obtient 2ⁿ molécules dont 2 seulement sont hybrides. Seul ce modèle prévoit : 1 bande hybride à la 1re génération, puis 2 bandes (hybride et légère) à la 2e.",
  piege:"Le modèle conservatif est éliminé dès la 1re génération (il prévoirait 2 bandes, lourde et légère) ; le modèle dispersif dès la 2e (il prévoirait une seule bande de plus en plus légère). Ne confonds pas « hybride » (¹⁵N et ¹⁴N) et « mutant ».",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.0});
    var mod = k.seg("Modèle testé", [["s","Semi-conservatif"],["c","Conservatif"],["d","Dispersif"]], "s");
    var g = k.slider("Génération (dans ¹⁴N) pour le détail", 0, 4, 1, 2, "");
    var ro = k.readouts(["Molécules d'ADN", "Brins anciens (¹⁵N)", "Bandes prévues", "Verdict"]);
    var nt = k.note("", "");
    function bands(model, n){
      /* renvoie une liste de {pos: 0 (léger) à 1 (lourd), frac} */
      if (n === 0) return [{pos:1, frac:1}];
      if (model === "s"){ var h = 2 / Math.pow(2, n); return n === 1 ? [{pos:0.5, frac:1}] : [{pos:0.5, frac:h}, {pos:0, frac:1 - h}]; }
      if (model === "c"){ var f = 1 / Math.pow(2, n); return [{pos:1, frac:f}, {pos:0, frac:1 - f}]; }
      return [{pos:1 / Math.pow(2, n), frac:1}];
    }
    function same(a, b){ if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++){ if (Math.abs(a[i].pos - b[i].pos) > 0.02 || Math.abs(a[i].frac - b[i].frac) > 0.02) return false; } return true; }
    function sortb(a){ return a.slice().sort(function(x, y){ return y.pos - x.pos; }); }
    function tubes(y, hh, model, title, hl){
      var ctx = c.ctx, W = c.W, L = 16, R = 12, cw = (W - L - R) / 5;
      B4.txt(c, title, L, y - 14, B4.pal.ink, 12, "left");
      for (var n = 0; n <= 4; n++){
        var cx = L + (n + 0.5) * cw, bs = bands(model, n);
        B4.rr(c, cx - 13, y, 26, hh, 12, "#f8fafc", n === hl ? B4.pal.red : "#13233a", n === hl ? 3.5 : 1.6);
        bs.forEach(function(b){ var yy = y + hh * (0.18 + 0.7 * b.pos), th = 3 + 9 * b.frac; ctx.fillStyle = b.pos > 0.7 ? "#b42318" : b.pos > 0.3 ? "#5B21B6" : "#1e3f8f"; if (n === 0 || b.frac > 0) ctx.fillRect(cx - 12, yy - th / 2, 24, th); });
        B4.txt(c, "G" + n, cx, y + hh + 12, B4.pal.ink, 11);
      }
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, n = g.value, M = mod.value, hh = H * 0.15;
      tubes(32, hh, "s", "Observé (Meselson et Stahl)", n);
      tubes(32 + hh + 52, hh, M, "Prévu : modèle " + (M === "s" ? "semi-conservatif" : M === "c" ? "conservatif" : "dispersif"), n);
      /* molécules à la génération n */
      var my = 32 + 2 * hh + 100, mh = H * 0.14, cnt = Math.pow(2, n), cw = Math.min(34, (W - 24) / cnt);
      B4.txt(c, "Génération " + n + " : " + cnt + " molécule" + (cnt > 1 ? "s" : ""), 12, my - 14, B4.pal.ink, 12, "left"); B4.txt(c, "rouge = brin ancien (¹⁵N) · bleu = brin nouveau (¹⁴N)", 12, my + mh + 18, "#5f6b7a", 11, "left");
      var x0 = (W - cw * cnt) / 2;
      for (var i = 0; i < cnt; i++){
        var xa = x0 + i * cw + cw * 0.3, xb = x0 + i * cw + cw * 0.7;
        function strand(x, kind){
          if (kind === "r") S.draw.line(c, x, my, x, my + mh, "#b42318", 4);
          else if (kind === "b") S.draw.line(c, x, my, x, my + mh, "#1e3f8f", 4);
          else { var seg = 8, f = Math.round(seg / Math.pow(2, n)); for (var q = 0; q < seg; q++) S.draw.line(c, x, my + q * mh / seg, x, my + (q + 1) * mh / seg, (q * 7 % seg) < Math.max(f, n === 0 ? 8 : 0) ? "#b42318" : "#1e3f8f", 4); }
        }
        var ka, kb;
        if (n === 0){ ka = "r"; kb = "r"; }
        else if (M === "s"){ ka = i < 2 ? "r" : "b"; kb = "b"; }
        else if (M === "c"){ ka = i === 0 ? "r" : "b"; kb = i === 0 ? "r" : "b"; }
        else { ka = "m"; kb = "m"; }
        strand(xa, ka); strand(xb, kb);
      }
      var ob = sortb(bands("s", n)), pr = sortb(bands(M, n)), ok = same(ob, pr);
      var old = M === "s" ? (n === 0 ? 2 : 2) : M === "c" ? 2 : 2;
      ro.set(0, cnt); ro.set(1, n === 0 ? "2 (tous)" : (M === "d" ? "dispersés" : "2")); ro.set(2, pr.length + (pr.length > 1 ? " bandes" : " bande")); ro.set(3, ok ? "compatible" : "incompatible");
      nt.set(ok ? (M === "s" ? "Le modèle semi-conservatif prévoit exactement les bandes observées à toutes les générations. " : "À la génération " + n + ", ce modèle prévoit les mêmes bandes que l'observation : il faut regarder une autre génération pour le départager. ") + (n === 0 ? "Génération 0 : une molécule entièrement ancienne (¹⁵N). " : (M === "d" ? "Génération " + n + " : " + cnt + " molécules, toutes mêlant ancien et nouveau. " : "Génération " + n + " : " + cnt + " molécules, dont 2 contiennent un brin ancien. ")) + "(Tubes : bas = ADN lourd ¹⁵N, haut = léger ¹⁴N.)" : "Désaccord avec l'observation à la génération " + n + " : " + (M === "c" ? "ce modèle prévoit une bande lourde et une bande légère (pas de bande hybride)." : "ce modèle prévoit une seule bande de plus en plus légère, alors qu'on observe deux bandes.") + " Il est donc réfuté.", ok ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c08-caryotype", ch:"c08", tag:"Caryotype · comptage",
  titre:"Caryotype : chromosomes, chromatides et molécules d'ADN",
  resume:"Compte chromosomes et chromatides dans des cellules normales ou porteuses d'anomalies, avant et après réplication.",
  but:"Choisis la cellule et le stade (avant ou après réplication de l'ADN). Lis le nombre de chromosomes, de chromatides et de molécules d'ADN.",
  aRetenir:"Une cellule humaine somatique possède 46 chromosomes : 22 paires d'autosomes et 1 paire de chromosomes sexuels (XX ou XY). Les gamètes n'en ont que 23. Avant la réplication, chaque chromosome est formé d'une chromatide (1 molécule d'ADN) ; après, de deux chromatides sœurs : le nombre de chromosomes ne change pas, celui des chromatides double.",
  piege:"Ne confonds pas chromosome (une unité entière) et chromatide (une moitié de chromosome répliqué). 46 chromosomes à deux chromatides = 92 chromatides, pas 92 chromosomes.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var cell = k.select("Cellule", [["xx","Cellule de femme (46,XX)"],["xy","Cellule d'homme (46,XY)"],["t21","Trisomie 21 (47,XX,+21)"],["tur","Syndrome de Turner (45,X)"],["kli","Syndrome de Klinefelter (47,XXY)"],["ov","Ovule (23,X)"],["sp","Spermatozoïde (23,Y)"]], "xx");
    var rep = k.seg("Stade", [["0","Avant réplication (G1)"],["1","Après réplication (G2, début de mitose)"]], "0");
    var ro = k.readouts(["Chromosomes", "Chromatides", "Molécules d'ADN", "Quantité d'ADN"]);
    var nt = k.note("", "");
    var LEN = [1, .97, .8, .76, .74, .7, .65, .6, .58, .56, .55, .54, .48, .45, .44, .4, .38, .36, .31, .3, .24, .26];
    var DEF = {xx:{c:[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], sx:"XX", d:"46,XX"}, xy:{sx:"XY", d:"46,XY"}, t21:{sx:"XX", d:"47,XX,+21", extra:20}, tur:{sx:"X", d:"45,X"}, kli:{sx:"XXY", d:"47,XXY"}, ov:{sx:"X", d:"23,X", hap:true}, sp:{sx:"Y", d:"23,Y", hap:true}};
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, d = DEF[cell.value], hap = !!d.hap, r2 = rep.value === "1" && !hap, ncols = 12, cwid = (W - 16) / ncols, rowH = H * 0.44;
      var auto = 0, sexn = d.sx.length;
      function chrom(x, y, len, col){
        var h = len * rowH * 0.62;
        if (r2){ B4.rr(c, x - 5, y, 4, h, 2, col, null, 0); B4.rr(c, x + 1, y, 4, h, 2, col, null, 0); S.draw.dot(c, x, y + h * 0.4, 3, "#13233a"); }
        else { B4.rr(c, x - 2, y, 4, h, 2, col, null, 0); S.draw.dot(c, x, y + h * 0.4, 2.4, "#13233a"); }
      }
      for (var i = 0; i < 22; i++){
        var row = i < 12 ? 0 : 1, col = i < 12 ? i : i - 12, cx = 8 + (col + 0.5) * cwid, y = 14 + row * (rowH + 18), nco = hap ? 1 : (d.extra === i ? 3 : 2);
        for (var q = 0; q < nco; q++) chrom(cx + (q - (nco - 1) / 2) * (r2 ? 12 : 9), y, LEN[i], d.extra === i && q === 2 ? B4.pal.red : "#1e3f8f");
        auto += nco; B4.txt(c, i + 1 + "", cx, y + rowH * 0.62 + 12, "#5f6b7a", 11);
      }
      var sc = 8 + (10 + 0.5) * cwid, sy = 14 + (rowH + 18);
      B4.txt(c, "sexuels", 8 + 11.5 * cwid - 4, sy + rowH * 0.62 + 24, "#5f6b7a", 11);
      for (q = 0; q < sexn; q++){ var ch = d.sx[q]; chrom(8 + (10.2 + q * 0.5) * cwid + 2, sy + (ch === "Y" ? rowH * 0.3 * 0.62 : 0), ch === "X" ? 0.62 : 0.3, B4.pal.green); B4.txt(c, ch, 8 + (10.2 + q * 0.5) * cwid + 2, sy + rowH * 0.62 + 12, B4.pal.green, 12); }
      var nc = auto + sexn, nch = r2 ? 2 * nc : nc, ndna = nch, ploidy = hap ? "n = 23" : "2n";
      ro.set(0, nc); ro.set(1, nch); ro.set(2, ndna); ro.set(3, hap ? "1C (haploïde)" : r2 ? "4C" : "2C");
      var msg = "<b>" + d.d + ".</b> " + nc + " chromosomes";
      msg += hap ? " : un seul exemplaire de chaque (cellule haploïde, n = 23). " : " (" + auto + " autosomes + " + sexn + " sexuels). ";
      if (d.extra !== undefined) msg += "Trois exemplaires du chromosome 21 (en rouge) : trisomie 21. ";
      if (cell.value === "tur") msg += "Un seul chromosome sexuel X : syndrome de Turner. ";
      if (cell.value === "kli") msg += "Deux X et un Y : syndrome de Klinefelter. ";
      if (r2) msg += "Après réplication, chaque chromosome a 2 chromatides sœurs : " + nc + " chromosomes = " + nch + " chromatides = " + nch + " molécules d'ADN.";
      else msg += (hap ? "" : "Avant réplication, une chromatide par chromosome : " + nc + " chromatides.");
      nt.set(msg, d.extra !== undefined || cell.value === "tur" || cell.value === "kli" ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c08-genome", ch:"c08", tag:"Échelles · original",
  titre:"L'ADN bout à bout : quelle longueur ?",
  resume:"Compare la longueur d'ADN d'une cellule de plusieurs organismes à la taille de son noyau, puis mets-en bout à bout.",
  but:"Choisis un organisme et un nombre de cellules : lis la longueur d'ADN, le facteur de compaction et compare à des distances connues.",
  aRetenir:"Longueur d'ADN = nombre de paires de bases × 0,34 nm. Une cellule humaine contient ≈ 6,2·10⁹ paires de bases (2 jeux de 3,1·10⁹), soit ≈ 2 m d'ADN dans un noyau d'≈ 6 µm : l'ADN est compacté ≈ 350 000 fois, enroulé autour de protéines (histones) puis replié en chromosomes. Bout à bout, l'ADN des cellules d'un corps humain dépasse des centaines de fois la distance Terre–Soleil.",
  piege:"Ordres de grandeur seulement (valeurs arrondies, nombre de cellules du corps ≈ 4·10¹³). La taille du génome ne mesure pas la « complexité » d'un organisme.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var org = k.select("Organisme", [["ec","Bactérie E. coli (1 chromosome)"],["ye","Levure (cellule haploïde)"],["dm","Mouche drosophile (diploïde)"],["hu","Humain (diploïde)"]], "hu");
    var ne = k.slider("Nombre de cellules : 10 puissance", 0, 14, 1, 0, "");
    var ro = k.readouts(["Paires de bases par cellule", "ADN par cellule", "Compaction (ADN ÷ cellule/noyau)", "Longueur d'ADN totale"]);
    var nt = k.note("", "");
    var D = {ec:{n:"E. coli", bp:4.6e6, d:2e-6, lab:"bactérie (2 µm)"}, ye:{n:"levure", bp:1.2e7, d:5e-6, lab:"cellule (5 µm)"}, dm:{n:"drosophile", bp:2.8e8, d:5e-6, lab:"noyau (≈ 5 µm)"}, hu:{n:"humain", bp:6.2e9, d:6e-6, lab:"noyau (6 µm)"}};
    var BM = [["1 m", 1], ["tour de la Terre", 4.0e7], ["Terre–Lune", 3.84e8], ["Terre–Soleil", 1.5e11], ["Soleil–Neptune", 4.5e12]];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, d = D[org.value], Lc = d.bp * 0.34e-9, N = Math.pow(10, ne.value), Lt = Lc * N;
      var lo = -7, hi = 15, L = 14, Rr = W - 14;
      function PX(m){ return L + (Math.log10(m) - lo) / (hi - lo) * (Rr - L); }
      var ay = H * 0.34;
      S.draw.line(c, L, ay, Rr, ay, B4.pal.ink, 2);
      for (var e = lo; e <= hi; e += 2){ S.draw.line(c, PX(Math.pow(10, e)), ay - 5, PX(Math.pow(10, e)), ay + 5, B4.pal.ink, 1.5); B4.txt(c, "10" + (e < 0 ? "⁻" : "") + String(Math.abs(e)).replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }), PX(Math.pow(10, e)), ay + 18, "#5f6b7a", 11); }
      B4.txt(c, "longueur (m), échelle logarithmique", W / 2, ay + 38, "#5f6b7a", 12);
      S.draw.dot(c, PX(d.d), ay, 6, B4.pal.teal); B4.txt(c, d.lab, PX(d.d) + 4, ay - 30, B4.pal.teal, 12, "left"); S.draw.line(c, PX(d.d), ay - 24, PX(d.d), ay, B4.pal.teal, 1);
      S.draw.dot(c, PX(Lc), ay, 6, B4.pal.amber); B4.txt(c, "ADN d'une cellule", PX(Lc), ay - 58, B4.pal.amber, 12, Lc > 1e-2 ? "center" : "left"); S.draw.line(c, PX(Lc), ay - 52, PX(Lc), ay, B4.pal.amber, 1);
      S.draw.dot(c, PX(Lt), ay, 8, B4.pal.red); S.draw.line(c, PX(Lt), ay, PX(Lt), ay + 48, B4.pal.red, 2); B4.txt(c, "ADN de " + (N < 10 ? "1 cellule" : "10" + String(ne.value).replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }) + " cellules"), Math.min(W - 80, Math.max(80, PX(Lt))), ay + 58, B4.pal.red, 12);
      BM.forEach(function(b, i){ S.draw.line(c, PX(b[1]), ay - 4, PX(b[1]), ay + 5, B4.pal.green, 2.5); B4.txt(c, b[0], PX(b[1]), ay + 86 + i * 14, B4.pal.green, 11, i > 2 ? "right" : "left"); });
      var nbp = d.bp, comp = Lc / d.d, ratioSun = Lt / 1.5e11, txt;
      ro.set(0, S.sci(nbp, 2).replace(/<\/?sup>/g, function(t){ return t === "<sup>" ? "^" : ""; })); ro.set(1, B4.len(Lc)); ro.set(2, "× " + S.fmt(comp, 0)); ro.set(3, Lt >= 1e4 ? S.sci(Lt / 1000, 2) + " km" : B4.len(Lt));
      txt = "Chaque cellule de " + d.n + " renferme " + B4.len(Lc) + " d'ADN dans " + d.lab.replace(/\(.*\)/, "").trim() + " de " + (d.d * 1e6) + " µm : compaction ≈ " + S.fmt(comp, 0) + " fois. ";
      if (Lt > 1.5e11) txt += "Bout à bout, 10^" + ne.value + " cellules donneraient ≈ " + S.fmt(ratioSun, 0) + " fois la distance Terre–Soleil.";
      else if (Lt > 1) txt += "À cette échelle, la longueur dépasse déjà le mètre.";
      nt.set(txt, "");
    });
  }
});

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b4-3d-adn*/
SFA.sim({
  id:"b4-3d-adn", ch:"c08", tag:"3D · réplication",
  titre:"La double hélice en 3D et sa réplication semi-conservative",
  resume:"Tourne la double hélice, puis fais avancer la fourche de réplication : une molécule devient deux molécules identiques.",
  but:"Glisse pour tourner la molécule. Avance la fourche (curseur ou lecture) : l'hélicase ouvre la double hélice, l'ADN polymérase construit un brin neuf (orange) en face de chaque brin ancien (bleu).",
  aRetenir:"L'ADN est une double hélice de deux brins antiparallèles unis par des paires de bases : A–T (2 liaisons) et G–C (3 liaisons). La réplication est semi-conservative : chaque molécule fille garde un brin ancien et reçoit un brin neuf. Les deux molécules filles sont identiques à la molécule mère, car chaque base ancienne impose sa base complémentaire.",
  piege:"« Semi-conservative » ne veut pas dire que la moitié de l'ADN est perdue : chaque molécule fille est complète (deux brins), mais un seul des deux est neuf. Et A ne s'apparie jamais avec C ni G avec T.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(440), cam = B.cam(0.5, 0.18, 8);
    var N = 30, DH = 0.2, R = 0.5, TW = 0.628, SEQ = "ATGCGTACCTAGGCATTCGAATGCCGTAAC";
    var COMP = {A:"T", T:"A", G:"C", C:"G"};
    var BASE = {A:B.hex("#2e9e5b"), T:B.hex("#d64545"), G:B.hex("#2563eb"), C:B.hex("#e0a100")};
    var OLD = B.hex("#1e3f8f"), NEW = B.hex("#ea7a1a"), NEU = B.hex("#64748b");
    var prog = k.slider("Avancement de la fourche", 0, 100, 1, 0, "%");
    var colo = k.toggle("Colorer brins anciens / neufs", true);
    var rot = k.toggle("Rotation automatique", true, function(v){ cam.auto = v; });
    var ro = k.readouts(["Paires de bases copiées", "Molécules filles", "Brins anciens par molécule"]);
    var nt = k.note("", "");
    var playing = false, free = [];
    for (var i = 0; i < 7; i++) free.push({ph:Math.random()*6.3, b:"ATGC"[i % 4]});
    k.button("Lecture / pause", function(){ playing = !playing; if (playing && prog.value >= 100) prog.set(0); }, true);
    k.button("Recommencer", function(){ prog.set(0); playing = false; });
    B.drag(c, cam, function(){ render(); });
    function yy(i){ return (N / 2 - i) * DH; }
    function pos(i, ang, shift){ return [R * Math.sin(ang) + shift, yy(i), -R * Math.cos(ang)]; }
    var tclock = 0;
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, c.H * 0.115, 4);
      var f = N - (prog.value / 100) * N;      /* indice de la fourche : i < f = ADN parent */
      var fi = Math.floor(f);
      var useCol = colo.value;
      var cOld1 = useCol ? OLD : NEU, cOld2 = useCol ? OLD : NEU, cNew = useCol ? NEW : NEU;
      function sep(i){ return i < f ? 0 : 1.15 * Math.min(1, (i - f) / 7); }
      var prev = {};
      for (var i = 0; i < N; i++){
        var a1 = -i * TW, a2 = a1 + Math.PI, s = sep(i), b1 = SEQ[i], b2 = COMP[b1];
        var p1 = pos(i, a1, -s), p2 = pos(i, a2, s);
        var par = i < f, open = (i >= f - 2 && i < f);
        /* brin ancien 1 et brin ancien 2 */
        var q1 = pos(i, a1, -s), q2 = pos(i, a2, par ? 0 : s);
        if (par){ q1 = pos(i, a1, 0); }
        var cur = {o1:q1, o2:q2};
        if (i > 0){
          sc.tube(prev.o1, cur.o1, 0.075, cOld1);
          sc.tube(prev.o2, cur.o2, 0.075, cOld2);
        }
        sc.sphere(cur.o1, 0.11, cOld1); sc.sphere(cur.o2, 0.11, cOld2);
        /* barreaux */
        if (par){
          var mid = [(q1[0] + q2[0]) / 2, q1[1], (q1[2] + q2[2]) / 2], g = open ? 0.28 : 0;
          var m1 = [q1[0] + (mid[0] - q1[0]) * (1 - g), q1[1], q1[2] + (mid[2] - q1[2]) * (1 - g)];
          var m2 = [q2[0] + (mid[0] - q2[0]) * (1 - g), q2[1], q2[2] + (mid[2] - q2[2]) * (1 - g)];
          if (g){ m1 = [q1[0] + (mid[0] - q1[0]) * 0.55, q1[1], q1[2] + (mid[2] - q1[2]) * 0.55]; m2 = [q2[0] + (mid[0] - q2[0]) * 0.55, q2[1], q2[2] + (mid[2] - q2[2]) * 0.55]; }
          sc.tube(q1, m1, 0.05, BASE[b1]); sc.tube(q2, m2, 0.05, BASE[b2]);
          if (!g){ sc.sphere(mid, 0.05, B.hex("#f8fafc")); }
        } else if (i >= f + 1){
          /* brins neufs : en face de chaque brin ancien */
          var n1 = pos(i, a2, -s), n2 = pos(i, a1, s);
          var pn = prev.n1 ? prev : null;
          if (prev.n1 && prev.ok){ sc.tube(prev.n1, n1, 0.075, cNew); sc.tube(prev.n2, n2, 0.075, cNew); }
          sc.sphere(n1, 0.11, cNew); sc.sphere(n2, 0.11, cNew);
          sc.tube(q1, [(q1[0] + n1[0]) / 2, q1[1], (q1[2] + n1[2]) / 2], 0.05, BASE[b1]);
          sc.tube(n1, [(q1[0] + n1[0]) / 2, q1[1], (q1[2] + n1[2]) / 2], 0.05, BASE[b2]);
          sc.tube(q2, [(q2[0] + n2[0]) / 2, q2[1], (q2[2] + n2[2]) / 2], 0.05, BASE[b2]);
          sc.tube(n2, [(q2[0] + n2[0]) / 2, q2[1], (q2[2] + n2[2]) / 2], 0.05, BASE[b1]);
          cur.n1 = n1; cur.n2 = n2; cur.ok = true;
        } else if (i >= f){
          /* juste derrière la fourche : bases exposées, nucléotides libres attendus */
          sc.tube(q1, [q1[0] + (-q1[0] * 0 + 0.0), q1[1], q1[2]], 0.01, BASE[b1]);
          var e1 = [q1[0] * 0.55 + (-s * 0.45), q1[1], q1[2] * 0.55], e2 = [q2[0] * 0.55 + (s * 0.45), q2[1], q2[2] * 0.55];
          sc.tube(q1, e1, 0.05, BASE[b1]); sc.tube(q2, e2, 0.05, BASE[b2]);
        }
        prev = cur;
      }
      /* nucléotides libres autour de la fourche + enzymes */
      if (prog.value > 0 && prog.value < 100){
        var fy = yy(f), fs = 0.0;
        for (var j = 0; j < free.length; j++){
          var fr = free[j], ang = fr.ph + tclock * 1.3, side = j % 2 ? 1 : -1;
          var P = [side * (1.25 + 0.35 * Math.sin(ang * 0.7)) + side * 0.2, fy - 0.45 - 0.25 * j % 1.2 - 0.2 * Math.sin(ang), 0.8 * Math.cos(ang)];
          sc.sphere(P, 0.1, BASE[fr.b], 0.9);
        }
        sc.sphere([0, fy + 0.18, 0], 0.34, B.hex("#8b5cf6"), 0.9);
        sc.label([0, fy + 0.18, 0], "hélicase", "#5b21b6", 12, 0, -26);
        sc.label([-1.25, fy - 0.9, 0], "ADN polymérase", "#b45309", 11, -4, 0, "right");
      }
      if (prog.value === 0) sc.label([0, yy(0) + 0.6, 0], "ADN parent", "#0f1b2d", 12, 0, 0);
      if (prog.value > 50){ sc.label([-1.6, yy(N - 1) - 0.4, 0], "molécule fille 1", "#1e3f8f", 12, 0, 0); sc.label([1.6, yy(N - 1) - 0.4, 0], "molécule fille 2", "#1e3f8f", 12, 0, 0); }
      sc.flush();
      /* légende */
      var ctx = c.ctx, lx = 12, ly = c.H - 64; ctx.save(); ctx.font = "700 11px Mulish,system-ui,sans-serif"; ctx.textBaseline = "middle";
      [["A", "#2e9e5b"], ["T", "#d64545"], ["G", "#2563eb"], ["C", "#e0a100"]].forEach(function(q, n){ ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(lx + 8 + n * 34, ly, 7, 0, 6.3); ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(q[0], lx + 8 + n * 34, ly + 1); });
      ctx.textAlign = "left"; ctx.fillStyle = "#1e3f8f"; ctx.fillText("■ brin ancien", lx, ly + 24); ctx.fillStyle = "#ea7a1a"; ctx.fillText("■ brin neuf", lx + 86, ly + 24);
      ctx.restore();
      B.hint(c);
      var done = Math.round(prog.value / 100 * N);
      ro.set(0, done + " / " + N); ro.set(1, prog.value >= 100 ? "2 (terminée)" : (prog.value === 0 ? "1 (mère)" : "en cours")); ro.set(2, "1 ancien + 1 neuf");
      if (prog.value === 0) nt.set("Avant la réplication : une seule molécule, deux brins complémentaires. Avance la fourche.", "");
      else if (prog.value < 100) nt.set("L'hélicase ouvre la double hélice. Face à chaque base ancienne, l'ADN polymérase place la base complémentaire (A–T, G–C). Regarde : les deux nouvelles molécules sont déjà identiques entre elles.", "");
      else nt.set("Réplication terminée : deux molécules identiques, chacune formée d'un brin ancien (bleu) et d'un brin neuf (orange). C'est le principe semi-conservatif (expérience de Meselson et Stahl).", "ok");
    }
    k.draw(render);
    var L = k.loop(function(dt){
      tclock += dt; B.spin(cam, dt);
      if (playing){ var v = prog.value + dt * 6; if (v >= 100){ v = 100; playing = false; } prog.set(v); }
      render();
    });
    L.play();
  }
});
/*B3D-ADD-END:b4-3d-adn*/
