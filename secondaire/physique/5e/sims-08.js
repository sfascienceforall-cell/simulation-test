/* Chapitre 8 · Champ et force électriques */
(function(){
var K = 9.0e9, QE = 1.6e-19, ME = 9.11e-31, MP = 1.67e-27;

function Efield(ch, x, y){
  var ex = 0, ey = 0;
  ch.forEach(function(c){ var dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy + 1e-9, r = Math.sqrt(r2), q = K * c.q / (r2 * r); ex += q * dx; ey += q * dy; });
  return [ex, ey];
}
/* ligne de champ partant de (x0,y0) ; sens +1 (suit E) ou −1 */
function trace(ch, x0, y0, sgn, bnd){
  var pts = [[x0, y0]], x = x0, y = y0, ds = 0.012;
  for (var i = 0; i < 1200; i++){
    var e = Efield(ch, x, y), n = Math.hypot(e[0], e[1]); if (n < 1e-9) break;
    var mx = x + sgn * e[0] / n * ds / 2, my = y + sgn * e[1] / n * ds / 2, e2 = Efield(ch, mx, my), n2 = Math.hypot(e2[0], e2[1]); if (n2 < 1e-9) break;
    x += sgn * e2[0] / n2 * ds; y += sgn * e2[1] / n2 * ds; pts.push([x, y]);
    if (x < bnd.x0 || x > bnd.x1 || y < bnd.y0 || y > bnd.y1) break;
    var stop = false; ch.forEach(function(c){ if (c.q * sgn < 0 && Math.hypot(x - c.x, y - c.y) < 0.045) stop = true; if (c.q * sgn > 0 && false) stop = false; });
    if (stop) break;
  }
  return pts;
}

SFA.sim({
  id: "p5-c08-deux-charges", ch: "c08", tag: "Classique",
  titre: "Deux charges : force de Coulomb et lignes de champ",
  resume: "Charges et distance → force, attraction ou répulsion, lignes de champ.",
  but: "Règle les deux charges (positives ou négatives) et leur distance, ou fais glisser la charge de droite. Compare la force quand la distance double. Observe où partent et où arrivent les lignes de champ.",
  aRetenir: "Loi de Coulomb : F = k·|q₁·q₂|/d² (k ≈ 9,0·10⁹ N·m²/C²). Charges de même signe : répulsion ; de signes contraires : attraction. Les lignes de champ partent des charges + et arrivent sur les charges −, ne se croisent jamais et sont plus serrées là où le champ est plus intense.",
  piege: "Les lignes de champ ne sont pas des trajectoires : une charge libre qui part du repos suit d'abord une ligne, mais pas ensuite si la ligne est courbe. Et les deux charges subissent des forces de même valeur, même si l'une est plus grande que l'autre.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var q1 = k.slider("Charge q₁ (à gauche)", -5, 5, 0.5, 3, "µC");
    var q2 = k.slider("Charge q₂ (à droite)", -5, 5, 0.5, -3, "µC");
    var d = k.slider("Distance entre les charges", 0.2, 2, 0.05, 1, "m");
    var ro = k.readouts(["Force sur chaque charge", "Nature", "F si d double", "F si d/2"]);
    var nt = k.note("", ""), f;
    c.pointer(function(type, p){ if (!f || (type !== "down" && type !== "drag")) return; var x = f.ix(p.x); var dd = Math.round((x * 2) * 20) / 20; d.set(P5.clamp(dd, 0.2, 2)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx;
      f = P5.frame(c, {x0: -1.6, x1: 1.6, y0: -1, y1: 1}, {grid: false});
      var ch = [{x: -d.value / 2, y: 0, q: q1.value * 1e-6}, {x: d.value / 2, y: 0, q: q2.value * 1e-6}].filter(function(z){ return z.q !== 0; });
      var bnd = {x0: -1.6, x1: 1.6, y0: -1, y1: 1};
      var pos = ch.filter(function(z){ return z.q > 0; }), src = pos.length ? pos : ch, sg = pos.length ? 1 : -1;
      var qmax = 0; ch.forEach(function(z){ qmax = Math.max(qmax, Math.abs(z.q)); });
      ctx.save(); ctx.strokeStyle = "#7d8fb5"; ctx.fillStyle = "#7d8fb5"; ctx.lineWidth = 1.4;
      src.forEach(function(s){
        var n = Math.max(4, Math.round(16 * Math.abs(s.q) / qmax));
        for (var i = 0; i < n; i++){
          var a = 2 * Math.PI * (i + 0.5) / n, pts = trace(ch, s.x + 0.05 * Math.cos(a), s.y + 0.05 * Math.sin(a), sg, bnd);
          ctx.beginPath(); pts.forEach(function(p, j){ if (j === 0) ctx.moveTo(f.X(p[0]), f.Y(p[1])); else ctx.lineTo(f.X(p[0]), f.Y(p[1])); }); ctx.stroke();
          if (pts.length > 8){ var j0 = Math.floor(pts.length / 2), A = pts[j0], B = pts[j0 + 1], ang = Math.atan2(-(B[1] - A[1]), B[0] - A[0]) + (sg < 0 ? Math.PI : 0);
            var X = f.X(A[0]), Y = f.Y(A[1]); ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill(); ctx.restore(); }
        }
      });
      ctx.restore();
      [[-d.value / 2, q1.value], [d.value / 2, q2.value]].forEach(function(z){
        var col = z[1] > 0 ? pal.red : z[1] < 0 ? pal.acc : pal.grey;
        S.draw.dot(c, f.X(z[0]), f.Y(0), 14, col); S.draw.text(c, z[1] > 0 ? "+" : z[1] < 0 ? "−" : "0", f.X(z[0]), f.Y(0), {color: "#fff", size: 16});
      });
      var F = K * Math.abs(q1.value * q2.value) * 1e-12 / (d.value * d.value), attr = q1.value * q2.value < 0;
      if (F > 0){
        var L = 20 + 60 * Math.min(1, F / 10), s1 = attr ? 1 : -1;
        P5.vec(c, f.X(-d.value / 2), f.Y(0) + 30, f.X(-d.value / 2) + s1 * L, f.Y(0) + 30, pal.amber, "F", {});
        P5.vec(c, f.X(d.value / 2), f.Y(0) + 30, f.X(d.value / 2) - s1 * L, f.Y(0) + 30, pal.amber, "F", {});
      }
      S.draw.text(c, "glisse la charge de droite pour changer d", c.W / 2, c.H - 12, {size: 12, color: pal.grey});
      ro.set(0, F > 0 ? S.sci(F, 2) + " N" : "0"); ro.set(1, F === 0 ? "—" : attr ? "attraction" : "répulsion");
      ro.set(2, F > 0 ? S.sci(F / 4, 2) + " N" : "0"); ro.set(3, F > 0 ? S.sci(F * 4, 2) + " N" : "0");
      nt.set(F === 0 ? "Une des charges est nulle : aucune force, et seul l'autre charge crée un champ." : "F = k·|q₁·q₂|/d² = 9,0·10⁹ × " + S.fmt(Math.abs(q1.value * q2.value), 2) + "·10⁻¹² / " + S.fmt(d.value * d.value, 2) + " = " + S.sci(F, 2) + " N. " + (Math.abs(q1.value) !== Math.abs(q2.value) ? "Les deux charges sont inégales : il part plus de lignes de la plus grande, mais les forces ont la même valeur." : ""), "");
    });
  }
});

SFA.sim({
  id: "p5-c08-charge-essai", ch: "c08", tag: "Défi",
  titre: "Charge d'essai : le champ est une somme de vecteurs",
  resume: "Promène une petite charge d'essai entre deux sphères chargées : E₁ + E₂ donne le champ, F = q·E la force. Trouve le point où le champ s'annule.",
  but: "Fais glisser la charge d'essai entre les deux sphères chargées. Les flèches E₁ et E₂ s'additionnent en E ; le graphe donne la valeur de E le long de la ligne pointillée. Lâche la charge pour voir la force F = q·E la mettre en mouvement. Défi : trouve le point où E = 0 pour trois couples de charges.",
  aRetenir: "Une charge source Q crée en un point à la distance r un champ de valeur E = k·|Q|/r², qui s'éloigne d'une charge + et pointe vers une charge −. Le champ total est la somme vectorielle E = E₁ + E₂ ; une charge d'essai q y subit F = q·E (même sens que E si q > 0, sens opposé si q < 0).",
  piege: "Champ ne veut pas dire force : le champ existe même sans charge d'essai, et il ne dépend pas de q. Un point où E = 0 n'est pas un point « sans charges autour » : les deux contributions s'y compensent exactement. Avec deux charges de signes contraires, ce point est en dehors du segment, du côté de la plus petite charge.",
  build: function(k, S){
    var K = 9.0e9;
    var c = k.canvas(0, {ratio: 0.66}), g = k.canvas(170);
    var q1 = k.slider("Charge source q₁ (à gauche, x = −0,5 m)", -5, 5, 0.5, 3, "µC", function(){ rel = null; });
    var q2 = k.slider("Charge source q₂ (à droite, x = +0,5 m)", -5, 5, 0.5, 3, "µC", function(){ rel = null; });
    var qt = k.slider("Charge d'essai q", -5, 5, 0.5, 1, "nC");
    var xt = k.slider("Position x de la charge d'essai", -1.5, 1.5, 0.01, 0.25, "m", function(){ rel = null; });
    var yt = k.slider("Position y de la charge d'essai", -0.9, 0.9, 0.01, 0.35, "m", function(){ rel = null; });
    var DEF = [[3, 3, "q₁ = q₂ = +3 µC"], [4, 1, "q₁ = +4 µC, q₂ = +1 µC"], [4, -1, "q₁ = +4 µC, q₂ = −1 µC"]], di = -1, found = [0, 0, 0];
    k.button("Défi : où E = 0 ?", function(){ di = (di + 1) % 3; q1.set(DEF[di][0]); q2.set(DEF[di][1]); xt.set(-1.2); yt.set(0.5); rel = null; }, true);
    var rel = null;   /* charge lâchée : {x, y, vx, vy, trail} (mouvement accéléré, masse fictive) */
    var lp = k.loop(function(dt){
      if (!rel){ lp.pause(); return; }
      for (var i = 0; i < 20; i++){
        var e = E(rel.x, rel.y), a = qt.value * 2e-5;   /* masse fictive : seuls le sens et l'allure comptent */
        rel.vx += e[0] * a * dt / 20; rel.vy += e[1] * a * dt / 20;
        var sp = Math.hypot(rel.vx, rel.vy); if (sp > 2.5){ rel.vx *= 2.5 / sp; rel.vy *= 2.5 / sp; }
        rel.x += rel.vx * dt / 20; rel.y += rel.vy * dt / 20;
      }
      rel.trail.push([rel.x, rel.y]); rel.t += dt;
      var hit = Math.hypot(rel.x + 0.5, rel.y) < 0.08 || Math.hypot(rel.x - 0.5, rel.y) < 0.08;
      if (hit || Math.abs(rel.x) > 1.7 || Math.abs(rel.y) > 1.1 || rel.t > 6){ rel.end = hit ? "collée sur une sphère" : rel.t > 6 ? "presque immobile" : "sortie du cadre"; lp.pause(); }
      k.redraw();
    });
    k.button("Lâcher la charge d'essai", function(){ rel = {x: xt.value, y: yt.value, vx: 0, vy: 0, trail: [[xt.value, yt.value]], t: 0}; lp.play(); });
    var ro = k.readouts(["E₁", "E₂", "E total", "Force F = q·E", "Direction de E"]);
    var nt = k.note("", ""), f, gx;
    function E(x, y){
      var ex = 0, ey = 0;
      [[-0.5, q1.value], [0.5, q2.value]].forEach(function(s){ var dx = x - s[0], dy = y, r2 = dx * dx + dy * dy + 1e-6, r = Math.sqrt(r2), v = K * s[1] * 1e-6 / (r2 * r); ex += v * dx; ey += v * dy; });
      return [ex, ey];
    }
    function E1(x, y, xs, q){ var dx = x - xs, dy = y, r2 = dx * dx + dy * dy + 1e-6, r = Math.sqrt(r2), v = K * q * 1e-6 / (r2 * r); return [v * dx, v * dy]; }
    P5x.drag(c, k, function(){ return f ? [{x: f.X(xt.value), y: f.Y(yt.value), r: 34, set: function(px, py){ rel = null; xt.set(Math.round(P5.clamp(f.ix(px), -1.5, 1.5) * 100) / 100); yt.set(Math.round(P5.clamp(f.iy(py), -0.9, 0.9) * 100) / 100); }}] : null; });
    P5x.drag(g, k, function(){ return gx ? [{x: gx.X(xt.value), y: gx.Y(Math.min(Math.hypot.apply(null, E(xt.value, yt.value)) / 1000, gx.y1)), r: 30, set: function(px){ rel = null; xt.set(Math.round(P5.clamp(gx.ix(px), -1.5, 1.5) * 100) / 100); }}] : null; });
    function sphere(x, y, q){
      var pal = S.draw.palette, col = q > 0 ? "#d6453a" : q < 0 ? "#2f64c8" : "#8a95a3";
      if (q) S.draw.glow(c, x, y, 22 + 5 * Math.abs(q), col, 0.35);
      P5x.ball(c, x, y, 15, col);
      S.draw.text(c, q > 0 ? "+" : q < 0 ? "−" : "0", x, y + 1, {color: "#fff", size: 17});
      P5x.tag(c, (q > 0 ? "+" : q < 0 ? "−" : "") + S.fmt(Math.abs(q), 1) + " µC", x, y + 30, col === "#8a95a3" ? "#4b5868" : col, {size: 11});
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H;
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, H, [[0, "#f7f9fc"], [1, "#eaf0f7"]]); ctx.fillRect(0, 0, W, H);
      f = P5.frame(c, {x0: -1.6, x1: 1.6, y0: -1, y1: 1}, {grid: true, axes: false});
      /* carte du champ : petites flèches grises dont l'opacité suit la valeur */
      var step = W < 420 ? 0.2 : 0.16;
      for (var gx0 = -1.5; gx0 <= 1.51; gx0 += step) for (var gy0 = -0.9; gy0 <= 0.91; gy0 += step){
        var e = E(gx0, gy0), n = Math.hypot(e[0], e[1]); if (n < 1) continue;
        var a = Math.min(0.55, 0.08 + Math.log10(1 + n / 2e3) * 0.18), L = 9, ux = e[0] / n, uy = e[1] / n, X0 = f.X(gx0), Y0 = f.Y(gy0);
        ctx.strokeStyle = "rgba(70,90,130," + a.toFixed(2) + ")"; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(X0 - ux * L / 2, Y0 + uy * L / 2); ctx.lineTo(X0 + ux * L / 2, Y0 - uy * L / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X0 + ux * L / 2 + ux * 3, Y0 - uy * L / 2 - uy * 3); ctx.lineTo(X0 + ux * L / 2 - uy * 2.5, Y0 - uy * L / 2 - ux * 2.5); ctx.lineTo(X0 + ux * L / 2 + uy * 2.5, Y0 - uy * L / 2 + ux * 2.5); ctx.fill();
      }
      /* ligne de profil (graphe) */
      var py = rel ? rel.y : yt.value, px = rel ? rel.x : xt.value;
      S.draw.line(c, f.X(-1.6), f.Y(py), f.X(1.6), f.Y(py), "rgba(194,106,12,.55)", 1.4, [6, 5]);
      sphere(f.X(-0.5), f.Y(0), q1.value); sphere(f.X(0.5), f.Y(0), q2.value);
      if (di >= 0){ var Dz = DEF[di]; if (found[di]) P5x.tag(c, "trouvé !", f.X(px), f.Y(py) - 26, pal.green, {size: 11}); }
      if (rel){ ctx.strokeStyle = S.draw.tint(pal.violet, 0.7); ctx.lineWidth = 2; ctx.beginPath(); rel.trail.forEach(function(p, i){ if (i) ctx.lineTo(f.X(p[0]), f.Y(p[1])); else ctx.moveTo(f.X(p[0]), f.Y(p[1])); }); ctx.stroke(); }
      var X = f.X(px), Y = f.Y(py);
      var e1 = E1(px, py, -0.5, q1.value), e2 = E1(px, py, 0.5, q2.value), et = [e1[0] + e2[0], e1[1] + e2[1]];
      var n1 = Math.hypot(e1[0], e1[1]), n2 = Math.hypot(e2[0], e2[1]), nT = Math.hypot(et[0], et[1]), mx = Math.max(n1, n2, nT, 1), sc = Math.min(W, H) * 0.2 / mx;
      if (!rel){
        S.draw.line(c, X + e1[0] * sc, Y - e1[1] * sc, X + et[0] * sc, Y - et[1] * sc, "#9bb0d8", 1.4, [4, 4]);
        S.draw.line(c, X + e2[0] * sc, Y - e2[1] * sc, X + et[0] * sc, Y - et[1] * sc, "#e6b98a", 1.4, [4, 4]);
        P5.vec(c, X, Y, X + e1[0] * sc, Y - e1[1] * sc, pal.acc, "E₁", {w: 2.2, size: 12});
        P5.vec(c, X, Y, X + e2[0] * sc, Y - e2[1] * sc, pal.amber, "E₂", {w: 2.2, size: 12});
        if (nT > 0.02 * mx) P5.vec(c, X, Y, X + et[0] * sc, Y - et[1] * sc, pal.green, "E", {w: 3.6, size: 13});
      } else if (nT > 1){
        var fs = qt.value >= 0 ? 1 : -1, Lf = 34;
        P5.vec(c, X, Y, X + fs * et[0] / nT * Lf, Y - fs * et[1] / nT * Lf, pal.violet, "F", {w: 3, size: 12});
      }
      P5x.ball(c, X, Y, 7, qt.value >= 0 ? "#e2675c" : "#5a86d8");
      if (!rel) P5x.handle(c, X, Y, pal.violet, 10, false);
      S.draw.text(c, qt.value >= 0 ? "+" : "−", X, Y + 0.5, {size: 11, color: pal.violet});
      P5x.hint(c, rel ? (rel.end ? "Charge " + rel.end + " · déplace-la pour recommencer" : "Mouvement sous F = q·E (accéléré)") : "Glisse la charge d'essai", {size: 11.5});
      S.draw.text(c, "échelle des flèches : " + (mx >= 1e6 ? S.fmt(mx / 1e6, 2) + " MN/C" : mx >= 1000 ? S.fmt(mx / 1000, 0) + " kN/C" : S.fmt(mx, 0) + " N/C") + " = " + S.fmt(sc * mx, 0) + " px", W - 10, H - 12, {align: "right", size: 11, color: "#5f6b7a"});
      /* graphe : ‖E‖ le long de la ligne pointillée */
      g.clear();
      var ymax = 20; for (var sx2 = -1.6; sx2 <= 1.6; sx2 += 0.02){ var es = E(sx2, py); ymax = Math.max(ymax, Math.hypot(es[0], es[1]) / 1000 * 1.15); } ymax = Math.min(400, ymax);
      gx = S.draw.axes(g, {x0: -1.6, x1: 1.6, y0: 0, y1: ymax, xl: "x (m)", yl: "E (kN/C)", stepX: 0.5, l: 46});
      S.draw.fn(g, gx, function(x){ var e = E(x, py); return Math.min(Math.hypot(e[0], e[1]) / 1000, ymax * 2); }, pal.green, 2.8);
      [[-0.5, q1.value], [0.5, q2.value]].forEach(function(s){ S.draw.line(g, gx.X(s[0]), gx.Y(0), gx.X(s[0]), gx.Y(ymax), s[1] > 0 ? "rgba(214,69,58,.4)" : "rgba(47,100,200,.4)", 1.2, [3, 3]); });
      P5x.handle(g, gx.X(px), gx.Y(Math.min(nT / 1000, ymax)), pal.violet, 7);
      P5x.hint(g, "E le long du pointillé", {x: 8, y: 12, align: "left", size: 11});
      ro.set(0, S.sci(n1, 2) + " N/C"); ro.set(1, S.sci(n2, 2) + " N/C"); ro.set(2, S.sci(nT, 2) + " N/C");
      ro.set(3, S.sci(Math.abs(qt.value) * 1e-9 * nT, 2) + " N"); ro.set(4, nT < 1 ? "—" : S.fmt(Math.atan2(et[1], et[0]) * 180 / Math.PI, 0) + " °");
      var zero = nT < 0.05 * Math.max(n1, n2) && Math.max(n1, n2) > 1e3;
      if (di >= 0 && !rel){
        var match = q1.value === DEF[di][0] && q2.value === DEF[di][1];
        if (zero && match) found[di] = 1;
        var tot = found[0] + found[1] + found[2];
        nt.set("<b>Défi " + (di + 1) + "/3 · " + DEF[di][2] + "</b> : place la charge d'essai là où E = 0 (moins de 5 % de E₁). " + (!match ? "Remets les charges du défi (bouton)." : zero ? "Trouvé en x = " + S.fmt(px, 2) + " m, y = " + S.fmt(py, 2) + " m : E₁ et E₂ sont opposés et égaux." + (di === 2 ? " Avec des charges de signes contraires, ce point est hors du segment, du côté de la plus petite charge." : "") : "Indice : cherche sur l'axe des charges (y = 0), là où la courbe du graphe touche zéro.") + " · " + tot + "/3 trouvés.", zero && match ? "ok" : "");
      } else if (rel) nt.set("La charge d'essai " + (qt.value >= 0 ? "(q > 0) suit le sens de E" : "(q < 0) part dans le sens opposé à E") + " : F = q·E. Sa trajectoire ne suit pas forcément une ligne de champ (elle prend de la vitesse). Modèle simplifié : temps accéléré.", "");
      else if (zero) nt.set("E ≈ 0 ici : E₁ et E₂ ont même valeur et des sens opposés. Une charge d'essai posée là ne subit aucune force (équilibre).", "ok");
      else nt.set("E = E₁ + E₂ (somme vectorielle, construction du parallélogramme) ; F = q·E = " + S.sci(Math.abs(qt.value) * 1e-9 * nT, 2) + " N, " + (qt.value >= 0 ? "dans le sens de E (q > 0)." : "dans le sens opposé à E (q < 0)."), "");
    });
  }
});

SFA.sim({
  id: "p5-c08-condensateur", ch: "c08", tag: "Champ uniforme",
  titre: "Entre deux plaques : champ uniforme et déviation d'une particule",
  resume: "Tension, distance, vitesse → champ E = U/d et trajectoire d'une particule chargée.",
  but: "Une particule traverse deux plaques chargées. Règle la tension et la distance entre les plaques, la vitesse d'entrée, et compare un électron et un proton. À partir de quelle tension la particule touche-t-elle une plaque ?",
  aRetenir: "Entre deux plaques : E = U/d (uniforme). Force constante F = q·E : la particule suit une parabole (comme un projectile) : a = q·E/m et y = ½·a·t² avec t = x/v₀. La déviation est d'autant plus grande que E est grand et v₀ petite.",
  piege: "Le champ uniforme n'est valable qu'entre les plaques (loin des bords). L'électron est dévié vers la plaque +, le proton vers la plaque −. À même champ, le proton, 1 836 fois plus massif, est bien moins dévié (modèle sans pesanteur, qui est négligeable ici).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var U = k.slider("Tension entre les plaques U", 10, 300, 5, 100, "V");
    var d = k.slider("Distance entre les plaques d", 1, 5, 0.5, 3, "cm");
    var v0 = k.slider("Vitesse d'entrée v₀", 5, 30, 1, 15, "·10⁶ m/s");
    var part = k.seg("Particule", [["e", "Électron (−)"], ["p", "Proton (+)"]], "e");
    var pol = k.seg("Plaque du haut", [[1, "+"], [-1, "−"]], 1);
    var ro = k.readouts(["Champ E = U/d", "Accélération a", "Durée dans les plaques", "Déviation à la sortie", "Résultat"]);
    var nt = k.note("", "");
    var Lcm = 4, ph = 0, hits = [], lastKey = "", G0 = {x1: 0, y1: 0, x2: 0, y2: 0, X: null, Y: null, u: 1, hd: 1};
    var lp = k.loop(function(dt){ ph += dt / 2.6; if (ph > 1.15){ ph = 0; } k.redraw(); }); lp.play();
    /* manipulation directe : la plaque du haut (distance d) et la flèche d'entrée (v₀) */
    P5x.drag(c, k, function(){ return [
      {x: G0.x1, y: G0.y1, r: 28, set: function(px, py){ d.set(Math.round(P5.clamp((G0.ym - py) / G0.u * 2, 1, 5) * 2) / 2); }},
      {x: G0.x2, y: G0.y2, r: 26, set: function(px){ v0.set(Math.round(P5.clamp((px - G0.ax - 14) / 1.4, 5, 30))); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx; P5x.sky(c, "#f6f9fd", "#eaf0f8");
      var E = U.value / (d.value / 100), mass = part.value === "e" ? ME : MP, q = (part.value === "e" ? -1 : 1) * QE * pol.value;
      var a = Math.abs(q) * E / mass, V0 = v0.value * 1e6, T = Lcm / 100 / V0;
      var dirUp = (part.value === "e" ? 1 : -1) * pol.value > 0 ? 1 : -1;
      var yL = 0.5 * a * T * T, hit = yL > d.value / 200, tHit = hit ? Math.sqrt(d.value / 100 / a) : T, xHit = V0 * tHit;
      var u = Math.min((c.W - 110) / (Lcm * 1.95), (c.H - 84) / 6.9), x0 = 34, ym = c.H / 2 + 4;
      function X(xcm){ return x0 + (xcm + 0) * u + 34; } function Y(ycm){ return ym - ycm * u; }
      G0.ym = ym; G0.u = u; G0.ax = X(0) - 40;
      var hd = d.value / 2, pc = pol.value > 0 ? pal.red : pal.acc, nc = pol.value > 0 ? pal.acc : pal.red;
      /* lignes de champ entre les plaques (flèches) et plaques métalliques */
      var up = Y(hd), dn = Y(-hd);
      ctx.fillStyle = S.draw.tint(pc, 0.05); ctx.fillRect(X(0), up, Lcm * u, dn - up);
      for (var i = 1; i < 7; i++){ var xx = X(Lcm * i / 7); P5.vec(c, xx, pol.value > 0 ? up + 3 : dn - 3, xx, pol.value > 0 ? dn - 8 : up + 8, "rgba(110,125,150,.55)", "", {w: 1.3}); }
      function plate(y, col, sym, below){ ctx.fillStyle = P5x.lin(ctx, 0, y - 8, 0, y + 8, [[0, P5x.shade(col, 0.3)], [1, col]]); P5x.rr(ctx, X(0), y - 5, Lcm * u, 10, 3); ctx.fill();
        for (var j = 0; j < 8; j++) S.draw.text(c, sym, X(Lcm * (j + 0.5) / 8), y + (below ? 14 : -14), {size: 13, color: col}); }
      plate(up, pc, pol.value > 0 ? "+" : "−", false); plate(dn, nc, pol.value > 0 ? "−" : "+", true);
      P5x.tag(c, "E = " + S.fmt(E, 0) + " V/m, de + vers −", X(Lcm / 2), up - 30, "#4b5868", {size: 11.5});
      /* écran fluorescent et traces */
      var xs = Lcm + 3.5, hS = 3.2, yo = yL * 100 * dirUp, slope = a * T / V0 * dirUp;
      ctx.fillStyle = "#2a3a40"; ctx.fillRect(X(xs) - 2, Y(hS), 5, 2 * hS * u); P5x.tag(c, "écran", X(xs), Y(-hS) + 14, "#4b5868", {size: 11});
      var yS = yo + slope * 3.5, onScreen = !hit && Math.abs(yS) <= hS, keyc = [U.value, d.value, v0.value, part.value, pol.value].join();
      if (keyc !== lastKey){ lastKey = keyc; ph = 0; }
      if (onScreen){ S.draw.glow(c, X(xs), Y(yS), 14, "#46f0a0", 0.5 + 0.3 * (ph > 0.92 ? 1 : 0)); S.draw.dot(c, X(xs), Y(yS), 3.5, "#46f0a0"); }
      /* trajectoire complète en pointillés puis particule animée */
      var xEnd = hit ? xHit * 100 : (Math.abs(yS) <= hS ? xs : Lcm + (hS * Math.sign(yS) - yo) / (slope || 1e-9));
      function yat(xc){ if (xc <= 0) return 0; if (xc <= Lcm) return 100 * 0.5 * a * Math.pow(xc / 100 / V0, 2) * dirUp; return yo + slope * (xc - Lcm); }
      if (hit) xEnd = xHit * 100;
      ctx.strokeStyle = "rgba(224,122,31,.55)"; ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]); ctx.beginPath(); for (var s = 0; s <= 80; s++){ var xc = -2.8 + (xEnd + 2.8) * s / 80, yy = yat(xc); if (s) ctx.lineTo(X(xc), Y(yy)); else ctx.moveTo(X(xc), Y(yy)); } ctx.stroke(); ctx.setLineDash([]);
      var pxc = -2.8 + (xEnd + 2.8) * Math.min(1, ph / 0.92), pyc = yat(pxc);
      if (ph < 1.05){ for (var tr = 6; tr >= 1; tr--){ var xt = pxc - tr * 0.18; if (xt > -2.8) S.draw.dot(c, X(xt), Y(yat(xt)), 2.6, "rgba(224,122,31," + (0.5 - tr * 0.07).toFixed(2) + ")"); }
        P5x.ball(c, X(pxc), Y(pyc), 5.5, part.value === "e" ? "#2f7fd1" : "#c0321d"); S.draw.text(c, part.value === "e" ? "−" : "+", X(pxc), Y(pyc), {size: 9, color: "#fff"}); }
      if (hit && ph >= 0.92) S.draw.glow(c, X(xHit * 100), Y(hd * dirUp), 18, "#ff6b57", 0.8);
      /* poignées : plaque haute et flèche v₀ */
      G0.x1 = X(Lcm) + 4; G0.y1 = up; P5x.handle(c, G0.x1, G0.y1, pc, 7);
      var alen = 14 + v0.value * 1.4; P5.vec(c, X(0) - 40, Y(0), X(0) - 40 + alen, Y(0), pal.green, "v₀", {dy: -14, size: 13, w: 3});
      G0.x2 = X(0) - 40 + alen; G0.y2 = Y(0); P5x.handle(c, G0.x2, G0.y2, pal.green, 6);
      P5x.hint(c, "Tire la plaque du haut (d) ou la flèche verte (v₀)", {y: 14, size: 11.5});
      ro.set(0, S.fmt(E, 0) + " V/m"); ro.set(1, S.sci(a, 2) + " m/s²"); ro.set(2, S.sci(T, 2) + " s");
      ro.set(3, hit ? "—" : S.fmt(yL * 1000, part.value === "e" ? 1 : 3) + " mm"); ro.set(4, hit ? "touche une plaque" : "sort des plaques");
      nt.set(hit ? "La particule touche la plaque (déviation " + S.fmt(yL * 1000, 1) + " mm > d/2 = " + S.fmt(d.value * 5, 1) + " mm). Diminue U, augmente d ou v₀." : "E = U/d = " + S.fmt(E, 0) + " V/m ; la particule est déviée vers la plaque " + (part.value === "e" ? "positive" : "négative") + ". Force électrique ≫ poids (négligé).", hit ? "warn" : "");
    });
  }
});


SFA.sim({
  id: "p5-c08-millikan", ch: "c08", tag: "Expérience",
  titre: "Les gouttelettes de Millikan : mesurer la charge élémentaire",
  resume: "Règle la tension pour immobiliser la gouttelette, puis calcule sa charge.",
  but: "Une gouttelette d'huile chargée est entre deux plaques distantes de 1,0 cm. Règle la tension jusqu'à ce qu'elle reste immobile. Alors q·E = m·g : calcule q, puis q/e. Fais-le pour les quatre gouttelettes : que remarques-tu ?",
  aRetenir: "À l'équilibre : q·E = m·g avec E = U/d, donc q = m·g·d/U. En mesurant plusieurs gouttelettes, Millikan a trouvé des charges toujours multiples entiers d'une même valeur : la charge élémentaire e = 1,6·10⁻¹⁹ C.",
  piege: "Si la tension est trop faible, la gouttelette descend ; trop forte, elle monte (vitesse limite due aux frottements de l'air). On ne mesure q que lorsqu'elle est immobile : sinon le calcul q = m·g·d/U donne des valeurs non entières en multiples de e.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.72});
    var gouttes = {A: {r: 1.0, n: 4}, B: {r: 1.2, n: 6}, C: {r: 0.8, n: 2}, D: {r: 1.5, n: 11}};
    var sel = k.seg("Gouttelette", [["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"]], "A");
    var U = k.slider("Tension U entre les plaques", 0, 800, 1, 300, "V");
    k.button("U − 1 V", function(){ U.set(U.value - 1); });
    k.button("U + 1 V", function(){ U.set(U.value + 1); });
    k.button("Noter la mesure", function(){ note(); }, true);
    k.button("Effacer le carnet", function(){ carnet = {}; });
    var tg = k.toggle("Révéler le nombre de charges élémentaires n (triche !)", false);
    var ro = k.readouts(["Rayon r", "Masse m", "Vitesse de dérive", "q = m·g·d/U", "q / e"]);
    var nt = k.note("", ""), y = 0, G = 9.81, RHO = 875, ETA = 1.8e-5, D = 0.01, carnet = {}, jit = 0;
    function par(){ var g = gouttes[sel.value], m = 4 / 3 * Math.PI * Math.pow(g.r * 1e-6, 3) * RHO, qE = g.n * QE * U.value / D; return {g: g, m: m, qE: qE, vd: (m * G - qE) / (6 * Math.PI * ETA * g.r * 1e-6), Ueq: m * G * D / (g.n * QE)}; }
    function note(){ var p = par(); if (U.value <= 0) return; var qm = p.m * G * D / U.value; carnet[sel.value] = {x: qm / QE, ok: Math.abs(U.value - p.Ueq) / p.Ueq < 0.03}; }
    var lp = k.loop(function(dt){ var p = par(); y += p.vd * 1e6 * 3 * dt; var H = 100; if (y > H) y -= 2 * H; if (y < -H) y += 2 * H; jit += dt; k.redraw(); });
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, p = par(), g = p.g, m = p.m, q = g.n * QE, Ueq = p.Ueq, qE = p.qE, vd = p.vd;
      P5x.sky(c, "#f6f9fd", "#eaf0f8");
      var vw = Math.min(c.W * 0.56, c.H - 20), vx = 10 + vw / 2, vy = c.H / 2, rad = vw / 2;
      /* champ du microscope : disque noir, réticule, plaques */
      ctx.save(); ctx.beginPath(); ctx.arc(vx, vy, rad, 0, 7); ctx.clip();
      ctx.fillStyle = P5x.lin(ctx, 0, vy - rad, 0, vy + rad, [[0, "#0d1a2e"], [1, "#060d1a"]]); ctx.fillRect(vx - rad, vy - rad, vw, vw);
      var top = vy - rad * 0.72, bot = vy + rad * 0.72;
      ctx.fillStyle = "#d84a35"; ctx.fillRect(vx - rad, top - 10, vw, 10); ctx.fillStyle = "#3c74d6"; ctx.fillRect(vx - rad, bot, vw, 10);
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.font = "800 12px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.fillText("+", vx - rad * 0.55, top - 1); ctx.fillText("−", vx - rad * 0.55, bot + 9);
      ctx.strokeStyle = "rgba(120,220,170,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(vx - rad, vy); ctx.lineTo(vx + rad, vy); ctx.moveTo(vx, top); ctx.lineTo(vx, bot); ctx.stroke();
      for (var t = -5; t <= 5; t++){ var yy = vy + t * (bot - top) / 11; ctx.beginPath(); ctx.moveTo(vx - 6, yy); ctx.lineTo(vx + 6, yy); ctx.stroke(); }
      var cy = (top + bot) / 2 + y * ((bot - top) / 2 - 16) / 100, near = Math.abs(U.value - Ueq) / Ueq < 0.01;
      var jx = Math.sin(jit * 23) * 0.9 * (near ? 1.6 : 0.6), jy = Math.cos(jit * 31) * 0.9;
      S.draw.glow(c, vx + jx, cy + jy, 22 + g.r * 6, "#ffd66b", 0.55);
      S.draw.dot(c, vx + jx, cy + jy, 3 + g.r * 1.8, "#fff2b5");
      /* forces */
      var s = 38 / (m * G);
      P5.vec(c, vx + 22, cy, vx + 22, cy + m * G * s, "#e6eefc", "m·g", {dx: 18, size: 11.5, w: 2.4});
      if (qE > 0) P5.vec(c, vx - 22, cy, vx - 22, cy - Math.min(qE * s, 90), "#ff8a78", "q·E", {dx: -18, size: 11.5, w: 2.4});
      ctx.restore();
      ctx.strokeStyle = "#13233a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(vx, vy, rad, 0, 7); ctx.stroke(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(vx, vy, rad + 3, 0, 7); ctx.stroke();
      P5x.tag(c, near ? "Immobile : équilibre !" : vd > 0 ? "La goutte descend" : "La goutte monte", vx, top + 24, near ? "#7be0ae" : "#ff9f90", {size: 12, fill: "rgba(6,13,26,.8)"});
      /* appareil : afficheur de tension et carnet de mesures */
      var ix = vx + rad + 18, iw = c.W - ix - 10;
      if (iw > 110){
        S.draw.display(c, S.fmt(U.value, 0) + " V", ix + iw / 2, 40, {w: Math.min(iw, 150), h: 56, caption: "TENSION U"});
        S.draw.text(c, "d = 1,0 cm", ix + iw / 2, 82, {size: 11.5, color: pal.grey});
        S.draw.panel(c, ix, 98, iw, c.H - 108, {title: "Carnet : q / e mesuré", radius: 10});
        var lx0 = ix + 14, lx1 = ix + iw - 14, ly = 98 + (c.H - 108) * 0.62, nmax = 12;
        S.draw.line(c, lx0, ly, lx1, ly, "#9aa6b6", 1.6);
        for (var n = 0; n <= nmax; n++){ var xx = lx0 + (lx1 - lx0) * n / nmax; S.draw.line(c, xx, ly - 4, xx, ly + 4, "#9aa6b6", 1.2); if (n % 2 === 0) S.draw.text(c, n + "", xx, ly + 15, {size: 10.5, color: pal.grey}); }
        Object.keys(carnet).forEach(function(key, i){ var e = carnet[key], xx = lx0 + (lx1 - lx0) * Math.min(e.x, nmax) / nmax, col = e.ok ? pal.green : pal.red; S.draw.dot(c, xx, ly - 14 - (i % 2) * 14, 5.5, col); S.draw.text(c, key, xx, ly - 14 - (i % 2) * 14 - 11, {size: 10.5, color: col}); });
        P5x.hint(c, Object.keys(carnet).length ? "vert : à l'équilibre" : "immobilise, puis « Noter »", {x: ix + 10, y: 98 + (c.H - 108) - 12, size: 10.5});
      }
      var qm = U.value > 0 ? m * G * D / U.value : NaN;
      ro.set(0, S.fmt(g.r, 1) + " µm"); ro.set(1, S.sci(m, 2) + " kg"); ro.set(2, S.fmt(Math.abs(vd) * 1e6, 1) + " µm/s " + (near ? "(≈ 0)" : vd > 0 ? "↓" : "↑"));
      ro.set(3, U.value > 0 ? S.sci(qm, 3) + " C" : "—"); ro.set(4, U.value > 0 ? S.fmt(qm / QE, 2) : "—");
      nt.set(near ? "Équilibre : U = " + S.fmt(U.value, 0) + " V → q = m·g·d/U = " + S.sci(qm, 3) + " C = " + S.fmt(qm / QE, 1) + " · e" + (tg.value ? " (n = " + g.n + ")" : ". Arrondis à l'entier le plus proche !") : "Pas à l'équilibre : la valeur de q/e est quelconque. Ajuste U (boutons ± 1 V pour le réglage fin) pour immobiliser la gouttelette (la poussée d'Archimède de l'air est négligée ; modèle simplifié).", near ? "ok" : "");
    });
  }
});
})();
