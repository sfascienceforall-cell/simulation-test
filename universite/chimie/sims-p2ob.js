/* Chimie BA1 · chimie organique (L12, L18, c09) — lot P2-OB : simulations SFA originales, 3D dessinée à la main */
(function(){
var PI = Math.PI, DEG = PI / 180;
var FONT = "Mulish, system-ui, sans-serif";
/* ---------- petite algèbre 3D ---------- */
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function lerp(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }
function ease(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function rotAx(v, k, ang){
  var c = Math.cos(ang), s = Math.sin(ang);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}
function basis(u){
  var t = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], v = nrm(cross(u, t)), w = cross(u, v);
  return [v, w];
}
function rnd(seed){ var s = seed; return function(){ s = (s * 16807) % 2147483647; return s / 2147483647; }; }
/* ---------- couleurs CPK et rayons d'affichage (Å) ---------- */
var COL = {C:"#4a5568", H:"#e8edf3", O:"#d6392f", N:"#3b6ec2", Cl:"#2fa84f", Br:"#9a2a1c"};
var RAD = {C:0.40, H:0.25, O:0.40, N:0.40, Cl:0.56, Br:0.62};
/* ---------- dessin ---------- */
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
function glowAt(ctx, x, y, r, hex, a){
  if (a <= 0.01 || !(r > 0)) return;
  var g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r); g.addColorStop(0, rgba(hex, a)); g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function rot3(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}
/* caméra : rotation (a autour de y, b autour de x), perspective douce */
function cam(st, sc, cx, cy, persp){
  var k = persp == null ? 0.045 : persp;
  return {sc:sc, cx:cx, cy:cy, P:function(p){ var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * k); return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s}; }};
}
function txt(ctx, s, x, y, size, col, align, weight){
  ctx.save(); ctx.font = (weight || 800) + " " + size + "px " + FONT; ctx.fillStyle = col || "#13233a";
  ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); ctx.restore();
}
function onBall(ctx, s, x, y, size){
  ctx.save(); ctx.font = "800 " + Math.round(size) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(s, x, y); ctx.fillStyle = "#fff"; ctx.fillText(s, x, y); ctx.restore();
}
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
/* étiquette sur pastille blanche ; renvoie le rectangle occupé */
function pill(ctx, s, x, y, col, size, W, o){
  o = o || {};
  ctx.save(); ctx.font = "800 " + size + "px " + FONT;
  var w = ctx.measureText(s).width + 14, h = size + 9;
  if (o.align === "right") x -= w / 2; else if (o.align === "left") x += w / 2;
  if (W) x = clamp(x, w / 2 + 4, W - w / 2 - 4);
  ctx.fillStyle = o.fill || "rgba(255,255,255,.93)"; ctx.strokeStyle = o.edge || rgba(col, 0.55); ctx.lineWidth = o.lw || 1.2;
  if (o.shadow){ ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; }
  rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.shadowColor = "transparent"; ctx.stroke();
  ctx.fillStyle = o.tcol || col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y + 0.5); ctx.restore();
  return {x:x - w / 2, y:y - h / 2, w:w, h:h};
}
function fitFont(ctx, s, maxW, size, weight){ var z = size; ctx.font = (weight || 800) + " " + z + "px " + FONT; while (z > 9 && ctx.measureText(s).width > maxW){ z -= 1; ctx.font = (weight || 800) + " " + z + "px " + FONT; } return z; }
function wrapLines(ctx, s, maxW){
  var words = String(s).split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
/* bandeau : titre + sous-titre, dans le rectangle (x, y, w, h) */
function banner(ctx, x0, y, w, h, main, sub2, col){
  var W = w;
  ctx.save(); ctx.fillStyle = "rgba(255,255,255,.94)"; ctx.strokeStyle = "#d9e0ea"; ctx.lineWidth = 1; rr(ctx, x0, y, W, h, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col || "#2a6fdb"; ctx.fillRect(x0, y + 10, 4, h - 20);
  ctx.fillStyle = "#13233a"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var ph = W < 420, cx = x0 + W / 2, mz = fitFont(ctx, main, W - 26, ph ? 14 : 17, 800);
  if (!sub2){ ctx.fillText(main, cx, y + h / 2); ctx.restore(); return; }
  ctx.font = "700 " + (ph ? 11 : 12) + "px " + FONT;
  var L = wrapLines(ctx, sub2, W - 24).slice(0, 2), lh = ph ? 13 : 14.5, top = y + h / 2 - (mz + 4 + L.length * lh) / 2;
  ctx.font = "800 " + mz + "px " + FONT; ctx.fillText(main, cx, top + mz / 2);
  ctx.font = "700 " + (ph ? 11 : 12) + "px " + FONT; ctx.fillStyle = "#5f6b7a";
  L.forEach(function(l, i){ ctx.fillText(l, cx, top + mz + 4 + lh * (i + 0.5)); });
  ctx.restore();
}
function bondLine(ctx, p, q, w, col, o, dash, alpha){
  var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, ox = -dy / l, oy = dx / l;
  var offs = o === 2 ? [-w * 0.9, w * 0.9] : o === 3 ? [-w * 1.5, 0, w * 1.5] : o === 1.5 ? [-w * 0.8, w * 0.8] : [0];
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.lineCap = "round";
  offs.forEach(function(of, i){
    ctx.strokeStyle = col; ctx.lineWidth = o > 1 ? w * 0.62 : w;
    ctx.setLineDash(dash || (o === 1.5 && i === 1) ? [w * 1.1, w * 1.2] : []);
    ctx.beginPath(); ctx.moveTo(p.x + ox * of, p.y + oy * of); ctx.lineTo(q.x + ox * of, q.y + oy * of); ctx.stroke();
  });
  ctx.restore();
}
function softBg(ctx, W, H, c0, c1){
  var bg = ctx.createRadialGradient(W * 0.5, H * 0.38, 10, W * 0.5, H * 0.45, Math.max(W, H) * 0.75);
  bg.addColorStop(0, c0 || "#ffffff"); bg.addColorStop(1, c1 || "#e6ecf4"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}
function floorShadow(ctx, x, y, rx, ry, a){
  ctx.save(); var g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, "rgba(15,27,45," + (a || 0.16) + ")"); g.addColorStop(1, "rgba(15,27,45,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore();
}
/* directions tétraédriques libres autour d'un atome (E : directions des liaisons déjà posées) */
function tetraSlots(E, ref){
  var out = [];
  if (E.length === 1){
    var u = E[0], rp = ref ? sub(ref, mul(u, dot(ref, u))) : null;
    if (!rp || len(rp) < 1e-3){ rp = cross(u, [0, 0, 1]); if (len(rp) < 1e-3) rp = cross(u, [0, 1, 0]); }
    var e1 = nrm(rp), e2 = cross(u, e1);
    [PI, PI / 3, -PI / 3].forEach(function(p){ out.push(add(mul(u, -1 / 3), mul(add(mul(e1, Math.cos(p)), mul(e2, Math.sin(p))), Math.sqrt(8) / 3))); });
    return out;
  }
  if (E.length === 2){
    var d = nrm(mul(add(E[0], E[1]), -1)), n = nrm(cross(E[0], E[1])), h = 54.75 * DEG;
    return [add(mul(d, Math.cos(h)), mul(n, Math.sin(h))), add(mul(d, Math.cos(h)), mul(n, -Math.sin(h)))];
  }
  return [nrm(mul(add(add(E[0], E[1]), E[2]), -1))];
}
/* rendu d'atomes et de liaisons (tri en profondeur) ; extra : objets {z, f} supplémentaires */
function renderMol(ctx, C, atoms, bonds, extra){
  var pr = atoms.map(function(a){ return C.P(a.p); }), items = (extra || []).slice();
  bonds.forEach(function(b){
    var p = pr[b.a], q = pr[b.b]; if (!p || !q) return;
    var al = Math.min(atoms[b.a].al == null ? 1 : atoms[b.a].al, atoms[b.b].al == null ? 1 : atoms[b.b].al) * (b.al == null ? 1 : b.al);
    if (al <= 0.02) return;
    items.push({z:(p.z + q.z) / 2 - 0.01, f:function(){ bondLine(ctx, p, q, Math.max(2.2, C.sc * 0.1) * (b.w || 1), b.col || "#8693a3", b.o || 1, b.dash, al); }});
  });
  atoms.forEach(function(a, i){
    var al = a.al == null ? 1 : a.al; if (al <= 0.02) return;
    var p = pr[i], r = Math.max(a.el === "H" ? 4 : 6, (a.r || RAD[a.el]) * C.sc * 0.82 * p.s);
    a._r = r;
    items.push({z:p.z, f:function(){
      if (a.glow) glowAt(ctx, p.x, p.y, r * (a.gr || 2.4), a.glow, (a.ga == null ? 0.45 : a.ga) * al);
      ball(ctx, p.x, p.y, r, a.col || COL[a.el], al);
      if (a.ring){ ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = a.ring; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, r + 3, 0, 7); ctx.stroke(); ctx.restore(); }
      if (a.lab && r > 8){ ctx.save(); ctx.globalAlpha = al; onBall(ctx, a.lab, p.x, p.y, Math.max(9, Math.min(15, r * 0.8))); ctx.restore(); }
    }});
  });
  items.sort(function(x, y){ return x.z - y.z; });
  items.forEach(function(it){ it.f(); });
  return pr;
}
/* enveloppe convexe 2D */
function hull2(pts){
  var p = pts.slice().sort(function(a, b){ return a.x - b.x || a.y - b.y; });
  function cr(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
  var lo = [], up = [], i;
  for (i = 0; i < p.length; i++){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
  for (i = p.length - 1; i >= 0; i--){ while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
  up.pop(); lo.pop(); return lo.concat(up);
}
/* lobe ellipsoïdal (orbitale) : centre, axe u (demi-longueur a), v et w (demi-largeur b) */
function lobe(ctx, C, ctr, u, a, b, col, alpha, o){
  if (alpha <= 0.01 || a <= 0.01) return;
  o = o || {};
  var bw = basis(u), v = bw[0], w = bw[1], pts = [], i, j;
  for (i = 0; i <= 10; i++) for (j = 0; j < 14; j++){
    var th = PI * i / 10, ph = 2 * PI * j / 14;
    pts.push(C.P(add(ctr, add(mul(u, a * Math.cos(th)), add(mul(v, b * Math.sin(th) * Math.cos(ph)), mul(w, b * Math.sin(th) * Math.sin(ph)))))));
  }
  var H = hull2(pts), pc = C.P(ctr), R = 0; H.forEach(function(p){ R = Math.max(R, Math.hypot(p.x - pc.x, p.y - pc.y)); });
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.beginPath(); H.forEach(function(p, k){ if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
  if (o.empty){
    ctx.fillStyle = rgba(col, 0.12); ctx.fill(); ctx.setLineDash([5, 4]); ctx.strokeStyle = shade(col, -0.2); ctx.lineWidth = 1.6; ctx.stroke();
  } else {
    var g = ctx.createRadialGradient(pc.x - R * 0.25, pc.y - R * 0.3, R * 0.05, pc.x, pc.y, R);
    g.addColorStop(0, shade(col, 0.6)); g.addColorStop(0.6, col); g.addColorStop(1, shade(col, -0.3));
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = shade(col, -0.35); ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.restore();
}
/* flèche courbe de mécanisme (déplacement d'un doublet) */
function curly(ctx, x0, y0, x1, y1, bend, col, alpha, lw){
  if (alpha <= 0.02) return;
  var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, cx = mx - dy / L * bend, cy = my + dx / L * bend;
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw || 2.4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke();
  var ang = Math.atan2(y1 - cy, x1 - cx); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 11 * Math.cos(ang - 0.4), y1 - 11 * Math.sin(ang - 0.4)); ctx.lineTo(x1 - 11 * Math.cos(ang + 0.4), y1 - 11 * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill();
  ctx.restore();
}
/* canevas qui change de proportion sur téléphone */
function respCanvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
/* glisser = tourner la vue ; hit(p, type) peut intercepter un clic (renvoie true) */
function dragView(c, st, hit){
  c.pointer(function(type, p){
    if (type === "down"){ if (hit && hit(p, "down")) { st.lx = null; st.grab = true; return; } st.grab = false; st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.grab && hit){ hit(p, "drag"); return; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, -1.45, 1.45); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "move" && hit) hit(p, "move");
    if (type === "up"){ if (st.grab && hit) hit(p, "up"); st.lx = null; st.drag = false; st.grab = false; }
  });
}
function fmt(x, d){ var m = Math.pow(10, d), v = Math.sign(x) * Math.round(Math.abs(x) * m + 1e-7) / m, s = v.toFixed(d); if (/^-0[.,]?0*$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); }
var SUPD = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻", "−":"⁻", ",":"˒"};
function supTxt(s){ return String(s).split("").map(function(ch){ return SUPD[ch] || ch; }).join(""); }
/* notation scientifique en texte simple (pour le canevas) : 1,7·10⁴⁵ */
function sciC(x, d){
  if (!isFinite(x) || x === 0) return fmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x)) + 1e-12), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.995 && d <= 2){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return fmt(x, Math.max(0, d - e));
  return fmt(m, d) + "·10" + supTxt(String(e));
}
function sciH(x, d){
  if (!isFinite(x) || x === 0) return fmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x)) + 1e-12), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.995 && d <= 2){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return fmt(x, Math.max(0, d - e));
  return fmt(m, d) + "·10<sup>" + String(e).replace("-", "−") + "</sup>";
}

/* ====================================================================== */
/* 1. L'échelle des pKa organiques (L12)                                   */
/* ====================================================================== */
var PKA = [
  {k:"acet", nom:"acide éthanoïque", f:"CH₃COOH", b:"CH₃COO⁻", bn:"ion éthanoate", pKa:4.76, deloc:true, chg:"charge délocalisée sur les 2 O",
   why:"la charge se partage entre deux oxygènes (deux formes limites équivalentes)"},
  {k:"phen", nom:"phénol", f:"C₆H₅OH", b:"C₆H₅O⁻", bn:"ion phénolate", pKa:10.0, deloc:true, chg:"charge délocalisée sur O et le cycle",
   why:"la charge de l'oxygène s'étale dans le cycle (positions ortho et para)"},
  {k:"etoh", nom:"éthanol", f:"CH₃CH₂OH", b:"CH₃CH₂O⁻", bn:"ion éthanolate", pKa:16, chg:"charge localisée sur O",
   why:"la charge reste sur un seul oxygène, sans mésomérie"},
  {k:"yne", nom:"éthyne (alcyne)", f:"HC≡CH", b:"HC≡C⁻", bn:"ion éthynure", pKa:25, chg:"charge localisée sur un C sp",
   why:"le doublet est dans une orbitale sp (50 % s), tenue près du noyau"},
  {k:"nh3", nom:"ammoniac", f:"NH₃", b:"NH₂⁻", bn:"ion amidure", pKa:38, chg:"charge localisée sur N",
   why:"N, moins électronégatif que O, supporte mal la charge"},
  {k:"eth", nom:"éthane (alcane)", f:"CH₃CH₃", b:"CH₃CH₂⁻", bn:"ion éthanure", pKa:50, chg:"charge localisée sur un C sp³",
   why:"le doublet est dans une orbitale sp³ (25 % s) d'un carbone peu électronégatif"}
];
/* constante d'équilibre HA + B⁻ ⇌ A⁻ + HB : log K = pKa(HB) − pKa(HA) ; conversion à quantités initiales égales : x/(1 − x) = √K */
function pk(v){ return fmt(v, 2).replace(/,00$/, "").replace(/(,\d)0$/, "$1"); }
function pkaReact(iA, iB){
  var lg = PKA[iB].pKa - PKA[iA].pKa, sK = Math.pow(10, lg / 2);
  return {lg:lg, K:Math.pow(10, lg), x:sK / (1 + sK)};
}
/* géométries (Å) : at = squelette sans le H acide ; hp = position du H acide ; site = atome qui porte ce H ; q = partage de la charge du A⁻ ; lp = doublet visible du A⁻ */
function pkaMol(key){
  var at = [], bd = [], o = {};
  function A(el, p, x){ x = x || {}; x.el = el; x.p = p; at.push(x); return at.length - 1; }
  function B(a, b, ord, ob){ bd.push({a:a, b:b, o:ord || 1, ob:ob}); }
  function Hs(ci, dirs, L){ dirs.forEach(function(d){ var h = A("H", add(at[ci].p, mul(d, L || 1.09))); B(ci, h); }); }
  if (key === "acet"){
    var c1 = A("C", [0, 0, 0]), o1 = A("O", [0.605, 1.048, 0], {lab:"O"}), o2 = A("O", [0.67, -1.16, 0], {lab:"O"}), c2 = A("C", [-1.5, 0, 0]);
    B(c1, o1, 2, 1.5); B(c1, o2, 1, 1.5); B(c1, c2);
    Hs(c2, tetraSlots([[1, 0, 0]], [0, 1, 0]));
    o.site = o2; o.hp = add(at[o2].p, mul([0.974, 0.225, 0], 0.97)); o.q = [[o1, 0.5], [o2, 0.5]]; o.lp = null;
  } else if (key === "phen"){
    var ctr = [-1.39, 0, 0], ring = [];
    for (var i = 0; i < 6; i++) ring.push(A("C", add(ctr, [1.39 * Math.cos(i * PI / 3), 1.39 * Math.sin(i * PI / 3), 0])));
    for (i = 0; i < 6; i++) B(ring[i], ring[(i + 1) % 6], i % 2 === 0 ? 2 : 1);
    for (i = 1; i < 6; i++){ var hh = A("H", add(ctr, [2.47 * Math.cos(i * PI / 3), 2.47 * Math.sin(i * PI / 3), 0])); B(ring[i], hh); }
    var oo = A("O", [1.36, 0, 0], {lab:"O"}); B(ring[0], oo);
    o.site = oo; o.hp = add(at[oo].p, mul([0.326, 0.946, 0], 0.97)); o.q = [[oo, 0.55], [ring[1], 0.15], [ring[5], 0.15], [ring[3], 0.15]]; o.lp = null;
  } else if (key === "etoh"){
    var d1 = [Math.cos(-35.26 * DEG), Math.sin(-35.26 * DEG), 0], d2 = [Math.cos(-144.74 * DEG), Math.sin(-144.74 * DEG), 0];
    var ca = A("C", [0, 0, 0]), ox = A("O", mul(d1, 1.43), {lab:"O"}), cb = A("C", mul(d2, 1.53));
    B(ca, ox); B(ca, cb);
    Hs(ca, tetraSlots([d1, d2]));
    Hs(cb, tetraSlots([nrm(mul(d2, -1))], [0, 1, 0]));
    var dOH = [Math.cos(35.26 * DEG), Math.sin(35.26 * DEG), 0];
    o.site = ox; o.hp = add(at[ox].p, mul(dOH, 0.97)); o.q = [[ox, 1]]; o.lp = dOH;
  } else if (key === "yne"){
    var y1 = A("C", [-0.6, 0, 0]), y2 = A("C", [0.6, 0, 0]); B(y1, y2, 3);
    var h1 = A("H", [-1.66, 0, 0]); B(y1, h1);
    o.site = y2; o.hp = [1.66, 0, 0]; o.q = [[y2, 1]]; o.lp = [1, 0, 0];
  } else if (key === "nh3"){
    var n = A("N", [0, 0, 0], {lab:"N"}), c = -0.3775, s = Math.sqrt(1 - c * c), dirs = [];
    for (i = 0; i < 3; i++){ var ph = i * 2 * PI / 3; dirs.push([s * Math.cos(ph), c, s * Math.sin(ph)]); }
    Hs(n, [dirs[1], dirs[2]], 1.01);
    o.site = n; o.hp = mul(dirs[0], 1.01); o.q = [[n, 1]]; o.lp = dirs[0]; o.lp2 = [0, 1, 0];
  } else {
    var e1 = A("C", [-0.765, 0, 0]), e2 = A("C", [0.765, 0, 0]); B(e1, e2);
    Hs(e1, tetraSlots([[1, 0, 0]], [0, -1, 0]));
    var sl = tetraSlots([[-1, 0, 0]], [0, -1, 0]);
    Hs(e2, [sl[1], sl[2]]);
    o.site = e2; o.hp = add(at[e2].p, mul(sl[0], 1.09)); o.q = [[e2, 1]]; o.lp = sl[0];
  }
  /* centrage et rayon (pour l'échelle, indépendant de la rotation) */
  var cen = [0, 0, 0]; at.forEach(function(a){ cen = add(cen, a.p); }); cen = mul(cen, 1 / at.length);
  at.forEach(function(a){ a.p = sub(a.p, cen); }); o.hp = sub(o.hp, cen);
  var R = len(o.hp); at.forEach(function(a){ R = Math.max(R, len(a.p)); });
  o.at = at; o.bd = bd; o.R = R + 0.4;
  return o;
}
var PKMOL = {}; PKA.forEach(function(s){ PKMOL[s.k] = pkaMol(s.k); });

SFA.sim({
  id:"org-echelle-pka-organique", ch:"L12", tag:"Acidité en chimie organique",
  titre:"L'échelle des pKa, de l'acide carboxylique à l'alcane",
  resume:"Une grande règle de pKa de 4 à 50 : six acides organiques et leurs bases conjuguées en 3D, charge délocalisée ou non. Choisis un acide et une base : le H⁺ passe vers la base la plus forte et K = 10^ΔpKa.",
  but:"Clique sur un acide (colonne de gauche de la règle) puis sur une base (colonne de droite), ou utilise les listes. En 3D, le H⁺ passe de l'acide à la base ; il reste longtemps du côté le plus stable. Lis ΔpKa, K et la part transformée. Regarde où se trouve la charge négative de chaque base : étalée (rouge diffus) ou concentrée sur un atome (doublet). Glisse sur les molécules pour les tourner.",
  aRetenir:"Plus le pKa est petit, plus l'acide est fort et plus sa base conjuguée est faible (stable). Pour HA + B⁻ ⇌ A⁻ + HB, K = Ka(HA)/Ka(HB) = 10^(pKa(HB) − pKa(HA)) : la réaction est favorisée quand l'acide est plus haut sur l'échelle (pKa plus petit) que l'acide conjugué de la base. Une base stable a sa charge délocalisée (éthanoate : 2 O ; phénolate : O + cycle), portée par un atome électronégatif (O > N > C) ou par une orbitale riche en s (C sp de l'alcyne, 50 % s, contre C sp³, 25 % s). D'où l'ordre : acide carboxylique (4,8) < phénol (10) < alcool (16) < alcyne (25) < amine/ammoniac (38) < alcane (50).",
  piege:"Ne confonds pas la force d'un acide et la stabilité de sa base : un acide fort a une base conjuguée faible. Et « favorisée » ne veut pas dire « totale » : avec ΔpKa = 1, K = 10, il reste environ un quart des réactifs (à quantités égales). L'éthanolate ne peut pas déprotoner un alcyne (K = 10⁻⁹) : il faut une base plus forte, comme l'amidure NH₂⁻. Les pKa au-delà de 16 sont estimés hors de l'eau (l'eau serait déprotonée avant) : ce sont des ordres de grandeur.",
  build:function(k, S){
    var c = respCanvas(k, 1.0, 1.62);
    var st = {a:0.35, b:0.3, t:0, iA:3, iB:4, auto:true, cyc:0, pick:[]};
    var opts = PKA.map(function(s, i){ return [String(i), s.f + " · " + s.nom + " (pKa " + pk(s.pKa) + ")"]; });
    var optsB = PKA.map(function(s, i){ return [String(i), s.b + " · " + s.bn]; });
    var aSel = k.select("Acide HA (il donne H⁺)", opts, "3", function(v){ st.iA = +v; st.cyc = 0; });
    var bSel = k.select("Base B⁻ (elle capte H⁺)", optsB, "4", function(v){ st.iB = +v; st.cyc = 0; });
    var rT = k.toggle("Rotation automatique des molécules", true, function(v){ st.auto = v; });
    var ro = k.readouts(["Réaction", "ΔpKa = pKa(HB) − pKa(HA)", "K", "Sens favorisé", "Part transformée (quantités égales)", "Base la plus stable"]);
    var nt = k.note("", "ok");
    dragView(c, st, function(p, type){
      if (type === "move"){ var on = st.pick.some(function(r){ return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h; }); c.cv.style.cursor = on ? "pointer" : "grab"; return false; }
      if (type !== "down") return true;
      for (var i = 0; i < st.pick.length; i++){
        var r = st.pick[i];
        if (p.x >= r.x - 3 && p.x <= r.x + r.w + 3 && p.y >= r.y - 3 && p.y <= r.y + r.h + 3){
          if (r.side === "A"){ st.iA = r.i; aSel.set(String(r.i)); } else { st.iB = r.i; bSel.set(String(r.i)); }
          st.cyc = 0; k.redraw(); return true;
        }
      }
      return false;
    });
    st.onview = function(){ st.auto = false; rT.set(false); };
    var lp = k.loop(function(dt){ st.t += dt; st.cyc += dt; if (st.auto && !st.drag){ st.ts = (st.ts || 0) + dt; st.a = 0.75 * Math.sin(st.ts * 0.45); st.b = 0.3 + 0.25 * Math.sin(st.ts * 0.31); } k.redraw(); });
    lp.play();
    /* position du H⁺ (0 = sur l'acide, 1 = sur la base) au cours d'un cycle ; le temps passé de chaque côté suit la part transformée */
    function protonU(x, t){
      var Da = 0.4 + 3.4 * (1 - x), Db = 0.4 + 3.4 * x, Tr = 0.9, T = Da + Db + 2 * Tr, tt = t % T;
      if (tt < Da) return 0;
      if (tt < Da + Tr) return ease((tt - Da) / Tr);
      if (tt < Da + Tr + Db) return 1;
      return 1 - ease((tt - Da - Tr - Db) / Tr);
    }
    function drawMol(ctx, m, C, hasH, chargeA, tagTop, tagCol, W){
      var at = m.at.map(function(a){ return {el:a.el, p:a.p, lab:a.lab, r:a.el === "H" ? 0.32 : 0.52}; });
      var bonds = m.bd.map(function(b){ return {a:b.a, b:b.b, o:hasH > 0.5 || !b.ob ? b.o : b.ob}; });
      var extra = [];
      /* charge négative : nuage rouge sur les atomes qui la portent */
      if (chargeA > 0.02){
        m.q.forEach(function(qq){
          var a = at[qq[0]];
          a.glow = "#e0352b"; a.ga = chargeA * (0.25 + 0.6 * qq[1]); a.gr = 2.2 + 2.4 * qq[1] + 0.25 * Math.sin(st.t * 3);
        });
        /* doublet localisé : lobe orienté vers l'ancienne position du H */
        if (m.lp){
          [m.lp].concat(m.lp2 ? [m.lp2] : []).forEach(function(d){
            var base0 = at[m.site].p, ctr = add(base0, mul(d, 0.62)), q = C.P(ctr);
            extra.push({z:q.z, f:function(){
              lobe(ctx, C, ctr, d, 0.62, 0.36, "#f08a5d", 0.75 * chargeA);
              var e1 = C.P(add(ctr, mul(basis(d)[0], 0.13))), e2 = C.P(add(ctr, mul(basis(d)[0], -0.13)));
              ball(ctx, e1.x, e1.y, Math.max(2.2, C.sc * 0.06), "#7a1f12", chargeA); ball(ctx, e2.x, e2.y, Math.max(2.2, C.sc * 0.06), "#7a1f12", chargeA);
            }});
          });
        }
      }
      var pr = renderMol(ctx, C, at, bonds, extra);
      return pr;
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, iA = st.iA, iB = st.iB, R = pkaReact(iA, iB), SA = PKA[iA], SB = PKA[iB];
      softBg(ctx, W, H, "#ffffff", "#e7edf5");
      /* --- régions : règle et scène 3D --- */
      var rg, sc3;
      if (!ph){ rg = {x:8, y:30, w:Math.round(W * 0.44), h:H - 40}; sc3 = {x:rg.x + rg.w + 8, y:30, w:W - rg.w - 24, h:H - 40}; }
      else { rg = {x:6, y:28, w:W - 12, h:Math.round(H * 0.5)}; sc3 = {x:6, y:rg.y + rg.h + 8, w:W - 12, h:H - rg.y - rg.h - 14}; }
      txt(ctx, "Échelle des pKa", 12, 15, ph ? 13 : 14, "#13233a", "left", 800);
      if (!ph) txt(ctx, "clique sur un acide puis sur une base · glisse pour tourner", W - 10, 15, 11, "#8a95a3", "right", 700);
      /* --- la règle : colonne en verre graduée --- */
      var bx = rg.x + rg.w / 2, bw = ph ? 22 : 26, y0 = rg.y + 22, y1 = rg.y + rg.h - 16, P0 = 0, P1 = 52;
      function Y(v){ return y0 + (v - P0) / (P1 - P0) * (y1 - y0); }
      floorShadow(ctx, bx + 6, y1 + 8, bw * 1.6, 7, 0.18);
      var gcol = ctx.createLinearGradient(0, y0, 0, y1); gcol.addColorStop(0, "#f26b5b"); gcol.addColorStop(0.5, "#f6d36b"); gcol.addColorStop(1, "#4c7fd9");
      ctx.save(); rr(ctx, bx - bw / 2, y0 - 8, bw, y1 - y0 + 16, bw / 2); ctx.fillStyle = gcol; ctx.fill();
      var gl = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0); gl.addColorStop(0, "rgba(255,255,255,.55)"); gl.addColorStop(0.35, "rgba(255,255,255,.08)"); gl.addColorStop(0.8, "rgba(0,0,0,.12)"); gl.addColorStop(1, "rgba(0,0,0,.22)");
      ctx.fillStyle = gl; ctx.fill(); ctx.strokeStyle = "rgba(19,35,58,.35)"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      ctx.save(); ctx.font = "700 " + (ph ? 9.5 : 10) + "px " + FONT; ctx.fillStyle = "rgba(19,35,58,.75)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var v = 0; v <= 50; v += 10){ var yy = Y(v); ctx.fillRect(bx - bw / 2, yy - 0.5, 5, 1); ctx.fillRect(bx + bw / 2 - 5, yy - 0.5, 5, 1); }
      ctx.restore();
      txt(ctx, "ACIDE", bx - bw / 2 - 8, y0 - 14, ph ? 10 : 10.5, "#b0322a", "right", 800);
      txt(ctx, "BASE", bx + bw / 2 + 8, y0 - 14, ph ? 10 : 10.5, "#2a56c6", "left", 800);
      txt(ctx, "pKa", bx, y0 - 14, 10.5, "#13233a", "center", 800);
      if (!ph){
        txt(ctx, "acide plus fort ↑", rg.x + 2, y0 + 8, 10, "#b0322a", "left", 700);
        txt(ctx, "base plus forte ↓", rg.x + rg.w - 2, y1 - 2, 10, "#2a56c6", "right", 700);
      }
      st.pick = [];
      var fz = ph ? 10.5 : 11.5, rects = [];
      PKA.forEach(function(s, i){
        var yy = Y(s.pKa), selA = i === iA, selB = i === iB;
        ctx.save(); ctx.strokeStyle = "rgba(19,35,58,.55)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx - bw / 2 - 4, yy); ctx.lineTo(bx + bw / 2 + 4, yy); ctx.stroke(); ctx.restore();
        pill(ctx, pk(s.pKa), bx, yy, "#13233a", ph ? 9.5 : 10, 0, {fill:"rgba(255,255,255,.88)", lw:1});
        var ra = pill(ctx, s.f, bx - bw / 2 - 10, yy, "#b0322a", fz, 0, {align:"right", fill:selA ? "#b0322a" : "rgba(255,255,255,.95)", tcol:selA ? "#fff" : "#8f2a22", lw:selA ? 2 : 1.2, shadow:true});
        var rb = pill(ctx, s.b, bx + bw / 2 + 10, yy, "#2a56c6", fz, 0, {align:"left", fill:selB ? "#2a56c6" : "rgba(255,255,255,.95)", tcol:selB ? "#fff" : "#22479f", lw:selB ? 2 : 1.2, shadow:true});
        ra.side = "A"; ra.i = i; rb.side = "B"; rb.i = i; st.pick.push(ra, rb); rects[i] = {a:ra, b:rb, y:yy};
      });
      /* flèche du transfert de H⁺ : de l'acide choisi vers la base choisie */
      var u = protonU(R.x, st.cyc), ok = R.lg > 0, eq = Math.abs(R.lg) < 1e-9, acol = eq ? "#8a95a3" : ok ? "#1f8a4c" : "#c0392b";
      var pa = rects[iA].a, pb = rects[iB].b, ax0 = pa.x + pa.w / 2, ay0 = pa.y + (iA === iB ? 0 : pa.h), bx1 = pb.x + pb.w / 2, by1 = pb.y + (iA === iB ? pb.h : 0);
      if (iA === iB){ ay0 = pa.y + pa.h; by1 = pb.y + pb.h; }
      var bend = iA === iB ? -18 : (iB > iA ? 1 : -1) * (ph ? 22 : 30);
      if (iA !== iB && iB < iA){ ay0 = pa.y; by1 = pb.y + pb.h; }
      curly(ctx, ax0, ay0, bx1, by1, bend, acol, 0.9, 2.6);
      /* H⁺ qui voyage le long de la flèche */
      var mx = (ax0 + bx1) / 2, my = (ay0 + by1) / 2, dx = bx1 - ax0, dy = by1 - ay0, L = Math.hypot(dx, dy) || 1, qx = mx - dy / L * bend, qy = my + dx / L * bend;
      var hx = (1 - u) * (1 - u) * ax0 + 2 * u * (1 - u) * qx + u * u * bx1, hy = (1 - u) * (1 - u) * ay0 + 2 * u * (1 - u) * qy + u * u * by1;
      glowAt(ctx, hx, hy, 14, "#ffd23f", 0.7); ball(ctx, hx, hy, 6, "#fff4c2"); txt(ctx, "H⁺", hx + 13, hy - 9, 10, "#7a5a00", "center", 800);
      /* --- scène 3D : l'acide et la base, le H⁺ passe de l'un à l'autre --- */
      ctx.save(); rr(ctx, sc3.x, sc3.y, sc3.w, sc3.h, 14); var sg = ctx.createLinearGradient(0, sc3.y, 0, sc3.y + sc3.h); sg.addColorStop(0, "rgba(255,255,255,.65)"); sg.addColorStop(1, "rgba(214,226,240,.55)"); ctx.fillStyle = sg; ctx.fill(); ctx.strokeStyle = "#d9e0ea"; ctx.stroke(); ctx.restore();
      var banH = ph ? 50 : 58, area = {x:sc3.x, y:sc3.y + 4, w:sc3.w, h:sc3.h - banH - 12};
      var vert = area.h > area.w * 0.95, mA = PKMOL[SA.k], mB = PKMOL[SB.k];
      var cA, cB, half;
      if (vert){ half = area.h / 2; cA = [area.x + area.w / 2, area.y + half * 0.5 + 16]; cB = [area.x + area.w / 2, area.y + half * 1.5 + 16]; }
      else { half = area.w / 2; cA = [area.x + half * 0.5, area.y + area.h / 2 + 14]; cB = [area.x + half * 1.5, area.y + area.h / 2 + 14]; }
      var boxS = vert ? Math.min(area.w, half - 30) : Math.min(half, area.h - 30);
      var scA = Math.min(boxS / (2 * mA.R + 0.3), 62), scB = Math.min(boxS / (2 * mB.R + 0.3), 62);
      var CA = cam(st, scA, cA[0], cA[1]), CB = cam(st, scB, cB[0], cB[1]);
      floorShadow(ctx, cA[0], cA[1] + mA.R * scA * 0.9, mA.R * scA, 8, 0.12); floorShadow(ctx, cB[0], cB[1] + mB.R * scB * 0.9, mB.R * scB, 8, 0.12);
      var prA = drawMol(ctx, mA, CA, 1 - u, u, "", "", W), prB = drawMol(ctx, mB, CB, u, 1 - u, "", "", W);
      /* proton : liaison partielle vers le site qui le tient */
      var hA = CA.P(mA.hp), hB = CB.P(mB.hp), sA = prA[mA.site], sB = prB[mB.site];
      var ex = (1 - u) * hA.x + u * hB.x, ey = (1 - u) * hA.y + u * hB.y - Math.sin(u * PI) * 26;
      if (u < 0.35) bondLine(ctx, sA, {x:ex, y:ey}, Math.max(2.2, scA * 0.1), "#8693a3", 1, u > 0.05, 1 - u / 0.35);
      if (u > 0.65) bondLine(ctx, sB, {x:ex, y:ey}, Math.max(2.2, scB * 0.1), "#8693a3", 1, u < 0.95, (u - 0.65) / 0.35);
      var hr = Math.max(4.5, 0.25 * ((1 - u) * scA + u * scB) * 0.82);
      if (u > 0.04 && u < 0.96) glowAt(ctx, ex, ey, hr * 3.2, "#ffd23f", 0.7);
      ball(ctx, ex, ey, hr, u > 0.04 && u < 0.96 ? "#fff1a8" : COL.H);
      if (u > 0.04 && u < 0.96) txt(ctx, "H⁺", ex, ey - hr - 9, 11, "#7a5a00", "center", 800);
      /* étiquettes des deux espèces */
      function lab(pos, m, C, sp, isAcid, uu){
        var dx0 = 0, y = pos[1] - (vert ? half * 0.5 + 4 : area.h / 2), name, sub2, col;
        if (isAcid){ name = uu > 0.5 ? sp.b : sp.f; col = uu > 0.5 ? "#c0392b" : "#13233a"; sub2 = uu > 0.5 ? sp.chg : "acide (pKa " + pk(sp.pKa) + ")"; }
        else { name = uu > 0.5 ? sp.f : sp.b; col = uu > 0.5 ? "#13233a" : "#c0392b"; sub2 = uu > 0.5 ? "acide conjugué (pKa " + pk(sp.pKa) + ")" : sp.chg; }
        var yy2 = Math.max(area.y + 12, y);
        pill(ctx, name, pos[0] + dx0, yy2, col, ph ? 11.5 : 12.5, 0, {shadow:true});
        ctx.save(); ctx.font = "700 " + (ph ? 10 : 10.5) + "px " + FONT; var z = fitFont(ctx, sub2, (vert ? area.w : area.w / 2) - 10, ph ? 10 : 10.5, 700); ctx.restore();
        txt(ctx, sub2, pos[0], yy2 + 17, z, col === "#c0392b" ? "#b0322a" : "#5f6b7a", "center", 700);
      }
      lab(cA, mA, CA, SA, true, u); lab(cB, mB, CB, SB, false, u);
      var eqTxt = SA.f + " + " + SB.b + " ⇌ " + SA.b + " + " + SB.f;
      var verdict = eq ? "K = 1 : simple échange de H⁺ entre deux molécules identiques" :
        ok ? "K = " + sciC(R.K, 1) + " > 1 : l'équilibre est déplacé vers la droite" : "K = " + sciC(R.K, 1) + " < 1 : l'équilibre reste à gauche";
      banner(ctx, sc3.x + 6, sc3.y + sc3.h - banH - 6, sc3.w - 12, banH, eqTxt, verdict, acol);
      /* --- lectures --- */
      ro.set(0, SA.f + " + " + SB.b);
      ro.set(1, pk(SB.pKa) + " − " + pk(SA.pKa) + " = " + pk(R.lg));
      ro.set(2, "10<sup>" + pk(R.lg) + "</sup> ≈ " + sciH(R.K, 1));
      ro.set(3, eq ? "aucun (K = 1)" : ok ? "vers la droite →" : "← vers la gauche");
      var xp = R.x * 100;
      ro.set(4, xp > 99.99 ? "&gt; 99,99 %" : xp < 0.01 ? sciH(xp, 1) + " %" : fmt(xp, xp > 99 || xp < 1 ? 2 : 1) + " %");
      var stab = SA.pKa <= SB.pKa ? SA : SB;
      ro.set(5, eq ? SA.b : stab.b);
      var msg;
      if (eq) msg = "Même acide des deux côtés : le H⁺ passe d'une molécule à l'autre sans rien changer (K = 1, la moitié « transformée »).";
      else if (ok) msg = SA.f + " (pKa " + pk(SA.pKa) + ") est plus haut sur l'échelle que " + SB.f + " (pKa " + pk(SB.pKa) + ") : la base " + SB.b + " est plus forte que " + SA.b + " et lui arrache le H⁺. " + SA.b + " est plus stable : " + SA.why + ".";
      else msg = SB.b + " est une base trop faible pour déprotoner " + SA.f + " : " + SB.f + " (pKa " + pk(SB.pKa) + ") est un acide plus fort que " + SA.f + " (pKa " + pk(SA.pKa) + "). Il faudrait une base située plus bas sur l'échelle. " + SB.b + " est la plus stable : " + SB.why + ".";
      nt.set(msg + " <i>K = 10<sup>ΔpKa</sup> ; part transformée calculée pour des quantités initiales égales d'acide et de base (x/(1 − x) = √K). Les pKa au-delà de 16 sont des ordres de grandeur.</i>", ok || eq ? "ok" : "warn");
    });
  }
});

/* ====================================================================== */
/* 2. Carbocation, radical, carbanion en 3D (L18)                          */
/* ====================================================================== */
var INT = {
  cat:{nom:"carbocation", sym:"⁺", ve:6, beta:0, orb:"p vide", geo:"plane", hyb:"sp²", col:"#2a6fdb",
       vals:[1305, 1130, 1042, 967], grand:"Affinité pour H⁻ (gaz)", unit:"kJ/mol"},
  rad:{nom:"radical", sym:"•", ve:7, beta:5, orb:"p à 1 électron", geo:"presque plane", hyb:"≈ sp²", col:"#d98a00",
       vals:[439, 423, 413, 404], grand:"Énergie de la liaison C–H rompue", unit:"kJ/mol"},
  an:{nom:"carbanion", sym:"⁻", ve:8, beta:Math.asin(1 / 3) / DEG, orb:"doublet non liant", geo:"pyramidale", hyb:"sp³", col:"#c0392b",
      vals:null, grand:"", unit:""}
};
var CLS = ["méthyle", "primaire", "secondaire", "tertiaire"];
var FORM = [["CH₃", "CH₃CH₂", "(CH₃)₂CH", "(CH₃)₃C"]][0];
/* angle R–C–R pour trois liaisons inclinées de β sous le plan : cos α = sin²β − cos²β / 2 */
function intAngle(betaDeg){ var b = betaDeg * DEG, cs = Math.sin(b) * Math.sin(b) - Math.cos(b) * Math.cos(b) / 2; return Math.acos(cs) / DEG; }
SFA.sim({
  id:"org-intermediaires-3d", ch:"L18", tag:"Intermédiaires réactionnels",
  titre:"Carbocation, radical, carbanion en 3D",
  resume:"Un carbone central qu'on fait passer de cation (plan, orbitale p vide) à radical (presque plan, un électron) puis à anion (pyramidal, un doublet). Ajoute des méthyles : l'hyperconjugaison s'allume et l'ordre de stabilité se met à jour.",
  but:"Choisis l'intermédiaire et regarde le carbone changer de forme : plan pour le cation, presque plan pour le radical, pyramide pour l'anion. Clique sur un H du carbone central pour le remplacer par un méthyle (ou l'inverse), ou choisis le nombre de méthyles. Les liaisons C–H des méthyles qui s'alignent avec l'orbitale p s'allument : elles lui prêtent des électrons (hyperconjugaison). Lis l'échelle de stabilité sous la scène. Glisse pour tourner.",
  aRetenir:"Carbocation R₃C⁺ : 6 électrons de valence, carbone sp² plan (120°), orbitale p vide. Radical R₃C• : 7 électrons, presque plan, un électron dans la p. Carbanion R₃C⁻ : 8 électrons, carbone sp³ pyramidal (≈ 109°), doublet non liant. Les méthyles stabilisent le cation et le radical : les liaisons C–H voisines (en α) cèdent un peu de leur densité électronique à l'orbitale p (hyperconjugaison, plus effet inductif donneur). Ordre : tertiaire > secondaire > primaire > méthyle. Pour le carbanion, c'est l'inverse : les groupes donneurs renforcent une charge déjà négative, donc méthyle > primaire > secondaire > tertiaire.",
  piege:"Ne pas appliquer l'ordre des carbocations aux carbanions : il s'inverse. Le radical suit le même ordre que le cation, mais les écarts sont bien plus petits (quelques dizaines de kJ/mol contre plusieurs centaines). Compter les liaisons C–H en α (sur les carbones voisins du centre), pas tous les H de la molécule. Les valeurs affichées sont mesurées en phase gazeuse ; en solution, le solvant réduit les écarts entre cations.",
  build:function(k, S){
    var c = respCanvas(k, 0.82, 1.15), g = k.canvas(200), gr0 = g.resize;
    g.resize = function(){ var w = Math.max(260, (g.cv.parentNode ? g.cv.parentNode.clientWidth : 600) || 600); g.ratio = w < 480 ? 230 / w : 0; gr0(); }; g.resize();
    var st = {a:0.2, b:0.42, t:0, ty:"cat", subs:["CH3", "CH3", "H"], beta:0, auto:true, ts:0, hover:-1, morph:1, fromTy:"cat"};
    var tS = k.seg("Intermédiaire", [["cat", "Carbocation"], ["rad", "Radical"], ["an", "Carbanion"]], "cat", function(v){ if (v !== st.ty){ st.fromTy = st.ty; st.ty = v; st.morph = 0; } });
    var nS = k.seg("Méthyles sur le carbone central", [["0", "0 · méthyle"], ["1", "1 · primaire"], ["2", "2 · secondaire"], ["3", "3 · tertiaire"]], "2", function(v){ var n = +v; st.subs = [0, 1, 2].map(function(i){ return i < n ? "CH3" : "H"; }); });
    var hT = k.toggle("Montrer l'hyperconjugaison (C–H alignées avec p)", true);
    var rT = k.toggle("Rotation automatique", true, function(v){ st.auto = v; });
    var ro = k.readouts(["Espèce", "Électrons de valence du C", "Géométrie (angle R–C–R)", "Orbitale non liante", "Liaisons C–H en α", "Mesure de stabilité"]);
    var nt = k.note("", "ok");
    var lastPr = null, lastIdx = [];
    dragView(c, st, function(p, type){
      if (!lastPr) return false;
      var hit = -1;
      lastIdx.forEach(function(ix, i){ var q = lastPr[ix]; if (q && Math.hypot(p.x - q.x, p.y - q.y) < 20) hit = i; });
      if (type === "move"){ st.hover = hit; c.cv.style.cursor = hit >= 0 ? "pointer" : "grab"; return false; }
      if (type === "down" && hit >= 0){
        st.subs[hit] = st.subs[hit] === "H" ? "CH3" : "H";
        nS.set(String(st.subs.filter(function(x){ return x === "CH3"; }).length)); k.redraw(); return true;
      }
      return type !== "down";
    });
    st.onview = function(){ st.auto = false; rT.set(false); };
    var R = rnd(11), FLO = [];
    for (var i = 0; i < 14; i++) FLO.push({x:R(), y:R(), r:R() * 6, v:(R() - 0.5) * 0.02, s:0.6 + R() * 0.8});
    var lp = k.loop(function(dt){
      st.t += dt; st.morph = Math.min(1, st.morph + dt * 0.9);
      var tb = INT[st.ty].beta; st.beta += (tb - st.beta) * Math.min(1, dt * 3);
      if (st.auto && !st.drag){ st.ts += dt; st.a = 0.2 + 0.4 * Math.sin(st.ts * 0.35); st.b = 0.42 + 0.12 * Math.sin(st.ts * 0.27); }
      FLO.forEach(function(f){ f.x = (f.x + f.v * dt + 1) % 1; f.r += dt * 0.3; });
      k.redraw();
    });
    lp.play();
    function geom(){
      var b = st.beta * DEG, at = [{el:"C", p:[0, 0, 0], r:0.5, lab:"C"}], bd = [], idx = [], hyp = [];
      [30, 150, 270].forEach(function(phd, i){
        var ph = phd * DEG, d = [Math.cos(b) * Math.cos(ph), -Math.sin(b), Math.cos(b) * Math.sin(ph)];
        if (st.subs[i] === "H"){ at.push({el:"H", p:mul(d, 1.09), r:0.3}); bd.push({a:0, b:at.length - 1}); idx.push(at.length - 1); return; }
        var cm = mul(d, 1.5); at.push({el:"C", p:cm, r:0.44}); var ci = at.length - 1; bd.push({a:0, b:ci}); idx.push(ci);
        var e1 = nrm(sub([0, 1, 0], mul(d, d[1]))), e2 = cross(d, e1), psi = st.t * 0.7 + i * 0.9;
        for (var q = 0; q < 3; q++){
          var an = psi + q * 2 * PI / 3, hd = add(mul(d, 1 / 3), mul(add(mul(e1, Math.cos(an)), mul(e2, Math.sin(an))), Math.sqrt(8) / 3));
          at.push({el:"H", p:add(cm, mul(hd, 1.09)), r:0.28}); bd.push({a:ci, b:at.length - 1});
          hyp.push({c:ci, h:at.length - 1, w:Math.pow(Math.cos(an), 2), up:Math.cos(an) > 0});
        }
      });
      return {at:at, bd:bd, idx:idx, hyp:hyp};
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, I = INT[st.ty], n = st.subs.filter(function(x){ return x === "CH3"; }).length;
      softBg(ctx, W, H, "#ffffff", st.ty === "cat" ? "#e3ebf7" : st.ty === "rad" ? "#f5ecdc" : "#f6e3e1");
      /* décor : molécules de solvant floues */
      FLO.forEach(function(f){ var x = f.x * W, y = f.y * H; ctx.save(); ctx.globalAlpha = 0.12; ctx.translate(x, y); ctx.rotate(f.r); ball(ctx, 0, 0, 7 * f.s, "#8fa3bc"); ball(ctx, 9 * f.s, 4 * f.s, 4 * f.s, "#c9d3df"); ball(ctx, -9 * f.s, 4 * f.s, 4 * f.s, "#c9d3df"); ctx.restore(); });
      var banH = ph ? 56 : 60, top = 30, area = H - banH - top - 16;
      var sc = Math.min(W / 5.4, area / 5.0), cx = W / 2, cy = top + area * 0.56, C = cam(st, sc, cx, cy, 0.04);
      floorShadow(ctx, cx, cy + sc * 2.3, sc * 2.6, sc * 0.35, 0.16);
      var G = geom(), at = G.at, extra = [], showH = hT.value, mr = ease(st.morph);
      /* hyperconjugaison : C–H alignées avec l'orbitale p (cation, radical) */
      var hypOn = showH && st.ty !== "an";
      if (hypOn) G.hyp.forEach(function(hh){ var a = at[hh.h]; a.glow = "#ffb300"; a.ga = 0.15 + 0.7 * hh.w; a.gr = 2.6; });
      G.bd.forEach(function(b){
        var hh = null; G.hyp.forEach(function(x){ if (x.h === b.b) hh = x; });
        if (hh && hypOn && hh.w > 0.25){ b.col = "#e09a00"; b.w = 1 + 0.5 * hh.w; }
      });
      if (st.ty === "an") G.idx.forEach(function(ix, i){ if (st.subs[i] === "CH3"){ var a = at[ix]; a.glow = "#c0392b"; a.ga = 0.25; a.gr = 2.4; } });
      /* orbitale non liante du carbone central */
      var pulse = 0.5 + 0.5 * Math.sin(st.t * 2.2), aOrb = 0.35 + 0.55 * mr;
      if (st.ty === "cat"){
        [[0, 1, 0], [0, -1, 0]].forEach(function(u){ var ctr = mul(u, 0.95); extra.push({z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, u, 0.95, 0.5, "#6fa0e8", aOrb, {empty:true}); }}); });
      } else if (st.ty === "rad"){
        [[0, 1, 0], [0, -1, 0]].forEach(function(u, j){ var ctr = mul(u, 0.95); extra.push({z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, u, 0.95, 0.5, "#f2c14e", aOrb * (0.55 + 0.1 * pulse)); }}); });
        var ey = 0.95 * Math.sin(st.t * 1.6), ep = [0.18 * Math.cos(st.t * 3), ey, 0.18 * Math.sin(st.t * 3)];
        extra.push({z:C.P(ep).z + 0.01, f:function(){ var q = C.P(ep); glowAt(ctx, q.x, q.y, 12, "#ffd23f", 0.8); ball(ctx, q.x, q.y, Math.max(3.5, sc * 0.09), "#7a4b00"); }});
      } else {
        var ctr = [0, 0.78, 0];
        extra.push({z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, [0, 1, 0], 0.9, 0.48, "#f08a5d", aOrb * 0.9); }});
        [[0.14, 1], [-0.14, 1]].forEach(function(o, j){ var ep = [o[0] * Math.cos(st.t * 2 + j * PI), 0.92 + 0.08 * Math.sin(st.t * 3 + j), o[0] * Math.sin(st.t * 2 + j * PI)]; extra.push({z:C.P(ep).z + 0.01, f:function(){ var q = C.P(ep); ball(ctx, q.x, q.y, Math.max(3.5, sc * 0.09), "#7a1f12"); }}); });
      }
      at[0].lab = st.ty === "cat" ? "C⁺" : st.ty === "rad" ? "C•" : "C⁻";
      at[0].glow = I.col; at[0].ga = 0.35 + 0.15 * pulse; at[0].gr = 2.6;
      var pr = renderMol(ctx, C, at, G.bd, extra);
      lastPr = pr; lastIdx = G.idx;
      /* électrons prêtés : points qui filent des C–H alignées vers l'orbitale p */
      if (hypOn){
        G.hyp.forEach(function(hh, j){
          if (hh.w < 0.3) return;
          var mid = lerp(at[hh.c].p, at[hh.h].p, 0.5), tgt = [0, hh.up ? 0.9 : -0.9, 0];
          for (var q = 0; q < 2; q++){
            var f = (st.t * 0.6 + q * 0.5 + j * 0.13) % 1, pp = C.P(lerp(mid, tgt, f));
            ctx.save(); ctx.globalAlpha = hh.w * Math.sin(f * PI) * (st.ty === "cat" ? 1 : 0.6); ctx.fillStyle = "#ffcc33"; ctx.strokeStyle = "#8a5a00"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(pp.x, pp.y, 3.2, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
          }
        });
      }
      /* effet donneur des méthyles sur le carbanion : flèches rouges vers le centre */
      if (st.ty === "an") G.idx.forEach(function(ix, i){
        if (st.subs[i] !== "CH3") return;
        var p0 = pr[ix], p1 = pr[0], f = (st.t * 0.8 + i * 0.3) % 1, x = p0.x + (p1.x - p0.x) * (0.2 + 0.55 * f), y = p0.y + (p1.y - p0.y) * (0.2 + 0.55 * f);
        ctx.save(); ctx.globalAlpha = Math.sin(f * PI); ctx.fillStyle = "#c0392b"; ctx.beginPath(); ctx.arc(x, y, 3.4, 0, 7); ctx.fill(); ctx.restore();
      });
      /* étiquettes */
      var pc = pr[0], lz = ph ? 11 : 12;
      var tipY = C.P([0, st.ty === "an" ? 1.75 : 1.95, 0]);
      pill(ctx, st.ty === "cat" ? "orbitale p vide" : st.ty === "rad" ? "p : 1 électron" : "doublet (sp³)", tipY.x, Math.max(top + 10, tipY.y - 8), I.col, lz, W);
      G.idx.forEach(function(ix, i){ var q = pr[ix]; if (st.hover === i){ ctx.save(); ctx.strokeStyle = "#1f8a4c"; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(q.x, q.y, 18, 0, 7); ctx.stroke(); ctx.restore(); }
        if (st.subs[i] === "CH3") pill(ctx, "CH₃", q.x, q.y + sc * 0.62, "#2c3a4e", ph ? 10 : 11, W); });
      txt(ctx, I.nom + " " + CLS[n], 12, 15, ph ? 13 : 14, "#13233a", "left", 800);
      if (!ph) txt(ctx, "clique sur un H ou un CH₃ · glisse pour tourner", W - 10, 15, 11, "#8a95a3", "right", 700);
      var ang = intAngle(st.beta), angT = intAngle(I.beta);
      var main = FORM[n] + I.sym + " · " + I.ve + " électrons · " + I.geo + " (" + (st.ty === "rad" ? "≈ " + fmt(angT, 0) : fmt(angT, 1).replace(",0", "")) + "°)";
      var s2 = st.ty === "an" ? (n ? n + " méthyle" + (n > 1 ? "s" : "") + " donneur" + (n > 1 ? "s" : "") + " : ils renforcent la charge négative, le carbanion est moins stable." : "Aucun groupe donneur : c'est le carbanion le moins instable.")
        : (n ? 3 * n + " liaisons C–H en α prêtent des électrons à la p " + (st.ty === "cat" ? "vide" : "à moitié pleine") + " : stabilisation." : "Aucune C–H voisine : pas d'hyperconjugaison, l'espèce la moins stable.");
      banner(ctx, 10, H - banH - 8, W - 20, banH, main, s2, I.col);
      /* --- lectures --- */
      ro.set(0, FORM[n] + I.sym + " (" + I.nom + " " + CLS[n] + ")");
      ro.set(1, I.ve + " (charge formelle " + (st.ty === "cat" ? "+1" : st.ty === "rad" ? "0" : "−1") + ")");
      ro.set(2, I.geo + ", " + (st.ty === "rad" ? "≈ " + fmt(angT, 0) : fmt(angT, 1).replace(",0", "")) + "°");
      ro.set(3, I.orb + " (" + I.hyb + ")");
      ro.set(4, String(3 * n) + (st.ty === "an" ? " (ici sans effet stabilisant)" : ""));
      if (I.vals) ro.set(5, I.grand + " : " + I.vals[n] + " kJ/mol");
      else ro.set(5, "ordre qualitatif (pas de valeur fiable)");
      var msg = st.ty === "cat" ? "Le carbocation n'a que 6 électrons autour du carbone : son orbitale p est vide. Chaque liaison C–H d'un méthyle voisin, quand elle est alignée avec cette p, y déverse un peu de sa densité électronique. Plus il y a de méthyles, plus le cation est stable : il faut moins d'énergie pour arracher H⁻ à R–H (" + I.vals[n] + " kJ/mol ici, contre " + I.vals[0] + " pour CH₃⁺)."
        : st.ty === "rad" ? "Le radical a 7 électrons : un seul dans la p. L'hyperconjugaison le stabilise aussi, mais moins que le cation. On le voit sur l'énergie de la liaison C–H qu'on casse pour le former : " + I.vals[n] + " kJ/mol ici, contre " + I.vals[0] + " pour CH₃•."
        : "Le carbanion a 8 électrons : le carbone devient sp³ et pyramidal, le doublet occupe le 4e sommet du tétraèdre. Les méthyles donneurs (+I) poussent encore des électrons vers un carbone déjà chargé négativement : chaque méthyle déstabilise. Ordre inversé : CH₃⁻ > primaire > secondaire > tertiaire.";
      nt.set(msg + (st.ty === "an" ? " <i>Ordre qualitatif, valable en solution ; les flèches rouges illustrent l'effet donneur des méthyles.</i>" : " <i>Valeurs en phase gazeuse (" + (st.ty === "cat" ? "affinité de R⁺ pour H⁻" : "énergie de dissociation R–H") + "). La rotation des méthyles et le flux d'électrons sont une illustration.</i>"), st.ty === "an" && n ? "warn" : "ok");
      drawLadder(g, st.ty, n);
    });
    function drawLadder(g, ty, n){
      var ctx = g.ctx, W = g.W, H = g.H, ph = W < 480, I = INT[ty];
      ctx.clearRect(0, 0, W, H); var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#fbfcfe"); bg.addColorStop(1, "#eef2f7"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      txt(ctx, ty === "an" ? "Stabilité des carbanions (ordre qualitatif)" : "Énergie relative de l'intermédiaire (par rapport au méthyle)", 12, 14, ph ? 11 : 12, "#2c3a4e", "left", 800);
      var L = ph ? 40 : 60, R = W - 16, T = 38, B = H - 40, cw = (R - L) / 4;
      var rel = I.vals ? I.vals.map(function(v){ return v - I.vals[0]; }) : [0, 1, 2, 3];
      var lo = I.vals ? Math.min.apply(null, rel) : 0, hi = I.vals ? 0 : 3;
      function Y(v){ return ty === "an" ? B - (v - lo) / (hi - lo) * (B - T) : T + (0 - v) / (0 - lo) * (B - T); }
      ctx.save(); ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L - 10, T - 6); ctx.lineTo(L - 10, B + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(L - 10, T - 10); ctx.lineTo(L - 14, T - 2); ctx.lineTo(L - 6, T - 2); ctx.closePath(); ctx.fillStyle = "#a3adba"; ctx.fill(); ctx.restore();
      txt(ctx, "E", L - 22, T, 11, "#5f6b7a", "center", 800);
      for (var i = 0; i < 4; i++){
        var x0 = L + i * cw + 6, x1 = L + (i + 1) * cw - 6, y = Y(rel[i]), sel = i === n;
        if (i){ ctx.save(); ctx.strokeStyle = "rgba(95,107,122,.5)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x0 - 12, Y(rel[i - 1])); ctx.lineTo(x0, y); ctx.stroke(); ctx.restore(); }
        var gg = ctx.createLinearGradient(0, y - 5, 0, y + 5); gg.addColorStop(0, shade(sel ? I.col : "#7b8694", 0.4)); gg.addColorStop(1, shade(sel ? I.col : "#7b8694", -0.25));
        ctx.save(); if (sel){ ctx.shadowColor = rgba(I.col, 0.5); ctx.shadowBlur = 10; } ctx.fillStyle = gg; rr(ctx, x0, y - 4, x1 - x0, 8, 4); ctx.fill(); ctx.restore();
        var lab = ty === "an" ? "" : (rel[i] === 0 ? "0" : fmt(rel[i], 0));
        if (lab) txt(ctx, lab, (x0 + x1) / 2, y - 13, ph ? 10.5 : 11.5, sel ? I.col : "#5f6b7a", "center", 800);
        txt(ctx, CLS[i], (x0 + x1) / 2, B + 18, ph ? 10 : 11.5, sel ? "#13233a" : "#5f6b7a", "center", sel ? 800 : 700);
        txt(ctx, FORM[i] + I.sym, (x0 + x1) / 2, B + 31, ph ? 9.5 : 10.5, sel ? I.col : "#8a95a3", "center", 700);
      }
      var unitT = ty === "an" ? "plus bas = plus stable" : "kJ/mol · plus bas = plus stable";
      txt(ctx, unitT, W - 12, 30, ph ? 9.5 : 10.5, "#8a95a3", "right", 700);
    }
  }
});

/* ====================================================================== */
/* 3. E2 : H et groupe partant anti-périplanaires (L18)                    */
/* ====================================================================== */
var SQ8 = Math.sqrt(8) / 3;
/* direction d'un substituant (azimut θ dans la projection de Newman, vue depuis C2) ; side −1 : carbone avant C2, +1 : carbone arrière C3 */
function nwDir(th, side){ var t = th * DEG; return [side / 3, SQ8 * Math.sin(t), -SQ8 * Math.cos(t)]; }
function angN(x){ x = ((x % 360) + 360) % 360; return x; }
function dihed(x){ x = angN(x); return x > 180 ? 360 - x : x; }   /* angle dièdre ramené entre 0 et 180° */
/* p-menthane : cycle 0 (C–Cl), 1 (C–iPr), 2, 3, 4 (C–CH₃), 5 */
var MEN = {
  neo:{nom:"chlorure de néomenthyle", clFace:1, prod:[{j:1, n:"3-menthène", pc:75, zai:true}, {j:5, n:"2-menthène", pc:25}], v:"≈ 200"},
  men:{nom:"chlorure de menthyle", clFace:-1, prod:[{j:5, n:"2-menthène", pc:100}], v:"1"}
};
var RING_R = 1.4426, RING_H = 0.255;
SFA.sim({
  id:"org-e2-antiperiplanaire-3d", ch:"L18", tag:"Élimination",
  titre:"E2 : H et groupe partant anti-périplanaires",
  resume:"Un 2-bromobutane en 3D avec sa projection de Newman : tourne la liaison C2–C3, l'E2 ne part que lorsqu'un H est à 180° du Br, et donne le (E)- ou le (Z)-but-2-ène selon le H. Second décor : les chlorures de menthyle et de néomenthyle, où le Cl doit être axial.",
  but:"Fais tourner le carbone arrière (C3) en glissant dans la projection de Newman, ou avec le curseur ; laisse la rotation automatique pour voir l'E2 partir toute seule. La base EtO⁻ n'arrache un H que s'il est anti-périplanaire au Br (angle dièdre de 180°). Compare le produit obtenu avec Ha et avec Hb. Dans le second décor, regarde si le Cl est axial, quels H sont en anti, et pourquoi le chlorure de menthyle doit d'abord inverser sa chaise. Glisse ailleurs pour tourner la molécule.",
  aRetenir:"L'E2 est concertée : la base arrache H pendant que la liaison C–X se rompt et que la double liaison se forme. Les orbitales C–H et C–X doivent être parallèles : H et X anti-périplanaires (dièdre 180°). Le H choisi fixe la géométrie de l'alcène : avec le (2R)-2-bromobutane, le H qui met les deux CH₃ en anti donne le (E)-but-2-ène (majoritaire), l'autre le (Z). Sur un cyclohexane, H et X doivent être tous deux axiaux (trans-diaxiaux). Néomenthyle : Cl déjà axial, deux H anti → 3-menthène (Zaitsev, ≈ 75 %) et 2-menthène (≈ 25 %), réaction rapide. Menthyle : Cl équatorial, il faut la chaise où les trois groupes sont axiaux, un seul H anti → 2-menthène seul, environ 200 fois plus lentement.",
  piege:"La règle de Zaitsev (alcène le plus substitué) ne s'applique que si un H anti est disponible : la géométrie passe avant. Un H en gauche (60°) ne réagit pas en E2, même s'il est tout proche du Br. Et sur un cycle, « trans » ne suffit pas : il faut trans-diaxial, ce qui dépend de la chaise. Ici, on ne regarde que les H de C3 (le 2-bromobutane donne aussi du but-1-ène avec les H de C1).",
  build:function(k, S){
    var c = respCanvas(k, 0.88, 1.28);
    var st = {a:0.55, b:0.28, t:0, ts:0, mode:"bb", psi:300, auto:true, rx:0, rxOn:false, rxH:null, hold:0, fail:0,
              iso:"neo", f:0, fT:0, ph:0, demo:0, cnt:0, ngrab:false, lastAng:0};
    var mS = k.seg("Molécule", [["bb", "2-bromobutane"], ["men", "Chlorures de menthyle"]], "bb", function(v){ st.mode = v; reset(); });
    var dS = k.slider("Angle dièdre Br–C2–C3–CH₃", -180, 180, 1, -150, "°", function(v){ st.psi = angN(v + 90); st.auto = false; aT.set(false); reset(); });
    var iS = k.seg("Isomère", [["neo", "néomenthyle (Cl axial)"], ["men", "menthyle (Cl équatorial)"]], "neo", function(v){ st.iso = v; reset(); });
    var cS = k.seg("Chaise affichée", [["0", "la plus stable"], ["1", "inversée"]], "0", function(v){ st.fT = +v; st.auto = false; aT.set(false); st.rx = 0; st.rxOn = false; });
    var aT = k.toggle("Démonstration automatique", true, function(v){ st.auto = v; reset(); });
    k.button("Lancer l'E2 (ajouter EtO⁻)", function(){ tryE2(); }, true);
    var roB = k.readouts(["Dièdre Br–C2–C3–Ha", "Dièdre Br–C2–C3–Hb", "Dièdre entre les deux CH₃", "E2 possible ?", "Produit"]);
    var roM = k.readouts(["Cl dans la chaise affichée", "H anti-périplanaires au Cl", "Groupes axiaux", "Produit(s) de l'E2", "Vitesse relative (menthyle = 1)"]);
    var nt = k.note("", "ok");
    var CTL = k.ctrl.querySelectorAll(".ctl");
    function reset(){ st.rx = 0; st.rxOn = false; st.hold = 0; st.fail = 0; st.ph = 0; st.demo = 0; if (st.mode === "men"){ st.f = 0; st.fT = 0; cS.set("0"); } }
    function antiH(){ /* H de C3 anti au Br (θ = 270°) */
      var da = dihed(st.psi + 120 - 90), db = dihed(st.psi + 240 - 90);
      return da > 170 ? "a" : db > 170 ? "b" : null;
    }
    function menState(){
      var M = MEN[st.iso], sig0 = 1 - 2 * st.f, clAx = M.clFace * sig0 > 0.9;
      return {clAx:clAx};
    }
    function tryE2(){
      if (st.rxOn) return;
      if (st.mode === "bb"){
        var h = null, da = dihed(st.psi + 120 - 90), db = dihed(st.psi + 240 - 90);
        if (da > 165) h = "a"; else if (db > 165) h = "b";
        if (!h){ st.fail = 1.6; return; }
        st.psi = h === "a" ? 150 : 30; dS.set(dihed2(st.psi)); st.rxH = h; st.rx = 0; st.rxOn = true;
      } else {
        var ms = menState();
        if (!ms.clAx){ st.fail = 1.6; return; }
        var P = MEN[st.iso].prod; st.rxH = P.length > 1 ? (st.cnt % 4 === 3 ? P[1] : P[0]) : P[0]; st.cnt++;
        st.rx = 0; st.rxOn = true;
      }
    }
    function dihed2(psi){ var d = angN(psi - 90); return d > 180 ? d - 360 : d; }
    /* glisser dans la projection de Newman = tourner C3 ; ailleurs = tourner la vue */
    var NW = null;
    dragView(c, st, function(p, type){
      if (st.mode !== "bb" || !NW) return false;
      var inN = Math.hypot(p.x - NW.x, p.y - NW.y) < NW.r * 1.9;
      if (type === "move"){ c.cv.style.cursor = inN ? "grab" : "default"; return false; }
      if (type === "down"){ if (!inN || st.rxOn) return false; st.ngrab = true; st.lastAng = Math.atan2(-(p.y - NW.y), p.x - NW.x) / DEG; st.auto = false; aT.set(false); return true; }
      if (type === "drag" && st.ngrab){
        var an = Math.atan2(-(p.y - NW.y), p.x - NW.x) / DEG, d = an - st.lastAng; if (d > 180) d -= 360; if (d < -180) d += 360;
        st.psi = angN(st.psi - d); st.lastAng = an; dS.set(dihed2(st.psi)); return true;
      }
      if (type === "up"){ st.ngrab = false; var h = antiH(); if (h) tryE2(); }
      return true;
    });
    st.spin = true; st.onview = function(){ st.spin = false; };
    var lp = k.loop(function(dt){
      st.t += dt; if (st.fail > 0) st.fail = Math.max(0, st.fail - dt);
      if (!st.drag && st.spin){ st.ts += dt; st.a = 0.55 + 0.3 * Math.sin(st.ts * 0.3); }
      if (st.rxOn){
        if (st.rx < 1) st.rx = Math.min(1, st.rx + dt / 3.4);
        else { st.hold += dt; if (st.hold > 1.8){ st.rxOn = false; st.rx = 0; st.hold = 0; if (st.mode === "bb") { st.psi = angN(st.psi + 12); dS.set(dihed2(st.psi)); } else if (st.auto){ st.f = 0; st.fT = 0; cS.set("0"); st.ph = 0; st.demo = 0; } } }
      } else if (st.mode === "bb" && st.auto){
        var before = st.psi; st.psi = angN(st.psi + 34 * dt); dS.set(dihed2(st.psi));
        [["a", 150], ["b", 30]].forEach(function(q){ var d0 = angN(q[1] - before), d1 = angN(q[1] - st.psi); if (d0 < 30 && d1 > 300){ st.psi = q[1]; tryE2(); } });
      } else if (st.mode === "men"){
        if (st.auto){
          st.demo += dt;
          if (st.iso === "neo"){ st.fT = 0; if (st.demo > 1.8) { tryE2(); st.demo = 0; } }
          else { if (st.demo > 1.6 && st.fT !== 1){ st.fT = 1; cS.set("1"); } if (st.f >= 0.999 && st.demo > 4.6){ tryE2(); st.demo = 0; } }
        }
        st.f += clamp(st.fT - st.f, -dt * 0.45, dt * 0.45);
      }
      k.redraw();
    });
    lp.play();
    var GC = "#1f9d6b", GV = "#7a4fc9";
    /* ---------- 2-bromobutane ---------- */
    function bbAtoms(){
      var r = st.rxOn ? st.rx : 0, u = ease(seg01(r, 0.3, 0.85)), sep = ease(seg01(r, 0.72, 1));
      var at = [], bd = [];
      function A(el, p, o){ o = o || {}; o.el = el; o.p = p; at.push(o); return at.length - 1; }
      var dCC = 1.54 - 0.2 * u, C2 = A("C", [-dCC / 2, 0, 0], {lab:"C2"}), C3 = A("C", [dCC / 2, 0, 0], {lab:"C3"});
      bd.push({a:C2, b:C3, o:u > 0.5 ? 2 : 1, col:u > 0.5 ? "#2a6fdb" : null});
      function flat(th, side){ var z = -Math.cos(th * DEG); return nrm([side * 0.5, 0, z >= 0 ? 0.866 : -0.866]); }
      function subPos(cI, th, side, L, leave){
        var d0 = nwDir(th, side), d = leave ? d0 : nrm(lerp(d0, flat(th, side), u));
        return add(at[cI].p, mul(d, L));
      }
      /* avant : Br (90°), CH₃ = C1 (210°), H (330°) */
      var brDir = nwDir(90, -1), brP = add(at[C2].p, mul(brDir, 1.94 + 1.5 * ease(seg01(r, 0.4, 1))));
      var Br = A("Br", brP, {lab:r > 0.6 ? "Br⁻" : "Br", r:0.62}); bd.push({a:C2, b:Br, al:1 - ease(seg01(r, 0.35, 0.7)), dash:r > 0.3, col:"#9a2a1c"});
      var C1 = A("C", subPos(C2, 210, -1, 1.53), {lab:"C1"}); bd.push({a:C2, b:C1});
      var H2 = A("H", subPos(C2, 330, -1, 1.09)); bd.push({a:C2, b:H2});
      /* arrière : C4 (ψ), Ha (ψ + 120), Hb (ψ + 240) */
      var ths = {c4:st.psi, a:st.psi + 120, b:st.psi + 240}, leaving = st.rxOn ? st.rxH : null;
      var C4 = A("C", subPos(C3, ths.c4, 1, 1.53), {lab:"C4"}); bd.push({a:C3, b:C4});
      var hI = {};
      ["a", "b"].forEach(function(h){
        var pos;
        if (h === leaving){ var d0 = nwDir(ths[h], 1), hp0 = add(at[C3].p, mul(d0, 1.09)); pos = add(hp0, mul(d0, 0.9 * ease(seg01(r, 0.3, 0.7)) + 1.2 * sep)); }
        else pos = subPos(C3, ths[h], 1, 1.09);
        hI[h] = A("H", pos, {ring:h === "a" ? GC : GV, r:0.3});
        bd.push({a:C3, b:hI[h], al:h === leaving ? 1 - ease(seg01(r, 0.35, 0.65)) : 1, dash:h === leaving && r > 0.3});
      });
      /* H des méthyles */
      [[C1, C2], [C4, C3]].forEach(function(pq){
        var u0 = nrm(sub(at[pq[1]].p, at[pq[0]].p));
        tetraSlots([u0], [0, 1, 0]).forEach(function(d){ var h = A("H", add(at[pq[0]].p, mul(d, 1.09)), {r:0.24}); bd.push({a:pq[0], b:h, w:0.8}); });
      });
      /* base EtO⁻ : arrive dans l'axe de la liaison C3–H anti */
      var base = null;
      var bAl = st.rxOn ? 1 : st.fail > 0 ? 1 : 0;
      if (bAl){
        var target, dirH;
        if (st.rxOn){ dirH = nwDir(ths[leaving], 1); target = add(add(at[C3].p, mul(dirH, 1.09)), mul(dirH, 1.05)); }
        else { dirH = nwDir(270, 1); target = add(add(at[C3].p, mul(dirH, 1.09)), mul(dirH, 1.3)); }
        var far = add(target, mul(dirH, 2.4)), appr = st.rxOn ? ease(seg01(r, 0, 0.3)) : Math.sin(clamp((1.6 - st.fail) / 1.6, 0, 1) * PI) * 0.75;
        var oP = add(lerp(far, target, appr), mul(dirH, st.rxOn ? 1.2 * sep : 0));
        var O = A("O", oP, {lab:"O", glow:"#c0392b", ga:st.rxOn ? 0.5 * (1 - u) : 0.5, gr:2.4});
        var cE = A("C", add(oP, mul(nrm(add(dirH, [0, 0.6, 0.4])), 1.43)), {r:0.42}); bd.push({a:O, b:cE});
        var cE2 = A("C", add(at[cE].p, mul(nrm(add(dirH, [0.6, -0.3, 0])), 1.53)), {r:0.42}); bd.push({a:cE, b:cE2});
        if (st.rxOn && leaving) bd.push({a:O, b:hI[leaving], al:ease(seg01(r, 0.35, 0.7)), dash:r < 0.7});
        base = {O:O, dirH:dirH};
      }
      return {at:at, bd:bd, C2:C2, C3:C3, Br:Br, C1:C1, C4:C4, hI:hI, base:base, u:u, r:r};
    }
    function drawNewman(ctx, x, y, R0, ph){
      NW = {x:x, y:y, r:R0};
      var Lc = R0 * 1.7, hw = Lc + 24, hh = Lc + 40;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.94)"; ctx.strokeStyle = "#d9e0ea"; ctx.shadowColor = "rgba(15,27,45,.12)"; ctx.shadowBlur = 10;
      rr(ctx, x - hw, y - hh, 2 * hw, 2 * hh, 14); ctx.fill(); ctx.shadowColor = "transparent"; ctx.stroke(); ctx.restore();
      txt(ctx, "Newman (C2 devant)", x, y - hh + 11, ph ? 10 : 11, "#2c3a4e", "center", 800);
      function P(th, rr0){ var t = th * DEG; return {x:x - Math.cos(t) * rr0, y:y - Math.sin(t) * rr0}; }
      var h = antiH(), L = R0 * 1.7, items = [];
      /* arrière (C3) */
      [[st.psi, "CH₃", "#4a5568", "C4"], [st.psi + 120, "Ha", GC, "a"], [st.psi + 240, "Hb", GV, "b"]].forEach(function(q){
        var p0 = P(q[0], R0), p1 = P(q[0], L);
        ctx.save(); ctx.strokeStyle = "#8693a3"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.restore();
        items.push([p1, q[1], q[2], q[3]]);
      });
      var dg = ctx.createRadialGradient(x - R0 * 0.3, y - R0 * 0.3, 2, x, y, R0);
      dg.addColorStop(0, "#ffffff"); dg.addColorStop(1, "#d9e2ee");
      ctx.save(); ctx.fillStyle = dg; ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, R0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      /* avant (C2) */
      [[90, "Br", COL.Br], [210, "CH₃", "#4a5568"], [330, "H", "#9aa6b6"]].forEach(function(q){
        var p1 = P(q[0], L);
        ctx.save(); ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.restore();
        items.push([p1, q[1], q[2], "f"]);
      });
      if (h){ var pa = P(90, L), pb = P(270, L); ctx.save(); ctx.strokeStyle = "#1f8a4c"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke(); ctx.restore(); }
      items.forEach(function(it){
        var rad = it[1] === "Br" ? 10 : it[1].charAt(0) === "H" ? 7.5 : 9.5, col = it[2];
        ball(ctx, it[0].x, it[0].y, rad, it[1] === "Ha" || it[1] === "Hb" || it[1] === "H" ? "#e8edf3" : col);
        if (it[3] === "a" || it[3] === "b"){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(it[0].x, it[0].y, rad + 2.5, 0, 7); ctx.stroke(); ctx.restore(); }
        var lx = it[0].x + (it[0].x - x) / L * 14, ly = it[0].y + (it[0].y - y) / L * 14;
        ctx.save(); ctx.font = "800 " + (ph ? 10 : 11) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.strokeText(it[1], lx, ly); ctx.restore();
        txt(ctx, it[1], lx, ly, ph ? 10 : 11, it[3] === "a" ? GC : it[3] === "b" ? GV : "#13233a", "center", 800);
      });
      /* arc d'angle entre Br et le H le plus proche de l'anti */
      var dH = dihed(st.psi + 120 - 90) > dihed(st.psi + 240 - 90) ? "a" : "b", dv = dihed(st.psi + (dH === "a" ? 120 : 240) - 90);
      txt(ctx, "Br / " + (dH === "a" ? "Ha" : "Hb") + " : " + fmt(dv, 0) + "°", x, y + hh - 11, ph ? 10.5 : 11.5, h ? "#1f8a4c" : "#5f6b7a", "center", 800);
    }
    /* ---------- chlorures de menthyle ---------- */
    function menAtoms(){
      var M = MEN[st.iso], r = st.rxOn ? st.rx : 0, u = ease(seg01(r, 0.3, 0.85)), sep = ease(seg01(r, 0.72, 1)), jj = st.rxOn ? st.rxH.j : -1;
      var at = [], bd = [], ring = [], sig = [];
      function A(el, p, o){ o = o || {}; o.el = el; o.p = p; at.push(o); return at.length - 1; }
      for (var i = 0; i < 6; i++){
        var ph0 = (90 + 60 * i) * DEG, s0 = (i % 2 === 0 ? 1 : -1) * (1 - 2 * st.f);
        sig.push(s0); ring.push(A("C", [RING_R * Math.cos(ph0), s0 * RING_H, RING_R * Math.sin(ph0)], {r:0.42, col:"#363d49"}));
      }
      for (i = 0; i < 6; i++){ var j2 = (i + 1) % 6, dbl = st.rxOn && ((i === 0 && j2 === jj) || (j2 === 0 && i === jj)) && u > 0.5; bd.push({a:ring[i], b:ring[j2], o:dbl ? 2 : 1, col:dbl ? "#2a6fdb" : null}); }
      function fdir(i, face){
        var ph0 = (90 + 60 * i) * DEG, rad = [Math.cos(ph0), 0, Math.sin(ph0)], w = (face * sig[i] + 1) / 2;
        var eq = add(mul(rad, 0.943), [0, face * 0.333, 0]), ax = [0, face, 0];
        return nrm(lerp(eq, ax, w));
      }
      function isAx(i, face){ return face * sig[i] > 0.9; }
      var info = {ring:ring, sig:sig, ax:[], cl:null, H:{}};
      /* Cl */
      var cf = M.clFace, cd = fdir(0, cf), clP = add(at[ring[0]].p, mul(cd, 1.79 + 2.6 * ease(seg01(r, 0.4, 1))));
      info.cl = A("Cl", clP, {lab:r > 0.6 ? "Cl⁻" : "Cl", r:0.56, glow:isAx(0, cf) ? "#2fa84f" : null, ga:0.35, gr:2.2});
      bd.push({a:ring[0], b:info.cl, al:1 - ease(seg01(r, 0.35, 0.7)), dash:r > 0.3, col:"#2fa84f"});
      if (isAx(0, cf)) info.ax.push("Cl");
      /* substituants : [atome, face, type] */
      var subs = [[0, -cf, "H"], [1, 1, "iPr"], [1, -1, "H"], [2, 1, "H"], [2, -1, "H"], [3, 1, "H"], [3, -1, "H"], [4, -1, "Me"], [4, 1, "H"], [5, 1, "H"], [5, -1, "H"]];
      subs.forEach(function(sb){
        var i = sb[0], face = sb[1], d = fdir(i, face), base = at[ring[i]].p;
        if (sb[2] === "H"){
          var anti = isAx(0, cf) && (i === 1 || i === 5) && face === -cf && isAx(i, face);
          var leaving = st.rxOn && i === jj && face === -cf;
          var pos = add(base, mul(d, 1.09 + (leaving ? 0.9 * ease(seg01(r, 0.3, 0.7)) + 1.0 * sep : 0)));
          var hi = A("H", pos, {r:anti ? 0.32 : 0.26, glow:anti ? "#1f9d6b" : null, ga:0.55, gr:2.6, ring:anti ? "#1f9d6b" : null});
          bd.push({a:ring[i], b:hi, w:0.85, al:leaving ? 1 - ease(seg01(r, 0.35, 0.65)) : 1, dash:leaving && r > 0.3});
          if (anti) info.H[i] = {i:hi, d:d};
        } else if (sb[2] === "Me"){
          var me = A("C", add(base, mul(d, 1.53)), {r:0.46, col:"#7d8fa8"}); bd.push({a:ring[i], b:me}); info.me = me;
          if (isAx(i, face)) info.ax.push("CH₃");
        } else {
          var ci = A("C", add(base, mul(d, 1.53)), {r:0.44, col:"#7d8fa8"}); bd.push({a:ring[i], b:ci}); info.ipr = ci;
          var sl = tetraSlots([mul(d, -1)], [0, 1, 0]);
          [sl[1], sl[2]].forEach(function(e){ var m = A("C", add(at[ci].p, mul(e, 1.53)), {r:0.42, col:"#7d8fa8"}); bd.push({a:ci, b:m}); });
          var hh = A("H", add(at[ci].p, mul(sl[0], 1.09)), {r:0.24}); bd.push({a:ci, b:hh, w:0.8});
          if (isAx(i, face)) info.ax.push("iPr");
        }
      });
      /* base EtO⁻ */
      if (st.rxOn || st.fail > 0){
        var dirH, target;
        if (st.rxOn){ dirH = fdir(jj, -cf); target = add(at[ring[jj]].p, mul(dirH, 2.15)); }
        else { dirH = [0, -cf, 0]; target = add(at[ring[1]].p, mul(dirH, 2.4)); }
        var far = add(target, mul(dirH, 2.2)), appr = st.rxOn ? ease(seg01(r, 0, 0.3)) : Math.sin(clamp((1.6 - st.fail) / 1.6, 0, 1) * PI) * 0.75;
        var oP = add(lerp(far, target, appr), mul(dirH, st.rxOn ? 1.0 * sep : 0));
        var O = A("O", oP, {lab:"O", glow:"#c0392b", ga:0.45, gr:2.4});
        var cE = A("C", add(oP, mul(nrm(add(dirH, [0.7, 0, 0.3])), 1.43)), {r:0.4}); bd.push({a:O, b:cE});
        info.O = O; info.dirH = dirH;
      }
      return {at:at, bd:bd, info:info, u:u, r:r};
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, bb = st.mode === "bb";
      [1].forEach(function(ix){ if (CTL[ix]) CTL[ix].style.display = bb ? "" : "none"; });
      [2, 3].forEach(function(ix){ if (CTL[ix]) CTL[ix].style.display = bb ? "none" : ""; });
      roB.el.style.display = bb ? "" : "none"; roM.el.style.display = bb ? "none" : "";
      softBg(ctx, W, H, "#ffffff", "#e5ebf4");
      /* décor : paillasse vue de loin (bandes floues) */
      var fl = ctx.createLinearGradient(0, H * 0.72, 0, H); fl.addColorStop(0, "rgba(180,195,214,0)"); fl.addColorStop(1, "rgba(180,195,214,.35)"); ctx.fillStyle = fl; ctx.fillRect(0, H * 0.72, W, H * 0.28);
      var banH = ph ? 56 : 60, top = 30;
      if (bb) drawBB(ctx, W, H, ph, banH, top); else drawMen(ctx, W, H, ph, banH, top);
    });
    function drawBB(ctx, W, H, ph, banH, top){
      var G = bbAtoms(), at = G.at, nR = ph ? 30 : 36, nx = W - nR * 1.7 - 34, ny = top + nR * 1.7 + 42;
      var area = H - banH - top - 16, sc = Math.min(W / 6.4, area / 7.0), cx = ph ? W * 0.4 : W * 0.38, cy = top + area * (ph ? 0.66 : 0.52);
      var C = cam(st, sc, cx, cy, 0.04);
      floorShadow(ctx, cx, cy + sc * 2.4, sc * 3, sc * 0.4, 0.14);
      var pr = renderMol(ctx, C, at, G.bd, []);
      var h = antiH(), lz = ph ? 10.5 : 11.5;
      /* étiquettes Ha / Hb */
      ["a", "b"].forEach(function(q){ var p0 = pr[G.hI[q]]; if (at[G.hI[q]].al === 0) return; pill(ctx, q === "a" ? "Ha" : "Hb", p0.x + 16, p0.y - 14, q === "a" ? GC : GV, lz, W); });
      /* axe anti-périplanaire */
      if ((h || st.rxOn) && G.r < 0.35){
        var hh = st.rxOn ? st.rxH : h, pB = pr[G.Br], pH = pr[G.hI[hh]];
        ctx.save(); ctx.strokeStyle = "rgba(31,138,76,.75)"; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(pB.x, pB.y); ctx.lineTo(pH.x, pH.y); ctx.stroke(); ctx.restore();
        pill(ctx, "anti-périplanaire : 180°", (pB.x + pH.x) / 2 + 60, (pB.y + pH.y) / 2, "#1f8a4c", lz, W);
      }
      /* flèches du mécanisme */
      if (st.rxOn && G.base){
        var fa = G.r < 0.45 ? 1 - G.r / 0.45 : 0, pO = pr[G.base.O], pHh = pr[G.hI[st.rxH]], p2 = pr[G.C2], p3 = pr[G.C3], pB2 = pr[G.Br];
        curly(ctx, pO.x, pO.y - 10, pHh.x, pHh.y + 8, 20, "#c0392b", fa);
        curly(ctx, (pHh.x + p3.x) / 2, (pHh.y + p3.y) / 2, (p2.x + p3.x) / 2, (p2.y + p3.y) / 2 + 6, 22, "#2a6fdb", fa);
        curly(ctx, (p2.x + pB2.x) / 2, (p2.y + pB2.y) / 2, pB2.x + 10, pB2.y - 12, -22, "#9a2a1c", fa);
        pill(ctx, "EtO⁻", pO.x, pO.y + 24, "#c0392b", lz, W);
      }
      if (st.fail > 0 && G.base){ var pO2 = pr[G.base.O]; pill(ctx, "✗ aucun H anti : pas d'E2", pO2.x, pO2.y + 24, "#c0392b", lz, W, {shadow:true}); }
      drawNewman(ctx, nx, ny, nR, ph);
      txt(ctx, "(2R)-2-bromobutane + EtO⁻", 12, 15, ph ? 13 : 14, "#13233a", "left", 800);
      if (!ph) txt(ctx, "glisse dans le Newman pour tourner C3 · ailleurs pour tourner la vue", 12, 32, 10.5, "#8a95a3", "left", 700);
      /* lectures */
      var da = dihed(st.psi + 120 - 90), db = dihed(st.psi + 240 - 90), dm = dihed(st.psi - 210);
      var prodH = st.rxOn ? st.rxH : h, prodN = prodH === "a" ? "(Z)-but-2-ène" : prodH === "b" ? "(E)-but-2-ène" : "—";
      roB.set(0, fmt(da, 0) + "°" + (da > 170 ? " (anti)" : da < 15 ? " (éclipsé, syn)" : Math.abs(da - 60) < 15 ? " (gauche)" : Math.abs(da - 120) < 15 ? " (éclipsé)" : ""));
      roB.set(1, fmt(db, 0) + "°" + (db > 170 ? " (anti)" : db < 15 ? " (éclipsé, syn)" : Math.abs(db - 60) < 15 ? " (gauche)" : Math.abs(db - 120) < 15 ? " (éclipsé)" : ""));
      roB.set(2, fmt(dm, 0) + "°" + (dm > 170 ? " (anti)" : dm < 15 ? " (éclipsé, syn)" : Math.abs(dm - 60) < 15 ? " (gauche)" : Math.abs(dm - 120) < 15 ? " (éclipsé)" : ""));
      roB.set(3, h || st.rxOn ? "oui : " + ((st.rxOn ? st.rxH : h) === "a" ? "Ha" : "Hb") + " anti au Br" : "non (aucun H à 180°)");
      roB.set(4, prodN);
      var main, s2, col;
      if (st.rxOn && G.r > 0.75){ main = prodN + " + EtOH + Br⁻"; s2 = st.rxH === "a" ? "Ha anti : les deux CH₃ étaient en gauche (60°), ils se retrouvent du même côté : alcène Z, minoritaire." : "Hb anti : les deux CH₃ étaient en anti (180°), ils se retrouvent de part et d'autre : alcène E, majoritaire."; col = "#2a6fdb"; }
      else if (st.rxOn){ main = "E2 en cours : tout se passe en une étape"; s2 = "EtO⁻ arrache " + (st.rxH === "a" ? "Ha" : "Hb") + ", la liaison C=C se forme pendant que Br⁻ part de l'autre côté."; col = "#c0392b"; }
      else if (h){ main = (h === "a" ? "Ha" : "Hb") + " et Br anti-périplanaires"; s2 = "Les orbitales C–H et C–Br sont parallèles : l'E2 peut partir."; col = "#1f8a4c"; }
      else { main = "Pas de H à 180° du Br"; s2 = "Tourne C3 jusqu'à amener Ha ou Hb en face du Br (dièdre 180°)."; col = "#8a95a3"; }
      banner(ctx, 10, H - banH - 8, W - 20, banH, main, s2, col);
      nt.set("Projection de Newman le long de C2–C3 : C2 devant (Br en haut), C3 derrière. L'E2 exige un dièdre H–C–C–Br de 180° (ici accepté à ± 10°). Avec le (2R)-2-bromobutane, Ha anti donne le (Z)-but-2-ène et Hb anti le (E)-but-2-ène ; la conformation qui mène au E (CH₃ en anti) est la moins encombrée, d'où un alcène E majoritaire. <i>Géométrie schématique ; les autres conformations restent possibles, mais elles ne réagissent pas.</i>", "ok");
    }
    function drawMen(ctx, W, H, ph, banH, top){
      var G = menAtoms(), I = G.info, at = G.at, M = MEN[st.iso];
      var area = H - banH - top - 16, sc = Math.min(W / 7.4, area / 7.2), cx = W * (ph ? 0.46 : 0.42), cy = top + area * 0.56;
      var Cm = cam({a:st.a - 0.25, b:st.b + 0.24}, sc, cx, cy, 0.04);
      floorShadow(ctx, cx, cy + sc * 2.6, sc * 3.2, sc * 0.45, 0.14);
      var ringItem = {z:-99, f:function(){
        var q = I.ring.map(function(ix){ return Cm.P(at[ix].p); });
        ctx.save(); ctx.beginPath(); q.forEach(function(pp, j){ if (j) ctx.lineTo(pp.x, pp.y); else ctx.moveTo(pp.x, pp.y); }); ctx.closePath();
        ctx.fillStyle = "rgba(42,111,219,.10)"; ctx.fill(); ctx.strokeStyle = "rgba(42,111,219,.25)"; ctx.lineWidth = 6; ctx.lineJoin = "round"; ctx.stroke(); ctx.restore();
      }};
      var pr = renderMol(ctx, Cm, at, G.bd, [ringItem]);
      var lz = ph ? 10.5 : 11.5, clAx = M.clFace * (1 - 2 * st.f) > 0.9;
      var pc = pr[I.cl]; if (pc) pill(ctx, clAx ? "Cl axial" : (Math.abs(1 - 2 * st.f) > 0.9 ? "Cl équatorial" : "Cl"), pc.x + 30, pc.y - 14, "#1f7a3c", lz, W);
      if (I.ipr != null){ var pi = pr[I.ipr]; pill(ctx, "iPr", pi.x, pi.y - sc * 0.6, "#2c3a4e", ph ? 9.5 : 10.5, W); }
      if (I.me != null){ var pm = pr[I.me]; pill(ctx, "CH₃", pm.x, pm.y + sc * 0.55, "#2c3a4e", ph ? 9.5 : 10.5, W); }
      Object.keys(I.H).forEach(function(j){ var q = pr[I.H[j].i]; if (!st.rxOn) pill(ctx, "H anti", q.x + 26, q.y + 10, "#1f8a4c", lz, W);
        if (!st.rxOn && pc){ ctx.save(); ctx.strokeStyle = "rgba(31,138,76,.6)"; ctx.lineWidth = 1.8; ctx.setLineDash([5, 5]); var p0 = pr[I.ring[0]], p1 = pr[I.ring[+j]]; ctx.beginPath(); ctx.moveTo(pc.x, pc.y); ctx.lineTo(p0.x, p0.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore(); } });
      if (st.rxOn && I.O != null){ var po = pr[I.O]; pill(ctx, "EtO⁻", po.x, po.y + 22, "#c0392b", lz, W); }
      if (st.fail > 0 && I.O != null){ var po2 = pr[I.O]; pill(ctx, "✗ Cl équatorial : aucun H anti", po2.x, po2.y + 24, "#c0392b", lz, W, {shadow:true}); }
      /* carte des produits */
      var cw = ph ? 150 : 172, chh = M.prod.length > 1 ? 92 : 74, kx = W - cw - 10, ky = top + 4;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.94)"; ctx.strokeStyle = "#d9e0ea"; ctx.shadowColor = "rgba(15,27,45,.12)"; ctx.shadowBlur = 10; rr(ctx, kx, ky, cw, chh, 12); ctx.fill(); ctx.shadowColor = "transparent"; ctx.stroke(); ctx.restore();
      txt(ctx, "Produits (EtO⁻)", kx + 10, ky + 13, ph ? 10.5 : 11.5, "#2c3a4e", "left", 800);
      M.prod.forEach(function(pq, i){
        var yy = ky + 32 + i * 22, bw = (cw - 20) * pq.pc / 100, on = st.rxOn && st.rxH === pq;
        ctx.save(); var gg = ctx.createLinearGradient(kx + 10, 0, kx + 10 + bw, 0); gg.addColorStop(0, on ? "#2a6fdb" : "#8fb0e6"); gg.addColorStop(1, on ? "#1d4fa8" : "#6f93cf"); ctx.fillStyle = gg; rr(ctx, kx + 10, yy - 8, Math.max(4, bw), 16, 6); ctx.fill(); ctx.restore();
        txt(ctx, pq.n + " ≈ " + pq.pc + " %", kx + 14, yy, ph ? 9.5 : 10.5, pq.pc > 40 ? "#fff" : "#13233a", "left", 800);
      });
      txt(ctx, "vitesse relative : " + M.v, kx + 10, ky + chh - 11, ph ? 9.5 : 10.5, "#5f6b7a", "left", 700);
      txt(ctx, M.nom, 12, 15, ph ? 13 : 14, "#13233a", "left", 800);
      /* lectures */
      var sg = 1 - 2 * st.f, flat = Math.abs(sg) < 0.9;
      roM.set(0, flat ? "inversion en cours" : clAx ? "axial" : "équatorial");
      var nA = Object.keys(I.H).length;
      roM.set(1, flat ? "—" : nA ? nA + " (sur C" + Object.keys(I.H).map(function(j){ return +j === 1 ? "4" : "2"; }).join(" et C") + ")" : "0");
      roM.set(2, flat ? "—" : I.ax.length ? I.ax.join(", ") : "aucun");
      roM.set(3, M.prod.map(function(pq){ return pq.n + " (≈ " + pq.pc + " %)"; }).join(" + "));
      roM.set(4, M.v);
      var main, s2, col;
      if (st.rxOn && G.r > 0.75){ main = st.rxH.n + " + EtOH + Cl⁻"; s2 = st.rxH.j === 1 ? "H anti sur C4 : double liaison C3=C4, trisubstituée (Zaitsev), majoritaire." : "H anti sur C2 : double liaison C2=C3, disubstituée."; col = "#2a6fdb"; }
      else if (st.rxOn){ main = "E2 trans-diaxiale"; s2 = "EtO⁻ arrache le H axial pendant que le Cl axial part de l'autre côté du cycle."; col = "#c0392b"; }
      else if (flat){ main = "Inversion de la chaise"; s2 = "Les groupes axiaux deviennent équatoriaux et inversement (schéma simplifié qui passe par le plan)."; col = "#d98a00"; }
      else if (clAx){ main = "Cl axial : " + nA + " H anti-périplanaire" + (nA > 1 ? "s" : ""); s2 = st.iso === "neo" ? "C'est la chaise la plus stable (iPr et CH₃ équatoriaux) : l'E2 est rapide et donne surtout le 3-menthène." : "Pour y arriver, iPr et CH₃ sont aussi axiaux : chaise très défavorisée, E2 lente, un seul H anti."; col = "#1f8a4c"; }
      else { main = "Cl équatorial : aucun H anti"; s2 = st.iso === "men" ? "Tous les groupes sont équatoriaux : chaise stable mais inerte en E2. Il faut inverser la chaise." : "Dans cette chaise, iPr et CH₃ sont axiaux et le Cl équatorial : pas d'E2."; col = "#8a95a3"; }
      banner(ctx, 10, H - banH - 8, W - 20, banH, main, s2, col);
      nt.set("Numérotation du p-menthane : Cl sur C3, isopropyle (iPr) sur C4, méthyle sur C1. L'E2 sur un cyclohexane exige H et Cl trans-diaxiaux. Néomenthyle : ≈ 75 % de 3-menthène et ≈ 25 % de 2-menthène ; menthyle : 2-menthène seul, environ 200 fois plus lentement. <i>Pourcentages et rapport de vitesse : ordres de grandeur expérimentaux (éthanolate de sodium dans l'éthanol). Géométrie de la chaise et de l'inversion schématisée.</i>", "ok");
    }
  }
});

/* ====================================================================== */
/* 4. Diène conjugué + HBr : addition 1,2 ou 1,4 (c09)                     */
/* ====================================================================== */
/* modèle : rapport cinétique exp(ΔΔG‡/RT), équilibre exp(ΔG°/RT), part équilibrée f = 1 − exp(−k·t) avec k ∝ exp(−Ea/RT) */
var DI = {ddG:2.2, dG:4.5, Ea:70, kt40:6, R:8.314e-3};
function dieneModel(Tc){
  var T = Tc + 273.15, RT = DI.R * T;
  var r = Math.exp(DI.ddG / RT), K = Math.exp(DI.dG / RT), pk = r / (1 + r), pt = 1 / (1 + K);
  var kt = DI.kt40 * Math.exp(-DI.Ea / DI.R * (1 / T - 1 / 313.15)), f = 1 - Math.exp(-kt);
  var p12 = (1 - f) * pk + f * pt;
  return {T:T, r:r, K:K, f:f, p12:p12, p14:1 - p12, pk:pk, pt:pt};
}
/* buta-1,3-diène s-trans dans le plan xz, orbitales p selon y */
function dieneBase(){
  var C = [[-0.735 - 0.67, 0, 1.16], [-0.735, 0, 0], [0.735, 0, 0], [0.735 + 0.67, 0, -1.16]];
  function dir(a){ return [Math.cos(a * DEG), 0, Math.sin(a * DEG)]; }
  var H = [
    {c:0, d:dir(180)}, {c:0, d:dir(60)},        /* H de C1 */
    {c:1, d:dir(240)},                           /* H de C2 */
    {c:2, d:dir(60)},                            /* H de C3 */
    {c:3, d:dir(0)}, {c:3, d:dir(240)}           /* H de C4 */
  ];
  return {C:C, H:H};
}
SFA.sim({
  id:"org-diene-addition-12-14", ch:"c09", tag:"Diènes conjugués",
  titre:"Diène conjugué : addition 1,2 ou 1,4 selon la température",
  resume:"Le buta-1,3-diène en 3D avec ses quatre orbitales p alignées. HBr protone C1, la charge du cation allylique se partage entre C2 et C4, et Br⁻ choisit son carbone. Règle le thermomètre : à −80 °C le produit 1,2 domine (≈ 80 %), à 40 °C le 1,4 (≈ 85 %).",
  but:"Regarde l'addition se dérouler : H⁺ se fixe sur C1, le cation allylique répartit sa charge sur C2 et C4 (halos bleus), puis Br⁻ se lie à C2 (produit 1,2) ou à C4 (produit 1,4). Fais glisser le mercure du thermomètre (ou le curseur) et lis les pourcentages, le profil d'énergie et le type de contrôle. Le compteur montre les dernières additions ; glisse sur la molécule pour la tourner.",
  aRetenir:"Sur un diène conjugué, H⁺ s'additionne en bout de chaîne (C1) : il donne un cation allylique, stabilisé par mésomérie (charge partagée entre C2 et C4). Br⁻ attaque C2 → 3-bromobut-1-ène (addition 1,2) ou C4 → 1-bromobut-2-ène (addition 1,4). À basse température, la réaction est irréversible : le produit formé le plus vite l'emporte (contrôle cinétique : 1,2, barrière plus basse, Br⁻ près de C2 juste après la protonation). À plus haute température, les additions deviennent réversibles et l'équilibre s'installe : le produit le plus stable l'emporte (contrôle thermodynamique : 1,4, double liaison interne disubstituée).",
  piege:"Le produit cinétique n'est pas le plus stable : il est seulement formé plus vite. Et « 1,4 » ne veut pas dire que H et Br sont sur des carbones voisins : ils sont aux deux bouts de l'ancien diène, la double liaison s'est déplacée au milieu (C2=C3). Les pourcentages ne dépendent pas du temps une fois l'équilibre atteint, mais à basse température il faudrait un temps énorme pour l'atteindre.",
  build:function(k, S){
    var c = respCanvas(k, 0.8, 1.2), g = k.canvas(220), gr0 = g.resize;
    g.resize = function(){ var w = Math.max(260, (g.cv.parentNode ? g.cv.parentNode.clientWidth : 600) || 600); g.ratio = w < 480 ? 300 / w : 0; gr0(); }; g.resize();
    var st = {a:-0.25, b:0.5, t:0, ts:0, cyc:0, T:-80, acc:0.5, prod:null, tally:[], spin:true, thGrab:false};
    var tSl = k.slider("Température", -90, 60, 1, -80, "°C", function(v){ st.T = v; st.tally = []; });
    var oT = k.toggle("Orbitales p", true);
    var ro = k.readouts(["Produit 1,2 (3-bromobut-1-ène)", "Produit 1,4 (1-bromobut-2-ène)", "Contrôle", "Part de l'équilibre atteinte", "Rapport des vitesses k₁,₂ / k₁,₄", "Constante d'équilibre [1,4]/[1,2]"]);
    var nt = k.note("", "ok");
    var TH = null;
    function setT(v){ v = Math.round(clamp(v, -90, 60)); if (v !== st.T){ st.T = v; tSl.set(v); st.tally = []; } }
    dragView(c, st, function(p, type){
      if (!TH) return false;
      var inT = p.x > TH.x - 22 && p.x < TH.x + 22 && p.y > TH.y0 - 12 && p.y < TH.y1 + 14;
      if (type === "move"){ c.cv.style.cursor = inT ? "ns-resize" : "grab"; return false; }
      if (type === "down"){ if (!inT) return false; st.thGrab = true; setT(TH.inv(p.y)); return true; }
      if (type === "drag" && st.thGrab){ setT(TH.inv(p.y)); k.redraw(); return true; }
      if (type === "up") st.thGrab = false;
      return true;
    });
    st.onview = function(){ st.spin = false; };
    var CYC = 7.2;
    var lp = k.loop(function(dt){
      st.t += dt; st.cyc += dt;
      if (st.cyc >= CYC){ st.cyc -= CYC; st.prod = null; }
      if (st.prod === null && st.cyc > 2.4){
        var m = dieneModel(st.T); st.acc += m.p12;   /* répartition « par diffusion d'erreur » : la suite des produits suit les pourcentages */
        if (st.acc >= 1){ st.acc -= 1; st.prod = 12; } else st.prod = 14;
        st.tally.push(st.prod); if (st.tally.length > 20) st.tally.shift();
      }
      if (st.spin && !st.drag){ st.ts += dt; st.a = -0.25 + 0.35 * Math.sin(st.ts * 0.3); st.b = 0.5 + 0.1 * Math.sin(st.ts * 0.23); }
      k.redraw();
    });
    lp.play();
    function geom(){
      var B = dieneBase(), tt = st.cyc, at = [], bd = [], lobes = [];
      var pro = ease(seg01(tt, 1.2, 2.2)), att = ease(seg01(tt, 3.4, 4.6)), prod = st.prod, tgt = prod === 14 ? 3 : 1;
      function A(el, p, o){ o = o || {}; o.el = el; o.p = p; at.push(o); return at.length - 1; }
      var Ci = B.C.map(function(p, i){ return A("C", p.slice(), {lab:"C" + (i + 1), r:0.44}); });
      /* ordres de liaison : diène → cation allylique → produit */
      var o12 = pro < 0.5 ? 2 : 1, o23 = pro < 0.5 ? 1 : (att < 0.5 ? 1.5 : (prod === 14 ? 2 : 1)), o34 = pro < 0.5 ? 2 : (att < 0.5 ? 1.5 : (prod === 14 ? 1 : 2));
      bd.push({a:Ci[0], b:Ci[1], o:o12}, {a:Ci[1], b:Ci[2], o:o23, col:o23 > 1 ? "#2a6fdb" : null}, {a:Ci[2], b:Ci[3], o:o34, col:o34 > 1 ? "#2a6fdb" : null});
      B.H.forEach(function(h){
        var d = h.d, cA = B.C[h.c];
        if (h.c === 0) d = nrm(lerp(d, add(mul(d, 0.94), [0, -0.33, 0]), pro));
        if (h.c === tgt && prod) d = nrm(lerp(d, add(mul(d, 0.94), [0, -0.33, 0]), att));
        var hi = A("H", add(cA, mul(d, 1.09)), {r:0.28}); bd.push({a:Ci[h.c], b:hi, w:0.85});
      });
      /* HBr qui arrive, H⁺ qui passe sur C1 */
      var hbrIn = ease(seg01(tt, 0, 1.2)), hp0 = add(B.C[0], [-0.4, 3.6, 0.3]), hpC = add(B.C[0], [0, 1.09, 0]);
      var hP = lerp(lerp(add(hp0, [-1.5, 1.2, 0]), hp0, hbrIn), hpC, ease(seg01(tt, 1.2, 1.9)));
      var hi2 = A("H", hP, {r:0.3, glow:pro > 0.05 && pro < 0.95 ? "#ffd23f" : null, ga:0.7, gr:3});
      bd.push({a:Ci[0], b:hi2, al:pro, dash:pro < 0.9});
      /* Br : d'abord lié au H, puis Br⁻ libre au-dessus du cation, puis lié à C2 ou C4 */
      var brP = add(hP, [-0.6, 1.3, 0.2]);
      var hover = add(lerp(B.C[1], B.C[3], 0.5), [0, 3.0 + 0.25 * Math.sin(st.t * 2.5), 0]);
      if (tt > 1.2) brP = lerp(add(add(hpC, [-0.6, 1.3, 0.2]), [0, 0.6 * ease(seg01(tt, 1.2, 2.2)), 0]), hover, ease(seg01(tt, 2.0, 3.0)));
      if (prod && tt > 3.4) brP = lerp(hover, add(B.C[tgt], [0, 1.94, 0]), att);
      var bri = A("Br", brP, {lab:tt > 1.6 && att < 0.9 ? "Br⁻" : "Br", r:0.62, glow:tt > 1.6 && att < 0.9 ? "#9a2a1c" : null, ga:0.35, gr:2.2});
      bd.push({a:hi2, b:bri, al:1 - pro, col:"#9a2a1c"});
      if (prod) bd.push({a:Ci[tgt], b:bri, al:att, dash:att < 0.9, col:"#9a2a1c"});
      /* orbitales p : 4 sur le diène ; 3 sur le cation (C1 devient sp³) ; 2 sur le produit */
      var pOn = [1, 1, 1, 1].map(function(v, i){
        var a1 = i === 0 ? 1 - pro : 1;
        if (prod && i === tgt) a1 *= 1 - att;
        return a1;
      });
      if (prod === 12) pOn[0] = 0;
      B.C.forEach(function(p, i){ if (pOn[i] > 0.02) lobes.push({c:p, al:pOn[i], i:i}); });
      /* charge du cation allylique */
      var chg = pro * (1 - att);
      return {at:at, bd:bd, lobes:lobes, Ci:Ci, chg:chg, pro:pro, att:att, hi2:hi2, bri:bri, tgt:tgt};
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, m = dieneModel(st.T);
      /* fond : ballon de réaction dans un bain (bleu froid → orange chaud) */
      var hot = clamp((st.T + 90) / 150, 0, 1);
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, hot < 0.5 ? "#dbe8f7" : "#f7e6d6"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var banH = ph ? 56 : 60, top = 30, area = H - banH - top - 14;
      var thW = ph ? 46 : 60, mx0 = thW + 8, mw = W - mx0 - 6;
      /* thermomètre */
      var tx = 12 + thW / 2 - 6, ty0 = top + 22, ty1 = top + area - 18;
      var Yt = function(v){ return ty1 - (v + 90) / 150 * (ty1 - ty0); };
      TH = {x:tx, y0:ty0, y1:ty1, inv:function(y){ return -90 + (ty1 - y) / (ty1 - ty0) * 150; }};
      ctx.save(); rr(ctx, tx - 8, ty0 - 12, 16, ty1 - ty0 + 22, 8); var gt = ctx.createLinearGradient(tx - 8, 0, tx + 8, 0); gt.addColorStop(0, "#eef3f9"); gt.addColorStop(0.4, "#ffffff"); gt.addColorStop(1, "#c9d4e2"); ctx.fillStyle = gt; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      var mc = hot < 0.5 ? "#3b6ec2" : "#d6392f";
      ctx.save(); ctx.fillStyle = mc; rr(ctx, tx - 3.5, Yt(st.T), 7, ty1 - Yt(st.T) + 6, 3.5); ctx.fill(); ctx.restore();
      ball(ctx, tx, ty1 + 14, 12, mc);
      ctx.save(); ctx.font = "700 " + (ph ? 9 : 10) + "px " + FONT; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      for (var v = -80; v <= 60; v += 20){ var yy = Yt(v); ctx.fillRect(tx + 8, yy - 0.5, 5, 1); ctx.fillText(String(v).replace("-", "−"), tx + 15, yy); }
      ctx.restore();
      pill(ctx, fmt(st.T, 0) + " °C", tx + 8, Yt(st.T), mc, ph ? 10.5 : 11.5, 0, {align:"left", shadow:true, fill:"#fff"});
      /* bain : ellipse de liquide sous la molécule */
      var cx = mx0 + mw * 0.5, cy = top + area * 0.52;
      var sc = Math.min(mw / 5.4, area / 6.4), C = cam(st, sc, cx, cy, 0.04);
      floorShadow(ctx, cx, cy + sc * 2.3, sc * 3.0, sc * 0.45, 0.16);
      var G = geom(), at = G.at, extra = [];
      if (oT.value) G.lobes.forEach(function(lb){
        [[0, 1, 0], [0, -1, 0]].forEach(function(u, j){ var ctr = add(lb.c, mul(u, 0.72)); extra.push({z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, u, 0.72, 0.38, j ? "#7fa7e6" : "#f0b35e", 0.62 * lb.al); }}); });
      });
      if (G.chg > 0.02){ [1, 3].forEach(function(i){ var a = at[G.Ci[i]]; a.glow = "#2a6fdb"; a.ga = 0.55 * G.chg * (0.75 + 0.25 * Math.sin(st.t * 3 + i)); a.gr = 3; }); }
      var pr = renderMol(ctx, C, at, G.bd, extra);
      var lz = ph ? 10.5 : 11.5;
      if (G.chg > 0.3){ [1, 3].forEach(function(i){ var q = pr[G.Ci[i]]; pill(ctx, "δ+", q.x, q.y + sc * 1.3, "#2a56c6", lz, W); }); }
      if (st.prod && G.att > 0.95){ var qb = pr[G.bri]; pill(ctx, st.prod === 12 ? "produit 1,2" : "produit 1,4", qb.x - sc * 0.75, qb.y,  st.prod === 12 ? "#b26b00" : "#1f7a4c", lz, W, {shadow:true}); }
      /* compteur des dernières additions */
      var n12 = st.tally.filter(function(x){ return x === 12; }).length, n14 = st.tally.length - n12;
      var kw = ph ? 132 : 152, kx = W - kw - 8, ky = top - 2;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.93)"; ctx.strokeStyle = "#d9e0ea"; rr(ctx, kx, ky, kw, 50, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      txt(ctx, "dernières additions", kx + kw / 2, ky + 11, ph ? 9.5 : 10.5, "#5f6b7a", "center", 700);
      for (var q = 0; q < 20; q++){ var xq = kx + 8 + (q % 10) * ((kw - 16) / 10) + (kw - 16) / 20, yq = ky + 25 + Math.floor(q / 10) * 13, tq = st.tally[q]; if (tq) ball(ctx, xq, yq, 5, tq === 12 ? "#f0a030" : "#2fa36b"); else { ctx.save(); ctx.strokeStyle = "#c9d3df"; ctx.beginPath(); ctx.arc(xq, yq, 4.5, 0, 7); ctx.stroke(); ctx.restore(); } }
      txt(ctx, "1,2 : " + n12 + "  ·  1,4 : " + n14, kx + kw / 2, ky + 62, ph ? 10 : 11, "#2c3a4e", "center", 800);
      txt(ctx, "Buta-1,3-diène + HBr", mx0, 15, ph ? 13 : 14, "#13233a", "left", 800);
      var tt = st.cyc, main, s2, col;
      if (tt < 1.2){ main = "Le diène : 4 orbitales p alignées"; s2 = "Les deux doubles liaisons sont conjuguées ; HBr approche de C1."; col = "#2a6fdb"; }
      else if (tt < 2.2){ main = "H⁺ se fixe sur C1"; s2 = "Le carbocation formé est allylique : sa charge n'est pas sur un seul carbone."; col = "#d98a00"; }
      else if (tt < 3.4){ main = "Cation allylique : charge sur C2 et C4"; s2 = "Deux formes limites : CH₃–C⁺H–CH=CH₂ ↔ CH₃–CH=CH–C⁺H₂."; col = "#2a56c6"; }
      else if (st.prod === 12){ main = "Br⁻ sur C2 : 3-bromobut-1-ène (1,2)"; s2 = "Le plus rapide : Br⁻ est encore près de C2 et C2 porte la plus grande part de la charge."; col = "#b26b00"; }
      else { main = "Br⁻ sur C4 : 1-bromobut-2-ène (1,4)"; s2 = "Le plus stable : double liaison interne, disubstituée (C2=C3)."; col = "#1f7a4c"; }
      banner(ctx, 10, H - banH - 8, W - 20, banH, main, s2, col);
      /* lectures */
      var ctl = m.f < 0.2 ? "cinétique" : m.f > 0.8 ? "thermo\u00addynamique" : "mixte (équilibre partiel)";
      ro.set(0, fmt(m.p12 * 100, 0) + " %");
      ro.set(1, fmt(m.p14 * 100, 0) + " %");
      ro.set(2, ctl);
      ro.set(3, m.f < 0.005 ? "≈ 0 %" : fmt(m.f * 100, m.f < 0.1 ? 1 : 0) + " %");
      ro.set(4, fmt(m.r, 2));
      ro.set(5, fmt(m.K, 1));
      nt.set((m.f < 0.2 ? "À " + fmt(st.T, 0) + " °C, les additions sont pratiquement irréversibles : chaque molécule garde le produit qu'elle a formé en premier. Le 1,2 se forme " + fmt(m.r, 1) + " fois plus vite que le 1,4 : contrôle cinétique." :
        m.f > 0.8 ? "À " + fmt(st.T, 0) + " °C, Br⁻ peut se détacher et le cation se reformer : les deux produits s'interconvertissent jusqu'à l'équilibre, qui favorise le 1,4 (K = " + fmt(m.K, 1) + ") : contrôle thermodynamique." :
        "À " + fmt(st.T, 0) + " °C, l'équilibre n'est atteint qu'en partie (" + fmt(m.f * 100, 0) + " %) : le mélange est entre le rapport cinétique et le rapport d'équilibre.") +
        " <i>Modèle simplifié, calé sur les deux mesures classiques (−80 °C : ≈ 80 % de 1,2 ; 40 °C : ≈ 85 % de 1,4) : ΔΔG‡ = 2,2 kJ/mol entre les deux états de transition, ΔG° = 4,5 kJ/mol entre les produits, réversibilité qui croît avec T (Ea = 70 kJ/mol, durée de réaction fixée).</i>", "ok");
      drawProfile(g, m);
    });
    function drawProfile(g, m){
      var ctx = g.ctx, W = g.W, H = g.H, ph = W < 480;
      ctx.clearRect(0, 0, W, H); var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#fbfcfe"); bg.addColorStop(1, "#eef2f7"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var pw = ph ? W - 16 : W * 0.66, L = 34, R = pw - 10, T = 34, B = H - (ph ? 116 : 38);
      txt(ctx, "Profil d'énergie (schéma, petits écarts agrandis)", 12, 13, ph ? 11 : 12, "#2c3a4e", "left", 800);
      /* niveaux (unités arbitraires) */
      var E = {r:0.55, ts1:1.0, ci:0.68, ts12:0.86, ts14:0.95, p12:0.22, p14:0.05};
      function X(f){ return L + f * (R - L); } function Y(e){ return B - e * (B - T); }
      function seg2(x0, e0, x1, e1, col, w){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.beginPath(); for (var i = 0; i <= 30; i++){ var s0 = i / 30, sm = s0 * s0 * (3 - 2 * s0); var x = X(x0 + (x1 - x0) * s0), y = Y(e0 + (e1 - e0) * sm); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
      ctx.save(); ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L - 12, T - 4); ctx.lineTo(L - 12, B + 4); ctx.stroke(); ctx.restore();
      txt(ctx, "E", L - 22, T + 2, 11, "#5f6b7a", "center", 800);
      seg2(0.0, E.r, 0.17, E.ts1, "#5f6b7a"); seg2(0.17, E.ts1, 0.36, E.ci, "#5f6b7a");
      var c12 = "#e08a1e", c14 = "#2a9d63", w12 = 2 + 3 * m.p12, w14 = 2 + 3 * m.p14;
      seg2(0.36, E.ci, 0.52, E.ts12, c12, w12); seg2(0.52, E.ts12, 0.72, E.p12, c12, w12);
      seg2(0.36, E.ci, 0.6, E.ts14, c14, w14); seg2(0.6, E.ts14, 0.95, E.p14, c14, w14);
      var lz = ph ? 9.5 : 10.5;
      txt(ctx, "diène + HBr", X(0.02), Y(E.r) + 12, lz, "#5f6b7a", "left", 700);
      txt(ctx, "cation allylique", X(0.36), Y(E.ci) + 13, lz, "#2a56c6", "center", 700);
      txt(ctx, "1,2", X(0.72), Y(E.p12) + 12, lz + 1, c12, "center", 800);
      txt(ctx, "1,4", X(0.95), Y(E.p14) - 12, lz + 1, c14, "center", 800);
      /* écarts du modèle */
      ctx.save(); ctx.strokeStyle = "#7b8694"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(0.52), Y(E.ts12)); ctx.lineTo(X(0.66), Y(E.ts12)); ctx.moveTo(X(0.75), Y(E.p12)); ctx.lineTo(X(1.0), Y(E.p12)); ctx.stroke();
      ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(X(1.0), Y(E.p12) + 2); ctx.lineTo(X(1.0), Y(E.p14) - 2); ctx.stroke(); ctx.restore();
      txt(ctx, "ΔΔG‡ = 2,2", X(0.61), Y(E.ts14) - 12, lz, "#5f6b7a", "center", 800);
      txt(ctx, "ΔG° = 4,5 kJ/mol", X(1.0), Y(E.p14) + 14, lz, "#5f6b7a", "right", 800);
      /* barre des proportions */
      var bx, by, bw2, bh = 20;
      if (ph){ bx = 14; by = H - 84; bw2 = W - 28; } else { bx = W * 0.7; by = 70; bw2 = W * 0.3 - 14; }
      txt(ctx, "Mélange final à " + fmt(st.T, 0) + " °C", bx, by - 16, ph ? 11 : 11.5, "#2c3a4e", "left", 800);
      var w1 = bw2 * m.p12;
      ctx.save(); rr(ctx, bx, by, bw2, bh, 8); ctx.clip();
      var ga = ctx.createLinearGradient(0, by, 0, by + bh); ga.addColorStop(0, "#f6b25a"); ga.addColorStop(1, "#d97c12"); ctx.fillStyle = ga; ctx.fillRect(bx, by, w1, bh);
      var gb = ctx.createLinearGradient(0, by, 0, by + bh); gb.addColorStop(0, "#5cc58f"); gb.addColorStop(1, "#23885a"); ctx.fillStyle = gb; ctx.fillRect(bx + w1, by, bw2 - w1, bh);
      ctx.restore();
      if (w1 > 36) txt(ctx, fmt(m.p12 * 100, 0) + " %", bx + w1 / 2, by + bh / 2, 11, "#fff", "center", 800);
      if (bw2 - w1 > 36) txt(ctx, fmt(m.p14 * 100, 0) + " %", bx + w1 + (bw2 - w1) / 2, by + bh / 2, 11, "#fff", "center", 800);
      txt(ctx, "■ 1,2 (3-bromobut-1-ène)", bx, by + bh + 14, ph ? 10 : 10.5, c12, "left", 800);
      txt(ctx, "■ 1,4 (1-bromobut-2-ène)", bx, by + bh + 29, ph ? 10 : 10.5, c14, "left", 800);
      var ctl = m.f < 0.2 ? "contrôle cinétique" : m.f > 0.8 ? "contrôle thermodynamique" : "contrôle mixte";
      if (!ph) txt(ctx, ctl, bx, by + bh + 50, fitFont(ctx, ctl, bw2, 12, 800), m.f < 0.2 ? c12 : m.f > 0.8 ? c14 : "#5f6b7a", "left", 800);
    }
  }
});

})();
