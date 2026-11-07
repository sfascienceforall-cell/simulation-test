/* Chapitre 10 · Physique et santé ; climat et énergie */
SFA.sim({
  id: "p6-c10-echographie", ch: "c10", tag: "Imagerie",
  titre: "Échographie : temps d'écho, fréquence et profondeur",
  resume: "Un ultrason part, se réfléchit sur une interface et revient : t = 2d/v. Fréquence plus haute = image plus fine, mais portée plus courte. Défi : la fréquence maximale.",
  but: "Une impulsion descend sous la sonde, se réfléchit sur l'interface et remonte. Glisse l'interface pour changer sa profondeur, choisis ce qui est derrière, la fréquence et le gel de contact. Lis le temps d'écho, le niveau de l'écho (dB) et regarde l'image obtenue.",
  aRetenir: "L'échographie utilise des ultrasons (f > 20 kHz, typiquement 2 à 15 MHz), pas des rayons. La profondeur se déduit du temps d'écho : d = v·t/2, avec v ≈ 1 540 m/s dans les tissus mous. Une interface réfléchit d'autant plus que les impédances acoustiques Z = ρ·v diffèrent. La résolution est de l'ordre de λ = v/f : une fréquence plus élevée donne une image plus fine, mais l'atténuation (≈ 0,5 dB par cm et par MHz dans chaque sens) limite la profondeur.",
  piege: "L'échographie n'utilise ni rayons X ni rayonnement ionisant : ce sont des ondes mécaniques. Sans gel, l'air entre la sonde et la peau réfléchit presque tout : on ne voit rien. L'os et les poumons (air) bloquent les ultrasons. Valeurs d'ordre de grandeur (milieu homogène, interface plane).",
  build: function(k, S){
    var c = k.canvas(320), g = k.canvas(200), P = S.draw.palette, Pm = window.PH6, V = 1540, Z1 = 1.63;
    var d = k.slider("Profondeur de l'interface", 1, 20, 0.5, 8, "cm");
    var tg = k.select("Ce qui est derrière l'interface", [["gr", "Graisse (Z = 1,38)"], ["mu", "Muscle (Z = 1,70)"], ["os", "Os (Z = 7,8)"], ["ai", "Air / poumon (Z = 0,0004)"]], "gr");
    var f = k.slider("Fréquence de la sonde", 1, 15, 0.5, 5, "MHz");
    var gel = k.toggle("Gel de contact", true);
    var goal = false, clock = 0, geo = {}, noise = [];
    for (var q = 0; q < 700; q++) noise.push([Math.random(), Math.random(), Math.random()]);
    k.button("Défi : la fréquence la plus haute qui voit encore l'interface", function(){
      goal = true; d.set(6 + Math.round(Math.random() * 24) / 2); tg.set(["gr", "mu", "os"][Math.floor(Math.random() * 3)]); gel.set(true); f.set(2);
    }, true);
    var ro = k.readouts(["Temps d'écho t = 2d/v", "Longueur d'onde (≈ résolution)", "Réflexion R de l'interface", "Niveau de l'écho reçu"]);
    var nt = k.note("", "ok");
    var Zs = {gr: 1.38, mu: 1.70, os: 7.8, ai: 0.0004}, THR = -90;
    var lp = k.loop(function(dt){ clock += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ns-resize";
    c.pointer(function(tp, p){ if ((tp === "down" || tp === "drag") && geo.y0 !== undefined){ d.set(Math.round(Math.max(1, Math.min(20, (p.y - geo.y0) / geo.sc)) * 2) / 2); } });
    function levelOf(dd, ff, tgv, gl){ var Z2 = Zs[tgv], R = Math.pow((Z2 - Z1) / (Z2 + Z1), 2); return 10 * Math.log10(R) - ff * dd - (gl ? 0 : 60); }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, t = 2 * (d.value / 100) / V * 1e6, Z2 = Zs[tg.value], R = Math.pow((Z2 - Z1) / (Z2 + Z1), 2);
      var lev = levelOf(d.value, f.value, tg.value, gel.value), lam = V / (f.value * 1e6) * 1000, seen = lev > THR;
      /* scène : coupe de tissus sous la sonde */
      var y0 = 62, sc = (H - y0 - 20) / 20, sw = W - Math.max(124, W * 0.2 + 60), x0 = 40; geo.y0 = y0; geo.sc = sc;
      Pm.bg(c, "#f7f9fc", "#eef2f8");
      var yi = y0 + d.value * sc;
      var below = {gr: ["#f3dc8a", "#e8c860"], mu: ["#d9777a", "#b8545a"], os: ["#f4f1e8", "#cfc8b6"], ai: ["#dff0fb", "#bcdcf0"]}[tg.value];
      var gt = ctx.createLinearGradient(0, y0, 0, yi); gt.addColorStop(0, "#f6c9b8"); gt.addColorStop(1, "#e8a894"); ctx.fillStyle = gt; ctx.fillRect(x0, y0, sw, yi - y0);
      var gb = ctx.createLinearGradient(0, yi, 0, H); gb.addColorStop(0, below[0]); gb.addColorStop(1, below[1]); ctx.fillStyle = gb; ctx.fillRect(x0, yi, sw, H - yi - 8);
      ctx.strokeStyle = "rgba(19,35,58,.5)"; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y0, sw, H - y0 - 8);
      for (var dd = 0; dd <= 20; dd += 5){ S.draw.line(c, x0 - 5, y0 + dd * sc, x0, y0 + dd * sc, P.grey, 1.2); S.draw.text(c, dd + " cm", x0 - 8, y0 + dd * sc + (dd === 0 ? 8 : 0), {size: 10.5, color: P.grey, align: "right", weight: 600}); }
      /* sonde et gel */
      var px = x0 + sw / 2;
      if (gel.value){ ctx.fillStyle = "rgba(140,200,235,.7)"; ctx.fillRect(px - 30, y0 - 7, 60, 7); } else { ctx.fillStyle = "#fff"; ctx.fillRect(px - 30, y0 - 7, 60, 7); S.draw.text(c, "air", px + 44, y0 - 4, {size: 10.5, color: P.red}); }
      Pm.metal(c, px - 30, y0 - 38, 60, 31, 6, "#3d4a60"); ctx.strokeStyle = "#3d4a60"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px, y0 - 38); ctx.lineTo(px, 14); ctx.stroke();
      S.draw.text(c, "sonde", px - 42, y0 - 24, {size: 11, color: P.grey, align: "right"});
      /* impulsion : descend, se réfléchit, remonte (ralenti) */
      var cyc = 3.6, u = (clock % cyc) / 2.8, z = u <= 1 ? u * d.value * 2 : -1;   /* z : trajet parcouru en cm (aller-retour = 2d) */
      if (z >= 0){
        var depthNow = z <= d.value ? z : 2 * d.value - z, going = z <= d.value, alpha = going ? (gel.value ? 1 : 0.35) : (seen ? Math.max(0.3, (lev + 110) / 110) : 0.1);
        var nW = 4, lamPx = Math.max(5, lam * 2.4);
        for (var w = 0; w < nW; w++){ var yy = y0 + (depthNow - (going ? 1 : -1) * w * lamPx / sc * 0.5) * sc; if (yy < y0 || yy > yi + 1) continue; ctx.beginPath(); ctx.ellipse(px, yy, 18 + yy * 0.12, 6, 0, going ? 0 : Math.PI, going ? Math.PI : 2 * Math.PI); ctx.strokeStyle = (going ? "rgba(31,75,158," : "rgba(36,119,90,") + (alpha * (1 - w * 0.22)) + ")"; ctx.lineWidth = 3; ctx.stroke(); }
      }
      /* interface : poignée */
      S.draw.line(c, x0, yi, x0 + sw, yi, "#13233a", 1.6, [6, 4]); S.draw.dot(c, x0 + sw - 6, yi, 7, P.red);
      S.draw.label(c, "d = " + S.fmt(d.value, 1) + " cm — glisse", x0 + 6, yi - 9, {align: "left", color: P.red, size: 11.5});
      /* image échographique (mode B simulé) */
      var bx = x0 + sw + 12, bw = Math.max(64, Math.min(110, W * 0.2)), bh = H - y0 - 8;
      S.draw.text(c, "image", bx + bw / 2, y0 - 14, {size: 11.5, color: P.ink});
      ctx.fillStyle = "#0b1220"; ctx.fillRect(bx, y0, bw, bh);
      var gain = Math.max(0, (lev + 110) / 110), blur = Math.max(1.2, Math.min(9, lam * 1.1));
      ctx.save(); ctx.beginPath(); ctx.rect(bx, y0, bw, bh); ctx.clip();
      for (var s = 0; s < noise.length; s++){ var nx = noise[s][0], ny = noise[s][1], inten = noise[s][2], yd = y0 + ny * bh, depthCm = (yd - y0) / sc, tiss = Math.pow(10, -(f.value * depthCm * 0.5) / 20) * (gel.value ? 1 : 0.04) * (depthCm < d.value ? 0.45 : (tg.value === "ai" || tg.value === "os" ? 0.03 : 0.25)); ctx.fillStyle = "rgba(210,220,235," + Math.min(0.6, tiss * inten * 0.9) + ")"; ctx.fillRect(bx + nx * bw, yd, Math.max(1, 2.4 - lam * 0.5), Math.max(1, 3 - lam * 0.5)); }
      if (seen){ var lg = ctx.createLinearGradient(0, yi - blur, 0, yi + blur); lg.addColorStop(0, "rgba(255,255,255,0)"); lg.addColorStop(0.5, "rgba(255,255,255," + Math.min(1, 0.35 + gain * 0.9) + ")"); lg.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = lg; ctx.fillRect(bx, yi - blur, bw, 2 * blur); }
      ctx.restore(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.strokeRect(bx, y0, bw, bh);
      S.draw.label(c, seen ? "visible" : "invisible", bx + bw / 2, y0 + 12, {color: seen ? P.green : P.red, size: 10.5});
      /* A-mode */
      var ax = S.draw.axes(g, {x0: 0, x1: 320, y0: -110, y1: -0.001, xl: "t (µs)", yl: "dB", l: 52, t: 22, stepX: 50, stepY: 25});
      S.draw.line(g, ax.X(0), ax.Y(-110), ax.X(0), ax.Y(0), P.acc, 4); S.draw.label(g, "émission", ax.X(0) + 12, ax.T + 14, {align: "left", color: P.acc, size: 11});
      S.draw.line(g, ax.L, ax.Y(THR), ax.R, ax.Y(THR), P.red, 1.5, [6, 4]); S.draw.label(g, "seuil de détection ≈ −90 dB", ax.R - 4, ax.Y(THR) - 12, {align: "right", color: P.red, size: 11});
      var tt = Math.min(t, 320), yv = Math.max(-110, lev);
      S.draw.line(g, ax.X(tt), ax.Y(-110), ax.X(tt), ax.Y(yv), seen ? P.green : P.grey, 6);
      S.draw.label(g, "écho " + S.fmt(t, 0) + " µs", ax.X(tt), Math.max(ax.T + 28, ax.Y(yv) - 14), {color: seen ? P.green : P.grey, size: 11.5});
      /* curseur de temps */
      var tcur = z >= 0 ? (z / (2 * d.value)) * t : -1; if (tcur >= 0 && tcur <= 320) S.draw.line(g, ax.X(tcur), ax.T, ax.X(tcur), ax.B, "rgba(31,75,158,.5)", 1.5);
      ro.set(0, S.fmt(t, 1) + " µs"); ro.set(1, S.fmt(lam, 2) + " mm"); ro.set(2, R > 0.01 ? S.fmt(R * 100, 1) + " %" : S.fmt(R * 100, 2) + " %"); ro.set(3, S.fmt(lev, 1) + " dB");
      if (goal){ var okG = seen && levelOf(d.value, f.value + 0.5, tg.value, true) <= THR; var maxF = (10 * Math.log10(R) - THR) / d.value;
        nt.set("<b>Défi :</b> règle la fréquence la plus haute (par pas de 0,5 MHz) pour voir encore l'interface. " + (okG ? "Réussi : " + S.fmt(f.value, 1) + " MHz, et à " + S.fmt(f.value + 0.5, 1) + " MHz l'écho passerait sous le seuil." : (seen ? "Tu peux encore monter la fréquence : l'image sera plus fine." : "Trop haut : l'écho est sous le seuil. Baisse la fréquence.")), okG ? "ok" : "warn"); }
      else nt.set(!gel.value ? "Sans gel : l'air coincé entre la sonde et la peau réfléchit presque tout, l'écho est perdu dans le bruit." : !seen ? "Écho trop faible : diminue la fréquence (moins d'atténuation) ou rapproche l'interface." : tg.value === "ai" ? "Presque tout est réfléchi : l'air et les poumons empêchent de voir derrière. " : tg.value === "os" ? "L'os réfléchit fortement (~43 %) : écho net, mais on ne voit pas derrière lui." : "Interface visible. Une fréquence plus haute affine l'image mais l'écho s'affaiblit.", (!gel.value || !seen) ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c10-radiographie", ch: "c10", tag: "Imagerie",
  titre: "Radiographie : atténuation, énergie des rayons X et contraste",
  resume: "I = I₀·e^(−μ·x) : l'os absorbe plus que les tissus, surtout à basse énergie.",
  but: "Des rayons X traversent des tissus mous (équivalent eau) avec ou sans os. Règle l'énergie, l'épaisseur de tissu et l'épaisseur d'os. Compare les images (grises) et lis le contraste.",
  aRetenir: "Un faisceau de rayons X traversant une épaisseur x d'un matériau est atténué : I = I₀·e^(−μ·x). Le coefficient μ dépend du matériau (os > tissus mous > air) et de l'énergie des photons. À basse énergie (30 à 50 keV), l'os absorbe beaucoup plus que les tissus : fort contraste, mais le patient absorbe plus d'énergie. À haute énergie, le faisceau traverse mieux, au prix d'un contraste plus faible. La radiographie utilise un rayonnement ionisant : on applique le principe ALARA (dose aussi basse que raisonnablement possible).",
  piege: "Une zone claire sur un cliché est une zone qui a reçu peu de rayons X (os), pas l'inverse de ce qu'on croit : l'os « blanc » est l'os qui absorbe. Les valeurs de μ sont tirées de tables usuelles (eau et os cortical) ; le modèle ignore la diffusion et le rayonnement secondaire.",
  build: function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var en = k.select("Énergie des rayons X", [["30", "30 keV"], ["40", "40 keV"], ["50", "50 keV"], ["60", "60 keV"], ["80", "80 keV"], ["100", "100 keV"]], "60");
    var tis = k.slider("Épaisseur de tissus mous", 5, 25, 1, 15, "cm");
    var os = k.slider("Épaisseur d'os", 0, 4, 0.25, 2, "cm");
    var ro = k.readouts(["Transmission : tissus seuls", "Transmission : tissus + os", "Contraste os / tissus", "Absorbé par les tissus"]);
    var nt = k.note("", "ok");
    var tab = {"30": [0.3756, 1.331], "40": [0.2683, 0.6655], "50": [0.2269, 0.4242], "60": [0.2059, 0.3148], "80": [0.1837, 0.2229], "100": [0.1707, 0.1855]};
    var RHOB = 1.92;
    function tr(e, tcm, ocm){ var t = tab[e]; return {mu1: t[0] * 1.0, mu2: t[1] * RHOB, a: Math.exp(-t[0] * tcm), b: Math.exp(-t[0] * (tcm - ocm) - t[1] * RHOB * ocm)}; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, T = tr(en.value, tis.value, os.value);
      var x0 = 30, xb = W * 0.55, cy = 96;
      /* tube, corps, détecteur (coupe) */
      S.draw.dot(c, x0, cy, 12, P.amber); S.draw.text(c, "tube", x0, cy + 26, {size: 12});
      ctx.fillStyle = "#f2d3b8"; ctx.fillRect(x0 + 90, 30, 120, 130);
      ctx.fillStyle = "#e9e5df"; ctx.fillRect(x0 + 90, 95 - Math.min(60, os.value * 14) / 2 + 0, 120, Math.min(60, os.value * 14)); S.draw.text(c, "tissus", x0 + 150, 46, {size: 12, color: "#8a5a3a"}); S.draw.text(c, "os", x0 + 150, 95, {size: 12, color: P.ink});
      [-1, 1].forEach(function(s){ S.draw.line(c, x0 + 12, cy, x0 + 90, cy + s * 40, "rgba(244,197,66,.9)", 1.5, [4, 3]); });
      S.draw.arrow(c, x0 + 214, 60, x0 + 262, 60, P.amber, 3); S.draw.arrow(c, x0 + 214, 125, x0 + 262, 125, P.amber, 3);
      /* image du détecteur : deux plages */
      function gray(v){ var g = Math.round(255 * Math.pow(v, 0.35)); return "rgb(" + g + "," + g + "," + g + ")"; }
      var ix = W * 0.62, iw = W - ix - 16;
      ctx.fillStyle = gray(T.a); ctx.fillRect(ix, 30, iw, 62); ctx.fillStyle = gray(T.b); ctx.fillRect(ix, 98, iw, 62);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.strokeRect(ix, 30, iw, 130);
      S.draw.text(c, "image (clair = peu absorbé)", ix + iw / 2, 18, {size: 12});
      S.draw.text(c, "tissus seuls", ix + iw / 2, 61, {size: 12, color: T.a > 0.2 ? "#111" : "#fff"}); S.draw.text(c, "tissus + os", ix + iw / 2, 129, {size: 12, color: T.b > 0.2 ? "#111" : "#fff"});
      var contrast = 1 - T.b / T.a;
      /* barres de transmission */
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(30, 190, W - 60, 12); ctx.fillStyle = P.acc; ctx.fillRect(30, 190, (W - 60) * T.a, 12);
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(30, 220, W - 60, 12); ctx.fillStyle = P.red; ctx.fillRect(30, 220, (W - 60) * T.b, 12);
      S.draw.text(c, "tissus seuls : " + S.sci(T.a * 100) + " %", 30, 182, {size: 12, align: "left"}); S.draw.text(c, "tissus + os : " + S.sci(T.b * 100) + " %", 30, 212, {size: 12, align: "left"});
      ro.set(0, S.sci(T.a * 100) + " %"); ro.set(1, S.sci(T.b * 100) + " %"); ro.set(2, S.fmt(contrast * 100, 0) + " %"); ro.set(3, S.fmt((1 - T.a) * 100, 1) + " %");
      nt.set(os.value === 0 ? "Sans os, les deux plages sont identiques : pas de contraste." : (en.value === "30" || en.value === "40") ? "Basse énergie : l'os absorbe beaucoup plus que les tissus (fort contraste), mais les tissus absorbent aussi plus : dose plus élevée pour le patient." : en.value === "100" ? "Haute énergie : le faisceau traverse presque aussi bien l'os que les tissus : contraste faible." : "Énergie intermédiaire : compromis courant en radiographie.", "ok");
    });
  }
});

SFA.sim({
  id: "p6-c10-doses", ch: "c10", tag: "Niche · Doses",
  titre: "Ma dose annuelle : examens, vols et rayonnement naturel",
  resume: "Compare des doses en mSv : un vol, une radio dentaire, un scanner, le rayonnement naturel de l'année.",
  but: "Compose ton année : choisis le nombre d'examens et de vols. La barre cumule les doses et les compare à la dose naturelle moyenne et aux limites réglementaires. Lis aussi l'équivalent en jours de rayonnement naturel.",
  aRetenir: "La dose efficace se mesure en sievert (Sv), souvent en mSv. Le rayonnement naturel (radon, sol, rayons cosmiques, alimentation) représente en moyenne mondiale ≈ 2,4 mSv par an. Un examen médical a un bénéfice diagnostique : on l'utilise quand il est justifié et avec la plus faible dose raisonnable. Une radio dentaire ou un vol sont de l'ordre de quelques µSv à quelques dizaines de µSv ; un scanner de plusieurs mSv. Limites annuelles (hors médical et naturel) : 1 mSv pour le public, 20 mSv pour les travailleurs exposés.",
  piege: "Toutes les radiations ne se valent pas : on compare des doses efficaces, pas le nombre d'examens. Un scanner n'est pas « 350 radios » à proportion fixe pour tous. Et les limites réglementaires ne s'appliquent pas aux doses médicales (décidées au cas par cas par le médecin). Valeurs : ordres de grandeur moyens (varient selon l'appareil, le patient et le protocole).",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette, H = PH6;
    var items = [
      {id: "den", n: "Radios dentaires", d: 0.005, max: 10, col: "#0e7490"},
      {id: "tho", n: "Radios du thorax", d: 0.02, max: 10, col: "#1e3f8f"},
      {id: "mam", n: "Mammographies", d: 0.4, max: 2, col: "#6236c4"},
      {id: "sca", n: "Scanners du thorax", d: 7, max: 3, col: "#b42318"},
      {id: "vol", n: "Vols Bruxelles–New York (aller)", d: 0.04, max: 20, col: "#B45309"}
    ];
    var sl = {}; items.forEach(function(it){ sl[it.id] = k.slider(it.n + " (" + S.fmt(it.d, 3) + " mSv chacun)", 0, it.max, 1, it.id === "tho" ? 1 : it.id === "vol" ? 2 : 0, ""); });
    var nat = k.toggle("Ajouter le rayonnement naturel moyen (2,4 mSv/an)", true);
    var ro = k.readouts(["Dose ajoutée par ces actes", "Total de l'année", "Équivalent en jours de rayonnement naturel", "Par rapport à la limite « public » (1 mSv)"]);
    var nt = k.note("", "ok");
    var REF = [["radio dentaire", 0.005, "#0e7490"], ["radio thorax", 0.02, "#1e3f8f"], ["vol Bxl–NY", 0.04, "#B45309"], ["mammographie", 0.4, "#6236c4"], ["limite public", 1, "#c0321d"], ["naturel / an", 2.4, "#5f6b7a"], ["scanner thorax", 7, "#b42318"], ["limite travailleurs", 20, "#c0321d"]];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, Hh = c.H, add = 0, parts = [];
      H.bg(c, "#f8fafd", "#eef2f8");
      items.forEach(function(it){ var v = sl[it.id].value * it.d; add += v; if (v > 0) parts.push({v: v, col: it.col, n: it.n, c: sl[it.id].value}); });
      var base = nat.value ? 2.4 : 0, tot = add + base, mx = tot <= 3 ? 3 : tot <= 5 ? 5 : tot <= 10 ? 10 : tot <= 25 ? 25 : Math.ceil(tot / 10) * 10, x0 = 16, x1 = W - 16, by = 48;
      function X(v){ return x0 + v / mx * (x1 - x0); }
      S.draw.text(c, "Ma dose de l'année (échelle linéaire)", x0, 14, {size: 12, align: "left", color: "#2c3a4e"});
      S.draw.display(c, S.fmt(tot, 2) + " mSv", x1 - 58, 18, {w: 116, h: 32, size: 17, color: tot > 20 ? P.red : "#13233a"});
      S.draw.rrect(c, x0, by, x1 - x0, 28, 7); ctx.fillStyle = "#e3e8ef"; ctx.fill();
      ctx.save(); S.draw.rrect(c, x0, by, x1 - x0, 28, 7); ctx.clip();
      var acc = 0; if (base > 0){ ctx.fillStyle = "#9aa4b2"; ctx.fillRect(X(0), by, X(base) - X(0), 28); acc = base; }
      parts.forEach(function(p){ ctx.fillStyle = p.col; ctx.fillRect(X(acc), by, Math.max(2, X(acc + p.v) - X(acc)), 28); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(X(acc), by, 1.2, 28); acc += p.v; });
      ctx.restore();
      [[1, "1 mSv"], [20, "20 mSv"]].forEach(function(m){ if (m[0] <= mx){ S.draw.line(c, X(m[0]), by - 4, X(m[0]), by + 34, P.red, 1.6, [4, 3]); S.draw.text(c, m[1], Math.min(X(m[0]) + 3, x1 - 20), by + 44, {size: 10.5, color: P.red, align: X(m[0]) > x1 - 40 ? "right" : "left"}); } });
      S.draw.text(c, "0", x0, by + 44, {size: 10.5, color: P.grey, align: "left"}); S.draw.text(c, S.fmt(mx, 0) + " mSv", x1, by + 44, {size: 10.5, color: P.grey, align: "right"});
      /* pastilles de légende des actes choisis */
      var lx = x0, ly = by + 66;
      var chips = (base > 0 ? [{col: "#9aa4b2", n: "naturel 2,4"}] : []).concat(parts.map(function(p){ return {col: p.col, n: p.c + " × " + p.n.split(" (")[0].toLowerCase()}; }));
      chips.forEach(function(ch){ ctx.font = "700 11px Mulish, system-ui, sans-serif"; var w = ctx.measureText(ch.n).width + 22; if (lx + w > x1){ lx = x0; ly += 18; } S.draw.rrect(c, lx, ly - 7, 12, 12, 3); ctx.fillStyle = ch.col; ctx.fill(); S.draw.text(c, ch.n, lx + 17, ly, {size: 11, align: "left", color: "#2c3a4e"}); lx += w + 8; });
      /* règle logarithmique des repères */
      var ry = Hh - 58, lo = 0.002, hi = 40, lg = function(v){ return x0 + 8 + (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * (x1 - x0 - 16); };
      S.draw.text(c, "Pour comparer : repères sur une échelle logarithmique", x0, ry - 48, {size: 11.5, align: "left", color: "#2c3a4e"});
      S.draw.rrect(c, x0 + 8, ry, x1 - x0 - 16, 6, 3); ctx.fillStyle = "#d5dbe5"; ctx.fill();
      [0.01, 0.1, 1, 10].forEach(function(v){ S.draw.line(c, lg(v), ry + 6, lg(v), ry + 11, P.grey, 1.2); S.draw.text(c, S.fmt(v, v < 1 ? (v < 0.1 ? 2 : 1) : 0), lg(v), ry + 22, {size: 10, color: P.grey, weight: 600}); });
      var narrow = W < 520;
      REF.forEach(function(q, i){ if (narrow && (i === 1 || i === 3)) return; S.draw.dot(c, lg(q[1]), ry + 3, 5, q[2]); S.draw.text(c, q[0], Math.min(Math.max(lg(q[1]), 34), W - 34), ry - 10 - (i % 3) * 12, {size: 10, color: q[2], weight: 700}); });
      if (tot > 0){ var mxm = lg(Math.max(lo, Math.min(hi, tot))); ctx.beginPath(); ctx.moveTo(mxm, ry + 9); ctx.lineTo(mxm - 6, ry + 20); ctx.lineTo(mxm + 6, ry + 20); ctx.closePath(); ctx.fillStyle = P.ink; ctx.fill(); S.draw.text(c, "toi", mxm, ry + 31, {size: 10.5, color: P.ink, weight: 800}); }
      ro.set(0, S.fmt(add, 3) + " mSv"); ro.set(1, S.fmt(tot, 2) + " mSv"); ro.set(2, S.fmt(add / (2.4 / 365), 0) + " jours"); ro.set(3, S.fmt(add / 1 * 100, 0) + " %");
      nt.set(add === 0 ? "Choisis des examens ou des vols." : add > 20 ? "Au-delà de 20 mSv ajoutés : on dépasse ce que la réglementation admet pour un travailleur exposé (limite hors médical)." : "Ces doses médicales sont décidées au cas par cas : l'examen est justifié quand son bénéfice dépasse le risque.", add > 20 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c10-effet-serre", ch: "c10", tag: "Climat",
  titre: "L'effet de serre : un modèle à une couche",
  resume: "Sans atmosphère, la Terre serait à −18 °C. Une couche qui absorbe l'infrarouge la réchauffe de plus de 30 °C.",
  but: "Le Soleil apporte 340 W/m² en moyenne ; une partie est réfléchie (albédo). La surface émet de l'infrarouge, que l'atmosphère absorbe en partie (opacité ε) et réémet vers le haut et vers le bas. Règle ε et l'albédo et lis les flux et la température. En bas, une estimation du réchauffement pour une concentration de CO₂ donnée.",
  aRetenir: "À l'équilibre, ce que la Terre reçoit (S/4)·(1 − albédo) ≈ 238 W/m² est égal à ce qu'elle renvoie dans l'espace. Une atmosphère qui absorbe l'infrarouge renvoie une partie de l'énergie vers le sol : la surface doit alors être plus chaude pour évacuer la même puissance. Sans atmosphère : ≈ −18 °C ; avec l'effet de serre naturel : ≈ +15 °C. Augmenter les gaz à effet de serre (CO₂, CH₄…) renforce l'effet de serre et réchauffe le climat.",
  piege: "L'effet de serre n'est pas un « problème » en soi : sans lui, la Terre serait gelée. C'est son renforcement par l'activité humaine qui modifie le climat. Il ne faut pas le confondre avec le trou de la couche d'ozone (UV), phénomène distinct. Modèle simplifié (une seule couche, pas de convection, pas de nuages ni d'océans) : à utiliser pour comprendre, pas pour prévoir.",
  build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette, SIG = 5.670e-8, S0 = 1361;
    var preset = k.select("Atmosphère", [["", "— régler soi-même —"], ["0", "Aucune atmosphère (ε = 0)"], ["0.77", "Terre actuelle (ε ≈ 0,77)"], ["1", "Atmosphère totalement opaque à l'IR (ε = 1)"]], "", function(v){ if (v !== "") eps.set(parseFloat(v)); });
    var eps = k.slider("Opacité infrarouge de l'atmosphère ε", 0, 1, 0.01, 0.77, "");
    var alb = k.slider("Albédo (part réfléchie)", 0.1, 0.5, 0.01, 0.3, "");
    var co2 = k.slider("Concentration en CO₂ (pour l'estimation)", 280, 1120, 10, 420, "ppm");
    var ro = k.readouts(["Température de surface", "Température sans atmosphère", "Effet de serre (écart)", "Émission de la surface σT⁴", "Température de la couche"]);
    var nt = k.note("", "ok");
    var tm = 0; var lp = k.loop(function(dt){ tm += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); PH6.bg(c, "#f4f8fd", "#e8f0f8"); var ctx = c.ctx, W = c.W, H = c.H, e = eps.value, a = alb.value, inc = S0 / 4, refl = a * inc, abs = inc - refl;
      var surf = abs / (1 - e / 2), Ts = Math.pow(surf / SIG, 0.25), Te = Math.pow(abs / SIG, 0.25), Ta = Ts / Math.pow(2, 0.25);
      var olr = (1 - e / 2) * surf, down = e * surf / 2, gone = (1 - e) * surf, up = e * surf / 2;
      var ySp = 66, yAt = 150, yGr = H - 62, x0c = W < 420 ? 80 : 100, step = (W - x0c - 30) / 4, cols = [0, 1, 2, 3, 4].map(function(q){ return x0c + q * step; });
      ctx.fillStyle = "rgba(14,116,144," + (0.12 + 0.55 * e) + ")"; ctx.fillRect(0, yAt - 16, W, 32);
      S.draw.text(c, "atmosphère", 6, yAt - 6, {size: 12, align: "left"}); S.draw.text(c, S.fmt(Ta - 273.15, 0) + " °C", 6, yAt + 9, {size: 12, align: "left"});
      ctx.fillStyle = "#c9d9b6"; ctx.fillRect(0, yGr, W, 30); S.draw.text(c, "surface", 6, yGr + 8, {size: 12, align: "left"}); S.draw.text(c, S.fmt(Ts - 273.15, 1) + " °C", 6, yGr + 23, {size: 12, align: "left"});
      function fl(x, y1, y2, v, col, lines, where){ if (v < 1) return; var w = 2 + 6 * v / 400; S.draw.arrow(c, x, y1, x, y2, col, w);
        var nP = Math.max(1, Math.round(v / 80)), Ln = Math.abs(y2 - y1), sg = y2 > y1 ? 1 : -1; for (var pp = 0; pp < nP; pp++){ var ph = ((tm * 0.35 + pp / nP) % 1); S.draw.dot(c, x, y1 + sg * ph * Ln, 3.4, "#fff"); }
        var all = lines.concat([S.fmt(v, 0)]);
        all.forEach(function(t, i){ var yy = where === "top" ? 12 + i * 14 : (y1 + y2) / 2 + (i - (all.length - 1) / 2) * 14; S.draw.text(c, t, x, yy, {size: 12, align: "center", color: col, bg: where === "top" ? undefined : "rgba(255,255,255,.9)"}); }); }
      fl(cols[0], ySp, yGr - 2, abs, P.amber, ["Soleil", "absorbé"], "top");
      fl(cols[1], yGr - 2, ySp, refl, "#d99a14", ["Soleil", "réfléchi"], "top");
      fl(cols[2], yGr - 2, yAt + 18, e * surf, P.red, ["IR", "absorbé"], "mid");
      fl(cols[3], yAt + 18, yGr - 2, down, P.violet, ["retour", "au sol"], "mid");
      fl(cols[4], yAt - 18, ySp, olr, P.red, ["IR vers", "espace"], "top");
      S.draw.text(c, "flux en W/m² · dont " + S.fmt(gone, 0) + " passent sans absorption", W / 2, H - 10, {size: 12, color: P.grey});
      ro.set(0, S.fmt(Ts - 273.15, 1) + " °C (" + S.fmt(Ts, 0) + " K)"); ro.set(1, S.fmt(Te - 273.15, 1) + " °C"); ro.set(2, "+" + S.fmt(Ts - Te, 1) + " K"); ro.set(3, S.fmt(surf, 0) + " W/m²"); ro.set(4, S.fmt(Ta - 273.15, 0) + " °C");
      var dF = 5.35 * Math.log(co2.value / 280), dT = 0.8 * dF;
      nt.set("Estimation indicative (à l'équilibre, autres facteurs fixes) pour " + S.fmt(co2.value, 0) + " ppm de CO₂ : forçage ΔF = 5,35·ln(C/280) = " + S.fmt(dF, 2) + " W/m², soit un réchauffement d'équilibre d'environ 0,8 × ΔF ≈ " + S.fmt(dT, 1) + " °C. Le réchauffement observé est plus faible car les océans mettent des décennies à s'équilibrer et les aérosols refroidissent.", "ok");
    });
  }
});
