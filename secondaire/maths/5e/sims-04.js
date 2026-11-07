(function(){
var P = SFA.draw.palette, F = SFA.fmt;
/*@@H:m5-c04-continuite*/
function pencil(c, S, x, y, lifted, col){
  var ctx = c.ctx, ang = -0.95, L = 34, dx = Math.cos(ang) * L, dy = Math.sin(ang) * L, ox = lifted ? -4 : 0, oy = lifted ? -16 : 0;
  ctx.save(); ctx.translate(x + ox, y + oy); ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(15,27,45,.18)"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(2, 3); ctx.lineTo(dx + 2, dy + 3); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(dx * 0.2, dy * 0.2); ctx.lineTo(dx, dy); ctx.stroke();
  ctx.strokeStyle = "#f3d9b1"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dx * 0.2, dy * 0.2); ctx.stroke();
  ctx.fillStyle = "#0f1b2d"; ctx.beginPath(); ctx.arc(0, 0, 1.8, 0, 7); ctx.fill(); ctx.restore();
}
/*@@E:m5-c04-continuite*/
function curve(c, ax, pt, t0, t1, col, dash, w){
  var ctx = c.ctx, n = 300; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = w || 2.6; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  for (var i = 0; i <= n; i++){ var t = t0 + (t1 - t0) * i / n, p = pt(t); if (i) ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); else ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); }
  ctx.stroke(); ctx.restore();
}
function piece(c, ax, f, x0, x1, col){ curve(c, ax, function(t){ return [t, f(t)]; }, x0, x1, col); }
function hole(c, ax, x, y, col){ var ctx = c.ctx; ctx.beginPath(); ctx.arc(ax.X(x), ax.Y(y), 5.5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); }
function inf(v){ return v === Infinity ? "+∞" : v === -Infinity ? "−∞" : F(v, 3); }
function sg(r){ return r < 0 ? " − " + F(-r, 1) : " + " + F(r, 1); }
function xp(p){ return p === 0 ? "x" : "x " + (p < 0 ? "+ " : "− ") + F(Math.abs(p), 0); }
function lin(a, b){ return (a === 1 ? "" : a === -1 ? "−" : F(a, 0)) + "x" + (b === 0 ? "" : (b < 0 ? " − " : " + ") + F(Math.abs(b), 0)); }
function poly(a, b, c){ var s = ""; if (a) s += (a === 1 ? "" : a === -1 ? "−" : F(a, 0)) + "x²"; if (b) s += (s ? (b > 0 ? " + " : " − ") : (b < 0 ? "−" : "")) + (Math.abs(b) === 1 ? "" : F(Math.abs(b), 0)) + "x"; if (c || !s) s += (s ? (c >= 0 ? " + " : " − ") : (c < 0 ? "−" : "")) + F(Math.abs(c), 0); return s; }

/* 1. Asymptotes d'une fraction rationnelle */
SFA.sim({
  id:"m5-c04-asymptotes", ch:"c04", tag:"Classique",
  titre:"Les trois asymptotes d'une fraction rationnelle",
  resume:"f(x) = (ax² + bx + c)/(x − p) : verticale, horizontale ou oblique.",
  but:"Glisse l'asymptote verticale (rouge) ou modifie a, b, c et p. Quand a = 0, cherche l'asymptote horizontale ; quand a ≠ 0, une oblique apparaît. Fais disparaître l'asymptote verticale : que reste-t-il ?",
  aRetenir:"Asymptote verticale en x = p si le dénominateur s'annule et pas le numérateur. Si deg num = deg den : horizontale. Si deg num = deg den + 1 : oblique, obtenue par division euclidienne : f(x) = ax + (b + ap) + reste/(x − p).",
  piege:"Quand le numérateur s'annule aussi en p, il n'y a pas d'asymptote mais un trou. Et ne cherche pas d'horizontale si deg num > deg den : c'est l'oblique.",
  build:function(k, S){
    var c = k.canvas(430);
    var a = k.slider("a", -3, 3, 1, 1, ""), b = k.slider("b", -5, 5, 1, 1, ""), cc = k.slider("c", -6, 6, 1, 3, ""), p = k.slider("p", -4, 4, 1, 1, "");
    var ro = k.readouts(["Asympt. verticale", "Asympt. horizontale", "Asympt. oblique"]);
    var nt = k.note("", "ok"), axg = null, dg = false;
    c.pointer(function(t, q){
      if (!axg) return;
      if (t === "down") dg = Math.abs(q.x - axg.X(p.value)) < 22;
      if ((t === "down" || t === "drag") && dg){ p.set(Math.max(-4, Math.min(4, Math.round(axg.ix(q.x))))); k.redraw(); }
      if (t === "up") dg = false;
    });
    k.draw(function(){
      c.clear(); var A = a.value, B = b.value, C = cc.value, Pp = p.value;
      var num = function(x){ return A*x*x + B*x + C; };
      var ax = axg = S.draw.axes(c, {x0:-8, x1:8, y0:-10, y1:10, stepX:2, stepY:2, xl:"x", yl:"y"});
      var rem = num(Pp), vert = Math.abs(rem) > 1e-12, qa = A, qb = B + A * Pp;
      if (vert) S.draw.line(c, ax.X(Pp), ax.T, ax.X(Pp), ax.B, P.red, 1.5, [6, 5]);
      if (A === 0 && vert) S.draw.line(c, ax.L, ax.Y(B), ax.R, ax.Y(B), P.green, 1.5, [6, 5]);
      if (A !== 0 && vert){ c.ctx.save(); c.ctx.beginPath(); c.ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); c.ctx.clip(); S.draw.line(c, ax.L, ax.Y(qa * ax.x0 + qb), ax.R, ax.Y(qa * ax.x1 + qb), P.violet, 1.5, [6, 5]); c.ctx.restore(); }
      S.draw.fn(c, ax, function(x){ return Math.abs(x - Pp) < 1e-9 ? NaN : num(x)/(x - Pp); }, P.acc, 2.6);
      if (vert) S.draw.label(c, "↔ x = " + F(Pp, 0), ax.X(Pp) + (Pp > 2 ? -8 : 8), ax.B - 14, {color:P.red, align:Pp > 2 ? "right" : "left", size:11.5});
      if (A === 0 && vert) S.draw.label(c, "y = " + F(B, 0), ax.R - 8, ax.Y(B) - 14, {color:P.green, align:"right", size:11.5});
      if (A !== 0 && vert) S.draw.label(c, "y = " + lin(qa, qb), ax.R - 8, Math.max(ax.T + 12, Math.min(ax.B - 12, ax.Y(qa * ax.x1 + qb) + (qa > 0 ? 16 : -16))), {color:P.violet, align:"right", size:11.5});
      var holeY = !vert ? (A === 0 ? B : qa * Pp + qb) : null;
      if (!vert) hole(c, ax, Pp, holeY, P.acc);
      ro.set(0, vert ? "x = " + F(Pp, 0) : (A === 0 && B === 0 && C === 0 ? "—" : "aucune (trou)"));
      ro.set(1, A === 0 ? (!vert ? "aucune (f constante)" : B !== 0 ? "y = " + F(B, 0) : "y = 0") : "aucune");
      ro.set(2, A !== 0 && !vert ? "aucune (f est une droite)" : A !== 0 ? "y = " + lin(qa, qb) : "aucune");
      var m = "f(x) = (" + poly(A, B, C) + ") / " + (Pp === 0 ? "x" : "(" + xp(Pp) + ")");
      if (A !== 0) m += "<br>Division : " + poly(A, B, C) + " = " + (Pp === 0 ? "x" : "(" + xp(Pp) + ")") + "·(" + lin(qa, qb) + ")" + (rem === 0 ? "" : sg(rem)) + ", donc f(x) = " + lin(qa, qb) + (rem === 0 ? "." : sg(rem).replace(/(\d+(?:,\d+)?)$/, "$1") + "/" + (Pp === 0 ? "x" : "(" + xp(Pp) + ")") + " et le dernier terme tend vers 0 en ±∞.");
      if (!vert) m += "<br><b>Le numérateur s'annule en p : la fraction se simplifie, il y a un trou en (" + F(Pp, 0) + " ; " + F(holeY, 0) + "), pas d'asymptote verticale.</b>";
      nt.set(m, vert ? "ok" : "warn");
    });
  }
});

/* 2. Courbe qui traverse son asymptote */
SFA.sim({
  id:"m5-c04-croise", ch:"c04", tag:"Idée reçue",
  titre:"Une courbe peut croiser son asymptote horizontale",
  resume:"f(x) = (2x² + kx)/(x² + 1) coupe y = 2 puis s'en approche.",
  but:"Fais glisser le point sur la courbe et surveille le signe de f(x) − 2. Change k : où a lieu le croisement ?",
  aRetenir:"Une asymptote décrit le comportement en l'infini (ou près d'un point où f explose), pas ce qui se passe entre-temps. f(x) = 2 ⇔ kx = 2 ⇔ x = 2/k : la courbe croise y = 2 en x = 2/k, puis s'en rapproche sans la recouper.",
  piege:"« Une courbe ne coupe jamais son asymptote » est faux pour une asymptote horizontale ou oblique. C'est (presque) vrai pour une asymptote verticale : la fonction n'est pas définie en ce x.",
  build:function(k, S){
    var c = k.canvas(420);
    var kk = k.slider("k", -6, 6, 0.5, 3, "");
    var x = k.slider("Abscisse du point", -12, 12, 0.25, -1, "");
    var ro = k.readouts(["f(x)", "f(x) − 2", "Position"]);
    var nt = k.note("", "ok");
    var ax;
    c.pointer(function(type, p){ if (type === "down" || type === "drag"){ x.set(Math.max(-12, Math.min(12, Math.round(ax.ix(p.x) * 4) / 4))); k.redraw(); } });
    k.draw(function(){
      c.clear(); var K = kk.value, f = function(t){ return (2*t*t + K*t)/(t*t + 1); };
      ax = S.draw.axes(c, {x0:-12, x1:12, y0:-3, y1:7, stepX:2, stepY:1, xl:"x", yl:"y"});
      S.draw.line(c, ax.L, ax.Y(2), ax.R, ax.Y(2), P.green, 1.6, [6, 5]);
      S.draw.fn(c, ax, f, P.acc, 2.6);
      if (K !== 0){ var x0 = 2 / K; if (Math.abs(x0) <= 12) S.draw.dot(c, ax.X(x0), ax.Y(2), 6, P.amber); }
      var y = f(x.value); S.draw.dot(c, ax.X(x.value), ax.Y(y), 6, P.red);
      var d = y - 2; ro.set(0, F(y, 3)); ro.set(1, F(d, 3)); ro.set(2, Math.abs(d) < 1e-9 ? "sur l'asymptote" : d > 0 ? "au-dessus" : "en dessous");
      nt.set(K === 0 ? "k = 0 : f(x) − 2 = −2/(x² + 1) est toujours négatif : la courbe reste sous y = 2 et ne la coupe pas." : "f(x) − 2 = (kx − 2)/(x² + 1) change de signe en x = 2/k = " + F(2 / K, 2) + " (point orange) : c'est le seul croisement. Pour x grand, f(x) − 2 ≈ k/x → 0 : le côté dépend du signe de k et de x.", "ok");
    });
  }
});

/* 3. Continuité : le crayon */
var SC = {
  a:{n:"Continue : f(x) = x + 1", fL:function(x){ return x + 1; }, fR:function(x){ return x + 1; }, f2:3, lg:3, ld:3},
  b:{n:"Trou : f(2) n'existe pas", fL:function(x){ return x + 1; }, fR:function(x){ return x + 1; }, f2:NaN, lg:3, ld:3},
  c:{n:"Point déplacé : f(2) = 1", fL:function(x){ return x + 1; }, fR:function(x){ return x + 1; }, f2:1, lg:3, ld:3},
  d:{n:"Saut : 3 à gauche, 4 à droite", fL:function(x){ return x + 1; }, fR:function(x){ return x + 2; }, f2:3, lg:3, ld:4},
  e:{n:"Asymptote verticale : 3 + 1/(x − 2)", fL:function(x){ return 3 + 1/(x - 2); }, fR:function(x){ return 3 + 1/(x - 2); }, f2:NaN, lg:-Infinity, ld:Infinity}
};
SFA.sim({
  id:"m5-c04-continuite", ch:"c04", tag:"Critère",
  titre:"Continue en 2 ? Le crayon et le critère",
  resume:"Trois conditions à vérifier : f(2) existe, la limite existe, elles sont égales.",
  but:"Choisis un cas, puis glisse le crayon le long de la courbe (souris, doigt ou curseur) : passe-t-il en 2 sans se lever ? Compare avec les trois voyants du critère.",
  aRetenir:"f est continue en a si (1) f(a) existe, (2) lim f(x) existe (limites gauche et droite égales), (3) lim f(x) = f(a). Si l'une des trois conditions échoue, f est discontinue en a.",
  piege:"« On peut tracer sans lever le crayon » est une image, pas un critère : une fonction peut être continue sur son domaine tout en ayant une asymptote (1/x est continue en tout x ≠ 0, mais pas définie en 0).",
  build:function(k, S){
    var c = k.canvas(430);
    var sel = k.select("Cas", Object.keys(SC).map(function(q){ return [q, SC[q].n]; }), "a");
    var x = k.slider("Position du crayon x", 0, 4, 0.05, 0.8, "");
    var run = k.loop(function(dt){ var v = x.value + dt * 0.8; if (v >= 4){ v = 4; run.pause(); } x.set(v); k.redraw(); });
    k.button("▶ Tracer la courbe d'un trait", function(){ x.set(0); run.play(); }, true);
    var ro = k.readouts(["① f(2) existe ?", "② limite existe ?", "③ limite = f(2) ?", "Continue en 2 ?"]);
    var nt = k.note("", "ok");
    var ax = null;
    c.pointer(function(type, p){ if (ax && (type === "down" || type === "drag")){ run.pause(); x.set(Math.round(Math.max(0, Math.min(4, ax.ix(p.x))) / 0.05) * 0.05); k.redraw(); } });
    k.draw(function(){
      var d = SC[sel.value]; c.clear();
      ax = S.draw.axes(c, {x0:0, x1:4, y0:-1, y1:7, stepX:1, stepY:1, xl:"x", yl:"y"});
      var xv = x.value, e1 = isFinite(d.f2), e2 = d.lg === d.ld, e3 = e1 && e2 && d.f2 === d.lg;
      S.draw.line(c, ax.X(2), ax.T, ax.X(2), ax.B, P.light, 1.5, [5, 4]);
      /* courbe complète en pâle, trace du crayon en épais */
      piece(c, ax, d.fL, 0, 2 - 1e-9, S.draw.tint(P.acc, 0.22)); piece(c, ax, d.fR, 2 + 1e-9, 4, S.draw.tint(P.acc, 0.22));
      piece(c, ax, d.fL, 0, Math.min(xv, 2 - 1e-9), P.acc); if (xv > 2) piece(c, ax, d.fR, 2 + 1e-9, xv, P.acc);
      if (isFinite(d.lg) && isFinite(d.ld)){ if (!e1 || d.f2 !== d.lg) hole(c, ax, 2, d.lg, P.acc); if (d.ld !== d.lg) hole(c, ax, 2, d.ld, P.acc); }
      if (e1) S.draw.dot(c, ax.X(2), ax.Y(d.f2), 5.5, P.acc);
      var atJ = Math.abs(xv - 2) < 1e-9, y = atJ ? d.f2 : (xv < 2 ? d.fL(xv) : d.fR(xv));
      var lifted = !e3 && xv >= 2 - 1e-9;
      if (!e3 && xv > 2 && isFinite(d.lg) && isFinite(d.ld)){ S.draw.line(c, ax.X(2), ax.Y(d.lg), ax.X(2), ax.Y(d.ld), P.red, 2, [4, 4]); S.draw.label(c, "le crayon a dû sauter", ax.X(2) + 8, (ax.Y(d.lg) + ax.Y(d.ld)) / 2, {color:P.red, align:"left", size:11}); }
      if (!e3 && xv > 2 && !isFinite(d.lg)) S.draw.label(c, "le crayon est parti à l'infini", ax.X(2) + 8, ax.T + 30, {color:P.red, align:"left", size:11});
      var py = isFinite(y) ? Math.max(ax.T, Math.min(ax.B, ax.Y(y))) : null;
      if (py !== null){ S.draw.glow(c, ax.X(xv), py, 20, P.red, 0.35); S.draw.dot(c, ax.X(xv), py, 5.5, P.red); pencil(c, S, ax.X(xv), py, lifted && xv > 2 + 1e-9, P.amber); }
      else if (atJ) S.draw.label(c, "f(2) n'existe pas", ax.X(2) + 8, ax.Y(2), {color:P.red, align:"left"});
      /* voyants */
      var bx = ax.R - 188, by = ax.B - 130;
      S.draw.panel(c, bx, by, 182, 112, {title:null});
      [[e1, "① f(2) existe"], [e2, "② lim existe (G = D)"], [e3, "③ lim = f(2)"]].forEach(function(q, i){
        var cy = by + 22 + i * 24; c.ctx.beginPath(); c.ctx.arc(bx + 18, cy, 8, 0, 7); c.ctx.fillStyle = q[0] ? P.green : P.red; c.ctx.fill();
        S.draw.text(c, q[0] ? "✓" : "✗", bx + 18, cy + 1, {size:12, color:"#fff"}); S.draw.text(c, q[1], bx + 34, cy, {align:"left", size:12});
      });
      S.draw.label(c, e3 ? "CONTINUE en 2" : "DISCONTINUE en 2", bx + 91, by + 96, {color:e3 ? P.green : P.red, size:12.5});
      ro.set(0, e1 ? "oui (" + F(d.f2, 0) + ")" : "non"); ro.set(1, e2 ? "oui (" + inf(d.lg) + ")" : "non (" + inf(d.lg) + " ≠ " + inf(d.ld) + ")");
      ro.set(2, e3 ? "oui" : "non"); ro.set(3, e3 ? "OUI" : "NON");
      nt.set(e3 ? "Les trois conditions sont vraies : le crayon passe en 2 sans se lever." : "Il manque au moins une condition : " + (!e1 ? "f(2) n'existe pas. " : "") + (!e2 ? "Les limites gauche et droite diffèrent. " : "") + (e1 && e2 && !e3 ? "La limite vaut " + inf(d.lg) + " mais f(2) = " + F(d.f2, 0) + ". " : "") + "Le crayon doit se lever ou ne peut pas passer.", e3 ? "ok" : "warn");
    });
  }
});

/* 4. Prolongement par continuité */
SFA.sim({
  id:"m5-c04-prolongement", ch:"c04", tag:"Défi",
  titre:"Boucher le trou : prolongement par continuité",
  resume:"Trouve la valeur à placer en a pour recoller la courbe.",
  but:"Pour f(x) = (x² − a²)/(x − a), choisis a puis glisse le point rouge vers le haut ou le bas pour fixer la valeur c en x = a. Défi : recolle la courbe ! Compare avec |x − a|/(x − a), qui ne se laisse pas boucher.",
  aRetenir:"Si lim f(x) = L existe en a (finie) alors que f(a) n'existe pas, on prolonge f par continuité en posant f(a) = L. Si les limites à gauche et à droite diffèrent, aucun prolongement n'est possible.",
  piege:"On ne peut pas « boucher » un saut ni une asymptote verticale : il n'existe aucune valeur c qui convienne.",
  build:function(k, S){
    var c = k.canvas(430);
    var ty = k.seg("Fonction", [["A", "(x² − a²)/(x − a)"], ["B", "|x − a|/(x − a)"]], "A");
    var a = k.slider("a", -3, 3, 0.5, 1, "");
    var v = k.slider("Valeur c choisie en x = a", -8, 8, 0.5, 0, "");
    var ro = k.readouts(["Limite en a", "c = f(a)", "Continue en a ?"]);
    var nt = k.note("", "ok");
    var ax = null, drag = false;
    c.pointer(function(type, p){
      if (!ax) return;
      if (type === "down"){ drag = Math.hypot(p.x - ax.X(a.value), p.y - ax.Y(v.value)) < 36; }
      if ((type === "drag" || type === "down") && drag){ v.set(Math.round(Math.max(-8, Math.min(8, ax.iy(p.y))) * 2) / 2); k.redraw(); }
      if (type === "up") drag = false;
    });
    k.draw(function(){
      c.clear(); var A = a.value, C = v.value, B = ty.value === "B";
      ax = S.draw.axes(c, {x0:-6, x1:6, y0:-8, y1:8, stepX:2, stepY:2, xl:"x", yl:"y"});
      var f = B ? function(x){ return Math.abs(x - A) < 1e-12 ? NaN : Math.abs(x - A)/(x - A); } : function(x){ return Math.abs(x - A) < 1e-12 ? NaN : x + A; };
      var lg = B ? -1 : 2 * A, ld = B ? 1 : 2 * A, ok = lg === ld, win = ok && Math.abs(C - lg) < 1e-9;
      S.draw.line(c, ax.X(A), ax.T, ax.X(A), ax.B, P.light, 1.4, [5, 4]);
      piece(c, ax, f, -6, A - 1e-9, P.acc); piece(c, ax, f, A + 1e-9, 6, P.acc);
      if (ok) hole(c, ax, A, lg, P.acc); else { hole(c, ax, A, lg, P.acc); hole(c, ax, A, ld, P.acc); }
      if (ok){ S.draw.line(c, ax.L, ax.Y(lg), ax.X(A), ax.Y(lg), P.green, 1.2, [4, 4]); S.draw.label(c, "limite = " + F(lg, 1), ax.L + 8, ax.Y(lg) - 12, {color:P.green, align:"left", size:11}); }
      var col = win ? P.green : P.red;
      S.draw.glow(c, ax.X(A), ax.Y(C), win ? 30 : 22, col, win ? 0.6 : 0.4); S.draw.dot(c, ax.X(A), ax.Y(C), 7.5, col);
      S.draw.label(c, win ? "✓ recollé !" : "↕ c = " + F(C, 1), ax.X(A) + 14, ax.Y(C) + (C > 6 ? 14 : -14), {color:col, align:"left"});
      ro.set(0, ok ? F(lg, 1) : "n'existe pas"); ro.set(1, F(C, 1)); ro.set(2, win ? "OUI" : "NON");
      nt.set(!ok ? "Limite gauche −1, limite droite +1 : saut. Quelle que soit c, la courbe ne se raccorde pas : <b>pas de prolongement possible</b>." : (win ? "Recollé : f(x) = x" + sg(A) + " pour tout x, y compris en a. La droite est complète." : "Pour x ≠ a, f(x) = x" + sg(A) + ", qui tend vers 2a = " + F(lg, 1) + ". Tu as mis c = " + F(C, 1) + " : un point isolé reste décollé. Pose c = " + F(lg, 1) + "."), win ? "ok" : "warn");
    });
  }
});
})();
