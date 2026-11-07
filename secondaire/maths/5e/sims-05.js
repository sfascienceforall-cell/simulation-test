(function(){
var P = SFA.draw.palette, F = SFA.fmt;
/*@@H:m5-c05-regles*/
function rgTiles(c, S, y, items, w){
  /* items : [[etiquette, valeur, couleur]] ou "op" (chaîne) ; tuiles de calcul alignées */
  var P = S.draw.palette, nT = items.filter(function(i){ return typeof i !== "string"; }).length, nO = items.length - nT, pad = 8;
  var opw = 15, tw = Math.min(86, (w - 2 * pad - nO * opw) / nT), x = pad + (w - 2 * pad - nO * opw - nT * tw) / 2;
  items.forEach(function(it){
    if (typeof it === "string"){ S.draw.text(c, it, x + opw / 2, y + 22, {size:15, color:P.grey}); x += opw; return; }
    S.draw.panel(c, x, y, tw, 46, {fill:S.draw.tint(it[2], 0.08), stroke:S.draw.tint(it[2], 0.6), radius:9, shadow:false});
    S.draw.text(c, it[0], x + tw / 2, y + 12, {size:11, color:it[2], weight:800, math:true});
    S.draw.text(c, it[1], x + tw / 2, y + 31, {size:tw < 56 ? 12 : 14, color:P.ink, mono:true, weight:600});
    x += tw;
  });
}
/*@@E:m5-c05-regles*/
function line(c, ax, x0, y0, m, col, dash, w){ var L = ax.x0, R = ax.x1; SFA.draw.line(c, ax.X(L), ax.Y(y0 + m * (L - x0)), ax.X(R), ax.Y(y0 + m * (R - x0)), col, w || 2, dash); }
function clipped(c, ax, fn){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); fn(); ctx.restore(); }

/* 1. Sécante -> tangente */
var FN = {
  a:{n:"f(x) = x²", f:function(x){ return x*x; }, d:function(x){ return 2*x; }, lo:-2, hi:2, a:1, w:[-3, 3, -1, 9]},
  b:{n:"f(x) = x³ − 2x", f:function(x){ return x*x*x - 2*x; }, d:function(x){ return 3*x*x - 2; }, lo:-2, hi:2, a:1, w:[-3, 3, -6, 6]},
  c:{n:"f(x) = 1/x", f:function(x){ return 1/x; }, d:function(x){ return -1/(x*x); }, lo:2.1, hi:5, a:3, w:[0, 7, -1, 4]},
  d:{n:"f(x) = √x", f:function(x){ return Math.sqrt(x); }, d:function(x){ return 0.5/Math.sqrt(x); }, lo:2.1, hi:6, a:3, w:[0, 8, -0.5, 3.5]}
};
SFA.sim({
  id:"m5-c05-secante", ch:"c05", tag:"Classique",
  titre:"La sécante devient tangente",
  resume:"Rapproche le deuxième point : la pente de la sécante tend vers f′(a).",
  but:"Fixe a, puis fais diminuer h : regarde la sécante (rouge) se coucher sur la tangente (verte) et le taux d'accroissement tendre vers f′(a).",
  aRetenir:"Le taux d'accroissement (f(a + h) − f(a))/h est la pente de la sécante. Sa limite quand h → 0 est le nombre dérivé f′(a), pente de la tangente : f′(a) = lim (f(a + h) − f(a))/h.",
  piege:"Sécante ≠ tangente : la tangente est la position limite des sécantes. Et le nombre dérivé est la pente de la tangente, pas la valeur f(a).",
  build:function(k, S){
    var c = k.canvas(430);
    var sel = k.select("Fonction", Object.keys(FN).map(function(q){ return [q, FN[q].n]; }), "a", function(){ var d = FN[sel.value]; a.el.min = d.lo; a.el.max = d.hi; a.set(d.a); });
    var a = k.slider("a", -2, 2, 0.1, 1, "");
    var z = k.slider("Rapprochement z (h = 10^−z)", -0.3, 3, 0.1, 0, "");
    var sg = k.seg("Côté du 2e point", [["1", "À droite (h > 0)"], ["-1", "À gauche (h < 0)"]], "1");
    var ro = k.readouts(["h", "Pente de la sécante", "f′(a) (tangente)", "Écart"]);
    var nt = k.note("", "ok"), axs = null;
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && axs){ var h = axs.ix(p.x) - a.value; if (Math.abs(h) < 1e-3) h = 1e-3; sg.set(h > 0 ? "1" : "-1"); z.set(Math.max(-0.3, Math.min(3, -Math.log10(Math.abs(h))))); k.redraw(); } });
    k.draw(function(){
      var d = FN[sel.value], w = d.w; c.clear();
      var ax = axs = S.draw.axes(c, {x0:w[0], x1:w[1], y0:w[2], y1:w[3], xl:"x", yl:"y"});
      var A = a.value, h = Number(sg.value) * Math.pow(10, -z.value), B = A + h;
      S.draw.fn(c, ax, d.f, P.acc, 2.6);
      var fa = d.f(A), fb = d.f(B);
      if (!isFinite(fb) || !isFinite(fa)){ nt.set("a + h sort du domaine de f : choisis une autre valeur.", "warn"); return; }
      var slope = (fb - fa) / h, t = d.d(A);
      clipped(c, ax, function(){ line(c, ax, A, fa, t, P.green, [6, 5], 2); line(c, ax, A, fa, slope, P.red, null, 2); });
      S.draw.dot(c, ax.X(A), ax.Y(fa), 6, P.acc); S.draw.glow(c, ax.X(B), ax.Y(fb), 16, P.red, 0.4); S.draw.dot(c, ax.X(B), ax.Y(fb), 7, P.red); S.draw.label(c, "↔ glisse B vers A", ax.X(B) + (ax.X(B) > ax.R - 140 ? -12 : 12), ax.Y(fb) + 22, {color:P.red, align:ax.X(B) > ax.R - 140 ? "right" : "left", size:11});
      S.draw.text(c, "A", ax.X(A) - 10, ax.Y(fa) - 10, {color:P.acc}); S.draw.text(c, "B", ax.X(B) + 10, ax.Y(fb) - 10, {color:P.red});
      ro.set(0, F(h, 4)); ro.set(1, F(slope, 4)); ro.set(2, F(t, 4)); ro.set(3, F(slope - t, 4));
      nt.set("Sécante AB : pente (f(" + F(B, 3) + ") − f(" + F(A, 2) + ")) / " + F(h, 4) + " = <b>" + F(slope, 4) + "</b>. Tangente : f′(" + F(A, 2) + ") = <b>" + F(t, 4) + "</b>. Équation de la tangente : y = " + F(t, 3) + "·(" + (A === 0 ? "x" : A < 0 ? "x + " + F(-A, 2) : "x − " + F(A, 2)) + ")" + (fa < 0 ? " − " + F(-fa, 3) : " + " + F(fa, 3)) + ".", "ok");
    });
    sel.el.dispatchEvent(new Event("change"));
  }
});

/* 2. Courbe de la dérivée */
var DF = {
  a:{n:"f(x) = x³/3 − x", f:function(x){ return x*x*x/3 - x; }, d:function(x){ return x*x - 1; }, wf:[-3.5, 3.5], wd:[-2, 6.5], ds:"f′(x) = x² − 1"},
  b:{n:"f(x) = x⁴/4 − x²", f:function(x){ return Math.pow(x, 4)/4 - x*x; }, d:function(x){ return x*x*x - 2*x; }, wf:[-2.5, 5], wd:[-14, 14], ds:"f′(x) = x³ − 2x"},
  c:{n:"f(x) = |x|", f:function(x){ return Math.abs(x); }, d:function(x){ return Math.abs(x) < 1e-9 ? NaN : (x > 0 ? 1 : -1); }, wf:[-0.5, 3], wd:[-1.5, 1.5], ds:"f′(x) = −1 si x < 0, +1 si x > 0, n'existe pas en 0"},
  d:{n:"f(x) = 2/x (x > 0)", f:function(x){ return x > 0 ? 2/x : NaN; }, d:function(x){ return x > 0 ? -2/(x*x) : NaN; }, wf:[-0.5, 6], wd:[-6, 1], ds:"f′(x) = −2/x²", lo:0.6}
};
SFA.sim({
  id:"m5-c05-courbe-derivee", ch:"c05", tag:"Classique",
  titre:"La courbe de f′ se dessine pendant que tu glisses",
  resume:"Un point sur f, sa tangente ; en dessous, le point (x ; f′(x)).",
  but:"Glisse le point sur la courbe de f (souris, doigt, curseur). En bas, le point (x ; f′(x)) trace la courbe dérivée. Où f′ s'annule-t-elle ? Que voit-on sur f ?",
  aRetenir:"f′(x) est la pente de la tangente en x. Quand la tangente est horizontale, f′ = 0. Quand f monte, f′ > 0 ; quand f descend, f′ < 0. Une pointe comme |x| en 0 : pas de tangente, f′ n'existe pas.",
  piege:"Une fonction continue n'est pas toujours dérivable : |x| est continue en 0 mais n'a pas de tangente (pointe).",
  build:function(k, S){
    var c1 = k.canvas(250), c2 = k.canvas(220);
    var sel = k.select("Fonction", Object.keys(DF).map(function(q){ return [q, DF[q].n]; }), "a", function(){ x.el.min = DF[sel.value].lo || -2.5; x.set(1); });
    var x = k.slider("Abscisse x", -2.5, 2.5, 0.05, 1, "");
    var ro = k.readouts(["f(x)", "f′(x)", "Tangente"]);
    var nt = k.note("", "ok"), ax1, ax2;
    function drag(type, p){ if (type === "down" || type === "drag"){ var v = Math.round(ax1.ix(p.x) / 0.05) * 0.05, d = DF[sel.value]; x.set(Math.max(d.lo || -2.5, Math.min(2.5, v))); k.redraw(); } }
    c1.pointer(drag); c2.pointer(function(t, p){ if (t === "down" || t === "drag"){ drag(t, {x:p.x}); } });
    k.draw(function(){
      var d = DF[sel.value], X = Math.max(d.lo || -2.5, x.value); c1.clear(); c2.clear();
      var dom = d.lo ? d.lo : d.wf[0];
      ax1 = S.draw.axes(c1, {x0:-3, x1:3, y0:d.wf[0], y1:d.wf[1], xl:"x", yl:"f", stepX:1, b:26});
      ax2 = S.draw.axes(c2, {x0:-3, x1:3, y0:d.wd[0], y1:d.wd[1], xl:"x", yl:"f′", stepX:1, b:26});
      S.draw.fn(c1, ax1, d.f, P.acc, 2.6); S.draw.fn(c2, ax2, d.d, "rgba(180,35,24,.35)", 2.2);
      var y = d.f(X), m = d.d(X);
      S.draw.line(c1, ax1.X(X), ax1.T, ax1.X(X), ax1.B, P.light, 1, [3, 3]); S.draw.line(c2, ax2.X(X), ax2.T, ax2.X(X), ax2.B, P.light, 1, [3, 3]);
      if (isFinite(m)){ clipped(c1, ax1, function(){ line(c1, ax1, X, y, m, P.green, null, 2); }); S.draw.dot(c2, ax2.X(X), ax2.Y(m), 6, P.red); }
      else S.draw.text(c2, "f′(0) n'existe pas", ax2.X(X) + 8, ax2.Y(0) - 12, {align:"left", color:P.red});
      S.draw.dot(c1, ax1.X(X), ax1.Y(y), 6, P.acc);
      if (isFinite(m)) S.draw.line(c2, ax2.X(X), ax2.Y(0), ax2.X(X), ax2.Y(m), P.red, 1.5);
      ro.set(0, F(y, 3)); ro.set(1, isFinite(m) ? F(m, 3) : "n'existe pas");
      ro.set(2, !isFinite(m) ? "pointe : aucune" : Math.abs(m) < 0.03 ? "horizontale" : m > 0 ? "monte" : "descend");
      nt.set(d.ds + ". En x = " + F(X, 2) + " : pente " + (isFinite(m) ? F(m, 3) : "indéfinie") + (isFinite(m) && Math.abs(m) < 0.03 ? " : tangente horizontale, f′ s'annule." : "."), "ok");
    });
    sel.el.dispatchEvent(new Event("change"));
  }
});

/* 3. Règles de dérivation */
var LB = {
  a:{n:"x²", f:function(x){ return x*x; }, d:function(x){ return 2*x; }, s:"2x"},
  b:{n:"x³", f:function(x){ return x*x*x; }, d:function(x){ return 3*x*x; }, s:"3x²"},
  c:{n:"√x", f:function(x){ return Math.sqrt(x); }, d:function(x){ return 0.5/Math.sqrt(x); }, s:"1/(2√x)"},
  d:{n:"1/x", f:function(x){ return 1/x; }, d:function(x){ return -1/(x*x); }, s:"−1/x²"},
  e:{n:"2x + 1", f:function(x){ return 2*x + 1; }, d:function(x){ return 2; }, s:"2"}
};
SFA.sim({
  id:"m5-c05-regles", ch:"c05", tag:"Vérification",
  titre:"Produit, quotient, composée : la bonne règle et la fausse",
  resume:"Un rectangle montre pourquoi (f·g)′ ≠ f′·g′ ; compare la bonne règle à la règle naïve.",
  but:"Choisis f, g et l'opération. Pour le produit, regarde le rectangle f × g grandir : deux bandes vertes (les vraies contributions) et un petit coin rouge (ce que la règle naïve f′g′ croit être tout). Réduis Δx : le coin disparaît.",
  aRetenir:"(f·g)′ = f′g + fg′ · (f/g)′ = (f′g − fg′)/g² · (f∘g)′ = f′(g(x))·g′(x) (on n'oublie pas la dérivée intérieure). Somme : (f + g)′ = f′ + g′, la seule règle « naïve » qui est juste.",
  piege:"(f·g)′ ≠ f′·g′ et (f/g)′ ≠ f′/g′. Pour une composée, dériver seulement « l'extérieur » oublie le facteur g′(x).",
  build:function(k, S){
    var c = k.canvas(520);
    var fs = k.select("f", Object.keys(LB).map(function(q){ return [q, LB[q].n]; }), "a");
    var gs = k.select("g", Object.keys(LB).map(function(q){ return [q, LB[q].n]; }), "e");
    var op = k.seg("Opération", [["P", "f·g"], ["Q", "f/g"], ["C", "f(g(x))"]], "P");
    var x = k.slider("x", 0.5, 3, 0.1, 1.5, "");
    var dx = k.slider("Δx (pas du secant et du rectangle)", 0.02, 1, 0.02, 0.5, "");
    var ro = k.readouts(["h′(x) par la règle", "Pente numérique", "Règle naïve", "Écart naïf"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var f = LB[fs.value], g = LB[gs.value], X = x.value, o = op.value, D = dx.value, h, good, naive, rule, nrule, t;
      if (o === "P"){ h = function(t){ return f.f(t) * g.f(t); }; good = f.d(X) * g.f(X) + f.f(X) * g.d(X); naive = f.d(X) * g.d(X); rule = "f′g + fg′"; nrule = "f′·g′"; }
      else if (o === "Q"){ h = function(t){ return f.f(t) / g.f(t); }; good = (f.d(X) * g.f(X) - f.f(X) * g.d(X)) / (g.f(X) * g.f(X)); naive = f.d(X) / g.d(X); rule = "(f′g − fg′)/g²"; nrule = "f′/g′"; }
      else { h = function(t){ return f.f(g.f(t)); }; good = f.d(g.f(X)) * g.d(X); naive = f.d(g.f(X)); rule = "f′(g(x))·g′(x)"; nrule = "f′(g(x)) seul"; }
      var num = (h(X + 1e-6) - h(X - 1e-6)) / 2e-6, y = h(X), lo = Infinity, hi = -Infinity, topH = 196;
      /* bandeau du haut */
      S.draw.panel(c, 4, 4, c.W - 8, topH - 8, {fill:"#fafbfd", stroke:"#e3e7ed", radius:12, shadow:false});
      if (o === "P"){
        var fa = f.f(X), ga = g.f(X), df = f.f(X + D) - fa, dg = g.f(X + D) - ga, lw = Math.min(c.W * 0.52, 260);
        var s = Math.min((lw - 28) / (fa + df), (topH - 64) / (ga + dg)), ox = 20, oy = topH - 26, rw = fa * s, rh = ga * s;
        S.draw.panel(c, ox, oy - rh, rw, rh, {fill:S.draw.tint(P.acc, 0.16), stroke:P.acc, radius:2, shadow:false});
        S.draw.panel(c, ox + rw, oy - rh, df * s, rh, {fill:S.draw.tint(P.green, 0.38), stroke:P.green, radius:0, shadow:false});
        S.draw.panel(c, ox, oy - rh - dg * s, rw, dg * s, {fill:S.draw.tint(P.green, 0.22), stroke:P.green, radius:0, shadow:false});
        S.draw.panel(c, ox + rw, oy - rh - dg * s, df * s, dg * s, {fill:S.draw.tint(P.red, 0.6), stroke:P.red, radius:0, shadow:false});
        S.draw.text(c, "f·g = " + F(fa * ga, 2), ox + rw / 2, oy - rh / 2, {size:12, color:P.acc});
        S.draw.text(c, "f = " + F(fa, 2), ox + rw / 2, oy + 11, {size:11, color:P.grey}); S.draw.text(c, "g = " + F(ga, 2), ox + 4, oy - rh + 12, {size:11, color:P.grey, align:"left"});
        var tx = lw + 26, lh = 21, ty = 24;
        S.draw.text(c, "Quand x passe à x + Δx :", tx, ty, {align:"left", size:12, color:P.ink});
        [[P.green, "g·Δf", ga * df], [P.green, "f·Δg", fa * dg], [P.red, "Δf·Δg", df * dg]].forEach(function(q, i){
          c.ctx.fillStyle = S.draw.tint(q[0], 0.55); c.ctx.fillRect(tx, ty + 18 + i * lh, 12, 12);
          S.draw.text(c, q[1] + " = " + F(q[2], 3), tx + 18, ty + 25 + i * lh, {align:"left", size:12, color:i === 2 ? P.red : P.ink});
        });
        var delta = (fa + df) * (ga + dg) - fa * ga;
        S.draw.text(c, "gain total = " + F(delta, 3), tx, ty + 18 + 3 * lh + 8, {align:"left", size:12, color:P.acc});
        S.draw.text(c, "÷ Δx → " + F(delta / D, 3) + (D > 0.1 ? "" : " ≈ h′"), tx, ty + 18 + 3 * lh + 28, {align:"left", size:12, color:P.acc});
        S.draw.text(c, "coin rouge : tout ce que voit f′g′", tx, topH - 14, {align:"left", size:10.5, color:P.red, weight:700});
      } else if (o === "Q"){
        var fa2 = f.f(X), ga2 = g.f(X), fd = f.d(X), gd = g.d(X);
        S.draw.text(c, "Quotient : (f′g − fg′) / g²", 14, 18, {align:"left", size:12.5, color:P.ink});
        rgTiles(c, S, 34, [["f′g", F(fd * ga2, 2), P.acc], "−", ["fg′", F(fa2 * gd, 2), P.green], "=", ["numérateur", F(fd * ga2 - fa2 * gd, 2), P.violet], "÷", ["g²", F(ga2 * ga2, 2), P.teal], "=", ["h′", F(good, 3), P.green]], c.W);
        rgTiles(c, S, 108, [["f′", F(fd, 2), P.red], "÷", ["g′", F(gd, 2), P.red], "=", ["règle naïve", F(naive, 3), P.red]], c.W);
        S.draw.text(c, "En rouge : la règle fausse f′/g′ — elle donne autre chose.", 14, topH - 22, {align:"left", size:11, color:P.red, weight:700});
      } else {
        var gx = g.f(X);
        S.draw.text(c, "Composée : on dérive l'extérieur puis on multiplie par la dérivée intérieure", 14, 18, {align:"left", size:12, color:P.ink});
        rgTiles(c, S, 34, [["g(x)", F(gx, 3), P.teal], "→", ["f′(g(x))", F(f.d(gx), 3), P.acc], "×", ["g′(x)", F(g.d(X), 3), P.green], "=", ["h′", F(good, 3), P.green]], c.W);
        rgTiles(c, S, 108, [["f′(g(x)) seul", F(naive, 3), P.red], "≠", ["h′", F(good, 3), P.green]], c.W);
        S.draw.text(c, "Oublier g′(x), c'est ne dériver que l'extérieur.", 14, topH - 22, {align:"left", size:11, color:P.red, weight:700});
      }
      /* graphe */
      for (t = 0.2; t <= 3.5; t += 0.05){ var v = h(t); if (isFinite(v)){ lo = Math.min(lo, v); hi = Math.max(hi, v); } }
      var pad = (hi - lo) * 0.15 + 0.2, ax = S.draw.axes(c, {x0:0, x1:3.5, y0:lo - pad, y1:hi + pad, xl:"x", yl:"h", stepX:0.5, t:topH + 14, b:28, l:44});
      S.draw.fn(c, ax, h, P.acc, 2.8);
      clipped(c, ax, function(){
        line(c, ax, X, y, good, P.green, null, 2.4); line(c, ax, X, y, naive, P.red, [6, 5], 2);
        var sec = (h(X + D) - y) / D; line(c, ax, X, y, sec, P.amber, [2, 4], 2);
      });
      S.draw.dot(c, ax.X(X + D), ax.Y(h(X + D)), 5, P.amber); S.draw.dot(c, ax.X(X), ax.Y(y), 6.5, P.acc);
      S.draw.legend(c, [[P.green, "tangente (règle exacte)"], [P.red, "règle naïve", true], [P.amber, "sécante (pas Δx)", true]], ax.L + 8, ax.T + 4);
      ro.set(0, F(good, 4)); ro.set(1, F(num, 4)); ro.set(2, F(naive, 4)); ro.set(3, F(naive - good, 4));
      var hn = o === "P" ? f.n + "·" + g.n : o === "Q" ? f.n + " / " + g.n : "f(g(x)) avec f = " + f.n + ", g = " + g.n;
      nt.set("h(x) = " + hn + ". Règle exacte : " + rule + " = <b>" + F(good, 4) + "</b>, et la limite numérique donne " + F(num, 4) + " (identiques). Règle naïve (" + nrule + ") : " + F(naive, 4) + (Math.abs(naive - good) < 1e-6 ? " : égale ici par hasard, ne généralise pas." : " : fausse."), "ok");
    });
  }
});

/* 4. Vitesse instantanée */
SFA.sim({
  id:"m5-c05-vitesse", ch:"c05", tag:"Animation",
  titre:"Vitesse moyenne, vitesse instantanée",
  resume:"Une bille tombe : s(t) = 4,9·t². Rétrécis l'intervalle de temps.",
  but:"Lance la chute (▶). Puis glisse le point bleu (t₀) et tire le point rouge vers lui (Δt → 0) : la vitesse moyenne sur [t₀ ; t₀ + Δt] tend vers la vitesse instantanée s′(t₀).",
  aRetenir:"Vitesse moyenne = Δs/Δt = pente de la sécante. Vitesse instantanée = s′(t₀) = limite de la vitesse moyenne quand Δt → 0 : pente de la tangente à la courbe s(t). Ici s′(t) = 9,8·t (m/s), sans frottements.",
  piege:"La vitesse moyenne entre 0 et t₀ (s(t₀)/t₀ = 4,9·t₀) vaut la moitié de la vitesse instantanée à t₀, car la bille accélère.",
  build:function(k, S){
    var c = k.canvas(430);
    var t0 = k.slider("t₀", 0.5, 3, 0.1, 2, "s");
    var z = k.slider("Rapprochement z (Δt = 10^−z s)", -0.3, 3, 0.1, 0, "");
    var ro = k.readouts(["Vitesse moyenne", "Vitesse instantanée", "Écart", "Vit. moy. [0 ; t₀]"]);
    var tt = 0, axv = null, dm = "";
    c.pointer(function(ty, q){
      if (!axv) return;
      if (ty === "down"){ var T0 = t0.value, dT = Math.pow(10, -z.value); dm = Math.hypot(q.x - axv.X(T0 + dT), q.y - axv.Y(4.9 * (T0 + dT) * (T0 + dT))) < 26 && dT > 0.02 ? "z" : "t"; }
      if ((ty === "down" || ty === "drag") && dm === "z"){ var dd = Math.max(0.001, axv.ix(q.x) - t0.value); z.set(Math.max(-0.3, Math.min(3, -Math.log10(dd)))); k.redraw(); }
      else if ((ty === "down" || ty === "drag") && dm === "t"){ t0.set(Math.max(0.5, Math.min(3, Math.round(axv.ix(q.x) * 10) / 10))); k.redraw(); }
      if (ty === "up") dm = "";
    });
    var anim = k.loop(function(dt){ tt += dt * 0.8; if (tt > 3.2){ tt = 3.2; anim.pause(); } k.redraw(); });
    k.button("▶ Lancer la chute", function(){ tt = 0; anim.play(); }, true);
    k.button("Arrêter", function(){ anim.pause(); });
    k.draw(function(){
      c.clear(); var s = function(t){ return 4.9 * t * t; }, T0 = t0.value, dT = Math.pow(10, -z.value);
      var ax = axv = S.draw.axes(c, {x0:0, x1:3.5, y0:0, y1:60, l:46, r:116, xl:"t (s)", yl:"s (m)", stepX:0.5, stepY:10});
      S.draw.fn(c, ax, s, P.acc, 2.6);
      var vm = (s(T0 + dT) - s(T0)) / dT, vi = 9.8 * T0;
      clipped(c, ax, function(){ line(c, ax, T0, s(T0), vm, P.red, null, 2); line(c, ax, T0, s(T0), vi, P.green, [6, 5], 2); });
      S.draw.dot(c, ax.X(T0), ax.Y(s(T0)), 6, P.acc); clipped(c, ax, function(){ S.draw.dot(c, ax.X(T0 + dT), ax.Y(s(T0 + dT)), 5.5, P.red); });
      S.draw.label(c, "t₀ = " + F(T0, 1) + " s", ax.X(T0) - 10, ax.Y(s(T0)) - 14, {color:P.acc, align:"right", size:11});
      if (dT > 0.02) S.draw.label(c, "↔ Δt = " + F(dT, 2) + " s", Math.min(ax.R - 6, ax.X(T0 + dT) + 10), Math.min(ax.B - 14, ax.Y(s(T0 + dT)) + 22), {color:P.red, align:ax.X(T0 + dT) + 100 > ax.R ? "right" : "left", size:11});
      var cx = c.W - 58, top = ax.T + 6, bot = ax.B - 6;
      S.draw.line(c, cx, top, cx, bot, P.light, 3);
      var yy = top + (bot - top) * (s(tt) / 60);
      S.draw.dot(c, cx, yy, 9, P.amber); S.draw.dot(c, ax.X(tt), ax.Y(s(tt)), 4, P.amber);
      S.draw.text(c, "t = " + F(tt, 2) + " s", cx, bot + 4, {size:12, base:"top"});
      ro.set(0, F(vm, 3) + " m/s"); ro.set(1, F(vi, 3) + " m/s"); ro.set(2, F(vm - vi, 3) + " m/s"); ro.set(3, F(4.9 * T0, 2) + " m/s (moy.)");
    });
  }
});
})();
