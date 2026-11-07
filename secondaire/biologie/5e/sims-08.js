/* Chapitre 8 · Appareils reproducteurs et gamétogenèse */
(function(){
/* stock d'ovocytes (nombre dans les deux ovaires), valeurs moyennes d'ordre de grandeur */
var OV = [[0, 1.0e6], [12, 3.5e5], [25, 1.2e5], [37, 2.5e4], [45, 6e3], [51, 1e3], [60, 2e2]];
function ovo(a){ return Math.pow(10, B5.interp(OV.map(function(p){ return [p[0], Math.log10(p[1])]; }), a)); }
function sper(a){ return a <= 13 ? 0 : 1e8 * 365 * (a - 13); }

SFA.sim({
  id: "b5-c08-gametes-age", ch: "c08", tag: "Ordres de grandeur",
  titre: "Ovocytes et spermatozoïdes : un stock contre une production",
  resume: "Âge → stock d'ovocytes restants, spermatozoïdes produits depuis la puberté, ovulations.",
  but: "Déplace l'âge de 0 à 60 ans. Compare le stock d'ovocytes (constitué avant la naissance et qui ne se renouvelle pas) à la production continue de spermatozoïdes. Calcule le nombre de spermatozoïdes produits en une seconde, et la part d'ovocytes réellement ovulés.",
  aRetenir: "Les ovocytes sont formés avant la naissance (≈ 1 à 2 millions) puis disparaissent peu à peu : il en reste ≈ 300 000 à la puberté et ≈ 1 000 à la ménopause. Seuls ≈ 400 à 500 sont ovulés dans une vie. Les spermatozoïdes, eux, sont produits en continu depuis la puberté : de l'ordre de 100 millions par jour (≈ 1 000 par seconde).",
  piege: "Ovule et ovocyte ne sont pas la même chose : ce qui est libéré à l'ovulation est un ovocyte II, qui ne devient un ovule qu'à la fécondation. Et les ovaires ne fabriquent pas de nouveaux ovocytes à l'âge adulte. Valeurs moyennes arrondies ; il existe de grandes variations individuelles.",
  build: function(k, S){
    var c = k.canvas(280), pal = S.draw.palette;
    var a = k.slider("Âge", 0, 60, 1, 30, "ans");
    var ro = k.readouts(["Ovocytes restants", "Ovulations cumulées (≈ 12/an)", "Spermatozoïdes produits depuis la puberté", "Part du stock de naissance ovulée"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 60, y0: 0, y1: 14, xl: "âge (ans)", yl: "log₁₀ du nombre de cellules", stepX: 10, stepY: 2});
      var po = [], ps = [], t;
      for (t = 0; t <= 60; t += 1){ po.push([t, Math.log10(ovo(t))]); if (t > 13) ps.push([t, Math.log10(sper(t))]); }
      B5.poly(c, ax, po, pal.red, 2.8); B5.poly(c, ax, ps, pal.teal, 2.8);
      B5.leg(c, [["ovocytes (stock)", pal.red], ["spermatozoïdes (cumul produit)", pal.teal]], ax.L + 8, ax.T + 34);
      S.draw.line(c, ax.X(a.value), ax.T, ax.X(a.value), ax.B, pal.ink, 1.4, [5, 4]);
      var o = ovo(a.value), s = sper(a.value), ov = a.value < 12 ? 0 : Math.min(450, 12 * (Math.min(a.value, 51) - 12));
      S.draw.dot(c, ax.X(a.value), ax.Y(Math.log10(o)), 6, pal.red); if (s > 0) S.draw.dot(c, ax.X(a.value), ax.Y(Math.log10(s)), 6, pal.teal);
      ro.set(0, S.sci(Math.round(o), 2)); ro.set(1, S.fmt(ov, 0)); ro.set(2, s > 0 ? S.sci(s, 2) : "aucun"); ro.set(3, a.value >= 12 ? S.fmt(100 * ov / OV[0][1], 3) + " % (" + S.fmt(ov, 0) + " sur " + S.sci(OV[0][1], 2) + ")" : "—");
      nt.set(a.value <= 13 ? "Avant la puberté, il n'y a pas encore de production de spermatozoïdes ; le stock d'ovocytes est déjà en place depuis la naissance." : "À " + a.value + " ans : il reste ≈ " + S.sci(Math.round(o), 2) + " ovocytes, alors que ≈ " + S.sci(s, 2) + " spermatozoïdes ont été produits en " + (a.value - 13) + " ans (≈ 10⁸ par jour).", "ok");
    });
  }
});

/* ---------- gamétogenèse ---------- */
SFA.sim({
  id: "b5-c08-gametogenese", ch: "c08", tag: "Tableau",
  titre: "Spermatogenèse ou ovogenèse : 4 gamètes contre 1",
  resume: "Nombre de cellules mères → nombre de gamètes et de globules polaires.",
  but: "Choisis le nombre de cellules qui entrent en méiose dans chaque sexe, et active ou non la fécondation. Compte les gamètes produits, les globules polaires, et vérifie le nombre de chromosomes à chaque étape (2n = 46).",
  aRetenir: "Une cellule mère donne 4 spermatozoïdes (divisions égales) mais un seul ovule : les trois autres cellules sont de petits globules polaires qui dégénèrent, ce qui réserve presque tout le cytoplasme à l'ovule. Chez la femme, la méiose est bloquée en prophase I (jusqu'à l'ovulation) puis en métaphase II (jusqu'à la fécondation).",
  piege: "Il n'y a pas « un ovule par ovocyte I et par ovocyte II » : à partir d'un ovocyte I, un seul ovule (et seulement s'il y a fécondation). L'ovocyte II est libéré à l'ovulation et la méiose II ne s'achève que si un spermatozoïde le féconde.",
  build: function(k, S){
    var c = k.canvas(372), pal = S.draw.palette;
    var n = k.slider("Cellules mères qui entrent en méiose (de chaque sexe)", 1, 10, 1, 1, "");
    var fec = k.toggle("Fécondation de l'ovocyte II", true);
    var ro = k.readouts(["Spermatozoïdes", "Ovules", "Ovocytes II non fécondés", "Globules polaires (au plus)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var W = c.W, f = fec.value;
      var cs = [["Spermatocyte I", "2n = 46", 22], ["2 spermatocytes II", "n = 23", 17], ["4 spermatides", "n = 23", 12]];
      var co = [["Ovocyte I", "2n = 46"], ["Ovocyte II + GP1", "n = 23"], [f ? "Ovule + GP2" : "Ovocyte II seul", "n = 23"]];
      var XA = 64, XS = (W - 128) / 2, i;
      S.draw.text(c, "SPERMATOGENÈSE (dès la puberté)", 10, 14, {align: "left", size: 12, color: pal.teal});
      for (i = 0; i < 3; i++){
        var x = XA + i * XS, cnt = i === 0 ? 1 : i === 1 ? 2 : 4;
        for (var j = 0; j < cnt; j++){ var y = 56 + (j - (cnt - 1) / 2) * 22; B5.circ(c, x, y, cs[i][2] * 0.5, "rgba(14,116,144,.2)", pal.teal, 1.5); }
        S.draw.text(c, cs[i][0], x, 104, {size: 12, color: pal.ink, maxW: XS - 6}); S.draw.text(c, cs[i][1], x, 150, {size: 12, color: pal.grey});
        if (i < 2) S.draw.arrow(c, x + 30, 56, x + XS - 30, 56, pal.grey, 1.5);
      }
      S.draw.text(c, "OVOGENÈSE (avant la naissance, puis ovulation et fécondation)", 10, 178, {align: "left", size: 12, color: pal.red});
      for (i = 0; i < 3; i++){
        var x2 = XA + i * XS;
        B5.circ(c, x2, 226, i === 0 ? 26 : 24, i === 2 && f ? "rgba(180,35,24,.28)" : "rgba(180,35,24,.15)", pal.red, 1.8);
        if (i >= 1) B5.circ(c, x2 + 30, 202, 6, "rgba(138,149,163,.5)", pal.grey, 1.2);
        if (i === 2 && f){ B5.circ(c, x2 + 34, 226, 6, "rgba(138,149,163,.5)", pal.grey, 1.2); B5.circ(c, x2 + 44, 206, 5, "rgba(138,149,163,.5)", pal.grey, 1.2); }
        S.draw.text(c, co[i][0], x2, 268, {size: 12, color: pal.ink, maxW: XS - 6}); S.draw.text(c, co[i][1], x2, 304, {size: 12, color: pal.grey});
        if (i < 2) S.draw.arrow(c, x2 + 36, 226, x2 + XS - 36, 226, pal.grey, 1.5);
      }
      B5.wrap(c, "Blocages : prophase I (jusqu'à l'ovulation), métaphase II (jusqu'à la fécondation). GP = globule polaire.", 10, 328, W - 20, 15, {size: 12, color: pal.grey});
      ro.set(0, String(4 * n.value)); ro.set(1, f ? String(n.value) : "0"); ro.set(2, f ? "0" : String(n.value)); ro.set(3, f ? String(3 * n.value) + " (1er GP divisé)" : String(n.value) + " (1er GP seul)");
      nt.set(f ? "Chaque ovocyte I donne 1 ovule et 3 globules polaires, et chaque spermatocyte I donne 4 spermatozoïdes : " + (4 * n.value) + " spermatozoïdes pour " + n.value + " ovule" + (n.value > 1 ? "s" : "") + "." : "Sans fécondation, la méiose II de l'ovocyte II n'est pas achevée : il n'y a pas d'ovule (ni de 2e globule polaire) ; seul le 1er globule polaire existe.", "ok");
    });
  }
});

/* ---------- puberté ---------- */
SFA.sim({
  id: "b5-c08-puberte", ch: "c08", tag: "Hormones",
  titre: "Puberté : les hormones sexuelles et les premiers signes",
  resume: "Âge de démarrage et âge observé → taux hormonal et caractères sexuels présents.",
  but: "Choisis le sexe et l'âge de démarrage de la puberté (il varie d'une personne à l'autre), puis glisse le repère d'âge sur la courbe. Suis la cascade hypothalamus → hypophyse → gonades et repère l'ordre d'apparition des caractères sexuels selon la montée de l'hormone.",
  aRetenir: "À la puberté, l'hypothalamus et l'hypophyse activent les gonades (FSH, LH) : elles sécrètent les hormones sexuelles (œstrogènes chez la fille, testostérone chez le garçon) qui provoquent les caractères sexuels secondaires. Le moment de démarrage varie de plusieurs années d'une personne à l'autre, mais l'ordre d'apparition est assez constant.",
  piege: "« Être en avance ou en retard » n'est pas anormal tant que le démarrage reste dans la fourchette habituelle (environ 8–13 ans pour les filles, 9–14 ans pour les garçons). Courbe théorique simplifiée, âges indicatifs.",
  build: function(k, S){
    var c = k.canvas(470), pal = S.draw.palette, D = S.draw;
    var sx = k.seg("Sexe", [["f", "Fille"], ["g", "Garçon"]], "f", function(v){ on.set(v === "f" ? 10.5 : 11.5); });
    var on = k.slider("Âge de démarrage de la puberté", 8, 14, 0.5, 10.5, "ans");
    var ag = k.slider("Âge observé", 6, 18, 0.5, 12, "ans");
    var ro = k.readouts(["Niveau de l'hormone", "Hormone", "Signes présents", "Prochain signe"]);
    var nt = k.note("", "");
    var F = [["développement des seins", 0.10], ["pilosité pubienne", 0.20], ["pic de croissance", 0.35], ["premières règles", 0.55]];
    var G = [["volume testiculaire ↑", 0.10], ["pilosité pubienne", 0.25], ["mue de la voix", 0.50], ["pic de croissance", 0.60], ["barbe", 0.75]];
    function lev(t){ return 1 / (1 + Math.exp(-(t - (on.value + 2.2)) / 1.0)); }
    function tAt(h){ return on.value + 2.2 + Math.log(h / (1 - h)); }
    var geo = {}, drag = false, tm = 0;
    var lp = k.loop(function(dt){ tm += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") drag = p.y > geo.gy && geo.ax; if (drag && (t === "down" || t === "drag")){ ag.set(Math.max(6, Math.min(18, Math.round(geo.ax.ix(p.x) * 2) / 2))); k.redraw(); } if (t === "up") drag = false; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, isF = sx.value === "f", L = isF ? F : G, h = lev(ag.value), col = isF ? pal.pink : pal.teal;
      /* ---------- cascade hormonale ---------- */
      D.rrect(c, 8, 8, W - 16, 124, 12); ctx.fillStyle = "#f6f4fc"; ctx.fill();
      var bx = [W * .17, W * .5, W * .83], names = ["Hypothalamus", "Hypophyse", isF ? "Ovaires" : "Testicules"], subs = ["GnRH", "FSH + LH", isF ? "œstrogènes" : "testostérone"], cols = [pal.violet, pal.acc, col];
      var bw = Math.min(104, W * .25);
      for (var i = 0; i < 3; i++){
        var lvl = i === 0 ? Math.min(1, h * 1.6 + .1) : i === 1 ? Math.min(1, h * 1.3 + .1) : h;
        D.glow(c, bx[i], 62, 52 * (0.3 + lvl), cols[i], .45 * (.3 + lvl));
        D.rrect(c, bx[i] - bw / 2, 38, bw, 46, 10); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = cols[i]; ctx.lineWidth = 2.5; ctx.stroke();
        D.text(c, names[i], bx[i], 54, {size: 11.5, color: cols[i], weight: 900}); D.text(c, subs[i], bx[i], 71, {size: 11, color: pal.ink, weight: 700});
        D.rrect(c, bx[i] - bw / 2 + 8, 92, bw - 16, 8, 4); ctx.fillStyle = "#e3e7ed"; ctx.fill(); D.rrect(c, bx[i] - bw / 2 + 8, 92, Math.max(4, (bw - 16) * lvl), 8, 4); ctx.fillStyle = cols[i]; ctx.fill();
        if (i < 2){ D.arrow(c, bx[i] + bw / 2 + 4, 61, bx[i + 1] - bw / 2 - 4, 61, cols[i], 2 + lvl * 4); var o = (tm * 1.2) % 1; B5.circ(c, bx[i] + bw / 2 + 4 + o * (bx[i + 1] - bx[i] - bw - 8), 61, 3.5, "#fff", cols[i], 1.5); }
      }
      D.text(c, "l'hypothalamus commande l'hypophyse, qui commande les gonades", W / 2, 120, {size: 10.5, color: pal.grey, weight: 700});
      /* ---------- courbe ---------- */
      var gy = 142; geo.gy = gy - 4;
      D.panel(c, 8, gy, W - 16, 214, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 6, x1: 18, y0: 0, y1: 1, xl: "âge (ans)  ·  glisse le repère", stepX: 2, stepY: 0.25, t: gy + 14, b: H - gy - 214 + 32 + 0, l: 40, r: 18});
      geo.ax = ax;
      D.text(c, "hormone sexuelle (relatif)", 16, gy + 6, {size: 11, color: pal.grey, align: "left"});
      /* fourchette habituelle de démarrage */
      var r0 = isF ? 8 : 9, r1 = isF ? 13 : 14; ctx.fillStyle = "rgba(244,197,66,.18)"; ctx.fillRect(ax.X(r0), ax.T, ax.X(r1) - ax.X(r0), ax.B - ax.T); D.text(c, "démarrage habituel", ax.X((r0 + r1) / 2), ax.T + 10, {size: 10.5, color: pal.amber, weight: 800});
      var pts = []; for (var t = 6; t <= 18; t += 0.1) pts.push([t, lev(t)]);
      D.area(c, ax, lev, 6, ag.value, col, .16);
      B5.poly(c, ax, pts, col, 3);
      L.forEach(function(e, q){ var ta = tAt(e[1]), done = h >= e[1]; D.dot(c, ax.X(ta), ax.Y(e[1]), done ? 6 : 4.5, done ? pal.green : "#c9ced6"); });
      D.line(c, ax.X(ag.value), ax.T, ax.X(ag.value), ax.B, pal.ink, 1.4, [5, 4]);
      D.glow(c, ax.X(ag.value), ax.Y(h), 20, col, .6); D.dot(c, ax.X(ag.value), ax.Y(h), 8, pal.ink); D.label(c, S.fmt(ag.value, 1) + " ans", ax.X(ag.value), ax.B - 12, {color: pal.ink, size: 11});
      /* ---------- signes ---------- */
      var have = L.filter(function(e){ return h >= e[1]; }), nxt = L.filter(function(e){ return h < e[1]; })[0];
      var cy = gy + 228; D.text(c, "Caractères sexuels apparus", 16, cy, {size: 11.5, color: pal.ink, weight: 800, align: "left"});
      var xx = 16, yy = cy + 20;
      L.forEach(function(e){
        var done = h >= e[1], wch = e[0].length * 6.4 + 22; if (xx + wch > W - 12){ xx = 16; yy += 28; }
        D.rrect(c, xx, yy - 11, wch, 23, 11.5); ctx.fillStyle = done ? "rgba(36,119,90,.15)" : "#eef1f5"; ctx.fill(); ctx.strokeStyle = done ? pal.green : "#d0d6de"; ctx.lineWidth = 1.5; ctx.stroke();
        D.text(c, (done ? "✓ " : "") + e[0], xx + wch / 2, yy, {size: 11, color: done ? pal.green : pal.grey, weight: 800}); xx += wch + 6;
      });
      ro.set(0, S.fmt(h * 100, 0) + " %"); ro.set(1, isF ? "œstradiol" : "testostérone"); ro.set(2, String(have.length) + " / " + L.length); ro.set(3, nxt ? S.fmt(tAt(nxt[1]), 1) + " ans" : "tous présents");
      var lines = have.length ? "Présents : " + have.map(function(e){ return e[0]; }).join(", ") + "." : "Aucun signe pubertaire visible pour l'instant.";
      nt.set(lines + (nxt ? " Prochain : " + nxt[0] + " vers " + S.fmt(tAt(nxt[1]), 1) + " ans (points de la courbe)." : ""), "ok");
    });
  }
});

/* ---------- course de spermatozoïdes ---------- */
SFA.sim({
  id: "b5-c08-course", ch: "c08", tag: "Animation",
  titre: "Course de spermatozoïdes : combien arrivent à l'ovocyte ?",
  resume: "Concentration, mobilité, morphologie, pH → nombre de spermatozoïdes qui arrivent et course animée.",
  but: "Règle les paramètres du spermogramme et le pH rencontré. Lance la course : 80 spermatozoïdes (échantillon illustratif) remontent les voies génitales de la femme ; les gris sont détruits. Lis ensuite la perte à chaque étape dans l'entonnoir.",
  aRetenir: "Sur des centaines de millions de spermatozoïdes éjaculés, seuls quelques centaines arrivent près de l'ovocyte. Les spermatozoïdes sont détruits par l'acidité du vagin (pH ≈ 4) ; la glaire cervicale, plus alcaline en période d'ovulation, les laisse passer ; seuls les mobiles et bien formés progressent. Un spermogramme évalue concentration, mobilité et morphologie (valeurs de référence OMS : ≥ 16 millions/mL, mobilité progressive ≥ 30 %, formes normales ≥ 4 %).",
  piege: "Une valeur sous la référence n'est pas un diagnostic : l'infertilité a des causes multiples (masculines, féminines, ou les deux) et un seul spermogramme ne suffit pas. Modèle pédagogique : les coefficients de perte sont arbitraires, seules les tendances sont réalistes.",
  build: function(k, S){
    var c = k.canvas(560), pal = S.draw.palette, D = S.draw;
    var conc = k.slider("Concentration", 2, 100, 2, 60, "millions/mL");
    var mob = k.slider("Spermatozoïdes mobiles progressifs", 5, 80, 5, 40, "%");
    var morph = k.slider("Formes normales", 2, 30, 1, 15, "%");
    var ph = k.slider("pH du milieu (vagin ≈ 4, glaire ≈ 7)", 4, 8, 0.5, 7, "");
    var ro = k.readouts(["Éjaculat (3 mL)", "Survivants à l'acidité", "Passent la glaire", "Arrivent à l'ampoule"]);
    var nt = k.note("", "");
    function calc(){
      var tot = conc.value * 3e6, fS = Math.min(0.6, Math.max(0.02, 0.02 + 0.5 * (ph.value - 4) / 3.5)), s1 = tot * fS, s2 = s1 * (mob.value / 100) * 0.5, s3 = s2 * 2e-5 * Math.min(1.5, morph.value / 15);
      return {tot: tot, fS: fS, s1: s1, s2: s2, s3: s3};
    }
    var dots = [], tt = 0, started = false;
    function init(){
      var r = B5.rng(Math.floor(Math.random() * 1e6) + 1); dots = [];
      for (var i = 0; i < 80; i++){ var mobile = r() < mob.value / 100 * 1.2, normal = r() < Math.min(1, morph.value / 15); dots.push({x: 0.01, y: 0.1 + 0.8 * r(), v: mobile ? (normal ? 0.09 + 0.05 * r() : 0.04 + 0.03 * r()) : 0.004, alive: true, done: false, ph: r() * 6.3}); }
      tt = 0; started = true;
    }
    var lp = k.loop(function(dt){
      tt += dt; var m = calc(), die = (1 - m.fS) * 0.35;
      dots.forEach(function(d){
        if (!d.alive || d.done) return;
        d.x += d.v * dt; d.y += (Math.random() - 0.5) * 0.08 * dt * 10; d.y = Math.max(0.05, Math.min(0.95, d.y));
        if (d.x < 0.5 && Math.random() < die * dt) d.alive = false;
        if (d.x >= 0.97){ d.done = true; }
      });
      if (tt > 16 || dots.every(function(d){ return !d.alive || d.done; })){ lp.pause(); }
      k.redraw();
    });
    k.button("Lancer la course", function(){ init(); lp.play(); }, true);
    k.draw(function(){
      c.clear(); var m = calc(), W = c.W, ctx = c.ctx, sh = 340, sw = W - 16;
      D.rrect(c, 8, 8, sw, sh, 12); ctx.fillStyle = "#fdf4f2"; ctx.fill();
      function X(u){ return 8 + u * sw; } function Y(v){ return 8 + v * sh; }
      /* voies génitales */
      ctx.save(); D.rrect(c, 8, 8, sw, sh, 12); ctx.clip();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      /* trompes */
      [[.5, 1], [.5, -1]].forEach(function(t){
        var sg = t[1], xs = .5 + sg * .15;
        ctx.beginPath(); ctx.moveTo(X(.5 + sg * .13), Y(.40)); ctx.bezierCurveTo(X(.5 + sg * .28), Y(.38), X(.5 + sg * .34), Y(.30), X(.5 + sg * .36), Y(.22));
        ctx.strokeStyle = "#e8a99e"; ctx.lineWidth = 15; ctx.stroke(); ctx.strokeStyle = "#fbe4df"; ctx.lineWidth = 9; ctx.stroke();
        B5.circ(c, X(.5 + sg * .43), Y(.30), 15, "#f7d9a8", "#c9954a", 2);   /* ovaire */
      });
      /* utérus */
      ctx.beginPath(); ctx.moveTo(X(.35), Y(.34)); ctx.bezierCurveTo(X(.34), Y(.5), X(.44), Y(.58), X(.46), Y(.68)); ctx.lineTo(X(.54), Y(.68)); ctx.bezierCurveTo(X(.56), Y(.58), X(.66), Y(.5), X(.65), Y(.34)); ctx.bezierCurveTo(X(.58), Y(.3), X(.42), Y(.3), X(.35), Y(.34)); ctx.closePath();
      ctx.fillStyle = "#fbe4df"; ctx.fill(); ctx.strokeStyle = "#e8a99e"; ctx.lineWidth = 4; ctx.stroke();
      /* col + glaire */
      ctx.fillStyle = "#e7dcfa"; ctx.fillRect(X(.46), Y(.64), X(.08) - X(0), Y(.16) - Y(0)); ctx.strokeStyle = "#8d77cf"; ctx.lineWidth = 3; ctx.strokeRect(X(.46), Y(.64), X(.08) - X(0), Y(.16) - Y(0));
      /* vagin */
      ctx.fillStyle = "#faecc9"; ctx.fillRect(X(.44), Y(.80), X(.12) - X(0), sh); ctx.strokeStyle = "#d9a441"; ctx.strokeRect(X(.44), Y(.80), X(.12) - X(0), sh);
      ctx.restore();
      /* trajet des spermatozoïdes : segments [x, y] */
      var PATH = [[.5, .98], [.5, .74], [.5, .56], [.57, .44], [.70, .36], [.84, .27], [.86, .23]], L = [0], j;
      for (j = 1; j < PATH.length; j++) L.push(L[j - 1] + Math.hypot(PATH[j][0] - PATH[j - 1][0], PATH[j][1] - PATH[j - 1][1]) * (j === 1 || j === 2 ? 1 : 1));
      var TL = L[L.length - 1];
      function at(s){ var d = Math.min(1, Math.max(0, s)) * TL, q = 1; while (q < L.length - 1 && L[q] < d) q++; var f = (d - L[q - 1]) / (L[q] - L[q - 1] || 1), a = PATH[q - 1], b = PATH[q], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return {x: X(a[0] + dx * f), y: Y(a[1] + dy * f), nx: -dy / l, ny: dx / l, tx: dx / l, ty: dy / l}; }
      /* ovocyte */
      var oc = at(1); D.glow(c, oc.x + 10, oc.y - 6, 40, pal.red, .35); B5.circ(c, oc.x + 10, oc.y - 6, 14, "#fff1ef", pal.red, 2.5); B5.circ(c, oc.x + 10, oc.y - 6, 4, "#f2b8ad");
      D.text(c, "ovocyte", oc.x + 10, oc.y - 28, {size: 11, color: pal.red, weight: 800});
      D.label(c, "vagin (acide, pH ≈ 4)", X(.58), Y(.92), {size: 10.5, color: pal.amber, align: "left"});
      D.label(c, "glaire cervicale", X(.58), Y(.71), {size: 10.5, color: pal.violet, align: "left"});
      D.label(c, "utérus", X(.38), Y(.45), {size: 10.5, color: "#a5463a", align: "right"});
      D.label(c, "trompe de Fallope (ampoule)", X(.99), Y(.07), {size: 10.5, color: "#a5463a", align: "right"});
      /* spermatozoïdes */
      var arr = 0, mortt = 0;
      dots.forEach(function(d){
        if (d.done) arr++; if (!d.alive) mortt++;
        var p = at(d.x), off = (d.y - 0.5) * (d.x < .3 ? 56 : d.x < .5 ? 16 : 22);
        var px = p.x + p.nx * off, py = p.y + p.ny * off, ang = Math.atan2(-p.ty, -p.tx);
        var col = d.alive ? (d.done ? pal.green : pal.violet) : "#b9c0cc";
        ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.beginPath();
        for (var q = 0; q <= 6; q++){ var u = q / 6 * 11, w = d.alive && !d.done ? Math.sin(tt * 18 + d.ph - q) * 1.8 : 0; ctx.lineTo(px - p.tx * u + p.nx * w, py - p.ty * u + p.ny * w); }
        ctx.stroke(); B5.circ(c, px, py, 2.8, col);
      });
      if (started) D.display(c, arr + " / 80", 62, sh - 26, {w: 96, h: 44, caption: "arrivés (échantillon)", size: 16});
      if (started) D.label(c, mortt + " détruits", 62, sh - 62, {color: pal.grey, size: 10.5});
      /* entonnoir logarithmique */
      var gy = sh + 22, hh0 = c.H - gy - 8; D.panel(c, 8, gy - 4, sw, hh0 + 4, {shadow: false, fill: "#fbfcfe"});
      var vals = [m.tot, m.s1, m.s2, m.s3], nm = ["éjaculat", "acidité", "glaire", "ampoule"], i, bw = (sw - 16) / 4;
      D.text(c, "Spermatozoïdes restants (échelle log)", 18, gy + 10, {align: "left", size: 11.5, color: pal.grey});
      for (i = 0; i < 4; i++){
        var fr = Math.log10(Math.max(1, vals[i])) / 9, hh = Math.max(3, (hh0 - 70) * fr), bx = 16 + i * bw + 12;
        var gr = ctx.createLinearGradient(0, gy + hh0 - 30 - hh, 0, gy + hh0 - 30); gr.addColorStop(0, i === 3 ? "#3fa77c" : "#8a68e0"); gr.addColorStop(1, i === 3 ? "#24775a" : "#6236c4");
        D.rrect(c, bx, gy + hh0 - 30 - hh, bw - 24, hh, 4); ctx.fillStyle = gr; ctx.fill();
        D.text(c, B5.sci(vals[i], 1), bx + (bw - 24) / 2, gy + hh0 - 30 - hh - 10, {size: 11.5, color: pal.ink, weight: 800});
        D.text(c, nm[i], bx + (bw - 24) / 2, gy + hh0 - 14, {size: 11.5, color: pal.ink});
      }
      ro.set(0, S.sci(m.tot, 2)); ro.set(1, S.sci(m.s1, 2)); ro.set(2, S.sci(m.s2, 2)); ro.set(3, S.fmt(m.s3, 0));
      var low = []; if (conc.value < 16) low.push("concentration"); if (mob.value < 30) low.push("mobilité"); if (morph.value < 4) low.push("morphologie");
      nt.set(low.length ? "Sous les valeurs de référence : " + low.join(", ") + ". Ce n'est qu'un indice, à interpréter par un médecin avec d'autres examens." : "Paramètres dans les valeurs de référence : ≈ " + S.fmt(m.s3, 0) + " spermatozoïdes atteignent l'ampoule (modèle illustratif).", low.length ? "warn" : "ok");
    });
  }
});
})();
