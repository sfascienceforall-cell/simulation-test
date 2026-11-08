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
  resume: "Bascule l'interrupteur : les charges s'accumulent sur les armatures, la tension monte en 1 − e^(−t/τ), le courant s'effondre. Règle R et C pour atteindre une constante de temps donnée.",
  but: "Touche l'interrupteur du circuit pour charger puis décharger le condensateur. Regarde les charges s'accumuler sur les armatures et les courbes U_C(t) et I(t) se tracer. Glisse le curseur de lecture sur les graphes. Défis : règle R et C pour obtenir le comportement demandé.",
  aRetenir: "Charge : U<sub>C</sub> = E·(1 − e<sup>−t/τ</sup>) et I = (E − U<sub>C</sub>)/R décroît ; décharge : U<sub>C</sub> = U₀·e<sup>−t/τ</sup>. τ = R·C : à t = τ, on a atteint 63 % de la charge (ou il reste 37 %) ; après 5τ, on est à moins de 1 % de la valeur finale. Charge stockée Q = C·U, énergie ½·C·U².",
  piege: "Le condensateur ne se charge pas instantanément et le courant n'est pas constant : il est maximal (E/R) au début et tend vers 0. τ n'est pas la durée totale de la charge : il faut environ 5τ. Et aucune charge ne traverse l'isolant entre les armatures : le courant circule dans les fils.",
  build: function(k, S){
    var c = k.canvas(260), gu = k.canvas(160), gi = k.canvas(140);
    function restart(){ tt = 0; tc = null; hist = [[0, Uc, ((mode === "charge" ? E.value : 0) - Uc) / (R.value * 1e3)]]; }
    var R = k.slider("Résistance R", 1, 100, 1, 10, "kΩ", restart);
    var C = k.slider("Capacité C", 10, 1000, 10, 100, "µF", restart);
    var E = k.slider("Tension du générateur E", 1, 12, 0.5, 9, "V", restart);
    var ro = k.readouts(["τ = R·C", "t", "Tension U_C", "Courant I", "Charge Q = C·U_C", "Énergie ½·C·U_C²"]);
    var nt = k.note("", "");
    var Uc = 0, tt = 0, mode = "charge", hist = [[0, 0, 0]], flow = 0, tc = null, di = -1, won = [0, 0, 0];
    var DEF = [[1.0, "τ = 1,0 s", "τ = R·C = 1,0 s"], [0.4, "chargé à 99 % en 2,0 s", "5τ = 2,0 s, donc τ = 0,40 s"], [1 / Math.LN2, "U_C = 50 % de E à t = 1,0 s", "e^(−1/τ) = 0,5, donc τ = 1/ln 2 ≈ 1,44 s"]];
    function go(m){ mode = m; restart(); lp.play(); }
    k.button("Basculer l'interrupteur", function(){ go(mode === "charge" ? "decharge" : "charge"); }, true);
    k.button("Défi suivant", function(){ di = (di + 1) % 3; });
    var lp = k.loop(function(dt){
      var tau = R.value * 1e3 * C.value * 1e-6, ts = dt * Math.max(tau, 0.05) * 0.9;
      var Ef = mode === "charge" ? E.value : 0; Uc = Ef + (Uc - Ef) * Math.exp(-ts / tau); tt += ts;
      hist.push([tt, Uc, (Ef - Uc) / (R.value * 1e3)]); if (tt > 6 * tau) lp.pause();
      var Iv = (Ef - Uc) / (R.value * 1e3), Im = E.value / (R.value * 1e3); flow += Iv / Im * 90 * dt; k.redraw();
    });
    var SW = {x: 0, y: 0}, axU = null, axI = null;
    c.pointer(function(type, p){ if (type === "down" && Math.hypot(p.x - SW.x, p.y - SW.y) < 44) go(mode === "charge" ? "decharge" : "charge"); });
    function cursorDrag(ax){ return function(){ return ax() ? [{x: ax().X(tc === null ? Math.min(tt, 5 * tau0()) : tc), y: ax().T + 14, r: 40, set: function(px){ tc = P5.clamp(ax().ix(px), 0, Math.min(tt, 5 * tau0())); }}] : null; }; }
    function tau0(){ return R.value * 1e3 * C.value * 1e-6; }
    P5x.drag(gu, k, cursorDrag(function(){ return axU; })); P5x.drag(gi, k, cursorDrag(function(){ return axI; }));
    function polyAt(pts, s){ var L = 0, seg = []; for (var i = 0; i < pts.length - 1; i++){ var l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); L += l; }
      s = ((s % L) + L) % L; for (i = 0; i < seg.length; i++){ if (s <= seg[i]){ var f = s / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } s -= seg[i]; } return pts[0]; }
    function polyLen(pts){ var L = 0; for (var i = 0; i < pts.length - 1; i++) L += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); return L; }
    function at(t, col){ /* valeur interpolée de l'historique */ var h = hist, i = 0; while (i < h.length - 1 && h[i + 1][0] < t) i++; return h[i][col]; }
    go("charge");
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, tau = tau0();
      var Ef = mode === "charge" ? E.value : 0, Ee = E.value, I = (Ef - Uc) / (R.value * 1e3), Imax = Ee / (R.value * 1e3);
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, H, [[0, "#f8fafd"], [1, "#edf2f8"]]); ctx.fillRect(0, 0, W, H);
      var x1 = 34, x2 = 74, x3 = 112, x6 = W - 46, yt = 46, yb = H - 26, yc = (yt + yb) / 2, rw = Math.min(110, (x6 - x3) * 0.5), xr0 = x3 + (x6 - x3 - rw) / 2 + 10, xr1 = xr0 + rw;
      var wire = "#4b5563", lw = 2.6, c2y = yt + 44;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      /* fils */
      S.draw.line(c, x1, yt, x2, yt, wire, lw); S.draw.line(c, x3, yt, xr0, yt, wire, lw); S.draw.line(c, xr1, yt, x6, yt, wire, lw);
      S.draw.line(c, x6, yt, x6, yc - 9, wire, lw); S.draw.line(c, x6, yc + 9, x6, yb, wire, lw); S.draw.line(c, x1, yb, x6, yb, wire, lw);
      S.draw.line(c, x2, c2y, x2, yb, wire, lw); S.draw.line(c, x1, yt, x1, yc - 12, wire, lw); S.draw.line(c, x1, yc + 3, x1, yb, wire, lw);
      /* générateur (symbole : grand trait = borne +) */
      S.draw.line(c, x1 - 16, yc - 12, x1 + 16, yc - 12, pal.red, 3); S.draw.line(c, x1 - 8, yc + 6 - 6, x1 + 8, yc + 6 - 6, "#13233a", 6);
      S.draw.text(c, "+", x1 + 22, yc - 18, {size: 13, color: pal.red});
      P5x.tag(c, "E = " + S.fmt(Ee, 1) + " V", x1 + 2, yc + 26, pal.red, {size: 11});
      /* interrupteur à deux positions : 1 = générateur (charge), 2 = court-circuit (décharge) */
      S.draw.dot(c, x2, yt, 4.5, "#13233a"); S.draw.dot(c, x2, c2y, 4.5, "#13233a"); S.draw.dot(c, x3, yt, 5, "#13233a");
      var tipY = mode === "charge" ? yt : c2y; S.draw.line(c, x3, yt, x2 + 3, tipY - (mode === "charge" ? 3 : 0), mode === "charge" ? pal.green : pal.amber, 4);
      S.draw.text(c, "1", x2 - 10, yt - 10, {size: 11, color: "#4b5868"}); S.draw.text(c, "2", x2 - 10, c2y, {size: 11, color: "#4b5868"});
      SW.x = (x2 + x3) / 2; SW.y = (yt + c2y) / 2; S.draw.glow(c, SW.x, SW.y, 30, mode === "charge" ? pal.green : pal.amber, 0.18);
      P5x.tag(c, mode === "charge" ? "K en 1 : charge" : "K en 2 : décharge", (x2 + x3) / 2 + 6, yt - 20, mode === "charge" ? pal.green : pal.amber, {size: 11});
      /* résistance (symbole européen : rectangle) avec anneaux de couleur */
      ctx.fillStyle = "#efe2c6"; P5x.rr(ctx, xr0, yt - 9, rw, 18, 4); ctx.fill(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.stroke();
      var bands = ["#7a4a1f", "#13233a", "#d4562b", "#c9a227"]; bands.forEach(function(bc, i){ ctx.fillStyle = bc; ctx.fillRect(xr0 + rw * (0.18 + i * 0.17), yt - 9, 5, 18); });
      P5x.tag(c, "R = " + S.fmt(R.value, 0) + " kΩ", (xr0 + xr1) / 2, yt + 22, "#13233a", {size: 11});
      /* condensateur : armatures, charges, champ */
      var q = Math.max(0, Math.min(1, Uc / Math.max(Ee, 0.01))), pw = 30;
      ctx.fillStyle = S.draw.tint(pal.violet, 0.05 + 0.18 * q); ctx.fillRect(x6 - pw, yc - 8, 2 * pw, 16);
      for (var j = 0; j < 5; j++){ var fx = x6 - pw + 6 + j * (2 * pw - 12) / 4; ctx.globalAlpha = 0.15 + 0.85 * q; S.draw.arrow(c, fx, yc - 6, fx, yc + 6, pal.violet, 1.2); } ctx.globalAlpha = 1;
      S.draw.line(c, x6 - pw, yc - 9, x6 + pw, yc - 9, "#c0321d", 4); S.draw.line(c, x6 - pw, yc + 9, x6 + pw, yc + 9, "#1f4b9e", 4);
      var nq = Math.round(q * 7);
      for (j = 0; j < 7; j++){ var on = j < nq; ctx.globalAlpha = on ? 1 : 0.12; S.draw.text(c, "+", x6 - pw + 3 + j * (2 * pw - 6) / 6, yc - 19, {size: 12, color: pal.red}); S.draw.text(c, "−", x6 - pw + 3 + j * (2 * pw - 6) / 6, yc + 20, {size: 13, color: pal.acc}); } ctx.globalAlpha = 1;
      P5x.tag(c, "C = " + S.fmt(C.value, 0) + " µF", x6, yc + 38, "#13233a", {size: 11});
      /* porteurs de charge animés (sens conventionnel du courant) */
      var pts = mode === "charge" ? [[x1, yb], [x1, yt], [x3, yt], [x6, yt], [x6, yc - 9]] : [[x6, yc - 9], [x6, yt], [x3, yt], [x2, c2y], [x2, yb], [x6, yb], [x6, yc + 9]];
      var pts2 = mode === "charge" ? [[x6, yc + 9], [x6, yb], [x1, yb]] : null;
      var rel = Math.abs(I) / Math.max(Imax, 1e-12);
      [pts, pts2].forEach(function(P){ if (!P || rel < 0.01) return; var L = polyLen(P), n = Math.max(2, Math.round(L / 24));
        for (var i = 0; i < n; i++){ var pp = polyAt(P, ((flow * (mode === "charge" ? 1 : -1)) % (L / n) + L / n) % (L / n) + i * L / n); if (Math.abs(pp[1] - yc) < 10 && Math.abs(pp[0] - x6) < 2) continue; S.draw.dot(c, pp[0], pp[1], 3.2, "rgba(224,122,31," + Math.min(1, 0.3 + rel).toFixed(2) + ")"); } });
      /* afficheurs au centre de la boucle */
      var dxp = (x3 + x6 - pw) / 2 + 4, dw = Math.min(84, (x6 - pw - x3) * 0.62);
      S.draw.display(c, Uc.toFixed(2).replace(".", ","), dxp, yc - 18, {w: dw, h: 42, caption: "U_C (V)"});
      S.draw.display(c, (I * 1000).toFixed(2).replace(".", ",").replace("-", "−"), dxp, yc + 34, {w: dw, h: 42, caption: "I (mA)"});
      P5x.hint(c, "Touche l'interrupteur K", {x: 8, y: 14, size: 11});
      /* graphes */
      gu.clear(); gi.clear();
      var tmax = 5 * tau, tl = tc === null ? Math.min(tt, tmax) : tc;
      axU = S.draw.axes(gu, {x0: 0, x1: tmax, y0: 0, y1: Ee * 1.18, xl: "t (s)", yl: "U_C (V)", l: 46});
      S.draw.line(gu, axU.X(0), axU.Y(Ee), axU.X(tmax), axU.Y(Ee), pal.grey, 1, [4, 4]); P5x.tag(gu, "E", axU.X(tmax) - 8, axU.Y(Ee) - 10, "#4b5868", {size: 11});
      S.draw.line(gu, axU.X(tau), axU.Y(0), axU.X(tau), axU.Y(Ee * 1.18), pal.amber, 1.3, [4, 4]); P5x.tag(gu, "τ", axU.X(tau) + 8, axU.B - 12, "#8a5200", {size: 11});
      if (di === 2) { S.draw.line(gu, axU.X(1), axU.Y(0), axU.X(1), axU.Y(Ee * 1.18), pal.violet, 1.3, [2, 3]); S.draw.line(gu, axU.X(0), axU.Y(Ee / 2), axU.X(tmax), axU.Y(Ee / 2), pal.violet, 1.3, [2, 3]); }
      var u0 = hist[0][1], lineU = gu.ctx; lineU.strokeStyle = pal.acc; lineU.lineWidth = 3; lineU.beginPath(); hist.forEach(function(p, i){ if (p[0] > tmax) return; if (i === 0) lineU.moveTo(axU.X(p[0]), axU.Y(p[1])); else lineU.lineTo(axU.X(p[0]), axU.Y(p[1])); }); lineU.stroke();
      var t63 = mode === "charge" ? Ee - (Ee - u0) * Math.exp(-1) : u0 * Math.exp(-1);
      if (tt >= tau && (mode === "charge" || u0 > 0.01)){ S.draw.dot(gu, axU.X(tau), axU.Y(t63), 4.5, pal.amber); P5x.tag(gu, mode === "charge" ? "63 %" : "37 %", axU.X(tau) + 8, axU.Y(t63) + (mode === "charge" ? 12 : -12), "#8a5200", {align: "left", size: 11}); }
      var Im = Math.max(Imax, Math.abs(hist[0][2])) * 1000 * 1.15;
      axI = S.draw.axes(gi, {x0: 0, x1: tmax, y0: -Im, y1: Im, xl: "t (s)", yl: "I (mA)", l: 46});
      var lineI = gi.ctx; lineI.strokeStyle = pal.red; lineI.lineWidth = 3; lineI.beginPath(); hist.forEach(function(p, i){ if (p[0] > tmax) return; if (i === 0) lineI.moveTo(axI.X(p[0]), axI.Y(p[2] * 1000)); else lineI.lineTo(axI.X(p[0]), axI.Y(p[2] * 1000)); }); lineI.stroke();
      /* curseur de lecture commun */
      var uL = at(tl, 1), iL = at(tl, 2);
      [[gu, axU, uL, pal.acc], [gi, axI, iL * 1000, pal.red]].forEach(function(z){ S.draw.line(z[0], z[1].X(tl), z[1].T, z[1].X(tl), z[1].B, "rgba(98,54,196,.55)", 1.5); S.draw.dot(z[0], z[1].X(tl), z[1].Y(z[2]), 5.5, z[3]); P5x.handle(z[0], z[1].X(tl), z[1].T + 14, pal.violet, 6); });
      P5x.tag(gu, "t = " + S.fmt(tl, 2) + " s · U = " + S.fmt(uL, 2) + " V", gu.W - 10, 12, "#4b2a99", {align: "right", size: 11});
      P5x.tag(gi, "I = " + S.fmt(iL * 1000, 2) + " mA", gi.W - 10, 12, "#4b2a99", {align: "right", size: 11});
      ro.set(0, S.fmt(tau, 3) + " s"); ro.set(1, S.fmt(tt, 2) + " s"); ro.set(2, S.fmt(Uc, 2) + " V"); ro.set(3, S.fmt(I * 1000, 2) + " mA");
      ro.set(4, S.fmt(C.value * Uc * 1e-3, 2) + " mC"); ro.set(5, S.fmt(0.5 * C.value * 1e-6 * Uc * Uc * 1e3, 2) + " mJ");
      if (di >= 0){
        var D = DEF[di], ok = Math.abs(tau - D[0]) / D[0] <= 0.03; if (ok) won[di] = 1;
        nt.set("<b>Défi " + (di + 1) + "/3 : " + D[1] + ".</b> " + (ok ? "Réussi avec R = " + S.fmt(R.value, 0) + " kΩ et C = " + S.fmt(C.value, 0) + " µF : τ = " + S.fmt(tau, 3) + " s (" + D[2] + "). Lance une charge pour vérifier sur la courbe." : "Ici τ = " + S.fmt(tau, 3) + " s. Règle R et C (indice : " + D[2].split(",")[0] + ").") + " · " + (won[0] + won[1] + won[2]) + "/3 réussis.", ok ? "ok" : "");
      } else nt.set(mode === "charge" ? "Charge : I démarre à E/R = " + S.fmt(Imax * 1000, 2) + " mA puis diminue ; à t = τ, U_C atteint 63 % de E, soit " + S.fmt(0.632 * Ee, 2) + " V (si on part de 0). Après 5τ = " + S.fmt(5 * tau, 2) + " s, c'est pratiquement fini." : "Décharge : le condensateur joue le rôle du générateur, le courant circule en sens inverse (I < 0). À t = τ, il reste 37 % de la tension initiale.", "");
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
