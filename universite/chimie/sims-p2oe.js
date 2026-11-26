/* Chimie BA1 · chimie organique (lot P2-OE) : extraction acido-basique, échelle d'oxydation du carbone,
   NAD⁺ et l'hydrure, hydrogénation catalytique sur le palladium.
   Simulations SFA originales ; la 3D est dessinée à la main sur un canevas 2D (projection perspective). */
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
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
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
/* deux directions sp³ restantes quand deux liaisons (u1, u2) sont déjà posées */
function sp3pair(u1, u2){
  var d = nrm(mul(add(nrm(u1), nrm(u2)), -1)), n = nrm(cross(u1, u2)), h = 54.75 * DEG;
  return [add(mul(d, Math.cos(h)), mul(n, Math.sin(h))), add(mul(d, Math.cos(h)), mul(n, -Math.sin(h)))];
}

/* ---------- rendu ---------- */
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function rgba(hex, a){ var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function ball(ctx, x, y, r, hex, alpha){
  if (!(r > 0)) return;
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
  var r = rot3(p, st.a, st.b), s = 1 / Math.max(0.3, 1 - r[2] * 0.04);
  return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s};
}
/* glisser = tourner la vue ; hit(type, p) peut intercepter le geste (renvoie true) */
function dragView(c, st, hit){
  var mine = false;
  c.cv.style.touchAction = "none";
  c.pointer(function(type, p){
    if (type === "down"){ mine = !(hit && hit("down", p)); if (mine){ st.lx = p.x; st.ly = p.y; st.drag = true; st.moved = 0; } return; }
    if (!mine){ if (hit) hit(type, p); return; }
    if (type === "drag" && st.lx != null){ st.moved += Math.abs(p.x - st.lx) + Math.abs(p.y - st.ly); st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, st.bmin == null ? -1.45 : st.bmin, st.bmax == null ? 1.45 : st.bmax); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; st.drag = false; mine = false; if (st.onup) st.onup(p); }
  });
}
/* canevas dont le rapport hauteur/largeur change sur téléphone ; largeur nulle ou absente : valeur sûre */
function respCanvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 0; if (!(w > 0)) w = 600; c.ratio = Math.max(0.3, w < 480 ? rPhone : rDesk); r0(); };
  c.resize(); return c;
}
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); w = Math.max(0, w); h = Math.max(0, h); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
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
function fitSize(ctx, s, maxW, size, weight){ var z = size; ctx.font = (weight || 700) + " " + z + "px " + FONT; while (z > 9 && ctx.measureText(s).width > maxW){ z -= 0.5; ctx.font = (weight || 700) + " " + z + "px " + FONT; } return z; }
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
var EL = {C:["#4a5568", 0.40], H:["#e8edf3", 0.25], O:["#d6392f", 0.42], N:["#2f5fd0", 0.41], S:["#d9a520", 0.52], Zn:["#8e7cc3", 0.55], R:["#b58ad6", 0.62], X:["#5aa36a", 0.55], Pd:["#b9c2cc", 0.70]};
function At(el, p, o){ var a = {el:el, p:p, col:EL[el][0], r:EL[el][1], alpha:1}; if (o) for (var q in o) a[q] = o[q]; return a; }
function bondDraw(ctx, p, q, b, sc, al){
  var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, ox = -dy / l, oy = dx / l;
  var w = Math.max(2.2, sc * 0.09) * ((p.s + q.s) / 2) * (b.w || 1);
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
/* scène 3D : atomes {el,p,col,r,alpha,lab,glow,badge,badgeCol,badgeA,ring}, liaisons {a,b,o,alpha,dash,col}, extra : [{z,f}] */
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
      if (a.glow){ var g = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 2.8); g.addColorStop(0, a.glow); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.save(); ctx.globalAlpha = a.alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.8, 0, 7); ctx.fill(); ctx.restore(); }
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
function bgScene(ctx, W, H, c0, c1){
  var bg = ctx.createRadialGradient(W * 0.5, H * 0.42, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  bg.addColorStop(0, c0 || "#ffffff"); bg.addColorStop(1, c1 || "#e3e9f3"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}
function plotFrame(c, o){
  var ctx = c.ctx, ax = {L:o.l || 40, R:c.W - (o.r || 14), T:o.t || 22, B:c.H - (o.b || 26)};
  ax.X = function(x){ return ax.L + (x - o.x0) / (o.x1 - o.x0) * (ax.R - ax.L); };
  ax.Y = function(y){ return ax.B - (y - o.y0) / (o.y1 - o.y0) * (ax.B - ax.T); };
  ax.iX = function(px){ return o.x0 + (px - ax.L) / Math.max(1, ax.R - ax.L) * (o.x1 - o.x0); };
  ctx.save(); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, c.W, c.H); ctx.restore();
  return ax;
}
function F(x, d){ x += (x < 0 ? -1 : 1) * 1e-9; var s = (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d); return s.replace("-", "−").replace(".", ","); }
var SUPD = {"-":"⁻", "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹"};
/* écriture scientifique à la belge : 4,6·10⁻⁸ */
function sci(x, d){
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.995 && (d || 0) <= 2){ m /= 10; e += 1; }
  var ms = F(m, d == null ? 1 : d);
  var es = String(e).split("").map(function(ch){ return SUPD[ch]; }).join("");
  return ms + "·10" + es;
}
function num(x, d){ var a = Math.abs(x); if (a !== 0 && (a < 0.01 || a >= 1e5)) return sci(x, 1); return F(x, d == null ? 2 : d); }
/* pourcentage lisible : 100 % seulement si c'est vraiment 100 % à l'affichage près */
function pct(f){ var p = 100 * f; if (p > 99.95 && p < 100) return "> 99,9 %"; if (p > 0 && p < 0.05) return "< 0,1 %"; return F(p, p >= 10 ? 1 : 1) + " %"; }
function bench(ctx, W, y, H){
  var g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, "#56606d"); g.addColorStop(0.08, "#3a424d"); g.addColorStop(1, "#272d35");
  ctx.fillStyle = g; ctx.fillRect(0, y, W, Math.max(0, H - y));
  ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, y, W, 2);
}
function labWall(ctx, W, H, c0, c1){
  var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0 || "#eef3f8"); g.addColorStop(1, c1 || "#dde5ee"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 1;
  for (var y = 22; y < H; y += 26){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (var r = 0, yy = 0; yy < H; yy += 26, r++){ for (var x = (r % 2) * 20; x < W; x += 40){ ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + 26); ctx.stroke(); } }
  ctx.restore();
}
function loupe(ctx, box, from, col){
  ctx.save();
  ctx.fillStyle = rgba(col || "#3b6ec2", 0.07);
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(box.x, box.y + 14); ctx.lineTo(box.x, box.y + box.h - 14); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(col || "#3b6ec2", 0.35); ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(box.x, box.y + 14); ctx.moveTo(from[0], from[1]); ctx.lineTo(box.x, box.y + box.h - 14); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(from[0], from[1], 6, 0, 7); ctx.strokeStyle = rgba(col || "#3b6ec2", 0.8); ctx.lineWidth = 1.6; ctx.stroke();
  ctx.restore();
}
function loupeFrame(ctx, box){
  ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
  rr(ctx, box.x, box.y, box.w, box.h, 18); ctx.fillStyle = "#fff"; ctx.fill();
  ctx.shadowColor = "transparent"; ctx.strokeStyle = "rgba(120,140,165,.55)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}
function clipBox(ctx, box){ ctx.save(); rr(ctx, box.x, box.y, box.w, box.h, 18); ctx.clip(); }
function wrapLines(ctx, s, maxW){
  var words = String(s).split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
/* bandeau en bas de scène : titre + sous-titre (deux lignes au plus, la police se réduit si nécessaire) */
function bannerBox(ctx, W, by, bh, title, sub2, col, ph){
  ctx.save(); ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.strokeStyle = "#d9e0ea"; rr(ctx, 8, by, W - 16, bh, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col || "#2a6fdb"; ctx.fillRect(8, by + 10, 4, Math.max(0, bh - 20)); ctx.restore();
  var tz = fitSize(ctx, title, W - 40, ph ? 14 : 16, 800);
  var z = ph ? 11.5 : 12.5, lines;
  for (;;){ ctx.save(); ctx.font = "700 " + z + "px " + FONT; lines = wrapLines(ctx, sub2 || "", W - 40); ctx.restore(); if (lines.length <= (ph ? 3 : 2) || z <= 9.5) break; z -= 0.5; }
  lines = lines.slice(0, ph ? 3 : 2);
  var th = tz + 3, tot = th + 3 + lines.length * (z + 3), y0 = by + (bh - tot) / 2;
  label(ctx, title, W / 2, y0 + th / 2, {size:tz, weight:800, col:"#13233a"});
  lines.forEach(function(L, i){ label(ctx, L, W / 2, y0 + th + 3 + (z + 3) * (i + 0.5), {size:z, weight:700, col:"#5f6b7a"}); });
}
/* hasard reproductible */
function hrand(i, seed){ var x = Math.sin(i * 127.1 + (seed || 0) * 311.7) * 43758.5453; return x - Math.floor(x); }
function floorShadow(ctx, x, y, rx, ry, a){
  if (!(rx > 0) || !(ry > 0)) return;
  ctx.save(); var g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, "rgba(15,27,45," + (a || 0.16) + ")"); g.addColorStop(1, "rgba(15,27,45,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore();
}
/* main gantée (nitrile) : centre (x, y), orientation ang, taille s */
function glove(ctx, x, y, ang, s, flip){
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); if (flip) ctx.scale(-1, 1);
  var g = ctx.createLinearGradient(-14 * s, -10 * s, 14 * s, 12 * s); g.addColorStop(0, "#9db5f0"); g.addColorStop(0.5, "#6f8fe0"); g.addColorStop(1, "#4565b8");
  ctx.fillStyle = g; ctx.strokeStyle = "rgba(40,60,120,.55)"; ctx.lineWidth = 1;
  for (var f = 0; f < 4; f++){ rr(ctx, -12 * s + f * 6.2 * s, -16 * s - (f === 1 || f === 2 ? 3 * s : 0), 5.6 * s, 16 * s, 2.8 * s); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(-1 * s, 4 * s, 14 * s, 11 * s, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(13 * s, 4 * s, 4 * s, 9 * s, -0.6, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#4565b8"; rr(ctx, -12 * s, 12 * s, 22 * s, 14 * s, 4 * s); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.beginPath(); ctx.ellipse(-5 * s, 0, 6 * s, 3 * s, -0.4, 0, 7); ctx.fill();
  ctx.restore();
}

/* ====================================================================== */
/* 1. Extraction acido-basique dans l'ampoule à décanter                   */
/* ====================================================================== */
var EX_AM = {
  benzyl:{n:"benzylamine", pKa:9.34, B:"C₆H₅CH₂–NH₂", BH:"C₆H₅CH₂–NH₃⁺", lab:"Benzylamine (pKa 9,3)"},
  anil:{n:"aniline", pKa:4.60, B:"C₆H₅–NH₂", BH:"C₆H₅–NH₃⁺", lab:"Aniline (pKa 4,6)"},
  tea:{n:"triéthylamine", pKa:10.75, B:"(C₂H₅)₃N", BH:"(C₂H₅)₃NH⁺", lab:"Triéthylamine (pKa 10,8)"}
};
var EX_N = 12, EX_NN = 8, EX_KN = 2000;   /* particules d'amine, de naphtalène ; partage du naphtalène éther/eau */
function exModel(pKa, KD, pH){
  var aBH = 1 / (1 + Math.pow(10, pH - pKa)), D = KD * (1 - aBH), fAq = 1 / (1 + D);
  return {aBH:aBH, D:D, fAq:fAq, fOrg:1 - fAq};
}
/* profil de l'ampoule (demi-largeur w à la profondeur y, depuis le haut du col) */
function exHalfW(y, G){
  var n0 = 0.07 * G.Lb, m = 0.40 * G.Lb;
  if (y <= n0) return G.rn;
  if (y <= m) return G.rn + (G.wm - G.rn) * Math.pow(Math.sin(PI / 2 * (y - n0) / (m - n0)), 0.8);
  if (y <= G.Lb) return G.rs + (G.wm - G.rs) * Math.pow(Math.cos(PI / 2 * (y - m) / (G.Lb - m)), 1.15);
  return G.rs;
}
/* table des volumes (comptés depuis le fond du corps de l'ampoule) */
function exVolTable(G){
  var N = 160, ys = [], cum = [], acc = 0;
  for (var i = 0; i <= N; i++){ var y = G.Lb * (1 - i / N); ys.push(y); if (i > 0){ var w = exHalfW(y + G.Lb / N / 2, G); acc += PI * w * w * G.Lb / N; } cum.push(acc); }
  G.ys = ys; G.cum = cum;
}
function exYofV(G, v){
  var c = G.cum, i = 1;
  if (v <= 0) return G.Lb;
  while (i < c.length - 1 && c[i] < v) i++;
  var t = (v - c[i - 1]) / Math.max(1e-9, c[i] - c[i - 1]);
  return lerp(G.ys[i - 1], G.ys[i], clamp(t, 0, 1));
}
function exVofY(G, y){ var i = clamp(Math.round((1 - y / G.Lb) * (G.cum.length - 1)), 0, G.cum.length - 1); return G.cum[i]; }
function amineIcon(ctx, x, y, s, prot, a, t, i){
  if (a < 0.03) return;
  var ang = 0.6 * Math.sin(t * 0.9 + i * 1.7) + i;
  var rx = Math.cos(ang) * 7 * s, ry = Math.sin(ang) * 7 * s;
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = "#7d8a9b"; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - rx, y - ry); ctx.stroke();
  ctx.restore();
  ball(ctx, x - rx, y - ry, 5.6 * s, "#4a5568", a);
  ball(ctx, x, y, 5 * s, "#2f5fd0", a);
  if (prot){ ball(ctx, x + Math.cos(ang + 2.2) * 6 * s, y + Math.sin(ang + 2.2) * 6 * s, 2.6 * s, "#e8edf3", a); badge(ctx, x + 5 * s, y - 6 * s, "+", "#c0392b", a, Math.max(4.5, 4 * s)); }
}
function naphIcon(ctx, x, y, s, a, t, i){
  if (a < 0.03) return;
  var ang = 0.4 * Math.sin(t * 0.7 + i * 2.1) + i * 0.8, r = 4.2 * s;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang);
  var g = ctx.createLinearGradient(-2 * r, -r, 2 * r, r); g.addColorStop(0, "#9aa5b4"); g.addColorStop(1, "#4a5568");
  ctx.fillStyle = g; ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 1;
  [-0.866 * r, 0.866 * r].forEach(function(cx){ ctx.beginPath(); for (var q = 0; q < 6; q++){ var an = PI / 6 + q * PI / 3; ctx.lineTo(cx + r * Math.cos(an), r * Math.sin(an)); } ctx.closePath(); ctx.fill(); ctx.stroke(); });
  ctx.restore();
}
function ionIcon(ctx, x, y, r, col, sign, a){ if (a < 0.03) return; ball(ctx, x, y, r, col, a); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.round(r * 1.4) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(sign, x, y + 0.5); ctx.restore(); }
/* déroulement d'une étape : A = extraction par HCl, B = rebasification par NaOH (durées en s) */
var EX_T = {A:{add:[0.4, 2.0], shake:[2.0, 5.4], settle:[5.4, 8.0], drain:[8.2, 11.0], end:13}, B:{add:[0.8, 2.6], shake:[2.6, 6.0], settle:[6.0, 8.6], drain:[8.8, 11.6], end:13}};
SFA.sim({
  id:"org-extraction-acido-basique", ch:"L12", tag:"Amines",
  titre:"Extraction acido-basique dans l'ampoule à décanter",
  resume:"Une amine et un composé neutre dissous dans l'éther : on ajoute HCl, on agite, l'amine protonée passe dans l'eau. On sépare, on rebasifie avec NaOH et l'amine revient dans l'éther.",
  but:"Regarde l'ampoule : l'éther (moins dense) est en haut, l'eau en bas. (1) On ajoute HCl et on agite : l'amine, devenue l'ion R–NH₃⁺, passe dans l'eau, le naphtalène reste dans l'éther. (2) On récupère la phase aqueuse, on ajoute NaOH et de l'éther neuf : l'amine redevient neutre et repasse dans l'éther. Attrape l'ampoule et secoue-la toi-même, change l'amine, les deux pH et le coefficient de partage, ou glisse les points du graphique.",
  aRetenir:"Une amine (pKa de R–NH₃⁺ vers 9 à 11 pour une alkylamine, 4,6 pour l'aniline) est protonée en milieu acide : l'ion R–NH₃⁺ est très soluble dans l'eau et insoluble dans l'éther. Seule la forme neutre R–NH₂ se partage entre les phases, avec K_D = [R–NH₂]éther / [R–NH₂]eau. Le rapport de distribution global vaut D = K_D · 1 / (1 + 10^(pKa − pH)) : à pH ≤ pKa − 2, D est presque nul (l'amine reste dans l'eau) ; à pH ≥ pKa + 2, D ≈ K_D (elle repasse dans l'éther). Fraction dans l'eau (volumes égaux) : 1 / (1 + D). Un composé neutre (naphtalène) ne change pas de forme et reste dans l'éther : c'est ainsi qu'on sépare une amine d'un composé neutre, ou qu'on extrait un alcaloïde d'une plante.",
  piege:"La moitié de l'amine passe dans l'eau quand D = 1, donc à pH = pKa − log(K_D − 1), pas à pH = pKa : avec K_D = 10, il faut descendre sous le pKa. L'aniline (pKa 4,6) n'est presque pas extraite à pH 5 : il faut un acide fort (pH 1). Et une seule extraction n'est jamais totale : avec D = 10 et des volumes égaux, 91 % seulement de l'amine repasse dans l'éther ; on recommence avec de l'éther neuf. Pense aussi à dégazer l'ampoule pendant qu'on agite (l'éther est très volatil).",
  build:function(k, S){
    var c = respCanvas(k, 0.92, 1.45), g = k.canvas(170);
    var st = {T:0, play:true, grab:null, man:0, tilt:0};
    var aS = k.select("Amine à extraire", Object.keys(EX_AM).map(function(q){ return [q, EX_AM[q].lab]; }), "benzyl");
    var stepS = k.seg("Étape", [["A", "1 · HCl : l'amine passe dans l'eau"], ["B", "2 · NaOH : elle revient dans l'éther"]], "A", function(v){ st.T = v === "A" ? 0 : EX_T.A.end; st.play = true; });
    var pAS = k.slider("pH après l'ajout d'acide (HCl)", 0, 7, 0.1, 1, "");
    var pBS = k.slider("pH après l'ajout de base (NaOH)", 7, 14, 0.1, 13, "");
    var kS = k.slider("Coefficient de partage K_D de l'amine neutre (éther/eau)", 1, 100, 1, 10, "");
    k.button("Recommencer", function(){ st.T = 0; st.play = true; stepS.set("A"); }, true);
    var pB = k.button("Pause", function(){ st.play = !st.play; pB.textContent = st.play ? "Pause" : "Lecture"; });
    var ro = k.readouts(["pH de la phase aqueuse", "Amine protonée (BH⁺)", "Rapport de distribution D", "Amine dans l'eau · dans l'éther", "Amine récupérée à la fin"]);
    var nt = k.note("", "ok");
    var geo = null;
    function cur(){
      var am = EX_AM[aS.value], KD = kS.value, A = exModel(am.pKa, KD, pAS.value), B = exModel(am.pKa, KD, pBS.value);
      var nA = Math.round(EX_N * A.fAq), nBw = Math.round(nA * B.fAq);
      return {am:am, KD:KD, A:A, B:B, nA:nA, nBw:nBw};
    }
    /* saisir l'ampoule pour l'agiter soi-même */
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(type, p){
      if (type === "down" && geo){
        var G = geo;
        if (Math.abs(p.x - G.fx) < G.wm + 16 && p.y > G.fy0 - 30 && p.y < G.fy0 + G.Lb + 10){ st.grab = {x0:p.x, lx:p.x}; st.man = 0; c.cv.style.cursor = "grabbing"; }
      }
      if (type === "drag" && st.grab){ st.man = Math.min(1, st.man + Math.abs(p.x - st.grab.lx) / 260); st.grab.lx = p.x; st.tilt = clamp((p.x - st.grab.x0) / 140, -0.55, 0.55); }
      if (type === "up" && st.grab){
        var stg = st.T < EX_T.A.end ? "A" : "B", T0 = stg === "A" ? 0 : EX_T.A.end, u = st.T - T0, E = EX_T[stg];
        if (st.man > 0.25 && u < E.drain[0]) st.T = T0 + E.settle[0];
        st.grab = null; st.tilt = 0; st.man = 0; c.cv.style.cursor = "grab";
      }
    });
    /* sur le graphique : faire glisser le point d'un des deux pH */
    var gax = null, gdrag = null;
    g.cv.style.touchAction = "none"; g.cv.style.cursor = "ew-resize";
    g.pointer(function(type, p){
      if (!gax) return;
      if (type === "down"){ var xa = gax.X(pAS.value), xb = gax.X(pBS.value); gdrag = Math.abs(p.x - xa) < Math.abs(p.x - xb) ? "A" : "B"; }
      if ((type === "down" || type === "drag") && gdrag){ var v = Math.round(clamp(gax.iX(p.x), 0, 14) * 10) / 10; if (gdrag === "A") pAS.set(Math.min(7, v)); else pBS.set(Math.max(7, v)); k.redraw(); }
      if (type === "up") gdrag = null;
    });
    var lp = k.loop(function(dt){ if (st.play && !st.grab){ st.T += dt; if (st.T >= EX_T.A.end + EX_T.B.end) st.T = 0; } st.clock = (st.clock || 0) + dt; k.redraw(); });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.clock || 0, m = cur();
      var stg = st.T < EX_T.A.end ? "A" : "B", u = st.T - (stg === "A" ? 0 : EX_T.A.end), E = EX_T[stg];
      if (stepS.value !== stg) stepS.set(stg);
      var mod = stg === "A" ? m.A : m.B, pHnow = stg === "A" ? pAS.value : pBS.value;
      /* décor */
      labWall(ctx, W, H, "#eef3f8", "#dde5ee");
      var banH = ph ? 92 : 66, benchY = H - banH - 16;
      bench(ctx, W, benchY, H);
      var erH = Math.max(50, Math.min(100, H * (ph ? 0.17 : 0.19))), tip = benchY - erH + 10, fy0 = ph ? 50 : 52;
      var total = Math.max(120, tip - fy0), G = {fx:W * (ph ? 0.26 : 0.30), fy0:fy0, Lb:total * 0.72, stem:total * 0.28};
      G.wm = Math.max(30, Math.min(G.Lb * 0.42, W * (ph ? 0.2 : 0.17))); G.rn = Math.max(7, G.wm * 0.12); G.rs = 4;
      exVolTable(G); geo = G;
      var yTop = 0.17 * G.Lb, Vtot = exVofY(G, yTop), Vaq0 = Vtot / 2, Vor = Vtot / 2;
      /* avancement des phases */
      var add = seg01(u, E.add[0], E.add[1]), shake = u >= E.shake[0] && u < E.shake[1], mixIn = seg01(u, E.shake[0], E.shake[0] + 1.2), settle = ease(seg01(u, E.settle[0], E.settle[1])), drain = ease(seg01(u, E.drain[0], E.drain[1]));
      var mix = u < E.settle[0] ? mixIn : 1 - settle;
      if (st.grab) mix = Math.max(mix, st.man);
      var q = 1 - drain, tilt = st.grab ? st.tilt : (shake ? 0.32 * Math.sin((u - E.shake[0]) * 5.2) * mixIn : 0), lift = st.grab || shake ? -14 * (st.grab ? 1 : mixIn) : 0;
      var fade = stg === "B" ? seg01(u, 0, 0.6) : 1;
      /* support : socle, tige, anneau */
      var rodX = G.fx - G.wm - (ph ? 14 : 22), ringY = fy0 + 0.33 * G.Lb;
      ctx.save(); var gr = ctx.createLinearGradient(rodX - 4, 0, rodX + 4, 0); gr.addColorStop(0, "#6b7480"); gr.addColorStop(0.45, "#e4e8ee"); gr.addColorStop(1, "#5d6671");
      ctx.fillStyle = gr; ctx.fillRect(rodX - 4, 10, 8, benchY - 10);
      var gbs = ctx.createLinearGradient(0, benchY - 12, 0, benchY); gbs.addColorStop(0, "#5a6370"); gbs.addColorStop(1, "#2b3038");
      ctx.fillStyle = gbs; rr(ctx, rodX - 24, benchY - 12, G.wm * 1.6 + 40, 12, 3); ctx.fill(); ctx.restore();
      /* erlenmeyer */
      var ex = G.fx, ew = Math.min(G.wm * 1.3, ph ? 64 : 80), en = 12, eTop = benchY - erH, eBot = benchY - 2;
      floorShadow(ctx, ex, benchY + 2, ew * 1.1, 6, 0.25);
      function erlenPath(){ ctx.beginPath(); ctx.moveTo(ex - en, eTop); ctx.lineTo(ex - en, eTop + erH * 0.28); ctx.lineTo(ex - ew, eBot - 6); ctx.quadraticCurveTo(ex - ew, eBot, ex - ew + 6, eBot); ctx.lineTo(ex + ew - 6, eBot); ctx.quadraticCurveTo(ex + ew, eBot, ex + ew, eBot - 6); ctx.lineTo(ex + en, eTop + erH * 0.28); ctx.lineTo(ex + en, eTop); }
      var erlFill = drain * 0.55;
      ctx.save(); erlenPath(); ctx.closePath(); ctx.clip();
      if (erlFill > 0.005){ var ly = eBot - (eBot - eTop) * erlFill * 0.62; var gw = ctx.createLinearGradient(0, ly, 0, eBot); gw.addColorStop(0, "rgba(175,210,242,.75)"); gw.addColorStop(1, "rgba(140,185,232,.9)"); ctx.fillStyle = gw; ctx.fillRect(ex - ew, ly, 2 * ew, eBot - ly); }
      ctx.restore();
      /* particules dans l'erlenmeyer : celles qui ont quitté l'ampoule */
      var erlP = [];
      ctx.save(); erlenPath(); var gE = ctx.createLinearGradient(ex - ew, 0, ex + ew, 0); gE.addColorStop(0, "rgba(150,175,205,.35)"); gE.addColorStop(0.2, "rgba(255,255,255,.3)"); gE.addColorStop(0.8, "rgba(255,255,255,.05)"); gE.addColorStop(1, "rgba(150,175,205,.35)"); ctx.fillStyle = gE; ctx.fill();
      ctx.strokeStyle = "rgba(90,110,135,.8)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      /* l'ampoule (repère local : origine en haut du col, puis inclinaison autour du centre du corps) */
      var pivY = fy0 + 0.45 * G.Lb;
      function toWorld(x, y){ var dx = x, dy = y - 0.45 * G.Lb, cs = Math.cos(tilt), sn = Math.sin(tilt); return [G.fx + dx * cs - dy * sn, pivY + lift + dx * sn + dy * cs]; }
      function funnelPath(){
        ctx.beginPath(); var N = 40, i, y;
        for (i = 0; i <= N; i++){ y = G.Lb * i / N; ctx.lineTo(exHalfW(y, G), y); }
        for (i = N; i >= 0; i--){ y = G.Lb * i / N; ctx.lineTo(-exHalfW(y, G), y); }
        ctx.closePath();
      }
      /* positions des particules (repère local) */
      var yI = exYofV(G, Vaq0 * q), yE = exYofV(G, Vaq0 * q + Vor);
      function posIn(v, h){ var y = exYofV(G, v), w = exHalfW(y, G); return [(2 * h - 1) * 0.72 * w, y]; }
      function layered(phase, i, seed){
        if (phase === "org") return posIn(Vaq0 * q + (0.1 + 0.8 * hrand(i, seed)) * Vor, hrand(i, seed + 1));
        var v = 0.08 + 0.84 * hrand(i, seed + 2);
        if (v < 1 - q) return null;   /* déjà écoulée */
        return posIn((v - (1 - q)) * Vaq0, hrand(i, seed + 3));
      }
      function mixedP(i, seed){ var v = (0.06 + 0.88 * hrand(i, seed + 4)) * Vtot, p = posIn(v, (hrand(i, seed + 5) + 0.06 * Math.sin(t * 3 + i)) % 1); return p; }
      var parts = [];
      for (var i = 0; i < EX_N; i++){
        var before, after, alive = true;
        if (stg === "A"){ before = "org"; after = i < m.nA ? "aq" : "org"; }
        else { alive = i < m.nA; before = "aq"; after = i < m.nBw ? "aq" : "org"; }
        if (!alive) continue;
        var ph0 = u < E.settle[0] ? before : after, base = layered(ph0, i, 11), mx = mixedP(i, 11), pos;
        var gone = !base && ph0 === "aq";
        if (u < E.settle[0]){ base = base || mx; pos = [lerp(base[0], mx[0], mix), lerp(base[1], mx[1], mix)]; }
        else { var b0 = layered(before, i, 11) || mx; base = base || mx; pos = u < E.settle[1] ? [lerp(mx[0], base[0], settle), lerp(mx[1], base[1], settle)] : base; }
        /* forme acide ou basique : protonée seulement dans l'eau, selon αBH du milieu */
        var inAq = (u < E.settle[0] ? before : after) === "aq", aBH = (stg === "A" ? (u < E.add[1] ? 0 : m.A.aBH) : (u < E.add[0] ? m.A.aBH : m.B.aBH));
        if (mix > 0.5) inAq = hrand(i, 9) < 0.5;
        var prot = inAq && hrand(i, 21) < aBH;
        parts.push({kind:"am", i:i, p:pos, prot:prot, gone:gone, aq:inAq});
      }
      if (stg === "A") for (var j = 0; j < EX_NN; j++){ var bN = layered("org", j, 51), mN = mixedP(j, 51); var pp = u < E.settle[0] ? [lerp(bN[0], mN[0], mix), lerp(bN[1], mN[1], mix)] : [lerp(mN[0], bN[0], u < E.settle[1] ? settle : 1), lerp(mN[1], bN[1], u < E.settle[1] ? settle : 1)]; parts.push({kind:"na", i:j, p:pp}); }
      ctx.save();
      ctx.translate(G.fx, pivY + lift); ctx.rotate(tilt); ctx.translate(0, -0.45 * G.Lb);
      /* liquides */
      ctx.save(); funnelPath(); ctx.clip();
      var cE = "rgba(240,214,120,", cW = "rgba(120,176,232,";
      ctx.globalAlpha = fade;
      var gEt = ctx.createLinearGradient(-G.wm, 0, G.wm, 0); gEt.addColorStop(0, cE + ".85)"); gEt.addColorStop(0.5, cE + ".6)"); gEt.addColorStop(1, cE + ".9)");
      var gWa = ctx.createLinearGradient(-G.wm, 0, G.wm, 0); gWa.addColorStop(0, cW + ".9)"); gWa.addColorStop(0.5, cW + ".65)"); gWa.addColorStop(1, cW + ".95)");
      ctx.globalAlpha = fade * (1 - mix);
      ctx.fillStyle = gEt; ctx.fillRect(-G.wm - 2, yE, 2 * G.wm + 4, yI - yE);
      ctx.fillStyle = gWa; ctx.fillRect(-G.wm - 2, yI, 2 * G.wm + 4, G.Lb - yI + 2);
      if (mix > 0.01){
        ctx.globalAlpha = fade * mix; ctx.fillStyle = "rgba(214,224,226,.85)"; ctx.fillRect(-G.wm - 2, yTop, 2 * G.wm + 4, G.Lb - yTop + 2);
        for (var d = 0; d < 46; d++){ var dv = hrand(d, 77) * Vtot, dp = posIn(dv, (hrand(d, 78) + 0.05 * Math.sin(t * 4 + d)) % 1); ctx.fillStyle = d % 2 ? "rgba(250,240,200,.95)" : "rgba(190,220,248,.95)"; ctx.beginPath(); ctx.arc(dp[0], dp[1], 2 + 3 * hrand(d, 79), 0, 7); ctx.fill(); }
      }
      ctx.globalAlpha = fade * (1 - mix);
      /* interface (ménisque) */
      if (q > 0.02 && mix < 0.9){ var wI = exHalfW(yI, G); ctx.strokeStyle = "rgba(90,120,160,.55)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-wI, yI - 2); ctx.quadraticCurveTo(0, yI + 2, wI, yI - 2); ctx.stroke(); }
      ctx.globalAlpha = 1;
      /* gouttes de réactif qui tombent dans le col */
      if (add > 0 && add < 1){ for (var dq = 0; dq < 3; dq++){ var fy = (add * 4 + dq / 3) % 1; ctx.fillStyle = stg === "A" ? "rgba(214,57,47,.85)" : "rgba(122,90,200,.85)"; ctx.beginPath(); ctx.arc(0, -10 + fy * (yE + 10), 2.6, 0, 7); ctx.fill(); } }
      parts.forEach(function(P){ if (P.kind === "na") naphIcon(ctx, P.p[0], P.p[1], ph ? 0.85 : 1, fade, t, P.i); else if (!P.gone) amineIcon(ctx, P.p[0], P.p[1], ph ? 0.85 : 1, P.prot, fade, t, P.i); });
      ctx.restore();
      /* verre */
      funnelPath(); var gG = ctx.createLinearGradient(-G.wm, 0, G.wm, 0); gG.addColorStop(0, "rgba(150,175,205,.35)"); gG.addColorStop(0.15, "rgba(255,255,255,.38)"); gG.addColorStop(0.55, "rgba(255,255,255,.04)"); gG.addColorStop(0.9, "rgba(255,255,255,.22)"); gG.addColorStop(1, "rgba(150,175,205,.4)");
      ctx.fillStyle = gG; ctx.fill(); ctx.strokeStyle = "rgba(80,100,128,.85)"; ctx.lineWidth = 1.7; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2.5; ctx.beginPath(); for (var hy = 0.2; hy < 0.55; hy += 0.02){ var hw = exHalfW(hy * G.Lb, G) * 0.62; ctx.lineTo(-hw, hy * G.Lb); } ctx.stroke();
      /* tige et robinet */
      var gS = ctx.createLinearGradient(-G.rs, 0, G.rs, 0); gS.addColorStop(0, "rgba(150,175,205,.6)"); gS.addColorStop(0.5, "rgba(255,255,255,.7)"); gS.addColorStop(1, "rgba(150,175,205,.6)");
      ctx.fillStyle = gS; ctx.fillRect(-G.rs, G.Lb - 1, 2 * G.rs, G.stem); ctx.strokeStyle = "rgba(80,100,128,.8)"; ctx.lineWidth = 1.2; ctx.strokeRect(-G.rs, G.Lb - 1, 2 * G.rs, G.stem);
      var kY = G.Lb + G.stem * 0.28, open = u > E.drain[0] - 0.3 && u < E.drain[1] + 0.2;
      ctx.fillStyle = "#e9edf2"; rr(ctx, -13, kY - 7, 26, 14, 6); ctx.fill(); ctx.strokeStyle = "rgba(80,100,128,.8)"; ctx.stroke();
      ctx.fillStyle = "#2a6fdb"; if (open) rr(ctx, 9, kY - 15, 8, 30, 3); else rr(ctx, 9, kY - 4, 26, 8, 3); ctx.fill();
      if (drain > 0 && drain < 1 && q > 0.01){ ctx.fillStyle = "rgba(175,210,242,.9)"; ctx.fillRect(-G.rs + 1.5, kY + 7, 2 * G.rs - 3, G.stem * 0.72 - 7); }
      /* bouchon */
      if (!(add > 0 && add < 1)){ ctx.fillStyle = "#f2f4f7"; rr(ctx, -G.rn - 3, -16, 2 * G.rn + 6, 18, 4); ctx.fill(); ctx.strokeStyle = "rgba(80,100,128,.7)"; ctx.lineWidth = 1; ctx.stroke(); }
      /* mains qui agitent */
      if (st.grab || (shake && mixIn > 0.05)){ glove(ctx, 0, -12, -0.2, ph ? 0.7 : 0.85); glove(ctx, 0, kY + 4, 0.25, ph ? 0.7 : 0.85, true); }
      ctx.restore();
      /* jet sous la tige */
      var tipW = toWorld(0, G.Lb + G.stem);
      if (drain > 0 && drain < 1 && q > 0.01){ ctx.save(); ctx.strokeStyle = "rgba(150,195,238,.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tipW[0], tipW[1]); ctx.lineTo(tipW[0] + Math.sin(t * 20) * 0.8, eBot - (eBot - eTop) * erlFill * 0.62); ctx.stroke(); ctx.restore(); }
      /* particules arrivées dans l'erlenmeyer */
      var nErl = 0;
      parts.forEach(function(P){ if (P.kind === "am" && P.gone){ var ey = eBot - 8 - hrand(P.i, 33) * (eBot - eTop) * erlFill * 0.45, exx = ex + (2 * hrand(P.i, 34) - 1) * ew * 0.55; amineIcon(ctx, exx, ey, ph ? 0.75 : 0.9, P.prot, 1, t, P.i); nErl++; } });
      /* anneau du support (devant l'ampoule) */
      ctx.save(); var rw = exHalfW(0.33 * G.Lb, G) + 4;
      ctx.strokeStyle = "#5d6671"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(rodX, ringY); ctx.lineTo(G.fx - rw, ringY); ctx.stroke();
      ctx.strokeStyle = "#8a939e"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(G.fx, ringY, rw, 5, 0, 0, PI); ctx.stroke(); ctx.restore();
      /* étiquettes des phases */
      if (mix < 0.4 && fade > 0.5 && !st.grab && !ph){
        var xL = G.fx + G.wm + 8, eyl = fy0 + (yE + yI) / 2, wyl = fy0 + (yI + G.Lb) / 2;
        if (q > 0.15){ label(ctx, "éther", xL, eyl, {size:ph ? 10.5 : 11.5, weight:800, col:"#8a6d12", align:"left", bg:"rgba(255,255,255,.85)"}); label(ctx, "eau", xL, Math.min(wyl, fy0 + G.Lb - 8), {size:ph ? 10.5 : 11.5, weight:800, col:"#2a5d9a", align:"left", bg:"rgba(255,255,255,.85)"}); }
        else label(ctx, "éther", xL, eyl, {size:ph ? 10.5 : 11.5, weight:800, col:"#8a6d12", align:"left", bg:"rgba(255,255,255,.85)"});
      }
      if (drain > 0.3 && !ph) label(ctx, "phase aqueuse", ex + ew + 6, eBot - 14, {size:10.5, weight:800, col:"#2a5d9a", align:"left", bg:"rgba(255,255,255,.85)"});
      /* flacon de réactif (HCl ou NaOH) au-dessus du col */
      if (add > 0 && add < 1){
        var bx = G.fx + 8, by = fy0 - 14;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(-0.9);
        var gb = ctx.createLinearGradient(-10, 0, 10, 0); gb.addColorStop(0, "#c9d3de"); gb.addColorStop(0.5, "#ffffff"); gb.addColorStop(1, "#b7c3d1");
        ctx.fillStyle = gb; rr(ctx, -10, -36, 20, 32, 4); ctx.fill(); ctx.strokeStyle = "rgba(80,100,128,.7)"; ctx.stroke();
        ctx.fillStyle = stg === "A" ? "#d6392f" : "#7a5ac8"; ctx.fillRect(-10, -26, 20, 10);
        ctx.restore();
        label(ctx, stg === "A" ? "HCl" : "NaOH", bx + 30, Math.max(12, by - 30), {size:11, weight:800, col:stg === "A" ? "#b02e25" : "#5b3fa8", bg:"rgba(255,255,255,.9)"});
      }
      /* flacon : première phase éther (composé neutre), mise de côté pendant l'étape 2 */
      if (stg === "B" && !ph){
        var fx2 = G.fx + G.wm + 44, fb = benchY - 2, fr = 22;
        floorShadow(ctx, fx2, benchY + 2, 30, 5, 0.25);
        ctx.save(); ctx.beginPath(); ctx.arc(fx2, fb - fr, fr, 0, 7); ctx.fillStyle = "rgba(246,236,190,.85)"; ctx.fill(); ctx.strokeStyle = "rgba(80,100,128,.8)"; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = "rgba(220,230,240,.6)"; ctx.fillRect(fx2 - 6, fb - 2 * fr - 18, 12, 20); ctx.strokeRect(fx2 - 6, fb - 2 * fr - 18, 12, 20); ctx.restore();
        for (var nn = 0; nn < 4; nn++) naphIcon(ctx, fx2 - 10 + (nn % 2) * 18, fb - fr - 6 + Math.floor(nn / 2) * 12, 0.7, 1, t, nn);
        label(ctx, "éther 1", fx2, fb - 2 * fr - 30, {size:10.5, weight:800, col:"#8a6d12", bg:"rgba(255,255,255,.9)"});
      }
      /* loupe : l'interface vue à l'échelle des molécules */
      var box = ph ? {x:W * 0.53, y:10, w:W * 0.47 - 8, h:benchY - 24} : {x:W * 0.585, y:12, w:W * 0.415 - 12, h:benchY - 28};
      var fromW = toWorld(exHalfW(yI, G) * 0.4, yI);
      if (!st.grab && mix < 0.5 && q > 0.05) loupe(ctx, box, fromW, "#2a6fdb");
      loupeFrame(ctx, box); clipBox(ctx, box);
      var mid = box.y + box.h * 0.5, sc2 = clamp(Math.min(box.w, box.h) / 230, 0.9, 1.6);
      var gt = ctx.createLinearGradient(0, box.y, 0, mid); gt.addColorStop(0, "#fbf6dd"); gt.addColorStop(1, "#f3e7b0"); ctx.fillStyle = gt; ctx.fillRect(box.x, box.y, box.w, mid - box.y);
      var gbw = ctx.createLinearGradient(0, mid, 0, box.y + box.h); gbw.addColorStop(0, "#cfe3f7"); gbw.addColorStop(1, "#a9cbef"); ctx.fillStyle = gbw; ctx.fillRect(box.x, mid, box.w, box.y + box.h - mid);
      /* solvants en fond */
      ctx.save(); ctx.globalAlpha = 0.22;
      for (var sv = 0; sv < 26; sv++){
        var sx = box.x + hrand(sv, 61) * box.w, sy0 = hrand(sv, 62), top = sv % 2 === 0, sy = top ? box.y + 8 + sy0 * (mid - box.y - 16) : mid + 8 + sy0 * (box.y + box.h - mid - 16), an2 = hrand(sv, 63) * 6.28 + t * 0.2;
        ctx.save(); ctx.translate(sx + 3 * Math.sin(t * 0.5 + sv), sy); ctx.rotate(an2);
        if (top){ ctx.fillStyle = "#4a5568"; ctx.beginPath(); ctx.arc(-9, 2, 4, 0, 7); ctx.arc(9, 2, 4, 0, 7); ctx.fill(); ctx.fillStyle = "#d6392f"; ctx.beginPath(); ctx.arc(0, -2, 4.4, 0, 7); ctx.fill(); }
        else { ctx.fillStyle = "#d6392f"; ctx.beginPath(); ctx.arc(0, 0, 5, 0, 7); ctx.fill(); ctx.fillStyle = "#8f9bab"; ctx.beginPath(); ctx.arc(-5, 4, 3, 0, 7); ctx.arc(5, 4, 3, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(90,120,160,.6)"; ctx.lineWidth = 2; ctx.beginPath(); for (var xx = box.x; xx <= box.x + box.w; xx += 6) ctx.lineTo(xx, mid + 2 * Math.sin(xx * 0.06 + t * 1.5)); ctx.stroke();
      /* ions spectateurs */
      var aqI = stg === "A" ? (u > E.add[1] ? 4 : 0) : 4, nNa = stg === "B" && u > E.add[1] ? 5 : 0;
      for (var ci = 0; ci < aqI; ci++){ var cx3 = box.x + 14 + hrand(ci, 71) * (box.w - 28), cy3 = mid + 16 + hrand(ci, 72) * (box.y + box.h - mid - 32); ionIcon(ctx, cx3 + 4 * Math.sin(t + ci), cy3, 6.5 * sc2, "#2fa84f", "−", 1); }
      for (var ni = 0; ni < nNa; ni++){ var nx3 = box.x + 14 + hrand(ni, 73) * (box.w - 28), ny3 = mid + 16 + hrand(ni, 74) * (box.y + box.h - mid - 32); ionIcon(ctx, nx3 + 4 * Math.cos(t + ni), ny3, 5.5 * sc2, "#8a63d2", "+", 1); }
      /* amines et naphtalène (même répartition que dans l'ampoule) */
      var nAqL = 0, nOrgL = 0;
      parts.forEach(function(P){
        if (P.kind === "am" && P.gone) return;
        var aq = P.kind === "am" ? P.aq : false, ix = P.kind === "am" ? P.i : P.i + 40;
        var lx = box.x + 18 + hrand(ix, 81) * (box.w - 36) + 5 * Math.sin(t * 0.7 + ix), ly2 = aq ? mid + 18 + hrand(ix, 82) * (box.y + box.h - mid - 34) : box.y + 34 + hrand(ix, 83) * (mid - box.y - 50);
        if (mix > 0.05 && P.kind === "am") ly2 = lerp(ly2, mid + (hrand(ix, 84) - 0.5) * 40, mix * 0.6);
        if (P.kind === "na") naphIcon(ctx, lx, ly2, 1.7 * sc2, fade, t, P.i); else { amineIcon(ctx, lx, ly2, 1.55 * sc2, P.prot, fade, t, P.i); if (aq) nAqL++; else nOrgL++; }
      });
      ctx.restore();
      label(ctx, "éther (d = 0,71)", box.x + 10, box.y + 16, {size:ph ? 10.5 : 11.5, weight:800, col:"#8a6d12", align:"left", bg:"rgba(255,255,255,.85)"});
      label(ctx, "eau (d = 1,00)", box.x + 10, box.y + box.h - 16, {size:ph ? 10.5 : 11.5, weight:800, col:"#2a5d9a", align:"left", bg:"rgba(255,255,255,.85)"});
      /* légende de la loupe */
      if (!ph){
        var lgx = box.x + box.w - 12, lgy = box.y + 42;
        label(ctx, "R–NH₂ : bleu + gris", lgx, lgy, {size:10.5, weight:700, col:"#2c3a4e", align:"right", bg:"rgba(255,255,255,.85)"});
        label(ctx, "R–NH₃⁺ : avec H et +", lgx, lgy + 20, {size:10.5, weight:700, col:"#b02e25", align:"right", bg:"rgba(255,255,255,.85)"});
        label(ctx, (stg === "B" && u > E.add[1] ? "Na⁺ violet · " : "") + "Cl⁻ vert", lgx, box.y + box.h - 16, {size:10.5, weight:700, col:"#2a7a3e", align:"right", bg:"rgba(255,255,255,.85)"});
      }
      /* bandeau */
      var am = m.am, title, s2, col = stg === "A" ? "#c0392b" : "#6a4fc0";
      if (stg === "A"){
        title = am.B + " (éther) + H₃O⁺ → " + am.BH + " (eau) + H₂O";
        if (u < E.shake[0]) s2 = "1. L'amine et le naphtalène sont dissous dans l'éther, au-dessus de l'eau. On ajoute de l'acide chlorhydrique : pH " + F(pAS.value, 1) + ".";
        else if (u < E.settle[0]) s2 = "2. On bouche, on retourne et on agite (en dégazant) : les deux liquides se mélangent en fines gouttelettes, les molécules passent d'une phase à l'autre.";
        else if (u < E.drain[0]) s2 = m.A.fAq > 0.5 ? "3. Décantation : l'amine, protonée en ion " + am.BH + ", reste dans l'eau (" + pct(m.A.fAq) + "). Le naphtalène, neutre, reste dans l'éther." : "3. Décantation : à pH " + F(pAS.value, 1) + ", l'amine reste surtout neutre (D = " + num(m.A.D, 2) + ") : seulement " + pct(m.A.fAq) + " passe dans l'eau. Il faut un pH plus acide.";
        else if (u < E.drain[1]) s2 = "4. On ôte le bouchon et on ouvre le robinet : la phase aqueuse, en bas, s'écoule dans l'erlenmeyer.";
        else s2 = "Il reste dans l'ampoule l'éther avec le naphtalène" + (m.nA < EX_N ? " et l'amine non extraite" : "") + " ; l'erlenmeyer contient le sel " + am.BH + " Cl⁻ dissous dans l'eau.";
      } else {
        title = am.BH + " (eau) + HO⁻ → " + am.B + " (éther) + H₂O";
        if (u < E.shake[0]) s2 = "5. L'éther 1 (naphtalène) est mis de côté ; la phase aqueuse revient dans l'ampoule avec de l'éther neuf. On ajoute de la soude jusqu'à pH " + F(pBS.value, 1) + " : l'ion " + am.BH + " perd son H⁺.";
        else if (u < E.settle[0]) s2 = "6. On agite à nouveau : l'amine neutre, peu soluble dans l'eau, peut passer dans l'éther.";
        else if (u < E.drain[0]) s2 = "7. Décantation : " + pct(m.B.fOrg) + " de l'amine passe dans l'éther (D = " + num(m.B.D, 2) + ", volumes égaux)." + (m.B.fOrg < 0.5 ? " Le milieu n'est pas assez basique !" : " Les ions Na⁺ et Cl⁻ restent dans l'eau.");
        else if (u < E.drain[1]) s2 = "8. On évacue la phase aqueuse (Na⁺, Cl⁻, eau) par le robinet.";
        else s2 = "L'amine est dans l'éther : on sèche cette phase et on évapore l'éther (Éb 35 °C) pour récupérer l'amine. Au total : " + pct(m.A.fAq * m.B.fOrg) + ".";
      }
      bannerBox(ctx, W, H - banH - 6, banH, title, s2, col, ph);
      /* lectures */
      ro.set(0, F(pHnow, 1) + (stg === "A" ? " (HCl)" : " (NaOH)"));
      ro.set(1, pct(mod.aBH) + " dans l'eau");
      ro.set(2, num(mod.D, 2));
      ro.set(3, pct(mod.fAq) + " · " + pct(mod.fOrg));
      ro.set(4, pct(m.A.fAq * m.B.fOrg));
      var half = m.KD > 1 ? am.pKa - Math.log10(m.KD - 1) : null;
      nt.set("<b>" + am.n.charAt(0).toUpperCase() + am.n.slice(1) + "</b> : pKa(BH⁺) = " + F(am.pKa, 2) + ", K_D = " + F(m.KD, 0) + ". À pH " + F(pHnow, 1) + ", fraction protonée α = 1 / (1 + 10^(pH − pKa)) : " + pct(mod.aBH) + " ; D = K_D·(1 − α) : " + num(mod.D, 2) + " ; fraction dans l'eau 1 / (1 + D) : " + pct(mod.fAq) + "." + (half != null ? " La moitié de l'amine est dans l'eau à pH = pKa − log(K_D − 1) = " + F(half, 2) + "." : " Avec K_D = 1, l'amine neutre se partage à parts égales : elle n'est jamais extraite à plus de 50 %.") + " Le naphtalène (K_D ≈ " + EX_KN + ") reste dans l'éther (" + pct(1 / (1 + EX_KN)) + " dans l'eau). <i>Modèle : volumes égaux, une seule extraction, R–NH₃⁺ insoluble dans l'éther ; les particules sont symboliques (12 amines).</i>", mod.fAq > 0.5 === (stg === "A") ? "ok" : "warn");
      /* graphique : % d'amine dans l'eau selon le pH */
      g.clear();
      var gc = g.ctx, ax = plotFrame(g, {x0:0, x1:14, y0:0, y1:100, l:ph ? 40 : 46, r:12, t:18, b:28}); gax = ax;
      gc.save(); gc.font = "600 10.5px " + FONT; gc.fillStyle = "#5f6b7a"; gc.textAlign = "center"; gc.textBaseline = "top";
      for (var xv = 0; xv <= 12; xv += 2){ gc.strokeStyle = "#edf0f4"; gc.beginPath(); gc.moveTo(ax.X(xv), ax.T); gc.lineTo(ax.X(xv), ax.B); gc.stroke(); gc.fillText(String(xv), ax.X(xv), ax.B + 4); }
      gc.textAlign = "right"; gc.textBaseline = "middle";
      [0, 50, 100].forEach(function(yv){ gc.strokeStyle = "#edf0f4"; gc.beginPath(); gc.moveTo(ax.L, ax.Y(yv)); gc.lineTo(ax.R, ax.Y(yv)); gc.stroke(); gc.fillText(yv + " %", ax.L - 4, ax.Y(yv)); });
      gc.strokeStyle = "#8a95a3"; gc.lineWidth = 1.2; gc.beginPath(); gc.moveTo(ax.L, ax.T); gc.lineTo(ax.L, ax.B); gc.lineTo(ax.R, ax.B); gc.stroke();
      gc.setLineDash([4, 4]); gc.strokeStyle = "#8a95a3"; gc.beginPath(); gc.moveTo(ax.X(am.pKa), ax.T); gc.lineTo(ax.X(am.pKa), ax.B); gc.stroke(); gc.setLineDash([]);
      gc.lineWidth = 3; gc.strokeStyle = "#2a6fdb"; gc.beginPath();
      for (var px = 0; px <= 140; px++){ var pv = px / 10, fv = exModel(am.pKa, m.KD, pv).fAq * 100; if (px) gc.lineTo(ax.X(pv), ax.Y(fv)); else gc.moveTo(ax.X(pv), ax.Y(fv)); }
      gc.stroke(); gc.restore();
      S.draw.text(g, "pKa " + F(am.pKa, 1), ax.X(am.pKa) + 4, ax.T + 6, {size:10.5, color:"#5f6b7a", align:"left"});
      S.draw.text(g, "% de l'amine dans l'eau", ax.R, 9, {size:11, color:"#2a6fdb", align:"right"});
      S.draw.text(g, "pH", ax.X(14), ax.B + 11, {size:11, color:"#2c3a4e", align:"center"});
      [["A", pAS.value, m.A.fAq, "#c0392b", "HCl"], ["B", pBS.value, m.B.fAq, "#6a4fc0", "NaOH"]].forEach(function(M){
        var x = ax.X(M[1]), y = ax.Y(M[2] * 100), on = M[0] === stg;
        gc.save(); gc.strokeStyle = M[3]; gc.globalAlpha = on ? 1 : 0.5; gc.lineWidth = 1.2; gc.setLineDash([3, 3]); gc.beginPath(); gc.moveTo(x, ax.B); gc.lineTo(x, y); gc.stroke(); gc.restore();
        ball(gc, x, y, on ? 8 : 6, M[3]);
        S.draw.text(g, M[4], x + (M[0] === "A" ? 12 : -12), y + (y < ax.T + 20 ? 14 : -12), {size:10.5, color:M[3], align:M[0] === "A" ? "left" : "right"});
      });
    });
  }
});

/* ====================================================================== */
/* 2. L'échelle d'oxydation du carbone, du méthane au CO₂                  */
/* ====================================================================== */
/* atomes : 0 C, 1 H1, 2 H2, 3 H3, 4 H4, 5 O1, 6 O2 ; chaque barreau = positions (Å), opacités, liaisons [i, j, ordre] */
var OX = (function(){
  var X = [1, 0, 0], tet = tetra3(X, [0, 1, 0]), d1 = tet[0], d2 = tet[1], d3 = tet[2];
  function at(d, L){ return mul(nrm(d), L); }
  function dir(a){ return [Math.cos(a * DEG), Math.sin(a * DEG), 0]; }
  var C = [0, 0, 0], far = 3.2;
  /* méthanol */
  var O1m = at(X, 1.43), H4m = add(O1m, at([0.33, -0.944, 0], 0.96));
  /* acide méthanoïque : H de O2 du côté du C=O (conformère Z) */
  var O2a = at(dir(240), 1.34), u = nrm(sub(C, O2a)), cand = [rotAx(u, [0, 0, 1], 106 * DEG), rotAx(u, [0, 0, 1], -106 * DEG)], O1a = at(X, 1.20);
  var hd = len(sub(add(O2a, cand[0]), O1a)) < len(sub(add(O2a, cand[1]), O1a)) ? cand[0] : cand[1], H2a = add(O2a, mul(hd, 0.97));
  /* positions de « parking » des atomes absents (là où ils partent ou d'où ils arrivent) */
  var pO1 = at(X, 1.43 + far), pH4 = add(H4m, at([0.33, -0.944, 0.3], far)), pH3m = at(d3, 1.09 + far), pO2 = at(dir(240), 1.34 + far);
  var pH1 = at(dir(120), 1.09 + far), pH2a = add(H2a, mul(nrm(sub(H2a, O2a)), far));
  var R = [
    {f:"CH₄", n:"méthane", no:-4, dcH:-890, P:[C, at(d1, 1.09), at(d2, 1.09), at(d3, 1.09), at(X, 1.09), pO1, pO2], A:[1, 1, 1, 1, 1, 0, 0], B:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]},
    {f:"CH₃OH", n:"méthanol", no:-2, dcH:-726, P:[C, at(d1, 1.09), at(d2, 1.09), at(d3, 1.09), H4m, O1m, pO2], A:[1, 1, 1, 1, 1, 1, 0], B:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 5, 1], [5, 4, 1]]},
    {f:"HCHO", n:"méthanal", no:0, dcH:-571, P:[C, at(dir(120), 1.10), at(dir(240), 1.10), pH3m, pH4, at(X, 1.21), pO2], A:[1, 1, 1, 0, 0, 1, 0], B:[[0, 1, 1], [0, 2, 1], [0, 5, 2]]},
    {f:"HCOOH", n:"acide méthanoïque", no:2, dcH:-255, P:[C, at(dir(120), 1.10), H2a, pH3m, pH4, O1a, O2a], A:[1, 1, 1, 0, 0, 1, 1], B:[[0, 1, 1], [0, 5, 2], [0, 6, 1], [6, 2, 1]]},
    {f:"CO₂", n:"dioxyde de carbone", no:4, dcH:0, P:[C, pH1, pH2a, pH3m, pH4, at(X, 1.16), at([-1, 0, 0], 1.16)], A:[1, 0, 0, 0, 0, 1, 1], B:[[0, 5, 2], [0, 6, 2]]}
  ];
  /* étapes : demi-équation (sens de l'oxydation), ce qui bouge, exemples de réactifs */
  var S = [
    {eq:"CH₄ + H₂O → CH₃OH + 2 H⁺ + 2 e⁻", mv:"un O s'insère dans une liaison C–H", ox:"Oxydant : la méthane monooxygénase des bactéries méthanotrophes insère un atome O venu de O₂.", red:"Réduction : enlever l'O est difficile au laboratoire ; les archées méthanogènes réduisent le carbone jusqu'à CH₄.", mvR:"l'O part, un H reprend sa place"},
    {eq:"CH₃OH → HCHO + 2 H⁺ + 2 e⁻", mv:"deux H partent (un du C, un du O)", ox:"Oxydant doux (PCC), ou l'alcool déshydrogénase avec NAD⁺ : alcool primaire → aldéhyde.", red:"Réducteur : NaBH₄ ou LiAlH₄ (un ion hydrure H⁻ puis un H⁺), ou H₂ sur catalyseur.", mvR:"deux H arrivent (un sur le C, un sur le O)"},
    {eq:"HCHO + H₂O → HCOOH + 2 H⁺ + 2 e⁻", mv:"un O s'insère dans la liaison C–H", ox:"Oxydant : K₂Cr₂O₇ ou KMnO₄ en milieu acide, réactif de Tollens : aldéhyde → acide carboxylique.", red:"Réduction d'un acide en aldéhyde : difficile à arrêter là, LiAlH₄ va jusqu'à l'alcool.", mvR:"l'O du groupe –OH part"},
    {eq:"HCOOH → CO₂ + 2 H⁺ + 2 e⁻", mv:"deux H partent (un du C, un du O)", ox:"Oxydant : KMnO₄, ou la formiate déshydrogénase avec NAD⁺ : le carbone atteint son degré maximal.", red:"Réducteur : électrolyse, ou la formiate déshydrogénase en sens inverse : CO₂ → acide méthanoïque.", mvR:"deux H arrivent"}
  ];
  return {R:R, S:S};
})();
function oxNo(n){ return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n); }
/* liaisons du carbone : contribution au n.o. (H : −1 ; O : +1 par liaison) */
function oxCbonds(r){ return OX.R[r].B.filter(function(b){ return b[0] === 0; }).map(function(b){ var el = b[1] === 5 || b[1] === 6 ? "O" : "H"; return {j:b[1], o:b[2], el:el, v:el === "H" ? -b[2] : b[2]}; }); }
function oxMix(r0, r1, u){
  var A = OX.R[r0], B = OX.R[r1], P = A.P.map(function(p, i){ return lerp3(p, B.P[i], u); }), al = A.A.map(function(a, i){ return lerp(a, B.A[i], u); });
  var key = function(b){ return Math.min(b[0], b[1]) + "-" + Math.max(b[0], b[1]); }, mA = {}, mB = {}, bonds = [], seen = {};
  A.B.forEach(function(b){ mA[key(b)] = b; }); B.B.forEach(function(b){ mB[key(b)] = b; });
  Object.keys(mA).concat(Object.keys(mB)).forEach(function(k2){
    if (seen[k2]) return; seen[k2] = 1; var a = mA[k2], b = mB[k2], x = a || b;
    if (a && b) bonds.push({a:x[0], b:x[1], o:u < 0.5 ? a[2] : b[2], dash:a[2] !== b[2] && u > 0.04 && u < 0.96});
    else if (a) bonds.push({a:a[0], b:a[1], o:a[2], dash:u > 0.04, alpha:1 - ease(u * 1.6)});
    else bonds.push({a:b[0], b:b[1], o:b[2], dash:u < 0.96, alpha:ease(u * 1.6 - 0.6)});
  });
  return {P:P, A:al, bonds:bonds};
}
/* petit personnage « carbone » qui grimpe l'échelle */
function climber(ctx, x, y, s, t, moving, no){
  var sw = moving ? Math.sin(t * 9) : Math.sin(t * 1.6) * 0.25;
  ctx.save(); ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 3 * s; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x - 5 * s, y - 14 * s); ctx.lineTo(x - 8 * s - 2 * s * sw, y); ctx.moveTo(x + 5 * s, y - 14 * s); ctx.lineTo(x + 8 * s + 2 * s * sw, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 11 * s, y - 26 * s); ctx.lineTo(x - 17 * s, y - 34 * s - 5 * s * sw); ctx.moveTo(x + 11 * s, y - 26 * s); ctx.lineTo(x + 17 * s, y - 34 * s + 5 * s * sw); ctx.stroke();
  ctx.restore();
  ball(ctx, x, y - 27 * s, 14 * s, "#4a5568");
  var hue = no < 0 ? "#2a6fdb" : no > 0 ? "#c0392b" : "#6b7685";
  ctx.save(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x - 5 * s, y - 30 * s, 3.4 * s, 0, 7); ctx.arc(x + 5 * s, y - 30 * s, 3.4 * s, 0, 7); ctx.fill();
  ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(x - 4.4 * s, y - 29.6 * s, 1.7 * s, 0, 7); ctx.arc(x + 5.6 * s, y - 29.6 * s, 1.7 * s, 0, 7); ctx.fill();
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.arc(x, y - 24 * s, 4 * s, 0.15 * PI, 0.85 * PI); ctx.stroke();
  ctx.fillStyle = hue; ctx.font = "800 " + Math.round(10 * s) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("C", x, y - 18 * s);
  ctx.restore();
}
SFA.sim({
  id:"org-echelle-oxydation-carbone", ch:"c10", tag:"Oxydation et réduction",
  titre:"L'échelle d'oxydation du carbone, du méthane au CO₂",
  resume:"Cinq barreaux : CH₄ (−4), CH₃OH (−2), HCHO (0), HCOOH (+2), CO₂ (+4). Clique sur les liaisons du carbone pour compter son nombre d'oxydation, puis monte ou descend en choisissant un oxydant ou un réducteur : les H partent, les O arrivent.",
  but:"La molécule du barreau où se trouve le petit carbone tourne en 3D (glisse pour la tourner). Clique sur chaque liaison du carbone : une liaison C–H compte −1 (le carbone, plus électronégatif, garde le doublet), une liaison C–O compte +1 par trait (l'oxygène prend le doublet). Choisis ensuite un oxydant ou un réducteur et fais réagir, ou clique directement sur un barreau de l'échelle.",
  aRetenir:"Nombre d'oxydation d'un carbone : on attribue chaque doublet de liaison à l'atome le plus électronégatif. χ : O 3,44 > C 2,55 > H 2,20. Donc chaque C–H vaut −1, chaque liaison vers O vaut +1 (une double liaison C=O vaut +2), une liaison C–C vaut 0. Méthane −4, méthanol −2, méthanal 0, acide méthanoïque +2, CO₂ +4 : chaque barreau correspond à 2 électrons. En chimie organique, s'oxyder, c'est gagner des liaisons vers O (ou perdre des H) ; se réduire, c'est gagner des H. Plus le carbone est réduit, plus sa combustion libère d'énergie : c'est pourquoi les graisses (C surtout à −2) sont un meilleur carburant que les sucres (C vers 0).",
  piege:"Le n.o. n'est pas la charge réelle de l'atome : c'est une comptabilité. Une liaison C=O compte +2, pas +1. Et « perdre deux H » est bien une oxydation, même si aucun O n'arrive : le méthanol devient méthanal en perdant H⁺ + H⁻, soit 2 H⁺ + 2 e⁻. Dans une molécule plus grande, compte chaque carbone séparément : les liaisons C–C ne changent rien.",
  build:function(k, S){
    var c = respCanvas(k, 0.9, 1.5), st = {a:0.35, b:0.25, spin:true, r:0, from:0, to:0, u:1, q:[], t:0, rev:{}, demo:true, dT:0, flash:null};
    var rS = k.seg("Réactif", [["ox", "Oxydant ↑"], ["red", "Réducteur ↓"]], "ox");
    k.button("Faire réagir", function(){ stopDemo(); var last = st.q.length ? st.q[st.q.length - 1] : st.to; go(last + (rS.value === "ox" ? 1 : -1)); }, true);
    k.button("Compter toutes les liaisons", function(){ oxCbonds(st.to).forEach(function(b){ st.rev[b.j] = st.t; }); });
    k.button("Effacer le comptage", function(){ st.rev = {}; });
    var dT = k.toggle("Démonstration automatique (monte puis redescend)", true, function(v){ st.demo = v; st.dT = 0; });
    var spT = k.toggle("Rotation automatique de la molécule", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Molécule", "n.o. du carbone", "Ton comptage", "Électrons perdus depuis CH₄", "Combustion ΔcH°"]);
    var nt = k.note("", "ok");
    var lay = null, prLast = null;
    function stopDemo(){ if (st.demo){ st.demo = false; dT.set(false); } }
    function go(r){
      r = clamp(r, 0, 4);
      var last = st.q.length ? st.q[st.q.length - 1] : st.to;
      if (r === last){ if (r === 0 || r === 4) st.flash = {t:st.t, msg:r === 4 ? "CO₂ : le carbone ne peut plus s'oxyder (+4, toutes ses liaisons vont vers O)" : "CH₄ : le carbone ne peut plus se réduire (−4, quatre liaisons C–H)"}; return; }
      var s = r > last ? 1 : -1; for (var x = last + s; s > 0 ? x <= r : x >= r; x += s) st.q.push(x);
    }
    dragView(c, st, function(type, p){
      if (type !== "down" || !lay) return false;
      /* barreau de l'échelle ? */
      for (var i = 0; i < 5; i++){ if (p.x > lay.lx0 - 30 && p.x < lay.lx1 + 6 && Math.abs(p.y - lay.ry[i]) < lay.gap * 0.42){ stopDemo(); go(i); return true; } }
      /* liaison du carbone ? */
      if (prLast && st.u >= 1){
        var best = null, bd = 16;
        oxCbonds(st.to).forEach(function(b){ var A = prLast[0], B = prLast[b.j], mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, d = Math.hypot(p.x - mx, p.y - my); if (d < bd){ bd = d; best = b; } });
        if (best){ stopDemo(); st.rev[best.j] = st.t; return true; }
      }
      return false;
    });
    st.onview = function(){ if (st.moved > 6){ st.spin = false; spT.set(false); } };
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.spin && !st.drag) st.a += dt * 0.45;
      if (st.u < 1){ st.u = Math.min(1, st.u + dt / 1.7); if (st.u >= 1){ st.from = st.to; } }
      else if (st.q.length){ st.from = st.to; st.to = st.q.shift(); st.u = 0; st.rev = {}; }
      if (st.demo && st.u >= 1 && !st.q.length){ st.dT += dt; if (st.dT > 2.6){ st.dT = 0; st.dir = st.dir || 1; if (st.to + st.dir > 4 || st.to + st.dir < 0) st.dir = -st.dir; go(st.to + st.dir); } }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, u = ease(st.u), r0 = st.from, r1 = st.to, cur = u < 0.5 ? r0 : r1;
      var Rc = OX.R[r1], moving = st.u < 1;
      /* décor : mur, sol, échelle appuyée */
      var gw = ctx.createLinearGradient(0, 0, 0, H); gw.addColorStop(0, "#f4f1ea"); gw.addColorStop(1, "#e4ddd0"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.strokeStyle = "rgba(190,175,150,.25)"; ctx.lineWidth = 1; for (var yb = 30; yb < H; yb += 30){ ctx.beginPath(); ctx.moveTo(0, yb); ctx.lineTo(W, yb); ctx.stroke(); } ctx.restore();
      var banH = ph ? 96 : 70, floorY = H - banH - 18;
      var gf = ctx.createLinearGradient(0, floorY, 0, H); gf.addColorStop(0, "#b48a5c"); gf.addColorStop(0.1, "#9a7247"); gf.addColorStop(1, "#6e5033"); ctx.fillStyle = gf; ctx.fillRect(0, floorY, W, H - floorY);
      ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(0, floorY, W, 2);
      var lx0 = W * (ph ? 0.12 : 0.11), lw = W * (ph ? 0.25 : 0.23), lx1 = lx0 + lw, top = ph ? 34 : 42, bot = floorY;
      var gap = (bot - 40 - (top + 24)) / 4, ry = []; for (var i = 0; i < 5; i++) ry.push(bot - 40 - i * gap);
      lay = {lx0:lx0, lx1:lx1, ry:ry, gap:gap};
      /* graduation n.o. sur le mur (bleu = réduit, rouge = oxydé) */
      var gs = ctx.createLinearGradient(0, ry[0], 0, ry[4]); gs.addColorStop(0, "#2a6fdb"); gs.addColorStop(0.5, "#8a95a3"); gs.addColorStop(1, "#c0392b");
      ctx.fillStyle = gs; rr(ctx, lx0 - (ph ? 26 : 34), ry[4] - 10, 6, ry[0] - ry[4] + 20, 3); ctx.fill();
      /* ombre et montants */
      floorShadow(ctx, (lx0 + lx1) / 2, floorY + 4, lw * 0.7, 6, 0.3);
      function rail(x0, x1){ var g = ctx.createLinearGradient(x0 - 6, 0, x0 + 6, 0); g.addColorStop(0, "#8a5a2b"); g.addColorStop(0.5, "#d9a66a"); g.addColorStop(1, "#7a4c22"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - 6, bot); ctx.lineTo(x1 - 5, top); ctx.lineTo(x1 + 5, top); ctx.lineTo(x0 + 6, bot); ctx.closePath(); ctx.fill(); }
      var sk = lw * 0.05;
      rail(lx0, lx0 + sk); rail(lx1, lx1 - sk);
      for (i = 0; i < 5; i++){
        var y = ry[i], f = (bot - y) / (bot - top), xa = lx0 + sk * f, xb = lx1 - sk * f, R = OX.R[i], on = i === cur;
        var gr = ctx.createLinearGradient(0, y - 6, 0, y + 6); gr.addColorStop(0, "#e2b57c"); gr.addColorStop(0.5, "#b9834a"); gr.addColorStop(1, "#7d5228");
        ctx.fillStyle = gr; rr(ctx, xa - 2, y - 5, xb - xa + 4, 10, 4); ctx.fill();
        /* plaque du barreau */
        var pw = Math.min(lw * 0.62, ph ? 64 : 82), px = xa + 8, py = y - 32;
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2; ctx.fillStyle = on ? "#ffffff" : "rgba(255,255,255,.82)"; rr(ctx, px, py, pw, 22, 6); ctx.fill(); ctx.restore();
        if (on){ ctx.strokeStyle = "#2a6fdb"; ctx.lineWidth = 2; rr(ctx, px, py, pw, 22, 6); ctx.stroke(); }
        label(ctx, R.f, px + pw / 2, py + 11, {size:fitSize(ctx, R.f, pw - 8, ph ? 12 : 13.5, 800), weight:800, col:"#13233a"});
        /* n.o. sur la graduation */
        var noc = R.no < 0 ? "#2a6fdb" : R.no > 0 ? "#c0392b" : "#5f6b7a", bx = lx0 - (ph ? 23 : 31);
        ctx.save(); ctx.fillStyle = "#fff"; ctx.strokeStyle = noc; ctx.lineWidth = on ? 2.6 : 1.6; ctx.beginPath(); ctx.arc(bx, y, ph ? 12 : 14, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
        label(ctx, (R.no > 0 ? "+" : R.no < 0 ? "−" : "") + Math.abs(R.no), bx, y, {size:ph ? 11 : 12.5, weight:800, col:noc});
      }
      label(ctx, "n.o.", lx0 - (ph ? 23 : 31), ry[4] - (ph ? 24 : 28), {size:ph ? 10 : 11, weight:800, col:"#5f6b7a"});
      if (!ph){ label(ctx, "oxydé", lx0 - 31, ry[4] - 46, {size:10.5, weight:800, col:"#c0392b"}); label(ctx, "réduit", lx0 - 31, ry[0] + 28, {size:10.5, weight:800, col:"#2a6fdb"}); }
      /* le grimpeur */
      var ys = lerp(ry[r0], ry[r1], u), fC = (bot - ys) / (bot - top), cx0 = lx1 - sk * fC - (ph ? 16 : 20);
      climber(ctx, cx0, ys - 5, ph ? 0.72 : 0.9, t, moving, OX.R[cur].no);
      /* molécule 3D */
      var mol = oxMix(r0, r1, u), mcx = W * (ph ? 0.69 : 0.67), avail = Math.min(W - lx1 - 16, floorY - 60), mcy = 40 + (floorY - 40) * 0.5;
      var V = {st:st, sc:Math.max(20, avail / 2 / (ph ? 1.85 : 2.2)), cx:mcx, cy:mcy};
      floorShadow(ctx, mcx, floorY - 8, avail * 0.4, 10, 0.18);
      var atoms = [], keyEl = ["C", "H", "H", "H", "H", "O", "O"];
      for (i = 0; i < 7; i++){
        var a = At(keyEl[i], mol.P[i], {alpha:mol.A[i]});
        if (moving){
          var leaving = OX.R[r0].A[i] > 0.5 && OX.R[r1].A[i] < 0.5, coming = OX.R[r0].A[i] < 0.5 && OX.R[r1].A[i] > 0.5;
          if (leaving || coming){ a.alpha = leaving ? 1 - ease(seg01(st.u, 0.45, 1)) : ease(seg01(st.u, 0, 0.5)); a.glow = a.el === "O" ? "rgba(214,57,47,.45)" : "rgba(255,200,40,.6)"; }
        }
        if (i === 0) a.lab = "C";
        atoms.push(a);
      }
      var bonds = mol.bonds.map(function(b){ var o = {a:b.a, b:b.b, o:b.o, dash:b.dash, alpha:b.alpha}; if (b.a === 0 && !moving && st.rev[b.b] != null) o.col = (b.b === 5 || b.b === 6) ? "#c0392b" : "#2a6fdb"; return o; });
      var pr = drawScene(c, V, atoms, bonds);
      prLast = pr;
      /* liaisons comptées : doublet attiré par l'atome le plus électronégatif + valeur */
      var cb = oxCbonds(r1), sum = 0, nrev = 0;
      if (!moving) cb.forEach(function(b){
        if (st.rev[b.j] == null) return;
        nrev++; sum += b.v;
        var A = pr[0], B = pr[b.j], age = clamp((t - st.rev[b.j]) / 0.5, 0, 1), toO = b.el === "O";
        var fx = toO ? 0.68 : 0.3, ex = lerp(A.x, B.x, lerp(0.5, fx, age)), ey = lerp(A.y, B.y, lerp(0.5, fx, age));
        var dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, ox = -dy / L * 5, oy = dx / L * 5;
        for (var e = 0; e < b.o; e++){ var sh = (e - (b.o - 1) / 2) * 12; var ex2 = ex + dx / L * sh, ey2 = ey + dy / L * sh; ball(ctx, ex2 + ox * 0.6, ey2 + oy * 0.6, 3.4, "#f2c230"); ball(ctx, ex2 - ox * 0.6, ey2 - oy * 0.6, 3.4, "#f2c230"); }
        var mx = lerp(A.x, B.x, 0.6) - oy * 2.6, my = lerp(A.y, B.y, 0.6) + ox * 2.6;
        badge(ctx, mx, my, (b.v > 0 ? "+" : "−") + Math.abs(b.v), toO ? "#c0392b" : "#2a6fdb", age, 11);
      });
      /* nom de la molécule en haut */
      var Rn = OX.R[cur];
      label(ctx, Rn.f + " · " + Rn.n, mcx, 18, {size:ph ? 13 : 15, weight:800, col:"#13233a", bg:"rgba(255,255,255,.88)"});
      if (!ph) label(ctx, "glisse pour tourner · clique sur une liaison du C", mcx, floorY - 22, {size:10.5, weight:700, col:"#7a6a55"});
      /* électrons qui partent (oxydation) ou arrivent (réduction) pendant le changement de barreau */
      if (moving){
        var upw = r1 > r0, k2 = Math.min(r0, r1), stp = OX.S[k2], ea = Math.sin(PI * st.u);
        for (var e2 = 0; e2 < 2; e2++){
          var ph2 = upw ? st.u : 1 - st.u, ex3 = lerp(mcx, mcx + (e2 ? 90 : 70) * (ph ? 0.7 : 1), ph2), ey3 = lerp(mcy, mcy - 110 * (ph ? 0.7 : 1) + e2 * 18, ph2);
          ball(ctx, ex3, ey3, 6, "#f2c230", ea); label(ctx, "e⁻", ex3, ey3 - 13, {size:11, weight:800, col:"#8a6d12", alpha:ea});
        }
        if (ph){ label(ctx, upw ? "oxydation :" : "réduction :", Math.min(mcx, W - 110), 38, {size:10.5, weight:800, col:upw ? "#c0392b" : "#2a6fdb", bg:"rgba(255,255,255,.9)", alpha:ea}); } label(ctx, ph ? (upw ? stp.mv : stp.mvR) : (upw ? "oxydation : " + stp.mv : "réduction : " + stp.mvR), ph ? Math.min(mcx, W - 110) : mcx, ph ? 54 : 44, {size:ph ? 10.5 : 12, weight:800, col:upw ? "#c0392b" : "#2a6fdb", bg:"rgba(255,255,255,.9)", alpha:ea});
      }
      /* bandeau */
      var title, s2, colB;
      if (st.flash && t - st.flash.t < 2.5){ title = OX.R[r1].f + " : bout de l'échelle"; s2 = st.flash.msg; colB = "#8a95a3"; }
      else if (moving || r0 !== r1 || st.lastStep != null){
        var lo = moving ? Math.min(r0, r1) : st.lastStep, upw2 = moving ? r1 > r0 : st.lastUp;
        if (moving){ st.lastStep = lo; st.lastUp = upw2; }
        var SS = OX.S[lo];
        title = upw2 ? SS.eq : SS.eq.split(" → ").reverse().join(" → ").replace(/^(.*) \+ 2 H⁺ \+ 2 e⁻ → (.*)$/, "$1 + 2 H⁺ + 2 e⁻ → $2");
        if (!upw2){ var parts = SS.eq.split(" → "), L1 = parts[0], R1 = parts[1].replace(" + 2 H⁺ + 2 e⁻", ""); title = R1 + " + 2 H⁺ + 2 e⁻ → " + L1; }
        s2 = (upw2 ? SS.ox : SS.red) + " Le carbone passe de " + oxNo(OX.R[upw2 ? lo : lo + 1].no) + " à " + oxNo(OX.R[upw2 ? lo + 1 : lo].no) + " : " + (upw2 ? "il perd" : "il gagne") + " 2 électrons.";
        colB = upw2 ? "#c0392b" : "#2a6fdb";
      } else { title = "Le carbone du méthane : n.o. −4, le plus réduit possible"; s2 = "Choisis un oxydant pour monter d'un barreau, ou clique sur les liaisons du carbone pour compter son nombre d'oxydation."; colB = "#2a6fdb"; }
      bannerBox(ctx, W, H - banH - 6, banH, title.replace(/−(\d)/g, "−$1"), s2.replace(/ (-)(\d)/g, " −$2"), colB, ph);
      /* lectures */
      var R2 = OX.R[r1];
      ro.set(0, R2.f + " (" + R2.n + ")");
      ro.set(1, (R2.no > 0 ? "+" : R2.no < 0 ? "−" : "") + Math.abs(R2.no));
      ro.set(2, nrev ? (sum > 0 ? "+" : sum < 0 ? "−" : "") + Math.abs(sum) + " (" + nrev + " liaison" + (nrev > 1 ? "s" : "") + " sur " + cb.length + ")" : "clique sur une liaison");
      ro.set(3, (R2.no + 4) + " e⁻");
      ro.set(4, R2.dcH ? F(R2.dcH, 0) + " kJ/mol" + (R2.f === "HCHO" ? " (gaz)" : "") : "0 (déjà brûlé)");
      var det = cb.map(function(b){ return (b.el === "H" ? "C–H" : b.o === 2 ? "C=O" : "C–O") + " : " + (b.v > 0 ? "+" : "−") + Math.abs(b.v); });
      var cnt = {}; det.forEach(function(d){ cnt[d] = (cnt[d] || 0) + 1; });
      var detS = Object.keys(cnt).map(function(d){ return (cnt[d] > 1 ? cnt[d] + " × (" + d + ")" : d); }).join(" ; ");
      nt.set("<b>" + R2.f + "</b> : " + detS + " → n.o. = " + (R2.no > 0 ? "+" : R2.no < 0 ? "−" : "") + Math.abs(R2.no) + ". χ : O 3,44 > C 2,55 > H 2,20, donc le doublet d'une liaison C–H va au carbone (−1) et celui d'une liaison C–O à l'oxygène (+1 par trait). " + (R2.no > -4 ? "De CH₄ à " + R2.f + ", le carbone a perdu " + (R2.no + 4) + " électrons. " : "C'est le carbone le plus réduit possible. ") + (R2.dcH ? "Combustion de 1 mol " + (/^[aeiouéh]/.test(R2.n) ? "d'" : "de ") + R2.n + " : ΔcH° = " + F(R2.dcH, 0) + " kJ (eau liquide" + (R2.f === "HCHO" ? " ; valeur du méthanal gazeux, son état standard à 25 °C" : "") + ")." : "CO₂ ne brûle plus : son carbone est au maximum."), nrev === cb.length && cb.length ? "ok" : "");
    });
  }
});

/* ====================================================================== */
/* 3. NAD⁺ emporte un hydrure : l'éthanol dans le foie                      */
/* ====================================================================== */
/* images clés : positions P, opacités A, liaisons B [i, j, ordre, style], charges bdg {i:"+"}, halos glw {i:1} */
function kfMix(A, B, u){
  var P = A.P.map(function(p, i){ return lerp3(p, B.P[i], u); });
  var al = A.A.map(function(a, i){ return lerp(a, B.A[i], u); });
  var key = function(b){ return Math.min(b[0], b[1]) + "-" + Math.max(b[0], b[1]); }, mA = {}, mB = {}, bonds = [], seen = {};
  A.B.forEach(function(b){ mA[key(b)] = b; }); B.B.forEach(function(b){ mB[key(b)] = b; });
  Object.keys(mA).concat(Object.keys(mB)).forEach(function(k2){
    if (seen[k2]) return; seen[k2] = 1; var a = mA[k2], b = mB[k2], x = a || b;
    var sty = function(z){ return z[3] === "co" ? {dash:true, col:"#8e7cc3", w:0.6} : {}; };
    if (a && b){ var o = {a:x[0], b:x[1], o:u < 0.5 ? a[2] : b[2]}, s1 = sty(u < 0.5 ? a : b); for (var q in s1) o[q] = s1[q]; if (a[2] !== b[2] && u > 0.04 && u < 0.96) o.dash = true; bonds.push(o); }
    else { var z = a || b, o2 = {a:z[0], b:z[1], o:z[2], alpha:a ? 1 - ease(u * 1.5) : ease(u * 1.5 - 0.5), dash:a ? u > 0.04 : u < 0.96}, s2 = sty(z); for (var q2 in s2) o2[q2] = s2[q2]; bonds.push(o2); }
  });
  var badges = {};
  [[A.bdg || {}, 1 - u], [B.bdg || {}, u]].forEach(function(L){ Object.keys(L[0]).forEach(function(i){ var s = L[0][i]; if (!badges[i]) badges[i] = {t:s, a:0}; if (badges[i].t === s) badges[i].a += L[1]; else if (L[1] > 0.5) badges[i] = {t:s, a:L[1]}; }); });
  var glow = {};
  [[A.glw || {}, 1 - u], [B.glw || {}, u]].forEach(function(L){ Object.keys(L[0]).forEach(function(i){ glow[i] = (glow[i] || 0) + L[1]; }); });
  return {P:P, A:al, bonds:bonds, badges:badges, glow:glow, arom:lerp(A.arom, B.arom, u)};
}
var NADG = (function(){
  var rr0 = 1.39, ring = [];
  function rdir(deg){ return [Math.cos(deg * DEG), 0, Math.sin(deg * DEG)]; }
  [180, 120, 60, 0, 300, 240].forEach(function(d){ ring.push(mul(rdir(d), rr0)); });   /* N1, C2, C3, C4, C5, C6 */
  var Y = [0, 1, 0], c4 = ring[3], r4 = rdir(0), h = 54.75 * DEG;
  var H4ox = add(c4, mul(r4, 1.08)), H4red = add(c4, mul(nrm(add(mul(r4, Math.cos(h)), mul(Y, -Math.sin(h)))), 1.09)), Hnew = add(c4, mul(nrm(add(mul(r4, Math.cos(h)), mul(Y, Math.sin(h)))), 1.09));
  var C7 = add(ring[2], mul(rdir(60), 1.49)), back = rdir(240), dO = rotAx(back, Y, -120 * DEG), dN = rotAx(back, Y, 120 * DEG);
  /* l'oxygène du carboxamide du côté de C2, le NH2 du côté de C4 */
  if (len(sub(add(C7, dO), ring[1])) > len(sub(add(C7, dN), ring[1]))){ var tmp = dO; dO = dN; dN = tmp; }
  var O7 = add(C7, mul(dO, 1.23)), N7 = add(C7, mul(dN, 1.34)), bN = nrm(sub(C7, N7));
  var H7a = add(N7, mul(rotAx(bN, Y, 120 * DEG), 1.01)), H7b = add(N7, mul(rotAx(bN, Y, -120 * DEG), 1.01));
  var base = [ring[0], ring[1], ring[2], ring[3], ring[4], ring[5], add(ring[1], mul(rdir(120), 1.08)), null, add(ring[4], mul(rdir(300), 1.08)), add(ring[5], mul(rdir(240), 1.08)), C7, O7, N7, H7a, H7b, add(ring[0], mul(rdir(180), 1.6))];
  function part(red){ var P = base.slice(); P[7] = red ? H4red : H4ox; return P; }
  var bOx = [[0, 1, 1.5], [1, 2, 1.5], [2, 3, 1.5], [3, 4, 1.5], [4, 5, 1.5], [5, 0, 1.5], [1, 6, 1], [3, 7, 1], [4, 8, 1], [5, 9, 1], [2, 10, 1], [10, 11, 2], [10, 12, 1], [12, 13, 1], [12, 14, 1], [0, 15, 1]];
  var bRed = [[0, 1, 1], [1, 2, 2], [2, 3, 1], [3, 4, 1], [4, 5, 2], [5, 0, 1]].concat(bOx.slice(6));
  return {part:part, bOx:bOx, bRed:bRed, Hnew:Hnew, ring:ring};
})();
function methylH(c, cPrev, ref){ return tetra3(nrm(sub(cPrev, c)), ref).map(function(d){ return add(c, mul(d, 1.09)); }); }
/* étape 1 (ADH) : 16 C1, 17 O, 18 H de O–H, 19 C2, 20-22 H du CH₃, 23 H du C1, 24 H transféré (hydrure), 25 Zn²⁺, 26 His */
function nadStage1(){
  var C1 = [2.0, 3.4, 0], U = [0, -1, 0], T = tetra3(U, [1, 0, 0]), dO = T[0], dC = T[1], dH = T[2];
  var His = [2.6, 5.7, -1.9], Zn = [5.3, 3.5, 0.6];
  function sub1(shift, ald, depro){
    var c1 = add(C1, shift), P = [];
    var fO = ald ? nrm([dO[0], 0, dO[2]]) : dO, fC = ald ? nrm([dC[0], 0, dC[2]]) : dC, fH = ald ? nrm([dH[0], 0, dH[2]]) : dH;
    var O = add(c1, mul(fO, ald ? 1.21 : 1.43)), C2 = add(c1, mul(fC, ald ? 1.50 : 1.53)), Hm = methylH(C2, c1, [0, 1, 0]);
    var HO = depro ? add(His, mul(nrm(sub(O, His)), 1.02)) : add(O, mul(nrm(sub(His, O)), 0.96));
    P[16] = c1; P[17] = O; P[18] = HO; P[19] = C2; P[20] = Hm[0]; P[21] = Hm[1]; P[22] = Hm[2]; P[23] = add(c1, mul(fH, ald ? 1.10 : 1.09));
    P[24] = add(c1, mul(U, 1.09)); P[25] = Zn; P[26] = His;
    return P;
  }
  function F(shift, ald, depro, red, zn, extra){
    var P = NADG.part(red), S1 = sub1(shift, ald, depro); for (var i = 16; i < 27; i++) P[i] = S1[i];
    if (red) P[24] = NADG.Hnew;
    var B = (red ? NADG.bRed : NADG.bOx).slice();
    B.push([16, 17, ald ? 2 : 1], [16, 19, 1], [19, 20, 1], [19, 21, 1], [19, 22, 1], [16, 23, 1]);
    B.push(red ? [3, 24, 1] : [16, 24, 1]);
    B.push(depro ? [26, 18, 1] : [17, 18, 1]);
    if (zn) B.push([17, 25, 1, "co"]);
    var A = []; for (i = 0; i < 27; i++) A[i] = 1;
    var bdg = {}; if (!red) bdg[0] = "+"; if (depro && !ald) bdg[17] = "−"; if (depro) bdg[26] = "+";
    var o = {P:P, A:A, B:B, bdg:bdg, glw:{}, arom:red ? 0 : 1}; if (extra) extra(o); return o;
  }
  var up = [0.6, 1.8, 0];
  return [
    F(up, false, false, false, false),
    F([0, 0, 0], false, false, false, true),
    F([0, 0, 0], false, true, false, true, function(o){ o.glw[24] = 1; }),
    F([0, 0, 0], true, true, true, true, function(o){ o.glw[24] = 1; }),
    F(up, true, true, true, false)
  ];
}
/* étape 2 (ALDH) : 16 C1, 17 O, 18 S (Cys), 19 C2, 20-22 H du CH₃, 23 O de l'eau, 24 H transféré, 25-26 inutilisés */
function nadStage2(){
  var C1 = [2.0, 3.4, 0], U = [0, -1, 0], sp2O = [0.866, 0.5, 0], sp2C = [-0.866, 0.5, 0];
  var T = tetra3(U, [0, 0, 1]), dS = T[0], tO = T[2], tC = T[1];
  if (tO[0] < 0){ var tmp = tO; tO = tC; tC = tmp; }
  function F(kind, red, extra){
    var P = NADG.part(red), c1 = kind === "free" || kind === "out" ? add(C1, [0.4, 1.6, 0]) : C1, dOx, dCx, Sx, Ow, Lo = 1.21, Lc = 1.50;
    if (kind === "ald" || kind === "free"){ dOx = sp2O; dCx = sp2C; Sx = add(C1, [0.2, 0.6, 3.4]); Ow = add(c1, [-0.4, 1.8, -3.0]); }
    else if (kind === "thio"){ dOx = tO; dCx = tC; Lo = 1.40; Lc = 1.53; Sx = add(c1, mul(dS, 1.82)); Ow = add(c1, [-0.4, 1.8, -3.0]); }
    else if (kind === "thioester"){ dOx = nrm([tO[0], 0, tO[2]]); dCx = nrm([tC[0], 0, tC[2]]); Sx = add(c1, mul(nrm([dS[0], 0, dS[2]]), 1.78)); Ow = add(c1, [-0.4, 1.8, -3.0]); }
    else { dOx = nrm([tO[0], 0, tO[2]]); dCx = nrm([tC[0], 0, tC[2]]); Lo = 1.26; Sx = add(C1, [-0.6, 0.4, 3.6]); Ow = add(c1, mul(nrm([dS[0], 0, dS[2]]), 1.26)); }
    P[16] = c1; P[17] = add(c1, mul(dOx, Lo)); P[18] = Sx; P[19] = add(c1, mul(dCx, Lc));
    var Hm = methylH(P[19], c1, [0, 1, 0]); P[20] = Hm[0]; P[21] = Hm[1]; P[22] = Hm[2];
    P[23] = Ow; P[24] = red ? NADG.Hnew : add(c1, mul(U, 1.10)); P[25] = [6, 6, 0]; P[26] = [6, 6, 0];
    var B = (red ? NADG.bRed : NADG.bOx).slice();
    B.push([16, 19, 1], [19, 20, 1], [19, 21, 1], [19, 22, 1]);
    B.push(red ? [3, 24, 1] : [16, 24, 1]);
    var A = []; for (var i = 0; i < 27; i++) A[i] = 1; A[25] = 0; A[26] = 0;
    var bdg = {}; if (!red) bdg[0] = "+";
    if (kind === "ald" || kind === "free"){ B.push([16, 17, 2]); A[23] = 0; }
    else if (kind === "thio"){ B.push([16, 17, 1], [16, 18, 1]); bdg[17] = "−"; A[23] = 0; }
    else if (kind === "thioester"){ B.push([16, 17, 2], [16, 18, 1]); A[23] = 0; }
    else { B.push([16, 17, 2], [16, 23, 1]); bdg[23] = "−"; }
    var o = {P:P, A:A, B:B, bdg:bdg, glw:{}, arom:red ? 0 : 1}; if (extra) extra(o); return o;
  }
  return [F("ald", false), F("thio", false, function(o){ o.glw[24] = 1; }), F("thioester", true, function(o){ o.glw[24] = 1; }), F("acetate", true), F("out", true)];
}
var NAD_K = {adh:nadStage1(), aldh:nadStage2()};
/* déroulement : [début, fin] de chaque transition entre images clés, flèches affichées avant, durée totale */
var NAD_T = {
  adh:{seg:[[0, 1.6], [2.2, 3.4], [5.4, 7.2], [8.8, 10.0]], arr:[[3.6, 5.4, 0]], end:11.8},
  aldh:{seg:[[1.2, 2.4], [4.6, 6.4], [7.6, 9.0], [10.0, 11.2]], arr:[[0.1, 1.2, 0], [2.8, 4.6, 1]], end:13}
};
var NAD_ARROWS = {
  adh:[[{a:17, b:[16, 17], bend:-22}, {a:[16, 24], b:3, bend:26}, {a:[2, 3], b:[1, 2], bend:-24}, {a:[0, 1], b:0, bend:22}]],
  aldh:[[{a:18, b:16, bend:22}, {a:[16, 17], b:17, bend:-22}], [{a:17, b:[16, 17], bend:-22}, {a:[16, 24], b:3, bend:26}, {a:[2, 3], b:[1, 2], bend:-24}, {a:[0, 1], b:0, bend:22}]]
};
function nadFrame(stage, t){
  var K = NAD_K[stage], T = NAD_T[stage], i;
  for (i = 0; i < T.seg.length; i++){
    var s = T.seg[i];
    if (t < s[0]) return {f:kfMix(K[i], K[i], 0), k:i, mov:false};
    if (t <= s[1]) return {f:kfMix(K[i], K[i + 1], ease((t - s[0]) / (s[1] - s[0]))), k:i, mov:true, u:(t - s[0]) / (s[1] - s[0])};
  }
  return {f:kfMix(K[K.length - 1], K[K.length - 1], 0), k:K.length - 1, mov:false};
}
var NAD_M = {EtOH:2 * 12.011 + 6 * 1.008 + 15.999, MeCHO:2 * 12.011 + 4 * 1.008 + 15.999};
SFA.sim({
  id:"org-nad-hydrure-3d", ch:"c08", tag:"Oxydoréduction du vivant",
  titre:"NAD⁺ emporte un hydrure : l'éthanol dans le foie",
  resume:"Le cycle nicotinamide de NAD⁺ en 3D face à l'éthanol, dans le site de l'alcool déshydrogénase : un ion hydrure (1 H⁺ + 2 e⁻) passe d'un carbone à l'autre et le cycle perd son aromaticité. Puis la seconde oxydation : éthanal (toxique) → acétate.",
  but:"Regarde le site de l'enzyme : en bas, le cycle nicotinamide de NAD⁺ (la partie qui réagit ; R = le reste de la molécule, ribose et ADP) ; en haut, l'éthanol, accroché par son O à l'ion Zn²⁺. (1) Une histidine prend le H⁺ du groupe –OH. (2) Les flèches courbes montrent le transfert : le H du carbone part avec ses deux électrons (un hydrure H⁻) vers le carbone C4 du cycle. Le nuage aromatique (en violet) disparaît : NAD⁺ devient NADH. Choisis l'étape 2 pour l'aldéhyde déshydrogénase. Glisse pour tourner la scène.",
  aRetenir:"NAD⁺ est un oxydant : il accepte un ion hydrure H⁻ (un proton et deux électrons) sur le carbone C4 de son cycle nicotinamide. Le cycle pyridinium, aromatique et chargé +, devient une 1,4-dihydropyridine, neutre et non aromatique : NAD⁺ + 2 e⁻ + H⁺ → NADH. Le substrat perd en tout 2 H (H⁻ vers NAD⁺, H⁺ vers une base) : c'est une oxydation à 2 électrons. Dans le foie : éthanol (C1 à −1) → éthanal (+1) par l'alcool déshydrogénase, puis éthanal → acétate (+3) par l'aldéhyde déshydrogénase. Chaque étape fournit un NADH. Bilan : C₂H₅OH + 2 NAD⁺ + H₂O → CH₃COO⁻ + 2 NADH + 3 H⁺.",
  piege:"L'hydrure n'est pas un « H tout seul » : c'est un noyau H avec DEUX électrons ; le proton du –OH part séparément, vers une base. On écrit NADH + H⁺, pas NADH₂. C'est le carbone C4 du cycle (en face de l'azote) qui reçoit H⁻, pas l'azote. Et l'éthanal, plus toxique que l'éthanol, s'accumule si l'aldéhyde déshydrogénase est lente (variante génétique fréquente en Asie de l'Est, ou médicament comme le disulfirame) : rougeur, nausées.",
  build:function(k, S){
    var c = respCanvas(k, 0.95, 1.38), st = {a:0.55, b:0.32, bmin:-0.6, bmax:1.3, t:0, play:true, clk:0};
    var eS = k.seg("Enzyme", [["adh", "1 · ADH : éthanol → éthanal"], ["aldh", "2 · ALDH : éthanal → acétate"]], "adh", function(){ st.t = 0; st.play = true; });
    var chT = k.toggle("Enchaîner les deux oxydations", true);
    var nS = k.slider("Alcool bu (verres standard de 10 g d'éthanol)", 1, 6, 1, 1, "verre");
    k.button("Recommencer", function(){ st.t = 0; st.play = true; eS.set("adh"); }, true);
    var pB = k.button("Pause", function(){ st.play = !st.play; pB.textContent = st.play ? "Pause" : "Lecture"; });
    var ro = k.readouts(["Étape en cours", "n.o. du carbone C1", "e⁻ cédés depuis l'éthanol", "Cycle nicotinamide", "Pour tes verres : éthanol · NADH"]);
    var nt = k.note("", "ok");
    dragView(c, st);
    var lp = k.loop(function(dt){
      st.clk += dt;
      if (st.play){ st.t += dt; var T = NAD_T[eS.value]; if (st.t > T.end){ st.t = 0; if (chT.value) eS.set(eS.value === "adh" ? "aldh" : "adh"); } }
      if (!st.drag) st.a += dt * 0.06 * Math.sin(st.clk * 0.25);
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, stg = eS.value, fr = nadFrame(stg, st.t), M = fr.f, t = st.clk;
      /* décor : intérieur d'une cellule du foie, poche de l'enzyme */
      bgScene(ctx, W, H, "#fff8f1", "#f0dcca");
      var banH = ph ? 96 : 70, area = H - banH - 12;
      ctx.save();
      for (var b = 0; b < 3; b++){
        var gx = W * (0.15 + 0.35 * b), gy = area * (b === 1 ? 0.12 : 0.9), gr = Math.max(W, area) * 0.42;
        var gp = ctx.createRadialGradient(gx, gy, gr * 0.2, gx, gy, gr); gp.addColorStop(0, "rgba(214,150,120,.32)"); gp.addColorStop(1, "rgba(214,150,120,0)");
        ctx.fillStyle = gp; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, 7); ctx.fill();
      }
      /* hélices de la protéine (rubans) */
      [[0.04, 0.2, 0.42, 0.06, "#e3a37a"], [0.62, 0.86, 0.98, 0.7, "#c98ab0"], [0.0, 0.78, 0.3, 0.98, "#9fb7d9"]].forEach(function(hx, j){
        var x0 = W * hx[0], y0 = area * hx[1], x1 = W * hx[2], y1 = area * hx[3], n = 60, L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
        for (var side = 0; side < 2; side++){
          ctx.beginPath();
          for (var q = 0; q <= n; q++){ var f = q / n, ph2 = f * 9 * PI + t * 0.3 + j, w = 9 * Math.sin(ph2); ctx.lineTo(lerp(x0, x1, f) + nx * w, lerp(y0, y1, f) + ny * w); }
          ctx.strokeStyle = rgba(hx[4], side ? 0.25 : 0.45); ctx.lineWidth = side ? 12 : 6; ctx.lineCap = "round"; ctx.stroke();
        }
      });
      ctx.restore();
      label(ctx, stg === "adh" ? "site actif de l'alcool déshydrogénase (ADH)" : "site actif de l'aldéhyde déshydrogénase (ALDH)", 12, 16, {size:ph ? 10.5 : 11.5, weight:800, col:"#8a4b2b", align:"left", bg:"rgba(255,255,255,.75)"});
      if (!ph) label(ctx, "glisse pour tourner", W - 12, 16, {size:10.5, weight:700, col:"#9a7a66", align:"right"});
      /* scène 3D */
      var V = {st:st, sc:Math.max(18, Math.min(W * (ph ? 0.115 : 0.085), area / 7.6)), cx:W * (ph ? 0.46 : 0.47), cy:24 + (area - 24) * 0.5};
      var el1 = ["N", "C", "C", "C", "C", "C", "H", "H", "H", "H", "C", "O", "N", "H", "H", "R", "C", "O", stg === "adh" ? "H" : "S", "C", "H", "H", "H", stg === "adh" ? "H" : "O", "H", stg === "adh" ? "Zn" : "H", stg === "adh" ? "N" : "H"];
      var atoms = M.P.map(function(p, i){
        var a = At(el1[i], [p[0] - 1.1, p[1] - 2.4, p[2]], {alpha:M.A[i]});
        if (i === 15){ a.lab = "R"; a.r = 0.72; }
        if (i === 25 && stg === "adh"){ a.lab = "Zn"; a.r = 0.62; }
        if (i === 26 && stg === "adh"){ a.col = "#3e6fd8"; a.r = 0.6; }
        if (i === 18 && stg === "aldh"){ a.lab = "S"; }
        if (i === 3){ a.ring = "rgba(42,111,219,.55)"; }
        var bd = M.badges[i]; if (bd && bd.a > 0.05){ a.badge = bd.t; a.badgeA = bd.a; a.badgeCol = bd.t === "+" ? "#c0392b" : "#2a56c6"; }
        if (M.glow[i] > 0.05) a.glow = "rgba(255,196,40," + (0.75 * M.glow[i]) + ")";
        return a;
      });
      /* nuage π aromatique : deux anneaux au-dessus et au-dessous du plan du cycle */
      var extra = [];
      if (M.arom > 0.02){
        [0.62, -0.62].forEach(function(yy){
          for (var q = 0; q < 18; q++){
            var an = q / 18 * 2 * PI, P3 = [Math.cos(an) * 1.39 - 1.1, yy - 2.4, Math.sin(an) * 1.39], P = proj3(P3, st, V.sc, V.cx, V.cy), R = 0.55 * V.sc * P.s;
            (function(P, R){ extra.push({z:P.z - 0.02, f:function(){ var g = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, R); g.addColorStop(0, "rgba(138,99,210," + (0.32 * M.arom) + ")"); g.addColorStop(1, "rgba(138,99,210,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, R, 0, 7); ctx.fill(); }}); })(P, R);
          }
        });
      }
      var pr = drawScene(c, V, atoms, M.bonds, extra);
      /* flèches courbes (mouvement des doublets) avant chaque transfert */
      NAD_T[stg].arr.forEach(function(A){
        var al = Math.min(seg01(st.t, A[0], A[0] + 0.4), 1 - seg01(st.t, A[1] - 0.15, A[1] + 0.25));
        if (al <= 0.03) return;
        NAD_ARROWS[stg][A[2]].forEach(function(R){
          var P0 = Array.isArray(R.a) ? {x:(pr[R.a[0]].x + pr[R.a[1]].x) / 2, y:(pr[R.a[0]].y + pr[R.a[1]].y) / 2, r:2} : pr[R.a], P1 = Array.isArray(R.b) ? {x:(pr[R.b[0]].x + pr[R.b[1]].x) / 2, y:(pr[R.b[0]].y + pr[R.b[1]].y) / 2, r:2} : pr[R.b];
          var dx = P1.x - P0.x, dy = P1.y - P0.y, L = Math.hypot(dx, dy) || 1, r0 = (P0.r || 2) + 3, r1 = (P1.r || 2) + 4;
          if (L < r0 + r1 + 6) return;
          curly(ctx, P0.x + dx / L * r0, P0.y + dy / L * r0, P1.x - dx / L * r1, P1.y - dy / L * r1, R.bend, "#13233a", al);
        });
      });
      /* hydrure en route : deux électrons qui accompagnent le H */
      var moveH = fr.mov && ((stg === "adh" && fr.k === 2) || (stg === "aldh" && fr.k === 1));
      if (moveH){ var ph3 = pr[24]; for (var e = 0; e < 2; e++){ var an2 = t * 6 + e * PI; ball(ctx, ph3.x + Math.cos(an2) * (ph3.r + 6), ph3.y + Math.sin(an2) * (ph3.r + 6), 3.6, "#f2c230"); } label(ctx, "H⁻ = H⁺ + 2 e⁻", ph3.x + 16, ph3.y - 18, {size:ph ? 11 : 12, weight:800, col:"#8a6d12", align:"left", bg:"rgba(255,255,255,.9)"}); }
      /* étiquettes */
      var red = M.arom < 0.5, pR = pr[15];
      label(ctx, red ? "NADH" : "NAD⁺", Math.max(30, pR.x), Math.min(area - 30, pR.y + pR.r + 14), {size:ph ? 12 : 13.5, weight:800, col:red ? "#2a6fdb" : "#c0392b", bg:"rgba(255,255,255,.88)"});
      var subN = stg === "adh" ? (fr.k >= 3 || (fr.k === 2 && fr.mov && fr.u > 0.5) ? "éthanal" : "éthanol") : (fr.k >= 3 || (fr.k === 2 && fr.mov && fr.u > 0.5) ? "acétate" : fr.k >= 1 ? (fr.k === 1 && !(fr.mov && fr.u > 0.5) ? "thiohémiacétal" : "thioester") : "éthanal");
      if (stg === "aldh" && fr.k === 0 && fr.mov && fr.u > 0.5) subN = "thiohémiacétal";
      var pC = pr[19]; label(ctx, subN, pC.x - pC.r - 8, pC.y - 6, {size:ph ? 12 : 13.5, weight:800, col:"#13233a", align:"right", bg:"rgba(255,255,255,.88)"});
      var p4 = pr[3]; label(ctx, "C4", p4.x - p4.r - 14, p4.y + 4, {size:10.5, weight:800, col:"#2a6fdb", bg:"rgba(255,255,255,.8)"});
      if (stg === "adh"){ var pHs = pr[26]; label(ctx, "His", pHs.x - pHs.r - 6, pHs.y, {size:10.5, weight:800, col:"#2a56c6", align:"right", bg:"rgba(255,255,255,.8)"}); }
      if (stg === "aldh"){ var pS = pr[18]; label(ctx, "Cys", pS.x + pS.r + 6, pS.y, {size:10.5, weight:800, col:"#8a6d12", align:"left", bg:"rgba(255,255,255,.8)"}); }
      label(ctx, M.arom > 0.5 ? "cycle aromatique (6 e⁻ π)" : "cycle non aromatique", W - 12, area - 8, {size:ph ? 10.5 : 11.5, weight:800, col:M.arom > 0.5 ? "#7a4fc0" : "#5f6b7a", align:"right", bg:"rgba(255,255,255,.85)"});
      /* bandeau */
      var title, s2, col;
      if (stg === "adh"){
        title = "CH₃–CH₂–OH + NAD⁺ → CH₃–CHO + NADH + H⁺";
        s2 = st.t < 1.8 ? "L'éthanol entre dans le site : son O se lie à l'ion Zn²⁺, son H tourné vers C4 du cycle de NAD⁺." :
          st.t < 3.5 ? "Une histidine (par un relais d'eau et de sérine) arrache le H⁺ du groupe –OH : il se forme un ion alcoolate R–O⁻." :
          st.t < 7.2 ? "Les flèches : le doublet de O⁻ forme C=O ; la liaison C–H part avec ses deux électrons (hydrure H⁻) vers C4 ; les électrons du cycle remontent jusqu'à l'azote." :
          st.t < 8.8 ? "C4 porte maintenant deux H : le cycle a perdu son aromaticité et sa charge +. NAD⁺ est réduit en NADH, l'éthanol est oxydé en éthanal." :
          "L'éthanal (toxique) quitte l'ADH ; il sera oxydé à son tour par l'aldéhyde déshydrogénase (étape 2).";
        col = "#c0392b";
      } else {
        title = "CH₃–CHO + NAD⁺ + H₂O → CH₃–COO⁻ + NADH + 2 H⁺";
        s2 = st.t < 2.5 ? "Le soufre d'une cystéine de l'enzyme attaque le carbone du C=O : il se forme un thiohémiacétal, dont le C porte encore un H." :
          st.t < 6.4 ? "Comme dans l'étape 1 : O⁻ reforme C=O et le H du carbone part en hydrure vers C4 d'un nouveau NAD⁺. Il reste un thioester, accroché à l'enzyme." :
          st.t < 9.2 ? "Une molécule d'eau hydrolyse le thioester : la cystéine est libérée et il se forme l'ion acétate CH₃COO⁻." :
          "L'acétate quitte l'enzyme ; il rejoint l'acétyl-CoA puis le cycle de Krebs. Deux NADH ont été produits depuis l'éthanol.";
        col = "#6a4fc0";
      }
      bannerBox(ctx, W, H - banH - 6, banH, title, s2, col, ph);
      /* lectures */
      var noC = stg === "adh" ? (fr.k >= 3 || (fr.k === 2 && fr.mov && fr.u > 0.5) ? 1 : -1) : (fr.k >= 2 || (fr.k === 1 && fr.mov && fr.u > 0.5) ? 3 : 1);
      var eTot = stg === "adh" ? (noC === 1 ? 2 : 0) : (noC === 3 ? 4 : 2);
      var nE = nS.value * 10 / NAD_M.EtOH;
      ro.set(0, stg === "adh" ? "éthanol → éthanal (ADH)" : "éthanal → acétate (ALDH)");
      ro.set(1, (noC > 0 ? "+" : "−") + Math.abs(noC) + " (" + subN + ")");
      ro.set(2, eTot + " e⁻ → " + (eTot / 2) + " NADH");
      ro.set(3, M.arom > 0.5 ? "aromatique (NAD⁺)" : "non aromatique (NADH)");
      ro.set(4, F(nE, 3) + " mol · " + F(2 * nE, 3) + " mol");
      nt.set("Pour " + nS.value + " verre" + (nS.value > 1 ? "s" : "") + " (" + (10 * nS.value) + " g d'éthanol, M = " + F(NAD_M.EtOH, 2) + " g/mol) : n = " + F(10 * nS.value, 0) + " / " + F(NAD_M.EtOH, 2) + " = " + F(nE, 3) + " mol. L'ADH en fait " + F(nE, 3) + " mol d'éthanal (" + F(nE * NAD_M.MeCHO, 1) + " g, M = " + F(NAD_M.MeCHO, 2) + " g/mol) et " + F(nE, 3) + " mol de NADH ; l'ALDH en ajoute autant : " + F(2 * nE, 3) + " mol de NADH en tout. n.o. du carbone fonctionnel : −1 (alcool) → +1 (aldéhyde) → +3 (acétate), soit 2 électrons par étape. Dans l'ALDH, ce carbone passe par un thioester (liaison C–S avec une cystéine) ; χ(S) ≈ χ(C) : par convention, le doublet C–S est attribué à S, et ce carbone est déjà à +3. <i>Géométrie simplifiée : seul le cycle nicotinamide est détaillé ; le relais de protons de l'ADH (sérine, eau, histidine) est résumé par « His ».</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 4. Hydrogénation sur la surface du métal                                 */
/* ====================================================================== */
/* atomes de la molécule (repère local, cycle à plat dans le plan xz, y vers le haut) :
   0-5 C1…C6, 6 C du CH₃ sur C1, 7 C du CH₃ sur C2, 8-10 et 11-13 H des CH₃, 14-21 H des CH₂ (C3…C6), 22 Ha (→ C1), 23 Hb (→ C2) */
var HY = (function(){
  var ang = [90, 30, 330, 270, 210, 150], Rr = 1.446;
  function ringPos(ys, shrink){
    var P = ang.map(function(a, k){ return [Rr * Math.cos(a * DEG), ys[k], Rr * Math.sin(a * DEG)]; });
    if (shrink){ var m = mul(add(P[0], P[1]), 0.5), d = nrm(sub(P[1], P[0])); P[0] = add(m, mul(d, -0.67)); P[1] = add(m, mul(d, 0.67)); }
    return P;
  }
  function subst(P, k){ var n1 = P[(k + 5) % 6], n2 = P[(k + 1) % 6], c = P[k]; var pr = sp3pair(sub(n1, c), sub(n2, c)); return Math.abs(pr[0][1]) > Math.abs(pr[1][1]) ? {ax:pr[0], eq:pr[1]} : {ax:pr[1], eq:pr[0]}; }
  function fill(P, opt){
    var A = P.slice(), i;
    var m1, m2;
    if (opt.sp2){
      m1 = nrm(mul(add(nrm(sub(P[1], P[0])), nrm(sub(P[5], P[0]))), -1)); m2 = nrm(mul(add(nrm(sub(P[0], P[1])), nrm(sub(P[2], P[1]))), -1));
      A[6] = add(P[0], mul(m1, 1.50)); A[7] = add(P[1], mul(m2, 1.50));
    } else {
      var s1 = subst(P, 0), s2 = subst(P, 1);
      A[6] = add(P[0], mul(s1.ax, 1.53)); A[7] = add(P[1], mul(s2.eq, 1.53));
      A[22] = add(P[0], mul(s1.eq, 1.09)); A[23] = add(P[1], mul(s2.ax, 1.09));
    }
    methylH(A[6], P[0], [0, 0, 1]).forEach(function(h, q){ A[8 + q] = h; });
    methylH(A[7], P[1], [0, 0, 1]).forEach(function(h, q){ A[11 + q] = h; });
    for (i = 2; i < 6; i++){ var sb = subst(P, i); A[14 + (i - 2) * 2] = add(P[i], mul(sb.ax, 1.09)); A[15 + (i - 2) * 2] = add(P[i], mul(sb.eq, 1.09)); }
    if (opt.sp2){ A[22] = add(P[0], [0, -1.25, 0]); A[23] = add(P[1], [0, -1.25, 0]); }
    return A;
  }
  var alk = fill(ringPos([0, 0, 0, 0.35, -0.35, 0], true), {sp2:true});
  var prod = fill(ringPos([0.25, -0.25, 0.25, -0.25, 0.25, -0.25], false), {sp2:false});
  /* intermédiaire semi-hydrogéné : C1 a reçu Ha, C2 est encore lié à la surface */
  var mid = alk.map(function(p, i){ return lerp3(p, prod[i], 0.5); }); mid[22] = prod[22]; mid[6] = lerp3(alk[6], prod[6], 0.8); mid[23] = alk[23];
  var bonds = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [1, 7], [6, 8], [6, 9], [6, 10], [7, 11], [7, 12], [7, 13], [2, 14], [2, 15], [3, 16], [3, 17], [4, 18], [4, 19], [5, 20], [5, 21]];
  /* surface Pd(111) : distance Pd–Pd 2,75 Å */
  var pd = []; for (var j = 0; j < 5; j++) for (var i = 0; i < 7; i++) pd.push([(i - 3 + 0.5 * (j % 2) - 0.25) * 2.75, 0, (j - 2) * 2.75 * Math.sqrt(3) / 2]);
  /* trois autres molécules de H₂ (spectatrices) */
  var spect = [[-5.6, 2.4], [4.9, -2.6], [5.6, 2.9]];
  return {alk:alk, mid:mid, prod:prod, bonds:bonds, pd:pd, spect:spect};
})();
var HY_M = {alc:8 * 12.011 + 14 * 1.008, prod:8 * 12.011 + 16 * 1.008, R:8.314, T:298.15};
function hyFrame(f){
  if (f <= 1) return HY.alk.map(function(p, i){ return lerp3(p, HY.mid[i], ease(f)); });
  return HY.mid.map(function(p, i){ return lerp3(p, HY.prod[i], ease(f - 1)); });
}
function rotY(p, a){ var c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; }
function rotX(p, a){ var c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
var HY_T = {h2in:[0, 2.2], diss:[2.2, 3.2], alk:[2.6, 5.0], ha:[5.4, 6.8], hb:[7.2, 8.6], up:[9.0, 11.0], zoom:[10.4, 11.8], end:16.5};
SFA.sim({
  id:"org-hydrogenation-catalytique-surface", ch:"c09", tag:"Alcènes",
  titre:"Hydrogénation sur la surface du métal",
  resume:"Une surface de palladium en 3D : H₂ s'y pose et se coupe en deux, l'alcène se couche à plat et reçoit ses deux H par le dessous. Avec le 1,2-diméthylcyclohexène, fais tourner le produit : les deux CH₃ sont du même côté, il est cis.",
  but:"Regarde la surface du palladium : (1) les molécules de H₂ s'y posent et la liaison H–H se rompt ; les atomes H restent accrochés au métal. (2) Le 1,2-diméthylcyclohexène se couche à plat, sa double liaison contre le métal. (3) Un H passe de la surface sur C1, puis un second sur C2 : les deux arrivent par la même face, celle du dessous. (4) Le produit quitte la surface ; la caméra s'approche. Glisse pour tourner la scène et vérifier que les deux CH₃ sont du même côté du cycle. Règle la quantité d'alcène et la pression pour lire le volume de H₂ consommé.",
  aRetenir:"Hydrogénation catalytique : alcène + H₂ → alcane, avec un métal finement divisé (Pd/C, Pt, Ni). Le métal rompt la liaison H–H (436 kJ/mol) en formant des liaisons métal–H : l'énergie d'activation chute. L'alcène s'adsorbe par sa face π, puis reçoit les deux H l'un après l'autre, du côté du métal : c'est une addition syn. Le 1,2-diméthylcyclohexène donne donc le cis-1,2-diméthylcyclohexane (un CH₃ axial, l'autre équatorial dans la chaise ; molécule méso). Le catalyseur n'est pas consommé. Bilan de matière : 1 mol de C=C consomme 1 mol de H₂ ; à 25 °C, V = n·R·T / p.",
  piege:"Le métal n'est pas un réactif : il ne figure pas dans le bilan et sert indéfiniment. Les deux H ne viennent pas de « la même molécule de H₂ » : ils viennent de la surface, où les atomes H se déplacent. Addition syn ne veut pas dire « les deux H en même temps », mais « par la même face ». Ne confonds pas avec Br₂, qui s'additionne en anti (ion bromonium) et donne le produit trans. Et dans la chaise du produit cis, un CH₃ est axial et l'autre équatorial : « cis » se lit par rapport au plan moyen du cycle, pas en comparant axial et équatorial.",
  build:function(k, S){
    var c = respCanvas(k, 0.86, 1.3), st = {a:0.42, b:0.5, bmin:0.12, bmax:1.35, t:0, play:true, clk:0, user:false};
    var nS = k.slider("Quantité d'alcène à hydrogéner", 1, 50, 1, 10, "mmol");
    var pS = k.slider("Pression de H₂", 1, 5, 0.5, 1, "bar");
    var zT = k.toggle("Approcher la caméra du produit à la fin", true);
    k.button("Recommencer", function(){ st.t = 0; st.play = true; }, true);
    var pB = k.button("Pause", function(){ st.play = !st.play; pB.textContent = st.play ? "Pause" : "Lecture"; });
    var ro = k.readouts(["Étape", "Atomes H sur le palladium", "Produit", "H₂ consommé (25 °C)", "Masse de produit"]);
    var nt = k.note("", "ok");
    dragView(c, st); st.onview = function(){ st.user = true; };
    var lp = k.loop(function(dt){
      st.clk += dt;
      if (st.play){ st.t += dt; if (st.t > HY_T.end) st.t = 0; }
      if (!st.user && !st.drag) st.a = 0.42 + 0.25 * Math.sin(st.clk * 0.18);
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, T = HY_T;
      /* décor : réacteur sombre, reflets du métal */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1c2533"); bg.addColorStop(1, "#334055"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var banH = ph ? 96 : 70, area = H - banH - 12;
      var zf = zT.value ? ease(seg01(t, T.zoom[0], T.zoom[1])) * (1 - ease(seg01(t, T.end - 1.2, T.end - 0.2))) : 0;
      st.bmin = lerp(0.12, -1.2, zf);
      if (st.b < st.bmin) st.b = st.bmin;
      /* molécule : forme (alcène → semi-hydrogéné → produit) et placement */
      var wa = ease(seg01(t, T.ha[0], T.ha[1])), wb = ease(seg01(t, T.hb[0], T.hb[1])), f = wa + wb;
      var land = ease(seg01(t, T.alk[0], T.alk[1])), upF = ease(seg01(t, T.up[0], T.up[1])), fadeEnd = 1 - seg01(t, T.end - 0.6, T.end);
      var Lc = hyFrame(f), center = [0.3, lerp(lerp(8.5, 2.15, land), 5.2, upF), 0.2], tilt = (1 - land) * 0.9, spin = (1 - land) * 1.4 + upF * (t - T.up[0]) * 0.55;
      function toW(p){ return add(rotY(rotX(p, tilt), spin), center); }
      var molW = Lc.map(toW);
      /* H de surface : Ha et Hb viennent de la 1re molécule de H₂ */
      var sA = [toW(HY.alk[0])[0], 0.95, toW(HY.alk[0])[2]], sB = [toW(HY.alk[1])[0], 0.95, toW(HY.alk[1])[2]];
      /* sites définitifs sous C1 et C2 (calculés à l'état posé) */
      var cl = [0.3, 2.15, 0.2], siteA = add(HY.alk[0], cl), siteB = add(HY.alk[1], cl); siteA[1] = 1.0; siteB[1] = 1.0;
      function h2path(mid, k2, sideDir){
        var fall = ease(seg01(t, T.h2in[0] + k2 * 0.25, T.h2in[1])), sp = ease(seg01(t, T.diss[0], T.diss[1]));
        var y = lerp(9, 1.55, fall), half = lerp(0.37, 1.4, sp), rot = (1 - fall) * (3 + k2);
        var d = nrm([Math.cos(rot + k2), 0, Math.sin(rot + k2)]); d = sp > 0 ? nrm(lerp3(d, sideDir, sp)) : d;
        var yy = lerp(y, 1.05, sp);
        return [add([mid[0], yy, mid[2]], mul(d, -half)), add([mid[0], yy, mid[2]], mul(d, half)), sp];
      }
      var mAB = mul(add(siteA, siteB), 0.5), dAB = nrm(sub(siteB, siteA)), h0 = h2path(mAB, 0, dAB);
      var HaS = wa > 0 ? siteA : (h0[2] >= 1 ? siteA : h0[0]), HbS = wb > 0 ? siteB : (h0[2] >= 1 ? siteB : h0[1]);
      if (h0[2] < 1){ HaS = lerp3(h0[0], siteA, h0[2]); HbS = lerp3(h0[1], siteB, h0[2]); }
      molW[22] = lerp3(HaS, molW[22], wa); molW[23] = lerp3(HbS, molW[23], wb);
      /* caméra : vise la surface, puis le produit */
      var tgt = lerp3([0, 1.6, 0], add(center, [0, 0.5, 0]), zf), scale = Math.max(12, Math.min(W / (ph ? 11.5 : 13.5), area / 9)) * (1 + 0.32 * zf);
      var V = {st:st, sc:scale, cx:W * 0.5, cy:24 + (area - 24) * lerp(0.56, 0.5, zf)};
      function P(p){ return sub(p, tgt); }
      var atoms = [], bonds = [], extra = [], surfA = 1 - 0.8 * zf;
      /* dalle de métal sous les atomes de surface */
      var cx0 = -10.6, cx1 = 10.0, cz0 = -6.0, cz1 = 6.0, sy = -1.0, sy2 = -3.2;
      var cs = [[cx0, sy, cz0], [cx1, sy, cz0], [cx1, sy, cz1], [cx0, sy, cz1]].map(function(q){ return proj3(P(q), st, V.sc, V.cx, V.cy); });
      var cb = [[cx0, sy2, cz0], [cx1, sy2, cz0], [cx1, sy2, cz1], [cx0, sy2, cz1]].map(function(q){ return proj3(P(q), st, V.sc, V.cx, V.cy); });
      ctx.save(); ctx.globalAlpha = surfA;
      [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(function(e){
        var g = ctx.createLinearGradient(cs[e[0]].x, cs[e[0]].y, cb[e[0]].x, cb[e[0]].y); g.addColorStop(0, "#8b96a5"); g.addColorStop(1, "#3c4552");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cs[e[0]].x, cs[e[0]].y); ctx.lineTo(cs[e[1]].x, cs[e[1]].y); ctx.lineTo(cb[e[1]].x, cb[e[1]].y); ctx.lineTo(cb[e[0]].x, cb[e[0]].y); ctx.closePath(); ctx.fill();
      });
      var gt = ctx.createLinearGradient(cs[0].x, cs[0].y, cs[2].x, cs[2].y); gt.addColorStop(0, "#a9b3bf"); gt.addColorStop(1, "#6d7886");
      ctx.fillStyle = gt; ctx.beginPath(); cs.forEach(function(q, i){ if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fill();
      ctx.restore();
      HY.pd.forEach(function(q){ atoms.push(At("Pd", P(q), {r:1.08, alpha:surfA})); });
      var nPd = atoms.length;
      /* molécule */
      var el = ["C", "C", "C", "C", "C", "C", "C", "C", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"];
      var molA = fadeEnd * (t < T.alk[0] ? 0 : Math.min(1, seg01(t, T.alk[0], T.alk[0] + 0.5)));
      molW.forEach(function(p, i){
        var a = At(el[i], P(p), {alpha:i >= 22 ? fadeEnd : molA});
        if (i === 6 || i === 7){ a.col = "#e08a1e"; a.glow = zf > 0.05 ? "rgba(224,138,30," + (0.5 * zf) + ")" : null; }
        if (i >= 22) a.glow = "rgba(255,210,60," + (0.35 + 0.4 * zf) + ")";
        atoms.push(a);
      });
      HY.bonds.forEach(function(b){ bonds.push({a:nPd + b[0], b:nPd + b[1], o:b[0] === 0 && b[1] === 1 ? (f < 1 ? 2 : 1) : 1, dash:b[0] === 0 && b[1] === 1 && f > 0.03 && f < 0.97}); });
      if (wa > 0.02) bonds.push({a:nPd, b:nPd + 22, alpha:wa, dash:wa < 0.97, col:"#d9a520"});
      if (wb > 0.02) bonds.push({a:nPd + 1, b:nPd + 23, alpha:wb, dash:wb < 0.97, col:"#d9a520"});
      if (t < T.diss[1]){ var spl = seg01(t, T.diss[0], T.diss[1]); bonds.push({a:nPd + 22, b:nPd + 23, alpha:1 - spl, dash:spl > 0.05}); }
      /* H₂ spectateurs */
      HY.spect.forEach(function(sp2, q){
        var hp = h2path([sp2[0], 0, sp2[1]], q + 1, nrm([Math.cos(q * 2.1), 0, Math.sin(q * 2.1)]));
        var hop = hp[2] >= 1 ? [0.25 * Math.sin(st.clk * 1.3 + q * 2), 0, 0.25 * Math.cos(st.clk * 1.1 + q)] : [0, 0, 0];
        var i0 = atoms.length;
        atoms.push(At("H", P(add(hp[0], hop)), {alpha:fadeEnd, glow:"rgba(255,210,60,.25)"})); atoms.push(At("H", P(add(hp[1], mul(hop, -1))), {alpha:fadeEnd, glow:"rgba(255,210,60,.25)"}));
        if (hp[2] < 1) bonds.push({a:i0, b:i0 + 1, alpha:1 - hp[2], dash:hp[2] > 0.05});
      });
      /* nuage π de la double liaison, collé au métal pendant l'adsorption */
      var piA = land * (1 - Math.min(1, f)) * molA;
      if (piA > 0.02){
        var mC = mul(add(molW[0], molW[1]), 0.5), Pm = proj3(P(add(mC, [0, -0.55, 0])), st, V.sc, V.cx, V.cy), Rm = 1.3 * V.sc * Pm.s;
        extra.push({z:Pm.z - 0.5, f:function(){ var g = ctx.createRadialGradient(Pm.x, Pm.y, 2, Pm.x, Pm.y, Rm); g.addColorStop(0, "rgba(120,160,255," + (0.55 * piA) + ")"); g.addColorStop(1, "rgba(120,160,255,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(Pm.x, Pm.y, Rm, Rm * 0.7, 0, 0, 7); ctx.fill(); }});
      }
      var pr = drawScene(c, V, atoms, bonds, extra);
      /* étiquettes */
      if (surfA > 0.5) label(ctx, "surface du palladium (Pd)", 12, area - 10, {size:ph ? 10.5 : 11.5, weight:800, col:"#d8dee6", align:"left", bg:"rgba(20,28,40,.65)"});
      label(ctx, ph ? "glisse pour tourner" : "glisse pour tourner la scène", W - 12, 16, {size:10.5, weight:700, col:"#9fb0c4", align:"right"});
      var step, s2, colB = "#2a6fdb";
      if (t < T.diss[0]){ step = "H₂ s'adsorbe"; s2 = "Les molécules de H₂ se posent sur le métal. La liaison H–H est forte (436 kJ/mol) : seule, elle ne se casserait pas à 25 °C."; }
      else if (t < T.alk[1]){ step = "H–H se rompt, l'alcène se pose"; s2 = "Chaque H se lie aux atomes de Pd (liaisons Pd–H) : la liaison H–H est rompue sans coûter beaucoup d'énergie. L'alcène arrive et se couche à plat, sa double liaison contre le métal."; }
      else if (t < T.ha[0]){ step = "Alcène adsorbé par sa face π"; s2 = "Le nuage π de C=C interagit avec le métal. Tout ce qui va arriver au cycle viendra de cette face-là, celle du dessous."; }
      else if (t < T.hb[0]){ step = "1er H sur C1"; s2 = "Un H de la surface passe sur C1 (par le dessous) : C1 devient sp³. C2 reste accroché au métal (intermédiaire semi-hydrogéné)."; colB = "#d9a520"; }
      else if (t < T.up[0]){ step = "2ᵉ H sur C2"; s2 = "Le second H arrive sur C2, lui aussi par le dessous : les deux H sont du même côté du cycle. C'est une addition syn."; colB = "#d9a520"; }
      else { step = "Le produit se détache"; s2 = "Le cis-1,2-diméthylcyclohexane quitte la surface : les deux H ajoutés (en jaune) sont dessous, les deux CH₃ (en orange) dessus. Le palladium est prêt pour une autre molécule."; colB = "#e08a1e"; }
      if (zf > 0.5){
        var p6 = pr[nPd + 6], p7 = pr[nPd + 7];
        label(ctx, "CH₃", p6.x + p6.r + 8, p6.y - 6, {size:11, weight:800, col:"#e08a1e", align:"left", bg:"rgba(20,28,40,.7)"});
        label(ctx, "CH₃", p7.x + p7.r + 8, p7.y - 6, {size:11, weight:800, col:"#e08a1e", align:"left", bg:"rgba(20,28,40,.7)"});
        label(ctx, "cis : les deux CH₃ du même côté", W / 2, 38, {size:ph ? 12 : 14, weight:800, col:"#ffd27a", bg:"rgba(20,28,40,.75)"});
      }
      if (t > T.diss[1] && t < T.ha[1] && surfA > 0.5){ var pa = pr[nPd + 22]; label(ctx, "H adsorbés", pa.x, pa.y + 18, {size:10.5, weight:800, col:"#ffd27a", bg:"rgba(20,28,40,.7)"}); }
      if (t < T.diss[1]){ var ph0 = pr[nPd + 22]; label(ctx, "H₂", ph0.x - 18, ph0.y - 10, {size:11, weight:800, col:"#ffd27a", bg:"rgba(20,28,40,.7)"}); }
      bannerBox(ctx, W, H - banH - 6, banH, "C₈H₁₄ + H₂ → C₈H₁₆ (Pd)  ·  " + step, s2, colB, ph);
      /* lectures */
      var n = nS.value / 1000, p = pS.value * 1e5, Vm3 = n * HY_M.R * HY_M.T / p, mg = n * HY_M.prod;
      var nH = (t < T.diss[1] ? 0 : 6) + (t >= T.diss[1] ? (wa < 1 ? 1 : 0) + (wb < 1 ? 1 : 0) : 0);
      ro.set(0, step);
      ro.set(1, t < T.diss[1] ? "0 (encore H₂)" : String(nH));
      ro.set(2, f >= 2 ? "alcane cis, C₈H₁₆" : "alcène, C₈H₁₄");
      ro.set(3, F(Vm3 * 1e6, 1) + " mL");
      ro.set(4, F(mg, 3) + " g");
      nt.set("Pour " + F(nS.value, 0) + " mmol de 1,2-diméthylcyclohexène (C₈H₁₄, M = " + F(HY_M.alc, 2) + " g/mol) : il faut " + F(nS.value, 0) + " mmol de H₂ (1 H₂ par C=C). À 25 °C et " + F(pS.value, 1) + " bar : V = n·R·T / p = " + F(n, 3) + " × 8,314 × 298,15 / " + sci(p, 1) + " = " + F(Vm3 * 1e6, 1) + " mL. On obtient " + F(n, 3) + " mol × " + F(HY_M.prod, 2) + " g/mol = " + F(mg, 3) + " g de cis-1,2-diméthylcyclohexane (C₈H₁₆), produit attendu de l'addition syn ; en pratique on préfère Pt (PtO₂), car Pd déplace la double liaison et donne aussi un peu de trans. <i>Le palladium n'apparaît pas dans le bilan : c'est un catalyseur. Surface Pd(111) idéale, Pd–Pd = 2,75 Å ; le nombre de H₂ est symbolique.</i>", "ok");
    });
  }
});

})();
