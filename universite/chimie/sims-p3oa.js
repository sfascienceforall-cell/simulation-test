/* Chimie BA1 · chimie organique (vague P3, lot OA) : fonctions dans de vrais médicaments, flèches courbes,
   préparation d'un magnésien, pont bromonium, ordre des étapes d'une synthèse aromatique.
   Simulations SFA originales ; la 3D est dessinée à la main sur un canevas 2D (projection perspective).
   Géométries : relaxées par un petit champ de forces SFA (longueurs et angles idéaux), arrondies au millième d'Å. */
(function(){
var PI = Math.PI, DEG = PI / 180, FONT = "Mulish, system-ui, sans-serif";

/* ---------- petite algèbre 3D ---------- */
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function lerp(a, b, t){ return a + (b - a) * t; }
function lerp3(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }
function ease(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function rotAx(v, k, ang){ k = nrm(k); var c = Math.cos(ang), s = Math.sin(ang); return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c))); }
function perpTo(u){ var r = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]; return nrm(cross(u, r)); }
/* trois directions qui complètent un tétraèdre autour d'un atome dont une liaison pointe selon u */
function tetra3(u, ref, ph){
  u = nrm(u);
  var e1 = ref ? sub(ref, mul(u, dot(ref, u))) : null;
  if (!e1 || len(e1) < 1e-3) e1 = perpTo(u);
  e1 = nrm(e1); var e2 = cross(u, e1), out = [];
  for (var q = 0; q < 3; q++){ var p = (ph || 0) + q * 2 * PI / 3; out.push(add(mul(u, -1 / 3), mul(add(mul(e1, Math.cos(p)), mul(e2, Math.sin(p))), Math.sqrt(8) / 3))); }
  return out;
}
/* trois directions d'un « parapluie » autour de l'axe u : demi-angle au sommet phi (109,47° = tétraèdre, 90° = plan) */
function umbrella(u, ref, phiDeg, ph){
  u = nrm(u);
  var e1 = ref ? sub(ref, mul(u, dot(ref, u))) : null;
  if (!e1 || len(e1) < 1e-3) e1 = perpTo(u);
  e1 = nrm(e1); var e2 = cross(u, e1), out = [], ph0 = ph || 0, cphi = Math.cos(phiDeg * DEG), sphi = Math.sin(phiDeg * DEG);
  for (var q = 0; q < 3; q++){ var p = ph0 + q * 2 * PI / 3; out.push(add(mul(u, cphi), mul(add(mul(e1, Math.cos(p)), mul(e2, Math.sin(p))), sphi))); }
  return out;
}

/* ---------- rendu ---------- */
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function rgba(hex, a){ var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function mixHex(h1, h2, t){
  var a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
  function ch(s){ return Math.round(lerp((a >> s) & 255, (b >> s) & 255, clamp(t, 0, 1))); }
  return "#" + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1);
}
function ball(ctx, x, y, r, hex, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, shade(hex, 0.75)); g.addColorStop(0.45, hex); g.addColorStop(1, shade(hex, -0.45));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.restore();
}
function rot3(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}
function proj3(p, st, sc, cx, cy){
  var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * 0.04);
  return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s};
}
/* glisser = tourner la vue ; survol et toucher (sans glisser) transmis à o.hover / o.tap */
function viewCtl(c, st, o){
  o = o || {};
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.x0 = p.x; st.y0 = p.y; st.drag = true; st.moved = false; if (o.down && o.down(p)) { st.grab = true; } }
    else if (type === "drag" && st.lx != null){
      if (Math.hypot(p.x - st.x0, p.y - st.y0) > 5) st.moved = true;
      if (st.grab){ if (o.grabMove) o.grabMove(p); }
      else if (st.moved){ st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, -1.45, 1.45); if (st.onview) st.onview(); }
      st.lx = p.x; st.ly = p.y;
    }
    else if (type === "move"){ if (o.hover) o.hover(p); }
    else if (type === "up"){
      if (!st.moved && o.tap) o.tap(p);
      if (st.grab && o.grabEnd) o.grabEnd(p);
      st.lx = null; st.drag = false; st.grab = false;
    }
  });
}
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function label(ctx, s, x, y, o){
  o = o || {}; var size = o.size || 12;
  ctx.save(); ctx.font = (o.weight || 700) + " " + size + "px " + FONT; ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle";
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.maxW){ var sz = size; while (sz > 9 && ctx.measureText(s).width > o.maxW){ sz -= 0.5; ctx.font = (o.weight || 700) + " " + sz + "px " + FONT; } size = sz; }
  var w = ctx.measureText(s).width;
  if (o.bg){
    var bw = w + 12, h = size + 8, bx = ctx.textAlign === "left" ? x - 6 : ctx.textAlign === "right" ? x - bw + 6 : x - bw / 2;
    ctx.fillStyle = o.bg; rr(ctx, bx, y - h / 2, bw, h, 7); ctx.fill();
    if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  ctx.fillStyle = o.col || "#2c3a4e"; ctx.fillText(s, x, y); ctx.restore();
  return w;
}
function badge(ctx, x, y, t, col, a, r){
  if (a != null && a < 0.03) return;
  r = r || 8.5;
  ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = "#fff"; ctx.strokeStyle = col; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.font = "800 " + Math.round(r * (t.length > 1 ? 1.05 : 1.55)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 0.5); ctx.restore();
}
/* point d'une courbe de Bézier quadratique */
function qpt(x0, y0, cx, cy, x1, y1, t){ var u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; }
function qctrl(x0, y0, x1, y1, bend){ var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1; return [mx - dy / L * bend, my + dx / L * bend]; }
/* flèche courbe (doublet) ; frac = portion tracée (0..1) */
function curly(ctx, x0, y0, x1, y1, bend, col, alpha, frac, lw){
  if (!(alpha > 0.03)) return;
  frac = frac == null ? 1 : frac; if (frac <= 0.01) return;
  var c = qctrl(x0, y0, x1, y1, bend), n = 28, q;
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw || 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(x0, y0);
  for (q = 1; q <= n; q++){ var p = qpt(x0, y0, c[0], c[1], x1, y1, q / n * frac); ctx.lineTo(p[0], p[1]); }
  ctx.stroke();
  if (frac > 0.97){
    var pe = qpt(x0, y0, c[0], c[1], x1, y1, 1), pb = qpt(x0, y0, c[0], c[1], x1, y1, 0.9), ang = Math.atan2(pe[1] - pb[1], pe[0] - pb[0]), hl = (lw || 2.6) * 4.6;
    ctx.beginPath(); ctx.moveTo(pe[0], pe[1]); ctx.lineTo(pe[0] - hl * Math.cos(ang - 0.42), pe[1] - hl * Math.sin(ang - 0.42)); ctx.lineTo(pe[0] - hl * Math.cos(ang + 0.42), pe[1] - hl * Math.sin(ang + 0.42)); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function trim(p, q, r0, r1){
  var dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
  return [p.x + dx / L * r0, p.y + dy / L * r0, q.x - dx / L * r1, q.y - dy / L * r1];
}
var EL = {C:["#4a5568", 0.40], H:["#e8edf3", 0.25], O:["#d6392f", 0.42], N:["#2f5fd0", 0.41], Br:["#9a2a1c", 0.60], Mg:["#7fae4f", 0.62], Cl:["#2fa84f", 0.52], Fe:["#b5651d", 0.52]};
function At(el, p, o){ var a = {el:el, p:p, col:EL[el][0], r:EL[el][1], alpha:1}; if (o) for (var q in o) a[q] = o[q]; return a; }
function bondDraw(ctx, p, q, b, sc, al){
  var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, ox = -dy / l, oy = dx / l;
  var w = Math.max(2.4, sc * 0.1) * ((p.s + q.s) / 2) * (b.w || 1);
  var o = b.o || 1, offs = o === 2 ? [-w * 0.85, w * 0.85] : o === 3 ? [-w * 1.35, 0, w * 1.35] : [0], lw = o === 1 ? w : w * 0.6;
  ctx.save(); ctx.globalAlpha = al; ctx.lineCap = "round";
  if (b.glow){ ctx.strokeStyle = b.glow; ctx.lineWidth = w * 3.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  offs.forEach(function(of){
    var x0 = p.x + ox * of, y0 = p.y + oy * of, x1 = q.x + ox * of, y1 = q.y + oy * of;
    ctx.setLineDash(b.dash ? [lw * 1.5, lw * 1.3] : []);
    ctx.strokeStyle = b.col || "#7d8a9b"; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (!b.dash){ ctx.strokeStyle = "rgba(255,255,255,.38)"; ctx.lineWidth = lw * 0.32; ctx.beginPath(); ctx.moveTo(x0 - ox * lw * 0.2, y0 - oy * lw * 0.2); ctx.lineTo(x1 - ox * lw * 0.2, y1 - oy * lw * 0.2); ctx.stroke(); }
  });
  ctx.restore();
}
/* scène 3D : atomes {el,p,col,r,alpha,lab,glow,badge,badgeCol,badgeA}, liaisons {a,b,o,alpha,dash,col,glow}, extra : [{z,f}] */
function drawScene(c, V, atoms, bonds, extra){
  var ctx = c.ctx, items = (extra || []).slice();
  var pr = atoms.map(function(a){ return proj3(a.p, V.st, V.sc, V.cx, V.cy); });
  atoms.forEach(function(a, i){ pr[i].r = Math.max(a.el === "H" ? 3.2 : 5, a.r * V.sc * 0.8 * pr[i].s * (a.big || 1)); });
  bonds.forEach(function(b){
    var A1 = atoms[b.a], B1 = atoms[b.b], p = pr[b.a], q = pr[b.b];
    var al = (b.alpha == null ? 1 : b.alpha) * Math.min(A1.alpha, B1.alpha); if (al < 0.03) return;
    items.push({z:(p.z + q.z) / 2 - 0.05, f:function(){ bondDraw(ctx, p, q, b, V.sc, al); }});
  });
  atoms.forEach(function(a, i){
    if (a.alpha < 0.03) return;
    var p = pr[i], r = p.r;
    items.push({z:p.z, f:function(){
      if (a.glow){ var g = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 2.6); g.addColorStop(0, a.glow); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.save(); ctx.globalAlpha = a.alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.6, 0, 7); ctx.fill(); ctx.restore(); }
      ball(ctx, p.x, p.y, r, a.col, a.alpha);
      if (a.ring){ ctx.save(); ctx.globalAlpha = a.alpha; ctx.strokeStyle = a.ring; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(p.x, p.y, r + 2.5, 0, 7); ctx.stroke(); ctx.restore(); }
      if (a.lab && r > 7.5){
        ctx.save(); ctx.globalAlpha = a.alpha; ctx.font = "800 " + Math.round(clamp(r * 0.95, 9, 15)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(a.lab, p.x, p.y); ctx.fillStyle = "#fff"; ctx.fillText(a.lab, p.x, p.y); ctx.restore();
      }
      if (a.badge) badge(ctx, p.x + r * 0.85, p.y - r * 0.85, a.badge, a.badgeCol || "#c0392b", (a.badgeA == null ? 1 : a.badgeA) * a.alpha, a.badgeR || (a.badge.length > 1 ? 9.5 : 8));
    }});
  });
  items.sort(function(x, y){ return x.z - y.z; });
  items.forEach(function(it){ it.f(); });
  return pr;
}
/* cadrage : échelle et centre pour que tous les points (rotés) tiennent dans la boîte [x0,y0,w,h] */
function fitBox(pts, st, box, pad){
  var bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
  pts.forEach(function(p){ var r = rot3(p, st.a, st.b); bx0 = Math.min(bx0, r[0]); bx1 = Math.max(bx1, r[0]); by0 = Math.min(by0, r[1]); by1 = Math.max(by1, r[1]); });
  pad = pad == null ? 1.2 : pad;
  var sc = Math.min(box.w / (bx1 - bx0 + pad), box.h / (by1 - by0 + pad));
  return {sc:sc, mx:(bx0 + bx1) / 2, my:(by0 + by1) / 2};
}
/* rayon englobant (indépendant de la vue) : cadrage stable pendant la rotation */
function radius(pts){ var c = [0, 0, 0]; pts.forEach(function(p){ c = add(c, p); }); c = mul(c, 1 / pts.length); var r = 0; pts.forEach(function(p){ r = Math.max(r, len(sub(p, c))); }); return {c:c, r:r}; }
function F2(x, d){ return (x < 0 ? "−" : "") + Math.abs(x).toFixed(d).replace(".", ","); }
function sub2(s){ return String(s).replace(/(\d)/g, function(m){ return "₀₁₂₃₄₅₆₇₈₉"[+m]; }); }
function phoneRatio(c, big, small, lim){
  var r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; if (!(w > 0)) w = 600; c.ratio = w < (lim || 480) ? small : big; r0(); };
  c.resize();
}
/* chiralité : R ou S à partir des positions (p4 = priorité la plus basse, vers l'arrière) */
function cipRS(c, p1, p2, p3, p4){ var tri = cross(sub(p2, p1), sub(p3, p1)); return dot(tri, sub(p4, c)) > 0 ? "R" : "S"; }
var MA = {C:12.011, H:1.008, N:14.007, O:15.999, Br:79.904, Mg:24.305};
function molM(el){ var m = 0; for (var q in el) m += el[q] * MA[q]; return m; }
var DRUG_GEO = {
 para:{el:"CCCCCCNCOCOHHHHHHHHH", p:[[0.302,-0.26,0.0],[-0.517,0.858,0.001],[-1.909,0.717,-0.003],[-2.486,-0.548,-0.008],[-1.671,-1.678,-0.009],[-0.288,-1.535,-0.005],[1.707,-0.239,0.004],[2.524,0.826,0.009],[2.151,1.972,0.011],[4.023,0.575,0.012],[-3.837,-0.687,-0.012],[-0.125,1.872,0.005],[-2.538,1.606,-0.002],[-2.119,-2.671,-0.013],[0.355,-2.414,-0.006],[2.167,-1.156,0.002],[4.285,0.004,0.9],[4.542,1.532,0.019],[4.291,0.015,-0.882],[-4.24,0.184,-0.01]], b:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[6,7,1],[7,8,2],[7,9,1],[3,10,1],[1,11,1],[2,12,1],[4,13,1],[5,14,1],[6,15,1],[9,16,1],[9,17,1],[9,18,1],[10,19,1]], g:{"ring":[0,1,2,3,4,5],"amide":[6,7,8],"me":[9],"phenol":[10]}},
 aspi:{el:"CCCCCCCOOOCOCHHHHHHHH", p:[[0.049,-0.527,0.397],[-0.933,0.388,0.036],[-2.16,-0.094,-0.444],[-2.401,-1.458,-0.561],[-1.411,-2.368,-0.197],[-0.191,-1.902,0.28],[-0.763,1.859,0.128],[0.264,2.359,0.531],[-1.772,2.664,-0.244],[1.271,-0.167,0.872],[2.326,-0.295,0.023],[2.733,-1.395,-0.275],[2.989,0.936,-0.548],[-2.933,0.621,-0.727],[-3.359,-1.816,-0.935],[-1.593,-3.438,-0.287],[0.59,-2.605,0.567],[-1.552,3.587,-0.143],[3.775,1.272,0.129],[2.248,1.726,-0.665],[3.422,0.697,-1.519]], b:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[1,6,1],[6,7,2],[6,8,1],[0,9,1],[9,10,1],[10,11,2],[10,12,1],[2,13,1],[3,14,1],[4,15,1],[5,16,1],[8,17,1],[12,18,1],[12,19,1],[12,20,1]], g:{"ring":[0,1,2,3,4,5],"acide":[6,7,8],"ester":[9,10,11],"me":[12]}},
 adre:{el:"CCCCCCCOCNCOOHHHHHHHHHHHHH", p:[[0.145,0.148,-0.123],[-0.586,1.335,-0.167],[-1.98,1.317,-0.08],[-2.647,0.104,0.053],[-1.917,-1.087,0.098],[-0.528,-1.063,0.01],[1.649,0.218,-0.222],[2.143,1.111,0.784],[2.29,-1.156,-0.034],[3.74,-1.061,-0.263],[4.342,-2.388,-0.072],[-2.651,2.499,-0.127],[-4.001,0.023,0.143],[-0.065,2.287,-0.271],[-2.441,-2.036,0.202],[0.033,-1.997,0.046],[1.924,0.609,-1.205],[2.898,1.582,0.423],[2.107,-1.509,0.981],[1.859,-1.861,-0.746],[3.902,-0.76,-1.213],[3.596,-3.158,-0.268],[4.699,-2.48,0.954],[5.179,-2.51,-0.759],[-2.025,3.219,-0.22],[-4.381,0.9,0.1]], b:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[6,7,1],[6,8,1],[8,9,1],[9,10,1],[2,11,1],[3,12,1],[1,13,1],[4,14,1],[5,15,1],[6,16,1],[7,17,1],[8,18,1],[8,19,1],[9,20,1],[10,21,1],[10,22,1],[10,23,1],[11,24,1],[12,25,1]], g:{"ring":[0,1,2,3,4,5],"alcool":[7],"c1":[6],"c2":[8],"amine":[9],"me":[10],"ph1":[11],"ph2":[12]}},
 ibu:{el:"CCCCCCCCCOOCCCCHHHHHHHHHHHHHHHHHH", p:[[1.173,-0.308,-0.349],[0.535,0.739,0.319],[-0.831,0.677,0.583],[-1.569,-0.434,0.18],[-0.938,-1.482,-0.487],[0.429,-1.417,-0.75],[2.653,-0.227,-0.629],[3.248,-1.619,-0.846],[3.365,0.429,0.536],[3.288,-0.084,1.63],[4.058,1.552,0.329],[-3.049,-0.503,0.466],[-3.705,0.825,0.083],[-5.212,0.74,0.331],[-3.447,1.113,-1.397],[1.111,1.608,0.633],[-1.323,1.497,1.105],[-1.513,-2.352,-0.802],[0.92,-2.238,-1.272],[2.817,0.376,-1.525],[2.929,-2.28,-0.04],[4.336,-1.552,-0.851],[2.904,-2.018,-1.8],[4.46,1.868,1.137],[-3.206,-0.692,1.528],[-3.495,-1.309,-0.116],[-3.282,1.627,0.689],[-5.626,1.745,0.403],[-5.397,0.203,1.262],[-5.687,0.21,-0.494],[-3.006,0.234,-1.867],[-2.763,1.957,-1.489],[-4.389,1.354,-1.89]], b:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[6,7,1],[6,8,1],[8,9,2],[8,10,1],[3,11,1],[11,12,1],[12,13,1],[12,14,1],[1,15,1],[2,16,1],[4,17,1],[5,18,1],[6,19,1],[7,20,1],[7,21,1],[7,22,1],[10,23,1],[11,24,1],[11,25,1],[12,26,1],[13,27,1],[13,28,1],[13,29,1],[14,30,1],[14,31,1],[14,32,1]], g:{"ring":[0,1,2,3,4,5],"ca":[6],"me1":[7],"acide":[8,9,10],"cb":[11],"cc":[12],"mi":[13,14]}},
};

/* ====================================================================== */
/* 1. Les fonctions dans de vrais médicaments (3D)                         */
/* ====================================================================== */
var RANKS = ["Acide carboxylique", "Ester", "Amide", "Aldéhyde", "Cétone", "Alcool ou phénol", "Amine"];
var GCOL = {1:"#d4471f", 2:"#8e44ad", 3:"#2a6fdb", 4:"#c27c0e", 5:"#b8860b", 6:"#1f9d55", 7:"#0e8f9e", 0:"#8a6d3b"};
var DRUGS = [
  {k:"para", nom:"Paracétamol", box:"PARACÉTAMOL", dose:"500 mg · comprimés", obj:"comprime", iupac:"N-(4-hydroxyphényl)éthanamide",
   el:{C:8, H:9, N:1, O:2}, use:"antidouleur et antipyrétique (fait baisser la fièvre)", chir:"aucun carbone asymétrique : molécule achirale",
   main:3, lad:{3:"suffixe « -amide » (groupe principal)", 6:"préfixe « hydroxy- »"},
   groups:[
    {at:["amide"], rank:3, n:"Amide (secondaire)", d:"–NH–CO– : N lié au C=O. C'est le groupe le plus prioritaire de la molécule : il donne le suffixe « -amide »."},
    {at:["phenol"], rank:6, n:"Phénol", d:"–OH porté directement par le cycle benzénique : il ne donne qu'un préfixe, « hydroxy- », car l'amide est prioritaire."},
    {at:["ring"], rank:0, n:"Cycle benzénique", d:"Le noyau aromatique est le squelette, pas un groupe caractéristique : il n'a pas de rang de priorité."},
    {at:["me"], rank:0, n:"Méthyle (squelette)", d:"Le CH₃ fait partie de la chaîne de l'amide : 2 carbones, d'où « éthanamide »."}]},
  {k:"aspi", nom:"Aspirine", box:"ASPIRINE", dose:"500 mg · comprimés", obj:"comprime", iupac:"acide 2-(acétyloxy)benzoïque",
   el:{C:9, H:8, O:4}, use:"anti-inflammatoire, antidouleur, et antiagrégant plaquettaire à faible dose", chir:"aucun carbone asymétrique : molécule achirale",
   main:1, lad:{1:"« acide …oïque » (groupe principal)", 2:"préfixe « acétyloxy- »"},
   groups:[
    {at:["acide"], rank:1, n:"Acide carboxylique", d:"–COOH : le plus prioritaire de tous. Le cycle qui le porte devient « acide benzoïque »."},
    {at:["ester"], rank:2, n:"Ester", d:"–O–CO– : un ester de phénol. Moins prioritaire que l'acide, il devient le préfixe « acétyloxy- »."},
    {at:["ring"], rank:0, n:"Cycle benzénique", d:"Squelette aromatique : pas de rang de priorité. Les deux groupes sont en ortho (positions 1 et 2)."},
    {at:["me"], rank:0, n:"Méthyle (squelette)", d:"Le CH₃ de l'acétyle : 2 carbones avec le C=O, d'où « acétyl- » (éthanoyl-)."}]},
  {k:"adre", nom:"Adrénaline", box:"ADRÉNALINE", dose:"stylo auto-injecteur", obj:"stylo", iupac:"4-[1-hydroxy-2-(méthylamino)éthyl]benzène-1,2-diol",
   el:{C:9, H:13, N:1, O:3}, use:"hormone du stress ; injectée en urgence contre le choc allergique", chir:"un carbone asymétrique (celui qui porte l'OH de la chaîne) ; le modèle est la (R)-adrénaline, la forme naturelle",
   main:6, lad:{6:"suffixe « -diol » + préfixe « hydroxy- »", 7:"préfixe « méthylamino- »"},
   groups:[
    {at:["ph1", "ph2"], rank:6, n:"Deux phénols", d:"Deux –OH sur le cycle (positions 1 et 2) : ce sont eux qui donnent le suffixe « benzène-1,2-diol »."},
    {at:["alcool"], rank:6, n:"Alcool secondaire", d:"–OH sur un carbone lié à deux autres carbones. Même rang que les phénols, mais sur la chaîne : préfixe « hydroxy- »."},
    {at:["amine"], rank:7, n:"Amine secondaire", d:"N lié à deux carbones et un H. Les amines sont moins prioritaires que les alcools : préfixe « méthylamino- »."},
    {at:["ring"], rank:0, n:"Cycle benzénique", d:"Squelette aromatique (le « benzène » du nom). Pas de rang de priorité."},
    {at:["c1", "c2", "me"], rank:0, n:"Chaîne carbonée", d:"C1 porte l'OH : il est asymétrique (4 groupes différents). L'adrénaline naturelle est (R)."}]},
  {k:"ibu", nom:"Ibuprofène", box:"IBUPROFÈNE", dose:"400 mg · comprimés", obj:"comprime", iupac:"acide 2-[4-(2-méthylpropyl)phényl]propanoïque",
   el:{C:13, H:18, O:2}, use:"anti-inflammatoire non stéroïdien (AINS), antidouleur", chir:"un carbone asymétrique (C2 de la chaîne) ; le modèle est la forme (S), la plus active (le médicament est vendu en mélange racémique)",
   main:1, lad:{1:"« acide …oïque » (groupe principal)"},
   groups:[
    {at:["acide"], rank:1, n:"Acide carboxylique", d:"–COOH : le seul groupe caractéristique, il donne « acide …propanoïque » (3 C, en comptant le C de COOH)."},
    {at:["ring"], rank:0, n:"Cycle benzénique", d:"Le cycle est ici un substituant de la chaîne : « phényl »."},
    {at:["ca", "me1"], rank:0, n:"Chaîne propanoïque", d:"Le C2 porte H, CH₃, COOH et le cycle : il est asymétrique. La forme (S) est la plus active."},
    {at:["cb", "cc", "mi"], rank:0, n:"2-Méthylpropyle", d:"Chaîne ramifiée de 4 C (isobutyle) : un groupe alkyle, sans rang de priorité."}]}
];
DRUGS.forEach(function(D){
  var G = DRUG_GEO[D.k], els = G.el.split(""), n = els.length, i;
  D.atoms = []; for (i = 0; i < n; i++) D.atoms.push({el:els[i], p:G.p[i]});
  D.bonds = G.b.map(function(b){ return {a:b[0], b:b[1], o:b[2]}; });
  D.gOf = []; for (i = 0; i < n; i++) D.gOf.push(-1);
  D.groups.forEach(function(g, gi){ g.ix = []; g.at.forEach(function(key){ G.g[key].forEach(function(ix){ g.ix.push(ix); D.gOf[ix] = gi; }); }); });
  /* les H suivent le groupe de leur atome lourd */
  D.bonds.forEach(function(b){ [[b.a, b.b], [b.b, b.a]].forEach(function(pq){ if (els[pq[1]] === "H" && D.gOf[pq[0]] >= 0 && D.gOf[pq[1]] < 0){ D.gOf[pq[1]] = D.gOf[pq[0]]; D.groups[D.gOf[pq[0]]].ix.push(pq[1]); } }); });
  D.cnt = {}; els.forEach(function(e){ D.cnt[e] = (D.cnt[e] || 0) + 1; });
  D.R = radius(D.atoms.map(function(a){ return a.p; }));
  /* visite guidée : groupes caractéristiques d'abord (par rang), puis le squelette */
  D.tour = D.groups.map(function(g, gi){ return gi; }).sort(function(x, y){ var a = D.groups[x].rank || 99, b = D.groups[y].rank || 99; return a - b || x - y; });
});
function fmla(cnt){ return ["C", "H", "N", "O"].map(function(e){ return cnt[e] ? e + (cnt[e] > 1 ? sub2(cnt[e]) : "") : ""; }).join(""); }

function pharmacy(ctx, W, H, t, D){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#f2f7f5"); g.addColorStop(1, "#dce8e4"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  /* étagères du fond (floues, pâles) */
  var cols = ["#e8b4a6", "#a9c7e8", "#c9e0b5", "#f0d79a", "#d3bce6", "#b5dcd8"], y0s = [H * 0.20, H * 0.47];
  ctx.save(); ctx.globalAlpha = 0.55;
  y0s.forEach(function(ys, si){
    ctx.fillStyle = "#c9b79a"; ctx.fillRect(0, ys, W, 7); ctx.fillStyle = "rgba(60,40,20,.12)"; ctx.fillRect(0, ys + 7, W, 5);
    var x = 8 + si * 13, k = si * 3;
    while (x < W - 10){
      var bw = 22 + ((k * 37) % 19), bh = 34 + ((k * 23) % 22), cc = cols[k % cols.length];
      var gb = ctx.createLinearGradient(x, 0, x + bw, 0); gb.addColorStop(0, shade(cc, 0.25)); gb.addColorStop(1, shade(cc, -0.18));
      ctx.fillStyle = gb; ctx.fillRect(x, ys - bh, bw, bh); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x + 3, ys - bh * 0.62, bw - 6, bh * 0.22);
      x += bw + 4 + ((k * 11) % 6); k++;
    }
  });
  ctx.restore();
  /* croix verte de pharmacie (enseigne lumineuse) */
  var cs = Math.min(W, H) * 0.05, cxx = W - cs * 1.9, cyy = cs * 1.8, pul = 0.75 + 0.25 * Math.sin(t * 2.2);
  ctx.save(); ctx.shadowColor = "rgba(40,190,90," + (0.8 * pul).toFixed(2) + ")"; ctx.shadowBlur = 16;
  var gc = ctx.createLinearGradient(cxx - cs, cyy - cs, cxx + cs, cyy + cs); gc.addColorStop(0, "#5fe08a"); gc.addColorStop(1, "#1b9e4b");
  ctx.fillStyle = gc; ctx.fillRect(cxx - cs * 0.33, cyy - cs, cs * 0.66, cs * 2); ctx.fillRect(cxx - cs, cyy - cs * 0.33, cs * 2, cs * 0.66); ctx.restore();
  /* faisceau de lumière sur la molécule */
  var sp = ctx.createRadialGradient(W * 0.5, H * 0.42, 10, W * 0.5, H * 0.45, Math.max(W, H) * 0.5);
  sp.addColorStop(0, "rgba(255,255,255,.92)"); sp.addColorStop(0.6, "rgba(255,255,255,.45)"); sp.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sp; ctx.fillRect(0, 0, W, H);
  /* comptoir */
  var cy = H * 0.79;
  var gt = ctx.createLinearGradient(0, cy, 0, cy + 12); gt.addColorStop(0, "#d9b98c"); gt.addColorStop(1, "#a9824f"); ctx.fillStyle = gt; ctx.fillRect(0, cy, W, 12);
  var gf = ctx.createLinearGradient(0, cy + 12, 0, H); gf.addColorStop(0, "#fdfdfb"); gf.addColorStop(1, "#dfe3e0"); ctx.fillStyle = gf; ctx.fillRect(0, cy + 12, W, H - cy - 12);
  ctx.fillStyle = "rgba(27,158,75,.85)"; ctx.fillRect(0, cy + 12, W, 4);
  /* ombre de la molécule sur le comptoir */
  ctx.save(); ctx.fillStyle = "rgba(15,27,45,.10)"; ctx.beginPath(); ctx.ellipse(W * 0.5, cy + 3, W * 0.3, 6, 0, 0, 7); ctx.fill(); ctx.restore();
  /* boîte du médicament (en volume) */
  var bw = Math.min(W * 0.24, 130), bh = bw * 0.42, bd = bw * 0.22, bx = 12, by = cy - bh + 2;
  ctx.save();
  ctx.fillStyle = "rgba(15,27,45,.14)"; ctx.beginPath(); ctx.ellipse(bx + bw * 0.6, cy + 2, bw * 0.62, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#e9eef2"; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bd, by - bd * 0.5); ctx.lineTo(bx + bw + bd, by - bd * 0.5); ctx.lineTo(bx + bw, by); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#c8d1d9"; ctx.beginPath(); ctx.moveTo(bx + bw, by); ctx.lineTo(bx + bw + bd, by - bd * 0.5); ctx.lineTo(bx + bw + bd, by + bh - bd * 0.5); ctx.lineTo(bx + bw, by + bh); ctx.closePath(); ctx.fill();
  var gfr = ctx.createLinearGradient(bx, by, bx, by + bh); gfr.addColorStop(0, "#ffffff"); gfr.addColorStop(1, "#eef2f5"); ctx.fillStyle = gfr; ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = GCOL[D.main]; ctx.fillRect(bx, by + bh * 0.70, bw, bh * 0.30);
  ctx.restore();
  label(ctx, D.box, bx + bw / 2, by + bh * 0.28, {size:Math.max(8.5, bw * 0.095), weight:800, col:"#13233a", maxW:bw - 8});
  label(ctx, D.dose, bx + bw / 2, by + bh * 0.85, {size:Math.max(8.5, bw * 0.068), weight:700, col:"#fff", maxW:bw - 6});
  /* objet : comprimé sécable ou stylo auto-injecteur */
  var ox = W - Math.min(W * 0.16, 80), oy = cy - 2;
  ctx.save();
  if (D.obj === "comprime"){
    var rw = Math.min(W * 0.055, 26);
    ctx.fillStyle = "rgba(15,27,45,.16)"; ctx.beginPath(); ctx.ellipse(ox, oy + 3, rw * 1.05, rw * 0.32, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#d7dde3"; ctx.beginPath(); ctx.ellipse(ox, oy, rw, rw * 0.36, 0, 0, PI); ctx.fill(); ctx.fillRect(ox - rw, oy - rw * 0.14, rw * 2, rw * 0.14);
    var gp = ctx.createRadialGradient(ox - rw * 0.3, oy - rw * 0.3, 2, ox, oy - rw * 0.14, rw); gp.addColorStop(0, "#ffffff"); gp.addColorStop(1, "#e6eaee");
    ctx.fillStyle = gp; ctx.beginPath(); ctx.ellipse(ox, oy - rw * 0.14, rw, rw * 0.36, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = "#b9c2cb"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ox - rw * 0.8, oy - rw * 0.14); ctx.lineTo(ox + rw * 0.8, oy - rw * 0.14); ctx.stroke();
  } else {
    var pl = Math.min(W * 0.2, 96), ph2 = pl * 0.16;
    ctx.translate(ox - pl * 0.45, oy - ph2 * 0.7); ctx.rotate(-0.12);
    ctx.fillStyle = "rgba(15,27,45,.16)"; ctx.fillRect(4, ph2 * 0.9, pl, 4);
    var gs = ctx.createLinearGradient(0, 0, 0, ph2); gs.addColorStop(0, "#ffe27a"); gs.addColorStop(1, "#d9a520"); ctx.fillStyle = gs; rr(ctx, 0, 0, pl * 0.72, ph2, ph2 / 2); ctx.fill();
    var gs2 = ctx.createLinearGradient(0, 0, 0, ph2); gs2.addColorStop(0, "#ff8a6a"); gs2.addColorStop(1, "#c8432a"); ctx.fillStyle = gs2; rr(ctx, pl * 0.70, ph2 * 0.08, pl * 0.30, ph2 * 0.84, ph2 * 0.4); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(pl * 0.08, ph2 * 0.2, pl * 0.5, ph2 * 0.14);
  }
  ctx.restore();
}

SFA.sim({
  id:"org-fonctions-medicaments-3d", ch:"L15", tag:"Groupes caractéristiques",
  titre:"Les fonctions dans de vrais médicaments",
  resume:"Paracétamol, aspirine, adrénaline et ibuprofène en 3D : survole un atome et le groupe caractéristique qui le contient s'allume, avec son nom et son rang de priorité.",
  but:"Choisis un médicament. Il tourne en 3D au-dessus du comptoir de la pharmacie, et une visite guidée allume ses groupes un par un. Survole (ou touche) un atome : tout son groupe s'allume, avec son nom, son rang dans l'ordre de priorité et ce qu'il devient dans le nom (suffixe ou préfixe). L'échelle sous la scène montre les groupes présents. Glisse sur la molécule pour la tourner.",
  aRetenir:"Ordre de priorité (simplifié) : acide carboxylique > ester > amide > aldéhyde > cétone > alcool/phénol > amine. Le groupe le plus prioritaire donne le suffixe (acide …oïque, -amide, -ol…) ; tous les autres deviennent des préfixes (hydroxy-, amino-, acétyloxy-…). Le cycle benzénique et les chaînes carbonées forment le squelette : ce ne sont pas des groupes caractéristiques. Un phénol est un –OH porté par le cycle, un alcool un –OH porté par un carbone sp³.",
  piege:"Ne confonds pas ester et acide : dans l'aspirine, le –O–CO–CH₃ n'a pas de H acide, c'est un ester ; seul le –COOH est un acide. Le –NH–CO– du paracétamol est un amide, pas une amine suivie d'une cétone : un C=O lié à N forme un seul groupe. Et un –OH sur un cycle benzénique n'est pas un alcool : c'est un phénol (plus acide).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.9}); phoneRatio(c, 0.9, 1.16);
    var gL = k.canvas(178);
    var st = {a:0, b:0.28, spin:true, t:0, ts:0, hov:-1, sel:-1, tourT:0, tourI:0, pr:null};
    viewCtl(c, st, {
      hover:function(p){ var i = pick(p); st.hov = i; c.cv.style.cursor = i >= 0 ? "pointer" : "grab"; },
      tap:function(p){ var i = pick(p); st.sel = i >= 0 && i !== st.sel ? i : -1; }
    });
    st.onview = function(){ st.spin = false; spinT.set(false); };
    c.cv.addEventListener("pointerleave", function(){ st.hov = -1; });
    var dS = k.seg("Médicament", DRUGS.map(function(D, i){ return [String(i), D.nom]; }), "0", function(){ st.sel = -1; st.hov = -1; st.tourI = 0; st.tourT = 0; st.cur = null; });
    var tourT = k.toggle("Visite guidée des groupes", true);
    var hT = k.toggle("Afficher les hydrogènes", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Groupe éclairé", "Rang de priorité", "Groupe principal → nom", "Nom IUPAC", "Formule brute · M"]);
    var nt = k.note("", "ok");
    function cur(){ return DRUGS[+dS.value] || DRUGS[0]; }
    function pick(p){
      if (!st.pr) return -1;
      var D = cur(), best = -1, bd = 1e9;
      st.pr.forEach(function(q, i){ if (!hT.value && D.atoms[i].el === "H") return; var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < q.r + 6 && d - q.r < bd){ bd = d - q.r; best = i; } });
      return best >= 0 ? D.gOf[best] : -1;
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.62 * Math.sin(st.ts * 0.34); st.b = 0.28 + 0.24 * Math.sin(st.ts * 0.23); }
      st.tourT += dt; var D = cur();
      if (st.tourT > 3.2){ st.tourT = 0; st.tourI = (st.tourI + 1) % D.tour.length; }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var D = cur(), ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t;
      c.clear(); pharmacy(ctx, W, H, t, D);
      var act = st.sel >= 0 ? st.sel : st.hov >= 0 ? st.hov : tourT.value ? D.tour[st.tourI] : -1;
      var G = act >= 0 ? D.groups[act] : null, gc = G ? GCOL[G.rank] : null, pulse = 0.6 + 0.4 * Math.sin(t * 4);
      var top = ph ? 74 : 74, bot = H * 0.79 - 6;
      var P0 = D.atoms.filter(function(a){ return hT.value || a.el !== "H"; }).map(function(a){ return sub(a.p, D.R.c); });
      var fb = fitBox(P0, st, {w:W - 28, h:bot - top}, 1.3);
      if (st.cur !== D){ st.cur = D; st.sc = fb.sc; st.mx = fb.mx; st.my = fb.my; }
      st.sc += (fb.sc - st.sc) * 0.06; st.mx += (fb.mx - st.mx) * 0.06; st.my += (fb.my - st.my) * 0.06;
      var sc = Math.min(st.sc, W * 0.16), V = {st:st, sc:sc, cx:W * 0.5 - st.mx * sc, cy:(top + bot) / 2 + st.my * sc};
      var atoms = D.atoms.map(function(a, i){
        var o = {alpha:(!hT.value && a.el === "H") ? 0 : 1};
        if (a.el === "C" || a.el === "N" || a.el === "O") o.lab = a.el === "C" ? "" : a.el;
        if (G){
          if (D.gOf[i] === act){ o.glow = rgba(gc, (0.55 + 0.35 * pulse).toFixed(3)); o.ring = gc; }
          else if (o.alpha) o.alpha = 0.55;
        }
        return At(a.el, sub(a.p, D.R.c), o);
      });
      var bonds = D.bonds.map(function(b){
        var o = {a:b.a, b:b.b, o:b.o};
        if (G && D.gOf[b.a] === act && D.gOf[b.b] === act) o.glow = rgba(gc, 0.35);
        return o;
      });
      st.pr = drawScene(c, V, atoms, bonds);
      /* étiquette du groupe, au-dessus de son centre */
      if (G){
        var mx = 0, my = 0, mn = 1e9, nn = 0;
        G.ix.forEach(function(i){ if (!hT.value && D.atoms[i].el === "H") return; mx += st.pr[i].x; my += st.pr[i].y; mn = Math.min(mn, st.pr[i].y - st.pr[i].r); nn++; });
        mx /= nn; my /= nn;
        var tx = G.n + (G.rank ? "  ·  rang " + G.rank + " sur 7" : "  ·  squelette"), fs = ph ? 11.5 : 13;
        ctx.save(); ctx.font = "800 " + fs + "px " + FONT; var tw = ctx.measureText(tx).width + 14; ctx.restore();
        var lx = clamp(mx, tw / 2 + 6, W - tw / 2 - 6), ly = clamp(mn - 18, top - 4, bot - 10);
        ctx.save(); ctx.strokeStyle = rgba(gc, 0.7); ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(lx, ly + 10); ctx.lineTo(mx, my); ctx.stroke(); ctx.restore();
        label(ctx, tx, lx, ly, {size:fs, weight:800, col:"#fff", bg:gc});
      }
      /* bandeau du haut : nom du médicament */
      label(ctx, D.nom, 12, 18, {size:ph ? 15 : 17, weight:800, align:"left", col:"#13233a", bg:"rgba(255,255,255,.88)"});
      label(ctx, D.use, 12, 42, {size:ph ? 10.5 : 11.5, weight:600, align:"left", col:"#4b5a6c", maxW:W - (ph ? 70 : 90)});
      var hint = st.sel >= 0 ? "touche ailleurs pour libérer le groupe" : (ph ? "touche un atome · glisse pour tourner" : "survole un atome · glisse pour tourner");
      var fy = H * 0.79 + 16, fh = H - fy;
      label(ctx, D.iupac, W / 2, fy + fh * 0.38, {size:ph ? 13 : 16, weight:800, col:"#13233a", maxW:W - 24});
      label(ctx, hint, W / 2, fy + fh * 0.76, {size:ph ? 10 : 11, weight:600, col:"#7d8896"});
      /* échelle de priorité */
      gL.clear(); var g = gL.ctx, GW = gL.W, GH = gL.H, rh = (GH - 26) / 7;
      g.fillStyle = "#fbfcfe"; g.fillRect(0, 0, GW, GH);
      label(g, "Ordre de priorité des groupes (le n° 1 donne le suffixe)", 10, 11, {size:ph ? 10.5 : 11.5, align:"left", col:"#2c3a4e", maxW:GW - 20});
      var present = {}; D.groups.forEach(function(gg){ if (gg.rank) present[gg.rank] = (present[gg.rank] || 0) + 1; });
      for (var r = 1; r <= 7; r++){
        var y = 22 + (r - 1) * rh, on = !!present[r], isAct = G && G.rank === r, col = GCOL[r];
        g.save();
        g.fillStyle = isAct ? rgba(col, 0.22) : on ? rgba(col, 0.10) : "rgba(0,0,0,0.02)"; rr(g, 6, y + 1, GW - 12, rh - 3, 6); g.fill();
        if (isAct){ g.strokeStyle = col; g.lineWidth = 1.6; g.stroke(); }
        g.restore();
        badge(g, 18, y + rh / 2, String(r), on ? col : "#a9b3bf", 1, Math.min(8, rh * 0.42));
        var nw = label(g, RANKS[r - 1], 32, y + rh / 2, {size:ph ? 10.5 : 11.5, align:"left", weight:on ? 800 : 600, col:on ? "#13233a" : "#9aa5b1"});
        if (on){
          var tx2 = D.lad[r] || "";
          label(g, tx2, GW - 12, y + rh / 2, {size:ph ? 9.5 : 11, align:"right", weight:700, col:shade(col, -0.25), maxW:Math.max(60, GW - 44 - nw - 10)});
        }
      }
      /* valeurs */
      var Mm = molM(D.el), mainG = RANKS[D.main - 1];
      ro.set(0, G ? G.n : "—");
      ro.set(1, G ? (G.rank ? G.rank + " sur 7 (" + RANKS[G.rank - 1].toLowerCase() + ")" : "aucun (squelette)") : "—");
      ro.set(2, mainG + " → " + (D.lad[D.main] || "").split(" (")[0]);
      ro.set(3, D.iupac);
      ro.set(4, fmla(D.el) + " · " + F2(Mm, 2) + " g/mol");
      nt.set((G ? "<b>" + G.n + "</b> : " + G.d + " " : "") + "<i>Chiralité : " + D.chir + ".</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 2. Une flèche courbe, c'est un doublet qui voyage                       */
/* ====================================================================== */
function slerpD(a, b, t){
  a = nrm(a); b = nrm(b);
  var d = clamp(dot(a, b), -1, 1), om = Math.acos(d);
  if (om < 1e-4) return a;
  if (PI - om < 1e-3) return rotAx(a, perpTo(a), om * t);
  var so = Math.sin(om);
  return add(mul(a, Math.sin((1 - t) * om) / so), mul(b, Math.sin(t * om) / so));
}
var VAL = {H:1, C:4, N:5, O:6, Br:7};
var X3 = [1, 0, 0], Y3 = [0, 1, 0], Z3 = [0, 0, 1], NX = [-1, 0, 0], NY = [0, -1, 0];
/* ajoute un méthyle sur l'atome i selon la direction d (H en tétraèdre) */
function methyl(A, B, i, d, ref, ph, L){
  var p = add(A[i].p, mul(nrm(d), L || 1.53)); A.push({el:"C", p:p}); var c = A.length - 1; B.push({a:i, b:c, o0:1, o1:1});
  tetra3(mul(d, -1), ref || Y3, ph || 0).forEach(function(h){ A.push({el:"H", p:add(p, mul(h, 1.09))}); B.push({a:c, b:A.length - 1, o0:1, o1:1}); });
  return c;
}
function hOn(A, B, i, d, L){ A.push({el:"H", p:add(A[i].p, mul(nrm(d), L || 1.09))}); B.push({a:i, b:A.length - 1, o0:1, o1:1}); return A.length - 1; }
var STEPS = [
  {k:"prot", n:"Protonation d'un alcool", eq:"CH₃–OH + H₃O⁺ → CH₃–OH₂⁺ + H₂O",
   form:"O–H (l'O de l'alcool prend le H⁺)", brk:"H–O de H₃O⁺", type:"transfert de proton (acide-base)",
   txt:"Flèche jaune : un doublet non liant de l'oxygène de l'alcool part vers le H de H₃O⁺ et devient la nouvelle liaison O–H. Flèche orange : le doublet de l'ancienne liaison H–O retourne sur l'oxygène de l'eau, qui récupère un doublet non liant. L'alcool devient un ion oxonium (+), H₃O⁺ redevient H₂O (neutre) : le « + » a changé d'atome, la charge totale reste +1.",
   geo:function(s){
     var A = [], B = [], L = [];
     A.push({el:"O", p:[0, 0, 0], nm:"O de l'alcool"});                       /* 0 */
     var dLp = X3, tO = tetra3(X3, Y3, PI), dC = tO[0], others = [tO[1], tO[2]];
     A.push({el:"C", p:mul(dC, 1.43)}); B.push({a:0, b:1, o0:1, o1:1});
     tetra3(mul(dC, -1), Y3, 0.5).forEach(function(h){ A.push({el:"H", p:add(A[1].p, mul(h, 1.09))}); B.push({a:1, b:A.length - 1, o0:1, o1:1}); });
     var iH1 = hOn(A, B, 0, others[0], 0.96);
     L.push({a:0, d:others[1], e0:1, e1:1});
     var xO2 = lerp(2.62, 3.15, s), dTr = nrm(dLp);
     var O2 = mul(dTr, xO2); A.push({el:"O", p:O2, nm:"O de H₃O⁺"}); var i2 = A.length - 1;
     var Ha = lerp3(sub(O2, mul(dTr, 0.98)), mul(dTr, 0.98), ease(s)); A.push({el:"H", p:Ha}); var ia = A.length - 1;
     B.push({a:0, b:ia, o0:0, o1:1}); B.push({a:i2, b:ia, o0:1, o1:0});
     var t2 = tetra3(mul(dTr, -1), Y3, 0.3);
     hOn(A, B, i2, t2[0], 0.98); hOn(A, B, i2, t2[1], 0.98);
     L.push({a:i2, d:t2[2], e0:1, e1:1});
     L.push({a:i2, d:mul(dTr, -1), e0:0, e1:1, dst:1});
     L.push({a:0, d:dLp, e0:1, e1:0, src:0});
     return {A:A, B:B, L:L, arrows:[
       {from:function(){ return add(A[0].p, mul(dLp, 0.62)); }, to:function(){ return lerp3(A[0].p, A[ia].p, 0.78); }, off:mul(Y3, 0.9), col:"#ffd84d"},
       {from:function(){ return lerp3(A[ia].p, A[i2].p, 0.5); }, to:function(){ return add(A[i2].p, mul(NY, 0.62)); }, off:mul(NY, 0.6), col:"#ff9f7a"}]};
   }},
  {k:"dep", n:"Départ du nucléofuge", ln:"Départ du nucléofuge (ionisation)", eq:"(CH₃)₃C–Br → (CH₃)₃C⁺ + Br⁻",
   form:"aucune", brk:"C–Br (rupture hétérolytique)", type:"hétérolyse (1re étape d'une SN1 ou d'une E1)",
   txt:"Une seule flèche, qui part du milieu de la liaison C–Br et pointe vers Br : les deux électrons de la liaison partent tous les deux avec le brome, plus électronégatif. Br devient Br⁻ (4 doublets non liants) ; le carbone perd un doublet de liaison et devient un carbocation (+), plan, avec une orbitale p vide.",
   geo:function(s){
     var A = [], B = [], L = [], e = ease(s);
     A.push({el:"C", p:[0, 0.2, 0], nm:"C central"});
     var dBr = NY, rBr = lerp(1.97, 3.25, e);
     A.push({el:"Br", p:add(A[0].p, mul(dBr, rBr)), nm:"Br"}); B.push({a:0, b:1, o0:1, o1:0});
     umbrella(Y3, X3, lerp(70.53, 90, e), 0.4).forEach(function(d){ methyl(A, B, 0, d, Y3, 0.6); });
     tetra3(mul(dBr, -1), X3, 0.2).forEach(function(d){ L.push({a:1, d:d, e0:1, e1:1}); });
     L.push({a:1, d:Y3, e0:0, e1:1, dst:0});
     return {A:A, B:B, L:L, pOrb:{a:0, axis:Y3, amp:e}, arrows:[
       {from:function(){ return lerp3(A[0].p, A[1].p, 0.45); }, to:function(){ return add(A[1].p, mul(X3, 0.72)); }, off:mul(X3, 0.6), col:"#ffd84d"}]};
   }},
  {k:"cap", n:"Capture du carbocation", ln:"Capture du carbocation par l'eau", eq:"(CH₃)₃C⁺ + H₂O → (CH₃)₃C–OH₂⁺",
   form:"C–O", brk:"aucune", type:"attaque d'un nucléophile sur un électrophile",
   txt:"La flèche part d'un doublet non liant de l'oxygène (le nucléophile) et pointe vers le carbone (l'électrophile, qui a une case vide). Ce doublet devient la liaison C–O. Le carbone redevient tétraédrique et neutre ; l'oxygène, qui a maintenant 3 liaisons et un seul doublet, porte la charge +.",
   geo:function(s){
     var A = [], B = [], L = [], e = ease(s);
     A.push({el:"C", p:[0, -0.3, 0], nm:"C central"});
     umbrella(NY, X3, lerp(90, 70.53, e), 0.4).forEach(function(d){ methyl(A, B, 0, d, Y3, 0.6); });
     var rO = lerp(3.0, 1.48, e), O = add(A[0].p, mul(Y3, rO));
     A.push({el:"O", p:O, nm:"O de l'eau"}); var io = A.length - 1; B.push({a:0, b:io, o0:0, o1:1});
     var t3 = tetra3(NY, Z3, 0);
     hOn(A, B, io, t3[0], 0.97); hOn(A, B, io, t3[1], 0.97);
     L.push({a:io, d:t3[2], e0:1, e1:1});
     L.push({a:io, d:NY, e0:1, e1:0, src:0});
     return {A:A, B:B, L:L, pOrb:{a:0, axis:Y3, amp:1 - e}, arrows:[
       {from:function(){ return add(A[io].p, mul(NY, 0.62)); }, to:function(){ return lerp3(A[io].p, A[0].p, 0.8); }, off:mul(X3, 1.0), col:"#ffd84d"}]};
   }},
  {k:"sn2", n:"SN2 (une seule étape)", ln:"SN2 : substitution en une étape", eq:"HO⁻ + CH₃–Br → HO–CH₃ + Br⁻",
   form:"C–O", brk:"C–Br", type:"substitution nucléophile (une seule étape)",
   txt:"Deux flèches en même temps. Jaune : un doublet de HO⁻ attaque le carbone par l'arrière, à l'opposé du brome. Orange : le doublet de la liaison C–Br part avec Br, qui devient Br⁻. Les trois H du carbone se retournent comme un parapluie (inversion de Walden). La charge − passe de l'oxygène au brome.",
   geo:function(s){
     var A = [], B = [], L = [], e = ease(s);
     A.push({el:"C", p:[0, 0, 0], nm:"C"});
     var rO = lerp(3.1, 1.43, ease(s * 1.05)), rBr = lerp(1.97, 3.3, ease(s * 1.1 - 0.05));
     A.push({el:"O", p:mul(NX, rO), nm:"O de HO⁻"}); B.push({a:0, b:1, o0:0, o1:1});
     A.push({el:"Br", p:mul(X3, rBr), nm:"Br"}); B.push({a:0, b:2, o0:1, o1:0});
     umbrella(NX, Y3, lerp(70.53, 109.47, e), 0).forEach(function(d){ hOn(A, B, 0, d); });
     var dOH = nrm([-0.33, 0.94, 0]); hOn(A, B, 1, dOH, 0.96);
     var tO = tetra3(dOH, X3, 0), lpO = [], k;
     tO.forEach(function(d){ lpO.push(d); });
     var iSrc = 0; lpO.forEach(function(d, q){ if (d[0] > lpO[iSrc][0]) iSrc = q; });
     lpO.forEach(function(d, q){ if (q === iSrc) L.push({a:1, d:X3, e0:1, e1:0, src:0}); else L.push({a:1, d:d, e0:1, e1:1}); });
     tetra3(NX, Y3, 0.5).forEach(function(d){ L.push({a:2, d:d, e0:1, e1:1}); });
     L.push({a:2, d:NX, e0:0, e1:1, dst:1});
     return {A:A, B:B, L:L, arrows:[
       {from:function(){ return add(A[1].p, mul(X3, 0.62)); }, to:function(){ return lerp3(A[1].p, A[0].p, 0.82); }, off:mul(Y3, 1.0), col:"#ffd84d"},
       {from:function(){ return lerp3(A[0].p, A[2].p, 0.5); }, to:function(){ return add(A[2].p, mul(Y3, 0.72)); }, off:mul(Y3, 0.5), col:"#ff9f7a"}]};
   }},
  {k:"co", va:0.3, vb:-0.95, n:"Addition sur C=O", ln:"Addition nucléophile sur C=O", eq:"N≡C⁻ + CH₃–CHO → CH₃–CH(CN)–O⁻",
   form:"C–C (cyanure → carbone du C=O)", brk:"la liaison π de C=O", type:"addition nucléophile",
   txt:"Jaune : le doublet du carbone de l'ion cyanure attaque le carbone du C=O (δ+), un peu en arrière de l'oxygène (≈ 107°). Orange : les deux électrons de la liaison π C=O montent sur l'oxygène. On forme un ion alcoolate : O porte 3 doublets et la charge −. Le carbone passe de sp² (plan) à sp³ (tétraédrique).",
   geo:function(s){
     var A = [], B = [], L = [], e = ease(s);
     var dN2 = nrm([-0.29, 0.0, 0.96]);
     A.push({el:"C", p:[0, 0, 0], nm:"C du C=O"});
     var p0 = [X3, nrm([-0.5, 0.866, 0]), nrm([-0.5, -0.866, 0])];
     var p1 = umbrella(mul(dN2, -1), X3, 70.53, 0);
     /* associe chaque direction finale à la direction initiale la plus proche */
     var fin = p0.map(function(d){ var b = 0, bd = -9; p1.forEach(function(q, k){ var v = dot(d, q); if (v > bd){ bd = v; b = k; } }); return p1[b]; });
     var dO = slerpD(p0[0], fin[0], e), dH = slerpD(p0[1], fin[1], e), dM = slerpD(p0[2], fin[2], e);
     A.push({el:"O", p:mul(dO, lerp(1.22, 1.38, e)), nm:"O du C=O"}); B.push({a:0, b:1, o0:2, o1:1});
     hOn(A, B, 0, dH);
     methyl(A, B, 0, dM, Z3, 0.2);
     var r = lerp(3.1, 1.47, e), Cn = mul(dN2, r);
     A.push({el:"C", p:Cn, nm:"C du cyanure"}); var ic = A.length - 1; B.push({a:0, b:ic, o0:0, o1:1});
     A.push({el:"N", p:add(Cn, mul(dN2, 1.16)), nm:"N"}); B.push({a:ic, b:A.length - 1, o0:3, o1:3});
     L.push({a:A.length - 1, d:dN2, e0:1, e1:1});
     L.push({a:ic, d:mul(dN2, -1), e0:1, e1:0, src:0});
     var e1o = nrm(cross(dO, Z3)), e2o = cross(dO, e1o);
     var lpd = function(az, phi){ return add(mul(dO, Math.cos(phi * DEG)), mul(add(mul(e1o, Math.cos(az * DEG)), mul(e2o, Math.sin(az * DEG))), Math.sin(phi * DEG))); };
     var phO = lerp(60, 70.53, e);
     L.push({a:1, d:lpd(lerp(0, -30, e), phO), e0:1, e1:1}); L.push({a:1, d:lpd(lerp(180, 210, e), phO), e0:1, e1:1});
     L.push({a:1, d:lpd(90, 70.53), e0:0, e1:1, dst:1});
     return {A:A, B:B, L:L, arrows:[
       {from:function(){ return add(A[ic].p, mul(dN2, -0.62)); }, to:function(){ return lerp3(A[ic].p, A[0].p, 0.8); }, off:mul(X3, -1.0), col:"#ffd84d"},
       {from:function(){ return add(lerp3(A[0].p, A[1].p, 0.5), mul(Z3, 0.35)); }, to:function(){ return add(A[1].p, mul(Z3, -0.5)); }, off:mul(X3, 1.0), col:"#ff9f7a"}]};
   }},
  {k:"ae", n:"Alcène + HBr", ln:"Addition électrophile : alcène + HBr", eq:"CH₂=CH₂ + H–Br → CH₃–CH₂⁺ + Br⁻",
   form:"C–H", brk:"la liaison π de C=C et la liaison H–Br", type:"addition électrophile (1re étape)",
   txt:"Jaune : les deux électrons de la liaison π (le nuage au-dessus et au-dessous de C=C) attaquent le H de H–Br et forment une liaison C–H. Orange : en même temps, le doublet de H–Br part sur Br, qui devient Br⁻. L'autre carbone a perdu sa part de la liaison π : c'est un carbocation (+), avec une orbitale p vide. Br⁻ l'attaquera à l'étape suivante.",
   geo:function(s){
     var A = [], B = [], L = [], e = ease(s);
     var hc = lerp(0.67, 0.74, e);
     A.push({el:"C", p:[-hc, 0, 0], nm:"C1 (reçoit H)"}); A.push({el:"C", p:[hc, 0, 0], nm:"C2"});
     B.push({a:0, b:1, o0:2, o1:1});
     /* C1 : ses deux H se rabattent quand il devient sp³ (le nouveau H arrive par le haut) */
     var d1 = [nrm([-0.5, lerp(0, -0.35, e), 0.866]), nrm([-0.5, lerp(0, -0.35, e), -0.866])];
     hOn(A, B, 0, d1[0]); hOn(A, B, 0, d1[1]);
     hOn(A, B, 1, [0.5, 0, 0.866]); hOn(A, B, 1, [0.5, 0, -0.866]);
     var Hs = [-0.67 + 0.25, 2.45, 0], He = [-hc - 0.1, 1.085, 0];
     var Hp = lerp3(Hs, He, e); A.push({el:"H", p:Hp}); var ih = A.length - 1;
     var Brs = add(Hs, [0, 1.42, 0]), Bre = [0.9, 3.55, 0];
     A.push({el:"Br", p:lerp3(Brs, Bre, ease(s * 1.08 - 0.04)), nm:"Br"}); var ib = A.length - 1;
     B.push({a:0, b:ih, o0:0, o1:1}); B.push({a:ih, b:ib, o0:1, o1:0});
     var dbr = nrm(sub(A[ib].p, A[ih].p));
     tetra3(dbr, X3, 0.4).forEach(function(d){ L.push({a:ib, d:mul(d, -1), e0:1, e1:1}); });
     L.push({a:ib, d:mul(dbr, -1), e0:0, e1:1, dst:1});
     return {A:A, B:B, L:L, pOrb:{a:1, axis:Y3, amp:e}, arrows:[
       {from:function(){ return add(lerp3(A[0].p, A[1].p, 0.5), [0, 0.42, 0]); }, to:function(){ return lerp3(A[0].p, A[ih].p, 0.72); }, off:mul(NX, 0.7), col:"#ffd84d"},
       {from:function(){ return lerp3(A[ih].p, A[ib].p, 0.5); }, to:function(){ return add(A[ib].p, mul(X3, 0.72)); }, off:mul(X3, 0.6), col:"#ff9f7a"}]};
   }}
];
/* charges formelles d'un état (0 = avant, 1 = après) : FC = V − 2 × doublets − Σ ordres */
function formalCharges(G, st){
  var fc = G.A.map(function(a){ return VAL[a.el]; });
  G.L.forEach(function(l){ if (st ? l.e1 : l.e0) fc[l.a] -= 2; });
  G.B.forEach(function(b){ var o = st ? b.o1 : b.o0; fc[b.a] -= o; fc[b.b] -= o; });
  return fc;
}
function chalkboard(ctx, W, H, t, smudge){
  var fr = 10;
  var gw = ctx.createLinearGradient(0, 0, 0, H); gw.addColorStop(0, "#8b5a33"); gw.addColorStop(1, "#6d4425"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, H);
  var g = ctx.createRadialGradient(W * 0.45, H * 0.4, 20, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
  g.addColorStop(0, "#2f5a4b"); g.addColorStop(1, "#1a3a30"); ctx.fillStyle = g; ctx.fillRect(fr, fr, W - 2 * fr, H - 2 * fr - 16);
  ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = "#ffffff";
  smudge.forEach(function(m){ ctx.beginPath(); ctx.ellipse(fr + m.x * (W - 2 * fr), fr + m.y * (H - 40), 40 + m.r * 30, 10 + m.r * 6, m.r, 0, 7); ctx.fill(); });
  ctx.restore();
  /* reflet du cadre et rebord à craies */
  ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.fillRect(fr, fr, W - 2 * fr, 2);
  var gt = ctx.createLinearGradient(0, H - fr - 16, 0, H); gt.addColorStop(0, "#a8754a"); gt.addColorStop(1, "#5c391f"); ctx.fillStyle = gt; ctx.fillRect(0, H - fr - 16, W, 16 + fr);
  ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(fr, H - fr - 16, W - 2 * fr, 3);
  /* craies et brosse */
  [[0.70, "#f7f4ea"], [0.75, "#ffd84d"], [0.79, "#ff9f7a"]].forEach(function(cc){ ctx.save(); ctx.translate(W * cc[0], H - fr - 9); ctx.rotate(-0.08); ctx.fillStyle = cc[1]; rr(ctx, 0, -3, 24, 6, 3); ctx.fill(); ctx.restore(); });
  var bx = W * 0.12; ctx.fillStyle = "#3b3f46"; rr(ctx, bx, H - fr - 19, 46, 9, 3); ctx.fill(); var gb = ctx.createLinearGradient(0, H - fr - 30, 0, H - fr - 19); gb.addColorStop(0, "#c49a6c"); gb.addColorStop(1, "#8a6038"); ctx.fillStyle = gb; rr(ctx, bx, H - fr - 30, 46, 12, 4); ctx.fill();
}
function chalkText(ctx, s, x, y, o){
  o = o || {}; ctx.save(); ctx.font = (o.weight || 700) + " " + (o.size || 14) + "px " + FONT; ctx.textAlign = o.align || "left"; ctx.textBaseline = "middle";
  if (o.maxW){ var sz = o.size || 14; while (sz > 9 && ctx.measureText(s).width > o.maxW){ sz -= 0.5; ctx.font = (o.weight || 700) + " " + sz + "px " + FONT; } }
  ctx.globalAlpha = o.alpha == null ? 0.95 : o.alpha; ctx.fillStyle = o.col || "#f4f1e6"; ctx.shadowColor = "rgba(255,255,255,.35)"; ctx.shadowBlur = 3; ctx.fillText(s, x, y); ctx.restore();
}
SFA.sim({
  id:"org-fleches-courbes", ch:"c07", tag:"Mécanismes",
  titre:"Une flèche courbe, c'est un doublet qui voyage",
  resume:"Six étapes types de mécanisme (protonation, départ du nucléofuge, capture d'un carbocation, SN2, addition sur C=O, alcène + HBr) : la flèche se trace, les deux électrons glissent le long d'elle, la liaison se forme ou se rompt et les charges apparaissent.",
  but:"Choisis une étape. La flèche se dessine à la craie, puis les deux électrons (points jaunes) voyagent le long d'elle : une liaison se forme là où la flèche arrive entre deux atomes, une liaison se rompt quand la flèche part de son milieu. Regarde les charges formelles changer d'atome. Avance pas à pas avec le curseur, et glisse sur la scène pour tourner les molécules.",
  aRetenir:"Une flèche courbe déplace toujours deux électrons : elle part d'un doublet (doublet non liant ou liaison) et arrive là où ce doublet va (entre deux atomes pour former une liaison, sur un atome pour devenir un doublet non liant). Elle part toujours d'un site riche en électrons (doublet non liant ou liaison). Quand elle forme une liaison entre deux espèces, elle va du nucléophile vers l'électrophile, jamais l'inverse. Charge formelle : FC = électrons de valence − électrons non liants − ½ électrons de liaison. La charge totale est conservée à chaque étape.",
  piege:"La flèche ne part jamais d'un atome chargé « + » ni d'un H⁺ : elle part des électrons. Pour une protonation, la flèche va du doublet de la base vers le H, pas du H vers la base. Une flèche qui part d'une liaison et arrive sur un atome rompt cette liaison ; pour former une liaison, sa pointe doit s'arrêter entre les deux atomes. Et une demi-flèche (un seul crochet) déplace un seul électron : c'est la notation des radicaux.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.86}); phoneRatio(c, 0.86, 1.18);
    var st = {a:0.25, b:0.18, spin:true, xi:0, play:true, hold:0.6, t:0, ts:0};
    viewCtl(c, st); st.onview = function(){ st.spin = false; spinT.set(false); };
    var sS = k.select("Étape de mécanisme", STEPS.map(function(s2, i){ return [String(i), (i + 1) + ". " + s2.n]; }), "3", function(v){ st.xi = 0; xS.set(0); st.play = true; st.hold = 0.6; st.key = null; var S0 = STEPS[+v] || STEPS[3]; st.a = S0.va == null ? 0.25 : S0.va; st.b = S0.vb == null ? 0.18 : S0.vb; st.ts = 0; });
    var xS = k.slider("Avancement", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) st.xi = 0; st.play = !st.play; st.hold = 0; }, true);
    var lpT = k.toggle("Montrer tous les doublets non liants", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Flèches · électrons déplacés", "Liaison formée", "Liaison rompue", "Charges formelles (avant → après)", "Charge totale"]);
    var nt = k.note("", "ok");
    var smudge = []; (function(){ var sd = 5; function r(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; } for (var i = 0; i < 9; i++) smudge.push({x:r(), y:r(), r:r()}); })();
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.xi >= 1){ st.xi = 0; st.hold = 0.8; }
        else { var nx = st.xi + dt * 0.11; if (nx >= 1){ nx = 1; st.hold = 2.6; } st.xi = nx; }
        xS.set(st.xi);
      }
      if (st.spin && !st.drag){ var S0 = STEPS[+sS.value] || STEPS[3]; st.ts += dt; st.a = (S0.va == null ? 0.25 : S0.va) + 0.38 * Math.sin(st.ts * 0.4); st.b = (S0.vb == null ? 0.18 : S0.vb) + 0.12 * Math.sin(st.ts * 0.27); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ST = STEPS[+sS.value] || STEPS[3], ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, xi = st.xi, t = st.t;
      c.clear(); chalkboard(ctx, W, H, t, smudge);
      /* phases : tracé des flèches, voyage des électrons, apparition des charges */
      var nA = 0, G0 = ST.geo(0), G1 = ST.geo(1);
      nA = G0.arrows.length;
      var drawF = [], k2;
      for (k2 = 0; k2 < nA; k2++) drawF.push(ease((xi - 0.06 - k2 * 0.10) / 0.14));
      var tr = ease((xi - 0.32) / 0.40), chg = ease((xi - 0.72) / 0.10), done = xi > 0.86;
      var G = ST.geo(tr);
      /* cadrage stable : rayon englobant des deux états */
      var pts = G0.A.map(function(a){ return a.p; }).concat(G1.A.map(function(a){ return a.p; }));
      if (st.key !== ST.k){ st.R = radius(pts); }
      var top = ph ? 68 : 62, bot = H - (ph ? 70 : 64), fb = fitBox(pts.map(function(p){ return sub(p, st.R.c); }), st, {w:W - 40, h:bot - top}, 1.6);
      if (st.key !== ST.k){ st.key = ST.k; st.sc = fb.sc; st.mx = fb.mx; st.my = fb.my; }
      st.sc += (fb.sc - st.sc) * 0.05; st.mx += (fb.mx - st.mx) * 0.05; st.my += (fb.my - st.my) * 0.05;
      var sc = Math.min(st.sc, 82), V = {st:st, sc:sc, cx:W / 2 - st.mx * sc, cy:(top + bot) / 2 + st.my * sc};
      st.esz = clamp(sc / 48, 0.9, 1.6);
      var fc0 = formalCharges(G0, 0), fc1 = formalCharges(G0, 1);
      var atoms = G.A.map(function(a, i){
        var o = {lab:a.el === "C" || a.el === "H" ? "" : a.el};
        if (a.el === "C") o.col = "#8794a5";
        var q0 = fc0[i], q1 = fc1[i], q = tr < 0.5 ? q0 : q1, show = tr < 0.5 ? 1 : (q1 !== q0 ? chg : 1);
        if (q){ o.badge = q > 0 ? "+" : "−"; o.badgeCol = q > 0 ? "#e8892c" : "#4aa3ff"; o.badgeA = show; }
        if (q1 !== q0 && chg > 0 && q1) o.glow = q1 > 0 ? "rgba(255,170,60," + (0.55 * chg * (done ? 0.6 + 0.4 * Math.sin(t * 4) : 1)).toFixed(3) + ")" : "rgba(80,170,255," + (0.55 * chg).toFixed(3) + ")";
        return At(a.el, mul(sub(a.p, st.R.c), 1), o);
      });
      var bonds = [];
      G.B.forEach(function(b){
        if (b.o0 === b.o1){ bonds.push({a:b.a, b:b.b, o:b.o0, col:"#c3ccd6"}); return; }
        if (b.o0 && b.o1){ bonds.push({a:b.a, b:b.b, o:tr < 0.55 ? b.o0 : b.o1, col:"#c3ccd6"}); return; }
        if (b.o1){ if (tr > 0.02) bonds.push({a:b.a, b:b.b, o:1, alpha:clamp(tr * 1.3, 0, 1), dash:tr < 0.9, col:"#ffe58a"}); return; }
        if (tr < 0.98) bonds.push({a:b.a, b:b.b, o:1, alpha:clamp(1 - tr * 1.2, 0, 1), dash:tr > 0.1, col:tr > 0.1 ? "#ffb59a" : "#c3ccd6"});
      });
      var extra = [];
      /* orbitale p vide du carbocation */
      if (G.pOrb && G.pOrb.amp > 0.05){
        var po = G.pOrb, A0 = sub(G.A[po.a].p, st.R.c);
        [1, -1].forEach(function(sg){
          var tip = proj3(add(A0, mul(po.axis, sg * 1.05)), st, sc, V.cx, V.cy), base = proj3(A0, st, sc, V.cx, V.cy);
          extra.push({z:tip.z - 0.02, f:function(){
            ctx.save(); ctx.globalAlpha = 0.85 * po.amp; ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.fillStyle = "rgba(255,255,255,.06)";
            var dx = tip.x - base.x, dy = tip.y - base.y, Lr = Math.hypot(dx, dy) || 1, ang = Math.atan2(dy, dx);
            ctx.translate(base.x + dx * 0.55, base.y + dy * 0.55); ctx.rotate(ang); ctx.beginPath(); ctx.ellipse(0, 0, Math.max(6, Lr * 0.55), 0.42 * sc, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
          }});
        });
      }
      /* doublets non liants */
      var LP = [];
      G.L.forEach(function(l){
        var on = l.src != null ? (tr < 0.02 ? 1 : 0) : l.dst != null ? (tr > 0.98 ? 1 : 0) : 1;
        if (!on) return;
        if (!lpT.value && l.src == null && l.dst == null) return;
        var Ap = sub(G.A[l.a].p, st.R.c), P = proj3(add(Ap, mul(nrm(l.d), 0.66)), st, sc, V.cx, V.cy), Pa = proj3(Ap, st, sc, V.cx, V.cy);
        var hot = l.src != null && xi > 0.04;
        LP.push({z:P.z + 0.01, f:function(){ lpDraw(ctx, P, Pa, hot, t, st.esz); }});
      });
      var pr = drawScene(c, V, atoms, bonds, extra.concat(LP));
      /* flèches courbes et électrons en voyage */
      G.arrows.forEach(function(ar, q){
        var a0 = proj3(sub(ar.from(), st.R.c), st, sc, V.cx, V.cy), a1 = proj3(sub(ar.to(), st.R.c), st, sc, V.cx, V.cy);
        var mid = mul(add(sub(ar.from(), st.R.c), sub(ar.to(), st.R.c)), 0.5), cp = proj3(add(mid, ar.off), st, sc, V.cx, V.cy);
        var mx = (a0.x + a1.x) / 2, my = (a0.y + a1.y) / 2, dx = a1.x - a0.x, dy = a1.y - a0.y, Ld = Math.hypot(dx, dy) || 1;
        var bend = ((cp.x - mx) * (-dy / Ld) + (cp.y - my) * (dx / Ld));
        bend = clamp(bend, -Ld * 0.7, Ld * 0.7); if (Math.abs(bend) < Ld * 0.22) bend = (bend < 0 ? -1 : 1) * Ld * 0.22;
        var alpha = done ? 0.45 : 1, fr = drawF[q] || 0;
        curly(ctx, a0.x, a0.y, a1.x, a1.y, bend, ar.col, alpha, fr, ph ? 2.4 : 2.8);
        /* bâton de craie au bout de la flèche pendant qu'elle se trace */
        if (fr > 0.02 && fr < 0.98){
          var cc = qctrl(a0.x, a0.y, a1.x, a1.y, bend), tp = qpt(a0.x, a0.y, cc[0], cc[1], a1.x, a1.y, fr);
          ctx.save(); ctx.translate(tp[0], tp[1]); ctx.rotate(-0.9); ctx.fillStyle = ar.col; rr(ctx, -2, -3, 26, 6, 3); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(3, -2, 18, 1.5); ctx.restore();
        }
        /* les deux électrons */
        var ue = ease((xi - 0.32 - q * 0.03) / 0.38);
        if (xi > 0.04 && ue < 1){
          var cc2 = qctrl(a0.x, a0.y, a1.x, a1.y, bend), pe = qpt(a0.x, a0.y, cc2[0], cc2[1], a1.x, a1.y, ue), pn = qpt(a0.x, a0.y, cc2[0], cc2[1], a1.x, a1.y, Math.min(1, ue + 0.02));
          var ang = Math.atan2(pn[1] - pe[1], pn[0] - pe[0]), ox = -Math.sin(ang) * 4, oy = Math.cos(ang) * 4, pul = ue > 0 ? 1 : 0.7 + 0.3 * Math.sin(t * 7);
          [1, -1].forEach(function(sg){ electron(ctx, pe[0] + ox * sg * st.esz, pe[1] + oy * sg * st.esz, pul, 1.15 * st.esz); });
        }
      });
      /* textes à la craie */
      chalkText(ctx, ST.ln || ST.n, 22, 30, {size:ph ? 14 : 17, weight:800, maxW:W - 44});
      var phase = xi < 0.06 ? "réactifs" : xi < 0.32 ? "on trace " + (nA > 1 ? "les flèches" : "la flèche") : xi < 0.72 ? "les électrons voyagent" : xi < 0.86 ? "les charges apparaissent" : "produits";
      chalkText(ctx, phase, 22, 52, {size:ph ? 11.5 : 13, weight:600, col:"#ffe58a", alpha:0.9});
      chalkText(ctx, ST.eq, W / 2, H - (ph ? 50 : 44), {size:ph ? 13 : 16, weight:800, align:"center", maxW:W - 40});
      if (!ph) chalkText(ctx, "glisse pour tourner", W - 22, 30, {size:11, weight:600, align:"right", alpha:0.55});
      /* valeurs */
      var ch = [], tot0 = 0, tot1 = 0;
      G0.A.forEach(function(a, i){ tot0 += fc0[i]; tot1 += fc1[i]; if (fc0[i] !== fc1[i]) ch.push((a.nm || a.el) + " : " + sgn(fc0[i]) + " → " + sgn(fc1[i])); });
      ro.set(0, nA + " flèche" + (nA > 1 ? "s" : "") + " · " + 2 * nA + " électrons");
      ro.set(1, ST.form);
      ro.set(2, ST.brk);
      ro.set(3, ch.join("<br>"));
      ro.set(4, sgn(tot0) + " → " + sgn(tot1) + " (conservée)");
      nt.set("<b>" + ST.type.charAt(0).toUpperCase() + ST.type.slice(1) + ".</b> " + ST.txt + " <i>Géométries idéalisées.</i>", "ok");
    });
  }
});
function sgn(q){ return q > 0 ? "+" + q : q < 0 ? "−" + (-q) : "0"; }
function lpDraw(ctx, P, Pa, hot, t, z){
  z = z || 1;
  var dx = P.x - Pa.x, dy = P.y - Pa.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, ox = -uy * 3.4 * z, oy = ux * 3.4 * z;
  ctx.save();
  var g = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, 11 * z); g.addColorStop(0, hot ? "rgba(255,216,77,.55)" : "rgba(255,255,255,.22)"); g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, 11 * z, 0, 7); ctx.fill();
  ctx.restore();
  var pul = hot ? 0.75 + 0.25 * Math.sin(t * 7) : 0.85;
  electron(ctx, P.x + ox, P.y + oy, pul, (hot ? 1 : 0.8) * z); electron(ctx, P.x - ox, P.y - oy, pul, (hot ? 1 : 0.8) * z);
}
function electron(ctx, x, y, a, sz){
  sz = sz || 1;
  ctx.save(); ctx.globalAlpha = clamp(a, 0, 1);
  var g = ctx.createRadialGradient(x, y, 0, x, y, 6 * sz); g.addColorStop(0, "rgba(255,240,150,.9)"); g.addColorStop(1, "rgba(255,216,77,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 6 * sz, 0, 7); ctx.fill();
  ctx.fillStyle = "#fff6c8"; ctx.beginPath(); ctx.arc(x, y, 2.3 * sz, 0, 7); ctx.fill();
  ctx.restore();
}

/* ====================================================================== */
/* 3. Préparer un magnésien : la polarité s'inverse                        */
/* ====================================================================== */
function sp3pair(u1, u2){
  var d = nrm(mul(add(nrm(u1), nrm(u2)), -1)), n = nrm(cross(u1, u2)), h = 54.75 * DEG;
  if (len(cross(u1, u2)) < 1e-3) n = perpTo(u1);
  return [add(mul(d, Math.cos(h)), mul(n, Math.sin(h))), add(mul(d, Math.cos(h)), mul(n, -Math.sin(h)))];
}
var GR = {rhoEtBr:1.46, M_EtBr:2 * 12.011 + 5 * 1.008 + 79.904, M_Mg:24.305, M_EtMgBr:2 * 12.011 + 5 * 1.008 + 24.305 + 79.904, M_H2O:2 * 1.008 + 15.999,
  Vdrop:0.05, R:8.314, T:298.15, P:1e5, chi:{Mg:1.31, C:2.55, Br:2.96, H:2.20}};
/* éthyle : C1 (lié à X) et C2 ; renvoie atomes et liaisons ; dX = direction C1 → X */
function ethyl(C1, dX, up, A, B, o){
  o = o || {};
  var dC2 = nrm(sub(up, mul(dX, dot(up, dX)))); dC2 = nrm(add(mul(dX, -0.334), mul(dC2, 0.943)));
  var i1 = A.length; A.push(At("C", C1, o.c1 || {}));
  var C2 = add(C1, mul(dC2, 1.53)); A.push(At("C", C2)); B.push({a:i1, b:i1 + 1, o:1});
  sp3pair(dX, dC2).forEach(function(d){ A.push(At("H", add(C1, mul(d, 1.09)))); B.push({a:i1, b:A.length - 1, o:1}); });
  tetra3(mul(dC2, -1), dX, 0.3).forEach(function(d){ A.push(At("H", add(C2, mul(d, 1.09)))); B.push({a:i1 + 1, b:A.length - 1, o:1}); });
  return i1;
}
function labBench(ctx, W, H){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#eef2f6"); g.addColorStop(1, "#d6dde6"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  /* carrelage du mur */
  ctx.save(); ctx.strokeStyle = "rgba(120,140,165,.13)"; ctx.lineWidth = 1;
  for (var y = 22; y < H * 0.9; y += 26){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (var x = 0; x < W; x += 40){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H * 0.9); ctx.stroke(); }
  ctx.restore();
  var by = H * 0.9, gb = ctx.createLinearGradient(0, by, 0, H); gb.addColorStop(0, "#4b5563"); gb.addColorStop(0.12, "#374151"); gb.addColorStop(1, "#1f2937");
  ctx.fillStyle = gb; ctx.fillRect(0, by, W, H - by); ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(0, by, W, 2);
}
function glass(ctx, path, tint){
  ctx.save(); path(); ctx.fillStyle = tint || "rgba(220,235,250,.28)"; ctx.fill(); ctx.strokeStyle = "rgba(90,115,140,.75)"; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
}
/* le montage : ballon bicol, réfrigérant à reflux, ballon de gaz sec, ampoule de coulée, agitateur chauffant */
function montage(ctx, M, s){
  var x0 = M.x, y0 = M.y, w = M.w, h = M.h, t = s.t;
  var benchY = y0 + h, plateH = h * 0.075, plateW = Math.min(w * 0.78, h * 0.42), fx = x0 + w * 0.56;
  var R = Math.min(w * 0.3, h * 0.15), fy = benchY - plateH - R * 0.92;
  /* potence */
  var sx = x0 + w * 0.08;
  ctx.fillStyle = "#59636f"; ctx.fillRect(sx - 3, y0 + h * 0.04, 6, benchY - y0 - h * 0.04);
  ctx.fillStyle = "#3d4550"; rr(ctx, sx - 16, benchY - 6, 60, 6, 2); ctx.fill();
  [fy - R * 1.6, y0 + h * 0.36].forEach(function(cy){ ctx.fillStyle = "#7b8591"; ctx.fillRect(sx, cy - 3, fx - sx - R * 0.25, 6); ctx.fillStyle = "#c98a3a"; rr(ctx, fx - R * 0.42, cy - 6, R * 0.84, 12, 4); ctx.fill(); });
  /* agitateur chauffant */
  var px = fx - plateW / 2, py = benchY - plateH;
  var gp = ctx.createLinearGradient(0, py, 0, benchY); gp.addColorStop(0, "#e9edf1"); gp.addColorStop(1, "#aeb7c2"); ctx.fillStyle = gp; rr(ctx, px, py, plateW, plateH, 5); ctx.fill();
  ctx.fillStyle = "rgba(220,70,40," + (0.35 + 0.25 * Math.sin(t * 2)).toFixed(2) + ")"; ctx.fillRect(px + 6, py + 2, plateW - 12, 3);
  ctx.fillStyle = "#1f2937"; ctx.beginPath(); ctx.arc(px + plateW * 0.2, py + plateH * 0.62, plateH * 0.22, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(px + plateW * 0.8, py + plateH * 0.62, plateH * 0.22, 0, 7); ctx.fill();
  /* col principal et réfrigérant */
  var nw = R * 0.3, topC = y0 + h * 0.17, neckTop = fy - R * 1.22;
  var cw = R * 0.55;
  ctx.save();
  var gj = ctx.createLinearGradient(fx - cw / 2, 0, fx + cw / 2, 0); gj.addColorStop(0, "rgba(160,200,235,.55)"); gj.addColorStop(0.5, "rgba(215,235,250,.35)"); gj.addColorStop(1, "rgba(140,185,225,.6)");
  ctx.fillStyle = gj; rr(ctx, fx - cw / 2, topC + 16, cw, neckTop - topC - 26, cw * 0.3); ctx.fill(); ctx.strokeStyle = "rgba(90,115,140,.75)"; ctx.lineWidth = 1.5; ctx.stroke();
  /* eau de refroidissement qui circule (tirets mobiles) */
  ctx.strokeStyle = "rgba(40,120,220,.45)"; ctx.lineWidth = 2; ctx.setLineDash([5, 7]); ctx.lineDashOffset = -t * 22;
  ctx.beginPath(); ctx.moveTo(fx + cw * 0.34, neckTop - 14); ctx.lineTo(fx + cw * 0.34, topC + 22); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  glass(ctx, function(){ rr(ctx, fx - nw / 2, topC, nw, neckTop - topC + 6, 3); }, "rgba(235,245,255,.35)");
  /* tuyaux d'eau */
  ctx.save(); ctx.strokeStyle = "#5f7d95"; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(fx + cw / 2, neckTop - 22); ctx.quadraticCurveTo(fx + cw * 1.6, neckTop - 10, x0 + w - 2, neckTop + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx + cw / 2, topC + 26); ctx.quadraticCurveTo(fx + cw * 1.5, topC + 18, x0 + w - 2, topC + 34); ctx.stroke(); ctx.restore();
  /* reflux : anneau de condensation et gouttes qui retombent */
  var refl = s.reflux;
  if (refl > 0.02){
    var ry = lerp(neckTop - 10, topC + 40, 0.35 + 0.08 * Math.sin(t * 1.3));
    ctx.save(); ctx.globalAlpha = refl; ctx.fillStyle = "rgba(150,190,230,.55)"; ctx.fillRect(fx - nw / 2 + 2, ry, nw - 4, 5);
    for (var q = 0; q < 3; q++){ var dy = ((t * 55 + q * 37) % Math.max(10, neckTop - ry + 30)); ctx.fillStyle = "rgba(120,170,225,.85)"; ctx.beginPath(); ctx.arc(fx + (q - 1) * nw * 0.18, ry + dy, 2, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  /* ballon de gaz sec (argon) en haut, qui gonfle avec l'éthane */
  var bR = R * (0.42 + 0.35 * clamp(s.gas, 0, 1)), bY = topC - bR * 0.95;
  ctx.fillStyle = "#c06b2c"; ctx.fillRect(fx - nw * 0.45, topC - 6, nw * 0.9, 8);
  var gbl = ctx.createRadialGradient(fx - bR * 0.35, bY - bR * 0.35, 2, fx, bY, bR); gbl.addColorStop(0, "#9ad0ff"); gbl.addColorStop(1, "#2f7fd0");
  ctx.fillStyle = gbl; ctx.beginPath(); ctx.ellipse(fx, bY, bR * 0.9, bR, 0, 0, 7); ctx.fill();
  label(ctx, s.gas > 0.05 ? "Ar + éthane" : "Ar (gaz sec)", fx - bR - 8, bY, {size:M.fs, align:"right", col:"#1d4fae", weight:800, bg:"rgba(255,255,255,.85)", maxW:Math.max(30, fx - bR - 20 - x0)});
  /* col latéral + ampoule de coulée */
  var sa = -38 * DEG, snx = fx - R * 0.62, sny = fy - R * 0.72, sL = R * 0.75, stx = snx + Math.sin(sa) * sL, sty = sny - Math.cos(sa) * sL;
  ctx.save(); ctx.translate(snx, sny); ctx.rotate(sa); glass(ctx, function(){ rr(ctx, -nw * 0.4, -sL, nw * 0.8, sL + 4, 3); }, "rgba(235,245,255,.35)"); ctx.restore();
  var fX = stx, fY = sty - R * 0.25, fW = R * 0.95, fH = R * 1.3, fTop = fY - fH - R * 0.35;
  ctx.save(); ctx.strokeStyle = "rgba(90,115,140,.75)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fX, sty + 4); ctx.lineTo(fX, fY); ctx.stroke(); ctx.restore();
  var pear = function(){ ctx.beginPath(); ctx.moveTo(fX - 3, fY - 6); ctx.bezierCurveTo(fX - fW * 0.7, fY - fH * 0.35, fX - fW * 0.55, fY - fH, fX, fY - fH); ctx.bezierCurveTo(fX + fW * 0.55, fY - fH, fX + fW * 0.7, fY - fH * 0.35, fX + 3, fY - 6); ctx.closePath(); };
  /* liquide de l'ampoule (bromoéthane dans l'éther) : son niveau baisse pendant l'ajout */
  var lvl = 1 - clamp(s.add, 0, 1);
  if (lvl > 0.01){ ctx.save(); pear(); ctx.clip(); var ly = lerp(fY - 6, fY - fH * 0.88, lvl); var gl = ctx.createLinearGradient(0, ly, 0, fY); gl.addColorStop(0, "rgba(240,200,120,.75)"); gl.addColorStop(1, "rgba(215,160,70,.85)"); ctx.fillStyle = gl; ctx.fillRect(fX - fW, ly, fW * 2, fY - ly + 2); ctx.restore(); }
  glass(ctx, pear, "rgba(235,245,255,.25)");
  ctx.fillStyle = "#2d6a4f"; ctx.fillRect(fX - 7, fY - 2, 14, 5);
  ctx.fillStyle = "#e7ecf1"; rr(ctx, fX - 5, fTop, 10, R * 0.4, 2); ctx.fill();
  label(ctx, "CH₃CH₂Br", fX, fY - fH - R * 0.62, {size:M.fs, col:"#8a5a12", weight:800});
  /* gouttes qui tombent de l'ampoule vers le ballon */
  if (s.dripping){
    var dl = sny - fY + R * 0.5, dp = (t * 1.3) % 1;
    ctx.fillStyle = "rgba(215,160,70,.95)"; ctx.beginPath(); ctx.arc(lerp(fX, snx + R * 0.25, dp), fY + 6 + dp * dl, 2.6, 0, 7); ctx.fill();
  }
  /* ballon (bicol) */
  var flaskPath = function(){ ctx.beginPath(); ctx.arc(fx, fy, R, -PI / 2 + 0.2, -PI / 2 - 0.2 + 2 * PI); ctx.lineTo(fx - nw / 2, neckTop); ctx.lineTo(fx + nw / 2, neckTop); ctx.closePath(); };
  ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, R - 1, 0, 2 * PI); ctx.clip();
  var liqY = fy - R * 0.15;
  var gli = ctx.createLinearGradient(0, liqY, 0, fy + R); gli.addColorStop(0, "rgba(205,225,245,.85)"); gli.addColorStop(1, "rgba(160,190,225,.95)");
  if (s.cloudy > 0){ gli = ctx.createLinearGradient(0, liqY, 0, fy + R); gli.addColorStop(0, "rgba(" + Math.round(lerp(205, 200, s.cloudy)) + "," + Math.round(lerp(225, 196, s.cloudy)) + "," + Math.round(lerp(245, 180, s.cloudy)) + ",.9)"); gli.addColorStop(1, "rgba(150,150,140,.95)"); }
  ctx.fillStyle = gli; ctx.fillRect(fx - R, liqY, 2 * R, R * 1.2);
  /* copeaux de magnésium (leur nombre suit la masse restante) */
  var nCh = Math.round(14 * clamp(s.mgFrac, 0, 1.3));
  for (var i = 0; i < nCh; i++){
    var a = (i * 2.399) % (2 * PI), rr0 = R * (0.15 + 0.55 * ((i * 0.37) % 1)), cx2 = fx + Math.cos(a) * rr0 * 0.9, cy2 = fy + R * 0.62 - ((i * 0.53) % 1) * R * 0.22;
    ctx.save(); ctx.translate(cx2, cy2); ctx.rotate(a + t * 0.2 * ((i % 2) ? 1 : -1));
    var gm = ctx.createLinearGradient(-6, -2, 6, 2); gm.addColorStop(0, "#e9edf2"); gm.addColorStop(0.5, "#9aa4b1"); gm.addColorStop(1, "#d5dbe2");
    ctx.fillStyle = gm; ctx.beginPath(); ctx.moveTo(-R * 0.13, 0); ctx.quadraticCurveTo(0, -R * 0.09, R * 0.13, 0); ctx.quadraticCurveTo(0, -R * 0.03, -R * 0.13, 0); ctx.fill(); ctx.restore();
  }
  /* bulles : ébullition douce (reflux) et éthane après l'eau */
  var nb = Math.round(6 * refl + 14 * s.fizz);
  for (i = 0; i < nb; i++){
    var bx = fx + Math.sin(i * 12.9) * R * 0.6, ph = (t * (0.6 + (i % 3) * 0.25) + i * 0.137) % 1, byy = lerp(fy + R * 0.7, liqY + 3, ph);
    ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(bx, byy, 1.5 + ph * 2.5, 0, 7); ctx.stroke();
  }
  /* barreau aimanté */
  ctx.save(); ctx.translate(fx, fy + R * 0.86); ctx.scale(Math.cos(t * 6), 1); ctx.fillStyle = "#f3f4f6"; rr(ctx, -R * 0.22, -3, R * 0.44, 6, 3); ctx.fill(); ctx.restore();
  ctx.restore();
  glass(ctx, flaskPath, "rgba(235,245,255,.12)");
  ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, R * 0.78, -2.6, -1.9); ctx.stroke(); ctx.restore();
  /* pipette d'eau */
  if (s.water > 0){
    var wp = s.water, pxw = fx + R * 0.95, pyw = fy - R * 1.6;
    ctx.save(); ctx.globalAlpha = clamp(wp * 3, 0, 1) * clamp((1 - wp) * 4, 0, 1);
    ctx.fillStyle = "#c0392b"; rr(ctx, pxw - 5, pyw - 34, 10, 14, 4); ctx.fill();
    glass(ctx, function(){ ctx.beginPath(); ctx.moveTo(pxw - 4, pyw - 20); ctx.lineTo(pxw + 4, pyw - 20); ctx.lineTo(pxw + 1, pyw + 14); ctx.lineTo(pxw - 1, pyw + 14); ctx.closePath(); }, "rgba(200,230,255,.6)");
    var dp2 = clamp((wp - 0.15) / 0.4, 0, 1);
    if (dp2 > 0 && dp2 < 1){ ctx.fillStyle = "#3b8be0"; ctx.beginPath(); ctx.arc(lerp(pxw, fx + R * 0.3, dp2), lerp(pyw + 18, liqY, dp2), 3.4, 0, 7); ctx.fill(); }
    ctx.restore();
    label(ctx, "H₂O", pxw - 9, pyw - 26, {size:M.fs, col:"#1d4fae", align:"right", weight:800, alpha:clamp((1 - wp) * 4, 0, 1)});
  }
  return {fx:fx, fy:fy, R:R};
}
SFA.sim({
  id:"org-grignard-preparation", ch:"L18", tag:"Organomagnésiens",
  titre:"Préparer un magnésien : la polarité s'inverse",
  resume:"Un ballon à reflux sous gaz sec, des copeaux de magnésium dans l'éther : le bromoéthane coule goutte à goutte, Mg s'insère dans C–Br et le carbone passe de δ+ à δ−. Une goutte d'eau détruit le réactif et dégage de l'éthane.",
  but:"Regarde le montage : le bromoéthane coule goutte à goutte sur le magnésium, l'éther bout doucement (la réaction dégage de la chaleur) et les copeaux disparaissent. Dans la loupe, en 3D, un atome de Mg sort de la surface et s'insère dans la liaison C–Br : le halo du carbone passe du bleu (δ+) au rouge (δ−). Règle les quantités, puis ajoute une goutte d'eau : le magnésien est détruit et de l'éthane se dégage (le ballon de gaz gonfle). Glisse dans la loupe pour tourner les molécules.",
  aRetenir:"Préparation : R–X + Mg → R–Mg–X, dans un éther anhydre (éthoxyéthane ou THF), sous gaz sec. Le magnésium (χ = 1,31) est bien moins électronégatif que le carbone (χ = 2,55) : dans C–Br, C est δ+ (électrophile) ; dans C–Mg, C est δ− (nucléophile et base très forte). C'est l'inversion de polarité (umpolung). Le carbone est réduit (n.o. −1 → −3) et Mg oxydé (0 → +II). L'eau détruit le magnésien : R–MgX + H₂O → R–H + Mg(OH)X, d'où l'éther anhydre et le gaz sec.",
  piege:"Le magnésien n'est pas un « R⁻ libre » : la liaison C–Mg reste en partie covalente, mais très polarisée vers le carbone. Toute trace d'eau, d'alcool ou d'acide (même faible, comme un –OH ou un –NH) le détruit avant qu'il ne réagisse avec le carbonyle visé. Et la destruction par l'eau n'est pas une oxydoréduction : c'est une réaction acide-base, le n.o. du carbone reste −3.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.9}); phoneRatio(c, 0.9, 1.32);
    var st = {a:0, b:0.38, spin:true, t:0, ts:0, add:0, u:0, water:0, wq:0, drops:0, destroyed:0, ethane:0, lastKill:0, fizzT:0, play:true};
    viewCtl(c, st); st.onview = function(){ st.spin = false; };
    var mS = k.slider("Masse de magnésium", 0.5, 3, 0.05, 1.2, "g", function(){ restart(); });
    var vS = k.slider("Volume de bromoéthane (ρ = 1,46 g/mL)", 1, 8, 0.1, 3.7, "mL", function(){ restart(); });
    k.button("Recommencer", function(){ restart(); }, true);
    k.button("Ajouter une goutte d'eau (0,05 mL)", function(){ if (st.wq <= 0){ st.wq = 1; st.water = 0; } });
    var ro = k.readouts(["n(Mg) · n(CH₃CH₂Br)", "Réactif limitant", "Magnésien formé", "Éthane dégagé (25 °C, 1 bar)", "n.o. du carbone lié à X", "Polarité de la liaison du C"]);
    var nt = k.note("", "ok");
    function restart(){ st.add = 0; st.drops = 0; st.destroyed = 0; st.wq = 0; st.water = 0; st.u = 0; st.ethane = 0; st.lastKill = 0; st.fizzT = 0; st.wDone = false; }
    function amounts(){
      var nMg = mS.value / GR.M_Mg, nX = vS.value * GR.rhoEtBr / GR.M_EtBr, formed = Math.min(st.add * nX, nMg);
      var nDrop = GR.Vdrop * 1.0 / GR.M_H2O, alive = Math.max(0, formed - st.destroyed);
      return {nMg:nMg, nX:nX, formed:formed, alive:alive, nDrop:nDrop, mgLeft:nMg - formed};
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.add < 1) st.add = Math.min(1, st.add + dt / 18);
      st.u = (st.u + dt / 6.5) % 1;
      if (st.wq > 0){
        st.water = Math.min(1, st.water + dt / 4.5);
        if (st.water >= 0.45 && !st.wDone){ var A0 = amounts(); var kill = Math.min(A0.alive, A0.nDrop); st.destroyed += kill; st.lastKill = kill; st.ethane = (st.ethane || 0) + kill; st.wDone = true; st.fizzT = 2.8; }
        if (st.water >= 1){ st.wq = 0; st.wDone = false; }
      }
      if (st.fizzT > 0) st.fizzT -= dt;
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.25 * Math.sin(st.ts * 0.35); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, Q = amounts();
      c.clear(); labBench(ctx, W, H);
      var mw = ph ? W * 0.41 : W * 0.39, Mbox = {x:4, y:30, w:mw, h:H * 0.9 - 34, fs:ph ? 9.5 : 11};
      var gasF = (st.ethane || 0) / 0.015;
      var F = montage(ctx, Mbox, {t:t, add:st.add, reflux:st.add < 1 ? 0.9 : 0.35, dripping:st.add < 1, gas:clamp(gasF, 0, 1), mgFrac:Q.nMg > 0 ? Q.mgLeft / (mS.value / GR.M_Mg) * mS.value / 1.2 : 0,
        fizz:st.fizzT > 0 ? clamp(st.fizzT / 2.8, 0, 1) : 0, water:st.wq > 0 ? st.water : 0, cloudy:clamp(st.destroyed / 0.01, 0, 1)});
      /* loupe 3D */
      var zx = mw + (ph ? 4 : 10), zy = 30, zw = W - zx - 8, zh = H * (ph ? 0.6 : 0.64);
      ctx.save(); ctx.strokeStyle = "rgba(90,110,140,.45)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(F.fx + F.R * 0.3, F.fy + F.R * 0.4); ctx.lineTo(zx, zy + zh * 0.2); ctx.moveTo(F.fx + F.R * 0.3, F.fy + F.R * 0.4); ctx.lineTo(zx, zy + zh); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(F.fx + F.R * 0.3, F.fy + F.R * 0.4, 6, 0, 7); ctx.strokeStyle = "#2a6fdb"; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 12; ctx.fillStyle = "#f7fafd"; rr(ctx, zx, zy, zw, zh, 14); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, zx, zy, zw, zh, 14); ctx.clip();
      var gz = ctx.createLinearGradient(0, zy, 0, zy + zh); gz.addColorStop(0, "#f4f8fc"); gz.addColorStop(1, "#dfe8f2"); ctx.fillStyle = gz; ctx.fillRect(zx, zy, zw, zh);
      var sc = Math.min(zw / 8.4, zh / 7.6), V = {st:st, sc:sc, cx:zx + zw * 0.5, cy:zy + zh * 0.84};
      var atoms = [], bonds = [], extra = [], u = st.u, wmode = st.wq > 0;
      /* surface de magnésium (une couche compacte) */
      var surf = [], i, j;
      for (j = 1; j >= 0; j--) for (i = -2; i <= 2; i++){ var px = i * 3.2 + (j % 2 ? 1.6 : 0), pz = (j - 0.5) * 2.77; if (Math.abs(px) < 6.5) surf.push([px, -1.2, pz]); }
      var mi = 0; surf.forEach(function(p, q){ if (Math.abs(p[0]) < 0.1) mi = q; });
      var pr0 = null, C1i = -1, Mgi = -1, Bri = -1, polar = 0;
      if (!wmode){
        var a1 = ease(u / 0.32), a2 = ease((u - 0.36) / 0.32), a3 = ease((u - 0.74) / 0.22);
        var Mg0 = surf[mi], MgF = [0, 1.55, 0], Mg = lerp3(Mg0, MgF, a2);
        var BrA = [0.35, lerp(4.6, 1.75, a1), 0], BrF = add(MgF, mul(nrm([1, -0.3, 0.15]), 2.45)), Br = lerp3(BrA, BrF, a2);
        var dCA = nrm([-0.45, 1, 0.2]), C1A = add(BrA, mul(dCA, 1.94)), C1F = add(MgF, mul(nrm([-1, -0.25, -0.1]), 2.17)), C1 = lerp3(C1A, C1F, a2);
        var lift = [0, 1.3 * a3, 0]; Mg = add(Mg, lift); Br = add(Br, lift); C1 = add(C1, lift);
        polar = a2;
        surf.forEach(function(p, q){ if (q !== mi) atoms.push(At("Mg", p, {big:2.1, col:"#9db58a"})); else atoms.push(At("Mg", a2 > 0.02 ? Mg : p, {lab:"Mg", big:lerp(2.1, 1.1, a2), col:mixHex("#9db58a", "#7fae4f", a2), glow:a2 > 0.02 ? "rgba(120,190,80,.45)" : null})); if (q === mi) Mgi = atoms.length - 1; });
        Bri = atoms.length; atoms.push(At("Br", Br, {lab:"Br"}));
        var dX = nrm(sub(a2 < 0.5 ? Br : Mg, C1));
        C1i = ethyl(C1, dX, [0, 1, 0.3], atoms, bonds, {});
        bonds.push({a:C1i, b:Bri, o:1, alpha:1 - a2, dash:a2 > 0.15});
        bonds.push({a:C1i, b:Mgi, o:1, alpha:a2, dash:a2 < 0.85});
        bonds.push({a:Mgi, b:Bri, o:1, alpha:a2, dash:a2 < 0.85});
        /* la couche se reforme pour le cycle suivant */
        if (a3 > 0.5){ atoms.push(At("Mg", Mg0, {alpha:(a3 - 0.5) * 2, big:2.1, col:"#9db58a"})); }
        st.zText = a2 < 0.05 ? "CH₃CH₂–Br s'approche du métal" : a2 < 0.95 ? "Mg s'insère dans la liaison C–Br" : "CH₃CH₂–MgBr (solvaté par l'éther)";
      } else {
        var w = st.water, b1 = ease((w - 0.15) / 0.3), b2 = ease((w - 0.45) / 0.25), b3 = ease((w - 0.7) / 0.28);
        var MgW = [0.3, 2.6, 0], BrW = add(MgW, mul(nrm([1, -0.3, 0.15]), 2.45)), C1W = add(MgW, mul(nrm([-1, -0.25, -0.1]), 2.17));
        surf.forEach(function(p, q){ if (q !== mi) atoms.push(At("Mg", p, {big:2.1, col:"#9db58a"})); });
        Mgi = atoms.length; atoms.push(At("Mg", MgW, {lab:"Mg"}));
        Bri = atoms.length; atoms.push(At("Br", BrW, {lab:"Br"}));
        var away = mul(nrm(sub(C1W, MgW)), 2.6 * b3), C1n = add(C1W, add(away, [0, 0.6 * b3, 0]));
        var dXw = nrm(sub(MgW, C1W));
        C1i = ethyl(C1n, dXw, [0, 1, 0.3], atoms, bonds, {});
        bonds.push({a:C1i, b:Mgi, o:1, alpha:1 - b2, dash:b2 > 0.1});
        bonds.push({a:Mgi, b:Bri, o:1});
        var mid = mul(add(C1W, MgW), 0.5), O0 = add(mid, [-0.3, 3.4, 1.2]), Oa = add(mid, [0, 2.0, 0.4]), Of = add(MgW, mul(nrm([0.2, 1, 0.35]), 1.95));
        var O = b2 > 0 ? lerp3(Oa, Of, b2) : lerp3(O0, Oa, b1);
        var Oi = atoms.length; atoms.push(At("O", O, {lab:"O"}));
        var Hk = add(O, mul(nrm([0.6, 0.8, 0.2]), 0.96)); atoms.push(At("H", Hk)); bonds.push({a:Oi, b:atoms.length - 1, o:1});
        var HtA = add(O, mul(nrm(sub(C1W, O)), 0.96)), HtF = add(C1n, mul(dXw, 1.09)), Ht = lerp3(HtA, HtF, b2);
        var Hti = atoms.length; atoms.push(At("H", Ht, {glow:b2 > 0 && b2 < 1 ? "rgba(255,200,60,.6)" : null}));
        bonds.push({a:Oi, b:Hti, o:1, alpha:1 - b2, dash:b2 > 0.1}); bonds.push({a:C1i, b:Hti, o:1, alpha:b2, dash:b2 < 0.9});
        bonds.push({a:Oi, b:Mgi, o:1, alpha:b2, dash:b2 < 0.9});
        polar = 1 - b2;
        st.zText = b2 < 0.05 ? "H₂O s'approche du magnésien" : b2 < 0.95 ? "le carbone δ− arrache un H⁺ à l'eau" : "CH₃–CH₃ (éthane) s'échappe ; reste Mg(OH)Br";
      }
      /* halo du carbone : bleu (δ+) dans C–Br, rouge (δ−) dans C–Mg */
      var hal = wmode ? mixHex("#e03a2f", "#9aa5b1", 1 - polar) : mixHex("#2a6fdb", "#e03a2f", polar);
      atoms[C1i].glow = rgba(hal, 0.55 + 0.25 * Math.sin(t * 4)); atoms[C1i].col = mixHex("#4a5568", hal, 0.45); atoms[C1i].big = 1.15;
      var dTxt = wmode ? (polar > 0.5 ? "δ−" : "") : (polar < 0.5 ? "δ+" : "δ−");
      if (dTxt){ atoms[C1i].badge = dTxt; atoms[C1i].badgeCol = dTxt === "δ+" ? "#2a6fdb" : "#e03a2f"; }
      if (!wmode && polar < 0.5){ atoms[Bri].badge = "δ−"; atoms[Bri].badgeCol = "#e03a2f"; }
      if (polar >= 0.5 && atoms[Mgi]){ atoms[Mgi].badge = "δ+"; atoms[Mgi].badgeCol = "#2a6fdb"; }
      drawScene(c, V, atoms, bonds, extra);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "rgba(90,115,140,.6)"; ctx.lineWidth = 1.5; rr(ctx, zx, zy, zw, zh, 14); ctx.stroke(); ctx.restore();
      label(ctx, st.zText, zx + zw / 2, zy + 16, {size:ph ? 10 : 12, col:"#13233a", bg:"rgba(255,255,255,.9)", maxW:zw - 22});
      label(ctx, "surface du magnésium (métal)", zx + zw / 2, zy + zh - 13, {size:ph ? 9.5 : 10.5, col:"#3e5a22", weight:800, bg:"rgba(255,255,255,.8)"});
      /* échelle d'électronégativité */
      var ey = zy + zh + 14, eh = H * 0.9 - ey - 6, ex0 = zx + 10, ex1 = zx + zw - 10;
      if (eh > 40){
        var X = function(v){ return ex0 + (v - 1.0) / (3.5 - 1.0) * (ex1 - ex0); };
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.8)"; rr(ctx, zx, ey - 8, zw, eh + 4, 10); ctx.fill(); ctx.restore();
        label(ctx, "Électronégativité χ (Pauling)", zx + 10, ey + 5, {size:ph ? 9.5 : 11, align:"left", col:"#2c3a4e", maxW:zw - 20});
        var by2 = ey + eh * 0.52, gg = ctx.createLinearGradient(ex0, 0, ex1, 0); gg.addColorStop(0, "#c7e3b0"); gg.addColorStop(1, "#e9b9a9");
        ctx.fillStyle = gg; rr(ctx, ex0, by2 - 3, ex1 - ex0, 6, 3); ctx.fill();
        [["Mg", 1.31, "#4f6b2d"], ["C", 2.55, "#2c3a4e"], ["Br", 2.96, "#9a2a1c"]].forEach(function(e){
          var xx = X(e[1]); ctx.fillStyle = e[2]; ctx.beginPath(); ctx.arc(xx, by2, 5, 0, 7); ctx.fill();
          label(ctx, e[0] + " " + F2(e[1], 2), e[0] === "Br" ? xx - 6 : xx, by2 + 14, {size:ph ? 9.5 : 10.5, col:e[2], weight:800, align:e[0] === "Br" ? "left" : "center"});
        });
        var Cbr = !(polar >= 0.5) && !wmode, xa = Cbr ? X(2.55) : X(1.31), xb = Cbr ? X(2.96) : X(2.55);
        S.draw.arrow(c, xa + 4, by2 - 11, xb - 4, by2 - 11, Cbr ? "#2a6fdb" : "#e03a2f", 2);
        if (eh > 58){
          var ptx = Cbr ? "C–Br : e⁻ attirés vers Br, C δ+" : "C–Mg : e⁻ attirés vers C, C δ−", pfs = ph ? 9 : 10.5;
          ctx.save(); ctx.font = "800 " + pfs + "px " + FONT; var ptw = Math.min(ctx.measureText(ptx).width, zw - 16); ctx.restore();
          label(ctx, ptx, clamp((xa + xb) / 2, zx + ptw / 2 + 8, zx + zw - ptw / 2 - 8), by2 - 22, {size:pfs, col:Cbr ? "#1d4fae" : "#b0281e", weight:800, maxW:zw - 16});
        }
      }
      /* titre de la scène */
      var phase = st.wq > 0 ? "Une goutte d'eau détruit le magnésien" : st.add < 1 ? "Ajout goutte à goutte · reflux doux de l'éther" : "Fin de l'ajout : le magnésien est prêt";
      label(ctx, phase, 8, 14, {size:ph ? 10.5 : 12.5, align:"left", col:"#13233a", bg:"rgba(255,255,255,.88)", maxW:W - 24});
      /* valeurs */
      var lim = Q.nMg < Q.nX - 1e-9 ? "Mg (" + F2(Q.nMg * 1000, 1) + " mmol)" : Q.nX < Q.nMg - 1e-9 ? "CH₃CH₂Br (" + F2(Q.nX * 1000, 1) + " mmol)" : "aucun (proportions égales)";
      var Vm = GR.R * GR.T / GR.P * 1000;   /* L/mol */
      ro.set(0, F2(Q.nMg * 1000, 1) + " mmol · " + F2(Q.nX * 1000, 1) + " mmol");
      ro.set(1, lim);
      ro.set(2, F2(Q.alive * 1000, 1) + " mmol (max " + F2(Math.min(Q.nMg, Q.nX) * 1000, 1) + ")");
      ro.set(3, F2((st.ethane || 0) * Vm * 1000, 0) + " mL (" + F2((st.ethane || 0) * 1000, 2) + " mmol)");
      ro.set(4, "−1 (C–Br) → −3 (C–Mg)" + (st.ethane > 0 ? " ; −3 dans l'éthane" : ""));
      ro.set(5, "C δ+ (Δχ = " + F2(GR.chi.Br - GR.chi.C, 2) + ") → C δ− (Δχ = " + F2(GR.chi.C - GR.chi.Mg, 2) + ")");
      var msg = "Masse de bromoéthane : " + F2(vS.value * GR.rhoEtBr, 2) + " g, soit n = " + F2(vS.value * GR.rhoEtBr, 2) + " / " + F2(GR.M_EtBr, 2) + " = " + F2(Q.nX * 1000, 1) + " mmol ; magnésium : " + F2(mS.value, 2) + " / " + F2(GR.M_Mg, 3) + " = " + F2(Q.nMg * 1000, 1) + " mmol. ";
      if (st.lastKill > 0) msg += "Une goutte d'eau (0,05 g = " + F2(Q.nDrop * 1000, 2) + " mmol) a détruit " + F2(st.lastKill * 1000, 2) + " mmol de magnésien : V(éthane) = n·RT/P = " + F2(st.lastKill * Vm * 1000, 0) + " mL. ";
      else msg += "Une seule goutte d'eau (" + F2(Q.nDrop * 1000, 2) + " mmol) détruirait autant de magnésien. ";
      msg += "<i>Le vrai mécanisme passe par des transferts d'un électron à la surface du métal ; la loupe montre le bilan. Éther et gaz sec : modèle simplifié.</i>";
      nt.set(msg, st.lastKill > 0 ? "warn" : "ok");
    });
  }
});
var BROM_GEO = {
 R:{el:"CCCCCCHHHHHHHHHH", p:[[-1.205,0.74,0.036],[-0.052,1.414,-0.032],[1.293,0.735,-0.085],[1.201,-0.723,0.363],[0.038,-1.401,-0.367],[-1.276,-0.765,0.085],[-2.141,1.31,0.058],[-0.088,2.509,-0.051],[1.99,1.267,0.566],[1.673,0.772,-1.109],[1.029,-0.766,1.438],[2.131,-1.239,0.122],[0.031,-2.464,-0.129],[0.158,-1.268,-1.442],[-1.493,-1.081,1.108],[-2.082,-1.108,-0.566]], b:[[0,1,2],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1]]},
 P1a:{el:"CCCCCCHHHHHHHHHHBB", p:[[-1.241,0.727,-0.276],[-0.008,1.437,0.286],[1.256,0.726,-0.202],[1.241,-0.727,0.276],[0.008,-1.437,-0.286],[-1.256,-0.726,0.202],[-2.142,1.234,0.072],[0.003,2.472,-0.055],[2.135,1.231,0.198],[1.288,0.749,-1.292],[1.209,-0.751,1.365],[2.142,-1.234,-0.072],[-0.003,-2.472,0.055],[0.04,-1.413,-1.375],[-1.288,-0.749,1.292],[-2.135,-1.231,-0.198],[-0.065,1.395,2.225],[-1.184,0.769,-2.215]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[1,16,1],[0,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1]], cip:"(1S,2S)", dih:180.0, x1:17, x2:16},
 P1e:{el:"CCCCCCHHHHHHHHHHBB", p:[[-1.24,0.725,0.286],[-0.009,1.439,-0.276],[1.257,0.725,0.203],[1.24,-0.725,-0.286],[0.009,-1.439,0.276],[-1.257,-0.725,-0.203],[-1.204,0.741,1.375],[-0.045,1.423,-1.365],[1.293,0.741,1.292],[2.134,1.233,-0.198],[2.142,-1.234,0.055],[1.204,-0.741,-1.375],[0.045,-1.423,1.365],[-0.003,-2.471,-0.072],[-2.134,-1.233,0.198],[-1.293,-0.741,-1.292],[0.012,3.277,0.344],[-2.845,1.63,-0.321]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[1,16,1],[0,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1]], cip:"(1S,2S)", dih:60.0, x1:17, x2:16},
 P2a:{el:"CCCCCCHHHHHHHHHHBB", p:[[-1.241,0.724,0.284],[-0.009,1.439,-0.274],[1.256,0.725,0.207],[1.241,-0.724,-0.284],[0.009,-1.439,0.274],[-1.256,-0.725,-0.207],[-2.143,1.233,-0.059],[0.001,2.471,0.076],[1.289,0.739,1.297],[2.134,1.234,-0.19],[2.143,-1.233,0.059],[1.208,-0.738,-1.373],[0.042,-1.425,1.363],[-0.001,-2.471,-0.076],[-2.134,-1.234,0.19],[-1.289,-0.739,-1.297],[-1.182,0.749,2.222],[-0.068,1.414,-2.213]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,16,1],[1,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1]], cip:"(1R,2R)", dih:180.0, x1:16, x2:17},
 P2e:{el:"CCCCCCHHHHHHHHHHBB", p:[[-1.24,0.726,-0.284],[-0.01,1.437,0.284],[1.257,0.727,-0.196],[1.24,-0.726,0.284],[0.01,-1.437,-0.284],[-1.257,-0.727,0.196],[-1.202,0.749,-1.373],[-0.048,1.415,1.374],[2.133,1.233,0.208],[1.295,0.749,-1.285],[1.202,-0.749,1.373],[2.143,-1.232,-0.059],[-0.002,-2.472,0.057],[0.048,-1.414,-1.374],[-1.295,-0.749,1.285],[-2.133,-1.233,-0.208],[-2.847,1.627,0.326],[0.011,3.279,-0.324]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,16,1],[1,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1]], cip:"(1R,2R)", dih:60.0, x1:16, x2:17},
 W1a:{el:"CCCCCCHHHHHHHHHHBOH", p:[[-1.245,0.731,-0.256],[-0.003,1.435,0.293],[1.256,0.725,-0.209],[1.243,-0.73,0.263],[0.005,-1.435,-0.296],[-1.255,-0.727,0.206],[-2.139,1.234,0.116],[0.006,2.472,-0.046],[2.138,1.228,0.187],[1.279,0.754,-1.298],[1.217,-0.759,1.352],[2.14,-1.236,-0.093],[-0.004,-2.473,0.037],[0.03,-1.404,-1.385],[-1.282,-0.763,1.295],[-2.137,-1.229,-0.195],[-0.04,1.392,2.232],[-1.234,0.783,-1.685],[-2.039,1.214,-1.981]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[1,16,1],[0,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1],[17,18,1]], cip:"(1S,2S)", dih:179.0, x1:17, x2:16},
 W1e:{el:"CCCCCCHHHHHHHHHHBOH", p:[[-1.251,0.73,0.218],[0.0,1.431,-0.313],[1.247,0.732,0.234],[1.251,-0.73,-0.218],[-0.0,-1.431,0.313],[-1.247,-0.732,-0.234],[-1.258,0.774,1.307],[0.007,1.387,-1.402],[1.24,0.776,1.323],[2.139,1.232,-0.145],[2.139,-1.227,0.171],[1.258,-0.774,-1.307],[-0.007,-1.387,1.402],[0.003,-2.473,-0.009],[-2.139,-1.232,0.145],[-1.24,-0.776,-1.323],[-0.005,3.285,0.26],[-2.416,1.383,-0.293],[-2.919,1.732,0.447]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[1,16,1],[0,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1],[17,18,1]], cip:"(1S,2S)", dih:60.0, x1:17, x2:16},
 W2a:{el:"CCCCCCHHHHHHHHHHBOH", p:[[-1.241,0.724,0.286],[-0.003,1.445,-0.25],[1.258,0.718,0.219],[1.24,-0.725,-0.289],[0.004,-1.442,0.257],[-1.257,-0.719,-0.223],[-2.139,1.239,-0.059],[0.009,2.469,0.127],[1.293,0.719,1.309],[2.138,1.229,-0.172],[2.138,-1.241,0.05],[1.209,-0.726,-1.378],[0.033,-1.439,1.346],[-0.008,-2.471,-0.103],[-2.138,-1.231,0.164],[-1.284,-0.721,-1.312],[-1.201,0.725,2.225],[-0.041,1.467,-1.679],[-0.043,2.382,-1.97]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,16,1],[1,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1],[17,18,1]], cip:"(1R,2R)", dih:179.0, x1:16, x2:17},
 W2e:{el:"CCCCCCHHHHHHHHHHBOH", p:[[-1.236,0.718,-0.32],[-0.007,1.447,0.226],[1.26,0.714,-0.218],[1.236,-0.718,0.32],[0.007,-1.447,-0.226],[-1.26,-0.714,0.218],[-1.191,0.696,-1.409],[-0.052,1.469,1.315],[2.136,1.234,0.171],[1.305,0.693,-1.307],[1.191,-0.697,1.409],[2.139,-1.24,0.004],[-0.01,-2.468,0.157],[0.052,-1.469,-1.315],[-1.305,-0.693,1.307],[-2.136,-1.234,-0.171],[-2.843,1.648,0.243],[0.016,2.786,-0.276],[-0.048,3.391,0.466]], b:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,16,1],[1,17,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[3,10,1],[3,11,1],[4,12,1],[4,13,1],[5,14,1],[5,15,1],[17,18,1]], cip:"(1R,2R)", dih:60.0, x1:16, x2:17},
};

/* ====================================================================== */
/* 4. Le pont bromonium et l'addition anti en 3D                           */
/* ====================================================================== */
var BG = {};
Object.keys(BROM_GEO).forEach(function(k2){
  var g = BROM_GEO[k2];
  /* rotation propre (x, y, z) → (x, z, −y) : la face « du dessus » du cycle (+z) pointe vers le haut de l'écran ; la chiralité est conservée */
  BG[k2] = {el:g.el.split("").map(function(e){ return e === "B" ? "Br" : e; }), p:g.p.map(function(q){ return [q[0], q[2], -q[1]]; }), b:g.b, cip:g.cip, dih:g.dih};
});
function dihed(p0, p1, p2, p3){
  var b0 = sub(p0, p1), b1 = nrm(sub(p2, p1)), b2 = sub(p3, p2);
  var v = sub(b0, mul(b1, dot(b0, b1))), w = sub(b2, mul(b1, dot(b2, b1)));
  return Math.abs(Math.atan2(dot(cross(b1, v), w), dot(v, w)) / DEG);
}
function qbez3(a, c, b, t){ var u = 1 - t; return add(add(mul(a, u * u), mul(c, 2 * u * t)), mul(b, t * t)); }
function testTubes(ctx, W, H, xi, water, t){
  var by = H * 0.9, g = ctx.createLinearGradient(0, by, 0, H); g.addColorStop(0, "#9c7a55"); g.addColorStop(1, "#6e5236"); ctx.fillStyle = g; ctx.fillRect(0, by, W, H - by);
  ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, by, W, 2);
  /* portoir */
  var rx = 8, rw = Math.min(130, W * 0.3), ry = by - 30;
  ctx.fillStyle = "#c9a36b"; rr(ctx, rx, ry, rw, 9, 3); ctx.fill(); ctx.fillStyle = "#a9824f"; ctx.fillRect(rx + 4, ry + 9, 5, 21); ctx.fillRect(rx + rw - 9, ry + 9, 5, 21);
  var col = water ? [214, 150, 40] : [168, 62, 22], k = 1 - ease((xi - 0.25) / 0.55);
  [0.3, 0.7].forEach(function(f, q){
    var tx = rx + rw * f, tw = 15, th = Math.min(H * 0.24, 92), ty = ry + 18 - th;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty); ctx.lineTo(tx - tw / 2, ty + th - tw / 2); ctx.arc(tx, ty + th - tw / 2, tw / 2, PI, 0, true); ctx.lineTo(tx + tw / 2, ty); ctx.closePath();
    ctx.save(); ctx.clip();
    var a = q === 0 ? 0.85 : 0.85 * k, ly = ty + th * 0.38;
    ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + a.toFixed(3) + ")"; ctx.fillRect(tx - tw, ly, tw * 2, th);
    ctx.fillStyle = "rgba(225,238,250,.35)"; ctx.fillRect(tx - tw, ly, tw * 2, th);
    ctx.restore();
    ctx.strokeStyle = "rgba(90,115,140,.85)"; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx - tw * 0.22, ty + 6); ctx.lineTo(tx - tw * 0.22, ty + th - tw); ctx.stroke();
    ctx.restore();
  });
  label(ctx, "témoin", rx + rw * 0.3, by + 13, {size:10, col:"#fff", weight:700});
  label(ctx, "+ alcène", rx + rw * 0.7, by + 13, {size:10, col:"#fff", weight:700});
  return {x:rx + rw * 0.7, y:ry - 30};
}
SFA.sim({
  id:"org-bromonium-3d", ch:"c09", tag:"Alcènes",
  titre:"Le pont bromonium et l'addition anti en 3D",
  resume:"Le cyclohexène en 3D : Br₂ s'approche, le pont bromonium bloque une face, et Br⁻ (ou H₂O) n'arrive que par l'autre. On obtient le trans-1,2-dibromocyclohexane, ou la bromhydrine dans l'eau, en mélange racémique.",
  but:"Regarde Br₂ arriver par le dessus du cycle : la double liaison l'attaque, un pont bromonium (cycle à trois atomes, Br⁺) se forme et bloque cette face. Br⁻ doit faire le tour pour attaquer par le dessous, à l'opposé du pont : les deux Br finissent de part et d'autre du cycle (trans). Choisis le carbone attaqué (C1 ou C2) et compare les descripteurs R/S ; passe dans l'eau pour obtenir la bromhydrine. Le tube à essai montre la décoloration du brome. Glisse pour tourner.",
  aRetenir:"Addition de Br₂ sur un alcène : (1) la liaison π attaque Br₂, qui se polarise ; il se forme un ion bromonium ponté (Br⁺ lié aux deux carbones) et Br⁻ ; (2) Br⁻ attaque un carbone du pont par la face opposée (comme une SN2) : addition anti. Sur le cyclohexène, le produit est le trans-1,2-dibromocyclohexane, formé diaxial ; la chaise peut ensuite basculer (équilibre diaxial ⇌ diéquatorial ; pour le dibromure, le diaxial reste important car les deux C–Br sont opposés). Les deux carbones du pont sont attaqués aussi souvent (alcène symétrique ; sur un alcène dissymétrique, H₂O attaque le carbone le plus substitué) : mélange racémique (1R,2R) + (1S,2S). Dans l'eau, H₂O (en grand excès) ouvre le pont à la place de Br⁻ : bromhydrine trans (2-bromocyclohexan-1-ol), dont la chaise bascule en diéquatorial (plus stable). Test : Br₂ rouge-brun (dans CH₂Cl₂) ou l'eau de brome orange se décolore.",
  piege:"Le pont n'est pas un carbocation libre : comme Br bloque une face, il n'y a pas de mélange syn/anti, on n'obtient que l'addition anti. « trans » ne veut pas dire un seul stéréoisomère : c'est un racémique. Et le cis-1,2-dibromocyclohexane ne se forme pas par cette voie. Dans l'eau, c'est l'oxygène de H₂O qui se lie au carbone, puis il perd un H⁺.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.9}); phoneRatio(c, 0.9, 1.2);
    var st = {a:0.5, b:0.32, spin:true, xi:0, play:true, hold:0.5, t:0, ts:0, cyc:0};
    viewCtl(c, st); st.onview = function(){ st.spin = false; spinT.set(false); };
    var sS = k.seg("Milieu", [["dcm", "Br₂ dans CH₂Cl₂"], ["eau", "Br₂ dans l'eau"]], "dcm", function(){ st.xi = 0; xS.set(0); st.play = true; });
    var aS = k.seg("Carbone attaqué", [["alt", "C1 puis C2"], ["1", "C1"], ["2", "C2"]], "alt", function(){ st.xi = 0; xS.set(0); st.play = true; });
    var xS = k.slider("Avancement", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) st.xi = 0; st.play = !st.play; st.hold = 0; }, true);
    var flT = k.toggle("La chaise peut basculer (équilibre de conformation)", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Étape", "Attaque du pont", "Dièdre X–C1–C2–Y", "Produit", "M(produit)"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.xi >= 1){ st.xi = 0; st.hold = 0.6; st.cyc++; }
        else { var nx = st.xi + dt * 0.065; if (nx >= 1){ nx = 1; st.hold = 2.6; } st.xi = nx; }
        xS.set(st.xi);
      }
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.5 + 0.6 * Math.sin(st.ts * 0.3); st.b = 0.32 + 0.14 * Math.sin(st.ts * 0.21); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, xi = st.xi, t = st.t, wat = sS.value === "eau";
      var att = aS.value === "alt" ? (st.cyc % 2 ? 2 : 1) : +aS.value;
      var R = BG.R, Pa = BG[(wat ? "W" : "P") + att + "a"], Pe = BG[(wat ? "W" : "P") + att + "e"];
      /* fond */
      var bg = ctx.createRadialGradient(W * 0.5, H * 0.42, 10, W * 0.5, H * 0.45, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, wat ? "#dfeaf5" : "#e8e6f0"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* phases */
      var e1 = ease(xi / 0.18), e2 = ease((xi - 0.18) / 0.14), e3 = ease((xi - 0.34) / 0.26), e4 = ease((xi - 0.60) / 0.13), e5 = ease((xi - 0.74) / 0.07), e6 = flT.value ? ease((xi - 0.82) / 0.14) : 0;
      var n = [0, 1, 0], cAtt = att - 1, cOth = 1 - cAtt;
      var ringAt = function(i){
        var p0 = R.p[i] || R.p[0], pb = lerp3(R.p[i], Pa.p[i], 0.3), pa = Pa.p[i], pe = Pe.p[i];
        var p = e2 < 1 ? lerp3(p0, pb, e2) : lerp3(pb, pa, e4);
        return e6 > 0 ? lerp3(p, pe, e6) : p;
      };
      var A = [], Bd = [], i;
      for (i = 0; i < 16; i++) A.push(At(R.el[i], ringAt(i)));
      /* liaisons du cycle et des H (ordre de C1=C2 : 2 → 1) */
      R.b.forEach(function(b){ var o = b[2]; if ((b[0] === 0 && b[1] === 1) || (b[0] === 1 && b[1] === 0)) o = e2 < 0.5 ? 2 : 1; Bd.push({a:b[0], b:b[1], o:o}); });
      var mid = mul(add(A[0].p, A[1].p), 0.5);
      /* Br_a (pont) : dans Br₂ → pont → lié au carbone non attaqué */
      var brA0 = add(mid, mul(n, 3.4)), brAb = add(mid, mul(n, 1.86)), brAP = e6 > 0 ? lerp3(Pa.p[16], Pe.p[16], e6) : Pa.p[16];
      var brA = e2 < 1 ? lerp3(lerp3(add(mid, mul(n, 5.2)), brA0, e1), brAb, e2) : lerp3(brAb, brAP, e4);
      A.push(At("Br", brA, {lab:"Br"})); var iA = 16;
      /* nucléophile : Br⁻ (Br_b) ou H₂O */
      var Xf = e6 > 0 ? lerp3(Pa.p[17], Pe.p[17], e6) : Pa.p[17], cP = Pa.p[cAtt], dirN = nrm(sub(Pa.p[17], cP)), appr = add(Pa.p[17], mul(dirN, 1.7));
      var radial = nrm([A[cAtt].p[0], 0, A[cAtt].p[2]]);
      var iB = 17, brB0 = add(brA0, mul(n, 2.28)), relB = add(brAb, add(mul(n, 2.9), mul(radial, 1.6)));
      var nuP;
      if (!wat){
        if (e3 <= 0) nuP = e2 > 0 ? lerp3(lerp3(add(mid, mul(n, 7.5)), brB0, e1), relB, e2) : lerp3(add(mid, mul(n, 7.5)), brB0, e1);
        else if (e4 <= 0) nuP = qbez3(relB, add(add(mul(radial, 4.0), [0, 0.2, 0]), A[cAtt].p), appr, e3);
        else nuP = lerp3(appr, Xf, e4);
        if (e6 > 0) nuP = lerp3(Pa.p[17], Pe.p[17], e6);
        A.push(At("Br", nuP, {lab:"Br"}));
      } else {
        A.push(At("O", e4 > 0 ? (e6 > 0 ? Xf : lerp3(appr, Pa.p[17], e4)) : lerp3(add(appr, add(mul(radial, 2.4), [0, -1.6, 0])), appr, e3), {lab:"O"}));
      }
      /* liaisons du pont et de l'attaque */
      Bd.push({a:cOth, b:iA, o:1, alpha:e2, dash:e2 < 0.9});
      Bd.push({a:cAtt, b:iA, o:1, alpha:e2 * (1 - e4), dash:e2 < 0.9 || e4 > 0.05});
      if (!wat) Bd.push({a:iA, b:iB, o:1, alpha:1 - e2, dash:e2 > 0.1});
      Bd.push({a:cAtt, b:iB, o:1, alpha:e4, dash:e4 < 0.9});
      var extraAtoms = [];
      if (wat){
        /* H₂O : H de l'OH final + H qui part (H⁺) ; Br⁻ libéré s'éloigne */
        var Op = A[iB].p, hF = e6 > 0 ? lerp3(Pa.p[18], Pe.p[18], e6) : Pa.p[18], hK = add(Op, mul(nrm(sub(hF, Pa.p[17])), 0.97));
        var cO = nrm(sub(Op, A[cAtt].p)), hL0 = add(Op, mul(nrm(add(mul(cO, 0.5), cross(cO, nrm(sub(hK, Op))))), 0.97));
        var hLost = e5 > 0 ? add(hL0, mul(nrm(add(cO, [0.4, 0.3, -0.5])), 3.2 * e5)) : hL0;
        A.push(At("H", e4 > 0 ? hK : add(Op, mul(nrm([0.5, 0.6, -0.6]), 0.97)))); Bd.push({a:iB, b:18, o:1});
        A.push(At("H", e4 > 0 ? hLost : add(Op, mul(nrm([-0.6, -0.4, -0.7]), 0.97)), {alpha:1 - ease((xi - 0.80) / 0.06), glow:e5 > 0 ? "rgba(255,170,60,.6)" : null})); Bd.push({a:iB, b:19, o:1, alpha:1 - e5, dash:e5 > 0.05});
        var brBw = e2 > 0 ? lerp3(relB, add(relB, [2.5, 1.5, 1.0]), e3) : lerp3(add(mid, mul(n, 7.5)), brB0, e1);
        A.push(At("Br", brBw, {lab:"Br", alpha:1 - ease((xi - 0.5) / 0.15)})); var iBw = A.length - 1;
        Bd.push({a:iA, b:iBw, o:1, alpha:1 - e2, dash:e2 > 0.1});
        if (e2 > 0.5){ A[iBw].badge = "−"; A[iBw].badgeCol = "#2a6fdb"; }
        if (e4 > 0.5 && e5 < 1){ A[iB].badge = "+"; A[iB].badgeCol = "#e08a1e"; A[iB].badgeA = 1 - e5; }
      } else {
        if (e2 > 0.5 && e4 < 0.5){ A[iB].badge = "−"; A[iB].badgeCol = "#2a6fdb"; }
      }
      if (e2 > 0.5 && e4 < 0.5){ A[iA].badge = "+"; A[iA].badgeCol = "#e08a1e"; A[iA].glow = "rgba(240,140,30,.35)"; }
      if (e1 > 0.4 && e2 < 0.5){ A[iA].badge = "δ+"; A[iA].badgeCol = "#e08a1e"; var ib2 = wat ? A.length - 1 : iB; A[ib2].badge = "δ−"; A[ib2].badgeCol = "#2a6fdb"; }
      /* repères C1 et C2 */
      A[cAtt].ring = e3 > 0 && e4 < 1 ? "#1f9d55" : null;
      /* cadrage */
      var top = ph ? 40 : 36, bot = H * 0.9 - 6, sc = Math.min((W - 30) / 8.2, (bot - top) / 9.6);
      var V = {st:st, sc:sc, cx:W * 0.5 + (ph ? 18 : 40), cy:top + (bot - top) * 0.6};
      var extra = [];
      /* nuage π au-dessus et au-dessous de C1=C2 (il disparaît quand le pont se forme) */
      var piA = (1 - e2) * 0.9;
      if (piA > 0.03) [1, -1].forEach(function(sg){
        var P = proj3(add(mid, mul(n, 0.7 * sg)), st, sc, V.cx, V.cy), rad = 0.85 * sc * P.s;
        extra.push({z:P.z - 0.1, f:function(){ var g = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, rad); g.addColorStop(0, "rgba(118,92,230," + (0.35 * piA).toFixed(3) + ")"); g.addColorStop(1, "rgba(118,92,230,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(P.x, P.y, rad * 1.25, rad * 0.8, 0, 0, 7); ctx.fill(); }});
      });
      /* face bloquée par le pont : un voile rouge au-dessus du cycle */
      var veil = e2 * (1 - e4);
      if (veil > 0.03){
        var Pv = proj3(add(mid, mul(n, 1.2)), st, sc, V.cx, V.cy);
        extra.push({z:Pv.z + 0.4, f:function(){ ctx.save(); ctx.globalAlpha = 0.55 * veil; var g = ctx.createRadialGradient(Pv.x, Pv.y, 4, Pv.x, Pv.y, sc * 2.2); g.addColorStop(0, "rgba(214,57,47,.30)"); g.addColorStop(1, "rgba(214,57,47,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(Pv.x, Pv.y, sc * 2.2, 0, 7); ctx.fill(); ctx.restore(); }});
      }
      var pr = drawScene(c, V, A, Bd, extra);
      /* repères C1 et C2, posés à côté des atomes (vers l'extérieur du cycle) */
      var rc = proj3([0, A[0].p[1], 0], st, sc, V.cx, V.cy);
      [0, 1].forEach(function(q){ var P = pr[q], dx = P.x - rc.x, dy = P.y - rc.y, L = Math.hypot(dx, dy) || 1; label(ctx, "C" + (wat ? (q === cAtt ? 1 : 2) : q + 1), P.x + dx / L * (P.r + 13), P.y + dy / L * (P.r + 13), {size:ph ? 10.5 : 11.5, weight:800, col:q === cAtt ? "#16683a" : "#2c3a4e", bg:"rgba(255,255,255,.82)"}); });
      /* flèche d'attaque anti (pointillé vert) pendant l'approche */
      var fa = clamp(Math.min(e3 * 3, 1) * (1 - e4 * 1.4), 0, 1);
      if (fa > 0.03){
        var p0 = proj3(add(appr, mul(dirN, 1.6)), st, sc, V.cx, V.cy), p1 = pr[cAtt];
        ctx.save(); ctx.globalAlpha = fa; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = "#1f9d55"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.restore();
        var lx = clamp((p0.x + p1.x) / 2 + (ph ? 0 : 70), 70, W - 70), ly = clamp((p0.y + p1.y) / 2 + 10, top + 30, H * 0.9 - 14);
        label(ctx, "attaque anti (face du dessous)", lx, ly, {size:ph ? 10.5 : 11.5, col:"#16683a", bg:"rgba(255,255,255,.88)", alpha:fa});
      }
      if (veil > 0.3){ var pv = proj3(add(mid, mul(n, 3.1)), st, sc, V.cx, V.cy); label(ctx, "face bloquée par Br⁺", clamp(pv.x, 80, W - 80), Math.max(top + 4, pv.y - 26), {size:ph ? 10.5 : 11.5, col:"#a3241b", bg:"rgba(255,255,255,.85)", alpha:Math.min(1, veil * 1.5)}); }
      var tube = testTubes(ctx, W, H, xi, wat, t);
      /* étape */
      var stage = xi < 0.18 ? 0 : xi < 0.32 ? 1 : xi < 0.60 ? 2 : xi < 0.74 ? 3 : (wat && xi < 0.82) ? 4 : (e6 > 0.02 && e6 < 0.98) ? 5 : 6;
      var nuN = wat ? "H₂O" : "Br⁻", attL = wat ? 1 : att;
      var TX = ["Br₂ s'approche de la double liaison (par le dessus)", "Pont bromonium : Br⁺ lié à C1 et C2", nuN + " fait le tour et vise C" + attL + " par le dessous", nuN + " ouvre le pont (attaque anti)", "l'oxonium perd un H⁺ (repris par l'eau)", wat ? "la chaise bascule : substituants équatoriaux (plus stable)" : "la chaise bascule : équilibre diaxial ⇌ diéquatorial", "Produit trans"];
      label(ctx, TX[stage], 10, 16, {size:ph ? 11.5 : 13, align:"left", col:"#13233a", bg:"rgba(255,255,255,.88)", maxW:W - 20});
      if (!ph) label(ctx, "glisse pour tourner", W - 10, 16, {size:11, align:"right", col:"#8a95a3", weight:600});
      /* CIP du produit, calculé sur les positions */
      var PP = Pe.p, X1 = PP[16], X2 = PP[17], cX = function(ci){ return ci === cOth ? X1 : X2; };
      var d1 = cipRS(PP[0], cX(0), PP[1], PP[5], PP[6]), d2 = cipRS(PP[1], cX(1), PP[0], PP[2], PP[7]);
      var cip = wat ? (cAtt === 0 ? "(1" + d1 + ",2" + d2 + ")" : "(1" + d2 + ",2" + d1 + ")") : "(1" + d1 + ",2" + d2 + ")";
      var prodN = wat ? "trans-2-bromocyclohexan-1-ol " + cip : "trans-1,2-dibromocyclohexane " + cip;
      var Mp = wat ? molM({C:6, H:11, Br:1, O:1}) : molM({C:6, H:10, Br:2});
      var dh = xi >= 0.6 ? dihed(A[iA].p, A[cOth].p, A[cAtt].p, A[iB].p) : null;
      ro.set(0, ["approche de Br₂", "ion bromonium", "contournement", "ouverture anti", "déprotonation", "basculement de chaise", "produit"][stage]);
      ro.set(1, nuN + " sur C" + attL + (wat ? " (futur C–OH)" : "") + ", face opposée au pont");
      ro.set(2, dh == null ? "— (pont pas encore ouvert)" : F2(dh, 0) + "° (" + (dh > 120 ? "diaxial, anti" : "diéquatorial") + ")");
      ro.set(3, prodN);
      ro.set(4, F2(Mp, 2) + " g/mol");
      var other = att === 1 ? 2 : 1, d1o = d1 === "R" ? "S" : "R", d2o = d2 === "R" ? "S" : "R";
      var cipO = wat ? (cAtt === 0 ? "(1" + d1o + ",2" + d2o + ")" : "(1" + d2o + ",2" + d1o + ")") : "(1" + d1o + ",2" + d2o + ")";
      nt.set((wat ? "Numérotation du produit : C1 porte OH. H₂O attaque l'un des carbones du pont → " + cip + " ; l'autre → " + cipO : "Attaque sur C" + att + " → " + cip + " ; attaque sur C" + other + " → " + cipO) + " : les deux carbones du pont sont équivalents, on obtient les deux énantiomères à 50/50 (racémique). " +
        (wat ? "Dans l'eau, H₂O (55 mol/L) est bien plus abondant que Br⁻ : c'est lui qui ouvre le pont, puis l'oxonium perd H⁺ ; la chaise bascule ensuite en diéquatorial (plus stable). " : "Le dièdre Br–C–C–Br vaut 180° juste après l'attaque (diaxial) puis environ 60° quand la chaise a basculé (équilibre diaxial ⇌ diéquatorial ; pour le dibromure, le diaxial reste important car les deux C–Br sont opposés). ") +
        "Dans le tube, " + (wat ? "l'eau de brome orange" : "Br₂ rouge-brun") + " se décolore : c'est le test des alcènes. <i>Géométries idéalisées ; Br₂ est ici en solution (sans catalyseur).</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 5. L'ordre des étapes décide du produit (synthèse aromatique)           */
/* ====================================================================== */
/* benzène dans le plan xy ; position k (0 = en haut) à l'angle 90° − 60°·k */
function ringDir(k){ var a = (90 - 60 * k) * DEG; return [Math.cos(a), Math.sin(a), 0]; }
/* groupes : {k: "Br" | "NO2"} ; mv : {k: {f, from}} pour un groupe qui arrive (f de 0 à 1) */
function benzMol(groups, mv, hOut){
  var A = [], B = [], i, RR = 1.39;
  for (i = 0; i < 6; i++) A.push(At("C", mul(ringDir(i), RR)));
  for (i = 0; i < 6; i++) B.push({a:i, b:(i + 1) % 6, o:i % 2 ? 1 : 2});
  var tags = [];
  for (i = 0; i < 6; i++){
    var d = ringDir(i), g = groups[i], m = mv && mv[i], f = m ? m.f : 1, Cp = A[i].p;
    var off = m ? add(mul(d, 2.6 * (1 - f)), [0, 0, 3.2 * (1 - f)]) : [0, 0, 0];
    if (!g || (m && f < 1)){
      var ho = hOut && hOut[i] ? hOut[i] : 0;
      var hp = add(add(Cp, mul(d, 1.09)), add(mul(d, 1.6 * ho), [0, 0, -2.2 * ho]));
      A.push(At("H", hp, {alpha:1 - ho})); B.push({a:i, b:A.length - 1, o:1, alpha:1 - ho, dash:ho > 0.05});
    }
    if (g === "Br"){
      A.push(At("Br", add(add(Cp, mul(d, 1.90)), off), {lab:"Br"})); var ib = A.length - 1; B.push({a:i, b:ib, o:1, alpha:f, dash:f < 0.95}); tags.push({k:i, at:ib});
    } else if (g === "NO2"){
      var Np = add(add(Cp, mul(d, 1.47)), off); A.push(At("N", Np, {lab:"N"})); var iN = A.length - 1; B.push({a:i, b:iN, o:1, alpha:f, dash:f < 0.95});
      [1, -1].forEach(function(s){ A.push(At("O", add(Np, mul(rotAx(d, [0, 0, 1], s * 60 * DEG), 1.22)), {lab:"O"})); B.push({a:iN, b:A.length - 1, o:s > 0 ? 2 : 1}); if (s < 0){ A[A.length - 1].badge = "−"; A[A.length - 1].badgeCol = "#c0392b"; A[A.length - 1].badgeA = 0.9; A[A.length - 1].badgeR = 6.5; } });
      A[iN].badge = "+"; A[iN].badgeCol = "#e08a1e"; A[iN].badgeA = 0.9; A[iN].badgeR = 6.5;
      tags.push({k:i, at:iN});
    }
  }
  return {A:A, B:B, tags:tags};
}
var OR = {
  NB:{n:"nitration puis bromation", s1:"NO2", s2:"Br", r1:"HNO₃ / H₂SO₄", r2:"Br₂ / FeBr₃", i1:"nitrobenzène", el1:{C:6, H:5, N:1, O:2},
      eff:"–NO₂ : attracteur (−I, −M), désactivant, oriente en méta", ok:[2, 4], bad:[1, 3, 5],
      prods:[{k:2, nm:"1-bromo-3-nitrobenzène (méta)", pc:"très majoritaire"}]},
  BN:{n:"bromation puis nitration", s1:"Br", s2:"NO2", r1:"Br₂ / FeBr₃", r2:"HNO₃ / H₂SO₄", i1:"bromobenzène", el1:{C:6, H:5, Br:1},
      eff:"–Br : attracteur par effet −I (désactivant) mais donneur par +M : oriente en ortho et para", ok:[1, 3, 5], bad:[2, 4],
      prods:[{k:1, nm:"1-bromo-2-nitrobenzène (ortho)", pc:"≈ 35 à 45 %"}, {k:3, nm:"1-bromo-4-nitrobenzène (para)", pc:"≈ 55 à 65 %"}]}
};
var POSN = {1:"o", 2:"m", 3:"p", 4:"m", 5:"o"};
function benchBottles(ctx, W, H, OR1, act, t){
  var by = H * 0.9, g = ctx.createLinearGradient(0, by, 0, H); g.addColorStop(0, "#4b5563"); g.addColorStop(1, "#1f2937"); ctx.fillStyle = g; ctx.fillRect(0, by, W, H - by);
  ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(0, by, W, 2);
  var bw = Math.min(40, W * 0.09), bh = bw * 1.55;
  [[OR1.r1, 1], [OR1.r2, 2]].forEach(function(r, q){
    var x = 14 + q * (bw + 16), y = by - bh, on = act === r[1];
    ctx.save();
    if (on){ ctx.shadowColor = "rgba(255,200,60,.9)"; ctx.shadowBlur = 16 + 6 * Math.sin(t * 5); }
    var gb = ctx.createLinearGradient(x, 0, x + bw, 0); gb.addColorStop(0, "#9a5a1c"); gb.addColorStop(0.5, "#c47a2c"); gb.addColorStop(1, "#7a4512");
    ctx.fillStyle = gb; rr(ctx, x, y + bh * 0.18, bw, bh * 0.82, 6); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#1f2937"; rr(ctx, x + bw * 0.25, y, bw * 0.5, bh * 0.2, 3); ctx.fill();
    ctx.fillStyle = "#fffaf0"; ctx.fillRect(x + 3, y + bh * 0.42, bw - 6, bh * 0.36);
    label(ctx, (q + 1) + "", x + bw / 2, y + bh * 0.52, {size:10, weight:800, col:"#13233a"});
    label(ctx, r[0].split(" / ")[0], x + bw / 2, y + bh * 0.68, {size:Math.max(7.5, bw * 0.2), weight:800, col:"#13233a", maxW:bw - 6});
  });
}
SFA.sim({
  id:"org-ordre-synthese-aromatique", ch:"c09", tag:"Composés aromatiques",
  titre:"L'ordre des étapes décide du produit",
  resume:"Nitrer puis bromer, ou bromer puis nitrer : la molécule se construit en 3D, les positions activées par le premier substituant s'allument, et on obtient le 1-bromo-3-nitrobenzène dans un ordre, le mélange ortho + para dans l'autre.",
  but:"Choisis l'ordre des deux réactions. Le benzène reçoit son premier substituant ; les positions que ce groupe favorise pour la deuxième substitution s'allument en vert (o = ortho, m = méta, p = para), les autres restent grises. Le deuxième électrophile arrive alors sur une position verte. Compare les produits des deux ordres et le flacon de réactif utilisé à chaque étape. Glisse pour tourner la molécule.",
  aRetenir:"Le premier substituant décide où va le second. –NO₂ (et –COR, –COOH, –SO₃H, –CN) attire les électrons : il désactive le cycle et oriente en méta. Les halogènes désactivent un peu (−I) mais orientent en ortho et para grâce à leurs doublets (+M). Les donneurs (–OH, –NH₂, –CH₃) activent et orientent en ortho/para. Pour le 1-bromo-3-nitrobenzène, on nitre d'abord ; pour les isomères 2- et 4-, on brome d'abord, puis on sépare l'ortho du para.",
  piege:"On ne lit pas l'orientation sur le second réactif : c'est le groupe déjà présent sur le cycle qui décide. « Désactivant » ne veut pas dire « oriente en méta » : les halogènes désactivent et orientent pourtant en ortho/para. Et dans le cycle disubstitué, on numérote pour avoir les plus petits locants, puis par ordre alphabétique (bromo avant nitro).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.9}); phoneRatio(c, 0.9, 1.22);
    var st = {a:0, b:0.45, spin:true, xi:0, play:true, hold:0.6, t:0, ts:0};
    viewCtl(c, st); st.onview = function(){ st.spin = false; spinT.set(false); };
    var oS = k.seg("Ordre des étapes", [["NB", "1) Nitration 2) Bromation"], ["BN", "1) Bromation 2) Nitration"]], "NB", function(){ st.xi = 0; xS.set(0); st.play = true; st.hold = 0.4; });
    var xS = k.slider("Avancement", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) st.xi = 0; st.play = !st.play; st.hold = 0; }, true);
    var dT = k.toggle("Montrer les charges partielles δ du cycle", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Étape", "Effet du 1er substituant", "Positions favorisées (2e étape)", "Produit(s)", "M(produit)"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.xi >= 1){ st.xi = 0; st.hold = 0.6; }
        else { var nx = st.xi + dt * 0.06; if (nx >= 1){ nx = 1; st.hold = 3.2; } st.xi = nx; }
        xS.set(st.xi);
      }
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.42 * Math.sin(st.ts * 0.33); st.b = 0.45 + 0.15 * Math.sin(st.ts * 0.22); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var O = OR[oS.value], ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, xi = st.xi, t = st.t;
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f6f8fb"); bg.addColorStop(1, "#e3e9f1"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var f1 = ease((xi - 0.08) / 0.18), hl = ease((xi - 0.30) / 0.10), sp = O.prods.length > 1 ? ease((xi - 0.46) / 0.10) : 0, f2 = ease((xi - 0.56) / 0.18), done = xi > 0.78;
      var act = xi < 0.06 ? 0 : xi < 0.30 ? 1 : (xi >= 0.5 && xi < 0.78) ? 2 : 0;
      benchBottles(ctx, W, H, O, act, t);
      var bR = 14 + 2 * Math.min(40, W * 0.09) + 16 + 8;
      /* schéma de la route en haut */
      var rtY = 18, items = ["benzène", O.i1, O.prods.length > 1 ? "ortho + para" : "méta"], nStage = xi < 0.28 ? 0 : xi < 0.74 ? 1 : 2;
      var cw = (W - 20) / 3;
      items.forEach(function(s, q){
        label(ctx, s, 10 + cw * (q + 0.5), rtY, {size:ph ? 10.5 : 12, weight:800, col:q === nStage ? "#fff" : "#2c3a4e", bg:q === nStage ? "#2a6fdb" : "rgba(255,255,255,.9)", maxW:cw - 26});
        if (q < 2) label(ctx, "→", 10 + cw * (q + 1), rtY, {size:14, col:"#5f6b7a"});
      });
      label(ctx, "(1) " + O.r1 + "     (2) " + O.r2, W / 2, rtY + 20, {size:ph ? 9.5 : 11, weight:600, col:"#5f6b7a", maxW:W - 20});
      /* molécule(s) */
      var top = 50, bot = H * 0.9 - (done && O.prods.length > 1 ? 40 : 8), avail = bot - top;
      var copies = O.prods.length > 1 ? O.prods.map(function(p, q){ return {p:p, dx:(q ? 1 : -1) * sp}; }) : [{p:O.prods[0], dx:0}];
      var scBase = Math.min(W * 0.9, avail) / 8.4, sc = scBase * (1 - 0.47 * sp * (O.prods.length > 1 ? 1 : 0));
      var summary = [];
      copies.forEach(function(cp, q){
        if (O.prods.length > 1 && sp <= 0 && q > 0) return;
        var groups = {0:O.s1}, mv = {0:{f:f1}};
        if (xi < 0.08) mv[0] = {f:0};
        var hOut = {0:ease((xi - 0.18) / 0.10)};
        if (xi > 0.5){ groups[cp.p.k] = O.s2; mv[cp.p.k] = {f:f2}; hOut[cp.p.k] = ease((xi - 0.66) / 0.10); }
        var M = benzMol(groups, mv, hOut);
        if (xi < 0.08) M.A.forEach(function(a, ia){ if (ia > 5 && (a.el === "Br" || a.el === "N" || a.el === "O")) a.alpha = clamp(xi / 0.08, 0, 1) * 0.0; });
        var cxx = W / 2 + cp.dx * W * 0.25, cyy = top + avail * 0.5;
        var V = {st:st, sc:sc, cx:cxx, cy:cyy};
        /* halos des positions (vertes = favorisées) et charges δ */
        var extra = [];
        if (hl > 0){
          [1, 2, 3, 4, 5].forEach(function(kk){
            var good = O.ok.indexOf(kk) >= 0, Pp = proj3(mul(ringDir(kk), 1.39), st, sc, cxx, cyy), a2 = hl * (good ? 0.75 + 0.25 * Math.sin(t * 4 + kk) : 0.5);
            if (xi > 0.74 && kk !== cp.p.k) a2 *= 0.35;
            extra.push({z:Pp.z - 0.3, f:function(){ var g = ctx.createRadialGradient(Pp.x, Pp.y, 2, Pp.x, Pp.y, sc * 0.95); g.addColorStop(0, good ? "rgba(31,157,85," + (0.55 * a2).toFixed(3) + ")" : "rgba(150,160,175," + (0.35 * a2).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(Pp.x, Pp.y, sc * 0.95, 0, 7); ctx.fill(); }});
          });
        }
        if (dT.value && hl > 0.3){
          (O.s1 === "NO2" ? [1, 3, 5] : [1, 3, 5]).forEach(function(kk){ if (groups[kk]) return; var a = M.A[kk]; a.badgeR = 10.5; a.badge = O.s1 === "NO2" ? "δ+" : "δ−"; a.badgeCol = O.s1 === "NO2" ? "#e08a1e" : "#2a6fdb"; a.badgeA = hl * (xi > 0.74 ? 0.4 : 1); });
        }
        var pr = drawScene(c, V, M.A, M.B, extra);
        /* étiquettes o / m / p */
        if (hl > 0.2){
          [1, 2, 3, 4, 5].forEach(function(kk){
            if (xi > 0.7 || (groups[kk] && f2 > 0.3)) return;
            var good = O.ok.indexOf(kk) >= 0, P = proj3(mul(ringDir(kk), 3.35), st, sc, cxx, cyy);
            label(ctx, POSN[kk], P.x, P.y, {size:ph ? 11 : 12.5, weight:800, col:"#fff", bg:good ? "#1f9d55" : "#9aa5b1", alpha:Math.min(1, hl * 1.4)});
          });
        }
        /* nom sous la molécule à la fin */
        if (done){
          var ny = cyy + sc * 3.9 + 8, nm = cp.p.nm;
          if (O.prods.length > 1){
            label(ctx, nm.split(" (")[0], cxx, Math.min(bot + 12, ny), {size:ph ? 9.5 : 11.5, weight:800, col:"#13233a", bg:"rgba(255,255,255,.9)", maxW:W * 0.47});
            label(ctx, cp.p.nm.split(" (")[1].replace(")", "") + " · " + cp.p.pc, cxx, Math.min(bot + 30, ny + 18), {size:ph ? 9.5 : 11, weight:700, col:"#16683a", maxW:W * 0.47});
          } else {
            label(ctx, nm, (bR + W) / 2, H * 0.9 - (ph ? 14 : 16), {size:ph ? 11.5 : 13.5, weight:800, col:"#13233a", bg:"rgba(255,255,255,.92)", maxW:W - bR - 16});
          }
        }
        summary.push(cp.p);
      });
      /* les δ− du bromobenzène sont relatifs : le cycle reste désactivé */
      if (dT.value && hl > 0.3 && O.s1 !== "NO2" && xi <= 0.74) label(ctx, "δ− en ortho/para (relatif ; le cycle reste désactivé)", (bR + W) / 2, H * 0.9 - (ph ? 36 : 42), {size:ph ? 9.5 : 11, weight:700, col:"#2a6fdb", bg:"rgba(255,255,255,.88)", maxW:W - bR - 16, alpha:Math.min(1, (hl - 0.3) * 2)});
      /* électrophile en approche : étiquette */
      var stage = xi < 0.08 ? 0 : xi < 0.30 ? 1 : xi < 0.5 ? 2 : xi < 0.56 ? 3 : xi < 0.78 ? 4 : 5;
      var E1 = O.s1 === "NO2" ? "NO₂⁺" : "Br⁺ (Br₂ activé par FeBr₃)", E2 = O.s2 === "NO2" ? "NO₂⁺" : "Br⁺ (Br₂ activé par FeBr₃)";
      var TX = ["benzène : six positions équivalentes", "étape 1 : " + E1 + " remplace un H", "le 1er groupe désigne les positions " + (O.s1 === "NO2" ? "méta" : "ortho et para"), O.prods.length > 1 ? "deux positions possibles : deux produits" : "une seule position favorisée (deux méta équivalentes)", "étape 2 : " + E2 + " sur la position verte", O.prods.length > 1 ? "mélange ortho + para, à séparer" : "un seul produit : le méta"];
      if (!(done && O.prods.length === 1)) label(ctx, TX[stage], (bR + W) / 2, H * 0.9 - (ph ? 14 : 16), {size:ph ? 10.5 : 12, weight:800, col:"#13233a", bg:"rgba(255,255,255,.85)", maxW:W - bR - 16});
      if (!ph) label(ctx, "glisse pour tourner", W - 10, 60, {size:11, align:"right", col:"#8a95a3", weight:600});
      /* valeurs */
      var Mp = molM({C:6, H:4, Br:1, N:1, O:2}), M1 = molM(O.el1);
      ro.set(0, ["benzène", "1re substitution", "positions favorisées", "positions favorisées", "2e substitution", "produit(s)"][stage]);
      ro.set(1, O.eff);
      ro.set(2, O.s1 === "NO2" ? "méta (C3 et C5, équivalentes)" : "ortho (C2, C6) et para (C4)");
      ro.set(3, O.prods.map(function(p){ return p.nm + " : " + p.pc; }).join("<br>"));
      ro.set(4, "C₆H₄BrNO₂ : " + F2(Mp, 2) + " g/mol (intermédiaire " + O.i1 + " : " + F2(M1, 2) + " g/mol)");
      var msg = O.s1 === "NO2" ?
        "Dans le complexe σ d'une attaque en ortho ou en para, une forme limite met la charge + sur le carbone qui porte –NO₂, lui-même déjà déficitaire (N⁺) : très défavorable. L'attaque en méta l'évite : c'est la moins défavorisée. La 2e étape est lente (cycle désactivé)." :
        "Un doublet du brome stabilise la charge + du complexe σ quand l'attaque a lieu en ortho ou en para (forme limite avec Br⁺=C). Le para domine (moins encombré) ; l'ortho et le para se séparent ensuite (le para, plus symétrique, cristallise mieux).";
      nt.set(msg + " <i>Pourcentages : ordres de grandeur pour la nitration du bromobenzène ; géométrie idéalisée.</i>", "ok");
    });
  }
});
})();
