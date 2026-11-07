(function(){
var P = SFA.draw.palette, F = SFA.fmt;
/*@@H:m5-c02-escalier-boule*/
function esBand(c, S, y0, bh, vals, kind, col, prog, label){
  /* kind "A" : marches d'escalier ; "G" : boules de neige. vals : u_0..u_N */
  var P = S.draw.palette, ctx = c.ctx, n = vals.length, pad = 14, W = c.W - 2 * pad, slot = W / n, i, v;
  var lo = 0, hi = 0; vals.forEach(function(u){ lo = Math.min(lo, u); hi = Math.max(hi, u); });
  if (hi - lo < 1e-9) hi = lo + 1;
  S.draw.panel(c, 4, y0, c.W - 8, bh, {fill:S.draw.tint(col, 0.04), stroke:S.draw.tint(col, 0.25), radius:10, shadow:false});
  if (kind === "A"){
    var sc = (bh - 38) / (hi - lo), base = y0 + 28 + hi * sc;
    for (i = 0; i < n; i++){
      if (i > prog + 0.001) break; v = vals[i]; var x = pad + i * slot, h = v * sc;
      ctx.fillStyle = S.draw.tint(col, i === n - 1 ? 0.5 : 0.28); ctx.fillRect(x + 1, v >= 0 ? base - h : base, slot - 2, Math.abs(h));
      S.draw.line(c, x + 1, base - h, x + slot - 1, base - h, col, 3);
    }
    S.draw.line(c, pad, base, pad + W, base, P.grey, 1);
    var last = Math.min(n - 1, Math.floor(prog + 0.001)), lx = pad + (last + 0.5) * slot;
    S.draw.dot(c, lx, base - vals[last] * sc - 9, 5, P.ink);
  } else {
    var R = Math.min(slot / 2 - 1, bh / 2 - 6), mx = 0; vals.forEach(function(u){ mx = Math.max(mx, Math.abs(u)); }); mx = mx || 1;
    var cy = y0 + bh / 2 + 4;
    for (i = 0; i < n; i++){
      if (i > prog + 0.001) break; v = vals[i]; var r = Math.max(1.5, R * Math.abs(v) / mx), cx = pad + (i + 0.5) * slot;
      var g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r); g.addColorStop(0, "#fff"); g.addColorStop(1, S.draw.tint(col, 0.55));
      ctx.beginPath(); ctx.arc(cx, cy + (R - r), r, 0, 7); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = col; ctx.stroke();
    }
  }
  S.draw.text(c, label, 14, y0 + 11, {align:"left", size:12, color:col, weight:800});
}
/*@@E:m5-c02-escalier-boule*/
function money(x){ return F(Math.round(x * 100) / 100, 2).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

/* 1. Escalier et boule de neige */
SFA.sim({
  id:"m5-c02-escalier-boule", ch:"c02", tag:"Classique",
  titre:"L'escalier et la boule de neige",
  resume:"Suite arithmétique (on ajoute r) ou géométrique (on multiplie par q).",
  but:"Choisis le type de suite, u₀ et la raison, puis lance l'animation : l'escalier monte de r à chaque marche, la boule de neige grossit de q à chaque tour. Tu peux aussi glisser le premier point du graphique.",
  aRetenir:"Arithmétique : uₙ = u₀ + n·r, somme de u₀ à u_N = (N + 1)(u₀ + u_N)/2. Géométrique : uₙ = u₀·qⁿ, somme = u₀(q^(N+1) − 1)/(q − 1) si q ≠ 1.",
  piege:"De u₀ à u_N il y a N + 1 termes mais seulement N raisons. « Augmente de 5 % » signifie q = 1,05, pas q = 5.",
  build:function(k, S){
    var c = k.canvas(500);
    var type = k.seg("Suite", [["A", "Arithmétique"], ["G", "Géométrique"], ["B", "Les deux"]], "B");
    var u0 = k.slider("u₀", 1, 10, 1, 3, "");
    var r = k.slider("r (raison arithmétique)", -3, 5, 0.5, 2, "");
    var q = k.slider("q (raison géométrique)", 0.5, 1.8, 0.05, 1.2, "");
    var N = k.slider("N (dernier indice)", 3, 15, 1, 10, "");
    var prog = 99, anim = k.loop(function(dt){ prog += dt * 3.2; if (prog >= N.value + 0.5){ prog = 99; anim.pause(); } k.redraw(); });
    k.button("▶ Monter l'escalier / rouler la boule", function(){ prog = 0; anim.play(); }, true);
    var ro = k.readouts(["u_N arithmétique", "Somme arith.", "u_N géométrique", "Somme géom."]);
    var nt = k.note("", "ok");
    function ua(n){ return u0.value + n * r.value; } function ug(n){ return u0.value * Math.pow(q.value, n); }
    function sa(n){ return (n + 1) * (u0.value + ua(n)) / 2; }
    function sg(n){ return Math.abs(q.value - 1) < 1e-9 ? (n + 1) * u0.value : u0.value * (Math.pow(q.value, n + 1) - 1) / (q.value - 1); }
    var ax = null, drag = false;
    c.pointer(function(type_, p){
      if (!ax) return;
      if (type_ === "down"){ var y = ax.Y(u0.value), x = ax.X(0); drag = Math.hypot(p.x - x, p.y - y) < 26; }
      if (type_ === "drag" && drag){ u0.set(Math.round(ax.iy(p.y))); prog = 99; k.redraw(); }
      if (type_ === "up") drag = false;
    });
    k.draw(function(){
      c.clear(); var n = N.value, t = type.value, lo = 0, hi = 0.5, i, A = [], G = [];
      for (i = 0; i <= n; i++){ A.push(ua(i)); G.push(ug(i)); if (t !== "G"){ lo = Math.min(lo, A[i]); hi = Math.max(hi, A[i]); } if (t !== "A"){ lo = Math.min(lo, G[i]); hi = Math.max(hi, G[i]); } }
      var bh = t === "B" ? 84 : 120, y = 6, bottom;
      if (t !== "G"){ esBand(c, S, y, bh, A, "A", P.acc, prog, "Escalier : on ajoute r = " + F(r.value, 1) + " à chaque marche"); y += bh + 6; }
      if (t !== "A"){ esBand(c, S, y, bh, G, "G", P.red, prog, "Boule de neige : on multiplie par q = " + F(q.value, 2) + " à chaque tour"); y += bh + 6; }
      var pad = (hi - lo) * 0.1 + 0.5;
      ax = S.draw.axes(c, {x0:-0.7, x1:n + 0.7, y0:lo - pad, y1:hi + pad, stepX:n > 10 ? 2 : 1, xl:"n", yl:"uₙ", t:y + 12, b:30, l:42});
      for (i = 0; i <= n; i++){
        if (i > prog + 0.001) break;
        if (t !== "G"){ if (i) S.draw.line(c, ax.X(i - 1), ax.Y(A[i - 1]), ax.X(i), ax.Y(A[i]), S.draw.tint(P.acc, 0.3), 1.6); S.draw.dot(c, ax.X(i), ax.Y(A[i]), 5, P.acc); }
        if (t !== "A"){ if (i) S.draw.line(c, ax.X(i - 1), ax.Y(G[i - 1]), ax.X(i), ax.Y(G[i]), S.draw.tint(P.red, 0.3), 1.6); S.draw.dot(c, ax.X(i), ax.Y(G[i]), 5, P.red); }
      }
      S.draw.glow(c, ax.X(0), ax.Y(u0.value), 16, P.amber, 0.4);
      S.draw.label(c, "↕ glisse u₀", ax.X(0) + 12, ax.Y(u0.value) + 20, {color:P.amber, align:"left", size:11});
      ro.set(0, F(A[n], 2)); ro.set(1, F(sa(n), 2)); ro.set(2, F(G[n], 2)); ro.set(3, F(sg(n), 2));
      var msg = "Bleu : arithmétique (points alignés). Rouge : géométrique (rapport constant).";
      if (Math.abs(q.value - 1) < 1e-9) msg += " Avec q = 1, la suite géométrique est constante.";
      else if (q.value < 1 - 1e-9) msg += " Avec q < 1, la suite géométrique tend vers 0 : elle converge.";
      nt.set(msg + " (" + (n + 1) + " termes de u₀ à u_" + n + ")", "ok");
    });
  }
});

/* 2. Intérêts simples et composés */
SFA.sim({
  id:"m5-c02-interets", ch:"c02", tag:"Classique",
  titre:"Intérêts simples ou composés ?",
  resume:"Deux placements, un seul diverge vraiment vite.",
  but:"Règle le capital, le taux et la durée. Puis fais en sorte que le capital double : combien d'années en simple ? en composé ?",
  aRetenir:"Simple : Cₙ = C₀(1 + t·n), suite arithmétique. Composé : Cₙ = C₀(1 + t)ⁿ, suite géométrique de raison 1 + t. Le composé gagne parce que les intérêts rapportent eux-mêmes des intérêts.",
  piege:"Un taux de 3 % par an ne donne pas 3 % × 5 = 15 % de gain en 5 ans avec des intérêts composés : 1,03⁵ ≈ 1,1593, soit 15,93 %.",
  build:function(k, S){
    var c = k.canvas(420);
    var cap = k.slider("Capital C₀", 100, 5000, 100, 1000, "€");
    var tx = k.slider("Taux annuel t", 1, 10, 0.5, 4, "%");
    var dur = k.slider("Durée n", 0, 40, 1, 20, "ans");
    var ro = k.readouts(["Simple Cₙ", "Composé Cₙ", "Écart", "Doublement"]);
    var nt = k.note("", "ok"), axi = null;
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && axi){ dur.set(Math.round(Math.max(0, Math.min(40, axi.ix(p.x))))); k.redraw(); } });
    k.draw(function(){
      c.clear(); var C0 = cap.value, t = tx.value / 100, n = dur.value;
      var cs = function(x){ return C0 * (1 + t * x); }, cc = function(x){ return C0 * Math.pow(1 + t, x); };
      var hi = Math.max(cs(40), cc(40), 1), nmax = 40;
      var ax = axi = S.draw.axes(c, {x0:0, x1:nmax, y0:0, y1:Math.max(cs(nmax), cc(nmax)) * 1.05, l:58, xl:"années", stepX:5});
      S.draw.fn(c, ax, cs, P.acc, 2.4); S.draw.fn(c, ax, cc, P.red, 2.4);
      S.draw.line(c, ax.X(n), ax.B, ax.X(n), ax.Y(cc(n)), P.grey, 1, [3, 3]);
      S.draw.dot(c, ax.X(n), ax.Y(cs(n)), 6, P.acc); S.draw.glow(c, ax.X(n), ax.Y(cc(n)), 16, P.red, 0.4); S.draw.dot(c, ax.X(n), ax.Y(cc(n)), 6.5, P.red); S.draw.label(c, "↔ glisse n = " + n, ax.X(n) + 10, ax.B - 14, {color:P.ink, align:ax.X(n) > ax.R - 110 ? "right" : "left", size:11});
      S.draw.line(c, ax.L, ax.Y(2 * C0), ax.R, ax.Y(2 * C0), P.light, 1, [4, 4]);
      var dS = 1 / t, dC = Math.log(2) / Math.log(1 + t);
      ro.set(0, money(cs(n)) + " €"); ro.set(1, money(cc(n)) + " €"); ro.set(2, money(cc(n) - cs(n)) + " €");
      ro.set(3, F(dS, 1) + " / " + F(dC, 1) + " ans");
      nt.set("Bleu : simple (droite, +" + money(C0 * t) + " € par an). Rouge : composé (×" + F(1 + t, 3) + " par an). Le capital double après " + F(dS, 1) + " ans en simple, après " + F(dC, 1) + " ans en composé." + (n === 0 ? " À n = 0, les deux valent C₀." : ""), "ok");
    });
  }
});

/* 3. Somme de Gauss généralisée */
SFA.sim({
  id:"m5-c02-gauss", ch:"c02", tag:"Preuve visuelle",
  titre:"La somme de Gauss en rectangle",
  resume:"Deux copies de la suite forment un rectangle : S = n(u₁ + uₙ)/2.",
  but:"Choisis u₁, la raison et n : la suite (bleu) et sa copie retournée (orange) forment un rectangle de hauteur constante u₁ + uₙ.",
  aRetenir:"Chaque colonne du rectangle vaut u₁ + uₙ, il y a n colonnes : 2S = n(u₁ + uₙ), donc S = n(u₁ + uₙ)/2. Pour 1 + 2 + … + n, cela donne n(n + 1)/2.",
  piege:"On divise par 2 parce qu'on a compté la somme deux fois. Et n est le nombre de termes, pas le dernier indice si la suite commence à u₀.",
  build:function(k, S){
    var c = k.canvas(420);
    var u1 = k.slider("u₁ (premier terme)", 1, 10, 1, 1, "");
    var r = k.slider("r (raison)", 0, 4, 1, 1, "");
    var n = k.slider("n (nombre de termes)", 2, 12, 1, 8, "");
    var mode = k.seg("Mode", [["L", "Libre"], ["D", "Défi : S = 60"]], "L");
    var ro = k.readouts(["uₙ", "u₁ + uₙ", "Somme S"]);
    var nt = k.note("", "ok");
    var fl = 1, anim = k.loop(function(dt){ fl += dt * 0.7; if (fl >= 1){ fl = 1; anim.pause(); } k.redraw(); });
    k.button("▶ Retourner la copie", function(){ fl = 0; anim.play(); }, true);
    c.pointer(function(t, q){ if (t === "up") return; var Lm = 40, w = (c.W - Lm - 16) / n.value; n.set(Math.max(2, Math.min(12, Math.floor((q.x - Lm) / w) + 1))); k.redraw(); });
    k.draw(function(){
      c.clear(); var N = n.value, a = u1.value, d = r.value, un = a + (N - 1) * d, h = a + un;
      var ctx = c.ctx, L = 40, Rr = 16, T = 34, B = 30, w = (c.W - L - Rr) / N, hm = fl < 1 ? Math.max(h, 2 * Math.max(a, un)) : h, sc = (c.H - T - B) / hm, i;
      for (i = 1; i <= N; i++){
        var v = a + (i - 1) * d, x = L + (i - 1) * w, y0 = c.H - B, o = (1 - fl) * v + fl * (h - v);
        ctx.fillStyle = "rgba(30,63,143,.85)"; ctx.fillRect(x + 1, y0 - v * sc, w - 2, v * sc);
        ctx.fillStyle = "rgba(180,83,9,.8)"; ctx.fillRect(x + 1, y0 - v * sc - o * sc, w - 2, o * sc);
        if (w > 18){ S.draw.text(c, F(v, 0), x + w/2, y0 - v * sc/2, {color:"#fff", size:12}); if (o * sc > 14) S.draw.text(c, F(o, 0), x + w/2, y0 - v * sc - o * sc/2, {color:"#fff", size:12}); }
        S.draw.text(c, String(i), x + w/2, y0 + 14, {size:12, color:P.grey});
      }
      if (fl >= 1){ ctx.save(); ctx.strokeStyle = P.ink; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeRect(L + 0.5, c.H - B - h * sc, c.W - L - Rr, h * sc); ctx.restore(); }
      S.draw.text(c, fl < 1 ? "la copie orange se retourne…" : "u₁ + uₙ = " + F(h, 0) + " par colonne · touche pour changer n", L, 14, {align:"left", size:12, color:P.amber});
      ro.set(0, F(un, 0)); ro.set(1, F(h, 0)); ro.set(2, F(N * h / 2, 1));
      var s = 0; for (i = 1; i <= N; i++) s += a + (i - 1) * d;
      if (mode.value === "D"){ var ok60 = Math.abs(N * h / 2 - 60) < 1e-9; nt.set(ok60 ? "<b>Bravo : S = " + F(N, 0) + " × " + F(h, 0) + " / 2 = 60.</b> Il y a plusieurs solutions : en trouves-tu une autre ?" : "Défi : règle u₁, r et n pour que la somme vale exactement 60. Pour l'instant S = " + F(N * h / 2, 1) + ".", ok60 ? "ok" : "warn"); return; }
      nt.set("Rectangle : " + N + " × " + F(h, 0) + " = " + F(N * h, 0) + " cases, soit deux fois la somme. S = " + F(N * h, 0) + " / 2 = " + F(N * h / 2, 1) + ". Vérification en additionnant terme à terme : " + F(s, 0) + ".", "ok");
    });
  }
});

/* 4. Crédit et amortissement */
SFA.sim({
  id:"m5-c02-credit", ch:"c02", tag:"Finance",
  titre:"Rembourser un crédit : où vont les paiements ?",
  resume:"Annuités constantes : la part d'intérêts diminue chaque année.",
  but:"Règle le prêt, le taux et la durée. Fais glisser l'année k : combien d'intérêts, combien de capital remboursé, combien reste dû ?",
  aRetenir:"Avec une annuité constante A, la dette suit D_k = D_{k−1}(1 + t) − A. Les intérêts sont calculés sur ce qui reste dû : ils diminuent, la part de capital augmente. A = K·t / (1 − (1 + t)^(−n)).",
  piege:"Modèle simplifié : un seul paiement par an (les vrais crédits sont mensuels). Un crédit plus long a une annuité plus faible, mais un coût total en intérêts plus élevé.",
  build:function(k, S){
    var c = k.canvas(420);
    var K = k.slider("Capital emprunté", 5000, 50000, 1000, 20000, "€");
    var tx = k.slider("Taux annuel", 0, 10, 0.5, 5, "%");
    var n = k.slider("Durée", 1, 20, 1, 10, "ans");
    var kk = k.slider("Année k à examiner", 1, 20, 1, 1, "");
    var ro = k.readouts(["Annuité A", "Intérêts totaux", "Intérêts année k", "Capital remboursé", "Dette après k"]);
    var nt = k.note("", "ok"), axc = null;
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && axc){ var N0 = n.value; kk.set(Math.max(1, Math.min(N0, Math.floor(axc.ix(p.x)) + 1))); k.redraw(); } });
    k.draw(function(){
      c.clear(); var cap = K.value, t = tx.value / 100, N = n.value, i;
      var A = t === 0 ? cap / N : cap * t / (1 - Math.pow(1 + t, -N));
      var D = cap, rows = [], tot = 0;
      for (i = 1; i <= N; i++){ var it = D * t, cp = A - it; D = D - cp; rows.push({i:it, c:cp, d:Math.max(0, Math.abs(D) < 1e-6 ? 0 : D)}); tot += it; }
      var sel = Math.min(kk.value, N), ctx = c.ctx, L = 56, Rr = 12, T = 40, B = 30, w = (c.W - L - Rr) / N, sc = (c.H - T - B) / (A * 1.08);
      var ax = axc = S.draw.axes(c, {x0:0, x1:N, y0:0, y1:A * 1.08, l:56, r:12, t:40, b:30, xl:"année", stepX:N > 10 ? 2 : 1, grid:false});
      for (i = 0; i < N; i++){
        var x = L + i * w, y0 = c.H - B, hc = rows[i].c * sc, hi = rows[i].i * sc;
        ctx.fillStyle = (i + 1 === sel) ? P.green : "rgba(46,107,85,.6)"; ctx.fillRect(x + 1, y0 - hc, w - 2, hc);
        ctx.fillStyle = (i + 1 === sel) ? P.red : "rgba(180,35,24,.6)"; ctx.fillRect(x + 1, y0 - hc - hi, w - 2, hi);
      }
      S.draw.legend(c, [[P.green, "capital remboursé"], [P.red, "intérêts"]], c.W - 150, 8); S.draw.label(c, "touche une barre : année k", 12, 18, {color:P.grey, align:"left", size:11});
      var rw = rows[sel - 1];
      ro.set(0, money(A) + " €"); ro.set(1, money(tot) + " €"); ro.set(2, money(rw.i) + " €"); ro.set(3, money(rw.c) + " €"); ro.set(4, money(rw.d) + " €");
      nt.set("Tu rembourses " + money(A * N) + " € au total pour " + money(cap) + " € empruntés. En année " + sel + ", " + F(rw.i / A * 100, 0) + " % de l'annuité sont des intérêts" + (kk.value > N ? " (k limité à la durée " + N + ")." : "."), "ok");
    });
  }
});
})();
