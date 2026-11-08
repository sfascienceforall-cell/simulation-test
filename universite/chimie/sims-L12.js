/* Chimie BA1 · L12 · Acides et bases — simulations SFA originales */
(function(){
function nice(x){ var p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
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
function plotAxes(S, c, o){   /* axes classiques en bas et à gauche, quelle que soit la plage */
  var ctx = c.ctx, L = o.l || 44, ax = {L:L, R:c.W - (o.r || 14), T:o.t || 22, B:c.H - (o.b || 30), x0:o.x0, x1:o.x1, y0:o.y0, y1:o.y1};
  ax.X = function(x){ return ax.L + (x - o.x0) / (o.x1 - o.x0) * (ax.R - ax.L); };
  ax.Y = function(y){ return ax.B - (y - o.y0) / (o.y1 - o.y0) * (ax.B - ax.T); };
  ctx.save(); ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1;
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (var gy = Math.ceil(o.y0 / o.sy) * o.sy; gy <= o.y1 + 1e-9; gy += o.sy){ ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(gy)); ctx.lineTo(ax.R, ax.Y(gy)); ctx.stroke(); ctx.fillText(S.fmt(gy, 3), ax.L - 6, ax.Y(gy)); }
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (var gx = Math.ceil(o.x0 / o.sx) * o.sx; gx <= o.x1 + 1e-9; gx += o.sx){ ctx.beginPath(); ctx.moveTo(ax.X(gx), ax.T); ctx.lineTo(ax.X(gx), ax.B); ctx.stroke(); ctx.fillText(S.fmt(gx, 3), ax.X(gx), ax.B + 5); }
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax.L, ax.T); ctx.lineTo(ax.L, ax.B); ctx.lineTo(ax.R, ax.B); ctx.stroke(); ctx.restore();
  if (o.yl) S.draw.text(c, o.yl, ax.L, 9, {size:11.5, color:"#2c3a4e", align:"left"});
  if (o.xl) S.draw.text(c, o.xl, ax.R, ax.B + 18, {size:11.5, color:"#2c3a4e", align:"right"});
  return ax;
}
function pHcolor(ph){   /* teinte de l'indicateur universel (approchée) */
  var st = [[0,"#d32f2f"],[2,"#ef5b2a"],[3.5,"#f59a23"],[5,"#f4d03f"],[6.5,"#9ccc3d"],[7,"#4caf50"],[8,"#26a69a"],[9.5,"#2e86c1"],[11.5,"#4b4fb8"],[14,"#6a2c91"]];
  for (var i = 1; i < st.length; i++) if (ph <= st[i][0]){
    var a = st[i - 1], b = st[i], t = (ph - a[0]) / (b[0] - a[0]);
    function h(s){ return [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)]; }
    var ca = h(a[1]), cb = h(b[1]);
    return "rgb(" + [0,1,2].map(function(j){ return Math.round(ca[j] + (cb[j] - ca[j]) * t); }).join(",") + ")";
  }
  return st[st.length - 1][1];
}
/* produits du quotidien : pH typique (valeurs approximatives, elles varient avec la composition) */
var PROD = [
  {n:"Acide de batterie (≈ 1 mol/L)", ph:0.0, lo:-0.3, hi:0.3},
  {n:"Suc gastrique", ph:1.5, lo:1.0, hi:2.0},
  {n:"Jus de citron", ph:2.2, lo:2.0, hi:2.6},
  {n:"Cola", ph:2.5, lo:2.3, hi:2.7},
  {n:"Vinaigre", ph:2.8, lo:2.4, hi:3.4},
  {n:"Jus d'orange", ph:3.6, lo:3.3, hi:4.2},
  {n:"Tomate", ph:4.4, lo:4.0, hi:4.6},
  {n:"Café noir", ph:5.0, lo:4.8, hi:5.2},
  {n:"Pluie (CO₂ dissous)", ph:5.6, lo:5.0, hi:5.7},
  {n:"Lait", ph:6.6, lo:6.4, hi:6.8},
  {n:"Salive", ph:6.8, lo:6.5, hi:7.2},
  {n:"Eau pure (25 °C)", ph:7.0, lo:7.0, hi:7.0},
  {n:"Sang", ph:7.4, lo:7.35, hi:7.45},
  {n:"Eau de mer", ph:8.1, lo:8.0, hi:8.2},
  {n:"Bicarbonate (0,1 mol/L)", ph:8.3, lo:8.2, hi:8.4},
  {n:"Savon", ph:9.5, lo:9.0, hi:10.0},
  {n:"Lait de magnésie", ph:10.5, lo:10.3, hi:10.7},
  {n:"Ammoniaque ménagère", ph:11.5, lo:11.0, hi:12.0},
  {n:"Eau de Javel", ph:12.5, lo:11.5, hi:13.0},
  {n:"Soude (0,1 mol/L)", ph:13.0, lo:13.0, hi:13.0}
];

/* ---------- 1. L'échelle de pH et les produits du quotidien ---------- */
SFA.sim({
  id:"uc-L12-echelle-ph", ch:"L12", tag:"Acides et bases",
  titre:"L'échelle de pH et les produits du quotidien",
  resume:"Fais glisser le pH le long de l'échelle, compare deux produits et vois que chaque unité de pH vaut un facteur 10.",
  but:"Glisse le long de l'échelle (ou règle le curseur) : [H₃O⁺], [OH⁻] et la nature de la solution s'affichent. Clique un produit du quotidien pour y placer le curseur, ou choisis deux produits pour comparer leur acidité : l'écart de pH se traduit en facteur 10<sup>ΔpH</sup>.",
  aRetenir:"pH = −log₁₀[H₃O⁺] ; à 25 °C, pH + pOH = 14,00 (pK<sub>e</sub> = 14,00) ; solution acide si pH < 7, neutre si pH = 7, basique si pH > 7. L'échelle est <b>logarithmique</b> : une unité de pH = un facteur 10 sur [H₃O⁺] ; 3 unités = un facteur 1000.",
  piege:"La neutralité est pH = 7 seulement à 25 °C : à 37 °C, pK<sub>e</sub> ≈ 13,6 et l'eau pure a un pH ≈ 6,8. Le sang (pH 7,4) est donc à peine basique par rapport à la neutralité de 37 °C (6,8) mais clairement plus basique que l'eau à 25 °C. Les pH du quotidien sont des ordres de grandeur, ils varient selon la marque et la composition.",
  build:function(k, S){
    var c = k.canvas(330);
    var P = S.draw.palette;
    var st = {sel:null};
    var tg = k.seg("Température", [["25","25 °C (pKe = 14,00)"],["37","37 °C (pKe ≈ 13,6)"]], "25");
    var ps = k.slider("pH", 0, 14, 0.05, 7, "", function(){ st.sel = null; });
    var ga = k.select("Produit A", PROD.map(function(p, i){ return [i, p.n]; }), 2);
    var gb = k.select("Produit B", PROD.map(function(p, i){ return [i, p.n]; }), 12);
    k.button("Placer le curseur sur A", function(){ ps.set(PROD[+ga.value].ph); st.sel = +ga.value; }, false);
    k.button("Placer le curseur sur B", function(){ ps.set(PROD[+gb.value].ph); st.sel = +gb.value; }, false);
    var ro = k.readouts(["[H₃O⁺]", "[OH⁻]", "pOH", "Nature", "Plus acide que l'eau neutre de", "A comparé à B"]);
    var nt = k.note("", "ok");
    var geo = {};
    c.pointer(function(type, p){
      if ((type === "down" || type === "drag") && geo.x0 != null){
        /* clic sur un produit ? sinon positionner le curseur */
        if (type === "down"){ var best = -1, bd = 1e9; PROD.forEach(function(q, i){ var x = geo.x0 + q.ph / 14 * (geo.x1 - geo.x0), y = geo.ly[i]; var d = Math.hypot(p.x - x, p.y - y); if (d < bd){ bd = d; best = i; } }); if (bd < 24){ ps.set(PROD[best].ph); st.sel = best; k.redraw(); return; } }
        if (p.y > geo.by0 - 12 && p.y < geo.by1 + 12){ ps.set(Math.round(Math.max(0, Math.min(14, (p.x - geo.x0) / (geo.x1 - geo.x0) * 14)) * 20) / 20); st.sel = null; k.redraw(); }
      }
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, ph = ps.value, pke = tg.value === "25" ? 14.0 : 13.6, neutral = pke / 2;
      c.clear();
      var x0 = 18, x1 = W - 18, by0 = H / 2 - 12, by1 = H / 2 + 12;
      geo = {x0:x0, x1:x1, by0:by0, by1:by1, ly:[]};
      var gr = ctx.createLinearGradient(x0, 0, x1, 0);
      for (var q = 0; q <= 14; q += 1) gr.addColorStop(q / 14, pHcolor(q));
      ctx.fillStyle = gr; ctx.fillRect(x0, by0, x1 - x0, by1 - by0);
      ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = 1; ctx.strokeRect(x0, by0, x1 - x0, by1 - by0);
      for (q = 0; q <= 14; q++){ var xx = x0 + q / 14 * (x1 - x0); S.draw.line(c, xx, by1, xx, by1 + 5, "#5f6b7a", 1); S.draw.text(c, q + "", xx, by1 + 15, {size:10.5, color:P.grey, weight:700}); }
      S.draw.text(c, "acide", x0 + 24, by0 - 7, {size:10.5, color:P.red, weight:700}); S.draw.text(c, "basique", x1 - 28, by0 - 7, {size:10.5, color:P.acc, weight:700});
      /* neutralité */
      var xn = x0 + neutral / 14 * (x1 - x0);
      S.draw.line(c, xn, by0 - 2, xn, by1 + 2, "#ffffff", 2, [3, 3]);
      /* produits : 3 rangées au-dessus et 3 en dessous, en alternance */
      var labels = [];
      PROD.forEach(function(pr, i){
        var up = i % 2 === 0, row = Math.floor(i / 2) % 3, y = up ? by0 - 22 - row * 30 - 6 : by1 + 36 + row * 30 + 2, x = x0 + pr.ph / 14 * (x1 - x0);
        geo.ly[i] = y;
        var onf = st.sel === i || Math.abs(ph - pr.ph) < 0.051;
        S.draw.line(c, x, up ? y + 8 : y - 8, x, up ? by0 : by1, onf ? P.ink : "rgba(15,27,45,.3)", onf ? 1.8 : 1);
        if (pr.hi > pr.lo){ ctx.fillStyle = "rgba(15,27,45,.16)"; var xa = x0 + pr.lo / 14 * (x1 - x0), xb = x0 + pr.hi / 14 * (x1 - x0); ctx.fillRect(xa, up ? by0 - 5 : by1 + 1, xb - xa, 4); }
        var tw = 110, tx = Math.max(3 + tw / 2, Math.min(W - 3 - tw / 2, x));
        labels.push([pr.n.replace(/ \(.*\)/, ""), tx, y, onf]);
      });
      labels.forEach(function(l){ S.draw.text(c, l[0], l[1], l[2], {size:10, color:l[3] ? P.ink : "#2c3a4e", weight:l[3] ? 800 : 600, bg:l[3] ? "rgba(244,197,66,.8)" : "rgba(255,255,255,.92)"}); });
      /* curseur */
      var xc = x0 + ph / 14 * (x1 - x0);
      ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(xc, by0 - 2); ctx.lineTo(xc - 8, by0 - 14); ctx.lineTo(xc + 8, by0 - 14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(xc, by1 + 2); ctx.lineTo(xc - 8, by1 + 14); ctx.lineTo(xc + 8, by1 + 14); ctx.closePath(); ctx.fill();
      S.draw.text(c, "pH = " + S.fmt(ph, 2), xc < W - 50 ? xc + 12 : xc - 12, H - 10, {size:12.5, color:P.ink, align:xc < W - 50 ? "left" : "right"});
      S.draw.text(c, "Clique un produit, ou glisse sur l'échelle", W / 2, 10, {size:10.5, color:P.grey, weight:600});
      /* lectures */
      var h = Math.pow(10, -ph), oh = Math.pow(10, -(pke - ph)), A = PROD[+ga.value], B = PROD[+gb.value], dd = B.ph - A.ph;
      ro.set(0, S.sci(h, 2) + " mol/L"); ro.set(1, S.sci(oh, 2) + " mol/L"); ro.set(2, S.fmt(pke - ph, 2));
      var nat = Math.abs(ph - neutral) < 0.005 ? "neutre" : ph < neutral ? "acide" : "basique";
      ro.set(3, nat);
      var f0 = Math.pow(10, neutral - ph);
      ro.set(4, f0 >= 1 ? S.sci(f0, 2) + " fois (concentration en H₃O⁺)" : "× " + S.sci(f0, 2) + " (moins d'ions H₃O⁺)");
      var fac = Math.pow(10, Math.abs(dd));
      ro.set(5, Math.abs(dd) < 0.005 ? "même pH" : (dd > 0 ? "A est " : "B est ") + S.sci(fac, 2) + " fois plus acide");
      nt.set("A : " + A.n + " (pH ≈ " + S.fmt(A.ph, 1) + "), B : " + B.n + " (pH ≈ " + S.fmt(B.ph, 1) + "). ΔpH = " + S.fmt(Math.abs(dd), 1) + " donc [H₃O⁺] diffère d'un facteur 10<sup>" + S.fmt(Math.abs(dd), 1) + "</sup> = " + S.sci(fac, 2) + ". Valeurs de pH indicatives (ordres de grandeur) ; les solutions de HCl, NaOH et l'eau pure sont, elles, calculées exactement à 25 °C." + (tg.value === "37" ? " À 37 °C, la neutralité est à pH ≈ " + S.fmt(neutral, 1) + " (pointillé blanc)." : ""), "ok");
    });
  }
});

/* ---------- 2. Dilution d'acides forts et faibles, en particules ---------- */
var KW = 1.0e-14;
var ACIDS = {
  hcl:{n:"HCl (acide fort)", pKa:-6, strong:true, A:"Cl⁻"},
  hno3:{n:"HNO₃ (acide fort)", pKa:-6, strong:true, A:"NO₃⁻"},
  hf:{n:"HF (pKa = 3,17)", pKa:3.17, A:"F⁻"},
  hcooh:{n:"Acide formique HCOOH (pKa = 3,75)", pKa:3.75, A:"HCOO⁻"},
  benz:{n:"Acide benzoïque (pKa = 4,20)", pKa:4.20, A:"C₆H₅COO⁻"},
  ac:{n:"Acide acétique CH₃COOH (pKa = 4,76)", pKa:4.76, A:"CH₃COO⁻"},
  nh4:{n:"Ion ammonium NH₄⁺ (pKa = 9,25)", pKa:9.25, A:"NH₃"}
};
function solveH(Ka, c){   /* h = c·Ka/(Ka + h) + Kw/h, résolue par dichotomie sur log h */
  var lo = -14, hi = 1, i, m, f;
  for (i = 0; i < 90; i++){ m = (lo + hi) / 2; var h = Math.pow(10, m); f = h - c * Ka / (Ka + h) - KW / h; if (f > 0) hi = m; else lo = m; }
  return Math.pow(10, (lo + hi) / 2);
}
SFA.sim({
  id:"uc-L12-dilution-particules", ch:"L12", tag:"Acides et bases",
  titre:"Dilution et pH : acide fort et acide faible en particules",
  resume:"1000 molécules d'acide : combien sont dissociées ? Dilue et regarde le pH, le degré α et la courbe pH–log c.",
  but:"Choisis un acide, sa concentration initiale et un facteur de dilution. Le damier montre 1000 molécules d'acide tirées de la solution : grises = HA intact, paires rouge + bleu = H₃O⁺ + A⁻. En dessous, le pH exact (autoprotolyse comprise) est comparé aux lois approchées.",
  aRetenir:"Acide fort : pH = −log c (la dissociation est totale) ; diluer 10 fois augmente le pH de 1. Acide faible : pH ≈ ½(pK<sub>a</sub> − log c) si α reste petit ; diluer 10 fois augmente le pH d'environ 0,5 seulement, et le degré de dissociation α augmente (loi de dilution d'Ostwald). Aux concentrations très faibles (≲ 10⁻⁶ mol/L), l'autoprotolyse de l'eau impose pH → 7.",
  piege:"Un acide faible plus dilué est plus dissocié (α augmente) même si son pH monte : α et pH ne varient pas dans le même sens que la concentration. Et un acide fort 10⁻⁸ mol/L n'a pas un pH de 8 : l'eau fournit déjà 10⁻⁷ mol/L de H₃O⁺, le pH reste inférieur à 7 (≈ 6,98).",
  build:function(k, S){
    var c = k.canvas(220), g = k.canvas(250);
    var P = S.draw.palette;
    var ac = k.select("Acide", Object.keys(ACIDS).map(function(q){ return [q, ACIDS[q].n]; }), "ac");
    var lc = k.slider("log₁₀ de la concentration initiale", -6, 0, 0.1, -1, "");
    var df = k.slider("Dilution : eau ajoutée, facteur 10^x", 0, 4, 0.1, 0, "");
    k.button("Ajouter de l'eau (× 10)", function(){ df.set(Math.min(4, df.value + 1)); }, true);
    k.button("Remettre à zéro", function(){ df.set(0); }, false);
    var ro = k.readouts(["Concentration c", "pH exact", "[H₃O⁺]", "Degré de dissociation α", "pH avant dilution", "Variation de pH"]);
    var nt = k.note("", "ok");
    function sol(a, cc){ var Ka = Math.pow(10, -a.pKa), h = solveH(Ka, cc); return {h:h, ph:-Math.log10(h), al:Ka / (Ka + h), Ka:Ka}; }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, a = ACIDS[ac.value], c0 = Math.pow(10, lc.value), cc = c0 / Math.pow(10, df.value);
      c.clear(); g.clear();
      var s = sol(a, cc), s0 = sol(a, c0);
      /* damier de 1000 molécules */
      var cols = 50, rows = 20, mx = 12, my = 22, dx = (W - 2 * mx) / cols, dy = (H - my - 34) / rows;
      var nIon = Math.round(s.al * 1000);
      /* positions des ionisées : réparties de façon régulière pseudo-aléatoire */
      var ion = {}, cnt = 0, idx = 0;
      var order = []; for (idx = 0; idx < 1000; idx++) order.push(idx);
      order.sort(function(p, q){ var r1 = Math.sin(p * 12.9898) * 43758.5453, r2 = Math.sin(q * 12.9898) * 43758.5453; return (r1 - Math.floor(r1)) - (r2 - Math.floor(r2)); });
      for (idx = 0; idx < nIon; idx++) ion[order[idx]] = 1;
      for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++){
        var id = r * cols + q, x = mx + (q + 0.5) * dx, y = my + (r + 0.5) * dy, rr = Math.min(dx, dy) * 0.34;
        if (ion[id]){ ball(ctx, x - rr * 0.55, y, rr, "#d9362b", 1); ball(ctx, x + rr * 0.75, y, rr, "#2f5fb3", 1); }
        else ball(ctx, x, y, rr * 1.15, "#aab4c2", 1);
      }
      S.draw.text(c, "1000 molécules " + (a.strong ? "de l'acide fort" : "d'acide") + " : " + nIon + " dissociée" + (nIon > 1 ? "s" : "") + "  (α = " + (s.al < 0.0995 ? S.fmt(s.al * 100, 2) : S.fmt(s.al * 100, 1)) + " %)", 10, 10, {size:11.5, color:P.ink, align:"left"});
      S.draw.text(c, "gris : HA   rouge : H₃O⁺   bleu : " + a.A, 10, H - 12, {size:10.5, color:P.grey, align:"left"});
      /* courbe pH – log c */
      var ax = plotAxes(S, g, {x0:-10, x1:0, y0:0, y1:9, xl:"log c", yl:"pH", l:40, sx:1, sy:1});
      var ST = {Ka:1e6};
      S.draw.fn(g, ax, function(x){ return -Math.log10(solveH(1e6, Math.pow(10, x))); }, "#9aa6b5", 2.4, [6, 4]);
      if (!a.strong){
        S.draw.fn(g, ax, function(x){ return -Math.log10(solveH(s.Ka, Math.pow(10, x))); }, P.acc, 3);
        S.draw.fn(g, ax, function(x){ return 0.5 * (a.pKa - x); }, P.amber, 1.6, [3, 4]);
      } else S.draw.fn(g, ax, function(x){ return -Math.log10(solveH(1e6, Math.pow(10, x))); }, P.acc, 3);
      var lcc = Math.log10(cc), lc0 = Math.log10(c0);
      S.draw.arrow(g, ax.X(lc0), ax.Y(s0.ph), ax.X(lcc) - 1, ax.Y(s.ph), P.red, 2);
      S.draw.dot(g, ax.X(lc0), ax.Y(s0.ph), 4.5, "#7b8696"); S.draw.dot(g, ax.X(lcc), ax.Y(s.ph), 6.5, P.red);
      S.draw.text(g, "gris pointillé : acide fort · bleu : acide choisi · orange : ½(pKa − log c)", ax.L + 6, ax.T + 8, {size:9.5, color:P.grey, align:"left"});
      S.draw.line(g, ax.L, ax.Y(7), ax.R, ax.Y(7), "rgba(15,27,45,.25)", 1, [2, 4]);
      /* lectures */
      ro.set(0, S.sci(cc, 3) + " mol/L"); ro.set(1, S.fmt(s.ph, 2)); ro.set(2, S.sci(s.h, 2) + " mol/L");
      ro.set(3, s.al < 0.0995 ? S.fmt(s.al * 100, 2) + " %" : S.fmt(s.al * 100, 1) + " %");
      ro.set(4, S.fmt(s0.ph, 2)); ro.set(5, (s.ph - s0.ph >= 0 ? "+" : "") + S.fmt(s.ph - s0.ph, 2));
      var msg;
      if (a.strong) msg = "Acide fort : dissociation totale, pH = −log c = " + S.fmt(-Math.log10(cc), 2) + " tant que l'autoprotolyse est négligeable. Diluer d'un facteur 10 ajoute 1 au pH.";
      else {
        var approx = 0.5 * (a.pKa - Math.log10(cc)), okApprox = s.al < 0.05 && cc > 1e-6;
        msg = "Acide faible : l'approximation pH ≈ ½(pKa − log c) = " + S.fmt(approx, 2) + " " + (okApprox ? "est valable (α < 5 %)" : "<b>n'est plus valable</b> (α = " + S.fmt(s.al * 100, 1) + " % > 5 % ou autoprotolyse non négligeable)") + " ; le pH exact vaut " + S.fmt(s.ph, 2) + ". Diluer 10 fois ajoute ≈ 0,5 au pH mais α augmente.";
      }
      var w2 = [];
      if (cc < 1e-6) w2.push("c < 10⁻⁶ mol/L : l'autoprotolyse de l'eau (10⁻⁷ mol/L de H₃O⁺) n'est plus négligeable, le pH tend vers 7.");
      if (cc > 0.5) w2.push("Au-dessus de ≈ 0,5 mol/L, les activités s'écartent des concentrations : pH réel un peu différent.");
      nt.set(msg + (w2.length ? "<br>" + w2.join(" ") : ""), w2.length ? "warn" : "ok");
    });
  }
});
})();
