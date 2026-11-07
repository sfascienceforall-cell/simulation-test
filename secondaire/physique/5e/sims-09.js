/* Chapitre 9 · Potentiel, énergie électrique et condensateur */
(function(){
var K = 9.0e9, QE = 1.6e-19, ME = 9.11e-31, MP = 1.67e-27, MA = 6.64e-27, C0 = 3.0e8;

SFA.sim({
  id: "p5-c09-equipotentielles", ch: "c09", tag: "Carte",
  titre: "Carte des équipotentielles et travail entre deux points",
  resume: "Deux charges → potentiel V (couleurs), équipotentielles, et U entre deux points.",
  but: "Règle les deux charges (en nC). Place le point A et le point B (choisis lequel déplacer, puis touche la carte). Lis les potentiels, la tension U<sub>AB</sub> et le travail pour déplacer une charge de A vers B.",
  aRetenir: "Potentiel d'une charge : V = k·q/r (en volts ; zéro à l'infini). La tension U<sub>AB</sub> = V<sub>A</sub> − V<sub>B</sub>. Le travail du champ pour une charge q qui va de A à B vaut W = q·U<sub>AB</sub> : il ne dépend pas du chemin. Les équipotentielles sont perpendiculaires aux lignes de champ.",
  piege: "V = 0 ne veut pas dire E = 0 (entre deux charges opposées, au milieu, V = 0 mais E ≠ 0 : il y vaut 8·k·q/d², dirigé de + vers −). Et le potentiel n'est pas l'énergie potentielle : V = énergie par unité de charge (E<sub>p</sub> = q·V).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var q1 = k.slider("Charge q₁ (à gauche)", -5, 5, 0.5, 4, "nC");
    var q2 = k.slider("Charge q₂ (à droite)", -5, 5, 0.5, -4, "nC");
    var qt = k.slider("Charge qui se déplace", -5, 5, 0.5, 1, "nC");
    var who = k.seg("Point à placer", [["A", "A"], ["B", "B"]], "A");
    var ro = k.readouts(["V en A", "V en B", "U_AB = V_A − V_B", "Travail W = q·U_AB", "Champ E en A"]);
    var nt = k.note("", ""), f, A = [-0.4, 0.4], B = [0.6, -0.3];
    function V(x, y){ var s = 0; [[-0.5, q1.value], [0.5, q2.value]].forEach(function(z){ var r = Math.max(Math.hypot(x - z[0], y - 0), 0.03); s += K * z[1] * 1e-9 / r; }); return s; }
    c.pointer(function(type, p){ if (!f || (type !== "down" && type !== "drag")) return; var P = [P5.clamp(f.ix(p.x), -1.55, 1.55), P5.clamp(f.iy(p.y), -0.95, 0.95)]; if (who.value === "A") A = P; else B = P; k.redraw(); });
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx;
      f = P5.frame(c, {x0: -1.6, x1: 1.6, y0: -1, y1: 1}, {grid: false});
      var cs = 5, x0 = f.X(-1.6), x1 = f.X(1.6), y0 = f.Y(1), y1 = f.Y(-1), dV = 20, vs = 150;
      var nx = Math.ceil((x1 - x0) / cs), ny = Math.ceil((y1 - y0) / cs), grid = [];
      for (var j = 0; j < ny; j++){ var row = []; for (var i = 0; i < nx; i++) row.push(V(f.ix(x0 + (i + 0.5) * cs), f.iy(y0 + (j + 0.5) * cs))); grid.push(row); }
      for (j = 0; j < ny; j++) for (i = 0; i < nx; i++){
        var v = grid[j][i], t = Math.tanh(v / vs), a = Math.abs(t) * 0.55;
        ctx.fillStyle = t > 0 ? "rgba(180,35,24," + a + ")" : "rgba(30,63,143," + a + ")"; ctx.fillRect(x0 + i * cs, y0 + j * cs, cs, cs);
      }
      ctx.fillStyle = "rgba(15,27,45,.55)";
      for (j = 0; j < ny - 1; j++) for (i = 0; i < nx - 1; i++){
        var kk = Math.floor(grid[j][i] / dV);
        if (kk !== Math.floor(grid[j][i + 1] / dV) || kk !== Math.floor(grid[j + 1][i] / dV)) ctx.fillRect(x0 + i * cs + 1, y0 + j * cs + 1, 2, 2);
      }
      [[-0.5, q1.value], [0.5, q2.value]].forEach(function(z){ var col = z[1] > 0 ? pal.red : z[1] < 0 ? pal.acc : pal.grey; S.draw.dot(c, f.X(z[0]), f.Y(0), 11, col); S.draw.text(c, z[1] > 0 ? "+" : z[1] < 0 ? "−" : "0", f.X(z[0]), f.Y(0), {color: "#fff", size: 14}); });
      [[A, "A", pal.ink], [B, "B", pal.violet]].forEach(function(z){ S.draw.dot(c, f.X(z[0][0]), f.Y(z[0][1]), 6, z[2]); S.draw.text(c, z[1], f.X(z[0][0]) + 12, f.Y(z[0][1]) - 12, {size: 14, color: z[2], bg: "rgba(255,255,255,.7)"}); });
      S.draw.text(c, "rouge : V > 0 · bleu : V < 0 · traits : toutes les " + dV + " V", 10, c.H - 12, {align: "left", size: 12, color: pal.ink, bg: "rgba(255,255,255,.7)"});
      var VA = V(A[0], A[1]), VB = V(B[0], B[1]), U = VA - VB, h = 0.005, Ex = -(V(A[0] + h, A[1]) - V(A[0] - h, A[1])) / (2 * h), Ey = -(V(A[0], A[1] + h) - V(A[0], A[1] - h)) / (2 * h);
      var W = qt.value * 1e-9 * U;
      P5.vec(c, f.X(A[0]), f.Y(A[1]), f.X(A[0]) + Ex / Math.max(Math.hypot(Ex, Ey), 1) * 40, f.Y(A[1]) - Ey / Math.max(Math.hypot(Ex, Ey), 1) * 40, pal.green, "E", {});
      ro.set(0, S.fmt(VA, 1) + " V"); ro.set(1, S.fmt(VB, 1) + " V"); ro.set(2, S.fmt(U, 1) + " V"); ro.set(3, S.fmt(W * 1e9, 1) + " nJ"); ro.set(4, S.fmt(Math.hypot(Ex, Ey), 0) + " V/m");
      var near = [A, B].some(function(P){ return [-0.5, 0.5].some(function(xc){ return Math.hypot(P[0] - xc, P[1]) < 0.05; }); });
      nt.set((near ? "<b>Attention :</b> un point est collé à une charge ponctuelle (r → 0) : V et E y tendent vers l'infini, les valeurs affichées sont limitées à r = 3 cm. Éloigne-le. " : "") + "W = q·U<sub>AB</sub> = " + S.fmt(qt.value, 1) + " nC × " + S.fmt(U, 1) + " V = " + S.fmt(W * 1e9, 1) + " nJ : " + (W > 0 ? "le champ fournit de l'énergie (la charge est accélérée de A vers B)." : W < 0 ? "il faut fournir de l'énergie pour aller de A à B." : "aucun travail."), near ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "p5-c09-accelerateur", ch: "c09", tag: "Accélérateur",
  titre: "Accélérateur de particules : de la tension à la vitesse",
  resume: "Tension → énergie cinétique et vitesse ; limite de la formule classique.",
  but: "Choisis une particule et règle la tension d'accélération (U = 10<sup>x</sup> volts). Compare la vitesse « classique » √(2qU/m) avec la vitesse réelle. À partir de quelle tension l'électron pose-t-il problème ?",
  aRetenir: "Une charge q accélérée depuis le repos par une tension U gagne l'énergie cinétique E<sub>c</sub> = q·U, donc v = √(2qU/m) (formule classique). Un électron accéléré par 1 V gagne 1 eV = 1,6·10⁻¹⁹ J. À grande tension, la vitesse approche celle de la lumière sans jamais l'atteindre.",
  piege: "Doubler U ne double pas v : v ∝ √U (il faut 4 fois plus de tension pour doubler la vitesse). Et la formule ½mv² = qU ne marche plus au-delà de quelques dizaines de kV pour un électron (vitesse proche de c) : la vitesse réelle est inférieure.",
  build: function(k, S){
    var sc0 = k.canvas(150), c = k.canvas(0, {ratio: 0.5});
    var part = k.seg("Particule", [["e", "Électron"], ["p", "Proton"], ["a", "Particule α"]], "e");
    var x = k.slider("Exposant x : U = 10^x volts", 1, 6.3, 0.05, 3, "");
    var ro = k.readouts(["Tension U", "Énergie cinétique", "Vitesse (formule classique)", "Vitesse réelle", "v / c (réelle)"]);
    var nt = k.note("", "");
    function P(){ return part.value === "e" ? {m: ME, q: QE, n: "électron"} : part.value === "p" ? {m: MP, q: QE, n: "proton"} : {m: MA, q: 2 * QE, n: "particule α"}; }
    function vcl(p, U){ return Math.sqrt(2 * p.q * U / p.m); }
    function vrel(p, U){ var g = 1 + p.q * U / (p.m * C0 * C0); return C0 * Math.sqrt(1 - 1 / (g * g)); }
    var ph = 0;
    var lp = k.loop(function(dt){ ph = (ph + dt / 3.2) % 1; k.redraw(); }); lp.play();
    function scene(p, U){
      var pal = S.draw.palette, ctx = sc0.ctx, W = sc0.W, H = sc0.H, ay = H / 2 + 6;
      sc0.clear(); P5x.sky(sc0, "#eef3fa", "#f9fbfe");
      var vc = vcl(p, U), vr = vrel(p, U), beta = vr / C0;
      var gx0 = W * 0.2, gx1 = W * 0.4;
      /* tube */
      P5x.rr(ctx, 14, ay - 22, W - 28, 44, 20); ctx.fillStyle = "#dfe8f3"; ctx.fill(); ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 2; ctx.stroke();
      /* plaques */
      ctx.fillStyle = pal.red; ctx.fillRect(gx0 - 4, ay - 34, 8, 68); ctx.fillStyle = pal.acc; ctx.fillRect(gx1 - 4, ay - 34, 8, 68);
      ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillRect(gx0 - 1.5, ay - 6, 3, 12); ctx.fillRect(gx1 - 1.5, ay - 6, 3, 12);
      S.draw.text(sc0, "+", gx0, ay - 44, {size: 15, color: pal.red}); S.draw.text(sc0, "−", gx1, ay - 44, {size: 15, color: pal.acc});
      /* champ */
      for (var i = 1; i < 4; i++){ S.draw.arrow(sc0, gx0 + 8, ay - 26 + i * 13, gx1 - 8, ay - 26 + i * 13, "rgba(192,50,29,.35)", 1.6); }
      /* particule : accélère entre les plaques puis file à vitesse constante (largeur de traînée ∝ v/c) */
      var px, trail;
      var tpar = ph * 1.0;
      if (tpar < 0.35){ var u = tpar / 0.35; px = gx0 - 40 + (gx1 - gx0 + 40) * u * u; trail = 0.15 + 0.85 * u * beta; }
      else { px = gx1 + (W - 40 - gx1) * ((tpar - 0.35) / 0.65) * (0.25 + 0.75 * Math.min(1, Math.sqrt(beta) * 1.1)); trail = beta; }
      var tl = 6 + 90 * Math.min(1, trail * 1.2);
      var gr = ctx.createLinearGradient(px - tl, 0, px, 0); gr.addColorStop(0, "rgba(31,75,158,0)"); gr.addColorStop(1, "rgba(31,75,158,.55)");
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(px - tl, ay); ctx.lineTo(px, ay - 6); ctx.lineTo(px, ay + 6); ctx.closePath(); ctx.fill();
      S.draw.glow(sc0, px, ay, 20, p.n === "électron" ? "#2f7fd1" : "#c26a0c", 0.5);
      P5x.ball(sc0, px, ay, p.n === "électron" ? 5 : 8, p.n === "électron" ? "#2f7fd1" : p.n === "proton" ? "#c0321d" : "#8a5ac4");
      S.draw.display(sc0, (U >= 1000 ? S.fmt(U / 1000, 1) + " kV" : S.fmt(U, 0) + " V"), (gx0 + gx1) / 2, 28, {w: 96, h: 32, size: 13});
      S.draw.label(sc0, "v = " + S.fmt(beta, 4) + " c" + (beta > 0.1 ? "  (relativiste)" : ""), W - 16, H - 14, {color: beta > 0.1 ? pal.red : pal.acc, size: 12, align: "right"});
      S.draw.label(sc0, p.n + " : Ec = q·U = " + S.sci(p.q * U / QE, 2) + " eV", 18, H - 14, {color: pal.ink, size: 12, align: "left"});
    }
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx, p = P(), U = Math.pow(10, x.value);
      scene(p, U);
      var ax = S.draw.axes(c, {x0: 1, x1: 6.3, y0: 0, y1: 1.5, xl: "x (U = 10^x V)", yl: "v / c", stepX: 1, stepY: 0.25, l: 52});
      S.draw.fn(c, ax, function(xx){ return vcl(p, Math.pow(10, xx)) / C0; }, pal.red, 2.2, [6, 4]);
      S.draw.fn(c, ax, function(xx){ return vrel(p, Math.pow(10, xx)) / C0; }, pal.acc);
      S.draw.line(c, ax.X(1), ax.Y(1), ax.X(6.3), ax.Y(1), pal.amber, 1.5, [3, 3]); S.draw.text(c, "c", ax.X(6.2), ax.Y(1) - 10, {size: 13, color: pal.amber});
      S.draw.legend(c, [[pal.red, "formule classique", true], [pal.acc, "vitesse réelle"]], ax.X(1.45), ax.Y(1.45));
      var vc = vcl(p, U), vr = vrel(p, U);
      S.draw.line(c, ax.X(x.value), ax.Y(0), ax.X(x.value), ax.Y(1.5), pal.grey, 1.2, [4, 4]);
      if (vc / C0 < 1.5) S.draw.dot(c, ax.X(x.value), ax.Y(vc / C0), 5, pal.red);
      S.draw.dot(c, ax.X(x.value), ax.Y(vr / C0), 6, pal.acc);
      var EcJ = p.q * U;
      ro.set(0, U >= 1000 ? S.fmt(U / 1000, 1) + " kV" : S.fmt(U, 0) + " V"); ro.set(1, S.sci(EcJ, 2) + " J (" + S.sci(EcJ / QE, 2) + " eV)");
      ro.set(2, S.fmt(vc / 1000, 0) + " km/s" + (vc > C0 ? " (impossible !)" : "")); ro.set(3, S.fmt(vr / 1000, 0) + " km/s"); ro.set(4, S.fmt(vr / C0, 4));
      if (vc > C0) nt.set("La formule classique donne une vitesse supérieure à c : elle n'est plus valable. La vitesse réelle reste inférieure à c (relativité).", "bad");
      else if (vc > 0.1 * C0) nt.set("Vitesse supérieure à 10 % de c : l'écart entre la formule classique (" + S.fmt(vc / 1000, 0) + " km/s) et la valeur réelle (" + S.fmt(vr / 1000, 0) + " km/s) devient sensible.", "warn");
      else nt.set("Domaine classique : E<sub>c</sub> = q·U = ½·m·v², avec v ≈ " + S.fmt(vc / 1000, 0) + " km/s pour un " + p.n + " accéléré par " + S.fmt(U, 0) + " V. Les deux formules coïncident à moins de 1 %.", "ok");
    });
  }
});

SFA.sim({
  id: "p5-c09-rc", ch: "c09", tag: "Charge et décharge",
  titre: "Charge et décharge d'un condensateur : la constante de temps RC",
  resume: "R, C, E → courbes U(t) et I(t), constante de temps τ = RC.",
  but: "Charge puis décharge le condensateur à travers la résistance. Regarde la tension et le courant. Que vaut la tension après un temps τ = RC ? Change R ou C : qu'est-ce qui change dans la courbe ?",
  aRetenir: "Charge : U<sub>C</sub> = E·(1 − e<sup>−t/τ</sup>), le courant I = (E − U<sub>C</sub>)/R décroît ; décharge : U<sub>C</sub> = U₀·e<sup>−t/τ</sup>. τ = R·C : à t = τ, on a atteint 63 % de la charge (ou il reste 37 %). Au bout de 5τ, on est à moins de 1 % de la valeur finale. Charge stockée Q = C·U ; énergie ½·C·U².",
  piege: "Le condensateur ne « se remplit » pas instantanément, et le courant n'est pas constant : il est maximal au début et tend vers 0. Et τ n'est pas la durée totale de charge : il faut environ 5τ.",
  build: function(k, S){
    var c = k.canvas(215), gr = k.canvas(170), gi = k.canvas(135);
    function restart(){ tt = 0; hist = [[0, Uc, ((mode === "charge" ? E.value : 0) - Uc) / (R.value * 1e3)]]; }
    var R = k.slider("Résistance R", 1, 100, 1, 10, "kΩ", restart);
    var C = k.slider("Capacité C", 10, 1000, 10, 100, "µF", restart);
    var E = k.slider("Tension du générateur E", 1, 12, 0.5, 9, "V", restart);
    var ro = k.readouts(["Constante de temps (R × C)", "Tension U_C", "Courant I", "Charge Q = C·U_C", "Énergie ½·C·U_C²"]);
    var nt = k.note("", ""), Uc = 0, tt = 0, mode = "charge", hist = [[0, 0, 0]], flow = 0;
    function reset(m){ mode = m; restart(); lp.play(); }
    k.button("Charger (interrupteur sur E)", function(){ reset("charge"); }, true);
    k.button("Décharger (court-circuit)", function(){ reset("decharge"); });
    var lp = k.loop(function(dt){
      var tau = R.value * 1e3 * C.value * 1e-6, ts = dt * tau;
      var Ef = mode === "charge" ? E.value : 0; Uc = Ef + (Uc - Ef) * Math.exp(-ts / tau); tt += ts;
      hist.push([tt, Uc, (Ef - Uc) / (R.value * 1e3)]); if (tt > 6 * tau) lp.pause();
      var Iv = (Ef - Uc) / (R.value * 1e3), Im = E.value / (R.value * 1e3); flow += Iv / Im * 120 * dt; k.redraw();
    });
    /* manipulation directe : un appui près de l'interrupteur le bascule */
    c.pointer(function(type, p){ if (type === "down" && p.x < c.W * 0.5 && Math.hypot(p.x - SW.x, p.y - SW.y) < 60){ reset(mode === "charge" ? "decharge" : "charge"); } });
    var SW = {x: 0, y: 0};
    reset("charge");
    function polyAt(pts, s){ var L = 0, seg = []; for (var i = 0; i < pts.length - 1; i++){ var l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); L += l; }
      s = ((s % L) + L) % L; for (i = 0; i < seg.length; i++){ if (s <= seg[i]){ var f = s / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } s -= seg[i]; } return pts[0]; }
    function polyLen(pts){ var L = 0; for (var i = 0; i < pts.length - 1; i++) L += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); return L; }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, tau = R.value * 1e3 * C.value * 1e-6;
      var Ef = mode === "charge" ? E.value : 0, Ee = E.value, I = (Ef - Uc) / (R.value * 1e3), Imax = Ee / (R.value * 1e3);
      /* ---- circuit ---- */
      P5x.sky(c, "#f7fafd", "#edf2f8");
      var W = c.W, sx = Math.min(1, W / 440), x1 = 34 * sx + 6, x2 = x1 + 56 * sx, x3 = x2 + 44 * sx, xr0 = x3 + 22 * sx, xr1 = xr0 + 86 * sx, x6 = xr1 + 34 * sx, yt = 38, yb = c.H - 30, ym = (yt + yb) / 2;
      var wire = "#5b6676", lw = 3;
      var pathCh = [[x1, yb], [x1, yt], [x2, yt], [x3, ym], [x6, ym], [x6, yb], [x1, yb]], pathDis = [[x3, ym], [x6, ym], [x6, yb], [x2, yb], [x3, ym]];
      var pts = mode === "charge" ? pathCh : pathDis;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      /* fils */
      S.draw.line(c, x1, yb, x6, yb, wire, lw); S.draw.line(c, x1, yt + 0, x2, yt, wire, lw); S.draw.line(c, x3, ym, xr0, ym, wire, lw); S.draw.line(c, xr1, ym, x6, ym, wire, lw);
      S.draw.line(c, x1, yb, x1, ym + 20, wire, lw); S.draw.line(c, x1, ym - 20, x1, yt, wire, lw); S.draw.line(c, x2, yb, x2, yb - 0, wire, lw);
      /* générateur */
      S.draw.line(c, x1 - 16, ym - 20, x1 + 16, ym - 20, pal.red, 4); S.draw.line(c, x1 - 9, ym - 11, x1 + 9, ym - 11, "#33405a", 4);
      S.draw.line(c, x1 - 16, ym + 2, x1 + 16, ym + 2, pal.red, 4); S.draw.line(c, x1 - 9, ym + 11, x1 + 9, ym + 11, "#33405a", 4); S.draw.line(c, x1, ym + 11, x1, ym + 20, wire, lw);
      S.draw.text(c, "+", x1 + 24, ym - 24, {size: 13, color: pal.red}); P5x.tag(c, "E = " + S.fmt(Ee, 1) + " V", x1, ym + 38, pal.red, {size: 11.5});
      /* interrupteur à deux positions */
      var ya = yt, yB2 = yb; S.draw.dot(c, x2, ya, 4.5, "#33405a"); S.draw.dot(c, x2, yB2, 4.5, "#33405a"); S.draw.dot(c, x3, ym, 5, "#33405a");
      var tipY = mode === "charge" ? ya : yB2; S.draw.line(c, x3, ym, x2, tipY, mode === "charge" ? pal.green : pal.amber, 3.4);
      SW.x = (x2 + x3) / 2; SW.y = ym; P5x.tag(c, mode === "charge" ? "charge" : "décharge", x3 + 6, ym + 20, mode === "charge" ? pal.green : pal.amber, {size: 11.5});
      P5x.hint(c, "Touche l'interrupteur pour le basculer", {x: 8, y: 12, size: 11});
      /* résistance */
      P5x.coil(c, xr0, ym, xr1, ym, 6, 9, "#33405a", 2.6); P5x.tag(c, "R = " + S.fmt(R.value, 0) + " kΩ", (xr0 + xr1) / 2, ym - 24, "#33405a", {size: 11.5});
      /* condensateur : plaques, charges, champ */
      var py1 = ym + 36, py2 = ym + 58, q = Math.max(0, Math.min(1, Uc / Math.max(Ee, 0.01)));
      S.draw.line(c, x6, ym, x6, py1, wire, lw); S.draw.line(c, x6, py2, x6, yb, wire, lw);
      ctx.fillStyle = S.draw.tint(pal.red, 0.06 + 0.2 * q); ctx.fillRect(x6 - 30, py1, 60, py2 - py1);
      for (var j = 0; j < 7; j++){ var al = (j + 0.5) / 7 <= q * 1.0 + 0.001 ? 1 : 0.15; ctx.globalAlpha = al; S.draw.text(c, "+", x6 - 25 + j * 8.4, py1 - 8, {size: 12, color: pal.red}); S.draw.text(c, "−", x6 - 25 + j * 8.4, py2 + 9, {size: 13, color: pal.acc}); } ctx.globalAlpha = 1;
      S.draw.line(c, x6 - 30, py1, x6 + 30, py1, pal.red, 5); S.draw.line(c, x6 - 30, py2, x6 + 30, py2, pal.acc, 5);
      P5x.tag(c, "C = " + S.fmt(C.value, 0) + " µF", x6 - 38, ym + 47, "#33405a", {align: "right", size: 11.5});
      /* électrons / courant conventionnel : points mobiles */
      var L = polyLen(pts), n = Math.round(L / 26);
      if (Math.abs(I) > Imax * 0.01) for (var i = 0; i < n; i++){ var p = polyAt(pts, flow * (mode === "charge" ? 1 : 1) + i * L / n); S.draw.dot(c, p[0], p[1], 3.2, "rgba(224,122,31," + Math.min(1, 0.35 + Math.abs(I) / Imax).toFixed(2) + ")"); }
      /* afficheurs */
      var dx = Math.min(W - 56, x6 + 88 * sx + 20);
      S.draw.display(c, S.fmt(Uc, 2), dx, 60, {w: 84, h: 46, caption: "U_C (V)"});
      S.draw.display(c, S.fmt(I * 1000, 2), dx, 128, {w: 84, h: 46, caption: "I (mA)"});
      /* ---- courbes ---- */
      gr.clear(); gi.clear();
      var Um = Math.max(Ee, Uc), ax = S.draw.axes(gr, {x0: 0, x1: 5 * tau, y0: 0, y1: Um * 1.15, xl: "t (s)", yl: "U_C (V)", l: 46, stepX: tau});
      var t63 = mode === "charge" ? 0.632 * Ee : 0.368 * (hist[0][1] || 0);
      S.draw.line(gr, ax.X(0), ax.Y(Ee), ax.X(5 * tau), ax.Y(Ee), pal.grey, 1, [4, 4]); P5x.tag(gr, "E", ax.X(5 * tau) - 10, ax.Y(Ee) - 11, "#4b5868", {size: 11});
      S.draw.line(gr, ax.X(tau), ax.Y(0), ax.X(tau), ax.Y(Um * 1.15), pal.amber, 1.4, [4, 4]); P5x.tag(gr, "τ = " + S.fmt(tau, 2) + " s", ax.X(tau) + 6, ax.T + 10, "#8a5200", {align: "left", size: 11});
      var gx2 = gr.ctx; gx2.strokeStyle = pal.acc; gx2.lineWidth = 3; gx2.lineJoin = "round"; gx2.beginPath(); hist.forEach(function(p, i){ if (p[0] > 5 * tau) return; if (i === 0) gx2.moveTo(ax.X(p[0]), ax.Y(p[1])); else gx2.lineTo(ax.X(p[0]), ax.Y(p[1])); }); gx2.stroke();
      if (hist[0][1] !== undefined && (mode === "charge" || hist[0][1] > 0)){ S.draw.dot(gr, ax.X(tau), ax.Y(t63), 4.5, pal.amber); P5x.tag(gr, mode === "charge" ? "63 %" : "37 %", ax.X(tau) + 8, ax.Y(t63) + 14, "#8a5200", {align: "left", size: 11}); }
      S.draw.dot(gr, ax.X(Math.min(tt, 5 * tau)), ax.Y(Uc), 5.5, pal.red);
      var Im = Math.max(Imax, Math.abs(I), Math.abs(hist[0][2])) * 1000, ax2 = S.draw.axes(gi, {x0: 0, x1: 5 * tau, y0: -Im * 1.15, y1: Im * 1.15, xl: "t (s)", yl: "I (mA)", l: 46, stepX: tau, stepY: Im / 2});
      gi.ctx.strokeStyle = pal.red; gi.ctx.lineWidth = 3; gi.ctx.lineJoin = "round"; gi.ctx.beginPath(); hist.forEach(function(p, i){ if (p[0] > 5 * tau) return; if (i === 0) gi.ctx.moveTo(ax2.X(p[0]), ax2.Y(p[2] * 1000)); else gi.ctx.lineTo(ax2.X(p[0]), ax2.Y(p[2] * 1000)); }); gi.ctx.stroke();
      S.draw.dot(gi, ax2.X(Math.min(tt, 5 * tau)), ax2.Y(I * 1000), 5, pal.red);
      P5x.hint(gi, "1 s à l'écran = τ", {x: gi.W - 10, y: 10, align: "right", size: 11});
      ro.set(0, S.fmt(tau, 3) + " s"); ro.set(1, S.fmt(Uc, 2) + " V"); ro.set(2, S.fmt(I * 1000, 2) + " mA"); ro.set(3, S.fmt(C.value * 1e-6 * Uc * 1e3, 2) + " mC"); ro.set(4, S.fmt(0.5 * C.value * 1e-6 * Uc * Uc * 1e3, 2) + " mJ");
      nt.set(mode === "charge" ? "Charge : à t = τ, U_C = 63 % de E = " + S.fmt(0.632 * Ee, 2) + " V ; à 5τ, 99,3 %. Courant initial E/R = " + S.fmt(Imax * 1000, 2) + " mA." : "Décharge : à t = τ il reste 37 % de la tension initiale. Le courant est négatif : il circule en sens inverse du courant de charge.", "");
    });
  }
});


SFA.sim({
  id: "p5-c09-flash", ch: "c09", tag: "Niche utile",
  titre: "Le flash d'un appareil photo : énergie ½·C·U²",
  resume: "Capacité et tension → énergie, puissance de l'éclair, comparaisons.",
  but: "Règle la capacité et la tension de charge du condensateur du flash, puis la durée de la décharge. Compare l'énergie stockée à celle d'une pile AA ou à la hauteur dont elle soulèverait un kilogramme. Que se passe-t-il quand U double ?",
  aRetenir: "Un condensateur de capacité C chargé sous la tension U stocke Q = C·U et l'énergie E = ½·C·U². Doubler U multiplie l'énergie par 4, doubler C la multiplie par 2. Lâchée en un temps très court Δt, elle donne une puissance P = E/Δt énorme.",
  piege: "Ce n'est pas E = C·U² (oubli du ½) ni E = Q·U : la tension baisse pendant la décharge, donc le travail moyen est ½·Q·U. Et attention : un condensateur de flash garde sa charge longtemps, il peut être dangereux à ouvrir.",
  build: function(k, S){
    var c = k.canvas(215), gr = k.canvas(200);
    var C = k.slider("Capacité C", 50, 1000, 10, 120, "µF");
    var U = k.slider("Tension de charge U", 50, 450, 10, 300, "V");
    var dt = k.slider("Durée de l'éclair Δt", 0.1, 5, 0.1, 1, "ms");
    var ro = k.readouts(["Charge Q = C·U", "Énergie ½·C·U²", "Puissance E/Δt", "Pile AA (≈ 13 kJ)", "Soulève 1 kg de"]);
    var nt = k.note("", ""), ft = 5;
    var lp = k.loop(function(d){ ft += d; if (ft > 3.4) lp.pause(); k.redraw(); });
    k.button("Déclencher le flash !", function(){ ft = 0; lp.play(); }, true);
    var gx = null;
    P5x.drag(gr, k, function(){ if (!gx) return null; var E1 = 0.5 * C.value * 1e-6 * U.value * U.value; return [{x: gx.X(U.value), y: gx.Y(E1), r: 34, set: function(px){ U.set(Math.round(P5.clamp(gx.ix(px), 50, 450) / 10) * 10); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, Cf = C.value * 1e-6, E1 = 0.5 * Cf * U.value * U.value, P = E1 / (dt.value * 1e-3), h = E1 / P5.g;
      /* phases : 0-0,5 s éclair ; 0,5-1,9 s recharge ; 1,9-3,4 s la masse retombe */
      var flashK = ft < 0.5 ? Math.exp(-ft / 0.12) * (ft < 0.03 ? ft / 0.03 : 1) : 0, charge = ft < 0.5 ? Math.exp(-ft / 0.15) : ft < 1.9 ? 1 - Math.exp(-(ft - 0.5) / 0.45) : 1;
      var rise = ft < 0.5 ? Math.min(1, ft / 0.45) : ft < 1.9 ? 1 : Math.max(0, 1 - (ft - 1.9) / 1.0);
      P5x.sky(c, "#f5f8fc", "#e8eef6");
      var W = c.W, base = c.H - 30;
      /* condensateur du flash : cylindre avec niveau de charge */
      var cx1 = 46, cw = 56, ch = 108;
      ctx.fillStyle = P5x.lin(ctx, cx1, 0, cx1 + cw, 0, [[0, "#94a3b8"], [0.45, "#e2e8f0"], [1, "#7b8ba1"]]); P5x.rr(ctx, cx1, base - ch, cw, ch, 8); ctx.fill(); ctx.strokeStyle = "#5b6676"; ctx.lineWidth = 1.5; ctx.stroke();
      var lv = U.value / 450 * charge, lh = (ch - 14) * lv; ctx.fillStyle = "rgba(244,197,66,.92)"; P5x.rr(ctx, cx1 + 6, base - 7 - lh, cw - 12, Math.max(0, lh), 4); ctx.fill();
      ctx.fillStyle = "#33405a"; ctx.fillRect(cx1 + 10, base, 6, 10); ctx.fillRect(cx1 + cw - 16, base, 6, 10);
      S.draw.text(c, "+", cx1 + cw - 14, base - ch + 12, {size: 13, color: pal.red}); S.draw.text(c, "−", cx1 + 12, base - ch + 12, {size: 14, color: pal.acc});
      P5x.tag(c, S.fmt(C.value, 0) + " µF · " + S.fmt(U.value * charge, 0) + " V", cx1 + cw / 2, base - ch - 16, "#33405a", {size: 11});
      /* fils vers la lampe */
      var lx = Math.min(W * 0.5, 230), ly = base - ch / 2;
      S.draw.line(c, cx1 + cw, ly - 10, lx - 30, ly - 10, "#5b6676", 3); S.draw.line(c, cx1 + cw, base + 6, lx + 30, base + 6, "#5b6676", 3); S.draw.line(c, lx + 30, base + 6, lx + 30, ly + 14, "#5b6676", 3);
      /* lampe flash */
      if (flashK > 0.02) S.draw.glow(c, lx, ly - 4, 90 * (0.4 + flashK), "#fff3b0", 0.9 * flashK);
      ctx.fillStyle = flashK > 0.1 ? "#fff8d0" : "#e5ebf4"; P5x.rr(ctx, lx - 28, ly - 26, 56, 40, 8); ctx.fill(); ctx.strokeStyle = "#5b6676"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = flashK > 0.1 ? "#ffb02e" : "#9aa6b6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lx, ly - 6, 9, 0, 7); ctx.stroke();
      P5x.tag(c, "éclair " + S.fmt(dt.value, 1) + " ms", lx, ly + 36, "#33405a", {size: 11});
      /* masse de 1 kg soulevée par l'énergie du flash : réglette à échelle automatique */
      var rx = Math.min(W - 70, lx + 120), top = 36, hmax = Math.max(0.5, Math.ceil(h * 1.2 * 2) / 2), hp = (base - top) ;
      S.draw.line(c, rx, top, rx, base, "#9aa6b6", 2);
      for (var t = 0; t <= hmax + 1e-9; t += hmax / 4){ var yy = base - t / hmax * hp; S.draw.line(c, rx - 6, yy, rx + 6, yy, "#9aa6b6", 1.5); S.draw.text(c, S.fmt(t, hmax >= 2 ? 1 : 2) + " m", rx + 12, yy, {size: 10.5, color: "#6b7685", align: "left"}); }
      var my = base - h * rise / hmax * hp; P5x.box(c, rx - 22, my, 30, 20, "#4b5868", "1 kg", {size: 10.5});
      if (h * rise > 0.01) S.draw.line(c, rx - 22, my, rx - 22, base, "rgba(31,75,158,.4)", 1.2, [3, 3]);
      P5x.tag(c, "h = " + S.fmt(h * 100, 0) + " cm", rx - 22, my - 22 > top - 6 ? my - 26 : my + 8, pal.acc, {size: 11});
      P5x.hint(c, "Déclenche le flash : il se vide d'un coup", {y: 12, size: 11});
      /* graphe E(U) */
      gr.clear();
      var Ef = function(u){ return 0.5 * Cf * u * u; }, ymax = Math.max(0.5 * Cf * 450 * 450 * 1.1, 1);
      gx = S.draw.axes(gr, {x0: 0, x1: 450, y0: 0, y1: ymax, xl: "U (V)", yl: "E (J)", stepX: 50, l: 50});
      S.draw.fn(gr, gx, function(u){ return 0.5 * 1000e-6 * u * u; }, "#cbd3de", 1.6, [5, 4]);
      S.draw.fn(gr, gx, function(u){ return 0.5 * 50e-6 * u * u; }, "#cbd3de", 1.6, [5, 4]);
      if (0.5 * 1e-3 * 300 * 300 < ymax) P5x.tag(gr, "C = 1000 µF", gx.X(300), gx.Y(0.5 * 1e-3 * 300 * 300) - 12, "#4b5868", {size: 11}); P5x.tag(gr, "C = 50 µF", gx.X(440), gx.Y(0.5 * 50e-6 * 440 * 440) - 12, "#4b5868", {size: 11, align: "right"});
      S.draw.area(gr, gx, Ef, 0, U.value, pal.acc, 0.12);
      S.draw.fn(gr, gx, Ef, pal.acc, 3);
      var E2 = Ef(U.value / 2);
      S.draw.line(gr, gx.X(U.value / 2), gx.Y(0), gx.X(U.value / 2), gx.Y(E2), pal.amber, 1.3, [4, 4]); S.draw.dot(gr, gx.X(U.value / 2), gx.Y(E2), 5.5, pal.amber);
      P5x.tag(gr, "U/2 : " + S.fmt(E2, 2) + " J (÷ 4)", gx.X(U.value / 2), gx.Y(E2) + 18, "#8a5200", {align: "center", size: 11});
      P5x.handle(gr, gx.X(U.value), gx.Y(E1), pal.red, 8);
      P5x.tag(gr, S.fmt(E1, 2) + " J", gx.X(U.value) - 14, gx.Y(E1) - 14, pal.red, {align: "right", size: 12});
      P5x.hint(gr, "Glisse le point rouge pour changer U", {x: gr.W - 8, y: 12, align: "right", size: 11});
      ro.set(0, S.fmt(Cf * U.value * 1e3, 1) + " mC"); ro.set(1, S.fmt(E1, 2) + " J"); ro.set(2, P >= 1000 ? S.fmt(P / 1000, 1) + " kW" : S.fmt(P, 0) + " W");
      ro.set(3, S.fmt(E1 / 13500 * 100, 3) + " % de l'énergie"); ro.set(4, S.fmt(h * 100, 0) + " cm");
      nt.set("E = ½·" + S.fmt(C.value, 0) + "·10⁻⁶ × " + S.fmt(U.value, 0) + "² = " + S.fmt(E1, 2) + " J, libérés en " + S.fmt(dt.value, 1) + " ms : " + (P >= 1000 ? S.fmt(P / 1000, 1) + " kW" : S.fmt(P, 0) + " W") + ", soit environ " + S.fmt(P / 60, 0) + " fois une lampe de 60 W, mais pendant très peu de temps.", "");
    });
  }
});
})();
