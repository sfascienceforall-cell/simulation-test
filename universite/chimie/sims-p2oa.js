/* Chimie BA1 · chimie organique (c02, c10, L16) — lot P2-OA : simulations SFA originales, 3D dessinée à la main */
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
function angBetween(u, w){ return Math.acos(clamp(dot(nrm(u), nrm(w)), -1, 1)) / DEG; }
/* rotation d'un vecteur autour d'un axe unitaire (Rodrigues) */
function rotAx(v, k, ang){
  var c = Math.cos(ang), s = Math.sin(ang);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}
/* deux vecteurs unitaires perpendiculaires à u */
function basis(u){
  var t = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], v = nrm(cross(u, t)), w = cross(u, v);
  return [v, w];
}
/* matrices 3 × 3 (lignes) */
function mI(){ return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; }
function mMul(A, B){ var R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], i, j, q; for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) for (q = 0; q < 3; q++) R[i][j] += A[i][q] * B[q][j]; return R; }
function mV(M, v){ return [dot(M[0], v), dot(M[1], v), dot(M[2], v)]; }
function mAx(k, ang){ return [rotAx([1, 0, 0], k, ang), rotAx([0, 1, 0], k, ang), rotAx([0, 0, 1], k, ang)].reduce(function(R, col, j){ R[0][j] = col[0]; R[1][j] = col[1]; R[2][j] = col[2]; return R; }, [[0, 0, 0], [0, 0, 0], [0, 0, 0]]); }
function mOrtho(M){ /* ré-orthonormalise (Gram-Schmidt sur les colonnes) */
  var c0 = nrm([M[0][0], M[1][0], M[2][0]]), c1 = [M[0][1], M[1][1], M[2][1]];
  c1 = nrm(sub(c1, mul(c0, dot(c0, c1)))); var c2 = cross(c0, c1);
  return [[c0[0], c1[0], c2[0]], [c0[1], c1[1], c2[1]], [c0[2], c1[2], c2[2]]];
}

/* ---------- couleurs CPK et rayons d'affichage (Å) ---------- */
var COL = {C:"#4a5568", H:"#e8edf3", O:"#d6392f", N:"#3b6ec2", Cl:"#2fa84f"};
var RAD = {C:0.40, H:0.25, O:0.40, N:0.40, Cl:0.56};

/* ---------- dessin ---------- */
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function rgba(hex, a){ var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function mixHex(h1, h2, t){
  var a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
  function ch(s){ return Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t); }
  var v = (ch(16) << 16) | (ch(8) << 8) | ch(0);
  return "#" + ("000000" + v.toString(16)).slice(-6);
}
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
/* caméra : rotation (a autour de y, b autour de x), perspective douce */
function cam(st, sc, cx, cy, persp){
  var k = persp == null ? 0.045 : persp;
  return {sc:sc, cx:cx, cy:cy, P:function(p){ var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * k); return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s}; }};
}
/* inverse de la rotation de vue : axe écran → monde */
function unrot(v, a, b){
  var y = v[1] * Math.cos(b) + v[2] * Math.sin(b), z = -v[1] * Math.sin(b) + v[2] * Math.cos(b), x = v[0];
  return [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
}
function txt(ctx, s, x, y, size, col, align, weight){
  ctx.save(); ctx.font = (weight || 800) + " " + size + "px " + FONT; ctx.fillStyle = col || "#13233a";
  ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); ctx.restore();
}
function onBall(ctx, s, x, y, size){
  ctx.save(); ctx.font = "800 " + Math.round(size) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(s, x, y); ctx.fillStyle = "#fff"; ctx.fillText(s, x, y); ctx.restore();
}
/* étiquette sur pastille blanche */
function pill(ctx, s, x, y, col, size, W){
  ctx.save(); ctx.font = "800 " + size + "px " + FONT;
  var w = ctx.measureText(s).width + 14, h = size + 9;
  if (W) x = clamp(x, w / 2 + 4, W - w / 2 - 4);
  ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.strokeStyle = rgba(col, 0.55); ctx.lineWidth = 1.2;
  rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y + 0.5); ctx.restore();
}
function fitFont(ctx, s, maxW, size, weight){ var z = size; ctx.font = (weight || 800) + " " + z + "px " + FONT; while (z > 10 && ctx.measureText(s).width > maxW){ z -= 1; ctx.font = (weight || 800) + " " + z + "px " + FONT; } return z; }
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function wrapLines(ctx, s, maxW){
  var words = String(s).split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
/* bandeau en bas de la scène : titre + sous-titre */
function banner(ctx, W, y, h, main, sub2, col){
  ctx.save(); ctx.fillStyle = "rgba(255,255,255,.93)"; ctx.strokeStyle = "#d9e0ea"; ctx.lineWidth = 1; rr(ctx, 10, y, W - 20, h, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col || "#2a6fdb"; ctx.fillRect(10, y + 10, 4, h - 20);
  ctx.fillStyle = "#13233a"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var ph = W < 480, mz = fitFont(ctx, main, W - 50, ph ? 15 : 19, 800);
  if (!sub2){ ctx.fillText(main, W / 2, y + h / 2); ctx.restore(); return; }
  ctx.font = "700 " + (ph ? 11 : 12.5) + "px " + FONT;
  var L = wrapLines(ctx, sub2, W - 46).slice(0, 2), lh = ph ? 13 : 15, top = y + h / 2 - (mz + 4 + L.length * lh) / 2;
  ctx.font = "800 " + mz + "px " + FONT; ctx.fillText(main, W / 2, top + mz / 2);
  ctx.font = "700 " + (ph ? 11 : 12.5) + "px " + FONT; ctx.fillStyle = "#5f6b7a";
  L.forEach(function(l, i){ ctx.fillText(l, W / 2, top + mz + 4 + lh * (i + 0.5)); });
  ctx.restore();
}
function bondLine(ctx, p, q, w, col, o, dash, alpha){
  var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, ox = -dy / l, oy = dx / l;
  var offs = o === 2 ? [-w * 0.9, w * 0.9] : o === 3 ? [-w * 1.5, 0, w * 1.5] : [0];
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.lineCap = "round";
  offs.forEach(function(of){
    ctx.strokeStyle = col; ctx.lineWidth = o > 1 ? w * 0.62 : w; ctx.setLineDash(dash ? [w * 1.1, w * 1.2] : []);
    ctx.beginPath(); ctx.moveTo(p.x + ox * of, p.y + oy * of); ctx.lineTo(q.x + ox * of, q.y + oy * of); ctx.stroke();
  });
  ctx.restore();
}
/* liaison à deux couleurs (dégradé le long de la liaison) */
function bondGrad(ctx, p, q, w, c1, c2, o, alpha){
  var g = ctx.createLinearGradient(p.x, p.y, q.x, q.y); g.addColorStop(0, c1); g.addColorStop(1, c2);
  bondLine(ctx, p, q, w, g, o, false, alpha);
}
function softBg(ctx, W, H, c0, c1){
  var bg = ctx.createRadialGradient(W * 0.5, H * 0.38, 10, W * 0.5, H * 0.45, Math.max(W, H) * 0.75);
  bg.addColorStop(0, c0 || "#ffffff"); bg.addColorStop(1, c1 || "#e6ecf4"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}
function floorShadow(ctx, x, y, rx, ry, a){
  ctx.save(); var g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, "rgba(15,27,45," + (a || 0.16) + ")"); g.addColorStop(1, "rgba(15,27,45,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore();
}
/* directions tétraédriques libres autour d'un atome (E : liaisons déjà posées, ref : pour décaler) */
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
    items.push({z:(p.z + q.z) / 2 - 0.01, f:function(){
      var w = Math.max(2.2, C.sc * 0.1);
      if (b.c1) bondGrad(ctx, p, q, w, b.c1, b.c2, b.o || 1, al); else bondLine(ctx, p, q, w, b.col || "#8693a3", b.o || 1, b.dash, al);
    }});
  });
  atoms.forEach(function(a, i){
    var al = a.al == null ? 1 : a.al; if (al <= 0.02) return;
    var p = pr[i], r = Math.max(a.el === "H" ? 4 : 6, (a.r || RAD[a.el]) * C.sc * 0.82 * p.s);
    a._r = r;
    items.push({z:p.z, f:function(){
      if (a.glow){ var g = ctx.createRadialGradient(p.x, p.y, r * 0.4, p.x, p.y, r * (a.gr || 2.4)); g.addColorStop(0, rgba(a.glow, (a.ga == null ? 0.45 : a.ga) * al)); g.addColorStop(1, rgba(a.glow, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * (a.gr || 2.4), 0, 7); ctx.fill(); }
      ball(ctx, p.x, p.y, r, a.col || COL[a.el], al);
      if (a.ring){ ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = a.ring; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, r + 3, 0, 7); ctx.stroke(); ctx.restore(); }
      if (a.lab && r > 8){ ctx.save(); ctx.globalAlpha = al; onBall(ctx, a.lab, p.x, p.y, Math.max(9, r * 0.8)); ctx.restore(); }
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
/* lobe ellipsoïdal (orbitale) : centre, axe u (demi-longueur a), v (b), w (c) */
function lobe(ctx, C, ctr, u, a, v, b, w, cc, col, alpha){
  if (alpha <= 0.01 || a <= 0.01) return;
  var pts = [], i, j;
  for (i = 0; i <= 10; i++) for (j = 0; j < 14; j++){
    var th = PI * i / 10, ph = 2 * PI * j / 14;
    pts.push(C.P(add(ctr, add(mul(u, a * Math.cos(th)), add(mul(v, b * Math.sin(th) * Math.cos(ph)), mul(w, cc * Math.sin(th) * Math.sin(ph)))))));
  }
  var H = hull2(pts), pc = C.P(ctr), R = 0; H.forEach(function(p){ R = Math.max(R, Math.hypot(p.x - pc.x, p.y - pc.y)); });
  ctx.save(); ctx.globalAlpha = alpha;
  var g = ctx.createRadialGradient(pc.x - R * 0.25, pc.y - R * 0.3, R * 0.05, pc.x, pc.y, R);
  g.addColorStop(0, shade(col, 0.6)); g.addColorStop(0.6, col); g.addColorStop(1, shade(col, -0.3));
  ctx.fillStyle = g; ctx.beginPath(); H.forEach(function(p, k){ if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = shade(col, -0.35); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
/* lobe orienté selon un axe u (v, w calculés) — renvoie un objet triable {z, f} */
function lobeItem(ctx, C, ctr, u, a, b, col, alpha){
  var bw = basis(u);
  return {z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, u, a, bw[0], b, bw[1], b, col, alpha); }};
}
/* canevas qui change de proportion sur téléphone */
function respCanvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 600 ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
function dragView(c, st, hit){
  c.pointer(function(type, p){
    if (type === "down"){ if (hit && hit(p, "down")) { st.lx = null; st.grab = true; return; } st.grab = false; st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.grab && hit){ hit(p, "drag"); return; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, st.bmin == null ? -1.45 : st.bmin, st.bmax == null ? 1.45 : st.bmax); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ if (st.grab && hit) hit(p, "up"); st.lx = null; st.drag = false; st.grab = false; }
  });
}
function fmt(x, d){ var m = Math.pow(10, d), v = Math.sign(x) * Math.round(Math.abs(x) * m + 1e-7) / m, s = v.toFixed(d); if (/^-0[.,]?0*$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); }

/* ====================================================================== */
/* 1. Orbitales hybrides du carbone en 3D (c02)                            */
/* ====================================================================== */
var E2S = -19.4, E2P = -10.7;   /* énergies des orbitales de valence du carbone (eV, ordre de grandeur usuel) */
var HYB = {
  sp3:{n:3, nom:"sp³", ps:"25 %", ang:"109,5°", dCC:1.54, lib:"éthane H₃C–CH₃", form:"h = ½ (s + √3 p)", liais:"1 σ", nPi:0},
  sp2:{n:2, nom:"sp²", ps:"33 %", ang:"120°", dCC:1.34, lib:"éthène H₂C=CH₂", form:"h = (s + √2 p) / √3", liais:"1 σ + 1 π", nPi:1},
  sp:{n:1, nom:"sp", ps:"50 %", ang:"180°", dCC:1.20, lib:"éthyne HC≡CH", form:"h = (s + p) / √2", liais:"1 σ + 2 π", nPi:2}
};
/* directions des hybrides (la première vise +x, vers le 2e carbone) et axes des p restantes */
function hybDirs(key, side){
  var s = side || 1, out = [], i;
  if (key === "sp3"){
    out.push([s, 0, 0]);
    for (i = 0; i < 3; i++){ var ph = (90 + 120 * i + (side === -1 ? 60 : 0)) * DEG; out.push([-s / 3, Math.sqrt(8) / 3 * Math.cos(ph), Math.sqrt(8) / 3 * Math.sin(ph)]); }
    return {h:out, p:[]};
  }
  if (key === "sp2") return {h:[[s, 0, 0], [-s * 0.5, Math.sqrt(3) / 2, 0], [-s * 0.5, -Math.sqrt(3) / 2, 0]], p:[[0, 0, 1]]};
  return {h:[[s, 0, 0], [-s, 0, 0]], p:[[0, 0, 1], [0, 1, 0]]};
}
var PAX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], PNAME = ["2px", "2py", "2pz"];
/* orbitales p mélangées : sp → px ; sp² → px, py ; sp³ → px, py, pz */
function mixedP(key){ return key === "sp" ? [0] : key === "sp2" ? [0, 1] : [0, 1, 2]; }
function leftP(key){ return key === "sp" ? [2, 1] : key === "sp2" ? [2] : []; }
SFA.sim({
  id:"org-orbitales-hybrides-3d", ch:"c02", tag:"Hybridation",
  titre:"Orbitales hybrides du carbone en 3D",
  resume:"Mélange l'orbitale 2s du carbone avec une, deux ou trois orbitales 2p : les lobes hybrides naissent et s'écartent en ligne, en triangle ou en tétraèdre. Approche ensuite un second carbone et regarde naître la liaison σ (axiale) et les liaisons π (latérales).",
  but:"Choisis l'hybridation. Étape 1 : l'animation part des orbitales atomiques (2s en sphère, 2p en haltères) et les mélange ; les hybrides se forment puis s'écartent au maximum. Étape 2 : attrape le second carbone (ou utilise le curseur) et rapproche-le : les lobes qui se font face se recouvrent sur l'axe (σ), les orbitales p restées pures se recouvrent sur les côtés (π). Glisse ailleurs pour tourner la vue.",
  aRetenir:"Mélanger la 2s avec n orbitales 2p donne n + 1 hybrides identiques et laisse 3 − n orbitales p pures. sp³ (n = 3) : 4 hybrides à 109,5°, 25 % de caractère s, aucune p restante, seulement des liaisons σ (éthane). sp² (n = 2) : 3 hybrides à 120° dans un plan, 1 p perpendiculaire qui forme une liaison π (éthène). sp (n = 1) : 2 hybrides à 180°, 2 p perpendiculaires, deux liaisons π (éthyne). L'angle vient de cos θ = −1/n. Plus de caractère s = lobe plus proche du noyau : la liaison σ raccourcit un peu (C–H : 109 pm dans l'éthane, 106 pm dans l'éthyne). La liaison C–C raccourcit surtout parce que des liaisons π s'ajoutent (154, 134, 120 pm).",
  piege:"Une liaison π ne se forme jamais avec un hybride : elle demande deux orbitales p parallèles. Et l'hybridation ne crée pas d'orbitales en plus : quatre orbitales atomiques donnent toujours quatre orbitales (hybrides + p restantes).",
  build:function(k, S){
    var c = respCanvas(k, 0.70, 1.12), g = k.canvas(176);
    var st = {a:-0.55, b:0.32, t:0, d:3.4, auto:true, manualView:false};
    var hS = k.seg("Hybridation", [["sp3", "sp³ (2s + 3 × 2p)"], ["sp2", "sp² (2s + 2 × 2p)"], ["sp", "sp (2s + 2p)"]], "sp3", function(){ st.t = 0; st.d = 3.4; if (dS) dS.set(3.4); });
    var eS = k.seg("Étape", [["mix", "1 · Former les hybrides"], ["pair", "2 · Approcher un 2e carbone"]], "mix", function(v){ st.t = 0; st.d = 3.4; dS.set(3.4); st.b = v === "pair" ? -1.0 : 0.32; st.manualView = false; });
    var dS = k.slider("Distance entre les deux carbones", 1.2, 3.6, 0.01, 3.4, "Å", function(v){ st.auto = false; autoT.set(false); st.d = Math.max(v, HYB[hS.value].dCC); });
    var autoT = k.toggle("Animation en boucle", true, function(v){ st.auto = v; });
    var ro = k.readouts(["Hybrides formés", "Caractère s d'un hybride", "Angle entre hybrides", "Orbitales p restées pures", "Énergie d'un hybride (moyenne)", "Liaisons C–C"]);
    var nt = k.note("", "ok");
    var dBox = dS.el.closest(".ctl");
    /* attraper le 2e carbone */
    var lastC = null;
    dragView(c, st, function(p, type){
      if (eS.value !== "pair" || !lastC) return false;
      if (type === "down"){
        var q = lastC.P([st.d, 0, 0]);
        if (Math.hypot(p.x - q.x, p.y - q.y) < Math.max(26, lastC.sc * 0.55)){ st.auto = false; autoT.set(false); st.px = p.x; st.py = p.y; return true; }
        return false;
      }
      if (type === "drag"){
        var o = lastC.P([0, 0, 0]), e = lastC.P([1, 0, 0]), ux = e.x - o.x, uy = e.y - o.y, l2 = ux * ux + uy * uy || 1;
        st.d = clamp(st.d + ((p.x - st.px) * ux + (p.y - st.py) * uy) / l2, HYB[hS.value].dCC, 3.6); st.px = p.x; st.py = p.y; dS.set(st.d); k.redraw();
      }
      return true;
    });
    st.onview = function(){ st.manualView = true; };
    var lp = k.loop(function(dt){
      st.t += dt;
      if (!st.drag && !st.manualView){ if (eS.value === "pair") st.a = -0.42 + 0.32 * Math.sin(st.t * 0.35); else st.a += dt * 0.18; }
      if (eS.value === "pair" && st.auto){
        var T = st.t % 9, d0 = HYB[hS.value].dCC, u = T < 4 ? ease(T / 4) : T < 6.5 ? 1 : 1 - ease((T - 6.5) / 2.5);
        st.d = 3.4 + (d0 - 3.4) * u; dS.set(st.d);
      }
      k.redraw();
    });
    lp.play();
    /* avancement de l'animation de mélange (0 → atomiques, 1 → hybrides écartés) */
    function mixPhase(){
      if (!st.auto) return {m:1, s:1};
      var T = st.t % 10;
      var m = ease(seg01(T, 1.8, 3.6)), s = ease(seg01(T, 3.6, 5.2)), out = 1 - ease(seg01(T, 9.2, 10));
      return {m:m * out, s:s * out + 0 * (1 - out)};
    }
    function drawHybrids(items, ctx, C, key, ctr, side, grow, spread, alpha, faceIdx, fade){
      var D = hybDirs(key, side), H = HYB[key], hub = [0, 0.9, 0];
      D.h.forEach(function(dF, i){
        var d0 = nrm(add(mul(dF, 0.45), hub)), d = nrm(lerp(d0, dF, spread));
        var A = 0.95 * grow * (1 + 0.12 * (1 / (H.n + 1) - 0.25));   /* plus de caractère s : lobe un peu plus court */
        var al = alpha * (i === faceIdx && fade != null ? fade : 1);
        items.push(lobeItem(ctx, C, add(ctr, mul(d, A * 0.98)), d, A, 0.52 * grow, "#4d8af0", 0.62 * al));
        items.push(lobeItem(ctx, C, add(ctr, mul(d, -0.26 * grow)), d, 0.27 * grow, 0.26 * grow, "#e08a1e", 0.62 * al));
      });
      return D;
    }
    function drawP(items, ctx, C, axis, ctr, scale, alpha, cPlus, cMinus){
      items.push(lobeItem(ctx, C, add(ctr, mul(axis, 0.78 * scale)), axis, 0.78 * scale, 0.4 * scale, cPlus, alpha));
      items.push(lobeItem(ctx, C, add(ctr, mul(axis, -0.78 * scale)), axis, 0.78 * scale, 0.4 * scale, cMinus, alpha));
    }
    function nucleus(items, ctx, C, ctr, lab){
      var p = C.P(ctr);
      items.push({z:p.z + 0.02, f:function(){ var r = Math.max(9, C.sc * 0.2 * p.s); ball(ctx, p.x, p.y, r, COL.C); onBall(ctx, lab || "C", p.x, p.y, r * 0.95); }});
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, key = hS.value, Hh = HYB[key], pair = eS.value === "pair";
      dBox.style.display = pair ? "" : "none";
      softBg(ctx, W, H, "#ffffff", "#e4ebf5");
      var banH = ph ? 66 : 62, top = ph ? 34 : 30, area = H - banH - top - 14;
      var sc = pair ? Math.min(W * 0.92 / (st.d + 4.4), area * 0.25) : Math.min(W * 0.22, area * (ph ? 0.25 : 0.28));
      var cxw = pair ? -st.d / 2 : 0;
      var C = cam(st, sc, W / 2, top + area * 0.5, 0.03);
      lastC = C;
      /* décalage pour centrer la paire */
      var Cc = {sc:sc, P:function(p){ return C.P(add(p, [cxw, 0, 0])); }};
      lastC = Cc;
      floorShadow(ctx, W / 2, top + area * 0.97, Math.min(W * 0.36, area * 0.6), area * 0.045, 0.14);
      var items = [], mp = mixPhase(), fP = 1 - mp.m;
      if (!pair){
        /* orbitales atomiques qui s'effacent pendant le mélange */
        if (fP > 0.01){
          var sr = 0.95 * (0.6 + 0.4 * fP);
          items.push({z:-0.5, f:function(){
            var q = Cc.P([0, 0, 0]), R = sr * Cc.sc * q.s;
            ctx.save(); ctx.globalAlpha = 0.34 * fP;
            var gg = ctx.createRadialGradient(q.x - R * 0.3, q.y - R * 0.35, R * 0.05, q.x, q.y, R);
            gg.addColorStop(0, "#d6e4ff"); gg.addColorStop(0.6, "#4d8af0"); gg.addColorStop(1, "#2a56c6");
            ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(q.x, q.y, R, 0, 7); ctx.fill(); ctx.restore();
          }});
          mixedP(key).forEach(function(ix){ drawP(items, ctx, Cc, PAX[ix], [0, 0, 0], 0.65 + 0.35 * fP, 0.5 * fP, "#4d8af0", "#e08a1e"); });
        }
        leftP(key).forEach(function(ix){ drawP(items, ctx, Cc, PAX[ix], [0, 0, 0], 1, 0.5, "#37a86b", "#b6dc78"); });
        if (mp.m > 0.01) drawHybrids(items, ctx, Cc, key, [0, 0, 0], 1, mp.m, mp.s, 1);
        nucleus(items, ctx, Cc, [0, 0, 0]);
        items.sort(function(x, y){ return x.z - y.z; }).forEach(function(o){ o.f(); });
        /* étiquettes */
        var lz = ph ? 11 : 12.5;
        if (fP > 0.5){
          var p0 = Cc.P([0, 0, 0]);
          pill(ctx, "2s", p0.x - sc * 0.72, p0.y + sc * 0.7, "#2a56c6", lz, W);
          mixedP(key).forEach(function(ix){ var q = Cc.P(mul(PAX[ix], 1.75)); pill(ctx, PNAME[ix], q.x, q.y, "#2a56c6", lz, W); });
        }
        leftP(key).forEach(function(ix){ var q = Cc.P(mul(PAX[ix], -1.75)); pill(ctx, PNAME[ix] + " pure", q.x, q.y, "#1f7a4c", lz, W); });
        if (mp.s > 0.95){
          /* arc d'angle entre deux hybrides */
          var D = hybDirs(key, 1).h, u = D[0], w = D[1], n = cross(u, w), pts = [];
          if (len(n) < 1e-6) n = [0, 0, 1]; n = nrm(n);
          var ang = Math.acos(clamp(dot(u, w), -1, 1));
          for (var i = 0; i <= 24; i++){ pts.push(Cc.P(mul(rotAx(u, n, ang * i / 24), 0.95))); }
          ctx.save(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]); ctx.beginPath();
          pts.forEach(function(q, j){ if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.restore();
          var mid = Cc.P(mul(nrm(rotAx(u, n, ang / 2)), 1.3));
          pill(ctx, Hh.ang, mid.x, mid.y, "#13233a", ph ? 12 : 14, W);
          var hp = Cc.P(mul(D[0], 2.25)); pill(ctx, "hybride " + Hh.nom, hp.x, hp.y, "#2a56c6", lz, W);
        }
        txt(ctx, mp.m < 0.05 ? "Orbitales atomiques du carbone" : mp.s < 0.95 ? "Mélange : 2s + " + Hh.n + " × 2p → " + (Hh.n + 1) + " hybrides " + Hh.nom : (Hh.n + 1) + " hybrides " + Hh.nom + " écartés au maximum", 12, 16, ph ? 12 : 13.5, "#2c3a4e", "left");
        banner(ctx, W, H - banH - 8, banH, "2s + " + Hh.n + " × 2p → " + (Hh.n + 1) + " hybrides " + Hh.nom + (3 - Hh.n ? " + " + (3 - Hh.n) + " p pure" + (3 - Hh.n > 1 ? "s" : "") : ""), Hh.form + " · " + Hh.ps + " de caractère s · angle " + Hh.ang, "#2a6fdb");
      } else {
        var d = st.d, d0 = Hh.dCC, fs = clamp((3.4 - d) / (3.4 - d0), 0, 1), fpi = clamp((2.5 - d) / (2.5 - d0), 0, 1);
        /* carbone 1 en 0, carbone 2 en (d, 0, 0) */
        drawHybrids(items, ctx, Cc, key, [0, 0, 0], 1, 1, 1, 1);
        drawHybrids(items, ctx, Cc, key, [d, 0, 0], -1, 1, 1, 1);
        /* σ : nuage de recouvrement sur l'axe */
        if (fs > 0.02){ var mid0 = [d / 2, 0, 0]; items.push({z:Cc.P(mid0).z + 0.05, f:function(){ lobe(ctx, Cc, mid0, [1, 0, 0], d / 2 * 0.9, [0, 1, 0], 0.34 * fs + 0.05, [0, 0, 1], 0.34 * fs + 0.05, "#ffd23f", 0.85 * fs); }}); }
        leftP(key).forEach(function(ix){
          var ax = PAX[ix];
          drawP(items, ctx, Cc, ax, [0, 0, 0], 1, 0.5 * (1 - 0.55 * fpi), "#37a86b", "#b6dc78");
          drawP(items, ctx, Cc, ax, [d, 0, 0], 1, 0.5 * (1 - 0.55 * fpi), "#37a86b", "#b6dc78");
          /* π : les deux lobes de même signe fusionnent au-dessus et au-dessous de l'axe */
          if (fpi > 0.02){
            [[1, "#37a86b"], [-1, "#b6dc78"]].forEach(function(sg){
              var ctr = add([d / 2, 0, 0], mul(ax, 0.78 * sg[0])), bw2 = basis([1, 0, 0]), oth = Math.abs(dot(bw2[0], ax)) > 0.5 ? bw2[1] : bw2[0];
              items.push({z:Cc.P(ctr).z + 0.03, f:function(){ lobe(ctx, Cc, ctr, [1, 0, 0], d / 2 + 0.42, ax, 0.42, oth, 0.36, sg[1], 0.62 * fpi); }});
            });
          }
        });
        nucleus(items, ctx, Cc, [0, 0, 0], "C₁"); nucleus(items, ctx, Cc, [d, 0, 0], "C₂");
        items.sort(function(x, y){ return x.z - y.z; }).forEach(function(o){ o.f(); });
        var lz2 = ph ? 11 : 12.5, mq = Cc.P([d / 2, 0, 0]);
        if (fs > 0.4) pill(ctx, "σ (axiale)", mq.x, mq.y + sc * (Hh.nPi === 2 ? 1.9 : 1.1), "#9a6b00", lz2, W);
        var pq = Cc.P([d, 0, 0]);
        if (!st.grab && fs < 0.2) pill(ctx, "attrape-moi", pq.x, pq.y - (ph ? 34 : 44), "#2a56c6", lz2, W);
        if (Hh.nPi && fpi > 0.4){ var tq = Cc.P(add([d / 2, 0, 0], mul(PAX[leftP(key)[0]], 1.9))); pill(ctx, Hh.nPi === 2 ? "2 π (latérales)" : "π (latérale)", tq.x, tq.y, "#1f7a4c", lz2, W); }
        txt(ctx, "Deux carbones " + Hh.nom + " · distance " + fmt(d * 100, 0) + " pm", 12, 16, ph ? 12 : 13.5, "#2c3a4e", "left");
        var formed = d <= d0 + 0.06;
        banner(ctx, W, H - banH - 8, banH, formed ? Hh.lib + " : " + Hh.liais : "Rapproche C₂ jusqu'à " + fmt(d0 * 100, 0) + " pm", formed ? "Liaison à " + fmt(d0 * 100, 0) + " pm : σ par recouvrement axial des hybrides" + (Hh.nPi ? ", π par recouvrement latéral des p pures" : ", pas de p pure donc pas de π") : "Les lobes qui se font face se recouvrent de plus en plus (σ)" + (Hh.nPi ? " ; les p pures, parallèles, se recouvrent plus tard (π)." : "."), formed ? "#1f7a4c" : "#2a6fdb");
      }
      /* drawP avec π : recouvrement latéral (dessiné après pour rester lisible) */
      /* ---- diagramme d'énergie ---- */
      drawLevels(g, key, pair ? 1 : mp.m);
      if (!ph) txt(ctx, "glisse pour tourner la vue" + (pair ? " · attrape C₂" : ""), W - 12, 16, 11, "#8a95a3", "right", 700);
      var Eh = (E2S + Hh.n * E2P) / (Hh.n + 1);
      ro.set(0, (Hh.n + 1) + " × " + Hh.nom);
      ro.set(1, Hh.ps);
      ro.set(2, Hh.ang);
      ro.set(3, 3 - Hh.n === 0 ? "aucune" : 3 - Hh.n === 1 ? "1 : 2p<sub>z</sub>" : "2 : 2p<sub>y</sub>, 2p<sub>z</sub>");
      ro.set(4, fmt(Eh, 1) + " eV");
      if (pair){ var formed2 = st.d <= Hh.dCC + 0.06; ro.set(5, formed2 ? Hh.liais + " à " + fmt(Hh.dCC * 100, 0) + " pm" : "pas encore (" + fmt(st.d * 100, 0) + " pm)"); }
      else ro.set(5, "étape 2");
      var msg = {
        sp3:"Les trois 2p sont mélangées à la 2s : il ne reste aucune p pure. Les quatre hybrides se repoussent jusqu'au tétraèdre (cos θ = −1/3, θ = 109,5°). Un carbone sp³ ne fait que des liaisons σ.",
        sp2:"La 2s et deux 2p donnent trois hybrides dans un plan, à 120° (cos θ = −1/2). La 2p<sub>z</sub> reste pure, perpendiculaire au plan : c'est elle qui formera la liaison π.",
        sp:"La 2s et une seule 2p donnent deux hybrides opposés (cos θ = −1, θ = 180°). Les deux 2p restées pures sont perpendiculaires entre elles et à l'axe : deux liaisons π possibles."
      }[key];
      nt.set(msg + " <i>Énergie d'un hybride : moyenne pondérée de 2s (" + fmt(E2S, 1) + " eV) et 2p (" + fmt(E2P, 1) + " eV), modèle simple ; lobes dessinés à l'échelle qualitative.</i>", "ok");
    });
    /* diagramme d'énergie : 2s et 2p à gauche, hybrides et p pures à droite */
    function drawLevels(g, key, m){
      var ctx = g.ctx, W = g.W, H = g.H, Hh = HYB[key], ph = W < 480;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, H);
      var y = function(E){ return 30 + (E - (-9.0)) / (-21 - (-9.0)) * (H - 52); };
      var Eh = (E2S + Hh.n * E2P) / (Hh.n + 1), bw = ph ? 22 : 30, gap = ph ? 5 : 8;
      txt(ctx, "Énergie (eV)", 10, 13, 11, "#5f6b7a", "left", 700);
      /* axe */
      ctx.save(); ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(40, H - 12); ctx.lineTo(40, 22); ctx.stroke(); ctx.restore();
      function box(x, E, ne, col, lab){
        var yy = y(E);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + bw, yy); ctx.stroke();
        ctx.fillStyle = col; ctx.font = "800 13px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        if (ne >= 1) ctx.fillText("↑", x + bw * (ne === 2 ? 0.32 : 0.5), yy - 3);
        if (ne === 2) ctx.fillText("↓", x + bw * 0.68, yy - 3);
        ctx.restore();
        if (lab) txt(ctx, lab, x + bw / 2, yy + 11, 10, "#5f6b7a", "center", 700);
      }
      var L0 = ph ? 48 : 70, R0 = W * (ph ? 0.56 : 0.6);
      txt(ctx, "atome C isolé", L0 + 2 * (bw + gap), H - 8, 10.5, "#5f6b7a", "center", 700);
      box(L0 + bw + gap, E2S, 2, "#2a56c6", "2s");
      for (var i = 0; i < 3; i++) box(L0 + i * (bw + gap) + (ph ? 2.2 : 2.6) * (bw + gap), E2P, i < 2 ? 1 : 0, "#2a56c6", i === 1 ? "2p" : "");
      /* flèche de mélange */
      var x2s = L0 + 2 * (bw + gap) - gap + 4, x2p = L0 + (ph ? 2.2 : 2.6) * (bw + gap) + 3 * (bw + gap) - gap + 4, ex = R0 - 8;
      ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.4; ctx.setLineDash([4, 4]); ctx.beginPath();
      ctx.moveTo(x2s, y(E2S)); ctx.lineTo(ex, y(Eh)); ctx.moveTo(x2p, y(E2P)); ctx.lineTo(ex, y(Eh)); ctx.stroke(); ctx.restore();
      txt(ctx, "mélange de 1 × 2s + " + Hh.n + " × 2p", R0 + (Hh.n + 1) * (bw + gap) / 2, y(Eh) + 25, 10, "#8a95a3", "center", 700);
      ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * m;
      for (i = 0; i <= Hh.n; i++) box(R0 + i * (bw + gap), Eh, 1, "#2a6fdb", i === 0 ? Hh.nom : "");
      for (i = 0; i < 3 - Hh.n; i++) box(R0 + (Hh.n + 1 + i) * (bw + gap) + 6, E2P, 1, "#1f7a4c", i === 0 ? "p pure" : "");
      ctx.restore();
      txt(ctx, (Hh.n + 1) + " hybrides " + Hh.nom + " à " + fmt(Eh, 1) + " eV", R0 + 1.5 * (bw + gap), H - 8, 10.5, "#2a6fdb", "center", 700);
      txt(ctx, fmt(E2S, 1), 36, y(E2S), 10, "#5f6b7a", "right", 700);
      txt(ctx, fmt(E2P, 1), 36, y(E2P), 10, "#5f6b7a", "right", 700);
    }
  }
});

/* ====================================================================== */
/* 2. Tourner une liaison σ, tourner une liaison π (c02)                   */
/* ====================================================================== */
var BAR_ETHANE = 12, BAR_ETHENE = 267;   /* kJ/mol : barrière de l'éthane ; ≈ énergie de la liaison π (614 − 347) */
var KB = 1.380649e-23, HPL = 6.62607015e-34, RGAS = 8.314;
function eEthane(phi){ return BAR_ETHANE / 2 * (1 + Math.cos(3 * phi)); }
function eEthene(phi){ var s = Math.sin(phi); return BAR_ETHENE * s * s; }
/* nombre de franchissements de la barrière par seconde (Eyring, barrière prise comme enthalpie libre d'activation) */
function eyring(Ea, T){ return KB * T / HPL * Math.exp(-Ea * 1000 / (RGAS * T)); }
function sciTxt(x){
  if (!(x > 0)) return "0";
  var e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e);
  if (m >= 9.95){ m /= 10; e += 1; }
  if (e >= -2 && e <= 3) return fmt(x, e >= 2 ? 0 : 2);
  return fmt(m, 1) + "·10" + String(e).replace("-", "⁻").replace(/[0-9]/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]; });
}
function durTxt(sec){
  if (sec < 1e-9) return sciTxt(sec * 1e12) + " ps";
  if (sec < 1e-6) return sciTxt(sec * 1e9) + " ns";
  if (sec < 1e-3) return sciTxt(sec * 1e6) + " µs";
  if (sec < 1) return sciTxt(sec * 1e3) + " ms";
  if (sec < 120) return sciTxt(sec) + " s";
  if (sec < 7200) return sciTxt(sec / 60) + " min";
  if (sec < 2 * 86400) return sciTxt(sec / 3600) + " h";
  if (sec < 3.156e7 * 2) return sciTxt(sec / 86400) + " jours";
  return sciTxt(sec / 3.156e7) + " ans";
}
/* deux molécules dans leur repère : axe C–C selon x, C1 à gauche (fixe), C2 à droite (tourne de φ autour de x) */
function torsMol(kind, phi){
  var ene = kind === "ene", dC = ene ? 0.67 : 0.77, at = [], bd = [], ax = ene ? 0.5 : 1 / 3, pe = ene ? Math.sqrt(3) / 2 : Math.sqrt(8) / 3, dH = ene ? 1.08 : 1.09;
  at.push({el:"C", p:[-dC, 0, 0], lab:"C₁"}, {el:"C", p:[dC, 0, 0], lab:"C₂"});
  bd.push({a:0, b:1, o:ene ? 2 : 1});
  var angs = ene ? [0, PI] : [0, 2 * PI / 3, 4 * PI / 3];
  angs.forEach(function(t, i){
    var d1 = [-ax, -pe * Math.sin(t), pe * Math.cos(t)];
    at.push({el:"H", p:add(at[0].p, mul(d1, dH)), col:i === 0 ? "#f0a04b" : null, glow:i === 0 ? "#f0a04b" : null, ga:0.35, gr:1.9}); bd.push({a:0, b:at.length - 1});
  });
  angs.forEach(function(t, i){
    var d2 = [ax, -pe * Math.sin(t + phi), pe * Math.cos(t + phi)];
    at.push({el:"H", p:add(at[1].p, mul(d2, dH)), col:i === 0 ? "#f0a04b" : null, glow:i === 0 ? "#f0a04b" : null, ga:0.35, gr:1.9}); bd.push({a:1, b:at.length - 1});
  });
  return {at:at, bd:bd, dC:dC};
}
SFA.sim({
  id:"org-rotation-liaison-pi", ch:"c02", tag:"Liaisons σ et π",
  titre:"Tourner une liaison σ, tourner une liaison π",
  resume:"L'éthane et l'éthène côte à côte en 3D. Attrape le carbone de droite et fais-le tourner : l'éthane tourne librement, alors que dans l'éthène les orbitales p se décalent et la liaison π s'éteint. La jauge montre la barrière : 12 kJ/mol contre environ 267 kJ/mol.",
  but:"Attrape le carbone C₂ (à droite) de l'éthane ou de l'éthène et tourne-le en glissant vers le haut ou le bas. Les H orange servent de repère. Lâche-le : l'éthane continue de tourner, l'éthène revient à plat (ou passe de l'autre côté si tu as dépassé 90°). Glisse ailleurs pour tourner la vue ; le curseur de température change la vitesse des rotations.",
  aRetenir:"Une liaison σ est symétrique autour de l'axe C–C : la tourner ne change pas le recouvrement. La barrière de l'éthane (≈ 12 kJ/mol, conformation éclipsée) vient seulement de la gêne entre liaisons C–H : à 25 °C la molécule tourne environ 10¹⁰ fois par seconde. Dans l'éthène, la liaison π exige deux orbitales p parallèles : le recouvrement vaut cos φ et disparaît à 90°. Tourner coûte donc l'énergie de la liaison π (≈ 614 − 347 = 267 kJ/mol) : pas de rotation à température ordinaire. C'est l'origine des isomères cis/trans (Z/E), qu'on peut séparer.",
  piege:"« Double liaison » ne veut pas dire « deux liaisons identiques » : c'est une σ (axiale, qui tolère la rotation) plus une π (latérale, qui l'interdit). Et l'éthane n'est pas « bloqué » en décalé : sa barrière de 12 kJ/mol est franchie des milliards de fois par seconde.",
  build:function(k, S){
    var c = respCanvas(k, 1.05, 1.30), g = k.canvas(190), gr0 = g.resize;
    g.resize = function(){ var w = Math.max(260, (g.cv.parentNode ? g.cv.parentNode.clientWidth : 600) || 600); g.ratio = w < 480 ? 230 / w : 0; if (!g.ratio) g.H = 190; gr0(); }; g.resize();
    var st = {a:-0.62, b:0.38, t:0, manualView:false};
    var M = {ane:{phi:PI / 3, w:0, hold:false}, ene:{phi:0, w:0, hold:false, base:0, cyc:-1, demo:true}};
    var tS = k.slider("Température", 25, 600, 5, 25, "°C");
    var dT = k.toggle("Démonstration : torsion automatique de l'éthène", true, function(v){ M.ene.demo = v; M.ene.cyc = -1; st.t = 0; });
    var pT = k.toggle("Orbitales p de l'éthène", true);
    var ro = k.readouts(["Torsion de l'éthane", "Énergie de l'éthane", "Torsion de l'éthène", "Recouvrement π (|cos φ|)", "Énergie de l'éthène", "Barrière franchie (éthane)", "Barrière franchie (éthène)"]);
    var nt = k.note("", "ok");
    var cams = {}, grab = null, lastY = 0;
    dragView(c, st, function(p, type){
      if (type === "down"){
        grab = null;
        ["ane", "ene"].forEach(function(kk){
          var C = cams[kk]; if (!C) return;
          var q = C.P([M[kk].kindDC || 0.7, 0, 0]);
          if (Math.hypot(p.x - q.x, p.y - q.y) < C.sc * 1.55) grab = kk;
        });
        if (!grab) return false;
        M[grab].hold = true; M[grab].w = 0; if (grab === "ene"){ M.ene.demo = false; dT.set(false); }
        lastY = p.y; return true;
      }
      if (type === "drag" && grab){ M[grab].phi += (p.y - lastY) * 0.014; lastY = p.y; return true; }
      if (type === "up" && grab){ M[grab].hold = false; if (grab === "ene") M.ene.w = 0; grab = null; }
      return true;
    });
    st.onview = function(){ st.manualView = true; };
    var lp = k.loop(function(dt){
      st.t += dt;
      if (!st.drag && !st.manualView) st.a = -0.62 + 0.22 * Math.sin(st.t * 0.25);
      var A = M.ane, E = M.ene;
      /* éthane : rotation libre, plus rapide en décalé (énergie basse) qu'en éclipsé */
      if (!A.hold) A.phi += dt * 1.5 * (0.45 + 0.55 * (1 - Math.cos(3 * A.phi)) / 2);
      /* éthène */
      if (!E.hold){
        if (E.demo){
          var T = st.t % 9, n = Math.floor(st.t / 9);
          if (n !== E.cyc){ E.cyc = n; E.base = Math.round(E.phi / PI) * PI; E.over = n % 2 === 1; }
          var tgt = E.base + (E.over ? 100 : 80) * DEG;
          if (T < 1.2){ E.phi = E.base; E.w = 0; }
          else if (T < 3.6) { E.phi = E.base + (tgt - E.base) * ease((T - 1.2) / 2.4); E.w = 0; }
          else if (T < 4.8) { E.phi = tgt; E.w = 0; }
          else stepEne(E, dt);
          E.handOn = T >= 1.0 && T < 4.8;
        } else { stepEne(E, dt); E.handOn = false; }
      } else E.handOn = true;
      k.redraw();
    });
    function stepEne(E, dt){
      /* φ'' = −K sin 2φ − γ φ' : la π ramène les p parallèles (vers 0° ou 180°) */
      var n = 4, h = dt / n;
      for (var i = 0; i < n; i++){ E.w += (-14 * Math.sin(2 * E.phi) - 2.2 * E.w) * h; E.phi += E.w * h; }
    }
    lp.play();
    function wrap360(x){ var d = x / DEG % 360; if (d < 0) d += 360; return d; }
    function signedDeg(x){ var d = wrap360(x); return d > 180 ? d - 360 : d; }
    /* jauge verticale d'énergie */
    function gauge(ctx, x, y0, h, E, col, ph, lab){
      var w = ph ? 12 : 16, f = clamp(E / 280, 0, 1);
      ctx.save();
      rr(ctx, x - w / 2, y0, w, h, w / 2); ctx.fillStyle = "#eef2f7"; ctx.fill(); ctx.strokeStyle = "#c9d3e0"; ctx.lineWidth = 1; ctx.stroke();
      var gg = ctx.createLinearGradient(0, y0 + h, 0, y0); gg.addColorStop(0, shade(col, 0.3)); gg.addColorStop(1, col);
      if (f > 0.002){ rr(ctx, x - w / 2 + 2, y0 + h - 2 - (h - 4) * f, w - 4, (h - 4) * f, (w - 4) / 2); ctx.fillStyle = gg; ctx.fill(); }
      ctx.restore();
      txt(ctx, fmt(E, E < 20 ? 1 : 0), x, y0 - 18, ph ? 11 : 12.5, col, "center", 800);
      txt(ctx, "kJ/mol", x, y0 - 6, 9.5, "#5f6b7a", "center", 700);
      txt(ctx, lab, x, y0 + h + 10, 9.5, "#5f6b7a", "center", 700);
    }
    /* flèche de rotation autour de l'axe x, centrée sur C2 */
    function spinArrow(ctx, C, cx, r, a0, a1, col){
      var pts = [], i, N = 26;
      for (i = 0; i <= N; i++){ var t = a0 + (a1 - a0) * i / N; pts.push(C.P([cx, -r * Math.sin(t), r * Math.cos(t)])); }
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
      pts.forEach(function(q, j){ if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.stroke();
      var e = pts[N], e0 = pts[N - 3], an = Math.atan2(e.y - e0.y, e.x - e0.x);
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(e.x + 4 * Math.cos(an), e.y + 4 * Math.sin(an));
      ctx.lineTo(e.x - 11 * Math.cos(an - 0.45), e.y - 11 * Math.sin(an - 0.45)); ctx.lineTo(e.x - 11 * Math.cos(an + 0.45), e.y - 11 * Math.sin(an + 0.45)); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function panel(ctx, kind, C, x0, y0, w, h, ph){
      var m = M[kind], phi = m.phi + (kind === "ene" && !m.hold ? 3 * DEG * Math.sin(st.t * 9) : 0), mol = torsMol(kind, phi), items = [];
      m.shown = phi;
      m.kindDC = mol.dC;
      /* carte de fond */
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.strokeStyle = "#dde4ee"; rr(ctx, x0, y0, w, h, 14); ctx.fill(); ctx.stroke(); ctx.restore();
      floorShadow(ctx, C.cx, y0 + h * 0.9, w * 0.3, h * 0.035, 0.13);
      if (kind === "ene" && pT.value){
        var ov = Math.cos(phi), ov2 = ov * ov, p1 = [0, 1, 0], p2 = [0, Math.cos(phi), Math.sin(phi)];
        [[mol.at[0].p, p1], [mol.at[1].p, p2]].forEach(function(P){
          var a = 0.5 * (1 - 0.7 * ov2) + 0.12;
          items.push(lobeItem(ctx, C, add(P[0], mul(P[1], 0.8)), P[1], 0.8, 0.38, "#37a86b", a));
          items.push(lobeItem(ctx, C, add(P[0], mul(P[1], -0.8)), P[1], 0.8, 0.38, "#b6dc78", a));
        });
        if (ov2 > 0.02){
          var sg = ov >= 0 ? 1 : -1;
          [[1, "#37a86b"], [-1, "#b6dc78"]].forEach(function(q){
            var dir = nrm(add(p1, mul(p2, sg))), ctr = mul(dir, 0.8 * q[0]);
            items.push({z:C.P(ctr).z + 0.02, f:function(){ var oth = cross([1, 0, 0], dir); lobe(ctx, C, ctr, [1, 0, 0], mol.dC + 0.45, dir, 0.42, oth, 0.34, q[1], 0.6 * ov2); }});
          });
        }
      }
      renderMol(ctx, C, mol.at, mol.bd, items);
      /* main ou flèche qui tord C2 */
      if (m.handOn || m.hold) spinArrow(ctx, C, mol.dC + 0.2, 1.45, phi - 0.2, phi + 0.9, kind === "ene" ? "#c0392b" : "#2a6fdb");
      var Ev = kind === "ene" ? eEthene(phi) : eEthane(phi);
      var gx = x0 + w - (ph ? 22 : 28), gh = h * 0.5;
      gauge(ctx, gx, y0 + h * 0.28, gh, Ev, kind === "ene" ? "#c0392b" : "#2a6fdb", ph, "E");
      txt(ctx, kind === "ene" ? "Éthène · σ + π" : "Éthane · σ seule", x0 + 12, y0 + 16, ph ? 12.5 : 14, "#13233a", "left", 800);
      txt(ctx, "torsion φ = " + fmt(signedDeg(phi), 0) + "°", x0 + 12, y0 + 34, ph ? 11 : 12, "#5f6b7a", "left", 700);
      if (kind === "ene" && pT.value){
        var ovp = Math.abs(Math.cos(phi)), lab = ovp > 0.97 ? "π intacte" : ovp < 0.12 ? "π rompue : p ⟂ p" : "π affaiblie";
        pill(ctx, lab + " · " + fmt(ovp * 100, 0) + " %", x0 + w / 2 - (ph ? 10 : 14), y0 + h - 16, ovp < 0.12 ? "#c0392b" : "#1f7a4c", ph ? 10.5 : 11.5, x0 + w);
      }
      return Ev;
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      softBg(ctx, W, H, "#ffffff", "#e4ebf5");
      var banH = ph ? 64 : 60, pad = 10, Ea, Ee;
      if (W > 760){
        var pw = (W - 3 * pad) / 2, phh = H - banH - 3 * pad, sc = Math.min(pw * 0.2, phh * 0.26);
        cams.ane = cam(st, sc, pad + pw * 0.45, pad + phh * 0.55, 0.03);
        cams.ene = cam(st, sc, 2 * pad + pw + pw * 0.45, pad + phh * 0.55, 0.03);
        Ea = panel(ctx, "ane", cams.ane, pad, pad, pw, phh, ph);
        Ee = panel(ctx, "ene", cams.ene, 2 * pad + pw, pad, pw, phh, ph);
      } else {
        var pw2 = W - 2 * pad, phh2 = (H - banH - 4 * pad) / 2, sc2 = Math.min(pw2 * 0.2, phh2 * 0.27);
        cams.ane = cam(st, sc2, pad + pw2 * 0.46, pad + phh2 * 0.56, 0.03);
        cams.ene = cam(st, sc2, pad + pw2 * 0.46, 2 * pad + phh2 + phh2 * 0.56, 0.03);
        Ea = panel(ctx, "ane", cams.ane, pad, pad, pw2, phh2, ph);
        Ee = panel(ctx, "ene", cams.ene, pad, 2 * pad + phh2, pw2, phh2, ph);
      }
      var phiE = M.ene.shown, ovp = Math.abs(Math.cos(phiE)), dE = signedDeg(phiE);
      var main = "Barrière : 12 kJ/mol (σ) contre ≈ 267 kJ/mol (π)";
      var sub2 = ovp < 0.12 ? "À 90°, les deux p sont perpendiculaires : plus aucun recouvrement, la liaison π est rompue." :
        ovp < 0.97 ? "Les p de l'éthène se décalent : le recouvrement π (cos φ) baisse et l'énergie monte vite." :
        "Attrape C₂ (à droite) et tourne-le : l'éthane suit sans effort, l'éthène résiste.";
      banner(ctx, W, H - banH - 8, banH, main, sub2, ovp < 0.12 ? "#c0392b" : "#2a6fdb");
      /* ---- profil d'énergie ---- */
      var T = tS.value + 273.15;
      drawProfile(g, T);
      var kA = eyring(BAR_ETHANE, T), kE = eyring(BAR_ETHENE, T);
      ro.set(0, fmt(signedDeg(M.ane.shown), 0) + "°");
      ro.set(1, fmt(Ea, 1) + " kJ/mol");
      ro.set(2, fmt(dE, 0) + "°");
      ro.set(3, fmt(ovp * 100, 0) + " %");
      ro.set(4, fmt(Ee, 0) + " kJ/mol");
      ro.set(5, sciTxt(kA) + " fois/s");
      ro.set(6, "1 fois en " + durTxt(1 / kE));
      nt.set("À " + fmt(tS.value, 0) + " °C, RT = " + fmt(RGAS * T / 1000, 2) + " kJ/mol. La barrière de l'éthane vaut " + fmt(BAR_ETHANE / (RGAS * T / 1000), 1) + " RT : elle est franchie " + sciTxt(kA) + " fois par seconde. Celle de l'éthène vaut " + fmt(BAR_ETHENE / (RGAS * T / 1000), 0) + " RT : il faut attendre en moyenne " + durTxt(1 / kE) + (T < 400 ? " (bien plus que l'âge de l'Univers, ≈ 1,4·10¹⁰ ans)" : "") + ". <i>Modèle : E = 6 (1 + cos 3φ) pour l'éthane, E = 267 sin²φ pour l'éthène ; fréquence d'Eyring k = (k<sub>B</sub>T/h)·e<sup>−E/RT</sup>, ordre de grandeur.</i>", "ok");
    });
    function drawProfile(g, T){
      var ctx = g.ctx, W = g.W, H = g.H, ph = W < 480;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, H);
      var L = ph ? 40 : 52, R = W - 14, Tp = ph ? 70 : 22, B = H - 28;
      var X = function(d){ return L + d / 360 * (R - L); }, Y = function(E){ return B - E / 290 * (B - Tp); };
      ctx.save(); ctx.font = "600 10px " + FONT; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      [0, 100, 200, 267].forEach(function(E){ ctx.strokeStyle = E === 267 ? "rgba(192,57,43,.25)" : "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Y(E)); ctx.lineTo(R, Y(E)); ctx.stroke(); ctx.fillText(String(E), L - 5, Y(E)); });
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [0, 90, 180, 270, 360].forEach(function(d){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(X(d), Tp); ctx.lineTo(X(d), B); ctx.stroke(); ctx.fillText(d + "°", X(d), B + 4); });
      ctx.restore();
      txt(ctx, "Énergie (kJ/mol) selon la torsion φ", L, 10, 11, "#2c3a4e", "left", 800);
      function curve(f, col, w){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (var d = 0; d <= 360; d += 2){ var x = X(d), y = Y(f(d * DEG)); if (d) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
      /* RT */
      var RT = RGAS * T / 1000;
      ctx.save(); ctx.strokeStyle = "#e08a1e"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(L, Y(RT)); ctx.lineTo(R, Y(RT)); ctx.stroke(); ctx.restore();
      curve(eEthene, "#c0392b", 2.6); curve(eEthane, "#2a6fdb", 2.6);
      /* légende au centre, entre les deux bosses de l'éthène */
      var lx = ph ? L : X(180) - 74, lyy = ph ? 28 : Y(262), lz = ph ? 10.5 : 11;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.9)"; rr(ctx, lx - 6, lyy - 9, ph ? 136 : 160, 3 * (lz + 5) + 6, 8); ctx.fill(); ctx.restore();
      [["#c0392b", "éthène : barrière ≈ 267"], ["#2a6fdb", "éthane : 12 (presque plat)"], ["#e08a1e", "RT = " + fmt(RT, 1) + " (agitation)"]].forEach(function(q, i){
        var yy = lyy + i * (lz + 5) + 2;
        ctx.save(); ctx.strokeStyle = q[0]; ctx.lineWidth = 2.6; if (i === 2) ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(lx, yy); ctx.lineTo(lx + 14, yy); ctx.stroke(); ctx.restore();
        txt(ctx, q[1], lx + 19, yy, lz, q[0] === "#e08a1e" ? "#b86a10" : q[0], "left", 800);
      });
      [["ane", eEthane, "#2a6fdb"], ["ene", eEthene, "#c0392b"]].forEach(function(q){
        var d = ((M[q[0]].shown == null ? M[q[0]].phi : M[q[0]].shown) / DEG % 360 + 360) % 360;
        ball(ctx, X(d), Y(q[1](d * DEG)), 6.5, q[2]);
      });
    }
  }
});

/* ====================================================================== */
/* 3. L'effet inductif qui s'éteint le long de la chaîne (c10)             */
/* ====================================================================== */
var IND = {
  0:{nom:"acide butanoïque", f:"CH₃CH₂CH₂COOH", pKa:4.82},
  4:{nom:"acide 4-chlorobutanoïque", f:"ClCH₂CH₂CH₂COOH", pKa:4.52},
  3:{nom:"acide 3-chlorobutanoïque", f:"CH₃CHClCH₂COOH", pKa:4.05},
  2:{nom:"acide 2-chlorobutanoïque", f:"CH₃CH₂CHClCOOH", pKa:2.86}
};
var IND_F = 0.4;   /* atténuation de l'effet à chaque liaison (≈ 1/2,5, cf. ΔpKa) */
/* acide butanoïque en zigzag (plan xy), C1 = carbone du COOH à droite ; clPos = 0, 2, 3 ou 4 */
function butanoic(clPos){
  var L = 1.53, h = 56 * DEG, dx = L * Math.sin(h), dy = L * Math.cos(h) / 2, at = [], bd = [], ix = {};
  var Cpos = {4:[-1.5 * dx, -dy, 0], 3:[-0.5 * dx, dy, 0], 2:[0.5 * dx, -dy, 0], 1:[1.5 * dx, dy, 0]};
  [4, 3, 2, 1].forEach(function(n){ ix["C" + n] = at.length; at.push({el:"C", p:Cpos[n], role:"C" + n, cn:n}); });
  bd.push({a:ix.C4, b:ix.C3}, {a:ix.C3, b:ix.C2}, {a:ix.C2, b:ix.C1});
  /* COOH : C1 trigonal, O= vers le haut à droite, O–H vers le bas à droite */
  var u = nrm(sub(Cpos[2], Cpos[1])), dO1 = rotAx(u, [0, 0, 1], 120 * DEG), dO2 = rotAx(u, [0, 0, 1], -120 * DEG);
  ix.O1 = at.length; at.push({el:"O", p:add(Cpos[1], mul(dO1, 1.21)), role:"O1"}); bd.push({a:ix.C1, b:ix.O1, o:2});
  ix.O2 = at.length; at.push({el:"O", p:add(Cpos[1], mul(dO2, 1.34)), role:"O2"}); bd.push({a:ix.C1, b:ix.O2});
  var dH = rotAx(mul(dO2, -1), [0, 0, 1], -105 * DEG);
  ix.HO = at.length; at.push({el:"H", p:add(at[ix.O2].p, mul(dH, 0.97)), role:"HO"}); bd.push({a:ix.O2, b:ix.HO});
  /* hydrogènes (ou chlore) des carbones sp³ */
  [4, 3, 2].forEach(function(n){
    var E = [], P = Cpos[n];
    if (n < 4) E.push(nrm(sub(Cpos[n + 1], P)));
    E.push(nrm(sub(Cpos[n - 1], P)));
    var sl = tetraSlots(E, n === 4 ? [0, 0, 1] : null);
    /* le substituant Cl prend la place qui pointe le plus vers +z (vers toi) */
    var best = 0; sl.forEach(function(d, i){ if (d[2] > sl[best][2]) best = i; });
    sl.forEach(function(d, i){
      var isCl = clPos === n && i === best;
      var a = {el:isCl ? "Cl" : "H", p:add(P, mul(d, isCl ? 1.78 : 1.09)), role:isCl ? "Cl" : "H", on:n};
      if (isCl) ix.Cl = at.length;
      at.push(a); bd.push({a:ix["C" + n], b:at.length - 1});
    });
  });
  var ctr = [0, 0, 0]; [ix.C1, ix.C2, ix.C3, ix.C4].forEach(function(i){ ctr = add(ctr, at[i].p); }); ctr = mul(ctr, 0.25);
  ctr = add(ctr, [0.25, 0, 0]);
  at.forEach(function(a){ a.p = sub(a.p, ctr); });
  return {at:at, bd:bd, ix:ix, Cpos:Cpos};
}
/* pH d'une solution d'acide faible de concentration Ca (autoprotolyse négligée) */
function weakAcid(pKa, Ca){
  var Ka = Math.pow(10, -pKa), x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * Ca)) / 2;
  return {Ka:Ka, h:x, pH:-Math.log10(x), alpha:x / Ca};
}
function rnd(seed){ var s = seed >>> 0; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
SFA.sim({
  id:"org-effet-inductif", ch:"c10", tag:"Acidité et effet inductif",
  titre:"L'effet inductif qui s'éteint le long de la chaîne",
  resume:"Un acide butanoïque en 3D dans l'eau. Glisse un atome de chlore de C4 à C2 : le dégradé de couleur montre l'attraction des électrons qui se propage d'une liaison à l'autre en s'affaiblissant, et le pKa tombe de 4,82 à 2,86.",
  but:"Attrape le chlore (boule verte) et pose-le sur C4, C3 ou C2 (ou utilise les boutons). Le halo bleu indique les atomes appauvris en électrons (δ+), les points qui filent montrent les électrons tirés vers le chlore. Lis le pKa, le pH d'une solution et le nombre de molécules ionisées sur 100. Glisse ailleurs pour tourner la molécule.",
  aRetenir:"Le chlore, très électronégatif, attire les électrons de la liaison C–Cl : c'est l'effet inductif attracteur (−I). Il se transmet de liaison σ en liaison σ, mais perd environ 60 % de son intensité à chaque liaison : ΔpKa = 1,96 en C2, 0,77 en C3, 0,30 en C4 (division par ≈ 2,5 à chaque pas). En tirant les électrons, le chlore stabilise l'ion carboxylate RCOO⁻ : l'acide cède plus facilement son H⁺, son Ka augmente et son pKa diminue. Plus le groupe attracteur est proche du COOH, plus l'acide est fort.",
  piege:"L'effet inductif n'est pas un déplacement de charges entières : ce sont des charges partielles (δ+, δ−) qui diminuent vite avec la distance. Au-delà de trois ou quatre liaisons, il est presque nul. Et un pKa plus petit veut dire un acide plus fort.",
  build:function(k, S){
    var c = respCanvas(k, 0.78, 1.12), g = k.canvas(170), gr0 = g.resize;
    g.resize = function(){ var w = Math.max(260, (g.cv.parentNode ? g.cv.parentNode.clientWidth : 600) || 600); g.ratio = w < 480 ? 340 / w : 0; gr0(); }; g.resize();
    var st = {a:0.15, b:0.25, t:0, manualView:false, pos:2, dragCl:null};
    var pS = k.seg("Position du chlore", [["0", "Sans Cl"], ["4", "en C4"], ["3", "en C3"], ["2", "en C2"]], "2", function(v){ st.pos = +v; });
    var cS = k.slider("Concentration de l'acide", 0.01, 1, 0.01, 0.1, "mol/L");
    var rT = k.toggle("Rotation automatique", true, function(v){ st.manualView = !v; });
    var ro = k.readouts(["Molécule", "Liaisons entre Cl et C1", "pKa", "Ka", "ΔpKa (gain d'acidité)", "pH de la solution", "Molécules ionisées"]);
    var nt = k.note("", "ok");
    var lastC = null, mol = butanoic(2), park = {x:0, y:0};
    var R = rnd(7), WAT = [];
    for (var i = 0; i < 16; i++){
      var p0 = [(R() - 0.5) * 11, (R() - 0.5) * 7.5, (R() - 0.5) * 6];
      if (Math.abs(p0[0]) < 3.6 && Math.abs(p0[1]) < 2.4 && Math.abs(p0[2]) < 1.8) p0[1] += p0[1] > 0 ? 2.6 : -2.6;
      WAT.push({p:p0, ph:R() * 6, ax:nrm([R() - 0.5, R() - 0.5, R() - 0.5])});
    }
    dragView(c, st, function(p, type){
      if (!lastC) return false;
      if (type === "down"){
        var q = st.pos && mol.ix.Cl != null ? lastC.P(mol.at[mol.ix.Cl].p) : park;
        if (Math.hypot(p.x - q.x, p.y - q.y) < Math.max(22, lastC.sc * 0.7)){ st.dragCl = {x:p.x, y:p.y}; return true; }
        return false;
      }
      if (type === "drag" && st.dragCl){ st.dragCl.x = p.x; st.dragCl.y = p.y; return true; }
      if (type === "up" && st.dragCl){
        var best = 0, bd = 1e9;
        [2, 3, 4].forEach(function(n){ var q = lastC.P(mol.at[mol.ix["C" + n]].p), d = Math.hypot(p.x - q.x, p.y - q.y); if (d < bd){ bd = d; best = n; } });
        st.pos = bd < lastC.sc * 1.6 ? best : 0; pS.set(String(st.pos)); st.dragCl = null; k.redraw();
      }
      return true;
    });
    st.onview = function(){ st.manualView = true; rT.set(false); };
    var lp = k.loop(function(dt){ st.t += dt; if (!st.drag && !st.manualView) st.a = 0.15 + 0.5 * Math.sin(st.t * 0.3); k.redraw(); });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, pos = st.pos, D = IND[pos], Ca = cS.value, A = weakAcid(D.pKa, Ca);
      mol = butanoic(pos);
      /* fond : eau */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f4f9ff"); bg.addColorStop(1, "#d7e8f7"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var banH = ph ? 66 : 62, top = 34, area = H - banH - top - 14;
      var sc = Math.min(W / 7.6, area / 4.6), C = cam(st, sc, W / 2, top + area * 0.5, 0.035);
      lastC = C;
      park = {x:W - (ph ? 40 : 56), y:top + 24};
      /* molécules d'eau du décor */
      WAT.forEach(function(w){
        var pp = add(w.p, [0.25 * Math.sin(st.t * 0.4 + w.ph), 0.2 * Math.cos(st.t * 0.33 + w.ph), 0]), q = C.P(pp), r = sc * 0.2 * q.s, a = clamp(0.16 + q.z * 0.03, 0.08, 0.3);
        var d1 = rotAx([0.8, 0.55, 0], w.ax, st.t * 0.3 + w.ph), d2 = rotAx([-0.8, 0.55, 0], w.ax, st.t * 0.3 + w.ph);
        [d1, d2].forEach(function(d){ var h = C.P(add(pp, mul(d, 0.75))); ball(ctx, h.x, h.y, r * 0.62, "#e8edf3", a); });
        ball(ctx, q.x, q.y, r, "#d6392f", a);
      });
      /* intensité de l'effet : f^(nombre de liaisons depuis le carbone qui porte le Cl) */
      function eff(cn){ return pos ? Math.pow(IND_F, Math.abs(cn - pos)) : 0; }
      var at = mol.at.map(function(a){
        var o = {el:a.el, p:a.p, lab:a.el === "Cl" ? "Cl" : a.el === "O" ? "O" : a.cn ? "C" + a.cn : ""};
        if (a.cn){ var e = eff(a.cn); if (e > 0.01){ o.glow = "#2a6fdb"; o.ga = 0.25 + 0.6 * e; o.gr = 1.8 + 1.4 * e; } }
        if (a.el === "Cl"){ o.glow = "#d6392f"; o.ga = 0.7; o.gr = 2.0; }
        if (a.role === "HO"){ var eh = pos ? eff(1) * IND_F : 0; o.glow = "#2a6fdb"; o.ga = 0.25 + 1.4 * eh; o.gr = 2.2; }
        return o;
      });
      /* proton qui passe à une molécule d'eau (illustration) */
      var hoI = mol.ix.HO, o2 = mol.at[mol.ix.O2].p, dOH = nrm(sub(mol.at[hoI].p, o2)), wO = add(o2, mul(dOH, 2.75));
      var T = st.t % 7, away = clamp(0.8 + A.alpha * 30, 0.8, 4.2), u = ease(seg01(T, 1.5, 2.1)) * (1 - ease(seg01(T, 2.1 + away, 2.7 + away)));
      at[hoI].p = lerp(mol.at[hoI].p, add(wO, mul(dOH, -1.0)), u);
      var wAt = [{el:"O", p:wO, lab:"O"}, {el:"H", p:add(wO, mul(rotAx(dOH, [0, 0, 1], 115 * DEG), 0.97))}, {el:"H", p:add(wO, mul(rotAx(dOH, [0, 0, 1], -115 * DEG), 0.97))}];
      var n0 = at.length; at = at.concat(wAt);
      var bonds = mol.bd.map(function(b){
        var A1 = mol.at[b.a], B1 = mol.at[b.b], o = {a:b.a, b:b.b, o:b.o};
        if (b.a === mol.ix.O2 && b.b === hoI) o.al = 1 - u;
        var ea = A1.cn ? eff(A1.cn) : A1.el === "Cl" ? 1 : 0, eb = B1.cn ? eff(B1.cn) : B1.el === "Cl" ? 1 : 0;
        if (pos && (ea > 0.01 || eb > 0.01)){ o.c1 = A1.el === "Cl" ? "#d6392f" : mixHex("#8693a3", "#2a6fdb", ea); o.c2 = B1.el === "Cl" ? "#d6392f" : mixHex("#8693a3", "#2a6fdb", eb); }
        return o;
      });
      bonds.push({a:n0, b:n0 + 1}, {a:n0, b:n0 + 2});
      if (u > 0.5) bonds.push({a:n0, b:hoI, al:(u - 0.5) * 2});
      /* chlore qu'on déplace */
      if (st.dragCl && mol.ix.Cl != null) at[mol.ix.Cl].al = 0.15;
      var pr = renderMol(ctx, C, at, bonds, []);
      /* électrons tirés vers le chlore : points qui filent le long de la chaîne */
      if (pos && !st.dragCl){
        var path = [mol.ix.HO, mol.ix.O2, mol.ix.C1, mol.ix.C2, mol.ix.C3, mol.ix.C4].slice(0, 2 + pos).concat([mol.ix.Cl]);
        if (u > 0.3) path = path.slice(1);
        for (var j = 0; j < path.length - 1; j++){
          var aI = path[j], bI = path[j + 1];
          var steps = path.length - 2 - j, I = Math.pow(IND_F, steps);
          for (var q = 0; q < 3; q++){
            var f = (st.t * 0.9 + q / 3) % 1, x = pr[aI].x + (pr[bI].x - pr[aI].x) * f, y = pr[aI].y + (pr[bI].y - pr[aI].y) * f;
            ctx.save(); ctx.globalAlpha = clamp(0.25 + 0.75 * I, 0, 1) * Math.sin(f * PI); ctx.fillStyle = "#ffd23f"; ctx.strokeStyle = "#9a6b00"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(x, y, 3 + 3.2 * I, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
          }
        }
      }
      /* δ */
      var lz = ph ? 11 : 12.5;
      if (pos){
        var qc = pr[mol.ix.Cl]; if (!st.dragCl) pill(ctx, "δ−", qc.x + 18, qc.y - 22, "#c0392b", lz, W);
        [2, 3, 4, 1].forEach(function(n){ var e = eff(n); if (e < 0.05) return; var qq = pr[mol.ix["C" + n]]; pill(ctx, e > 0.9 ? "δ+" : e > 0.3 ? "δ+ (×0,4)" : "δ+ (×0,16)", qq.x, qq.y + (ph ? 26 : 32), "#2a56c6", ph ? 10 : 11, W); });
      }
      if (u > 0.6){ var q3 = C.P(wO); pill(ctx, "H₃O⁺", q3.x + 6, q3.y - (ph ? 26 : 32), "#2a56c6", lz, W); var q2 = pr[mol.ix.O2]; pill(ctx, "COO⁻", q2.x - 4, q2.y + (ph ? 24 : 30), "#c0392b", lz, W); }
      /* chlore en réserve ou en main */
      if (!pos && !st.dragCl){ ball(ctx, park.x, park.y, sc * 0.46, COL.Cl); onBall(ctx, "Cl", park.x, park.y, sc * 0.36); txt(ctx, "glisse-moi sur la chaîne", park.x - sc * 0.6, park.y + sc * 0.75, ph ? 10 : 11, "#1f7a4c", "right", 800); }
      if (st.dragCl){
        var best = 0, bd = 1e9;
        [2, 3, 4].forEach(function(n){ var q = pr[mol.ix["C" + n]], d = Math.hypot(st.dragCl.x - q.x, st.dragCl.y - q.y); if (d < bd){ bd = d; best = n; } });
        if (bd < sc * 1.6){ var qn = pr[mol.ix["C" + best]]; ctx.save(); ctx.strokeStyle = "#1f7a4c"; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(qn.x, qn.y); ctx.lineTo(st.dragCl.x, st.dragCl.y); ctx.stroke(); ctx.restore(); }
        ball(ctx, st.dragCl.x, st.dragCl.y, sc * 0.48, COL.Cl); onBall(ctx, "Cl", st.dragCl.x, st.dragCl.y, sc * 0.36);
      }
      txt(ctx, D.nom, 12, 17, ph ? 12.5 : 14, "#13233a", "left", 800);
      if (!ph) txt(ctx, "attrape le Cl · glisse pour tourner", 12, 35, 11, "#8a95a3", "left", 700);
      var nB = pos ? pos : 0; /* liaisons de Cl à C1 : Cl–C2–C1 = 2, Cl–C3 = 3, Cl–C4 = 4 */
      banner(ctx, W, H - banH - 8, banH, D.f + " · pKa = " + fmt(D.pKa, 2),
        pos ? "Cl à " + nB + " liaison" + (nB > 1 ? "s" : "") + " de C1 : l'attraction arrive affaiblie (×0,4 par liaison) et stabilise le carboxylate." : "Sans chlore : chaîne carbonée peu polarisée, l'acide reste faible.", pos === 2 ? "#c0392b" : "#2a6fdb");
      drawScale(g, pos, A, Ca);
      ro.set(0, pos ? pos + "-chloro" : "sans Cl");
      ro.set(1, pos ? String(nB) : "—");
      ro.set(2, fmt(D.pKa, 2));
      ro.set(3, sciTxt(A.Ka));
      ro.set(4, pos ? fmt(IND[0].pKa - D.pKa, 2) : "0");
      ro.set(5, fmt(A.pH, 2));
      ro.set(6, fmt(A.alpha * 100, 1) + " sur 100");
      var msg = pos === 2 ? "Le chlore est porté par le carbone voisin de C1 : l'attraction des électrons arrive presque entière sur le COOH. Le carboxylate est fortement stabilisé : pKa 2,86, l'acide est environ " + fmt(Math.pow(10, IND[0].pKa - D.pKa), 0) + " fois plus fort que l'acide butanoïque." :
        pos === 3 ? "Une liaison de plus : l'effet a perdu environ 60 %. ΔpKa = 0,77 au lieu de 1,96 (rapport 2,5). L'acide est " + fmt(Math.pow(10, IND[0].pKa - D.pKa), 1) + " fois plus fort que l'acide butanoïque." :
        pos === 4 ? "Le chlore est au bout de la chaîne : l'effet arrive très affaibli au COOH (ΔpKa = 0,30). L'acide n'est que " + fmt(Math.pow(10, IND[0].pKa - D.pKa), 1) + " fois plus fort." :
        "Référence : l'acide butanoïque, pKa 4,82. Pose le chlore en C4, puis en C3, puis en C2 et regarde le pKa baisser de plus en plus vite.";
      nt.set(msg + " <i>pKa mesurés dans l'eau à 25 °C ; pH calculé pour l'acide seul (Ka = x²/(C − x)). Le passage du H⁺ à l'eau et les points jaunes sont une illustration, pas une simulation.</i>", "ok");
    });
    function drawScale(g, pos, A, Ca){
      var ctx = g.ctx, W = g.W, H = g.H, ph = W < 480;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, H);
      /* échelle de pKa */
      var sw = ph ? W : W * 0.6, L = 22, R = sw - 18, y0 = ph ? 92 : 96;
      var X = function(v){ return L + (5.2 - v) / (5.2 - 2.4) * (R - L); };
      txt(ctx, "Échelle de pKa (plus à droite = acide plus fort)", L - 8, 13, 11, "#2c3a4e", "left", 800);
      var gg = ctx.createLinearGradient(L, 0, R, 0); gg.addColorStop(0, "#cfe0f7"); gg.addColorStop(1, "#f4b9b0");
      ctx.fillStyle = gg; rr(ctx, L, y0 - 5, R - L, 10, 5); ctx.fill();
      ctx.save(); ctx.font = "600 10px " + FONT; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var v = 3; v <= 5; v++){ ctx.fillRect(X(v) - 0.5, y0 + 5, 1, 5); ctx.fillText(String(v), X(v), y0 + 11); }
      ctx.restore();
      [0, 4, 3, 2].forEach(function(n, i){
        var D = IND[n], x = X(D.pKa), sel = n === pos, up = i % 2 === 0;
        ball(ctx, x, y0, sel ? 9 : 6, sel ? "#c0392b" : "#7b8694");
        var lab = n ? n + "-Cl" : "sans Cl", yy = up ? y0 - 28 : y0 + 34;
        txt(ctx, lab, x, yy, ph ? 10.5 : 11, sel ? "#c0392b" : "#5f6b7a", "center", 800);
        txt(ctx, fmt(D.pKa, 2), x, yy + (up ? -13 : 13), 10, sel ? "#c0392b" : "#5f6b7a", "center", 700);
      });
      /* flèches ΔpKa */
      txt(ctx, "ΔpKa : 0,30 → 0,77 → 1,96 (× 2,5 à chaque liaison en moins)", L - 8, y0 + 60, ph ? 10 : 10.5, "#2a56c6", "left", 700);
      /* 100 molécules */
      var gx0 = ph ? W / 2 - 58 : W * 0.66, gy0 = ph ? 196 : 26, cell = ph ? 11.5 : 11.2, nI = Math.round(A.alpha * 100);
      txt(ctx, "100 molécules à " + fmt(Ca, 2) + " mol/L", gx0 + 5 * cell, gy0 - 12 + (ph ? 0 : 2), 11, "#2c3a4e", "center", 800);
      for (var i = 0; i < 100; i++){
        var x0 = gx0 + (i % 10) * cell + cell / 2, yq = gy0 + 6 + Math.floor(i / 10) * cell + cell / 2;
        ball(ctx, x0, yq, cell * 0.38, i < nI ? "#c0392b" : "#8fa3bc");
      }
      txt(ctx, nI + (nI > 1 ? " ionisées" : " ionisée") + " (RCOO⁻) · pH " + fmt(A.pH, 2), gx0 + 5 * cell, gy0 + 10 * cell + 18, 10.5, "#c0392b", "center", 800);
    }
  }
});

/* ====================================================================== */
/* 4. Un récepteur ne reçoit qu'un des deux énantiomères (L16)             */
/* ====================================================================== */
/* quaternions [w, x, y, z] */
function qAx(k, ang){ var s2 = Math.sin(ang / 2); return [Math.cos(ang / 2), k[0] * s2, k[1] * s2, k[2] * s2]; }
function qMul(a, b){ return [a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2], a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]]; }
function qN(q){ var l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; }
function qRot(q, v){ var p = qMul(qMul(q, [0, v[0], v[1], v[2]]), [q[0], -q[1], -q[2], -q[3]]); return [p[1], p[2], p[3]]; }
function qSlerp(a, b, t){
  var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  if (d < 0){ b = b.map(function(x){ return -x; }); d = -d; }
  if (d > 0.9995) return qN(a.map(function(x, i){ return x + (b[i] - x) * t; }));
  var th = Math.acos(d), s1 = Math.sin((1 - t) * th) / Math.sin(th), s2 = Math.sin(t * th) / Math.sin(th);
  return a.map(function(x, i){ return x * s1 + b[i] * s2; });
}
function qRand(r){ var u1 = r(), u2 = r(), u3 = r(); return [Math.sqrt(1 - u1) * Math.sin(2 * PI * u2), Math.sqrt(1 - u1) * Math.cos(2 * PI * u2), Math.sqrt(u1) * Math.sin(2 * PI * u3), Math.sqrt(u1) * Math.cos(2 * PI * u3)]; }
/* directions tétraédriques : H vers le haut (sortie de la poche), trois vers le fond */
var TA = Math.sqrt(8) / 3;
function tdir(deg){ return [TA * Math.cos(deg * DEG), -1 / 3, TA * Math.sin(deg * DEG)]; }
/* (R)-adrénaline : OH à 90°, CH₂–NH₂⁺–CH₃ à 330°, cycle aromatique à 210° (vérifié : OH > CH₂N > cycle, sens horaire, H en arrière) */
var REC_SITES = [
  {g:"OH", d:tdir(90), rc:1.43, nom:"liaison H (Ser–OH)", court:"Ser", col:"#2a9fd6", lien:"liaison H"},
  {g:"N", d:tdir(330), rc:2.93, nom:"site ionique (Asp⁻)", court:"Asp⁻", col:"#d6392f", lien:"attraction ionique"},
  {g:"Ar", d:tdir(210), rc:2.9, nom:"poche aromatique (Phe)", court:"Phe", col:"#e0a21e", lien:"empilement π"}
];
function adrenaline(mirror){
  var at = [], bd = [];
  function A(el, p, o){ o = o || {}; o.el = el; o.p = p; at.push(o); return at.length - 1; }
  var c0 = A("C", [0, 0, 0], {lab:"C*", ring:"#13233a"});
  var h = A("H", [0, 1.09, 0], {lab:"H", grp:"H"}); bd.push({a:c0, b:h});
  /* OH */
  var dO = tdir(90), o = A("O", mul(dO, 1.43), {lab:"O", grp:"OH"}); bd.push({a:c0, b:o});
  var hO = A("H", add(mul(dO, 1.43), mul(nrm(add(mul(dO, 0.3), [0.95, 0.1, 0])), 0.97))); bd.push({a:o, b:hO});
  /* CH₂–NH₂⁺–CH₃ */
  var dN = tdir(330), side = nrm(cross(dN, [0, 1, 0]));
  var ca = A("C", mul(dN, 1.53)); bd.push({a:c0, b:ca});
  var nP = add(mul(dN, 2.93), mul(side, 0.25)), n = A("N", nP, {lab:"N⁺", grp:"N", glow:"#3b6ec2", ga:0.35, gr:2}); bd.push({a:ca, b:n});
  var cm = A("C", add(nP, mul(nrm(add(mul(dN, 0.45), mul(side, -0.9))), 1.48))); bd.push({a:n, b:cm});
  /* cycle aromatique (catéchol) */
  var dA = tdir(210), up = nrm(sub([0, 1, 0], mul(dA, dot([0, 1, 0], dA)))), ctr = mul(dA, 1.51 + 1.39), ring = [];
  for (var i = 0; i < 6; i++){ var t = PI + i * PI / 3, q = add(ctr, add(mul(dA, 1.39 * Math.cos(t)), mul(up, 1.39 * Math.sin(t)))); ring.push(A("C", q, i === 3 ? {grp:"Ar"} : {})); }
  bd.push({a:c0, b:ring[0]});
  for (i = 0; i < 6; i++) bd.push({a:ring[i], b:ring[(i + 1) % 6], o:i % 2 === 0 ? 2 : 1});
  [2, 3].forEach(function(j){ var q = at[ring[j]].p, d = nrm(sub(q, ctr)), oo = A("O", add(q, mul(d, 1.36)), {lab:"O"}); bd.push({a:ring[j], b:oo}); });
  if (mirror) at.forEach(function(a){ a.p = [-a.p[0], a.p[1], a.p[2]]; });
  var ix = {}; at.forEach(function(a, k){ if (a.grp) ix[a.grp] = k; });
  ix.ctr = mirror ? [-ctr[0], ctr[1], ctr[2]] : ctr;
  return {at:at, bd:bd, ix:ix};
}
var LIG = {R:adrenaline(false), S:adrenaline(true)};
/* configuration CIP à partir des coordonnées : OH (1) > CH₂N (2) > cycle (3) > H (4) */
function cipOf(m){
  var v1 = nrm(m.at[m.ix.OH].p), v2 = nrm(m.at[m.ix.N].p), v3 = nrm(m.ix.ctr);
  return dot(v1, cross(v2, v3)) < 0 ? "R" : "S";
}
/* direction de contact de chaque groupe (dans le repère du ligand) */
function contactDir(m, g){ return nrm(g === "Ar" ? m.ix.ctr : g === "H" ? m.at[m.ix.H].p : m.at[m.ix[g]].p); }
var REC_TOL = 28;   /* degrés */
function fitScore(m, q){
  return REC_SITES.map(function(s){ var d = qRot(q, contactDir(m, s.g)); return angBetween(d, s.d) < REC_TOL; });
}
/* meilleure orientation : identité pour R ; pour S, demi-tour autour de la bissectrice des sites Asp et Phe (OH ressort, H tombe sur le site Ser) */
var BEST = {R:[1, 0, 0, 0], S:qAx(nrm(add(tdir(330), tdir(210))), PI)};
SFA.sim({
  id:"org-recepteur-chiral-3d", ch:"L16", tag:"Chiralité et vivant",
  titre:"Un récepteur ne reçoit qu'un des deux énantiomères",
  resume:"La poche d'un récepteur en 3D avec trois sites de fixation colorés. Fais tourner l'adrénaline pour l'y loger : la (R) touche les trois sites à la fois, la (S), son image dans un miroir, en manque toujours un, quelle que soit sa rotation.",
  but:"Choisis un énantiomère (ou laisse-les alterner). Attrape la molécule et fais-la tourner dans la poche : chaque groupe bien placé face à son site s'allume (✓). Le compteur indique combien de sites sont touchés en même temps. « Placer au mieux » montre la meilleure orientation possible. Passe en « la vue » pour tourner toute la scène.",
  aRetenir:"Deux énantiomères ont les mêmes propriétés physiques, sauf face à un environnement lui-même chiral : une protéine, faite d'acides aminés L, en est un. Quand un récepteur reconnaît sa molécule par trois points (modèle d'Easson et Stedman), un seul énantiomère peut placer ses trois groupes face aux trois sites : l'autre en touche au mieux deux. Ici, la (R)-adrénaline, l'hormone naturelle, fixe son NH₂⁺ (site ionique), son cycle (poche aromatique) et son OH (liaison H) ; la (S) ne peut pas loger son OH. C'est pourquoi deux énantiomères d'un médicament peuvent avoir des effets très différents.",
  piege:"On ne transforme pas un énantiomère en l'autre en le faisant tourner : il faudrait casser et refaire des liaisons. Si tu crois avoir trouvé trois sites avec la (S), regarde où pointe le H : il occupe forcément la place d'un des groupes.",
  build:function(k, S){
    var c = respCanvas(k, 0.82, 1.18);
    var st = {a:0.5, b:0.92, t:0, manualView:false, q:[1, 0, 0, 0], auto:true, phase:0, bmin:0.15, bmax:1.4};
    var eS = k.seg("Énantiomère", [["alt", "Les deux, tour à tour"], ["R", "(R)-adrénaline"], ["S", "(S)-adrénaline"]], "alt", function(){ st.t = 0; st.auto = true; aT.set(true); });
    var mS = k.seg("La souris fait tourner", [["mol", "la molécule"], ["vue", "la vue"]], "mol");
    var aT = k.toggle("Recherche automatique", true, function(v){ st.auto = v; st.t = 0; st.place = null; });
    k.button("Placer au mieux", function(){ st.auto = false; aT.set(false); st.place = {q0:st.q.slice(), t:0}; }, true);
    var ro = k.readouts(["Molécule", "Configuration (CIP)", "Sites touchés en même temps", "Meilleur ajustement possible", "Site ionique (Asp⁻ ↔ NH₂⁺)", "Liaison H (Ser ↔ OH)", "Poche aromatique (Phe ↔ cycle)"]);
    var nt = k.note("", "ok");
    var R = rnd(11), path = null, lastC = null;
    function cur(){ if (eS.value !== "alt") return eS.value; return Math.floor(st.t / 12) % 2 === 0 ? "R" : "S"; }
    dragView(c, st, function(p, type){
      if (mS.value !== "mol") return false;
      if (type === "down"){ st.auto = false; aT.set(false); st.place = null; st.mx = p.x; st.my = p.y; return true; }
      if (type === "drag"){
        var dx = p.x - st.mx, dy = p.y - st.my; st.mx = p.x; st.my = p.y;
        var ay = unrot([0, 1, 0], st.a, st.b), axx = unrot([1, 0, 0], st.a, st.b);
        st.q = qN(qMul(qAx(nrm(ay), dx * 0.012), st.q)); st.q = qN(qMul(qAx(nrm(axx), dy * 0.012), st.q));
      }
      return true;
    });
    st.onview = function(){ st.manualView = true; };
    var lp = k.loop(function(dt){
      st.t += dt;
      if (!st.drag && !st.manualView) st.a = 0.5 + 0.4 * Math.sin(st.t * 0.22);
      var key = cur();
      if (st.auto){
        /* cycle de 12 s : trois essais au hasard, puis la meilleure orientation, maintenue */
        var T = st.t % 12, n = Math.floor(st.t / 12);
        if (!path || path.n !== n){ path = {n:n, qs:[st.q.slice(), qRand(R), qRand(R), qRand(R), BEST[key]]}; }
        path.qs[4] = BEST[key];
        var seg = T < 6 ? Math.floor(T / 2) : 3, u = T < 6 ? ease((T % 2) / 1.6) : ease((T - 6) / 2);
        st.q = qSlerp(path.qs[seg], path.qs[seg + 1], Math.min(1, u));
        st.hold = T >= 8;
      } else st.hold = false;
      if (st.place){ st.place.t += dt; st.q = qSlerp(st.place.q0, BEST[key], ease(st.place.t / 1.4)); if (st.place.t > 1.4) st.place = null; }
      k.redraw();
    });
    lp.play();
    /* poche du récepteur : calotte sphérique (maillage ombré), centre un peu au-dessus du carbone asymétrique */
    var RB = 4.9, BC = [0, 1.1, 0];
    function bowlQuads(C){
      var far = [], near = [], NT = 10, NP = 30, L = nrm([-0.4, 0.7, 0.6]);
      for (var i = 0; i < NT; i++) for (var j = 0; j < NP; j++){
        var t0 = i / NT * 104 * DEG, t1 = (i + 1) / NT * 104 * DEG, p0 = j / NP * 2 * PI, p1 = (j + 1) / NP * 2 * PI;
        var pt = function(t, p){ return add(BC, mul([Math.sin(t) * Math.cos(p), -Math.cos(t), Math.sin(t) * Math.sin(p)], RB)); };
        var P = [pt(t0, p0), pt(t1, p0), pt(t1, p1), pt(t0, p1)].map(C.P);
        var nm = [Math.sin((t0 + t1) / 2) * Math.cos((p0 + p1) / 2), -Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2) * Math.sin((p0 + p1) / 2)];
        var nv = rot3(nm, st.a, st.b), z = (P[0].z + P[1].z + P[2].z + P[3].z) / 4;
        var q = {P:P, z:z, nv:nv, rim:i === NT - 1};
        if (nv[2] > 0){ q.lam = Math.max(0, dot(nv, L)); near.push(q); } else { q.lam = Math.max(0, dot(mul(nv, -1), L)); far.push(q); }
      }
      far.sort(function(a, b){ return a.z - b.z; }); near.sort(function(a, b){ return a.z - b.z; });
      return {far:far, near:near};
    }
    function drawQuad(ctx, q, base, alpha){
      var f = 0.55 + 0.5 * q.lam, col = shade(base, f > 1 ? (f - 1) * 0.8 : -(1 - f) * 0.6);
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 0.8;
      ctx.beginPath(); q.P.forEach(function(p, k2){ if (k2) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, key = cur(), m = LIG[key];
      /* décor : milieu extracellulaire */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f7f3ff"); bg.addColorStop(1, "#e3ddf2"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var banH = ph ? 66 : 62, top = 34, area = H - banH - top - 12;
      var sc = Math.min(W / 11.2, area / 9.4), C = cam(st, sc, W / 2, top + area * 0.5, 0.03);
      lastC = C;
      floorShadow(ctx, W / 2, top + area * 0.98, Math.min(W * 0.42, area * 0.55), area * 0.05, 0.18);
      var B = bowlQuads(C);
      B.far.forEach(function(q){ drawQuad(ctx, q, "#a993d6", 1); });
      /* sites (chaînes latérales qui sortent de la paroi) */
      var fit = fitScore(m, st.q), nFit = fit.filter(Boolean).length, items = [];
      REC_SITES.forEach(function(s, i){
        var wall = add(mul(s.d, RB * 0.93), [0, 0.35, 0]), tip = mul(s.d, s.rc + 1.05);
        var pw = C.P(wall), pt = C.P(tip);
        items.push({z:Math.min(pw.z, pt.z) - 0.4, f:function(){ ctx.save(); ctx.strokeStyle = shade(s.col, -0.35); ctx.lineWidth = Math.max(5, sc * 0.28); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(pw.x, pw.y); ctx.lineTo(pt.x, pt.y); ctx.stroke(); ctx.restore(); }});
        items.push({z:pt.z, f:function(){
          var r = Math.max(10, sc * 0.55 * pt.s), on = fit[i];
          var gg = ctx.createRadialGradient(pt.x, pt.y, r * 0.3, pt.x, pt.y, r * (on ? 2.8 : 2)); gg.addColorStop(0, rgba(s.col, on ? 0.7 : 0.35)); gg.addColorStop(1, rgba(s.col, 0));
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(pt.x, pt.y, r * (on ? 2.8 : 2), 0, 7); ctx.fill();
          ball(ctx, pt.x, pt.y, r, s.col); onBall(ctx, s.court, pt.x, pt.y, Math.max(9, r * 0.62));
        }});
      });
      /* ligand orienté */
      var atoms = m.at.map(function(a){ var o = {}; for (var kk in a) o[kk] = a[kk]; o.p = qRot(st.q, a.p); return o; });
      /* liens d'interaction */
      REC_SITES.forEach(function(s, i){
        if (!fit[i]) return;
        var a = s.g === "Ar" ? qRot(st.q, m.ix.ctr) : atoms[m.ix[s.g]].p, b = mul(s.d, s.rc + 1.05), pa = C.P(a), pb = C.P(b);
        items.push({z:Math.max(pa.z, pb.z) + 0.3, f:function(){ ctx.save(); ctx.strokeStyle = "#1f9d55"; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -st.t * 20; ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke(); ctx.restore(); }});
      });
      var pr = renderMol(ctx, C, atoms, m.bd, items);
      /* paroi avant, translucide */
      B.near.forEach(function(q){ drawQuad(ctx, q, "#a993d6", 0.2); });
      /* bord de la poche */
      ctx.save(); ctx.strokeStyle = "rgba(90,62,150,.55)"; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var j = 0; j <= 60; j++){ var ph2 = j / 60 * 2 * PI, t = 104 * DEG, q = C.P(add(BC, mul([Math.sin(t) * Math.cos(ph2), -Math.cos(t), Math.sin(t) * Math.sin(ph2)], RB))); if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
      ctx.stroke(); ctx.restore();
      /* ✓ / ✗ */
      var lz = ph ? 11 : 12.5;
      REC_SITES.forEach(function(s, i){
        var q = C.P(mul(s.d, s.rc + 1.05)), r = Math.max(10, sc * 0.55);
        if (fit[i]) pill(ctx, "✓ " + s.lien, q.x, q.y + r + 14, "#1f7a4c", lz, W);
        else if (st.hold || !st.auto) pill(ctx, "✗ " + s.court + " libre", q.x, q.y + r + 14, "#c0392b", lz, W);
      });
      /* où est le H ? */
      var hq = pr[m.ix.H];
      var hDown = qRot(st.q, [0, 1, 0])[1] < -0.2;
      if (hDown && nFit === 2) pill(ctx, "le H prend la place du OH", hq.x + (ph ? 20 : 40), hq.y + (ph ? 22 : 26), "#c0392b", lz, W);
      /* titre et compteur */
      txt(ctx, "(" + key + ")-adrénaline dans la poche du récepteur", 12, 17, ph ? 12 : 14, "#13233a", "left", 800);
      if (!ph) txt(ctx, mS.value === "mol" ? "attrape la molécule pour la tourner" : "glisse pour tourner la vue", 12, 35, 11, "#8a95a3", "left", 700);
      var bx = W - (ph ? 50 : 62), by = top + (ph ? 22 : 26), br = ph ? 24 : 30, okc = nFit === 3 ? "#1f9d55" : nFit === 2 ? "#e08a1e" : "#8a95a3";
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.strokeStyle = okc; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      txt(ctx, nFit + "/3", bx, by - 2, ph ? 15 : 19, okc, "center", 800);
      txt(ctx, "sites", bx, by + br * 0.52, 9.5, "#5f6b7a", "center", 700);
      var main = key === "R" ? "(R)-adrénaline : 3 sites sur 3 possibles" : "(S)-adrénaline : jamais plus de 2 sites sur 3";
      var sub2 = key === "R" ? "NH₂⁺ face à Asp⁻, cycle dans la poche aromatique, OH face à la sérine : la molécule « clique » dans le récepteur." : "Image miroir : quand le NH₂⁺ et le cycle sont en place, le OH pointe vers la sortie et le H occupe le site de la sérine.";
      banner(ctx, W, H - banH - 8, banH, main, sub2, key === "R" ? "#1f7a4c" : "#c0392b");
      ro.set(0, "(" + key + ")-adrénaline");
      ro.set(1, cipOf(m));
      ro.set(2, nFit + " / 3");
      ro.set(3, key === "R" ? "3 / 3" : "2 / 3");
      ro.set(4, fit[1] ? "✓ en place" : "✗ libre");
      ro.set(5, fit[0] ? "✓ en place" : "✗ libre");
      ro.set(6, fit[2] ? "✓ en place" : "✗ libre");
      nt.set((key === "R" ? "Les trois groupes de la (R)-adrénaline partent du carbone asymétrique dans le même ordre que les trois sites du récepteur : une seule rotation les aligne tous. " :
        "Pour la (S), deux groupes peuvent toujours être alignés sur deux sites (une rotation suffit), mais le troisième tombe alors là où le H devrait être. Il faudrait une réflexion (un miroir), impossible par simple rotation. ") +
        "Priorités CIP du carbone asymétrique : OH > CH₂NH₂⁺CH₃ > cycle > H. <i>Modèle à trois points (Easson et Stedman, 1933) ; poche et distances schématisées ; un groupe compte comme placé s'il pointe à moins de " + REC_TOL + "° de son site.</i>", key === "R" ? "ok" : "warn");
    });
  }
});

})();
