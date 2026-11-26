/* Mathématiques BA1 · lot MA3 (novembre 2026)
   ma-injective-surjective (c01) : la droite horizontale, restreindre et corestreindre
   ma-point-fixe-moine (c02) : le moine qui monte et descend, traverser le carré [0 ; 1]²
   Fichier autonome : toutes les aides sont préfixées m3. */
(function(){
"use strict";
var D = SFA.draw, F = SFA.fmt, PI = Math.PI;
var M3C = {blue:"#1f4b9e", red:"#c0321d", green:"#24775a", amber:"#c26a0c", violet:"#6236c4", gold:"#d99a00", ink:"#0f1b2d", grey:"#8a95a3", orange:"#e07a1f", sky:"#2f7fd1"};
var M3FONT = "Mulish, system-ui, -apple-system, 'Segoe UI', sans-serif";
function m3cl(x, a, b){ return Math.max(a, Math.min(b, x)); }
function m3rgb(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; }
function m3rgba(h, a){ var q = m3rgb(h); return "rgba(" + q[0] + "," + q[1] + "," + q[2] + "," + a + ")"; }
/* mélange vers le blanc (t > 0) ou le noir (t < 0) */
function m3mix(h, t){ var q = m3rgb(h), T = t > 0 ? 255 : 0, a = Math.abs(t); return "rgb(" + Math.round(q[0] + (T - q[0]) * a) + "," + Math.round(q[1] + (T - q[1]) * a) + "," + Math.round(q[2] + (T - q[2]) * a) + ")"; }
/* mélange de deux couleurs hexadécimales */
function m3lerp(h1, h2, t){ var a = m3rgb(h1), b = m3rgb(h2); return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," + Math.round(a[1] + (b[1] - a[1]) * t) + "," + Math.round(a[2] + (b[2] - a[2]) * t) + ")"; }
function m3rr(ctx, x, y, w, h, r){ r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
/* carte en relief (fond d'un panneau) */
function m3card(c, b, title, col){
  var ctx = c.ctx; ctx.save(); ctx.shadowColor = "rgba(15,27,45,.13)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 3;
  m3rr(ctx, b.x + 4, b.y + 4, b.w - 8, b.h - 8, 12); var g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#f3f6fa"); ctx.fillStyle = g; ctx.fill();
  ctx.shadowColor = "transparent"; ctx.strokeStyle = "#e1e6ed"; ctx.lineWidth = 1; ctx.stroke();
  if (title){ ctx.font = "800 10.5px " + M3FONT; ctx.fillStyle = col || "#5f6b7a"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(title, b.x + 14, b.y + 11); }
  ctx.restore();
}
/* étiquette en pastille, gardée dans la boîte bx (jamais coupée) ; renvoie son rectangle */
function m3pill(c, s, x, y, col, bx, o){
  o = o || {}; var ctx = c.ctx, size = o.size || 11.5; ctx.save(); ctx.font = (o.weight || 800) + " " + size + "px " + M3FONT;
  var w = ctx.measureText(s).width + 12, h = size + 9, al = o.align || "center";
  var x0 = al === "left" ? x : al === "right" ? x - w : x - w / 2, y0 = y - h / 2;
  if (bx){ x0 = m3cl(x0, bx.x + 6, bx.x + bx.w - 6 - w); y0 = m3cl(y0, bx.y + 6, bx.y + bx.h - 6 - h); }
  if (o.dry){ ctx.restore(); return {x:x0, y:y0, w:w, h:h}; }
  ctx.shadowColor = "rgba(15,27,45,.16)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 1.5;
  m3rr(ctx, x0, y0, w, h, h / 2); ctx.fillStyle = o.fill || "rgba(255,255,255,.96)"; ctx.fill(); ctx.shadowColor = "transparent";
  ctx.lineWidth = 1.2; ctx.strokeStyle = m3rgba(col, 0.55); ctx.stroke();
  ctx.fillStyle = o.tcol || col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x0 + w / 2, y0 + h / 2 + 0.5);
  ctx.restore(); return {x:x0, y:y0, w:w, h:h};
}
/* bille en volume (poignée), avec une lettre facultative */
function m3ball(c, x, y, r, col, txt, ring){
  if (!isFinite(x) || !isFinite(y)) return; var ctx = c.ctx; ctx.save();
  ctx.fillStyle = "rgba(15,27,45,.18)"; ctx.beginPath(); ctx.ellipse(x + r * 0.25, y + r * 0.9, r * 0.9, r * 0.32, 0, 0, 7); ctx.fill();
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.08, x, y, r); g.addColorStop(0, "#ffffff"); g.addColorStop(0.28, m3mix(col, 0.35)); g.addColorStop(1, m3mix(col, -0.25));
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = m3mix(col, -0.4); ctx.stroke();
  if (ring){ ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5; ctx.strokeStyle = m3rgba(col, 0.75); ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
  if (txt){ ctx.font = "800 " + Math.round(r * 1.15) + "px 'STIX Two Text', 'Cambria Math', serif"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, x, y + 0.5); }
  ctx.restore();
}
/* repère dans une boîte : o = {x0,x1,y0,y1, l,r,t,b, sx, sy, fx(v), fy(v), xl, yl} → {X,Y,ix,iy,L,R,T,B} */
function m3axes(c, b, o){
  var ctx = c.ctx, L = b.x + (o.l || 44), R = b.x + b.w - (o.r || 14), T = b.y + (o.t || 16), B = b.y + b.h - (o.b || 30);
  var ax = {L:L, R:R, T:T, B:B, x0:o.x0, x1:o.x1, y0:o.y0, y1:o.y1};
  ax.X = function(x){ return L + (x - o.x0) / (o.x1 - o.x0) * (R - L); }; ax.Y = function(y){ return B - (y - o.y0) / (o.y1 - o.y0) * (B - T); };
  ax.ix = function(px){ return o.x0 + (px - L) / (R - L) * (o.x1 - o.x0); }; ax.iy = function(py){ return o.y0 + (B - py) / (B - T) * (o.y1 - o.y0); };
  var xs = [], ys = [], v, n;
  for (n = Math.ceil(o.x0 / o.sx - 1e-9); n * o.sx <= o.x1 + 1e-9 && xs.length < 60; n++) xs.push(n * o.sx);
  for (n = Math.ceil(o.y0 / o.sy - 1e-9); n * o.sy <= o.y1 + 1e-9 && ys.length < 60; n++) ys.push(n * o.sy);
  ctx.save(); ctx.fillStyle = "#ffffff"; ctx.fillRect(L, T, R - L, B - T);
  ctx.lineWidth = 1; ctx.strokeStyle = "#edf0f4"; ctx.beginPath();
  xs.forEach(function(x){ var p = Math.round(ax.X(x)) + 0.5; ctx.moveTo(p, T); ctx.lineTo(p, B); });
  ys.forEach(function(y){ var p = Math.round(ax.Y(y)) + 0.5; ctx.moveTo(L, p); ctx.lineTo(R, p); }); ctx.stroke();
  var y0p = (o.y0 <= 0 && o.y1 >= 0 && !o.frame) ? ax.Y(0) : B, x0p = (o.x0 <= 0 && o.x1 >= 0 && !o.frame) ? ax.X(0) : L;
  ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(L, y0p); ctx.lineTo(R, y0p); ctx.moveTo(x0p, T); ctx.lineTo(x0p, B); ctx.stroke();
  ctx.strokeStyle = "#d5dbe3"; ctx.lineWidth = 1; ctx.strokeRect(L + 0.5, T + 0.5, R - L - 1, B - T - 1);
  ctx.font = "600 10.5px " + M3FONT; ctx.fillStyle = "#6b7684"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  var lastx = -1e9; xs.forEach(function(x){ var s = o.fx ? o.fx(x) : F(x, 2), px = ax.X(x), w = ctx.measureText(s).width; if (s === "" || px - w / 2 < lastx + 6) return; if (Math.abs(x) < 1e-9 && !o.frame && x0p > L + 4){ ctx.textAlign = "right"; ctx.fillText(s, px - 4, B + 4); ctx.textAlign = "center"; lastx = px; return; } ctx.fillText(s, px, B + 4); lastx = px + w / 2; });
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  ys.forEach(function(y){ if (Math.abs(y) < 1e-9 && !o.frame && x0p > L + 4) return; var s = o.fy ? o.fy(y) : F(y, 2); if (s !== "") ctx.fillText(s, L - 5, ax.Y(y)); });
  ctx.font = "700 11.5px 'STIX Two Text', 'Cambria Math', serif"; ctx.fillStyle = "#2c3a4e";
  if (o.xl){ ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xl, R - 5, y0p - 4); }
  if (o.yl){ ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yl, x0p + 6, T + 4); }
  ctx.restore(); ax.y0p = y0p; ax.x0p = x0p; return ax;
}
function m3clip(c, ax){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); }
/* hauteur du canevas selon la largeur du cadre (jamais nulle : la largeur vaut au moins 260 px) */
function m3ratio(c, wide, mid, tall){ var r0 = c.resize; c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w >= 700 ? wide : w >= 470 ? mid : tall; r0(); }; c.resize(); }
function m3show(el, on){ if (el) el.style.display = on ? "" : "none"; }
function m3note(nt){ var last = null; return function(h, k){ var key = h + "|" + (k || ""); if (key !== last){ last = key; nt.set(h, k); } }; }

/* =====================================================================================
   1. Injective, surjective, bijective : la droite horizontale
   ===================================================================================== */
var M3F = {
  sq:   {n:"x²", f:function(x){ return x * x; }, tp:[0], sn:[0], v:[-2.6, 2.6, -1.6, 4.8], st:[1, 1], A:[-2, 2], B:[-1, 4]},
  cube: {n:"x³", f:function(x){ return x * x * x; }, tp:[], sn:[0], v:[-1.9, 1.9, -4.6, 4.6], st:[0.5, 1], A:[-1.5, 1.5], B:[-4, 4]},
  cub3: {n:"x³ − 3x", f:function(x){ return x * x * x - 3 * x; }, tp:[-1, 1], sn:[0, -1, 1], v:[-2.5, 2.5, -3.3, 3.6], st:[1, 1], A:[-2, 2], B:[-2, 2]},
  sin:  {n:"sin x", f:Math.sin, tp:[-1.5 * PI, -PI / 2, PI / 2, 1.5 * PI], sn:[0, -PI / 2, PI / 2, -PI, PI], v:[-4, 4, -1.7, 1.9], st:[1, 0.5], A:[-3, 3], B:[-1.5, 1.5]},
  exp:  {n:"eˣ", f:Math.exp, tp:[], sn:[0], v:[-3, 1.75, -1.4, 5.6], st:[1, 1], A:[-2.5, 1.5], B:[-1, 5]}
};
/* nombre lisible : π/2, π, 3π/2 reconnus */
function m3v(x){
  var q = [[PI / 2, "π/2"], [PI, "π"], [1.5 * PI, "3π/2"]];
  for (var i = 0; i < q.length; i++){ if (Math.abs(x - q[i][0]) < 1e-9) return q[i][1]; if (Math.abs(x + q[i][0]) < 1e-9) return "−" + q[i][1]; }
  return F(x, 3);
}
function m3iv(a, b){ return "[" + m3v(a) + " ; " + m3v(b) + "]"; }
/* image f([a ; b]) = [min ; max] : exacte (bornes et points où le sens de variation change) */
function m3im(T, a, b){ var xs = [a, b]; T.tp.forEach(function(t){ if (t > a && t < b) xs.push(t); }); var m = Infinity, M = -Infinity; xs.forEach(function(x){ var y = T.f(x); m = Math.min(m, y); M = Math.max(M, y); }); return [m, M]; }
function m3pieces(T, a, b){ var br = [a]; T.tp.forEach(function(t){ if (t > a + 1e-9 && t < b - 1e-9) br.push(t); }); br.push(b); return br; }
/* antécédents de y dans [a ; b] : une racine au plus par morceau monotone (dichotomie) */
function m3roots(T, a, b, y){
  var br = m3pieces(T, a, b), r = [];
  function add(x){ if (!r.length || Math.abs(r[r.length - 1] - x) > 1e-7) r.push(x); }
  for (var i = 0; i < br.length - 1; i++){
    var p = br[i], q = br[i + 1], fp = T.f(p) - y, fq = T.f(q) - y;
    if (Math.abs(fp) < 1e-12){ add(p); continue; }
    if (Math.abs(fq) < 1e-12) continue;
    if (fp * fq < 0){ for (var j = 0; j < 60; j++){ var m = (p + q) / 2, fm = T.f(m) - y; if (fp * fm <= 0){ q = m; } else { p = m; fp = fm; } } add((p + q) / 2); }
  }
  if (Math.abs(T.f(b) - y) < 1e-12) add(b);
  return r;
}

SFA.sim({
  id: "ma-injective-surjective", ch: "c01", tag: "Injective, surjective, bijective",
  titre: "Injective, surjective, bijective : la droite horizontale",
  resume: "Une droite horizontale balaie le graphe : ses antécédents s'allument et se comptent, à côté du diagramme en flèches de f : A → B. Rogne l'ensemble de départ A et l'ensemble d'arrivée B à la souris jusqu'à rendre f bijective.",
  but: "Regarde la droite y = y₀ monter et descendre : chaque point où elle coupe le graphe est un antécédent de y₀. Glisse les billes a, b (départ A) et c, d (arrivée B), ou attrape la droite. Objectif : exactement un antécédent pour chaque y₀ de B.",
  aRetenir: "f : A → B est injective si chaque y de B a au plus un antécédent (toute horizontale coupe le graphe au plus une fois), surjective si chaque y de B en a au moins un (B = f(A)), bijective si chaque y de B en a exactement un. Restreindre A enlève les antécédents en trop ; corestreindre B à f(A) enlève les éléments non atteints. Seule une bijection a une réciproque f⁻¹ : B → A.",
  piege: "La surjectivité ne dépend pas de la formule seule mais du couple (f, B) : eˣ n'est pas surjective de ℝ dans ℝ, elle l'est de ℝ dans ]0 ; +∞[. Et on ne peut pas rétrécir B en dessous de f(A) : si une image sort de B, f n'est même plus une fonction de A dans B.",
  build: function(k, S){
    var c = k.canvas(0, {ratio:1.1}); m3ratio(c, 0.62, 1.12, 1.4);
    var st = {a:0, b:0, c:0, d:0, y0:1, ph:0.6, flow:0}, T = M3F.sq, G = null, grab = null, nset;
    var fs = k.select("Fonction", [["sq", "f(x) = x²"], ["cube", "f(x) = x³"], ["cub3", "f(x) = x³ − 3x"], ["sin", "f(x) = sin x"], ["exp", "f(x) = eˣ"]], "sq", function(){ reset(); });
    var auto = k.toggle("Balayage automatique de la droite y = y₀", true);
    function reset(){ T = M3F[fs.value]; st.a = T.A[0]; st.b = T.A[1]; st.c = T.B[0]; st.d = T.B[1]; }
    k.button("Restreindre A (garder un morceau monotone)", function(){
      var br = m3pieces(T, st.a, st.b), best = 0, bl = -1;
      for (var i = 0; i < br.length - 1; i++){ var L = br[i + 1] - br[i]; if (L >= bl - 1e-9){ bl = L; best = i; } }
      st.a = br[best]; st.b = br[best + 1];
    }, true);
    k.button("Corestreindre : B = f(A)", function(){ var im = m3im(T, st.a, st.b); st.c = im[0]; st.d = im[1]; });
    k.button("Réinitialiser", reset);
    var ro = k.readouts(["A (départ)", "B (arrivée)", "f(A) (image)", "Injective ?", "Surjective ?", "Bijective ?"]);
    nset = m3note(k.note("", ""));
    reset(); c.cv._m3 = st;
    function geom(){
      var W = c.W, H = c.H, g, d;
      if (W >= 700){ var w1 = Math.round(W * 0.6); g = {x:0, y:0, w:w1, h:H}; d = {x:w1, y:0, w:W - w1, h:H}; }
      else { var h1 = Math.round(H * 0.58); g = {x:0, y:0, w:W, h:h1}; d = {x:0, y:h1, w:W, h:H - h1}; }
      return {g:g, d:d};
    }
    function minGap(ax, horiz){ var pxu = horiz ? (ax.R - ax.L) / (T.v[1] - T.v[0]) : (ax.B - ax.T) / (T.v[3] - T.v[2]); return Math.max(0.2, 24 / pxu); }
    function snapX(ax, x){ var best = null, bd = 9; T.sn.concat(T.tp).forEach(function(s){ var dd = Math.abs(ax.X(s) - ax.X(x)); if (dd < bd){ bd = dd; best = s; } }); return best !== null ? best : Math.round(x * 10) / 10; }
    function snapY(ax, y){ var im = m3im(T, st.a, st.b), best = null, bd = 9; [im[0], im[1], 0].forEach(function(s){ var dd = Math.abs(ax.Y(s) - ax.Y(y)); if (dd < bd){ bd = dd; best = s; } }); return best !== null ? best : Math.round(y * 10) / 10; }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return; var ax = G.ax;
      if (t === "down"){
        grab = null; var hs = [["a", ax.X(st.a), G.yr], ["b", ax.X(st.b), G.yr], ["c", G.xr, ax.Y(st.c)], ["d", G.xr, ax.Y(st.d)]], bd = 17;
        hs.forEach(function(h){ var dd = Math.hypot(h[1] - p.x, h[2] - p.y); if (dd < bd){ bd = dd; grab = h[0]; } });
        if (!grab && G.yb && Math.hypot(G.yb[0] - p.x, G.yb[1] - p.y) < 18) grab = "yb";
        if (!grab && p.x >= ax.L && p.x <= ax.R && p.y >= ax.T && p.y <= ax.B){ grab = "y"; st.y0 = m3cl(ax.iy(p.y), T.v[2], T.v[3]); }
        if (grab === "y" || grab === "yb") auto.set(false);
        if (grab) c.cv.style.cursor = "grabbing";
      } else if (t === "drag" && grab){
        var gx = minGap(ax, true), gy = minGap(ax, false);
        if (grab === "a") st.a = m3cl(snapX(ax, ax.ix(p.x)), T.v[0], st.b - gx);
        else if (grab === "b") st.b = m3cl(snapX(ax, ax.ix(p.x)), st.a + gx, T.v[1]);
        else if (grab === "c") st.c = m3cl(snapY(ax, ax.iy(p.y)), T.v[2], st.d - gy);
        else if (grab === "d") st.d = m3cl(snapY(ax, ax.iy(p.y)), st.c + gy, T.v[3]);
        else if (grab === "y") st.y0 = m3cl(ax.iy(p.y), T.v[2], T.v[3]);
        else if (grab === "yb") st.y0 = m3cl(G.ibY(p.y), T.v[2], T.v[3]);
        k.redraw();
      } else if (t === "up"){ grab = null; c.cv.style.cursor = "default"; }
      else if (t === "move"){
        var near = Math.min(Math.hypot(ax.X(st.a) - p.x, G.yr - p.y), Math.hypot(ax.X(st.b) - p.x, G.yr - p.y), Math.hypot(G.xr - p.x, ax.Y(st.c) - p.y), Math.hypot(G.xr - p.x, ax.Y(st.d) - p.y));
        c.cv.style.cursor = near < 17 || (p.x >= ax.L && p.x <= ax.R && Math.abs(p.y - ax.Y(st.y0)) < 12) ? "grab" : "default";
      }
    });
    var lp = k.loop(function(dt){
      st.flow += dt;
      if (auto.value){ st.ph += dt * 0.55; var lo = T.v[2] + 0.12, hi = T.v[3] - 0.12; st.y0 = (lo + hi) / 2 + (hi - lo) / 2 * Math.sin(st.ph); }
      k.redraw();
    }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, L = geom(), gb = L.g, db = L.d, v = T.v, a = st.a, b = st.b, cc = st.c, dd = st.d, y0 = st.y0;
      var im = m3im(T, a, b), inB = im[0] >= cc - 1e-9 && im[1] <= dd + 1e-9, inj = m3pieces(T, a, b).length === 2;
      var sur = inB && im[0] <= cc + 1e-9 && im[1] >= dd - 1e-9, roots = m3roots(T, a, b, y0), yIn = y0 >= cc - 1e-9 && y0 <= dd + 1e-9;
      st.roots = roots;
      /* ---------- graphe ---------- */
      m3card(c, gb, "GRAPHE DE f(x) = " + T.n, M3C.blue);
      var ax = m3axes(c, gb, {x0:v[0], x1:v[1], y0:v[2], y1:v[3], sx:T.st[0], sy:T.st[1], l:64, r:30, t:42, b:52, xl:"x", yl:"y"});
      var xr = gb.x + 20, yr = ax.B + 34; G = {ax:ax, xr:xr, yr:yr, yb:null, ibY:null};
      st.hd = [[ax.X(a), yr], [ax.X(b), yr], [xr, ax.Y(cc)], [xr, ax.Y(dd)]];
      m3clip(c, ax);
      ctx.fillStyle = m3rgba(M3C.amber, 0.075); ctx.fillRect(ax.X(a), ax.T, ax.X(b) - ax.X(a), ax.B - ax.T);
      ctx.fillStyle = m3rgba(M3C.violet, 0.075); ctx.fillRect(ax.L, ax.Y(dd), ax.R - ax.L, ax.Y(cc) - ax.Y(dd));
      ctx.setLineDash([6, 4]); ctx.lineWidth = 1.4; ctx.strokeStyle = m3rgba(M3C.ink, 0.45); ctx.strokeRect(ax.X(a), ax.Y(dd), ax.X(b) - ax.X(a), ax.Y(cc) - ax.Y(dd)); ctx.setLineDash([]);
      /* courbe hors de A (grise) puis sur A (bleue dans B, rouge hors de B) */
      function path(x0, x1, n){ ctx.beginPath(); for (var i = 0; i <= n; i++){ var x = x0 + (x1 - x0) * i / n, y = m3cl(T.f(x), v[2] - 5, v[3] + 5); if (i) ctx.lineTo(ax.X(x), ax.Y(y)); else ctx.moveTo(ax.X(x), ax.Y(y)); } }
      ctx.strokeStyle = "#b9c1cc"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); path(v[0], a, 120); ctx.stroke(); path(b, v[1], 120); ctx.stroke(); ctx.setLineDash([]);
      var n = 360, seg = [], cur = null;
      for (var i = 0; i <= n; i++){ var x = a + (b - a) * i / n, y = T.f(x), ok = y >= cc - 1e-9 && y <= dd + 1e-9; if (!cur || cur.ok !== ok){ if (cur) cur.p.push([x, y]); cur = {ok:ok, p:[]}; seg.push(cur); } cur.p.push([x, y]); }
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      seg.forEach(function(s){ ctx.save(); ctx.shadowColor = "rgba(15,27,45,.22)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; ctx.strokeStyle = s.ok ? M3C.blue : M3C.red; ctx.lineWidth = 3.6; ctx.beginPath();
        s.p.forEach(function(q, j){ var Y = ax.Y(m3cl(q[1], v[2] - 5, v[3] + 5)); if (j) ctx.lineTo(ax.X(q[0]), Y); else ctx.moveTo(ax.X(q[0]), Y); }); ctx.stroke(); ctx.restore(); });
      /* droite horizontale y = y₀ */
      var Y0 = ax.Y(y0), lc = yIn ? M3C.gold : "#9aa4b1";
      ctx.save(); if (yIn){ ctx.shadowColor = m3rgba(M3C.gold, 0.7); ctx.shadowBlur = 10; } ctx.strokeStyle = lc; ctx.lineWidth = yIn ? 2.6 : 2; if (!yIn) ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(ax.L, Y0); ctx.lineTo(ax.R, Y0); ctx.stroke(); ctx.restore();
      roots.forEach(function(r){ var X = ax.X(r); D.line(c, X, Y0, X, ax.y0p, m3rgba(M3C.gold, 0.8), 1.5, [3, 3]); D.glow(c, X, Y0, 22, M3C.gold, 0.45); m3ball(c, X, Y0, 6.5, M3C.gold); D.dot(c, X, ax.y0p, 4, M3C.gold); });
      ctx.restore();
      var nr = roots.length, lab = "y₀ = " + F(y0, 2) + (yIn ? " · " + (nr === 0 ? "aucun antécédent" : nr === 1 ? "1 antécédent" : nr + " antécédents") : " · hors de B");
      m3pill(c, lab, gb.x + gb.w - 12, gb.y + 18, yIn ? (nr === 1 ? M3C.green : nr === 0 ? "#6b7684" : M3C.red) : "#6b7684", gb, {align:"right", size:c.W < 470 ? 10 : 11});
      /* bande : nombre d'antécédents pour chaque hauteur */
      var sx0 = ax.R + 8, sw = 10;
      for (var py = ax.T; py < ax.B; py += 2){ var yy = ax.iy(py + 1), cnt = m3roots(T, a, b, yy).length, inside = yy >= cc && yy <= dd;
        var col = cnt === 0 ? "#c3c9d2" : cnt === 1 ? M3C.green : M3C.red; ctx.fillStyle = inside ? col : m3rgba(cnt === 0 ? "#c3c9d2" : cnt === 1 ? M3C.green : M3C.red, 0.22); ctx.fillRect(sx0, py, sw, 2.2); }
      ctx.strokeStyle = "#c9d0da"; ctx.lineWidth = 1; ctx.strokeRect(sx0 + 0.5, ax.T + 0.5, sw - 1, ax.B - ax.T - 1);
      ctx.fillStyle = M3C.ink; ctx.beginPath(); ctx.moveTo(sx0 - 1, Y0); ctx.lineTo(sx0 - 7, Y0 - 5); ctx.lineTo(sx0 - 7, Y0 + 5); ctx.closePath(); ctx.fill();
      /* règles A (horizontale) et B (verticale) avec leurs billes */
      function rail(x1, y1, x2, y2, col, lo, hi){ ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        var g = x1 === x2 ? ctx.createLinearGradient(x1 - 5, 0, x1 + 5, 0) : ctx.createLinearGradient(0, y1 - 5, 0, y1 + 5); g.addColorStop(0, m3mix(col, 0.4)); g.addColorStop(1, m3mix(col, -0.15));
        ctx.strokeStyle = g; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(lo[0], lo[1]); ctx.lineTo(hi[0], hi[1]); ctx.stroke(); ctx.restore(); }
      rail(ax.L, yr, ax.R, yr, M3C.amber, [ax.X(a), yr], [ax.X(b), yr]);
      rail(xr, ax.B, xr, ax.T, M3C.violet, [xr, ax.Y(cc)], [xr, ax.Y(dd)]);
      D.text(c, "A", ax.L - 16, yr, {size:13, color:M3C.amber, math:true, weight:700});
      D.text(c, "B", xr + 16, ax.T - 11, {size:13, color:M3C.violet, math:true, weight:700});
      m3ball(c, ax.X(a), yr, 9, M3C.amber, "a", grab === "a"); m3ball(c, ax.X(b), yr, 9, M3C.amber, "b", grab === "b");
      m3ball(c, xr, ax.Y(cc), 9, M3C.violet, "c", grab === "c"); m3ball(c, xr, ax.Y(dd), 9, M3C.violet, "d", grab === "d");
      /* ---------- diagramme en flèches ---------- */
      m3card(c, db, "DIAGRAMME EN FLÈCHES  f : A → B", M3C.ink);
      var top = db.y + 50, bot = db.y + db.h - 40, ry = Math.max(30, (bot - top) / 2), cy = (top + bot) / 2, rx = Math.max(28, Math.min(db.w * 0.13, 64, ry * 0.62));
      var XA = db.x + db.w * 0.27, XB = db.x + db.w * 0.73, pad = Math.min(16, ry * 0.25), iT = cy - ry + pad, iB = cy + ry - pad;
      function pA(x){ return iB - (x - a) / (b - a) * (iB - iT); }
      function pB(y){ return iB - (y - cc) / (dd - cc) * (iB - iT); }
      G.ibY = function(py){ return cc + (iB - py) / (iB - iT) * (dd - cc); };
      function potato(X, col, name, iv){ ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
        var g = ctx.createRadialGradient(X - rx * 0.35, cy - ry * 0.4, 4, X, cy, Math.max(rx, ry)); g.addColorStop(0, "#ffffff"); g.addColorStop(1, m3mix(col, 0.78));
        ctx.beginPath(); ctx.ellipse(X, cy, rx, ry, 0, 0, 7); ctx.fillStyle = g; ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 2; ctx.strokeStyle = m3rgba(col, 0.7); ctx.stroke(); ctx.restore();
        D.text(c, name + " = " + iv, X, cy - ry - 11, {size:11.5, color:col, weight:800}); }
      potato(XA, M3C.amber, "A", m3iv(a, b)); potato(XB, M3C.violet, "B", m3iv(cc, dd));
      /* éléments de B non atteints : hachures */
      var nat = []; ctx.save(); ctx.beginPath(); ctx.ellipse(XB, cy, rx - 1, ry - 1, 0, 0, 7); ctx.clip();
      [[cc, Math.min(im[0], dd)], [Math.max(im[1], cc), dd]].forEach(function(q){ if (q[1] - q[0] < 1e-9) return; var y1 = q[0] <= cc + 1e-9 ? cy + ry : pB(q[0]), y2 = q[1] >= dd - 1e-9 ? cy - ry : pB(q[1]);
        ctx.fillStyle = "rgba(195,201,210,.55)"; ctx.fillRect(XB - rx, y2, 2 * rx, y1 - y2); ctx.strokeStyle = "rgba(110,120,135,.45)"; ctx.lineWidth = 1; ctx.beginPath();
        for (var hx = -2 * rx; hx < 2 * rx + (y1 - y2); hx += 7){ ctx.moveTo(XB - rx + hx, y2); ctx.lineTo(XB - rx + hx - (y1 - y2), y1); } ctx.stroke();
        if (y1 - y2 > 16) nat.push((y1 + y2) / 2); });
      /* position de la bille y₀ (calculée ici pour écarter l'étiquette « non atteint ») */
      var yb = m3cl(pB(y0), db.y + 58, db.y + db.h - 30);
      ctx.restore(); nat.forEach(function(yy){ if (Math.abs(yy - yb) < 16) yy = m3cl(yy + (yy <= yb ? -18 : 18), cy - ry + 8, cy + ry - 8); D.text(c, "non atteint", XB, yy, {size:10, color:"#4b5563", weight:800, halo:"rgba(255,255,255,.92)"}); });
      function bez(x1, y1, x2, y2, col, w, dash, off){ var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.min(26, Math.abs(x2 - x1) * 0.16); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; if (dash){ ctx.setLineDash(dash); ctx.lineDashOffset = off || 0; }
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke(); ctx.restore();
        var tx = x2 - mx, ty = y2 - my, tl = Math.hypot(tx, ty) || 1; D.arrow(c, x2 - tx / tl * 9, y2 - ty / tl * 9, x2, y2, col, w); }
      var ns = c.W < 470 ? 5 : 7, outX = XB + rx + 14;
      for (i = 0; i < ns; i++){ var xa = a + (b - a) * i / (ns - 1), ya = T.f(xa), ok = ya >= cc - 1e-9 && ya <= dd + 1e-9, qy = m3cl(pB(ya), db.y + 58, db.y + db.h - 30), qx = ok ? XB - 4 : outX;
        bez(XA + 7, pA(xa), qx - 6, qy, ok ? m3rgba(M3C.blue, 0.55) : m3rgba(M3C.red, 0.75), 1.6);
        m3ball(c, XA, pA(xa), 5, M3C.blue); m3ball(c, qx, qy, 4.5, ok ? M3C.blue : M3C.red); }
      var outLab = false; for (i = 0; i < ns; i++){ ya = T.f(a + (b - a) * i / (ns - 1)); if (ya < cc - 1e-9 || ya > dd + 1e-9) outLab = true; }
      if (outLab) m3pill(c, "∉ B", outX + 9, cy, M3C.red, db, {align:"left", size:10.5});
      /* y₀ et ses antécédents (flèches dorées qui coulent) */
      /* f pas injective : une paire x₁ ≠ x₂ de même image, en rouge */
      var pair = null;
      if (inB && !inj){ var pc = m3pieces(T, a, b), ext = T.f(pc[1]), v0 = T.f(pc[0]), v2 = T.f(pc[2]), nv = Math.abs(v0 - ext) < Math.abs(v2 - ext) ? v0 : v2;
        if (Math.abs(nv - ext) > 1e-6){ var ys = ext + 0.6 * (nv - ext), yr1 = Math.round(ys * 10) / 10; if ((yr1 - ext) * (nv - yr1) > 0) ys = yr1; var rr = m3roots(T, pc[0], pc[2], ys); if (rr.length >= 2) pair = {y:ys, x1:rr[0], x2:rr[1]}; } }
      st.pair = pair;
      if (pair){ var pyy = m3cl(pB(pair.y), db.y + 58, db.y + db.h - 30);
        [pair.x1, pair.x2].forEach(function(xp, j){ var pa = pA(xp); bez(XA + 8, pa, XB - 9, pyy, m3rgba(M3C.red, 0.95), 2.4);
          m3ball(c, XA, pa, 6.5, M3C.red); D.text(c, j ? "x₂" : "x₁", XA - 15, pa, {size:11.5, color:M3C.red, math:true, weight:700, halo:"rgba(255,255,255,.9)"}); });
        m3ball(c, XB, pyy, 6, M3C.red, "", true); }
      var ybx = yIn ? XB + 6 : outX; G.yb = [ybx, yb];
      roots.forEach(function(r, j){ var pa = pA(r); bez(XA + 8, pa, ybx - 9, yb, yIn ? M3C.gold : m3rgba(M3C.gold, 0.45), 2.6, [8, 6], -st.flow * 30); m3ball(c, XA, pa, 7, M3C.gold, ""); });
      D.glow(c, ybx, yb, 18, M3C.gold, yIn ? 0.5 : 0.2); m3ball(c, ybx, yb, 8, yIn ? M3C.gold : "#b5bcc6", "", grab === "yb");
      m3pill(c, "y₀", ybx + 14, yb, yIn ? M3C.gold : "#6b7684", db, {align:"left", size:10.5, tcol:M3C.ink});
      /* légende de la bande */
      var ly = db.y + db.h - 18, lx = db.x + 16; ctx.save(); ctx.font = "700 10.5px " + M3FONT; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillStyle = "#4b5563";
      var items = [["Antécédents (bande du graphe) :", null], ["0", "#c3c9d2"], ["1", M3C.green], ["2 ou plus", M3C.red]];
      if (c.W < 470) items[0][0] = "Antécédents :";
      items.forEach(function(it){ if (it[1]){ ctx.fillStyle = it[1]; m3rr(ctx, lx, ly - 5, 12, 10, 3); ctx.fill(); lx += 16; ctx.fillStyle = "#4b5563"; } ctx.fillText(it[0], lx, ly); lx += ctx.measureText(it[0]).width + 10; });
      ctx.restore();
      /* ---------- afficheurs et verdict ---------- */
      ro.set(0, m3iv(a, b)); ro.set(1, m3iv(cc, dd)); ro.set(2, m3iv(im[0], im[1]));
      ro.set(3, !inB ? "—" : inj ? "oui" : "non"); ro.set(4, !inB ? "—" : sur ? "oui" : "non"); ro.set(5, !inB ? "—" : inj && sur ? "oui" : "non");
      var inv = "";
      if (inj && sur){
        if (fs.value === "sq") inv = a >= -1e-9 ? " Ici f⁻¹(y) = √y." : b <= 1e-9 ? " Ici f⁻¹(y) = −√y." : "";
        else if (fs.value === "sin") inv = (a >= -PI / 2 - 1e-9 && b <= PI / 2 + 1e-9) ? " Ici f⁻¹ = arcsin." : "";
        else if (fs.value === "exp") inv = " Ici f⁻¹ = ln.";
        else if (fs.value === "cube") inv = " Ici f⁻¹(y) = ∛y.";
      }
      if (!inB) nset("Une partie du graphe (en rouge) sort de la bande B : des x de A ont leur image hors de B. f n'est donc pas une fonction de A dans B. Élargis B (billes c, d) ou rétrécis A.", "warn");
      else if (inj && sur) nset("<b>Bijective.</b> Chaque y₀ de B a exactement un antécédent : la bande du graphe est verte sur tout B. f : A → B est réversible, sa réciproque f⁻¹ : B → A existe." + inv, "ok");
      else nset((inj ? "<b>Injective</b> : aucune horizontale ne coupe deux fois. " : "<b>Pas injective</b> : des horizontales coupent " + (fs.value === "sin" || fs.value === "cub3" ? "plusieurs" : "deux") + " fois (rouge dans la bande). " + (pair ? "Exemple : x₁ = " + m3v(pair.x1) + " et x₂ = " + m3v(pair.x2) + " ont la même image " + m3v(pair.y) + " (flèches rouges). " : "") + "Restreins A à un morceau où f est strictement monotone. ") +
        (sur ? "<b>Surjective</b> : tout y de B est atteint (B = f(A))." : "<b>Pas surjective</b> : les y de B hors de f(A) = " + m3iv(im[0], im[1]) + " n'ont aucun antécédent (gris). Corestreins B à f(A)."), "");
    });
  }
});

/* =====================================================================================
   2. Le moine qui monte et descend : un point fixe garanti
   ===================================================================================== */
/* interpolation d'Hermite monotone par morceaux (pentes : moyenne harmonique, 0 si changement de sens) */
function m3pchip(xs, ys){
  var n = xs.length, h = [], dl = [], m = [], i;
  for (i = 0; i < n - 1; i++){ h.push(xs[i + 1] - xs[i]); dl.push((ys[i + 1] - ys[i]) / h[i]); }
  m[0] = dl[0]; m[n - 1] = dl[n - 2];
  for (i = 1; i < n - 1; i++) m[i] = dl[i - 1] * dl[i] <= 0 ? 0 : 2 / (1 / dl[i - 1] + 1 / dl[i]);
  return function(x){ var j = 0; while (j < n - 2 && x > xs[j + 1]) j++; var t = m3cl((x - xs[j]) / h[j], 0, 1), t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[j] + (t3 - 2 * t2 + t) * h[j] * m[j] + (-2 * t3 + 3 * t2) * ys[j + 1] + (t3 - t2) * h[j] * m[j + 1]; };
}
/* sentier : points de passage dans un repère « monde » (x vers la droite, z = hauteur), Catmull-Rom puis abscisse curviligne */
var M3PATH = [[1.0, 0.35], [3.3, 0.85], [1.9, 1.55], [4.6, 2.2], [3.6, 2.95], [6.0, 3.6], [5.3, 4.35], [7.0, 4.85], [7.7, 5.35]];
var M3TRAIL = (function(){
  var P = M3PATH, pts = [], i, j, n = P.length;
  for (i = 0; i < n - 1; i++){ var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n - 1, i + 2)];
    for (j = 0; j < 30; j++){ var t = j / 30, t2 = t * t, t3 = t2 * t;
      pts.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); } }
  pts.push(P[n - 1].slice());
  var s = [0]; for (i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return {pts:pts, s:s, L:s[s.length - 1]};
})();
var M3KM = 6, M3ALT0 = 400, M3ALT1 = 2000;
/* point du sentier à la distance d (km) depuis le village : [x, z, sens] */
function m3at(d){
  var u = m3cl(d / M3KM, 0, 1) * M3TRAIL.L, s = M3TRAIL.s, p = M3TRAIL.pts, lo = 0, hi = s.length - 1;
  while (hi - lo > 1){ var mid = (lo + hi) >> 1; if (s[mid] <= u) lo = mid; else hi = mid; }
  var t = (u - s[lo]) / ((s[hi] - s[lo]) || 1); return [p[lo][0] + (p[hi][0] - p[lo][0]) * t, p[lo][1] + (p[hi][1] - p[lo][1]) * t, p[hi][0] >= p[lo][0] ? 1 : -1];
}
function m3alt(d){ var z = m3at(d)[1], z0 = M3PATH[0][1], z1 = M3PATH[M3PATH.length - 1][1]; return M3ALT0 + (z - z0) / (z1 - z0) * (M3ALT1 - M3ALT0); }
function m3hm(h){ var H = Math.floor(h + 1e-9), mn = Math.round((h - H) * 60); if (mn === 60){ H++; mn = 0; } return H + "\u00a0h\u00a0" + (mn < 10 ? "0" : "") + mn; }
/* zéros d'une fonction continue sur [a ; b] (changements de signe + dichotomie, vérifiés).
   Renvoie des intervalles {a, b} : a = b pour un zéro isolé ; des zéros consécutifs de la grille forment un intervalle [a ; b]. */
function m3zeros(g, a, b, n){
  var r = [], x0 = a, g0 = g(a), z0 = Math.abs(g0) < 1e-12, i;
  function add(x, cont){ var L = r[r.length - 1]; if (L && (cont || x - L.b < 1e-6)){ L.b = Math.max(L.b, x); return; } r.push({a:x, b:x}); }
  if (z0) add(a, false);
  for (i = 1; i <= n; i++){ var x1 = a + (b - a) * i / n, g1 = g(x1), z1 = Math.abs(g1) < 1e-12;
    if (z1) add(x1, z0);
    else if (!z0 && g0 * g1 < 0){ var p = x0, q = x1, gp = g0; for (var j = 0; j < 60; j++){ var m = (p + q) / 2, gm = g(m); if (gp * gm <= 0) q = m; else { p = m; gp = gm; } } var z = (p + q) / 2; if (Math.abs(g(z)) < 1e-6) add(z, false); }
    x0 = x1; g0 = g1; z0 = z1; }
  return r;
}
function m3isIv(z){ return z.b - z.a > 1e-6; }
/* « 8 h 00 » ou « de 10 h 00 à 12 h 00 » */
function m3hmZ(z){ return m3isIv(z) ? "de " + m3hm(z.a) + " à " + m3hm(z.b) : m3hm(z.a); }
/* le moine : x, y = pieds ; u = taille en px ; face = ±1 ; ph = phase de marche */
function m3monk(c, x, y, u, robe, face, ph, walk){
  var ctx = c.ctx, sw = walk ? Math.sin(ph) * 0.42 : 0, bob = walk ? Math.abs(Math.sin(ph)) * u * 0.03 : 0;
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(20,30,20,.25)"; ctx.beginPath(); ctx.ellipse(0, 0, u * 0.26, u * 0.06, 0, 0, 7); ctx.fill();
  ctx.translate(0, -bob); ctx.scale(face, 1); ctx.lineCap = "round"; ctx.lineJoin = "round";
  /* jambes */
  ctx.strokeStyle = "#7a4b2a"; ctx.lineWidth = u * 0.07;
  [[sw, 1], [-sw, 0.75]].forEach(function(q){ ctx.globalAlpha = q[1]; ctx.beginPath(); ctx.moveTo(0, -u * 0.3); ctx.lineTo(Math.sin(q[0]) * u * 0.3, -u * 0.02); ctx.stroke(); });
  ctx.globalAlpha = 1;
  /* bâton */
  ctx.strokeStyle = "#5a3a1e"; ctx.lineWidth = u * 0.045; ctx.beginPath(); ctx.moveTo(u * 0.3 + sw * u * 0.05, -u * 0.86); ctx.lineTo(u * 0.36 - sw * u * 0.08, 0); ctx.stroke();
  /* robe */
  var g = ctx.createLinearGradient(-u * 0.25, 0, u * 0.25, 0); g.addColorStop(0, m3mix(robe, 0.25)); g.addColorStop(0.55, robe); g.addColorStop(1, m3mix(robe, -0.35));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-u * 0.13, -u * 0.74); ctx.quadraticCurveTo(-u * 0.24, -u * 0.45, -u * 0.25, -u * 0.18); ctx.lineTo(u * 0.22, -u * 0.18); ctx.quadraticCurveTo(u * 0.2, -u * 0.5, u * 0.13, -u * 0.74); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = m3mix(robe, -0.45); ctx.lineWidth = 1; ctx.stroke();
  /* écharpe en diagonale */
  ctx.strokeStyle = m3mix(robe, -0.3); ctx.lineWidth = u * 0.05; ctx.beginPath(); ctx.moveTo(-u * 0.12, -u * 0.72); ctx.lineTo(u * 0.17, -u * 0.36); ctx.stroke();
  /* bras vers le bâton */
  ctx.strokeStyle = m3mix(robe, -0.15); ctx.lineWidth = u * 0.085; ctx.beginPath(); ctx.moveTo(u * 0.04, -u * 0.68); ctx.lineTo(u * 0.3, -u * 0.56); ctx.stroke();
  ctx.fillStyle = "#e0b48a"; ctx.beginPath(); ctx.arc(u * 0.31, -u * 0.56, u * 0.045, 0, 7); ctx.fill();
  /* baluchon */
  var gb = ctx.createRadialGradient(-u * 0.22, -u * 0.62, 1, -u * 0.2, -u * 0.58, u * 0.13); gb.addColorStop(0, "#e9dcc0"); gb.addColorStop(1, "#a48a5c");
  ctx.fillStyle = gb; ctx.beginPath(); ctx.ellipse(-u * 0.21, -u * 0.58, u * 0.1, u * 0.13, 0.2, 0, 7); ctx.fill();
  /* tête */
  var gh = ctx.createRadialGradient(-u * 0.02, -u * 0.92, 1, u * 0.02, -u * 0.87, u * 0.13); gh.addColorStop(0, "#f6d3ae"); gh.addColorStop(1, "#c98e5f");
  ctx.fillStyle = gh; ctx.beginPath(); ctx.arc(u * 0.02, -u * 0.87, u * 0.115, 0, 7); ctx.fill();
  ctx.fillStyle = "#2b1d12"; ctx.beginPath(); ctx.arc(u * 0.08, -u * 0.885, u * 0.018, 0, 7); ctx.fill();
  ctx.restore();
}
var M3UP0 = [0, 1.5, 2.5, 2.9, 3.1, 4.5, 6], M3DN0 = [6, 5.3, 4.1, 2.6, 1.6, 0.8, 0], M3HRS = [6, 8, 10, 12, 14, 16, 18];
/* fonctions du carré [0 ; 1]² */
var M3SQ = {
  para: {n:"f(x) = 1 − x²", f:function(x){ return 1 - x * x; }},
  rac:  {n:"f(x) = √x", f:function(x){ return Math.sqrt(Math.max(0, x)); }},
  ondes:{n:"f(x) = x + 0,08 sin(3πx)", f:function(x){ return x + 0.08 * Math.sin(3 * PI * x); }},
  saut: {n:"f saute en 0,5", f:function(x){ return x < 0.5 ? 0.75 : 0.25; }, jump:0.5},
  sort: {n:"f(x) = x + 0,3", f:function(x){ return x + 0.3; }, out:true},
  ta:   {n:"ta courbe", f:null}
};
var M3N = 160;

SFA.sim({
  id: "ma-point-fixe-moine", ch: "c02", tag: "Théorème du point fixe",
  titre: "Le moine qui monte et descend : un point fixe garanti",
  resume: "Un moine monte au monastère un jour et redescend le lendemain par le même sentier. En superposant les deux journées, ses deux trajets se croisent forcément : même heure, même endroit. Puis dessine à la souris une courbe continue dans le carré [0 ; 1]² : elle coupe toujours la diagonale.",
  but: "Le moine orange monte (jour 1), le bleu redescend (jour 2), tous deux de 6 h à 18 h. Déplace les billes des courbes pour changer leur allure : ils se croisent toujours. Dans l'onglet « carré », dessine une courbe dans le carré : les points fixes f(c) = c s'allument sur la diagonale.",
  aRetenir: "Théorème du point fixe : si f est continue sur un segment [a ; b] (ici [0 ; 1]) et f([a ; b]) ⊂ [a ; b], il existe c ∈ [a ; b] tel que f(c) = c. Preuve : l'écart g(x) = f(x) − x est continu, g(a) = f(a) − a ≥ 0 et g(b) = f(b) − b ≤ 0, donc g s'annule (théorème des valeurs intermédiaires). Le moine, c'est le même argument : la rencontre est un zéro de l'écart montée − descente, comme le point fixe est un zéro de g(x) = f(x) − x ; cet écart passe de −6 km à +6 km, il s'annule forcément.",
  piege: "Le théorème dit qu'un point fixe existe, pas qu'il est unique ni comment le calculer (il peut y en avoir plusieurs). Sans continuité, il tombe : une fonction qui saute peut passer par-dessus la diagonale sans la toucher. Il faut aussi que f envoie [0 ; 1] dans lui-même (x + 0,3 sort du carré et n'a aucun point fixe), et que l'intervalle soit fermé : sur ]0 ; 1], f(x) = x/2 n'a pas de point fixe (le seul candidat, 0, est exclu).",
  build: function(k, S){
    var c = k.canvas(0, {ratio:1.1}); m3ratio(c, 0.7, 1.08, 1.3);
    var st = {mode:"moine", h:6, hold:0, up:M3UP0.slice(), dn:M3DN0.slice(), t:0, sq:"para", Y:null, rev:1, sw:0, li:-1, ly:0, drawing:false, pen:null},
        G = null, grab = null;
    var md = k.seg("Scène", [["moine", "Le moine"], ["carre", "Le carré [0 ; 1]²"]], "moine", function(v){ st.mode = v; panels(); if (v === "carre") st.rev = 0; });
    var anim = k.toggle("Animation (l'horloge tourne de 6 h à 18 h)", true);
    var b1 = k.button("Profils au hasard", function(){
      var u = [], d = [], i; for (i = 0; i < 5; i++){ u.push(Math.random() * 6); d.push(Math.random() * 6); }
      u.sort(function(p, q){ return p - q; }); d.sort(function(p, q){ return q - p; });
      if (Math.random() < 0.5){ var j = 1 + Math.floor(Math.random() * 3); u[j] = Math.max(0, u[j - 1] - 0.6 * Math.random()); }
      st.up = [0].concat(u, [6]); st.dn = [6].concat(d, [0]); st.h = 6; st.hold = 0;
    }, true);
    var b2 = k.button("Profils d'origine", function(){ st.up = M3UP0.slice(); st.dn = M3DN0.slice(); st.h = 6; st.hold = 0; });
    var fsel = k.select("Fonction de départ", [["para", "1 − x²"], ["rac", "√x"], ["ondes", "x + 0,08 sin(3πx)"], ["saut", "saut en 0,5 (pas continue)"], ["sort", "x + 0,3 (sort du carré)"], ["ta", "ta courbe (dessine dans le carré)"]], "para", function(v){ st.sq = v; if (v !== "ta"){ st.Y = null; st.rev = 0; } else if (!st.Y) toArray(); });
    var b3 = k.button("Repartir d'une droite horizontale", function(){ st.Y = []; for (var i = 0; i <= M3N; i++) st.Y.push(0.5); st.sq = "ta"; fsel.set("ta"); });
    var ro1 = k.readouts(["Heure", "Montée (jour 1)", "Descente (jour 2)", "Écart montée − descente", "Rencontre", "Lieu de la rencontre (depuis le village)"]);
    var ro2 = k.readouts(["f(0)", "f(1)", "g(0) = f(0) − 0", "g(1) = f(1) − 1", "Points fixes", "f continue ?"]);
    var nset = m3note(k.note("", ""));
    function panels(){ var m = st.mode === "moine"; m3show(anim.el ? anim.el : null, m); m3show(b1.parentNode, m); m3show(fsel.el.parentNode, !m); m3show(b3.parentNode, !m); m3show(ro1.el, m); m3show(ro2.el, !m); }
    /* la case à cocher n'expose pas son élément : on la retrouve dans le panneau */
    var tgs = k.ctrl.querySelectorAll(".ctl.tg"); anim.el = tgs[tgs.length - 1];
    panels(); c.cv._m3 = st;
    function fup(){ return m3pchip(M3HRS, st.up); }
    function fdn(){ return m3pchip(M3HRS, st.dn); }
    function toArray(){ var T = M3SQ[st.sq] && M3SQ[st.sq].f ? M3SQ[st.sq] : M3SQ.para; st.Y = []; for (var i = 0; i <= M3N; i++) st.Y.push(m3cl(T.f(i / M3N), 0, 1)); }
    function fsq(){ if (st.sq === "ta" && st.Y){ var Y = st.Y; return function(x){ var u = m3cl(x, 0, 1) * M3N, i = Math.min(M3N - 1, Math.floor(u)), t = u - i; return Y[i] + (Y[i + 1] - Y[i]) * t; }; } return M3SQ[st.sq].f; }
    function geom(){
      var W = c.W, H = c.H;
      if (st.mode === "moine"){ var hs = Math.round(H * (W >= 700 ? 0.6 : 0.56)); return {s:{x:0, y:0, w:W, h:hs}, g:{x:0, y:hs, w:W, h:H - hs}}; }
      if (W >= 700){ var w1 = Math.round(Math.min(W * 0.6, H)); return {q:{x:0, y:0, w:w1, h:H}, e:{x:w1, y:0, w:W - w1, h:H}}; }
      var h1 = Math.round(H * 0.66); return {q:{x:0, y:0, w:W, h:h1}, e:{x:0, y:h1, w:W, h:H - h1}};
    }
    c.cv.style.touchAction = "none";
    c.pointer(function(t, p){
      if (!G) return;
      if (st.mode === "moine"){
        var ax = G.ax; if (!ax) return;
        if (t === "down"){ grab = null; var bd = 16;
          for (var i = 1; i < 6; i++){ var du = Math.hypot(ax.X(M3HRS[i]) - p.x, ax.Y(st.up[i]) - p.y), dn = Math.hypot(ax.X(M3HRS[i]) - p.x, ax.Y(st.dn[i]) - p.y);
            if (du < bd){ bd = du; grab = ["up", i]; } if (dn < bd){ bd = dn; grab = ["dn", i]; } }
          if (!grab && p.x >= ax.L - 6 && p.x <= ax.R + 6 && p.y >= ax.T && p.y <= ax.B + 20){ grab = ["h"]; anim.set(false); st.h = m3cl(ax.ix(p.x), 6, 18); st.hold = 0; }
          if (grab) c.cv.style.cursor = "grabbing";
        } else if (t === "drag" && grab){
          if (grab[0] === "h") st.h = m3cl(ax.ix(p.x), 6, 18);
          else st[grab[0]][grab[1]] = Math.round(m3cl(ax.iy(p.y), 0, 6) * 20) / 20;
          k.redraw();
        } else if (t === "up"){ grab = null; c.cv.style.cursor = "default"; }
        else if (t === "move"){ var near = false; for (var j = 1; j < 6; j++){ if (Math.hypot(ax.X(M3HRS[j]) - p.x, ax.Y(st.up[j]) - p.y) < 16 || Math.hypot(ax.X(M3HRS[j]) - p.x, ax.Y(st.dn[j]) - p.y) < 16) near = true; }
          c.cv.style.cursor = near ? "grab" : (p.y >= ax.T && p.y <= ax.B + 20 && p.x >= ax.L && p.x <= ax.R ? "ew-resize" : "default"); }
        return;
      }
      var q = G.qa; if (!q) return;
      var inside = p.x >= q.L - 4 && p.x <= q.R + 4 && p.y >= q.T - 4 && p.y <= q.B + 4;
      if (t === "down" && inside){
        if (st.sq !== "ta" || !st.Y){ toArray(); st.sq = "ta"; fsel.set("ta"); }
        st.rev = 1; st.drawing = true; st.li = -1; paint(p); c.cv.style.cursor = "crosshair";
      } else if (t === "drag" && st.drawing){ paint(p); }
      else if (t === "up"){ st.drawing = false; st.li = -1; st.pen = null; c.cv.style.cursor = "default"; }
      else if (t === "move"){ c.cv.style.cursor = inside ? "crosshair" : "default"; }
      function paint(pp){ var x = m3cl(q.ix(pp.x), 0, 1), y = m3cl(q.iy(pp.y), 0, 1), i = Math.round(x * M3N);
        if (st.li < 0) st.Y[i] = y; else { var i0 = st.li, y0 = st.ly, s = i > i0 ? 1 : -1; for (var j = i0; j !== i + s; j += s){ var tt = i === i0 ? 1 : (j - i0) / (i - i0); st.Y[j] = y0 + (y - y0) * tt; } }
        st.li = i; st.ly = y; st.pen = [x, y]; k.redraw(); }
    });
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.mode === "moine"){
        if (anim.value){ if (st.h >= 18){ st.hold += dt; if (st.hold > 2.6){ st.h = 6; st.hold = 0; } } else st.h = Math.min(18, st.h + dt * 1.05); }
      } else { st.rev = Math.min(1, st.rev + dt * 0.7); st.sw += dt * 0.5; }
      k.redraw();
    }); lp.play();

    /* ---------------- dessin de la scène de montagne ---------------- */
    function scene(b, h, U, Dn, cross){
      var ctx = c.ctx, kk = Math.min(b.w / 11, b.h / 7.4), ox = b.x + (b.w - 11 * kk) / 2 + 0.4 * kk, oy = b.y + b.h - (b.h - 7.4 * kk) / 2 - 0.5 * kk;
      function X(x){ return ox + x * kk; } function Y(z){ return oy - z * kk; }
      ctx.save(); m3rr(ctx, b.x + 4, b.y + 4, b.w - 8, b.h - 8, 12); ctx.clip();
      /* ciel selon l'heure */
      var day = Math.sin(PI * m3cl((h - 6) / 12, 0, 1)), am = h < 12;
      var topC = m3lerp(am ? "#41588f" : "#463c7c", "#3f86d6", day), botC = m3lerp(am ? "#f5b98f" : "#f39a6a", "#cfe7f7", day);
      var sky = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); sky.addColorStop(0, topC); sky.addColorStop(0.75, botC); ctx.fillStyle = sky; ctx.fillRect(b.x, b.y, b.w, b.h);
      /* soleil */
      var th = PI * m3cl((h - 6) / 12, 0, 1), sx = b.x + b.w * (0.06 + 0.88 * (h - 6) / 12), sy = b.y + b.h * 0.62 - Math.sin(th) * b.h * 0.5;
      D.glow(c, sx, sy, 46, "#ffe08a", 0.55); var gs = ctx.createRadialGradient(sx - 3, sy - 3, 1, sx, sy, 13); gs.addColorStop(0, "#fffbe6"); gs.addColorStop(1, "#ffc73a"); ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(sx, sy, 13, 0, 7); ctx.fill();
      /* nuages */
      function cloud(cx, cy, s){ ctx.fillStyle = "rgba(255,255,255,.82)"; ctx.beginPath(); ctx.arc(cx, cy, 11 * s, 0, 7); ctx.arc(cx + 13 * s, cy - 6 * s, 14 * s, 0, 7); ctx.arc(cx + 29 * s, cy, 11 * s, 0, 7); ctx.rect(cx, cy - 2 * s, 29 * s, 11 * s); ctx.fill(); }
      var cw = b.w + 120; cloud(b.x - 60 + ((st.t * 9) % cw), b.y + b.h * 0.14, 1); cloud(b.x - 60 + ((st.t * 6 + cw * 0.55) % cw), b.y + b.h * 0.26, 0.75);
      /* montagnes lointaines */
      ctx.fillStyle = m3lerp("#7c8fb8", "#9db3cf", day); ctx.beginPath(); ctx.moveTo(b.x, Y(0)); [[-3, 1.5], [-0.5, 3.4], [1.6, 2.4], [3.4, 4.6], [5.2, 3.2], [9.5, 5.2], [11.6, 3.6], [14, 4.4]].forEach(function(q){ ctx.lineTo(X(q[0]), Y(q[1])); }); ctx.lineTo(b.x + b.w, Y(0)); ctx.closePath(); ctx.fill();
      /* montagne principale */
      var MT = [[-3, 0.1], [-0.6, 0.15], [0.6, 0.45], [2.3, 2.15], [3.3, 3.5], [4.4, 4.55], [6.3, 5.75], [7.4, 6.15], [8.25, 6.75], [9.1, 5.7], [10.4, 3.9], [11.6, 1.2], [14, 0.4]];
      var gm = ctx.createLinearGradient(X(1), Y(6), X(10), Y(0)); gm.addColorStop(0, m3lerp("#8a9a6a", "#9fb27a", day)); gm.addColorStop(0.55, m3lerp("#5f7448", "#6f8a52", day)); gm.addColorStop(1, "#3f5233");
      ctx.fillStyle = gm; ctx.beginPath(); ctx.moveTo(b.x - 10, b.y + b.h); MT.forEach(function(q){ ctx.lineTo(X(q[0]), Y(q[1])); }); ctx.lineTo(b.x + b.w + 10, b.y + b.h); ctx.closePath(); ctx.fill();
      /* face à l'ombre */
      ctx.fillStyle = "rgba(30,40,30,.22)"; ctx.beginPath(); ctx.moveTo(X(8.25), Y(6.75)); ctx.lineTo(X(9.1), Y(5.7)); ctx.lineTo(X(10.4), Y(3.9)); ctx.lineTo(X(11.6), Y(1.2)); ctx.lineTo(X(9.0), Y(1.0)); ctx.lineTo(X(8.6), Y(4.4)); ctx.closePath(); ctx.fill();
      /* rochers et neige */
      ctx.fillStyle = "#8c8f8a"; ctx.beginPath(); ctx.moveTo(X(7.6), Y(6.2)); ctx.lineTo(X(8.25), Y(6.75)); ctx.lineTo(X(8.9), Y(5.95)); ctx.lineTo(X(8.4), Y(6.05)); ctx.lineTo(X(8.1), Y(5.8)); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#f7fbff"; ctx.beginPath(); ctx.moveTo(X(7.85), Y(6.45)); ctx.lineTo(X(8.25), Y(6.75)); ctx.lineTo(X(8.65), Y(6.25)); ctx.lineTo(X(8.4), Y(6.32)); ctx.lineTo(X(8.2), Y(6.18)); ctx.lineTo(X(8.05), Y(6.35)); ctx.closePath(); ctx.fill();
      /* prairie au premier plan */
      var gp = ctx.createLinearGradient(0, Y(0.6), 0, b.y + b.h); gp.addColorStop(0, "#8fb35e"); gp.addColorStop(1, "#5d8a3a"); ctx.fillStyle = gp; ctx.beginPath(); ctx.moveTo(b.x, Y(0.25)); ctx.quadraticCurveTo(X(3), Y(0.05), X(6), Y(0.3)); ctx.quadraticCurveTo(X(9), Y(0.5), b.x + b.w, Y(0.15)); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.lineTo(b.x, b.y + b.h); ctx.closePath(); ctx.fill();
      /* sapins */
      [[0.1, 0.3, 0.9], [2.5, 0.35, 0.8], [4.4, 1.15, 0.8], [1.1, 1.0, 0.7], [6.9, 3.0, 0.75], [3.0, 1.9, 0.6], [6.5, 4.6, 0.6], [9.0, 3.6, 0.8], [9.8, 2.3, 0.9], [5.3, 2.9, 0.7], [10.6, 0.6, 1.0], [-0.6, 0.4, 0.8]].forEach(function(q){
        var tx = X(q[0]), tz = Y(q[1]), s = q[2] * kk * 0.55; ctx.fillStyle = "#5a3d22"; ctx.fillRect(tx - s * 0.07, tz - s * 0.25, s * 0.14, s * 0.25);
        var gt = ctx.createLinearGradient(tx - s * 0.35, 0, tx + s * 0.35, 0); gt.addColorStop(0, "#3f7a46"); gt.addColorStop(1, "#1f4a2c"); ctx.fillStyle = gt;
        ctx.beginPath(); ctx.moveTo(tx, tz - s * 1.2); ctx.lineTo(tx + s * 0.38, tz - s * 0.2); ctx.lineTo(tx - s * 0.38, tz - s * 0.2); ctx.closePath(); ctx.fill(); });
      /* village */
      [[0.1, 0.32, 0.55], [0.75, 0.3, 0.45], [1.45, 0.34, 0.5]].forEach(function(q, i){ var hx = X(q[0]), hz = Y(q[1]), s = q[2] * kk;
        ctx.fillStyle = i === 1 ? "#efe3cc" : "#e6d6b8"; ctx.fillRect(hx - s * 0.45, hz - s * 0.6, s * 0.9, s * 0.6); ctx.fillStyle = "#a8432a"; ctx.beginPath(); ctx.moveTo(hx - s * 0.58, hz - s * 0.58); ctx.lineTo(hx, hz - s * 1.02); ctx.lineTo(hx + s * 0.58, hz - s * 0.58); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#5b4636"; ctx.fillRect(hx - s * 0.1, hz - s * 0.3, s * 0.2, s * 0.3); });
      /* sentier */
      ctx.lineCap = "round"; ctx.lineJoin = "round"; var tp = M3TRAIL.pts;
      ctx.strokeStyle = "#a88c5e"; ctx.lineWidth = Math.max(4, kk * 0.2); ctx.beginPath(); tp.forEach(function(q, i){ if (i) ctx.lineTo(X(q[0]), Y(q[1])); else ctx.moveTo(X(q[0]), Y(q[1])); }); ctx.stroke();
      ctx.strokeStyle = "#ead6aa"; ctx.lineWidth = Math.max(2.5, kk * 0.13); ctx.stroke();
      ctx.strokeStyle = "rgba(140,110,70,.55)"; ctx.lineWidth = 1; ctx.setLineDash([2, 6]); ctx.stroke(); ctx.setLineDash([]);
      /* monastère */
      var mx = X(7.95), mz = Y(5.42), s = kk;
      ctx.fillStyle = "#cfc4b0"; ctx.fillRect(mx - s * 0.62, mz - s * 0.1, s * 1.24, s * 0.12);
      var gw = ctx.createLinearGradient(mx - s * 0.5, 0, mx + s * 0.5, 0); gw.addColorStop(0, "#fbf3e2"); gw.addColorStop(1, "#d8c7a6"); ctx.fillStyle = gw; ctx.fillRect(mx - s * 0.5, mz - s * 0.55, s, s * 0.47);
      ctx.fillStyle = "#e9dcc2"; ctx.fillRect(mx - s * 0.3, mz - s * 0.9, s * 0.6, s * 0.3);
      function roof(y, w){ ctx.fillStyle = "#9e2a1e"; ctx.beginPath(); ctx.moveTo(mx - w, y); ctx.quadraticCurveTo(mx - w * 0.6, y - s * 0.06, mx - w * 0.45, y - s * 0.2); ctx.lineTo(mx + w * 0.45, y - s * 0.2); ctx.quadraticCurveTo(mx + w * 0.6, y - s * 0.06, mx + w, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(mx - w * 0.8, y, w * 1.6, s * 0.04); }
      roof(mz - s * 0.53, s * 0.68); roof(mz - s * 0.88, s * 0.45);
      ctx.fillStyle = "#d9a520"; ctx.beginPath(); ctx.arc(mx, mz - s * 1.12, s * 0.05, 0, 7); ctx.fill();
      ctx.fillStyle = "#5b3b25"; ctx.fillRect(mx - s * 0.09, mz - s * 0.32, s * 0.18, s * 0.24);
      ctx.fillStyle = "#4a3426"; [-0.32, 0.26].forEach(function(dx){ ctx.fillRect(mx + dx * s, mz - s * 0.42, s * 0.08, s * 0.1); });
      /* guirlande de drapeaux */
      ctx.strokeStyle = "rgba(60,40,30,.6)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(mx + s * 0.45, mz - s * 0.53); ctx.quadraticCurveTo(mx + s * 0.85, mz - s * 0.3, mx + s * 1.2, mz - s * 0.1); ctx.stroke();
      ["#2f7fd1", "#f7f7f7", "#c0321d", "#24775a", "#f4c542"].forEach(function(col, i){ var t = (i + 0.5) / 5, fx = (1 - t) * (1 - t) * (mx + s * 0.45) + 2 * (1 - t) * t * (mx + s * 0.85) + t * t * (mx + s * 1.2), fy = (1 - t) * (1 - t) * (mz - s * 0.53) + 2 * (1 - t) * t * (mz - s * 0.3) + t * t * (mz - s * 0.1); ctx.fillStyle = col; ctx.fillRect(fx - 2, fy, 4, 5); });
      ctx.restore();
      /* lieux de rencontre déjà passés (étoile) */
      var bx = {x:b.x + 4, y:b.y + 4, w:b.w - 8, h:b.h - 8}, u = Math.max(26, Math.min(56, kk * 1.05)), du = U(h), dd = Dn(h), A1 = m3at(du), A2 = m3at(dd);
      /* une étoile par rencontre ; pour un intervalle [début ; fin], une seule étoile qui suit les moines */
      cross.forEach(function(z){ if (h < z.a - 0.02) return; var q = m3at(U(m3cl(h, z.a, z.b))), px = X(q[0]), pz = Y(q[1]); D.glow(c, px, pz, 22, "#fff3a0", 0.8);
        ctx.save(); ctx.translate(px, pz); ctx.fillStyle = "#f4c542"; ctx.strokeStyle = "#8a5a00"; ctx.lineWidth = 1; ctx.beginPath(); for (var i = 0; i < 10; i++){ var r = i % 2 ? 4 : 9, an = -PI / 2 + i * PI / 5; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); });
      /* flash au moment de la rencontre */
      cross.forEach(function(z){ var tc = z.a, dt = h - tc; if (dt < -0.02 || dt > 0.6) return; var q = m3at(U(tc)), px = X(q[0]), pz = Y(q[1]) - u * 0.5, r = 14 + dt * 90; ctx.save(); ctx.strokeStyle = "rgba(255,230,120," + (1 - dt / 0.6) + ")"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, pz, r, 0, 7); ctx.stroke(); ctx.restore(); });
      var moving = anim.value && h < 18 && h > 6;
      m3monk(c, X(A2[0]), Y(A2[1]), u, M3C.sky, -A2[2], st.t * 7 + 1, moving);
      m3monk(c, X(A1[0]), Y(A1[1]), u, M3C.orange, A1[2], st.t * 7, moving);
      /* étiquettes au-dessus des têtes ; une seule si elles se gênent */
      var X1 = X(A1[0]), Y1 = Y(A1[1]), X2 = X(A2[0]), Y2 = Y(A2[1]), fs = c.W < 470 ? 10 : 11;
      function hit(p, q){ return p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h; }
      var mk1 = {x:X1 - u * 0.4, y:Y1 - u, w:u * 0.8, h:u}, mk2 = {x:X2 - u * 0.4, y:Y2 - u, w:u * 0.8, h:u};
      var r1 = m3pill(c, "jour 1 ↑", X1, Y1 - u - 12, M3C.orange, bx, {size:fs, dry:true}), r2 = m3pill(c, "jour 2 ↓", X2, Y2 - u - 12, M3C.sky, bx, {size:fs, dry:true});
      if (hit(r1, r2) || hit(r1, mk2) || hit(r2, mk1)) m3pill(c, "jour 1 ↑ · jour 2 ↓", (X1 + X2) / 2, Math.min(Y1, Y2) - u - 12, M3C.ink, bx, {size:fs});
      else { m3pill(c, "jour 1 ↑", X1, Y1 - u - 12, M3C.orange, bx, {size:fs}); m3pill(c, "jour 2 ↓", X2, Y2 - u - 12, M3C.sky, bx, {size:fs}); }
      /* horloge */
      var ckx = b.x + 40, cky = b.y + 40, cr = 24; ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2; var gc = ctx.createRadialGradient(ckx - 6, cky - 8, 2, ckx, cky, cr); gc.addColorStop(0, "#ffffff"); gc.addColorStop(1, "#dfe5ec");
      ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(ckx, cky, cr, 0, 7); ctx.fill(); ctx.shadowColor = "transparent"; ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.stroke();
      for (var i = 0; i < 12; i++){ var an = i * PI / 6; ctx.lineWidth = i % 3 ? 1 : 2; ctx.beginPath(); ctx.moveTo(ckx + Math.sin(an) * cr * 0.78, cky - Math.cos(an) * cr * 0.78); ctx.lineTo(ckx + Math.sin(an) * cr * 0.92, cky - Math.cos(an) * cr * 0.92); ctx.stroke(); }
      var ah = (h % 12) / 12 * 2 * PI, am2 = (h % 1) * 2 * PI; ctx.strokeStyle = M3C.ink; ctx.lineCap = "round"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ckx, cky); ctx.lineTo(ckx + Math.sin(ah) * cr * 0.5, cky - Math.cos(ah) * cr * 0.5); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ckx, cky); ctx.lineTo(ckx + Math.sin(am2) * cr * 0.75, cky - Math.cos(am2) * cr * 0.75); ctx.stroke(); ctx.restore();
      m3pill(c, m3hm(h), ckx + cr + 8, cky, M3C.ink, bx, {align:"left", size:12.5});
    }

    k.draw(function(){
      c.clear(); var ctx = c.ctx, Lg = geom(); G = {};
      if (st.mode === "moine"){
        var U = fup(), Dn = fdn(), h = st.h, gfun = function(t){ return U(t) - Dn(t); }, cross = m3zeros(gfun, 6, 18, 1200);
        scene(Lg.s, h, U, Dn, cross);
        /* ---- graphe position / heure ---- */
        var gb = Lg.g, nar = c.W < 470; m3card(c, gb, nar ? "POSITION (KM)" : "POSITION SUR LE SENTIER (KM)", M3C.ink);
        (function(){ var lx = gb.x + gb.w - 14, ly = gb.y + 16; ctx.save(); ctx.font = "700 10.5px " + M3FONT; ctx.textBaseline = "middle"; ctx.textAlign = "right";
          [[nar ? "descente" : "descente (jour 2)", M3C.sky], [nar ? "montée" : "montée (jour 1)", M3C.orange]].forEach(function(it){ ctx.fillStyle = "#3b4656"; ctx.fillText(it[0], lx, ly); lx -= ctx.measureText(it[0]).width + 6; ctx.strokeStyle = it[1]; ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(lx - 14, ly); ctx.lineTo(lx, ly); ctx.stroke(); lx -= 26; });
          ctx.restore(); })();
        var ax = m3axes(c, gb, {x0:6, x1:18, y0:0, y1:6, sx:2, sy:1, l:40, r:16, t:30, b:24, frame:true, fx:function(v){ return F(v, 0) + " h"; }, fy:function(v){ return F(v, 0); }}); G.ax = ax; st.kn = [ax.X(10), ax.Y(st.up[2]), ax.X(12), ax.Y(st.dn[3])];
        m3clip(c, ax);
        /* écart : zone entre les courbes */
        /* écart montée − descente : vert s'il est positif, rouge s'il est négatif */
        var n = 240, i, t;
        var i0 = 0, sg = function(j){ var tj = 6 + 12 * (j + 0.5) / n; return U(tj) - Dn(tj) >= 0; };
        for (i = 1; i <= n; i++){ if (i < n && sg(i) === sg(i0)) continue;   /* une bande de même signe : un seul polygone (pas de joints) */
          ctx.fillStyle = sg(i0) ? "rgba(36,119,90,.16)" : "rgba(192,50,29,.13)"; ctx.beginPath();
          for (var j = i0; j <= i; j++){ t = 6 + 12 * j / n; ctx.lineTo(ax.X(t), ax.Y(U(t))); } for (j = i; j >= i0; j--){ t = 6 + 12 * j / n; ctx.lineTo(ax.X(t), ax.Y(Dn(t))); } ctx.closePath(); ctx.fill(); i0 = i; }
        function crv(f, col){ ctx.save(); ctx.shadowColor = "rgba(15,27,45,.2)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2; ctx.strokeStyle = col; ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.beginPath(); for (var i = 0; i <= 240; i++){ var t = 6 + 12 * i / 240; if (i) ctx.lineTo(ax.X(t), ax.Y(f(t))); else ctx.moveTo(ax.X(t), ax.Y(f(t))); } ctx.stroke(); ctx.restore(); }
        crv(U, M3C.orange); crv(Dn, M3C.sky);
        /* curseur de l'heure */
        D.line(c, ax.X(h), ax.T, ax.X(h), ax.B, "rgba(15,27,45,.55)", 1.5, [4, 3]);
        ctx.restore();
        m3ball(c, ax.X(h), ax.Y(U(h)), 6.5, M3C.orange); m3ball(c, ax.X(h), ax.Y(Dn(h)), 6.5, M3C.sky);
        for (i = 1; i < 6; i++){ m3ball(c, ax.X(M3HRS[i]), ax.Y(st.up[i]), 5.5, M3C.orange, "", grab && grab[0] === "up" && grab[1] === i); m3ball(c, ax.X(M3HRS[i]), ax.Y(st.dn[i]), 5.5, M3C.sky, "", grab && grab[0] === "dn" && grab[1] === i); }
        var gbx = {x:ax.L, y:ax.T, w:ax.R - ax.L, h:ax.B - ax.T}, used = [];
        cross.forEach(function(z, j){ var iv = m3isIv(z), tc = iv ? (z.a + z.b) / 2 : z.a, X = ax.X(tc), Yc = ax.Y(U(tc));
          if (iv){ /* écart nul sur tout un intervalle : un seul segment doré */
            ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = "rgba(244,197,66,.8)"; ctx.shadowBlur = 10; ctx.strokeStyle = M3C.gold; ctx.lineWidth = 7; ctx.beginPath();
            for (var q = 0; q <= 60; q++){ var tq = z.a + (z.b - z.a) * q / 60; if (q) ctx.lineTo(ax.X(tq), ax.Y(U(tq))); else ctx.moveTo(ax.X(tq), ax.Y(U(tq))); } ctx.stroke(); ctx.restore();
            m3ball(c, ax.X(z.a), ax.Y(U(z.a)), 5.5, M3C.gold); m3ball(c, ax.X(z.b), ax.Y(U(z.b)), 5.5, M3C.gold); }
          else { D.glow(c, X, Yc, 20, "#f4c542", 0.7); m3ball(c, X, Yc, 7, M3C.gold); }
          if (j < 3){ var up = U(tc) > 3, ly = Yc + (up ? 20 : -20); used.forEach(function(r){ if (Math.abs(r[0] - X) < 70 && Math.abs(r[1] - ly) < 20) ly += (up ? 22 : -22); }); used.push([X, ly]); m3pill(c, iv ? m3hm(z.a) + " → " + m3hm(z.b) : m3hm(tc), X, ly, M3C.green, gbx, {size:10.5}); } });
        /* afficheurs */
        var du = U(h), dn = Dn(h), gv = Math.round(du * 100) / 100 - Math.round(dn * 100) / 100;   /* écart des valeurs affichées : 2,95 − 2,32 = 0,63 */
        ro1.set(0, m3hm(h)); ro1.set(1, F(du, 2) + " km"); ro1.set(2, F(dn, 2) + " km"); ro1.set(3, (gv > 0 ? "+" : "") + F(gv, 2) + " km");
        var anyIv = cross.some(m3isIv), z0 = cross[0];
        ro1.set(4, anyIv ? cross.slice(0, 2).map(m3hmZ).join(" ; ") + (cross.length > 2 ? "…" : "") + " (une infinité de rencontres)" : cross.length === 1 ? m3hm(z0.a) : cross.length + " fois : " + cross.slice(0, 3).map(m3hmZ).join(" ; ") + (cross.length > 3 ? "…" : ""));
        function lieu(z){ var d1 = U(z.a), d2 = U(z.b); return m3isIv(z) && F(d1, 2) !== F(d2, 2) ? "de " + F(d1, 2) + " à " + F(d2, 2) + " km" : F(d1, 2) + " km"; }
        ro1.set(5, cross.length ? lieu(z0) : "—");
        var seen = cross.filter(function(z){ return z.a <= h + 1e-9; }), s0 = seen[0];
        nset(seen.length ? "<b>Rencontre " + (m3isIv(s0) ? m3hmZ(s0) : "à " + m3hm(s0.a)) + "</b>, " + (m3isIv(s0) && F(U(s0.a), 2) !== F(U(s0.b), 2) ? "du kilomètre " + F(U(s0.a), 2) + " au kilomètre " + F(U(s0.b), 2) : "à " + F(U(s0.a), 2) + " km du village (altitude " + F(m3alt(U(s0.a)), 0) + " m)") + " : même heure, même endroit, les deux jours. La rencontre est un zéro de l'écart montée − descente, qui vaut −6 km à 6 h et +6 km à 18 h ; comme il varie continûment, il passe par 0." + (anyIv ? " Ici l'écart reste nul sur tout un intervalle : une infinité de rencontres. L'existence est garantie, pas l'unicité." : cross.length > 1 ? " Ici il s'annule " + cross.length + " fois : l'existence est garantie, pas l'unicité." : "")
          : "À " + m3hm(h) + ", l'écart montée − descente vaut " + F(gv, 2) + " km. Il part de −6 km à 6 h et doit arriver à +6 km à 18 h : regarde-le s'annuler. Déplace les billes des courbes : la rencontre existe toujours.", seen.length ? "ok" : "");
        return;
      }
      /* ---------------- le carré [0 ; 1]² ---------------- */
      var qb = Lg.q, eb = Lg.e, f = fsq(), T = M3SQ[st.sq], jump = T && T.jump, out = T && T.out;
      m3card(c, qb, "f : [0 ; 1] → " + (out ? "ℝ" : "[0 ; 1]") + " · " + (st.sq === "ta" ? "ta courbe" : T.n), M3C.blue);
      var side = Math.min(qb.w - 64, qb.h - 66), qx = qb.x + (qb.w - side) / 2 + 12, qy = qb.y + 32;
      var qa = m3axes(c, {x:qx - 34, y:qy, w:side + 34 + 10, h:side + 30}, {x0:0, x1:1, y0:0, y1:1, sx:0.25, sy:0.25, l:34, r:10, t:0, b:30, frame:true, fx:function(v){ return F(v, 2); }, fy:function(v){ return F(v, 2); }});
      G.qa = qa; st.qr = [qa.L, qa.R, qa.T, qa.B]; m3clip(c, qa);
      /* triangle au-dessus (f(x) > x) et au-dessous de la diagonale */
      ctx.fillStyle = "rgba(36,119,90,.09)"; ctx.beginPath(); ctx.moveTo(qa.X(0), qa.Y(0)); ctx.lineTo(qa.X(0), qa.Y(1)); ctx.lineTo(qa.X(1), qa.Y(1)); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(192,50,29,.08)"; ctx.beginPath(); ctx.moveTo(qa.X(0), qa.Y(0)); ctx.lineTo(qa.X(1), qa.Y(0)); ctx.lineTo(qa.X(1), qa.Y(1)); ctx.closePath(); ctx.fill();
      D.line(c, qa.X(0), qa.Y(0), qa.X(1), qa.Y(1), "rgba(15,27,45,.6)", 1.8, [7, 5]);
      var rv = st.rev, xmax = rv;
      /* courbe (dévoilée progressivement à l'ouverture de l'onglet) */
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; ctx.strokeStyle = M3C.blue; ctx.lineWidth = 3.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
      function piece(x0, x1){ ctx.beginPath(); var m = 300, s = false; for (var i = 0; i <= m; i++){ var x = x0 + (x1 - x0) * i / m; if (x > xmax) break; var y = f(x); if (s) ctx.lineTo(qa.X(x), qa.Y(y)); else { ctx.moveTo(qa.X(x), qa.Y(y)); s = true; } } ctx.stroke(); }
      if (jump){ piece(0, jump - 1e-6); piece(jump, 1); } else piece(0, 1); ctx.restore();
      if (jump && xmax >= jump){ ctx.save(); ctx.lineWidth = 2.4; ctx.strokeStyle = M3C.blue; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(qa.X(jump), qa.Y(f(jump - 1e-6)), 5, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = M3C.blue; ctx.beginPath(); ctx.arc(qa.X(jump), qa.Y(f(jump)), 5, 0, 7); ctx.fill(); ctx.restore(); }
      /* crayon qui dessine */
      if (rv < 1 || st.pen){ var px = st.pen ? st.pen[0] : rv, pyv = st.pen ? st.pen[1] : Math.min(1, f(Math.min(rv, 1))), PX = qa.X(px), PY = qa.Y(pyv);
        ctx.save(); ctx.translate(PX, PY); ctx.rotate(-0.75); var gp = ctx.createLinearGradient(0, -4, 0, 4); gp.addColorStop(0, "#ffd45a"); gp.addColorStop(1, "#d89a10"); ctx.fillStyle = gp; ctx.fillRect(8, -4, 34, 8); ctx.fillStyle = "#f2c7a0"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(9, -4); ctx.lineTo(9, 4); ctx.closePath(); ctx.fill(); ctx.fillStyle = M3C.ink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(3, -1.4); ctx.lineTo(3, 1.4); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#e58a9a"; ctx.fillRect(42, -4, 6, 8); ctx.restore(); }
      /* point qui balaie [0 ; 1] et l'écart jusqu'à la diagonale */
      var g = function(x){ return f(x) - x; }, fixed = m3zeros(g, 0, 1, 1600);
      if (rv >= 1){ var xs = 0.5 - 0.5 * Math.cos(st.sw), ys = f(xs), gcol = ys - xs >= 0 ? M3C.green : M3C.red; D.line(c, qa.X(xs), qa.Y(ys), qa.X(xs), qa.Y(xs), gcol, 3, null); m3ball(c, qa.X(xs), qa.Y(ys), 6, gcol); D.dot(c, qa.X(xs), qa.Y(xs), 3.5, M3C.ink); }
      ctx.restore();
      var qbx = {x:qa.L, y:qa.T, w:qa.R - qa.L, h:qa.B - qa.T}, shown = fixed.filter(function(z){ return z.a <= xmax + 1e-9; }), lab = [];
      /* f sort du carré : point de sortie */
      if (out && rv >= 1){ var xo = 0.7, XO = qa.X(xo), YO = qa.Y(1); ctx.save(); ctx.strokeStyle = M3C.red; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(XO, YO, 7, 0, 7); ctx.stroke(); ctx.restore();
        D.arrow(c, XO, YO - 6, XO, YO - 24, M3C.red, 2.4);
        lab.push(m3pill(c, "f(x) > 1 dès x > 0,7 : sort du carré", XO - 12, YO + 20, M3C.red, qbx, {align:"right", size:c.W < 470 ? 9.5 : 10.5})); }
      /* billes dorées (en px) : un zéro isolé = une bille, un intervalle = un segment */
      var gold = []; shown.forEach(function(z){ var zb = Math.min(z.b, xmax); for (var q = 0; q <= (m3isIv(z) ? 12 : 0); q++){ var xq = z.a + (zb - z.a) * q / 12; gold.push([qa.X(xq), qa.Y(xq)]); } });
      /* étiquette « y = x » sur la diagonale, le plus loin possible des billes dorées */
      function dRect(r, p){ var dx = Math.max(r.x - p[0], 0, p[0] - r.x - r.w), dy = Math.max(r.y - p[1], 0, p[1] - r.y - r.h); return Math.hypot(dx, dy); }
      var cands = [0.86, 0.14, 0.5, 0.7, 0.3], tq; for (tq = 0.1; tq < 0.91; tq += 0.04) cands.push(tq);
      var ryx = null, bestD = -1; cands.forEach(function(t){ if (bestD >= 34) return; var r = m3pill(c, "y = x", qa.X(t) + 12, qa.Y(t) + 14, "#3b4656", qbx, {align:"left", size:10.5, dry:true}), m = 1e9;
        gold.forEach(function(p){ m = Math.min(m, dRect(r, p)); }); lab.forEach(function(q){ if (hit2(q, r)) m = Math.min(m, 0); }); if (m > bestD){ bestD = m; ryx = r; } });
      lab.push(ryx);
      function hit2(p, q){ return p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h; }
      shown.forEach(function(z){ if (m3isIv(z)){ var zb = Math.min(z.b, xmax); ctx.save(); ctx.lineCap = "round"; ctx.shadowColor = "rgba(244,197,66,.85)"; ctx.shadowBlur = 12; ctx.strokeStyle = M3C.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(qa.X(z.a), qa.Y(z.a)); ctx.lineTo(qa.X(zb), qa.Y(zb)); ctx.stroke(); ctx.restore(); m3ball(c, qa.X(z.a), qa.Y(z.a), 6, M3C.gold); m3ball(c, qa.X(zb), qa.Y(zb), 6, M3C.gold); }
        else { D.glow(c, qa.X(z.a), qa.Y(z.a), 24, "#f4c542", 0.75 + 0.2 * Math.sin(st.t * 4)); m3ball(c, qa.X(z.a), qa.Y(z.a), 7.5, M3C.gold); } });
      shown.slice(0, 4).forEach(function(z){ var iv = m3isIv(z), x = iv ? (z.a + Math.min(z.b, xmax)) / 2 : z.a, X = qa.X(x), Yc = qa.Y(x), s2 = iv ? "c ∈ [" + F(z.a, 2) + " ; " + F(z.b, 2) + "]" : "c = " + F(x, 3), e = 0.1;
        /* côté de la diagonale où la courbe passe le plus loin */
        var dUL = Math.abs(f(m3cl(x - e, 0, 1)) - (x + e)), dDR = Math.abs(f(m3cl(x + e, 0, 1)) - (x - e)), sides = dUL >= dDR ? ["ul", "dr"] : ["dr", "ul"];
        for (var i = 0; i < 2; i++){ var ul = sides[i] === "ul", r = m3pill(c, s2, X + (ul ? -12 : 12), Yc + (ul ? -18 : 18), M3C.green, qbx, {align:ul ? "right" : "left", size:10.5, dry:true});
          if (!lab.some(function(q){ return hit2(q, r); })){ lab.push(r); m3pill(c, s2, X + (ul ? -12 : 12), Yc + (ul ? -18 : 18), M3C.green, qbx, {align:ul ? "right" : "left", size:10.5}); break; } } });
      D.text(c, "y = x", ryx.x + ryx.w / 2, ryx.y + ryx.h / 2, {size:12, color:"#3b4656", math:true, weight:700, halo:"rgba(255,255,255,.9)"});
      /* ---- panneau de l'écart g(x) = f(x) − x ---- */
      m3card(c, eb, "ÉCART g(x) = f(x) − x", M3C.ink);
      var ea = m3axes(c, eb, {x0:0, x1:1, y0:-1, y1:1, sx:0.25, sy:0.5, l:40, r:46, t:30, b:26, fx:function(v){ return F(v, 2); }, fy:function(v){ return Math.abs(v) < 1e-9 ? "" : F(v, 1); }});
      m3clip(c, ea);
      ctx.fillStyle = "rgba(36,119,90,.08)"; ctx.fillRect(ea.L, ea.T, ea.R - ea.L, ea.Y(0) - ea.T); ctx.fillStyle = "rgba(192,50,29,.07)"; ctx.fillRect(ea.L, ea.Y(0), ea.R - ea.L, ea.B - ea.Y(0));
      ctx.lineWidth = 3; ctx.lineCap = "round"; var prev = null;
      for (var i2 = 0; i2 <= 300; i2++){ var x2 = i2 / 300; if (x2 > xmax) break; if (jump && prev && prev[0] < jump && x2 >= jump) prev = null; var y2 = g(x2); if (prev){ ctx.strokeStyle = (y2 + prev[1]) / 2 >= 0 ? M3C.green : M3C.red; ctx.beginPath(); ctx.moveTo(ea.X(prev[0]), ea.Y(prev[1])); ctx.lineTo(ea.X(x2), ea.Y(y2)); ctx.stroke(); } prev = [x2, y2]; }
      if (rv >= 1){ var xs2 = 0.5 - 0.5 * Math.cos(st.sw); D.line(c, ea.X(xs2), ea.T, ea.X(xs2), ea.B, "rgba(15,27,45,.3)", 1, [3, 3]); m3ball(c, ea.X(xs2), ea.Y(g(xs2)), 5.5, g(xs2) >= 0 ? M3C.green : M3C.red); }
      ctx.restore();
      shown.forEach(function(z){ var zb = Math.min(z.b, xmax); if (m3isIv(z)){ ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = M3C.gold; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ea.X(z.a), ea.Y(0)); ctx.lineTo(ea.X(zb), ea.Y(0)); ctx.stroke(); ctx.restore(); }
        D.glow(c, ea.X(z.a), ea.Y(0), 14, "#f4c542", 0.7); m3ball(c, ea.X(z.a), ea.Y(0), 5.5, M3C.gold); if (m3isIv(z)) m3ball(c, ea.X(zb), ea.Y(0), 5.5, M3C.gold); });
      var ebx = {x:ea.L, y:ea.T, w:ea.R - ea.L, h:ea.B - ea.T};
      D.text(c, "g > 0", ea.R + 6, (ea.T + ea.Y(0)) / 2, {size:11, color:M3C.green, align:"left", weight:800});
      D.text(c, "g < 0", ea.R + 6, (ea.B + ea.Y(0)) / 2, {size:11, color:M3C.red, align:"left", weight:800});
      /* afficheurs */
      var f0 = f(0), f1 = f(1);
      var g0v = Math.abs(f0) < 5e-4 ? 0 : f0, g1v = Math.abs(f1 - 1) < 5e-4 ? 0 : f1 - 1, anyIv = fixed.some(m3isIv);
      function zs(z){ return m3isIv(z) ? "[" + F(z.a, 3) + " ; " + F(z.b, 3) + "]" : F(z.a, 3); }
      ro2.set(0, F(f0, 3)); ro2.set(1, F(f1, 3)); ro2.set(2, F(g0v, 3) + (g0v >= 0 ? " ≥ 0" : " < 0")); ro2.set(3, F(g1v, 3) + (g1v <= 0 ? " ≤ 0" : " > 0"));
      ro2.set(4, fixed.length ? (fixed.length > 1 ? fixed.length + " : " : "") + fixed.slice(0, 4).map(zs).join(" ; ") + (fixed.length > 4 ? "…" : "") + (anyIv ? " (une infinité)" : "") : "aucun");
      ro2.set(5, jump ? "non (saut en " + F(jump, 1) + ")" : "oui");
      if (jump) nset("<b>Pas continue, pas de point fixe.</b> f vaut 0,75 avant 0,5 puis 0,25 : le graphe saute par-dessus la diagonale sans la toucher, et g passe de + à − sans s'annuler. L'hypothèse de continuité est indispensable.", "warn");
      else if (out) nset("<b>f sort du carré, pas de point fixe.</b> f(x) = x + 0,3 dépasse 1 dès que x > 0,7 : f([0 ; 1]) = [0,3 ; 1,3] n'est pas inclus dans [0 ; 1]. Alors g(1) = f(1) − 1 = " + F(g1v, 1) + " > 0 : l'écart g(x) = 0,3 reste positif et ne s'annule jamais. L'hypothèse f([0 ; 1]) ⊂ [0 ; 1] est indispensable.", "warn");
      else nset("<b>" + (anyIv ? "Une infinité de points fixes" : fixed.length === 1 ? "Un point fixe" : fixed.length + " points fixes") + "</b> : " + fixed.slice(0, 4).map(function(z){ return m3isIv(z) ? "f(c) = c pour tout c de [" + F(z.a, 3) + " ; " + F(z.b, 3) + "]" : "f(" + F(z.a, 3) + ") = " + F(z.a, 3); }).join(", ") + (fixed.length > 4 ? "…" : ".") + " g(0) = f(0) = " + F(g0v, 3) + " ≥ 0 et g(1) = f(1) − 1 = " + F(g1v, 3) + " ≤ 0 : la courbe part au-dessus (ou sur) la diagonale et finit au-dessous (ou sur), elle doit la couper. Dessine dans le carré pour essayer de l'éviter !", "ok");
    });
  }
});
})();
