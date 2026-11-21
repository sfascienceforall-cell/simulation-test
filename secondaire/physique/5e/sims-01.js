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

/* Petit moteur 3D maison (canvas 2D, sans bibliothèque) pour les scènes de physique 5e :
   caméra en orbite (glisser pour tourner), polygones ombrés triés par profondeur, tubes, sphères,
   flèches 3D et personnages en volume. Monde : x à droite, y vers le haut, z vers l'observateur (mètres). */
window.P5d = (function(){
  var S = window.SFA, TAU = 2 * Math.PI, RGB = {};
  function rgb(c){
    if (RGB[c]) return RGB[c];
    var r, m = /^rgba?\(([^)]+)\)/.exec(c);
    if (m) r = m[1].split(",").slice(0, 3).map(function(v){ return parseFloat(v); });
    else { var h = String(c).replace("#", ""); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; r = [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
    RGB[c] = r; return r;
  }
  /* b < 1 : assombrit ; b > 1 : éclaircit vers le blanc */
  function lit(c, b, a){
    var r = rgb(c), o = r.map(function(v){ return Math.round(b <= 1 ? v * b : v + (255 - v) * Math.min(1, b - 1)); });
    return a == null || a >= 1 ? "rgb(" + o.join(",") + ")" : "rgba(" + o.join(",") + "," + a + ")";
  }
  function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  var LIGHT = norm([-0.45, 0.85, 0.55]);

  /* caméra : o = {yaw, pitch (rad), dist (m), target [x,y,z], focal (px à 1 m), cx, cy} */
  function Cam(o){
    this.o = o; var cy = Math.cos(o.yaw), sy = Math.sin(o.yaw), cp = Math.cos(o.pitch), sp = Math.sin(o.pitch);
    this.k = [cy, sy, cp, sp]; var t = o.target;
    this.pos = [t[0] + o.dist * cp * sy, t[1] + o.dist * sp, t[2] + o.dist * cp * cy];
  }
  Cam.prototype.p = function(v){
    var o = this.o, k = this.k, x = v[0] - o.target[0], y = v[1] - o.target[1], z = v[2] - o.target[2];
    var x1 = x * k[0] - z * k[1], z1 = x * k[1] + z * k[0];
    var y1 = y * k[2] - z1 * k[3], z2 = y * k[3] + z1 * k[2];
    var d = Math.max(0.05, o.dist - z2), s = o.focal / d;
    return {x: o.cx + x1 * s, y: o.cy - y1 * s, d: d, s: s};
  };

  function Scene(c, cam){ this.c = c; this.cam = cam; this.it = []; }
  Scene.prototype.add = function(d, fn){ this.it.push({d: d, f: fn}); };
  /* polygone plan : pts = [[x,y,z]…] ; o = {alpha, stroke, lw, cull, flat, bias, glow} */
  Scene.prototype.poly = function(pts, col, o){
    o = o || {}; var cam = this.cam, P = pts.map(function(p){ return cam.p(p); });
    var n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
    var cen = [0, 0, 0]; pts.forEach(function(p){ cen = add(cen, p); }); cen = mul(cen, 1 / pts.length);
    var v = sub(cam.pos, cen);
    if (dot(n, v) < 0){ if (o.cull) return; n = mul(n, -1); }
    var b = o.flat ? 1 : 0.62 + 0.5 * Math.max(0, dot(n, LIGHT)) + (o.glow || 0);
    var d = 0; P.forEach(function(p){ d += p.d; }); d = d / P.length + (o.bias || 0);
    var fill = lit(col, b, o.alpha);
    this.add(d, function(ctx){
      ctx.beginPath(); P.forEach(function(p, i){ if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 1; ctx.stroke(); }
      else if (o.alpha == null || o.alpha >= 1){ ctx.strokeStyle = fill; ctx.lineWidth = 0.6; ctx.stroke(); }   /* bouche les fentes entre facettes */
    });
  };
  /* tube (membre, câble, barre) entre a et b ; w = diamètre en m */
  Scene.prototype.tube = function(a, b, w, col, o){
    o = o || {}; var A = this.cam.p(a), B = this.cam.p(b), d = (A.d + B.d) / 2 + (o.bias || 0), px = Math.max(o.min || 1, w * (A.s + B.s) / 2);
    var dark = lit(col, 0.72), base = lit(col, 1), hi = lit(col, 1.35);
    this.add(d, function(ctx){
      ctx.save(); ctx.lineCap = o.butt ? "butt" : "round"; if (o.alpha != null) ctx.globalAlpha = o.alpha;
      ctx.strokeStyle = dark; ctx.lineWidth = px + 1.2; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      ctx.strokeStyle = base; ctx.lineWidth = px; ctx.stroke();
      if (px > 3 && !o.plain){ var ox = -px * 0.18, oy = -px * 0.18; ctx.strokeStyle = hi; ctx.lineWidth = px * 0.32; ctx.beginPath(); ctx.moveTo(A.x + ox, A.y + oy); ctx.lineTo(B.x + ox, B.y + oy); ctx.stroke(); }
      ctx.restore();
    });
  };
  /* sphère */
  Scene.prototype.ball = function(c0, r, col, o){
    o = o || {}; var P = this.cam.p(c0), R = Math.max(0.8, r * P.s), d = P.d + (o.bias || 0);
    this.add(d, function(ctx){
      ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
      var g = ctx.createRadialGradient(P.x - R * 0.35, P.y - R * 0.4, R * 0.08, P.x, P.y, R);
      g.addColorStop(0, lit(col, 1.45)); g.addColorStop(0.55, lit(col, 1)); g.addColorStop(1, lit(col, 0.62));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, R, 0, TAU); ctx.fill(); ctx.restore();
    });
  };
  /* ombre portée au sol (ellipse floue) */
  Scene.prototype.shadow = function(c0, rx, rz, a){
    var cam = this.cam, pts = [], i; for (i = 0; i < 16; i++){ var t = i / 16 * TAU; pts.push(cam.p([c0[0] + rx * Math.cos(t), c0[1], c0[2] + rz * Math.sin(t)])); }
    var d = 1e5 + cam.p(c0).d;   /* les ombres passent avant les objets (le sol est dessiné à part, avant la scène) */
    this.add(d, function(ctx){ ctx.save(); ctx.fillStyle = "rgba(15,27,45," + (a == null ? 0.18 : a) + ")"; ctx.beginPath(); pts.forEach(function(p, i){ if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.restore(); });
  };
  /* flèche 3D toujours visible (dessinée par-dessus) */
  Scene.prototype.arrow = function(a, b, col, label, o){
    o = o || {}; var A = this.cam.p(a), B = this.cam.p(b), c = this.c;
    this.add(-1e6 + (o.bias || 0), function(ctx){
      var dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy); if (L < 3) return;
      var ux = dx / L, uy = dy / L, w = o.w || 4, hl = Math.min(L * 0.45, 9 + w * 2.2);
      ctx.save(); ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = w + 3; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x - ux * hl * 0.6, B.y - uy * hl * 0.6); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
      ctx.fillStyle = col; ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(B.x - ux * hl - uy * hl * 0.55, B.y - uy * hl + ux * hl * 0.55); ctx.lineTo(B.x - ux * hl + uy * hl * 0.55, B.y - uy * hl - ux * hl * 0.55); ctx.closePath(); ctx.stroke(); ctx.fill();
      ctx.restore();
      if (label) S.draw.label(c, label, B.x + ux * 16 + (o.dx || 0), B.y + uy * 16 + (o.dy || 0), {color: col, size: o.size || 12});
    });
  };
  /* étiquette posée sur un point 3D */
  Scene.prototype.label = function(p, s, col, o){ var P = this.cam.p(p), c = this.c; o = o || {}; this.add(-2e6, function(){ S.draw.label(c, s, P.x + (o.dx || 0), P.y + (o.dy || 0), {color: col, size: o.size || 11.5, align: o.align}); }); };
  Scene.prototype.draw = function(){
    var ctx = this.c.ctx; this.it.sort(function(a, b){ return b.d - a.d; });
    this.it.forEach(function(i){ i.f(ctx); }); this.it = [];
  };
  /* boîte : centre c0, demi-dimensions h = [hx, hy, hz], rotation ry autour de y ; faces = couleurs (ou une seule) */
  Scene.prototype.box = function(c0, h, col, o){
    o = o || {}; var ry = o.ry || 0, cs = Math.cos(ry), sn = Math.sin(ry), self = this;
    function P(x, y, z){ return [c0[0] + x * cs + z * sn, c0[1] + y, c0[2] - x * sn + z * cs]; }
    var v = [P(-h[0], -h[1], -h[2]), P(h[0], -h[1], -h[2]), P(h[0], h[1], -h[2]), P(-h[0], h[1], -h[2]), P(-h[0], -h[1], h[2]), P(h[0], -h[1], h[2]), P(h[0], h[1], h[2]), P(-h[0], h[1], h[2])];
    var F = [[4, 5, 6, 7], [1, 0, 3, 2], [5, 1, 2, 6], [0, 4, 7, 3], [7, 6, 2, 3], [0, 1, 5, 4]];   /* avant, arrière, droite, gauche, dessus, dessous */
    F.forEach(function(f, i){ var cc = Array.isArray(col) ? col[i] : col; if (!cc) return; self.poly(f.map(function(j){ return v[j]; }), cc, {cull: true, alpha: o.alpha, stroke: o.stroke, lw: o.lw, bias: o.bias}); });
  };
  /* boîte dans un repère quelconque : T(local) → monde ; c0 = centre local, h = demi-dimensions ; col = couleur ou [avant, arrière, droite, gauche, dessus, dessous] */
  Scene.prototype.boxT = function(T, c0, h, col, o){
    o = o || {}; var self = this;
    function P(x, y, z){ return T([c0[0] + x, c0[1] + y, c0[2] + z]); }
    var v = [P(-h[0], -h[1], -h[2]), P(h[0], -h[1], -h[2]), P(h[0], h[1], -h[2]), P(-h[0], h[1], -h[2]), P(-h[0], -h[1], h[2]), P(h[0], -h[1], h[2]), P(h[0], h[1], h[2]), P(-h[0], h[1], h[2])];
    if (o.taper){ [3, 2, 6, 7].forEach(function(j, n){ var q = [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]][n]; v[j] = P(q[0] * h[0] * o.taper[0], h[1], q[2] * h[2] * o.taper[1] + (o.taper[2] || 0)); }); }
    [[4, 5, 6, 7], [1, 0, 3, 2], [5, 1, 2, 6], [0, 4, 7, 3], [7, 6, 2, 3], [0, 1, 5, 4]].forEach(function(f, i){ var cc = Array.isArray(col) ? col[i] : col; if (!cc) return; self.poly(f.map(function(j){ return v[j]; }), cc, {cull: true, alpha: o.alpha, stroke: o.stroke, lw: o.lw, bias: o.bias}); });
  };
  /* surface de révolution : anneau vertical (paroi de cylindre) de rayon r entre y0 et y1 autour de c0 */
  Scene.prototype.wall = function(c0, r, y0, y1, n, colFn, o){
    o = o || {}; for (var i = 0; i < n; i++){
      var a0 = i / n * TAU + (o.rot || 0), a1 = (i + 1) / n * TAU + (o.rot || 0);
      var p = [[c0[0] + r * Math.cos(a0), y0, c0[2] + r * Math.sin(a0)], [c0[0] + r * Math.cos(a1), y0, c0[2] + r * Math.sin(a1)], [c0[0] + r * Math.cos(a1), y1, c0[2] + r * Math.sin(a1)], [c0[0] + r * Math.cos(a0), y1, c0[2] + r * Math.sin(a0)]];
      var cc = colFn(i, a0, a1); if (cc) this.poly(p, cc.c || cc, {alpha: cc.a, cull: o.cull, bias: o.bias, stroke: cc.s, lw: cc.lw});
    }
  };
  Scene.prototype.disc = function(c0, r, n, col, o){ var p = []; for (var i = 0; i < n; i++){ var a = i / n * TAU; p.push([c0[0] + r * Math.cos(a), c0[1], c0[2] + r * Math.sin(a)]); } this.poly(p, col, o); };

  /* personnage en volume. o = {at:[x,y,z] (pieds), face: angle (rad, 0 = regarde vers +z), h: taille (m), lean: inclinaison avant (rad),
     side: inclinaison latérale (rad), shirt, pants, skin, hair, shoes, pose: {…points locaux en fraction de h : [droite, haut, avant]}} */
  var POSE = {footL: [-0.07, 0, 0.02], footR: [0.07, 0, 0.02], kneeL: [-0.065, 0.27, 0.02], kneeR: [0.065, 0.27, 0.02], hipL: [-0.06, 0.5, 0], hipR: [0.06, 0.5, 0],
    shL: [-0.13, 0.79, 0], shR: [0.13, 0.79, 0], elL: [-0.16, 0.63, -0.01], elR: [0.16, 0.63, -0.01], haL: [-0.17, 0.49, 0.02], haR: [0.17, 0.49, 0.02]};
  function person(sc, o){
    var h = o.h || 1.7, f = o.face || 0, cf = Math.cos(f), sf = Math.sin(f), pose = o.pose || {}, at = o.at;
    var lean = o.lean || 0, side = o.side || 0, cl = Math.cos(lean), sl = Math.sin(lean), cs = Math.cos(side), ss = Math.sin(side);
    function W(q){   /* local [r, u, f] (fraction de h) → monde */
      var r = q[0] * h, u = q[1] * h, fw = q[2] * h;
      var u1 = u * cl - fw * sl, f1 = u * sl + fw * cl;      /* penché en avant autour des pieds */
      var r2 = r * cs + u1 * ss, u2 = -r * ss + u1 * cs;     /* penché sur le côté */
      return [at[0] + r2 * cf + f1 * sf, at[1] + u2, at[2] - r2 * sf + f1 * cf];
    }
    function J(n){ return W(pose[n] || POSE[n]); }
    var shirt = o.shirt || "#2f7fd1", pants = o.pants || "#2c3a4e", skin = o.skin || "#f0c39b", hair = o.hair || "#5b3b25", shoes = o.shoes || "#1f2937";
    if (o.shadow !== false) sc.shadow([W([0, 0, 0])[0], at[1] + 0.005, W([0, 0, 0])[2]], 0.28 * h / 1.7, 0.2 * h / 1.7, 0.16);
    var lw = 0.085 * h, aw = 0.062 * h;
    /* jambes */
    sc.tube(J("hipL"), J("kneeL"), lw, pants); sc.tube(J("kneeL"), J("footL"), lw * 0.9, pants);
    sc.tube(J("hipR"), J("kneeR"), lw, pants); sc.tube(J("kneeR"), J("footR"), lw * 0.9, pants);
    var fwd = pose.toe || [0, 0, 0.07];
    [["footL", -1], ["footR", 1]].forEach(function(q){ var p = pose[q[0]] || POSE[q[0]]; sc.tube(W([p[0], p[1] + 0.012, p[2] - 0.01]), W([p[0] + fwd[0], p[1] + 0.012 + fwd[1], p[2] + fwd[2]]), 0.05 * h, shoes, {plain: true}); });
    /* bassin et torse (boîtes trapézoïdales) */
    var hipY = (pose.hipL || POSE.hipL)[1], shY = (pose.shL || POSE.shL)[1], tw = o.wide || 1;
    function slab(y0, y1, w0, w1, d0, d1, col, dz){
      dz = dz || 0;
      var v = [W([-w0, y0, -d0 + dz]), W([w0, y0, -d0 + dz]), W([w1, y1, -d1 + dz]), W([-w1, y1, -d1 + dz]), W([-w0, y0, d0 + dz]), W([w0, y0, d0 + dz]), W([w1, y1, d1 + dz]), W([-w1, y1, d1 + dz])];
      [[4, 5, 6, 7], [1, 0, 3, 2], [5, 1, 2, 6], [0, 4, 7, 3], [7, 6, 2, 3], [0, 1, 5, 4]].forEach(function(F){ sc.poly(F.map(function(j){ return v[j]; }), col, {cull: true}); });
    }
    slab(hipY - 0.03, hipY + 0.05, 0.095 * tw, 0.1 * tw, 0.06, 0.06, pants);
    slab(hipY + 0.05, shY + 0.02, 0.1 * tw, 0.135 * tw, 0.065, 0.07, shirt);
    /* bras */
    sc.tube(J("shL"), J("elL"), aw, shirt); sc.tube(J("elL"), J("haL"), aw * 0.85, o.sleeves === false ? skin : (o.short ? skin : shirt));
    sc.tube(J("shR"), J("elR"), aw, shirt); sc.tube(J("elR"), J("haR"), aw * 0.85, o.sleeves === false ? skin : (o.short ? skin : shirt));
    sc.ball(J("haL"), 0.034 * h, skin); sc.ball(J("haR"), 0.034 * h, skin);
    /* cou et tête */
    var hd = pose.head || [0, 0.905, 0.005];
    sc.tube(W([0, shY + 0.01, 0]), W([hd[0] * 0.5, shY + 0.06, 0.005]), 0.05 * h, skin);
    sc.ball(W([hd[0], hd[1] + 0.012, hd[2] - 0.022]), 0.07 * h, hair);
    sc.ball(W(hd), 0.064 * h, skin);
    if (o.cap) sc.ball(W([hd[0], hd[1] + 0.03, hd[2] - 0.01]), 0.062 * h, o.cap);
    sc.ball(W([hd[0] - 0.024, hd[1] + 0.008, hd[2] + 0.058]), 0.009 * h, "#1f2937");
    sc.ball(W([hd[0] + 0.024, hd[1] + 0.008, hd[2] + 0.058]), 0.009 * h, "#1f2937");
    return {W: W, J: J};
  }

  /* contrôle d'orbite : glisser = tourner la vue ; st = {yaw, pitch} ; lim = {p0, p1, y0, y1} ; onTap(x, y) si clic sans glisser */
  function orbit(c, k, st, lim, onTap){
    lim = lim || {}; var p0 = null, moved = false;
    c.pointer(function(type, q){
      if (type === "down"){ p0 = {x: q.x, y: q.y, yaw: st.yaw, pitch: st.pitch}; moved = false; }
      else if (type === "drag" && p0){
        if (Math.abs(q.x - p0.x) + Math.abs(q.y - p0.y) > 5) moved = true;
        if (!moved) return;
        st.yaw = p0.yaw - (q.x - p0.x) * 0.008;
        if (lim.y0 != null) st.yaw = Math.max(lim.y0, Math.min(lim.y1, st.yaw));
        st.pitch = Math.max(lim.p0 == null ? 0.05 : lim.p0, Math.min(lim.p1 == null ? 1.35 : lim.p1, p0.pitch + (q.y - p0.y) * 0.006));
        st.user = true; k.redraw();
      } else if (type === "up"){ if (p0 && !moved && onTap) onTap(q.x, q.y); p0 = null; }
    });
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
  }
  /* indication discrète en bas de la scène */
  function grabHint(c, s){ S.draw.text(c, s || "Glisse pour tourner la vue", c.W - 10, c.H - 11, {align: "right", size: 10.5, color: "rgba(80,92,110,.75)", weight: 600}); }
  /* cartouche d'information (titre coloré + lignes) en haut à gauche ; renvoie la hauteur */
  function card(c, x, y, title, lines, col, o){
    o = o || {}; var ctx = c.ctx, w = 0, fs = o.size || 12;
    ctx.save(); ctx.font = "800 " + (fs + 1.5) + "px Mulish, system-ui, sans-serif"; w = ctx.measureText(title).width;
    ctx.font = "600 " + fs + "px Mulish, system-ui, sans-serif"; lines.forEach(function(l){ w = Math.max(w, ctx.measureText(l).width); }); ctx.restore();
    w = Math.min(o.maxW || 9999, w + 22); var hh = 14 + (fs + 6) + lines.length * (fs + 5);
    if (o.align === "right") x -= w;
    S.draw.panel(c, x, y, w, hh, {radius: 9});
    S.draw.text(c, title, x + 11, y + 8 + (fs + 4) / 2 + 1, {align: "left", size: fs + 1.5, color: col || "#0f1b2d", weight: 800});
    lines.forEach(function(l, i){ S.draw.text(c, l, x + 11, y + 12 + (fs + 6) + i * (fs + 5) + fs / 2, {align: "left", size: fs, color: "#2c3a4e", weight: 600}); });
    return hh;
  }
  return {Cam: Cam, Scene: Scene, person: person, orbit: orbit, grabHint: grabHint, card: card, lit: lit, norm: norm, cross: cross, add: add, sub: sub, mul: mul, dot: dot,
    /* crée caméra + scène en une fois */
    scene: function(c, o){ var cam = new Cam(o); return new Scene(c, cam); }};
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
  but: "Règle les forces et les angles des deux remorqueurs (ou attrape un remorqueur pour changer l'angle de son câble). Le cargo avance réellement dans la direction de la résultante R. Défi : fais avancer le cargo tout droit (composante latérale nulle) avec une résultante d'au moins 120 kN.",
  aRetenir: "Seule la composante des forces dans le sens du déplacement fait avancer le cargo ; les composantes latérales se compensent, ou le font dévier. Plus l'angle entre les câbles est grand, plus on gaspille de force.",
  piege: "Deux remorqueurs de 100 kN ne donnent pas 200 kN de traction vers l'avant, sauf si les câbles sont parallèles : R = 2·F·cos(θ) pour deux forces égales à ±θ de l'axe.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.72});
    if (c.W < 470){ c.ratio = 1.0; c.resize(); }
    var f1 = k.slider("Force du remorqueur 1", 0, 100, 5, 70, "kN");
    var t1 = k.slider("Angle du câble 1 (à gauche de l'axe)", 0, 80, 1, 30, "°");
    var f2 = k.slider("Force du remorqueur 2", 0, 100, 5, 70, "kN");
    var t2 = k.slider("Angle du câble 2 (à droite de l'axe)", 0, 80, 1, 30, "°");
    var cp = k.toggle("Composantes (avant / latérale)", true);
    var ro = k.readouts(["Avant (Rx)", "Latéral (Ry)", "‖R‖", "F₁ + F₂", "Part utile Rx/(F₁+F₂)"]);
    var nt = k.note("", "");
    var st = {x: 0, z: 0, t: 0, yaw: 0, pitch: 1.0, path: []};
    var BOW = 19, LC = 26, SC = 0.17;   /* proue (m), longueur des câbles (m), échelle des flèches : 1 kN ↔ 0,17 m */
    function forces(){
      var a1 = t1.value * Math.PI / 180, a2 = t2.value * Math.PI / 180, F1 = f1.value, F2 = f2.value;
      return {a1: a1, a2: a2, F1: F1, F2: F2, rx: F1 * Math.cos(a1) + F2 * Math.cos(a2), ry: F1 * Math.sin(a1) - F2 * Math.sin(a2)};   /* ry > 0 : vers le remorqueur 1 */
    }
    var lp = k.loop(function(dt){
      var r = forces(), K = 0.02;   /* vitesse de croisière ∝ R (frottement de l'eau, modèle simplifié) : 100 kN → 2 m/s */
      st.t += dt; st.x += r.rx * K * dt; st.z += -r.ry * K * dt;
      if (!st.path.length || Math.hypot(st.x - st.path[st.path.length - 1][0], st.z - st.path[st.path.length - 1][1]) > 1.5){ st.path.push([st.x, st.z]); if (st.path.length > 60) st.path.shift(); }
      k.redraw();
    });
    lp.play();
    k.button("↺ Recentrer le cargo", function(){ st.x = 0; st.z = 0; st.path = []; });
    /* souris : attraper un remorqueur règle l'angle de son câble ; ailleurs, on tourne la vue */
    var drag = null, cam0 = null;
    function tugPos(side, ang){ var a = ang * Math.PI / 180; return [st.x + BOW + LC * Math.cos(a), 0.6, st.z + side * LC * Math.sin(a)]; }
    c.pointer(function(type, q){
      if (!cam0) return;
      if (type === "down"){
        drag = null;
        [[1, t1, -1], [2, t2, 1]].forEach(function(T){ var p = cam0.p(tugPos(T[2], T[1].value)); if (Math.hypot(p.x - q.x, p.y - q.y) < 34) drag = {tug: T}; });
        if (!drag) drag = {orbit: true, x: q.x, y: q.y, yaw: st.yaw, pitch: st.pitch};
      } else if (type === "drag" && drag){
        if (drag.tug){ var best = 0, bd = 1e9; for (var a = 0; a <= 80; a++){ var p = cam0.p(tugPos(drag.tug[2], a)), d = Math.hypot(p.x - q.x, p.y - q.y); if (d < bd){ bd = d; best = a; } } drag.tug[1].set(best); }
        else { st.yaw = drag.yaw - (q.x - drag.x) * 0.008; st.pitch = Math.max(0.35, Math.min(1.35, drag.pitch + (q.y - drag.y) * 0.006)); }
        k.redraw();
      } else if (type === "up") drag = null;
    });
    c.cv.style.touchAction = "none";
    /* coque vue de dessus (contour), extrudée de la ligne de flottaison au pont */
    function hull(sc, cx, cz, len, beam, hgt, col, deck, ang){
      var ca = Math.cos(ang || 0), sa = Math.sin(ang || 0), o = [];
      var shape = [[-0.5, -0.42], [0.3, -0.5], [0.42, -0.36], [0.5, 0], [0.42, 0.36], [0.3, 0.5], [-0.5, 0.42], [-0.52, 0]];
      shape.forEach(function(p){ var x = p[0] * len, z = p[1] * beam; o.push([cx + x * ca - z * sa, cz + x * sa + z * ca]); });
      for (var i = 0; i < o.length; i++){ var p0 = o[i], p1 = o[(i + 1) % o.length]; sc.poly([[p0[0], 0, p0[1]], [p1[0], 0, p1[1]], [p1[0], hgt, p1[1]], [p0[0], hgt, p0[1]]], col); }
      sc.poly(o.map(function(p){ return [p[0], hgt, p[1]]; }), deck, {bias: 0.3});
      return function(x, z){ return [cx + x * ca - z * sa, cz + x * sa + z * ca]; };
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r = forces(), small = c.W < 470, X = st.x, Z = st.z;
      var cam = {yaw: st.yaw, pitch: st.pitch, dist: small ? 98 : 128, target: [X + (small ? 19 : 17), 0, Z], focal: Math.min(c.W * 1.45, c.H * 2.05), cx: c.W / 2, cy: c.H * 0.5};
      var C0 = new P5d.Cam(cam); cam0 = C0;
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, c.H, [[0, "#2f6f9e"], [1, "#4f93c2"]]); ctx.fillRect(0, 0, c.W, c.H);
      var hz = C0.p([X, 0, Z - 3000]).y; if (hz > 0){ ctx.fillStyle = "#cfe3f3"; ctx.fillRect(0, 0, c.W, hz); }
      /* 1. eau : crêtes de vagues fixes dans l'eau (elles défilent quand le convoi avance) */
      var W1 = P5d.scene(c, cam), gx0 = Math.floor((X - 90) / 14), gz0 = Math.floor((Z - 70) / 10);
      for (var gx = gx0; gx < gx0 + 15; gx++) for (var gz = gz0; gz < gz0 + 15; gz++){
        var hsh = Math.sin(gx * 12.9898 + gz * 78.233) * 43758.5, fr = hsh - Math.floor(hsh), wx = gx * 14 + fr * 9, wz = gz * 10 + fr * 5, ph = Math.sin(st.t * 1.6 + fr * 6.28);
        W1.tube([wx, 0, wz], [wx + 3 + 1.5 * ph, 0, wz + 0.6], 0.35, "#d8ecf8", {plain: true, alpha: 0.45 + 0.25 * ph});
      }
      W1.draw();
      /* 2. sillages (dans la direction opposée au mouvement) */
      var W2 = P5d.scene(c, cam), Rn = Math.hypot(r.rx, r.ry);
      if (st.path.length > 1){ for (var i = 1; i < st.path.length; i++){ var p0 = st.path[i - 1], p1 = st.path[i], al = i / st.path.length; W2.tube([p0[0] - 18, 0, p0[1]], [p1[0] - 18, 0, p1[1]], 7 * (0.4 + 0.6 * al), "#eaf6fd", {plain: true, alpha: 0.35 * al}); } }
      W2.draw();
      /* 3. navires, câbles, forces */
      var sc = P5d.scene(c, cam);
      var H = hull(sc, X, Z, 40, 9, 2.6, "#a9302a", "#5b6573");
      /* conteneurs */
      var CC = ["#2f7fd1", "#e07a1f", "#24775a", "#c43a7a", "#f4c542", "#6236c4", "#0e7f96"];
      for (var row = 0; row < 6; row++) for (var col = 0; col < 3; col++) for (var lev = 0; lev < 2; lev++){ var n = (row * 3 + col * 5 + lev * 2) % CC.length; sc.box([X - 9 + row * 4.4, 2.6 + 1.25 + lev * 2.5, Z - 2.8 + col * 2.8], [2.1, 1.2, 1.3], CC[n]); }
      /* passerelle et cheminée à la poupe */
      sc.box([X - 16.5, 6.5, Z], [2.2, 3.9, 3.6], ["#f4f6f8", "#e3e7ed", "#f4f6f8", "#e3e7ed", "#ffffff", null]);
      sc.box([X - 15.6, 9.2, Z], [1.35, 0.5, 3.65], "#26364f");
      sc.box([X - 18, 11.5, Z], [0.9, 1.4, 0.9], ["#c0321d", "#c0321d", "#c0321d", "#c0321d", "#1f2329", null]);
      var bow = [X + BOW, 2.8, Z];
      /* remorqueurs, orientés selon leur câble */
      [[r.a1, -1, r.F1, pal.acc, "1"], [r.a2, 1, r.F2, pal.red, "2"]].forEach(function(T){
        var tp = tugPos(T[1], T[0] * 180 / Math.PI), ang = T[1] * T[0];
        var hh = hull(sc, tp[0] + 4 * Math.cos(T[0]), tp[2] + T[1] * 4 * Math.sin(T[0]), 11, 4.2, 1.6, T[3], "#3b4250", ang);
        var cab = hh(0.5, 0); sc.box([cab[0], 2.8, cab[1]], [1.6, 1.2, 1.4], ["#ffffff", "#e3e7ed", "#ffffff", "#e3e7ed", "#d0d6de", null], {ry: -ang});
        var fu = hh(-1.6, 0); sc.box([fu[0], 4.3, fu[1]], [0.45, 0.6, 0.45], "#1f2329", {ry: -ang});
        /* remous de l'hélice, derrière le remorqueur */
        var pr = hh(-7.5 - 1.5 * Math.sin(st.t * 3), 0); sc.ball([pr[0], 0.05, pr[1]], 1.6 + T[2] / 60, "#ffffff", {alpha: 0.35});
        sc.tube(bow, [tp[0], 1.6, tp[2]], 0.25, "#3b3328", {plain: true});
        sc.label([tp[0] + 5 * Math.cos(T[0]), 6, tp[2] + T[1] * 5 * Math.sin(T[0])], "Remorqueur " + T[4] + " · " + S.fmt(T[2], 0) + " kN", T[3], {size: 11});
      });
      /* forces au point d'attache (dessinées au-dessus du pont) */
      var fy = 4, o = [bow[0], fy, bow[2]];
      function V(fx, fz){ return [o[0] + fx * SC, fy, o[2] + fz * SC]; }
      var F1v = [r.F1 * Math.cos(r.a1), -r.F1 * Math.sin(r.a1)], F2v = [r.F2 * Math.cos(r.a2), r.F2 * Math.sin(r.a2)];
      if (cp.value){
        var D = function(a, b, col, lab){ var A = C0.p(a), B = C0.p(b); sc.add(-9e5, function(cx){ cx.save(); cx.strokeStyle = col; cx.lineWidth = 2.6; cx.setLineDash([6, 4]); cx.beginPath(); cx.moveTo(A.x, A.y); cx.lineTo(B.x, B.y); cx.stroke(); cx.restore(); }); if (lab) sc.label(b, lab, col, {size: 11, dx: 0, dy: 0}); };
        if (r.F1 > 0){ D(V(F1v[0], 0), V(F1v[0], F1v[1]), "rgba(31,75,158,.7)"); D(o, V(0, F1v[1]), pal.acc, "F₁y = " + S.fmt(r.F1 * Math.sin(r.a1), 0)); }
        if (r.F2 > 0){ D(V(F2v[0], 0), V(F2v[0], F2v[1]), "rgba(192,50,29,.7)"); D(o, V(0, F2v[1]), pal.red, "F₂y = " + S.fmt(r.F2 * Math.sin(r.a2), 0)); }
      }
      if (r.F1 > 0) sc.arrow(o, V(F1v[0], F1v[1]), pal.acc, "F₁", {w: 4});
      if (r.F2 > 0) sc.arrow(o, V(F2v[0], F2v[1]), pal.red, "F₂", {w: 4});
      if (Rn > 0.5) sc.arrow(o, V(r.rx, -r.ry), pal.green, "R", {w: 5.5, size: 13});
      sc.draw();
      /* tableau de bord */
      var straight = Math.abs(r.ry) <= 2, okD = r.rx >= 120 && straight;
      P5d.card(c, 10, 10, okD ? "Défi réussi : tout droit, R ≥ 120 kN" : straight ? "Le cargo va tout droit" : "Le cargo dérive vers le remorqueur " + (r.ry > 0 ? "1" : "2"),
        ["R = " + S.fmt(Rn, 1) + " kN · avant Rx = " + S.fmt(r.rx, 1) + " kN", "latéral : F₁y − F₂y = " + S.fmt(r.ry, 1) + " kN"], okD ? pal.green : straight ? pal.acc : pal.amber, {size: small ? 10.5 : 11.5});
      S.draw.text(c, "100 kN ↔ " + S.fmt(100 * SC, 0) + " m sur l'eau", c.W - 10, c.H - 28, {align: "right", size: 10.5, color: "#e8f2fa", weight: 700});
      S.draw.text(c, small ? "Glisse un remorqueur ou la vue" : "Attrape un remorqueur pour changer son angle · glisse ailleurs pour tourner la vue", c.W - 10, c.H - 12, {align: "right", size: 10.5, color: "rgba(232,242,250,.8)", weight: 600});
      var nr = Rn;
      ro.set(0, S.fmt(r.rx, 1) + " kN"); ro.set(1, S.fmt(r.ry, 1) + " kN"); ro.set(2, S.fmt(nr, 1) + " kN"); ro.set(3, S.fmt(r.F1 + r.F2, 0) + " kN");
      ro.set(4, r.F1 + r.F2 > 0 ? S.fmt(100 * r.rx / (r.F1 + r.F2), 0) + " %" : "—");
      if (okD) nt.set("Réussi : le cargo avance droit avec " + S.fmt(r.rx, 1) + " kN vers l'avant (latéral = " + S.fmt(r.ry, 1) + " kN).", "ok");
      else if (!straight) nt.set("Le cargo dévie vers le " + (r.ry > 0 ? "remorqueur 1 (à gauche)" : "remorqueur 2 (à droite)") + " : composante latérale " + S.fmt(Math.abs(r.ry), 1) + " kN. Compense en changeant une force ou un angle.", "warn");
      else nt.set("Le cargo va droit mais Rx = " + S.fmt(r.rx, 1) + " kN : il en faut au moins 120. Augmente les forces ou rapproche les câbles de l'axe.", "");
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
