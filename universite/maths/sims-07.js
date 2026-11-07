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
function box3(v, a, col){ /* chemin x, y, z vers le point a */
  v.line([0, 0, 0], [a[0], 0, 0], col, 1.2, [4, 3]); v.line([a[0], 0, 0], [a[0], a[1], 0], col, 1.2, [4, 3]); v.line([a[0], a[1], 0], [a[0], a[1], a[2]], col, 1.2, [4, 3]);
}
function patch(v, n, d, L, fill, stroke){ /* morceau de plan n·x = d */
  var nn = U3.dot3(n, n), p0 = U3.mul3(n, d / nn), h = Math.abs(n[2]) > 0.9 * Math.sqrt(nn) ? [1, 0, 0] : [0, 0, 1], e1 = U3.cross3(n, h), l1 = U3.norm3(e1); e1 = U3.mul3(e1, 1 / l1);
  var e2 = U3.cross3(n, e1); e2 = U3.mul3(e2, 1 / U3.norm3(e2));
  function P(a, b){ return U3.add3(p0, U3.add3(U3.mul3(e1, a * L), U3.mul3(e2, b * L))); }
  v.poly([P(-1, -1), P(1, -1), P(1, 1), P(-1, 1)], fill, stroke, 1.4);
  for (var g = -0.5; g <= 0.5; g += 0.5){ v.line(P(g * 2, -1), P(g * 2, 1), "rgba(30,63,143,.18)", 1); v.line(P(-1, g * 2), P(1, g * 2), "rgba(30,63,143,.18)", 1); }
}
var U3 = UMB;

/* ---------- 1. vecteurs dans l'espace ---------- */
SFA.sim({
  id:"um-c07-vecteurs-3d", ch:"c07", titre:"Vecteurs de l'espace : composantes, somme et norme", tag:"Vecteurs et droites",
  resume:"Construis u et v dans l'espace, fais tourner la scène à la souris, observe u + v, u − v et λu.",
  but:"Règle les coordonnées de u (bleu) et v (violet). Fais tourner la vue en faisant glisser la souris sur le dessin. La somme est la diagonale du parallélogramme ; la norme est la longueur de la flèche (Pythagore deux fois).",
  aRetenir:"‖u‖ = √(x² + y² + z²). u + v = (x₁+x₂ ; y₁+y₂ ; z₁+z₂) : on additionne composante par composante. λu garde la direction (ou l'inverse si λ < 0) et multiplie la norme par |λ|.",
  piege:"‖u + v‖ ≠ ‖u‖ + ‖v‖ en général : l'égalité n'a lieu que si u et v sont de même sens (inégalité triangulaire).",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.72}), V = U.View3(k, c, {range:5.4, az:0.9, el:0.45}); V.attach();
    function sn(x){ return Math.round(x * 2) / 2; }
    var ux = k.slider("u : x", -4, 4, 0.5, 3, ""), uy = k.slider("u : y", -4, 4, 0.5, 1, ""), uz = k.slider("u : z", -4, 4, 0.5, 2, "");
    var vx = k.slider("v : x", -4, 4, 0.5, -1, ""), vy = k.slider("v : y", -4, 4, 0.5, 3, ""), vz = k.slider("v : z", -4, 4, 0.5, 1, "");
    var sl = k.slider("Facteur λ", -2, 2, 0.1, 1.5, "");
    V.handles.push({col:C.blue, get:function(){ return [ux.value, uy.value, uz.value]; }, set:function(x, y){ ux.set(sn(x)); uy.set(sn(y)); }});
    V.handles.push({col:C.violet, get:function(){ return [vx.value, vy.value, vz.value]; }, set:function(x, y){ vx.set(sn(x)); vy.set(sn(y)); }});
    var TG = [[2, 4, 3], [-1, 3, 2], [3, -2, 4], [0, 4, -2]], ti = 0;
    var df = k.toggle("Défi : atteindre la cible u + v = T", false);
    k.button("Nouvelle cible", function(){ ti = (ti + 1) % TG.length; df.set(true); });
    var ts = k.toggle("Somme u + v", true), td = k.toggle("Différence u − v", false), tl = k.toggle("Multiple λu", false), tc = k.toggle("Composantes de u", true);
    var ro = k.readouts(["‖u‖", "‖v‖", "u + v", "‖u + v‖", "u − v", "λu"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); V.fit(); var u = [ux.value, uy.value, uz.value], w = [vx.value, vy.value, vz.value], s = U.add3(u, w), df = U.sub3(u, w), lu = U.mul3(u, sl.value), O = [0, 0, 0];
      V.axes(5, null, {step:1});
      if (tc.value) box3(V, u, "rgba(30,63,143,.5)");
      if (ts.value){ V.poly([O, u, s, w], "rgba(91,33,182,.08)", "rgba(91,33,182,.35)", 1); V.line(u, s, "rgba(91,33,182,.5)", 1.2, [4, 3]); V.line(w, s, "rgba(30,63,143,.5)", 1.2, [4, 3]); V.arrow(O, s, C.red, 3, "u+v"); }
      if (td.value) V.arrow(w, u, C.green, 2.4, "u−v");
      if (tl.value) V.arrow(O, lu, C.amber, 2.4, "λu");
      V.arrow(O, u, C.blue, 3, "u"); V.arrow(O, w, C.violet, 3, "v"); V.hand();
      var nu = U.norm3(u), nv = U.norm3(w), ns = U.norm3(s), gdone = false;
      if (df.value){ var T = TG[ti]; gdone = U.norm3(U.sub3(s, T)) < 0.01; V.dot(T, 7, gdone ? C.green : C.amber, "cible T", 12, -12); V.line(s, T, gdone ? C.green : "rgba(180,83,9,.6)", 1.6, [4, 3]); }
      ro.set(0, fx(nu, 3)); ro.set(1, fx(nv, 3)); ro.set(2, U.v3s(s, 1)); ro.set(3, fx(ns, 3)); ro.set(4, U.v3s(df, 1)); ro.set(5, U.v3s(lu, 2));
      if (df.value){ var T2 = TG[ti]; nt.set(gdone ? "Bravo : u + v = " + U.v3s(T2, 0) + ". Remarque qu'une infinité de couples (u ; v) conviennent." : "Cible T = " + U.v3s(T2, 0) + ". Il manque " + U.v3s(U.sub3(T2, s), 1) + " à u + v. Glisse la pointe d'une flèche (ou les curseurs).", gdone ? "ok" : "warn"); }
      else nt.set(nu + nv - ns < 1e-6 && nu > 0 && nv > 0 ? "‖u + v‖ = ‖u‖ + ‖v‖ : u et v ont le même sens." : "Inégalité triangulaire : ‖u + v‖ = " + fx(ns, 2) + " ≤ ‖u‖ + ‖v‖ = " + fx(nu + nv, 2) + ".", "ok");
    });
  }
});

/* ---------- 2. produit scalaire ---------- */
SFA.sim({
  id:"um-c07-produit-scalaire", ch:"c07", titre:"Le produit scalaire : projection et angle", tag:"Vecteurs et droites",
  resume:"Le produit scalaire se lit sur la projection de v sur u ; il s'annule exactement quand les vecteurs sont orthogonaux.",
  but:"Modifie u et v. Le segment vert est la projection orthogonale de v sur u ; l'arc rouge est l'angle θ. Le bouton « Rendre v ⟂ u » enlève à v sa composante sur u : le produit scalaire tombe à zéro.",
  aRetenir:"u·v = x₁x₂ + y₁y₂ + z₁z₂ = ‖u‖‖v‖cos θ. Projection de v sur u : (u·v/‖u‖²)·u. u·v = 0 ⇔ u ⟂ v. Signe : positif si θ est aigu, négatif si θ est obtus.",
  piege:"Le produit scalaire est un nombre, pas un vecteur ; u·v = 0 n'implique pas que u ou v soit nul.",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.72}), V = U.View3(k, c, {range:4.6, az:0.9, el:0.45}); V.attach();
    function sn(x){ return Math.round(x * 2) / 2; }
    var ux = k.slider("u : x", -4, 4, 0.5, 3, ""), uy = k.slider("u : y", -4, 4, 0.5, 1, ""), uz = k.slider("u : z", -4, 4, 0.5, 0, "");
    var vx = k.slider("v : x", -4, 4, 0.5, 1, ""), vy = k.slider("v : y", -4, 4, 0.5, 3, ""), vz = k.slider("v : z", -4, 4, 0.5, 2, "");
    k.button("Rendre v ⟂ u", function(){ var u = [ux.value, uy.value, uz.value], v = [vx.value, vy.value, vz.value], nn = U.dot3(u, u); if (nn < 1e-9) return; var p = U.dot3(u, v) / nn, r = U.sub3(v, U.mul3(u, p)); function cl(x){ return Math.max(-4, Math.min(4, Math.round(x * 100) / 100)); } vx.set(cl(r[0])); vy.set(cl(r[1])); vz.set(cl(r[2])); }, true);
    k.button("v ∥ u (v = u)", function(){ vx.set(ux.value); vy.set(uy.value); vz.set(uz.value); });
    var tp = k.toggle("Projection de v sur u", true), df = k.toggle("Défi : rends v perpendiculaire à u en glissant sa pointe", false);
    V.handles.push({col:C.blue, get:function(){ return [ux.value, uy.value, uz.value]; }, set:function(x, y){ ux.set(sn(x)); uy.set(sn(y)); }});
    V.handles.push({col:C.violet, get:function(){ return [vx.value, vy.value, vz.value]; }, set:function(x, y){ vx.set(sn(x)); vy.set(sn(y)); }});
    var ro = k.readouts(["u·v (coordonnées)", "‖u‖‖v‖cos θ", "Angle θ", "Projection scalaire", "‖u‖", "‖v‖"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); V.fit(); var u = [ux.value, uy.value, uz.value], v = [vx.value, vy.value, vz.value], O = [0, 0, 0], nu = U.norm3(u), nv = U.norm3(v), d = U.dot3(u, v);
      V.axes(5, null, {step:1});
      if (nu < 1e-9 || nv < 1e-9){ V.arrow(O, u, C.blue, 3, "u"); V.arrow(O, v, C.violet, 3, "v"); ro.set(0, fx(d, 2)); ro.set(1, "0"); ro.set(2, "indéfini"); ro.set(3, "—"); ro.set(4, fx(nu, 3)); ro.set(5, fx(nv, 3)); nt.set("Un des vecteurs est nul : l'angle n'est pas défini (le produit scalaire vaut 0).", "warn"); return; }
      var cs = Math.max(-1, Math.min(1, d / (nu * nv))), th = Math.acos(cs), pr = U.mul3(u, d / (nu * nu));
      if (tp.value){ V.line(v, pr, "rgba(46,107,85,.7)", 1.4, [4, 3]); V.arrow(O, pr, C.green, 4.5, ""); V.dot(pr, 4, C.green, "proj", 8, 12); }
      V.arrow(O, u, C.blue, 3, "u"); V.arrow(O, v, C.violet, 3, "v"); V.hand();
      var e1 = U.mul3(u, 1 / nu), r = U.sub3(v, U.mul3(e1, U.dot3(v, e1))), nr = U.norm3(r);
      if (nr > 1e-9){ var e2 = U.mul3(r, 1 / nr), pts = []; for (var i = 0; i <= 24; i++){ var a = th * i / 24; pts.push(U.add3(U.mul3(e1, 1.3 * Math.cos(a)), U.mul3(e2, 1.3 * Math.sin(a)))); } for (i = 0; i < 24; i++) V.line(pts[i], pts[i + 1], C.red, 2.4); }
      else if (cs < 0) V.text(U.mul3(e1, 1.3), "180°", C.red, 12);
      var m = U.add3(U.mul3(e1, 1.7 * Math.cos(th / 2)), nr > 1e-9 ? U.mul3(U.mul3(r, 1 / nr), 1.7 * Math.sin(th / 2)) : [0, 0, 0]); V.text(m, "θ", C.red, 13);
      ro.set(0, fx(d, 3)); ro.set(1, fx(nu * nv * cs, 3)); ro.set(2, fx(th * 180 / Math.PI, 1) + "°"); ro.set(3, fx(d / nu, 3)); ro.set(4, fx(nu, 3)); ro.set(5, fx(nv, 3));
      if (df.value && Math.abs(d) > 1e-9){ nt.set("Défi : u·v = " + fx(d, 2) + ", angle " + fx(th * 180 / Math.PI, 0) + "°. Cherche une position de v avec u·v = 0 (angle droit). Pour u·v > 0, v « avance » avec u ; pour u·v < 0, il « recule ».", "warn"); return; }
      nt.set(Math.abs(d) < 1e-9 ? "u·v = 0 : les vecteurs sont orthogonaux (θ = 90°), la projection de v sur u est nulle." : d > 0 ? "u·v &gt; 0 : angle aigu (θ &lt; 90°), la projection de v sur u est dans le sens de u." : "u·v &lt; 0 : angle obtus (θ &gt; 90°), la projection est dans le sens opposé à u.", Math.abs(d) < 1e-9 ? "warn" : "ok");
    });
  }
});

/* ---------- 3. produit vectoriel ---------- */
SFA.sim({
  id:"um-c07-produit-vectoriel", ch:"c07", titre:"Le produit vectoriel : normale et aire du parallélogramme", tag:"Vecteurs et droites",
  resume:"u × v est perpendiculaire aux deux vecteurs, sa norme est l'aire du parallélogramme (règle de la main droite).",
  but:"Modifie u et v, ou fais tourner v autour de l'axe z. La flèche rouge u × v est normale au parallélogramme ; sa longueur vaut l'aire. Quand u et v deviennent parallèles, l'aire s'annule. (Pour que le dessin reste lisible, la flèche est réduite si elle est trop longue.)",
  aRetenir:"u × v = (y₁z₂ − z₁y₂ ; z₁x₂ − x₁z₂ ; x₁y₂ − y₁x₂). ‖u × v‖ = ‖u‖‖v‖ sin θ = aire du parallélogramme. u × v = −(v × u). u × v = 0 ⇔ u ∥ v.",
  piege:"Le produit vectoriel n'est pas commutatif : échanger u et v change le sens de la normale (règle de la main droite).",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.72}), V = U.View3(k, c, {range:4.6, az:0.9, el:0.5}); V.attach();
    function sn(x){ return Math.round(x * 2) / 2; }
    var ux = k.slider("u : x", -4, 4, 0.5, 3, ""), uy = k.slider("u : y", -4, 4, 0.5, 0, ""), uz = k.slider("u : z", -4, 4, 0.5, 0, "");
    var vx = k.slider("v : x", -4, 4, 0.5, 1, ""), vy = k.slider("v : y", -4, 4, 0.5, 3, ""), vz = k.slider("v : z", -4, 4, 0.5, 1, "");
    V.handles.push({col:C.blue, get:function(){ return [ux.value, uy.value, uz.value]; }, set:function(x, y){ ux.set(sn(x)); uy.set(sn(y)); }});
    V.handles.push({col:C.violet, get:function(){ return [vx.value, vy.value, vz.value]; }, set:function(x, y){ vx.set(sn(x)); vy.set(sn(y)); }});
    var gd = k.toggle("Défi : fais une aire de 6 (parallélogramme)", false);
    var sw = k.toggle("Montrer v × u (sens contraire)", false), tr = k.toggle("Angle de 90° avec u et v", true);
    var lp = k.loop(function(dt){ var x = vx.value, y = vy.value, a = 0.9 * dt, nx = x * Math.cos(a) - y * Math.sin(a), ny = x * Math.sin(a) + y * Math.cos(a); vx.set(nx); vy.set(ny); k.redraw(); });
    k.button("▶ Faire tourner v autour de z", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var ro = k.readouts(["u × v", "Aire = ‖u × v‖", "‖u‖‖v‖ sin θ", "(u × v)·u", "(u × v)·v"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); V.fit(); var u = [ux.value, uy.value, uz.value], v = [vx.value, vy.value, vz.value], O = [0, 0, 0], w = U.cross3(u, v), nw = U.norm3(w), nu = U.norm3(u), nv = U.norm3(v);
      V.axes(5, null, {step:1}); V.poly([O, u, U.add3(u, v), v], "rgba(180,83,9,.16)", "rgba(180,83,9,.6)", 1.5);
      var f = nw > 4 ? 4 / nw : 1, ws = U.mul3(w, f); V.arrow(O, u, C.blue, 3, "u"); V.arrow(O, v, C.violet, 3, "v"); V.hand();
      if (nw > 1e-9){ V.arrow(O, ws, C.red, 3.4, "u×v"); if (sw.value) V.arrow(O, U.mul3(ws, -1), C.green, 2.4, "v×u"); }
      var sn = nu * nv > 1e-9 ? Math.sqrt(Math.max(0, 1 - Math.pow(U.dot3(u, v) / (nu * nv), 2))) : 0;
      ro.set(0, U.v3s(w, 1)); ro.set(1, fx(nw, 3)); ro.set(2, fx(nu * nv * sn, 3)); ro.set(3, fx(U.dot3(w, u), 6).replace("−0", "0")); ro.set(4, fx(U.dot3(w, v), 6).replace("−0", "0"));
      if (gd.value){ var ok = Math.abs(nw - 6) < 0.25; nt.set(ok ? "Aire = " + fx(nw, 2) + " ≈ 6 : bravo. Beaucoup de couples (u ; v) donnent la même aire : seule compte ‖u‖‖v‖ sin θ." : "Aire = " + fx(nw, 2) + ". Vise 6 (± 0,25) : change l'angle ou les longueurs.", ok ? "ok" : "warn"); return; }
      nt.set(nw < 1e-9 ? "u et v sont parallèles : l'aire est nulle et u × v = 0 (pas de normale unique)." : "Aire du parallélogramme = " + fx(nw, 2) + (f < 1 ? " — flèche réduite d'un facteur " + fx(1 / f, 1) + " pour le dessin." : "."), nw < 1e-9 ? "warn" : "ok");
    });
  }
});

/* ---------- 4. droite de l'espace ---------- */
SFA.sim({
  id:"um-c07-droite-3d", ch:"c07", titre:"Une droite de l'espace : équations paramétriques et distance", tag:"Vecteurs et droites",
  resume:"Un point A, un vecteur directeur d et un paramètre t décrivent toute la droite ; mesure la distance d'un point à la droite.",
  but:"Choisis le point A et la direction d, puis fais varier t : le point M(t) = A + t·d parcourt la droite. Le point fixe P (rouge) est à distance ‖AP × d‖/‖d‖ de la droite ; le pied de la perpendiculaire est indiqué en vert.",
  aRetenir:"M(t) = A + t·d, c'est-à-dire x = x_A + t·d_x, y = y_A + t·d_y, z = z_A + t·d_z. Distance de P à la droite : ‖AP × d‖ / ‖d‖. La droite coupe le plan z = 0 pour t = −z_A/d_z (si d_z ≠ 0).",
  piege:"Une droite a une infinité de représentations paramétriques (autre point, d multiplié par un réel non nul) ; l'équation cartésienne d'une droite de l'espace demande deux équations.",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.72}), V = U.View3(k, c, {range:5, az:0.9, el:0.5}); V.attach();
    var ax = k.slider("A : x", -4, 4, 0.5, 1, ""), ay = k.slider("A : y", -4, 4, 0.5, -1, ""), az = k.slider("A : z", -4, 4, 0.5, 2, "");
    var dx = k.slider("d : x", -3, 3, 0.5, 1, ""), dy = k.slider("d : y", -3, 3, 0.5, 1, ""), dz = k.slider("d : z", -3, 3, 0.5, -1, "");
    var st = k.slider("Paramètre t", -4, 4, 0.1, 1, "");
    var tp = k.toggle("Point P et distance à la droite", true), th = k.toggle("Trace sur le plan z = 0", true);
    var ro = k.readouts(["M(t)", "Équation x(t)", "Équation y(t)", "Équation z(t)", "Distance de P à la droite", "Coupe z = 0 en"]); var nt = k.note("", "ok");
    var P = [-2, 2, 3];
    function sn(x){ return Math.round(x * 2) / 2; }
    V.handles.push({col:C.blue, get:function(){ return [ax.value, ay.value, az.value]; }, set:function(x, y){ ax.set(sn(x)); ay.set(sn(y)); }});
    V.handles.push({col:C.pink, get:function(){ return P; }, set:function(x, y){ P[0] = Math.max(-4, Math.min(4, sn(x))); P[1] = Math.max(-4, Math.min(4, sn(y))); }});
    var lp = k.loop(function(dt){ var t = st.value + 1.2 * dt; if (t > 4) t = -4; st.set(t); k.redraw(); });
    k.button("▶ Faire avancer M", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.draw(function(){
      c.clear(); V.fit(); var A = [ax.value, ay.value, az.value], d = [dx.value, dy.value, dz.value], t = st.value, nd = U.norm3(d), O = [0, 0, 0];
      V.axes(5, null, {step:1});
      if (nd < 1e-9){ V.dot(A, 5, C.blue, "A"); ro.set(0, "d = 0"); for (var q = 1; q < 6; q++) ro.set(q, "—"); nt.set("d = (0 ; 0 ; 0) n'est pas un vecteur directeur : choisis d ≠ 0.", "bad"); return; }
      var L = 12 / nd, a = U.sub3(A, U.mul3(d, L)), b = U.add3(A, U.mul3(d, L)); V.line(a, b, C.blue, 2.4);
      var M = U.add3(A, U.mul3(d, t)); V.arrow(A, U.add3(A, d), C.violet, 3, "d"); V.dot(A, 4.5, C.blue, "A", 10, 12); V.dot(M, 6, C.red, "M(t)"); V.hand();
      var dis = null;
      if (tp.value){ var AP = U.sub3(P, A), cr = U.cross3(AP, d), tt = U.dot3(AP, d) / (nd * nd), Hf = U.add3(A, U.mul3(d, tt)); dis = U.norm3(cr) / nd; V.dot(P, 5, C.pink, "P", 10, -10); V.line(P, Hf, C.green, 2, [5, 3]); V.dot(Hf, 4, C.green, "", 0, 0); }
      var z0 = null; if (Math.abs(d[2]) > 1e-9){ var t0 = -A[2] / d[2]; z0 = U.add3(A, U.mul3(d, t0)); if (th.value && Math.abs(z0[0]) < 7 && Math.abs(z0[1]) < 7) V.dot(z0, 4.5, C.amber, "z = 0", 10, 12); }
      function eq(a0, d0, n){ return n + "(t) = " + fx(a0, 1) + (d0 < 0 ? " − " : " + ") + fx(Math.abs(d0), 1) + "·t"; }
      ro.set(0, U.v3s(M, 2)); ro.set(1, eq(A[0], d[0], "x")); ro.set(2, eq(A[1], d[1], "y")); ro.set(3, eq(A[2], d[2], "z")); ro.set(4, dis == null ? "—" : fx(dis, 3)); ro.set(5, z0 ? "t = " + fx(-A[2] / d[2], 2) + " : " + U.v3s(z0, 2) : "jamais (parallèle à z = 0)");
      nt.set(z0 ? "La droite traverse le plan z = 0 au point " + U.v3s(z0, 2) + "." : "d_z = 0 : la droite reste à la hauteur constante z = " + fx(A[2], 1) + ", parallèle au plan z = 0.", z0 ? "ok" : "warn");
    });
  }
});

/* ---------- 5. plan et droite ---------- */
SFA.sim({
  id:"um-c07-plan-droite", ch:"c07", titre:"Un plan, sa normale et sa rencontre avec une droite", tag:"Vecteurs et droites",
  resume:"Dans ax + by + cz = d, le triplet (a, b, c) est la normale ; calcule la distance à l'origine et le point d'impact d'une droite.",
  but:"Fais varier a, b, c, d : le plan pivote, la normale (verte) change et le plan se déplace. Choisis une droite : son point de rencontre avec le plan est calculé (t = (d − n·A)/(n·d)), ou bien la droite est parallèle au plan.",
  aRetenir:"Plan : ax + by + cz = d, normale n = (a ; b ; c). Distance de l'origine : |d|/‖n‖. Distance d'un point P : |n·P − d|/‖n‖. Droite A + t·v : n·(A + tv) = d donne t = (d − n·A)/(n·v) si n·v ≠ 0.",
  piege:"Si n·v = 0 la droite est parallèle au plan : soit elle ne le coupe jamais, soit elle est entièrement contenue dans le plan (si A est dans le plan).",
  build:function(k, S){
    var U = UMB, C = U.C, fx = U.fx, c = k.canvas(0, {ratio:0.74}), V = U.View3(k, c, {range:4.6, az:0.9, el:0.5}); V.attach();
    var sa = k.slider("a", -3, 3, 0.5, 1, ""), sb = k.slider("b", -3, 3, 0.5, 2, ""), sc = k.slider("c", -3, 3, 0.5, 1, ""), sd = k.slider("d", -8, 8, 0.5, 3, "");
    var ln = k.select("Droite", [["0", "A(−3 ; −2 ; 4), v(1 ; 1 ; −1,5)"], ["1", "A(2 ; −3 ; 0), v(0 ; 1 ; 1)"], ["2", "A(0 ; 0 ; 4), v(2 ; −1 ; 0)"], ["3", "Aucune droite"]], "0");
    var gd = k.toggle("Défi : fais passer le plan par le point Q(1 ; 2 ; 1)", false);
    var ro = k.readouts(["Normale n", "Distance de O au plan", "Valeur t d'impact", "Point d'impact", "n·v"]); var nt = k.note("", "ok");
    var LS = [[[-3, -2, 4], [1, 1, -1.5]], [[2, -3, 0], [0, 1, 1]], [[0, 0, 4], [2, -1, 0]]];
    k.draw(function(){
      c.clear(); V.fit(); var n = [sa.value, sb.value, sc.value], d = sd.value, nn = U.norm3(n), O = [0, 0, 0]; V.axes(5, null, {step:1});
      if (nn < 1e-9){ ro.set(0, "(0 ; 0 ; 0)"); for (var q = 1; q < 5; q++) ro.set(q, "—"); nt.set("n = 0 : l'équation 0 = d ne décrit pas un plan. Choisis (a ; b ; c) ≠ 0.", "bad"); return; }
      var li = ln.value === "3" ? null : LS[+ln.value], t = null, hit = null, dn = null;
      var foot = U.mul3(n, d / (nn * nn));
      if (li){ var A = li[0], v = li[1]; dn = U.dot3(n, v); if (Math.abs(dn) > 1e-9){ t = (d - U.dot3(n, A)) / dn; hit = U.add3(A, U.mul3(v, t)); } }
      /* côté éloigné de la droite d'abord, puis plan, puis côté proche */
      function seg(A, v, t0, t1, col){ V.line(U.add3(A, U.mul3(v, t0)), U.add3(A, U.mul3(v, t1)), col, 2.6); }
      var far = null;
      if (li){ var A2 = li[0], v2 = li[1]; if (t != null){ var pa = V.p.apply(null, U.add3(A2, U.mul3(v2, t - 1))), pb = V.p.apply(null, U.add3(A2, U.mul3(v2, t + 1))); far = pa.d > pb.d ? -1 : 1; seg(A2, v2, far < 0 ? -6 : t, far < 0 ? t : 6, "rgba(30,63,143,.9)"); } else seg(A2, v2, -6, 6, C.blue); }
      patch(V, n, d, 3.6, "rgba(46,107,85,.18)", "rgba(46,107,85,.7)");
      if (li && t != null){ var A3 = li[0], v3 = li[1]; seg(A3, v3, far < 0 ? t : -6, far < 0 ? 6 : t, C.blue); V.dot(hit, 6, C.red, "impact", 10, -12); }
      if (gd.value){ var Q = [1, 2, 1], gap = U.dot3(n, Q) - d, okq = Math.abs(gap) < 0.26; V.dot(Q, 6, okq ? C.green : C.amber, "Q", 10, -12); }
      V.arrow(foot, U.add3(foot, U.mul3(n, 1.5 / nn)), C.green, 3, "n"); V.dot(foot, 4, C.amber, "", 0, 0); V.line(O, foot, C.amber, 1.4, [4, 3]);
      ro.set(0, U.v3s(n, 1)); ro.set(1, fx(Math.abs(d) / nn, 3)); ro.set(2, t == null ? "—" : fx(t, 3)); ro.set(3, hit ? U.v3s(hit, 2) : "—"); ro.set(4, dn == null ? "—" : fx(dn, 3));
      if (gd.value){ var gp = U.dot3(n, [1, 2, 1]) - d; nt.set(Math.abs(gp) < 0.26 ? "Q est dans le plan : n·Q = d, soit " + fx(n[0], 1) + "·1 + " + fx(n[1], 1) + "·2 + " + fx(n[2], 1) + "·1 = " + fx(d, 1) + ". Beaucoup de plans passent par Q : seule la condition n·Q = d compte." : "n·Q − d = " + fx(gp, 1) + " : Q n'est pas dans le plan. Règle d (ou la normale) pour annuler cet écart.", Math.abs(gp) < 0.26 ? "ok" : "warn"); return; }
      nt.set(!li ? "Aucune droite choisie : seul le plan est représenté. Son équation est " + fx(n[0], 1) + "x + " + fx(n[1], 1) + "y + " + fx(n[2], 1) + "z = " + fx(d, 1) + "." : t == null ? (Math.abs(U.dot3(n, li[0]) - d) < 1e-9 ? "n·v = 0 et A est dans le plan : la droite est contenue dans le plan." : "n·v = 0 : la droite est parallèle au plan et ne le coupe pas.") : "La droite perce le plan au point " + U.v3s(hit, 2) + " (t = " + fx(t, 2) + ").", li && t == null ? "warn" : "ok");
    });
  }
});

})();
