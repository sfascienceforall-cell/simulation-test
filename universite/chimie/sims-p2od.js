/* Chimie BA1 · chimie organique (lot P2-OD) : tautomérie céto-énolique, tests de Tollens et de Fehling, savon et micelle, basicité des amines
   Simulations SFA originales. La 3D est dessinée à la main sur un canevas 2D (projection perspective), sans bibliothèque. */
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
function dist(a, b){ return len(sub(a, b)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function lerp3(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }
function ease(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function rotAx(v, k, ang){ k = nrm(k); var c = Math.cos(ang), s = Math.sin(ang); return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c))); }
function perpTo(u){ var r = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]; return nrm(cross(u, r)); }
function slerpD(a, b, t){
  a = nrm(a); b = nrm(b);
  var d = clamp(dot(a, b), -1, 1), om = Math.acos(d);
  if (om < 1e-4) return a;
  if (PI - om < 1e-3) return rotAx(a, perpTo(a), om * t);
  var so = Math.sin(om);
  return add(mul(a, Math.sin((1 - t) * om) / so), mul(b, Math.sin(t * om) / so));
}
function angDeg(u, w){ return Math.acos(clamp(dot(nrm(u), nrm(w)), -1, 1)) / DEG; }
/* trois directions qui complètent un tétraèdre autour d'un atome dont une liaison pointe selon u */
function tetra3(u, ref, ph){
  u = nrm(u);
  var e1 = ref ? sub(ref, mul(u, dot(ref, u))) : null;
  if (!e1 || len(e1) < 1e-3) e1 = perpTo(u);
  e1 = nrm(e1); var e2 = cross(u, e1), out = [];
  for (var q = 0; q < 3; q++){ var p = (ph || 0) + q * 2 * PI / 3; out.push(add(mul(u, -1 / 3), mul(add(mul(e1, Math.cos(p)), mul(e2, Math.sin(p))), Math.sqrt(8) / 3))); }
  return out;
}
/* deux directions sp³ restantes quand deux liaisons (u1, u2) sont posées ; rangées : la 1re du côté de « side » */
function sp3pair(u1, u2, side){
  var d = nrm(mul(add(nrm(u1), nrm(u2)), -1)), n = cross(u1, u2), h = 54.75 * DEG;
  if (len(n) < 1e-4) n = perpTo(u1);
  n = nrm(n); if (side && dot(n, side) < 0) n = mul(n, -1);
  return [nrm(add(mul(d, Math.cos(h)), mul(n, Math.sin(h)))), nrm(add(mul(d, Math.cos(h)), mul(n, -Math.sin(h))))];
}
/* deux directions sp² restantes autour d'une liaison double de direction d, dans le plan qui contient « side » ; la 1re du côté de « side » */
function sp2pair(d, side){
  d = nrm(d); var w = sub(side, mul(d, dot(side, d)));
  w = len(w) < 1e-4 ? perpTo(d) : nrm(w);
  return [nrm(add(mul(d, -0.5), mul(w, 0.866))), nrm(add(mul(d, -0.5), mul(w, -0.866)))];
}
/* configuration R/S : v1, v2, v3 = vecteurs vers les priorités 1, 2, 3 (la 4e quelconque) */
function cipRS(c, p1, p2, p3){ var a = sub(p1, c), b = sub(p2, c), e = sub(p3, c); return dot(a, cross(b, e)) < 0 ? "R" : "S"; }

/* ---------- rendu ---------- */
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function rgba(hex, a){ var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
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
/* glisser = tourner la vue ; hit(type, p) peut intercepter le geste (renvoie true) */
function dragView(c, st, hit){
  var mine = false;
  c.cv.style.touchAction = "none";
  c.pointer(function(type, p){
    if (type === "down"){ mine = !(hit && hit("down", p)); if (mine){ st.lx = p.x; st.ly = p.y; st.drag = true; } return; }
    if (!mine){ if (hit) hit(type, p); return; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, -1.45, 1.45); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; st.drag = false; mine = false; }
  });
}
function respCanvas(k, rDesk, rPhone, h){
  var c = k.canvas(h || 0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function label(ctx, s, x, y, o){
  o = o || {}; var size = o.size || 12;
  ctx.save(); ctx.font = (o.weight || 700) + " " + size + "px " + FONT; ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle";
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.bg){
    var w = ctx.measureText(s).width + 12, h = size + 8, bx = ctx.textAlign === "left" ? x - 6 : ctx.textAlign === "right" ? x - w + 6 : x - w / 2;
    ctx.fillStyle = o.bg; rr(ctx, bx, y - h / 2, w, h, 7); ctx.fill();
    if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  ctx.fillStyle = o.col || "#2c3a4e"; ctx.fillText(s, x, y); ctx.restore();
}
/* texte sur une ou deux lignes dans une largeur donnée ; renvoie le nombre de lignes */
function wrapLabel(ctx, s, x, y, maxW, o){
  o = o || {}; var size = o.size || 12; ctx.save(); ctx.font = (o.weight || 700) + " " + size + "px " + FONT;
  var words = s.split(" "), lines = [], cur = "";
  words.forEach(function(w){ var tst = cur ? cur + " " + w : w; if (ctx.measureText(tst).width > maxW - 12 && cur){ lines.push(cur); cur = w; } else cur = tst; });
  if (cur) lines.push(cur); ctx.restore();
  lines.forEach(function(L, i){ label(ctx, L, x, y + i * (size + 9), o); });
  return lines.length;
}
function fitSize(ctx, s, maxW, size, weight){ var z = size; ctx.font = (weight || 700) + " " + z + "px " + FONT; while (z > 10 && ctx.measureText(s).width > maxW){ z -= 0.5; ctx.font = (weight || 700) + " " + z + "px " + FONT; } return z; }
function badge(ctx, x, y, t, col, a, r){
  if (a != null && a < 0.03) return;
  r = r || 8.5;
  ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = "#fff"; ctx.strokeStyle = col; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.font = "800 " + Math.round(r * 1.5) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 0.5); ctx.restore();
}
/* flèche courbe du mécanisme (mouvement d'un doublet) */
function curly(ctx, x0, y0, x1, y1, bend, col, alpha){
  if (!(alpha > 0.03)) return;
  var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, cx = mx - dy / L * bend, cy = my + dx / L * bend;
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.6; ctx.lineCap = "round";
  ctx.shadowColor = "rgba(255,255,255,.9)"; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke();
  var ang = Math.atan2(y1 - cy, x1 - cx);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 12 * Math.cos(ang - 0.42), y1 - 12 * Math.sin(ang - 0.42)); ctx.lineTo(x1 - 12 * Math.cos(ang + 0.42), y1 - 12 * Math.sin(ang + 0.42)); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function trim(p, q, r0, r1){
  var dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
  return [p.x + dx / L * r0, p.y + dy / L * r0, q.x - dx / L * r1, q.y - dy / L * r1];
}
var EL = {C:["#4a5568", 0.40], H:["#e8edf3", 0.25], O:["#d6392f", 0.42], N:["#2f5fd0", 0.41], S:["#d9a520", 0.52], B:["#e39a8f", 0.44], Na:["#8a63d2", 0.50]};
function At(el, p, o){ var a = {el:el, p:p, col:EL[el][0], r:EL[el][1], alpha:1}; if (o) for (var q in o) a[q] = o[q]; return a; }
function bondDraw(ctx, p, q, b, sc, al){
  var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, ox = -dy / l, oy = dx / l;
  var w = Math.max(2.2, sc * 0.09) * ((p.s + q.s) / 2) * (b.w || 1);
  if (b.hb){   /* liaison hydrogène : petits points */
    ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = b.col || "#2a8f5a"; ctx.lineWidth = Math.max(2, w * 0.55); ctx.lineCap = "round"; ctx.setLineDash([0.1, w * 1.6]);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore(); return;
  }
  var o = b.o || 1, offs = o === 2 || o === 1.5 ? [-w * 0.85, w * 0.85] : o === 3 ? [-w * 1.35, 0, w * 1.35] : [0], lw = o === 1 ? w : w * 0.6;
  ctx.save(); ctx.globalAlpha = al; ctx.lineCap = "round";
  offs.forEach(function(of, ix){
    var x0 = p.x + ox * of, y0 = p.y + oy * of, x1 = q.x + ox * of, y1 = q.y + oy * of;
    ctx.setLineDash(b.dash || (o === 1.5 && ix === 1) ? [lw * 1.5, lw * 1.3] : []);
    ctx.strokeStyle = b.col || "#7d8a9b"; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (!b.dash){ ctx.strokeStyle = "rgba(255,255,255,.38)"; ctx.lineWidth = lw * 0.32; ctx.beginPath(); ctx.moveTo(x0 - ox * lw * 0.2, y0 - oy * lw * 0.2); ctx.lineTo(x1 - ox * lw * 0.2, y1 - oy * lw * 0.2); ctx.stroke(); }
  });
  ctx.restore();
}
/* scène 3D : atomes {el,p,col,r,alpha,lab,glow,badge,badgeCol,badgeA}, liaisons {a,b,o,alpha,dash,col}, extra : [{z,f}] */
function drawScene(c, V, atoms, bonds, extra){
  var ctx = c.ctx, items = (extra || []).slice();
  var pr = atoms.map(function(a){ return proj3(a.p, V.st, V.sc, V.cx, V.cy); });
  atoms.forEach(function(a, i){ pr[i].r = Math.max(a.el === "H" ? 3.2 : 5, a.r * V.sc * 0.8 * pr[i].s); });
  bonds.forEach(function(b){
    var A1 = atoms[b.a], B1 = atoms[b.b], p = pr[b.a], q = pr[b.b];
    var al = (b.alpha == null ? 1 : b.alpha) * Math.min(A1.alpha, B1.alpha); if (al < 0.03) return;
    items.push({z:(p.z + q.z) / 2 - 0.05, f:function(){ bondDraw(ctx, p, q, b, V.sc, al); }});
  });
  atoms.forEach(function(a, i){
    if (a.alpha < 0.03) return;
    var p = pr[i], r = p.r;
    items.push({z:p.z, f:function(){
      if (a.glow){ var g = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 2.8); g.addColorStop(0, a.glow); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.8, 0, 7); ctx.fill(); }
      ball(ctx, p.x, p.y, r, a.col, a.alpha);
      if (a.ring){ ctx.save(); ctx.globalAlpha = a.alpha; ctx.strokeStyle = a.ring; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, r + 3, 0, 7); ctx.stroke(); ctx.restore(); }
      if (a.lab && r > 7.5){
        ctx.save(); ctx.globalAlpha = a.alpha; ctx.font = "800 " + Math.round(clamp(r * 0.9, 9, 15)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(a.lab, p.x, p.y); ctx.fillStyle = "#fff"; ctx.fillText(a.lab, p.x, p.y); ctx.restore();
      }
      if (a.badge) badge(ctx, p.x + r * 0.85, p.y - r * 0.85, a.badge, a.badgeCol || "#c0392b", (a.badgeA == null ? 1 : a.badgeA) * a.alpha, 8);
    }});
  });
  items.sort(function(x, y){ return x.z - y.z; });
  items.forEach(function(it){ it.f(); });
  return pr;
}
/* lobe d'orbitale (ellipsoïde vu en projection) : base et direction en 3D, longueur L et demi-largeur w en Å */
function lobeItem(ctx, V, base, dir, L, w, col, alpha, z0){
  var P0 = proj3(base, V.st, V.sc, V.cx, V.cy), P1 = proj3(add(base, mul(dir, L)), V.st, V.sc, V.cx, V.cy), Pm = proj3(add(base, mul(dir, L * 0.55)), V.st, V.sc, V.cx, V.cy);
  return {z:Pm.z + (z0 || 0), f:function(){
    if (alpha < 0.02) return;
    var ax = P1.x - P0.x, ay = P1.y - P0.y, la = Math.hypot(ax, ay), ww = w * V.sc * Pm.s, a = Math.max(la * 0.52, ww), an = Math.atan2(ay, ax);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(P0.x + ax * 0.55, P0.y + ay * 0.55); ctx.rotate(an);
    var g = ctx.createRadialGradient(-a * 0.25, -ww * 0.35, ww * 0.1, 0, 0, Math.max(a, ww) * 1.05);
    g.addColorStop(0, shade(col, 0.6)); g.addColorStop(0.55, col); g.addColorStop(1, shade(col, -0.35));
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, a, ww, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = shade(col, -0.45); ctx.globalAlpha = alpha * 0.5; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  }};
}
/* nuage diffus (somme de taches floues) le long d'une courbe 3D */
function cloudItems(ctx, V, pts, rad, col, alpha, zOff){
  return pts.map(function(P3){
    var P = proj3(P3, V.st, V.sc, V.cx, V.cy), R = rad * V.sc * P.s;
    return {z:P.z + (zOff || 0), f:function(){
      if (alpha < 0.02) return;
      var g = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, R);
      g.addColorStop(0, rgba(col, 0.30 * alpha)); g.addColorStop(0.6, rgba(col, 0.14 * alpha)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, R, 0, 7); ctx.fill();
    }};
  });
}
function bgScene(ctx, W, H, c0, c1){
  var bg = ctx.createRadialGradient(W * 0.5, H * 0.42, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  bg.addColorStop(0, c0 || "#ffffff"); bg.addColorStop(1, c1 || "#e3e9f3"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}
function seeded(n, seed){ var sd = seed || 7, out = []; function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; } for (var i = 0; i < n; i++) out.push({x:rnd(), y:rnd(), r:rnd() * 6.28, k:rnd()}); return out; }
/* petites molécules de solvant qui dérivent en fond (eau, méthanol…) */
function solvent(ctx, box, list, t, alpha, kind){
  ctx.save(); ctx.globalAlpha = alpha || 0.14;
  list.forEach(function(m){
    var x = box.x + (m.x + 0.012 * Math.sin(t * 0.4 + m.r * 5)) * box.w, y = box.y + (m.y + 0.012 * Math.cos(t * 0.33 + m.r * 7)) * box.h;
    ctx.save(); ctx.translate(x, y); ctx.rotate(m.r + t * 0.1);
    if (kind === "meoh"){ ctx.fillStyle = "#4a5568"; ctx.beginPath(); ctx.arc(-6, 0, 5.5, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#d6392f"; ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, 7); ctx.fill();
    ctx.fillStyle = "#9aa6b6"; ctx.beginPath(); ctx.arc(5.5, 4.5, 3.3, 0, 7); if (kind !== "meoh") ctx.arc(-5.5, 4.5, 3.3, 0, 7); ctx.fill(); ctx.restore();
  });
  ctx.restore();
}
function plotFrame(c, o){
  var ctx = c.ctx, ax = {L:o.l || 40, R:c.W - (o.r || 14), T:o.t || 22, B:c.H - (o.b || 26)};
  ax.X = function(x){ return ax.L + (x - o.x0) / (o.x1 - o.x0) * (ax.R - ax.L); };
  ax.Y = function(y){ return ax.B - (y - o.y0) / (o.y1 - o.y0) * (ax.B - ax.T); };
  ctx.save(); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, c.W, c.H); ctx.restore();
  return ax;
}
var MA = {C:12.011, H:1.008, N:14.007, O:15.999, S:32.06};
function molM(el){ var m = 0; for (var q in el) m += el[q] * MA[q]; return m; }
function F(x, d){ x += (x < 0 ? -1 : 1) * 1e-9; var s = (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d); return s.replace("-", "−").replace(".", ","); }
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function fBrute(el){ var s = ""; ["C", "H", "N", "O", "S"].forEach(function(e){ var n = el[e]; if (n) s += e + (n > 1 ? String(n).split("").map(function(d){ return SUBD[+d]; }).join("") : ""); }); return s; }

/* ---------- décor de laboratoire (verrerie en volume) ---------- */
/* ballon à fond rond : centre de la panse (x, y), rayon R ; o : {liq, level, t, bath, bathCol, bubbles, neck} */
function flask(ctx, x, y, R, o){
  o = o || {}; var t = o.t || 0;
  ctx.save();
  if (o.bath){   /* vase Dewar (bain réfrigérant) */
    var bw = R * 2.9, bh = R * 2.1, bx = x - bw / 2, by = y - R * 0.35;
    var gb = ctx.createLinearGradient(bx, 0, bx + bw, 0); gb.addColorStop(0, "#8d99a8"); gb.addColorStop(0.18, "#e9eef4"); gb.addColorStop(0.5, "#b9c4d1"); gb.addColorStop(0.85, "#eef2f6"); gb.addColorStop(1, "#7f8b9a");
    ctx.fillStyle = gb; rr(ctx, bx, by, bw, bh, [4, 4, R * 0.5, R * 0.5]); ctx.fill();
    ctx.fillStyle = o.bathCol || "rgba(214,228,245,.95)"; rr(ctx, bx + 5, by + 6, bw - 10, bh - 12, [3, 3, R * 0.45, R * 0.45]); ctx.fill();
    /* fumée de carboglace */
    for (var f = 0; f < 5; f++){
      var fx = bx + bw * (0.15 + 0.17 * f) + 4 * Math.sin(t * 0.7 + f), fy = by - 4 - 10 * ((t * 0.25 + f * 0.21) % 1);
      var gf = ctx.createRadialGradient(fx, fy, 1, fx, fy, R * 0.45); gf.addColorStop(0, "rgba(255,255,255,.75)"); gf.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gf; ctx.beginPath(); ctx.arc(fx, fy, R * 0.45, 0, 7); ctx.fill();
    }
    /* morceaux de glace carbonique */
    ctx.fillStyle = "rgba(255,255,255,.85)";
    for (f = 0; f < 7; f++){ ctx.beginPath(); ctx.arc(bx + 12 + f * (bw - 24) / 6, by + bh * 0.55 + 5 * Math.sin(f * 2.3), R * 0.11, 0, 7); ctx.fill(); }
  }
  /* col */
  var nw = R * 0.36, nh = R * 1.25;
  var gn = ctx.createLinearGradient(x - nw / 2, 0, x + nw / 2, 0); gn.addColorStop(0, "rgba(160,185,210,.55)"); gn.addColorStop(0.35, "rgba(255,255,255,.75)"); gn.addColorStop(1, "rgba(140,165,195,.55)");
  ctx.fillStyle = gn; ctx.fillRect(x - nw / 2, y - R * 0.92 - nh, nw, nh);
  ctx.strokeStyle = "rgba(90,110,135,.75)"; ctx.lineWidth = 1.4; ctx.strokeRect(x - nw / 2, y - R * 0.92 - nh, nw, nh);
  /* panse : liquide puis verre */
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.clip();
  var lvl = y + R - 2 * R * (o.level == null ? 0.55 : o.level);
  var gl = ctx.createLinearGradient(0, lvl, 0, y + R); gl.addColorStop(0, rgba(o.liq || "#dfe9f5", 0.75)); gl.addColorStop(1, rgba(o.liq || "#dfe9f5", 0.98));
  ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(x - R, lvl);
  for (var q = 0; q <= 20; q++) ctx.lineTo(x - R + q * R / 10, lvl + 1.5 * Math.sin(t * 2 + q * 0.9));
  ctx.lineTo(x + R, y + R); ctx.lineTo(x - R, y + R); ctx.fill();
  if (o.bubbles){
    for (q = 0; q < 9; q++){
      var ph = (t * 0.9 + q * 0.37) % 1, bx2 = x + (q % 3 - 1) * R * 0.12 + 3 * Math.sin(t * 3 + q), by2 = y + R * 0.7 - ph * (y + R * 0.7 - lvl);
      ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.fillStyle = rgba(o.bubbleCol || "#cfe0ff", 0.55); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(bx2, by2, 1.5 + 2.2 * (1 - ph), 0, 7); ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
  var gg = ctx.createRadialGradient(x - R * 0.4, y - R * 0.45, R * 0.05, x, y, R * 1.05);
  gg.addColorStop(0, "rgba(255,255,255,.55)"); gg.addColorStop(0.5, "rgba(255,255,255,.06)"); gg.addColorStop(1, "rgba(120,150,185,.35)");
  ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
  ctx.strokeStyle = "rgba(90,110,135,.8)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, R, -PI / 2 + 0.19, 3 * PI / 2 - 0.19); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, R * 0.8, PI * 1.1, PI * 1.35); ctx.stroke();
  ctx.restore();
}
/* loupe : cadre arrondi qui « grossit » un point du ballon */
function loupe(ctx, box, from, col){
  ctx.save();
  ctx.fillStyle = rgba(col || "#3b6ec2", 0.07);
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(box.x, box.y + 14); ctx.lineTo(box.x, box.y + box.h - 14); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(col || "#3b6ec2", 0.35); ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(box.x, box.y + 14); ctx.moveTo(from[0], from[1]); ctx.lineTo(box.x, box.y + box.h - 14); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(from[0], from[1], 5, 0, 7); ctx.strokeStyle = rgba(col || "#3b6ec2", 0.8); ctx.lineWidth = 1.6; ctx.stroke();
  ctx.restore();
}
function loupeFrame(ctx, box, c0, c1){
  ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
  rr(ctx, box.x, box.y, box.w, box.h, 18);
  var g = ctx.createRadialGradient(box.x + box.w * 0.5, box.y + box.h * 0.42, 10, box.x + box.w * 0.5, box.y + box.h * 0.5, Math.max(box.w, box.h) * 0.75);
  g.addColorStop(0, c0 || "#ffffff"); g.addColorStop(1, c1 || "#e6edf6"); ctx.fillStyle = g; ctx.fill();
  ctx.shadowColor = "transparent"; ctx.strokeStyle = "rgba(120,140,165,.55)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}
function clipBox(ctx, box){ ctx.save(); rr(ctx, box.x, box.y, box.w, box.h, 18); ctx.clip(); }

/* ---------- aides propres au lot P2-OD ---------- */
var SUPD = {"-":"⁻", "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹"};
/* écriture scientifique à la belge : 5·10⁻⁹ (d chiffres après la virgule pour la mantisse) */
function sci(x, d){
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.995 && (d || 0) <= 2){ m /= 10; e += 1; }
  var ms = F(m, d == null ? 1 : d);
  if (/^1(,0+)?$/.test(ms)) ms = "";
  var es = String(e).split("").map(function(ch){ return SUPD[ch]; }).join("");
  return (ms ? ms + "·" : "") + "10" + es;
}
/* nombre « intelligent » : décimal si lisible, sinon scientifique */
function num(x, d){ var a = Math.abs(x); if (a !== 0 && (a < 0.01 || a >= 1e5)) return sci(x, 1); return F(x, d == null ? 2 : d); }
/* dégradé vertical de paillasse (sol du laboratoire) */
function bench(ctx, W, y, H){
  var g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, "#56606d"); g.addColorStop(0.08, "#3a424d"); g.addColorStop(1, "#272d35");
  ctx.fillStyle = g; ctx.fillRect(0, y, W, H - y);
  ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, y, W, 2);
}
/* mur carrelé du laboratoire */
function labWall(ctx, W, H, c0, c1){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0 || "#eef3f8"); g.addColorStop(1, c1 || "#dde5ee"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 1;
  for (var y = 22; y < H; y += 26){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (var r = 0, yy = 0; yy < H; yy += 26, r++){ for (var x = (r % 2) * 20; x < W; x += 40){ ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + 26); ctx.stroke(); } }
  ctx.restore();
}
/* point projeté d'une cible de flèche : indice d'atome ou [i, j] (milieu de liaison) */
function tgtPt(pr, s){ if (Array.isArray(s)) return {x:(pr[s[0]].x + pr[s[1]].x) / 2, y:(pr[s[0]].y + pr[s[1]].y) / 2, r:3}; return {x:pr[s].x, y:pr[s].y, r:pr[s].r || 6}; }
function drawArrows(ctx, pr, list, alpha, col){
  if (!list || alpha < 0.03) return;
  list.forEach(function(A){
    var p = tgtPt(pr, A.a), q = tgtPt(pr, A.b), dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
    var r0 = Array.isArray(A.a) ? 2 : p.r + 3, r1 = Array.isArray(A.b) ? 2 : q.r + 4;
    curly(ctx, p.x + dx / L * r0, p.y + dy / L * r0, q.x - dx / L * r1, q.y - dy / L * r1, A.bend || 26, col || "#13233a", alpha);
  });
}
/* images clés : interpolation des positions, des opacités, des liaisons et des charges entre deux images */
function bkey(b){ return b[0] < b[1] ? b[0] + "-" + b[1] : b[1] + "-" + b[0]; }
function kfMix(A, B, u){
  var P = A.P.map(function(p, i){ return lerp3(p, B.P[i], u); });
  var al = A.A.map(function(a, i){ return lerp(a, B.A[i], u); });
  var bonds = [], seen = {}, mA = {}, mB = {};
  A.B.forEach(function(b){ mA[bkey(b)] = b; }); B.B.forEach(function(b){ mB[bkey(b)] = b; });
  Object.keys(mA).concat(Object.keys(mB)).forEach(function(k){
    if (seen[k]) return; seen[k] = 1;
    var a = mA[k], b = mB[k], x = a || b;
    if (a && b){
      var same = (a[2] || 1) === (b[2] || 1) && !!a[3] === !!b[3];
      if (same) bonds.push({a:x[0], b:x[1], o:x[2] || 1, hb:!!x[3]});
      else bonds.push({a:x[0], b:x[1], o:u < 0.5 ? (a[2] || 1) : (b[2] || 1), hb:u < 0.5 ? !!a[3] : !!b[3], dash:u > 0.04 && u < 0.96});
    } else if (a) bonds.push({a:a[0], b:a[1], o:a[2] || 1, hb:!!a[3], dash:u > 0.04, alpha:1 - u});
    else bonds.push({a:b[0], b:b[1], o:b[2] || 1, hb:!!b[3], dash:u < 0.96, alpha:u});
  });
  var badges = {};
  [[A.bdg || {}, 1 - u], [B.bdg || {}, u]].forEach(function(L){ Object.keys(L[0]).forEach(function(i){ var s = L[0][i]; if (!badges[i]) badges[i] = {t:s, a:0}; if (badges[i].t === s) badges[i].a += L[1]; else if (L[1] > 0.5){ badges[i] = {t:s, a:L[1]}; } }); });
  var glow = {};
  [[A.glw || {}, 1 - u], [B.glw || {}, u]].forEach(function(L){ Object.keys(L[0]).forEach(function(i){ glow[i] = (glow[i] || 0) + L[1]; }); });
  return {P:P, A:al, bonds:bonds, badges:badges, glow:glow};
}
function floorShadow(ctx, x, y, rx, ry, a){
  ctx.save(); var g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, "rgba(15,27,45," + (a || 0.16) + ")"); g.addColorStop(1, "rgba(15,27,45,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore();
}
/* bandeau en bas de scène : titre + sous-titre sur deux lignes au plus (la police se réduit si nécessaire) */
function bannerBox(ctx, W, by, bh, title, sub2, col, ph){
  ctx.save(); ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.strokeStyle = "#d9e0ea"; rr(ctx, 8, by, W - 16, bh, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col || "#2a6fdb"; ctx.fillRect(8, by + 10, 4, bh - 20); ctx.restore();
  var tz = fitSize(ctx, title, W - 40, ph ? 14 : 16, 800), tl = [title];
  ctx.save(); ctx.font = "800 " + tz + "px " + FONT; var tooW = ctx.measureText(title).width > W - 40 || (tz < 12 && title.indexOf(" → ") > 0); ctx.restore();
  if (tooW){
    var cut = title.indexOf(" → ");
    tl = cut > 0 ? [title.slice(0, cut) + " →", title.slice(cut + 3)] : (function(){ ctx.save(); ctx.font = "800 12px " + FONT; var L = wrapLines(ctx, title, W - 40).slice(0, 2); ctx.restore(); return L; })();
    tz = Math.min.apply(null, tl.map(function(L){ return fitSize(ctx, L, W - 40, ph ? 13 : 15, 800); }));
  }
  var z = ph ? 11 : 12, lines;
  for (;;){ ctx.save(); ctx.font = "700 " + z + "px " + FONT; lines = wrapLines(ctx, sub2 || "", W - 40); ctx.restore(); if (lines.length <= 2 || z <= 9.5) break; z -= 0.5; }
  lines = lines.slice(0, 2);
  var th = tl.length * (tz + 3), tot = th + 3 + lines.length * (z + 3), y0 = by + (bh - tot) / 2;
  tl.forEach(function(L, i){ label(ctx, L, W / 2, y0 + (tz + 3) * (i + 0.5), {size:tz, weight:800, col:"#13233a"}); });
  lines.forEach(function(L, i){ label(ctx, L, W / 2, y0 + th + 3 + (z + 3) * (i + 0.5), {size:z, weight:700, col:"#5f6b7a"}); });
}
function wrapLines(ctx, s, maxW){
  var words = String(s).split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
/* hasard reproductible (positions des particules) */
function hrand(i, seed){ var x = Math.sin(i * 127.1 + (seed || 0) * 311.7) * 43758.5453; return x - Math.floor(x); }
function scatter(n, seed){ var out = []; for (var i = 0; i < n; i++) out.push({x:hrand(i, seed), y:hrand(i + 500, seed), r:hrand(i + 900, seed) * 6.28, k:hrand(i + 1300, seed)}); return out; }
/* répartition régulière avec un peu de désordre (grille + décalage) */
function gridScatter(n, cols, seed){ var rows = Math.ceil(n / cols), out = []; for (var i = 0; i < n; i++){ var cx = i % cols, cy = Math.floor(i / cols); out.push({x:(cx + 0.2 + 0.6 * hrand(i, seed)) / cols, y:(cy + 0.2 + 0.6 * hrand(i + 77, seed)) / rows, r:hrand(i + 900, seed) * 6.28, k:hrand(i + 1300, seed)}); }
  for (var j = out.length - 1; j > 0; j--){ var q = Math.floor(hrand(j + 2000, seed) * (j + 1)), tmp = out[j]; out[j] = out[q]; out[q] = tmp; } return out; }

/* ====================================================================== */
/* 1. Tautomérie céto-énolique : mécanismes acide et basique, β-dicétone   */
/* ====================================================================== */
var TAU_RT = 8.314 * 298.15 / 1000;   /* kJ/mol */
/* % d'énol à l'équilibre, 25 °C (RMN, ordres de grandeur de la littérature) */
var TAU_DATA = [
  {k:"prop-eau", mol:"prop", solv:"eau", nom:"propanone · eau", K:5e-9},
  {k:"acac-eau", mol:"acac", solv:"eau", nom:"dione · eau", pc:15},
  {k:"acac-dmso", mol:"acac", solv:"dmso", nom:"dione · DMSO", pc:62},
  {k:"acac-pur", mol:"acac", solv:"pur", nom:"dione · liquide pur", pc:80},
  {k:"acac-cyc", mol:"acac", solv:"cyc", nom:"dione · cyclohexane", pc:95}
];
TAU_DATA.forEach(function(d){ if (d.K == null) d.K = d.pc / (100 - d.pc); d.f = d.K / (1 + d.K); d.dG = -TAU_RT * Math.log(d.K); });
var TAU_SOLV = {eau:{n:"eau", d:"dans l'eau", liq:"#cfe3f6"}, dmso:{n:"DMSO", d:"dans le DMSO", liq:"#e6e9f2"}, pur:{n:"liquide pur", d:"liquide pur, sans solvant", liq:"#f3e7b8"}, cyc:{n:"cyclohexane", d:"dans le cyclohexane", liq:"#eef3f6"}};

/* géométries (Å) : K cétone, P cétone protonée, N énolate, E énol ; mêmes indices d'atomes partout */
function tauGeo(kind){
  var g = {}, K, E, N, P, els, i;
  if (kind === "prop"){
    /* 0 Cα, 1 C=O, 2 CH3, 3 O, 4 H (plan), 5 H (−z), 6 Hα (+z), 7-9 H du méthyle */
    var Cc = [0, 0, 0], C3 = [1.308, -0.755, 0], CaK = [-1.308, -0.755, 0], CaE = [-1.160, -0.670, 0], CaN = [-1.215, -0.700, 0];
    var u = nrm(sub(Cc, CaK)), tk = tetra3(u, cross(u, [0, 0, 1])), dz = tk[1][2] > 0 ? [tk[1], tk[2]] : [tk[2], tk[1]];
    var u3 = nrm(sub(Cc, C3)), t3 = tetra3(u3, cross([0, 0, 1], u3));
    var H3 = t3.map(function(d){ return add(C3, mul(d, 1.09)); });
    var sp2H = function(Ca){ return [add(Ca, [0, -1.08, 0]), add(Ca, mul([-0.866, 0.5, 0], 1.08))]; };
    K = [CaK, Cc, C3, [0, 1.22, 0], add(CaK, mul(tk[0], 1.09)), add(CaK, mul(dz[1], 1.09)), add(CaK, mul(dz[0], 1.09))].concat(H3);
    P = K.map(function(p){ return p.slice(); }); P[3] = [0, 1.27, 0];
    var hE = sp2H(CaE), hN = sp2H(CaN);
    E = [CaE, Cc, C3, [0, 1.36, 0], hE[0], hE[1], K[6]].concat(H3);
    N = [CaN, Cc, C3, [0, 1.28, 0], hN[0], hN[1], K[6]].concat(H3);
    els = ["C", "C", "C", "O", "H", "H", "H", "H", "H", "H"];
    g = {n:10, iCa:0, iCc:1, iO:3, iHa:6, dA:dz[0], dirH:[-0.9455, 0.3256, 0], dS:nrm([-0.75, 0.55, 0.55]), ctr:[-0.75, 0.3, 0], R:3.9, a0:-0.3,
      bK:[[0, 1], [1, 2], [1, 3, 2], [0, 4], [0, 5], [0, 6], [2, 7], [2, 8], [2, 9]],
      bN:[[0, 1, 1.5], [1, 2], [1, 3, 1.5], [0, 4], [0, 5], [2, 7], [2, 8], [2, 9]],
      bE:[[0, 1, 2], [1, 2], [1, 3], [0, 4], [0, 5], [2, 7], [2, 8], [2, 9]], hb:null, glowN:[3, 0]};
  } else {
    /* 0 CH3, 1 C2, 2 C3 (α), 3 C4, 4 CH3, 5 O2, 6 O4, 7 Hα (+z), 8 Hβ, 9-11 et 12-14 H des méthyles */
    var C2 = [-1.21, 0.45, 0], C4 = [1.21, 0.45, 0], C1 = [-2.509, -0.30, 0], C5 = [2.509, -0.30, 0];
    var O2E = [-1.25, 1.75, 0], O4E = [1.25, 1.75, 0], C3E = [0, -0.25, 0], C3K = [0, -0.42, 0];
    var O2K = add(C2, mul(nrm(sub(O2E, C2)), 1.22)), O4K = add(C4, mul(nrm(sub(O4E, C4)), 1.22));
    var pr = sp3pair(sub(C2, C3K), sub(C4, C3K), [0, 0, 1]);
    var m1 = tetra3(nrm(sub(C2, C1)), [0, 0, 1]).map(function(d){ return add(C1, mul(d, 1.09)); });
    var m5 = tetra3(nrm(sub(C4, C5)), [0, 0, -1]).map(function(d){ return add(C5, mul(d, 1.09)); });
    K = [C1, C2, C3K, C4, C5, O2K, O4K, add(C3K, mul(pr[0], 1.09)), add(C3K, mul(pr[1], 1.09))].concat(m1, m5);
    P = K.map(function(p){ return p.slice(); }); P[5] = add(C2, mul(nrm(sub(O2E, C2)), 1.28));
    E = [C1, C2, C3E, C4, C5, O2E, [1.25, 1.70, 0], K[7], add(C3E, [0, -1.08, 0])].concat(m1, m5);
    N = [C1, C2, [0, -0.28, 0], C4, C5, add(C2, mul(nrm(sub(O2E, C2)), 1.27)), add(C4, mul(nrm(sub(O4E, C4)), 1.27)), K[7], add([0, -0.28, 0], [0, -1.08, 0])].concat(m1, m5);
    els = ["C", "C", "C", "C", "C", "O", "O", "H", "H", "H", "H", "H", "H", "H", "H"];
    var mb = [[0, 9], [0, 10], [0, 11], [4, 12], [4, 13], [4, 14]];
    g = {n:15, iCa:2, iCc:1, iO:5, iO4:6, iHa:7, dA:pr[0], dirH:nrm([0.98, 0.17, 0]), dS:nrm([-0.55, 0.75, 0.75]), ctr:[0, 0.05, 0], R:4.3, a0:0.35,
      bK:[[0, 1], [1, 2], [2, 3], [3, 4], [1, 5, 2], [3, 6, 2], [2, 7], [2, 8]].concat(mb),
      bN:[[0, 1], [1, 2, 1.5], [2, 3, 1.5], [3, 4], [1, 5, 1.5], [3, 6, 1.5], [2, 8]].concat(mb),
      bE:[[0, 1], [1, 2, 2], [2, 3], [3, 4], [1, 5], [3, 6, 2], [2, 8]].concat(mb), hb:true, glowN:[5, 6, 2]};
  }
  g.K = K; g.P = P; g.N = N; g.E = E; g.els = els.concat(["O", "H", "H", "H", "O", "H", "H"]);
  return g;
}
/* les 6 images clés du mécanisme ; W1 = n..n+3 (n+3 = H* qui finit sur O), W2 = n+4..n+6 */
function tauFrames(g, cat){
  var n = g.n, iO = g.iO, iCa = g.iCa, iCc = g.iCc, iHa = g.iHa, W1 = n, Hs = n + 3, W2 = n + 4;
  var dS = g.dS, dA = g.dA, dH = g.dirH, Ha0 = g.K[iHa], O0 = g.K[iO];
  function fr(geo){ var P = geo.map(function(p){ return p.slice(); }); for (var q = 0; q < 7; q++) P.push([0, 0, 0]); var A = P.map(function(){ return 1; }); return {P:P, A:A, B:[], bdg:{}, glw:{}}; }
  function water(F, o, Opos, d, a){ var t = tetra3(d, [0, 0, 1]); F.P[o] = Opos; F.P[o + 1] = add(Opos, mul(t[0], 0.97)); F.P[o + 2] = add(Opos, mul(t[1], 0.97)); [o, o + 1, o + 2].forEach(function(i){ F.A[i] = a; }); }
  function molB(F, L){ L.forEach(function(b){ F.B.push(b); }); }
  var fs = [], F;
  var Oat = function(geo){ return geo[iO]; };
  if (cat === "acide"){
    /* F0 : H3O+ approche de O */
    F = fr(g.K); water(F, W1, add(O0, mul(dS, 3.3)), mul(dS, -1), 1); F.P[Hs] = add(F.P[W1], mul(dS, -0.98));
    water(F, W2, add(Ha0, mul(dA, 4.6)), mul(dA, -1), 0); molB(F, g.bK); F.B.push([W1, W1 + 1], [W1, W1 + 2], [W1, Hs], [W2, W2 + 1], [W2, W2 + 2]); F.bdg[W1] = "+";
    F.t = "Cétone + H₃O⁺"; F.s = "Milieu acide : un ion oxonium H₃O⁺ approche de l'oxygène du C=O"; fs.push(F);
    /* F1 : contact, flèches */
    F = fr(g.K); water(F, W1, add(O0, mul(dS, 2.7)), mul(dS, -1), 1); F.P[Hs] = add(F.P[W1], mul(dS, -0.98));
    water(F, W2, add(Ha0, mul(dA, 4.6)), mul(dA, -1), 0); molB(F, g.bK); F.B.push([W1, W1 + 1], [W1, W1 + 2], [W1, Hs], [W2, W2 + 1], [W2, W2 + 2]); F.bdg[W1] = "+";
    F.arr = [{a:iO, b:Hs, bend:-28}, {a:[Hs, W1], b:W1, bend:24}];
    F.t = "Étape 1 : l'oxygène du C=O capte H⁺"; F.s = "Un doublet de O forme la liaison O–H ; la liaison H–O de H₃O⁺ se rompt"; fs.push(F);
    /* F2 : cétone protonée */
    F = fr(g.P); water(F, W1, add(O0, mul(dS, 3.1)), mul(dS, -1), 1); F.P[Hs] = add(Oat(g.P), mul(dH, 0.98));
    water(F, W2, add(Ha0, mul(dA, 4.6)), mul(dA, -1), 0); molB(F, g.bK); F.B.push([iO, Hs], [W1, W1 + 1], [W1, W1 + 2], [W2, W2 + 1], [W2, W2 + 2]); F.bdg[iO] = "+";
    F.t = "Cétone protonée (C=O⁺–H)"; F.s = "La charge + attire les électrons : la liaison C–H en α s'affaiblit"; fs.push(F);
    /* F3 : une molécule d'eau vient chercher Hα */
    F = fr(g.P); water(F, W1, add(O0, mul(dS, 5.4)), mul(dS, -1), 0); F.P[Hs] = add(Oat(g.P), mul(dH, 0.98));
    water(F, W2, add(Ha0, mul(dA, 1.8)), mul(dA, -1), 1); molB(F, g.bK); F.B.push([iO, Hs], [W1, W1 + 1], [W1, W1 + 2], [W2, W2 + 1], [W2, W2 + 2]); F.bdg[iO] = "+";
    F.arr = [{a:W2, b:iHa, bend:-26}, {a:[iCa, iHa], b:[iCa, iCc], bend:-30}, {a:[iCc, iO], b:iO, bend:-40}];
    F.t = "Étape 2 : l'eau arrache un H du carbone α"; F.s = "La liaison C–H devient la double liaison C=C ; le doublet π du C=O remonte sur O"; fs.push(F);
    /* F4 : énol + H3O+ */
    F = fr(g.E); water(F, W1, add(O0, mul(dS, 5.4)), mul(dS, -1), 0); F.P[Hs] = add(Oat(g.E), mul(dH, 0.98));
    water(F, W2, add(Ha0, mul(dA, 1.8)), mul(dA, -1), 1); F.P[iHa] = add(Ha0, mul(dA, 0.82));
    molB(F, g.bE); F.B.push([iO, Hs], [W1, W1 + 1], [W1, W1 + 2], [W2, W2 + 1], [W2, W2 + 2], [W2, iHa]); F.bdg[W2] = "+";
    if (g.hb) F.B.push([Hs, g.iO4, 1, true]);
    F.t = "Énol formé, H₃O⁺ régénéré"; F.s = "Bilan : un H est passé du carbone α à l'oxygène ; l'acide n'est pas consommé (catalyseur)"; fs.push(F);
  } else {
    /* F0 : HO− approche de Hα ; W1 (eau) loin */
    F = fr(g.K); water(F, W2, add(Ha0, mul(dA, 3.0)), mul(dA, -1), 1); F.A[W2 + 2] = 0;
    water(F, W1, add(O0, mul(dS, 5.4)), mul(dS, -1), 0); F.P[Hs] = add(F.P[W1], mul(dS, -0.98)); F.A[Hs] = 0;
    molB(F, g.bK); F.B.push([W2, W2 + 1], [W1, W1 + 1], [W1, Hs]); F.bdg[W2] = "−";
    F.t = "Cétone + HO⁻"; F.s = "Milieu basique : l'ion hydroxyde approche d'un H du carbone α"; fs.push(F);
    /* F1 : contact, flèches */
    F = fr(g.K); water(F, W2, add(Ha0, mul(dA, 1.8)), mul(dA, -1), 1); F.A[W2 + 2] = 0;
    water(F, W1, add(O0, mul(dS, 5.4)), mul(dS, -1), 0); F.P[Hs] = add(F.P[W1], mul(dS, -0.98)); F.A[Hs] = 0;
    molB(F, g.bK); F.B.push([W2, W2 + 1], [W1, W1 + 1], [W1, Hs]); F.bdg[W2] = "−";
    F.arr = [{a:W2, b:iHa, bend:-26}, {a:[iCa, iHa], b:[iCa, iCc], bend:-30}, {a:[iCc, iO], b:iO, bend:-40}];
    F.t = "Étape 1 : HO⁻ arrache un H du carbone α"; F.s = "La liaison C–H se rompt ; ses électrons forment C=C et repoussent le doublet π du C=O sur O"; fs.push(F);
    /* F2 : énolate */
    F = fr(g.N); water(F, W2, add(Ha0, mul(dA, 1.8)), mul(dA, -1), 1); F.A[W2 + 2] = 0; F.P[iHa] = add(Ha0, mul(dA, 0.82));
    water(F, W1, add(O0, mul(dS, 5.4)), mul(dS, -1), 0); F.P[Hs] = add(F.P[W1], mul(dS, -0.98)); F.A[Hs] = 0;
    molB(F, g.bN); F.B.push([W2, W2 + 1], [W2, iHa], [W1, W1 + 1], [W1, Hs]); F.bdg[iO] = "−"; g.glowN.forEach(function(i){ F.glw[i] = 1; });
    F.t = "Ion énolate"; F.s = "La charge − est délocalisée sur O et sur le carbone α (mésomérie) : c'est elle qui stabilise l'énolate"; fs.push(F);
    /* F3 : l'eau donne H+ à O */
    F = fr(g.N); water(F, W2, add(Ha0, mul(dA, 5.0)), mul(dA, -1), 0); F.A[W2 + 2] = 0; F.P[iHa] = add(Ha0, mul(dA, 4.0)); F.A[iHa] = 0;
    water(F, W1, add(O0, mul(dS, 2.7)), mul(dS, -1), 1); F.P[Hs] = add(F.P[W1], mul(dS, -0.98)); F.A[W1 + 2] = 0;
    molB(F, g.bN); F.B.push([W2, W2 + 1], [W2, iHa], [W1, W1 + 1], [W1, Hs]); F.bdg[iO] = "−"; g.glowN.forEach(function(i){ F.glw[i] = 1; });
    F.arr = [{a:iO, b:Hs, bend:-28}, {a:[Hs, W1], b:W1, bend:24}];
    F.t = "Étape 2 : l'énolate reprend H⁺ à l'eau, sur l'oxygène"; F.s = "Le doublet de O⁻ capte un H de l'eau ; HO⁻ est régénéré"; fs.push(F);
    /* F4 : énol + HO− */
    F = fr(g.E); water(F, W2, add(Ha0, mul(dA, 5.0)), mul(dA, -1), 0); F.A[W2 + 2] = 0; F.P[iHa] = add(Ha0, mul(dA, 4.0)); F.A[iHa] = 0;
    water(F, W1, add(O0, mul(dS, 3.1)), mul(dS, -1), 1); F.P[Hs] = add(Oat(g.E), mul(dH, 0.98)); F.A[W1 + 2] = 0;
    molB(F, g.bE); F.B.push([iO, Hs], [W2, W2 + 1], [W1, W1 + 1]); F.bdg[W1] = "−";
    if (g.hb) F.B.push([Hs, g.iO4, 1, true]);
    F.t = "Énol formé, HO⁻ régénéré"; F.s = "Bilan : un H est passé du carbone α à l'oxygène ; la base n'est pas consommée (catalyseur)"; fs.push(F);
  }
  /* F5 : le catalyseur s'éloigne ; l'énol reste */
  F = {P:fs[4].P.map(function(p){ return p.slice(); }), A:fs[4].A.slice(), B:fs[4].B.slice(), bdg:{}, glw:{}};
  for (var q = n; q < n + 7; q++){ F.P[q] = add(F.P[q], mul(q >= W2 ? dA : dS, 2.6)); F.A[q] = 0; }
  F.A[Hs] = 1; F.P[Hs] = fs[4].P[Hs];
  if (cat === "acide"){ F.P[iHa] = add(F.P[iHa], mul(dA, 2.6)); F.A[iHa] = 0; }
  F.t = "Énol"; F.s = g.hb ? "Énol de la dione : C=C conjuguée avec C=O et liaison H interne (cycle à 6 atomes)" : "Énol de la propanone (prop-1-én-2-ol) : il ne s'accumule pas"; fs.push(F);
  return fs;
}
SFA.sim({
  id:"org-tautomerie-ceto-enol", ch:"c10", tag:"Carbonyles",
  titre:"Tautomérie céto-énolique : le H qui change de place",
  resume:"Regarde en 3D, étape par étape, un H du carbone α passer sur l'oxygène, en milieu acide puis en milieu basique. Compare la propanone, presque sans énol, et la pentane-2,4-dione, dont l'énol domine en solvant apolaire.",
  but:"Choisis la molécule et le catalyseur (acide ou base) : le mécanisme se déroule au ralenti, avec les flèches courbes, puis repart en sens inverse. Le ballon montre la proportion d'énol à l'équilibre dans le solvant choisi. Glisse sur la loupe pour tourner la molécule, ou fais défiler les étapes avec le curseur.",
  aRetenir:"Un aldéhyde ou une cétone qui porte un H sur le carbone α est en équilibre avec son énol (C=C–OH) : c'est la tautomérie céto-énolique. En milieu acide, O est d'abord protoné, puis l'eau arrache le H en α. En milieu basique, HO⁻ arrache d'abord le H en α (ion énolate, charge délocalisée sur C et O), puis O est protoné. Pour une cétone simple, l'équilibre est presque entièrement du côté cétone (propanone : K ≈ 5·10⁻⁹ dans l'eau) : C=O + C–C + C–H valent plus que C=C + C–O + O–H. Pour une β-dicétone (pentane-2,4-dione), l'énol est stabilisé par la conjugaison C=C–C=O et par une liaison H interne : il devient majoritaire en solvant apolaire (≈ 95 % dans le cyclohexane) mais pas dans l'eau (≈ 15 %), qui forme ses propres liaisons H avec la forme cétone.",
  piege:"Tautomérie n'est pas mésomérie : entre la cétone et l'énol, un atome (H) change de place ; ce sont deux composés distincts en équilibre. Par contre, les deux écritures de l'énolate (charge sur O ou sur C) sont des formes mésomères d'un même ion. Et le catalyseur ne change pas la position de l'équilibre : il ne fait que l'atteindre plus vite.",
  build:function(k, S){
    var c = respCanvas(k, 0.9, 1.42), gC = k.canvas(150), st = {a:-0.3, b:0.22, t:0, man:false, play:true, tt:0, pos:null};
    dragView(c, st); st.onview = function(){ st.manual = true; };
    var mS = k.seg("Molécule", [["prop", "Propanone"], ["acac", "Pentane-2,4-dione"]], "prop", function(){ reset(); });
    var cS = k.seg("Catalyse", [["acide", "Acide (H₃O⁺)"], ["base", "Base (HO⁻)"]], "acide", function(){ reset(); });
    var sS = k.select("Solvant (pentane-2,4-dione)", [["eau", "Eau"], ["dmso", "DMSO (polaire, sans liaison H donneuse)"], ["pur", "Liquide pur"], ["cyc", "Cyclohexane (apolaire)"]], "cyc", function(){ popReset(); });
    var aS = k.slider("Étape (glisser = pause)", 0, 5, 0.01, 0, "", function(v){ st.play = false; st.pos = v; });
    k.button("Lecture / pause", function(){ st.play = !st.play; if (st.play){ st.pos = null; } else { st.pos = curPos(); aS.set(st.pos); } }, true);
    var spT = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["Énol à l'équilibre", "K = [énol]/[cétone]", "ΔG° (cétone → énol), 25 °C", "Étape"]);
    var nt = k.note("", "ok");
    var solvBox = sS.el.closest(".ctl");
    var geo = {}, frames = null, pop = [], popT = 0, flashes = [];
    function data(){ var m = mS.value; return m === "prop" ? TAU_DATA[0] : TAU_DATA.filter(function(d){ return d.mol === "acac" && d.solv === sS.value; })[0]; }
    function reset(){ geo[mS.value] = geo[mS.value] || tauGeo(mS.value); frames = tauFrames(geo[mS.value], cS.value); st.tt = 0; st.play = true; st.pos = null; aS.set(0); popReset(); }
    function popReset(){
      var d = data(), N = 36, nE = Math.round(N * d.f), r = seeded(N, 11);
      pop = r.map(function(m, i){ return {x:m.x, y:m.y, ph:m.r, e:false}; });
      var idx = pop.map(function(_, i){ return i; }).sort(function(a, b){ return seeded(1, a * 7 + 3)[0].x - seeded(1, b * 7 + 3)[0].x; });
      for (var q = 0; q < nE; q++) pop[idx[q]].e = true;
      flashes = [];
    }
    /* ligne du temps : aller (6 images, flèches avant chaque étape), retour sans flèches */
    function timeline(){
      var f = data().f, L = [], HOLD = [1.2, 1.9, 1.3, 1.9, 1.0], MV = 1.35, k2;
      for (k2 = 0; k2 < 5; k2++){ L.push({h:true, k:k2, d:HOLD[k2]}); L.push({h:false, k:k2, d:MV}); }
      L.push({h:true, k:5, d:1.4 + 5 * f});
      for (k2 = 4; k2 >= 0; k2--){ L.push({h:false, k:k2, d:0.85, back:true}); }
      L.push({h:true, k:0, d:1.2 + 4 * (1 - f), end:true});
      return L;
    }
    function stateAt(tt){
      var L = timeline(), T = L.reduce(function(s, x){ return s + x.d; }, 0), t = tt % T, i;
      for (i = 0; i < L.length; i++){ if (t < L[i].d || i === L.length - 1) break; t -= L[i].d; }
      var s = L[i];
      if (s.h){ var arrA = frames[s.k].arr && !s.end ? seg01(t, 0.25, 0.85) : 0; return {k:s.k, u:0, arr:arrA, pos:s.k, back:false}; }
      var u = ease(t / s.d);
      if (s.back) return {k:s.k, u:1 - u, arr:0, pos:s.k + 1 - u, back:true};
      return {k:s.k, u:u, arr:frames[s.k].arr ? 1 - seg01(u, 0.15, 0.55) : 0, pos:s.k + u, back:false};
    }
    function curPos(){ return st.pos != null ? st.pos : stateAt(st.tt).pos; }
    reset();
    var lp = k.loop(function(dt){
      st.t += dt; if (st.play) st.tt += dt;
      var g0 = geo[mS.value]; if (spT.value && !st.drag && !st.manual){ st.a = g0.a0 + 0.45 * Math.sin(st.t * 0.35); st.b = 0.22 + 0.12 * Math.sin(st.t * 0.27); }
      popT += dt;
      if (popT > 0.45){ popT = 0; var E = [], Kt = []; pop.forEach(function(p, i){ (p.e ? E : Kt).push(i); }); if (E.length && Kt.length){ var a = E[Math.floor(Math.random() * E.length)], b = Kt[Math.floor(Math.random() * Kt.length)]; pop[a].e = false; pop[b].e = true; flashes.push({i:a, t:st.t}, {i:b, t:st.t}); } }
      flashes = flashes.filter(function(f){ return st.t - f.t < 0.6; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, d = data(), g = geo[mS.value], mol = mS.value;
      solvBox.style.display = mol === "acac" ? "" : "none";
      var s;
      if (st.pos != null){ var kk = Math.min(4, Math.floor(st.pos)), uu = st.pos - kk; if (st.pos >= 5){ kk = 4; uu = 1; } s = {k:kk, u:uu, arr:frames[kk].arr && uu < 0.5 ? 1 - seg01(uu, 0.15, 0.5) : 0, pos:st.pos}; }
      else s = stateAt(st.tt);
      var A = frames[s.k], B = frames[Math.min(5, s.k + 1)], M = kfMix(A, B, s.u);
      /* décor */
      labWall(ctx, W, H);
      var banH = ph ? 70 : 62, benchY = H - banH - (ph ? 16 : 40);
      var box = ph ? {x:8, y:8, w:W - 16, h:H * 0.52} : {x:W * 0.36, y:10, w:W * 0.64 - 10, h:benchY - 14};
      bench(ctx, W, benchY, H);
      var R = ph ? Math.min(W * 0.15, (benchY - box.y - box.h - 10) / 3.3) : Math.min(W * 0.13, H * 0.15), fx = ph ? W * 0.2 : W * 0.18, fy = benchY - R - 2;
      floorShadow(ctx, fx, benchY + 3, R * 1.2, 6, 0.35);
      flask(ctx, fx, fy, R, {liq:TAU_SOLV[d.solv].liq, level:0.62, t:st.t});
      /* population de molécules dans le ballon (36) : bleu = cétone, orange = énol */
      ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, R - 2, 0, 7); ctx.clip();
      var lvl = fy + R - 2 * R * 0.62;
      pop.forEach(function(p, i){
        var x = fx - R * 0.82 + (p.x * 0.9 + 0.05 + 0.03 * Math.sin(st.t * 0.9 + p.ph * 3)) * R * 1.64, y = lvl + 6 + (p.y * 0.85 + 0.05 + 0.03 * Math.cos(st.t * 0.7 + p.ph * 5)) * (fy + R - lvl - 10);
        var fl = flashes.filter(function(f){ return f.i === i; })[0];
        if (fl){ ctx.strokeStyle = "rgba(255,200,60," + (1 - (st.t - fl.t) / 0.6) + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 7 + 6 * (st.t - fl.t), 0, 7); ctx.stroke(); }
        ball(ctx, x, y, Math.max(3, R * 0.075), p.e ? "#e08a1e" : "#2a6fdb");
      });
      ctx.restore();
      var nE = pop.filter(function(p){ return p.e; }).length;
      var nm1 = mol === "prop" ? "propanone" : "pentane-2,4-dione", nm2 = TAU_SOLV[d.solv].d;
      var rem = mol === "prop" ? "1 énol pour 2·10⁸ cétones" : "équilibre dynamique : ça bascule";
      if (ph){
        var lx = fx + R + 14, lw = W - lx - 8, ly = benchY - 2.2 * R - 4;
        label(ctx, nm1, lx, ly, {size:12, weight:800, col:"#13233a", align:"left"});
        label(ctx, nm2, lx, ly + 17, {size:11, weight:700, col:"#5f6b7a", align:"left"});
        ball(ctx, lx + 5, ly + 40, 5, "#2a6fdb"); label(ctx, "cétone : " + (36 - nE), lx + 15, ly + 40, {size:12, weight:800, col:"#2a56c6", align:"left"});
        ball(ctx, lx + 5, ly + 60, 5, "#e08a1e"); label(ctx, "énol : " + nE + " sur 36", lx + 15, ly + 60, {size:12, weight:800, col:"#b86b00", align:"left"});
        label(ctx, rem, lx, ly + 82, {size:fitSize(ctx, rem, lw, 10.5, 700), weight:700, col:"#5f6b7a", align:"left"});
      } else {
        var ty = fy - R * 2.2 - 10;
        label(ctx, nm2, fx, ty, {size:11, weight:700, col:"#5f6b7a", bg:"rgba(255,255,255,.9)"});
        label(ctx, nm1, fx, ty - 22, {size:12, weight:800, col:"#13233a", bg:"rgba(255,255,255,.9)"});
        var cy0 = ty - 52;
        ball(ctx, fx - 62, cy0, 5, "#2a6fdb"); label(ctx, "cétone " + (36 - nE), fx - 54, cy0, {size:11.5, weight:800, col:"#2a56c6", align:"left"});
        ball(ctx, fx + 14, cy0, 5, "#e08a1e"); label(ctx, "énol " + nE, fx + 22, cy0, {size:11.5, weight:800, col:"#b86b00", align:"left"});
        label(ctx, rem, W * 0.18, benchY + 18, {size:fitSize(ctx, rem, W * 0.34, 10.5, 700), weight:700, col:"#e6ecf3"});
      }
      /* loupe */
      loupe(ctx, box, [fx + R * 0.2, fy + R * 0.3], "#2a6fdb");
      loupeFrame(ctx, box);
      clipBox(ctx, box);
      var V = {st:st, sc:Math.min(box.w, box.h) / (2 * g.R) * (ph ? 1.0 : 1.02), cx:box.x + box.w / 2, cy:box.y + box.h * 0.53};
      var atoms = M.P.map(function(p, i){
        var a = At(g.els[i], sub(p, g.ctr), {alpha:M.A[i]});
        if (M.badges[i] && M.badges[i].a > 0.03){ a.badge = M.badges[i].t; a.badgeA = Math.min(1, M.badges[i].a); a.badgeCol = M.badges[i].t === "+" ? "#c0392b" : "#2a56c6"; }
        if (M.glow[i] > 0.03) a.glow = "rgba(240,150,40," + (0.55 * Math.min(1, M.glow[i])) + ")";
        if (i === g.iHa) a.ring = M.A[i] > 0.5 ? "rgba(224,138,30,.9)" : null;
        if (i === g.n + 3) a.ring = "rgba(42,111,219,.85)";
        return a;
      });
      var pr = drawScene(c, V, atoms, M.bonds);
      drawArrows(ctx, pr, A.arr, s.arr * (s.back ? 0 : 1), "#13233a");
      ctx.restore();
      var idxT = Math.min(5, Math.round(s.k + s.u)), F0 = frames[idxT];
      label(ctx, "glisse pour tourner", box.x + box.w - 8, box.y + 14, {size:10.5, col:"#8a95a3", align:"right"});
      label(ctx, "H du carbone α", box.x + 10, box.y + 14, {size:10.5, weight:800, col:"#c46f0f", align:"left"});
      label(ctx, "H qui finit sur O", box.x + 10, box.y + 32, {size:10.5, weight:800, col:"#2a56c6", align:"left"});
      /* bandeau */
      var title = s.back ? "Retour : l'énol redonne la cétone" : F0.t, sub2 = s.back ? "Mêmes étapes en sens inverse : la tautomérie est un équilibre" : F0.s;
      bannerBox(ctx, W, H - banH - 6, banH, title, sub2, s.back ? "#8a95a3" : cS.value === "acide" ? "#c0392b" : "#2a56c6", ph);
      /* lectures */
      ro.set(0, d.pc != null ? "≈ " + F(d.pc, 0) + " %" : "≈ " + sci(d.f * 100, 0) + " %");
      ro.set(1, d.K < 0.01 ? "≈ " + sci(d.K, 0) : "≈ " + F(d.K, d.K >= 10 ? 1 : 2));
      ro.set(2, (d.dG > 0 ? "+" : "") + F(d.dG, 1) + " kJ/mol");
      ro.set(3, s.back ? "retour" : Math.min(5, Math.round(s.pos)) + " / 5");
      if (st.play) aS.set(Math.min(5, s.pos));
      var msg;
      if (mol === "prop") msg = "Propanone : l'énol existe mais ne s'accumule pas. Bilan des énergies moyennes de liaison : cétone C=O + C–C + C–H = 745 + 347 + 413 = 1505 kJ/mol, énol C=C + C–O + O–H = 614 + 358 + 463 = 1435 kJ/mol : la cétone a ≈ 70 kJ/mol de liaisons en plus. ΔG° = −RT·ln K = +" + F(d.dG, 1) + " kJ/mol. <i>K : ordre de grandeur de la littérature (pK ≈ 8,3, eau, 25 °C).</i>";
      else msg = "Pentane-2,4-dione (" + TAU_SOLV[d.solv].d + ") : " + F(d.pc, 0) + " % d'énol, donc K = " + F(d.pc, 0) + "/" + F(100 - d.pc, 0) + " = " + F(d.K, d.K >= 10 ? 1 : 2) + " et ΔG° = −RT·ln K = " + (d.dG > 0 ? "+" : "") + F(d.dG, 1) + " kJ/mol. " + (d.solv === "eau" ? "L'eau fait ses propres liaisons H avec les deux C=O de la forme cétone : la liaison H interne de l'énol ne compense plus." : "Sans solvant donneur de liaisons H, la liaison H interne (pointillés verts) et la conjugaison C=C–C=O stabilisent l'énol.") + " L'H en α, entre deux C=O, est aussi beaucoup plus acide (pKa ≈ 9 contre ≈ 19 pour la propanone). <i>% d'énol mesurés par RMN, à ±3 % selon les sources.</i>";
      nt.set(msg, "ok");
      drawBars();
    });
    gC.pointer(function(type, p){
      if (type !== "down") return;
      var i = Math.floor((p.y - 22) / ((gC.H - 26) / 5)); if (i < 0 || i > 4) return;
      var dd = TAU_DATA[i]; mS.set(dd.mol); if (dd.mol === "acac") sS.set(dd.solv); reset(); k.redraw();
    });
    function drawBars(){
      var ctx = gC.ctx, W = gC.W, H = gC.H, ph = W < 480, cur = data(); gC.clear(); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, H);
      label(ctx, "% d'énol à l'équilibre (25 °C) · clique une barre", 10, 11, {size:11.5, weight:800, col:"#2c3a4e", align:"left"});
      var X0 = ph ? 128 : 160, X1 = W - 54, rowH = (H - 26) / 5;
      TAU_DATA.forEach(function(d, i){
        var y = 22 + i * rowH, w = Math.max(2, d.f * (X1 - X0)), on = d === cur;
        var gr = ctx.createLinearGradient(0, y, 0, y + rowH - 6); gr.addColorStop(0, on ? "#f3b062" : "#d5dde8"); gr.addColorStop(1, on ? "#e08a1e" : "#b9c5d4");
        ctx.fillStyle = gr; rr(ctx, X0, y + 2, w, rowH - 7, 4); ctx.fill();
        label(ctx, d.nom, X0 - 6, y + rowH / 2 - 1, {size:ph ? 10 : 11, weight:on ? 800 : 700, col:on ? "#13233a" : "#5f6b7a", align:"right"});
        label(ctx, d.pc != null ? F(d.pc, 0) + " %" : "≈ 0 %", X0 + w + 6, y + rowH / 2 - 1, {size:11, weight:800, col:on ? "#b86b00" : "#5f6b7a", align:"left"});
      });
    }
  }
});

/* ====================================================================== */
/* 2. Tests de Tollens et de Fehling au bain-marie                         */
/* ====================================================================== */
var TF_M = {Ag:107.87, Cu2O:2 * 63.546 + 15.999};
var TF_TUBES = [
  {k:"ethanal", n:"éthanal", f:"CH₃–CHO", cho:true, R:"CH₃", delay:0},
  {k:"propanone", n:"propanone", f:"CH₃–CO–CH₃", cho:false},
  {k:"glucose", n:"glucose", f:"C₆H₁₂O₆", cho:true, R:"C₅H₁₁O₅", delay:0.9},
  {k:"saccharose", n:"saccharose", f:"C₁₂H₂₂O₁₁", cho:false}
];
function tfDe(n){ return (/^[aeiouyhéèêâîôûAEIOUYHÉ]/.test(n) ? "d'" : "de ") + n; }
function tfEq(tb, re){
  if (!tb.cho){
    if (tb.k === "propanone") return ["CH₃–CO–CH₃ : test négatif", "Le carbone du C=O ne porte pas de H : une oxydation douce ne peut pas en faire un acide"];
    return ["Saccharose : test négatif", "Ses deux carbones anomériques sont liés entre eux (liaison glycosidique) : pas de forme ouverte, pas de –CHO"];
  }
  var R = tb.R;
  if (re === "tollens") return [R + "–CHO + 2 [Ag(NH₃)₂]⁺ + 3 HO⁻ → " + R + "–COO⁻ + 2 Ag(s) + 4 NH₃ + 2 H₂O", tb.k === "glucose" ? "La forme ouverte du glucose (moins de 1 %) porte un –CHO ; elle se reforme au fur et à mesure : tout le glucose finit oxydé (gluconate)" : "L'aldéhyde est oxydé en ion carboxylate ; chaque Ag⁺ gagne un électron et l'argent se dépose en miroir sur le verre"];
  return [R + "–CHO + 2 Cu²⁺ + 5 HO⁻ → " + R + "–COO⁻ + Cu₂O(s) + 3 H₂O", tb.k === "glucose" ? "Le glucose est un sucre réducteur : sa forme ouverte (–CHO) réduit Cu²⁺ en Cu₂O, rouge brique" : "Cu²⁺ (bleu, complexé par le tartrate) est réduit en oxyde de cuivre(I) Cu₂O, précipité rouge brique"];
}
SFA.sim({
  id:"org-tests-tollens-fehling", ch:"c10", tag:"Carbonyles",
  titre:"Tollens et Fehling : l'aldéhyde se trahit",
  resume:"Quatre tubes au bain-marie : éthanal, propanone, glucose et saccharose. Verse le réactif de Tollens ou la liqueur de Fehling et chauffe : le miroir d'argent ou le précipité rouge brique de Cu₂O désigne les tubes qui contiennent un –CHO.",
  but:"Choisis le réactif. La pipette verse le réactif dans les quatre tubes, puis le bain-marie chauffe. Clique sur un tube pour lire son équation et voir, dans la loupe, ce qui se passe à l'échelle des ions. Coupe le chauffage pour voir quel test en a besoin, et change la quantité de substance pour calculer la masse de solide formé.",
  aRetenir:"Un aldéhyde (–CHO) est un réducteur : il s'oxyde facilement en acide carboxylique (en ion carboxylate en milieu basique), le carbone fonctionnel passant du nombre d'oxydation +1 à +3 (2 électrons cédés). Tollens : [Ag(NH₃)₂]⁺ est réduit en argent métallique, qui forme un miroir ; 1 mol d'aldéhyde donne 2 mol d'Ag. Fehling (à chaud) : Cu²⁺ est réduit en Cu₂O, précipité rouge brique ; 1 mol d'aldéhyde donne 1 mol de Cu₂O. Une cétone n'a pas de H sur le carbone du C=O : test négatif. Le glucose est un sucre réducteur (sa forme ouverte porte un –CHO) ; le saccharose n'en est pas un (pas d'extrémité réductrice libre).",
  piege:"Le test ne repère pas « un C=O », mais un C=O qui porte un H : la propanone, qui a pourtant un C=O, reste négative. Le glucose réagit alors qu'il est presque entièrement sous forme cyclique : il suffit d'un peu de forme ouverte, régénérée au fur et à mesure. Et le saccharose, fait de glucose et de fructose, devient positif seulement après hydrolyse (acide ou enzyme). Sécurité : le réactif de Tollens se prépare juste avant l'emploi et ne se conserve pas.",
  build:function(k, S){
    var c = respCanvas(k, 0.8, 1.55), st = {t:0, run:0, sel:0, play:true, flash:[]};
    var rS = k.seg("Réactif", [["tollens", "Tollens (Ag⁺ / NH₃)"], ["fehling", "Liqueur de Fehling (Cu²⁺)"]], "tollens", function(){ st.run = 0; });
    var hT = k.toggle("Chauffer le bain-marie (60 °C)", true, function(){ st.run = 0; });
    var nS = k.slider("Quantité de substance dans chaque tube", 0.05, 0.5, 0.01, 0.1, "mmol");
    k.button("Recommencer", function(){ st.run = 0; st.play = true; }, true);
    k.button("Pause", function(){ st.play = !st.play; });
    var ro = k.readouts(["Tube choisi", "Groupe –CHO libre ?", "Solide attendu (fin)", "Électrons cédés par molécule"]);
    var nt = k.note("", "ok");
    var CYC = 17, geomL = null;
    function prog(i, t){
      var tb = TF_TUBES[i], re = rS.value, heat = hT.value;
      if (!tb.cho) return 0;
      var t0 = 5.2 + (tb.delay || 0), dur = re === "tollens" ? 5.5 : 6.2, pmax = 1;
      if (!heat){ if (re === "fehling") return 0; dur = 9; pmax = 0.35; t0 = 3.4 + (tb.delay || 0); }
      return pmax * ease((t - t0) / dur);
    }
    function temp(t){ return hT.value ? 20 + 40 * ease((t - 3.2) / 1.9) : 20; }
    c.cv.style.cursor = "pointer";
    c.pointer(function(type, p){
      if (type !== "down" || !geomL) return;
      geomL.tubes.forEach(function(tb, i){ if (Math.abs(p.x - tb.x) < tb.w * 0.9 && p.y > tb.top - 34 && p.y < tb.bot + 6){ st.sel = i; st.flash.push({i:i, t:st.t}); } });
      k.redraw();
    });
    var lp = k.loop(function(dt){ st.t += dt; if (st.play){ st.run += dt; if (st.run > CYC) st.run = 0; } st.flash = st.flash.filter(function(f){ return st.t - f.t < 0.8; }); k.redraw(); });
    lp.play();
    /* ions de la loupe (positions pseudo-aléatoires fixes) */
    var IONS = gridScatter(24, 4, 5), ORG = gridScatter(8, 2, 17);
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.run, re = rS.value, T = temp(t), n = nS.value;
      labWall(ctx, W, H, "#eef2f6", "#dfe6ee");
      var banH = ph ? 86 : 66, benchY = H - banH - 18;
      bench(ctx, W, benchY, H);
      /* plaque chauffante */
      var bx0 = ph ? 14 : 16, bx1 = ph ? W - 14 : W * 0.62, plH = 24, plY = benchY - plH;
      var gp = ctx.createLinearGradient(0, plY, 0, benchY); gp.addColorStop(0, "#5b6470"); gp.addColorStop(1, "#2f353d");
      ctx.fillStyle = gp; rr(ctx, bx0 - 6, plY, bx1 - bx0 + 12, plH, 5); ctx.fill();
      var heatA = hT.value ? seg01(t, 2.9, 3.6) : 0;
      if (heatA > 0){ var gh = ctx.createLinearGradient(0, plY - 4, 0, plY + 6); gh.addColorStop(0, "rgba(255,90,40,0)"); gh.addColorStop(1, "rgba(255,90,40," + (0.55 * heatA) + ")"); ctx.fillStyle = gh; ctx.fillRect(bx0, plY - 4, bx1 - bx0, 10); }
      ctx.fillStyle = "#0f1720"; rr(ctx, bx1 - 64, plY + 5, 50, 14, 3); ctx.fill();
      label(ctx, F(T, 0) + " °C", bx1 - 39, plY + 12, {size:10.5, weight:800, col:hT.value ? "#ff7a59" : "#8fd3ff"});
      ball(ctx, bx0 + 14, plY + 12, 6, "#c9d2dc");
      /* bain-marie (bécher) */
      var bTop = ph ? H * 0.5 : H * 0.36, bBot = plY - 1, wTop = bTop + (bBot - bTop) * 0.22;
      ctx.save(); var gw = ctx.createLinearGradient(0, wTop, 0, bBot); gw.addColorStop(0, "rgba(186,214,240,.55)"); gw.addColorStop(1, "rgba(150,190,230,.75)");
      ctx.fillStyle = gw; rr(ctx, bx0 + 2, wTop, bx1 - bx0 - 4, bBot - wTop - 2, [0, 0, 10, 10]); ctx.fill(); ctx.restore();
      /* tubes */
      var nT = 4, sp = (bx1 - bx0) / (nT + 0.4), tw = Math.min(30, sp * 0.4), tTop = bTop - (ph ? 46 : 52), tBot = bBot - 16, tubes = [];
      for (var i = 0; i < nT; i++) tubes.push({x:bx0 + sp * (i + 0.7), w:tw, top:tTop, bot:tBot});
      geomL = {tubes:tubes};
      /* support (barre et pinces) */
      ctx.save(); var gs = ctx.createLinearGradient(0, tTop + 6, 0, tTop + 16); gs.addColorStop(0, "#d7dde4"); gs.addColorStop(1, "#8c96a3");
      ctx.fillStyle = gs; rr(ctx, bx0 + 4, tTop + 8, bx1 - bx0 - 8, 9, 4); ctx.fill(); ctx.restore();
      /* bulles du bain (chauffage) */
      if (heatA > 0){
        for (var q = 0; q < 16; q++){ var ph2 = (st.t * 0.55 + q * 0.173) % 1, xb = bx0 + 10 + ((q * 37) % 100) / 100 * (bx1 - bx0 - 20), yb = bBot - 6 - ph2 * (bBot - wTop - 10);
          ctx.save(); ctx.globalAlpha = heatA * (1 - ph2) * 0.9; ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(xb + 2 * Math.sin(st.t * 3 + q), yb, 1.4 + 2 * ph2, 0, 7); ctx.stroke(); ctx.restore(); }
      }
      tubes.forEach(function(tb, i){
        var td = TF_TUBES[i], p = prog(i, t), sel = st.sel === i, x = tb.x, w = tb.w;
        var pour = seg01(t, 0.4 + 0.7 * i, 0.9 + 0.7 * i), lvl0 = 0.3, lvl = lvl0 + 0.28 * pour, liqTop = tb.bot - (tb.bot - tb.top) * lvl;
        /* couleur de la solution */
        var col, alpha = 0.55;
        if (re === "tollens"){ col = [236, 238, 240]; alpha = 0.35 + 0.1 * pour; if (p > 0){ col = [Math.round(236 - 150 * p), Math.round(238 - 150 * p), Math.round(240 - 145 * p)]; alpha = 0.45 + 0.4 * p; } }
        else {
          var blue = [47, 111, 214], cur = [230, 236, 242];
          cur = cur.map(function(v, j){ return Math.round(lerp(v, blue[j], pour)); });
          if (p > 0){ var green = [92, 158, 110], orange = [205, 110, 45], red = [168, 58, 36], a1 = seg01(p, 0, 0.35), a2 = seg01(p, 0.35, 0.7), a3 = seg01(p, 0.7, 1);
            cur = cur.map(function(v, j){ var x1 = lerp(v, green[j], a1); x1 = lerp(x1, orange[j], a2); return Math.round(lerp(x1, red[j], a3)); }); }
          col = cur; alpha = 0.35 + 0.45 * pour;
        }
        ctx.save();
        /* ombre et verre */
        var r0 = w / 2;
        ctx.beginPath(); ctx.moveTo(x - r0, tb.top); ctx.lineTo(x - r0, tb.bot - r0); ctx.arc(x, tb.bot - r0, r0, PI, 0, true); ctx.lineTo(x + r0, tb.top); ctx.closePath();
        ctx.save(); ctx.clip();
        var gl = ctx.createLinearGradient(x - r0, 0, x + r0, 0); gl.addColorStop(0, "rgba(" + col + "," + (alpha * 0.85) + ")"); gl.addColorStop(0.5, "rgba(" + col + "," + alpha + ")"); gl.addColorStop(1, "rgba(" + col + "," + (alpha * 0.75) + ")");
        ctx.fillStyle = gl; ctx.fillRect(x - r0, liqTop, w, tb.bot - liqTop + 2);
        /* miroir d'argent : dépôt métallique sur la paroi */
        if (re === "tollens" && p > 0.02){
          var gm = ctx.createLinearGradient(x - r0, 0, x + r0, 0);
          gm.addColorStop(0, "rgba(70,74,80," + p + ")"); gm.addColorStop(0.22, "rgba(235,238,242," + p + ")"); gm.addColorStop(0.45, "rgba(120,126,134," + p + ")"); gm.addColorStop(0.75, "rgba(210,214,220," + p + ")"); gm.addColorStop(1, "rgba(60,64,70," + p + ")");
          ctx.fillStyle = gm; ctx.fillRect(x - r0, liqTop - 2, w, tb.bot - liqTop + 4);
        }
        /* précipité de Cu2O qui se dépose */
        if (re === "fehling" && p > 0.5){
          var hp = (tb.bot - liqTop) * 0.22 * seg01(p, 0.5, 1);
          var gr2 = ctx.createLinearGradient(0, tb.bot - hp, 0, tb.bot); gr2.addColorStop(0, "rgba(176,62,36,.7)"); gr2.addColorStop(1, "rgba(140,40,24,1)");
          ctx.fillStyle = gr2; ctx.fillRect(x - r0, tb.bot - hp, w, hp + 2);
        }
        /* gouttes de réactif */
        if (pour > 0 && pour < 1){ for (var dq = 0; dq < 3; dq++){ var fy = (pour * 3 + dq / 3) % 1; ctx.fillStyle = re === "tollens" ? "rgba(200,205,212,.95)" : "rgba(47,111,214,.95)"; ctx.beginPath(); ctx.arc(x, tb.top + fy * (liqTop - tb.top), 2.6, 0, 7); ctx.fill(); } }
        ctx.restore();
        /* paroi de verre */
        ctx.strokeStyle = sel ? "#2a6fdb" : "rgba(90,110,135,.85)"; ctx.lineWidth = sel ? 2.4 : 1.4;
        ctx.beginPath(); ctx.moveTo(x - r0, tb.top); ctx.lineTo(x - r0, tb.bot - r0); ctx.arc(x, tb.bot - r0, r0, PI, 0, true); ctx.lineTo(x + r0, tb.top); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - r0 * 0.45, tb.top + 10); ctx.lineTo(x - r0 * 0.45, tb.bot - r0 - 4); ctx.stroke();
        ctx.fillStyle = "rgba(220,230,240,.6)"; ctx.beginPath(); ctx.ellipse(x, tb.top, r0, 3, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(90,110,135,.8)"; ctx.lineWidth = 1; ctx.stroke();
        /* pince */
        ctx.fillStyle = "#6c7684"; rr(ctx, x - r0 - 3, tb.top + 6, w + 6, 12, 3); ctx.fill();
        ctx.restore();
        var fl = st.flash.filter(function(f){ return f.i === i; })[0];
        if (fl){ ctx.save(); ctx.strokeStyle = "rgba(42,111,219," + (1 - (st.t - fl.t) / 0.8) + ")"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, (tb.top + tb.bot) / 2, w * 0.9 + 10 * (st.t - fl.t), (tb.bot - tb.top) * 0.6, 0, 0, 7); ctx.stroke(); ctx.restore(); }
        /* étiquette */
        var lz = fitSize(ctx, td.n, sp - 6, ph ? 10.5 : 11, 800);
        label(ctx, td.n, x, tb.top - 14, {size:lz, weight:800, col:sel ? "#fff" : "#13233a", bg:sel ? "#2a6fdb" : "rgba(255,255,255,.92)", border:sel ? null : "#d9e0ea"});
      });
      /* verre du bécher (par-dessus) */
      ctx.save(); var gb = ctx.createLinearGradient(bx0, 0, bx1, 0); gb.addColorStop(0, "rgba(150,175,205,.35)"); gb.addColorStop(0.08, "rgba(255,255,255,.25)"); gb.addColorStop(0.5, "rgba(255,255,255,.04)"); gb.addColorStop(0.93, "rgba(255,255,255,.22)"); gb.addColorStop(1, "rgba(150,175,205,.35)");
      ctx.fillStyle = gb; rr(ctx, bx0, bTop, bx1 - bx0, bBot - bTop, [2, 2, 12, 12]); ctx.fill();
      ctx.strokeStyle = "rgba(90,110,135,.75)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx0, bTop); ctx.lineTo(bx0, bBot - 12); ctx.quadraticCurveTo(bx0, bBot, bx0 + 12, bBot); ctx.lineTo(bx1 - 12, bBot); ctx.quadraticCurveTo(bx1, bBot, bx1, bBot - 12); ctx.lineTo(bx1, bTop); ctx.stroke();
      ctx.restore();
      /* thermomètre */
      var thx = bx1 - 12, thT = bTop - 30, thB = bBot - 12, frac = (T - 0) / 100;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.85)"; rr(ctx, thx - 4, thT, 8, thB - thT, 4); ctx.fill(); ctx.strokeStyle = "rgba(90,110,135,.7)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#d63a2f"; ctx.fillRect(thx - 1.6, thB - (thB - thT - 10) * frac - 4, 3.2, (thB - thT - 10) * frac); ball(ctx, thx, thB, 5.5, "#d63a2f"); ctx.restore();
      /* pipette (verse dans chaque tube) */
      var pi = clamp(Math.floor((t - 0.4) / 0.7), 0, 3), pmove = t < 3.3 ? 1 : 1 - seg01(t, 3.3, 3.9);
      if (pmove > 0.02){
        var px = t < 0.4 ? lerp(bx1 + 20, tubes[0].x, seg01(t, 0, 0.4)) : lerp(tubes[pi].x, tubes[Math.min(3, pi + 1)].x, ease(seg01((t - 0.4) % 0.7, 0.5, 0.7))), py = tTop - 40 - 30 * (1 - pmove);
        if (t >= 3.3) px = lerp(tubes[3].x, bx1 + 40, 1 - pmove);
        ctx.save(); ctx.globalAlpha = pmove;
        var gpp = ctx.createLinearGradient(px - 4, 0, px + 4, 0); gpp.addColorStop(0, "rgba(170,190,210,.7)"); gpp.addColorStop(0.5, "rgba(255,255,255,.9)"); gpp.addColorStop(1, "rgba(160,180,200,.7)");
        ctx.fillStyle = gpp; ctx.beginPath(); ctx.moveTo(px - 4, py - 26); ctx.lineTo(px + 4, py - 26); ctx.lineTo(px + 1.2, py + 8); ctx.lineTo(px - 1.2, py + 8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(90,110,135,.7)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = re === "tollens" ? "rgba(205,210,218,.9)" : "rgba(47,111,214,.85)"; ctx.fillRect(px - 3, py - 14, 6, 14);
        var gbu = ctx.createRadialGradient(px - 3, py - 36, 1, px, py - 32, 10); gbu.addColorStop(0, "#f39a8a"); gbu.addColorStop(1, "#b8402f"); ctx.fillStyle = gbu; rr(ctx, px - 6, py - 44, 12, 19, 6); ctx.fill();
        ctx.restore();
      }
      /* flacon de réactif sur la paillasse */
      if (!ph){
        var fx = W * 0.62 + 2, fyB = benchY;
        ctx.save(); var gf = ctx.createLinearGradient(fx - 14, 0, fx + 14, 0);
        if (re === "tollens"){ gf.addColorStop(0, "#4a2a12"); gf.addColorStop(0.4, "#8a5326"); gf.addColorStop(1, "#3c210d"); } else { gf.addColorStop(0, "#1d4fa8"); gf.addColorStop(0.4, "#4f8be8"); gf.addColorStop(1, "#173f88"); }
        ctx.fillStyle = gf; rr(ctx, fx - 14, fyB - 46, 28, 46, 5); ctx.fill(); ctx.fillStyle = "#2b2f36"; ctx.fillRect(fx - 6, fyB - 56, 12, 11);
        ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fillRect(fx - 11, fyB - 34, 22, 14); ctx.restore();
        label(ctx, re === "tollens" ? "Ag⁺" : "Cu²⁺", fx, fyB - 27, {size:9.5, weight:800, col:"#13233a"});
      }
      /* loupe : la solution vue de près, à côté de la paroi du tube choisi */
      var box = ph ? {x:8, y:8, w:W - 16, h:tTop - 46} : {x:W * 0.66, y:10, w:W * 0.34 - 10, h:plY - 40};
      var tbS = tubes[st.sel], pS = prog(st.sel, t), td = TF_TUBES[st.sel];
      loupe(ctx, box, [tbS.x, tbS.bot - (tbS.bot - tbS.top) * 0.25], "#2a6fdb");
      loupeFrame(ctx, box, "#ffffff", re === "fehling" ? "#e3ecfa" : "#eef1f5");
      clipBox(ctx, box);
      var wallX = box.x + box.w - 18, flY = box.y + box.h - 16;
      /* paroi de verre à droite, fond du tube en bas */
      ctx.fillStyle = "rgba(170,195,225,.55)"; ctx.fillRect(wallX, box.y, 18, box.h);
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(wallX + 3, box.y, 3, box.h);
      ctx.save(); ctx.translate(wallX + 11, box.y + box.h * 0.5); ctx.rotate(-PI / 2); label(ctx, "paroi du tube", 0, 0, {size:9.5, weight:800, col:"#5f6b7a"}); ctx.restore();
      var nAld = 8, used = Math.round(pS * nAld);
      var nDep = re === "tollens" ? 2 * used : used;
      /* ions oxydants libres */
      var nFree = re === "tollens" ? 24 - 2 * used : 24 - 2 * used;
      var sc2 = clamp(Math.min(box.w, box.h) / 210, 0.75, 1.15);
      IONS.slice(0, Math.max(0, nFree)).forEach(function(m, j){
        var x = box.x + 14 + (m.x * 0.9 + 0.04 * Math.sin(st.t * 0.8 + m.r * 4)) * (wallX - box.x - 34), y = box.y + 22 + (m.y * 0.85 + 0.04 * Math.cos(st.t * 0.6 + m.r * 6)) * (flY - box.y - 50);
        if (re === "tollens"){
          var ang = m.r + st.t * 0.4, dx = Math.cos(ang) * 11 * sc2, dy = Math.sin(ang) * 11 * sc2;
          ball(ctx, x - dx, y - dy, 5 * sc2, "#3b6ec2"); ball(ctx, x + dx, y + dy, 5 * sc2, "#3b6ec2"); ball(ctx, x, y, 7 * sc2, "#b8bec7");
        } else { S.draw.glow(c, x, y, 13 * sc2, "#4f8be8", 0.5); ball(ctx, x, y, 6.5 * sc2, "#2f6fd6"); }
      });
      /* molécules organiques : aldéhyde (C gris + O rouge) puis carboxylate (O⁻) */
      ORG.forEach(function(m, j){
        var x = box.x + 20 + (m.x * 0.82 + 0.05 * Math.sin(st.t * 0.5 + m.r * 3)) * (wallX - box.x - 46), y = box.y + 30 + (m.y * 0.8 + 0.05 * Math.cos(st.t * 0.45 + m.r * 5)) * (flY - box.y - 70);
        var ox = j < used, ang = m.r + st.t * 0.3;
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
        ball(ctx, -8 * sc2, 0, 6 * sc2, "#4a5568"); ball(ctx, 3 * sc2, 0, 6.5 * sc2, "#4a5568");
        ball(ctx, 10 * sc2, -6 * sc2, 5.5 * sc2, "#d6392f");
        if (ox) ball(ctx, 10 * sc2, 7 * sc2, 5.5 * sc2, "#d6392f"); else if (td.cho) ball(ctx, 10 * sc2, 6 * sc2, 3.5 * sc2, "#e8edf3"); else ball(ctx, 12 * sc2, 6 * sc2, 6 * sc2, "#4a5568");
        ctx.restore();
        if (ox) badge(ctx, x + 10 * sc2, y - 10 * sc2, "−", "#2a56c6", 1, 6.5);
      });
      /* produit solide */
      if (re === "tollens"){
        for (var a = 0; a < nDep; a++){ var col2 = a % 2, row = Math.floor(a / 2), ax = wallX - 7 - col2 * 11 * sc2, ay = flY - 10 - row * 13 * sc2; ball(ctx, ax, ay, 6.5 * sc2, "#cfd5dc"); }
        if (nDep) label(ctx, "Ag(s)", wallX - 34, flY - 10 - (nDep / 2) * 13 * sc2 - 10, {size:10.5, weight:800, col:"#5f6b7a", bg:"rgba(255,255,255,.85)"});
      } else {
        for (var b2 = 0; b2 < nDep; b2++){ var cx2 = box.x + 30 + b2 * 20 * sc2 + (b2 % 2) * 4, cy2 = flY - 6 - (b2 % 2) * 8 * sc2; ball(ctx, cx2 - 4 * sc2, cy2, 6 * sc2, "#b5412a"); ball(ctx, cx2 + 4 * sc2, cy2, 6 * sc2, "#b5412a"); ball(ctx, cx2, cy2 - 5 * sc2, 4.5 * sc2, "#d6392f"); }
        if (nDep) label(ctx, "Cu₂O(s)", box.x + 30, flY - 28, {size:10.5, weight:800, col:"#8c2a18", bg:"rgba(255,255,255,.85)", align:"left"});
      }
      ctx.restore();
      label(ctx, td.n + " · " + (re === "tollens" ? "Tollens" : "Fehling"), box.x + 10, box.y + 14, {size:11, weight:800, col:"#2c3a4e", align:"left", bg:"rgba(255,255,255,.88)"});
      /* légende de la loupe */
      var lg = re === "tollens" ? "[Ag(NH₃)₂]⁺" : "Cu²⁺";
      label(ctx, lg + " libres : " + Math.max(0, nFree), box.x + 10, box.y + 36, {size:10.5, weight:800, col:re === "tollens" ? "#5f6b7a" : "#2a56c6", align:"left", bg:"rgba(255,255,255,.85)"});
      /* bandeau */
      var eq = tfEq(td, re), phase = t < 3.2 ? "On verse le réactif" : !hT.value ? "Sans chauffage" : t < 5.1 ? "Chauffage au bain-marie" : null;
      var title = eq[0], sub2 = eq[1];
      if (phase && td.cho && pS < 0.02) sub2 = phase + " … " + (re === "fehling" && !hT.value ? "Fehling a besoin d'être chauffé : rien ne se passe à 20 °C" : "attends la réaction");
      bannerBox(ctx, W, H - banH - 6, banH, title, sub2, td.cho ? (re === "tollens" ? "#7d8792" : "#b5412a") : "#8a95a3", ph);
      /* lectures */
      var mass = re === "tollens" ? 2 * n * TF_M.Ag : n * TF_M.Cu2O;
      ro.set(0, td.n + " (" + td.f + ")");
      ro.set(1, td.cho ? "oui" : "non");
      ro.set(2, td.cho ? (re === "tollens" ? F(2 * n, 2) + " mmol Ag = " + F(mass, 1) + " mg" : F(n, 2) + " mmol Cu₂O = " + F(mass, 1) + " mg") : "aucun");
      ro.set(3, td.cho ? "2 e⁻ (C : +1 → +3)" : "0");
      var msg = td.cho ? (re === "tollens" ? "Pour " + F(n, 2) + " mmol " + tfDe(td.n) + " : n(Ag) = 2 × " + F(n, 2) + " = " + F(2 * n, 2) + " mmol, m = " + F(2 * n, 2) + " mmol × 107,87 g/mol = " + F(mass, 1) + " mg d'argent déposé." : "Pour " + F(n, 2) + " mmol " + tfDe(td.n) + " : n(Cu₂O) = " + F(n, 2) + " mmol, m = " + F(n, 2) + " mmol × 143,09 g/mol = " + F(mass, 1) + " mg de Cu₂O.") + " Chaque Ag⁺ ou chaque Cu²⁺ gagne un électron ; l'aldéhyde en cède deux." + (!hT.value ? (re === "fehling" ? " <b>Sans chauffage, la liqueur de Fehling ne réagit pas</b> : le test se fait toujours à chaud." : " Sans chauffage, le miroir se forme quand même, mais lentement.") : "") : "Aucun –CHO libre dans ce tube : le réactif ne change pas. " + (td.k === "saccharose" ? "Le saccharose (glucose + fructose) ne réduit pas : ses deux carbones anomériques forment la liaison glycosidique." : "Une cétone ne s'oxyde pas sans casser une liaison C–C.");
      nt.set(msg + " <i>Stœchiométrie idéale ; le nombre d'ions dans la loupe est symbolique.</i>", td.cho ? "ok" : "warn");
    });
  }
});

/* ====================================================================== */
/* 3. Le savon et la micelle (dodécylsulfate de sodium, SDS)               */
/* ====================================================================== */
var MIC = {CMC:8.2, Nagg:62, g0:72.0, gCMC:39.0, Gmax:3.2e-6, NA:6.022e23, R:8.314, T:298.15};
MIC.A = 2 * MIC.R * MIC.T * MIC.Gmax * 1000;                 /* mN/m (facteur 2 : tensioactif ionique) */
MIC.K = (Math.exp((MIC.g0 - MIC.gCMC) / MIC.A) - 1) / MIC.CMC; /* L/mmol (Szyszkowski ajusté sur γ(CMC)) */
function micGamma(c){ var cc = Math.min(c, MIC.CMC); return MIC.g0 - MIC.A * Math.log(1 + MIC.K * cc); }
function micTheta(c){ var cc = Math.min(c, MIC.CMC); return MIC.K * cc / (1 + MIC.K * cc); }
/* micelle 3D : têtes sur une sphère (répartition de Fibonacci), queues de 12 carbones vers le centre */
function micModel(swollen){
  var N = MIC.Nagg, Rh = swollen ? 1.22 : 1.0, Rin = swollen ? 0.56 : 0.08, out = [], ga = PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++){
    var y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), ph = i * ga, d = [r * Math.cos(ph), y, r * Math.sin(ph)];
    var e1 = perpTo(d), e2 = cross(d, e1), beads = [];
    for (var j = 0; j <= 11; j++){
      var f = j / 11, rad = Rh - 0.13 - f * (Rh - 0.13 - Rin - 0.04 * hrand(i, 3)), w = 0.055 * Math.sin(j * 1.9 + i) * (0.4 + f);
      beads.push(add(mul(d, rad), add(mul(e1, w), mul(e2, 0.05 * Math.cos(j * 1.3 + i * 2) * f))));
    }
    out.push({d:d, head:mul(d, Rh), beads:beads});
  }
  var ions = [];
  for (var q = 0; q < 22; q++){ var yy = 1 - 2 * (q + 0.5) / 22, rr2 = Math.sqrt(1 - yy * yy), p2 = q * ga * 1.7 + 0.5; ions.push({d:[rr2 * Math.cos(p2), yy, rr2 * Math.sin(p2)], r:Rh + 0.28 + 0.25 * hrand(q, 9), ph:hrand(q, 4) * 6.28}); }
  return {list:out, ions:ions, Rh:Rh, Rin:Rin};
}
/* une molécule de SDS en 3D (C12 en zigzag, H, groupe sulfate, Na+) */
function sdsMol(){
  var at = [], bd = [], h = 56 * DEG, L = 1.53, i;
  var C = []; for (i = 0; i < 12; i++) C.push([-6.2 + i * L * Math.sin(h), (i % 2 ? 1 : -1) * L * Math.cos(h) / 2, 0]);
  C.forEach(function(p){ at.push(At("C", p)); });
  for (i = 0; i < 11; i++) bd.push({a:i, b:i + 1});
  /* O lié à C12, puis S */
  var u = nrm(sub(C[11], C[10])), dO = nrm(add(u, [0, (11 % 2 ? -1 : 1) * 0.9, 0]));
  var O1 = add(C[11], mul(nrm([Math.sin(h), -(11 % 2 ? 1 : -1) * Math.cos(h), 0]), 1.43)); at.push(At("O", O1)); bd.push({a:11, b:12});
  var S1 = add(O1, mul(nrm([Math.sin(h), (11 % 2 ? 1 : -1) * Math.cos(h), 0]), 1.6)); at.push(At("S", S1)); bd.push({a:12, b:13});
  tetra3(nrm(sub(O1, S1)), [0, 0, 1]).forEach(function(dd, q){ at.push(At("O", add(S1, mul(dd, 1.45)), q === 0 ? {badge:"−", badgeCol:"#2a56c6"} : null)); bd.push({a:13, b:at.length - 1, o:q === 0 ? 1 : 2}); });
  /* H des carbones */
  for (i = 0; i < 12; i++){
    var prev = i > 0 ? C[i - 1] : null, next = i < 11 ? C[i + 1] : O1, dirs;
    if (prev){ dirs = sp3pair(sub(prev, C[i]), sub(next, C[i]), [0, 0, 1]); }
    else dirs = tetra3(nrm(sub(next, C[i])), [0, (i % 2 ? 1 : -1), 0]);
    dirs.forEach(function(dd){ at.push(At("H", add(C[i], mul(dd, 1.09)))); bd.push({a:i, b:at.length - 1}); });
  }
  var Na = add(at[14].p, mul(nrm(sub(at[14].p, S1)), 2.4)); at.push(At("Na", Na, {lab:"Na⁺", r:0.55}));
  var ctr = [0, 0, 0]; at.forEach(function(a){ ctr = add(ctr, a.p); }); ctr = mul(ctr, 1 / at.length);
  at.forEach(function(a){ a.p = sub(a.p, ctr); });
  return {at:at, bd:bd};
}
SFA.sim({
  id:"org-savon-micelle-3d", ch:"c10", tag:"Acides et dérivés",
  titre:"Le savon et la micelle",
  resume:"Une cuvette d'eau, une goutte d'huile, et du tensioactif qu'on ajoute : les molécules se placent d'abord à la surface, puis, au-dessus de la concentration micellaire critique (CMC), s'assemblent en micelles qui emprisonnent l'huile. Fais tourner une micelle coupée en deux.",
  but:"Augmente la concentration du tensioactif (dodécylsulfate de sodium, SDS) et regarde la cuvette : surface, molécules libres, micelles, gouttelettes d'huile. Passe la CMC (8,2 mmol/L) et compare la tension superficielle sur le graphique. Glisse sur la loupe pour tourner la micelle ; coupe-la pour voir son cœur.",
  aRetenir:"Un savon (carboxylate de sodium R–COO⁻ Na⁺, obtenu par saponification d'un triglycéride) ou un détergent comme le SDS (R–OSO₃⁻ Na⁺) est amphiphile : une tête ionique hydrophile et une longue queue carbonée hydrophobe. À faible concentration, les molécules se placent à la surface, tête dans l'eau et queue dans l'air : la tension superficielle diminue. Quand la surface est saturée, au-dessus de la concentration micellaire critique (CMC ≈ 8,2 mmol/L pour le SDS à 25 °C), les molécules en plus s'assemblent en micelles (≈ 60 molécules pour le SDS) : têtes vers l'eau, queues au centre. La concentration en molécules libres reste alors égale à la CMC, et γ ne baisse plus. Le cœur hydrophobe des micelles accueille l'huile : c'est ainsi que le savon lave.",
  piege:"Ajouter du savon au-delà de la CMC ne fait plus baisser la tension superficielle : le surplus part dans les micelles, pas à la surface. Une micelle n'est pas une bulle : elle n'a pas d'air ni d'eau à l'intérieur, son cœur est fait des chaînes carbonées. Et l'huile ne se « dissout » pas dans l'eau : elle est cachée au cœur des micelles, entourée de têtes ioniques qui, elles, aiment l'eau.",
  build:function(k, S){
    var c = respCanvas(k, 0.86, 1.55), gC = k.canvas(150), st = {a:0.4, b:0.35, t:0, e:0, hold:0, drop:1};
    dragView(c, st); st.onview = function(){ st.manual = true; };
    var cS = k.slider("Concentration du tensioactif (SDS)", 0, 25, 0.1, 12, "mmol/L");
    var cutT = k.toggle("Couper la micelle en deux", true);
    var spT = k.toggle("Rotation automatique", true, function(v){ if (v) st.manual = false; });
    k.button("Nouvelle goutte d'huile", function(){ st.e = 0; st.hold = 0; st.drop = 0; }, true);
    var ro = k.readouts(["Molécules libres", "Dans les micelles", "Micelles par mL", "Tension superficielle γ"]);
    var nt = k.note("", "ok");
    var M0 = micModel(false), M1 = micModel(true), SDS = sdsMol(), OILP = [[0, 0, 0]];
    [[0.24, 10], [0.44, 26]].forEach(function(L){ var n = L[1], ga = PI * (3 - Math.sqrt(5)); for (var i = 0; i < n; i++){ var y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y); OILP.push(mul([r * Math.cos(i * ga), y, r * Math.sin(i * ga)], L[0])); } });
    var MONO = gridScatter(14, 7, 21), MICS = gridScatter(12, 4, 31), DROPS = gridScatter(6, 3, 41);
    var lp = k.loop(function(dt){
      st.t += dt; var cc = cS.value;
      if (spT.value && !st.drag && !st.manual) st.a += dt * 0.28;
      if (st.drop < 1){ st.drop = Math.min(1, st.drop + dt / 1.1); }
      else if (cc > MIC.CMC){ if (st.e < 1) st.e = Math.min(1, st.e + dt * 0.16 * (cc - MIC.CMC) / MIC.CMC); else { st.hold += dt; if (st.hold > 5){ st.e = 0; st.hold = 0; st.drop = 0; } } }
      k.redraw();
    });
    lp.play();
    function tadpole(ctx, x, y, ang, s, al){
      /* tête ionique (rouge) et queue carbonée (grise), vue simplifiée */
      ctx.save(); ctx.globalAlpha = al == null ? 1 : al; ctx.translate(x, y); ctx.rotate(ang);
      ctx.strokeStyle = "#5d6878"; ctx.lineWidth = 2.2 * s; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0);
      for (var q = 1; q <= 6; q++) ctx.lineTo(q * 3.2 * s, (q % 2 ? 1.6 : -1.6) * s); ctx.stroke();
      ball(ctx, 0, 0, 3.6 * s, "#d6392f"); ctx.restore();
    }
    function miniMicelle(ctx, x, y, R, rot, oil){
      if (oil){ var go = ctx.createRadialGradient(x - R * 0.2, y - R * 0.2, 1, x, y, R * 0.62); go.addColorStop(0, "#fff3b0"); go.addColorStop(1, "#e7b928"); ctx.fillStyle = go; ctx.beginPath(); ctx.arc(x, y, R * 0.6, 0, 7); ctx.fill(); }
      var n = oil ? 16 : 12;
      for (var q = 0; q < n; q++){ var a = rot + q * 2 * PI / n, cx = Math.cos(a), cy = Math.sin(a);
        ctx.strokeStyle = "#5d6878"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + cx * R * 0.92, y + cy * R * 0.92); ctx.lineTo(x + cx * R * (oil ? 0.6 : 0.18), y + cy * R * (oil ? 0.6 : 0.18)); ctx.stroke();
        ball(ctx, x + cx * R, y + cy * R, Math.max(2, R * 0.16), "#d6392f"); }
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, cc = cS.value, above = cc > MIC.CMC;
      labWall(ctx, W, H, "#eef3f7", "#dbe4ec");
      var banH = ph ? 70 : 62, benchY = H - banH - 16;
      bench(ctx, W, benchY, H);
      /* cuvette en verre (légère perspective) */
      var tx0 = ph ? 18 : 16, tx1 = ph ? W - 30 : W * 0.5, tTop = ph ? H * 0.5 : H * 0.2, tBot = benchY - 4, dx = 16, dy = -10;
      var wS = tTop + (tBot - tTop) * 0.2;
      floorShadow(ctx, (tx0 + tx1) / 2, benchY + 2, (tx1 - tx0) * 0.6, 7, 0.3);
      /* face arrière et fond */
      ctx.save(); ctx.fillStyle = "rgba(215,228,240,.55)"; ctx.fillRect(tx0 + dx, tTop + dy, tx1 - tx0, tBot - tTop); ctx.restore();
      /* eau (face avant) */
      var gw = ctx.createLinearGradient(0, wS, 0, tBot); gw.addColorStop(0, "rgba(170,205,238,.65)"); gw.addColorStop(1, "rgba(120,170,225,.85)");
      ctx.fillStyle = gw; ctx.fillRect(tx0, wS, tx1 - tx0, tBot - wS);
      /* surface de l'eau (parallélogramme) */
      ctx.fillStyle = "rgba(200,225,246,.9)"; ctx.beginPath(); ctx.moveTo(tx0, wS); ctx.lineTo(tx0 + dx, wS + dy); ctx.lineTo(tx1 + dx, wS + dy); ctx.lineTo(tx1, wS); ctx.closePath(); ctx.fill();
      label(ctx, "air", tx0 + 14, tTop + 6, {size:11, weight:800, col:"#8a95a3", align:"left"});
      label(ctx, "eau", tx0 + 12, tBot - 14, {size:11, weight:800, col:"#2a56c6", align:"left"});
      /* tensioactifs à la surface (tête dans l'eau, queue dans l'air) */
      var e = above ? st.e : st.e, lensR = (tx1 - tx0) * 0.26 * (1 - e) * ease(st.drop), lx = tx0 + (tx1 - tx0) * 0.62;
      var th = micTheta(cc), nSurf = Math.round(16 * th), sx0 = tx0 + 10, sx1 = tx1 - 6;
      for (var q = 0; q < nSurf; q++){
        var x = sx0 + (q + 0.5) / 16 * (sx1 - sx0) * 1.0, slot = Math.round(q * 16 / Math.max(1, nSurf));
        x = sx0 + (slot + 0.5) / 16 * (sx1 - sx0);
        if (Math.abs(x - lx) < lensR + 4) continue;
        tadpole(ctx, x, wS + 4, -PI / 2 + 0.15 * Math.sin(st.t * 1.3 + q), 1.1);
      }
      /* lentille d'huile qui flotte */
      if (lensR > 1){
        var go = ctx.createRadialGradient(lx - lensR * 0.3, wS - 4, 2, lx, wS, lensR);
        go.addColorStop(0, "#fff4b8"); go.addColorStop(0.6, "#f0c83c"); go.addColorStop(1, "#c99a16");
        ctx.fillStyle = go; ctx.beginPath(); ctx.ellipse(lx, wS + 1, lensR, Math.max(3, lensR * 0.22), 0, 0, 7); ctx.fill();
        ctx.strokeStyle = "rgba(150,110,10,.6)"; ctx.lineWidth = 1; ctx.stroke();
        label(ctx, "huile", lx, wS - Math.max(3, lensR * 0.22) - 10, {size:10.5, weight:800, col:"#8a6a00"});
      }
      /* goutte qui tombe */
      if (st.drop < 1){ var dyy = lerp(tTop - 30, wS - 4, ease(st.drop * 1.3)); if (st.drop < 0.77){ ball(ctx, lx, dyy, 7, "#f0c83c"); } }
      /* molécules libres (≤ CMC) */
      var nMono = Math.round(14 * Math.min(cc, MIC.CMC) / MIC.CMC), bx = tx0 + 10, bw = tx1 - tx0 - 20, byy = wS + 22, bh = tBot - wS - 40;
      MONO.slice(0, nMono).forEach(function(m, i){ tadpole(ctx, bx + (m.x + 0.03 * Math.sin(st.t * 0.7 + m.r * 3)) * bw, byy + (m.y + 0.03 * Math.cos(st.t * 0.6 + m.r * 4)) * bh, m.r + st.t * 0.4, 0.9); });
      /* micelles (au-dessus de la CMC) et gouttelettes d'huile enrobées */
      var nMic = above ? Math.min(12, Math.round((cc - MIC.CMC) / 1.4) + 1) : 0, nDrop = Math.round(6 * e * (above ? 1 : 0)), rm = ph ? 9 : 9.5;
      MICS.slice(0, nMic).forEach(function(m, i){ miniMicelle(ctx, bx + 10 + (m.x * 0.9 + 0.02 * Math.sin(st.t * 0.5 + m.r * 2)) * (bw - 20), byy + 8 + (m.y * 0.9 + 0.02 * Math.cos(st.t * 0.4 + m.r * 3)) * (bh - 16), rm, st.t * 0.6 + m.r, false); });
      DROPS.slice(0, nDrop).forEach(function(m, i){ miniMicelle(ctx, bx + 16 + (m.x * 0.85 + 0.02 * Math.sin(st.t * 0.4 + m.r)) * (bw - 32), byy + 14 + (m.y * 0.8 + 0.02 * Math.cos(st.t * 0.35 + m.r * 2)) * (bh - 28), rm * 1.6, -st.t * 0.4 + m.r, true); });
      /* verre (par-dessus) */
      ctx.save();
      var gg = ctx.createLinearGradient(tx0, 0, tx1, 0); gg.addColorStop(0, "rgba(255,255,255,.35)"); gg.addColorStop(0.1, "rgba(255,255,255,.08)"); gg.addColorStop(0.9, "rgba(255,255,255,.05)"); gg.addColorStop(1, "rgba(255,255,255,.3)");
      ctx.fillStyle = gg; ctx.fillRect(tx0, tTop, tx1 - tx0, tBot - tTop);
      ctx.strokeStyle = "rgba(90,110,135,.8)"; ctx.lineWidth = 1.6; ctx.strokeRect(tx0, tTop, tx1 - tx0, tBot - tTop);
      ctx.lineWidth = 1.1; ctx.strokeStyle = "rgba(90,110,135,.55)"; ctx.beginPath(); ctx.moveTo(tx0, tTop); ctx.lineTo(tx0 + dx, tTop + dy); ctx.lineTo(tx1 + dx, tTop + dy); ctx.lineTo(tx1, tTop); ctx.moveTo(tx1 + dx, tTop + dy); ctx.lineTo(tx1 + dx, tBot + dy); ctx.lineTo(tx1, tBot); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx0 + 6, tTop + 10); ctx.lineTo(tx0 + 6, tBot - 12); ctx.stroke();
      ctx.restore();
      /* loupe : micelle 3D (ou molécule isolée sous la CMC) */
      var box = ph ? {x:8, y:8, w:W - 16, h:tTop - 32} : {x:W * 0.53, y:10, w:W * 0.47 - 10, h:benchY - 22};
      var from = above ? (nDrop ? [bx + 16 + DROPS[0].x * 0.85 * (bw - 32), byy + 14 + DROPS[0].y * 0.8 * (bh - 28)] : [bx + 10 + MICS[0].x * 0.9 * (bw - 20), byy + 8 + MICS[0].y * 0.9 * (bh - 16)]) : [bx + MONO[0].x * bw, byy + MONO[0].y * bh];
      loupe(ctx, box, from, "#d6392f");
      loupeFrame(ctx, box, "#f6fbff", "#d8e8f6");
      clipBox(ctx, box);
      var V, items = [];
      if (above){
        var Mm = nDrop ? M1 : M0, sc = Math.min(box.w, box.h) / (2 * (Mm.Rh + 0.55)), cx = box.x + box.w / 2, cy = box.y + box.h / 2 + 8;
        V = {st:st, sc:sc, cx:cx, cy:cy};
        var cut = cutT.value;
        Mm.list.forEach(function(s, i){
          if (cut && s.head[2] > 0.02) return;
          var P = s.beads.map(function(b){ return proj3(b, st, sc, cx, cy); }), Ph = proj3(s.head, st, sc, cx, cy);
          var zt = P.reduce(function(a, p){ return a + p.z; }, 0) / P.length;
          items.push({z:zt, f:function(){
            ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.strokeStyle = "#4f5a69"; ctx.lineWidth = Math.max(2.4, sc * 0.085); ctx.beginPath(); P.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
            ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = Math.max(0.8, sc * 0.03); ctx.stroke(); ctx.restore();
          }});
          items.push({z:Ph.z, f:function(){ ball(ctx, Ph.x, Ph.y, Math.max(3.5, sc * 0.11 * Ph.s), "#d6392f"); }});
        });
        Mm.ions.forEach(function(io, j){ if (cut && io.d[2] * io.r > 0.1) return; var p = mul(io.d, io.r + 0.05 * Math.sin(st.t * 1.5 + io.ph)), Pp = proj3(p, st, sc, cx, cy); items.push({z:Pp.z, f:function(){ ball(ctx, Pp.x, Pp.y, Math.max(3, sc * 0.075 * Pp.s), "#8a63d2"); }}); });
        if (nDrop){
          /* huile : petites molécules apolaires qui remplissent le cœur (coupées avec la micelle) */
          OILP.forEach(function(q){ if (cut && q[2] > 0.02) return; var Pq = proj3(q, st, sc, cx, cy); items.push({z:Pq.z, f:function(){ ball(ctx, Pq.x, Pq.y, Math.max(3, sc * 0.12 * Pq.s), "#e9bd2c"); }}); });
        }
        if (cut){
          /* plan de coupe (z = 0 dans le repère de la micelle) */
          var ring = [], core = [];
          for (var a = 0; a < 48; a++){ var an = a / 48 * 2 * PI; ring.push(proj3([Mm.Rh * Math.cos(an), Mm.Rh * Math.sin(an), 0], st, sc, cx, cy)); core.push(proj3([(Mm.Rin + 0.12) * Math.cos(an), (Mm.Rin + 0.12) * Math.sin(an), 0], st, sc, cx, cy)); }
          var Pz = proj3([0, 0, 0], st, sc, cx, cy);
          items.push({z:Pz.z + 0.02, f:function(){
            ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = "#9fb4cc"; ctx.beginPath(); ring.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 0.7; ctx.strokeStyle = "#6f86a3"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.stroke(); ctx.restore();
          }});
        }
        items.sort(function(x, y){ return x.z - y.z; }); items.forEach(function(it){ it.f(); });
        ctx.restore();
        label(ctx, nDrop ? "micelle gonflée d'huile" : "micelle de SDS (" + MIC.Nagg + " molécules)", box.x + 10, box.y + 14, {size:11, weight:800, col:"#2c3a4e", align:"left", bg:"rgba(255,255,255,.85)"});
        var ly = box.y + box.h - 14;
        ball(ctx, box.x + 14, ly, 5, "#d6392f"); label(ctx, "tête –OSO₃⁻", box.x + 22, ly, {size:10.5, weight:800, col:"#b22e25", align:"left"});
        ball(ctx, box.x + (ph ? 112 : 104), ly, 5, "#8a63d2"); label(ctx, "Na⁺", box.x + (ph ? 120 : 112), ly, {size:10.5, weight:800, col:"#6a46b4", align:"left"});
        label(ctx, "queue C₁₂", box.x + box.w - 10, ly, {size:10.5, weight:800, col:"#4f5a69", align:"right"});
      } else {
        var sc2 = Math.min(box.w, box.h) / 25, V2 = {st:st, sc:sc2, cx:box.x + box.w / 2, cy:box.y + box.h / 2 + 6};
        drawScene(c, V2, SDS.at, SDS.bd);
        ctx.restore();
        label(ctx, "molécule isolée de SDS", box.x + 10, box.y + 14, {size:11, weight:800, col:"#2c3a4e", align:"left", bg:"rgba(255,255,255,.85)"});
        wrapLabel(ctx, "sous la CMC : pas encore de micelle", box.x + box.w / 2, box.y + box.h - 16, box.w - 10, {size:10.5, weight:800, col:"#5f6b7a"});
      }
      if (!ph && box.w > 330) label(ctx, "glisse pour tourner", box.x + box.w - 8, box.y + 14, {size:10, col:"#8a95a3", align:"right"});
      /* bandeau */
      var title = cc <= 0 ? "Eau pure : l'huile flotte" : !above ? "Sous la CMC : le tensioactif va à la surface" : (st.e < 1 ? "Au-dessus de la CMC : des micelles se forment" : "L'huile est emprisonnée dans les micelles");
      var sub2 = cc <= 0 ? "L'huile, apolaire, ne se mélange pas à l'eau : elle forme une lentille en surface" : !above ? "Tête ionique dans l'eau, queue dans l'air : " + F(th * 100, 0) + " % de la surface est occupée et γ descend à " + F(micGamma(cc), 1) + " mN/m" : "Libres : " + F(MIC.CMC, 1) + " mmol/L (la CMC) ; le surplus, " + F(cc - MIC.CMC, 1) + " mmol/L, forme des micelles dont le cœur accueille l'huile";
      bannerBox(ctx, W, H - banH - 6, banH, title, sub2, above ? "#d6392f" : "#2a6fdb", ph);
      /* lectures */
      var free = Math.min(cc, MIC.CMC), inm = Math.max(0, cc - MIC.CMC), nmL = inm * 1e-3 / MIC.Nagg * MIC.NA / 1000;
      ro.set(0, F(free, 1) + " mmol/L");
      ro.set(1, inm > 0 ? F(inm, 1) + " mmol/L (" + F(inm / cc * 100, 0) + " %)" : "aucune micelle");
      ro.set(2, nmL > 0 ? sci(nmL, 1) : "0");
      ro.set(3, F(micGamma(cc), 1) + " mN/m");
      var aire = 1 / (MIC.Gmax * MIC.NA) * 1e18;
      nt.set(above ? "Au-dessus de la CMC, la concentration en molécules libres reste " + F(MIC.CMC, 1) + " mmol/L. Le surplus (" + F(inm, 1) + " mmol/L) forme des micelles de " + MIC.Nagg + " molécules : " + F(inm, 1) + "·10⁻³ / " + MIC.Nagg + " × 6,022·10²³ = " + sci(nmL * 1000, 2) + " micelles par litre, soit " + sci(nmL, 2) + " par mL. La surface est saturée (une tête pour ≈ " + F(aire, 2) + " nm²) : γ ne baisse plus. <i>γ : modèle de Szyszkowski ajusté (γ₀ = 72,0 mN/m, γ(CMC) = 39 mN/m) ; le nombre de micelles dessinées est symbolique.</i>"
        : "Sous la CMC, les molécules ajoutées restent libres dans l'eau et une petite partie se fixe à la surface : " + F(th * 100, 0) + " % de la surface occupée, γ = " + F(micGamma(cc), 1) + " mN/m (eau pure : 72,0). Aucune micelle, et l'huile reste en lentille. <i>γ : modèle de Szyszkowski ajusté (Γmax = 3,2 µmol/m²).</i>", "ok");
      drawGamma(cc);
    });
    function drawGamma(cc){
      var ctx = gC.ctx, W = gC.W, H = gC.H, ax = plotFrame(gC, {x0:0, x1:25, y0:30, y1:75, l:40, r:14, t:24, b:26});
      label(ctx, "Tension superficielle γ (mN/m) selon c (mmol/L)", 10, 11, {size:11.5, weight:800, col:"#2c3a4e", align:"left"});
      ctx.save(); ctx.strokeStyle = "#e6ebf1"; ctx.lineWidth = 1; ctx.font = "700 10px " + FONT; ctx.fillStyle = "#7b8694";
      [30, 40, 50, 60, 70].forEach(function(v){ ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(v)); ctx.lineTo(ax.R, ax.Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(String(v), ax.L - 5, ax.Y(v)); });
      [0, 5, 10, 15, 20, 25].forEach(function(v){ ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(String(v), ax.X(v), ax.B + 5); });
      ctx.strokeStyle = "#d6392f"; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ax.X(MIC.CMC), ax.T); ctx.lineTo(ax.X(MIC.CMC), ax.B); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "#2a6fdb"; ctx.lineWidth = 2.6; ctx.beginPath();
      for (var i = 0; i <= 250; i++){ var x = i / 10; if (i) ctx.lineTo(ax.X(x), ax.Y(micGamma(x))); else ctx.moveTo(ax.X(x), ax.Y(micGamma(x))); }
      ctx.stroke(); ctx.restore();
      label(ctx, "CMC = 8,2", ax.X(MIC.CMC) + 6, ax.T + 8, {size:10.5, weight:800, col:"#b22e25", align:"left"});
      ball(ctx, ax.X(cc), ax.Y(micGamma(cc)), 6, "#e08a1e");
    }
  }
});

/* ====================================================================== */
/* 4. Basicité des amines : le doublet est-il libre ?                      */
/* ====================================================================== */
var AM = [
  {k:"nh3", n:"ammoniac", f:"NH₃", pk:9.25, t:"amine", subs:["H", "H", "H"], dbl:"sp³, localisé sur N", col:"#5f8fd8"},
  {k:"me1", n:"méthylamine", f:"CH₃NH₂", pk:10.64, t:"amine", subs:["C", "H", "H"], dbl:"sp³, enrichi par CH₃ (+I)", col:"#2a6fdb"},
  {k:"me2", n:"diméthylamine", f:"(CH₃)₂NH", pk:10.73, t:"amine", subs:["C", "C", "H"], dbl:"sp³, enrichi par 2 CH₃", col:"#1f4fae"},
  {k:"me3", n:"triméthylamine", f:"(CH₃)₃N", pk:9.80, t:"amine", subs:["C", "C", "C"], dbl:"sp³, mais BH⁺ mal solvaté", col:"#6a46b4"},
  {k:"ani", n:"aniline", f:"C₆H₅NH₂", pk:4.6, t:"aniline", dbl:"délocalisé dans le cycle", col:"#d0782a"},
  {k:"pyr", n:"pyridine", f:"C₅H₅N", pk:5.2, t:"pyridine", dbl:"sp² (33 % s), dans le plan", col:"#c0392b"}
];
AM.forEach(function(a){ a.Kb = Math.pow(10, a.pk - 14); });
function amFrac(pk, pH){ return 1 / (1 + Math.pow(10, pH - pk)); }   /* fraction protonée BH⁺ */
/* géométrie d'une amine à l'instant de l'inversion s (+1 : doublet vers +y, −1 : vers −y) */
function amGeo(A, s, hp){
  var at = [], bd = [], lp = null, i, extra = {};
  if (A.t === "amine"){
    var cth = -0.3338 * s, sth = Math.sqrt(1 - cth * cth);
    at.push(At("N", [0, 0, 0]));
    A.subs.forEach(function(e, j){
      var ph = j * 2 * PI / 3 + PI / 2, d = [sth * Math.cos(ph), cth, sth * Math.sin(ph)];
      var L = e === "C" ? 1.47 : 1.01, p = mul(d, L), ix = at.length;
      at.push(At(e, p)); bd.push({a:0, b:ix});
      if (e === "C") tetra3(mul(d, -1), [0, 1, 0]).forEach(function(dd){ at.push(At("H", add(p, mul(dd, 1.09)))); bd.push({a:ix, b:at.length - 1}); });
    });
    lp = {base:[0, 0, 0], dir:[0, s >= 0 ? 1 : -1, 0], amp:Math.abs(s)};
    if (hp != null){ var hpos = [0, 1.02 * (s >= 0 ? 1 : -1), 0]; extra.hp = hpos; }
  } else if (A.t === "aniline"){
    /* N en haut, cycle dans le plan xy en dessous ; doublet quasi p (selon z) délocalisé */
    var w = 0.28 * s;
    at.push(At("N", [0, 0, 0]));
    var c1 = [0, -1.40, 0]; at.push(At("C", c1)); bd.push({a:0, b:1});
    [[0.87, 0.50, w], [-0.87, 0.50, w]].forEach(function(d){ at.push(At("H", mul(nrm(d), 1.01))); bd.push({a:0, b:at.length - 1}); });
    var R = 1.39, cy = c1[1] - R, ring = [];
    for (i = 0; i < 6; i++){ var an = PI / 2 + i * PI / 3; ring.push([R * Math.cos(an), cy + R * Math.sin(an), 0]); }
    var idx = [1]; for (i = 1; i < 6; i++){ at.push(At("C", ring[i])); idx.push(at.length - 1); }
    for (i = 0; i < 6; i++) bd.push({a:idx[i], b:idx[(i + 1) % 6], o:i % 2 ? 2 : 1});
    for (i = 1; i < 6; i++){ var dH = nrm(sub(ring[i], [0, cy, 0])); at.push(At("H", add(ring[i], mul(dH, 1.08)))); bd.push({a:idx[i], b:at.length - 1}); }
    lp = {base:[0, 0, 0], dir:[0, 0, s >= 0 ? -1 : 1], amp:0.55, p:true};
    extra.ring = ring; extra.cy = cy;
    if (hp != null) extra.hp = [0, 0.35, -0.95];
  } else {
    /* pyridine : N en haut du cycle, doublet sp² dans le plan, vers l'extérieur */
    var R2 = 1.39, ring2 = [];
    for (i = 0; i < 6; i++){ var an2 = PI / 2 + i * PI / 3; ring2.push([R2 * Math.cos(an2), -R2 + R2 * Math.sin(an2), 0]); }
    at.push(At("N", ring2[0])); var id2 = [0];
    for (i = 1; i < 6; i++){ at.push(At("C", ring2[i])); id2.push(at.length - 1); }
    for (i = 0; i < 6; i++) bd.push({a:id2[i], b:id2[(i + 1) % 6], o:i % 2 ? 2 : 1});
    for (i = 1; i < 6; i++){ var dH2 = nrm(sub(ring2[i], [0, -R2, 0])); at.push(At("H", add(ring2[i], mul(dH2, 1.08)))); bd.push({a:id2[i], b:at.length - 1}); }
    lp = {base:ring2[0], dir:[0, 1, 0], amp:1};
    extra.ring = ring2; extra.cy = -R2;
    if (hp != null) extra.hp = [0, 1.01, 0];
  }
  return {at:at, bd:bd, lp:lp, x:extra};
}
SFA.sim({
  id:"org-basicite-amines-3d", ch:"L12", tag:"Amines",
  titre:"Basicité des amines : le doublet est-il libre ?",
  resume:"L'ammoniac, trois méthylamines, l'aniline et la pyridine en 3D, avec leur doublet non liant. Regarde l'azote s'inverser comme un parapluie, place chaque amine sur la règle des pKaH et vois pourquoi le doublet de l'aniline, délocalisé dans le cycle, capte si mal un proton.",
  but:"Choisis une amine (menu ou clic sur la règle) : elle tourne en 3D, son doublet en orange. En vue « Inversion », l'azote se retourne comme un parapluie. En vue « Protonation », un H⁺ vient se fixer sur le doublet, plus ou moins longtemps selon le pH : glisse le repère de pH sur la règle (ou le curseur) et compare les pourcentages de forme protonée.",
  aRetenir:"Une amine est une base de Brønsted grâce au doublet non liant de l'azote : B + H₂O ⇄ BH⁺ + HO⁻. On compare les bases par le pKa de leur acide conjugué (pKaH) : plus il est grand, plus la base est forte (Kb = 10^(pKaH − 14)). Les groupes alkyles (+I) enrichissent le doublet : méthylamine 10,64 et diméthylamine 10,73 > ammoniac 9,25 ; la triméthylamine (9,80) est moins basique que prévu, car son ion (CH₃)₃NH⁺ n'a qu'un seul N–H pour être stabilisé par l'eau. Dans l'aniline (4,6), le doublet est délocalisé dans le cycle (mésomérie) : il est moins disponible. Dans la pyridine (5,2), le doublet est dans une orbitale sp² (plus de caractère s, plus proche du noyau). À un pH donné, la fraction protonée vaut 1 / (1 + 10^(pH − pKaH)).",
  piege:"Le pKa qu'on donne pour une amine est celui de son acide conjugué BH⁺, pas celui de l'amine : un grand pKaH veut dire une base forte. Le doublet de la pyridine n'est pas délocalisé (il est dans le plan du cycle, il ne fait pas partie du nuage π) : la pyridine est faiblement basique pour une autre raison que l'aniline. Et l'inversion de l'azote est trop rapide (≈ 10¹⁰ fois par seconde pour NH₃) pour isoler les deux « parapluies » : une amine à trois groupes différents ne se dédouble pas en énantiomères.",
  build:function(k, S){
    var c = respCanvas(k, 0.9, 1.5), st = {a:0.5, b:0.3, t:0, inv:0, pt:0, dragPH:false};
    var amS = k.select("Amine", AM.map(function(a, i){ return [String(i), a.n + " (" + a.f + ")"]; }), "0", function(){ st.pt = 0; });
    var vS = k.seg("Vue", [["inv", "Inversion du doublet"], ["prot", "Protonation au pH choisi"]], "inv", function(){ st.pt = 0; });
    var pS = k.slider("pH de la solution", 1, 13, 0.05, 7.4, "", function(){ st.pt = 0; });
    var spT = k.toggle("Rotation automatique", true, function(v){ if (v) st.manual = false; });
    var ro = k.readouts(["pKaH (BH⁺/B)", "Kb = 10^(pKaH − 14)", "Forme protonée BH⁺ au pH choisi", "Doublet de l'azote"]);
    var nt = k.note("", "ok");
    var geom = null;
    dragView(c, st, function(type, p){
      if (!geom) return false;
      var R = geom.ruler;
      if (type === "down"){
        if (p.y > R.y - 70 && p.y < R.y + R.h + 34){
          /* au-dessus de la règle : jetons des amines ; dessous : repère de pH */
          var best = -1, bd = 26; AM.forEach(function(a, i){ var x = R.X(a.pk), y = R.tokY(i); var d = Math.hypot(p.x - x, (p.y - y) * 1.4); if (d < bd){ bd = d; best = i; } });
          if (p.y < R.y + 2){ if (best >= 0){ amS.set(String(best)); st.pt = 0; k.redraw(); return true; } return false; }
          st.dragPH = true; pS.set(clamp(R.V(p.x), 1, 13)); st.pt = 0; k.redraw(); return true;
        }
        return false;
      }
      if (type === "drag" && st.dragPH){ pS.set(Math.round(clamp(R.V(p.x), 1, 13) * 20) / 20); st.pt = 0; k.redraw(); return true; }
      if (type === "up"){ st.dragPH = false; return true; }
      return false;
    });
    st.onview = function(){ st.manual = true; };
    var lp = k.loop(function(dt){ st.t += dt; st.pt += dt; if (spT.value && !st.drag && !st.manual){ if (AM[+amS.value].t === "amine") st.a += dt * 0.32; else { st.osc = (st.osc || 0) + dt; st.a = 0.25 + 0.7 * Math.sin(st.osc * 0.45); } } k.redraw(); });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, A = AM[+amS.value], pH = pS.value, fP = amFrac(A.pk, pH), view = vS.value;
      labWall(ctx, W, H, "#eef3f7", "#dbe3ec");
      var banH = ph ? 70 : 62, by = H - banH - 6;
      /* règle des pKaH (en bois) */
      var Rr = {x0:ph ? 22 : 30, x1:W - (ph ? 22 : 30), y:by - (ph ? 70 : 74), h:22, lo:3, hi:12};
      Rr.X = function(v){ return Rr.x0 + (v - Rr.lo) / (Rr.hi - Rr.lo) * (Rr.x1 - Rr.x0); };
      Rr.V = function(x){ return Rr.lo + (x - Rr.x0) / (Rr.x1 - Rr.x0) * (Rr.hi - Rr.lo); };
      var LEV = {ani:0, pyr:1, nh3:0, me3:1, me1:0, me2:2};
      Rr.tokY = function(i){ return Rr.y - 11 - 17 * LEV[AM[i].k]; };
      var benchY = Rr.y - 68;
      bench(ctx, W, benchY + (ph ? 0 : 0), H);
      /* scène : bécher + pH-mètre */
      var bw = ph ? W * 0.26 : W * 0.24, bx = ph ? 16 : 22, bTop = ph ? benchY - bw * 1.05 : benchY - bw * 1.15, bBot = benchY - 2;
      var box = ph ? {x:8, y:8, w:W - 16, h:bTop - 22} : {x:W * 0.33, y:10, w:W * 0.67 - 10, h:benchY - 18};
      floorShadow(ctx, bx + bw / 2, benchY + 3, bw * 0.7, 6, 0.35);
      var lvl = bTop + (bBot - bTop) * 0.3;
      var gl = ctx.createLinearGradient(0, lvl, 0, bBot); gl.addColorStop(0, "rgba(190,215,240,.75)"); gl.addColorStop(1, "rgba(150,190,230,.9)");
      ctx.fillStyle = gl; rr(ctx, bx + 2, lvl, bw - 4, bBot - lvl - 1, [0, 0, 8, 8]); ctx.fill();
      /* 20 molécules : B (orange) ou BH+ (bleu) selon la fraction protonée */
      var nP = Math.round(20 * fP), pts = gridScatter(20, 5, 3);
      pts.forEach(function(m, i){ var x = bx + 8 + (m.x + 0.03 * Math.sin(st.t + m.r * 3)) * (bw - 16), y = lvl + 8 + (m.y + 0.03 * Math.cos(st.t * 0.8 + m.r * 5)) * (bBot - lvl - 16); ball(ctx, x, y, Math.max(3, bw * 0.045), i < nP ? "#2a56c6" : "#e08a1e"); });
      ctx.save(); var gb = ctx.createLinearGradient(bx, 0, bx + bw, 0); gb.addColorStop(0, "rgba(255,255,255,.4)"); gb.addColorStop(0.15, "rgba(255,255,255,.08)"); gb.addColorStop(0.85, "rgba(255,255,255,.06)"); gb.addColorStop(1, "rgba(255,255,255,.35)");
      ctx.fillStyle = gb; rr(ctx, bx, bTop, bw, bBot - bTop, [2, 2, 9, 9]); ctx.fill(); ctx.strokeStyle = "rgba(90,110,135,.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx, bTop); ctx.lineTo(bx, bBot - 9); ctx.quadraticCurveTo(bx, bBot, bx + 9, bBot); ctx.lineTo(bx + bw - 9, bBot); ctx.quadraticCurveTo(bx + bw, bBot, bx + bw, bBot - 9); ctx.lineTo(bx + bw, bTop); ctx.stroke(); ctx.restore();
      /* électrode et boîtier du pH-mètre */
      var ex = bx + bw * 0.72;
      ctx.save(); var ge = ctx.createLinearGradient(ex - 4, 0, ex + 4, 0); ge.addColorStop(0, "#8b96a4"); ge.addColorStop(0.5, "#e8edf2"); ge.addColorStop(1, "#7c8795"); ctx.fillStyle = ge; ctx.fillRect(ex - 4, bTop - 34, 8, bBot - bTop + 20); ball(ctx, ex, bBot - 12, 6, "#cfe3f2"); ctx.restore();
      var mx = ph ? bx + bw + 12 : bx + 4, my = ph ? bBot - 54 : bTop - 92, mw = ph ? 86 : 92, mh = 50;
      if (!ph){ ctx.save(); ctx.strokeStyle = "#2b2f36"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, bTop - 34); ctx.quadraticCurveTo(ex, my + mh + 6, mx + mw * 0.6, my + mh); ctx.stroke(); ctx.restore(); }
      ctx.save(); var gm = ctx.createLinearGradient(0, my, 0, my + mh); gm.addColorStop(0, "#f2f4f7"); gm.addColorStop(1, "#c8cfd8"); ctx.fillStyle = gm; ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 8; rr(ctx, mx, my, mw, mh, 8); ctx.fill(); ctx.restore();
      ctx.fillStyle = "#1b2a1f"; rr(ctx, mx + 7, my + 7, mw - 14, 24, 4); ctx.fill();
      label(ctx, "pH " + F(pH, 2), mx + mw / 2, my + 19, {size:13, weight:800, col:"#7dff9b"});
      label(ctx, "pH-mètre", mx + mw / 2, my + 41, {size:9.5, weight:800, col:"#5f6b7a"});
      if (ph){
        label(ctx, A.n, mx, my - 34, {size:12, weight:800, col:"#13233a", align:"left"});
        ball(ctx, mx + mw + 14, my + 12, 5, "#2a56c6"); label(ctx, "BH⁺ " + nP, mx + mw + 22, my + 12, {size:11.5, weight:800, col:"#2a56c6", align:"left"});
        ball(ctx, mx + mw + 14, my + 34, 5, "#e08a1e"); label(ctx, "B " + (20 - nP), mx + mw + 22, my + 34, {size:11.5, weight:800, col:"#b86b00", align:"left"});
      } else {
        ball(ctx, bx + 8, bTop - 16, 5, "#2a56c6"); label(ctx, "BH⁺ " + nP, bx + 16, bTop - 16, {size:11, weight:800, col:"#2a56c6", align:"left"});
        ball(ctx, bx + 70, bTop - 16, 5, "#e08a1e"); label(ctx, "B " + (20 - nP), bx + 78, bTop - 16, {size:11, weight:800, col:"#b86b00", align:"left"});
      }
      /* état animé : inversion (amines sp3 et aniline) et protonation */
      var Tinv = 4.4, ti = st.t % Tinv, s;
      if (A.t === "pyridine") s = 1;
      else { s = ti < 1.6 ? 1 : ti < 2.2 ? Math.cos(PI * ease((ti - 1.6) / 0.6)) : ti < 3.8 ? -1 : -Math.cos(PI * ease((ti - 3.8) / 0.6)); }
      var bound = 0, hpAl = 0, hpFar = 1, Tc = 6, ptc = st.pt % Tc;
      if (view === "prot"){
        var free = Tc - 1.6, tb = fP * free, tf = free - tb;
        if (fP < 0.03){ var ap = ptc < 1.2 ? ease(ptc / 1.2) : ptc < 2.4 ? 1 - ease((ptc - 1.2) / 1.2) : 0; hpFar = 1 - 0.75 * ap; hpAl = ap > 0 ? 1 : 0; bound = 0; }
        else if (fP > 0.97){ bound = 1; hpFar = 0; hpAl = 1; }
        else if (ptc < 0.8){ hpFar = 1 - ease(ptc / 0.8); hpAl = 1; bound = ptc > 0.7 ? 1 : 0; }
        else if (ptc < 0.8 + tb){ bound = 1; hpFar = 0; hpAl = 1; }
        else if (ptc < 1.6 + tb){ hpFar = ease((ptc - 0.8 - tb) / 0.8); hpAl = 1; }
        else { hpAl = 0; }
        if (bound) s = A.t === "pyridine" ? 1 : (A.t === "aniline" ? 1 : 1);
      }
      var G = amGeo(A, bound ? 1 : s, view === "prot" ? 1 : null);
      /* loupe */
      loupe(ctx, box, [bx + bw * 0.4, lvl + (bBot - lvl) * 0.4], "#2a6fdb");
      loupeFrame(ctx, box, "#ffffff", "#e3ebf5");
      clipBox(ctx, box);
      var Rm = A.t === "aniline" ? 3.4 : A.t === "pyridine" ? 2.8 : (A.subs.indexOf("C") >= 0 ? 2.25 : 1.45);
      var V = {st:st, sc:Math.min(box.w, box.h) / (2 * Rm) * 0.92, cx:box.x + box.w / 2, cy:box.y + box.h / 2 + (A.t === "amine" ? 6 : 0)};
      var ctrY = A.t === "aniline" ? -2.1 : A.t === "pyridine" ? -1.0 : 0;
      G.at.forEach(function(a){ a.p = sub(a.p, [0, ctrY, 0]); });
      var extra = [];
      /* nuage π du cycle */
      if (G.x.ring){
        var ringPts = []; for (var q = 0; q < 18; q++){ var an = q / 18 * 2 * PI; ringPts.push([1.39 * Math.cos(an), G.x.cy - ctrY + 1.39 * Math.sin(an), 0]); }
        var piCol = A.t === "aniline" ? "#e08a1e" : "#4d8af0";
        [0.75, -0.75].forEach(function(zz){ extra = extra.concat(cloudItems(ctx, V, ringPts.map(function(p){ return [p[0], p[1], zz]; }), 0.62, piCol, A.t === "aniline" ? 0.9 : 0.75, 0)); });
      }
      /* doublet non liant */
      var lpA = bound ? 0 : 1, base = sub(G.lp.base, [0, ctrY, 0]);
      if (lpA > 0){
        if (G.lp.p){ [1, -1].forEach(function(sg){ var dd = mul(G.lp.dir, sg); extra.push(lobeItem(ctx, V, base, dd, sg > 0 ? 0.95 : 0.75, 0.36, "#f2a33a", 0.62)); }); }
        else if (A.t === "amine" && Math.abs(s) < 0.999){ var am = Math.abs(s); [1, -1].forEach(function(sg){ var big = sg * (s >= 0 ? 1 : -1) > 0; extra.push(lobeItem(ctx, V, base, [0, sg, 0], 0.6 + (big ? 0.45 * am : -0.3 * am), 0.34, "#f2a33a", 0.8)); }); }
        else extra.push(lobeItem(ctx, V, base, G.lp.dir, 1.05, 0.38, "#f2a33a", 0.85));
      }
      /* H+ qui vient se fixer */
      var atoms = G.at.slice(), bonds = G.bd.slice();
      if (view === "prot" && hpAl > 0){
        var dirL = nrm(G.lp.p ? G.lp.dir : G.lp.dir), hp0 = add(base, mul(dirL, 1.02)), hp = add(hp0, mul(dirL, 3.2 * hpFar));
        var hi = atoms.length; atoms.push(At("H", hp, {alpha:bound ? 1 : Math.max(0, 1 - 1.5 * hpFar), badge:bound ? null : "+", badgeCol:"#c0392b", ring:"rgba(42,111,219,.9)"}));
        if (bound){ bonds.push({a:0, b:hi}); atoms[0] = At("N", atoms[0].p, {badge:"+", badgeCol:"#c0392b"}); }
        else if (hpFar < 0.35) bonds.push({a:0, b:hi, dash:true, alpha:0.7});
      }
      drawScene(c, V, atoms, bonds, extra);
      ctx.restore();
      label(ctx, A.n + " · " + A.f, box.x + 10, box.y + 14, {size:12, weight:800, col:"#13233a", align:"left", bg:"rgba(255,255,255,.88)"});
      if (!ph) label(ctx, "glisse pour tourner", box.x + box.w - 8, box.y + 14, {size:10, col:"#8a95a3", align:"right"});
      var tagL = A.t === "aniline" ? "doublet délocalisé dans le cycle" : A.t === "pyridine" ? "doublet sp², hors du nuage π" : bound ? "doublet engagé dans N–H⁺" : "doublet non liant";
      label(ctx, tagL, box.x + 10, box.y + box.h - 14, {size:10.5, weight:800, col:"#b86b00", align:"left", bg:"rgba(255,255,255,.85)"});
      /* règle */
      ctx.save(); var gw = ctx.createLinearGradient(0, Rr.y, 0, Rr.y + Rr.h); gw.addColorStop(0, "#e9c58e"); gw.addColorStop(0.5, "#d4a45f"); gw.addColorStop(1, "#b9874a");
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; ctx.fillStyle = gw; rr(ctx, Rr.x0 - 14, Rr.y, Rr.x1 - Rr.x0 + 28, Rr.h, 4); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = "rgba(70,45,15,.75)"; ctx.fillStyle = "rgba(60,38,12,.9)"; ctx.font = "800 10px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var v = Rr.lo; v <= Rr.hi + 1e-6; v += 0.5){ var xx = Rr.X(v), big = Math.abs(v - Math.round(v)) < 1e-6; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xx, Rr.y); ctx.lineTo(xx, Rr.y + (big ? 9 : 5)); ctx.stroke(); if (big) ctx.fillText(String(v), xx, Rr.y + 10); }
      ctx.restore();
      var capR = pS.value < 8;
      label(ctx, "pKaH →  base plus forte", capR ? Rr.x1 + 10 : Rr.x0 - 10, Rr.y + Rr.h + 13, {size:10.5, weight:800, col:"#e6ecf3", align:capR ? "right" : "left"});
      /* jetons des amines */
      AM.forEach(function(a, i){ var x = Rr.X(a.pk), y = Rr.tokY(i); ctx.save(); ctx.strokeStyle = a.col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + 7); ctx.lineTo(x, Rr.y); ctx.stroke(); ctx.restore(); });
      AM.forEach(function(a, i){
        var x = Rr.X(a.pk), y = Rr.tokY(i), on = a === A;
        ball(ctx, x, y, on ? 8 : 6, a.col);
        if (on){ ctx.save(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.stroke(); ctx.restore(); }
        var nm = ph ? a.f : a.n;
        var AL = {ani:["right", 6], pyr:["left", -6], nh3:["right", 6], me3:["right", 6], me1:["left", 10], me2:["center", 0]}[a.k];
        label(ctx, nm, x + AL[1], y - 13, {size:ph ? 9.5 : 10.5, weight:on ? 800 : 700, col:on ? "#13233a" : "#2c3a4e", bg:on ? "#ffffff" : "rgba(255,255,255,.93)", align:AL[0], border:on ? a.col : null});
      });
      /* repère de pH (déplaçable) */
      var xp = Rr.X(clamp(pH, Rr.lo, Rr.hi));
      ctx.save(); ctx.fillStyle = "#16a06a"; ctx.beginPath(); ctx.moveTo(xp, Rr.y + Rr.h + 1); ctx.lineTo(xp - 8, Rr.y + Rr.h + 13); ctx.lineTo(xp + 8, Rr.y + Rr.h + 13); ctx.closePath(); ctx.fill(); ctx.restore();
      label(ctx, "pH " + F(pH, 1), xp, Rr.y + Rr.h + 24, {size:10.5, weight:800, col:"#fff", bg:"#16a06a"});
      geom = {ruler:Rr};
      /* bandeau */
      var title, sub2;
      if (view === "inv"){
        title = A.t === "pyridine" ? "Pyridine : pas d'inversion, doublet dans le plan" : A.t === "aniline" ? "Aniline : le doublet se partage avec le cycle" : "L'azote s'inverse comme un parapluie";
        sub2 = A.t === "pyridine" ? "Le doublet occupe une orbitale sp² et pointe hors du cycle ; il ne participe pas au nuage π (bleu)" : A.t === "aniline" ? "L'azote est presque plan : son doublet recouvre le nuage π (orange) et se délocalise, il est moins disponible pour H⁺" : "Les trois groupes passent par un état plan (doublet dans une orbitale p) puis se retournent ; le doublet change de côté";
      } else {
        title = A.f + " + H₃O⁺ ⇄ " + (A.t === "pyridine" ? "C₅H₅NH⁺" : A.t === "aniline" ? "C₆H₅NH₃⁺" : A.k === "nh3" ? "NH₄⁺" : A.k === "me1" ? "CH₃NH₃⁺" : A.k === "me2" ? "(CH₃)₂NH₂⁺" : "(CH₃)₃NH⁺") + " + H₂O";
        sub2 = "À pH " + F(pH, 2) + " : " + (fP >= 0.9995 ? "> 99,9" : fP < 0.0005 ? "< 0,05" : F(fP * 100, fP < 0.01 ? 2 : 1)) + " % de forme protonée ; le H⁺ reste fixé sur le doublet ce même pourcentage du temps";
      }
      bannerBox(ctx, W, by, banH, title, sub2, A.col, ph);
      ro.set(0, F(A.pk, 2));
      ro.set(1, sci(A.Kb, 2));
      ro.set(2, fP >= 0.9995 ? "> 99,9 %" : fP < 0.0005 ? sci(fP * 100, 1) + " %" : F(fP * 100, fP < 0.01 ? 2 : 1) + " %");
      ro.set(3, A.dbl);
      var why = {nh3:"Référence : pKaH = 9,25.", me1:"Le groupe CH₃ (effet inductif donneur +I) enrichit le doublet : la méthylamine est 10^(10,64 − 9,25) ≈ " + F(Math.pow(10, 10.64 - 9.25), 0) + " fois plus basique que NH₃ (rapport des Kb).", me2:"Deux groupes donneurs : un peu plus basique encore (pKaH 10,73).", me3:"Trois groupes donneurs, mais l'ion (CH₃)₃NH⁺ n'a qu'un N–H pour faire des liaisons hydrogène avec l'eau : il est moins stabilisé, d'où pKaH = 9,80 seulement. En phase gazeuse (sans eau), elle est la plus basique des quatre.", ani:"Le doublet est délocalisé dans le cycle (mésomérie) : le capter coûte la conjugaison. Kb(aniline) / Kb(NH₃) = 10^(4,6 − 9,25) ≈ " + sci(Math.pow(10, 4.6 - 9.25), 1) + " : la basicité s'effondre.", pyr:"Le doublet est dans une orbitale sp² (33 % de caractère s, contre 25 % pour sp³) : plus proche du noyau, il est moins disponible. Mais il n'est pas délocalisé : la pyridine reste un peu plus basique que l'aniline."};
      nt.set(why[A.k] + " Fraction protonée : 1 / (1 + 10^(pH − pKaH)) = 1 / (1 + 10^(" + F(pH - A.pk, 2) + ")) = " + (fP >= 0.9995 ? "plus de 0,999" : fP < 0.0005 ? sci(fP, 1) : F(fP, 3)) + ". <i>pKaH à 25 °C dans l'eau ; géométries idéalisées, inversion ralentie.</i>", "ok");
    });
  }
});
})();
