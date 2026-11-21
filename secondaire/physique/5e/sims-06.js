/* Chapitre 6 · Mouvement circulaire uniforme */
SFA.sim({
  id: "p5-c06-pierre", ch: "c06", tag: "Classique",
  titre: "La pierre au bout d'une corde : vitesse constante, accélération non nulle",
  resume: "Rayon, vitesse → période, accélération centripète et tension.",
  but: "Fais tourner la pierre. Observe que le vecteur vitesse (tangent) change de direction alors que sa norme est constante, et que l'accélération pointe vers le centre. Cherche comment la tension de la corde dépend de la vitesse et du rayon.",
  aRetenir: "MCU : v = ω·R = 2πR/T. L'accélération est centripète : a = v²/R = ω²·R, dirigée vers le centre. La force qui la produit (tension de la corde) vaut F = m·v²/R. Doubler la vitesse multiplie la tension par 4.",
  piege: "« Vitesse constante, donc a = 0 » est faux : a mesure le changement du vecteur vitesse, direction comprise. Et aucune force n'est dirigée vers l'extérieur sur la pierre : seule la corde (vers le centre) agit dans le plan.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.66});
    var R = k.slider("Rayon R de la trajectoire", 0.2, 2, 0.1, 1, "m");
    var v = k.slider("Vitesse v (valeur constante)", 0.5, 12, 0.5, 4, "m/s");
    var m = k.slider("Masse de la pierre", 0.1, 1, 0.05, 0.3, "kg");
    var sp = k.seg("Temps", [[1, "Réel"], [0.2, "Ralenti ×5"]], 0.2);
    var ro = k.readouts(["Période (un tour)", "Fréquence", "Vitesse angulaire", "Accélération centripète", "Tension de la corde"]);
    var nt = k.note("", ""), th = 0, G = {cx: 0, cy: 0, u: 1, sx: 0, sy: 0, tx: 0, ty: 0};
    var lp = k.loop(function(dt){ th += v.value / R.value * dt * sp.value; k.redraw(); });
    lp.play();
    /* manipulation directe : la pierre (rayon) et la pointe du vecteur vitesse (valeur de v) */
    P5x.drag(c, k, function(){ return [
      {x: G.tx, y: G.ty, r: 24, set: function(px, py){ var L = Math.hypot(px - G.sx, py - G.sy); v.set(Math.round(P5.clamp((L - 18) / 12, 0.5, 12) * 2) / 2); }},
      {x: G.sx, y: G.sy, r: 24, set: function(px, py){ R.set(Math.round(P5.clamp(Math.hypot(px - G.cx, py - G.cy) / G.u, 0.2, 2) * 10) / 10); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx; P5x.sky(c, "#f7fafd", "#eaf1f8");
      var small = c.W < 600, cx = small ? c.W / 2 : c.W * 0.4, cy = c.H / 2 + (small ? 14 : 0), u = (Math.min(cx - 16, c.H / 2 - (small ? 40 : 18))) / 2.25, r = R.value * u;
      /* grille polaire : anneaux tous les 0,5 m */
      ctx.lineWidth = 1; for (var q = 0.5; q <= 2.0001; q += 0.5){ ctx.strokeStyle = "rgba(100,120,150,.18)"; ctx.beginPath(); ctx.arc(cx, cy, q * u, 0, 7); ctx.stroke(); P5x.hint(c, S.fmt(q, 1) + " m", {x: cx + q * u * 0.707 + 3, y: cy - q * u * 0.707 - 2, size: 10, color: "#9aa6b6"}); }
      ctx.strokeStyle = "rgba(100,120,150,.18)"; ctx.beginPath(); ctx.moveTo(cx - 2.2 * u, cy); ctx.lineTo(cx + 2.2 * u, cy); ctx.moveTo(cx, cy - 2.2 * u); ctx.lineTo(cx, cy + 2.2 * u); ctx.stroke();
      /* trajectoire et traînée */
      ctx.strokeStyle = "rgba(15,27,45,.18)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      for (var i = 0; i < 26; i++){ var a0 = th - i * 0.045, a1 = th - (i + 1) * 0.045; ctx.strokeStyle = "rgba(194,106,12," + (0.55 * (1 - i / 26)).toFixed(2) + ")"; ctx.lineWidth = 7 * (1 - i / 30); ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(cx, cy, r, -a0, -a1, false); ctx.stroke(); }
      var x = cx + r * Math.cos(th), y = cy - r * Math.sin(th); G.cx = cx; G.cy = cy; G.u = u; G.sx = x; G.sy = y;
      /* la personne au centre et la corde */
      S.draw.line(c, cx, cy, x, y, "#6b7685", 2.6); P5x.ball(c, cx, cy, 12, "#4d7bd6"); S.draw.dot(c, cx, cy, 4, "#fff");
      P5x.ball(c, x, y, 9 + m.value * 8, pal.amber);
      var a = v.value * v.value / R.value, F = m.value * a;
      var tx = -Math.sin(th), ty = -Math.cos(th), Lv = 12 * v.value + 18, La = Math.min(18 + 2.2 * a, 130);
      G.tx = x + tx * Lv; G.ty = y + ty * Lv;
      P5.vec(c, x, y, x + tx * Lv, y + ty * Lv, pal.acc, "v", {size: 14, w: 3.4});
      P5.vec(c, x, y, x + (cx - x) / r * La, y + (cy - y) / r * La, pal.red, "a", {size: 14, w: 3.4});
      P5x.handle(c, G.tx, G.ty, pal.acc, 6.5);
      P5x.hint(c, "vue de dessus · glisse la pierre (R) ou la pointe de v", {y: 14, size: 11.5});
      /* hodographe : les vecteurs v ramenés à une même origine décrivent un cercle */
      var hs = small ? 58 : 78, hx = c.W - hs - 14, hy = small ? c.H - hs - 14 : hs + 36, vr = Math.min(hs - 10, (hs - 10) * v.value / 12 + 8);
      S.draw.panel(c, hx - hs - 4, hy - hs - 20, 2 * hs + 8, 2 * hs + 26, {title: "v, même origine", radius: 10});
      ctx.save(); ctx.strokeStyle = "rgba(31,75,158,.35)"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(hx, hy, vr, 0, 7); ctx.stroke(); ctx.restore();
      var hvx = tx * vr, hvy = ty * vr; P5.vec(c, hx, hy, hx + hvx, hy + hvy, pal.acc, "", {w: 3});
      var ax2 = (cx - x) / r * 26, ay2 = (cy - y) / r * 26; P5.vec(c, hx + hvx, hy + hvy, hx + hvx + ax2, hy + hvy + ay2, pal.red, "", {w: 2.6});
      S.draw.dot(c, hx, hy, 3, pal.ink);
      var T = 2 * Math.PI * R.value / v.value, w = v.value / R.value;
      ro.set(0, S.fmt(T, 2) + " s"); ro.set(1, S.fmt(1 / T, 2) + " Hz"); ro.set(2, S.fmt(w, 2) + " rad/s"); ro.set(3, S.fmt(a, 1) + " m/s²"); ro.set(4, S.fmt(F, 1) + " N");
      nt.set("Si tu doublais v, la tension serait multipliée par 4 : " + S.fmt(4 * F, 1) + " N. Tension de la corde = force centripète. " + (F > 100 ? "Au-delà de 100 N, une corde ordinaire cèderait." : ""), F > 100 ? "warn" : "");
    });
  }
});


SFA.sim({
  id: "p5-c06-rupture", ch: "c06", tag: "Défi",
  titre: "Rupture de corde : la pierre part tout droit, tangente au cercle",
  resume: "Coupe la corde au bon instant pour toucher la cible.",
  but: "Le lanceur fait tourner une pierre au-dessus de sa tête, dans le sens anti-horaire (vu d'en haut). Coupe la corde (bouton ou appui sur la scène) pour qu'elle touche la cible. Où doit se trouver la pierre quand tu coupes ? Active « Montrer la tangente » pour t'aider, puis essaie sans. Glisse sur la scène pour tourner la vue.",
  aRetenir: "Sans force, plus de courbure : la pierre repart en ligne droite, dans la direction de sa vitesse au moment de la coupure, c'est-à-dire tangente au cercle (principe d'inertie).",
  piege: "La pierre ne part jamais « vers l'extérieur », en direction radiale. Elle ne continue pas non plus sur le cercle : elle suit la tangente avec la même vitesse. (Ici on regarde le mouvement dans le plan horizontal : on ne s'occupe pas de la chute de la pierre.)",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.72});
    if (c.W < 470){ c.ratio = 0.95; c.resize(); }
    var w = k.slider("Vitesse angulaire ω", 0.5, 3, 0.1, 1.2, "rad/s");
    var tg = k.toggle("Montrer la tangente", true), sol = k.toggle("Montrer la meilleure position de coupe", false);
    var cibles = [[5, 2.5], [-4.5, 2.8], [0.5, -3.4], [4.5, -2.5]], ci = 0;
    k.button("Nouvelle cible", function(){ ci = (ci + 1) % cibles.length; reset(); });
    var th = 0, free = false, px = 0, py = 0, vx = 0, vy = 0, hit = null, R = 1.5, trail = [], wins = 0, tries = 0, cutA = 0, HY = 2.05;
    var cam = {yaw: 0, pitch: 0.92};
    function reset(){ th = 0; free = false; hit = null; trail = []; lp.play(); }
    var lp = k.loop(function(dt){
      if (!free){ th += w.value * dt; }
      else {
        var n = 4; for (var i = 0; i < n; i++){
          px += vx * dt / n; py += vy * dt / n; if (i === 0) trail.push([px, py]);
          var T = cibles[ci]; if (Math.abs(px - T[0]) < 0.55 && Math.abs(py - T[1]) < 0.55 && hit === null){ hit = true; wins++; }
        }
        if ((Math.abs(px) > 7.5 || Math.abs(py) > 5) && hit === null) hit = false;
        if (hit !== null) lp.pause();
      }
      k.redraw();
    });
    function cut(){ if (!free){ free = true; tries++; cutA = th; px = R * Math.cos(th); py = R * Math.sin(th); vx = -w.value * R * Math.sin(th); vy = w.value * R * Math.cos(th); } }
    k.button("Couper la corde !", cut, true);
    k.button("Recommencer", reset);
    P5d.orbit(c, k, cam, {p0: 0.35, p1: 1.4}, function(){ if (!free) cut(); k.redraw(); });   /* un appui (sans glisser) sur la scène coupe la corde */
    lp.play();
    var nt = k.note("", ""), ro = k.readouts(["Vitesse de la pierre", "Angle de la pierre au moment du lancer", "Direction après coupure"]);
    function best(){
      var T = cibles[ci], bt = 0, bd = 1e9;
      for (var a = 0; a < 360; a += 0.5){
        var A = a * Math.PI / 180, Px = R * Math.cos(A), Py = R * Math.sin(A), dx = -Math.sin(A), dy = Math.cos(A), rx = T[0] - Px, ry = T[1] - Py, tt = rx * dx + ry * dy;
        if (tt <= 0) continue; var d = Math.abs(rx * dy - ry * dx); if (d < bd){ bd = d; bt = a; }
      }
      return bt;
    }
    /* plan du mouvement (x, y) → monde (x, hauteur, −y) */
    function Wp(x, y, h){ return [x, h == null ? HY : h, -y]; }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, small = c.W < 470;
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, c.H, [[0, "#a8d0f0"], [1, "#e6f1fa"]]); ctx.fillRect(0, 0, c.W, c.H);
      var cm = {yaw: cam.yaw, pitch: cam.pitch, dist: 17.5, target: [0, 0.6, -0.3], focal: Math.min(c.W * 1.55, c.H * 2.3), cx: c.W / 2, cy: c.H * 0.52};
      var C0 = new P5d.Cam(cm), hz = C0.p([0, 0, -900]).y;
      if (hz > 0){ ctx.fillStyle = "#9cc58a"; ctx.fillRect(0, hz, c.W, c.H - hz); }
      /* pelouse tondue en bandes */
      var L = P5d.scene(c, cm), i;
      for (i = -12; i < 12; i++) L.poly([[i * 1.5, 0, -14], [i * 1.5 + 1.5, 0, -14], [i * 1.5 + 1.5, 0, 14], [i * 1.5, 0, 14]], i % 2 ? "#8dc07a" : "#9acb86", {flat: true});
      L.draw();
      var G = P5d.scene(c, cm);
      /* cercle de la trajectoire projeté au sol et anneaux de distance */
      for (var q = 1; q <= 5; q++) for (i = 0; i < 48; i++){ var a0 = i / 48 * 2 * Math.PI, a1 = (i + 1) / 48 * 2 * Math.PI; G.tube(Wp(q * Math.cos(a0), q * Math.sin(a0), 0.01), Wp(q * Math.cos(a1), q * Math.sin(a1), 0.01), 0.025, "#f4f8ef", {plain: true, alpha: 0.45, butt: true}); }
      G.draw();
      var sc = P5d.scene(c, cm), T = cibles[ci];
      /* cible : disque vertical tourné vers le lanceur, sur un pied */
      var tx = T[0], ty = T[1], tl = Math.hypot(tx, ty), nx = -tx / tl, ny = -ty / tl, ux = -ny, uy = nx;
      sc.tube(Wp(tx, ty, 0), Wp(tx, ty, HY - 0.5), 0.1, "#7a5a3a");
      sc.tube(Wp(tx - nx * 0.6, ty - ny * 0.6, 0), Wp(tx, ty, HY - 0.9), 0.07, "#7a5a3a");
      [0.7, 0.52, 0.34, 0.14].forEach(function(rr, j){
        var pts = []; for (var m = 0; m < 20; m++){ var a = m / 20 * 2 * Math.PI; pts.push(Wp(tx + ux * rr * Math.cos(a) + nx * 0.02 * j, ty + uy * rr * Math.cos(a) + ny * 0.02 * j, HY + rr * Math.sin(a))); }
        sc.poly(pts, hit === true ? (j % 2 ? "#e5f4ec" : "#2f9e6f") : (j % 2 ? "#ffffff" : "#c0321d"), {flat: true, bias: -0.02 * j});
      });
      sc.shadow(Wp(tx, ty, 0.005), 0.8, 0.35, 0.18);
      [[-6.8, 4.6], [2.2, 5.8], [7.8, 4.9], [-7.6, -1.5]].forEach(function(t, j){ var b = Wp(t[0], t[1], 0); sc.shadow(b, 1.3, 1.0, 0.16); sc.tube(b, [b[0], 1.7, b[2]], 0.3, "#7a5a3a"); sc.ball([b[0], 2.9 + 0.3 * (j % 2), b[2]], 1.25 + 0.2 * (j % 2), j % 2 ? "#4f8f4a" : "#5d9c4f"); });
      /* lanceur : bras droit levé, la main décrit un petit cercle */
      var hx = 0.12 * Math.cos(th), hy = 0.12 * Math.sin(th);
      var who = P5d.person(sc, {at: [-0.1, 0, 0.3], face: 0.35, h: 1.75, shirt: "#2f7fd1", pants: "#3b4a63", hair: "#3a2a1e",
        pose: {elR: [0.2, 0.98, -0.02], haR: [0.08 + hx / 1.75, 1.17, -0.14 + hy / 1.75 * -1], elL: [-0.2, 0.62, 0.06], haL: [-0.16, 0.5, 0.16]}});
      var hand = who.J("haR");
      var sx, sy;
      if (!free){ sx = R * Math.cos(th); sy = R * Math.sin(th); sc.tube(hand, Wp(sx, sy), 0.025, "#6b5a45", {plain: true}); }
      else { sx = px; sy = py; sc.tube(hand, [hand[0] + 0.25 * Math.cos(cutA), HY - 0.35, hand[2] - 0.25 * Math.sin(cutA)], 0.025, "#6b5a45", {plain: true}); }
      /* trajectoire circulaire à hauteur de la pierre */
      for (i = 0; i < 64; i += 2){ var b0 = i / 64 * 2 * Math.PI, b1 = (i + 1) / 64 * 2 * Math.PI; sc.tube(Wp(R * Math.cos(b0), R * Math.sin(b0)), Wp(R * Math.cos(b1), R * Math.sin(b1)), 0.03, "#4b5868", {plain: true, alpha: 0.55}); }
      if (sol.value && !free){
        var A = best() * Math.PI / 180, bx = R * Math.cos(A), by = R * Math.sin(A), B0 = C0.p(Wp(bx, by)), B1 = C0.p(Wp(T[0], T[1]));
        sc.add(-4e5, function(cx){ cx.save(); cx.strokeStyle = "rgba(98,54,196,.5)"; cx.lineWidth = 2; cx.setLineDash([6, 5]); cx.beginPath(); cx.moveTo(B0.x, B0.y); cx.lineTo(B1.x, B1.y); cx.stroke(); cx.restore(); });
        sc.ball(Wp(bx, by), 0.11, pal.violet, {bias: -3e5}); sc.label(Wp(bx * 1.45, by * 1.45), "coupe ici", pal.violet, {size: 11.5});
      }
      if (tg.value && !free){
        var tdx = -Math.sin(th), tdy = Math.cos(th), Q0 = C0.p(Wp(sx - tdx * 9, sy - tdy * 9)), Q1 = C0.p(Wp(sx + tdx * 9, sy + tdy * 9));
        sc.add(-3.5e5, function(cx){ cx.save(); cx.strokeStyle = "rgba(98,54,196,.6)"; cx.lineWidth = 1.8; cx.setLineDash([7, 5]); cx.beginPath(); cx.moveTo(Q0.x, Q0.y); cx.lineTo(Q1.x, Q1.y); cx.stroke(); cx.restore(); });
        /* angle droit rayon-tangente */
        var ux2 = Math.cos(th), uy2 = Math.sin(th), d0 = 0.25, r1 = C0.p(Wp(sx - ux2 * d0, sy - uy2 * d0)), r2 = C0.p(Wp(sx - ux2 * d0 + tdx * d0, sy - uy2 * d0 + tdy * d0)), r3 = C0.p(Wp(sx + tdx * d0, sy + tdy * d0));
        sc.add(-3.6e5, function(cx){ cx.save(); cx.strokeStyle = pal.violet; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(r1.x, r1.y); cx.lineTo(r2.x, r2.y); cx.lineTo(r3.x, r3.y); cx.stroke(); cx.restore(); });
      }
      if (free && trail.length > 1){
        var tp = [C0.p(Wp(R * Math.cos(cutA), R * Math.sin(cutA)))].concat(trail.map(function(p){ return C0.p(Wp(p[0], p[1])); }));
        sc.add(-3e5, function(cx){ cx.save(); cx.strokeStyle = pal.amber; cx.lineWidth = 2.6; cx.setLineDash([6, 4]); cx.beginPath(); tp.forEach(function(p, j){ if (j) cx.lineTo(p.x, p.y); else cx.moveTo(p.x, p.y); }); cx.stroke(); cx.restore(); });
      }
      /* la pierre et son ombre */
      sc.ball(Wp(sx, sy), 0.2, "#8a7a68");
      sc.shadow(Wp(sx, sy, 0.005), 0.18, 0.18, 0.25);
      var vX = free ? vx : -w.value * R * Math.sin(th), vY = free ? vy : w.value * R * Math.cos(th), Ls = 0.55;
      sc.arrow(Wp(sx, sy), Wp(sx + vX * Ls, sy + vY * Ls), pal.acc, "v", {w: 4, size: 13});
      if (!free) sc.arrow(Wp(sx, sy), Wp(sx - Math.cos(th) * 0.9, sy - Math.sin(th) * 0.9), pal.red, "T", {w: 3.2, size: 12});
      sc.draw();
      P5x.hint(c, free ? (small ? "Pierre libre : ligne droite" : "Plus de corde : la pierre file en ligne droite") : (small ? "Appuie pour couper" : "Appuie sur la scène (ou le bouton) pour couper la corde"), {y: 14, size: 12, color: "#2c3a4e"});
      P5x.hint(c, "touché " + wins + " / " + tries, {x: c.W - 10, y: 14, align: "right", size: 12, color: pal.green});
      P5d.grabHint(c, small ? "Glisse : vue" : "Glisse pour tourner la vue");
      if (hit === true) P5x.banner(c, "Touché !", pal.green, c.H - 34); else if (hit === false) P5x.banner(c, "Raté : relâchée trop tôt ou trop tard", pal.red, c.H - 34);
      var deg = (((th * 180 / Math.PI) % 360) + 360) % 360;
      ro.set(0, S.fmt(w.value * R, 2) + " m/s"); ro.set(1, free ? "—" : S.fmt(deg, 0) + " °"); ro.set(2, free ? S.fmt(((Math.atan2(vy, vx) * 180 / Math.PI) + 360) % 360, 0) + " ° (constante)" : "tangente : " + S.fmt((deg + 90) % 360, 0) + " °");
      if (hit === true) nt.set("Touché ! La direction après la coupure est celle de la tangente : la pierre garde sa vitesse, en ligne droite.", "ok");
      else if (hit === false) nt.set("Raté : la pierre est sortie sans toucher la cible. Elle est partie en ligne droite le long de la tangente. Recommence.", "warn");
      else nt.set(free ? "La pierre file en ligne droite…" : "Vise : la tangente au cercle au point où tu coupes doit passer par la cible. (Angles mesurés vu d'en haut, à partir de la direction « droite » de l'écran de départ.)", "");
    });
  }
});

SFA.sim({
  id: "p5-c06-virage", ch: "c06", tag: "Application",
  titre: "Le virage relevé : à quelle vitesse tient-on sans frottement ?",
  resume: "Angle du virage, rayon, adhérence → vitesses limites.",
  but: "La voiture roule dans un virage relevé (on la suit, vue de l'arrière ; le centre du virage est à gauche). Fais varier l'angle du virage, le rayon, l'adhérence et la vitesse. Trouve la vitesse idéale (sans frottement). Dans quelle plage de vitesse la voiture reste-t-elle sur sa trajectoire ? Glisse sur la scène pour tourner la vue.",
  aRetenir: "Sans frottement : tan θ = v²/(R·g), donc v = √(R·g·tan θ). La résultante de N et P est horizontale et pointe vers le centre : c'est elle la force centripète. En dessous : le véhicule glisse vers l'intérieur ; au-dessus : vers l'extérieur ; le frottement élargit la plage.",
  piege: "Il n'y a pas de force vers l'extérieur qui « pousse la voiture dehors » : c'est l'inertie (tendance à aller tout droit) qui fait déraper vers l'extérieur quand la force centripète disponible est insuffisante.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.72});
    if (c.W < 470){ c.ratio = 0.95; c.resize(); }
    var gr = k.canvas(110);
    var th = k.slider("Angle du virage θ", 0, 30, 1, 10, "°");
    var R = k.slider("Rayon R du virage", 20, 200, 5, 80, "m");
    var mu = k.slider("Adhérence μ (statique)", 0, 1, 0.05, 0.4, "");
    var vk = k.slider("Vitesse du véhicule", 10, 150, 1, 60, "km/h", function(){ st.d = 0; st.dv = 0; st.out = 0; });
    var fo = k.toggle("Forces sur la voiture", true);
    var ro = k.readouts(["Vitesse idéale (f = 0)", "Vitesse minimale", "Vitesse maximale", "Réaction N", "Frottement requis f", "Frottement maximal"]);
    var nt = k.note("", "");
    var st = {d: 0, dv: 0, dist: 0, out: 0, yaw: 0, pitch: 0.1, wheel: 0};
    function calc(){
      var g = P5.g, T = th.value * Math.PI / 180, V = vk.value / 3.6, a = V * V / R.value, t = Math.tan(T);
      var N = g * Math.cos(T) + a * Math.sin(T), f = g * Math.sin(T) - a * Math.cos(T);   /* par kg ; f > 0 : vers l'extérieur du virage (vers le haut de la pente) */
      var vi = Math.sqrt(R.value * g * t), vmax = (1 - mu.value * t) > 0 ? Math.sqrt(R.value * g * (t + mu.value) / (1 - mu.value * t)) : Infinity, vmin = t > mu.value ? Math.sqrt(R.value * g * (t - mu.value) / (1 + mu.value * t)) : 0;
      return {N: N, f: f, fmax: mu.value * N, vi: vi, vmax: vmax, vmin: vmin, a: a, V: V, T: T};
    }
    var HW = 4.5;   /* demi-largeur de la piste (m) */
    k.button("↺ Remettre la voiture sur sa voie", function(){ st.d = 0; st.dv = 0; st.out = 0; });
    var lp = k.loop(function(dt){
      var r = calc(); st.dist += r.V * dt; st.wheel += r.V / 0.33 * dt;
      if (st.out > 0){ st.out += dt; if (st.out > 1.3){ st.out = 0; st.d = 0; st.dv = 0; } }
      else {
        var ins = r.V >= r.vmin - 0.14 && r.V <= r.vmax + 0.14, ex = Math.max(0.4, Math.abs(r.f) - r.fmax);
        if (!ins){ st.dv += (r.f > 0 ? -1 : 1) * ex * dt; st.d += st.dv * dt; }   /* glissement : frottement de glissement ≈ μ·N (modèle simplifié) */
        else { st.dv = 0; st.d *= Math.max(0, 1 - 0.8 * dt); }
        if (Math.abs(st.d) > HW - 1.1) st.out = 0.001;
      }
      k.redraw();
    });
    lp.play();
    P5d.orbit(c, k, st, {p0: 0.04, p1: 0.9, y0: -1.3, y1: 1.3});
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r = calc(), T = r.T, cT = Math.cos(T), sT = Math.sin(T), Rv = R.value, g = P5.g;
      var inside = vk.value / 3.6 >= r.vmin - 0.14 && vk.value / 3.6 <= r.vmax + 0.14;   /* tolérance = demi-pas du curseur (1 km/h ≈ 0,28 m/s) */
      /* repère lié à la voiture : x vers l'extérieur du virage, y vers le haut, z vers l'arrière ; centre du virage en (−R, 0, 0) */
      function road(s, d){ var ph = s / Rv, ox = Math.cos(ph), oz = -Math.sin(ph); return [-Rv + Rv * ox + d * cT * ox, d * sT, Rv * oz + d * cT * oz]; }
      function flat(s, d, y){ var ph = s / Rv, ox = Math.cos(ph), oz = -Math.sin(ph); return [-Rv + (Rv + d) * ox, y, (Rv + d) * oz]; }
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, c.H, [[0, "#9cc8ee"], [0.6, "#dcebf8"], [1, "#eef4f9"]]); ctx.fillRect(0, 0, c.W, c.H);
      var cam = {yaw: st.yaw, pitch: st.pitch, dist: 26, target: [0.3, 0.2, -1], focal: Math.min(c.W, c.H * 1.3) * 2.45, cx: c.W / 2, cy: c.H * 0.6};
      var cm = new P5d.Cam(cam), hz = cm.p([0, 0, -2000]).y;
      /* collines au loin */
      ctx.fillStyle = "#b7d3a8"; ctx.beginPath(); ctx.moveTo(0, hz + 4); for (var x = 0; x <= c.W; x += 16) ctx.lineTo(x, hz - 10 - 14 * Math.sin(x / 70 + 1) - 8 * Math.sin(x / 23)); ctx.lineTo(c.W, hz + 4); ctx.fill();
      ctx.fillStyle = "#a9c79a"; ctx.fillRect(0, hz, c.W, c.H - hz);
      var sMax = Math.min(140, Rv * 2.2), sMin = -3.2, ds = sMax > 80 ? 4 : 2.5;
      var yin = -HW * sT, d0 = st.dist;
      /* 1. sol : intérieur (pelouse, plat), piste relevée, talus extérieur */
      var L = P5d.scene(c, cam), s;
      for (s = sMin; s < sMax; s += ds){
        var s1 = s + ds, alt = Math.floor((s + d0) / 6) % 2 === 0;
        L.poly([flat(s, -HW * cT - 40, yin), flat(s1, -HW * cT - 40, yin), flat(s1, -HW * cT, yin), flat(s, -HW * cT, yin)], "#8fbf7a", {flat: true});
        L.poly([flat(s, -HW * cT - 0.01, yin + 0.01), flat(s1, -HW * cT - 0.01, yin + 0.01), road(s1, -HW + 0.01), road(s, -HW + 0.01)], "#9fc98a", {flat: true});
        L.poly([road(s, -HW), road(s1, -HW), road(s1, HW), road(s, HW)], "#596273", {flat: true});
        /* bordures rouges et blanches */
        var kerb = Math.floor((s + d0) / 3) % 2 === 0 ? "#c0321d" : "#f4f4f4";
        L.poly([road(s, -HW), road(s1, -HW), road(s1, -HW + 0.5), road(s, -HW + 0.5)], kerb, {flat: true, bias: -0.01});
        L.poly([road(s, HW - 0.5), road(s1, HW - 0.5), road(s1, HW), road(s, HW)], kerb, {flat: true, bias: -0.01});
        /* talus extérieur et mur */
        var yo = HW * sT;
        L.poly([road(s, HW), road(s1, HW), flat(s1, HW * cT + 30, yo + 6), flat(s, HW * cT + 30, yo + 6)], "#a7c793", {flat: true});
      }
      /* marquage central (tirets qui défilent) */
      var off = ((d0 % 6) + 6) % 6;
      for (s = sMin - off; s < sMax; s += 6){ if (s + 3 < sMin) continue; L.poly([road(s, -0.12), road(s + 3, -0.12), road(s + 3, 0.12), road(s, 0.12)], "#f1f3f5", {flat: true, bias: -0.02}); }
      L.draw();
      /* coupe de la piste (face avant du remblai) : on y lit l'angle θ */
      var Lc = P5d.scene(c, cam), yb = yin - 1.1, ci = road(sMin, -HW), co = road(sMin, HW);
      Lc.poly([flat(sMin, -HW * cT - 40, yin), ci, [ci[0], yb, ci[2]], flat(sMin, -HW * cT - 40, yb)], "#7a6248", {flat: true});
      Lc.poly([ci, co, [co[0], yb, co[2]], [ci[0], yb, ci[2]]], "#8a6d4f", {flat: true});
      Lc.poly([ci, co, [co[0], co[1] - 0.25, co[2]], [ci[0], ci[1] - 0.25, ci[2]]], "#3b414c", {flat: true, bias: -0.1});
      Lc.poly([co, flat(sMin, HW * cT + 30, HW * sT + 6), flat(sMin, HW * cT + 30, yb), [co[0], yb, co[2]]], "#7a6248", {flat: true});
      Lc.draw();
      if (th.value > 0){
        var P0 = cm.p(ci), PH = cm.p([ci[0] + 7, ci[1], ci[2]]), PR = cm.p(road(sMin, -HW + 7));
        ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(P0.x, P0.y); ctx.lineTo(PH.x, PH.y); ctx.stroke(); ctx.setLineDash([]);
        var a0 = Math.atan2(PH.y - P0.y, PH.x - P0.x), a1 = Math.atan2(PR.y - P0.y, PR.x - P0.x), rA = Math.hypot(PH.x - P0.x, PH.y - P0.y) * 0.55;
        ctx.strokeStyle = "#f4c542"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(P0.x, P0.y, rA, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke(); ctx.restore();
        S.draw.label(c, "θ = " + S.fmt(th.value, 0) + " °", PH.x + 4, PH.y + 14, {color: "#8a5a00", size: 12, align: "left"});
      }
      /* 2. objets : rail extérieur, poteaux, arbres, voiture */
      var sc = P5d.scene(c, cam), po = ((d0 % 10) + 10) % 10;
      for (s = sMin - po; s < sMax; s += 10){
        var b0 = road(s, HW + 0.3), b1 = road(s + 10, HW + 0.3);
        sc.tube(b0, [b0[0], b0[1] + 0.9, b0[2]], 0.12, "#8a95a3");
        sc.tube([b0[0], b0[1] + 0.8, b0[2]], [b1[0], b1[1] + 0.8, b1[2]], 0.18, "#cfd6df", {plain: true});
        sc.tube([b0[0], b0[1] + 0.45, b0[2]], [b1[0], b1[1] + 0.45, b1[2]], 0.18, "#cfd6df", {plain: true});
      }
      var to = ((d0 % 18) + 18) % 18;
      for (s = sMin - to; s < sMax; s += 18){ var tp = flat(s, -HW * cT - 9 - 4 * Math.sin(s * 0.7 + Math.floor((s + d0) / 18)), yin); sc.tube(tp, [tp[0], tp[1] + 1.6, tp[2]], 0.35, "#7a5a3a"); sc.ball([tp[0], tp[1] + 3.1, tp[2]], 1.6, "#4f8f4a"); }
      /* voiture : repère local incliné (roulis θ) et décalé de st.d sur la pente */
      var slip = st.out > 0 ? st.out : 0, dd = st.d + (st.d > 0 ? 1 : st.d < 0 ? -1 : 0) * slip * slip * 6, yawC = (st.dv || 0) * 0.04 + (st.d > 0 ? 1 : -1) * slip * 0.5 * (st.out > 0 ? 1 : 0);
      var base = road(0, dd), cy0 = Math.cos(yawC), sy0 = Math.sin(yawC);
      function CT(q){ var x = q[0] * cy0 + q[2] * sy0, z = -q[0] * sy0 + q[2] * cy0, y = q[1]; return [base[0] + x * cT - y * sT, base[1] + x * sT + y * cT, base[2] + z]; }
      var body = "#d23b2e";
      sc.boxT(CT, [0, 0.62, 0], [0.92, 0.3, 2.15], [P5d.lit(body, 0.9), body, body, body, body, "#333"]);
      sc.boxT(CT, [0, 1.12, 0.25], [0.84, 0.22, 1.2], [P5d.lit("#2c3a4e", 1.2), "#2c3a4e", "#3d5068", "#3d5068", body, null], {taper: [0.9, 0.7, 0.1]});
      sc.boxT(CT, [0, 0.62, 2.16], [0.9, 0.12, 0.02], "#2b2f36");
      [-0.62, 0.62].forEach(function(x){ sc.boxT(CT, [x, 0.78, 2.16], [0.17, 0.07, 0.02], "#ff5a4a", {bias: -0.05}); });
      [[-0.9, -1.35], [0.9, -1.35], [-0.9, 1.35], [0.9, 1.35]].forEach(function(w){
        var a1 = CT([w[0] * 0.86, 0.33, w[1]]), a2 = CT([w[0] * 1.08, 0.33, w[1]]);
        sc.tube(a1, a2, 0.66, "#1f2329", {butt: true, plain: true});
        var hub = CT([w[0] * 1.09, 0.33, w[1]]); sc.ball(hub, 0.12, "#8a95a3");
      });
      sc.shadow(base, 1.3, 2.4, 0.22);
      /* forces au centre de masse (par kg ; 1 m·g ↔ 1,6 m) */
      if (fo.value){
        var G = CT([0, 0.8, 0]), u = 1.6 / g, nN = [-sT, cT, 0], sl = [cT, sT, 0];
        var fA = Math.max(-r.fmax, Math.min(r.fmax, r.f)), Rx = -r.N * sT + fA * cT, Ry = r.N * cT + fA * sT - g;
        sc.arrow(G, [G[0], G[1] - g * u, G[2]], pal.ink, "P", {w: 4});
        sc.arrow(G, [G[0] + nN[0] * r.N * u, G[1] + nN[1] * r.N * u, G[2]], pal.green, "N", {w: 4});
        if (Math.abs(fA) > 0.05 * g) sc.arrow([G[0] + sl[0] * 0.1, G[1] - 0.5, G[2]], [G[0] + sl[0] * (0.1 + fA * u), G[1] - 0.5 + sl[1] * fA * u, G[2]], pal.red, "f", {w: 4});
        if (Math.hypot(Rx, Ry) > 0.05 * g) sc.arrow([G[0], G[1] + 2.0, G[2]], [G[0] + Rx * u, G[1] + 2.0 + Ry * u, G[2]], pal.violet, "résultante", {w: 3.6, size: 11});
      }
      sc.draw();
      /* tableau de bord */
      var small = c.W < 470, ttl;
      if (st.out > 0 || !inside) ttl = vk.value / 3.6 > r.vmax + 0.14 ? ["Trop vite : dérapage vers l'extérieur", pal.red] : ["Trop lent : glisse vers l'intérieur", pal.red];
      else if (Math.abs(vk.value / 3.6 - r.vi) < 0.5) ttl = ["Vitesse idéale : N et P suffisent", pal.green];
      else ttl = ["Ça tient grâce au frottement", pal.acc];
      P5d.card(c, 10, 10, ttl[0], ["N = " + S.fmt(r.N / g, 2) + " m·g", "f requis = " + S.fmt(Math.abs(r.f) / g, 2) + " m·g " + (Math.abs(r.f) <= r.fmax + 1e-9 ? "≤" : ">") + " μ·N = " + S.fmt(r.fmax / g, 2) + " m·g"], ttl[1], {size: small ? 11 : 12});
      S.draw.label(c, "← centre du virage", 10, c.H - 14, {align: "left", color: pal.grey, size: 11.5});
      S.draw.label(c, S.fmt(vk.value, 0) + " km/h", c.W / 2, c.H - 14, {color: pal.ink, size: 12.5});
      P5d.grabHint(c, small ? "Glisse : vue" : "Glisse pour tourner la vue");
      /* bandes de vitesse */
      gr.clear(); var gx = gr.ctx;
      var vm = 150, X = function(v){ return 20 + v / vm * (gr.W - 40); };
      var lo = r.vmin * 3.6, hi = Math.min(r.vmax * 3.6, vm);
      gx.fillStyle = "#fbe3df"; P5x.rr(gx, X(0), 40, X(vm) - X(0), 26, 6); gx.fill();
      gx.fillStyle = "#cfe9db"; if (hi > lo) { P5x.rr(gx, X(Math.min(lo, vm)), 40, Math.max(0, X(hi) - X(Math.min(lo, vm))), 26, 6); gx.fill(); }
      S.draw.line(gr, 20, 66, gr.W - 20, 66, pal.grey, 1.5);
      for (var q = 0; q <= 150; q += 25){ S.draw.line(gr, X(q), 66, X(q), 72, pal.grey, 1.5); S.draw.text(gr, "" + q, X(q), 86, {size: 12, color: pal.grey}); }
      S.draw.text(gr, "plage sans dérapage (km/h) · trait bleu : vitesse idéale", gr.W / 2, 18, {size: 12, color: pal.green});
      if (r.vi * 3.6 <= vm) S.draw.line(gr, X(r.vi * 3.6), 34, X(r.vi * 3.6), 66, pal.acc, 3);
      S.draw.dot(gr, X(vk.value), 53, 8, inside ? pal.green : pal.red);
      ro.set(0, S.fmt(r.vi * 3.6, 0) + " km/h"); ro.set(1, S.fmt(r.vmin * 3.6, 0) + " km/h"); ro.set(2, isFinite(r.vmax) ? S.fmt(r.vmax * 3.6, 0) + " km/h" : "illimitée");
      ro.set(3, S.fmt(r.N / P5.g, 2) + " m·g"); ro.set(4, S.fmt(r.f / P5.g, 2) + " m·g"); ro.set(5, S.fmt(r.fmax / P5.g, 2) + " m·g");
      if (inside && Math.abs(vk.value / 3.6 - r.vi) < 0.5) nt.set("Vitesse idéale : N et P suffisent, le frottement n'est pas nécessaire.", "ok");
      else if (inside) nt.set("Le véhicule tient grâce au frottement : il faut f = " + S.fmt(Math.abs(r.f) / P5.g, 2) + " m·g (vers " + (r.f > 0 ? "l'extérieur de la courbe" : "le centre du virage") + ") et il peut aller jusqu'à μ·N = " + S.fmt(r.fmax / P5.g, 2) + " m·g.", "");
      else if (vk.value / 3.6 > r.vmax + 0.14) nt.set("Trop vite : le frottement ne suffit plus, le véhicule dérape vers l'extérieur du virage (il tend à aller tout droit).", "bad");
      else nt.set("Trop lentement pour cette inclinaison et cette adhérence : le véhicule glisse vers l'intérieur du virage (sur le verglas par exemple).", "bad");
    });
  }
});

SFA.sim({
  id: "p5-c06-rotor", ch: "c06", tag: "Niche utile",
  titre: "Le manège Rotor : plaqué à la paroi, sans plancher",
  resume: "Vitesse de rotation → « gravité » ressentie et condition pour ne pas glisser.",
  but: "Le cylindre tourne avec ses passagers adossés à la paroi. Ouvre le plancher : il descend. Restent-ils collés au mur ? Baisse la rotation (ou arrête le manège) jusqu'à ce qu'ils glissent, puis modifie le rayon et l'adhérence. Glisse sur la scène pour tourner autour du manège.",
  aRetenir: "La paroi pousse la personne vers le centre avec N = m·ω²·R (c'est la force centripète). Le frottement statique vertical, f ≤ μ·N, doit équilibrer le poids : on ne glisse pas si μ·ω²·R ≥ g, c'est-à-dire ω ≥ √(g/(μ·R)).",
  piege: "La personne n'est pas « poussée contre le mur par la force centrifuge » : c'est le mur qui la pousse vers le centre. Ce qu'elle ressent comme une gravité vers l'extérieur est la réaction N de la paroi. Et la masse n'intervient pas dans la vitesse minimale.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8});
    if (c.W < 600){ c.ratio = 1.05; c.resize(); }
    var gr = k.canvas(170);
    var R = k.slider("Rayon du cylindre", 2, 5, 0.1, 3, "m");
    var tr = k.slider("Rotation", 5, 40, 1, 32, "tr/min");
    var mu = k.slider("Adhérence μ (vêtement/paroi)", 0.1, 0.8, 0.05, 0.4, "");
    var sp = k.seg("Temps", [[1, "Réel"], [0.35, "Ralenti"]], 1);
    var fo = k.toggle("Forces sur le passager en jaune", true);
    var ro = k.readouts(["Vitesse angulaire", "Vitesse linéaire", "Accélération centripète", "Réaction / poids", "Frottement requis / maximal", "Rotation minimale"]);
    var nt = k.note("", "");
    var g = P5.g, DROP = 1.4, TOP = 2.6, BOT = -1.7, SK = -1.55, NP = 6;
    var st = {w: tr.value * 2 * Math.PI / 60, on: true, fT: 0, f: 0, ang: 0.35, yaw: 0, pitch: 0.52, t: 0};
    var pas = []; for (var i = 0; i < NP; i++) pas.push({h: 0, v: 0});
    var COL = ["#f4c542", "#2f7fd1", "#c43a7a", "#24775a", "#e07a1f", "#6236c4"], PANTS = ["#2c3a4e", "#3b4a63", "#4a3b2f", "#2c3a4e", "#1f2937", "#5f6b7a"], HAIR = ["#5b3b25", "#1f1a17", "#a0612b", "#2b2118", "#d9b26a", "#3a2a1e"];
    var bFloor = k.button("⬇ Ouvrir le plancher", function(){ st.fT = st.fT < 0 ? 0 : -DROP; bFloor.textContent = st.fT < 0 ? "⬆ Remonter le plancher" : "⬇ Ouvrir le plancher"; }, true);
    var bMot = k.button("Arrêter le manège", function(){ st.on = !st.on; bMot.textContent = st.on ? "Arrêter le manège" : "Relancer le manège"; });
    function wTarget(){ return st.on ? tr.value * 2 * Math.PI / 60 : 0; }
    var lp = k.loop(function(dt){
      dt *= sp.value; st.t += dt;
      var wt = wTarget(), dw = 1.4 * dt; st.w += Math.max(-dw, Math.min(dw, wt - st.w));
      st.ang += st.w * dt;
      var df = 1.2 * dt; st.f += Math.max(-df, Math.min(df, st.fT - st.f));
      var a = st.w * st.w * R.value, holds = mu.value * a >= g - 1e-9;
      pas.forEach(function(p){
        if (p.h > st.f + 1e-6){
          if (holds) p.v = 0;
          else { p.v -= (g - mu.value * a) * dt; p.h += p.v * dt; }
        }
        if (p.h <= st.f){ p.h = st.f; p.v = 0; }
      });
      k.redraw();
    });
    lp.play();
    P5d.orbit(c, k, st, {p0: 0.12, p1: 1.2});
    function arrowsFor(sc, base, uIn, Nmg, state){
      var s = 0.42, cen = [base[0], base[1] + 1.05, base[2]], pal = S.draw.palette;
      var Ln = Math.min(2.4, Nmg * s);
      sc.arrow(cen, [cen[0] + uIn[0] * Ln, cen[1], cen[2] + uIn[2] * Ln], pal.red, "N", {w: 4});
      sc.arrow([cen[0] - uIn[0] * 0.06, cen[1] - 0.05, cen[2] - uIn[2] * 0.06], [cen[0] - uIn[0] * 0.06, cen[1] - 0.05 - s, cen[2] - uIn[2] * 0.06], pal.ink, "P", {w: 4, dx: 4});
      if (state === "floor") sc.arrow([base[0] + uIn[0] * 0.12, base[1] + 0.02, base[2] + uIn[2] * 0.12], [base[0] + uIn[0] * 0.12, base[1] + 0.02 + s, base[2] + uIn[2] * 0.12], pal.green, "plancher", {w: 3.4, size: 11});
      else { var fl = state === "hold" ? 1 : Math.min(1, mu.value * Nmg); sc.arrow([cen[0] - uIn[0] * 0.2, cen[1] + 0.05, cen[2] - uIn[2] * 0.2], [cen[0] - uIn[0] * 0.2, cen[1] + 0.05 + fl * s, cen[2] - uIn[2] * 0.2], pal.green, "f", {w: 4}); }
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, Rv = R.value, Rr = Math.max(Rv, 2.6);
      var w = tr.value * 2 * Math.PI / 60, a = w * w * Rv, N = a / g, wmin = Math.sqrt(g / (mu.value * Rv)), trmin = wmin * 60 / (2 * Math.PI);
      var holds = mu.value * a >= g - 1e-9;
      var aC = st.w * st.w * Rv, Nc = aC / g, holdsC = mu.value * aC >= g - 1e-9;
      /* décor : ciel, fête foraine lointaine */
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, c.H, [[0, "#bcd9f2"], [0.55, "#e9f2fb"], [1, "#f4efe6"]]); ctx.fillRect(0, 0, c.W, c.H);
      var dist = 3.3 * Rr + 5, focal = Math.min(c.W * 0.95, c.H * 1.1) * dist / (2 * Rr + 2.2);
      var cam = {yaw: st.yaw, pitch: st.pitch, dist: dist, target: [0, 0.35, 0], focal: focal, cx: c.W / 2, cy: c.H * 0.53};
      /* horizon : sol lointain */
      var hz = new P5d.Cam(cam).p([0, BOT, -400]).y;
      ctx.fillStyle = P5x.lin(ctx, 0, hz, 0, c.H, [[0, "#d9d2c4"], [1, "#cbbfa9"]]); ctx.fillRect(0, hz, c.W, c.H - hz);
      for (var q = 0; q < 7; q++){ var bx = ((q * 0.17 + 0.05) % 1) * c.W, bh = 18 + (q * 37) % 30; ctx.fillStyle = ["rgba(196,58,122,.22)", "rgba(47,127,209,.22)", "rgba(224,122,31,.22)"][q % 3]; ctx.beginPath(); ctx.moveTo(bx - 22, hz); ctx.lineTo(bx, hz - bh); ctx.lineTo(bx + 22, hz); ctx.fill(); }
      /* 1. sol, socle */
      var L1 = P5d.scene(c, cam);
      L1.disc([0, BOT, 0], Rv + 3.2, 40, "#d8cdb9", {flat: true});
      L1.disc([0, BOT + 0.001, 0], Rv + 1.1, 40, "#b9b2a6", {flat: true});
      L1.draw();
      /* 2. fosse et bas de paroi (sous le plancher) */
      var L2 = P5d.scene(c, cam);
      L2.disc([0, BOT + 0.05, 0], Rv, 32, "#3b4556", {flat: true});
      L2.wall([0, 0, 0], Rv, BOT + 0.05, st.f - 0.05, 32, function(){ return "#5d6878"; }, {cull: true});
      L2.draw();
      /* 3. plancher (tourne avec le cylindre) */
      var L3 = P5d.scene(c, cam), n = 24, fy = st.f;
      for (i = 0; i < n; i++){ var a0 = st.ang + i / n * 2 * Math.PI, a1 = st.ang + (i + 1) / n * 2 * Math.PI;
        L3.poly([[0, fy, 0], [Rv * 0.985 * Math.cos(a0), fy, Rv * 0.985 * Math.sin(a0)], [Rv * 0.985 * Math.cos(a1), fy, Rv * 0.985 * Math.sin(a1)]], i % 2 ? "#8b9bb3" : "#a3b2c7", {flat: true}); }
      L3.disc([0, fy + 0.005, 0], 0.35, 16, "#5d6878", {flat: true});
      pas.forEach(function(p, j){ var phi = st.ang + j * 2 * Math.PI / NP + 0.3, rr = Rv - 0.35, gap = p.h - fy; L3.shadow([rr * Math.cos(phi), fy + 0.01, rr * Math.sin(phi)], 0.3 + gap * 0.12, 0.3 + gap * 0.12, Math.max(0.06, 0.24 - gap * 0.09)); });
      L3.draw();
      /* 4. paroi intérieure du fond : panneaux rouges et crème qui tournent */
      var L4 = P5d.scene(c, cam);
      if (fy < -0.02) L4.wall([0, 0, 0], Rv, fy, 0, 36, function(j){ return j % 2 ? "#7b8696" : "#6d7888"; }, {cull: true, rot: st.ang});
      L4.wall([0, 0, 0], Rv, Math.max(fy, 0), TOP, 36, function(j){ return (Math.floor(j / 2) % 2) ? "#f3e6cf" : "#cf4a3c"; }, {cull: true, rot: st.ang});
      for (i = 0; i < 36; i++){ var e0 = i / 36 * 2 * Math.PI, e1 = (i + 1) / 36 * 2 * Math.PI; L4.tube([Rv * 0.995 * Math.cos(e0), 0, Rv * 0.995 * Math.sin(e0)], [Rv * 0.995 * Math.cos(e1), 0, Rv * 0.995 * Math.sin(e1)], 0.05, "#e8c35a", {butt: true, plain: true}); }
      L4.draw();
      /* 5. scène triée : passagers, paroi avant vitrée, anneaux */
      var sc = P5d.scene(c, cam), yel = null;
      pas.forEach(function(p, j){
        var phi = st.ang + j * 2 * Math.PI / NP + 0.3, rr = Rv - 0.2, x = rr * Math.cos(phi), z = rr * Math.sin(phi);
        var face = Math.atan2(-Math.cos(phi), -Math.sin(phi)), onFloor = p.h <= st.f + 1e-4, sliding = p.v < -0.01;
        var pose = onFloor && st.f > -0.05 ? {haL: [-0.19, 0.5, -0.04], haR: [0.19, 0.5, -0.04], elL: [-0.17, 0.64, -0.05], elR: [0.17, 0.64, -0.05]}
          : sliding ? {elL: [-0.24, 0.9, -0.08], elR: [0.24, 0.9, -0.08], haL: [-0.3, 1.04, -0.1], haR: [0.3, 1.04, -0.1], footL: [-0.11, 0, 0.04], footR: [0.11, 0, 0.04]}
          : {elL: [-0.26, 0.76, -0.1], elR: [0.26, 0.76, -0.1], haL: [-0.36, 0.84, -0.12], haR: [0.36, 0.84, -0.12], footL: [-0.1, 0, -0.02], footR: [0.1, 0, -0.02], kneeL: [-0.08, 0.27, 0.01], kneeR: [0.08, 0.27, 0.01]};
        P5d.person(sc, {at: [x, p.h, z], face: face, h: 1.68, lean: -0.04, shirt: COL[j], pants: PANTS[j], hair: HAIR[j], pose: pose, shadow: false});
        if (j === 0) yel = {base: [x, p.h, z], uIn: [-Math.cos(phi), 0, -Math.sin(phi)], state: onFloor ? "floor" : (holdsC ? "hold" : "slide")};
      });
      /* paroi extérieure : vitrée à l'avant (on voit à l'intérieur), socle opaque */
      for (i = 0; i < 36; i++){ var b0 = st.ang + i / 36 * 2 * Math.PI, b1 = st.ang + (i + 1) / 36 * 2 * Math.PI;
        var p0 = [Rv * Math.cos(b0), 0, Rv * Math.sin(b0)], p1 = [Rv * Math.cos(b1), 0, Rv * Math.sin(b1)];
        sc.poly([[p1[0], SK, p1[2]], [p0[0], SK, p0[2]], [p0[0], TOP, p0[2]], [p1[0], TOP, p1[2]]], "#8fb3dd", {cull: true, alpha: 0.16, stroke: i % 3 ? null : "rgba(70,95,130,.28)", lw: 1});
        sc.poly([[p1[0], BOT, p1[2]], [p0[0], BOT, p0[2]], [p0[0], SK, p0[2]], [p1[0], SK, p1[2]]], i % 2 ? "#a93a2f" : "#b8463a", {cull: true});
        sc.tube([p0[0], TOP, p0[2]], [p1[0], TOP, p1[2]], 0.12, "#4b5563", {butt: true, plain: true});
        sc.tube([p0[0] * 1.005, SK, p0[2] * 1.005], [p1[0] * 1.005, SK, p1[2] * 1.005], 0.07, "#e8c35a", {butt: true, plain: true});
      }
      /* axe et moteur au-dessus */
      if (fo.value && yel) arrowsFor(sc, yel.base, yel.uIn, Nc, yel.state);
      /* sens de rotation */
      var A0 = sc.cam.p([0, fy, 0]), A1 = sc.cam.p([0, TOP + 1.1, 0]);
      sc.add(-5e5, function(cx2){ cx2.save(); cx2.strokeStyle = "rgba(98,54,196,.55)"; cx2.lineWidth = 1.6; cx2.setLineDash([6, 5]); cx2.beginPath(); cx2.moveTo(A0.x, A0.y); cx2.lineTo(A1.x, A1.y); cx2.stroke(); cx2.restore(); });
      var rp = []; for (i = 0; i <= 20; i++){ var aa = 0.4 + i * 0.22; rp.push([0.75 * Math.cos(aa), TOP + 0.85, 0.75 * Math.sin(aa)]); }
      for (i = 0; i < 18; i++) sc.tube(rp[i], rp[i + 1], 0.06, pal.violet, {plain: true, bias: -6e5});
      sc.arrow(rp[18], rp[20], pal.violet, "ω", {w: 3, size: 12});
      sc.draw();
      /* tableau de bord */
      var small = c.W < 470;
      var stat = st.f > -0.02 ? (holdsC ? ["Plancher en place", pal.grey] : ["Plancher en place · rotation trop lente", pal.amber]) : (pas[0].h <= st.f + 1e-4 ? ["Ils ont glissé jusqu'au plancher", pal.red] : holdsC ? ["Ça tient : plaqués à la paroi !", pal.green] : ["Ça glisse !", pal.red]);
      P5d.card(c, 10, 10, stat[0], ["N = m·ω²·R = " + S.fmt(Nc, 2) + " m·g (paroi → centre)", "f max = μ·N = " + S.fmt(mu.value * Nc, 2) + " m·g " + (holdsC ? "≥" : "<") + " P = m·g"], stat[1], {size: small ? 11 : 12});
      /* jauge de frottement (à la rotation actuelle) */
      var need = aC > 1e-6 ? g / (mu.value * aC) : Infinity, gw = small ? 124 : 150, gx = c.W - gw - 10, gy = small ? c.H - 92 : 10;
      S.draw.panel(c, gx, gy, gw, 52, {radius: 9});
      S.draw.text(c, "f requis / f max", gx + 10, gy + 13, {align: "left", size: 10.5, color: "#5f6b7a", weight: 700});
      P5x.rr(ctx, gx + 10, gy + 24, gw - 20, 9, 4.5); ctx.fillStyle = "#e7ebf0"; ctx.fill();
      var fr = Math.min(1, isFinite(need) ? need / 1.25 : 1); P5x.rr(ctx, gx + 10, gy + 24, Math.max(4, (gw - 20) * fr), 9, 4.5); ctx.fillStyle = need <= 1 ? pal.green : pal.red; ctx.fill();
      ctx.fillStyle = pal.ink; ctx.fillRect(gx + 10 + (gw - 20) / 1.25 - 1, gy + 21, 2, 15);
      S.draw.text(c, isFinite(need) ? (need > 9.99 ? "> 999 %" : S.fmt(need * 100, 0) + " %") : "∞", gx + 10, gy + 43, {align: "left", size: 11, color: need <= 1 ? pal.green : pal.red, weight: 800});
      S.draw.text(c, "100 %", gx + 10 + (gw - 20) / 1.25, gy + 43, {size: 9.5, color: "#5f6b7a", weight: 700});
      S.draw.label(c, S.fmt(st.w * 60 / (2 * Math.PI), 0) + " tr/min · ω = " + S.fmt(st.w, 2) + " rad/s", 10, c.H - 14, {align: "left", color: pal.violet, size: 11.5});
      P5d.grabHint(c, small ? "Glisse : tourner" : "Glisse pour tourner autour du manège");
      /* graphe : adhérence nécessaire selon la rotation */
      gr.clear();
      var ax = S.draw.axes(gr, {x0: 5, x1: 40, y0: 0, y1: 1, xl: "rotation (tr/min)", yl: "μ nécessaire", stepX: 5, stepY: 0.25});
      var muMin = function(n){ var ww = n * 2 * Math.PI / 60; return g / (ww * ww * Rv); };
      S.draw.area(gr, ax, function(x){ return Math.min(1, Math.max(0, mu.value)); }, Math.max(5, trmin), 40, pal.green, 0.12, function(x){ return Math.min(mu.value, muMin(x)); });
      S.draw.fn(gr, ax, function(x){ var m0 = muMin(x); return m0 > 1.02 ? NaN : m0; }, pal.acc, 2.4);
      S.draw.line(gr, ax.X(5), ax.Y(mu.value), ax.X(40), ax.Y(mu.value), pal.amber, 2, [6, 4]);
      S.draw.text(gr, "μ = " + S.fmt(mu.value, 2), ax.X(40) - 4, ax.Y(mu.value) - 9, {align: "right", size: 11, color: pal.amber});
      if (trmin <= 40){ S.draw.line(gr, ax.X(trmin), ax.Y(0), ax.X(trmin), ax.Y(mu.value), pal.grey, 1.2, [3, 3]); S.draw.text(gr, "min " + S.fmt(trmin, 1), ax.X(trmin), ax.Y(0) - 9, {size: 10.5, color: pal.ink}); }
      S.draw.dot(gr, ax.X(tr.value), ax.Y(Math.min(1, muMin(tr.value))), 6, holds ? pal.green : pal.red);
      ro.set(0, S.fmt(w, 2) + " rad/s"); ro.set(1, S.fmt(w * Rv, 1) + " m/s"); ro.set(2, S.fmt(a, 1) + " m/s² (" + S.fmt(N, 1) + " g)"); ro.set(3, S.fmt(N, 2));
      ro.set(4, S.fmt(g / (mu.value * a) * 100, 0) + " %"); ro.set(5, S.fmt(trmin, 1) + " tr/min");
      nt.set((holds ? "μ·N = " + S.fmt(mu.value * N, 2) + " m·g ≥ m·g : le frottement statique peut compenser le poids (il n'en utilise que " + S.fmt(g / (mu.value * a) * 100, 0) + " %). Plancher ouvert, les passagers restent collés." : "μ·N = " + S.fmt(mu.value * N, 2) + " m·g < m·g : le frottement maximal ne compense pas le poids, les passagers glissent dès que le plancher descend. Il faut au moins " + S.fmt(trmin, 1) + " tr/min.") + " <small>(Glissade : modèle simplifié, même μ qu'à l'arrêt.)</small>", holds ? "ok" : "warn");
    });
  }
});
