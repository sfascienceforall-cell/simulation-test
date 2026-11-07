/* Mathématiques BA1 · outils communs des simulations (2D, 3D tournable, glisser-déposer) */
(function(){
var D = SFA.draw, F = SFA.fmt;
var C = {blue:"#1e3f8f", red:"#b42318", green:"#2e6b55", violet:"#5B21B6", amber:"#B45309", teal:"#0e7490", grey:"#8a95a3", ink:"#0f1b2d", light:"#e3e7ed", pink:"#be185d"};
function fx(x, d){ return F(x, d == null ? 2 : d); }
function rgba(h, a){ var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
function cstr(a, b, d){ d = d == null ? 2 : d; var sa = fx(a, d), sb = fx(Math.abs(b), d); if (Math.abs(b) < 5e-10) return sa; if (Math.abs(a) < 5e-10) return (b < 0 ? "−" : "") + (Math.abs(Math.abs(b) - 1) < 5e-10 ? "" : sb) + "i"; return sa + (b < 0 ? " − " : " + ") + (Math.abs(Math.abs(b) - 1) < 5e-10 ? "" : sb) + "i"; }
/* panneau carré à échelle égale dans un canvas : {X,Y,ix,iy,k} ; grille et axes ; r = demi-étendue */
function Pane(c, bx, by, bw, bh, rx, ry, o){
  o = o || {}; ry = ry || rx; var ctx = c.ctx, k = Math.min(bw / (2 * rx), bh / (2 * ry)), cx = bx + bw / 2 + (o.dx || 0) * k, cy = by + bh / 2 + (o.dy || 0) * k;
  var p = {k:k, cx:cx, cy:cy, bx:bx, by:by, bw:bw, bh:bh}; var sx = o.step || (rx > 12 ? 5 : rx > 6 ? 2 : 1);
  p.X = function(x){ return cx + x * k; }; p.Y = function(y){ return cy - y * k; }; p.ix = function(px){ return (px - cx) / k; }; p.iy = function(py){ return (cy - py) / k; };
  ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
  if (o.bg !== false){ ctx.fillStyle = o.bg || "#fff"; ctx.fillRect(bx, by, bw, bh); }
  ctx.lineWidth = 1; ctx.strokeStyle = "#edf0f4"; ctx.beginPath();
  var x0 = Math.floor(p.ix(bx) / sx) * sx, x1 = Math.ceil(p.ix(bx + bw) / sx) * sx, y0 = Math.floor(p.iy(by + bh) / sx) * sx, y1 = Math.ceil(p.iy(by) / sx) * sx, v;
  if (o.grid !== false){ for (v = x0; v <= x1 + 1e-9; v += sx){ ctx.moveTo(p.X(v), by); ctx.lineTo(p.X(v), by + bh); } for (v = y0; v <= y1 + 1e-9; v += sx){ ctx.moveTo(bx, p.Y(v)); ctx.lineTo(bx + bw, p.Y(v)); } ctx.stroke(); }
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(bx, cy); ctx.lineTo(bx + bw, cy); ctx.moveTo(cx, by); ctx.lineTo(cx, by + bh); ctx.stroke();
  ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  if (o.ticks !== false){ for (v = x0; v <= x1 + 1e-9; v += sx){ if (Math.abs(v) < 1e-9) continue; var tx = p.X(v); if (tx > bx + 8 && tx < bx + bw - 8) ctx.fillText(F(v, 0), tx, Math.min(by + bh - 14, Math.max(by + 2, cy + 4))); }
    ctx.textAlign = "right"; ctx.textBaseline = "middle"; for (v = y0; v <= y1 + 1e-9; v += sx){ if (Math.abs(v) < 1e-9) continue; var ty = p.Y(v); if (ty > by + 8 && ty < by + bh - 8) ctx.fillText(F(v, 0), Math.max(bx + 22, Math.min(bx + bw - 4, cx - 5)), ty); } }
  ctx.restore(); if (o.xl){ D.text(c, o.xl, bx + bw - 8, Math.min(by + bh - 10, Math.max(by + 12, cy - 12)), {size:12, align:"right", color:"#2c3a4e"}); } if (o.yl){ D.text(c, o.yl, Math.max(bx + 10, Math.min(bx + bw - 30, cx + 8)), by + 12, {size:12, align:"left", color:"#2c3a4e"}); }
  p.clip = function(){ ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); }; p.unclip = function(){ ctx.restore(); };
  return p;
}
function vec(c, p, x0, y0, x1, y1, col, w, lab){ D.arrow(c, p.X(x0), p.Y(y0), p.X(x1), p.Y(y1), col, w || 2.4); if (lab){ var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1; D.text(c, lab, p.X(x1) + dx / L * 14 * 1 + (dx >= 0 ? 4 : -4), p.Y(y1) - dy / L * 14 - (dy >= 0 ? 4 : -4), {size:13, color:col}); } }
function pt(c, p, x, y, col, lab, r, dx, dy){ D.dot(c, p.X(x), p.Y(y), r || 5, col); if (lab) D.text(c, lab, p.X(x) + (dx == null ? 12 : dx), p.Y(y) + (dy == null ? -12 : dy), {size:13, color:col}); }
function seg(c, p, x0, y0, x1, y1, col, w, dash){ D.line(c, p.X(x0), p.Y(y0), p.X(x1), p.Y(y1), col, w || 1.6, dash); }
function arc(c, p, x, y, r, a0, a1, col, w){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r, -a0, -a1, a1 > a0); ctx.stroke(); ctx.restore(); }
function circ(c, p, x, y, r, col, w, dash){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r * p.k, 0, 7); ctx.stroke(); ctx.restore(); }
/* points déplaçables : pts = [{x,y}] (coordonnées mathématiques), getP() → panneau courant ; on(i) après déplacement */
function dragPts(k, c, getP, pts, on, snap){
  var cur = -1; c.cv.style.touchAction = "none";
  function near(pp){ var P = getP(); if (!P) return -1; var b = 20, r = -1; pts.forEach(function(q, i){ if (q.fixed) return; var d = Math.hypot(P.X(q.x) - pp.x, P.Y(q.y) - pp.y); if (d < b){ b = d; r = i; } }); return r; }
  c.pointer(function(t, pp){
    if (t === "down"){ cur = near(pp); if (cur >= 0) c.cv.style.cursor = "grabbing"; }
    else if (t === "move"){ c.cv.style.cursor = near(pp) >= 0 ? "grab" : "default"; }
    else if (t === "drag" && cur >= 0){ var P = getP(), x = P.ix(pp.x), y = P.iy(pp.y); var s = snap && snap(); if (s){ x = Math.round(x / s) * s; y = Math.round(y / s) * s; } var q = pts[cur]; var lim = q.lim || 1e9; x = Math.max(-lim, Math.min(lim, x)); y = Math.max(-lim, Math.min(lim, y)); q.x = x; q.y = y; if (on) on(cur); k.redraw(); }
    else if (t === "up"){ cur = -1; c.cv.style.cursor = "default"; }
  });
}
/* vue 3D orthographique tournable à la souris (z vers le haut, repère direct) */
function View3(k, c, o){
  o = o || {}; var v = {az:o.az != null ? o.az : 0.75, el:o.el != null ? o.el : 0.5, s:40, ox:o.ox || 0, oy:o.oy || 0, oz:o.oz || 0, range:o.range || 5, yoff:o.yoff || 0, xoff:o.xoff || 0, bx:0, bw:0, handles:[]};
  /* téléphone : le dessin 3D est carré, pour rester lisible */
  var base = c.ratio || 0.72, r0 = c.resize;
  c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < 560) ? 1 : base; r0(); }; c.resize();
  v.fit = function(){ v.s = Math.min(c.W * 0.5, c.H * 0.6) / v.range; };
  v.p = function(x, y, z){ x -= v.ox; y -= v.oy; z -= v.oz; var ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.sin(v.el), X = x * ca - y * sa, Y = x * sa + y * ca; return {x:c.W / 2 + v.xoff + X * v.s, y:c.H / 2 + v.yoff - (z * ce + Y * se) * v.s, d:Y * ce - z * se}; };
  /* écran → point de l'espace à la hauteur z (pour glisser un point dans un plan horizontal) */
  v.inv = function(px, py, z){ var ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.max(0.2, Math.sin(v.el)), X = (px - c.W / 2 - v.xoff) / v.s, Y = ((c.H / 2 + v.yoff - py) / v.s - (z - v.oz) * ce) / se; return [X * ca + Y * sa + v.ox, -X * sa + Y * ca + v.oy]; };
  /* poignées : v.handles.push({get:function(){return [x,y,z];}, set:function(x, y){…}, col:"#…"}) ; v.hand() les dessine */
  v.hand = function(){ v.handles.forEach(function(h){ var q = h.get(), A = v.p(q[0], q[1], q[2]), ctx = c.ctx; ctx.save(); ctx.strokeStyle = h.col || "#0f1b2d"; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(A.x, A.y, 11, 0, 7); ctx.stroke(); ctx.restore(); }); };
  function nearH(pp){ var best = null, bd = 20; v.handles.forEach(function(h){ var q = h.get(), A = v.p(q[0], q[1], q[2]), d = Math.hypot(A.x - pp.x, A.y - pp.y); if (d < bd){ bd = d; best = h; } }); return best; }
  v.attach = function(hook){
    var last = null, own = false, hd = null; c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, pp){
      if (t === "down"){ hd = nearH(pp); if (hd){ c.cv.style.cursor = "grabbing"; last = pp; return; } own = !!(hook && hook("down", pp)); last = pp; }
      else if (t === "drag"){ if (hd){ var q = hd.get(), xy = v.inv(pp.x, pp.y, q[2]); hd.set(xy[0], xy[1]); k.redraw(); return; } if (own){ hook("drag", pp); k.redraw(); return; } if (last){ v.az += (pp.x - last.x) * 0.01; v.el = Math.max(0.03, Math.min(1.5, v.el + (pp.y - last.y) * 0.01)); last = pp; k.redraw(); } }
      else if (t === "up"){ if (own && hook) hook("up", pp); own = false; last = null; hd = null; c.cv.style.cursor = "grab"; }
      else if (t === "move"){ c.cv.style.cursor = nearH(pp) ? "pointer" : "grab"; if (hook) hook("move", pp); }
    });
  };
  var HL = "rgba(255,255,255,.9)";
  v.line = function(a, b, col, w, dash){ var A = v.p(a[0], a[1], a[2]), B = v.p(b[0], b[1], b[2]); D.line(c, A.x, A.y, B.x, B.y, col, w || 1.6, dash); };
  v.arrow = function(a, b, col, w, lab){ var A = v.p(a[0], a[1], a[2]), B = v.p(b[0], b[1], b[2]); if (Math.hypot(B.x - A.x, B.y - A.y) < 3) return; D.arrow(c, A.x, A.y, B.x, B.y, col, w || 2.6); if (lab){ var L = Math.hypot(B.x - A.x, B.y - A.y) || 1; D.text(c, lab, B.x + (B.x - A.x) / L * 14, B.y + (B.y - A.y) / L * 14, {size:14, color:col, halo:HL, math:true, weight:700}); } };
  v.dot = function(q, r, col, lab, dx, dy){ var A = v.p(q[0], q[1], q[2]); D.dot(c, A.x, A.y, r || 4.5, col); if (lab) D.text(c, lab, A.x + (dx == null ? 11 : dx), A.y + (dy == null ? -11 : dy), {size:13, color:col, halo:HL, math:true}); return A; };
  v.text = function(q, s, col, size){ var A = v.p(q[0], q[1], q[2]); D.text(c, s, A.x, A.y, {size:size || 13, color:col || C.ink, halo:HL, math:true}); };
  v.poly = function(pts, fill, stroke, w){ var ctx = c.ctx; ctx.beginPath(); pts.forEach(function(q, i){ var A = v.p(q[0], q[1], q[2]); if (i) ctx.lineTo(A.x, A.y); else ctx.moveTo(A.x, A.y); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.2; ctx.stroke(); } };
  v.axes = function(L, names, o2){ o2 = o2 || {}; var nm = names || ["x", "y", "z"]; var Lx = o2.Lx || L, Ly = o2.Ly || L, Lz = o2.Lz || L;
    if (o2.floor !== false){ var st = o2.step || 1; v.poly([[-Lx, -Ly, 0], [Lx, -Ly, 0], [Lx, Ly, 0], [-Lx, Ly, 0]], "rgba(31,75,158,.035)", null);
      for (var g = -Math.floor(Lx / st) * st; g <= Lx + 1e-9; g += st) v.line([g, -Ly, 0], [g, Ly, 0], "#e4e9f0", 1); for (g = -Math.floor(Ly / st) * st; g <= Ly + 1e-9; g += st) v.line([-Lx, g, 0], [Lx, g, 0], "#e4e9f0", 1); }
    v.arrow([-Lx, 0, 0], [Lx, 0, 0], "#5f6b7a", 1.4, nm[0]); v.arrow([0, -Ly, 0], [0, Ly, 0], "#5f6b7a", 1.4, nm[1]); v.arrow([0, 0, -Lz], [0, 0, Lz], "#5f6b7a", 1.4, nm[2]); };
  return v;
}
function dot3(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross3(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function norm3(a){ return Math.sqrt(dot3(a, a)); }
function add3(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub3(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul3(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function v3s(a, d){ return "(" + fx(a[0], d) + " ; " + fx(a[1], d) + " ; " + fx(a[2], d) + ")"; }
function rng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function autoRatio(c, wide, tall, thr){ var r0 = c.resize; c.resize = function(){ c.ratio = (c.cv.parentNode && c.cv.parentNode.clientWidth < (thr || 560)) ? tall : wide; r0(); }; c.resize(); }
var UM = {autoRatio:autoRatio, C:C, fx:fx, rgba:rgba, cstr:cstr, Pane:Pane, vec:vec, pt:pt, seg:seg, arc:arc, circ:circ, dragPts:dragPts, View3:View3, dot3:dot3, cross3:cross3, norm3:norm3, add3:add3, sub3:sub3, mul3:mul3, v3s:v3s, rng:rng};
window.UMB = UM;
})();

(function(){
var U = UMB, C = U.C, fx = U.fx, rgba = U.rgba, D = SFA.draw, F = SFA.fmt;
var PRE = {
  id:{a:1, b:0, c:0, d:1}, rot:{a:Math.round(Math.cos(Math.PI / 4) * 1000) / 1000, b:-Math.round(Math.sin(Math.PI / 4) * 1000) / 1000, c:Math.round(Math.sin(Math.PI / 4) * 1000) / 1000, d:Math.round(Math.cos(Math.PI / 4) * 1000) / 1000},
  dil:{a:2, b:0, c:0, d:0.5}, she:{a:1, b:1, c:0, d:1}, proj:{a:1, b:0, c:0, d:0}, ref:{a:1, b:0, c:0, d:-1}, sym:{a:2, b:1, c:1, d:2}, rotdil:{a:1, b:-1, c:1, d:1}, sing:{a:1, b:2, c:0.5, d:1}
};
/* valeurs propres réelles d'une matrice 2×2, vecteurs propres unitaires */
function eig(a, b, c, d){
  var T = a + d, Dt = a * d - b * c, dis = T * T - 4 * Dt, r = {T:T, D:Dt, dis:dis, real:dis >= -1e-12, vals:[], vecs:[]};
  if (!r.real) return r; var s = Math.sqrt(Math.max(0, dis)), l1 = (T + s) / 2, l2 = (T - s) / 2; r.vals = [l1, l2];
  r.scalar = Math.abs(b) < 1e-12 && Math.abs(c) < 1e-12 && Math.abs(a - d) < 1e-12;
  [l1, l2].forEach(function(l, i){ var v;
    if (r.scalar) v = i === 0 ? [1, 0] : [0, 1];
    else if (Math.abs(b) > 1e-12) v = [b, l - a]; else if (Math.abs(c) > 1e-12) v = [l - d, c]; else v = Math.abs(l - a) < 1e-12 ? [1, 0] : [0, 1];
    var n = Math.hypot(v[0], v[1]) || 1; r.vecs.push([v[0] / n, v[1] / n]); });
  return r;
}
function mat(a, b, c, d){ return "[[" + fx(a, 2) + " ; " + fx(b, 2) + "] ; [" + fx(c, 2) + " ; " + fx(d, 2) + "]]"; }
function clipPane(c, P, fn){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(P.bx, P.by, P.bw, P.bh); ctx.clip(); fn(ctx); ctx.restore(); }
var FSH = [[0.15, 0.05], [0.4, 0.05], [0.4, 0.4], [0.7, 0.4], [0.7, 0.6], [0.4, 0.6], [0.4, 0.8], [0.85, 0.8], [0.85, 0.95], [0.15, 0.95]];
function polyM(c, P, pts, a, b, cc, d, fill, stroke, w){ var ctx = c.ctx; ctx.beginPath(); pts.forEach(function(q, i){ var x = a * q[0] + b * q[1], y = cc * q[0] + d * q[1]; if (i) ctx.lineTo(P.X(x), P.Y(y)); else ctx.moveTo(P.X(x), P.Y(y)); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); } }

/* ---------- 1. une matrice déforme le plan ---------- */
SFA.sim({
  id:"um-c09-transformation-grille", ch:"c09", titre:"Une matrice déforme le plan : la grille, le carré, la lettre F", tag:"Applications linéaires",
  resume:"Les colonnes de A sont les images de e₁ et e₂ : déplace-les et vois toute la grille suivre, l'aire se multiplier par det A.",
  but:"Règle les quatre coefficients, choisis une transformation type ou fais glisser à la souris les pointes des flèches bleue (image de e₁) et violette (image de e₂). Le curseur t déroule la transformation de l'identité jusqu'à A. La lettre F montre l'orientation : elle est retournée quand det A < 0.",
  aRetenir:"Une application linéaire est entièrement déterminée par les images de e₁ et e₂ : ce sont les colonnes de A. Le carré unité devient un parallélogramme d'aire |det A|. Si det A = 0, le plan est écrasé sur une droite (ou un point).",
  piege:"« Les droites parallèles restent parallèles » et « l'origine reste fixe » sont vraies pour toute application linéaire ; une translation (x ↦ x + b) n'est donc pas linéaire.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.8}), P = null, ma = k.slider("a (ligne 1, col. 1)", -3, 3, 0.1, 1.5, ""), mb = k.slider("b (ligne 1, col. 2)", -3, 3, 0.1, 0.6, ""), mc = k.slider("c (ligne 2, col. 1)", -3, 3, 0.1, 0.4, ""), md = k.slider("d (ligne 2, col. 2)", -3, 3, 0.1, 1.2, "");
    var tt = k.slider("t : de l'identité (0) à A (1)", 0, 1, 0.01, 1, "");
    var pts = [{x:1.5, y:0.4, lim:3.6}, {x:0.6, y:1.2, lim:3.6}];
    k.select("Transformation type", [["", "— choisir —"], ["id", "Identité"], ["rot", "Rotation de 45°"], ["dil", "Dilatation (×2 sur x, ×½ sur y)"], ["she", "Cisaillement horizontal"], ["proj", "Projection sur l'axe x"], ["ref", "Réflexion d'axe x"], ["sym", "Symétrique [[2 ; 1] ; [1 ; 2]]"], ["rotdil", "Rotation-dilatation (√2 ; 45°)"], ["sing", "Matrice singulière (det = 0)"]], "", function(v){ var p = PRE[v]; if (!p) return; ma.set(p.a); mb.set(p.b); mc.set(p.c); md.set(p.d); tt.set(1); });
    var lp = k.loop(function(dt){ var v = tt.value + 0.5 * dt; if (v > 1) v = 0; tt.set(v); k.redraw(); });
    k.button("▶ Dérouler la transformation", function(){ if (lp.running) lp.pause(); else { if (tt.value >= 0.99) tt.set(0); lp.play(); } }, true);
    var tg = k.toggle("Montrer la grille image", true), tf = k.toggle("Montrer la lettre F", true);
    var ro = k.readouts(["Matrice A(t)", "det", "Aire du carré unité", "Trace", "Orientation"]); var nt = k.note("", "ok");
    dragPts(k, c, function(){ return P; }, pts, function(i){ var T = Math.max(tt.value, 0.001); void T; if (i === 0){ ma.set(Math.round(pts[0].x * 10) / 10); mc.set(Math.round(pts[0].y * 10) / 10); } else { mb.set(Math.round(pts[1].x * 10) / 10); md.set(Math.round(pts[1].y * 10) / 10); } tt.set(1); }, function(){ return 0.1; });
    function dragPts(k2, c2, getP, pp, on, snap){ var cur = -1; c2.cv.style.touchAction = "none";
      function near(q){ var Pq = getP(); if (!Pq) return -1; var b = 22, r = -1; pp.forEach(function(w, i){ var d = Math.hypot(Pq.X(w.x) - q.x, Pq.Y(w.y) - q.y); if (d < b){ b = d; r = i; } }); return r; }
      c2.pointer(function(t, q){ if (t === "down"){ cur = near(q); if (cur >= 0) c2.cv.style.cursor = "grabbing"; } else if (t === "move"){ c2.cv.style.cursor = near(q) >= 0 ? "grab" : "default"; }
        else if (t === "drag" && cur >= 0){ var Pq = getP(), x = Pq.ix(q.x), y = Pq.iy(q.y), s = snap(); x = Math.round(x / s) * s; y = Math.round(y / s) * s; x = Math.max(-3, Math.min(3, x)); y = Math.max(-3, Math.min(3, y)); pp[cur].x = x; pp[cur].y = y; on(cur); k2.redraw(); } else if (t === "up"){ cur = -1; c2.cv.style.cursor = "default"; } }); }
    k.draw(function(){
      c.clear(); var t = tt.value, a = 1 + t * (ma.value - 1), b = t * mb.value, cc = t * mc.value, d = 1 + t * (md.value - 1), ctx = c.ctx;
      P = U.Pane(c, 0, 0, c.W, c.H, 4.6 * c.W / c.H, 4.6, {step:1, ticks:true});
      var n = 12; pts[0].x = ma.value; pts[0].y = mc.value; pts[1].x = mb.value; pts[1].y = md.value;
      clipPane(c, P, function(){
        polyM(c, P, [[0, 0], [1, 0], [1, 1], [0, 1]], 1, 0, 0, 1, "rgba(138,149,163,.10)", "rgba(138,149,163,.55)", 1.2);
        if (tf.value) polyM(c, P, FSH, 1, 0, 0, 1, "rgba(138,149,163,.28)", "rgba(95,107,122,.8)", 1.2);
        if (tg.value){ ctx.lineWidth = 1.1; for (var i = -n; i <= n; i++){ ctx.strokeStyle = i === 0 ? "rgba(30,63,143,.9)" : "rgba(30,63,143,.28)"; ctx.beginPath(); ctx.moveTo(P.X(a * -n + b * i), P.Y(cc * -n + d * i)); ctx.lineTo(P.X(a * n + b * i), P.Y(cc * n + d * i)); ctx.stroke();
            ctx.strokeStyle = i === 0 ? "rgba(91,33,182,.9)" : "rgba(91,33,182,.28)"; ctx.beginPath(); ctx.moveTo(P.X(a * i - b * n), P.Y(cc * i - d * n)); ctx.lineTo(P.X(a * i + b * n), P.Y(cc * i + d * n)); ctx.stroke(); } }
        var det = a * d - b * cc, pos = det >= 0;
        polyM(c, P, [[0, 0], [1, 0], [1, 1], [0, 1]], a, b, cc, d, rgba(pos ? C.amber : C.red, 0.2), pos ? C.amber : C.red, 2.2);
        if (tf.value) polyM(c, P, FSH, a, b, cc, d, rgba(pos ? C.green : C.red, 0.55), pos ? C.green : C.red, 1.6);
        U.vec(c, P, 0, 0, a, cc, C.blue, 3.2); U.vec(c, P, 0, 0, b, d, C.violet, 3.2); U.vec(c, P, 0, 0, 1, 0, rgba(C.blue, .35), 1.6); U.vec(c, P, 0, 0, 0, 1, rgba(C.violet, .35), 1.6);
      });
      var det2 = a * d - b * cc; D.dot(c, P.X(a), P.Y(cc), 7, C.blue); D.dot(c, P.X(b), P.Y(d), 7, C.violet);
      D.text(c, "A e₁ = (" + fx(a, 1) + " ; " + fx(cc, 1) + ")", P.X(a) + 12, P.Y(cc) + 16, {size:12, color:C.blue, align:"left", bg:"rgba(255,255,255,.8)"}); D.text(c, "A e₂ = (" + fx(b, 1) + " ; " + fx(d, 1) + ")", P.X(b) + 12, P.Y(d) - 14, {size:12, color:C.violet, align:"left", bg:"rgba(255,255,255,.8)"});
      ro.set(0, mat(a, b, cc, d)); ro.set(1, fx(det2, 3)); ro.set(2, fx(Math.abs(det2), 3)); ro.set(3, fx(a + d, 2)); ro.set(4, Math.abs(det2) < 1e-6 ? "écrasé" : det2 > 0 ? "conservée" : "retournée");
      if (Math.abs(det2) < 1e-3) nt.set("det = 0 : le plan est écrasé sur une droite. La matrice n'est pas inversible : on ne peut pas retrouver le point de départ.", "warn");
      else if (det2 < 0) nt.set("det < 0 : l'orientation est inversée (la lettre F est vue dans un miroir). L'aire est multipliée par |det| = " + fx(Math.abs(det2), 2) + ".", "ok");
      else nt.set("det > 0 : l'orientation est conservée ; toutes les aires sont multipliées par " + fx(det2, 2) + ".", "ok");
    });
  }
});

/* ---------- 2. vecteurs propres : directions conservées ---------- */
SFA.sim({
  id:"um-c09-vecteurs-propres", ch:"c09", titre:"Vecteurs propres : les directions que la matrice ne fait pas tourner", tag:"Valeurs et vecteurs propres",
  resume:"Fais tourner un vecteur v : sauf pour quelques directions, Av n'est pas aligné avec v. Les directions alignées sont les vecteurs propres.",
  but:"Fais tourner v (curseur θ ou animation). Le graphe de droite donne le sinus de l'angle entre v et Av : il s'annule exactement aux directions propres. L'ellipse est l'image du cercle unité. Quand v est propre, Av = λv : le rapport ‖Av‖/‖v‖ vaut |λ|.",
  aRetenir:"Av = λv avec v ≠ 0 : v est un vecteur propre, λ la valeur propre associée. Les valeurs propres sont les racines de det(A − λI) = 0. Si la matrice est une rotation (sans direction conservée), les valeurs propres sont complexes.",
  piege:"Un vecteur propre est une direction : tout multiple non nul de v est encore propre. Le vecteur nul n'est jamais un vecteur propre.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.02}), P = null;
    var ma = k.slider("a", -3, 3, 0.1, 2, ""), mb = k.slider("b", -3, 3, 0.1, 1, ""), mc = k.slider("c", -3, 3, 0.1, 1, ""), md = k.slider("d", -3, 3, 0.1, 2, ""), th = k.slider("Direction de v : θ", 0, 360, 1, 20, "°");
    k.select("Matrice type", [["", "— choisir —"], ["sym", "Symétrique [[2 ; 1] ; [1 ; 2]]"], ["dil", "Dilatation [[2 ; 0] ; [0 ; 0,5]]"], ["she", "Cisaillement [[1 ; 1] ; [0 ; 1]]"], ["rot", "Rotation de 45° (aucune direction propre)"], ["ref", "Réflexion [[1 ; 0] ; [0 ; −1]]"], ["sing", "Singulière [[1 ; 2] ; [0,5 ; 1]]"]], "", function(v){ var p = PRE[v]; if (p){ ma.set(p.a); mb.set(p.b); mc.set(p.c); md.set(p.d); } });
    var lp = k.loop(function(dt){ var v = th.value + 30 * dt; if (v > 360) v -= 360; th.set(v); k.redraw(); }); k.button("▶ Faire tourner v", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var tl = k.toggle("Montrer les droites propres", true), te = k.toggle("Montrer l'image du cercle unité", true);
    var ro = k.readouts(["Valeurs propres", "Angle entre v et Av", "‖Av‖ / ‖v‖", "Av = λv ?"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, a = ma.value, b = mb.value, cc = mc.value, d = md.value, E = eig(a, b, cc, d), w1 = Math.round(H * 0.6);
      P = U.Pane(c, 0, 0, W, w1, 4.4 * W / w1, 4.4, {step:1}); var al = th.value * Math.PI / 180, v = [Math.cos(al) * 2, Math.sin(al) * 2], Av = [a * v[0] + b * v[1], cc * v[0] + d * v[1]];
      clipPane(c, P, function(){
        if (tl.value && E.real && !E.scalar) E.vecs.forEach(function(e, i){ U.seg(c, P, -e[0] * 9, -e[1] * 9, e[0] * 9, e[1] * 9, rgba(i ? C.teal : C.green, .55), 2.2, [7, 5]); });
        if (te.value){ ctx.strokeStyle = rgba(C.grey, .6); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(P.X(0), P.Y(0), P.k, 0, 7); ctx.stroke(); ctx.strokeStyle = rgba(C.amber, .8); ctx.lineWidth = 2; ctx.beginPath(); for (var i = 0; i <= 120; i++){ var q = i / 120 * 2 * Math.PI, x = Math.cos(q), y = Math.sin(q); var X = P.X(a * x + b * y), Y = P.Y(cc * x + d * y); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke(); }
        U.vec(c, P, 0, 0, v[0], v[1], C.blue, 3.2); U.vec(c, P, 0, 0, Av[0], Av[1], C.red, 3.2);
      });
      D.text(c, "v", P.X(v[0]) + 12, P.Y(v[1]) - 10, {size:14, color:C.blue}); D.text(c, "Av", P.X(Av[0]) + 14, P.Y(Av[1]) - 10, {size:14, color:C.red});
      var nv = Math.hypot(v[0], v[1]), nA = Math.hypot(Av[0], Av[1]), sn = nA < 1e-9 ? 0 : (v[0] * Av[1] - v[1] * Av[0]) / (nv * nA), cs = nA < 1e-9 ? 1 : (v[0] * Av[0] + v[1] * Av[1]) / (nv * nA), ang = Math.atan2(sn, cs);
      /* graphe de sin(angle) en fonction de θ */
      var gx = 14, gw = W - 28, gy = w1 + (H - w1) * 0.5 + 4, gh = (H - w1) * 0.28; ctx.save(); ctx.strokeStyle = C.light; ctx.lineWidth = 1; ctx.strokeRect(gx, gy - gh, gw, 2 * gh); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.strokeStyle = C.grey; ctx.stroke();
      ctx.strokeStyle = C.violet; ctx.lineWidth = 2.2; ctx.beginPath(); for (var j = 0; j <= 360; j += 2){ var q2 = j * Math.PI / 180, vx = Math.cos(q2), vy = Math.sin(q2), ax = a * vx + b * vy, ay = cc * vx + d * vy, na = Math.hypot(ax, ay), s2 = na < 1e-9 ? 0 : (vx * ay - vy * ax) / na; var X2 = gx + j / 360 * gw, Y2 = gy - s2 * gh; if (j) ctx.lineTo(X2, Y2); else ctx.moveTo(X2, Y2); } ctx.stroke();
      if (E.real && !E.scalar) E.vecs.forEach(function(e, i){ [0, 180].forEach(function(o){ var dg = (Math.atan2(e[1], e[0]) * 180 / Math.PI + o + 360) % 360; D.dot(c, gx + dg / 360 * gw, gy, 5.5, i ? C.teal : C.green); }); });
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(gx + th.value / 360 * gw, gy - sn * gh, 5, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(C.red, .3); ctx.beginPath(); ctx.moveTo(gx + th.value / 360 * gw, gy - gh); ctx.lineTo(gx + th.value / 360 * gw, gy + gh); ctx.stroke(); ctx.restore();
      D.text(c, "sin(angle entre v et Av) selon θ", gx + gw / 2, gy - gh - 9, {size:12, color:C.violet}); D.text(c, "0°", gx + 8, gy + gh + 12, {size:11, color:C.grey}); D.text(c, "360°", gx + gw - 10, gy + gh + 12, {size:11, color:C.grey}); D.text(c, "points = directions propres (θ et θ + 180°)", gx + gw / 2, gy + gh + 12, {size:11, color:C.green});
      var aligned = nA > 1e-9 && Math.abs(sn) < 0.02;
      ro.set(0, E.real ? (E.scalar || Math.abs(E.vals[0] - E.vals[1]) < 1e-9 ? "λ = " + fx(E.vals[0], 3) + " (double)" : fx(E.vals[0], 3) + " et " + fx(E.vals[1], 3)) : "complexes : " + fx(E.T / 2, 2) + " ± " + fx(Math.sqrt(-E.dis) / 2, 2) + " i");
      ro.set(1, nA < 1e-9 ? "Av = 0" : fx(ang * 180 / Math.PI, 1) + "°"); ro.set(2, nA < 1e-9 ? "0" : fx(nA / nv, 3)); ro.set(3, aligned ? (cs > 0 ? "oui, λ ≈ " + fx(nA / nv, 2) : "oui, λ ≈ " + fx(-nA / nv, 2)) : "non");
      if (!E.real) nt.set("Δ = " + fx(E.dis, 2) + " < 0 : aucune direction réelle n'est conservée (le graphe ne coupe jamais l'axe). Les valeurs propres sont complexes conjuguées.", "warn");
      else if (E.scalar) nt.set("Matrice scalaire : toutes les directions sont propres, λ = " + fx(E.vals[0], 2) + ".", "ok");
      else if (aligned) nt.set("v est un vecteur propre : Av est sur la même droite que v, étiré du facteur λ.", "ok");
      else nt.set("Pour cette direction, Av tourne par rapport à v. Cherche les points verts/bleus du graphe : ce sont les directions propres.", "ok");
    });
  }
});

/* ---------- 3. polynôme caractéristique et diagramme trace-déterminant ---------- */
function plot2(c, bx, by, bw, bh, x0, x1, y0, y1, sx, sy, xl){
  var ctx = c.ctx, p = {bx:bx, by:by, bw:bw, bh:bh}; p.X = function(x){ return bx + (x - x0) / (x1 - x0) * bw; }; p.Y = function(y){ return by + bh - (y - y0) / (y1 - y0) * bh; }; p.ix = function(px){ return x0 + (px - bx) / bw * (x1 - x0); }; p.iy = function(py){ return y0 + (by + bh - py) / bh * (y1 - y0); };
  ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); ctx.fillStyle = "#fff"; ctx.fillRect(bx, by, bw, bh); var v; ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1; ctx.beginPath();
  for (v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx){ ctx.moveTo(p.X(v), by); ctx.lineTo(p.X(v), by + bh); } for (v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy){ ctx.moveTo(bx, p.Y(v)); ctx.lineTo(bx + bw, p.Y(v)); } ctx.stroke();
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(bx, p.Y(0)); ctx.lineTo(bx + bw, p.Y(0)); ctx.moveTo(p.X(0), by); ctx.lineTo(p.X(0), by + bh); ctx.stroke();
  ctx.fillStyle = "#5f6b7a"; ctx.font = "600 10px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top"; for (v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx){ if (Math.abs(v) > 1e-9) ctx.fillText(F(v, 0), p.X(v), p.Y(0) + 3); }
  ctx.textAlign = "left"; ctx.textBaseline = "middle"; for (v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy){ if (Math.abs(v) > 1e-9) ctx.fillText(F(v, 0), p.X(0) + 3, p.Y(v)); }
  ctx.restore(); if (xl) D.text(c, xl, bx + bw - 10, p.Y(0) - 10, {size:12, color:C.grey}); return p;
}
SFA.sim({
  id:"um-c09-polynome-caracteristique", ch:"c09", titre:"Polynôme caractéristique, trace et déterminant", tag:"Valeurs et vecteurs propres",
  resume:"Les valeurs propres sont les racines de λ² − Tλ + D : leur somme est la trace, leur produit le déterminant.",
  but:"Change les coefficients de A et regarde la parabole p(λ) = det(A − λI) = λ² − Tλ + D : ses zéros sont les valeurs propres. En dessous, le point (T ; D) se place par rapport à la parabole D = T²/4 : au-dessus, les valeurs propres sont complexes. Tu peux aussi glisser ce point (la matrice devient alors [[0 ; 1] ; [−D ; T]]).",
  aRetenir:"det(A − λI) = λ² − (tr A)λ + det A. Δ = T² − 4D : Δ > 0 deux valeurs propres réelles, Δ = 0 une double, Δ < 0 deux complexes conjuguées. λ₁ + λ₂ = T et λ₁λ₂ = D.",
  piege:"On ne trouve pas les valeurs propres en regardant la diagonale de A : ce n'est vrai que pour une matrice triangulaire (ou diagonale).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.1}), P2 = null, ma = k.slider("a", -4, 4, 0.1, 2, ""), mb = k.slider("b", -4, 4, 0.1, 1, ""), mc = k.slider("c", -9, 9, 0.1, -1, ""), md = k.slider("d", -6, 6, 0.1, 3, "");
    k.select("Exemple", [["", "— choisir —"], ["sym", "Symétrique : valeurs propres 1 et 3"], ["rot", "Rotation : valeurs propres complexes"], ["tri", "Triangulaire : λ lues sur la diagonale"], ["dbl", "Valeur propre double (Δ = 0)"], ["selle", "D < 0 : une positive, une négative"]], "", function(v){ var m = {sym:[2, 1, 1, 2], rot:[0.7, -0.7, 0.7, 0.7], tri:[3, 2, 0, -1], dbl:[2, 1, -1, 4], selle:[1, 2, 3, 0]}[v]; if (m){ ma.set(m[0]); mb.set(m[1]); mc.set(m[2]); md.set(m[3]); } });
    var ro = k.readouts(["T = trace", "D = déterminant", "Δ = T² − 4D", "Valeurs propres", "Somme et produit"]); var nt = k.note("", "ok");
    var gd = k.toggle("Défi : fabrique une matrice de valeurs propres 1 et 4 (T = 5, D = 4)", false); U.autoRatio(c, 1.1, 1.3);
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (!P2) return; if (t === "down" || t === "drag"){ if (p.y < P2.by) return; var T = Math.max(-6, Math.min(6, P2.ix(p.x))), Dt = Math.max(-9, Math.min(9, P2.iy(p.y))); T = Math.round(T * 10) / 10; Dt = Math.round(Dt * 10) / 10; ma.set(0); mb.set(1); mc.set(-Dt); md.set(T); k.redraw(); } });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, a = ma.value, b = mb.value, cc = mc.value, d = md.value, E = eig(a, b, cc, d), T = E.T, Dt = E.D, h1 = Math.round(H * 0.5) - 4, i;
      var P1 = plot2(c, 0, 0, W, h1, -5, 5, -8, 12, 1, 2, "λ");
      clipPane(c, P1, function(){ ctx.strokeStyle = C.blue; ctx.lineWidth = 3; ctx.beginPath(); for (i = -300; i <= 300; i++){ var l = i / 60, v = l * l - T * l + Dt; var X = P1.X(l), Y = P1.Y(v); if (i === -300) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke(); });
      D.text(c, "p(λ) = λ² " + (T >= 0 ? "− " : "+ ") + fx(Math.abs(T), 1) + "λ " + (Dt >= 0 ? "+ " : "− ") + fx(Math.abs(Dt), 1), 10, 16, {size:13, color:C.blue, align:"left", bg:"rgba(255,255,255,.85)"});
      if (E.real){ E.vals.forEach(function(l, i2){ if (Math.abs(l) <= 5){ D.dot(c, P1.X(l), P1.Y(0), 6.5, i2 ? C.teal : C.green); D.text(c, "λ = " + fx(l, 2), P1.X(l), P1.Y(0) + (i2 ? 24 : 20), {size:12, color:i2 ? C.teal : C.green, bg:"rgba(255,255,255,.85)"}); } }); }
      else D.text(c, "p ne coupe pas l'axe : pas de racine réelle", W * 0.62, P1.Y(-4.5), {size:12, color:C.red, bg:"rgba(255,255,255,.85)"});
      var by2 = h1 + 8; P2 = plot2(c, 0, by2, W, H - by2, -6, 6, -9, 9, 1, 3, "T"); var Q = P2;
      clipPane(c, Q, function(){ ctx.fillStyle = rgba(C.red, .07); ctx.beginPath(); for (i = -60; i <= 60; i++){ var tt = i / 10, X = Q.X(tt), Y = Q.Y(tt * tt / 4); if (i === -60) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.lineTo(Q.X(6), Q.by); ctx.lineTo(Q.X(-6), Q.by); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = C.violet; ctx.lineWidth = 2.4; ctx.beginPath(); for (i = -60; i <= 60; i++){ var t2 = i / 10, X2 = Q.X(t2), Y2 = Q.Y(t2 * t2 / 4); if (i === -60) ctx.moveTo(X2, Y2); else ctx.lineTo(X2, Y2); } ctx.stroke(); });
      D.text(c, "plan (T ; D) : glisse le point", 10, Q.by + 14, {size:12, color:C.violet, align:"left", bg:"rgba(255,255,255,.85)"}); D.text(c, "D", Q.X(0) + 10, Q.by + 12, {size:12, color:C.grey});
      D.text(c, "Δ < 0 : complexes", Q.X(-2.2), Q.Y(6.6), {size:11, color:C.red}); D.text(c, "Δ > 0 : réelles", Q.X(2.8), Q.Y(-6.5), {size:11, color:C.green}); D.text(c, "Δ = 0", Q.X(4.6), Q.Y(6.4), {size:11, color:C.violet});
      var cx2 = Math.max(-6, Math.min(6, T)), cy2 = Math.max(-9, Math.min(9, Dt)); D.dot(c, Q.X(cx2), Q.Y(cy2), 8, E.real ? C.green : C.red); if (cx2 !== T || cy2 !== Dt) D.text(c, "(hors cadre)", Q.X(cx2), Q.Y(cy2) + (cy2 > 0 ? 18 : -14), {size:10, color:C.grey});
      if (gd.value){ var okg = Math.abs(T - 5) < 0.06 && Math.abs(Dt - 4) < 0.06; D.dot(c, Q.X(5), Q.Y(4), 10, "rgba(244,197,66,.0)"); ctx.save(); ctx.strokeStyle = okg ? C.green : C.amber; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(Q.X(5), Q.Y(4), 13, 0, 7); ctx.stroke(); ctx.restore(); }
      ro.set(0, fx(T, 2)); ro.set(1, fx(Dt, 2)); ro.set(2, fx(E.dis, 2));
      if (gd.value){ var okg2 = Math.abs(T - 5) < 0.06 && Math.abs(Dt - 4) < 0.06; nt.set(okg2 ? "Réussi : λ² − 5λ + 4 = (λ − 1)(λ − 4). Somme 5 = T, produit 4 = D." : "Cible ◎ : T = 5, D = 4. Il te manque " + fx(5 - T, 1) + " sur T et " + fx(4 - Dt, 1) + " sur D. Glisse le point du plan (T ; D).", okg2 ? "ok" : "warn"); }
      if (E.real){ ro.set(3, Math.abs(E.vals[0] - E.vals[1]) < 1e-9 ? fx(E.vals[0], 3) + " (double)" : fx(E.vals[0], 3) + " ; " + fx(E.vals[1], 3)); ro.set(4, fx(E.vals[0] + E.vals[1], 2) + " = T ; " + fx(E.vals[0] * E.vals[1], 2) + " = D"); if (!gd.value) nt.set(Math.abs(E.dis) < 1e-9 ? "Δ = 0 : valeur propre double." : Dt < 0 ? "D < 0 : les deux valeurs propres sont de signes opposés (une dilatation et un retournement de direction)." : "Δ > 0 : deux valeurs propres réelles distinctes.", "ok"); }
      else { ro.set(3, fx(T / 2, 2) + " ± " + fx(Math.sqrt(-E.dis) / 2, 2) + " i"); ro.set(4, "2·Re = " + fx(T, 2) + " ; |λ|² = " + fx(Dt, 2)); if (!gd.value) nt.set("Δ < 0 : valeurs propres complexes conjuguées ; la matrice tourne (module √D = " + fx(Math.sqrt(Math.max(Dt, 0)), 2) + ").", "warn"); }
    });
  }
});

/* ---------- 4. puissances de matrices ---------- */
SFA.sim({
  id:"um-c09-puissances-diagonalisation", ch:"c09", titre:"Diagonaliser, c'est calculer Aⁿ sans effort", tag:"Diagonalisation",
  resume:"Décompose un point de départ sur les vecteurs propres : chaque composante est simplement multipliée par λⁿ à chaque étape.",
  but:"Fais glisser le point de départ x₀ (ou règle la matrice). Le curseur n fait avancer le système : xₙ = Aⁿx₀. Les deux flèches vertes et bleues sont les composantes de xₙ sur les vecteurs propres : elles valent c₁λ₁ⁿ v₁ et c₂λ₂ⁿ v₂. La plus grande valeur propre en module finit par dominer.",
  aRetenir:"Si A = P D P⁻¹ avec D = diag(λ₁, λ₂), alors Aⁿ = P Dⁿ P⁻¹. Pour x₀ = c₁v₁ + c₂v₂ : Aⁿx₀ = c₁λ₁ⁿ v₁ + c₂λ₂ⁿ v₂. Si |λ₁| > |λ₂|, xₙ s'aligne sur v₁ ; |λ| < 1 contracte, |λ| > 1 dilate.",
  piege:"Toutes les matrices ne sont pas diagonalisables : [[1 ; 1] ; [0 ; 1]] a une seule direction propre. Et (A + B)ⁿ ≠ Aⁿ + Bⁿ en général : seule la puissance d'une matrice diagonale se calcule terme à terme.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.85}), P = null, ma = k.slider("a", -2, 2, 0.05, 1.1, ""), mb = k.slider("b", -2, 2, 0.05, 0.3, ""), mc = k.slider("c", -2, 2, 0.05, 0.2, ""), md = k.slider("d", -2, 2, 0.05, 0.9, ""), nn = k.slider("n (nombre d'itérations)", 0, 20, 1, 3, "");
    var x0 = {x:1.5, y:-2, lim:20};
    k.select("Matrice type", [["", "— choisir —"], ["a", "Croissance vers une direction (λ = 1,26 et 0,74)"], ["b", "Convergence vers 0 (|λ| < 1)"], ["c", "Selle (une dilate, une contracte)"], ["d", "Markov : [[0,9 ; 0,2] ; [0,1 ; 0,8]]"], ["e", "Non diagonalisable [[1 ; 1] ; [0 ; 1]]"], ["f", "Valeurs propres complexes"]], "", function(v){ var m = {a:[1.1, 0.3, 0.2, 0.9], b:[0.6, 0.2, 0.1, 0.5], c:[1.5, 0, 0, 0.5], d:[0.9, 0.2, 0.1, 0.8], e:[1, 1, 0, 1], f:[0.9, -0.5, 0.5, 0.9]}[v]; if (m){ ma.set(m[0]); mb.set(m[1]); mc.set(m[2]); md.set(m[3]); } });
    var lp = k.loop(function(dt, t){ if (t - (lp._t || 0) > 0.7){ lp._t = t; var v = nn.value + 1; if (v > 20) v = 0; nn.set(v); k.redraw(); } }); k.button("▶ Animer les itérations", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var te = k.toggle("Montrer les composantes sur les vecteurs propres", true), ttr = k.toggle("Montrer toute la trajectoire", true);
    var ro = k.readouts(["Valeurs propres", "Coordonnées c₁ ; c₂", "xₙ = Aⁿx₀", "‖xₙ‖"]); var nt = k.note("", "ok");
    U.dragPts(k, c, function(){ return P; }, [x0], function(){ k.redraw(); }, function(){ return 0.25; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, a = ma.value, b = mb.value, cc = mc.value, d = md.value, n = Math.round(nn.value), E = eig(a, b, cc, d), orb = [[x0.x, x0.y]], i, mx = 4;
      for (i = 1; i <= 20; i++){ var q = orb[i - 1]; orb.push([a * q[0] + b * q[1], cc * q[0] + d * q[1]]); } for (i = 0; i <= n; i++) mx = Math.max(mx, Math.abs(orb[i][0]) * 1.15, Math.abs(orb[i][1]) * 1.15); mx = Math.min(mx, 60);
      P = U.Pane(c, 0, 0, c.W, c.H, mx * c.W / c.H, mx, {step:mx > 24 ? 10 : mx > 11 ? 5 : mx > 5.5 ? 2 : 1});
      var xn = orb[n], diag = E.real && !E.scalar && Math.abs(E.vals[0] - E.vals[1]) > 1e-9, c1 = 0, c2 = 0;
      if (diag){ var v1 = E.vecs[0], v2 = E.vecs[1], det = v1[0] * v2[1] - v1[1] * v2[0]; c1 = (x0.x * v2[1] - x0.y * v2[0]) / det; c2 = (v1[0] * x0.y - v1[1] * x0.x) / det; }
      clipPane(c, P, function(){
        if (diag) E.vecs.forEach(function(e, j){ U.seg(c, P, -e[0] * 90, -e[1] * 90, e[0] * 90, e[1] * 90, rgba(j ? C.teal : C.green, .45), 2, [7, 5]); });
        if (ttr.value){ ctx.strokeStyle = rgba(C.grey, .7); ctx.lineWidth = 1.4; ctx.beginPath(); for (i = 0; i <= n; i++){ var X = P.X(orb[i][0]), Y = P.Y(orb[i][1]); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke(); }
        for (i = 0; i <= n; i++){ var al = i === n ? 1 : 0.25 + 0.5 * i / Math.max(n, 1); D.dot(c, P.X(orb[i][0]), P.Y(orb[i][1]), i === n ? 6.5 : 3.6, i === 0 ? rgba(C.blue, 1) : rgba(C.red, al)); }
        if (diag && te.value){ var l1n = Math.pow(E.vals[0], n), l2n = Math.pow(E.vals[1], n), p1 = [c1 * l1n * E.vecs[0][0], c1 * l1n * E.vecs[0][1]], p2 = [c2 * l2n * E.vecs[1][0], c2 * l2n * E.vecs[1][1]];
          U.vec(c, P, 0, 0, p1[0], p1[1], C.green, 3); U.vec(c, P, 0, 0, p2[0], p2[1], C.teal, 3); U.seg(c, P, p1[0], p1[1], p1[0] + p2[0], p1[1] + p2[1], rgba(C.teal, .5), 1.2, [4, 3]); U.seg(c, P, p2[0], p2[1], p1[0] + p2[0], p1[1] + p2[1], rgba(C.green, .5), 1.2, [4, 3]); }
      });
      D.text(c, "x₀", P.X(x0.x) + 14, P.Y(x0.y) - 12, {size:13, color:C.blue}); D.text(c, "x" + (n === 1 ? "₁" : "ₙ"), P.X(xn[0]) + 14, P.Y(xn[1]) - 12, {size:13, color:C.red});
      ro.set(0, E.real ? fx(E.vals[0], 3) + " ; " + fx(E.vals[1], 3) : "complexes (|λ| = " + fx(Math.sqrt(Math.max(E.D, 0)), 3) + ")"); ro.set(1, diag ? fx(c1, 3) + " ; " + fx(c2, 3) : "—"); ro.set(2, "(" + fx(xn[0], 2) + " ; " + fx(xn[1], 2) + ")"); ro.set(3, fx(Math.hypot(xn[0], xn[1]), 3));
      if (!E.real) nt.set("Valeurs propres complexes : pas de diagonalisation réelle ; le point tourne en spirale (module |λ|ⁿ = " + fx(Math.pow(Math.sqrt(Math.max(E.D, 0)), n), 3) + ").", "warn");
      else if (!diag) nt.set(E.scalar ? "Matrice scalaire : A = λI, Aⁿ = λⁿI." : "Valeur propre double sans deuxième direction propre : A n'est pas diagonalisable.", "warn");
      else nt.set("x₀ = " + fx(c1, 2) + "·v₁ + " + fx(c2, 2) + "·v₂ ; après " + n + " étapes : " + fx(c1 * Math.pow(E.vals[0], n), 2) + "·v₁ + " + fx(c2 * Math.pow(E.vals[1], n), 2) + "·v₂. " + (Math.abs(E.vals[0]) > Math.abs(E.vals[1]) ? "v₁ (λ₁ = " + fx(E.vals[0], 2) + ") domine." : Math.abs(E.vals[0]) < Math.abs(E.vals[1]) ? "v₂ domine." : "Les deux modules sont égaux."), "ok");
    });
  }
});

/* ---------- 5. modèle de Leslie ---------- */
SFA.sim({
  id:"um-c09-leslie", ch:"c09", titre:"Une population par classes d'âge : le modèle de Leslie", tag:"Applications",
  resume:"Trois classes d'âge évoluent par une matrice de Leslie ; la valeur propre dominante donne le taux de croissance, son vecteur propre la répartition stable.",
  but:"Règle la fécondité et la survie de chaque classe, puis lance la simulation. La population totale finit par croître (ou décroître) à un taux constant λ, et les proportions des trois classes se stabilisent, quelle que soit la population de départ. Modèle simplifié : pas de variations aléatoires, ressources illimitées.",
  aRetenir:"Nₙ₊₁ = L·Nₙ avec L = [[0 ; f₂ ; f₃] ; [s₁ ; 0 ; 0] ; [0 ; s₂ ; 0]]. À long terme, Nₙ ≈ c·λⁿ·v où λ est la valeur propre dominante et v le vecteur propre associé (répartition stable). λ > 1 : croissance ; λ < 1 : extinction ; λ = 1 : équilibre.",
  piege:"Une fécondité élevée ne garantit pas la croissance : c'est la survie jusqu'à l'âge adulte (s₁, s₂) qui compte autant. Le taux de croissance est λ − 1, pas le nombre moyen de petits par femelle.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.98}), GM = 40, P = D.palette;
    U.autoRatio(c, 0.98, 1.75);
    var f2 = k.slider("Fécondité des adultes f₂", 0, 5, 0.1, 3, "jeunes/adulte"), f3 = k.slider("Fécondité des âgés f₃", 0, 5, 0.1, 2, "jeunes/âgé"), s1 = k.slider("Survie jeune → adulte s₁", 0, 1, 0.05, 0.5, ""), s2 = k.slider("Survie adulte → âgé s₂", 0, 1, 0.05, 0.4, "");
    var n0a = k.slider("Départ : jeunes", 0, 200, 5, 20, ""), n0b = k.slider("Départ : adultes", 0, 200, 5, 20, ""), n0c = k.slider("Départ : âgés", 0, 200, 5, 160, "");
    var gs = k.slider("Génération affichée n", 0, GM, 1, 0, ""), acc = 0;
    var lp = k.loop(function(dt){ acc += dt; if (acc > 0.4){ acc = 0; var v = gs.value + 1; if (v > GM) v = 0; gs.set(v); k.redraw(); } });
    k.button("▶ Lancer / pause", function(){ if (lp.running) lp.pause(); else lp.play(); }, true); k.button("↺ Revenir à n = 0", function(){ gs.set(0); lp.pause(); });
    k.select("Scénario", [["", "— choisir —"], ["a", "Population en croissance"], ["b", "Population en déclin"], ["c", "Équilibre (λ = 1)"], ["d", "Survie des jeunes faible"]], "", function(v){ var m = {a:[3, 2, 0.5, 0.4], b:[1.5, 1, 0.4, 0.3], c:[1.2, 1.6, 0.5, 0.5], d:[4, 3, 0.1, 0.5]}[v]; if (m){ f2.set(m[0]); f3.set(m[1]); s1.set(m[2]); s2.set(m[3]); gs.set(0); } });
    var ro = k.readouts(["Génération n", "Population totale", "λ dominante", "Croissance par génération", "Répartition stable", "Répartition actuelle"]); var nt = k.note("", "ok");
    function lam(){ var a = f2.value * s1.value, b = f3.value * s1.value * s2.value, lo = 0, hi = 1 + Math.max(a, b) + 1, i; for (i = 0; i < 80; i++){ var m = (lo + hi) / 2; if (m * m * m - a * m - b < 0) lo = m; else hi = m; } return (lo + hi) / 2; }
    function orbit(){ var h = [[n0a.value, n0b.value, n0c.value]]; for (var i = 1; i <= GM; i++){ var q = h[i - 1]; h.push([f2.value * q[1] + f3.value * q[2], s1.value * q[0], s2.value * q[1]]); } return h; }
    function carrow(ctx, x0, y0, cx, cy, x1, y1, col, w){ ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke(); var a = Math.atan2(y1 - cy, x1 - cx), h = 8 + w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - h * Math.cos(a - 0.4), y1 - h * Math.sin(a - 0.4)); ctx.lineTo(x1 - h * Math.cos(a + 0.4), y1 - h * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill(); ctx.restore(); }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if ((t === "down" || t === "drag") && p.y > c.H * 0.36){ var gx = 44, gw = c.W - gx - 14; gs.set(Math.max(0, Math.min(GM, Math.round((p.x - gx) / gw * GM)))); k.redraw(); } });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, hist = orbit(), g = Math.round(gs.value), cur = hist[g], tot = cur[0] + cur[1] + cur[2], L = lam(), v1 = 1, v2 = s1.value / L, v3 = s1.value * s2.value / (L * L), sv = v1 + v2 + v3, cols = [P.green, P.blue, P.violet], nm = ["Jeunes", "Adultes", "Âgés"], i, j;
      var ht = H * 0.38, cy = ht * 0.7, R0 = Math.min(W * 0.115, ht * 0.21), mx = Math.max(60, cur[0], cur[1], cur[2]), xs = [W * 0.2, W * 0.5, W * 0.8], rr = cur.map(function(n){ return Math.max(R0 * 0.35, R0 * Math.sqrt(n / mx)); });
      /* cycle de vie : cercles (surface ∝ effectif), flèches de survie et de fécondité */
      var fs = [f2.value, f3.value];
      carrow(ctx, xs[1] - rr[1] * 0.5, cy - rr[1] * 0.85, (xs[1] + xs[0]) / 2, cy - R0 * 3.0, xs[0] + rr[0] * 0.5, cy - rr[0] * 0.85, D.tint(P.blue, 0.75), 1 + fs[0] * 1.2);
      carrow(ctx, xs[2] - rr[2] * 0.4, cy - rr[2] * 0.9, xs[1], cy - R0 * 4.7, xs[0] - rr[0] * 0.1, cy - rr[0] * 1.02, D.tint(P.violet, 0.75), 1 + fs[1] * 1.2);
      D.label(c, "f₂ = " + fx(f2.value, 1), (xs[0] + xs[1]) / 2, cy - R0 * 1.75, {color:P.blue, size:10.5}); D.label(c, "f₃ = " + fx(f3.value, 1), xs[1], cy - R0 * 2.5, {color:P.violet, size:10.5});
      carrow(ctx, xs[0] + rr[0] + 4, cy, (xs[0] + xs[1]) / 2, cy, xs[1] - rr[1] - 6, cy, D.tint(P.grey, 0.8), 1 + s1.value * 6); carrow(ctx, xs[1] + rr[1] + 4, cy, (xs[1] + xs[2]) / 2, cy, xs[2] - rr[2] - 6, cy, D.tint(P.grey, 0.8), 1 + s2.value * 6);
      D.label(c, "s₁ = " + fx(s1.value, 2), (xs[0] + xs[1]) / 2, cy + R0 + 12, {color:P.grey, size:10.5}); D.label(c, "s₂ = " + fx(s2.value, 2), (xs[1] + xs[2]) / 2, cy + R0 + 12, {color:P.grey, size:10.5});
      for (i = 0; i < 3; i++){ D.glow(c, xs[i], cy, rr[i] * 1.35, cols[i], 0.2); ctx.beginPath(); ctx.arc(xs[i], cy, rr[i], 0, 7); ctx.fillStyle = D.tint(cols[i], 0.88); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke(); D.text(c, F(cur[i], 0), xs[i], cy, {size:Math.min(15, 9 + rr[i] / 3.5), color:"#fff"}); D.text(c, nm[i], xs[i], cy + R0 + 34, {size:12, color:cols[i]}); }
      D.label(c, "n = " + g, 10, 10, {color:P.mat, align:"left", base:"top", size:12});
      /* proportions : aire empilée à 100 % */
      var gx = 44, gw = W - gx - 14, y1 = ht + 30, h1 = (H - ht - 118) * 0.5, y2 = y1 + h1 + 44, h2 = h1;
      D.text(c, "Répartition par âge (100 %)", gx, y1 - 14, {size:11.5, color:P.ink, align:"left"});
      ctx.save(); ctx.beginPath(); ctx.rect(gx, y1, gw, h1); ctx.clip();
      for (i = 0; i < 3; i++){ ctx.beginPath(); for (j = 0; j <= GM; j++){ var t = hist[j][0] + hist[j][1] + hist[j][2] || 1, lo = 0; for (var q = 0; q < i; q++) lo += hist[j][q] / t; var X = gx + j / GM * gw, Y = y1 + h1 - (lo + hist[j][i] / t) * h1; if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
        for (j = GM; j >= 0; j--){ var t2 = hist[j][0] + hist[j][1] + hist[j][2] || 1, lo2 = 0; for (q = 0; q < i; q++) lo2 += hist[j][q] / t2; ctx.lineTo(gx + j / GM * gw, y1 + h1 - lo2 * h1); } ctx.closePath(); ctx.fillStyle = D.tint(cols[i], 0.62); ctx.fill(); }
      ctx.restore(); ctx.strokeStyle = "#fff"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4; var cum = 0; for (i = 0; i < 2; i++){ cum += [v1, v2, v3][i] / sv; ctx.beginPath(); ctx.moveTo(gx, y1 + h1 - cum * h1); ctx.lineTo(gx + gw, y1 + h1 - cum * h1); ctx.stroke(); } ctx.setLineDash([]);
      D.text(c, "- - - répartition stable", gx + gw - 4, y1 + 10, {size:10, color:"#fff", align:"right"});
      /* total (échelle log) */
      var tots = hist.map(function(h){ return Math.max(1e-9, h[0] + h[1] + h[2]); }), lmax = Math.log10(Math.max.apply(null, tots)) + 0.15, lmin = Math.log10(Math.max(1e-9, Math.min.apply(null, tots))) - 0.15; if (lmax - lmin < 0.6){ lmax += 0.3; lmin -= 0.3; }
      D.text(c, "Population totale (échelle log)", gx, y2 - 14, {size:11.5, color:P.ink, align:"left"});
      ctx.strokeStyle = P.light; ctx.lineWidth = 1; ctx.strokeRect(gx + .5, y2 + .5, gw, h2);
      var Yl = function(v){ return y2 + h2 - (Math.log10(Math.max(v, 1e-9)) - lmin) / (lmax - lmin) * h2; };
      ctx.save(); ctx.beginPath(); ctx.rect(gx, y2, gw, h2); ctx.clip(); ctx.setLineDash([5, 4]); ctx.strokeStyle = P.grey; ctx.lineWidth = 1.6; ctx.beginPath(); for (j = 0; j <= GM; j++){ var yv = Yl(tots[GM] * Math.pow(L, j - GM)); if (j) ctx.lineTo(gx + j / GM * gw, yv); else ctx.moveTo(gx + j / GM * gw, yv); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = P.red; ctx.lineWidth = 2.6; ctx.beginPath(); tots.forEach(function(tv, jj){ var X = gx + jj / GM * gw; if (jj) ctx.lineTo(X, Yl(tv)); else ctx.moveTo(X, Yl(tv)); }); ctx.stroke(); ctx.restore();
      D.text(c, "rouge : réel ; gris : λⁿ", gx + gw - 4, y2 + h2 - 10, {size:10, color:P.grey, align:"right"});
      [[y1, h1], [y2, h2]].forEach(function(r){ ctx.strokeStyle = D.tint(P.ink, 0.5); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(gx + g / GM * gw, r[0]); ctx.lineTo(gx + g / GM * gw, r[0] + r[1]); ctx.stroke(); });
      D.dot(c, gx + g / GM * gw, Yl(tots[g]), 5, P.red);
      for (j = 0; j <= GM; j += 10) D.text(c, String(j), gx + j / GM * gw, y2 + h2 + 11, {size:10, color:P.grey}); D.text(c, "génération n (glisse pour parcourir)", gx + gw / 2, y2 + h2 + 26, {size:10.5, color:P.grey});
      ro.set(0, String(g)); ro.set(1, F(tot, 0)); ro.set(2, fx(L, 3)); ro.set(3, (L >= 1 ? "+" : "−") + fx(Math.abs(L - 1) * 100, 1) + " %"); ro.set(4, fx(v1 / sv * 100, 0) + " / " + fx(v2 / sv * 100, 0) + " / " + fx(v3 / sv * 100, 0) + " %"); ro.set(5, tot > 1e-9 ? fx(cur[0] / tot * 100, 0) + " / " + fx(cur[1] / tot * 100, 0) + " / " + fx(cur[2] / tot * 100, 0) + " %" : "—");
      if (L > 1.005) nt.set("λ = " + fx(L, 3) + " > 1 : la population finit par croître d'environ " + fx((L - 1) * 100, 1) + " % par génération. Regarde les couleurs se figer : la répartition stable.", "ok"); else if (L < 0.995) nt.set("λ = " + fx(L, 3) + " < 1 : la population décroît (" + fx((1 - L) * 100, 1) + " % de moins par génération) et finit par s'éteindre.", "warn"); else nt.set("λ ≈ 1 : la population est (presque) stationnaire.", "ok");
    });
  }
});
})();
