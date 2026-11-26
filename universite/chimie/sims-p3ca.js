/* Chimie BA1 · lot P3-CA (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-echelle-atome · ch-charge-effective · ch-trois-liaisons · ch-gaz-reel · ch-dilutions-cascade
   Fichier autonome : toutes les aides sont ici, préfixe p3. */
(function(){
var PI = Math.PI;

/* ---------- aides de dessin (préfixe p3) ---------- */
function p3hex(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function p3shade(hex, f){
  var c = p3hex(hex);
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(c[0]) + "," + q(c[1]) + "," + q(c[2]) + ")";
}
function p3mix(hex, f){ var c = p3hex(hex); function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); } return "#" + q(c[0]) + q(c[1]) + q(c[2]); }
function p3rgba(hex, a){ var c = p3hex(hex); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
function p3ball(ctx, x, y, r, hex, alpha){
  if (r < 0.4) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, p3shade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, p3shade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
function p3rr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function p3fmt(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
function p3int(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
var SUP = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻"};
function p3sup(n){ return String(n).split("").map(function(c){ return SUP[c] || c; }).join(""); }
/* écriture scientifique en texte simple : 3,7·10⁻¹⁴ */
function p3sci(x, d){
  if (!isFinite(x) || x === 0) return p3fmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (Math.abs(m) >= 9.9995 && d <= 3){ m /= 10; e += 1; }
  return p3fmt(m, d) + "·10" + p3sup(e);
}
function p3font(w, s){ return w + " " + Math.round(s) + "px Mulish, system-ui, sans-serif"; }
function p3text(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = p3font(o.w || 700, o.size || 12); ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.halo){ ctx.lineJoin = "round"; ctx.lineWidth = o.hw || 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.fillText(s, x, y); ctx.restore();
}
function p3tw(ctx, s, size, w){ ctx.save(); ctx.font = p3font(w || 700, size); var m = ctx.measureText(s).width; ctx.restore(); return m; }
/* pastille de texte (fond arrondi) ; renvoie la largeur */
function p3tag(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 11.5;
  ctx.save(); ctx.font = p3font(o.w || 800, size);
  var w = ctx.measureText(s).width + 14, h = size + 10, al = o.align || "center";
  var x0 = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  p3rr(ctx, x0, y - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "rgba(255,255,255,.92)"; ctx.fill();
  if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x0 + w / 2, y + 0.5);
  ctx.restore(); return w;
}
/* texte sur plusieurs lignes dans une largeur donnée ; renvoie le nombre de lignes */
function p3wrap(ctx, s, x, y, maxW, lh, o){
  o = o || {}; ctx.save(); ctx.font = p3font(o.w || 700, o.size || 12);
  var words = s.split(" "), lines = [], cur = "";
  words.forEach(function(wd){ var t = cur ? cur + " " + wd : wd; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = wd; } else cur = t; });
  if (cur) lines.push(cur);
  ctx.restore();
  lines.forEach(function(L, i){ p3text(ctx, L, x, y + i * lh, o); });
  return lines.length;
}
function p3arrow(ctx, x1, y1, x2, y2, col, w, head){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
  var a = Math.atan2(dy, dx), h = Math.min(head || (7 + w * 1.6), L * 0.6);
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
  ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill(); ctx.restore();
}
function p3shadow(ctx, x, y, rx, ry, a){ ctx.save(); ctx.fillStyle = "rgba(0,0,0," + (a || 0.35) + ")"; ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, 7); ctx.fill(); ctx.restore(); }
/* canevas dont la hauteur suit la largeur (plus haut sur téléphone) */
function p3canvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = (w > 0 && w < 480) ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}
/* rotation de vue (lacet a, tangage b) et projection orthographique ou douce */
function p3rot(p, a, b){
  var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1];
  return [x, y * cb - z * sb, y * sb + z * cb];
}
/* glisser sur le canevas pour tourner la vue */
function p3drag(c, st, lim, onStart){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; st.dragMoved = 0; if (onStart) onStart(p); }
    if (type === "drag" && st.lx != null){
      st.a += (p.x - st.lx) * 0.011; st.b += (p.y - st.ly) * 0.011; st.dragMoved += Math.abs(p.x - st.lx) + Math.abs(p.y - st.ly);
      if (lim){ st.a = Math.max(lim[0], Math.min(lim[1], st.a)); st.b = Math.max(lim[2], Math.min(lim[3], st.b)); }
      else st.b = Math.max(-1.45, Math.min(1.45, st.b));
      st.lx = p.x; st.ly = p.y;
    }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
  c.cv.style.cursor = "grab";
}
/* le texte affiché à droite d'un curseur (pour une échelle non linéaire) */
function p3out(sl, html){ var o = sl.el && sl.el.parentNode ? sl.el.parentNode.querySelector("output") : null; if (o) o.innerHTML = html; }
function smooth(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function hash(i, j){ var x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); }

/* =====================================================================
   1. Si l'atome était un stade : zoom du grain de sel au noyau (c01)
   ===================================================================== */
var ME_U = 0.000548579909;            /* masse de l'électron (u) */
var R0_FM = 1.2;                      /* R = r0·A^(1/3), r0 = 1,2 fm */
var PITCH = 105;                      /* longueur d'un terrain de football (m) */
var ION = {
  Na:{sym:"Na⁺", nom:"sodium", Z:11, A:23, ne:10, r:102e-12, m:22.98976928, col:"#8f7cf2", shells:[2, 8], other:"Cl", nuc:"²³Na"},
  Cl:{sym:"Cl⁻", nom:"chlorure", Z:17, A:35, ne:18, r:181e-12, m:34.96885268, col:"#3fbf72", shells:[2, 8, 8], other:"Na", nuc:"³⁵Cl"}
};
ION.Na.R = R0_FM * Math.pow(23, 1 / 3) * 1e-15;
ION.Cl.R = R0_FM * Math.pow(35, 1 / 3) * 1e-15;
function ionMassFrac(I){ var mn = I.m - I.Z * ME_U, mi = mn + I.ne * ME_U; return mn / mi; }
var D_NACL = 282e-12;                 /* distance Na⁺–Cl⁻ (demi-arête de maille, a = 564 pm) */
var GRAIN = 0.5e-3;                   /* arête du grain de sel (m) */
/* unité de longueur lisible */
function p3len(m){
  var u = [[1, "m"], [1e-3, "mm"], [1e-6, "µm"], [1e-9, "nm"], [1e-12, "pm"], [1e-15, "fm"]];
  for (var i = 0; i < u.length; i++) if (m >= u[i][0] * 0.9999) return [m / u[i][0], u[i][1]];
  return [m / 1e-15, "fm"];
}
function p3lenTxt(m){ var q = p3len(m), v = q[0]; return (v >= 100 ? p3int(v) : v >= 10 ? p3fmt(v, 0) : p3fmt(v, v < 1.995 ? 1 : 0)).replace(/,0$/, "") + " " + q[1]; }

SFA.sim({
  id:"ch-echelle-atome", ch:"c01", tag:"Atome",
  titre:"Si l'atome était un stade : le zoom jusqu'au noyau",
  resume:"Un zoom continu, du grain de sel posé sur ton doigt jusqu'au noyau d'un ion, en passant par un cheveu, un globule rouge, un virus et le réseau du cristal. Un stade de foot en surimpression donne l'échelle : le noyau y est un grain de quelques millimètres.",
  but:"Zoome à la molette (ou avec le curseur), ou laisse le zoom automatique descendre de puissance de dix en puissance de dix. Glisse sur l'image pour tourner le grain et le cristal. Choisis l'ion visé (Na⁺ ou Cl⁻) et regarde, avec le stade en surimpression, la taille du noyau par rapport à l'ion et la part de la masse qu'il porte.",
  aRetenir:"Un atome (ou un ion) mesure environ 10⁻¹⁰ m (100 pm) ; son noyau environ 10⁻¹⁵ à 10⁻¹⁴ m (R ≈ 1,2 fm·A^(1/3)). Le noyau est donc 10⁴ à 10⁵ fois plus petit que l'atome : si l'atome faisait la taille d'un stade, le noyau serait un grain de quelques millimètres au rond central. Pourtant il porte plus de 99,9 % de la masse (un proton pèse environ 1836 électrons). L'atome est surtout du vide, occupé par le nuage des électrons.",
  piege:"« Petit » ne veut pas dire « léger » : le noyau occupe un volume ridicule (environ 10⁻¹⁴ du volume de l'ion) mais presque toute la masse ; sa masse volumique, environ 2·10¹⁷ kg/m³, est la même pour tous les noyaux. Autre piège : le nuage électronique n'a pas de bord net ; le rayon d'un ion (102 pm pour Na⁺, 181 pm pour Cl⁻) est une convention tirée des distances dans les cristaux.",
  build:function(k, S){
    var c = p3canvas(k, 0.78, 1.15);
    var st = {t:0, z:-2.6, a:0.42, b:-0.32, auto:true, at:0, spin:0, el:[], lastZ:null};
    var iS = k.seg("Ion visé dans le cristal", [["Na", "Na⁺ (sodium)"], ["Cl", "Cl⁻ (chlorure)"]], "Na", function(){ makeElectrons(); makeNucleus(); });
    var zS = k.slider("Champ de vue (molette sur l'image)", -14.3, -1.8, 0.01, -2.6, "", function(v){ st.z = v; st.auto = false; aT.set(false); });
    var aT = k.toggle("Zoom automatique (aller et retour)", true, function(v){ st.auto = v; if (v){ st.at = segStart(st.z); } });
    var sT = k.toggle("Stade de football en surimpression", true);
    var ro = k.readouts(["Champ de vue", "On voit", "Le noyau sur le stade", "Masse portée par le noyau"]);
    var nt = k.note("", "ok");
    p3drag(c, st, [-0.75, 0.75, -0.7, 0.55]);
    c.cv.addEventListener("wheel", function(e){
      e.preventDefault(); st.auto = false; aT.set(false);
      st.z = Math.max(-14.3, Math.min(-1.8, st.z + (e.deltaY > 0 ? 0.12 : -0.12) * Math.min(3, Math.abs(e.deltaY) / 60 + 0.5)));
      zS.set(st.z); k.redraw();
    }, {passive:false});

    /* ---------- zoom automatique : arrêts sur les objets remarquables ---------- */
    var STOPS = [[-2.6, 2.6], [-3.75, 1.6], [-4.65, 1.6], [-5.3, 1.6], [-6.45, 1.6], [-8.75, 3.2], [-9.55, 4], [-13.85, 4]];
    var PLAN = (function(){
      var p = [], t = 0, i;
      for (i = 0; i < STOPS.length; i++){
        p.push({t0:t, t1:t + STOPS[i][1], z0:STOPS[i][0], z1:STOPS[i][0]}); t += STOPS[i][1];
        var zn = i + 1 < STOPS.length ? STOPS[i + 1][0] : null;
        if (zn != null){ var d = 0.55 + Math.abs(zn - STOPS[i][0]) * 0.55; p.push({t0:t, t1:t + d, z0:STOPS[i][0], z1:zn}); t += d; }
      }
      p.push({t0:t, t1:t + 4.5, z0:STOPS[STOPS.length - 1][0], z1:STOPS[0][0]}); t += 4.5;
      p.T = t; return p;
    })();
    function planZ(t){ t = t % PLAN.T; for (var i = 0; i < PLAN.length; i++){ var q = PLAN[i]; if (t < q.t1) return q.z0 + (q.z1 - q.z0) * smooth((t - q.t0) / (q.t1 - q.t0)); } return STOPS[0][0]; }
    /* reprendre le zoom automatique depuis l'arrêt le plus proche */
    function segStart(z){ var best = 0, bd = 1e9; PLAN.forEach(function(q){ if (q.z0 === q.z1 && Math.abs(q.z0 - z) < bd){ bd = Math.abs(q.z0 - z); best = q.t0; } }); return best; }

    /* ---------- électrons de l'ion et nucléons du noyau ---------- */
    function makeElectrons(){
      var I = ION[iS.value], rs = I.shells.length === 2 ? [0.16, 0.62] : [0.1, 0.36, 0.86];
      st.el = [];
      I.shells.forEach(function(n, s){
        for (var i = 0; i < n; i++){
          var u = Math.random() * 2 - 1, ph = Math.random() * 2 * PI, q = Math.sqrt(1 - u * u);
          var ax = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], al = Math.hypot(ax[0], ax[1], ax[2]) || 1;
          st.el.push({p:[q * Math.cos(ph), u, q * Math.sin(ph)], ax:[ax[0] / al, ax[1] / al, ax[2] / al], w:2.2 + Math.random() * 2.5, r:rs[s] * I.r, j:Math.random() * 10});
        }
      });
    }
    function makeNucleus(){
      var I = ION[iS.value], A = I.A, Rf = I.R * 1e15, rn = 0.86, Re = Math.max(0.4, Rf - rn * 0.55), ga = PI * (3 - Math.sqrt(5));
      var pts = [];
      for (var i = 0; i < A; i++){
        var r = Re * Math.pow((i + 0.5) / A, 1 / 3), y = 1 - 2 * (i + 0.5) / A, q = Math.sqrt(1 - y * y), th = ga * i * 7.3;
        pts.push({p:[r * q * Math.cos(th), r * y, r * q * Math.sin(th)], pr:false});
      }
      /* protons répartis de façon régulière parmi les nucléons */
      var idx = pts.map(function(_, i){ return i; }).sort(function(a, b){ return hash(a, 3) - hash(b, 3); });
      for (var j = 0; j < I.Z; j++) pts[idx[j]].pr = true;
      st.nuc = pts;
    }
    makeElectrons(); makeNucleus();
    /* rotation d'un vecteur autour d'un axe unitaire (Rodrigues) */
    function rotAx(v, a, th){
      var c0 = Math.cos(th), s0 = Math.sin(th), d = v[0] * a[0] + v[1] * a[1] + v[2] * a[2];
      return [v[0] * c0 + (a[1] * v[2] - a[2] * v[1]) * s0 + a[0] * d * (1 - c0), v[1] * c0 + (a[2] * v[0] - a[0] * v[2]) * s0 + a[1] * d * (1 - c0), v[2] * c0 + (a[0] * v[1] - a[1] * v[0]) * s0 + a[2] * d * (1 - c0)];
    }

    var lp = k.loop(function(dt){
      st.t += dt; st.spin += dt;
      if (st.auto && !st.drag){ st.at += dt; st.z = planZ(st.at); zS.set(st.z); }
      st.el.forEach(function(e){ e.p = rotAx(e.p, e.ax, e.w * dt); });
      k.redraw();
    });
    lp.play();

    /* ---------- dessin ---------- */
    function P(x, y, z){ return p3rot([x, y, z], st.a, st.b); }
    function drawSkin(ctx, W, H, s, cx, cy){
      /* plan de travail sombre derrière le doigt */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#26354d"); bg.addColorStop(1, "#141d2c");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var fx = cx - 1.2e-3 * s, fy = cy + 3.6e-3 * s, FR = 8.2e-3 * s;
      if (FR > 3 * Math.max(W, H) + Math.hypot(fx - cx, fy - cy)){ ctx.fillStyle = "#e7b39a"; ctx.fillRect(0, 0, W, H); }
      else {
        var sg = ctx.createRadialGradient(fx - FR * 0.3, fy - FR * 0.45, FR * 0.1, fx, fy, FR);
        sg.addColorStop(0, "#f4c9b1"); sg.addColorStop(0.7, "#e2a98f"); sg.addColorStop(1, "#b97761");
        p3shadow(ctx, fx + FR * 0.05, fy + FR * 0.08, FR * 1.02, FR * 0.98, 0.35);
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(fx, fy, FR, 0, 7); ctx.fill();
      }
      /* crêtes de l'empreinte digitale (0,45 mm d'écart) */
      var sp = 0.45e-3 * s;
      if (sp > 3){
        ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, Math.min(FR, 1e6), 0, 7); ctx.clip();
        ctx.strokeStyle = "rgba(150,85,65," + Math.min(0.3, (sp - 3) / 25) + ")"; ctx.lineWidth = Math.max(0.8, sp * 0.12);
        var dC = Math.hypot(cx - fx, cy - fy), rmin = Math.max(sp, dC - Math.hypot(W, H)), rmax = Math.min(FR, dC + Math.hypot(W, H));
        var n0 = Math.floor(rmin / sp), n1 = Math.min(n0 + 400, Math.ceil(rmax / sp));
        for (var n = n0; n <= n1; n++){
          ctx.beginPath();
          for (var q = 0; q <= 72; q++){ var th = q / 72 * 2 * PI, rr = n * sp * (1 + 0.035 * Math.sin(th * 3 + n * 0.7) + 0.02 * Math.sin(th * 7 + n)); var xx = fx + Math.cos(th) * rr * 1.05, yy = fy + Math.sin(th) * rr * 0.93; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
          ctx.stroke();
        }
        ctx.restore();
      }
    }
    /* grain de sel : cube de 0,5 mm ; le point visé (centre de la face avant) reste au centre de l'écran */
    var LIGHT = [-0.4, 0.55, 0.73];
    function faceShade(n){ var l = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]; return Math.max(0, l); }
    function faceColor(n){ var f = faceShade(n); return [Math.round(176 + 70 * f), Math.round(188 + 62 * f), Math.round(204 + 50 * f)]; }
    function drawGrain(ctx, W, H, s, cx, cy){
      var L = GRAIN, h = L / 2, Lp = L * s;
      var nF = P(0, 0, 1), fc = faceColor(nF);
      if (Lp > 9 * Math.max(W, H)){
        /* on est « dans » la face avant : un plan de cristal qui remplit l'écran */
        var g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "rgb(" + Math.min(255, fc[0] + 12) + "," + Math.min(255, fc[1] + 10) + "," + Math.min(255, fc[2] + 6) + ")");
        g.addColorStop(1, "rgb(" + (fc[0] - 14) + "," + (fc[1] - 12) + "," + (fc[2] - 8) + ")");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); return fc;
      }
      if (Lp < 0.6) return fc;
      var V = [];
      for (var i = 0; i < 8; i++){ var x = i & 1 ? h : -h, y = i & 2 ? h : -h, z = i & 4 ? 0 : -L; var q = P(x, y, z); V.push([cx + q[0] * s, cy - q[1] * s]); }
      var F = [[[0, 1, 3, 2], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, 1]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 3, 7, 6], [0, 1, 0]], [[0, 2, 6, 4], [-1, 0, 0]], [[1, 3, 7, 5], [1, 0, 0]]];
      /* ombre portée sur la peau */
      var q0 = P(0, -h, -L / 2);
      p3shadow(ctx, cx + q0[0] * s + Lp * 0.22, cy - q0[1] * s + Lp * 0.42, Lp * 0.75, Lp * 0.3, 0.28);
      F.forEach(function(f){
        var n = P(f[1][0], f[1][1], f[1][2]); if (n[2] <= 0.001) return;
        var col = faceColor(n);
        ctx.beginPath(); f[0].forEach(function(vi, j){ j ? ctx.lineTo(V[vi][0], V[vi][1]) : ctx.moveTo(V[vi][0], V[vi][1]); }); ctx.closePath();
        var g2 = ctx.createLinearGradient(V[f[0][0]][0], V[f[0][0]][1], V[f[0][2]][0], V[f[0][2]][1]);
        g2.addColorStop(0, "rgba(" + Math.min(255, col[0] + 18) + "," + Math.min(255, col[1] + 16) + "," + Math.min(255, col[2] + 10) + ",.97)");
        g2.addColorStop(1, "rgba(" + (col[0] - 12) + "," + (col[1] - 10) + "," + (col[2] - 6) + ",.97)");
        ctx.fillStyle = g2; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = Math.max(0.6, Math.min(2.5, Lp * 0.01)); ctx.stroke();
      });
      /* reflet sur l'arête supérieure */
      if (Lp > 20){ ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = Math.min(3, Lp * 0.012); ctx.beginPath(); ctx.moveTo(V[6][0], V[6][1]); ctx.lineTo(V[7][0], V[7][1]); ctx.stroke(); }
      return fc;
    }
    /* objets de comparaison posés sur la face, à leur vraie taille */
    var CMP = [
      {nom:"cheveu", d:70e-6, x:62e-6, y:10e-6, kind:"hair"},
      {nom:"globule rouge", d:7.5e-6, x:-5.5e-6, y:-2.4e-6, kind:"rbc"},
      {nom:"bactérie", d:2e-6, x:1.9e-6, y:1.15e-6, kind:"bact"},
      {nom:"virus", d:100e-9, x:105e-9, y:-55e-9, kind:"virus"}
    ];
    function drawCompare(ctx, W, H, s, cx, cy, ph){
      var ex = P(1, 0, 0), ey = P(0, 1, 0), lab = null;
      CMP.forEach(function(o){
        var dp = o.d * s; if (dp < 2.5 || dp > 4 * W) return;
        var X = cx + (o.x * ex[0] + o.y * ey[0]) * s, Y = cy - (o.x * ex[1] + o.y * ey[1]) * s, r = dp / 2;
        ctx.save();
        if (o.kind === "hair"){
          var ang = -1.05;
          ctx.translate(X, Y); ctx.rotate(ang);
          p3shadow(ctx, r * 0.35, r * 0.5, 30 * r, r * 0.9, 0.22);
          var g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, "#7a5133"); g.addColorStop(0.35, "#c08a5c"); g.addColorStop(1, "#3c2413");
          ctx.fillStyle = g; ctx.fillRect(-30 * r, -r, 60 * r, 2 * r);
          /* écailles de la cuticule */
          ctx.strokeStyle = "rgba(40,20,8,.35)"; ctx.lineWidth = Math.max(0.6, r * 0.04);
          for (var i = -30; i <= 30; i += 1.1){ ctx.beginPath(); ctx.moveTo(i * r, -r); ctx.quadraticCurveTo(i * r + r * 0.5, 0, i * r, r); ctx.stroke(); }
          lab = {t:o.nom + " (" + p3lenTxt(o.d) + " d'épaisseur)", x:X, y:Y, r:r, dp:dp};
        } else if (o.kind === "rbc"){
          p3shadow(ctx, X + r * 0.2, Y + r * 0.35, r * 1.02, r * 0.55, 0.25);
          var g3 = ctx.createRadialGradient(X - r * 0.3, Y - r * 0.4, r * 0.1, X, Y, r);
          g3.addColorStop(0, "#f0626a"); g3.addColorStop(0.75, "#c3192b"); g3.addColorStop(1, "#7d0b19");
          ctx.fillStyle = g3; ctx.beginPath(); ctx.ellipse(X, Y, r, r * 0.92, 0.3, 0, 7); ctx.fill();
          ctx.fillStyle = "rgba(90,0,10,.35)"; ctx.beginPath(); ctx.ellipse(X + r * 0.05, Y + r * 0.04, r * 0.45, r * 0.4, 0.3, 0, 7); ctx.fill();
          lab = {t:o.nom + " (" + p3lenTxt(o.d) + ")", x:X, y:Y, r:r, dp:dp};
        } else if (o.kind === "bact"){
          ctx.translate(X, Y); ctx.rotate(0.5);
          var L = r, w = r * 0.25;
          p3shadow(ctx, w * 0.4, w * 0.9, L, w * 0.9, 0.25);
          var g4 = ctx.createLinearGradient(0, -w, 0, w); g4.addColorStop(0, "#a8d86a"); g4.addColorStop(1, "#4d7d1e");
          ctx.fillStyle = g4; p3rr(ctx, -L, -w, 2 * L, 2 * w, w); ctx.fill();
          ctx.strokeStyle = "rgba(60,90,20,.6)"; ctx.lineWidth = Math.max(0.6, w * 0.08);
          for (var f = 0; f < 4; f++){ ctx.beginPath(); ctx.moveTo(L * 0.9, 0); for (var u = 0; u <= 1; u += 0.1) ctx.lineTo(L * 0.9 + u * L * 0.9, Math.sin(u * 9 + ph * 6 + f) * w * 0.6 + (f - 1.5) * w * 0.5); ctx.stroke(); }
          lab = {t:o.nom + " (" + p3lenTxt(o.d) + " de long)", x:X, y:Y, r:r * 0.6, dp:dp};
        } else {
          for (var q = 0; q < 14; q++){ var aa = q / 14 * 2 * PI; ctx.strokeStyle = "#7f3f8f"; ctx.lineWidth = Math.max(0.6, r * 0.06); ctx.beginPath(); ctx.moveTo(X + Math.cos(aa) * r * 0.8, Y + Math.sin(aa) * r * 0.8); ctx.lineTo(X + Math.cos(aa) * r * 1.15, Y + Math.sin(aa) * r * 1.15); ctx.stroke(); p3ball(ctx, X + Math.cos(aa) * r * 1.18, Y + Math.sin(aa) * r * 1.18, r * 0.09, "#c25ad1"); }
          p3ball(ctx, X, Y, r * 0.85, "#a24cb3");
          lab = {t:o.nom + " (" + p3lenTxt(o.d) + ")", x:X, y:Y, r:r, dp:dp};
        }
        ctx.restore();
        if (lab && lab.dp > 14 && lab.dp < 1.6 * W){
          var fs = W < 480 ? 10.5 : 12, ty = Math.min(H - 52, Math.max(48, lab.y + Math.min(lab.r, H * 0.3) + 16));
          var tw = p3tw(ctx, lab.t, fs, 800) + 14, tx = Math.max(tw / 2 + 6, Math.min(W - tw / 2 - 6, lab.x));
          p3tag(ctx, lab.t, tx, ty, {size:fs, bg:"rgba(15,27,45,.78)", color:"#fff"});
        }
        lab = null;
      });
    }
    /* réseau Na⁺/Cl⁻ : motif plat quand les ions sont petits, en 3D quand ils sont grands */
    function drawLattice(ctx, W, H, s, cx, cy, fadeT){
      var I = ION[iS.value], J = ION[I.other], sp = D_NACL * s;
      if (sp < 3) return;
      var ex = P(1, 0, 0), ey = P(0, 1, 0), ez = P(0, 0, 1);
      var aIn = Math.min(1, (sp - 3) / 8);
      var n = Math.min(60, Math.ceil(Math.max(W, H) * 0.75 / sp / 0.72) + 1);
      if (sp < 22){
        /* motif de la face, en carrés ou petits disques */
        ctx.save(); ctx.globalAlpha = aIn * 0.9;
        for (var i = -n; i <= n; i++) for (var j = -n; j <= n; j++){
          var X = cx + (i * ex[0] + j * ey[0]) * sp, Y = cy - (i * ex[1] + j * ey[1]) * sp;
          if (X < -sp || X > W + sp || Y < -sp || Y > H + sp) continue;
          var tgt = (i + j) % 2 === 0, R = (tgt ? I.r : J.r) * s;
          ctx.fillStyle = tgt ? I.col : J.col;
          if (sp < 9) ctx.fillRect(X - R * 0.7, Y - R * 0.7, R * 1.4, R * 1.4); else { ctx.beginPath(); ctx.arc(X, Y, R, 0, 7); ctx.fill(); }
        }
        ctx.restore(); return;
      }
      /* boules en volume, sur 3 couches (2 seulement si beaucoup d'ions) */
      var nn = Math.min(n, 9), depth = nn > 6 ? 2 : 3, list = [];
      for (var kz = 0; kz > -depth; kz--) for (var i2 = -nn; i2 <= nn; i2++) for (var j2 = -nn; j2 <= nn; j2++){
        var t2 = ((i2 + j2 + kz) % 2 + 2) % 2 === 0, center = i2 === 0 && j2 === 0 && kz === 0;
        var X2 = cx + (i2 * ex[0] + j2 * ey[0] + kz * ez[0]) * sp, Y2 = cy - (i2 * ex[1] + j2 * ey[1] + kz * ez[1]) * sp;
        var R2 = (t2 ? I.r : J.r) * s;
        if (X2 < -R2 || X2 > W + R2 || Y2 < -R2 || Y2 > H + R2) continue;
        list.push({x:X2, y:Y2, z:i2 * ex[2] + j2 * ey[2] + kz * ez[2], r:R2, col:t2 ? I.col : J.col, c:center, dk:-kz});
      }
      list.sort(function(a, b){ return a.z - b.z; });
      list.forEach(function(b){
        var al = b.c ? 1 - fadeT.center : (1 - fadeT.nb) * aIn;
        if (al <= 0.01) return;
        p3ball(ctx, b.x, b.y, b.r, b.dk ? p3mix(b.col, -0.28 * b.dk) : b.col, al);
      });
      /* légende des ions quand on les distingue bien */
      if (sp > 40 && fadeT.nb < 0.6) legendRow(ctx, W, H, [[I.col, I.sym + " (" + p3int(I.r * 1e12) + " pm)"], [J.col, J.sym + " (" + p3int(J.r * 1e12) + " pm)"]]);
    }
    /* terrain de football : longueur 105 m = diamètre de l'ion ; vu de dessus, centre = noyau */
    function drawPitch(ctx, W, H, sm, cx, cy, al){
      /* sm : pixels par mètre « de stade » */
      if (al <= 0.01) return;
      ctx.save(); ctx.globalAlpha = al;
      function X(x){ return cx + x * sm; } function Y(y){ return cy - y * sm; }
      var Lh = 52.5, Wh = 34;
      /* tribunes */
      var tb = 22;
      if ((Lh + tb) * sm < 6 * Math.max(W, H)){
        var gt = ctx.createLinearGradient(0, Y(Wh + tb), 0, Y(-Wh - tb)); gt.addColorStop(0, "#56637a"); gt.addColorStop(0.5, "#7a879d"); gt.addColorStop(1, "#46526a");
        ctx.fillStyle = gt; p3rr(ctx, X(-Lh - tb), Y(Wh + tb), (2 * Lh + 2 * tb) * sm, (2 * Wh + 2 * tb) * sm, 14 * sm); ctx.fill();
        if (sm > 0.8){ ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1; for (var r = 3; r < tb; r += 3){ p3rr(ctx, X(-Lh - r), Y(Wh + r), (2 * Lh + 2 * r) * sm, (2 * Wh + 2 * r) * sm, (2 + r * 0.5) * sm); ctx.stroke(); } }
      }
      /* pelouse rayée */
      var x0 = Math.max(-Lh - 3, (0 - cx) / sm), x1 = Math.min(Lh + 3, (W - cx) / sm);
      ctx.fillStyle = "#2f8a3e"; ctx.fillRect(X(-Lh - 3), Y(Wh + 3), (2 * Lh + 6) * sm, (2 * Wh + 6) * sm);
      var bw = 105 / 18;
      for (var b = 0; b < 18; b++){ var bx = -Lh + b * bw; if (bx + bw < x0 || bx > x1) continue; if (b % 2){ ctx.fillStyle = "#37984a"; ctx.fillRect(X(bx), Y(Wh), bw * sm, 2 * Wh * sm); } }
      /* lignes blanches (12 cm de large) */
      ctx.strokeStyle = "rgba(255,255,255,.92)"; ctx.lineWidth = Math.max(1, 0.12 * sm);
      if (Lh * sm < 8 * Math.max(W, H)){
        ctx.strokeRect(X(-Lh), Y(Wh), 2 * Lh * sm, 2 * Wh * sm);
        ctx.beginPath(); ctx.moveTo(X(0), Y(Wh)); ctx.lineTo(X(0), Y(-Wh)); ctx.stroke();
        [-1, 1].forEach(function(sd){
          ctx.strokeRect(sd < 0 ? X(-Lh) : X(Lh - 16.5), Y(20.16), 16.5 * sm, 40.32 * sm);
          ctx.strokeRect(sd < 0 ? X(-Lh) : X(Lh - 5.5), Y(9.16), 5.5 * sm, 18.32 * sm);
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X(sd * (Lh - 11)), Y(0), Math.max(1.2, 0.11 * sm), 0, 7); ctx.fill();
          ctx.fillStyle = "#f2f2f2"; ctx.fillRect(sd < 0 ? X(-Lh - 2) : X(Lh), Y(3.66), 2 * sm, 7.32 * sm);
        });
      }
      if (Lh * sm >= 8 * Math.max(W, H) && 0.12 * sm < 8){ ctx.beginPath(); ctx.moveTo(X(0), Math.max(-10, Y(Wh))); ctx.lineTo(X(0), Math.min(H + 10, Y(-Wh))); ctx.stroke(); }
      if (9.15 * sm < 60 * Math.max(W, H) && 0.12 * sm < 8){ ctx.beginPath(); ctx.arc(X(0), Y(0), 9.15 * sm, 0, 7); ctx.stroke(); }
      /* point central : 22 cm de diamètre (le noyau y est un grain de quelques mm) */
      ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(X(0), Y(0), Math.max(1.5, 0.11 * sm), 0, 7); ctx.fill();
      ctx.restore();

    }
    function drawCloud(ctx, W, H, s, cx, cy, al){
      var I = ION[iS.value], R = I.r * s;
      if (al <= 0.01) return;
      ctx.save(); ctx.globalAlpha = al;
      var lim = Math.min(R * 1.35, 30 * Math.max(W, H));
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, lim);
      var rgb = p3hex(I.col).join(",");
      function cs(u){ return Math.max(0, Math.min(1, u * R / lim)); }
      g.addColorStop(0, "rgba(" + rgb + ",.55)"); g.addColorStop(cs(0.14), "rgba(" + rgb + ",.42)");
      g.addColorStop(cs(0.75), "rgba(" + rgb + ",.22)"); g.addColorStop(cs(1.35), "rgba(" + rgb + ",0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, lim, 0, 7); ctx.fill();
      /* bord conventionnel de l'ion */
      if (R < 3 * Math.max(W, H)){ ctx.setLineDash([5, 5]); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
      /* électrons qui s'agitent */
      st.el.forEach(function(e, i){
        var q = p3rot(e.p, st.a, st.b), rr = e.r * (1 + 0.18 * Math.sin(st.t * 3 + e.j)) * s;
        var X = cx + q[0] * rr, Y = cy - q[1] * rr;
        if (X < -10 || X > W + 10 || Y < -10 || Y > H + 10) return;
        var gl = ctx.createRadialGradient(X, Y, 0, X, Y, 7); gl.addColorStop(0, "rgba(160,220,255,.9)"); gl.addColorStop(1, "rgba(160,220,255,0)");
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(X, Y, 7, 0, 7); ctx.fill();
        ctx.fillStyle = "#e9f6ff"; ctx.beginPath(); ctx.arc(X, Y, 2.1, 0, 7); ctx.fill();
      });
      ctx.restore();
    }
    function drawNucleus(ctx, W, H, s, cx, cy){
      var I = ION[iS.value], Rp = I.R * s;
      if (Rp < 2.5){
        /* trop petit pour être vu : un point repère */
        ctx.fillStyle = "rgba(255,90,70,.95)"; ctx.beginPath(); ctx.arc(cx, cy, 1.6, 0, 7); ctx.fill();
        return;
      }
      var a = st.a + st.spin * 0.5, b = st.b * 0.5 + 0.3, sc = 1e-15 * s;
      var list = st.nuc.map(function(n){ var q = p3rot(n.p, a, b); return {x:cx + q[0] * sc, y:cy - q[1] * sc, z:q[2], pr:n.pr}; });
      list.sort(function(u, v){ return u.z - v.z; });
      var gl = ctx.createRadialGradient(cx, cy, Rp * 0.5, cx, cy, Rp * 2.4); gl.addColorStop(0, "rgba(255,150,110,.35)"); gl.addColorStop(1, "rgba(255,150,110,0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, Rp * 2.4, 0, 7); ctx.fill();
      list.forEach(function(n){ p3ball(ctx, n.x, n.y, 0.86 * sc, n.pr ? "#e0483e" : "#9aa8bc"); });
      if (Rp > 50) legendRow(ctx, W, H, [["#e0483e", I.Z + " protons"], ["#9aa8bc", (I.A - I.Z) + " neutrons"]]);
    }
    /* légende en bas : à droite de l'échelle si la place suffit, sinon au-dessus */
    function legendRow(ctx, W, H, items){
      var fs = W < 480 ? 10.5 : 12, ws = items.map(function(it){ return p3tw(ctx, it[1], fs, 800) + 30; }), tot = ws.reduce(function(a, b){ return a + b; }, 0) + 8 * (items.length - 1);
      var right = tot < W - 190, x = right ? W - 12 - tot : 10, y = right ? H - 23 : H - 64;
      items.forEach(function(it, i){
        p3tag(ctx, "    " + it[1], x, y, {align:"left", size:fs, bg:"rgba(15,27,45,.82)", color:"#fff"});
        ctx.fillStyle = it[0]; ctx.beginPath(); ctx.arc(x + 13, y, 5, 0, 7); ctx.fill();
        x += ws[i] + 8;
      });
    }
    function scaleBar(ctx, W, H, s, light){
      var target = Math.min(150, W * 0.28) / s, e = Math.floor(Math.log10(target)), m = target / Math.pow(10, e);
      var nice = m >= 5 ? 5 : m >= 2 ? 2 : 1, L = nice * Math.pow(10, e), Lp = L * s;
      var x0 = 14, y0 = H - 18, col = light ? "#0f1b2d" : "#fff";
      ctx.save(); ctx.fillStyle = light ? "rgba(255,255,255,.78)" : "rgba(10,16,28,.6)"; p3rr(ctx, x0 - 8, y0 - 28, Math.max(Lp, p3tw(ctx, p3lenTxt(L), 12, 800)) + 16, 38, 8); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0 - 6); ctx.lineTo(x0, y0); ctx.lineTo(x0 + Lp, y0); ctx.lineTo(x0 + Lp, y0 - 6); ctx.stroke();
      p3text(ctx, p3lenTxt(L), x0 + Lp / 2, y0 - 14, {size:12, color:col, w:800});
      ctx.restore();
    }

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      var I = ION[iS.value], z = st.z, Wf = Math.pow(10, z), s = W / Wf, cx = W / 2, cy = H / 2;
      ctx.clearRect(0, 0, W, H);
      drawSkin(ctx, W, H, s, cx, cy);
      drawGrain(ctx, W, H, s, cx, cy);
      var inFace = GRAIN * s > 9 * Math.max(W, H);
      if (GRAIN * s > 1.2 * Math.max(W, H)) drawCompare(ctx, W, H, s, cx, cy, st.t);
      /* transitions réseau → ion → noyau (selon la taille de l'ion à l'écran) */
      var Rion = I.r * s, fr = Rion / W;
      var fadeT = {center:smooth((fr - 0.09) / 0.08), nb:smooth((fr - 0.16) / 0.22)};
      var dark = smooth((fr - 0.12) / 0.2);
      if (dark > 0){ ctx.fillStyle = "rgba(8,12,22," + (0.92 * dark) + ")"; ctx.fillRect(0, 0, W, H); }
      var stadium = sT.value ? smooth((fr - 0.16) / 0.12) : 0;
      /* pixels par mètre du stade : le terrain (105 m) = diamètre de l'ion */
      var sm = 2 * I.r * s / PITCH;
      drawPitch(ctx, W, H, sm, cx, cy, stadium * 0.72);
      if (inFace || GRAIN * s > 3 * W) drawLattice(ctx, W, H, s, cx, cy, fadeT);
      drawCloud(ctx, W, H, s, cx, cy, fadeT.center);
      if (fr > 0.08) drawNucleus(ctx, W, H, s, cx, cy);
      var rs = 0.11 * sm;
      if (stadium > 0.3 && rs > 18 && rs < 0.42 * Math.min(W, H)) p3tag(ctx, "point central du terrain (22 cm de diamètre)", cx, cy + rs + 18, {size:ph ? 10.5 : 12, bg:"rgba(255,255,255,.92)", color:"#14532d"});
      if (fr > 0.08 && I.R * s < 2.5){
        var fs0 = ph ? 10.5 : 12;
        p3tag(ctx, "noyau ici (trop petit pour être vu)", cx, cy - 22, {size:fs0, bg:"rgba(15,27,45,.8)", color:"#ffb4a8"});
      }
      /* ---- compteur de puissances de dix ---- */
      var e10 = Math.round(z);
      ctx.save(); ctx.fillStyle = "rgba(10,16,28,.72)"; p3rr(ctx, 10, 10, ph ? 150 : 178, ph ? 50 : 56, 10); ctx.fill(); ctx.restore();
      p3text(ctx, "10" + p3sup(e10) + " m", 22, ph ? 30 : 33, {size:ph ? 21 : 24, color:"#fff", w:800, align:"left"});
      p3text(ctx, "champ de vue : " + p3lenTxt(Wf), 22, ph ? 50 : 55, {size:ph ? 10 : 11, color:"#b9c8dd", w:700, align:"left"});
      scaleBar(ctx, W, H, s, false);
      /* ---- légende du stade ---- */
      var cap = null, cal = 1;
      if (I.R * s > 50) cap = "Noyau " + I.nuc + " : R ≈ 1,2 fm × " + I.A + "^(1/3) ≈ " + p3fmt(I.R * 1e15, 1) + " fm. Il porte " + p3fmt(ionMassFrac(I) * 100, 2) + " % de la masse de l'ion.";
      else if (stadium > 0.3){ cap = "Si l'ion " + I.sym + " mesurait 105 m (un terrain de foot), son noyau serait un grain de " + p3fmt(PITCH * I.R / I.r * 1000, 1) + " mm au point central."; cal = Math.min(1, (stadium - 0.3) / 0.3); }
      if (cap){
        ctx.save(); ctx.globalAlpha = cal;
        var fs = ph ? 11 : 12, bw = Math.min(W - 20, 440), lh = fs + 4;
        ctx.font = p3font(800, fs);
        var words = cap.split(" "), nl = 1, cur = "";
        words.forEach(function(wd){ var t = cur ? cur + " " + wd : wd; if (ctx.measureText(t).width > bw - 20 && cur){ nl++; cur = wd; } else cur = t; });
        var bh = nl * lh + 12, by = ph ? 66 : 72, bx = 10;
        ctx.fillStyle = "rgba(255,255,255,.93)"; p3rr(ctx, bx, by, bw, bh, 10); ctx.fill();
        p3wrap(ctx, cap, bx + 10, by + 6 + lh / 2, bw - 20, lh, {size:fs, color:"#14532d", w:800, align:"left"});
        ctx.restore();
      }
      /* ---- afficheurs ---- */
      var eTxt = "10" + p3sup(e10) + " m (" + p3lenTxt(Wf) + ")";
      var what;
      if (GRAIN * s < 0.9 * W) what = "un grain de sel sur ton doigt";
      else if (D_NACL * s < 4 || !inFace){
        var near = null; CMP.forEach(function(o){ var dp = o.d * s; if (dp > 14 && dp < 1.6 * W) near = o; });
        what = near ? "la face du grain et un " + near.nom : !inFace ? "le grain de sel (cube de 0,5 mm)" : "la face du grain, plate à cette échelle";
      }
      else if (fr < 0.13) what = "le réseau cristallin Na⁺ / Cl⁻";
      else if (I.R * s < 2.5) what = "l'ion " + I.sym + " : " + I.ne + " électrons et du vide";
      else what = "le noyau " + I.nuc + " : " + I.Z + " p + " + (I.A - I.Z) + " n";
      ro.set(0, eTxt); ro.set(1, what);
      ro.set(2, p3fmt(PITCH * I.R / I.r * 1000, 1) + " mm sur 105 m");
      ro.set(3, p3fmt(ionMassFrac(I) * 100, 3) + " %");
      var ratio = I.r / I.R, vol = Math.pow(I.R / I.r, 3);
      nt.set("Ion " + I.sym + " : rayon " + p3int(I.r * 1e12) + " pm ; noyau " + I.nuc + " : R ≈ " + p3fmt(I.R * 1e15, 2) + " fm, soit " + p3int(Math.round(ratio / 100) * 100) + " fois plus petit. Le noyau occupe " + p3sci(vol, 1) + " du volume de l'ion mais porte " + p3fmt(ionMassFrac(I) * 100, 3) + " % de sa masse : l'ion est presque entièrement vide. <i>Les objets sont à l'échelle ; la position des électrons est une image du nuage, pas une trajectoire.</i>", "ok");
      p3out(zS, "10" + p3sup(e10) + " m");
    });
  }
});

/* =====================================================================
   2. Charge effective : ce que voit l'électron externe (L03)
   ===================================================================== */
/* sh : électrons par couche n ; r : rayon atomique calculé (pm, Clementi et al. 1967) */
var ZE = {
  Li:{Z:3, sh:[2, 1], r:167, cfg:"[He] 2s¹"}, Be:{Z:4, sh:[2, 2], r:112, cfg:"[He] 2s²"}, B:{Z:5, sh:[2, 3], r:87, cfg:"[He] 2s² 2p¹"},
  C:{Z:6, sh:[2, 4], r:67, cfg:"[He] 2s² 2p²"}, N:{Z:7, sh:[2, 5], r:56, cfg:"[He] 2s² 2p³"}, O:{Z:8, sh:[2, 6], r:48, cfg:"[He] 2s² 2p⁴"},
  F:{Z:9, sh:[2, 7], r:42, cfg:"[He] 2s² 2p⁵"}, Ne:{Z:10, sh:[2, 8], r:38, cfg:"[He] 2s² 2p⁶"},
  Na:{Z:11, sh:[2, 8, 1], r:190, cfg:"[Ne] 3s¹"}, Mg:{Z:12, sh:[2, 8, 2], r:145, cfg:"[Ne] 3s²"}, Al:{Z:13, sh:[2, 8, 3], r:118, cfg:"[Ne] 3s² 3p¹"},
  Si:{Z:14, sh:[2, 8, 4], r:111, cfg:"[Ne] 3s² 3p²"}, P:{Z:15, sh:[2, 8, 5], r:98, cfg:"[Ne] 3s² 3p³"}, S:{Z:16, sh:[2, 8, 6], r:88, cfg:"[Ne] 3s² 3p⁴"},
  Cl:{Z:17, sh:[2, 8, 7], r:79, cfg:"[Ne] 3s² 3p⁵"}, Ar:{Z:18, sh:[2, 8, 8], r:71, cfg:"[Ne] 3s² 3p⁶"},
  K:{Z:19, sh:[2, 8, 8, 1], r:243, cfg:"[Ar] 4s¹"}, Rb:{Z:37, sh:[2, 8, 18, 8, 1], r:265, cfg:"[Kr] 5s¹"}, Cs:{Z:55, sh:[2, 8, 18, 18, 8, 1], r:298, cfg:"[Xe] 6s¹"},
  Br:{Z:35, sh:[2, 8, 18, 7], r:94, cfg:"[Ar] 3d¹⁰ 4s² 4p⁵"}, I:{Z:53, sh:[2, 8, 18, 18, 7], r:115, cfg:"[Kr] 4d¹⁰ 5s² 5p⁵"}
};
var ZROWS = {
  p2:{lab:"période 2", els:["Li", "Be", "B", "C", "N", "O", "F", "Ne"]},
  p3:{lab:"période 3", els:["Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"]},
  g1:{lab:"groupe 1", els:["Li", "Na", "K", "Rb", "Cs"]},
  g17:{lab:"groupe 17", els:["F", "Cl", "Br", "I"]}
};
/* règles de Slater pour un électron de la couche n (s, p) : 0,35 même couche, 0,85 couche n−1, 1 en dessous */
function slater(sh, n){
  var i = n - 1, S = 0.35 * (sh[i] - 1) - (n === 1 && sh[0] === 2 ? 0.05 : 0);
  if (i >= 1) S += 0.85 * sh[i - 1];
  for (var j = 0; j < i - 1; j++) S += sh[j];
  return S;
}
var NSTAR = [1, 2, 3, 3.7, 4, 4.2];
var A0_PM = 52.92;
function zeffOf(sym){ var E = ZE[sym], n = E.sh.length, S = slater(E.sh, n); return {S:S, Zeff:E.Z - S, n:n, core:E.Z - E.sh[n - 1], val:E.sh[n - 1]}; }

SFA.sim({
  id:"ch-charge-effective", ch:"L03", tag:"Tableau périodique",
  titre:"Charge effective : ce que voit l'électron externe",
  resume:"Un noyau +Z, le nuage des électrons internes qui fait écran et un électron externe qui tourne autour. Avance le long d'une période ou descends une colonne : Zeff et le rayon changent, et l'orbite se resserre ou s'élargit.",
  but:"Choisis un parcours (période 2 ou 3, groupe 1 ou 17), puis clique sur une case du bandeau (ou laisse le parcours automatique). Regarde les trois barres : Z (le noyau), S (l'écran des électrons internes et voisins) et Zeff = Z − S, ce que « voit » vraiment l'électron externe. Glisse sur l'atome pour le tourner.",
  aRetenir:"Zeff = Z − S. Le long d'une période, Z augmente de 1 mais l'écran S n'augmente que de 0,35 (un électron de la même couche protège mal) : Zeff monte, l'électron externe est plus attiré, le rayon diminue et l'énergie d'ionisation augmente. En descendant une colonne, Zeff change peu (2,20 pour Na, K, Rb, Cs) mais l'électron externe est sur une couche n plus grande : le rayon augmente nettement.",
  piege:"Ce n'est pas parce que Z augmente que l'atome grossit : de Li (Z = 3) à Ne (Z = 10), le rayon est divisé par plus de 4. Et le modèle « écran parfait » (Zeff = nombre d'électrons de valence) exagère : les électrons de la même couche ne s'écrantent qu'en partie, ceux de la couche n − 1 presque totalement (0,85). Les règles de Slater restent une approximation.",
  build:function(k, S){
    var c = p3canvas(k, 0.8, 1.32);
    var st = {t:0, a:0.5, b:0.35, row:"p3", i:0, rD:null, zD:null, sD:null, auto:true, at:0, tiles:[], trail:[]};
    var rS = k.seg("Parcours", [["p2", "Période 2"], ["p3", "Période 3"], ["g1", "Groupe 1"], ["g17", "Groupe 17"]], "p3", function(v){ st.row = v; st.i = 0; st.at = 0; });
    k.button("◀ Précédent", function(){ step(-1); });
    k.button("Suivant ▶", function(){ step(1); }, true);
    var aT = k.toggle("Parcours automatique", true, function(v){ st.auto = v; st.at = 0; });
    var pT = k.toggle("Montrer l'écran parfait (Zeff = électrons de valence)", false);
    var ro = k.readouts(["Élément", "Électrons internes / de valence", "Écran S → Zeff", "Rayon atomique"]);
    var nt = k.note("", "ok");
    function step(d){ var n = ZROWS[st.row].els.length; st.i = (st.i + d + n) % n; st.at = 0; if (d){ st.auto = false; aT.set(false); } }
    /* glisser = tourner ; toucher une case du bandeau = choisir l'élément */
    c.pointer(function(type, p){
      if (type === "down"){
        var hit = null; st.tiles.forEach(function(t, i){ if (p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h) hit = i; });
        if (hit != null){ st.i = hit; st.at = 0; st.auto = false; aT.set(false); k.redraw(); return; }
        st.lx = p.x; st.ly = p.y; st.drag = true;
      }
      if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.011; st.b = Math.max(-1.3, Math.min(1.3, st.b + (p.y - st.ly) * 0.011)); st.lx = p.x; st.ly = p.y; }
      if (type === "up"){ st.lx = null; st.drag = false; }
      if (type === "move"){ var on = false; st.tiles.forEach(function(t){ if (p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h) on = true; }); c.cv.style.cursor = on ? "pointer" : "grab"; }
    });
    c.cv.style.cursor = "grab";
    /* électrons : position sur une sphère, axe de rotation propre */
    var EL = [];
    for (var q = 0; q < 60; q++){
      var u = Math.random() * 2 - 1, ph = Math.random() * 2 * PI, qq = Math.sqrt(1 - u * u);
      var ax = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], al = Math.hypot(ax[0], ax[1], ax[2]) || 1;
      EL.push({p:[qq * Math.cos(ph), u, qq * Math.sin(ph)], ax:[ax[0] / al, ax[1] / al, ax[2] / al], w:1.2 + Math.random() * 1.8});
    }
    function rotAx(v, a, th){
      var c0 = Math.cos(th), s0 = Math.sin(th), d = v[0] * a[0] + v[1] * a[1] + v[2] * a[2];
      return [v[0] * c0 + (a[1] * v[2] - a[2] * v[1]) * s0 + a[0] * d * (1 - c0), v[1] * c0 + (a[2] * v[0] - a[0] * v[2]) * s0 + a[1] * d * (1 - c0), v[2] * c0 + (a[0] * v[1] - a[1] * v[0]) * s0 + a[2] * d * (1 - c0)];
    }
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto){ st.at += dt; if (st.at > 3.2){ st.at = 0; var n = ZROWS[st.row].els.length; st.i = (st.i + 1) % n; } }
      if (!st.drag) st.a += dt * 0.18;
      EL.forEach(function(e){ e.p = rotAx(e.p, e.ax, e.w * dt); });
      /* valeurs affichées qui glissent vers la cible */
      var sym = ZROWS[st.row].els[Math.min(st.i, ZROWS[st.row].els.length - 1)], E = ZE[sym], Q = zeffOf(sym), f = 1 - Math.exp(-dt * 4);
      if (st.rD == null){ st.rD = E.r; st.zD = E.Z; st.sD = Q.S; }
      st.rD += (E.r - st.rD) * f; st.zD += (E.Z - st.zD) * f; st.sD += (Q.S - st.sD) * f;
      k.redraw();
    });
    lp.play();

    function shellR(E, n){ /* rayon d'une couche interne (pm) : n*²·a0 / Zeff de cette couche */
      var S0 = slater(E.sh, n); return NSTAR[n - 1] * NSTAR[n - 1] * A0_PM / Math.max(0.5, E.Z - S0);
    }
    function bars(ctx, x, y, w, Z, Sv, Zf, ph, ex3){
      var h = ph ? 15 : 17, gap = ph ? 6 : 7, max = Math.max(Z, 1), fs = ph ? 10.5 : 11.5, lw = ph ? 60 : 70, bw = w - lw - 16;
      ctx.save(); ctx.fillStyle = "rgba(8,14,26,.78)"; p3rr(ctx, x, y, w, 3 * h + 2 * gap + 38, 10); ctx.fill(); ctx.restore();
      p3text(ctx, "Ce que voit l'électron externe", x + 10, y + 12, {size:fs, color:"#c9d6e8", align:"left", w:800});
      var y0 = y + 26, sc = bw / max;
      function bar(i, lab, v, col, x0, vt){
        var yy = y0 + i * (h + gap);
        p3text(ctx, lab, x + 10, yy + h / 2, {size:fs, color:"#fff", align:"left", w:800});
        var g = ctx.createLinearGradient(0, yy, 0, yy + h); g.addColorStop(0, p3shade(col, 0.35)); g.addColorStop(1, col);
        ctx.fillStyle = g; p3rr(ctx, x + lw + (x0 || 0) * sc, yy, Math.max(2, v * sc), h, 4); ctx.fill();
        var txt = p3fmt(vt, Math.abs(vt - Math.round(vt)) < 0.004 ? 0 : 2), tx = x + lw + ((x0 || 0) + v) * sc + 5;
        var tw = p3tw(ctx, txt, fs, 800);
        if (tx + tw > x + w - 6) p3text(ctx, txt, tx - 10, yy + h / 2, {size:fs, color:"#0f1b2d", align:"right", w:800});
        else p3text(ctx, txt, tx, yy + h / 2, {size:fs, color:"#fff", align:"left", w:800});
      }
      bar(0, "Z noyau", Z, "#e0483e", 0, ex3[0]);
      bar(1, "− S écran", Sv, "#4f8fe8", Z - Sv, ex3[1]);
      bar(2, "= Zeff", Zf, "#2fbf71", 0, ex3[2]);
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      var R = ZROWS[st.row], els = R.els, i = Math.min(st.i, els.length - 1), sym = els[i], E = ZE[sym], Q = zeffOf(sym);
      /* ---- décor : salle sombre avec le tableau périodique au mur ---- */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0d1626"); bg.addColorStop(1, "#1b2740");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var stripH = ph ? 84 : 78, sceneH = H - stripH;
      ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = "#9fc2ff";
      var cw = W / 19, chh = Math.min(cw * 0.9, sceneH / 8.5);
      for (var rr = 0; rr < 7; rr++) for (var cc = 0; cc < 18; cc++){
        var ok = rr === 0 ? (cc === 0 || cc === 17) : rr < 3 ? (cc < 2 || cc > 11) : true;
        if (ok) ctx.fillRect(cw * 0.5 + cc * cw + 1, sceneH * 0.08 + rr * chh + 1, cw - 2, chh - 2);
      }
      ctx.restore();
      /* ---- l'atome ---- */
      var cx = ph ? W * 0.5 : W * 0.58, cy = ph ? sceneH * 0.6 : sceneH * 0.53;
      var maxR = 0; els.forEach(function(s){ maxR = Math.max(maxR, ZE[s].r); });
      var kpx = (ph ? Math.min(W * 0.4, sceneH * 0.3) : Math.min(W * 0.27, sceneH * 0.42)) / maxR;
      var rV = st.rD * kpx;
      /* halo du nuage externe */
      var gl = ctx.createRadialGradient(cx, cy, rV * 0.2, cx, cy, rV * 1.25);
      gl.addColorStop(0, "rgba(120,170,255,.10)"); gl.addColorStop(0.75, "rgba(120,170,255,.16)"); gl.addColorStop(1, "rgba(120,170,255,0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, rV * 1.25, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(170,200,255,.35)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, rV, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      /* couches internes (écran) */
      var n = E.sh.length, coreR = 0;
      for (var sh = n - 1; sh >= 1; sh--){
        var rs = shellR(E, sh) * kpx; if (sh === n - 1) coreR = rs;
        var g2 = ctx.createRadialGradient(cx - rs * 0.3, cy - rs * 0.35, rs * 0.1, cx, cy, rs);
        g2.addColorStop(0, "rgba(110,160,245,.10)"); g2.addColorStop(0.8, "rgba(79,143,232,.30)"); g2.addColorStop(1, "rgba(79,143,232,.45)");
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, cy, Math.max(rs, 3), 0, 7); ctx.fill();
      }
      /* électrons des couches internes et externes, en 3D */
      var list = [], ei = 0;
      for (var s2 = 0; s2 < n; s2++){
        var rad = s2 === n - 1 ? rV : shellR(E, s2 + 1) * kpx, cnt = E.sh[s2];
        var show = Math.min(cnt, 18);
        for (var j = 0; j < show; j++){
          var e = EL[(ei++) % EL.length], p = p3rot(e.p, st.a, st.b);
          if (s2 === n - 1 && j === 0) continue;
          list.push({x:cx + p[0] * rad, y:cy - p[1] * rad, z:p[2], val:s2 === n - 1});
        }
      }
      /* noyau */
      var nr = 5 + Math.sqrt(E.Z) * 1.3;
      list.push({x:cx, y:cy, z:0, nuc:true});
      /* électron externe suivi : orbite inclinée */
      /* orbite vue de biais : ellipse inclinée (aplatissement 0,45, inclinaison −20°) */
      var th = st.t * 1.4, TIL = -0.35, FL = 0.45;
      function orb(t){ var u = Math.cos(t), v = Math.sin(t) * FL; return [cx + rV * (u * Math.cos(TIL) - v * Math.sin(TIL)), cy + rV * (u * Math.sin(TIL) + v * Math.cos(TIL)), Math.sin(t)]; }
      var eo = orb(th), ex = eo[0], ey = eo[1];
      list.push({x:ex, y:ey, z:eo[2], star:true});
      list.sort(function(a, b){ return a.z - b.z; });
      list.forEach(function(it){
        if (it.nuc){
          var gn = ctx.createRadialGradient(cx, cy, nr * 0.3, cx, cy, nr * 3); gn.addColorStop(0, "rgba(255,110,90,.5)"); gn.addColorStop(1, "rgba(255,110,90,0)");
          ctx.fillStyle = gn; ctx.beginPath(); ctx.arc(cx, cy, nr * 3, 0, 7); ctx.fill();
          p3ball(ctx, cx, cy, nr, "#e0483e");
          p3text(ctx, "+" + E.Z, cx, cy + 0.5, {size:Math.max(10, nr * 0.85), color:"#fff", w:800, halo:"rgba(120,10,0,.6)", hw:3});
          return;
        }
        if (it.star){
          /* traînée de l'électron externe */
          ctx.save(); ctx.strokeStyle = "rgba(255,214,90,.45)"; ctx.lineWidth = 2; ctx.beginPath();
          for (var tq = 0; tq <= 26; tq++){ var o3 = orb(th - tq * 0.07); tq ? ctx.lineTo(o3[0], o3[1]) : ctx.moveTo(o3[0], o3[1]); }
          ctx.stroke(); ctx.restore();
          var gg = ctx.createRadialGradient(it.x, it.y, 0, it.x, it.y, 16); gg.addColorStop(0, "rgba(255,220,100,.85)"); gg.addColorStop(1, "rgba(255,220,100,0)");
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(it.x, it.y, 16, 0, 7); ctx.fill();
          p3ball(ctx, it.x, it.y, 6.5, "#ffc93c");
          return;
        }
        var r0 = it.val ? 4.2 : 2.6, col = it.val ? "#9fd0ff" : "#cfe0ff";
        ctx.globalAlpha = 0.55 + 0.45 * (it.z + 1) / 2; p3ball(ctx, it.x, it.y, r0, it.val ? "#7fbfff" : "#a9c4f0"); ctx.globalAlpha = 1;
      });
      /* flèche : attraction nette vers le noyau (∝ Zeff / r²) */
      var dx = cx - ex, dy = cy - ey, dl = Math.hypot(dx, dy) || 1, Zf = st.zD - st.sD;
      var F = Zf / Math.pow(st.rD / 100, 2), Lr = Math.min(dl * 0.75, 10 + 3.2 * Math.sqrt(F) * 3);
      p3arrow(ctx, ex, ey, ex + dx / dl * Lr, ey + dy / dl * Lr, "#2fbf71", 3);
      p3tag(ctx, "e⁻ externe", ex, ey - 20, {size:ph ? 10 : 11, bg:"rgba(255,201,60,.95)", color:"#3a2a00"});
      /* étiquettes */
      /* orbite complète en pointillé léger */
      ctx.save(); ctx.strokeStyle = "rgba(255,214,90,.18)"; ctx.lineWidth = 1; ctx.beginPath(); for (var to = 0; to <= 64; to++){ var o4 = orb(to / 64 * 2 * PI); to ? ctx.lineTo(o4[0], o4[1]) : ctx.moveTo(o4[0], o4[1]); } ctx.stroke(); ctx.restore();
      if (coreR > 14){ p3text(ctx, "électrons internes : " + Q.core, cx, cy + coreR + 13, {size:ph ? 10 : 11, color:"#a9c8ff", w:800, halo:"rgba(10,18,32,.85)"}); }
      p3text(ctx, "rayon " + p3int(E.r) + " pm", cx + rV * 0.71 + 6, cy + rV * 0.71 + 10, {size:ph ? 10.5 : 12, color:"#cfe0ff", align:"left", w:800, halo:"rgba(10,18,32,.85)"});
      /* élément en grand */
      var bx = ph ? W - 86 : 16, by = ph ? 12 : sceneH - 100;
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.93)"; p3rr(ctx, bx, by, 72, 80, 10); ctx.fill(); ctx.restore();
      p3text(ctx, String(E.Z), bx + 10, by + 14, {size:12, color:"#5b6b82", align:"left", w:800});
      p3text(ctx, sym, bx + 36, by + 44, {size:30, color:"#0f1b2d", w:800});
      p3text(ctx, "n = " + n, bx + 36, by + 68, {size:11, color:"#5b6b82", w:800});
      /* barres Z, S, Zeff */
      var bw = ph ? Math.min(W - 108, 260) : Math.min(290, W * 0.42);
      bars(ctx, 10, 10, bw, st.zD, st.sD, st.zD - st.sD, ph, [E.Z, Q.S, Q.Zeff]);
      if (pT.value){
        var yb = 10 + 3 * (ph ? 15 : 17) + 2 * (ph ? 6 : 7) + 38 + 8;
        p3tag(ctx, "écran parfait : Zeff = " + E.Z + " − " + Q.core + " = " + Q.val, 10, yb + 10, {align:"left", size:ph ? 10.5 : 11.5, bg:"rgba(255,255,255,.9)", color:"#0f1b2d"});
      }
      /* ---- bandeau des éléments ---- */
      var sy = sceneH + 6, tw = Math.min(ph ? 64 : 84, (W - 20) / els.length - 6), th2 = stripH - 14, sx = (W - (tw + 6) * els.length + 6) / 2;
      ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.fillRect(0, sceneH, W, stripH);
      var zmax = 0, rmax = 0; els.forEach(function(s){ zmax = Math.max(zmax, zeffOf(s).Zeff); rmax = Math.max(rmax, ZE[s].r); });
      st.tiles = [];
      els.forEach(function(s, j){
        var x = sx + j * (tw + 6), on = j === i, Qj = zeffOf(s);
        st.tiles.push({x:x, y:sy, w:tw, h:th2});
        var g = ctx.createLinearGradient(0, sy, 0, sy + th2); g.addColorStop(0, on ? "#fff7d6" : "#eef3fa"); g.addColorStop(1, on ? "#ffe28a" : "#c9d5e6");
        ctx.fillStyle = g; p3rr(ctx, x, sy, tw, th2, 7); ctx.fill();
        if (on){ ctx.strokeStyle = "#ffc93c"; ctx.lineWidth = 2.5; ctx.stroke(); }
        if (ph && tw < 56) p3text(ctx, s, x + tw / 2, sy + 15, {size:14, color:"#0f1b2d", w:800});
        else { p3text(ctx, s, x + 8, sy + 15, {size:ph ? 14 : 16, color:"#0f1b2d", align:"left", w:800}); p3text(ctx, String(ZE[s].Z), x + tw - 6, sy + 12, {size:9.5, color:"#5b6b82", align:"right", w:800}); }
        /* mini-barres : Zeff (vert) et rayon (bleu) */
        var bwm = tw - 16, yb1 = sy + th2 - 30, yb2 = sy + th2 - 14;
        ctx.fillStyle = "#2fbf71"; p3rr(ctx, x + 8, yb1, Math.max(2, bwm * Qj.Zeff / zmax), 7, 3); ctx.fill();
        ctx.fillStyle = "#4f8fe8"; p3rr(ctx, x + 8, yb2, Math.max(2, bwm * ZE[s].r / rmax), 7, 3); ctx.fill();
      });
      if (!ph || els.length < 6){
        p3text(ctx, "vert : Zeff · bleu : rayon", W - 10, sceneH - 10, {size:10.5, color:"#9fb3cf", align:"right", w:700});
      } else p3text(ctx, "vert : Zeff · bleu : rayon", W - 10, sceneH - 10, {size:10, color:"#9fb3cf", align:"right", w:700});
      /* ---- afficheurs et note ---- */
      ro.set(0, sym + " · Z = " + E.Z + " · " + E.cfg);
      ro.set(1, Q.core + " / " + Q.val);
      ro.set(2, "S = " + p3fmt(Q.S, 2) + " → Zeff = " + p3fmt(Q.Zeff, 2));
      ro.set(3, p3int(E.r) + " pm");
      var msg;
      if (st.row === "p2" || st.row === "p3"){
        msg = "Le long de la " + R.lab + ", Z gagne 1 à chaque case mais l'écran S ne gagne que 0,35 (l'électron ajouté est sur la même couche n = " + n + ") : Zeff passe de " + p3fmt(zeffOf(els[0]).Zeff, 2) + " (" + els[0] + ") à " + p3fmt(zeffOf(els[els.length - 1]).Zeff, 2) + " (" + els[els.length - 1] + "), les électrons externes sont plus tirés vers le noyau et le rayon fond de " + ZE[els[0]].r + " à " + ZE[els[els.length - 1]].r + " pm.";
      } else {
        var z0 = zeffOf(els[0]).Zeff, z1 = zeffOf(els[els.length - 1]).Zeff;
        msg = "En descendant le " + R.lab + ", Z passe de " + ZE[els[0]].Z + " à " + ZE[els[els.length - 1]].Z + " mais Zeff " + (Math.abs(z1 - z0) < 0.01 ? "reste à " + p3fmt(z0, 2) + " (sauf Li : 1,30)" : "ne passe que de " + p3fmt(z0, 2) + " à " + p3fmt(z1, 2)) + " : chaque couche complète ajoutée fait écran presque entièrement. Mais l'électron externe occupe une couche n de plus en plus grande, donc le rayon grandit (" + els.map(function(s){ return ZE[s].r; }).join(" → ") + " pm).";
      }
      nt.set(msg + " <i>Zeff par les règles de Slater ; rayons atomiques calculés (Clementi, 1967) ; taille des couches internes : n*²·a₀/Zeff.</i>", "ok");
    });
  }
});

/* =====================================================================
   3. Ionique, covalente, métallique : ce que font les électrons (c02)
   ===================================================================== */
/* exemples : électronégativités de Pauling, rayons covalents et ioniques (pm), longueur de liaison (pm, molécule gazeuse) */
var BPAIR = [
  {k:"HH", a:"H", b:"H", xa:2.20, xb:2.20, ra:31, rb:31, ia:31, ib:31, d:74, ca:"#f2f4f7", cb:"#f2f4f7"},
  {k:"CH", a:"H", b:"C", xa:2.20, xb:2.55, ra:31, rb:76, ia:31, ib:76, d:109, ca:"#f2f4f7", cb:"#505a68"},
  {k:"HCl", a:"H", b:"Cl", xa:2.20, xb:3.16, ra:31, rb:102, ia:31, ib:102, d:127, ca:"#f2f4f7", cb:"#3fbf72"},
  {k:"HF", a:"H", b:"F", xa:2.20, xb:3.98, ra:31, rb:57, ia:31, ib:57, d:92, ca:"#f2f4f7", cb:"#9be37a"},
  {k:"NaCl", a:"Na", b:"Cl", xa:0.93, xb:3.16, ra:166, rb:102, ia:102, ib:181, d:236, ca:"#8f7cf2", cb:"#3fbf72"},
  {k:"KF", a:"K", b:"F", xa:0.82, xb:3.98, ra:203, rb:57, ia:138, ib:133, d:217, ca:"#b36ae0", cb:"#9be37a"}
];
BPAIR.forEach(function(p){ p.dx = Math.round((p.xb - p.xa) * 100) / 100; p.lab = p.a + "–" + p.b; });
function ionicPct(dx){ return 100 * (1 - Math.exp(-dx * dx / 4)); }
function bondType(dx){ return dx < 0.4 ? "covalente apolaire" : dx < 1.7 ? "covalente polaire" : "ionique"; }

SFA.sim({
  id:"ch-trois-liaisons", ch:"c02", tag:"Liaison chimique",
  titre:"Ionique, covalente, métallique : ce que font les électrons",
  resume:"Un curseur Δχ fait glisser le nuage électronique d'une paire d'atomes, du partage égal au transfert complet. Puis un cristal ionique et un métal : on branche une pile sur le métal, et un coup de marteau déforme le métal mais brise le cristal ionique.",
  but:"Mode « Paire d'atomes » : règle Δχ (curseur, exemples ou glisse le repère sur l'échelle en bas) et regarde où se trouve la paire d'électrons. Modes « Cristal ionique » et « Métal » : donne un coup de marteau et compare ; sur le métal, branche la pile pour voir les électrons libres dériver. Glisse sur la scène pour la tourner.",
  aRetenir:"Entre un non-métal et un autre atome, c'est la différence d'électronégativité Δχ qui décide. Δχ ≈ 0 : la paire est partagée également (covalente apolaire, H–H). Δχ moyen : partage inégal, charges partielles δ+ et δ− (covalente polaire, H–Cl). Δχ grand (au-delà de 1,7 environ) : l'électron est transféré, on obtient des ions (Na⁺ Cl⁻) tenus par l'attraction électrostatique. Entre atomes peu électronégatifs (métaux), les électrons de valence sont mis en commun dans tout le cristal : liaison métallique, avec une « mer » d'électrons libres, d'où la conduction électrique et la malléabilité. Un cristal ionique est dur mais cassant : décaler une couche met face à face des ions de même signe, qui se repoussent.",
  piege:"Il n'y a pas de frontière nette : le caractère ionique augmente continûment avec Δχ (estimation de Pauling : 100·(1 − e^(−Δχ²/4)) %, environ 21 % pour H–Cl et 71 % pour NaCl gazeux). Le seuil de 1,7 est une convention (certains cours prennent 2). Et un solide ionique ne conduit pas l'électricité : ses ions sont bloqués ; il conduit une fois fondu ou dissous.",
  build:function(k, S){
    var c = p3canvas(k, 0.74, 1.2);
    var st = {t:0, a:0.35, b:0.28, dx:0, auto:true, ph:0, hit:-1, autoH:0, el:[], cl:[], geo:null};
    var mS = k.seg("Mode", [["pair", "Paire d'atomes (Δχ)"], ["ion", "Cristal ionique"], ["met", "Métal"]], "pair", function(){ st.hit = -1; st.autoH = 0; makeSea(); });
    var eS = k.select("Exemple", BPAIR.map(function(p, i){ return [String(i), p.lab + " (Δχ = " + p3fmt(p.dx, 2) + ")"]; }), "0", function(v){ st.auto = false; aT.set(false); dS.set(BPAIR[+v].dx); st.dx = BPAIR[+v].dx; });
    var dS = k.slider("Différence d'électronégativité Δχ", 0, 3.2, 0.01, 0, "", function(v){ st.dx = v; st.auto = false; aT.set(false); });
    var aT = k.toggle("Balayer Δχ automatiquement", true, function(v){ st.auto = v; });
    k.button("Coup de marteau", function(){ hammer(); }, true);
    var pT = k.toggle("Brancher la pile (métal)", false);
    var ro = k.readouts(["Δχ", "Caractère ionique", "Type de liaison", "La paire d'électrons"]);
    var nt = k.note("", "ok");
    var ctls = Array.prototype.slice.call(k.ctrl.querySelectorAll(".ctl")), boxEx = ctls[1], boxD = ctls[2], boxA = ctls[3], boxP = ctls[4];
    var btnH = k.ctrl.querySelector(".btns");
    function hammer(){ if (mS.value === "pair") return; st.hit = 0; st.autoH = 0; }
    /* glisser : tourner la vue, ou déplacer le repère de l'échelle de Δχ */
    c.pointer(function(type, p){
      if (type === "down"){
        st.lx = p.x; st.ly = p.y; st.drag = true; st.onScale = mS.value === "pair" && st.scale && p.y > st.scale.y - 24 && p.y < st.scale.y + 22 && p.x > st.scale.x0 - 12 && p.x < st.scale.x1 + 12;
      }
      if ((type === "down" || type === "drag") && st.onScale){
        var v = Math.max(0, Math.min(3.2, (p.x - st.scale.x0) / (st.scale.x1 - st.scale.x0) * 3.2));
        st.dx = Math.round(v * 100) / 100; dS.set(st.dx); st.auto = false; aT.set(false); return;
      }
      if (type === "drag" && st.lx != null){ st.a = Math.max(-1.2, Math.min(1.2, st.a + (p.x - st.lx) * 0.01)); st.b = Math.max(-0.2, Math.min(0.9, st.b + (p.y - st.ly) * 0.01)); st.lx = p.x; st.ly = p.y; }
      if (type === "up"){ st.lx = null; st.drag = false; st.onScale = false; }
    });
    c.cv.style.cursor = "grab";
    /* nuage : échantillons gaussiens fixes (3D), qui frémissent */
    for (var i = 0; i < 340; i++){
      var u1 = Math.random() || 1e-9, u2 = Math.random(), u3 = Math.random() || 1e-9, u4 = Math.random();
      var g1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * PI * u2), g2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * PI * u2), g3 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * PI * u4);
      st.cl.push({n:[g1, g2, g3], w:Math.random() * 2 * PI, sp:0.6 + Math.random()});
    }
    /* mer d'électrons du métal (coordonnées réduites 0–1 dans le bloc) */
    function makeSea(){ st.el = []; for (var q = 0; q < 70; q++) st.el.push({x:Math.random(), y:Math.random(), z:Math.random(), vx:(Math.random() - 0.5), vy:(Math.random() - 0.5), vz:(Math.random() - 0.5)}); }
    makeSea();
    function nearest(dx){ var b = 0; BPAIR.forEach(function(p, i){ if (Math.abs(p.dx - dx) < Math.abs(BPAIR[b].dx - dx)) b = i; }); return b; }
    var lp = k.loop(function(dt){
      st.t += dt;
      var m = mS.value;
      if (m === "pair" && st.auto){ st.ph += dt; var u = (Math.sin(st.ph * 0.42 - PI / 2) + 1) / 2; st.dx = Math.round(u * 3.2 * 100) / 100; dS.set(st.dx); }
      if (m !== "pair"){
        if (st.hit >= 0){ st.hit += dt; if (st.hit > 6.2) st.hit = -1; }
        else { st.autoH += dt; if (st.autoH > 2.2){ st.autoH = 0; st.hit = 0; } }
      }
      if (m === "met"){
        var drift = pT.value ? 0.16 : 0;
        st.el.forEach(function(e){
          e.x += (e.vx * 0.5 + drift) * dt; e.y += e.vy * 0.5 * dt; e.z += e.vz * 0.5 * dt;
          if (Math.random() < dt * 2){ e.vx = Math.random() - 0.5; e.vy = Math.random() - 0.5; e.vz = Math.random() - 0.5; }
          if (e.x > 1) e.x -= 1; if (e.x < 0) e.x += 1; if (e.y > 1 || e.y < 0) e.vy *= -1; if (e.z > 1 || e.z < 0) e.vz *= -1;
          e.y = Math.max(0, Math.min(1, e.y)); e.z = Math.max(0, Math.min(1, e.z));
        });
      }
      k.redraw();
    });
    lp.play();

    /* ---------- décor commun : studio sombre avec un plan de travail ---------- */
    function studio(ctx, W, H, yF){
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#111b2d"); bg.addColorStop(0.6, "#1d2b44"); bg.addColorStop(1, "#0b111c");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var sp = ctx.createRadialGradient(W * 0.5, yF * 0.55, 10, W * 0.5, yF * 0.55, W * 0.6); sp.addColorStop(0, "rgba(140,180,255,.16)"); sp.addColorStop(1, "rgba(140,180,255,0)");
      ctx.fillStyle = sp; ctx.fillRect(0, 0, W, H);
      var fl = ctx.createLinearGradient(0, yF, 0, H); fl.addColorStop(0, "#26354f"); fl.addColorStop(1, "#0d1422");
      ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.lineTo(W * 0.92, yF); ctx.lineTo(W * 0.08, yF); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fillRect(W * 0.08, yF, W * 0.84, 1.5);
    }
    /* ---------- mode 1 : la paire d'atomes ---------- */
    function drawPair(ctx, W, H, ph){
      var dx = st.dx, P = BPAIR[nearest(dx)], f = ionicPct(dx) / 100, fs = smooth(f);
      if (eS.value !== String(nearest(dx))) eS.set(String(nearest(dx)));
      var yF = H * (ph ? 0.58 : 0.62);
      studio(ctx, W, H, yF);
      /* géométrie qui glisse d'un exemple à l'autre */
      var tg = {d:P.d, ra:P.ra + (P.ia - P.ra) * fs, rb:P.rb + (P.ib - P.rb) * fs, ext:P.d + P.ra + P.rb};
      if (!st.geo) st.geo = {d:tg.d, ra:tg.ra, rb:tg.rb, ext:tg.ext};
      ["d", "ra", "rb", "ext"].forEach(function(q){ st.geo[q] += (tg[q] - st.geo[q]) * 0.12; });
      var G = st.geo, sc = Math.min(W * (ph ? 0.8 : 0.6), yF * 1.6) / (G.ext + 70), cy = yF * 0.6, cx = W * 0.5;
      function prj(x, y, z){ var q = p3rot([x, y, z], st.a, st.b); return {x:cx + q[0] * sc, y:cy - q[1] * sc, z:q[2]}; }
      var A = prj(-G.d / 2, 0, 0), B = prj(G.d / 2, 0, 0);
      p3shadow(ctx, A.x, yF + 14, Math.max(14, G.ra * sc * 0.9), 7, 0.35); p3shadow(ctx, B.x, yF + 14, Math.max(14, G.rb * sc * 0.9), 7, 0.35);
      /* nuage propre de chaque atome (taille : rayon covalent → rayon ionique) */
      function halo(Pt, r, col, a){ var R = Math.max(18, r * sc * 1.15), g = ctx.createRadialGradient(Pt.x, Pt.y, 0, Pt.x, Pt.y, R); g.addColorStop(0, p3rgba(col, a)); g.addColorStop(1, p3rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(Pt.x, Pt.y, R, 0, 7); ctx.fill(); }
      halo(A, G.ra, P.ca === "#f2f4f7" ? "#cfd8e6" : P.ca, 0.35); halo(B, G.rb, P.cb === "#f2f4f7" ? "#cfd8e6" : P.cb, 0.35);
      /* la paire liante : centre et étalement interpolés entre « au milieu » et « sur B » */
      var cxp = -G.d / 2 + G.d * (0.5 + 0.5 * fs), sx = G.d * 0.34 * (1 - fs) + Math.max(G.rb, 40) * 0.45 * fs, syz = G.d * 0.25 * (1 - fs) + Math.max(G.rb, 40) * 0.45 * fs;
      var list = [];
      st.cl.forEach(function(e){
        var w = e.w + st.t * e.sp, n = e.n;
        var x = cxp + sx * (n[0] * 0.9 + 0.12 * Math.sin(w)), y = syz * (n[1] * 0.9 + 0.12 * Math.cos(w * 1.3)), z = syz * (n[2] * 0.9 + 0.12 * Math.sin(w * 0.7));
        var q = prj(x, y, z); list.push({x:q.x, y:q.y, z:q.z, dot:true});
      });
      list.push({x:A.x, y:A.y, z:A.z, atom:"A"}); list.push({x:B.x, y:B.y, z:B.z, atom:"B"});
      list.sort(function(u, v){ return u.z - v.z; });
      list.forEach(function(it){
        if (it.dot){ ctx.fillStyle = "rgba(255,214,90,.62)"; ctx.beginPath(); ctx.arc(it.x, it.y, 1.9, 0, 7); ctx.fill(); return; }
        var isA = it.atom === "A", r = Math.max(9, (isA ? G.ra : G.rb) * sc * 0.42), col = isA ? P.ca : P.cb;
        p3ball(ctx, it.x, it.y, r, col, 0.96);
        p3text(ctx, isA ? P.a : P.b, it.x, it.y + 0.5, {size:Math.max(11, Math.min(18, r * 0.8)), color:col === "#f2f4f7" || col === "#9be37a" ? "#0f1b2d" : "#fff", w:800});
      });
      /* charges partielles */
      var fsz = ph ? 15 : 17;
      if (f > 0.02){
        var lab1 = f > 0.85 ? "+" : "δ+", lab2 = f > 0.85 ? "−" : "δ−";
        p3text(ctx, lab1, A.x, A.y - Math.max(G.ra * sc * 1.0, 24) - 8, {size:fsz, color:"#ff8a7a", w:800, halo:"rgba(10,18,32,.8)"});
        p3text(ctx, lab2, B.x, B.y - Math.max(G.rb * sc * 1.0, 24) - 8, {size:fsz, color:"#7fb6ff", w:800, halo:"rgba(10,18,32,.8)"});
      }
      var tA = "χ(" + P.a + ") = " + p3fmt(P.xa, 2), tB = "χ(" + P.b + ") = " + p3fmt(P.xb, 2), fz = ph ? 10.5 : 11.5;
      var wA = p3tw(ctx, tA, fz, 800) + 14, wB = p3tw(ctx, tB, fz, 800) + 14, xA = A.x, xB = B.x;
      if (xB - xA < (wA + wB) / 2 + 8){ var mid = (xA + xB) / 2; xA = mid - (wA + wB) / 4 - 4; xB = mid + (wA + wB) / 4 + 4; }
      p3tag(ctx, tA, xA, yF + 32, {size:fz, bg:"rgba(255,255,255,.12)", color:"#dfe7f3"});
      p3tag(ctx, tB, xB, yF + 32, {size:fz, bg:"rgba(255,255,255,.12)", color:"#dfe7f3"});
      p3tag(ctx, "exemple proche : " + P.lab + " (Δχ = " + p3fmt(P.dx, 2) + ")", 10, 18, {align:"left", size:ph ? 11 : 12, bg:"rgba(255,255,255,.12)", color:"#fff"});
      /* jauge de partage : où est la paire ? */
      var ys = H - 30, gy = yF + 62, gw = ph ? W * 0.6 : W * 0.36, gx = W * 0.5 - gw / 2, pos = 0.5 + 0.5 * f;
      if (gy < ys - 44){
        p3text(ctx, "position de la paire", W * 0.5, gy - 13, {size:10.5, color:"#9fb3cf", w:700});
        ctx.fillStyle = "rgba(255,255,255,.1)"; p3rr(ctx, gx, gy - 4, gw, 8, 4); ctx.fill();
        ctx.fillStyle = "rgba(255,214,90,.85)"; p3rr(ctx, gx, gy - 4, gw * pos, 8, 4); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.fillRect(gx + gw / 2 - 1, gy - 7, 2, 14);
        p3text(ctx, P.a, gx - 8, gy, {size:11, color:"#dfe7f3", w:800, align:"right"}); p3text(ctx, P.b, gx + gw + 8, gy, {size:11, color:"#dfe7f3", w:800, align:"left"});
      }
      /* échelle de Δχ avec zones et repère qu'on peut glisser */
      var x0 = ph ? 30 : W * 0.14, x1 = ph ? W - 22 : W * 0.86;
      st.scale = {x0:x0, x1:x1, y:ys};
      function X(v){ return x0 + v / 3.2 * (x1 - x0); }
      [[0, 0.4, "#5aa0e0", ph ? "apol." : "apolaire"], [0.4, 1.7, "#9b7be0", "polaire"], [1.7, 3.2, "#e0735a", "ionique"]].forEach(function(zn){
        ctx.fillStyle = p3rgba(zn[2], 0.85); p3rr(ctx, X(zn[0]) + 1, ys - 5, X(zn[1]) - X(zn[0]) - 2, 10, 4); ctx.fill();
        p3text(ctx, zn[3], (X(zn[0]) + X(zn[1])) / 2, ys + 17, {size:ph ? 10 : 11, color:"#c9d6e8", w:800});
      });
      [0, 1, 2, 3].forEach(function(v){ p3text(ctx, String(v), X(v), ys - 15, {size:10, color:"#8ea3c0", w:700}); });
      var mx = X(dx);
      ctx.fillStyle = "#ffc93c"; ctx.beginPath(); ctx.moveTo(mx, ys - 6); ctx.lineTo(mx - 7, ys - 18); ctx.lineTo(mx + 7, ys - 18); ctx.closePath(); ctx.fill();
      p3ball(ctx, mx, ys, 8, "#ffc93c");
      p3text(ctx, "Δχ", x0 - 8, ys, {size:11, color:"#c9d6e8", w:800, align:"right"});
      ro.set(0, p3fmt(dx, 2));
      ro.set(1, p3fmt(ionicPct(dx), 0) + " %");
      ro.set(2, bondType(dx));
      ro.set(3, dx < 0.005 ? "partagée à 50 / 50" : p3fmt(50 + 50 * f, 0) + " % côté " + P.b + (f >= 0.005 ? " (δ ≈ ±" + p3fmt(f, 2) + " e)" : ""));
      nt.set(dx < 0.4 ? "Δχ = " + p3fmt(dx, 2) + " : les deux atomes tirent presque autant sur la paire. Elle reste au milieu : liaison covalente apolaire (comme H–H ou C–H)." :
        dx < 1.7 ? "Δχ = " + p3fmt(dx, 2) + " : l'atome le plus électronégatif (" + P.b + ") attire la paire vers lui. Elle reste partagée, mais inégalement : charges partielles δ+ et δ−, liaison covalente polaire (caractère ionique ≈ " + p3fmt(ionicPct(dx), 0) + " %)." :
        "Δχ = " + p3fmt(dx, 2) + " : la paire est presque entièrement chez " + P.b + ". On parle de transfert d'électron et d'ions (" + (P.k === "NaCl" ? "Na⁺ et Cl⁻" : P.k === "KF" ? "K⁺ et F⁻" : P.a + "⁺ et " + P.b + "⁻") + ") : liaison ionique (caractère ionique ≈ " + p3fmt(ionicPct(dx), 0) + " %). Le cation rétrécit, l'anion gonfle." + (P.k === "HF" ? " Attention : HF reste en réalité une molécule covalente très polaire ; le seuil de 1,7 n'est qu'un repère." : ""), "ok");
    }
    /* ---------- modes 2 et 3 : cristal ionique et métal, en 3D, avec un marteau ---------- */
    var NX = 8, NY = 4, ND = 3;
    function drawCrystal(ctx, W, H, ph, metal){
      var yF = H * (ph ? 0.66 : 0.72);
      studio(ctx, W, H, yF);
      var h = st.hit, sh = 0, sep = 0, phase = "repos";
      /* chronologie du coup : 0–0,45 s le marteau descend ; 0,45–1,1 s la couche glisse ; ensuite cassure (ionique) ; retour à 5,4 s */
      if (h >= 0){
        if (h < 0.45) phase = "marteau";
        else { sh = smooth((h - 0.45) / 0.6); phase = "glisse"; }
        if (!metal && h > 1.1){ sep = Math.pow(smooth((h - 1.1) / 1.3), 1.4); phase = "casse"; }
        if (metal && h > 1.1) phase = "deforme";
        if (h > 5.4){ var back = smooth((h - 5.4) / 0.8); sh *= 1 - back; sep *= 1 - back; }
      }
      var d = Math.min(W * (ph ? 0.074 : 0.064), H * 0.1), cx = W * (ph ? 0.57 : 0.53), cy = yF - (NY * 0.5 + 0.7) * d;
      function prj(x, y, z){ var q = p3rot([x, y, z], st.a, st.b); return {x:cx + q[0] * d, y:cy - q[1] * d, z:q[2]}; }
      p3shadow(ctx, cx, yF + 6, NX * d * 0.62, 12, 0.4);
      var list = [];
      for (var j = 0; j < NY; j++) for (var i = 0; i < NX; i++) for (var kz = 0; kz < ND; kz++){
        var upper = j >= NY / 2, x = i - (NX - 1) / 2, y = j - (NY - 1) / 2, z = kz - (ND - 1) / 2;
        if (upper){
          x += sh;
          /* cassure : le bloc supérieur bascule et s'éloigne */
          if (sep > 0){ var ang = sep * 0.28, xr = x - (NX / 2), yr = y; x = NX / 2 + xr * Math.cos(ang) - yr * Math.sin(ang) + sep * 0.5; y = xr * Math.sin(ang) + yr * Math.cos(ang) + sep * 0.9; }
        }
        var pos = metal ? 1 : ((i + j + kz) % 2 === 0 ? 1 : -1);
        var q = prj(x, y, z);
        list.push({x:q.x, y:q.y, z:q.z, s:pos});
      }
      if (metal){
        st.el.forEach(function(e){
          var x = (e.x - 0.5) * NX, y = (e.y - 0.5) * NY, z = (e.z - 0.5) * ND;
          if (y > 0) x += sh;
          var q = prj(x, y, z); list.push({x:q.x, y:q.y, z:q.z + 0.001, e:true});
        });
      }
      list.sort(function(u, v){ return u.z - v.z; });
      var rI = d * 0.42, rC = d * 0.34, rA = d * 0.5;
      list.forEach(function(it){
        if (it.e){ var g = ctx.createRadialGradient(it.x, it.y, 0, it.x, it.y, 6); g.addColorStop(0, "rgba(255,225,120,.95)"); g.addColorStop(1, "rgba(255,225,120,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(it.x, it.y, 6, 0, 7); ctx.fill(); ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(it.x, it.y, 1.8, 0, 7); ctx.fill(); return; }
        if (metal){ p3ball(ctx, it.x, it.y, rI, "#a9b6c8"); if (rI > 9) p3text(ctx, "+", it.x, it.y + 0.5, {size:Math.min(14, rI * 0.9), color:"#24364f", w:800}); return; }
        var r = it.s > 0 ? rC : rA;
        p3ball(ctx, it.x, it.y, r, it.s > 0 ? "#8f7cf2" : "#3fbf72");
        if (r > 9) p3text(ctx, it.s > 0 ? "+" : "−", it.x, it.y + 0.5, {size:Math.min(15, r * 0.85), color:"#fff", w:800});
      });
      var msgY = 48;
      if (!metal && sh > 0.85 && sep < 0.9){
        var pl = prj(-(NX - 1) / 2 - 0.6, 0, (ND - 1) / 2), pr = prj((NX - 1) / 2 + 1.6, 0, (ND - 1) / 2);
        for (var q2 = 0; q2 <= NX; q2++){
          var xx = pl.x + (pr.x - pl.x) * q2 / NX, yy = pl.y + (pr.y - pl.y) * q2 / NX, fl = 0.5 + 0.5 * Math.sin(st.t * 30 + q2);
          ctx.strokeStyle = "rgba(255,90,70," + (0.5 + 0.45 * fl) * (1 - sep) + ")"; ctx.lineWidth = 2.4; ctx.beginPath();
          ctx.moveTo(xx - 5, yy - 7); ctx.lineTo(xx + 3, yy - 1); ctx.lineTo(xx - 3, yy + 2); ctx.lineTo(xx + 5, yy + 8); ctx.stroke();
        }
        p3tag(ctx, "+ face à +, − face à − : répulsion !", cx, msgY, {size:ph ? 11 : 12.5, bg:"rgba(224,72,62,.92)", color:"#fff"});
      }
      if (!metal && sep >= 0.9 && h < 5.4) p3tag(ctx, "le cristal se fend : dur mais cassant", cx, msgY, {size:ph ? 11 : 12.5, bg:"rgba(224,72,62,.92)", color:"#fff"});
      if (metal && sh > 0.85 && h < 5.4) p3tag(ctx, ph ? "les couches glissent : le métal plie" : "les couches glissent, la mer d'électrons suit : le métal plie", cx, msgY, {size:ph ? 11 : 12.5, bg:"rgba(47,191,113,.94)", color:"#05301a"});
      /* marteau tenu par une main, qui frappe le bloc supérieur par la gauche */
      var hp = prj(-(NX - 1) / 2 - 0.5, (NY - 1) / 2 - 0.4, 0);
      var swing = h < 0 ? -1.0 + 0.06 * Math.sin(st.t * 2.4) : h < 0.45 ? -1.0 + 1.0 * smooth(h / 0.45) : h < 1.1 ? 0 : -0.8 * smooth((h - 1.1) / 0.8);
      drawHammer(ctx, hp.x - d * 0.45, hp.y, d, swing);
      /* pile branchée sur le métal */
      if (metal && pT.value){
        var L = prj(-(NX - 1) / 2 - 0.5, -(NY - 1) / 2, 0), R2 = prj((NX - 1) / 2 + 0.5, -(NY - 1) / 2, 0), by = Math.min(H - 20, yF + (ph ? 40 : 34));
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#e0483e"; ctx.beginPath(); ctx.moveTo(R2.x, R2.y); ctx.lineTo(R2.x + 14, R2.y); ctx.lineTo(R2.x + 14, by); ctx.lineTo(cx + 34, by); ctx.stroke();
        ctx.strokeStyle = "#7c8aa0"; ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(L.x - 14, L.y); ctx.lineTo(L.x - 14, by); ctx.lineTo(cx - 34, by); ctx.stroke();
        var gb = ctx.createLinearGradient(0, by - 13, 0, by + 13); gb.addColorStop(0, "#f2c14e"); gb.addColorStop(0.5, "#d18f1d"); gb.addColorStop(1, "#7a4e0b");
        ctx.fillStyle = gb; p3rr(ctx, cx - 34, by - 13, 68, 26, 6); ctx.fill();
        ctx.fillStyle = "#3a3f4a"; p3rr(ctx, cx - 34, by - 13, 20, 26, 6); ctx.fill();
        p3text(ctx, "−", cx - 24, by, {size:16, color:"#fff", w:800}); p3text(ctx, "+", cx + 25, by, {size:16, color:"#3a2a00", w:800});
        p3text(ctx, "pile", cx + 5, by, {size:11, color:"#3a2a00", w:800});
        var ay = Math.max(84, cy - NY * d * 0.75 - 14);
        p3arrow(ctx, cx - NX * d * 0.3, ay, cx + NX * d * 0.3, ay, "#ffd36b", 2.5);
        p3text(ctx, "électrons → borne +", cx, ay - 13, {size:ph ? 10.5 : 11.5, color:"#ffe39a", w:800, halo:"rgba(10,18,32,.85)"});
      }
      return phase;
    }
    function drawHammer(ctx, x, y, d, ang){
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      /* la tête frappe à l'origine ; le manche part vers la gauche */
      var L = d * 2.6;
      var gw = ctx.createLinearGradient(0, -d * 0.13, 0, d * 0.13); gw.addColorStop(0, "#d9a96a"); gw.addColorStop(1, "#8a5a2b");
      ctx.fillStyle = gw; p3rr(ctx, -L, -d * 0.13, L, d * 0.26, d * 0.1); ctx.fill();
      var gh = ctx.createLinearGradient(-d * 0.35, 0, d * 0.35, 0); gh.addColorStop(0, "#5f6b7d"); gh.addColorStop(0.45, "#e3e8ef"); gh.addColorStop(1, "#3a4352");
      ctx.fillStyle = gh; p3rr(ctx, -d * 0.35, -d * 0.6, d * 0.7, d * 1.2, d * 0.12); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-d * 0.2, -d * 0.52, d * 0.08, d * 1.04);
      var hx = -L * 0.8;
      var gs = ctx.createLinearGradient(0, -d * 0.4, 0, d * 0.4); gs.addColorStop(0, "#f2c3a5"); gs.addColorStop(1, "#c98b6c");
      ctx.fillStyle = "#2f5fb3"; p3rr(ctx, hx - d * 1.5, -d * 0.34, d * 1.2, d * 0.68, d * 0.2); ctx.fill();
      ctx.fillStyle = gs; ctx.beginPath(); ctx.ellipse(hx, 0, d * 0.3, d * 0.34, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(120,70,50,.5)"; ctx.lineWidth = 1; for (var f = -1; f <= 1; f++){ ctx.beginPath(); ctx.moveTo(hx + f * d * 0.11, -d * 0.28); ctx.lineTo(hx + f * d * 0.11, d * 0.05); ctx.stroke(); }
      ctx.restore();
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, m = mS.value;
      boxEx.style.display = boxD.style.display = boxA.style.display = m === "pair" ? "" : "none";
      boxP.style.display = m === "met" ? "" : "none";
      if (btnH) btnH.style.display = m === "pair" ? "none" : "";
      ctx.clearRect(0, 0, W, H);
      if (m === "pair"){ drawPair(ctx, W, H, ph); return; }
      var metal = m === "met", phase = drawCrystal(ctx, W, H, ph, metal);
      p3tag(ctx, metal ? "Métal : cations dans une mer d'électrons" : "Cristal ionique : Na⁺ et Cl⁻ alternés", 10, 18, {align:"left", size:ph ? 11 : 12, bg:"rgba(255,255,255,.12)", color:"#fff"});
      ro.set(0, metal ? "faible χ des deux atomes (Δχ = 0)" : "2,23 (Na–Cl)");
      ro.set(1, metal ? "aucun : électrons mis en commun" : "≈ 71 % (transfert)");
      ro.set(2, metal ? "métallique" : "ionique");
      ro.set(3, metal ? (pT.value ? "dérivent vers la borne +" : "libres, agitation au hasard") : "sur les Cl⁻ (ions fixes)");
      var txt = metal ?
        (phase === "repos" || phase === "marteau" ? "Chaque atome du métal a cédé ses électrons de valence à une « mer » commune, qui baigne les cations et les tient ensemble." : "Le coup a fait glisser les couches de cations d'un cran ; la mer d'électrons se réarrange aussitôt et la cohésion reste la même : le métal se déforme sans casser (malléable, ductile).") + (pT.value ? " Pile branchée : les électrons libres gardent leur agitation mais dérivent tous vers la borne + : c'est le courant électrique (le sens conventionnel du courant est l'opposé)." : " Branche la pile pour voir la conduction.") :
        (phase === "repos" || phase === "marteau" ? "Chaque Na⁺ est entouré de Cl⁻ et inversement : l'attraction entre charges opposées tient le cristal, qui est dur. Ses ions sont bloqués : il ne conduit pas à l'état solide." : "Le coup décale une couche d'un ion : les Na⁺ se retrouvent face aux Na⁺ et les Cl⁻ face aux Cl⁻. Les charges de même signe se repoussent et le cristal se fend le long de ce plan : un solide ionique est dur mais cassant.");
      nt.set(txt, "ok");
    });
  }
});

/* =====================================================================
   4. Quand le gaz parfait se trompe : piston 3D et équation de van der Waals (L06)
   ===================================================================== */
var RB = 0.0831446;   /* R en L·bar·mol⁻¹·K⁻¹ */
/* constantes de van der Waals usuelles : a en L²·bar·mol⁻², b en L·mol⁻¹ ; M en g/mol */
var VDW = {
  id:{n:"gaz parfait", a:0, b:0, M:28, col:"#8a96a8", atoms:1},
  He:{n:"He", a:0.0346, b:0.0238, M:4.003, col:"#f0b13c", atoms:1},
  N2:{n:"N₂", a:1.370, b:0.0387, M:28.014, col:"#4f7fdc", atoms:2},
  CO2:{n:"CO₂", a:3.640, b:0.04267, M:44.009, col:"#5d6675", atoms:3}
};
var VMIN = 0.08, VMAX = 2.5;
function vdwP(g, V, T){ var G = VDW[g]; return RB * T / (V - G.b) - G.a / (V * V); }
function vdwZ(g, V, T){ return vdwP(g, V, T) * V / (RB * T); }

SFA.sim({
  id:"ch-gaz-reel", ch:"L06", tag:"Gaz",
  titre:"Quand le gaz parfait se trompe",
  resume:"Un piston en 3D où les molécules ont un volume et s'attirent. Comprime fort ou refroidis : PV/(nRT) quitte 1 sur la courbe. Compare He, N₂, CO₂ et le gaz parfait.",
  but:"Choisis le gaz, puis tire sur la poignée du piston (ou le curseur) pour comprimer une mole de gaz, et règle la température. La loupe montre les molécules à la bonne taille : regarde-les se serrer et s'attirer. Sur le graphique, Z = PV/(nRT) en fonction de P pour les quatre gaz : glisse sur la courbe pour changer la compression.",
  aRetenir:"Pour un gaz parfait, Z = PV/(nRT) = 1 toujours. Un gaz réel s'en écarte quand il est comprimé ou froid. Équation de van der Waals : (P + a·n²/V²)(V − n·b) = nRT. Le terme a (attractions entre molécules) fait baisser la pression sur les parois : Z < 1, surtout pour les gaz « collants » comme CO₂ et à basse température. Le terme b (volume propre des molécules) réduit la place disponible : Z > 1 aux fortes pressions, et c'est ce qui domine pour He, dont les attractions sont minuscules.",
  piege:"Ce n'est pas la nature du gaz qui compte pour un gaz parfait, mais elle compte pour un gaz réel : à mêmes n, V et T, CO₂ exerce en général une pression plus faible que He (ses attractions dominent) ; aux très fortes compressions et hautes températures, son volume propre plus grand peut inverser l'ordre. Autre piège : à pression ordinaire (quelques bars) tous ces gaz sont presque parfaits ; l'écart devient grand vers 50 à 500 bar. Et en dessous de 304 K (sa température critique), le CO₂ comprimé se liquéfie : on n'a plus un gaz.",
  build:function(k, S){
    var c = p3canvas(k, 0.66, 1.2), g = k.canvas(220);
    var st = {t:0, a:-0.35, b:0.32, V:1.0, mol:[], loupe:[], dragP:false};
    var gS = k.seg("Gaz", [["id", "Gaz parfait"], ["He", "He"], ["N2", "N₂"], ["CO2", "CO₂"]], "CO2", function(){ makeLoupe(); });
    var vS = k.slider("Volume V (n = 1 mol, poignée du piston)", 0, 100, 0.1, 0, "", function(u){ st.V = VMIN * Math.pow(VMAX / VMIN, u / 100); });
    var tS = k.slider("Température T", 310, 1000, 5, 320, "K");
    var ro = k.readouts(["Pression (modèle de van der Waals)", "Si le gaz était parfait", "Z = PV/(nRT)", "Ce qui domine"]);
    var nt = k.note("", "ok");
    function uOf(V){ return 100 * Math.log(V / VMIN) / Math.log(VMAX / VMIN); }
    vS.set(uOf(st.V));
    function setV(V){ st.V = Math.max(VMIN, Math.min(VMAX, V)); vS.set(uOf(st.V)); }
    /* molécules du cylindre (3D, coordonnées réduites) */
    for (var i = 0; i < 34; i++) st.mol.push({x:Math.random() * 2 - 1, y:Math.random(), z:Math.random() * 2 - 1, vx:Math.random() - 0.5, vy:Math.random() - 0.5, vz:Math.random() - 0.5});
    /* molécules de la loupe : disques durs qui s'attirent (dynamique 2D) */
    function makeLoupe(){
      st.loupe = [];
      for (var q = 0; q < 90; q++) st.loupe.push({x:(Math.random() - 0.5) * 1.4, y:(Math.random() - 0.5) * 1.4, vx:Math.random() - 0.5, vy:Math.random() - 0.5, an:Math.random() * 6.3, w:(Math.random() - 0.5) * 4});
    }
    makeLoupe();
    function loupeN(){ return Math.max(2, Math.min(90, Math.round(5.6 / st.V))); }
    function molR(){ var G = VDW[gS.value]; return G.b ? 0.075 * Math.pow(G.b / 0.04267, 1 / 3) : 0.022; }
    /* ---------- souris : poignée du piston, rotation de la vue ---------- */
    c.pointer(function(type, p){
      if (type === "down"){
        st.lx = p.x; st.ly = p.y;
        st.dragP = st.handle && Math.abs(p.x - st.handle.x) < 60 && Math.abs(p.y - st.handle.y) < 26;
        st.drag = true;
      }
      if (type === "drag"){
        if (st.dragP && st.cyl){ var hh = (st.cyl.yb - p.y - st.cyl.off) / st.cyl.hmax; setV(hh * VMAX); }
        else if (st.lx != null){ st.a = Math.max(-1.1, Math.min(1.1, st.a + (p.x - st.lx) * 0.01)); st.b = Math.max(0.05, Math.min(0.8, st.b + (p.y - st.ly) * 0.01)); }
        st.lx = p.x; st.ly = p.y;
      }
      if (type === "up"){ st.lx = null; st.drag = false; st.dragP = false; }
      if (type === "move"){ var on = st.handle && Math.abs(p.x - st.handle.x) < 60 && Math.abs(p.y - st.handle.y) < 26; c.cv.style.cursor = on ? "ns-resize" : "grab"; }
    });
    c.cv.style.cursor = "grab";
    /* graphique : glisser horizontalement = choisir la pression sur la courbe du gaz choisi */
    g.pointer(function(type, p){
      if ((type === "down" || type === "drag") && st.gx){
        var P = st.gx.inv(p.x), gg = gS.value, T = tS.value, lo = VMIN, hi = VMAX;
        if (P <= 0) return;
        for (var it = 0; it < 50; it++){ var mid = Math.sqrt(lo * hi); if (vdwP(gg, mid, T) > P) lo = mid; else hi = mid; }
        setV(Math.sqrt(lo * hi)); k.redraw();
      }
    });
    g.cv.style.cursor = "ew-resize";

    var lp = k.loop(function(dt){
      st.t += dt;
      var G = VDW[gS.value], T = tS.value, vsc = Math.sqrt(T / G.M) / Math.sqrt(320 / 28);
      /* cylindre : rebonds simples */
      st.mol.forEach(function(m){
        m.x += m.vx * dt * 1.6 * vsc; m.y += m.vy * dt * 1.6 * vsc / Math.max(0.15, st.V / VMAX); m.z += m.vz * dt * 1.6 * vsc;
        if (m.x > 0.85 || m.x < -0.85) m.vx *= -1; if (m.z > 0.85 || m.z < -0.85) m.vz *= -1; if (m.y > 0.95 || m.y < 0.05) m.vy *= -1;
        m.x = Math.max(-0.85, Math.min(0.85, m.x)); m.z = Math.max(-0.85, Math.min(0.85, m.z)); m.y = Math.max(0.05, Math.min(0.95, m.y));
      });
      /* loupe : disques durs + attraction (si a > 0), thermostat doux */
      var N = loupeN(), r = molR(), L = st.loupe, aF = G.a ? 0.9 * G.a / 3.64 * (320 / T) : 0, v0 = 0.55 * vsc, ek = 0;
      for (var i = 0; i < N; i++){
        var A = L[i];
        for (var j = i + 1; j < N; j++){
          var B = L[j], dx = B.x - A.x, dy = B.y - A.y, d2 = dx * dx + dy * dy, dm = 2 * r;
          if (d2 < 1e-10) continue;
          var d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
          if (d < dm){
            /* choc élastique et séparation */
            var rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
            if (rv < 0){ A.vx += rv * nx; A.vy += rv * ny; B.vx -= rv * nx; B.vy -= rv * ny; }
            var ov = (dm - d) / 2; A.x -= nx * ov; A.y -= ny * ov; B.x += nx * ov; B.y += ny * ov;
          } else if (aF && d < 3.2 * r){
            var f = aF * dt * 0.6; A.vx += nx * f; A.vy += ny * f; B.vx -= nx * f; B.vy -= ny * f;
          }
        }
      }
      for (var q = 0; q < N; q++){
        var M = L[q]; M.x += M.vx * dt; M.y += M.vy * dt; M.an += M.w * dt;
        var rr = Math.hypot(M.x, M.y), lim = 1 - r;
        if (rr > lim){ var ux = M.x / rr, uy = M.y / rr, vn = M.vx * ux + M.vy * uy; if (vn > 0){ M.vx -= 2 * vn * ux; M.vy -= 2 * vn * uy; } M.x = ux * lim; M.y = uy * lim; }
        ek += M.vx * M.vx + M.vy * M.vy;
      }
      var vm = Math.sqrt(ek / N) || 1e-6, kk = 1 + (v0 / vm - 1) * Math.min(1, dt * 3);
      for (q = 0; q < N; q++){ L[q].vx *= kk; L[q].vy *= kk; }
      k.redraw();
    });
    lp.play();

    /* ---------- dessin de la scène ---------- */
    function drawScene(ctx, W, H, ph){
      var G = VDW[gS.value], T = tS.value, V = st.V, P = vdwP(gS.value, V, T), Pid = RB * T / V;
      /* labo : mur carrelé, paillasse */
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#e9eef5"); bg.addColorStop(0.7, "#d5dde8"); bg.addColorStop(1, "#b8c3d2");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(120,140,170,.18)"; ctx.lineWidth = 1;
      for (var x = 0; x < W; x += 40){ ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H * 0.8); ctx.stroke(); }
      for (var y = 0; y < H * 0.8; y += 40){ ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
      var yT = H * 0.86;
      var tp = ctx.createLinearGradient(0, yT - 10, 0, H); tp.addColorStop(0, "#3b4659"); tp.addColorStop(0.15, "#2a3343"); tp.addColorStop(1, "#151b25");
      ctx.fillStyle = tp; ctx.fillRect(0, yT - 6, W, H - yT + 6);
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(0, yT - 6, W, 2);
      /* géométrie du cylindre (vu en 3D : ellipses de face selon l'inclinaison) */
      var cx = ph ? W * 0.24 : W * 0.27, R = Math.min(W * (ph ? 0.13 : 0.1), H * 0.16), ey = R * Math.max(0.12, Math.sin(st.b)) ;
      var yb = yT - 46, hmax = Math.max(60, yb - 70 - ey);
      var off = 6, h = hmax * V / VMAX + off;
      st.cyl = {yb:yb, hmax:hmax, off:off};
      /* plaque chauffante (couleur selon T) */
      var heat = (T - 310) / 690, pg = ctx.createLinearGradient(0, yb + 8, 0, yb + 40);
      pg.addColorStop(0, "#59616e"); pg.addColorStop(1, "#2c323c");
      p3shadow(ctx, cx, yT - 2, R * 1.6, 8, 0.4);
      ctx.fillStyle = pg; p3rr(ctx, cx - R * 1.45, yb + 8, R * 2.9, 34, 6); ctx.fill();
      ctx.fillStyle = "rgba(255," + Math.round(140 - 80 * heat) + ",40," + (0.25 + 0.7 * heat) + ")"; ctx.beginPath(); ctx.ellipse(cx, yb + 10, R * 1.2, Math.max(3, ey * 0.6), 0, 0, 7); ctx.fill();
      p3text(ctx, "T = " + p3int(T) + " K", cx, yb + 28, {size:ph ? 10.5 : 11.5, color:"#ffd9b0", w:800});
      /* fond du cylindre et gaz */
      var top = yb - h;
      var gz = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      gz.addColorStop(0, p3rgba(G.col, 0.18)); gz.addColorStop(0.5, p3rgba(G.col, 0.08 + 0.25 * Math.min(1, 0.25 / V))); gz.addColorStop(1, p3rgba(G.col, 0.22));
      ctx.fillStyle = gz; ctx.beginPath(); ctx.moveTo(cx - R, top); ctx.lineTo(cx - R, yb); ctx.ellipse(cx, yb, R, ey, 0, PI, 0, true); ctx.lineTo(cx + R, top); ctx.ellipse(cx, top, R, ey, 0, 0, PI, false); ctx.fill();
      /* molécules dans le cylindre (projection simple : x, z sur l'ellipse, y sur la hauteur) */
      var ca = Math.cos(st.a), sa = Math.sin(st.a), list = [];
      st.mol.forEach(function(m){ var xr = m.x * ca + m.z * sa, zr = -m.x * sa + m.z * ca; list.push({x:cx + xr * R * 0.92, y:yb - off * 0.5 - m.y * (h - off) + zr * ey * 0.9, z:zr}); });
      list.sort(function(u, v){ return u.z - v.z; });
      var mr = Math.max(2, Math.min(5, 2 + 2.5 * Math.min(1, 0.3 / V)));
      list.forEach(function(q){ p3ball(ctx, q.x, q.y, mr, G.col, 0.85); });
      /* paroi de verre */
      var gl = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      gl.addColorStop(0, "rgba(255,255,255,.32)"); gl.addColorStop(0.12, "rgba(255,255,255,.06)"); gl.addColorStop(0.8, "rgba(255,255,255,.04)"); gl.addColorStop(0.92, "rgba(255,255,255,.4)"); gl.addColorStop(1, "rgba(160,180,210,.3)");
      var ctop = yb - hmax - off - 18;
      ctx.fillStyle = gl; ctx.fillRect(cx - R, ctop, 2 * R, yb - ctop);
      ctx.strokeStyle = "rgba(90,110,140,.65)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(cx - R, ctop); ctx.lineTo(cx - R, yb); ctx.moveTo(cx + R, ctop); ctx.lineTo(cx + R, yb); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, yb, R, ey, 0, 0, PI); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, ctop, R, ey, 0, 0, 2 * PI); ctx.stroke();
      /* graduations en litres */
      var fz = ph ? 9.5 : 10.5;
      for (var Lv = 0.5; Lv <= VMAX + 1e-9; Lv += 0.5){ var yy = yb - off - hmax * Lv / VMAX; ctx.strokeStyle = "rgba(40,60,90,.55)"; ctx.beginPath(); ctx.moveTo(cx + R - 9, yy); ctx.lineTo(cx + R, yy); ctx.stroke(); p3text(ctx, p3fmt(Lv, 1) + " L", cx + R + 5, yy, {size:fz, color:"#33445e", align:"left", w:700}); }
      /* piston : disque d'acier, tige et poignée */
      var pgr = ctx.createLinearGradient(cx - R, 0, cx + R, 0); pgr.addColorStop(0, "#6c7686"); pgr.addColorStop(0.4, "#dfe5ee"); pgr.addColorStop(1, "#4b5464");
      ctx.fillStyle = pgr; ctx.beginPath(); ctx.moveTo(cx - R, top); ctx.lineTo(cx - R, top - 12); ctx.ellipse(cx, top - 12, R, ey, 0, PI, 0, false); ctx.lineTo(cx + R, top); ctx.ellipse(cx, top, R, ey, 0, 0, PI, false); ctx.fill();
      ctx.fillStyle = "#c6ced9"; ctx.beginPath(); ctx.ellipse(cx, top - 12, R, ey, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "#7d8796"; ctx.stroke();
      var rodTop = Math.min(top - 40, ctop - 26);
      var rg = ctx.createLinearGradient(cx - 5, 0, cx + 5, 0); rg.addColorStop(0, "#7d8796"); rg.addColorStop(0.5, "#eef2f7"); rg.addColorStop(1, "#5c6574");
      ctx.fillStyle = rg; ctx.fillRect(cx - 5, rodTop, 10, top - 12 - rodTop);
      var hgr = ctx.createLinearGradient(0, rodTop - 12, 0, rodTop + 6); hgr.addColorStop(0, "#e86d5c"); hgr.addColorStop(1, "#a8322a");
      ctx.fillStyle = hgr; p3rr(ctx, cx - 36, rodTop - 12, 72, 16, 8); ctx.fill();
      st.handle = {x:cx, y:rodTop - 4};
      if (!ph || W > 380) p3text(ctx, "tire ou pousse", cx, rodTop - 22, {size:fz, color:"#6b7a90", w:800});
      /* manomètre relié au bas du cylindre */
      var mx = cx + R + (ph ? 62 : 88), my = yb - 52, mR = ph ? 30 : 38;
      ctx.strokeStyle = "#7d8796"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx + R, yb - 12); ctx.lineTo(mx, yb - 12); ctx.lineTo(mx, my + mR); ctx.stroke();
      var dg = ctx.createRadialGradient(mx - mR * 0.3, my - mR * 0.3, 2, mx, my, mR); dg.addColorStop(0, "#ffffff"); dg.addColorStop(1, "#d3dae4");
      ctx.fillStyle = "#59616e"; ctx.beginPath(); ctx.arc(mx, my, mR + 4, 0, 7); ctx.fill();
      ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(mx, my, mR, 0, 7); ctx.fill();
      var PM = 800;
      for (var tk = 0; tk <= 8; tk++){ var an = PI * 0.75 + tk / 8 * PI * 1.5; ctx.strokeStyle = "#33445e"; ctx.lineWidth = tk % 2 ? 1 : 2; ctx.beginPath(); ctx.moveTo(mx + Math.cos(an) * mR * 0.78, my + Math.sin(an) * mR * 0.78); ctx.lineTo(mx + Math.cos(an) * mR * 0.92, my + Math.sin(an) * mR * 0.92); ctx.stroke(); }
      var na = PI * 0.75 + Math.min(1, P / PM) * PI * 1.5;
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(na) * mR * 0.8, my + Math.sin(na) * mR * 0.8); ctx.stroke();
      p3ball(ctx, mx, my, 3.5, "#33445e");
      p3text(ctx, "bar", mx, my + mR * 0.42, {size:9, color:"#6b7a90", w:800});
      ctx.fillStyle = "#0e1a12"; p3rr(ctx, mx - 34, my + mR + 8, 68, 18, 4); ctx.fill();
      p3text(ctx, (P >= 100 ? p3int(P) : p3fmt(P, 1)) + " bar", mx, my + mR + 17.5, {size:10.5, color:"#7dff9d", w:800});
      /* loupe : molécules à leur taille, attractions */
      var lR = ph ? Math.min(W * 0.27, H * 0.22) : Math.min(W * 0.2, H * 0.36), lx = ph ? W - lR - 12 : W - lR - 22, ly = ph ? lR + 14 : H * 0.44;
      var src = {x:cx + R * 0.3, y:yb - (h - off) * 0.5 - off};
      ctx.strokeStyle = "rgba(60,80,110,.5)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(lx - lR * 0.7, ly + lR * 0.7); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(60,80,110,.6)"; ctx.beginPath(); ctx.arc(src.x, src.y, 4, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lR, 0, 7); ctx.clip();
      var lg = ctx.createRadialGradient(lx - lR * 0.3, ly - lR * 0.3, 5, lx, ly, lR); lg.addColorStop(0, "#fbfdff"); lg.addColorStop(1, "#dbe4ef");
      ctx.fillStyle = lg; ctx.fillRect(lx - lR, ly - lR, 2 * lR, 2 * lR);
      var N = loupeN(), r = molR(), Lm = st.loupe;
      if (G.a){
        ctx.strokeStyle = "rgba(224,115,90,.45)"; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]);
        for (var i = 0; i < N; i++) for (var j = i + 1; j < N; j++){ var dx = Lm[j].x - Lm[i].x, dy = Lm[j].y - Lm[i].y, dd = Math.hypot(dx, dy); if (dd < 3.2 * r && dd > 2 * r * 0.98){ ctx.beginPath(); ctx.moveTo(lx + Lm[i].x * lR, ly + Lm[i].y * lR); ctx.lineTo(lx + Lm[j].x * lR, ly + Lm[j].y * lR); ctx.stroke(); } }
        ctx.setLineDash([]);
      }
      for (var q = 0; q < N; q++){
        var M = Lm[q], X = lx + M.x * lR, Y = ly + M.y * lR, rp = r * lR;
        if (G.atoms === 1){ p3ball(ctx, X, Y, rp, G.col); }
        else if (G.atoms === 2){ var ux = Math.cos(M.an) * rp * 0.45, uy = Math.sin(M.an) * rp * 0.45; p3ball(ctx, X - ux, Y - uy, rp * 0.62, G.col); p3ball(ctx, X + ux, Y + uy, rp * 0.62, G.col); }
        else { var vx = Math.cos(M.an) * rp * 0.62, vy = Math.sin(M.an) * rp * 0.62; p3ball(ctx, X - vx, Y - vy, rp * 0.42, "#e0483e"); p3ball(ctx, X + vx, Y + vy, rp * 0.42, "#e0483e"); p3ball(ctx, X, Y, rp * 0.45, "#505a68"); }
      }
      ctx.restore();
      ctx.strokeStyle = "#3a4558"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(lx, ly, lR, 0, 7); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lx, ly, lR - 5, -2.4, -1.4); ctx.stroke();
      var hx0 = lx + lR * 0.72, hy0 = ly + lR * 0.72;
      if (!ph){ ctx.strokeStyle = "#5b4636"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx0 + 4, hy0 + 4); ctx.lineTo(hx0 + lR * 0.45, hy0 + lR * 0.45); ctx.stroke(); ctx.lineCap = "butt"; }
      var lt = G.b ? "molécules à l'échelle" : "points sans volume ni attraction";
      p3tag(ctx, lt, lx, ly + lR + 15, {size:ph ? 10 : 11, bg:"rgba(255,255,255,.9)", color:"#33445e"});
      if (G.a && !ph) p3text(ctx, "- - - attraction", lx, ly - lR - 12, {size:10.5, color:"#c0533a", w:800});
      p3tag(ctx, G.n + " · n = 1 mol", 10, H - 16, {align:"left", size:ph ? 11 : 12, bg:"rgba(15,27,45,.85)", color:"#fff"});
    }
    /* ---------- graphique Z(P) ---------- */
    function drawGraph(ctx, W, H, ph){
      var T = tS.value, gsel = gS.value;
      ctx.fillStyle = "#fbfcfe"; ctx.fillRect(0, 0, W, H);
      var pmax = 0; ["He", "N2", "CO2"].forEach(function(q){ pmax = Math.max(pmax, vdwP(q, VMIN, T)); });
      var step = pmax > 1200 ? 400 : pmax > 600 ? 200 : 100, PX = Math.ceil(pmax / step) * step;
      var x0 = 46, x1 = W - 14, y0 = 14, y1 = H - 34, Z0 = 0.2, Z1 = 1.8;
      function X(P){ return x0 + P / PX * (x1 - x0); } function Y(Z){ return y1 - (Z - Z0) / (Z1 - Z0) * (y1 - y0); }
      st.gx = {inv:function(x){ return (x - x0) / (x1 - x0) * PX; }};
      ctx.strokeStyle = "#e6ebf2"; ctx.lineWidth = 1;
      for (var P = 0; P <= PX; P += step){ ctx.beginPath(); ctx.moveTo(X(P), y0); ctx.lineTo(X(P), y1); ctx.stroke(); p3text(ctx, p3int(P), X(P), y1 + 12, {size:10, color:"#6b7a90", w:700}); }
      for (var Z = 0.2; Z <= 1.81; Z += 0.4){ ctx.beginPath(); ctx.moveTo(x0, Y(Z)); ctx.lineTo(x1, Y(Z)); ctx.stroke(); p3text(ctx, p3fmt(Z, 1), x0 - 6, Y(Z), {size:10, color:"#6b7a90", w:700, align:"right"}); }
      ctx.strokeStyle = "#a3adba"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      p3text(ctx, "P (bar)", x1, y1 + 25, {size:10.5, color:"#33445e", w:800, align:"right"});
      p3text(ctx, "Z", 14, y0 + 6, {size:12, color:"#33445e", w:800});
      /* gaz parfait : Z = 1 */
      ctx.strokeStyle = VDW.id.col; ctx.lineWidth = gsel === "id" ? 3.5 : 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(1)); ctx.lineTo(x1, Y(1)); ctx.stroke(); ctx.setLineDash([]);
      var labs = [];
      ["He", "N2", "CO2"].forEach(function(q){
        var G = VDW[q], on = q === gsel, last = null;
        ctx.strokeStyle = G.col; ctx.lineWidth = on ? 3.5 : 1.8; ctx.globalAlpha = on ? 1 : 0.7; ctx.beginPath();
        for (var i = 0; i <= 200; i++){ var V = VMAX * Math.pow(VMIN / VMAX, i / 200), Pp = vdwP(q, V, T), Zz = Pp * V / (RB * T); var xx = X(Pp), yy = Y(Math.max(Z0, Math.min(Z1, Zz))); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); last = [xx, yy]; }
        ctx.stroke(); ctx.globalAlpha = 1;
        labs.push({t:G.n, x:last[0], y:last[1], col:G.col});
      });
      labs.forEach(function(L){ p3tag(ctx, L.t, Math.min(L.x, x1 - 18), Math.max(y0 + 24, Math.min(y1 - 8, L.y - 12)), {size:10.5, bg:"rgba(255,255,255,.92)", color:L.col === "#f0b13c" ? "#9a6a08" : L.col, stroke:L.col}); });
      p3tag(ctx, "gaz parfait : Z = 1", x0 + 8, Y(1) - 13, {align:"left", size:10.5, bg:"rgba(255,255,255,.92)", color:"#5b6b82"});
      /* point courant */
      var Pc = vdwP(gsel, st.V, T), Zc = gsel === "id" ? 1 : Pc * st.V / (RB * T); if (gsel === "id") Pc = RB * T / st.V;
      var cxp = X(Pc), cyp = Y(Math.max(Z0, Math.min(Z1, Zc)));
      if (cxp <= x1 + 1){
        ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(cxp, y1); ctx.lineTo(cxp, cyp); ctx.stroke(); ctx.setLineDash([]);
        p3ball(ctx, cxp, cyp, 7, VDW[gsel].col);
      }
      p3text(ctx, "T = " + p3int(T) + " K · glisse sur le graphique", x1, y0 + 4, {size:10.5, color:"#6b7a90", w:700, align:"right"});
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, gg = gS.value, G = VDW[gg], T = tS.value, V = st.V;
      ctx.clearRect(0, 0, W, H);
      drawScene(ctx, W, H, ph);
      drawGraph(g.ctx, g.W, g.H, ph);
      var Pid = RB * T / V, P = gg === "id" ? Pid : vdwP(gg, V, T), Z = P * V / (RB * T);
      p3out(vS, p3fmt(V, V < 1 ? 3 : 2) + " <i>L</i>");
      function fb(x){ return x >= 100 ? p3int(x) + " bar" : p3fmt(x, 1) + " bar"; }
      ro.set(0, fb(P)); ro.set(1, fb(Pid)); ro.set(2, p3fmt(Z, 3));
      var aT = G.a / (V * V), bT = G.b;
      ro.set(3, gg === "id" ? "rien : Z = 1" : Math.abs(Z - 1) < 0.02 ? "≈ gaz parfait" : Z < 1 ? "les attractions (Z < 1)" : "le volume propre (Z > 1)");
      if (gg === "id") nt.set("Gaz parfait : molécules sans volume et sans attraction, P = nRT/V = " + fb(Pid) + " et Z = 1 quelle que soit la compression. Choisis un vrai gaz pour voir l'écart.", "ok");
      else nt.set("van der Waals : P = nRT/(V − nb) − a·n²/V² = " + p3fmt(RB * T / (V - G.b), 1) + " − " + p3fmt(aT, 1) + " = " + fb(P) + ". Le volume propre (nb = " + p3fmt(bT, 4) + " L, " + p3fmt(100 * bT / V, 1) + " % de V) fait monter P ; les attractions (a·n²/V² = " + p3fmt(aT, 1) + " bar) la font baisser. " + (Z < 0.98 ? "Ici les attractions l'emportent : Z = " + p3fmt(Z, 3) + " < 1." : Z > 1.02 ? "Ici le volume propre l'emporte : Z = " + p3fmt(Z, 3) + " > 1." : "Les deux effets sont faibles ou se compensent : Z ≈ 1.") + " <i>a = " + p3fmt(G.a, G.a < 0.1 ? 4 : 3) + " L²·bar/mol², b = " + p3fmt(G.b, G.b < 0.04 ? 4 : 5) + " L/mol.</i>", "ok");
    });
  }
});

/* =====================================================================
   5. Dilutions en série au labo (L01)
   ===================================================================== */
var DIL_N0 = 500;           /* points dessinés dans la fiole mère (100 mL) */
var DIL_VF = 100;           /* volume des fioles jaugées (mL) */
/* couleur d'une solution de sulfate de cuivre (indicative) : A = ε·ℓ·C par canal, ℓ = 5 cm */
function cuColor(C, a){
  var e = [10, 2.2, 0.25], l = 5;
  var r = Math.round(255 * Math.pow(10, -e[0] * l * C)), g = Math.round(255 * Math.pow(10, -e[1] * l * C)), b = Math.round(255 * Math.pow(10, -e[2] * l * C));
  r = Math.round(r * 0.96 + 4); g = Math.round(g * 0.97 + 6); b = Math.round(b * 0.98 + 5);
  return "rgba(" + r + "," + g + "," + b + "," + (a == null ? 1 : a) + ")";
}
function sciTxt(x, d){ if (x >= 0.1 && x < 1000) return p3fmt(x, 3); return p3sci(x, d == null ? 2 : d); }

SFA.sim({
  id:"ch-dilutions-cascade", ch:"L01", tag:"Dilution",
  titre:"Dilutions en série au labo",
  resume:"Une rangée de fioles jaugées : on prélève à la pipette, on complète au trait de jauge, et la couleur pâlit d'une fiole à l'autre. Une loupe compte les particules de soluté : celles de la pipette sont exactement celles qu'on retrouve dans la fiole suivante.",
  but:"Choisis le prélèvement (le facteur de dilution F), le nombre d'étapes et la concentration de la solution mère, puis regarde la cascade. La loupe suit la pipette ; tu peux aussi l'attraper et la promener sur les fioles. Clique sur une fiole pour lire sa concentration et la quantité qu'on y prélève.",
  aRetenir:"Une dilution conserve la quantité de soluté : n = C₁·V₁ = C₂·V₂. Prélever V_p et compléter à V_f divise la concentration par F = V_f / V_p. Après k étapes identiques : C_k = C₀ / F^k (trois dilutions au 1/10 divisent par 1000). Les particules transférées par la pipette sont toutes dans la fiole suivante : seul le volume qui les contient a changé.",
  piege:"On complète jusqu'au trait de jauge, on n'ajoute pas V_f d'eau : prélever 10 mL et ajouter 100 mL d'eau donne 110 mL et F = 11, pas 10. Et les facteurs se multiplient, ils ne s'additionnent pas : deux dilutions au 1/10 font un facteur 100, pas 20. Enfin, la fiole qu'on vient de pipeter garde sa concentration : elle a juste perdu du volume.",
  build:function(k, S){
    var c = p3canvas(k, 0.74, 1.0);
    var st = {t:0, run:0, auto:true, flasks:[], pip:{n:0, dots:[], x:0, y:0, fill:0, C:0, from:0}, loupe:{x:null, y:null, free:false}, sel:1, dragL:false, plan:null};
    var fS = k.seg("Prélèvement et fiole jaugée", [["50", "50 mL → 100 mL"], ["20", "20 mL → 100 mL"], ["10", "10 mL → 100 mL"], ["5", "5 mL → 100 mL"]], "10", function(){ reset(); });
    var nS = k.slider("Nombre d'étapes de dilution", 1, 5, 1, 3, "", function(){ reset(); });
    var cS = k.slider("Concentration de la solution mère C₀", 0.01, 0.5, 0.005, 0.1, "mol/L", function(){ st.flasks.forEach(function(f){ f.C = cS.value / Math.pow(F(), f.i); }); });
    var aT = k.toggle("Animation automatique", true, function(v){ st.auto = v; });
    k.button("Recommencer", function(){ reset(); }, true);
    var lT = k.toggle("La loupe suit la pipette", true, function(v){ st.loupe.free = !v; });
    var ro = k.readouts(["Facteur par étape F = V_fiole / V_pipette", "Fiole choisie", "Quantité prélevée à la pipette", "Après toutes les étapes"]);
    var nt = k.note("", "ok");
    function F(){ return DIL_VF / +fS.value; }
    function VP(){ return +fS.value; }
    /* ---------- état : fioles et points de soluté ---------- */
    function uniformDot(){ var a = Math.random() * 2 * PI, r = Math.sqrt(Math.random()) * 0.86; return {u:Math.cos(a) * r, w:Math.sin(a) * r * 0.86 + 0.06}; }
    function reset(){
      var n = nS.value, C0 = cS.value;
      st.flasks = [];
      for (var i = 0; i <= n; i++) st.flasks.push({i:i, V:i === 0 ? DIL_VF : 0, C:C0 / Math.pow(F(), i), dots:[], mix:1, water:0, stop:i === 0, wob:0, done:i === 0});
      for (var q = 0; q < DIL_N0; q++){ var d = uniformDot(); st.flasks[0].dots.push({u:d.u, w:d.w, u0:d.u, w0:d.w}); }
      st.pip = {n:0, dots:[], fill:0, C:0, from:0};
      st.run = 0; st.sel = Math.min(st.sel, n); buildPlan();
    }
    /* chronologie d'une étape : aller (1 s), aspirer (1,2 s), transporter (1,2 s), vider (1,2 s), compléter (1,6 s), boucher et retourner (1,6 s) */
    var PH = [["aller", 1.0], ["aspire", 1.2], ["porte", 1.2], ["vide", 1.2], ["eau", 1.6], ["melange", 1.6]];
    function buildPlan(){ var p = [], t = 0, n = nS.value; for (var s = 0; s < n; s++) PH.forEach(function(q){ p.push({s:s, ph:q[0], t0:t, t1:t + q[1]}); t += q[1]; }); p.T = t + 3; st.plan = p; }
    reset();
    /* avance la simulation jusqu'au temps tt (les actions ponctuelles sont faites une seule fois) */
    function stepTo(tt){
      var P = st.plan, n = nS.value;
      if (tt > P.T){ reset(); return; }
      P.forEach(function(q){
        if (tt < q.t0) return;
        var fr = Math.min(1, (tt - q.t0) / (q.t1 - q.t0)), A = st.flasks[q.s], B = st.flasks[q.s + 1];
        if (q.ph === "aspire"){
          if (!q.did){
            /* prélèvement : on choisit au hasard les points contenus dans V_p (arrondi aléatoire du nombre attendu) */
            q.did = true; A.stop = false;
            var expct = A.dots.length * VP() / A.V, m = Math.floor(expct) + (Math.random() < expct - Math.floor(expct) ? 1 : 0);
            var take = [];
            for (var j = 0; j < m && A.dots.length; j++){ var idx = Math.floor(Math.random() * A.dots.length); take.push(A.dots.splice(idx, 1)[0]); }
            st.pip.dots = take.map(function(){ return {a:Math.random(), b:Math.random() * 2 - 1}; }); st.pip.n = take.length; st.pip.C = A.C; st.pip.from = q.s;
            A.V0 = A.V;
          }
          A.V = A.V0 - VP() * fr; st.pip.fill = fr;
        }
        if (q.ph === "vide"){
          if (!q.did){ q.did = true; B.V = 0; B.dots = []; B.Cnow = st.pip.C; }
          st.pip.fill = 1 - fr; B.V = VP() * fr;
          var want = Math.round(st.pip.n * fr);
          while (B.dots.length < want){ var d = uniformDot(); B.dots.push({u:d.u, w:d.w, u0:(Math.random() - 0.5) * 0.7, w0:0.62 + Math.random() * 0.22}); }
          B.mix = 0;
          if (fr >= 1 && !q.done2){ q.done2 = true; st.pip.dots = []; st.pip.n = 0; }
        }
        if (q.ph === "eau"){ B.V = VP() + (DIL_VF - VP()) * fr; B.water = fr; B.mix = 0.18 * fr; }
        if (q.ph === "melange"){ B.stop = true; B.mix = 0.18 + 0.82 * smooth(fr); B.wob = Math.sin(fr * PI * 4) * 0.55 * Math.sin(fr * PI); if (fr >= 1){ B.done = true; B.wob = 0; } }
      });
    }
    /* ---------- souris : loupe à attraper, fiole à choisir ---------- */
    c.pointer(function(type, p){
      var L = st.loupe;
      if (type === "down"){
        if (L.x != null && Math.hypot(p.x - L.x, p.y - L.y) < L.r + 6){ st.dragL = true; L.free = true; lT.set(false); L.dx = p.x - L.x; L.dy = p.y - L.y; return; }
        (st.hit || []).forEach(function(h){ if (Math.abs(p.x - h.x) < h.w / 2 && p.y > h.y0 && p.y < h.y1) st.sel = h.i; });
        k.redraw();
      }
      if (type === "drag" && st.dragL){ L.x = p.x - L.dx; L.y = p.y - L.dy; }
      if (type === "up") st.dragL = false;
      if (type === "move"){ var on = L.x != null && Math.hypot(p.x - L.x, p.y - L.y) < L.r + 6; var onF = false; (st.hit || []).forEach(function(h){ if (Math.abs(p.x - h.x) < h.w / 2 && p.y > h.y0 && p.y < h.y1) onF = true; }); c.cv.style.cursor = on ? "grab" : onF ? "pointer" : "default"; }
    });
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.auto){ st.run += dt; stepTo(st.run); }
      k.redraw();
    });
    lp.play();

    /* ---------- dessin ---------- */
    function layout(W, H, ph){
      var n = st.flasks.length, D = Math.min(W / n * (ph ? 0.62 : 0.56), H * 0.2), pos = [];
      for (var i = 0; i < n; i++) pos.push({x:W * (i + 0.5) / n, yb:H * 0.84});
      return {D:D, pos:pos};
    }
    /* géométrie d'une fiole : bulbe (cercle aplati) + col avec trait de jauge */
    function geom(x, yb, D){ var R = D / 2, cyB = yb - R * 0.92; return {x:x, yb:yb, R:R, cyB:cyB, nw:D * 0.2, nb:cyB - R * 0.86, mark:cyB - R * 0.86 - D * 0.62, top:cyB - R * 0.86 - D * 0.95}; }
    function levelY(g, V){ /* hauteur du liquide pour un volume V (mL) */
      if (V <= 0) return g.yb;
      if (V <= 92) return g.yb - (g.yb - g.nb) * (1 - Math.pow(1 - V / 92, 0.75)) * 0.995;
      return g.nb - (g.nb - g.mark) * (V - 92) / 8;
    }
    function flaskPath(ctx, g){
      var R = g.R, nw = g.nw / 2, a = Math.asin(Math.min(0.99, nw / R));
      ctx.beginPath(); ctx.moveTo(g.x - nw, g.top); ctx.lineTo(g.x - nw, g.cyB - R * Math.cos(a) * 0.98);
      ctx.ellipse(g.x, g.cyB, R, R * 0.98, 0, -PI / 2 - a, PI * 0.5 - 0.42, true);
      ctx.lineTo(g.x + R * Math.sin(0.42) , g.yb);
      ctx.ellipse(g.x, g.cyB, R, R * 0.98, 0, PI * 0.5 + 0.42, -PI / 2 + a, true);
      ctx.lineTo(g.x + nw, g.top); ctx.closePath();
    }
    function drawFlask(ctx, f, g, sel, ph){
      ctx.save();
      if (f.wob){ ctx.translate(g.x, g.cyB); ctx.rotate(f.wob); ctx.translate(-g.x, -g.cyB); }
      p3shadow(ctx, g.x, g.yb + 3, g.R * 0.9, 5, 0.25);
      /* liquide */
      var ly = levelY(g, f.V);
      ctx.save(); flaskPath(ctx, g); ctx.clip();
      if (f.V > 0){
        var Cfull = f.C, Cdrop = f.Cnow || f.C, m = f.mix;
        var lg = ctx.createLinearGradient(0, ly, 0, g.yb);
        if (m >= 0.999 || f.i === 0) { lg.addColorStop(0, cuColor(Cfull, 0.92)); lg.addColorStop(1, cuColor(Cfull, 0.92)); }
        else {
          /* avant mélange : la goutte concentrée au fond, l'eau claire au-dessus */
          var Cb = Cdrop * (1 - m) + Cfull * m, Ct = Cfull * m;
          lg.addColorStop(0, cuColor(Ct, 0.9)); lg.addColorStop(Math.max(0.05, 1 - 0.4 - 0.6 * m), cuColor(Ct * 0.5 + Cb * 0.5, 0.9)); lg.addColorStop(1, cuColor(Cb, 0.92));
        }
        ctx.fillStyle = lg; ctx.fillRect(g.x - g.R - 2, ly, 2 * g.R + 4, g.yb - ly + 2);
        ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(g.x - g.R, ly, 2 * g.R, 1.5);
        /* points de soluté (dans le bulbe) */
        var mm = smooth(f.mix);
        ctx.fillStyle = "rgba(10,40,110,.9)";
        f.dots.forEach(function(d, i){
          var u = d.u0 + (d.u - d.u0) * mm, w = d.w0 + (d.w - d.w0) * mm, jx = 0.02 * Math.sin(st.t * 3 + i), jy = 0.02 * Math.cos(st.t * 2.6 + i * 1.7);
          var X = g.x + (u + jx) * g.R * 0.92, Y = g.cyB + (w + jy) * g.R * 0.92;
          if (Y < ly + 1) return;
          ctx.beginPath(); ctx.arc(X, Y, ph ? 1.1 : 1.3, 0, 7); ctx.fill();
        });
      }
      ctx.restore();
      /* verre */
      flaskPath(ctx, g);
      var gg = ctx.createLinearGradient(g.x - g.R, 0, g.x + g.R, 0);
      gg.addColorStop(0, "rgba(255,255,255,.35)"); gg.addColorStop(0.2, "rgba(255,255,255,.08)"); gg.addColorStop(0.75, "rgba(255,255,255,.05)"); gg.addColorStop(0.9, "rgba(255,255,255,.45)"); gg.addColorStop(1, "rgba(170,190,215,.3)");
      ctx.fillStyle = gg; ctx.fill(); ctx.strokeStyle = sel ? "#e0a21c" : "rgba(70,90,120,.7)"; ctx.lineWidth = sel ? 2.4 : 1.3; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(g.x, g.cyB, g.R * 0.78, PI * 1.08, PI * 1.38); ctx.stroke();
      /* trait de jauge */
      ctx.strokeStyle = "#1b2a40"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(g.x, g.mark, g.nw / 2, 2, 0, 0, PI); ctx.stroke();
      /* bouchon */
      if (f.stop){ var bg = ctx.createLinearGradient(g.x - g.nw, 0, g.x + g.nw, 0); bg.addColorStop(0, "#2f6fd0"); bg.addColorStop(1, "#163c78"); ctx.fillStyle = bg; p3rr(ctx, g.x - g.nw * 0.75, g.top - g.nw * 0.9, g.nw * 1.5, g.nw * 1.2, 3); ctx.fill(); }
      ctx.restore();
    }
    function drawPipette(ctx, x, yTip, D, fill, C){
      var L = D * 1.75, tw = Math.max(2.5, D * 0.05), bw = D * 0.16, yB = yTip - L * 0.45, yTop = yTip - L, yMark = yTip - L * 0.72;
      /* liquide (de la pointe jusqu'au niveau) */
      var lev = yTip - (yTip - yMark) * fill;
      ctx.save();
      ctx.fillStyle = cuColor(C, 0.92);
      if (fill > 0){
        ctx.fillRect(x - tw / 2, Math.max(lev, yB + bw * 1.2), tw, yTip - Math.max(lev, yB + bw * 1.2));
        if (lev < yB + bw * 1.2){ ctx.beginPath(); ctx.ellipse(x, yB, bw / 2, bw * 1.2, 0, 0, 7); ctx.fill(); if (lev < yB - bw * 1.2) ctx.fillRect(x - tw / 2, lev, tw, yB - bw * 1.2 - lev); }
      }
      ctx.strokeStyle = "rgba(60,80,110,.75)"; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(x - tw / 2, yTip); ctx.lineTo(x - tw / 2, yB + bw * 1.15); ctx.ellipse(x, yB, bw / 2, bw * 1.2, 0, PI / 2 + 0.25, PI * 1.5 - 0.25, false); ctx.lineTo(x - tw / 2, yTop); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + tw / 2, yTip); ctx.lineTo(x + tw / 2, yB + bw * 1.15); ctx.ellipse(x, yB, bw / 2, bw * 1.2, 0, PI / 2 - 0.25, -PI / 2 + 0.25, true); ctx.lineTo(x + tw / 2, yTop); ctx.stroke();
      ctx.strokeStyle = "#1b2a40"; ctx.beginPath(); ctx.moveTo(x - tw, yMark); ctx.lineTo(x + tw, yMark); ctx.stroke();
      /* poire aspirante */
      var pg = ctx.createRadialGradient(x - D * 0.06, yTop - D * 0.2, 2, x, yTop - D * 0.14, D * 0.18); pg.addColorStop(0, "#ff8a7a"); pg.addColorStop(1, "#a8241c");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(x, yTop - D * 0.14, D * 0.13, D * 0.17, 0, 0, 7); ctx.fill();
      ctx.restore();
      return {x:x, yTop:yTop, yB:yB, yTip:yTip};
    }
    function drawPissette(ctx, x, y, D, on){
      ctx.save();
      var w = D * 0.42, h = D * 0.7;
      var gb = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gb.addColorStop(0, "#dfe7f1"); gb.addColorStop(0.4, "#ffffff"); gb.addColorStop(1, "#b8c4d4");
      ctx.fillStyle = gb; p3rr(ctx, x - w / 2, y - h, w, h, w * 0.3); ctx.fill(); ctx.strokeStyle = "rgba(70,90,120,.5)"; ctx.stroke();
      ctx.fillStyle = "#e05a4a"; ctx.fillRect(x - w * 0.18, y - h - D * 0.08, w * 0.36, D * 0.08);
      ctx.strokeStyle = "#cfd8e4"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - h - D * 0.08); ctx.quadraticCurveTo(x, y - h - D * 0.4, x - D * 0.4, y - h - D * 0.32); ctx.stroke();
      if (on){ ctx.strokeStyle = "rgba(150,200,255,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - D * 0.4, y - h - D * 0.32); ctx.quadraticCurveTo(x - D * 0.55, y - h - D * 0.25, x - D * 0.6, y - h + D * 0.1); ctx.stroke(); }
      ctx.restore();
    }
    /* tout le décor et les objets ; main = premier passage (zones cliquables, position de la pipette) */
    function world(ctx, W, H, ph, main){
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#eef3f8"); bg.addColorStop(1, "#d9e1eb");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var wx = W * 0.64, ww = W * 0.3, wy = 10, wh = H * 0.22;
      var sky = ctx.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, "#bfe0ff"); sky.addColorStop(1, "#eaf5ff");
      ctx.fillStyle = sky; ctx.fillRect(wx, wy, ww, wh); ctx.strokeStyle = "#c6d0dc"; ctx.lineWidth = 5; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
      var Lo = layout(W, H, ph), D = Lo.D, yb0 = Lo.pos[0].yb;
      var tg = ctx.createLinearGradient(0, yb0, 0, H); tg.addColorStop(0, "#c9d2de"); tg.addColorStop(1, "#a3afc0");
      ctx.fillStyle = tg; ctx.fillRect(0, yb0, W, H - yb0); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(0, yb0, W, 2);
      if (main) st.hit = [];
      var G = st.flasks.map(function(f, i){ return geom(Lo.pos[i].x, Lo.pos[i].yb, D); });
      st.flasks.forEach(function(f, i){
        var g = G[i]; drawFlask(ctx, f, g, i === st.sel, ph);
        if (main) st.hit.push({i:i, x:g.x, w:D * 1.1, y0:g.top - 10, y1:g.yb + 34});
        var fs = ph ? 10 : 11, nm = i === 0 ? "mère" : "fiole " + i;
        p3text(ctx, nm, g.x, g.yb + 13, {size:fs, color:"#33445e", w:800});
        p3text(ctx, f.done || i === 0 ? sciTxt(f.C, 1) : "…", g.x, g.yb + 27, {size:fs, color:"#0f1b2d", w:800});
      });
      /* pipette et pissette selon la phase en cours */
      var P = st.plan, tt = st.run, cur = null;
      P.forEach(function(q){ if (tt >= q.t0 && tt < q.t1) cur = q; });
      var pipX = G[0].x + D * 0.75, pipTip = G[0].top - 6;
      if (cur){
        var fr = (tt - cur.t0) / (cur.t1 - cur.t0), A = G[cur.s], B = G[cur.s + 1], hi = Math.min(A.top, B.top) - 8, dip = A.nb + D * 0.12;
        if (cur.ph === "aller"){ pipX = A.x; pipTip = hi + (dip - hi) * smooth(fr); }
        else if (cur.ph === "aspire"){ pipX = A.x; pipTip = dip; }
        else if (cur.ph === "porte"){ var yEnd = B.top + D * 0.25; pipX = A.x + (B.x - A.x) * smooth((fr - 0.25) / 0.5); pipTip = fr < 0.3 ? dip + (hi - dip) * smooth(fr / 0.3) : fr < 0.7 ? hi : hi + (yEnd - hi) * smooth((fr - 0.7) / 0.3); }
        else if (cur.ph === "vide"){ pipX = B.x; pipTip = B.top + D * 0.25; }
        else { pipX = B.x + D * 0.62; pipTip = B.top - 6; }
        if (cur.ph === "eau" || cur.ph === "melange") drawPissette(ctx, B.x + D * 0.95, B.yb - 2, D, cur.ph === "eau");
      } else if (tt > 0){ var lg = G[G.length - 1]; pipX = lg.x - D * 0.62; pipTip = lg.top - 6; }
      var pp = drawPipette(ctx, pipX, pipTip, D, st.pip.fill, st.pip.C || cS.value);
      if (st.pip.fill > 0.05){
        ctx.fillStyle = "rgba(10,40,110,.9)"; var bw = D * 0.16;
        st.pip.dots.forEach(function(d, i){ if (i >= st.pip.n) return; var X = pp.x + d.b * bw * 0.3, Y = pp.yB + (d.a * 2 - 1) * bw * 0.95 + Math.sin(st.t * 3 + i) * 0.4; ctx.beginPath(); ctx.arc(X, Y, ph ? 1 : 1.2, 0, 7); ctx.fill(); });
      }
      return {G:G, D:D, pp:pp, cur:cur, tt:tt};
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480;
      var Wd = world(ctx, W, H, ph, true), G = Wd.G, D = Wd.D, pp = Wd.pp, cur = Wd.cur, tt = Wd.tt;
      p3text(ctx, "concentrations en mol/L", 10, H - 9, {size:ph ? 9.5 : 10.5, color:"#5b6b82", w:700, align:"left"});
      /* loupe : la scène redessinée ×3 autour du point visé ; elle compte les points */
      var Lp = st.loupe; Lp.r = ph ? 46 : 56;
      if (!Lp.free || Lp.x == null){ Lp.x = Math.min(W - Lp.r - 10, Math.max(Lp.r + 10, pp.x + Lp.r + D * 0.5)); Lp.y = Lp.r + 40; }
      Lp.x = Math.max(Lp.r, Math.min(W - Lp.r, Lp.x)); Lp.y = Math.max(Lp.r, Math.min(H - Lp.r, Lp.y));
      var tx = Lp.free ? Lp.x : pp.x, ty = Lp.free ? Lp.y : pp.yB, mag = 3;
      if (!Lp.free){
        ctx.strokeStyle = "rgba(58,69,88,.45)"; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(Lp.x - Lp.r * 0.7, Lp.y + Lp.r * 0.7); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(58,69,88,.6)"; ctx.beginPath(); ctx.arc(tx, ty, Lp.r / mag, 0, 7); ctx.stroke();
      }
      ctx.save(); ctx.beginPath(); ctx.arc(Lp.x, Lp.y, Lp.r, 0, 7); ctx.clip();
      ctx.translate(Lp.x, Lp.y); ctx.scale(mag, mag); ctx.translate(-tx, -ty);
      world(ctx, W, H, ph, false);
      ctx.restore();
      ctx.strokeStyle = "#3a4558"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(Lp.x, Lp.y, Lp.r, 0, 7); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(Lp.x, Lp.y, Lp.r - 5, -2.4, -1.5); ctx.stroke();
      ctx.strokeStyle = "#5b4636"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(Lp.x + Lp.r * 0.72, Lp.y + Lp.r * 0.72); ctx.lineTo(Lp.x + Lp.r * 1.08, Lp.y + Lp.r * 1.08); ctx.stroke(); ctx.lineCap = "butt";
      var lab;
      if (!Lp.free) lab = st.pip.fill > 0.05 ? "pipette : " + st.pip.n + " points" : "pipette vide";
      else { var under = null; G.forEach(function(g, i){ if (Math.abs(Lp.x - g.x) < D * 0.6 && Lp.y > g.top - 10 && Lp.y < g.yb + 5) under = i; }); lab = under == null ? "glisse-moi sur une fiole" : (under === 0 ? "mère" : "fiole " + under) + " : " + st.flasks[under].dots.length + " points"; }
      var lfs = ph ? 10.5 : 11.5, lw = p3tw(ctx, lab, lfs, 800) + 14, lx = Math.max(lw / 2 + 4, Math.min(W - lw / 2 - 4, Lp.x));
      p3tag(ctx, lab, lx, Lp.y + Lp.r + 15, {size:lfs, bg:"rgba(15,27,45,.85)", color:"#fff"});
      /* titre de la phase en cours */
      var phTxt = !cur ? (tt > 0 ? "série terminée" : "") : cur.ph === "aller" || cur.ph === "aspire" ? "on prélève " + VP() + " mL " + (cur.s === 0 ? "de la mère" : "de la fiole " + cur.s) : cur.ph === "porte" ? "on transporte les " + st.pip.n + " points" : cur.ph === "vide" ? "on vide la pipette dans la fiole " + (cur.s + 1) : cur.ph === "eau" ? "on complète à l'eau jusqu'au trait (100 mL)" : "on bouche et on retourne : la solution est homogène";
      if (phTxt) p3tag(ctx, "Étape " + (cur ? cur.s + 1 : nS.value) + " / " + nS.value + (phTxt ? " · " + phTxt : ""), 10, 18, {align:"left", size:ph ? 10.5 : 12, bg:"rgba(15,27,45,.85)", color:"#fff"});
      /* ---- afficheurs ---- */
      var Fv = F(), n = nS.value, sel = Math.min(st.sel, n), Cs = cS.value / Math.pow(Fv, sel), np = Cs * VP() / 1000;
      ro.set(0, DIL_VF + " / " + VP() + " = " + p3fmt(Fv, 0));
      ro.set(1, (sel === 0 ? "mère" : "fiole " + sel) + " : C = " + sciTxt(Cs, 2) + " mol/L");
      ro.set(2, sel === n ? "aucun (dernière fiole)" : "n = C·V = " + p3sci(np, 2) + " mol");
      ro.set(3, "÷ " + p3int(Math.pow(Fv, n)) + " : C" + ["₀", "₁", "₂", "₃", "₄", "₅"][n] + " = " + sciTxt(cS.value / Math.pow(Fv, n), 2) + " mol/L");
      var ptVal = cS.value * DIL_VF / 1000 / DIL_N0;
      nt.set("La pipette prend " + VP() + " mL, soit 1/" + p3fmt(Fv, 0) + " de ce que contient la fiole : les points qu'elle emporte se retrouvent tous dans la fiole suivante, où l'on complète à 100 mL. La quantité transférée ne change pas, seul le volume change : C est divisée par " + p3fmt(Fv, 0) + " à chaque étape. Ici, 1 point ≈ " + p3sci(ptVal, 1) + " mol d'ions Cu²⁺ (≈ " + p3sci(ptVal * 6.022e23, 1) + " ions) ; quand il reste moins d'un point attendu, c'est le hasard du dessin, pas la chimie. <i>Couleur du sulfate de cuivre indicative.</i>", "ok");
    });
  }
});

})();
