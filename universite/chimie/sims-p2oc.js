/* Chimie BA1 · chimie organique (lot P2-OC) : ozonolyse, benzène et nuage π, ouverture d'un époxyde, addition nucléophile
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
  var o = b.o || 1, offs = o === 2 ? [-w * 0.85, w * 0.85] : o === 3 ? [-w * 1.35, 0, w * 1.35] : [0], lw = o === 1 ? w : w * 0.6;
  ctx.save(); ctx.globalAlpha = al; ctx.lineCap = "round";
  offs.forEach(function(of){
    var x0 = p.x + ox * of, y0 = p.y + oy * of, x1 = q.x + ox * of, y1 = q.y + oy * of;
    ctx.setLineDash(b.dash ? [lw * 1.5, lw * 1.3] : []);
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

/* ====================================================================== */
/* 1. Ozonolyse : couper la double liaison                                 */
/* ====================================================================== */
/* a : substituants du carbone Ca (côté gauche), b : ceux de Cb ; ordre [vers +z, vers −z] */
var OZA = {
  mb2:{n:"2-méthylbut-2-ène", f:"(CH₃)₂C=CH–CH₃", el:{C:5, H:10}, a:["CH3", "CH3"], b:["CH3", "H"],
    pA:{red:["propanone", {C:3, H:6, O:1}], ox:["propanone", {C:3, H:6, O:1}]}, pB:{red:["éthanal", {C:2, H:4, O:1}], ox:["acide éthanoïque", {C:2, H:4, O:2}]}},
  b2e:{n:"(E)-but-2-ène", f:"CH₃–CH=CH–CH₃", el:{C:4, H:8}, a:["CH3", "H"], b:["H", "CH3"],
    pA:{red:["éthanal", {C:2, H:4, O:1}], ox:["acide éthanoïque", {C:2, H:4, O:2}]}, pB:{red:["éthanal", {C:2, H:4, O:1}], ox:["acide éthanoïque", {C:2, H:4, O:2}]}},
  dmb:{n:"2,3-diméthylbut-2-ène", f:"(CH₃)₂C=C(CH₃)₂", el:{C:6, H:12}, a:["CH3", "CH3"], b:["CH3", "CH3"],
    pA:{red:["propanone", {C:3, H:6, O:1}], ox:["propanone", {C:3, H:6, O:1}]}, pB:{red:["propanone", {C:3, H:6, O:1}], ox:["propanone", {C:3, H:6, O:1}]}},
  mp:{n:"méthylpropène", f:"(CH₃)₂C=CH₂", el:{C:4, H:8}, a:["CH3", "CH3"], b:["H", "H"],
    pA:{red:["propanone", {C:3, H:6, O:1}], ox:["propanone", {C:3, H:6, O:1}]}, pB:{red:["méthanal", {C:1, H:2, O:1}], ox:["acide méthanoïque", {C:1, H:2, O:2}]}}
};
/* étapes : s ∈ [0, 6] */
var OZ_STEPS = ["L'ozone s'approche de la double liaison", "Cycloaddition : l'ozone s'additionne sur C=C", "Molozonide (trioxolane primaire), très instable",
  "Il se coupe : un carbonyle + un oxyde de carbonyle", "Les deux fragments se retournent", "Ils se recombinent : ozonide (1,2,4-trioxolane)", "Traitement : la liaison O–O est coupée", "Produits : deux composés carbonylés"];
function ozKey(s){
  /* positions des 5 atomes du cœur (Ca, Cb, Oa, Ob, Oc) et des réactifs selon l'étape s */
  var Rp = 1.225, cy = 0.25;
  function pent(an){ return [Rp * Math.cos(an * DEG), cy + Rp * Math.sin(an * DEG), 0]; }
  function polar(o, L, an, z){ return [o[0] + L * Math.cos(an * DEG), o[1] + L * Math.sin(an * DEG), (o[2] || 0) + (z || 0)]; }
  var K = [];
  /* K0 : ozone loin */
  K[0] = {Ca:[-0.67, 0, 0], Cb:[0.67, 0, 0], Oa:[-1.09, 4.2, 0.3], Ob:[1.09, 4.2, 0.3], Oc:[0, 4.87, 0.3]};
  K[1] = {Ca:[-0.67, 0, 0], Cb:[0.67, 0, 0], Oa:[-1.09, 2.35, 0], Ob:[1.09, 2.35, 0], Oc:[0, 3.02, 0]};
  K[2] = {Ca:[-0.77, 0, 0], Cb:[0.77, 0, 0], Oa:[-1.15, 1.38, 0], Ob:[1.15, 1.38, 0], Oc:[0, 2.25, 0.35]};
  var A3 = [-2.15, 0.35, 0], B3 = [2.05, 0.2, 0], Ob3 = polar(B3, 1.28, 72);
  K[3] = {Ca:A3, Oa:polar(A3, 1.22, 105), Cb:B3, Ob:Ob3, Oc:polar(Ob3, 1.28, 140)};
  var A4 = [-2.5, -0.55, 0], B4 = [2.0, -0.35, 0], Ob4 = polar(B4, 1.28, 102);
  K[4] = {Ca:A4, Oa:polar(A4, 1.22, 324), Cb:B4, Ob:Ob4, Oc:polar(Ob4, 1.28, 172)};
  K[5] = {Ca:pent(-162), Cb:pent(-18), Oa:pent(-90), Ob:pent(54), Oc:pent(126)};
  var A6 = [-2.7, 0.1, 0], B6 = [2.6, -0.6, 0];
  K[6] = {Ca:A6, Oc:polar(A6, 1.22, 72), Cb:B6, Oa:polar(B6, 1.22, 216), Ob:[4.0, 1.6, 0.4]};
  var i = Math.min(5, Math.floor(s)), u = ease(s - i), P = {}, k;
  for (k in K[0]) P[k] = lerp3(K[i][k], K[i + 1][k], u);
  if (i === 3){   /* le carbonyle tourne d'un bloc autour de Ca (105° → 324°, par la gauche) */
    var an = lerp(105, 324, u);
    P.Oa = polar(P.Ca, 1.22, an, 0.9 * Math.sin(PI * u));
  }
  if (i === 5){   /* le traitement retire Ob : il suit le réactif (S ou H₂O) */
    var u1 = ease(seg01(s, 5, 5.45)), u2 = ease(seg01(s, 5.5, 6));
    var ObZ = K[5].Ob, ObOut = [4.0, 1.6, 0.4];
    P.Ob = lerp3(ObZ, ObOut, u2);
    P.Ca = lerp3(K[5].Ca, K[6].Ca, u2); P.Cb = lerp3(K[5].Cb, K[6].Cb, u2);
    var aC = lerp(126 - 162 + 198, 72, u2);   /* direction Ca → Oc */
    P.Oc = polar(P.Ca, lerp(1.44, 1.22, u2), lerp(108, 72, u2));
    P.Oa = polar(P.Cb, lerp(1.44, 1.22, u2), lerp(234, 216, u2));
    P.u1 = u1; P.u2 = u2; void aC;
  }
  return P;
}
SFA.sim({
  id:"org-ozonolyse", ch:"c09", tag:"Alcènes",
  titre:"Ozonolyse : couper la double liaison",
  resume:"L'ozone s'additionne sur C=C, l'ozonide se forme puis se coupe en deux carbonyles : choisis l'alcène et le traitement (réducteur ou oxydant) et regarde quels produits sortent du ballon.",
  but:"Dans le ballon refroidi à −78 °C, l'ozone barbote dans la solution de l'alcène. La loupe montre ce qui se passe en 3D : (1) l'ozone s'additionne sur la double liaison, (2) le molozonide se coupe et ses fragments se recombinent en ozonide, (3) le traitement coupe la liaison O–O. Choisis l'alcène et le traitement, fais glisser l'avancement ou laisse tourner ; glisse sur la loupe pour tourner les molécules.",
  aRetenir:"L'ozonolyse coupe complètement la double liaison C=C : chaque carbone de l'alcène devient un carbone de groupe C=O. Traitement réducteur ((CH₃)₂S ou Zn, H₃O⁺) : on obtient des aldéhydes et des cétones. Traitement oxydant (H₂O₂) : les aldéhydes passent à l'état d'acides carboxyliques, les cétones restent des cétones. Pour retrouver l'alcène de départ, on « recolle » les deux carbones C=O par une double liaison.",
  piege:"Ne pas oublier les hydrogènes portés par les carbones de la double liaison : c'est eux qui décident aldéhyde (C=O avec un H) ou cétone (C=O avec deux carbones). Un carbone =CH₂ en bout de chaîne donne le méthanal (HCHO), et en milieu oxydant l'acide méthanoïque, qui peut s'oxyder jusqu'à CO₂. Et l'ozonide n'est pas le produit : il est instable et explosif, on le traite tout de suite.",
  build:function(k, S){
    var c = respCanvas(k, 0.86, 1.25);
    var gS = k.canvas(118);
    var st = {a:0.35, b:0.32, xi:0, play:true, hold:1.0, t:0, ts:0, spin:true};
    dragView(c, st); st.onview = function(){ st.spin = false; spinT.set(false); k.redraw(); };
    var aS = k.select("Alcène", [["mb2", "2-méthylbut-2-ène"], ["b2e", "(E)-but-2-ène"], ["dmb", "2,3-diméthylbut-2-ène"], ["mp", "méthylpropène"]], "mb2", function(){ st.xi = 0; xS.set(0); st.play = true; st.hold = 0.8; st.fit = null; });
    var tS = k.seg("Traitement", [["red", "Réducteur ((CH₃)₂S)"], ["ox", "Oxydant (H₂O₂)"]], "red", function(){ if (st.xi > 0.84){ st.xi = 0.84; xS.set(0.84); } st.fit = null; });
    var xS = k.slider("Avancement ξ", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) st.xi = 0; st.play = !st.play; st.hold = 0; }, true);
    k.button("Arrêt sur l'ozonide", function(){ st.xi = 5 / 6.25; xS.set(st.xi); st.play = false; });
    var piT = k.toggle("Montrer le nuage π de C=C", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Étape", "Liaison C=C", "Produit (carbone de gauche)", "Produit (carbone de droite)"]);
    var nt = k.note("", "ok");
    var solv = seeded(16, 23);
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.xi >= 1){ st.xi = 0; st.hold = 1.0; }
        else {
          var s0 = st.xi * 6.25, nx = st.xi + dt * 0.042;
          [2, 5, 6].forEach(function(sk){ if (s0 < sk && nx * 6.25 >= sk){ nx = sk / 6.25; st.hold = sk === 6 ? 0.2 : 2.0; } });
          if (nx >= 1){ nx = 1; st.hold = 3.2; }
          st.xi = nx;
        }
        xS.set(st.xi);
      }
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.35 + 0.55 * Math.sin(st.ts * 0.25); st.b = 0.32 + 0.12 * Math.sin(st.ts * 0.17); }
      k.redraw();
    });
    function scene(s, A, mode){
      var P = ozKey(Math.min(s, 6)), atoms = [], bonds = [], i;
      var red = mode === "red";
      var iCa = 0, iCb = 1, iOa = 2, iOb = 3, iOc = 4;
      atoms.push(At("C", P.Ca, {lab:""}), At("C", P.Cb), At("O", P.Oa), At("O", P.Ob), At("O", P.Oc));
      var o3 = s < 1.6;
      /* liaisons du cœur selon l'étape */
      var f1 = ease(seg01(s, 1, 2)), cut = ease(seg01(s, 2, 3)), rec = ease(seg01(s, 4, 5)), wk = ease(seg01(s, 5.05, 5.5));
      bonds.push({a:iCa, b:iCb, o:s < 1.5 ? 2 : 1, alpha:1 - cut, dash:cut > 0.02 || (s > 1 && s < 1.5)});
      /* ozone : Oa–Oc et Ob–Oc (ordre 1,5) */
      bonds.push({a:iOa, b:iOc, o:s < 1.5 ? 2 : 1, alpha:1 - cut, dash:cut > 0.02});
      bonds.push({a:iOb, b:iOc, o:s < 1.5 ? 1 : (s < 2.5 ? 1 : (s < 4.6 ? 1 : 1)), alpha:1 - wk, dash:wk > 0.02});
      bonds.push({a:iCa, b:iOa, o:s < 2.5 ? 1 : (s < 4.5 ? 2 : 1), alpha:f1 * (1 - wk), dash:f1 < 0.98 || wk > 0.02});
      bonds.push({a:iCb, b:iOb, o:s < 2.5 ? 1 : (s < 4.5 ? 2 : 1), alpha:f1 * (1 - wk), dash:f1 < 0.98 || wk > 0.02});
      bonds.push({a:iCb, b:iOa, o:s > 5.5 ? 2 : 1, alpha:rec, dash:rec < 0.98});
      bonds.push({a:iCa, b:iOc, o:s > 5.5 ? 2 : 1, alpha:rec, dash:rec < 0.98});
      /* charges de l'ozone et de l'oxyde de carbonyle */
      if (s < 1.2){ atoms[iOc].badge = "+"; atoms[iOc].badgeCol = "#2a6fdb"; atoms[iOb].badge = "−"; atoms[iOb].badgeCol = "#c0392b"; atoms[iOc].badgeA = atoms[iOb].badgeA = 1 - seg01(s, 0.9, 1.2); }
      if (s > 2.6 && s < 4.6){ var aq = Math.min(seg01(s, 2.6, 2.9), 1 - seg01(s, 4.3, 4.6)); atoms[iOb].badge = "+"; atoms[iOb].badgeCol = "#2a6fdb"; atoms[iOb].badgeA = aq; atoms[iOc].badge = "−"; atoms[iOc].badgeCol = "#c0392b"; atoms[iOc].badgeA = aq; }
      /* hybridation : directions des substituants de chaque carbone */
      function subsDirs(C, side){
        var Cp = P[C], other = C === "Ca" ? "Cb" : "Ca", Z = [0, 0, side];
        var d2, d3, h;
        if (s <= 2){ d2 = sp2pair(sub(P[other], Cp), Z); }
        else if (s <= 5){ d2 = sp2pair(sub(P[C === "Ca" ? "Oa" : "Ob"], Cp), Z); }
        else d2 = sp2pair(sub(P[C === "Ca" ? "Oc" : "Oa"], Cp), Z);
        if (s <= 1){ h = 0; }
        else if (s <= 2){ h = f1; d3 = sp3pair(sub(P[other], Cp), sub(P[C === "Ca" ? "Oa" : "Ob"], Cp), Z); }
        else if (s <= 3){ h = 1 - cut; d3 = sp3pair(sub(P[other], Cp), sub(P[C === "Ca" ? "Oa" : "Ob"], Cp), Z); }
        else if (s <= 4){ h = 0; }
        else if (s <= 5){ h = rec; d3 = sp3pair(sub(P.Oa, Cp), sub(P[C === "Ca" ? "Oc" : "Ob"], Cp), Z); }
        else { var u2 = P.u2 || 0; h = 1 - u2; d3 = sp3pair(sub(P.Oa, Cp), sub(P[C === "Ca" ? "Oc" : "Ob"], Cp), Z); }
        if (!d3 || h <= 0) return d2;
        return [slerpD(d2[0], d3[0], h), slerpD(d2[1], d3[1], h)];
      }
      var oxi = [];   /* carbones d'aldéhyde à oxyder */
      function addSubs(ci, C, list){
        var dirs = subsDirs(C, 1);
        list.forEach(function(t, q){
          var d = dirs[q], Cp = atoms[ci].p;
          if (t === "H"){ var ih = atoms.length; atoms.push(At("H", add(Cp, mul(d, 1.09)))); bonds.push({a:ci, b:ih, o:1}); if (!oxi.some(function(x){ return x.ci === ci; })) oxi.push({ci:ci, ih:ih, d:d, C:C}); }
          else {
            var im = atoms.length; atoms.push(At("C", add(Cp, mul(d, 1.51)))); bonds.push({a:ci, b:im, o:1});
            tetra3(mul(d, -1), [0, 1, 0], 0.4 + q).forEach(function(e){ atoms.push(At("H", add(atoms[im].p, mul(e, 1.09)))); bonds.push({a:im, b:atoms.length - 1, o:1}); });
          }
        });
      }
      addSubs(iCa, "Ca", A.a); addSubs(iCb, "Cb", A.b);
      var nCore = atoms.length;
      /* traitement */
      var u1 = P.u1 || 0, u2 = P.u2 || 0, ObP = P.Ob, rg = [];
      if (s > 5){
        var dirIn = nrm([0.6, 0.05, 0.55]), far = add(ObP, mul(dirIn, 4.2 * (1 - u1)));
        if (red){
          var Sp = add(far, mul(dirIn, 1.49)), iS = atoms.length;
          if (u2 > 0) Sp = add(ObP, mul(dirIn, 1.49));
          atoms.push(At("S", Sp, {lab:"S"}));
          bonds.push({a:iS, b:iOb, o:u2 > 0.5 ? 2 : 1, alpha:u1, dash:u1 < 0.98 && u2 < 0.02});
          /* S pyramidal : O–S–C ≈ 106°, C–S–C ≈ 97° ; les méthyles pointent vers le bas et l'extérieur (rien ne monte vers le haut de la loupe) */
          var uSO = mul(dirIn, -1), rf = [0.4, -1, 0], e2 = nrm(add(rf, mul(uSO, -dot(rf, uSO)))), e1 = cross(uSO, e2);
          [[1, 0.9], [-1, 0.9]].forEach(function(sg){
            var dm = nrm(add(mul(uSO, -0.2756), mul(add(mul(e2, 0.6266), mul(e1, sg[0] * 0.7793)), 0.9613))), im = atoms.length;
            atoms.push(At("C", add(Sp, mul(dm, 1.80)))); bonds.push({a:iS, b:im, o:1});
            tetra3(mul(dm, -1), [0, 1, 0], 0.3).forEach(function(e){ atoms.push(At("H", add(atoms[im].p, mul(e, 1.09)))); bonds.push({a:im, b:atoms.length - 1, o:1}); });
          });
          rg.push({i:iS, t:u2 > 0.5 ? "(CH₃)₂S=O" : "(CH₃)₂S", col:"#8a6100"});
        } else {
          var Ow = add(far, mul(dirIn, 1.46)), iW = atoms.length;
          if (u2 > 0) Ow = add(ObP, mul(dirIn, 1.46));
          atoms.push(At("O", Ow));
          bonds.push({a:iW, b:iOb, o:1, alpha:u1, dash:u1 < 0.98 && u2 < 0.02});
          var h1 = add(Ow, mul(nrm([0.9, 0.2, -0.4]), 0.97)), h2w = add(Ow, mul(nrm([-0.5, 0.5, 0.7]), 0.97)), h2o = add(ObP, mul(nrm([-0.7, -0.2, -0.7]), 0.97));
          atoms.push(At("H", h1)); bonds.push({a:iW, b:atoms.length - 1, o:1});
          var iH2 = atoms.length; atoms.push(At("H", lerp3(h2w, h2o, ease(seg01(s, 5.3, 5.5)))));
          var tr = ease(seg01(s, 5.3, 5.5)); bonds.push({a:iW, b:iH2, o:1, alpha:1 - tr}); bonds.push({a:iOb, b:iH2, o:1, alpha:tr, dash:tr < 0.98});
          rg.push({i:iW, t:u2 > 0.5 ? "H₂O₂ (libéré)" : "H₂O", col:"#1d4fae"});
          /* oxydation des aldéhydes : un O s'insère dans la liaison C–H */
          var ox = ease(seg01(s, 5.55, 5.95));
          oxi.forEach(function(x){
            if (ox <= 0) return;
            var Cp = atoms[x.ci].p, dO = x.d, Op = add(Cp, mul(dO, 1.34)), iO = atoms.length;
            atoms.push(At("O", Op, {keep:true, alpha:ox, glow:"rgba(42,111,219," + (0.45 * (1 - ox * 0.6)).toFixed(3) + ")"}));
            var hT = add(Op, mul(nrm(add(mul(dO, 0.33), mul(perpTo(dO), 0.94))), 0.97));
            atoms[x.ih].p = lerp3(atoms[x.ih].p, hT, ox);
            bonds.forEach(function(b){ if (b.a === x.ci && b.b === x.ih){ b.alpha = 1 - ox; b.dash = ox > 0.02; } });
            bonds.push({a:x.ci, b:iO, o:1, alpha:ox}); bonds.push({a:iO, b:x.ih, o:1, alpha:ox});
          });
        }
      }
      var fadeR = 1 - 0.6 * ease(seg01(s, 5.6, 6));
      for (i = nCore; i < atoms.length; i++) if (!atoms[i].keep) atoms[i].alpha *= fadeR;
      return {atoms:atoms, bonds:bonds, rg:rg, o3:o3, nCore:nCore, idx:{Ca:iCa, Cb:iCb, Oa:iOa, Ob:iOb, Oc:iOc}};
    }
    lp.play();
    k.draw(function(){
      var A = OZA[aS.value], mode = tS.value, ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t;
      var s = st.xi * 6.25; if (s > 6) s = 6;
      c.clear();
      /* décor : paillasse, ballon dans le bain à −78 °C, tube d'ozone */
      var wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, "#eef2f7"); wall.addColorStop(1, "#dfe6ee"); ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      var benchY = H * (ph ? 0.93 : 0.86);
      var gB = ctx.createLinearGradient(0, benchY, 0, H); gB.addColorStop(0, "#5b6676"); gB.addColorStop(0.15, "#3d4756"); gB.addColorStop(1, "#2c3440"); ctx.fillStyle = gB; ctx.fillRect(0, benchY, W, H - benchY);
      var fR = ph ? W * 0.075 : Math.min(W * 0.062, H * 0.085), fx = ph ? W * 0.135 : W * 0.155, fy = benchY - fR * 1.6;
      var blue = ease(seg01(s, 4.6, 5.1)) * (1 - ease(seg01(s, 5.1, 5.5)));
      var liq = blue > 0.05 ? "#8fb2ff" : "#e4ecf6";
      /* statif (tige et pince) */
      var rodX = fx + fR * 1.65, gR = ctx.createLinearGradient(rodX - 3, 0, rodX + 3, 0); gR.addColorStop(0, "#6b7482"); gR.addColorStop(0.5, "#c9d0da"); gR.addColorStop(1, "#555e6b");
      ctx.fillStyle = gR; ctx.fillRect(rodX - 2.5, fy - fR * 4.6, 5, benchY - (fy - fR * 4.6));
      ctx.fillStyle = "#4a5260"; ctx.fillRect(rodX - fR * 1.35, fy - fR * 1.75, fR * 1.35, 4); ctx.fillRect(rodX - fR * 0.3, benchY - 4, fR * 1.2, 4);
      flask(ctx, fx, fy, fR, {liq:liq, level:0.55, t:t, bath:true, bubbles:s < 5, bubbleCol:"#b9ccff"});
      /* ozoniseur (O₂ → O₃) et tube qui plonge dans le ballon */
      var ozw = fR * 1.7, ozh = fR * 1.15, ozx = ph ? 4 : fx - fR * 1.45, ozy = fy - fR * 4.4;
      ctx.save(); ctx.strokeStyle = "rgba(120,140,165,.95)"; ctx.lineWidth = 2.4; ctx.beginPath();
      ctx.moveTo(fx + 2, fy + fR * 0.62); ctx.lineTo(fx + 2, ozy + ozh + fR * 0.5); ctx.quadraticCurveTo(fx + 2, ozy + ozh * 0.5, ozx + ozw, ozy + ozh * 0.5); ctx.stroke();
      rr(ctx, ozx, ozy, ozw, ozh, 5); var gO = ctx.createLinearGradient(ozx, ozy, ozx, ozy + ozh); gO.addColorStop(0, "#f7f9fc"); gO.addColorStop(1, "#c3ccd8"); ctx.fillStyle = gO; ctx.fill(); ctx.strokeStyle = "#7d8a9b"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = s < 5 ? "#3fbf6a" : "#9aa6b6"; ctx.beginPath(); ctx.arc(ozx + ozw - 7, ozy + 7, 3, 0, 7); ctx.fill();
      label(ctx, "O₃", ozx + ozw * 0.42, ozy + ozh * 0.58, {size:ph ? 10.5 : 12, col:"#2c3a4e", weight:800});
      ctx.restore();
      label(ctx, "−78 °C", fx, benchY - 10, {size:ph ? 10.5 : 11.5, col:"#1d4fae", weight:800});
      /* loupe */
      var box = ph ? {x:W * 0.27, y:8, w:W * 0.73 - 8, h:benchY - 16} : {x:W * 0.29, y:10, w:W * 0.71 - 10, h:benchY - 20};
      loupe(ctx, box, [fx + fR * 0.15, fy + fR * 0.25], "#3b6ec2");
      loupeFrame(ctx, box, "#ffffff", blue > 0.05 ? "#dfe7fb" : "#e6edf6");
      clipBox(ctx, box);
      solvent(ctx, box, solv, t, 0.10);
      var SC = scene(s, A, mode);
      /* cadrage : centre et rayon des atomes du cœur (le réactif du traitement arrive du bord), lissés */
      var cen = [0, 0, 0], nC = 0, rmax = 0;
      function inFit(a, q){ return (q < SC.nCore || a.keep) && !(q === SC.idx.Ob && s > 5.4); }
      SC.atoms.forEach(function(a, q){ if (inFit(a, q)){ cen = add(cen, a.p); nC++; } });
      cen = mul(cen, 1 / nC);
      SC.atoms.forEach(function(a, q){ if (inFit(a, q)) rmax = Math.max(rmax, dist(a.p, cen) + a.r); });
      if (!st.fit || st.fit.k !== aS.value){ st.fit = {k:aS.value, r:rmax, c:cen}; }
      st.fit.r += (rmax - st.fit.r) * 0.06; st.fit.c = lerp3(st.fit.c, cen, 0.06);
      var sc = Math.min(box.w - 16, box.h - 70) / (2 * st.fit.r + 0.4), cP = rot3(st.fit.c, st.a, st.b);
      var V = {st:st, sc:sc, cx:box.x + box.w * 0.5 - cP[0] * sc, cy:box.y + box.h * 0.5 + 10 + cP[1] * sc};
      var extra = [];
      /* nuage π de la double liaison C=C (au-dessus et au-dessous du plan) */
      var piA = piT.value ? 1 - ease(seg01(s, 0.6, 1.4)) : 0;
      if (piA > 0.02){
        var pts = []; for (var j = 0; j <= 8; j++){ var xx = lerp(-0.75, 0.75, j / 8); pts.push([xx, 0.62, 0]); pts.push([xx, -0.62, 0]); }
        extra = extra.concat(cloudItems(ctx, V, pts, 0.62, "#6d5ce6", piA, -0.1));
      }
      var pr = drawScene(c, V, SC.atoms, SC.bonds, extra);
      /* flèches courbes de la cycloaddition */
      var a1 = clamp(1 - Math.abs(s - 0.95) / 0.35, 0, 1);
      if (a1 > 0.03){
        var I = SC.idx, mid = proj3(mul(add(SC.atoms[I.Ca].p, SC.atoms[I.Cb].p), 0.5), st, sc, V.cx, V.cy), pOa = pr[I.Oa], pOb = pr[I.Ob], pOc = pr[I.Oc];
        var s1 = trim({x:mid.x - 6, y:mid.y - 8}, pOb, 0, pOb.r + 4); curly(ctx, s1[0], s1[1], s1[2], s1[3], -24, "#2a6fdb", a1);
        var m2 = {x:(pOb.x + pOc.x) / 2, y:(pOb.y + pOc.y) / 2}; var s2 = trim(m2, pOc, 0, pOc.r + 2); curly(ctx, s2[0] + 4, s2[1], s2[2], s2[3], 16, "#2a6fdb", a1 * 0.9);
        var s3 = trim(pOa, pr[I.Ca], pOa.r + 2, pr[I.Ca].r + 4); curly(ctx, s3[0], s3[1], s3[2], s3[3], 22, "#c0392b", a1);
      }
      var a2 = clamp(1 - Math.abs(s - 2.45) / 0.35, 0, 1);
      if (a2 > 0.03){
        var I2 = SC.idx, mCC = proj3(mul(add(SC.atoms[I2.Ca].p, SC.atoms[I2.Cb].p), 0.5), st, sc, V.cx, V.cy), pA2 = pr[I2.Oa], pC2 = pr[I2.Oc];
        var mOO = {x:(pA2.x + pC2.x) / 2, y:(pA2.y + pC2.y) / 2};
        var s4 = trim(mCC, pr[I2.Ca], 0, pr[I2.Ca].r + 2); curly(ctx, s4[0], s4[1] + 6, s4[2], s4[3] + 4, -18, "#c0392b", a2);
        var s5 = trim(mOO, pC2, 0, pC2.r + 3); curly(ctx, s5[0], s5[1], s5[2], s5[3], 16, "#c0392b", a2);
      }
      /* étiquettes */
      var fs = ph ? 11 : 12.5, lb = {size:fs, bg:"rgba(255,255,255,.88)"};
      if (s < 1.3){ var pO = pr[SC.idx.Oc]; label(ctx, "O₃ (ozone)", pO.x, pO.y - pO.r - 14, Object.assign({col:"#c0392b"}, lb)); }
      SC.rg.forEach(function(r0){ var p = pr[r0.i]; var lx = p.x + 1.5 * sc; label(ctx, r0.t, Math.min(lx, box.x + box.w - 100), clamp(p.y - 0.6 * sc, box.y + 50, box.y + box.h - 14), Object.assign({col:r0.col, align:"left", alpha:SC.atoms[r0.i].alpha}, lb)); });
      var red = mode === "red", nmA = A.pA[mode][0], nmB = A.pB[mode][0];
      if (s > 5.8){
        /* sous chaque fragment : sous l'atome le plus bas de ce fragment */
        [["Ca", nmA], ["Cb", nmB]].forEach(function(fr){
          var C0 = SC.atoms[SC.idx[fr[0]]].p, pc = pr[SC.idx[fr[0]]], yMax = pc.y;
          SC.atoms.forEach(function(a, q){ if (q < SC.nCore && a.alpha > 0.5 && dist(a.p, C0) < 2.7) yMax = Math.max(yMax, pr[q].y + pr[q].r); });
          label(ctx, fr[1], clamp(pc.x, box.x + 64, box.x + box.w - 64), Math.min(box.y + box.h - 16, yMax + 14), Object.assign({col:"#13233a", alpha:ease(seg01(s, 5.8, 6))}, lb));
        });
      }
      ctx.restore();
      var stp = s < 1 ? 0 : s < 1.95 ? 1 : s < 2.2 ? 2 : s < 3 ? 3 : s < 4 ? 4 : s < 5.05 ? 5 : s < 5.95 ? 6 : 7;
      var stepTxt = (stp === 6 && !red) ? "Traitement : l'eau hydrolyse l'ozonide" : OZ_STEPS[stp];
      label(ctx, stepTxt, box.x + 12, box.y + 18, {size:fitSize(ctx, stepTxt, box.w - (ph ? 24 : 140), ph ? 12 : 13.5, 700), align:"left", col:"#13233a", bg:"rgba(255,255,255,.9)"});
      if (!ph) label(ctx, "glisse pour tourner", box.x + box.w - 10, box.y + 18, {size:11, align:"right", col:"#8a95a3", weight:600});
      if (!ph) label(ctx, "carboglace + acétone", fx, benchY + 14, {size:10.5, col:"#c9d3df", weight:600});
      /* schéma 2D sous la scène */
      gS.clear(); var g = gS.ctx, GW = gS.W, GH = gS.H, n4 = GW < 560;
      g.fillStyle = "#fbfcfe"; g.fillRect(0, 0, GW, GH);
      var pA = A.pA[mode], pB = A.pB[mode];
      var cells = [[A.f, "alcène", 0], ["ozonide", "s = 5", 5], [pA[0] === pB[0] ? "2 × " + pA[0] : pA[0] + " + " + pB[0], red ? "(CH₃)₂S" : "H₂O₂", 6]];
      var cw = GW / 3;
      cells.forEach(function(ce, q){
        var on = (q === 0 && s < 1) || (q === 1 && s >= 1 && s < 5.6) || (q === 2 && s >= 5.6);
        var x0 = cw * q + 6;
        g.save(); g.fillStyle = on ? "rgba(42,111,219,.10)" : "rgba(0,0,0,0)"; rr(g, x0, 10, cw - 12, GH - 20, 10); g.fill(); g.strokeStyle = on ? "#2a6fdb" : "#dde3ea"; g.lineWidth = on ? 1.6 : 1; g.stroke(); g.restore();
        var head = q === 0 ? "Alcène" : q === 1 ? "Intermédiaire" : "Produits";
        label(g, head, x0 + (cw - 12) / 2, 26, {size:11, col:"#5f6b7a", weight:800});
        var main = ce[0], fz = fitSize(g, main, cw - 24, n4 ? 12.5 : 14.5, 800);
        g.font = "800 " + fz + "px " + FONT;
        if (g.measureText(main).width > cw - 24 && main.indexOf(" + ") > 0){
          var pz = main.split(" + "), fz2 = Math.min(fitSize(g, pz[0], cw - 24, n4 ? 12 : 14, 800), fitSize(g, "+ " + pz[1], cw - 24, n4 ? 12 : 14, 800));
          label(g, pz[0], x0 + (cw - 12) / 2, GH / 2 - 7, {size:fz2, col:on ? "#13233a" : "#5f6b7a", weight:800});
          label(g, "+ " + pz[1], x0 + (cw - 12) / 2, GH / 2 + 11, {size:fz2, col:on ? "#13233a" : "#5f6b7a", weight:800});
        } else label(g, main, x0 + (cw - 12) / 2, GH / 2 + 2, {size:fz, col:on ? "#13233a" : "#5f6b7a", weight:800});
        var subT = q === 0 ? A.n : q === 1 ? "1,2,4-trioxolane (instable)" : "après " + (red ? "(CH₃)₂S" : "H₂O₂");
        label(g, subT, x0 + (cw - 12) / 2, GH - 26, {size:fitSize(g, subT, cw - 24, 11, 600), col:"#5f6b7a", weight:600});
        if (q < 2) label(g, "→", cw * (q + 1), GH / 2 + 2, {size:18, col:"#2c3a4e"});
      });
      /* valeurs */
      var mA = molM(pA[1]), mB = molM(pB[1]);
      ro.set(0, ["approche de O₃", "cycloaddition", "molozonide", "coupure", "retournement", "recombinaison : ozonide", "traitement", "produits"][stp]);
      ro.set(1, s < 1.4 ? "C=C intacte" : s < 2.5 ? "C–C simple (cycle)" : "coupée");
      ro.set(2, pA[0] + " " + fBrute(pA[1]) + " · " + F(mA, 2) + " g/mol");
      ro.set(3, pB[0] + " " + fBrute(pB[1]) + " · " + F(mB, 2) + " g/mol");
      var eq = fBrute(A.el) + " + O₃";
      var prodTxt = pA[0] === pB[0] ? "2 " + fBrute(pA[1]) : fBrute(pA[1]) + " + " + fBrute(pB[1]);
      if (red) eq += " + (CH₃)₂S → " + prodTxt + " + (CH₃)₂SO";
      else {
        var nAld = (pA[1].O === 2 ? 1 : 0) + (pB[1].O === 2 ? 1 : 0);
        eq = nAld === 2 ? eq + " + H₂O₂ → " + prodTxt + " + H₂O" : nAld === 0 ? eq + " + H₂O → " + prodTxt + " + H₂O₂" : eq + " → " + prodTxt + " (en présence de H₂O₂)";
      }
      var msg = "<b>Bilan</b> : " + eq + ". ";
      if (s < 2) msg += "L'ozone (dipôle 1,3) s'additionne en une seule étape sur la double liaison : les deux liaisons C–O se forment ensemble, du même côté.";
      else if (s < 5) msg += "Le molozonide se coupe : la liaison C–C et une liaison O–O cassent. Les fragments (un carbonyle et un oxyde de carbonyle) se retournent et se recombinent tête-bêche en ozonide.";
      else if (red) msg += "(CH₃)₂S prend un O de la liaison O–O (il devient le DMSO) : chaque carbone de l'ancienne double liaison sort en C=O. Les aldéhydes ne sont pas oxydés.";
      else msg += "L'eau hydrolyse l'ozonide (il se forme H₂O₂) et le milieu oxydant transforme chaque aldéhyde en acide carboxylique : un O s'insère dans la liaison C–H (en bleu). Les cétones restent intactes. <i>Traitement oxydant montré en bilan : en réalité l'eau attaque un carbone de l'ozonide, H₂O₂ emporte les deux O du pont O–O, et l'O ajouté à l'aldéhyde vient de H₂O₂.</i>";
      nt.set(msg + " <i>Géométries idéalisées.</i>", "ok");
    });
  }
});

/* flacon de réactif en verre brun, étiquette et pictogrammes */
function bottle(ctx, x, yb, w, h, name, sub2, picto){
  ctx.save();
  ctx.fillStyle = "rgba(15,27,45,.22)"; ctx.beginPath(); ctx.ellipse(x, yb, w * 0.62, w * 0.12, 0, 0, 7); ctx.fill();
  var g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, "#4a2a12"); g.addColorStop(0.3, "#9a5a24"); g.addColorStop(0.45, "#c98a4a"); g.addColorStop(1, "#3c210e");
  ctx.fillStyle = g; rr(ctx, x - w / 2, yb - h * 0.78, w, h * 0.78, [w * 0.18, w * 0.18, 5, 5]); ctx.fill();
  ctx.fillRect(x - w * 0.22, yb - h * 0.9, w * 0.44, h * 0.14);
  var gc = ctx.createLinearGradient(x - w * 0.27, 0, x + w * 0.27, 0); gc.addColorStop(0, "#1b2430"); gc.addColorStop(0.4, "#55606f"); gc.addColorStop(1, "#141b24");
  ctx.fillStyle = gc; rr(ctx, x - w * 0.27, yb - h, w * 0.54, h * 0.12, 3); ctx.fill();
  /* étiquette */
  var lx = x - w * 0.42, ly = yb - h * 0.62, lw = w * 0.84, lh = h * 0.42;
  ctx.fillStyle = "#fbf8f1"; rr(ctx, lx, ly, lw, lh, 3); ctx.fill();
  ctx.fillStyle = "#13233a"; ctx.font = "800 " + Math.max(9, Math.round(w * 0.17)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(name, x, ly + lh * 0.2, lw * 0.9);
  ctx.font = "700 " + Math.max(8, Math.round(w * 0.13)) + "px " + FONT; ctx.fillStyle = "#5f6b7a"; ctx.fillText(sub2, x, ly + lh * 0.42, lw * 0.9);
  (picto || []).forEach(function(pc, q){
    var px = x + (q - (picto.length - 1) / 2) * lw * 0.46, py = ly + lh * 0.77, r = lh * 0.155;
    ctx.save(); ctx.translate(px, py); ctx.save(); ctx.rotate(PI / 4); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#d0021b"; ctx.lineWidth = 1.6; ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.strokeRect(-r, -r, 2 * r, 2 * r); ctx.restore();
    ctx.fillStyle = "#13233a";
    if (pc === "flamme"){ ctx.beginPath(); ctx.moveTo(0, r * 0.75); ctx.bezierCurveTo(-r * 0.7, r * 0.6, -r * 0.6, -r * 0.1, 0, -r * 0.8); ctx.bezierCurveTo(r * 0.1, -r * 0.2, r * 0.7, r * 0.0, r * 0.45, r * 0.6); ctx.closePath(); ctx.fill(); }
    else { ctx.fillRect(-r * 0.12, -r * 0.65, r * 0.24, r * 0.85); ctx.beginPath(); ctx.arc(0, r * 0.52, r * 0.14, 0, 7); ctx.fill(); }
    ctx.restore();
  });
  ctx.fillStyle = "rgba(255,255,255,.28)"; ctx.fillRect(x - w * 0.36, yb - h * 0.74, w * 0.07, h * 0.66);
  ctx.restore();
}
function benchBg(ctx, W, H, benchY){
  var wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, "#eef2f7"); wall.addColorStop(1, "#dfe6ee"); ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
  /* carrelage discret */
  ctx.strokeStyle = "rgba(160,175,195,.18)"; ctx.lineWidth = 1;
  for (var y = 30; y < benchY; y += 30){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  var gB = ctx.createLinearGradient(0, benchY, 0, H); gB.addColorStop(0, "#5b6676"); gB.addColorStop(0.15, "#3d4756"); gB.addColorStop(1, "#2c3440"); ctx.fillStyle = gB; ctx.fillRect(0, benchY, W, H - benchY);
}

/* ====================================================================== */
/* 2. Le benzène en 3D : six orbitales p, un seul nuage                    */
/* ====================================================================== */
/* sommets d'un hexagone à angles de 120° et côtés alternés a (C1–C2, C3–C4, C5–C6) et b ; anneau dans le plan xz */
function hexRing(a, b){
  var P = [[0, 0, 0]], an = 0, i;
  for (i = 0; i < 5; i++){ var L = i % 2 === 0 ? a : b; P.push([P[i][0] + L * Math.cos(an), 0, P[i][2] + L * Math.sin(an)]); an += PI / 3; }
  var c = [0, 0, 0]; P.forEach(function(p){ c = add(c, p); }); c = mul(c, 1 / 6);
  return P.map(function(p){ return sub(p, c); });
}
var BZ_DH = {ene:-120, diene:-232, triene:-360, benz:-208};
SFA.sim({
  id:"org-benzene-pi-3d", ch:"c09", tag:"Composés aromatiques",
  titre:"Le benzène en 3D : six orbitales p, un seul nuage",
  resume:"Fais tourner le benzène et passe de la structure de Kekulé (liaisons de 134 et 154 pm) à la vraie molécule (six liaisons de 139 pm) : les six orbitales p fusionnent en deux anneaux d'électrons, et la molécule gagne environ 150 kJ/mol de stabilité.",
  but:"Fais glisser le curseur λ de la structure de Kekulé (λ = 0, trois doubles liaisons localisées) à la molécule réelle (λ = 1). Regarde les longueurs de liaison et le recouvrement des orbitales p. Clique sur un carbone pour suivre son orbitale p, glisse pour tourner la molécule. En bas, les enthalpies d'hydrogénation chiffrent la stabilisation.",
  aRetenir:"Les six carbones du benzène sont sp² ; chacun garde une orbitale p perpendiculaire au plan du cycle. Chaque p recouvre ses deux voisines de la même façon : les six électrons π forment un nuage continu au-dessus et au-dessous du cycle. Les six liaisons C–C sont identiques (139 pm, indice 1,5), entre C–C (154 pm) et C=C (134 pm). Ce nuage délocalisé stabilise la molécule : l'hydrogénation du benzène libère 208 kJ/mol au lieu des 3 × 120 = 360 kJ/mol attendus pour trois C=C isolées, soit environ 150 kJ/mol d'énergie de résonance.",
  piege:"Les deux formules de Kekulé ne sont pas deux molécules qui s'échangent : ce sont deux écritures d'une seule molécule réelle, qui n'est ni l'une ni l'autre. Le cyclohexa-1,3,5-triène à liaisons alternées n'existe pas. Et « aromatique » ne veut pas dire « qui sent » : c'est un cycle plan, entièrement conjugué, avec 4n + 2 électrons π (6 pour le benzène).",
  build:function(k, S){
    var c = respCanvas(k, 0.78, 1.15);
    var gE = k.canvas(236);
    var st = {a:0.4, b:0.55, t:0, ts:0, spin:true, lam:0, demo:true, ph:0, sel:0};
    var lS = k.slider("λ : Kekulé (0) → molécule réelle (1)", 0, 1, 0.01, 0, "", function(v){ st.lam = v; st.demo = false; demoT.set(false); });
    var vS = k.seg("Vue des électrons π", [["p", "Orbitales p"], ["nuage", "Nuage π"], ["aucun", "Squelette seul"]], "p");
    var demoT = k.toggle("Animation Kekulé ⇄ réel", true, function(v){ st.demo = v; });
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var hT = k.toggle("Afficher les longueurs de liaison", true);
    var ro = k.readouts(["Liaisons C–C", "Indice de liaison", "L'orbitale p suivie recouvre", "Électrons π", "Stabilisation (résonance)"]);
    var nt = k.note("", "ok");
    /* souris : glisser = tourner ; cliquer sur un carbone = le suivre */
    var down = null, lastPr = null;
    c.cv.style.touchAction = "none";
    c.pointer(function(type, p){
      if (type === "down"){ down = {x:p.x, y:p.y, moved:false}; st.lx = p.x; st.ly = p.y; st.drag = true; return; }
      if (type === "drag" && down){
        if (Math.hypot(p.x - down.x, p.y - down.y) > 4) down.moved = true;
        st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, -1.45, 1.45); st.lx = p.x; st.ly = p.y;
        if (down.moved){ st.spin = false; spinT.set(false); }
        k.redraw(); return;
      }
      if (type === "up" && down){
        if (!down.moved && lastPr){ var best = -1, bd = 1e9; for (var q = 0; q < 6; q++){ var d = Math.hypot(lastPr[q].x - p.x, lastPr[q].y - p.y); if (d < bd && d < lastPr[q].r + 12){ bd = d; best = q; } } if (best >= 0) st.sel = best; }
        down = null; st.drag = false; k.redraw();
      }
    });
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.demo){ st.ph += dt; var cyc = st.ph % 12, l = cyc < 2 ? 0 : cyc < 6 ? ease((cyc - 2) / 4) : cyc < 8 ? 1 : 1 - ease((cyc - 8) / 4); st.lam = l; lS.set(Math.round(l * 100) / 100); }
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.4 + st.ts * 0.22; st.b = 0.55 + 0.25 * Math.sin(st.ts * 0.3); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, lam = st.lam, mode = vS.value;
      var d1 = 1.34 + 0.05 * lam, d2 = 1.54 - 0.15 * lam;
      c.clear();
      var benchY = H * (ph ? 0.93 : 0.88);
      benchBg(ctx, W, H, benchY);
      var bw = ph ? W * 0.13 : Math.min(W * 0.11, 70), bx = ph ? W * 0.1 : W * 0.12;
      bottle(ctx, bx, benchY + 2, bw, bw * 2.2, "Benzène", "C₆H₆", ["flamme", "!"]);
      var box = ph ? {x:W * 0.22, y:8, w:W * 0.78 - 8, h:benchY - 16} : {x:W * 0.24, y:10, w:W * 0.76 - 10, h:benchY - 20};
      loupe(ctx, box, [bx, benchY - bw * 1.55], "#6d5ce6");
      loupeFrame(ctx, box, "#ffffff", "#e9e6f7");
      clipBox(ctx, box);
      var R = hexRing(d1, d2), atoms = [], bonds = [], extra = [], i;
      for (i = 0; i < 6; i++) atoms.push(At("C", R[i], {lab:String(i + 1)}));
      for (i = 0; i < 6; i++){
        var prv = R[(i + 5) % 6], nxt = R[(i + 1) % 6], ext = nrm(sub(mul(R[i], 2), add(prv, nxt)));
        atoms.push(At("H", add(R[i], mul(ext, 1.09))));
        bonds.push({a:i, b:6 + i, o:1});
      }
      /* liaisons C–C : 1 = C1–C2 (courte), 2 = C2–C3 (longue)… ; ordre affiché 2 → 1,5 et 1 → 1,5 */
      for (i = 0; i < 6; i++){
        var shortB = i % 2 === 0;
        bonds.push({a:i, b:(i + 1) % 6, o:mode === "aucun" ? (shortB && lam < 0.5 ? 2 : 1) : 1, w:1});
      }
      var sc = Math.min(box.w - 20, box.h - 50) / 4.7;
      var V = {st:st, sc:sc, cx:box.x + box.w * 0.5, cy:box.y + box.h * 0.53};
      var Y = [0, 1, 0], sel = st.sel;
      if (mode === "p"){
        for (i = 0; i < 6; i++){
          var hl = i === sel, colT = hl ? "#f0a030" : "#5b7be8", colB = hl ? "#e07a1f" : "#e86f6f";
          extra.push(lobeItem(ctx, V, add(R[i], [0, 0.18, 0]), Y, 1.25, 0.40, colT, 0.62));
          extra.push(lobeItem(ctx, V, add(R[i], [0, -0.18, 0]), mul(Y, -1), 1.25, 0.40, colB, 0.62));
        }
        /* recouvrement latéral entre voisines */
        for (i = 0; i < 6; i++){
          var ov = i % 2 === 0 ? 1 : lam, j2 = (i + 1) % 6, pts = [];
          if (ov < 0.03) continue;
          for (var q = 1; q < 6; q++){ var m0 = lerp3(R[i], R[j2], q / 6); pts.push(add(m0, [0, 0.75, 0])); pts.push(add(m0, [0, -0.75, 0])); }
          extra = extra.concat(cloudItems(ctx, V, pts, 0.5, "#7b5cf0", ov * 0.9, 0.3));
        }
      } else if (mode === "nuage"){
        var ptsT = [], ptsB = [];
        for (i = 0; i < 6; i++){
          var w8 = i % 2 === 0 ? 1 : lam, j3 = (i + 1) % 6;
          for (var q2 = 0; q2 < 8; q2++){
            var u = q2 / 8, ww = i % 2 === 0 ? 1 : lam;
            if (ww < 0.04) continue;
            var m1 = lerp3(R[i], R[j3], u);
            ptsT.push({p:add(mul(m1, 1.0), [0, 0.72, 0]), w:ww}); ptsB.push({p:add(m1, [0, -0.72, 0]), w:ww});
          }
          void w8;
        }
        [ptsT, ptsB].forEach(function(L, s2){
          L.forEach(function(o){ extra = extra.concat(cloudItems(ctx, V, [o.p], 0.62, s2 ? "#e86f6f" : "#5b7be8", o.w * 0.85, 0)); });
        });
      }
      var pr = drawScene(c, V, atoms, bonds, extra);
      lastPr = pr;
      /* repère du carbone suivi */
      var ps = pr[sel]; ctx.save(); ctx.strokeStyle = "#e07a1f"; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(ps.x, ps.y, ps.r + 6, 0, 7); ctx.stroke(); ctx.restore();
      /* longueurs de liaison */
      if (hT.value){
        for (i = 0; i < 6; i++){
          var j4 = (i + 1) % 6, mm = mul(add(R[i], R[j4]), 0.5), out = add(mm, mul(nrm(mm), 0.95)), pm = proj3(out, st, sc, V.cx, V.cy);
          var L1 = Math.round((i % 2 === 0 ? d1 : d2) * 100);
          var colL = Math.abs(L1 - 139) < 1.5 ? "#1f8a5a" : (i % 2 === 0 ? "#1d4fae" : "#a35a00");
          label(ctx, L1 + " pm", pm.x, pm.y, {size:ph ? 10.5 : 11.5, col:colL, bg:"rgba(255,255,255,.85)"});
        }
      }
      ctx.restore();
      var title = lam < 0.05 ? "Kekulé : 3 C=C courtes, 3 C–C longues (n'existe pas)" : lam > 0.95 ? "Benzène réel : 6 liaisons identiques, nuage π continu" : "Les liaisons s'égalisent, les p se recouvrent toutes";
      label(ctx, title, box.x + 12, box.y + 18, {size:fitSize(ctx, title, box.w - 24, ph ? 12 : 13.5, 700), align:"left", col:"#13233a", bg:"rgba(255,255,255,.9)"});
      label(ctx, "glisse : tourner · clic sur un C : le suivre", box.x + box.w - 10, box.y + box.h - 14, {size:ph ? 10.5 : 11, align:"right", col:"#8a95a3", weight:600});
      /* ---- diagramme d'énergie : hydrogénation ---- */
      gE.clear(); var e = gE.ctx, GW = gE.W, GH = gE.H, small = GW < 520;
      e.fillStyle = "#fbfcfe"; e.fillRect(0, 0, GW, GH);
      var top = 62, base = GH - 34, Ysc = (base - top) / 380, Yv = function(v){ return base - v * Ysc; };
      label(e, "Énergie libérée par l'hydrogénation en cyclohexane (kJ/mol)", 10, 13, {size:fitSize(e, "Énergie libérée par l'hydrogénation en cyclohexane (kJ/mol)", GW - 20, 12, 700), align:"left", col:"#2c3a4e"});
      var cols = [["cyclohexène", "+ H₂", -BZ_DH.ene, "#5f6b7a"], ["cyclohexa-1,3-diène", "+ 2 H₂", -BZ_DH.diene, "#5f6b7a"], ["« cyclohexatriène »", "+ 3 H₂ (prévu)", -BZ_DH.triene, "#1d4fae"], ["benzène", "+ 3 H₂ (mesuré)", -BZ_DH.benz, "#7b3fb0"]];
      var cw = (GW - 50) / 4, x0 = 40;
      e.strokeStyle = "#8a95a3"; e.lineWidth = 1.2; e.beginPath(); e.moveTo(x0 - 6, base); e.lineTo(GW - 8, base); e.stroke();
      label(e, "cyclohexane (0)", x0 - 4, base + 12, {size:10.5, align:"left", col:"#5f6b7a", weight:600});
      cols.forEach(function(cl, q){
        var cx = x0 + cw * (q + 0.5), y = Yv(cl[2]), on = (q === 2 && lam < 0.5) || (q === 3 && lam >= 0.5);
        e.save(); e.strokeStyle = cl[3]; e.lineWidth = on ? 4 : 2.5; e.beginPath(); e.moveTo(cx - cw * 0.36, y); e.lineTo(cx + cw * 0.36, y); e.stroke();
        e.globalAlpha = 0.18; e.fillStyle = cl[3]; e.fillRect(cx - cw * 0.12, y, cw * 0.24, base - y); e.restore();
        S.draw.arrow(gE, cx, y + 3, cx, base - 3, cl[3], on ? 2.2 : 1.4);
        label(e, "−" + cl[2], cx + 5, (y + base) / 2, {size:small ? 10.5 : 11.5, align:"left", col:cl[3], bg:"rgba(255,255,255,.85)"});
        var nm = cl[0], fz = fitSize(e, nm, cw - 4, small ? 10.5 : 11.5, 700);
        label(e, nm, cx, y - 20, {size:fz, col:on ? "#13233a" : "#5f6b7a", weight:on ? 800 : 700});
        label(e, cl[1], cx, y - 8, {size:fitSize(e, cl[1], cw - 4, 10.5, 600), col:"#5f6b7a", weight:600});
      });
      /* énergie de résonance */
      var xa = x0 + cw * 3.5 - cw * 0.42, ya = Yv(360), yb = Yv(208);
      e.save(); e.strokeStyle = "#e07a1f"; e.setLineDash([4, 3]); e.lineWidth = 1.4; e.beginPath(); e.moveTo(x0 + cw * 2.86, ya); e.lineTo(xa, ya); e.stroke(); e.restore();
      S.draw.arrow(gE, xa, ya + 2, xa, yb - 2, "#e07a1f", 2);
      label(e, "152", xa - 4, (ya + yb) / 2, {size:12, align:"right", col:"#e07a1f", bg:"rgba(255,255,255,.9)"});
      /* valeurs */
      var r1 = Math.round(d1 * 100), r2 = Math.round(d2 * 100);
      ro.set(0, r1 === r2 ? "6 × " + r1 + " pm" : "3 × " + r1 + " + 3 × " + r2 + " pm");
      ro.set(1, lam > 0.995 ? "1,5 partout" : F(2 - 0.5 * lam, 2) + " et " + F(1 + 0.5 * lam, 2));
      var nb1 = (sel + 1) % 6 + 1, nb2 = (sel + 5) % 6 + 1, partner = sel % 2 === 0 ? nb1 : nb2, other = sel % 2 === 0 ? nb2 : nb1;
      ro.set(2, "C" + (sel + 1) + " → " + (lam > 0.95 ? "C" + partner + " et C" + other + " (pareil)" : lam < 0.05 ? "C" + partner + " seulement" : "C" + partner + " (fort), C" + other + " (" + Math.round(lam * 100) + " %)"));
      ro.set(3, "6 = 4n + 2 (n = 1)");
      ro.set(4, "360 − 208 = 152 kJ/mol");
      var msg = lam < 0.05 ? "Structure de Kekulé : chaque p ne recouvre qu'une voisine, d'où trois liaisons π localisées. Une telle molécule libérerait 3 × 120 = 360 kJ/mol par hydrogénation."
        : lam > 0.95 ? "Molécule réelle : chaque p recouvre ses deux voisines de la même façon, les six électrons π sont délocalisés sur tout le cycle (deux anneaux, au-dessus et au-dessous du plan). Hydrogénation mesurée : 208 kJ/mol seulement, le benzène est 152 kJ/mol plus stable que prévu."
        : "Entre les deux : les liaisons courtes s'allongent, les longues raccourcissent, et le recouvrement des p devient le même tout autour du cycle.";
      nt.set(msg + " Comparaison : pour le cyclohexa-1,3-diène, 232 kJ/mol au lieu de 240 (2 × 120), la conjugaison ne gagne que 8 kJ/mol. <i>Valeurs de ΔH arrondies ; λ intermédiaire = morphing géométrique.</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 3. Ouvrir un époxyde : acide ou basique ?                               */
/* ====================================================================== */
function dihedral(p0, p1, p2, p3){
  var b0 = sub(p0, p1), b1 = nrm(sub(p2, p1)), b2 = sub(p3, p2);
  var v = sub(b0, mul(b1, dot(b0, b1))), w = sub(b2, mul(b1, dot(b2, b1)));
  return Math.atan2(dot(cross(b1, v), w), dot(v, w)) / DEG;
}
function epoxFrame(xi, mode){
  var acid = mode === "acide", Z = [0, 0, 1];
  var C1 = [-0.735, 0, 0], C2 = [0.735, 0, 0], O0 = [0, 1.23, 0];
  /* (R)-2-méthyloxirane : on place CH₃ sur C2 du côté qui donne R */
  var d2 = sp3pair(sub(C1, C2), sub(O0, C2), Z), meSide = 0, hC2;
  hC2 = add(C2, mul(d2[1], 1.09));
  if (cipRS(C2, O0, C1, add(C2, mul(d2[0], 1.51))) !== "R") meSide = 1;
  var X0 = acid ? C2 : C1, Y = acid ? C1 : C2, u = nrm(sub(O0, X0));
  var prot1 = acid ? ease(seg01(xi, 0.03, 0.18)) : 0;
  var nuIn = acid ? seg01(xi, 0.2, 0.36) : seg01(xi, 0.02, 0.18);
  var sn = acid ? ease(seg01(xi, 0.36, 0.6)) : ease(seg01(xi, 0.18, 0.5));
  var pr2 = acid ? ease(seg01(xi, 0.64, 0.8)) : ease(seg01(xi, 0.56, 0.76));
  /* l'oxygène du cycle s'écarte en tournant autour de Y */
  var yo = sub(O0, Y), sgn = dot(cross(sub(X0, Y), yo), Z) > 0 ? 1 : -1, open = 38.4 * DEG * sn;
  var O = add(Y, rotAx(yo, Z, sgn * open));
  if (acid) O = add(O, mul(u, 0.10 * prot1 * (1 - sn)));   /* C2–O s'allonge quand O est protoné */
  var X = add(X0, mul(u, -0.42 * sn));
  var Lnu = sn > 0 ? lerp(3.0, 1.43, sn) : lerp(5.6, 3.0, ease(nuIn));
  var Onu = add(X, mul(u, -Lnu));
  var atoms = [], bonds = [];
  function A(el, p, o){ atoms.push(At(el, p, o)); return atoms.length - 1; }
  var i1 = A("C", acid ? Y : X, {lab:"1"}), i2 = A("C", acid ? X : Y, {lab:"2"}), iO = A("O", O, {lab:"O"});
  var iX = acid ? i2 : i1, iY = acid ? i1 : i2;
  bonds.push({a:i1, b:i2, o:1});
  bonds.push({a:iY, b:iO, o:1});
  bonds.push({a:iX, b:iO, o:1, alpha:1 - sn, dash:sn > 0.02});
  /* substituants du carbone attaqué : parapluie qui se retourne */
  var X0lig = sp3pair(sub(Y, X0), sub(O0, X0), Z);
  function umb(d){ var c0 = dot(d, u), pp = sub(d, mul(u, c0)); return nrm(add(pp, mul(u, lerp(c0, 0.36, sn)))); }
  var Xlig = [umb(X0lig[0]), umb(X0lig[1])];
  var Ylig = sp3pair(sub(atoms[iX].p, Y), sub(O, Y), Z);
  function ligC(ci, dirs, isC2){
    dirs.forEach(function(d, q){
      if (isC2 && q === meSide){
        var im = A("C", add(atoms[ci].p, mul(d, 1.51))); bonds.push({a:ci, b:im, o:1});
        tetra3(mul(d, -1), [0, 1, 0], 0.5).forEach(function(e){ bonds.push({a:im, b:A("H", add(atoms[im].p, mul(e, 1.09))), o:1}); });
        atoms[im].me = true;
      } else bonds.push({a:ci, b:A("H", add(atoms[ci].p, mul(d, 1.09))), o:1});
    });
  }
  ligC(iX, Xlig, acid); ligC(iY, Ylig, !acid);
  var iMe = -1; atoms.forEach(function(a, q){ if (a.me) iMe = q; });
  /* nucléophile : CH₃O⁻ (basique) ou CH₃OH (acide) */
  var w = nrm(add(mul(Z, 0.75), mul(nrm(cross(u, Z)), 0.66 * sgn))), dMe = nrm(add(mul(u, 0.34), mul(w, 0.94)));
  var iN = A("O", Onu, {lab:"O"}), iNC = A("C", add(Onu, mul(dMe, 1.42)));
  bonds.push({a:iN, b:iNC, o:1});
  tetra3(mul(dMe, -1), [0, 1, 0], 0.2).forEach(function(e){ bonds.push({a:iNC, b:A("H", add(atoms[iNC].p, mul(e, 1.09))), o:1}); });
  bonds.push({a:iN, b:iX, o:1, alpha:sn, dash:sn < 0.98});
  var iHn = -1, iHo = -1;
  if (acid){
    var dHn = nrm(add(mul(u, 0.34), mul(w, -0.94))), hOn = add(Onu, mul(dHn, 0.97)), hAway = add(Onu, mul(dHn, 4.5));
    iHn = A("H", lerp3(hOn, hAway, pr2), {glow:pr2 > 0.05 && pr2 < 0.9 ? "rgba(42,111,219,.45)" : null, alpha:1 - pr2});
    bonds.push({a:iN, b:iHn, o:1, alpha:1 - pr2, dash:pr2 > 0.02});
    var dHo = nrm(add(nrm(sub(O0, mul(add(C1, C2), 0.5))), [0, 0, -0.6])), hOo = add(O, mul(dHo, 0.97)), hFar = add(O0, mul(dHo, 5));
    iHo = A("H", lerp3(hFar, hOo, prot1), {glow:prot1 < 0.98 ? "rgba(42,111,219,.45)" : null});
    bonds.push({a:iO, b:iHo, o:1, alpha:prot1, dash:prot1 < 0.98});
    if (prot1 > 0.5 && sn < 0.5){ atoms[iO].badge = "+"; atoms[iO].badgeCol = "#2a6fdb"; }
    if (sn >= 0.5 && pr2 < 0.5){ atoms[iN].badge = "+"; atoms[iN].badgeCol = "#2a6fdb"; }
    var gl = prot1 * (1 - sn);
    if (gl > 0.02){ atoms[i2].glow = "rgba(240,140,30," + (0.75 * gl).toFixed(3) + ")"; atoms[i1].glow = "rgba(240,140,30," + (0.25 * gl).toFixed(3) + ")"; }
  } else {
    var dHo2 = nrm(add(nrm(sub(O, Y)), [0, 0, 0.8])), hO2 = add(O, mul(rotAx(dHo2, Z, 0.3), 0.97)), hFar2 = add(O, mul(dHo2, 5));
    iHo = A("H", lerp3(hFar2, hO2, pr2), {glow:pr2 > 0.02 && pr2 < 0.98 ? "rgba(42,111,219,.45)" : null, alpha:pr2 > 0.001 ? Math.min(1, 0.3 + pr2 * 2) : 0});
    bonds.push({a:iO, b:iHo, o:1, alpha:pr2, dash:pr2 < 0.98});
    if (sn < 0.5){ atoms[iN].badge = "−"; atoms[iN].badgeCol = "#c0392b"; }
    if (sn >= 0.5 && pr2 < 0.5){ atoms[iO].badge = "−"; atoms[iO].badgeCol = "#c0392b"; }
  }
  return {atoms:atoms, bonds:bonds, i1:i1, i2:i2, iO:iO, iN:iN, iX:iX, iY:iY, iMe:iMe, iHo:iHo, iHn:iHn, sn:sn, prot1:prot1, pr2:pr2, nuIn:nuIn, u:u, acid:acid};
}
SFA.sim({
  id:"org-ouverture-epoxyde-3d", ch:"c10", tag:"Alcools et éthers",
  titre:"Ouvrir un époxyde : acide ou basique ?",
  resume:"Le 2-méthyloxirane en 3D, un cycle à trois atomes très tendu : en milieu basique, CH₃O⁻ attaque le carbone le moins substitué ; en milieu acide, CH₃OH attaque le plus substitué. Toujours par l'arrière : on le vérifie en faisant tourner le produit.",
  but:"Bascule le milieu (basique ou acide) et suis l'ouverture du cycle : quel carbone le méthanol attaque-t-il, et de quel côté ? Glisse pour tourner les molécules, fais glisser l'avancement ou laisse tourner. À la fin, le bouton « Vue dans l'axe C1–C2 » montre que le nouveau groupe –OCH₃ et le –OH sont en anti.",
  aRetenir:"Le cycle de l'époxyde (angles d'environ 60° au lieu de 109,5°) est très tendu, environ 114 kJ/mol : il s'ouvre facilement, ce qu'un éther ordinaire ne fait pas. Milieu basique (CH₃O⁻, bon nucléophile) : SN2 pure, l'attaque se fait sur le carbone le moins encombré (C1). Milieu acide : l'oxygène est d'abord protoné, la liaison C–O la plus faible est celle du carbone le plus substitué (C2, qui porte le mieux la charge +) : le méthanol, nucléophile faible, attaque C2. Dans les deux cas l'attaque se fait par l'arrière (anti par rapport à l'oxygène) : inversion de configuration du carbone attaqué, ouverture anti.",
  piege:"Ne pas inverser les deux règles : base → carbone le moins substitué (encombrement), acide → carbone le plus substitué (caractère carbocation). Et « inversion » ne veut pas toujours dire « R devient S » : en milieu basique, C2 n'est pas attaqué et garde sa configuration (R) ; en milieu acide, C2 est attaqué et passe de R à S. Avec un C2 secondaire comme ici, la préférence en milieu acide est faible (mélange des deux isomères) ; elle devient nette avec un carbone tertiaire (2,2-diméthyloxirane).",
  build:function(k, S){
    var c = respCanvas(k, 0.8, 1.2);
    var st = {a:-0.35, b:0.38, xi:0, play:true, hold:0.8, t:0, ts:0, spin:true, goal:null};
    dragView(c, st); st.onview = function(){ st.spin = false; spinT.set(false); st.goal = null; k.redraw(); };
    var mS = k.seg("Milieu", [["base", "Basique (CH₃O⁻ Na⁺)"], ["acide", "Acide (CH₃OH, H⁺)"]], "base", function(){ st.xi = 0; xS.set(0); st.play = true; st.hold = 0.8; st.goal = null; });
    var xS = k.slider("Avancement ξ", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) st.xi = 0; st.play = !st.play; st.hold = 0; }, true);
    k.button("Vue dans l'axe C1–C2", function(){ st.xi = 1; xS.set(1); st.play = false; st.spin = false; spinT.set(false); st.newman = true; });
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; if (v) st.goal = null; });
    var ro = k.readouts(["Étape", "Carbone attaqué", "Angle C–C–O (cycle → chaîne)", "Dièdre O–C–C–O", "Produit", "Configuration de C2", "M(produit) C₄H₁₀O₂"]);
    var nt = k.note("", "ok");
    var solv = seeded(14, 31);
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.xi >= 1){ st.xi = 0; st.hold = 1.0; st.goal = null; }
        else { var nx = st.xi + dt * 0.055; if (st.xi < 0.86 && nx >= 0.86){ st.hold = 1.0; st.newman = true; } if (nx >= 1){ nx = 1; st.hold = 1.5; } st.xi = nx; }
        xS.set(st.xi);
      }
      if (st.goal){ st.a += (st.goal.a - st.a) * 0.06; st.b += (st.goal.b - st.b) * 0.06; }
      else if (st.spin && !st.drag){ st.ts += dt; st.a = -0.35 + 0.6 * Math.sin(st.ts * 0.25); st.b = 0.38 + 0.15 * Math.sin(st.ts * 0.19); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var mode = mS.value, acid = mode === "acide", ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, xi = st.xi;
      var F0 = epoxFrame(xi, mode), at = F0.atoms;
      /* vue dans l'axe C1–C2 demandée : on oriente la caméra */
      if (st.newman){
        st.newman = false;
        var v = nrm(sub(at[F0.i1].p, at[F0.i2].p)), a = Math.atan2(-v[0], v[2]), zp = -v[0] * Math.sin(a) + v[2] * Math.cos(a), b = Math.atan2(v[1], zp);
        while (a - st.a > PI) a -= 2 * PI; while (st.a - a > PI) a += 2 * PI;
        st.goal = {a:a, b:b};
      }
      c.clear();
      var benchY = H * (ph ? 0.93 : 0.88);
      benchBg(ctx, W, H, benchY);
      var fR = ph ? W * 0.075 : Math.min(W * 0.062, H * 0.085), fx = ph ? W * 0.12 : fR + 14, fy = benchY - fR;
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.25)"; ctx.beginPath(); ctx.ellipse(fx, benchY, fR * 0.8, fR * 0.16, 0, 0, 7); ctx.fill(); ctx.restore();
      var bw = ph ? W * 0.13 : Math.min(W * 0.07, 46);
      if (!ph){ flask(ctx, fx, fy, fR, {liq:acid ? "#f3e7c9" : "#dfe9f5", level:0.5, t:t}); label(ctx, "CH₃OH", fx, fy + fR * 0.45, {size:11, col:"#2c3a4e", weight:800}); }
      else { fy = benchY - bw * 1.4; }
      var box = ph ? {x:W * 0.25, y:8, w:W * 0.75 - 8, h:benchY - 16} : {x:W * 0.27, y:10, w:W * 0.73 - 10, h:benchY - 20};
      /* flacon centré entre le ballon et la loupe, sans toucher ni l'un ni l'autre */
      if (!ph) bw = Math.max(24, Math.min(46, box.x - fx - fR - 14));
      bottle(ctx, ph ? fx : (fx + fR + box.x) / 2, benchY + 2, bw, bw * 2.1, acid ? "H₂SO₄" : "CH₃ONa", acid ? "catalyseur" : "base", acid ? ["!"] : ["flamme", "!"]);
      loupe(ctx, box, [fx, fy - fR * 0.1], acid ? "#c56a00" : "#3b6ec2");
      loupeFrame(ctx, box, "#ffffff", acid ? "#f6efe2" : "#e6edf6");
      clipBox(ctx, box);
      solvent(ctx, box, solv, t, 0.10, "meoh");
      var sc = Math.min(box.w - 20, box.h - 60) / 5.7;
      var V = {st:st, sc:sc, cx:box.x + box.w * 0.5, cy:box.y + box.h * 0.52};
      var pr = drawScene(c, V, at, F0.bonds, []);
      if (st.goal && F0.sn > 0.99 && Math.abs(st.goal.a - st.a) < 0.1){ var tN = "Vue dans l'axe C1–C2 : –OCH₃ et –OH en anti"; label(ctx, tN, box.x + 12, box.y + box.h - 38, {size:fitSize(ctx, tN, box.w - 24, ph ? 11 : 12.5, 700), align:"left", col:"#1f8a5a", bg:"rgba(255,255,255,.9)"}); }
      /* flèches courbes : attaque par l'arrière, puis départ de O */
      var aA = clamp(1 - Math.abs(xi - (acid ? 0.36 : 0.2)) / 0.1, 0, 1);
      if (aA > 0.03){
        var pN = pr[F0.iN], pX = pr[F0.iX], pO = pr[F0.iO];
        var s1 = trim(pN, pX, pN.r + 2, pX.r + 4); curly(ctx, s1[0], s1[1], s1[2], s1[3], 26, "#2a6fdb", aA);
        var m = {x:(pX.x + pO.x) / 2, y:(pX.y + pO.y) / 2}, s2 = trim(m, pO, 0, pO.r + 3); curly(ctx, s2[0], s2[1], s2[2], s2[3], -18, "#c0392b", aA);
      }
      if (acid){ var aP = clamp(1 - Math.abs(xi - 0.06) / 0.06, 0, 1); if (aP > 0.03){ var pO2 = pr[F0.iO], pH = pr[F0.iHo]; var s3 = trim(pO2, pH, pO2.r + 2, pH.r + 3); curly(ctx, s3[0], s3[1], s3[2], s3[3], 22, "#c0392b", aP); } }
      /* étiquettes */
      var fs = ph ? 11 : 12.5, lb = {size:fs, bg:"rgba(255,255,255,.88)"};
      if (F0.sn < 0.3 && (acid ? F0.nuIn > 0.02 : true)){ var pN2 = pr[F0.iN]; label(ctx, acid ? "CH₃OH (nucléophile faible)" : "CH₃O⁻ (bon nucléophile)", clamp(pN2.x, box.x + 90, box.x + box.w - 90), clamp(pN2.y + pN2.r + 16, box.y + 46, box.y + box.h - 30), Object.assign({col:"#1d4fae"}, lb)); }
      if (acid && F0.prot1 > 0.02 && F0.prot1 < 0.98){ var pH2 = pr[F0.iHo]; label(ctx, "H⁺", pH2.x + 14, pH2.y - 10, Object.assign({col:"#1d4fae"}, lb)); }
      if (!acid && F0.pr2 > 0.02 && F0.pr2 < 0.98){ var pH3 = pr[F0.iHo]; label(ctx, "H⁺ (de CH₃OH)", clamp(pH3.x + 14, box.x + 60, box.x + box.w - 60), pH3.y - 12, Object.assign({col:"#1d4fae"}, lb)); }
      if (acid && F0.pr2 > 0.02 && F0.pr2 < 0.98){ var pH4 = pr[F0.iHn]; label(ctx, "H⁺ → CH₃OH", clamp(pH4.x + 14, box.x + 60, box.x + box.w - 60), clamp(pH4.y - 12, box.y + 46, box.y + box.h - 30), Object.assign({col:"#1d4fae"}, lb)); }
      if (F0.iMe >= 0 && xi < 0.2 && !acid){ var pM = pr[F0.iMe]; label(ctx, "CH₃ encombre C2", clamp(pM.x, box.x + 70, box.x + box.w - 70), clamp(pM.y - pM.r - 18, box.y + 46, box.y + box.h - 30), Object.assign({col:"#5f6b7a"}, lb)); }
      if (acid && F0.prot1 > 0.6 && F0.sn < 0.3){ var p2 = pr[F0.i2]; label(ctx, "δ+ plus fort sur C2", clamp(p2.x, box.x + 70, box.x + box.w - 70), clamp(p2.y + p2.r + 18, box.y + 46, box.y + box.h - 30), Object.assign({col:"#a35a00"}, lb)); }
      ctx.restore();
      var stepI = acid ? (xi < 0.19 ? 0 : xi < 0.36 ? 1 : xi < 0.5 ? 2 : xi < 0.62 ? 3 : xi < 0.82 ? 4 : 5) : (xi < 0.18 ? 1 : xi < 0.36 ? 2 : xi < 0.52 ? 3 : xi < 0.78 ? 4 : 5);
      var TXT = acid ? ["H⁺ protone l'oxygène du cycle", "CH₃OH vise C2, par l'arrière", "État de transition : C2 se retourne", "Le cycle est ouvert (oxonium)", "CH₃O⁺H perd son H⁺", "2-méthoxypropan-1-ol"]
                     : ["", "CH₃O⁻ vise C1, par l'arrière", "État de transition : C1 se retourne", "Le cycle est ouvert (alcoolate)", "L'alcoolate prend un H⁺ au méthanol", "1-méthoxypropan-2-ol"];
      var title = TXT[stepI];
      label(ctx, title, box.x + 12, box.y + 18, {size:fitSize(ctx, title, box.w - 24, ph ? 12 : 13.5, 700), align:"left", col:"#13233a", bg:"rgba(255,255,255,.9)"});
      label(ctx, "glisse pour tourner", box.x + box.w - 10, box.y + box.h - 14, {size:ph ? 10.5 : 11, align:"right", col:"#8a95a3", weight:600});
      /* valeurs calculées sur la géométrie */
      var pX2 = at[F0.iX].p, pY2 = at[F0.iY].p, pO3 = at[F0.iO].p, pN3 = at[F0.iN].p;
      var ang = angDeg(sub(pX2, pY2), sub(pO3, pY2)), dih = Math.abs(dihedral(pN3, pX2, pY2, pO3));
      ro.set(0, ["protonation de O", "approche", "état de transition", "cycle ouvert", "échange de H⁺", "produit"][stepI === 0 && !acid ? 1 : stepI]);
      ro.set(1, acid ? "C2 (le plus substitué)" : "C1 (le moins substitué)");
      ro.set(2, Math.round(ang) + "°");
      ro.set(3, F0.sn >= 0.5 ? Math.round(dih) + "° (anti)" : "—");
      var prod = acid ? "2-méthoxypropan-1-ol" : "1-méthoxypropan-2-ol";
      ro.set(4, prod); ro.set(6, F(molM({C:4, H:10, O:2}), 2) + " g/mol");
      /* configuration de C2 (priorités CIP) */
      var c2 = at[F0.i2].p, me = at[F0.iMe].p, cfg;
      if (F0.sn < 0.5) cfg = cipRS(c2, at[F0.iO].p, at[F0.i1].p, me);
      else if (acid) cfg = cipRS(c2, pN3, at[F0.i1].p, me);   /* OCH₃ > CH₂OH > CH₃ */
      else cfg = cipRS(c2, at[F0.iO].p, at[F0.i1].p, me);       /* OH > CH₂OCH₃ > CH₃ */
      ro.set(5, (F0.sn < 0.5 ? "réactif : " : "produit : ") + cfg + (F0.sn >= 0.5 ? (acid ? " (inversion)" : " (inchangée)") : ""));
      var msg = acid
        ? "<b>Milieu acide.</b> L'oxygène protoné tire les électrons : la liaison C2–O, du côté du carbone le plus substitué, s'affaiblit le plus (C2 porte mieux la charge +, en orange). Le méthanol, nucléophile faible, attaque donc C2, par l'arrière : C2 s'inverse, (R) → (S)."
        : "<b>Milieu basique.</b> CH₃O⁻ est un bon nucléophile : SN2 directe, sur le carbone le moins encombré (C1, un CH₂). L'attaque se fait à 180° de l'oxygène ; C1 se retourne comme un parapluie. C2 n'est pas touché : il reste (R).";
      msg += " Le cycle à trois atomes (60°) relâche sa tension (≈ 114 kJ/mol) : l'angle C–C–O passe à 109°. Dans l'axe C1–C2, –OCH₃ et –OH sont en anti (180°). <i>Géométries idéalisées.</i>";
      nt.set(msg, "ok");
    });
  }
});

/* ====================================================================== */
/* 4. Le nucléophile arrive sur le carbonyle (angle de Bürgi-Dunitz)       */
/* ====================================================================== */
var AN_K = {
  but:{n:"butanone", f:"CH₃–CO–CH₂–CH₃", et:true},
  prop:{n:"propanone", f:"CH₃–CO–CH₃", et:false}
};
var AN_NU = {
  H:{n:"H⁻ (de NaBH₄)", L:1.09, prod:{but:["butan-2-ol", {C:4, H:10, O:1}], prop:["propan-2-ol", {C:3, H:8, O:1}]}, hsrc:"H₂O"},
  CN:{n:"CN⁻ (de KCN)", L:1.47, prod:{but:["2-hydroxy-2-méthylbutanenitrile", {C:5, H:9, N:1, O:1}], prop:["2-hydroxy-2-méthylpropanenitrile", {C:4, H:7, N:1, O:1}]}, hsrc:"HCN"}
};
var BD_MIN = 98, BD_MAX = 118, R_TRIG = 2.3;
SFA.sim({
  id:"org-addition-nucleophile-3d", ch:"c10", tag:"Carbonyles",
  titre:"Le nucléophile arrive sur le carbonyle",
  resume:"Une cétone plane en 3D : guide toi-même le nucléophile à la souris. La réaction ne part que s'il arrive au-dessus ou au-dessous du plan, sous un angle d'environ 107° avec C=O. Le carbone devient tétraédrique, et les deux faces donnent les deux énantiomères à parts égales.",
  but:"Attrape le nucléophile (la boule bleue) et amène-le sur le carbone du C=O. Essaie plusieurs angles : la réaction ne démarre que dans la zone verte, à environ 107° de la liaison C=O, au-dessus ou au-dessous du plan de la cétone. Glisse ailleurs pour tourner la vue. Change de face, puis lance 1000 molécules pour voir le bilan R / S.",
  aRetenir:"Le carbone du C=O est sp², plan et électrophile (δ+) ; son orbitale vide π* est perpendiculaire au plan. Le nucléophile l'attaque par-dessus ou par-dessous le plan, à environ 107° de la liaison C=O (angle de Bürgi-Dunitz) : ni de face (côté O, repoussé par les doublets de l'oxygène), ni dans le plan. Le carbone devient sp³ (tétraédrique), l'oxygène porte un − (alcoolate), puis il est protoné : on obtient un alcool. Avec une cétone dissymétrique (R ≠ R'), les deux faces sont équiprobables : on obtient un mélange racémique (50 % R, 50 % S).",
  piege:"La réaction crée un carbone asymétrique, mais pas une activité optique : sans catalyseur chiral, autant de molécules sont attaquées par le dessus que par le dessous, le produit est racémique. Avec la propanone (deux groupes identiques), les deux faces donnent la même molécule, qui n'est pas chirale. Et le nucléophile ne vient pas « en face » de l'oxygène : il arrive par l'arrière, au-dessus du plan.",
  build:function(k, S){
    var c = respCanvas(k, 0.82, 1.2);
    var st = {a:-0.5, b:0.3, t:0, spin:false, demo:true, dt0:0, face:1, nu:[-0.6, 3.3, 0], rho:0, react:false, done:false, msg:"", msgT:0, nR:0, nS:0, stat:null, grab:false};
    var kS = k.seg("Cétone", [["but", "Butanone (dissymétrique)"], ["prop", "Propanone (symétrique)"]], "but", function(){ reset(); st.nR = st.nS = 0; st.stat = null; });
    var nS0 = k.seg("Nucléophile", [["H", "H⁻ (NaBH₄)"], ["CN", "CN⁻ (KCN)"]], "H", function(){ reset(); st.nR = st.nS = 0; st.stat = null; });
    k.button("Recommencer", function(){ reset(); }, true);
    k.button("Lancer 1000 molécules", function(){ var r = 0; for (var q = 0; q < 1000; q++) if (Math.random() < 0.5) r++; st.stat = {r:r, s:1000 - r}; });
    var demoT = k.toggle("Démonstration automatique", true, function(v){ st.demo = v; st.dt0 = 0; reset(); });
    var piT = k.toggle("Montrer l'orbitale vide π* du C=O", true);
    var ro = k.readouts(["Angle O=C···Nu", "Distance C···Nu", "Carbone du C=O", "Face attaquée", "Produit", "M(produit)", "Bilan des attaques"]);
    var nt = k.note("", "ok");
    function reset(){ st.rho = 0; st.react = false; st.done = false; st.nu = [-0.6, 3.3 * (st.face || 1), 0]; st.msg = ""; st.dt0 = 0; }
    /* conversion souris → point du plan d'attaque (plan xy, z = 0) */
    var V = null;
    function toPlane(p){
      if (!V) return null;
      var o = proj3([0, 0, 0], st, V.sc, V.cx, V.cy), ex = proj3([1, 0, 0], st, V.sc, V.cx, V.cy), ey = proj3([0, 1, 0], st, V.sc, V.cx, V.cy);
      var ax = ex.x - o.x, ay = ex.y - o.y, bx = ey.x - o.x, by = ey.y - o.y, det = ax * by - ay * bx;
      if (Math.abs(det) < 0.18 * V.sc * V.sc) return null;
      var dx = p.x - o.x, dy = p.y - o.y;
      return [(dx * by - dy * bx) / det, (ax * dy - ay * dx) / det, 0];
    }
    var lastNuScr = null;
    dragView(c, st, function(type, p){
      if (type === "down"){
        if (lastNuScr && Math.hypot(p.x - lastNuScr.x, p.y - lastNuScr.y) < Math.max(26, lastNuScr.r + 12)){
          if (st.done || st.react){ if (!st.done) return true; reset(); }
          st.grab = true; st.demo = false; demoT.set(false); return true;
        }
        return false;
      }
      if (type === "drag" && st.grab && !st.react){
        var q = toPlane(p); if (!q) return true;
        var r = len(q); if (r < 1.0) q = mul(nrm(q), 1.0); if (r > 4.2) q = mul(nrm(q), 4.2);
        st.nu = q; tryReact(); k.redraw(); return true;
      }
      if (type === "up"){ st.grab = false; return true; }
      return true;
    });
    st.onview = function(){ k.redraw(); };
    function alphaOf(q){ return angDeg([1, 0, 0], q); }
    function tryReact(){
      var r = len(st.nu), al = alphaOf(st.nu);
      if (r > R_TRIG) { st.msg = ""; return; }
      if (al >= BD_MIN && al <= BD_MAX){ st.react = true; st.grab = false; st.face = st.nu[1] >= 0 ? 1 : -1; st.start = st.nu.slice(); st.msg = "ok"; return; }
      st.msg = al < BD_MIN ? "trop du côté de l'oxygène : ses doublets et sa charge δ− repoussent le nucléophile" : "trop près du plan de la molécule : le nucléophile ne rencontre pas l'orbitale π* et se heurte aux groupes du carbone";
      st.msgT = 2.2; st.nu = mul(nrm(st.nu), 2.9); st.grab = false;
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.msgT > 0) st.msgT -= dt;
      if (st.react && !st.done){
        st.rho = Math.min(1, st.rho + dt * 0.45);
        if (st.rho >= 1){ st.done = true; st.doneT = 0; var cfg = st.cfg; if (cfg === "R") st.nR++; else if (cfg === "S") st.nS++; else st.nR++; }
      }
      if (st.done) st.doneT += dt;
      if (st.demo){
        st.dt0 += dt;
        var T = st.dt0, f = st.face;
        if (!st.react){
          if (T < 2.6){ var u = ease(T / 2.6), al = 70 * DEG, r = lerp(3.4, 2.25, u); st.nu = [r * Math.cos(al), f * r * Math.sin(al), 0]; if (T + dt >= 2.6) tryReact(); }
          else if (T < 3.4){ /* rebond */ }
          else if (T < 6.4){ var u2 = ease((T - 3.4) / 3.0), al2 = lerp(150, 107, u2) * DEG, r2 = lerp(3.4, 2.2, u2); st.nu = [r2 * Math.cos(al2), f * r2 * Math.sin(al2), 0]; if (T + dt >= 6.4) tryReact(); }
        } else if (st.done && st.doneT > 3.0){ st.face = -st.face; reset(); }
        st.a = -0.5 + 0.3 * Math.sin(st.t * 0.2);
      }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, K = AN_K[kS.value], N = AN_NU[nS0.value];
      c.clear();
      var benchY = H * (ph ? 0.93 : 0.88);
      benchBg(ctx, W, H, benchY);
      var fR = ph ? W * 0.075 : Math.min(W * 0.06, H * 0.08), fx = ph ? W * 0.12 : fR + 14, fy = benchY - fR;
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.25)"; ctx.beginPath(); ctx.ellipse(fx, benchY, fR * 0.8, fR * 0.16, 0, 0, 7); ctx.fill(); ctx.restore();
      var bw = ph ? W * 0.13 : Math.min(W * 0.07, 46);
      if (!ph) flask(ctx, fx, fy, fR, {liq:"#e2ebf5", level:0.5, t:t}); else fy = benchY - bw * 1.4;
      var box = ph ? {x:W * 0.25, y:8, w:W * 0.75 - 8, h:benchY - 16} : {x:W * 0.25, y:10, w:W * 0.75 - 10, h:benchY - 20};
      /* flacon centré entre le ballon et la loupe, sans toucher ni l'un ni l'autre */
      if (!ph) bw = Math.max(24, Math.min(46, box.x - fx - fR - 14));
      bottle(ctx, ph ? fx : (fx + fR + box.x) / 2, benchY + 2, bw, bw * 2.1, nS0.value === "H" ? "NaBH₄" : "KCN", nS0.value === "H" ? "réducteur" : "toxique", ["!"]);
      loupe(ctx, box, [fx, fy - fR * 0.1], "#3b6ec2");
      loupeFrame(ctx, box, "#ffffff", "#e6edf6");
      clipBox(ctx, box);
      var sc = Math.min(box.w - 20, box.h - 50) / 6.4;
      V = {st:st, sc:sc, cx:box.x + box.w * 0.5, cy:box.y + box.h * 0.5 + 6};
      /* ---- géométrie ---- */
      var rho = st.react ? st.rho : 0, f = st.face, bond = ease(seg01(rho, 0, 0.6)), prot = ease(seg01(rho, 0.62, 1));
      var nF = [0, f, 0];
      var atoms = [], bonds = [], extra = [];
      function A(el, p, o){ atoms.push(At(el, p, o)); return atoms.length - 1; }
      var C0 = [0, 0, 0], dO = [1, 0, 0], dMe = nrm([-0.5, 0, 0.866]), dR = nrm([-0.5, 0, -0.866]);
      function pyr(d){ return nrm(add(mul(d, lerp(1, Math.sqrt(8) / 3, bond)), mul(nF, -bond / 3))); }
      function rigid(d, pts){ var d2 = pyr(d), ax = cross(d, d2), an = Math.acos(clamp(dot(d, d2), -1, 1)); return len(ax) < 1e-6 ? pts : pts.map(function(p){ return rotAx(p, ax, an); }); }
      var iC = A("C", C0, {lab:""});
      var iO = A("O", mul(pyr(dO), lerp(1.22, 1.43, bond)), {lab:"O"});
      bonds.push({a:iC, b:iO, o:bond < 0.5 ? 2 : 1});
      /* groupe méthyle */
      var meC = mul(dMe, 1.51), meH = tetra3(mul(dMe, -1), [0, 1, 0], 0.3).map(function(e){ return add(meC, mul(e, 1.09)); });
      var g1 = rigid(dMe, [meC].concat(meH)), iMe = A("C", g1[0]); bonds.push({a:iC, b:iMe, o:1});
      g1.slice(1).forEach(function(p){ bonds.push({a:iMe, b:A("H", p), o:1}); });
      /* groupe éthyle (ou méthyle) */
      var iR;
      if (K.et){
        var C3 = mul(dR, 1.52), d34 = rotAx(mul(dR, -1), [0, 1, 0], 109.5 * DEG); if (d34[0] > 0) d34 = rotAx(mul(dR, -1), [0, 1, 0], -109.5 * DEG);
        var C4 = add(C3, mul(d34, 1.53)), h3 = sp3pair(mul(dR, -1), d34, [0, 1, 0]).map(function(e){ return add(C3, mul(e, 1.09)); });
        var h4 = tetra3(mul(d34, -1), [0, 1, 0], 0.1).map(function(e){ return add(C4, mul(e, 1.09)); });
        var g2 = rigid(dR, [C3, C4].concat(h3, h4));
        iR = A("C", g2[0]); var i4 = A("C", g2[1]); bonds.push({a:iC, b:iR, o:1}); bonds.push({a:iR, b:i4, o:1});
        bonds.push({a:iR, b:A("H", g2[2]), o:1}); bonds.push({a:iR, b:A("H", g2[3]), o:1});
        g2.slice(4).forEach(function(p){ bonds.push({a:i4, b:A("H", p), o:1}); });
      } else {
        var mC = mul(dR, 1.51), mH = tetra3(mul(dR, -1), [0, 1, 0], 0.9).map(function(e){ return add(mC, mul(e, 1.09)); });
        var g3 = rigid(dR, [mC].concat(mH)); iR = A("C", g3[0]); bonds.push({a:iC, b:iR, o:1});
        g3.slice(1).forEach(function(p){ bonds.push({a:iR, b:A("H", p), o:1}); });
      }
      /* nucléophile */
      var nuP, dirIn;
      if (st.react){ var dS = nrm(st.start), dF = nF, dd = slerpD(dS, dF, bond); nuP = mul(dd, lerp(len(st.start), N.L, bond)); dirIn = dd; }
      else { nuP = st.nu; dirIn = nrm(st.nu); }
      var iNu, bondNu = bond;
      if (nS0.value === "H"){
        iNu = A("H", nuP, {r:0.30});
        var Bp = add(nuP, mul(dirIn, lerp(1.21, 1.21 + 3.2 * prot + 1.4 * bond, bond > 0.98 ? 1 : 0) + 0)), iB = A("B", Bp, {lab:"B"});
        if (bond > 0.02) Bp = add(nuP, mul(dirIn, 1.21 + 2.6 * bond)), atoms[iB].p = Bp;
        bonds.push({a:iNu, b:iB, o:1, alpha:1 - bond, dash:bond > 0.02});
        tetra3(mul(dirIn, -1), [0, 0, 1], 0.6).forEach(function(e){ bonds.push({a:iB, b:A("H", add(Bp, mul(e, 1.21))), o:1}); });
        atoms[iB].badge = bond < 0.5 ? "−" : ""; atoms[iB].badgeCol = "#c0392b";
        atoms[iB].alpha = 1 - 0.5 * prot; for (var q = atoms.length - 3; q < atoms.length; q++) atoms[q].alpha = 1 - 0.5 * prot;
        atoms[iNu].glow = !st.react ? "rgba(42,111,219,.55)" : null;
      } else {
        iNu = A("C", nuP, {glow:!st.react ? "rgba(42,111,219,.55)" : null});
        var iN = A("N", add(nuP, mul(dirIn, 1.16)), {lab:"N"}); bonds.push({a:iNu, b:iN, o:3});
        if (bond < 0.5){ atoms[iNu].badge = "−"; atoms[iNu].badgeCol = "#c0392b"; }
      }
      bonds.push({a:iC, b:iNu, o:1, alpha:bond, dash:bond < 0.98});
      if (bond > 0.5 && prot < 0.5){ atoms[iO].badge = "−"; atoms[iO].badgeCol = "#c0392b"; }
      /* protonation de l'alcoolate */
      var oP = atoms[iO].p, dOH = nrm(add(nrm(oP), mul(nF, -0.55))), hIn = add(oP, mul(dOH, 0.97)), hFar = add(oP, mul(dOH, 4.5));
      var iHo = A("H", lerp3(hFar, hIn, prot), {alpha:prot > 0.01 ? 1 : 0, glow:prot > 0.02 && prot < 0.98 ? "rgba(42,111,219,.45)" : null});
      bonds.push({a:iO, b:iHo, o:1, alpha:prot, dash:prot < 0.98});
      /* δ+ sur le carbone */
      if (!st.react) atoms[iC].glow = "rgba(240,140,30,.45)";
      /* orbitale π* (BV) : gros lobes sur C, petits sur O, de phases opposées */
      if (piT.value && bond < 0.6){
        var pa = 0.55 * (1 - bond / 0.6);
        extra.push(lobeItem(ctx, V, [0, 0.1, 0], [0, 1, 0], 1.45, 0.5, "#4fa36b", pa));
        extra.push(lobeItem(ctx, V, [0, -0.1, 0], [0, -1, 0], 1.45, 0.5, "#c58a2c", pa));
        extra.push(lobeItem(ctx, V, add(atoms[iO].p, [0, 0.1, 0]), [0, 1, 0], 0.85, 0.36, "#c58a2c", pa));
        extra.push(lobeItem(ctx, V, add(atoms[iO].p, [0, -0.1, 0]), [0, -1, 0], 0.85, 0.36, "#4fa36b", pa));
      }
      /* zone de Bürgi-Dunitz (deux secteurs, au-dessus et au-dessous) */
      if (!st.react){
        [1, -1].forEach(function(fz){
          var pts = [], q2;
          for (q2 = 0; q2 <= 10; q2++){ var an = lerp(BD_MIN, BD_MAX, q2 / 10) * DEG; pts.push([1.25 * Math.cos(an), fz * 1.25 * Math.sin(an), 0]); }
          for (q2 = 10; q2 >= 0; q2--){ var an2 = lerp(BD_MIN, BD_MAX, q2 / 10) * DEG; pts.push([R_TRIG * Math.cos(an2), fz * R_TRIG * Math.sin(an2), 0]); }
          var P2 = pts.map(function(p){ return proj3(p, st, sc, V.cx, V.cy); }), zz = 0; P2.forEach(function(p){ zz += p.z; });
          extra.push({z:zz / P2.length - 0.3, f:function(){ ctx.save(); ctx.fillStyle = "rgba(31,157,85,.20)"; ctx.strokeStyle = "rgba(31,157,85,.7)"; ctx.lineWidth = 1.4; ctx.beginPath(); P2.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }});
        });
      }
      var pr = drawScene(c, V, atoms, bonds, extra);
      lastNuScr = pr[iNu];
      /* tracé de l'angle O=C···Nu */
      var pC = pr[iC];
      if (!st.react || bond < 0.3){
        var al = alphaOf(st.react ? st.start : st.nu), ok = al >= BD_MIN && al <= BD_MAX, colA = ok ? "#1f8a5a" : "#c0392b";
        var pN = pr[iNu]; ctx.save(); ctx.strokeStyle = colA; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(pC.x, pC.y); ctx.lineTo(pN.x, pN.y); ctx.stroke(); ctx.setLineDash([]);
        var arc = []; for (var j = 0; j <= 16; j++){ var aa = al * DEG * j / 16, ff = (st.react ? st.start[1] : st.nu[1]) >= 0 ? 1 : -1; arc.push(proj3([0.8 * Math.cos(aa), ff * 0.8 * Math.sin(aa), 0], st, sc, V.cx, V.cy)); }
        ctx.beginPath(); arc.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke(); ctx.restore();
        var mA = arc[8]; label(ctx, Math.round(al) + "°", mA.x + (mA.x - pC.x) * 0.9, mA.y + (mA.y - pC.y) * 0.9, {size:ph ? 11.5 : 13, col:colA, bg:"rgba(255,255,255,.9)"});
      }
      if (!st.react && !(st.msgT > 0)){ var pN3 = pr[iNu]; label(ctx, N.n, clamp(pN3.x, box.x + 70, box.x + box.w - 70), clamp(pN3.y - pN3.r - 18, box.y + 46, box.y + box.h - 30), {size:ph ? 11 : 12.5, col:"#1d4fae", bg:"rgba(255,255,255,.88)"}); }
      if (prot > 0.02 && prot < 0.98){ var pH = pr[iHo]; label(ctx, "H⁺ (de " + N.hsrc + ")", clamp(pH.x + 20, box.x + 70, box.x + box.w - 70), clamp(pH.y - 14, box.y + 46, box.y + box.h - 30), {size:ph ? 11 : 12, col:"#1d4fae", bg:"rgba(255,255,255,.88)"}); }
      /* configuration du produit */
      var cfg = "", cP = atoms[iC].p, pOH = atoms[iO].p, pNu = atoms[iNu].p, pMe = atoms[iMe].p, pR = atoms[iR].p;
      if (K.et){ cfg = nS0.value === "H" ? cipRS(cP, pOH, pR, pMe) : cipRS(cP, pOH, pNu, pR); }
      st.cfg = K.et ? cfg : "";
      ctx.restore();
      var head = st.done ? (K.et ? "Produit : énantiomère (" + cfg + "), face du " + (f > 0 ? "dessus" : "dessous") : "Produit achiral : les deux faces donnent la même molécule")
        : st.react ? (bond < 1 ? "Le nucléophile se lie : le carbone devient tétraédrique" : "L'alcoolate prend un H⁺") : st.msgT > 0 ? "Repoussé !" : "Amène le nucléophile dans la zone verte";
      label(ctx, head, box.x + 12, box.y + 18, {size:fitSize(ctx, head, box.w - 24, ph ? 12 : 13.5, 700), align:"left", col:st.msgT > 0 && !st.react ? "#c0392b" : "#13233a", bg:"rgba(255,255,255,.9)"});
      if (st.msgT > 0 && !st.react){ wrapLabel(ctx, st.msg, box.x + 12, box.y + 44, box.w - 24, {size:ph ? 11 : 12, align:"left", col:"#8a2d1e", weight:600, bg:"#ffffff"}); }
      label(ctx, "attrape la boule bleue · glisse ailleurs pour tourner", box.x + box.w - 10, box.y + box.h - 14, {size:fitSize(ctx, "attrape la boule bleue · glisse ailleurs pour tourner", box.w - 20, ph ? 10.5 : 11, 600), align:"right", col:"#8a95a3", weight:600});
      /* bilan statistique dans la loupe */
      if (st.stat && K.et){
        var bx0 = box.x + 12, by0 = box.y + box.h - 52, bwid = Math.min(220, box.w - 24), pR2 = st.stat.r / 1000;
        ctx.save(); rr(ctx, bx0 - 4, by0 - 18, bwid + 8, 36, 8); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fill();
        ctx.fillStyle = "#2a6fdb"; ctx.fillRect(bx0, by0, bwid * pR2, 10); ctx.fillStyle = "#e07a1f"; ctx.fillRect(bx0 + bwid * pR2, by0, bwid * (1 - pR2), 10); ctx.restore();
        label(ctx, "1000 molécules : " + st.stat.r + " R / " + st.stat.s + " S", bx0, by0 - 8, {size:11, align:"left", col:"#13233a"});
      }
      /* valeurs */
      var cur = st.react ? (bond < 0.98 ? null : nF) : st.nu, dNu = st.react ? len(pNu) : len(st.nu);
      var alS = st.react ? (bond > 0.98 ? angDeg(pOH, pNu) : alphaOf(st.start)) : alphaOf(st.nu);
      void cur;
      ro.set(0, Math.round(alS) + "°" + (st.react && bond > 0.98 ? " (tétraèdre)" : (alS >= BD_MIN && alS <= BD_MAX ? " (zone permise)" : "")));
      ro.set(1, Math.round(dNu * 100) + " pm");
      ro.set(2, bond < 0.1 ? "sp² (plan, 120°)" : bond > 0.98 ? "sp³ (tétraédrique)" : "en train de se pyramidaliser");
      ro.set(3, st.react ? (f > 0 ? "dessus" : "dessous") : (st.nu[1] >= 0 ? "visée : dessus" : "visée : dessous"));
      var P = N.prod[kS.value];
      ro.set(4, P[0] + (K.et && st.done ? " (" + cfg + ")" : "")); ro.set(5, F(molM(P[1]), 2) + " g/mol (" + fBrute(P[1]) + ")");
      var tot = st.nR + st.nS;
      ro.set(6, K.et ? (tot ? st.nR + " R / " + st.nS + " S" : "aucune encore") : (tot ? tot + " × la même molécule" : "aucune encore"));
      var msg = "<b>" + K.n + " + " + N.n + "</b> → " + P[0] + " (" + fBrute(P[1]) + "). ";
      msg += K.et ? "Le carbone du C=O porte deux groupes différents (CH₃ et C₂H₅) : chaque face donne un énantiomère. Une attaque par le dessus et une par le dessous sont aussi probables : mélange racémique."
                  : "Les deux groupes du carbone sont identiques (CH₃) : attaque par le dessus ou par le dessous, c'est la même molécule, achirale.";
      if (st.stat && K.et) msg += " Tirage de 1000 molécules : " + st.stat.r + " R et " + st.stat.s + " S, soit " + F(st.stat.r / 10, 1) + " % de R (≈ 50 %).";
      nt.set(msg + " <i>Zone permise : de " + BD_MIN + "° à " + BD_MAX + "° (angle observé ≈ 107°).</i>", "ok");
    });
  }
});

})();
