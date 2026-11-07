/* Chapitre 10 · Écosystèmes, cycles biogéochimiques et enjeux globaux */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c10-chaine", ch: "c10", tag: "Classique",
  titre: "Chaîne alimentaire : l'énergie s'amenuise, les polluants s'accumulent",
  resume: "À chaque maillon, environ 10 % de l'énergie passe au niveau suivant ; un polluant persistant, lui, se concentre.",
  but: "Règle l'énergie fixée par les producteurs et le rendement de transfert entre niveaux : la pyramide d'énergie se construit et on voit ce qui part en chaleur à chaque étape. Règle aussi la concentration d'un polluant persistant (type DDT) chez les producteurs et son facteur de concentration par maillon : les gouttelettes se tassent vers le sommet.",
  aRetenir: "L'énergie d'un niveau trophique est seulement une fraction (en moyenne environ 10 %) de celle du niveau précédent : le reste est dépensé par la respiration, la chaleur, les parties non consommées. C'est pourquoi les chaînes sont courtes et que les grands prédateurs sont rares. Les polluants non dégradables et liposolubles s'accumulent au fil des maillons (bioamplification) : les prédateurs sont les plus exposés.",
  piege: "L'énergie ne « recircule » pas (elle est dissipée en chaleur), alors que la matière est recyclée. Et la bioamplification n'est pas une perte d'énergie : le polluant s'accumule parce qu'il n'est ni éliminé ni dégradé, alors que l'énergie diminue. Rendement de 10 % : valeur moyenne, variable (de 5 à 20 %).",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 500 : 480), P = S.draw.palette, T = 0, pick = -1, rows = [];
    var E0 = k.slider("Énergie fixée par les producteurs", 5000, 50000, 1000, 20000, "kJ/m²/an");
    var eff = k.slider("Rendement de transfert entre niveaux", 5, 20, 1, 10, "%");
    var c0 = k.slider("Polluant chez les producteurs", 0.01, 1, 0.01, 0.05, "mg/kg");
    var f = k.slider("Facteur de concentration par maillon", 1, 10, 0.5, 5, "×");
    var lg = k.toggle("Échelle logarithmique des largeurs", false);
    var ro = k.readouts(["Énergie au sommet (kJ/m²/an)", "Part de l'énergie initiale au sommet", "Polluant chez le dernier prédateur", "Facteur sommet / producteurs"]);
    var note = k.note("", "");
    var lp = k.loop(function(dt, t){ T = t; k.redraw(); }); lp.play();
    var NAMES = ["Producteurs", "Herbivores", "Carnivores 1", "Carnivores 2", "Carnivores 3"], EX = ["herbes", "criquets", "grenouilles", "serpents", "rapaces"];
    var COL = ["#4aa564", "#8dbb4a", "#d9b23a", "#e08a2b", "#c0321d"];
    function fm(v){ return v >= 100 ? S.fmt(Math.round(v), 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : S.fmt(v, 1); }
    c.pointer(function(t, p){ if (t !== "down") return; pick = -1; rows.forEach(function(r){ if (p.y >= r.y && p.y <= r.y + r.h) pick = r.i; }); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, e = eff.value / 100, i, j; rows = [];
      var En = [], Cn = []; for (i = 0; i < 5; i++){ En.push(E0.value * Math.pow(e, i)); Cn.push(c0.value * Math.pow(f.value, i)); }
      function width(v, vmin, vmax, maxW){ if (lg.value) return Math.max(6, (Math.log10(v) - Math.log10(vmin) + 0.3) / (Math.log10(vmax) - Math.log10(vmin) + 0.3) * maxW); return Math.max(4, v / vmax * maxW); }
      var lw = 92, maxW = W - lw - 14, cx = lw + maxW / 2;
      S.draw.text(c, "Pyramide d'énergie (kJ/m²/an) · touche un niveau", 10, 12, {align: "left", size: 12.5});
      for (i = 0; i < 5; i++){
        var y = 28 + (4 - i) * 36, w = width(En[i], En[4], En[0], maxW), wn = i < 4 ? width(En[i + 1], En[4], En[0], maxW) : w * 0.5;
        rows.push({i: i, y: y, h: 32});
        var g = ctx.createLinearGradient(0, y, 0, y + 32); g.addColorStop(0, COL[i]); g.addColorStop(1, S.draw.tint(COL[i], 0.8));
        ctx.beginPath(); ctx.moveTo(cx - wn / 2, y); ctx.lineTo(cx + wn / 2, y); ctx.lineTo(cx + w / 2, y + 32); ctx.lineTo(cx - w / 2, y + 32); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
        if (pick === i){ ctx.lineWidth = 2.5; ctx.strokeStyle = P.ink; ctx.stroke(); }
        S.draw.text(c, NAMES[i], 8, y + 12, {align: "left", size: 12, color: P.ink}); S.draw.text(c, EX[i], 8, y + 26, {align: "left", size: 10, color: P.grey, weight: 600});
        S.draw.text(c, fm(En[i]), cx, y + 16, {size: 12.5, color: w > 56 ? "#fff" : P.ink, bg: w > 56 ? null : "rgba(255,255,255,.85)"});
        if (i < 4){ var ph = (T * 0.8 + i * 0.3) % 1; S.draw.arrow(c, cx + w / 2 + 6, y + 34 - ph * 8, cx + w / 2 + 6 + Math.min(22, W * .05), y + 24 - ph * 8, "rgba(224,122,31," + (1 - ph) + ")", 1.6); }
      }
      S.draw.text(c, "↗ chaleur perdue à chaque transfert : " + (100 - eff.value) + " %", W - 8, 214, {align: "right", size: 11, color: P.orange});
      /* polluant : gouttelettes qui se tassent */
      var y0 = 246; S.draw.text(c, "Polluant persistant dans les tissus (mg/kg)", 10, y0, {align: "left", size: 12.5});
      for (i = 0; i < 5; i++){
        var yy = y0 + 14 + i * 36, ww = width(Cn[i], Cn[0], Cn[4], maxW), ratio = Cn[i] / Cn[0];
        rows.push({i: i, y: yy, h: 32});
        S.draw.text(c, NAMES[i], 8, yy + 16, {align: "left", size: 12});
        ctx.fillStyle = "#f1f3f7"; S.draw.rrect(c, lw, yy, maxW, 30, 6); ctx.fill();
        ctx.fillStyle = S.draw.tint("#b3341f", 0.18 + 0.1 * i); S.draw.rrect(c, lw, yy, Math.max(4, ww), 30, 6); ctx.fill();
        var nd = Math.min(70, Math.round(2 + 5 * Math.sqrt(ratio)));
        for (j = 0; j < nd; j++){ var rx = Math.sin(j * 12.9898 + i * 4.1) * 43758.5; rx -= Math.floor(rx); var ry = Math.sin(j * 78.233 + i * 2.3) * 12543.7; ry -= Math.floor(ry);
          ctx.beginPath(); ctx.arc(lw + 6 + rx * Math.max(0, ww - 12), yy + 5 + ry * 20 + Math.sin(T * 2 + j) * 0.8, 2.2, 0, 6.2832); ctx.fillStyle = "#8a1f12"; ctx.fill(); }
        var inside = ww > maxW * 0.72; S.draw.text(c, S.fmt(Cn[i], Cn[i] < 1 ? 2 : 1) + " mg/kg", inside ? lw + ww - 6 : lw + Math.max(4, ww) + 6, yy + 16, {align: inside ? "right" : "left", size: 12, color: P.ink, bg: "rgba(255,255,255,.88)"});
      }
      if (pick >= 0){ var lost = pick < 4 ? En[pick] - En[pick + 1] : 0; S.draw.label(c, NAMES[pick] + " : " + fm(En[pick]) + " kJ" + (pick < 4 ? " dont " + fm(lost) + " perdus en chaleur et déchets" : " (sommet : rien ne sert plus de nourriture)"), W / 2, c.H - 12, {color: COL[pick], size: 11.5}); }
      ro.set(0, S.fmt(En[4], En[4] < 10 ? 2 : 1)); ro.set(1, S.fmt(En[4] / En[0] * 100, 3) + " %"); ro.set(2, S.fmt(Cn[4], 2) + " mg/kg"); ro.set(3, "× " + S.fmt(Cn[4] / Cn[0], 0));
      note.set("Avec " + eff.value + " % de rendement, le 5e niveau reçoit " + S.fmt(En[4] / En[0] * 100, 3) + " % de l'énergie des producteurs : au-delà de 4 ou 5 maillons, il n'en reste presque rien. À l'inverse, le polluant est multiplié par " + S.fmt(Cn[4] / Cn[0], 0) + " entre le début et la fin de la chaîne.", "");
    });
  }
});



SFA.sim({
  id: "b6-c10-azote", ch: "c10", tag: "Environnement",
  titre: "Engrais azotés : rendement, surplus et nitrates dans l'eau",
  resume: "Au-delà d'une certaine dose, l'engrais en plus n'augmente presque plus la récolte mais fait grimper les nitrates qui rejoignent l'eau.",
  but: "Règle la dose d'azote apportée par hectare, la présence de légumineuses (qui fixent l'azote de l'air) et une zone tampon. Le graphe relie dose, rendement et concentration de nitrates dans l'eau de drainage (norme de potabilité : 50 mg/L).",
  aRetenir: "Le rendement croît puis plafonne (loi des rendements décroissants) alors que le surplus d'azote non absorbé par la culture est lessivé sous forme de nitrates. Les nitrates et phosphates qui parviennent aux cours d'eau favorisent la prolifération d'algues (eutrophisation) ; leur décomposition consomme le dioxygène et peut asphyxier les poissons. Les légumineuses, grâce à des bactéries symbiotiques, fixent l'azote atmosphérique.",
  piege: "Plus d'engrais ne donne pas toujours plus de récolte. Le surplus ne disparaît pas : il va dans les eaux souterraines et de surface. Et en eau douce, c'est souvent le phosphore (et pas l'azote) qui limite la croissance des algues. Modèle très simplifié (valeurs d'ordre de grandeur).",
  build: function(k, S){
    var c = k.canvas(window.innerWidth < 760 ? 540 : 520), P = S.draw.palette, Tt = 0, gx = null;
    var fe = k.slider("Dose d'azote apportée", 0, 300, 10, 150, "kg N/ha/an");
    var lg = k.toggle("Légumineuses dans la rotation (+40 kg N/ha fixés)", false);
    var bf = k.slider("Zone tampon (part des nitrates retenue)", 0, 80, 5, 0, "%");
    var ro = k.readouts(["Rendement", "Azote en surplus", "Nitrates dans l'eau (mg/L)", "Dose sans surplus"]);
    var note = k.note("", "");
    var SOIL = 60;
    var lp = k.loop(function(dt, t){ Tt = t; k.redraw(); }); lp.play();
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && gx && p.y > gx.T - 10){ fe.set(Math.max(0, Math.min(300, Math.round((p.x - gx.L) / (gx.R - gx.L) * 300 / 10) * 10))); } });
    function model(F){ var fix = lg.value ? 40 : 0, avail = F + fix + SOIL, Y = 10 * (1 - Math.exp(-avail / 120)), U = 22 * Y, sur = Math.max(0, avail - U), L = 0.6 * sur * (1 - bf.value / 100); return {Y: Y, sur: sur, C: L * 1.477}; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, m = model(fe.value), L = 50, R = c.W - 48, T = 192, Bm = c.H - 40, i, W = c.W;
      gx = {L: L, R: R, T: T};
      var X = function(F){ return L + F / 300 * (R - L); }, YY = function(y){ return Bm - y / 10 * (Bm - T); }, YC = function(cn){ return Bm - cn / 200 * (Bm - T); };

      /* scène : champ, racines, nappe phréatique */
      var gy = 70, sh = 86;
      var sky = ctx.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, "#e6f3fb"); sky.addColorStop(1, "#f6fbff"); ctx.fillStyle = sky; S.draw.rrect(c, 6, 6, W - 12, gy - 6, 8); ctx.fill();
      ctx.fillStyle = "#8a6a45"; ctx.fillRect(6, gy, W - 12, 52); ctx.fillStyle = "#6f8fbf"; ctx.fillRect(6, gy + 52, W - 12, 28);
      S.draw.text(c, "sol cultivé", 12, gy + 12, {align: "left", size: 10.5, color: "#fff"}); S.draw.text(c, "nappe phréatique · " + S.fmt(m.C, 0) + " mg/L de nitrates", 12, gy + 66, {align: "left", size: 10.5, color: "#fff"});
      var stalks = Math.max(8, Math.floor((W - 40) / 16)), hgt = 6 + 48 * (m.Y / 10);
      for (i = 0; i < stalks; i++){ var sx = 20 + i * ((W - 40) / (stalks - 1)), sw = Math.sin(Tt * 1.6 + i * .7) * 2; ctx.strokeStyle = "#4aa564"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, gy); ctx.quadraticCurveTo(sx + sw * .4, gy - hgt / 2, sx + sw, gy - hgt); ctx.stroke(); ctx.fillStyle = "#d9b23a"; if (m.Y > 6) { ctx.beginPath(); ctx.ellipse(sx + sw, gy - hgt - 3, 2.4, 5, 0, 0, 6.2832); ctx.fill(); } }
      var nd = Math.min(40, Math.round(m.sur / 4)), dropCol = m.C > 50 ? "#c0321d" : "#2f7fd1";
      for (i = 0; i < nd; i++){ var rx = Math.sin(i * 12.9898) * 43758.5; rx -= Math.floor(rx); var ph = (Tt * 0.5 + i * 0.173) % 1; ctx.beginPath(); ctx.arc(14 + rx * (W - 28), gy + 4 + ph * 48, 2.3, 0, 6.2832); ctx.fillStyle = S.draw.tint(dropCol, 1 - ph * 0.6); ctx.fill(); }
      if (bf.value > 0){ ctx.fillStyle = "rgba(36,119,90,.8)"; ctx.fillRect(6, gy - 6, 26, 8); S.draw.text(c, "tampon", 40, gy - 4, {align: "left", size: 9.5, color: P.green}); }
      ctx.strokeStyle = "#edf0f4"; ctx.font = "600 12px Mulish, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center";
      for (i = 0; i <= 300; i += 50){ ctx.beginPath(); ctx.moveTo(X(i), T); ctx.lineTo(X(i), Bm); ctx.stroke(); ctx.fillText(i, X(i), Bm + 12); }
      ctx.textAlign = "right"; for (i = 0; i <= 10; i += 2){ ctx.fillStyle = P.green; ctx.fillText(i, L - 4, YY(i)); } ctx.textAlign = "left"; for (i = 0; i <= 200; i += 50){ ctx.fillStyle = P.red; ctx.fillText(i, R + 4, YC(i)); }
      ctx.strokeStyle = "#8a95a3"; ctx.strokeRect(L, T, R - L, Bm - T);
      S.draw.text(c, "dose d'azote (kg N/ha/an) · touche le graphique pour la changer", (L + R) / 2, Bm + 28, {size: 12, color: P.grey}); S.draw.text(c, "rendement (t/ha)", L + 2, T - 8, {size: 12, color: P.green, align: "left"}); S.draw.text(c, "nitrates (mg/L)", R + 8, T - 8, {size: 12, color: P.red, align: "right"});
      S.draw.line(c, L, YC(50), R, YC(50), P.red, 1.4, [5, 4]); S.draw.text(c, "norme 50 mg/L", L + 6, YC(50) - 8, {size: 12, color: P.red, align: "left"});
      [[function(F){ return model(F).Y; }, YY, P.green], [function(F){ return model(F).C; }, YC, P.red]].forEach(function(s){ ctx.strokeStyle = s[2]; ctx.lineWidth = 2.8; ctx.beginPath(); for (var F = 0; F <= 300; F += 5){ var xx = X(F), yy = s[1](Math.min(s[0](F), 200)); if (F === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); } ctx.stroke(); });
      S.draw.dot(c, X(fe.value), YY(m.Y), 6, P.green); S.draw.dot(c, X(fe.value), YC(Math.min(m.C, 200)), 6, P.red);
      var lo = 0, hi = 300; for (i = 0; i < 50; i++){ var mid = (lo + hi) / 2; if (model(mid).sur > 0.5) hi = mid; else lo = mid; }
      var ideal = model(0).sur > 0.5 ? 0 : lo;
      ro.set(0, S.fmt(m.Y, 1) + " t/ha"); ro.set(1, S.fmt(m.sur, 0) + " kg N/ha"); ro.set(2, S.fmt(m.C, 0)); ro.set(3, "≈ " + S.fmt(ideal, 0) + " kg N/ha");
      note.set(m.C > 50 ? "Nitrates de l'eau : " + S.fmt(m.C, 0) + " mg/L, au-dessus de la norme de potabilité (50 mg/L). Le surplus d'azote (" + S.fmt(m.sur, 0) + " kg/ha) n'est plus absorbé par la culture." : m.sur > 0.5 ? "Un surplus d'azote apparaît, mais la concentration reste sous la norme." : "L'azote apporté est entièrement absorbé : pas de surplus à lessiver.", m.C > 50 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c10-climat", ch: "c10", tag: "Quantitatif",
  titre: "Émissions de CO₂ et réchauffement : un modèle simplifié",
  resume: "À partir des émissions annuelles, on suit le CO₂ atmosphérique et la température sur un siècle.",
  but: "Choisis un scénario d'évolution des émissions (point de départ : 10 milliards de tonnes de carbone par an en 2025, CO₂ à 425 ppm, +1,3 °C), la part du CO₂ qui reste dans l'atmosphère et la sensibilité du climat. Lis le CO₂, la température et l'année du dépassement de +2 °C.",
  aRetenir: "Le CO₂ est un gaz à effet de serre : il retient une partie du rayonnement infrarouge émis par la Terre. Tant que les émissions dépassent ce que l'océan et la végétation absorbent, sa concentration augmente. Seule une forte baisse des émissions stabilise la concentration ; l'inertie thermique des océans retarde la réponse de la température.",
  piege: "Modèle volontairement très simplifié (une seule boîte atmosphère, une boîte océan, part retenue constante, pas d'aérosols ni de rétroactions) : ses résultats sont des ordres de grandeur, pas des prévisions. La température ne baisse pas quand les émissions diminuent, seulement quand le CO₂ lui-même baisse : stabiliser les émissions ne stabilise pas le CO₂.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette;
    var sc = k.select("Scénario d'émissions", [["a", "Émissions constantes"], ["b", "Hausse de 1 % par an"], ["c", "Baisse de 3 % par an"], ["d", "Baisse linéaire jusqu'à zéro en 2050"], ["e", "Baisse linéaire jusqu'à zéro en 2075"]], "a");
    var af = k.slider("Part du CO₂ émis qui reste dans l'atmosphère", 0.3, 0.6, 0.05, 0.45, "");
    var lam = k.slider("Sensibilité du climat (K par W/m²)", 0.5, 1.2, 0.1, 0.8, "");
    var ro = k.readouts(["CO₂ en 2100", "Température en 2100 (au-dessus de l'ère préindustrielle)", "Année du dépassement de +2 °C"]);
    var note = k.note("", "");
    function run(){
      var C = 425, T = 1.3, E0 = 10, out = [], y;
      for (y = 2025; y <= 2125; y++){
        out.push([y, C, T]);
        var t = y - 2025, E = sc.value === "a" ? E0 : sc.value === "b" ? E0 * Math.pow(1.01, t) : sc.value === "c" ? E0 * Math.pow(0.97, t) : sc.value === "d" ? Math.max(0, E0 * (1 - t / 25)) : Math.max(0, E0 * (1 - t / 50));
        C += af.value * E / 2.12;
        var Teq = lam.value * 5.35 * Math.log(C / 280); T += (Teq - T) / 30;
      }
      return out;
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, d = run(), i;
      var cmax = Math.max(700, Math.ceil(Math.max.apply(null, d.map(function(p){ return p[1]; })) / 100) * 100);
      var ax1 = S.draw.axes(c, {x0: 2025, x1: 2125, y0: 250, y1: cmax, stepX: 25, stepY: 100, t: 14, b: c.H - 190, yl: "CO₂ (ppm)", l: 48});
      S.draw.line(c, ax1.L, ax1.Y(280), ax1.R, ax1.Y(280), P.green, 1.3, [4, 4]); S.draw.text(c, "280 ppm (préindustriel)", ax1.L + 4, ax1.Y(280) - 8, {size: 12, color: P.green, align: "left"});
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2.8; ctx.beginPath(); d.forEach(function(p, q){ if (q === 0) ctx.moveTo(ax1.X(p[0]), ax1.Y(p[1])); else ctx.lineTo(ax1.X(p[0]), ax1.Y(p[1])); }); ctx.stroke();
      var tmax = Math.max(4, Math.ceil(Math.max.apply(null, d.map(function(p){ return p[2]; })) + 0.3));
      var ax2 = S.draw.axes(c, {x0: 2025, x1: 2125, y0: 0, y1: tmax, stepX: 25, stepY: 1, t: ax1.B + 40, b: 30, xl: "année", yl: "ΔT (°C)", l: 48});
      [[1.5, "+1,5 °C"], [2, "+2 °C"]].forEach(function(l){ S.draw.line(c, ax2.L, ax2.Y(l[0]), ax2.R, ax2.Y(l[0]), P.red, 1.2, [4, 4]); S.draw.text(c, l[1], ax2.R - 4, ax2.Y(l[0]) - 8, {size: 12, color: P.red, align: "right"}); });
      ctx.strokeStyle = P.red; ctx.lineWidth = 2.8; ctx.beginPath(); d.forEach(function(p, q){ if (q === 0) ctx.moveTo(ax2.X(p[0]), ax2.Y(p[2])); else ctx.lineTo(ax2.X(p[0]), ax2.Y(p[2])); }); ctx.stroke();
      var y2100 = d[75], cross = null; for (i = 0; i < d.length; i++) if (d[i][2] >= 2){ cross = d[i][0]; break; }
      ro.set(0, S.fmt(y2100[1], 0) + " ppm"); ro.set(1, "+" + S.fmt(y2100[2], 1) + " °C"); ro.set(2, cross ? String(cross) : "pas avant 2125");
      var peak = Math.max.apply(null, d.map(function(p){ return p[1]; })), last = d[d.length - 1][1];
      var nz = sc.value === "d" ? 2050 : 2075;
      note.set(sc.value === "a" ? "Même avec des émissions constantes, le CO₂ continue de monter d'environ " + S.fmt(af.value * 10 / 2.12, 1) + " ppm par an : on ajoute du CO₂ plus vite qu'il n'est retiré." : sc.value === "b" ? "Les émissions augmentent de 1 % par an : le CO₂ monte de plus en plus vite et la température suit, avec retard." : sc.value === "c" ? "Les émissions diminuent mais ne sont jamais nulles : le CO₂ continue d'augmenter, de plus en plus lentement." : "Les émissions s'annulent en " + nz + " : la hausse du CO₂ s'arrête alors (" + S.fmt(peak, 0) + " ppm). Dans ce modèle simplifié, sans absorption supplémentaire par l'océan, il ne redescend pas ; la température se stabilise ensuite à un niveau élevé.", "");
    });
  }
});

SFA.sim({
  id: "b6-c10-perturbation", ch: "c10", tag: "Biodiversité",
  titre: "Perturbations et biodiversité : l'hypothèse des perturbations intermédiaires",
  resume: "Une forêt gérée par coupes : trop peu de perturbations et la forêt mature domine, trop de perturbations et il ne reste que des pionnières.",
  but: "Chaque carré est une parcelle dont la couleur indique l'âge depuis la dernière perturbation (coupe, tempête, incendie). Règle la fréquence des perturbations : la richesse en espèces dépend des types de milieux (âges) présents en assez grande surface.",
  aRetenir: "La succession écologique est la suite ordonnée de communautés qui remplace une communauté après une perturbation : herbes, arbustes, arbres pionniers, forêt mature. Chaque espèce est adaptée à certains stades. À fréquence de perturbation intermédiaire, une mosaïque de stades existe et la diversité est maximale ; trop peu ou trop souvent, la mosaïque disparaît.",
  piege: "La perturbation n'est pas toujours mauvaise pour la biodiversité : sans aucune perturbation, les espèces des stades jeunes disparaissent. Mais elle n'est bonne que dans une certaine gamme : au-delà, les stades matures sont perdus. Modèle simplifié : 10 espèces choisies, une espèce persiste si au moins 2 % de la surface offre son stade.",
  build: function(k, S){
    var c = k.canvas(560), P = S.draw.palette;
    var dd = k.slider("Perturbation (part de la surface remise à zéro chaque année)", 0.2, 40, 0.2, 3, "%");
    var seed = 1; k.button("Nouveau paysage", function(){ seed++; });
    var ro = k.readouts(["Espèces présentes", "Âge moyen d'une parcelle", "Surface de forêt mature (> 80 ans)"]);
    var note = k.note("", "");
    var SP = [["Herbes pionnières", 0, 4], ["Insectes des clairières", 0, 10], ["Grandes herbes, ronces", 2, 12], ["Oiseaux de lisière", 5, 30], ["Arbustes (saule, noisetier)", 6, 30], ["Bouleau, tremble", 10, 50], ["Chênes", 30, 150], ["Plantes de sous-bois", 50, 1e9], ["Hêtre", 80, 1e9], ["Mousses, bois mort", 120, 1e9]];
    function frac(d, a, b){ return Math.exp(-d * a) - (b < 1e8 ? Math.exp(-d * b) : 0); }
    function rich(d){ var n = 0; SP.forEach(function(s){ if (frac(d, s[1], s[2]) >= 0.02) n++; }); return n; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, d = dd.value / 100, G = 22, cs = Math.min(9, (c.W - 130) / G), r = B.rng(seed * 1237 + Math.round(dd.value * 5)), i, j;
      var sx = 8, sy = 10, ages = [];
      for (i = 0; i < G * G; i++){ var a = -Math.log(1 - r()) / d; ages.push(a); }
      for (i = 0; i < G * G; i++){ var a2 = ages[i]; ctx.fillStyle = a2 < 5 ? "#f3e08a" : a2 < 30 ? "#a8d08d" : a2 < 80 ? "#4f9a5a" : "#1f5e3b"; ctx.fillRect(sx + (i % G) * cs, sy + Math.floor(i / G) * cs, cs - 0.6, cs - 0.6); }
      var lx = sx + G * cs + 14; [["#f3e08a", "< 5 ans"], ["#a8d08d", "5–30 ans"], ["#4f9a5a", "30–80 ans"], ["#1f5e3b", "> 80 ans"]].forEach(function(l, q){ ctx.fillStyle = l[0]; ctx.fillRect(lx, sy + q * 24, 14, 14); S.draw.text(c, l[1], lx + 20, sy + 7 + q * 24, {align: "left", size: 12}); });
      var y0 = sy + G * cs + 22, cnt = 0;
      S.draw.text(c, "Surface favorable à chaque espèce", 8, y0 - 8, {align: "left", size: 12, color: P.grey});
      SP.forEach(function(s, q){ var f = frac(d, s[1], s[2]), on = f >= 0.02; if (on) cnt++; var yy = y0 + 4 + q * 17; ctx.fillStyle = on ? P.green : "#c9d0d8"; ctx.fillRect(8, yy, Math.max(2, Math.min(1, f) * 90), 12); S.draw.text(c, s[0] + (on ? "" : " (absente)"), 104, yy + 6, {align: "left", size: 12, color: on ? P.ink : P.grey, weight: on ? 700 : 600}); });
      var gy = y0 + 4 + SP.length * 17 + 14, gh = 80, gx = 8, gw2 = c.W - 20; ctx.strokeStyle = "#c6cdd6"; ctx.strokeRect(gx, gy, gw2, gh);
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.beginPath(); for (i = 0; i <= 40; i++){ var dv = Math.exp(Math.log(0.002) + (Math.log(0.4) - Math.log(0.002)) * i / 40), xx = gx + 2 + i / 40 * (gw2 - 4), yy2 = gy + gh - rich(dv) / 10 * (gh - 12) - 4; if (i === 0) ctx.moveTo(xx, yy2); else ctx.lineTo(xx, yy2); } ctx.stroke();
      var xm = gx + 2 + (Math.log(d) - Math.log(0.002)) / (Math.log(0.4) - Math.log(0.002)) * (gw2 - 4); S.draw.dot(c, xm, gy + gh - cnt / 10 * (gh - 12) - 4, 5, P.red);
      S.draw.text(c, "Richesse selon la perturbation", c.W / 2, gy + gh + 14, {size: 12, color: P.grey});
      var meanA = 1 / d, mature = Math.exp(-d * 80) * 100;
      ro.set(0, cnt + " sur " + SP.length); ro.set(1, S.fmt(meanA, 0) + " ans"); ro.set(2, S.fmt(mature, 0) + " %");
      note.set(cnt >= 9 ? "Perturbations intermédiaires : toutes les classes d'âge sont représentées en assez grande surface, la richesse en espèces est maximale." : mature < 30 ? "Perturbations fréquentes : très peu de parcelles dépassent 80 ans, les espèces des forêts matures se raréfient ou disparaissent." : "Perturbations très rares : la forêt mature domine, les espèces des milieux ouverts et des jeunes stades disparaissent.", cnt >= 9 ? "ok" : "warn");
    });
  }
});
})();
