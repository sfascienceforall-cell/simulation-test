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
var U = UMB, C = U.C, fx = U.fx, rgba = U.rgba, D = SFA.draw, F = SFA.fmt, PI = Math.PI;
/* ---- fonctions de deux variables ---- */
var FUN = {
  par:{nom:"Paraboloïde : z = x² + y²", L:2.4, f:function(x, y){ return x * x + y * y; }},
  sel:{nom:"Selle : z = x² − y²", L:2.4, f:function(x, y){ return x * x - y * y; }},
  gau:{nom:"Colline gaussienne : z = 3·e^(−(x² + y²)/2)", L:3.2, f:function(x, y){ return 3 * Math.exp(-(x * x + y * y) / 2); }},
  vag:{nom:"Vagues : z = sin x · cos y", L:3.4, f:function(x, y){ return Math.sin(x) * Math.cos(y); }},
  col:{nom:"Deux collines (somme de deux gaussiennes)", L:3.4, f:function(x, y){ return 2 * Math.exp(-((x - 1.2) * (x - 1.2) + y * y)) + 1.5 * Math.exp(-((x + 1.3) * (x + 1.3) + (y + 0.9) * (y + 0.9)) / 1.3); }},
  puits:{nom:"Double puits : z = (x² − 1)² + y²", L:1.9, f:function(x, y){ return (x * x - 1) * (x * x - 1) + y * y; }},
  plan:{nom:"Plan incliné : z = 0,5x + 0,3y", L:3, f:function(x, y){ return 0.5 * x + 0.3 * y; }}
};
var ZR = {};
function zrange(key, fn){ if (ZR[key]) return ZR[key]; var mn = 1e9, mx = -1e9, n = 40, i, j; for (i = 0; i <= n; i++) for (j = 0; j <= n; j++){ var z = fn.f(-fn.L + 2 * fn.L * i / n, -fn.L + 2 * fn.L * j / n); if (z < mn) mn = z; if (z > mx) mx = z; } if (mx - mn < 1e-9) mx = mn + 1; ZR[key] = [mn, mx]; return ZR[key]; }
var STOPS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
function cmap(u){ u = Math.max(0, Math.min(1, u)); var x = u * 4, i = Math.min(3, Math.floor(x)), t = x - i, a = STOPS[i], b = STOPS[i + 1]; return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }
function fd1(f, x, y){ var h = 1e-4; return [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)]; }
function fd2(f, x, y){ var h = 1e-3, f0 = f(x, y); return {xx:(f(x + h, y) - 2 * f0 + f(x - h, y)) / (h * h), yy:(f(x, y + h) - 2 * f0 + f(x, y - h)) / (h * h), xy:(f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h)}; }
function mapP(c, bx, by, bw, bh, L){ var s = Math.min(bw, bh) - 14, k = s / (2 * L), cx = bx + bw / 2, cy = by + bh / 2; return {k:k, cx:cx, cy:cy, bx:bx, by:by, bw:bw, bh:bh, L:L, X:function(x){ return cx + x * k; }, Y:function(y){ return cy - y * k; }, ix:function(px){ return (px - cx) / k; }, iy:function(py){ return (cy - py) / k; }}; }
var HC = {};
function heat(c, P, f, L, zr, key){
  var n = 72, h = HC[key]; if (!h){ h = document.createElement("canvas"); h.width = n; h.height = n; var g = h.getContext("2d"), im = g.createImageData(n, n), i, j; for (j = 0; j < n; j++) for (i = 0; i < n; i++){ var z = f(-L + 2 * L * (i + 0.5) / n, L - 2 * L * (j + 0.5) / n), col = cmap((z - zr[0]) / (zr[1] - zr[0])), q = 4 * (j * n + i); im.data[q] = col[0]; im.data[q + 1] = col[1]; im.data[q + 2] = col[2]; im.data[q + 3] = 255; } g.putImageData(im, 0, 0); HC[key] = h; var ks = Object.keys(HC); if (ks.length > 40) delete HC[ks[0]]; }
  var ctx = c.ctx; ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(h, P.X(-L), P.Y(L), P.X(L) - P.X(-L), P.Y(-L) - P.Y(L)); ctx.restore();
}
function gridVals(f, L, n){ var Z = [], i, j; for (i = 0; i <= n; i++){ Z.push([]); for (j = 0; j <= n; j++) Z[i].push(f(-L + 2 * L * i / n, -L + 2 * L * j / n)); } return Z; }
function segsAt(Z, L, n, lev){
  var out = [], i, j; function ip(a, b, x0, y0, x1, y1){ var t = (lev - a) / (b - a); return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]; }
  for (i = 0; i < n; i++) for (j = 0; j < n; j++){
    var x0 = -L + 2 * L * i / n, x1 = -L + 2 * L * (i + 1) / n, y0 = -L + 2 * L * j / n, y1 = -L + 2 * L * (j + 1) / n, a = Z[i][j], b = Z[i + 1][j], cc = Z[i + 1][j + 1], d = Z[i][j + 1], pts = [];
    if ((a < lev) !== (b < lev)) pts.push(ip(a, b, x0, y0, x1, y0)); if ((b < lev) !== (cc < lev)) pts.push(ip(b, cc, x1, y0, x1, y1)); if ((d < lev) !== (cc < lev)) pts.push(ip(d, cc, x0, y1, x1, y1)); if ((a < lev) !== (d < lev)) pts.push(ip(a, d, x0, y0, x0, y1));
    if (pts.length === 2) out.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]); else if (pts.length === 4){ out.push([pts[0][0], pts[0][1], pts[3][0], pts[3][1]]); out.push([pts[1][0], pts[1][1], pts[2][0], pts[2][1]]); }
  }
  return out;
}
function drawSegs(c, P, segs, col, w){ var ctx = c.ctx; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); segs.forEach(function(s){ ctx.moveTo(P.X(s[0]), P.Y(s[1])); ctx.lineTo(P.X(s[2]), P.Y(s[3])); }); ctx.stroke(); }
function mapFrame(c, P, L){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.lineWidth = 1.2; ctx.strokeRect(P.X(-L), P.Y(L), P.X(L) - P.X(-L), P.Y(-L) - P.Y(L)); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P.X(-L), P.Y(0)); ctx.lineTo(P.X(L), P.Y(0)); ctx.moveTo(P.X(0), P.Y(-L)); ctx.lineTo(P.X(0), P.Y(L)); ctx.stroke(); ctx.restore();
  D.text(c, "x", P.X(L) + 9, P.Y(0), {size:12, color:C.grey}); D.text(c, "y", P.X(0), P.Y(L) - 8, {size:12, color:C.grey}); D.text(c, F(L, 1), P.X(L), P.Y(0) + 11, {size:9, color:C.grey}); D.text(c, "−" + F(L, 1), P.X(-L), P.Y(0) + 11, {size:9, color:C.grey}); }
function colorbar(c, x, y, w, h, zr){ var ctx = c.ctx, i; for (i = 0; i < h; i++){ var col = cmap(1 - i / h); ctx.fillStyle = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")"; ctx.fillRect(x, y + i, w, 1.5); } ctx.strokeStyle = "rgba(15,27,45,.4)"; ctx.strokeRect(x, y, w, h); D.text(c, F(zr[1], 1), x + w / 2, y - 8, {size:10, color:C.ink}); D.text(c, F(zr[0], 1), x + w / 2, y + h + 9, {size:10, color:C.ink}); D.text(c, "z", x + w / 2, y - 20, {size:10, color:C.grey}); }
/* surface 3D en facettes triées (algorithme du peintre) */
function surf3(c, V, f, L, zr, o){
  var n = o.n || 32, ctx = c.ctx, zk = o.zk, zc = o.zc, Z = [], Pp = [], i, j, quads = [];
  for (i = 0; i <= n; i++){ Z.push([]); Pp.push([]); for (j = 0; j <= n; j++){ var x = -L + 2 * L * i / n, y = -L + 2 * L * j / n, z = f(x, y); if (o.clampZ) z = Math.max(zr[0] - 1e-9, Math.min(zr[1] + 1e-9, z)); Z[i].push(z); Pp[i].push(V.p(x, y, (z - zc) * zk)); } }
  for (i = 0; i < n; i++) for (j = 0; j < n; j++) quads.push([i, j, Pp[i][j].d + Pp[i + 1][j].d + Pp[i + 1][j + 1].d + Pp[i][j + 1].d]);
  quads.sort(function(a, b){ return b[2] - a[2]; });
  var lx = -0.45, ly = -0.35, lz = 0.82, st = 2 * L / n;
  quads.forEach(function(q){ var a = q[0], b = q[1], z00 = Z[a][b], z10 = Z[a + 1][b], z11 = Z[a + 1][b + 1], z01 = Z[a][b + 1], zm = (z00 + z10 + z11 + z01) / 4;
    var gx = ((z10 - z00) + (z11 - z01)) / (2 * st) * zk, gy = ((z01 - z00) + (z11 - z10)) / (2 * st) * zk, nn = Math.sqrt(gx * gx + gy * gy + 1), sh = (-gx * lx - gy * ly + lz) / nn, br = 0.62 + 0.42 * Math.max(0, sh), col = cmap((zm - zr[0]) / (zr[1] - zr[0]));
    ctx.beginPath(); ctx.moveTo(Pp[a][b].x, Pp[a][b].y); ctx.lineTo(Pp[a + 1][b].x, Pp[a + 1][b].y); ctx.lineTo(Pp[a + 1][b + 1].x, Pp[a + 1][b + 1].y); ctx.lineTo(Pp[a][b + 1].x, Pp[a][b + 1].y); ctx.closePath();
    ctx.fillStyle = "rgb(" + Math.min(255, Math.round(col[0] * br)) + "," + Math.min(255, Math.round(col[1] * br)) + "," + Math.min(255, Math.round(col[2] * br)) + ")"; ctx.fill(); ctx.strokeStyle = o.wire ? "rgba(15,27,45,.4)" : ctx.fillStyle; ctx.lineWidth = o.wire ? 0.8 : 0.7; ctx.stroke(); });
}
function box3(V, L, zlo, zhi){ var a = "rgba(15,27,45,.28)", cs = [[-L, -L], [L, -L], [L, L], [-L, L]], i; for (i = 0; i < 4; i++){ var p = cs[i], q = cs[(i + 1) % 4]; V.line([p[0], p[1], zlo], [q[0], q[1], zlo], a, 1.2); V.line([p[0], p[1], zlo], [p[0], p[1], zhi], "rgba(15,27,45,.12)", 1); V.line([p[0], p[1], zhi], [q[0], q[1], zhi], "rgba(15,27,45,.12)", 1); }
  V.arrow([L, -L, zlo], [L + 0.9, -L, zlo], "#5f6b7a", 1.4, "x"); V.arrow([L, L, zlo], [L, L + 0.9, zlo], "#5f6b7a", 1.4, "y"); V.arrow([-L, -L, zlo], [-L, -L, zlo + (zhi - zlo) * 0.5], "#5f6b7a", 1.4, "z"); }
function fnOptions(keys){ return keys.map(function(k2){ return [k2, FUN[k2].nom]; }); }
function V3(k, c, hook, o){ var V = U.View3(k, c, o); V.attach(hook); return V; }
function setView(V, c, h1, L, zoom){ V.range = L * 1.55 / (zoom || 1); V.s = Math.min(c.W * 0.5, h1 * 0.5) / V.range; V.yoff = h1 / 2 - c.H / 2 - 4; }
function zinfo(key, fn, V){ var zr = zrange(key, fn), zc = (zr[0] + zr[1]) / 2, zk = fn.L * 0.75 / Math.max(1e-9, (zr[1] - zr[0]) / 2); return {zr:zr, zc:zc, zk:zk, zlo:(zr[0] - zc) * zk - 0.05, zhi:(zr[1] - zc) * zk + 0.05}; }

/* ---------- 1. surface et courbes de niveau ---------- */
SFA.sim({
  id:"um-c10-surface-niveaux", ch:"c10", titre:"Une surface z = f(x ; y) et ses courbes de niveau", tag:"Surfaces et niveaux",
  resume:"Fais tourner la surface, coupe-la par un plan horizontal z = c : la trace est une courbe de niveau, et la carte du dessous est la vue de dessus.",
  but:"Choisis une fonction et fais tourner la surface en glissant la souris sur la partie haute. Le curseur règle la hauteur c du plan : son intersection avec la surface (en rouge) est la courbe de niveau f(x ; y) = c, reportée sur la carte. Clique sur la carte pour placer un point : c prend la valeur de f en ce point. Courbes serrées = pente forte.",
  aRetenir:"Le graphe de f est la surface z = f(x ; y). Une courbe de niveau est l'ensemble {(x ; y) : f(x ; y) = c} ; ses points ont tous la même altitude. Les courbes de niveau ne se coupent jamais (sauf aux points critiques) et sont serrées là où la surface est raide.",
  piege:"Une carte de niveaux n'est pas la surface : deux collines et deux cuvettes peuvent avoir des cartes qui se ressemblent. Il faut lire les valeurs des niveaux (ou la couleur) pour savoir si l'on monte ou on descend.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.25}), h1 = 0, probe = {x:0.9, y:0.6}, lastKey = "";
    function setProbe(fn, p){ probe.x = Math.max(-fn.L, Math.min(fn.L, p.x)); probe.y = Math.max(-fn.L, Math.min(fn.L, p.y)); }
    var fsel = k.select("Fonction f(x ; y)", fnOptions(["gau", "par", "sel", "vag", "col", "puits", "plan"]), "gau", function(){ syncC(); });
    var cs = k.slider("Hauteur du plan : z = c", 0, 3, 0.02, 1.5, "");
    var tp = k.toggle("Montrer le plan z = c", true), tc = k.toggle("Courbe de niveau c (rouge)", true), tw = k.toggle("Quadrillage de la surface", false), tl = k.toggle("Plusieurs niveaux sur la carte", true);
    var lp = k.loop(function(dt){ var r = cs.el, mn = +r.min, mx = +r.max, v = cs.value + (mx - mn) * 0.12 * dt; if (v > mx) v = mn; cs.set(v); k.redraw(); });
    k.button("▶ Balayer le plan", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var ro = k.readouts(["f au point cliqué", "Niveau c", "Point cliqué", "Altitude min ; max"]); var nt = k.note("", "ok");
    function syncC(){ var fn = FUN[fsel.value], zr = zrange(fsel.value, fn); cs.el.min = zr[0]; cs.el.max = zr[1]; cs.el.step = (zr[1] - zr[0]) / 100; cs.set(zr[0] + (zr[1] - zr[0]) * 0.45); setProbe(fn, probe); }
    syncC();
    var V = V3(k, c, function(t, pp){ if (t === "down" && pp.y > h1 + 2){ return true; } if (t === "drag" || t === "down"){ var fn = FUN[fsel.value], P = c._P; if (P && pp.y > h1){ setProbe(fn, {x:P.ix(pp.x), y:P.iy(pp.y)}); cs.set(fn.f(probe.x, probe.y)); } } return false; }, {az:0.8, el:0.62});
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, key = fsel.value, fn = FUN[key], L = fn.L, zi = zinfo(key, fn), zr = zi.zr; h1 = Math.round(H * 0.54); setView(V, c, h1, L); var cv = cs.value;
      box3(V, L, zi.zlo, zi.zhi); surf3(c, V, fn.f, L, zr, {zk:zi.zk, zc:zi.zc, n:34, wire:tw.value});
      var Zg = gridVals(fn.f, L, 64), zcv = (cv - zi.zc) * zi.zk;
      if (tp.value){ V.poly([[-L, -L, zcv], [L, -L, zcv], [L, L, zcv], [-L, L, zcv]], "rgba(180,35,24,.13)", "rgba(180,35,24,.55)", 1.4); }
      if (tc.value){ segsAt(Zg, L, 64, cv).forEach(function(s){ V.line([s[0], s[1], zcv], [s[2], s[3], zcv], C.red, 3); }); }
      var pz = fn.f(probe.x, probe.y); V.dot([probe.x, probe.y, (pz - zi.zc) * zi.zk], 5.5, "#fff"); V.dot([probe.x, probe.y, (pz - zi.zc) * zi.zk], 3.5, C.ink);
      D.text(c, "Glisse pour faire tourner", 10, 14, {size:11, color:C.grey, align:"left"});
      /* carte */
      var P = mapP(c, 0, h1 + 6, W, H - h1 - 6, L); c._P = P; P.X0 = P.X; heat(c, P, fn.f, L, zr, key + "|h");
      if (tl.value){ var nl = 9, q; for (q = 1; q < nl; q++){ var lv = zr[0] + (zr[1] - zr[0]) * q / nl; drawSegs(c, P, segsAt(Zg, L, 64, lv), "rgba(255,255,255,.55)", 1); } }
      if (tc.value) drawSegs(c, P, segsAt(Zg, L, 64, cv), C.red, 3);
      mapFrame(c, P, L); D.dot(c, P.X(probe.x), P.Y(probe.y), 6.5, "#fff"); D.dot(c, P.X(probe.x), P.Y(probe.y), 4, C.ink);
      colorbar(c, Math.min(W - 26, P.X(L) + 26), P.Y(L) + 14, 12, P.Y(-L) - P.Y(L) - 28, zr);
      D.text(c, "Carte des niveaux", 10, h1 + 20, {size:11, color:C.grey, align:"left"}); D.text(c, "(clique pour placer", 10, h1 + 34, {size:10, color:C.grey, align:"left"}); D.text(c, "un point)", 10, h1 + 46, {size:10, color:C.grey, align:"left"});
      ro.set(0, fx(pz, 3)); ro.set(1, fx(cv, 3)); ro.set(2, "(" + fx(probe.x, 2) + " ; " + fx(probe.y, 2) + ")"); ro.set(3, fx(zr[0], 2) + " ; " + fx(zr[1], 2));
      var empty = segsAt(Zg, L, 64, cv).length === 0;
      nt.set(empty ? "Aucun point de la fenêtre n'a l'altitude c = " + fx(cv, 2) + " : la courbe de niveau est vide." : key === "plan" ? "Pour un plan, les courbes de niveau sont des droites parallèles régulièrement espacées." : key === "sel" ? "Au niveau c = 0, la courbe de niveau est formée de deux droites qui se croisent (y = ±x) : c'est le point-selle." : "La courbe rouge est l'ensemble des points (x ; y) tels que f(x ; y) = " + fx(cv, 2) + ".", empty ? "warn" : "ok");
    });
  }
});

/* ---------- 2. dérivées partielles ---------- */
function graph1(c, bx, by, bw, bh, f, x0, x1, xp, col, name, h, sec){
  var ctx = c.ctx, i, n = 80, ys = [], mn = 1e9, mx = -1e9, fp = f(xp), dfp = (f(xp + 1e-4) - f(xp - 1e-4)) / 2e-4;
  for (i = 0; i <= n; i++){ var v = f(x0 + (x1 - x0) * i / n); ys.push(v); mn = Math.min(mn, v); mx = Math.max(mx, v); } var pad = (mx - mn) * 0.18 + 0.1; mn -= pad; mx += pad;
  var X = function(x){ return bx + 26 + (x - x0) / (x1 - x0) * (bw - 38); }, Y = function(y){ return by + bh - 20 - (y - mn) / (mx - mn) * (bh - 40); };
  ctx.save(); ctx.strokeStyle = C.light; ctx.lineWidth = 1; ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8); if (mn < 0 && mx > 0){ ctx.strokeStyle = "#cfd5dd"; ctx.beginPath(); ctx.moveTo(bx + 26, Y(0)); ctx.lineTo(bx + bw - 12, Y(0)); ctx.stroke(); }
  ctx.beginPath(); ctx.rect(bx + 5, by + 5, bw - 10, bh - 10); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); ys.forEach(function(v, j){ var xx = X(x0 + (x1 - x0) * j / n), yy = Y(v); if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }); ctx.stroke();
  var a = Math.max(x0, xp - 0.9), b = Math.min(x1, xp + 0.9); ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(a), Y(fp + dfp * (a - xp))); ctx.lineTo(X(b), Y(fp + dfp * (b - xp))); ctx.stroke();
  if (sec && xp + h <= x1 + 1e-9){ var f2 = f(xp + h), sl = (f2 - fp) / h; ctx.strokeStyle = C.violet; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(a), Y(fp + sl * (a - xp))); ctx.lineTo(X(b + h), Y(fp + sl * (b + h - xp))); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C.violet; ctx.beginPath(); ctx.arc(X(xp + h), Y(f2), 4, 0, 7); ctx.fill(); }
  ctx.restore(); D.dot(c, X(xp), Y(fp), 6, col); D.text(c, name, bx + 14, by + 16, {size:11, color:col, align:"left"}); D.text(c, "pente = " + fx(dfp, 3), bx + bw - 12, by + 16, {size:11, color:C.amber, align:"right"});
  return {X:X, ix:function(px){ return x0 + (px - bx - 26) / (bw - 38) * (x1 - x0); }};
}
SFA.sim({
  id:"um-c10-derivees-partielles", ch:"c10", titre:"Dérivées partielles : deux coupes, deux pentes, un plan tangent", tag:"Dérivées partielles",
  resume:"Fixe y et la surface devient une courbe en x dont la pente est ∂f/∂x ; fixe x et c'est ∂f/∂y. Les deux tangentes engendrent le plan tangent.",
  but:"Place le point (x₀ ; y₀) avec les curseurs ou en glissant la souris sur un des deux petits graphes du bas. La coupe rouge est la courbe z = f(x ; y₀), la coupe bleue z = f(x₀ ; y). Active la sécante et diminue le pas h : le quotient (f(x₀ + h ; y₀) − f(x₀ ; y₀))/h tend vers ∂f/∂x.",
  aRetenir:"∂f/∂x (x₀ ; y₀) = lim f(x₀ + h ; y₀) − f(x₀ ; y₀) sur h quand h → 0 : on dérive par rapport à x en traitant y comme une constante. Plan tangent : z = f₀ + ∂f/∂x·(x − x₀) + ∂f/∂y·(y − y₀). Il approxime f près du point.",
  piege:"Les deux dérivées partielles existent parfois sans que f soit différentiable (le plan tangent peut ne pas exister). Et ∂f/∂x n'est pas la pente « dans la direction de la plus grande pente » : celle-ci est donnée par le gradient (voir la simulation suivante).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.25}), h1 = 0, gl = null, gr = null;
    var fsel = k.select("Fonction f(x ; y)", fnOptions(["gau", "par", "sel", "vag", "col", "puits"]), "col", function(){ fix(); });
    var sx = k.slider("x₀", -3, 3, 0.05, 0.6, ""), sy = k.slider("y₀", -3, 3, 0.05, 0.4, ""), sh = k.slider("Pas h de la sécante", 0.05, 1.5, 0.05, 0.6, "");
    var tc = k.toggle("Coupes z = f(x ; y₀) et z = f(x₀ ; y)", true), tt = k.toggle("Plan tangent", true), ts = k.toggle("Sécante de pas h (violet)", false);
    var ro = k.readouts(["f(x₀ ; y₀)", "∂f/∂x", "∂f/∂y", "Quotient (f(x₀ + h ; y₀) − f₀)/h", "Plan tangent"]); var nt = k.note("", "ok");
    function fix(){ var L = FUN[fsel.value].L; sx.el.min = -L; sx.el.max = L; sy.el.min = -L; sy.el.max = L; sx.set(Math.max(-L, Math.min(L, sx.value))); sy.set(Math.max(-L, Math.min(L, sy.value))); } fix();
    var V = V3(k, c, function(t, pp){ if (t === "down" && pp.y > h1) return true; if ((t === "drag" || t === "down") && pp.y > h1){ var L = FUN[fsel.value].L; if (pp.x < c.W / 2 && gl) sx.set(Math.max(-L, Math.min(L, gl.ix(pp.x)))); else if (gr) sy.set(Math.max(-L, Math.min(L, gr.ix(pp.x)))); } return false; }, {az:0.85, el:0.55});
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, key = fsel.value, fn = FUN[key], L = fn.L, zi = zinfo(key, fn), zr = zi.zr, x0 = sx.value, y0 = sy.value; h1 = Math.round(H * 0.58); setView(V, c, h1, L);
      var f = fn.f, f0 = f(x0, y0), g = fd1(f, x0, y0), zz = function(z){ return (z - zi.zc) * zi.zk; }, i, n = 60;
      box3(V, L, zi.zlo, zi.zhi); surf3(c, V, f, L, zr, {zk:zi.zk, zc:zi.zc, n:32});
      if (tt.value){ var w = Math.min(0.8, L * 0.3), pts = [[-w, -w], [w, -w], [w, w], [-w, w]].map(function(q){ return [x0 + q[0], y0 + q[1], zz(f0 + g[0] * q[0] + g[1] * q[1])]; }); V.poly(pts, "rgba(180,83,9,.30)", "rgba(180,83,9,.9)", 1.6); }
      if (tc.value){ for (i = 0; i < n; i++){ var xa = -L + 2 * L * i / n, xb = -L + 2 * L * (i + 1) / n; V.line([xa, y0, zz(f(xa, y0))], [xb, y0, zz(f(xb, y0))], C.red, 3); V.line([x0, xa, zz(f(x0, xa))], [x0, xb, zz(f(x0, xb))], C.blue, 3); }
        var a = Math.min(0.9, L * 0.4); V.line([x0 - a, y0, zz(f0 - g[0] * a)], [x0 + a, y0, zz(f0 + g[0] * a)], "#7f1d1d", 2.2, [5, 3]); V.line([x0, y0 - a, zz(f0 - g[1] * a)], [x0, y0 + a, zz(f0 + g[1] * a)], "#1e3a8a", 2.2, [5, 3]); }
      V.dot([x0, y0, zz(f0)], 6.5, "#fff"); V.dot([x0, y0, zz(f0)], 4, C.ink); D.text(c, "Glisse pour faire tourner", 10, 14, {size:11, color:C.grey, align:"left"});
      var by = h1 + 4, bh = H - by - 2; gl = graph1(c, 0, by, W / 2, bh, function(x){ return f(x, y0); }, -L, L, x0, C.red, "coupe y = y₀", sh.value, ts.value); gr = graph1(c, W / 2, by, W / 2, bh, function(y){ return f(x0, y); }, -L, L, y0, C.blue, "coupe x = x₀", 0, false);
      var q = (f(x0 + sh.value, y0) - f0) / sh.value; ro.set(0, fx(f0, 3)); ro.set(1, fx(g[0], 3)); ro.set(2, fx(g[1], 3)); ro.set(3, fx(q, 3)); ro.set(4, "z = " + fx(f0, 2) + (g[0] >= 0 ? " + " : " − ") + fx(Math.abs(g[0]), 2) + "(x − " + fx(x0, 2) + ")" + (g[1] >= 0 ? " + " : " − ") + fx(Math.abs(g[1]), 2) + "(y − " + fx(y0, 2) + ")");
      nt.set(Math.abs(g[0]) < 0.02 && Math.abs(g[1]) < 0.02 ? "Les deux dérivées partielles sont (presque) nulles : le plan tangent est horizontal, c'est un point critique (sommet, creux ou col)." : "La tangente rouge a pour pente ∂f/∂x = " + fx(g[0], 2) + " ; la bleue ∂f/∂y = " + fx(g[1], 2) + ". " + (ts.value ? "Le quotient avec h = " + fx(sh.value, 2) + " vaut " + fx(q, 2) + " : il se rapproche de ∂f/∂x quand h diminue." : ""), "ok");
    });
  }
});

/* ---------- 3. gradient et dérivée directionnelle ---------- */
var GM = {};
function maxGrad(key, fn){ if (GM[key]) return GM[key]; var m = 1e-6, n = 30, i, j; for (i = 0; i <= n; i++) for (j = 0; j <= n; j++){ var g = fd1(fn.f, -fn.L + 2 * fn.L * i / n, -fn.L + 2 * fn.L * j / n); m = Math.max(m, Math.hypot(g[0], g[1])); } GM[key] = m; return m; }
function arrowMap(c, P, x0, y0, x1, y1, col, w, lab){ D.arrow(c, P.X(x0), P.Y(y0), P.X(x1), P.Y(y1), col, w); if (lab){ var dx = P.X(x1) - P.X(x0), dy = P.Y(y1) - P.Y(y0), l = Math.hypot(dx, dy) || 1; D.text(c, lab, P.X(x1) + dx / l * 14, P.Y(y1) + dy / l * 14, {size:13, color:col, bg:"rgba(255,255,255,.75)"}); } }
SFA.sim({
  id:"um-c10-gradient-directionnelle", ch:"c10", titre:"Le gradient : la direction de plus forte montée", tag:"Gradient",
  resume:"En chaque point, ∇f pointe vers la plus forte pente, perpendiculairement à la courbe de niveau ; la pente dans la direction u vaut ∇f·u.",
  but:"Fais glisser le point sur la carte (couleur = altitude, lignes blanches = niveaux). La flèche rouge est le gradient, la flèche bleue une direction u que tu règles avec l'angle θ. Le graphe du bas donne la pente D_u f selon θ : c'est une sinusoïde de maximum ‖∇f‖, atteinte quand u est aligné sur le gradient. Lance la montée : le point suit ∇f et coupe les niveaux à angle droit.",
  aRetenir:"∇f = (∂f/∂x ; ∂f/∂y). Dérivée dans la direction du vecteur unitaire u : D_u f = ∇f·u = ‖∇f‖ cos α (α = angle entre u et ∇f). Elle est maximale (= ‖∇f‖) pour u = ∇f/‖∇f‖, minimale pour −∇f, nulle le long de la courbe de niveau (u ⟂ ∇f).",
  piege:"Le gradient est un vecteur du plan de départ (x ; y), pas de l'espace (x ; y ; z) : il indique la direction à prendre sur la carte, il n'est pas tangent à la surface. Et u doit être unitaire pour que D_u f soit une vraie pente.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.2}), P = null, GP = null, h1 = 0, probe = {x:0.8, y:0.7}, trail = [], mode = 0, own = "";
    var fsel = k.select("Fonction f(x ; y)", fnOptions(["col", "gau", "par", "sel", "vag", "puits", "plan"]), "col", function(){ var L = FUN[fsel.value].L; probe.x = Math.max(-L, Math.min(L, probe.x)); probe.y = Math.max(-L, Math.min(L, probe.y)); trail = []; });
    var th = k.slider("Direction de u : θ", 0, 360, 1, 40, "°");
    var lp = k.loop(function(dt){ if (!mode) return; var fn = FUN[fsel.value], g = fd1(fn.f, probe.x, probe.y), n = Math.hypot(g[0], g[1]); if (n < 0.02){ lp.pause(); k.redraw(); return; } var sp = 0.9 * dt; probe.x += mode * g[0] / n * sp; probe.y += mode * g[1] / n * sp; if (Math.abs(probe.x) > fn.L || Math.abs(probe.y) > fn.L){ probe.x = Math.max(-fn.L, Math.min(fn.L, probe.x)); probe.y = Math.max(-fn.L, Math.min(fn.L, probe.y)); lp.pause(); } trail.push([probe.x, probe.y]); if (trail.length > 400) trail.shift(); k.redraw(); });
    k.button("▶ Monter (suivre +∇f)", function(){ mode = 1; if (!trail.length) trail.push([probe.x, probe.y]); lp.play(); }, true); k.button("▶ Descendre (suivre −∇f)", function(){ mode = -1; if (!trail.length) trail.push([probe.x, probe.y]); lp.play(); });
    k.button("■ Stop", function(){ lp.pause(); mode = 0; }); k.button("u := ∇f/‖∇f‖", function(){ var g = fd1(FUN[fsel.value].f, probe.x, probe.y); if (Math.hypot(g[0], g[1]) > 1e-6) th.set((Math.atan2(g[1], g[0]) * 180 / PI + 360) % 360); }); k.button("Effacer la trajectoire", function(){ trail = []; });
    var tl = k.toggle("Niveaux (lignes blanches)", true), tn = k.toggle("Tangente à la courbe de niveau", true);
    var ro = k.readouts(["∇f", "‖∇f‖", "D_u f = ∇f · u", "Angle entre u et ∇f"]); var nt = k.note("", "ok");
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ var fn = FUN[fsel.value];
      if (t === "down"){ own = p.y > h1 ? "g" : (P && Math.hypot(P.X(probe.x) - p.x, P.Y(probe.y) - p.y) < 40 ? "p" : "p"); if (own === "p"){ lp.pause(); mode = 0; } }
      if ((t === "down" || t === "drag") && own === "p" && P){ probe.x = Math.max(-fn.L, Math.min(fn.L, P.ix(p.x))); probe.y = Math.max(-fn.L, Math.min(fn.L, P.iy(p.y))); trail = []; k.redraw(); }
      if ((t === "down" || t === "drag") && own === "g" && GP){ th.set(Math.max(0, Math.min(360, (p.x - GP.bx) / GP.bw * 360))); k.redraw(); }
      if (t === "up") own = ""; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, key = fsel.value, fn = FUN[key], L = fn.L, zr = zrange(key, fn); h1 = Math.round(H * 0.66);
      P = mapP(c, 0, 0, W, h1, L); heat(c, P, fn.f, L, zr, key + "|h"); var Zg = gridVals(fn.f, L, 64), i;
      if (tl.value) for (i = 1; i < 9; i++) drawSegs(c, P, segsAt(Zg, L, 64, zr[0] + (zr[1] - zr[0]) * i / 9), "rgba(255,255,255,.5)", 1);
      var g = fd1(fn.f, probe.x, probe.y), ng = Math.hypot(g[0], g[1]), pz = fn.f(probe.x, probe.y); drawSegs(c, P, segsAt(Zg, L, 64, pz), "#fff", 3); drawSegs(c, P, segsAt(Zg, L, 64, pz), C.ink, 1.2); mapFrame(c, P, L);
      if (trail.length > 1){ ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); trail.forEach(function(q, j){ if (j) ctx.lineTo(P.X(q[0]), P.Y(q[1])); else ctx.moveTo(P.X(q[0]), P.Y(q[1])); }); ctx.stroke(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.stroke(); }
      var al = th.value * PI / 180, u = [Math.cos(al), Math.sin(al)], mg = maxGrad(key, fn), len = L * 0.42 * ng / mg;
      if (tn.value && ng > 1e-6){ var tx = -g[1] / ng, ty = g[0] / ng; D.line(c, P.X(probe.x - tx * L * 0.35), P.Y(probe.y - ty * L * 0.35), P.X(probe.x + tx * L * 0.35), P.Y(probe.y + ty * L * 0.35), "rgba(15,27,45,.7)", 1.6, [5, 4]); }
      arrowMap(c, P, probe.x, probe.y, probe.x + u[0] * L * 0.3, probe.y + u[1] * L * 0.3, "#93c5fd", 3.6, ""); arrowMap(c, P, probe.x, probe.y, probe.x + u[0] * L * 0.3, probe.y + u[1] * L * 0.3, C.blue, 2.4, "u");
      if (ng > 1e-6) { arrowMap(c, P, probe.x, probe.y, probe.x + g[0] / ng * Math.max(len, L * 0.08), probe.y + g[1] / ng * Math.max(len, L * 0.08), C.red, 3.4, "∇f"); }
      D.dot(c, P.X(probe.x), P.Y(probe.y), 7, "#fff"); D.dot(c, P.X(probe.x), P.Y(probe.y), 4.5, C.ink);
      /* graphe D_u f(θ) */
      var gx = 40, gw = W - 56, gy = h1 + (H - h1) * 0.5 + 8, gh = (H - h1) * 0.3; GP = {bx:gx, bw:gw, by:h1, bh:H - h1}; var amp = Math.max(ng, 0.05), phi = Math.atan2(g[1], g[0]);
      ctx.strokeStyle = C.light; ctx.lineWidth = 1; ctx.strokeRect(gx, gy - gh, gw, 2 * gh); ctx.strokeStyle = C.grey; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke(); ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(C.red, .5); ctx.beginPath(); ctx.moveTo(gx, gy - gh); ctx.lineTo(gx + gw, gy - gh); ctx.moveTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.violet; ctx.lineWidth = 2.6; ctx.beginPath(); for (i = 0; i <= 180; i++){ var q = i * 2 * PI / 180, v = Math.cos(q - phi) * (ng > 1e-6 ? 1 : 0); var X = gx + i / 180 * gw, Y = gy - v * gh; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke();
      var dv = g[0] * u[0] + g[1] * u[1]; D.dot(c, gx + th.value / 360 * gw, gy - (ng > 1e-6 ? dv / ng : 0) * gh, 6, C.blue);
      D.text(c, "D_u f en fonction de θ (amplitude = ‖∇f‖ = " + fx(ng, 2) + ")", gx + gw / 2, gy - gh - 12, {size:12, color:C.violet}); D.text(c, "+‖∇f‖", gx - 4, gy - gh, {size:10, color:C.red, align:"right"}); D.text(c, "−‖∇f‖", gx - 4, gy + gh, {size:10, color:C.red, align:"right"}); D.text(c, "0°", gx, gy + gh + 12, {size:10, color:C.grey}); D.text(c, "360°", gx + gw, gy + gh + 12, {size:10, color:C.grey});
      ro.set(0, "(" + fx(g[0], 2) + " ; " + fx(g[1], 2) + ")"); ro.set(1, fx(ng, 3)); ro.set(2, fx(dv, 3)); var ang = ng > 1e-6 ? Math.acos(Math.max(-1, Math.min(1, dv / ng))) * 180 / PI : 0; ro.set(3, ng > 1e-6 ? fx(ang, 1) + "°" : "—");
      nt.set(ng < 0.02 ? "∇f ≈ 0 : point critique (sommet, creux ou col). Aucune direction n'est privilégiée ; la courbe de niveau dégénère en point ou se croise." : Math.abs(dv) < 0.02 * ng ? "u ⟂ ∇f : tu avances le long de la courbe de niveau, l'altitude ne varie pas (D_u f = 0)." : dv >= ng * 0.999 ? "u est aligné sur ∇f : la pente est maximale, D_u f = ‖∇f‖." : "Pente dans la direction u : D_u f = ∇f·u = " + fx(dv, 2) + " (‖∇f‖ cos " + fx(ang, 0) + "° = " + fx(ng * Math.cos(ang * PI / 180), 2) + ").", "ok");
    });
  }
});

/* ---------- 4. points critiques et hessienne ---------- */
var F4 = {
  q:{nom:"Famille : z = x² + a·xy + y² (règle a)", L:2.2, f:function(x, y, a){ return x * x + a * x * y + y * y; }, crit:function(a){ return Math.abs(4 - a * a) < 2e-3 ? [] : [[0, 0]]; }},
  cub:{nom:"z = x³ − 3x + y²", L:2.4, f:function(x, y){ return x * x * x - 3 * x + y * y; }},
  sins:{nom:"z = sin x · sin y (damier)", L:3.4, f:function(x, y){ return Math.sin(x) * Math.sin(y); }},
  col:{nom:"Deux collines (somme de deux gaussiennes)", L:3.4, f:FUN.col.f},
  puits:{nom:"Double puits : z = (x² − 1)² + y²", L:1.9, f:FUN.puits.f},
  quart:{nom:"z = x⁴ + y⁴ (test de la hessienne inopérant)", L:1.5, f:function(x, y){ return x * x * x * x + y * y * y * y; }, crit:function(){ return [[0, 0]]; }}
};
function findCrit(f, L){
  var out = [], n = 8, i, j, it; for (i = 0; i <= n; i++) for (j = 0; j <= n; j++){ var x = -L + 2 * L * (i + 0.5) / (n + 1), y = -L + 2 * L * (j + 0.5) / (n + 1), ok = false;
    for (it = 0; it < 40; it++){ var g = fd1(f, x, y); if (Math.hypot(g[0], g[1]) < 1e-9){ ok = true; break; } var h = fd2(f, x, y), dt = h.xx * h.yy - h.xy * h.xy; if (Math.abs(dt) < 1e-10) break; var dx = (-g[0] * h.yy + g[1] * h.xy) / dt, dy = (g[0] * h.xy - g[1] * h.xx) / dt, st = Math.hypot(dx, dy); if (st > 1) { dx /= st; dy /= st; } x += dx; y += dy; if (Math.abs(x) > L * 1.5 || Math.abs(y) > L * 1.5) break; }
    var g2 = fd1(f, x, y); if ((ok || Math.hypot(g2[0], g2[1]) < 1e-6) && Math.abs(x) <= L && Math.abs(y) <= L){ var dup = out.some(function(q){ return Math.hypot(q[0] - x, q[1] - y) < 1e-3; }); if (!dup) out.push([Math.abs(x) < 1e-7 ? 0 : x, Math.abs(y) < 1e-7 ? 0 : y]); } }
  return out;
}
function classify(f, x, y){ var h = fd2(f, x, y), dt = h.xx * h.yy - h.xy * h.xy, tol = 2e-3 * (1 + Math.abs(h.xx) + Math.abs(h.yy)); var t; if (Math.abs(dt) < tol) t = "n"; else if (dt < 0) t = "s"; else t = h.xx > 0 ? "m" : "M"; return {h:h, det:dt, type:t}; }
var NAT = {m:["minimum local", "#1e3f8f"], M:["maximum local", "#b42318"], s:["point-selle (col)", "#B45309"], n:["indéterminé (det H = 0)", "#8a95a3"]};
SFA.sim({
  id:"um-c10-points-critiques", ch:"c10", titre:"Points critiques : minimum, maximum ou col ? Le test de la hessienne", tag:"Extrema",
  resume:"Là où ∇f = 0, la matrice des dérivées secondes décide : det H > 0 avec f_xx > 0 donne un minimum, det H < 0 un col.",
  but:"Choisis une fonction : les points critiques sont repérés sur la surface et sur la carte (bleu = minimum, rouge = maximum, orange = col, gris = test inopérant). Clique sur la carte pour sélectionner le point critique le plus proche et lire sa hessienne. Avec la première famille, règle a : le minimum devient un col quand |a| dépasse 2, en passant par le cas dégénéré a = ±2.",
  aRetenir:"Point critique : ∂f/∂x = ∂f/∂y = 0. Hessienne H = [[f_xx ; f_xy] ; [f_xy ; f_yy]], D = det H = f_xx f_yy − f_xy². D > 0 et f_xx > 0 : minimum local ; D > 0 et f_xx < 0 : maximum local ; D < 0 : point-selle ; D = 0 : on ne peut pas conclure avec ce test.",
  piege:"D = 0 ne veut pas dire « pas d'extremum » : x⁴ + y⁴ a un minimum en (0 ; 0) mais H y est nulle. Et un maximum local n'est pas forcément le maximum global : il faut aussi regarder les bords et l'infini.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.3}), h1 = 0, P = null, crit = [], sel = 0, lastKey = "";
    var fsel = k.select("Fonction f(x ; y)", Object.keys(F4).map(function(q){ return [q, F4[q].nom]; }), "cub", function(){ lastKey = ""; });
    var sa = k.slider("Paramètre a (première famille)", -3, 3, 0.05, 0, ""); sa.el.addEventListener("input", function(){ lastKey = ""; });
    var tc = k.toggle("Montrer les points critiques", true), tl = k.toggle("Lignes de niveau sur la carte", true);
    var ro = k.readouts(["Points critiques trouvés", "Point sélectionné", "f_xx ; f_xy ; f_yy", "D = det H", "Nature"]); var nt = k.note("", "ok");
    var V = V3(k, c, function(t, pp){ if (t === "down" && pp.y > h1) return true; if ((t === "drag" || t === "down") && pp.y > h1 && P && crit.length){ var x = P.ix(pp.x), y = P.iy(pp.y), b = 1e9; crit.forEach(function(q, i){ var d = Math.hypot(q.x - x, q.y - y); if (d < b){ b = d; sel = i; } }); } return false; }, {az:0.8, el:0.6});
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, key = fsel.value, fn = F4[key], a = sa.value, L = fn.L, f = function(x, y){ return fn.f(x, y, a); }; h1 = Math.round(H * 0.5);
      var fkey = key + "|" + (key === "q" ? fx(a, 2) : ""), zi = zinfo(fkey, {f:f, L:L}), zr = zi.zr; setView(V, c, h1, L);
      if (lastKey !== fkey){ lastKey = fkey; var pts = fn.crit ? fn.crit(a) : findCrit(f, L); crit = pts.map(function(q){ var cl = classify(f, q[0], q[1]); if (key === "quart") cl.type = "n"; return {x:q[0], y:q[1], cl:cl}; }); sel = 0; }
      box3(V, L, zi.zlo, zi.zhi); surf3(c, V, f, L, zr, {zk:zi.zk, zc:zi.zc, n:34});
      if (tc.value) crit.forEach(function(q, i){ var z = (f(q.x, q.y) - zi.zc) * zi.zk, col = NAT[q.cl.type][1]; V.dot([q.x, q.y, z], i === sel ? 8 : 5.5, "#fff"); V.dot([q.x, q.y, z], i === sel ? 6 : 4, col); });
      D.text(c, "Glisse pour faire tourner", 10, 14, {size:11, color:C.grey, align:"left"});
      P = mapP(c, 0, h1 + 6, W, H - h1 - 6, L); heat(c, P, f, L, zr, fkey + "|h"); var Zg = gridVals(f, L, 64), i;
      if (tl.value) for (i = 1; i < 10; i++) drawSegs(c, P, segsAt(Zg, L, 64, zr[0] + (zr[1] - zr[0]) * i / 10), "rgba(255,255,255,.5)", 1); mapFrame(c, P, L);
      if (key === "q" && Math.abs(Math.abs(a) - 2) < 1e-3){ var sg = a > 0 ? -1 : 1; D.line(c, P.X(-L), P.Y(-sg * L), P.X(L), P.Y(sg * L), C.ink, 3, [6, 4]); D.text(c, "ligne de points critiques", P.X(L * 0.45), P.Y(sg * L * 0.45) - 14, {size:11, color:C.ink, bg:"rgba(255,255,255,.8)"}); }
      if (tc.value) crit.forEach(function(q, j){ var col = NAT[q.cl.type][1]; D.dot(c, P.X(q.x), P.Y(q.y), j === sel ? 9 : 7, "#fff"); D.dot(c, P.X(q.x), P.Y(q.y), j === sel ? 6.5 : 4.8, col); });
      colorbar(c, Math.min(W - 26, P.X(L) + 26), P.Y(L) + 12, 12, P.Y(-L) - P.Y(L) - 26, zr);
      var lg = [["minimum", "#1e3f8f"], ["maximum", "#b42318"], ["col", "#B45309"], ["indéterminé", "#8a95a3"]]; lg.forEach(function(e, j){ D.dot(c, 14, h1 + 22 + j * 15, 4.5, e[1]); D.text(c, e[0], 24, h1 + 22 + j * 15, {size:10, color:C.ink, align:"left"}); });
      ro.set(0, String(crit.length));
      if (crit.length){ var q = crit[Math.min(sel, crit.length - 1)], h = q.cl.h; ro.set(1, "(" + fx(q.x, 2) + " ; " + fx(q.y, 2) + ")"); ro.set(2, fx(h.xx, 2) + " ; " + fx(h.xy, 2) + " ; " + fx(h.yy, 2)); ro.set(3, fx(q.cl.det, 2)); ro.set(4, NAT[q.cl.type][0]);
        var t = q.cl.type; nt.set(t === "m" ? "D > 0 et f_xx > 0 : minimum local. Les courbes de niveau sont des ellipses autour du point, la surface est une cuvette." : t === "M" ? "D > 0 et f_xx < 0 : maximum local (sommet). Les niveaux sont des ellipses autour du point." : t === "s" ? "D < 0 : point-selle. Ça monte dans une direction et ça descend dans l'autre ; les niveaux se croisent en croix." : (key === "quart" ? "D = 0 : le test ne dit rien. Ici pourtant f = x⁴ + y⁴ ≥ 0 = f(0 ; 0) : c'est un minimum, qu'on prouve directement." : "D = 0 : le test est inopérant."), t === "n" ? "warn" : "ok"); }
      else { ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); ro.set(4, key === "q" ? "dégénéré" : "aucun"); nt.set(key === "q" ? "a = ±2 : x² ± 2xy + y² = (x ± y)² ne s'annule que sur une droite. Tous les points de cette droite sont critiques, D = 0 : la hessienne ne tranche pas (la vallée est plate)." : "Aucun point critique dans la fenêtre.", "warn"); }
    });
  }
});

/* ---------- 5. multiplicateurs de Lagrange ---------- */
var FL = {
  xy:{nom:"f(x ; y) = x·y", f:function(x, y){ return x * y; }, g:function(x, y){ return [y, x]; }},
  lin:{nom:"f(x ; y) = x + 2y", f:function(x, y){ return x + 2 * y; }, g:function(x, y){ return [1, 2]; }},
  quad:{nom:"f(x ; y) = x² + 2y²", f:function(x, y){ return x * x + 2 * y * y; }, g:function(x, y){ return [2 * x, 4 * y]; }}
};
SFA.sim({
  id:"um-c10-lagrange", ch:"c10", titre:"Extremum sous contrainte : quand ∇f est parallèle à ∇g", tag:"Extrema liés",
  resume:"Sur une contrainte g = c, f est extrême là où les gradients sont parallèles : la courbe de niveau de f est tangente à la contrainte.",
  but:"Fais glisser le point le long de la contrainte (curseur ou animation). Le graphe du bas montre la valeur de f sur la contrainte ; ses extrema (points rouge = maximum, bleu = minimum) coïncident avec les positions où ∇f (rouge) et ∇g (bleu) sont parallèles, c'est-à-dire où la courbe de niveau de f (blanc) touche la contrainte (noir) sans la traverser.",
  aRetenir:"Pour optimiser f(x ; y) sous la contrainte g(x ; y) = c, on cherche les points où ∇f = λ∇g (λ = multiplicateur de Lagrange), avec g = c. Trois équations, trois inconnues (x, y, λ). Exemple : maximiser xy sur x² + y² = 2 donne x = y = 1, λ = ½, f = 1.",
  piege:"∇f = λ∇g donne les candidats, pas leur nature : il faut comparer les valeurs de f en chaque candidat (ou étudier f sur la contrainte). Si ∇g = 0 quelque part sur la contrainte, la méthode peut manquer des extrema. Sur une contrainte non bornée (droite), il peut n'y avoir qu'un extremum (le minimum) et pas de maximum.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.2}), P = null, h1 = 0, L = 3.2, LL = 3.2, GP = null, own = "";
    var fsel = k.select("Fonction à optimiser f", [["xy", FL.xy.nom], ["lin", FL.lin.nom], ["quad", FL.quad.nom]], "xy"), csel = k.select("Contrainte g = c", [["cer", "Cercle x² + y² = r²"], ["dro", "Droite x + y = 2r"], ["ell", "Ellipse x²/4 + y² = r²"]], "cer");
    var rs = k.slider("Taille r de la contrainte", 0.4, 1.5, 0.05, 1, ""), sp = k.slider("Position du point sur la contrainte", 0, 100, 0.5, 12, "%");
    var lp = k.loop(function(dt){ var v = sp.value + 14 * dt; if (v > 100) v = 0; sp.set(v); k.redraw(); }); k.button("▶ Parcourir la contrainte", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var tl = k.toggle("Courbe de niveau de f par le point", true), tg = k.toggle("Gradients ∇f et ∇g", true);
    var ro = k.readouts(["f au point", "∇f", "∇g", "∇f ∥ ∇g ?", "Maximum de f sur la contrainte", "Minimum de f sur la contrainte"]); var nt = k.note("", "ok");
    function cp(s){ var ty = csel.value, r = rs.value; if (ty === "cer"){ var a = 2 * PI * s; return {x:r * Math.cos(a), y:r * Math.sin(a), g:[2 * r * Math.cos(a), 2 * r * Math.sin(a)]}; } if (ty === "ell"){ var b = 2 * PI * s, x = 2 * r * Math.cos(b), y = r * Math.sin(b); return {x:x, y:y, g:[x / 2, 2 * y]}; } var u = -LL * 1.05 + 2 * LL * 1.05 * s; return {x:r + u, y:r - u, g:[1, 1]}; }
    function closed(){ return csel.value !== "dro"; }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){ if (t === "down") own = p.y > h1 ? "g" : "m"; if ((t === "down" || t === "drag") && own === "g" && GP){ sp.set(Math.max(0, Math.min(100, (p.x - GP.bx) / GP.bw * 100))); k.redraw(); } if ((t === "down" || t === "drag") && own === "m" && P){ var b = 1e9, bs = 0, i; for (i = 0; i <= 400; i++){ var q = cp(i / 400), d = Math.hypot(P.X(q.x) - p.x, P.Y(q.y) - p.y); if (d < b){ b = d; bs = i / 4; } } sp.set(bs); k.redraw(); } if (t === "up") own = ""; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, fk = fsel.value, fo = FL[fk], s = sp.value / 100; L = csel.value === "cer" ? 2.2 : 3.2; var zr = zrange("L" + fk + L, {f:fo.f, L:L}); h1 = Math.round(H * 0.64); var i;
      P = mapP(c, 0, 0, W, h1, L); heat(c, P, fo.f, L, zr, "L" + fk + L + "|h"); var Zg = gridVals(fo.f, L, 64);
      var pt = cp(s), fp = fo.f(pt.x, pt.y), gf = fo.g(pt.x, pt.y);
      for (i = 1; i < 10; i++) drawSegs(c, P, segsAt(Zg, L, 64, zr[0] + (zr[1] - zr[0]) * i / 10), "rgba(255,255,255,.35)", 1);
      if (tl.value){ drawSegs(c, P, segsAt(Zg, L, 64, fp), "#fff", 3.6); drawSegs(c, P, segsAt(Zg, L, 64, fp), C.ink, 1.3); }
      mapFrame(c, P, L); ctx.save(); ctx.beginPath(); ctx.rect(P.X(-L), P.Y(L), P.X(L) - P.X(-L), P.Y(-L) - P.Y(L)); ctx.clip(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; ctx.beginPath(); for (i = 0; i <= 300; i++){ var q = cp(i / 300); if (i) ctx.lineTo(P.X(q.x), P.Y(q.y)); else ctx.moveTo(P.X(q.x), P.Y(q.y)); } ctx.stroke(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      /* candidats : ∇f ∥ ∇g */
      var N = 400, cr = [], fv = []; for (i = 0; i <= N; i++){ var qq = cp(i / N), g1 = fo.g(qq.x, qq.y); cr.push(g1[0] * qq.g[1] - g1[1] * qq.g[0]); fv.push(fo.f(qq.x, qq.y)); }
      var cands = []; for (i = 0; i < N; i++){ if (cr[i] === 0 || cr[i] * cr[i + 1] < 0){ var tt = cr[i] === 0 ? i : i + cr[i] / (cr[i] - cr[i + 1]); var sc = tt / N, qc = cp(sc), fcv = fo.f(qc.x, qc.y), ds = 0.004, sA = sc - ds, sB = sc + ds; if (closed()){ sA = (sA + 1) % 1; sB = sB % 1; } var qa = cp(sA), qb = cp(sB), fa = fo.f(qa.x, qa.y), fb = fo.f(qb.x, qb.y); var typ = (fa < fcv && fb < fcv) ? "M" : (fa > fcv && fb > fcv) ? "m" : "n"; if (!cands.some(function(z){ return Math.abs(z.s - sc) < 0.01 || (closed() && Math.abs(Math.abs(z.s - sc) - 1) < 0.01); })) cands.push({s:sc, x:qc.x, y:qc.y, f:fcv, t:typ}); } }
      cands.forEach(function(z){ var col = z.t === "M" ? C.red : z.t === "m" ? C.blue : C.grey; D.dot(c, P.X(z.x), P.Y(z.y), 8.5, "#fff"); D.dot(c, P.X(z.x), P.Y(z.y), 6, col); });
      var ng = Math.hypot(gf[0], gf[1]), gg = Math.hypot(pt.g[0], pt.g[1]), la = L * 0.32;
      if (tg.value){ if (ng > 1e-9) arrowMap(c, P, pt.x, pt.y, pt.x + gf[0] / ng * la, pt.y + gf[1] / ng * la, C.red, 3.4, "∇f"); if (gg > 1e-9) arrowMap(c, P, pt.x, pt.y, pt.x + pt.g[0] / gg * la * 0.75, pt.y + pt.g[1] / gg * la * 0.75, "#2563eb", 3, "∇g"); }
      D.dot(c, P.X(pt.x), P.Y(pt.y), 8, "#fff"); D.dot(c, P.X(pt.x), P.Y(pt.y), 5.2, C.amber);
      /* graphe de f le long de la contrainte */
      var gx = 40, gw = W - 56, gy = h1 + 22, gh = H - h1 - 44, mn = Math.min.apply(null, fv), mx = Math.max.apply(null, fv); GP = {bx:gx, bw:gw}; var pad = (mx - mn) * 0.15 + 0.1, Yg = function(v){ return gy + gh - (v - (mn - pad)) / (mx - mn + 2 * pad) * gh; };
      ctx.strokeStyle = C.light; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh); ctx.strokeStyle = C.violet; ctx.lineWidth = 2.6; ctx.beginPath(); fv.forEach(function(v, j){ var X = gx + j / N * gw, Y = Yg(v); if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }); ctx.stroke();
      cands.forEach(function(z){ D.dot(c, gx + z.s * gw, Yg(z.f), 6, z.t === "M" ? C.red : z.t === "m" ? C.blue : C.grey); }); D.dot(c, gx + s * gw, Yg(fp), 6.5, C.amber);
      D.text(c, "valeur de f le long de la contrainte (position 0 → 100 %)", gx + gw / 2, gy - 9, {size:11, color:C.violet}); D.text(c, F(mx, 2), gx - 4, Yg(mx), {size:10, color:C.grey, align:"right"}); D.text(c, F(mn, 2), gx - 4, Yg(mn), {size:10, color:C.grey, align:"right"});
      var cs2 = ng * gg > 1e-12 ? (gf[0] * pt.g[1] - gf[1] * pt.g[0]) / (ng * gg) : 0, par = Math.abs(cs2) < 0.03, lam = gg > 1e-9 ? (gf[0] * pt.g[0] + gf[1] * pt.g[1]) / (gg * gg) : 0;
      ro.set(0, fx(fp, 3)); ro.set(1, "(" + fx(gf[0], 2) + " ; " + fx(gf[1], 2) + ")"); ro.set(2, "(" + fx(pt.g[0], 2) + " ; " + fx(pt.g[1], 2) + ")"); ro.set(3, par ? "oui : λ ≈ " + fx(lam, 2) : "non (sin α = " + fx(cs2, 2) + ")");
      var Mx = cands.filter(function(z){ return z.t === "M"; }).sort(function(a, b){ return b.f - a.f; })[0], Mn = cands.filter(function(z){ return z.t === "m"; }).sort(function(a, b){ return a.f - b.f; })[0];
      ro.set(4, Mx ? fx(Mx.f, 3) + " en (" + fx(Mx.x, 2) + " ; " + fx(Mx.y, 2) + ")" : "aucun"); ro.set(5, Mn ? fx(Mn.f, 3) + " en (" + fx(Mn.x, 2) + " ; " + fx(Mn.y, 2) + ")" : "aucun");
      nt.set(par ? "Les gradients sont parallèles : la courbe de niveau de f est tangente à la contrainte. C'est un candidat extremum (ici " + (cands.length ? "voir les points colorés" : "") + "), avec ∇f = " + fx(lam, 2) + "·∇g." : "Les gradients ne sont pas parallèles : la courbe de niveau traverse la contrainte, on peut donc encore augmenter ou diminuer f en glissant le long d'elle.", "ok");
    });
  }
});

})();
