/* Chimie BA1 · lot P2-CA (novembre 2026) — simulations SFA originales, dessinées à la main sur canevas 2D.
   ch-spectres-continu-raies · ch-ionisations-successives · ch-puits-liaison · ch-hybridation-3d */
(function(){
var PI = Math.PI;
/* ---------- constantes (CODATA 2018) ---------- */
var HC_EVNM = 1239.84198;          /* h·c en eV·nm */
var RY_EV = 13.6;                  /* énergie d'ionisation de H (eV), modèle de Bohr, valeur du cours */
var EV_KJMOL = 96.4853;            /* 1 eV par atome = 96,485 kJ/mol */
var WIEN = 2.897771955e6;          /* constante de Wien en nm·K */
var C2 = 1.438776877e7;            /* h·c/k en nm·K */

/* ---------- aides de dessin (préfixe p2a) ---------- */
function p2shade(hex, f){
  var n = parseInt(String(hex).replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function q(v){ v = f < 0 ? v * (1 + f) : v + (255 - v) * f; return Math.max(0, Math.min(255, Math.round(v))); }
  return "rgb(" + q(r) + "," + q(g) + "," + q(b) + ")";
}
function p2rgba(hex, a){ var n = parseInt(String(hex).replace("#", ""), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function p2ball(ctx, x, y, r, hex, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r * 1.05);
  g.addColorStop(0, p2shade(hex, 0.78)); g.addColorStop(0.45, hex); g.addColorStop(1, p2shade(hex, -0.5));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.5), 0, 7); ctx.fill(); ctx.restore();
}
function p2rr(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function p2glow(ctx, x, y, r, col, a){
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col.replace("A", a)); g.addColorStop(1, col.replace("A", 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function p2fmt(x, d){
  if (!isFinite(x)) return "—";
  var s = Number(x).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return s.replace("-", "−").replace(".", ",");
}
/* entier avec espace fine des milliers : 141 362 */
function p2int(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function p2font(w, s){ return w + " " + Math.round(s) + "px Mulish, system-ui, sans-serif"; }
function p2text(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = p2font(o.w || 700, o.size || 12); ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.halo){ ctx.lineJoin = "round"; ctx.lineWidth = 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.fillText(s, x, y); ctx.restore();
}
/* pastille de texte (fond arrondi) */
function p2tag(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); ctx.font = p2font(o.w || 800, o.size || 11.5);
  var w = ctx.measureText(s).width + 12, h = (o.size || 11.5) + 9, al = o.align || "center";
  var x0 = al === "left" ? x : al === "right" ? x - w : x - w / 2;
  p2rr(ctx, x0, y - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "rgba(255,255,255,.92)"; ctx.fill();
  if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.fillStyle = o.color || "#0f1b2d"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x0 + w / 2, y + 0.5);
  ctx.restore(); return w;
}
function p2arrow(ctx, x1, y1, x2, y2, col, w){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
  var a = Math.atan2(dy, dx), h = Math.min(7 + w * 1.6, L * 0.6);
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
  ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill(); ctx.restore();
}
/* canevas dont la hauteur suit la largeur (plus haut sur téléphone) */
function p2canvas(k, rDesk, rPhone){
  var c = k.canvas(0, {ratio:rDesk}), r0 = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w < 480 ? rPhone : rDesk; r0(); };
  c.resize(); return c;
}

/* ---------- couleur d'une longueur d'onde (approximation par morceaux) ---------- */
function wlRGB(l){
  var r = 0, g = 0, b = 0, f;
  if (l < 440){ r = -(l - 440) / 60; b = 1; }
  else if (l < 490){ g = (l - 440) / 50; b = 1; }
  else if (l < 510){ g = 1; b = -(l - 510) / 20; }
  else if (l < 580){ r = (l - 510) / 70; g = 1; }
  else if (l < 645){ r = 1; g = -(l - 645) / 65; }
  else { r = 1; }
  if (l < 420) f = 0.3 + 0.7 * (l - 380) / 40; else if (l > 700) f = 0.3 + 0.7 * (780 - l) / 80; else f = 1;
  f = Math.max(0, Math.min(1, f));
  function q(v){ return Math.round(255 * Math.pow(Math.max(0, Math.min(1, v * f)), 0.8)); }
  return [q(r), q(g), q(b)];
}
function wlCol(l, a){ var c = wlRGB(l); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a == null ? 1 : a) + ")"; }

/* =====================================================================
   1. Spectre continu, d'émission et d'absorption (c01)
   ===================================================================== */
/* raies visibles mesurées (nm, dans l'air) et intensité relative ; balmer(n) : formule de Rydberg, pour le texte */
function balmer(n){ return HC_EVNM / (RY_EV * (1 / 4 - 1 / (n * n))); }
var GAS = {
  H:{nom:"hydrogène", sym:"H", tube:"#d77bd6", lines:[[656.3, 1, "Hα 3→2"], [486.1, 0.55, "Hβ 4→2"], [434.0, 0.32, "Hγ 5→2"], [410.2, 0.2, "Hδ 6→2"]]},
  He:{nom:"hélium", sym:"He", tube:"#ffc7a6", lines:[[402.6, 0.2], [447.1, 0.5], [471.3, 0.22], [492.2, 0.25], [501.6, 0.45], [587.6, 1], [667.8, 0.55], [706.5, 0.35]]},
  Ne:{nom:"néon", sym:"Ne", tube:"#ff5a2a", lines:[[540.1, 0.3], [585.2, 0.75], [588.2, 0.4], [594.5, 0.5], [597.6, 0.3], [603.0, 0.3], [607.4, 0.45], [609.6, 0.5], [614.3, 0.65], [616.4, 0.35], [621.7, 0.4], [626.6, 0.45], [630.5, 0.4], [633.4, 0.55], [638.3, 0.6], [640.2, 1], [650.7, 0.6], [653.3, 0.35], [659.9, 0.45], [667.8, 0.35], [671.7, 0.3], [692.9, 0.4], [703.2, 0.55]]},
  Na:{nom:"sodium", sym:"Na", tube:"#ffb52a", lines:[[498.3, 0.08], [568.8, 0.15], [589.0, 1], [589.6, 0.6], [615.4, 0.12]],
    /* en absorption (gaz froid, état fondamental 3s) : seul le doublet D */
    abs:[[589.0, 1], [589.6, 0.6]]}
};
/* raies utilisées : en absorption, celles qui partent de l'état fondamental quand on les connaît */
function gasLines(g, m){ var G = GAS[g]; return m === "abs" && G.abs ? G.abs : G.lines; }
var LMIN = 380, LMAX = 750;
function planck(l, T){ return 1 / (Math.pow(l, 5) * (Math.exp(C2 / (l * T)) - 1)); }
/* intensité relative, normalisée sur la lampe à 3500 K (sommet de la plage) */
var PL_REF = (function(){ var m = 0; for (var l = LMIN; l <= LMAX; l += 1) m = Math.max(m, planck(l, 3500)); return m; })();
function lampI(l, T){ return planck(l, T) / PL_REF; }
/* profil d'une raie (gaussienne étroite, largeur d'appareil 0,9 nm) */
function lineProf(l, lines, w){ var s = 0; lines.forEach(function(L){ var d = (l - L[0]) / (w || 0.9); s += L[1] * Math.exp(-d * d); }); return s; }

SFA.sim({
  id:"ch-spectres-continu-raies", ch:"c01", tag:"Spectres",
  titre:"Lampe, tube à gaz et prisme : spectre continu, d'émission et d'absorption",
  resume:"Sur une paillasse sombre, une lampe ou un tube à gaz éclaire un prisme : spectre continu, raies d'émission, puis raies noires quand un gaz absorbe. Et tu tires des photons sur un atome d'hydrogène pour voir lesquels il garde.",
  but:"Choisis la source. La lampe à filament donne un spectre continu (règle sa température) ; un tube à gaz (H, He, Ne, Na) ne donne que quelques raies colorées ; avec la cellule de gaz devant la lampe, des raies noires apparaissent aux mêmes places. Glisse sur l'écran agrandi (en dessous) pour lire λ et l'énergie du photon. Dans le mode « Photon sur H », règle l'énergie du photon (curseur ou glisse sur l'axe des énergies) et regarde s'il est absorbé.",
  aRetenir:"Un solide chaud émet un spectre continu ; son maximum se déplace vers le bleu quand T monte (loi de Wien : λmax = 2,898·10⁶ nm·K / T). Un gaz excité n'émet que des raies : chaque raie correspond à un saut entre deux niveaux, E = hν = hc/λ = Eₙ − Eₘ. Le même gaz, éclairé par une source continue, absorbe exactement ces longueurs d'onde (raies noires) : c'est son empreinte. Pour l'hydrogène, Eₙ = −13,6 eV/n² ; un photon n'est absorbé que si son énergie vaut une différence de niveaux, ou dépasse l'énergie d'ionisation.",
  piege:"Un photon de 11 eV n'est pas « absorbé en partie » par un atome H dans l'état n = 1 : c'est tout ou rien (10,2 eV pour 1 → 2, 12,09 eV pour 1 → 3). Au-delà de 13,6 eV, en revanche, toute énergie convient : l'électron part avec l'excédent en énergie cinétique. Autre piège : l'hydrogène vraiment froid (n = 1) absorbe dans l'UV (série de Lyman), pas dans le visible ; les raies noires de Balmer se voient dans les étoiles, où une partie des atomes est déjà sur n = 2. Le sodium, lui, absorbe ses raies jaunes même froid.",
  build:function(k, S){
    var c = p2canvas(k, 0.78, 0.86), g = k.canvas(176);
    var st = {t:0, ph:[], shots:[], hov:null, gx:null, fire:0, atom:{n:1, state:"rest", tt:0, to:1, e:null}, pk:[]};
    var mS = k.seg("Source", [["lampe", "Lampe à filament"], ["emi", "Tube à gaz"], ["abs", "Lampe + gaz"], ["photon", "Photon sur H"]], "emi", function(){ st.ph = []; st.pk = []; st.fire = 2; });
    var gS = k.seg("Gaz", [["H", "H"], ["He", "He"], ["Ne", "Ne"], ["Na", "Na"]], "H", function(){ st.ph = []; });
    var tS = k.slider("Température du filament", 1500, 3500, 50, 2800, "K");
    var eS = k.slider("Énergie du photon", 1, 15, 0.01, 10.2, "eV");
    var nS = k.seg("Niveau de départ de l'atome H", [["1", "n = 1 (fondamental)"], ["2", "n = 2 (excité)"]], "1", function(){ st.shots = []; resetAtom(); });
    var aT = k.toggle("Tir automatique", true);
    k.button("Tirer un photon", function(){ fire(); }, true);
    var bClr = k.button("Effacer les tirs", function(){ st.shots = []; });
    var ro = k.readouts(["Source", "Longueur d'onde λ", "Énergie du photon", "Ce qu'on voit"]);
    var nt = k.note("", "ok");
    function box(o){ return (o.el || o).closest ? (o.el || o).closest(".ctl") : null; }
    /* les seg et toggle n'exposent pas leur élément : on les retrouve dans l'ordre du panneau */
    var ctls = Array.prototype.slice.call(k.ctrl.querySelectorAll(".ctl")), gBox = ctls[1], nBox = ctls[4], aBox = ctls[5];
    var lp = k.loop(function(dt){ st.t += dt; step(dt); k.redraw(); });
    lp.play();
    /* ---------- souris : lire λ sur l'écran agrandi, ou régler l'énergie du photon ---------- */
    g.pointer(function(type, p){
      if (type === "up"){ st.gx = null; return; }
      if (type === "down" || type === "drag" || type === "move"){
        st.gx = p.x;
        if (mS.value === "photon" && (type === "down" || type === "drag")){
          var E = EAX.inv(p.x); eS.set(Math.round(Math.max(1, Math.min(15, E)) * 100) / 100);
        }
      }
    });
    g.cv.addEventListener("pointerleave", function(){ st.gx = null; });
    var EAX = {x0:28, x1:0, inv:function(x){ return 1 + (x - EAX.x0) / (EAX.x1 - EAX.x0) * 14; }, X:function(E){ return EAX.x0 + (E - 1) / 14 * (EAX.x1 - EAX.x0); }};
    /* ---------- photons du mode spectre : tirés selon le spectre de la source ---------- */
    function pickLambda(){
      var m = mS.value, T = tS.value, L, i;
      if (m === "emi"){
        L = GAS[gS.value].lines; var tot = 0; L.forEach(function(x){ tot += x[1]; });
        var u = Math.random() * tot; for (i = 0; i < L.length; i++){ u -= L[i][1]; if (u <= 0) return L[i][0]; } return L[0][0];
      }
      for (i = 0; i < 40; i++){ var l = LMIN + Math.random() * (LMAX - LMIN); if (Math.random() * 1.05 < lampI(l, T) / Math.max(1e-6, lampI(LMAX, T))) return l; }
      return LMIN + Math.random() * (LMAX - LMIN);
    }
    function absorbed(l){ return lineProf(l, gasLines(gS.value, "abs"), 1.4) > 0.25; }
    /* ---------- atome H du mode photon ---------- */
    function En(n){ return -RY_EV / (n * n); }
    function resetAtom(){ st.atom = {n:+nS.value, state:"rest", tt:0, to:+nS.value, e:null}; }
    function outcome(E, n0){
      var Eion = RY_EV / (n0 * n0);
      if (E >= Eion) return {kind:"ion", Ec:E - Eion, Eion:Eion};
      var best = null;
      for (var n = n0 + 1; n <= 40; n++){ var d = En(n) - En(n0), diff = E - d; if (!best || Math.abs(diff) < Math.abs(best.diff)) best = {n:n, d:d, diff:diff}; }
      if (Math.abs(best.diff) <= 0.03) return {kind:"abs", n:best.n, d:best.d, diff:best.diff};
      return {kind:"pass", n:best.n, d:best.d, diff:best.diff};
    }
    function fire(){
      if (mS.value !== "photon") return;
      st.pk.push({x:0, E:eS.value, done:false, res:outcome(eS.value, +nS.value), dirY:0, out:false});
    }
    function step(dt){
      var m = mS.value, i;
      if (m === "photon"){
        st.fire += dt;
        if (aT.value && st.fire > 2.4 && st.atom.state === "rest" && st.pk.length === 0){ st.fire = 0; fire(); }
        var A = st.atom;
        for (i = st.pk.length - 1; i >= 0; i--){
          var q = st.pk[i];
          q.x += dt * 0.42;
          if (!q.done && q.x >= 0.5){
            q.done = true;
            st.shots.push({E:q.E, kind:q.res.kind}); if (st.shots.length > 40) st.shots.shift();
            if (q.res.kind === "abs"){ A.state = "up"; A.to = q.res.n; A.tt = 0; st.pk.splice(i, 1); continue; }
            if (q.res.kind === "ion"){ A.state = "ion"; A.tt = 0; A.Ec = q.res.Ec; st.pk.splice(i, 1); continue; }
          }
          if (q.x > 1.25) st.pk.splice(i, 1);
        }
        if (A.state !== "rest"){
          A.tt += dt;
          if (A.state === "up" && A.tt > 1.6){ A.state = "down"; A.tt = 0; A.ang = Math.random() * 2 * PI; }
          else if (A.state === "down" && A.tt > 1.4){ resetAtom(); }
          else if (A.state === "ion" && A.tt > 2.2){ resetAtom(); }
        }
        return;
      }
      /* flux de photons le long du faisceau (0 → 1 : source → prisme, 1 → 2 : prisme → écran) */
      var rate = m === "lampe" || m === "abs" ? 26 * Math.min(1.4, 0.25 + lampI(600, tS.value) * 1.2) : 22;
      st.acc = (st.acc || 0) + dt * rate;
      while (st.acc > 1){ st.acc -= 1; st.ph.push({s:0, l:pickLambda(), dy:(Math.random() - 0.5), kill:false}); }
      for (i = st.ph.length - 1; i >= 0; i--){
        var p = st.ph[i]; p.s += dt * 0.55;
        if (m === "abs" && !p.kill && p.s > 0.42 && p.s < 0.5 && absorbed(p.l)){ p.kill = true; p.re = Math.random() * 2 * PI; p.s0 = p.s; }
        if (p.kill && p.s - p.s0 > 0.35) st.ph.splice(i, 1);
        else if (p.s > 2) st.ph.splice(i, 1);
      }
      if (st.ph.length > 260) st.ph.splice(0, st.ph.length - 260);
    }
    /* ---------- décor : salle sombre et paillasse ---------- */
    function room(ctx, W, H){
      var bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0b1220"); bg.addColorStop(0.62, "#172338"); bg.addColorStop(1, "#0a0f18");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* carrelage du mur, très discret */
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.035)"; ctx.lineWidth = 1;
      for (var x = 0; x < W; x += 46){ ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H * 0.62); ctx.stroke(); }
      for (var y = 0; y < H * 0.62; y += 46){ ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
      ctx.restore();
      /* plan de travail (résine noire) en perspective */
      var y0 = H * 0.7, y1 = H * 0.84;
      var top = ctx.createLinearGradient(0, y0, 0, y1); top.addColorStop(0, "#1f2a3a"); top.addColorStop(1, "#2c3a4f");
      ctx.fillStyle = top; ctx.beginPath(); ctx.moveTo(-10, y1); ctx.lineTo(W + 10, y1); ctx.lineTo(W * 0.96, y0); ctx.lineTo(W * 0.04, y0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.fillRect(0, y1, W, 2);
      var fr = ctx.createLinearGradient(0, y1, 0, H); fr.addColorStop(0, "#121a27"); fr.addColorStop(1, "#070b12");
      ctx.fillStyle = fr; ctx.fillRect(0, y1 + 2, W, H - y1);
      return {y0:y0, y1:y1, yb:(y0 + y1) / 2};
    }
    function shadow(ctx, x, y, rx, ry, a){ ctx.save(); ctx.fillStyle = "rgba(0,0,0," + (a || 0.45) + ")"; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore(); }
    function lampColor(T){ var f = (T - 1500) / 2000; return [255, Math.round(120 + 120 * f), Math.round(40 + 170 * f)]; }
    function drawLamp(ctx, x, yBeam, ySurf, s, T){
      var lc = lampColor(T), cs = "rgba(" + lc.join(",") + ",A)", bright = Math.min(1, 0.25 + lampI(600, T) * 1.2);
      shadow(ctx, x, ySurf, 26 * s, 6 * s);
      /* pied et douille */
      ctx.fillStyle = "#3a4558"; ctx.fillRect(x - 4 * s, yBeam + 18 * s, 8 * s, ySurf - yBeam - 20 * s);
      var bs = ctx.createLinearGradient(x - 22 * s, 0, x + 22 * s, 0); bs.addColorStop(0, "#2a3344"); bs.addColorStop(0.45, "#5d6b82"); bs.addColorStop(1, "#1c2330");
      ctx.fillStyle = bs; p2rr(ctx, x - 22 * s, ySurf - 9 * s, 44 * s, 9 * s, 3 * s); ctx.fill();
      ctx.fillStyle = "#8b93a1"; ctx.fillRect(x - 9 * s, yBeam + 14 * s, 18 * s, 10 * s);
      /* halo, ampoule, filament */
      ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, x, yBeam, 70 * s, cs, 0.35 * bright); ctx.restore();
      var bulb = ctx.createRadialGradient(x - 6 * s, yBeam - 6 * s, 2 * s, x, yBeam, 22 * s);
      bulb.addColorStop(0, "rgba(255,255,255," + (0.55 + 0.4 * bright) + ")"); bulb.addColorStop(0.5, "rgba(" + lc.join(",") + "," + (0.35 + 0.4 * bright) + ")"); bulb.addColorStop(1, "rgba(200,210,230,.18)");
      ctx.fillStyle = bulb; ctx.beginPath(); ctx.arc(x, yBeam, 20 * s, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(220,230,245,.5)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.strokeStyle = "rgba(255," + (180 + Math.round(70 * bright)) + "," + Math.round(120 * bright + 60) + ",1)"; ctx.lineWidth = 1.6; ctx.beginPath();
      for (var i = 0; i <= 8; i++){ var xx = x - 8 * s + i * 2 * s, yy = yBeam + (i % 2 ? -3 : 3) * s; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.ellipse(x - 8 * s, yBeam - 9 * s, 3 * s, 6 * s, 0.5, 0, 7); ctx.fill();
    }
    function drawTube(ctx, x, yBeam, ySurf, s, gas){
      var col = GAS[gas].tube, fl = 0.82 + 0.18 * Math.sin(st.t * 37) * Math.sin(st.t * 23);
      shadow(ctx, x, ySurf, 30 * s, 6 * s);
      /* alimentation haute tension */
      var bx = x - 30 * s, by = ySurf - 26 * s;
      var gb = ctx.createLinearGradient(0, by, 0, by + 26 * s); gb.addColorStop(0, "#3c475b"); gb.addColorStop(1, "#1d2431");
      ctx.fillStyle = gb; p2rr(ctx, bx, by, 60 * s, 26 * s, 4 * s); ctx.fill();
      ctx.fillStyle = "#0e1a12"; p2rr(ctx, bx + 6 * s, by + 6 * s, 30 * s, 13 * s, 2); ctx.fill();
      p2text(ctx, "5 kV", bx + 21 * s, by + 12.5 * s, {size:9 * s, color:"#7dff9d", w:800});
      p2ball(ctx, bx + 48 * s, by + 13 * s, 6 * s, "#9aa3b2");
      /* tube vertical */
      var t0 = yBeam - 46 * s, t1 = by - 4 * s;
      ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, x, yBeam, 62 * s, "rgba(" + hexRGB(col) + ",A)", 0.38 * fl); ctx.restore();
      var gl = ctx.createLinearGradient(x - 8 * s, 0, x + 8 * s, 0);
      gl.addColorStop(0, p2rgba(col, 0.5)); gl.addColorStop(0.45, "rgba(255,255,255," + 0.85 * fl + ")"); gl.addColorStop(0.6, p2rgba(col, 0.95)); gl.addColorStop(1, p2rgba(col, 0.45));
      ctx.fillStyle = gl; p2rr(ctx, x - 6 * s, t0, 12 * s, t1 - t0, 6 * s); ctx.fill();
      ctx.strokeStyle = "rgba(230,240,255,.45)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#b9c1cc"; ctx.fillRect(x - 7 * s, t0 - 6 * s, 14 * s, 7 * s); ctx.fillRect(x - 7 * s, t1 - 2 * s, 14 * s, 6 * s);
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 7 * s, t0 - 3 * s); ctx.bezierCurveTo(x + 26 * s, t0, x + 30 * s, by - 10 * s, bx + 52 * s, by); ctx.stroke();
      p2text(ctx, GAS[gas].sym, x, t0 - 14 * s, {size:12 * s, color:"#fff", w:800});
    }
    function hexRGB(h){ var n = parseInt(h.slice(1), 16); return (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255); }
    function drawCell(ctx, x, yBeam, ySurf, s, gas){
      shadow(ctx, x, ySurf, 22 * s, 5 * s);
      ctx.fillStyle = "#3a4558"; ctx.fillRect(x - 3 * s, yBeam + 20 * s, 6 * s, ySurf - yBeam - 20 * s);
      ctx.fillStyle = "#596579"; p2rr(ctx, x - 14 * s, ySurf - 6 * s, 28 * s, 6 * s, 2); ctx.fill();
      /* cylindre couché vu de biais */
      var L = 26 * s, R = 18 * s;
      var gb = ctx.createLinearGradient(0, yBeam - R, 0, yBeam + R);
      gb.addColorStop(0, "rgba(200,215,235,.35)"); gb.addColorStop(0.3, "rgba(255,255,255,.18)"); gb.addColorStop(0.5, p2rgba(GAS[gas].tube, 0.16)); gb.addColorStop(1, "rgba(120,140,170,.35)");
      ctx.fillStyle = gb; ctx.beginPath(); ctx.moveTo(x - L, yBeam - R); ctx.lineTo(x + L, yBeam - R); ctx.ellipse(x + L, yBeam, 7 * s, R, 0, -PI / 2, PI / 2); ctx.lineTo(x - L, yBeam + R); ctx.ellipse(x - L, yBeam, 7 * s, R, 0, PI / 2, -PI / 2); ctx.fill();
      ctx.strokeStyle = "rgba(220,232,250,.55)"; ctx.lineWidth = 1.1; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x - L, yBeam, 7 * s, R, 0, 0, 7); ctx.stroke();
      /* atomes du gaz qui s'agitent */
      for (var i = 0; i < 14; i++){
        var ax = x - L + ((i * 37.3 + st.t * (18 + i * 3)) % (2 * L)), ay = yBeam + Math.sin(i * 2.1 + st.t * (1.3 + i * 0.2)) * R * 0.7;
        p2ball(ctx, ax, ay, 2.2 * s, GAS[gas].tube, 0.9);
      }
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(x - L + 3, yBeam - R + 3 * s, 2 * L - 6, 2 * s);
      p2text(ctx, "gaz " + GAS[gas].sym, x, yBeam - R - 10 * s, {size:11 * s, color:"#dfe7f3", w:800});
    }
    /* prisme équilatéral (apex en haut) dessiné en volume */
    function prismGeom(xp, yb, s){
      var side = 76 * s, h = side * Math.sqrt(3) / 2, cy = yb + h * 0.18;
      return {A:[xp, cy - h * 2 / 3], B:[xp - side / 2, cy + h / 3], C:[xp + side / 2, cy + h / 3], d:[9 * s, -7 * s], h:h, side:side};
    }
    function drawPrism(ctx, P, back){
      var A = P.A, B = P.B, C = P.C, d = P.d;
      function pt(p, o){ return [p[0] + (o ? d[0] : 0), p[1] + (o ? d[1] : 0)]; }
      if (back){
        /* face arrière et arêtes de profondeur */
        ctx.fillStyle = "rgba(170,200,235,.10)"; ctx.beginPath(); ctx.moveTo(A[0] + d[0], A[1] + d[1]); ctx.lineTo(B[0] + d[0], B[1] + d[1]); ctx.lineTo(C[0] + d[0], C[1] + d[1]); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(200,220,245,.25)"; ctx.lineWidth = 1; ctx.stroke();
        return;
      }
      var top = ctx.createLinearGradient(A[0], A[1], C[0], C[1]);
      top.addColorStop(0, "rgba(220,235,255,.30)"); top.addColorStop(1, "rgba(150,180,220,.12)");
      ctx.fillStyle = top; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(A[0] + d[0], A[1] + d[1]); ctx.lineTo(C[0] + d[0], C[1] + d[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.fill();
      var fg = ctx.createLinearGradient(B[0], A[1], C[0], C[1]);
      fg.addColorStop(0, "rgba(190,215,245,.22)"); fg.addColorStop(0.5, "rgba(255,255,255,.10)"); fg.addColorStop(1, "rgba(150,185,230,.26)");
      ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(225,238,255,.75)"; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(A[0] + d[0], A[1] + d[1]); ctx.moveTo(C[0], C[1]); ctx.lineTo(C[0] + d[0], C[1] + d[1]); ctx.stroke();
      /* reflet */
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(A[0] - 4, A[1] + 12); ctx.lineTo(A[0] - 4 - (A[0] - B[0]) * 0.35, A[1] + 12 + (B[1] - A[1]) * 0.35); ctx.stroke();
    }
    function lerp2(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    /* ---------- dessin du mode spectre ---------- */
    function drawBench(ctx, W, H){
      var R = room(ctx, W, H), s = W < 480 ? W / 400 : Math.min(W / 430, H / 300), m = mS.value, gas = gS.value, T = tS.value;
      var yb = H * 0.43, ySurf = R.yb;
      var xs = W * 0.1, xc = W * 0.27, xsl = W * 0.385, xp = W * 0.53, xsc = W * 0.88;
      var P = prismGeom(xp, yb, s), ent = lerp2(P.A, P.B, 0.55), ex = lerp2(P.A, P.C, 0.55);
      /* écran : y(λ) sur l'écran (rouge en haut, violet en bas : le violet est le plus dévié) */
      var sy0 = H * 0.11, sy1 = H * 0.64;
      function ys(l){ return sy0 + 12 + (LMAX - l) / (LMAX - LMIN) * (sy1 - sy0 - 24); }
      /* fente */
      shadow(ctx, xsl, ySurf, 14 * s, 4 * s);
      ctx.fillStyle = "#2b3546"; ctx.fillRect(xsl - 2 * s, yb + 22 * s, 4 * s, ySurf - yb - 22 * s);
      var sg = ctx.createLinearGradient(xsl - 5 * s, 0, xsl + 5 * s, 0); sg.addColorStop(0, "#1a212d"); sg.addColorStop(0.5, "#4a566b"); sg.addColorStop(1, "#141a24");
      ctx.fillStyle = sg; ctx.fillRect(xsl - 4 * s, yb - 30 * s, 8 * s, 26 * s); ctx.fillRect(xsl - 4 * s, yb + 4 * s, 8 * s, 26 * s);
      /* support du prisme */
      shadow(ctx, xp, ySurf, 40 * s, 7 * s);
      ctx.fillStyle = "#2b3546"; ctx.fillRect(xp - 3 * s, P.B[1], 6 * s, ySurf - P.B[1] - 4 * s);
      ctx.fillStyle = "#4b576c"; p2rr(ctx, xp - 26 * s, ySurf - 7 * s, 52 * s, 7 * s, 3); ctx.fill();
      drawPrism(ctx, P, true);
      /* écran */
      shadow(ctx, xsc, ySurf, 30 * s, 6 * s);
      ctx.fillStyle = "#2b3546"; ctx.fillRect(xsc - 3 * s, sy1, 6 * s, ySurf - sy1);
      var scg = ctx.createLinearGradient(xsc - 14 * s, 0, xsc + 14 * s, 0); scg.addColorStop(0, "#cfd6df"); scg.addColorStop(0.5, "#f1f4f8"); scg.addColorStop(1, "#b9c2ce");
      ctx.fillStyle = "#1b2230"; ctx.beginPath(); ctx.moveTo(xsc - 10 * s, sy0 - 6 * s); ctx.lineTo(xsc + 14 * s, sy0 - 14 * s); ctx.lineTo(xsc + 14 * s, sy1 - 6 * s); ctx.lineTo(xsc - 10 * s, sy1 + 4 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = scg; ctx.beginPath(); ctx.moveTo(xsc - 12 * s, sy0); ctx.lineTo(xsc + 12 * s, sy0 - 8 * s); ctx.lineTo(xsc + 12 * s, sy1 - 8 * s); ctx.lineTo(xsc - 12 * s, sy1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(10,14,22,.82)"; ctx.beginPath(); ctx.moveTo(xsc - 10 * s, sy0 + 3); ctx.lineTo(xsc + 10 * s, sy0 - 5 * s); ctx.lineTo(xsc + 10 * s, sy1 - 10 * s); ctx.lineTo(xsc - 10 * s, sy1 - 3); ctx.closePath(); ctx.fill();
      /* le spectre sur l'écran */
      var lines = gasLines(gas, m), ln;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      if (m === "emi"){
        lines.forEach(function(L){ var y = ys(L[0]); ctx.fillStyle = wlCol(L[0], 0.35 + 0.65 * L[1]); ctx.fillRect(xsc - 10 * s, y - 1.4, 20 * s, 2.8); p2glow(ctx, xsc, y, 9 * s, wlCol(L[0], "A").replace(/,A\)$/, ",A)"), 0.25 * L[1]); });
      } else {
        for (ln = LMIN; ln <= LMAX; ln += 2){
          var I = Math.min(1, lampI(ln, T) * 1.25), a = I;
          if (m === "abs") a *= Math.max(0, 1 - lineProf(ln, lines, 1.4) * 1.6);
          ctx.fillStyle = wlCol(ln, a); ctx.fillRect(xsc - 10 * s, ys(ln) - 1.6, 20 * s, 3.2);
        }
      }
      ctx.restore();
      /* faisceau source → prisme */
      var xsrc = m === "emi" ? xs + 8 * s : xs + 20 * s;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      var bc = m === "emi" ? "rgba(" + hexRGB(GAS[gas].tube) + ",A)" : "rgba(255,240,215,A)", bi = m === "emi" ? 0.32 : 0.12 + 0.3 * Math.min(1, lampI(600, T) * 1.2);
      ctx.strokeStyle = bc.replace("A", bi); ctx.lineWidth = 7 * s; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(xsrc, yb); ctx.lineTo(ent[0], ent[1]); ctx.stroke();
      ctx.strokeStyle = bc.replace("A", bi * 0.8); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ent[0], ent[1]); ctx.lineTo(ex[0], ex[1]); ctx.stroke();
      /* éventail coloré prisme → écran */
      var fan = m === "emi" ? lines.map(function(L){ return [L[0], 0.25 + 0.5 * L[1]]; }) : null;
      if (!fan){ fan = []; for (ln = LMIN; ln <= LMAX; ln += 6){ var aa = Math.min(1, lampI(ln, T) * 1.25) * 0.22; if (m === "abs") aa *= Math.max(0, 1 - lineProf(ln, lines, 1.4) * 1.6); fan.push([ln, aa]); } }
      fan.forEach(function(f){ ctx.strokeStyle = wlCol(f[0], f[1]); ctx.lineWidth = m === "emi" ? 2 : 3; ctx.beginPath(); ctx.moveTo(ex[0], ex[1]); ctx.lineTo(xsc - 10 * s, ys(f[0])); ctx.stroke(); });
      /* photons en mouvement */
      st.ph.forEach(function(p){
        var x, y, a = 1;
        if (p.s < 1){
          x = xsrc + (ent[0] - xsrc) * p.s; y = yb + p.dy * 5 * s;
          if (p.kill){ var u = (p.s - p.s0) * 3; x = xc + Math.cos(p.re) * u * 40 * s; y = yb + Math.sin(p.re) * u * 40 * s; a = Math.max(0, 1 - u); }
        } else { var v = Math.min(1, p.s - 1), e2 = [xsc - 10 * s, ys(p.l)]; x = ex[0] + (e2[0] - ex[0]) * v; y = ex[1] + (e2[1] - ex[1]) * v; }
        var col = p.s < 1 && !p.kill ? (m === "emi" ? wlCol(p.l, 0.9 * a) : "rgba(255,248,230," + 0.85 * a + ")") : wlCol(p.l, a);
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 1.9 * s, 0, 7); ctx.fill();
      });
      ctx.restore();
      drawPrism(ctx, P, false);
      /* source(s) */
      if (m === "emi") drawTube(ctx, xs, yb, ySurf, s, gas); else drawLamp(ctx, xs, yb, ySurf, s, T);
      if (m === "abs") drawCell(ctx, xc, yb, ySurf, s, gas);
      /* étiquettes */
      var fs = W < 480 ? 10 : 11.5;
      p2text(ctx, m === "emi" ? "tube à décharge (" + GAS[gas].nom + ")" : "lampe à filament · " + p2int(T) + " K", 8, R.y1 + 14, {size:fs, color:"#c9d4e3", w:700, align:"left"});
      p2text(ctx, "fente", xsl, yb - 38 * s, {size:fs, color:"#9fb0c6"});
      p2text(ctx, "prisme", xp, P.B[1] + 14 * s, {size:fs, color:"#9fb0c6"});
      p2text(ctx, "écran", xsc, sy0 - 20 * s, {size:fs, color:"#9fb0c6"});
      p2text(ctx, "rouge", xsc - 16 * s, ys(700), {size:9.5, color:"#ff8f7a", align:"right"});
      p2text(ctx, "violet", xsc - 16 * s, ys(410), {size:9.5, color:"#b89cff", align:"right"});
      var title = m === "lampe" ? "Spectre continu" : m === "emi" ? "Spectre d'émission (raies)" : "Spectre d'absorption (raies noires)";
      p2tag(ctx, title, 10, 16, {align:"left", bg:"rgba(255,255,255,.12)", color:"#fff", size:W < 480 ? 11 : 12.5});
      return {ys:ys};
    }
    /* ---------- dessin du mode photon ---------- */
    function rN(n, R1, Rm){ return R1 + (Rm - R1) * (n - 1) / 5; }
    function drawPhoton(ctx, W, H){
      var bg = ctx.createRadialGradient(W * 0.46, H * 0.45, 10, W * 0.46, H * 0.5, W * 0.75);
      bg.addColorStop(0, "#1b2840"); bg.addColorStop(1, "#070b14"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* étoiles de fond (chambre à vide) */
      ctx.fillStyle = "rgba(255,255,255,.25)";
      for (var i = 0; i < 40; i++){ ctx.fillRect((i * 97.13) % W, (i * 53.71) % H, 1.2, 1.2); }
      var ph = W < 480, yb = H * (ph ? 0.64 : 0.6), xa = W * 0.5, xg = W * 0.07, xd = W * 0.96;
      var Rm = Math.min(W * (ph ? 0.33 : 0.29), H * 0.6), R1 = Rm * 0.15, A = st.atom, n0 = +nS.value, TL = -0.18;
      /* canon à photons */
      var gx = Math.max(4, xg - 22), gw = Math.max(62, W * 0.13);
      ctx.fillStyle = "#2b3546"; ctx.fillRect(gx + gw / 2 - 4, yb + 18, 8, H - yb - 18); shadow(ctx, gx + gw / 2, H - 6, 30, 5);
      var gg = ctx.createLinearGradient(0, yb - 18, 0, yb + 18); gg.addColorStop(0, "#5d6b82"); gg.addColorStop(0.5, "#2c3646"); gg.addColorStop(1, "#151b26");
      ctx.fillStyle = gg; p2rr(ctx, gx, yb - 18, gw, 36, 7); ctx.fill();
      ctx.fillStyle = "#0e1a12"; p2rr(ctx, gx + 6, yb - 11, gw - 20, 14, 3); ctx.fill();
      p2text(ctx, p2fmt(eS.value, 2) + " eV", gx + 6 + (gw - 20) / 2, yb - 4, {size:9.5, color:"#7dff9d", w:800});
      ctx.fillStyle = "#8fa0b8"; p2rr(ctx, gx + gw - 4, yb - 7, 9, 14, 3); ctx.fill();
      p2text(ctx, "source de photons", gx, yb - 28, {size:10, color:"#9fb0c6", align:"left"});
      /* détecteur */
      ctx.fillStyle = "#2b3546"; p2rr(ctx, xd - 6, yb - 26, 14, 52, 4); ctx.fill();
      ctx.fillStyle = "#4a5a72"; ctx.fillRect(xd - 6, yb - 20, 3, 40);
      p2text(ctx, "détecteur", xd + 2, yb + 38, {size:10, color:"#9fb0c6", align:"right"});
      /* orbites (anneaux inclinés) */
      for (var n = 1; n <= 6; n++){
        var r = rN(n, R1, Rm);
        ctx.strokeStyle = n === A.n || (A.state === "up" && n === A.to) ? "rgba(140,190,255,.75)" : "rgba(140,170,220,.22)";
        ctx.lineWidth = n === A.n ? 1.6 : 1; ctx.beginPath(); ctx.ellipse(xa, yb, r, r * 0.42, TL, 0, 7); ctx.stroke();
        if (n > 1) p2text(ctx, (n === 6 ? "n = " : "") + n, xa + r * Math.cos(TL) + 3, yb + r * Math.sin(TL) - 7, {size:10, color:"rgba(170,195,235,.85)", w:800, align:"left"});
      }
      /* noyau */
      ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, xa, yb, 26, "rgba(255,120,90,A)", 0.35); ctx.restore();
      p2ball(ctx, xa, yb, 7, "#e0533b");
      /* électron */
      var en = A.n, ef = 0, ex, ey;
      if (A.state === "up"){ ef = Math.min(1, A.tt / 0.35); en = A.n + (A.to - A.n) * ef; }
      if (A.state === "down"){ ef = Math.min(1, A.tt / 0.35); en = A.to + (A.n - A.to) * ef; }
      var re = rN(en, R1, Rm), ang = st.t * (2.4 / Math.pow(en, 0.8));
      ex = xa + re * Math.cos(ang) * Math.cos(TL) - re * 0.42 * Math.sin(ang) * Math.sin(TL);
      ey = yb + re * Math.cos(ang) * Math.sin(TL) + re * 0.42 * Math.sin(ang) * Math.cos(TL);
      if (A.state === "ion"){ var u = A.tt; ex = xa + 20 + u * W * 0.18 * (0.6 + Math.min(2, A.Ec) * 0.4); ey = yb - 20 - u * H * 0.12; }
      if (A.state !== "ion" || A.tt < 2.1){
        ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, ex, ey, 12, "rgba(90,170,255,A)", 0.5); ctx.restore();
        p2ball(ctx, ex, ey, 4.6, "#3d8bff");
      }
      if (A.state === "ion") p2tag(ctx, "électron libre · Ec = " + p2fmt(A.Ec, 2) + " eV", Math.min(W - 90, xa + 30), yb - Rm * 0.62 - 6, {bg:"rgba(61,139,255,.25)", color:"#cfe2ff", size:10.5});
      /* photons en vol */
      st.pk.forEach(function(q){
        var l = HC_EVNM / q.E, vis = l >= 380 && l <= 750, col = vis ? wlCol(l, 1) : (l < 380 ? "rgba(190,150,255,1)" : "rgba(255,120,100,1)");
        var x = xg + gw - 10 + (xa - (xg + gw - 10)) * (q.x / 0.5);
        if (q.x > 0.5) x = xa + (xd - xa) * ((q.x - 0.5) / 0.75);
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath();
        var wl = Math.max(5, Math.min(22, l / 30));
        for (var j = -28; j <= 0; j++){ var xx = x + j, yy = yb + Math.sin((xx - st.t * 200) / wl * 2 * PI) * 6 * Math.exp(-Math.pow((j + 14) / 10, 2)); j > -28 ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.stroke(); ctx.restore();
        p2text(ctx, vis ? "visible" : l < 380 ? "UV" : "IR", x - 14, yb - 16, {size:9.5, color:col});
      });
      /* photon réémis : direction quelconque */
      if (A.state === "down"){
        var E2 = En(A.to) - En(A.n), l2 = HC_EVNM / E2, d = A.tt * W * 0.35, cx = xa + Math.cos(A.ang) * d, cy = yb + Math.sin(A.ang) * d * 0.7;
        var col2 = l2 >= 380 && l2 <= 750 ? wlCol(l2, 1) : "rgba(190,150,255,1)";
        ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, cx, cy, 14, col2.replace(/,1\)$/, ",A)"), 0.9); ctx.restore();
        p2text(ctx, "réémis : " + p2fmt(E2, 2) + " eV", cx, cy - 14, {size:10, color:"#e8eefb"});
      }
      /* diagramme des niveaux (en haut à droite) */
      var dx0 = W * (ph ? 0.58 : 0.72), dx1 = W - 12, dy0 = 30, dy1 = ph ? H * 0.32 : H * 0.36;
      S.draw.panel(c, dx0 - 8, dy0 - 22, dx1 - dx0 + 16, dy1 - dy0 + 34, {fill:"rgba(10,16,28,.72)", stroke:"rgba(255,255,255,.12)", shadow:false});
      p2text(ctx, "niveaux Eₙ = −13,6 eV/n²", (dx0 + dx1) / 2, dy0 - 11, {size:9.5, color:"#b8c6da"});
      function yE(E){ return dy0 + 6 + (E / -RY_EV) * (dy1 - dy0 - 6); }
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(dx0, yE(0)); ctx.lineTo(dx1, yE(0)); ctx.stroke(); ctx.setLineDash([]);
      p2text(ctx, "0 (ionisé)", dx1, yE(0) - 6, {size:8.5, color:"#9fb0c6", align:"right"});
      for (n = 1; n <= 6; n++){
        var y = yE(En(n)), on = n === A.n || (A.state === "up" && n === A.to);
        ctx.strokeStyle = on ? "#7fb6ff" : "rgba(200,215,240,.55)"; ctx.lineWidth = on ? 2.2 : 1.2; ctx.beginPath(); ctx.moveTo(dx0 + 26, y); ctx.lineTo(dx1 - (n <= 2 ? 40 : 4), y); ctx.stroke();
        if (n <= 3) p2text(ctx, "n=" + n, dx0, y, {size:8.5, color:"#b8c6da", align:"left"});
        if (n <= 2) p2text(ctx, p2fmt(En(n), 2), dx1, y, {size:8.5, color:"#b8c6da", align:"right"});
      }
      if (A.state === "up" || A.state === "down"){
        var ya = yE(En(A.n)), yb2 = yE(En(A.to)), xx2 = (dx0 + dx1) / 2;
        if (A.state === "up") p2arrow(ctx, xx2, ya, xx2, yb2, "#7dff9d", 2.2); else p2arrow(ctx, xx2 + 12, yb2, xx2 + 12, ya, "#ffd36b", 2.2);
      }
      if (A.state === "ion"){ var xx3 = (dx0 + dx1) / 2; p2arrow(ctx, xx3, yE(En(A.n)), xx3, yE(0) - 6, "#7dff9d", 2.2); }
      p2tag(ctx, "Photon sur un atome d'hydrogène", 10, 16, {align:"left", bg:"rgba(255,255,255,.12)", color:"#fff", size:ph ? 11 : 12.5});
      if (!ph) p2text(ctx, "orbites non à l'échelle (r ∝ n²)", 12, H - 12, {size:9.5, color:"#7f8ea5", align:"left"});
    }
    /* ---------- écran agrandi / axe des énergies ---------- */
    function drawStrip(){
      var ctx = g.ctx, W = g.W, H = g.H, m = mS.value; g.clear();
      ctx.fillStyle = "#0d1422"; p2rr(ctx, 0, 0, W, H, 10); ctx.fill();
      var x0 = 28, x1 = W - 14;
      if (m === "photon"){
        EAX.x0 = x0; EAX.x1 = x1;
        var n0 = +nS.value, Eion = RY_EV / (n0 * n0), yL = 34, yA = H - 40;
        /* zone d'ionisation */
        var xi = EAX.X(Eion);
        if (xi < x1){ var gz = ctx.createLinearGradient(xi, 0, x1, 0); gz.addColorStop(0, "rgba(125,255,157,.22)"); gz.addColorStop(1, "rgba(125,255,157,.08)"); ctx.fillStyle = gz; ctx.fillRect(xi, yL - 8, x1 - xi, yA - yL + 8); p2text(ctx, "ionisation", x1 - 4, yL + 2, {size:9.5, color:"#9ff0b4", align:"right"}); p2text(ctx, "≥ " + p2fmt(Eion, 2) + " eV", x1 - 4, yL + 14, {size:9.5, color:"#9ff0b4", align:"right"}); }
        /* raies d'absorption possibles depuis n0 */
        var lastLx = -1e9; ctx.save(); ctx.font = p2font(700, 9.5);
        for (var n = n0 + 1; n <= 30; n++){
          var d = En(n) - En(n0); if (d < 1) continue; var x = EAX.X(d);
          ctx.strokeStyle = n <= n0 + 3 ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x, yL); ctx.lineTo(x, yA); ctx.stroke(); ctx.setLineDash([]);
          if (n <= n0 + 2 || (n === n0 + 3 && W > 480)){
            var lab = n0 + "→" + n, tw = ctx.measureText(lab).width;
            if (x - tw / 2 > lastLx + 3){ p2text(ctx, lab, x, yA + 10, {size:9.5, color:"#c9d4e3"}); lastLx = x + tw / 2; }
          }
        }
        ctx.restore();
        /* tirs passés */
        st.shots.forEach(function(sh){ var x = EAX.X(sh.E); ctx.strokeStyle = sh.kind === "pass" ? "rgba(255,120,100,.75)" : "rgba(125,255,157,.95)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, yL + 4); ctx.lineTo(x, yA - 4); ctx.stroke(); });
        /* axe */
        ctx.strokeStyle = "#8a9bb3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, yA); ctx.lineTo(x1, yA); ctx.stroke();
        for (var E = 1; E <= 15; E++){ var xt = EAX.X(E); ctx.beginPath(); ctx.moveTo(xt, yA); ctx.lineTo(xt, yA + 4); ctx.stroke(); if (E % (W < 480 ? 2 : 1) === 1 || W >= 480) p2text(ctx, String(E), xt, yA + 22, {size:9.5, color:"#8a9bb3"}); }
        p2text(ctx, "E (eV)", x1, H - 6, {size:9.5, color:"#8a9bb3", align:"right"});
        /* curseur de l'énergie choisie */
        var xc = EAX.X(eS.value), l = HC_EVNM / eS.value;
        ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, xc, (yL + yA) / 2, 26, "rgba(255,230,120,A)", 0.3); ctx.restore();
        ctx.strokeStyle = "#ffd36b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xc, yL - 6); ctx.lineTo(xc, yA); ctx.stroke();
        ctx.fillStyle = "#ffd36b"; ctx.beginPath(); ctx.moveTo(xc - 6, yL - 12); ctx.lineTo(xc + 6, yL - 12); ctx.lineTo(xc, yL - 4); ctx.closePath(); ctx.fill();
        var lab = p2fmt(eS.value, 2) + " eV · λ = " + p2fmt(l, 0) + " nm";
        ctx.font = p2font(800, 10.5); var lw = ctx.measureText(lab).width;
        p2text(ctx, lab, Math.max(x0 + lw / 2, Math.min(x1 - lw / 2, xc)), 12, {size:10.5, color:"#ffe7a3", w:800});
        p2text(ctx, W < 480 ? "vert : absorbé · rouge : passé" : "vert : absorbé · rouge : passé sans interaction · glisse pour choisir E", x0, H - 6, {size:9.5, color:"#7f8ea5", align:"left"});
        return;
      }
      var gas = gS.value, T = tS.value, lines = gasLines(gas, m), yS0 = 22, yS1 = 70, yP0 = 82, yP1 = H - 30;
      function X(l){ return x0 + (l - LMIN) / (LMAX - LMIN) * (x1 - x0); }
      /* bande spectrale */
      ctx.fillStyle = "#000"; ctx.fillRect(x0, yS0, x1 - x0, yS1 - yS0);
      var prof = function(l){
        if (m === "emi") return Math.min(1, lineProf(l, lines, 0.9) * 1.2);
        var I = Math.min(1, Math.sqrt(lampI(l, T) * 1.25));
        return m === "abs" ? I * Math.max(0, 1 - lineProf(l, lines, 1.4) * 1.6) : I;
      };
      /* courbe : intensité relative (rapportée à son maximum dans le visible) */
      var pmax = 0;
      if (m !== "emi") for (var q = LMIN; q <= LMAX; q += 2) pmax = Math.max(pmax, lampI(q, T));
      var prof2 = function(l){
        if (m === "emi") return prof(l);
        var I = lampI(l, T) / pmax;
        return m === "abs" ? I * Math.max(0, 1 - lineProf(l, lines, 1.4) * 1.6) : I;
      };
      for (var px = x0; px < x1; px++){ var lam = LMIN + (px - x0) / (x1 - x0) * (LMAX - LMIN); var I2 = prof(lam); if (I2 > 0.004){ ctx.fillStyle = wlCol(lam, Math.min(1, I2 * 1.15)); ctx.fillRect(px, yS0, 1.2, yS1 - yS0); } }
      ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.strokeRect(x0 + 0.5, yS0 + 0.5, x1 - x0 - 1, yS1 - yS0 - 1);
      /* profil d'intensité */
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.moveTo(x0, yP1); ctx.lineTo(x1, yP1); ctx.stroke();
      ctx.beginPath();
      for (px = x0; px <= x1; px++){ var lm = LMIN + (px - x0) / (x1 - x0) * (LMAX - LMIN), v = prof2(lm); var yy = yP1 - v * (yP1 - yP0); px === x0 ? ctx.moveTo(px, yy) : ctx.lineTo(px, yy); }
      ctx.strokeStyle = "#e8eefb"; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.save(); ctx.translate(x0 - 10, (yP0 + yP1) / 2); ctx.rotate(-PI / 2); p2text(ctx, "intensité rel.", 0, 0, {size:9, color:"#7f8ea5"}); ctx.restore();
      /* graduations */
      ctx.strokeStyle = "#8a9bb3"; ctx.lineWidth = 1;
      for (var lt = 400; lt <= 750; lt += 50){ var xt2 = X(lt); ctx.beginPath(); ctx.moveTo(xt2, yP1); ctx.lineTo(xt2, yP1 + 4); ctx.stroke(); if (W >= 480 || lt % 100 === 0) p2text(ctx, String(lt), xt2, yP1 + 13, {size:9.5, color:"#8a9bb3"}); }
      p2text(ctx, "λ (nm)", x1, H - 6, {size:9.5, color:"#8a9bb3", align:"right"});
      p2text(ctx, m === "lampe" ? "Écran agrandi : glisse pour lire λ" : "Écran agrandi : glisse sur une raie", x0, 11, {size:10, color:"#b8c6da", align:"left"});
      if (m !== "lampe" && W >= 480) p2text(ctx, GAS[gas].nom, x1, 11, {size:10, color:"#b8c6da", align:"right"});
      /* curseur souris */
      st.hov = null;
      if (st.gx != null && st.gx >= x0 && st.gx <= x1){
        var lh = LMIN + (st.gx - x0) / (x1 - x0) * (LMAX - LMIN), near = null;
        if (m !== "lampe") lines.forEach(function(L){ if (Math.abs(L[0] - lh) < 4 && (!near || Math.abs(L[0] - lh) < Math.abs(near[0] - lh))) near = L; });
        if (near) lh = near[0];
        st.hov = {l:lh, line:near};
        var xh = X(lh);
        ctx.strokeStyle = "#ffd36b"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xh, yS0 - 4); ctx.lineTo(xh, yP1); ctx.stroke();
        var lab2 = p2fmt(lh, 1) + " nm · " + p2fmt(HC_EVNM / lh, 2) + " eV";
        ctx.font = p2font(800, 10.5); var w2 = ctx.measureText(lab2).width + 12;
        var bx = Math.max(x0, Math.min(x1 - w2, xh - w2 / 2));
        ctx.fillStyle = "rgba(255,211,107,.95)"; p2rr(ctx, bx, yP0 - 2, w2, 17, 8); ctx.fill();
        p2text(ctx, lab2, bx + w2 / 2, yP0 + 6.5, {size:10.5, color:"#1b1300", w:800});
      }
    }
    k.draw(function(){
      var m = mS.value, W = c.W, H = c.H, ctx = c.ctx;
      gBox.style.display = m === "photon" || m === "lampe" ? "none" : "";
      box(tS).style.display = m === "lampe" || m === "abs" ? "" : "none";
      box(eS).style.display = nBox.style.display = aBox.style.display = m === "photon" ? "" : "none";
      var bb = bClr.parentNode; if (bb) bb.style.display = m === "photon" ? "" : "none";
      c.clear();
      if (m === "photon") drawPhoton(ctx, W, H); else drawBench(ctx, W, H);
      drawStrip();
      /* afficheurs */
      var T = tS.value, gas = GAS[gS.value];
      if (m === "photon"){
        var E = eS.value, l = HC_EVNM / E, n0 = +nS.value, o = outcome(E, n0);
        ro.set(0, "atome H, n = " + n0);
        ro.set(1, p2fmt(l, 1) + " nm (" + (l < 380 ? "UV" : l > 750 ? "IR" : "visible") + ")");
        ro.set(2, p2fmt(E, 2) + " eV");
        ro.set(3, o.kind === "ion" ? "ionisation, Ec = " + p2fmt(o.Ec, 2) + " eV" : o.kind === "abs" ? "absorbé : " + n0 + " → " + o.n : "traverse l'atome");
        var msg;
        if (o.kind === "ion") msg = "E = " + p2fmt(E, 2) + " eV ≥ énergie d'ionisation depuis n = " + n0 + " (13,6/" + n0 * n0 + " = " + p2fmt(o.Eion, 2) + " eV) : l'électron est arraché et emporte Ec = " + p2fmt(E, 2) + " − " + p2fmt(o.Eion, 2) + " = " + p2fmt(o.Ec, 2) + " eV. Toute énergie au-delà du seuil convient.";
        else if (o.kind === "abs") msg = "Absorbé : E" + o.n + " − E" + n0 + " = 13,6·(1/" + n0 * n0 + " − 1/" + o.n * o.n + ") = " + p2fmt(o.d, 2) + " eV. L'atome passe sur n = " + o.n + ", puis réémet un photon de même énergie dans une direction quelconque : vu depuis le détecteur, il manque.";
        else msg = "Traverse : la transition la plus proche (" + n0 + " → " + o.n + ") demande " + p2fmt(o.d, 2) + " eV, il y a " + p2fmt(Math.abs(o.diff), 2) + " eV d'écart. L'atome ne prend pas « une partie » du photon : c'est tout ou rien.";
        nt.set(msg + " <i>Tolérance de la simulation : ±0,03 eV (une vraie raie est bien plus fine).</i>", o.kind === "pass" ? "warn" : "ok");
        return;
      }
      ro.set(0, m === "lampe" ? "filament à " + p2int(T) + " K" : m === "emi" ? "tube à " + gas.nom : "lampe + " + gas.nom);
      var h = st.hov;
      if (h){
        ro.set(1, p2fmt(h.l, 1) + " nm"); ro.set(2, p2fmt(HC_EVNM / h.l, 2) + " eV");
        ro.set(3, h.line ? (m === "abs" ? "raie noire" : "raie brillante") + (h.line[2] ? " " + h.line[2] : "") : m === "emi" ? "noir (pas de raie)" : m === "abs" ? "lumière transmise" : "lumière continue");
      } else {
        ro.set(1, "glisse sur l'écran"); ro.set(2, "—");
        ro.set(3, m === "lampe" ? "toutes les couleurs" : m === "emi" ? gas.lines.length + " raies visibles" : (gas.abs || gas.lines).length + " raies noires");
      }
      var msg2;
      if (m === "lampe") msg2 = "Spectre continu : toutes les longueurs d'onde sont présentes. Loi de Wien : λmax = 2,898·10⁶ / " + p2int(T) + " = " + p2int(WIEN / T) + " nm, dans l'infrarouge : un filament émet surtout de la chaleur, et sa lumière visible penche vers le rouge. Monte T : le bleu se renforce.";
      else if (m === "emi"){
        msg2 = "Le gaz excité par la décharge n'émet que quelques longueurs d'onde : chaque raie est un saut d'un niveau à un autre (E = hc/λ).";
        if (gS.value === "H") msg2 += " Hydrogène : série de Balmer, retour sur n = 2 : 1/λ = R(1/4 − 1/n²), d'où Hα = " + p2fmt(balmer(3), 0) + " nm (3 → 2), Hβ = " + p2fmt(balmer(4), 0) + " nm, Hγ = " + p2fmt(balmer(5), 0) + " nm, Hδ = " + p2fmt(balmer(6), 0) + " nm.";
        if (gS.value === "Na") msg2 += " Sodium : le doublet jaune D (589,0 et 589,6 nm) domine, d'où la couleur des lampes d'autoroute.";
        if (gS.value === "Ne") msg2 += " Néon : des dizaines de raies dans le rouge et l'orange, d'où la couleur des enseignes.";
        if (gS.value === "He") msg2 += " Hélium : la raie jaune 587,6 nm a été découverte dans le spectre du Soleil avant l'élément lui-même.";
      } else {
        msg2 = "Le gaz absorbe exactement les longueurs d'onde qu'il émet quand on l'excite : les raies noires tombent aux places des raies brillantes (compare avec « Tube à gaz »). Il réémet cette lumière dans toutes les directions, donc elle manque dans le faisceau.";
        msg2 += gS.value === "Na" ? " Le sodium absorbe ses raies D même froid : ses atomes sont dans l'état fondamental 3s. Ses autres raies visibles partent de niveaux excités : elles n'apparaissent pas ici." : " En toute rigueur, ces raies visibles partent de niveaux excités : il faut un gaz déjà chaud (comme l'atmosphère d'une étoile) pour les voir en absorption.";
      }
      nt.set(msg2, "ok");
    });
  }
});

/* =====================================================================
   2. Énergies d'ionisation successives (L03)
   ===================================================================== */
/* kJ/mol, valeurs de référence (CRC Handbook) */
var IONZ = {
  Na:{Z:11, nom:"sodium", g:1, E:[495.8, 4562, 6910.3, 9543, 13354, 16613, 20117, 25496, 28932, 141362, 159076]},
  Mg:{Z:12, nom:"magnésium", g:2, E:[737.7, 1450.7, 7732.7, 10542.5, 13630, 18020, 21711, 25661, 31653, 35458, 169988, 189368]},
  Al:{Z:13, nom:"aluminium", g:13, E:[577.5, 1816.7, 2744.8, 11577, 14842, 18379, 23326, 27465, 31853, 38473, 42647, 201266, 222316]},
  Si:{Z:14, nom:"silicium", g:14, E:[786.5, 1577.1, 3231.6, 4355.5, 16091, 19805, 23780, 29287, 33878, 38726, 45962, 50502, 235196, 257923]},
  P:{Z:15, nom:"phosphore", g:15, E:[1011.8, 1907, 2914.1, 4963.6, 6273.9, 21267, 25431, 29872, 35905, 40950, 46261, 54110, 59024, 271791, 296195]},
  S:{Z:16, nom:"soufre", g:16, E:[999.6, 2252, 3357, 4556, 7004.3, 8495.8, 27107, 31719, 36621, 43177, 48710, 54460, 62930, 68216, 311048, 337138]},
  Cl:{Z:17, nom:"chlore", g:17, E:[1251.2, 2298, 3822, 5158.6, 6542, 9362, 11018, 33604, 38600, 43961, 51068, 57119, 63363, 72341, 78095, 352994, 380760]},
  Ar:{Z:18, nom:"argon", g:18, E:[1520.6, 2665.8, 3931, 5771, 7238, 8781, 11995, 13842, 40760, 46186, 52002, 59653, 66199, 72918, 82473, 88576, 397605, 427066]}
};
var SUPN = {"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹"};
function fmtE(E){ var i = Math.floor(E), f = Math.round((E - i) * 10); if (f === 10){ i++; f = 0; } return p2int(i) + (f ? "," + f : ""); }
function supN(n){ return String(n).split("").map(function(d){ return SUPN[d]; }).join(""); }
function ionName(sym, q){ return q === 0 ? sym + " (atome neutre)" : sym + (q > 1 ? supN(q) : "") + "⁺"; }
/* configuration d'une espèce à N électrons (période 3 au plus) */
function confN(N){
  var sub = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6]], out = [];
  sub.forEach(function(x){ if (N > 0){ var q = Math.min(N, x[1]); out.push(x[0] + supN(q)); N -= q; } });
  return out.join(" ") || "aucun électron (noyau nu)";
}
var SHC = {K:"#8a5cf6", L:"#2f7fd1", M:"#1fa36b"};

SFA.sim({
  id:"ch-ionisations-successives", ch:"L03", tag:"Tableau périodique",
  titre:"Arracher les électrons un à un : le saut qui trahit la valence",
  resume:"Attrape un électron et tire-le hors de l'atome : l'énergie dépensée s'empile en barres sur une échelle logarithmique. Au premier électron de cœur, la barre fait un saut énorme : le nombre d'électrons de valence apparaît.",
  but:"Choisis un élément de la 3e période. Attrape à la souris un électron de la couche la plus externe (les autres sont trop liés pour l'instant) et tire-le loin du noyau, jusqu'au bord : il est arraché et l'énergie d'ionisation correspondante s'ajoute sur le graphique (échelle logarithmique). Continue électron par électron et repère le saut. Le bouton « Arracher l'électron suivant » le fait pour toi.",
  aRetenir:"L'énergie d'ionisation Eᵢ,ₖ est l'énergie à fournir pour arracher le k-ième électron à l'ion gazeux de charge k − 1 : X⁽ᵏ⁻¹⁾⁺(g) → Xᵏ⁺(g) + e⁻. Les Eᵢ successives croissent toujours (on arrache un électron à un ion de plus en plus positif), mais elles font un saut énorme quand on passe des électrons de valence à ceux de la couche complète en dessous (plus proches du noyau, moins écrantés). Le nombre d'électrons arrachés avant ce saut = nombre d'électrons de valence = numéro du groupe (1, 2, puis 13 à 18 → 3 à 8). 1 eV par atome = 96,485 kJ/mol.",
  piege:"Le saut ne se lit pas sur la différence Eₖ − Eₖ₋₁ mais sur le rapport Eₖ/Eₖ₋₁ (d'où l'échelle logarithmique) : pour le magnésium, 1451 → 7733 kJ/mol, c'est ×5,3. Les petites marches à l'intérieur de la couche de valence (Al : 3p puis 3s, ×3,1) ne sont pas le saut de valence : celui-ci est le premier très grand rapport (Al : ×4,2 entre Eᵢ₃ et Eᵢ₄). Le saut suivant (×4,5 à ×4,9 selon l'élément) marque le passage à la couche n = 1 ; en kJ/mol, c'est de loin le plus grand. Et l'énergie de l'électron arraché ne « sert » pas à le rendre plus rapide : elle sert à vaincre l'attraction du noyau.",
  build:function(k, S){
    var c = p2canvas(k, 0.86, 1.02), g = k.canvas(214);
    var st = {t:0, tr:0, near:false, el:"Mg", out:0, drag:null, fly:[], auto:true, autoT:0, pull:null, flash:-9, msg:"", bad:-9, hover:-1};
    var eS = k.seg("Élément (3e période)", Object.keys(IONZ).map(function(x){ return [x, x]; }), "Mg", function(v){ st.el = v; reset(); });
    var aT = k.toggle("Démonstration automatique", true, function(v){ st.auto = v; st.autoT = 0; });
    k.button("Arracher l'électron suivant", function(){ startPull(); }, true);
    k.button("Tout remettre", function(){ reset(); });
    var ro = k.readouts(["Espèce obtenue", "Dernière Eᵢ arrachée", "Par atome", "Rapport Eₖ / Eₖ₋₁", "Énergie totale fournie"]);
    var nt = k.note("", "ok");
    function D(){ return IONZ[st.el]; }
    function val(){ var gg = D().g; return gg > 2 ? gg - 10 : gg; }
    function shellOf(i){ /* i = rang de l'électron dans l'ordre d'arrachage (0 = premier arraché) */ var Z = D().Z, r = Z - 1 - i; return r < 2 ? "K" : r < 10 ? "L" : "M"; }
    function reset(){ st.out = 0; st.drag = null; st.fly = []; st.pull = null; st.autoT = 0; st.flash = -9; }
    /* ---------- géométrie des couches (anneaux inclinés qui tournent) ---------- */
    var SH = {K:{n:0, tilt:[0.9, 0.3], sp:1.6}, L:{n:1, tilt:[-0.55, 0.9], sp:1.0}, M:{n:2, tilt:[0.35, -0.6], sp:0.62}};
    function geom(){
      var W = c.W, H = c.H, ph = W < 480, cx = W * (ph ? 0.46 : 0.42), cy = H * 0.52, R = Math.min(W * (ph ? 0.36 : 0.3), H * 0.3);
      return {cx:cx, cy:cy, R:R, rad:{K:R * 0.34, L:R * 0.64, M:R * 0.98}, esc:R * 1.5, ph:ph};
    }
    /* positions des électrons encore présents : liste {sh, idx (rang d'arrachage), x, y, z} */
    function electrons(G){
      var Z = D().Z, list = [], tot = {K:Math.min(2, Z), L:Math.max(0, Math.min(8, Z - 2)), M:Math.max(0, Z - 10)};
      /* ordre d'arrachage : M, puis L, puis K */
      var o = st.out, rem = {}, nx = shellOf(Math.min(o, Z - 1));
      ["M", "L", "K"].forEach(function(sh){ var r = Math.min(o, tot[sh]); o -= r; rem[sh] = tot[sh] - r - (st.drag && st.drag.sh === sh ? 1 : 0); });
      ["K", "L", "M"].forEach(function(sh){
        for (var j = 0; j < rem[sh]; j++){
          var S0 = SH[sh], th = st.tr * S0.sp + j / tot[sh] * 2 * PI, rr = G.rad[sh];
          var x = Math.cos(th) * rr, y = Math.sin(th) * rr;
          /* inclinaison de l'anneau : rotation autour de x puis de y, qui dérive lentement */
          var a = S0.tilt[0] + st.tr * 0.07 * (S0.n + 1), b = S0.tilt[1];
          var y1 = y * Math.cos(a), z1 = y * Math.sin(a), x2 = x * Math.cos(b) + z1 * Math.sin(b), z2 = -x * Math.sin(b) + z1 * Math.cos(b);
          list.push({sh:sh, next:sh === nx && st.out < Z, x:G.cx + x2, y:G.cy + y1 * 0.9, z:z2 / rr, rr:rr});
        }
      });
      return list;
    }
    function ringPath(ctx, G, sh){
      var S0 = SH[sh], rr = G.rad[sh], a = S0.tilt[0] + st.tr * 0.07 * (S0.n + 1), b = S0.tilt[1];
      ctx.beginPath();
      for (var q = 0; q <= 64; q++){
        var th = q / 64 * 2 * PI, x = Math.cos(th) * rr, y = Math.sin(th) * rr;
        var y1 = y * Math.cos(a), z1 = y * Math.sin(a), x2 = x * Math.cos(b) + z1 * Math.sin(b);
        q ? ctx.lineTo(G.cx + x2, G.cy + y1 * 0.9) : ctx.moveTo(G.cx + x2, G.cy + y1 * 0.9);
      }
    }
    /* ---------- arrachage ---------- */
    function ionize(){
      var d = D(); if (st.out >= d.Z) return;
      st.out++;
      if (st.out === val() + 1) st.flash = st.t;
    }
    function startPull(){
      var d = D(); if (st.out >= d.Z || st.pull || st.drag) return;
      var G = geom(), es = electrons(G), e = null;
      es.forEach(function(x){ if (x.next && (!e || x.z > e.z)) e = x; });
      if (!e) return;
      var dx = e.x - G.cx, dy = e.y - G.cy, L = Math.hypot(dx, dy) || 1;
      st.drag = {sh:e.sh, x:e.x, y:e.y, r0:e.rr, ux:dx / L, uy:dy / L, auto:true, tt:0};
      st.pull = true;
    }
    c.cv.addEventListener("pointerleave", function(){ st.near = false; });
    c.pointer(function(type, p){
      var G = geom();
      if (type === "down"){
        var best = null, bd = 22;
        electrons(G).forEach(function(e){ var d = Math.hypot(e.x - p.x, e.y - p.y); if (d < bd){ bd = d; best = e; } });
        if (!best) return;
        st.auto = false; aT.set(false);
        if (!best.next){ st.bad = st.t; st.badSh = best.sh; return; }
        st.drag = {sh:best.sh, x:p.x, y:p.y, r0:best.rr, auto:false};
      }
      if (type === "drag" && st.drag && !st.drag.auto){ st.drag.x = p.x; st.drag.y = p.y; checkEsc(G); }
      if (type === "move"){ var h = null; electrons(G).forEach(function(e){ if (Math.hypot(e.x - p.x, e.y - p.y) < 22) h = e; }); st.near = Math.hypot(p.x - G.cx, p.y - G.cy) < G.R * 1.1; c.cv.style.cursor = h ? (h.next ? "grab" : "not-allowed") : "default"; }
      if (type === "up" && st.drag && !st.drag.auto){ st.drag = null; }
    });
    function frac(G){ if (!st.drag) return 0; var d = Math.hypot(st.drag.x - G.cx, st.drag.y - G.cy); return Math.max(0, Math.min(1, (d - st.drag.r0) / (G.esc - st.drag.r0))); }
    function checkEsc(G){
      if (frac(G) >= 1){
        var dr = st.drag, dx = dr.x - G.cx, dy = dr.y - G.cy, L = Math.hypot(dx, dy) || 1;
        st.fly.push({x:dr.x, y:dr.y, vx:dx / L * 260, vy:dy / L * 260, a:1, sh:dr.sh});
        st.drag = null; st.pull = null; ionize();
      }
    }
    var lp = k.loop(function(dt){
      st.t += dt; st.tr += dt * (st.near || st.drag ? 0.12 : 1); var G = geom();
      if (st.drag && st.drag.auto){
        st.drag.tt += dt; var u = Math.min(1, st.drag.tt / 1.1), e = u * u * (3 - 2 * u), d = st.drag.r0 + (G.esc * 1.02 - st.drag.r0) * e;
        var th = Math.atan2(st.drag.uy, st.drag.ux) + dt * 0.4; st.drag.ux = Math.cos(th); st.drag.uy = Math.sin(th);
        st.drag.x = G.cx + st.drag.ux * d; st.drag.y = G.cy + st.drag.uy * d; checkEsc(G);
      }
      st.fly.forEach(function(f){ f.x += f.vx * dt; f.y += f.vy * dt; f.a -= dt * 0.9; });
      st.fly = st.fly.filter(function(f){ return f.a > 0; });
      if (st.auto){
        st.autoT += dt;
        var target = val() + 1;
        if (st.out < target && !st.drag && st.autoT > 1.5){ st.autoT = 0; startPull(); }
        if (st.out >= target && st.autoT > 6){ reset(); }
      }
      k.redraw();
    });
    lp.play();
    /* ---------- dessin de l'atome ---------- */
    function nucleus(ctx, x, y, R, Z){
      var balls = [], N = Math.round(Z * 1.1), n = Z + N;
      for (var i = 0; i < n; i++){
        var ph = i * 2.39996, rr = R * Math.sqrt((i + 0.5) / n) * 0.95, zz = Math.cos(i * 1.7);
        balls.push({x:x + Math.cos(ph) * rr, y:y + Math.sin(ph) * rr, z:zz, p:i % 2 === 0 && balls.filter(function(b){ return b.p; }).length < Z});
      }
      balls.sort(function(a, b){ return a.z - b.z; });
      ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, x, y, R * 2.4, "rgba(255,110,80,A)", 0.22); ctx.restore();
      balls.forEach(function(b){ p2ball(ctx, b.x, b.y, R * 0.34, b.p ? "#e0533b" : "#9aa3b2"); });
      p2tag(ctx, "+" + Z, x, y + R + 12, {size:10.5, bg:"rgba(224,83,59,.85)", color:"#fff"});
    }
    function drawScene(){
      var ctx = c.ctx, W = c.W, H = c.H, G = geom(), d = D(), v = val(); c.clear();
      /* chambre à vide : fond sombre, hublot */
      var bg = ctx.createRadialGradient(G.cx, G.cy, 10, G.cx, G.cy, Math.max(W, H) * 0.8);
      bg.addColorStop(0, "#1d2c47"); bg.addColorStop(1, "#060a12"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.strokeStyle = "rgba(160,190,230,.10)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(G.cx, G.cy, G.esc + 8, 0, 7); ctx.stroke();
      ctx.strokeStyle = "rgba(160,190,230,.22)"; ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.arc(G.cx, G.cy, G.esc, 0, 7); ctx.stroke(); ctx.restore();
      /* « électron libre au-delà » : au-dessus du cercle s'il y a la place sous le titre, sinon écrit le long de l'arc, à l'intérieur, en haut à droite */
      var yLib = G.cy - G.esc - 10, lib = "électron libre au-delà";
      if (yLib > 56) p2text(ctx, lib, G.cx, yLib, {size:9.5, color:"rgba(170,195,235,.7)"});
      else {
        ctx.save(); ctx.font = p2font(700, 9.5); ctx.fillStyle = "rgba(170,195,235,.75)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        var ra = G.esc - 9, aa = -PI / 3 - ctx.measureText(lib).width / (2 * ra);
        lib.split("").forEach(function(ch){
          var cw = ctx.measureText(ch).width, am = aa + cw / (2 * ra);
          ctx.save(); ctx.translate(G.cx + ra * Math.cos(am), G.cy + ra * Math.sin(am)); ctx.rotate(am + PI / 2); ctx.fillText(ch, 0, 0); ctx.restore();
          aa += cw / ra;
        });
        ctx.restore();
      }
      /* sphères des couches (volume) */
      ["M", "L", "K"].forEach(function(sh){
        var r = G.rad[sh], full = electrons(G).some(function(e){ return e.sh === sh; }) || (st.drag && st.drag.sh === sh);
        if (!full) return;
        var gg = ctx.createRadialGradient(G.cx - r * 0.3, G.cy - r * 0.35, r * 0.1, G.cx, G.cy, r);
        gg.addColorStop(0, p2rgba(SHC[sh], 0.02)); gg.addColorStop(0.85, p2rgba(SHC[sh], 0.07)); gg.addColorStop(1, p2rgba(SHC[sh], 0.18));
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(G.cx, G.cy, r, 0, 7); ctx.fill();
      });
      var es = electrons(G);
      /* anneaux */
      ["K", "L", "M"].forEach(function(sh){
        if (!es.some(function(e){ return e.sh === sh; }) && !(st.drag && st.drag.sh === sh)) return;
        ringPath(ctx, G, sh); ctx.strokeStyle = p2rgba(SHC[sh], 0.45); ctx.lineWidth = 1.2; ctx.stroke();
      });
      /* électrons derrière, noyau, électrons devant */
      function drawE(e){ var r = 6.5 * (1 + 0.18 * e.z) * (G.ph ? 0.9 : 1); var nxt = e.next; if (nxt){ ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, e.x, e.y, r * 2.6, "rgba(255,230,120,A)", 0.28 + 0.15 * Math.sin(st.t * 5)); ctx.restore(); } p2ball(ctx, e.x, e.y, r, SHC[e.sh], 0.75 + 0.25 * (e.z + 1) / 2); }
      es.filter(function(e){ return e.z < 0; }).forEach(drawE);
      nucleus(ctx, G.cx, G.cy, G.R * 0.1, d.Z);
      es.filter(function(e){ return e.z >= 0; }).forEach(drawE);
      /* électron attrapé : élastique de l'attraction + jauge */
      var f = frac(G), Ek = d.E[st.out];
      if (st.drag){
        var dr = st.drag;
        ctx.save(); ctx.strokeStyle = "rgba(255,211,107," + (0.9 - 0.5 * f) + ")"; ctx.lineWidth = 3 - 2 * f; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(G.cx, G.cy); ctx.lineTo(dr.x, dr.y); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = "lighter"; p2glow(ctx, dr.x, dr.y, 22, "rgba(255,230,120,A)", 0.45); ctx.restore();
        p2ball(ctx, dr.x, dr.y, 8, SHC[dr.sh]);
        p2tag(ctx, p2int(Ek * f) + " / " + fmtE(Ek) + " kJ/mol", Math.max(70, Math.min(W - 70, dr.x)), Math.max(56, Math.min(H - 34, dr.y - 20)), {size:10.5, bg:"rgba(255,211,107,.95)", color:"#241a00"});
      }
      st.fly.forEach(function(e){ p2ball(ctx, e.x, e.y, 6, SHC[e.sh], Math.max(0, e.a)); });
      /* jauge d'énergie (droite) */
      var gx = W - (G.ph ? 30 : 46), gy0 = H * 0.14, gy1 = H * 0.86, gw = G.ph ? 14 : 20;
      function yl(E){ return gy1 - (Math.log10(Math.max(100, E)) - 2) / 4 * (gy1 - gy0); }
      var gb = ctx.createLinearGradient(gx, 0, gx + gw, 0); gb.addColorStop(0, "#1a2232"); gb.addColorStop(0.5, "#33405a"); gb.addColorStop(1, "#141b28");
      ctx.fillStyle = gb; p2rr(ctx, gx, gy0 - 6, gw, gy1 - gy0 + 12, gw / 2); ctx.fill();
      if (st.out < d.Z){
        var yt = yl(Ek), yf = gy1 - (gy1 - yt) * f;
        var fg = ctx.createLinearGradient(0, gy1, 0, yt); fg.addColorStop(0, "#ffb347"); fg.addColorStop(1, "#ff5e3a");
        ctx.fillStyle = fg; p2rr(ctx, gx + 3, yf, gw - 6, gy1 - yf, (gw - 6) / 2); ctx.fill();
        ctx.strokeStyle = "#ffd36b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx - 5, yt); ctx.lineTo(gx + gw + 3, yt); ctx.stroke();
        p2text(ctx, "Eᵢ" + supIdx(st.out + 1), gx - 7, yt, {size:10, color:"#ffd36b", align:"right", w:800});
      }
      [2, 3, 4, 5, 6].forEach(function(pw){ var y = yl(Math.pow(10, pw)); ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx + gw - 4, y); ctx.lineTo(gx + gw, y); ctx.stroke(); if (!G.ph) p2text(ctx, "10" + supN(pw), gx + gw + 3, y, {size:8.5, color:"#7f8ea5", align:"left"}); });
      p2text(ctx, "énergie", gx + gw / 2, gy0 - 16, {size:9.5, color:"#9fb0c6"});
      /* titre : espèce et configuration */
      p2tag(ctx, d.nom + " · " + ionName(st.el, st.out), 10, 16, {align:"left", bg:"rgba(255,255,255,.12)", color:"#fff", size:G.ph ? 11.5 : 13});
      p2text(ctx, confN(d.Z - st.out), 12, 38, {size:G.ph ? 10.5 : 11.5, color:"#b8c6da", align:"left"});
      /* légende des couches */
      var ly = H - 14, lx = 12;
      [["K", "couche n = 1"], ["L", "n = 2"], ["M", "n = 3 (valence)"]].forEach(function(it){
        p2ball(ctx, lx + 5, ly, 5, SHC[it[0]]); p2text(ctx, it[1], lx + 14, ly, {size:9.5, color:"#b8c6da", align:"left"});
        ctx.font = p2font(700, 9.5); lx += 26 + ctx.measureText(it[1]).width;
      });
      if (st.t - st.bad < 2.2) p2tag(ctx, "Trop lié : arrache d'abord la couche externe", G.cx, G.cy - G.R * 0.5 - 30 > 50 ? G.cy - G.R - 22 : 60, {size:11, bg:"rgba(192,50,29,.92)", color:"#fff"});
      if (st.out === 0 && !st.drag && !st.auto) p2tag(ctx, "attrape un électron vert et tire-le vers le bord", G.cx, H - 36, {size:10.5, bg:"rgba(255,255,255,.14)", color:"#fff"});
    }
    function supIdx(n){ var m = {"0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆", "7":"₇", "8":"₈", "9":"₉"}; return String(n).split("").map(function(x){ return m[x]; }).join(""); }
    /* ---------- barres sur échelle logarithmique ---------- */
    g.pointer(function(type, p){ if (type === "move" || type === "down" || type === "drag"){ st.hx = p.x; } if (type === "up") st.hx = null; });
    g.cv.addEventListener("pointerleave", function(){ st.hx = null; });
    function drawBars(){
      var ctx = g.ctx, W = g.W, H = g.H, d = D(), v = val(), Z = d.Z; g.clear();
      ctx.fillStyle = "#f7f9fc"; p2rr(ctx, 0, 0, W, H, 10); ctx.fill();
      var L = 44, R = W - 10, T = 34, B = H - 32, sw = (R - L) / Z;
      function Y(E){ return B - (Math.log10(E) - 2) / 4 * (B - T); }
      for (var pw = 2; pw <= 6; pw++){
        var y = Y(Math.pow(10, pw)); ctx.strokeStyle = "#e3e8ef"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
        p2text(ctx, "10" + supN(pw), L - 6, y, {size:10, color:"#5f6b7a", align:"right"});
      }
      ctx.save(); ctx.translate(11, (T + B) / 2); ctx.rotate(-PI / 2); p2text(ctx, "Eᵢ (kJ/mol)", 0, 0, {size:9.5, color:"#5f6b7a"}); ctx.restore();
      st.hover = -1;
      for (var i = 0; i < Z; i++){
        var x = L + i * sw + sw * 0.16, w = sw * 0.68, sh = shellOf(i);
        if (st.hx != null && st.hx >= L + i * sw && st.hx < L + (i + 1) * sw && i < st.out) st.hover = i;
        if (i < st.out){
          var y2 = Y(d.E[i]), col = SHC[sh];
          var gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, p2shade(col, 0.25)); gr.addColorStop(0.5, col); gr.addColorStop(1, p2shade(col, -0.35));
          ctx.fillStyle = gr; ctx.fillRect(x, y2, w, B - y2);
          ctx.fillStyle = p2shade(col, 0.5); ctx.beginPath(); ctx.moveTo(x, y2); ctx.lineTo(x + w * 0.25, y2 - 4); ctx.lineTo(x + w * 1.25 > x + sw * 0.84 + 4 ? x + w + 4 : x + w * 1.25, y2 - 4); ctx.lineTo(x + w, y2); ctx.closePath(); ctx.fill();
          if (sw > 38) p2text(ctx, p2int(d.E[i]), x + w / 2, y2 - 11, {size:9, color:"#2c3a4e"});
        } else {
          ctx.strokeStyle = "#cfd7e2"; ctx.setLineDash([3, 3]); ctx.strokeRect(x + 0.5, B - 8.5, w - 1, 8); ctx.setLineDash([]);
        }
        if (sw > 16 || i % 2 === 0) p2text(ctx, String(i + 1), x + w / 2, B + 10, {size:9.5, color:i < st.out ? "#2c3a4e" : "#a3adba"});
      }
      ctx.strokeStyle = "#a3adba"; ctx.beginPath(); ctx.moveTo(L, B + 0.5); ctx.lineTo(R, B + 0.5); ctx.stroke();
      p2text(ctx, "rang k de l'électron arraché", R, H - 5, {size:9.5, color:"#5f6b7a", align:"right"});
      /* le saut de valence */
      if (st.out > v){
        var xa = L + (v - 1) * sw + sw / 2, xb = L + v * sw + sw / 2, ya = Y(d.E[v - 1]), yb = Y(d.E[v]), ratio = d.E[v] / d.E[v - 1];
        var pulse = Math.max(0, 1 - (st.t - st.flash) / 1.5);
        var ay = sw > 38 ? 20 : 6;   /* au-dessus des étiquettes de valeur */
        ctx.save(); ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2 + 3 * pulse; ctx.beginPath(); ctx.moveTo(xa, ya - ay); ctx.quadraticCurveTo(xa, yb - ay - 16, xb - 9, yb - ay - 4); ctx.stroke(); ctx.restore();
        p2arrow(ctx, xb - 16, yb - ay - 8, xb - 4, yb - ay - 1, "#c0321d", 2);
        var lab = "saut ×" + p2fmt(ratio, 1) + " : " + v + " électron" + (v > 1 ? "s" : "") + " de valence";
        ctx.font = p2font(800, 11.5); var lw = ctx.measureText(lab).width + 14;
        var lx = Math.max(L + 2, Math.min(R - lw, xb - lw / 2)), ly = 13;
        ctx.fillStyle = "rgba(192,50,29," + (0.9 + 0.1 * pulse) + ")"; p2rr(ctx, lx, ly - 10, lw, 20, 10); ctx.fill();
        p2text(ctx, lab, lx + lw / 2, ly, {size:11.5, color:"#fff", w:800});
      } else p2text(ctx, "Énergies d'ionisation successives (échelle log)", L, 13, {size:10.5, color:"#2c3a4e", align:"left", w:800});
      if (st.hover >= 0){
        var hi = st.hover, t = "Eᵢ" + supIdx(hi + 1) + " = " + fmtE(d.E[hi]) + " kJ/mol (" + shellOf(hi) + ")";
        ctx.font = p2font(800, 10.5); var tw = ctx.measureText(t).width + 12, tx = Math.max(L, Math.min(R - tw, L + hi * sw + sw / 2 - tw / 2));
        ctx.fillStyle = "rgba(15,27,45,.92)"; p2rr(ctx, tx, T - 2, tw, 18, 9); ctx.fill(); p2text(ctx, t, tx + tw / 2, T + 7, {size:10.5, color:"#fff", w:800});
      }
    }
    k.draw(function(){
      drawScene(); drawBars();
      var d = D(), v = val(), n = st.out, shown = st.hover >= 0 ? st.hover + 1 : n;
      ro.set(0, ionName(st.el, n));
      if (shown > 0){
        var E = d.E[shown - 1];
        ro.set(1, "Eᵢ" + supIdx(shown) + " = " + fmtE(E) + " kJ/mol");
        ro.set(2, p2fmt(E / EV_KJMOL, 1) + " eV");
        ro.set(3, shown > 1 ? "×" + p2fmt(E / d.E[shown - 2], 2) : "—");
      } else { ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); }
      var tot = 0; for (var i = 0; i < n; i++) tot += d.E[i];
      ro.set(4, p2int(tot) + " kJ/mol");
      var msg;
      if (n === 0) msg = "Atome neutre de " + d.nom + " (Z = " + d.Z + ") : " + confN(d.Z) + ". Couche externe n = 3 : " + v + " électron" + (v > 1 ? "s" : "") + ". Arrache-les un par un.";
      else if (n <= v) msg = "Électron de valence arraché (couche n = 3). Eᵢ" + supIdx(n) + " = " + fmtE(d.E[n - 1]) + " kJ/mol" + (n > 1 ? ", ×" + p2fmt(d.E[n - 1] / d.E[n - 2], 2) + " par rapport au précédent : l'ion est plus chargé, l'électron suivant est un peu plus retenu." : ".") + (n < v ? " Continue." : " La couche externe est vide : que va coûter le suivant ?");
      else if (n === v + 1) msg = "Saut : Eᵢ" + supIdx(n) + " / Eᵢ" + supIdx(v) + " = " + fmtE(d.E[v]) + " / " + fmtE(d.E[v - 1]) + " = " + p2fmt(d.E[v] / d.E[v - 1], 2) + ". On attaque la couche n = 2, complète, plus proche du noyau et bien moins écrantée. " + d.nom.charAt(0).toUpperCase() + d.nom.slice(1) + " a donc " + v + " électron" + (v > 1 ? "s" : "") + " de valence : groupe " + d.g + (v <= 3 ? ", ion usuel " + ionName(st.el, v) : "") + ".";
      else if (n < d.Z - 1) msg = "Électron de la couche n = 2 : les Eᵢ continuent de croître régulièrement, jusqu'au prochain saut, quand on attaquera la couche n = 1.";
      else msg = "Couche n = 1 (1s) : Eᵢ" + supIdx(n) + " = " + fmtE(d.E[n - 1]) + " kJ/mol, encore un saut (×" + p2fmt(d.E[d.Z - 2] / d.E[d.Z - 3], 1) + " au premier électron 1s). " + (n === d.Z ? "Il ne reste que le noyau nu." : "");
      if (st.el === "Al" && n >= 2 && n <= 3) msg += " Petite marche ×3,1 entre Eᵢ₁ (3p) et Eᵢ₂ (3s) : ce n'est pas le saut de valence.";
      nt.set(msg, n === v + 1 ? "warn" : "ok");
    });
  }
});

/* =====================================================================
   3. Le puits d'énergie de la liaison (c02)
   ===================================================================== */
var NA_ = 6.02214076e23;
/* Morse : E(r) = D·[(1 − e^(−a(r − rₑ)))² − 1] ; a tiré de la raideur k = μ(2πc·ν̃)² et de D.
   He₂ : Lennard-Jones, ε = 0,0911 kJ/mol à r = 297 pm (puits de van der Waals presque nul). */
var BONDS = {
  H2:{lab:"H₂", f:"H–H", A:"H", B:"H", D:436, re:74.1, a:0.01993, nu:4401.2, ordre:1, kind:"morse"},
  HCl:{lab:"HCl", f:"H–Cl", A:"H", B:"Cl", D:431, re:127.5, a:0.01899, nu:2990.9, ordre:1, kind:"morse"},
  Cl2:{lab:"Cl₂", f:"Cl–Cl", A:"Cl", B:"Cl", D:242, re:198.8, a:0.02004, nu:559.7, ordre:1, kind:"morse"},
  N2:{lab:"N₂", f:"N≡N", A:"N", B:"N", D:945, re:109.8, a:0.02704, nu:2358.6, ordre:3, kind:"morse"},
  He2:{lab:"He₂", f:"He···He", A:"He", B:"He", D:0.0911, re:297, nu:0, ordre:0, kind:"lj"}
};
var ATM = {H:{col:"#dfe9f7", vdw:120, nuc:"#f4f7fb"}, Cl:{col:"#3fbf5f", vdw:175, nuc:"#2a8a44"}, N:{col:"#3d6fe0", vdw:155, nuc:"#2a4fb0"}, He:{col:"#f08fc0", vdw:140, nuc:"#c45a92"}};
/* énergie (kJ/mol), parts répulsive et attractive, et force (kJ/mol/pm, > 0 : répulsion) */
function bondE(b, r){
  if (b.kind === "lj"){ var q = b.re / r, q6 = q * q * q * q * q * q; return {E:b.D * (q6 * q6 - 2 * q6), rep:b.D * q6 * q6, att:-2 * b.D * q6, Frep:12 * b.D * q6 * q6 / r, Fatt:-12 * b.D * q6 / r}; }
  var e1 = Math.exp(-b.a * (r - b.re)), e2 = e1 * e1;
  return {E:b.D * (e2 - 2 * e1), rep:b.D * e2, att:-2 * b.D * e1, Frep:2 * b.a * b.D * e2, Fatt:-2 * b.a * b.D * e1};
}
var KJMOLPM_NN = 1e3 / NA_ / 1e-12 * 1e9;   /* 1 kJ/mol/pm = 1,66 nN */

SFA.sim({
  id:"ch-puits-liaison", ch:"c02", tag:"Liaison",
  titre:"Deux atomes qui s'approchent : le puits d'énergie de la liaison",
  resume:"Fais glisser un atome vers l'autre : la courbe E(r) se trace en direct, avec les forces d'attraction et de répulsion. Profondeur du puits = énergie de liaison, position du fond = longueur de liaison. Compare H₂, HCl, Cl₂, N₂ et He₂.",
  but:"Attrape l'atome de droite (ou le point sur la courbe) et rapproche-le de l'autre : lis l'énergie E(r) et regarde les flèches (vert : attraction noyaux-électrons, rouge : répulsion). Lâche-le : il oscille dans le puits (au ralenti). Avec « La molécule évacue son surplus d'énergie », elle se stabilise au fond : la liaison est formée. Sans, l'atome rebondit et repart. Change de molécule et active « Comparer » pour voir les cinq courbes ensemble.",
  aRetenir:"L'énergie potentielle de deux atomes passe par un minimum : à grande distance, l'attraction entre chaque noyau et les électrons de l'autre domine ; de trop près, la répulsion entre noyaux (et entre nuages électroniques) l'emporte. Le fond du puits donne la longueur de liaison rₑ (force nulle) et sa profondeur l'énergie de liaison (énergie à fournir pour séparer les atomes). Une liaison multiple est plus courte et plus forte : N≡N 110 pm et 945 kJ/mol, contre Cl–Cl 199 pm et 242 kJ/mol. Former une liaison libère cette énergie. Deux atomes d'hélium (ordre de liaison 0) n'ont pas de vrai puits : He₂ n'existe pas comme molécule stable.",
  piege:"Au fond du puits, la force est nulle mais l'énergie n'est pas nulle : elle est minimale (négative). Le zéro d'énergie, c'est les atomes séparés. Deux atomes qui se rencontrent ne restent pas liés tout seuls : sans moyen d'évacuer l'énergie libérée (choc avec une troisième particule, émission de lumière), ils rebondissent. En toute rigueur, la molécule vibre même au fond du puits (énergie de point zéro) : l'énergie de dissociation mesurée est un peu plus petite que la profondeur (ici, on prend la profondeur égale à l'énergie de liaison tabulée).",
  build:function(k, S){
    var c = p2canvas(k, 0.66, 0.95), g = k.canvas(250);
    var st = {t:0, r:0, v:0, auto:true, phase:"in", hold:0, drag:null, mol:"H2"};
    var mS = k.seg("Molécule", Object.keys(BONDS).map(function(x){ return [x, BONDS[x].lab]; }), "H2", function(v){ st.mol = v; restart(); });
    var dT = k.toggle("La molécule évacue son surplus d'énergie", true);
    var fT = k.toggle("Montrer les contributions attractive et répulsive", true);
    var cT = k.toggle("Comparer les cinq molécules", false);
    k.button("Relancer l'approche", function(){ st.auto = true; restart(); }, true);
    var ro = k.readouts(["Distance r", "Énergie E(r)", "Force entre les atomes", "Longueur de liaison rₑ", "Énergie de liaison"]);
    var nt = k.note("", "ok");
    function B(){ return BONDS[st.mol]; }
    function rMax(b){ return b.kind === "lj" ? 560 : Math.max(300, b.re * 3.2); }
    function rMin(b){ return b.kind === "lj" ? 200 : b.re * 0.55; }
    function restart(){ var b = B(); st.r = rMax(b) * 0.97; st.v = -rMax(b) * 0.28; st.phase = "in"; st.hold = 0; st.trail = []; }
    restart();
    /* ---------- dynamique au ralenti : masse fictive pour une période d'environ 1,6 s ---------- */
    function mass(b){ var kk = b.kind === "lj" ? 72 * b.D / (b.re * b.re) * 2000 : 2 * b.a * b.a * b.D; return kk * Math.pow(1.6 / (2 * PI), 2); }
    var lp = k.loop(function(dt){
      st.t += dt; var b = B();
      if (!st.drag){
        var m = mass(b), n = 8, h = dt / n;
        for (var i = 0; i < n; i++){
          var F = bondE(b, st.r), acc = (F.Frep + F.Fatt) / m;
          if (dT.value && st.r < rMax(b) * 0.9) acc -= 1.4 * st.v;   /* évacuation de l'énergie (amortissement) */
          st.v += acc * h; st.r += st.v * h;
          if (st.r < rMin(b) * 0.85){ st.r = rMin(b) * 0.85; st.v = Math.abs(st.v); }
        }
        if (st.auto){
          var settled = Math.abs(st.r - (b.kind === "lj" ? 0 : b.re)) < 1 && Math.abs(st.v) < 3;
          if (settled || st.r > rMax(b) * 1.02) st.hold += dt; else st.hold = 0;
          if (st.hold > (settled ? 3 : 0.8)) restart();
        } else if (st.r > rMax(b) * 1.05){ st.r = rMax(b) * 1.05; st.v = 0; }
      }
      st.trail = st.trail || []; st.trail.push(st.r); if (st.trail.length > 90) st.trail.shift();
      k.redraw();
    });
    lp.play();
    /* ---------- souris : attraper l'atome de droite, ou le point sur la courbe ---------- */
    var SC = {}, GR = {};
    c.pointer(function(type, p){
      var b = B();
      if (type === "down"){ var xb = SC.x0 + st.r * SC.k; if (Math.abs(p.x - xb) < Math.max(30, ATM[b.B].vdw * SC.k * 0.5) && Math.abs(p.y - SC.y) < 70){ st.drag = "c"; st.auto = false; st.v = 0; } }
      if (type === "drag" && st.drag === "c"){ st.r = Math.max(rMin(b) * 0.85, Math.min(rMax(b), (p.x - SC.x0) / SC.k)); st.v = 0; }
      if (type === "move") c.cv.style.cursor = Math.abs(p.x - (SC.x0 + st.r * SC.k)) < 40 && Math.abs(p.y - SC.y) < 70 ? "grab" : "default";
      if (type === "up") st.drag = null;
    });
    g.pointer(function(type, p){
      var b = B();
      if (type === "down" && GR.X && Math.abs(p.x - GR.X(st.r)) < 26){ st.drag = "g"; st.auto = false; st.v = 0; }
      if (type === "drag" && st.drag === "g"){ st.r = Math.max(rMin(b) * 0.85, Math.min(rMax(b), GR.ix(p.x))); st.v = 0; }
      if (type === "up") st.drag = null;
    });
    /* ---------- la scène ---------- */
    function cloud(ctx, x, y, R, col, a){
      var gg = ctx.createRadialGradient(x - R * 0.25, y - R * 0.3, R * 0.05, x, y, R);
      gg.addColorStop(0, p2rgba(col, 0.55 * a)); gg.addColorStop(0.45, p2rgba(col, 0.3 * a)); gg.addColorStop(1, p2rgba(col, 0));
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
    }
    function drawScene(){
      var ctx = c.ctx, W = c.W, H = c.H, b = B(), ph = W < 480, A = ATM[b.A], Bt = ATM[b.B];
      c.clear();
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0c1424"); bg.addColorStop(0.7, "#1a2740"); bg.addColorStop(1, "#0a0f1a");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* sol brillant en perspective */
      var yF = H * 0.78;
      ctx.save(); ctx.strokeStyle = "rgba(120,160,220,.10)"; ctx.lineWidth = 1;
      for (var i = -12; i <= 12; i++){ ctx.beginPath(); ctx.moveTo(W / 2 + i * 40, yF); ctx.lineTo(W / 2 + i * 120, H); ctx.stroke(); }
      for (var j = 0; j < 5; j++){ var yy = yF + (H - yF) * Math.pow(j / 5, 1.6); ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      ctx.restore();
      /* échelle : rMax tient dans 72 % de la largeur */
      var rM = rMax(b), x0 = W * (ph ? 0.2 : 0.18), kpx = (W * 0.74) / rM, y = H * 0.44;
      SC = {x0:x0, k:kpx, y:y};
      var xA = x0, xB = x0 + st.r * kpx, RA = A.vdw * kpx * 0.78, RB = Bt.vdw * kpx * 0.78;
      var sc = Math.min(1, (ph ? 80 : 110) / Math.max(RA, RB)); RA *= sc; RB *= sc;   /* nuages plafonnés à l'écran */
      /* ombres au sol */
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.beginPath(); ctx.ellipse(xA, yF + 10, RA * 0.6, 8, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(xB, yF + 10, RB * 0.6, 8, 0, 0, 7); ctx.fill(); ctx.restore();
      /* nuages électroniques (superposition additive : la densité grandit entre les noyaux) */
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      cloud(ctx, xA, y, RA, A.col, 1); cloud(ctx, xB, y, RB, Bt.col, 1);
      var E = bondE(b, st.r);
      if (b.kind === "morse"){
        var ov = Math.exp(-Math.pow((st.r - b.re) / (b.re * 0.45), 2));
        if (ov > 0.02){ var mx = (xA + xB) / 2, gg = ctx.createRadialGradient(mx, y, 1, mx, y, (xB - xA) * 0.6 + 12); gg.addColorStop(0, "rgba(255,240,170," + 0.55 * ov + ")"); gg.addColorStop(1, "rgba(255,240,170,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(mx, y, (xB - xA) * 0.6 + 12, 26 + 10 * b.ordre, 0, 0, 7); ctx.fill(); }
      } else if (E.E > 2){
        var mx2 = (xA + xB) / 2, a2 = Math.min(0.6, E.E / 60), g2 = ctx.createRadialGradient(mx2, y, 1, mx2, y, 40); g2.addColorStop(0, "rgba(255,80,60," + a2 + ")"); g2.addColorStop(1, "rgba(255,80,60,0)"); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(mx2, y, 40, 0, 7); ctx.fill();
      }
      ctx.restore();
      /* noyaux */
      p2ball(ctx, xA, y, ph ? 8 : 10, A.nuc); p2ball(ctx, xB, y, ph ? 8 : 10, Bt.nuc);
      p2text(ctx, b.A, xA, y - RA * 0.55 - 6, {size:ph ? 13 : 15, color:"#fff", w:800}); p2text(ctx, b.B, xB, y - RB * 0.55 - 6, {size:ph ? 13 : 15, color:"#fff", w:800});
      /* flèches des forces (longueur bornée, sens réel) */
      function L(F){ return (ph ? 52 : 70) * Math.tanh(Math.sqrt(Math.abs(F) / (b.kind === "lj" ? 0.6 : b.a * b.D))); }
      if (fT.value){
        var la = L(E.Fatt), lr = L(E.Frep), yo = 18;
        p2arrow(ctx, xB, y + yo, xB - la, y + yo, "#3ddc84", 3); p2arrow(ctx, xA, y + yo, xA + la, y + yo, "#3ddc84", 3);
        p2arrow(ctx, xB, y - yo, xB + lr, y - yo, "#ff5e4d", 3); p2arrow(ctx, xA, y - yo, xA - lr, y - yo, "#ff5e4d", 3);
      }
      var Fn = E.Frep + E.Fatt, ln = L(Fn);
      if (ln > 2) p2arrow(ctx, xB, y + (fT.value ? 40 : 22), xB + (Fn > 0 ? ln : -ln), y + (fT.value ? 40 : 22), "#ffd36b", 4);
      /* règle graduée en pm */
      var ry = yF - 14, rx1 = Math.min(W - 10, x0 + rM * kpx);
      var rg = ctx.createLinearGradient(0, ry - 8, 0, ry + 10); rg.addColorStop(0, "#e9d9a6"); rg.addColorStop(1, "#b99a52");
      ctx.fillStyle = rg; p2rr(ctx, x0 - 8, ry - 8, rx1 - x0 + 16, 18, 3); ctx.fill();
      ctx.strokeStyle = "#5a4318"; ctx.lineWidth = 1; var step = rM > 450 ? 100 : 50;
      for (var rr = 0; rr <= rM + 1; rr += step / 5){ var xx = x0 + rr * kpx, big = Math.abs(rr % step) < 1e-6; ctx.beginPath(); ctx.moveTo(xx, ry - 8); ctx.lineTo(xx, ry - (big ? 0 : 4)); ctx.stroke(); if (big && (rr > 0 || true) && (!ph || rr % (step * 2) === 0)) p2text(ctx, String(rr), xx, ry + 4, {size:8.5, color:"#3a2b0c", w:800}); }
      p2text(ctx, "pm", rx1 + 4, ry - 14, {size:9, color:"#c9b27a", align:"right"});
      /* cote r */
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(xA, y + 12); ctx.lineTo(xA, ry - 10); ctx.moveTo(xB, y + 12); ctx.lineTo(xB, ry - 10); ctx.stroke(); ctx.setLineDash([]);
      if (xB - xA > 30){ p2arrow(ctx, (xA + xB) / 2, ry - 22, xA + 2, ry - 22, "#fff", 1.4); p2arrow(ctx, (xA + xB) / 2, ry - 22, xB - 2, ry - 22, "#fff", 1.4); }
      p2tag(ctx, "r = " + p2fmt(st.r, 0) + " pm", (xA + xB) / 2, ry - 34, {size:10.5, bg:"rgba(15,27,45,.8)", color:"#fff"});
      /* titre et légende */
      p2tag(ctx, b.lab + " · " + b.f, 10, 16, {align:"left", bg:"rgba(255,255,255,.12)", color:"#fff", size:ph ? 11.5 : 13});
      if (fT.value){
        var lx = W - 10;
        p2text(ctx, "répulsion", lx, 14, {size:10, color:"#ff8a7d", align:"right", w:800});
        p2text(ctx, "attraction", lx, 28, {size:10, color:"#6fe9a6", align:"right", w:800});
        p2text(ctx, "résultante", lx, 42, {size:10, color:"#ffd36b", align:"right", w:800});
      }
      if (!st.drag && !st.auto && Math.abs(st.v) < 1) p2text(ctx, "attrape l'atome de droite", W / 2, H - 10, {size:10, color:"#9fb0c6"});
    }
    /* ---------- la courbe E(r) ---------- */
    function drawGraph(){
      var ctx = g.ctx, W = g.W, H = g.H, b = B(), cmp = cT.value; g.clear();
      ctx.fillStyle = "#fbfcfe"; p2rr(ctx, 0, 0, W, H, 10); ctx.fill();
      var r0, r1, e0, e1;
      if (cmp){ r0 = 40; r1 = 400; e0 = -1050; e1 = 350; }
      else if (b.kind === "lj"){ r0 = 180; r1 = rMax(b); e0 = -60; e1 = 120; }
      else { r0 = rMin(b) * 0.8; r1 = rMax(b); e0 = -b.D * 1.18; e1 = b.D * 0.9; }
      var L = 52, R = W - 12, T = 14, Bm = H - 30;
      var X = function(r){ return L + (r - r0) / (r1 - r0) * (R - L); }, Y = function(E){ return Bm - (E - e0) / (e1 - e0) * (Bm - T); };
      GR = {X:X, ix:function(px){ return r0 + (px - L) / (R - L) * (r1 - r0); }};
      /* grille */
      function nice(span){ var raw = span / 5, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
      var sx = nice(r1 - r0), sy = nice(e1 - e0);
      ctx.lineWidth = 1;
      for (var xv = Math.ceil(r0 / sx) * sx; xv <= r1; xv += sx){ ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(X(xv), T); ctx.lineTo(X(xv), Bm); ctx.stroke(); p2text(ctx, String(Math.round(xv)), X(xv), Bm + 11, {size:9.5, color:"#5f6b7a"}); }
      for (var yv = Math.ceil(e0 / sy) * sy; yv <= e1; yv += sy){ ctx.strokeStyle = Math.abs(yv) < 1e-9 ? "#8a95a3" : "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Y(yv)); ctx.lineTo(R, Y(yv)); ctx.stroke(); p2text(ctx, p2fmt(yv, 0), L - 5, Y(yv), {size:9.5, color:"#5f6b7a", align:"right"}); }
      p2text(ctx, "r (pm)", R, H - 6, {size:9.5, color:"#5f6b7a", align:"right"});
      ctx.save(); ctx.translate(11, (T + Bm) / 2); ctx.rotate(-PI / 2); p2text(ctx, "E (kJ/mol)", 0, 0, {size:9.5, color:"#5f6b7a"}); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(L, T, R - L, Bm - T); ctx.clip();
      function curve(bb, key, col, w, dash){
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); var first = true;
        for (var px = L; px <= R; px += 1.5){ var r = GR.ix(px); if (r <= 1) continue; var e = bondE(bb, r)[key]; var yy = Y(e); if (yy < T - 400) { first = true; continue; } first ? ctx.moveTo(px, yy) : ctx.lineTo(px, yy); first = false; }
        ctx.stroke(); ctx.setLineDash([]);
      }
      var CMPC = {H2:"#2f7fd1", HCl:"#1fa36b", Cl2:"#6236c4", N2:"#c26a0c", He2:"#c43a7a"};
      if (cmp){
        Object.keys(BONDS).forEach(function(kk){ curve(BONDS[kk], "E", kk === st.mol ? CMPC[kk] : p2rgba(CMPC[kk], 0.55), kk === st.mol ? 3 : 1.8); });
      } else {
        if (fT.value){ curve(b, "rep", "rgba(255,94,77,.8)", 1.6, [5, 4]); curve(b, "att", "rgba(46,170,100,.85)", 1.6, [5, 4]); }
        /* aire du puits */
        if (b.kind === "morse"){ ctx.fillStyle = "rgba(47,127,209,.07)"; ctx.beginPath(); ctx.moveTo(X(r0), Y(0)); for (var px2 = L; px2 <= R; px2 += 2){ var e2 = Math.min(0, bondE(b, GR.ix(px2)).E); ctx.lineTo(px2, Y(e2)); } ctx.lineTo(R, Y(0)); ctx.closePath(); ctx.fill(); }
        curve(b, "E", "#13233a", 2.6);
      }
      ctx.restore();
      /* repères rₑ et D */
      if (!cmp && b.kind === "morse"){
        var xe = X(b.re), ye = Y(-b.D);
        ctx.strokeStyle = "#2f7fd1"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(xe, ye); ctx.lineTo(xe, Bm); ctx.moveTo(L, ye); ctx.lineTo(xe, ye); ctx.stroke(); ctx.setLineDash([]);
        var xd = Math.min(R - 60, X(b.re * 2.1));
        p2arrow(ctx, xd, Y(0), xd, ye, "#2f7fd1", 1.6); p2arrow(ctx, xd, ye, xd, Y(0), "#2f7fd1", 1.6);
        p2text(ctx, "D = " + p2int(b.D) + " kJ/mol", xd + 6, (Y(0) + ye) / 2, {size:10.5, color:"#1f4b9e", align:"left", w:800});
        p2tag(ctx, "rₑ = " + p2fmt(b.re, 1) + " pm", xe, Bm - 10, {size:9.5, bg:"rgba(47,127,209,.14)", color:"#1f4b9e"});
      }
      if (!cmp && b.kind === "lj") p2text(ctx, "pas de puits visible : E ≥ −0,09 kJ/mol partout", R - 4, Y(-35), {size:10.5, color:"#c43a7a", align:"right", w:800});
      if (cmp){
        var ly = T + 8; Object.keys(BONDS).forEach(function(kk){ ctx.fillStyle = CMPC[kk]; ctx.fillRect(R - 70, ly - 2, 14, 4); p2text(ctx, BONDS[kk].lab, R - 52, ly, {size:10, color:"#2c3a4e", align:"left", w:kk === st.mol ? 800 : 600}); ly += 14; });
      }
      /* traînée et point courant */
      if (st.r >= r0 && st.r <= r1){
        (st.trail || []).forEach(function(r, i, arr){ if (r < r0 || r > r1) return; ctx.fillStyle = "rgba(255,160,40," + (i / arr.length * 0.4) + ")"; ctx.beginPath(); ctx.arc(X(r), Math.max(T, Y(bondE(b, r).E)), 2.5, 0, 7); ctx.fill(); });
        var yc = Y(bondE(b, st.r).E), cl = Math.max(T, Math.min(Bm, yc));
        p2ball(ctx, X(st.r), cl, 7.5, "#ff9f1c");
        if (yc < T) p2text(ctx, "↑ hors du cadre", X(st.r) + 10, T + 8, {size:9.5, color:"#c0321d", align:"left"});
      }
      if (fT.value && !cmp){
        [["#d9402f", "partie répulsive"], ["#24875a", "partie attractive"], ["#13233a", "E(r) totale"]].forEach(function(it, i){
          var yy = T + 8 + i * 14; ctx.strokeStyle = it[0]; ctx.lineWidth = 2; ctx.setLineDash(i < 2 ? [4, 3] : []); ctx.beginPath(); ctx.moveTo(R - 118, yy); ctx.lineTo(R - 100, yy); ctx.stroke(); ctx.setLineDash([]);
          p2text(ctx, it[1], R - 95, yy, {size:9.5, color:it[0], align:"left", w:800});
        });
      }
    }
    k.draw(function(){
      drawScene(); drawGraph();
      var b = B(), E = bondE(b, st.r), F = E.Frep + E.Fatt, Fn = F * KJMOLPM_NN;
      ro.set(0, p2fmt(st.r, 1) + " pm");
      ro.set(1, (b.kind === "lj" && Math.abs(E.E) < 1 ? p2fmt(E.E, 3) : p2fmt(E.E, 1)) + " kJ/mol");
      ro.set(2, Math.abs(Fn) < 0.005 ? "≈ 0 (équilibre)" : (F > 0 ? "répulsion " : "attraction ") + p2fmt(Math.abs(Fn), Math.abs(Fn) < 0.1 ? 3 : 2) + " nN");
      ro.set(3, b.kind === "lj" ? "pas de liaison" : p2fmt(b.re, 1) + " pm");
      ro.set(4, b.kind === "lj" ? "≈ 0 (0,09 kJ/mol)" : p2int(b.D) + " kJ/mol");
      var msg;
      if (b.kind === "lj") msg = "He₂ : deux atomes à couche complète. Ordre de liaison (2 − 2)/2 = 0 : pas de liaison covalente. Il reste une attraction de van der Waals minuscule (0,09 kJ/mol à 297 pm, 5 000 fois moins que H₂), bien plus faible que l'agitation thermique à 25 °C (RT = 2,5 kJ/mol) : les atomes rebondissent.";
      else {
        var zone = Math.abs(st.r - b.re) < 1.5 ? "Au fond du puits : r = rₑ, la force s'annule et l'énergie est minimale (−" + p2int(b.D) + " kJ/mol)." : st.r < b.re ? "Plus court que rₑ : la répulsion l'emporte, l'énergie remonte très vite (mur de gauche)." : "Plus long que rₑ : l'attraction l'emporte et ramène les atomes ; à grande distance E → 0.";
        msg = zone + " " + b.f + " : liaison d'ordre " + b.ordre + ", rₑ = " + p2fmt(b.re, 1) + " pm, D = " + p2int(b.D) + " kJ/mol. Vibration réelle : période 1/(c·ν̃) = " + p2fmt(1e15 / (2.99792458e10 * b.nu), 1) + " fs ; l'animation est au ralenti.";
      }
      nt.set(msg, "ok");
    });
  }
});

/* =====================================================================
   4. Orbitales hybrides en 3D (c02)
   ===================================================================== */
function v3(x, y, z){ return [x, y, z]; }
function vadd(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function vmul(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function vdot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vcross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function vlen(a){ return Math.sqrt(vdot(a, a)); }
function vnrm(a){ var l = vlen(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
var Y00 = 0.5 / Math.sqrt(PI), YP = Math.sqrt(3 / (4 * PI));
var R3 = 1 / Math.sqrt(3), TET = [vnrm([1, 1, 1]), vnrm([1, -1, -1]), vnrm([-1, 1, -1]), vnrm([-1, -1, 1])];
/* une orbitale = {cs, cv} : coefficient de s et vecteur des coefficients (px, py, pz) */
var X_ = [1, 0, 0], Y_ = [0, 1, 0], Z_ = [0, 0, 1];
function orb(cs, cv){ return {cs:cs, cv:cv}; }
/* départ (s et p, avec le signe de p tourné vers la cible) et arrivée (hybrides) */
var HYB = {
  sp3:{lab:"sp³", n:4, ang:Math.acos(-1 / 3) * 180 / PI, pct:25, mol:"CH₄", pair:[1, 2],
    from:[orb(1, [0, 0, 0]), orb(0, X_), orb(0, Y_), orb(0, Z_)],
    to:TET.map(function(d){ return orb(0.5, vmul(d, Math.sqrt(3) / 2)); })},
  sp2:{lab:"sp²", n:3, ang:120, pct:100 / 3, mol:"C₂H₄", pair:[1, 2],
    from:[orb(1, [0, 0, 0]), orb(0, [-1, 0, 0]), orb(0, [0, -1, 0]), orb(0, Z_)],
    to:[orb(R3, vmul(X_, Math.sqrt(2 / 3))), orb(R3, vmul([-0.5, Math.sqrt(3) / 2, 0], Math.sqrt(2 / 3))), orb(R3, vmul([-0.5, -Math.sqrt(3) / 2, 0], Math.sqrt(2 / 3))), orb(0, Z_)]},
  sp:{lab:"sp", n:2, ang:180, pct:50, mol:"C₂H₂", pair:[0, 1],
    from:[orb(1, [0, 0, 0]), orb(0, [-1, 0, 0]), orb(0, Y_), orb(0, Z_)],
    to:[orb(Math.SQRT1_2, vmul(X_, Math.SQRT1_2)), orb(Math.SQRT1_2, vmul(X_, -Math.SQRT1_2)), orb(0, Y_), orb(0, Z_)]}
};
/* mélange linéaire puis normalisation */
function mixOrb(a, b, t){
  var cs = (1 - t) * a.cs + t * b.cs, cv = vadd(vmul(a.cv, 1 - t), vmul(b.cv, t)), n = Math.sqrt(cs * cs + vdot(cv, cv)) || 1;
  return orb(cs / n, vmul(cv, 1 / n));
}
/* direction du grand lobe (ou de l'axe pour une p pure) */
function bigDir(o){ var l = vlen(o.cv); if (l < 0.05) return null; return vmul(o.cv, (o.cs < 0 ? -1 : 1) / l); }
function sChar(o){ return o.cs * o.cs / (o.cs * o.cs + vdot(o.cv, o.cv)); }
/* surface de l'orbitale (forme stylisée) autour de l'axe de cv : f(θ) = A + B·cos θ (parts s et p de la partie angulaire) ;
   lobe de signe f, longueur ∝ (max |f| du lobe)^1,5, profil effilé (|f| / max)^5 */
function orbMesh(o, P, K, nt, np){
  var l = vlen(o.cv), u = l > 1e-6 ? vmul(o.cv, 1 / l) : [0, 1, 0], A = o.cs * Y00, Bc = l * YP;
  var e1 = Math.abs(u[0]) < 0.9 ? vnrm(vcross(u, X_)) : vnrm(vcross(u, Y_)), e2 = vcross(u, e1);
  var pts = [], sg = [], fp = A + Bc, fn = Math.max(0, Bc - A), fm = Math.max(fp, Math.abs(A - Bc));
  for (var i = 0; i <= nt; i++){
    /* chaque lobe : longueur ∝ (|f| max du lobe)^1,5, profil effilé (|f|/f max)^5 */
    var th = i / nt * PI, ct = Math.cos(th), sn = Math.sin(th), f = A + Bc * ct, fl = f >= 0 ? fp : Math.max(fn, Math.abs(A - Bc), 1e-9);
    var r = Math.sqrt(fm) * Math.pow(fl / fm, 1.5) * Math.pow(Math.min(1, Math.abs(f) / fl), 5) * K, row = [];
    sg.push(f >= 0 ? 1 : -1);
    for (var j = 0; j < np; j++){
      var ph = j / np * 2 * PI, dir = vadd(vmul(u, ct), vmul(vadd(vmul(e1, Math.cos(ph)), vmul(e2, Math.sin(ph))), sn));
      row.push(vadd(P, vmul(dir, r)));
    }
    pts.push(row);
  }
  return {pts:pts, sg:sg, nt:nt, np:np};
}
var PHC = {"1":"#3d7be0", "-1":"#e8812a"};

SFA.sim({
  id:"ch-hybridation-3d", ch:"c02", tag:"Hybridation",
  titre:"Mélanger s et p : les orbitales hybrides en 3D",
  resume:"Une orbitale s et des orbitales p se fondent, sous un curseur de mélange, en lobes hybrides sp³ (tétraèdre), sp² (triangle plan + une p restante) ou sp (ligne + deux p). Tourne la vue et pose le résultat sur CH₄, C₂H₄ ou C₂H₂.",
  but:"Choisis sp³, sp² ou sp, puis fais glisser le curseur « Mélange » de 0 à 100 % (ou laisse l'animation) : la sphère s et les haltères p se transforment en lobes hybrides. Glisse sur la scène pour tourner la vue. Lis l'angle entre les lobes et leur caractère s. Puis choisis « Sur la molécule » : les hybrides du carbone pointent vers les H et l'autre C (liaisons σ), les p restantes, parallèles, forment les liaisons π.",
  aRetenir:"Mélanger 1 orbitale s avec n orbitales p donne n + 1 orbitales hybrides équivalentes (le nombre d'orbitales se conserve). sp³ : 4 lobes à 109,5° (tétraèdre), 25 % de caractère s, ex. CH₄. sp² : 3 lobes plans à 120°, 33 % de s, une p pure perpendiculaire au plan, ex. C₂H₄. sp : 2 lobes à 180°, 50 % de s, deux p pures, ex. C₂H₂. Les hybrides forment les liaisons σ (recouvrement dans l'axe) ; les p restantes forment les liaisons π (recouvrement latéral). Plus de caractère s → lobe plus court, électrons plus près du noyau : la liaison C–H mesure 106 pm dans l'éthyne (sp) contre 109 pm dans le méthane (sp³).",
  piege:"Un carbone sp² n'a pas « trois orbitales et demie » : il a 3 hybrides sp² + 1 p (4 orbitales en tout, comme au départ). La couleur des lobes est le signe de la fonction d'onde, pas une charge. Et l'hybridation est un modèle pour décrire une géométrie connue (VSEPR, mesures) : ce n'est pas l'atome qui « décide » de s'hybrider avant de se lier.",
  build:function(k, S){
    var c = p2canvas(k, 0.8, 1.08);
    var st = {a:0.62, b:0.42, t:0, mt:0, auto:true, spin:true, ph:0};
    var hS = k.seg("Hybridation", [["sp3", "sp³"], ["sp2", "sp²"], ["sp", "sp"]], "sp3", function(){ st.mt = 0; st.ph = 0; });
    var vS = k.seg("Afficher", [["atome", "Atome seul (mélange)"], ["mol", "Sur la molécule"]], "atome", function(v){ st.ms = 0; st.b = v === "mol" ? 0.45 : 0.42; st.a = v === "mol" ? 0.4 : 0.62; });
    var mS = k.slider("Mélange s + p", 0, 100, 1, 0, "%", function(){ st.auto = false; aT.set(false); });
    var aT = k.toggle("Animer le mélange", true, function(v){ st.auto = v; });
    var sT = k.toggle("Rotation automatique", true, function(v){ st.spin = v; });
    var ro = k.readouts(["Orbitales", "Angle entre les lobes", "Caractère s des lobes", "Exemple"]);
    var nt = k.note("", "ok");
    function box(o){ return (o.el || o).closest ? (o.el || o).closest(".ctl") : null; }
    var ctls = Array.prototype.slice.call(k.ctrl.querySelectorAll(".ctl")), aBox = ctls[3];
    /* vue : glisser pour tourner */
    c.pointer(function(type, p){
      if (type === "down"){ st.lx = p.x; st.ly = p.y; st.drag = true; }
      if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.011; st.b = Math.max(-1.45, Math.min(1.45, st.b + (p.y - st.ly) * 0.011)); st.lx = p.x; st.ly = p.y; if (st.spin){ st.spin = false; sT.set(false); } }
      if (type === "up"){ st.lx = null; st.drag = false; }
    });
    c.cv.style.cursor = "grab";
    var lp = k.loop(function(dt){
      st.t += dt;
      if (st.spin && !st.drag){ if (vS.value === "mol"){ st.ms = (st.ms || 0) + dt; st.a = 0.4 + 0.75 * Math.sin(st.ms * 0.45); } else st.a += dt * 0.32; }
      if (st.auto && vS.value === "atome"){
        /* aller-retour : 1 s en s + p, 3 s de mélange, 2 s en hybrides, 3 s de retour */
        st.ph = (st.ph + dt) % 9; var q = st.ph, m;
        m = q < 1 ? 0 : q < 4 ? (q - 1) / 3 : q < 6 ? 1 : (9 - q) / 3;
        m = m * m * (3 - 2 * m); mS.set(Math.round(m * 1000) / 10);
      }
      k.redraw();
    });
    lp.play();
    /* ---------- projection ---------- */
    var P3 = {};
    function prj(p){
      var ca = Math.cos(st.a), sa = Math.sin(st.a), cb = Math.cos(st.b), sb = Math.sin(st.b);
      var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1];
      var y2 = y * cb - z * sb, z2 = y * sb + z * cb, s = 1 / (1 - z2 * P3.per);
      return [P3.cx + x * P3.sc * s, P3.cy - y2 * P3.sc * s, z2, x, y2];
    }
    var LIGHT = vnrm([-0.45, 0.6, 0.65]);
    /* ajoute les facettes d'une orbitale à la liste (tri par profondeur ensuite) */
    function addOrb(list, mesh, alpha, cOver){
      var pr = mesh.pts.map(function(row){ return row.map(prj); });
      for (var i = 0; i < mesh.nt; i++) for (var j = 0; j < mesh.np; j++){
        var j2 = (j + 1) % mesh.np, a = pr[i][j], b = pr[i + 1][j], cc = pr[i + 1][j2], d = pr[i][j2];
        /* normale dans l'espace de l'écran */
        var ux = cc[3] - a[3], uy = cc[4] - a[4], uz = cc[2] - a[2], vx = d[3] - b[3], vy = d[4] - b[4], vz = d[2] - b[2];
        var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz);
        if (nl < 1e-9) continue;
        nx /= nl; ny /= nl; nz /= nl;
        /* éclairage symétrique (la surface peut être vue des deux côtés) */
        var lam = Math.abs(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]), sh = 0.3 + 0.7 * lam;
        var spec = Math.pow(lam, 24) * 0.55;
        list.push({z:(a[2] + b[2] + cc[2] + d[2]) / 4, q:[a, b, cc, d], col:cOver || PHC[mesh.sg[i]], sh:sh, sp:spec, al:alpha});
      }
    }
    function addBall(list, P, r, hex){ var q = prj(P); list.push({z:q[2] + 0.001, ball:true, x:q[0], y:q[1], r:r * P3.sc, col:hex}); }
    function paint(ctx, list){
      list.sort(function(a, b){ return a.z - b.z; });
      list.forEach(function(it){
        if (it.ball){ p2ball(ctx, it.x, it.y, it.r, it.col); return; }
        if (it.line){ ctx.strokeStyle = it.col; ctx.lineWidth = it.w; ctx.beginPath(); ctx.moveTo(it.p[0], it.p[1]); ctx.lineTo(it.q2[0], it.q2[1]); ctx.stroke(); return; }
        var col = p2shade(it.col, -(1 - it.sh) * 0.75);
        if (it.sp > 0.02) col = p2shade(it.col, Math.min(0.85, it.sp + 0.1));
        ctx.globalAlpha = it.al; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(it.q[0][0], it.q[0][1]); ctx.lineTo(it.q[1][0], it.q[1][1]); ctx.lineTo(it.q[2][0], it.q[2][1]); ctx.lineTo(it.q[3][0], it.q[3][1]); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }
    /* ---------- géométrie des molécules (Å) ---------- */
    function molecule(h){
      var M = {C:[], H:[], orbs:[], bonds:[]};
      if (h === "sp3"){
        M.C.push([0, 0, 0]);
        TET.forEach(function(d, i){ M.H.push(vmul(d, 1.09)); M.orbs.push({o:HYB.sp3.to[i], P:[0, 0, 0]}); M.bonds.push([[0, 0, 0], vmul(d, 1.09), "σ"]); });
      } else if (h === "sp2"){
        [-1, 1].forEach(function(sg){
          var C = [0.67 * sg, 0, 0]; M.C.push(C);
          HYB.sp2.to.forEach(function(o, i){
            var oo = i < 3 ? orb(o.cs, [o.cv[0] * -sg, o.cv[1], o.cv[2]]) : o;   /* le C de gauche pointe son premier hybride vers +x */
            M.orbs.push({o:oo, P:C, pi:i === 3});
            if (i === 1 || i === 2){ var d = vnrm([oo.cv[0], oo.cv[1], oo.cv[2]]); var Hp = vadd(C, vmul(d, 1.087)); M.H.push(Hp); M.bonds.push([C, Hp, "σ"]); }
          });
        });
        M.bonds.push([[-0.67, 0, 0], [0.67, 0, 0], "σ + π"]);
      } else {
        [-1, 1].forEach(function(sg){
          var C = [0.6 * sg, 0, 0]; M.C.push(C);
          HYB.sp.to.forEach(function(o, i){
            var oo = i < 2 ? orb(o.cs, [o.cv[0] * -sg, 0, 0]) : o;
            M.orbs.push({o:oo, P:C, pi:i >= 2});
          });
          var Hp = [sg * (0.6 + 1.06), 0, 0]; M.H.push(Hp); M.bonds.push([C, Hp, "σ"]);
        });
        M.bonds.push([[-0.6, 0, 0], [0.6, 0, 0], "σ + 2 π"]);
      }
      /* plan moléculaire horizontal (xz), orbitales π verticales : (x, y, z) → (x, z, −y) */
      function T(v){ return [v[0], v[2], -v[1]]; }
      if (h !== "sp3"){
        M.C = M.C.map(T); M.H = M.H.map(T);
        M.orbs.forEach(function(it){ it.P = T(it.P); it.o = orb(it.o.cs, T(it.o.cv)); });
        M.bonds = M.bonds.map(function(b){ return [T(b[0]), T(b[1]), b[2]]; });
      }
      return M;
    }
    function draw(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = W < 480, h = hS.value, D = HYB[h], mol = vS.value === "mol", t = mS.value / 100;
      box(mS).style.display = aBox.style.display = mol ? "none" : "";
      c.clear();
      /* décor : studio sombre, sol réfléchissant */
      var bg = ctx.createRadialGradient(W * 0.5, H * 0.42, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      bg.addColorStop(0, "#26344f"); bg.addColorStop(1, "#080c16"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.9, W * 0.3, H * 0.035, 0, 0, 7); ctx.fill(); ctx.restore();
      var list = [];
      if (!mol){
        P3 = {cx:W / 2, cy:H * (ph ? 0.4 : 0.47), sc:Math.min(W, H) * (ph ? 0.47 : 0.52), per:0.12};
        /* axes x, y, z */
        [[X_, "x"], [Y_, "y"], [Z_, "z"]].forEach(function(ax){
          var a = prj(vmul(ax[0], -0.5)), b = prj(vmul(ax[0], 0.5));
          list.push({z:-0.6, line:true, p:a, q2:b, col:"rgba(190,205,230,.22)", w:1});
          list.push({z:-0.6, line:true, p:b, q2:b, col:"rgba(0,0,0,0)", w:0});
          var lb = prj(vmul(ax[0], 0.55)); st["ax" + ax[1]] = lb;
        });
        var cur = D.from.map(function(o, i){ return mixOrb(o, D.to[i], t); });
        cur.forEach(function(o){ addOrb(list, orbMesh(o, [0, 0, 0], 1, ph ? 20 : 26, ph ? 14 : 18), 0.9); });
        addBall(list, [0, 0, 0], 0.022, "#3a4252");
        paint(ctx, list);
        ["x", "y", "z"].forEach(function(n){ var q = st["ax" + n]; p2text(ctx, n, q[0], q[1], {size:12, color:"rgba(200,215,240,.7)", w:800}); });
        /* angle entre deux lobes quand le mélange est fini */
        var i1 = D.pair[0], i2 = D.pair[1], d1 = bigDir(cur[i1]), d2 = bigDir(cur[i2]), ang = null;
        if (d1 && d2){ ang = Math.acos(Math.max(-1, Math.min(1, vdot(d1, d2)))) * 180 / PI; }
        if (d1 && d2 && t > 0.999 && h !== "sp"){
          ctx.strokeStyle = "#ffd36b"; ctx.lineWidth = 2.2; ctx.beginPath();
          for (var q = 0; q <= 30; q++){ var w = q / 30, dd = vnrm(vadd(vmul(d1, 1 - w), vmul(d2, w))), pp = prj(vmul(dd, 0.3)); q ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]); }
          ctx.stroke();
          var pm = prj(vmul(vnrm(vadd(d1, d2)), 0.36)); p2tag(ctx, p2fmt(ang, 1).replace(",0", "") + "°", pm[0], pm[1], {size:12, bg:"rgba(255,211,107,.95)", color:"#241a00"});
        }
        st.ang = ang; st.cur = cur;
        /* titre */
        var lab = t < 0.005 ? "1 s + 3 p (non mélangées)" : t > 0.999 ? D.n + " × " + D.lab + (D.n < 4 ? " + " + (4 - D.n) + " p" : "") : "mélange " + Math.round(t * 100) + " % → " + D.lab;
        p2tag(ctx, lab, 10, 16, {align:"left", bg:"rgba(255,255,255,.12)", color:"#fff", size:ph ? 11.5 : 13});
        energyBox(ctx, W, H, ph, h, t);
      } else {
        P3 = {cx:W / 2, cy:H * 0.46, sc:Math.min(W, H) * (h === "sp3" ? 0.3 : h === "sp2" ? 0.27 : 0.27) * (ph ? 0.92 : 1), per:0.06};
        var M = molecule(h), K = 1.25;
        M.orbs.forEach(function(it){ addOrb(list, orbMesh(it.o, it.P, it.pi ? K * 0.95 : K, ph ? 14 : 18, ph ? 12 : 14), it.pi ? 0.62 : 0.7); });
        M.H.forEach(function(Hp){ addOrb(list, orbMesh(orb(1, [0, 0, 0]), Hp, 0.62, 10, 12), 0.9, "#cfe0f5"); });
        M.C.forEach(function(Cp){ addBall(list, Cp, 0.17, "#4a5568"); });
        M.H.forEach(function(Hp){ addBall(list, Hp, 0.11, "#f2f5f9"); });
        paint(ctx, list);
        /* étiquettes σ / π */
        M.bonds.forEach(function(bd){ var m = prj(vmul(vadd(bd[0], bd[1]), 0.5)); p2tag(ctx, bd[2], m[0], m[1] + (bd[2].length > 1 ? -18 : 14), {size:11, bg:"rgba(15,27,45,.78)", color:"#fff"}); });
        p2tag(ctx, D.mol + " : carbone " + D.lab, 10, 16, {align:"left", bg:"rgba(255,255,255,.12)", color:"#fff", size:ph ? 11.5 : 13});
        if (h !== "sp3") p2text(ctx, h === "sp2" ? "p restantes (π) : lobes parallèles au-dessus et au-dessous du plan" : "2 paires de p restantes (π), perpendiculaires entre elles", W / 2, H - 14, {size:ph ? 9.5 : 10.5, color:"#b8c6da"});
      }
      if (!ph || mol) p2text(ctx, "glisse pour tourner", W - 10, 16, {size:10, color:"#7f8ea5", align:"right"});
      /* légende des signes */
      var ly = mol ? H - 34 : 40;
      if (!mol){ p2ball(ctx, W - 92, ly, 5, PHC["1"]); p2text(ctx, "ψ > 0", W - 82, ly, {size:10, color:"#b8c6da", align:"left"}); p2ball(ctx, W - 46, ly, 5, PHC["-1"]); p2text(ctx, "ψ < 0", W - 36, ly, {size:10, color:"#b8c6da", align:"left"}); }
    }
    /* petit diagramme d'énergie : 2s et 2p qui se rejoignent en hybrides (électrons après promotion) */
    function energyBox(ctx, W, H, ph, h, t){
      var bw = ph ? 124 : 158, bh = ph ? 84 : 112, x0 = 8, y0 = H - bh - 8, n = HYB[h].n;
      ctx.save(); ctx.fillStyle = "rgba(8,13,24,.78)"; p2rr(ctx, x0, y0, bw, bh, 9); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.stroke(); ctx.restore();
      p2text(ctx, "énergie (C après promotion)", x0 + 8, y0 + 11, {size:9, color:"#9fb0c6", align:"left"});
      /* niveau hybride = moyenne pondérée de 2s (1 part) et 2p (n − 1 parts) */
      var yS = y0 + bh - 18, yP = y0 + 34, yH = (yS + yP * (n - 1)) / n;
      var bs = ph ? 15 : 18, gap = 3, xs = x0 + 12;
      for (var i = 0; i < 4; i++){
        var isS = i === 0, mixed = i < n, yOrig = isS ? yS : yP, yy = mixed ? yOrig + (yH - yOrig) * t : yP;
        var xx = xs + i * (bs + gap);
        var col = mixed && t > 0.5 ? "#7fb6ff" : "#c9d4e3";
        ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.strokeRect(xx + 0.5, yy - bs / 2 + 0.5, bs, bs);
        p2arrow(ctx, xx + bs / 2, yy + bs / 2 - 3, xx + bs / 2, yy - bs / 2 + 3, "#ffd36b", 1.6);
      }
      var lx = xs + 4 * (bs + gap) + 4;
      if (t < 0.1){ p2text(ctx, "2p", lx, yP, {size:10, color:"#c9d4e3", align:"left", w:800}); p2text(ctx, "2s", xs + bs + 6, yS, {size:10, color:"#c9d4e3", align:"left", w:800}); }
      else if (t > 0.9){ p2text(ctx, n + " × " + HYB[h].lab, xs, yH + bs / 2 + 9, {size:10, color:"#7fb6ff", align:"left", w:800}); if (n < 4) p2text(ctx, "p", lx, yP, {size:10, color:"#c9d4e3", align:"left", w:800}); }
    }
    k.draw(function(){
      draw();
      var h = hS.value, D = HYB[h], mol = vS.value === "mol", t = mS.value / 100;
      ro.set(0, (mol || t > 0.999 ? "" : t < 0.005 ? "1 s + 3 p · " : "1 s + 3 p → ") + D.n + " " + D.lab + (D.n < 4 ? " + " + (4 - D.n) + " p" : ""));
      if (mol){
        ro.set(1, p2fmt(D.ang, 1) + "°"); ro.set(2, p2fmt(D.pct, 0) + " % (chacun)");
        ro.set(3, D.mol + (h === "sp3" ? " · 4 σ" : h === "sp2" ? " · 5 σ + 1 π" : " · 3 σ + 2 π"));
        nt.set(h === "sp3" ? "CH₄ : les 4 lobes sp³ du carbone recouvrent chacun l'orbitale 1s d'un H : 4 liaisons σ C–H à 109,5°, géométrie tétraédrique." : h === "sp2" ? "C₂H₄ : chaque C utilise ses 3 hybrides sp² (σ vers 2 H et vers l'autre C, à 120°). Les deux p restantes, parallèles, se recouvrent latéralement : la liaison π. C=C = 1 σ + 1 π ; la molécule est plane et ne tourne pas autour de C=C." : "C₂H₂ : chaque C a 2 hybrides sp (σ vers H et vers l'autre C, à 180° : molécule linéaire) et 2 p perpendiculaires, qui forment 2 liaisons π. C≡C = 1 σ + 2 π.", "ok");
        return;
      }
      var cur = st.cur || [], sc = cur.slice(0, D.n).map(sChar), mn = Math.min.apply(null, sc), mx = Math.max.apply(null, sc);
      ro.set(1, t > 0.005 && t < 0.999 ? "mélange en cours" : st.ang == null ? "—" : p2fmt(st.ang, 1) + "°" + (t <= 0.005 ? " (entre deux p)" : ""));
      ro.set(2, Math.abs(mx - mn) < 0.005 ? p2fmt(mn * 100, 0) + " % (chacun)" : "de " + p2fmt(mn * 100, 0) + " à " + p2fmt(mx * 100, 0) + " %");
      ro.set(3, D.mol);
      var msg = t < 0.005 ? "Avant le mélange : une orbitale 2s (sphère) et trois 2p (haltères selon x, y et z, à 90° l'une de l'autre). Lance le mélange." :
        t > 0.999 ? D.n + " hybrides " + D.lab + " identiques, chacun avec " + p2fmt(D.pct, 0) + " % de caractère s, à " + p2fmt(D.ang, 1) + "° l'un de l'autre" + (D.n < 4 ? " ; il reste " + (4 - D.n) + " orbitale" + (4 - D.n > 1 ? "s" : "") + " p pure" + (4 - D.n > 1 ? "s" : "") + ", perpendiculaire" + (4 - D.n > 1 ? "s" : "") + " aux lobes." : ", vers les sommets d'un tétraèdre (cos θ = −1/3).") + " Le grand lobe pointe vers l'atome partenaire, le petit lobe arrière est de signe opposé." :
        "Mélange en cours : la s cède une partie d'elle-même à chaque p (et inversement). Les lobes grossissent d'un côté, rétrécissent de l'autre et s'écartent. 4 orbitales au départ, 4 à l'arrivée.";
      nt.set(msg + " <i>Surfaces : partie angulaire des orbitales (forme qualitative).</i>", "ok");
    });
  }
});

})();
