/* Aides de dessin partagées par les simulations de physique 5e (scènes, objets ombrés, poignées à glisser) */
window.P5x = (function(){
  var S = window.SFA, TAU = 2 * Math.PI;
  function hex(c){ var h = String(c).replace("#", ""); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  /* éclaircit (f>0) ou assombrit (f<0) une couleur #rrggbb */
  function shade(c, f){ var r = hex(c); return "rgb(" + r.map(function(v){ return Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)); }).join(",") + ")"; }
  function lin(ctx, x0, y0, x1, y1, st){ var g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(s){ g.addColorStop(s[0], s[1]); }); return g; }
  function rr(ctx, x, y, w, h, r){ S.draw.rrect({ctx: ctx}, x, y, w, h, r); }
  var P = {
    shade: shade, lin: lin, rr: rr,
    /* fond de scène en dégradé */
    sky: function(c, top, bot){ var ctx = c.ctx; ctx.fillStyle = lin(ctx, 0, 0, 0, c.H, [[0, top || "#eaf3fc"], [1, bot || "#f8fbff"]]); ctx.fillRect(0, 0, c.W, c.H); },
    /* sol : bande de y à la base ; ticks = décalage des repères (px), pas = écart */
    ground: function(c, y, o){ o = o || {}; var ctx = c.ctx, col = o.col || "#cfd8e3";
      ctx.fillStyle = lin(ctx, 0, y, 0, c.H, [[0, col], [1, shade(col, -0.12)]]); ctx.fillRect(0, y, c.W, c.H - y);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(0, y, c.W, 2);
      if (o.pas){ var off = ((o.off || 0) % o.pas + o.pas) % o.pas; ctx.fillStyle = "rgba(15,27,45,.28)";
        for (var x = -off; x < c.W + o.pas; x += o.pas) ctx.fillRect(Math.round(x), y + 6, 2, 7); } },
    /* bloc ombré : cx = centre, by = bas */
    box: function(c, cx, by, w, h, col, label, o){ o = o || {}; var ctx = c.ctx; ctx.save();
      ctx.shadowColor = "rgba(15,27,45,.22)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      rr(ctx, cx - w / 2, by - h, w, h, o.r == null ? 5 : o.r); ctx.fillStyle = lin(ctx, 0, by - h, 0, by, [[0, shade(col, 0.28)], [1, shade(col, -0.08)]]); ctx.fill();
      ctx.shadowColor = "transparent"; ctx.lineWidth = 1.5; ctx.strokeStyle = shade(col, -0.35); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.28)"; rr(ctx, cx - w / 2 + 3, by - h + 3, w - 6, Math.min(8, h / 4), 3); ctx.fill(); ctx.restore();
      if (label) S.draw.text(c, label, cx, by - h / 2 + 2, {size: o.size || 12.5, color: o.tc || "#fff"}); },
    /* bloc incliné (rotation ang autour de son centre) */
    tilted: function(c, cx, cy, w, h, ang, col, label, o){ var ctx = c.ctx; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
      ctx.shadowColor = "rgba(15,27,45,.22)"; ctx.shadowBlur = 7; ctx.shadowOffsetY = 3;
      rr(ctx, -w / 2, -h / 2, w, h, 4); ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, shade(col, 0.3)], [1, shade(col, -0.1)]]); ctx.fill(); ctx.shadowColor = "transparent";
      ctx.lineWidth = 1.5; ctx.strokeStyle = shade(col, -0.35); ctx.stroke(); ctx.restore();
      if (label) S.draw.text(c, label, cx, cy, {size: (o && o.size) || 11.5, color: "#fff"}); },
    /* polygone dégradé (pente, colline) */
    slope: function(c, pts, c0, c1, y0, y1){ var ctx = c.ctx; ctx.beginPath(); pts.forEach(function(p, i){ if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
      ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, c0 || "#eef2f7"], [1, c1 || "#cdd6e2"]]); ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.stroke(); },
    /* chariot à roues */
    cart: function(c, cx, by, w, h, col, label, o){ var ctx = c.ctx, rw = Math.max(4, h * 0.15);
      P.box(c, cx, by - rw, w, h - rw, col, label, o);
      [-0.3, 0.3].forEach(function(f){ ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(cx + f * w, by - rw, rw, 0, TAU); ctx.fill(); ctx.fillStyle = "#9aa6b6"; ctx.beginPath(); ctx.arc(cx + f * w, by - rw, rw * 0.4, 0, TAU); ctx.fill(); }); },
    /* sphère ombrée */
    ball: function(c, x, y, r, col){ var ctx = c.ctx; ctx.save();
      ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = r * 0.6; ctx.shadowOffsetY = r * 0.25;
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, shade(col, 0.55)); g.addColorStop(0.55, col); g.addColorStop(1, shade(col, -0.4));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); },
    /* astre avec reflet (sans ombre portée) */
    planet: function(c, x, y, r, col, atmo){ var ctx = c.ctx; ctx.save();
      if (atmo){ var g0 = ctx.createRadialGradient(x, y, r * 0.95, x, y, r * 1.18); g0.addColorStop(0, S.draw.tint(atmo, 0.5)); g0.addColorStop(1, S.draw.tint(atmo, 0)); ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(x, y, r * 1.18, 0, TAU); ctx.fill(); }
      var g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r * 1.05); g.addColorStop(0, shade(col, 0.45)); g.addColorStop(0.6, col); g.addColorStop(1, shade(col, -0.5));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); },
    /* bonhomme simple : cx, by (pieds), h */
    person: function(c, cx, by, h, col, o){ o = o || {}; var ctx = c.ctx; ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = col; ctx.fillStyle = col;
      var hd = h * 0.13, ty = by - h + hd * 2.2, hy = by - h * 0.42, lean = (o.lean || 0) * h;
      ctx.lineWidth = Math.max(4, h * 0.11); ctx.beginPath(); ctx.moveTo(cx + lean, ty); ctx.lineTo(cx, hy); ctx.stroke();
      ctx.lineWidth = Math.max(3, h * 0.08); ctx.beginPath(); ctx.moveTo(cx, hy); ctx.lineTo(cx - h * 0.12, by); ctx.moveTo(cx, hy); ctx.lineTo(cx + h * 0.12, by); ctx.stroke();
      var ax = o.arm == null ? 0.18 : o.arm; ctx.beginPath(); ctx.moveTo(cx + lean * 0.8, ty + h * 0.08); ctx.lineTo(cx + lean * 0.8 + h * ax * (o.dir || 1), ty + h * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + lean * 1.2, by - h + hd, hd, 0, TAU); ctx.fill(); ctx.restore();
      if (o.label) S.draw.text(c, o.label, cx + lean * 0.5, ty + h * 0.16, {size: Math.max(10, h * 0.16), color: "#fff"}); },
    /* ressort / câble en zigzag entre deux points */
    coil: function(c, x1, y1, x2, y2, n, amp, col, w){ var ctx = c.ctx, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      ctx.save(); ctx.strokeStyle = col || "#6b7685"; ctx.lineWidth = w || 2; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x1, y1);
      for (var i = 1; i < n * 2; i++){ var t = i / (n * 2), s = (i % 2 ? 1 : -1) * amp; ctx.lineTo(x1 + dx * t + nx * s, y1 + dy * t + ny * s); }
      ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); },
    /* poignée à saisir (cercle blanc cerclé de couleur, avec halo) */
    handle: function(c, x, y, col, r, on){ var ctx = c.ctx; r = r || 9; ctx.save();
      ctx.fillStyle = S.draw.tint(col, on ? 0.3 : 0.16); ctx.beginPath(); ctx.arc(x, y, r + 6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, TAU); ctx.fill(); ctx.restore(); },
    /* manipulation directe : handles() → [{x, y, set(px, py), r}] ; renvoie l'indice saisi via st.i */
    drag: function(c, k, handles, onEnd){ var st = {i: -1, hover: -1};
      c.pointer(function(type, p){
        var hs = handles(); if (!hs) return;
        if (type === "down" || type === "move" || type === "drag"){
          if (type === "down"){ var best = -1, bd = 1e9; hs.forEach(function(h, i){ var d = Math.hypot(p.x - h.x, p.y - h.y); if (d < (h.r || 26) && d < bd){ bd = d; best = i; } }); st.i = best; }
          if (type !== "down" && st.i < 0){ var hv = -1; hs.forEach(function(h, i){ if (Math.hypot(p.x - h.x, p.y - h.y) < (h.r || 26)) hv = i; }); if (hv !== st.hover){ st.hover = hv; c.cv.style.cursor = hv >= 0 ? "grab" : ""; } }
          if (st.i >= 0 && type !== "move"){ hs[st.i].set(p.x, p.y); c.cv.style.cursor = "grabbing"; k.redraw(); }
        } else if (type === "up"){ if (st.i >= 0 && onEnd) onEnd(st.i); st.i = -1; c.cv.style.cursor = st.hover >= 0 ? "grab" : ""; }
      }); c.cv.style.touchAction = "none"; return st; },
    /* petit encart d'instruction en haut à gauche */
    hint: function(c, s, o){ o = o || {}; S.draw.text(c, s, o.x == null ? 12 : o.x, o.y == null ? 14 : o.y, {align: o.align || "left", size: o.size || 12, color: o.color || "#6b7685", weight: 700}); },
    /* bandeau de résultat centré (succès / alerte) */
    banner: function(c, s, col, y, o){ S.draw.label(c, s, c.W / 2, y == null ? 22 : y, Object.assign({color: col, size: 13}, o || {})); },
    /* texte en pastille (taille lisible sur téléphone) */
    tag: function(c, s, x, y, col, o){ S.draw.label(c, s, x, y, Object.assign({color: col, size: 12}, o || {})); },
    /* palette de la matière (physique) */
    ice: "#e3f0fa", wood: "#c9a77c"
  };
  /* fond d'espace étoilé (positions pseudo-aléatoires fixes) */
  P.space = function(c, a){
    var ctx = c.ctx; ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, c.H, [[0, "#0b1530"], [1, "#16254d"]]); ctx.fillRect(0, 0, c.W, c.H);
    var s = 7; for (var i = 0; i < 70; i++){ s = (s * 9301 + 49297) % 233280; var x = s / 233280 * c.W; s = (s * 9301 + 49297) % 233280; var y = s / 233280 * c.H; s = (s * 9301 + 49297) % 233280;
      ctx.fillStyle = "rgba(255,255,255," + (0.25 + 0.5 * s / 233280).toFixed(2) + ")"; ctx.fillRect(x, y, 1.6, 1.6); }
  };
  return P;
})();

/* Chapitre 1 · Vecteurs, composition et décomposition des forces */
SFA.sim({
  id: "p5-c01-somme", ch: "c01", tag: "Vecteurs",
  titre: "Somme de deux forces : la règle du parallélogramme",
  resume: "Deux personnes tirent une caisse avec des cordes : la caisse part selon la résultante, pas selon la somme des valeurs.",
  but: "Vue de dessus : deux personnes tirent une caisse posée sur un sol glissant. Fais glisser les mains (pointes de F₁ et F₂), lis les dynamomètres, puis lâche la caisse : elle part dans la direction de R = F₁ + F₂. Défi : avec des dynamomètres bloqués à 3 N et 4 N, obtiens la résultante demandée.",
  aRetenir: "On additionne les forces comme des vecteurs : règle du parallélogramme (ou bout à bout), ou composante par composante Rx = F₁x + F₂x et Ry = F₁y + F₂y. Avec deux forces de valeurs F₁ et F₂ faisant un angle θ : |F₁ − F₂| ≤ R ≤ F₁ + F₂.",
  piege: "Additionner les valeurs (3 N + 4 N = 7 N) n'est vrai que si les deux cordes sont parallèles et tirent dans le même sens. Si elles sont perpendiculaires, R = 5 N (Pythagore) ; si elles sont opposées, R = 1 N.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8}), g = k.canvas(170);
    var mode = k.seg("Mode", [["libre", "Libre"], ["defi", "Défi 3 N + 4 N"]], "libre", function(v){ if (v === "defi"){ n1.set(3); n2.set(4); } lach = null; });
    var n1 = k.slider("Valeur de F₁ (dynamomètre bleu)", 0.5, 5, 0.1, 3, "N");
    var d1 = k.slider("Direction de F₁", -180, 180, 1, 20, "°");
    var n2 = k.slider("Valeur de F₂ (dynamomètre rouge)", 0.5, 5, 0.1, 4, "N");
    var d2 = k.slider("Direction de F₂", -180, 180, 1, 110, "°");
    var tg = k.toggle("Construction : parallélogramme et composantes", true);
    var ro = k.readouts(["F₁ + F₂ (valeurs)", "‖R‖ (résultante)", "Angle θ entre les cordes", "Rx ; Ry", "Direction de R"]);
    var nt = k.note("", "");
    var DEF = [[7, "R = 7 N"], [5, "R = 5 N"], [1, "R = 1 N"], [6, "R = 6 N"], [2.5, "R = 2,5 N"]], di = 0, okCount = 0, lastOk = false;
    var lach = null;                    /* animation : la caisse lâchée part selon R */
    var lp = k.loop(function(dt){ if (!lach) { lp.pause(); return; } lach.t += dt; if (lach.t > 1.8){ lach = null; lp.pause(); } k.redraw(); });
    k.button("Lâcher la caisse", function(){ lach = {t: 0}; lp.play(); }, true);
    k.button("Défi suivant", function(){ mode.set("defi"); n1.set(3); n2.set(4); di = (di + 1) % DEF.length; lastOk = false; });
    var G = {cx: 0, cy: 0, u: 1}, gx = null;
    function tip(n, d){ var a = d.value * Math.PI / 180; return [G.cx + n.value * G.u * Math.cos(a), G.cy - n.value * G.u * Math.sin(a)]; }
    function setFrom(n, d, px, py){
      var dx = (px - G.cx) / G.u, dy = -(py - G.cy) / G.u, a = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
      d.set(a); if (mode.value !== "defi") n.set(Math.round(P5.clamp(Math.hypot(dx, dy), 0.5, 5) * 10) / 10);
    }
    P5x.drag(c, k, function(){ var t1 = tip(n1, d1), t2 = tip(n2, d2);
      return [{x: t1[0], y: t1[1], r: 30, set: function(px, py){ setFrom(n1, d1, px, py); lach = null; }}, {x: t2[0], y: t2[1], r: 30, set: function(px, py){ setFrom(n2, d2, px, py); lach = null; }}]; });
    /* sur le graphe : glisser le point change l'angle entre les cordes (F₂ tourne autour de F₁) */
    P5x.drag(g, k, function(){ if (!gx) return null; var th = theta(); return [{x: gx.X(th), y: gx.Y(Rn(th)), r: 30, set: function(px){ var t = Math.round(P5.clamp(gx.ix(px), 0, 180)); var s = ((d2.value - d1.value) % 360 + 540) % 360 - 180 >= 0 ? 1 : -1; var a = d1.value + s * t; a = ((a + 180) % 360 + 360) % 360 - 180; d2.set(a); lach = null; }}]; });
    function theta(){ var t = Math.abs(((d2.value - d1.value) % 360 + 540) % 360 - 180); return t; }
    function Rn(th){ var a = n1.value, b = n2.value; return Math.sqrt(Math.max(0, a * a + b * b + 2 * a * b * Math.cos(th * Math.PI / 180))); }
    /* personne vue de dessus, tournée vers la caisse */
    function person(x, y, ang, col){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(-ang);
      ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.ellipse(3, 3, 13, 20, 0, 0, 7); ctx.fill();
      ctx.fillStyle = P5x.shade(col, -0.1); ctx.beginPath(); ctx.ellipse(0, 0, 11, 19, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = P5x.shade(col, -0.2); ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(2, -13); ctx.lineTo(19, -3); ctx.moveTo(2, 13); ctx.lineTo(19, 3); ctx.stroke();
      ctx.fillStyle = "#f0c8a0"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fill(); ctx.fillStyle = "#5b3b25"; ctx.beginPath(); ctx.arc(-1, 0, 7.5, 1.4, 4.9); ctx.fill();
      ctx.restore();
    }
    function dyna(x, y, ang, col, val){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(-ang);
      ctx.fillStyle = P5x.lin(ctx, 0, -6, 0, 6, [[0, "#fafbfd"], [1, "#c9d1dc"]]); P5x.rr(ctx, -16, -6, 32, 12, 4); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = col; ctx.fillRect(-12, -2, 24 * Math.min(1, val / 5), 4); ctx.restore();
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, defi = mode.value === "defi";
      if (defi && (n1.value !== 3 || n2.value !== 4)){ n1.set(3); n2.set(4); }
      G.cx = W / 2; G.cy = H / 2 + 6; G.u = (Math.min(W, H) / 2 - 34) / 7;
      var a1 = d1.value * Math.PI / 180, a2 = d2.value * Math.PI / 180;
      var f1 = [n1.value * Math.cos(a1), n1.value * Math.sin(a1)], f2 = [n2.value * Math.cos(a2), n2.value * Math.sin(a2)], R = [f1[0] + f2[0], f1[1] + f2[1]], nr = Math.hypot(R[0], R[1]);
      /* sol (carrelage 1 N) */
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, H, [[0, "#f2f5f9"], [1, "#e4eaf2"]]); ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(120,140,170,.18)"; ctx.lineWidth = 1;
      for (var gxx = G.cx % G.u; gxx < W; gxx += G.u){ ctx.beginPath(); ctx.moveTo(gxx, 0); ctx.lineTo(gxx, H); ctx.stroke(); }
      for (var gyy = G.cy % G.u; gyy < H; gyy += G.u){ ctx.beginPath(); ctx.moveTo(0, gyy); ctx.lineTo(W, gyy); ctx.stroke(); }
      /* déplacement de la caisse lâchée (sol sans frottement, a = R/m) */
      var off = [0, 0];
      if (lach && nr > 0){ var s = 0.5 * (nr / 2) * lach.t * lach.t * G.u * 0.4; off = [R[0] / nr * s, -R[1] / nr * s];
        for (var gh = 1; gh <= 4; gh++){ var tg2 = lach.t * gh / 5, s2 = 0.5 * (nr / 2) * tg2 * tg2 * G.u * 0.4; ctx.globalAlpha = 0.12 + 0.05 * gh; P5x.box(c, G.cx + R[0] / nr * s2, G.cy - R[1] / nr * s2 + 17, 34, 34, "#b98a52", "", {r: 3}); }
        ctx.globalAlpha = 1; }
      var bx = G.cx + off[0], by = G.cy + off[1];
      var t1 = [bx + f1[0] * G.u, by - f1[1] * G.u], t2 = [bx + f2[0] * G.u, by - f2[1] * G.u];
      /* cordes jusqu'aux personnes (au-delà de la pointe) */
      [[a1, n1.value, pal.acc], [a2, n2.value, pal.red]].forEach(function(q){
        var L = q[1] * G.u + 30, ex = bx + L * Math.cos(q[0]), ey = by - L * Math.sin(q[0]);
        S.draw.line(c, bx, by, ex, ey, "#a07a4a", 3); S.draw.line(c, bx, by, ex, ey, "rgba(255,255,255,.35)", 1, [3, 4]);
        dyna(bx + (q[1] * G.u * 0.55) * Math.cos(q[0]), by - (q[1] * G.u * 0.55) * Math.sin(q[0]), q[0], q[2], q[1]);
        person(bx + (L + 14) * Math.cos(q[0]), by - (L + 14) * Math.sin(q[0]), q[0] + Math.PI, q[2]);
      });
      /* caisse */
      P5x.box(c, bx, by + 17, 34, 34, "#b98a52", "", {r: 3});
      ctx.strokeStyle = "rgba(90,60,30,.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bx - 14, by - 14); ctx.lineTo(bx + 14, by + 14); ctx.moveTo(bx + 14, by - 14); ctx.lineTo(bx - 14, by + 14); ctx.stroke();
      /* construction */
      var rt = [bx + R[0] * G.u, by - R[1] * G.u];
      if (tg.value){
        S.draw.line(c, t1[0], t1[1], rt[0], rt[1], "#8fa6d4", 1.6, [6, 4]); S.draw.line(c, t2[0], t2[1], rt[0], rt[1], "#e0a197", 1.6, [6, 4]);
        S.draw.line(c, bx, by, rt[0], by, pal.green, 1.6, [3, 3]); S.draw.line(c, rt[0], by, rt[0], rt[1], pal.green, 1.6, [3, 3]);
      }
      P5.vec(c, bx, by, t1[0], t1[1], pal.acc, "", {w: 3});
      P5.vec(c, bx, by, t2[0], t2[1], pal.red, "", {w: 3});
      if (nr > 0.05) P5.vec(c, bx, by, rt[0], rt[1], pal.green, "", {w: 4.2});
      /* étiquettes posées à côté des flèches (pas sur les personnes) */
      [[t1, "F₁", pal.acc], [t2, "F₂", pal.red], [rt, "R", pal.green]].forEach(function(z){ var dx = z[0][0] - bx, dy = z[0][1] - by, L = Math.hypot(dx, dy); if (L < 8 || (z[1] === "R" && nr <= 0.05)) return;
        P5x.tag(c, z[1], bx + dx * 0.62 - dy / L * 15, by + dy * 0.62 + dx / L * 15, z[2], {size: 12.5}); });
      /* cible du défi : cercle de rayon R visé */
      if (defi){ ctx.save(); ctx.strokeStyle = S.draw.tint(pal.amber, 0.7); ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(G.cx, G.cy, DEF[di][0] * G.u, 0, 7); ctx.stroke(); ctx.restore();
        P5x.tag(c, "cercle visé : " + DEF[di][1], W / 2, H - 40, pal.amber, {size: 11.5}); }
      if (!lach){ P5x.handle(c, t1[0], t1[1], pal.acc, 7); P5x.handle(c, t2[0], t2[1], pal.red, 7); }
      P5x.tag(c, S.fmt(n1.value, 1) + " N", 10, H - 16, pal.acc, {align: "left"}); P5x.tag(c, S.fmt(n2.value, 1) + " N", 66, H - 16, pal.red, {align: "left"});
      S.draw.text(c, "1 carreau = 1 N", W - 10, H - 14, {align: "right", size: 11.5, color: "#5f6b7a"});
      P5x.hint(c, defi ? "Dynamomètres bloqués : tourne les cordes" : "Glisse les mains (pointes des flèches)", {size: 11.5});
      if (lach && nr > 0.05) P5x.banner(c, "La caisse part selon R", pal.green, 36);
      /* graphe R(θ) pour les valeurs actuelles */
      g.clear();
      var th = theta(), Rmax = n1.value + n2.value;
      gx = S.draw.axes(g, {x0: 0, x1: 180, y0: 0, y1: 10.5, xl: "θ (°)", yl: "R (N)", stepX: 30, stepY: 2, l: 40});
      S.draw.line(g, gx.X(0), gx.Y(Rmax), gx.X(180), gx.Y(Rmax), pal.grey, 1.2, [5, 4]);
      S.draw.line(g, gx.X(0), gx.Y(Math.abs(n1.value - n2.value)), gx.X(180), gx.Y(Math.abs(n1.value - n2.value)), pal.grey, 1.2, [5, 4]);
      P5x.tag(g, "F₁ + F₂", gx.X(178), gx.Y(Rmax) - 11, "#4b5868", {align: "right", size: 11});
      P5x.tag(g, "|F₁ − F₂|", gx.X(178), gx.Y(Math.abs(n1.value - n2.value)) - 11, "#4b5868", {align: "right", size: 11});
      if (defi) S.draw.line(g, gx.X(0), gx.Y(DEF[di][0]), gx.X(180), gx.Y(DEF[di][0]), pal.amber, 2, [2, 3]);
      S.draw.fn(g, gx, Rn, pal.green, 3);
      P5x.handle(g, gx.X(th), gx.Y(Rn(th)), pal.green, 7);
      P5x.hint(g, "Glisse le point : change l'angle θ", {x: g.W - 10, y: 12, align: "right", size: 11});
      /* lectures */
      ro.set(0, S.fmt(n1.value + n2.value, 1) + " N"); ro.set(1, S.fmt(nr, 2) + " N"); ro.set(2, S.fmt(th, 0) + " °");
      ro.set(3, S.fmt(R[0], 2) + " ; " + S.fmt(R[1], 2) + " N"); ro.set(4, nr < 0.01 ? "—" : S.fmt(Math.atan2(R[1], R[0]) * 180 / Math.PI, 0) + " °");
      if (defi){
        var ok = Math.abs(nr - DEF[di][0]) <= 0.06;
        if (ok && !lastOk) okCount++; lastOk = ok;
        var th0 = Math.acos(P5.clamp((DEF[di][0] * DEF[di][0] - 25) / 24, -1, 1)) * 180 / Math.PI;
        nt.set("<b>Défi " + (di + 1) + "/5 · " + DEF[di][1] + "</b> avec 3 N et 4 N. " + (ok ? "Réussi : θ = " + S.fmt(th, 0) + " ° (calcul : cos θ = (R² − 3² − 4²)/(2·3·4), θ = " + S.fmt(th0, 0) + " °). " + okCount + " défi(s) réussi(s)." : "Pour l'instant R = " + S.fmt(nr, 2) + " N : tourne une corde."), ok ? "ok" : "");
      } else if (nr < 0.05) nt.set("R = 0 : les deux tractions se compensent, la caisse lâchée reste immobile.", "ok");
      else if (th < 0.5) nt.set("Cordes parallèles et de même sens : ici seulement, R = F₁ + F₂ = " + S.fmt(nr, 1) + " N.", "ok");
      else if (Math.abs(th - 90) < 0.5) nt.set("Cordes perpendiculaires : R = √(F₁² + F₂²) = " + S.fmt(nr, 2) + " N (Pythagore).", "ok");
      else nt.set("Les deux personnes tirent avec " + S.fmt(n1.value + n2.value, 1) + " N au total, mais la caisse ne reçoit que R = " + S.fmt(nr, 2) + " N : les composantes latérales se compensent en partie.", "");
    });
  }
});

SFA.sim({
  id: "p5-c01-incline", ch: "c01", tag: "Décomposition",
  titre: "Le poids sur un plan incliné",
  resume: "Angle du plan → composantes parallèle et perpendiculaire du poids.",
  but: "Fais varier l'angle α et la masse. Observe comment le poids P se partage en une composante qui fait glisser (P∥) et une qui appuie sur le plan (P⊥). Relève le défi avec le bouton.",
  aRetenir: "Sur un plan incliné d'angle α : P∥ = P·sin α (le long de la pente) et P⊥ = P·cos α (perpendiculaire). Le poids lui-même ne change pas : P = m·g.",
  piege: "Ne confonds pas sin et cos : l'angle α du plan est le même que l'angle entre le poids et la perpendiculaire au plan, donc P⊥ = P·cos α. À 0° tout le poids appuie, à 90° plus rien n'appuie.",
  build: function(k, S){
    var c = k.canvas(340);
    var a = k.slider("Angle α du plan", 0, 90, 1, 30, "°");
    var m = k.slider("Masse m", 1, 10, 0.5, 5, "kg");
    var ro = k.readouts(["Poids P", "Composante parallèle", "Composante perpendiculaire", "Contrôle : √(somme des carrés)"]);
    var dfi = 0, defis = [["la composante P∥ vaut la moitié du poids", "par", 0.5], ["la composante P⊥ vaut la moitié du poids", "perp", 0.5], ["P∥ et P⊥ sont égales", "egal", 1]];
    var tgt = k.note("", "");
    k.button("Nouveau défi", function(){ dfi = (dfi + 1) % defis.length; });
    var G = {x: 0, y: 0, bx: 0, by: 0};
    /* manipulation directe : on tire le sommet du plan pour changer l'angle */
    P5x.drag(c, k, function(){ return [{x: G.x, y: G.y, r: 34, set: function(px, py){ a.set(Math.round(P5.clamp(Math.atan2(G.by - py, px - G.bx) * 180 / Math.PI, 0, 90))); }}]; });
    k.draw(function(){
      P5x.sky(c, "#f5f9fd", "#e8eff7");
      var al = a.value * Math.PI / 180, P = m.value * P5.g, pal = S.draw.palette, ctx = c.ctx;
      var bx = 30, by = c.H - 40, L = Math.min(c.W - 70, 420), Hh = Math.min(L * Math.tan(al), c.H - 100);
      var Lx = Hh === L * Math.tan(al) ? L : Hh / Math.tan(al);
      if (a.value >= 89.5){ Lx = 0.001; Hh = c.H - 100; }
      /* triangle */
      G.bx = bx; G.by = by; G.x = bx + Lx; G.y = by - Hh;
      P5x.slope(c, [[bx, by], [bx + Lx, by], [bx + Lx, by - Hh]], "#e9eef5", "#c4cedc", by - Hh, by);
      ctx.strokeStyle = pal.ink; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(bx, by, 34, -al, 0); ctx.stroke();
      S.draw.text(c, "α = " + S.fmt(a.value, 0) + " °", bx + 66, by - 11, {color: pal.ink, size: 12.5});
      P5x.handle(c, G.x, G.y, pal.acc, 8);
      /* bloc au milieu de la pente */
      var s = Math.hypot(Lx, Hh), ux = Lx / s, uy = -Hh / s;    /* vecteur unitaire le long de la pente (monte) */
      var px0 = bx + Lx * 0.55, py0 = by - Hh * 0.55; if (s < 1) { px0 = bx; py0 = by; }
      var nx = uy, ny = -ux;                                     /* normale sortante (vers le haut-gauche) */
      if (a.value >= 89.5){ ux = 0; uy = -1; nx = -1; ny = 0; px0 = bx; py0 = by - Hh * 0.55; }
      if (a.value === 0){ ux = 1; uy = 0; nx = 0; ny = -1; px0 = bx + L * 0.5; py0 = by; }
      var cx = px0 + nx * 15, cy = py0 + ny * 15;                /* centre du bloc */
      P5x.tilted(c, cx, cy, 40, 32, Math.atan2(uy, ux) * (a.value >= 89.5 ? 0 : 1), "#3f6fc6", "", {});
      var sc = 95 / P;                                           /* px par newton : P garde une longueur fixe */
      var Lp = P * sc, Lpar = P * Math.sin(al) * sc, Lper = P * Math.cos(al) * sc;
      P5.vec(c, cx, cy, cx, cy + Lp, pal.ink, "P");
      /* P// vers le bas de la pente (-u), P⊥ vers l'intérieur (-n) */
      var ex = cx - ux * Lpar, ey = cy - uy * Lpar;
      P5.vec(c, cx, cy, ex, ey, pal.red, "P∥");
      P5.vec(c, cx, cy, cx - nx * Lper, cy - ny * Lper, pal.green, "P⊥");
      S.draw.line(c, ex, ey, cx, cy + Lp, "#aab4c3", 1.5, [4, 4]);
      S.draw.line(c, cx - nx * Lper, cy - ny * Lper, cx, cy + Lp, "#aab4c3", 1.5, [4, 4]);
      ro.set(0, S.fmt(P, 1) + " N"); ro.set(1, S.fmt(P * Math.sin(al), 1) + " N"); ro.set(2, S.fmt(P * Math.cos(al), 1) + " N");
      ro.set(3, S.fmt(Math.hypot(P * Math.sin(al), P * Math.cos(al)), 1) + " N");
      var d = defis[dfi], par = Math.sin(al), per = Math.cos(al), ok = false;
      if (d[1] === "par") ok = Math.abs(par - 0.5) < 0.01; else if (d[1] === "perp") ok = Math.abs(per - 0.5) < 0.01; else ok = Math.abs(par - per) < 0.015;
      tgt.set("<b>Défi " + (dfi + 1) + "/3.</b> Règle l'angle pour que " + d[0] + ". " + (ok ? "Réussi : α = " + S.fmt(a.value, 0) + " °. Retrouve-le par le calcul avec sin α ou cos α." : "Pas encore."), ok ? "ok" : "");
      if (a.value === 0) S.draw.text(c, "Plan horizontal : P∥ = 0, P⊥ = P", c.W - 14, 22, {align: "right", color: pal.ink});
      if (a.value >= 89.5) S.draw.text(c, "Plan vertical : P⊥ = 0, le bloc ne s'appuie plus", c.W - 14, 22, {align: "right", color: pal.red});
    });
  }
});

SFA.sim({
  id: "p5-c01-remorqueurs", ch: "c01", tag: "Application",
  titre: "Deux remorqueurs tirent un cargo",
  resume: "Angle des câbles → force résultante et direction du cargo.",
  but: "Règle les forces et les angles des deux remorqueurs. Défi : fais avancer le cargo tout droit (composante latérale nulle) avec une résultante d'au moins 120 kN.",
  aRetenir: "Seule la composante des forces dans le sens du déplacement fait avancer le cargo ; les composantes latérales se compensent, ou le font dévier. Plus l'angle entre les câbles est grand, plus on gaspille de force.",
  piege: "Deux remorqueurs de 100 kN ne donnent pas 200 kN de traction vers l'avant, sauf si les câbles sont parallèles : R = 2·F·cos(θ) pour deux forces égales à ±θ de l'axe.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var f1 = k.slider("Force du remorqueur 1", 0, 100, 5, 70, "kN");
    var t1 = k.slider("Angle du câble 1 (à gauche de l'axe)", 0, 80, 1, 30, "°");
    var f2 = k.slider("Force du remorqueur 2", 0, 100, 5, 70, "kN");
    var t2 = k.slider("Angle du câble 2 (à droite de l'axe)", 0, 80, 1, 30, "°");
    var ro = k.readouts(["Avant (Rx)", "Latéral (Ry)", "‖R‖", "F₁ + F₂", "Part utile Rx/(F₁+F₂)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx, cx = 70, cy = c.H / 2, sc = Math.min((c.W - 150) / 110, (c.H / 2 - 30) / 80);
      var a1 = t1.value * Math.PI / 180, a2 = t2.value * Math.PI / 180, F1 = f1.value, F2 = f2.value;
      var rx = F1 * Math.cos(a1) + F2 * Math.cos(a2), ry = F1 * Math.sin(a1) - F2 * Math.sin(a2);   /* ry > 0 : vers le haut de l'écran (remorqueur 1) */
      /* eau et cargo */
      ctx.fillStyle = "#e8f1f8"; ctx.fillRect(0, 0, c.W, c.H);
      ctx.save(); ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 60, cy - 18); ctx.lineTo(cx, cy - 18); ctx.lineTo(cx + 22, cy); ctx.lineTo(cx, cy + 18); ctx.lineTo(cx - 60, cy + 18); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      S.draw.line(c, cx, cy, c.W - 20, cy, "#9fb3c8", 1, [6, 5]);
      /* câbles et remorqueurs (à longueur fixe 90 px) */
      var Lc = Math.min(130, c.W * 0.28);
      var p1 = [cx + Lc * Math.cos(a1), cy - Lc * Math.sin(a1)], p2 = [cx + Lc * Math.cos(a2), cy + Lc * Math.sin(a2)];
      S.draw.line(c, cx, cy, p1[0], p1[1], "#6b7685", 2); S.draw.line(c, cx, cy, p2[0], p2[1], "#6b7685", 2);
      S.draw.dot(c, p1[0], p1[1], 9, pal.acc); S.draw.dot(c, p2[0], p2[1], 9, pal.red);
      S.draw.text(c, "1", p1[0], p1[1], {color: "#fff", size: 12}); S.draw.text(c, "2", p2[0], p2[1], {color: "#fff", size: 12});
      /* forces au point d'attache */
      P5.vec(c, cx, cy, cx + F1 * Math.cos(a1) * sc, cy - F1 * Math.sin(a1) * sc, pal.acc, "F₁", {dy: -4});
      P5.vec(c, cx, cy, cx + F2 * Math.cos(a2) * sc, cy + F2 * Math.sin(a2) * sc, pal.red, "F₂", {dy: 4});
      P5.vec(c, cx, cy, cx + rx * sc, cy - ry * sc, pal.green, "R", {w: 3.6});
      S.draw.text(c, "100 kN = " + S.fmt(100 * sc, 0) + " px", c.W - 12, c.H - 12, {align: "right", size: 12, color: pal.grey});
      var nr = Math.hypot(rx, ry);
      ro.set(0, S.fmt(rx, 1) + " kN"); ro.set(1, S.fmt(ry, 1) + " kN"); ro.set(2, S.fmt(nr, 1) + " kN"); ro.set(3, S.fmt(F1 + F2, 0) + " kN");
      ro.set(4, F1 + F2 > 0 ? S.fmt(100 * rx / (F1 + F2), 0) + " %" : "—");
      var straight = Math.abs(ry) <= 2;
      if (rx >= 120 && straight) nt.set("Réussi : le cargo avance droit avec " + S.fmt(rx, 1) + " kN vers l'avant (latéral = " + S.fmt(ry, 1) + " kN).", "ok");
      else if (!straight) nt.set("Le cargo dévie vers le " + (ry > 0 ? "haut (remorqueur 1 gagne)" : "bas (remorqueur 2 gagne)") + " : composante latérale " + S.fmt(Math.abs(ry), 1) + " kN. Compense en changeant une force ou un angle.", "warn");
      else nt.set("Le cargo va droit mais Rx = " + S.fmt(rx, 1) + " kN : il en faut au moins 120. Augmente les forces ou rapproche les câbles de l'axe.", "");
    });
  }
});

SFA.sim({
  id: "p5-c01-cables", ch: "c01", tag: "Niche utile",
  titre: "Pourquoi un câble ne peut jamais être tendu à l'horizontale",
  resume: "Une lanterne au milieu d'un câble entre deux poteaux : plus on tend le câble, plus la tension explose, jusqu'à la rupture.",
  but: "Écarte les poteaux (glisse le poteau de droite) ou tire la lanterne vers le haut : le câble s'aplatit et l'angle α diminue. Surveille la tension sur le graphe. Défi : tends le câble au maximum (angle le plus petit) sans le rompre.",
  aRetenir: "À l'équilibre, les deux tensions et le poids se compensent : 2·T·sin α = m·g, donc T = m·g / (2·sin α). Quand α → 0, sin α → 0 et T devient immense : un câble parfaitement horizontal est impossible avec une charge au milieu.",
  piege: "La tension n'est pas égale à la moitié du poids : elle ne vaut m·g/2 que si les câbles sont verticaux (α = 90°). Plus le câble est tendu, plus chaque moitié porte… et c'est la composante horizontale T·cos α qui grandit.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.66}), g = k.canvas(190);
    var al = k.slider("Angle α de chaque moitié avec l'horizontale", 2, 80, 0.5, 25, "°", function(){ chk(); });
    var m = k.slider("Masse de la lanterne", 2, 60, 1, 20, "kg", function(){ chk(); });
    var lim = k.slider("Résistance maximale du câble", 0.2, 3, 0.1, 1, "kN", function(){ chk(); });
    var ro = k.readouts(["Poids P = m·g", "Tension T dans chaque moitié", "Composante verticale T·sin α", "Composante horizontale T·cos α", "Angle minimal permis"]);
    var nt = k.note("", "");
    var brk = null, best = null;
    var lp = k.loop(function(dt){ if (!brk){ lp.pause(); return; } brk.t += dt; if (brk.t > 2.2) lp.pause(); k.redraw(); });
    function val(){ var A = al.value * Math.PI / 180, W = m.value * P5.g, T = W / (2 * Math.sin(A)), Tm = lim.value * 1000, r = W / (2 * Tm); return {A: A, W: W, T: T, Tm: Tm, amin: r <= 1 ? Math.asin(r) * 180 / Math.PI : null}; }
    function chk(){ var v = val(); if (v.T > v.Tm){ if (!brk){ brk = {t: 0}; lp.play(); } } else brk = null; }
    k.button("Remplacer le câble (α = 30°)", function(){ al.set(30); brk = null; });
    var Gm = {}, gx = null;
    /* poignées : poteau de droite (horizontal) et lanterne (vertical) */
    P5x.drag(c, k, function(){ return [
      {x: Gm.xr, y: Gm.top - 6, r: 34, set: function(px){ var hs = P5.clamp(px - Gm.mx, Gm.l * Math.cos(80 * Math.PI / 180), Gm.l * Math.cos(2 * Math.PI / 180)); al.set(Math.round(Math.acos(hs / Gm.l) * 360 / Math.PI) / 2); chk(); }},
      {x: Gm.mx, y: Gm.ly + 18, r: 34, set: function(px, py){ var sag = P5.clamp(py - 18 - Gm.top, Gm.l * Math.sin(2 * Math.PI / 180), Gm.l * Math.sin(80 * Math.PI / 180)); al.set(Math.round(Math.asin(sag / Gm.l) * 360 / Math.PI) / 2); chk(); }}]; });
    P5x.drag(g, k, function(){ if (!gx) return null; var v = val(); return [{x: gx.X(al.value), y: gx.Y(Math.min(v.T / 1000, gx.y1)), r: 30, set: function(px){ al.set(Math.round(P5.clamp(gx.ix(px), 2, 80) * 2) / 2); chk(); }}]; });
    function lantern(ctx, x, y, s, lit){
      ctx.save(); ctx.translate(x, y);
      if (lit){ var gl = ctx.createRadialGradient(0, 22 * s, 2, 0, 22 * s, 46 * s); gl.addColorStop(0, "rgba(255,214,110,.55)"); gl.addColorStop(1, "rgba(255,214,110,0)"); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 22 * s, 46 * s, 0, 7); ctx.fill(); }
      ctx.fillStyle = "#2c3a4e"; ctx.beginPath(); ctx.moveTo(-4 * s, 0); ctx.lineTo(4 * s, 0); ctx.lineTo(12 * s, 9 * s); ctx.lineTo(-12 * s, 9 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = lit ? "#ffe39a" : "#cfd6df"; ctx.beginPath(); ctx.moveTo(-10 * s, 9 * s); ctx.lineTo(10 * s, 9 * s); ctx.lineTo(7 * s, 30 * s); ctx.lineTo(-7 * s, 30 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 2 * s; ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 9 * s); ctx.lineTo(0, 30 * s); ctx.stroke();
      ctx.fillStyle = "#2c3a4e"; ctx.fillRect(-8 * s, 30 * s, 16 * s, 4 * s); ctx.restore();
    }
    function pole(ctx, x, top, base){
      ctx.fillStyle = P5x.lin(ctx, x - 5, 0, x + 5, 0, [[0, "#6b7685"], [0.5, "#aab4c3"], [1, "#5b6676"]]); ctx.fillRect(x - 5, top - 16, 10, base - top + 16);
      ctx.fillStyle = "#4b5563"; ctx.fillRect(x - 9, base - 6, 18, 6); ctx.beginPath(); ctx.arc(x, top - 16, 6, 0, 7); ctx.fill();
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, v = val(), broke = v.T > v.Tm;
      var top = 46, base = H - 14, l = Math.min(W * 0.44, (base - top - 60) / Math.sin(80 * Math.PI / 180));
      var mx = W / 2, hs = l * Math.cos(v.A), sag = l * Math.sin(v.A), xl = mx - hs, xr = mx + hs, ly = top + sag;
      Gm = {mx: mx, xr: xr, top: top, l: l, ly: ly};
      /* rue au crépuscule */
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, H, [[0, "#2b3a63"], [0.7, "#5a6a96"], [1, "#8d97b5"]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#3b4669"; for (var b = 0; b < 7; b++){ var bw = W / 7, bh = 40 + (b * 37 % 50); ctx.fillRect(b * bw, base - bh, bw - 4, bh); }
      ctx.fillStyle = "rgba(255,220,140,.5)"; for (b = 0; b < 7; b++) for (var wy = 0; wy < 2; wy++) ctx.fillRect(b * W / 7 + 8 + (b % 2) * 10, base - 30 - wy * 16, 6, 8);
      ctx.fillStyle = "#59617a"; ctx.fillRect(0, base, W, H - base);
      pole(ctx, xl, top, base); pole(ctx, xr, top, base);
      /* couleur du câble selon la charge T/Tmax */
      var q = Math.min(1, v.T / v.Tm), col = q < 0.6 ? "#9fe0b8" : q < 0.9 ? "#ffcf6e" : "#ff7a6b";
      var fall = 0;
      if (broke && brk){
        var t = Math.min(brk.t, 2.2), yF = ly + 0.5 * 900 * t * t; fall = Math.min(yF, base - 34) - ly;
        /* deux bouts de câble qui pendent */
        var sw = Math.sin(brk.t * 6) * Math.exp(-brk.t * 1.5) * 18;
        ctx.strokeStyle = "#ff7a6b"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xl, top); ctx.quadraticCurveTo(xl + hs * 0.3, top + 40, xl + 10 + sw, top + Math.min(l * 0.9, base - top - 10)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xr, top); ctx.lineTo(mx + 6, ly + fall); ctx.stroke();
        lantern(ctx, mx, ly + fall, Math.max(0.9, W / 480), false);
        if (fall >= base - 34 - ly - 1){ ctx.fillStyle = "rgba(255,240,200,.9)"; for (var s = 0; s < 8; s++){ ctx.beginPath(); ctx.arc(mx - 22 + s * 6, base - 3 - (s % 3) * 3, 2, 0, 7); ctx.fill(); } }
        P5x.banner(c, "RUPTURE : T = " + S.fmt(v.T / 1000, 2) + " kN > " + S.fmt(lim.value, 1) + " kN", pal.red, 20);
      } else {
        ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(xl, top); ctx.lineTo(mx, ly); ctx.lineTo(xr, top); ctx.stroke();
        lantern(ctx, mx, ly, Math.max(0.9, W / 480), true);
        /* tensions et décomposition, au point d'accroche */
        var sc = Math.min(95, 36 + 55 * q), Lx = sc * Math.cos(v.A), Ly = sc * Math.sin(v.A);
        P5.vec(c, mx, ly, mx - Lx, ly - Ly, "#ffffff", "T", {w: 2.8});
        P5.vec(c, mx, ly, mx + Lx, ly - Ly, "#ffffff", "T", {w: 2.8});
        S.draw.line(c, mx + Lx, ly, mx + Lx, ly - Ly, "#ffcf6e", 1.6, [3, 3]); S.draw.line(c, mx, ly, mx + Lx, ly, "#ffcf6e", 1.6, [3, 3]);
        S.draw.line(c, xl, top, xl + 44, top, "rgba(255,255,255,.5)", 1, [3, 3]);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(xl, top, 34, 0, v.A); ctx.stroke();
        S.draw.text(c, "α", xl + 44 * Math.cos(v.A / 2), top + 44 * Math.sin(v.A / 2) + 3, {color: "#fff", size: 13});
        P5x.handle(c, mx, ly + 18, "#ffcf6e", 7, false);
        P5x.handle(c, xr, top - 6, "#ffcf6e", 7, false);
        P5x.tag(c, "T = " + S.fmt(v.T / 1000, 2) + " kN (" + S.fmt(100 * q, 0) + " % de la limite)", mx, ly + 56, q < 0.6 ? pal.green : q < 0.9 ? pal.amber : pal.red, {size: 11.5, fill: "rgba(255,255,255,.94)"});
      }
      P5x.hint(c, "Glisse le poteau de droite ou la lanterne", {color: "#eef2f8", size: 11, y: H - 7});
      /* graphe T(α) */
      g.clear();
      var ymax = Math.max(lim.value * 1.8, v.W / 1000 * 1.2);
      gx = S.draw.axes(g, {x0: 0, x1: 80, y0: 0, y1: ymax, xl: "α (°)", yl: "T (kN)", stepX: 10, l: 46});
      S.draw.area(g, gx, function(){ return ymax; }, 0, 80, pal.red, 0.07, lim.value);
      S.draw.line(g, gx.X(0), gx.Y(lim.value), gx.X(80), gx.Y(lim.value), pal.red, 1.8, [6, 4]);
      P5x.tag(g, "rupture au-dessus de " + S.fmt(lim.value, 1) + " kN", gx.X(79), gx.Y(lim.value) - 12, pal.red, {align: "right", size: 11});
      S.draw.line(g, gx.X(0), gx.Y(v.W / 2000), gx.X(80), gx.Y(v.W / 2000), pal.grey, 1.2, [3, 3]);
      P5x.tag(g, "m·g/2", gx.X(62), gx.Y(v.W / 2000) - 11, "#4b5868", {size: 11});
      S.draw.fn(g, gx, function(x){ return v.W / (2 * Math.sin(Math.max(x, 0.5) * Math.PI / 180)) / 1000; }, pal.acc, 3);
      if (v.amin !== null){ S.draw.line(g, gx.X(v.amin), gx.Y(0), gx.X(v.amin), gx.Y(lim.value), pal.amber, 1.4, [3, 3]); P5x.tag(g, "α min", gx.X(v.amin) + 4, gx.Y(0) - 12, pal.amber, {align: "left", size: 11}); }
      P5x.handle(g, gx.X(al.value), gx.Y(Math.min(v.T / 1000, ymax)), broke ? pal.red : pal.green, 7);
      P5x.hint(g, "Glisse le point le long de la courbe", {x: g.W - 10, y: 12, align: "right", size: 11});
      ro.set(0, S.fmt(v.W, 0) + " N"); ro.set(1, S.fmt(v.T, 0) + " N"); ro.set(2, S.fmt(v.T * Math.sin(v.A), 0) + " N (= P/2)"); ro.set(3, S.fmt(v.T * Math.cos(v.A), 0) + " N");
      ro.set(4, v.amin === null ? "aucun" : S.fmt(v.amin, 1) + " °");
      if (v.amin === null) nt.set("Même avec des câbles verticaux, chaque moitié porterait " + S.fmt(v.W / 2, 0) + " N, plus que les " + S.fmt(v.Tm, 0) + " N permis : ce câble est trop faible pour cette lanterne. Choisis un câble plus résistant.", "warn");
      else if (broke) nt.set("Rupture : à α = " + S.fmt(al.value, 1) + " °, T = m·g/(2 sin α) = " + S.fmt(v.T, 0) + " N. Il faut α ≥ " + S.fmt(v.amin, 1) + " ° (sin α ≥ m·g / (2·T max)). Remonte l'angle ou remplace le câble.", "warn");
      else {
        var gap = al.value - v.amin;
        if (gap <= 1){ best = best === null ? al.value : Math.min(best, al.value); nt.set("<b>Défi réussi</b> : α = " + S.fmt(al.value, 1) + " °, à moins de 1 ° de l'angle minimal " + S.fmt(v.amin, 1) + " °. La tension vaut " + S.fmt(100 * v.T / v.Tm, 0) + " % de la limite.", "ok"); }
        else nt.set("<b>Défi</b> : tends le câble au maximum sans le rompre (à moins de 1 ° de l'angle minimal). Ici α = " + S.fmt(al.value, 1) + " °, encore " + S.fmt(gap, 1) + " ° de marge ; T = " + S.fmt(v.T, 0) + " N.", "");
      }
    });
  }
});
