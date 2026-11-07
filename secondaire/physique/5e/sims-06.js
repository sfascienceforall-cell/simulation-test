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
  but: "La pierre tourne dans le sens anti-horaire. Coupe la corde pour qu'elle touche la cible. Où doit se trouver la pierre quand tu coupes ? Active « Montrer la tangente » pour t'aider, puis essaie sans.",
  aRetenir: "Sans force, plus de courbure : la pierre repart en ligne droite, dans la direction de sa vitesse au moment de la coupure, c'est-à-dire tangente au cercle (principe d'inertie).",
  piege: "La pierre ne part jamais « vers l'extérieur », en direction radiale. Elle ne continue pas non plus sur le cercle : elle suit la tangente avec la même vitesse.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.66});
    var w = k.slider("Vitesse angulaire ω", 0.5, 3, 0.1, 1.2, "rad/s");
    var tg = k.toggle("Montrer la tangente", true), sol = k.toggle("Montrer la meilleure position de coupe", false);
    var cibles = [[5, 2.5], [-4.5, 2.8], [0.5, -3.4], [4.5, -2.5]], ci = 0;
    k.button("Nouvelle cible", function(){ ci = (ci + 1) % cibles.length; reset(); });
    var th = 0, free = false, px = 0, py = 0, vx = 0, vy = 0, hit = null, R = 1.5, trail = [], wins = 0, tries = 0, cutA = 0;
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
    c.pointer(function(type){ if (type === "down" && !free) cut(); });   /* un appui sur la scène coupe la corde */
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
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx; P5x.sky(c, "#f7fafd", "#e9f1e7");
      var f = P5.frame(c, {x0: -7, x1: 7, y0: -4.6, y1: 4.6}, {grid: false});
      /* pelouse et anneaux */
      ctx.fillStyle = "rgba(120,170,120,.13)"; ctx.fillRect(f.X(-7), f.Y(4.6), 14 * f.u, 9.2 * f.u);
      ctx.strokeStyle = "rgba(100,120,150,.2)"; ctx.lineWidth = 1; for (var q = 1; q <= 5; q++){ ctx.beginPath(); ctx.arc(f.X(0), f.Y(0), q * f.u, 0, 7); ctx.stroke(); }
      ctx.strokeStyle = "rgba(15,27,45,.28)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(f.X(0), f.Y(0), R * f.u, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      /* cible : cercles concentriques */
      var T = cibles[ci], tx0 = f.X(T[0]), ty0 = f.Y(T[1]);
      [0.7, 0.5, 0.3, 0.12].forEach(function(rr, i){ ctx.fillStyle = hit === true ? (i % 2 ? "#e5f4ec" : "#2f9e6f") : (i % 2 ? "#ffffff" : "#c0321d"); ctx.beginPath(); ctx.arc(tx0, ty0, rr * f.u * 1.1, 0, 7); ctx.fill(); });
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(tx0, ty0, 0.77 * f.u, 0, 7); ctx.stroke();
      var sx, sy;
      if (!free){ sx = R * Math.cos(th); sy = R * Math.sin(th); S.draw.line(c, f.X(0), f.Y(0), f.X(sx), f.Y(sy), "#6b7685", 2.6); } else { sx = px; sy = py; }
      P5x.ball(c, f.X(0), f.Y(0), 11, "#4d7bd6"); S.draw.dot(c, f.X(0), f.Y(0), 3.5, "#fff");
      if (sol.value && !free){
        var A = best() * Math.PI / 180, bx = R * Math.cos(A), by = R * Math.sin(A);
        S.draw.line(c, f.X(bx), f.Y(by), f.X(T[0]), f.Y(T[1]), "rgba(98,54,196,.35)", 1.5, [5, 5]);
        S.draw.dot(c, f.X(bx), f.Y(by), 6, pal.violet); P5x.tag(c, "coupe ici", f.X(bx * 1.3), f.Y(by * 1.3), pal.violet, {size: 11.5});
      }
      if (tg.value && !free){
        var tx = -Math.sin(th), ty = Math.cos(th);
        S.draw.line(c, f.X(sx - tx * 9), f.Y(sy - ty * 9), f.X(sx + tx * 9), f.Y(sy + ty * 9), "rgba(98,54,196,.45)", 1.6, [6, 5]);
        /* angle droit rayon-tangente */
        var ux = Math.cos(th), uy = Math.sin(th), d0 = 0.22; ctx.strokeStyle = pal.violet; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(f.X(sx - ux * d0), f.Y(sy - uy * d0)); ctx.lineTo(f.X(sx - ux * d0 + tx * d0), f.Y(sy - uy * d0 + ty * d0)); ctx.lineTo(f.X(sx + tx * d0), f.Y(sy + ty * d0)); ctx.stroke();
      }
      if (free && trail.length > 1){ ctx.strokeStyle = pal.amber; ctx.lineWidth = 2.4; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(f.X(R * Math.cos(cutA)), f.Y(R * Math.sin(cutA))); trail.forEach(function(p){ ctx.lineTo(f.X(p[0]), f.Y(p[1])); }); ctx.stroke(); ctx.setLineDash([]); }
      P5x.ball(c, f.X(sx), f.Y(sy), 10, pal.amber);
      if (!free) P5.vec(c, f.X(sx), f.Y(sy), f.X(sx) - Math.sin(th) * w.value * R * 24, f.Y(sy) - Math.cos(th) * w.value * R * 24, pal.acc, "v", {size: 14, w: 3.4});
      else P5.vec(c, f.X(sx), f.Y(sy), f.X(sx) + vx * 24, f.Y(sy) - vy * 24, pal.acc, "v", {size: 14, w: 3.4});
      P5x.hint(c, free ? "constante : la pierre file en ligne droite" : "Appuie sur la scène (ou le bouton) pour couper", {y: 14, size: 12});
      P5x.hint(c, "touché " + wins + " / " + tries, {x: c.W - 10, y: 14, align: "right", size: 12, color: pal.green});
      if (hit === true) P5x.banner(c, "Touché !", pal.green, c.H - 22); else if (hit === false) P5x.banner(c, "Raté : relâchée trop tôt ou trop tard", pal.red, c.H - 22);
      var deg = (((th * 180 / Math.PI) % 360) + 360) % 360;
      ro.set(0, S.fmt(w.value * R, 2) + " m/s"); ro.set(1, free ? "—" : S.fmt(deg, 0) + " °"); ro.set(2, free ? S.fmt(((Math.atan2(vy, vx) * 180 / Math.PI) + 360) % 360, 0) + " ° (constante)" : "tangente : " + S.fmt((deg + 90) % 360, 0) + " °");
      if (hit === true) nt.set("Touché ! La direction après la coupure est celle de la tangente : la pierre garde sa vitesse, en ligne droite.", "ok");
      else if (hit === false) nt.set("Raté : la pierre est sortie sans toucher la cible. Elle est partie en ligne droite le long de la tangente. Recommence.", "warn");
      else nt.set(free ? "La pierre file en ligne droite…" : "Vise : la tangente au cercle au point où tu coupes doit passer par la cible.", "");
    });
  }
});

SFA.sim({
  id: "p5-c06-virage", ch: "c06", tag: "Application",
  titre: "Le virage relevé : à quelle vitesse tient-on sans frottement ?",
  resume: "Angle du virage, rayon, adhérence → vitesses limites.",
  but: "Fais varier l'angle du virage, le rayon, l'adhérence et la vitesse du véhicule. Trouve la vitesse idéale (sans frottement). Dans quelle plage de vitesse le véhicule reste-t-il sur sa trajectoire ?",
  aRetenir: "Sans frottement : tan θ = v²/(R·g), donc v = √(R·g·tan θ). La résultante de N et P est horizontale et pointe vers le centre : c'est elle la force centripète. En dessous : le véhicule glisse vers l'intérieur ; au-dessus : vers l'extérieur ; le frottement élargit la plage.",
  piege: "Il n'y a pas de force vers l'extérieur qui « pousse la voiture dehors » : c'est l'inertie (tendance à aller tout droit) qui fait déraper vers l'extérieur quand la force centripète disponible est insuffisante.",
  build: function(k, S){
    var c = k.canvas(250), gr = k.canvas(110);
    var th = k.slider("Angle du virage θ", 0, 30, 1, 10, "°");
    var R = k.slider("Rayon R du virage", 20, 200, 5, 80, "m");
    var mu = k.slider("Adhérence μ (statique)", 0, 1, 0.05, 0.4, "");
    var vk = k.slider("Vitesse du véhicule", 10, 150, 1, 60, "km/h");
    var ro = k.readouts(["Vitesse idéale (f = 0)", "Vitesse minimale", "Vitesse maximale", "Réaction N", "Frottement requis f", "Frottement maximal"]);
    var nt = k.note("", "");
    function calc(){
      var g = P5.g, T = th.value * Math.PI / 180, V = vk.value / 3.6, a = V * V / R.value, t = Math.tan(T), m = 1;
      var N = g * Math.cos(T) + a * Math.sin(T), f = g * Math.sin(T) - a * Math.cos(T);   /* par kg ; f > 0 : vers l'extérieur du virage (vers le haut de la pente) */
      var vi = Math.sqrt(R.value * g * t), vmax = (1 - mu.value * t) > 0 ? Math.sqrt(R.value * g * (t + mu.value) / (1 - mu.value * t)) : Infinity, vmin = t > mu.value ? Math.sqrt(R.value * g * (t - mu.value) / (1 + mu.value * t)) : 0;
      return {N: N, f: f, fmax: mu.value * N, vi: vi, vmax: vmax, vmin: vmin, a: a, V: V, T: T};
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r = calc(); c.clear();
      var T = r.T, cx = c.W / 2, cy = 150, L = Math.min(c.W - 40, 400);
      var ux = Math.cos(T), uy = -Math.sin(T);       /* sens de la pente vers l'extérieur et le haut : ici on dessine la route montant vers la droite */
      ctx.beginPath(); ctx.moveTo(cx - ux * L / 2, cy - uy * L / 2); ctx.lineTo(cx + ux * L / 2, cy + uy * L / 2); ctx.lineTo(cx + ux * L / 2, cy + L * 0.2); ctx.lineTo(cx - ux * L / 2, cy + L * 0.2); ctx.closePath(); ctx.fillStyle = "#e9edf3"; ctx.fill(); ctx.strokeStyle = "#6b7685"; ctx.lineWidth = 2.5; ctx.stroke();
      var nx = uy, ny = -ux;         /* normale sortante (vers le haut) : (uy, -ux) = (-sinθ, -cosθ) en coordonnées écran */
      var bx = cx + nx * 18, by = cy + ny * 18;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(-T); ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(-26, -16, 52, 32); ctx.strokeRect(-26, -16, 52, 32); ctx.restore();
      var sc = 60 / P5.g;
      P5.vec(c, bx, by, bx, by + P5.g * sc, pal.ink, "P", {dx: 12});
      P5.vec(c, bx, by, bx + nx * r.N * sc, by + ny * r.N * sc, pal.green, "N", {dx: -10});
      if (Math.abs(r.f) > 0.05){ P5.vec(c, bx, by, bx + ux * r.f * sc, by + uy * r.f * sc, pal.red, "f", {dy: 12}); }
      /* résultante horizontale */
      P5.vec(c, cx - L * 0.45, 40, cx - L * 0.45 - Math.min(r.a * sc, 100), 40, pal.violet, "", {w: 2.5});
      S.draw.text(c, "résultante = m·a (vers le centre, horizontale)", cx - L * 0.45 + 6, 22, {size: 12, color: pal.violet, align: "left"});
      S.draw.text(c, "centre du virage ←", c.W - 10, c.H - 12, {align: "right", size: 12, color: pal.grey});
      /* bandes de vitesse */
      gr.clear();
      var vm = 150, X = function(v){ return 20 + v / vm * (gr.W - 40); };
      var lo = r.vmin * 3.6, hi = Math.min(r.vmax * 3.6, vm);
      gr.ctx.fillStyle = "#dfeee6"; gr.ctx.fillRect(X(lo), 40, X(hi) - X(lo), 26);
      S.draw.line(gr, 20, 66, gr.W - 20, 66, pal.grey, 1.5);
      for (var q = 0; q <= 150; q += 25){ S.draw.line(gr, X(q), 66, X(q), 72, pal.grey, 1.5); S.draw.text(gr, "" + q, X(q), 86, {size: 12, color: pal.grey}); }
      S.draw.text(gr, "plage sans dérapage (km/h)", gr.W / 2, 18, {size: 12, color: pal.green});
      S.draw.line(gr, X(r.vi * 3.6), 34, X(r.vi * 3.6), 66, pal.acc, 3);
      S.draw.dot(gr, X(vk.value), 53, 8, (vk.value / 3.6 >= r.vmin - 0.14 && vk.value / 3.6 <= r.vmax + 0.14) ? pal.green : pal.red);
      ro.set(0, S.fmt(r.vi * 3.6, 0) + " km/h"); ro.set(1, S.fmt(r.vmin * 3.6, 0) + " km/h"); ro.set(2, isFinite(r.vmax) ? S.fmt(r.vmax * 3.6, 0) + " km/h" : "illimitée");
      ro.set(3, S.fmt(r.N / P5.g, 2) + " m·g"); ro.set(4, S.fmt(r.f / P5.g, 2) + " m·g"); ro.set(5, S.fmt(r.fmax / P5.g, 2) + " m·g");
      var inside = vk.value / 3.6 >= r.vmin - 0.14 && vk.value / 3.6 <= r.vmax + 0.14;   /* tolérance = demi-pas du curseur (1 km/h ≈ 0,28 m/s) */
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
  but: "Dans un cylindre qui tourne, le plancher s'ouvre. Augmente la vitesse de rotation jusqu'à ce que les personnes ne glissent plus. Modifie le rayon et l'adhérence.",
  aRetenir: "La paroi pousse la personne vers le centre avec N = m·ω²·R (c'est la force centripète). Le frottement statique vertical, f ≤ μ·N, doit équilibrer le poids : on ne glisse pas si μ·ω²·R ≥ g, c'est-à-dire ω ≥ √(g/(μ·R)).",
  piege: "La personne n'est pas « poussée contre le mur par la force centrifuge » : c'est le mur qui la pousse vers le centre. Ce qu'elle ressent comme une gravité vers l'extérieur est la réaction N de la paroi. Et la masse n'intervient pas dans la vitesse minimale.",
  build: function(k, S){
    var c = k.canvas(260);
    var R = k.slider("Rayon du cylindre", 2, 5, 0.1, 3, "m");
    var tr = k.slider("Rotation", 5, 40, 1, 25, "tr/min");
    var mu = k.slider("Adhérence μ (vêtement/paroi)", 0.1, 0.8, 0.05, 0.4, "");
    var ro = k.readouts(["Vitesse angulaire", "Vitesse linéaire", "Accélération centripète", "Réaction / poids", "Frottement requis / maximal", "Rotation minimale"]);
    var nt = k.note("", ""), ang = 0;
    var lp = k.loop(function(dt){ ang += tr.value * 2 * Math.PI / 60 * dt * 0.25; k.redraw(); });
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, w = tr.value * 2 * Math.PI / 60, a = w * w * R.value, N = a / g, wmin = Math.sqrt(g / (mu.value * R.value)), trmin = wmin * 60 / (2 * Math.PI);
      var holds = mu.value * a >= g - 1e-9; c.clear();
      /* vue de dessus à gauche */
      var cx = c.W * 0.27, cy = c.H / 2 + 8, r = Math.min(c.W * 0.22, 100);
      ctx.strokeStyle = "#6b7685"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
      for (var i = 0; i < 6; i++){ var A = ang + i * Math.PI / 3, x = cx + (r - 12) * Math.cos(A), y = cy - (r - 12) * Math.sin(A); S.draw.dot(c, x, y, 8, pal.amber); P5.vec(c, x, y, x - Math.cos(A) * 30, y + Math.sin(A) * 30, pal.red, "", {w: 2}); }
      S.draw.text(c, "vue de dessus : N vers le centre", cx, 18, {size: 12, color: pal.red});
      /* vue de côté à droite */
      var sx = c.W * 0.7;
      ctx.fillStyle = "#566176"; ctx.fillRect(sx + 40, 30, 12, 200);
      S.draw.line(c, sx - 110, 30, sx - 110, 230, pal.grey, 1.5, [5, 4]);
      S.draw.text(c, "paroi", sx + 46, 244, {size: 12, color: pal.grey}); S.draw.text(c, "axe de rotation", sx - 110, 244, {size: 12, color: pal.grey});
      var px = sx + 28, py = 140;
      S.draw.dot(c, px, py - 36, 12, pal.amber); S.draw.line(c, px, py - 22, px, py + 40, pal.amber, 10);
      var sc = 54 / g;
      P5.vec(c, px - 6, py, px - 6, py + g * sc, pal.ink, "P", {dx: -14});
      var Lf = Math.min(g * sc, mu.value * a * sc);
      P5.vec(c, px + 6, py, px + 6, py - Lf, pal.green, "f", {dx: 14});
      P5.vec(c, px - 14, py - 10, px - 14 - Math.min(110, N * 16 + 10), py - 10, pal.red, "N", {dx: -2, dy: -8});
      S.draw.text(c, holds ? "La personne tient" : "La personne glisse vers le bas", sx - 10, 16, {size: 14, color: holds ? pal.green : pal.red});
      ro.set(0, S.fmt(w, 2) + " rad/s"); ro.set(1, S.fmt(w * R.value, 1) + " m/s"); ro.set(2, S.fmt(a, 1) + " m/s² (" + S.fmt(N, 1) + " g)"); ro.set(3, S.fmt(N, 2));
      ro.set(4, S.fmt(g / (mu.value * a) * 100, 0) + " %"); ro.set(5, S.fmt(trmin, 1) + " tr/min");
      nt.set(holds ? "μ·N = " + S.fmt(mu.value * N, 2) + " m·g ≥ m·g : le frottement statique peut compenser le poids (il n'en utilise que " + S.fmt(g / (mu.value * a) * 100, 0) + " %)." : "μ·N = " + S.fmt(mu.value * N, 2) + " m·g < m·g : le frottement maximal ne compense pas le poids. Il faut au moins " + S.fmt(trmin, 1) + " tr/min.", holds ? "ok" : "warn");
    });
  }
});
