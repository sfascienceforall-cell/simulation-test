/* Chimie BA1 · lot P2-CB (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-sigma-pi-3d · ch-london-dipoles · ch-eau-ponts-h-3d · ch-solubilite-alcools */
(function(){
var PI = Math.PI;

/* ---------- petite algèbre 3D (préfixe cb) ---------- */
function vadd(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function vsub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function vmul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function vdot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vcross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function vlen(a){ return Math.sqrt(vdot(a, a)); }
function vnrm(a){ var l = vlen(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function perpBasis(d){
  var t = Math.abs(d[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = vnrm(vcross(d, t)), e2 = vcross(d, e1);
  return [e1, e2];
}
/* rotation d'un vecteur autour d'un axe unitaire (Rodrigues) */
function vrot(v, k, ang){
  var c = Math.cos(ang), s = Math.sin(ang);
  return vadd(vadd(vmul(v, c), vmul(vcross(k, v), s)), vmul(k, vdot(k, v) * (1 - c)));
}

/* ---------- aides de dessin ---------- */
function cbShade(hex, f){
  var n = parseInt(String(hex).replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function cbRgba(hex, a){ var n = parseInt(String(hex).replace("#", ""), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function cbBall(ctx, x, y, r, hex, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, cbShade(hex, 0.8)); g.addColorStop(0.45, hex); g.addColorStop(1, cbShade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, 7); ctx.fill(); ctx.restore();
}
function cbRR(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function cbFmt(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
function cbFont(w, s){ return w + " " + Math.round(s) + "px Mulish, system-ui, sans-serif"; }
function cbText(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = cbFont(o.w || 700, o.size || 12); ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.halo){ ctx.lineJoin = "round"; ctx.lineWidth = 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.fillText(s, x, y); ctx.restore();
}
/* pastille de texte (fond arrondi) ; renvoie sa largeur */
function cbTag(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = cbFont(o.w || 800, o.size || 11.5);
  var w = ctx.measureText(s).width + 14, h = (o.size || 11.5) + 10, al = o.align || "center";
  var x0 = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  cbRR(ctx, x0, y - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "rgba(255,255,255,.92)"; ctx.fill();
  if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x0 + w / 2, y + 0.5);
  ctx.restore(); return w;
}
function cbArrow(ctx, x1, y1, x2, y2, col, w){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
  var a = Math.atan2(dy, dx), h = Math.min(7 + w * 1.6, L * 0.6);
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
  ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill(); ctx.restore();
}
function cbGlow(ctx, x, y, r, rgb, a){
  if (a <= 0.003 || r <= 0.5) return;
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, "rgba(" + rgb + "," + a + ")"); g.addColorStop(0.55, "rgba(" + rgb + "," + (a * 0.45) + ")"); g.addColorStop(1, "rgba(" + rgb + ",0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
/* canevas dont la hauteur suit la largeur (plus haut sur téléphone) */
function cbCanvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
/* canevas de hauteur fixe, différente sur téléphone */
function cbCanvasH(k, hDesk, hPhone){
  var c = k.canvas(hDesk), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = (w < 480 ? hPhone : hDesk) / Math.max(260, w); r0(); };
  c.resize(); return c;
}
function cbLastCtl(k){ return k.ctrl.lastElementChild; }

/* ---------- projection 3D (vue tournante) ---------- */
function cbView(a, b){ return {a:a, b:b, cx:0, cy:0, sc:1, per:0.05}; }
function cbPrj(V, p){
  var ca = Math.cos(V.a), sa = Math.sin(V.a), cb = Math.cos(V.b), sb = Math.sin(V.b);
  var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1];
  var y2 = y * cb - z * sb, z2 = y * sb + z * cb, s = 1 / (1 - z2 * V.per);
  return [V.cx + x * V.sc * s, V.cy - y2 * V.sc * s, z2, x, y2, s];
}
var CB_LIGHT = vnrm([-0.45, 0.62, 0.65]);
/* surface de révolution (lobe) : origine O, direction d, longueur L, largeur W ; profil r(u) = W·sin(π·u^1,4)^0,8 */
function cbLobe(O, d, L, W, nU, nV){
  var B = perpBasis(d), rings = [];
  for (var i = 0; i <= nU; i++){
    var u = i / nU, r = W * Math.pow(Math.max(0, Math.sin(PI * Math.pow(u, 1.4))), 0.8), ring = [];
    for (var j = 0; j < nV; j++){
      var th = j / nV * 2 * PI;
      ring.push(vadd(vadd(O, vmul(d, u * L)), vadd(vmul(B[0], r * Math.cos(th)), vmul(B[1], r * Math.sin(th)))));
    }
    rings.push(ring);
  }
  return rings;
}
/* ellipsoïde : centre C, axes (unitaires) e0, e1, e2 et demi-axes r0, r1, r2 */
function cbEllipsoid(C, e0, e1, e2, r0, r1, r2, nU, nV){
  var rings = [];
  for (var i = 0; i <= nU; i++){
    var t = i / nU * PI, ring = [], ct = Math.cos(t), st = Math.sin(t);
    for (var j = 0; j < nV; j++){
      var ph = j / nV * 2 * PI;
      ring.push(vadd(C, vadd(vmul(e0, r0 * ct), vadd(vmul(e1, r1 * st * Math.cos(ph)), vmul(e2, r2 * st * Math.sin(ph))))));
    }
    rings.push(ring);
  }
  return rings;
}
/* ajoute les facettes d'une surface à la liste de dessin (tri par profondeur ensuite) */
function cbAddMesh(V, list, rings, hex, alpha){
  var pr = rings.map(function(r){ return r.map(function(p){ return cbPrj(V, p); }); }), nV = rings[0].length;
  for (var i = 0; i < pr.length - 1; i++) for (var j = 0; j < nV; j++){
    var j2 = (j + 1) % nV, a = pr[i][j], b = pr[i + 1][j], c = pr[i + 1][j2], d = pr[i][j2];
    var ux = c[3] - a[3], uy = c[4] - a[4], uz = c[2] - a[2], vx = d[3] - b[3], vy = d[4] - b[4], vz = d[2] - b[2];
    var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz);
    if (nl < 1e-12) continue;
    var lam = Math.abs((nx * CB_LIGHT[0] + ny * CB_LIGHT[1] + nz * CB_LIGHT[2]) / nl);
    list.push({z:(a[2] + b[2] + c[2] + d[2]) / 4, q:[a, b, c, d], col:hex, sh:0.3 + 0.7 * lam, sp:Math.pow(lam, 22) * 0.6, al:alpha});
  }
}
function cbPaint(ctx, list){
  list.sort(function(a, b){ return a.z - b.z; });
  list.forEach(function(it){
    if (it.f){ it.f(); return; }
    var col = cbShade(it.col, -(1 - it.sh) * 0.72);
    if (it.sp > 0.03) col = cbShade(it.col, Math.min(0.85, it.sp + 0.12));
    ctx.globalAlpha = it.al; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(it.q[0][0], it.q[0][1]); ctx.lineTo(it.q[1][0], it.q[1][1]); ctx.lineTo(it.q[2][0], it.q[2][1]); ctx.lineTo(it.q[3][0], it.q[3][1]); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1;
  });
}
/* bâton 3D (liaison) entre deux points projetés */
function cbStick(ctx, p, q, w, hex){
  ctx.save(); ctx.lineCap = "round";
  ctx.strokeStyle = cbShade(hex, -0.45); ctx.lineWidth = w + 2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
  ctx.strokeStyle = hex; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = Math.max(1, w * 0.3);
  var dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, ox = -dy / l * w * 0.22, oy = dx / l * w * 0.22;
  ctx.beginPath(); ctx.moveTo(p[0] + ox, p[1] + oy); ctx.lineTo(q[0] + ox, q[1] + oy); ctx.stroke();
  ctx.restore();
}
/* fond « studio » sombre avec sol */
function cbStudio(ctx, W, H, top, bot){
  var bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
  bg.addColorStop(0, top || "#26344f"); bg.addColorStop(1, bot || "#070b14"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}

/* ====================================================================== */
/* 1. ch-sigma-pi-3d : recouvrement axial (σ) et latéral (π)               */
/* ====================================================================== */
/* Recouvrements calculés avec des orbitales de Slater 2s et 2p du carbone (ζ = 1,625 bohr⁻¹), intégration numérique
   en coordonnées cylindriques. Hybride h = (s + λ·p)/√(1 + λ²), λ² = 3 (sp³), 2 (sp²), 1 (sp). */
var CB_ZETA = 1.625, CB_A0 = 0.529177;
var CB_OV = null;
function cbOverlapTable(){
  if (CB_OV) return CB_OV;
  var N2 = Math.pow(2 * CB_ZETA, 5) / 24, Z = CB_ZETA, h = 0.07, rhoMax = 11, tab = [];
  for (var Rp = 80; Rp <= 380; Rp += 5){
    var R = Rp / 100 / CB_A0, za = -R / 2, zb = R / 2, ss = 0, ps = 0, pps = 0, ppp = 0;
    for (var z = za - rhoMax + h / 2; z < zb + rhoMax; z += h){
      var da = z - za, db = z - zb;
      for (var rho = h / 2; rho < rhoMax; rho += h){
        var r2 = rho * rho, ra = Math.sqrt(r2 + da * da), rb = Math.sqrt(r2 + db * db), e = Math.exp(-Z * (ra + rb)) * rho;
        ss += ra * rb * e; ps += da * rb * e; pps += da * db * e; ppp += r2 * e;
      }
    }
    var dA = h * h;
    /* facteurs angulaires : s·s → 2π/(4π) ; p·s → 2π·√3/(4π) ; pσ·pσ → 2π·3/(4π) ; pπ·pπ → π·3/(4π) */
    tab.push({R:Rp, ss:ss * dA * N2 * 0.5, ps:ps * dA * N2 * 0.5 * Math.sqrt(3), pps:pps * dA * N2 * 1.5, ppp:ppp * dA * N2 * 0.75});
  }
  CB_OV = tab; return tab;
}
function cbOverlap(Rpm, lam2){
  var t = cbOverlapTable(), x = Math.max(80, Math.min(380, Rpm)), i = Math.min(t.length - 2, Math.floor((x - 80) / 5)), f = (x - t[i].R) / 5;
  function L(k){ return t[i][k] * (1 - f) + t[i + 1][k] * f; }
  var l = Math.sqrt(lam2);
  return {sig:(L("ss") + 2 * l * L("ps") - lam2 * L("pps")) / (1 + lam2), pi:L("ppp")};
}
/* données de liaison (valeurs moyennes des tables usuelles) */
var CB_BOND = {
  1:{lab:"C–C", mol:"éthane", hyb:"sp³", lam2:3, L:154, E:347, nPi:0, CH:1.09},
  2:{lab:"C=C", mol:"éthène", hyb:"sp²", lam2:2, L:134, E:614, nPi:1, CH:1.087},
  3:{lab:"C≡C", mol:"éthyne", hyb:"sp", lam2:1, L:120, E:839, nPi:2, CH:1.06}
};
/* molécules à compter (Å) ; liaisons [a, b, ordre, directions des orbitales p des π] */
function cbTetraH(C, back, ref, L){
  var u = vnrm(back), rp = vsub(ref, vmul(u, vdot(ref, u)));
  if (vlen(rp) < 1e-3) rp = perpBasis(u)[0];
  var e1 = vnrm(rp), e2 = vcross(u, e1), out = [];
  [PI, PI / 3, -PI / 3].forEach(function(p){ out.push(vadd(C, vmul(vadd(vmul(u, -1 / 3), vmul(vadd(vmul(e1, Math.cos(p)), vmul(e2, Math.sin(p))), Math.sqrt(8) / 3)), L))); });
  return out;
}
function cbPol(r, deg){ return [r * Math.cos(deg * PI / 180), r * Math.sin(deg * PI / 180), 0]; }
var CB_MOLS = (function(){
  var Z_ = [0, 0, 1], M = {};
  function mk(name, form, atoms, bonds, note){ return {name:name, form:form, atoms:atoms, bonds:bonds, note:note}; }
  /* éthène */
  (function(){
    var C1 = [-0.667, 0, 0], C2 = [0.667, 0, 0];
    M.ethene = mk("Éthène", "C₂H₄", [["C", C1], ["C", C2], ["H", vadd(C1, cbPol(1.087, 121.3))], ["H", vadd(C1, cbPol(1.087, 238.7))], ["H", vadd(C2, cbPol(1.087, 58.7))], ["H", vadd(C2, cbPol(1.087, -58.7))]],
      [[0, 1, 2, [Z_]], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]],
      "Tout est dans un plan : la π (au-dessus et en dessous du plan) exige que les deux orbitales p restent parallèles.");
  })();
  (function(){
    M.ethyne = mk("Éthyne (acétylène)", "C₂H₂", [["C", [-0.601, 0, 0]], ["C", [0.601, 0, 0]], ["H", [-1.661, 0, 0]], ["H", [1.661, 0, 0]]],
      [[0, 1, 3, [[0, 1, 0], Z_]], [0, 2, 1], [1, 3, 1]],
      "Les deux π sont perpendiculaires entre elles : ensemble, elles forment un manchon d'électrons autour de l'axe C≡C.");
  })();
  (function(){
    var C2 = [0, 0, 0], C1 = [-1.336, 0, 0], C3 = cbPol(1.501, 56), H = [];
    H.push(vadd(C1, cbPol(1.087, 120)), vadd(C1, cbPol(1.087, 240)), cbPol(1.09, -62));
    var tH = cbTetraH(C3, vsub(C2, C3), [0, 0, 1], 1.09);
    var at = [["C", C1], ["C", C2], ["C", C3], ["H", H[0]], ["H", H[1]], ["H", H[2]], ["H", tH[0]], ["H", tH[1]], ["H", tH[2]]];
    M.propene = mk("Propène", "C₃H₆", at, [[0, 1, 2, [Z_]], [1, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [2, 6, 1], [2, 7, 1], [2, 8, 1]],
      "Le carbone du CH₃ n'a que des liaisons simples : il est sp³ (tétraèdre). Les deux autres, liés par C=C, sont sp².");
  })();
  (function(){
    var C2 = [0, 0, 0], C1 = [-1.341, 0, 0], u = cbPol(1, 57), C3 = vmul(u, 1.431), C4 = vmul(u, 1.431 + 1.208), H4 = vmul(u, 1.431 + 1.208 + 1.061);
    var at = [["C", C1], ["C", C2], ["C", C3], ["C", C4], ["H", vadd(C1, cbPol(1.087, 120))], ["H", vadd(C1, cbPol(1.087, 240))], ["H", cbPol(1.09, -61)], ["H", H4]];
    M.vinylacetylene = mk("But-1-én-3-yne", "C₄H₄", at, [[0, 1, 2, [Z_]], [1, 2, 1], [2, 3, 3, [Z_, cbPol(1, 147)]], [0, 4, 1], [0, 5, 1], [1, 6, 1], [3, 7, 1]],
      "Une double et une triple liaison dans la même molécule : compte une σ par liaison, puis ajoute une π pour chaque « trait en plus ».");
  })();
  (function(){
    M.hcn = mk("Cyanure d'hydrogène", "HCN", [["H", [-1.065, 0, 0]], ["C", [0, 0, 0]], ["N", [1.156, 0, 0]]],
      [[0, 1, 1], [1, 2, 3, [[0, 1, 0], Z_]]],
      "L'azote garde un doublet non liant dans l'axe ; la liaison C≡N a la même structure qu'une C≡C : 1 σ + 2 π.");
  })();
  (function(){
    M.co2 = mk("Dioxyde de carbone", "CO₂", [["O", [-1.162, 0, 0]], ["C", [0, 0, 0]], ["O", [1.162, 0, 0]]],
      [[0, 1, 2, [[0, 1, 0]]], [1, 2, 2, [Z_]]],
      "Le carbone central est sp : ses deux orbitales p sont perpendiculaires, donc les deux π de CO₂ sont dans deux plans perpendiculaires. Tourne la molécule pour le voir.");
  })();
  function dce(cis){
    var C1 = [-0.665, 0, 0], C2 = [0.665, 0, 0];
    var at = [["C", C1], ["C", C2], ["Cl", vadd(C1, cbPol(1.717, 122.8))], ["H", vadd(C1, cbPol(1.08, 240))], ["Cl", vadd(C2, cbPol(1.717, cis ? 57.2 : -57.2))], ["H", vadd(C2, cbPol(1.08, cis ? -60 : 60))]];
    return mk(cis ? "(Z)-1,2-dichloroéthène (cis)" : "(E)-1,2-dichloroéthène (trans)", "C₂H₂Cl₂", at, [[0, 1, 2, [Z_]], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]],
      cis ? "Les deux Cl du même côté : Éb ≈ 60 °C. Pour passer à la forme trans, il faudrait tourner autour de C=C, donc casser la π (≈ 267 kJ/mol) : c'est un autre composé." :
            "Les deux Cl de part et d'autre : Éb ≈ 48 °C. Même formule, mêmes liaisons que le cis, mais la π fige le plan : les deux isomères ne se transforment pas l'un en l'autre à température ordinaire.");
  }
  M.dceZ = dce(true); M.dceE = dce(false);
  /* chaque molécule est tournée dans son plan pour que son grand axe soit horizontal */
  Object.keys(M).forEach(function(key){
    var m = M[key], sxx = 0, syy = 0, sxy = 0, cx = 0, cy = 0, n = m.atoms.length;
    m.atoms.forEach(function(a){ cx += a[1][0] / n; cy += a[1][1] / n; });
    m.atoms.forEach(function(a){ var x = a[1][0] - cx, y = a[1][1] - cy; sxx += x * x; syy += y * y; sxy += x * y; });
    var th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    function R(v){ return v ? [v[0] * Math.cos(-th) - v[1] * Math.sin(-th), v[0] * Math.sin(-th) + v[1] * Math.cos(-th), v[2]] : v; }
    m.atoms = m.atoms.map(function(a){ return [a[0], R(a[1])]; });
    m.bonds = m.bonds.map(function(bd){ return [bd[0], bd[1], bd[2], bd[3] ? bd[3].map(R) : undefined]; });
  });
  return M;
})();
var CB_EL = {C:{r:0.3, col:"#4a5568"}, H:{r:0.2, col:"#eef2f7"}, O:{r:0.31, col:"#e0453a"}, N:{r:0.31, col:"#3b6fe0"}, Cl:{r:0.4, col:"#3cb043"}};
var CB_SIG = "#4f8dfd", CB_SIG2 = "#24438a", CB_PIP = "#f5a524", CB_PIM = "#8b5cf6";

SFA.sim({
  id:"ch-sigma-pi-3d", ch:"c02", tag:"Liaisons σ et π",
  titre:"Recouvrement axial et latéral : σ, π et ordre de liaison en 3D",
  resume:"Approche deux carbones en 3D : les orbitales hybrides se recouvrent bout à bout (σ), les orbitales p côte à côte (π). Le recouvrement se calcule en direct, et l'on voit pourquoi une liaison π est plus faible qu'une σ, pourquoi la double est plus courte que la simple. Puis compte σ et π dans huit molécules.",
  but:"Étape 1 : choisis C–C, C=C ou C≡C. Les deux carbones s'approchent tout seuls ; attrape le carbone de droite pour régler toi-même la distance, ou utilise le curseur. Les lobes bleus (hybrides) se recouvrent dans l'axe : c'est la σ ; les lobes orange et violets (orbitales p) se recouvrent sur les côtés : c'est la π. Lis le recouvrement S sur la courbe et compare-le à la longueur réelle de la liaison. Étape 2 : choisis une molécule, survole ou touche une liaison pour la décrire, et compte les σ et les π. Glisse ailleurs pour tourner la vue.",
  aRetenir:"Toute liaison contient exactement une σ ; une double liaison = 1 σ + 1 π, une triple = 1 σ + 2 π (perpendiculaires). La σ naît d'un recouvrement axial (sur la droite qui joint les noyaux), la π d'un recouvrement latéral de deux orbitales p parallèles, au-dessus et en dessous de l'axe. À la longueur réelle, le recouvrement latéral est bien plus faible (S ≈ 0,27 pour la π de l'éthène contre 0,77 pour sa σ) : une π est plus faible qu'une σ (≈ 267 kJ/mol contre 347). Plus l'ordre de liaison augmente, plus la liaison est courte et forte : C–C 154 pm et 347 kJ/mol, C=C 134 pm et 614 kJ/mol, C≡C 120 pm et 839 kJ/mol. Pour compter : 1 σ par paire d'atomes liés, puis 1 π par trait supplémentaire.",
  piege:"Une double liaison n'est pas deux fois plus forte qu'une simple (614 et non 694 kJ/mol) : la seconde liaison est une π, moins bien recouverte. La π n'est pas « une deuxième liaison à côté de la première » sur l'axe : sa densité électronique est hors de l'axe, nulle dans le plan de la molécule. Et le CO₂ n'est pas plan pour ses π : ses deux liaisons π sont dans deux plans perpendiculaires.",
  build:function(k, S){
    var c = cbCanvas(k, 0.74, 1.08), g = cbCanvasH(k, 215, 360);
    var V = cbView(-0.42, 0.34), st = {R:330, t:0, ph:0, auto:true, spin:true, drag:null, hov:-1, sel:-1, sp:0};
    var mS = k.seg("Étape", [["form", "1 · Former la liaison"], ["count", "2 · Compter σ et π"]], "form", function(v){ st.sel = -1; st.hov = -1; V.a = v === "form" ? -0.42 : 0; V.b = v === "form" ? 0.34 : 0.82; st.sp = 0; });
    var oS = k.seg("Liaison", [["1", "C–C"], ["2", "C=C"], ["3", "C≡C"]], "2", function(){ st.ph = 0; }), oBox = cbLastCtl(k);
    var dS = k.slider("Distance entre les carbones", 100, 350, 1, 330, "pm", function(v){ st.R = v; st.auto = false; aT.set(false); }), dBox = cbLastCtl(k);
    var aT = k.toggle("Animer l'approche des deux carbones", true, function(v){ st.auto = v; st.ph = 0; }), aBox = cbLastCtl(k);
    var vS = k.seg("Orbitales montrées", [["all", "σ et π"], ["s", "σ seule"], ["p", "π seules"]], "all"), vBox = cbLastCtl(k);
    var MOL = [["ethene", "Éthène C₂H₄"], ["ethyne", "Éthyne C₂H₂"], ["propene", "Propène C₃H₆"], ["vinylacetylene", "But-1-én-3-yne C₄H₄"], ["hcn", "Cyanure d'hydrogène HCN"], ["co2", "Dioxyde de carbone CO₂"], ["dceZ", "1,2-dichloroéthène cis (Z)"], ["dceE", "1,2-dichloroéthène trans (E)"]];
    var molS = k.select("Molécule", MOL, "vinylacetylene", function(){ st.sel = -1; st.hov = -1; }), molBox = cbLastCtl(k);
    var hT = k.toggle("Hybridation des carbones", true), hBox = cbLastCtl(k);
    var sT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var roA = k.readouts(["Ordre de liaison", "Composition", "Distance C–C", "Recouvrement σ (S)", "Recouvrement π (S)", "Liaison réelle"]);
    var roB = k.readouts(["Molécule", "Liaisons σ", "Liaisons π", "Carbones"]);
    var nt = k.note("", "ok");
    c.cv.style.cursor = "grab";
    cbOverlapTable();
    /* ---------- souris : attraper le carbone de droite (étape 1), choisir une liaison (étape 2), sinon tourner ---------- */
    c.pointer(function(type, p){
      if (type === "down"){
        st.lx = p.x; st.ly = p.y; st.moved = 0;
        if (mS.value === "form" && st.Bscr && Math.hypot(p.x - st.Bscr[0], p.y - st.Bscr[1]) < Math.max(30, st.Brad + 10)){ st.drag = "B"; st.auto = false; aT.set(false); c.cv.style.cursor = "grabbing"; }
        else st.drag = "view";
        return;
      }
      if (type === "drag" && st.drag){
        var dx = p.x - st.lx, dy = p.y - st.ly; st.moved += Math.abs(dx) + Math.abs(dy);
        if (st.drag === "B" && st.ex){
          var ex = st.ex, l2 = ex[0] * ex[0] + ex[1] * ex[1];
          if (l2 > 4){ st.R = Math.max(100, Math.min(350, st.R + 2 * (dx * ex[0] + dy * ex[1]) / l2 * 100)); dS.set(Math.round(st.R)); }
        } else {
          V.a += dx * 0.011; V.b = Math.max(-1.45, Math.min(1.45, V.b + dy * 0.011));
          if (st.spin && st.moved > 4){ st.spin = false; sT.set(false); }
        }
        st.lx = p.x; st.ly = p.y; return;
      }
      if (type === "up"){
        if (mS.value === "count" && st.moved < 6) st.sel = pick(p);
        st.drag = null; c.cv.style.cursor = "grab"; return;
      }
      if (type === "move" && mS.value === "count") st.hov = pick(p);
    });
    function pick(p){
      var best = -1, bd = 26;
      (st.mids || []).forEach(function(m, i){ var d = Math.hypot(p.x - m[0], p.y - m[1]); if (d < bd){ bd = d; best = i; } });
      return best;
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.spin && !st.drag){ st.sp += dt; if (mS.value === "form") V.a = -0.42 + 0.5 * Math.sin(st.sp * 0.35); else V.a = 0.75 * Math.sin(st.sp * 0.4); }
      if (st.auto && mS.value === "form"){
        /* cycle de 9 s : approche (3 s), liaison formée (3,5 s), écartement (1,5 s), pause (1 s) */
        st.ph = (st.ph + dt) % 9;
        var Req = CB_BOND[oS.value].L, q = st.ph, u;
        if (q < 3){ u = q / 3; u = u * u * (3 - 2 * u); st.R = 330 + (Req - 330) * u; }
        else if (q < 6.5) st.R = Req;
        else if (q < 8){ u = (q - 6.5) / 1.5; u = u * u * (3 - 2 * u); st.R = Req + (330 - Req) * u; }
        else st.R = 330;
        dS.set(Math.round(st.R));
      }
      k.redraw();
    });
    lp.play();

    /* ---------- étape 1 : deux carbones et leurs orbitales ---------- */
    function drawForm(ctx, W, H, ph){
      var o = +oS.value, B = CB_BOND[o], R = st.R / 100, show = vS.value, list = [];
      V.cx = W / 2; V.cy = H * (ph ? 0.47 : 0.48); V.sc = Math.min(W / 4.9, H / (ph ? 3.5 : 3.1)); V.per = 0.05;
      var A = [-R / 2, 0, 0], Bp = [R / 2, 0, 0], ov = cbOverlap(st.R, B.lam2);
      /* sol + ombre */
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.9, Math.min(W * 0.36, V.sc * (R / 2 + 1.6)), H * 0.035, 0, 0, 7); ctx.fill(); ctx.restore();
      var nU = ph ? 10 : 13, nV = ph ? 14 : 18;
      /* hybrides σ (vers l'autre carbone) */
      if (show !== "p"){
        [[A, [1, 0, 0]], [Bp, [-1, 0, 0]]].forEach(function(z){
          cbAddMesh(V, list, cbLobe(z[0], z[1], 1.05, 0.5, nU, nV), CB_SIG, 0.62);
          cbAddMesh(V, list, cbLobe(z[0], vmul(z[1], -1), 0.34, 0.27, 6, nV - 4), CB_SIG2, 0.75);
        });
      }
      /* orbitales p (π) : une pour C=C (verticale, perpendiculaire au plan horizontal des H), deux pour C≡C (y et z) */
      var pdirs = o === 2 ? [[0, 1, 0]] : o === 3 ? [[0, 1, 0], [0, 0, 1]] : [];
      if (show !== "s") pdirs.forEach(function(n){
        [A, Bp].forEach(function(C){
          cbAddMesh(V, list, cbLobe(C, n, 1.0, 0.4, nU, nV), CB_PIP, 0.58);
          cbAddMesh(V, list, cbLobe(C, vmul(n, -1), 1.0, 0.4, nU, nV), CB_PIM, 0.58);
        });
      });
      /* hydrogènes (liaisons C–H σ en bâtons) */
      var Hs = [];
      [[A, -1], [Bp, 1]].forEach(function(z, side){
        var C = z[0], s = z[1], dirs = [];
        if (o === 1){ for (var q = 0; q < 3; q++){ var ph0 = PI / 2 + q * 2 * PI / 3 + (side ? PI / 3 : 0); dirs.push([s / 3, Math.sqrt(8) / 3 * Math.cos(ph0), Math.sqrt(8) / 3 * Math.sin(ph0)]); } }
        else if (o === 2){ dirs.push([s * 0.5, 0, 0.866], [s * 0.5, 0, -0.866]); }
        else dirs.push([s, 0, 0]);
        dirs.forEach(function(d){ Hs.push([C, vadd(C, vmul(d, B.CH))]); });
      });
      Hs.forEach(function(hc){
        var p = cbPrj(V, hc[0]), q = cbPrj(V, hc[1]);
        list.push({z:(p[2] + q[2]) / 2 - 0.05, f:function(){ cbStick(ctx, p, q, Math.max(3, V.sc * 0.07), "#9aa8bc"); }});
        list.push({z:q[2], f:function(){ cbBall(ctx, q[0], q[1], Math.max(5, 0.2 * V.sc * q[5]), "#eef2f7"); }});
      });
      /* carbones */
      var pa = cbPrj(V, A), pb = cbPrj(V, Bp), rC = Math.max(8, 0.27 * V.sc);
      list.push({z:pa[2] + 0.01, f:function(){ cbBall(ctx, pa[0], pa[1], rC * pa[5], "#4a5568"); cbText(ctx, "C", pa[0], pa[1] + 0.5, {size:rC * 0.95, color:"#fff", w:800}); }});
      list.push({z:pb[2] + 0.01, f:function(){
        cbBall(ctx, pb[0], pb[1], rC * pb[5], "#4a5568"); cbText(ctx, "C", pb[0], pb[1] + 0.5, {size:rC * 0.95, color:"#fff", w:800});
        if (!st.auto || st.drag === "B"){ ctx.save(); ctx.strokeStyle = "rgba(255,211,107," + (st.drag === "B" ? 0.95 : 0.55 + 0.3 * Math.sin(st.t * 4)) + ")"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(pb[0], pb[1], rC * pb[5] + 6, 0, 7); ctx.stroke(); ctx.restore(); }
      }});
      st.Bscr = pb; st.Brad = rC * pb[5];
      var o0 = cbPrj(V, [0, 0, 0]), o1 = cbPrj(V, [0.5, 0, 0]); st.ex = [o1[0] - o0[0], o1[1] - o0[1]];
      cbPaint(ctx, list);
      /* zones de recouvrement : lueur proportionnelle à S */
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      if (show !== "p"){ var m = cbPrj(V, [0, 0, 0]); cbGlow(ctx, m[0], m[1], V.sc * 0.42, "120,190,255", Math.min(0.6, ov.sig * 0.6)); }
      if (show !== "s") pdirs.forEach(function(n){ [1, -1].forEach(function(sg){ var m = cbPrj(V, vmul(n, 0.62 * sg)); cbGlow(ctx, m[0], m[1], V.sc * 0.4, "255,200,110", Math.min(0.6, ov.pi * 1.5)); }); });
      ctx.restore();
      /* étiquettes σ / π sur la scène */
      if (ov.sig > 0.12 && show !== "p"){ var mσ = cbPrj(V, [0, -0.05, 0]); cbTag(ctx, "σ", mσ[0], mσ[1] + (o === 1 ? V.sc * 0.5 : 0), {size:13, bg:"rgba(79,141,253,.95)", color:"#fff"}); }
      if (ov.pi > 0.05 && show !== "s") pdirs.forEach(function(n, i){ var mp = cbPrj(V, vmul(n, 0.98)); cbTag(ctx, pdirs.length > 1 ? "π" + (i + 1) : "π", mp[0], mp[1], {size:13, bg:"rgba(245,165,36,.95)", color:"#231400"}); });
      /* règle : distance entre les noyaux */
      var y0 = H * (ph ? 0.8 : 0.83), xa = pa[0], xb = pb[0];
      ctx.save(); ctx.strokeStyle = "rgba(200,215,240,.6)"; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(xa, pa[1] + rC); ctx.lineTo(xa, y0); ctx.moveTo(xb, pb[1] + rC); ctx.lineTo(xb, y0); ctx.stroke(); ctx.setLineDash([]);
      if (Math.abs(xb - xa) > 30){ cbArrow(ctx, (xa + xb) / 2, y0, xa + 1, y0, "rgba(200,215,240,.85)", 1.4); cbArrow(ctx, (xa + xb) / 2, y0, xb - 1, y0, "rgba(200,215,240,.85)", 1.4); }
      ctx.restore();
      cbTag(ctx, Math.round(st.R) + " pm", (xa + xb) / 2, y0 + 15, {size:ph ? 11 : 12, bg:"rgba(255,255,255,.14)", color:"#fff"});
      /* titre et légende */
      cbTag(ctx, B.lab + " (" + B.mol + ", C " + B.hyb + ") : " + (o === 1 ? "1 σ" : o === 2 ? "1 σ + 1 π" : "1 σ + 2 π"), 10, 18, {align:"left", bg:"rgba(255,255,255,.13)", color:"#fff", size:ph ? 11.5 : 13});
      var ly = H - 16, lx = 12;
      cbBall(ctx, lx + 5, ly, 5, CB_SIG); cbText(ctx, "hybride (σ, axial)", lx + 14, ly, {size:ph ? 9.5 : 10.5, color:"#c9d6ea", align:"left"});
      if (o > 1){ var lx2 = lx + (ph ? 108 : 124); cbBall(ctx, lx2 + 5, ly, 5, CB_PIP); cbBall(ctx, lx2 + 17, ly, 5, CB_PIM); cbText(ctx, "p (π, latéral) : ψ > 0 / ψ < 0", lx2 + 26, ly, {size:ph ? 9.5 : 10.5, color:"#c9d6ea", align:"left"}); }
      if (!ph) cbText(ctx, "attrape le C de droite · glisse ailleurs pour tourner", W - 10, 18, {size:10.5, color:"#8fa0ba", align:"right"});
      return ov;
    }
    /* ---------- graphe S(r) + barres longueur / énergie ---------- */
    function drawGraph(ov){
      var ctx = g.ctx, W = g.W, H = g.H, ph = W < 480, o = +oS.value, B = CB_BOND[o];
      g.clear(); ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, H);
      var gw = ph ? W : W * 0.56, gh = ph ? H * 0.56 : H, L = 44, Rr = 12, T = 40, Bt = 30;
      var X = function(r){ return L + (r - 100) / 250 * (gw - L - Rr); }, Y = function(s){ return T + (1 - s) * (gh - T - Bt); };
      ctx.save(); ctx.font = cbFont(600, 10); ctx.fillStyle = "#6b7685"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var r = 100; r <= 350; r += 50){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(X(r), T); ctx.lineTo(X(r), Y(0)); ctx.stroke(); ctx.fillText(String(r), X(r), Y(0) + 4); }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var s = 0; s <= 1.001; s += 0.25){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Y(s)); ctx.lineTo(X(350), Y(s)); ctx.stroke(); ctx.fillText(cbFmt(s, 2), L - 5, Y(s)); }
      ctx.strokeStyle = "#a3adba"; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, Y(0)); ctx.lineTo(X(350), Y(0)); ctx.stroke();
      ctx.restore();
      cbText(ctx, "distance (pm)", X(350), Y(0) + 21, {size:10, color:"#6b7685", align:"right", w:600});
      cbText(ctx, "recouvrement S selon la distance", X(350), 11, {size:10.5, color:"#2c3a4e", align:"right", w:800});
      /* longueurs réelles des trois liaisons */
      [1, 2, 3].forEach(function(q){
        var x = X(CB_BOND[q].L), on = q === o;
        ctx.save(); ctx.strokeStyle = on ? "#1f2a3d" : "#c3cad5"; ctx.setLineDash([3, 3]); ctx.lineWidth = on ? 1.4 : 1; ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, Y(0)); ctx.stroke(); ctx.restore();
        cbText(ctx, CB_BOND[q].lab, x, T - 6 - (q - 1) * 11, {size:9.5, color:on ? "#1f2a3d" : "#98a2b1", w:on ? 800 : 600});
      });
      function curve(fn, col, w, dash){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (var r = 100; r <= 350; r += 2){ var y = Y(fn(r)); r === 100 ? ctx.moveTo(X(r), y) : ctx.lineTo(X(r), y); } ctx.stroke(); ctx.restore(); }
      curve(function(r){ return cbOverlap(r, B.lam2).sig; }, CB_SIG, 2.6);
      curve(function(r){ return cbOverlap(r, B.lam2).pi; }, o === 1 ? "rgba(245,165,36,.45)" : CB_PIP, o === 1 ? 1.6 : 2.6, o === 1 ? [5, 4] : null);
      var xr = X(st.R);
      ctx.save(); ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.beginPath(); ctx.moveTo(xr, T); ctx.lineTo(xr, Y(0)); ctx.stroke(); ctx.restore();
      cbBall(ctx, xr, Y(ov.sig), 5.5, CB_SIG); if (o > 1) cbBall(ctx, xr, Y(ov.pi), 5.5, CB_PIP);
      cbText(ctx, "σ (hybrides " + B.hyb + ")", X(232), Y(cbOverlap(232, B.lam2).sig) - 11, {size:10, color:"#2858c4", align:"left", w:800});
      cbText(ctx, o === 1 ? "π : aucune p libre en sp³" : "π (p parallèles)", X(188), Y(cbOverlap(188, B.lam2).pi) - 10, {size:10, color:"#b8730a", align:"left", w:800});
      /* barres : énergie de liaison découpée en σ + π */
      var bx = ph ? 12 : gw + 18, by = ph ? gh + 16 : 14, bw = (ph ? W : W - gw) - (ph ? 24 : 30), bh = ph ? H - gh - 22 : H - 26;
      cbText(ctx, "énergie de liaison (kJ/mol)", bx, by + 2, {size:10.5, color:"#2c3a4e", align:"left", w:800});
      var lgx = bx + (ph ? 178 : 0), lgy = ph ? by + 2 : by + 17;
      cbBall(ctx, lgx + 5, lgy, 4.5, CB_SIG); cbText(ctx, "σ", lgx + 13, lgy, {size:10, color:"#2858c4", align:"left", w:800});
      cbBall(ctx, lgx + 31, lgy, 4.5, CB_PIP); cbText(ctx, "π", lgx + 39, lgy, {size:10, color:"#b8730a", align:"left", w:800});
      if (!ph){ by += 14; bh -= 14; }
      var rowH = (bh - 18) / 3, sc = (bw - 76) / 840;
      [1, 2, 3].forEach(function(q, i){
        var D = CB_BOND[q], y = by + 18 + i * rowH, on = q === o, x = bx + 34, parts = [347].concat(q === 2 ? [267] : q === 3 ? [267, 225] : []);
        cbText(ctx, D.lab, bx, y + rowH * 0.42, {size:11, color:on ? "#0f1b2d" : "#8a95a3", align:"left", w:on ? 800 : 600});
        parts.forEach(function(e, j){
          var w = e * sc, hh = Math.min(20, rowH * 0.62);
          ctx.save(); ctx.globalAlpha = on ? 1 : 0.45; cbRR(ctx, x + 1, y + rowH * 0.42 - hh / 2, w - 2, hh, 4);
          var gr = ctx.createLinearGradient(0, y, 0, y + hh); var col = j === 0 ? CB_SIG : CB_PIP; gr.addColorStop(0, cbShade(col, 0.3)); gr.addColorStop(1, cbShade(col, -0.2));
          ctx.fillStyle = gr; ctx.fill(); ctx.restore();
          if (on && w > 26) cbText(ctx, String(e), x + w / 2, y + rowH * 0.42, {size:9.5, color:j === 0 ? "#fff" : "#2a1800", w:800});
          x += w;
        });
        cbText(ctx, String(D.E), x + 5, y + rowH * 0.42, {size:10, color:on ? "#0f1b2d" : "#98a2b1", align:"left", w:on ? 800 : 600});
      });
    }
    /* ---------- étape 2 : molécules ---------- */
    function drawCount(ctx, W, H, ph){
      /* molécule posée à plat : (x, y, z) → (x, z, −y), les π deviennent verticales */
      var M0 = CB_MOLS[molS.value], TT = function(v){ return [v[0], v[2], -v[1]]; };
      var M = {name:M0.name, form:M0.form, note:M0.note, atoms:M0.atoms.map(function(a){ return [a[0], TT(a[1])]; }), bonds:M0.bonds.map(function(b){ return [b[0], b[1], b[2], b[3] ? b[3].map(TT) : null]; })};
      var list = [], at = M.atoms;
      var ctr = [0, 0, 0]; at.forEach(function(a){ ctr = vadd(ctr, a[1]); }); ctr = vmul(ctr, 1 / at.length);
      var rmax = 0; at.forEach(function(a){ rmax = Math.max(rmax, vlen(vsub(a[1], ctr))); });
      V.cx = W / 2; V.cy = H * 0.52; V.sc = Math.min(W * 0.47, H * 0.5) / (rmax + 0.4); V.per = 0.04;
      var P = at.map(function(a){ return cbPrj(V, vsub(a[1], ctr)); });
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.92, Math.min(W * 0.36, V.sc * (rmax + 0.6)), H * 0.03, 0, 0, 7); ctx.fill(); ctx.restore();
      var nU = ph ? 8 : 10, nV = ph ? 12 : 16, nSig = 0, nPi = 0, mids = [], act = st.sel >= 0 ? st.sel : st.hov;
      M.bonds.forEach(function(b, bi){
        var pa = P[b[0]], pb = P[b[1]], on = bi === act;
        nSig += 1; nPi += b[2] - 1;
        var mid = cbPrj(V, vmul(vadd(vsub(at[b[0]][1], ctr), vsub(at[b[1]][1], ctr)), 0.5)); mids.push(mid);
        list.push({z:(pa[2] + pb[2]) / 2 - 0.02, f:function(){ cbStick(ctx, pa, pb, Math.max(3.5, V.sc * 0.11), on ? "#ffd36b" : CB_SIG); }});
        (b[3] || []).forEach(function(n){
          var A3 = vsub(at[b[0]][1], ctr), B3 = vsub(at[b[1]][1], ctr), ax = vnrm(vsub(B3, A3)), Lb = vlen(vsub(B3, A3)), M3 = vmul(vadd(A3, B3), 0.5), e2 = vcross(ax, n);
          [1, -1].forEach(function(sg){
            cbAddMesh(V, list, cbEllipsoid(vadd(M3, vmul(n, 0.6 * sg)), ax, n, e2, Lb * 0.52, 0.27, 0.3, nU, nV), sg > 0 ? CB_PIP : CB_PIM, on ? 0.78 : 0.52);
          });
        });
      });
      st.mids = mids;
      at.forEach(function(a, i){
        var E = CB_EL[a[0]], p = P[i], r = Math.max(a[0] === "H" ? 4.5 : 7, E.r * V.sc * p[5]);
        list.push({z:p[2] + 0.03, f:function(){ cbBall(ctx, p[0], p[1], r, E.col); if (a[0] !== "H" && r > 8) cbText(ctx, a[0], p[0], p[1] + 0.5, {size:Math.min(15, r * 0.95), color:a[0] === "C" || a[0] === "N" ? "#fff" : "#10240f", w:800}); }});
      });
      cbPaint(ctx, list);
      /* hybridation de chaque carbone : nombre de voisins σ */
      var nb = at.map(function(){ return 0; }), hy = {sp:0, "sp²":0, "sp³":0};
      M.bonds.forEach(function(b){ nb[b[0]]++; nb[b[1]]++; });
      at.forEach(function(a, i){
        if (a[0] !== "C") return;
        var lab = nb[i] === 4 ? "sp³" : nb[i] === 3 ? "sp²" : "sp"; hy[lab]++;
        if (hT.value){ var p = P[i], rr = Math.max(7, CB_EL.C.r * V.sc * p[5]); cbTag(ctx, lab, p[0], p[1] - rr - (ph ? 26 : 32), {size:ph ? 9.5 : 10.5, bg:"rgba(255,255,255,.88)", color:"#13233a"}); }
      });
      /* liaison désignée */
      if (act >= 0 && act < M.bonds.length){
        var b = M.bonds[act], A1 = at[b[0]], B1 = at[b[1]], Lb = vlen(vsub(A1[1], B1[1])) * 100;
        var sym = b[2] === 1 ? "–" : b[2] === 2 ? "=" : "≡", comp = b[2] === 1 ? "1 σ" : b[2] === 2 ? "1 σ + 1 π" : "1 σ + 2 π";
        var m = mids[act]; cbTag(ctx, A1[0] + sym + B1[0] + " : " + comp + " · " + Math.round(Lb) + " pm", Math.max(90, Math.min(W - 90, m[0])), Math.max(52, m[1] - 34), {size:ph ? 11 : 12.5, bg:"rgba(255,211,107,.96)", color:"#241a00"});
      }
      cbTag(ctx, M.name + " · " + M.form, 10, 18, {align:"left", bg:"rgba(255,255,255,.13)", color:"#fff", size:ph ? 11.5 : 13});
      cbTag(ctx, nSig + " σ  +  " + nPi + " π", W - 10, 18, {align:"right", bg:"rgba(255,211,107,.95)", color:"#241a00", size:ph ? 12 : 14});
      var ly = H - 16;
      cbBall(ctx, 17, ly, 5, CB_SIG); cbText(ctx, "σ (bâton)", 26, ly, {size:ph ? 9.5 : 10.5, color:"#c9d6ea", align:"left"});
      cbBall(ctx, ph ? 94 : 104, ly, 5, CB_PIP); cbBall(ctx, ph ? 106 : 116, ly, 5, CB_PIM); cbText(ctx, "π (nuages de part et d'autre)", ph ? 115 : 125, ly, {size:ph ? 9.5 : 10.5, color:"#c9d6ea", align:"left"});
      if (!ph) cbText(ctx, "survole ou touche une liaison · glisse pour tourner", W - 10, 42, {size:10.5, color:"#8fa0ba", align:"right"});
      return {nSig:nSig, nPi:nPi, hy:hy, M:M};
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, form = mS.value === "form";
      [oBox, dBox, aBox, vBox].forEach(function(b){ b.style.display = form ? "" : "none"; });
      [molBox, hBox].forEach(function(b){ b.style.display = form ? "none" : ""; });
      roA.el.style.display = form ? "" : "none"; roB.el.style.display = form ? "none" : "";
      g.cv.style.display = form ? "" : "none";
      c.clear(); cbStudio(ctx, W, H);
      if (form){
        var ov = drawForm(ctx, W, H, ph), o = +oS.value, B = CB_BOND[o];
        drawGraph(ov);
        roA.set(0, o + (o === 1 ? " (simple)" : o === 2 ? " (double)" : " (triple)"));
        roA.set(1, o === 1 ? "1 σ" : o === 2 ? "1 σ + 1 π" : "1 σ + 2 π");
        roA.set(2, Math.round(st.R) + " pm");
        roA.set(3, cbFmt(ov.sig, 2));
        roA.set(4, o === 1 ? "pas de π" : (o === 3 ? "2 × " : "") + cbFmt(ov.pi, 2));
        roA.set(5, B.L + " pm · " + B.E + " kJ/mol");
        var d = st.R - B.L, msg;
        if (ov.sig < 0.05) msg = "Les carbones sont trop loin : les orbitales ne se touchent pas (S ≈ 0), il n'y a pas encore de liaison.";
        else if (Math.abs(d) <= 4) msg = "À " + B.L + " pm, la longueur réelle de " + B.lab + ", le recouvrement axial vaut S<sub>σ</sub> = " + cbFmt(ov.sig, 2) + (o > 1 ? " et le recouvrement latéral seulement S<sub>π</sub> = " + cbFmt(ov.pi, 2) + " : les p, parallèles, ne se touchent que par les bords. C'est pourquoi une π (≈ " + (o === 2 ? "267" : "267 puis 225") + " kJ/mol) est plus faible que la σ (347 kJ/mol)." : ". Aucune orbitale p n'est libre (carbone sp³) : pas de π, la liaison est une σ seule.");
        else if (d > 0) msg = "Encore " + Math.round(d) + " pm de trop : les lobes " + (o > 1 ? "p se recouvrent à peine (le recouvrement latéral chute vite avec la distance)" : "commencent à se recouvrir") + ". " + (o > 1 ? "Pour bien recouvrir leurs p, les carbones doivent se rapprocher : c'est pourquoi " + B.lab + " est plus courte que C–C." : "");
        else msg = "Plus près que " + B.L + " pm, le recouvrement augmente encore, mais les deux noyaux (et leurs électrons internes) se repoussent fortement : la longueur réelle est le compromis entre les deux.";
        nt.set(msg + " <i>S calculé avec des orbitales de Slater du carbone (ζ = 1,625).</i>", "ok");
      } else {
        var r = drawCount(ctx, W, H, ph), hy = [];
        ["sp³", "sp²", "sp"].forEach(function(h){ if (r.hy[h]) hy.push(r.hy[h] + " " + h); });
        roB.set(0, r.M.form); roB.set(1, String(r.nSig)); roB.set(2, String(r.nPi)); roB.set(3, hy.join(", "));
        nt.set(r.M.note + " Méthode : " + r.nSig + " paires d'atomes liés = " + r.nSig + " σ ; les traits en plus des doubles et triples liaisons donnent " + r.nPi + " π.", "ok");
      }
    });
  }
});

/* ====================================================================== */
/* 2. ch-london-dipoles : dipôles instantanés et forces de London          */
/* ====================================================================== */
/* Données : polarisabilité α′ (Å³, NIST CCCBDB ; I₂ : valeur calculée ≈ 10,3), Téb et ΔvapH à Téb (tables CRC),
   rayons de van der Waals (Bondi), longueurs de liaison X–X. */
var CB_LS = {
  He:{nm:"Hélium", f:"He", ne:2, a:0.208, Tb:4.22, H:0.0829, r:1.40, col:"#f4d58d"},
  Ne:{nm:"Néon", f:"Ne", ne:10, a:0.381, Tb:27.07, H:1.71, r:1.54, col:"#f6a37a"},
  Ar:{nm:"Argon", f:"Ar", ne:18, a:1.664, Tb:87.30, H:6.43, r:1.88, col:"#b9a3f0"},
  Kr:{nm:"Krypton", f:"Kr", ne:36, a:2.498, Tb:119.93, H:9.08, r:2.02, col:"#8fc3f2"},
  Xe:{nm:"Xénon", f:"Xe", ne:54, a:4.005, Tb:165.05, H:12.57, r:2.16, col:"#86d9c8"},
  F2:{nm:"Difluor", f:"F₂", ne:18, a:1.16, Tb:85.03, H:6.62, r:1.47, b:1.42, col:"#d8ef9a"},
  Cl2:{nm:"Dichlore", f:"Cl₂", ne:34, a:4.61, Tb:239.11, H:20.41, r:1.75, b:1.99, col:"#a6e07a"},
  Br2:{nm:"Dibrome", f:"Br₂", ne:70, a:6.43, Tb:332.0, H:29.96, r:1.85, b:2.28, col:"#d9785a"},
  I2:{nm:"Diiode", f:"I₂", ne:106, a:10.3, Tb:457.6, H:41.57, r:1.98, b:2.67, col:"#9d6ad6"},
  pent:{nm:"Pentane", f:"C₅H₁₂", ne:42, a:9.88, Tb:309.2, H:25.79, col:"#9fb3cf"},
  neo:{nm:"Néopentane", f:"C₅H₁₂", ne:42, a:10.24, Tb:282.6, H:22.74, col:"#9fb3cf"}
};
var CB_SERIES = {gaz:["He", "Ne", "Ar", "Kr", "Xe"], hal:["F2", "Cl2", "Br2", "I2"], forme:["pent", "neo"]};
var CB_VDW = {C:1.7, H:1.2};
/* géométries (Å) : pentane tout anti (zigzag dans le plan xy, axe y) et néopentane */
function cbAlkane(kind){
  var at = [], i;
  function tetraDirs(C, back, ref){ return cbTetraH(C, back, ref, 1.09); }
  if (kind === "pent"){
    var C = []; for (i = 0; i < 5; i++) C.push([0.43 * (i % 2 ? 1 : -1), (i - 2) * 1.27, 0]);
    C.forEach(function(c){ at.push(["C", c]); });
    for (i = 0; i < 5; i++){
      if (i === 0 || i === 4){ var nb = i === 0 ? C[1] : C[3]; tetraDirs(C[i], vsub(nb, C[i]), vsub(C[2], nb)).forEach(function(h){ at.push(["H", h]); }); }
      else {
        var u1 = vnrm(vsub(C[i - 1], C[i])), u2 = vnrm(vsub(C[i + 1], C[i])), bb = vmul(vnrm(vadd(u1, u2)), -1), n = vnrm(vcross(u1, u2)), h = 54.75 * PI / 180;
        [1, -1].forEach(function(sg){ at.push(["H", vadd(C[i], vmul(vadd(vmul(bb, Math.cos(h)), vmul(n, sg * Math.sin(h))), 1.09))]); });
      }
    }
  } else {
    at.push(["C", [0, 0, 0]]);
    [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].forEach(function(v){
      var d = vnrm(v), Cm = vmul(d, 1.54); at.push(["C", Cm]);
      tetraDirs(Cm, vmul(d, -1), Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]).forEach(function(h){ at.push(["H", h]); });
    });
  }
  return at;
}
/* une espèce → liste de sphères {el, p, r} dans son repère */
function cbLondonMol(key){
  var D = CB_LS[key];
  if (key === "pent" || key === "neo") return cbAlkane(key).map(function(a){ return {el:a[0], p:a[1], r:CB_VDW[a[0]]}; });
  if (D.b) return [{el:"X", p:[0, D.b / 2, 0], r:D.r}, {el:"X", p:[0, -D.b / 2, 0], r:D.r}];
  return [{el:"X", p:[0, 0, 0], r:D.r}];
}
/* distance de contact entre deux molécules identiques translatées selon x (sphères de van der Waals tangentes) */
function cbContact(m){
  var best = 0;
  m.forEach(function(a){ m.forEach(function(b){
    var dx = a.p[0] - b.p[0], dy = a.p[1] - b.p[1], dz = a.p[2] - b.p[2], s = Math.pow(a.r + b.r, 2) - dy * dy - dz * dz;
    if (s > 0) best = Math.max(best, dx + Math.sqrt(s));
  }); });
  return best;
}
function cbPairSum(m, t){ var S = 0; m.forEach(function(a){ m.forEach(function(b){ var d = vlen(vsub(vadd(b.p, [t, 0, 0]), a.p)); S += Math.pow(d, -6); }); }); return S; }
function cbHH(m, t, cut){ var n = 0, L = []; m.forEach(function(a, i){ m.forEach(function(b, j){ if (a.el === "H" && b.el === "H"){ var d = vlen(vsub(vadd(b.p, [t, 0, 0]), a.p)); if (d < cut){ n++; L.push([i, j]); } } }); }); return {n:n, L:L}; }
function cbGauss(){ var u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * v); }

SFA.sim({
  id:"ch-london-dipoles", ch:"c04", tag:"Forces intermoléculaires",
  titre:"Dipôles instantanés : les forces de London en direct",
  resume:"Le nuage électronique d'une molécule apolaire n'est jamais immobile : à chaque instant, il penche d'un côté (δ−) et laisse l'autre découvert (δ+). Ce dipôle instantané en induit un dans la molécule voisine, et les deux s'attirent. Grossis le nuage (He → Xe, F₂ → I₂) ou change la forme (pentane, néopentane) et place la température d'ébullition sur l'échelle.",
  but:"Regarde les deux molécules : leurs nuages changent de couleur à chaque instant (rouge = δ−, bleu = δ+), et la molécule de droite suit celle de gauche. Choisis une série et une espèce : plus le nuage est gros (plus d'électrons, plus loin du noyau), plus il se déforme et plus la température d'ébullition monte sur l'échelle du bas. Attrape la molécule de droite pour l'éloigner : l'attraction chute très vite (en 1/r⁶). Avec le pentane et le néopentane (même formule), compte les contacts entre les deux molécules. Glisse ailleurs pour tourner la vue.",
  aRetenir:"Les forces de London (dispersion) existent entre toutes les molécules, même apolaires. Elles viennent de dipôles instantanés : la fluctuation du nuage d'une molécule crée un champ qui polarise sa voisine ; les deux dipôles restent orientés pour s'attirer. Leur intensité croît avec la polarisabilité α (un gros nuage, avec beaucoup d'électrons loin du noyau, se déforme facilement) : Téb He 4 K, Ar 87 K, Xe 165 K ; F₂ 85 K, Cl₂ 239 K, Br₂ 332 K, I₂ 458 K (I₂ est solide à 25 °C). Elles dépendent aussi de la surface de contact : à même formule C₅H₁₂, le pentane allongé bout à 36 °C, le néopentane presque sphérique à 9,5 °C. L'attraction décroît en 1/r⁶ : elle n'agit qu'au contact.",
  piege:"« Apolaire » ne veut pas dire « sans attraction » : le diiode est un solide à température ambiante uniquement grâce aux forces de London. Le dipôle instantané change de sens en permanence (en moyenne, il est nul) : ce n'est pas un dipôle permanent comme celui de HCl. Et c'est la polarisabilité (taille du nuage) qui compte, pas la masse en tant que telle : la masse grandit en même temps, mais ce n'est pas elle qui attire.",
  build:function(k, S){
    var c = cbCanvas(k, 0.66, 1.0), g = cbCanvasH(k, 150, 160);
    var V = cbView(0, 0.12), st = {t:0, gap:0.2, drag:null, spin:true, sp:0, q1:[0, 0, 0], q2:[0, 0, 0], p1:[0, 0, 0], p2:[0, 0, 0], bg:[]};
    var sS = k.seg("Comparer", [["gaz", "Gaz nobles"], ["hal", "Dihalogènes"], ["forme", "Même formule, autre forme"]], "gaz");
    var eG = k.seg("Atome", CB_SERIES.gaz.map(function(x){ return [x, CB_LS[x].f]; }), "Ar"), bG = cbLastCtl(k);
    var eH = k.seg("Molécule", CB_SERIES.hal.map(function(x){ return [x, CB_LS[x].f]; }), "Cl2"), bH = cbLastCtl(k);
    var eF = k.seg("Molécule", [["pent", "pentane (chaîne)"], ["neo", "néopentane (boule)"]], "pent"), bF = cbLastCtl(k);
    var gS = k.slider("Écart entre les deux nuages", 0, 300, 5, 20, "pm", function(v){ st.gap = v / 100; });
    var dT = k.toggle("Montrer δ+ et δ− instantanés", true);
    var sT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Espèce", "Électrons", "Polarisabilité α′", "Attraction (100 % = au contact)", "ΔvapH (mesurée)", "Téb (1 atm)"]);
    var nt = k.note("", "ok");
    c.cv.style.cursor = "grab";
    function key(){ return sS.value === "gaz" ? eG.value : sS.value === "hal" ? eH.value : eF.value; }
    var cache = {};
    function mol(kk){ if (!cache[kk]){ var m = cbLondonMol(kk), d0 = cbContact(m); cache[kk] = {m:m, d0:d0, S0:cbPairSum(m, d0)}; } return cache[kk]; }
    /* échelle commune à une série : la plus grosse espèce, écartée au maximum, tient dans le cadre */
    function ext(ser){ var ex = 0, ey = 0; CB_SERIES[ser].forEach(function(kk){ var M = mol(kk), Rx = 0, Ry = 0; M.m.forEach(function(a){ Rx = Math.max(Rx, Math.abs(a.p[0]) + a.r); Ry = Math.max(Ry, Math.abs(a.p[1]) + a.r, Math.abs(a.p[2]) + a.r); }); ex = Math.max(ex, M.d0 + 2.2 + 2 * Rx); ey = Math.max(ey, 2 * Ry); }); return [ex, ey]; }
    for (var i = 0; i < 16; i++) st.bg.push({x:Math.random(), y:Math.random(), z:Math.random(), vx:(Math.random() - 0.5) * 0.02, vy:(Math.random() - 0.5) * 0.02, ph:Math.random() * 7});
    c.pointer(function(type, p){
      if (type === "down"){
        st.lx = p.x; st.ly = p.y; st.moved = 0;
        st.drag = st.Bscr && Math.hypot(p.x - st.Bscr[0], p.y - st.Bscr[1]) < st.Brad ? "B" : "view";
        if (st.drag === "B") c.cv.style.cursor = "grabbing";
        return;
      }
      if (type === "drag" && st.drag){
        var dx = p.x - st.lx, dy = p.y - st.ly; st.moved += Math.abs(dx) + Math.abs(dy);
        if (st.drag === "B" && st.ex){ var l2 = st.ex[0] * st.ex[0] + st.ex[1] * st.ex[1]; if (l2 > 4){ st.gap = Math.max(0, Math.min(3, st.gap + (dx * st.ex[0] + dy * st.ex[1]) / l2)); gS.set(Math.round(st.gap * 20) * 5); } }
        else { V.a += dx * 0.01; V.b = Math.max(-1.3, Math.min(1.3, V.b + dy * 0.01)); if (st.spin && st.moved > 4){ st.spin = false; sT.set(false); } }
        st.lx = p.x; st.ly = p.y; return;
      }
      if (type === "up"){ st.drag = null; c.cv.style.cursor = "grab"; }
    });
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.spin && !st.drag){ st.sp += dt; V.a = 0.45 * Math.sin(st.sp * 0.3); V.b = 0.12 + 0.1 * Math.sin(st.sp * 0.21); }
      /* fluctuations : processus d'Ornstein-Uhlenbeck (temps de corrélation 0,35 s à l'écran) */
      var tau = 0.35, f = Math.exp(-dt / tau), sg = Math.sqrt(1 - f * f);
      for (var j = 0; j < 3; j++){ st.q1[j] = st.q1[j] * f + sg * cbGauss(); st.q2[j] = st.q2[j] * f + sg * cbGauss(); }
      /* dipôle induit : champ d'un dipôle sur l'axe (×1) et de côté (×−½), décroissant en 1/r³ */
      var M = mol(key()), d = M.d0 + st.gap, G = 0.85 * Math.pow(M.d0 / d, 3);
      function Tf(v){ return [v[0], -0.5 * v[1], -0.5 * v[2]]; }
      st.p1 = vadd(st.q1, vmul(Tf(st.q2), 0.2 * G));
      st.p2 = vadd(vmul(st.q2, 0.3), vmul(Tf(st.p1), G));
      st.bg.forEach(function(b){ b.x = (b.x + b.vx * dt + 1) % 1; b.y = (b.y + b.vy * dt + 1) % 1; });
      k.redraw();
    });
    lp.play();
    /* une molécule : sphères ombrées + teinte δ+/δ− le long du dipôle instantané */
    function drawMol(ctx, list, M, off, pvec, amp, D, alpha){
      var proj = M.m.map(function(a){ return cbPrj(V, vadd(a.p, off)); }), c0 = cbPrj(V, off), pe = cbPrj(V, vadd(off, [pvec[0], pvec[1], pvec[2]]));
      var ux = pe[0] - c0[0], uy = pe[1] - c0[1], ul = Math.hypot(ux, uy) || 1, mag = Math.min(1, vlen(pvec) * amp);
      ux /= ul; uy /= ul;
      var Rpx = 0; M.m.forEach(function(a, i){ Rpx = Math.max(Rpx, Math.hypot(proj[i][0] - c0[0], proj[i][1] - c0[1]) + a.r * V.sc * proj[i][5]); });
      var shift = dT.value ? mag * 0.13 : 0;
      var alk = M.m[0].el === "C";
      if (alk){
        /* squelette (boules et bâtons) devant, enveloppe de van der Waals translucide derrière */
        M.m.forEach(function(a, i){ M.m.forEach(function(b, j){
          var L = vlen(vsub(a.p, b.p));
          if (j <= i || L > 1.6 || (a.el === "H" && b.el === "H")) return;
          var p = proj[i], q = proj[j];
          list.push({z:(p[2] + q[2]) / 2 + 20, f:function(){ cbStick(ctx, p, q, Math.max(2.5, V.sc * 0.12), "#8b97aa"); }});
        }); });
        M.m.forEach(function(a, i){ var q = proj[i]; list.push({z:q[2] + 20.01, f:function(){ cbBall(ctx, q[0], q[1], Math.max(3, (a.el === "C" ? 0.34 : 0.24) * V.sc * q[5]), a.el === "C" ? "#3a4558" : "#f2f5f9"); }}); });
      }
      M.m.forEach(function(a, i){
        var q = proj[i], r = a.r * V.sc * q[5], base = alk ? (off[0] < 0 ? "#9db7e0" : "#e3c79f") : D.col;
        if (alk) alpha = 0.3;
        list.push({z:q[2] - (alk ? 20 : 0), f:function(){
          var x = q[0] + ux * shift * r, y = q[1] + uy * shift * r;
          ctx.save(); ctx.globalAlpha = alpha;
          cbBall(ctx, x, y, r, base);
          if (dT.value && mag > 0.02){
            ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
            var gx0 = c0[0] - ux * Rpx, gy0 = c0[1] - uy * Rpx, gx1 = c0[0] + ux * Rpx, gy1 = c0[1] + uy * Rpx, gr = ctx.createLinearGradient(gx0, gy0, gx1, gy1), a1 = 0.72 * mag;
            gr.addColorStop(0, "rgba(59,130,246," + a1 + ")"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(239,68,68," + a1 + ")");
            ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
          }
          ctx.restore();
          /* noyau(x) des atomes isolés et des dihalogènes : le nuage glisse, le noyau reste */
          if (a.el === "X"){ cbBall(ctx, q[0], q[1], Math.max(2.5, r * 0.08), "#fff4c2"); }
        }});
      });
      return {c:c0, R:Rpx, ux:ux, uy:uy, mag:mag};
    }
    k.draw(function(){
      var ser = sS.value, kk = key(), D = CB_LS[kk], M = mol(kk), ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      bG.style.display = ser === "gaz" ? "" : "none"; bH.style.display = ser === "hal" ? "" : "none"; bF.style.display = ser === "forme" ? "" : "none";
      c.clear(); cbStudio(ctx, W, H, "#22314d", "#060a13");
      /* molécules du liquide, floues, en arrière-plan */
      st.bg.forEach(function(b){
        var x = b.x * W, y = b.y * H * 0.85, r = (6 + b.z * 10) * (D.r ? D.r / 1.8 : 1.4), tw = Math.sin(st.t * 2.3 + b.ph);
        ctx.save(); cbBall(ctx, x, y, r, D.col, 0.1 + 0.08 * b.z);
        ctx.globalAlpha = 0.12 * Math.abs(tw); ctx.fillStyle = tw > 0 ? "#ef4444" : "#3b82f6"; ctx.beginPath(); ctx.arc(x + r * 0.4 * (tw > 0 ? 1 : -1), y, r * 0.6, 0, 7); ctx.fill(); ctx.restore();
      });
      var E = ext(ser);
      V.cx = W / 2; V.cy = H * (ph ? 0.44 : 0.45); V.sc = Math.min(W * 0.94 / E[0], H * 0.62 / E[1]); V.per = 0.03;
      var d = M.d0 + st.gap, A = [-d / 2, 0, 0], B = [d / 2, 0, 0], amp = 0.55 * Math.sqrt(D.a / 10.3) + 0.25;
      /* ombre au sol */
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.33)"; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.83, Math.min(W * 0.44, V.sc * (d / 2 + 3)), H * 0.03, 0, 0, 7); ctx.fill(); ctx.restore();
      var list = [], mA = drawMol(ctx, list, M, A, st.p1, amp, D, 0.97), mB = drawMol(ctx, list, M, B, st.p2, amp, D, 0.97);
      /* contacts H···H (alcanes) */
      var hh = ser === "forme" ? cbHH(M.m, d, 3.0) : null;
      cbPaint(ctx, list);
      if (hh){
        ctx.save(); ctx.strokeStyle = "rgba(255,226,140,.85)"; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]);
        hh.L.forEach(function(pr){ var a = cbPrj(V, vadd(M.m[pr[0]].p, A)), b = cbPrj(V, vadd(M.m[pr[1]].p, B)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
        ctx.restore();
      }
      /* attraction instantanée entre les deux dipôles : lueur entre les nuages */
      var Srel = cbPairSum(M.m, d) / M.S0, inst = Math.max(0, st.p1[0] * st.p2[0] - 0.5 * (st.p1[1] * st.p2[1] + st.p1[2] * st.p2[2]));
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      var mx = (mA.c[0] + mB.c[0]) / 2, my = (mA.c[1] + mB.c[1]) / 2;
      cbGlow(ctx, mx, my, Math.max(20, Math.min(mA.R, 90)), "255,215,120", Math.min(0.55, (0.15 + 0.5 * Math.min(1, inst)) * Srel));
      ctx.restore();
      /* étiquettes δ+ / δ− */
      if (dT.value) [mA, mB].forEach(function(m){
        if (m.mag < 0.28) return;
        var dd = m.R * 0.6, al = Math.min(1, (m.mag - 0.28) * 3);
        ctx.save(); ctx.globalAlpha = al;
        cbText(ctx, "δ−", m.c[0] + m.ux * dd, m.c[1] + m.uy * dd, {size:ph ? 13 : 16, color:"#ff8a8a", w:800, halo:"rgba(6,10,19,.8)"});
        cbText(ctx, "δ+", m.c[0] - m.ux * dd, m.c[1] - m.uy * dd, {size:ph ? 13 : 16, color:"#8ab8ff", w:800, halo:"rgba(6,10,19,.8)"});
        ctx.restore();
      });
      st.Bscr = mB.c; st.Brad = Math.max(28, mB.R); var o0 = cbPrj(V, [0, 0, 0]), o1 = cbPrj(V, [0.5, 0, 0]); st.ex = [o1[0] - o0[0], o1[1] - o0[1]];
      /* jauge d'attraction */
      var gx = ph ? 12 : 14, gy = H - (ph ? 26 : 30), gw = Math.min(W * 0.42, 220);
      cbText(ctx, "attraction", gx, gy - 12, {size:ph ? 10 : 11, color:"#c9d6ea", align:"left", w:700});
      cbRR(ctx, gx, gy - 4, gw, 9, 4.5); ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fill();
      cbRR(ctx, gx, gy - 4, Math.max(2, gw * Srel), 9, 4.5); var gg = ctx.createLinearGradient(gx, 0, gx + gw, 0); gg.addColorStop(0, "#f5a524"); gg.addColorStop(1, "#ffe08a"); ctx.fillStyle = gg; ctx.fill();
      cbText(ctx, Math.round(Srel * 100) + " %", gx + gw + 8, gy, {size:ph ? 10.5 : 11.5, color:"#fff", align:"left", w:800});
      cbTag(ctx, D.nm + " · " + D.f + " · " + D.ne + " électrons", 10, 18, {align:"left", bg:"rgba(255,255,255,.13)", color:"#fff", size:ph ? 11.5 : 13});
      if (hh) cbTag(ctx, hh.n + " contacts H···H < 3 Å", W - 10, H - (ph ? 26 : 30), {align:"right", bg:"rgba(255,226,140,.95)", color:"#2a1d00", size:ph ? 11 : 12});
      if (!ph) cbText(ctx, "attrape la molécule de droite · glisse ailleurs pour tourner", W - 10, 44, {size:10.5, color:"#8fa0ba", align:"right"});
      cbText(ctx, "film ralenti ≈ 10¹⁵ fois, dipôles exagérés", ph ? 12 : W / 2, ph ? H - 8 : H - 10, {size:ph ? 9 : 10, color:"#7f8ea5", align:ph ? "left" : "center", w:600});
      /* échelle des températures d'ébullition */
      var gc = g.ctx, GW = g.W, GH = g.H, gph = GW < 480;
      g.clear(); gc.fillStyle = "#fbfcfe"; gc.fillRect(0, 0, GW, GH);
      var x0 = 30, x1 = GW - 22, yb = GH * (gph ? 0.66 : 0.64), Xk = function(T){ return x0 + T / 500 * (x1 - x0); };
      cbText(gc, "température d'ébullition sous 1 atm", x0 - 14, 12, {size:10.5, color:"#2c3a4e", align:"left", w:800});
      /* thermomètre horizontal */
      cbRR(gc, x0 - 14, yb - 7, x1 - x0 + 20, 14, 7); var tg = gc.createLinearGradient(x0, 0, x1, 0); tg.addColorStop(0, "#4f8dfd"); tg.addColorStop(0.6, "#f5c84b"); tg.addColorStop(1, "#ef6a3a"); gc.fillStyle = tg; gc.globalAlpha = 0.85; gc.fill(); gc.globalAlpha = 1;
      gc.save(); gc.font = cbFont(600, 9.5); gc.fillStyle = "#6b7685"; gc.textAlign = "center"; gc.textBaseline = "top";
      for (var T = 0; T <= 500; T += 100){ gc.fillRect(Xk(T) - 0.5, yb + 7, 1, 5); gc.fillText(T + " K", Xk(T), yb + 13); }
      gc.restore();
      gc.save(); gc.strokeStyle = "#1f2a3d"; gc.setLineDash([3, 3]); gc.beginPath(); gc.moveTo(Xk(298.15), yb - 12); gc.lineTo(Xk(298.15), yb + 8); gc.stroke(); gc.restore();
      cbTag(gc, "25 °C", Xk(298.15), yb + 33, {size:9.5, bg:"#1f2a3d", color:"#fff"});
      CB_SERIES[ser].forEach(function(x, i){
        var Dx = CB_LS[x], on = x === kk, X = Xk(Dx.Tb), ly = yb - (i % 2 === 0 ? 24 : 48);
        gc.save(); gc.strokeStyle = on ? "#0f1b2d" : "#9aa5b4"; gc.lineWidth = on ? 1.6 : 1; gc.beginPath(); gc.moveTo(X, yb - 7); gc.lineTo(X, ly + 6); gc.stroke(); gc.restore();
        cbBall(gc, X, yb, on ? 7 : 4.5, on ? "#0f1b2d" : "#ffffff");
        cbTag(gc, ser === "forme" ? Dx.nm.toLowerCase() : Dx.f, X, ly, {size:on ? 11.5 : 10, bg:on ? "#0f1b2d" : "rgba(255,255,255,.95)", color:on ? "#fff" : "#4a5566", stroke:on ? null : "#d6dde7"});
      });
      /* afficheurs */
      ro.set(0, D.nm + " " + D.f);
      ro.set(1, String(D.ne));
      ro.set(2, cbFmt(D.a, D.a < 1 ? 3 : 2) + " Å³");
      ro.set(3, Math.round(Srel * 100) + " %");
      ro.set(4, cbFmt(D.H, D.H < 1 ? 3 : 2) + " kJ/mol");
      ro.set(5, cbFmt(D.Tb - 273.15, 1) + " °C (" + cbFmt(D.Tb, 1) + " K)");
      var msg;
      if (ser === "forme"){
        var other = kk === "pent" ? "neo" : "pent", Mo = mol(other), ho = cbHH(Mo.m, Mo.d0, 3.0).n, hc = cbHH(M.m, M.d0, 3.0).n;
        msg = (kk === "pent" ? "Deux chaînes de pentane couchées côte à côte se touchent sur toute leur longueur : " + hc + " contacts H···H au contact, contre " + ho + " pour deux néopentanes (des boules qui ne se touchent qu'en un point)." : "Deux néopentanes presque sphériques ne se touchent qu'en un point : " + hc + " contacts H···H au contact, contre " + ho + " pour deux pentanes couchés côte à côte.") +
          " Même formule C₅H₁₂, même nombre d'électrons et α′ presque égale : c'est la surface de contact qui fait la différence. Téb : pentane 36,1 °C, néopentane 9,5 °C.";
      } else {
        var L = CB_SERIES[ser], i0 = L.indexOf(kk);
        msg = D.nm + " : " + D.ne + " électrons, α′ = " + cbFmt(D.a, D.a < 1 ? 3 : 2) + " Å³" + (kk === "I2" ? " (valeur calculée)" : "") + ". " +
          (i0 === 0 ? "C'est le plus petit nuage de la série, tenu serré près des noyaux : il se déforme à peine, les forces de London sont minimes et l'ébullition a lieu à " + cbFmt(D.Tb, 1) + " K." :
            "Par rapport à " + CB_LS[L[i0 - 1]].f + ", le nuage est plus gros et plus déformable : α′ × " + cbFmt(D.a / CB_LS[L[i0 - 1]].a, 1) + ", Téb passe de " + cbFmt(CB_LS[L[i0 - 1]].Tb, 0) + " à " + cbFmt(D.Tb, 0) + " K.") +
          (D.Tb > 298.15 ? " Au-dessus de 25 °C : " + D.f + " n'est pas un gaz à température ambiante." : "");
      }
      if (st.gap > 0.6) msg += " À cet écart, il ne reste que " + Math.round(Srel * 100) + " % de l'attraction : en 1/r⁶, doubler la distance divise l'attraction par 64.";
      nt.set(msg, "ok");
    });
  }
});


/* ====================================================================== */
/* 3. ch-eau-ponts-h-3d : réseau de ponts hydrogène, glace et eau liquide  */
/* ====================================================================== */
/* Glace Ih : maille hexagonale a = 4,518 Å, c = 7,356 Å (positions de type wurtzite, O–O = 2,76 Å), boîte périodique
   3 × 2 × 2 mailles orthohexagonales = 96 molécules. Les H suivent les règles de la glace (2 donneurs, 2 accepteurs par O),
   obtenues en orientant les liaisons le long d'un circuit eulérien du réseau (chaque sommet a 4 voisins). */
var CB_ICE_A = 4.518, CB_ICE_C = 7.356;
function cbKell(T){ return (999.83952 + 16.945176 * T - 7.9870401e-3 * T * T - 46.170461e-6 * T * T * T + 105.56302e-9 * Math.pow(T, 4) - 280.54253e-12 * Math.pow(T, 5)) / (1 + 16.879850e-3 * T) / 1000; }
function cbRhoIce(T){ return 0.9167 / (1 + 1.59e-4 * T); }
function cbRhoW(T){ return T < 0 ? cbRhoIce(T) : cbKell(T); }
/* nombre moyen de ponts H auxquels participe une molécule (modèle : 4 dans la glace ; ≈ 3,7 à 0 °C, ≈ 3,2 à 100 °C) */
function cbNHB(T){ return T < 0 ? 4 : 3.7 - 0.005 * T; }
function cbIce(nx, ny, nz){
  var a = CB_ICE_A, c = CB_ICE_C, s3 = Math.sqrt(3), L = [nx * a, ny * s3 * a, nz * c], P = [];
  var base = [[1 / 3, 2 / 3, 0], [2 / 3, 1 / 3, 0.5], [1 / 3, 2 / 3, 3 / 8], [2 / 3, 1 / 3, 7 / 8]];
  for (var i = 0; i < nx; i++) for (var j = 0; j < ny; j++) for (var k = 0; k < nz; k++)
    [[0, 0], [a / 2, s3 * a / 2]].forEach(function(sh){ base.forEach(function(f){
      P.push([((a * (f[0] - f[1] / 2) + sh[0] + i * a) % L[0] + L[0]) % L[0], (a * s3 / 2 * f[1] + sh[1] + j * s3 * a) % L[1], (c * f[2] + k * c) % L[2]]);
    }); });
  function mi(d){ return [d[0] - L[0] * Math.round(d[0] / L[0]), d[1] - L[1] * Math.round(d[1] / L[1]), d[2] - L[2] * Math.round(d[2] / L[2])]; }
  var E = [], adj = P.map(function(){ return []; });
  for (var p = 0; p < P.length; p++) for (var q = p + 1; q < P.length; q++){
    var d = mi(vsub(P[q], P[p]));
    if (vlen(d) < 3.0){ adj[p].push(E.length); adj[q].push(E.length); E.push({a:p, b:q, v:d}); }
  }
  /* circuit eulérien (Hierholzer) : on oriente chaque liaison dans le sens de parcours → donneur → accepteur */
  var used = E.map(function(){ return false; }), ptr = P.map(function(){ return 0; }), stack = [[0, -1]], seed = 7;
  function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  adj.forEach(function(l){ for (var i = l.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)), t = l[i]; l[i] = l[j]; l[j] = t; } });
  while (stack.length){
    var top = stack[stack.length - 1], v = top[0];
    while (ptr[v] < adj[v].length && used[adj[v][ptr[v]]]) ptr[v]++;
    if (ptr[v] < adj[v].length){
      var ei = adj[v][ptr[v]], e = E[ei]; used[ei] = true;
      var w = e.a === v ? e.b : e.a; e.don = v; e.acc = w; stack.push([w, ei]);
    } else stack.pop();
  }
  E.forEach(function(e){ if (e.don === e.b){ e.v = vmul(e.v, -1); } else { e.don = e.a; e.acc = e.b; } });
  /* anneau hexagonal (chaise) à mettre en valeur : cycle de 6 près du centre */
  function ring(){
    var ctr = vmul(L, 0.5), start = 0, bd = 1e9;
    P.forEach(function(p, i){ var d = vlen(vsub(p, ctr)); if (d < bd){ bd = d; start = i; } });
    var nb = function(v){ return adj[v].map(function(ei){ var e = E[ei]; return e.a === v ? e.b : e.a; }); };
    var best = null;
    (function dfs(path){
      if (best) return;
      var v = path[path.length - 1];
      if (path.length === 6){ if (nb(v).indexOf(start) >= 0) best = path.slice(); return; }
      nb(v).forEach(function(w){ if (path.indexOf(w) < 0) dfs(path.concat([w])); });
    })([start]);
    return best;
  }
  return {P:P, E:E, adj:adj, L:L, ring:ring(), mi:mi};
}

SFA.sim({
  id:"ch-eau-ponts-h-3d", ch:"c04", tag:"Liaison hydrogène",
  titre:"L'eau en 3D : des ponts hydrogène qui se font et se défont",
  resume:"Une boîte de 96 molécules d'eau en 3D. Les ponts hydrogène (pointillés) se cassent et se reforment sans arrêt dans le liquide ; en dessous de 0 °C, ils se figent en un réseau hexagonal ouvert : la glace prend plus de place et flotte.",
  but:"Glisse sur la boîte pour la tourner. Règle la température : au-dessus de 0 °C, les molécules bougent et les ponts H clignotent (un éclair jaune = un pont qui se forme). Lis le nombre moyen de ponts par molécule. Descends sous 0 °C : chaque molécule s'accroche à exactement 4 voisines et le réseau devient régulier. Clique sur « Regarder le long de l'axe c » pour voir les canaux hexagonaux, puis compare la masse volumique sur la courbe.",
  aRetenir:"Un pont hydrogène relie un H lié à un atome très électronégatif (O, N, F) au doublet non liant d'un autre O, N ou F : O–H···O. Chaque molécule d'eau peut en former 4 (2 par ses H, 2 par ses doublets), en tétraèdre. Dans la glace, ces 4 ponts sont tous formés et figés : le réseau hexagonal est ouvert, plein de vides, d'où ρ ≈ 0,917 g/cm³. À la fusion, une partie des ponts se casse, les molécules se rapprochent en moyenne : ρ ≈ 1,000 g/cm³ (maximum à 4 °C). La glace flotte et l'eau gèle par le haut. Dans le liquide, il reste en moyenne 3 à 4 ponts par molécule, qui se font et se défont en environ 10⁻¹² s : c'est ce qui donne à l'eau son Téb élevé (100 °C, contre −60 °C pour H₂S).",
  piege:"Un pont hydrogène n'est pas une liaison covalente : O–H mesure 96 pm et vaut ≈ 460 kJ/mol, H···O mesure ≈ 180 pm et vaut ≈ 20 kJ/mol. Fondre la glace ne casse pas les molécules d'eau, seulement une partie des ponts entre elles. Et l'eau liquide n'est pas « sans ponts H » : elle en garde la grande majorité, ils changent simplement de partenaire sans arrêt.",
  build:function(k, S){
    var c = cbCanvas(k, 0.8, 1.08), g = cbCanvasH(k, 170, 200);
    var ICE = cbIce(3, 2, 2), N = ICE.P.length, NE = ICE.E.length;
    var V = cbView(0.6, 0.42), st = {t:0, spin:true, sp:0, melt:1, aim:null, flash:[]};
    var tS = k.slider("Température", -20, 100, 1, 25, "°C");
    k.button("Regarder le long de l'axe c (hexagones)", function(){ st.aim = [0, 0]; st.spin = false; sT.set(false); });
    k.button("Vue en perspective", function(){ st.aim = [0.6, 0.42]; });
    var sT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var oT = k.toggle("Montrer un anneau hexagonal (glace)", true);
    var ro = k.readouts(["État", "Ponts H par molécule (moyenne)", "Ponts formés dans la boîte", "Masse volumique ρ", "Volume de 18 g (1 mol)"]);
    var nt = k.note("", "ok");
    c.cv.style.cursor = "grab";
    /* état de chaque pont et désordre de chaque molécule */
    var on = ICE.E.map(function(){ return true; }), born = ICE.E.map(function(){ return -9; }), seed = 11;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var dis = ICE.P.map(function(){ return [0, 0, 0]; }), wob = ICE.P.map(function(){ return [0, 0, 0]; });
    function gauss(){ var u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * v); }
    /* départ à l'équilibre : la bonne fraction de ponts déjà cassée */
    (function(){ var p = cbNHB(tS.value) / 4; on = on.map(function(){ return rnd() < p; }); st.melt = tS.value < 0 ? 0 : 1; })();
    c.pointer(function(type, p){
      if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; st.aim = null; return; }
      if (type === "drag" && st.drag){ V.a += (p.x - st.lx) * 0.01; V.b = Math.max(-1.5, Math.min(1.5, V.b + (p.y - st.ly) * 0.01)); if (st.spin){ st.spin = false; sT.set(false); } st.lx = p.x; st.ly = p.y; return; }
      if (type === "up") st.drag = false;
    });
    var lp = k.loop(function(dt){
      st.t += dt; var T = tS.value, liq = T >= 0;
      if (st.spin && !st.drag && !st.aim){ st.sp += dt; V.a += dt * 0.18; V.b = 0.42 + 0.12 * Math.sin(st.sp * 0.3); }
      if (st.aim){ V.a += (st.aim[0] - V.a) * Math.min(1, dt * 4); V.b += (st.aim[1] - V.b) * Math.min(1, dt * 4); if (Math.abs(st.aim[0] - V.a) + Math.abs(st.aim[1] - V.b) < 0.002) st.aim = null; }
      st.melt += ((liq ? 1 : 0) - st.melt) * Math.min(1, dt * 1.6);
      /* ponts : processus à deux états, fraction formée p = n/4, temps de vie ≈ 1,2 s à l'écran */
      var p = cbNHB(T) / 4, tau = 1.2;
      for (var i = 0; i < NE; i++){
        if (on[i]){ if (rnd() < dt * (1 - p) / tau){ on[i] = false; } }
        else if (rnd() < dt * p / tau){ on[i] = true; born[i] = st.t; }
      }
      /* agitation : vibration (glace) et désordre lent (liquide) */
      var vib = 0.05 + 0.0012 * (T + 20), sd = 0.42 * st.melt * (1 + T / 200), f = Math.exp(-dt / 1.4), sg = Math.sqrt(1 - f * f);
      for (var m = 0; m < N; m++) for (var q = 0; q < 3; q++){ dis[m][q] = dis[m][q] * f + sg * sd * gauss(); wob[m][q] = vib * gauss() * 0.6 + wob[m][q] * 0.4; }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, T = tS.value, liq = T >= 0, rho = cbRhoW(T), L = ICE.L;
      /* même nombre de molécules : la boîte se dilate comme 1/ρ (référence : la glace à 0 °C) */
      var sBox = Math.pow(cbRhoIce(0) / rho, 1 / 3), ctr = vmul(L, 0.5);
      c.clear(); cbStudio(ctx, W, H, "#1f3450", "#050a12");
      V.cx = W / 2; V.cy = H * 0.5; V.sc = Math.min(W, H) * 0.98 / (vlen(L) * 1.0); V.per = 0.022;
      function pos(i){ return vmul(vadd(vsub(ICE.P[i], ctr), vadd(dis[i], wob[i])), sBox); }
      var Pm = ICE.P.map(function(_, i){ return pos(i); }), list = [];
      /* boîte en verre */
      var hx = L[0] / 2 * sBox, hy = L[1] / 2 * sBox, hz = L[2] / 2 * sBox, cn = [];
      for (var q = 0; q < 8; q++) cn.push(cbPrj(V, [q & 1 ? hx : -hx, q & 2 ? hy : -hy, q & 4 ? hz : -hz]));
      [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function(e){
        var a = cn[e[0]], b = cn[e[1]];
        list.push({z:(a[2] + b[2]) / 2 - 30, f:function(){ ctx.save(); ctx.strokeStyle = "rgba(170,210,255,.28)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); }});
      });
      /* molécules : O–H dirigés vers les deux accepteurs ; un H dont le pont est cassé pivote de 35° */
      var Hpos = ICE.P.map(function(){ return []; }), cnt = 0, rO = 0.42, rH = 0.25;
      ICE.E.forEach(function(e, i){
        var d = e.don, A = e.acc, v = vnrm(vadd(e.v, vsub(vadd(dis[A], wob[A]), vadd(dis[d], wob[d]))));
        if (!on[i]){ var ax = vnrm(vcross(v, [0.3, 0.8, 0.5])); v = vrot(v, ax, 0.62 * Math.max(0.35, st.melt)); }
        var Hp = vadd(Pm[d], vmul(v, 0.96 * sBox));
        Hpos[d].push(Hp);
        if (on[i]) cnt++;
        /* le pont H n'est dessiné que s'il ne traverse pas la paroi de la boîte */
        var Ap = vadd(Pm[d], vmul(e.v, sBox)), inside = vlen(vsub(Ap, Pm[A])) < 1.0;
        var ph1 = cbPrj(V, Hp), pa = cbPrj(V, Pm[A]), age = st.t - born[i];
        if (on[i] && inside) list.push({z:(ph1[2] + pa[2]) / 2 - 0.2, f:function(){
          var fl = age < 0.5 ? 1 - age / 0.5 : 0;
          ctx.save(); ctx.lineCap = "round"; ctx.setLineDash([2.5, 4]);
          ctx.strokeStyle = fl > 0 ? "rgba(255,226,110," + (0.55 + 0.45 * fl) + ")" : "rgba(120,220,255,.78)"; ctx.lineWidth = 1.6 + 2 * fl;
          ctx.beginPath(); ctx.moveTo(ph1[0], ph1[1]); ctx.lineTo(pa[0], pa[1]); ctx.stroke(); ctx.restore();
        }});
      });
      Pm.forEach(function(O, i){
        var po = cbPrj(V, O);
        list.push({z:po[2], f:function(){ cbBall(ctx, po[0], po[1], Math.max(3, rO * V.sc * po[5]), "#e0453a"); }});
        Hpos[i].forEach(function(Hp){
          var phh = cbPrj(V, Hp);
          list.push({z:(po[2] + phh[2]) / 2 - 0.01, f:function(){ cbStick(ctx, po, phh, Math.max(1.6, V.sc * 0.1), "#d9dee6"); }});
          list.push({z:phh[2] + 0.01, f:function(){ cbBall(ctx, phh[0], phh[1], Math.max(2, rH * V.sc * phh[5]), "#f4f6f9"); }});
        });
      });
      /* anneau hexagonal de la glace */
      var ice = 1 - st.melt;
      if (oT.value && ICE.ring && ice > 0.05){
        var rp = ICE.ring.map(function(i){ return cbPrj(V, Pm[i]); }), zr = 0; rp.forEach(function(p){ zr += p[2] / 6; });
        list.push({z:zr + 0.5, f:function(){
          ctx.save(); ctx.globalAlpha = ice; ctx.beginPath(); rp.forEach(function(p, j){ j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath();
          ctx.fillStyle = "rgba(255,226,150,.1)"; ctx.fill(); ctx.shadowColor = "rgba(255,211,107,.9)"; ctx.shadowBlur = 10; ctx.strokeStyle = "rgba(255,211,107,.95)"; ctx.lineWidth = 2.6; ctx.stroke(); ctx.restore();
        }});
      }
      cbPaint(ctx, list);
      var nMean = 2 * cnt / N;
      /* étiquettes */
      cbTag(ctx, (liq ? "Eau liquide" : "Glace Ih") + " · " + cbFmt(T, 0) + " °C", 10, 18, {align:"left", bg:"rgba(255,255,255,.13)", color:"#fff", size:ph ? 11.5 : 13});
      cbTag(ctx, "en ce moment : " + cbFmt(nMean, 2) + " ponts H / molécule", W - 10, 18, {align:"right", bg:"rgba(120,220,255,.92)", color:"#05202b", size:ph ? 11.5 : 13});
      var ly = H - 16;
      cbBall(ctx, 17, ly, 5, "#e0453a"); cbText(ctx, "O", 26, ly, {size:10.5, color:"#c9d6ea", align:"left"});
      cbBall(ctx, 44, ly, 4, "#f4f6f9"); cbText(ctx, "H", 52, ly, {size:10.5, color:"#c9d6ea", align:"left"});
      ctx.save(); ctx.setLineDash([2.5, 4]); ctx.strokeStyle = "rgba(120,220,255,.9)"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(70, ly); ctx.lineTo(92, ly); ctx.stroke(); ctx.restore();
      cbText(ctx, ph ? "pont H" : "pont H (O–H···O)", 97, ly, {size:10.5, color:"#c9d6ea", align:"left"});
      if (liq){ ctx.save(); ctx.setLineDash([2.5, 4]); ctx.strokeStyle = "rgba(255,226,110,1)"; ctx.lineWidth = 3; var lx = ph ? 150 : 205; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 22, ly); ctx.stroke(); ctx.restore(); cbText(ctx, ph ? "qui se forme" : "pont qui vient de se former", lx + 27, ly, {size:10.5, color:"#c9d6ea", align:"left"}); }
      if (!ph) cbText(ctx, "glisse pour tourner la boîte", W - 10, 42, {size:10.5, color:"#8fa0ba", align:"right"});
      /* courbe ρ(T) */
      var gc = g.ctx, GW = g.W, GH = g.H, Lm = 50, Rm = 24, Tm = 22, Bm = 28;
      g.clear(); gc.fillStyle = "#fbfcfe"; gc.fillRect(0, 0, GW, GH);
      var X = function(t){ return Lm + (t + 20) / 120 * (GW - Lm - Rm); }, Y = function(r){ return Tm + (1.008 - r) / 0.108 * (GH - Tm - Bm); };
      gc.save(); gc.font = cbFont(600, 9.5); gc.fillStyle = "#6b7685"; gc.textAlign = "center"; gc.textBaseline = "top";
      for (var tt = -20; tt <= 100; tt += 20){ gc.strokeStyle = "#edf0f4"; gc.beginPath(); gc.moveTo(X(tt), Tm); gc.lineTo(X(tt), GH - Bm); gc.stroke(); gc.fillText(tt + " °C", X(tt), GH - Bm + 4); }
      gc.textAlign = "right"; gc.textBaseline = "middle";
      [0.92, 0.94, 0.96, 0.98, 1.0].forEach(function(r){ gc.strokeStyle = "#edf0f4"; gc.beginPath(); gc.moveTo(Lm, Y(r)); gc.lineTo(GW - Rm, Y(r)); gc.stroke(); gc.fillText(cbFmt(r, 2), Lm - 5, Y(r)); });
      gc.restore();
      cbText(gc, "masse volumique ρ (g/cm³)", Lm, 10, {size:10.5, color:"#2c3a4e", align:"left", w:800});
      gc.save(); gc.lineWidth = 2.6; gc.strokeStyle = "#7fb7e6"; gc.beginPath(); for (var t1 = -20; t1 < 0; t1 += 1){ var y1 = Y(cbRhoIce(t1)); t1 === -20 ? gc.moveTo(X(t1), y1) : gc.lineTo(X(t1), y1); } gc.lineTo(X(0), Y(cbRhoIce(0))); gc.stroke();
      gc.strokeStyle = "#2a6fdb"; gc.beginPath(); for (var t2 = 0; t2 <= 100; t2 += 1){ var y2 = Y(cbKell(t2)); t2 === 0 ? gc.moveTo(X(t2), y2) : gc.lineTo(X(t2), y2); } gc.stroke();
      gc.setLineDash([3, 3]); gc.strokeStyle = "#9aa5b4"; gc.lineWidth = 1.2; gc.beginPath(); gc.moveTo(X(0), Y(cbRhoIce(0))); gc.lineTo(X(0), Y(cbKell(0))); gc.stroke(); gc.restore();
      cbText(gc, "glace", X(-15), Y(cbRhoIce(-15)) + 11, {size:10, color:"#3f7fb5", w:800});
      cbText(gc, "eau liquide", X(55), Y(cbKell(55)) - 11, {size:10, color:"#2a6fdb", w:800});
      cbText(gc, "+9 % de volume en gelant", X(1.5), (Y(cbRhoIce(0)) + Y(cbKell(0))) / 2, {size:9.5, color:"#5f6b7a", align:"left", w:700});
      cbBall(gc, X(T), Y(rho), 6.5, liq ? "#2a6fdb" : "#7fb7e6");
      cbTag(gc, cbFmt(rho, 4) + " g/cm³", liq ? Math.min(GW - 50, Math.max(56, X(T))) : X(T) + 62, liq ? Y(rho) + (T < 60 ? 22 : -18) : Y(rho) - 16, {size:10, bg:"#0f1b2d", color:"#fff"});
      /* afficheurs */
      ro.set(0, liq ? (T >= 100 ? "liquide (bout à 100 °C)" : "liquide") : "solide (glace Ih)");
      ro.set(1, cbFmt(cbNHB(T), 2));
      ro.set(2, cnt + " sur " + NE + " possibles");
      ro.set(3, cbFmt(rho, 4) + " g/cm³");
      ro.set(4, cbFmt(18.015 / rho, 2) + " cm³");
      nt.set(liq ? "À " + cbFmt(T, 0) + " °C, chaque molécule participe en moyenne à " + cbFmt(cbNHB(T), 2) + " ponts H sur 4 possibles : les ponts cassés se reforment sans arrêt avec d'autres partenaires, et les molécules glissent les unes contre les autres. " + (T <= 4 ? "Entre 0 et 4 °C, l'eau devient même plus dense en se réchauffant : les derniers fragments de réseau ouvert s'effondrent." : "En chauffant, l'agitation casse davantage de ponts et l'eau se dilate (ρ diminue).") + " <i>Modèle : réseau de départ de la glace, fraction de ponts formés imposée par la température ; valeurs moyennes typiques des simulations moléculaires.</i>"
        : "À " + cbFmt(T, 0) + " °C, chaque molécule est accrochée à exactement 4 voisines (2 ponts par ses H, 2 par ses doublets) dans un réseau tétraédrique régulier. Cet empilement est ouvert : la même eau occupe " + cbFmt(18.015 / rho, 2) + " cm³ par mole au lieu de 18,02 cm³ à 0 °C liquide. La glace est moins dense et flotte. Regarde le long de l'axe c : les canaux hexagonaux sont vides.", "ok");
    });
  }
});


/* ====================================================================== */
/* 4. ch-solubilite-alcools : les alcools C1 à C8 dans l'eau               */
/* ====================================================================== */
/* n : [nom, M (g/mol), ρ (g/mL, 20 °C), solubilité (g pour 100 g d'eau, ≈ 20–25 °C ; null = miscible), Éb (°C)] */
var CB_ALC = {
  1:["méthanol", 32.04, 0.792, null, 64.7], 2:["éthanol", 46.07, 0.789, null, 78.4], 3:["propan-1-ol", 60.10, 0.803, null, 97.2],
  4:["butan-1-ol", 74.12, 0.810, 7.3, 117.7], 5:["pentan-1-ol", 88.15, 0.814, 2.2, 138.0], 6:["hexan-1-ol", 102.17, 0.814, 0.59, 157.0],
  7:["heptan-1-ol", 116.20, 0.822, 0.17, 176.0], 8:["octan-1-ol", 130.23, 0.827, 0.05, 195.0]
};
var CB_MW = 10, CB_TUBE_AREA = PI * 0.7 * 0.7;   /* 10 mL d'eau ; tube de 14 mm de diamètre intérieur (cm²) */
function cbSolu(n, V){
  var A = CB_ALC[n], m = A[2] * V, mmax = A[3] == null ? Infinity : A[3] / 100 * CB_MW, dis = Math.min(m, mmax), exc = m - dis;
  var nAlc = dis / A[1], nW = CB_MW / 18.015;
  return {A:A, m:m, dis:dis, pct:100 * dis / m, Vdis:dis / A[2], Vlay:exc / A[2], mm:exc / A[2] / CB_TUBE_AREA * 10, ratio:nAlc > 0 ? nW / nAlc : Infinity, x:nAlc / (nAlc + nW)};
}
function cbSmooth(x){ x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }

SFA.sim({
  id:"ch-solubilite-alcools", ch:"c04", tag:"Solubilité",
  titre:"Qui se ressemble s'assemble : les alcools dans l'eau",
  resume:"Verse un alcool de C₁ à C₈ dans un tube d'eau et agite : le méthanol, l'éthanol et le propanol se mélangent, les alcools plus longs forment une couche au-dessus. La loupe montre pourquoi : la tête OH fait des ponts H avec l'eau, la chaîne carbonée l'écarte.",
  but:"Choisis le nombre de carbones de l'alcool et le volume versé dans 10 mL d'eau : l'alcool (teinté en orange pour le voir) coule de la pipette, puis on agite et on laisse reposer. Fais glisser le viseur le long du tube : la loupe montre les molécules à cet endroit (eau, couche d'alcool ou interface). Lis la masse dissoute et l'épaisseur de la couche. La vue « 8 tubes » compare tous les alcools ; clique sur un tube pour l'ouvrir.",
  aRetenir:"Un alcool R–OH a deux parties : la tête OH, polaire, qui forme des ponts hydrogène avec l'eau (hydrophile), et la chaîne carbonée, apolaire, qui ne peut en former aucun et oblige l'eau à se réorganiser autour d'elle (hydrophobe). Tant que la chaîne est courte (C₁ à C₃), la tête l'emporte : l'alcool est miscible à l'eau en toutes proportions. À partir de C₄, la chaîne l'emporte de plus en plus : solubilité ≈ 7 g pour 100 g d'eau pour le butan-1-ol, ≈ 0,6 g pour l'hexan-1-ol, ≈ 0,05 g pour l'octan-1-ol. Le surplus forme une couche au-dessus, car ces alcools sont moins denses que l'eau (≈ 0,81 g/mL). « Qui se ressemble s'assemble » : un solvant polaire et à ponts H dissout bien les molécules polaires et à ponts H.",
  piege:"Ce n'est pas la masse de la molécule qui empêche la dissolution, mais la part apolaire de la molécule. Une substance « insoluble » se dissout toujours un peu : 0,05 g d'octan-1-ol pour 100 g d'eau, c'est peu, mais pas zéro. Et la couche du dessus n'est pas de l'alcool pur : elle contient aussi de l'eau dissoute (environ 20 % en masse pour le butan-1-ol), ce que ce modèle simple néglige.",
  build:function(k, S){
    var c = cbCanvas(k, 0.9, 1.4);
    var st = {cyc:0, t:0, drag:null, spot:null, auto:true, view:"one", drops:[], emu:null, key:"", hov:-1};
    var vS = k.seg("Vue", [["one", "Un tube et la loupe"], ["all", "Les 8 tubes"]], "one", function(){ st.cyc = 0; });
    var nS = k.slider("Nombre de carbones de l'alcool", 1, 8, 1, 4, "C", function(){ st.cyc = 0; st.spot = null; });
    var VS = k.slider("Volume d'alcool versé", 0.5, 5, 0.5, 2, "mL", function(){ st.cyc = 0; st.spot = null; });
    k.button("Verser à nouveau", function(){ st.cyc = 0; });
    var lT = k.toggle("Recommencer en boucle", true, function(v){ st.auto = v; });
    var ro = k.readouts(["Alcool", "Versé dans 10 mL d'eau", "Solubilité dans l'eau (≈ 25 °C)", "Dissous à l'équilibre", "Couche au-dessus", "Éb (1 atm)"]);
    var nt = k.note("", "ok");
    /* ---------- géométrie de la scène ---------- */
    var G = {};
    function geom(W, H, ph){
      G.ph = ph; G.benchY = H * 0.86;
      G.tx = W * (ph ? 0.23 : 0.24); G.tr = Math.min(W * (ph ? 0.085 : 0.07), H * 0.065);
      G.yT = H * 0.1; G.yB = G.benchY - H * 0.06; G.Hc = G.yB - G.yT - H * 0.05;     /* 18 mL entre le fond et la graduation du haut */
      G.lx = W * (ph ? 0.68 : 0.67); G.ly = H * (ph ? 0.4 : 0.42); G.R = Math.min(W * (ph ? 0.29 : 0.29), H * (ph ? 0.3 : 0.34));
    }
    function yOf(V){ return G.yB - V / 18 * G.Hc; }
    /* ---------- souris : viseur le long du tube, tubes cliquables ---------- */
    c.pointer(function(type, p){
      if (vS.value === "all"){
        if (type === "move" || type === "down") st.hov = hitTube(p);
        if (type === "up"){ var h = hitTube(p); if (h > 0){ nS.set(h); vS.set("one"); st.cyc = 0; st.spot = null; } }
        return;
      }
      if (type === "down"){ if (Math.abs(p.x - G.tx) < G.tr + 34 && p.y > G.yT - 10 && p.y < G.yB + 10){ st.drag = "spot"; st.spot = p.y; } return; }
      if (type === "drag" && st.drag === "spot"){ st.spot = Math.max(G.yT + 6, Math.min(G.yB - 4, p.y)); return; }
      if (type === "up") st.drag = null;
    });
    function hitTube(p){ var best = -1; (G.tubes || []).forEach(function(t, i){ if (Math.abs(p.x - t.x) < t.r + 12 && p.y > t.yT - 20 && p.y < t.yB + 40) best = i + 1; }); return best; }
    var lp = k.loop(function(dt){
      st.t += dt; st.cyc += dt;
      if (st.cyc > 12.5){ st.cyc = st.auto ? 0 : 12.5; }
      k.redraw();
    });
    lp.play();
    /* ---------- décor ---------- */
    function drawRoom(ctx, W, H){
      var wg = ctx.createLinearGradient(0, 0, 0, G.benchY); wg.addColorStop(0, "#eef2f6"); wg.addColorStop(1, "#d9e1ea"); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, G.benchY);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1.2; var ts = Math.max(26, W / 18);
      for (var y = G.benchY - ts; y > -ts; y -= ts){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      for (var x = 0; x < W; x += ts){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, G.benchY); ctx.stroke(); }
      ctx.restore();
      var bg = ctx.createLinearGradient(0, G.benchY, 0, H); bg.addColorStop(0, "#c8a57a"); bg.addColorStop(0.12, "#a77f52"); bg.addColorStop(1, "#7a5733"); ctx.fillStyle = bg; ctx.fillRect(0, G.benchY, W, H - G.benchY);
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(0, G.benchY, W, 2);
      ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = "#4e3519"; for (var q = 0; q < 5; q++){ ctx.beginPath(); ctx.moveTo(0, G.benchY + 10 + q * 9); ctx.bezierCurveTo(W * 0.3, G.benchY + 4 + q * 9, W * 0.6, G.benchY + 16 + q * 9, W, G.benchY + 8 + q * 9); ctx.stroke(); } ctx.restore();
    }
    function rack(ctx, x0, x1, y, h){
      var gW = function(a, b){ var g1 = ctx.createLinearGradient(0, a, 0, b); g1.addColorStop(0, "#e2bb88"); g1.addColorStop(1, "#a0723f"); return g1; };
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, G.benchY + 3, (x1 - x0) / 2 + 12, 6, 0, 0, 7); ctx.fill();
      /* socle et montants */
      ctx.fillStyle = gW(G.benchY - 12, G.benchY); cbRR(ctx, x0 - 8, G.benchY - 12, x1 - x0 + 16, 12, 3); ctx.fill();
      ctx.fillStyle = "#a87a45"; ctx.fillRect(x0 - 4, y, 7, G.benchY - 12 - y); ctx.fillRect(x1 - 3, y, 7, G.benchY - 12 - y);
      /* barre arrière percée */
      ctx.fillStyle = gW(y - h * 0.5, y); cbRR(ctx, x0 - 6, y - h * 0.55, x1 - x0 + 12, h * 0.55, 3); ctx.fill();
      ctx.restore();
    }
    function rackFront(ctx, x0, x1, y, h){
      ctx.save(); var g1 = ctx.createLinearGradient(0, y, 0, y + h); g1.addColorStop(0, "#e6c08c"); g1.addColorStop(1, "#9b6d3a"); ctx.fillStyle = g1;
      cbRR(ctx, x0 - 6, y, x1 - x0 + 12, h, 3); ctx.fill(); ctx.strokeStyle = "rgba(80,50,20,.45)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    }
    /* tube à essais : verre, liquide (eau + phase alcool), ménisques ; ang = inclinaison pendant l'agitation */
    function tube(ctx, x, yT, yB, r, L, ang){
      ctx.save(); ctx.translate(x, yB); ctx.rotate(ang || 0); ctx.translate(-x, -yB);
      function body(){ ctx.beginPath(); ctx.moveTo(x - r, yT); ctx.lineTo(x - r, yB - r); ctx.arc(x, yB - r, r, PI, 0, true); ctx.lineTo(x + r, yT); }
      /* ombre portée */
      /* liquide */
      ctx.save(); body(); ctx.closePath(); ctx.clip();
      var yS = L.ySurf, yI = L.yInt;
      var aq = ctx.createLinearGradient(x - r, 0, x + r, 0); aq.addColorStop(0, "rgba(160,200,235,.55)"); aq.addColorStop(0.5, "rgba(215,236,250,.45)"); aq.addColorStop(1, "rgba(150,190,228,.6)");
      ctx.fillStyle = aq; ctx.fillRect(x - r, yI, 2 * r, yB - yI + 2);
      if (L.tint > 0.002){ ctx.fillStyle = "rgba(243,150,40," + Math.min(0.62, L.tint) + ")"; ctx.fillRect(x - r, yI, 2 * r, yB - yI + 2); }
      if (yS < yI - 0.5){
        var al = ctx.createLinearGradient(x - r, 0, x + r, 0); al.addColorStop(0, "rgba(226,120,20,.85)"); al.addColorStop(0.5, "rgba(250,178,80,.8)"); al.addColorStop(1, "rgba(214,110,15,.88)");
        ctx.fillStyle = al; ctx.fillRect(x - r, yS, 2 * r, yI - yS + 1);
        ctx.strokeStyle = "rgba(170,80,10,.7)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - r, yI - 2); ctx.quadraticCurveTo(x, yI + 3, x + r, yI - 2); ctx.stroke();
      }
      /* volutes d'alcool qui se mélange */
      (L.plumes || []).forEach(function(pl){
        ctx.save(); ctx.globalAlpha = pl.a; ctx.strokeStyle = "rgba(240,140,30,.9)"; ctx.lineWidth = pl.w; ctx.lineCap = "round"; ctx.beginPath();
        for (var s = 0; s <= 1.001; s += 0.08){ var yy = yS + s * pl.len, xx = pl.x + Math.sin(s * 9 + pl.ph) * r * 0.35 * s; s ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.stroke(); ctx.restore();
      });
      /* gouttelettes (émulsion) */
      (L.drops || []).forEach(function(d){ cbBall(ctx, d.x, d.y, d.r, "#f0962a", 0.9); });
      /* ménisque */
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.moveTo(x - r, yS - 3); ctx.quadraticCurveTo(x, yS + 4, x + r, yS - 3); ctx.lineTo(x + r, yS - 6); ctx.lineTo(x - r, yS - 6); ctx.closePath(); ctx.fill();
      ctx.restore();
      /* verre */
      body(); ctx.strokeStyle = "rgba(120,140,165,.85)"; ctx.lineWidth = 1.6; ctx.stroke();
      var gl = ctx.createLinearGradient(x - r, 0, x + r, 0); gl.addColorStop(0, "rgba(255,255,255,.55)"); gl.addColorStop(0.18, "rgba(255,255,255,.08)"); gl.addColorStop(0.75, "rgba(255,255,255,0)"); gl.addColorStop(0.9, "rgba(255,255,255,.35)"); gl.addColorStop(1, "rgba(255,255,255,.05)");
      body(); ctx.closePath(); ctx.fillStyle = gl; ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(x - r * 0.72, yT + 8, Math.max(1.5, r * 0.12), yB - yT - r - 14);
      ctx.strokeStyle = "rgba(120,140,165,.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, yT, r + 2, Math.max(2, r * 0.22), 0, 0, 7); ctx.stroke();
      ctx.restore();
    }
    /* ---------- état du tube selon l'instant du cycle ---------- */
    function tubeState(n, V, cyc, x, r){
      var R0 = cbSolu(n, V), misc = R0.A[3] == null, fp = cbSmooth((cyc - 0.6) / 2.4), L = {};
      var shake = cyc > 3.6 && cyc < 5.0, settle = cbSmooth((cyc - 5.0) / 3.2), mixed = cbSmooth((cyc - 3.6) / 1.4);
      var tintEq = R0.Vdis > 0 ? 1.5 * R0.Vdis / (CB_MW + R0.Vdis) : 0;
      if (misc){
        L.Vaq = CB_MW + V * fp; L.Vlay = 0;
        L.tint = tintEq * Math.min(fp, cbSmooth((cyc - 0.9) / 2.8));
        L.plumes = [];
        if (cyc > 0.7 && cyc < 4.4) for (var i = 0; i < 4; i++){ var age = (cyc - 0.7 - i * 0.55); if (age > 0 && age < 1.8){ L.plumes.push({x:x + (i - 1.5) * r * 0.3, len:Math.min(1, age / 1.2) * r * 6, a:0.55 * (1 - age / 1.8), w:Math.max(2, r * 0.18), ph:i * 1.7}); } }
      } else {
        /* avant agitation : l'alcool flotte ; agitation : émulsion ; repos : les gouttes remontent, la part soluble reste dissoute */
        var emu = cyc < 3.6 ? 0 : cyc < 5.0 ? 1 : 1 - settle;
        var layBefore = V * fp, layAfter = R0.Vlay;
        L.Vlay = cyc < 3.6 ? layBefore : (layAfter * (1 - emu));
        L.Vaq = CB_MW + (cyc < 3.6 ? 0 : R0.Vdis * mixed);
        L.tint = tintEq * mixed;
        L.emu = emu; L.dropVol = cyc < 3.6 ? 0 : layAfter * emu;
      }
      L.R = R0; L.misc = misc; L.shake = shake; L.fp = fp;
      return L;
    }
    function geomLevels(L, yB, Hc){ L.yInt = yB - (L.Vaq + (L.dropVol || 0)) / 18 * Hc; L.ySurf = L.yInt - L.Vlay / 18 * Hc; return L; }
    /* ---------- loupe : vue moléculaire ---------- */
    var molCache = {key:"", W:[], A:[]};
    function rng(seed){ return function(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
    function alcoholAtoms(n, x, y, ang, u){
      var pts = [], dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
      for (var i = 0; i < n; i++){ var o = (i % 2 ? 0.42 : -0.42) * u; pts.push({x:x + dx * i * 1.15 * u + nx * o, y:y + dy * i * 1.15 * u + ny * o, el:"C"}); }
      var oO = (n % 2 ? 0.42 : -0.42) * u; pts.push({x:x + dx * n * 1.15 * u + nx * oO, y:y + dy * n * 1.15 * u + ny * oO, el:"O"});
      var O = pts[pts.length - 1]; pts.push({x:O.x + dx * 0.75 * u - nx * oO * 0.9, y:O.y + dy * 0.75 * u - ny * oO * 0.9, el:"H"});
      return pts;
    }
    function buildLoupe(n, R0, yIntL, ySurfL, R){
      var u = R / 11, rnd = rng(1234 + n * 97 + Math.round(yIntL) * 7 + Math.round(ySurfL) * 13), Wm = [], Al = [];
      /* alcools : en couche (au-dessus de l'interface), têtes OH vers l'eau à l'interface */
      var Lc = n * 1.15 * u + 1.6 * u, colW = 2.45 * u;
      if (ySurfL < yIntL){
        var row = 0;
        for (var yb = yIntL - 0.5 * u; yb > Math.max(ySurfL, -R) - Lc; yb -= Lc + 0.5 * u, row++){
          for (var xc = -R + colW * (0.6 + (row % 2) * 0.5); xc < R; xc += colW){
            var headDown = row % 2 === 0, tilt = (rnd() - 0.5) * 0.25;
            var ang = headDown ? PI / 2 + tilt : -PI / 2 + tilt, y0 = headDown ? yb - Lc + 0.4 * u : yb;
            if (headDown ? y0 < ySurfL - 0.2 * u : yb - Lc < ySurfL - 0.2 * u) continue;
            Al.push({atoms:alcoholAtoms(n, xc, y0, ang, u), ph:rnd() * 7, inLayer:true, row:row});
          }
        }
      }
      /* alcools dissous dans l'eau : leur nombre suit la fraction molaire */
      var nf = R0.x > 0.002 ? Math.max(1, Math.min(5, Math.round(R0.x * 50))) : 0, spots = [[-0.12, 0.42], [0.3, 0.7], [-0.4, 0.75], [0.35, 0.15], [-0.45, 0.2]];
      for (var f = 0; f < nf; f++){
        var sx = spots[f][0] * R, sy = Math.max(yIntL + 2.5 * u, -R) + (R - Math.max(yIntL + 2.5 * u, -R)) * spots[f][1];
        if (sy > R - 1.5 * u || sy < yIntL + 2 * u) continue;
        var ang2 = rnd() * 2 * PI, span = n * 1.15 * u;
        Al.push({atoms:alcoholAtoms(n, sx - Math.cos(ang2) * span / 2, sy - Math.sin(ang2) * span / 2, ang2, u), ph:rnd() * 7, inLayer:false});
      }
      /* eau : grille désordonnée sous l'interface, hors de la « cage » des chaînes */
      for (var yy = yIntL + 1.2 * u; yy < R + u; yy += 2.15 * u) for (var xx = -R - u + (rnd() * 0.8) * u; xx < R + u; xx += 2.15 * u){
        var px = xx + (rnd() - 0.5) * 0.9 * u, py = yy + (rnd() - 0.5) * 0.9 * u, ok = true;
        Al.forEach(function(a){ if (a.inLayer) return; a.atoms.forEach(function(q){ var dd = Math.hypot(q.x - px, q.y - py); if (q.el === "C" && dd < 2.1 * u) ok = false; if (q.el !== "C" && dd < 1.5 * u) ok = false; }); });
        if (ok && py > yIntL + 0.9 * u) Wm.push({x:px, y:py, a:rnd() * 2 * PI, ph:rnd() * 7});
      }
      return {W:Wm, A:Al, u:u};
    }
    function drawLoupe(ctx, L, n){
      var R = G.R, lx = G.lx, ly = G.ly, k3 = 3, spot = st.spot;
      var yIntL = (L.yInt - spot) * k3, ySurfL = (L.ySurf - spot) * k3;
      /* échelles très différentes : la couche (quelques mm) est montrée comme une phase épaisse dès que l'interface est dans la loupe */
      if (ySurfL < yIntL - 2 && yIntL > -R && yIntL < R) ySurfL = Math.min(ySurfL, -2 * R);
      var key = [n, Math.round(yIntL / 4), Math.round(ySurfL / 4), Math.round(R)].join(",");
      if (key !== molCache.key){ molCache = buildLoupe(n, L.R, yIntL, ySurfL, R); molCache.key = key; }
      var M = molCache, u = M.u, t = st.t;
      /* manche */
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(0.75);
      var hg = ctx.createLinearGradient(-u, 0, u, 0); hg.addColorStop(0, "#3b2a1a"); hg.addColorStop(0.5, "#7b5531"); hg.addColorStop(1, "#2e1f12");
      ctx.fillStyle = hg; cbRR(ctx, -R * 0.11, R * 1.02, R * 0.22, R * 0.62, R * 0.08); ctx.fill(); ctx.restore();
      /* trait vers le viseur */
      ctx.save(); ctx.strokeStyle = "rgba(40,60,90,.35)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(G.tx + G.tr + R / k3 + 2, spot); ctx.lineTo(lx - R, ly); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.clip();
      /* fonds : air, couche d'alcool, eau */
      ctx.fillStyle = "#f4f6f9"; ctx.fillRect(lx - R, ly - R, 2 * R, 2 * R);
      var yS = Math.max(-R, Math.min(R, ySurfL)), yI = Math.max(-R, Math.min(R, yIntL));
      if (yI > yS){ var gA = ctx.createLinearGradient(0, ly + yS, 0, ly + yI); gA.addColorStop(0, "#ffe2b8"); gA.addColorStop(1, "#ffd29a"); ctx.fillStyle = gA; ctx.fillRect(lx - R, ly + yS, 2 * R, yI - yS); }
      if (yI < R){ var gW = ctx.createLinearGradient(0, ly + yI, 0, ly + R); gW.addColorStop(0, L.tint > 0.05 ? "#f6e3cc" : "#dcecf8"); gW.addColorStop(1, L.tint > 0.05 ? "#eed7bd" : "#c9e0f3"); ctx.fillStyle = gW; ctx.fillRect(lx - R, ly + yI, 2 * R, R - yI); }
      function J(ph, a){ return a * Math.sin(t * 2.1 + ph); }
      var Wp = M.W.map(function(w){ return {x:lx + w.x + J(w.ph, 0.2 * u), y:ly + w.y + J(w.ph + 1, 0.2 * u), a:w.a + J(w.ph + 2, 0.25)}; });
      /* ponts H eau–eau (quelques-uns) */
      ctx.save(); ctx.setLineDash([2, 3]); ctx.strokeStyle = "rgba(40,150,210,.55)"; ctx.lineWidth = 1.2;
      for (var i = 0; i < Wp.length; i++) for (var j = i + 1; j < Wp.length; j++){ var d = Math.hypot(Wp[i].x - Wp[j].x, Wp[i].y - Wp[j].y); if (d < 2.5 * u && ((i * 7 + j * 3) % 3 === 0)){ ctx.beginPath(); ctx.moveTo(Wp[i].x, Wp[i].y); ctx.lineTo(Wp[j].x, Wp[j].y); ctx.stroke(); } }
      ctx.restore();
      /* alcools */
      var Ap = M.A.map(function(a){ var jx = J(a.ph, 0.15 * u), jy = J(a.ph + 1.3, 0.15 * u); return {at:a.atoms.map(function(q){ return {x:lx + q.x + jx, y:ly + q.y + jy, el:q.el}; }), inLayer:a.inLayer}; });
      /* ponts H des têtes OH : avec l'eau (alcool dissous, interface) ou entre têtes voisines (couche) */
      ctx.save(); ctx.setLineDash([2.5, 3]); ctx.lineWidth = 1.8; ctx.strokeStyle = "rgba(0,140,210,.9)";
      Ap.forEach(function(a, ai){
        var O = a.at[a.at.length - 2], Hh = a.at[a.at.length - 1], partners = [];
        Wp.forEach(function(w){ var d = Math.hypot(w.x - O.x, w.y - O.y); if (d < 2.9 * u) partners.push([d, w]); });
        Ap.forEach(function(b, bi){ if (bi === ai) return; var Ob = b.at[b.at.length - 2], d = Math.hypot(Ob.x - O.x, Ob.y - O.y); if (d < 2.6 * u) partners.push([d, Ob]); });
        partners.sort(function(p, q){ return p[0] - q[0]; }).slice(0, 2).forEach(function(pq, ii){ var from = ii === 0 ? Hh : O; ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(pq[1].x, pq[1].y); ctx.stroke(); });
      });
      ctx.restore();
      /* zone « écartée » autour des chaînes dissoutes */
      Ap.forEach(function(a){ if (a.inLayer) return; var C0 = a.at[0], Cn = a.at[a.at.length - 3]; ctx.save(); ctx.strokeStyle = "rgba(120,130,145,.45)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1.2; ctx.lineCap = "round"; ctx.lineWidth = 3.6 * u; ctx.globalAlpha = 0.12; ctx.strokeStyle = "#7a8698"; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(C0.x, C0.y); ctx.lineTo(Cn.x, Cn.y); ctx.stroke(); ctx.restore(); });
      Wp.forEach(function(w){
        cbBall(ctx, w.x, w.y, 0.62 * u, "#e0453a");
        [-0.92, 0.92].forEach(function(s){ cbBall(ctx, w.x + Math.cos(w.a + s) * 0.72 * u, w.y + Math.sin(w.a + s) * 0.72 * u, 0.36 * u, "#f4f6f9"); });
      });
      Ap.forEach(function(a){
        for (var q = 0; q < a.at.length - 1; q++){ var p1 = a.at[q], p2 = a.at[q + 1]; ctx.save(); ctx.strokeStyle = "#5b6475"; ctx.lineWidth = Math.max(1.5, 0.28 * u); ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); ctx.restore(); }
        a.at.forEach(function(q){ cbBall(ctx, q.x, q.y, (q.el === "C" ? 0.52 : q.el === "O" ? 0.56 : 0.34) * u, q.el === "C" ? "#4a5568" : q.el === "O" ? "#e0453a" : "#f4f6f9"); });
      });
      /* surface et interface */
      ctx.save(); ctx.lineWidth = 2;
      if (ySurfL > -R && ySurfL < R){ ctx.strokeStyle = "rgba(90,110,140,.55)"; ctx.beginPath(); ctx.moveTo(lx - R, ly + ySurfL); ctx.lineTo(lx + R, ly + ySurfL); ctx.stroke(); }
      if (yIntL > -R && yIntL < R && ySurfL < yIntL - 2){ ctx.strokeStyle = "rgba(200,110,20,.55)"; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(lx - R, ly + yIntL); ctx.lineTo(lx + R, ly + yIntL); ctx.stroke(); }
      ctx.restore();
      ctx.restore();
      /* monture de la loupe */
      ctx.save(); ctx.lineWidth = Math.max(7, R * 0.07); var rg = ctx.createLinearGradient(lx - R, ly - R, lx + R, ly + R); rg.addColorStop(0, "#f2f4f7"); rg.addColorStop(0.4, "#9aa3b0"); rg.addColorStop(1, "#4b5260"); ctx.strokeStyle = rg; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.stroke();
      ctx.globalAlpha = 0.35; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lx, ly, R * 0.86, -2.6, -1.7); ctx.stroke(); ctx.restore();
      /* légende de la loupe */
      var zone = st.spot < L.ySurf ? "air" : st.spot < L.yInt ? "couche d'" + L.R.A[0] : (L.R.x > 0.002 ? "eau + " + L.R.A[0] + " dissous" : "eau (presque pas d'alcool dissous)");
      if (Math.abs(st.spot - L.yInt) < R / k3 * 0.7 && L.ySurf < L.yInt - 2) zone = "interface eau / " + L.R.A[0];
      cbTag(ctx, "loupe · " + zone, lx, ly + R + (G.ph ? 16 : 18), {size:G.ph ? 10.5 : 11.5, bg:"rgba(15,27,45,.85)", color:"#fff"});
      /* viseur sur le tube */
      ctx.save(); ctx.strokeStyle = "rgba(15,27,45,.85)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(G.tx, spot, R / k3, 0, 7); ctx.stroke();
      ctx.fillStyle = "rgba(15,27,45,.85)"; ctx.beginPath(); ctx.arc(G.tx + R / k3, spot, 3.5, 0, 7); ctx.fill(); ctx.restore();
    }
    /* ---------- pipette ---------- */
    function pipette(ctx, x, yTip, pouring, cyc){
      var w = Math.max(5, G.tr * 0.32), top = Math.max(6, yTip - G.Hc * 0.62);
      ctx.save();
      var gg = ctx.createLinearGradient(x - w, 0, x + w, 0); gg.addColorStop(0, "rgba(255,255,255,.75)"); gg.addColorStop(0.5, "rgba(220,232,245,.35)"); gg.addColorStop(1, "rgba(160,180,205,.7)");
      ctx.fillStyle = gg; ctx.strokeStyle = "rgba(110,130,155,.9)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x - w, top + 30); ctx.lineTo(x - w, yTip - 26); ctx.lineTo(x - 1.6, yTip); ctx.lineTo(x + 1.6, yTip); ctx.lineTo(x + w, yTip - 26); ctx.lineTo(x + w, top + 30); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* alcool restant dans la pipette */
      var left = pouring ? 1 - cbSmooth((cyc - 0.6) / 2.4) : (cyc < 0.6 ? 1 : 0);
      if (left > 0.01){ var yl = yTip - 26 - (yTip - 26 - top - 30) * left * 0.85; ctx.fillStyle = "rgba(240,140,30,.8)"; ctx.fillRect(x - w + 1.5, yl, 2 * w - 3, yTip - 26 - yl); ctx.beginPath(); ctx.moveTo(x - w + 1.5, yTip - 26); ctx.lineTo(x - 1.2, yTip - 1); ctx.lineTo(x + 1.2, yTip - 1); ctx.lineTo(x + w - 1.5, yTip - 26); ctx.fill(); }
      /* poire */
      var bg = ctx.createRadialGradient(x - w * 0.5, top + 6, 2, x, top + 16, w * 2.2); bg.addColorStop(0, "#ff8f8f"); bg.addColorStop(0.5, "#d63b3b"); bg.addColorStop(1, "#7d1717");
      var sq = pouring ? 1 - 0.25 * Math.abs(Math.sin(cyc * 6)) : 1;
      ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(x, top + 14, w * 1.55 * sq, 18, 0, 0, 7); ctx.fill(); ctx.fillRect(x - w * 0.9, top + 18, w * 1.8, 14);
      ctx.restore();
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, n = Math.round(nS.value), V = VS.value, all = vS.value === "all";
      geom(W, H, ph); c.clear(); drawRoom(ctx, W, H);
      var R0 = cbSolu(n, V), A = R0.A;
      if (!all){
        var cyc = st.cyc, L = tubeState(n, V, cyc, G.tx, G.tr);
        geomLevels(L, G.yB, G.Hc);
        /* gouttelettes d'émulsion : position déterministe (montent pendant le repos) */
        L.drops = [];
        if (!L.misc && L.emu > 0.01){
          var rr = rng(99 + n), nd = Math.round(10 + 26 * Math.min(1, R0.Vlay / 2.5)), rise = Math.max(0, cyc - 5.0);
          for (var i = 0; i < nd; i++){
            var r = (0.18 + 0.2 * rr()) * G.tr, y0 = L.yInt + (G.yB - G.tr * 0.6 - L.yInt) * rr(), vy = (r / G.tr) * (r / G.tr) * G.Hc * 1.1, y = y0 - vy * rise;
            if (y > L.yInt + r) L.drops.push({x:G.tx + (rr() - 0.5) * 1.5 * G.tr + Math.sin(st.t * 9 + i) * (L.shake ? G.tr * 0.25 : 0), y:y, r:r});
          }
        }
        rack(ctx, G.tx - G.tr * 2.4, G.tx + G.tr * 2.4, G.yB - G.Hc * 0.36, G.Hc * 0.1);
        var ang = L.shake ? 0.13 * Math.sin((cyc - 3.6) * 2 * PI * 3.2) : 0;
        tube(ctx, G.tx, G.yT, G.yB, G.tr, L, ang);
        /* devant du support */
        rackFront(ctx, G.tx - G.tr * 2.4, G.tx + G.tr * 2.4, G.yB - G.Hc * 0.36, G.Hc * 0.045);
        /* graduations */
        ctx.save(); ctx.strokeStyle = "rgba(60,80,110,.55)"; ctx.fillStyle = "rgba(40,55,80,.8)"; ctx.font = cbFont(700, ph ? 8.5 : 9.5); ctx.textAlign = "left"; ctx.textBaseline = "middle";
        [5, 10, 15].forEach(function(v){ var y = yOf(v); ctx.beginPath(); ctx.moveTo(G.tx - G.tr, y); ctx.lineTo(G.tx - G.tr * 0.45, y); ctx.stroke(); ctx.fillText(v + " mL", G.tx - G.tr * 0.4, y); });
        ctx.restore();
        /* pipette et gouttes */
        var pouring = cyc > 0.5 && cyc < 3.1, tipY = G.yT - (pouring ? -G.Hc * 0.04 : G.Hc * 0.06);
        if (cyc < 3.4) pipette(ctx, G.tx, tipY, pouring, cyc);
        if (pouring){ for (var q = 0; q < 3; q++){ var ph2 = ((cyc * 3 + q / 3) % 1), dy = ph2 * (L.ySurf - tipY); cbBall(ctx, G.tx, tipY + dy, Math.max(2.5, G.tr * 0.12), "#f0962a"); } }
        if (st.spot == null){ st.spot = L.R.Vlay > 0.05 ? yOf(CB_MW + R0.Vdis) : yOf((CB_MW + R0.Vdis) * 0.55); }
        /* loupe (état d'équilibre) */
        var Leq = tubeState(n, V, 12, G.tx, G.tr); geomLevels(Leq, G.yB, G.Hc);
        drawLoupe(ctx, Leq, n);
        /* étiquettes */
        var phase = cyc < 0.6 ? "10 mL d'eau" : cyc < 3.2 ? "on verse " + cbFmt(V, 1) + " mL de " + A[0] : cyc < 5.0 ? "on agite" : cyc < 8.4 ? "repos" : (L.misc || R0.Vlay < 0.005 ? "une seule phase" : "deux phases");
        cbTag(ctx, A[0] + " · " + phase, W - 10, 18, {align:"right", bg:"rgba(15,27,45,.85)", color:"#fff", size:ph ? 11 : 12.5});
        cbText(ctx, ph ? "glisse le viseur le long du tube" : "fais glisser le viseur le long du tube", W - 10, G.benchY + (H - G.benchY) / 2, {size:ph ? 9 : 10, color:"#fff3df", align:"right", w:700});
        cbText(ctx, ph ? "alcool teinté en orange" : "alcool teinté en orange pour le voir", 10, G.benchY + (H - G.benchY) / 2, {size:ph ? 9 : 10, color:"#fff3df", w:700, align:"left"});
      } else {
        /* huit tubes à l'équilibre */
        var x0 = W * 0.08, x1 = W * 0.92, tr = Math.min((x1 - x0) / 8 * 0.27, H * 0.05), tubes = [];
        var yT = H * 0.18, yB = G.benchY - H * 0.08, Hc = yB - yT - H * 0.04;
        rack(ctx, x0 - tr, x1 + tr, yB - Hc * 0.36, Hc * 0.1);
        for (var m = 1; m <= 8; m++){
          var x = x0 + (m - 0.5) * (x1 - x0) / 8, Lm = tubeState(m, V, 12, x, tr); geomLevels(Lm, yB, Hc); Lm.drops = [];
          tube(ctx, x, yT, yB, tr, Lm, 0); tubes.push({x:x, r:tr, yT:yT, yB:yB});
          if (m === 8) rackFront(ctx, x0 - tr, x1 + tr, yB - Hc * 0.36, Hc * 0.045);
          var on = m === n || m === st.hov;
          cbTag(ctx, "C" + m, x, yT - 16, {size:ph ? 10 : 11.5, bg:on ? "#0f1b2d" : "rgba(255,255,255,.95)", color:on ? "#fff" : "#13233a", stroke:on ? null : "#c9d2de"});
          var R1 = cbSolu(m, V);
          cbText(ctx, ph ? (R1.Vlay < 0.005 ? "1 ph." : "2 ph.") : R1.A[3] == null ? "miscible" : R1.Vlay < 0.005 ? "tout dissous" : "2 phases", x, yB + (ph ? 12 : 14), {size:ph ? 8.5 : 9.5, color:"#13233a", w:800});
          if (!ph) cbText(ctx, R1.A[0], x, yB + 28, {size:9, color:"#3c4a5e", w:600});
        }
        ctx.save(); ctx.fillStyle = "rgba(15,27,45,.06)"; ctx.restore();
        G.tubes = tubes;
        cbTag(ctx, "8 tubes : 10 mL d'eau + " + cbFmt(V, 1) + " mL d'alcool, après agitation et repos", 10, 18, {align:"left", bg:"rgba(15,27,45,.85)", color:"#fff", size:ph ? 10 : 12.5});
        cbText(ctx, ph ? "ph. = phase · touche un tube pour l'ouvrir" : "clique sur un tube pour l'ouvrir avec la loupe", W / 2, G.benchY + (H - G.benchY) / 2 + (ph ? 6 : 8), {size:ph ? 9.5 : 10.5, color:"#fff3df", w:700});
        c.cv.style.cursor = st.hov > 0 ? "pointer" : "default";
      }
      if (!all) c.cv.style.cursor = "ns-resize";
      /* afficheurs (équilibre) */
      ro.set(0, A[0] + " (C" + n + ")");
      ro.set(1, cbFmt(V, 1) + " mL = " + cbFmt(R0.m, 2) + " g");
      ro.set(2, A[3] == null ? "miscible en toutes proportions" : "≈ " + cbFmt(A[3], A[3] < 0.1 ? 2 : A[3] < 1 ? 2 : 1) + " g pour 100 g d'eau");
      ro.set(3, cbFmt(R0.dis, R0.dis < 0.1 ? 3 : 2) + " g (" + cbFmt(R0.pct, R0.pct < 1 ? 2 : 0) + " %)");
      ro.set(4, R0.Vlay < 0.005 ? "aucune : une seule phase" : "≈ " + cbFmt(R0.Vlay, 2) + " mL (" + cbFmt(R0.mm, 0) + " mm)");
      ro.set(5, cbFmt(A[4], 1) + " °C");
      var msg;
      if (A[3] == null) msg = "La tête OH du " + A[0] + " forme des ponts H avec l'eau aussi bien que l'eau avec elle-même, et sa chaîne de " + n + " carbone" + (n > 1 ? "s" : "") + " est trop courte pour gêner : il se mélange en toutes proportions. Dans ce tube, 1 molécule d'alcool pour " + cbFmt(R0.ratio, 0) + " molécules d'eau.";
      else if (R0.Vlay < 0.005) msg = "Avec seulement " + cbFmt(V, 1) + " mL, tout le " + A[0] + " se dissout (" + cbFmt(R0.m, 2) + " g, sous la limite de " + cbFmt(A[3] / 10, 2) + " g pour 10 mL d'eau). Verse davantage : au-delà, une couche apparaît.";
      else msg = "La chaîne de " + n + " carbones est trop longue : l'eau ne peut en dissoudre que " + cbFmt(R0.dis, R0.dis < 0.1 ? 3 : 2) + " g (1 molécule d'alcool pour " + (R0.ratio > 1e4 ? "≈ " + cbFmt(R0.ratio / 1000, 0) + " 000" : cbFmt(R0.ratio, 0)) + " molécules d'eau). Le reste, moins dense que l'eau (" + cbFmt(A[2], 3) + " g/mL), forme une couche de ≈ " + cbFmt(R0.Vlay, 2) + " mL au-dessus. À l'interface, les têtes OH plongent vers l'eau et les chaînes restent ensemble.";
      nt.set(msg + " <i>Volumes supposés additifs (on néglige la légère contraction du mélange).</i>", "ok");
    });
  }
});

})();
