/* Chimie BA1 · chimie organique (L16, c09, L18) — lot p1-orga1 : simulations SFA originales, 3D dessinée à la main */
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
function angle3(a, b, c){ var u = nrm(sub(a, b)), w = nrm(sub(c, b)); return Math.acos(clamp(dot(u, w), -1, 1)) / DEG; }

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
function rot3(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}
/* caméra : rotation (a autour de y, b autour de x), perspective douce */
function cam(st, sc, cx, cy, persp){
  var k = persp == null ? 0.045 : persp;
  return {sc:sc, cx:cx, cy:cy, P:function(p){ var r = rot3(p, st.a, st.b), s = 1 / (1 - r[2] * k); return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s}; }};
}
function dragView(c, st, hit){
  c.pointer(function(type, p){
    if (type === "down"){ if (hit && hit(p)) { st.lx = null; return; } st.lx = p.x; st.ly = p.y; st.drag = true; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = clamp(st.b + (p.y - st.ly) * 0.012, st.bmin == null ? -1.45 : st.bmin, st.bmax == null ? 1.45 : st.bmax); st.lx = p.x; st.ly = p.y; if (st.onview) st.onview(); }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
}
function txt(ctx, s, x, y, size, col, align, weight){
  ctx.save(); ctx.font = (weight || 800) + " " + size + "px " + FONT; ctx.fillStyle = col || "#13233a";
  ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); ctx.restore();
}
function onBall(ctx, s, x, y, size){
  ctx.save(); ctx.font = "800 " + Math.round(size) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(s, x, y); ctx.fillStyle = "#fff"; ctx.fillText(s, x, y); ctx.restore();
}
function fitFont(ctx, s, maxW, size, weight){ var z = size; ctx.font = (weight || 800) + " " + z + "px " + FONT; while (z > 10 && ctx.measureText(s).width > maxW){ z -= 1; ctx.font = (weight || 800) + " " + z + "px " + FONT; } return z; }
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function wrapLines(ctx, s, maxW){
  var words = String(s).split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
/* bandeau d'équation en bas de la scène : titre + sous-titre (sur deux lignes si nécessaire) */
function banner(ctx, W, y, h, main, sub2, col){
  ctx.save(); ctx.fillStyle = "rgba(255,255,255,.93)"; ctx.strokeStyle = "#d9e0ea"; ctx.lineWidth = 1; rr(ctx, 10, y, W - 20, h, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col || "#2a6fdb"; ctx.fillRect(10, y + 10, 4, h - 20);
  ctx.fillStyle = "#13233a"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var ph = W < 480, mz = fitFont(ctx, main, W - 50, ph ? 16 : 20, 800);
  if (!sub2){ ctx.fillText(main, W / 2, y + h / 2); ctx.restore(); return; }
  ctx.font = "700 " + (ph ? 11 : 12.5) + "px " + FONT;
  var L = wrapLines(ctx, sub2, W - 46).slice(0, 2), lh = ph ? 13 : 15, top = y + h / 2 - (mz + 4 + L.length * lh) / 2;
  ctx.font = "800 " + mz + "px " + FONT; ctx.fillText(main, W / 2, top + mz / 2);
  ctx.font = "700 " + (ph ? 11 : 12.5) + "px " + FONT; ctx.fillStyle = "#5f6b7a";
  L.forEach(function(l, i){ ctx.fillText(l, W / 2, top + mz + 4 + lh * (i + 0.5)); });
  ctx.restore();
}
/* liaison entre deux points projetés : o = ordre (1, 2, 3), mode "dash" = liaison qui se forme ou se rompt */
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
/* électron célibataire (radical) */
function radDot(ctx, x, y, r){
  ctx.save(); var g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2); g.addColorStop(0, "rgba(255,214,64,.95)"); g.addColorStop(1, "rgba(255,214,64,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 7); ctx.fill();
  ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
/* flèche courbe : demi-flèche (hameçon, 1 électron) ou flèche pleine (doublet) ; bend = courbure en px (signe = côté) */
function curlyArrow(ctx, x1, y1, x2, y2, bend, col, half, w, prog){
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
  var cx = mx - dy / l * bend, cy = my + dx / l * bend, pr = prog == null ? 1 : prog;
  if (pr <= 0.01) return;
  function Q(t){ var u = 1 - t; return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]; }
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 2.4; ctx.lineCap = "round";
  ctx.beginPath(); var n = 28, i, q;
  for (i = 0; i <= n; i++){ q = Q(i / n * pr); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
  ctx.stroke();
  var e = Q(pr), e0 = Q(Math.max(0, pr - 0.06)), ang = Math.atan2(e[1] - e0[1], e[0] - e0[0]), hl = 11;
  ctx.beginPath(); ctx.moveTo(e[0], e[1]);
  ctx.lineTo(e[0] - hl * Math.cos(ang - 0.42), e[1] - hl * Math.sin(ang - 0.42));
  if (half) ctx.lineTo(e[0] - hl * 0.7 * Math.cos(ang), e[1] - hl * 0.7 * Math.sin(ang));
  else ctx.lineTo(e[0] - hl * Math.cos(ang + 0.42), e[1] - hl * Math.sin(ang + 0.42));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
/* fond de « paillasse » doux et ombre au sol */
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
/* rendu d'une liste d'atomes et de liaisons (tri en profondeur) ; extra : objets {z, f} supplémentaires */
function renderMol(ctx, C, atoms, bonds, extra, o){
  o = o || {};
  var pr = atoms.map(function(a){ return C.P(a.p); }), items = (extra || []).slice();
  function fa(a){ var v = a.al == null ? 1 : a.al; if (o.fadeR) v *= clamp(o.fadeR + 0.8 - len(a.p), 0, 0.8) / 0.8; return v; }
  bonds.forEach(function(b){
    var p = pr[b.a], q = pr[b.b]; if (!p || !q) return;
    var al = Math.min(fa(atoms[b.a]), fa(atoms[b.b])) * (b.al == null ? 1 : b.al);
    if (al <= 0.02) return;
    items.push({z:(p.z + q.z) / 2 - 0.01, f:function(){ bondLine(ctx, p, q, Math.max(2.2, C.sc * 0.1), b.col || "#8693a3", b.o || 1, b.dash, al); }});
  });
  atoms.forEach(function(a, i){
    var al = a.al == null ? 1 : a.al; if (o.fadeR) al *= clamp(o.fadeR + 0.8 - len(a.p), 0, 0.8) / 0.8; if (al <= 0.02) return;
    var p = pr[i], r = Math.max(a.el === "H" ? 4 : 6, (a.r || RAD[a.el]) * C.sc * 0.82 * p.s);
    items.push({z:p.z, f:function(){
      if (a.glow){ var g = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 2.4); g.addColorStop(0, rgba(a.glow, 0.45 * al)); g.addColorStop(1, rgba(a.glow, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.4, 0, 7); ctx.fill(); }
      ball(ctx, p.x, p.y, r, a.col || COL[a.el], al);
      if (a.lab && r > 8) { ctx.save(); ctx.globalAlpha = al; onBall(ctx, a.lab, p.x, p.y, Math.max(9, r * 0.8)); ctx.restore(); }
      if (a.rad){
        var dp = a.radDir ? C.P(add(a.p, mul(a.radDir, (a.r || RAD[a.el]) + 0.35))) : {x:p.x + r * 0.85, y:p.y - r * 0.95};
        ctx.save(); ctx.globalAlpha = al; radDot(ctx, dp.x, dp.y, Math.max(2.6, C.sc * 0.06)); ctx.restore();
      }
    }});
  });
  items.sort(function(x, y){ return x.z - y.z; });
  items.forEach(function(it){ it.f(); });
  return pr;
}
function rng(seed){ var s = seed >>> 0; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* ====================================================================== */
/* 1. Halogénation radicalaire du propane (L18)                            */
/* ====================================================================== */
var HALO = {
  Cl:{el:"Cl", X2:"Cl₂", nom:"chlore", r2:3.8, XX:1.99, HX:1.27, CX:1.77, gaz:"#c9de7a", rayon:"lumière UV", p1:"1-chloropropane", p2:"2-chloropropane", f1:"CH₃CH₂CH₂Cl", f2:"CH₃CHClCH₃"},
  Br:{el:"Br", X2:"Br₂", nom:"brome", r2:82, XX:2.28, HX:1.41, CX:1.94, gaz:"#d9884a", rayon:"lumière", p1:"1-bromopropane", p2:"2-bromopropane", f1:"CH₃CH₂CH₂Br", f2:"CH₃CHBrCH₃"},
  St:{el:"Cl", X2:"Cl₂", nom:"chlore", r2:1, XX:1.99, HX:1.27, CX:1.77, gaz:"#c9de7a", rayon:"lumière UV", p1:"1-chloropropane", p2:"2-chloropropane", f1:"CH₃CH₂CH₂Cl", f2:"CH₃CHClCH₃"}
};
/* propane : C2 au centre, C1 et C3 dans le plan xy (angle C–C–C 112°), H décalés */
function propane(){
  var h = 56 * DEG, L = 1.53, at = [], bd = [];
  var C1 = [-L * Math.sin(h), -L * Math.cos(h), 0], C2 = [0, 0, 0], C3 = [L * Math.sin(h), -L * Math.cos(h), 0];
  at.push({el:"C", p:C1, cls:0}, {el:"C", p:C2, cls:0}, {el:"C", p:C3, cls:0});
  bd.push({a:0, b:1}, {a:1, b:2});
  function H(ci, d, cls){ at.push({el:"H", p:add(at[ci].p, mul(d, 1.09)), c:ci, cls:cls, dir:d}); bd.push({a:ci, b:at.length - 1}); }
  tetraSlots([nrm(sub(C1, C2)), nrm(sub(C3, C2))]).forEach(function(d){ H(1, d, 2); });
  tetraSlots([nrm(sub(C2, C1))], sub(C3, C2)).forEach(function(d){ H(0, d, 1); });
  tetraSlots([nrm(sub(C2, C3))], sub(C1, C2)).forEach(function(d){ H(2, d, 1); });
  var ctr = [0, -0.35, 0]; at.forEach(function(a){ a.p = sub(a.p, ctr); });
  return {at:at, bd:bd};
}
var PROP = propane();
var HPRIM = [], HSEC = [];
PROP.at.forEach(function(a, i){ if (a.cls === 1) HPRIM.push(i); if (a.cls === 2) HSEC.push(i); });

SFA.sim({
  id:"org-halogenation-radicalaire", ch:"L18", tag:"Substitution radicalaire",
  titre:"Halogénation radicalaire du propane sous la lampe UV",
  resume:"Allume la lampe : le dichlore se coupe en deux radicaux, la chaîne de propagation démarre et le propane se chlore. Compte les produits et vois pourquoi le 2-chloropropane l'emporte.",
  but:"Regarde la chaîne radicalaire en 3D : initiation (la lumière coupe X–X), propagation (X• arrache un H, puis R• arrache un X à X₂ et régénère X•), terminaison (deux radicaux se rencontrent). Clique sur la lampe pour l'éteindre ou l'allumer, glisse dans le ballon pour tourner la vue. Choisis l'halogène et compare les proportions prévues avec le comptage de la simulation.",
  aRetenir:"Substitution radicalaire en chaîne : initiation X₂ → 2 X• (hν ou chaleur) ; propagation RH + X• → R• + HX puis R• + X₂ → RX + X• ; terminaison par union de deux radicaux. Proportion d'un produit = (nombre de H de ce type) × (réactivité relative d'un H de ce type), divisé par la somme. Propane + Cl₂ (25 °C, réactivités de cours primaire : secondaire ≈ 1 : 3,8) : 6 × 1 = 6 contre 2 × 3,8 = 7,6, soit ≈ 44 % de 1-chloropropane et ≈ 56 % de 2-chloropropane. Le brome, moins réactif, est beaucoup plus sélectif (≈ 1 : 82) : ≈ 96,5 % de 2-bromopropane.",
  piege:"Ne pas oublier le facteur statistique : il y a 6 H primaires pour 2 H secondaires. Le radical secondaire est plus stable, mais le chlore, très réactif, choisit peu : les deux produits se forment. La flèche d'un mécanisme radicalaire est une demi-flèche (un seul électron), pas une flèche pleine.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.8}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 600 ? 1.1 : 0.8; r0(); }; c.resize();
    var g = k.canvas(150);
    var st = {a:0.35, b:0.25, t:0, ph:0, seq:[], lamp:true, cnt:[0, 0], rnd:rng(7), term:0, bmin:-1.2, bmax:1.2};
    var lampBox = {x:0, y:0, w:0, h:0};
    dragView(c, st, function(p){
      if (p.x >= lampBox.x && p.x <= lampBox.x + lampBox.w && p.y >= lampBox.y && p.y <= lampBox.y + lampBox.h){ st.lamp = !st.lamp; lampT.set(st.lamp); restart(); k.redraw(); return true; }
      return false;
    });
    var hS = k.seg("Halogène", [["Cl", "Cl₂ (1 : 3,8)"], ["Br", "Br₂ (1 : 82)"], ["St", "Sans préférence (1 : 1)"]], "Cl", function(){ st.cnt = [0, 0]; restart(); });
    var eS = k.seg("Étape montrée", [["all", "Chaîne complète"], ["ini", "Initiation"], ["pro", "Propagation"], ["ter", "Terminaison"]], "all", function(){ restart(); });
    var wS = k.seg("H arraché", [["rnd", "Au hasard (pondéré)"], ["p", "Primaire (CH₃)"], ["s", "Secondaire (CH₂)"]], "rnd", function(){ restart(); });
    var lampT = k.toggle("Lampe allumée (clique aussi sur la lampe)", true, function(v){ st.lamp = v; restart(); });
    k.button("Ajouter 1 000 propagations", function(){ var X = HALO[hS.value], i, p1 = 6 / (6 + 2 * X.r2); for (i = 0; i < 1000; i++){ if (st.rnd() < p1) st.cnt[0]++; else st.cnt[1]++; } });
    k.button("Remettre le comptage à zéro", function(){ st.cnt = [0, 0]; });
    var ro = k.readouts(["Étape", "6 H primaires × réactivité", "2 H secondaires × réactivité", "1-halogénopropane prévu", "2-halogénopropane prévu", "Comptage 1-X / 2-X"]);
    var nt = k.note("", "ok");
    var DUR = {ini:3.4, p1:4.2, p2:4.2, ter:3.6, off:4};
    function pickH(){
      var X = HALO[hS.value], w = wS.value;
      var sec = w === "s" ? true : w === "p" ? false : st.rnd() >= 6 / (6 + 2 * X.r2);
      var L = sec ? HSEC : HPRIM; return L[Math.floor(st.rnd() * L.length)];
    }
    function restart(){
      var e = eS.value;
      if (!st.lamp) st.seq = ["off"];
      else if (e === "ini") st.seq = ["ini"];
      else if (e === "pro") st.seq = ["p1", "p2"];
      else if (e === "ter") st.seq = ["ter"];
      else st.seq = ["ini", "p1", "p2", "p1", "p2", "p1", "p2", "ter"];
      st.ph = 0; st.t = 0; st.h = pickH(); st.counted = false;
    }
    restart();
    var lp = k.loop(function(dt){
      st.t += dt; st.clock = (st.clock || 0) + dt;
      var cur = st.seq[st.ph];
      if (st.t >= DUR[cur]){
        if (cur === "p2" && !st.counted && wS.value === "rnd"){ if (PROP.at[st.h].cls === 1) st.cnt[0]++; else st.cnt[1]++; }
        if (cur === "ter") st.term++;
        st.t = 0; st.ph = (st.ph + 1) % st.seq.length; st.counted = false;
        if (st.seq[st.ph] === "p1") st.h = pickH();
      }
      if (!st.drag && !st.manual){ st.a += dt * 0.12; }
      k.redraw();
    });
    lp.play();
    st.onview = function(){ st.manual = true; };

    /* --- construction de la scène 3D de l'étape --- */
    function frame(cur, t, X){
      var at = [], bd = [], arrows = [], info = {};
      var XC = COL[X.el];
      function A(el, p, o){ var a = {el:el, p:p}; for (var q in o) a[q] = o[q]; at.push(a); return at.length - 1; }
      function addPropane(skip, alpha){
        var map = {};
        PROP.at.forEach(function(a, i){ if (i === skip) return; map[i] = A(a.el, a.p.slice(), {al:alpha, col:a.cls === 1 ? "#9cc3ff" : a.cls === 2 ? "#ffbf7a" : null}); });
        PROP.bd.forEach(function(b){ if (map[b.a] != null && map[b.b] != null) bd.push({a:map[b.a], b:map[b.b]}); });
        return map;
      }
      if (cur === "off"){
        /* lampe éteinte : les molécules se croisent sans réagir */
        var s = Math.sin(t / DUR.off * 2 * PI);
        addPropane(-1, 1);
        var xa = A(X.el, [-3.6 + 0.4 * s, 1.6, 1.0], {}), xb = A(X.el, [-3.6 + 0.4 * s + X.XX, 1.6 + 0.3, 1.0], {});
        bd.push({a:xa, b:xb});
        info.eq = X.X2 + " + C₃H₈ dans le noir"; info.sub = "pas de lumière : X–X ne se coupe pas, aucun radical, aucune réaction"; info.step = "Lampe éteinte";
        return {at:at, bd:bd, arrows:arrows, info:info};
      }
      if (cur === "ini"){
        var sp = seg01(t, 0.9, 1.5), far = ease(seg01(t, 1.5, 3.0));
        var vib = t < 1.5 ? Math.sin(t * 40) * 0.08 * seg01(t, 0.6, 1.4) : 0;
        var half = X.XX / 2 + sp * 0.35 + far * 2.0 + vib;
        var a1 = A(X.el, [-half, 0.6, 0], {rad:t > 1.5}), a2 = A(X.el, [half, 0.6, 0], {rad:t > 1.5});
        if (t < 1.5) bd.push({a:a1, b:a2, dash:t > 1.1});
        info.photon = seg01(t, 0, 1.0); info.target = [0, 0.6, 0];
        if (t > 1.0 && t < 2.6){ arrows.push({from:[0, 0.6, 0], to:at[a1].p, bend:-26, half:true, prog:ease(seg01(t, 1.0, 1.6))}); arrows.push({from:[0, 0.6, 0], to:at[a2].p, bend:26, half:true, prog:ease(seg01(t, 1.0, 1.6))}); }
        info.eq = X.X2 + "  →  2 " + X.el + "•"; info.sub = "initiation : la " + X.rayon + " (hν) coupe la liaison de façon homolytique, un électron pour chaque atome"; info.step = "Initiation";
        return {at:at, bd:bd, arrows:arrows, info:info};
      }
      var h = st.h, HA = PROP.at[h], Cp = PROP.at[HA.c].p, u = HA.dir, sec = HA.cls === 2;
      if (cur === "p1"){
        var come = ease(seg01(t, 0, 1.6)), go = ease(seg01(t, 2.3, 3.9));
        var dH = 1.09 + 0.25 * ease(seg01(t, 1.6, 2.3)) + go * 2.2;
        var map = addPropane(h, 1);
        var hp = add(Cp, mul(u, dH)), xp = add(Cp, mul(u, t < 2.3 ? 1.09 + 1.5 + (1 - come) * 2.2 - 0.15 * ease(seg01(t, 1.6, 2.3)) : dH + X.HX));
        var hi = A("H", hp, {}), xi = A(X.el, xp, {rad:t < 2.0, glow:t > 1.4 && t < 2.4 ? "#ffd640" : null});
        bd.push({a:map[HA.c], b:hi, dash:t > 1.6 && t < 2.3, al:t < 2.3 ? 1 : 0});
        if (t > 1.6) bd.push({a:hi, b:xi, dash:t < 2.3});
        if (t > 2.15){ at[map[HA.c]].rad = true; at[map[HA.c]].radDir = u; at[map[HA.c]].glow = "#ffd640"; }
        if (t > 1.3 && t < 2.6){
          var pr = ease(seg01(t, 1.3, 1.9));
          arrows.push({from:add(xp, mul(u, 0.6)), to:add(hp, mul(u, 0.7)), bend:30, half:true, prog:pr});
          arrows.push({from:add(Cp, mul(u, 0.55)), to:add(hp, mul(u, 0.65)), bend:-30, half:true, prog:pr});
          arrows.push({from:add(Cp, mul(u, 0.6)), to:Cp, bend:-24, half:true, prog:pr});
        }
        info.eq = "C₃H₈ + " + X.el + "•  →  " + (sec ? "CH₃–ĊH–CH₃" : "ĊH₂–CH₂–CH₃") + " + H" + X.el;
        info.sub = "propagation 1 : " + X.el + "• arrache un H " + (sec ? "secondaire (radical secondaire, plus stable)" : "primaire (radical primaire)");
        info.step = "Propagation 1"; info.hl = map[HA.c];
        return {at:at, bd:bd, arrows:arrows, info:info};
      }
      if (cur === "p2"){
        var map2 = addPropane(h, 1), cI = map2[HA.c];
        var come2 = ease(seg01(t, 0, 1.6)), brk = ease(seg01(t, 1.6, 2.3)), go2 = ease(seg01(t, 2.3, 3.9));
        var dXa = t < 2.3 ? X.CX + 0.55 + (1 - come2) * 2.4 - 0.55 * brk : X.CX;
        var dXb = t < 2.3 ? dXa + X.XX + 0.35 * brk : X.CX + X.XX + 0.35 + go2 * 2.0;
        var xa2 = A(X.el, add(Cp, mul(u, dXa)), {}), xb2 = A(X.el, add(Cp, mul(u, dXb)), {rad:t > 2.15, glow:t > 2.0 && t < 3.2 ? "#ffd640" : null});
        at[cI].rad = t < 2.1; at[cI].radDir = u; at[cI].glow = t > 1.2 && t < 2.3 ? "#ffd640" : null;
        bd.push({a:xa2, b:xb2, dash:t > 1.6, al:t < 2.3 ? 1 : 0});
        if (t > 1.6) bd.push({a:cI, b:xa2, dash:t < 2.3});
        if (t > 1.3 && t < 2.6){
          var pr2 = ease(seg01(t, 1.3, 1.9)), pa = at[xa2].p, pb = at[xb2].p, mid = lerp(pa, pb, 0.5);
          arrows.push({from:add(Cp, mul(u, 0.55)), to:lerp(Cp, pa, 0.55), bend:-28, half:true, prog:pr2});
          arrows.push({from:mid, to:lerp(Cp, pa, 0.6), bend:28, half:true, prog:pr2});
          arrows.push({from:mid, to:pb, bend:-26, half:true, prog:pr2});
        }
        info.eq = (sec ? "CH₃–ĊH–CH₃" : "ĊH₂–CH₂–CH₃") + " + " + X.X2 + "  →  " + (sec ? X.f2 : X.f1) + " + " + X.el + "•";
        info.sub = "propagation 2 : le radical prend un " + X.el + " à " + X.X2 + " et régénère " + X.el + "• (la chaîne continue)";
        info.step = "Propagation 2"; info.prod = sec ? 1 : 0;
        return {at:at, bd:bd, arrows:arrows, info:info};
      }
      /* terminaison : deux variantes en alternance */
      var v = st.term % 2, m = ease(seg01(t, 0, 1.8));
      if (v === 0){
        var d = 3.0 * (1 - m) + X.XX / 2;
        var t1 = A(X.el, [-d, 0.4, 0.3], {rad:t < 1.8}), t2 = A(X.el, [d, 0.4, -0.3 * (1 - m)], {rad:t < 1.8});
        if (t > 1.5) bd.push({a:t1, b:t2, dash:t < 1.8});
        if (t > 0.9 && t < 2.2){ var pr3 = ease(seg01(t, 0.9, 1.5)); arrows.push({from:at[t1].p, to:[0, 0.4, 0.15], bend:-24, half:true, prog:pr3}); arrows.push({from:at[t2].p, to:[0, 0.4, 0.15], bend:24, half:true, prog:pr3}); }
        info.eq = X.el + "• + " + X.el + "•  →  " + X.X2; info.sub = "terminaison : deux radicaux s'unissent, la chaîne s'arrête (aussi R• + R• → R–R)";
      } else {
        var map3 = addPropane(HSEC[0], 1), cc = map3[1], u3 = PROP.at[HSEC[0]].dir;
        var dd = X.CX + (1 - m) * 2.8;
        var tx = A(X.el, add(at[cc].p, mul(u3, dd)), {rad:t < 1.8});
        at[cc].rad = t < 1.8; at[cc].radDir = u3;
        if (t > 1.5) bd.push({a:cc, b:tx, dash:t < 1.8});
        if (t > 0.9 && t < 2.2){ var pr4 = ease(seg01(t, 0.9, 1.5)), mp = lerp(at[cc].p, at[tx].p, 0.5); arrows.push({from:at[tx].p, to:mp, bend:-24, half:true, prog:pr4}); arrows.push({from:add(at[cc].p, mul(u3, 0.5)), to:mp, bend:24, half:true, prog:pr4}); }
        info.eq = "CH₃–ĊH–CH₃ + " + X.el + "•  →  " + X.f2; info.sub = "terminaison : radical alkyle + radical halogène (consomme deux radicaux)";
      }
      info.step = "Terminaison";
      return {at:at, bd:bd, arrows:arrows, info:info};
    }

    function drawFlask(ctx, W, H, cx, cy, R, X, lampOn){
      /* paillasse */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#eef2f7"); bg.addColorStop(0.78, "#dfe6ef"); bg.addColorStop(0.78, "#c9b79c"); bg.addColorStop(1, "#b39f82");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(0, H * 0.78, W, 2);
      /* lumière de la lampe sur la scène */
      if (lampOn){
        var lg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.6); lg.addColorStop(0, X.el === "Br" ? "rgba(255,240,200,.35)" : "rgba(186,150,255,.30)"); lg.addColorStop(1, "rgba(186,150,255,0)");
        ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
      }
      floorShadow(ctx, cx, cy + R * 0.98, R * 0.95, R * 0.12, 0.28);
      /* col et ballon */
      var nw = R * 0.26, nh = R * 0.5;
      ctx.save();
      ctx.beginPath(); ctx.moveTo(cx - nw, cy - R - nh); ctx.lineTo(cx - nw, cy - R * 0.93); ctx.arc(cx, cy, R, -PI / 2 - Math.asin(nw / R), -PI / 2 + Math.asin(nw / R), true); ctx.lineTo(cx + nw, cy - R - nh); ctx.closePath();
      var gz = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R * 1.05);
      gz.addColorStop(0, "rgba(255,255,255,.55)"); gz.addColorStop(0.7, rgba(X.gaz, 0.22)); gz.addColorStop(1, rgba(X.gaz, 0.42));
      ctx.fillStyle = gz; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(120,140,165,.75)"; ctx.stroke();
      ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.stroke();
      /* bouchon */
      var bk = ctx.createLinearGradient(cx - nw, 0, cx + nw, 0); bk.addColorStop(0, "#7a5638"); bk.addColorStop(0.5, "#b38358"); bk.addColorStop(1, "#6b4a30");
      ctx.fillStyle = bk; rr(ctx, cx - nw * 1.12, cy - R - nh - nw * 0.6, nw * 2.24, nw * 0.9, 4); ctx.fill();
      ctx.restore();
    }
    function drawFlaskFront(ctx, cx, cy, R){
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = R * 0.05; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.86, PI * 1.12, PI * 1.38); ctx.stroke();
      ctx.lineWidth = R * 0.02; ctx.beginPath(); ctx.arc(cx, cy, R * 0.86, PI * 1.43, PI * 1.5); ctx.stroke();
      ctx.restore();
    }
    function drawLamp(ctx, x, y, w, h, on, X, t){
      ctx.save();
      /* bras et pied */
      ctx.strokeStyle = "#5d6878"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + w * 0.5, y + h); ctx.lineTo(x + w * 0.5, y + h * 2.2); ctx.stroke();
      /* réflecteur */
      var gr = ctx.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, "#a8b3c2"); gr.addColorStop(0.5, "#e9eef4"); gr.addColorStop(1, "#7d8898");
      ctx.fillStyle = gr; rr(ctx, x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = "#5d6878"; ctx.lineWidth = 1.5; ctx.stroke();
      /* tube */
      var tc = on ? (X.el === "Br" ? "#fff3c4" : "#d9c8ff") : "#c9ced6";
      ctx.fillStyle = tc; rr(ctx, x + w * 0.12, y + h * 0.3, w * 0.76, h * 0.4, h * 0.2); ctx.fill();
      if (on){
        var gl = ctx.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, w * 0.9);
        gl.addColorStop(0, X.el === "Br" ? "rgba(255,236,170,.75)" : "rgba(170,120,255,.7)"); gl.addColorStop(1, "rgba(170,120,255,0)");
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w * 0.9, 0, 7); ctx.fill();
      }
      ctx.restore();
      txt(ctx, on ? (X.el === "Br" ? "lampe (hν)" : "lampe UV (hν)") : "lampe éteinte", x + w / 2, y - 9, 11, on ? "#5b3fb0" : "#5f6b7a", "center", 800);
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, X = HALO[hS.value];
      var cur = st.seq[st.ph] || "off", F = frame(cur, st.t, X);
      var banH = ph ? 74 : 66, top = ph ? 58 : 60, area = H - banH - top - 14;
      var R = Math.min(W * (ph ? 0.4 : 0.34), area * 0.5), cx = W * (ph ? 0.56 : 0.55), cy = top + area * 0.54;
      drawFlask(ctx, W, H, cx, cy, R, X, st.lamp);
      /* lampe */
      var lw = ph ? 62 : 84, lh = ph ? 26 : 32;
      lampBox = {x:ph ? 10 : W * 0.06, y:top + 8, w:lw, h:lh};
      drawLamp(ctx, lampBox.x, lampBox.y, lw, lh, st.lamp, X, st.clock);
      var C = cam(st, R / 3.3, cx, cy);
      /* rayons et photon */
      if (st.lamp){
        ctx.save(); ctx.strokeStyle = X.el === "Br" ? "rgba(230,170,40,.35)" : "rgba(140,90,240,.32)"; ctx.lineWidth = 2; ctx.setLineDash([6, 7]); ctx.lineDashOffset = -(st.clock || 0) * 30;
        for (var q = -1; q <= 1; q++){ ctx.beginPath(); ctx.moveTo(lampBox.x + lw, lampBox.y + lh / 2); ctx.lineTo(cx - R * 0.5, cy + q * R * 0.4); ctx.stroke(); }
        ctx.restore();
      }
      if (F.info.photon != null && F.info.photon < 1){
        var tg = C.P(F.info.target), x0 = lampBox.x + lw, y0 = lampBox.y + lh / 2, f = F.info.photon, xe = x0 + (tg.x - x0) * f, ye = y0 + (tg.y - y0) * f;
        var dx = tg.x - x0, dy = tg.y - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, i0 = Math.max(0, f * L - 70);
        ctx.save(); ctx.strokeStyle = X.el === "Br" ? "#d99a1c" : "#7a3cf0"; ctx.lineWidth = 2.6; ctx.beginPath();
        for (var s = i0; s <= f * L; s += 2){ var w = Math.sin(s * 0.35) * 5; var px = x0 + ux * s - uy * w, py = y0 + uy * s + ux * w; if (s === i0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
        ctx.stroke(); ctx.restore();
        S.draw.label(c, "hν", xe, ye - 16, {color:X.el === "Br" ? "#b07a10" : "#6a32d8", size:12});
      }
      /* molécules */
      renderMol(ctx, C, F.at, F.bd, [], {fadeR:3.4});
      F.arrows.forEach(function(a){ var p = C.P(a.from), q = C.P(a.to); curlyArrow(ctx, p.x, p.y, q.x, q.y, a.bend, "#d6392f", a.half, 2.4, a.prog); });
      drawFlaskFront(ctx, cx, cy, R);
      /* titre de l'étape */
      var stepCol = {"Initiation":"#7a3cf0", "Propagation 1":"#2a6fdb", "Propagation 2":"#2a6fdb", "Terminaison":"#c0392b", "Lampe éteinte":"#5f6b7a"}[F.info.step];
      S.draw.label(c, F.info.step, ph ? 10 : 14, 18, {color:stepCol, align:"left", size:ph ? 12 : 13});
      if (!ph) S.draw.text(c, "glisse : vue · clic : lampe", W - 12, 18, {size:11, color:"#8a95a3", align:"right"});
      /* compteur de produits sur la paillasse */
      var tot = st.cnt[0] + st.cnt[1];
      if (cur !== "ini") S.draw.legend(c, [["#9cc3ff", "6 H primaires (CH₃)"], ["#ffbf7a", "2 H secondaires (CH₂)"]], W - 12, H - banH - (ph ? 56 : 60), {align:"right"});
      banner(ctx, W, H - banH - 8, banH, F.info.eq, F.info.sub, stepCol);
      /* graphe de sélectivité */
      drawChart(X, tot);
      var w1 = 6, w2 = 2 * X.r2, p1 = w1 / (w1 + w2), p2 = w2 / (w1 + w2);
      ro.set(0, F.info.step);
      ro.set(1, "6 × 1 = " + S.fmt(w1, 1));
      ro.set(2, "2 × " + S.fmt(X.r2, 1) + " = " + S.fmt(w2, 1));
      ro.set(3, S.fmt(100 * p1, 1) + " %");
      ro.set(4, S.fmt(100 * p2, 1) + " %");
      ro.set(5, st.cnt[0] + " / " + st.cnt[1]);
      var msg;
      if (hS.value === "St") msg = "Sans préférence (réactivités 1 : 1), seule la statistique compte : 6 H primaires contre 2 secondaires, donc 75 % / 25 %. C'est ce que donnerait un halogène qui arracherait n'importe quel H.";
      else if (hS.value === "Br") msg = "Le brome est beaucoup moins réactif : l'arrachement de H est endothermique et l'état de transition ressemble au radical. La stabilité du radical secondaire pèse alors très lourd : 2 × 82 = 164 contre 6, soit ≈ 96,5 % de 2-bromopropane.";
      else msg = (wS.value === "rnd" ? "" : "Le comptage avance seulement en mode « au hasard ». ") + "Le chlore est très réactif et peu sélectif : un H secondaire réagit ≈ 3,8 fois plus vite qu'un H primaire (valeur de cours, 25 °C), mais il y a trois fois plus de H primaires. Bilan : 6 contre 7,6.";
      nt.set(msg + " <i>Rapports de réactivité : valeurs de cours (ordres de grandeur expérimentaux, Cl à 25 °C, Br vers 125 °C).</i>", "ok");
    });
    function drawChart(X, tot){
      var ctx = g.ctx, W = g.W, H = g.H; g.clear();
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      var w1 = 6, w2 = 2 * X.r2, P = [w1 / (w1 + w2), w2 / (w1 + w2)], Sm = tot ? [st.cnt[0] / tot, st.cnt[1] / tot] : null;
      var X0 = W < 480 ? 118 : 150, X1 = W - 62, rows = [X.p1 + " (6 H I)", X.p2 + " (2 H II)"], cols = ["#2a6fdb", "#e08a1e"];
      S.draw.text(g, "Proportions des produits monohalogénés", 10, 14, {size:12, color:"#2c3a4e", align:"left"});
      ctx.save(); ctx.font = "600 10.5px " + FONT; ctx.fillStyle = "#8a95a3"; ctx.textAlign = "center";
      for (var v = 0; v <= 100; v += 25){ var xx = X0 + v / 100 * (X1 - X0); ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(xx, 30); ctx.lineTo(xx, H - 22); ctx.stroke(); ctx.fillText(v + " %", xx, H - 10); }
      ctx.restore();
      rows.forEach(function(r, i){
        var y = 36 + i * ((H - 62) / 2), bh = (H - 62) / 2 - 10, wv = P[i] * (X1 - X0);
        var gr = ctx.createLinearGradient(0, y, 0, y + bh); gr.addColorStop(0, shade(cols[i], 0.3)); gr.addColorStop(1, cols[i]);
        ctx.fillStyle = gr; rr(ctx, X0, y, Math.max(2, wv), bh, 5); ctx.fill();
        ctx.save(); ctx.font = "700 " + (W < 480 ? 10.5 : 11.5) + "px " + FONT; ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(W < 480 ? (i ? X.p2 : X.p1) : r, X0 - 6, y + bh / 2); ctx.textAlign = "left"; ctx.fillText(S.fmt(100 * P[i], 1) + " %", X0 + wv + 6, y + bh / 2); ctx.restore();
        if (Sm){ var xs = X0 + Sm[i] * (X1 - X0); ctx.save(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xs, y - 3); ctx.lineTo(xs, y + bh + 3); ctx.stroke(); ctx.restore(); }
      });
      if (W >= 480) S.draw.text(g, "barre : prévu · trait noir : comptage", W - 8, 14, {size:10.5, color:"#8a95a3", align:"right"});
    }
  }
});

/* ====================================================================== */
/* 2. Tension de cycle, du cyclopropane au cyclooctane (L16)               */
/* ====================================================================== */
/* squelettes carbonés (Å) : C3, C4 (plissé, 88°) construits ; C5 enveloppe, C6 chaise, C7 chaise torsadée, C8 bateau-chaise
   obtenus par minimisation d'un petit champ de force (liaison 1,54 Å, angle, torsion, répulsion transannulaire) */
var RINGS = {3: [[0.872, 0.0, 0.0], [-0.436, 0.0, -0.755], [-0.436, 0.0, 0.755]], 4: [[1.077, -0.145, 0.0], [0.0, 0.145, -1.077], [-1.077, -0.145, 0.0], [0.0, 0.145, 1.077]], 5: [[1.297, 0.073, 0.0], [0.379, 0.071, -1.241], [-1.048, -0.192, -0.723], [-1.014, 0.242, 0.751], [0.386, -0.194, 1.213]], 6: [[1.466, -0.236, -0.0], [0.733, 0.236, -1.27], [-0.733, -0.236, -1.27], [-1.466, 0.236, 0.0], [-0.733, -0.236, 1.27], [0.733, 0.236, 1.27]], 7: [[1.778, 0.0, 0.0], [0.956, -0.428, -1.23], [-0.302, 0.413, -1.508], [-1.543, -0.115, -0.762], [-1.543, 0.115, 0.762], [-0.302, -0.413, 1.508], [0.956, 0.428, 1.23]], 8: [[1.766, 0.357, -0.0], [1.276, 0.096, -1.444], [-0.218, 0.357, -1.753], [-1.214, -0.632, -1.112], [-1.913, -0.106, 0.16], [-1.028, 0.667, 1.163], [0.077, -0.106, 1.918], [1.253, -0.632, 1.068]]};
/* chaleurs de combustion en phase gazeuse par CH₂ (kcal/mol), Vollhardt & Schore, tableau 4-2 (d'après Cox & Pilcher) ; 1 kcal = 4,184 kJ */
var DCH = {3:166.6, 4:164.0, 5:158.7, 6:157.4, 7:158.3, 8:158.6}, DCH_REF = 157.4;
var RNAME = {3:"cyclopropane", 4:"cyclobutane", 5:"cyclopentane", 6:"cyclohexane", 7:"cycloheptane", 8:"cyclooctane"};
var RCONF = {3:"plan", 4:"plissé (« papillon »)", 5:"enveloppe", 6:"chaise", 7:"chaise torsadée", 8:"bateau-chaise"};
function kj(x){ return x * 4.184; }
function ringAtoms(P){
  var n = P.length, at = [], bd = [], i;
  for (i = 0; i < n; i++) at.push({el:"C", p:P[i]});
  for (i = 0; i < n; i++) bd.push({a:i, b:(i + 1) % n});
  for (i = 0; i < n; i++){
    var a = P[(i + n - 1) % n], b = P[(i + 1) % n], E = [nrm(sub(a, P[i])), nrm(sub(b, P[i]))];
    var d = nrm(mul(add(E[0], E[1]), -1)), nn = nrm(cross(E[0], E[1]));
    /* même orientation de la normale pour tous les carbones : on suit le sens du cycle */
    var h = 54.75 * DEG, s1 = [add(mul(d, Math.cos(h)), mul(nn, Math.sin(h))), add(mul(d, Math.cos(h)), mul(nn, -Math.sin(h)))];
    s1.forEach(function(u, q){ at.push({el:"H", p:add(P[i], mul(u, 1.09)), c:i, q:q, dir:u}); bd.push({a:i, b:at.length - 1}); });
  }
  return {at:at, bd:bd};
}
function planar(P){
  var n = P.length, r = 1.54 / (2 * Math.sin(PI / n)), a0 = Math.atan2(P[0][2], P[0][0]), a1 = Math.atan2(P[1][2], P[1][0]);
  var sg = ((a1 - a0 + 3 * PI) % (2 * PI)) - PI > 0 ? 1 : -1;
  return P.map(function(_, i){ var t = a0 + sg * 2 * PI * i / n; return [r * Math.cos(t), 0, r * Math.sin(t)]; });
}
SFA.sim({
  id:"org-tension-cycles-3d", ch:"L16", tag:"Conformations des cycles",
  titre:"Tension de cycle : du cyclopropane au cyclooctane en 3D",
  resume:"Tourne chaque cycloalcane dans sa vraie conformation, mesure ses angles C–C–C, compare-les à 109,5° et lis sa chaleur de combustion par CH₂ : la tension de cycle se voit et se chiffre.",
  but:"Choisis un cycle (ou clique sur sa barre dans le graphe). Il tourne dans sa conformation réelle ; l'arc orange mesure un angle C–C–C, l'arc pointillé montre 109,5°. Pousse le curseur « Aplatir » pour forcer le cycle à être plan et regarde l'angle changer. Pour le cyclohexane, lance l'inversion de la chaise : les H axiaux (rouges) deviennent équatoriaux (bleus).",
  aRetenir:"Un carbone sp³ préfère des angles de 109,5°. Un cycle plan aurait des angles de (n − 2)·180°/n : 60°, 90°, 108°, 120°, 128,6°, 135°. Seul le cyclopropane est obligatoirement plan (60°, tension maximale). Les autres se plissent : cyclobutane ≈ 88°, cyclopentane ≈ 105° (enveloppe), cyclohexane ≈ 111° (chaise, sans tension), cycles à 7 et 8 C ≈ 115-117°. La tension se mesure par la chaleur de combustion par CH₂ (−ΔcH°, la combustion est exothermique) : 697 kJ/mol pour le cyclopropane contre 658,6 kJ/mol pour un CH₂ sans tension ; tension totale = n × (chaleur de combustion par CH₂ − 658,6), soit 115 kJ/mol pour C₃ et 0 pour C₆.",
  piege:"La théorie de Baeyer (cycles plans) prédit à tort une forte tension pour le cyclohexane (120°) : en réalité la chaise a des angles de 111° et toutes ses liaisons sont décalées. La tension n'est pas que l'angle : les H éclipsés (tension de torsion) et les H qui se gênent à travers le cycle (cycles à 7-8 C) comptent aussi.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.72}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 600 ? 1.0 : 0.72; r0(); }; c.resize();
    var g = k.canvas(190);
    var st = {a:0.5, b:0.42, flip:0, fdir:1, clock:0};
    dragView(c, st); st.onview = function(){ st.manual = true; };
    var nS = k.seg("Cycle", [["3", "C₃"], ["4", "C₄"], ["5", "C₅"], ["6", "C₆"], ["7", "C₇"], ["8", "C₈"]], "6", function(){ st.flip = 0; });
    var fl = k.slider("Aplatir le cycle (forcer le plan)", 0, 100, 1, 0, "%");
    var flipT = k.toggle("Inversion de la chaise (cyclohexane)", false);
    var HT = k.toggle("Afficher les hydrogènes", true);
    var spinT = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["Angle si le cycle était plan", "Angle C–C–C moyen (réel)", "Écart à 109,5°", "Chaleur de combustion par CH₂ (−ΔcH°)", "Tension de cycle totale", "Conformation"]);
    var nt = k.note("", "ok");
    g.pointer(function(type, p){ if (type !== "down") return; var bx = g._bars || []; bx.forEach(function(b){ if (p.x >= b.x0 && p.x <= b.x1) { nS.set(String(b.n)); st.flip = 0; k.redraw(); } }); });
    var lp = k.loop(function(dt){
      st.clock += dt;
      if (spinT.value && !st.drag && !st.manual) st.a += dt * 0.35;
      if (flipT.value && nS.value === "6"){ st.flip += dt * 0.22; }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, n = +nS.value, P0 = RINGS[n], pl = planar(P0), f = fl.value / 100;
      /* inversion de chaise (schématique, par le cycle plan) : 0 → chaise, 0,5 → plan, 1 → chaise inversée */
      var fp = n === 6 && flipT.value ? (1 - Math.cos(st.flip * 2 * PI)) / 2 : 0;
      var P = P0.map(function(p, i){ var q = [p[0], p[1] * (1 - 2 * ease(fp)), p[2]]; return lerp(q, pl[i], f); });
      var M = ringAtoms(P), M0 = ringAtoms(P0), clash = {};
      /* H portés par des carbones non voisins et à moins de 2,45 Å l'un de l'autre (tension transannulaire, C₇ et C₈) */
      M0.at.forEach(function(a, i){ if (a.el !== "H") return; M0.at.forEach(function(b, j){ if (j <= i || b.el !== "H") return; var rd = Math.abs(a.c - b.c); rd = Math.min(rd, n - rd); if (rd >= 2 && len(sub(a.p, b.p)) < 2.45){ clash[i] = clash[j] = true; } }); });
      /* axial / équatorial : identifiés sur la chaise de départ */
      M.at.forEach(function(a, i){
        if (a.el !== "H") return;
        if (n === 6){ var ax = Math.abs(M0.at[i].dir[1]) > 0.8; a.col = ax ? "#f07f72" : "#7fa8ee"; }
        if (n >= 7 && clash[i]) a.col = "#f5a524";
        if (!HT.value) a.al = 0;
      });
      softBg(ctx, W, H);
      var ext = 0; P0.forEach(function(p){ ext = Math.max(ext, Math.hypot(p[0], p[2])); });
      var area = H - 26, C = cam(st, Math.min(W, area) * (ph ? 0.44 : 0.4) / (ext + 1.35), W / 2, 26 + area * 0.47);
      floorShadow(ctx, W / 2, 26 + area * 0.9, Math.min(W * 0.3, area * 0.5), area * 0.05);
      /* angle mesuré au carbone le plus proche de l'observateur */
      var best = 0, bz = -1e9; P.forEach(function(p, i){ var z = C.P(p).z; if (z > bz){ bz = z; best = i; } });
      var A = P[(best + n - 1) % n], B = P[best], Cc = P[(best + 1) % n], ang = angle3(A, B, Cc);
      var arcs = [];
      arcs.push({z:99, f:function(){ drawArc(ctx, C, A, B, Cc, ang, 0.8, "#e08a1e", false); drawArc(ctx, C, A, B, Cc, 109.5, 1.1, "#5f6b7a", true); }});
      renderMol(ctx, C, M.at, M.bd, arcs);
      var bp = C.P(B), lab = S.fmt(ang, 1) + "°";
      S.draw.label(c, lab, bp.x, bp.y - (ph ? 34 : 44), {color:"#c46a00", size:ph ? 13 : 15});
      S.draw.text(c, RNAME[n] + " · " + (f > 0.02 ? "forcé vers le plan (" + Math.round(f * 100) + " %)" : RCONF[n]), 10, 14, {size:ph ? 12 : 13, color:"#2c3a4e", align:"left"});
      if (!ph) S.draw.text(c, "glisse pour tourner", W - 10, 14, {size:11, color:"#8a95a3", align:"right"});
      if (n >= 7 && HT.value) S.draw.legend(c, [["#f5a524", "H qui se gênent (< 2,45 Å)"]], 10, H - 32, {});
      if (n === 6 && HT.value) S.draw.legend(c, [["#f07f72", "H axiaux (départ)"], ["#7fa8ee", "H équatoriaux (départ)"]], 10, H - 50, {});
      S.draw.legend(c, [["#e08a1e", "angle C–C–C"], ["#5f6b7a", "109,5° (tétraèdre)", true]], W - 10, H - 50, {align:"right"});
      /* moyenne des angles du cycle */
      var sum = 0; for (var i = 0; i < n; i++) sum += angle3(P[(i + n - 1) % n], P[i], P[(i + 1) % n]);
      var mean = sum / n, plan = (n - 2) * 180 / n, hc = kj(DCH[n]), strain = n * kj(DCH[n] - DCH_REF);
      ro.set(0, S.fmt(plan, 1) + "°");
      ro.set(1, S.fmt(mean, 1) + "°");
      ro.set(2, (mean - 109.5 >= 0 ? "+" : "") + S.fmt(mean - 109.5, 1) + "°");
      ro.set(3, S.fmt(hc, 1) + " kJ/mol");
      ro.set(4, S.fmt(strain, 0) + " kJ/mol");
      ro.set(5, f > 0.02 ? "forcée vers le plan" : fp > 0.02 ? "en cours d'inversion" : RCONF[n]);
      drawChart(n);
      var msg = {3:"Trois carbones sont toujours dans un même plan : 60°, très loin de 109,5°, et les six H sont éclipsés. Les liaisons C–C sont « courbes » (en banane) et fragiles : le cyclopropane s'ouvre facilement.",
        4:"S'il était plan, le cyclobutane aurait 90° et huit H éclipsés. Il se plie légèrement (≈ 88°) : un peu plus de tension d'angle, mais moins de tension de torsion.",
        5:"Plan, il aurait 108°, presque idéal, mais dix H éclipsés. Il se plie en enveloppe (un carbone hors du plan) : ≈ 105°, peu de tension.",
        6:"La chaise a des angles de ≈ 111° et toutes ses liaisons décalées : aucune tension, même chaleur de combustion par CH₂ qu'une chaîne ouverte (658,6 kJ/mol). Plan, il aurait 120°.",
        7:"Plan, il aurait 128,6°. La chaise torsadée ramène les angles vers ≈ 115°, mais des H se gênent à travers le cycle : un peu de tension (≈ 26 kJ/mol).",
        8:"Plan, il aurait 135°. Le bateau-chaise ramène les angles vers ≈ 116°, mais des H pointent les uns vers les autres à l'intérieur du cycle (tension transannulaire)."}[n];
      if (fp > 0.02) msg = "Inversion de chaise (schéma simplifié qui passe par le plan) : chaque H axial devient équatorial et inversement. Le vrai chemin passe par la demi-chaise et le bateau croisé (barrière ≈ 45 kJ/mol).";
      nt.set(msg + " <i>Angles calculés sur la géométrie affichée (modèle à ± 1°) ; chaleurs de combustion (−ΔcH°) en phase gazeuse, Vollhardt & Schore (d'après Cox & Pilcher).</i>", "ok");
    });
    function drawArc(ctx, C, A, B, Cc, deg, rr, col, dash){
      var u = nrm(sub(A, B)), w0 = nrm(sub(Cc, B)), nn = nrm(cross(u, w0)), v2 = cross(nn, u), m = 18, i, pts = [];
      var r = rr;
      for (i = 0; i <= m; i++){ var t = deg * DEG * i / m; pts.push(C.P(add(B, mul(add(mul(u, Math.cos(t)), mul(v2, Math.sin(t))), r)))); }
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = dash ? 2 : 3; ctx.setLineDash(dash ? [5, 4] : []);
      if (!dash){ ctx.fillStyle = rgba("#f2a33a", 0.28); ctx.beginPath(); var b0 = C.P(B); ctx.moveTo(b0.x, b0.y); pts.forEach(function(p){ ctx.lineTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); }
      ctx.beginPath(); pts.forEach(function(p, j){ if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke(); ctx.restore();
    }
    function drawChart(sel){
      var ctx = g.ctx, W = g.W, H = g.H; g.clear(); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      var L = W < 480 ? 44 : 52, R = 12, T = 36, B = H - 26, y0 = 650, y1 = 705;
      function Y(v){ return B - (v - y0) / (y1 - y0) * (B - T); }
      S.draw.text(g, W < 760 ? "−ΔcH° par CH₂ (kJ/mol), axe dès 650" : "Chaleur de combustion par CH₂, −ΔcH° (kJ/mol, gaz) · axe à partir de 650 · clique sur une barre", 10, 13, {size:12, color:"#2c3a4e", align:"left"});
      ctx.save(); ctx.font = "600 10.5px " + FONT; ctx.fillStyle = "#8a95a3"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var v = y0; v <= y1; v += 10){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillText(String(v), L - 5, Y(v)); }
      ctx.restore();
      var bw = (W - L - R) / 6, bars = [];
      for (var n = 3; n <= 8; n++){
        var x0 = L + (n - 3) * bw + bw * 0.18, x1 = x0 + bw * 0.64, hv = kj(DCH[n]), hr = kj(DCH_REF), on = n === sel;
        var gr = ctx.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, on ? "#4d8af0" : "#c4cfdd"); gr.addColorStop(1, on ? "#1f5fc7" : "#aab7c8");
        ctx.fillStyle = gr; ctx.fillRect(x0, Y(hr), x1 - x0, B - Y(hr));
        ctx.fillStyle = on ? "#e0574a" : "#eaa49d"; ctx.fillRect(x0, Y(hv), x1 - x0, Y(hr) - Y(hv));
        ctx.save(); ctx.font = (on ? "800 " : "700 ") + "11px " + FONT; ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("C" + "₀₁₂₃₄₅₆₇₈₉"[n], (x0 + x1) / 2, B + 12);
        ctx.fillText(S.fmt(hv, W < 480 ? 0 : 1), (x0 + x1) / 2, Y(hv) - 8);
        ctx.restore();
        bars.push({n:n, x0:L + (n - 3) * bw, x1:L + (n - 2) * bw});
      }
      g._bars = bars;
      ctx.save(); ctx.strokeStyle = "#13233a"; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, Y(kj(DCH_REF))); ctx.lineTo(W - R, Y(kj(DCH_REF))); ctx.stroke(); ctx.restore();
      S.draw.text(g, "sans tension : 658,6", W - R - 4, Y(kj(DCH_REF)) + 10, {size:10.5, color:"#13233a", align:"right"});
      ctx.save(); ctx.fillStyle = "#e0574a"; ctx.fillRect(W - R - 118, 8, 10, 10); ctx.restore();
      S.draw.text(g, "= tension par CH₂", W - R - 104, 13, {size:10.5, color:"#c0392b", align:"left"});
    }
  }
});

/* ====================================================================== */
/* 3. Le polarimètre (L16)                                                 */
/* ====================================================================== */
/* pouvoirs rotatoires spécifiques [α]D (20 °C, eau) en °·mL·g⁻¹·dm⁻¹ — valeurs de cours */
var SOLS = {
  sac:{n:"Saccharose", a:66.5, col:"#f3e7b0"},
  glu:{n:"D-glucose (équilibre)", a:52.7, col:"#f1e9c4"},
  fru:{n:"D-fructose (équilibre)", a:-92.4, col:"#efe0a8"},
  inv:{n:"Sucre inverti (glucose + fructose, 1 : 1)", a:(52.7 - 92.4) / 2, col:"#f0dca0"},
  eau:{n:"Eau pure (solvant)", a:0, col:"#dbeefa"}
};
function polE(phi){ return [0, Math.cos(phi), -Math.sin(phi)]; }   /* vibration à l'angle phi de la verticale, sens horaire pour l'observateur (placé en +x) */
SFA.sim({
  id:"org-polarimetre", ch:"L16", tag:"Activité optique",
  titre:"Le polarimètre : mesurer le pouvoir rotatoire",
  resume:"Lampe au sodium, polariseur, tube de solution et analyseur : tourne l'analyseur à la souris jusqu'à l'extinction, lis l'angle α et calcule [α] = α/(l·c). Essaie le saccharose, le glucose, le fructose et un mélange racémique.",
  but:"La lumière jaune du sodium est polarisée verticalement par le polariseur. Dans le tube, la solution chirale fait tourner le plan de vibration (regarde les flèches). Sans solution, l'analyseur (θ = 0°) est croisé avec le polariseur : noir. Tourne l'analyseur (glisse sur son disque, ou le curseur θ) jusqu'à retrouver le noir : l'angle lu est α. Change la solution, la longueur du tube, la concentration et la part d'énantiomère opposé.",
  aRetenir:"Loi de Biot : α = [α]·l·c, avec α en degrés, l en dm et c en g/mL ; donc [α] = α/(l·c). [α] > 0 : dextrogyre (+), rotation dans le sens horaire pour l'observateur ; [α] < 0 : lévogyre (−). Deux énantiomères ont des [α] opposés. Un mélange racémique (50/50) a α = 0 : il est optiquement inactif. Avec un excès énantiomérique ee, α = ee·[α]·l·c. Le signe (+/−) ne se déduit pas de R/S.",
  piege:"Les unités : l en décimètres (un tube de 20 cm fait 2 dm) et c en g/mL (10 g dans 100 mL donnent 0,10 g/mL). Une mesure seule ne distingue pas +α de α − 180° : on vérifie en diluant ou en changeant de tube (α doit varier proportionnellement). Et « dextrogyre » n'a rien à voir avec la lettre D de Fischer : le D-fructose est lévogyre.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 600 ? 0.85 : 0.62; r0(); }; c.resize();
    var g = k.canvas(150);
    var st = {a:-0.42, b:0.32, clock:0, auto:null, bmin:0.05, bmax:0.75};
    if (c.W < 480){ st.a = -0.85; st.b = 0.42; }
    var anaHit = {x:0, y:0, r:0}, rotating = false, lastP = null;
    c.pointer(function(type, p){
      if (type === "down"){
        if (Math.hypot(p.x - anaHit.x, p.y - anaHit.y) < anaHit.r * 1.25){ rotating = true; lastP = p; st.auto = null; return; }
        st.lx = p.x; st.ly = p.y; st.drag = true;
      }
      if (type === "drag"){
        if (rotating){ thS.set(clamp(Math.round((thS.value + ((p.x - lastP.x) - (p.y - lastP.y)) * 0.12) * 100) / 100, -90, 90)); lastP = p; k.redraw(); return; }
        if (st.lx != null){ st.a = clamp(st.a + (p.x - st.lx) * 0.01, -1.1, 1.1); st.b = clamp(st.b + (p.y - st.ly) * 0.01, st.bmin, st.bmax); st.lx = p.x; st.ly = p.y; }
      }
      if (type === "up"){ rotating = false; st.lx = null; st.drag = false; }
      if (type === "move") c.cv.style.cursor = Math.hypot(p.x - anaHit.x, p.y - anaHit.y) < anaHit.r * 1.25 ? "grab" : "default";
    });
    var sS = k.select("Solution dans le tube", Object.keys(SOLS).map(function(q){ return [q, SOLS[q].n + (SOLS[q].a ? " ([α] = " + (SOLS[q].a > 0 ? "+" : "−") + S.fmt(Math.abs(SOLS[q].a), 2) + ")" : "")]; }), "sac", function(){ st.auto = null; });
    var lS = k.seg("Longueur du tube l", [["1", "1 dm (10 cm)"], ["2", "2 dm (20 cm)"]], "2");
    var cS = k.slider("Concentration c", 0.01, 0.30, 0.01, 0.20, "g/mL");
    var xS = k.slider("Part de l'énantiomère opposé", 0, 100, 1, 0, "%");
    var thS = k.slider("Angle de l'analyseur θ", -90, 90, 0.1, 0, "°", function(){ st.auto = null; });
    k.button("Chercher l'extinction", function(){ st.auto = {from:thS.value, t:0}; }, true);
    k.button("Analyseur à 0°", function(){ st.auto = null; thS.set(0); });
    var ro = k.readouts(["Angle de l'analyseur θ", "Lumière transmise I/I₀", "α observé (à l'extinction)", "[α] apparent = α/(l·c)", "ee = [α]app / [α]pur"]);
    var nt = k.note("", "ok");
    function alpha(){ var s = SOLS[sS.value], x = xS.value / 100; return s.a * (+lS.value) * cS.value * (1 - 2 * x); }
    st.auto = {from:0, t:-1.2};
    var lp = k.loop(function(dt){
      st.clock += dt;
      if (st.auto){ st.auto.t += dt; var e = ease(st.auto.t / 2.4); thS.set(st.auto.from + (alpha() - st.auto.from) * e); if (st.auto.t >= 2.4) st.auto = null; }
      k.redraw();
    });
    lp.play();

    function circ(C, x, r, n){ var pts = []; for (var i = 0; i < n; i++){ var t = 2 * PI * i / n; pts.push(C.P([x, r * Math.cos(t), r * Math.sin(t)])); } return pts; }
    function hull(pts){
      var p = pts.slice().sort(function(a, b){ return a.x - b.x || a.y - b.y; });
      function cr(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
      var lo = [], up = [], i;
      for (i = 0; i < p.length; i++){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
      for (i = p.length - 1; i >= 0; i--){ while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
      up.pop(); lo.pop(); return lo.concat(up);
    }
    function poly(ctx, pts){ ctx.beginPath(); pts.forEach(function(p, i){ if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); }
    function cylinder(ctx, C, x0, x1, r, c0, c1, alpha){
      var A = circ(C, x0, r, 36), B = circ(C, x1, r, 36), H = hull(A.concat(B));
      var pa = C.P([x0, r, 0]), pb = C.P([x0, -r, 0]);
      var gr = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y); gr.addColorStop(0, c0); gr.addColorStop(0.35, "#ffffff"); gr.addColorStop(0.5, c0); gr.addColorStop(1, c1);
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = gr; poly(ctx, H); ctx.fill(); ctx.restore();
      return {A:A, B:B};
    }
    function box3(ctx, C, x0, x1, y0, y1, z0, z1, col){
      var v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      var F = [[0, 1, 2, 3, -1], [4, 5, 6, 7, 1], [0, 1, 5, 4, -0.6], [3, 2, 6, 7, 0.5], [0, 3, 7, 4, -0.3], [1, 2, 6, 5, 0.2]];
      var P = v.map(function(q){ return C.P(q); });
      F.map(function(f){ return {f:f, z:(P[f[0]].z + P[f[1]].z + P[f[2]].z + P[f[3]].z) / 4}; }).sort(function(a, b){ return a.z - b.z; }).forEach(function(o){
        var f = o.f; ctx.fillStyle = shade(col, f[4] * 0.35); poly(ctx, [P[f[0]], P[f[1]], P[f[2]], P[f[3]]]); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.25)"; ctx.lineWidth = 1; ctx.stroke();
      });
    }
    function disk(ctx, C, x, r, rim, glass){
      var P = circ(C, x, r, 48);
      ctx.save(); ctx.fillStyle = glass; poly(ctx, P); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = rim; ctx.stroke(); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.stroke(); ctx.restore();
      return P;
    }
    function axisLine(ctx, C, x, r, phi, col, w){
      var d = polE(phi), a = C.P(add([x, 0, 0], mul(d, r))), b = C.P(add([x, 0, 0], mul(d, -r)));
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
    }
    function arrow2(ctx, a, b, col, w){
      var dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy); if (l < 3) return;
      var ux = dx / l, uy = dy / l, h = Math.min(8, l * 0.45);
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x - ux * h * 0.6, b.y - uy * h * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - ux * h - uy * h * 0.5, b.y - uy * h + ux * h * 0.5); ctx.lineTo(b.x - ux * h + uy * h * 0.5, b.y - uy * h - ux * h * 0.5); ctx.closePath(); ctx.fill(); ctx.restore();
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, sol = SOLS[sS.value], l = +lS.value, al = alpha(), th = thS.value;
      var I = Math.pow(Math.sin((al - th) * DEG), 2), dlt = ((th - al) % 180 + 270) % 180 - 90, ext = Math.abs(dlt) <= 0.15;
      /* décor : mur et paillasse */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#e9eef5"); bg.addColorStop(1, "#d6dee9"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var C1 = cam(st, 1, 0, 0, 0.03), bx = [1e9, -1e9, 1e9, -1e9];
      [[-6.6, -1.75, -2.2], [6.6, -1.75, -2.2], [6.6, -1.75, 2.2], [-6.6, -1.75, 2.2], [-6.1, 1.0, 0.85], [-6.1, 1.0, -0.85], [2.7, 1.5, 0], [5.6, 0.8, 0], [5.6, -0.8, 0]].forEach(function(q){ var p = C1.P(q); bx[0] = Math.min(bx[0], p.x); bx[1] = Math.max(bx[1], p.x); bx[2] = Math.min(bx[2], p.y); bx[3] = Math.max(bx[3], p.y); });
      var topM = ph ? 84 : 58, botM = 44, scl = Math.min((W - 16) / (bx[1] - bx[0]), (H - topM - botM) / (bx[3] - bx[2]));
      var C = cam(st, scl, W / 2 - scl * (bx[0] + bx[1]) / 2, topM + (H - topM - botM) / 2 - scl * (bx[2] + bx[3]) / 2, 0.03);
      var tb = [[-6.6, -1.75, -2.2], [6.6, -1.75, -2.2], [6.6, -1.75, 2.2], [-6.6, -1.75, 2.2]].map(function(q){ return C.P(q); });
      var tg = ctx.createLinearGradient(0, tb[0].y, 0, tb[2].y); tg.addColorStop(0, "#c8b597"); tg.addColorStop(1, "#a88f6c");
      ctx.fillStyle = tg; poly(ctx, tb); ctx.fill();
      /* rail du banc d'optique */
      box3(ctx, C, -6.2, 4.6, -1.75, -1.45, -0.35, 0.35, "#4b5563");
      [-5.3, -3.7, 2.7, 3.9].forEach(function(x){ box3(ctx, C, x - 0.18, x + 0.18, -1.45, -0.9, -0.18, 0.18, "#6b7280"); });
      /* lampe au sodium */
      box3(ctx, C, -6.1, -4.6, -0.9, 1.0, -0.85, 0.85, "#374151");
      var win = C.P([-4.58, 0, 0]);
      S.draw.glow(c, win.x, win.y, Math.min(W, H) * 0.12, "#ffcc33", 0.75 + 0.08 * Math.sin(st.clock * 7));
      ball(ctx, win.x, win.y, Math.max(6, C.sc * 0.32), "#ffd447");
      /* tube */
      var t0 = l === 2 ? -2.7 : -1.6, t1 = l === 2 ? 1.9 : 0.8, rt = 0.55;
      /* faisceau et vibrations */
      var amp = 0.62, xs, phase = st.clock * 6;
      function Ephi(x){ if (x < -3.7) return null; if (x < t0) return 0; if (x <= t1) return al * DEG * (x - t0) / (t1 - t0); return al * DEG; }
      var bm0 = C.P([-4.6, 0, 0]), bm1 = C.P([2.7, 0, 0]), bm2 = C.P([4.3, 0, 0]);
      ctx.save(); ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255,200,40,.55)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bm0.x, bm0.y); ctx.lineTo(bm1.x, bm1.y); ctx.stroke();
      ctx.strokeStyle = "rgba(255,200,40," + (0.08 + 0.6 * I) + ")"; ctx.beginPath(); ctx.moveTo(bm1.x, bm1.y); ctx.lineTo(bm2.x, bm2.y); ctx.stroke();
      ctx.restore();
      var tubeBack = cylinder(ctx, C, t0, t1, rt, rgba("#9fb6cf", 1), rgba("#5f7896", 1), 0.25);
      for (xs = -4.4; xs <= 4.2; xs += 0.32){
        var ph0 = Math.sin(phase - xs * 2.4), d, o = C.P([xs, 0, 0]);
        if (xs < -3.7){ var rr2 = rng(Math.floor(xs * 100 + 1000) + Math.floor(st.clock * 6) * 7)(); d = polE(rr2 * PI); arrow2(ctx, o, C.P(add([xs, 0, 0], mul(d, amp * ph0))), "#c98a00", 2); continue; }
        if (xs > 2.7){ var tr = Math.sin((al - th) * DEG); d = polE((th + 90) * DEG); if (Math.abs(tr) > 0.03) arrow2(ctx, o, C.P(add([xs, 0, 0], mul(d, amp * tr * ph0))), "#c98a00", 2); continue; }
        d = polE(Ephi(xs)); arrow2(ctx, o, C.P(add([xs, 0, 0], mul(d, amp * ph0))), xs >= t0 && xs <= t1 ? "#b8570f" : "#c98a00", 2);
      }
      /* solution et verre du tube */
      cylinder(ctx, C, t0 + 0.05, t1 - 0.05, rt * 0.86, rgba(sol.col, 1), shade(sol.col, -0.25), 0.42);
      var cap0 = circ(C, t0, rt, 36), cap1 = circ(C, t1, rt, 36);
      ctx.save(); ctx.strokeStyle = "rgba(90,110,135,.8)"; ctx.lineWidth = 2; poly(ctx, cap0); ctx.stroke(); poly(ctx, cap1); ctx.stroke();
      var h = hull(cap0.concat(cap1)); ctx.strokeStyle = "rgba(90,110,135,.55)"; ctx.lineWidth = 1.5; poly(ctx, h); ctx.stroke(); ctx.restore();
      [t0, t1].forEach(function(x){ var q = circ(C, x, rt * 1.08, 36); ctx.save(); ctx.strokeStyle = "#8a6d3b"; ctx.lineWidth = 4; poly(ctx, q); ctx.stroke(); ctx.restore(); });
      /* polariseur */
      disk(ctx, C, -3.7, 0.95, "#3f4a5a", "rgba(120,140,160,.25)");
      axisLine(ctx, C, -3.7, 0.8, 0, "#13233a", 3);
      /* analyseur : couronne graduée */
      var aP = disk(ctx, C, 2.7, 1.1, "#2b3442", "rgba(120,140,160,.22)");
      for (var dg = -90; dg <= 90; dg += 10){ var dd = polE(dg * DEG), p1 = C.P(add([2.7, 0, 0], mul(dd, 1.1))), p2 = C.P(add([2.7, 0, 0], mul(dd, dg % 30 === 0 ? 0.9 : 0.98))); ctx.save(); ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = dg % 30 === 0 ? 2 : 1; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); ctx.restore(); }
      axisLine(ctx, C, 2.7, 0.95, (th + 90) * DEG, "#c0392b", 3.2);
      var pt = C.P(add([2.7, 0, 0], mul(polE(th * DEG), 1.22)));
      ball(ctx, pt.x, pt.y, 6, "#e0574a");
      var axl = C.P(add([2.7, 0, 0], mul(polE((th + 90) * DEG), 1.05))); 
      var ac = C.P([2.7, 0, 0]), ar = Math.abs(C.P([2.7, 1.1, 0]).y - ac.y);
      anaHit = {x:ac.x, y:ac.y, r:ar};
      /* oculaire */
      cylinder(ctx, C, 3.4, 4.3, 0.3, "#4b5563", "#1f2937", 1);
      var oc = circ(C, 4.3, 0.3, 24); ctx.fillStyle = "#111827"; poly(ctx, oc); ctx.fill();
      /* œil de l'observateur */
      var ep = C.P([4.9, 0.05, 0]); drawEye(ctx, ep.x, ep.y, Math.max(10, C.sc * 0.38));
      S.draw.label(c, "axe de l'analyseur", clamp(axl.x + (ph ? 0 : -40), 70, W - 70), axl.y + (ph ? 26 : 30), {color:"#c0392b", size:ph ? 10.5 : 11});
      /* étiquettes */
      var labs = [["lampe Na (589 nm)", [-5.35, -1.75, 1.7]], ["polariseur", [-3.7, 1.25, 0]], ["tube : l = " + l + " dm", [(t0 + t1) / 2, 0.95, 0]], ["analyseur", [2.7, 1.45, 0]]];
      labs.forEach(function(L){ var q = C.P(L[1]); S.draw.label(c, L[0], clamp(q.x, ph ? 52 : 60, W - (ph ? 52 : 60)), q.y, {color:"#2c3a4e", size:ph ? 10.5 : 11.5}); });
      /* vue dans l'oculaire */
      var vr = ph ? 28 : 36, vx = W - vr - 14, vy = vr + 26, f = Math.sqrt(I);
      ctx.save(); ctx.fillStyle = "#0b1220"; ctx.beginPath(); ctx.arc(vx, vy, vr + 5, 0, 7); ctx.fill();
      var vg = ctx.createRadialGradient(vx - vr * 0.3, vy - vr * 0.3, 2, vx, vy, vr); vg.addColorStop(0, "rgba(255,226,120," + f + ")"); vg.addColorStop(1, "rgba(230,170,30," + f + ")");
      ctx.fillStyle = "#05070c"; ctx.beginPath(); ctx.arc(vx, vy, vr, 0, 7); ctx.fill(); ctx.fillStyle = vg; ctx.fill(); ctx.restore();
      S.draw.text(c, "dans l'oculaire", vx - vr - 10, vy, {align:"right", size:11, color:"#2c3a4e"});
      S.draw.text(c, "glisse sur l'analyseur pour le tourner · ailleurs pour la vue", 10, 14, {size:ph ? 10.5 : 11.5, color:"#5f6b7a", align:"left"});
      if (ext) S.draw.label(c, "extinction : α = " + (th >= 0 ? "+" : "−") + S.fmt(Math.abs(th), 1) + "°", W / 2, H - 22, {color:"#1f7a4d", size:ph ? 13 : 15});
      else S.draw.label(c, "θ = " + S.fmt(th, 1) + "° · encore de la lumière : tourne l'analyseur", W / 2, H - 22, {color:"#8a5a00", size:ph ? 11.5 : 13});
      drawCurve(al, th, I);
      var ee = Math.abs(1 - 2 * xS.value / 100);
      function box3x(o, off){ var b = o.el.closest(".ctl"); if (b) b.style.opacity = off ? 0.45 : 1; }
      ro.set(0, (th >= 0 ? "+" : "") + S.fmt(th, 1) + "°");
      ro.set(1, S.fmt(100 * I, 1) + " %");
      ro.set(2, ext ? (th >= 0 ? "+" : "") + S.fmt(th, 1) + "°" : "pas encore");
      ro.set(3, ext && Math.abs(th) > 0.05 ? (th >= 0 ? "+" : "") + S.fmt(th / (l * cS.value), 1) + " °·mL·g⁻¹·dm⁻¹" : ext ? "0 (inactif)" : "—");
      ro.set(4, ext && sol.a ? S.fmt(100 * Math.abs(th / (l * cS.value) / sol.a), 0) + " %" : "—");
      var noEn = sS.value === "inv" || sS.value === "eau"; xS.el.disabled = noEn; if (noEn && xS.value) xS.set(0); box3x(xS, noEn);
      var msg;
      if (sS.value === "inv") msg = "Sucre inverti : mélange de deux composés différents (glucose et fructose), pas de deux énantiomères ; le curseur d'énantiomère opposé est désactivé. [α] = (52,7 − 92,4)/2 ≈ −19,9 : le mélange est lévogyre alors que le saccharose de départ était dextrogyre.";
      else if (sS.value === "eau") msg = "L'eau n'est pas chirale : le plan de vibration ne tourne pas, l'extinction reste à 0°. C'est la mesure du « zéro » de l'appareil.";
      else if (Math.abs(xS.value - 50) < 0.5) msg = "Mélange racémique : les deux énantiomères font tourner le plan d'angles égaux et opposés. α = 0 : le mélange est optiquement inactif, bien qu'il soit fait de molécules chirales.";
      else msg = "Prévu par la loi de Biot : α = [α]·l·c" + (xS.value > 0 ? "·ee" : "") + " = " + (sol.a >= 0 ? "+" : "−") + S.fmt(Math.abs(sol.a), 2) + " × " + l + " × " + S.fmt(cS.value, 2) + (xS.value > 0 ? " × " + S.fmt(ee, 2) : "") + " = " + (al >= 0 ? "+" : "−") + S.fmt(Math.abs(al), 2) + "° (" + (al >= 0 ? "dextrogyre : le plan tourne dans le sens horaire pour l'observateur" : "lévogyre : sens antihoraire pour l'observateur") + ").";
      nt.set(msg + " <i>[α]D à 20 °C dans l'eau, valeurs de cours ; intensité transmise I/I₀ = sin²(θ − α), analyseur croisé à θ = 0°.</i>", "ok");
    });
    function drawEye(ctx, x, y, r){
      ctx.save();
      ctx.fillStyle = "#f6d7bf"; ctx.beginPath(); ctx.ellipse(x + r * 0.9, y, r * 1.6, r * 1.9, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(x + r * 0.2, y, r * 0.75, r * 0.45, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#3b6ec2"; ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, 7); ctx.fill();
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(x - r * 0.04, y, r * 0.14, 0, 7); ctx.fill();
      ctx.strokeStyle = "#5b3a24"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + r * 0.2, y + r * 0.5, r * 0.9, -2.3, -0.9); ctx.stroke();
      ctx.restore();
    }
    function drawCurve(al, th, I){
      var ctx = g.ctx, W = g.W, H = g.H; g.clear(); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      var L = 40, R = 22, T = 26, B = H - 24;
      function X(v){ return L + (v + 90) / 180 * (W - L - R); } function Y(v){ return B - v * (B - T); }
      S.draw.text(g, "Lumière transmise I/I₀ selon l'angle de l'analyseur θ", 10, 12, {size:W < 480 ? 11 : 12, color:"#2c3a4e", align:"left"});
      ctx.save(); ctx.font = "600 10.5px " + FONT; ctx.fillStyle = "#8a95a3"; ctx.textAlign = "center";
      for (var v = -90; v <= 90; v += 30){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), B); ctx.stroke(); ctx.fillText((v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v) + "°", X(v), B + 14); }
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; [0, 0.5, 1].forEach(function(q){ ctx.fillText(S.fmt(q, 1), L - 5, Y(q)); });
      ctx.strokeStyle = "#e0a400"; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var x = -90; x <= 90; x += 1){ var y = Math.pow(Math.sin((al - x) * DEG), 2); if (x === -90) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y)); }
      ctx.stroke(); ctx.restore();
      S.draw.dot(g, X(th), Y(I), 6, "#c0392b");
    }
  }
});

/* ====================================================================== */
/* 4. Sites nucléophile et électrophile : carte de potentiel (L18)         */
/* ====================================================================== */
/* modèle : charges partielles ponctuelles (valeurs de modèle, arrondies, somme nulle) + pseudo-charges pour le doublet de N et le nuage π ;
   surface = surface de van der Waals ; V = 1389,35 · Σ q/r (kJ/mol pour une charge +e, r en Å) */
var VDW = {H:1.10, C:1.70, N:1.55, O:1.52, Cl:1.75, Br:1.85};
var KC = 1389.35, QF = 0.75;   /* QF : les charges écrites ci-dessous sont multipliées par 0,75 (ordre de grandeur des cartes calculées) */
function espMols(){
  var M = {};
  /* propanone */
  (function(){
    var at = [{el:"C", p:[0, 0, 0], q:0.50}, {el:"O", p:[0, 1.21, 0], q:-0.50}, {el:"C", p:[-1.30, -0.75, 0], q:-0.21}, {el:"C", p:[1.30, -0.75, 0], q:-0.21}], bd = [{a:0, b:1, o:2}, {a:0, b:2}, {a:0, b:3}];
    [2, 3].forEach(function(ci){ tetraSlots([nrm(sub(at[0].p, at[ci].p))], [0, 1, 0]).forEach(function(d){ at.push({el:"H", p:add(at[ci].p, mul(d, 1.09)), q:0.07}); bd.push({a:ci, b:at.length - 1}); }); });
    var u = [0, Math.cos(107 * DEG), Math.sin(107 * DEG)];
    M.cetone = {nom:"Propanone (cétone)", at:at, bd:bd, ps:[], dl:[[0, "+"], [1, "−"]], att:add([0, 0, 0], mul(u, 1.70)), nu:"O du C=O (doublets)", el:"C du C=O (δ+)",
      partner:{at:[{el:"O", lab:"HO⁻"}, {el:"H"}], dir:u, site:[0, 0, 0], d0:5.2, d1:2.2, lay:function(P, d){ var o = add(P, mul(d, 0)); return [o, add(o, mul(nrm(add(d, [0, 0.6, 0])), 0.97))]; }},
      arrows:[{from:"p0", to:[0, 0, 0], bend:-30}, {from:[0, 0.6, 0], to:[0, 1.21, 0], bend:-26, mid:true}],
      eq:"HO⁻ + (CH₃)₂C=O  →  (CH₃)₂C(OH)–O⁻", sub:"le nucléophile attaque le carbone δ+ du carbonyle ; les électrons π montent sur l'oxygène"};
  })();
  /* chlorométhane */
  (function(){
    var at = [{el:"C", p:[0, 0, 0], q:0.10}, {el:"Cl", p:[1.78, 0, 0], q:-0.25}], bd = [{a:0, b:1}];
    tetraSlots([[1, 0, 0]], [0, 1, 0]).forEach(function(d){ at.push({el:"H", p:mul(d, 1.09), q:0.05}); bd.push({a:0, b:at.length - 1}); });
    var ctr = [0.6, 0, 0]; at.forEach(function(a){ a.p = sub(a.p, ctr); });
    M.halo = {nom:"Chlorométhane (halogénoalcane)", at:at, bd:bd, ps:[], dl:[[0, "+"], [1, "−"]], att:add(at[0].p, [-1.70, 0, 0]), nu:"Cl (doublets, peu nucléophile)", el:"C lié à Cl (δ+)",
      partner:{at:[{el:"O", lab:"HO⁻"}, {el:"H"}], dir:[-1, 0, 0], site:at[0].p, d0:5.0, d1:2.4, lay:function(P, d){ return [P, add(P, mul(nrm([-0.3, 0.95, 0]), 0.97))]; }},
      arrows:[{from:"p0", to:at[0].p, bend:-30}, {from:"bond01", to:at[1].p, bend:-28}],
      eq:"HO⁻ + CH₃–Cl  →  CH₃–OH + Cl⁻", sub:"attaque du côté opposé au chlore (SN2) : le doublet C–Cl part avec Cl⁻"};
  })();
  /* méthylamine */
  (function(){
    var at = [{el:"N", p:[0, 0, 0], q:-0.37}, {el:"C", p:[-1.47, 0, 0], q:-0.10}], bd = [{a:0, b:1}];
    var sl = tetraSlots([[-1, 0, 0]], [0, -1, 0]);   /* sl[0] vers le haut : doublet libre */
    var lp = sl[0];
    [sl[1], sl[2]].forEach(function(d){ at.push({el:"H", p:mul(d, 1.01), q:0.32}); bd.push({a:0, b:at.length - 1}); });
    tetraSlots([[1, 0, 0]], mul(lp, -1)).forEach(function(d){ at.push({el:"H", p:add(at[1].p, mul(d, 1.09)), q:0.06}); bd.push({a:1, b:at.length - 1}); });
    var ctr = [-0.55, 0.9, 0]; at.forEach(function(a){ a.p = sub(a.p, ctr); });
    var N = at[0].p;
    M.amine = {nom:"Méthylamine (amine)", at:at, bd:bd, dl:[[0, "−"], [2, "+"], [3, "+"]], att:add(N, mul(lp, 1.55)), ps:[{p:add(N, mul(lp, 0.45)), q:-0.35}], lp:add(N, mul(lp, 0.75)), nu:"doublet libre de N", el:"H de N–H (faiblement)",
      partner:{at:[{el:"H"}, {el:"Cl", lab:"Cl"}], dir:lp, site:N, d0:4.2, d1:2.0, lay:function(P, d){ return [P, add(P, mul(d, 1.27))]; }},
      arrows:[{from:"lp", to:"p0", bend:28}, {from:"pbond", to:"p1", bend:26}],
      eq:"CH₃NH₂ + H–Cl  →  CH₃NH₃⁺ + Cl⁻", sub:"ici l'amine est le nucléophile (et la base) : son doublet libre va vers le H δ+ de H–Cl"};
  })();
  /* éthène */
  (function(){
    var at = [{el:"C", p:[-0.667, 0, 0], q:-0.09}, {el:"C", p:[0.667, 0, 0], q:-0.09}], bd = [{a:0, b:1, o:2}];
    [[-1, 1], [-1, -1], [1, 1], [1, -1]].forEach(function(s){ var ci = s[0] < 0 ? 0 : 1; at.push({el:"H", p:add(at[ci].p, mul([s[0] * Math.cos(58.7 * DEG), s[1] * Math.sin(58.7 * DEG), 0], 1.087)), q:0.12}); bd.push({a:ci, b:at.length - 1}); });
    M.alcene = {nom:"Éthène (alcène)", at:at, bd:bd, dl:[], att:[0, 0, 1.70], ps:[{p:[0, 0, 0.75], q:-0.15}, {p:[0, 0, -0.75], q:-0.15}], nu:"nuage π de C=C", el:"aucun (H peu δ+)",
      partner:{at:[{el:"H"}, {el:"Br", lab:"Br"}], dir:[0, 0, 1], site:[0, 0, 0], d0:4.6, d1:2.2, lay:function(P, d){ return [P, add(P, mul(d, 1.41))]; }},
      arrows:[{from:[0, 0, 0.7], to:"p0", bend:-30}, {from:"pbond", to:"p1", bend:-26}],
      eq:"H₂C=CH₂ + H–Br  →  CH₃–CH₂⁺ + Br⁻", sub:"l'alcène est nucléophile : ses électrons π attaquent le H δ+ de H–Br (électrophile)"};
  })();
  /* échantillonnage de la surface (points de Fibonacci sur chaque sphère, hors des autres) : min et max de V */
  Object.keys(M).forEach(function(key){
    var m = M[key], ch = m.at.map(function(a){ return {p:a.p, q:a.q * QF}; }).concat(m.ps.map(function(x){ return {p:x.p, q:x.q * QF}; })), mn = 1e9, mx = -1e9, pmn = null, pmx = null;
    m.ch = ch;
    m.at.forEach(function(a, i){
      var R = VDW[a.el], N = 1500;
      for (var j = 0; j < N; j++){
        var y = 1 - 2 * (j + 0.5) / N, r = Math.sqrt(1 - y * y), t = j * 2.399963229728653;
        var p = add(a.p, mul([r * Math.cos(t), y, r * Math.sin(t)], R)), ok = true;
        for (var q = 0; q < m.at.length && ok; q++) if (q !== i && len(sub(p, m.at[q].p)) < VDW[m.at[q].el] - 1e-9) ok = false;
        if (!ok) continue;
        var V = espAt(ch, p); if (V < mn){ mn = V; pmn = p; } if (V > mx){ mx = V; pmx = p; }
      }
    });
    m.vmin = mn; m.vmax = mx; m.pmin = pmn; m.pmax = pmx; m.vatt = espAt(ch, m.att);
  });
  return M;
}
function espAt(ch, p){ var V = 0; for (var i = 0; i < ch.length; i++){ var d = len(sub(p, ch[i].p)); V += ch[i].q / Math.max(d, 0.3); } return KC * V; }
var ESPM = espMols(), ESP_SCALE = 120;
function espColor(V){
  /* rouge (négatif) → jaune → vert (0) → cyan → bleu (positif) */
  var t = clamp(V / ESP_SCALE, -1, 1), stops = [[-1, [214, 40, 40]], [-0.5, [245, 200, 50]], [0, [70, 190, 90]], [0.5, [60, 190, 220]], [1, [40, 70, 210]]];
  for (var i = 0; i < 4; i++) if (t <= stops[i + 1][0]){ var f = (t - stops[i][0]) / (stops[i + 1][0] - stops[i][0]); return [0, 1, 2].map(function(k){ return stops[i][1][k] + (stops[i + 1][1][k] - stops[i][1][k]) * f; }); }
  return stops[4][1];
}
SFA.sim({
  id:"org-sites-nucleophile-electrophile-3d", ch:"L18", tag:"Réactivité",
  titre:"Sites nucléophile et électrophile : la carte de potentiel en 3D",
  resume:"Une surface colorée enveloppe la molécule : rouge là où les électrons abondent, bleu là où ils manquent. Repère le site nucléophile et le site électrophile d'un carbonyle, d'un halogénoalcane, d'une amine et d'un alcène, puis suis la flèche courbe.",
  but:"Choisis une molécule. La surface de van der Waals est colorée selon le potentiel électrostatique : rouge = riche en électrons (site nucléophile, attire les cations), bleu = pauvre en électrons (site électrophile). Glisse pour la tourner, survole la surface pour lire le potentiel. Regarde ensuite le partenaire arriver et la flèche courbe partir du doublet (site riche) vers le site pauvre.",
  aRetenir:"Un nucléophile (Nu) apporte un doublet : doublet libre (O, N, halogénure, HO⁻) ou électrons π (C=C). Un électrophile (E) accepte un doublet : carbone δ+ lié à un atome plus électronégatif (C=O, C–X) ou H δ+ d'un acide (H–Br, H–Cl). La flèche courbe part toujours du doublet (du nucléophile) et pointe vers l'atome électrophile. C=O : O nucléophile, C électrophile ; C–X : C électrophile, X part en X⁻ ; amine : N nucléophile et basique ; alcène : nuage π nucléophile.",
  piege:"La flèche ne part jamais d'un atome δ+ ni d'une charge positive : elle part des électrons. Ne pas confondre la carte (rouge = potentiel négatif) avec la charge de l'atome entier : le carbone du chlorométhane est δ+ même si toute sa région n'est pas bleu foncé, car ses H et le Cl l'entourent.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.78}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 600 ? 1.05 : 0.78; r0(); }; c.resize();
    var st = {a:0.5, b:0.3, t:0, hover:null};
    dragView(c, st); st.onview = function(){ st.manual = true; };
    c.pointer(function(type, p){ if (type === "move" || type === "drag") st.mouse = p; if (type === "up") st.mouse = p; });
    c.cv.addEventListener("pointerleave", function(){ st.mouse = null; });
    var mS = k.seg("Molécule", [["cetone", "Carbonyle"], ["halo", "Halogénoalcane"], ["amine", "Amine"], ["alcene", "Alcène"]], "cetone", function(){ st.t = 0; });
    var vS = k.seg("Affichage", [["esp", "Carte de potentiel"], ["bb", "Boules et bâtons"]], "esp");
    var oS = k.slider("Opacité de la surface", 30, 100, 1, 82, "%");
    var aT = k.toggle("Montrer l'attaque et la flèche courbe", true, function(){ st.t = 0; });
    var lT = k.toggle("Orbitale π* (LUMO) du C=O", false);
    var spT = k.toggle("Rotation automatique", true);
    var lumoBox = k.ctrl.querySelectorAll(".ctl.tg"); lumoBox = lumoBox[lumoBox.length - 2];
    var ro = k.readouts(["Site nucléophile (riche en e⁻)", "Site électrophile (pauvre en e⁻)", "V le plus négatif (modèle)", "V le plus positif (modèle)", "V au point d'attaque (à 1,7 Å du site)", "V sous la souris"]);
    var nt = k.note("", "ok");
    var off = document.createElement("canvas"), octx = off.getContext("2d"), zb = null, vb = null, bw = 0, bh = 0;
    var lp = k.loop(function(dt){ st.t += dt; if (spT.value && !st.drag && !st.manual) st.a += dt * 0.3; k.redraw(); });
    lp.play();
    function renderESP(m, C, W, H, step){
      bw = Math.ceil(W / step); bh = Math.ceil(H / step);
      if (off.width !== bw || off.height !== bh){ off.width = bw; off.height = bh; }
      var img = octx.createImageData(bw, bh), D = img.data; zb = new Float32Array(bw * bh).fill(-1e9); vb = new Float32Array(bw * bh).fill(NaN);
      var idb = new Int16Array(bw * bh).fill(-1);
      var V = m.at.map(function(a){ return rot3(a.p, st.a, st.b); }), Q = m.ch.map(function(q){ return {p:rot3(q.p, st.a, st.b), q:q.q}; }), sc = C.sc;
      V.forEach(function(v, i){
        var R = VDW[m.at[i].el], px = (C.cx + v[0] * sc) / step, py = (C.cy - v[1] * sc) / step, rp = R * sc / step;
        for (var y = Math.max(0, Math.floor(py - rp)); y <= Math.min(bh - 1, Math.ceil(py + rp)); y++){
          for (var x = Math.max(0, Math.floor(px - rp)); x <= Math.min(bw - 1, Math.ceil(px + rp)); x++){
            var dx = (x + 0.5 - px) / rp * R, dy = -(y + 0.5 - py) / rp * R, d2 = dx * dx + dy * dy;
            if (d2 >= R * R) continue;
            var z = v[2] + Math.sqrt(R * R - d2), o = y * bw + x;
            if (z > zb[o]){ zb[o] = z; idb[o] = i; }
          }
        }
      });
      var L = nrm([-0.45, 0.55, 0.7]);
      for (var o = 0; o < bw * bh; o++){
        var i = idb[o]; if (i < 0) continue;
        var x = o % bw, y = (o - x) / bw, wx = ((x + 0.5) * step - C.cx) / sc, wy = (C.cy - (y + 0.5) * step) / sc, wz = zb[o];
        var v = V[i], R = VDW[m.at[i].el], nn = [(wx - v[0]) / R, (wy - v[1]) / R, (wz - v[2]) / R];
        var pot = 0; for (var q = 0; q < Q.length; q++){ var ex = wx - Q[q].p[0], ey = wy - Q[q].p[1], ez = wz - Q[q].p[2]; pot += Q[q].q / Math.max(0.3, Math.sqrt(ex * ex + ey * ey + ez * ez)); }
        pot *= KC; vb[o] = pot;
        var col = espColor(pot), lam = Math.max(0, dot(nn, L)), hv = nrm(add(L, [0, 0, 1])), sp = Math.pow(Math.max(0, dot(nn, hv)), 28);
        var f = 0.42 + 0.62 * lam;
        D[o * 4] = Math.min(255, col[0] * f + 255 * sp * 0.55); D[o * 4 + 1] = Math.min(255, col[1] * f + 255 * sp * 0.55); D[o * 4 + 2] = Math.min(255, col[2] * f + 255 * sp * 0.55); D[o * 4 + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, m = ESPM[mS.value], esp = vS.value === "esp";
      softBg(ctx, W, H);
      var banH = ph ? 74 : 64, area = H - banH - 34, C = cam(st, Math.min(W, area) * (ph ? 0.14 : 0.13), W / 2, 30 + area * 0.5, 0);
      floorShadow(ctx, W / 2, 30 + area * 0.95, Math.min(W * 0.3, area * 0.45), area * 0.04);
      /* partenaire (nucléophile ou électrophile) qui s'approche, en boucle de 6 s */
      var T = st.t % 6, show = aT.value, pa = m.partner, items = [], parts = [];
      var e = ease(seg01(T, 0.3, 2.6)), fade = 1 - seg01(T, 5.2, 6), dd = pa.d0 + (pa.d1 - pa.d0) * e, P0 = add(pa.site, mul(pa.dir, dd));
      var lay = pa.lay(P0, pa.dir);
      if (show){ pa.at.forEach(function(a, i){ parts.push({el:a.el, p:lay[i], al:fade, lab:a.lab}); }); }
      var atoms = m.at.map(function(a){ return {el:a.el, p:a.p, lab:a.el === "C" || a.el === "H" ? "" : a.el}; }), bonds = m.bd.slice();
      var all = atoms.concat(parts);
      if (show && parts.length === 2) bonds = bonds.concat([{a:atoms.length, b:atoms.length + 1, al:fade}]);
      var op = oS.value / 100;
      if (esp){
        renderMol(ctx, C, all, bonds, []);
        renderESP(m, C, W, H, ph ? 2 : 2);
        ctx.save(); ctx.globalAlpha = op; ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, bw, bh, 0, 0, bw * 2, bh * 2); ctx.restore();
        /* le partenaire reste visible devant la surface */
        if (show) renderMol(ctx, C, parts, parts.length === 2 ? [{a:0, b:1, al:fade}] : [], []);
      } else {
        renderMol(ctx, C, all, bonds, []);
        /* δ+ / δ− */
        m.dl.forEach(function(d){ var p = C.P(m.at[d[0]].p); S.draw.label(c, "δ" + d[1], p.x + 16, p.y - 18, {color:d[1] === "+" ? "#2a56c6" : "#c0392b", size:13}); });
        if (mS.value === "alcene"){ [1, -1].forEach(function(sg){ var p = C.P([0, 0, 1.1 * sg]); S.draw.label(c, "π (δ−)", p.x, p.y, {color:"#c0392b", size:12}); }); }
      }
      lumoBox.style.display = mS.value === "cetone" ? "" : "none";
      if (mS.value === "cetone" && lT.value){
        /* π* = combinaison antiliante des p_z de C et de O : gros lobes sur C, petits sur O, phases opposées */
        var lob = [];
        [[0, 1.0, 0.62, 1], [1, 0.62, 0.42, -1]].forEach(function(L){
          [1, -1].forEach(function(sg){
            var ctr = add(m.at[L[0]].p, [0, 0, sg * L[1]]), colr = sg * L[3] > 0 ? "#4d8af0" : "#e08a1e";
            lob.push({z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, [0, 0, 1], L[1] * 0.95, [1, 0, 0], L[2], [0, 1, 0], L[2], colr, 0.7); }});
          });
        });
        lob.sort(function(x, y){ return x.z - y.z; }).forEach(function(o){ o.f(); });
        var lp0 = C.P(add(m.at[0].p, [0, 0, 2.1])); S.draw.label(c, "π* (LUMO) : gros lobe sur C", lp0.x, lp0.y - 12, {color:"#2a56c6", size:ph ? 11 : 12});
      }
      /* flèches courbes */
      if (show){
        var ap = ease(seg01(T, 2.6, 3.4)) * fade;
        function pt(s){ if (s === "p0") return lay[0]; if (s === "p1") return lay[1]; if (s === "lp") return m.lp; if (s === "pbond") return lerp(lay[0], lay[1], 0.5); if (s === "bond01") return lerp(m.at[0].p, m.at[1].p, 0.5); return s; }
        m.arrows.forEach(function(A){ var a = C.P(pt(A.from)), b = C.P(pt(A.to)); curlyArrow(ctx, a.x, a.y, b.x, b.y, A.bend, "#13233a", false, 2.8, ap); });
      }
      /* survol */
      var hv = null;
      if (esp && st.mouse && vb){ var ix = Math.floor(st.mouse.x / 2), iy = Math.floor(st.mouse.y / 2); if (ix >= 0 && iy >= 0 && ix < bw && iy < bh){ var vv = vb[iy * bw + ix]; if (!isNaN(vv)) hv = vv; } }
      if (hv != null){ S.draw.label(c, "V ≈ " + (hv >= 0 ? "+" : "−") + S.fmt(Math.abs(hv), 0) + " kJ/mol", clamp(st.mouse.x, 70, W - 70), st.mouse.y - 18, {color:"#13233a", size:12}); }
      /* légende de couleurs */
      if (esp){
        var lw = ph ? 120 : 160, lx = W - lw - 14, ly = 14;
        var gr = ctx.createLinearGradient(lx, 0, lx + lw, 0); [-1, -0.5, 0, 0.5, 1].forEach(function(t){ var cc = espColor(t * ESP_SCALE); gr.addColorStop((t + 1) / 2, "rgb(" + cc.map(Math.round).join(",") + ")"); });
        ctx.fillStyle = gr; rr(ctx, lx, ly, lw, 10, 5); ctx.fill();
        S.draw.text(c, "riche en e⁻", lx, ly + 20, {size:10.5, color:"#c0392b", align:"left"});
        S.draw.text(c, "pauvre", lx + lw, ly + 20, {size:10.5, color:"#2a56c6", align:"right"});
      }
      S.draw.text(c, m.nom, 12, 18, {size:ph ? 12 : 13.5, color:"#2c3a4e", align:"left"});
      if (!ph) S.draw.text(c, "glisse pour tourner · survole la surface", 12, 36, {size:11, color:"#8a95a3", align:"left"});
      banner(ctx, W, H - banH - 8, banH, show ? m.eq : m.nom, show ? m.sub : "", mS.value === "amine" || mS.value === "alcene" ? "#c0392b" : "#2a6fdb");
      ro.set(0, m.nu); ro.set(1, m.el);
      ro.set(2, "−" + S.fmt(Math.abs(m.vmin), 0) + " kJ/mol"); ro.set(3, "+" + S.fmt(m.vmax, 0) + " kJ/mol");
      ro.set(4, (m.vatt >= 0 ? "+" : "−") + S.fmt(Math.abs(m.vatt), 0) + " kJ/mol");
      ro.set(5, hv == null ? "survole la surface" : (hv >= 0 ? "+" : "−") + S.fmt(Math.abs(hv), 0) + " kJ/mol");
      var msg = {cetone:"Le C=O est polarisé : O (rouge) porte deux doublets et un excès d'électrons, le carbone en manque, mais il paraît peu coloré : il est caché sous les méthyles (le bleu le plus fort est sur les H des méthyles). Au point d'attaque, à 107° de C=O, le potentiel est positif ; c'est surtout l'orbitale vide π* (LUMO), grosse sur le carbone, qui rend ce carbone électrophile (bouton « Orbitale π* »). Un nucléophile attaque le carbone par-dessus le plan de la molécule (angle ≈ 107° avec C=O), et les électrons π montent sur O.",
        halo:"Le chlore attire les électrons de la liaison C–Cl : la région du Cl est rouge, celle de CH₃ bleue. Le nucléophile vise le carbone δ+ par l'arrière (à 180° du Cl) : c'est la SN2, Cl⁻ est le groupe partant.",
        amine:"Le doublet libre de l'azote crée une zone très rouge au sommet de la molécule : c'est lui qui attaque. Avec un acide (H–Cl), l'amine capte H⁺ (base) ; avec un halogénoalcane, elle substitue X (nucléophile).",
        alcene:"Les électrons π forment deux nuages au-dessus et au-dessous du plan : zones rouges sur les deux faces. L'électrophile (H⁺ de H–Br) arrive perpendiculairement au plan : addition électrophile (chapitre des alcènes)."}[mS.value];
      nt.set(msg + " <i>Carte qualitative : charges partielles d'un modèle simple (somme nulle), potentiel calculé sur la surface de van der Waals ; échelle ± " + ESP_SCALE + " kJ/mol.</i>", "ok");
    });
  }
});

/* ====================================================================== */
/* 5. La triple liaison : propyne, nuages π, H acide, hydratation (c09)    */
/* ====================================================================== */
function hull2(pts){
  var p = pts.slice().sort(function(a, b){ return a.x - b.x || a.y - b.y; });
  function cr(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
  var lo = [], up = [], i;
  for (i = 0; i < p.length; i++){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
  for (i = p.length - 1; i >= 0; i--){ while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
  up.pop(); lo.pop(); return lo.concat(up);
}
/* lobe ellipsoïdal (orbitale) : centre, axes u (demi-longueur a), v (b), w (c) */
function lobe(ctx, C, ctr, u, a, v, b, w, cc, col, alpha){
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
function propyneMol(){
  /* C1 (≡CH terminal), C2 (≡C–), C3 (CH₃) ; C2 à l'origine */
  var at = [{el:"C", p:[-1.20, 0, 0], k:"C1"}, {el:"C", p:[0, 0, 0], k:"C2"}, {el:"C", p:[1.46, 0, 0], k:"C3"}, {el:"H", p:[-2.26, 0, 0], k:"H1"}];
  var bd = [{a:0, b:1, o:3}, {a:1, b:2}, {a:0, b:3}];
  tetraSlots([[-1, 0, 0]], [0, 1, 0]).forEach(function(d){ at.push({el:"H", p:add(at[2].p, mul(d, 1.09))}); bd.push({a:2, b:at.length - 1}); });
  return {at:at, bd:bd};
}
function enolKetone(){
  /* même ordre d'atomes : C1, C2, C3, O, HO, H1a, H1b, H3a, H3b, H3c */
  function pol(r, deg){ return [r * Math.cos(deg * DEG), r * Math.sin(deg * DEG), 0]; }
  var C2 = [0, 0, 0], C1e = pol(1.34, 210), C3e = pol(1.50, 330), Oe = [0, 1.36, 0];
  var hoDir = [-Math.sin(109 * DEG), -Math.cos(109 * DEG) * -1, 0];   /* O–H dans le plan, côté C1 */
  hoDir = nrm([-0.9455, 0.3256, 0]);
  var en = [C1e, C2, C3e, Oe, add(Oe, mul(hoDir, 0.97)), add(C1e, mul(pol(1, 150), 1.08)), add(C1e, mul(pol(1, -90), 1.08))];
  var m3 = tetraSlots([nrm(sub(C2, C3e))], [0, 1, 0]); m3.forEach(function(d){ en.push(add(C3e, mul(d, 1.09))); });
  var C1k = pol(1.51, 210), C3k = pol(1.51, 330), Ok = [0, 1.22, 0];
  var s1 = tetraSlots([nrm(sub(C2, C1k))], [0, 0, 1]);
  /* attribue les 3 positions de C1 (cétone) : les deux H existants vont aux places les plus proches, le H venu de O à la dernière */
  var used = [], pick = function(h){ var best = -1, bd = 1e9; s1.forEach(function(d, i){ if (used.indexOf(i) >= 0) return; var q = add(C1k, mul(d, 1.09)), dd = len(sub(q, h)); if (dd < bd){ bd = dd; best = i; } }); used.push(best); return add(C1k, mul(s1[best], 1.09)); };
  var h1a = pick(en[5]), h1b = pick(en[6]), hOk = add(C1k, mul(s1[[0, 1, 2].filter(function(i){ return used.indexOf(i) < 0; })[0]], 1.09));
  var ke = [C1k, C2, C3k, Ok, hOk, h1a, h1b];
  var m3k = tetraSlots([nrm(sub(C2, C3k))], [0, 1, 0]); m3k.forEach(function(d){ ke.push(add(C3k, mul(d, 1.09))); });
  var els = ["C", "C", "C", "O", "H", "H", "H", "H", "H", "H"];
  return {els:els, en:en, ke:ke};
}
var PYN = propyneMol(), EK = enolKetone();
var PKA = {HO:{n:"HO⁻", acide:"H₂O", pk:15.7}, NH2:{n:"NH₂⁻", acide:"NH₃", pk:35}}, PKA_YNE = 25;
SFA.sim({
  id:"org-alcynes-3d", ch:"c09", tag:"Alcynes",
  titre:"La triple liaison : le propyne en 3D, son H acide et son hydratation",
  resume:"Tourne le propyne et vois ses deux nuages π perpendiculaires autour de l'axe C≡C. Arrache le H terminal avec la bonne base, puis hydrate la triple liaison : l'énol formé se réarrange aussitôt en propanone.",
  but:"Trois étapes. (1) La triple liaison : choisis le nuage π à afficher et tourne la molécule. (2) Le proton acide : choisis la base (HO⁻ ou NH₂⁻) et regarde si elle arrache le H terminal ; compare les pKa. (3) L'hydratation (H₂O, H₂SO₄, HgSO₄) : l'eau s'additionne selon Markovnikov et donne un énol, qui se transforme en cétone (tautomérie céto-énolique).",
  aRetenir:"Dans C≡C, les deux carbones sont sp (angle 180°) : une liaison σ (recouvrement sp–sp) et deux liaisons π perpendiculaires, qui forment ensemble un manchon d'électrons autour de l'axe. C≡C est plus courte (120 pm) et plus forte (≈ 839 kJ/mol) que C=C (134 pm, 614) et C–C (154 pm, 347). Le H d'un alcyne terminal est acide (pKa ≈ 25) : l'orbitale sp (50 % de caractère s) tient le doublet près du noyau. Une base dont l'acide conjugué a un pKa plus grand que 25 (NH₂⁻, pKa NH₃ ≈ 35) l'arrache ; HO⁻ (pKa H₂O = 15,7) non. Hydratation (Hg²⁺, H⁺) : Markovnikov, énol, puis cétone : le propyne donne la propanone.",
  piege:"L'énol n'est pas le produit isolé : il se tautomérise en cétone, beaucoup plus stable (C=O plus forte que C=C). La tautomérie n'est pas une mésomérie : un H change de place. Et la triple liaison n'est pas « trois fois une simple » : 839 kJ/mol < 3 × 347 kJ/mol, car les liaisons π sont plus faibles que σ.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.74}), r0 = c.resize;
    c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 600 ? 1.02 : 0.74; r0(); }; c.resize();
    var g = k.canvas(150);
    var st = {a:0.22, b:0.3, t:0};
    dragView(c, st); st.onview = function(){ st.manual = true; };
    var eS = k.seg("Étape", [["tri", "1 · Triple liaison"], ["acide", "2 · H acide"], ["hyd", "3 · Hydratation"]], "tri", function(){ st.t = 0; });
    var pS = k.seg("Nuages π", [["y", "π (vertical)"], ["z", "π (horizontal)"], ["yz", "Les deux"], ["0", "Aucun"]], "yz");
    var bS = k.seg("Base", [["HO", "HO⁻ (soude)"], ["NH2", "NH₂⁻ (amidure de sodium)"]], "NH2", function(){ st.t = 0; });
    var spT = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["a", "b", "c", "d"]), smalls = ro.el.querySelectorAll("small");
    function labs(L){ L.forEach(function(t, i){ if (smalls[i].textContent !== t) smalls[i].textContent = t; }); }
    var nt = k.note("", "ok");
    function box(o){ return o.el ? o.el.closest(".ctl") : null; }
    var segs = Array.prototype.slice.call(k.ctrl.querySelectorAll(".ctl")).filter(function(d){ return d.querySelector(".seg"); });
    var lp = k.loop(function(dt){ st.t += dt; if (spT.value && !st.drag && !st.manual) st.a += dt * 0.3; k.redraw(); });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, E = eS.value;
      segs[1].style.display = E === "tri" ? "" : "none"; segs[2].style.display = E === "acide" ? "" : "none";
      softBg(ctx, W, H);
      var banH = ph ? 74 : 64, area = H - banH - 34, C = cam(st, Math.min(W, area) * (E === "acide" ? (ph ? 0.15 : 0.16) : (ph ? 0.19 : 0.2)), W / 2, 30 + area * 0.5);
      floorShadow(ctx, W / 2, 30 + area * 0.95, Math.min(W * 0.32, area * 0.5), area * 0.04);
      var at = [], bd = [], extra = [], arrows = [], eq = "", sub2 = "", col = "#2a6fdb";
      if (E === "tri" || E === "acide"){
        PYN.at.forEach(function(a){ at.push({el:a.el, p:a.p.slice()}); }); PYN.bd.forEach(function(b){ bd.push({a:b.a, b:b.b, o:b.o}); });
      }
      if (E === "tri"){
        var pul = 1 + 0.04 * Math.sin(st.t * 3), mid = [-0.6, 0, 0];
        if (pS.value !== "0"){
          [["y", [0, 1, 0], [0, 0, 1], "#4d8af0"], ["z", [0, 0, 1], [0, 1, 0], "#3fb27f"]].forEach(function(L){
            if (pS.value.indexOf(L[0]) < 0) return;
            [1, -1].forEach(function(sg){
              var ctr = add(mid, mul(L[1], 0.78 * sg));
              extra.push({z:C.P(ctr).z, f:function(){ lobe(ctx, C, ctr, [1, 0, 0], 1.25 * pul, L[1], 0.55 * pul, L[2], 0.42 * pul, L[3], 0.5); }});
            });
          });
        }
        eq = "CH≡C–CH₃ : propyne"; sub2 = "C≡C = 1 liaison σ (sp–sp) + 2 liaisons π perpendiculaires (p–p)";
        labs(["Hybridation des C de C≡C", "Angle H–C≡C et C≡C–C", "Longueur C≡C", "Composition de C≡C"]);
        ro.set(0, "sp (50 % s)"); ro.set(1, "180°"); ro.set(2, "120 pm"); ro.set(3, "1 σ + 2 π");
        nt.set("Chaque carbone de C≡C n'utilise qu'une orbitale p dans l'hybride (sp) : il lui reste deux orbitales p, perpendiculaires entre elles. Elles se recouvrent deux à deux : un nuage π dans le plan vertical, un autre dans le plan horizontal. Ensemble, ils forment un manchon cylindrique autour de l'axe : affiche « Les deux » et tourne la molécule.", "ok");
        drawChart("tri");
      } else if (E === "acide"){
        var B = PKA[bS.value], T = st.t % 7, ok = B.pk > PKA_YNE, come = ease(seg01(T, 0.2, 2.4)), tr = ease(seg01(T, 2.6, 3.4)), back = ease(seg01(T, 4.2, 6.2)), fade = 1 - seg01(T, 6.4, 7);
        var dir = [-1, 0, 0], Hp = PYN.at[3].p, dB = 4.6 - 2.15 * come + (ok ? 2.4 * back : 2.4 * back), hpos;
        var Bp = add(Hp, mul(dir, dB - (ok ? 0 : 0)));
        if (ok){ hpos = T < 2.6 ? Hp : lerp(Hp, add(Bp, mul(dir, -1.01)), tr); if (T > 3.4) hpos = add(Bp, mul(dir, -1.01)); }
        else { var wob = Math.sin(seg01(T, 2.6, 4.0) * PI) * 0.35; hpos = add(Hp, mul(dir, wob)); }
        at[3].p = hpos;
        var bi = at.length; at.push({el:bS.value === "HO" ? "O" : "N", p:Bp, lab:B.n, al:fade});
        var bh = bS.value === "HO" ? [[-0.35, 0.94, 0]] : [[-0.33, 0.47, 0.82], [-0.33, 0.47, -0.82]];
        bh.forEach(function(d){ at.push({el:"H", p:add(Bp, mul(nrm(d), 1.01)), al:fade}); bd.push({a:bi, b:at.length - 1}); });
        var gone = ok && T > 3.0;
        if (gone){ bd = bd.filter(function(b){ return !(b.a === 0 && b.b === 3); }); bd.push({a:bi, b:3, dash:T < 3.4}); }
        else if (T > 2.4 && T < 4.0) bd.push({a:bi, b:3, dash:true, al:0.8});
        at[3].al = gone ? fade : 1;
        if (gone){ var lpc = add(PYN.at[0].p, [-0.75, 0, 0]); extra.push({z:C.P(lpc).z, f:function(){ lobe(ctx, C, lpc, [1, 0, 0], 0.62, [0, 1, 0], 0.4, [0, 0, 1], 0.4, "#f2a33a", 0.75); var q = C.P(lpc); S.draw.label(c, "doublet sp", q.x, q.y - 28, {color:"#b86b00", size:11.5}); }}); }
        if (T > 1.8 && T < 3.6){ var ap = ease(seg01(T, 1.8, 2.5)); arrows.push({from:add(Bp, [0.3, 0.25, 0]), to:lerp(Hp, Bp, 0.35), bend:-24, prog:ap}); arrows.push({from:lerp(PYN.at[0].p, Hp, 0.5), to:add(PYN.at[0].p, [-0.2, -0.3, 0]), bend:-22, prog:ap}); }
        var K = Math.pow(10, B.pk - PKA_YNE);
        eq = "CH₃–C≡C–H + " + B.n + (ok ? "  →  " : "  ⇄  ") + "CH₃–C≡C⁻ + " + B.acide;
        sub2 = ok ? "K = 10^(" + S.fmt(B.pk, 1) + " − 25) = 10¹⁰ : la base arrache le H, il se forme un ion propynure" : "K = 10^(15,7 − 25) ≈ 5·10⁻¹⁰ : l'équilibre reste à gauche, HO⁻ ne déprotone pas l'alcyne";
        col = ok ? "#1f7a4d" : "#c0392b";
        labs(["pKa du propyne (H terminal)", "pKa de " + B.acide + " (acide conjugué de " + B.n + ")", "K = 10^(pKa(" + B.acide + ") − pKa(alcyne))", "Réaction ?"]);
        ro.set(0, "≈ 25"); ro.set(1, (B.pk === 35 ? "≈ " : "") + S.fmt(B.pk, 1)); ro.set(2, ok ? "10¹⁰" : "≈ 5,0·10⁻¹⁰"); ro.set(3, ok ? "oui, totale" : "non (négligeable)");
        nt.set("Une base B⁻ arrache un proton si son acide conjugué BH est plus faible que l'acide de départ, c'est-à-dire si pKa(BH) > pKa(alcyne). Le H terminal (C sp, 50 % s) est bien plus acide que celui d'un alcène (pKa ≈ 44) ou d'un alcane (≈ 50), mais beaucoup moins que l'eau. pKa(H₂O) = 15,7 suit la convention de la chimie organique (H₂O traitée comme un acide dissous à 55,5 mol/L) ; en chimie générale, on écrit souvent 14. <i>pKa de cours (ordres de grandeur ; selon les sources, NH₃ : 35 à 38).</i>", ok ? "ok" : "warn");
        drawChart("acide", B);
      } else {
        /* hydratation : propyne + H₂O → énol (fondu) → cétone (tautomérie) ; boucle de 11 s */
        var T2 = st.t % 11, x1 = ease(seg01(T2, 2.2, 3.4)), m = ease(seg01(T2, 5.6, 7.4)), phase;
        if (T2 < 2.2){
          var w = ease(seg01(T2, 0, 2.0));
          PYN.at.forEach(function(a){ at.push({el:a.el, p:a.p.slice()}); }); PYN.bd.forEach(function(b){ bd.push({a:b.a, b:b.b, o:b.o}); });
          var Ow = add([0, 3.4 - 1.5 * w, 0], [0, 0, 0]), oi = at.length; at.push({el:"O", p:Ow});
          [[-0.79, 0.61, 0], [0.79, 0.61, 0]].forEach(function(d){ at.push({el:"H", p:add(Ow, mul(d, 0.96))}); bd.push({a:oi, b:at.length - 1}); });
          phase = 0;
        } else if (T2 < 3.4){
          PYN.at.forEach(function(a){ at.push({el:a.el, p:a.p.slice(), al:1 - x1}); }); PYN.bd.forEach(function(b){ bd.push({a:b.a, b:b.b, o:b.o}); });
          var n0 = at.length; EK.en.forEach(function(p, i){ at.push({el:EK.els[i], p:p, al:x1}); });
          enolBonds(n0, 0).forEach(function(b){ bd.push(b); });
          phase = 1;
        } else {
          var n1 = at.length, hop = Math.sin(m * PI) * 1.3;
          EK.en.forEach(function(p, i){ var q = lerp(p, EK.ke[i], m); if (i === 4) q = add(q, [0, 0, hop]); at.push({el:EK.els[i], p:q}); });
          enolBonds(n1, m).forEach(function(b){ bd.push(b); });
          if (T2 > 4.6 && T2 < 7.6){
            var ap2 = ease(seg01(T2, 4.6, 5.4)), A = at;
            arrows.push({from:lerp(A[n1 + 3].p, A[n1 + 1].p, 0.2).map(function(v, j){ return v + [0.25, 0.1, 0][j]; }), to:lerp(A[n1 + 3].p, A[n1 + 1].p, 0.5), bend:26, prog:ap2});
            arrows.push({from:lerp(A[n1].p, A[n1 + 1].p, 0.5), to:A[n1].p.map(function(v, j){ return v + [-0.1, 0.25, 0.75][j]; }), bend:-26, prog:ap2});
          }
          phase = m < 0.02 ? 2 : m > 0.98 ? 4 : 3;
        }
        eq = ["CH₃–C≡CH + H₂O  (H₂SO₄, HgSO₄)", "addition de Markovnikov : OH sur le C le plus substitué", "énol : CH₂=C(OH)–CH₃", "tautomérie céto-énolique", "propanone : CH₃–CO–CH₃"][phase];
        sub2 = ["l'eau s'additionne sur la triple liaison", "H va sur le carbone terminal (CH), OH sur le carbone central", "prop-1-én-2-ol, instable : il ne s'accumule pas", "un H passe de O à C, C=C devient C–C et C–O devient C=O", "la cétone est le produit isolé (K = [énol]/[cétone] ≈ 5·10⁻⁹)"][phase];
        col = phase >= 3 ? "#1f7a4d" : "#2a6fdb";
        labs(["Réactif", "Intermédiaire", "Produit isolé", "K = [énol]/[cétone]"]);
        ro.set(0, "propyne + H₂O"); ro.set(1, "énol (prop-1-én-2-ol)"); ro.set(2, "propanone"); ro.set(3, "≈ 5·10⁻⁹");
        nt.set("L'hydratation d'un alcyne (catalysée par H⁺ et Hg²⁺) suit Markovnikov et donne un énol (OH sur un C de C=C). L'énol se réarrange en cétone : c'est un équilibre de tautomérie, presque entièrement du côté de la cétone (une molécule d'énol pour ≈ 200 millions de propanone dans l'eau). <i>En solution, le H passe par le solvant (catalyse acide) ; l'animation montre seulement le bilan. K : ordre de grandeur de la littérature (pK ≈ 8,3).</i>", "ok");
        drawChart("hyd");
      }
      renderMol(ctx, C, at, bd, extra);
      arrows.forEach(function(A){ var p = C.P(A.from), q = C.P(A.to); curlyArrow(ctx, p.x, p.y, q.x, q.y, A.bend, "#13233a", false, 2.6, A.prog); });
      if (E === "tri"){
        var la = C.P([-0.6, 1.6, 0]), lb = C.P([-0.6, 0, 1.6]), sp1 = C.P(PYN.at[0].p), sp2 = C.P(PYN.at[1].p);
        if (pS.value.indexOf("y") >= 0) S.draw.label(c, "π", la.x, la.y, {color:"#2a56c6", size:14});
        if (pS.value.indexOf("z") >= 0) S.draw.label(c, "π", lb.x, lb.y, {color:"#1f7a4d", size:14});
        S.draw.label(c, "sp", sp1.x, sp1.y + 24, {color:"#5f6b7a", size:11}); S.draw.label(c, "sp", sp2.x, sp2.y + 24, {color:"#5f6b7a", size:11});
      }
      S.draw.text(c, {tri:"La triple liaison C≡C", acide:"Le proton acide de l'alcyne terminal", hyd:"Hydratation et tautomérie"}[E], 12, 18, {size:ph ? 12 : 13.5, color:"#2c3a4e", align:"left"});
      if (!ph) S.draw.text(c, "glisse pour tourner", W - 12, 18, {size:11, color:"#8a95a3", align:"right"});
      banner(ctx, W, H - banH - 8, banH, eq, sub2, col);
    });
    function enolBonds(n, m){
      /* indices : 0 C1, 1 C2, 2 C3, 3 O, 4 HO, 5-6 H1, 7-9 H3 */
      var L = [{a:n, b:n + 1, o:m < 0.5 ? 2 : 1, dash:m > 0.2 && m < 0.8}, {a:n + 1, b:n + 2}, {a:n + 1, b:n + 3, o:m < 0.5 ? 1 : 2, dash:m > 0.2 && m < 0.8},
        {a:n + 5, b:n}, {a:n + 6, b:n}, {a:n + 7, b:n + 2}, {a:n + 8, b:n + 2}, {a:n + 9, b:n + 2}];
      if (m < 0.6) L.push({a:n + 3, b:n + 4, dash:m > 0.2, al:1 - seg01(m, 0.4, 0.6)});
      if (m > 0.4) L.push({a:n, b:n + 4, dash:m < 0.8, al:seg01(m, 0.4, 0.6)});
      return L;
    }
    function drawChart(E, B){
      var ctx = g.ctx, W = g.W, H = g.H, ph = W < 480; g.clear(); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      if (E === "tri"){
        S.draw.text(g, "Énergie moyenne de liaison (kJ/mol) et longueur", 10, 13, {size:12, color:"#2c3a4e", align:"left"});
        var rows = [["C–C", 347, 154, "#9aa8bb"], ["C=C", 614, 134, "#5f8fd8"], ["C≡C", 839, 120, "#2a56c6"]], X0 = 52, X1 = W - (ph ? 132 : 150);
        rows.forEach(function(r, i){
          var y = 30 + i * 38, w = r[1] / 900 * (X1 - X0);
          var gr = ctx.createLinearGradient(0, y, 0, y + 24); gr.addColorStop(0, shade(r[3], 0.3)); gr.addColorStop(1, r[3]);
          ctx.fillStyle = gr; rr(ctx, X0, y, w, 24, 5); ctx.fill();
          txt(ctx, r[0], X0 - 8, y + 12, 13, "#13233a", "right", 800);
          txt(ctx, r[1] + " kJ/mol · " + r[2] + " pm", X0 + w + 6, y + 12, ph ? 10.5 : 11.5, "#2c3a4e", "left", 700);
        });
      } else if (E === "acide"){
        S.draw.text(g, "Échelle des pKa (plus à gauche = plus acide)", 10, 13, {size:12, color:"#2c3a4e", align:"left"});
        var L = 20, R = W - 20, y0 = 78; function X(v){ return L + v / 52 * (R - L); }
        var gr2 = ctx.createLinearGradient(L, 0, R, 0); gr2.addColorStop(0, "#e0574a"); gr2.addColorStop(1, "#4d8af0");
        ctx.fillStyle = gr2; rr(ctx, L, y0 - 4, R - L, 8, 4); ctx.fill();
        var marks = [["H₂O", 15.7, -1], ["alcyne", 25, 1], ["NH₃", 35, -1], ["alcène", 44, 1], ["alcane", 50, -1]];
        marks.forEach(function(mk){
          var x = X(mk[1]), up = mk[2] < 0, on = (mk[0] === "alcyne") || (B && mk[0] === B.acide);
          ctx.fillStyle = on ? "#13233a" : "#8a95a3"; ctx.beginPath(); ctx.arc(x, y0, on ? 6 : 4.5, 0, 7); ctx.fill();
          txt(ctx, mk[0], x, up ? y0 - 22 : y0 + 22, ph ? 10.5 : 11.5, on ? "#13233a" : "#5f6b7a", "center", on ? 800 : 700);
          txt(ctx, S.fmt(mk[1], 1), x, up ? y0 - 38 : y0 + 37, 10.5, "#8a95a3", "center", 700);
        });
        if (B){ var xa = X(PKA_YNE), xb = X(B.pk); ctx.save(); ctx.strokeStyle = B.pk > PKA_YNE ? "#1f7a4d" : "#c0392b"; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(xa, y0 + 50); ctx.lineTo(xb, y0 + 50); ctx.stroke(); ctx.restore(); txt(ctx, "Δ pKa = " + S.fmt(B.pk - PKA_YNE, 1), (xa + xb) / 2, y0 + 62, 11, B.pk > PKA_YNE ? "#1f7a4d" : "#c0392b", "center", 800); }
      } else {
        S.draw.text(g, "Énergie libre (schéma) : énol et cétone", 10, 13, {size:12, color:"#2c3a4e", align:"left"});
        var yk = H - 28, ye = 40, xl = W * 0.2, xr = W * 0.62, wd = W * 0.18;
        ctx.save(); ctx.lineWidth = 4; ctx.lineCap = "round";
        ctx.strokeStyle = "#e08a1e"; ctx.beginPath(); ctx.moveTo(xl, ye); ctx.lineTo(xl + wd, ye); ctx.stroke();
        ctx.strokeStyle = "#2a56c6"; ctx.beginPath(); ctx.moveTo(xr, yk); ctx.lineTo(xr + wd, yk); ctx.stroke();
        ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.strokeStyle = "#8a95a3"; ctx.beginPath(); ctx.moveTo(xl + wd, ye); ctx.lineTo(xr, yk); ctx.stroke(); ctx.restore();
        txt(ctx, "énol", xl + wd / 2, ye + 14, 12, "#b86b00", "center", 800);
        txt(ctx, "cétone", xr + wd / 2, yk - 12, 12, "#2a56c6", "center", 800);
        ctx.save(); ctx.strokeStyle = "#13233a"; ctx.fillStyle = "#13233a"; ctx.lineWidth = 2; var xa = xl + wd + (xr - xl - wd) * 0.5 - (ph ? 34 : 50);
        ctx.beginPath(); ctx.moveTo(xa, ye + 4); ctx.lineTo(xa, yk - 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xa, yk); ctx.lineTo(xa - 5, yk - 9); ctx.lineTo(xa + 5, yk - 9); ctx.closePath(); ctx.fill(); ctx.restore();
        txt(ctx, "47 kJ/mol", xa - 8, (ye + yk) / 2, ph ? 12 : 13, "#13233a", "right", 800);
        txt(ctx, "énol → cétone : ΔG° = −RT·ln(1/K) ≈ −47 kJ/mol", W / 2, H - 8, ph ? 10 : 11, "#2c3a4e", "center", 700);
      }
    }
  }
});

})();
