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

/* ---------- 1. plan complexe ---------- */
SFA.sim({
  id:"um-c06-plan-complexe", ch:"c06", titre:"Le plan complexe : parties réelle et imaginaire, module, argument", tag:"Nombres complexes",
  resume:"Glisse le point z : lis sa forme algébrique, son module, son argument, son conjugué.",
  but:"Déplace le point z à la souris (ou avec les curseurs). Observe a, b, le module r, l'argument θ ; active le conjugué, l'opposé et le cercle de rayon |z|.",
  aRetenir:"z = a + bi = r(cos θ + i sin θ) avec r = √(a² + b²) = |z|. Le conjugué z̄ = a − bi est le symétrique de z par rapport à l'axe réel ; z·z̄ = |z|².",
  piege:"θ = arctan(b/a) ne suffit pas : si a < 0 il faut tenir compte du quadrant (ajouter π). Pour z = 0, l'argument n'est pas défini.",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.7}), z = {x:3, y:2}, PN;
    var sa = k.slider("Partie réelle a", -5, 5, 0.1, 3, "", function(){ z.x = sa.value; });
    var sb = k.slider("Partie imaginaire b", -4, 4, 0.1, 2, "", function(){ z.y = sb.value; });
    var tc = k.toggle("Conjugué z̄", true), to = k.toggle("Opposé −z", false), tr = k.toggle("Cercle de rayon |z|", true), ts = k.toggle("Aimanter aux entiers", false);
    var ro = k.readouts(["z", "Module |z|", "Argument θ (rad)", "Argument θ (°)", "Conjugué z̄", "Forme trigonométrique"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); PN = U.Pane(c, 0, 0, c.W, c.H, 5.6, 4, {xl:"Re", yl:"Im"});
      var a = z.x, b = z.y, r = Math.hypot(a, b), th = Math.atan2(b, a);
      if (tr.value) U.circ(c, PN, 0, 0, r, "rgba(30,63,143,.35)", 1.4, [5, 4]);
      U.seg(c, PN, a, 0, a, b, C.grey, 1.2, [4, 4]); U.seg(c, PN, 0, b, a, b, C.grey, 1.2, [4, 4]);
      if (to.value){ U.vec(c, PN, 0, 0, -a, -b, "rgba(180,83,9,.8)", 2, "−z"); }
      if (tc.value){ U.vec(c, PN, 0, 0, a, -b, C.green, 2, "z̄"); U.seg(c, PN, a, b, a, -b, "rgba(46,107,85,.4)", 1, [3, 3]); }
      U.vec(c, PN, 0, 0, a, b, C.blue, 3, "z");
      if (r > 0.15) { U.arc(c, PN, 0, 0, Math.min(34, r * PN.k * 0.5), 0, th, C.red, 2.4); D_text(c, "θ", PN.X(0) + 0.0 + Math.cos(th / 2) * Math.min(34, r * PN.k * 0.5) * 1.5 + 2, PN.Y(0) - Math.sin(th / 2) * Math.min(34, r * PN.k * 0.5) * 1.5, C.red); }
      D_text(c, "a = " + fx(a, 1), PN.X(a), PN.Y(0) + (b >= 0 ? 16 : -16), C.violet); D_text(c, "b = " + fx(b, 1), PN.X(0) + (a >= 0 ? -34 : 34), PN.Y(b), C.violet);
      D_text(c, "r = " + fx(r, 2), PN.X(a / 2) + (b >= 0 ? -22 : 22) * 0.9, PN.Y(b / 2) - (a >= 0 ? 10 : -10) * (b >= 0 ? 1 : -1), C.blue);
      U.pt(c, PN, a, b, C.blue, "", 6);
      ro.set(0, U.cstr(a, b, 1)); ro.set(1, fx(r, 3)); ro.set(2, r < 0.05 ? "indéfini" : fx(th, 3)); ro.set(3, r < 0.05 ? "indéfini" : fx(th * 180 / Math.PI, 1) + "°"); ro.set(4, U.cstr(a, -b, 1));
      ro.set(5, r < 0.05 ? "0" : fx(r, 2) + "(cos " + fx(th * 180 / Math.PI, 0) + "° + i sin " + fx(th * 180 / Math.PI, 0) + "°)");
      nt.set(r < 0.05 ? "z = 0 : le module vaut 0 et l'argument n'est pas défini." : (a < 0 ? "Re(z) &lt; 0 : arctan(b/a) = " + fx(Math.atan(b / a) * 180 / Math.PI, 1) + "° ne donne pas l'argument, il faut ajouter 180° : θ = " + fx(th * 180 / Math.PI, 1) + "°." : "z·z̄ = " + fx(a * a + b * b, 2) + " = |z|² (réel positif)."), r < 0.05 || a < 0 ? "warn" : "ok");
    });
    function D_text(c, s, x, y, col){ S.draw.text(c, s, x, y, {size:12, color:col}); }
    U.dragPts(k, c, function(){ return PN; }, [z], function(){ sa.set(Math.max(-5, Math.min(5, z.x))); sb.set(Math.max(-4, Math.min(4, z.y))); }, function(){ return ts.value ? 1 : 0; });
  }
});

/* ---------- 2. multiplication = rotation + dilatation ---------- */
SFA.sim({
  id:"um-c06-multiplication-rotation", ch:"c06", titre:"Multiplier, c'est tourner et dilater", tag:"Nombres complexes",
  resume:"Déplace z₁ et z₂ : les modules se multiplient, les arguments s'additionnent.",
  but:"Glisse z₁ (bleu) et z₂ (violet). Le produit p = z₁·z₂ (rouge) a pour module |z₁||z₂| et pour argument θ₁ + θ₂ ; le triangle (0, 1, z₁) est semblable au triangle (0, z₂, p). Passe en mode quotient ou en mode z².",
  aRetenir:"|z₁z₂| = |z₁||z₂| et arg(z₁z₂) = arg z₁ + arg z₂ ; |z₁/z₂| = |z₁|/|z₂| et arg(z₁/z₂) = arg z₁ − arg z₂. Multiplier par i = tourner de 90°.",
  piege:"Les arguments s'additionnent mais se comptent modulo 360° : θ₁ + θ₂ peut dépasser 180° ; on le ramène dans ]−180° ; 180°].",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.72}), z1 = {x:1.5, y:1, lim:4.6}, z2 = {x:0.8, y:1.6, lim:4.6}, PN;
    var md = k.seg("Opération", [["mul", "z₁ × z₂"], ["div", "z₁ ÷ z₂"], ["sq", "z₁²"], ["i", "i × z₁"]], "mul");
    var ts = k.toggle("Montrer le triangle semblable", true), tg = k.toggle("Aimanter aux demi-entiers", false);
    var ro = k.readouts(["|z₁|", "|z₂|", "θ₁ (°)", "θ₂ (°)", "Résultat", "Module résultat", "Argument résultat (°)"]);
    var nt = k.note("", "ok");
    function wrap(a){ while (a > Math.PI + 1e-9) a -= 2 * Math.PI; while (a <= -Math.PI + 1e-9) a += 2 * Math.PI; return a; }
    k.draw(function(){
      c.clear(); PN = U.Pane(c, 0, 0, c.W, c.H, 5.4, 3.9, {xl:"Re", yl:"Im"});
      var m = md.value, r1 = Math.hypot(z1.x, z1.y), r2 = Math.hypot(z2.x, z2.y), t1 = Math.atan2(z1.y, z1.x), t2 = Math.atan2(z2.y, z2.x), w, name;
      if (m === "mul"){ w = {x:z1.x * z2.x - z1.y * z2.y, y:z1.x * z2.y + z1.y * z2.x}; name = "z₁·z₂"; }
      else if (m === "div"){ var d = z2.x * z2.x + z2.y * z2.y; w = d < 1e-6 ? null : {x:(z1.x * z2.x + z1.y * z2.y) / d, y:(z1.y * z2.x - z1.x * z2.y) / d}; name = "z₁/z₂"; }
      else if (m === "sq"){ w = {x:z1.x * z1.x - z1.y * z1.y, y:2 * z1.x * z1.y}; name = "z₁²"; }
      else { w = {x:-z1.y, y:z1.x}; name = "i·z₁"; }
      U.circ(c, PN, 0, 0, 1, "rgba(15,27,45,.25)", 1, [3, 3]);
      var ctx = c.ctx;
      if (w){
        var rw = Math.hypot(w.x, w.y), tw = Math.atan2(w.y, w.x);
        if (rw > 0.1) U.circ(c, PN, 0, 0, rw, "rgba(180,35,24,.25)", 1.2, [5, 4]);
        if (ts.value && m === "mul"){
          ctx.save(); ctx.fillStyle = "rgba(30,63,143,.08)"; ctx.strokeStyle = "rgba(30,63,143,.5)"; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(PN.X(0), PN.Y(0)); ctx.lineTo(PN.X(1), PN.Y(0)); ctx.lineTo(PN.X(z1.x), PN.Y(z1.y)); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "rgba(180,35,24,.08)"; ctx.strokeStyle = "rgba(180,35,24,.5)"; ctx.beginPath(); ctx.moveTo(PN.X(0), PN.Y(0)); ctx.lineTo(PN.X(z2.x), PN.Y(z2.y)); ctx.lineTo(PN.X(w.x), PN.Y(w.y)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
        }
        U.vec(c, PN, 0, 0, w.x, w.y, C.red, 3.2, name);
        if (rw > 0.15) U.arc(c, PN, 0, 0, 52, 0, tw, C.red, 2.4);
      }
      if (m !== "sq" && m !== "i"){ U.vec(c, PN, 0, 0, z2.x, z2.y, C.violet, 2.6, "z₂"); if (r2 > 0.15) U.arc(c, PN, 0, 0, 30, 0, t2, C.violet, 2.2); }
      U.vec(c, PN, 0, 0, z1.x, z1.y, C.blue, 2.6, "z₁"); if (r1 > 0.15) U.arc(c, PN, 0, 0, 40, 0, t1, C.blue, 2.2);
      U.pt(c, PN, 1, 0, C.ink, "1", 3.5, 0, 14); U.pt(c, PN, z1.x, z1.y, C.blue, "", 6); if (m !== "sq" && m !== "i") U.pt(c, PN, z2.x, z2.y, C.violet, "", 6);
      if (w) U.pt(c, PN, w.x, w.y, C.red, "", 4.5);
      var deg = 180 / Math.PI;
      ro.set(0, fx(r1, 3)); ro.set(1, m === "sq" || m === "i" ? "—" : fx(r2, 3)); ro.set(2, fx(t1 * deg, 1)); ro.set(3, m === "sq" || m === "i" ? "—" : fx(t2 * deg, 1));
      if (!w){ ro.set(4, "z₂ = 0"); ro.set(5, "—"); ro.set(6, "—"); nt.set("On ne divise pas par z₂ = 0 : éloigne z₂ de l'origine.", "bad"); return; }
      var rw2 = Math.hypot(w.x, w.y), tw2 = Math.atan2(w.y, w.x), raw = m === "mul" ? t1 + t2 : m === "div" ? t1 - t2 : m === "sq" ? 2 * t1 : t1 + Math.PI / 2;
      ro.set(4, U.cstr(w.x, w.y, 2)); ro.set(5, fx(rw2, 3)); ro.set(6, fx(tw2 * deg, 1));
      var exp = m === "mul" ? "|z₁||z₂| = " + fx(r1 * r2, 3) : m === "div" ? "|z₁|/|z₂| = " + fx(r1 / r2, 3) : m === "sq" ? "|z₁|² = " + fx(r1 * r1, 3) : "|z₁| = " + fx(r1, 3);
      var wr = Math.abs(raw - tw2) > 1e-6;
      nt.set("Module attendu : " + exp + ". Argument : " + fx(raw * deg, 1) + "°" + (wr ? ", ramené à " + fx(wrap(raw) * deg, 1) + "° (modulo 360°)" : "") + ".", wr ? "warn" : "ok");
    });
    U.dragPts(k, c, function(){ return PN; }, [z1, z2], null, function(){ return tg.value ? 0.5 : 0; });
  }
});

/* ---------- 3. racines n-ièmes ---------- */
SFA.sim({
  id:"um-c06-racines-nieme", ch:"c06", titre:"Les racines n-ièmes : un polygone régulier", tag:"Nombres complexes",
  resume:"Les n solutions de zⁿ = w forment un polygone régulier ; fais tourner w et regarde-les glisser.",
  but:"Choisis w = r·e<sup>iφ</sup> et n. Les n racines sont sur le cercle de rayon r<sup>1/n</sup>, espacées de 360°/n. Anime w : quand φ augmente de 360°, chaque racine avance d'un cran. Clique sur un point de la vue de gauche pour voir sa puissance n-ième dans la vue de droite.",
  aRetenir:"zₖ = r<sup>1/n</sup>·e<sup>i(φ + 2kπ)/n</sup>, k = 0, 1, …, n − 1. Leur somme est nulle (n ≥ 2) et leur produit vaut (−1)ⁿ⁺¹·w.",
  piege:"Il y a exactement n racines n-ièmes (pas seulement une). Pour w réel positif, la racine « principale » n'est que l'une d'elles.",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.58}), sel = 0, PL, PR;
    var sn = k.slider("n", 2, 12, 1, 5, ""), sr = k.slider("Module de w : r", 0.2, 8, 0.1, 2, ""), sp = k.slider("Argument de w : φ", -180, 180, 1, 60, "°");
    var sk = k.slider("Racine mise en évidence : k", 0, 11, 1, 0, "", function(v){ sel = v; });
    var ro = k.readouts(["Module des racines", "Écart angulaire", "zₖ choisi", "(zₖ)ⁿ calculé", "Somme des racines"]);
    var lp = k.loop(function(dt){ var v = sp.value + 40 * dt; if (v > 180) v -= 360; sp.set(v); k.redraw(); });
    k.button("▶ Faire tourner w", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.draw(function(){
      c.clear(); var n = sn.value, r = sr.value, phi = sp.value * Math.PI / 180, rho = Math.pow(r, 1 / n), W = c.W, H = c.H, kk = Math.min(sel, n - 1);
      var half = W / 2 - 4; PL = U.Pane(c, 0, 0, half, H, 1.25 * Math.max(1, rho) , 1.25 * Math.max(1, rho), {xl:"Re", yl:"Im", ticks:false, step:Math.max(1, Math.round(rho / 2))});
      var RW = Math.max(1.3 * r, 1.3); PR = U.Pane(c, W / 2 + 4, 0, half, H, RW, RW * H / half, {xl:"Re", yl:"Im", ticks:false, step:Math.max(1, Math.round(r / 2))});
      var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, half, H); ctx.clip();
      U.circ(c, PL, 0, 0, rho, "rgba(30,63,143,.4)", 1.5, [5, 4]);
      var pts = []; for (var j = 0; j < n; j++){ var a = (phi + 2 * Math.PI * j) / n; pts.push([rho * Math.cos(a), rho * Math.sin(a)]); }
      ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(PL.X(q[0]), PL.Y(q[1])); else ctx.moveTo(PL.X(q[0]), PL.Y(q[1])); }); ctx.closePath(); ctx.fillStyle = "rgba(30,63,143,.07)"; ctx.fill(); ctx.strokeStyle = "rgba(30,63,143,.6)"; ctx.lineWidth = 1.6; ctx.stroke();
      pts.forEach(function(q, i){ U.seg(c, PL, 0, 0, q[0], q[1], i === kk ? C.red : "rgba(15,27,45,.15)", i === kk ? 2.4 : 1); });
      pts.forEach(function(q, i){ U.pt(c, PL, q[0], q[1], i === kk ? C.red : C.blue, n <= 8 || i === kk ? "z" + i : "", i === kk ? 7 : 5, 13, -12); });
      var s0 = pts[0][0], s1 = pts[0][1]; ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 4, 0, half, H); ctx.clip();
      U.circ(c, PR, 0, 0, r, "rgba(180,35,24,.35)", 1.4, [5, 4]);
      var ak = (phi + 2 * Math.PI * kk) / n, powAng = n * ak;
      U.arc(c, PR, 0, 0, 34, 0, powAng, C.violet, 2.2);
      U.vec(c, PR, 0, 0, r * Math.cos(phi), r * Math.sin(phi), C.red, 3, "w");
      U.seg(c, PR, 0, 0, r * Math.cos(phi), r * Math.sin(phi), C.red, 3);
      U.pt(c, PR, r * Math.cos(phi), r * Math.sin(phi), C.red, "", 6);
      ctx.restore(); S.draw.text(c, "racines zₖ", half / 2, H - 14, {size:13, color:C.blue}); S.draw.text(c, "w = zₖⁿ", W / 2 + 4 + half / 2, H - 14, {size:13, color:C.red});
      S.draw.text(c, "n·arg(zₖ) = " + fx(powAng * 180 / Math.PI, 0) + "° ≡ " + fx(sp.value, 0) + "° (mod 360°)", W / 2 + 4 + half / 2, H - 34, {size:12, color:C.violet});
      var zk = pts[kk], re = 0, im = 0; pts.forEach(function(q){ re += q[0]; im += q[1]; });
      var pr = Math.pow(rho, n), pa = n * Math.atan2(zk[1], zk[0]);
      ro.set(0, fx(rho, 3)); ro.set(1, fx(360 / n, 1) + "°"); ro.set(2, U.cstr(zk[0], zk[1], 3)); ro.set(3, U.cstr(pr * Math.cos(pa), pr * Math.sin(pa), 3) + " (w = " + U.cstr(r * Math.cos(phi), r * Math.sin(phi), 3) + ")"); ro.set(4, U.cstr(Math.abs(re) < 1e-9 ? 0 : re, Math.abs(im) < 1e-9 ? 0 : im, 2));
    });
  }
});

/* ---------- 4. exponentielle complexe et formule d'Euler ---------- */
SFA.sim({
  id:"um-c06-euler-exponentielle", ch:"c06", titre:"La formule d'Euler : cercle, cosinus, sinus et série de Taylor", tag:"Nombres complexes",
  resume:"Un point qui tourne sur le cercle unité dessine le cosinus et le sinus ; la série de Taylor reconstruit e<sup>iθ</sup> terme à terme.",
  but:"Mode « Cercle » : fais varier θ (ou lance l'animation) : la projection horizontale trace cos θ, la verticale trace sin θ. Mode « Taylor » : additionne les termes (iθ)ᵏ/k! un à un et vois la ligne brisée se refermer sur le point e<sup>iθ</sup>.",
  aRetenir:"e<sup>iθ</sup> = cos θ + i sin θ (Euler). En particulier e<sup>iπ</sup> = −1, e<sup>iπ/2</sup> = i, |e<sup>iθ</sup>| = 1. Produit : e<sup>iα</sup>e<sup>iβ</sup> = e<sup>i(α+β)</sup>.",
  piege:"e<sup>iθ</sup> est périodique de période 2π : e<sup>iθ</sup> = e<sup>i(θ+2π)</sup>. θ s'exprime en radians (180° = π rad).",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.56}), PL;
    var md = k.seg("Mode", [["c", "Cercle et projections"], ["t", "Série de Taylor"]], "c");
    var st = k.slider("Angle θ", -6.3, 6.3, 0.01, 1.0, "rad"), sn = k.slider("Nombre de termes N (mode Taylor)", 1, 16, 1, 3, "");
    var ro = k.readouts(["e^(iθ)", "cos θ", "sin θ", "Somme S<sub>N</sub>", "Écart |S<sub>N</sub> − e<sup>iθ</sup>|"]);
    var lp = k.loop(function(dt){ var v = st.value + 0.8 * dt; if (v > 6.3) v = -6.3; st.set(v); k.redraw(); });
    k.button("▶ Animer θ", function(){ if (lp.running) lp.pause(); else lp.play(); }, true); k.button("θ = π", function(){ st.set(Math.PI); });
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, th = st.value, ctx = c.ctx, mode = md.value, cs = Math.cos(th), sn_ = Math.sin(th);
      var N = sn.value, sx = 0, sy = 0, terms = [], tr = 1, ti = 0; for (var j = 0; j < N; j++){ terms.push([tr, ti]); sx += tr; sy += ti; var nr = -ti * th / (j + 1), ni = tr * th / (j + 1); tr = nr; ti = ni; }
      var half = mode === "c" ? W * 0.42 : W * 0.62;
      var big = mode === "t" ? Math.max(1.5, Math.min(14, Math.max.apply(null, terms.map(function(q, i){ return Math.abs(q[0]) + 0; }).concat(terms.map(function(q){ return Math.abs(q[1]); }), [Math.abs(sx), Math.abs(sy)])) * 1.15)) : 1.4;
      PL = U.Pane(c, 0, 0, half, H, big * half / H, big, {xl:"Re", yl:"Im", ticks:false, step:big > 6 ? 5 : 1});
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, half, H); ctx.clip();
      U.circ(c, PL, 0, 0, 1, "rgba(15,27,45,.35)", 1.4);
      if (mode === "c"){
        U.arc(c, PL, 0, 0, 28, 0, th, C.red, 2.5);
        U.seg(c, PL, cs, 0, cs, sn_, C.blue, 2); U.seg(c, PL, 0, sn_, cs, sn_, C.green, 2);
        U.vec(c, PL, 0, 0, cs, sn_, C.ink, 2.6); U.pt(c, PL, cs, sn_, C.red, "e^(iθ)", 6, 14, -14);
        U.pt(c, PL, cs, 0, C.blue, "cos θ", 4, 0, 16); U.pt(c, PL, 0, sn_, C.green, "sin θ", 4, -26, 0);
      } else {
        var ax_ = 0, ay_ = 0;
        terms.forEach(function(q, i){ var bx = ax_, by = ay_; ax_ += q[0]; ay_ += q[1]; U.vec(c, PL, bx, by, ax_, ay_, i % 2 ? C.violet : C.amber, 2.2); });
        U.pt(c, PL, sx, sy, C.red, "S" + N, 5, 10, -12); U.pt(c, PL, cs, sn_, C.green, "e^(iθ)", 5, 12, 14);
      }
      ctx.restore();
      var x0 = half + 14, w = W - x0 - 8;
      if (mode === "c"){
        var tx = function(t){ return x0 + (t + 6.3) / 12.6 * w; }, ty = function(y){ return H / 2 - y * H * 0.32; };
        ctx.save(); ctx.strokeStyle = "#cfd6df"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, ty(0)); ctx.lineTo(x0 + w, ty(0)); ctx.moveTo(tx(0), 8); ctx.lineTo(tx(0), H - 8); ctx.stroke();
        ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish, system-ui"; ctx.textAlign = "center"; [-2 * Math.PI, -Math.PI, Math.PI, 2 * Math.PI].forEach(function(t){ ctx.fillText(Math.round(t / Math.PI) + "π", tx(t), ty(0) + 14); });
        [[Math.cos, C.blue], [Math.sin, C.green]].forEach(function(p){ ctx.strokeStyle = p[1]; ctx.lineWidth = 2.2; ctx.beginPath(); for (var i = 0; i <= 200; i++){ var t = -6.3 + 12.6 * i / 200; if (i) ctx.lineTo(tx(t), ty(p[0](t))); else ctx.moveTo(tx(t), ty(p[0](t))); } ctx.stroke(); });
        ctx.setLineDash([4, 3]); ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(tx(th), 8); ctx.lineTo(tx(th), H - 8); ctx.stroke(); ctx.restore();
        S.draw.dot(c, tx(th), ty(cs), 5, C.blue); S.draw.dot(c, tx(th), ty(sn_), 5, C.green);
        S.draw.text(c, "cos θ", x0 + 20, 14, {size:12, color:C.blue}); S.draw.text(c, "sin θ", x0 + 66, 14, {size:12, color:C.green});
      } else {
        var errs = []; for (var q = 1; q <= 16; q++){ var a = 0, b = 0, ur = 1, ui = 0; for (var j2 = 0; j2 < q; j2++){ a += ur; b += ui; var nr2 = -ui * th / (j2 + 1), ni2 = ur * th / (j2 + 1); ur = nr2; ui = ni2; } errs.push(Math.hypot(a - cs, b - sn_)); }
        var lg = function(e){ return Math.log10(Math.max(e, 1e-16)); };
        S.draw.text(c, "Écart selon N (échelle log)", x0 + w / 2, 14, {size:12, color:C.ink});
        ctx.save(); ctx.strokeStyle = "#cfd6df"; ctx.beginPath(); ctx.moveTo(x0, H - 30); ctx.lineTo(x0 + w, H - 30); ctx.stroke();
        errs.forEach(function(e, i){ var bx = x0 + 6 + i * (w - 10) / 16, bh = (lg(e) + 16) / 18 * (H - 80), col = i + 1 === N ? C.red : "rgba(30,63,143,.55)"; ctx.fillStyle = col; ctx.fillRect(bx, H - 30 - Math.max(2, bh), Math.max(4, (w - 10) / 16 - 4), Math.max(2, bh)); ctx.fillStyle = "#5f6b7a"; ctx.font = "600 10px Mulish, system-ui"; ctx.textAlign = "center"; ctx.fillText(i + 1, bx + Math.max(4, (w - 10) / 16 - 4) / 2, H - 16); });
        ctx.restore();
      }
      ro.set(0, U.cstr(cs, sn_, 3)); ro.set(1, fx(cs, 4)); ro.set(2, fx(sn_, 4));
      ro.set(3, mode === "t" ? U.cstr(sx, sy, 4) : "—"); ro.set(4, mode === "t" ? (function(){ var e = Math.hypot(sx - cs, sy - sn_); return e < 1e-9 ? "< 10⁻⁹" : e < 0.01 ? e.toExponential(1).replace(".", ",") : fx(e, 3); })() : "—");
    });
  }
});

/* ---------- 5. équation du second degré ---------- */
SFA.sim({
  id:"um-c06-equation-second-degre", ch:"c06", titre:"Équation du second degré : quand le discriminant devient négatif", tag:"Nombres complexes",
  resume:"La parabole ne coupe plus l'axe : les racines quittent l'axe réel et forment une paire conjuguée.",
  but:"Fais varier a, b et c de az² + bz + c = 0. À gauche, la parabole y = ax² + bx + c ; à droite, les solutions dans le plan complexe. Quand Δ < 0, deux racines conjuguées apparaissent, symétriques par rapport à l'axe réel.",
  aRetenir:"Δ = b² − 4ac. Si Δ ≥ 0 : z = (−b ± √Δ)/2a. Si Δ < 0 : z = (−b ± i√(−Δ))/2a. Somme des racines −b/a, produit c/a.",
  piege:"Pour Δ < 0, √Δ n'existe pas dans ℝ : on écrit √Δ = i√(−Δ). Ne pas oublier le « ± ».",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.62}), D = S.draw, PA, PR, grab = 0;
    U.autoRatio(c, 0.66, 1.5, 440);
    var sa = k.slider("a", -3, 3, 0.1, 1, ""), sb = k.slider("b", -8, 8, 0.1, -4, ""), sc = k.slider("c", -8, 12, 0.1, 13, "");
    var gd = k.toggle("Défi : obtiens les racines 2 + 3i et 2 − 3i (avec a = 1)", false);
    k.button("a = 1", function(){ sa.set(1); });
    var ro = k.readouts(["Discriminant Δ", "Racine z₁", "Racine z₂", "Somme (−b/a)", "Produit (c/a)"]); var nt = k.note("", "ok");
    function rt(){ var a = sa.value, b = sb.value, cc = sc.value, dl = b * b - 4 * a * cc; if (Math.abs(a) < 0.05) return null; return dl >= 0 ? {dl:dl, r:[[(-b + Math.sqrt(dl)) / (2 * a), 0], [(-b - Math.sqrt(dl)) / (2 * a), 0]]} : {dl:dl, r:[[-b / (2 * a), Math.sqrt(-dl) / (2 * Math.abs(a))], [-b / (2 * a), -Math.sqrt(-dl) / (2 * Math.abs(a))]]}; }
    function setRoots(p, q, p2){ var a = sa.value; if (q > 0){ sb.set(Math.round(-2 * a * p * 10) / 10); sc.set(Math.round(a * (p * p + q * q) * 10) / 10); } else { sb.set(Math.round(-a * (p + p2) * 10) / 10); sc.set(Math.round(a * p * p2 * 10) / 10); } }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!PA) return;
      if (t === "down"){ grab = 0; var a = sa.value, vx = -sb.value / (2 * a), vy = a * vx * vx + sb.value * vx + sc.value; if (Math.hypot(PA.X(vx) - p.x, PA.Y(vy) - p.y) < 24) grab = 1; var R = rt(); if (R && Math.hypot(PR.X(R.r[0][0]) - p.x, PR.Y(R.r[0][1]) - p.y) < 24) grab = 2; }
      else if (t === "drag" && grab){
        var a2 = sa.value;
        if (grab === 1){ var h = Math.round(cl(PA.ix(p.x), -6, 6) * 10) / 10, kk = Math.round(cl(PA.iy(p.y), -8, 12) * 10) / 10; sb.set(Math.round(-2 * a2 * h * 10) / 10); sc.set(Math.round((a2 * h * h + kk) * 10) / 10); }
        else { var R2 = rt(), px = cl(PR.ix(p.x), -6, 6), py = cl(PR.iy(p.y), -6, 6); if (R2){ if (Math.abs(py) > 0.25) setRoots(px, Math.abs(py)); else { var other = R2.dl >= 0 ? R2.r[1][0] : px; setRoots(px, 0, other); } } }
        k.redraw(); }
      else if (t === "up") grab = 0;
    });
    function cl(x, a, b){ return Math.max(a, Math.min(b, x)); }
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, a = sa.value, b = sb.value, cc = sc.value, ctx = c.ctx, st = W < 440, gap = 8, bw = st ? W : (W - gap) / 2, bh = st ? (H - gap) / 2 : H;
      PA = U.Pane(c, 0, 0, bw, bh, 8, 10, {dy:4, step:2, xl:"x", yl:"y"}); PR = U.Pane(c, st ? 0 : bw + gap, st ? bh + gap : 0, bw, bh, 6, 6, {xl:"Re", yl:"Im", step:2});
      D.label(c, "Parabole y = ax² + bx + c", PA.bx + 8, PA.by + 8, {color:C.blue, align:"left", base:"top"}); D.label(c, "Racines dans le plan complexe", PR.bx + 8, PR.by + 8, {color:C.red, align:"left", base:"top"});
      if (Math.abs(a) < 0.05){ nt.set("a ≈ 0 : ce n'est plus une équation du second degré. Choisis |a| ≥ 0,1.", "bad"); for (var q = 0; q < 5; q++) ro.set(q, "—"); return; }
      var R = rt(), dl = R.dl, vx = -b / (2 * a), vy = a * vx * vx + b * vx + cc, r1 = R.r[0], r2 = R.r[1], i;
      PA.clip(); ctx.strokeStyle = C.blue; ctx.lineWidth = 3; ctx.beginPath(); for (i = 0; i <= 200; i++){ var x = -8 + 16 * i / 200, y = a * x * x + b * x + cc; if (i) ctx.lineTo(PA.X(x), PA.Y(y)); else ctx.moveTo(PA.X(x), PA.Y(y)); } ctx.stroke();
      ctx.setLineDash([5, 4]); ctx.strokeStyle = D.tint(C.amber, 0.7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(PA.X(vx), PA.by); ctx.lineTo(PA.X(vx), PA.by + PA.bh); ctx.stroke(); ctx.setLineDash([]); PA.unclip();
      if (dl >= 0){ U.pt(c, PA, r1[0], 0, C.red, "", 6); U.pt(c, PA, r2[0], 0, C.red, "", 6); }
      U.pt(c, PA, vx, vy, C.amber, "sommet", 8, 12, -14);
      var goal = gd.value ? [2, 3] : null; PR.clip(); if (goal){ ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); [[2, 3], [2, -3]].forEach(function(g){ ctx.beginPath(); ctx.arc(PR.X(g[0]), PR.Y(g[1]), 12, 0, 7); ctx.stroke(); }); ctx.setLineDash([]); }
      U.seg(c, PR, r1[0], r1[1], r2[0], r2[1], "rgba(192,50,29,.4)", 1.2, [4, 3]); PR.unclip();
      U.pt(c, PR, r1[0], r1[1], C.red, "z₁", 8, 14, -14); if (dl !== 0) U.pt(c, PR, r2[0], r2[1], C.red, "z₂", 7, 14, 14);
      ro.set(0, fx(dl, 2)); ro.set(1, U.cstr(r1[0], r1[1], 3)); ro.set(2, U.cstr(r2[0], r2[1], 3)); ro.set(3, fx(-b / a, 3)); ro.set(4, fx(cc / a, 3));
      if (goal){ var ok = dl < 0 && Math.abs(r1[0] - 2) < 0.15 && Math.abs(r1[1] - 3) < 0.15; nt.set(ok ? "Réussi : (z − (2 + 3i))(z − (2 − 3i)) = z² − 4z + 13. Les racines conjuguées donnent des coefficients réels." : "Cible : racines 2 ± 3i. Glisse z₁ vers le cercle pointillé (le conjugué suit) ; observe b = −4 et c = 13.", ok ? "ok" : "warn"); }
      else nt.set(dl > 1e-9 ? "Δ &gt; 0 : deux racines réelles distinctes (la parabole coupe l'axe des x deux fois)." : Math.abs(dl) <= 1e-9 ? "Δ = 0 : une racine double réelle (la parabole est tangente à l'axe)." : "Δ &lt; 0 : deux racines complexes conjuguées " + U.cstr(r1[0], r1[1], 2) + " et " + U.cstr(r2[0], r2[1], 2) + " (la parabole ne coupe pas l'axe). Glisse z₁ ou le sommet.", dl < -1e-9 ? "warn" : "ok");
    });
  }
});
