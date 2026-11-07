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
var U = UMB, C = U.C, fx = U.fx;
/* fractions [n, d] */
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b){ var t = a % b; a = b; b = t; } return a || 1; }
function fr(n, d){ if (d < 0){ n = -n; d = -d; } var g = gcd(n, d); return [n / g, d / g]; }
function fadd(a, b){ return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function fsub(a, b){ return fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function fmul(a, b){ return fr(a[0] * b[0], a[1] * b[1]); }
function fdiv(a, b){ return fr(a[0] * b[1], a[1] * b[0]); }
function fs(a){ var s = a[1] === 1 ? String(a[0]) : a[0] + "/" + a[1]; return s.replace("-", "−"); }
function cp(M){ return M.map(function(r){ return r.map(function(x){ return [x[0], x[1]]; }); }); }
function gaussSteps(M0){
  var M = cp(M0), steps = [{M:cp(M), text:"Matrice augmentée [A | b] du système.", hi:[]}], rows = M.length, cols = M[0].length - 1, r = 0, piv = [], c, i, j;
  for (c = 0; c < cols && r < rows; c++){
    var p = -1; for (i = r; i < rows; i++) if (M[i][c][0] !== 0){ p = i; break; }
    if (p < 0) continue;
    if (p !== r){ var tmp = M[p]; M[p] = M[r]; M[r] = tmp; steps.push({M:cp(M), text:"Colonne " + (c + 1) + " : le pivot est nul en ligne " + (r + 1) + ", on échange L" + (r + 1) + " ↔ L" + (p + 1) + ".", hi:[r, p], pv:[r, c]}); }
    var pv = M[r][c]; if (!(pv[0] === 1 && pv[1] === 1)){ for (j = 0; j <= cols; j++) M[r][j] = fdiv(M[r][j], pv); steps.push({M:cp(M), text:"On normalise le pivot : L" + (r + 1) + " ← L" + (r + 1) + " / " + (pv[1] === 1 ? fs(pv) : "(" + fs(pv) + ")") + ".", hi:[r], pv:[r, c]}); }
    for (i = 0; i < rows; i++){ if (i === r || M[i][c][0] === 0) continue; var f = M[i][c]; for (j = 0; j <= cols; j++) M[i][j] = fsub(M[i][j], fmul(f, M[r][j])); steps.push({M:cp(M), text:"On annule la colonne " + (c + 1) + " : L" + (i + 1) + " ← L" + (i + 1) + (f[0] < 0 ? " + " : " − ") + (Math.abs(f[0]) === 1 && f[1] === 1 ? "" : fs(fr(Math.abs(f[0]), f[1])) + "·") + "L" + (r + 1) + ".", hi:[i], pv:[r, c]}); }
    piv.push(c); r++;
  }
  var bad = false; for (i = r; i < rows; i++) if (M[i][cols][0] !== 0) bad = true;
  var names = ["x", "y", "z", "w"], res;
  if (bad) res = {kind:"none", text:"La dernière ligne dit 0 = " + fs(M[r][cols]) + " ≠ 0 : le système est <b>impossible</b> (aucune solution)."};
  else if (piv.length === cols){ res = {kind:"unique", sol:M.map(function(row){ return row[cols]; }).slice(0, cols), text:"Rang " + piv.length + " = nombre d'inconnues : <b>solution unique</b> " + names.slice(0, cols).map(function(n, q){ return n + " = " + fs(M[q][cols]); }).join(", ") + "."}; }
  else {
    var free = []; for (c = 0; c < cols; c++) if (piv.indexOf(c) < 0) free.push(c); var tn = ["t", "s"], parts = [];
    for (c = 0; c < cols; c++){ var k = piv.indexOf(c), s; if (k >= 0){ s = fs(M[k][cols]); free.forEach(function(fc, q){ var co = fmul([-1, 1], M[k][fc]); if (co[0] !== 0) s += (co[0] < 0 ? " − " : " + ") + (Math.abs(co[0]) === 1 && co[1] === 1 ? "" : fs(fr(Math.abs(co[0]), co[1]))) + tn[q]; }); if (s.indexOf("0 + ") === 0) s = s.slice(4); } else s = tn[free.indexOf(c)]; parts.push(names[c] + " = " + s); }
    res = {kind:"inf", text:"Rang " + piv.length + " &lt; " + cols + " inconnues : <b>infinité de solutions</b> (" + free.length + " paramètre" + (free.length > 1 ? "s" : "") + ") : " + parts.join(" ; ") + "."};
  }
  steps.push({M:cp(M), text:"Forme réduite : on lit la réponse.", hi:[], res:res}); return {steps:steps, res:res};
}
var PRE = {
  a:[[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]],
  b:[[0, 2, 1, 7], [1, 1, -1, 0], [2, -1, 1, 1]],
  c:[[1, 1, 1, 3], [1, -1, 1, 1], [2, 0, 2, 4]],
  d:[[1, 1, 1, 3], [1, -1, 1, 1], [2, 0, 2, 5]],
  e:[[1, 1, 1, 10], [2, 1, 4, 19], [0, 2, 3, 16]]
};

/* ---------- 1. système 2×2 : lignes et colonnes ---------- */
SFA.sim({
  id:"um-c08-systeme-2x2", ch:"c08", titre:"Un système 2 × 2 vu en lignes et en colonnes", tag:"Systèmes linéaires",
  resume:"Deux droites qui se coupent, ou deux vecteurs colonnes qui se combinent : une même solution, deux regards.",
  but:"Règle les coefficients de a₁x + b₁y = c₁ et a₂x + b₂y = c₂. Vue « Lignes » : chaque équation est une droite, la solution est leur intersection. Vue « Colonnes » : on cherche x et y tels que x·(a₁ ; a₂) + y·(b₁ ; b₂) = (c₁ ; c₂). Glisse le point rouge (vue Lignes) ou la pointe verte de b (vue Colonnes) pour changer le second membre. Rends les droites parallèles : le déterminant s'annule.",
  aRetenir:"det = a₁b₂ − a₂b₁. Si det ≠ 0 : solution unique x = (c₁b₂ − c₂b₁)/det, y = (a₁c₂ − a₂c₁)/det. Si det = 0 : aucune solution (droites parallèles) ou une infinité (droites confondues).",
  piege:"det = 0 ne veut pas dire « pas de solution » : si les deux équations sont proportionnelles, il y en a une infinité.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), PN; U.autoRatio(c, 0.62, 1.0);
    var vw = k.seg("Vue", [["l", "Lignes (droites)"], ["c", "Colonnes (combinaison)"]], "l");
    var a1 = k.slider("a₁", -4, 4, 0.5, 1, ""), b1 = k.slider("b₁", -4, 4, 0.5, 2, ""), c1 = k.slider("c₁", -8, 8, 0.5, 5, "");
    var a2 = k.slider("a₂", -4, 4, 0.5, 3, ""), b2 = k.slider("b₂", -4, 4, 0.5, -1, ""), c2 = k.slider("c₂", -8, 8, 0.5, 1, "");
    k.button("Rendre parallèles (det = 0)", function(){ a2.set(a1.value * 2); b2.set(b1.value * 2); if (Math.abs(a1.value) > 2 || Math.abs(b1.value) > 2){ a2.set(a1.value); b2.set(b1.value); } }, true);
    var ro = k.readouts(["Déterminant", "x", "y", "Cas"]); var nt = k.note("", "ok"), grab = 0, SOL = null, BH = null;
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!PN) return; function sn(x){ return Math.round(x * 2) / 2; }
      if (t === "down"){ grab = 0; if (vw.value === "l" && SOL && Math.hypot(PN.X(SOL[0]) - p.x, PN.Y(SOL[1]) - p.y) < 24) grab = 1; else if (vw.value === "c" && BH && Math.hypot(PN.X(BH[0]) - p.x, PN.Y(BH[1]) - p.y) < 24) grab = 2; }
      else if (t === "drag" && grab){
        if (grab === 1){ var X0 = PN.ix(p.x), Y0 = PN.iy(p.y); c1.set(sn(a1.value * X0 + b1.value * Y0)); c2.set(sn(a2.value * X0 + b2.value * Y0)); }
        else { c1.set(sn(PN.ix(p.x))); c2.set(sn(PN.iy(p.y))); }
        k.redraw(); }
      else if (t === "up") grab = 0;
    });
    function line(P, a, b, cc, col){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(P.bx, P.by, P.bw, P.bh); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); if (Math.abs(b) > 1e-9){ ctx.moveTo(P.X(-9), P.Y((cc + 9 * a) / b)); ctx.lineTo(P.X(9), P.Y((cc - 9 * a) / b)); } else if (Math.abs(a) > 1e-9){ ctx.moveTo(P.X(cc / a), P.Y(-9)); ctx.lineTo(P.X(cc / a), P.Y(9)); } ctx.stroke(); ctx.restore(); }
    k.draw(function(){
      c.clear(); var A1 = a1.value, B1 = b1.value, C1 = c1.value, A2 = a2.value, B2 = b2.value, C2 = c2.value, det = A1 * B2 - A2 * B1, X = null, Y = null, kind;
      if (Math.abs(det) > 1e-9){ X = (C1 * B2 - C2 * B1) / det; Y = (A1 * C2 - A2 * C1) / det; kind = "u"; }
      else { var allz = A1 === 0 && B1 === 0 && A2 === 0 && B2 === 0; var cons = allz ? (C1 === 0 && C2 === 0) : (A1 * C2 - A2 * C1 === 0 && B1 * C2 - B2 * C1 === 0 && !((A1 === 0 && B1 === 0 && C1 !== 0) || (A2 === 0 && B2 === 0 && C2 !== 0))); kind = cons ? "i" : "n"; }
      if (vw.value === "l"){
        PN = U.Pane(c, 0, 0, c.W, c.H, 7.5, 5.4, {xl:"x", yl:"y"}); line(PN, A1, B1, C1, C.blue); line(PN, A2, B2, C2, C.violet);
        S.draw.text(c, "(1) " + fx(A1, 1) + "x + " + fx(B1, 1) + "y = " + fx(C1, 1), 14, 18, {size:12, color:C.blue, align:"left"}); S.draw.text(c, "(2) " + fx(A2, 1) + "x + " + fx(B2, 1) + "y = " + fx(C2, 1), 14, 38, {size:12, color:C.violet, align:"left"});
        SOL = kind === "u" ? [X, Y] : null; BH = null; if (kind === "u"){ U.pt(c, PN, X, Y, C.red, "(" + fx(X, 2) + " ; " + fx(Y, 2) + ")", 8, 12, -14); }
      } else {
        PN = U.Pane(c, 0, 0, c.W, c.H, 9.5, 6.9, {xl:"", yl:""});
        U.vec(c, PN, 0, 0, A1, A2, C.blue, 2.8, "colonne 1"); U.vec(c, PN, 0, 0, B1, B2, C.violet, 2.8, "colonne 2"); U.vec(c, PN, 0, 0, C1, C2, C.green, 3.2, "b"); BH = [C1, C2]; SOL = null; PN.clip(); c.ctx.save(); c.ctx.strokeStyle = C.green; c.ctx.globalAlpha = .6; c.ctx.setLineDash([3, 3]); c.ctx.beginPath(); c.ctx.arc(PN.X(C1), PN.Y(C2), 12, 0, 7); c.ctx.stroke(); c.ctx.restore(); PN.unclip();
        if (kind === "u"){ U.vec(c, PN, 0, 0, X * A1, X * A2, "rgba(30,63,143,.55)", 2); U.vec(c, PN, X * A1, X * A2, X * A1 + Y * B1, X * A2 + Y * B2, "rgba(91,33,182,.55)", 2); U.seg(c, PN, 0, 0, Y * B1, Y * B2, "rgba(91,33,182,.3)", 1.2, [4, 3]); U.seg(c, PN, Y * B1, Y * B2, X * A1 + Y * B1, X * A2 + Y * B2, "rgba(30,63,143,.3)", 1.2, [4, 3]); }
        S.draw.text(c, kind === "u" ? "b = " + fx(X, 2) + "·col 1 + " + fx(Y, 2) + "·col 2" : "colonnes alignées (det = 0)", 14, 18, {size:12, color:C.green, align:"left"});
      }
      ro.set(0, fx(det, 3)); ro.set(1, kind === "u" ? fx(X, 3) : "—"); ro.set(2, kind === "u" ? fx(Y, 3) : "—"); ro.set(3, kind === "u" ? "solution unique" : kind === "i" ? "infinité de solutions" : "aucune solution");
      nt.set(kind === "u" ? "det ≠ 0 : les deux droites se coupent en un seul point ; les colonnes ne sont pas alignées et peuvent atteindre n'importe quel b." : kind === "i" ? "det = 0 et équations compatibles : les deux droites sont confondues, toute la droite est solution." : "det = 0 et équations incompatibles : droites parallèles distinctes, b n'est pas dans la droite engendrée par les colonnes.", kind === "u" ? "ok" : "warn");
    });
  }
});

/* ---------- 2. Gauss pas à pas ---------- */
SFA.sim({
  id:"um-c08-gauss-pas-a-pas", ch:"c08", titre:"L'élimination de Gauss pas à pas", tag:"Systèmes linéaires",
  resume:"Choisis un système 3 × 3 et déroule l'algorithme : pivots, opérations sur les lignes, lecture de la solution.",
  but:"Clique sur « Étape suivante » pour voir chaque opération sur les lignes (la ligne modifiée est surlignée, le pivot encadré). Compare les cinq systèmes : solution unique, pivot nul à échanger, infinité de solutions, aucune solution, et un problème de mélange. Le bouton « Aléatoire » génère un système avec solution entière.",
  aRetenir:"Trois opérations sur les lignes ne changent pas l'ensemble des solutions : échanger deux lignes, multiplier une ligne par un réel non nul, ajouter à une ligne un multiple d'une autre. Rang = nombre de pivots ; rang = nombre d'inconnues ⇒ solution unique.",
  piege:"Une ligne [0 0 0 | b] avec b ≠ 0 signale un système impossible ; une ligne nulle [0 0 0 | 0] signale un paramètre libre (infinité de solutions), pas une erreur.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), D = S.draw, step = 0, G = null, seed = 7, M0 = PRE.a;
    function load(key){ if (key === "r"){ var r = U.rng(seed++), R = function(a, b){ return Math.floor(r() * (b - a + 1)) + a; }, ok = false, A, sol; while (!ok){ A = []; for (var i = 0; i < 3; i++){ A.push([R(-3, 3), R(-3, 3), R(-3, 3)]); } var d = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]); ok = d !== 0; } sol = [R(-3, 3), R(-3, 3), R(-3, 3)]; M0 = A.map(function(row){ return row.concat([row[0] * sol[0] + row[1] * sol[1] + row[2] * sol[2]]); }); } else M0 = PRE[key]; G = gaussSteps(M0.map(function(row){ return row.map(function(x){ return [x, 1]; }); })); step = 0; }
    var sel = k.select("Système", [["a", "Solution unique"], ["b", "Pivot nul à échanger"], ["c", "Infinité de solutions"], ["d", "Aucune solution"], ["e", "Mélange de solutions (labo)"], ["r", "Aléatoire"]], "a", function(v){ load(v); });
    k.button("◀ Étape précédente", function(){ if (step > 0) step--; });
    k.button("Étape suivante ▶", function(){ if (step < G.steps.length - 1) step++; }, true);
    k.button("↺ Recommencer", function(){ step = 0; });
    k.button("⏩ Tout résoudre", function(){ step = G.steps.length - 1; });
    k.button("🎲 Nouveau système aléatoire", function(){ sel.set("r"); load("r"); });
    var nt = k.note("", "ok"); load("a"); step = Math.min(2, G.steps.length - 1); U.autoRatio(c, 0.62, 0.8);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, st = G.steps[step], M = st.M, n = M.length, narrow = W < 560, RC = [C.blue, C.violet, C.teal];
      var cw = narrow ? Math.min(62, (W - 60) / 4.4) : Math.min(68, (W * 0.5) / 4.6), rh = narrow ? 44 : 50, mw = 4 * cw, x0 = narrow ? Math.max(30, (W - mw) / 2 - 6) : 34, y0 = narrow ? 40 : 52, fs0 = Math.round(Math.min(22, cw * 0.34));
      D.panel(c, x0 - 22, y0 - 34, mw + 62, n * rh + 52, {fill:"#fbfcfe", shadow:false});
      ctx.save(); ctx.font = "700 11px Mulish, system-ui"; ctx.fillStyle = C.grey; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ["x", "y", "z", "b"].forEach(function(h, j){ ctx.fillText(h, x0 + j * cw + cw / 2 + (j === 3 ? 6 : 0), y0 - 14); });
      for (var i = 0; i < n; i++){
        var hot = st.hi && st.hi.indexOf(i) >= 0;
        ctx.fillStyle = hot ? "rgba(244,197,66,.38)" : D.tint(RC[i % 3], 0.07); D.rrect(c, x0 - 6, y0 + i * rh + 2, mw + 12, rh - 4, 8); ctx.fill();
        ctx.fillStyle = RC[i % 3]; ctx.fillRect(x0 - 6, y0 + i * rh + 8, 3, rh - 16);
        for (var j = 0; j <= 3; j++){
          if (st.pv && st.pv[0] === i && st.pv[1] === j){ ctx.strokeStyle = C.red; ctx.lineWidth = 2.4; D.rrect(c, x0 + j * cw + 3, y0 + i * rh + 5, cw - 6, rh - 10, 7); ctx.stroke(); }
          ctx.fillStyle = j === 3 ? C.green : C.ink; ctx.font = "700 " + fs0 + "px 'JetBrains Mono', monospace"; ctx.fillText(fs(M[i][j]), x0 + j * cw + cw / 2 + (j === 3 ? 6 : 0), y0 + i * rh + rh / 2);
        }
        ctx.fillStyle = RC[i % 3]; ctx.font = "800 11px Mulish, system-ui"; ctx.textAlign = "left"; ctx.fillText("L" + (i + 1), x0 + mw + 12, y0 + i * rh + rh / 2); ctx.textAlign = "center";
      }
      ctx.strokeStyle = C.grey; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0 + 3 * cw + 2, y0 + 2); ctx.lineTo(x0 + 3 * cw + 2, y0 + n * rh - 2); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      /* texte de l'étape + journal */
      var tx = narrow ? 16 : x0 + mw + 62, ty = narrow ? y0 + n * rh + 30 : 34, maxw = W - tx - 14;
      D.label(c, "Étape " + step + " / " + (G.steps.length - 1), tx, ty, {color:C.blue, align:"left", base:"top"});
      function wrap(txt, x, y, size, col, lh, w){ var words = txt.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").split(" "), line = "", yy = y; ctx.save(); ctx.font = "700 " + size + "px Mulish, system-ui"; words.forEach(function(wd){ var t = line ? line + " " + wd : wd; if (ctx.measureText(t).width > w && line){ D.text(c, line, x, yy, {size:size, color:col, align:"left", base:"top"}); yy += lh; line = wd; } else line = t; }); if (line){ D.text(c, line, x, yy, {size:size, color:col, align:"left", base:"top"}); yy += lh; } ctx.restore(); return yy; }
      var yy = wrap(st.text, tx, ty + 28, 13.5, C.ink, 19, maxw) + 8;
      var from = Math.max(1, step - 3);
      for (var q = step - 1; q >= from && yy < H - 26; q--){ yy = wrap("Étape " + q + " : " + G.steps[q].text, tx, yy, 11.5, "#8a95a3", 15, maxw) + 3; }
      /* progression */
      var N = G.steps.length, pw = Math.min(18, (W - 40) / N); for (q = 0; q < N; q++){ ctx.fillStyle = q <= step ? C.blue : "#d5dbe4"; D.rrect(c, 16 + q * (pw + 3), H - 14, pw, 5, 2.5); ctx.fill(); }
      if (st.res) nt.set(st.res.text, st.res.kind === "none" ? "bad" : st.res.kind === "inf" ? "warn" : "ok"); else nt.set("Rang provisoire : continue les étapes pour atteindre la forme réduite.", "ok");
    });
  }
});

/* ---------- 3. déterminant et volume ---------- */
SFA.sim({
  id:"um-c08-determinant-volume", ch:"c08", titre:"Le déterminant 3 × 3 : un volume algébrique", tag:"Déterminant et inverse",
  resume:"Les trois colonnes de la matrice engendrent un parallélépipède ; |det| est son volume, le signe donne l'orientation.",
  but:"Modifie les colonnes u, v, w (et fais tourner la vue à la souris). Le volume du parallélépipède vaut |det [u v w]|. Passe en configuration « coplanaire » : le solide s'aplatit, det = 0 et la matrice n'est plus inversible. En échangeant deux colonnes, le signe change.",
  aRetenir:"det [u v w] = u·(v × w). |det| = volume ; det = 0 ⇔ colonnes coplanaires ⇔ matrice non inversible ⇔ le système Ax = b n'a pas de solution unique. Échanger deux colonnes change le signe.",
  piege:"det(A + B) ≠ det A + det B en général ; en revanche det(AB) = det A · det B et det(kA) = k³·det A pour une matrice 3 × 3.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.72}), V = U.View3(k, c, {range:5, az:0.85, el:0.5}); V.attach();
    var s = {ux:k.slider("u : x", -3, 3, 0.5, 2, ""), uy:k.slider("u : y", -3, 3, 0.5, 0, ""), uz:k.slider("u : z", -3, 3, 0.5, 0, ""), vx:k.slider("v : x", -3, 3, 0.5, 0.5, ""), vy:k.slider("v : y", -3, 3, 0.5, 2, ""), vz:k.slider("v : z", -3, 3, 0.5, 0, ""), wx:k.slider("w : x", -3, 3, 0.5, 0, ""), wy:k.slider("w : y", -3, 3, 0.5, 0.5, ""), wz:k.slider("w : z", -3, 3, 0.5, 2, "")};
    function sn(x){ return Math.round(x * 2) / 2; }
    [["u", C.blue], ["v", C.violet], ["w", C.green]].forEach(function(h){ V.handles.push({col:h[1], get:function(){ return [s[h[0] + "x"].value, s[h[0] + "y"].value, s[h[0] + "z"].value]; }, set:function(x, y){ s[h[0] + "x"].set(sn(x)); s[h[0] + "y"].set(sn(y)); }}); });
    var gd = k.toggle("Défi : volume exactement 6 (glisse les pointes)", false);
    k.button("Aplatir : w = u + v", function(){ s.wx.set(Math.max(-3, Math.min(3, s.ux.value + s.vx.value))); s.wy.set(Math.max(-3, Math.min(3, s.uy.value + s.vy.value))); s.wz.set(Math.max(-3, Math.min(3, s.uz.value + s.vz.value))); }, true);
    k.button("Échanger u et v", function(){ ["x", "y", "z"].forEach(function(a){ var t = s["u" + a].value; s["u" + a].set(s["v" + a].value); s["v" + a].set(t); }); });
    k.button("Base canonique", function(){ var m = {ux:2, uy:0, uz:0, vx:0, vy:2, vz:0, wx:0, wy:0, wz:2}; for (var q in m) s[q].set(m[q]); });
    var ro = k.readouts(["det [u v w]", "Volume |det|", "Orientation", "Matrice inversible ?"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); V.fit(); var u = [s.ux.value, s.uy.value, s.uz.value], v = [s.vx.value, s.vy.value, s.vz.value], w = [s.wx.value, s.wy.value, s.wz.value], O = [0, 0, 0], d = U.dot3(u, U.cross3(v, w));
      V.axes(4, null, {step:1});
      var uv = U.add3(u, v), uw = U.add3(u, w), vw = U.add3(v, w), uvw = U.add3(uv, w), F = [[O, u, uv, v], [O, u, uw, w], [O, v, vw, w], [w, uw, uvw, vw], [v, uv, uvw, vw], [u, uv, uvw, uw]];
      var col = Math.abs(d) < 1e-9 ? "rgba(138,149,163,.28)" : d > 0 ? "rgba(30,63,143,.2)" : "rgba(180,35,24,.2)", edge = Math.abs(d) < 1e-9 ? "#8a95a3" : d > 0 ? "rgba(30,63,143,.8)" : "rgba(180,35,24,.8)";
      F.map(function(f){ var m = 0; f.forEach(function(q){ m += V.p(q[0], q[1], q[2]).d; }); return {f:f, d:m / 4}; }).sort(function(a, b){ return b.d - a.d; }).forEach(function(o){ V.poly(o.f, col, edge, 1.2); });
      V.arrow(O, u, C.blue, 3, "u"); V.arrow(O, v, C.violet, 3, "v"); V.arrow(O, w, C.green, 3, "w"); V.hand();
      ro.set(0, fx(d, 3)); ro.set(1, fx(Math.abs(d), 3)); ro.set(2, Math.abs(d) < 1e-9 ? "dégénéré" : d > 0 ? "directe (+)" : "indirecte (−)"); ro.set(3, Math.abs(d) < 1e-9 ? "non (det = 0)" : "oui");
      if (gd.value){ var ok = Math.abs(Math.abs(d) - 6) < 0.26; nt.set(ok ? "Volume = " + fx(Math.abs(d), 2) + " ≈ 6 : réussi. Un même volume, une infinité de parallélépipèdes !" : "Volume = " + fx(Math.abs(d), 2) + ". Vise 6 : allonge un vecteur ou redresse-le vers la normale des deux autres.", ok ? "ok" : "warn"); return; }
      nt.set(Math.abs(d) < 1e-9 ? "Les trois vecteurs sont dans un même plan : volume nul, det = 0. La matrice [u v w] n'est pas inversible." : "det = u·(v × w) = " + fx(d, 2) + " : le volume du parallélépipède est " + fx(Math.abs(d), 2) + (d < 0 ? " (orientation inversée, faces en rouge)." : "."), Math.abs(d) < 1e-9 ? "warn" : "ok");
    });
  }
});

/* ---------- 4. produit de matrices ---------- */
var TR = {rot:["Rotation d'angle θ", "θ (°)", -180, 180, 1, 40], she:["Cisaillement horizontal", "k", -2, 2, 0.1, 1], str:["Étirement selon x", "k", -2, 3, 0.1, 2], ref:["Symétrie par rapport à l'axe x", "", 0, 0, 1, 0], pro:["Projection sur l'axe x", "", 0, 0, 1, 0], hom:["Homothétie de rapport k", "k", -2, 2, 0.1, 1.5]};
function tmat(t, p){ if (t === "rot"){ var a = p * Math.PI / 180; return [[Math.cos(a), -Math.sin(a)], [Math.sin(a), Math.cos(a)]]; } if (t === "she") return [[1, p], [0, 1]]; if (t === "str") return [[p, 0], [0, 1]]; if (t === "ref") return [[1, 0], [0, -1]]; if (t === "pro") return [[1, 0], [0, 0]]; return [[p, 0], [0, p]]; }
function mm(A, B){ return [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]]; }
function ms(M, d){ return "[" + fx(M[0][0], d) + " " + fx(M[0][1], d) + " ; " + fx(M[1][0], d) + " " + fx(M[1][1], d) + "]"; }
var FSH = [[0, 0], [0.5, 0], [0.5, 0.9], [1.3, 0.9], [1.3, 1.35], [0.5, 1.35], [0.5, 2.1], [1.5, 2.1], [1.5, 2.6], [0, 2.6]];
SFA.sim({
  id:"um-c08-composition-matrices", ch:"c08", titre:"Le produit de matrices : composer, c'est multiplier (et l'ordre compte)", tag:"Calcul matriciel",
  resume:"Applique deux transformations dans l'ordre A puis B, puis dans l'ordre B puis A : les résultats diffèrent.",
  but:"Choisis deux transformations A et B (rotation, cisaillement, étirement, symétrie, projection, homothétie) et leurs paramètres. Le « F » montre l'effet de chacune ; fais glisser le curseur d'animation. À gauche : on applique d'abord A, puis B (matrice BA). À droite : d'abord B, puis A (matrice AB).",
  aRetenir:"Appliquer A puis B revient à multiplier par la matrice BA (le produit se lit de droite à gauche). En général AB ≠ BA. det(AB) = det A · det B : les aires se multiplient.",
  piege:"Le produit de matrices n'est pas commutatif : une rotation puis un cisaillement ne donne pas la même figure qu'un cisaillement puis une rotation. Les dimensions doivent être compatibles : (m × n)(n × p) = (m × p).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.56}), opts = Object.keys(TR).map(function(q){ return [q, TR[q][0]]; }), D = S.draw;
    U.autoRatio(c, 0.62, 1.5, 440);
    var sa = k.select("Transformation A", opts, "rot", function(v){ setP(pa, v); }), pa = k.slider("Paramètre de A", -180, 180, 1, 40, "");
    var sb = k.select("Transformation B", opts, "she", function(v){ setP(pb, v); }), pb = k.slider("Paramètre de B", -2, 2, 0.1, 1, "");
    var at = k.slider("Animation (0 → 1 : première, 1 → 2 : seconde)", 0, 2, 0.02, 2, "");
    var lp = k.loop(function(dt){ var v = at.value + 0.6 * dt; if (v > 2) v = 0; at.set(v); k.redraw(); }); k.button("▶ Animer", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var df = k.toggle("Défi : trouve A et B qui commutent (AB = BA) sans être égales à l'identité", false);
    function setP(sl, v){ var T = TR[v]; sl.el.min = T[2]; sl.el.max = T[3]; sl.el.step = T[4]; sl.set(T[5]); }
    var ro = k.readouts(["Matrice A", "Matrice B", "BA (A puis B)", "AB (B puis A)", "BA = AB ?", "det BA = det A · det B"]); var nt = k.note("", "ok");
    function img(M, f){ return f.map(function(p){ return [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]]; }); }
    function lerp(I, M, t){ return [[I[0][0] + (M[0][0] - I[0][0]) * t, I[0][1] + (M[0][1] - I[0][1]) * t], [I[1][0] + (M[1][0] - I[1][0]) * t, I[1][1] + (M[1][1] - I[1][1]) * t]]; }
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, A = tmat(sa.value, pa.value), B = tmat(sb.value, pb.value), I = [[1, 0], [0, 1]], BA = mm(B, A), AB = mm(A, B), t = at.value, ctx = c.ctx, st = W < 440, gap = 8;
      var pw = st ? W : (W - gap) / 2, ph = st ? (H - gap) / 2 : H;
      [[A, B, BA, "1) A puis B", 0, "BA"], [B, A, AB, "2) B puis A", 1, "AB"]].forEach(function(q){
        var first = q[0], tot = q[2], bx = st ? 0 : q[4] * (pw + gap), by = st ? q[4] * (ph + gap) : 0, P = U.Pane(c, bx, by, pw, ph, 4.8, 4.8, {ticks:false, dy:0.7});
        var M = t <= 1 ? lerp(I, first, t) : lerp(first, tot, t - 1), col = q[4] ? C.violet : C.blue;
        var poly = function(pts, fill, stroke, w, dash){ ctx.beginPath(); pts.forEach(function(p, i){ if (i) ctx.lineTo(P.X(p[0]), P.Y(p[1])); else ctx.moveTo(P.X(p[0]), P.Y(p[1])); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = stroke; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]); };
        P.clip(); poly(FSH, "rgba(138,149,163,.12)", "#8a95a3", 1.2, [4, 3]); poly(img(M, FSH), D.tint(col, 0.22), col, 2.6);
        U.vec(c, P, 0, 0, M[0][0], M[1][0], C.red, 2.6, ""); U.vec(c, P, 0, 0, M[0][1], M[1][1], C.green, 2.6, ""); P.unclip();
        D.label(c, q[3], bx + 8, by + 8, {color:col, align:"left", base:"top"});
        D.label(c, q[5] + " = " + ms(tot, 2), bx + pw - 8, by + ph - 24, {color:col, align:"right", base:"top", size:11, math:false});
      });
      var same = Math.abs(BA[0][0] - AB[0][0]) + Math.abs(BA[0][1] - AB[0][1]) + Math.abs(BA[1][0] - AB[1][0]) + Math.abs(BA[1][1] - AB[1][1]) < 1e-9, dt = function(M){ return M[0][0] * M[1][1] - M[0][1] * M[1][0]; };
      var isI = function(M){ return Math.abs(M[0][0] - 1) + Math.abs(M[1][1] - 1) + Math.abs(M[0][1]) + Math.abs(M[1][0]) < 1e-9; };
      ro.set(0, ms(A, 2)); ro.set(1, ms(B, 2)); ro.set(2, ms(BA, 2)); ro.set(3, ms(AB, 2)); ro.set(4, same ? "oui (ici elles commutent)" : "non"); ro.set(5, fx(dt(BA), 3) + " = " + fx(dt(A), 2) + " × " + fx(dt(B), 2));
      if (df.value) nt.set(same ? (isI(A) || isI(B) ? "Elles commutent, mais l'une est l'identité : trop facile ! Essaie autre chose." : "Bravo : AB = BA. Les deux figures finales sont identiques. Cela arrive pour deux rotations, deux homothéties, ou une homothétie avec n'importe quoi.") : "AB ≠ BA : les deux figures finales diffèrent. Essaie deux rotations, ou une homothétie.", same && !(isI(A) || isI(B)) ? "ok" : "warn");
      else nt.set(same ? "Ici AB = BA : cas particulier (par exemple deux rotations). En général, l'ordre change le résultat." : "AB ≠ BA : compare les deux figures finales. L'ordre des transformations compte.", same ? "warn" : "ok");
    });
  }
});

/* ---------- 5. inverse et résolution Ax = b ---------- */
SFA.sim({
  id:"um-c08-inverse-resolution", ch:"c08", titre:"Inverse d'une matrice : défaire la transformation pour résoudre Ax = b", tag:"Déterminant et inverse",
  resume:"Déplace x à gauche : b = Ax apparaît à droite. Déplace b : l'inverse retrouve x. Quand det = 0, la grille s'écrase et l'inverse n'existe plus.",
  but:"Règle la matrice A = [a b ; c d]. À gauche (espace de départ) glisse le point bleu x ; à droite (espace d'arrivée) on voit b = Ax sur la grille déformée. Glisse aussi le point rouge b pour résoudre Ax = b : x = A⁻¹b. Amène det vers 0 : la grille s'aplatit sur une droite.",
  aRetenir:"A⁻¹ = (1/det)·[d −b ; −c a] pour une 2 × 2, et Ax = b ⇒ x = A⁻¹b. A est inversible ⇔ det A ≠ 0 ⇔ la transformation est bijective. L'aire est multipliée par |det A|.",
  piege:"A⁻¹ n'est pas la matrice des inverses des coefficients : [a b ; c d]⁻¹ ≠ [1/a 1/b ; 1/c 1/d].",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.52}), PL, PR, X = {x:1, y:1}, Bv = {x:3, y:4}, cur = 0, D = S.draw;
    U.autoRatio(c, 0.55, 1.45, 440);
    var TG = [[4, 3], [-3, 2], [5, -2], [-2, -4]], ti = 0;
    var sa = k.slider("a", -3, 3, 0.1, 2, "", function(){ sync(); }), sb = k.slider("b", -3, 3, 0.1, 1, "", function(){ sync(); }), sc = k.slider("c", -3, 3, 0.1, 1, "", function(){ sync(); }), sd = k.slider("d", -3, 3, 0.1, 3, "", function(){ sync(); });
    var df = k.toggle("Défi : amène b sur la cible ◎ (en glissant x ou b)", false);
    k.button("Nouvelle cible", function(){ ti = (ti + 1) % TG.length; df.set(true); });
    var ro = k.readouts(["det A", "A⁻¹", "x", "b = Ax"]); var nt = k.note("", "ok");
    function sync(){ Bv.x = sa.value * X.x + sb.value * X.y; Bv.y = sc.value * X.x + sd.value * X.y; }
    function inv(){ var det = sa.value * sd.value - sb.value * sc.value; return Math.abs(det) < 0.02 ? null : [[sd.value / det, -sb.value / det], [-sc.value / det, sa.value / det]]; }
    sync();
    function layout(){ var W = c.W, H = c.H, st = W < 440, gap = 8;
      if (st){ var h = (H - gap) / 2; PL = U.Pane(c, 0, 0, W, h, 5, 5, {xl:"x₁", yl:"x₂", step:1}); PR = U.Pane(c, 0, h + gap, W, h, 9, 9, {xl:"b₁", yl:"b₂", step:3}); }
      else { var w = (W - gap) / 2; PL = U.Pane(c, 0, 0, w, H, 5, 5, {xl:"x₁", yl:"x₂", step:1}); PR = U.Pane(c, w + gap, 0, w, H, 9, 9, {xl:"b₁", yl:"b₂", step:3}); } }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, a = sa.value, b = sb.value, cc = sc.value, d = sd.value, det = a * d - b * cc, g;
      layout();
      PL.clip(); for (g = -6; g <= 6; g++){ ctx.lineWidth = 1; ctx.strokeStyle = g === 0 ? "#8a95a3" : "rgba(31,75,158,.22)"; ctx.beginPath(); ctx.moveTo(PL.X(g), PL.Y(-6)); ctx.lineTo(PL.X(g), PL.Y(6)); ctx.stroke(); ctx.strokeStyle = g === 0 ? "#8a95a3" : "rgba(192,50,29,.2)"; ctx.beginPath(); ctx.moveTo(PL.X(-6), PL.Y(g)); ctx.lineTo(PL.X(6), PL.Y(g)); ctx.stroke(); } PL.unclip();
      PR.clip(); for (g = -12; g <= 12; g++){ ctx.lineWidth = 1; ctx.strokeStyle = "rgba(31,75,158,.4)"; ctx.beginPath(); ctx.moveTo(PR.X(a * g + b * -12), PR.Y(cc * g + d * -12)); ctx.lineTo(PR.X(a * g + b * 12), PR.Y(cc * g + d * 12)); ctx.stroke(); ctx.strokeStyle = "rgba(192,50,29,.35)"; ctx.beginPath(); ctx.moveTo(PR.X(a * -12 + b * g), PR.Y(cc * -12 + d * g)); ctx.lineTo(PR.X(a * 12 + b * g), PR.Y(cc * 12 + d * g)); ctx.stroke(); }
      ctx.fillStyle = "rgba(244,197,66,.28)"; ctx.beginPath(); ctx.moveTo(PR.X(0), PR.Y(0)); ctx.lineTo(PR.X(a), PR.Y(cc)); ctx.lineTo(PR.X(a + b), PR.Y(cc + d)); ctx.lineTo(PR.X(b), PR.Y(d)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(194,106,12,.8)"; ctx.lineWidth = 1.6; ctx.stroke();
      U.vec(c, PR, 0, 0, a, cc, C.blue, 2.6, ""); U.vec(c, PR, 0, 0, b, d, C.red, 2.6, ""); PR.unclip();
      PL.clip(); ctx.fillStyle = "rgba(244,197,66,.3)"; ctx.fillRect(PL.X(0), PL.Y(1), PL.k, PL.k); U.vec(c, PL, 0, 0, 1, 0, C.blue, 2.4, ""); U.vec(c, PL, 0, 0, 0, 1, C.red, 2.4, ""); PL.unclip();
      var Ai = inv(), hit = false, T = TG[ti];
      if (df.value){ var tx = PR.X(T[0]), ty = PR.Y(T[1]); hit = Math.hypot(Bv.x - T[0], Bv.y - T[1]) < 0.3; ctx.save(); ctx.strokeStyle = hit ? C.green : C.amber; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(tx, ty, 11, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(tx, ty, 4, 0, 7); ctx.stroke(); ctx.restore();
        if (Ai && hit){ var sx = Ai[0][0] * T[0] + Ai[0][1] * T[1], sy = Ai[1][0] * T[0] + Ai[1][1] * T[1]; ctx.save(); PL.clip(); ctx.strokeStyle = C.green; ctx.setLineDash([4, 3]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(PL.X(sx), PL.Y(sy), 10, 0, 7); ctx.stroke(); PL.unclip(); ctx.restore(); } }
      U.pt(c, PL, X.x, X.y, C.blue, "x", 7, 13, -13); U.pt(c, PR, Bv.x, Bv.y, C.red, "b", 7, 13, -13);
      D.label(c, "Départ : x", PL.bx + 8, PL.by + 8, {color:C.blue, align:"left", base:"top"}); D.label(c, "Arrivée : b = Ax", PR.bx + 8, PR.by + 8, {color:C.red, align:"left", base:"top"});
      D.label(c, "aire du carré = " + fx(Math.abs(det), 2), PR.bx + PR.bw - 8, PR.by + PR.bh - 22, {color:C.amber, align:"right", base:"top", size:11});
      ro.set(0, fx(det, 3)); ro.set(1, Ai ? ms(Ai, 3) : "n'existe pas"); ro.set(2, "(" + fx(X.x, 2) + " ; " + fx(X.y, 2) + ")"); ro.set(3, "(" + fx(Bv.x, 2) + " ; " + fx(Bv.y, 2) + ")");
      if (df.value) nt.set(hit ? (Ai ? "Cible atteinte : x = A⁻¹·(" + T[0] + " ; " + T[1] + ") = (" + fx(Ai[0][0] * T[0] + Ai[0][1] * T[1], 2) + " ; " + fx(Ai[1][0] * T[0] + Ai[1][1] * T[1], 2) + "), c'est le cercle vert à gauche." : "Cible atteinte, mais A n'est pas inversible : plusieurs x conviennent.") : Ai ? "Cible " + "(" + T[0] + " ; " + T[1] + ") : glisse x (ou b) jusqu'à ◎. Un seul x convient, car A est inversible." : "det ≈ 0 : la grille est écrasée, la cible n'est atteignable que si elle est sur la droite image.", hit ? "ok" : "warn");
      else nt.set(Ai ? "A est inversible : l'aire du carré unité devient |det| = " + fx(Math.abs(det), 2) + ". Pour chaque b il y a exactement un x." : "det ≈ 0 : la grille est écrasée sur une droite (ou un point). A n'est pas inversible : certains b n'ont aucun antécédent, d'autres en ont une infinité.", Ai ? "ok" : "warn");
    });
    c.pointer(function(t, p){
      if (t === "down"){ cur = 0; var dl = Math.hypot(PL.X(X.x) - p.x, PL.Y(X.y) - p.y), dr = Math.hypot(PR.X(Bv.x) - p.x, PR.Y(Bv.y) - p.y); if (dl < 26 && dl <= dr) cur = 1; else if (dr < 26) cur = 2; }
      else if (t === "drag" && cur){ if (cur === 1){ X.x = Math.max(-5, Math.min(5, Math.round(PL.ix(p.x) * 4) / 4)); X.y = Math.max(-5, Math.min(5, Math.round(PL.iy(p.y) * 4) / 4)); sync(); } else { var Ai = inv(); if (Ai){ var bx = Math.max(-9, Math.min(9, PR.ix(p.x))), by = Math.max(-9, Math.min(9, PR.iy(p.y))); X.x = Math.max(-5, Math.min(5, Ai[0][0] * bx + Ai[0][1] * by)); X.y = Math.max(-5, Math.min(5, Ai[1][0] * bx + Ai[1][1] * by)); sync(); } } k.redraw(); }
      else if (t === "up") cur = 0; });
    c.cv.style.touchAction = "none";
  }
});

})();
