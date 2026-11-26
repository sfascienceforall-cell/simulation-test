/* Mathématiques BA1 · chapitre c12 « Fondements : ensembles, preuves, nombres réels » — simulations SFA originales (lot MA1).
   Fichier autonome : toutes les aides sont privées (préfixe ma1). */
(function(){
"use strict";
var D = SFA.draw, F = SFA.fmt, PI = Math.PI;
var FONT = "Mulish, system-ui, -apple-system, 'Segoe UI', sans-serif", MATH = "'STIX Two Text', 'Cambria Math', serif";
var INK = "#0f1b2d", GREY = "#5f6b7a", GREEN = "#2e7d4f", RED = "#b42318", AMBER = "#B45309", BLUE = "#1e3f8f", GOLD = "#d4a017";

/* ---------- aides communes ---------- */
function ma1Shade(hex, f){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function ma1Rgba(hex, a){ var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function ma1RR(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}
function ma1Font(size, w, math){ return (w || 700) + " " + size + "px " + (math ? MATH : FONT); }
/* texte : taille réduite jusqu'à tenir dans maxW */
function ma1Text(ctx, s, x, y, o){
  o = o || {}; var size = o.size || 13; ctx.save(); ctx.font = ma1Font(size, o.weight, o.math);
  if (o.maxW){ while (size > 8 && ctx.measureText(s).width > o.maxW){ size -= 0.5; ctx.font = ma1Font(size, o.weight, o.math); } }
  ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.halo){ ctx.lineJoin = "round"; ctx.lineWidth = 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || INK; ctx.fillText(s, x, y); ctx.restore(); return size;
}
/* coupe une phrase en lignes de largeur maxW */
function ma1Wrap(ctx, s, maxW, font){
  ctx.save(); ctx.font = font; var words = s.split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); ctx.restore(); return lines;
}
function ma1Shadow(ctx, x, y, rx, ry, a){
  var g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, "rgba(40,25,10," + (a || 0.32) + ")"); g.addColorStop(1, "rgba(40,25,10,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 7); ctx.fill(); ctx.restore();
}
function ma1Ball(ctx, x, y, r, hex){
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.06, x, y, r * 1.05);
  g.addColorStop(0, ma1Shade(hex, 0.7)); g.addColorStop(0.5, hex); g.addColorStop(1, ma1Shade(hex, -0.45));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function ma1Arrow(ctx, x0, y0, x1, y1, col, w){
  var a = Math.atan2(y1 - y0, x1 - x0), L = 7 + (w || 2) * 1.6; ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(a) * L * 0.6, y1 - Math.sin(a) * L * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - L * Math.cos(a - 0.42), y1 - L * Math.sin(a - 0.42)); ctx.lineTo(x1 - L * Math.cos(a + 0.42), y1 - L * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill(); ctx.restore();
}
/* hauteur du canevas selon la largeur (téléphone : plus haut) */
function ma1Ratio(c, wide, tall){ var r0 = c.resize; c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? tall : wide; r0(); }; c.resize(); }
function ma1Mobile(c){ return c.W < 480; }

/* décor : mur, plinthe, parquet en perspective */
function ma1Room(ctx, W, H, yWall){
  var g = ctx.createLinearGradient(0, 0, 0, yWall); g.addColorStop(0, "#f6f1e7"); g.addColorStop(1, "#e6dccb"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, yWall);
  g = ctx.createLinearGradient(0, yWall, 0, H); g.addColorStop(0, "#b98a5e"); g.addColorStop(1, "#d8ad7f"); ctx.fillStyle = g; ctx.fillRect(0, yWall, W, H - yWall);
  ctx.save(); ctx.strokeStyle = "rgba(90,55,25,.22)"; ctx.lineWidth = 1; var vx = W / 2, vy = yWall - (H - yWall) * 2.2, i;
  for (i = -8; i <= 8; i++){ var xb = W / 2 + i * W / 9; var t = (yWall - vy) / (H - vy); ctx.beginPath(); ctx.moveTo(vx + (xb - vx) * t, yWall); ctx.lineTo(xb, H); ctx.stroke(); }
  for (i = 1; i < 6; i++){ var yy = yWall + (H - yWall) * Math.pow(i / 6, 1.4); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
  ctx.restore();
  g = ctx.createLinearGradient(0, yWall - 7, 0, yWall + 2); g.addColorStop(0, "#fbf8f2"); g.addColorStop(1, "#c9b89e"); ctx.fillStyle = g; ctx.fillRect(0, yWall - 7, W, 9);
  g = ctx.createLinearGradient(0, yWall, 0, yWall + 18); g.addColorStop(0, "rgba(60,35,15,.25)"); g.addColorStop(1, "rgba(60,35,15,0)"); ctx.fillStyle = g; ctx.fillRect(0, yWall + 2, W, 18);
}
/* tableau noir */
function ma1Board(ctx, x, y, w, h){
  ma1Shadow(ctx, x + w / 2, y + h + 6, w * 0.5, 7, 0.18);
  var g = ctx.createLinearGradient(0, y - 6, 0, y + h + 6); g.addColorStop(0, "#9b6b3f"); g.addColorStop(1, "#6e4626"); ctx.fillStyle = g; ma1RR(ctx, x - 6, y - 6, w + 12, h + 12, 5); ctx.fill();
  g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "#2f4a3f"); g.addColorStop(0.55, "#263d34"); g.addColorStop(1, "#1d3029"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(x + w * 0.3, y + h * 0.35, w * 0.25, h * 0.3, -0.3, 0, 7); ctx.fill(); ctx.restore();
  g = ctx.createLinearGradient(0, y + h + 2, 0, y + h + 8); g.addColorStop(0, "#a77a4d"); g.addColorStop(1, "#5e3b1f"); ctx.fillStyle = g; ctx.fillRect(x - 2, y + h + 2, w + 4, 6);
  ctx.fillStyle = "#f4f1e8"; ctx.fillRect(x + w * 0.7, y + h + 1, 14, 3); ctx.fillStyle = "#f3d27a"; ctx.fillRect(x + w * 0.76, y + h + 1, 10, 3);
}

/* =====================================================================
   1. ∀∃ ou ∃∀ : l'ordre des quantificateurs
   ===================================================================== */
var Q_SHIRT = ["#2563eb", "#dc2626", "#059669", "#d97706", "#7c3aed", "#db2777"], Q_HAIR = ["#3b2a1e", "#1f1a17", "#7a4a22", "#c59b5f", "#2b2320", "#5a3825"], Q_SKIN = ["#f1c9a5", "#d9a27c", "#f5d3b8", "#a86f4c", "#eec09c", "#c98e68"];
var Q_LET = ["A", "B", "C", "D", "E", "F"];
function qPerson(ctx, x, yF, h, i, mood, glow, lab){
  var s = h / 100, shirt = Q_SHIRT[i % 6], skin = Q_SKIN[i % 6], hair = Q_HAIR[i % 6];
  ma1Shadow(ctx, x, yF, 20 * s, 5 * s, 0.3);
  if (glow){ ctx.save(); var gg = ctx.createRadialGradient(x, yF - 50 * s, 5, x, yF - 50 * s, 62 * s); gg.addColorStop(0, "rgba(255,214,102,.55)"); gg.addColorStop(1, "rgba(255,214,102,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, yF - 50 * s, 62 * s, 0, 7); ctx.fill(); ctx.restore(); }
  /* jambes */
  var g = ctx.createLinearGradient(x - 10 * s, 0, x + 10 * s, 0); g.addColorStop(0, "#2a3447"); g.addColorStop(1, "#465673"); ctx.fillStyle = g;
  ma1RR(ctx, x - 9 * s, yF - 38 * s, 8 * s, 36 * s, 3 * s); ctx.fill(); ma1RR(ctx, x + 1 * s, yF - 38 * s, 8 * s, 36 * s, 3 * s); ctx.fill();
  ctx.fillStyle = "#1b1b1f"; ma1RR(ctx, x - 11 * s, yF - 5 * s, 11 * s, 5 * s, 2 * s); ctx.fill(); ma1RR(ctx, x + 1 * s, yF - 5 * s, 11 * s, 5 * s, 2 * s); ctx.fill();
  /* bras */
  ctx.save(); ctx.strokeStyle = ma1Shade(shirt, -0.15); ctx.lineCap = "round"; ctx.lineWidth = 7 * s;
  ctx.beginPath(); ctx.moveTo(x - 13 * s, yF - 68 * s); ctx.lineTo(x - 17 * s, yF - 42 * s); ctx.moveTo(x + 13 * s, yF - 68 * s); ctx.lineTo(x + 17 * s, yF - 42 * s); ctx.stroke();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(x - 17 * s, yF - 40 * s, 3.6 * s, 0, 7); ctx.arc(x + 17 * s, yF - 40 * s, 3.6 * s, 0, 7); ctx.fill(); ctx.restore();
  /* buste */
  g = ctx.createLinearGradient(x - 16 * s, 0, x + 16 * s, 0); g.addColorStop(0, ma1Shade(shirt, 0.25)); g.addColorStop(0.6, shirt); g.addColorStop(1, ma1Shade(shirt, -0.35)); ctx.fillStyle = g;
  ma1RR(ctx, x - 15 * s, yF - 74 * s, 30 * s, 40 * s, 8 * s); ctx.fill();
  ma1Text(ctx, lab || String(i + 1), x, yF - 54 * s, {size:Math.max(9, 15 * s), color:"#fff", weight:800, math:!!lab});
  /* tête */
  ctx.fillStyle = ma1Shade(skin, -0.1); ctx.fillRect(x - 3.5 * s, yF - 80 * s, 7 * s, 7 * s);
  ma1Ball(ctx, x, yF - 89 * s, 12 * s, skin.length === 7 ? skin : "#f1c9a5");
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(x, yF - 91 * s, 12.5 * s, PI * 1.02, PI * 1.98); ctx.quadraticCurveTo(x + 4 * s, yF - 95 * s, x - 12 * s, yF - 88 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#1b1b1f"; ctx.beginPath(); ctx.arc(x - 4.2 * s, yF - 89 * s, 1.5 * s, 0, 7); ctx.arc(x + 4.2 * s, yF - 89 * s, 1.5 * s, 0, 7); ctx.fill();
  ctx.save(); ctx.strokeStyle = "#5a2a1a"; ctx.lineWidth = Math.max(1, 1.5 * s); ctx.lineCap = "round"; ctx.beginPath();
  if (mood > 0) ctx.arc(x, yF - 86 * s, 4.5 * s, 0.2 * PI, 0.8 * PI); else if (mood < 0) ctx.arc(x, yF - 79.5 * s, 4.5 * s, 1.2 * PI, 1.8 * PI); else { ctx.moveTo(x - 3.5 * s, yF - 83 * s); ctx.lineTo(x + 3.5 * s, yF - 83 * s); }
  ctx.stroke(); ctx.restore();
}
function qChair(ctx, x, yF, h, j, st){
  var s = h / 100, wood = "#a0643a", seatY = yF - 48 * s;
  ma1Shadow(ctx, x + 4 * s, yF - 2 * s, 34 * s, 8 * s, 0.3);
  if (st === "win"){ ctx.save(); var gg = ctx.createRadialGradient(x, yF - 55 * s, 4, x, yF - 55 * s, 70 * s); gg.addColorStop(0, "rgba(255,206,70,.75)"); gg.addColorStop(1, "rgba(255,206,70,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, yF - 55 * s, 70 * s, 0, 7); ctx.fill(); ctx.restore(); }
  /* pieds arrière */
  ctx.fillStyle = ma1Shade(wood, -0.35); ctx.fillRect(x - 20 * s, seatY - 6 * s, 4 * s, 50 * s); ctx.fillRect(x + 16 * s, seatY - 6 * s, 4 * s, 50 * s);
  /* dossier */
  var g = ctx.createLinearGradient(x - 22 * s, 0, x + 22 * s, 0); g.addColorStop(0, ma1Shade(wood, 0.15)); g.addColorStop(1, ma1Shade(wood, -0.25));
  ctx.fillStyle = ma1Shade(wood, -0.2); ctx.fillRect(x - 22 * s, yF - 100 * s, 5 * s, 56 * s); ctx.fillRect(x + 17 * s, yF - 100 * s, 5 * s, 56 * s);
  ctx.fillStyle = g; ma1RR(ctx, x - 22 * s, yF - 102 * s, 44 * s, 26 * s, 5 * s); ctx.fill();
  /* assise (dessus en perspective) */
  ctx.fillStyle = ma1Shade(wood, 0.25); ctx.beginPath(); ctx.moveTo(x - 20 * s, seatY - 8 * s); ctx.lineTo(x + 20 * s, seatY - 8 * s); ctx.lineTo(x + 25 * s, seatY + 2 * s); ctx.lineTo(x - 25 * s, seatY + 2 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = ma1Shade(wood, -0.25); ctx.fillRect(x - 25 * s, seatY + 2 * s, 50 * s, 5 * s);
  /* pieds avant */
  g = ctx.createLinearGradient(x - 25 * s, 0, x + 25 * s, 0); g.addColorStop(0, ma1Shade(wood, 0.05)); g.addColorStop(1, ma1Shade(wood, -0.3)); ctx.fillStyle = g;
  ctx.fillRect(x - 24 * s, seatY + 6 * s, 5 * s, yF - seatY - 6 * s); ctx.fillRect(x + 19 * s, seatY + 6 * s, 5 * s, yF - seatY - 6 * s);
  /* étiquette */
  var bc = st === "win" ? GOLD : st === "bad" ? RED : "#fffaf0";
  ma1Ball(ctx, x, yF - 89 * s, 12 * s, bc === "#fffaf0" ? "#fdf6e3" : bc);
  ma1Text(ctx, Q_LET[j], x, yF - 89 * s, {size:Math.max(10, 16 * s), color:st ? "#fff" : "#6e4626", weight:800});
  return {x:x, y:seatY - 3 * s};
}
/* relations prédéfinies (n élèves × m chaises) */
function qPreset(key, n, m, rnd){
  var R = [], i, j; for (i = 0; i < 6; i++){ R.push([]); for (j = 0; j < 6; j++) R[i].push(false); }
  var perm = [2, 0, 4, 1, 5, 3].filter(function(v){ return v < m; });
  if (key === "varie" || key === "difficile"){
    for (i = 0; i < n; i++){ R[i][perm[i % m]] = true; R[i][perm[(i + 2) % m]] = true; }
    if (key === "difficile"){ for (j = 0; j < 6; j++) R[Math.min(2, n - 1)][j] = false; }
  } else if (key === "commune"){
    var cj = perm[1]; for (i = 0; i < n; i++){ R[i][cj] = true; R[i][perm[(i + 3) % m]] = true; }
  } else if (key === "hasard"){
    for (i = 0; i < 6; i++) for (j = 0; j < 6; j++) R[i][j] = rnd() < 0.4;
  }
  return R;
}
function qRng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

SFA.sim({
  id:"ma-quantificateurs-ordre", ch:"c12", tag:"Logique · quantificateurs",
  titre:"∀∃ ou ∃∀ : l'ordre qui change tout",
  resume:"Dans une classe, « chaque élève trouve une chaise qui lui convient » et « il y a une chaise qui convient à tous » n'ont pas le même sens : échanger ∀ et ∃ change l'énoncé.",
  but:"Le tableau du bas dit quels élèves x acceptent quelles chaises y (case verte : R(x ; y) est vrai). Choisis l'ordre des quantificateurs : avec « ∀x ∃y », chaque élève cherche sa propre chaise, et le y peut changer d'un élève à l'autre ; avec « ∃y ∀x », on cherche une seule chaise qui convienne à tout le monde. Clique sur les cases pour modifier la relation, et essaie de rendre le premier énoncé vrai et le second faux. L'onglet « Nombres réels » reprend l'exemple y > x.",
  aRetenir:"Dans ∀x ∃y R(x ; y), le y a le droit de dépendre de x. Dans ∃y ∀x R(x ; y), un même y doit convenir pour tous les x : c'est plus exigeant. On a toujours (∃y ∀x R) ⇒ (∀x ∃y R), mais la réciproque est fausse en général. Pour nier, tu gardes l'ordre des variables, tu changes chaque ∀ en ∃ et chaque ∃ en ∀, puis tu nies la propriété R : non(∀x ∃y R) ⟺ ∃x ∀y non R.",
  piege:"Lire « ∀x ∃y » et « ∃y ∀x » comme la même phrase. C'est l'erreur qui fait rater les définitions de limite : dans « ∀ε > 0 ∃N », le rang N dépend de ε. Un seul contre-exemple suffit pour montrer qu'un énoncé « ∀ » est faux.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.04}); ma1Ratio(c, 1.22, 1.45);
    var seed = 7, R = qPreset("varie", 5, 5), T = 0, script = [], scriptKey = "", grid = null, scene = null;
    var reel = {x:1.2, y:2, drag:null, hold:0};
    var univ = k.seg("Univers", [["salle", "Salle de classe"], ["reels", "Nombres réels"]], "salle", function(){ showCtl(); restart(); });
    var mode = k.seg("Ordre des quantificateurs", [["AE", "∀x ∃y"], ["EA", "∃y ∀x"]], "AE", function(){ restart(); });
    var pre = k.select("Relation R(x ; y)", [["varie", "Goûts variés"], ["commune", "Une chaise plaît à tous"], ["difficile", "Un élève difficile"], ["hasard", "Au hasard"], ["perso", "Ton tableau (modifié à la souris)"]], "varie", function(v){ if (v === "hasard") seed++; if (v !== "perso") R = qPreset(v, sn.value, sm.value, qRng(seed)); restart(); });
    var sn = k.slider("Nombre d'élèves (x)", 3, 6, 1, 5, "", function(){ if (pre.value !== "perso") R = qPreset(pre.value, sn.value, sm.value, qRng(seed)); restart(); });
    var sm = k.slider("Nombre de chaises (y)", 3, 6, 1, 5, "", function(){ if (pre.value !== "perso") R = qPreset(pre.value, sn.value, sm.value, qRng(seed)); restart(); });
    var tneg = k.toggle("Écrire la négation au tableau", false);
    var lp = k.loop(function(dt){ T += dt; if (reel.hold > 0) reel.hold -= dt; k.redraw(); });
    var bplay = k.button("⏸ Pause", function(){ if (lp.running){ lp.pause(); bplay.textContent = "▶ Lecture"; } else { lp.play(); bplay.textContent = "⏸ Pause"; } }, true);
    k.button("↺ Recommencer la recherche", function(){ restart(); });
    var ro = k.readouts(["∀x ∃y R(x ; y)", "∃y ∀x R(x ; y)", "Témoin"]);
    var nt = k.note("", "ok");
    function showCtl(){ var on = univ.value === "salle"; [pre.el, sn.el, sm.el].forEach(function(e){ var d = e.closest ? e.closest(".ctl") : e.parentNode; if (d) d.style.display = on ? "" : "none"; }); }
    function restart(){ T = 0; scriptKey = ""; }
    function makeScript(n, m, md){
      var st = [], i, j;
      if (md === "AE"){ for (i = 0; i < n; i++){ var f = -1; for (j = 0; j < m; j++){ st.push({k:"c", i:i, j:j, ok:R[i][j]}); if (R[i][j]){ f = j; break; } } st.push({k:"e", i:i, j:f}); } }
      else { for (j = 0; j < m; j++){ var bad = -1; for (i = 0; i < n; i++){ st.push({k:"c", i:i, j:j, ok:R[i][j]}); if (!R[i][j]){ bad = i; break; } } st.push({k:"e", i:bad, j:j}); if (bad < 0) break; } }
      st.push({k:"v"}); var t = 0; st.forEach(function(s){ s.t0 = t; t += s.k === "c" ? 0.22 : s.k === "e" ? 0.5 : 2.6; s.t1 = t; }); return st;
    }
    function truth(n, m){
      var ae = true, ea = false, i, j, firstBad = -1, win = -1, choice = [];
      for (i = 0; i < n; i++){ var f = -1; for (j = 0; j < m; j++) if (R[i][j]){ f = j; break; } choice.push(f); if (f < 0){ ae = false; if (firstBad < 0) firstBad = i; } }
      for (j = 0; j < m; j++){ var all = true; for (i = 0; i < n; i++) if (!R[i][j]) all = false; if (all){ ea = true; win = j; break; } }
      return {ae:ae, ea:ea, choice:choice, bad:firstBad, win:win};
    }
    /* souris : cases du tableau (salle) ou points de la droite (réels) */
    c.cv.style.touchAction = "none";
    function cellAt(p){ if (!grid) return null; var i = Math.floor((p.y - grid.y0) / grid.cs), j = Math.floor((p.x - grid.x0) / grid.cs); if (i >= 0 && i < grid.n && j >= 0 && j < grid.m) return [i, j]; return null; }
    c.pointer(function(t, p){
      if (univ.value === "salle"){
        var ce = cellAt(p);
        if (t === "down" && ce){ R[ce[0]][ce[1]] = !R[ce[0]][ce[1]]; pre.set("perso"); restart(); k.redraw(); }
        else if (t === "move") c.cv.style.cursor = ce ? "pointer" : "default";
        return;
      }
      if (!scene) return;
      var v = Math.max(-5, Math.min(5, scene.ix(p.x)));
      if (t === "down"){ var dx = Math.abs(p.x - scene.X(mode.value === "AE" ? reel.x : reel.y)); if (dx < 34 && Math.abs(p.y - scene.yl) < 90){ reel.drag = true; } }
      if ((t === "down" || t === "drag") && reel.drag){ if (mode.value === "AE") reel.x = Math.round(Math.min(4, v) * 10) / 10; else reel.y = Math.round(Math.max(-4.5, Math.min(4.5, v)) * 10) / 10; reel.hold = 4; k.redraw(); }
      if (t === "up") reel.drag = null;
      if (t === "move") c.cv.style.cursor = Math.abs(p.x - scene.X(mode.value === "AE" ? reel.x : reel.y)) < 34 && Math.abs(p.y - scene.yl) < 90 ? "grab" : "default";
    });

    function drawSalle(ctx, W, H){
      var mob = ma1Mobile(c), n = sn.value, m = sm.value, md = mode.value, Hs = Math.round(W * (mob ? 0.7 : 0.58)), i, j;
      var key = n + "|" + m + "|" + md + "|" + JSON.stringify(R); if (key !== scriptKey){ script = makeScript(n, m, md); scriptKey = key; T = 0; }
      var Ttot = script[script.length - 1].t1, tt = T % Ttot, cur = script.length - 1; for (i = 0; i < script.length; i++) if (tt < script[i].t1){ cur = i; break; }
      var done = script.slice(0, cur), step = script[cur], tr = truth(n, m), finished = step.k === "v";
      /* état dérivé de l'animation */
      var assigned = [], chairSt = [], tried = {}; for (i = 0; i < 6; i++){ assigned.push(null); chairSt.push(null); }
      done.forEach(function(s){ if (s.k === "e"){ if (md === "AE") assigned[s.i] = s.j; else chairSt[s.j] = s.i < 0 ? "win" : "bad:" + s.i; } if (s.k === "c") tried[s.i + "," + s.j] = s.ok; });
      var focI = step.k !== "v" ? step.i : -1, focJ = step.k !== "v" ? step.j : -1;
      /* ---- scène ---- */
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, Hs); ctx.clip();
      var yWall = Hs * 0.52; ma1Room(ctx, W, Hs, yWall);
      var bx = W * 0.07, bw = W * 0.86, by = Hs * 0.035, bh = Hs * 0.245; ma1Board(ctx, bx, by, bw, bh);
      var stmt = md === "AE" ? "∀x ∃y  R(x ; y)" : "∃y ∀x  R(x ; y)";
      var phr = md === "AE" ? "Pour tout élève x, il existe une chaise y qu'il accepte." : "Il existe une chaise y que tout élève x accepte.";
      var big = mob ? 17 : 22, small = mob ? 10.5 : 12.5;
      if (tneg.value){
        ma1Text(ctx, stmt, bx + bw / 2, by + bh * 0.2, {size:big - 2, color:"#f4f1e8", math:true, maxW:bw - 16});
        ma1Text(ctx, "non : " + (md === "AE" ? "∃x ∀y  non R(x ; y)" : "∀y ∃x  non R(x ; y)"), bx + bw / 2, by + bh * 0.47, {size:big - 4, color:"#f3d27a", math:true, maxW:bw - 16});
        ma1Text(ctx, md === "AE" ? "« un élève refuse toutes les chaises »" : "« chaque chaise est refusée par quelqu'un »", bx + bw / 2, by + bh * 0.7, {size:small, color:"#dfe8e2", weight:600, maxW:bw - 16});
      } else {
        ma1Text(ctx, stmt, bx + bw / 2, by + bh * 0.24, {size:big, color:"#f4f1e8", math:true, maxW:bw - 16});
        var ls = ma1Wrap(ctx, phr, bw - 20, ma1Font(small, 600)); ls.slice(0, 2).forEach(function(l, q){ ma1Text(ctx, l, bx + bw / 2, by + bh * (ls.length > 1 ? 0.5 : 0.56) + q * (small + 3), {size:small, color:"#dfe8e2", weight:600}); });
      }
      var verd = md === "AE" ? tr.ae : tr.ea;
      ma1Text(ctx, finished ? (verd ? "VRAI" : "FAUX") : "on cherche…", bx + bw - 8, by + 10, {size:mob ? 11 : 13, align:"right", color:finished ? (verd ? "#8ee6a8" : "#ff9a8a") : "#b9c7bf", weight:800});
      /* élèves (au fond) et chaises (devant) */
      var hP = Hs * 0.33, yP = Hs * 0.7, hC = Hs * 0.26, yC = Hs * 0.97, xsP = [], xsC = [], seats = [];
      for (i = 0; i < n; i++) xsP.push(W * (0.08 + 0.84 * (i + 0.5) / n));
      for (j = 0; j < m; j++) xsC.push(W * (0.08 + 0.84 * (j + 0.5) / m));
      for (i = 0; i < n; i++){
        var mood = 0; if (md === "AE"){ if (assigned[i] !== null) mood = assigned[i] >= 0 ? 1 : -1; } else { if (finished) mood = tr.ea ? 1 : 0; for (j = 0; j < m; j++) if (chairSt[j] === "bad:" + i) mood = -1; }
        qPerson(ctx, xsP[i], yP, hP, i, mood, md === "AE" && focI === i);
      }
      for (j = 0; j < m; j++){ var cst = null; if (md === "EA" && chairSt[j]) cst = chairSt[j] === "win" ? "win" : "bad"; seats.push(qChair(ctx, xsC[j], yC, hC, j, cst)); if (md === "EA" && focJ === j){ ctx.save(); ctx.strokeStyle = AMBER; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ma1RR(ctx, xsC[j] - hC * 0.3, yC - hC * 1.08, hC * 0.6, hC * 1.12, 8); ctx.stroke(); ctx.restore(); } }
      /* liens élève → chaise */
      function link(i2, j2, col, w, dash){ var x0 = xsP[i2] + (xsC[j2] > xsP[i2] + 4 ? 1 : xsC[j2] < xsP[i2] - 4 ? -1 : 0) * hP * 0.17, y0 = yP - hP * 0.42, x1 = seats[j2].x, y1 = seats[j2].y; ctx.save(); if (dash) ctx.setLineDash(dash); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); var qx = (x0 + x1) / 2, qy = Math.max(y0, y1) + 6; ctx.quadraticCurveTo(qx, qy, x1, y1 - 2); ctx.stroke(); ctx.restore(); var u = 0.8, ax = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * qx + u * u * x1, ay = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * qy + u * u * (y1 - 2); ma1Arrow(ctx, ax, ay, x1, y1 - 1, col, w); }
      if (md === "AE"){
        for (i = 0; i < n; i++) if (assigned[i] !== null && assigned[i] >= 0) link(i, assigned[i], Q_SHIRT[i], 2.6);
        if (step.k === "c") link(step.i, step.j, step.ok ? ma1Rgba(Q_SHIRT[step.i], 0.9) : "rgba(120,120,120,.55)", 2, [5, 4]);
      } else {
        for (j = 0; j < m; j++){ if (chairSt[j] === "win") for (i = 0; i < n; i++) link(i, j, Q_SHIRT[i], 2.4); }
        if (step.k === "c"){ for (i = 0; i < step.i; i++) link(i, step.j, ma1Rgba(Q_SHIRT[i], 0.55), 1.6); link(step.i, step.j, step.ok ? Q_SHIRT[step.i] : RED, 2, [5, 4]); }
      }
      /* bulles au-dessus des élèves */
      for (i = 0; i < n; i++){
        var bub = null; if (md === "AE"){ if (assigned[i] !== null) bub = assigned[i] >= 0 ? ["✓ " + Q_LET[assigned[i]], GREEN] : ["✗ aucune", RED]; else if (focI === i) bub = ["?", AMBER]; }
        else { for (j = 0; j < m; j++) if (chairSt[j] === "bad:" + i){ bub = ["non à " + Q_LET[j], RED]; } if (step.k === "c" && step.i === i) bub = [step.ok ? "oui" : "non", step.ok ? GREEN : RED]; }
        if (bub){ var bxx = xsP[i], byy = yP - hP * 1.08; ctx.save(); ctx.font = ma1Font(mob ? 10 : 11.5, 800); var tw = ctx.measureText(bub[0]).width + 10; ctx.restore(); var cw = W / n - 4; tw = Math.min(tw, cw); ctx.fillStyle = "rgba(255,255,255,.93)"; ma1RR(ctx, bxx - tw / 2, byy - 9, tw, 18, 8); ctx.fill(); ctx.strokeStyle = bub[1]; ctx.lineWidth = 1.4; ctx.stroke(); ma1Text(ctx, bub[0], bxx, byy, {size:mob ? 10 : 11.5, color:bub[1], weight:800, maxW:tw - 4}); }
      }
      ctx.restore();
      /* ---- tableau R(x ; y) ---- */
      var top = Hs + 6, left = mob ? 52 : 62, right = mob ? 50 : 60, head = 38, foot = 26;
      var cs = Math.floor(Math.min((W - left - right) / m, (H - top - head - foot - 4) / 6, 44)), gw = cs * m, x0 = Math.round(left + (W - left - right - gw) / 2), y0 = top + head;
      grid = {x0:x0, y0:y0, cs:cs, n:n, m:m};
      ctx.fillStyle = "#f7f8fa"; ctx.fillRect(0, Hs, W, H - Hs);
      ma1Text(ctx, "R(x ; y) : l'élève x accepte la chaise y · clique sur une case", W / 2, top + 9, {size:mob ? 10 : 11.5, color:GREY, weight:700, maxW:W - 12});
      for (j = 0; j < m; j++) ma1Text(ctx, Q_LET[j], x0 + (j + 0.5) * cs, y0 - 10, {size:mob ? 11.5 : 13, color:"#6e4626", weight:800, maxW:cs - 2});
      ma1Text(ctx, "x \u2193  y \u2192", x0 - 6, y0 - 10, {size:mob ? 10 : 11.5, color:GREY, weight:800, align:"right", math:true});
      for (i = 0; i < n; i++){
        ma1Ball(ctx, x0 - (mob ? 38 : 46), y0 + (i + 0.5) * cs, Math.min(7, cs * 0.22), Q_SHIRT[i]);
        ma1Text(ctx, "x = " + (i + 1), x0 - (mob ? 28 : 34), y0 + (i + 0.5) * cs, {size:mob ? 10 : 11.5, color:INK, weight:800, align:"left", maxW:left - 16});
        for (j = 0; j < m; j++){
          var cx = x0 + j * cs, cy = y0 + i * cs, on = R[i][j], g = ctx.createLinearGradient(cx, cy, cx, cy + cs);
          if (on){ g.addColorStop(0, "#5fd08a"); g.addColorStop(1, "#2e9a5c"); } else { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#e6e9ee"); }
          ctx.fillStyle = g; ma1RR(ctx, cx + 2, cy + 2, cs - 4, cs - 4, 5); ctx.fill(); ctx.strokeStyle = on ? "#23774a" : "#c9d0da"; ctx.lineWidth = 1; ctx.stroke();
          if (on) ma1Text(ctx, "✓", cx + cs / 2, cy + cs / 2 + 1, {size:cs * 0.42, color:"#fff", weight:800});
          var hl = (md === "AE" && focI === i) || (md === "EA" && focJ === j); if (hl){ ctx.fillStyle = "rgba(255,200,60,.16)"; ctx.fillRect(cx, cy, cs, cs); }
          if (step.k === "c" && step.i === i && step.j === j){ ctx.save(); ctx.strokeStyle = AMBER; ctx.lineWidth = 3; ma1RR(ctx, cx + 1, cy + 1, cs - 2, cs - 2, 6); ctx.stroke(); ctx.restore(); }
        }
        /* résultat de la ligne : ∃y ? */
        if (md === "AE"){ var res = assigned[i]; if (res !== null) ma1Text(ctx, res >= 0 ? "✓ " + Q_LET[res] : "✗", x0 + gw + 8, y0 + (i + 0.5) * cs, {size:mob ? 12 : 14, color:res >= 0 ? GREEN : RED, weight:800, align:"left"}); }
      }
      if (md === "AE") ma1Text(ctx, "∃y ?", x0 + gw + 8, y0 - 10, {size:mob ? 10.5 : 12, color:GREY, weight:800, align:"left", math:true});
      else {
        ma1Text(ctx, "∀x ?", x0 - 8, y0 + n * cs + 13, {size:mob ? 10.5 : 12, color:GREY, weight:800, align:"right", math:true});
        for (j = 0; j < m; j++) if (chairSt[j]) ma1Text(ctx, chairSt[j] === "win" ? "★ oui" : "✗", x0 + (j + 0.5) * cs, y0 + n * cs + 13, {size:mob ? 13 : 15, color:chairSt[j] === "win" ? AMBER : RED, weight:800, maxW:cs});
      }
      /* lectures */
      ro.set(0, tr.ae ? "vrai" : "faux"); ro.set(1, tr.ea ? "vrai" : "faux");
      if (md === "AE") ro.set(2, tr.ae ? tr.choice.slice(0, n).map(function(v, q){ return (q + 1) + "→" + Q_LET[v]; }).join(" ") : "x = " + (tr.bad + 1) + " n'a aucune chaise");
      else ro.set(2, tr.ea ? "la chaise " + Q_LET[tr.win] + " convient à tous" : "aucune chaise commune");
      var msg;
      if (tr.ae && !tr.ea) msg = "<b>∀x ∃y vrai, ∃y ∀x faux.</b> Chaque élève trouve une chaise, mais pas la même : le y dépend du x (" + tr.choice.slice(0, n).map(function(v, q){ return (q + 1) + "→" + Q_LET[v]; }).join(", ") + "). Aucune chaise ne convient à tous.";
      else if (tr.ea) msg = "<b>Les deux énoncés sont vrais.</b> La chaise " + Q_LET[tr.win] + " convient à tous les élèves ; a fortiori, chaque élève a une chaise. ∃y ∀x entraîne toujours ∀x ∃y.";
      else msg = "<b>Les deux énoncés sont faux.</b> L'élève " + (tr.bad + 1) + " n'accepte aucune chaise : c'est le contre-exemple qui fait tomber ∀x ∃y (et donc aussi ∃y ∀x).";
      nt.set(msg, tr.ae && !tr.ea ? "ok" : tr.ea ? "ok" : "warn");
    }

    function drawReels(ctx, W, H, t){
      var mob = ma1Mobile(c), md = mode.value, yWall = H * 0.42;
      ma1Room(ctx, W, H, yWall);
      var bx = W * 0.07, bw = W * 0.86, by = H * 0.03, bh = H * 0.24; ma1Board(ctx, bx, by, bw, bh);
      var big = mob ? 19 : 24, small = mob ? 10.5 : 12.5;
      ma1Text(ctx, md === "AE" ? "∀x ∈ ℝ  ∃y ∈ ℝ :  y > x" : "∃y ∈ ℝ  ∀x ∈ ℝ :  y > x", bx + bw / 2, by + bh * 0.26, {size:big, color:"#f4f1e8", math:true, maxW:bw - 16});
      var phr = md === "AE" ? "À chaque réel x, on peut associer un réel y plus grand : y = x + 1 convient." : "Un seul réel y devrait dépasser tous les réels x à la fois.";
      ma1Wrap(ctx, phr, bw - 20, ma1Font(small, 600)).slice(0, 2).forEach(function(l, q){ ma1Text(ctx, l, bx + bw / 2, by + bh * 0.55 + q * (small + 3), {size:small, color:"#dfe8e2", weight:600}); });
      ma1Text(ctx, md === "AE" ? "VRAI" : "FAUX", bx + bw - 8, by + 10, {size:mob ? 11 : 13, align:"right", color:md === "AE" ? "#8ee6a8" : "#ff9a8a", weight:800});
      if (tneg.value) ma1Text(ctx, md === "AE" ? "non : ∃x ∀y : y ≤ x" : "non : ∀y ∃x : y ≤ x", bx + 10, by + bh - 11, {size:mob ? 11 : 13, align:"left", color:"#f3d27a", math:true, weight:700});
      /* droite réelle peinte au sol, deux élèves debout dessus */
      var y1 = H * 0.7, y2 = H * 0.8, ym = (y1 + y2) / 2, X1 = function(v){ return 34 + (v + 5) / 10 * (W - 68); }, X2 = function(v){ return 12 + (v + 5) / 10 * (W - 24); }, X = function(v){ return (X1(v) + X2(v)) / 2; };
      scene = {X:X, ix:function(px){ return (px - 23) / (W - 46) * 10 - 5; }, yl:ym - H * 0.08};
      ctx.fillStyle = "rgba(255,250,235,.85)"; ctx.beginPath(); ctx.moveTo(X1(-5.3), y1); ctx.lineTo(X1(5.3), y1); ctx.lineTo(X2(5.3), y2); ctx.lineTo(X2(-5.3), y2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(90,60,30,.5)"; ctx.lineWidth = 1.2; ctx.stroke();
      var v; for (v = -5; v <= 5 + 1e-9; v += 0.5){ var full = Math.abs(v - Math.round(v)) < 1e-9; ctx.strokeStyle = full ? "#5b3a1a" : "rgba(91,58,26,.45)"; ctx.lineWidth = full ? 1.6 : 1; ctx.beginPath(); ctx.moveTo(X1(v), y1 + (full ? 0 : (y2 - y1) * 0.3)); ctx.lineTo(X2(v), y2 - (full ? 0 : (y2 - y1) * 0.3)); ctx.stroke(); if (full) ma1Text(ctx, F(v, 0), X2(v), y2 + 11, {size:mob ? 10 : 12, color:"#4a2f12", weight:800}); }
      ctx.strokeStyle = "#5b3a1a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(-5.3), ym); ctx.lineTo(X(5.3), ym); ctx.stroke(); ma1Arrow(ctx, X(5.2), ym, X(5.45), ym, "#5b3a1a", 2);
      var hP = H * (mob ? 0.17 : 0.19), x, y, ok;
      /* x se tient sur le bord avant de la bande, y sur le bord arrière : quand x rejoint y, les deux maillots restent lisibles */
      var LN = (y2 - y1) * 0.55, yX = ym + LN, yY = ym - LN, XA = function(v, yy){ return X1(v) + (X2(v) - X1(v)) * (yy - y1) / (y2 - y1); };
      function tag(v, col, lab, up){ var tx = X(v), ty = yY - hP * 1.12 - (up ? 26 : 0); ctx.save(); ctx.font = ma1Font(mob ? 11 : 13, 800, true); var tw = ctx.measureText(lab).width + 12; ctx.restore(); tx = Math.max(tw / 2 + 2, Math.min(W - tw / 2 - 2, tx)); ctx.fillStyle = "rgba(255,255,255,.94)"; ma1RR(ctx, tx - tw / 2, ty - 10, tw, 20, 9); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); ma1Text(ctx, lab, tx, ty, {size:mob ? 11 : 13, color:col, weight:800, math:true}); }
      if (md === "AE"){
        x = reel.hold > 0 || reel.drag ? reel.x : Math.round(3.6 * Math.sin(t * 0.55) * 100) / 100; if (!(reel.hold > 0 || reel.drag)) reel.x = x; y = x + 1; ok = true;
        qPerson(ctx, XA(y, yY), yY, hP, 2, 1, false, "y"); qPerson(ctx, XA(x, yX), yX, hP, 0, 1, !!reel.drag, "x");
        tag(x, BLUE, "x = " + F(x, 2), false); tag(y, GREEN, "y = x + 1 = " + F(y, 2), true);
        ma1Text(ctx, "Attrape l'élève x et promène-le : y le suit, y dépend de x.", W / 2, H * 0.93, {size:mob ? 10.5 : 12.5, color:"#4a2f12", weight:700, maxW:W - 20});
      } else {
        y = reel.y; var per = 7, tt = t % per, xEnd = Math.min(5, y + 1.5); x = Math.round((tt < 4.5 ? -5 + (xEnd + 5) * tt / 4.5 : xEnd) * 100) / 100; ok = y > x;
        ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(X1(-5.3), y1); ctx.lineTo(X1(y), y1); ctx.lineTo(X2(y), y2); ctx.lineTo(X2(-5.3), y2); ctx.closePath(); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(X1(y), y1); ctx.lineTo(X1(5.3), y1); ctx.lineTo(X2(5.3), y2); ctx.lineTo(X2(y), y2); ctx.closePath(); ctx.fill(); ctx.restore();
        qPerson(ctx, XA(y, yY), yY, hP, 2, x < y ? 1 : -1, !!reel.drag, "y"); qPerson(ctx, XA(x, yX), yX, hP, 0, 0, false, "x");
        tag(y, GREEN, "y = " + F(y, 2), true); tag(x, ok ? BLUE : RED, ok ? "x = " + F(x, 2) + " : y > x" : "x = " + F(x, 2) + " : y > x faux", false);
        ma1Text(ctx, "Attrape l'élève y : où qu'il se place, x = y le met en défaut.", W / 2, H * 0.93, {size:mob ? 10.5 : 12.5, color:"#4a2f12", weight:700, maxW:W - 20});
      }
      /* « ℝ » au bout de la droite, dessiné après les élèves pour rester lisible */
      ma1Text(ctx, "ℝ", Math.min(W - 10, X(5.45) + 2), ym - 14, {size:mob ? 13 : 15, color:"#4a2f12", math:true, weight:700, halo:"rgba(255,250,235,.92)"});
      ro.set(0, "vrai"); ro.set(1, "faux");
      ro.set(2, "x = " + F(x, 2) + " ; y = " + F(y, 2));
      nt.set(md === "AE" ? "Pour x = " + F(x, 2) + ", le réel y = " + F(y, 2) + " vérifie y > x. Le y change avec x : c'est permis dans ∀x ∃y." : "Quel que soit le y choisi (ici y = " + F(y, 2) + "), le réel x = y (ou n'importe quel x ≥ y) rend « y > x » faux. Aucun y ne marche pour tous les x à la fois : ∃y ∀x est faux.", md === "AE" ? "ok" : "warn");
    }

    showCtl();
    k.draw(function(){ var ctx = c.ctx, W = c.W, H = c.H; c.clear(); if (univ.value === "salle") drawSalle(ctx, W, H); else drawReels(ctx, W, H, T); });
    lp.play();
  }
});

/* =====================================================================
   2. La récurrence : une rangée de dominos (3D tournable)
   ===================================================================== */
var DM_H = 1, DM_T = 0.16, DM_W = 0.52, DM_SP = 0.55, DM_GAP = 1.32, DM_N = 14;
/* formules à vérifier : u(k) terme, R(n) membre de droite */
var DM_F = {
  imp:{nom:"1 + 3 + … + (2n − 1) = n²", u:function(k){ return 2 * k - 1; }, R:function(n){ return n * n; }, rs:function(n){ return n + "²"; }},
  car:{nom:"1² + 2² + … + n² = n(n + 1)(2n + 1)/6", u:function(k){ return k * k; }, R:function(n){ return n * (n + 1) * (2 * n + 1) / 6; }, rs:function(n){ return n + "·" + (n + 1) + "·" + (2 * n + 1) + "/6"; }, ts:function(k){ return k + "²"; }},
  ent:{nom:"1 + 2 + … + n = n(n + 1)/2", u:function(k){ return k; }, R:function(n){ return n * (n + 1) / 2; }, rs:function(n){ return n + "·" + (n + 1) + "/2"; }},
  f1:{nom:"1 + 2 + … + n = (n² + n + 2)/2", u:function(k){ return k; }, R:function(n){ return (n * n + n + 2) / 2; }, rs:function(n){ return "(" + n + "² + " + n + " + 2)/2"; }},
  f2:{nom:"1 + 2 + … + n = 2n − 1", u:function(k){ return k; }, R:function(n){ return 2 * n - 1; }, rs:function(n){ return "2·" + n + " − 1"; }}
};
function dmS(f, n){ var s = 0; for (var k = 1; k <= n; k++) s += f.u(k); return s; }
function dmTerms(f, n){ var ts = f.ts || function(k){ return String(f.u(k)); }, a = [], k; if (n <= 4){ for (k = 1; k <= n; k++) a.push(ts(k)); return a.join(" + "); } return ts(1) + " + " + ts(2) + " + … + " + ts(n); }
/* polygones convexes 2D : se chevauchent-ils ? (axes séparateurs) */
function dmOverlap(A, B){
  var polys = [A, B], p, i;
  for (p = 0; p < 2; p++){ var P = polys[p]; for (i = 0; i < P.length; i++){ var q = P[(i + 1) % P.length], nx = -(q[1] - P[i][1]), ny = q[0] - P[i][0], a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
    A.forEach(function(v){ var d = v[0] * nx + v[1] * ny; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }); B.forEach(function(v){ var d = v[0] * nx + v[1] * ny; b0 = Math.min(b0, d); b1 = Math.max(b1, d); });
    if (a1 <= b0 + 1e-9 || b1 <= a0 + 1e-9) return false; } }
  return true;
}
/* profil (x, z) d'un domino de pivot p incliné de θ */
function dmQuad(p, th){ var c = Math.cos(th), s = Math.sin(th); return [[-DM_T, 0], [0, 0], [0, DM_H], [-DM_T, DM_H]].map(function(q){ return [p + q[0] * c + q[1] * s, -q[0] * s + q[1] * c]; }); }
function dmMaxAngle(p, pn, thn, hi){
  if (pn == null) return hi; var B = dmQuad(pn, thn); if (!dmOverlap(dmQuad(p, hi), B)) return hi;
  var lo = 0, h2 = hi, it; for (it = 0; it < 26; it++){ var m = (lo + h2) / 2; if (dmOverlap(dmQuad(p, m), B)) h2 = m; else lo = m; } return lo;
}

SFA.sim({
  id:"ma-recurrence-dominos", ch:"c12", tag:"Preuves · récurrence",
  titre:"La récurrence : une rangée de dominos",
  resume:"Pour faire tomber toute la rangée, il faut deux choses : pousser le premier domino (initialisation) et que chaque domino fasse tomber le suivant (hérédité). Il en manque une, et la preuve s'écroule.",
  but:"Regarde la rangée tomber, puis coupe l'initialisation (personne ne pousse le premier domino) ou casse l'hérédité à un rang n₀ (le domino n₀ est trop loin du suivant). Clique sur un domino pour casser l'hérédité juste après lui, et glisse sur la scène pour tourner la vue. En mode « Vérifier une formule », le tableau calcule la formule au rang n et au rang n + 1, et les dominos s'écartent là où l'hérédité est fausse.",
  aRetenir:"Pour prouver P(n) pour tout n ≥ 1 : (1) initialisation, on vérifie P(1) ; (2) hérédité, on suppose P(n) vraie pour un n quelconque et on en déduit P(n + 1). Les deux ensemble donnent P(n) pour tout n ≥ 1. L'une sans l'autre ne prouve rien.",
  piege:"Oublier l'initialisation. La formule 1 + 2 + … + n = (n² + n + 2)/2 a une hérédité parfaitement juste, et pourtant elle est fausse pour tout n : P(1) donne 1 = 2. À l'inverse, vérifier P(1), P(2), P(3) sur des exemples n'est pas une preuve.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.95}); ma1Ratio(c, 0.98, 1.3);
    var view = {az:0.95, el:0.36};
    var mode = k.seg("Mode", [["libre", "Dominos"], ["formule", "Vérifier une formule"]], "libre", function(){ showCtl(); reset(); });
    var tIni = k.toggle("Initialisation : on pousse le domino 1 (P(1) vraie)", true, function(){ reset(); });
    var tHer = k.toggle("Hérédité : chaque domino touche le suivant", true, function(){ reset(); });
    var sBrk = k.slider("Hérédité cassée après le rang n₀ (0 : jamais)", 0, 12, 1, 0, "", function(){ reset(); });
    var fsel = k.select("Formule P(n)", [["imp", "1 + 3 + … + (2n − 1) = n²"], ["car", "1² + 2² + … + n² = n(n + 1)(2n + 1)/6"], ["ent", "1 + 2 + … + n = n(n + 1)/2"], ["f1", "1 + 2 + … + n = (n² + n + 2)/2"], ["f2", "1 + 2 + … + n = 2n − 1"]], "imp", function(){ reset(); });
    var sN = k.slider("Rang n vérifié au tableau", 1, 12, 1, 4, "");
    k.button("▶ Pousser à nouveau", function(){ reset(); }, true);
    var ro = k.readouts(["Dominos tombés", "Initialisation", "Hérédité", "Conclusion"]);
    var nt = k.note("", "ok");
    function showCtl(){ var f = mode.value === "formule"; [[tIni, !f], [tHer, !f], [sBrk, !f], [fsel, f], [sN, f]].forEach(function(q){ var e = q[0].el || null; var box = e ? (e.closest ? e.closest(".ctl") : e.parentNode) : null; if (box) box.style.display = q[1] ? "" : "none"; }); }
    /* les toggles n'exposent pas leur élément : on les retrouve par leur texte */
    function findToggle(txt){ var lab = [].slice.call(k.ctrl.querySelectorAll(".ctl.tg")).filter(function(d){ return d.textContent.indexOf(txt) >= 0; })[0]; return lab; }
    tIni.el = findToggle("Initialisation") && findToggle("Initialisation").querySelector("input"); tHer.el = findToggle("Hérédité :") && findToggle("Hérédité :").querySelector("input");
    /* modèle logique : initialisation et liens n → n + 1 */
    function logic(){
      var L = [], i, ini;
      if (mode.value === "formule"){ var f = DM_F[fsel.value], P = function(n){ return dmS(f, n) === f.R(n); }; ini = P(1); for (i = 1; i < DM_N; i++) L.push(!P(i) || P(i + 1)); }
      else { ini = tIni.value; for (i = 1; i < DM_N; i++) L.push(tHer.value && i !== sBrk.value); }
      var reach = 0; if (ini){ reach = 1; while (reach < DM_N && L[reach - 1]) reach++; }
      return {ini:ini, L:L, reach:reach, firstBreak:L.indexOf(false) + 1};
    }
    var st = null, lg = null, T = 0, still = 0, phase = "wait";
    function reset(){
      lg = logic(); var p = 0, i; st = [];
      for (i = 0; i < DM_N; i++){ st.push({p:p, th:0, om:0, on:false}); if (i < DM_N - 1) p += lg.L[i] ? DM_SP : DM_GAP; }
      T = 0; still = 0; phase = "wait";
    }
    reset();
    function step(dt){
      var i, moved = 0;
      for (i = DM_N - 1; i >= 0; i--){
        var d = st[i]; if (!d.on) continue;
        d.om += (6.5 * Math.sin(d.th) + 1.4) * dt; var phi = Math.min(PI / 2, d.th + d.om * dt), nx = i < DM_N - 1 ? st[i + 1] : null;
        var mx = dmMaxAngle(d.p, nx ? nx.p : null, nx ? nx.th : 0, phi);
        if (phi >= PI / 2 - 1e-6 && mx >= PI / 2 - 1e-6){ d.om = 0; }
        if (mx < phi - 1e-7){ if (nx && !nx.on){ nx.on = true; nx.om = Math.max(0.9, d.om * 0.7); } d.om = Math.min(d.om, Math.max(0, (mx - d.th) / dt)); }
        moved += Math.abs(mx - d.th); d.th = mx;
      }
      /* un domino déjà penché suit le suivant qui s'éloigne */
      for (i = DM_N - 2; i >= 0; i--){ var e = st[i], n2 = st[i + 1]; if (e.on && e.om === 0 && e.th < PI / 2 - 1e-6){ var m2 = dmMaxAngle(e.p, n2.p, n2.th, Math.min(PI / 2, e.th + 0.02)); if (m2 > e.th){ moved += m2 - e.th; e.th = m2; } } }
      return moved;
    }
    var lp = k.loop(function(dt){
      T += dt;
      if (phase === "wait" && T > 0.9){ phase = "push"; T = 0; }
      if (phase === "push"){ if (T > 0.45){ phase = "run"; T = 0; if (lg.ini){ st[0].on = true; st[0].om = 1.3; } } }
      if (phase === "run"){ var mv = 0, n = 4; for (var q = 0; q < n; q++) mv += step(dt / n); still = mv < 1e-4 ? still + dt : 0; if (still > 1.2 || T > 14){ phase = "hold"; T = 0; } }
      if (phase === "hold" && T > 2.4) reset();
      k.redraw();
    });
    /* projection 3D (perspective légère) */
    var cam = {S:40, ox:0, oy:0, cx:0, cz:0};
    function P3(x, y, z){
      var X0 = x - cam.cx, Z0 = z - cam.cz, ca = Math.cos(view.az), sa = Math.sin(view.az), ce = Math.cos(view.el), se = Math.sin(view.el);
      var xr = X0 * ca - y * sa, yr = X0 * sa + y * ca, zs = Z0 * ce + yr * se, dep = yr * ce - Z0 * se, f = 1 / Math.max(0.4, 1 + dep * 0.075);
      return {x:cam.ox + xr * cam.S * f, y:cam.oy - zs * cam.S * f, d:dep, f:f};
    }
    function depthVec(){ return [Math.sin(view.az) * Math.cos(view.el), Math.cos(view.az) * Math.cos(view.el), -Math.sin(view.el)]; }
    function corner(d, u, v, y){ var c0 = Math.cos(d.th), s0 = Math.sin(d.th); return [d.p + u * c0 + v * s0, y, -u * s0 + v * c0]; }
    var LIGHT = (function(){ var l = [-0.45, -0.55, 0.7], n = Math.hypot(l[0], l[1], l[2]); return [l[0] / n, l[1] / n, l[2] / n]; })();
    function drawDomino(ctx, d, idx, alpha, tint, hl){
      var c0 = Math.cos(d.th), s0 = Math.sin(d.th), eu = [c0, 0, -s0], ev = [s0, 0, c0], ey = [0, 1, 0], dv = depthVec(), w2 = DM_W / 2;
      var faces = [
        {n:[-eu[0], -eu[1], -eu[2]], q:[[-DM_T, 0, -w2], [-DM_T, DM_H, -w2], [-DM_T, DM_H, w2], [-DM_T, 0, w2]], big:true},
        {n:eu, q:[[0, 0, -w2], [0, DM_H, -w2], [0, DM_H, w2], [0, 0, w2]], big:true},
        {n:ev, q:[[-DM_T, DM_H, -w2], [0, DM_H, -w2], [0, DM_H, w2], [-DM_T, DM_H, w2]]},
        {n:[-ev[0], -ev[1], -ev[2]], q:[[-DM_T, 0, -w2], [0, 0, -w2], [0, 0, w2], [-DM_T, 0, w2]]},
        {n:[0, -1, 0], q:[[-DM_T, 0, -w2], [0, 0, -w2], [0, DM_H, -w2], [-DM_T, DM_H, -w2]]},
        {n:ey, q:[[-DM_T, 0, w2], [0, 0, w2], [0, DM_H, w2], [-DM_T, DM_H, w2]]}
      ];
      ctx.save(); ctx.globalAlpha = alpha;
      var base = tint || [244, 239, 227];
      faces.forEach(function(fc){
        var vis = fc.n[0] * dv[0] + fc.n[1] * dv[1] + fc.n[2] * dv[2]; if (vis >= 0) return;
        var pts = fc.q.map(function(q){ var w = corner(d, q[0], q[1], q[2]); return P3(w[0], w[1], w[2]); });
        var lam = Math.max(0, fc.n[0] * LIGHT[0] + fc.n[1] * LIGHT[1] + fc.n[2] * LIGHT[2]), br = 0.58 + 0.45 * lam;
        ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath();
        ctx.fillStyle = "rgb(" + Math.min(255, Math.round(base[0] * br)) + "," + Math.min(255, Math.round(base[1] * br)) + "," + Math.min(255, Math.round(base[2] * br)) + ")"; ctx.fill();
        ctx.strokeStyle = hl ? AMBER : "rgba(60,45,30,.55)"; ctx.lineWidth = hl ? 2.4 : 0.9; ctx.stroke();
        if (fc.big){
          /* numéro et trait central sur la grande face visible, dans le bon sens de lecture */
          var u0 = fc.q[0][0], A = corner(d, u0, DM_H, -w2), B = corner(d, u0, DM_H, w2), pa = P3(A[0], A[1], A[2]), pb = P3(B[0], B[1], B[2]), lft = pa.x <= pb.x ? -w2 : w2, rgt = -lft;
          var TL = P3.apply(null, corner(d, u0, DM_H, lft)), TR = P3.apply(null, corner(d, u0, DM_H, rgt)), BL = P3.apply(null, corner(d, u0, 0, lft));
          var ax = (TR.x - TL.x) / 52, ay = (TR.y - TL.y) / 52, bx = (BL.x - TL.x) / 100, by = (BL.y - TL.y) / 100;
          if (Math.abs(ax * by - ay * bx) > 0.004){
            ctx.save(); ctx.transform(ax, ay, bx, by, TL.x, TL.y); ctx.fillStyle = "rgba(40,30,20,.75)"; ctx.fillRect(5, 49, 42, 2.5);
            ctx.fillStyle = hl ? "#9a3412" : "#2b2117"; ctx.font = "800 30px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(idx + 1), 26, 27);
            ctx.beginPath(); ctx.arc(16, 70, 4.5, 0, 7); ctx.arc(36, 84, 4.5, 0, 7); ctx.fill(); ctx.restore();
          }
        }
      });
      ctx.restore();
    }
    function shadow(ctx, d, alpha){
      var w2 = DM_W / 2, pts = [], u, v, y; for (u = 0; u < 2; u++) for (v = 0; v < 2; v++) for (y = 0; y < 2; y++){ var w = corner(d, u ? 0 : -DM_T, v ? DM_H : 0, y ? w2 : -w2), s = w[2] / LIGHT[2]; pts.push(P3(w[0] - LIGHT[0] * s, w[1] - LIGHT[1] * s, 0)); }
      pts.sort(function(a, b){ return a.x - b.x || a.y - b.y; }); var cr = function(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }, lo = [], hi = [];
      pts.forEach(function(p){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
      pts.slice().reverse().forEach(function(p){ while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); });
      var hull = lo.slice(0, -1).concat(hi.slice(0, -1)); ctx.save(); ctx.globalAlpha = 0.2 * alpha; ctx.fillStyle = "#2a1a0c"; ctx.beginPath(); hull.forEach(function(p, i){ if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    /* souris : glisser = tourner ; clic sur un domino = choisir le rang */
    var drag = null; c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    function pick(pp){ var best = -1, bd = 26; st.forEach(function(d, i){ var w = corner(d, -DM_T / 2, DM_H * 0.55, 0), q = P3(w[0], w[1], w[2]), dd = Math.hypot(q.x - pp.x, q.y - pp.y); if (dd < bd){ bd = dd; best = i; } }); return best; }
    c.pointer(function(t, pp){
      if (t === "down"){ drag = {x:pp.x, y:pp.y, x0:pp.x, y0:pp.y}; c.cv.style.cursor = "grabbing"; }
      else if (t === "drag" && drag){ view.az += (pp.x - drag.x) * 0.008; view.el = Math.max(0.12, Math.min(1.25, view.el + (pp.y - drag.y) * 0.006)); drag.x = pp.x; drag.y = pp.y; k.redraw(); }
      else if (t === "up"){ if (drag && Math.hypot(pp.x - drag.x0, pp.y - drag.y0) < 5){ var i = pick(pp); if (i >= 0){ if (mode.value === "formule"){ sN.set(Math.max(1, Math.min(12, i + 1))); } else if (i < 12){ sBrk.set(sBrk.value === i + 1 ? 0 : i + 1); if (!tHer.value && tHer.el){ tHer.el.checked = true; } reset(); } } } drag = null; c.cv.style.cursor = "grab"; k.redraw(); }
      else if (t === "move"){ c.cv.style.cursor = pick(pp) >= 0 ? "pointer" : "grab"; }
    });

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, mob = ma1Mobile(c), fm = mode.value === "formule", f = DM_F[fsel.value], i, n = sN.value;
      if (!st) return; c.clear();
      /* décor : mur + tableau */
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#f4efe6"); g.addColorStop(0.55, "#e9dfcf"); g.addColorStop(1, "#d9c9b0"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      var bh = H * (fm ? (mob ? 0.35 : 0.33) : (mob ? 0.2 : 0.19)), bx = 10, bw = W - 20, by = 8; ma1Board(ctx, bx + 4, by + 4, bw - 8, bh - 8);
      var big = mob ? 13.5 : 16, sm = mob ? 10.5 : 12.5, OK = "#8ee6a8", KO = "#ff9a8a", CH = "#f4f1e8";
      if (!fm){
        var ini = tIni.value, her = tHer.value && sBrk.value === 0;
        ma1Text(ctx, "Initialisation : P(1)  " + (ini ? "✓" : "✗") + "     Hérédité : P(n) ⇒ P(n + 1)  " + (her ? "✓" : "✗"), W / 2, by + bh * 0.36, {size:big, color:CH, math:true, maxW:bw - 30});
        var concl = lg.reach >= DM_N ? "⟹  P(n) est vraie pour tout n ≥ 1" : lg.reach === 0 ? "⟹  rien n'est prouvé (personne ne pousse)" : "⟹  prouvé seulement pour n ≤ " + lg.reach;
        ma1Text(ctx, concl, W / 2, by + bh * 0.7, {size:big, color:lg.reach >= DM_N ? OK : KO, math:true, maxW:bw - 30});
      } else {
        var Sn = dmS(f, n), Rn = f.R(n), Rn1 = f.R(n + 1), r1 = dmS(f, 1) === f.R(1), Pn = Sn === Rn, Pn1 = Sn + f.u(n + 1) === Rn1, alg = Rn + f.u(n + 1) === Rn1;
        /* hérédité au rang n : l'implication P(n) ⇒ P(n + 1) ; si P(n) est fausse, elle est vraie d'office */
        var hTxt = (Pn || alg) ? "Hérédité " + n + " → " + (n + 1) + " : " + F(Rn, 0) + " + " + f.u(n + 1) + " = " + F(Rn + f.u(n + 1), 0) + " ; formule " + f.rs(n + 1) + " = " + F(Rn1, 0) + ((!Pn || Pn1) ? "  ✓" : "  ✗")
                               : "Hérédité " + n + " → " + (n + 1) + " : P(" + n + ") est fausse, donc « P(" + n + ") ⇒ P(" + (n + 1) + ") » est vraie";
        var lines = [["P(n) :  " + f.nom, CH, big],
          ["Initialisation : P(1) donne " + dmS(f, 1) + " = " + f.R(1) + (r1 ? "  ✓" : "  ✗ faux"), r1 ? OK : KO, sm],
          ["Contrôle au rang " + n + " (ce n'est pas une preuve) :", "#dfe8e2", sm - 0.5],
          [dmTerms(f, n) + " = " + Sn + " ; formule " + f.rs(n) + " = " + Rn + (Pn ? "  ✓" : "  ✗"), Pn ? OK : KO, sm],
          [hTxt, (!Pn || Pn1) ? (Pn || alg ? OK : "#f3d27a") : KO, sm]];
        lines.forEach(function(l, q){ ma1Text(ctx, l[0], W / 2, by + bh * (0.16 + 0.165 * q), {size:l[2], color:l[1], math:q === 0, weight:q === 2 ? 600 : 700, maxW:bw - 26}); });
      }
      /* caméra : on cadre la rangée sous le tableau */
      var top = by + bh + 6, last = st[DM_N - 1].p; cam.cx = (last - 1.3) / 2; cam.cz = 0.3; cam.S = 1; cam.ox = 0; cam.oy = 0;
      var ext = [[-1.9, -0.8, 0], [last + 0.5, -0.8, 0], [-1.9, 0.6, 0], [last + 0.5, 0.6, 0], [-1.9, 0, 1.35], [last + 0.5, 0, 1.1], [0, -0.8, 1.1], [last, 0.6, 1.1]].map(function(q){ return P3(q[0], q[1], q[2]); });
      var x0 = Math.min.apply(null, ext.map(function(q){ return q.x; })), x1 = Math.max.apply(null, ext.map(function(q){ return q.x; })), y0 = Math.min.apply(null, ext.map(function(q){ return q.y; })), y1 = Math.max.apply(null, ext.map(function(q){ return q.y; }));
      var aw = W - 16, ah = H - top - 10; cam.S = Math.min(aw / Math.max(1e-3, x1 - x0), ah / Math.max(1e-3, y1 - y0)); cam.ox = 8 + (aw - (x1 - x0) * cam.S) / 2 - x0 * cam.S; cam.oy = top + (ah - (y1 - y0) * cam.S) / 2 - y0 * cam.S;
      /* table en bois (dessus + chant) */
      ctx.save(); ctx.beginPath(); ctx.rect(0, top - 4, W, H - top + 4); ctx.clip(); var tx0 = -2.6, tx1 = last + 1.4, ty = 1.5, tz = -0.18, T4 = [[tx0, -ty, 0], [tx1, -ty, 0], [tx1, ty, 0], [tx0, ty, 0]].map(function(q){ return P3(q[0], q[1], q[2]); });
      var dv = depthVec();
      function poly(pts, fill){ ctx.beginPath(); pts.forEach(function(q, j){ if (j) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
      ma1Shadow(ctx, (T4[0].x + T4[2].x) / 2, (T4[0].y + T4[2].y) / 2 + 18, Math.abs(T4[1].x - T4[3].x) * 0.55 + 20, 22, 0.18);
      if (-dv[1] > 0) poly([[tx0, -ty, 0], [tx1, -ty, 0], [tx1, -ty, tz], [tx0, -ty, tz]].map(function(q){ return P3(q[0], q[1], q[2]); }), "#7a4b26");
      if (dv[1] > 0) poly([[tx0, ty, 0], [tx1, ty, 0], [tx1, ty, tz], [tx0, ty, tz]].map(function(q){ return P3(q[0], q[1], q[2]); }), "#7a4b26");
      if (-dv[0] > 0) poly([[tx0, -ty, 0], [tx0, ty, 0], [tx0, ty, tz], [tx0, -ty, tz]].map(function(q){ return P3(q[0], q[1], q[2]); }), "#6a3f1f");
      if (dv[0] > 0) poly([[tx1, -ty, 0], [tx1, ty, 0], [tx1, ty, tz], [tx1, -ty, tz]].map(function(q){ return P3(q[0], q[1], q[2]); }), "#6a3f1f");
      g = ctx.createLinearGradient(T4[0].x, T4[0].y, T4[2].x, T4[2].y); g.addColorStop(0, "#c8935e"); g.addColorStop(1, "#a8723f"); poly(T4, g);
      ctx.save(); ctx.strokeStyle = "rgba(90,50,20,.16)"; ctx.lineWidth = 1; for (i = 1; i < 7; i++){ var yy = -ty + 2 * ty * i / 7, a = P3(tx0, yy, 0), b = P3(tx1, yy, 0); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } ctx.restore();
      /* numéros et marques sur la table, devant chaque domino */
      var placed = [], fade = function(j){ return j < DM_N - 4 ? 1 : Math.max(0.18, 1 - (j - (DM_N - 4) + 1) * 0.2); };
      function freeBox(b){ for (var q = 0; q < placed.length; q++){ var o = placed[q]; if (Math.abs(b.x - o.x) < (b.w + o.w) / 2 + 3 && Math.abs(b.y - o.y) < (b.h + o.h) / 2 + 2) return false; } return true; }
      /* croix de l'hérédité cassée : là où le domino couché n'atteint pas le suivant (loin des numéros posés devant) (calculées d'abord : prioritaires sur les numéros) */
      var crosses = [], firstX = true;
      for (i = 0; i < DM_N - 1; i++){
        if (lg.L[i]) continue;
        var dX = st[i], gp = P3(dX.p + DM_GAP - DM_T - 0.1, 0, 0.02), csz = Math.max(9, Math.min(mob ? 14 : 16, 14 * gp.f * cam.S / 34)), cb = {x:gp.x, y:gp.y, w:csz * 0.75, h:csz * 0.8};
        if (!firstX && !freeBox(cb)) continue;
        firstX = false; placed.push(cb); crosses.push([gp, csz, i]);
      }
      for (i = 0; i < DM_N; i++){
        var d = st[i], lab = P3(d.p - DM_T / 2, -DM_W / 2 - 0.38, 0), proven = i < lg.reach, fallen = d.th > 0.25;
        var col = fm ? (dmS(f, i + 1) === f.R(i + 1) ? GREEN : RED) : (proven ? GREEN : "#6b5a48");
        var ls = fallen ? "P(" + (i + 1) + ")" : String(i + 1), lsz = Math.max(9, Math.min(13, 12 * lab.f * cam.S / 34)); ctx.save(); ctx.font = ma1Font(lsz, 800); var lw = ctx.measureText(ls).width; ctx.restore();
        var lb = {x:lab.x, y:lab.y, w:lw + 4, h:lsz + 3};
        if (lab.x - lw / 2 < 2 || lab.x + lw / 2 > W - 2 || !freeBox(lb)) continue;
        placed.push(lb); ctx.save(); ctx.globalAlpha = fade(i); ma1Text(ctx, ls, lab.x, lab.y, {size:lsz, color:col, weight:800, halo:"rgba(255,240,220,.85)"}); ctx.restore();
      }
      st.forEach(function(d, j){ shadow(ctx, d, fade(j)); });
      /* dominos du plus loin au plus proche */
      var order = st.map(function(d, j){ var w = corner(d, -DM_T / 2, DM_H / 2, 0); return [j, P3(w[0], w[1], w[2]).d]; }).sort(function(a, b){ return b[1] - a[1]; });
      order.forEach(function(o){ var j = o[0], d = st[j], tint = null; if (fm){ tint = dmS(f, j + 1) === f.R(j + 1) ? [226, 244, 230] : [250, 222, 216]; } drawDomino(ctx, d, j, fade(j), tint, fm && (j === n - 1 || j === n)); });
      crosses.forEach(function(q){ ctx.save(); ctx.globalAlpha = fade(q[2]); ma1Text(ctx, "✗", q[0].x, q[0].y, {size:q[1], color:RED, weight:800, halo:"rgba(255,240,220,.95)"}); ctx.restore(); });
      var lastP = P3(last + 1.2, 0, 0.3); ma1Text(ctx, "…", Math.max(14, Math.min(W - 14, lastP.x)), Math.max(top + 10, Math.min(H - 24, lastP.y)), {size:mob ? 16 : 20, color:"#5b3a1a", weight:800});
      /* la main qui pousse le premier domino */
      var push = phase === "push" ? Math.min(1, T / 0.45) : phase === "wait" ? 0 : 1, tipX = -DM_T - 0.36 + (lg.ini ? 0.36 : 0.1) * push, tip = P3(tipX, 0, 0.8), base = P3(tipX - 0.42, 0, 0.84), sc = tip.f * cam.S / 75;
      var ang = Math.atan2(tip.y - base.y, tip.x - base.x), len = Math.hypot(tip.x - base.x, tip.y - base.y) / sc;
      ctx.save(); ctx.translate(base.x, base.y); ctx.rotate(ang); ctx.scale(sc, sc);
      var gs = ctx.createLinearGradient(0, -30, 0, 22); gs.addColorStop(0, "#5b8fd6"); gs.addColorStop(1, "#22508f"); ctx.fillStyle = gs; ma1RR(ctx, -70, -20, 52, 36, 9); ctx.fill();
      ctx.fillStyle = "#f4f6fa"; ma1RR(ctx, -24, -18, 8, 32, 3); ctx.fill();
      var gk = ctx.createLinearGradient(0, -20, 0, 18); gk.addColorStop(0, "#f6d2b3"); gk.addColorStop(1, "#c98e68"); ctx.fillStyle = gk;
      ctx.beginPath(); ctx.ellipse(-2, 0, 19, 15, 0, 0, 7); ctx.fill();
      ma1RR(ctx, 6, -9, Math.max(14, len - 4), 9, 4.5); ctx.fill();
      ctx.fillStyle = "#e8b48f"; [4, 9].forEach(function(yy, q){ ma1RR(ctx, 6, yy - 2 + q, 14, 7, 3.5); ctx.fill(); });
      ctx.fillStyle = "#f3c7a4"; ctx.beginPath(); ctx.ellipse(2, -13, 10, 5, -0.25, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(120,70,40,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(len - 4, -8); ctx.lineTo(len - 4, -1); ctx.stroke();
      ctx.restore(); ctx.restore();
      if (!lg.ini){ ma1Text(ctx, "✗ P(1) fausse : personne ne pousse le domino 1", 10, H - 28, {size:mob ? 11 : 12.5, color:RED, weight:800, align:"left", halo:"rgba(255,248,238,.92)", maxW:W - 20}); }
      ma1Text(ctx, "Glisse pour tourner · clique un domino", W - 8, H - 9, {size:mob ? 9.5 : 10.5, color:"#6b5a48", weight:700, align:"right"});
      /* lectures */
      var nf = st.filter(function(d){ return d.th > 0.25; }).length;
      ro.set(0, nf + " / " + DM_N);
      ro.set(1, lg.ini ? "P(1) vraie" : "P(1) fausse");
      ro.set(2, lg.firstBreak === 0 ? "vraie pour tout n" : "fausse de " + lg.firstBreak + " à " + (lg.firstBreak + 1));
      ro.set(3, lg.reach >= DM_N ? "P(n) pour tout n ≥ 1" : lg.reach === 0 ? "rien n'est prouvé" : "seulement n ≤ " + lg.reach);
      var msg;
      if (fm){
        var fk = fsel.value;
        msg = fk === "f1" ? "<b>Hérédité juste, initialisation fausse.</b> Si la formule était vraie au rang n, elle le serait au rang n + 1 ; mais P(1) donne 1 = 2. Aucun domino n'est poussé : la formule est fausse pour tout n." :
              fk === "f2" ? "<b>Initialisation juste, hérédité fausse.</b> P(1) et P(2) sont vraies, mais P(3) est fausse (1 + 2 + 3 = 6 ≠ 5) : l'implication P(2) ⇒ P(3) est fausse, le domino 2 ne fait pas tomber le 3. En général, (2n − 1) + (n + 1) = 3n ≠ 2n + 1 dès n ≥ 2 : l'hérédité ne se démontre pas. Des exemples vrais ne prouvent rien." :
              "<b>Initialisation et hérédité sont justes</b> : on ajoute le terme suivant au membre de droite et on retrouve la formule au rang n + 1. Toute la rangée tombe : P(n) est vraie pour tout n ≥ 1.";
      } else msg = lg.reach >= DM_N ? "Le premier domino est poussé et chacun fait tomber le suivant : <b>toute la rangée tombe</b>, aussi loin qu'elle aille." : lg.reach === 0 ? "<b>Sans initialisation, rien ne tombe</b>, même si chaque domino est assez proche du suivant : l'hérédité seule ne prouve rien." : "<b>L'hérédité est cassée après le rang " + lg.reach + "</b> : le domino " + lg.reach + " tombe sans toucher le suivant. On n'a prouvé P(n) que pour n ≤ " + lg.reach + ".";
      nt.set(msg, lg.reach >= DM_N ? "ok" : "warn");
    });
    showCtl(); lp.play();
  }
});

/* =====================================================================
   3. Le supremum, c'est le plus bas des plafonds
   ===================================================================== */
var SB = "₀₁₂₃₄₅₆₇₈₉";
function spSub(n){ return String(n).split("").map(function(ch){ return SB[+ch] || ch; }).join(""); }
var SP_SETS = {
  suite:{nom:"A = {2 − 2/(n + 1) : n ≥ 1}", kind:"seq", u:function(n){ return 2 - 2 / (n + 1); }, vmin:0, vmax:2.6, s:2, max:null, sTxt:"2"},
  alt:{nom:"A = {1 + (−1)ⁿ/n : n ≥ 1}", kind:"seq", u:function(n){ return 1 + (n % 2 ? -1 : 1) / n; }, vmin:-0.3, vmax:2.1, s:1.5, max:1.5, maxN:2, sTxt:"1,5"},
  ouvert:{nom:"A = [0,5 ; 2[", kind:"int", a:0.5, b:2, ca:true, cb:false, vmin:0, vmax:2.6, s:2, max:null, sTxt:"2"},
  ferme:{nom:"A = [0,5 ; 2]", kind:"int", a:0.5, b:2, ca:true, cb:true, vmin:0, vmax:2.6, s:2, max:2, sTxt:"2"},
  union:{nom:"A = ]0 ; 1[ ∪ {1,5}", kind:"int", a:0, b:1, ca:false, cb:false, iso:1.5, vmin:-0.3, vmax:2.1, s:1.5, max:1.5, sTxt:"1,5"},
  racine:{nom:"A = {x > 0 : x² < 2}", kind:"int", a:0, b:Math.SQRT2, ca:false, cb:false, vmin:-0.3, vmax:2.1, s:Math.SQRT2, max:null, sTxt:"√2 ≈ 1,4142", bTxt:"√2"},
  nat:{nom:"A = {1, 2, 3, …} (non majorée)", kind:"seq", u:function(n){ return n; }, vmin:0, vmax:4.6, s:null, max:null, sTxt:"n'existe pas"}
};
/* premier élément de A strictement au-dessus de m (suite : plus petit n) ; null s'il n'y en a pas */
/* deux nombres écrits avec assez de décimales pour qu'on voie lequel est le plus grand */
/* petit écart positif écrit avec deux chiffres significatifs au moins (jamais « 0 ») */
function spSmall(x){ var d = x > 0 ? Math.max(3, Math.min(11, Math.ceil(-Math.log10(x)) + 1)) : 3; return F(x, d); }
function spPair(x, m){ var d = 4; while (d < 9 && F(x, d) === F(m, d)) d++; return [F(x, d), F(m, d)]; }
function spAbove(S, m){
  if (S.s !== null && m >= S.s - 1e-12) return null;
  if (S.kind === "seq"){ for (var n = 1; n < 2000000; n++) if (S.u(n) > m + 1e-12) return {n:n, x:S.u(n)}; return null; }
  if (S.max !== null) return {x:S.max};
  var lo = Math.max(m, S.a); return {x:(lo + S.b) / 2};
}
SFA.sim({
  id:"ma-sup-plafond", ch:"c12", tag:"Nombres réels · borne supérieure",
  titre:"Le supremum, c'est le plus bas des plafonds",
  resume:"Un plafond posé au-dessus d'un ensemble A est un majorant. Descends-le : il se bloque au supremum, le plus petit des majorants, qui n'est pas forcément un élément de A.",
  but:"Attrape le plafond et descends-le. Il reste vert tant qu'aucun élément de A ne dépasse (c'est un majorant) ; en dessous du supremum, un élément le perce et il devient rouge, puis il remonte au plus bas possible quand tu le lâches. La bande orange de hauteur ε sous le plafond montre la caractérisation : au supremum, elle contient toujours un élément de A, si petit que soit ε. Compare une suite, un intervalle ouvert ou fermé, et un ensemble non majoré.",
  aRetenir:"M est un majorant de A si x ≤ M pour tout x de A. Le supremum sup A est le plus petit des majorants. Caractérisation : s = sup A si et seulement si s majore A et, pour tout ε > 0, il existe x ∈ A avec x > s − ε. Si sup A appartient à A, c'est le maximum ; sinon A n'a pas de maximum. Dans ℝ, toute partie non vide et majorée a un supremum (axiome de la borne supérieure).",
  piege:"Confondre supremum et maximum : [0,5 ; 2[ a pour supremum 2, mais pas de maximum, car 2 n'est pas dans l'ensemble. Et un majorant n'est pas unique : tout réel au-dessus du supremum en est un.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1}); ma1Ratio(c, 1.0, 1.32);
    var M = 2.55, auto = true, tA = 0, back = null, dragging = false;
    var sel = k.select("Ensemble A", [["suite", "Suite qui monte : 2 − 2/(n + 1)"], ["alt", "Suite alternée : 1 + (−1)ⁿ/n"], ["ouvert", "Intervalle [0,5 ; 2["], ["ferme", "Intervalle [0,5 ; 2]"], ["union", "]0 ; 1[ ∪ {1,5}"], ["racine", "{x > 0 : x² < 2}"], ["nat", "{1, 2, 3, …} (non majorée)"]], "suite", function(){ var Sd = SP_SETS[sel.value]; M = Sd.vmax - 0.05; tA = 0; auto = true; setBtn(); showCtl(); });
    var se = k.slider("Largeur ε de la bande", 0.01, 1, 0.01, 0.3, "", function(){ auto = false; setBtn(); });
    var tb = k.toggle("Montrer la bande ε sous le plafond", true);
    var bA = k.button("⏸ Pause", function(){ auto = !auto; if (auto){ tA = 3.2; } setBtn(); }, true);
    var bDown = k.button("⤓ Descendre au plus bas", function(){ var Sd = SP_SETS[sel.value]; if (Sd.s !== null) back = {from:M, to:Sd.s, t:0}; });
    function setBtn(){ bA.textContent = auto ? "⏸ Pause" : "▶ Animation"; }
    /* {1, 2, 3, …} n'a pas de supremum : ε, la bande et « Descendre » n'ont pas d'objet, on les cache */
    var tbBox = [].slice.call(k.ctrl.querySelectorAll(".ctl.tg")).filter(function(d){ return d.textContent.indexOf("bande ε") >= 0; })[0];
    function showCtl(){ var on = SP_SETS[sel.value].s !== null, seBox = se.el.closest ? se.el.closest(".ctl") : se.el.parentNode; [seBox, tbBox, bDown].forEach(function(e){ if (e) e.style.display = on ? "" : "none"; }); }
    var ro = k.readouts(["Plafond M", "M est un majorant ?", "sup A", "max A", "Témoin dans ]M − ε ; M]"]);
    var nt = k.note("", "ok");
    var geo = null; showCtl();
    var lp = k.loop(function(dt){
      var Sd = SP_SETS[sel.value];
      if (back){ back.t += dt / 0.6; var e = Math.min(1, back.t); M = back.from + (back.to - back.from) * (1 - Math.pow(1 - e, 3)); if (e >= 1){ M = back.to; back = null; } }
      else if (auto && !dragging){
        tA += dt;
        if (Sd.s === null){ M = 2.4 + 1.9 * (0.5 + 0.5 * Math.sin(tA * 0.7)); }
        else if (tA < 3.2){ var u = tA / 3.2, top = Sd.vmax - 0.05; M = top + (Sd.s - top) * (1 - Math.pow(1 - u, 3)); }
        else { M = Sd.s; var ph = ((tA - 3.2) / 9) % 1, w = ph < 0.5 ? ph * 2 : 2 - ph * 2; se.set(Math.max(0.01, Math.round(Math.exp(Math.log(0.8) + (Math.log(0.01) - Math.log(0.8)) * w) * 100) / 100)); }
      }
      k.redraw();
    });
    c.cv.style.touchAction = "none";
    function nearPlank(p){ return geo && p.x > geo.xs - 4 && Math.abs(p.y - (geo.Y(M) - 9)) < 26; }
    c.pointer(function(t, p){
      if (!geo) return; var Sd = SP_SETS[sel.value];
      if (t === "down" && nearPlank(p)){ dragging = true; auto = false; back = null; setBtn(); geo.off = p.y - geo.Y(M); c.cv.style.cursor = "grabbing"; }
      else if (t === "drag" && dragging){ var v = geo.iY(p.y - geo.off); v = Math.max(Sd.vmin + 0.05, Math.min(Sd.vmax - 0.02, v)); if (Sd.s !== null && Math.abs(geo.Y(v) - geo.Y(Sd.s)) < 6) v = Sd.s; M = v; k.redraw(); }
      else if (t === "up" && dragging){ dragging = false; c.cv.style.cursor = "grab"; if (Sd.s !== null && M < Sd.s) back = {from:M, to:Sd.s, t:0}; }
      else if (t === "move") c.cv.style.cursor = nearPlank(p) ? "grab" : "default";
    });

    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, mob = ma1Mobile(c), Sd = SP_SETS[sel.value], eps = se.value, i;
      c.clear();
      var yTop = 54, yFl = H - 46, Y = function(v){ return yFl - (v - Sd.vmin) / (Sd.vmax - Sd.vmin) * (yFl - yTop); }, iY = function(py){ return Sd.vmin + (yFl - py) / (yFl - yTop) * (Sd.vmax - Sd.vmin); };
      var rx0 = mob ? 6 : 10, rw = mob ? 44 : 46, xs = rx0 + rw + (mob ? 12 : 18), xe = W - (mob ? 34 : 44);
      geo = {Y:Y, iY:iY, xs:xs, off:geo ? geo.off : 0};
      /* décor : mur d'atelier, sol */
      var g = ctx.createLinearGradient(0, 0, 0, yFl); g.addColorStop(0, "#e9eef4"); g.addColorStop(1, "#d5dde7"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, yFl);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; for (var by = yFl - 26; by > 0; by -= 26){ var off = Math.round((yFl - by) / 26) % 2 ? 0 : 30; ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke(); for (var bx = off; bx < W; bx += 60){ ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + 26); ctx.stroke(); } } ctx.restore();
      g = ctx.createLinearGradient(0, yFl, 0, H); g.addColorStop(0, "#8d939c"); g.addColorStop(1, "#b8bec6"); ctx.fillStyle = g; ctx.fillRect(0, yFl, W, H - yFl);
      g = ctx.createLinearGradient(0, 0, 0, 28); g.addColorStop(0, "#4a525e"); g.addColorStop(1, "#7d8796"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 26); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(0, 26, W, 3);
      /* règle verticale graduée */
      var rg = ctx.createLinearGradient(rx0, 0, rx0 + rw, 0); rg.addColorStop(0, "#f3dcab"); rg.addColorStop(0.6, "#e2bf82"); rg.addColorStop(1, "#b98c4f");
      ma1Shadow(ctx, rx0 + rw / 2 + 4, yFl + 4, rw * 0.7, 5, 0.3); ctx.fillStyle = rg; ma1RR(ctx, rx0, yTop - 16, rw, yFl - yTop + 22, 4); ctx.fill();
      var tyM = Y(M) - 8, span = Sd.vmax - Sd.vmin, st1 = span > 3 ? 0.5 : 0.25, labStep = span > 3 ? 1 : 0.5, v;
      for (v = Math.ceil(Sd.vmin / st1) * st1; v <= Sd.vmax + 1e-9; v += st1){ var yy = Y(v), major = Math.abs(v / labStep - Math.round(v / labStep)) < 1e-9; ctx.strokeStyle = "#5b3a1a"; ctx.lineWidth = major ? 1.6 : 1; ctx.beginPath(); ctx.moveTo(rx0 + rw, yy); ctx.lineTo(rx0 + rw - (major ? 12 : 7), yy); ctx.stroke(); if (major && Math.abs(yy - tyM) >= 15) ma1Text(ctx, F(v, 1), rx0 + rw - 15, yy, {size:mob ? 10 : 11, color:"#4a2f12", weight:800, align:"right"}); }
      /* les éléments de A */
      var showN = Math.max(8, Math.min(26, Math.floor((xe - xs) / (mob ? 17 : 19)))), dxp = (xe - xs) / (showN + 1);
      var cand = spAbove(Sd, M), isMaj = cand === null, wit = (Sd.s !== null && M - eps < Sd.s - 1e-12) ? spAbove(Sd, M - eps) : null;
      if (wit && (wit.x > M + 1e-12 || !isMaj)) wit = null;
      function onRuler(v2, col, wdt){ if (v2 > Sd.vmax || v2 < Sd.vmin) return; ctx.strokeStyle = col; ctx.lineWidth = wdt || 2; ctx.beginPath(); ctx.moveTo(rx0 + 3, Y(v2)); ctx.lineTo(rx0 + 13, Y(v2)); ctx.stroke(); }
      /* bande ε sous le plafond */
      if (tb.value && Sd.s !== null){
        var yM = Y(M), ye = Math.min(yFl - 2, Y(Math.max(Sd.vmin, M - eps))); ctx.fillStyle = wit ? "rgba(245,166,35,.28)" : "rgba(180,35,24,.16)"; ctx.fillRect(xs - 6, yM, xe - xs + 12, ye - yM);
        ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = wit ? AMBER : RED; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(xs - 6, ye); ctx.lineTo(xe + 6, ye); ctx.stroke(); ctx.restore();
        var bxr = W - (mob ? 18 : 24); ctx.strokeStyle = AMBER; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bxr - 5, yM); ctx.lineTo(bxr, yM); ctx.lineTo(bxr, ye); ctx.lineTo(bxr - 5, ye); ctx.stroke();
        ma1Text(ctx, "ε", bxr + (mob ? 8 : 11), Math.min(yFl - 9, ye - yM < 14 ? yM - 9 : (yM + ye) / 2), {size:mob ? 13 : 15, color:AMBER, math:true, weight:700});
      }
      /* le plafond (planche suspendue par deux câbles) */
      var yM2 = Y(M), pl = xs - 10, pr = xe + 8, ph2 = 16, okc = isMaj ? GREEN : RED;
      ctx.strokeStyle = "#3c4450"; ctx.lineWidth = 1.6; [0.22, 0.78].forEach(function(f2){ var cx = pl + (pr - pl) * f2; ctx.beginPath(); ctx.moveTo(cx, 30); ctx.lineTo(cx, yM2 - ph2); ctx.stroke(); ma1Ball(ctx, cx, 31, 5, "#9aa4b1"); });
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
      g = ctx.createLinearGradient(0, yM2 - ph2, 0, yM2); g.addColorStop(0, ma1Shade(okc, 0.35)); g.addColorStop(1, ma1Shade(okc, -0.2)); ctx.fillStyle = g; ma1RR(ctx, pl, yM2 - ph2, pr - pl, ph2, 4); ctx.fill(); ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(pl + 4, yM2 - ph2 + 2, pr - pl - 8, 2);
      ctx.strokeStyle = ma1Shade(okc, -0.45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(pl, yM2); ctx.lineTo(pr, yM2); ctx.stroke();
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = okc; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(rx0 + rw, yM2); ctx.lineTo(pl, yM2); ctx.stroke(); ctx.restore();
      function pillar(px, v2, hot, wt, lab){
        var top = Math.max(yTop - 8, Y(v2)), clip = Y(v2) < yTop - 8;
        ma1Shadow(ctx, px + 3, yFl + 2, 8, 2.5, 0.35);
        var pg = ctx.createLinearGradient(px - 2, 0, px + 2, 0); pg.addColorStop(0, "#c9d2dd"); pg.addColorStop(1, "#7c8796"); ctx.fillStyle = pg; ctx.fillRect(px - 1.6, top, 3.2, yFl - top);
        var col = hot ? RED : wt ? GOLD : BLUE; if (hot){ ctx.save(); var hg = ctx.createRadialGradient(px, top, 1, px, top, 16); hg.addColorStop(0, "rgba(220,40,30,.5)"); hg.addColorStop(1, "rgba(220,40,30,0)"); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(px, top, 16, 0, 7); ctx.fill(); ctx.restore(); }
        ma1Ball(ctx, px, top, mob ? 5 : 6, col); if (wt){ ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, top, 10, 0, 7); ctx.stroke(); }
        if (clip) ma1Text(ctx, "↑", px, top + 14, {size:12, color:RED, weight:800});
        if (lab) ma1Text(ctx, lab, px, yFl + 12, {size:mob ? 9 : 10, color:"#2b3440", weight:800});
      }
      if (Sd.kind === "seq"){
        for (i = 1; i <= showN; i++){ var uv = Sd.u(i); onRuler(uv, uv > M + 1e-12 ? RED : "rgba(30,63,143,.75)", 2); }
        for (i = 1; i <= showN; i++){ var u2 = Sd.u(i), lab = (i <= 3 || i % 5 === 0) ? String(i) : ""; pillar(xs + i * dxp, u2, u2 > M + 1e-12, wit && wit.n === i, lab); }
        ma1Text(ctx, "…", xe - dxp * 0.2 + (mob ? 4 : 6), yFl - 8, {size:16, color:"#2b3440", weight:800});
      } else {
        /* intervalle : liquide dans un tube de verre */
        var tx = xs + (xe - xs) * 0.38, tw2 = mob ? 13 : 16, ya = Y(Sd.a), yb = Y(Sd.b);
        ma1Shadow(ctx, tx + 4, yFl + 2, tw2 * 1.6, 4, 0.35);
        ctx.fillStyle = "rgba(255,255,255,.45)"; ma1RR(ctx, tx - tw2, yTop - 4, tw2 * 2, yFl - yTop + 4, tw2); ctx.fill(); ctx.strokeStyle = "rgba(90,110,140,.55)"; ctx.lineWidth = 1.3; ctx.stroke();
        var lg2 = ctx.createLinearGradient(tx - tw2, 0, tx + tw2, 0); lg2.addColorStop(0, "#7fb2ff"); lg2.addColorStop(0.45, "#2f6fd6"); lg2.addColorStop(1, "#173f86");
        ctx.fillStyle = lg2; ctx.fillRect(tx - tw2 + 3, yb, tw2 * 2 - 6, ya - yb);
        if (M < Sd.b){ var rg2 = ctx.createLinearGradient(tx - tw2, 0, tx + tw2, 0); rg2.addColorStop(0, "#ff9a8a"); rg2.addColorStop(0.5, "#d6342a"); rg2.addColorStop(1, "#8e1a12"); ctx.fillStyle = rg2; ctx.fillRect(tx - tw2 + 3, yb, tw2 * 2 - 6, Math.max(0, Math.min(ya, Y(M)) - yb)); }
        ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(tx - tw2 + 5, yTop, 3, yFl - yTop - 4);
        function cap(yv, closed, val, txt){ ctx.save(); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.fillStyle = closed ? INK : "#ffffff"; ctx.beginPath(); ctx.arc(tx, yv, 6.5, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); ma1Text(ctx, (txt || F(val, 4)) + (closed ? " ∈ A" : " ∉ A"), tx + tw2 + 8, yv + (Math.abs(yv - (Y(M) - 8)) < 20 ? 22 : 0), {size:mob ? 10 : 11.5, color:closed ? INK : RED, weight:800, align:"left", halo:"rgba(233,238,244,.95)"}); }
        cap(ya, Sd.ca, Sd.a, Sd.aTxt); cap(yb, Sd.cb, Sd.b, Sd.bTxt);
        ctx.lineWidth = 6; ctx.strokeStyle = "rgba(30,63,143,.75)"; ctx.beginPath(); ctx.moveTo(rx0 + 8, ya); ctx.lineTo(rx0 + 8, Math.max(yb, Y(Math.max(Sd.a, M)))); ctx.stroke(); if (M < Sd.b){ ctx.strokeStyle = RED; ctx.beginPath(); ctx.moveTo(rx0 + 8, Math.min(ya, Y(M))); ctx.lineTo(rx0 + 8, yb); ctx.stroke(); }
        if (Sd.iso != null){ onRuler(Sd.iso, Sd.iso > M + 1e-12 ? RED : "rgba(30,63,143,.75)", 3); pillar(xs + (xe - xs) * 0.64, Sd.iso, Sd.iso > M + 1e-12, wit && Math.abs(wit.x - Sd.iso) < 1e-12, "point isolé"); }
        if (wit && Sd.iso == null){ var wy = Y(wit.x); ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(tx, wy, 9, 0, 7); ctx.stroke(); }
      }
      var atS = Sd.s !== null && Math.abs(M - Sd.s) < 1e-9;
      var fsz = mob ? 10.5 : 12, mtx = "M = " + F(M, 3), stx = atS ? "M = sup A ✓" : isMaj ? "majorant ✓" : "percé ✗";
      ctx.save(); ctx.font = ma1Font(fsz, 800); var sw = ctx.measureText(stx).width + 12; ctx.restore();
      ctx.fillStyle = ma1Shade(okc, -0.12); ma1RR(ctx, pr - 3 - sw, yM2 - ph2 + 1.5, sw, ph2 - 3, 4); ctx.fill();
      ma1Text(ctx, stx, pr - 9, yM2 - ph2 / 2, {size:fsz, color:"#fff", weight:800, align:"right"});
      /* curseur M sur la règle */
      var ty0 = yM2 - ph2 / 2, tl = rx0 - 3, tr = rx0 + rw + 4;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 1; ctx.fillStyle = okc; ctx.beginPath(); ctx.moveTo(tl + 3, ty0 - 9); ctx.lineTo(tr, ty0 - 9); ctx.lineTo(tr + 8, ty0); ctx.lineTo(tr, ty0 + 9); ctx.lineTo(tl + 3, ty0 + 9); ctx.quadraticCurveTo(tl, ty0 + 9, tl, ty0 + 6); ctx.lineTo(tl, ty0 - 6); ctx.quadraticCurveTo(tl, ty0 - 9, tl + 3, ty0 - 9); ctx.closePath(); ctx.fill(); ctx.restore();
      ma1Text(ctx, mtx, (tl + tr) / 2 + 1, ty0, {size:mob ? 10 : 11, color:"#fff", weight:800, maxW:tr - tl - 4});
      if (!isMaj && cand && Sd.kind === "seq" && cand.n <= showN){ var cxp = xs + cand.n * dxp, cyp = Math.max(yTop - 8, Y(cand.x)); ctx.strokeStyle = RED; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cxp, cyp, 10, 0, 7); ctx.stroke(); }
      /* légende du témoin, posée au sol */
      var wp = wit ? spPair(wit.x, M - eps) : null;
      var wtxt = wit ? (wit.n ? "témoin : u" + spSub(wit.n) + " = " + wp[0] : "témoin : x = " + wp[0]) + " > M − ε = " + wp[1] : (Sd.s === null ? "A n'est pas majorée : aucun plafond ne tient" : isMaj ? "bande vide : M n'est pas le plus petit majorant" : (cand.n ? "u" + spSub(cand.n) + " = " + F(cand.x, 3) : "x = " + F(cand.x, 3)) + " > M : le plafond est percé");
      if (wtxt) ma1Text(ctx, wtxt, W / 2, H - 14, {size:mob ? 10.5 : 12, color:wit ? "#7a4a00" : RED, weight:800, maxW:W - 16});
      ma1Text(ctx, Sd.nom, W / 2, 13, {size:mob ? 12 : 13.5, color:"#ffffff", weight:800, math:true, maxW:W - 20});
      if (Sd.kind === "seq") ma1Text(ctx, "n :", xs + dxp * 0.5 - 6, yFl + 12, {size:mob ? 9.5 : 10.5, color:"#2b3440", weight:800, align:"right"});
      /* lectures */
      ro.set(0, F(M, 4)); ro.set(1, isMaj ? "oui" : "non"); ro.set(2, Sd.sTxt);
      ro.set(3, Sd.max !== null ? F(Sd.max, 2) + (Sd.maxN ? " (n = " + Sd.maxN + ")" : "") : "n'existe pas");
      ro.set(4, Sd.s === null ? "—" : wit ? (wit.n ? "u" + spSub(wit.n) + " = " + wp[0] : "x = " + wp[0]) : isMaj ? "aucun" : "—");
      var msg;
      if (Sd.s === null) msg = "<b>A n'est pas majorée</b> : quel que soit M, l'entier n = ⌊M⌋ + 1 est dans A et dépasse M. Pas de majorant, donc pas de supremum.";
      else if (!isMaj) msg = "<b>M = " + F(M, 3) + " n'est pas un majorant</b> : " + (cand.n ? "u" + spSub(cand.n) + " = " + F(cand.x, 3) : "x = " + F(cand.x, 3)) + " dépasse le plafond. Lâche-le : il remonte au plus bas possible, sup A.";
      else if (atS) msg = "<b>M = sup A</b> : c'est un majorant, et la bande ]M − ε ; M] contient un élément de A pour tout ε > 0 (ici ε = " + F(eps, 3) + "). " + (Sd.max !== null ? "Le supremum appartient à A : c'est le maximum." : "Le supremum n'appartient pas à A : A n'a pas de maximum.");
      else if (!wit) msg = "<b>M est un majorant, mais pas le plus petit</b> : avec ε = " + F(eps, 3) + ", la bande ]M − ε ; M] ne contient aucun élément de A. Descends le plafond.";
      else msg = "<b>M est un majorant</b>, et la bande contient un élément pour ce ε ; mais pour ε < M − sup A = " + spSmall(M - Sd.s) + ", elle serait vide : M n'est pas le supremum.";
      nt.set(msg, isMaj ? "ok" : "warn");
    });
    lp.play();
  }
});
})();
