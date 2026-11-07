(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI = Math.PI;
function piTxt(n){ if (n === 0) return "0"; if (n % 2 === 0){ var m = n / 2; return m === 1 ? "π" : m === -1 ? "−π" : String(m).replace("-", "−") + "π"; } return n === 1 ? "π/2" : n === -1 ? "−π/2" : String(n).replace("-", "−") + "π/2"; }
function toPi(x){ var r = x / PI, q = [1, 2, 3, 4, 6, 12], i; for (i = 0; i < q.length; i++){ var p = Math.round(r * q[i]); if (Math.abs(r * q[i] - p) < 1e-6){ if (p === 0) return "0"; var n = Math.abs(p), s = p < 0 ? "−" : ""; return s + (n === 1 ? "" : n) + "π" + (q[i] === 1 ? "" : "/" + q[i]); } } return F(x, 3) + " rad"; }
function piAxes(c, S, x0, x1, y0, y1, lab){
  var ax = S.draw.axes(c, {x0:x0, x1:x1, y0:y0, y1:y1, stepX:1000, stepY:1, xl:lab || "x", yl:"y", grid:true});
  var ctx = c.ctx, n; ctx.save(); ctx.font = "600 12px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (n = Math.ceil(x0 / (PI / 2)); n * PI / 2 <= x1 + 1e-9; n++){ var x = n * PI / 2; ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(ax.X(x), ax.T); ctx.lineTo(ax.X(x), ax.B); ctx.stroke(); if (n !== 0) ctx.fillText(piTxt(n), ax.X(x), Math.min(ax.B, ax.Y(0)) + 4); }
  ctx.restore(); return ax;
}
function sqAxes(c, R, step){ var L = 46, Rr = 16, T = 16, B = 34, ph = c.H - T - B, pw = c.W - L - Rr, hx = R * pw / ph; return SFA.draw.axes(c, {x0:-hx, x1:hx, y0:-R, y1:R, stepX:step, stepY:step, xl:"x", yl:"y"}); }
function circle(c, ax, r, col){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col || "#8a95a3"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(ax.X(0), ax.Y(0), Math.abs(ax.X(r) - ax.X(0)), Math.abs(ax.Y(r) - ax.Y(0)), 0, 0, 2 * PI); ctx.stroke(); ctx.restore(); }

/* 1. Sinusoïde paramétrée */
SFA.sim({
  id:"m5-c08-sinusoide", ch:"c08", tag:"Classique",
  titre:"La sinusoïde a·sin(bx + c) + d",
  resume:"Amplitude, période, déphasage, valeur moyenne : quatre curseurs, quatre effets.",
  but:"Glisse le point rouge (phase c, valeur moyenne d) et le point orange (amplitude a, fréquence b), ou modifie les curseurs, et observe ce qui change. En mode Défi, ajuste les quatre curseurs pour recouvrir la courbe grise.",
  aRetenir:"Amplitude |a| · période T = 2π/|b| · décalage horizontal −c/b (déphasage) · valeur moyenne d (la courbe oscille entre d − |a| et d + |a|). Un b plus grand resserre la courbe.",
  piege:"La période de sin(bx) est 2π/b, pas 2π·b. Et le décalage de sin(bx + c) est c/b vers la gauche, pas c.",
  build:function(k, S){
    var c = k.canvas(420);
    var mode = k.seg("Mode", [["L", "Libre"], ["D", "Défi"]], "L");
    var a = k.slider("a (amplitude)", -3, 3, 0.5, 2, ""), b = k.slider("b (fréquence)", 0.5, 4, 0.5, 1, ""), cc = k.slider("c (phase)", -3, 3, 0.5, 0, ""), d = k.slider("d (valeur moyenne)", -2, 2, 0.5, 0, "");
    var ro = k.readouts(["Amplitude |a|", "Période 2π/|b|", "Décalage −c/b", "Max / min"]);
    var nt = k.note("", "ok");
    var TG = {a:1.5, b:2, c:1, d:-1}, axs = null, dm = "";
    c.pointer(function(t, q){
      if (!axs) return; var A = a.value, B = b.value, x0 = -cc.value / B;
      if (t === "down"){
        var dc = Math.hypot(q.x - axs.X(x0), q.y - axs.Y(d.value)), dp = Math.hypot(q.x - axs.X(x0 + PI / (2 * B)), q.y - axs.Y(d.value + A));
        dm = Math.min(dc, dp) < 30 ? (dc <= dp ? "c" : "p") : "";
      }
      if ((t === "down" || t === "drag") && dm === "c"){ d.set(Math.round(axs.iy(q.y) * 2) / 2); cc.set(Math.max(-3, Math.min(3, Math.round(-axs.ix(q.x) * B * 2) / 2))); k.redraw(); }
      if ((t === "down" || t === "drag") && dm === "p"){ a.set(Math.round((axs.iy(q.y) - d.value) * 2) / 2); var dx = axs.ix(q.x) - x0; if (dx > 0.15) b.set(Math.max(0.5, Math.min(4, Math.round(PI / (2 * dx) * 2) / 2))); k.redraw(); }
      if (t === "up") dm = "";
    });
    k.draw(function(){
      c.clear(); var A = a.value, B = b.value, C = cc.value, D = d.value;
      var ax = axs = piAxes(c, S, -2 * PI, 2 * PI, -6, 6);
      if (mode.value === "D") S.draw.fn(c, ax, function(x){ return TG.a * Math.sin(TG.b * x + TG.c) + TG.d; }, "rgba(138,149,163,.55)", 6);
      S.draw.line(c, ax.L, ax.Y(D), ax.R, ax.Y(D), P.green, 1.2, [6, 5]);
      S.draw.line(c, ax.L, ax.Y(D + Math.abs(A)), ax.R, ax.Y(D + Math.abs(A)), P.light, 1.2, [3, 3]); S.draw.line(c, ax.L, ax.Y(D - Math.abs(A)), ax.R, ax.Y(D - Math.abs(A)), P.light, 1.2, [3, 3]);
      S.draw.fn(c, ax, function(x){ return A * Math.sin(B * x + C) + D; }, P.acc, 2.8);
      var x0 = -C / B, T = 2 * PI / Math.abs(B);
      S.draw.glow(c, ax.X(x0 + PI / (2 * B)), ax.Y(D + A), 14, P.amber, 0.45); S.draw.dot(c, ax.X(x0 + PI / (2 * B)), ax.Y(D + A), 6.5, P.amber);
      S.draw.dot(c, ax.X(x0), ax.Y(D), 6.5, P.red); S.draw.label(c, "↕↔ glisse", ax.X(x0) + 10, ax.Y(D) + 16, {color:P.red, align:"left", size:10.5});
      var ctx = c.ctx; ctx.strokeStyle = P.red; ctx.lineWidth = 2; var yb = ax.Y(D + Math.abs(A) + 0.4); ctx.beginPath(); ctx.moveTo(ax.X(x0), yb); ctx.lineTo(ax.X(x0 + T), yb); ctx.stroke();
      S.draw.text(c, "T = " + F(T, 2), ax.X(x0 + T / 2), yb - 10, {size:12, color:P.red});
      ro.set(0, F(Math.abs(A), 2)); ro.set(1, F(T, 3) + " (= " + toPi(T) + ")"); ro.set(2, F(x0, 3)); ro.set(3, F(D + Math.abs(A), 2) + " / " + F(D - Math.abs(A), 2));
      if (mode.value === "D"){ var okc = [A === TG.a, B === TG.b, C === TG.c, D === TG.d], n = okc.filter(Boolean).length; nt.set(n === 4 ? "<b>Bravo : la courbe recouvre la cible.</b>" : n + " paramètre(s) sur 4 juste(s). Indices : la cible oscille entre −2,5 et 0,5 ; elle fait 2 périodes de T entre 0 et 2π.", n === 4 ? "ok" : "warn"); }
      else nt.set("f(x) = " + F(A, 1) + "·sin(" + F(B, 1) + "x " + (C < 0 ? "− " : "+ ") + F(Math.abs(C), 1) + ") " + (D < 0 ? "− " : "+ ") + F(Math.abs(D), 1) + ". La courbe passe par sa valeur moyenne (point rouge) en x = −c/b = " + F(x0, 2) + " et recommence après T = 2π/" + F(Math.abs(B), 1) + " = " + F(T, 2) + "." + (A < 0 ? " a < 0 : la courbe est retournée (elle commence en descendant)." : ""), "ok");
    });
  }
});

/* 2. Addition d'ondes et battements */
SFA.sim({
  id:"m5-c08-ondes", ch:"c08", tag:"Niche utile",
  titre:"Deux ondes qui s'additionnent : les battements",
  resume:"Deux notes presque identiques : le son enfle et faiblit. C'est l'accordage de la guitare.",
  but:"Choisis f₁ et f₂. Rapproche-les : la somme (en bas) dessine une enveloppe qui bat. Quand f₁ = f₂, le battement disparaît.",
  aRetenir:"sin(2πf₁t) + sin(2πf₂t) = 2·cos(π(f₁ − f₂)t)·sin(π(f₁ + f₂)t). Le facteur cos donne l'enveloppe lente : la fréquence de battement vaut |f₁ − f₂|. Accorder une corde, c'est faire disparaître ce battement.",
  piege:"Additionner deux sinusoïdes de fréquences différentes ne donne pas une sinusoïde de fréquence f₁ + f₂ : la somme n'est pas périodique à f₁ + f₂, l'enveloppe se module.",
  build:function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(240);
    var f1 = k.slider("f₁", 2, 12, 0.5, 8, "Hz"), f2 = k.slider("f₂", 2, 12, 0.5, 9, "Hz");
    var a1 = k.slider("A₁", 0.5, 1.5, 0.5, 1, ""), a2 = k.slider("A₂", 0.5, 1.5, 0.5, 1, "");
    var ro = k.readouts(["Fréquence de battement", "Période de battement", "Amplitude max", "Amplitude min"]);
    var nt = k.note("", "ok");
    c1.pointer(function(t, q){ if (t === "up") return; var fr = Math.max(0, Math.min(1, (q.x - 46) / (c1.W - 62))); f2.set(Math.max(2, Math.min(12, Math.round((2 + fr * 10) * 2) / 2))); k.redraw(); });
    k.draw(function(){
      c1.clear(); c2.clear(); var F1 = f1.value, F2 = f2.value, A1 = a1.value, A2 = a2.value, df = Math.abs(F1 - F2);
      var w1 = function(t){ return A1 * Math.sin(2 * PI * F1 * t); }, w2 = function(t){ return A2 * Math.sin(2 * PI * F2 * t); }, sm = function(t){ return w1(t) + w2(t); };
      var env = function(t){ return Math.sqrt(Math.max(0, A1*A1 + A2*A2 + 2*A1*A2*Math.cos(2 * PI * (F1 - F2) * t))); };
      var ax1 = S.draw.axes(c1, {x0:0, x1:2, y0:-1.7, y1:1.7, stepX:0.5, stepY:1, b:30});
      S.draw.fn(c1, ax1, w1, P.acc, 2); S.draw.fn(c1, ax1, w2, P.red, 2);
      var ax2 = S.draw.axes(c2, {x0:0, x1:2, y0:-3.3, y1:3.3, stepX:0.5, stepY:1, b:30});
      S.draw.fn(c2, ax2, env, P.green, 1.4, [5, 4]); S.draw.fn(c2, ax2, function(t){ return -env(t); }, P.green, 1.4, [5, 4]);
      S.draw.fn(c2, ax2, sm, P.violet, 1.8);
      S.draw.legend(c1, [[P.acc, "f₁ = " + F(F1, 1) + " Hz"], [P.red, "f₂ = " + F(F2, 1) + " Hz (glisse ↔)"]], ax1.R - 4, ax1.T + 2, {align:"right"});
      S.draw.legend(c2, [[P.violet, "somme"], [P.green, "enveloppe", [5, 4]]], ax2.R - 4, ax2.T + 2, {align:"right"});
      if (df === 0) S.draw.label(c2, "accordé : plus de battement", ax2.L + 10, ax2.T + 14, {color:P.green, align:"left"});
      ro.set(0, F(df, 2) + " Hz"); ro.set(1, df === 0 ? "pas de battement" : F(1 / df, 2) + " s"); ro.set(2, F(A1 + A2, 2)); ro.set(3, F(Math.abs(A1 - A2), 2));
      nt.set(df === 0 ? "f₁ = f₂ : les deux ondes sont en phase, la somme est une sinusoïde d'amplitude A₁ + A₂ = " + F(A1 + A2, 1) + ", sans battement." : "L'enveloppe passe d'un maximum (A₁ + A₂ = " + F(A1 + A2, 1) + ") à un minimum (|A₁ − A₂| = " + F(Math.abs(A1 - A2), 1) + ") avec la période " + F(1 / df, 2) + " s : " + F(df, 2) + " battement(s) par seconde.", "ok");
    });
  }
});

/* 3. sin(a + b) sur le cercle */
SFA.sim({
  id:"m5-c08-addition-cercle", ch:"c08", tag:"Géométrie",
  titre:"La formule d'addition sur le cercle trigonométrique",
  resume:"B = cos b·(vecteur de A) + sin b·(vecteur perpendiculaire) : d'où sin(a + b) et cos(a + b).",
  but:"Choisis a et b. Le point B est à l'angle a + b. Suis le chemin : O → P (cos b fois OA) puis P → B (sin b fois le vecteur perpendiculaire). Active « b = a » pour la duplication.",
  aRetenir:"sin(a + b) = sin a cos b + cos a sin b · cos(a + b) = cos a cos b − sin a sin b. Duplication (b = a) : sin 2a = 2 sin a cos a, cos 2a = cos²a − sin²a = 1 − 2sin²a = 2cos²a − 1.",
  piege:"sin(a + b) ≠ sin a + sin b : pour a = b = 90°, sin(a + b) = sin 180° = 0 alors que sin a + sin b = 2. Et sin 2a ≠ 2 sin a.",
  build:function(k, S){
    var c = k.canvas(430);
    var a = k.slider("a", 0, 180, 5, 50, "°"), b = k.slider("b", 0, 180, 5, 35, "°");
    var dup = k.toggle("b = a (formules de duplication)", false);
    var ro = k.readouts(["sin(a + b) directement", "sin a cos b + cos a sin b", "sin a + sin b (FAUX)", "cos(a + b)"]);
    var nt = k.note("", "ok"), axc = null, pa = [0, 0], pb = [0, 0], which = "";
    c.pointer(function(t, p){ if (!axc) return;
      if (t === "down"){ var da = Math.hypot(p.x - pa[0], p.y - pa[1]), db = Math.hypot(p.x - pb[0], p.y - pb[1]); which = Math.min(da, db) > 40 ? "" : (da <= db ? "a" : "b"); }
      if ((t === "down" || t === "drag") && which){ var ang = Math.atan2(axc.iy(p.y), axc.ix(p.x)) * 180 / PI; if (ang < 0) ang += 360;
        if (which === "a"){ a.set(Math.max(0, Math.min(180, Math.round(ang / 5) * 5))); }
        else if (!dup.value){ var bv = ang - a.value; if (bv < 0) bv += 360; if (bv > 180) bv = bv > 270 ? 0 : 180; b.set(Math.round(bv / 5) * 5); }
        k.redraw(); }
      if (t === "up") which = ""; });
    k.draw(function(){
      c.clear(); var A = a.value * PI / 180, B = (dup.value ? a.value : b.value) * PI / 180;
      var ax = axc = sqAxes(c, 1.35, 0.5); circle(c, ax, 1);
      var u = [Math.cos(A), Math.sin(A)], v = [-Math.sin(A), Math.cos(A)], p1 = [Math.cos(B) * u[0], Math.cos(B) * u[1]], bb = [p1[0] + Math.sin(B) * v[0], p1[1] + Math.sin(B) * v[1]];
      S.draw.arrow(c, ax.X(0), ax.Y(0), ax.X(u[0]), ax.Y(u[1]), P.red, 2.2);
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(p1[0]), ax.Y(p1[1]), P.amber, 4);
      S.draw.line(c, ax.X(p1[0]), ax.Y(p1[1]), ax.X(bb[0]), ax.Y(bb[1]), P.violet, 4);
      S.draw.arrow(c, ax.X(0), ax.Y(0), ax.X(bb[0]), ax.Y(bb[1]), P.acc, 2.4);
      S.draw.line(c, ax.X(bb[0]), ax.Y(bb[1]), ax.X(bb[0]), ax.Y(0), P.acc, 1.2, [3, 3]); S.draw.line(c, ax.X(bb[0]), ax.Y(0), ax.X(0), ax.Y(0), P.acc, 1.2, [3, 3]);
      pa = [ax.X(u[0]), ax.Y(u[1])]; pb = [ax.X(bb[0]), ax.Y(bb[1])]; S.draw.glow(c, pa[0], pa[1], 14, P.red, 0.4); S.draw.glow(c, pb[0], pb[1], 14, P.acc, 0.4); S.draw.dot(c, pa[0], pa[1], 7, P.red); S.draw.dot(c, pb[0], pb[1], 7, P.acc);
      S.draw.text(c, "A (angle a)", ax.X(u[0]) + 8, ax.Y(u[1]) + 14, {align:"left", size:12, color:P.red}); S.draw.text(c, "B (angle a + b)", ax.X(bb[0]) - 8, ax.Y(bb[1]) - 12, {align:"right", size:12, color:P.acc});
      var direct = Math.sin(A + B), formula = Math.sin(A) * Math.cos(B) + Math.cos(A) * Math.sin(B), faux = Math.sin(A) + Math.sin(B);
      ro.set(0, F(direct, 4)); ro.set(1, F(formula, 4)); ro.set(2, F(faux, 4)); ro.set(3, F(Math.cos(A + B), 4));
      nt.set("a + b = " + F((A + B) * 180 / PI, 0) + "°. Orange : cos b·OA (longueur " + F(Math.cos(B), 3) + "). Violet : sin b·(vecteur perpendiculaire) (longueur " + F(Math.sin(B), 3) + "). Ordonnée de B = sin a·cos b + cos a·sin b = " + F(formula, 4) + ", égale à sin(a + b)." + (Math.abs(faux - direct) > 1e-3 ? " La « formule » sin a + sin b donne " + F(faux, 3) + " : fausse." : ""), "ok");
    });
  }
});

/* 4. Équations trigonométriques */
SFA.sim({
  id:"m5-c08-equation", ch:"c08", tag:"Classique",
  titre:"Résoudre sin x = k, cos x = k, tan x = k",
  resume:"Sur le cercle et sur la courbe : toutes les solutions apparaissent.",
  but:"Choisis la fonction et la valeur de k. Compte les points du cercle et les intersections avec la courbe sur [−2π ; 2π].",
  aRetenir:"sin x = k : x = α + 2nπ ou x = π − α + 2nπ (α = arcsin k). cos x = k : x = ±α + 2nπ. tan x = k : x = α + nπ. Il y a une infinité de solutions, qu'on donne en précisant l'intervalle demandé.",
  piege:"La calculatrice ne donne qu'une solution (α). Oublier π − α pour le sinus, ou −α pour le cosinus, fait perdre la moitié des solutions.",
  build:function(k, S){
    var c1 = k.canvas(260), c2 = k.canvas(250);
    var fn = k.seg("Fonction", [["s", "sin x = k"], ["c", "cos x = k"], ["t", "tan x = k"]], "s");
    var kk = k.slider("k", -1.5, 1.5, 0.05, 0.5, "");
    var ro = k.readouts(["α (valeur principale)", "Solutions dans [0 ; 2π["]);
    var nt = k.note("", "ok"), A1 = null, A2 = null;
    function setK(v){ kk.set(Math.round(Math.max(-1.5, Math.min(1.5, v)) * 20) / 20); k.redraw(); }
    c1.pointer(function(t, p){ if ((t === "down" || t === "drag") && A1){ if (fn.value === "s") setK(A1.iy(p.y)); else if (fn.value === "c") setK(A1.ix(p.x)); else setK(A1.iy(p.y)); } });
    c2.pointer(function(t, p){ if ((t === "down" || t === "drag") && A2) setK(A2.iy(p.y)); });
    k.draw(function(){
      c1.clear(); c2.clear(); var K = kk.value, t = fn.value, sols = [], alpha, i;
      var ok = t === "t" || Math.abs(K) <= 1 + 1e-12;
      if (ok){ if (t === "s"){ alpha = Math.asin(Math.max(-1, Math.min(1, K))); sols = [alpha, PI - alpha]; } else if (t === "c"){ alpha = Math.acos(Math.max(-1, Math.min(1, K))); sols = [alpha, -alpha]; } else { alpha = Math.atan(K); sols = [alpha, alpha + PI]; } }
      var norm = function(x){ x = x % (2 * PI); return x < 0 ? x + 2 * PI : x; };
      var base = ok ? sols.map(norm).sort(function(p, q){ return p - q; }).filter(function(v, j, arr){ return j === 0 || Math.abs(v - arr[j - 1]) > 1e-9; }) : [];
      var ax1 = A1 = sqAxes(c1, 1.4, 0.5); circle(c1, ax1, 1);
      if (t === "s") S.draw.line(c1, ax1.L, ax1.Y(K), ax1.R, ax1.Y(K), P.amber, 1.6, [5, 4]); else if (t === "c") S.draw.line(c1, ax1.X(K), ax1.T, ax1.X(K), ax1.B, P.amber, 1.6, [5, 4]);
      else { S.draw.line(c1, ax1.X(1), ax1.T, ax1.X(1), ax1.B, P.light, 1.4); c1.ctx.save(); c1.ctx.beginPath(); c1.ctx.rect(ax1.L, ax1.T, ax1.R - ax1.L, ax1.B - ax1.T); c1.ctx.clip(); S.draw.line(c1, ax1.X(-3), ax1.Y(-3 * K), ax1.X(3), ax1.Y(3 * K), P.amber, 1.6, [5, 4]); c1.ctx.restore(); S.draw.dot(c1, ax1.X(1), ax1.Y(K), 5, P.amber); }
      base.forEach(function(x){ S.draw.line(c1, ax1.X(0), ax1.Y(0), ax1.X(Math.cos(x)), ax1.Y(Math.sin(x)), P.light, 1.2); S.draw.dot(c1, ax1.X(Math.cos(x)), ax1.Y(Math.sin(x)), 6, P.red); });
      var fun = t === "s" ? Math.sin : t === "c" ? Math.cos : Math.tan, ya = t === "t" ? 4 : 1.6;
      var ax2 = A2 = piAxes(c2, S, -2 * PI, 2 * PI, -ya, ya, "x");
      S.draw.fn(c2, ax2, fun, P.acc, 2.6); S.draw.line(c2, ax2.L, ax2.Y(K), ax2.R, ax2.Y(K), P.amber, 1.6, [5, 4]);
      var cnt = 0; if (ok) for (var n = -2; n <= 2; n++){ sols.forEach(function(s0){ var x = s0 + (t === "t" ? PI : 2 * PI) * n; if (x >= -2 * PI - 1e-9 && x <= 2 * PI + 1e-9){ S.draw.dot(c2, ax2.X(x), ax2.Y(K), 5, P.red); } }); }
      var base2 = base.map(toPi);
      ro.set(0, ok ? toPi(alpha) + " (" + F(alpha, 3) + ")" : "aucune"); ro.set(1, ok ? base.length + " : " + base2.join(" ; ") : "0");
      var gen = t === "s" ? "x = " + toPi(alpha) + " + 2nπ ou x = " + toPi(PI - alpha) + " + 2nπ" : t === "c" ? "x = ±" + toPi(alpha) + " + 2nπ" : "x = " + toPi(alpha) + " + nπ";
      nt.set(ok ? "Solutions générales (n entier relatif) : <b>" + gen + "</b>." + (t !== "t" && Math.abs(Math.abs(K) - 1) < 1e-9 ? " Cas limite |k| = 1 : une seule solution par tour." : "") : "|k| > 1 : la droite ne coupe jamais la courbe, sin et cos restent entre −1 et 1. <b>Aucune solution.</b>", ok ? "ok" : "warn");
    });
  }
});
})();
