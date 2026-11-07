/* Biologie 4e · chapitre 4 · Enzymes et catalyse biologique */
SFA.sim({
  id:"b4-c04-tph", ch:"c04", tag:"Carte interactive · enzyme",
  titre:"Température et pH : la courbe en cloche",
  resume:"Glisse un point sur la carte température × pH : l'enzyme s'active, ralentit ou se déforme. Quatre enzymes à comparer.",
  but:"Glisse le point sur la carte (ou utilise les curseurs) : la couleur donne l'activité, l'enzyme dessinée se déforme, les courbes en bordure suivent. Le bouton « Chauffer 5 min » montre ce que devient l'enzyme dénaturée.",
  aRetenir:"Chaque enzyme a une température et un pH optimaux (amylase salivaire : ≈ 37 °C, pH ≈ 7 ; pepsine : pH ≈ 2). Au-delà, la structure 3D de la protéine est détruite : c'est la dénaturation, irréversible. Le froid, lui, ralentit l'enzyme sans la détruire.",
  piege:"Une enzyme dénaturée par la chaleur ne « redevient pas active » en refroidissant, contrairement à un gel qui refond. Courbes de modèle (activité relative, optimum = 100 %), pas des mesures.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.2});
    var E = {amy:{n:"Amylase salivaire", T:37, pH:7, w:1.7}, pep:{n:"Pepsine (estomac)", T:37, pH:2, w:1.2}, tryp:{n:"Trypsine (intestin grêle)", T:37, pH:8, w:1.5}, therm:{n:"Enzyme de bactérie thermophile", T:70, pH:7, w:2}};
    var en = k.select("Enzyme", [["amy","Amylase salivaire"],["pep","Pepsine (estomac)"],["tryp","Trypsine (intestin)"],["therm","Bactérie thermophile (source chaude)"]], "amy", function(v){ T.set(E[v].T); ph.set(E[v].pH); res.on = false; });
    var T = k.slider("Température", 0, 90, 1, 37, "°C", function(){ res.on = false; });
    var ph = k.slider("pH", 0, 14, 0.1, 7, "", function(){ res.on = false; });
    var res = {on:false, T:0};
    var ro = k.readouts(["Activité relative", "Facteur température", "Facteur pH", "Activité après chauffage"]);
    var nt = k.note("", "");
    k.button("Chauffer 5 min puis refroidir à l'optimum", function(){ res.on = true; res.T = T.value; }, true);
    function fT(t, e){ var g = Math.pow(2, (t - e.T) / 10), d = 1 / (1 + Math.exp((t - e.T - 3.65) / 2)); return g * d / 0.8614; }
    function fP(p, e){ return Math.exp(-Math.pow((p - e.pH) / e.w, 2)); }
    function keep(t, e){ var kd = 0.01 * Math.pow(2, (t - e.T - 3) / 3); return Math.exp(-5 * kd); }
    var cache = {}, geo = {}, subs = [], rr = B4.rng(9), tt = 0;
    for (var i = 0; i < 7; i++) subs.push({x:rr(), y:rr(), v:0.12 + rr() * 0.12, ph:rr()});
    var lp = k.loop(function(dt){ tt += dt; var e = E[en.value], a = Math.min(1, fT(T.value, e) * fP(ph.value, e)); subs.forEach(function(s){ s.x += s.v * dt * (0.25 + 1.6 * a); if (s.x > 1.1){ s.x = -0.1; s.y = rr(); } }); k.redraw(); });
    lp.play();
    function heat(e, w, h){
      var key = en.value + "|" + w + "|" + h; if (cache.key === key) return cache.cv;
      var cv = document.createElement("canvas"), nx = 60, ny = 36; cv.width = nx; cv.height = ny; var cx = cv.getContext("2d");
      for (var ix = 0; ix < nx; ix++) for (var iy = 0; iy < ny; iy++){ var t = (ix + 0.5) / nx * 90, p = 14 - (iy + 0.5) / ny * 14, a = Math.min(1, fT(t, e) * fP(p, e)); var r = Math.round(247 - a * (247 - 20)), g = Math.round(249 - a * (249 - 150)), b = Math.round(252 - a * (252 - 120)); cx.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; cx.fillRect(ix, iy, 1, 1); }
      cache = {key:key, cv:cv}; return cv;
    }
    k.draw(function(){
      var e = E[en.value], t = T.value, p = ph.value, fa = Math.min(1.0001, fT(t, e)), fb = fP(p, e), act = Math.min(1, fa * fb);
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, hx0 = 44, hx1 = W - 12, hy0 = 12, hy1 = H * 0.50;
      geo = {x0:hx0, x1:hx1, y0:hy0, y1:hy1};
      ctx.imageSmoothingEnabled = true; ctx.drawImage(heat(e, W, H), hx0, hy0, hx1 - hx0, hy1 - hy0); ctx.strokeStyle = "#cdd5e1"; ctx.lineWidth = 1; ctx.strokeRect(hx0, hy0, hx1 - hx0, hy1 - hy0);
      function TX(v){ return hx0 + v / 90 * (hx1 - hx0); } function PY(v){ return hy1 - v / 14 * (hy1 - hy0); }
      for (var v = 0; v <= 90; v += 15) S.draw.text(c, v, TX(v), hy1 + 11, {size:10, color:"#5f6b7a"}); for (v = 0; v <= 14; v += 2) S.draw.text(c, v, hx0 - 8, PY(v), {size:10, color:"#5f6b7a"});
      S.draw.text(c, "température (°C)", hx1, hy1 + 23, {size:10.5, color:"#5f6b7a", align:"right"}); S.draw.text(c, "pH", hx0 - 31, (hy0 + hy1) / 2, {size:10.5, color:"#5f6b7a"});
      /* repères d'optimum */
      S.draw.line(c, TX(e.T), hy0, TX(e.T), hy1, "rgba(15,27,45,.25)", 1, [3, 3]); S.draw.line(c, hx0, PY(e.pH), hx1, PY(e.pH), "rgba(15,27,45,.25)", 1, [3, 3]);
      S.draw.label(c, "optimum", TX(e.T) + 4, PY(e.pH) - 10, {color:P.ink, size:9.5, align:"left"});
      /* point de réglage */
      var px = TX(t), py = PY(p); S.draw.glow(c, px, py, 22, P.red, 0.3); S.draw.line(c, px, py, px, hy1, "rgba(192,50,29,.6)", 1.2); S.draw.line(c, hx0, py, px, py, "rgba(192,50,29,.6)", 1.2); S.draw.dot(c, px, py, 8, P.red);
      if (res.on){ var kp = keep(res.T, e); S.draw.dot(c, TX(e.T), PY(e.pH), 6, P.violet); S.draw.label(c, "après chauffage : " + S.fmt(kp * 100, 0) + " %", TX(e.T), PY(e.pH) + 16, {color:P.violet, size:10}); }
      S.draw.label(c, "activité " + S.fmt(act * 100, 0) + " %", hx1 - 4, hy0 + 14, {color:act > 0.6 ? P.green : act > 0.25 ? P.amber : P.red, size:12, align:"right"});
      /* enzyme et substrats */
      var sy0 = hy1 + 38, sh = H - sy0 - 6, ex = W * 0.52, ey = sy0 + sh * 0.5, er = Math.min(sh * 0.36, W * 0.13);
      var heatD = Math.max(0, Math.min(1, (t - e.T - 4) / 14)), cold = Math.max(0, Math.min(1, (e.T - 5 - t) / 25)), phD = 1 - fb, bad = Math.max(heatD, phD * 0.9);
      ctx.save(); ctx.fillStyle = "#f7f9fc"; S.draw.rrect(c, 6, sy0 - 8, W - 12, sh + 14, 12); ctx.fill(); ctx.strokeStyle = "#e3e7ed"; ctx.stroke(); ctx.restore();
      /* substrats */
      subs.forEach(function(s, i){ var x = 14 + s.x * (ex - er - 26), y = sy0 + 8 + s.y * (sh - 16); var near = s.x > 0.92; if (near && act > 0.3) return; ctx.save(); ctx.translate(x, y); ctx.rotate(s.x * 3 + i); ctx.fillStyle = "#f4a259"; ctx.fillRect(-5, -5, 10, 10); ctx.strokeStyle = "#a45c14"; ctx.strokeRect(-5, -5, 10, 10); ctx.restore(); });
      /* produits */
      subs.forEach(function(s, i){ if (s.x > 0.92 && act > 0.3){ var x = ex + er + 12 + (s.x - 0.92) * 60, y = ey + (i % 2 ? 12 : -12); S.draw.dot(c, x, y, 4, P.green); } });
      /* corps de l'enzyme : cercle avec encoche (site actif) qui se déforme */
      var open = er * (0.55 - 0.45 * bad), wob = bad * 5;
      ctx.save(); ctx.translate(ex, ey); var g2 = ctx.createRadialGradient(-er * .3, -er * .3, 3, 0, 0, er * 1.2); g2.addColorStop(0, bad > 0.5 ? "#c9ced6" : "#b79af0"); g2.addColorStop(1, bad > 0.5 ? "#8b93a1" : "#6236c4"); ctx.fillStyle = g2; ctx.strokeStyle = "#3f1f87"; ctx.lineWidth = 2;
      ctx.beginPath(); for (var q = 0; q <= 60; q++){ var a = q / 60 * 6.2832, rad = er * (1 + Math.sin(a * 5 + tt * 2) * 0.03 * (0.3 + bad * 5) + (bad > 0.4 ? Math.sin(a * 3 + 1) * 0.18 * bad : 0)); var xx = Math.cos(a) * rad, yy = Math.sin(a) * rad; if (Math.abs(a - 3.1416) < 0.55 * (open / er + 0.25) * 1.0){ var dd = (1 - Math.abs(a - 3.1416) / (0.55 * (open / er + 0.25))); xx += dd * er * 0.55 * (1 - bad * 0.6); } q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      S.draw.text(c, e.n.split(" ")[0], ex + er * 0.28, ey - er * 0.1, {size:10, color:"#fff"});
      if (act > 0.3) S.draw.glow(c, ex - er * 0.55, ey, 18, P.green, 0.5 * act);
      S.draw.label(c, bad > 0.5 ? "site actif déformé" : cold > 0.4 ? "enzyme intacte mais lente" : act > 0.7 ? "site actif adapté" : "site actif", ex - er - 4, sy0 + 6 + 8, {color:bad > 0.5 ? P.red : P.violet, size:10, align:"left"});
      S.draw.text(c, "substrats", 12, sy0 + sh - 4, {size:9.5, color:"#a45c14", align:"left"}); S.draw.text(c, "produits", W - 12, sy0 + sh - 4, {size:9.5, color:P.green, align:"right"});
      ro.set(0, S.fmt(act * 100, 0) + " %"); ro.set(1, S.fmt(fa * 100, 0) + " %"); ro.set(2, S.fmt(fb * 100, 0) + " %"); ro.set(3, res.on ? S.fmt(keep(res.T, e) * 100, 0) + " %" : "—");
      var msg, kind = "";
      if (res.on){ var kv = keep(res.T, e); msg = "Après 5 min à " + S.fmt(res.T, 0) + " °C puis retour à " + e.T + " °C, il reste " + S.fmt(kv * 100, 0) + " % de l'activité : " + (kv < 0.5 ? "la dénaturation est irréversible, refroidir ne répare rien." : "peu d'enzyme est détruite à cette température."); kind = kv < 0.5 ? "bad" : "ok"; }
      else if (t > e.T + 12){ msg = "Au-dessus de l'optimum, la structure tridimensionnelle se déforme : l'enzyme se dénature (perte de forme du site actif)."; kind = "bad"; }
      else if (t < e.T - 15){ msg = "Le froid ralentit les mouvements moléculaires : l'activité baisse, mais l'enzyme n'est pas détruite (elle repart si on réchauffe)."; kind = "warn"; }
      else if (Math.abs(p - e.pH) > e.w * 1.2){ msg = "Loin du pH optimal, la charge des acides aminés change et le site actif se déforme : l'activité s'effondre."; kind = "warn"; }
      else { msg = "Conditions proches de l'optimum : activité maximale."; kind = "ok"; }
      nt.set(msg, kind);
    });
    c.pointer(function(type, e){
      if (type === "move" || !geo.x0) return; if (type === "down" && (e.x < geo.x0 - 8 || e.y > geo.y1 + 6)) return;
      var tv = Math.max(0, Math.min(90, Math.round((e.x - geo.x0) / (geo.x1 - geo.x0) * 90))), pv = Math.max(0, Math.min(14, Math.round((geo.y1 - e.y) / (geo.y1 - geo.y0) * 140) / 10));
      if (type === "down" || type === "drag"){ T.set(tv); ph.set(pv); res.on = false; k.redraw(); }
    });
    c.cv.style.touchAction = "pan-y";
  }
});

SFA.sim({
  id:"b4-c04-substrat", ch:"c04", tag:"Classique · saturation",
  titre:"Plus de substrat : la vitesse sature",
  resume:"Augmente la concentration de substrat et regarde les sites actifs se remplir jusqu'au plateau.",
  but:"Fais varier [S], la quantité d'enzyme et Km. Lis la vitesse, la part de sites occupés, puis atteins 90 % de la vitesse maximale (défi).",
  aRetenir:"v = V<sub>max</sub>·[S] ÷ (K<sub>m</sub> + [S]). À faible [S], v est proportionnelle à [S] ; à forte [S] tous les sites actifs sont occupés : v atteint un plateau V<sub>max</sub>, proportionnel à la quantité d'enzyme. K<sub>m</sub> est la [S] pour laquelle v = V<sub>max</sub>/2.",
  piege:"Doubler [S] ne double pas la vitesse (sauf à très faible [S]). Pour augmenter le plateau, il faut plus d'enzyme, pas plus de substrat. L'enzyme n'est pas consommée : elle ressort intacte.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var s = k.slider("Substrat [S]", 0, 100, 1, 10, "mmol/L");
    var km = k.slider("Km (affinité : petit Km = forte affinité)", 1, 50, 1, 10, "mmol/L");
    var e = k.slider("Quantité d'enzyme", 1, 10, 1, 4, "unités");
    var ro = k.readouts(["Vitesse v", "V max", "Sites occupés", "% de V max"]);
    var nt = k.note("", "");
    k.button("Défi : atteindre 90 % de Vmax", function(){ nt.el.dataset.defi = "1"; }, true);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, vmax = 10 * e.value, K = km.value, S0 = s.value, v = vmax * S0 / (K + S0), occ = S0 / (K + S0);
      var gh = H * 0.62;
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:105, xl:"[S] (mmol/L)", yl:"v (µmol/min)", stepX:20, stepY:25, b:30, t:62});
      /* axe y fixe de 0 à 105 : v max possible = 100 */
      S.draw.fn(c, ax, function(x){ return vmax * x / (K + x); }, B4.pal.acc, 2.8);
      S.draw.line(c, ax.L, ax.Y(vmax), ax.R, ax.Y(vmax), B4.pal.red, 1.5, [6, 4]); B4.txt(c, "Vmax = " + vmax, ax.R - 4, ax.Y(vmax) - 9, B4.pal.red, 12, "right");
      S.draw.line(c, ax.X(K), ax.B, ax.X(K), ax.Y(vmax / 2), "#8a95a3", 1.2, [3, 3]); S.draw.line(c, ax.L, ax.Y(vmax / 2), ax.X(K), ax.Y(vmax / 2), "#8a95a3", 1.2, [3, 3]);
      B4.txt(c, "Km", ax.X(K), ax.B + 10, "#5f6b7a", 11);
      S.draw.line(c, ax.X(S0), ax.B, ax.X(S0), ax.Y(v), B4.pal.green, 1.5, [3, 3]); S.draw.dot(c, ax.X(S0), ax.Y(v), 7, B4.pal.green);
      /* enzymes : 10 molécules avec un site */
      var n = 10, y0 = 14; var filled = Math.round(occ * n);
      B4.txt(c, "Sites actifs occupés : " + filled + " sur " + n + " (illustration)", ax.L + 4, y0 - 4, B4.pal.ink, 12, "left");
      for (var i = 0; i < n; i++){ var x = ax.L + 24 + i * ((ax.R - ax.L - 40) / (n - 1)), y = y0 + 22; B4.rr(c, x - 11, y - 9, 22, 22, 6, "rgba(30,63,143,.25)", B4.pal.acc, 2); if (i < filled) S.draw.dot(c, x, y + 2, 6, B4.pal.green); else B4.rr(c, x - 4, y - 2, 8, 8, 2, "#fff", "#8a95a3", 1); }
      ro.set(0, S.fmt(v, 1) + " µmol/min"); ro.set(1, S.fmt(vmax, 0) + " µmol/min"); ro.set(2, S.fmt(occ * 100, 0) + " %"); ro.set(3, S.fmt(v / vmax * 100, 0) + " %");
      var need = 9 * K;
      var msg = S0 === 0 ? "Sans substrat, aucune réaction : v = 0." : S0 < K * 0.3 ? "[S] faible : vitesse presque proportionnelle à [S]. Beaucoup de sites actifs sont libres." : S0 < K * 3 ? "Zone de transition : la vitesse augmente de moins en moins vite." : "Plateau : presque tous les sites sont occupés ; ajouter du substrat n'accélère presque plus la réaction.";
      if (nt.el.dataset.defi) msg += " <b>Défi :</b> 90 % de Vmax exige [S] = 9 × Km = " + S.fmt(need, 0) + " mmol/L" + (need > 100 ? " (hors curseur : impossible avec ce Km)." : "") + (Math.abs(v / vmax - 0.9) < 0.015 ? " Tu y es !" : ".");
      nt.set(msg, v / vmax > 0.9 ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"b4-c04-inhib", ch:"c04", tag:"Inhibition · original",
  titre:"L'inhibiteur compétitif : un faux substrat",
  resume:"Un inhibiteur occupe le site actif : ajoute du substrat pour le chasser. Compare avec un inhibiteur non compétitif.",
  but:"Choisis le type d'inhibiteur, sa concentration, et fais varier [S]. Compare la vitesse avec et sans inhibiteur.",
  aRetenir:"Un inhibiteur compétitif ressemble au substrat et se fixe sur le site actif : K<sub>m</sub> apparent augmente (K<sub>m</sub>′ = K<sub>m</sub>(1 + [I]/K<sub>i</sub>)) mais V<sub>max</sub> reste le même ; un excès de substrat l'annule. Un inhibiteur non compétitif se fixe ailleurs : V<sub>max</sub> diminue et un excès de substrat n'y change rien.",
  piege:"Ne confonds pas inhibition compétitive (se règle en ajoutant du substrat) et dénaturation (l'enzyme est détruite, rien ne la rétablit). Modèle quantitatif simplifié : K<sub>m</sub> = 10 mmol/L.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var ty = k.seg("Type d'inhibiteur", [["c","Compétitif"],["n","Non compétitif"]], "c");
    var s = k.slider("Substrat [S]", 0, 100, 1, 20, "mmol/L");
    var I = k.slider("Inhibiteur [I]", 0, 50, 1, 20, "mmol/L");
    var ki = k.slider("Ki (petit Ki = inhibiteur puissant)", 2, 50, 1, 10, "mmol/L");
    var ro = k.readouts(["v sans inhibiteur", "v avec inhibiteur", "Inhibition", "Km apparent"]);
    var nt = k.note("", "");
    var KM = 10, VM = 100;
    function v0(x){ return VM * x / (KM + x); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, comp = ty.value === "c", ii = I.value, KI = ki.value, f = 1 + ii / KI;
      function vi(x){ return comp ? VM * x / (KM * f + x) : VM * x / ((KM + x) * f); }
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:105, xl:"[S] (mmol/L)", yl:"v (µmol/min)", stepX:20, stepY:25, t:80});
      S.draw.fn(c, ax, v0, B4.pal.green, 2.6); S.draw.fn(c, ax, vi, B4.pal.red, 2.6);
      B4.txt(c, "sans I", ax.X(88), ax.Y(v0(88)) - 10, B4.pal.green, 12); B4.txt(c, "avec I", ax.X(88), ax.Y(vi(88)) + 12, B4.pal.red, 12);
      var S0 = s.value; S.draw.line(c, ax.X(S0), ax.B, ax.X(S0), ax.Y(v0(S0)), "#8a95a3", 1, [3, 3]); S.draw.dot(c, ax.X(S0), ax.Y(v0(S0)), 5, B4.pal.green); S.draw.dot(c, ax.X(S0), ax.Y(vi(S0)), 6, B4.pal.red);
      /* illustration des sites */
      var n = 10, occS, occI;
      if (comp){ var den = 1 + S0 / KM + ii / KI; occS = S0 / KM / den; occI = ii / KI / den; }
      else { occS = S0 / (KM + S0); occI = ii / (ii + KI); }
      var nS = Math.round(occS * n), nI = Math.round(occI * n);
      B4.txt(c, comp ? "Même site : S (vert) et I (rouge) se disputent" : "I (rouge) fixé ailleurs : site déformé", 8, 12, B4.pal.ink, 12, "left");
      for (var i = 0; i < n; i++){
        var x = ax.L + 18 + i * ((ax.R - ax.L - 30) / (n - 1)), y = 44;
        B4.rr(c, x - 11, y - 11, 22, 22, 6, "rgba(30,63,143,.25)", B4.pal.acc, 2);
        if (comp){ if (i < nS) S.draw.dot(c, x, y, 6, B4.pal.green); else if (i < nS + nI) S.draw.dot(c, x, y, 6, B4.pal.red); else B4.rr(c, x - 4, y - 4, 8, 8, 2, "#fff", "#8a95a3", 1); }
        else { if (i < nS) S.draw.dot(c, x, y, 6, B4.pal.green); else B4.rr(c, x - 4, y - 4, 8, 8, 2, "#fff", "#8a95a3", 1); if (i < nI) S.draw.dot(c, x + 12, y - 12, 5, B4.pal.red); }
      }
      var a = v0(S0), b = vi(S0), inh = a > 0 ? (1 - b / a) * 100 : 0;
      ro.set(0, S.fmt(a, 1)); ro.set(1, S.fmt(b, 1)); ro.set(2, S.fmt(inh, 0) + " %"); ro.set(3, comp ? S.fmt(KM * f, 1) + " mmol/L" : S.fmt(KM, 0) + " mmol/L (inchangé)");
      var m1 = comp ? "À forte [S], le substrat chasse l'inhibiteur : l'inhibition tombe à " + S.fmt(inh, 0) + " % et le plateau (Vmax = 100) est retrouvé." : "Peu importe [S] : le plateau reste abaissé à " + S.fmt(VM / f, 0) + " au lieu de 100.";
      var inhNC = (1 - 1 / f) * 100;
      nt.set(ii === 0 ? "Sans inhibiteur, les deux courbes sont confondues." : comp ? (S0 > 5 * KM * f ? m1 : "À cette [S], l'inhibiteur occupe encore une bonne part des sites : inhibition de " + S.fmt(inh, 0) + " %. Augmente [S] pour le chasser.") : "Inhibiteur non compétitif : la vitesse est divisée par " + S.fmt(f, 2) + " (inhibition de " + S.fmt(inhNC, 0) + " %) quelle que soit [S]. " + m1, ii === 0 ? "" : comp ? (inh < 20 ? "ok" : "warn") : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c04-lactase", ch:"c04", tag:"Santé · original",
  titre:"Lactase et intolérance au lactose",
  resume:"Combien de lactose reste non digéré selon l'activité de la lactase et la quantité de lait bue ?",
  but:"Choisis le volume de lait, l'activité de la lactase de l'intestin et la dose de lactase ajoutée. Lis le lactose restant au bout de 2 heures.",
  aRetenir:"La lactase est une enzyme qui coupe le lactose en glucose et galactose, que l'intestin absorbe. Chez les personnes dont la lactase est peu active, le lactose non digéré arrive au côlon, où des bactéries le fermentent (gaz, ballonnements). L'enzyme n'est pas consommée : la même quantité de lactase digère tout le lactose, mais plus lentement.",
  piege:"Modèle illustratif : valeurs de vitesse et seuil de symptômes choisis pour la démonstration. Les symptômes varient beaucoup d'une personne à l'autre. Une intolérance au lactose n'est pas une allergie au lait.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var vol = k.slider("Lait bu", 50, 500, 50, 250, "mL");
    var act = k.slider("Activité de la lactase de l'intestin", 0, 100, 5, 10, "% de la normale");
    var dose = k.slider("Lactase ajoutée (comprimés)", 0, 5, 1, 0, "");
    var seuil = k.slider("Seuil de symptômes de la personne", 2, 15, 1, 6, "g non digérés");
    var ro = k.readouts(["Lactose bu", "Digéré en 2 h", "Reste au côlon", "Symptômes"]);
    var nt = k.note("", "");
    function course(m0, A){
      var vmax = 0.6 * A / 100, m = m0, pts = [[0, m]], dt = 0.5;
      for (var t = dt; t <= 120 + 1e-9; t += dt){ m -= vmax * m / (8 + m) * dt; if (m < 0) m = 0; if (Math.round(t) % 5 === 0 && Math.abs(t - Math.round(t)) < 1e-9) pts.push([t, m]); }
      return {pts:pts, end:m};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, m0 = vol.value * 4.8 / 100, A = act.value + dose.value * 30, r = course(m0, A), dig = m0 - r.end, glu = dig * 360 / 342;
      var ax = S.draw.axes(c, {x0:0, x1:120, y0:0, y1:25, xl:"t (min)", yl:"lactose (g)", stepX:20, stepY:5, t:34});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = B4.pal.red; ctx.lineWidth = 2.8; ctx.beginPath(); r.pts.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(p[1]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore();
      S.draw.line(c, ax.L, ax.Y(seuil.value), ax.R, ax.Y(seuil.value), "#8a95a3", 1.5, [5, 4]); B4.txt(c, "seuil de symptômes", ax.R - 4, ax.Y(seuil.value) - 9, "#5f6b7a", 12, "right");
      S.draw.dot(c, ax.X(120), ax.Y(r.end), 6, B4.pal.red);
      B4.txt(c, "lactose restant", ax.X(60), ax.Y(r.pts[12][1]) - 12, B4.pal.red, 12);
      /* molécules de lactase (nombre constant) */
      B4.txt(c, "Lactase non consommée", ax.L + 4, 14, B4.pal.acc, 12, "left");
      var bad = r.end > seuil.value;
      ro.set(0, S.fmt(m0, 1) + " g"); ro.set(1, S.fmt(dig, 1) + " g"); ro.set(2, S.fmt(r.end, 1) + " g"); ro.set(3, bad ? "probables" : "peu probables");
      nt.set((A === 0 ? "Aucune lactase active : tout le lactose arrive au côlon. " : "") + "Digéré : " + S.fmt(dig, 1) + " g de lactose, donnant ≈ " + S.fmt(glu, 1) + " g de glucose + galactose (masse conservée : le lactose gagne 1 molécule d'eau en se coupant). " + (bad ? "Reste " + S.fmt(r.end, 1) + " g, au-dessus du seuil : les bactéries du côlon le fermentent (gaz). Essaie moins de lait ou des comprimés de lactase." : "Le reste (" + S.fmt(r.end, 1) + " g) est sous le seuil de tolérance."), bad ? "warn" : "ok");
    });
  }
});
