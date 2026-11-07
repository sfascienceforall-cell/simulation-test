/* Chapitre 1 · Magnétisme et champ magnétique */
/* Aides partagées du cours de physique 6e (chargées avec sims-01.js, utilisées par les autres chapitres) */
window.PH6 = window.PH6 || (function(){
  var H = {};
  function hex(c){ var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [128, 128, 128]; }
  /* mélange deux couleurs hexadécimales : t = 0 → a, t = 1 → b */
  H.mix = function(a, b, t){ var x = hex(a), y = hex(b); return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(x[i] + (y[i] - x[i]) * t); }).join(",") + ")"; };
  /* fond de scène : léger dégradé */
  H.bg = function(c, a, b){ var g = c.ctx.createLinearGradient(0, 0, 0, c.H); g.addColorStop(0, a || "#f8fafd"); g.addColorStop(1, b || "#edf1f7"); c.ctx.fillStyle = g; c.ctx.fillRect(0, 0, c.W, c.H); };
  /* pièce « métal » : rectangle arrondi à dégradé vertical */
  H.metal = function(c, x, y, w, h, r, col){
    var ctx = c.ctx, g = ctx.createLinearGradient(0, y, 0, y + h); col = col || "#aab3c0";
    g.addColorStop(0, H.mix(col, "#ffffff", 0.45)); g.addColorStop(0.5, col); g.addColorStop(1, H.mix(col, "#000000", 0.28));
    ctx.save(); SFA.draw.rrect(c, x, y, w, h, r); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(19,35,58,.45)"; ctx.stroke(); ctx.restore();
  };
  /* aimant droit : pôle N rouge (côté +x avant rotation), pôle S bleu ; ang en radians (écran, y vers le bas) */
  H.magnet = function(c, cx, cy, len, th, ang, o){
    o = o || {}; var ctx = c.ctx, P = SFA.draw.palette, r = Math.min(7, th / 3);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang || 0);
    function half(x0, w, col){ var g = ctx.createLinearGradient(0, -th / 2, 0, th / 2); g.addColorStop(0, H.mix(col, "#ffffff", 0.4)); g.addColorStop(0.55, col); g.addColorStop(1, H.mix(col, "#000000", 0.3)); ctx.fillStyle = g; ctx.fillRect(x0, -th / 2, w, th); }
    ctx.save(); SFA.draw.rrect(c, -len / 2, -th / 2, len, th, r); ctx.clip();
    half(-len / 2, len / 2, P.acc); half(0, len / 2, P.red); ctx.restore();
    SFA.draw.rrect(c, -len / 2, -th / 2, len, th, r); ctx.lineWidth = 1.3; ctx.strokeStyle = "rgba(19,35,58,.7)"; ctx.stroke();
    if (o.letters !== false){ ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.max(12, Math.round(th * 0.5)) + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.save(); ctx.translate(-len / 4, 0); ctx.rotate(-(ang || 0)); ctx.fillText("S", 0, 1); ctx.restore();
      ctx.save(); ctx.translate(len / 4, 0); ctx.rotate(-(ang || 0)); ctx.fillText("N", 0, 1); ctx.restore(); }
    ctx.restore();
  };
  /* bobine vue de côté : spires (arrière en retrait, avant plus marqué) entre x0 et x1, centrées en cy, demi-hauteur ry */
  H.coil = function(c, x0, x1, cy, ry, turns, col, lw){
    var ctx = c.ctx, dx = (x1 - x0) / turns, rx = Math.min(10, dx * 0.9); lw = lw || 3; col = col || SFA.draw.palette.amber;
    ctx.save(); ctx.lineCap = "round";
    for (var pass = 0; pass < 2; pass++) for (var i = 0; i < turns; i++){
      var x = x0 + (i + 0.5) * dx; ctx.beginPath();
      ctx.ellipse(x, cy, rx, ry, 0, pass ? 0 : Math.PI, pass ? Math.PI : 2 * Math.PI);
      ctx.strokeStyle = pass ? col : H.mix(col, "#ffffff", 0.55); ctx.lineWidth = pass ? lw : lw * 0.7; ctx.stroke();
    }
    ctx.restore();
  };
  /* ampoule : r = rayon, lum de 0 à 1 */
  H.bulb = function(c, x, y, r, lum, label){
    var ctx = c.ctx;
    if (lum > 0.02) SFA.draw.glow(c, x, y, r * (2 + 2.5 * lum), "#ffd54a", 0.25 + 0.55 * lum);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
    var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, H.mix("#f4f6f9", "#fff3b0", Math.min(1, lum * 1.3))); g.addColorStop(1, H.mix("#cfd6e0", "#ffc83d", Math.min(1, lum * 1.2)));
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#13233a"; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = lum > 0.05 ? "#b45309" : "#6b7686"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - r * 0.4, y + r * 0.55); ctx.lineTo(x - r * 0.25, y - r * 0.1); ctx.lineTo(x, y + r * 0.1); ctx.lineTo(x + r * 0.25, y - r * 0.1); ctx.lineTo(x + r * 0.4, y + r * 0.55); ctx.stroke(); ctx.restore();
    if (label) SFA.draw.text(c, label, x, y + r + 12, {size: 12, color: SFA.draw.palette.grey});
  };
  /* caméra 3D (perspective simple). st = {a: lacet, b: tangage} ; renvoie pr(x, y, z) → [px, py, profondeur] avec x droite, y haut, z vers le spectateur */
  H.cam = function(st, s, cx, cy, dist){
    var ca = Math.cos(st.a), sa = Math.sin(st.a), cb = Math.cos(st.b), sb = Math.sin(st.b); dist = dist || 7;
    return function(x, y, z){
      var x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb, f = dist / (dist - z2);
      return [cx + x1 * s * f, cy - y1 * s * f, z2];
    };
  };
  /* rotation à la souris / au doigt : glisser sur le canevas fait tourner la scène */
  H.orbit = function(c, st, redraw, onTouch){
    var last = null; c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, p){
      if (t === "down"){ last = p; if (onTouch) onTouch(); }
      else if (t === "drag" && last){ st.a += (p.x - last.x) * 0.012; st.b = Math.max(-1.3, Math.min(1.3, st.b + (p.y - last.y) * 0.012)); last = p; redraw(); }
      else if (t === "up") last = null;
    });
  };
  /* trait 3D entre deux points projetés */
  H.l3 = function(c, a, b, col, w, dash){ SFA.draw.line(c, a[0], a[1], b[0], b[1], col, w, dash); };
  /* petit repère « sens de lecture » : indication discrète en bas du canevas */
  H.hint = function(c, s){ SFA.draw.text(c, s, c.W / 2, c.H - 10, {size: 11.5, color: "#7b8694", weight: 600}); };
  return H;
})();

SFA.sim({
  id: "p6-c01-aimant-boussoles", ch: "c01", tag: "Classique",
  titre: "Un aimant, des boussoles, des lignes de champ",
  resume: "Tourne l'aimant, déplace une boussole d'essai et vois comment le champ s'affaiblit avec la distance.",
  but: "Fais pivoter l'aimant, glisse la boussole rouge avec la souris ou le doigt : l'aiguille suit la direction du champ. Active les lignes de champ.",
  aRetenir: "Une ligne de champ sort du pôle Nord de l'aimant et rentre par son pôle Sud ; l'aiguille d'une boussole s'oriente le long de la ligne. Là où les lignes sont serrées, le champ est plus intense. Le champ diminue très vite avec la distance (en 1/r³ pour un aimant).",
  piege: "Les lignes de champ ne sont pas des trajectoires de particules : ce sont des lignes tangentes au champ en chaque point. Et un pôle ne se sépare pas : coupe un aimant en deux, tu obtiens deux aimants complets, chacun avec un Nord et un Sud.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var ang = k.slider("Orientation de l'aimant", 0, 345, 15, 0, "°");
    var lines = k.toggle("Lignes de champ", true);
    var grid = k.toggle("Grille de boussoles", true);
    var ro = k.readouts(["Angle de l'aiguille", "Distance (centre)", "B relatif"]);
    k.note("B relatif : 100 = valeur sur l'axe de l'aimant à 100 px de son centre. Modèle du dipôle (aimant vu de loin).");
    var comp = {x: 0, y: 0, set: false};
    function field(dx, dy, u){
      var r2 = dx * dx + dy * dy; if (r2 < 1) { dx = 1; dy = 0; r2 = 1; }   /* évite la division par zéro au centre exact */
      var r = Math.sqrt(r2), rx = dx / r, ry = dy / r, d = u.x * rx + u.y * ry;
      return {x: 3 * d * rx - u.x, y: 3 * d * ry - u.y, r: r};
    }
    function needle(x, y, ux, uy, len, big){
      var ctx = c.ctx;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(uy, ux));
      ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(0, -len * 0.28); ctx.lineTo(0, len * 0.28); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.acc; ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(0, -len * 0.28); ctx.lineTo(0, len * 0.28); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (big){ S.draw.dot(c, x, y, 3, "#fff"); }
    }
    function pointer(t, p){
      if (t === "move" || t === "up") return;
      comp.x = p.x; comp.y = p.y; comp.set = true; k.redraw();
    }
    c.pointer(pointer);
    k.draw(function(){
      c.clear();
      var W = c.W, H = c.H, cx = W / 2, cy = H / 2, a = ang.value * Math.PI / 180;
      var u = {x: Math.cos(a), y: -Math.sin(a)}, n = {x: -u.y, y: u.x}, ctx = c.ctx;
      if (!comp.set){ comp.x = cx + 130; comp.y = cy - 90; comp.set = true; }
      /* lignes de champ : r = R sin²φ */
      if (lines.value){
        var Rs = [55, 85, 125, 180, 260], sides = [1, -1];
        Rs.forEach(function(R){ sides.forEach(function(sd){
          ctx.beginPath(); ctx.strokeStyle = "rgba(30,63,143,.55)"; ctx.lineWidth = 1.6; var st = false;
          for (var f = 0.04; f < Math.PI - 0.04; f += 0.02){
            var r = R * Math.sin(f) * Math.sin(f), px = cx + r * (Math.cos(f) * u.x + sd * Math.sin(f) * n.x), py = cy + r * (Math.cos(f) * u.y + sd * Math.sin(f) * n.y);
            if (r < 30 && Math.abs(Math.cos(f)) > 0.5) { st = false; continue; }
            if (r < 12) { st = false; continue; }
            if (!st){ ctx.moveTo(px, py); st = true; } else ctx.lineTo(px, py);
          }
          ctx.stroke();
          var fm = Math.PI / 2, rm = R, ax = cx + rm * sd * n.x, ay = cy + rm * sd * n.y;
          var dir = field(ax - cx, ay - cy, u); var dl = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
          if (ax > 14 && ax < W - 14 && ay > 14 && ay < H - 14){ S.draw.arrow(c, ax - dir.x / dl * 6, ay - dir.y / dl * 6, ax + dir.x / dl * 6, ay + dir.y / dl * 6, "rgba(30,63,143,.9)", 2); }
        }); });
      }
      /* grille de boussoles */
      if (grid.value){
        for (var gx = 40; gx < W; gx += 52) for (var gy = 34; gy < H; gy += 52){
          var dx = gx - cx, dy = gy - cy;
          if (Math.abs(dx) < 70 && Math.abs(dy) < 70) continue;
          var fd = field(dx, dy, u), l = Math.sqrt(fd.x * fd.x + fd.y * fd.y);
          needle(gx, gy, fd.x / l, fd.y / l, 10, false);
        }
      }
      /* aimant */
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.atan2(u.y, u.x));
      ctx.fillStyle = P.red; ctx.fillRect(0, -16, 60, 32); ctx.fillStyle = P.acc; ctx.fillRect(-60, -16, 60, 32);
      ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.5; ctx.strokeRect(-60, -16, 120, 32);
      ctx.restore();
      S.draw.text(c, "N", cx + u.x * 36, cy + u.y * 36, {color: "#fff", size: 15});
      S.draw.text(c, "S", cx - u.x * 36, cy - u.y * 36, {color: "#fff", size: 15});
      /* boussole d'essai */
      var dxx = comp.x - cx, dyy = comp.y - cy;
      var fc = field(dxx, dyy, u), lc = Math.sqrt(fc.x * fc.x + fc.y * fc.y);
      ctx.beginPath(); ctx.arc(comp.x, comp.y, 22, 0, 7); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
      needle(comp.x, comp.y, fc.x / lc, fc.y / lc, 18, true);
      var ang2 = Math.atan2(-fc.y, fc.x) * 180 / Math.PI; if (ang2 < 0) ang2 += 360;
      var rel = 100 * (Math.sqrt(1 + 3 * Math.pow((dxx * u.x + dyy * u.y) / fc.r, 2)) / Math.pow(fc.r, 3)) / (2 / Math.pow(100, 3));
      ro.set(0, S.fmt(ang2, 0) + " °"); ro.set(1, S.fmt(fc.r, 0) + " px");
      ro.set(2, rel > 9999 ? "> 9999" : S.fmt(rel, rel < 10 ? 2 : 0));
    });
  }
});

SFA.sim({
  id: "p6-c01-fil-boussoles", ch: "c01", tag: "Fil",
  titre: "Champ d'un fil et boussoles : l'effet d'Œrsted",
  resume: "Un courant dans un fil dévie les boussoles : calcule B = 2·10⁻⁷·I/r et compare au champ terrestre.",
  but: "Le fil est vu par-dessus, perpendiculaire à la feuille. Change l'intensité, la distance et le sens du courant. Les boussoles montrent la direction du champ total (fil + Terre).",
  aRetenir: "Un fil rectiligne crée des lignes de champ circulaires autour de lui : B = μ₀·I/(2π·r) = 2·10⁻⁷·I/r (SI). Le champ double si I double, il est divisé par 2 si r double. Le sens se trouve avec la règle de la main droite : pouce dans le sens du courant, doigts qui s'enroulent dans le sens du champ.",
  piege: "Le champ du fil n'est pas dirigé vers le fil ni le long du fil : il est tangent à des cercles. Et si le champ du fil est plus faible que celui de la Terre (≈ 19 µT en horizontal chez nous), la boussole ne bascule pas : elle dévie seulement.",
  build: function(k, S){
    var c = k.canvas(350), g = k.canvas(190), P = S.draw.palette, Pm = PH6;
    var I = k.slider("Intensité I", 0, 20, 0.5, 10, "A");
    var r = k.slider("Distance r au fil (ou glisse sur le dessin)", 1, 20, 0.5, 5, "cm");
    var sens = k.seg("Sens du courant", [["out", "⊙ vers toi"], ["in", "⊗ vers la feuille"]], "out");
    var terre = k.toggle("Tenir compte du champ terrestre (≈ 19 µT vers le nord)", true);
    var ro = k.readouts(["B du fil", "Déviation de la boussole nord", "B du fil / B terrestre horizontal"]);
    var BH = 19, geo = {}, tm = 0;
    function Bw(i, rr){ return 20 * i / rr; }  /* µT, r en cm */
    var lp = k.loop(function(dt){ tm += dt; k.redraw(); }); lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "crosshair";
    c.pointer(function(t, p){ if (t === "move" || t === "up" || !geo.cx) return; var d = Math.sqrt(Math.pow(p.x - geo.cx, 2) + Math.pow(p.y - geo.cy, 2)); r.set(Math.round(Math.max(1, Math.min(20, (d - 20) / (geo.scale - 20) * 20)) * 2) / 2); k.redraw(); });
    k.draw(function(){
      c.clear(); g.clear(); Pm.bg(c, "#f8fafd", "#e9eff7");
      var ctx = c.ctx, cx = c.W / 2, cy = c.H / 2, sg = sens.value === "out" ? 1 : -1;
      var scale = Math.min(c.W, c.H) / 2 - 22, rp = r.value / 20 * (scale - 20) + 20; geo.cx = cx; geo.cy = cy; geo.scale = scale;
      var b = Bw(I.value, r.value);
      /* lignes de champ : cercles avec flèches qui tournent */
      [1, 2, 3, 4].forEach(function(j){ var rr = 20 + (scale - 20) * j / 4; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.strokeStyle = "rgba(31,75,158,.22)"; ctx.lineWidth = 1.4; ctx.stroke();
        for (var q = 0; q < 6; q++){ var an = (q / 6) * 2 * Math.PI + sg * tm * 0.5 * Math.min(2, 0.2 + I.value / 10) / Math.sqrt(j), ax_ = cx + rr * Math.cos(an), ay = cy - rr * Math.sin(an), tdx = -Math.sin(an) * sg, tdy = -Math.cos(an) * sg; S.draw.arrow(c, ax_ - tdx * 4, ay - tdy * 4, ax_ + tdx * 4, ay + tdy * 4, "rgba(31,75,158,.5)", 1.6); } });
      ctx.beginPath(); ctx.arc(cx, cy, rp, 0, 7); ctx.strokeStyle = "rgba(31,75,158,.8)"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
      /* fil */
      S.draw.glow(c, cx, cy, 34, "#e0861a", Math.min(0.5, I.value / 40));
      var fg = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, 13); fg.addColorStop(0, "#f1c58a"); fg.addColorStop(1, "#b56a14"); ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 7); ctx.fillStyle = fg; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
      if (sg > 0){ S.draw.dot(c, cx, cy, 4, P.ink); } else { S.draw.line(c, cx - 6, cy - 6, cx + 6, cy + 6, P.ink, 2.5); S.draw.line(c, cx - 6, cy + 6, cx + 6, cy - 6, P.ink, 2.5); }
      /* boussoles sur le cercle de rayon r */
      for (var j = 0; j < 8; j++){
        var th = j * Math.PI / 4 + Math.PI / 2, px = cx + rp * Math.cos(th), py = cy - rp * Math.sin(th);
        var tx = -Math.sin(th) * sg, ty = -Math.cos(th) * sg, vx = tx * b, vy = ty * b;
        if (terre.value){ vy += -BH; }
        var l = Math.sqrt(vx * vx + vy * vy); if (l < 1e-9){ vx = 0; vy = -1; l = 1; }
        ctx.save(); ctx.translate(px, py); ctx.beginPath(); ctx.arc(0, 0, 19, 0, 7); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fill(); ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.rotate(Math.atan2(vy, vx));
        ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(0, -5); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = P.acc; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(0, -5); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill(); ctx.restore();
        S.draw.dot(c, px, py, 2.2, "#fff");
      }
      /* boussole du nord : déviation */
      var dev = Math.atan(b / BH) * 180 / Math.PI;
      S.draw.label(c, "Nord ↑", cx + rp * 0 + 0, cy - rp - 30, {color: P.grey, size: 11});
      if (terre.value) S.draw.label(c, "δ = " + S.fmt(dev, 0) + " °", cx + 40, cy - rp - 2, {color: P.red, size: 11.5, align: "left"});
      S.draw.legend(c, [[P.red, "pôle Nord de l'aiguille"], [P.acc, "pôle Sud"], ["rgba(31,75,158,.6)", "lignes de champ"]], 8, 8, {});
      S.draw.label(c, "B = " + S.fmt(b, 1) + " µT à " + S.fmt(r.value, 1) + " cm", c.W - 10, c.H - 14, {color: P.acc, size: 12, align: "right"});
      ro.set(0, S.fmt(b, 1) + " µT"); ro.set(1, terre.value ? S.fmt(dev, 0) + " °" : "—"); ro.set(2, S.fmt(b / BH, 2));
      /* graphe B(r) */
      var ymax = Math.max(40, Math.ceil(20 * I.value / 1 / 10) * 10);
      var ax = S.draw.axes(g, {x0: 0, x1: 20, y0: 0, y1: ymax, xl: "r (cm)", yl: "B (µT)", l: 52, t: 22});
      S.draw.fn(g, ax, function(x){ return x < 0.2 ? NaN : Bw(I.value, x); }, P.acc);
      S.draw.line(g, ax.L, ax.Y(BH), ax.R, ax.Y(BH), P.amber, 1.5, [5, 4]);
      S.draw.label(g, "champ terrestre horizontal ≈ 19 µT", ax.R - 4, Math.max(ax.T + 12, ax.Y(BH) - 14), {size: 11.5, color: P.amber, align: "right"});
      S.draw.dot(g, ax.X(r.value), ax.Y(b), 6, P.red);
    });
    k.note("Tangente de la déviation : tan δ = B<sub>fil</sub> / B<sub>horizontal terrestre</sub> (au point situé au nord du fil).");
  }
});

SFA.sim({
  id: "p6-c01-solenoide", ch: "c01", tag: "Bobine",
  titre: "Le solénoïde : B = μ₀·N·I/L et le noyau de fer",
  resume: "Spires, courant, longueur, noyau de fer : une bobine devient un électroaimant. Fais-la tourner en 3D et relève le défi.",
  but: "Glisse sur la bobine pour la faire tourner en 3D. Règle N, I et L, puis ajoute un noyau de fer doux : les lignes de champ, le pôle Nord et le graphe B(I) se mettent à jour. Défi : atteins une valeur de B précise.",
  aRetenir: "À l'intérieur d'un long solénoïde, le champ est quasi uniforme : B = μ₀·(N/L)·I avec μ₀ = 4π·10⁻⁷ T·m/A. Un noyau de fer doux multiplie B par plusieurs centaines (jusqu'à saturation) : c'est le principe de l'électroaimant. La face qui, vue de face, est parcourue dans le sens anti-horaire est un pôle Nord.",
  piege: "B dépend du nombre de spires par mètre (N/L), pas de N seul : 200 spires étalées sur 40 cm font deux fois moins de champ que sur 20 cm. Modèle simplifié : solénoïde long, la saturation du fer est représentée par un plafond lisse vers 1,6 T.",
  build: function(k, S){
    var c = k.canvas(300), g = k.canvas(200), P = S.draw.palette, Pm = window.PH6, MU0 = 4 * Math.PI * 1e-7;
    var N = k.slider("Nombre de spires N", 50, 1000, 50, 400, "");
    var I = k.slider("Intensité I", 0, 5, 0.1, 2, "A");
    var L = k.slider("Longueur L", 10, 40, 1, 20, "cm");
    var fer = k.toggle("Noyau de fer doux (μr ≈ 300)", false);
    var sens = k.seg("Vu de la droite, le courant tourne", [["ccw", "↺ anti-horaire"], ["cw", "↻ horaire"]], "ccw");
    var st = {a: -0.55, b: 0.32}, goal = null, t = 0, spin = true;
    k.button("Défi : obtiens un champ précis", function(){ var tg = [5, 8, 12, 20, 30][Math.floor(Math.random() * 5)]; goal = tg; fer.set(false); N.set(200); I.set(1); L.set(20); }, true);
    var ro = k.readouts(["Spires par mètre", "B au centre", "B ÷ champ terrestre (≈ 0,05 mT)"]);
    var nt = k.note("Glisse sur le dessin pour tourner la bobine.");
    function B(i, n, l, iron){
      var b0 = MU0 * (n / (l / 100)) * i;
      if (!iron) return b0;
      var bs = 1.6; return bs * Math.tanh(300 * b0 / bs);
    }
    var lp = k.loop(function(dt){ t += dt; if (spin) st.a += dt * 0.05; k.redraw(); }); lp.play();
    Pm.orbit(c, st, function(){ k.redraw(); }, function(){ spin = false; });
    k.draw(function(){
      c.clear(); g.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, b = B(I.value, N.value, L.value, fer.value);
      var north = sens.value === "ccw" ? 1 : -1, Lw = 1.3 + 1.7 * (L.value - 10) / 30, Rw = 0.42, sc = Math.min(W * 0.2, H * 0.42, 110) * 1.0;
      var pr = Pm.cam(st, sc, W / 2, H * 0.5 + 6, 6), zc = pr(0, 0, 0)[2];
      var turns = Math.max(5, Math.min(26, Math.round(N.value / 40))), seg = turns * 16, back = [], front = [], i;
      function hp(s){ var x = -Lw / 2 + Lw * s, ph = s * turns * 2 * Math.PI * north * -1; return [x, Rw * Math.cos(ph), Rw * Math.sin(ph), ph]; }
      var pts = []; for (i = 0; i <= seg; i++){ var h = hp(i / seg), q = pr(h[0], h[1], h[2]); pts.push({p: q, z: q[2], x: h[0], ph: h[3]}); }
      /* axe et fils de sortie */
      var endL = pr(-Lw / 2, 0, 0), endR = pr(Lw / 2, 0, 0);
      /* noyau de fer (cylindre) */
      if (fer.value){
        var ring = function(x){ var a = []; for (var q = 0; q <= 40; q++){ var ph = q / 40 * 2 * Math.PI; a.push(pr(x, Rw * 0.78 * Math.cos(ph), Rw * 0.78 * Math.sin(ph))); } return a; };
        var r1 = ring(-Lw / 2 - 0.08), r2 = ring(Lw / 2 + 0.08);
        ctx.beginPath(); r1.forEach(function(p, q){ q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); for (i = r2.length - 1; i >= 0; i--) ctx.lineTo(r2[i][0], r2[i][1]); ctx.closePath();
        var cg = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.7); cg.addColorStop(0, "#d3d8e0"); cg.addColorStop(1, "#8f99a8"); ctx.fillStyle = cg; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
        [r1, r2].forEach(function(r){ ctx.beginPath(); r.forEach(function(p, q){ q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.strokeStyle = "rgba(19,35,58,.5)"; ctx.lineWidth = 1.2; ctx.stroke(); });
      }
      function drawHelix(isFront){
        ctx.lineCap = "round"; ctx.lineWidth = isFront ? 3.2 : 2.2;
        for (var j = 0; j < seg; j++){ var a = pts[j], b2 = pts[j + 1], zf = (a.z + b2.z) / 2 >= zc; if (zf !== isFront) continue;
          ctx.strokeStyle = isFront ? P.amber : Pm.mix("#c26a0c", "#ffffff", 0.55); ctx.beginPath(); ctx.moveTo(a.p[0], a.p[1]); ctx.lineTo(b2.p[0], b2.p[1]); ctx.stroke(); }
      }
      /* lignes de champ : boucles extérieures */
      var Bs = I.value > 0 ? 1 : 0, nx = north;
      function loop3(psi, ext){
        var arr = []; for (var q = 0; q <= 40; q++){ var th = q / 40 * Math.PI, X = nx * (Lw / 2 + 0.25) * Math.cos(th), rho = (Rw + ext) * Math.sin(th); arr.push(pr(X, rho * Math.cos(psi), rho * Math.sin(psi))); }
        return arr;
      }
      /* boucles : de N vers S à l'extérieur */
      var loops = []; [0, 1.57, 3.14, 4.71].forEach(function(ps){ [0.35, 0.75].forEach(function(ex){ loops.push(loop3(ps, ex)); }); });
      function drawLoops(isFront){
        if (!Bs) return;
        loops.forEach(function(arr){ var mid = arr[20], fr = mid[2] >= zc; if (fr !== isFront) return;
          ctx.beginPath(); arr.forEach(function(p, q){ q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.strokeStyle = isFront ? "rgba(31,75,158,.55)" : "rgba(31,75,158,.22)"; ctx.lineWidth = 1.7; ctx.stroke();
          /* flèche vers le pôle Sud (le long de la boucle : de N vers S à l'extérieur) */
          var a = arr[19], b3 = arr[22]; S.draw.arrow(c, a[0], a[1], b3[0], b3[1], isFront ? "rgba(31,75,158,.9)" : "rgba(31,75,158,.45)", 2); });
      }
      drawLoops(false); drawHelix(false);
      /* champ intérieur : flèches le long de l'axe, de S vers N */
      if (Bs){ var ww = 0.5 + Math.min(1.2, Math.log10(1 + b * 1000) * 0.55); [-0.18, 0, 0.18].forEach(function(o, j){ var a1 = pr(-nx * Lw * 0.38, o, 0), a2 = pr(nx * Lw * 0.38, o, 0); S.draw.arrow(c, a1[0], a1[1], a2[0], a2[1], "rgba(31,75,158,.95)", 1.4 + ww * 1.2); }); }
      drawHelix(true); drawLoops(true);
      /* fils vers la source */
      var wa = pr(-Lw / 2, Rw, 0), wb = pr(Lw / 2, Rw * Math.cos(turns * 2 * Math.PI * north * -1), Rw * Math.sin(turns * 2 * Math.PI * north * -1));
      /* pôles */
      var pN = pr(nx * (Lw / 2 + 0.5), 0, 0), pS = pr(-nx * (Lw / 2 + 0.5), 0, 0);
      S.draw.label(c, "N", pN[0], pN[1], {color: P.red, size: 17}); S.draw.label(c, "S", pS[0], pS[1], {color: P.acc, size: 17});
      S.draw.label(c, "L = " + S.fmt(L.value, 0) + " cm · N = " + N.value, W / 2, H - 14, {color: P.ink, size: 12});
      ro.set(0, S.fmt(N.value / (L.value / 100), 0) + " m⁻¹");
      ro.set(1, b >= 0.1 ? S.fmt(b, 2) + " T" : S.fmt(b * 1000, 2) + " mT");
      ro.set(2, S.fmt(b / 48e-6, 0));
      if (goal !== null){ var ok = Math.abs(b * 1000 - goal) <= goal * 0.05; nt.set("<b>Défi :</b> règle N, I et L pour obtenir B = " + goal + " mT (à 5 % près). " + (ok ? "Réussi : B = " + S.fmt(b * 1000, 2) + " mT, avec " + S.fmt(N.value / (L.value / 100), 0) + " spires par mètre et " + S.fmt(I.value, 1) + " A." : "Actuellement : " + S.fmt(b * 1000, 2) + " mT. Rappel : B = μ₀·(N/L)·I."), ok ? "ok" : "warn"); }
      /* graphe B(I) */
      var bmax = Math.max(0.01, B(5, N.value, L.value, fer.value) * 1.05, B(5, N.value, L.value, false) * 1.05);
      var ax = S.draw.axes(g, {x0: 0, x1: 5, y0: 0, y1: bmax * 1000, xl: "I (A)", yl: "B (mT)", l: 54, t: 22});
      S.draw.fn(g, ax, function(i2){ return B(i2, N.value, L.value, false) * 1000; }, P.acc, 2.8);
      if (fer.value) S.draw.fn(g, ax, function(i2){ return B(i2, N.value, L.value, true) * 1000; }, P.red, 2.8, [6, 4]);
      if (goal !== null && !fer.value) S.draw.line(g, ax.L, ax.Y(goal), ax.R, ax.Y(goal), P.green, 1.6, [5, 4]);
      S.draw.legend(g, fer.value ? [[P.acc, "sans noyau"], [P.red, "avec noyau de fer", true]] : [[P.acc, "sans noyau"]], g.W - 10, g.H - (fer.value ? 78 : 60), {align: "right"});
      S.draw.dot(g, ax.X(I.value), ax.Y(b * 1000), 7, fer.value ? P.red : P.acc);
    });
  }
});

SFA.sim({
  id: "p6-c01-boussole-terre", ch: "c01", tag: "Niche · Terre",
  titre: "Une boussole qui plonge : l'inclinaison du champ terrestre",
  resume: "Glisse la boussole sur la Terre, du pôle à l'équateur : le champ s'incline de 90° à 0°. Défi : retrouve une inclinaison donnée.",
  but: "Fais glisser le point rouge autour de la Terre (ou règle la latitude). La boussole d'inclinaison montre l'angle entre l'aiguille et l'horizontale. Lance le défi pour trouver la latitude qui donne une inclinaison imposée.",
  aRetenir: "La Terre agit comme un énorme aimant. Aux pôles le champ est vertical (inclinaison 90°), à l'équateur il est horizontal (0°). Dans le modèle du dipôle : tan I = 2·tan φ. Chez nous, I ≈ 66° : une boussole ordinaire ne montre que la composante horizontale.",
  piege: "Le « pôle Nord magnétique » situé près du pôle Nord géographique est, physiquement, un pôle SUD d'aimant : c'est lui qui attire le pôle Nord de l'aiguille. Modèle du dipôle centré simplifié : le champ réel est irrégulier et les pôles se déplacent.",
  build: function(k, S){
    var c = k.canvas(520), P = S.draw.palette, Pm = window.PH6;
    var lat = k.slider("Latitude magnétique φ", -90, 90, 1, 50, "°");
    var side = 1, goal = null, tried = false;
    k.button("Équateur", function(){ lat.set(0); }); k.button("Bruxelles (≈ 50°)", function(){ lat.set(50); }); k.button("Pôle Nord", function(){ lat.set(90); });
    k.button("Défi : trouve l'inclinaison…", function(){ var c0 = [20, 35, 45, 60, 72, -40, -65]; goal = c0[Math.floor(Math.random() * c0.length)]; tried = false; }, true);
    var ro = k.readouts(["Inclinaison I", "Champ total", "Composante horizontale", "Composante verticale"]);
    var nt = k.note("Valeurs avec B<sub>équateur</sub> ≈ 31 µT (ordre de grandeur réel). Inclinaison positive = l'aiguille plonge vers le sol.");
    var geo = {};
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "pointer";
    c.pointer(function(t, p){
      if (t === "move" || t === "up") return;
      var dx = p.x - geo.cx, dy = p.y - geo.cy; if (dx * dx + dy * dy < 9) return;
      side = dx < 0 ? -1 : 1; lat.set(Math.round(Math.atan2(-dy, Math.abs(dx)) * 180 / Math.PI)); tried = true; k.redraw();
    });
    function inclin(l){ return Math.atan(2 * Math.tan(l)) * 180 / Math.PI; }
    k.draw(function(){
      c.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 560;
      var Re = Math.min(W * 0.165, H * 0.2);
      var cx = W / 2, cy = H * 0.27; geo.cx = cx; geo.cy = cy;
      var l = lat.value * Math.PI / 180, absl = Math.abs(l), sd = side;
      function pt(r, la){ return [cx + sd * r * Math.cos(la), cy - r * Math.sin(la)]; }
      /* lignes de champ du dipôle (r = r0·cos²λ), des deux côtés */
      [1.5, 2.1, 2.8].forEach(function(r0){ [1, -1].forEach(function(s2){
        ctx.beginPath(); var st = false;
        for (var la = -1.52; la <= 1.52; la += 0.02){ var r = r0 * Re * Math.cos(la) * Math.cos(la); if (r < Re * 1.01) { st = false; continue; } var x = cx + s2 * r * Math.cos(la), y = cy - r * Math.sin(la); if (!st){ ctx.moveTo(x, y); st = true; } else ctx.lineTo(x, y); }
        ctx.strokeStyle = "rgba(31,75,158,.30)"; ctx.lineWidth = 1.5; ctx.stroke();
      }); });
      /* flèches de sens sur une ligne (de S vers N de l'aimant : sortent près de l'équateur, rentrent au pôle Nord géographique) */
      [1, -1].forEach(function(s2){ var r0 = 2.1, la = 0.55, r = r0 * Re * Math.cos(la) * Math.cos(la), x = cx + s2 * r * Math.cos(la), y = cy - r * Math.sin(la);
        /* tangente (vers le nord géographique en haut) : dérivée de (r cos la, r sin la) par rapport à la */
        var dr = -2 * r0 * Re * Math.cos(la) * Math.sin(la), tx = dr * Math.cos(la) - r * Math.sin(la), ty = dr * Math.sin(la) + r * Math.cos(la), tl = Math.hypot(tx, ty);
        /* sur la ligne, le champ va de l'équateur vers le pôle Nord géographique pour la branche supérieure : sens de la croissance de la ... non : à l'extérieur il va du pôle Sud géographique vers le Nord */
        var ux = s2 * tx / tl, uy = -ty / tl; S.draw.arrow(c, x - ux * 7, y - uy * 7, x + ux * 7, y + uy * 7, "rgba(31,75,158,.75)", 2); });
      /* Terre */
      var gr = ctx.createRadialGradient(cx - Re * 0.35, cy - Re * 0.4, Re * 0.1, cx, cy, Re * 1.05); gr.addColorStop(0, "#d9ecfa"); gr.addColorStop(0.6, "#8fc1e6"); gr.addColorStop(1, "#4f8fc4");
      ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 7); ctx.fillStyle = gr; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 7); ctx.clip();
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1;
      for (var q = -60; q <= 60; q += 30){ var yy = cy - Re * Math.sin(q * Math.PI / 180); ctx.beginPath(); ctx.moveTo(cx - Re, yy); ctx.lineTo(cx + Re, yy); ctx.stroke(); }
      ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 7); ctx.lineWidth = 2.2; ctx.strokeStyle = P.ink; ctx.stroke();
      /* aimant intérieur : pôle S (bleu) en haut, pôle N (rouge) en bas */
      Pm.magnet(c, cx, cy, Re * 1.25, Re * 0.34, Math.PI / 2, {letters: true});
      S.draw.text(c, "Nord géographique", cx, cy - Re - 14, {size: 12.5, color: P.ink});
      /* ligne de champ passant par le point */
      if (absl > 0.12 && absl < 1.55){
        var r0 = Re / (Math.cos(l) * Math.cos(l)); ctx.beginPath(); var s3 = false;
        for (var la2 = -absl; la2 <= absl + 1e-9; la2 += 0.01){ var rr = r0 * Math.cos(la2) * Math.cos(la2), pp2 = pt(rr, la2); if (!s3){ ctx.moveTo(pp2[0], pp2[1]); s3 = true; } else ctx.lineTo(pp2[0], pp2[1]); }
        ctx.strokeStyle = P.acc; ctx.lineWidth = 2.6; ctx.stroke();
      }
      /* point, horizontale locale et aiguille */
      var pp = pt(Re, l), er = [sd * Math.cos(l), -Math.sin(l)], eN = [-sd * Math.sin(l), -Math.cos(l)];
      var Br = -2 * Math.sin(l), Bn = Math.cos(l), vx = Br * er[0] + Bn * eN[0], vy = Br * er[1] + Bn * eN[1], vl = Math.hypot(vx, vy), ux = vx / vl, uy = vy / vl, nl = Re * 0.62;
      S.draw.line(c, pp[0] - eN[0] * nl, pp[1] - eN[1] * nl, pp[0] + eN[0] * nl, pp[1] + eN[1] * nl, P.grey, 1.5, [3, 3]);
      S.draw.line(c, pp[0] - ux * nl * 0.6, pp[1] - uy * nl * 0.6, pp[0], pp[1], P.acc, 5);
      S.draw.arrow(c, pp[0], pp[1], pp[0] + ux * nl * 0.7, pp[1] + uy * nl * 0.7, P.red, 5);
      S.draw.dot(c, pp[0], pp[1], 7, P.red);
      var incl = Math.abs(lat.value) === 90 ? (lat.value > 0 ? 90 : -90) : inclin(l);
      var bt = 31 * Math.sqrt(1 + 3 * Math.sin(l) * Math.sin(l)), bh = 31 * Math.cos(l), bv = 2 * 31 * Math.sin(l);
      S.draw.label(c, "φ = " + S.fmt(lat.value, 0) + " °", pp[0] + sd * (Re * 0.35 + 36), pp[1] + (pp[1] < cy ? -18 : 18), {color: P.red, size: 12.5});
      /* boussole d'inclinaison (zoom) */
      var R2 = Math.min(74, W * 0.19), bx = W / 2, by = H - R2 - 48;
      S.draw.panel(c, bx - R2 - 14, by - R2 - 30, 2 * R2 + 28, 2 * R2 + 56, {title: "Inclinaison (nord à droite)"});
      ctx.beginPath(); ctx.arc(bx, by, R2, 0, 7); var g2 = ctx.createRadialGradient(bx, by - R2 * 0.3, R2 * 0.1, bx, by, R2); g2.addColorStop(0, "#fff"); g2.addColorStop(1, "#e3ebf5"); ctx.fillStyle = g2; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.ink; ctx.stroke();
      S.draw.line(c, bx - R2 * 0.92, by, bx + R2 * 0.92, by, P.grey, 1.5, [4, 4]);
      /* aiguille : angle I sous l'horizontale (I > 0 : plonge) */
      var ia = incl * Math.PI / 180, nx = Math.cos(ia), ny = Math.sin(ia);
      S.draw.line(c, bx - nx * R2 * 0.72, by - ny * R2 * 0.72, bx, by, P.acc, 6);
      S.draw.arrow(c, bx, by, bx + nx * R2 * 0.8, by + ny * R2 * 0.8, P.red, 6);
      ctx.beginPath(); ctx.arc(bx, by, R2 * 0.38, 0, ia, ia < 0); ctx.strokeStyle = P.amber; ctx.lineWidth = 3; ctx.stroke();
      S.draw.dot(c, bx, by, 4, "#fff");
      S.draw.label(c, "I = " + S.fmt(incl, 0) + " °", bx, by + R2 + 18, {color: P.amber, size: 13});
      ro.set(0, S.fmt(incl, 1) + " °"); ro.set(1, S.fmt(bt, 1) + " µT"); ro.set(2, S.fmt(bh, 1) + " µT"); ro.set(3, S.fmt(bv, 1) + " µT");
      /* défi */
      if (goal !== null){
        var ok = Math.abs(incl - goal) <= 1.5;
        nt.set("<b>Défi :</b> place la boussole là où l'inclinaison vaut <b>" + S.fmt(goal, 0) + " °</b> (à 1,5° près)." + (tried ? (ok ? " Bravo : φ = " + S.fmt(lat.value, 0) + " ° convient." : " Pour l'instant : I = " + S.fmt(incl, 1) + " °. Rappel : tan I = 2·tan φ.") : ""), ok && tried ? "ok" : "warn");
      }
      Pm.hint(c, "Glisse sur le dessin pour déplacer la boussole");
    });
  }
});

