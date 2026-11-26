/* Chimie BA1 · chimie organique : substitution aromatique, aldolisation, amine et membrane, cyclisation du glucose
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
/* direction d'un H sur un O (angle C–O–H ≈ 109°), tourné du côté de « pref » */
function ohDir(oPos, cPos, pref){
  var od = nrm(sub(oPos, cPos)), w = sub(pref, mul(od, dot(pref, od)));
  w = len(w) < 1e-3 ? perpTo(od) : nrm(w);
  return nrm(add(mul(od, Math.cos(71 * DEG)), mul(w, Math.sin(71 * DEG))));
}

/* ---------- rendu ---------- */
function shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
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
function dragView(c, st){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, -1.45, 1.45); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
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
function badge(ctx, x, y, t, col, a, r){
  if (a != null && a < 0.03) return;
  r = r || 8.5;
  ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = "#fff"; ctx.strokeStyle = col; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.font = "800 " + Math.round(r * 1.55) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 0.5); ctx.restore();
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
/* raccourcit un segment écran pour qu'une flèche ne parte pas du centre d'une boule */
function trim(p, q, r0, r1){
  var dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
  return [p.x + dx / L * r0, p.y + dy / L * r0, q.x - dx / L * r1, q.y - dy / L * r1];
}

var EL = {C:["#4a5568", 0.40], H:["#e8edf3", 0.25], O:["#d6392f", 0.42], N:["#2f5fd0", 0.41], Br:["#9a2a1c", 0.60], S:["#d9a520", 0.52], Fe:["#b5651d", 0.52], Al:["#9aa7b8", 0.52], Cl:["#2fa84f", 0.52]};
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
/* scène 3D : atomes {el,p,col,r,alpha,lab,glow,badge,badgeCol,badgeA,tag}, liaisons {a,b,o,alpha,dash,col}, extra : [{z,f}] */
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
      if (a.lab && r > 7.5){
        ctx.save(); ctx.globalAlpha = a.alpha; ctx.font = "800 " + Math.round(clamp(r * 0.95, 9, 15)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
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
  var bg = ctx.createRadialGradient(W * 0.48, H * 0.42, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  bg.addColorStop(0, c0 || "#ffffff"); bg.addColorStop(1, c1 || "#e3e9f3"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}
function solvent(ctx, W, H, list, t, alpha){
  ctx.save(); ctx.globalAlpha = alpha || 0.14;
  list.forEach(function(m){
    var x = (m.x + 0.01 * Math.sin(t * 0.4 + m.r * 5)) * W, y = (m.y + 0.01 * Math.cos(t * 0.33 + m.r * 7)) * H;
    ctx.save(); ctx.translate(x, y); ctx.rotate(m.r + t * 0.1); ctx.fillStyle = "#d6392f"; ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, 7); ctx.fill();
    ctx.fillStyle = "#9aa6b6"; ctx.beginPath(); ctx.arc(-5.5, 4.5, 3.3, 0, 7); ctx.arc(5.5, 4.5, 3.3, 0, 7); ctx.fill(); ctx.restore();
  });
  ctx.restore();
}
function seeded(n, seed){ var sd = seed || 7, out = []; function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; } for (var i = 0; i < n; i++) out.push({x:rnd(), y:rnd(), r:rnd() * 6.28}); return out; }
function plotFrame(c, o){
  var ctx = c.ctx, ax = {L:o.l || 40, R:c.W - (o.r || 14), T:o.t || 22, B:c.H - (o.b || 26)};
  ax.X = function(x){ return ax.L + (x - o.x0) / (o.x1 - o.x0) * (ax.R - ax.L); };
  ax.Y = function(y){ return ax.B - (y - o.y0) / (o.y1 - o.y0) * (ax.B - ax.T); };
  ctx.save(); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, c.W, c.H);
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax.L, ax.T); ctx.lineTo(ax.L, ax.B); ctx.lineTo(ax.R, ax.B); ctx.stroke(); ctx.restore();
  return ax;
}
var MA = {C:12.011, H:1.008, N:14.007, O:15.999, Br:79.904};
function molM(el){ var m = 0; for (var q in el) m += el[q] * MA[q]; return m; }
function F2(x, d){ return x.toFixed(d).replace(".", ","); }

/* ====================================================================== */
/* 1. Substitution électrophile aromatique en 3D                           */
/* ====================================================================== */
var SE = {
  nitr:{n:"Nitration", E:"NO₂⁺", LE:1.47, base:"HSO₄⁻", ctr:"S", lig:"O", Lc:1.47, LH:0.97, split:false,
    gen:"HNO₃ + 2 H₂SO₄ → NO₂⁺ (ion nitronium) + H₃O⁺ + 2 HSO₄⁻", by:"H₂SO₄", prod:"nitrobenzène", f:"C₆H₅NO₂", el:{C:6, H:5, N:1, O:2},
    end:"HSO₄⁻ reprend le H⁺ : H₂SO₄ est régénéré, c'est un catalyseur."},
  brom:{n:"Bromation", E:"Br⁺", LE:1.90, base:"FeBr₄⁻", ctr:"Fe", lig:"Br", Lc:2.33, LH:1.41, split:true,
    gen:"Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻ (en réalité, Br–Br est fortement polarisé par FeBr₃)", by:"HBr + FeBr₃", prod:"bromobenzène", f:"C₆H₅Br", el:{C:6, H:5, Br:1},
    end:"FeBr₄⁻ capte le H⁺ : il se forme HBr et FeBr₃ est régénéré (catalyseur)."},
  fc:{n:"Friedel-Crafts (acylation)", E:"CH₃CO⁺", LE:1.49, base:"AlCl₄⁻", ctr:"Al", lig:"Cl", Lc:2.13, LH:1.27, split:true,
    gen:"CH₃COCl + AlCl₃ → CH₃–C≡O⁺ (ion acylium) + AlCl₄⁻", by:"HCl + AlCl₃", prod:"1-phényléthan-1-one (acétophénone)", f:"C₈H₈O", el:{C:8, H:8, O:1},
    end:"AlCl₄⁻ capte le H⁺ : il se forme HCl et AlCl₃ est libéré (en pratique, il reste complexé à la cétone formée)."}
};
/* profil d'énergie qualitatif : réactifs, ET1, complexe σ, ET2, produits (interpolation douce à pente nulle aux nœuds) */
var KN = [[0, 0], [0.30, 1.0], [0.50, 0.60], [0.67, 0.76], [1, -0.30]];
function eProf(x){
  for (var i = 0; i < KN.length - 1; i++){
    if (x <= KN[i + 1][0]){ var s = (x - KN[i][0]) / (KN[i + 1][0] - KN[i][0]); s = clamp(s, 0, 1); return KN[i][1] + (KN[i + 1][1] - KN[i][1]) * (3 * s * s - 2 * s * s * s); }
  }
  return KN[KN.length - 1][1];
}
/* un ion arénium dessiné en formule topologique (sommet 0 = C1 en haut) */
function areniumDraw(ctx, x, y, r, plus, Elab, a, hybrid){
  var V = [];
  for (var q = 0; q < 6; q++){ var an = (-90 + 60 * q) * DEG; V.push([x + r * Math.cos(an), y + r * Math.sin(an)]); }
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 2; ctx.lineCap = "round";
  ctx.beginPath(); for (q = 0; q < 6; q++){ ctx.moveTo(V[q][0], V[q][1]); ctx.lineTo(V[(q + 1) % 6][0], V[(q + 1) % 6][1]); } ctx.stroke();
  var D = {1:[[2, 3], [4, 5]], 3:[[1, 2], [4, 5]], 5:[[1, 2], [3, 4]]}[plus] || [];
  D.forEach(function(e){
    var p = V[e[0]], s2 = V[e[1]], k1 = 0.22;
    var px = lerp(p[0], s2[0], k1), py = lerp(p[1], s2[1], k1), qx = lerp(p[0], s2[0], 1 - k1), qy = lerp(p[1], s2[1], 1 - k1);
    px = lerp(px, x, 0.2); py = lerp(py, y, 0.2); qx = lerp(qx, x, 0.2); qy = lerp(qy, y, 0.2);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
  });
  if (hybrid){
    ctx.setLineDash([4, 4]); ctx.strokeStyle = "#7a5aa6"; ctx.beginPath();
    for (q = 1; q <= 5; q++){ var px2 = lerp(V[q][0], x, 0.32), py2 = lerp(V[q][1], y, 0.32); if (q === 1) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2); }
    ctx.stroke(); ctx.setLineDash([]);
  }
  /* C1 sp³ : H et E */
  var top = V[0], hx = top[0] - r * 0.55, hy = top[1] - r * 0.5, ex = top[0] + r * 0.55, ey = top[1] - r * 0.5;
  ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(hx, hy); ctx.moveTo(top[0], top[1]); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.font = "800 12px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#2c3a4e";
  ctx.fillText("H", hx - 5, hy - 5); ctx.fillStyle = "#2a6fdb"; ctx.textAlign = "left"; ctx.fillText(Elab, ex + 1, ey - 5);
  ctx.restore();
  if (hybrid) [1, 3, 5].forEach(function(q2){ var bx = lerp(V[q2][0], x, -0.42), by = lerp(V[q2][1], y, -0.42); label(ctx, "δ+", bx, by, {size:11, col:"#c56a00", alpha:a}); });
  else { var bx = lerp(V[plus][0], x, -0.45), by = lerp(V[plus][1], y, -0.45); badge(ctx, bx, by, "+", "#e08a1e", a, 8); }
}
SFA.sim({
  id:"org-sear-mecanisme-3d", ch:"c09", tag:"Composés aromatiques",
  titre:"Substitution électrophile aromatique en 3D : le complexe σ",
  resume:"Un électrophile s'approche du benzène, le cycle perd son aromaticité le temps d'un cation arénium, puis la perte de H⁺ la lui rend : suis la molécule en 3D et le profil d'énergie en même temps.",
  but:"Choisis la réaction (nitration, bromation ou acylation de Friedel-Crafts) et regarde : (1) les électrons π du cycle attaquent l'électrophile E⁺ (étape lente), (2) le carbone attaqué devient sp³ : c'est le complexe σ, dont la charge + se répartit sur trois carbones (formes limites sous la scène), (3) une base arrache le H⁺ et le nuage π se referme. Le point orange sur le profil d'énergie suit l'animation. Glisse sur la molécule pour la tourner, ou fais glisser l'avancement ξ.",
  aRetenir:"Mécanisme en deux étapes : addition de E⁺ (lente, état de transition le plus haut, perte de l'aromaticité) → complexe σ (ion arénium, charge + délocalisée en ortho et para du carbone attaqué, sur C2, C4 et C6) → perte de H⁺ (rapide) qui rétablit le système aromatique à 6 électrons π. Bilan : un H du cycle est remplacé par E ; c'est une substitution, pas une addition, parce que le produit garde l'aromaticité. Les électrophiles sont fabriqués par un catalyseur : NO₂⁺ (HNO₃/H₂SO₄), Br⁺ (Br₂/FeBr₃), R–C≡O⁺ (RCOCl/AlCl₃).",
  piege:"Le benzène n'additionne pas Br₂ comme un alcène : sans catalyseur (FeBr₃), Br₂ n'est pas assez électrophile, et l'addition détruirait l'aromaticité. Dans le complexe σ, le carbone attaqué ne porte pas la charge + : elle est en ortho et en para de lui. Et le profil a deux bosses : la plus haute est la première (formation du complexe σ), c'est elle qui fixe la vitesse.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? 1.05 : 0.85; r0(); }; c.resize();
    var gR = k.canvas(150), gE = k.canvas(160);
    var st = {a:0.5, b:0.48, spin:true, xi:0, play:true, hold:1.2, t:0, ts:0};
    dragView(c, st); st.onview = function(){ st.spin = false; spinT.set(false); k.redraw(); };
    var rS = k.seg("Réaction", [["nitr", "Nitration"], ["brom", "Bromation"], ["fc", "Friedel-Crafts"]], "nitr", function(){ st.xi = 0; xS.set(0); st.play = true; st.hold = 1.0; });
    var xS = k.slider("Avancement de la réaction ξ", 0, 1, 0.005, 0, "", function(v){ st.xi = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.xi >= 0.999) st.xi = 0; st.play = !st.play; st.hold = 0; }, true);
    k.button("Arrêt sur le complexe σ", function(){ st.xi = 0.5; xS.set(0.5); st.play = false; });
    var piT = k.toggle("Montrer le nuage d'électrons π", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Étape", "Carbone attaqué", "Électrons π du cycle", "Produit", "M(produit)"]);
    var nt = k.note("", "ok");
    var solv = seeded(14, 11);
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.xi >= 1){ st.xi = 0; st.hold = 0.8; }
        else {
          var sp = st.xi > 0.25 && st.xi < 0.75 ? 0.05 : 0.08, nx = st.xi + dt * sp;
          if (st.xi < 0.5 && nx >= 0.5){ nx = 0.5; st.hold = 2.4; }
          if (nx >= 1){ nx = 1; st.hold = 3.0; }
          st.xi = nx;
        }
        xS.set(st.xi);
      }
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.5 + 0.5 * Math.sin(st.ts * 0.3); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var R = SE[rS.value], ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, xi = st.xi, t = st.t;
      c.clear(); bgScene(ctx, W, H); solvent(ctx, W, H, solv, t, 0.10);
      var b = ease((xi - 0.10) / 0.38), f = ease((xi - 0.62) / 0.30), ap = ease((xi - 0.50) / 0.13), hT = ease((xi - 0.60) / 0.12), lv = ease((xi - 0.74) / 0.24);
      var RR = 1.39, X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], C1 = [RR, 0, 0];
      var atoms = [], bonds = [], extra = [], i, th;
      for (i = 0; i < 6; i++){ th = i * PI / 3; atoms.push(At("C", [RR * Math.cos(th), 0, RR * Math.sin(th)], {lab:String(i + 1)})); }
      for (i = 0; i < 6; i++) bonds.push({a:i, b:(i + 1) % 6, o:1});
      for (i = 1; i < 6; i++){ th = i * PI / 3; atoms.push(At("H", [2.48 * Math.cos(th), 0, 2.48 * Math.sin(th)])); bonds.push({a:i, b:atoms.length - 1, o:1}); }
      var sig = b * (1 - f);   /* « quantité » de complexe σ */
      /* charge + délocalisée sur C2, C4, C6 ; la forme limite mise en avant tourne */
      var rk = Math.floor(t * 0.8) % 3, hiC = [1, 3, 5][rk];
      [1, 3, 5].forEach(function(q){ var pulse = 0.55 + 0.45 * (q === hiC ? 1 : 0.35); atoms[q].glow = "rgba(240,140,30," + (0.75 * sig * pulse).toFixed(3) + ")"; atoms[q].badge = "+"; atoms[q].badgeCol = "#e08a1e"; atoms[q].badgeA = sig * (q === hiC ? 1 : 0.45); });
      /* électrophile */
      var dES = nrm(add(mul(X, Math.cos(54.7 * DEG)), mul(Y, Math.sin(54.7 * DEG)))), dHS = nrm(add(mul(X, Math.cos(54.7 * DEG)), mul(Y, -Math.sin(54.7 * DEG))));
      var dE = f > 0 ? slerpD(dES, X, f) : slerpD(Y, dES, b), PE = add(C1, mul(dE, R.LE + 2.2 * Math.pow(1 - b, 1.3)));
      var iE = atoms.length, tg = Z;
      if (rS.value === "nitr"){
        atoms.push(At("N", PE, {lab:"N"}));
        var phN = (90 - 28 * b) * DEG;
        [1, -1].forEach(function(sg){ atoms.push(At("O", add(PE, mul(add(mul(dE, Math.cos(phN)), mul(tg, sg * Math.sin(phN))), 1.21)), {lab:"O"})); bonds.push({a:iE, b:atoms.length - 1, o:2}); });
      } else if (rS.value === "brom"){
        atoms.push(At("Br", PE, {lab:"Br"}));
      } else {
        atoms.push(At("C", PE));
        var phA = (90 - 30 * b) * DEG, dO = add(mul(dE, Math.cos(phA)), mul(tg, Math.sin(phA))), dM = add(mul(dE, Math.cos(phA)), mul(tg, -Math.sin(phA)));
        atoms.push(At("O", add(PE, mul(dO, lerp(1.13, 1.22, b))), {lab:"O"})); bonds.push({a:iE, b:atoms.length - 1, o:b < 0.5 ? 3 : 2});
        var iM = atoms.length; atoms.push(At("C", add(PE, mul(dM, lerp(1.46, 1.50, b))))); bonds.push({a:iE, b:iM, o:1});
        tetra3(mul(dM, -1), Y, t * 0.0).forEach(function(d){ atoms.push(At("H", add(atoms[iM].p, mul(d, 1.09)))); bonds.push({a:iM, b:atoms.length - 1, o:1}); });
      }
      if (b < 0.45){ atoms[iE].badge = "+"; atoms[iE].badgeCol = "#2a6fdb"; atoms[iE].badgeA = 1 - b / 0.45; }
      bonds.push({a:0, b:iE, o:1, alpha:clamp(b * 1.6, 0, 1), dash:b < 0.97});
      /* base (contre-ion) */
      var hAt0 = add(C1, mul(dHS, 1.09)), dAp = nrm(add(dHS, [0.2, 0.25, 1.0])), ligT = add(hAt0, mul(dAp, R.LH + 0.3));
      var Ap = add(ligT, mul(dAp, R.Lc)), Wp = add(Ap, add(mul(dAp, 0.6), [0, 0.6, 0])), Lp = add(Ap, add(mul(dAp, 0.5), [0, -0.3, 0]));
      var Bc = lv > 0 ? lerp3(Ap, Lp, lv) : lerp3(Wp, Ap, ap);
      var u = nrm(sub(hAt0, Bc)), sep = R.split ? ease((xi - 0.80) / 0.15) * 1.4 : 0;
      var iB = atoms.length; atoms.push(At(R.ctr, Bc, {lab:R.ctr}));
      var ligD = [u].concat(tetra3(u, Y, t * 0.5 * (1 - ap)));   /* tétraèdre : un ligand pointe vers le H à arracher */
      var iL0 = atoms.length;
      ligD.forEach(function(d, q){
        var L = R.Lc + (q === 0 ? sep : 0);
        atoms.push(At(R.lig, add(Bc, mul(d, L)), {lab:R.lig === "O" ? "O" : R.lig}));
        bonds.push({a:iB, b:atoms.length - 1, o:1, alpha:q === 0 ? 1 - sep / 1.4 : 1, dash:q === 0 && sep > 0.05});
      });
      if (rS.value === "nitr"){ atoms.push(At("H", add(atoms[iL0 + 1].p, mul(nrm(add(ligD[1], [0, -0.4, 0])), 0.97)))); bonds.push({a:iL0 + 1, b:atoms.length - 1, o:1}); }
      /* H du carbone attaqué : il passe sur la base */
      var dH = slerpD(X, dHS, b), hOnC = add(C1, mul(dH, 1.09)), hOnL = add(atoms[iL0].p, mul(u, R.LH));
      var iH = atoms.length; atoms.push(At("H", lerp3(hOnC, hOnL, hT)));
      bonds.push({a:0, b:iH, o:1, alpha:1 - hT, dash:hT > 0.02});
      bonds.push({a:iL0, b:iH, o:1, alpha:hT, dash:hT < 0.98});
      if (hT > 0.5){ atoms[iH].glow = "rgba(42,111,219," + (0.5 * (1 - lv)).toFixed(3) + ")"; }
      /* nuage π : deux anneaux de part et d'autre du plan ; il s'ouvre au-dessus de C1 dans le complexe σ */
      /* cadrage automatique (lissé) : toute la scène reste dans le cadre quelle que soit la vue */
      var bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
      atoms.forEach(function(a){ var r = rot3(a.p, st.a, st.b); bx0 = Math.min(bx0, r[0]); bx1 = Math.max(bx1, r[0]); by0 = Math.min(by0, r[1]); by1 = Math.max(by1, r[1]); });
      bx0 = Math.min(bx0, -2.6); bx1 = Math.max(bx1, 2.6);
      var scT = Math.min((W - 24) / (bx1 - bx0 + 1.4), (H - 76) / (by1 - by0 + 1.4)), mxT = (bx0 + bx1) / 2, myT = (by0 + by1) / 2;
      if (st.sc == null || st.rk !== rS.value){ st.sc = scT; st.mx = mxT; st.my = myT; st.rk = rS.value; }
      st.sc += (scT - st.sc) * 0.05; st.mx += (mxT - st.mx) * 0.05; st.my += (myT - st.my) * 0.05;
      var sc = st.sc, V = {st:st, sc:sc, cx:W * 0.5 - st.mx * sc, cy:H * 0.5 + 6 + st.my * sc};
      if (piT.value){
        for (var sg = -1; sg <= 1; sg += 2) for (var q = 0; q < 40; q++){
          (function(sg, q){
            var ang = q * 2 * PI / 40, dA = Math.abs(Math.atan2(Math.sin(ang), Math.cos(ang))), fade = 1 - sig * clamp((0.85 - dA) / 0.35, 0, 1);
            if (fade < 0.03) return;
            var P = proj3([RR * Math.cos(ang), 0.62 * sg, RR * Math.sin(ang)], st, sc, V.cx, V.cy), rad = 0.62 * sc * P.s;
            extra.push({z:P.z - 0.2, f:function(){
              var g = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, rad);
              g.addColorStop(0, "rgba(118,92,230," + (0.17 * fade).toFixed(3) + ")"); g.addColorStop(1, "rgba(118,92,230,0)");
              ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, rad, 0, 7); ctx.fill();
            }});
          })(sg, q);
        }
      }
      var pr = drawScene(c, V, atoms, bonds, extra);
      /* flèches courbes */
      var a1 = clamp((0.34 - xi) / 0.06, 0, 1);
      var piPt = proj3(add(mul(add(atoms[0].p, atoms[1].p), 0.5), [0, 0.62, 0]), st, sc, V.cx, V.cy), pE = pr[iE];
      var s1 = trim(piPt, pE, 2, pE.r + 6);
      curly(ctx, s1[0], s1[1], s1[2], s1[3], -38, "#2a6fdb", a1 * 0.95);
      var a2 = clamp(1 - Math.abs(xi - 0.58) / 0.12, 0, 1), pL = pr[iL0], pH = pr[iH], s2 = trim(pL, pH, pL.r + 2, pH.r + 4);
      curly(ctx, s2[0], s2[1], s2[2], s2[3], 30, "#c0392b", a2);
      var mCH = {x:(pr[0].x + pH.x) / 2, y:(pr[0].y + pH.y) / 2}, mR = proj3(mul(add(atoms[0].p, atoms[5].p), 0.5), st, sc, V.cx, V.cy);
      curly(ctx, mCH.x, mCH.y, mR.x, mR.y, -26, "#1f9d55", a2 * 0.95);
      /* étiquettes */
      var tE = b < 0.5 ? R.E : "", fs = ph ? 11.5 : 13;
      if (tE) label(ctx, tE + "  (électrophile)", pE.x, pE.y - pE.r - 16, {size:fs, col:"#1d4fae", bg:"rgba(255,255,255,.85)"});
      var pB = pr[iB];
      label(ctx, hT < 0.5 ? R.base + " (base)" : R.by, pB.x, Math.min(H - 40, pB.y + pB.r + (R.Lc * sc * 0.55) + 12), {size:fs, col:"#8a2d1e", bg:"rgba(255,255,255,.85)"});
      var stage = xi < 0.08 ? 0 : xi < 0.28 ? 1 : xi < 0.34 ? 2 : xi < 0.56 ? 3 : xi < 0.64 ? 4 : xi < 0.72 ? 5 : xi < 0.94 ? 6 : 7;
      var TXT = ["Réactifs : benzène + " + R.E, "Les électrons π attaquent " + R.E + " (étape lente)", "1er état de transition (le plus haut)", "Complexe σ : cation arénium, + sur C2, C4, C6",
        "La base attaque le H de C1", "2e état de transition (perte de H⁺)", "Le doublet C–H referme le sextet aromatique", "Produit : " + R.prod.split(" (")[0]];
      label(ctx, TXT[stage], 10, 16, {size:ph ? 12 : 13.5, align:"left", col:"#13233a", bg:"rgba(255,255,255,.82)"});
      if (!ph) label(ctx, "glisse pour tourner", W - 10, 16, {size:11, align:"right", col:"#8a95a3", weight:600});
      var mid = sig > 0.5 ? "ion arénium (non aromatique)" : xi > 0.9 ? R.prod.split(" (")[0] + " (aromatique)" : "benzène (aromatique)";
      label(ctx, mid, W * 0.5, H - 16, {size:ph ? 12 : 13.5, col:sig > 0.5 ? "#a35a00" : "#1d4fae", bg:"rgba(255,255,255,.88)"});
      /* formes limites */
      gR.clear(); var g = gR.ctx, GW = gR.W, GH = gR.H, showH = GW >= 620, n = showH ? 4 : 3;
      g.fillStyle = "#fbfcfe"; g.fillRect(0, 0, GW, GH);
      var on = sig > 0.3, rr0 = Math.min(30, GW / (n * 3.4)), slot = GW / n, Elab = {nitr:"NO₂", brom:"Br", fc:"COCH₃"}[rS.value];
      label(g, on ? "Formes limites du complexe σ (la charge + n'est jamais sur C1)" : "Formes limites du complexe σ (il apparaît à l'étape 3)", GW / 2, 13, {size:ph ? 11 : 12, col:"#2c3a4e"});
      [1, 3, 5].forEach(function(pl, q){
        var x0 = slot * (q + 0.5), al = on ? (pl === hiC ? 1 : 0.55) : 0.3;
        if (pl === hiC && on){ g.save(); g.fillStyle = "rgba(240,140,30,.10)"; rr(g, x0 - slot * 0.46, 26, slot * 0.92, GH - 30, 10); g.fill(); g.restore(); }
        areniumDraw(g, x0, 82, rr0, pl, Elab, al, false);
        label(g, "+ en " + (pl === 3 ? "para (C4)" : "ortho (C" + (pl + 1) + ")"), x0, GH - 13, {size:11, col:"#5f6b7a", alpha:Math.max(al, 0.6)});
        if (q < 2) label(g, "↔", slot * (q + 1), 82, {size:18, col:"#2c3a4e", alpha:on ? 1 : 0.4});
      });
      if (showH){ var x3 = slot * 3.5; areniumDraw(g, x3, 82, rr0, 0, Elab, on ? 1 : 0.3, true); label(g, "hybride de résonance", x3, GH - 13, {size:11, col:"#5f6b7a"}); label(g, "≡", slot * 3, 82, {size:18, col:"#2c3a4e", alpha:on ? 1 : 0.4}); }
      /* profil d'énergie */
      gE.clear(); var e = gE.ctx, ax = plotFrame(gE, {x0:0, x1:1, y0:-0.45, y1:1.18, l:30, b:24, t:24, r:14});
      label(e, "Énergie (profil qualitatif)", ax.L - 4, 11, {size:11.5, align:"left", col:"#2c3a4e"});
      label(e, "avancement ξ", ax.R, ax.B + 14, {size:11, align:"right", col:"#5f6b7a", weight:600});
      e.save(); e.fillStyle = "rgba(42,111,219,.08)"; e.beginPath(); e.moveTo(ax.X(0), ax.B);
      for (var j = 0; j <= 120; j++) e.lineTo(ax.X(j / 120), ax.Y(eProf(j / 120)));
      e.lineTo(ax.X(1), ax.B); e.closePath(); e.fill();
      e.strokeStyle = "#2a6fdb"; e.lineWidth = 2.4; e.beginPath();
      for (j = 0; j <= 120; j++){ if (j === 0) e.moveTo(ax.X(0), ax.Y(eProf(0))); else e.lineTo(ax.X(j / 120), ax.Y(eProf(j / 120))); }
      e.stroke();
      /* Ea1 et Ea2 */
      e.strokeStyle = "#a35a00"; e.lineWidth = 1.2; e.setLineDash([3, 3]);
      e.beginPath(); e.moveTo(ax.X(0), ax.Y(0)); e.lineTo(ax.X(0.3), ax.Y(0)); e.moveTo(ax.X(0.5), ax.Y(0.6)); e.lineTo(ax.X(0.67), ax.Y(0.6)); e.stroke(); e.setLineDash([]);
      S.draw.arrow(gE, ax.X(0.27), ax.Y(0), ax.X(0.27), ax.Y(1.0) + 2, "#a35a00", 1.6);
      S.draw.arrow(gE, ax.X(0.64), ax.Y(0.6), ax.X(0.64), ax.Y(0.76) + 2, "#a35a00", 1.6);
      label(e, "Ea₁ (lente)", ax.X(0.27) - 6, ax.Y(0.5), {size:11, align:"right", col:"#a35a00"});
      label(e, "Ea₂", ax.X(0.64) + 6, ax.Y(0.68), {size:11, align:"left", col:"#a35a00"});
      label(e, "complexe σ", ax.X(0.5), ax.Y(0.6) + 12, {size:11, col:"#2c3a4e", weight:600});
      label(e, "réactifs", ax.X(0.02), ax.Y(0) + 11, {size:11, align:"left", col:"#2c3a4e", weight:600});
      label(e, "produits", ax.X(0.98), ax.Y(-0.30) - 11, {size:11, align:"right", col:"#2c3a4e", weight:600});
      e.strokeStyle = "rgba(224,138,30,.6)"; e.setLineDash([3, 4]); e.beginPath(); e.moveTo(ax.X(xi), ax.T); e.lineTo(ax.X(xi), ax.B); e.stroke(); e.restore();
      S.draw.dot(gE, ax.X(xi), ax.Y(eProf(xi)), 6, "#e08a1e");
      /* valeurs */
      var sp3 = b > 0.5 && f < 0.5;
      ro.set(0, ["réactifs", "attaque de E⁺", "état de transition 1", "complexe σ", "attaque de la base", "état de transition 2", "réaromatisation", "produit"][stage]);
      ro.set(1, sp3 ? "sp³ (tétraédrique)" : "sp² (plan)");
      ro.set(2, sig > 0.5 ? "4 sur 5 C : non aromatique" : "6 sur 6 C : aromatique");
      ro.set(3, R.prod.split(" (")[0] + " " + R.f);
      ro.set(4, F2(molM(R.el), 2) + " g/mol");
      var msg = "<b>" + R.n + "</b> : " + R.gen + ". ";
      if (stage <= 2) msg += "Le cycle donne deux de ses électrons π : il perd son aromaticité, d'où la barrière la plus haute (Ea₁).";
      else if (stage === 3) msg += "Le carbone attaqué porte H et E (sp³). Les 4 électrons π restants sont répartis sur 5 carbones : la charge + est en ortho et en para (C2, C4, C6), jamais sur C1.";
      else if (stage <= 6) msg += "Perte de H⁺ plutôt qu'addition d'un nucléophile : seule la perte de H⁺ rend au cycle ses 6 électrons π. " + R.end;
      else msg += "Bilan : C₆H₆ + " + R.E + " → " + R.f + " + H⁺. " + R.end;
      nt.set(msg + " <i>Géométrie idéalisée, profil d'énergie qualitatif.</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 2. Aldolisation puis crotonisation de l'éthanal                         */
/* ====================================================================== */
/* indices : 0 C1, 1 O1, 2 H1, 3 C2, 4 H2a, 5 H2b, 6 H2c, 7 C3, 8 O3, 9 H3, 10 C4, 11-13 H4, 14 Ob, 15 Hb */
var ALD = (function(){
  var dA = [Math.cos(33 * DEG), Math.sin(33 * DEG), 0], dB = [Math.cos(33 * DEG), -Math.sin(33 * DEG), 0], Z = [0, 0, 1], Y = [0, 1, 0], X = [1, 0, 0];
  var nE = nrm(cross(dA, Z)), C1 = [-1.6, 0.6, -0.4], C2 = add(C1, mul(dA, 1.50)), C3b = add(C2, mul(dB, 1.54));
  var pp = sp3pair(mul(dA, -1), dB), p1 = pp[0][2] > 0 ? pp[0] : pp[1], p2 = pp[0][2] > 0 ? pp[1] : pp[0];
  var qq = sp3pair(mul(dB, -1), dA), q2 = qq[0][2] > 0 ? qq[0] : qq[1], q1 = qq[0][2] > 0 ? qq[1] : qq[0];   /* q2 : O3 (devant), q1 : H3 */
  var hO3 = nrm(add(mul(q2, Math.cos(71 * DEG)), mul(X, Math.sin(71 * DEG))));
  /* éthanal B libre : plan ⟂ à dB (l'énolate arrive selon dB) */
  function projP(v){ return nrm(sub(v, mul(dB, dot(v, dB)))); }
  var v0 = projP(dA), cA = rotAx(v0, dB, 120 * DEG), cB = rotAx(v0, dB, -120 * DEG), bO = dot(cA, projP(q2)) > dot(cB, projP(q2)) ? cA : cB, bH = bO === cA ? cB : cA;
  var FR = [];
  function water(O, h1){ return rotAx(h1, perpTo(h1), 104.5 * DEG); }
  for (var s = 0; s < 6; s++){
    var P = [], par = [];
    function set(i, pos, pa){ P[i] = pos; par[i] = pa; }
    var N = s <= 3 ? nE : Z;
    set(0, C1, -1); set(3, C2, 0);
    set(1, add(C1, mul(rotAx(dA, N, 120 * DEG), 1.22)), 0); set(2, add(C1, mul(rotAx(dA, N, -120 * DEG), 1.10)), 0);
    /* C3 et son groupe */
    var C3 = s === 0 ? add(C2, mul(dB, 5.0)) : s === 1 ? add(C2, mul(dB, 3.0)) : C3b;
    var dC4 = s <= 1 ? v0 : dA, dO3 = s <= 1 ? bO : q2, dH3 = s <= 1 ? bH : s === 5 ? nrm(sub(dB, dA)) : q1;
    var LO3 = s <= 1 ? 1.22 : s === 2 ? 1.36 : s === 5 ? 3.4 : 1.43;
    set(7, C3, s <= 1 ? -1 : 3); set(8, add(C3, mul(dO3, LO3)), 7); set(9, add(C3, mul(dH3, 1.09)), 7);
    var C4 = add(C3, mul(dC4, 1.52)); set(10, C4, 7);
    tetra3(mul(dC4, -1), Z, 0).forEach(function(d, q){ set(11 + q, add(C4, mul(d, 1.09)), 10); });
    /* hydrogènes de C2 et ion hydroxyde / eau */
    var Ob, Hb, k1;
    if (s === 0){
      set(4, add(C2, mul(p1, 1.09)), 3); set(5, add(C2, mul(p2, 1.09)), 3); set(6, add(C2, mul(dB, 1.09)), 3);
      var w0 = nrm(add(dB, mul(Z, 1.3))); Ob = add(P[6], mul(w0, 1.8)); set(14, Ob, -1); set(15, add(Ob, mul(nrm([0.2, -0.8, 0.55]), 0.97)), 14);
    } else if (s === 1){
      set(4, add(C2, mul(nrm(add(mul(dA, 0.5), mul(Z, 0.866))), 1.08)), 3); set(5, add(C2, mul(nrm(add(mul(dA, 0.5), mul(Z, -0.866))), 1.08)), 3);
      Ob = add(C2, [2.2, -2.9, 3.4]); k1 = nrm(sub(add(C2, mul(dB, 1.09)), Ob));
      set(14, Ob, -1); set(6, add(Ob, mul(k1, 0.97)), 14); set(15, add(Ob, mul(water(Ob, k1), 0.97)), 14);
    } else if (s === 2){
      set(4, add(C2, mul(p1, 1.09)), 3); set(5, add(C2, mul(p2, 1.09)), 3);
      Ob = add(P[8], mul(hO3, 2.72)); set(14, Ob, -1); set(6, add(Ob, mul(hO3, -0.97)), 14); set(15, add(Ob, mul(water(Ob, mul(hO3, -1)), 0.97)), 14);
    } else {
      if (s === 3){ set(4, add(C2, mul(p1, 1.09)), 3); set(5, add(C2, mul(p2, 1.09)), 3); Ob = add(C2, [1.0, -0.6, 3.4]); set(14, Ob, -1); set(15, add(Ob, mul(nrm([0.3, -0.7, 0.6]), 0.97)), 14); }
      else {
        Ob = s === 4 ? add(C2, mul(p1, 2.89)) : add(C2, [-0.6, 2.7, 3.5]);
        set(14, Ob, -1); set(4, add(Ob, mul(p1, -0.97)), 14); set(15, add(Ob, mul(water(Ob, mul(p1, -1)), 0.97)), 14);
        set(5, add(C2, mul(Y, 1.08)), 3);
      }
      set(6, add(P[8], mul(hO3, 0.97)), 8);
    }
    FR.push({P:P, par:par});
  }
  var BONDS = [
    [0, 1, [2, 2, 2, 2, 2, 2]], [0, 2, 1], [0, 3, 1], [7, 9, 1], [7, 10, 1], [10, 11, 1], [10, 12, 1], [10, 13, 1], [14, 15, 1],
    [3, 4, [1, 1, 1, 1, 0, 0]], [3, 5, 1], [3, 6, [1, 0, 0, 0, 0, 0]], [14, 6, [0, 1, 1, 0, 0, 0]], [8, 6, [0, 0, 0, 1, 1, 1]], [14, 4, [0, 0, 0, 0, 1, 1]],
    [7, 8, [2, 2, 1, 1, 1, 0]], [3, 7, [0, 0, 1, 1, 1, 2]]
  ];
  var ORDER = [0, 3, 1, 2, 7, 8, 9, 10, 11, 12, 13, 14, 15, 4, 5, 6];
  function at(s){
    s = clamp(s, 0, 5);
    var i = Math.min(4, Math.floor(s)), t = ease(s - i), A = FR[i], B = FR[i + 1], P = [];
    ORDER.forEach(function(n){
      var pa = A.par[n];
      if (pa >= 0 && pa === B.par[n]){
        var dA2 = sub(A.P[n], A.P[pa]), dB2 = sub(B.P[n], B.P[pa]);
        P[n] = add(P[pa], mul(slerpD(dA2, dB2, t), lerp(len(dA2), len(dB2), t)));
      } else P[n] = lerp3(A.P[n], B.P[n], t);
    });
    var bonds = [];
    BONDS.forEach(function(bd){
      var oa = Array.isArray(bd[2]) ? bd[2][i] : bd[2], ob = Array.isArray(bd[2]) ? bd[2][i + 1] : bd[2];
      if (!oa && !ob) return;
      if (oa && ob) bonds.push({a:bd[0], b:bd[1], o:t < 0.5 ? oa : ob});
      else if (oa) bonds.push({a:bd[0], b:bd[1], o:oa, alpha:1 - t, dash:t > 0.02});
      else bonds.push({a:bd[0], b:bd[1], o:ob, alpha:t, dash:t < 0.98});
    });
    return {P:P, bonds:bonds, i:i, t:t};
  }
  return {at:at, C2:C2};
})();
var ALD_SP = [
  {n:"2 × éthanal (+ HO⁻)", f:"C₂H₄O", el:{C:2, H:4, O:1}, hy:"sp³ / sp²", ch:[14]},
  {n:"énolate de l'éthanal", f:"C₂H₃O⁻", el:{C:2, H:3, O:1}, hy:"sp² / sp²", ch:[3]},
  {n:"alcoolate (ion alkoxyde)", f:"C₄H₇O₂⁻", el:{C:4, H:7, O:2}, hy:"sp³ / sp³", ch:[8]},
  {n:"aldol : 3-hydroxybutanal", f:"C₄H₈O₂", el:{C:4, H:8, O:2}, hy:"sp³ / sp³", ch:[14]},
  {n:"énolate de l'aldol", f:"C₄H₇O₂⁻", el:{C:4, H:7, O:2}, hy:"sp² / sp³", ch:[3]},
  {n:"(E)-but-2-énal", f:"C₄H₆O", el:{C:4, H:6, O:1}, hy:"sp² / sp²", ch:[8]}
];
var ALD_ST = [
  ["Départ : deux éthanal et HO⁻ (catalyseur)", "1. HO⁻ arrache un H en α (sur le CH₃)"],
  ["Énolate : carbanion stabilisé par le C=O", "2. L'énolate attaque le C=O de l'autre éthanal"],
  ["Nouvelle liaison C–C : alcoolate", "3. L'alcoolate reprend H⁺ à l'eau, HO⁻ est régénéré"],
  ["Aldol : 3-hydroxybutanal", "4. On chauffe : HO⁻ arrache un H en α de l'aldol"],
  ["Énolate de l'aldol", "5. HO⁻ s'en va, la double liaison C=C se forme"],
  ["(E)-but-2-énal + H₂O", ""]
];
/* flèches de chaque étape : [départ, arrivée, courbure, couleur] ; nombre = atome, [a,b] = milieu de liaison */
var ALD_AR = [
  [[14, 6, 30, "#c0392b"], [[3, 6], 3, -26, "#2a6fdb"]],
  [[3, 7, -36, "#2a6fdb"], [[7, 8], 8, 28, "#c0392b"]],
  [[8, 6, 30, "#c0392b"], [[6, 14], 14, -24, "#2a6fdb"]],
  [[14, 4, -30, "#c0392b"], [[3, 4], 3, 24, "#2a6fdb"]],
  [[3, [3, 7], -30, "#2a6fdb"], [[7, 8], 8, 28, "#c0392b"]]
];
SFA.sim({
  id:"org-aldolisation-3d", ch:"c10", tag:"Carbonyles",
  titre:"Aldolisation puis crotonisation de l'éthanal en 3D",
  resume:"L'énolate d'un éthanal attaque une autre molécule d'éthanal : on obtient l'aldol (3-hydroxybutanal), puis, en chauffant, l'eau part et il reste le but-2-énal. Suis chaque flèche courbe en 3D.",
  but:"L'animation enchaîne les cinq étapes en milieu basique ; à chaque arrêt, les flèches courbes montrent l'étape suivante (en rouge, le doublet qui attaque ; en bleu, celui qui se déplace). Fais glisser « étape » pour revenir en arrière, glisse sur la scène pour tourner les molécules. Les numéros 1 à 4 sont ceux de la chaîne du produit. Change la masse d'éthanal pour calculer les masses maximales d'aldol et de but-2-énal.",
  aRetenir:"Aldolisation (base, à froid) : HO⁻ arrache un H en α du C=O (il est acide, pKa ≈ 17, parce que l'énolate est stabilisé par mésomérie) ; l'énolate, nucléophile par son carbone, attaque le carbone électrophile d'un autre carbonyle ; l'alcoolate reprend H⁺ : on obtient un β-hydroxyaldéhyde (aldol). 2 CH₃CHO → CH₃–CH(OH)–CH₂–CHO. Crotonisation (chauffage) : déshydratation par énolate (E1cB) → aldéhyde α,β-insaturé conjugué, CH₃–CH=CH–CHO + H₂O. HO⁻ n'est pas consommé : c'est un catalyseur.",
  piege:"Le carbone qui attaque est le carbone α de l'énolate, pas son oxygène : la nouvelle liaison est C–C. L'aldol garde la masse des deux éthanal (88,11 g/mol = 2 × 44,05) ; c'est la crotonisation qui perd une molécule d'eau. Et la double liaison C=C se forme entre C2 et C3, conjuguée avec C=O, pas entre C3 et C4.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.6}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? 1.0 : 0.78; r0(); }; c.resize();
    var gS = k.canvas(104);
    var st = {a:0.25, b:0.2, spin:true, s:0, play:true, hold:1.6, t:0, ts:0, sc:null};
    dragView(c, st); st.onview = function(){ st.spin = false; spinT.set(false); k.redraw(); };
    var sS = k.slider("Étape du mécanisme", 0, 5, 0.01, 0, "", function(v){ st.s = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.s >= 4.999) st.s = 0; st.play = !st.play; st.hold = 0; }, true);
    k.button("Aller à l'aldol", function(){ st.s = 3; sS.set(3); st.play = false; });
    var mS = k.slider("Masse d'éthanal de départ", 1, 50, 1, 10, "g");
    var numT = k.toggle("Numéros des carbones (1 à 4)", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Étape", "Espèce", "Formule · M", "Hybridation C2 / C3", "n(éthanal)", "Masse max. d'aldol · de but-2-énal"]);
    var nt = k.note("", "ok");
    var solv = seeded(12, 5);
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.s >= 5){ st.s = 0; st.hold = 1.6; }
        else { var nx = st.s + dt * 0.42, fl = Math.floor(st.s); if (Math.floor(nx) > fl){ nx = fl + 1; st.hold = nx >= 5 ? 3.2 : 1.8; } st.s = Math.min(5, nx); }
        sS.set(st.s);
      }
      if (st.spin && !st.drag){ st.ts += dt; st.a = 0.25 + 0.42 * Math.sin(st.ts * 0.32); st.b = 0.2 + 0.1 * Math.sin(st.ts * 0.21); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, s = st.s, G = ALD.at(s), t = st.t;
      c.clear(); bgScene(ctx, W, H, "#ffffff", "#e6ecf4"); solvent(ctx, W, H, solv, t, 0.11);
      var near = Math.round(s), sp = ALD_SP[near];
      var atoms = [], el = ["C", "O", "H", "C", "H", "H", "H", "C", "O", "H", "C", "H", "H", "H", "O", "H"];
      G.P.forEach(function(p, n){ atoms.push(At(el[n], p, {lab:el[n] === "O" ? "O" : ""})); });
      if (numT.value){ atoms[0].lab = "1"; atoms[3].lab = "2"; atoms[7].lab = "3"; atoms[10].lab = "4"; }
      atoms[14].col = "#e0503f";
      /* charges : celle de l'image la plus proche, en fondu pendant le passage */
      var fr = Math.abs(s - near), ca = clamp(1 - fr / 0.35, 0, 1);
      sp.ch.forEach(function(n){ atoms[n].badge = "−"; atoms[n].badgeCol = "#c0392b"; atoms[n].badgeA = ca; atoms[n].glow = "rgba(214,57,47," + (0.35 * ca).toFixed(3) + ")"; });
      /* cadrage stable */
      /* cadrage automatique (lissé) sur la boîte englobante des atomes */
      var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      G.P.forEach(function(p){ var r = rot3(p, st.a, st.b); x0 = Math.min(x0, r[0]); x1 = Math.max(x1, r[0]); y0 = Math.min(y0, r[1]); y1 = Math.max(y1, r[1]); });
      var scT = Math.min((W - 30) / (x1 - x0 + 1.6), (H - 84) / (y1 - y0 + 1.6), W / 6.5);
      var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      if (st.sc == null){ st.sc = scT; st.mx = mx; st.my = my; }
      st.sc += (scT - st.sc) * 0.06; st.mx += (mx - st.mx) * 0.06; st.my += (my - st.my) * 0.06;
      var sc = st.sc, V = {st:st, sc:sc, cx:W * 0.5 - st.mx * sc, cy:H * 0.5 + 4 + st.my * sc};
      var pr = drawScene(c, V, atoms, G.bonds);
      /* flèches de l'étape en cours ou à venir */
      for (var q = 0; q < 5; q++){
        var al = clamp(1 - Math.abs(s - (q + 0.08)) / 0.45, 0, 1); if (al <= 0.03) continue;
        ALD_AR[q].forEach(function(ar){
          function pt(sp2){ if (Array.isArray(sp2)){ var a = pr[sp2[0]], b2 = pr[sp2[1]]; return {x:(a.x + b2.x) / 2, y:(a.y + b2.y) / 2, r:3}; } return pr[sp2]; }
          var p0 = pt(ar[0]), p1 = pt(ar[1]), tt = trim(p0, p1, (p0.r || 3) + 3, (p1.r || 3) + 5);
          curly(ctx, tt[0], tt[1], tt[2], tt[3], ar[2], ar[3], al);
        });
      }
      /* étiquettes */
      var base = Math.min(5, Math.floor(s + 1e-9)), frac = s - base, l1 = frac < 0.02 ? ALD_ST[base][0] : ALD_ST[base][1], l2 = frac < 0.02 && base < 5 ? "→ " + ALD_ST[base][1] : "";
      label(ctx, l1, 10, 16, {size:ph ? 11.5 : 13, align:"left", col:"#13233a", bg:"rgba(255,255,255,.85)"});
      if (l2) label(ctx, l2, 10, 40, {size:ph ? 11 : 12, align:"left", col:"#1d4fae", bg:"rgba(255,255,255,.85)"});
      if (!ph) label(ctx, "glisse pour tourner", W - 10, H - 14, {size:11, align:"right", col:"#8a95a3", weight:600});
      var pO = pr[14], wat = (near === 1 || near === 2 || near >= 4) ? "H₂O" : "HO⁻";
      label(ctx, wat, pO.x, pO.y + pO.r + 13, {size:12, col:"#8a2d1e", bg:"rgba(255,255,255,.8)"});
      if (near === 5){ var pO3 = pr[8]; label(ctx, "HO⁻", pO3.x, pO3.y + pO3.r + 13, {size:12, col:"#8a2d1e", bg:"rgba(255,255,255,.8)"}); }
      if (near === 3 || near === 5){ var nm = near === 3 ? "3-hydroxybutanal (aldol)" : "(E)-but-2-énal"; label(ctx, nm, W / 2, H - 16, {size:ph ? 12.5 : 14, col:"#1d4fae", bg:"rgba(255,255,255,.9)", border:"#c9d6ee", alpha:ca}); }
      /* bandeau du bilan */
      gS.clear(); var g = gS.ctx, GW = gS.W, GH = gS.H, cp = GW < 760, aw = cp ? 26 : 120, bw = (GW - 2 * aw - 12) / 3, act = s < 1.5 ? 0 : s < 3.5 ? 1 : 2;
      g.fillStyle = "#fbfcfe"; g.fillRect(0, 0, GW, GH);
      var BX = [["2 éthanal", "2 CH₃–CHO", "2 × 44,05 g/mol"], ["aldol", cp ? "CH₃CH(OH)CH₂CHO" : "CH₃–CH(OH)–CH₂–CHO", "88,11 g/mol"], ["but-2-énal + H₂O", cp ? "CH₃CH=CHCHO" : "CH₃–CH=CH–CHO", "70,09 + 18,02 g/mol"]];
      BX.forEach(function(bx, q){
        var x0 = 6 + q * (bw + aw), on = q === act, y0 = 8, hh = cp ? 64 : 70;
        g.save(); g.fillStyle = on ? "#eaf1fd" : "#fff"; g.strokeStyle = on ? "#2a6fdb" : "#d9e0ea"; g.lineWidth = on ? 2 : 1; rr(g, x0, y0, bw, hh, 10); g.fill(); g.stroke(); g.restore();
        label(g, bx[0], x0 + bw / 2, y0 + 15, {size:cp ? 11.5 : 13, col:on ? "#1d4fae" : "#2c3a4e", weight:800});
        label(g, bx[1], x0 + bw / 2, y0 + 35, {size:cp ? 10 : 12, col:"#2c3a4e", weight:700});
        label(g, bx[2], x0 + bw / 2, y0 + 54, {size:cp ? 9.5 : 11, col:"#5f6b7a", weight:600});
        if (q < 2){ var ax0 = x0 + bw + 4, ax1 = x0 + bw + aw - 4; S.draw.arrow(gS, ax0, y0 + hh / 2, ax1, y0 + hh / 2, "#2c3a4e", 2);
          if (!cp) label(g, q === 0 ? "HO⁻, à froid" : "chauffage, −H₂O", (ax0 + ax1) / 2, y0 + hh / 2 - 13, {size:11, col:"#5f6b7a", weight:700}); }
      });
      if (cp) label(g, "① aldolisation : HO⁻, à froid   ② crotonisation : chauffage, −H₂O", GW / 2, GH - 11, {size:10.5, col:"#5f6b7a", weight:700});
      else label(g, "aldolisation (addition, aucune perte d'atome)                                  crotonisation (élimination d'eau)", GW / 2, GH - 10, {size:11, col:"#5f6b7a", weight:600});
      /* valeurs */
      var Me = molM({C:2, H:4, O:1}), Ma = molM({C:4, H:8, O:2}), Mc = molM({C:4, H:6, O:1}), m = mS.value, n = m / Me;
      ro.set(0, (near + 1) + " / 6 : " + ["réactifs", "énolate", "alcoolate", "aldol", "énolate de l'aldol", "but-2-énal"][near]);
      ro.set(1, sp.n);
      ro.set(2, sp.f + " · " + F2(molM(sp.el), 2) + " g/mol");
      ro.set(3, sp.hy);
      ro.set(4, F2(n, 3) + " mol");
      ro.set(5, S.fmt(n / 2 * Ma, 2) + " g · " + S.fmt(n / 2 * Mc, 2) + " g");
      var msg = ["L'hydrogène en α du C=O est légèrement acide : sa base conjuguée, l'énolate, est stabilisée par mésomérie (charge partagée entre C2 et O).",
        "L'énolate est nucléophile par son carbone α : il attaque le carbone électrophile (δ+) du C=O de la seconde molécule.",
        "La nouvelle liaison C2–C3 est formée ; l'oxygène porte la charge −. Il reprend un H⁺ à l'eau : HO⁻ est régénéré.",
        "L'aldol est un β-hydroxyaldéhyde : OH sur C3, en position β du C=O. En chauffant, on déclenche la crotonisation.",
        "L'hydrogène en α de l'aldol est arraché à son tour ; le carbanion pousse le groupe HO⁻ voisin (mécanisme E1cB).",
        "La double liaison C2=C3 est conjuguée avec C=O : c'est ce qui rend la déshydratation favorable. Seul l'isomère (E) est dessiné, c'est le majoritaire."][near];
      nt.set(msg + " Bilan : 2 CH₃CHO → CH₃CH(OH)CH₂CHO → CH₃CH=CHCHO + H₂O. Avec " + S.fmt(m, 0) + " g d'éthanal (" + F2(n, 3) + " mol), on obtient au plus " + F2(n / 2, 3) + " mol de chaque produit. <i>Géométries idéalisées ; contre-ion Na⁺ et solvant non dessinés.</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 3. Une amine traverse-t-elle la membrane ?                              */
/* ====================================================================== */
function fNeutral(pH, pKa){ return 1 / (1 + Math.pow(10, pKa - pH)); }
function pctTxt(x){
  var p = x * 100;
  if (p >= 99.995) return "> 99,99 %";
  if (p >= 0.1) return F2(p, p >= 10 ? 1 : 2) + " %";
  var e = Math.floor(Math.log10(p)), m = p / Math.pow(10, e);
  return F2(m, 1) + "·10" + String(e).replace("-", "⁻").replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]; }) + " %";
}
function sciTxt(x){
  if (x >= 0.01 && x < 1000) return F2(x, x < 1 ? 3 : x < 100 ? 2 : 0);
  var e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e);
  if (m >= 9.95){ m = 1; e += 1; }
  return F2(m, 1) + "·10" + String(e).replace("-", "⁻").replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]; });
}
SFA.sim({
  id:"org-amine-ph-membrane", ch:"c10", tag:"Absorption des médicaments",
  titre:"Une amine traverse-t-elle la membrane ? Estomac contre sang",
  resume:"Un médicament aminé est protoné (BH⁺) ou neutre (B) selon le pH : seule la forme neutre traverse la bicouche lipidique. Règle le pKa et les pH, attrape une molécule et pousse-la vers la membrane.",
  but:"À gauche l'estomac (pH ≈ 1,5), à droite le sang (pH 7,4), au milieu la bicouche lipidique. Chaque molécule change sans cesse de forme : BH⁺ (protonée, chargée, entourée d'eau) ou B (neutre). Seules les molécules neutres entrent dans le cœur hydrophobe de la membrane. Choisis le départ (comprimé avalé ou injection), règle le pKa et les pH, et compte les molécules de chaque côté. Attrape une molécule à la souris et pousse-la contre la membrane.",
  aRetenir:"Pour une amine (base faible B, acide conjugué BH⁺) : pH = pKa + log([B]/[BH⁺]), donc la fraction neutre vaut 1/(1 + 10^(pKa − pH)). À pH < pKa, la forme protonée domine ; à pH = pKa, moitié-moitié. Seule la forme neutre, liposoluble, traverse la bicouche par diffusion passive. À l'équilibre, la forme neutre a la même concentration des deux côtés, d'où le rapport des concentrations totales C(sang)/C(estomac) = (1 + 10^(pKa − 7,4)) / (1 + 10^(pKa − pH estomac)). Une amine (pKa ≈ 8 à 10) n'est presque pas absorbée par l'estomac ; elle l'est dans l'intestin (pH ≈ 6 à 7,5). C'est le piégeage ionique.",
  piege:"C'est l'inverse d'un acide faible comme l'aspirine : un acide est neutre en milieu acide, une base est neutre en milieu basique. Le pKa d'une amine est celui de son acide conjugué BH⁺ : plus il est grand, plus l'amine est protonée à un pH donné. Et « neutre » ne veut pas dire « absente » : même à 0,01 % de forme neutre, le passage reste possible, il est juste très lent.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.58}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? 1.12 : 0.64; r0(); }; c.resize();
    var g = k.canvas(160);
    var st = {t:0, parts:[], grab:null, flash:0, hover:null};
    var drug = k.select("Médicament (exemple, pKa de l'amine protonée)", [["", "réglage libre"], ["7.9", "lidocaïne (pKa ≈ 7,9)"], ["8.0", "morphine (pKa ≈ 8,0)"], ["9.9", "amphétamine (pKa ≈ 9,9)"], ["3.4", "diazépam (pKa ≈ 3,4)"]], "", function(v){ if (v) pK.set(parseFloat(v)); });
    var pK = k.slider("pKa (couple BH⁺/B)", 2, 11, 0.1, 9.0, "", function(){ drug.set(""); });
    var pL = k.slider("pH de l'estomac", 1, 3.5, 0.1, 1.5, "");
    var pR = k.slider("pH du sang", 7.0, 7.8, 0.05, 7.4, "");
    var dep = k.seg("Départ", [["oral", "Comprimé avalé (estomac)"], ["iv", "Injection (sang)"]], "oral", function(){ reset(); });
    k.button("Recommencer", function(){ reset(); }, true);
    var ro = k.readouts(["Forme neutre B dans l'estomac", "Forme neutre B dans le sang", "À l'équilibre : C(sang) / C(estomac)", "Molécules : estomac · membrane · sang"]);
    var nt = k.note("", "ok");
    var M0 = 0.445, M1 = 0.555, NP = 36, sd = 3;
    function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; }
    function side(p){ return p.x < M0 ? 0 : p.x > M1 ? 2 : 1; }
    function reset(){
      st.parts = []; sd = 3;
      for (var i = 0; i < NP; i++){
        var left = dep.value === "oral";
        st.parts.push({x:left ? 0.04 + rnd() * 0.36 : 0.60 + rnd() * 0.36, y:0.18 + rnd() * 0.72, vx:(rnd() - 0.5) * 0.1, vy:(rnd() - 0.5) * 0.1, prot:true, tm:rnd() * 0.3, a:rnd() * 6, b:rnd() * 6, wa:(rnd() - 0.5) * 2, wb:(rnd() - 0.5) * 2});
      }
    }
    reset();
    function fN(sd2){ return fNeutral(sd2 === 0 ? pL.value : pR.value, pK.value); }
    c.pointer(function(type, p){
      var W = c.W, H = c.H;
      if (type === "down"){
        var best = null, bd = 22;
        st.parts.forEach(function(q){ var d = Math.hypot(q.x * W - p.x, q.y * H - p.y); if (d < bd){ bd = d; best = q; } });
        st.grab = best;
      }
      if (type === "drag" && st.grab){
        var q = st.grab, nx = clamp(p.x / W, 0.02, 0.98), ny = clamp(p.y / H, 0.14, 0.95);
        if (q.prot){
          var from = q.x < 0.5 ? 0 : 2;
          if (from === 0 && nx > M0 - 0.02){ nx = M0 - 0.02; st.flash = 2.2; }
          if (from === 2 && nx < M1 + 0.02){ nx = M1 + 0.02; st.flash = 2.2; }
        }
        q.x = nx; q.y = ny; q.vx = 0; q.vy = 0;
      }
      if (type === "move"){ var hv = null; st.parts.forEach(function(q){ if (Math.hypot(q.x * W - p.x, q.y * H - p.y) < 16) hv = q; }); st.hover = hv; }
      if (type === "up") st.grab = null;
    });
    var lp = k.loop(function(dt){
      st.t += dt; if (st.flash > 0) st.flash -= dt;
      var asp = c.W / c.H;
      st.parts.forEach(function(q){
        q.a += q.wa * dt; q.b += q.wb * dt;
        if (q === st.grab) return;
        var sd2 = side(q);
        /* échange de protons très rapide : la forme est retirée au sort selon Henderson-Hasselbalch */
        q.tm -= dt;
        if (sd2 === 1) q.prot = false;
        else if (q.tm <= 0){ q.tm = 0.18 + rnd() * 0.2; q.prot = rnd() > fN(sd2); }
        var D = sd2 === 1 ? 0.10 : 0.22;
        q.vx += (rnd() - 0.5) * D * 1.6 * dt * 30 * 0.05; q.vy += (rnd() - 0.5) * D * 1.6 * dt * 30 * 0.05;
        q.vx *= 0.985; q.vy *= 0.985;
        var sp = Math.hypot(q.vx, q.vy), vmax = sd2 === 1 ? 0.05 : 0.12; if (sp > vmax){ q.vx *= vmax / sp; q.vy *= vmax / sp; }
        var nx = q.x + q.vx * dt, ny = q.y + q.vy * dt * asp;
        if (q.prot){
          if (q.x < M0 && nx > M0 - 0.018){ nx = M0 - 0.018; q.vx = -Math.abs(q.vx); }
          if (q.x > M1 && nx < M1 + 0.018){ nx = M1 + 0.018; q.vx = Math.abs(q.vx); }
        }
        if (nx < 0.02){ nx = 0.02; q.vx = Math.abs(q.vx); } if (nx > 0.98){ nx = 0.98; q.vx = -Math.abs(q.vx); }
        if (ny < 0.16){ ny = 0.16; q.vy = Math.abs(q.vy); } if (ny > 0.95){ ny = 0.95; q.vy = -Math.abs(q.vy); }
        q.x = nx; q.y = ny;
      });
      k.redraw();
    });
    lp.play();
    function molecule(ctx, x, y, s, q, hl){
      /* petite amine 3D : N bleu, groupe R gris (le reste du médicament), 2 ou 3 H ; un doublet libre si elle est neutre */
      var dirs = [[0, 1, 0]].concat(tetra3([0, 1, 0], [1, 0, 0], 0)), items = [], st2 = {a:q.a, b:q.b};
      function P(v, L){ return proj3(mul(v, L), st2, s, x, y); }
      if (q.prot){
        ctx.save(); ctx.strokeStyle = "rgba(60,140,220,.55)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, s * 2.3, 0, 7); ctx.stroke(); ctx.restore();
      }
      var N = P([0, 0, 0], 0);
      dirs.forEach(function(d, i){
        if (i === 0){ var pR2 = P(d, 1.05); items.push({z:pR2.z, f:function(){ ctx.strokeStyle = "#7d8a9b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(N.x, N.y); ctx.lineTo(pR2.x, pR2.y); ctx.stroke(); ball(ctx, pR2.x, pR2.y, s * 0.62, "#5b6577"); }}); return; }
        if (!q.prot && i === 3){ var lp2 = P(d, 0.75); items.push({z:lp2.z, f:function(){ ctx.save(); ctx.fillStyle = "rgba(255,220,90,.75)"; ctx.beginPath(); ctx.ellipse(lp2.x, lp2.y, s * 0.32, s * 0.2, Math.atan2(lp2.y - N.y, lp2.x - N.x), 0, 7); ctx.fill(); ctx.restore(); }}); return; }
        var pH = P(d, 0.85); items.push({z:pH.z, f:function(){ ctx.strokeStyle = "#7d8a9b"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(N.x, N.y); ctx.lineTo(pH.x, pH.y); ctx.stroke(); ball(ctx, pH.x, pH.y, s * 0.26, "#e8edf3"); }});
      });
      items.push({z:0, f:function(){ ball(ctx, N.x, N.y, s * 0.42, q.prot ? "#3c6fd8" : "#2f9e6a"); }});
      items.sort(function(a, b){ return a.z - b.z; }); items.forEach(function(it){ it.f(); });
      if (q.prot) badge(ctx, x + s * 0.9, y - s * 0.9, "+", "#c0392b", 1, 6.5);
      if (hl){ ctx.save(); ctx.strokeStyle = "#e08a1e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, s * 2.0, 0, 7); ctx.stroke(); ctx.restore(); }
    }
    var rbc = seeded(5, 21);
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, t = st.t, x0 = M0 * W, x1 = M1 * W, top = H * 0.12;
      c.clear();
      /* estomac : suc gastrique, plis de la muqueuse en arrière-plan */
      var gL = ctx.createLinearGradient(0, 0, x0, H); gL.addColorStop(0, "#fff7df"); gL.addColorStop(1, "#f6dfae"); ctx.fillStyle = gL; ctx.fillRect(0, 0, x0, H);
      ctx.save(); ctx.strokeStyle = "rgba(214,150,80,.18)"; ctx.lineWidth = 10;
      for (var f = 0; f < 4; f++){ ctx.beginPath(); for (var yy = 0; yy <= H; yy += 8){ var xx = x0 * (0.12 + f * 0.22) + 9 * Math.sin(yy * 0.03 + f + t * 0.3); if (yy === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); } ctx.stroke(); }
      ctx.restore();
      /* sang : plasma et globules rouges qui passent */
      var gR2 = ctx.createLinearGradient(x1, 0, W, H); gR2.addColorStop(0, "#fde7e4"); gR2.addColorStop(1, "#f6c6bf"); ctx.fillStyle = gR2; ctx.fillRect(x1, 0, W - x1, H);
      rbc.forEach(function(r, i){
        var rx = x1 + ((r.x * (W - x1) + t * 14 * (0.6 + r.r * 0.1)) % (W - x1 + 60)) - 30, ry = top + 20 + r.y * (H - top - 40), R = Math.min(W, H) * 0.045;
        ctx.save(); ctx.translate(rx, ry); ctx.rotate(r.r); ctx.scale(1, 0.55);
        var gg = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R); gg.addColorStop(0, "rgba(200,60,60,.20)"); gg.addColorStop(0.6, "rgba(200,40,40,.32)"); gg.addColorStop(1, "rgba(160,30,30,.10)");
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.restore();
      });
      /* bicouche lipidique */
      var mg = ctx.createLinearGradient(x0, 0, x1, 0); mg.addColorStop(0, "#f3e9c7"); mg.addColorStop(0.5, "#fff6d8"); mg.addColorStop(1, "#f3e9c7");
      ctx.fillStyle = mg; ctx.fillRect(x0, 0, x1 - x0, H);
      var hr = Math.max(4, (x1 - x0) * 0.1), step = hr * 2.15, mw = x1 - x0;
      for (var y = -step / 2 + ((t * 3) % step); y < H + step; y += step){
        [0, 1].forEach(function(sd2){
          var hx = sd2 === 0 ? x0 + hr : x1 - hr, dir = sd2 === 0 ? 1 : -1, wob = Math.sin(y * 0.07 + sd2 * 2 + t) * 1.2;
          ctx.save(); ctx.strokeStyle = "rgba(170,140,70,.7)"; ctx.lineWidth = 1.3;
          [-0.35, 0.35].forEach(function(o){ ctx.beginPath(); ctx.moveTo(hx, y + o * hr); for (var s2 = 1; s2 <= 6; s2++){ ctx.lineTo(hx + dir * s2 * (mw / 2 - hr * 1.4) / 6, y + o * hr + Math.sin(s2 * 1.4 + y + wob) * 1.6); } ctx.stroke(); });
          ctx.restore();
          ball(ctx, hx, y, hr, "#c86fa8");
        });
      }
      label(ctx, ph ? "membrane" : "bicouche lipidique", (x0 + x1) / 2, H - 12, {size:ph ? 10 : 11, col:"#7a5a16", bg:"rgba(255,250,232,.9)"});
      /* molécules */
      var s = Math.max(5.5, Math.min(W, H) * 0.017);
      st.parts.forEach(function(q){ molecule(ctx, q.x * W, q.y * H, s, q, q === st.grab || q === st.hover); });
      /* en-têtes */
      var nL = fN(0), nR = fN(2), cnt = [0, 0, 0];
      st.parts.forEach(function(q){ cnt[side(q)]++; });
      label(ctx, "ESTOMAC · pH " + S.fmt(pL.value, 1), x0 / 2, 16, {size:ph ? 11.5 : 13, col:"#7a4a00", bg:"rgba(255,255,255,.85)", weight:800});
      label(ctx, "SANG · pH " + S.fmt(pR.value, 2), x1 + (W - x1) / 2, 16, {size:ph ? 11.5 : 13, col:"#8a1c1c", bg:"rgba(255,255,255,.85)", weight:800});
      label(ctx, "neutre : " + pctTxt(nL), x0 / 2, 38, {size:ph ? 10.5 : 12, col:"#2c3a4e", bg:"rgba(255,255,255,.75)"});
      label(ctx, "neutre : " + pctTxt(nR), x1 + (W - x1) / 2, 38, {size:ph ? 10.5 : 12, col:"#2c3a4e", bg:"rgba(255,255,255,.75)"});
      label(ctx, cnt[0] + " molécules", x0 / 2, H - 14, {size:ph ? 11 : 12, col:"#2c3a4e", bg:"rgba(255,255,255,.8)"});
      label(ctx, cnt[2] + " molécules", x1 + (W - x1) / 2, H - 14, {size:ph ? 11 : 12, col:"#2c3a4e", bg:"rgba(255,255,255,.8)"});
      if (st.flash > 0) label(ctx, "BH⁺ est chargée : le cœur hydrophobe la repousse", W / 2, H * 0.5, {size:ph ? 11.5 : 13, col:"#c0392b", bg:"rgba(255,255,255,.95)", border:"#c0392b", alpha:clamp(st.flash, 0, 1)});
      if (st.hover && !st.grab){ var hq = st.hover; label(ctx, hq.prot ? "BH⁺ (protonée)" : "B (neutre)", hq.x * W, hq.y * H - s * 3, {size:11.5, col:hq.prot ? "#1d4fae" : "#1f7a4d", bg:"rgba(255,255,255,.92)"}); }
      /* légende */
      if (!ph){ label(ctx, "● BH⁺ protonée (ne passe pas)", 12, H - 38, {size:11, align:"left", col:"#1d4fae", bg:"rgba(255,255,255,.8)"}); label(ctx, "● B neutre (passe la membrane)", 12, H - 62, {size:11, align:"left", col:"#1f7a4d", bg:"rgba(255,255,255,.8)"}); }
      /* courbe de fraction neutre */
      g.clear(); var e = g.ctx, ax = plotFrame(g, {x0:0, x1:14, y0:0, y1:100, l:38, b:26, t:20, r:12}), pk = pK.value;
      e.save(); e.font = "600 10.5px " + FONT; e.fillStyle = "#5f6b7a"; e.textAlign = "center"; e.textBaseline = "top";
      for (var v = 0; v <= 14; v += 2){ e.strokeStyle = "#edf0f4"; e.beginPath(); e.moveTo(ax.X(v), ax.T); e.lineTo(ax.X(v), ax.B); e.stroke(); e.fillText(String(v), ax.X(v), ax.B + 4); }
      e.textAlign = "right"; e.textBaseline = "middle"; [0, 50, 100].forEach(function(v2){ e.fillText(v2 + " %", ax.L - 4, ax.Y(v2)); });
      e.strokeStyle = "#2f9e6a"; e.lineWidth = 2.4; e.beginPath();
      for (var j = 0; j <= 140; j++){ var x = j / 10, yv = 100 * fNeutral(x, pk); if (j === 0) e.moveTo(ax.X(x), ax.Y(yv)); else e.lineTo(ax.X(x), ax.Y(yv)); }
      e.stroke(); e.setLineDash([4, 4]); e.strokeStyle = "#7a5aa6"; e.lineWidth = 1.2; e.beginPath(); e.moveTo(ax.X(pk), ax.T); e.lineTo(ax.X(pk), ax.B); e.stroke(); e.restore();
      label(e, "pKa = " + S.fmt(pk, 1), ax.X(pk) + (pk > 11 ? -6 : 6), ax.T + 8, {size:11, align:pk > 11 ? "right" : "left", col:"#7a5aa6"});
      label(e, "% de forme neutre B", ax.L, 9, {size:11.5, align:"left", col:"#2c3a4e"});
      label(e, "pH", ax.R, ax.B + 15, {size:11, align:"right", col:"#5f6b7a"});
      S.draw.dot(g, ax.X(pL.value), ax.Y(100 * nL), 6, "#d08a00"); S.draw.dot(g, ax.X(pR.value), ax.Y(100 * nR), 6, "#c0392b");
      label(e, "estomac", ax.X(pL.value) + 8, ax.Y(100 * nL) - 12, {size:11, align:"left", col:"#a36a00"});
      label(e, "sang", ax.X(pR.value) + (pk < 8 ? -8 : 8), ax.Y(100 * nR) - 12, {size:11, align:pk < 8 ? "right" : "left", col:"#c0392b"});
      /* valeurs */
      var ratio = (1 + Math.pow(10, pk - pR.value)) / (1 + Math.pow(10, pk - pL.value));
      ro.set(0, pctTxt(nL)); ro.set(1, pctTxt(nR)); ro.set(2, sciTxt(ratio)); ro.set(3, cnt[0] + " · " + cnt[1] + " · " + cnt[2]);
      var msg;
      if (nL < 1e-3) msg = "Dans l'estomac, pH " + S.fmt(pL.value, 1) + " est très inférieur au pKa " + S.fmt(pk, 1) + " : l'amine y est protonée à plus de 99,9 %. Elle ne traverse presque pas la paroi de l'estomac ; elle sera absorbée dans l'intestin.";
      else if (nL < 0.1) msg = "Dans l'estomac, une petite fraction est neutre (" + pctTxt(nL) + ") : le passage existe mais reste lent.";
      else msg = "Base très faible (pKa " + S.fmt(pk, 1) + ") : même dans l'estomac, une bonne partie est neutre (" + pctTxt(nL) + "), elle traverse.";
      msg += " À l'équilibre, la forme neutre a la même concentration des deux côtés ; le total est " + (ratio < 1 ? "plus grand dans l'estomac (piégeage ionique : la molécule y entre neutre et s'y fait protoner)." : "plus grand dans le sang.");
      nt.set(msg + " <i>Modèle : échange de H⁺ instantané, membrane idéale (seule B passe) ; le nombre de molécules est symbolique.</i>", nL < 1e-3 ? "warn" : "ok");
    });
  }
});

/* ====================================================================== */
/* 4. Le glucose se referme : Fischer → Haworth → chaise                   */
/* ====================================================================== */
/* indices : 0-5 C1..C6 ; 6 O1, 7 O2, 8 O3, 9 O4, 10 O5, 11 O6 ; 12 H1, 13 H2, 14 H3, 15 H4, 16 H5, 17 H6a, 18 H6b ;
   19 H « mobile » (sur O5 en chaîne ouverte, sur O1 dans le cycle), 20 HO2, 21 HO3, 22 HO4, 23 HO6 */
var GLC = (function(){
  var Y = [0, 1, 0], Rr = 1.47, ANG = {10:-60, 0:0, 1:60, 2:120, 3:180, 4:240}, UP = {0:-1, 1:1, 2:-1, 3:1, 4:-1, 10:1};
  function ringPos(n, h){ var a = ANG[n] * DEG; return [Rr * Math.cos(a), UP[n] * h, Rr * Math.sin(a)]; }
  function upDown(c, nb1, nb2){ var pp = sp3pair(sub(nb1, c), sub(nb2, c)); return pp[0][1] >= pp[1][1] ? pp : [pp[1], pp[0]]; }
  function addOH(P, par, o, cIdx, hIdx, pref){ P[hIdx] = add(P[o], mul(ohDir(P[o], P[cIdx], pref), 0.97)); par[hIdx] = o; }
  function outward(p){ return nrm([p[0], 0.0001, p[2]]); }
  /* forme cyclique (open = 0) ou chaîne repliée (open = 1, cycle plan, C1 écarté et sp²) */
  function ring(h, beta, open){
    var P = [], par = [], i;
    [1, 2, 3, 4].forEach(function(n){ P[n] = ringPos(n, h); par[n] = -1; });
    P[10] = ringPos(10, h); par[10] = 4;
    var C1r = ringPos(0, h);
    if (open){
      var v = sub(C1r, P[1]), o1 = add(P[1], rotAx(v, Y, -40 * DEG)), o2 = add(P[1], rotAx(v, Y, 40 * DEG));
      P[0] = len(sub(o1, P[10])) > len(sub(o2, P[10])) ? o1 : o2;
    } else P[0] = C1r;
    par[0] = -1;
    /* C1 */
    if (open){
      var a = nrm(sub(P[10], P[0])), u2 = nrm(sub(P[1], P[0])), u2p = nrm(sub(u2, mul(a, dot(a, u2)))), cA = rotAx(u2p, a, 120 * DEG), cB = rotAx(u2p, a, -120 * DEG);
      var upC = cA[1] >= cB[1] ? cA : cB, dnC = upC === cA ? cB : cA;
      P[6] = add(P[0], mul(beta ? upC : dnC, 1.22)); P[12] = add(P[0], mul(beta ? dnC : upC, 1.10));
    } else {
      var ud = upDown(P[0], P[10], P[1]);
      P[6] = add(P[0], mul(beta ? ud[0] : ud[1], 1.41)); P[12] = add(P[0], mul(beta ? ud[1] : ud[0], 1.10));
    }
    par[6] = 0; par[12] = 0;
    /* C2 : OH en bas ; C3 : OH en haut ; C4 : OH en bas ; C5 : CH2OH en haut */
    var u;
    u = upDown(P[1], P[0], P[2]); P[7] = add(P[1], mul(u[1], 1.43)); P[13] = add(P[1], mul(u[0], 1.10));
    u = upDown(P[2], P[1], P[3]); P[8] = add(P[2], mul(u[0], 1.43)); P[14] = add(P[2], mul(u[1], 1.10));
    u = upDown(P[3], P[2], P[4]); P[9] = add(P[3], mul(u[1], 1.43)); P[15] = add(P[3], mul(u[0], 1.10));
    u = upDown(P[4], P[3], P[10]); P[5] = add(P[4], mul(u[0], 1.52)); P[16] = add(P[4], mul(u[1], 1.10));
    par[7] = 1; par[13] = 1; par[8] = 2; par[14] = 2; par[9] = 3; par[15] = 3; par[5] = 4; par[16] = 4;
    var t6 = tetra3(nrm(sub(P[4], P[5])), outward(P[4]), 0);
    P[11] = add(P[5], mul(t6[0], 1.43)); P[17] = add(P[5], mul(t6[1], 1.09)); P[18] = add(P[5], mul(t6[2], 1.09)); par[11] = 5; par[17] = 5; par[18] = 5;
    addOH(P, par, 7, 1, 20, outward(P[7])); addOH(P, par, 8, 2, 21, outward(P[8])); addOH(P, par, 9, 3, 22, outward(P[9])); addOH(P, par, 11, 5, 23, outward(P[11]));
    if (open) addOH(P, par, 10, 4, 19, nrm(sub(P[10], P[0])));
    else addOH(P, par, 6, 0, 19, outward(P[6]));
    return {P:P, par:par};
  }
  /* projection de Fischer : chaîne verticale qui s'éloigne, liaisons horizontales vers toi */
  function fischer(){
    var P = [], par = [], i, Rt = nrm([0.86, 0, 0.5]), Lt = nrm([-0.86, 0, 0.5]);
    for (i = 0; i < 6; i++){ P[i] = [0, 3.2 - 1.28 * i, -0.16 * Math.pow(i - 2.5, 2)]; par[i] = -1; }
    par[5] = 4; par[10] = 4;
    P[6] = add(P[0], mul(nrm([0.75, 0.55, 0.35]), 1.22)); P[12] = add(P[0], mul(nrm([-0.75, 0.55, 0.35]), 1.10)); par[6] = 0; par[12] = 0;
    P[7] = add(P[1], mul(Rt, 1.43)); P[13] = add(P[1], mul(Lt, 1.10));
    P[8] = add(P[2], mul(Lt, 1.43)); P[14] = add(P[2], mul(Rt, 1.10));
    P[9] = add(P[3], mul(Rt, 1.43)); P[15] = add(P[3], mul(Lt, 1.10));
    P[10] = add(P[4], mul(Rt, 1.43)); P[16] = add(P[4], mul(Lt, 1.10));
    par[7] = 1; par[13] = 1; par[8] = 2; par[14] = 2; par[9] = 3; par[15] = 3; par[16] = 4;
    P[11] = add(P[5], mul(nrm([0.75, -0.55, 0.35]), 1.43)); P[17] = add(P[5], mul(nrm([-0.75, -0.55, 0.35]), 1.09)); P[18] = add(P[5], mul(nrm([0, -0.35, -1]), 1.09)); par[11] = 5; par[17] = 5; par[18] = 5;
    addOH(P, par, 7, 1, 20, [1, 0.2, 1]); addOH(P, par, 8, 2, 21, [-1, 0.2, 1]); addOH(P, par, 9, 3, 22, [1, 0.2, 1]); addOH(P, par, 10, 4, 19, [1, 0.2, 1]); addOH(P, par, 11, 5, 23, [1, -0.4, 1]);
    return {P:P, par:par};
  }
  var ORDER = [0, 1, 2, 3, 4, 5, 10, 6, 12, 7, 13, 8, 14, 9, 15, 16, 11, 17, 18, 20, 21, 22, 23, 19];
  function mix(A, B, t){
    var P = [];
    ORDER.forEach(function(n){
      var pa = A.par[n];
      if (pa >= 0 && pa === B.par[n]){ var a = sub(A.P[n], A.P[pa]), b = sub(B.P[n], B.P[pa]); P[n] = add(P[pa], mul(slerpD(a, b, t), lerp(len(a), len(b), t))); }
      else P[n] = lerp3(A.P[n], B.P[n], t);
    });
    return P;
  }
  var FI = fischer(), OPEN = [ring(0, false, true), ring(0, true, true)], FLAT = [ring(0, false, false), ring(0, true, false)];
  function at(s, beta){
    var bi = beta ? 1 : 0;
    if (s <= 1) return mix(FI, OPEN[bi], ease(s));
    if (s <= 2) return mix(OPEN[bi], FLAT[bi], ease(s - 1));
    return ring(0.25 * ease(s - 2), beta, false).P;
  }
  return {at:at, fischer:FI, ring:ring};
})();
var GLC_EL = ["C", "C", "C", "C", "C", "C", "O", "O", "O", "O", "O", "O", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"];
var GLC_B = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 10], [1, 7], [2, 8], [3, 9], [5, 11], [0, 12], [1, 13], [2, 14], [3, 15], [4, 16], [5, 17], [5, 18], [7, 20], [8, 21], [9, 22], [11, 23]];
var ROT_A = 112.2, ROT_B = 18.7, ROT_EQ = 52.7, XA_EQ = (ROT_EQ - ROT_B) / (ROT_A - ROT_B);
SFA.sim({
  id:"org-glucose-cyclisation-3d", ch:"L16", tag:"Glucides",
  titre:"Le glucose se referme : de Fischer à Haworth puis à la chaise",
  resume:"Le D-glucose passe de la projection de Fischer à la chaîne repliée ; l'OH de C5 attaque le C=O de C1 et le cycle se ferme en anomère α ou β. Termine en chaise 3D et suis la mutarotation jusqu'à 36 % α et 64 % β.",
  but:"L'animation part de la projection de Fischer du D-glucose (liaisons horizontales vers toi), replie la chaîne, puis l'oxygène de C5 attaque le carbone C1 du groupe aldéhyde (flèches courbes) : le cycle à six atomes (pyranose) se forme, vu en Haworth, puis il prend sa forme réelle en chaise. Choisis l'anomère (α : OH de C1 en bas ; β : en haut), ou « au hasard » pour voir les fermetures se répartir. Glisse sur la molécule pour la tourner. En dessous : la mutarotation d'une solution fraîchement préparée, lue au polarimètre.",
  aRetenir:"En solution, le D-glucose est presque entièrement cyclique : l'OH de C5 s'additionne sur le C=O de C1 et forme un hémiacétal cyclique à six atomes (pyranose). C1 devient un nouveau centre stéréogène, le carbone anomère : α si son OH est en bas en Haworth (du côté opposé au CH₂OH), β s'il est en haut (du même côté). Règle de passage : un OH à droite en Fischer est en bas en Haworth. En chaise ⁴C₁, le β-D-glucose a tous ses substituants en position équatoriale : c'est pourquoi il domine. La forme ouverte relie α et β : c'est la mutarotation, jusqu'à l'équilibre ≈ 36 % α et 64 % β ([α]D passe de +112° ou +19° à +52,7°).",
  piege:"α et β ne sont pas des énantiomères : ils ne diffèrent que par la configuration de C1, ce sont des diastéréoisomères (des anomères). Le cycle ne se forme pas avec l'OH de C4 ou de C6 : avec C5, il est à six atomes, le moins tendu. Et la proportion d'équilibre n'est pas 50/50 : β est favorisé parce que son OH anomère est équatorial.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? 1.12 : 0.74; r0(); }; c.resize();
    var g = k.canvas(176);
    var st = {a:0, b:0, da:0, db:0, spin:true, s:0, play:true, hold:2.0, t:0, ts:0, beta:true, tally:{a:0, b:0}, mt:0, x0:1, sc:null};
    c.pointer(function(type, p){
      if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
      if (type === "drag" && st.lx != null){ st.da += (p.x - st.lx) * 0.012; st.db = clamp(st.db + (p.y - st.ly) * 0.012, -1.4, 1.4); st.lx = p.x; st.ly = p.y; st.spin = false; spinT.set(false); }
      if (type === "up"){ st.lx = null; st.drag = false; }
    });
    var anS = k.seg("Anomère formé", [["b", "β"], ["a", "α"], ["r", "au hasard"]], "b", function(v){ if (v !== "r") st.beta = v === "b"; st.tally = {a:0, b:0}; });
    var sS = k.slider("Étape", 0, 3, 0.01, 0, "", function(v){ st.s = v; st.play = false; });
    k.button("Lecture / pause", function(){ if (st.s >= 2.999) st.s = 0; st.play = !st.play; st.hold = 0; }, true);
    var muS = k.seg("Mutarotation : on dissout des cristaux de", [["a", "α pur"], ["b", "β pur"]], "a", function(v){ st.x0 = v === "a" ? 1 : 0; st.mt = 0; });
    var numT = k.toggle("Numéros des carbones", true);
    var spinT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Représentation", "Carbone C1", "Anomère", "Équilibre dans l'eau", "[α]D de la solution", "K = [β]/[α] · ΔG° (25 °C)"]);
    var nt = k.note("", "ok");
    function pickAnomer(){ if (anS.value === "r") st.beta = Math.random() > XA_EQ; }
    var lp = k.loop(function(dt){
      st.t += dt; st.mt = Math.min(6, st.mt + dt * 0.45);
      if (st.play){
        if (st.hold > 0) st.hold -= dt;
        else if (st.s >= 3){ st.s = 0; st.hold = 1.8; pickAnomer(); }
        else {
          var nx = st.s + dt * 0.32, fl = Math.floor(st.s);
          if (Math.floor(nx) > fl){ nx = fl + 1; st.hold = nx >= 3 ? 3.0 : 1.6; if (nx === 2){ if (st.beta) st.tally.b++; else st.tally.a++; } }
          st.s = Math.min(3, nx);
        }
        sS.set(st.s);
      }
      if (st.spin && !st.drag) st.ts += dt;
      k.redraw();
    });
    lp.play();
    var solv = seeded(12, 9);
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, s = st.s, t = st.t, beta = st.beta;
      c.clear(); bgScene(ctx, W, H, "#ffffff", "#e7ecf4"); solvent(ctx, W, H, solv, t, 0.09);
      var P = GLC.at(s, beta);
      /* vue : de face pour Fischer, puis d'en haut et de face pour Haworth, plus à plat pour la chaise */
      var e1 = ease(s), e3 = ease(s - 2), spinA = st.spin ? 0.32 * Math.sin(st.ts * 0.4) * e1 : 0;
      st.a = lerp(0, -0.3, e1) + lerp(0, 0.05, e3) + st.da + spinA; st.b = lerp(0, 0.55, e1) + lerp(0, -0.22, e3) + st.db;
      var atoms = P.map(function(p, n){ return At(GLC_EL[n], p, {lab:GLC_EL[n] === "O" ? "O" : ""}); });
      if (numT.value) for (var i = 0; i < 6; i++) atoms[i].lab = String(i + 1);
      atoms[10].col = "#c42d24";
      var bonds = GLC_B.map(function(b){ return {a:b[0], b:b[1], o:1}; });
      var cl = ease((s - 1) / 1), dbl = s < 1.5;
      bonds.push({a:0, b:6, o:dbl ? 2 : 1});
      bonds.push({a:0, b:10, o:1, alpha:clamp((s - 1.05) / 0.6, 0, 1), dash:s < 1.95, col:"#c42d24"});
      bonds.push({a:10, b:19, o:1, alpha:clamp(1 - (s - 1.3) / 0.4, 0, 1), dash:s > 1.3});
      bonds.push({a:6, b:19, o:1, alpha:clamp((s - 1.5) / 0.4, 0, 1), dash:s < 1.9});
      /* centrage lissé */
      var ctr = [0, 0, 0], nh = 0; P.forEach(function(p, n){ if (GLC_EL[n] !== "H"){ ctr = add(ctr, p); nh++; } }); ctr = mul(ctr, 1 / nh);
      var pc = rot3(ctr, st.a, st.b), scT = Math.min(W / (lerp(7.2, 8.6, e1)), H / lerp(9.6, 7.0, e1));
      st.sc = st.sc ? st.sc + (scT - st.sc) * 0.15 : scT;
      var sc = st.sc, V = {st:st, sc:sc, cx:W * 0.5 - pc[0] * sc, cy:H * 0.53 + pc[1] * sc};
      /* plan moyen du cycle (Haworth et chaise) */
      var extra = [];
      if (s > 1.6){
        var ringIdx = [0, 1, 2, 3, 4, 10], rp = ringIdx.map(function(n){ return proj3(P[n], st, sc, V.cx, V.cy); }), zc = rp.reduce(function(a, p){ return a + p.z; }, 0) / 6, al = clamp((s - 1.6) / 0.4, 0, 1);
        extra.push({z:zc - 0.3, f:function(){ ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = "rgba(42,111,219,.10)"; ctx.strokeStyle = "rgba(42,111,219,.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); rp.forEach(function(p, q){ if (q === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }});
      }
      var pr = drawScene(c, V, atoms, bonds, extra);
      /* flèches courbes de la cyclisation */
      var aA = clamp(1 - Math.abs(s - 1.15) / 0.4, 0, 1);
      if (aA > 0){
        var pO5 = pr[10], pC1 = pr[0], pO1 = pr[6], t1 = trim(pO5, pC1, pO5.r + 3, pC1.r + 5);
        curly(ctx, t1[0], t1[1], t1[2], t1[3], -34, "#c0392b", aA);
        var mx = (pC1.x + pO1.x) / 2, my = (pC1.y + pO1.y) / 2, t2 = trim({x:mx, y:my}, pO1, 2, pO1.r + 4);
        curly(ctx, t2[0], t2[1], t2[2], t2[3], 26, "#2a6fdb", aA);
      }
      /* repère haut / bas et étiquette de l'OH anomère */
      if (s > 1.7){
        var pO1b = pr[6], lab2 = s < 2.5 ? (beta ? "OH en haut : β" : "OH en bas : α") : (beta ? "OH équatorial : β" : "OH axial : α");
        var rgt = pO1b.x + 150 < W;
        label(ctx, lab2, pO1b.x + (rgt ? 14 : -14), pO1b.y + (beta ? -18 : 18), {size:ph ? 11.5 : 12.5, align:rgt ? "left" : "right", col:beta ? "#1d4fae" : "#a35a00", bg:"rgba(255,255,255,.9)", alpha:clamp((s - 1.7) / 0.3, 0, 1)});
        var p6 = pr[5]; label(ctx, "CH₂OH", p6.x, p6.y - p6.r - 13, {size:11, col:"#2c3a4e", bg:"rgba(255,255,255,.8)"});
      }
      if (s < 0.4){
        var pa1 = pr[0]; label(ctx, "CHO", pa1.x, pa1.y - pa1.r - 26, {size:11.5, col:"#2c3a4e", bg:"rgba(255,255,255,.8)"});
        var pa6 = pr[5]; label(ctx, "CH₂OH", pa6.x, pa6.y + pa6.r + 30, {size:11.5, col:"#2c3a4e", bg:"rgba(255,255,255,.8)"});
        label(ctx, "OH à droite en C5 : série D", ph ? W - 8 : pr[10].x + pr[10].r + 22, pr[10].y + (ph ? pr[10].r + 16 : 14), {size:11, align:ph ? "right" : "left", col:"#c42d24", bg:"rgba(255,255,255,.85)", alpha:1 - s / 0.4});
      }
      var stg = s < 0.5 ? 0 : s < 1.5 ? 1 : s < 2.5 ? 2 : 3;
      var TT = ["Projection de Fischer du D-glucose (chaîne ouverte)", "La chaîne se replie : O de C5 face au C=O de C1", "Haworth : hémiacétal cyclique (pyranose)", "Chaise ⁴C₁ : la vraie forme du cycle"];
      if (s > 0.9 && s < 1.5) TT[1] = "L'oxygène de C5 attaque le carbone C1 (C=O)";
      label(ctx, TT[stg], 10, 16, {size:ph ? 11.5 : 13.5, align:"left", col:"#13233a", bg:"rgba(255,255,255,.85)"});
      if (anS.value === "r" && st.tally.a + st.tally.b > 0) label(ctx, "fermetures : α " + st.tally.a + " · β " + st.tally.b, W - 10, H - 14, {size:11.5, align:"right", col:"#2c3a4e", bg:"rgba(255,255,255,.85)"});
      else if (!ph) label(ctx, "glisse pour tourner", W - 10, H - 14, {size:11, align:"right", col:"#8a95a3", weight:600});
      /* mutarotation : polarimètre + courbes */
      g.clear(); var e = g.ctx, GW = g.W, GH = g.H, dw = Math.min(150, GW * 0.3);
      e.fillStyle = "#fbfcfe"; e.fillRect(0, 0, GW, GH);
      var xa = XA_EQ + (st.x0 - XA_EQ) * Math.exp(-st.mt), rot = xa * ROT_A + (1 - xa) * ROT_B;
      var cx = dw / 2 + 4, cy = GH * 0.56, R = Math.min(dw * 0.42, GH * 0.38);
      var gd = e.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 2, cx, cy, R * 1.1); gd.addColorStop(0, "#ffffff"); gd.addColorStop(1, "#d5dde8");
      e.fillStyle = gd; e.beginPath(); e.arc(cx, cy, R + 6, 0, 7); e.fill(); e.strokeStyle = "#8a95a3"; e.lineWidth = 2; e.stroke();
      e.save(); e.strokeStyle = "#5f6b7a"; e.lineWidth = 1;
      for (var dg = 0; dg <= 120; dg += 10){ var an = (-90 + dg * 1.5) * DEG, l1 = dg % 30 === 0 ? 9 : 5; e.beginPath(); e.moveTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); e.lineTo(cx + Math.cos(an) * (R - l1), cy + Math.sin(an) * (R - l1)); e.stroke(); }
      e.restore();
      [[0, "0"], [60, "60"], [120, "120"]].forEach(function(q){ var an = (-90 + q[0] * 1.5) * DEG; label(e, q[1], cx + Math.cos(an) * (R - 18), cy + Math.sin(an) * (R - 18), {size:9.5, col:"#5f6b7a", weight:600}); });
      var anN = (-90 + rot * 1.5) * DEG;
      e.save(); e.strokeStyle = "#c0392b"; e.lineWidth = 3; e.lineCap = "round"; e.beginPath(); e.moveTo(cx, cy); e.lineTo(cx + Math.cos(anN) * (R - 4), cy + Math.sin(anN) * (R - 4)); e.stroke(); e.restore();
      ball(e, cx, cy, 5, "#2c3a4e");
      label(e, "[α]D = +" + F2(rot, 1) + "°", cx, 12, {size:11.5, col:"#c0392b", weight:800});
      var ax = {L:dw + 46, R:GW - 12, T:24, B:GH - 24};
      ax.X = function(x){ return ax.L + x / 6 * (ax.R - ax.L); }; ax.Y = function(y){ return ax.B - y / 100 * (ax.B - ax.T); };
      e.save(); e.strokeStyle = "#8a95a3"; e.lineWidth = 1.2; e.beginPath(); e.moveTo(ax.L, ax.T); e.lineTo(ax.L, ax.B); e.lineTo(ax.R, ax.B); e.stroke();
      e.font = "600 10.5px " + FONT; e.fillStyle = "#5f6b7a"; e.textAlign = "right"; e.textBaseline = "middle";
      [0, 36, 64, 100].forEach(function(v){ e.fillText(v + " %", ax.L - 4, ax.Y(v)); e.strokeStyle = "#edf0f4"; e.beginPath(); e.moveTo(ax.L + 1, ax.Y(v)); e.lineTo(ax.R, ax.Y(v)); e.stroke(); });
      [["#a35a00", function(x){ return 100 * (XA_EQ + (st.x0 - XA_EQ) * Math.exp(-x)); }], ["#2a6fdb", function(x){ return 100 * (1 - XA_EQ - (st.x0 - XA_EQ) * Math.exp(-x)); }]].forEach(function(cv){
        e.strokeStyle = cv[0]; e.lineWidth = 2.4; e.beginPath();
        for (var j = 0; j <= 60; j++){ var x = j / 60 * st.mt; if (j === 0) e.moveTo(ax.X(x), ax.Y(cv[1](x))); else e.lineTo(ax.X(x), ax.Y(cv[1](x))); }
        e.lineTo(ax.X(st.mt), ax.Y(cv[1](st.mt))); e.stroke();
      });
      e.restore();
      S.draw.dot(g, ax.X(st.mt), ax.Y(100 * xa), 5, "#a35a00"); S.draw.dot(g, ax.X(st.mt), ax.Y(100 * (1 - xa)), 5, "#2a6fdb");
      label(e, "α : " + F2(100 * xa, 0) + " %", ax.R - 4, ax.T - 10, {size:11.5, align:"right", col:"#a35a00", weight:800});
      label(e, "β : " + F2(100 * (1 - xa), 0) + " %", ax.R - (ph ? 70 : 90), ax.T - 10, {size:11.5, align:"right", col:"#2a6fdb", weight:800});
      label(e, ph ? "mutarotation" : "Mutarotation dans l'eau", ax.L + 2, ax.T - 10, {size:11.5, align:"left", col:"#2c3a4e"});
      label(e, "temps (échelle relative)", ax.R, ax.B + 14, {size:10.5, align:"right", col:"#5f6b7a", weight:600});
      /* valeurs */
      var K = (1 - XA_EQ) / XA_EQ, dG = -8.314 * 298.15 * Math.log(K) / 1000;
      ro.set(0, ["Fischer (chaîne ouverte)", "chaîne repliée", "Haworth (cycle)", "chaise ⁴C₁ (3D)"][stg]);
      ro.set(1, s < 1.5 ? "aldéhyde (sp²)" : "hémiacétal (sp³)");
      ro.set(2, s < 1.5 ? "pas encore (cycle ouvert)" : beta ? "β (OH de C1 en haut)" : "α (OH de C1 en bas)");
      ro.set(3, F2(100 * XA_EQ, 0) + " % α · " + F2(100 * (1 - XA_EQ), 0) + " % β");
      ro.set(4, "+" + F2(rot, 1) + "°");
      ro.set(5, F2(K, 2) + " · " + F2(dG, 1).replace("-", "−") + " kJ/mol");
      var msg = ["Fischer : les liaisons horizontales viennent vers toi. Les OH de C2, C4 et C5 sont à droite, celui de C3 à gauche : c'est le D-glucose. Un OH à droite se retrouve en bas en Haworth.",
        "Une rotation autour de C4–C5 amène l'oxygène de C5 en face du carbone C1. Il porte deux doublets non liants : c'est le nucléophile ; le carbone du C=O, δ+, est l'électrophile.",
        "L'addition de l'OH sur le C=O donne un hémiacétal cyclique à 6 atomes (5 C et 1 O). Le carbone C1, devenu sp³, est le carbone anomère ; " + (beta ? "son OH est en haut, du même côté que CH₂OH : anomère β." : "son OH est en bas, à l'opposé de CH₂OH : anomère α."),
        "Dans la chaise ⁴C₁ du " + (beta ? "β-D-glucose, tous les OH et le CH₂OH sont équatoriaux : c'est la forme la plus stable." : "α-D-glucose, seul l'OH de C1 est axial : un peu moins stable que β.")][stg];
      var mu = "Mutarotation : α ⇌ chaîne ouverte (moins de 1 %) ⇌ β ; à l'équilibre, [α]D = " + F2(XA_EQ, 3) + " × 112,2° + " + F2(1 - XA_EQ, 3) + " × 18,7° = +52,7°.";
      nt.set(msg + " " + mu + " <i>Géométrie idéalisée ; la flèche de transfert du H⁺ (catalysé par l'eau) n'est pas détaillée.</i>", "ok");
    });
  }
});
})();
