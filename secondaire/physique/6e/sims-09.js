/* Chapitre 9 · Atome, noyau et radioactivité */
SFA.sim({
  id: "p6-c09-bohr", ch: "c09", tag: "Classique",
  titre: "L'atome de Bohr : niveaux d'énergie et photons",
  resume: "E_n = −13,6 eV/n² : un saut d'un niveau à l'autre émet ou absorbe un photon de couleur précise.",
  but: "Choisis le niveau de départ et d'arrivée de l'électron de l'atome d'hydrogène. Si l'électron descend, un photon est émis ; s'il monte, un photon est absorbé. Lis l'énergie, la longueur d'onde et la couleur.",
  aRetenir: "Dans le modèle de Bohr, l'énergie de l'électron de l'hydrogène est quantifiée : E_n = −13,6 eV / n². Lors d'un saut, le photon échangé a l'énergie |ΔE| = h·f = h·c/λ, donc λ = 1 240 eV·nm / |ΔE|. Retour au niveau n = 2 : raies visibles de la série de Balmer ; au niveau n = 1 : ultraviolet (Lyman) ; au niveau n = 3 : infrarouge (Paschen).",
  piege: "Les niveaux sont discrets : l'atome n'absorbe qu'un photon d'énergie exactement égale à un écart entre deux niveaux (pas n'importe quelle couleur). Le modèle de Bohr est une première approche : l'électron n'est pas vraiment sur une orbite ; il n'explique bien que l'hydrogène (et les ions à un électron).",
  build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette, H = PH6;
    var ni = k.slider("Niveau de départ n", 1, 6, 1, 3, "", function(){ T0 = t; chk(); });
    var nf = k.slider("Niveau d'arrivée n'", 1, 6, 1, 2, "", function(){ T0 = t; chk(); });
    var ro = k.readouts(["Énergie de départ", "Énergie d'arrivée", "Énergie du photon", "Longueur d'onde", "Domaine / série"]);
    var nt = k.note("", "ok"), goal = null, T0 = 0, t = 0;
    var BAL = [[410.2, "violet"], [434.0, "bleu"], [486.1, "bleu-vert"], [656.3, "rouge"]];
    k.button("Défi : trouve la transition", function(){ goal = BAL[Math.floor(Math.random() * 4)]; chk(); }, true);
    function E(n){ return -13.6 / (n * n); }
    function lamOf(a, b){ return a === b ? NaN : 1239.84 / Math.abs(E(a) - E(b)); }
    function chk(){ if (!goal) return; var l = lamOf(ni.value, nf.value), ok = Math.abs(l - goal[0]) < 1.5; nt.set("<b>Défi :</b> produis un photon de <b>" + S.fmt(goal[0], 1) + " nm</b> (" + goal[1] + ") en <b>émission</b>. " + (ok && ni.value > nf.value ? "Réussi : n = " + ni.value + " → n' = " + nf.value + " (série de Balmer) !" : isNaN(l) ? "" : "Ton photon : " + S.fmt(l, 1) + " nm."), ok && ni.value > nf.value ? "ok" : "warn"); }
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    function rad(n, R){ return R * (0.16 + 0.84 * Math.sqrt((n * n - 1) / 35)); }
    function hx(col){ var m = /(\d+)\D+(\d+)\D+(\d+)/.exec(col); if (!m || col.charAt(0) === "#") return col; return "#" + [1, 2, 3].map(function(i){ return ("0" + (+m[i]).toString(16)).slice(-2); }).join(""); }
    function ease(u){ u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, a = ni.value, b = nf.value, em = a > b, same = a === b;
      H.bg(c, "#f8fafd", "#eaf0f7");
      var narrow = W < 520, cx = W * 0.27, cy = Hh / 2, R = Math.min(W * 0.2, Hh / 2 - 12);
      var lamN = lamOf(a, b), vis = lamN >= 380 && lamN <= 750, pc = same ? "#8a95a3" : vis ? P6.rgb(lamN) : "#8a95a3";
      /* noyau et orbites */
      S.draw.glow(c, cx, cy, 30, "#ff8a65", 0.5);
      for (var n = 1; n <= 6; n++){ var r = rad(n, R), on = n === a || n === b; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = on ? P.acc : "#d0d8e4"; ctx.lineWidth = on ? 2.2 : 1.1; ctx.setLineDash(on ? [] : [3, 4]); ctx.stroke(); ctx.setLineDash([]); S.draw.text(c, String(n), cx + r * 0.71 + 8, cy - r * 0.71 - 3, {size: 11.5, color: on ? P.acc : P.grey, weight: 700}); }
      var rg = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 9); rg.addColorStop(0, "#ff9e80"); rg.addColorStop(1, P.red); ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 7); ctx.fillStyle = rg; ctx.fill();
      S.draw.text(c, "+", cx, cy, {size: 13, color: "#fff"});
      /* cycle de 4 s : photon et saut */
      var p = (t - T0) % 4, ang = t * 1.6, rcur, ph = null;
      if (same){ rcur = rad(a, R); }
      else if (em){ var j = ease((p - 0.8) / 0.5); rcur = rad(a, R) + (rad(b, R) - rad(a, R)) * j; if (p > 0.8) ph = {u: (p - 0.8) / 3.2, dir: 1}; }
      else { var j2 = ease((p - 1.0) / 0.5); rcur = rad(a, R) + (rad(b, R) - rad(a, R)) * j2; if (p < 1.0) ph = {u: p / 1.0, dir: 0}; }
      var ex = cx + rcur * Math.cos(ang), ey = cy - rcur * Math.sin(ang);
      /* photon : paquet d'onde le long de la droite horizontale passant par le noyau */
      if (ph){
        var len = 54, start = ph.dir ? cx + rad(b, R) * 0.5 : cx - R - 70, endx = ph.dir ? W - 30 : cx - 8;
        var head = ph.dir ? start + (endx - start) * ph.u : start + (endx - start) * ph.u;
        var al = ph.dir ? 1 - ph.u * 0.6 : 1;
        ctx.save(); ctx.globalAlpha = al; ctx.lineWidth = 3.2; ctx.strokeStyle = pc; ctx.beginPath();
        for (var q = 0; q <= 50; q++){ var u = q / 50, xx = head - len * (1 - u) * (ph.dir ? 1 : 1), env = Math.sin(Math.PI * u); var yy = cy + 9 * env * Math.sin(q * 0.75 - t * 14); q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore();
        S.draw.glow(c, head - len / 2, cy, 36, hx(pc), 0.35 * al);
        if (!ph.dir || ph.u < 0.8) S.draw.label(c, (same ? "" : S.fmt(Math.abs(E(a) - E(b)), 2) + " eV · " + S.fmt(lamN, 0) + " nm"), Math.max(70, Math.min(W - 70, head - len / 2)), cy - 34, {color: vis ? P.ink : P.grey, size: 11});
      }
      S.draw.glow(c, ex, ey, 14, P.acc, 0.35); var eg = ctx.createRadialGradient(ex - 2, ey - 2, 1, ex, ey, 7.5); eg.addColorStop(0, "#7ea3e6"); eg.addColorStop(1, P.acc); ctx.beginPath(); ctx.arc(ex, ey, 7.5, 0, 7); ctx.fillStyle = eg; ctx.fill(); S.draw.text(c, "−", ex, ey, {size: 11, color: "#fff"});
      S.draw.text(c, "rayons des orbites non à l'échelle", cx, Hh - 8, {size: 10, color: P.grey, weight: 600});
      /* diagramme d'énergie */
      var x0d = W * 0.56, x1d = W - 14, yE = function(e){ return 30 + (0 - e) / 13.6 * (Hh - 64); };
      S.draw.line(c, x0d, yE(0), x1d, yE(0), P.grey, 1.2, [4, 4]); S.draw.text(c, "0 eV : atome ionisé", x1d, yE(0) - 12, {size: 10.5, align: "right", color: P.grey});
      for (n = 1; n <= 6; n++){ var y = yE(E(n)), on = n === a || n === b; S.draw.line(c, x0d, y, x1d, y, on ? P.acc : "#aab3c0", on ? 3.4 : 1.6);
        if (on || n <= 3) S.draw.text(c, "n = " + n + "   " + S.fmt(E(n), 2) + " eV", x0d + 2, y - 9, {size: 11, align: "left", color: on ? P.acc : P.grey, weight: on ? 800 : 600}); }
      if (!same){ var xm = (x0d + x1d) / 2; S.draw.arrow(c, xm, yE(E(a)), xm, yE(E(b)), em ? P.red : P.green, 3.4); S.draw.label(c, em ? "émission" : "absorption", xm + 4, (yE(E(a)) + yE(E(b))) / 2, {color: em ? P.red : P.green, size: 11, align: "left"}); }
      var dE = same ? 0 : Math.abs(E(a) - E(b)), lam = lamN;
      var dom = isNaN(lam) ? "—" : lam < 380 ? "ultraviolet" : lam > 750 ? "infrarouge" : "visible";
      var serie = b === 1 || a === 1 ? "Lyman (retour à n = 1)" : b === 2 || a === 2 ? "Balmer (n = 2)" : b === 3 || a === 3 ? "Paschen (n = 3)" : "autres séries (infrarouge)";
      ro.set(0, S.fmt(E(a), 2) + " eV"); ro.set(1, S.fmt(E(b), 2) + " eV"); ro.set(2, dE ? S.fmt(dE, 3) + " eV" : "—"); ro.set(3, dE ? S.fmt(lam, 1) + " nm" : "—"); ro.set(4, dE ? dom + " · " + serie : "—");
      if (!goal) nt.set(same ? "Même niveau au départ et à l'arrivée : aucun photon échangé." : em ? "Émission : l'électron descend de n = " + a + " à n = " + b + ", l'atome émet un photon de " + S.fmt(dE, 2) + " eV." : "Absorption : l'atome absorbe un photon de " + S.fmt(dE, 2) + " eV et l'électron monte de n = " + a + " à n = " + b + ". Tout autre photon est ignoré.", "ok");
    });
    chk();
  }
});

SFA.sim({
  id: "p6-c09-decroissance", ch: "c09", tag: "Dés virtuels",
  titre: "La décroissance radioactive : hasard et loi exponentielle",
  resume: "Chaque noyau se désintègre au hasard, mais l'ensemble suit N = N₀·2^(−t/T½).",
  but: "Chaque carré est un noyau. À chaque instant, chacun a la même probabilité de se désintégrer. Lance la simulation avec peu puis beaucoup de noyaux, et compare le nombre restant à la loi exponentielle.",
  aRetenir: "Un noyau instable se désintègre de façon aléatoire, sans « horloge » ni mémoire. Sur un grand nombre de noyaux, la loi est régulière : N(t) = N₀·2^(−t/T½), où la demi-vie T½ est la durée au bout de laquelle la moitié des noyaux restants s'est désintégrée. Après 2 T½ il en reste 1/4, après 3 T½ 1/8 : jamais zéro en un temps fini.",
  piege: "Une demi-vie n'est pas « la moitié du temps pour que tout disparaisse ». Au bout de 2 demi-vies, il reste encore 25 % des noyaux, pas 0 %. Et pour un petit nombre de noyaux, le hasard fait fortement dévier la courbe de la loi : la loi n'est précise que pour de grands nombres.",
  build: function(k, S){
    var c = k.canvas(230), g = k.canvas(230), P = S.draw.palette;
    var N0 = k.slider("Nombre de noyaux N₀", 20, 800, 20, 200, "", function(){ reset(); });
    var iso = k.select("Noyau (pour l'échelle de temps)", [["h", "Technétium 99m : T½ = 6,0 heures"], ["d", "Iode 131 : T½ = 8,0 jours"], ["a", "Carbone 14 : T½ = 5 730 ans"], ["u", "Uranium 238 : T½ = 4,47 milliards d'années"]], "a");
    var multi = k.toggle("Refaire l'expérience 4 fois (courbes pâles)", true, function(){ reset(); });
    k.button("Recommencer", function(){ reset(); }, true);
    var ro = k.readouts(["Temps écoulé", "Noyaux restants", "Fraction restante", "Prévue par la loi"]);
    var alive, flash, t, hist, lastN, runs, tPer = 3.5, decayed = 0;   /* 1 demi-vie = 3,5 s d'animation */
    function reset(){ var n = N0 ? N0.value : 200; alive = []; flash = []; for (var i = 0; i < n; i++){ alive.push(true); flash.push(0); } t = 0; hist = [[0, n]]; lastN = n; decayed = 0; runs = []; for (var r = 0; r < 4; r++) runs.push({n: n, h: [[0, n]]}); }
    reset();
    var lp = k.loop(function(dt){
      var th = dt / tPer, p = 1 - Math.pow(2, -th);
      for (var f = 0; f < flash.length; f++) flash[f] = Math.max(0, flash[f] - dt * 2.2);
      if (t < 6){
        t += th; var cnt = 0, d0 = 0;
        for (var i = 0; i < alive.length; i++){ if (alive[i] && Math.random() < p){ alive[i] = false; flash[i] = 1; d0++; } if (alive[i]) cnt++; }
        hist.push([t, cnt]); lastN = cnt; decayed = d0;
        if (multi.value) runs.forEach(function(r){ var dd = 0; for (var q = 0; q < r.n; q++) if (Math.random() < p) dd++; r.n -= dd; r.h.push([t, r.n]); });
      }
      k.redraw();
    });
    lp.play();
    var units = {h: ["h", 6], d: ["jours", 8], a: ["ans", 5730], u: ["Ga", 4.47]};
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, n = alive.length, top = 34, cols = Math.ceil(Math.sqrt(n * W / (H - top))), rows = Math.ceil(n / cols), cs = Math.min((W - 20) / cols, (H - top - 10) / rows);
      var ox = (W - cols * cs) / 2;
      for (var i = 0; i < n; i++){ var cx = ox + (i % cols) * cs, cy = top + Math.floor(i / cols) * cs, fl = flash[i];
        ctx.fillStyle = alive[i] ? P.acc : fl > 0 ? "rgba(192,50,29," + (0.25 + 0.75 * fl) + ")" : "#e1e6ee"; S.draw.rrect(c, cx + 0.5, cy + 0.5, cs - 1.8, cs - 1.8, Math.min(3, cs / 4)); ctx.fill(); }
      S.draw.label(c, "noyaux intacts : " + lastN, 12, 14, {color: P.acc, size: 12, align: "left"});
      S.draw.label(c, "désintégrés : " + (n - lastN), W - 12, 14, {color: P.red, size: 12, align: "right"});
      var ax = S.draw.axes(g, {x0: 0, x1: 6, y0: 0, y1: 1.05, xl: "t / T½", yl: "N / N₀", l: 46, t: 14, stepX: 1, stepY: 0.25});
      var gc = g.ctx; gc.save(); gc.beginPath(); gc.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); gc.clip();
      if (multi.value) runs.forEach(function(r){ gc.strokeStyle = "rgba(31,75,158,.28)"; gc.lineWidth = 1.5; gc.beginPath(); r.h.forEach(function(h, j){ var X = ax.X(h[0]), Y = ax.Y(h[1] / n); if (j) gc.lineTo(X, Y); else gc.moveTo(X, Y); }); gc.stroke(); });
      gc.strokeStyle = P.acc; gc.lineWidth = 2.8; gc.beginPath();
      hist.forEach(function(h, j){ var X = ax.X(h[0]), Y = ax.Y(h[1] / n); if (j) gc.lineTo(X, Y); else gc.moveTo(X, Y); }); gc.stroke(); gc.restore();
      S.draw.fn(g, ax, function(x){ return Math.pow(2, -x); }, P.red, 2.2, [6, 4]);
      [1, 2, 3].forEach(function(m){ var yy = Math.pow(2, -m); S.draw.dot(g, ax.X(m), ax.Y(yy), 3.5, P.red); S.draw.text(g, m === 1 ? "1/2" : m === 2 ? "1/4" : "1/8", ax.X(m) + 6, ax.Y(yy) - 10, {size: 11, color: P.red, align: "left"}); });
      S.draw.legend(g, [[P.red, "loi 2^(−t/T½)", true], [P.acc, "ta simulation"]].concat(multi.value ? [["rgba(31,75,158,.4)", "4 autres essais"]] : []), ax.R - 6, ax.T + 4, {align: "right"});
      var u = units[iso.value], tt = t * u[1];
      ro.set(0, S.fmt(t, 2) + " T½ = " + (iso.value === "a" ? S.fmt(tt, 0) : S.fmt(tt, 1)) + " " + u[0]); ro.set(1, lastN + " sur " + n); ro.set(2, S.fmt(lastN / n * 100, 1) + " %"); ro.set(3, S.fmt(Math.pow(2, -t) * n, 1) + " noyaux (" + S.fmt(Math.pow(2, -t) * 100, 1) + " %)");
    });
  }
});

SFA.sim({
  id: "p6-c09-carbone14", ch: "c09", tag: "Datation",
  titre: "Datation au carbone 14 : comment on date un fossile",
  resume: "Âge = T½ · log₂(N₀/N) : de la fraction de carbone 14 restante à l'âge d'un os, d'un bois, d'un tissu.",
  but: "Choisis un objet célèbre ou règle l'âge (ou la fraction de ¹⁴C restante). Le temps défile depuis la mort de l'organisme : ses atomes de ¹⁴C se désintègrent un à un (ils deviennent de l'azote 14), le compteur descend et le point parcourt la courbe. Glisse sur la courbe pour remonter ou avancer le temps. Les demi-vies de 5 730 ans sont repérées.",
  aRetenir: "Les êtres vivants échangent du carbone avec l'atmosphère : leur teneur en ¹⁴C est constante. À leur mort, elle décroît avec la demi-vie de 5 730 ans. En mesurant la fraction restante f = N/N₀, on déduit l'âge : t = T½·log₂(1/f) = 5 730 × ln(1/f)/ln 2. La méthode s'applique à des matières organiques de moins de 50 000 ans environ.",
  piege: "La méthode ne date que la mort de l'organisme, pas la fabrication d'un outil, et elle ne marche pas sur la pierre ou les métaux. Au-delà de ~50 000 ans il reste moins de 0,3 % du ¹⁴C : trop peu pour mesurer. Les âges réels sont corrigés par étalonnage (cernes d'arbres) : modèle simplifié ici. Les atomes dessinés sont grossis et beaucoup trop nombreux : en réalité, environ 1 atome de carbone sur 10¹² seulement est du ¹⁴C.",
  build: function(k, S){
    var P = S.draw.palette, T = 5730, N0 = 200, A0 = 13.6;   /* A0 : activité du carbone « vivant » ≈ 13,6 désintégrations par minute et par gramme de C */
    /* canevas dont le rapport hauteur/largeur change sur téléphone */
    function rcv(desk, phone){
      var cv = k.canvas(0, {ratio: desk});
      Object.defineProperty(cv, "ratio", {get: function(){ var w = cv.cv.parentNode ? cv.cv.parentNode.clientWidth : 600; return w < 460 ? phone : desk; }, configurable: true});
      cv.resize(); return cv;
    }
    function yrs(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
    function mix(a, b, u){ var h = function(s){ return [1, 3, 5].map(function(i){ return parseInt(s.substr(i, 2), 16); }); }, x = h(a), y = h(b); return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(x[i] + (y[i] - x[i]) * u); }).join(",") + ")"; }
    var SH = {"": "os", "5300": "os", "4600": "bois", "2000": "parchemin", "17000": "charbon", "40000": "os"};
    var NM = {"": "Os fossile", "5300": "Ötzi · fragment d'os", "4600": "Khéops · bois du mortier", "2000": "Rouleau · parchemin", "17000": "Lascaux · charbon de bois", "40000": "Outil en os"};
    var GEN = {os: "Os fossile", bois: "Morceau de bois", parchemin: "Parchemin", charbon: "Charbon de bois"};
    var shape = "os", lab = NM[""];
    var c = rcv(0.76, 1.24), g = k.canvas(220);
    var obj = k.select("Objet (âge approximatif)", [["", "— à régler soi-même —"], ["5300", "Ötzi, l'homme des glaces (≈ 5 300 ans)"], ["4600", "Pyramide de Khéops (≈ 4 600 ans)"], ["2000", "Rouleaux de la mer Morte (≈ 2 000 ans)"], ["17000", "Peintures de Lascaux (≈ 17 000 ans)"], ["40000", "Outil en os du Paléolithique (≈ 40 000 ans)"]], "", function(v){
      if (v){ mode.set("age"); age.set(parseFloat(v)); }
      shape = SH[v] || shape; lab = v ? NM[v] : GEN[shape]; start();
    });
    var mode = k.seg("Je règle", [["age", "l'âge"], ["frac", "la fraction restante"]], "age", function(){ start(); });
    var age = k.slider("Âge de l'échantillon", 0, 60000, 100, 5300, "ans", function(){ mode.set("age"); manual(); });
    var fr = k.slider("Fraction de ¹⁴C restante", 0.1, 100, 0.1, 50, "%", function(){ mode.set("frac"); manual(); });
    k.button("▶ Faire passer le temps", function(){ start(); }, true);
    var boucle = k.toggle("Rejouer en boucle", true);
    var ro = k.readouts(["Fraction restante f", "Âge t", "Nombre de demi-vies", "Reste à mesurer"]);
    var nt = k.note("", "ok");

    /* --- état de l'animation : st.t = temps écoulé depuis la mort (ans) --- */
    var st = {t: 0, anim: true, hold: 0}, clock = 0, led = -9, fx = [];
    function target(){ return mode.value === "age" ? age.value : T * Math.log(100 / fr.value) / Math.LN2; }
    function start(){ st.t = 0; st.anim = true; st.hold = 0; }
    function manual(){ obj.set(""); lab = GEN[shape]; st.anim = false; st.hold = 0; }

    /* --- atomes : positions tirées une fois par forme ; ¹⁴C à « durées de vie » réparties (rang i → seuil (i + ½)/N₀) --- */
    var seed = 7;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var SHP = {
      os: {hu: 1.12, hv: 0.5, inside: function(u, v){
        if (Math.abs(u) <= 0.8 && Math.abs(v) <= 0.15 + 0.07 * u * u) return true;
        var e = [[-0.8, -0.19, 0.25], [-0.84, 0.17, 0.27], [0.8, -0.19, 0.25], [0.84, 0.17, 0.27]];
        for (var i = 0; i < 4; i++){ var du = u - e[i][0], dv = v - e[i][1]; if (du * du + dv * dv < e[i][2] * e[i][2]) return true; }
        return false; }},
      bois: {hu: 1.05, hv: 0.5, inside: function(u, v){ if (u >= -0.95 && u <= 0.82 && Math.abs(v) <= 0.36) return true; var du = (u - 0.82) / 0.14, dv = v / 0.4; return du * du + dv * dv < 1; }},
      parchemin: {hu: 1.05, hv: 0.5, inside: function(u, v){ return Math.abs(u) <= 0.8 && Math.abs(v) <= 0.36; }}
    };
    SHP.charbon = SHP.bois;
    var cache = {};
    function atoms(sh){
      if (cache[sh]) return cache[sh];
      var D = SHP[sh], pts = [], tries = 0, dmin = 0.085, i, j;
      seed = sh.length * 977 + 13;
      while (pts.length < N0 && tries < 40000){
        tries++; var u = (rnd() * 2 - 1) * D.hu, v = (rnd() * 2 - 1) * D.hv;
        if (!D.inside(u, v) || !D.inside(u + 0.05, v) || !D.inside(u - 0.05, v) || !D.inside(u, v + 0.05) || !D.inside(u, v - 0.05)) continue;
        var ok = true; for (j = 0; j < pts.length; j++){ var a = pts[j].u - u, b = pts[j].v - v; if (a * a + b * b < dmin * dmin){ ok = false; break; } }
        if (ok || tries > 30000) pts.push({u: u, v: v});
      }
      var rank = pts.map(function(p, i){ return i; });
      for (i = rank.length - 1; i > 0; i--){ j = Math.floor(rnd() * (i + 1)); var q = rank[i]; rank[i] = rank[j]; rank[j] = q; }
      pts.forEach(function(p, i){ p.th = (rank[i] + 0.5) / N0; p.alive = true; p.ph = rnd() * 6.28; p.dir = rnd() * 6.28; });
      var c12 = [];
      while (c12.length < 160){ var u2 = (rnd() * 2 - 1) * D.hu, v2 = (rnd() * 2 - 1) * D.hv; if (D.inside(u2, v2)) c12.push({u: u2, v: v2}); }
      cache[sh] = {c14: pts, c12: c12};
      return cache[sh];
    }
    /* décor : cailloux et nuages fixes */
    seed = 4242; var peb = [], clouds = [];
    for (var i = 0; i < 70; i++) peb.push({x: rnd(), y: rnd(), r: 1.5 + rnd() * 3.5, s: rnd()});
    for (i = 0; i < 3; i++) clouds.push({x: rnd(), y: 0.25 + rnd() * 0.5, s: 0.7 + rnd() * 0.5, v: 0.006 + rnd() * 0.01});

    var lp = k.loop(function(dt){
      clock += dt;
      var tg = target();
      if (st.anim){
        var dur = Math.max(3, Math.min(5.5, tg / T * 2.2)), rate = Math.max(1, tg / dur);   /* environ 2,2 s par demi-vie, entre 3 et 5,5 s en tout */
        st.t = Math.min(tg, st.t + rate * dt);
        if (st.t >= tg){ st.anim = false; st.hold = 0; }
      } else if (boucle.value){
        st.hold += dt; if (st.hold > 2.6 && tg > 0) start();
      }
      for (var j = fx.length - 1; j >= 0; j--){ fx[j].a += dt; if (fx[j].a > 0.8) fx.splice(j, 1); }
      k.redraw();
    });
    lp.play();

    /* glisser sur la courbe = régler l'âge à la main */
    var GA = {};
    g.cv.style.touchAction = "none"; g.cv.style.cursor = "ew-resize";
    g.pointer(function(tp, p){
      if ((tp === "down" || tp === "drag") && GA.ax){
        var a = Math.max(0, Math.min(60000, GA.ax.ix(p.x)));
        mode.set("age"); age.set(Math.round(a / 100) * 100); manual(); k.redraw();
      }
    });

    /* --- dessins --- */
    function drawShape(ctx, sh, X, Y, s, aged){
      ctx.save(); ctx.lineJoin = "round";
      if (sh === "os"){
        var col = mix("#f3e7c9", "#b8925e", aged), dark = mix("#c9b183", "#7a5a32", aged);
        var ends = [[-0.8, -0.19, 0.25], [-0.84, 0.17, 0.27], [0.8, -0.19, 0.25], [0.84, 0.17, 0.27]];
        function shaft(){ ctx.beginPath(); for (var q = 0; q <= 32; q++){ var u = -0.82 + 1.64 * q / 32; ctx.lineTo(X(u), Y(-(0.15 + 0.07 * u * u))); } for (q = 32; q >= 0; q--){ var u2 = -0.82 + 1.64 * q / 32; ctx.lineTo(X(u2), Y(0.15 + 0.07 * u2 * u2)); } ctx.closePath(); }
        /* ombre portée */
        ctx.save(); ctx.translate(6, 9); ctx.fillStyle = "rgba(40,24,10,.28)"; shaft(); ctx.fill(); ends.forEach(function(e){ ctx.beginPath(); ctx.arc(X(e[0]), Y(e[1]), e[2] * s, 0, 7); ctx.fill(); }); ctx.restore();
        /* contour (trait épais dessous) puis remplissage */
        ctx.strokeStyle = mix("#8a7350", "#4a3418", aged); ctx.lineWidth = 3;
        shaft(); ctx.stroke(); ends.forEach(function(e){ ctx.beginPath(); ctx.arc(X(e[0]), Y(e[1]), e[2] * s, 0, 7); ctx.stroke(); });
        var gr = ctx.createLinearGradient(0, Y(-0.45), 0, Y(0.45)); gr.addColorStop(0, mix("#fffaf0", "#d2b080", aged)); gr.addColorStop(0.35, col); gr.addColorStop(1, dark);
        ctx.fillStyle = gr; shaft(); ctx.fill(); ends.forEach(function(e){ ctx.beginPath(); ctx.arc(X(e[0]), Y(e[1]), e[2] * s, 0, 7); ctx.fill(); });
        /* reflet et fissures */
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = Math.max(2, s * 0.03); ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(X(-0.62), Y(-0.1)); ctx.quadraticCurveTo(X(0), Y(-0.07), X(0.62), Y(-0.1)); ctx.stroke();
        ctx.strokeStyle = "rgba(90,60,30," + (0.25 + 0.4 * aged) + ")"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(X(-0.3), Y(0.05)); ctx.lineTo(X(-0.22), Y(0.12)); ctx.lineTo(X(-0.25), Y(0.18)); ctx.moveTo(X(0.35), Y(-0.15)); ctx.lineTo(X(0.42), Y(-0.05)); ctx.moveTo(X(0.86), Y(0.05)); ctx.lineTo(X(0.95), Y(0.12)); ctx.stroke();
      } else if (sh === "bois" || sh === "charbon"){
        var ch = sh === "charbon", bark = ch ? "#2b2622" : "#6b4527", barkD = ch ? "#141210" : "#3f2814", face = ch ? "#3a3430" : "#d9b47c";
        ctx.fillStyle = "rgba(40,24,10,.28)"; ctx.beginPath(); ctx.ellipse(X(-0.05), Y(0.44), 0.95 * s, 0.07 * s, 0, 0, 7); ctx.fill();
        var gb = ctx.createLinearGradient(0, Y(-0.36), 0, Y(0.36)); gb.addColorStop(0, mix(bark, "#ffffff", 0.18)); gb.addColorStop(0.45, bark); gb.addColorStop(1, barkD);
        ctx.fillStyle = gb; ctx.strokeStyle = "#2a1a0c"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X(0.82), Y(-0.36)); ctx.lineTo(X(-0.9), Y(-0.36)); ctx.quadraticCurveTo(X(-1.0), Y(0), X(-0.9), Y(0.36)); ctx.lineTo(X(0.82), Y(0.36)); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = ch ? "rgba(255,255,255,.08)" : "rgba(30,15,5,.35)"; ctx.lineWidth = 1.4;
        for (var b = 0; b < 9; b++){ var vv = -0.3 + b * 0.075; ctx.beginPath(); ctx.moveTo(X(-0.88), Y(vv)); for (var q2 = 1; q2 <= 12; q2++){ var uu = -0.88 + q2 * 0.14; ctx.lineTo(X(uu), Y(vv + 0.02 * Math.sin(q2 * 1.7 + b))); } ctx.stroke(); }
        if (ch){ ctx.fillStyle = "rgba(255,255,255,.06)"; for (b = 0; b < 14; b++){ ctx.fillRect(X(-0.8 + b * 0.115), Y(-0.36), 1.5, 0.72 * s); } }
        var gf = ctx.createRadialGradient(X(0.8), Y(-0.1), 2, X(0.82), Y(0), 0.42 * s); gf.addColorStop(0, mix(face, "#ffffff", 0.25)); gf.addColorStop(1, face);
        ctx.fillStyle = gf; ctx.beginPath(); ctx.ellipse(X(0.82), Y(0), 0.14 * s, 0.4 * s, 0, 0, 7); ctx.fill(); ctx.strokeStyle = barkD; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = ch ? "rgba(255,255,255,.12)" : "rgba(120,70,25,.55)"; ctx.lineWidth = 1;
        for (var r = 1; r <= 5; r++){ ctx.beginPath(); ctx.ellipse(X(0.82), Y(0), 0.14 * s * r / 6, 0.4 * s * r / 6, 0, 0, 7); ctx.stroke(); }
      } else {
        var pp = "#efe0b9";
        ctx.fillStyle = "rgba(40,24,10,.25)"; ctx.fillRect(X(-0.8) + 6, Y(-0.36) + 9, 1.6 * s, 0.72 * s);
        var gp = ctx.createLinearGradient(X(-0.8), 0, X(0.8), 0); gp.addColorStop(0, "#d9c391"); gp.addColorStop(0.5, pp); gp.addColorStop(1, "#d9c391");
        ctx.fillStyle = gp; ctx.fillRect(X(-0.8), Y(-0.36), 1.6 * s, 0.72 * s); ctx.strokeStyle = "#8a7350"; ctx.lineWidth = 1.5; ctx.strokeRect(X(-0.8), Y(-0.36), 1.6 * s, 0.72 * s);
        ctx.strokeStyle = "rgba(60,40,20,.28)"; ctx.lineWidth = 2;
        for (var l = 0; l < 7; l++){ var y0 = -0.27 + l * 0.09; ctx.beginPath(); for (var w = 0; w < 6; w++){ var x0 = -0.68 + w * 0.23; ctx.moveTo(X(x0), Y(y0)); ctx.lineTo(X(x0 + 0.12 + 0.06 * ((l + w) % 3) / 2), Y(y0)); } ctx.stroke(); }
        [-1, 1].forEach(function(sd){
          var x1 = sd < 0 ? -0.95 : 0.8, gr2 = ctx.createLinearGradient(X(x1), 0, X(x1 + 0.15), 0);
          gr2.addColorStop(0, "#b89a63"); gr2.addColorStop(0.5, "#f5e8c6"); gr2.addColorStop(1, "#a88a55");
          ctx.fillStyle = gr2; S.draw.rrect({ctx: ctx}, X(x1), Y(-0.44), 0.15 * s, 0.88 * s, 0.07 * s); ctx.fill(); ctx.strokeStyle = "#7a6440"; ctx.lineWidth = 1.5; ctx.stroke();
        });
      }
      ctx.restore();
    }
    function drawScene(t, f, alive){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, ph = W < 460;
      var gy = Math.round(H * (ph ? 0.12 : 0.16));
      /* ciel, collines, nuages */
      var sk = ctx.createLinearGradient(0, 0, 0, gy); sk.addColorStop(0, "#cfe5f7"); sk.addColorStop(1, "#f4f9fd"); ctx.fillStyle = sk; ctx.fillRect(0, 0, W, gy);
      S.draw.glow(c, W * 0.9, gy * 0.35, gy * 0.9, "#f4c542", 0.45); ctx.fillStyle = "#ffd866"; ctx.beginPath(); ctx.arc(W * 0.9, gy * 0.35, gy * 0.2, 0, 7); ctx.fill();
      clouds.forEach(function(cl){ var x = ((cl.x + clock * cl.v) % 1.2) * W * 1.0 - 0.1 * W, y = cl.y * gy, s = cl.s * gy / 70; ctx.fillStyle = "rgba(255,255,255,.9)"; [[0, 0, 14], [14, -6, 17], [32, 0, 13], [16, 4, 14]].forEach(function(q){ ctx.beginPath(); ctx.arc(x + q[0] * s, y + q[1] * s, q[2] * s, 0, 7); ctx.fill(); }); });
      ctx.fillStyle = "#a9c98b"; ctx.beginPath(); ctx.moveTo(0, gy); for (var x = 0; x <= W; x += 12) ctx.lineTo(x, gy - gy * 0.22 - gy * 0.12 * Math.sin(x / W * 5 + 1)); ctx.lineTo(W, gy); ctx.fill();
      /* strates du sol */
      var lay = [["#7aa95a", "#6a9a4c", 0], ["#c9a77c", "#bd9a6e", 0.035], ["#b48a5f", "#a67c52", 0.3], ["#9c7450", "#8c6646", 0.62], ["#7f5d40", "#6f5037", 0.86]];
      lay.forEach(function(L, i){
        var y0 = gy + (H - gy) * L[2], y1 = i < lay.length - 1 ? gy + (H - gy) * lay[i + 1][2] : H + 4;
        var gl = ctx.createLinearGradient(0, y0, 0, y1); gl.addColorStop(0, L[0]); gl.addColorStop(1, L[1]); ctx.fillStyle = gl;
        ctx.beginPath(); ctx.moveTo(0, H + 4);
        for (var xx = 0; xx <= W + 10; xx += 10) ctx.lineTo(xx, y0 + (i ? 3 * Math.sin(xx / 37 + i * 2) : 0));
        ctx.lineTo(W, H + 4); ctx.closePath(); ctx.fill();
      });
      ctx.fillStyle = "#5f8f42"; for (x = 4; x < W; x += 7){ ctx.beginPath(); ctx.moveTo(x, gy + 2); ctx.lineTo(x + 2, gy - 4 - (x * 7 % 5)); ctx.lineTo(x + 4, gy + 2); ctx.fill(); }
      peb.forEach(function(p){ var py = gy + (H - gy) * (0.08 + 0.9 * p.y); ctx.fillStyle = p.s < 0.5 ? "rgba(90,66,44,.45)" : "rgba(235,220,195,.45)"; ctx.beginPath(); ctx.ellipse(p.x * W, py, p.r * 1.4, p.r, p.s * 3, 0, 7); ctx.fill(); });
      /* zone de fouille : géométrie de l'objet */
      var fx0, fx1, fy0, fy1;
      if (ph){ fx0 = 14; fx1 = W - 14; fy0 = gy + (H - gy) * 0.1; fy1 = gy + (H - gy) * 0.5; }
      else { fx0 = 16; fx1 = W * 0.63; fy0 = gy + (H - gy) * 0.14; fy1 = gy + (H - gy) * 0.8; }
      var D = SHP[shape], s = Math.min((fx1 - fx0 - 20) / (2 * D.hu), (fy1 - fy0 - 20) / (2 * D.hv)), cx = (fx0 + fx1) / 2, cy = (fy0 + fy1) / 2 + 6;
      function X(u){ return cx + u * s; } function Y(v){ return cy + v * s; }
      /* fosse : creux plus sombre avec ombre interne */
      ctx.save(); S.draw.rrect(c, fx0, fy0, fx1 - fx0, fy1 - fy0 + 8, 18); ctx.fillStyle = "rgba(60,40,22,.28)"; ctx.fill(); ctx.clip();
      var gi = ctx.createLinearGradient(0, fy0, 0, fy0 + 30); gi.addColorStop(0, "rgba(40,25,12,.35)"); gi.addColorStop(1, "rgba(40,25,12,0)"); ctx.fillStyle = gi; ctx.fillRect(fx0, fy0, fx1 - fx0, 30); ctx.restore();
      /* piquets et ficelle du carroyage */
      ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1; ctx.setLineDash([5, 3]); ctx.strokeRect(fx0 - 4, fy0 - 4, fx1 - fx0 + 8, fy1 - fy0 + 16); ctx.setLineDash([]);
      [[fx0 - 4, fy0 - 4], [fx1 + 4, fy0 - 4]].forEach(function(q){ ctx.fillStyle = "#c0321d"; ctx.fillRect(q[0] - 2, q[1] - 12, 4, 14); });
      /* truelle posée au sol */
      if (!ph){ ctx.save(); ctx.translate(W * 0.1, gy + 4); ctx.rotate(-0.25); ctx.fillStyle = "#8a5a2b"; S.draw.rrect(c, -26, -3, 20, 6, 3); ctx.fill(); ctx.fillStyle = "#9aa6b5"; ctx.beginPath(); ctx.moveTo(-6, -1); ctx.lineTo(18, -7); ctx.lineTo(24, 0); ctx.lineTo(18, 7); ctx.lineTo(-6, 1); ctx.fill(); ctx.restore(); }
      var aged = Math.min(1, t / 40000);
      drawShape(ctx, shape, X, Y, s, aged);
      /* atomes */
      var A = atoms(shape), rA = Math.max(3.2, Math.min(6, s * 0.032));
      ctx.fillStyle = "rgba(60,60,70,.32)";
      A.c12.forEach(function(p){ ctx.beginPath(); ctx.arc(X(p.u), Y(p.v), rA * 0.42, 0, 7); ctx.fill(); });
      A.c14.forEach(function(p, i){
        var px = X(p.u), py = Y(p.v);
        if (alive[i]){
          var tw = 0.75 + 0.25 * Math.sin(clock * 3 + p.ph);
          S.draw.glow(c, px, py, rA * 2.6, "#38c172", 0.35 * tw);
          var ga = ctx.createRadialGradient(px - rA * 0.35, py - rA * 0.35, 0.5, px, py, rA);
          ga.addColorStop(0, "#d9ffe8"); ga.addColorStop(0.45, "#2fb36b"); ga.addColorStop(1, "#14663a");
          ctx.fillStyle = ga; ctx.beginPath(); ctx.arc(px, py, rA, 0, 7); ctx.fill();
        } else {
          ctx.fillStyle = "rgba(47,127,209,.75)"; ctx.beginPath(); ctx.arc(px, py, rA * 0.62, 0, 7); ctx.fill();
        }
      });
      /* désintégrations récentes : éclair + électron β⁻ qui s'échappe */
      fx.forEach(function(e){
        var p = A.c14[e.i]; if (!p) return; var px = X(p.u), py = Y(p.v), u = e.a / 0.8;
        ctx.strokeStyle = "rgba(244,197,66," + (1 - u) + ")"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(px, py, rA + 16 * u, 0, 7); ctx.stroke();
        var ex = px + Math.cos(p.dir) * 46 * u, ey = py + Math.sin(p.dir) * 46 * u;
        ctx.strokeStyle = "rgba(192,50,29," + (0.6 * (1 - u)) + ")"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
        S.draw.dot(c, ex, ey, 2.6, P.red);
        if (e.lbl && u < 0.75) S.draw.text(c, "β⁻", ex + 9, ey - 8, {size: 11, color: P.red, weight: 800});
      });
      S.draw.label(c, lab, cx, fy0 + 12, {color: "#5a3d1e", size: 11.5, fill: "rgba(255,248,232,.92)"});
      /* compteur et horloge */
      var nAlive = 0; alive.forEach(function(a){ if (a) nAlive++; });
      var bx, by, bw, bh, tx, ty, tw2;
      if (ph){ bx = 14; bw = W * 0.5 - 20; by = gy + (H - gy) * 0.56; bh = (H - gy) * 0.3; tx = W * 0.75; ty = by + bh * 0.42; tw2 = W * 0.44; }
      else { bx = W * 0.665; bw = W - bx - 14; by = gy + (H - gy) * 0.06; bh = (H - gy) * 0.5; tx = bx + bw / 2; ty = by + bh + (H - gy) * 0.17; tw2 = bw; }
      /* câble de la sonde vers l'objet */
      ctx.strokeStyle = "#2b3a50"; ctx.lineWidth = 3; ctx.lineCap = "round";
      var sx0 = ph ? bx + bw * 0.5 : bx, sy0 = ph ? by : by + bh * 0.7, ex1 = ph ? X(0.35) : X(D.hu * 0.82), ey1 = ph ? Y(0.32) : Y(-0.1);
      ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.bezierCurveTo(sx0 - (ph ? 0 : 30), sy0 + (ph ? -30 : 40), ex1 + 30, ey1 + 40, ex1 + 8, ey1 + 4); ctx.stroke();
      ctx.fillStyle = "#4b5a70"; ctx.beginPath(); ctx.arc(ex1 + 6, ey1 + 3, 6, 0, 7); ctx.fill();
      /* boîtier */
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.35)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
      var gb = ctx.createLinearGradient(0, by, 0, by + bh); gb.addColorStop(0, "#33455f"); gb.addColorStop(1, "#13233a");
      S.draw.rrect(c, bx, by, bw, bh, 12); ctx.fillStyle = gb; ctx.fill(); ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,.08)"; S.draw.rrect(c, bx + 3, by + 3, bw - 6, bh * 0.25, 10); ctx.fill();
      S.draw.text(c, "COMPTEUR ¹⁴C", bx + 12, by + 14, {size: 10, color: "#c9d3df", align: "left", weight: 800});
      var on = clock - led < 0.12; if (on) S.draw.glow(c, bx + bw - 16, by + 14, 14, "#ff5a3c", 0.9);
      ctx.fillStyle = on ? "#ff5a3c" : "#5b2a22"; ctx.beginPath(); ctx.arc(bx + bw - 16, by + 14, 4.5, 0, 7); ctx.fill();
      var sy = by + 26, sh2 = bh * 0.44;
      S.draw.rrect(c, bx + 10, sy, bw - 20, sh2, 6); ctx.fillStyle = "#dff2e6"; ctx.fill();
      var big = Math.max(18, Math.min(34, sh2 * 0.5));
      S.draw.text(c, String(nAlive), bx + bw / 2, sy + sh2 * 0.42, {size: big, mono: true, weight: 600, color: "#13233a"});
      S.draw.text(c, "/ " + N0 + " atomes de ¹⁴C", bx + bw / 2, sy + sh2 * 0.82, {size: 10.5, color: "#2c3a4e", weight: 700});
      var my = sy + sh2 + 10, mw = bw - 20;
      S.draw.rrect(c, bx + 10, my, mw, 9, 4.5); ctx.fillStyle = "#0b1626"; ctx.fill();
      if (f > 0.002){ S.draw.rrect(c, bx + 10, my, Math.max(9, mw * f), 9, 4.5); ctx.fillStyle = "#38c172"; ctx.fill(); }
      S.draw.text(c, "activité ≈ " + S.fmt(A0 * f, A0 * f < 1 ? 2 : 1) + " dés./min par g de C", bx + bw / 2, my + 22, {size: 9.5, color: "#c9d3df", weight: 700});
      S.draw.display(c, yrs(t) + " ans", tx, ty, {w: Math.min(tw2, 190), h: ph ? 50 : 56, caption: "DEPUIS LA MORT · " + S.fmt(t / T, 2) + " T½", size: ph ? 17 : 20});
      /* légende */
      var ly = H - 13, lx = 14;
      ctx.save(); S.draw.rrect(c, 8, H - 26, W - 16, 20, 8); ctx.fillStyle = "rgba(255,248,232,.88)"; ctx.fill(); ctx.restore();
      [["#2fb36b", "¹⁴C radioactif"], ["#2f7fd1", "¹⁴N (après β⁻)"], ["#555a66", "¹²C stable"]].forEach(function(q){
        S.draw.dot(c, lx + 4, ly, 4, q[0]); S.draw.text(c, q[1], lx + 12, ly, {size: 10.5, align: "left", color: "#2c3a4e"});
        ctx.font = "700 10.5px Mulish, system-ui, sans-serif"; lx += ctx.measureText(q[1]).width + 26;
      });
      if (W - lx > 150) S.draw.text(c, "atomes grossis, nombre exagéré", W - 14, ly, {size: 10, align: "right", color: "#6b5a44", weight: 600});
    }
    function drawGraph(t, f){
      g.clear(); var ctx = g.ctx;
      var ax = S.draw.axes(g, {x0: 0, x1: 60000, y0: 0, y1: 100, xl: "âge (ans)", yl: "¹⁴C restant (%)", l: 52, t: 18, stepX: 10000, stepY: 25}); GA.ax = ax;
      S.draw.area(g, ax, function(x){ return 100 * Math.pow(2, -x / T); }, 0, Math.min(60000, t), "#38c172", 0.16);
      S.draw.fn(g, ax, function(x){ return 100 * Math.pow(2, -x / T); }, "rgba(31,75,158,.35)", 2, [5, 4]);
      if (t > 0) S.draw.fn(g, ax, function(x){ return x <= t ? 100 * Math.pow(2, -x / T) : NaN; }, P.acc, 3.2);
      for (var j = 1; j <= 5; j++){ var tj = j * T; S.draw.line(g, ax.X(tj), ax.B, ax.X(tj), ax.Y(100 * Math.pow(2, -j)), P.grey, 1, [3, 4]); if (ax.X(T) - ax.X(0) > 40) S.draw.text(g, j + " T½", ax.X(tj), ax.B - 10, {size: 11, color: P.grey}); }
      S.draw.line(g, ax.X(50000), ax.T, ax.X(50000), ax.B, P.red, 1.5, [6, 4]); S.draw.text(g, g.W > 420 ? "limite pratique ≈ 50 000 ans" : "limite ≈ 50 000 ans", ax.X(50000) - 4, ax.T + 10, {size: 11, color: P.red, align: "right"});
      if (t <= 60000){
        S.draw.line(g, ax.L, ax.Y(100 * f), ax.X(t), ax.Y(100 * f), P.red, 1.6, [4, 3]); S.draw.line(g, ax.X(t), ax.Y(100 * f), ax.X(t), ax.B, P.red, 1.6, [4, 3]);
        S.draw.dot(g, ax.X(t), ax.Y(100 * f), 7, P.red);
        var lx = ax.X(t) + 12, al = "left"; if (lx > g.W - 110){ lx = ax.X(t) - 12; al = "right"; }
        S.draw.label(g, S.fmt(f * 100, f < 0.01 ? 2 : 1) + " %", lx, Math.max(ax.T + 26, ax.Y(100 * f) - 12), {color: P.red, size: 11.5, align: al});
      }
      if (g.W >= 460) S.draw.text(g, "glisse sur la courbe pour régler l'âge", ax.R - 4, ax.T + 28, {size: 10.5, color: P.grey, align: "right", weight: 600});
    }
    k.draw(function(){
      var t, f;
      if (st.anim){ t = st.t; f = Math.pow(2, -t / T); }
      else if (mode.value === "age"){ t = age.value; f = Math.pow(2, -t / T); }
      else { f = fr.value / 100; t = T * Math.log(1 / f) / Math.LN2; }
      var A = atoms(shape), alive = [];
      A.c14.forEach(function(p, i){
        var a = p.th < f;
        if (p.alive && !a){ if (fx.length < 40) fx.push({i: i, a: 0, lbl: fx.length < 6}); led = clock; }
        p.alive = a; alive.push(a);
      });
      drawScene(t, f, alive); drawGraph(t, f);
      ro.set(0, S.fmt(f * 100, f < 0.01 ? 3 : 2) + " %"); ro.set(1, yrs(t) + " ans"); ro.set(2, S.fmt(t / T, 2)); ro.set(3, f < 0.003 ? "moins de 0,3 % : mesure très difficile" : "mesurable");
      nt.set(t > 50000 ? "Au-delà de 50 000 ans, la méthode du carbone 14 n'est plus fiable : on utilise d'autres isotopes (potassium-argon, uranium-plomb…)." : t < 100 ? "Échantillon récent : l'incertitude relative sur l'âge est grande." : "Contrôle : t = 5 730 × log₂(1/f) = 5 730 × " + S.fmt(Math.log(1 / f) / Math.LN2, 2) + " ≈ " + yrs(t) + " ans.", t > 50000 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c09-rayonnements", ch: "c09", tag: "Protection",
  titre: "Rayonnements α, β, γ : temps, distance, écran",
  resume: "Quel écran arrête quel rayonnement ? Joue avec le temps, la distance et l'écran : la dose reçue est affichée.",
  but: "Choisis le rayonnement, le matériau et l'épaisseur de l'écran, puis déplace la personne (glisse-la) pour changer la distance et règle la durée d'exposition. Les particules arrêtées disparaissent dans l'écran ou dans l'air ; le dosimètre affiche la dose reçue.",
  aRetenir: "α (noyaux d'hélium) : très ionisants mais peu pénétrants (une feuille de papier ou la peau les arrête ; quelques cm dans l'air). β (électrons ou positons) : arrêtés par quelques mm d'aluminium. γ (photons très énergétiques) : très pénétrants, atténués de façon exponentielle par un matériau dense (plomb, béton). Trois moyens de se protéger : limiter le temps, augmenter la distance (la dose varie en 1/d²), interposer un écran.",
  piege: "« Peu pénétrant » ne veut pas « peu dangereux » : un émetteur α avalé ou inhalé (contamination) irradie directement les tissus. Irradiation = exposition à un rayonnement ; contamination = présence de la substance radioactive sur ou dans le corps. Modèle simplifié : source ponctuelle, particules d'énergie de l'ordre du MeV, α : portée 4 cm dans l'air, β : portée ≈ 4,5 m dans l'air (0,54 g/cm² ÷ 1,2 mg/cm³) ; décroissance de la transmission β schématisée comme linéaire. Débit de référence (100 µSv/h à 1 m) purement illustratif.",
  build: function(k, S){
    var c = k.canvas(310), P = S.draw.palette, Pm = window.PH6;
    var ty = k.seg("Rayonnement", [["a", "α"], ["b", "β"], ["g", "γ"]], "g");
    var mt = k.select("Écran", [["pa", "Papier / carton"], ["al", "Aluminium"], ["pb", "Plomb"], ["be", "Béton"]], "pb");
    var ep = k.slider("Épaisseur de l'écran", 0, 100, 1, 10, "mm");
    var di = k.slider("Distance source–personne", 1, 500, 1, 100, "cm");
    var tm = k.slider("Durée d'exposition", 1, 120, 1, 30, "min");
    var ro = k.readouts(["Transmission de l'écran", "Débit relatif à la personne", "Dose reçue (illustrative)", "Demi-atténuation (γ)"]);
    var nt = k.note("", "ok");
    var mat = {pa: {rho: 0.8, mu: 0.0637, n: "papier"}, al: {rho: 2.7, mu: 0.0615, n: "aluminium"}, pb: {rho: 11.35, mu: 0.0710, n: "plomb"}, be: {rho: 2.3, mu: 0.0637, n: "béton"}};
    var parts = [], t = 0, geo = {}, hit = 0;
    function trans(){
      var m = mat[mt.value], x = ep.value / 10;
      if (ty.value === "a") return x >= 0.01 ? 0 : 1;
      if (ty.value === "b"){ var R = 0.54 / m.rho; return Math.max(0, 1 - x / R); }
      return Math.exp(-m.mu * m.rho * x);
    }
    function rangeAir(){ return ty.value === "a" ? 4 : ty.value === "b" ? 450 : Infinity; }
    function mapx(d, xs, xw){ return xs + xw * (0.1 + 0.9 * Math.log(Math.max(1, d)) / Math.log(500)); }
    var lp = k.loop(function(dt){
      t += dt; hit *= Math.pow(0.05, dt);
      if (Math.random() < dt * 16){
        var m = mat[mt.value], x = ep.value / 10, st = Infinity;
        if (x > 0){ if (ty.value === "a") st = 0.003; else if (ty.value === "b"){ st = (0.54 / m.rho) * (0.7 + 0.5 * Math.random()); } else st = -Math.log(1 - Math.random()) / (m.mu * m.rho); }
        parts.push({x: 0, a: (Math.random() - 0.5) * 0.34, st: st, lim: x, sc: 0, out: false});
      }
      parts.forEach(function(p){ p.x += dt * 150; });
      parts = parts.filter(function(p){ return p.x < geo.xd + 12; });
      k.redraw();
    });
    lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(tp, p){
      if ((tp === "down" || tp === "drag") && geo.xs){ var f = (p.x - geo.xs) / geo.xw; var d = Math.exp((f - 0.1) / 0.9 * Math.log(500)); di.set(Math.round(Math.max(1, Math.min(500, d)))); }
    });
    k.draw(function(){
      c.clear(); Pm.bg(c, "#f6f8fb", "#e8edf4"); var ctx = c.ctx, W = c.W, H = c.H, cy = H * 0.42, xs = 38, xw = W - 76, xd = mapx(di.value, xs, xw), xe = (xs + xd) / 2, m = mat[mt.value];
      geo.xs = xs; geo.xw = xw; geo.xd = xd;
      var T = trans(), inAir = di.value <= rangeAir(), rel = inAir ? T * Math.pow(100 / di.value, 2) : 0, wE = ep.value > 0 ? 6 + ep.value * 0.36 : 0;
      var dose = 100 * rel * tm.value / 60;   /* µSv */
      /* échelle de distance (log) */
      S.draw.line(c, xs, cy + 54, xs + xw, cy + 54, "#cfd6e1", 2);
      [1, 10, 100, 500].forEach(function(d){ var x = mapx(d, xs, xw); S.draw.line(c, x, cy + 49, x, cy + 59, "#9aa6b8", 1.5); S.draw.text(c, d < 100 ? d + " cm" : (d === 100 ? "1 m" : "5 m"), x, cy + 70, {size: 10.5, color: P.grey, weight: 600}); });
      /* écran */
      if (wE > 0){ var col = ({pa: ["#efe5cd", "#d7c9a4"], al: ["#cfd7e3", "#9aa7ba"], pb: ["#7b8594", "#3d4553"], be: ["#bdb3a3", "#8f8576"]})[mt.value]; var g = ctx.createLinearGradient(xe - wE / 2, 0, xe + wE / 2, 0); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]); ctx.fillStyle = g; ctx.fillRect(xe - wE / 2, cy - 62, wE, 124); ctx.strokeStyle = "rgba(19,35,58,.5)"; ctx.lineWidth = 1; ctx.strokeRect(xe - wE / 2, cy - 62, wE, 124); S.draw.label(c, m.n + " " + ep.value + " mm", xe, cy - 74, {color: P.ink, size: 11}); }
      /* particules */
      var colP = ty.value === "g" ? "#7c3aed" : ty.value === "b" ? "#0e7490" : "#c0321d", lim = rangeAir();
      parts.forEach(function(p){
        var px = xs + p.x, py = cy + p.a * Math.min(1, (p.x) / (xd - xs)) * 150 * 0.5 + p.a * 40;
        var dcm = (Math.exp((((px - xs) / xw) - 0.1) / 0.9 * Math.log(500)));
        if (px > xd + 2) return;
        if (inAir === false && di.value > lim && dcm > lim) return;
        if (lim < 500 && dcm > lim) return;
        if (wE > 0 && px > xe - wE / 2){
          var depth = px - (xe - wE / 2), stopPx = p.st * 10 * 0.36;   /* st en cm ; 1 mm = 0,36 px */
          if (p.st < p.lim && depth > stopPx) return;
        }
        if (ty.value === "g"){ ctx.strokeStyle = colP; ctx.lineWidth = 2; ctx.beginPath(); for (var q = 0; q <= 10; q++){ ctx.lineTo(px - 10 + q * 2, py + Math.sin(q * 1.4 + p.x * 0.3) * 3); } ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(px, py, ty.value === "a" ? 5.4 : 3.2, 0, 7); ctx.fillStyle = colP; ctx.fill(); if (ty.value === "a"){ ctx.fillStyle = "#fff"; ctx.font = "800 7px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("α", px, py + 0.5); } }
        if (px > xd - 6 && p.x > 10 && !p.counted){ p.counted = true; hit = 1; }
      });
      /* portée dans l'air */
      if (lim < 500){ var xl = mapx(lim, xs, xw); S.draw.line(c, xl, cy - 52, xl, cy + 52, P.red, 1.6, [4, 4]); S.draw.label(c, "portée dans l'air : " + (lim >= 100 ? lim / 100 + " m" : lim + " cm"), xl, cy - 60, {color: P.red, size: 11}); }
      /* source : trèfle radioactif */
      S.draw.glow(c, xs, cy, 40, "#f4c542", 0.5);
      ctx.save(); ctx.translate(xs, cy); ctx.fillStyle = "#f4c542"; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.fill(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#13233a";
      for (var a = 0; a < 3; a++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 12, -1.5708 + a * 2.0944 - 0.5236, -1.5708 + a * 2.0944 + 0.5236, false); ctx.closePath(); ctx.fill(); }
      S.draw.dot({ctx: ctx}, 0, 0, 3.4, "#f4c542"); ctx.restore();
      S.draw.text(c, "source", xs, cy + 28, {size: 11.5, color: P.grey});
      /* personne */
      var hx = xd + 2; if (hit > 0.05) S.draw.glow(c, hx, cy, 34 + 10 * hit, P.red, 0.5 * hit);
      ctx.fillStyle = "#4b5a70"; S.draw.rrect(c, hx - 7, cy - 6, 14, 30, 5); ctx.fill(); ctx.beginPath(); ctx.arc(hx, cy - 14, 7.5, 0, 7); ctx.fillStyle = "#f2c9a0"; ctx.fill(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = P.green; ctx.fillRect(hx - 10, cy + 1, 7, 5);
      S.draw.label(c, "glisse-moi", hx, cy + 38, {color: P.red, size: 11});
      var doseTxt = dose >= 1000 ? S.fmt(dose / 1000, 1) + " mSv" : dose >= 10 ? S.fmt(dose, 0) + " µSv" : S.fmt(dose, 1) + " µSv";
      S.draw.display(c, doseTxt, Math.min(W - 72, Math.max(72, W / 2)), H - 46, {w: 136, h: 54, caption: "DOSIMÈTRE · " + tm.value + " MIN", size: 22, color: dose > 1000 ? P.red : "#13233a"});
      ro.set(0, S.fmt(T * 100, T < 0.01 ? 2 : 1) + " %"); ro.set(1, inAir ? S.fmt(rel * 100, rel * 100 < 1 ? 2 : rel * 100 < 100 ? 1 : 0) + " % (réf. : 100 % à 1 m sans écran)" : "0 % (portée dépassée)");
      ro.set(2, doseTxt); ro.set(3, ty.value === "g" ? S.fmt(Math.log(2) / (m.mu * m.rho) * 10, 1) + " mm de " + m.n : "—");
      nt.set(ty.value === "a" ? "α : arrêté par une simple feuille ; portée de 4 cm dans l'air. Éloigne la personne de plus de 4 cm : plus aucun risque externe." : ty.value === "b" ? "β : arrêté par quelques mm d'aluminium (portée ≈ 0,54 g/cm² divisée par la masse volumique)." : "γ : jamais complètement arrêté, seulement atténué ; double l'épaisseur de demi-atténuation → intensité ÷ 4. Compare : une radio du thorax ≈ 20 µSv.", "ok");
    });
  }
});

