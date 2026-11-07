/* Chapitre 5 · Génie génétique et biotechnologies */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c05-pcr", ch: "c05", tag: "Classique",
  titre: "PCR : l'amplification exponentielle de l'ADN",
  resume: "Chaque cycle de 3 étapes double (au mieux) le nombre de copies : 30 cycles multiplient par plus d'un milliard.",
  but: "Choisis le nombre de cycles, l'efficacité de chaque cycle et le nombre de copies de départ. Lance l'animation : le graphe suit les copies cycle après cycle et la température du thermocycleur. Passe en échelle linéaire pour voir la courbe « en crosse de hockey ».",
  aRetenir: "Un cycle = dénaturation (95 °C : les deux brins se séparent), hybridation des amorces (≈ 55 °C), élongation par l'ADN polymérase thermostable (≈ 72 °C). Si l'efficacité est de 100 %, N = N₀ × 2ⁿ ; si elle est de E, N = N₀ × (1 + E)ⁿ. Une petite baisse d'efficacité s'accumule : à 90 %, 30 cycles donnent environ 230 millions de fois plus, et non 1 milliard.",
  piege: "La croissance exponentielle ne dure pas : au-delà de 10¹² copies environ, les réactifs s'épuisent et la courbe plafonne (valeur donnée comme ordre de grandeur). Et une PCR n'amplifie que la région encadrée par les amorces, pas tout le génome.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette, cur = null;
    var cyc = k.slider("Nombre de cycles", 0, 40, 1, 30, "", function(){ cur = null; lp.pause(); });
    var eff = k.slider("Efficacité par cycle", 70, 100, 1, 95, "%");
    var n0 = k.select("Copies de départ", [1, 10, 100, 1000, 10000], 100);
    var pl = k.toggle("Plateau (réactifs épuisés au-delà de 10¹² copies)", true);
    var sc = k.seg("Échelle verticale", [["l", "Logarithmique"], ["n", "Linéaire"]], "l");
    var lp = k.loop(function(dt){ cur += dt * 4; if (cur >= cyc.value){ cur = null; lp.pause(); } k.redraw(); });
    k.button("Lancer les cycles", function(){ cur = 0; lp.play(); }, true);
    var ro = k.readouts(["Copies après les cycles", "Amplification", "Cycles pour 10⁹ copies"]);
    function N(n){ var v = +n0.value * Math.pow(1 + eff.value / 100, n); return pl.value ? Math.min(v, 1e12) : v; }
    k.draw(function(){
      c.clear(); var E = eff.value / 100, nc = cyc.value, shown = cur === null ? nc : Math.floor(cur), log = sc.value === "l", ctx = c.ctx;
      var nmax = 40, ymax = log ? 18 : 100, ref = N(40);   /* 10 000 copies × 2⁴⁰ ≈ 10¹⁶ sans plateau */
      var ax = S.draw.axes(c, {x0: 0, x1: 40, y0: 0, y1: ymax, stepX: 5, stepY: log ? 2 : 25, xl: "cycles", yl: log ? "log₁₀(copies)" : "% de la valeur à 40 cycles", t: 14, b: 128, l: 48});
      function yv(n){ return log ? Math.log10(N(n)) : N(n) / ref * 100; }
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.strokeStyle = "#c6cdd6"; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var i = 0; i <= 40; i++){ var v = log ? Math.log10(N(i)) : N(i) / ref * 100; if (i === 0) ctx.moveTo(ax.X(i), ax.Y(v)); else ctx.lineTo(ax.X(i), ax.Y(v)); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath();
      for (i = 0; i <= shown; i++){ var y = yv(i); if (i === 0) ctx.moveTo(ax.X(i), ax.Y(y)); else ctx.lineTo(ax.X(i), ax.Y(y)); } ctx.stroke();
      ctx.restore();
      S.draw.dot(c, ax.X(shown), ax.Y(yv(shown)), 6, P.red);
      if (log) S.draw.line(c, ax.L, ax.Y(9), ax.R, ax.Y(9), P.green, 1.2, [3, 4]);
      if (log) S.draw.text(c, "10⁹", ax.L + 14, ax.Y(9) - 9, {size: 12, color: P.green});
      /* profil de température */
      var py = ax.B + 44, ph = 66, W0 = ax.L, W1 = ax.R, ct = shown;
      S.draw.text(c, "Un cycle du thermocycleur (3 répétitions)", (W0 + W1) / 2, py - 16, {size: 12, color: P.grey});
      var T = [[0, 95, "95 °C"], [0.25, 55, "55 °C"], [0.5, 72, "72 °C"]], pts = [];
      function ty(t){ return py + ph - (t - 40) / 60 * ph; }
      var cw = (W1 - W0) / 3;
      for (var r = 0; r < 3; r++){ T.forEach(function(s, q){ var x = W0 + r * cw + s[0] * cw, nx = W0 + r * cw + (q < 2 ? T[q + 1][0] : 1) * cw; pts.push([x, ty(s[1])], [nx, ty(s[1])]); }); }
      ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach(function(p, q){ if (q === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }); ctx.stroke();
      var names = ["Dénaturation", "Hybridation", "Élongation"];
      T.forEach(function(s, q){ S.draw.text(c, names[q], W0 + s[0] * cw + (q < 2 ? 0.125 : 0.25) * cw, ty(s[1]) - 10, {size: 12, color: P.ink, weight: 600}); });
      if (cur !== null){ var f = cur - Math.floor(cur), mx = W0 + f * cw; S.draw.line(c, mx, py - 2, mx, py + ph, P.red, 2); S.draw.text(c, "cycle " + (Math.floor(cur) + 1), W1 - 30, py - 16, {size: 12, color: P.red}); }
      var fin = N(shown);
      ro.set(0, S.sci(fin, 3)); ro.set(1, "× " + S.sci(fin / +n0.value, 3));
      var need = Math.ceil(Math.log(1e9 / +n0.value) / Math.log(1 + E) - 1e-9); ro.set(2, need <= 40 ? need + " cycles" : "plus de 40");
    });
  }
});

SFA.sim({
  id: "b6-c05-electrophorese", ch: "c05", tag: "Originale",
  titre: "Électrophorèse : couper l'ADN et lire les bandes",
  resume: "Choisis des enzymes de restriction, lance la migration et estime la taille des fragments avec l'échelle de référence.",
  but: "Un ADN de 6 000 paires de bases (pb) est coupé par une ou plusieurs enzymes. Les fragments migrent vers le pôle + dans le gel : les plus petits vont le plus loin. Touche le gel pour placer un repère et lire la taille estimée grâce à l'échelle de taille (colonne de gauche).",
  aRetenir: "L'ADN, chargé négativement, migre vers le pôle positif ; la distance parcourue est une fonction décroissante du logarithme de la taille : plus un fragment est petit, plus il migre loin. Une enzyme de restriction coupe à des séquences précises : n sites de coupure dans un ADN linéaire donnent n + 1 fragments. Les positions des coupures sont fictives ici.",
  piege: "Deux fragments de même taille forment une seule bande plus intense. Et la taille se lit en comparant à l'échelle de référence (et non en mesurant une distance absolue) : la distance dépend aussi de la tension et du temps de migration.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, cursor = null;
    var enz = {E: {n: "EcoRI", s: [1500, 4000]}, Bm: {n: "BamHI", s: [2500]}, H: {n: "HindIII", s: [700, 3300, 5000]}};
    var tE = k.toggle("EcoRI (coupe en 1 500 et 4 000)", true), tB = k.toggle("BamHI (coupe en 2 500)", false), tH = k.toggle("HindIII (coupe en 700, 3 300 et 5 000)", false);
    var V = k.slider("Tension", 50, 200, 10, 100, "V"), T = k.slider("Durée de migration", 0, 60, 5, 30, "min");
    var ro = k.readouts(["Fragments (pb)", "Taille au repère"]);
    var note = k.note("", "");
    var LAD = [10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 500, 250];
    function frags(){ var cuts = []; [[tE, "E"], [tB, "Bm"], [tH, "H"]].forEach(function(t){ if (t[0].value) cuts = cuts.concat(enz[t[1]].s); }); cuts.sort(function(a, b){ return a - b; }); var p = [0].concat(cuts, [6000]), f = []; for (var i = 1; i < p.length; i++) f.push(p[i] - p[i - 1]); return f; }
    function fac(){ return (V.value / 100) * (T.value / 30); }
    function dist(s){ return fac() * (5 - Math.log10(s)) * 95; }
    var geo = function(){ var y0 = 56, h = c.H - y0 - 14; return {y0: y0, h: h, x0: 64, lw: (c.W - 64 - 12) / 3}; };
    c.pointer(function(t, p){ if (t === "up") return; var g = geo(); cursor = Math.max(0, Math.min(g.h, p.y - g.y0)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, g = geo(), f = frags(), i;
      ctx.fillStyle = "#dfe9f1"; ctx.fillRect(g.x0 - 8, g.y0 - 6, c.W - g.x0 - 4, g.h + 10);
      S.draw.text(c, "pôle −", c.W / 2, 10, {size: 12, color: P.red}); S.draw.text(c, "pôle +", c.W / 2, c.H - 4, {size: 12, color: P.acc});
      ["Échelle", "ADN non coupé", "ADN coupé"].forEach(function(t, q){
        var x = g.x0 + q * g.lw; ctx.fillStyle = "#9db2c4"; ctx.fillRect(x + 6, g.y0 - 6, g.lw - 12, 7); S.draw.text(c, t, x + g.lw / 2, 34, {size: 12});
      });
      function band(q, size, mass, lab){
        var d = dist(size), x = g.x0 + q * g.lw; if (d > g.h){ return false; }
        ctx.fillStyle = "rgba(19,35,58," + Math.min(0.95, 0.25 + mass / 6000 * 0.75) + ")"; ctx.fillRect(x + 8, g.y0 + d - 2, g.lw - 16, 5);
        if (lab && [8000, 5000].indexOf(size) < 0) S.draw.text(c, S.fmt(size, 0), g.x0 - 14, g.y0 + d, {size: 12, color: P.grey, align: "right", weight: 600});
        return true;
      }
      var off = 0; LAD.forEach(function(s){ if (!band(0, s, s, true)) off++; });
      band(1, 6000, 6000, false);
      var seen = {}; f.forEach(function(s){ seen[s] = (seen[s] || 0) + 1; });
      var lost = off; Object.keys(seen).forEach(function(s){ var cnt = seen[s]; if (!band(2, +s, +s * cnt, false)) lost++; });
      if (cursor !== null){
        ctx.strokeStyle = P.red; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(g.x0 - 8, g.y0 + cursor); ctx.lineTo(c.W - 4, g.y0 + cursor); ctx.stroke(); ctx.setLineDash([]);
        var est = Math.pow(10, 5 - cursor / (fac() * 95 || 1)); if (fac() === 0) est = NaN;
        ro.set(1, isNaN(est) || est > 1e6 ? "hors échelle" : "≈ " + S.fmt(est, 0) + " pb");
      } else ro.set(1, "Touche le gel");
      ro.set(0, f.slice().sort(function(a, b){ return b - a; }).join(" · "));
      note.set(f.length === 1 ? "Aucune enzyme choisie : l'ADN reste entier (6 000 pb)." : (f.length - 1) + " site(s) de coupure → " + f.length + " fragments. Somme des tailles : " + f.reduce(function(a, b){ return a + b; }, 0) + " pb." + (Object.keys(seen).length < f.length ? " Des fragments de même taille se superposent en une seule bande plus intense." : "") + (lost ? " <b>Des bandes sont sorties du gel : réduis la durée ou la tension.</b>" : ""), lost ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c05-plaques", ch: "c05", tag: "Niche utile",
  titre: "Transformation bactérienne : quelles colonies ont le gène ?",
  resume: "Sur trois boîtes de Pétri (LB, LB + ampicilline, LB + ampicilline + X-gal), seules certaines colonies portent le plasmide recombinant.",
  but: "On met en contact 400 bactéries avec des plasmides et on étale. Règle la fréquence de transformation et le succès de la ligature (plasmides contenant l'insert). Compare les trois boîtes.",
  aRetenir: "Le plasmide porte un gène de résistance à l'ampicilline : seules les bactéries transformées survivent sur la boîte avec antibiotique. L'insert (gène d'intérêt, par exemple l'insuline humaine) s'insère dans le gène lacZ : avec X-gal, les colonies à plasmide vide sont bleues, celles à plasmide recombinant sont blanches.",
  piege: "Une colonie blanche porte un plasmide avec un insert, mais il faut encore vérifier que l'insert est le bon et qu'il est exprimé (PCR, séquençage, dosage de la protéine). Aucune étape ne garantit à elle seule qu'une bactérie produit de l'insuline.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62}), P = S.draw.palette;
    var tp = k.slider("Fréquence de transformation", 0.5, 20, 0.5, 5, "%");
    var lg = k.slider("Plasmides avec insert (ligature réussie)", 5, 90, 5, 30, "%");
    var seed = 1; k.button("Nouvelle expérience", function(){ seed++; });
    var ro = k.readouts(["Colonies sur LB", "Colonies sur LB + ampicilline", "Bleues / blanches", "Part de blanches"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, r = B.rng(seed * 2741 + 3), NB = 400;
      var T = B.binom(NB, tp.value / 100, r), T1 = B.binom(T, lg.value / 100, r), T0 = T - T1;
      var R = Math.min(c.W / 6.4, c.H / 2 - 20), cy = c.H / 2 - 8, titles = ["LB seul", "LB + ampicilline", "LB + ampi + X-gal"];
      var pos = []; var rp = B.rng(777 + seed); for (var i = 0; i < NB; i++){ var a = rp() * 6.2832, rr = Math.sqrt(rp()) * (R - 6); pos.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
      for (var q = 0; q < 3; q++){
        var cx = c.W * (q + 0.5) / 3; ctx.fillStyle = "#f6efd9"; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill(); ctx.stroke();
        var cnt = q === 0 ? NB : T;
        for (var j = 0; j < cnt; j++){
          var white = q === 2 && j < T1, blue = q === 2 && !white;
          ctx.fillStyle = blue ? "#2f5fd0" : white ? "#fffdf5" : "#d9b66a"; ctx.strokeStyle = blue ? "#1b3b99" : "rgba(80,60,20,.5)"; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(cx + pos[j][0], cy + pos[j][1], q === 0 ? 2 : 3.4, 0, 6.2832); ctx.fill(); ctx.stroke();
        }
        S.draw.text(c, titles[q], cx, cy + R + 16, {size: 12}); S.draw.text(c, (q === 0 ? NB : q === 1 ? T : T) + " colonies", cx, cy + R + 33, {size: 12, color: P.grey, weight: 600});
      }
      ro.set(0, NB + " (toutes)"); ro.set(1, T); ro.set(2, T0 + " bleues / " + T1 + " blanches"); ro.set(3, T ? S.fmt(T1 / T * 100, 0) + " %" : "—");
      note.set(T === 0 ? "Aucune bactérie transformée dans cette expérience : augmente la fréquence de transformation." : "Sur " + NB + " bactéries, " + T + " ont pris un plasmide (survivent à l'ampicilline) ; parmi elles, " + T1 + " ont un plasmide recombinant (colonies blanches) à analyser. Les " + (NB - T) + " autres n'ont pas de plasmide et meurent sur la boîte avec ampicilline.", T1 === 0 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c05-profil", ch: "c05", tag: "Enquête",
  titre: "Profil ADN : combien de marqueurs faut-il pour accuser ?",
  resume: "Compare l'ADN d'une scène de crime avec quatre suspects locus par locus et calcule la probabilité d'une coïncidence.",
  but: "Chaque colonne est un locus (marqueur de répétitions). Augmente le nombre de loci comparés : les suspects dont le profil diffère sont écartés ; la probabilité qu'une personne prise au hasard ait ce profil diminue par produit. Valeurs illustratives, simplifiées.",
  aRetenir: "Un seul marqueur ne suffit jamais : beaucoup de personnes partagent le même génotype. En comparant n marqueurs indépendants, on multiplie les fréquences génotypiques : la probabilité d'une coïncidence chute de façon exponentielle. Une seule différence suffit à exclure une personne ; une concordance ne fait que la maintenir parmi les suspects.",
  piege: "Confusion classique : « la probabilité qu'un innocent ait ce profil est de 1 sur 10 millions » n'est pas « la probabilité que ce suspect soit innocent est de 1 sur 10 millions ». Dans une ville d'un million d'habitants, on attend encore 0,7 coïncidence avec 6 marqueurs : il faut tenir compte de la population concernée et de l'ensemble des preuves. Les apparentés ont des profils proches.",
  build: function(k, S){
    var c = k.canvas(500), P = S.draw.palette;
    var n = k.slider("Marqueurs (loci) comparés", 1, 8, 1, 3, "");
    var pop = k.select("Population concernée", [[1e4, "10 000 personnes"], [1e5, "100 000 personnes"], [1e6, "1 million de personnes"], [1e7, "10 millions de personnes"]], 1e6);
    var ro = k.readouts(["Probabilité d'une coïncidence", "Coïncidences attendues dans la population", "Suspects non exclus"]);
    var note = k.note("", "");
    var FR = [0.09, 0.12, 0.07, 0.11, 0.10, 0.08, 0.13, 0.09];
    var scene = ["14/16", "9/11", "12/12", "8/10", "18/20", "15/15", "7/9", "22/24"];
    var sus = [["Suspect A", scene.slice()], ["Suspect B", ["14/16", "9/11", "12/12", "8/10", "18/20", "15/15", "7/8", "22/23"]],
      ["Suspect C", ["14/16", "9/11", "11/12", "8/10", "18/19", "15/16", "7/9", "21/24"]], ["Suspect D", ["14/15", "9/10", "12/12", "8/9", "17/20", "15/15", "9/9", "22/25"]]];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, nn = n.value, lw = 56, cw = (c.W - lw - 6) / 8, y0 = 24, rh = 38, i, j;
      for (j = 0; j < 8; j++) S.draw.text(c, "L" + (j + 1), lw + cw * (j + 0.5), 12, {size: 12, color: j < nn ? P.ink : P.grey});
      var rows = [["Scène", scene]].concat(sus.map(function(s0, q){ return ["Susp. " + "ABCD"[q], s0[1]]; })), alive = 0;
      rows.forEach(function(rw, q){
        var y = y0 + q * rh, ex = false;
        S.draw.text(c, rw[0], 4, y + rh / 2, {align: "left", size: 12, color: q === 0 ? P.red : P.ink});
        for (j = 0; j < 8; j++){
          var m = q === 0 || rw[1][j] === scene[j], used = j < nn; if (used && !m) ex = true;
          ctx.fillStyle = !used ? "#f1f3f6" : q === 0 ? "#fde8e6" : m ? "#e0f0e6" : "#f6d2cf"; ctx.fillRect(lw + cw * j + 1, y + 1, cw - 2, rh - 2);
          var al = rw[1][j].split("/"); S.draw.text(c, al[0], lw + cw * (j + 0.5), y + rh / 2 - 8, {size: 12, color: used ? P.ink : "#a8b1bd", weight: 600}); S.draw.text(c, al[1], lw + cw * (j + 0.5), y + rh / 2 + 8, {size: 12, color: used ? P.ink : "#a8b1bd", weight: 600});
        }
        if (q > 0){ if (!ex) alive++; }
      });
      var yy = y0 + 5 * rh + 4;
      var prob = 1; for (i = 0; i < nn; i++) prob *= FR[i];
      var exp = prob * pop.value;
      /* courbe des coïncidences attendues */
      var ax = S.draw.axes(c, {x0: 0, x1: 8, y0: -5, y1: 7, stepX: 1, stepY: 2, t: yy + 26, b: 34, yl: "log₁₀(coïncidences attendues)", l: 44});
      S.draw.text(c, "Coïncidences attendues (loci 1 à 8)", c.W / 2, yy + 10, {size: 12, color: P.grey});
      S.draw.line(c, ax.L, ax.Y(0), ax.R, ax.Y(0), P.green, 1.4, [4, 4]); S.draw.text(c, "1 coïncidence", ax.R - 4, ax.Y(0) - 9, {size: 12, color: P.green, align: "right"});
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2.6; ctx.beginPath(); var cp = 1;
      for (i = 0; i <= 8; i++){ if (i > 0) cp *= FR[i - 1]; var v = Math.log10(cp * pop.value); if (i === 0) ctx.moveTo(ax.X(i), ax.Y(v)); else ctx.lineTo(ax.X(i), ax.Y(v)); } ctx.stroke();
      S.draw.dot(c, ax.X(nn), ax.Y(Math.log10(exp)), 6, P.red);
      var inv = 1 / prob; ro.set(0, "1 sur " + (inv < 1e9 ? Math.round(inv).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") : S.sci(inv, 2))); ro.set(1, exp >= 100 ? S.fmt(exp, 0) : S.sci(exp, 2)); ro.set(2, alive + " sur 4");
      note.set(exp >= 1 ? "Avec " + nn + " marqueur(s), on attend encore environ " + (exp >= 100 ? S.fmt(exp, 0) : S.fmt(exp, 1)) + " personne(s) au même profil dans la population : une concordance prouve très peu." : "Avec " + nn + " marqueurs, on attend moins d'une coïncidence dans cette population : le profil devient très discriminant (sauf pour des apparentés).", exp >= 1 ? "warn" : "ok");
    });
  }
});
})();

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

/*B3D-ADD:b6-3d-crispr*/
SFA.sim({
  id:"b6-3d-crispr", ch:"c05", tag:"3D · CRISPR-Cas9",
  titre:"CRISPR-Cas9 : des ciseaux moléculaires guidés par un ARN",
  resume:"Un ARN guide conduit la protéine Cas9 sur une séquence précise de l'ADN, où elle coupe. Teste un bon guide, un mauvais guide, l'absence de PAM et deux types de réparation.",
  but:"Choisis un ARN guide et fais glisser Cas9 le long de l'ADN (ou lance la recherche automatique). Lis l'appariement guide/ADN dans la bande de séquence. Quand le site est reconnu, avance étape par étape : ouverture, coupure, réparation. Glisse pour tourner la vue.",
  aRetenir:"CRISPR-Cas9 est un outil d'édition du génome. L'ARN guide (≈ 20 nucléotides) s'apparie par complémentarité avec la séquence cible de l'ADN ; Cas9 ne coupe que s'il y a une bonne correspondance et la séquence PAM (NGG) juste à côté. Les deux brins sont coupés. La cellule répare : soit de façon approximative (des bases insérées ou perdues, le gène est inactivé), soit en utilisant une matrice d'ADN fournie (le gène est corrigé ou modifié). Les applications vont de la recherche à des thérapies (drépanocytose), avec des questions éthiques importantes.",
  piege:"Cas9 n'est pas un « chercheur de gène » intelligent : c'est la complémentarité de l'ARN guide qui décide de l'endroit. Un guide mal choisi coupe au mauvais endroit ou ne coupe pas, et sans PAM, même un guide parfait ne coupe pas. Couper n'est pas corriger : c'est la réparation qui détermine le résultat.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(380), cam = B.cam(0.3, 0.3, 8);
    var PRE = "ATCGGA", TGT = "GACCTGAGTCCATGGCTAAC", SUF = "CATTGCA";
    function flip(ch){ return {A:"T", T:"A", G:"C", C:"G"}[ch]; }
    var G2 = TGT.split(""); [11, 13, 15, 17].forEach(function(i){ G2[i] = flip(G2[i]); });
    var GUIDES = {g1:TGT, g2:G2.join(""), g3:"TTGACCGATACGGTCAGTCA"};
    var gsel = k.select("ARN guide", [["g1","Guide 1 : complémentaire du gène cible"],["g2","Guide 2 : 4 erreurs dans le « germe »"],["g3","Guide 3 : vise un autre gène"]], "g1", function(){ reset(false); });
    var pam = k.toggle("Séquence PAM (NGG) présente à côté de la cible", true, function(){ reset(false); });
    var rep = k.seg("Réparation", [["nhej","Approximative (NHEJ)"],["hdr","Avec matrice (HDR)"]], "nhej");
    var pos = k.slider("Position de Cas9 sur l'ADN", 0, 13, 1, 0, "pb", function(){ if (stage > 0) reset(false); auto = false; });
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    k.button("Étape suivante", function(){ nextStage(); }, true);
    k.button("Chercher automatiquement", function(){ reset(false); pos.set(0); auto = true; });
    k.button("Recommencer", function(){ reset(true); });
    var ro = k.readouts(["Appariement guide / ADN", "PAM (NGG)", "Étape", "Résultat"]);
    var nt = k.note("", "");
    cam.auto = false;
    var stage = 0, auto = false, tick = 0, T = 0, ins = ["A", "C"], gap = 0, scis = 0;
    function genome(){ return PRE + TGT + (pam.value ? "TGG" : "TCA") + SUF; }
    function eval1(p){ var g = GUIDES[gsel.value], gn = genome(), m = 0, seed = true, j; for (j = 0; j < 20; j++){ if (g[j] === gn[p + j]) m++; else if (j >= 10) seed = false; } var pm = gn[p + 21] === "G" && gn[p + 22] === "G"; return {m:m, seed:seed, pam:pm, ok:m >= 18 && seed && pm}; }
    function reset(full){ stage = 0; gap = 0; if (full){ pos.set(0); auto = false; } ins = [["A", "C", "G", "T"][Math.floor(Math.random() * 4)], ["A", "C", "G", "T"][Math.floor(Math.random() * 4)]]; }
    function nextStage(){ var e = eval1(pos.value); if (stage === 0){ if (e.ok) stage = 1; else { auto = false; blocked = true; } } else if (stage < 3) stage++; }
    var blocked = false;
    var BASEC = {A:B.hex("#2e9e5b"), T:B.hex("#d64545"), G:B.hex("#2563eb"), C:B.hex("#e0a100")};
    B.drag(c, cam, function(){ render(); });
    function step(dt){
      T += dt;
      if (stage >= 2) gap += ((stage === 2 ? 0.34 : 0.0) - gap) * Math.min(1, dt * 3);
      if (auto && stage === 0){ tick += dt; if (tick > 0.55){ tick = 0; var e = eval1(pos.value); if (e.ok){ auto = false; stage = 1; } else if (pos.value < 13) pos.set(pos.value + 1); else auto = false; } }
    }
    function render(){
      B.background(c);
      var gn = genome(), N = gn.length, DX = 0.14, p = pos.value, sc = B.scene(c, cam, Math.min(c.W / 6.4, c.H / 3.2), 4);
      var cutIdx = p + 16, R = 0.28, e = eval1(p);
      var xs = function(i){ var x = (i - (N - 1) / 2) * DX; if (stage >= 2){ var gp = (stage === 2 ? 0.2 : 0.0); x += (i <= cutIdx ? -gp : gp); if (stage === 3) x += (i <= cutIdx ? -0.09 : 0.09); } return x; };
      var OPEN = stage >= 1 && stage <= 2;
      var prev1 = null, prev2 = null;
      for (var i = 0; i < N; i++){
        var a = i * 0.628 + T * 0.4, x = xs(i), op = OPEN && i >= p && i < p + 20 ? 0.33 : 0;
        var q1 = [x, R * Math.cos(a), R * Math.sin(a)], q2 = [x, -R * Math.cos(a) + op * 0.0 + (op ? 0.0 : 0), -R * Math.sin(a)];
        if (op){ q2 = [x, -R * Math.cos(a) + 0.25, -R * Math.sin(a) + 0.15]; }
        if (prev1 && !(stage >= 2 && i === cutIdx + 1)){ sc.tube(prev1, q1, 0.03, B.hex("#1e3f8f")); sc.tube(prev2, q2, 0.03, B.hex("#1e3f8f")); }
        sc.sphere(q1, 0.055, B.hex("#1e3f8f")); sc.sphere(q2, 0.055, B.hex("#1e3f8f"));
        var b1 = gn[i], b2 = flip(b1), mid = [(q1[0] + q2[0]) / 2, (q1[1] + q2[1]) / 2, (q1[2] + q2[2]) / 2];
        if (!op){ sc.tube(q1, mid, 0.025, BASEC[b1]); sc.tube(q2, mid, 0.025, BASEC[b2]); }
        else { sc.tube(q1, [q1[0], q1[1] * 0.5, q1[2] * 0.5], 0.025, BASEC[b1]); }
        prev1 = q1; prev2 = q2;
      }
      /* bases insérées / matrice */
      if (stage === 3){ var xm = xs(cutIdx) + 0.07; for (var j = 0; j < 2; j++){ var xx = xm + j * 0.07 * 1.0, aa = (cutIdx + 1 + j) * 0.628 + T * 0.4; var s1 = [xx, R * Math.cos(aa), R * Math.sin(aa)], s2 = [xx, -R * Math.cos(aa), -R * Math.sin(aa)];
        var col = rep.value === "hdr" ? B.hex("#16a34a") : B.hex("#f97316"); sc.sphere(s1, 0.055, col); sc.sphere(s2, 0.055, col); sc.tube(s1, s2, 0.03, col); } }
      /* Cas9 + ARN guide */
      var xc = (p + 9.5 - (N - 1) / 2) * DX, hov = stage === 0 ? 0.62 : 0.5;
      sc.sphere([xc - 0.2, hov + 0.45, 0.0], 0.62, B.hex("#60a5fa"), 0.42, "#1d4ed8"); sc.sphere([xc + 0.35, hov + 0.35, 0.05], 0.5, B.hex("#94a3b8"), 0.45, "#475569");
      sc.label([xc, hov + 1.25, 0], "Cas9", "#1d4ed8", 12, 0, 0);
      for (var g = 0; g < 20; g++){ var gx = (p + g - (N - 1) / 2) * DX, gy = (stage >= 1 ? 0.0 : hov - 0.1) + (stage >= 1 ? 0.0 : 0.04 * Math.sin(g)), mt = GUIDES[gsel.value][g] === gn[p + g];
        if (stage >= 1){ gx = xs(p + g); var aa2 = (p + g) * 0.628 + T * 0.4; sc.sphere([gx, 0.06 + 0.0, 0.05], 0.05, B.hex("#f97316")); }
        else sc.sphere([gx, hov - 0.12, 0.1 * Math.sin(g * 0.6)], 0.05, mt ? B.hex("#f97316") : B.hex("#b45309")); }
      if (stage === 2) sc.label([xs(cutIdx) , 0.62, 0], "coupure", "#b91c1c", 12, 0, 0);
      if (stage === 3) sc.label([xs(cutIdx), 0.62, 0], rep.value === "hdr" ? "séquence corrigée" : "bases insérées", rep.value === "hdr" ? "#15803d" : "#c2410c", 11, 0, 0);
      sc.flush(); B.hint(c);
      /* bande de séquence en 2D */
      var ctx = c.ctx, cw = Math.min(11, (c.W - 70) / N), x0 = 62, y0 = c.H - 62; ctx.save(); ctx.font = "700 " + Math.max(8, cw - 1) + "px 'JetBrains Mono',monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#475569"; ctx.textAlign = "right"; ctx.font = "700 10px Mulish,system-ui,sans-serif"; ctx.fillText("ADN 5'→3'", x0 - 6, y0); ctx.fillText("ARN guide", x0 - 6, y0 + 28); ctx.textAlign = "center"; ctx.font = "700 " + Math.max(8, cw - 1) + "px 'JetBrains Mono',monospace";
      for (var i2 = 0; i2 < N; i2++){ var inT = i2 >= p && i2 < p + 20, inP = i2 >= p + 20 && i2 < p + 23, cx2 = x0 + i2 * cw + cw / 2;
        if (inT){ ctx.fillStyle = "rgba(249,115,22,.18)"; ctx.fillRect(x0 + i2 * cw, y0 - 9, cw, 18); }
        if (inP){ ctx.fillStyle = e.pam ? "rgba(22,163,74,.3)" : "rgba(220,38,38,.25)"; ctx.fillRect(x0 + i2 * cw, y0 - 9, cw, 18); }
        ctx.fillStyle = "#0f1b2d"; ctx.fillText(gn[i2], cx2, y0);
        if (inT){ var gch = GUIDES[gsel.value][i2 - p], ok = gch === gn[i2]; ctx.fillStyle = ok ? "#16a34a" : "#dc2626"; ctx.fillText(ok ? "|" : "×", cx2, y0 + 14); ctx.fillStyle = "#0f1b2d"; ctx.fillText(gch === "T" ? "U" : gch, cx2, y0 + 28); } }
      ctx.fillStyle = e.pam ? "#15803d" : "#b91c1c"; ctx.textAlign = "left"; ctx.font = "700 10px Mulish,system-ui,sans-serif"; ctx.fillText(e.pam ? "PAM NGG ✓" : "pas de PAM", x0 + (p + 20) * cw, y0 - 16); ctx.restore();
      ro.set(0, e.m + " / 20" + (e.seed ? "" : " (germe ✗)")); ro.set(1, e.pam ? "oui" : "non"); ro.set(2, ["Recherche", "Ouverture de l'ADN", "Coupure", "Réparation"][stage]);
      ro.set(3, stage < 3 ? "—" : (rep.value === "hdr" ? "gène corrigé" : "gène inactivé"));
      var msg, kind = "";
      if (stage === 0){ if (blocked && !e.ok){ msg = !e.pam ? "Pas de PAM (NGG) : Cas9 ne s'attache pas, même si le guide correspond. Elle se détache et continue de chercher." : (!e.seed || e.m < 18 ? "L'ARN guide ne s'apparie pas assez avec l'ADN (" + e.m + "/20, germe " + (e.seed ? "bon" : "non conforme") + ") : pas d'ouverture, pas de coupure." : "Pas de coupure ici."); kind = "warn"; }
        else msg = e.ok ? "Correspondance parfaite et PAM présente : Cas9 peut se fixer. Clique sur « Étape suivante »." : "Cas9 glisse le long de l'ADN en testant les séquences voisines de PAM. Ici : " + e.m + "/20 appariés" + (e.pam ? "" : ", pas de PAM") + ". Déplace-la ou lance la recherche automatique."; }
      else if (stage === 1) msg = "L'ARN guide s'apparie avec 20 bases de l'ADN, qui s'ouvre localement. Cas9 vérifie la correspondance avant de couper.";
      else if (stage === 2) msg = "Cas9 coupe les deux brins, environ 3 bases avant la PAM : cassure double-brin.";
      else msg = rep.value === "hdr" ? "Réparation avec une matrice d'ADN fournie par l'expérimentateur : la séquence voulue (vert) est copiée. Le gène est corrigé ou modifié de façon précise." : "Réparation approximative (NHEJ) : la cellule recolle les extrémités mais des bases sont ajoutées ou perdues (orange). Le gène est décalé, donc inactivé (« knock-out »).";
      if (stage > 0) blocked = false;
      nt.set(msg, stage === 3 ? "ok" : kind);
    }
    k.draw(render);
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b6-3d-crispr*/
