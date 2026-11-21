/* Chapitre 3 · Induction électromagnétique */
SFA.sim({
  id: "p6-c03-aimant-bobine", ch: "c03", tag: "Classique",
  titre: "Un aimant traverse une bobine : la tension induite",
  resume: "e = −N·ΔΦ/Δt : pas de variation de flux, pas de tension. Fais passer l'aimant toi-même et regarde la tension naître.",
  but: "Fais glisser l'aimant dans la bobine avec la souris ou le doigt (ou lance un passage automatique à vitesse réglée). Le premier graphe donne le flux Φ selon la position, le second la tension e = −N·dΦ/dt. Va vite, lentement, change de sens, arrête-toi : que devient la lampe ?",
  aRetenir: "Loi de Faraday : e = −N·dΦ/dt. La tension dépend de la vitesse de variation du flux, pas du flux lui-même : elle est maximale là où Φ change le plus vite (pente maximale) et nulle quand Φ est maximal ou constant. Doubler N ou doubler la vitesse double la tension.",
  piege: "Un aimant immobile dans la bobine, même très puissant, n'induit aucune tension : le flux est grand mais constant. Et la tension change de signe pendant le passage : d'abord le flux augmente, ensuite il diminue. Modèle simplifié : aimant ponctuel (dipôle) sur l'axe de la bobine.",
  build: function(k, S){
    var c = k.canvas(250), g1 = k.canvas(170), g2 = k.canvas(190), P = S.draw.palette, Pm = window.PH6;
    var N = k.slider("Nombre de spires N", 50, 500, 50, 200, "");
    var v = k.slider("Vitesse (passage automatique)", 0.1, 2, 0.1, 1, "m/s");
    var pole = k.seg("Pôle en tête", [["N", "Nord"], ["S", "Sud"]], "N");
    var PHI0 = 100e-6, a = 0.02, Z = 0.12, z = -Z, vz = 0, mode = "auto", tau = 0, drag = false, lastZ = null, lastT = 0, trace = [];
    function phi(zz){ return PHI0 * Math.pow(a * a / (a * a + zz * zz), 1.5); }
    function dphi(zz){ return -3 * zz * PHI0 * Math.pow(a, 3) / Math.pow(a * a + zz * zz, 2.5); }
    k.button("Passage automatique", function(){ mode = "auto"; tau = 0; trace = []; }, true);
    k.button("Immobile au centre", function(){ mode = "man"; z = 0; vz = 0; trace = []; });
    var ro = k.readouts(["Flux maximal", "Tension max (passage à cette vitesse)", "Tension à l'instant", "Vitesse"]);
    var geo = {};
    function sg(){ return pole.value === "N" ? 1 : -1; }
    var lp = k.loop(function(dt){
      if (mode === "auto"){
        var Dv = Math.max(1.8, Math.min(4, 2 * Z / v.value)); tau += dt; if (tau > Dv + 0.6) tau = 0;
        var u = Math.min(1, tau / Dv); z = -Z + 2 * Z * u; vz = tau < Dv ? v.value : 0;
      } else if (!drag){ vz *= Math.pow(0.001, dt); if (Math.abs(vz) < 0.02) vz = 0; }
      if (mode === "man" && (Math.abs(vz) > 0.01)){ trace.push([z, -N.value * sg() * dphi(z) * vz]); if (trace.length > 160) trace.shift(); }
      else if (trace.length && mode === "man") trace.shift();
      k.redraw();
    });
    lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, p){
      if (!geo.x0) return;
      var zz = Math.max(-Z, Math.min(Z, (p.x - geo.cx) / geo.sp * Z));
      if (t === "down"){ drag = true; mode = "man"; lastZ = zz; lastT = performance.now(); z = zz; trace = []; }
      else if (t === "drag" && drag){ var now = performance.now(), dtt = Math.max(0.01, (now - lastT) / 1000); var vv = Math.max(-3, Math.min(3, (zz - lastZ) / dtt)); vz = 0.6 * vz + 0.4 * vv; z = zz; lastZ = zz; lastT = now; }
      else if (t === "up"){ drag = false; }
    });
    k.draw(function(){
      c.clear(); g1.clear(); g2.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, cy = H * 0.5, s = sg();
      var cx = W / 2, sp = W / 2 - 56; geo.cx = cx; geo.sp = sp; geo.x0 = 1;
      var zx = cx + z / Z * sp, e = -N.value * s * dphi(z) * vz;
      /* bobine (arrière puis aimant puis avant) */
      Pm.coil(c, cx - 34, cx + 34, cy, 46, 7, P.amber, 3.4);
      S.draw.line(c, cx - 34, cy + 46, cx - 34 - 20, cy + 46, P.amber, 3); S.draw.line(c, cx + 34, cy + 46, cx + 34 + 20, cy + 46, P.amber, 3);
      var lx = Math.min(W - 40, cx + 130), ly = cy + 70;
      ctx.strokeStyle = P.amber; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 54, cy + 46); ctx.lineTo(cx - 54, ly); ctx.lineTo(lx - 16, ly); ctx.moveTo(cx + 54, cy + 46); ctx.lineTo(cx + 54, ly + 22); ctx.lineTo(lx, ly + 22); ctx.lineTo(lx, ly + 16); ctx.stroke();
      Pm.bulb(c, lx, ly - 2, 16, Math.min(1, Math.abs(e) / 1.6), "");
      /* lignes de champ de l'aimant */
      var mlen = 80, mth = 28, nx = zx + s * mlen / 2, sx = zx - s * mlen / 2;
      [26, 48].forEach(function(R){ [1, -1].forEach(function(q){ ctx.beginPath(); ctx.moveTo(nx, cy); ctx.bezierCurveTo(nx + s * R * 1.1, cy + q * R * 1.3, sx - s * R * 1.1, cy + q * R * 1.3, sx, cy); ctx.strokeStyle = "rgba(31,75,158,.22)"; ctx.lineWidth = 1.4; ctx.stroke(); }); });
      Pm.magnet(c, zx, cy, mlen, mth, s > 0 ? 0 : Math.PI);
      /* flèche de vitesse */
      if (Math.abs(vz) > 0.03){ var al = Math.min(70, 18 + 40 * Math.abs(vz)), dir = vz > 0 ? 1 : -1; S.draw.arrow(c, zx - dir * al / 2, cy - 44, zx + dir * al / 2, cy - 44, P.ink, 3); S.draw.label(c, "v = " + S.fmt(Math.abs(vz), 1) + " m/s", zx, cy - 62, {size: 11.5}); }
      S.draw.text(c, "bobine", cx, cy + 62, {size: 12, color: P.amber});
      if (!drag && mode === "man" && vz === 0) S.draw.text(c, "attrape l'aimant et fais-le glisser", cx, 14, {size: 12.5, color: P.grey, weight: 600});
      /* graphe 1 : Φ(z) */
      var ax1 = S.draw.axes(g1, {x0: -12, x1: 12, y0: -110, y1: 110, xl: "z (cm)", yl: "Φ (µWb)", l: 52, t: 14, b: 32, stepY: 50, stepX: 4});
      S.draw.fn(g1, ax1, function(x){ return s * phi(x / 100) * 1e6; }, P.acc, 2.8);
      S.draw.dot(g1, ax1.X(z * 100), ax1.Y(s * phi(z) * 1e6), 7, P.acc);
      /* graphe 2 : e */
      var epk = 0; for (var i = 0; i <= 200; i++) epk = Math.max(epk, Math.abs(N.value * dphi(-Z + 2 * Z * i / 200) * v.value));
      var emax = Math.max(0.5, Math.ceil(epk * 1.15 * 10) / 10);
      var ax2 = S.draw.axes(g2, {x0: -12, x1: 12, y0: -emax, y1: emax, xl: "z (cm)", yl: "e (V)", l: 52, t: 14, b: 32, stepX: 4});
      if (mode === "auto") S.draw.fn(g2, ax2, function(x){ return -N.value * s * dphi(x / 100) * v.value; }, P.red, 2.8);
      else trace.forEach(function(q, i){ g2.ctx.globalAlpha = 0.15 + 0.85 * i / trace.length; S.draw.dot(g2, ax2.X(q[0] * 100), ax2.Y(Math.max(-emax, Math.min(emax, q[1]))), 3, P.red); g2.ctx.globalAlpha = 1; });
      S.draw.dot(g2, ax2.X(z * 100), ax2.Y(Math.max(-emax, Math.min(emax, e))), 7, P.red);
      if (mode === "man") S.draw.label(g2, "points rouges : tension mesurée pendant ton mouvement", g2.W - 10, 8, {align: "right", color: P.red, size: 11, base: "top"});
      ro.set(0, S.fmt(PHI0 * 1e6, 0) + " µWb"); ro.set(1, S.fmt(epk, 2) + " V"); ro.set(2, S.fmt(e, 2) + " V"); ro.set(3, S.fmt(Math.abs(vz), 2) + " m/s");
    });
  }
});

SFA.sim({
  id: "p6-c03-alternateur", ch: "c03", tag: "Alternateur",
  titre: "Spire tournante : flux, tension et alternateur",
  resume: "Φ = B·A·cos(ωt) donne e = N·B·A·ω·sin(ωt) : un générateur de tension alternative.",
  but: "Une bobine tourne entre les pôles d'un aimant, dans un champ uniforme. Observe le flux (bleu) et la tension (rouge) sur deux périodes, et la lampe qui clignote au rythme de la tension. Règle B, N, l'aire et la fréquence ; atteins la tension du réseau. Glisse sur la bobine pour la tourner à la main, ailleurs pour faire pivoter la vue.",
  aRetenir: "Une bobine de N spires d'aire A tournant à la vitesse angulaire ω = 2π·f dans un champ B produit e(t) = N·B·A·ω·sin(ω·t). La tension est maximale quand le flux est nul (variation la plus rapide) et nulle quand le flux est maximal. Valeur maximale : N·B·A·ω ; valeur efficace : N·B·A·ω/√2.",
  piege: "La tension est maximale quand le flux est nul, pas quand il est maximal. L'animation de la bobine est ralentie (0,5 tour par seconde) pour qu'on la voie tourner ; les graphiques utilisent la fréquence réelle choisie.",
  build: function(k, S){
    var P = S.draw.palette, Pm = window.PH6;
    function rcv(desk, phone){
      var cv = k.canvas(0, {ratio: desk});
      Object.defineProperty(cv, "ratio", {get: function(){ var w = cv.cv.parentNode ? cv.cv.parentNode.clientWidth : 600; return w < 460 ? phone : desk; }, configurable: true});
      cv.resize(); return cv;
    }
    function mix(a, b, u){ var h = function(s){ return [1, 3, 5].map(function(i){ return parseInt(s.substr(i, 2), 16); }); }, x = h(a), y = h(b); return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(x[i] + (y[i] - x[i]) * u); }).join(",") + ")"; }
    var c = rcv(0.66, 1.0), g = k.canvas(300);
    var B = k.slider("Champ B", 0.05, 0.5, 0.05, 0.1, "T");
    var N = k.slider("Nombre de spires N", 10, 300, 10, 100, "");
    var A = k.slider("Aire d'une spire", 50, 200, 10, 100, "cm²");
    var f = k.slider("Fréquence de rotation f", 1, 60, 1, 50, "Hz");
    var ro = k.readouts(["e max = N·B·A·ω", "e efficace", "Période T"]);
    var nt = k.note("Défi : réseau belge, tension efficace 230 V (maximum 325 V) à 50 Hz. Quels réglages de N, B et A donnent e max ≈ 325 V ? Glisse sur la bobine pour la tourner à la main ; glisse ailleurs pour tourner la vue.", "ok");
    var ang = 0, hold = false, orb = false, last = null, cam = {a: -0.55, b: 0.38}, cur = 0, flow = 0, geo = {};
    var lp = k.loop(function(dt){
      if (!hold) ang += dt * Math.PI;   /* 0,5 tour par seconde */
      var a = ((ang % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      cur += dt * Math.sin(a) * 70; flow += dt * 26;
      k.redraw();
    });
    lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(tp, p){
      if (tp === "down"){
        last = p;
        var dx = p.x - (geo.cx || 0), dy = p.y - (geo.cy || 0);
        if (geo.r && dx * dx + dy * dy < geo.r * geo.r) hold = true; else orb = true;
      } else if (tp === "drag" && last){
        if (hold) ang += (p.x - last.x) * 0.025;
        else if (orb){ cam.a = Math.max(-1.05, Math.min(1.05, cam.a + (p.x - last.x) * 0.01)); cam.b = Math.max(0.02, Math.min(0.95, cam.b + (p.y - last.y) * 0.01)); }
        last = p;
      } else if (tp === "up"){ hold = false; orb = false; last = null; }
    });
    var LIGHT = [-0.45, 0.75, 0.5];
    function box(pr, x0, x1, y0, y1, z0, z1, col, opt){
      opt = opt || {}; var ctx = c.ctx;
      var V = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(function(q){ return pr(q[0], q[1], q[2]); });
      var F = [[[0, 3, 7, 4], [-1, 0, 0]], [[1, 2, 6, 5], [1, 0, 0]], [[0, 1, 5, 4], [0, -1, 0]], [[3, 2, 6, 7], [0, 1, 0]], [[0, 1, 2, 3], [0, 0, -1]], [[4, 5, 6, 7], [0, 0, 1]]];
      F.forEach(function(fc){ fc.d = fc[0].reduce(function(s, i){ return s + V[i][2]; }, 0) / 4; });
      F.sort(function(p, q){ return p.d - q.d; });
      F.forEach(function(fc){
        var n = fc[1], li = 0.55 + 0.45 * Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
        ctx.beginPath(); fc[0].forEach(function(i, j){ j ? ctx.lineTo(V[i][0], V[i][1]) : ctx.moveTo(V[i][0], V[i][1]); }); ctx.closePath();
        ctx.fillStyle = li >= 0.78 ? mix(col, "#ffffff", (li - 0.78) * 1.2) : mix(col, "#000000", (0.78 - li) * 0.9); ctx.fill();
        ctx.strokeStyle = "rgba(19,35,58,.35)"; ctx.lineWidth = 1; ctx.stroke();
        if (opt.label && n[0] === opt.side){
          var mx = 0, my = 0; fc[0].forEach(function(i){ mx += V[i][0] / 4; my += V[i][1] / 4; });
          S.draw.text(c, opt.label, mx, my, {size: 22, color: "rgba(255,255,255,.95)", weight: 800});
        }
      });
    }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, ph = W < 460, a = ((ang % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      var w = 2 * Math.PI * f.value, Ar = A.value * 1e-4, em = N.value * B.value * Ar * w, T = 1 / f.value, tm = 2 * T * 1000, eNow = em * Math.sin(a);
      /* atelier : mur, plan de travail */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#eef2f7"); bg.addColorStop(0.62, "#dfe6ef"); bg.addColorStop(0.63, "#c9b59a"); bg.addColorStop(1, "#b29a7b"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(120,135,155,.13)"; ctx.lineWidth = 1; for (var xx = 0; xx < W; xx += 36){ ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, H * 0.62); ctx.stroke(); }
      ctx.strokeStyle = "rgba(90,60,30,.12)"; for (var yy = H * 0.66; yy < H; yy += 9){ ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy + 3); ctx.stroke(); }
      var sc = ph ? W / 7.6 : Math.min(W / 8.8, H / 6.0), cx = W / 2, cy = H * (ph ? 0.44 : 0.4);
      var pr = Pm.cam(cam, sc, cx, cy, 10);
      var kA = Math.sqrt(A.value / 100), wC = 0.95 * kA, hC = 0.8 * kA, yc = -0.25;
      /* socle */
      ctx.save(); ctx.fillStyle = "rgba(40,25,10,.22)"; var s0 = pr(0, -2.4, 0); ctx.beginPath(); ctx.ellipse(s0[0], s0[1] + 6, sc * 3.3, sc * 0.55, 0, 0, 7); ctx.fill(); ctx.restore();
      box(pr, -3.0, 3.0, -2.4, -2.1, -1.45, 1.45, "#9c7650");
      /* ordre de dessin : aimant le plus éloigné, champ, bobine, aimant le plus proche */
      var dl = pr(-2.4, 0, 0)[2], dr = pr(2.4, 0, 0)[2];
      function magL(){ box(pr, -2.8, -2.05, -2.1, 1.5, -1.05, 1.05, "#c0321d", {label: "N", side: 1}); }
      function magR(){ box(pr, 2.05, 2.8, -2.1, 1.5, -1.05, 1.05, "#1f4b9e", {label: "S", side: -1}); }
      (dl < dr ? magL : magR)();
      /* lignes de champ B (du pôle N vers le pôle S), petits traits qui défilent */
      ctx.save(); ctx.lineWidth = 1.6; ctx.setLineDash([7, 9]); ctx.lineDashOffset = -flow;
      [-1, 0, 1].forEach(function(j){ [-0.7, 0.7].forEach(function(z){ var p0 = pr(-2.0, yc + j * 0.85, z), p1 = pr(2.0, yc + j * 0.85, z); ctx.strokeStyle = "rgba(47,127,209,.45)"; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }); });
      ctx.restore();
      var bA = pr(-1.95, yc + 1.25, 0), bB = pr(-1.25, yc + 1.25, 0); S.draw.arrow(c, bA[0], bA[1], bB[0], bB[1], P.blue, 2.6); S.draw.text(c, "B", bB[0] + 4, bB[1] - 12, {size: 14, color: P.blue, weight: 800, math: true});
      /* axe, bagues et balais */
      var sa = pr(0, -2.1, 0), sb = pr(0, yc + hC + 0.55, 0); S.draw.line(c, sa[0], sa[1], sb[0], sb[1], "#5f6b7a", Math.max(4, sc * 0.09)); S.draw.line(c, sa[0] - 1, sa[1], sb[0] - 1, sb[1], "rgba(255,255,255,.45)", 1.5);
      [-1.55, -1.82].forEach(function(y){
        var q = pr(0, y, 0), rx = Math.abs(pr(0.26, y, 0)[0] - pr(-0.26, y, 0)[0]) / 2 + 2, ry = Math.max(3, Math.abs(pr(0, y, 0.26)[1] - pr(0, y, -0.26)[1]) / 2);
        var gr = ctx.createLinearGradient(q[0] - rx, 0, q[0] + rx, 0); gr.addColorStop(0, "#9a5a1f"); gr.addColorStop(0.4, "#f0b26a"); gr.addColorStop(1, "#8a4f18");
        ctx.fillStyle = gr; ctx.fillRect(q[0] - rx, q[1] - 4, 2 * rx, 8); ctx.beginPath(); ctx.ellipse(q[0], q[1] - 4, rx, ry, 0, 0, 7); ctx.fillStyle = "#f6c88d"; ctx.fill(); ctx.strokeStyle = "#7a4515"; ctx.lineWidth = 1; ctx.stroke();
      });
      /* balais et fils vers la lampe */
      var lampW = [1.5, -2.1, 1.05], lb = pr(lampW[0], lampW[1], lampW[2]);
      [-1.55, -1.82].forEach(function(y, i){
        var b0 = pr(0.3, y, 0), b1 = pr(0.62, y, 0);
        S.draw.line(c, b0[0], b0[1], b1[0], b1[1], "#3d4553", 5);
        var w1 = pr(0.62, y, 0), w2 = pr(1.2 + i * 0.1, -2.1, 0.4), w3 = pr(lampW[0] + (i ? 0.12 : -0.12), lampW[1], lampW[2]);
        ctx.strokeStyle = i ? "#1f4b9e" : "#c0321d"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(w1[0], w1[1]); ctx.quadraticCurveTo(w2[0], w2[1], w3[0], w3[1]); ctx.stroke();
      });
      /* bobine : N spires (on en dessine au plus 6), sens positif de parcours lié à la normale (règle de la main droite) */
      var n = [Math.cos(a), 0, Math.sin(a)], t = [-Math.sin(a), 0, Math.cos(a)];
      var corners = [[1, 1], [-1, 1], [-1, -1], [1, -1]];   /* (y, t) : C1 → C2 → C3 → C4, parcours positif autour de n */
      var nb = Math.min(6, Math.max(2, Math.round(N.value / 50))), pts3 = [];
      function cp(s, i, o){ var cy0 = corners[i][0] * hC, ct = corners[i][1] * wC; return [ct * t[0] + o * n[0], yc + cy0, ct * t[2] + o * n[2]]; }
      var lum = Math.min(1, Math.abs(eNow) / Math.max(1, em) * 1.1);
      for (var s = 0; s < nb; s++){
        var o = (s - (nb - 1) / 2) * 0.045, P2 = [0, 1, 2, 3, 0].map(function(i){ var q = cp(s, i, o); return pr(q[0], q[1], q[2]); });
        ctx.beginPath(); P2.forEach(function(q, j){ j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
        ctx.strokeStyle = "#8a4f18"; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.stroke();
        ctx.strokeStyle = s === nb - 1 ? "#f4b46a" : "#d9893a"; ctx.lineWidth = 2.6; ctx.stroke();
        if (s === nb - 1) pts3 = P2;
      }
      /* courant induit : tirets qui circulent dans la spire, dans un sens puis dans l'autre */
      if (Math.abs(eNow) > em * 0.04){
        ctx.save(); ctx.beginPath(); pts3.forEach(function(q, j){ j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
        ctx.setLineDash([6, 12]); ctx.lineDashOffset = -cur; ctx.strokeStyle = "rgba(255,236,140," + (0.35 + 0.65 * lum) + ")"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      }
      /* moyeu et normale */
      var hb = pr(0, yc, 0); geo.cx = hb[0]; geo.cy = hb[1]; geo.r = sc * Math.max(wC, hC) * 1.05;
      var ne = pr(1.25 * n[0], yc, 1.25 * n[2]); S.draw.arrow(c, hb[0], hb[1], ne[0], ne[1], P.green, 3.2);
      S.draw.label(c, "normale", ne[0] + (ne[0] > hb[0] ? 26 : -26), ne[1] - 10, {size: 11, color: P.green});
      S.draw.dot(c, hb[0], hb[1], 4, P.ink);
      (dl < dr ? magR : magL)();
      /* lampe sur le socle */
      Pm.bulb(c, lb[0], lb[1] - 20, Math.max(11, sc * 0.24), lum, "");
      ctx.fillStyle = "#3d4553"; S.draw.rrect(c, lb[0] - 9, lb[1] - 8, 18, 10, 3); ctx.fill();
      /* angle et flux */
      var deg = Math.round(a * 180 / Math.PI);
      S.draw.label(c, "angle (normale, B) = " + deg + "°", 12, 16, {size: 11, color: P.ink, align: "left"});
      S.draw.label(c, "Φ = B·A·cos(ωt) = " + S.fmt(B.value * Ar * Math.cos(a) * 1000, 2) + " mWb", 12, H - 14, {size: 12, color: P.acc, align: "left"});
      if (!ph) S.draw.text(c, "glisse sur la bobine : tu la tournes · ailleurs : tu tournes la vue", W - 10, H - 14, {size: 10.5, color: "#5f4a33", align: "right", weight: 600});
      S.draw.display(c, (eNow >= 0 ? "+" : "−") + S.fmt(Math.abs(eNow), 0) + " V", W - (ph ? 56 : 68), 34, {w: ph ? 96 : 116, h: 46, caption: "TENSION e(t)", size: ph ? 16 : 18, color: eNow >= 0 ? "#13233a" : P.red});
      /* graphes sur deux périodes : Φ (haut) et e (bas) */
      var phm = B.value * Ar;
      var a1 = {L: 56, R: g.W - 14, T: 12, B: 138}, a2 = {L: 56, R: g.W - 14, T: 166, B: g.H - 24};
      [a1, a2].forEach(function(q, idx){
        var m = idx ? em : phm;
        q.X = function(t){ return q.L + t / tm * (q.R - q.L); }; q.Y = function(y){ return q.B - (y + m) / (2 * m) * (q.B - q.T); };
        var gc = g.ctx; gc.save(); gc.strokeStyle = "#8a95a3"; gc.lineWidth = 1.2; gc.beginPath(); gc.moveTo(q.L, q.Y(0)); gc.lineTo(q.R, q.Y(0)); gc.moveTo(q.L, q.T); gc.lineTo(q.L, q.B); gc.stroke();
        gc.strokeStyle = "#edf0f4"; for (var p = 1; p <= 4; p++){ var xq = q.L + p / 4 * (q.R - q.L); gc.beginPath(); gc.moveTo(xq, q.T); gc.lineTo(xq, q.B); gc.stroke(); }
        gc.fillStyle = "#5f6b7a"; gc.font = "600 12px Mulish, system-ui"; gc.textAlign = "right"; gc.textBaseline = "middle";
        [-m, 0, m].forEach(function(y){ gc.fillText(idx ? S.fmt(y, 1) : S.fmt(y * 1000, 2), q.L - 5, q.Y(y)); });
        gc.textAlign = "center"; gc.textBaseline = "top"; if (idx){ for (p = 0; p <= 4; p++) gc.fillText(S.fmt(tm * p / 4, 1), q.L + p / 4 * (q.R - q.L), q.B + 4); }
        gc.restore();
        gc.save(); gc.strokeStyle = idx ? P.red : P.acc; gc.lineWidth = 2.6; gc.beginPath();
        for (var i = 0; i <= 300; i++){ var tt = tm * i / 300, val = idx ? em * Math.sin(w * tt / 1000) : phm * Math.cos(w * tt / 1000); if (i) gc.lineTo(q.X(tt), q.Y(val)); else gc.moveTo(q.X(tt), q.Y(val)); }
        gc.stroke(); gc.restore();
      });
      S.draw.text(g, "Φ (mWb)", a1.L + 4, a1.T + 8, {size: 12, align: "left", color: P.acc});
      S.draw.text(g, "e (V)", a2.L + 4, a2.T + 8, {size: 12, align: "left", color: P.red});
      S.draw.text(g, "t (ms)", a2.R, a2.B + 14, {size: 12, align: "right"});
      /* point courant : même phase que la bobine (ωt = angle) */
      var tcur = a / w * 1000;
      S.draw.line(g, a1.X(tcur), a1.T, a1.X(tcur), a2.B, "rgba(15,27,45,.18)", 1.2, [3, 4]);
      S.draw.dot(g, a1.X(tcur), a1.Y(phm * Math.cos(a)), 6, P.acc); S.draw.dot(g, a2.X(tcur), a2.Y(em * Math.sin(a)), 6, P.red);
      ro.set(0, S.fmt(em, 1) + " V"); ro.set(1, S.fmt(em / Math.SQRT2, 1) + " V"); ro.set(2, S.fmt(T * 1000, 1) + " ms");
    });
  }
});

SFA.sim({
  id: "p6-c03-lenz", ch: "c03", tag: "Sens du courant",
  titre: "La loi de Lenz : le courant induit s'oppose à la cause",
  resume: "Attrape l'aimant et approche-le ou éloigne-le de la bobine : quelle face devient Nord, dans quel sens tourne le courant ?",
  but: "Glisse l'aimant avec la souris ou le doigt (ou choisis un mouvement automatique). Plus tu le déplaces vite, plus la lampe brille. Le schéma indique la face induite, le sens du courant (vu du côté de l'aimant) et la force sur l'aimant.",
  aRetenir: "Le courant induit a un sens tel que ses effets s'opposent à la variation de flux qui lui donne naissance. Si on approche un pôle Nord, la face de la bobine qui lui fait face devient Nord (répulsion) ; si on l'éloigne, elle devient Sud (attraction). Dans les deux cas, il faut fournir un travail : c'est l'énergie qui devient électrique.",
  piege: "« S'opposer » ne signifie pas « s'opposer au champ de l'aimant » : la bobine s'oppose à la VARIATION du flux. Si on éloigne l'aimant, le courant crée un champ de même sens que celui de l'aimant (il cherche à maintenir le flux). Sans mouvement, pas de courant.",
  build: function(k, S){
    var c = k.canvas(390), P = S.draw.palette, Pm = window.PH6;
    var pole = k.seg("Pôle de l'aimant tourné vers la bobine", [["N", "Nord"], ["S", "Sud"]], "N");
    var mv = k.seg("Mouvement de l'aimant", [["man", "Je le déplace"], ["app", "Il s'approche"], ["stop", "Immobile"], ["eloi", "Il s'éloigne"]], "man");
    var ro = k.readouts(["Face de la bobine tournée vers l'aimant", "Courant (vu de l'aimant)", "Force sur l'aimant"]);
    var nt = k.note("Essaie : approche le pôle Nord, puis éloigne-le, puis change de pôle. Que devient la lampe quand tu t'arrêtes ?");
    var off = 90, vel = 0, drag = false, lastX = null, lastT = 0, geo = {}, t0 = 0;
    var lp = k.loop(function(dt){
      var m = mv.value;
      if (m === "app"){ off -= 80 * dt; vel = -80; if (off < 8) off = 130; }
      else if (m === "eloi"){ off += 80 * dt; vel = 80; if (off > 130) off = 8; }
      else if (m === "stop"){ vel = 0; }
      else if (!drag){ vel *= Math.pow(0.0008, dt); if (Math.abs(vel) < 4) vel = 0; }
      k.redraw();
    });
    lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, p){
      if (t === "down"){ drag = true; mv.set("man"); lastX = p.x; lastT = performance.now(); }
      else if (t === "drag" && drag){ var now = performance.now(), dtt = Math.max(0.008, (now - lastT) / 1000), dx = p.x - lastX; off = Math.max(8, Math.min(130, off - dx)); var v = -dx / dtt; vel = 0.5 * vel + 0.5 * Math.max(-400, Math.min(400, -v)) * -1; lastX = p.x; lastT = now; }
      else if (t === "up"){ drag = false; }
    });
    k.draw(function(){
      c.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, cy = H * 0.4, cx = W * 0.66, nearN = pole.value === "N";
      /* vel < 0 : s'approche (off diminue) ; vel > 0 : s'éloigne */
      var d = vel < -12 ? 1 : (vel > 12 ? -1 : 0);   /* d = 1 : approche */
      var faceN = d === 0 ? null : ((d === 1) === nearN);
      var turns = 7, cw = 84, ry = 52, xl = cx - cw / 2, xr = cx + cw / 2;
      /* champ de l'aimant (flèches vers la bobine) et champ induit */
      var mx = xl - off - 52, mlen = 104;
      /* rail */
      S.draw.line(c, 10, cy + 46, W - 10, cy + 46, "#c9d1dc", 3);
      /* bobine */
      Pm.coil(c, xl, xr, cy, ry, turns, P.amber, 3.4);
      S.draw.line(c, xl - 16, cy + ry, xl, cy + ry, P.amber, 3); S.draw.line(c, xr, cy + ry, xr + 24, cy + ry, P.amber, 3);
      /* fils vers la lampe */
      var lx = cx, ly = cy + ry + 62;
      ctx.strokeStyle = P.amber; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xl - 16, cy + ry); ctx.lineTo(xl - 16, ly); ctx.lineTo(lx - 14, ly); ctx.moveTo(xr + 24, cy + ry); ctx.lineTo(xr + 24, ly); ctx.lineTo(lx + 14, ly); ctx.stroke();
      Pm.bulb(c, lx, ly - 4, 17, Math.min(1, Math.abs(vel) / 160) * (d === 0 ? 0 : 1), "");
      /* face induite */
      if (d !== 0){
        ctx.fillStyle = faceN ? "rgba(192,50,29,.28)" : "rgba(31,75,158,.28)"; ctx.fillRect(xl - 7, cy - ry - 4, 8, 2 * ry + 8);
        S.draw.label(c, faceN ? "N induit" : "S induit", xl, cy - ry - 22, {color: faceN ? P.red : P.acc, size: 12});
        /* flèches du courant en bas des spires (sens de parcours) */
        for (var i = 0; i < turns; i += 2){ var x = xl + (i + 0.5) * cw / turns, dir = faceN ? 1 : -1; S.draw.arrow(c, x - dir * 6, cy + ry + 1, x + dir * 6, cy + ry + 1, P.green, 2.6); }
      }
      /* aimant */
      Pm.magnet(c, mx, cy, mlen, 38, nearN ? 0 : Math.PI);
      if (d !== 0){ var af = d === 1 ? 1 : -1; S.draw.arrow(c, mx - af * 22, cy - 40, mx + af * 22, cy - 40, P.ink, 3.5); S.draw.label(c, d === 1 ? "approche" : "s'éloigne", mx, cy - 58, {color: P.ink, size: 12}); }
      /* force sur l'aimant */
      if (d !== 0){ var fl = 34, fdir = d === 1 ? -1 : 1; S.draw.arrow(c, mx - fdir * 0, cy + 58, mx + fdir * fl, cy + 58, P.red, 4); S.draw.label(c, "force de la bobine", mx + fdir * fl / 2, cy + 76, {color: P.red, size: 11.5}); }
      /* sens du courant vu de l'aimant */
      var fx = Math.max(52, W * 0.13), fy = H - 84;
      ctx.beginPath(); ctx.arc(fx, fy, 34, 0, 7); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fill(); ctx.strokeStyle = "#d5dce6"; ctx.lineWidth = 1.5; ctx.stroke();
      if (d !== 0){
        var ccw = faceN, ts = -1.2, te = ccw ? ts - 5.0 : ts + 5.0;
        ctx.strokeStyle = P.green; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(fx, fy, 26, ts, te, ccw); ctx.stroke();
        var ex = fx + 26 * Math.cos(te), ey = fy + 26 * Math.sin(te), tx = ccw ? Math.sin(te) : -Math.sin(te), ty = ccw ? -Math.cos(te) : Math.cos(te);
        S.draw.arrow(c, ex - tx * 9, ey - ty * 9, ex + tx * 4, ey + ty * 4, P.green, 4);
      } else S.draw.text(c, "0", fx, fy, {size: 16, color: P.grey});
      S.draw.text(c, "vu de l'aimant", fx, fy + 46, {size: 11.5, color: P.grey});
      /* barre de flux */
      var phi = Math.pow(60 / (off + 60), 2), bx = W - 30, bh = 90;
      S.draw.panel(c, bx - 16, 14, 32, bh + 34, {shadow: false}); ctx.fillStyle = "#e3e7ed"; ctx.fillRect(bx - 6, 40, 12, bh);
      ctx.fillStyle = nearN ? P.red : P.acc; ctx.fillRect(bx - 6, 40 + bh * (1 - phi), 12, bh * phi);
      S.draw.text(c, "Φ", bx, 28, {size: 13, color: P.ink, math: true});
      S.draw.text(c, d === 1 ? "↑" : (d === -1 ? "↓" : "="), bx, 40 + bh + 12, {size: 15, color: P.ink});
      ro.set(0, d === 0 ? "aucune" : (faceN ? "Nord" : "Sud")); ro.set(1, d === 0 ? "aucun" : (faceN ? "↺ anti-horaire" : "↻ horaire"));
      ro.set(2, d === 0 ? "aucune" : (d === 1 ? "répulsion (freine l'approche)" : "attraction (freine l'éloignement)"));
      S.draw.text(c, d === 0 ? "Flux constant : pas de courant" : (d === 1 ? "Flux croissant : la bobine s'y oppose" : "Flux décroissant : la bobine le maintient"), W / 2, H - 12, {size: 13, color: P.ink});
    });
  }
});

SFA.sim({
  id: "p6-c03-aimant-tube", ch: "c03", tag: "Niche · Foucault",
  titre: "Un aimant dans un tube de cuivre : la chute ralentie",
  resume: "Des courants de Foucault freinent la chute : compare cuivre, aluminium, laiton et plastique, et regarde la vitesse se stabiliser.",
  but: "Deux aimants identiques tombent : l'un dans un tube, l'autre en chute libre. Choisis le matériau, l'épaisseur du tube, la hauteur et la masse de l'aimant. Les anneaux jaunes montrent les courants de Foucault ; le graphe montre la vitesse qui atteint une valeur limite.",
  aRetenir: "Dans le tube conducteur, l'aimant en mouvement fait varier le flux : des courants induits (courants de Foucault) apparaissent et, selon Lenz, s'opposent au mouvement. La force de freinage augmente avec la vitesse jusqu'à compenser le poids : l'aimant atteint une vitesse limite constante. L'énergie potentielle perdue se transforme en chaleur dans le tube.",
  piege: "Un tube en plastique ne freine pas : il isole, aucun courant ne circule. Le freinage n'est pas dû au magnétisme du tube (le cuivre n'est pas attiré par un aimant) mais à l'induction. Modèle simplifié : force de freinage proportionnelle à la vitesse, k ∝ conductivité × épaisseur (ordre de grandeur).",
  build: function(k, S){
    var c = k.canvas(380), gv = k.canvas(170), P = S.draw.palette, Pm = window.PH6, g = 9.81;
    var mat = k.select("Matériau du tube", [["cu", "Cuivre"], ["al", "Aluminium"], ["lt", "Laiton"], ["pl", "Plastique (isolant)"]], "cu", function(){ t = 0; });
    var ep = k.slider("Épaisseur du tube", 1, 5, 0.5, 2, "mm", function(){ t = 0; });
    var ms = k.slider("Masse de l'aimant", 5, 50, 5, 10, "g", function(){ t = 0; });
    var hh = k.slider("Hauteur de chute", 0.3, 1, 0.1, 0.6, "m", function(){ t = 0; });
    k.button("Rejouer la chute", function(){ t = 0; }, true);
    var ro = k.readouts(["Vitesse limite", "Durée dans le tube", "Durée en chute libre", "Énergie transformée en chaleur"]);
    var sig = {cu: 1, al: 0.63, lt: 0.25, pl: 0}, t = 0;
    function model(){
      var H = hh.value, m = ms.value / 1000, kk = 0.5 * sig[mat.value] * ep.value, free = kk === 0;
      var vt = free ? Infinity : m * g / kk, tau = free ? Infinity : m / kk;
      function x(tt){ return free ? 0.5 * g * tt * tt : vt * tt - vt * tau * (1 - Math.exp(-tt / tau)); }
      function vv(tt){ return free ? g * tt : vt * (1 - Math.exp(-tt / tau)); }
      var lo = 0, hi = 200; for (var i = 0; i < 60; i++){ var mid = (lo + hi) / 2; if (x(mid) < H) lo = mid; else hi = mid; }
      var tf = Math.sqrt(2 * H / g), tt = lo, vend = vv(tt);
      return {H: H, m: m, vt: vt, tau: tau, free: free, x: x, v: vv, tt: tt, tf: tf, Q: m * g * H - 0.5 * m * vend * vend};
    }
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    var tcol = {cu: ["#e9a36b", "#b96a2e", "#8a4a1c"], al: ["#e4e8ee", "#a9b2bf", "#7a8493"], lt: ["#f3dc8e", "#cfa63a", "#9a7716"], pl: ["#dcebf7", "#b7d2e8", "#8db3d0"]};
    k.draw(function(){
      c.clear(); gv.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, Hc = c.H, M = model();
      var top = 40, bot = Hc - 48, sc = (bot - top) / M.H, x1 = W * 0.3, x2 = W * 0.72, tw = 24, ed = 4 + ep.value * 1.3;
      /* mur de scène */
      var tt = Math.min(t, 1000), y1 = Math.min(M.H, M.x(tt)), y2 = Math.min(M.H, 0.5 * g * tt * tt), v1 = tt >= M.tt ? 0 : M.v(tt);
      /* tube avec coupe : paroi gauche et droite */
      var cl = tcol[mat.value], gr = ctx.createLinearGradient(x1 - tw, 0, x1 + tw, 0); gr.addColorStop(0, cl[2]); gr.addColorStop(0.15, cl[0]); gr.addColorStop(0.5, cl[1]); gr.addColorStop(0.85, cl[0]); gr.addColorStop(1, cl[2]);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x1 - tw, top, 2 * tw, bot - top);
      ctx.fillStyle = gr; ctx.fillRect(x1 - tw, top, ed, bot - top); ctx.fillRect(x1 + tw - ed, top, ed, bot - top);
      ctx.strokeStyle = "rgba(19,35,58,.6)"; ctx.lineWidth = 1.5; ctx.strokeRect(x1 - tw, top, 2 * tw, bot - top);
      S.draw.label(c, "avec tube (" + ({cu: "cuivre", al: "alu", lt: "laiton", pl: "plastique"})[mat.value] + ")", x1, 16, {size: 11.5});
      S.draw.label(c, "chute libre", x2, 16, {size: 11.5});
      Pm.metal(c, x2 - 34, bot + 2, 68, 6, 2, "#7d8795");
      var ym = top + y1 * sc;
      /* courants de Foucault */
      if (!M.free && v1 > 0.001){
        var lum = Math.min(1, v1 / Math.max(0.05, M.vt) * 1.0);
        [-26, 6, 38].forEach(function(o, j){ var yy = ym + 14 + o; if (yy < top + 4 || yy > bot - 4) return; ctx.beginPath(); ctx.ellipse(x1, yy, tw - 3, 5, 0, 0, 7); ctx.strokeStyle = "rgba(255,213,74," + (0.3 + 0.7 * lum) * (j === 1 ? 1 : 0.6) + ")"; ctx.lineWidth = 3; ctx.stroke(); });
        S.draw.glow(c, x1, ym + 14, 40, "#ffd54a", 0.35 * lum);
      }
      Pm.magnet(c, x1, ym + 14, 38, 20, -Math.PI / 2, {letters: false}); Pm.magnet(c, x2, top + y2 * sc + 14, 38, 20, -Math.PI / 2, {letters: false});
      /* règle */
      for (var q = 0; q <= 5; q++){ var yy2 = top + q / 5 * (bot - top); S.draw.line(c, W - 26, yy2, W - 18, yy2, P.grey, 1.2); S.draw.text(c, S.fmt(M.H * q / 5, 2).replace(",00", ""), W - 30, yy2, {size: 10, color: P.grey, align: "right", weight: 600}); }
      S.draw.text(c, "m", W - 10, top - 10, {size: 10.5, color: P.grey});
      S.draw.display(c, S.fmt(Math.min(tt, M.tt), 2) + " s", x1, bot + 26, {w: 80, h: 34, size: 16});
      S.draw.display(c, S.fmt(Math.min(tt, M.tf), 2) + " s", x2, bot + 26, {w: 80, h: 34, size: 16});
      ro.set(0, M.free ? "pas de limite" : S.fmt(M.vt * 100, 1) + " cm/s"); ro.set(1, S.fmt(M.tt, 2) + " s"); ro.set(2, S.fmt(M.tf, 2) + " s");
      ro.set(3, S.fmt(M.Q * 1000, 1) + " mJ sur " + S.fmt(M.m * g * M.H * 1000, 1) + " mJ");
      /* graphe vitesse(temps) */
      var tmax = Math.max(M.tf * 1.2, Math.min(M.tt * 1.08, 12)), ymax = M.free ? g * M.tf * 105 : M.vt * 150;
      var ax = S.draw.axes(gv, {x0: 0, x1: tmax, y0: 0, y1: ymax, xl: "t (s)", yl: "v (cm/s)", l: 52, t: 20});
      S.draw.fn(gv, ax, function(x){ return x > M.tf ? NaN : g * x * 100; }, P.grey, 2.4, [5, 4]);
      S.draw.fn(gv, ax, function(x){ return x > M.tt ? NaN : M.v(x) * 100; }, P.acc, 2.8);
      if (!M.free) S.draw.line(gv, ax.L, ax.Y(M.vt * 100), ax.R, ax.Y(M.vt * 100), P.red, 1.4, [5, 4]);
      S.draw.legend(gv, [[P.grey, "chute libre (sort du cadre)", true], [P.acc, "dans le tube"]], gv.W - 10, gv.H - 66, {align: "right"});
      var tc = Math.min(tt, M.tt); S.draw.dot(gv, ax.X(Math.min(tc, tmax)), ax.Y(Math.min(ymax, M.v(tc) * 100)), 6, P.acc);
    });
  }
});

