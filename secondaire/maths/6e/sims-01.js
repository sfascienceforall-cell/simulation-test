/* Mathématiques 6e : aides communes aux simulations (chargé d'office avec ce fichier, avant les autres chapitres). */
window.M6 = (function(){
var M = {};
/* canvas à hauteur minimale (téléphone) : ratio hauteur/largeur, mais jamais moins de minH pixels */
M.canvas = function(k, ratio, minH){
  var c = k.canvas(0, {ratio:ratio}); minH = minH || 300;
  Object.defineProperty(c, "ratio", {get:function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); return Math.max(ratio, minH / w); }, set:function(){}});
  c.resize(); return c;
};
M.small = function(c){ return c.W < 470; };
M.fs = function(c, n){ return c.W < 470 ? Math.max(11, n - 0.5) : n; };
M.sup = function(n){ var m={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"}; return String(n).split("").map(function(ch){ return m[ch]||ch; }).join(""); };
/* notation scientifique en texte simple (pour le canevas) */
M.sci = function(S, x, d){ if(!isFinite(x)||x===0) return S.fmt(x,d); var e=Math.floor(Math.log10(Math.abs(x))); if(e>=-2&&e<=4) return S.fmt(x,d==null?(Math.abs(x)<10?2:0):d); return S.fmt(x/Math.pow(10,e),d==null?1:d)+"·10"+M6.sup(e); };
M.int = function(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
M.clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
M.ease = function(t){ t = M.clamp(t, 0, 1); return t * t * (3 - 2 * t); };
/* générateur pseudo-aléatoire reproductible */
M.rng = function(seed){ var s = seed >>> 0 || 1; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
/* étiquette / pastille */
M.tag = function(S, c, txt, x, y, color, opt){ opt = opt || {}; S.draw.label(c, txt, x, y, {color:color || S.draw.palette.ink, align:opt.align || "left", size:opt.size || M.fs(c, 12), math:opt.math}); };
M.chip = function(S, c, txt, ok, x, y){ var P = S.draw.palette, col = ok ? P.green : P.amber; S.draw.label(c, txt, x == null ? c.W - 12 : x, y == null ? 20 : y, {color:col, align:"right", size:M.fs(c, 12), weight:800}); };
/* poignée déplaçable */
M.handle = function(S, c, x, y, color, active, r){
  var ctx = c.ctx; r = r || 9; ctx.save();
  ctx.globalAlpha = active ? 0.3 : 0.16; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r + (active ? 9 : 6), 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r - 3, 0, 6.2832); ctx.fill(); ctx.restore();
};
/* gestion de poignées à la souris ou au doigt : pts() renvoie [{x,y}] en pixels ; move(i, p, phase) ; renvoie {active} */
M.drag = function(c, pts, move, opt){
  opt = opt || {}; var st = {active:-1}, R = opt.r || 24;
  function near(p){ var L = pts(), best = -1, bd = R; for (var i = 0; i < L.length; i++){ if (!L[i]) continue; var d = Math.hypot(L[i].x - p.x, L[i].y - p.y); if (d < bd){ bd = d; best = i; } } return best; }
  c.pointer(function(type, p){
    if (type === "down"){ var i = near(p); if (i >= 0){ st.active = i; move(i, p, "down"); } else if (opt.miss){ opt.miss(p, "down"); } }
    else if (type === "drag"){ if (st.active >= 0) move(st.active, p, "drag"); else if (opt.miss) opt.miss(p, "drag"); }
    else if (type === "up"){ if (st.active >= 0) move(st.active, p, "up"); st.active = -1; if (opt.miss) opt.miss(p, "up"); }
    else if (type === "move"){ c.cv.style.cursor = near(p) >= 0 ? "grab" : (opt.cursor || "default"); }
  });
  return st;
};


/* petites aides d'algèbre linéaire en 3D */
M.cross = function(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; };
M.dot = function(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; };
M.eq3 = function(S,a,b,c,d){
  var s="", t=[[a,"x"],[b,"y"],[c,"z"]];
  t.forEach(function(p){ if(p[0]===0) return; var ab=Math.abs(p[0]), co=ab===1?"":S.fmt(ab,0);
    if(s==="") s=(p[0]<0?"−":"")+co+p[1]; else s+=(p[0]<0?" − ":" + ")+co+p[1]; });
  if(s==="") s="0";
  return s+" = "+S.fmt(d,0);
};
M.lin3 = function(S,A,dd){ if(dd===0) return S.fmt(A,0); var co=Math.abs(dd)===1?"":S.fmt(Math.abs(dd),0), term=co+"t"; if(A===0) return (dd<0?"−":"")+term; return S.fmt(A,0)+(dd<0?" − ":" + ")+term; };
M.v3 = function(S,p,d){ return "("+p.map(function(z){ return S.fmt(z,d==null?0:d); }).join(" ; ")+")"; };

/* ====== caméra 3D à perspective (utilisée par les chapitres 4, 5 et 6) ====== */
M.cam3 = function(c, S, o){
  o = o || {};
  var L = o.L || 5, v = {yaw:o.yaw == null ? -0.62 : o.yaw, pitch:o.pitch == null ? 0.42 : o.pitch, L:L, c:c, zoom:o.zoom || 1, dist:(o.dist || 7) * L, handles:null, active:-1, spin:false};
  var P0 = S.draw.palette;
  v.u = function(){ return Math.min(c.W * 1.0, c.H * 1.12) / (2 * L * 1.78) * v.zoom; };
  v.tr = function(p){ var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch), x1 = p[0] * cy - p[1] * sy, y1 = p[0] * sy + p[1] * cy; return [x1, p[2] * cp + y1 * sp, y1 * cp - p[2] * sp]; };
  v.P = function(p){ var t = v.tr(p), s = v.u() * v.dist / (v.dist + t[2]); return {x:c.W / 2 + t[0] * s, y:c.H / 2 + (o.dy || 0) - t[1] * s, d:t[2], s:s}; };
  v.line = function(p, q, col, w, dash){ var a = v.P(p), b = v.P(q); S.draw.line(c, a.x, a.y, b.x, b.y, col, w, dash); };
  v.dot = function(p, r, col){ var q = v.P(p); S.draw.dot(c, q.x, q.y, r, col); return q; };
  v.arrow = function(p, q, col, w){ var a = v.P(p), b = v.P(q); S.draw.arrow(c, a.x, a.y, b.x, b.y, col, w); };
  v.text = function(p, txt, opt){ var q = v.P(p); opt = opt || {}; S.draw.text(c, txt, q.x + (opt.dx || 0), q.y + (opt.dy || 0), opt); };
  /* résolution écran -> espace : on fixe la coordonnée fix (0,1,2) à la valeur val, on cherche les deux autres (Newton) */
  v.pick = function(px, py, fix, val, guess){
    var idx = [0, 1, 2].filter(function(i){ return i !== fix; }), g = guess ? guess.slice() : [0, 0, 0]; g[fix] = val;
    for (var it = 0; it < 14; it++){
      var q = v.P(g), ex = px - q.x, ey = py - q.y; if (Math.abs(ex) + Math.abs(ey) < 0.05) break;
      var h = 0.02, ga = g.slice(), gb = g.slice(); ga[idx[0]] += h; gb[idx[1]] += h;
      var qa = v.P(ga), qb = v.P(gb), a = (qa.x - q.x) / h, b = (qb.x - q.x) / h, cc = (qa.y - q.y) / h, d = (qb.y - q.y) / h, det = a * d - b * cc;
      if (Math.abs(det) < 1e-6) break;
      g[idx[0]] += (d * ex - b * ey) / det; g[idx[1]] += (-cc * ex + a * ey) / det;
      g[idx[0]] = M.clamp(g[idx[0]], -L * 1.5, L * 1.5); g[idx[1]] = M.clamp(g[idx[1]], -L * 1.5, L * 1.5);
    }
    return g;
  };
  /* boîte : sol quadrillé, deux parois du fond, axes gradués */
  v.box = function(opt){
    opt = opt || {}; var ctx = c.ctx, i, t, grid = "#e6eaf1", edge = "#cfd6e1";
    function gl(a, b){ v.line(a, b, grid, 1); }
    var step = opt.step || 1;
    ctx.save();
    var floorZ = v.pitch >= -0.05 ? -L : L;
    for (t = -L; t <= L + 1e-9; t += step){ gl([t, -L, floorZ], [t, L, floorZ]); gl([-L, t, floorZ], [L, t, floorZ]); }
    var wx = v.tr([L, 0, 0])[2] > v.tr([-L, 0, 0])[2] ? L : -L, wy = v.tr([0, L, 0])[2] > v.tr([0, -L, 0])[2] ? L : -L;
    for (t = -L; t <= L + 1e-9; t += step){ gl([wx, t, -L], [wx, t, L]); gl([wx, -L, t], [wx, L, t]); gl([t, wy, -L], [t, wy, L]); gl([-L, wy, t], [L, wy, t]); }
    var cs = [[-L, -L], [L, -L], [L, L], [-L, L]];
    for (i = 0; i < 4; i++){ var a = cs[i], b = cs[(i + 1) % 4]; v.line([a[0], a[1], -L], [b[0], b[1], -L], edge, 1.2); v.line([a[0], a[1], L], [b[0], b[1], L], edge, 1.2); v.line([a[0], a[1], -L], [a[0], a[1], L], edge, 1.2); }
    ctx.restore();
    if (opt.axes === false) return;
    var ax = [[0, "x", "#c0321d"], [1, "y", "#24775a"], [2, "z", "#1f4b9e"]];
    ax.forEach(function(A){
      var a = [0, 0, 0], b = [0, 0, 0]; a[A[0]] = -L; b[A[0]] = L;
      v.line(a, b, A[2], 1.8);
      var tip = v.P(b), tp = [0, 0, 0]; tp[A[0]] = L * 0.93;
      S.draw.arrow(c, v.P(tp).x, v.P(tp).y, tip.x, tip.y, A[2], 1.8);
      var lb = [0, 0, 0]; lb[A[0]] = L * 1.12; var q = v.P(lb); S.draw.text(c, A[1], q.x, q.y, {size:M.fs(c, 14), color:A[2], math:true, weight:700, italic:true});
      if (opt.ticks !== false) for (var k2 = -Math.floor(L); k2 <= Math.floor(L); k2++){ if (!k2 || k2 % 2) continue; var tpp = [0, 0, 0]; tpp[A[0]] = k2; var qq = v.P(tpp); S.draw.text(c, S.fmt(k2, 0), qq.x + (A[0] === 2 ? -11 : 0), qq.y + (A[0] === 2 ? 0 : 11), {size:10, color:"#7b8694", weight:600}); }
    });
  };
  /* plan n·x = d découpé par la boîte : polygone rempli, quadrillé, contour */
  v.planePoly = function(n, d){
    var pts = [], cs = [], i, j;
    for (i = 0; i < 8; i++) cs.push([(i & 1 ? L : -L), (i & 2 ? L : -L), (i & 4 ? L : -L)]);
    function sv(p){ return n[0] * p[0] + n[1] * p[1] + n[2] * p[2] - d; }
    for (i = 0; i < 8; i++) for (j = i + 1; j < 8; j++){ var df = i ^ j; if (df !== 1 && df !== 2 && df !== 4) continue;
      var a = cs[i], b = cs[j], sa = sv(a), sb = sv(b);
      if (Math.abs(sa) < 1e-9) pts.push(a.slice());
      if (Math.abs(sb) < 1e-9) pts.push(b.slice());
      if (sa * sb < -1e-12){ var t = sa / (sa - sb); pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); } }
    var u = []; pts.forEach(function(p){ if (!u.some(function(q){ return Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) + Math.abs(q[2] - p[2]) < 1e-6; })) u.push(p); });
    if (u.length < 3) return null;
    var ctr = [0, 0, 0]; u.forEach(function(p){ ctr[0] += p[0] / u.length; ctr[1] += p[1] / u.length; ctr[2] += p[2] / u.length; });
    var nn = Math.hypot(n[0], n[1], n[2]), nz = [n[0] / nn, n[1] / nn, n[2] / nn], a0 = Math.abs(nz[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    var e1 = [nz[1] * a0[2] - nz[2] * a0[1], nz[2] * a0[0] - nz[0] * a0[2], nz[0] * a0[1] - nz[1] * a0[0]], l1 = Math.hypot(e1[0], e1[1], e1[2]); e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1];
    var e2 = [nz[1] * e1[2] - nz[2] * e1[1], nz[2] * e1[0] - nz[0] * e1[2], nz[0] * e1[1] - nz[1] * e1[0]];
    u.sort(function(p, q){ function ang(r){ var x = [r[0] - ctr[0], r[1] - ctr[1], r[2] - ctr[2]]; return Math.atan2(x[0] * e2[0] + x[1] * e2[1] + x[2] * e2[2], x[0] * e1[0] + x[1] * e1[1] + x[2] * e1[2]); } return ang(p) - ang(q); });
    return {pts:u, ctr:ctr, e1:e1, e2:e2, nz:nz};
  };
  v.plane = function(n, d, col, opt){
    opt = opt || {}; var poly = v.planePoly(n, d); if (!poly) return null;
    var ctx = c.ctx, u = poly.pts; ctx.save();
    ctx.beginPath(); u.forEach(function(p, i){ var q = v.P(p); if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath();
    ctx.fillStyle = S.draw.tint(col, opt.alpha == null ? 0.2 : opt.alpha); ctx.fill(); ctx.clip();
    /* quadrillage dans le plan */
    ctx.strokeStyle = S.draw.tint(col, 0.2); ctx.lineWidth = 1; var gs = opt.mesh || 1.25, big = 3 * L;
    [poly.e1, poly.e2].forEach(function(e, w){ var f = w ? poly.e1 : poly.e2; for (var s = -big; s <= big; s += gs){ var o2 = [poly.ctr[0] + f[0] * s, poly.ctr[1] + f[1] * s, poly.ctr[2] + f[2] * s], a = v.P([o2[0] - e[0] * big, o2[1] - e[1] * big, o2[2] - e[2] * big]), b = v.P([o2[0] + e[0] * big, o2[1] + e[1] * big, o2[2] + e[2] * big]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } });
    ctx.restore(); ctx.save();
    ctx.beginPath(); u.forEach(function(p, i){ var q = v.P(p); if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath();
    ctx.strokeStyle = col; ctx.lineWidth = opt.lw || 1.8; ctx.lineJoin = "round"; ctx.stroke(); ctx.restore();
    if (opt.label){ var q = v.P(u[0]); }
    return poly;
  };
  /* droite P + t·u coupée par la boîte */
  v.clipSeg = function(Pt, u){
    var t0 = -1e9, t1 = 1e9;
    for (var i = 0; i < 3; i++){ if (Math.abs(u[i]) < 1e-9){ if (Math.abs(Pt[i]) > L + 1e-9) return null; } else { var a = (-L - Pt[i]) / u[i], b = (L - Pt[i]) / u[i]; if (a > b){ var tt = a; a = b; b = tt; } t0 = Math.max(t0, a); t1 = Math.min(t1, b); } }
    if (t0 >= t1) return null;
    return [[Pt[0] + t0 * u[0], Pt[1] + t0 * u[1], Pt[2] + t0 * u[2]], [Pt[0] + t1 * u[0], Pt[1] + t1 * u[1], Pt[2] + t1 * u[2]]];
  };
  v.seg = function(Pt, u, col, w, dash){ var s = v.clipSeg(Pt, u); if (!s) return null; v.line(s[0], s[1], col, w, dash); return s; };
  /* repère de lecture : pointillés du point vers le plan xOy puis vers l'axe x */
  v.coords = function(p, col){ v.line(p, [p[0], p[1], 0], col, 1.2, [3, 3]); v.line([p[0], p[1], 0], [p[0], 0, 0], col, 1.2, [3, 3]); v.line([p[0], 0, 0], [0, 0, 0], col, 1.2, [3, 3]); };
  v.inBox = function(X){ return Math.abs(X[0]) <= L + 1e-9 && Math.abs(X[1]) <= L + 1e-9 && Math.abs(X[2]) <= L + 1e-9; };
  v.hint = function(txt){ S.draw.text(c, txt || "Glisse pour tourner la vue", 10, c.H - 12, {size:11, color:"#8a95a3", align:"left", weight:600}); };
  /* interactions : rotation à la souris ou au doigt, poignées éventuelles */
  v.attach = function(k, getHandles){
    v.handles = getHandles || null; var last = null;
    c.pointer(function(type, p){
      if (type === "down"){
        v.active = -1; var H = v.handles ? v.handles() : [], bd = 26;
        H.forEach(function(h, i){ var q = v.P(h.p), d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd){ bd = d; v.active = i; } });
        if (v.active < 0) last = p; else last = null;
      } else if (type === "drag"){
        if (v.active >= 0){ var h = v.handles()[v.active], g = v.pick(p.x, p.y, h.fix, h.p[h.fix], h.p); h.set(g); k.redraw(); }
        else if (last){ v.yaw += (p.x - last.x) * 0.011; v.pitch = M.clamp(v.pitch + (p.y - last.y) * 0.011, -1.2, 1.45); last = p; k.redraw(); }
      } else if (type === "up"){ v.active = -1; last = null; }
      else if (type === "move"){ var H2 = v.handles ? v.handles() : [], on = false; H2.forEach(function(h){ var q = v.P(h.p); if (Math.hypot(q.x - p.x, q.y - p.y) < 26) on = true; }); c.cv.style.cursor = on ? "grab" : "move"; }
    });
    var tg = k.toggle("Rotation lente", false, function(on){ v.spin = on; if (on) lp.play(); else lp.pause(); });
    var lp = k.loop(function(dt){ if (!v.spin){ lp.pause(); return; } v.yaw += dt * 0.35; k.redraw(); });
    return v;
  };
  return v;
};
return M;
})();
/* Chapitre 1 : exponentielles et logarithmes */
SFA.sim({
  id:"m6-c01-famille", ch:"c01", tag:"Classique",
  titre:"La famille a^x : croissance ou décroissance ?",
  resume:"Tire la courbe vers le haut ou le bas : la base a change, le point (0 ; 1) ne bouge jamais.",
  but:"Déplace la base a (curseur, ou glisse le point sur la courbe en x = 1). Observe quand la courbe monte, quand elle descend, et ce qui ne change jamais : le point (0 ; 1).",
  aRetenir:"Pour a > 0 et a ≠ 1, la courbe de y = a<sup>x</sup> passe toujours par (0 ; 1) et reste au-dessus de l'axe des x. Si a > 1 elle croît, si 0 < a < 1 elle décroît. La pente de la tangente en 0 vaut ln a ; elle vaut exactement 1 pour a = e ≈ 2,718.",
  piege:"a<sup>x</sup> n'est jamais négatif ni nul : l'équation a<sup>x</sup> = −3 n'a aucune solution. Et la base a = 1 donne la droite constante y = 1, ce n'est pas une « vraie » exponentielle.",
  build:function(k,S){
    var c=M6.canvas(k,.78,320), P=S.draw.palette;
    var a=k.slider("Base a",0.2,4,0.05,2,"",null);
    var tg=k.toggle("Montrer la tangente en (0 ; 1)",true);
    var sy=k.toggle("Montrer la courbe de base 1/a (symétrique)",false);
    var ee=k.toggle("Comparer avec e^x (a = e)",false);
    var ro=k.readouts(["Sens","Pente en 0 (ln a)","Valeur en x = 2","Valeur en x = −1"]);
    var nt=k.note("","warn"), ax=null;
    k.draw(function(){
      c.clear(); var A=a.value, grow=A>1+1e-9, flat=Math.abs(A-1)<1e-9, col=flat?P.grey:(grow?P.mat:P.teal), m=Math.log(A), fs=M6.fs(c,12);
      ax=S.draw.axes(c,{x0:-3,x1:3,y0:-1,y1:8,xl:"x",yl:"y",stepX:1,stepY:1});
      S.draw.area(c,ax,function(x){return Math.pow(A,x);},-3,3,col,0.07);
      if(ee.value) S.draw.fn(c,ax,function(x){return Math.exp(x);},P.amber,2,[6,4]);
      if(sy.value && !flat) S.draw.fn(c,ax,function(x){return Math.pow(1/A,x);},P.grey,2,[4,4]);
      S.draw.fn(c,ax,function(x){return Math.pow(A,x);},col,3.2);
      if(tg.value){ S.draw.fn(c,ax,function(x){return 1+m*x;},P.red,1.8);
        S.draw.line(c,ax.X(0),ax.Y(1),ax.X(1),ax.Y(1),P.red,1.2,[3,3]); S.draw.line(c,ax.X(1),ax.Y(1),ax.X(1),ax.Y(1+m),P.red,1.2,[3,3]);
        S.draw.label(c,"pente "+S.fmt(m,2),ax.X(1)+6,ax.Y(1+m/2)+(m>=0?14:-14),{color:P.red,align:"left",size:fs}); }
      S.draw.dot(c,ax.X(0),ax.Y(1),6,P.red); S.draw.label(c,"(0 ; 1)",ax.X(0)-8,ax.Y(1)+18,{color:P.red,align:"right",size:fs});
      if(ee.value) S.draw.label(c,"e^x",ax.X(1.9),ax.Y(Math.exp(1.9))+14,{color:P.amber,size:fs});
      var hy=Math.min(8,A);
      S.draw.line(c,ax.X(1),ax.Y(0),ax.X(1),ax.Y(hy),P.grey,1,[3,3]);
      M6.handle(S,c,ax.X(1),ax.Y(hy),col,false,8); S.draw.label(c,"a = "+S.fmt(A,2),ax.X(1)+12,ax.Y(hy)-4,{color:col,align:"left",size:fs});
      ro.set(0,flat?"constante":(grow?"croît":"décroît"));
      ro.set(1,S.fmt(m,3)); ro.set(2,S.fmt(A*A,3)); ro.set(3,S.fmt(1/A,3));
      if(flat) nt.set("a = 1 : la courbe est la droite y = 1 et la pente en 0 est nulle. Ce n'est pas une vraie exponentielle.","warn");
      else if(Math.abs(m-1)<0.02) nt.set("Gagné : la pente en (0 ; 1) vaut "+S.fmt(m,2)+" ≈ 1. Cette base est e ≈ 2,718.","ok");
      else nt.set("Défi : trouve la base pour laquelle la pente de la tangente en (0 ; 1) vaut 1. Pente actuelle : "+S.fmt(m,2)+" ("+(m<1?"trop petite":"trop grande")+"). Indice : un nombre célèbre, entre 2,6 et 2,8.","warn");
    });
    c.cv.style.cursor="ns-resize";
    M6.drag(c,function(){ return ax?[{x:ax.X(1),y:ax.Y(Math.min(8,a.value))}]:[]; },function(i,p){ a.set(M6.clamp(Math.round(ax.iy(p.y)*20)/20,0.2,4)); k.redraw(); },{r:28});
  }
});

SFA.sim({
  id:"m6-c01-reciproque", ch:"c01", tag:"Classique",
  titre:"Exponentielle et logarithme : deux courbes en miroir",
  resume:"Glisse un point sur y = a^x : son symétrique par rapport à y = x est sur y = log_a(x).",
  but:"Glisse le point P sur la courbe exponentielle (souris ou curseur). Son symétrique Q par rapport à la droite y = x est sur la courbe du logarithme. Le bouton « Plier » fait basculer la courbe bleue sur la verte.",
  aRetenir:"y = log<sub>a</sub>(x) signifie a<sup>y</sup> = x. Les courbes de a<sup>x</sup> et de log<sub>a</sub>(x) sont symétriques par rapport à la droite y = x : si P(t ; a<sup>t</sup>) est sur l'une, Q(a<sup>t</sup> ; t) est sur l'autre. Le logarithme n'existe que pour x > 0.",
  piege:"Le domaine de log<sub>a</sub> est ]0 ; +∞[ : on ne peut pas prendre le logarithme d'un nombre négatif ou nul. Et log<sub>a</sub>(x) n'est pas 1/a<sup>x</sup> : c'est la réciproque, pas l'inverse.",
  build:function(k,S){
    var c=M6.canvas(k,.88,340), P=S.draw.palette;
    var base=k.select("Base",[["2","a = 2"],["e","a = e (logarithme népérien)"],["10","a = 10 (logarithme décimal)"],["0.5","a = 1/2"]],"2");
    var t=k.slider("Abscisse t de P",-3,3,0.05,1,"",null);
    var fold=0, dir=0, lp=k.loop(function(dt){ fold=M6.clamp(fold+dir*dt*0.8,0,1); if(fold<=0||fold>=1) lp.pause(); k.redraw(); });
    k.button("Plier le papier le long de y = x",function(){ dir=fold>=0.99?-1:1; lp.play(); },true);
    var ro=k.readouts(["P (t ; a^t)","Q (a^t ; t)","log_a(a^t)","Domaine de log"]);
    var nt=k.note("",""), ax=null;
    function B(){return base.value==="e"?Math.E:parseFloat(base.value);}
    k.draw(function(){
      c.clear(); var a=B(), T=t.value, fs=M6.fs(c,12);
      var half=4.5, L=46,R=16,Tp=16,Bt=34, w=c.W-L-R, h=c.H-Tp-Bt;
      var yspan=2*half*h/w; ax=S.draw.axes(c,{x0:-half+1,x1:half+1,y0:1-yspan/2,y1:1+yspan/2,xl:"x",yl:"y",stepX:1,stepY:1});
      S.draw.line(c,ax.X(-10),ax.Y(-10),ax.X(10),ax.Y(10),P.grey,1.5,[6,5]);
      var f=function(x){return Math.pow(a,x);}, g=function(x){return x>0?Math.log(x)/Math.log(a):NaN;};
      S.draw.fn(c,ax,g,P.green,3);
      if(fold>0&&fold<1){ /* courbe en cours de pliage : (x ; a^x) glisse vers (a^x ; x) */
        var ctx=c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.violet; ctx.lineWidth=2.4; ctx.setLineDash([5,4]); ctx.beginPath(); var on=false;
        for(var i=0;i<=200;i++){ var x=-4+8*i/200, y=f(x), px=x+(y-x)*fold, py=y+(x-y)*fold; if(!isFinite(py)||Math.abs(py)>60){on=false;continue;} on?ctx.lineTo(ax.X(px),ax.Y(py)):ctx.moveTo(ax.X(px),ax.Y(py)); on=true; } ctx.stroke(); ctx.restore(); }
      else S.draw.fn(c,ax,f,P.mat,3);
      var py=f(T), Pp={x:T+(py-T)*fold,y:py+(T-py)*fold};
      S.draw.line(c,ax.X(T),ax.Y(py),ax.X(py),ax.Y(T),P.violet,1.5,[3,3]);
      S.draw.line(c,ax.X(T),ax.Y(py),ax.X(T),ax.Y(0),P.mat,1,[2,3]); S.draw.line(c,ax.X(py),ax.Y(T),ax.X(py),ax.Y(0),P.green,1,[2,3]);
      S.draw.dot(c,ax.X(py),ax.Y(T),6,P.green);
      M6.handle(S,c,ax.X(Pp.x),ax.Y(Pp.y),fold>0.5?P.green:P.mat,false,8);
      S.draw.label(c,"P",ax.X(T)-14,ax.Y(py)-14,{color:P.mat,size:fs}); S.draw.label(c,"Q",ax.X(py)+14,ax.Y(T)+14,{color:P.green,size:fs});
      S.draw.legend(c,[[P.mat,"y = a^x"],[P.green,"y = log_a(x)"],[P.grey,"y = x",true]],ax.L+8,ax.T+6);
      ro.set(0,"("+S.fmt(T,2)+" ; "+S.fmt(py,3)+")"); ro.set(1,"("+S.fmt(py,3)+" ; "+S.fmt(T,2)+")");
      ro.set(2,S.fmt(Math.log(py)/Math.log(a),2)); ro.set(3,"x > 0");
      var outv=py>ax.y1||py>ax.x1||py<ax.y0;
      nt.set(outv?"P ou Q sort du cadre (a^t trop grand ou trop petit) : les valeurs affichées restent justes, rapproche t de 0 pour voir les deux points.":"Q est le symétrique de P par rapport à y = x : abscisse et ordonnée sont échangées.",outv?"warn":"ok");
    });
    M6.drag(c,function(){ return ax?[{x:ax.X(t.value),y:ax.Y(Math.pow(B(),t.value))}]:[]; },function(i,p){ t.set(M6.clamp(Math.round(ax.ix(p.x)*20)/20,-3,3)); k.redraw(); },{r:30,cursor:"default",miss:function(p,ph){ if(ph==="up")return; if(ax){ t.set(M6.clamp(Math.round(ax.ix(p.x)*20)/20,-3,3)); k.redraw(); } }});
  }
});

SFA.sim({
  id:"m6-c01-echelle-log", ch:"c01", tag:"Échelle log",
  titre:"Échelle logarithmique : l'exponentielle devient une droite",
  resume:"Bascule l'axe vertical en échelle logarithmique et compare exponentielle et polynôme.",
  but:"Choisis un modèle, puis bascule l'axe vertical entre linéaire et logarithmique (l'axe se déforme sous tes yeux). Qui devient une droite ?",
  aRetenir:"Si y = C·b<sup>x</sup>, alors log y = log C + x·log b : en échelle logarithmique verticale, une exponentielle est une droite de pente log b. Une puissance comme x³ n'est jamais une droite dans ce repère. Le temps de doublement vaut ln 2 / ln b.",
  piege:"Sur une échelle logarithmique, des graduations égales signifient des multiplications égales (×10, ×10…), pas des additions égales. Et le zéro n'existe pas sur cet axe.",
  build:function(k,S){
    var c=M6.canvas(k,.74,320), P=S.draw.palette;
    var mod=k.seg("Modèle",[["exp","y = 2·b^x"],["pol","y = 2·x³"]],"exp");
    var b=k.slider("Facteur b par unité de x",1.1,3,0.05,1.5,"",null);
    var tgt=0, s=0, lp=k.loop(function(dt){ var d=tgt-s; s+= Math.sign(d)*Math.min(Math.abs(d),dt*1.6); if(Math.abs(tgt-s)<1e-4){ s=tgt; lp.pause(); } k.redraw(); });
    var ech=k.seg("Axe vertical",[["lin","Linéaire"],["log","Logarithmique"]],"lin",function(v){ tgt=v==="log"?1:0; lp.play(); });
    var dbl=k.toggle("Marquer les doublements (exponentielle)",false);
    var ro=k.readouts(["y(10)","Doublement (ln 2/ln b)","Pente log₁₀ b","Rapport y(10)/y(5)"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, fs=M6.fs(c,11);
      function f(x){return mod.value==="exp"?2*Math.pow(b.value,x):2*x*x*x;}
      var N=10, ymax=f(N), L=58,R=16,T=22,B=34, W=c.W,H=c.H, X=function(x){return L+x/N*(W-L-R);};
      var top=ymax*1.05, hi=Math.max(2,Math.ceil(Math.log10(ymax*1.05)));
      var Yl=function(y){return H-B-y/top*(H-T-B);}, Yg=function(y){return H-B-(Math.log10(Math.max(y,1e-9)))/hi*(H-T-B);};
      var Y=function(y){ return Yl(y)*(1-s)+Yg(y)*s; };
      /* graduations : linéaires qui s'effacent, logarithmiques qui apparaissent */
      ctx.save(); ctx.font="600 "+fs+"px Mulish, sans-serif"; ctx.textAlign="right"; ctx.textBaseline="middle";
      var st=Math.pow(10,Math.floor(Math.log10(top/4))); st*=(top/st>16?5:(top/st>8?2:1));
      if(s<1){ ctx.globalAlpha=1-s; for(var v=0;v<=top;v+=st){ ctx.strokeStyle="#edf0f4"; ctx.beginPath(); ctx.moveTo(L,Yl(v)); ctx.lineTo(W-R,Yl(v)); ctx.stroke(); ctx.fillStyle="#5f6b7a"; ctx.fillText(S.fmt(v,0),L-6,Yl(v)); } }
      if(s>0){ ctx.globalAlpha=s; for(var e=0;e<=hi;e++){ for(var m=1;m<10;m++){ var y=m*Math.pow(10,e); if(y>Math.pow(10,hi)) break; ctx.strokeStyle=m===1?"#d3d9e2":"#f0f2f6"; ctx.beginPath(); ctx.moveTo(L,Yg(y)); ctx.lineTo(W-R,Yg(y)); ctx.stroke(); } ctx.fillStyle="#2c3a4e"; ctx.font="700 "+fs+"px Mulish, sans-serif"; ctx.fillText(S.fmt(Math.pow(10,e),0),L-6,Yg(Math.pow(10,e))); } }
      ctx.globalAlpha=1; ctx.textAlign="center"; ctx.textBaseline="top"; ctx.fillStyle="#5f6b7a"; ctx.font="600 "+fs+"px Mulish, sans-serif";
      for(var x=0;x<=N;x++){ ctx.fillText(String(x),X(x),H-B+6); }
      ctx.strokeStyle="#a3adba"; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(L,T); ctx.lineTo(L,H-B); ctx.lineTo(W-R,H-B); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(L,T-4,W-L-R,H-T-B+4); ctx.clip(); ctx.strokeStyle=P.mat; ctx.lineWidth=3.2; ctx.lineJoin="round"; ctx.beginPath(); var on=false;
      for(var i=0;i<=240;i++){ var xx=N*i/240, yy=f(xx); if(yy<=0.02&&s>0.02){ on=false; continue; } var px=X(xx), py=Y(yy); on?ctx.lineTo(px,py):ctx.moveTo(px,py); on=true; } ctx.stroke(); ctx.restore();
      if(dbl.value&&mod.value==="exp"){ var td=Math.log(2)/Math.log(b.value), y0=2; for(var q=0;y0*Math.pow(2,q)<=ymax*1.02;q++){ var xq=q*td; if(xq>N) break; var yq=2*Math.pow(2,q); S.draw.dot(c,X(xq),Y(yq),5,P.amber); S.draw.line(c,X(xq),Y(yq),X(xq),H-B,P.amber,1,[3,3]); if(q>0) S.draw.label(c,"×2",X(xq),Y(yq)-14,{color:P.amber,size:fs}); } }
      for(var j=0;j<=N;j++){ if(f(j)<=0.02&&s>0.02) continue; S.draw.dot(c,X(j),Y(f(j)),4,P.red); }
      S.draw.label(c,s<0.5?"axe vertical : linéaire":"axe vertical : logarithmique (×10 par graduation)",L+8,T+2,{align:"left",size:M6.fs(c,12),color:P.ink});
      if(s>0.98&&mod.value==="exp") S.draw.label(c,"droite de pente log₁₀ b = "+S.fmt(Math.log10(b.value),3),W-R-8,H-B-16,{align:"right",size:M6.fs(c,12),color:P.green});
      if(s>0.98&&mod.value==="pol") S.draw.label(c,"courbe : jamais une droite",W-R-8,H-B-16,{align:"right",size:M6.fs(c,12),color:P.red});
      ro.set(0,S.fmt(f(10),1));
      ro.set(1,mod.value==="exp"?S.fmt(Math.log(2)/Math.log(b.value),2)+" unités":"—");
      ro.set(2,mod.value==="exp"?S.fmt(Math.log10(b.value),3):"—");
      ro.set(3,S.fmt(f(10)/f(5),2));
    });
  }
});

SFA.sim({
  id:"m6-c01-demi-vie", ch:"c01", tag:"Niche utile",
  titre:"Datation : de la demi-vie au « âge » d'un échantillon",
  resume:"Fixe le pourcentage restant d'un noyau radioactif et lis l'âge, avec une marge d'erreur.",
  but:"Choisis un noyau puis le pourcentage de noyaux restants (curseur, ou glisse le point sur la courbe) : la simulation résout (1/2)^(t/T) = p avec un logarithme et donne l'âge.",
  aRetenir:"N(t) = N₀·(1/2)<sup>t/T</sup>. Pour trouver t, on prend le logarithme : t = T·log₂(N₀/N) = T·ln(N₀/N)/ln 2. Après 10 demi-vies il reste environ 0,1 % des noyaux.",
  piege:"Avec peu de noyaux restants, une petite erreur de mesure sur le pourcentage donne une grosse erreur sur l'âge. Le carbone 14 ne sert que jusqu'à environ 50 000 ans (≈ 9 demi-vies).",
  build:function(k,S){
    var c=M6.canvas(k,.82,340), P=S.draw.palette;
    var nuc=k.select("Noyau",[["5730","Carbone 14 (T = 5 730 ans)"],["8.02","Iode 131 (T = 8,02 jours)"],["6.01","Technétium 99m (T = 6,01 h)"]],"5730");
    var unit={"5730":"ans","8.02":"jours","6.01":"heures"};
    var p=k.slider("Pourcentage restant p",0.5,100,0.5,25,"%",null);
    var ro=k.readouts(["Demi-vies écoulées","Âge t","Âge si p−1 %","Âge si p+1 %"]);
    var nt=k.note("","warn"), ax=null;
    function age(T,pp){return T*Math.log(100/pp)/Math.log(2);}
    k.draw(function(){
      c.clear(); var T=parseFloat(nuc.value), u=unit[nuc.value], pp=p.value, fs=M6.fs(c,12), H=c.H, W=c.W, ctx=c.ctx;
      var gh=Math.round(H*0.7);
      var sub={W:W,H:gh,ctx:ctx,clear:c.clear};
      ax=S.draw.axes(sub,{x0:0,x1:10,y0:0,y1:100,xl:"demi-vies",yl:"% restant",stepX:1,stepY:25,b:30});
      S.draw.area(sub,ax,function(n){return 100*Math.pow(0.5,n);},0,10,P.mat,0.08);
      S.draw.fn(sub,ax,function(n){return 100*Math.pow(0.5,n);},P.mat,3);
      [0,1,2,3,4].forEach(function(q){ var yv=100/Math.pow(2,q); S.draw.dot(c,ax.X(q),ax.Y(yv),3.5,P.grey); if(q>0&&q<4&&Math.abs(q-Math.log(100/pp)/Math.log(2))>0.5) S.draw.text(c,S.fmt(yv,1)+" %",ax.X(q)+6,ax.Y(yv)-10,{size:10.5,color:P.grey,align:"left",weight:700}); });
      var n=Math.log(100/pp)/Math.log(2), lo=Math.min(100,pp+1), hi=pp-1>0?pp-1:null;
      var nlo=Math.log(100/lo)/Math.log(2), nhi=hi?Math.log(100/hi)/Math.log(2):10;
      ctx.save(); ctx.fillStyle=S.draw.tint(P.red,0.14); var xa=ax.X(Math.min(nlo,nhi)), xb=ax.X(Math.max(nlo,nhi)); ctx.fillRect(xa,ax.T,Math.max(2,xb-xa),ax.B-ax.T); ctx.restore();
      S.draw.line(c,ax.X(0),ax.Y(pp),ax.X(n),ax.Y(pp),P.red,1.5,[4,4]);
      S.draw.line(c,ax.X(n),ax.Y(pp),ax.X(n),ax.Y(0),P.red,1.5,[4,4]);
      M6.handle(S,c,ax.X(n),ax.Y(pp),P.red,false,8);
      S.draw.label(c,"n = "+S.fmt(n,2)+" demi-vies",ax.X(Math.min(Math.max(n,0.4),6))+14,Math.max(ax.Y(pp)-16,ax.Y(100)+16),{size:fs,color:P.red,align:"left"});
      /* 100 noyaux : ceux qui restent sont pleins, les autres sont désintégrés */
      var cols=25, rows=4, cell=Math.min(15,(W-24)/cols), oy=gh+14, ox=(W-cols*cell)/2, remain=Math.round(pp);
      for(var i=0;i<100;i++){ var r=Math.floor(i/cols), q=i%cols, x=ox+q*cell+cell/2, y=oy+r*cell+cell/2; ctx.beginPath(); ctx.arc(x,y,cell*0.36,0,6.2832); if(i<pp){ ctx.fillStyle=P.mat; ctx.fill(); } else { ctx.strokeStyle="#c9d1dc"; ctx.lineWidth=1; ctx.stroke(); } }
      S.draw.text(c,"100 noyaux au départ : "+S.fmt(pp,1)+" restent (pleins), les autres se sont désintégrés (vides)",W/2,oy+rows*cell+13,{size:M6.fs(c,11),color:P.grey,weight:600});
      var t=age(T,pp), hiA=hi?age(T,hi):null, loA=age(T,lo);
      ro.set(0,S.fmt(n,2)); ro.set(1,S.fmt(t,T>100?0:2)+" "+u);
      ro.set(2,hiA===null?"—":S.fmt(hiA,T>100?0:2)); ro.set(3,S.fmt(loA,T>100?0:2));
      if(pp<1) nt.set("Moins de 1 % restant : la marge d'erreur explose, la datation n'est plus fiable.","warn");
      else if(n>9) nt.set("Plus de 9 demi-vies : il reste très peu de noyaux, la mesure devient imprécise.","warn");
      else nt.set("Essaie p = 50 % (1 demi-vie), 25 % (2 demi-vies), 12,5 % (3 demi-vies). La bande rouge montre l'incertitude d'une mesure à ±1 %.","ok");
    });
    M6.drag(c,function(){ if(!ax) return []; var n=Math.log(100/p.value)/Math.log(2); return [{x:ax.X(n),y:ax.Y(p.value)}]; },function(i,pt){ var n=M6.clamp(ax.ix(pt.x),0.01,7.5); p.set(M6.clamp(Math.round(100*Math.pow(0.5,n)*2)/2,0.5,100)); k.redraw(); },{r:30,miss:function(pt,ph){ if(ph==="up"||!ax) return; var n=M6.clamp(ax.ix(pt.x),0.01,7.5); p.set(M6.clamp(Math.round(100*Math.pow(0.5,n)*2)/2,0.5,100)); k.redraw(); }});
  }
});
