/* Chimie BA1 · aides graphiques communes (3D maison, sphères ombrées, orbitales) — utilisées par plusieurs chapitres */
(function(){
if (window.UC) return;
var UC = window.UC = {};
UC.COL = {H:"#e6ebf2", C:"#4b5563", N:"#2f5fb3", O:"#d6392f", F:"#5fb85a", Cl:"#2fa84f", Br:"#9a2a1c", I:"#7b3fb0", B:"#d08a3c", S:"#d9b61c", P:"#e08a2a", Xe:"#7b5cb8", A:"#1f4b9e", X:"#2a9d6f", Na:"#7b5cb8", Ag:"#9aa5b1"};
UC.shade = function(hex, f){
  var n = parseInt(String(hex).replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
};
/* sphère ombrée (reflet en haut à gauche) */
UC.ball = function(ctx, x, y, r, hex, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, UC.shade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, UC.shade(hex, -0.45));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, 7); ctx.fill(); ctx.restore();
};
/* ombre portée douce sous un objet */
UC.floor = function(c, cx, cy, rx, ry){
  var ctx = c.ctx; ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
  var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, "rgba(15,27,45,.16)"); g.addColorStop(1, "rgba(15,27,45,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
};
/* liaison en bâtonnet (liseré sombre + reflet) */
UC.stick = function(ctx, x1, y1, x2, y2, w, col, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.lineCap = "round";
  col = col || "#8a95a3";
  ctx.strokeStyle = UC.shade(col, -0.35); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = w * 0.62; ctx.stroke();
  ctx.strokeStyle = UC.shade(col, 0.65); ctx.lineWidth = Math.max(1, w * 0.18); ctx.beginPath(); ctx.moveTo(x1 - w * 0.12, y1 - w * 0.12); ctx.lineTo(x2 - w * 0.12, y2 - w * 0.12); ctx.stroke();
  ctx.restore();
};
UC.rot = function(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
};
/* projection en perspective : st = {a, b} ; renvoie {x, y, z, s} (s = facteur d'échelle de perspective) */
UC.proj = function(p, st, sc, cx, cy){
  var r = UC.rot(p, st.a, st.b), s = 1 / (1 - r[2] * 0.11);
  return {x:cx + r[0] * sc * s, y:cy - r[1] * sc * s, z:r[2], s:s};
};
/* glisser = tourner ; le dessin reprend aussitôt. st = {a, b} ; rotation lente automatique tant qu'on ne touche pas */
UC.view = function(k, c, st, auto){
  st.auto = auto !== false;
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; st.auto = false; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b = Math.max(-1.5, Math.min(1.5, st.b + (p.y - st.ly) * 0.012)); st.lx = p.x; st.ly = p.y; k.redraw(); }
    if (type === "up"){ st.lx = null; st.drag = false; }
  });
  var lp = k.loop(function(dt){ if (st.auto && !st.drag){ st.a += dt * 0.35; k.redraw(); } });
  lp.play(); return lp;
};
/* lobe d'orbitale (goutte) partant de (x, y) dans la direction ang, longueur L, largeur W */
UC.lobe = function(ctx, x, y, ang, L, W, col, alpha, stroke){
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * 0.25, -W * 0.9, L * 0.95, -W * 0.9, L, 0); ctx.bezierCurveTo(L * 0.95, W * 0.9, L * 0.25, W * 0.9, 0, 0); ctx.closePath();
  var g = ctx.createLinearGradient(0, 0, L, 0); g.addColorStop(0, UC.rgba(col, alpha * 0.9)); g.addColorStop(1, UC.rgba(col, alpha * 0.35));
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = stroke || UC.rgba(col, Math.min(1, alpha + 0.35)); ctx.stroke(); ctx.restore();
};
UC.rgba = function(hex, a){
  var n = parseInt(String(hex).replace("#", ""), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
};
/* bulle de texte sur canvas (vignette d'étiquette) */
UC.tag = function(S, c, s, x, y, col, o){ o = o || {}; S.draw.label(c, s, x, y, {color:col, size:o.size || 12, align:o.align, base:o.base, math:o.math}); };
/* dégradé de fond pour une scène (ciel de laboratoire) */
UC.bg = function(c, top, bot){
  var ctx = c.ctx, g = ctx.createLinearGradient(0, 0, 0, c.H); g.addColorStop(0, top || "#f6f9fc"); g.addColorStop(1, bot || "#ffffff");
  ctx.fillStyle = g; ctx.fillRect(0, 0, c.W, c.H);
};
/* taille de police adaptée à la largeur du canvas (téléphone) */
UC.fs = function(c, base){ return c.W < 420 ? Math.max(10, base - 1) : base; };
})();

/* Chimie BA1 · c01 · Atome, spectre et radioactivité — contenu SFA original */
(function(){
var HC_EV_NM = 1239.84;      /* h·c en eV·nm */
var E1 = 13.606;             /* énergie d'ionisation de H, eV */

/* couleur approchée d'une longueur d'onde visible */
function wl2rgb(w){
  var r = 0, g = 0, b = 0, f;
  if (w >= 380 && w < 440){ r = -(w - 440) / 60; b = 1; }
  else if (w < 490){ g = (w - 440) / 50; b = 1; }
  else if (w < 510){ g = 1; b = -(w - 510) / 20; }
  else if (w < 580){ r = (w - 510) / 70; g = 1; }
  else if (w < 645){ r = 1; g = -(w - 645) / 65; }
  else if (w <= 750){ r = 1; }
  else return null;
  f = w < 420 ? 0.35 + 0.65 * (w - 380) / 40 : w > 700 ? 0.35 + 0.65 * (750 - w) / 50 : 1;
  return "rgb(" + Math.round(255 * r * f) + "," + Math.round(255 * g * f) + "," + Math.round(255 * b * f) + ")";
}

/* ---------- 1. Spectre de l'hydrogène ---------- */
SFA.sim({
  id:"uc-c01-bohr", ch:"c01", tag:"Atome",
  titre:"Spectre d'émission et d'absorption de l'hydrogène",
  resume:"Fais sauter l'électron d'un niveau de Bohr à l'autre : le photon, sa longueur d'onde et la série (Lyman, Balmer, Paschen) apparaissent.",
  but:"Clique deux niveaux sur le diagramme d'énergie (ou utilise les curseurs) : l'électron saute, un photon est émis ou absorbé, et la raie correspondante s'allume dans le spectre. Défi : retrouve la raie rouge de Balmer (656 nm).",
  aRetenir:"ΔE = 13,6·Z²·|1/n<sub>f</sub>² − 1/n<sub>i</sub>²| eV ; λ = hc/ΔE ; 1/λ = R<sub>H</sub>·Z²·|1/n<sub>f</sub>² − 1/n<sub>i</sub>²| avec R<sub>H</sub> = 1,097·10⁷ m⁻¹. Émission : n<sub>i</sub> > n<sub>f</sub> ; absorption : n<sub>i</sub> < n<sub>f</sub> (la raie est à la même longueur d'onde).",
  piege:"Une raie d'absorption occupe la même position qu'une raie d'émission : seule la lumière change (raie noire sur fond continu, ou raie colorée sur fond noir). Le modèle de Bohr n'est exact que pour un seul électron (H, He⁺, Li²⁺).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.05});
    var zs = k.select("Espèce à un électron", [[1,"H (Z = 1)"],[2,"He⁺ (Z = 2)"],[3,"Li²⁺ (Z = 3)"]], 1);
    var ni = k.slider("Niveau de départ n<sub>i</sub>", 1, 8, 1, 3, "");
    var nf = k.slider("Niveau d'arrivée n<sub>f</sub>", 1, 8, 1, 2, "");
    var ro = k.readouts(["Nature", "ΔE du photon", "ΔE (J)", "λ", "ν", "Série / zone"]);
    var nt = k.note("", "ok");
    k.button("Rejouer la transition", function(){ st.t = 0; lp.play(); });
    var names = {1:"Lyman", 2:"Balmer", 3:"Paschen", 4:"Brackett", 5:"Pfund"};
    var st = {t:0, key:"", pick:0, lay:null};
    function lam(Z, a, b){ return HC_EV_NM / (E1 * Z * Z * Math.abs(1/(a*a) - 1/(b*b))); }
    var lp = k.loop(function(dt){ if (st.t < 1){ st.t = Math.min(1, st.t + dt / 2.6); k.redraw(); } });
    lp.play();
    /* clic sur un niveau : 1er clic = départ, 2e clic = arrivée */
    c.pointer(function(type, p){
      if (type !== "down" || !st.lay) return;
      var L = st.lay; if (p.x > L.xr + 8 || p.y > L.ybot) return;
      var best = 0, bd = 1e9;
      for (var n = 1; n <= 8; n++){ var d = Math.abs(L.Y(n) - p.y); if (d < bd){ bd = d; best = n; } }
      if (bd > 14) return;
      if (st.pick === 0){ ni.set(best); st.pick = 1; } else { nf.set(best); st.pick = 0; }
      st.t = 0; lp.play(); k.redraw();
    });
    k.draw(function(){
      var Z = +zs.value, a = ni.value, b = nf.value, W = c.W, H = c.H, ctx = c.ctx, P = S.draw.palette;
      var key = Z + "," + a + "," + b; if (key !== st.key){ st.key = key; st.t = 0; lp.play(); }
      c.clear(); UC.bg(c, "#f8fafd", "#ffffff");
      var em = a > b, same = a === b, narrow = W < 460;
      var rowH = Math.round(H * 0.54);
      /* ---------- A. l'atome (gauche) ---------- */
      var ax = W * (narrow ? 0.27 : 0.25), ay = rowH * 0.5 + 4, R8 = Math.min(ax - 8, rowH * 0.5 - 10);
      function rad(n){ return 12 + (R8 - 12) * (n - 1) / 7; }
      for (var n = 1; n <= 8; n++){
        var on = (n === a || n === b);
        ctx.beginPath(); ctx.arc(ax, ay, rad(n), 0, 7); ctx.lineWidth = on ? 1.8 : 1; ctx.strokeStyle = on ? "rgba(31,75,158,.7)" : "rgba(138,149,163,.35)"; ctx.setLineDash(on ? [] : [3, 4]); ctx.stroke(); ctx.setLineDash([]);
      }
      S.draw.glow(c, ax, ay, 26, "#c0321d", 0.35);
      UC.ball(ctx, ax, ay, 8 + Z, "#c0321d");
      S.draw.text(c, "+" + Z, ax, ay, {size:10, color:"#fff"});
      /* position de l'électron et du photon selon la phase */
      var t = st.t, e = same ? 0 : (em ? Math.max(0, Math.min(1, (t - 0.2) / 0.3)) : Math.max(0, Math.min(1, (t - 0.45) / 0.3)));
      e = e * e * (3 - 2 * e);
      var rr = same ? rad(a) : rad(a) + (rad(b) - rad(a)) * e, th = -0.9 + t * 7;
      var exx = ax + rr * Math.cos(th), eyy = ay + rr * Math.sin(th);
      var L0 = same ? 0 : lam(Z, a, b), col = same ? "#8a95a3" : (wl2rgb(L0) || (L0 < 380 ? "#7b3fb0" : "#b4281a"));
      if (!same){
        /* photon : paquet d'onde qui part de l'atome (émission) ou y arrive (absorption) */
        var pl = em ? Math.max(0, (t - 0.5) / 0.5) : Math.max(0, Math.min(1, t / 0.45));
        if ((em && t > 0.5) || (!em && t < 0.47)){
          var px = em ? ax + R8 * 0.4 + pl * (R8 * 1.4) : ax + R8 * 1.9 - pl * (R8 * 1.9 - R8 * 0.2), py = ay - R8 * 0.1;
          var wl = Math.max(7, Math.min(22, L0 / 40)), len = 46;
          ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.globalAlpha = em ? Math.max(0, 1 - pl * 0.4) : 1; ctx.beginPath();
          for (var i = 0; i <= 40; i++){ var u = i / 40, xw = em ? px - len + u * len : px + len - u * len; ctx.lineTo(xw, py + Math.sin(u * len / wl * 6.283) * 7 * Math.sin(u * 3.14159)); }
          ctx.stroke(); ctx.restore();
        }
      }
      UC.ball(ctx, exx, eyy, 6, "#1f4b9e"); S.draw.text(c, "e⁻", exx, eyy, {size:8, color:"#fff"});
      S.draw.text(c, "rayons non à l'échelle", ax, rowH - 6, {size:9.5, color:P.grey, weight:600});
      /* ---------- B. diagramme d'énergie (droite) ---------- */
      var xl = narrow ? W * 0.56 : W * 0.5, xr = W - (narrow ? 50 : 70), y0 = 24, ybot = rowH - 20;
      function Y(nn){ return ybot - (ybot - y0) * (1 - Math.pow(nn, -0.55)) / 0.72; }
      st.lay = {xr:xr, Y:Y, ybot:ybot + 14};
      S.draw.text(c, "E (eV) · échelle schématique", xl, 8, {size:9.5, color:P.grey, align:"left"});
      for (var nn = 1; nn <= 8; nn++){
        var yy = Y(nn), o2 = (nn === a || nn === b);
        S.draw.line(c, xl + 34, yy, xr, yy, o2 ? P.ink : P.grey, o2 ? 2.8 : 1.2);
        S.draw.text(c, "n=" + nn, xl + 16, yy, {size:o2 ? 11 : 9.5, color:o2 ? P.ink : P.grey});
        if (nn <= 3 || o2) S.draw.text(c, S.fmt(-E1 * Z * Z / (nn * nn), 1), xr + 4, yy, {size:o2 ? 10.5 : 9.5, color:o2 ? P.acc : P.grey, align:"left", weight:o2 ? 800 : 600});
      }
      S.draw.line(c, xl + 34, y0 - 2, xr, y0 - 2, P.red, 1, [4, 3]);
      S.draw.text(c, "0 : ionisé", xr, y0 - 12, {size:9.5, color:P.red, align:"right"});
      if (!same){ var xa = (xl + 34 + xr) / 2 + (em ? 10 : -10); S.draw.arrow(c, xa, Y(a), xa, Y(b), em ? P.red : P.teal, 2.8); }
      S.draw.text(c, (st.pick ? "clique : niveau d'arrivée" : "clique : niveau de départ"), (xl + xr) / 2 + 22, rowH - 3, {size:9.5, color:P.grey, weight:600});
      /* ---------- C. spectre ---------- */
      var sx0 = 14, sx1 = W - 14, top = rowH + 34, hh = Math.round(H * 0.15);
      S.draw.panel(c, 4, rowH + 8, W - 8, H - rowH - 14, {shadow:false, fill:"rgba(255,255,255,.7)"});
      var lo = Math.min(a, b), hi = Math.max(a, b); if (same){ lo = Math.min(a, 7); hi = lo + 1; }
      var Llim = HC_EV_NM / (E1 * Z * Z / (lo * lo)), Lfirst = lam(Z, lo, lo + 1);
      var span = Lfirst - Llim, lmin = Math.max(1, Llim - span * 0.12), lmax = Lfirst + span * 0.12;
      function LX(l){ return sx0 + (l - lmin) / (lmax - lmin) * (sx1 - sx0); }
      S.draw.text(c, "Série n = " + lo + (names[lo] ? " (" + names[lo] + ")" : "") + " · λ en nm", sx0 + 4, rowH + 22, {size:11, color:P.ink, align:"left"});
      if (em){ ctx.fillStyle = "#0b0f1a"; ctx.fillRect(sx0, top, sx1 - sx0, hh); }
      else {
        ctx.fillStyle = "#e9edf3"; ctx.fillRect(sx0, top, sx1 - sx0, hh);
        var dw = Math.max(0.5, (lmax - lmin) / 200);
        for (var w = Math.max(380, lmin); w <= Math.min(750, lmax); w += dw){ ctx.fillStyle = wl2rgb(w); ctx.fillRect(LX(w), top, LX(w + dw) - LX(w) + 0.8, hh); }
      }
      for (var m = lo + 1; m <= 14; m++){
        var Lm = lam(Z, lo, m), cm = wl2rgb(Lm), isSel = (m === hi && !same);
        if (LX(Lm) < sx0 || LX(Lm) > sx1) continue;
        ctx.strokeStyle = em ? (cm || "#9fb0c8") : "#050505"; ctx.lineWidth = isSel ? 4 : 2;
        ctx.globalAlpha = isSel ? Math.min(1, 0.25 + t * 1.2) : 0.9;
        ctx.beginPath(); ctx.moveTo(LX(Lm), top); ctx.lineTo(LX(Lm), top + hh); ctx.stroke(); ctx.globalAlpha = 1;
        if (isSel){ S.draw.line(c, LX(Lm), top + hh, LX(Lm), top + hh + 12, P.red, 2); S.draw.label(c, S.fmt(Lm, 1) + " nm", Math.max(40, Math.min(W - 40, LX(Lm))), top + hh + 24, {color:P.red, size:12}); }
      }
      S.draw.line(c, LX(Llim), top - 5, LX(Llim), top + hh + 5, P.amber, 1.5, [3, 3]);
      S.draw.text(c, "limite", LX(Llim) + 3, top - 9, {size:9.5, color:P.amber, align:"left"});
      var stp = Math.pow(10, Math.floor(Math.log10((lmax - lmin) / 4))), mm = (lmax - lmin) / 4 / stp; stp *= mm < 1.5 ? 1 : mm < 3.5 ? 2 : mm < 7.5 ? 5 : 10;
      for (var tk = Math.ceil(lmin / stp) * stp; tk <= lmax; tk += stp){ var tx = LX(tk); if (tx < sx0 + 14 || tx > sx1 - 14) continue; S.draw.line(c, tx, top + hh + 40, tx, top + hh + 45, P.grey, 1); S.draw.text(c, String(Math.round(tk)), tx, top + hh + 54, {size:9.5, color:P.grey}); }
      var zone0 = lmax < 380 ? "domaine UV" : lmin > 750 ? "domaine IR" : (lmin < 380 && lmax > 750) ? "UV + visible + IR" : lmin < 380 ? "UV + visible" : lmax > 750 ? "visible + IR" : "domaine visible";
      S.draw.text(c, zone0 + (same ? "" : em ? " · ÉMISSION" : " · ABSORPTION"), sx1 - 2, rowH + 22, {size:10.5, color:P.green, align:"right"});
      if (same){
        ro.set(0, "—"); ro.set(1, "0"); ro.set(2, "0"); ro.set(3, "—"); ro.set(4, "—"); ro.set(5, "—");
        nt.set("n<sub>i</sub> = n<sub>f</sub> : aucune transition, pas de photon. Choisis deux niveaux différents.", "warn");
        return;
      }
      var dE = E1 * Z * Z * Math.abs(1/(a*a) - 1/(b*b)), L1 = HC_EV_NM / dE;
      var EJ = 6.626e-34 * 2.998e8 / (L1 * 1e-9), nu = 2.998e8 / (L1 * 1e-9);
      var zone = L1 < 380 ? "UV" : L1 <= 750 ? "visible" : "IR";
      ro.set(0, em ? "émission" : "absorption"); ro.set(1, S.fmt(dE, 3) + " eV"); ro.set(2, S.sci(EJ, 3) + " J");
      ro.set(3, S.fmt(L1, 1) + " nm"); ro.set(4, S.sci(nu, 3) + " Hz"); ro.set(5, (names[lo] || "série " + lo) + " · " + zone);
      var win = (Z === 1 && lo === 2 && hi === 3) ? " Bravo : c'est la raie rouge H<sub>α</sub> de Balmer, 656 nm." : "";
      nt.set("Série de type " + (names[lo] || ("n = " + lo)) + " (retour vers n = " + lo + "). " + (Z > 1 ? "Pour Z = " + Z + ", les énergies sont multipliées par Z² = " + (Z*Z) + " et les longueurs d'onde divisées par " + (Z*Z) + " : les séries se décalent vers l'UV. " : "") + (a >= 8 || b >= 8 ? "Niveaux élevés : l'écart entre niveaux devient très petit." : "") + win, zone === "visible" ? "ok" : "warn");
    });
  }
});

/* ---------- 2. Décroissance radioactive et datation ---------- */
SFA.sim({
  id:"uc-c01-decroissance", ch:"c01", tag:"Radioactivité",
  titre:"Décroissance radioactive, demi-vie et datation au carbone 14",
  resume:"N(t) = N₀·2^(−t/T½) : suis la courbe, les noyaux restants, l'activité, puis calcule un âge à partir de la fraction de ¹⁴C restante.",
  but:"Choisis un radionucléide et un temps exprimé en demi-vies, ou passe en mode « Datation » pour retrouver l'âge d'un échantillon.",
  aRetenir:"N = N₀·e<sup>−λt</sup> = N₀·(½)<sup>t/T½</sup> ; λ = ln 2 / T½ ; A = λN ; t = (T½/ln 2)·ln(N₀/N). Après n demi-vies il reste ½ⁿ de noyaux : 50 %, 25 %, 12,5 %, 6,25 %…",
  piege:"« Après deux demi-vies, tout a disparu » est faux : il reste 25 %. La demi-vie ne dépend ni de la quantité présente ni de la température : le processus est aléatoire noyau par noyau, d'ordre 1. La datation au ¹⁴C devient peu fiable au-delà de ≈ 50 000 ans (moins de 0,3 % de ¹⁴C).",
  build:function(k, S){
    var c = k.canvas(400);
    var iso = [
      ["c14","¹⁴C — 5 730 ans", 5730 * 365.25 * 86400],
      ["i131","¹³¹I — 8,02 jours", 8.02 * 86400],
      ["tc99","⁹⁹ᵐTc — 6,01 heures", 6.01 * 3600],
      ["f18","¹⁸F — 109,8 minutes", 109.8 * 60],
      ["p32","³²P — 14,3 jours", 14.3 * 86400],
      ["u238","²³⁸U — 4,468·10⁹ ans", 4.468e9 * 365.25 * 86400]
    ];
    var mode = k.seg("Mode", [["dec","Décroissance"],["dat","Datation ¹⁴C"]], "dec");
    var sel = k.select("Radionucléide", iso.map(function(x){ return [x[0], x[1]]; }), "c14");
    var tn = k.slider("Temps écoulé t (en demi-vies)", 0, 10, 0.1, 2, "T½");
    var fr = k.slider("Fraction de ¹⁴C restante (mode datation)", 0.5, 100, 0.5, 25, "%");
    var ro = k.readouts(["Fraction restante", "Noyaux restants (sur 100)", "Temps écoulé", "Activité relative A/A₀", "λ"]);
    var nt = k.note("", "ok");
    function fmtT(s){
      var a = s / (365.25 * 86400);
      if (a >= 1) return a >= 1e6 ? S.sci(a, 3) + " ans" : S.fmt(a, a < 100 ? 1 : 0) + " ans";
      var d = s / 86400; if (d >= 1) return S.fmt(d, 2) + " jours";
      var h = s / 3600; if (h >= 1) return S.fmt(h, 2) + " heures";
      return S.fmt(s / 60, 1) + " minutes";
    }
    var dots = []; for (var i = 0; i < 100; i++) dots.push((i * 37 % 100) / 100 + (i % 7) * 1e-4);   /* ordre de disparition fixe pseudo-aléatoire */
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, dat = mode.value === "dat";
      var T = iso.filter(function(x){ return x[0] === sel.value; })[0];
      var T12 = dat ? iso[0][2] : T[2];
      var tt, f;
      if (dat){ f = fr.value / 100; tt = Math.log2(1 / f); } else { tt = tn.value; f = Math.pow(0.5, tt); }
      c.clear();
      var gw = Math.min(W * 0.62, W - 150);
      var cv = {ctx:ctx, W:gw, H:H}, ax = S.draw.axes(cv, {x0:0, x1:10, y0:0, y1:1, xl:"t / T½", yl:"N / N₀", stepX:1, stepY:0.25, l:44, r:10, t:16, b:34});
      S.draw.fn(cv, ax, function(x){ return Math.pow(0.5, x); }, P.acc, 2.6);
      for (var n = 1; n <= 4; n++){ S.draw.line(c, ax.X(n), ax.Y(0), ax.X(n), ax.Y(Math.pow(0.5, n)), P.light, 1, [3,3]); S.draw.line(c, ax.L, ax.Y(Math.pow(0.5, n)), ax.X(n), ax.Y(Math.pow(0.5, n)), P.light, 1, [3,3]); S.draw.dot(c, ax.X(n), ax.Y(Math.pow(0.5, n)), 3, P.grey); }
      S.draw.line(c, ax.X(tt), ax.Y(0), ax.X(tt), ax.Y(f), P.red, 1.5, [4,3]);
      S.draw.line(c, ax.L, ax.Y(f), ax.X(tt), ax.Y(f), P.red, 1.5, [4,3]);
      S.draw.dot(c, ax.X(tt), ax.Y(f), 6, P.red);
      /* grille de 100 noyaux */
      var gx = gw + 14, cell = Math.min(15, (W - gx - 8) / 10), left = Math.round(f * 100 + 1e-9);
      S.draw.text(c, "100 noyaux", gx + cell * 5, 18, {size:11, color:P.grey});
      var order = dots.map(function(v, idx){ return [v, idx]; }).sort(function(p, q){ return p[0] - q[0]; });
      var alive = {}; for (var j = 0; j < left; j++) alive[order[j][1]] = 1;
      for (var q = 0; q < 100; q++){
        var cx = gx + (q % 10) * cell + cell / 2, cy = 34 + Math.floor(q / 10) * cell + cell / 2;
        S.draw.dot(c, cx, cy, cell * 0.36, alive[q] ? P.acc : P.light);
      }
      S.draw.text(c, left + " restent", gx + cell * 5, 34 + 10 * cell + 12, {size:12, color:P.acc});
      var tsec = tt * T12, lam = Math.LN2 / T12;
      ro.set(0, S.fmt(f * 100, f < 0.01 ? 3 : 2) + " %");
      ro.set(1, String(left));
      ro.set(2, dat ? fmtT(tsec) : fmtT(tsec));
      ro.set(3, S.fmt(f, 4));
      ro.set(4, S.sci(lam, 3) + " s⁻¹");
      if (dat){
        nt.set("Âge = (T½ / ln 2) · ln(N₀/N) = " + S.fmt(5730 / Math.LN2, 0) + " ans × ln(" + S.fmt(1 / f, 2) + ") = " + fmtT(tsec) + ". " + (fr.value < 1 ? "Moins de 1 % de ¹⁴C : mesure très incertaine (limite pratique vers 50 000 ans)." : "Hypothèse : le rapport ¹⁴C/¹²C initial est celui de l'atmosphère actuelle (modèle simplifié)."), fr.value < 1 ? "warn" : "ok");
      } else {
        nt.set("Après " + S.fmt(tt, 1) + " demi-vies (" + fmtT(tsec) + ") il reste " + S.fmt(f * 100, 2) + " % des noyaux ; chaque seconde, " + S.sci(lam, 2) + " de la population restante se désintègre (A = λN).", tt > 7 ? "warn" : "ok");
      }
    });
  }
});

/* ---------- 3. Équations nucléaires ---------- */
(function(){
  var EL = "n H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U".split(" ");
  var NUC = [
    ["h3","³H",1,3,"b-"],["c14","¹⁴C",6,14,"b-"],["c11","¹¹C",6,11,"b+"],["f18","¹⁸F",9,18,"b+"],["p32","³²P",15,32,"b-"],
    ["co60","⁶⁰Co",27,60,"b-"],["i123","¹²³I",53,123,"ce"],["i131","¹³¹I",53,131,"b-"],["po210","²¹⁰Po",84,210,"a"],
    ["ra226","²²⁶Ra",88,226,"a"],["u238","²³⁸U",92,238,"a"],["tc99m","⁹⁹ᵐTc",43,99,"g"]
  ];
  var MODES = [["a","α (émission d'un noyau ⁴He)"],["b-","β⁻ (électron + antineutrino)"],["b+","β⁺ (positon + neutrino)"],["ce","Capture électronique"],["g","γ (transition isomérique)"]];
  function sup(n){ return String(n).replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }); }
  function sub(n){ return String(n).replace(/\d/g, function(d){ return "₀₁₂₃₄₅₆₇₈₉"[d]; }); }
  function daughter(Z, A, m){
    if (m === "a") return [Z - 2, A - 4];
    if (m === "b-") return [Z + 1, A];
    if (m === "b+" || m === "ce") return [Z - 1, A];
    return [Z, A];
  }
  function stableZ(A){ return A / (1.98 + 0.0155 * Math.pow(A, 2/3)); }
  SFA.sim({
    id:"uc-c01-equation-nucleaire", ch:"c01", tag:"Noyau",
    titre:"Équilibrer une équation nucléaire sur la carte des noyaux",
    resume:"Clique la case d'arrivée sur la carte des noyaux : A et Z se conservent, l'équation s'écrit toute seule.",
    but:"Zoom sur la carte (N, Z) autour du noyau père. Les cases vertes forment la vallée de stabilité, les bleues sont trop riches en neutrons, les orange trop riches en protons. Clique la case où va le noyau (α, β⁻, β⁺/capture ; clique le père pour γ) et vérifie les bilans de A et de Z. Défi : choisis le mode qui ramène le noyau vers le vert.",
    aRetenir:"α : A − 4, Z − 2. β⁻ : n → p + e⁻ + ν̄, Z + 1, A inchangé. β⁺ et capture électronique : p → n, Z − 1, A inchangé. γ : A et Z inchangés. Un noyau trop riche en neutrons émet β⁻ ; trop pauvre, β⁺ ou capture ; très lourd, α.",
    piege:"Le mode choisi doit être celui qui existe réellement : l'équation reste équilibrée même pour un mode impossible. En β⁻ le Z du fils augmente (et non l'inverse). Le neutrino ne porte ni charge ni nombre de masse, mais il doit apparaître dans l'équation complète.",
    build:function(k, S){
      var c = k.canvas(0, {ratio:1.2});
      var ns = k.select("Noyau père", NUC.map(function(n){ return [n[0], n[1] + " (Z = " + n[2] + ")"]; }), "c14");
      var ms = k.seg("Mode choisi", [["a","α"],["b-","β⁻"],["b+","β⁺"],["ce","Capture"],["g","γ"]], "b-");
      var ro = k.readouts(["Noyau fils", "Bilan A", "Bilan Z", "Mode réel du père"]);
      var nt = k.note("", "ok");
      var st = {t:1, key:"", g:null};
      var lp = k.loop(function(dt){ if (st.t < 1){ st.t = Math.min(1, st.t + dt / 1.1); k.redraw(); } }); lp.play();
      function cur(){ return NUC.filter(function(x){ return x[0] === ns.value; })[0]; }
      c.pointer(function(type, p){
        if (type !== "down" || !st.g) return;
        var g = st.g, n = cur(), i = Math.floor((p.x - g.x0) / g.cs), j = Math.floor((g.y0 + g.cs * 7 - p.y) / g.cs);
        if (i < 0 || i > 6 || j < 0 || j > 6) return;
        var dN = i - 3, dZ = j - 3, mm = null;
        if (dN === -2 && dZ === -2) mm = "a"; else if (dN === -1 && dZ === 1) mm = "b-"; else if (dN === 1 && dZ === -1) mm = (ms.value === "b+" ? "ce" : "b+"); else if (dN === 0 && dZ === 0) mm = "g";
        if (mm){ ms.set(mm); k.redraw(); }
      });
      k.draw(function(){
        var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, n = cur(), Z = n[2], A = n[3], N = A - Z, real = n[4], m = ms.value;
        var key = ns.value + m; if (key !== st.key){ st.key = key; st.t = 0; lp.play(); }
        var d = daughter(Z, A, m), Zd = d[0], Ad = d[1], sym = EL[Z], symd = EL[Zd] || "?";
        var part = {a:"⁴₂He", "b-":"e⁻ + ν̄", "b+":"e⁺ + ν", ce:"ν", g:"γ"}[m];
        var eq = sup(A) + sub(Z) + sym + (n[0] === "tc99m" ? "ᵐ" : "") + (m === "ce" ? " + e⁻" : "") + "  →  " + sup(Ad) + sub(Zd) + symd + " + " + part;
        UC.bg(c, "#f8fafd", "#ffffff"); ctx.clearRect(0, 0, 0, 0);
        S.draw.text(c, eq, W / 2, 24, {size:Math.min(19, W / 19), color:P.ink, math:true, weight:700});
        var Aright = Ad + ({a:4,"b-":0,"b+":0,ce:0,g:0})[m], Zright = Zd + ({a:2,"b-":-1,"b+":1,ce:0,g:0})[m];
        var Zleft = m === "ce" ? Z - 1 : Z, okA = A === Aright, okZ = Zleft === Zright;
        S.draw.label(c, "A : " + A + " = " + Aright + (okA ? " ✓" : " ✗"), W / 2 - 62, 50, {color:okA ? P.green : P.red, size:11.5});
        S.draw.label(c, "Z : " + Zleft + " = " + Zright + (okZ ? " ✓" : " ✗"), W / 2 + 62, 50, {color:okZ ? P.green : P.red, size:11.5});
        /* grille 7 × 7 centrée sur le père */
        var cs = Math.min(Math.floor((W - 46) / 7), 46), gx = Math.round((W - 7 * cs) / 2) + 6, gy = 66;
        st.g = {x0:gx, y0:gy, cs:cs};
        function sz(Ac){ return Ac / (1.98 + 0.0155 * Math.pow(Ac, 2/3)); }
        for (var i = 0; i < 7; i++) for (var j = 0; j < 7; j++){
          var NN = N + i - 3, ZZ = Z + j - 3; if (NN < 0 || ZZ < 0) continue;
          var x = gx + i * cs, y = gy + (6 - j) * cs, dz = ZZ - sz(NN + ZZ);
          var col = Math.abs(dz) < 0.6 ? "#bfe3cf" : dz > 0 ? S.draw.tint(P.orange, Math.min(0.55, 0.18 + 0.12 * dz)) : S.draw.tint(P.blue, Math.min(0.55, 0.18 + 0.12 * -dz));
          S.draw.rrect(c, x + 1, y + 1, cs - 2, cs - 2, 6); ctx.fillStyle = col; ctx.fill();
          if (i === 3 && j === 3){ ctx.lineWidth = 2.4; ctx.strokeStyle = P.acc; ctx.stroke(); }
        }
        /* axes de la grille */
        for (var q = 0; q < 7; q++){
          if (N + q - 3 >= 0) S.draw.text(c, String(N + q - 3), gx + q * cs + cs / 2, gy + 7 * cs + 10, {size:9.5, color:P.grey});
          if (Z + q - 3 >= 0) S.draw.text(c, String(Z + q - 3), gx - 9, gy + (6 - q) * cs + cs / 2, {size:9.5, color:P.grey});
        }
        S.draw.text(c, "N (neutrons)", gx + 7 * cs / 2, gy + 7 * cs + 24, {size:10.5, color:P.grey});
        S.draw.text(c, "Z", gx - 9, gy - 6, {size:10.5, color:P.grey});
        function cc(dN, dZ){ return [gx + (dN + 3.5) * cs, gy + (3 - dZ + 0.5) * cs]; }
        /* cases cliquables */
        [[-2,-2,"α","a"],[-1,1,"β⁻","b-"],[1,-1,"β⁺ / CE","b+"],[0,0,"",""]].forEach(function(o){
          var p = cc(o[0], o[1]); if (!o[2]) return;
          S.draw.text(c, o[2], p[0], p[1] + cs * 0.27, {size:10.5, color:(m === o[3] || (o[3] === "b+" && m === "ce")) ? P.red : P.ink, weight:800});
          ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1.2; S.draw.rrect(c, p[0] - cs / 2 + 3, p[1] - cs / 2 + 3, cs - 6, cs - 6, 5); ctx.stroke(); ctx.restore();
        });
        /* flèche père → fils (animée) et particule émise */
        var p0 = cc(0, 0), p1 = cc(N - 0 + (Ad - Zd - 0) - N - 0 - 0 + 0 - 0, 0), dN = (Ad - Zd) - N, dZ = Zd - Z;
        p1 = cc(dN, dZ); var t = Math.min(1, st.t * 1.4), e = t * t * (3 - 2 * t);
        UC.ball(ctx, p0[0], p0[1] - 4, cs * 0.28, "#1f4b9e"); S.draw.text(c, sym, p0[0], p0[1] - 4, {size:11, color:"#fff"});
        if (dN || dZ){
          var qx = p0[0] + (p1[0] - p0[0]) * e, qy = p0[1] - 4 + (p1[1] - 4 - p0[1] + 4) * e;
          S.draw.arrow(c, p0[0], p0[1] - 4, qx, qy, P.red, 2.6);
          UC.ball(ctx, p1[0], p1[1] - 4, cs * 0.28 * e, "#c0321d");
          if (e > 0.9) S.draw.text(c, symd, p1[0], p1[1] - 4, {size:11, color:"#fff"});
        }
        if (st.t > 0.4){ var u = (st.t - 0.4) / 0.6, px = p0[0] + (W - p0[0]) * 0.0 + u * 70, py = p0[1] - u * 40; ctx.save(); ctx.globalAlpha = 1 - u * 0.8; S.draw.label(c, {a:"⁴He", "b-":"e⁻", "b+":"e⁺", ce:"ν", g:"γ"}[m], Math.min(W - 24, px + 24), Math.max(70, py), {color:P.violet, size:11}); ctx.restore(); }
        /* légende */
        var ly = gy + 7 * cs + 40;
        [["#bfe3cf","stable"],[S.draw.tint(P.blue,.4),"trop de neutrons → β⁻"],[S.draw.tint(P.orange,.4),"trop de protons → β⁺, CE"]].forEach(function(l, i){
          var lx = [10, 66, W - 150][i]; if (W < 400) lx = [8, 62, 190][i];
          ctx.fillStyle = l[0]; ctx.fillRect(lx, ly - 5, 11, 11); S.draw.text(c, l[1], lx + 15, ly, {size:9.5, color:P.ink, align:"left", weight:600});
        });
        ro.set(0, sup(Ad) + symd + " (Z = " + Zd + ")"); ro.set(1, A + " = " + Aright + (okA ? " ✓" : " ✗")); ro.set(2, Zleft + " = " + Zright + (okZ ? " ✓" : " ✗"));
        var realName = MODES.filter(function(x){ return x[0] === real; })[0][1].split(" (")[0];
        ro.set(3, realName);
        nt.set("<b>" + eq + "</b><br>Le père est " + realName + (m === real ? " : ton choix est le bon." : " : l'équation que tu as choisie est équilibrée, mais ce n'est pas la désintégration observée pour ce noyau."), m === real ? "ok" : "warn");
      });
    }
  });
})();

/* ---------- 4. Radiopharmaceutiques : demi-vie effective ---------- */
SFA.sim({
  id:"uc-c01-radiopharma", ch:"c01", tag:"Médecine",
  titre:"Radiotraceurs : demi-vie physique, biologique et effective",
  resume:"Combine T½ physique et T½ biologique : 1/T<sub>eff</sub> = 1/T<sub>p</sub> + 1/T<sub>b</sub>. Compare l'activité restante dans l'organisme.",
  but:"Choisis un radionucléide médical et fais varier la demi-vie biologique (élimination par l'organisme). Observe la décroissance physique seule et la décroissance effective, puis l'activité restante au temps choisi.",
  aRetenir:"Deux processus de premier ordre en parallèle : les constantes s'additionnent, λ<sub>eff</sub> = λ<sub>p</sub> + λ<sub>b</sub>, donc 1/T<sub>eff</sub> = 1/T<sub>p</sub> + 1/T<sub>b</sub> et T<sub>eff</sub> est toujours plus courte que la plus courte des deux demi-vies. Pour l'imagerie, on choisit un T½ de quelques heures (¹⁸F, ⁹⁹ᵐTc) ; pour une thérapie ciblée, un T½ de plusieurs jours (¹³¹I, ¹⁷⁷Lu).",
  piege:"On ne fait pas la moyenne des deux demi-vies. Si T<sub>b</sub> ≫ T<sub>p</sub>, T<sub>eff</sub> ≈ T<sub>p</sub> ; si T<sub>p</sub> ≫ T<sub>b</sub>, T<sub>eff</sub> ≈ T<sub>b</sub>. Les valeurs de T<sub>b</sub> utilisées ici sont des ordres de grandeur pédagogiques : elles varient selon l'organe et le patient.",
  build:function(k, S){
    var c = k.canvas(380);
    var tr = [
      ["tc","⁹⁹ᵐTc (γ, imagerie)", 6.01],
      ["f18","¹⁸F (β⁺, TEP)", 109.77 / 60],
      ["ga68","⁶⁸Ga (β⁺, TEP)", 67.7 / 60],
      ["i123","¹²³I (capture, imagerie thyroïde)", 13.22],
      ["tl","²⁰¹Tl (capture, cœur)", 72.9],
      ["i131","¹³¹I (β⁻, thérapie thyroïde)", 8.02 * 24],
      ["lu","¹⁷⁷Lu (β⁻, thérapie ciblée)", 6.65 * 24]
    ];
    var sel = k.select("Radiotraceur", tr.map(function(x){ return [x[0], x[1] + " — T½ = " + S.fmt(x[2], 2) + " h"]; }), "tc");
    var tb = k.slider("Demi-vie biologique T<sub>b</sub>", 0.5, 400, 0.5, 24, "h");
    var tt = k.slider("Temps après l'injection t", 0, 72, 0.5, 12, "h");
    var ro = k.readouts(["T<sub>p</sub>", "T<sub>eff</sub>", "A/A₀ physique seule", "A/A₀ effective", "Désintégrations totales (rel. au cas sans élimination)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, T = tr.filter(function(x){ return x[0] === sel.value; })[0], Tp = T[2], Tb = tb.value, Te = Tp * Tb / (Tp + Tb), t = tt.value;
      c.clear();
      var ax = S.draw.axes(c, {x0:0, x1:72, y0:0, y1:1, xl:"t (h)", yl:"A / A₀", stepX:12, stepY:0.25});
      S.draw.fn(c, ax, function(x){ return Math.pow(0.5, x / Tp); }, P.grey, 2.2, [6,4]);
      S.draw.fn(c, ax, function(x){ return Math.pow(0.5, x / Te); }, P.acc, 2.8);
      var f1 = Math.pow(0.5, t / Tp), f2 = Math.pow(0.5, t / Te);
      S.draw.line(c, ax.X(t), ax.Y(0), ax.X(t), ax.Y(1), P.red, 1.2, [4,3]);
      S.draw.dot(c, ax.X(t), ax.Y(f1), 5, P.grey); S.draw.dot(c, ax.X(t), ax.Y(f2), 6, P.acc);
      S.draw.text(c, "physique seule (Tp)", ax.X(40), ax.Y(0.62), {size:12, color:P.grey, align:"left"});
      S.draw.text(c, "effective (Teff)", ax.X(40), ax.Y(0.42), {size:12, color:P.acc, align:"left"});
      ro.set(0, S.fmt(Tp, 2) + " h"); ro.set(1, S.fmt(Te, 2) + " h");
      ro.set(2, S.fmt(f1 * 100, 1) + " %"); ro.set(3, S.fmt(f2 * 100, 1) + " %");
      ro.set(4, S.fmt(Te / Tp * 100, 0) + " %");
      var short = Tp < 3, long = Tp > 48;
      nt.set("1/T<sub>eff</sub> = 1/" + S.fmt(Tp, 2) + " + 1/" + S.fmt(Tb, 1) + " → T<sub>eff</sub> = " + S.fmt(Te, 2) + " h. " + (Tb > 10 * Tp ? "L'élimination est lente devant la décroissance : T<sub>eff</sub> ≈ T<sub>p</sub>." : Tp > 10 * Tb ? "L'élimination domine : T<sub>eff</sub> ≈ T<sub>b</sub>." : "Les deux processus comptent.") + (short ? " T½ très court : examen à faire vite après la préparation du traceur." : "") + (long ? " T½ long : irradiation prolongée, adaptée à la thérapie plus qu'à l'imagerie." : ""), "ok");
    });
  }
});

/* ---------- 5. Défaut de masse et énergie de liaison ---------- */
(function(){
  var MH = 1.007825, MN = 1.008665, U = 931.494;
  var N = [
    ["h2","²H",1,2,2.014102],["h3","³H",1,3,3.016049],["he3","³He",2,3,3.016029],["he4","⁴He",2,4,4.002603],
    ["li6","⁶Li",3,6,6.015123],["li7","⁷Li",3,7,7.016004],["c12","¹²C",6,12,12.000000],["n14","¹⁴N",7,14,14.003074],
    ["o16","¹⁶O",8,16,15.994915],["ne20","²⁰Ne",10,20,19.992440],["fe56","⁵⁶Fe",26,56,55.934936],["ni62","⁶²Ni",28,62,61.928345],
    ["sn120","¹²⁰Sn",50,120,119.902195],["pb208","²⁰⁸Pb",82,208,207.976652],["u235","²³⁵U",92,235,235.043930],["u238","²³⁸U",92,238,238.050788]
  ];
  function be(n){ var dm = n[2] * MH + (n[3] - n[2]) * MN - n[4]; return {dm:dm, E:dm * U, a:dm * U / n[3]}; }
  SFA.sim({
    id:"uc-c01-defaut-masse", ch:"c01", tag:"Noyau",
    titre:"Défaut de masse et énergie de liaison par nucléon",
    resume:"Calcule Δm = Z·m(¹H) + N·m(n) − M(atome) puis E = Δm·c² et lis la courbe d'Aston : fusion et fission libèrent de l'énergie.",
    but:"Clique un point de la courbe (ou choisis un noyau) : le défaut de masse, l'énergie de liaison totale et par nucléon sont calculés. Active une réaction : des flèches montrent comment le système « monte » vers le sommet de la courbe en libérant de l'énergie.",
    aRetenir:"E<sub>L</sub> = Δm·c² avec 1 u = 931,5 MeV/c². La courbe E<sub>L</sub>/A passe par un maximum vers ⁵⁶Fe–⁶²Ni (≈ 8,8 MeV par nucléon) : la fusion des noyaux légers et la fission des noyaux lourds se rapprochent de ce maximum et libèrent de l'énergie.",
    piege:"Utilise des masses atomiques avec des atomes d'hydrogène ¹H (qui contiennent l'électron) pour les protons : les électrons s'annulent. Ne confonds pas énergie de liaison totale (MeV) et énergie par nucléon (MeV/nucléon). Le noyau le plus lié par nucléon est ⁶²Ni ; ⁵⁶Fe est le plus connu.",
    build:function(k, S){
      var c = k.canvas(0, {ratio:1.0});
      var ns = k.select("Noyau", N.map(function(n){ return [n[0], n[1] + " (A = " + n[3] + ")"]; }), "he4");
      var rx = k.select("Réaction de comparaison", [["none","aucune"],["dt","²H + ³H → ⁴He + n (fusion D–T)"],["pp","4 ¹H → ⁴He (fusion de l'hydrogène)"],["u","fission de ²³⁵U (ordre de grandeur)"]], "none");
      var ro = k.readouts(["Δm", "E<sub>L</sub> totale", "E<sub>L</sub>/A", "Réaction : énergie libérée"]);
      var nt = k.note("", "ok");
      var geo = null;
      c.pointer(function(type, p){
        if (type !== "down" && type !== "drag" || !geo) return;
        var best = null, bd = 1e9; N.forEach(function(n){ var d = Math.hypot(geo.X(n[3]) - p.x, geo.Y(be(n).a) - p.y); if (d < bd){ bd = d; best = n; } });
        if (bd < 26 && best[0] !== ns.value){ ns.set(best[0]); k.redraw(); }
      });
      k.draw(function(){
        var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, sel = N.filter(function(x){ return x[0] === ns.value; })[0], b = be(sel);
        var L = 40, R = 12, T = 26, B = 40, pw = W - L - R, ph = H - T - B;
        function X(A){ return L + Math.log(A) / Math.log(260) * pw; }
        function Y(v){ return T + ph * (1 - v / 10); }
        geo = {X:X, Y:Y};
        UC.bg(c, "#f8fafd", "#ffffff");
        /* zones fusion / fission */
        ctx.fillStyle = "rgba(36,119,90,.07)"; ctx.fillRect(L, T, X(56) - L, ph);
        ctx.fillStyle = "rgba(194,106,12,.07)"; ctx.fillRect(X(62), T, L + pw - X(62), ph);
        [0,2,4,6,8,10].forEach(function(v){ S.draw.line(c, L, Y(v), L + pw, Y(v), "#e3e7ed", 1); S.draw.text(c, String(v), L - 8, Y(v), {size:10, color:P.grey, align:"right"}); });
        [1,2,5,10,20,50,100,200].forEach(function(a){ S.draw.line(c, X(a), T + ph, X(a), T + ph + 4, P.grey, 1); S.draw.text(c, String(a), X(a), T + ph + 14, {size:10, color:P.grey}); });
        S.draw.line(c, L, T + ph, L + pw, T + ph, P.axis, 1.4); S.draw.line(c, L, T, L, T + ph, P.axis, 1.4);
        S.draw.text(c, "A (nombre de nucléons, échelle log)", L + pw, T + ph + 30, {size:10.5, color:P.grey, align:"right"});
        S.draw.text(c, "E_L / A (MeV par nucléon)", L + 4, 12, {size:10.5, color:P.ink, align:"left"});
        S.draw.text(c, "FUSION ↗", X(7), T + ph - 14, {size:10.5, color:P.green});
        S.draw.text(c, "↖ FISSION", X(160), T + ph - 14, {size:10.5, color:P.amber});
        var pts = N.slice().sort(function(p, q){ return p[3] - q[3]; });
        ctx.save(); ctx.strokeStyle = "#b8c4d6"; ctx.lineWidth = 2; ctx.beginPath();
        pts.forEach(function(n, i){ var x = X(n[3]), y = Y(be(n).a); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
        /* sommet */
        S.draw.label(c, "maximum ≈ 8,8 MeV (⁶²Ni, ⁵⁶Fe)", X(60), Y(8.8) - 16, {color:P.violet, size:10.5});
        /* réaction */
        var q = 0, txt = "", arr = [];
        var he = N.filter(function(x){ return x[0] === "he4"; })[0];
        if (rx.value === "dt"){ q = (2.014102 + 3.016049 - 4.002603 - MN) * U; txt = "Δm = (2,014102 + 3,016049) − (4,002603 + 1,008665) = " + S.fmt(q / U, 6) + " u → Q = " + S.fmt(q, 2) + " MeV"; arr = [[N[0], he], [N[1], he]]; }
        if (rx.value === "pp"){ q = (4 * MH - 4.002603) * U; txt = "Δm = 4×1,007825 − 4,002603 = " + S.fmt(q / U, 6) + " u → Q = " + S.fmt(q, 1) + " MeV (positons annihilés inclus)"; arr = [[[0,"¹H",1,1,MH], he]]; }
        if (rx.value === "u"){ var u5 = N.filter(function(x){ return x[0] === "u235"; })[0], sn = N.filter(function(x){ return x[0] === "sn120"; })[0]; q = 235 * (be(sn).a - be(u5).a); txt = "Fragments vers A ≈ 118 (≈ ¹²⁰Sn, " + S.fmt(be(sn).a, 2) + " MeV/nucléon) : Q ≈ 235 × (" + S.fmt(be(sn).a, 2) + " − " + S.fmt(be(u5).a, 2) + ") ≈ " + S.fmt(q, 0) + " MeV par fission (ordre de grandeur ; le chiffre réel est ≈ 200 MeV)"; arr = [[u5, sn]]; }
        arr.forEach(function(a){ var x1 = X(a[0][3]), y1 = Y(a[0][3] === 1 ? 0 : be(a[0]).a), x2 = X(a[1][3]), y2 = Y(be(a[1]).a); S.draw.arrow(c, x1, y1, x2 + (x2 > x1 ? -7 : 7), y2 + (y2 > y1 ? -7 : 7), P.red, 2.4); if (a[0][3] === 1) S.draw.dot(c, x1, y1, 5, P.red); });
        N.forEach(function(n){ var qv = be(n), on = n === sel; S.draw.dot(c, X(n[3]), Y(qv.a), on ? 8 : 4.5, on ? P.red : P.acc); });
        N.forEach(function(n){ var qv = be(n); if (n === sel || ["h2","he4","li6","c12","o16","fe56","ni62","u235"].indexOf(n[0]) < 0) return; S.draw.text(c, n[1], X(n[3]), Y(qv.a) + (n[3] < 12 ? 14 : 15), {size:9.5, color:P.grey, weight:700}); });
        S.draw.label(c, sel[1] + " : " + S.fmt(b.a, 2) + " MeV/nucléon", Math.max(80, Math.min(W - 80, X(sel[3]))), Math.max(T + 10, Y(b.a) - 20), {color:P.red, size:11.5});
        ro.set(0, S.fmt(b.dm, 5) + " u"); ro.set(1, S.fmt(b.E, 1) + " MeV"); ro.set(2, S.fmt(b.a, 3) + " MeV");
        ro.set(3, rx.value === "none" ? "—" : (rx.value === "u" ? "≈ " + S.fmt(q, 0) : S.fmt(q, 2)) + " MeV");
        nt.set(txt || ("E<sub>L</sub> = Δm·c² = " + S.fmt(b.dm, 5) + " u × 931,494 MeV/u = " + S.fmt(b.E, 1) + " MeV, soit " + S.fmt(b.a, 2) + " MeV par nucléon. " + (sel[3] < 20 ? "Noyau léger : la fusion peut encore le rendre plus lié." : sel[3] > 150 ? "Noyau lourd : la fission le rend plus lié par nucléon." : "Zone proche du maximum de stabilité nucléaire.")), "ok");
      });
    }
  });
})();
})();
