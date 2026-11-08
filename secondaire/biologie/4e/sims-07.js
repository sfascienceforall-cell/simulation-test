/* Biologie 4e · chapitre 7 · ATP et bilan énergétique de la cellule */
SFA.sim({
  id:"b4-c07-cycle", ch:"c07", tag:"Cycle animé · modèle",
  titre:"Le cycle ATP–ADP : une monnaie qui tourne",
  resume:"Les molécules d'ATP se coupent au travail puis se reforment à la respiration. Bloque la production et regarde le stock fondre.",
  but:"Règle la dépense énergétique journalière et la voie de production d'ATP. Lance la simulation (1 s = 10 s) : le cycle tourne, le stock se vide ou se maintient.",
  aRetenir:"ATP + H₂O ⇄ ADP + Pi : en se coupant, l'ATP libère l'énergie utilisable par la cellule ; la respiration (ou la fermentation) la régénère. Le stock d'ATP est minuscule (≈ 0,1 mol, ≈ 50 g) mais renouvelé sans cesse : on en recycle l'équivalent de plusieurs dizaines de kg par jour. Une cellule ne peut pas vivre de ce stock plus de quelques minutes.",
  piege:"L'ATP n'est pas une pile ni une réserve à long terme : les réserves sont le glycogène et les lipides. Modèle simplifié : 40 % de l'énergie alimentaire passe par l'ATP, ≈ 50 kJ libérés par mole d'ATP hydrolysée dans la cellule.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.12});
    var E = k.slider("Énergie dépensée par jour", 6000, 16000, 500, 10000, "kJ");
    var src = k.seg("Production d'ATP", [["r","Respiration"],["f","Fermentation seule"],["0","Bloquée (cyanure)"]], "r");
    var ro = k.readouts(["ATP régénéré par jour", "Masse d'ATP par jour", "Recyclages du stock/jour", "Stock tenu sans production"]);
    var nt = k.note("", "");
    var st = {t:0, f:0.9, h:[[0, 90]], acc:0, pa:0, pd:0, flash:0};
    function C(){ return E.value * 0.4 / 50 / 86400; }      /* mol/s */
    function Sy(){ return C() * (src.value === "r" ? 1 : src.value === "f" ? 2 / 30 : 0); }
    var lp = k.loop(function(dt){
      var h = dt * 10, v = 0.5 * E.value / 10000;
      st.f = Math.max(0, Math.min(1, st.f + (Sy() - C()) / 0.1 * h)); st.t += h; st.acc += h;
      st.pa += dt * v; st.pd += dt * v * (Sy() / C()); st.flash = Math.max(0, st.flash - dt * 3); if (Math.floor(st.pa * 4) !== Math.floor((st.pa - dt * v) * 4)) st.flash = 1;
      if (st.acc >= 5){ st.acc = 0; st.h.push([st.t, st.f * 100]); }
      if (st.t >= 300) lp.pause(); k.redraw();
    });
    lp.play();
    k.button("↺ Recommencer", function(){ st.t = 0; st.f = 0.9; st.h = [[0, 90]]; st.pa = st.pd = 0; lp.play(); }, true);
    function mol(x, y, ang, atp){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.fillStyle = "#7d90b8"; ctx.beginPath(); ctx.arc(-8, 0, 5, 0, 6.2832); ctx.fill();
      for (var i = 0; i < (atp ? 3 : 2); i++){ ctx.beginPath(); ctx.arc(-1 + i * 7, 0, 3.4, 0, 6.2832); ctx.fillStyle = atp ? P.amber : "#d98e8a"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cons = C(), sy = Sy();
      var R = Math.min(W * 0.27, H * 0.2), cx = W / 2, cy = H * 0.27;
      var bg = ctx.createLinearGradient(0, 0, 0, H * 0.55); bg.addColorStop(0, "#fffaf0"); bg.addColorStop(1, "#fbf3e2"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H * 0.55);
      /* piste du cycle */
      ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = "rgba(194,106,12,.13)"; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI, 0); ctx.stroke(); ctx.strokeStyle = "rgba(192,50,29,.11)"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI); ctx.stroke(); ctx.restore();
      S.draw.text(c, "ATP", cx, cy - R + 24, {size:13, color:P.amber, weight:800}); S.draw.text(c, "ADP + Pi", cx, cy + R - 24, {size:13, color:P.red, weight:800});
      var nA = Math.max(0, Math.round(st.f * 18)), nD = Math.max(0, 18 - nA), i, u, a;
      for (i = 0; i < nA; i++){ u = ((i + st.pa) / nA) % 1; a = Math.PI + u * Math.PI; mol(cx + R * Math.cos(a), cy + R * Math.sin(a), a + Math.PI / 2, true); }
      for (i = 0; i < nD; i++){ u = ((i + st.pd) / nD) % 1; a = u * Math.PI; var mx = cx + R * Math.cos(a), my = cy + R * Math.sin(a); mol(mx, my, a + Math.PI / 2, false); S.draw.dot(c, mx + 12 * Math.cos(a + 1.2), my + 12 * Math.sin(a + 1.2), 3, P.red); }
      /* stations */
      var bw = Math.min(78, W * 0.22), bx2 = cx + R + 14;
      S.draw.rrect(c, bx2, cy - 26, bw, 52, 10); ctx.fillStyle = "#fde8e3"; ctx.fill(); ctx.strokeStyle = P.red; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, "Travail", bx2 + bw / 2, cy - 11, {size:11, color:P.red}); S.draw.text(c, "muscle, pompes,", bx2 + bw / 2, cy + 3, {size:8.5, color:"#5f6b7a"}); S.draw.text(c, "synthèses", bx2 + bw / 2, cy + 14, {size:8.5, color:"#5f6b7a"});
      if (st.flash > 0){ S.draw.glow(c, cx + R, cy, 30, P.yellow, 0.8 * st.flash); S.draw.arrow(c, cx + R + 4, cy, bx2 - 2, cy, P.red, 3 + 2 * st.flash); }
      var ok = Sy() > 0, bx1 = cx - R - 14 - bw;
      S.draw.rrect(c, bx1, cy - 26, bw, 52, 10); ctx.fillStyle = ok ? "#dcf3e6" : "#e8ebf0"; ctx.fill(); ctx.strokeStyle = ok ? P.green : P.grey; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, src.value === "r" ? "Respiration" : src.value === "f" ? "Fermentation" : "Bloquée ✖", bx1 + bw / 2, cy - 11, {size:11, color:ok ? P.green : P.red}); S.draw.text(c, src.value === "r" ? "≈ 30 ATP" : src.value === "f" ? "2 ATP" : "0 ATP", bx1 + bw / 2, cy + 6, {size:8.5, color:"#5f6b7a"});
      if (ok){ S.draw.arrow(c, bx1 + bw + 2, cy, cx - R - 4, cy, P.green, 1.5 + 2.5 * sy / cons); }
      S.draw.arrow(c, cx - 8, cy - R * 0.55, cx + 8, cy - R * 0.55, P.amber, 2);
      /* jauge du stock */
      var gy = cy + R + 26; S.draw.rrect(c, 14, gy, W - 28, 12, 6); ctx.fillStyle = "#e9edf3"; ctx.fill(); S.draw.rrect(c, 14, gy, Math.max(6, (W - 28) * st.f), 12, 6); ctx.fillStyle = st.f > 0.5 ? P.green : st.f > 0.2 ? P.amber : P.red; ctx.fill();
      S.draw.text(c, "stock d'ATP : " + S.fmt(st.f * 100, 0) + " % de (ATP + ADP)", W / 2, gy - 9, {size:11, color:P.ink});
      var ax = S.draw.axes(c, {x0:0, x1:300, y0:0, y1:100, xl:"t (s)", yl:"ATP / (ATP + ADP) en %", stepX:60, stepY:25, t:H * 0.6, b:30, l:44});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = P.green; ctx.lineWidth = 2.8; ctx.beginPath(); st.h.forEach(function(p, q){ var x = ax.X(p[0]), y = ax.Y(p[1]); if (q === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore();
      var day = E.value * 0.4 / 50;
      ro.set(0, S.fmt(day, 0) + " mol"); ro.set(1, S.fmt(day * 507 / 1000, 0) + " kg"); ro.set(2, "≈ " + S.fmt(day / 0.1, 0)); ro.set(3, S.fmt(0.09 / cons, 0) + " s");
      nt.set(src.value === "r" ? "Production = consommation : le stock reste stable (≈ 90 % d'ATP), mais chaque molécule d'ATP est recyclée environ " + S.fmt(day / 0.1, 0) + " fois par jour." : src.value === "f" ? "La fermentation ne régénère que 2 ATP par glucose (≈ 7 % du besoin) : le stock s'épuise presque aussi vite que s'il n'y avait aucune production." : "Production bloquée : le stock d'ATP (≈ 0,09 mol) est épuisé en ≈ " + S.fmt(0.09 / cons, 0) + " s : la cellule n'a plus d'énergie utilisable.", src.value === "r" ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c07-mb", ch:"c07", tag:"Calcul · besoins",
  titre:"Métabolisme de base et besoins énergétiques",
  resume:"Une personne dessinée à ta taille : ses organes consomment l'énergie du métabolisme de base, l'activité fait grimper la dépense. Glisse le point sur la courbe pour changer la masse.",
  but:"Règle sexe, taille, âge ; glisse le point sur la courbe (ou le curseur) pour la masse ; touche une activité sous le personnage. Les organes s'allument selon leur part du MB, la chaleur rayonne selon la dépense. Défi : trouve un profil qui dépense exactement ce qui est demandé.",
  aRetenir:"Le métabolisme de base (MB) est l'énergie dépensée au repos complet, à jeun, pour maintenir les fonctions vitales : foie, cerveau, muscles, cœur et reins en consomment l'essentiel. Il dépend de la masse, de la taille, de l'âge et du sexe. Besoins totaux = MB × niveau d'activité physique. 1 kcal = 4,184 kJ.",
  piege:"Le MB n'est pas la dépense totale : l'activité physique l'augmente de 20 % à 90 %. Formule de Mifflin–St Jeor : valeur moyenne approximative, pas une mesure individuelle ; parts des organes : ordres de grandeur pour un adulte.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.25}); B4.adapt(c, 1.32, 0.9, 480);
    var sx = k.seg("Sexe", [["m","Garçon / homme"],["f","Fille / femme"]], "m");
    var m = k.slider("Masse", 30, 120, 1, 60, "kg");
    var h = k.slider("Taille", 130, 200, 1, 170, "cm");
    var a = k.slider("Âge", 12, 80, 1, 16, "ans");
    var ACT = [["1.2","Sédentaire (×1,2)"],["1.375","Peu active (×1,375)"],["1.55","Modérée (×1,55)"],["1.725","Active (×1,725)"],["1.9","Très active (×1,9)"]];
    var act = k.select("Activité", ACT, "1.375");
    var ro = k.readouts(["Métabolisme de base", "Besoins totaux", "ATP régénéré par jour", "Part du MB"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var ORG = [["Foie", 0.21, "#9c5a2e"], ["Cerveau", 0.20, "#d9709a"], ["Muscles", 0.22, "#c0321d"], ["Cœur", 0.09, "#e0475a"], ["Reins", 0.08, "#8a4bb0"], ["Autres", 0.20, "#8a95a3"]];
    var st = {t:0, drag:false, geo:{}, defi:null, score:0, tot:0, sel:-1};
    function mb(sex, mm, hh, aa){ return 10 * mm + 6.25 * hh - 5 * aa + (sex === "m" ? 5 : -161); }
    k.button("Défi : vise une dépense", function(){ st.defi = {T:50 * Math.round((1700 + Math.random() * 1600) / 50), done:false}; st.tot++; }, true);
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); }); lp.play();
    c.pointer(function(type, p){
      var g = st.geo;
      if (type === "down"){
        st.drag = false;
        if (g.icons){ g.icons.forEach(function(ic, i){ if (Math.abs(p.x - ic[0]) < ic[2] / 2 && Math.abs(p.y - ic[1]) < 16) act.set(ACT[i][0]); }); }
        if (g.org){ g.org.forEach(function(o, i){ if (p.x >= o[0] && p.x <= o[0] + o[2] && Math.abs(p.y - o[1]) < o[3] / 2) st.sel = st.sel === i ? -1 : i; }); }
        if (g.ax && p.y >= g.ax.T - 6 && p.y <= g.ax.B + 6 && p.x >= g.ax.L - 6) st.drag = true;
      }
      if ((type === "down" || type === "drag") && st.drag){ m.set(Math.round(Math.max(30, Math.min(120, g.ax.ix(p.x))))); }
      if (type === "up") st.drag = false;
      k.redraw();
    });
    c.cv.style.touchAction = "pan-y";
    function person(cx, foot, H0, wf, lvl){
      var ctx = c.ctx, t = st.t, fr = [0, 1, 1.6, 2.4, 3.2][lvl], amp = [0, 0.12, 0.3, 0.5, 0.7][lvl], ph = Math.sin(t * fr * 6.2832) * amp, bob = lvl >= 3 ? Math.abs(Math.sin(t * fr * 6.2832)) * H0 * 0.015 : 0;
      var top = foot - H0 - bob, hr = H0 * 0.065, sw = H0 * 0.26 * wf, hipY = top + H0 * 0.53, shY = top + H0 * 0.19, skin = "#f0c3a6", cloth = sx.value === "m" ? "#5b7fb8" : "#b4609a";
      ctx.save(); ctx.lineCap = "round";
      function limb(x, y, len, ang, w, col){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ang) * len, y + Math.cos(ang) * len); ctx.stroke(); }
      limb(cx - sw * 0.22, hipY, H0 * 0.47 - bob, ph, H0 * 0.075 * Math.sqrt(wf), "#34445e");
      limb(cx + sw * 0.22, hipY, H0 * 0.47 - bob, -ph, H0 * 0.075 * Math.sqrt(wf), "#3d4f6b");
      limb(cx - sw * 0.52, shY + 4, H0 * 0.34, -ph * 0.8 + 0.08, H0 * 0.05 * Math.sqrt(wf), skin);
      limb(cx + sw * 0.52, shY + 4, H0 * 0.34, ph * 0.8 - 0.08, H0 * 0.05 * Math.sqrt(wf), skin);
      S.draw.rrect(c, cx - sw / 2, shY, sw, hipY - shY + H0 * 0.04, sw * 0.28); ctx.fillStyle = cloth; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, top + hr + 2, hr, 0, 6.2832); ctx.fillStyle = skin; ctx.fill();
      ctx.fillStyle = "#4a3426"; ctx.beginPath(); ctx.arc(cx, top + hr + 2, hr, 3.3, 6.1); ctx.fill();
      ctx.restore();
      /* organes */
      var beat = 1 + 0.12 * Math.max(0, Math.sin(t * (1.1 + lvl * 0.35) * 6.2832));
      var O = [[cx - sw * 0.12, top + H0 * 0.37, sw * 0.28, H0 * 0.04], [cx, top + hr + 1, hr * 0.62, hr * 0.48], [cx - sw * 0.22, hipY + H0 * 0.14, H0 * 0.04, H0 * 0.09], [cx + sw * 0.12, top + H0 * 0.28, H0 * 0.028 * beat, H0 * 0.03 * beat], [cx, top + H0 * 0.44, sw * 0.3, H0 * 0.02], [cx + sw * 0.2, top + H0 * 0.47, sw * 0.12, H0 * 0.02]];
      O.forEach(function(o, i){ if (i === 5) return; var on = st.sel === -1 || st.sel === i, col = ORG[i][2];
        S.draw.glow(c, o[0], o[1], Math.max(o[2], o[3]) * 2.4, col, on ? 0.25 + ORG[i][1] * 1.5 * (0.6 + 0.4 * Math.sin(t * 3 + i)) : 0.05);
        if (i === 4){ B4.ell(c, o[0] - o[2] * 0.6, o[1], o[2] * 0.3, o[3], on ? col : "rgba(138,75,176,.3)"); B4.ell(c, o[0] + o[2] * 0.6, o[1], o[2] * 0.3, o[3], on ? col : "rgba(138,75,176,.3)"); }
        else B4.ell(c, o[0], o[1], o[2], o[3], on ? col : S.draw.tint(col, 0.3), "rgba(255,255,255,.7)", 1); });
      return {top:top, sw:sw};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, fs = wide ? 10.5 : 9.5, sh = H * 0.56;
      var B = mb(sx.value, m.value, h.value, a.value), fa = parseFloat(act.value), tot = B * fa, lvl = ACT.map(function(x){ return x[0]; }).indexOf(act.value);
      var hm = h.value / 100, bmi = m.value / (hm * hm), wf = Math.sqrt(bmi / 21);
      /* chaleur */
      var pw = W * (wide ? 0.42 : 0.44), pcx = pw / 2 + 6, foot = sh - 44, H0 = (foot - 22) * h.value / 200;
      for (var q = 0; q < 3 + lvl; q++){ var ph = (st.t * 0.5 + q / (3 + lvl)) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * 0.4; ctx.strokeStyle = "#e07a1f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(pcx, foot - H0 * 0.55, H0 * 0.2 * wf + ph * pw * 0.32, H0 * 0.55 + ph * 30, 0, 0, 6.2832); ctx.stroke(); ctx.restore(); }
      S.draw.line(c, 8, foot + 1, pw, foot + 1, "#cbd5e1", 2);
      /* toise */
      var tx = 12; S.draw.line(c, tx, foot, tx, foot - (foot - 22), "#cbd5e1", 1.5); for (var cm = 0; cm <= 200; cm += 50){ var yy = foot - (foot - 22) * cm / 200; S.draw.line(c, tx, yy, tx + 6, yy, "#8a95a3", 1.5); S.draw.text(c, cm + "", tx + 9, yy, {size:8.5, color:"#8a95a3", align:"left"}); }
      person(pcx, foot, H0, wf, lvl);
      S.draw.label(c, S.fmt(h.value, 0) + " cm · " + S.fmt(m.value, 0) + " kg · IMC " + S.fmt(bmi, 1), pcx, 12, {color:P.ink, size:fs});
      /* icônes d'activité */
      var icons = [], iw = (W - 20) / 5;
      ["assis", "peu", "marche", "jogging", "course"].forEach(function(t2, i){ var x = 10 + iw * i + iw / 2, y = sh - 20, on = i === lvl;
        S.draw.rrect(c, x - iw / 2 + 2, y - 14, iw - 4, 28, 8); ctx.fillStyle = on ? "#1f4b9e" : "#eef1f5"; ctx.fill();
        S.draw.text(c, t2, x, y - 4, {size:wide ? 9.5 : 8.5, color:on ? "#fff" : "#2c3a4e"}); S.draw.text(c, "×" + ACT[i][0].replace(".", ","), x, y + 7, {size:wide ? 9 : 8, color:on ? "#dbe6ff" : "#5f6b7a", weight:600}); icons.push([x, y, iw]); });
      st.geo.icons = icons;
      /* répartition du MB par organe */
      var ox = pw + 14, ow = W - ox - 10, oy = 22, rh = Math.min(30, (foot - oy - 52) / 6);
      S.draw.text(c, "Où part le MB (" + S.fmt(B, 0) + " kcal/j) ?", ox, 10, {size:fs, color:P.ink, align:"left"});
      var lw2 = wide ? 66 : 54, bw = ow - lw2 - (wide ? 70 : 54); st.geo.org = [];
      ORG.forEach(function(o, i){ var y = oy + 8 + i * rh + rh / 2, on = st.sel === -1 || st.sel === i;
        S.draw.text(c, o[0], ox + lw2 - 6, y, {size:fs, color:on ? "#2c3a4e" : "#a3adba", align:"right"});
        S.draw.rrect(c, ox + lw2, y - rh * 0.3, bw, rh * 0.6, 4); ctx.fillStyle = "#eef1f5"; ctx.fill();
        S.draw.rrect(c, ox + lw2, y - rh * 0.3, Math.max(4, bw * o[1] / 0.25), rh * 0.6, 4); ctx.fillStyle = on ? o[2] : S.draw.tint(o[2], 0.3); ctx.fill();
        S.draw.text(c, S.fmt(B * o[1], 0) + " kcal", ox + lw2 + bw + 6, y, {size:fs - 0.5, color:"#2c3a4e", align:"left", weight:700});
        st.geo.org.push([ox, y, ow, rh]); });
      /* barre MB + activité */
      var yb = oy + 8 + 6 * rh + 14, bwT = ow, sc = bwT / 4000;
      S.draw.text(c, "Besoins du jour : " + S.fmt(tot, 0) + " kcal", ox, yb, {size:fs, color:P.ink, align:"left"});
      S.draw.rrect(c, ox, yb + 9, bwT, 14, 7); ctx.fillStyle = "#eef1f5"; ctx.fill();
      ctx.fillStyle = P.violet; ctx.fillRect(ox, yb + 9, B * sc, 14); ctx.fillStyle = P.orange; ctx.fillRect(ox + B * sc, yb + 9, (tot - B) * sc, 14);
      S.draw.text(c, "MB", ox + 4, yb + 16, {size:9, color:"#fff", align:"left"}); if ((tot - B) * sc > 40) S.draw.text(c, "activité", ox + B * sc + 4, yb + 16, {size:9, color:"#fff", align:"left"});
      if (st.defi){ var tx2 = ox + st.defi.T * sc; S.draw.line(c, tx2, yb + 5, tx2, yb + 27, P.red, 2.5); }
      /* courbe MB(masse) */
      var ax = S.draw.axes(c, {x0:30, x1:120, y0:600, y1:2600, xl:"masse (kg) — glisse le point", yl:"MB (kcal/jour)", stepX:10, stepY:400, t:sh + 26, l:48, b:32});
      st.geo.ax = ax;
      S.draw.fn(c, ax, function(x){ return mb("m", x, h.value, a.value); }, sx.value === "m" ? P.acc : S.draw.tint(P.acc, 0.35), 2.4);
      S.draw.fn(c, ax, function(x){ return mb("f", x, h.value, a.value); }, sx.value === "f" ? P.pink : S.draw.tint(P.pink, 0.35), 2.4);
      S.draw.text(c, "garçons / hommes", ax.X(118), ax.Y(mb("m", 118, h.value, a.value)) - 12, {size:9.5, color:P.acc, align:"right"});
      S.draw.text(c, "filles / femmes", ax.X(118), ax.Y(mb("f", 118, h.value, a.value)) + 13, {size:9.5, color:P.pink, align:"right"});
      S.draw.line(c, ax.X(m.value), ax.B, ax.X(m.value), ax.Y(B), P.ink, 1.2, [3, 3]);
      S.draw.dot(c, ax.X(m.value), ax.Y(Math.max(600, Math.min(2600, B))), 8, st.drag ? P.red : P.violet);
      S.draw.label(c, S.fmt(B, 0) + " kcal", ax.X(m.value) + (m.value > 95 ? -10 : 10), ax.Y(B) - 14, {color:P.violet, size:10, align:m.value > 95 ? "right" : "left"});
      var kj = tot * 4.184;
      ro.set(0, S.fmt(B, 0) + " kcal (" + S.fmt(B * 4.184, 0) + " kJ)"); ro.set(1, S.fmt(tot, 0) + " kcal (" + S.fmt(kj, 0) + " kJ)"); ro.set(2, "≈ " + S.fmt(kj * 0.4 / 50, 0) + " mol"); ro.set(3, S.fmt(B / tot * 100, 0) + " %");
      nt.set("MB = 10 × " + m.value + " + 6,25 × " + h.value + " − 5 × " + a.value + (sx.value === "m" ? " + 5" : " − 161") + " = " + S.fmt(B, 0) + " kcal/jour, dépensés surtout par le foie, le cerveau, les muscles, le cœur et les reins. Avec l'activité (×" + act.value.replace(".", ",") + "), les besoins montent à " + S.fmt(tot, 0) + " kcal/jour (" + S.fmt(kj, 0) + " kJ)." + (st.sel >= 0 ? " " + ORG[st.sel][0] + " : ≈ " + S.fmt(ORG[st.sel][1] * 100, 0) + " % du MB." : ""), "");
      if (st.defi){ var d = st.defi, ok = Math.abs(tot - d.T) <= 50; if (ok && !d.done){ d.done = true; st.score++; }
        nd.set("<b>Défi.</b> Trouve un profil (sexe, masse, taille, âge, activité) dont les besoins valent " + d.T + " kcal/jour, à 50 kcal près (trait rouge). " + (d.done ? "<b>Réussi !</b>" : "Écart : " + (tot > d.T ? "+" : "−") + S.fmt(Math.abs(tot - d.T), 0) + " kcal.") + " Score : " + st.score + " / " + st.tot + ".", d.done ? "ok" : "warn"); }
      else nd.set("Défi : clique « Défi : vise une dépense » et compose une personne qui dépense exactement la valeur demandée.", "");
    });
  }
});

SFA.sim({
  id:"b4-c07-bilan", ch:"c07", tag:"Bilan · défi",
  titre:"Bilan énergétique du jour",
  resume:"Compose ton menu en touchant des aliments : ils tombent sur le plateau « apports » d'une balance face à la dépense du jour. La courbe projette la masse sur 90 jours.",
  but:"Touche un aliment pour en ajouter une portion (mode « Retirer » pour l'enlever), règle la dépense journalière. La balance penche du côté le plus lourd, la barre montre glucides / lipides / protéines, la courbe la variation de masse. Défi : équilibrer le bilan à ±300 kJ avec une répartition proche des repères.",
  aRetenir:"Énergie des nutriments : glucides ≈ 17 kJ/g, protéines ≈ 17 kJ/g, lipides ≈ 37 kJ/g (≈ 4, 4 et 9 kcal/g). Bilan = apports − dépenses ; un bilan positif durable est stocké (surtout en lipides : 1 kg de graisse corporelle ≈ 32 000 kJ), un bilan négatif puise dans les réserves.",
  piege:"Projection simplifiée (le corps s'adapte, la dépense change avec la masse). Compositions des portions arrondies, d'après des tables nutritionnelles courantes. Les repères de répartition (≈ 50-55 % glucides, 30-35 % lipides, 10-15 % protéines) sont indicatifs.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.4}); B4.adapt(c, 1.66, 1.08, 480);
    var md = k.seg("Toucher un aliment pour", [["+","Ajouter"],["-","Retirer"]], "+");
    var d = k.slider("Dépense journalière", 6000, 16000, 100, 10000, "kJ");
    var ro = k.readouts(["Apports", "Bilan", "Glucides / lipides / protéines", "Variation de masse en 90 jours"]);
    var nt = k.note("", ""), nd = k.note("", "");
    /* portion : [nom, glucides, lipides, protéines] en g */
    var F = [["tartine", 19, 1, 3], ["céréales", 30, 2, 3], ["lait 25 cL", 12, 4, 8], ["pâtes", 75, 2, 13], ["frites", 70, 30, 7], ["steak", 0, 15, 39], ["fromage", 0, 9, 7], ["yaourt", 6, 4, 5], ["légumes", 8, 0, 3], ["pomme", 18, 0, 0], ["soda 33 cL", 35, 0, 0], ["chocolat", 28, 15, 3]];
    var st = {n:[1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0], tilt:0, t:0, drop:[], geo:{}, defi:false, score:0, tot:0, done:false};
    function kj(i){ return F[i][1] * 17 + F[i][2] * 37 + F[i][3] * 17; }
    k.button("Défi : équilibre la journée", function(){ st.defi = true; st.done = false; st.tot++; d.set(100 * Math.round((8500 + Math.random() * 4500) / 100)); st.n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; }, true);
    k.button("Vider le plateau", function(){ st.n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; });
    k.button("Menu type", function(){ st.n = [4, 1, 2, 1, 0, 1, 1, 1, 2, 2, 0, 1]; });
    var lp = k.loop(function(dt){ st.t += dt; var tg = tiltTarget(); st.tilt += (tg - st.tilt) * Math.min(1, dt * 3); st.drop.forEach(function(p){ p.t += dt; }); st.drop = st.drop.filter(function(p){ return p.t < 0.7; }); k.redraw(); });
    lp.play();
    function totals(){ var g = 0, l = 0, p = 0; st.n.forEach(function(q, i){ g += q * F[i][1]; l += q * F[i][2]; p += q * F[i][3]; }); return {g:g, l:l, p:p, eg:g * 17, el:l * 37, ep:p * 17, tot:g * 17 + l * 37 + p * 17}; }
    function tiltTarget(){ var b = totals().tot - d.value; return -Math.max(-0.2, Math.min(0.2, b / 12000)); }
    c.pointer(function(type, p){
      if (type !== "down" || !st.geo.tiles) return;
      st.geo.tiles.forEach(function(t, i){ if (p.x >= t[0] && p.x <= t[0] + t[2] && p.y >= t[1] && p.y <= t[1] + t[3]){
        if (md.value === "+"){ if (st.n[i] < 9){ st.n[i]++; st.drop.push({i:i, t:0, x:t[0] + t[2] / 2, y:t[1] + t[3] / 2}); } } else if (st.n[i] > 0) st.n[i]--; } });
      k.redraw();
    });
    c.cv.style.touchAction = "pan-y";
    function icon(i, x, y, s){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.scale(s / 24, s / 24);
      function e(cx, cy, rx, ry, f, st2){ ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.fillStyle = f; ctx.fill(); if (st2){ ctx.strokeStyle = st2; ctx.lineWidth = 1.2; ctx.stroke(); } }
      function rr(x0, y0, w, h, r, f, st2){ S.draw.rrect(c, x0, y0, w, h, r); ctx.fillStyle = f; ctx.fill(); if (st2){ ctx.strokeStyle = st2; ctx.lineWidth = 1.2; ctx.stroke(); } }
      if (i === 0){ rr(-10, -8, 20, 16, 5, "#f4d9a2", "#b9853f"); rr(-7, -5, 14, 10, 3, "#fbecc8"); }
      else if (i === 1 || i === 3){ ctx.beginPath(); ctx.arc(0, -1, 11, 0, 3.1416); ctx.fillStyle = "#dfe7f2"; ctx.fill(); ctx.strokeStyle = "#7b8ba3"; ctx.lineWidth = 1.2; ctx.stroke(); if (i === 1){ for (var q = 0; q < 7; q++) e(-8 + q * 2.6, -2 - (q % 2) * 2, 1.8, 1.4, "#d9a441"); } else { ctx.strokeStyle = "#e9c25a"; ctx.lineWidth = 2; ctx.beginPath(); for (q = 0; q < 6; q++){ ctx.moveTo(-8 + q * 3, -1); ctx.quadraticCurveTo(-6 + q * 3, -7, -4 + q * 3, -1); } ctx.stroke(); } }
      else if (i === 2){ rr(-6, -10, 12, 20, 2, "#ffffff", "#9aa6b6"); rr(-6, -4, 12, 14, 2, "#f6f7fb"); }
      else if (i === 4){ ctx.fillStyle = "#e9c25a"; for (q = 0; q < 5; q++) ctx.fillRect(-6 + q * 2.6, -11 + (q % 2) * 2, 2, 10); ctx.beginPath(); ctx.moveTo(-8, -3); ctx.lineTo(8, -3); ctx.lineTo(5, 10); ctx.lineTo(-5, 10); ctx.closePath(); ctx.fillStyle = "#d6453d"; ctx.fill(); }
      else if (i === 5){ e(0, 0, 11, 7, "#8a4b2a", "#5a2e16"); e(-3, -1, 3, 2, "#f2e2d0"); }
      else if (i === 6){ ctx.beginPath(); ctx.moveTo(-10, 7); ctx.lineTo(10, 7); ctx.lineTo(10, -2); ctx.lineTo(-10, -7); ctx.closePath(); ctx.fillStyle = "#f5cf4f"; ctx.fill(); ctx.strokeStyle = "#c79a1e"; ctx.lineWidth = 1.2; ctx.stroke(); e(-3, 2, 1.8, 1.8, "#e0b437"); e(4, 0, 1.4, 1.4, "#e0b437"); }
      else if (i === 7){ ctx.beginPath(); ctx.moveTo(-8, -7); ctx.lineTo(8, -7); ctx.lineTo(6, 9); ctx.lineTo(-6, 9); ctx.closePath(); ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.fillStyle = "#6fa8dc"; ctx.fillRect(-7, -2, 14, 3); }
      else if (i === 8){ ctx.fillStyle = "#4f9a4a"; ctx.fillRect(-1.5, 0, 3, 10); e(-5, -3, 5, 5, "#3c8a3c"); e(4, -4, 5, 5, "#4fa64a"); e(0, -8, 5, 4, "#5fb85a"); }
      else if (i === 9){ e(0, 1, 9, 9, "#d6453d", "#9b2c22"); ctx.strokeStyle = "#6b3f1d"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(1, -11); ctx.stroke(); e(4, -9, 3.5, 1.8, "#4f9a4a"); }
      else if (i === 10){ rr(-6, -10, 12, 20, 3, "#c0321d", "#7a1d10"); ctx.fillStyle = "#fff"; ctx.fillRect(-6, -2, 12, 3); }
      else { rr(-10, -6, 20, 12, 2, "#6b3a1f", "#3e1f0c"); ctx.strokeStyle = "#8b5432"; ctx.lineWidth = 1; for (q = 1; q < 4; q++){ ctx.beginPath(); ctx.moveTo(-10 + q * 5, -6); ctx.lineTo(-10 + q * 5, 6); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.stroke(); }
      ctx.restore();
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, fs = wide ? 10 : 9, T = totals(), bil = T.tot - d.value;
      /* aliments */
      var cols = wide ? 6 : 4, rows = 12 / cols, gx = 8, gy = 8, tw = (W - 16 - (cols - 1) * 6) / cols, th = wide ? 44 : 40; st.geo.tiles = [];
      F.forEach(function(f, i){ var x = gx + (i % cols) * (tw + 6), y = gy + Math.floor(i / cols) * (th + 6), q = st.n[i];
        S.draw.rrect(c, x, y, tw, th, 8); ctx.fillStyle = q ? "#eef6ff" : "#f6f8fb"; ctx.fill(); ctx.strokeStyle = q ? "#7fa7dd" : "#e3e7ed"; ctx.lineWidth = 1.2; ctx.stroke();
        icon(i, x + 17, y + th / 2, wide ? 24 : 22);
        S.draw.text(c, f[0], x + 32, y + th * 0.36, {size:fs, color:"#2c3a4e", align:"left", weight:700});
        S.draw.text(c, S.fmt(kj(i), 0) + " kJ", x + 32, y + th * 0.7, {size:fs - 0.5, color:"#5f6b7a", align:"left", weight:600});
        if (q){ S.draw.dot(c, x + 7, y + 7, 7.5, md.value === "-" ? P.red : P.acc); S.draw.text(c, "×" + q, x + 7, y + 7, {size:8, color:"#fff", weight:800}); }
        st.geo.tiles.push([x, y, tw, th]); });
      /* balance */
      var y0 = gy + rows * (th + 6) + 6, sh = H * 0.6, bcx = W / 2, piv = y0 + 44, L = Math.min(W * 0.34, 180), th2 = st.tilt;
      ctx.fillStyle = "#3d4f6b"; ctx.beginPath(); ctx.moveTo(bcx - 8, piv); ctx.lineTo(bcx + 8, piv); ctx.lineTo(bcx + 22, sh - 30); ctx.lineTo(bcx - 22, sh - 30); ctx.closePath(); ctx.fill();
      S.draw.rrect(c, bcx - 50, sh - 32, 100, 8, 4); ctx.fill();
      var ex1 = bcx - Math.cos(th2) * L, ey1 = piv - Math.sin(th2) * L, ex2 = bcx + Math.cos(th2) * L, ey2 = piv + Math.sin(th2) * L;
      S.draw.line(c, ex1, ey1, ex2, ey2, "#24324a", 5); S.draw.dot(c, bcx, piv, 6, "#f4c542");
      var drop = 34, pw = Math.min(110, L * 0.85);
      function pan(x, y, col, title, val){ S.draw.line(c, x, y, x - pw / 2 + 6, y + drop, "#8a95a3", 1.2); S.draw.line(c, x, y, x + pw / 2 - 6, y + drop, "#8a95a3", 1.2); ctx.beginPath(); ctx.moveTo(x - pw / 2, y + drop); ctx.quadraticCurveTo(x, y + drop + 14, x + pw / 2, y + drop); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); S.draw.text(c, title, x, y + drop + 22, {size:fs, color:"#2c3a4e"}); S.draw.text(c, S.fmt(val, 0) + " kJ", x, y + drop + 34, {size:fs + 1, color:"#13233a", weight:800}); }
      pan(ex1, ey1, "#9cc3ef", "apports", T.tot); pan(ex2, ey2, "#f3b199", "dépense", d.value);
      /* aliments empilés sur le plateau gauche ; poids sur le droit */
      var stack = []; st.n.forEach(function(q, i){ for (var z = 0; z < q; z++) stack.push(i); });
      stack.slice(0, 18).forEach(function(i, z){ icon(i, ex1 - pw / 2 + 12 + (z % 6) * ((pw - 24) / 5), ey1 + drop - 8 - Math.floor(z / 6) * 13, 15); });
      var nw = Math.round(d.value / 2000); for (var z = 0; z < nw; z++){ var wx = ex2 - pw / 2 + 14 + (z % 4) * ((pw - 28) / 3), wy = ey2 + drop - 9 - Math.floor(z / 4) * 12; S.draw.rrect(c, wx - 8, wy - 5, 16, 11, 3); ctx.fillStyle = "#5f6b7a"; ctx.fill(); }
      st.drop.forEach(function(p){ var u = B4.ease(p.t / 0.7); icon(p.i, p.x + (ex1 - p.x) * u, p.y + (ey1 + drop - 10 - p.y) * u, 18); });
      var bilTxt = Math.abs(bil) <= 300 ? "équilibre" : bil > 0 ? "excès +" + S.fmt(bil, 0) + " kJ" : "déficit −" + S.fmt(-bil, 0) + " kJ";
      S.draw.label(c, bilTxt, bcx, piv - 16, {color:Math.abs(bil) <= 300 ? P.green : bil > 0 ? P.red : P.acc, size:fs + 1});
      /* répartition des nutriments */
      var rx = 8, rw = W - 16, ry = sh - 12, pg = T.tot ? T.eg / T.tot : 0, pl = T.tot ? T.el / T.tot : 0, pp = T.tot ? T.ep / T.tot : 0;
      S.draw.rrect(c, rx, ry, rw, 12, 6); ctx.fillStyle = "#eef1f5"; ctx.fill();
      if (T.tot){ ctx.save(); S.draw.rrect(c, rx, ry, rw, 12, 6); ctx.clip(); ctx.fillStyle = "#2e8b57"; ctx.fillRect(rx, ry, rw * pg, 12); ctx.fillStyle = "#d18a1b"; ctx.fillRect(rx + rw * pg, ry, rw * pl, 12); ctx.fillStyle = "#1f4b9e"; ctx.fillRect(rx + rw * (pg + pl), ry, rw * pp, 12); ctx.restore();
        [[0.5, 0.55], [0.85, 0.9]].forEach(function(z2){ S.draw.line(c, rx + rw * z2[0], ry - 3, rx + rw * z2[0], ry + 15, "rgba(15,27,45,.45)", 1, [2, 2]); }); }
      S.draw.text(c, "glucides " + S.fmt(pg * 100, 0) + " % · lipides " + S.fmt(pl * 100, 0) + " % · protéines " + S.fmt(pp * 100, 0) + " % (pointillés : repères)", rx, ry - 8, {size:fs - 0.5, color:"#2c3a4e", align:"left", weight:700});
      /* projection de masse */
      var dm = bil * 90 / 32000, ym = Math.max(4, Math.ceil(Math.abs(dm) / 2) * 2 + 2);
      var ax = S.draw.axes(c, {x0:0, x1:90, y0:-ym, y1:ym, xl:"jours", yl:"variation de masse (kg)", stepX:15, t:sh + 24, l:44, b:28});
      ctx.fillStyle = "rgba(36,119,90,.10)"; var e0 = ax.Y(300 * 90 / 32000), e1 = ax.Y(-300 * 90 / 32000); ctx.fillRect(ax.L, e0, ax.R - ax.L, e1 - e0);
      S.draw.fn(c, ax, function(t){ return bil * t / 32000; }, bil > 300 ? P.red : bil < -300 ? P.acc : P.green, 3);
      S.draw.dot(c, ax.X(90), ax.Y(dm), 7, "#13233a"); S.draw.label(c, (dm >= 0 ? "+" : "") + S.fmt(dm, 1) + " kg", ax.X(90) - 8, ax.Y(dm) + (dm > 0 ? 14 : -14), {color:P.ink, size:10, align:"right"});
      ro.set(0, S.fmt(T.tot, 0) + " kJ (" + S.fmt(T.tot / 4.184, 0) + " kcal)"); ro.set(1, (bil >= 0 ? "+" : "") + S.fmt(bil, 0) + " kJ"); ro.set(2, T.tot ? S.fmt(pg * 100, 0) + " / " + S.fmt(pl * 100, 0) + " / " + S.fmt(pp * 100, 0) + " %" : "—"); ro.set(3, (dm >= 0 ? "+" : "") + S.fmt(dm, 1) + " kg");
      var okb = Math.abs(bil) <= 300, rep = T.tot > 0 && pg >= 0.45 && pg <= 0.6 && pl >= 0.25 && pl <= 0.4 && pp >= 0.1 && pp <= 0.2;
      nt.set("Apports : " + S.fmt(T.g, 0) + " g de glucides × 17 + " + S.fmt(T.l, 0) + " g de lipides × 37 + " + S.fmt(T.p, 0) + " g de protéines × 17 = " + S.fmt(T.tot, 0) + " kJ. " + (okb ? "Bilan équilibré : la masse reste stable." : bil > 0 ? "Excès : stocké surtout en graisse (32 000 kJ par kg), la masse augmente." : "Déficit : le corps puise dans ses réserves, la masse diminue.") + (T.tot ? (rep ? " Répartition proche des repères." : " Répartition éloignée des repères.") : ""), okb ? "ok" : "warn");
      if (st.defi){ if (okb && rep && !st.done){ st.done = true; st.score++; }
        nd.set("<b>Défi.</b> Dépense du jour : " + S.fmt(d.value, 0) + " kJ. Compose un menu au bilan ±300 kJ, avec glucides 45-60 %, lipides 25-40 %, protéines 10-20 %. " + (st.done ? "<b>Réussi !</b>" : (okb ? "Bilan OK, " : "Bilan à " + (bil >= 0 ? "+" : "") + S.fmt(bil, 0) + " kJ, ") + (rep ? "répartition OK." : "répartition à corriger.")) + " Score : " + st.score + " / " + st.tot + ".", st.done ? "ok" : "warn"); }
      else nd.set("Défi : clique « Défi : équilibre la journée ».", "");
    });
  }
});

SFA.sim({
  id:"b4-c07-plante", ch:"c07", tag:"Jour et nuit · modèle",
  titre:"Une plante sur 24 heures : photosynthèse et respiration",
  resume:"Suis l'O₂ dégagé le jour et consommé la nuit : le bilan net décide si la plante croît.",
  but:"Choisis la durée du jour, l'éclairement maximal et la température. Lance l'horloge et lis le bilan net sur 24 h.",
  aRetenir:"Une plante fait la photosynthèse (anabolisme : fabrication de glucose) seulement à la lumière, mais respire (catabolisme : libération d'énergie) jour et nuit. Elle ne croît que si, sur 24 h, la photosynthèse dépasse la respiration. Des nuits fraîches réduisent la respiration et améliorent le bilan.",
  piege:"Une plante ne « respire pas le jour » est faux : la respiration continue, masquée par la photosynthèse. Modèle simplifié (O₂ en µmol/m²/s, 6 O₂ pour 1 glucose).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var dl = k.slider("Durée du jour", 6, 18, 1, 12, "h");
    var im = k.slider("Éclairement maximal", 20, 100, 5, 80, "% du plein soleil");
    var T = k.slider("Température", 5, 35, 1, 20, "°C");
    var ro = k.readouts(["O₂ produit (jour)", "O₂ consommé (24 h)", "Bilan net", "Glucose net"]);
    var nt = k.note("", "");
    var st = {h:6};
    var lp = k.loop(function(dt){ st.h += dt * 3; if (st.h >= 30){ st.h = 6; } k.redraw(); });
    lp.play();
    k.button("❚❚ Pause / ▶ Reprendre", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    function Pf(t){ var r0 = 12 - dl.value / 2; if (t < r0 || t > r0 + dl.value) return 0; var I = im.value * Math.sin(Math.PI * (t - r0) / dl.value); return 15 * I / (I + 25); }
    function R(){ return 2 * Math.pow(2, (T.value - 20) / 10); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, ax = S.draw.axes(c, {x0:0, x1:24, y0:-6, y1:14, xl:"heure", yl:"O₂ (µmol/m²/s)", stepX:3, stepY:4});
      var r0 = 12 - dl.value / 2;
      ctx.fillStyle = "rgba(15,27,45,.07)"; ctx.fillRect(ax.L, ax.T, ax.X(r0) - ax.L, ax.B - ax.T); ctx.fillRect(ax.X(r0 + dl.value), ax.T, ax.R - ax.X(r0 + dl.value), ax.B - ax.T);
      S.draw.fn(c, ax, Pf, B4.pal.green, 2.8); S.draw.line(c, ax.X(0), ax.Y(-R()), ax.X(24), ax.Y(-R()), B4.pal.red, 2.6);
      S.draw.fn(c, ax, function(t){ return Pf(t) - R(); }, B4.pal.ink, 2, [6, 4]);
      B4.txt(c, "photosynthèse", ax.X(18.8), ax.Y(8), B4.pal.green, 12); B4.txt(c, "−respiration", ax.X(21), ax.Y(-R()) + 14, B4.pal.red, 12); B4.txt(c, "net (tirets)", ax.X(4), ax.Y(2), B4.pal.ink, 12);
      var th = st.h % 24; S.draw.line(c, ax.X(th), ax.T, ax.X(th), ax.B, B4.pal.amber, 2.2); S.draw.dot(c, ax.X(th), ax.Y(Pf(th) - R()), 6, B4.pal.amber);
      var prod = 0, cons = R() * 24 * 3.6, i;                       /* mmol/m² : µmol/s × 3600 s/h ÷ 1000 */
      for (i = 0; i < 2400; i++){ prod += Pf(i / 100) * 0.01 * 3.6; }
      var net = prod - cons, glc = net / 6;
      ro.set(0, S.fmt(prod, 0) + " mmol/m²"); ro.set(1, S.fmt(cons, 0) + " mmol/m²"); ro.set(2, (net >= 0 ? "+" : "") + S.fmt(net, 0) + " mmol/m²"); ro.set(3, S.fmt(glc * 0.18, 1) + " g/m²");
      var net_now = Pf(th) - R();
      nt.set("À " + S.fmt(Math.floor(th), 0) + " h : " + (Pf(th) === 0 ? "nuit, seule la respiration agit : échange net " + S.fmt(-R(), 1) + " (consommation d'O₂)." : net_now >= 0 ? "photosynthèse > respiration : dégagement net d'O₂." : "la photosynthèse est encore plus faible que la respiration.") + " Bilan sur 24 h : " + (net > 0 ? "positif, la plante fabrique plus de glucose qu'elle n'en consomme : elle peut croître." : "négatif : la plante consomme ses réserves."), net > 0 ? "ok" : "warn");
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

/*B3D-ADD:b4-3d-atp*/
SFA.sim({
  id:"b4-3d-atp", ch:"c07", tag:"3D · chaîne respiratoire",
  titre:"L'ATP synthase : un moteur rotatif alimenté par un gradient de H⁺",
  resume:"Dans la membrane interne de la mitochondrie, les électrons pompent des H⁺ ; ceux-ci repassent par l'ATP synthase qui tourne et fabrique l'ATP.",
  but:"Règle l'apport en électrons (NADH, dioxygène) et observe le gradient de H⁺, la rotation du moteur et l'ATP produit. Ajoute du cyanure (bloque le complexe IV) ou un découpleur (membrane qui fuit) et compare. Glisse pour tourner la vue.",
  aRetenir:"La chaîne respiratoire (complexes I, III, IV) transporte les électrons du NADH jusqu'au dioxygène, qui devient de l'eau. L'énergie libérée pompe des H⁺ vers l'espace intermembranaire : le gradient de H⁺ est une réserve d'énergie. Les H⁺ reviennent dans la matrice par l'ATP synthase, qui tourne et fabrique l'ATP (ADP + Pi → ATP). La respiration cellulaire produit ainsi la grande majorité de l'ATP (environ 30 à 32 par glucose).",
  piege:"Le dioxygène n'est pas consommé pour « fabriquer l'ATP » directement : il sert d'accepteur final d'électrons. Sans O₂ (ou avec du cyanure), la chaîne s'arrête, le gradient s'effondre et l'ATP synthase ne tourne plus. Un découpleur fait l'inverse : on consomme plus de O₂ mais on fabrique moins d'ATP (la chaleur remplace l'ATP). Modèle simplifié, rotation au ralenti (réelle : environ 100 tours par seconde).",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(340), cam = B.cam(0.35, 0.3, 8);
    var flow = k.slider("Apport d'électrons (NADH, O₂)", 0, 100, 5, 80, "%");
    var cn = k.toggle("Cyanure : bloque le complexe IV", false);
    var dec = k.toggle("Découpleur : la membrane devient fuyante", false);
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    var ro = k.readouts(["Gradient de H⁺", "ATP synthase", "ATP produit (cumul)", "O₂ consommé"]);
    var nt = k.note("", "");
    k.button("Remettre à zéro", function(){ p = 0; atp = 0; th = 0; parts = []; ats = []; }, true);
    cam.auto = false;
    var p = 0.05, th = 0, atp = 0, T = 0, parts = [], ats = [], lastThird = 0;
    var CX = [-1.5, -0.55, 0.4], AX = 1.55;
    var PATH = [[-1.5,-0.5],[-1.0,0.25],[-0.55,-0.5],[-0.1,0.25],[0.4,-0.5]];
    function pathPt(u){ var n = PATH.length - 1, s = u * n, i = Math.min(n - 1, Math.floor(s)), f = s - i; return [PATH[i][0] + (PATH[i+1][0] - PATH[i][0]) * f, PATH[i][1] + (PATH[i+1][1] - PATH[i][1]) * f]; }
    function rnd(){ return Math.random() * 2 - 1; }
    function step(dt){
      T += dt;
      var e = flow.value / 100 * (cn.value ? 0 : 1), leak = dec.value ? 3 : 0.05;
      var om = 3.3 * Math.max(0, p - 0.1);
      p += (1.2 * e * (1 - p) - leak * p - 0.2 * om) * dt; p = Math.max(0, Math.min(1, p));
      om = 3.3 * Math.max(0, p - 0.1);
      th += om * 6.2832 * dt * 0.5; atp += 3 * om * dt * 0.5 * 1.0;
      var third = Math.floor(th / 2.0944);
      if (third > lastThird){ ats.push({x:AX + 0.15, y:-1.1, z:0.2, vx:0.5 * rnd() + 0.3, vy:-0.5, vz:rnd() * 0.5, life:2.2}); } lastThird = third;
      /* H+ : cible = gradient */
      var free = parts.filter(function(q){ return q.k === "free" || q.k === "pump"; }).length, target = Math.round(p * 46);
      if (free < target && Math.random() < 0.6 && e > 0){ var cx = CX[Math.floor(Math.random() * 3)]; parts.push({k:"pump", x:cx + rnd() * 0.15, y:-0.4, z:rnd() * 0.3, tx:cx + rnd() * 0.9, tz:rnd() * 0.9, ty:0.5 + Math.random() * 1.3}); }
      if (free > target){ for (var i = 0; i < parts.length; i++) if (parts[i].k === "free"){ parts[i].k = (dec.value || Math.random() < 0.2) ? "leak" : "flow"; parts[i].lx = dec.value ? rnd() * 1.9 : AX; parts[i].lz = dec.value ? rnd() * 0.8 : 0; break; } }
      parts.forEach(function(q){
        if (q.k === "pump"){ q.y += 1.6 * dt; q.x += (q.tx - q.x) * 1.5 * dt; q.z += (q.tz - q.z) * 1.5 * dt; if (q.y >= q.ty) q.k = "free"; }
        else if (q.k === "free"){ q.x += rnd() * 0.9 * dt; q.z += rnd() * 0.9 * dt; q.y += rnd() * 0.7 * dt; q.x = Math.max(-2.1, Math.min(2.1, q.x)); q.z = Math.max(-1, Math.min(1, q.z)); q.y = Math.max(0.35, Math.min(1.9, q.y)); }
        else { q.x += (q.lx - q.x) * 3 * dt; q.z += (q.lz - q.z) * 3 * dt; q.y -= 1.4 * dt; if (q.y < -1.9) q.dead = true; }
      });
      parts = parts.filter(function(q){ return !q.dead; });
      ats.forEach(function(a){ a.x += a.vx * dt; a.y += a.vy * dt; a.z += a.vz * dt; a.life -= dt; }); ats = ats.filter(function(a){ return a.life > 0; });
    }
    B.drag(c, cam, function(){ render(); });
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W / 5.4, c.H / 4.3), 5), e = flow.value / 100 * (cn.value ? 0 : 1);
      var HEAD = B.hex("#f2d98a"), TAIL = B.hex("#d9a441");
      for (var i = 0; i < 11; i++) for (var j = 0; j < 5; j++){
        var x = -2.0 + i * 0.4, z = (j - 2) * 0.4, skip = false;
        if (Math.abs(z) < 0.45){ CX.forEach(function(cx){ if (Math.abs(x - cx) < 0.5) skip = true; }); if (Math.abs(x - AX) < 0.55) skip = true; }
        if (skip) continue;
        [1, -1].forEach(function(s){ sc.line([x, s * 0.03, z], [x, s * 0.3, z], 0.05, TAIL); sc.sphere([x, s * 0.36, z], 0.12, HEAD); });
      }
      /* complexes */
      var COLS = [B.hex("#7c3aed"), B.hex("#2563eb"), B.hex("#16a34a")], NAMES = ["I", "III", "IV"];
      CX.forEach(function(cx, n){
        sc.tube([cx, -0.55, 0], [cx, 0.55, 0], 0.32, COLS[n]); sc.sphere([cx, 0.55, 0], 0.32, COLS[n]); sc.sphere([cx, -0.55, 0], 0.32, COLS[n]);
        sc.label([cx, 0, -0.4], NAMES[n], "#0f1b2d", 13, 0, 0);
      });
      /* électrons */
      for (var q = 0; q < 8; q++){
        var u = cn.value ? 0.12 + 0.55 * q / 8 : ((T * (0.1 + 0.35 * e) + q / 8) % 1);
        if (!cn.value && e <= 0) u = 0.1 + 0.8 * q / 8;
        var pt = pathPt(u); if (e > 0 || cn.value) sc.sphere([pt[0], pt[1], 0.45], 0.075, B.hex("#facc15"), 1, "#a16207");
      }
      /* O2 -> H2O au complexe IV */
      if (e > 0.02) sc.label([CX[2] - 0.2, -1.1, 0], "O₂ + e⁻ + H⁺ → H₂O", "#16a34a", 10, 0, 0);
      else if (cn.value) sc.label([CX[2], -1.05, 0], "bloqué !", "#b91c1c", 12, 0, 0);
      /* ATP synthase */
      var ac = B.hex("#ea7a1a"), ac2 = B.hex("#f59e0b");
      for (var a = 0; a < 8; a++){ var an = th + a * 0.7854; sc.sphere([AX + 0.27 * Math.cos(an), 0, 0.27 * Math.sin(an)], 0.1, a === 0 ? B.hex("#dc2626") : ac); }
      sc.tube([AX + 0.14 * Math.cos(th), -0.1, 0.14 * Math.sin(th)], [AX, -0.75, 0], 0.07, B.hex("#475569"));
      sc.tube([AX + 0.5, 0.3, 0], [AX + 0.4, -1.05, 0], 0.06, B.hex("#94a3b8"));
      for (var h = 0; h < 3; h++){ var ah = h * 2.0944 + 0.5; sc.sphere([AX + 0.22 * Math.cos(ah), -1.0, 0.22 * Math.sin(ah)], 0.24, ac2); }
      sc.label([AX, 0.75, 0], "ATP synthase", "#b45309", 11, 0, 0);
      sc.label([AX, -1.55, 0], "ADP + Pi → ATP", "#b45309", 10, 0, 0);
      /* particules */
      parts.forEach(function(r){ sc.sphere([r.x, r.y, r.z], 0.07, B.hex("#e11d48")); });
      ats.forEach(function(a){ sc.sphere([a.x, a.y, a.z], 0.13, B.hex("#fb923c"), Math.min(1, a.life)); });
      sc.label([-0.3, 1.85, 0], "Espace intermembranaire", "#be123c", 11, 0, 0);
      sc.label([-1.3, -1.8, 0], "Matrice", "#0f1b2d", 11, 0, 0);
      sc.flush(); B.hint(c);
      var om = 3.3 * Math.max(0, p - 0.1);
      ro.set(0, S.fmt(p * 100, 0) + " %"); ro.set(1, om > 0.02 ? S.fmt(om * 0.5, 1) + " tr/s (ralenti)" : "à l'arrêt"); ro.set(2, S.fmt(atp, 0)); ro.set(3, S.fmt(flow.value * (cn.value ? 0 : 1) * (1 - 0.6 * p) * (dec.value ? 1.0 : 1) , 0) + " %");
      var msg, kind = "";
      if (cn.value){ msg = "Le cyanure bloque le complexe IV : les électrons s'accumulent, plus d'eau formée, plus de pompage. Le gradient de H⁺ s'effondre et l'ATP synthase s'arrête."; kind = "bad"; }
      else if (flow.value === 0){ msg = "Sans électrons (sans nutriments ni O₂), aucun H⁺ n'est pompé : pas de gradient, pas d'ATP."; kind = "warn"; }
      else if (dec.value){ msg = "Découpleur : les H⁺ repassent par la membrane sans passer par l'ATP synthase. Le gradient reste bas, peu d'ATP, mais la chaîne tourne à fond (O₂ consommé élevé) et l'énergie part en chaleur."; kind = "warn"; }
      else msg = "Les complexes I, III et IV pompent les H⁺ vers le haut. Ils reviennent par l'ATP synthase : chaque tour du rotor (point rouge) fait environ 3 ATP.";
      nt.set(msg, kind);
    }
    k.draw(render);
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b4-3d-atp*/
