/* Biologie 4e · chapitre 4 · Enzymes et catalyse biologique */
/* scène commune « enzymes en solution » (substrat, inhibiteurs) : le nombre de sites occupés suit le modèle de Michaelis */
var B4E = window.B4E = function(seed){
  var rr = B4.rng(seed || 5), E = [], sub = [], inh = [], prod = [], fly = [], made = 0;
  function free(list, n){ while (list.length < n) list.push({x:rr(), y:rr(), a:rr() * 6.28}); if (list.length > n) list.length = n; }
  return {
    made:function(){ return made; },
    update:function(dt, o){
      while (E.length < o.nE){ var i = E.length, cols = 5; E.push({x:0.14 + (i % cols) * 0.18 + (rr() - 0.5) * 0.04, y:0.14 + Math.floor(i / cols) * 0.235 + (rr() - 0.5) * 0.04, st:"f", t:0, allo:false, w:rr() * 6}); }
      if (E.length > o.nE) E.length = o.nE;
      var rows = Math.ceil(E.length / 5); E.forEach(function(e, i){ if (e.jy === undefined){ e.jy = (rr() - 0.5) * 0.05; e.jx = (rr() - 0.5) * 0.04; } var row = Math.floor(i / 5), inRow = Math.min(5, E.length - row * 5); e.x = 0.5 + ((i % 5) - (inRow - 1) / 2) * 0.18 + e.jx; e.y = 0.1 + (row + 0.5) / rows * 0.8 + e.jy; });
      E.forEach(function(e, i){ e.allo = i < (o.nAllo || 0); if (e.allo && e.st === "S" && !o.alloBinds){ e.st = "f"; } });
      free(sub, o.nS); free(inh, o.nI || 0);
      var act = E.filter(function(e){ return !e.allo || o.alloBinds; }), bS = act.filter(function(e){ return e.st === "S"; }).length, bI = E.filter(function(e){ return e.st === "I"; }).length;
      var guard = 0;
      while (bS > o.tS && guard++ < 40){ var e1 = act.filter(function(e){ return e.st === "S"; })[0]; e1.st = "f"; sub.push({x:e1.x - 0.04, y:e1.y, a:0}); bS--; }
      while (bI > (o.tI || 0) && guard++ < 80){ var e2 = E.filter(function(e){ return e.st === "I"; })[0]; e2.st = "f"; inh.push({x:e2.x - 0.04, y:e2.y, a:0}); bI--; }
      while (bS < o.tS && guard++ < 120){ var cand = act.filter(function(e){ return e.st === "f"; }); if (!cand.length) break; var e3 = cand[Math.floor(rr() * cand.length)]; e3.st = "S"; e3.t = -0.35; fly.push({k:"S", x:rr(), y:rr(), e:e3, t:0}); bS++; }
      while (bI < (o.tI || 0) && guard++ < 160){ var cand2 = E.filter(function(e){ return e.st === "f" && !e.allo; }); if (!cand2.length) break; var e4 = cand2[Math.floor(rr() * cand2.length)]; e4.st = "I"; fly.push({k:"I", x:rr(), y:rr(), e:e4, t:0}); bI++; }
      E.forEach(function(e){ e.w += dt; if (e.st === "S"){ e.t += dt; if (e.t >= o.tau){ e.st = "f"; made++; prod.push({x:e.x - 0.05, y:e.y, t:0, vx:-0.05 - rr() * 0.08, vy:(rr() - 0.5) * 0.1}); prod.push({x:e.x - 0.05, y:e.y + 0.02, t:0, vx:-0.04 - rr() * 0.08, vy:(rr() - 0.5) * 0.1}); } } });
      fly.forEach(function(f){ f.t += dt; }); fly = fly.filter(function(f){ return f.t < 0.35; });
      [sub, inh].forEach(function(L){ L.forEach(function(p){ p.a += (rr() - 0.5) * 2 * dt * 6; p.x += Math.cos(p.a) * dt * 0.06; p.y += Math.sin(p.a) * dt * 0.06; if (p.x < 0.02 || p.x > 0.98) p.a = Math.PI - p.a; if (p.y < 0.03 || p.y > 0.97) p.a = -p.a; p.x = Math.max(0.02, Math.min(0.98, p.x)); p.y = Math.max(0.03, Math.min(0.97, p.y)); }); });
      prod.forEach(function(p){ p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; }); prod = prod.filter(function(p){ return p.t < 1.6; });
    },
    draw:function(c, x0, y0, w, h, o){
      var S = SFA, ctx = c.ctx, P = S.draw.palette, X = function(u){ return x0 + u * w; }, Y = function(v){ return y0 + v * h; }, r = Math.min(w / 22, h / 9, 17);
      S.draw.rrect(c, x0, y0, w, h, 12); ctx.fillStyle = "#f3f8fd"; ctx.fill(); ctx.strokeStyle = "#d5e2f0"; ctx.lineWidth = 1; ctx.stroke();
      function subst(x, y, s, al){ ctx.save(); ctx.globalAlpha = al == null ? 1 : al; S.draw.rrect(c, x - s, y - s, 2 * s, 2 * s, s * 0.35); ctx.fillStyle = "#f4a259"; ctx.fill(); ctx.strokeStyle = "#a45c14"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
      function inhib(x, y, s){ ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s * 0.9, y); ctx.lineTo(x - s, y + s); ctx.closePath(); ctx.fillStyle = "#e05555"; ctx.fill(); ctx.strokeStyle = "#8f1d1d"; ctx.lineWidth = 1; ctx.stroke(); }
      sub.forEach(function(p){ subst(X(p.x), Y(p.y), r * 0.26); });
      if (!o.hideI) inh.forEach(function(p){ inhib(X(p.x), Y(p.y), r * 0.28); });
      prod.forEach(function(p){ var al = Math.max(0, 1 - p.t / 1.6); ctx.save(); ctx.globalAlpha = al; S.draw.dot(c, X(p.x), Y(p.y), r * 0.2, P.green); ctx.restore(); });
      E.forEach(function(e){
        var x = X(e.x), y = Y(e.y) + Math.sin(e.w * 1.3) * 2, closed = e.allo && !o.hideI;
        ctx.save(); ctx.translate(x, y);
        var g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r * 1.2); g.addColorStop(0, closed ? "#d6c9ef" : "#b79af0"); g.addColorStop(1, closed ? "#8f84a8" : "#6236c4");
        ctx.beginPath(); for (var q = 0; q <= 40; q++){ var a = q / 40 * 6.2832, rad = r, dd = Math.abs(((a + Math.PI) % 6.2832) - Math.PI); var notch = Math.abs(a - Math.PI) < 0.55 ? (1 - Math.abs(a - Math.PI) / 0.55) * r * (closed ? 0.15 : 0.55) : 0; var xx = Math.cos(a) * rad + notch, yy = Math.sin(a) * rad * (closed ? 1 + 0.08 * Math.sin(a * 3) : 1); q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#3f1f87"; ctx.lineWidth = 1.5; ctx.stroke();
        if (e.allo && !o.hideI){ ctx.beginPath(); ctx.moveTo(r * 0.75, -r * 0.3); ctx.lineTo(r * 1.25, -r * 0.05); ctx.lineTo(r * 0.75, r * 0.2); ctx.closePath(); ctx.fillStyle = "#e05555"; ctx.fill(); ctx.strokeStyle = "#8f1d1d"; ctx.stroke(); }
        ctx.restore();
        var fl = fly.filter(function(f){ return f.e === e; })[0];
        if (e.st === "S" && !fl){ var pr = Math.max(0, e.t) / o.tau; if (pr > 0.5) S.draw.glow(c, x - r * 0.55, y, r * 0.9, P.yellow, 0.6 * pr); subst(x - r * 0.5, y, r * 0.3); if (pr > 0.5){ S.draw.line(c, x - r * 0.5, y - r * 0.32, x - r * 0.5, y + r * 0.32, "#fff", 1.5); } }
        if (e.st === "I" && !fl && !o.hideI) inhib(x - r * 0.5, y, r * 0.32);
        if (fl && !(o.hideI && fl.k === "I")){ var u = B4.ease(fl.t / 0.35), fx = X(fl.x) + (x - r * 0.5 - X(fl.x)) * u, fy = Y(fl.y) + (y - Y(fl.y)) * u; if (fl.k === "S") subst(fx, fy, r * 0.28); else inhib(fx, fy, r * 0.3); }
      });
    }
  };
};
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
  resume:"Des enzymes en solution captent le substrat, le transforment et relâchent les produits. Ajoute du substrat : quand tous les sites actifs sont occupés, la vitesse plafonne.",
  but:"Glisse le point sur la courbe (ou règle [S]) : regarde les sites actifs se remplir et les produits sortir. Change la quantité d'enzyme et Km. Défis : atteindre 90 % de Vmax, obtenir une vitesse donnée avec le moins d'enzyme possible.",
  aRetenir:"v = V<sub>max</sub>·[S] ÷ (K<sub>m</sub> + [S]). À faible [S], v est presque proportionnelle à [S] ; à forte [S], tous les sites actifs sont occupés : v atteint un plateau V<sub>max</sub>, proportionnel à la quantité d'enzyme. K<sub>m</sub> est la [S] pour laquelle v = V<sub>max</sub>/2 ; l'enzyme ressort intacte de chaque réaction.",
  piege:"Doubler [S] ne double pas la vitesse (sauf à très faible [S]). Pour relever le plateau, il faut plus d'enzyme, pas plus de substrat. Animation : nombre de molécules réduit et vitesse de catalyse ralentie pour qu'on puisse suivre chaque réaction.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.05}); B4.adapt(c, 1.15, 0.86, 480);
    var s = k.slider("Substrat [S]", 0, 100, 1, 10, "mmol/L");
    var km = k.slider("Km (petit Km = forte affinité)", 1, 50, 1, 10, "mmol/L");
    var e = k.slider("Quantité d'enzyme", 1, 10, 1, 4, "unités");
    var ro = k.readouts(["Vitesse v", "V max", "Sites actifs occupés", "% de V max"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var sc = B4E(11), st = {drag:false, geo:{}, defi:null, score:0, tot:0, t:0, m0:0, rate:0, hist:[]};
    k.button("Défi : 90 % de Vmax", function(){ st.defi = {k:"90", done:false}; st.tot++; }, true);
    k.button("Défi : vitesse imposée", function(){ var X = [15, 25, 35, 45][Math.floor(Math.random() * 4)]; km.set([5, 10, 15][Math.floor(Math.random() * 3)]); e.set(10); st.defi = {k:"v", X:X, emin:Math.floor(X / 10) + 1, done:false}; st.tot++; });
    function model(){ var vmax = 10 * e.value, K = km.value, S0 = s.value; return {vmax:vmax, K:K, S0:S0, v:vmax * S0 / (K + S0), occ:S0 / (K + S0)}; }
    var lp = k.loop(function(dt){ var M = model(), nE = 2 * e.value; sc.update(dt, {nE:nE, nS:Math.min(50, Math.round(M.S0 * 0.5)), tS:Math.round(nE * M.occ), tau:1.2}); st.t += dt;
      if (st.t - (st.tl || 0) >= 1){ st.tl = st.t; st.hist.push(sc.made()); if (st.hist.length > 6) st.hist.shift(); } k.redraw(); });
    lp.play();
    c.pointer(function(type, p){ var a = st.geo.ax; if (!a) return;
      if (type === "down") st.drag = p.y >= a.T - 10 && p.y <= a.B + 12;
      if ((type === "down" || type === "drag") && st.drag){ s.set(Math.round(Math.max(0, Math.min(100, a.ix(p.x))))); k.redraw(); }
      if (type === "up") st.drag = false; });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, fs = wide ? 10.5 : 9.5, M = model(), sh = H * 0.46, nE = 2 * e.value, busy = Math.round(nE * M.occ);
      sc.draw(c, 6, 18, W - 12, sh - 24, {tau:1.2});
      S.draw.text(c, "Solution : " + nE + " enzymes, " + busy + " sites occupés", 8, 9, {size:fs, color:P.ink, align:"left"});
      var r6 = st.hist.length > 1 ? (st.hist[st.hist.length - 1] - st.hist[0]) / (st.hist.length - 1) : 0;
      S.draw.label(c, "≈ " + S.fmt(r6, 1) + " réaction/s à l'écran", W - 8, 9, {color:P.green, size:fs - 0.5, align:"right"});
      S.draw.text(c, "■ substrat  ● produit  enzyme = site actif à gauche", 10, sh + 2, {size:fs - 1, color:"#5f6b7a", align:"left", weight:600});
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:105, xl:"[S] (mmol/L) — glisse le point", yl:"v (µmol/min)", stepX:20, stepY:25, t:sh + 22, l:42, b:32});
      st.geo.ax = ax;
      S.draw.area(c, ax, function(x){ return M.vmax * x / (M.K + x); }, 0, M.S0, P.acc, 0.1);
      S.draw.fn(c, ax, function(x){ return M.vmax * x / (M.K + x); }, P.acc, 2.8);
      S.draw.line(c, ax.L, ax.Y(M.vmax), ax.R, ax.Y(M.vmax), P.red, 1.5, [6, 4]); S.draw.text(c, "Vmax = " + M.vmax, ax.R - 4, ax.Y(M.vmax) - 9, {size:10, color:P.red, align:"right"});
      S.draw.line(c, ax.X(M.K), ax.B, ax.X(M.K), ax.Y(M.vmax / 2), "#8a95a3", 1.2, [3, 3]); S.draw.line(c, ax.L, ax.Y(M.vmax / 2), ax.X(M.K), ax.Y(M.vmax / 2), "#8a95a3", 1.2, [3, 3]); S.draw.label(c, "Km", ax.X(M.K), ax.Y(M.vmax / 2) - 12, {color:"#5f6b7a", size:9.5});
      if (st.defi && st.defi.k === "v"){ S.draw.line(c, ax.L, ax.Y(st.defi.X), ax.R, ax.Y(st.defi.X), P.amber, 1.5, [2, 3]); }
      S.draw.line(c, ax.X(M.S0), ax.B, ax.X(M.S0), ax.Y(M.v), P.green, 1.4, [3, 3]); S.draw.dot(c, ax.X(M.S0), ax.Y(M.v), 8, st.drag ? P.red : P.green);
      ro.set(0, S.fmt(M.v, 1) + " µmol/min"); ro.set(1, S.fmt(M.vmax, 0) + " µmol/min"); ro.set(2, S.fmt(M.occ * 100, 0) + " %"); ro.set(3, S.fmt(M.occ * 100, 0) + " %");
      var msg = M.S0 === 0 ? "Sans substrat, aucune réaction : v = 0, tous les sites sont libres." : M.S0 < M.K * 0.3 ? "[S] faible : beaucoup de sites libres, la vitesse est presque proportionnelle à [S]." : M.S0 < M.K * 3 ? "Zone de transition : la vitesse augmente de moins en moins vite." : "Plateau : presque tous les sites sont occupés ; ajouter du substrat n'accélère presque plus. Seule plus d'enzyme relève le plateau.";
      nt.set(msg + " v = " + M.vmax + " × " + M.S0 + " ÷ (" + M.K + " + " + M.S0 + ") = " + S.fmt(M.v, 1) + " µmol/min.", M.occ > 0.9 ? "ok" : "");
      if (st.defi){ var d = st.defi, ok;
        if (d.k === "90"){ var need = 9 * M.K; ok = Math.abs(M.occ - 0.9) <= 0.01; if (ok && !d.done){ d.done = true; st.score++; }
          nd.set("<b>Défi.</b> Atteins 90 % de Vmax (à 1 % près). " + (d.done ? "<b>Réussi :</b> il faut [S] = 9 × Km = " + S.fmt(need, 0) + " mmol/L." : need > 100 ? "Avec ce Km, il faudrait " + S.fmt(need, 0) + " mmol/L : hors curseur, diminue Km." : "Indice : v/Vmax = [S] ÷ (Km + [S]).") + " Score : " + st.score + " / " + st.tot + ".", d.done ? "ok" : "warn"); }
        else { ok = Math.abs(M.v - d.X) <= 1 && e.value === d.emin; if (ok && !d.done){ d.done = true; st.score++; }
          nd.set("<b>Défi.</b> Obtiens v = " + d.X + " µmol/min (±1) avec le moins d'enzyme possible (Vmax = 10 par unité). " + (d.done ? "<b>Réussi : " + d.emin + " unités</b> (Vmax = " + d.emin * 10 + ", juste au-dessus de " + d.X + ")." : Math.abs(M.v - d.X) <= 1 ? "Bonne vitesse, mais peut-on prendre moins d'enzyme ?" : "Vitesse actuelle : " + S.fmt(M.v, 1) + ".") + " Score : " + st.score + " / " + st.tot + ".", d.done ? "ok" : "warn"); }
      } else nd.set("Choisis un défi : 90 % de Vmax, ou une vitesse imposée avec le moins d'enzyme.", "");
    });
  }
});

SFA.sim({
  id:"b4-c04-inhib", ch:"c04", tag:"Inhibition · original",
  titre:"L'inhibiteur compétitif : un faux substrat",
  resume:"Des inhibiteurs (triangles rouges) se fixent sur les enzymes : dans le site actif (compétitif) ou ailleurs (non compétitif). Ajoute du substrat et regarde qui gagne la place.",
  but:"Choisis le type d'inhibiteur, sa concentration et Ki, puis glisse le point sur la courbe pour changer [S]. Compare les deux courbes et la solution animée. Défi : un inhibiteur mystère — trouve son type en faisant varier [S].",
  aRetenir:"Un inhibiteur compétitif ressemble au substrat et se fixe sur le site actif : K<sub>m</sub> apparent augmente (K<sub>m</sub>′ = K<sub>m</sub>(1 + [I]/K<sub>i</sub>)) mais V<sub>max</sub> reste le même ; un excès de substrat le chasse. Un inhibiteur non compétitif se fixe ailleurs et déforme l'enzyme : V<sub>max</sub> diminue et un excès de substrat n'y change rien.",
  piege:"Ne confonds pas inhibition compétitive (se compense en ajoutant du substrat) et dénaturation (l'enzyme est détruite, rien ne la rétablit). Modèle quantitatif simplifié : K<sub>m</sub> = 10 mmol/L, V<sub>max</sub> = 100 µmol/min ; animation avec peu de molécules.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.05}); B4.adapt(c, 1.15, 0.86, 480);
    var ty = k.seg("Type d'inhibiteur", [["c","Compétitif"],["n","Non compétitif"]], "c", function(){ st.myst = null; });
    var s = k.slider("Substrat [S]", 0, 100, 1, 20, "mmol/L");
    var I = k.slider("Inhibiteur [I]", 0, 50, 1, 20, "mmol/L");
    var ki = k.slider("Ki (petit Ki = inhibiteur puissant)", 2, 50, 1, 10, "mmol/L");
    var ro = k.readouts(["v sans inhibiteur", "v avec inhibiteur", "Inhibition", "Km apparent"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var KM = 10, VM = 100, NE = 15, sc = B4E(23), st = {drag:false, geo:{}, myst:null, ans:null, score:0, tot:0};
    k.button("Défi : inhibiteur mystère", function(){ st.myst = Math.random() < 0.5 ? "c" : "n"; st.ans = null; st.tot++; I.set(20); ki.set(10); s.set(5); }, true);
    k.button("Je dis : compétitif", function(){ if (st.myst && !st.ans){ st.ans = "c"; if (st.myst === "c") st.score++; } });
    k.button("Je dis : non compétitif", function(){ if (st.myst && !st.ans){ st.ans = "n"; if (st.myst === "n") st.score++; } });
    function typ(){ return st.myst || ty.value; }
    function v0(x){ return VM * x / (KM + x); }
    function vi(x){ var f = 1 + I.value / ki.value; return typ() === "c" ? VM * x / (KM * f + x) : VM * x / ((KM + x) * f); }
    var lp = k.loop(function(dt){
      var S0 = s.value, ii = I.value, KI = ki.value, comp = typ() === "c", o = {nE:NE, nS:Math.min(40, Math.round(S0 * 0.4)), nI:Math.min(25, Math.round(ii * 0.5)), tau:1.1};
      if (comp){ var den = 1 + S0 / KM + ii / KI; o.tS = Math.round(NE * S0 / KM / den); o.tI = Math.round(NE * ii / KI / den); o.nAllo = 0; }
      else { var fI = ii / (ii + KI); o.nAllo = Math.round(NE * fI); o.tS = Math.round((NE - o.nAllo) * S0 / (KM + S0)); o.tI = 0; }
      sc.update(dt, o); k.redraw(); });
    lp.play();
    c.pointer(function(type, p){ var a = st.geo.ax; if (!a) return;
      if (type === "down") st.drag = p.y >= a.T - 10 && p.y <= a.B + 12;
      if ((type === "down" || type === "drag") && st.drag){ s.set(Math.round(Math.max(0, Math.min(100, a.ix(p.x))))); k.redraw(); }
      if (type === "up") st.drag = false; });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, fs = wide ? 10.5 : 9.5, sh = H * 0.46, comp = typ() === "c", hide = st.myst && !st.ans, f = 1 + I.value / ki.value, S0 = s.value;
      sc.draw(c, 6, 18, W - 12, sh - 24, {tau:1.1, hideI:hide});
      S.draw.text(c, hide ? "Inhibiteur mystère (invisible) : compte les enzymes qui travaillent" : comp ? "Compétitif : S (■) et I (▶) se disputent le site actif" : "Non compétitif : I (▶) se fixe ailleurs, le site se ferme", 8, 9, {size:fs, color:P.ink, align:"left"});
      S.draw.text(c, "■ substrat  ▶ inhibiteur  ● produit", 10, sh + 2, {size:fs - 1, color:"#5f6b7a", align:"left", weight:600});
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:105, xl:"[S] (mmol/L) — glisse le point", yl:"v (µmol/min)", stepX:20, stepY:25, t:sh + 22, l:42, b:32});
      st.geo.ax = ax;
      S.draw.fn(c, ax, v0, P.green, 2.6); S.draw.fn(c, ax, vi, P.red, 2.6);
      S.draw.text(c, "sans I", ax.X(90), ax.Y(v0(90)) - 10, {size:10, color:P.green}); S.draw.text(c, "avec I", ax.X(90), ax.Y(vi(90)) + 12, {size:10, color:P.red});
      S.draw.line(c, ax.X(S0), ax.B, ax.X(S0), ax.Y(v0(S0)), "#8a95a3", 1, [3, 3]); S.draw.dot(c, ax.X(S0), ax.Y(v0(S0)), 5.5, P.green); S.draw.dot(c, ax.X(S0), ax.Y(vi(S0)), 8, st.drag ? P.ink : P.red);
      var a = v0(S0), b = vi(S0), inh = a > 0 ? (1 - b / a) * 100 : 0;
      ro.set(0, S.fmt(a, 1)); ro.set(1, S.fmt(b, 1)); ro.set(2, S.fmt(inh, 0) + " %"); ro.set(3, hide ? "?" : comp ? S.fmt(KM * f, 1) + " mmol/L" : S.fmt(KM, 0) + " mmol/L (inchangé)");
      var m1 = comp ? "À forte [S], le substrat chasse l'inhibiteur : l'inhibition tombe à " + S.fmt(inh, 0) + " % et le plateau Vmax = 100 est retrouvé." : "Quelle que soit [S], le plateau reste abaissé à " + S.fmt(VM / f, 0) + " au lieu de 100 : les enzymes « fermées » ne travaillent plus.";
      nt.set(I.value === 0 ? "Sans inhibiteur, les deux courbes sont confondues." : hide ? "Inhibition à cette [S] : " + S.fmt(inh, 0) + " %. Fais varier [S] (glisse le point jusqu'à 100) et observe si l'inhibition disparaît." : comp ? (S0 > 5 * KM * f ? m1 : "À cette [S], l'inhibiteur occupe encore une bonne part des sites actifs : inhibition de " + S.fmt(inh, 0) + " %. Augmente [S] pour le chasser.") : "Inhibiteur non compétitif : vitesse divisée par " + S.fmt(f, 2) + " (inhibition de " + S.fmt((1 - 1 / f) * 100, 0) + " %) quelle que soit [S]. " + m1, I.value === 0 ? "" : comp && !hide ? (inh < 20 ? "ok" : "warn") : "warn");
      if (st.myst) nd.set("<b>Défi.</b> Inhibiteur mystère (invisible dans la solution, type masqué) : fais varier [S] et regarde si l'inhibition disparaît à forte [S]. " + (st.ans ? (st.ans === st.myst ? "<b>Exact !</b> " : "<b>Non.</b> ") + "C'était un inhibiteur " + (st.myst === "c" ? "compétitif : à forte [S], v rejoint la courbe sans inhibiteur." : "non compétitif : même à forte [S], le plateau reste abaissé.") : "") + " Score : " + st.score + " / " + st.tot + ".", st.ans ? (st.ans === st.myst ? "ok" : "warn") : "warn");
      else nd.set("Défi : clique « Défi : inhibiteur mystère » et identifie le type à partir des courbes.", "");
    });
  }
});

SFA.sim({
  id:"b4-c04-lactase", ch:"c04", tag:"Santé · original",
  titre:"Lactase et intolérance au lactose",
  resume:"Un verre de lait traverse l'intestin grêle : la lactase de la bordure en brosse coupe le lactose, le reste file au côlon où des bactéries le fermentent. Combien de lait peut-on boire ?",
  but:"Touche le verre pour choisir le volume de lait, la boîte pour ajouter des comprimés de lactase, puis « Boire ». Suis les molécules coupées et absorbées, et la courbe du lactose restant (glisse sur la courbe pour revoir un instant). Défi : trouve le volume maximal toléré.",
  aRetenir:"La lactase est une enzyme de la bordure en brosse de l'intestin grêle : elle coupe le lactose en glucose et galactose, absorbés vers le sang. Quand elle est peu active, le lactose non digéré arrive au côlon, où des bactéries le fermentent (gaz, ballonnements). L'enzyme n'est pas consommée : chaque molécule de lactase coupe des milliers de molécules de lactose, à une vitesse limitée.",
  piege:"Modèle illustratif : vitesse de la lactase et seuil de symptômes choisis pour la démonstration ; une icône = 0,5 g de lactose. Les symptômes varient beaucoup d'une personne à l'autre. Une intolérance au lactose n'est pas une allergie au lait.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.12}); B4.adapt(c, 1.32, 0.86, 480);
    var vol = k.slider("Lait bu", 50, 500, 50, 250, "mL", function(){ restart(false); });
    var act = k.slider("Activité de la lactase de l'intestin", 0, 100, 5, 10, "% de la normale", function(){ restart(false); });
    var dose = k.slider("Comprimés de lactase avalés avec le lait", 0, 5, 1, 0, "", function(){ restart(false); });
    var seuil = k.slider("Seuil de symptômes de la personne", 2, 15, 1, 6, "g non digérés");
    var ro = k.readouts(["Lactose bu", "Digéré (instant choisi)", "Reste au côlon à 2 h", "Symptômes"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var st = {t:0, run:false, icons:[], cut:0, parts:[], gas:[], defi:null, score:0, tot:0, geo:{}, drag:null}, rr = B4.rng(12);
    function A(){ return act.value + dose.value * 30; }
    function course(m0, a){ var vmax = 0.6 * a / 100, m = m0, pts = [[0, m]], dt = 0.5; for (var t = dt; t <= 120 + 1e-9; t += dt){ m -= vmax * m / (8 + m) * dt; if (m < 0) m = 0; pts.push([t, m]); } return pts; }
    var cur = null;
    function curve(){ var key = vol.value + "|" + A(); if (!cur || cur.key !== key){ cur = {key:key, pts:course(vol.value * 0.048, A())}; } return cur.pts; }
    function mAt(t){ var p = curve(), i = Math.max(0, Math.min(p.length - 1, Math.round(t / 0.5))); return p[i][1]; }
    function restart(play){
      var m0 = vol.value * 0.048, n = Math.round(m0 / 0.5); st.icons = []; st.parts = []; st.gas = []; st.cut = 0;
      for (var i = 0; i < n; i++){ var x0 = rr() * 0.22; st.icons.push({x:x0, x0:x0, y:0.15 + rr() * 0.7, a:rr() * 6.28, sp:0.85 + rr() * 0.3, alive:true}); }
      st.t = 0; st.run = !!play;
    }
    restart(true);
    k.button("▶ Boire le verre", function(){ restart(true); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ st.run = !st.run; });
    var DEF = function(){
      var a, s, ans, tries = 0;
      do { a = 5 * (1 + Math.floor(Math.random() * 8)); s = 3 + Math.floor(Math.random() * 8); ans = 0;
        for (var v = 50; v <= 500; v += 50){ var p = course(v * 0.048, a); if (p[p.length - 1][1] <= s) ans = v; }
        tries++; } while ((ans < 100 || ans > 450) && tries < 60);
      act.set(a); seuil.set(s); dose.set(0); restart(false);
      return {a:a, s:s, ans:ans, done:false, checked:false};
    };
    k.button("Défi : volume maximal", function(){ st.defi = DEF(); st.tot++; }, false);
    k.button("Vérifier ma réponse", function(){ if (!st.defi || st.defi.done) return; st.defi.checked = true; st.defi.last = vol.value; if (vol.value === st.defi.ans && dose.value === 0 && act.value === st.defi.a){ st.defi.done = true; st.score++; } });
    var lp = k.loop(function(dt){
      if (st.run){ st.t = Math.min(120, st.t + dt * 10); if (st.t >= 120) st.run = false; }
      var m0 = vol.value * 0.048, target = Math.round((m0 - mAt(st.t)) / 0.5), alive = st.icons.filter(function(o){ return o.alive; });
      /* déplacement dans l'intestin : de l'entrée (gauche) au côlon (droite) en 120 min */
      st.icons.forEach(function(o){ if (!o.alive) return; var goal = Math.min(1, st.t / 120) * 0.78 * o.sp + o.x0; o.x += (goal - o.x) * Math.min(1, dt * 3); o.a += dt * 0.8; });
      while (st.cut < target && alive.length){
        alive.sort(function(a, b){ return Math.abs(a.x - 0.5) - Math.abs(b.x - 0.5); });
        var o = alive.shift(); o.alive = false; st.cut++;
        st.parts.push({x:o.x, y:o.y, t:0});
      }
      st.parts.forEach(function(p){ p.t += dt; }); st.parts = st.parts.filter(function(p){ return p.t < 2.2; });
      var rest = mAt(120);
      if (st.t >= 100 && rest > 0.3 && rr() < dt * rest * 0.8) st.gas.push({x:rr(), y:1, v:0.25 + rr() * 0.3});
      st.gas.forEach(function(g){ g.y -= g.v * dt; }); st.gas = st.gas.filter(function(g){ return g.y > 0; });
      k.redraw();
    });
    lp.play();
    function lactose(x, y, r, a){ var dx = Math.cos(a) * r * 0.95, dy = Math.sin(a) * r * 0.95; S.draw.line(c, x - dx, y - dy, x + dx, y + dy, "#8a6d1a", 1.4); B4.hex(c, x - dx, y - dy, r, "#fbe7a1", "#8a6d1a", 1); B4.hex(c, x + dx, y + dy, r, "#f6b26b", "#8a4b12", 1); }
    function enzyme(x, y, r, col, open){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, -Math.PI / 2 + open, 1.5 * Math.PI - open); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#3f1f87"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
    c.pointer(function(type, p){
      var g = st.geo;
      if (type === "down"){
        st.drag = null;
        if (g.gl && p.x >= g.gl.x - 6 && p.x <= g.gl.x + g.gl.w + 6 && p.y >= g.gl.y - 10 && p.y <= g.gl.y + g.gl.h + 6) st.drag = "glass";
        else if (g.box && Math.hypot(p.x - g.box.x, p.y - g.box.y) < g.box.r){ dose.set((dose.value + 1) % 6); restart(false); k.redraw(); return; }
        else if (g.ax && p.y >= g.ax.T - 8 && p.y <= g.ax.B + 10) st.drag = "time";
      }
      if ((type === "down" || type === "drag") && st.drag === "glass"){ var f = (g.gl.y + g.gl.h - p.y) / g.gl.h; vol.set(Math.max(50, Math.min(500, Math.round(f * 500 / 50) * 50))); restart(false); }
      if ((type === "down" || type === "drag") && st.drag === "time"){ st.run = false; var tt = Math.max(0, Math.min(120, g.ax.ix(p.x))); if (tt < st.t - 0.5) { var keep = tt; restart(false); st.t = keep; } else st.t = tt; }
      if (type === "up") st.drag = null;
      k.redraw();
    });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480, sh = H * 0.55, m0 = vol.value * 0.048, a = A(), pts = curve(), end = pts[pts.length - 1][1], mt = mAt(st.t);
      /* verre de lait */
      var gw = Math.max(40, W * 0.12), gh = sh * 0.5, gx = 10, gy = sh * 0.3;
      st.geo.gl = {x:gx, y:gy, w:gw, h:gh};
      var lev = vol.value / 500, drunk = st.t > 0 ? Math.min(1, st.t / 8) : 0, lh = gh * lev * (1 - drunk);
      ctx.save(); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.lineTo(gx + gw * 0.88, gy + gh); ctx.lineTo(gx + gw * 0.12, gy + gh); ctx.closePath(); ctx.fillStyle = "rgba(230,240,250,.55)"; ctx.fill(); ctx.clip();
      ctx.fillStyle = "#fdfdf8"; ctx.fillRect(gx, gy + gh - lh, gw, lh); ctx.fillStyle = "rgba(220,225,232,.6)"; ctx.fillRect(gx, gy + gh - lh, gw, 2); ctx.restore();
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw * 0.12, gy + gh); ctx.lineTo(gx + gw * 0.88, gy + gh); ctx.lineTo(gx + gw, gy); ctx.strokeStyle = st.drag === "glass" ? P.red : "#8a95a3"; ctx.lineWidth = 2; ctx.stroke();
      for (var q = 1; q < 5; q++){ var yy = gy + gh - gh * q / 5; S.draw.line(c, gx + gw * 0.82, yy, gx + gw * 0.92, yy, "#8a95a3", 1); }
      S.draw.label(c, S.fmt(vol.value, 0) + " mL", gx + gw / 2, gy - 12, {color:P.ink, size:10.5});
      S.draw.text(c, "lait", gx + gw / 2, gy + gh + 11, {size:10, color:"#5f6b7a"});
      /* boîte de comprimés */
      var bxx = gx + gw / 2, byy = gy + gh + 34; st.geo.box = {x:bxx, y:byy, r:20};
      S.draw.rrect(c, bxx - 18, byy - 11, 36, 22, 6); ctx.fillStyle = "#e6f6f8"; ctx.fill(); ctx.strokeStyle = P.teal; ctx.lineWidth = 1.5; ctx.stroke();
      for (q = 0; q < 5; q++){ B4.ell(c, bxx - 13 + (q % 3) * 13, byy - 4 + Math.floor(q / 3) * 8, 4.5, 3, q < dose.value ? P.teal : "#fff", P.teal, 1); }
      S.draw.text(c, wide ? "comprimés (touche)" : "comprimés", wide ? bxx : 4, byy + 20, {size:8.5, color:P.teal, align:wide ? "center" : "left"});
      /* intestin grêle */
      var ix0 = gx + gw + 14, cw = Math.max(54, W * 0.17), ix1 = W - cw - 10, ly0 = sh * 0.14, ly1 = sh * 0.6, vy1 = sh * 0.86;
      S.draw.arrow(c, gx + gw + 2, gy + 8, ix0 + 4, gy + 8, "#8a95a3", 1.5);
      S.draw.rrect(c, ix0, ly0 - 8, ix1 - ix0, vy1 - ly0 + 16, 12); ctx.fillStyle = "#fff4ef"; ctx.fill();
      ctx.fillStyle = "#fdeee4"; ctx.fillRect(ix0, ly0, ix1 - ix0, ly1 - ly0);
      /* villosités */
      var nv = Math.max(5, Math.round((ix1 - ix0) / 34)), vw = (ix1 - ix0) / nv, enzPos = [];
      for (var i = 0; i < nv; i++){
        var vx = ix0 + i * vw + vw / 2, top = ly1 - (ly1 - ly0) * 0.38;
        ctx.beginPath(); ctx.moveTo(vx - vw * 0.42, vy1); ctx.lineTo(vx - vw * 0.42, top + vw * 0.38); ctx.arc(vx, top + vw * 0.38, vw * 0.42, Math.PI, 0); ctx.lineTo(vx + vw * 0.42, vy1); ctx.closePath();
        ctx.fillStyle = "#f6c6b8"; ctx.fill(); ctx.strokeStyle = "#c97b63"; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.save(); ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(vx - vw * 0.15, vy1); ctx.lineTo(vx - vw * 0.15, top + vw * 0.5); ctx.quadraticCurveTo(vx, top + vw * 0.2, vx + vw * 0.15, top + vw * 0.5); ctx.lineTo(vx + vw * 0.15, vy1); ctx.stroke(); ctx.restore();
        for (q = -3; q <= 3; q++){ var an = -Math.PI / 2 + q * 0.38; S.draw.line(c, vx + Math.cos(an) * vw * 0.42, top + vw * 0.38 + Math.sin(an) * vw * 0.42, vx + Math.cos(an) * vw * 0.52, top + vw * 0.38 + Math.sin(an) * vw * 0.52, "#c97b63", 1); }
        enzPos.push([vx, top - vw * 0.08]);
      }
      var nE = Math.round(enzPos.length * 2 * Math.min(1, act.value / 100)) + (act.value > 0 ? 1 : 0);
      for (i = 0; i < Math.min(nE, enzPos.length * 2); i++){ var ep = enzPos[i % enzPos.length], off = i >= enzPos.length ? -vw * 0.3 : vw * 0.22; enzyme(ep[0] + off, ep[1] + 4 + Math.abs(off) * 0.4, 4.5, "#8e6fdc", 0.5 + 0.2 * Math.sin(st.t + i)); }
      for (i = 0; i < dose.value * 2; i++){ enzyme(ix0 + 20 + ((i * 53 + st.t * 6) % (ix1 - ix0 - 40)), ly0 + 10 + (i * 17) % (ly1 - ly0 - 50), 4.5, "#3fb7c8", 0.55); }
      ctx.fillStyle = "rgba(192,50,29,.85)"; ctx.fillRect(ix0, vy1, ix1 - ix0, 4);
      S.draw.text(c, "sang → glucose + galactose absorbés", (ix0 + ix1) / 2, vy1 + 12, {size:wide ? 10 : 8.5, color:P.red});
      S.draw.label(c, "intestin grêle", ix0 + 6, ly0 - 1, {color:"#a35a44", size:wide ? 10 : 9, align:"left"});
      /* lactose qui circule */
      var X = function(u){ return ix0 + 10 + u * (ix1 - ix0 - 20); }, Y = function(v){ return ly0 + 8 + v * (ly1 - ly0 - (ly1 - ly0) * 0.4 - 10); };
      st.icons.forEach(function(o){ if (!o.alive) return; var x = st.t >= 119.5 ? null : X(Math.min(1, o.x)); if (x === null) return; lactose(x, Y(o.y), 4.4, o.a); });
      st.parts.forEach(function(p){ var u = Math.min(1, p.t / 2), x = X(p.x), y0 = Y(p.y), y1 = vy1 - 4, yy = y0 + (y1 - y0) * B4.ease(u), al = u > 0.85 ? (1 - u) / 0.15 : 1;
        ctx.save(); ctx.globalAlpha = al; if (u < 0.15) S.draw.glow(c, x, y0, 14, P.violet, 0.5); B4.hex(c, x - 5 - u * 4, yy, 4.2, "#fbe7a1", "#8a6d1a", 1); B4.hex(c, x + 5 + u * 4, yy, 4.2, "#f6b26b", "#8a4b12", 1); ctx.restore(); });
      /* côlon */
      var cx0 = ix1 + 4, cx1 = W - 8;
      S.draw.rrect(c, cx0, ly0 - 8, cx1 - cx0, vy1 - ly0 + 16, 14); ctx.fillStyle = "#efe6f6"; ctx.fill(); ctx.strokeStyle = "#8b6bb0"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.label(c, "côlon", (cx0 + cx1) / 2, ly0 + 4, {color:"#6b4a96", size:wide ? 10 : 9});
      var rb = B4.rng(4); for (i = 0; i < 9; i++){ var bx = cx0 + 8 + rb() * (cx1 - cx0 - 16), by = ly0 + 20 + rb() * (vy1 - ly0 - 30), ba = rb() * 3; ctx.save(); ctx.translate(bx, by); ctx.rotate(ba + Math.sin(st.t * 0.5 + i) * 0.2); S.draw.rrect(c, -5, -2, 10, 4, 2); ctx.fillStyle = "#a98bcf"; ctx.fill(); ctx.restore(); }
      var arrived = st.t >= 119.5 ? Math.round(end / 0.5) : 0;
      for (i = 0; i < Math.min(arrived, 30); i++) lactose(cx0 + 10 + (i % 4) * ((cx1 - cx0 - 20) / 3), vy1 - 8 - Math.floor(i / 4) * 11, 3.6, i);
      st.gas.forEach(function(g){ var x = cx0 + 6 + g.x * (cx1 - cx0 - 12), y = ly0 + 10 + g.y * (vy1 - ly0 - 20); B4.ell(c, x, y, 3.4, 3.4, "rgba(255,255,255,.85)", "#8b6bb0", 1); });
      if (st.t >= 119.5 && end > seuil.value) S.draw.label(c, "gaz !", (cx0 + cx1) / 2, ly0 + 22, {color:P.red, size:10});
      /* horloge */
      S.draw.label(c, "t = " + S.fmt(st.t, 0) + " min", W - 10, 10, {color:P.ink, size:10.5, align:"right"});
      S.draw.label(c, "▬ lactose = galactose + glucose", ix0, 10, {color:"#8a4b12", size:wide ? 10 : 8.5, align:"left"});
      /* courbe */
      var ymax = Math.max(8, Math.ceil((Math.max(m0, seuil.value) * 1.25 + 1) / 4) * 4);
      var ax = S.draw.axes(c, {x0:0, x1:120, y0:0, y1:ymax, xl:"t (min)", yl:"lactose restant dans l'intestin (g)", stepX:20, t:sh + 30, l:40, b:30});
      st.geo.ax = ax;
      S.draw.area(c, ax, function(t){ return mAt(t); }, 0, 120, P.amber, 0.1);
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = P.amber; ctx.lineWidth = 2.8; ctx.beginPath(); pts.forEach(function(p, j){ var x = ax.X(p[0]), y = ax.Y(p[1]); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
      S.draw.line(c, ax.L, ax.Y(seuil.value), ax.R, ax.Y(seuil.value), P.red, 1.5, [5, 4]); S.draw.label(c, "seuil de symptômes " + seuil.value + " g", ax.R - 4, ax.Y(seuil.value) - 10, {color:P.red, size:9.5, align:"right"});
      S.draw.line(c, ax.X(st.t), ax.T, ax.X(st.t), ax.B, P.ink, 1.3, [3, 3]); S.draw.dot(c, ax.X(st.t), ax.Y(mt), 7, P.amber);
      S.draw.dot(c, ax.X(120), ax.Y(end), 5, end > seuil.value ? P.red : P.green);
      var bad = end > seuil.value;
      ro.set(0, S.fmt(m0, 1) + " g"); ro.set(1, S.fmt(m0 - mt, 1) + " g à " + S.fmt(st.t, 0) + " min"); ro.set(2, S.fmt(end, 1) + " g"); ro.set(3, bad ? "probables" : "peu probables");
      nt.set("Lactase active : " + S.fmt(act.value, 0) + " %" + (dose.value ? " + " + dose.value + " comprimé" + (dose.value > 1 ? "s" : "") + " (≈ +" + dose.value * 30 + " %)" : "") + ". " + (a === 0 ? "Aucune lactase : tout le lactose file au côlon. " : "") + "En 2 h, " + S.fmt(m0 - end, 1) + " g coupés en glucose + galactose (absorbés), " + S.fmt(end, 1) + " g arrivent au côlon" + (bad ? " : au-dessus du seuil, les bactéries le fermentent (gaz, ballonnements). Moins de lait ou des comprimés de lactase aideraient." : " : sous le seuil de cette personne."), bad ? "warn" : "ok");
      if (st.defi){ var d = st.defi;
        nd.set("<b>Défi.</b> Lactase à " + d.a + " %, seuil " + d.s + " g, sans comprimé : quel est le plus grand volume (par pas de 50 mL) bu sans symptômes ? Règle le verre puis « Vérifier ». " + (d.done ? "<b>Réussi : " + d.ans + " mL.</b>" : d.checked ? (d.last < d.ans ? "Trop prudent : on peut boire plus que " + d.last + " mL." : d.last > d.ans ? d.last + " mL : trop, le seuil est dépassé." : "Garde lactase " + d.a + " % et 0 comprimé.") : "") + " Score : " + st.score + " / " + st.tot + ".", d.done ? "ok" : "warn");
      } else nd.set("Défi : clique « Défi : volume maximal » pour trouver combien de lait une personne peut boire.", "");
    });
  }
});
