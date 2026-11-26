/* Chimie BA1 · chimie organique (vague P3, lot OB) : substitution nucléophile aromatique (complexe de Meisenheimer),
   liaisons hydrogène des alcools, intermédiaire tétraédrique des dérivés d'acides, polyalkylation des amines,
   chimiosélectivité des réducteurs. Simulations SFA originales ; la 3D est dessinée à la main sur un canevas 2D
   (projection perspective), sans bibliothèque. */
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
var EL = {C:["#4a5568", 0.40], H:["#e8edf3", 0.25], O:["#d6392f", 0.42], N:["#2f5fd0", 0.41], S:["#d9a520", 0.52], B:["#e39a8f", 0.44], Na:["#8a63d2", 0.50], Cl:["#2fa84f", 0.52], I:["#7b3fa0", 0.66], Al:["#a7b3c2", 0.58], Li:["#c58ad6", 0.48]};
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
var MA = {C:12.011, H:1.008, N:14.007, O:15.999, S:32.06, Cl:35.45, I:126.904, B:10.81, Al:26.982, Li:6.94, Na:22.990};
function molM(el){ var m = 0; for (var q in el) m += el[q] * MA[q]; return m; }
function F(x, d){ x += (x < 0 ? -1 : 1) * 1e-9; var s = (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d); return s.replace("-", "−").replace(".", ","); }
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function fBrute(el){ var s = ""; ["C", "H", "Cl", "I", "N", "O", "S"].forEach(function(e){ var n = el[e]; if (n) s += e + (n > 1 ? String(n).split("").map(function(d){ return SUBD[+d]; }).join("") : ""); }); return s; }

/* ---------- décor de laboratoire (verrerie en volume) ---------- */
/* ballon à fond rond : centre de la panse (x, y), rayon R ; o : {liq, level, t, bath, bathCol, bubbles, neck} */
function flask(ctx, x, y, R, o){
  o = o || {}; var t = o.t || 0;
  ctx.save();
  if (o.bath){   /* cristallisoir : bain d'eau et de glace (0 °C) */
    var bw = R * 2.9, bh = R * 2.1, bx = x - bw / 2, by = y - R * 0.35;
    var gb = ctx.createLinearGradient(bx, 0, bx + bw, 0); gb.addColorStop(0, "rgba(150,175,200,.75)"); gb.addColorStop(0.18, "rgba(240,246,252,.85)"); gb.addColorStop(0.5, "rgba(200,215,232,.7)"); gb.addColorStop(0.85, "rgba(244,248,252,.85)"); gb.addColorStop(1, "rgba(140,160,185,.75)");
    ctx.fillStyle = gb; rr(ctx, bx, by, bw, bh, [4, 4, R * 0.5, R * 0.5]); ctx.fill();
    var gw = ctx.createLinearGradient(0, by + 6, 0, by + bh); gw.addColorStop(0, "rgba(186,220,245,.9)"); gw.addColorStop(1, "rgba(120,175,220,.95)");
    ctx.fillStyle = o.bathCol || gw; rr(ctx, bx + 5, by + 6, bw - 10, bh - 12, [3, 3, R * 0.45, R * 0.45]); ctx.fill();
    /* glaçons qui flottent (cubes translucides) */
    for (var f = 0; f < 4; f++){
      var cs = R * (0.32 - 0.04 * (f >> 1)), cx2 = f % 2 ? bx + bw - 7 - cs : bx + 7, cy2 = by + 9 + (f >> 1) * bh * 0.34 + 2 * Math.sin(t * 1.2 + f * 1.7), rot = 0.25 * Math.sin(f * 2.1 + 0.6);
      ctx.save(); ctx.translate(cx2 + cs / 2, cy2 + cs / 2); ctx.rotate(rot);
      var gi = ctx.createLinearGradient(-cs / 2, -cs / 2, cs / 2, cs / 2); gi.addColorStop(0, "rgba(255,255,255,.95)"); gi.addColorStop(1, "rgba(205,230,248,.8)");
      ctx.fillStyle = gi; rr(ctx, -cs / 2, -cs / 2, cs, cs, cs * 0.2); ctx.fill(); ctx.strokeStyle = "rgba(120,160,200,.6)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    }
  }
  /* col */
  var nw = R * 0.36, nh = R * (o.neckH || 1.25);
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

/* ---------- petits formats ---------- */
var SUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
function supN(n){ return String(n).split("").map(function(ch){ return SUP[ch] || ch; }).join(""); }
/* 2,3 × 10⁻⁵ ; d chiffres après la virgule */
function sci(x, d){
  if (!isFinite(x)) return "∞";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.995 && d < 2){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return F(x, Math.max(0, d - e));
  return F(m, d) + " × 10" + supN(e);
}
function fmtDur(s){
  if (!isFinite(s)) return "infinie";
  if (s < 1) return "< 1 s";
  if (s < 90) return F(s, 0) + " s";
  if (s < 5400) return F(s / 60, s < 600 ? 1 : 0) + " min";
  if (s < 172800) return F(s / 3600, s < 36000 ? 1 : 0) + " h";
  var j = s / 86400;
  if (j < 730) return F(j, j < 10 ? 1 : 0) + " jours";
  var an = s / 3.156e7;
  return (an < 1000 ? F(an, 0) : sci(an, 1)) + " ans";
}
var RGAS = 8.314;

/* ====================================================================== */
/* 1. Substitution nucléophile aromatique : complexe de Meisenheimer       */
/* ====================================================================== */
/* positions des groupes nitro (numérotation : C1 porte le chlore) ; Ea : barrière du modèle (kJ/mol) */
var SN_SUB = {
  "24":{n:"1-chloro-2,4-dinitrobenzène", short:"2,4-dinitro", no2:[2, 4], Ea:75, el:{C:6, H:3, Cl:1, N:2, O:4}, prod:"1-méthoxy-2,4-dinitrobenzène", pel:{C:7, H:6, N:2, O:5}},
  "4":{n:"1-chloro-4-nitrobenzène", short:"4-nitro", no2:[4], Ea:105, el:{C:6, H:4, Cl:1, N:1, O:2}, prod:"1-méthoxy-4-nitrobenzène", pel:{C:7, H:7, N:1, O:3}},
  "3":{n:"1-chloro-3-nitrobenzène", short:"3-nitro (méta)", no2:[3], Ea:140, el:{C:6, H:4, Cl:1, N:1, O:2}, prod:"1-méthoxy-3-nitrobenzène", pel:{C:7, H:7, N:1, O:3}},
  "0":{n:"chlorobenzène", short:"sans nitro", no2:[], Ea:165, el:{C:6, H:5, Cl:1}, prod:"méthoxybenzène (anisole)", pel:{C:7, H:8, O:1}}
};
var SN_A = 1e10;   /* facteur préexponentiel du modèle (s⁻¹, MeO⁻ en excès) */
function snK(Ea, Tc){ return SN_A * Math.exp(-Ea * 1000 / (RGAS * (Tc + 273.15))); }
/* phases du cycle animé (s de 0 à 1) */
var SN_PH = {app:0.26, form:0.42, inter:0.66, leave:0.82};
function snGeom(key, s, fail){
  var S0 = SN_SUB[key], atoms = [], bonds = [], ring = [], info = {};
  function A(el, p, o){ atoms.push(At(el, p, o)); return atoms.length - 1; }
  var Z = [0, 1, 0], X = [0, 0, 1];
  for (var i = 1; i <= 6; i++){ var th = (180 + 60 * (i - 1)) * DEG, u = [Math.cos(th), 0, Math.sin(th)]; ring.push({u:u, p:mul(u, 1.39)}); }
  var iC = ring.map(function(r){ return A("C", r.p); });
  for (i = 0; i < 6; i++) bonds.push({a:iC[i], b:iC[(i + 1) % 6], o:1, w:1});
  /* liaisons du cycle : alternées (Kekulé) dans le réactif et le produit, « aromatiques » rendues par une 2e ligne fine */
  var u1 = ring[0].u, b = 0, l = 0, back = 0;
  if (!fail){ b = ease(seg01(s, SN_PH.app, SN_PH.form)); l = ease(seg01(s, SN_PH.inter, SN_PH.leave)); }
  else { b = 0.28 * Math.sin(PI * seg01(s, SN_PH.app - 0.04, SN_PH.form + 0.08)); back = ease(seg01(s, SN_PH.form + 0.08, SN_PH.inter + 0.1)); }
  var tet = b * (1 - l);   /* caractère sp³ de C1 */
  var h = 54.75 * DEG * tet;
  var dO = nrm(add(mul(u1, Math.cos(h)), mul(Z, Math.sin(h)))), dCl = nrm(add(mul(u1, Math.cos(h)), mul(Z, -Math.sin(h))));
  if (l > 0) dO = nrm(add(mul(u1, Math.cos(h)), mul(Z, Math.sin(h))));
  var C1 = ring[0].p;
  /* chlore */
  var dClPlane = b < 0.02 && l < 0.02 ? u1 : l > 0 ? nrm(add(mul(u1, 0.5774), mul(Z, -0.8165))) : dCl;
  var clL = lerp(1.74, 1.80, tet) + 3.6 * l;
  var iCl = A("Cl", add(C1, mul(dClPlane, clL)), {lab:"Cl", alpha:1 - 0.55 * seg01(s, SN_PH.leave, 1)});
  bonds.push({a:iC[0], b:iCl, o:1, alpha:1 - l, dash:l > 0.05});
  if (l > 0.3){ atoms[iCl].badge = "−"; atoms[iCl].badgeCol = "#1f7a3e"; atoms[iCl].badgeA = seg01(l, 0.3, 0.6); }
  /* nucléophile CH₃O⁻ : arrive d'au-dessus du plan (+z) */
  var far = add(C1, add(mul(u1, 1.2), mul(Z, 4.2))), near = add(C1, mul(nrm(add(mul(u1, 0.5774), mul(Z, 0.8165))), 2.9));
  var oPos;
  if (!fail){
    var ap = ease(seg01(s, 0, SN_PH.app));
    oPos = b > 0 ? add(C1, mul(dO, lerp(2.9, 1.42, b) + lerp(0, -0.06, l))) : lerp3(far, near, ap);
    if (b >= 0.999 && l > 0) oPos = add(C1, mul(dO, lerp(1.42, 1.36, l)));
  } else {
    var ap2 = ease(seg01(s, 0, SN_PH.app));
    var nearF = add(C1, mul(nrm(add(mul(u1, 0.5774), mul(Z, 0.8165))), 2.9 - 0.9 * b / 0.28));
    oPos = back > 0 ? lerp3(nearF, far, back) : (s < SN_PH.app ? lerp3(far, near, ap2) : nearF);
  }
  var dOC = nrm(sub(oPos, C1));
  var dMe = nrm(add(mul(dOC, 0.454), mul(X, 0.891)));
  var iO = A("O", oPos, {lab:"O"});
  var cMe = add(oPos, mul(dMe, 1.42)), iMe = A("C", cMe);
  bonds.push({a:iO, b:iMe, o:1});
  tetra3(mul(dMe, -1), Z, 0.4).forEach(function(e){ bonds.push({a:iMe, b:A("H", add(cMe, mul(e, 1.09))), o:1}); });
  bonds.push({a:iC[0], b:iO, o:1, alpha:b, dash:b < 0.98});
  if (b < 0.5 && l < 0.01){ atoms[iO].badge = "−"; atoms[iO].badgeCol = "#c0392b"; atoms[iO].badgeA = 1 - b * 2; }
  if (!fail && b < 0.98 && s < SN_PH.form) atoms[iO].glow = "rgba(42,111,219,.45)";
  /* substituants des autres carbones */
  var nitro = [];
  for (i = 2; i <= 6; i++){
    var r = ring[i - 1], cp = r.p;
    if (S0.no2.indexOf(i) >= 0){
      var pN = add(cp, mul(r.u, 1.47)), iN = A("N", pN, {lab:"N"});
      bonds.push({a:iC[i - 1], b:iN, o:1});
      var oA = add(pN, mul(rotAx(r.u, Z, 62.5 * DEG), 1.22)), oB = add(pN, mul(rotAx(r.u, Z, -62.5 * DEG), 1.22));
      var ia = A("O", oA, {lab:"O"}), ib = A("O", oB, {lab:"O"});
      bonds.push({a:iN, b:ia, o:2}); bonds.push({a:iN, b:ib, o:1});
      atoms[iN].badge = "+"; atoms[iN].badgeCol = "#2f5fd0"; atoms[ib].badge = "−"; atoms[ib].badgeCol = "#c0392b"; atoms[ib].badgeA = 0.75;
      nitro.push({pos:i, iN:iN, iO:[ia, ib]});
    } else bonds.push({a:iC[i - 1], b:A("H", add(cp, mul(r.u, 1.08))), o:1});
  }
  /* doubles liaisons du cycle (Kekulé) : réactif/produit ; dans le complexe, C1 est sp³ : C2=C3, C5=C6 et la charge sur C4 */
  var arom = 1 - tet;
  [[0, 1], [2, 3], [4, 5]].forEach(function(p){ bonds.push({a:iC[p[0]], b:iC[p[1]], o:1, inner:true, alpha:arom}); });
  info.iC = iC; info.iCl = iCl; info.iO = iO; info.iMe = iMe; info.nitro = nitro; info.b = b; info.l = l; info.tet = tet; info.ring = ring; info.back = back;
  return {atoms:atoms, bonds:bonds, info:info};
}
/* formes limites du complexe : sites de la charge − (indices de carbones du cycle, ou nitro) */
function snSites(key){
  var S0 = SN_SUB[key], out = [];
  [2, 4, 6].forEach(function(pos){
    out.push({kind:"C", pos:pos});
    if (S0.no2.indexOf(pos) >= 0) out.push({kind:"NO2", pos:pos});
  });
  return out;
}

SFA.sim({
  id:"org-snar-meisenheimer", ch:"c09", tag:"Composés aromatiques",
  titre:"Substitution nucléophile aromatique : le complexe de Meisenheimer",
  resume:"Un 1-chloro-2,4-dinitrobenzène en 3D : l'ion méthanolate attaque le carbone du chlore par-dessus le cycle. La charge négative se répartit sur les carbones 2, 4 et 6, et jusque sur les groupes nitro. Enlève un nitro, déplace-le en méta ou supprime-le : la réaction ralentit énormément et il faut chauffer de plus en plus fort.",
  but:"Regarde le méthanolate CH₃O⁻ attaquer le carbone 1 (celui du chlore) par-dessus le cycle, puis le chlore partir. Pendant la pause sur le complexe de Meisenheimer, suis la tache rouge : elle montre où se place la charge négative dans chaque forme limite. Change les groupes nitro et la température, et compare la demi-vie et le profil d'énergie. Glisse sur la molécule pour la tourner.",
  aRetenir:"La substitution nucléophile aromatique (SNAr) se fait en deux étapes : addition du nucléophile sur le carbone qui porte le groupe partant (le carbone devient sp³ et le cycle perd son aromaticité), puis départ du groupe partant (l'aromaticité revient). L'intermédiaire, chargé négativement, s'appelle complexe de Meisenheimer. Sa charge se place sur les carbones en ortho et en para du carbone attaqué (2, 4 et 6). Un groupe attracteur par mésomérie (NO₂) placé en ortho ou en para reçoit cette charge sur ses oxygènes : il stabilise l'intermédiaire et abaisse la barrière de la 1re étape, qui est l'étape lente. En méta, il ne peut pas la recevoir et n'aide presque pas. Sans attracteur, le cycle riche en électrons repousse le nucléophile : il faut des conditions extrêmes.",
  piege:"Ce n'est pas une SN2 : le nucléophile ne peut pas arriver par l'arrière de la liaison C–Cl (le cycle est dans le chemin) ; il arrive au-dessus du plan, sur l'orbitale π. Et ce n'est pas l'inverse de la substitution électrophile : ici, les groupes attracteurs activent le cycle au lieu de le désactiver. Les barrières affichées sont celles d'un modèle simple (ordres de grandeur réalistes), pas des mesures.",
  build:function(k, S){
    var c = respCanvas(k, 0.84, 1.02);
    var cE = respCanvas(k, 0.36, 0.6);
    var st = {a:-0.45, b:0.75, s:0, t:0, fail:false, auto:true, hot:-1};
    var kSub = k.seg("Groupes nitro sur le cycle", [["24", "2 et 4 (ortho + para)"], ["4", "4 (para)"], ["3", "3 (méta)"], ["0", "aucun"]], "24", function(){ st.s = 0; });
    var kT = k.slider("Température du mélange", 20, 360, 5, 25, "°C", function(){ st.s = 0; });
    var kAuto = k.toggle("Animation en boucle", true, function(v){ st.auto = v; });
    var kStep = k.slider("Étape (animation arrêtée)", 0, 100, 1, 0, "%", function(v){ st.auto = false; kAuto.set(false); st.s = v / 100; });
    var kRes = k.toggle("Montrer les formes limites du complexe", true);
    var ro = k.readouts(["Charge − du complexe sur", "Barrière Ea (modèle)", "Constante k", "Demi-vie t½", "Converti après 1 h", "Vitesse relative (chlorobenzène = 1)", "Produit"]);
    var nt = k.note("", "ok");
    var V = null;
    viewCtl(c, st, {});
    st.onview = function(){ k.redraw(); };
    function rate(){ var S0 = SN_SUB[kSub.value]; return snK(S0.Ea, kT.value); }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto){
        var k0 = rate(), half = Math.LN2 / k0;
        st.fail = half > 86400;
        st.s += dt / (st.fail ? 6.5 : 9.5);
        if (st.s >= 1) st.s = 0;
        kStep.set(Math.round(st.s * 100));
        if (!st.drag) st.a += dt * 0.1 * Math.cos(st.t * 0.25);
      }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, key = kSub.value, S0 = SN_SUB[key], T = kT.value, t = st.t;
      var kk = rate(), half = Math.LN2 / kk, conv = 1 - Math.exp(-kk * 3600);
      if (!st.auto) st.fail = half > 86400;
      c.clear();
      var benchY = H * (ph ? 0.92 : 0.88);
      benchBg(ctx, W, H, benchY);
      /* plaque chauffante + ballon (ou autoclave au-delà de l'ébullition du méthanol) ; sur téléphone : seulement la loupe */
      var hotF = clamp((T - 20) / 340, 0, 1);
      var fR = Math.min(W * 0.06, H * 0.075), fx = fR + 16;
      var plH = 12, plW = fR * 2.5, plY = benchY - plH, fy = plY - fR * 0.98;
      var box = ph ? {x:8, y:8, w:W - 16, h:benchY - 16} : {x:W * 0.25, y:10, w:W * 0.75 - 10, h:benchY - 20};
      if (!ph){
        var gp = ctx.createLinearGradient(0, plY, 0, benchY); gp.addColorStop(0, "#d9dee5"); gp.addColorStop(1, "#8b95a3");
        ctx.fillStyle = gp; rr(ctx, fx - plW / 2, plY, plW, plH, 3); ctx.fill();
        ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * hotF; ctx.fillStyle = "rgb(" + Math.round(150 + 105 * hotF) + "," + Math.round(90 - 40 * hotF) + ",40)"; ctx.fillRect(fx - plW * 0.35, plY + 1, plW * 0.7, 2.5); ctx.restore();
        flask(ctx, fx, fy, fR, {liq:"#f3e7a6", level:0.5, t:t, bubbles:T >= 65});
        if (T > 65) label(ctx, "sous pression", fx, plY - fR * 2.55 - 10, {size:10.5, col:"#8a2d1e", bg:"rgba(255,255,255,.9)"});
        /* jauge : converti après 1 h */
        var gx = fx + fR + 10, gh = fR * 2.2, gy = plY - gh;
        ctx.save(); ctx.fillStyle = "#ffffff"; rr(ctx, gx, gy, 9, gh, 4); ctx.fill(); ctx.strokeStyle = "#9aa6b6"; ctx.stroke();
        ctx.fillStyle = "#1f9d55"; rr(ctx, gx + 1.5, gy + gh - (gh - 3) * conv - 1.5, 6, (gh - 3) * conv, 3); ctx.fill(); ctx.restore();
        label(ctx, F(T, 0) + " °C", fx, benchY + (H - benchY) / 2, {size:11.5, col:"#ffffff"});
        loupe(ctx, box, [fx, fy], "#b0602a");
      } else {
        ctx.save(); ctx.fillStyle = "rgb(" + Math.round(150 + 105 * hotF) + "," + Math.round(90 - 40 * hotF) + ",40)"; ctx.globalAlpha = 0.3 + 0.7 * hotF; ctx.fillRect(14, benchY + 3, W - 28, 2.5); ctx.restore();
        label(ctx, "mélange à " + F(T, 0) + " °C" + (T > 65 ? " (sous pression)" : ""), W / 2, benchY + (H - benchY) / 2 + 2, {size:10.5, col:"#ffffff"});
      }
      loupeFrame(ctx, box, "#ffffff", "#edf0f6");
      clipBox(ctx, box);
      var G = snGeom(key, st.s, st.fail), I = G.info;
      /* cadrage : sphère qui contient le substrat et le complexe, centrée dans la loupe (sous les bandeaux) */
      var G5 = snGeom(key, 0.5, false), cen = [0, 0, 0], nH = 0;
      G5.atoms.forEach(function(at){ cen = add(cen, at.p); nH++; }); cen = mul(cen, 1 / nH);
      var bb = {x0:1e9, x1:-1e9, y0:1e9, y1:-1e9};
      G5.atoms.concat(snGeom(key, 0.97, false).atoms.slice(0, 7), snGeom(key, 0.3, false).atoms).forEach(function(at){ var P = proj3(at.p, st, 1, 0, 0), r = at.r * 0.8 * P.s; bb.x0 = Math.min(bb.x0, P.x - r); bb.x1 = Math.max(bb.x1, P.x + r); bb.y0 = Math.min(bb.y0, P.y - r); bb.y1 = Math.max(bb.y1, P.y + r); });
      var top = ph ? 88 : 92, availH = box.h - top - 24;
      var scT = Math.min((box.w - 28) / (bb.x1 - bb.x0), availH / (bb.y1 - bb.y0), box.w / 5.2);
      st.fs = st.fs ? lerp(st.fs, scT, 0.12) : scT;
      st.fx = st.fx != null ? lerp(st.fx, (bb.x0 + bb.x1) / 2, 0.12) : (bb.x0 + bb.x1) / 2;
      st.fy = st.fy != null ? lerp(st.fy, (bb.y0 + bb.y1) / 2, 0.12) : (bb.y0 + bb.y1) / 2;
      var sc = st.fs;
      V = {st:st, sc:sc, cx:box.x + box.w / 2 - st.fx * sc, cy:box.y + top + availH / 2 - st.fy * sc};

      var inter = !st.fail && st.s >= SN_PH.form - 0.02 && st.s < SN_PH.inter + 0.02;
      var sites = snSites(key), fi = Math.floor(t / 0.9) % sites.length, site = sites[fi];
      /* δ+ sur C1 avant l'attaque */
      if (I.b < 0.3 && I.l < 0.01) G.atoms[I.iC[0]].glow = "rgba(240,140,30," + (0.25 + 0.1 * S0.no2.length) + ")";
      /* charge − délocalisée : un nuage léger sur tous les sites, plus fort sur la forme limite affichée */
      var extra = [];
      if (inter){
        var amp = ease(seg01(st.s, SN_PH.form - 0.02, SN_PH.form + 0.03)) * (1 - ease(seg01(st.s, SN_PH.inter - 0.03, SN_PH.inter + 0.02)));
        sites.forEach(function(si, q){
          var pts = si.kind === "C" ? [G.atoms[I.iC[si.pos - 1]].p] : (function(){ var nn = I.nitro.filter(function(n){ return n.pos === si.pos; })[0]; return [G.atoms[nn.iO[0]].p, G.atoms[nn.iO[1]].p]; })();
          var strong = kRes.value ? (q === fi ? 1 : 0.28) : 0.55;
          pts.forEach(function(P3){
            var P = proj3(P3, st, sc, V.cx, V.cy);
            extra.push({z:P.z + 0.3, f:function(){
              var R = sc * (si.kind === "C" ? 0.75 : 0.6) * P.s, g = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, R);
              g.addColorStop(0, "rgba(214,40,40," + (0.55 * strong * amp) + ")"); g.addColorStop(1, "rgba(214,40,40,0)");
              ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, R, 0, 7); ctx.fill();
            }});
          });
        });
      }
      /* doubles liaisons internes : petites lignes à l'intérieur du cycle */
      var ctr = [0, 0, 0];
      var bondsMain = G.bonds.filter(function(bd){ return !bd.inner; });
      G.bonds.filter(function(bd){ return bd.inner; }).forEach(function(bd){
        var pa = G.atoms[bd.a].p, pb = G.atoms[bd.b].p, qa = lerp3(pa, ctr, 0.2), qb = lerp3(pb, ctr, 0.2), m = lerp3(qa, qb, 0.5);
        var PA = proj3(lerp3(qa, m, 0.15), st, sc, V.cx, V.cy), PB = proj3(lerp3(qb, m, 0.15), st, sc, V.cx, V.cy);
        extra.push({z:(PA.z + PB.z) / 2 - 0.02, f:function(){ ctx.save(); ctx.globalAlpha = bd.alpha; ctx.strokeStyle = "#7d8a9b"; ctx.lineWidth = Math.max(2, sc * 0.055); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(PA.x, PA.y); ctx.lineTo(PB.x, PB.y); ctx.stroke(); ctx.restore(); }});
      });
      /* numéros des carbones (à l'intérieur du cycle) */
      I.ring.forEach(function(r, q){
        var P = proj3(mul(r.u, 0.82), st, sc, V.cx, V.cy);
        extra.push({z:P.z + 0.05, f:function(){ label(ctx, String(q + 1), P.x, P.y, {size:ph ? 9.5 : 10.5, col:"#6b7686", weight:800}); }});
      });
      var pr = drawScene(c, V, G.atoms, bondsMain, extra);
      /* flèches courbes */
      var pO = pr[I.iO], pC1 = pr[I.iC[0]], pCl = pr[I.iCl];
      var aAtt = st.fail ? 0 : seg01(st.s, SN_PH.app - 0.12, SN_PH.app) * (1 - seg01(st.s, SN_PH.form - 0.05, SN_PH.form));
      if (aAtt > 0.03){ var tr = trim(pO, pC1, pO.r + 3, pC1.r + 4); curly(ctx, tr[0], tr[1], tr[2], tr[3], 26, "#1d4fae", aAtt); }
      var aLv = st.fail ? 0 : seg01(st.s, SN_PH.inter - 0.1, SN_PH.inter) * (1 - seg01(st.s, SN_PH.inter + 0.04, SN_PH.inter + 0.08));
      if (aLv > 0.03){ var mx = (pC1.x + pCl.x) / 2, my = (pC1.y + pCl.y) / 2; curly(ctx, mx, my, pCl.x + (pCl.x - pC1.x) * 0.25, pCl.y + (pCl.y - pC1.y) * 0.25 + 2, -22, "#1f7a3e", aLv); }
      /* étiquettes */
      var phase = st.fail ? (st.s < SN_PH.app ? "Le méthanolate s'approche du carbone 1…" : st.s < SN_PH.inter + 0.1 ? (key === "0" ? "Repoussé : le cycle, riche en électrons, ne se laisse pas attaquer à " + F(T, 0) + " °C" : "Trop lent à " + F(T, 0) + " °C : la barrière Ea est trop haute (t½ > 1 jour)") : "Pas de réaction : il faut chauffer bien plus fort")
        : st.s < SN_PH.app ? "CH₃O⁻ arrive au-dessus du plan, sur le carbone 1 (δ+)" : st.s < SN_PH.form ? "Addition : le carbone 1 devient sp³ (tétraédrique)"
        : st.s < SN_PH.inter ? "Complexe de Meisenheimer : cycle non aromatique, chargé −" : st.s < SN_PH.leave ? "Élimination : Cl⁻ part, l'aromaticité revient" : "Produit : " + S0.prod;
      var nl = wrapLabel(ctx, phase, box.x + 12, box.y + 18, box.w - 24, {size:ph ? 11.5 : 13, align:"left", col:st.fail && st.s > SN_PH.app ? "#c0392b" : "#13233a", bg:"rgba(255,255,255,.92)"});
      if (inter && kRes.value && st.s < SN_PH.inter - 0.01){
        var tx = site.kind === "C" ? "forme limite " + (fi + 1) + "/" + sites.length + " : charge − sur le carbone " + site.pos : "forme limite " + (fi + 1) + "/" + sites.length + " : charge − sur un O du NO₂ en " + site.pos;
        label(ctx, tx, box.x + 12, box.y + 18 + nl * (ph ? 20.5 : 22) + 6, {size:ph ? 10.5 : 12, align:"left", col:"#a3241b", bg:"rgba(255,255,255,.92)", maxW:box.w - 36, weight:700});
      }
      if (st.s < SN_PH.app && !st.fail || st.fail){ var pM = pr[I.iO]; if (pM.y > box.y + 70 && st.s < SN_PH.form) label(ctx, "CH₃O⁻", clamp(pM.x + 44, box.x + 40, box.x + box.w - 40), clamp(pM.y - 20, box.y + 70, box.y + box.h - 30), {size:ph ? 10.5 : 12, col:"#1d4fae", bg:"rgba(255,255,255,.88)"}); }
      label(ctx, "glisse pour tourner", box.x + box.w - 10, box.y + box.h - 13, {size:ph ? 10 : 11, align:"right", col:"#8a95a3", weight:600});
      ctx.restore();

      /* ---- profil d'énergie (modèle) ---- */
      var e = cE.ctx, EW = cE.W, EH = cE.H, eph = EW < 480;
      cE.clear();
      var ax = plotFrame(cE, {l:eph ? 34 : 44, r:eph ? 70 : 92, t:16, b:22, x0:0, x1:1, y0:-40, y1:185});
      e.save(); e.strokeStyle = "#c9d2de"; e.lineWidth = 1; e.beginPath(); e.moveTo(ax.L, ax.T); e.lineTo(ax.L, ax.B); e.lineTo(ax.R, ax.B); e.stroke();
      e.setLineDash([3, 4]); e.beginPath(); e.moveTo(ax.L, ax.Y(0)); e.lineTo(ax.R, ax.Y(0)); e.stroke(); e.setLineDash([]); e.restore();
      [0, 50, 100, 150].forEach(function(v){ label(e, String(v), ax.L - 6, ax.Y(v), {size:10, align:"right", col:"#7b8694", weight:600}); });
      label(e, "kJ/mol (modèle)", ax.L + 4, ax.T - 6, {size:10, align:"left", col:"#7b8694", weight:600});
      label(e, "avancement →", ax.R, ax.B + 12, {size:10, align:"right", col:"#7b8694", weight:600});
      var XK = [0.06, 0.3, 0.5, 0.68, 0.94];
      function prof(K2, x){
        var Ea = SN_SUB[K2].Ea, L = [0, Ea, Ea - 45, Ea - 25, -20];
        if (x <= XK[0]) return L[0]; if (x >= XK[4]) return L[4];
        for (var q = 0; q < 4; q++) if (x <= XK[q + 1]){ var u = (x - XK[q]) / (XK[q + 1] - XK[q]); return L[q] + (L[q + 1] - L[q]) * (1 - Math.cos(PI * u)) / 2; }
        return L[4];
      }
      var COLS = {"24":"#c0392b", "4":"#d9822b", "3":"#2a6fdb", "0":"#5f6b7a"};
      ["0", "3", "4", "24"].forEach(function(K2){
        var on = K2 === key; e.save(); e.strokeStyle = COLS[K2]; e.globalAlpha = on ? 1 : 0.32; e.lineWidth = on ? 3 : 1.6; e.beginPath();
        for (var q = 0; q <= 120; q++){ var x = q / 120, y = prof(K2, x); if (q) e.lineTo(ax.X(x), ax.Y(y)); else e.moveTo(ax.X(x), ax.Y(y)); }
        e.stroke(); e.restore();
        label(e, (eph ? {"24":"2,4", "4":"para", "3":"méta", "0":"aucun"}[K2] : SN_SUB[K2].short.replace(" (méta)", "")) + " · " + SN_SUB[K2].Ea, ax.R + 6, ax.Y(SN_SUB[K2].Ea), {size:eph ? 9.5 : 10.5, align:"left", col:COLS[K2], alpha:on ? 1 : 0.6, weight:on ? 800 : 600});
        e.save(); e.strokeStyle = COLS[K2]; e.globalAlpha = on ? 0.6 : 0.2; e.setLineDash([2, 3]); e.beginPath(); e.moveTo(ax.X(XK[1]), ax.Y(SN_SUB[K2].Ea)); e.lineTo(ax.R + 3, ax.Y(SN_SUB[K2].Ea)); e.stroke(); e.restore();
      });
      label(e, "complexe", ax.X(XK[2]), ax.Y(SN_SUB[key].Ea - 45) + 13, {size:eph ? 9.5 : 10.5, col:COLS[key], weight:700});
      /* point qui suit l'animation */
      var xs;
      if (st.fail){ var gg = st.s < SN_PH.app ? lerp(0.02, 0.12, st.s / SN_PH.app) : 0.12 + 0.1 * Math.sin(PI * seg01(st.s, SN_PH.app, SN_PH.inter + 0.1)) - 0.1 * seg01(st.s, SN_PH.inter + 0.1, 1); xs = Math.max(0.02, gg); }
      else xs = st.s < SN_PH.app ? lerp(0.02, 0.14, st.s / SN_PH.app) : st.s < SN_PH.form ? lerp(0.14, XK[2], seg01(st.s, SN_PH.app, SN_PH.form)) : st.s < SN_PH.inter ? XK[2] : st.s < SN_PH.leave ? lerp(XK[2], XK[4], seg01(st.s, SN_PH.inter, SN_PH.leave)) : XK[4] + 0.03;
      var dy = ax.Y(prof(key, xs));
      e.save(); e.shadowColor = "rgba(0,0,0,.25)"; e.shadowBlur = 6; ball(e, ax.X(xs), dy - 6, 7, COLS[key]); e.restore();

      /* ---- afficheurs ---- */
      var siteTxt = "C2, C4, C6" + (S0.no2.filter(function(p){ return p !== 3; }).length ? " + NO₂ en " + S0.no2.filter(function(p){ return p !== 3; }).join(" et ") : "") + (S0.no2.indexOf(3) >= 0 ? " (pas le NO₂ en 3)" : "");
      ro.set(0, siteTxt);
      ro.set(1, S0.Ea + " kJ/mol");
      ro.set(2, sci(kk, 1) + " s⁻¹");
      ro.set(3, fmtDur(half));
      ro.set(4, F(conv * 100, conv > 0.995 || conv < 0.005 ? 1 : 0) + " %");
      var rel = Math.exp((SN_SUB["0"].Ea - S0.Ea) * 1000 / (RGAS * (T + 273.15)));
      ro.set(5, key === "0" ? "1 (référence)" : sci(rel, 1));
      ro.set(6, S0.prod + " (" + F(molM(S0.pel), 2) + " g/mol)");
      var msg = "<b>" + S0.n + "</b> (" + fBrute(S0.el) + ", " + F(molM(S0.el), 2) + " g/mol) + CH₃O⁻ dans le méthanol, à " + F(T, 0) + " °C. ";
      if (key === "24") msg += "Les deux nitro (ortho et para) reçoivent la charge du complexe sur leurs oxygènes : la barrière est basse, la réaction marche déjà à température ambiante.";
      else if (key === "4") msg += "Un seul nitro, en para : il reçoit encore la charge, mais il faut chauffer vers 130 °C pour une demi-vie d'environ une heure.";
      else if (key === "3") msg += "Le nitro en méta est sur un carbone qui ne porte jamais la charge (elle va en 2, 4 et 6) : il n'aide que par effet inductif, la barrière reste haute.";
      else msg += "Sans groupe attracteur, l'addition-élimination ne se fait pratiquement pas ; à 350 °C avec une base forte, la substitution passe par un autre mécanisme (élimination-addition, benzyne), hors programme ici.";
      msg += " <i>Modèle : k = A·e<sup>−Ea/RT</sup>, A = 10<sup>10</sup> s<sup>−1</sup> (méthanolate en excès) ; barrières choisies pour retrouver les conditions classiques de laboratoire.</i>";
      nt.set(msg, "ok");
    });
  }
});

/* ====================================================================== */
/* 2. Liaisons hydrogène : éthanol, méthoxyméthane, propane                */
/* ====================================================================== */
/* squelette en zigzag : liste d'éléments lourds (C ou O), chaîne linéaire ; Hoh : l'O porte un H (alcool) */
function lhBuild(heavy, Hoh){
  var A = [], B = [], i;
  for (i = 0; i < heavy.length; i++){
    var L = 1.47;   /* pas moyen C–C / C–O */
    A.push({el:heavy[i], p:[i * L * 0.8165, (i % 2) * L * 0.5774, 0]});
    if (i) B.push([i - 1, i]);
  }
  var n = heavy.length;
  for (i = 0; i < n; i++){
    var nb = []; if (i > 0) nb.push(nrm(sub(A[i - 1].p, A[i].p))); if (i < n - 1) nb.push(nrm(sub(A[i + 1].p, A[i].p)));
    var el = heavy[i], dirs;
    if (nb.length === 1) dirs = tetra3(nb[0], [0, 0, 1], 0.5);
    else dirs = sp3pair(nb[0], nb[1], [0, 0, 1]);
    var need = el === "C" ? 4 - nb.length : (Hoh ? 1 : 0);
    for (var q = 0; q < need; q++){ A.push({el:"H", p:add(A[i].p, mul(dirs[q], el === "O" ? 0.96 : 1.09)), hO:el === "O"}); B.push([i, A.length - 1]); }
  }
  var c = [0, 0, 0]; A.forEach(function(a){ c = add(c, a.p); }); c = mul(c, 1 / A.length);
  A.forEach(function(a){ a.p = sub(a.p, c); });
  var cnt = {}; A.forEach(function(a){ cnt[a.el] = (cnt[a.el] || 0) + 1; });
  var iO = -1, iHO = -1; A.forEach(function(a, j){ if (a.el === "O") iO = j; if (a.hO) iHO = j; });
  return {atoms:A, bonds:B, el:cnt, iO:iO, iHO:iHO};
}
function lhAlc(n){ var h = []; for (var i = 0; i < n; i++) h.push("C"); h.push("O"); return lhBuild(h, true); }
var LH_ALC = [
  {n:"méthanol", f:"CH₃OH", Teb:64.7, sol:"miscible en toutes proportions"},
  {n:"éthanol", f:"CH₃CH₂OH", Teb:78.4, sol:"miscible en toutes proportions"},
  {n:"propan-1-ol", f:"CH₃(CH₂)₂OH", Teb:97.2, sol:"miscible en toutes proportions"},
  {n:"butan-1-ol", f:"CH₃(CH₂)₃OH", Teb:117.7, sol:"≈ 7 g pour 100 g d'eau"},
  {n:"pentan-1-ol", f:"CH₃(CH₂)₄OH", Teb:138.0, sol:"≈ 2 g pour 100 g d'eau"}
];
var LH_ETH = {n:"méthoxyméthane", f:"CH₃–O–CH₃", Teb:-24.0, sol:"", mol:lhBuild(["C", "O", "C"], false)};
var LH_PRO = {n:"propane", f:"CH₃–CH₂–CH₃", Teb:-42.1, sol:"", mol:lhBuild(["C", "C", "C"], false)};
LH_ALC.forEach(function(a, i){ a.mol = lhAlc(i + 1); });
var LH_N = 9, LH_R = 3.7, LH_H = 20;   /* molécules par tube, rayon et hauteur du tube (Å) */
function lhFrac(T, Teb){ return 1 / (1 + Math.exp(-(T - Teb) / 2.2)); }
function lhSeed(sd){ var s = sd; return function(){ s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function lhTube(seed){
  var rnd = lhSeed(seed), ms = [];
  for (var i = 0; i < LH_N; i++){
    var a = rnd() * 2 * PI, r = rnd() * (LH_R - 1.8);
    var e0 = nrm([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), e1 = nrm(cross(e0, perpTo(e0))), e2 = cross(e0, e1);
    ms.push({c:[r * Math.cos(a), 1.8 + (i % 4) * 2.6 + rnd(), r * Math.sin(a)], v:[0, 0, 0], e:[e0, e1, e2], w:[rnd() - 0.5, rnd() - 0.5, rnd() - 0.5], gas:false, rk:rnd()});
  }
  ms.sort(function(x, y){ return x.rk - y.rk; });
  return {ms:ms, rnd:rnd, hb:{}, bub:[]};
}
function lhWorld(m, p){ return add(m.c, add(add(mul(m.e[0], p[0]), mul(m.e[1], p[1])), mul(m.e[2], p[2]))); }
function lhOrtho(m){ var a = nrm(m.e[0]), b = nrm(sub(m.e[1], mul(a, dot(m.e[1], a)))); m.e = [a, b, cross(a, b)]; }
/* un pas de dynamique très simplifiée (unités : Å, s) */
function lhStep(tb, mol, Teb, T, dt, Mm, alc){
  var ms = tb.ms, rnd = tb.rnd, fg = lhFrac(T, Teb), nGas = Math.round(fg * LH_N);
  /* quelques molécules seulement en vapeur sous Téb (pression de vapeur), toutes au-dessus */
  if (T < Teb) nGas = Math.min(nGas, 1);
  var nLiq = LH_N - nGas, hl = nLiq ? 1.9 + nLiq * 0.98 : 0;
  var kT = (T + 273.15) / 300, vth = 9 * Math.sqrt(kT * 46 / Mm);
  ms.forEach(function(m, i){ m.gas = i >= nLiq; });
  ms.forEach(function(m, i){
    var f = [0, 0, 0];
    if (m.gas){
      var sp = len(m.v); if (sp < vth * 0.6) m.v = add(m.v, mul(nrm([rnd() - 0.5, rnd() - 0.5 + (m.c[1] < hl + 1 ? 0.6 : 0), rnd() - 0.5]), vth * 0.5));
      if (sp > vth * 1.4) m.v = mul(m.v, 0.97);
    } else {
      var jig = 7 * Math.sqrt(kT);
      f = add(f, [(rnd() - 0.5) * jig, (rnd() - 0.5) * jig, (rnd() - 0.5) * jig]);
      if (m.c[1] > hl - 1.2) f[1] -= 30 * (m.c[1] - hl + 1.2);
      m.v = mul(m.v, 0.9);
    }
    /* contacts */
    for (var j = 0; j < ms.length; j++){
      if (j === i) continue;
      var o = ms[j], d = sub(m.c, o.c), L = len(d) || 0.01, dm = 3.5;
      if (L < dm) f = add(f, mul(d, 40 * (dm - L) / L));
      if (alc && !m.gas && !o.gas){
        var pO = lhWorld(m, mol.atoms[mol.iO].p), qO = lhWorld(o, mol.atoms[mol.iO].p), dd = sub(qO, pO), LO = len(dd);
        if (LO > 2.9 && LO < 7.5) f = add(f, mul(dd, 9 / LO));
      }
    }
    m.v = add(m.v, mul(f, dt));
    m.c = add(m.c, mul(m.v, dt));
    /* parois : cylindre vertical, fond, haut */
    var rr2 = Math.hypot(m.c[0], m.c[2]), rmax = LH_R - 1.5;
    if (rr2 > rmax){ var nx = m.c[0] / rr2, nz = m.c[2] / rr2; m.c[0] = nx * rmax; m.c[2] = nz * rmax; var vn = m.v[0] * nx + m.v[2] * nz; if (vn > 0){ m.v[0] -= 2 * vn * nx; m.v[2] -= 2 * vn * nz; } }
    if (m.c[1] < 1.5){ m.c[1] = 1.5; if (m.v[1] < 0) m.v[1] = -m.v[1]; }
    if (m.c[1] > LH_H - 1.6){ m.c[1] = LH_H - 1.6; if (m.v[1] > 0) m.v[1] = -m.v[1]; }
    /* rotation */
    var ws = m.gas ? 2.2 * Math.sqrt(kT) : 0.9 * Math.sqrt(kT);
    m.w = add(mul(m.w, 0.96), [(rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.6]);
    var wl = len(m.w); if (wl > 1e-6){ var ang = ws * dt * Math.min(wl, 1.2); m.e = m.e.map(function(e){ return rotAx(e, m.w, ang); }); }
    /* l'alcool en liquide oriente son O–H vers l'O voisin le plus proche */
    if (alc && !m.gas){
      var Hp = lhWorld(m, mol.atoms[mol.iHO].p), Op = lhWorld(m, mol.atoms[mol.iO].p), best = null, bd = 4.2;
      ms.forEach(function(o, j){ if (j === i || o.gas) return; var q = lhWorld(o, mol.atoms[mol.iO].p), dq = dist(q, Op); if (dq < bd){ bd = dq; best = q; } });
      if (best){ var h = sub(Hp, Op), tg = sub(best, Op), ax = cross(h, tg); if (len(ax) > 1e-4){ var an = Math.acos(clamp(dot(nrm(h), nrm(tg)), -1, 1)); m.e = m.e.map(function(e){ return rotAx(e, ax, an * Math.min(1, dt * 4)); }); } }
    }
    lhOrtho(m);
  });
  /* bulles d'ébullition près de Téb */
  var boil = Math.abs(T - Teb) < 6 && nLiq > 0;
  if (boil && rnd() < dt * 9) tb.bub.push({x:(rnd() - 0.5) * 1.4 * (LH_R - 1.2), z:(rnd() - 0.5) * 1.4 * (LH_R - 1.2), y:0.6, r:0.25 + rnd() * 0.3});
  tb.bub.forEach(function(b){ b.y += dt * 5; b.r += dt * 0.25; });
  tb.bub = tb.bub.filter(function(b){ return b.y < hl; });
  return {hl:hl, nLiq:nLiq, nGas:nGas, boil:boil};
}
/* ponts H (modèle) : chaque H–O d'alcool donne au plus un pont, vers l'O le plus proche d'une autre molécule (H···O < 2,5 Å et O···O < 3,5 Å) */
function lhHB(tb, mol){
  var out = [];
  tb.ms.forEach(function(m, i){
    if (m.gas) return;
    var H = lhWorld(m, mol.atoms[mol.iHO].p), O = lhWorld(m, mol.atoms[mol.iO].p);
    var best = null, bd = 2.5;
    tb.ms.forEach(function(o, j){
      if (j === i || o.gas) return;
      var Q = lhWorld(o, mol.atoms[mol.iO].p), dHQ = dist(H, Q);
      if (dHQ < bd && dist(O, Q) < 3.5){ bd = dHQ; best = {i:i, j:j, H:H, O:Q}; }
    });
    if (best) out.push(best);
  });
  return out;
}

SFA.sim({
  id:"org-liaison-h-alcools", ch:"c10", tag:"Alcools et éthers",
  titre:"Liaisons hydrogène : éthanol, éther et propane",
  resume:"Trois tubes de molécules de masse voisine (≈ 45 g/mol) : l'éthanol forme des ponts hydrogène qui clignotent, le méthoxyméthane et le propane n'en forment pas. Chauffe : le propane bout à −42 °C, l'éther à −24 °C, l'éthanol seulement à 78 °C. Allonge la chaîne de l'alcool : il bout plus haut et se mélange de moins en moins à l'eau.",
  but:"Laisse la température monter toute seule (ou règle-la) et regarde chaque liquide bouillir : les molécules quittent le liquide et remplissent le tube. Dans le tube de l'alcool, les traits bleus sont les ponts H (O–H···O) ; un trait jaune est un pont qui vient de se former. Change la longueur de chaîne de l'alcool, puis glisse sur la scène pour tourner les tubes.",
  aRetenir:"L'éthanol (46 g/mol), le méthoxyméthane (46 g/mol) et le propane (44 g/mol) ont presque la même masse, donc des forces de London voisines. Seul l'alcool a un H lié à un O : il forme des ponts hydrogène O–H···O avec ses voisines. Pour bouillir, il faut les rompre : l'éthanol bout à 78 °C, contre −24 °C pour l'éther (polaire, mais sans H sur l'oxygène) et −42 °C pour le propane (apolaire). Quand la chaîne s'allonge, les forces de London augmentent et la température d'ébullition monte (méthanol 65 °C → pentan-1-ol 138 °C) ; mais la partie apolaire grandit et l'alcool se mélange de moins en moins à l'eau : miscible jusqu'au propan-1-ol, ≈ 7 g pour 100 g d'eau pour le butan-1-ol, ≈ 2 g pour le pentan-1-ol.",
  piege:"Un éther a bien un oxygène, mais aucun H lié à cet oxygène : entre deux molécules d'éther, il n'y a pas de pont H (il peut en accepter un de l'eau, ce qui le rend un peu soluble). Et un pont hydrogène n'est pas une liaison covalente : c'est une attraction entre molécules, environ 20 fois plus faible que la liaison O–H (≈ 20 contre ≈ 460 kJ/mol), qui se forme et se rompt sans cesse dans le liquide. Les molécules sont dessinées en grand : la densité du liquide n'est pas à l'échelle.",
  build:function(k, S){
    var c = respCanvas(k, 0.9, 1.22);
    var st = {a:0.35, b:0.22, t:0, auto:true, dir:1, T:-55, last:{}};
    var kAlc = k.seg("Alcool du 1er tube", [["0", "C₁"], ["1", "C₂ (éthanol)"], ["2", "C₃"], ["3", "C₄"], ["4", "C₅"]], "1", function(){ tubes[0] = lhTube(11); });
    var kT = k.slider("Température", -60, 150, 1, -55, "°C", function(){ st.auto = false; kAuto.set(false); });
    var kAuto = k.toggle("Chauffer puis refroidir en boucle", true, function(v){ st.auto = v; });
    var kHB = k.toggle("Montrer les ponts H", true);
    var ro = k.readouts(["Alcool", "Méthoxyméthane", "Propane", "Ponts H par molécule d'alcool (liquide)", "Écart de Téb alcool − propane", "Alcool dans l'eau (20 °C)"]);
    var nt = k.note("", "ok");
    var tubes = [lhTube(11), lhTube(23), lhTube(37)], res = [null, null, null], hbAvg = 0, hbN = 0;
    viewCtl(c, st, {});
    st.onview = function(){ st.b = clamp(st.b, -0.05, 0.6); k.redraw(); };
    function specs(){ var A = LH_ALC[+kAlc.value]; return [A, LH_ETH, LH_PRO]; }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto){
        var T = kT.value + st.dir * dt * 11;
        if (T > 148){ T = 148; st.dir = -1; } if (T < -58){ T = -58; st.dir = 1; }
        kT.set(T);
      }
      var sp = specs(), T2 = kT.value;
      for (var q = 0; q < 3; q++){
        var M = molM(sp[q].mol.el);
        for (var n = 0; n < 2; n++) res[q] = lhStep(tubes[q], sp[q].mol, sp[q].Teb, T2, dt / 2, M, q === 0);
      }
      if (!st.drag && st.auto) st.a += dt * 0.08;
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, T = kT.value, sp = specs();
      c.clear();
      var benchY = H * (ph ? 0.9 : 0.89);
      benchBg(ctx, W, H, benchY);
      /* bloc chauffant / refroidissant */
      var hot = clamp(T / 150, 0, 1), cold = clamp(-T / 60, 0, 1);
      var blk = {x:10, y:benchY - (ph ? 22 : 30), w:W - 20, h:ph ? 22 : 30};
      var gb = ctx.createLinearGradient(0, blk.y, 0, blk.y + blk.h); gb.addColorStop(0, "#cfd6df"); gb.addColorStop(1, "#7d8796");
      ctx.fillStyle = gb; rr(ctx, blk.x, blk.y, blk.w, blk.h, 6); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.85 * Math.max(hot, cold); ctx.fillStyle = hot > 0 ? "rgb(" + Math.round(200 + 55 * hot) + "," + Math.round(120 - 70 * hot) + ",40)" : "#6fb3ff";
      rr(ctx, blk.x + 8, blk.y + blk.h * 0.38, blk.w - 16, blk.h * 0.24, 4); ctx.fill(); ctx.restore();
      label(ctx, "T = " + F(T, 0) + " °C", W / 2, benchY + (H - benchY) / 2 + 1, {size:ph ? 11 : 12.5, col:"#ffffff"});
      /* trois tubes (projection à faible perspective, centrée à mi-hauteur du tube) */
      var lab = ph ? 50 : 56, top = 26 + lab;
      var colW = (W - 20) / 3, yLimB = blk.y - 3;
      var sb = Math.sin(Math.abs(st.b)), cb = Math.cos(st.b);
      var sc = Math.min(colW * 0.86 / (2 * LH_R), (yLimB - top) / (LH_H * cb + 2 * LH_R * sb));
      label(ctx, "même masse (≈ 45 g/mol), forces différentes" + (ph ? "" : " · glisse pour tourner"), W / 2, 15, {size:ph ? 10.5 : 12, col:"#5f6b7a", weight:700, maxW:W - 20});
      var allHB = 0, nLiqA = 0;
      for (var q = 0; q < 3; q++){
        var S0 = sp[q], tb = tubes[q], R0 = res[q] || {hl:0, nLiq:LH_N, nGas:0}, mol = S0.mol;
        var cx = 10 + colW * (q + 0.5), cyM = yLimB - (LH_R * sb + LH_H / 2 * cb) * sc;
        var P3 = (function(cx0){ return function(p){ var r = rot3([p[0], p[1] - LH_H / 2, p[2]], st.a, st.b), s = 1 / (1 - r[2] * 0.01); return {x:cx0 + r[0] * sc * s, y:cyM - r[1] * sc * s, z:r[2], s:s}; }; })(cx);
        function arc(y, f0, f1){ var pts = []; for (var j = 0; j <= 24; j++){ var th = st.a + lerp(f0, f1, j / 24); pts.push(P3([LH_R * Math.cos(th), y, LH_R * Math.sin(th)])); } return pts; }
        /* silhouette : arcs avant (θ − a de π à 0) et arrière (de 0 à −π) */
        var botF = arc(0, PI, 0), topB = arc(LH_H, 0, -PI), topF = arc(LH_H, PI, 0);
        var Lt = topF[0], Lb = botF[0], Rt = topF[24], Rb = botF[24];
        var xL = Lb.x, xR = Rb.x, yT = Math.min(Lt.y, Rt.y), yB = Math.max(Lb.y, Rb.y);
        ctx.save();
        var gG = ctx.createLinearGradient(xL, 0, xR, 0); gG.addColorStop(0, "rgba(170,190,215,.35)"); gG.addColorStop(0.5, "rgba(245,249,253,.25)"); gG.addColorStop(1, "rgba(150,170,200,.4)");
        ctx.fillStyle = gG; ctx.beginPath(); ctx.moveTo(Lt.x, Lt.y); botF.forEach(function(p){ ctx.lineTo(p.x, p.y); }); topB.forEach(function(p){ ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(90,110,135,.35)"; ctx.lineWidth = 1.1; ctx.beginPath(); topB.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
        /* liquide */
        if (R0.nLiq > 0){
          var liqF = arc(R0.hl, PI, 0), liqB = arc(R0.hl, 0, -PI), liqCol = q === 0 ? "rgba(120,170,235," : q === 1 ? "rgba(150,200,170," : "rgba(225,200,140,";
          var gl = ctx.createLinearGradient(xL, 0, xR, 0); gl.addColorStop(0, liqCol + ".45)"); gl.addColorStop(0.45, liqCol + ".22)"); gl.addColorStop(1, liqCol + ".5)");
          ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(liqF[0].x, liqF[0].y); botF.forEach(function(p){ ctx.lineTo(p.x, p.y); }); liqF.slice().reverse().forEach(function(p){ ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.fill();
          ctx.fillStyle = liqCol + ".22)"; ctx.beginPath(); liqF.concat(liqB).forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = liqCol + ".75)"; ctx.lineWidth = 1.2; ctx.stroke();
        }
        ctx.restore();
        /* molécules + ponts H + bulles, triés en profondeur */
        var items = [];
        tb.ms.forEach(function(m){
          var pr = mol.atoms.map(function(a){ return P3(lhWorld(m, a.p)); });
          mol.bonds.forEach(function(b2){ var p = pr[b2[0]], r = pr[b2[1]]; items.push({z:(p.z + r.z) / 2 - 0.05, f:function(){ ctx.strokeStyle = "#8793a3"; ctx.lineWidth = Math.max(1.4, sc * 0.11 * p.s); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(r.x, r.y); ctx.stroke(); }}); });
          mol.atoms.forEach(function(a, j){ var p = pr[j], col = EL[a.el][0], rad = Math.max(a.el === "H" ? 1.6 : 2.6, EL[a.el][1] * sc * 0.85 * p.s); items.push({z:p.z, f:function(){ ball(ctx, p.x, p.y, rad, col, m.gas ? 0.85 : 1); }}); });
        });
        var hb = [];
        if (q === 0){
          hb = lhHB(tb, mol);
          var nowK = {};
          hb.forEach(function(h){
            var key = h.i + "-" + h.j; nowK[key] = 1; if (!st.last[key]) st.last[key] = t;
            if (!kHB.value) return;
            var p = P3(h.H), r = P3(h.O), fresh = t - st.last[key] < 0.45;
            items.push({z:(p.z + r.z) / 2 + 0.1, f:function(){ ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = fresh ? "#f2c230" : "#2aa7d8"; ctx.lineWidth = fresh ? 2.6 : 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(r.x, r.y); ctx.stroke(); ctx.restore(); }});
          });
          for (var kk in st.last) if (!nowK[kk]) delete st.last[kk];
          allHB = hb.length; nLiqA = R0.nLiq;
        }
        tb.bub.forEach(function(b){ var p = P3([b.x, b.y, b.z]); items.push({z:p.z, f:function(){ ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, b.r * sc, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }}); });
        items.sort(function(x, y){ return x.z - y.z; });
        ctx.save(); ctx.beginPath(); ctx.moveTo(Lt.x, Lt.y); botF.forEach(function(p){ ctx.lineTo(p.x, p.y); }); topB.forEach(function(p){ ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.clip();
        items.forEach(function(it){ it.f(); }); ctx.restore();
        /* paroi avant, bord et reflet */
        ctx.save();
        ctx.strokeStyle = "rgba(90,110,135,.75)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(Lt.x, Lt.y); ctx.lineTo(Lb.x, Lb.y); ctx.moveTo(Rt.x, Rt.y); ctx.lineTo(Rb.x, Rb.y); ctx.stroke();
        ctx.beginPath(); botF.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
        ctx.beginPath(); topF.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
        var hx = lerp(Lb.x, Rb.x, 0.18); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx, yT + 10); ctx.lineTo(hx, yB - 8); ctx.stroke();
        ctx.restore();
        /* étiquettes sous le tube : nom, masse, Téb, état */
        var M = molM(mol.el), state = R0.nGas === LH_N ? "gaz" : R0.boil ? "bout !" : "liquide";
        var stCol = state === "gaz" ? "#c0392b" : state === "bout !" ? "#d9822b" : "#1f6fb2";
        var ly = ph ? 30 : 32;
        label(ctx, S0.n, cx, ly, {size:ph ? 10.5 : 12.5, col:"#13233a", weight:800, maxW:colW - 6});
        label(ctx, F(M, 1) + " g/mol · Téb " + F(S0.Teb, 0) + " °C", cx, ly + (ph ? 15 : 17), {size:ph ? 9.5 : 11, col:"#4a5568", weight:700, maxW:colW - 6});
        label(ctx, state, cx, yT + (ph ? 22 : 26), {size:ph ? 10.5 : 11.5, col:"#ffffff", bg:stCol});
        if (q === 0 && kHB.value && allHB){ label(ctx, allHB + " ponts H", cx, ly + (ph ? 30 : 34), {size:ph ? 9.5 : 11, col:"#1b7fa8", weight:800}); }
        else if (q > 0){ label(ctx, "aucun pont H", cx, ly + (ph ? 30 : 34), {size:ph ? 9.5 : 11, col:"#8a95a3", weight:700}); }
      }
      /* moyenne glissante des ponts H par molécule d'alcool liquide */
      var perM = nLiqA ? 2 * allHB / nLiqA : 0;   /* chaque pont relie deux molécules */ hbAvg = hbN ? lerp(hbAvg, perM, 0.04) : perM; hbN++;
      function stateTxt(q){ var R0 = res[q] || {nGas:0, boil:false}; return R0.nGas === LH_N ? "gaz (Téb " + F(sp[q].Teb, 0) + " °C)" : R0.boil ? "à ébullition" : "liquide"; }
      ro.set(0, sp[0].n + " : " + stateTxt(0));
      ro.set(1, stateTxt(1)); ro.set(2, stateTxt(2));
      ro.set(3, nLiqA ? F(hbAvg, 1) : "— (tout en vapeur)");
      ro.set(4, F(sp[0].Teb - LH_PRO.Teb, 0) + " °C");
      ro.set(5, sp[0].sol);
      var MA0 = molM(sp[0].mol.el);
      var msg = "<b>" + sp[0].n + "</b> (" + fBrute(sp[0].mol.el) + ", " + F(MA0, 2) + " g/mol), <b>méthoxyméthane</b> (" + fBrute(LH_ETH.mol.el) + ", " + F(molM(LH_ETH.mol.el), 2) + " g/mol), <b>propane</b> (" + fBrute(LH_PRO.mol.el) + ", " + F(molM(LH_PRO.mol.el), 2) + " g/mol). ";
      if (kAlc.value === "1") msg += "Masses presque égales : l'écart de " + F(sp[0].Teb - LH_PRO.Teb, 0) + " °C entre les Téb vient des ponts H de l'éthanol, que les deux autres ne peuvent pas former entre eux.";
      else msg += "Avec " + (+kAlc.value + 1) + " carbone" + (kAlc.value === "0" ? "" : "s") + ", l'alcool n'a plus la même masse que les deux autres : sa Téb change aussi par les forces de London (chaîne plus " + (kAlc.value === "0" ? "courte" : "longue") + "). Dans l'eau : " + sp[0].sol + ".";
      nt.set(msg + " <i>Températures d'ébullition sous 1 atm ; ponts H comptés quand H···O &lt; 2,5 Å ; par molécule = 2 × ponts / molécules du liquide (chaque pont touche deux molécules).</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 3. Addition-élimination sur un dérivé d'acide : intermédiaire tétraédrique */
/* ====================================================================== */
var TI_SUB = {
  cl:{n:"chlorure d'éthanoyle", f:"CH₃COCl", pKa:-7, HX:"HCl", lg:"Cl⁻", el:{C:2, H:3, Cl:1, O:1}, bil:"ion éthanoate + Cl⁻", col:"#1f9d55"},
  anh:{n:"anhydride éthanoïque", f:"(CH₃CO)₂O", pKa:4.76, HX:"CH₃COOH", lg:"CH₃COO⁻", el:{C:4, H:6, O:3}, bil:"2 ions éthanoate", col:"#d9822b"},
  est:{n:"éthanoate de méthyle", f:"CH₃COOCH₃", pKa:15.5, HX:"CH₃OH", lg:"CH₃O⁻", el:{C:3, H:6, O:2}, bil:"ion éthanoate + méthanol", col:"#2a6fdb"},
  ami:{n:"éthanamide", f:"CH₃CONH₂", pKa:38, HX:"NH₃", lg:"NH₂⁻", el:{C:2, H:5, N:1, O:1}, bil:"rien à froid ; à chaud : ion éthanoate + NH₃", col:"#8e44ad"}
};
var TI_ORDER = ["cl", "anh", "est", "ami"];
var TI_PKA_NU = 15.7;   /* pKa de H₂O, acide conjugué de HO⁻ (valeur usuelle en chimie organique) */
function tiEa(key){ return 50 + 0.8 * TI_SUB[key].pKa; }
var TI_PH = {app:0.22, form:0.38, inter:0.6, leave:0.78};
/* groupe rigide : atomes en coordonnées locales (liaison vers le carbone selon −x, atome d'attache en (L,0,0)) */
function tiGroup(kind){
  var A = [], B = [];
  function at(el, p, o){ A.push({el:el, p:p, o:o || {}}); return A.length - 1; }
  function dirAng(fromDir, deg, sz){ return rotAx(fromDir, [0, 1, 0], (sz || 1) * deg * DEG); }
  function methylOn(i, uBack){ tetra3(uBack, [0, 1, 0], 0.5).forEach(function(e){ B.push([i, at("H", add(A[i].p, mul(e, 1.09)))]); }); }
  if (kind === "Me"){ var c = at("C", [1.51, 0, 0]); methylOn(c, [-1, 0, 0]); }
  else if (kind === "cl"){ at("Cl", [1.79, 0, 0], {lab:"Cl"}); }
  else if (kind === "est"){
    var o = at("O", [1.34, 0, 0], {lab:"O"}), v = dirAng([-1, 0, 0], 116), cm = at("C", add(A[o].p, mul(v, 1.44)));
    B.push([o, cm]); methylOn(cm, mul(v, -1));
  } else if (kind === "anh"){
    var o2 = at("O", [1.36, 0, 0], {lab:"O"}), v2 = dirAng([-1, 0, 0], 117), c2 = at("C", add(A[o2].p, mul(v2, 1.36)));
    B.push([o2, c2]);
    var back = mul(v2, -1), dOd = rotAx(back, [0, 1, 0], 122 * DEG), dMe = rotAx(back, [0, 1, 0], -118 * DEG);
    var od = at("O", add(A[c2].p, mul(dOd, 1.20)), {lab:"O"}); B.push([c2, od, 2]);
    var cm2 = at("C", add(A[c2].p, mul(dMe, 1.50))); B.push([c2, cm2]); methylOn(cm2, mul(dMe, -1));
  } else if (kind === "ami"){
    var n = at("N", [1.35, 0, 0], {lab:"N"});
    [120, -120].forEach(function(dg){ B.push([n, at("H", add(A[n].p, mul(dirAng([-1, 0, 0], dg), 1.01)))]); });
  } else if (kind === "OH"){
    var oh = at("O", [1.43, 0, 0], {lab:"O"}); B.push([oh, at("H", add(A[oh].p, mul(dirAng([-1, 0, 0], -105), 0.96)))]);
  }
  return {A:A, B:B};
}
/* place le groupe pour une liaison de direction d (unitaire) et une longueur l (l'atome d'attache est mis à l·d) */
function tiPlace(G, d, l){
  var x = [1, 0, 0], ax = cross(x, d), an = Math.acos(clamp(dot(x, d), -1, 1));
  var L0 = G.A[0].p[0];
  return G.A.map(function(a){ var p = [a.p[0] - L0 + l, a.p[1], a.p[2]]; return len(ax) < 1e-6 ? (an > 3 ? rotAx(p, [0, 1, 0], PI) : p) : rotAx(p, ax, an); });
}
var TI_LEN = {cl:1.79, anh:1.36, est:1.34, ami:1.35};
function tiGeom(key, s, heat){
  var atoms = [], bonds = [], info = {};
  function A(el, p, o){ atoms.push(At(el, p, o)); return atoms.length - 1; }
  var nF = [0, 1, 0], dO0 = [1, 0, 0], dMe0 = nrm([-0.5, 0, 0.866]), dX0 = nrm([-0.5, 0, -0.866]);
  var dBD = nrm([Math.cos(107 * DEG), Math.sin(107 * DEG), 0.12]);
  var b = ease(seg01(s, TI_PH.app, TI_PH.form)), e = ease(seg01(s, TI_PH.inter, TI_PH.leave));
  var Xleaves = key !== "ami" || heat;
  var pr = key === "ami" && heat ? ease(seg01(s, TI_PH.form + 0.04, TI_PH.inter - 0.02)) : 0;
  function tet(d){ return nrm(add(mul(d, lerp(1, Math.sqrt(8) / 3, b)), mul(nF, -b / 3))); }
  var dNuA = b > 0 ? slerpD(dBD, nF, b) : dBD;
  var dirs = {O:tet(dO0), Me:tet(dMe0), X:tet(dX0), Nu:dNuA};
  /* départ : le partant s'éloigne selon sa direction, les trois autres redeviennent coplanaires */
  var lgK = Xleaves ? "X" : "Nu", uL = Xleaves ? tet(dX0) : nF;
  if (e > 0){
    ["O", "Me", "X", "Nu"].forEach(function(kk){
      if (kk === lgK) return;
      var d = dirs[kk], pj = nrm(sub(d, mul(uL, dot(d, uL))));
      dirs[kk] = nrm(lerp3(d, pj, e));
    });
    dirs[lgK] = uL;
  }
  var C0 = A("C", [0, 0, 0]);
  /* O du carbonyle */
  var lCO = e > 0 ? lerp(1.40, Xleaves ? 1.25 : 1.22, e) : lerp(1.22, 1.40, b);
  var iO = A("O", mul(dirs.O, lCO), {lab:"O"});
  bonds.push({a:C0, b:iO, o:(b < 0.5 || e > 0.5) ? 2 : 1});
  if (b >= 0.5 && e < 0.5){ atoms[iO].badge = "−"; atoms[iO].badgeCol = "#c0392b"; }
  /* méthyle */
  var gMe = tiGroup("Me"), pMe = tiPlace(gMe, dirs.Me, 1.51), base = atoms.length;
  gMe.A.forEach(function(a, j){ A(a.el, pMe[j]); }); bonds.push({a:C0, b:base, o:1}); gMe.B.forEach(function(bb){ bonds.push({a:base + bb[0], b:base + bb[1], o:bb[2] || 1}); });
  /* groupe X (et son éventuel départ) */
  var gX = tiGroup(key), lX = TI_LEN[key] * (1 + 0.04 * b) + (Xleaves ? 2.8 * e : 0), pX = tiPlace(gX, dirs.X, lX), bx = atoms.length;
  var fadeX = Xleaves ? 1 - 0.45 * seg01(s, TI_PH.leave, 1) : 1;
  gX.A.forEach(function(a, j){ A(a.el, pX[j], {lab:a.o.lab || "", alpha:fadeX}); });
  gX.B.forEach(function(bb){ bonds.push({a:bx + bb[0], b:bx + bb[1], o:bb[2] || 1}); });
  bonds.push({a:C0, b:bx, o:key === "ami" && b < 0.5 ? 1 : 1, alpha:Xleaves ? 1 - e : 1, dash:Xleaves && e > 0.05});
  info.iX = bx;
  /* amide à chaud : un H⁺ (de l'eau) se fixe sur N avant le départ de NH₃ */
  if (key === "ami" && heat){
    var nP = atoms[bx].p, uOut = nrm(add(dirs.X, [0, -0.6, 0])), hFar = add(nP, mul(uOut, 3.6)), hNear = add(nP, mul(nrm(add(mul(dirs.X, 0.3), [0, -1, 0])), 1.01));
    var iHp = A("H", lerp3(hFar, hNear, pr), {alpha:pr > 0.01 ? 1 : 0, glow:pr > 0.02 && pr < 0.98 ? "rgba(42,111,219,.45)" : null});
    if (e > 0){ var off = mul(dirs.X, 2.8 * e); atoms[iHp].p = add(hNear, off); atoms[iHp].alpha = fadeX; }
    bonds.push({a:bx, b:iHp, o:1, alpha:pr, dash:pr < 0.98});
    if (pr > 0.5 && e < 0.4){ atoms[bx].badge = "+"; atoms[bx].badgeCol = "#2f5fd0"; }
  }
  if (Xleaves && e > 0.4 && !(key === "ami")){ atoms[bx].badge = "−"; atoms[bx].badgeCol = "#c0392b"; atoms[bx].badgeA = seg01(e, 0.4, 0.7); }
  /* nucléophile HO⁻ */
  var lNu;
  if (b <= 0) lNu = lerp(3.9, 2.6, ease(seg01(s, 0, TI_PH.app)));
  else lNu = lerp(2.6, 1.43, b);
  if (e > 0) lNu = Xleaves ? lerp(1.43, 1.33, e) : 1.43 + 2.8 * e;
  var gN = tiGroup("OH"), pN = tiPlace(gN, dirs.Nu, lNu), bn = atoms.length;
  gN.A.forEach(function(a, j){ A(a.el, pN[j], {lab:a.o.lab || ""}); }); gN.B.forEach(function(bb){ bonds.push({a:bn + bb[0], b:bn + bb[1], o:1}); });
  bonds.push({a:C0, b:bn, o:1, alpha:Xleaves ? b : b * (1 - e), dash:b < 0.98 || (!Xleaves && e > 0.05)});
  if (b < 0.5 || (!Xleaves && e > 0.4)){ atoms[bn].badge = "−"; atoms[bn].badgeCol = "#c0392b"; }
  if (b < 0.98 && s < TI_PH.form) atoms[bn].glow = "rgba(42,111,219,.45)";
  if (b < 0.3) atoms[C0].glow = "rgba(240,140,30,.45)";
  info.C0 = C0; info.iO = iO; info.iNu = bn; info.b = b; info.e = e; info.pr = pr; info.Xleaves = Xleaves;
  return {atoms:atoms, bonds:bonds, info:info};
}

SFA.sim({
  id:"org-intermediaire-tetraedrique-3d", ch:"c10", tag:"Dérivés d'acides",
  titre:"Addition-élimination sur un dérivé d'acide",
  resume:"Un chlorure d'acyle, un anhydride, un ester ou un amide en 3D face à l'ion hydroxyde : le nucléophile s'additionne, le carbone devient tétraédrique, puis le groupe le plus stable sous forme d'anion s'en va. La barrière suit le pKa de l'acide conjugué du groupe partant (HCl −7, acide éthanoïque 4,8, méthanol 15,5, NH₃ 38).",
  but:"Choisis le dérivé d'acide et regarde HO⁻ attaquer le carbone du C=O par-dessus le plan. Pendant la pause sur l'intermédiaire tétraédrique, compare les deux groupes qui pourraient partir : HO⁻ (pKa de H₂O 15,7, valeur usuelle en chimie organique) ou X⁻. Avec l'amide, chauffe à reflux pour voir ce qui change. Le profil d'énergie compare les quatre barrières ; glisse sur la molécule pour la tourner.",
  aRetenir:"Les dérivés d'acides R–CO–X réagissent par addition-élimination (substitution nucléophile sur l'acyle) : 1) le nucléophile s'additionne sur le carbone du C=O, qui passe de sp² (plan) à sp³ : c'est l'intermédiaire tétraédrique, qui porte un O⁻ ; 2) le doublet de O⁻ reforme le C=O et chasse un groupe. Celui qui part est le meilleur groupe partant, c'est-à-dire la base la plus faible, dont l'acide conjugué H–X a le plus petit pKa. Ordre de réactivité : chlorure d'acyle (HCl, pKa −7) > anhydride (acide carboxylique, 4,8) > ester (alcool, ≈ 16) > amide (NH₃, 38). On peut toujours descendre cette échelle (chlorure → anhydride → ester → amide), jamais la remonter directement.",
  piege:"Le groupe partant n'est pas « celui qui est attaché le moins fort » au hasard : c'est l'anion le plus stable, donc la base la plus faible. NH₂⁻ est une base très forte (pKa de NH₃ = 38) : à froid, l'intermédiaire de l'amide rejette plutôt HO⁻ et rien ne se passe. À chaud, l'azote est d'abord protoné et part sous forme de NH₃ (pKa de NH₄⁺ = 9,2), bien meilleur partant. Les barrières sont celles d'un modèle linéaire en pKa (Ea = 50 + 0,8·pKa kJ/mol, pour l'étape d'addition), pour comparer, pas des mesures.",
  build:function(k, S){
    var c = respCanvas(k, 0.84, 1.02);
    var cE = respCanvas(k, 0.42, 0.62);
    var st = {a:0.55, b:0.38, s:0, t:0, auto:true};
    var kSub = k.seg("Dérivé d'acide", [["cl", "Chlorure d'acyle"], ["anh", "Anhydride"], ["est", "Ester"], ["ami", "Amide"]], "cl", function(){ st.s = 0; });
    var kHeat = k.toggle("Chauffer à reflux (utile pour l'amide)", false, function(){ st.s = 0; });
    var kAuto = k.toggle("Animation en boucle", true, function(v){ st.auto = v; });
    var kStep = k.slider("Étape (animation arrêtée)", 0, 100, 1, 0, "%", function(v){ st.auto = false; kAuto.set(false); st.s = v / 100; });
    var ro = k.readouts(["Groupe partant possible", "pKa de son acide conjugué", "Qui quitte l'intermédiaire ?", "Barrière (modèle)", "Vitesse relative (amide = 1, 25 °C)", "Carbone attaqué", "Bilan avec HO⁻ en excès"]);
    var nt = k.note("", "ok");
    viewCtl(c, st, {});
    st.onview = function(){ k.redraw(); };
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto){ st.s += dt / 10; if (st.s >= 1) st.s = 0; kStep.set(Math.round(st.s * 100)); if (!st.drag) st.a += dt * 0.1 * Math.cos(st.t * 0.22); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, key = kSub.value, S0 = TI_SUB[key], heat = kHeat.value, t = st.t;
      c.clear();
      var benchY = H * (ph ? 0.92 : 0.88);
      benchBg(ctx, W, H, benchY);
      var box = ph ? {x:8, y:8, w:W - 16, h:benchY - 16} : {x:W * 0.25, y:10, w:W * 0.75 - 10, h:benchY - 20};
      var fR = Math.min(W * 0.06, H * 0.075), fx = fR + 16, plY = benchY - 12, fy = plY - fR * 0.98;
      if (!ph){
        var gp = ctx.createLinearGradient(0, plY, 0, benchY); gp.addColorStop(0, "#d9dee5"); gp.addColorStop(1, "#8b95a3");
        ctx.fillStyle = gp; rr(ctx, fx - fR * 1.25, plY, fR * 2.5, 12, 3); ctx.fill();
        if (heat){ ctx.save(); ctx.fillStyle = "#e8552a"; ctx.globalAlpha = 0.6 + 0.3 * Math.sin(t * 4); ctx.fillRect(fx - fR * 0.9, plY + 1, fR * 1.8, 2.5); ctx.restore(); }
        /* réfrigérant à reflux quand on chauffe */
        if (heat){ var gx = fx - fR * 0.13; var gr = ctx.createLinearGradient(gx, 0, gx + fR * 0.26, 0); gr.addColorStop(0, "rgba(160,190,220,.7)"); gr.addColorStop(0.5, "rgba(255,255,255,.85)"); gr.addColorStop(1, "rgba(140,170,205,.7)"); ctx.fillStyle = gr; ctx.fillRect(gx - 3, fy - fR * 3.6, fR * 0.26 + 6, fR * 1.5); ctx.strokeStyle = "rgba(90,110,135,.7)"; ctx.strokeRect(gx - 3, fy - fR * 3.6, fR * 0.26 + 6, fR * 1.5); }
        flask(ctx, fx, fy, fR, {liq:"#dfe9f5", level:0.5, t:t, bubbles:heat});
        bottle(ctx, (fx + fR + box.x) / 2, benchY + 2, Math.max(24, Math.min(44, box.x - fx - fR - 14)), Math.max(24, Math.min(44, box.x - fx - fR - 14)) * 2.1, "NaOH", "corrosif", ["!"]);
        loupe(ctx, box, [fx, fy], "#3b6ec2");
      } else {
        label(ctx, "NaOH aqueux" + (heat ? " · à reflux" : " · 25 °C"), W / 2, benchY + (H - benchY) / 2 + 2, {size:10.5, col:"#ffffff"});
      }
      loupeFrame(ctx, box, "#ffffff", "#e9eef6");
      clipBox(ctx, box);
      var G = tiGeom(key, st.s, heat), I = G.info;
      /* cadrage stable (réactif, intermédiaire, produit) */
      var bb = {x0:1e9, x1:-1e9, y0:1e9, y1:-1e9};
      [0.12, 0.5, 0.9].forEach(function(s0){ tiGeom(key, s0, heat).atoms.forEach(function(at){ if (at.alpha < 0.05) return; var P = proj3(at.p, st, 1, 0, 0), r = at.r * 0.8 * P.s; bb.x0 = Math.min(bb.x0, P.x - r); bb.x1 = Math.max(bb.x1, P.x + r); bb.y0 = Math.min(bb.y0, P.y - r); bb.y1 = Math.max(bb.y1, P.y + r); }); });
      var top = ph ? 74 : 72, availH = box.h - top - 24;
      var scT = Math.min((box.w - 28) / (bb.x1 - bb.x0), availH / (bb.y1 - bb.y0), box.w / 4.2);
      st.fs = st.fs ? lerp(st.fs, scT, 0.12) : scT;
      st.fx = st.fx != null ? lerp(st.fx, (bb.x0 + bb.x1) / 2, 0.12) : (bb.x0 + bb.x1) / 2;
      st.fy = st.fy != null ? lerp(st.fy, (bb.y0 + bb.y1) / 2, 0.12) : (bb.y0 + bb.y1) / 2;
      var sc = st.fs, V = {st:st, sc:sc, cx:box.x + box.w / 2 - st.fx * sc, cy:box.y + top + availH / 2 - st.fy * sc};
      var pr = drawScene(c, V, G.atoms, G.bonds, []);
      /* flèches courbes : attaque, puis départ */
      var pNu = pr[I.iNu], pC = pr[I.C0], pO = pr[I.iO], pX = pr[I.iX];
      var a1 = seg01(st.s, TI_PH.app - 0.1, TI_PH.app) * (1 - seg01(st.s, TI_PH.form - 0.06, TI_PH.form));
      if (a1 > 0.03){ var tr = trim(pNu, pC, pNu.r + 3, pC.r + 4); curly(ctx, tr[0], tr[1], tr[2], tr[3], 24, "#1d4fae", a1); }
      var a2 = seg01(st.s, TI_PH.inter - 0.1, TI_PH.inter) * (1 - seg01(st.s, TI_PH.inter + 0.05, TI_PH.inter + 0.09));
      if (a2 > 0.03){
        var tr2 = trim(pO, pC, pO.r + 2, pC.r + 2); curly(ctx, tr2[0], tr2[1], (tr2[0] + tr2[2]) / 2, (tr2[1] + tr2[3]) / 2, -18, "#c0392b", a2);
        var pL = I.Xleaves ? pX : pNu, mx = (pC.x + pL.x) / 2, my = (pC.y + pL.y) / 2; curly(ctx, mx, my, pL.x + (pL.x - pC.x) * 0.3, pL.y + (pL.y - pC.y) * 0.3, -20, "#c0392b", a2);
      }
      var lgTxt = key === "ami" ? (heat ? "NH₃" : "HO⁻") : S0.lg;
      var phase = st.s < TI_PH.app ? "HO⁻ arrive au-dessus du plan, sur le carbone δ+ du C=O"
        : st.s < TI_PH.form ? "Addition : le carbone passe de sp² (plan) à sp³"
        : st.s < TI_PH.inter ? "Intermédiaire tétraédrique : O⁻ va reformer le C=O"
        : st.s < TI_PH.leave ? (I.Xleaves ? "Élimination : " + lgTxt + " part" : "Retour : c'est HO⁻ qui repart, l'amide reste intact")
        : (I.Xleaves ? "Produit : acide éthanoïque (puis ion éthanoate) + " + (key === "ami" ? "NH₃" : S0.lg) : "Rien n'a changé : à froid, l'amide résiste");
      var nl = wrapLabel(ctx, phase, box.x + 12, box.y + 18, box.w - 24, {size:ph ? 11.5 : 13, align:"left", col:!I.Xleaves && st.s > TI_PH.inter ? "#a3241b" : "#13233a", bg:"rgba(255,255,255,.92)"});
      if (st.s >= TI_PH.form - 0.02 && st.s < TI_PH.leave){
        var cmp = key === "ami" && !heat ? "Qui part ? HO⁻ (pKa 15,7) plutôt que NH₂⁻ (pKa 38)" : key === "ami" ? "Qui part ? NH₃ (pKa de NH₄⁺ 9,2) plutôt que HO⁻ (15,7)" : "Qui part ? " + S0.lg + " (pKa " + F(S0.pKa, S0.pKa % 1 ? 1 : 0) + ") plutôt que HO⁻ (15,7)";
        wrapLabel(ctx, cmp, box.x + 12, box.y + 18 + nl * (ph ? 20.5 : 22) + 6, box.w - 24, {size:ph ? 10.5 : 12, align:"left", col:"#5b2c86", bg:"rgba(255,255,255,.92)", weight:700});
      }
      if (st.s < TI_PH.app){ label(ctx, "HO⁻", clamp(pNu.x + 34, box.x + 30, box.x + box.w - 30), clamp(pNu.y - 18, box.y + top - 6, box.y + box.h - 30), {size:ph ? 10.5 : 12, col:"#1d4fae", bg:"rgba(255,255,255,.88)"}); }
      label(ctx, "glisse pour tourner", box.x + box.w - 10, box.y + box.h - 13, {size:ph ? 10 : 11, align:"right", col:"#8a95a3", weight:600});
      ctx.restore();

      /* ---- profil d'énergie (modèle) ---- */
      var e = cE.ctx, eph = cE.W < 480;
      cE.clear();
      var ax = plotFrame(cE, {l:eph ? 34 : 44, r:eph ? 74 : 104, t:16, b:22, x0:0, x1:1, y0:-30, y1:105});
      e.save(); e.strokeStyle = "#c9d2de"; e.lineWidth = 1; e.beginPath(); e.moveTo(ax.L, ax.T); e.lineTo(ax.L, ax.B); e.lineTo(ax.R, ax.B); e.stroke();
      e.setLineDash([3, 4]); e.beginPath(); e.moveTo(ax.L, ax.Y(0)); e.lineTo(ax.R, ax.Y(0)); e.stroke(); e.setLineDash([]); e.restore();
      [-20, 0, 20, 40, 60, 80, 100].forEach(function(v){ label(e, F(v, 0), ax.L - 6, ax.Y(v), {size:10, align:"right", col:"#7b8694", weight:600}); });
      label(e, "kJ/mol (modèle)", ax.L + 4, ax.T - 6, {size:10, align:"left", col:"#7b8694", weight:600});
      label(e, "avancement →", ax.R, ax.B + 12, {size:10, align:"right", col:"#7b8694", weight:600});
      var XK = [0.05, 0.27, 0.47, 0.67, 0.93];
      function lev(K2){
        var Ea = tiEa(K2);
        if (K2 === "ami") return heat && K2 === key ? [0, Ea, 52, 62, -20] : [0, Ea, 52, 95, 14];
        return [0, Ea, Ea - 26, Ea - 14, -20];
      }
      function prof(K2, x){
        var L = lev(K2);
        if (x <= XK[0]) return L[0]; if (x >= XK[4]) return L[4];
        for (var q = 0; q < 4; q++) if (x <= XK[q + 1]){ var u = (x - XK[q]) / (XK[q + 1] - XK[q]); return L[q] + (L[q + 1] - L[q]) * (1 - Math.cos(PI * u)) / 2; }
        return L[4];
      }
      /* étiquettes à droite : écartées d'au moins 13 px */
      var tagY = {}, ordY = TI_ORDER.map(function(K2){ return [K2, ax.Y(lev(K2)[1])]; }).sort(function(p, q){ return q[1] - p[1]; });
      ordY.forEach(function(p, i){ var y = p[1]; if (i && y > ordY[i - 1][2] - 13) y = ordY[i - 1][2] - 13; p[2] = y; tagY[p[0]] = y; });
      TI_ORDER.forEach(function(K2){
        var on = K2 === key, col = TI_SUB[K2].col, L = lev(K2), top2 = L[1], xTop = XK[1];
        e.save(); e.strokeStyle = col; e.globalAlpha = on ? 1 : 0.3; e.lineWidth = on ? 3 : 1.6; e.beginPath();
        for (var q = 0; q <= 120; q++){ var x = q / 120, y = prof(K2, x); if (q) e.lineTo(ax.X(x), ax.Y(y)); else e.moveTo(ax.X(x), ax.Y(y)); }
        e.stroke();
        e.globalAlpha = on ? 0.6 : 0.2; e.setLineDash([2, 3]); e.beginPath(); e.moveTo(ax.X(xTop), ax.Y(top2)); e.lineTo(ax.R + 3, ax.Y(top2)); e.stroke(); e.restore();
        var nm = eph ? {cl:"chlorure", anh:"anhydride", est:"ester", ami:"amide"}[K2] : {cl:"chlorure", anh:"anhydride", est:"ester", ami:"amide"}[K2] + " (pKa " + F(TI_SUB[K2].pKa, TI_SUB[K2].pKa % 1 ? 1 : 0) + ")";
        label(e, nm, ax.R + 6, tagY[K2], {size:eph ? 9.5 : 10.5, align:"left", col:col, alpha:on ? 1 : 0.65, weight:on ? 800 : 600, maxW:(eph ? 74 : 104) - 8});
      });
      label(e, "intermédiaire", ax.X(XK[2]), ax.Y(lev(key)[2]) + 13, {size:eph ? 9.5 : 10.5, col:TI_SUB[key].col, weight:700});
      var xs, sP = st.s, Xl = I.Xleaves;
      if (sP < TI_PH.app) xs = lerp(0.01, 0.12, sP / TI_PH.app);
      else if (sP < TI_PH.form) xs = lerp(0.12, XK[2], seg01(sP, TI_PH.app, TI_PH.form));
      else if (sP < TI_PH.inter) xs = XK[2];
      else if (sP < TI_PH.leave) xs = Xl ? lerp(XK[2], XK[4], seg01(sP, TI_PH.inter, TI_PH.leave)) : lerp(XK[2], 0.03, seg01(sP, TI_PH.inter, TI_PH.leave));
      else xs = Xl ? XK[4] + 0.03 : 0.03;
      e.save(); e.shadowColor = "rgba(0,0,0,.25)"; e.shadowBlur = 6; ball(e, ax.X(xs), ax.Y(prof(key, xs)) - 6, 7, TI_SUB[key].col); e.restore();

      /* ---- afficheurs ---- */
      var Ea = tiEa(key), RT = RGAS * 298.15 / 1000;
      ro.set(0, key === "ami" ? (heat ? "NH₃ (après protonation)" : "NH₂⁻") : S0.lg);
      ro.set(1, key === "ami" && heat ? "9,2 (NH₄⁺) ; NH₃ : 38" : F(S0.pKa, S0.pKa % 1 ? 1 : 0) + " (" + S0.HX + ")");
      ro.set(2, I.Xleaves ? (key === "ami" ? "NH₃" : S0.lg) : "HO⁻ (retour)");
      ro.set(3, F(Ea, 1) + " kJ/mol");
      ro.set(4, key === "ami" ? "1 (référence)" : sci(Math.exp((tiEa("ami") - Ea) / RT), 1));
      ro.set(5, I.b < 0.1 || I.e > 0.95 ? "sp² (plan, 120°)" : I.b > 0.98 && I.e < 0.02 ? "sp³ (tétraédrique)" : "en train de changer");
      ro.set(6, S0.bil);
      var msg = "<b>" + S0.n + "</b> (" + S0.f + ", " + fBrute(S0.el) + ", " + F(molM(S0.el), 2) + " g/mol) + HO⁻. ";
      if (key === "cl") msg += "Cl⁻ est une base extrêmement faible (pKa de HCl ≈ −7) : il part aussitôt. Le chlore attire aussi les électrons et rend le carbone très δ+ : c'est le dérivé le plus réactif.";
      else if (key === "anh") msg += "Le partant est l'ion éthanoate, stabilisé par mésomérie (pKa de l'acide éthanoïque 4,8) : bon partant, réaction rapide.";
      else if (key === "est") msg += "Le partant CH₃O⁻ (pKa du méthanol 15,5) vaut à peu près HO⁻ (15,7) : l'étape est équilibrée, mais l'acide formé est aussitôt transformé en ion éthanoate, ce qui rend la saponification totale.";
      else msg += heat ? "À chaud, l'azote de l'intermédiaire est protoné par l'eau : NH₃ (pKa de NH₄⁺ 9,2) part enfin. C'est pour cela qu'hydrolyser un amide demande des heures à reflux." : "NH₂⁻ serait un partant catastrophique (pKa de NH₃ 38) : l'intermédiaire rejette HO⁻ et revient à l'amide. C'est ce qui rend la liaison peptidique si stable.";
      msg += " <i>Modèle : Ea = 50 + 0,8 × pKa(H–X) kJ/mol ; vitesse relative = e<sup>ΔEa/RT</sup> à 25 °C.</i>";
      nt.set(msg, "ok");
    });
  }
});

/* ====================================================================== */
/* 4. NH₃ + CH₃I : polyalkylation des amines                               */
/* ====================================================================== */
var PA_K = [1, 2, 2.5, 1];   /* constantes relatives (modèle) : NH₃, amine I, amine II, amine III face à CH₃I */
var PA_NAME = ["NH₃", "CH₃NH₂", "(CH₃)₂NH", "(CH₃)₃N", "(CH₃)₄N⁺", "CH₃I"];
var PA_COL = ["#5b8def", "#1f9d55", "#d9822b", "#c0392b", "#8e44ad", "#7b3fa0"];
var PA_TOT = 120;
function paInit(R){ var nM = Math.round(PA_TOT / (1 + R)); return {A:PA_TOT - nM, M:nM}; }
/* modèle continu : chaque réaction consomme un CH₃I ; on intègre en fonction de ξ (CH₃I consommé), ce qui élimine [CH₃I] :
   dA₀/dξ = −k₀A₀/Σ, dAₙ/dξ = (kₙ₋₁Aₙ₋₁ − kₙAₙ)/Σ, Σ = Σ kₙAₙ (n = 0 à 3) ; RK4 jusqu'à épuisement du CH₃I ou des amines. y0 = [NH₃, I, II, III, quat., CH₃I] */
function paODEv(y0){
  var cap = 4 * y0[0] + 3 * y0[1] + 2 * y0[2] + y0[3], xiEnd = Math.min(y0[5], cap), N = 2000, h = xiEnd / N, y = y0.slice(0, 5);
  function f(y){ var r = [0, 1, 2, 3].map(function(n){ return PA_K[n] * Math.max(0, y[n]); }), S = r[0] + r[1] + r[2] + r[3]; if (S < 1e-12) return [0, 0, 0, 0, 0]; return [-r[0] / S, (r[0] - r[1]) / S, (r[1] - r[2]) / S, (r[2] - r[3]) / S, r[3] / S]; }
  for (var it = 0; it < N && h > 0; it++){
    var k1 = f(y), y2 = y.map(function(v, i){ return v + h / 2 * k1[i]; }), k2 = f(y2), y3 = y.map(function(v, i){ return v + h / 2 * k2[i]; }), k3 = f(y3), y4 = y.map(function(v, i){ return v + h * k3[i]; }), k4 = f(y4);
    y = y.map(function(v, i){ return v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]); });
  }
  return y.map(function(v){ return Math.max(0, v); }).concat([y0[5] - xiEnd]);
}
function paODE(A0, M0){ return paODEv([A0, 0, 0, 0, 0, M0]); }
/* une molécule dessinée en petit relief : n méthyles sur l'azote (n = 4 : ammonium) ou CH₃I (n = −1) */
function paGlyph(ctx, x, y, s, n, rot, al){
  ctx.save(); ctx.globalAlpha = al == null ? 1 : al;
  if (n === -1){
    var dx = Math.cos(rot) * s * 0.95, dy = Math.sin(rot) * s * 0.5;
    ball(ctx, x - dx * 0.6, y - dy * 0.6, s * 0.55, "#4a5568");
    ball(ctx, x + dx * 0.55, y + dy * 0.55, s * 0.95, "#7b3fa0");
    ctx.restore(); return;
  }
  if (n === -2){ ball(ctx, x, y, s * 0.8, "#9b62bf"); ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.round(s * 1.1) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("−", x, y + 0.5); ctx.restore(); return; }
  /* quatre directions d'un tétraèdre vu de biais (la 4e vers l'arrière = doublet si n < 4) */
  var subs = [];
  for (var q = 0; q < 3; q++){ var an = rot + q * 2 * PI / 3; subs.push({x:Math.cos(an) * s * 1.05, y:Math.sin(an) * s * 0.55 + s * 0.32, z:Math.sin(an)}); }
  subs.push({x:0, y:-s * 1.05, z:0.5});
  var order = subs.map(function(p, i){ return [p, i]; }).sort(function(a, b){ return a[0].z - b[0].z; });
  var drawSub = function(p, i){ var isMe = i < n || (n === 4); if (i === 3 && n < 4) return; ball(ctx, x + p.x, y + p.y, isMe ? s * 0.55 : s * 0.33, isMe ? "#4a5568" : "#e8edf3"); };
  order.forEach(function(o){ if (o[0].z < 0) drawSub(o[0], o[1]); });
  ball(ctx, x, y, s * 0.62, "#2f5fd0");
  order.forEach(function(o){ if (o[0].z >= 0) drawSub(o[0], o[1]); });
  if (n === 4){ ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.round(s * 0.9) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("+", x, y + 0.5); }
  ctx.restore();
}

SFA.sim({
  id:"org-polyalkylation-amines", ch:"L18", tag:"Amines",
  titre:"NH₃ + halogénoalcane : on ne s'arrête pas à l'amine primaire",
  resume:"Un ballon d'ammoniac et d'iodométhane : à chaque collision réussie, un azote attaque CH₃I (SN2) et gagne un méthyle. Mais l'amine formée est elle-même nucléophile, et même plus que NH₃ : elle réagit à son tour. L'histogramme en direct montre le mélange d'amines primaire, secondaire, tertiaire et d'ammonium quaternaire selon le rapport NH₃/CH₃I.",
  but:"Règle le rapport NH₃/CH₃I et lance la réaction : chaque éclair est une substitution. Suis l'histogramme : les barres pleines sont les molécules du ballon, les traits pointillés la fin de réaction prévue par le modèle. Clique dans le ballon pour ajouter 5 CH₃I. Cherche le rapport qui donne surtout l'amine primaire.",
  aRetenir:"L'ammoniac attaque l'iodométhane par SN2 : NH₃ + CH₃I → CH₃NH₃⁺ I⁻, puis une base reprend H⁺ et libère CH₃NH₂. Mais l'azote de l'amine primaire porte encore un doublet, et le méthyle donneur le rend plus nucléophile que NH₃ : CH₃NH₂ réagit à son tour, puis (CH₃)₂NH, (CH₃)₃N, jusqu'à l'ion ammonium quaternaire (CH₃)₄N⁺, qui n'a plus de doublet. On obtient un mélange. Avec un grand excès de NH₃, chaque CH₃I a beaucoup plus de chances de rencontrer NH₃ que l'amine déjà formée : on obtient surtout l'amine primaire. Avec un excès de CH₃I, on va jusqu'au sel quaternaire. Pour préparer proprement une amine primaire, on préfère d'autres voies (réduction d'un nitrile ou d'un amide, amination réductrice).",
  piege:"« Une mole de NH₃ pour une mole de CH₃I » ne donne pas une mole d'amine primaire : à 1 pour 1, une bonne part du CH₃I est consommée par les amines déjà méthylées. Et le dernier produit n'est pas une amine : (CH₃)₄N⁺ I⁻ est un sel, sans doublet libre, qui ne réagit plus. Les constantes de vitesse relatives (1 ; 2 ; 2,5 ; 1) sont celles d'un modèle ; une base (par exemple K₂CO₃) est supposée reprendre chaque H⁺ formé.",
  build:function(k, S){
    var c = respCanvas(k, 0.82, 1.42);
    var st = {t:0, run:true, parts:[], flashes:[], rnd:lhSeed(4242), A0:60, M0:60, added:0, done:false};
    var kR = k.slider("Rapport NH₃ / CH₃I au départ", 0.25, 10, 0.25, 1, "", function(){ reset(); });
    k.button("Recommencer", function(){ reset(); }, true);
    var kSp = k.seg("Vitesse", [["1", "normale"], ["4", "× 4"]], "1");
    var kM = k.toggle("Montrer la fin prévue par le modèle", true);
    var kAuto = k.toggle("Recommencer seul à la fin", true);
    var ro = k.readouts(["Au départ", "CH₃I restant", "Amine primaire (CH₃NH₂)", "Amine primaire en fin de réaction (modèle)", "Ions (CH₃)₄N⁺", "Rendement en CH₃NH₂ (sur CH₃I)"]);
    var nt = k.note("", "ok");
    var ode = null, geo = null;
    function newPart(n){ var r = st.rnd, a = r() * 2 * PI, rr0 = Math.sqrt(r()) * 0.86; return {x:Math.cos(a) * rr0, y:Math.sin(a) * rr0, vx:(r() - 0.5) * 0.3, vy:(r() - 0.5) * 0.3, n:n, rot:r() * 6.28, w:(r() - 0.5) * 2, z:r()}; }
    function reset(){
      var I0 = paInit(kR.value); st.A0 = I0.A; st.M0 = I0.M; st.added = 0; st.parts = []; st.flashes = []; st.done = false; st.t = 0;
      for (var i = 0; i < I0.A; i++) st.parts.push(newPart(0));
      for (i = 0; i < I0.M; i++) st.parts.push(newPart(-1));
      ode = paODE(st.A0, st.M0);
    }
    reset();
    function counts(){ var cn = [0, 0, 0, 0, 0, 0, 0]; st.parts.forEach(function(p){ if (p.n >= 0) cn[p.n]++; else if (p.n === -1) cn[5]++; else cn[6]++; }); return cn; }
    /* clic dans le ballon : 5 CH₃I de plus */
    c.pointer(function(type, p){
      if (type !== "down" || !geo) return;
      if (Math.hypot(p.x - geo.fx, p.y - geo.fy) < geo.R){
        for (var i = 0; i < 5; i++){ var q = newPart(-1); q.x = (p.x - geo.fx) / geo.R * 0.8 + (st.rnd() - 0.5) * 0.1; q.y = (p.y - geo.fy) / geo.R * 0.8 + (st.rnd() - 0.5) * 0.1; st.parts.push(q); }
        st.added += 5; st.done = false; st.drop = 1;
        var cn = counts(); ode = paODEv(cn.slice(0, 6)); k.redraw();
      }
    });
    var lp = k.loop(function(dt){
      st.t += dt; if (st.drop) st.drop = Math.max(0, st.drop - dt * 2);
      var r = st.rnd, sp = +kSp.value;
      st.parts.forEach(function(p){
        p.vx += (r() - 0.5) * dt * 1.6; p.vy += (r() - 0.5) * dt * 1.6; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx * dt; p.y += p.vy * dt + Math.sin(st.t * 1.3 + p.z * 6) * dt * 0.02; p.rot += p.w * dt;
        var d = Math.hypot(p.x, p.y + 0.05); if (d > 0.86){ p.x *= 0.86 / d; p.y = (p.y + 0.05) * 0.86 / d - 0.05; p.vx = -p.vx * 0.6; p.vy = -p.vy * 0.6; }
      });
      /* tirage des réactions (algorithme de Gillespie, temps du modèle) */
      var cn = counts(), kc = 0.14 / PA_TOT, budget = dt * sp;
      while (budget > 0){
        var rates = [0, 1, 2, 3].map(function(n){ return kc * PA_K[n] * cn[n] * cn[5]; }), tot = rates[0] + rates[1] + rates[2] + rates[3];
        if (tot <= 0){ if (!st.done) st.doneT = st.t; st.done = true; break; }
        var tau = -Math.log(1 - r()) / tot; if (tau > budget) break; budget -= tau;
        var u = r() * tot, n = 0; while (n < 3 && u > rates[n]){ u -= rates[n]; n++; }
        var cand = st.parts.filter(function(p){ return p.n === n; }), am = cand[Math.floor(r() * cand.length)];
        var mis = st.parts.filter(function(p){ return p.n === -1; }), best = mis[0], bd = 9;
        mis.forEach(function(m){ var dd = Math.hypot(m.x - am.x, m.y - am.y); if (dd < bd){ bd = dd; best = m; } });
        am.n = n + 1; best.n = -2; best.x = am.x + (best.x - am.x) * 0.5 + 0.04; best.y = am.y + (best.y - am.y) * 0.5;
        st.flashes.push({x:am.x, y:am.y, t:0, col:PA_COL[n + 1]});
        cn[n]--; cn[n + 1]++; cn[5]--; cn[6]++;
      }
      if (st.done && kAuto.value && st.t - st.doneT > 5) reset();
      st.flashes.forEach(function(f){ f.t += dt; }); st.flashes = st.flashes.filter(function(f){ return f.t < 0.6; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t;
      c.clear();
      var benchY = ph ? H * 0.56 : H * 0.9;
      benchBg(ctx, W, ph ? benchY + 12 : H, benchY);
      if (ph){ ctx.fillStyle = "#f6f8fb"; ctx.fillRect(0, benchY + 12, W, H - benchY - 12); }
      /* ballon : grand, centré à gauche (bureau) ou en haut (téléphone) */
      var R = Math.min(ph ? W * 0.36 : W * 0.24, (benchY - 8) / 3.3);
      var fx = ph ? W * 0.5 : W * 0.27, fy = benchY - R * 1.08;
      geo = {fx:fx, fy:fy, R:R};
      /* support + agitateur magnétique */
      var gs = ctx.createLinearGradient(0, benchY - 16, 0, benchY); gs.addColorStop(0, "#e3e7ee"); gs.addColorStop(1, "#8d97a6");
      ctx.fillStyle = gs; rr(ctx, fx - R * 0.9, benchY - 14, R * 1.8, 14, 4); ctx.fill();
      ctx.fillStyle = "#2c3440"; ctx.fillRect(fx - R * 0.5, benchY - 4, R, 4);
      /* ampoule de coulée (CH₃I) au-dessus du col */
      var aw = R * 0.3, ax0 = fx, ay0 = fy - R * 1.52 - aw * 1.05;
      ctx.save();
      var ga = ctx.createLinearGradient(ax0 - aw, 0, ax0 + aw, 0); ga.addColorStop(0, "rgba(160,185,210,.55)"); ga.addColorStop(0.4, "rgba(255,255,255,.8)"); ga.addColorStop(1, "rgba(140,165,195,.55)");
      ctx.fillStyle = ga; ctx.beginPath(); ctx.moveTo(ax0 - aw * 0.25, ay0 - aw * 1.1); ctx.lineTo(ax0 + aw * 0.25, ay0 - aw * 1.1); ctx.quadraticCurveTo(ax0 + aw, ay0 - aw * 0.4, ax0 + aw * 0.6, ay0 + aw * 0.4); ctx.lineTo(ax0 + aw * 0.1, ay0 + aw * 0.9); ctx.lineTo(ax0 - aw * 0.1, ay0 + aw * 0.9); ctx.lineTo(ax0 - aw * 0.6, ay0 + aw * 0.4); ctx.quadraticCurveTo(ax0 - aw, ay0 - aw * 0.4, ax0 - aw * 0.25, ay0 - aw * 1.1); ctx.fill();
      ctx.strokeStyle = "rgba(90,110,135,.7)"; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.fillStyle = "rgba(196,170,220,.75)"; ctx.beginPath(); ctx.moveTo(ax0 - aw * 0.75, ay0 + aw * 0.1); ctx.lineTo(ax0 + aw * 0.75, ay0 + aw * 0.1); ctx.lineTo(ax0 + aw * 0.1, ay0 + aw * 0.85); ctx.lineTo(ax0 - aw * 0.1, ay0 + aw * 0.85); ctx.fill();
      ctx.fillStyle = "#3c4656"; ctx.fillRect(ax0 - aw * 0.4, ay0 + aw * 0.95, aw * 0.8, aw * 0.18);
      ctx.restore();
      if (st.drop > 0){ ball(ctx, ax0, lerp(ay0 + aw * 1.2, fy - R * 0.6, 1 - st.drop), 4, "#b58ad6"); }
      label(ctx, "CH₃I", ax0 + aw + 8, ay0 - aw * 0.3, {size:ph ? 10.5 : 12, align:"left", col:"#5b2c86", bg:"rgba(255,255,255,.85)"});
      flask(ctx, fx, fy, R, {liq:"#e6e1f0", level:0.92, t:t, neckH:0.6});
      /* contenu du ballon (vue « loupe » : molécules en grand) */
      ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, R * 0.97, 0, 7); ctx.clip();
      var sP = Math.max(4.2, R * 0.052);
      st.parts.slice().sort(function(a, b){ return a.z - b.z; }).forEach(function(p){
        var x = fx + p.x * R, y = fy + p.y * R, s = sP * (0.82 + 0.3 * p.z);
        paGlyph(ctx, x, y, s, p.n >= 0 ? p.n : p.n, p.rot, p.n === -2 ? 0.75 : 1);
      });
      st.flashes.forEach(function(f){
        var x = fx + f.x * R, y = fy + f.y * R, rad = sP * (1.4 + 5 * f.t), a = 1 - f.t / 0.6;
        ctx.save(); ctx.strokeStyle = f.col; ctx.globalAlpha = a; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.stroke(); ctx.restore();
      });
      ctx.restore();
      /* reflet du verre par-dessus */
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, R * 0.86, PI * 1.08, PI * 1.38); ctx.stroke(); ctx.restore();
      if (!ph) label(ctx, "clique dans le ballon : +5 CH₃I", fx, benchY + (H - benchY) / 2, {size:11, col:"#ffffff", weight:600});
      else label(ctx, "touche le ballon : +5 CH₃I", W / 2, benchY + 6, {size:10, col:"#ffffff", weight:600});
      /* légende des molécules (petits modèles) */
      var cn = counts();
      /* histogramme */
      var hb = ph ? {x:30, y:benchY + 44, w:W - 40, h:H - benchY - 92} : {x:W * 0.585, y:H * 0.12, w:W * 0.4, h:H * 0.58};
      ctx.save(); rr(ctx, hb.x - (ph ? 22 : 30), hb.y - 26, hb.w + (ph ? 30 : 40), hb.h + (ph ? 74 : 82), 12); ctx.fillStyle = "rgba(255,255,255,.93)"; ctx.fill(); ctx.strokeStyle = "rgba(120,140,165,.4)"; ctx.stroke(); ctx.restore();
      label(ctx, ph ? "Molécules dans le ballon" : "Dans le ballon", hb.x - (ph ? 12 : 18), hb.y - 12, {size:ph ? 11 : 12, align:"left", col:"#13233a", weight:800});
      var vmax = 1.12 * Math.max(10, st.A0, st.M0 + st.added), bars = [0, 1, 2, 3, 4, 5], bw = hb.w / 6;
      ctx.save(); ctx.strokeStyle = "#c9d2de"; ctx.beginPath(); ctx.moveTo(hb.x, hb.y); ctx.lineTo(hb.x, hb.y + hb.h); ctx.lineTo(hb.x + hb.w, hb.y + hb.h); ctx.stroke(); ctx.restore();
      bars.forEach(function(i){
        var v = cn[i], x = hb.x + i * bw + bw * 0.16, w = bw * 0.68, h = hb.h * v / vmax, y = hb.y + hb.h - h;
        var g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, shade(PA_COL[i], 0.25)); g.addColorStop(0.5, PA_COL[i]); g.addColorStop(1, shade(PA_COL[i], -0.3));
        ctx.fillStyle = g; rr(ctx, x, y, w, Math.max(0.5, h), 3); ctx.fill();
        label(ctx, String(v), x + w / 2, y - 8, {size:ph ? 10 : 11, col:"#13233a", weight:800});
        if (kM.value && ode){
          var fv = ode[i], yf = hb.y + hb.h - hb.h * fv / vmax;
          ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = shade(PA_COL[i], -0.45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 3, yf); ctx.lineTo(x + w + 3, yf); ctx.stroke(); ctx.restore();
        }
        paGlyph(ctx, x + w / 2, hb.y + hb.h + (ph ? 13 : 15), ph ? 4.2 : 5, i === 5 ? -1 : i, 0.6, 1);
        label(ctx, PA_NAME[i], x + w / 2, hb.y + hb.h + (ph ? 31 : 33 + (i % 2) * 14), {size:ph ? 9 : 10, col:PA_COL[i] === "#7b3fa0" ? "#5b2c86" : shade(PA_COL[i], -0.25), weight:800, maxW:bw + 4});
      });
      if (ph){ var cls = ["", "I", "II", "III"]; [1, 2, 3].forEach(function(i){ label(ctx, cls[i], hb.x + i * bw + bw / 2, hb.y + hb.h + 44, {size:8.5, col:"#7b8694", weight:700}); }); label(ctx, "quat.", hb.x + 4 * bw + bw / 2, hb.y + hb.h + 44, {size:8.5, col:"#7b8694", weight:700}); }
      if (kM.value) label(ctx, ph ? "- - fin prévue (modèle)" : "- - fin (modèle)", hb.x + hb.w, hb.y - 12, {size:ph ? 9 : 10, align:"right", col:"#7b8694", weight:600});
      /* afficheurs */
      var Mtot = st.M0 + st.added;
      ro.set(0, st.A0 + " NH₃ / " + st.M0 + " CH₃I");
      ro.set(1, cn[5] + (st.done || cn[5] === 0 ? " (fini)" : ""));
      ro.set(2, String(cn[1]));
      ro.set(3, ode ? F(ode[1], 1) + " molécules" : "—");
      ro.set(4, String(cn[4]));
      ro.set(5, F(Mtot ? cn[1] / Mtot * 100 : 0, 0) + " %");
      var R0 = kR.value, msg = "Rapport NH₃/CH₃I = " + F(R0, 2) + " (" + st.A0 + " NH₃ pour " + st.M0 + " CH₃I). ";
      if (R0 >= 6) msg += "Grand excès d'ammoniac : chaque CH₃I rencontre surtout NH₃, l'amine primaire domine nettement.";
      else if (R0 >= 1.5) msg += "Excès modéré : l'amine primaire est majoritaire, mais une part non négligeable continue vers la secondaire et au-delà.";
      else if (R0 >= 0.4) msg += "Proportions voisines : les amines formées, plus nucléophiles que NH₃, captent une bonne part du CH₃I. On obtient un vrai mélange.";
      else msg += "Excès de CH₃I : la méthylation continue jusqu'au sel d'ammonium quaternaire (CH₃)₄N⁺ I⁻.";
      if (st.added) msg += " Tu as ajouté " + st.added + " CH₃I ; le modèle repart des quantités présentes au moment de l'ajout.";
      nt.set(msg + " <i>Modèle : vitesse = k·[amine]·[CH₃I], k relatifs 1 ; 2 ; 2,5 ; 1 (NH₃, I, II, III) ; tirage aléatoire réaction par réaction.</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 5. Chimiosélectivité : NaBH₄ ou LiAlH₄ sur le 4-oxopentanoate d'éthyle   */
/* ====================================================================== */
var CR_RED = {
  nabh4:{n:"NaBH₄", lab:"NaBH₄", sub:"dans l'éthanol", el:{Na:1, B:1, H:4}, nH:1, prod:"4-hydroxypentanoate d'éthyle", pel:{C:7, H:14, O:3}, side:null},
  lialh4:{n:"LiAlH₄", lab:"LiAlH₄", sub:"éther anhydre", el:{Li:1, Al:1, H:4}, nH:3, prod:"pentane-1,4-diol", pel:{C:5, H:12, O:2}, side:{n:"éthanol", el:{C:2, H:6, O:1}}}
};
var CR_SUB = {C:7, H:12, O:3};
/* squelette fixe : C5 (méthyle), C4 (cétone), C3, C2, C1 (ester), O (ester), Cα, Cβ — zigzag dans le plan xy */
var CR_BASE = (function(){
  var P = [], i;
  for (i = 0; i < 8; i++) P.push([i * 1.27 - 4.45, (i % 2 ? 0.74 : 0) - 0.37, 0]);
  return P;
})();
/* rotation minimale qui envoie a sur b (vecteurs unitaires) */
function crAlign(a, b, v){ var ax = cross(a, b), s = len(ax), cth = clamp(dot(a, b), -1, 1); if (s < 1e-6) return v; return rotAx(v, ax, Math.atan2(s, cth)); }
var CR_PH = {
  nabh4:{k:[0.06, 0.28], kp:[0.62, 0.78], e1:null},
  lialh4:{k:[0.05, 0.22], e1:[0.25, 0.4], e2:[0.42, 0.54], e3:[0.56, 0.68], kp:[0.72, 0.86]}
};
function crGeom(red, s){
  var P = CR_BASE, ph = CR_PH[red], atoms = [], bonds = [], info = {}, Z = [0, 0, 1];
  function A(el, p, o){ atoms.push(At(el, p, o)); return atoms.length - 1; }
  var k1 = ease(seg01(s, ph.k[0], ph.k[1])), pp = ease(seg01(s, ph.kp[0], ph.kp[1]));
  var e1 = ph.e1 ? ease(seg01(s, ph.e1[0], ph.e1[1])) : 0, e2 = ph.e2 ? ease(seg01(s, ph.e2[0], ph.e2[1])) : 0, e3 = ph.e3 ? ease(seg01(s, ph.e3[0], ph.e3[1])) : 0;
  var iC = [0, 1, 2, 3, 4].map(function(j){ return A("C", P[j]); });   /* C5, C4, C3, C2, C1 */
  bonds.push({a:iC[0], b:iC[1], o:1}); bonds.push({a:iC[1], b:iC[2], o:1}); bonds.push({a:iC[2], b:iC[3], o:1}); bonds.push({a:iC[3], b:iC[4], o:1});
  function u(a, b){ return nrm(sub(P[b], P[a])); }
  /* H des carbones sp³ fixes (C5, C3, C2) */
  tetra3(u(0, 1), Z, 0.5).forEach(function(d){ bonds.push({a:iC[0], b:A("H", add(P[0], mul(d, 1.09))), o:1}); });
  [2, 3].forEach(function(j){ sp3pair(u(j, j - 1), u(j, j + 1), Z).forEach(function(d){ bonds.push({a:iC[j], b:A("H", add(P[j], mul(d, 1.09))), o:1}); }); });
  /* ---- C4 : cétone → alcool secondaire ---- */
  var u5 = u(1, 0), u3 = u(1, 2), bis = nrm(mul(add(u5, u3), -1)), pr4 = sp3pair(u5, u3, Z), dHk = pr4[0], dOk = slerpD(bis, pr4[1], k1);
  var pOk = add(P[1], mul(dOk, lerp(1.22, 1.43, k1)));
  var iOk = A("O", pOk, {lab:"O"});
  bonds.push({a:iC[1], b:iOk, o:k1 < 0.5 ? 2 : 1});
  var hkFar = add(P[1], mul(dHk, 4.2)), hkPos = lerp3(hkFar, add(P[1], mul(dHk, 1.09)), k1);
  var iHk = A("H", hkPos, {alpha:s > ph.k[0] - 0.04 ? 1 : 0, glow:k1 > 0 && k1 < 0.98 ? "rgba(42,111,219,.55)" : null});
  bonds.push({a:iC[1], b:iHk, o:1, alpha:k1, dash:k1 < 0.98});
  if (k1 > 0.02 && k1 < 0.6){ atoms[iHk].badge = "−"; atoms[iHk].badgeCol = "#1d4fae"; atoms[iHk].badgeA = 1 - k1 / 0.6; }
  if (k1 > 0.5 && pp < 0.5){ atoms[iOk].badge = "−"; atoms[iOk].badgeCol = "#c0392b"; }
  var dOHk = nrm(rotAx(dOk, cross(dOk, Z), 1.2));
  var hOk = A("H", lerp3(add(pOk, mul(dOHk, 3.5)), add(pOk, mul(dOHk, 0.96)), pp), {alpha:pp > 0.01 ? 1 : 0, glow:pp > 0.02 && pp < 0.98 ? "rgba(214,57,47,.4)" : null});
  bonds.push({a:iOk, b:hOk, o:1, alpha:pp, dash:pp < 0.98});
  /* ---- C1 : ester (→ aldéhyde → alcool primaire avec LiAlH₄) ---- */
  var dC2b = u(4, 3), dOeb = u(4, 5), dOcb = nrm(mul(add(dC2b, dOeb), -1));
  var D = {C2:dC2b, Oc:dOcb, Oe:dOeb, Ha:Z, Hb:mul(Z, -1)};
  var tet1 = function(d, e){ return nrm(add(mul(d, lerp(1, Math.sqrt(8) / 3, e)), mul(Z, -e / 3))); };
  ["C2", "Oc", "Oe"].forEach(function(kk){ D[kk] = tet1(D[kk], e1); });
  var uL = tet1(dOeb, 1);
  if (e2 > 0) ["C2", "Oc", "Ha"].forEach(function(kk){ var d = kk === "Ha" ? Z : D[kk], pj = nrm(sub(d, mul(uL, dot(d, uL)))); D[kk] = nrm(lerp3(d, pj, e2)); });
  var Hb0 = mul(uL, -1);
  if (e3 > 0) ["C2", "Oc", "Ha"].forEach(function(kk){ D[kk] = nrm(add(mul(D[kk], lerp(1, Math.sqrt(8) / 3, e3)), mul(uL, e3 / 3))); });
  /* on garde C1–C2 fixe : tout le reste tourne pour que D.C2 revienne sur la direction de départ */
  var fix = function(d){ return crAlign(D.C2, dC2b, d); };
  var dOc = fix(D.Oc), dOe = e2 > 0 ? fix(uL) : fix(D.Oe), dHa = fix(D.Ha), dHb = fix(Hb0);
  var lOc = e3 > 0 ? lerp(1.22, 1.43, e3) : e2 > 0 ? lerp(1.40, 1.21, e2) : lerp(1.21, 1.40, e1);
  var pOc = add(P[4], mul(dOc, lOc)), iOc = A("O", pOc, {lab:"O"});
  var oC = (e1 < 0.5) ? 2 : (e2 > 0.5 && e3 < 0.5) ? 2 : 1;
  bonds.push({a:iC[4], b:iOc, o:oC});
  if ((e1 > 0.5 && e2 < 0.5) || (e3 > 0.5 && pp < 0.5)){ atoms[iOc].badge = "−"; atoms[iOc].badgeCol = "#c0392b"; }
  /* groupe éthoxy (rigide), qui part avec LiAlH₄ */
  var lv = 2.0 * e2, pOe = add(P[4], mul(dOe, 1.34 + lv)), rotE = function(p){ return add(add(P[4], crAlign(dOeb, dOe, sub(p, P[4]))), mul(dOe, lv)); };
  var iOe = A("O", pOe, {lab:"O"}), iCa = A("C", rotE(P[6])), iCb = A("C", rotE(P[7]));
  bonds.push({a:iC[4], b:iOe, o:1, alpha:1 - e2, dash:e2 > 0.05}); bonds.push({a:iOe, b:iCa, o:1}); bonds.push({a:iCa, b:iCb, o:1});
  sp3pair(u(6, 5), u(6, 7), Z).forEach(function(d){ bonds.push({a:iCa, b:A("H", rotE(add(P[6], mul(d, 1.09)))), o:1}); });
  tetra3(u(7, 6), Z, 0.3).forEach(function(d){ bonds.push({a:iCb, b:A("H", rotE(add(P[7], mul(d, 1.09)))), o:1}); });
  if (e2 > 0.4 && pp < 0.5){ atoms[iOe].badge = "−"; atoms[iOe].badgeCol = "#c0392b"; }
  /* hydrures sur C1 */
  var iHa = -1, iHb = -1;
  if (ph.e1){
    iHa = A("H", lerp3(add(P[4], mul(dHa, 4.2)), add(P[4], mul(dHa, 1.10)), e1), {alpha:s > ph.e1[0] - 0.04 ? 1 : 0, glow:e1 > 0 && e1 < 0.98 ? "rgba(42,111,219,.55)" : null});
    bonds.push({a:iC[4], b:iHa, o:1, alpha:e1, dash:e1 < 0.98});
    iHb = A("H", lerp3(add(P[4], mul(dHb, 4.2)), add(P[4], mul(dHb, 1.10)), e3), {alpha:s > ph.e3[0] - 0.04 ? 1 : 0, glow:e3 > 0 && e3 < 0.98 ? "rgba(42,111,219,.55)" : null});
    bonds.push({a:iC[4], b:iHb, o:1, alpha:e3, dash:e3 < 0.98});
    /* hydrolyse : H sur l'O⁻ de C1 et sur l'éthanolate */
    [[iOc, pOc, dOc], [iOe, pOe, dOe]].forEach(function(q){
      var dH = nrm(rotAx(q[2], cross(q[2], Z), 1.2)), h = A("H", lerp3(add(q[1], mul(dH, 3.5)), add(q[1], mul(dH, 0.96)), pp), {alpha:pp > 0.01 ? 1 : 0, glow:pp > 0.02 && pp < 0.98 ? "rgba(214,57,47,.4)" : null});
      bonds.push({a:q[0], b:h, o:1, alpha:pp, dash:pp < 0.98});
    });
  }
  info = {iC4:iC[1], iC1:iC[4], iOk:iOk, iOc:iOc, iOe:iOe, iHk:iHk, iHa:iHa, iHb:iHb, k1:k1, e1:e1, e2:e2, e3:e3, pp:pp};
  return {atoms:atoms, bonds:bonds, info:info};
}

SFA.sim({
  id:"org-chimioselectivite-reducteurs", ch:"c10", tag:"Oxydoréduction en organique",
  titre:"Réduire l'une sans réduire l'autre : NaBH₄ ou LiAlH₄",
  resume:"Le 4-oxopentanoate d'éthyle porte deux fonctions : une cétone et un ester. En 3D, choisis le réducteur : avec NaBH₄, seul le C=O de la cétone reçoit un hydrure et devient un alcool ; avec LiAlH₄, l'ester est réduit aussi, perd son groupe éthoxy et donne le pentane-1,4-diol.",
  but:"Choisis le réducteur et suis les hydrures H⁻ (boules bleues) : sur quel carbone arrivent-ils ? Touche la cétone ou l'ester pour savoir pourquoi ils réagissent différemment. Règle la masse de substrat pour calculer la quantité de réducteur nécessaire et la masse de produit attendue. Glisse ailleurs pour tourner la molécule.",
  aRetenir:"NaBH₄ est un donneur d'hydrure doux : il réduit les aldéhydes et les cétones en alcools, mais pas les esters, dont le carbone est moins électrophile (le doublet de l'oxygène de –OR se délocalise vers le C=O). LiAlH₄, beaucoup plus réactif, réduit aussi les esters : un 1er H⁻ s'additionne, l'éthanolate part (on passe par un aldéhyde), un 2e H⁻ s'additionne, et l'hydrolyse donne un alcool primaire plus l'éthanol. Bilan : la cétone consomme 1 H⁻, l'ester 2 H⁻. Choisir un réactif qui transforme une fonction sans toucher l'autre, c'est la chimiosélectivité.",
  piege:"LiAlH₄ ne laisse rien : il réduit la cétone ET l'ester ; si tu veux garder l'ester, il faut NaBH₄. Et l'ester réduit ne donne pas un alcool secondaire : le carbone de l'ester porte déjà un O, il finit en CH₂OH (alcool primaire) et l'éthoxy part sous forme d'éthanol. Dans la réalité, le 4-hydroxypentanoate d'éthyle se cyclise facilement en lactone (γ-valérolactone) ; on ne le montre pas ici. LiAlH₄ réagit violemment avec l'eau : on travaille dans l'éther anhydre et on hydrolyse à la fin.",
  build:function(k, S){
    var c = respCanvas(k, 0.84, 1.05);
    var st = {a:0.25, b:0.55, s:0, t:0, auto:true, info:null, infoT:0};
    var kRed = k.seg("Réducteur", [["nabh4", "NaBH₄ (doux)"], ["lialh4", "LiAlH₄ (fort)"]], "nabh4", function(){ st.s = 0; });
    var kM = k.slider("Masse de 4-oxopentanoate d'éthyle", 0.5, 5, 0.01, 1.44, "g");
    var kAuto = k.toggle("Animation en boucle", true, function(v){ st.auto = v; });
    var kStep = k.slider("Étape (animation arrêtée)", 0, 100, 1, 0, "%", function(v){ st.auto = false; kAuto.set(false); st.s = v / 100; });
    var ro = k.readouts(["Fonctions réduites", "H⁻ consommés par molécule", "Quantité de substrat", "Réducteur nécessaire (théorique)", "Produit", "Masse de produit attendue (100 %)"]);
    var nt = k.note("", "ok");
    var lastPr = null, lastG = null;
    viewCtl(c, st, {tap:function(p){
      if (!lastPr) return;
      var best = null, bd = 34;
      [["k", lastG.info.iC4], ["k", lastG.info.iOk], ["e", lastG.info.iC1], ["e", lastG.info.iOc], ["e", lastG.info.iOe]].forEach(function(q){ var P = lastPr[q[1]], d = Math.hypot(P.x - p.x, P.y - p.y); if (d < bd){ bd = d; best = q[0]; } });
      st.info = best; st.infoT = best ? 6 : 0; k.redraw();
    }});
    st.onview = function(){ k.redraw(); };
    var lp = k.loop(function(dt){
      st.t += dt; if (st.infoT > 0){ st.infoT -= dt; if (st.infoT <= 0) st.info = null; }
      if (st.auto){ st.s += dt / (kRed.value === "nabh4" ? 9 : 13); if (st.s >= 1) st.s = 0; kStep.set(Math.round(st.s * 100)); if (!st.drag) st.a += dt * 0.1 * Math.cos(st.t * 0.2); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, red = kRed.value, R0 = CR_RED[red], t = st.t;
      c.clear();
      var benchY = H * (ph ? 0.92 : 0.88);
      benchBg(ctx, W, H, benchY);
      var box = ph ? {x:8, y:8, w:W - 16, h:benchY - 16} : {x:W * 0.25, y:10, w:W * 0.75 - 10, h:benchY - 20};
      var fR = Math.min(W * 0.055, H * 0.07), fx = fR * 1.6 + 6, fy = benchY - fR * 1.05;
      if (!ph){
        ctx.save(); ctx.fillStyle = "rgba(15,27,45,.25)"; ctx.beginPath(); ctx.ellipse(fx, benchY, fR * 0.9, fR * 0.16, 0, 0, 7); ctx.fill(); ctx.restore();
        flask(ctx, fx, fy, fR, {liq:red === "lialh4" ? "#e9edf2" : "#eef3e6", level:0.5, t:t, bath:red === "lialh4"});
        var bw = Math.max(24, Math.min(42, box.x - fx - fR * 1.5 - 8));
        bottle(ctx, box.x - bw * 0.62 - 4, benchY + 2, bw, bw * 2.1, R0.lab, red === "lialh4" ? "réagit avec l'eau" : "réducteur", red === "lialh4" ? ["flamme", "!"] : ["!"]);
        loupe(ctx, box, [fx, fy], "#2a6fdb");
      } else {
        label(ctx, R0.n + " " + R0.sub + (red === "lialh4" ? ", bain de glace (0 °C), puis hydrolyse" : ", 25 °C"), W / 2, benchY + (H - benchY) / 2 + 2, {size:10.5, col:"#ffffff"});
      }
      loupeFrame(ctx, box, "#ffffff", "#e9eef6");
      clipBox(ctx, box);
      var G = crGeom(red, st.s), I = G.info;
      /* cadrage stable */
      var bb = {x0:1e9, x1:-1e9, y0:1e9, y1:-1e9};
      [0.5, 0.95].forEach(function(s0){ crGeom(red, s0).atoms.forEach(function(at){ if (at.alpha < 0.05) return; var P = proj3(at.p, st, 1, 0, 0), r = at.r * 0.8 * P.s; bb.x0 = Math.min(bb.x0, P.x - r); bb.x1 = Math.max(bb.x1, P.x + r); bb.y0 = Math.min(bb.y0, P.y - r); bb.y1 = Math.max(bb.y1, P.y + r); }); });
      var top = ph ? 72 : 70, availH = box.h - top - 26;
      var scT = Math.min((box.w - 30) / (bb.x1 - bb.x0), availH / (bb.y1 - bb.y0), box.w / 6);
      st.fs = st.fs ? lerp(st.fs, scT, 0.12) : scT;
      st.fx = st.fx != null ? lerp(st.fx, (bb.x0 + bb.x1) / 2, 0.12) : (bb.x0 + bb.x1) / 2;
      st.fy = st.fy != null ? lerp(st.fy, (bb.y0 + bb.y1) / 2, 0.12) : (bb.y0 + bb.y1) / 2;
      var sc = st.fs, V = {st:st, sc:sc, cx:box.x + box.w / 2 - st.fx * sc, cy:box.y + top + availH / 2 - st.fy * sc};
      /* les deux fonctions s'allument */
      var keto = st.s < 0.05 || st.info === "k", est = st.s < 0.05 || st.info === "e";
      var pulse = 0.5 + 0.3 * Math.sin(t * 5);
      if (keto && I.k1 < 0.5){ G.atoms[I.iC4].glow = "rgba(240,140,30," + pulse + ")"; G.atoms[I.iOk].glow = "rgba(240,140,30," + pulse * 0.8 + ")"; }
      if (est && I.e1 < 0.5){ G.atoms[I.iC1].glow = "rgba(42,111,219," + pulse * 0.8 + ")"; G.atoms[I.iOc].glow = "rgba(42,111,219," + pulse * 0.6 + ")"; G.atoms[I.iOe].glow = "rgba(42,111,219," + pulse * 0.6 + ")"; }
      if (red === "nabh4" && st.s > 0.32 && st.s < 0.58){ var w = Math.sin(PI * seg01(st.s, 0.32, 0.58)); G.atoms[I.iC1].glow = "rgba(120,130,145," + 0.5 * w + ")"; }
      var pr = drawScene(c, V, G.atoms, G.bonds, []);
      lastPr = pr; lastG = G;
      /* flèches courbes (H⁻ → C) */
      function arrow(iH, iCc, a){ if (iH < 0 || !(a > 0.03)) return; var p = pr[iH], q = pr[iCc], tr = trim(p, q, p.r + 3, q.r + 4); curly(ctx, tr[0], tr[1], tr[2], tr[3], 20, "#1d4fae", a); }
      var P0 = CR_PH[red];
      arrow(I.iHk, I.iC4, seg01(st.s, P0.k[0] + 0.02, P0.k[0] + 0.08) * (1 - seg01(st.s, P0.k[1] - 0.06, P0.k[1])));
      if (P0.e1){ arrow(I.iHa, I.iC1, seg01(st.s, P0.e1[0] + 0.02, P0.e1[0] + 0.06) * (1 - seg01(st.s, P0.e1[1] - 0.05, P0.e1[1]))); arrow(I.iHb, I.iC1, seg01(st.s, P0.e3[0] + 0.02, P0.e3[0] + 0.06) * (1 - seg01(st.s, P0.e3[1] - 0.05, P0.e3[1]))); }
      /* étiquettes des fonctions */
      function tag(iA, txt, col, iCc){ var p = pr[iA], q = pr[iCc], dx = p.x - q.x, dy = p.y - q.y, L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L; label(ctx, txt, clamp(p.x + dx * (p.r + 30), box.x + 64, box.x + box.w - 64), clamp(p.y + dy * (p.r + 16), box.y + top - 10, box.y + box.h - 34), {size:ph ? 10.5 : 11.5, col:"#ffffff", bg:col}); }
      tag(I.iOk, I.k1 > 0.5 ? (I.pp > 0.5 ? "alcool secondaire" : "alcoolate") : "cétone", "#c26a10", I.iC4);
      if (red === "nabh4") tag(I.iOc, "ester (intact)", "#2a6fdb", I.iC1);
      else tag(I.iOc, I.e1 < 0.5 ? "ester" : I.e2 < 0.5 ? "intermédiaire" : I.e3 < 0.5 ? "aldéhyde" : I.pp > 0.5 ? "alcool primaire" : "alcoolate", "#2a6fdb", I.iC1);
      if (red === "lialh4" && I.e2 > 0.5){ var pE = pr[I.iOe]; label(ctx, I.pp > 0.5 ? "éthanol" : "éthanolate", clamp(pE.x, box.x + 50, box.x + box.w - 50), clamp(pE.y - pE.r - 14, box.y + top, box.y + box.h - 34), {size:ph ? 10 : 11, col:"#5f6b7a", bg:"rgba(255,255,255,.9)"}); }
      var sP = st.s, phase;
      if (red === "nabh4") phase = sP < P0.k[0] ? "Deux C=O : lequel " + R0.n + " va-t-il réduire ?" : sP < P0.k[1] ? "H⁻ s'additionne sur le carbone de la cétone" : sP < 0.6 ? "L'ester ne réagit pas avec NaBH₄" : sP < P0.kp[1] ? "Le solvant protone l'alcoolate" : "Produit : " + R0.prod;
      else phase = sP < P0.k[0] ? "Deux C=O : lequel " + R0.n + " va-t-il réduire ?" : sP < P0.k[1] ? "1er H⁻ : la cétone est réduite" : sP < P0.e1[1] ? "2e H⁻ : il s'additionne aussi sur l'ester" : sP < P0.e2[1] ? "L'éthanolate part : il reste un aldéhyde" : sP < P0.e3[1] ? "3e H⁻ : l'aldéhyde est réduit à son tour" : sP < P0.kp[1] ? "Hydrolyse : les O⁻ prennent un H⁺" : "Produits : " + R0.prod + " + éthanol";
      wrapLabel(ctx, phase, box.x + 12, box.y + 18, box.w - 24, {size:ph ? 11.5 : 13, align:"left", col:"#13233a", bg:"rgba(255,255,255,.92)"});
      if (st.info){
        var txt = st.info === "k" ? "Cétone : C=O très δ+, attaquée par NaBH₄ comme par LiAlH₄." : "Ester : le doublet de l'O–Et se délocalise vers le C=O, le carbone est moins δ+ : seul LiAlH₄ l'attaque.";
        wrapLabel(ctx, txt, box.x + 12, box.y + box.h - (ph ? 56 : 58), box.w - 24, {size:ph ? 10.5 : 11.5, align:"left", col:st.info === "k" ? "#8a4a08" : "#1d4fae", bg:"rgba(255,255,255,.95)", weight:700});
      } else label(ctx, "touche la cétone ou l'ester · glisse pour tourner", box.x + box.w - 10, box.y + box.h - 13, {size:ph ? 10 : 11, align:"right", col:"#8a95a3", weight:600, maxW:box.w - 20});
      ctx.restore();
      /* afficheurs et calculs */
      var Ms = molM(CR_SUB), n = kM.value / Ms, Mr = molM(R0.el), nRed = n * R0.nH / 4, Mp = molM(R0.pel);
      ro.set(0, red === "nabh4" ? "la cétone seulement" : "la cétone et l'ester");
      ro.set(1, red === "nabh4" ? "1 (cétone)" : "3 (1 cétone + 2 ester)");
      ro.set(2, F(n * 1000, 2) + " mmol (M = " + F(Ms, 2) + " g/mol)");
      ro.set(3, F(nRed * 1000, 2) + " mmol = " + F(nRed * Mr * 1000, 0) + " mg de " + R0.n);
      ro.set(4, R0.prod + " (" + fBrute(R0.pel) + ")" + (R0.side ? " + éthanol" : ""));
      ro.set(5, F(n * Mp, 3) + " g" + (R0.side ? " + " + F(n * molM(R0.side.el), 3) + " g d'éthanol" : ""));
      var msg = "<b>4-oxopentanoate d'éthyle</b> (CH₃–CO–CH₂–CH₂–COO–CH₂CH₃, " + fBrute(CR_SUB) + ", " + F(Ms, 2) + " g/mol) + <b>" + R0.n + "</b> (" + F(Mr, 2) + " g/mol, 4 H⁻ par formule). ";
      msg += red === "nabh4" ? "Seule la cétone est réduite : n(NaBH₄) = n / 4. On garde l'ester : c'est une réduction chimiosélective." : "Les deux fonctions sont réduites : 3 H⁻ par molécule, donc n(LiAlH₄) = 3n / 4. L'éthoxy de l'ester part et devient de l'éthanol après hydrolyse.";
      nt.set(msg + " <i>Quantités théoriques (stœchiométrie exacte, rendement 100 %) ; au laboratoire on met un excès de réducteur.</i>", "ok");
    });
  }
});

})();
