/* Biologie 4e · chapitre 1 · Niveaux d'organisation et observation de la cellule */
var B4 = window.B4 = {
  pal: (function(){ var p = SFA.draw.palette; return {acc:p.acc, red:p.red, green:p.green, violet:p.violet, amber:p.amber, teal:p.teal, ink:p.ink, grey:p.grey, light:p.light}; })(),
  ell: function(c, x, y, rx, ry, fill, stroke, lw, rot){
    var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, 2 * Math.PI);
    if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); } ctx.restore();
  },
  rr: function(c, x, y, w, h, r, fill, stroke, lw){
    var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); } ctx.restore();
  },
  txt: function(c, s, x, y, col, size, align){ SFA.draw.text(c, s, x, y, {size:size || 12, color:col || "#0f1b2d", align:align || "center"}); },
  nice: function(v){ var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; },
  /* longueur lisible à partir d'une taille en mètres */
  len: function(m){
    var S = SFA;
    if (m >= 1) return S.fmt(m, 1) + " m";
    if (m >= 0.01) return S.fmt(m * 100, 1) + " cm";
    if (m >= 0.001) return S.fmt(m * 1000, 1) + " mm";
    if (m >= 1e-6) return S.fmt(m * 1e6, 2) + " µm";
    return S.fmt(m * 1e9, 2) + " nm";
  },
  /* graine pseudo-aléatoire reproductible */
  rng: function(seed){ var s = seed >>> 0; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
};

SFA.sim({
  id:"b4-c01-microscope", ch:"c01", tag:"Classique",
  titre:"Le microscope : grossir ou distinguer ?",
  resume:"Calcule le grossissement, puis découvre pourquoi grossir plus ne suffit pas à voir plus fin.",
  but:"Mode « Grossissement » : choisis objectif, oculaire et objet. Mode « Résolution » : écarte deux points et vois à quelle condition on les distingue.",
  aRetenir:"Grossissement total = grossissement de l'objectif × grossissement de l'oculaire. Le pouvoir de résolution (d ≈ 0,61·λ / ON) est la plus petite distance entre deux points encore séparés : en lumière visible il ne descend pas sous ≈ 0,2 µm. Le microscope électronique descend beaucoup plus bas (de l'ordre du nanomètre pour des échantillons biologiques).",
  piege:"Un fort grossissement ne rend pas l'image plus nette : si deux points sont plus proches que la résolution, les agrandir ne les sépare pas (« grossissement vide »).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.78});
    var mode = k.seg("Mode", [["g","Grossissement"],["r","Résolution"]], "g");
    var obj = k.seg("Objectif", [[4,"×4"],[10,"×10"],[40,"×40"],[100,"×100"]], 40);
    var oc = k.seg("Oculaire", [[5,"×5"],[10,"×10"],[15,"×15"]], 10);
    var spec = k.select("Objet (mode Grossissement)", [[250,"Cellule d'oignon (≈ 250 µm)"],[7,"Globule rouge (7 µm)"],[2,"Bactérie E. coli (2 µm)"],[1,"Mitochondrie (1 µm)"],[0.1,"Virus de la grippe (0,1 µm)"]], 250);
    var dd = k.slider("Distance entre deux points (mode Résolution)", 0.05, 3, 0.05, 0.5, "µm");
    var lam = k.seg("Lumière", [[650,"rouge"],[550,"verte"],[450,"bleue"]], 550);
    var ro = k.readouts(["Grossissement total", "Taille de l'image", "Champ observé", "Résolution"]);
    var nt = k.note("", "");
    var NA = {4:0.10, 10:0.25, 40:0.65, 100:1.25};
    function shape(name, cx, cy, L){
      var ctx = c.ctx;
      if (name === "250"){ B4.rr(c, cx - L / 2, cy - L * 0.22, L, L * 0.44, L * 0.04, "rgba(120,190,150,.35)", B4.pal.green, 2); B4.ell(c, cx - L * 0.2, cy, L * 0.07, L * 0.07, "rgba(30,63,143,.55)", B4.pal.acc, 1.5); }
      else if (name === "7"){ B4.ell(c, cx, cy, L / 2, L / 2, "rgba(190,40,40,.55)", B4.pal.red, 2); B4.ell(c, cx, cy, L * 0.2, L * 0.2, "rgba(255,255,255,.55)"); }
      else if (name === "2"){ B4.rr(c, cx - L / 2, cy - L * 0.18, L, L * 0.36, L * 0.18, "rgba(180,83,9,.35)", B4.pal.amber, 2); }
      else if (name === "1"){ B4.ell(c, cx, cy, L / 2, L * 0.28, "rgba(91,33,182,.3)", B4.pal.violet, 2); }
      else { B4.ell(c, cx, cy, L / 2, L / 2, "rgba(14,116,144,.5)", B4.pal.teal, 1.5); }
    }
    k.draw(function(){
      var G = obj.value * oc.value, res = 0.61 * lam.value / NA[obj.value];   /* nm */
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H;
      if (mode.value === "g"){
        var size = parseFloat(spec.value), D = 18000 / obj.value;      /* champ réel en µm (numéro de champ 18 mm) */
        var R = Math.min(W, H) * 0.42, cx = W / 2, cy = H / 2;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fillStyle = "#fbfcfe"; ctx.fill(); ctx.clip();
        var L = size / D * 2 * R, visible = size * 1000 >= res;
        if (visible) shape(String(spec.value), cx, cy, L);
        else { B4.ell(c, cx, cy, 5, 5, "rgba(120,130,150,.35)"); B4.ell(c, cx, cy, 2, 2, "rgba(120,130,150,.5)"); }
        ctx.restore();
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 3; ctx.stroke();
        /* barre d'échelle */
        var bar = B4.nice(D / 5), bpx = bar / D * 2 * R;
        S.draw.line(c, cx - bpx / 2, cy + R - 14, cx + bpx / 2, cy + R - 14, B4.pal.ink, 3);
        B4.txt(c, S.fmt(bar, bar < 1 ? 2 : 0) + " µm", cx, cy + R - 28, B4.pal.ink, 12);
        B4.txt(c, "Champ : " + S.fmt(D, 0) + " µm", cx, cy - R - 0 + 14, "#5f6b7a", 12);
        if (L > 2 * R) B4.txt(c, "dépasse le champ", cx, cy - 20, B4.pal.red, 13);
        if (!visible) B4.txt(c, "non distinguable", cx, cy + 24, B4.pal.red, 13);
        ro.set(0, "× " + G); ro.set(1, S.fmt(size * G / 1000, size * G / 1000 < 1 ? 3 : 1) + " mm"); ro.set(2, S.fmt(D, 0) + " µm"); ro.set(3, S.fmt(res, 0) + " nm");
        var nb = D / size;
        nt.set(visible ? (nb >= 1 ? "Dans le diamètre du champ, on peut aligner ≈ " + S.fmt(nb, nb < 10 ? 1 : 0) + " objets de cette taille (" + S.fmt(D, 0) + " ÷ " + S.fmt(size, size < 1 ? 1 : 0) + ")." : "L'objet est plus grand que le champ : on n'en voit qu'une partie. Passe à un objectif plus faible.") :
          "L'objet mesure " + S.fmt(size * 1000, 0) + " nm, moins que la résolution (" + S.fmt(res, 0) + " nm) : on ne peut pas l'observer au microscope optique, quel que soit le grossissement.", visible ? "" : "warn");
      } else {
        var d = dd.value * 1000, sig = res / 2;                         /* nm */
        var span = Math.max(d + 8 * sig, 6 * sig), x0 = -span / 2 + d / 2 * 0, mid = 0;
        var xa = -d / 2, xb = d / 2, left = -span / 2, right = span / 2;
        var L0 = 24, R0 = W - 24;
        function PX(x){ return L0 + (x - left) / (right - left) * (R0 - L0); }
        function I(x){ return Math.exp(-Math.pow(x - xa, 2) / (2 * sig * sig)) + Math.exp(-Math.pow(x - xb, 2) / (2 * sig * sig)); }
        var stripH = H * 0.26, pTop = 26;
        ctx.fillStyle = "#0b1220"; ctx.fillRect(L0, pTop, R0 - L0, stripH);
        for (var px = L0; px < R0; px += 2){
          var v = Math.min(1, I(left + (px - L0) / (R0 - L0) * (right - left))), g = Math.round(v * 255);
          ctx.fillStyle = "rgb(" + g + "," + g + "," + Math.round(g * 0.9) + ")"; ctx.fillRect(px, pTop, 2, stripH);
        }
        B4.txt(c, "Ce que l'œil voit", L0 + 4, pTop - 12, B4.pal.ink, 12, "left");
        var gy0 = pTop + stripH + 36, gy1 = H - 34;
        function PY(v){ return gy1 - v / 2.05 * (gy1 - gy0); }
        ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L0, gy1); ctx.lineTo(R0, gy1); ctx.stroke();
        B4.txt(c, "Intensité reçue", L0 + 4, gy0 - 12, B4.pal.ink, 12, "left");
        ctx.beginPath(); ctx.strokeStyle = B4.pal.acc; ctx.lineWidth = 2.6;
        for (px = L0; px <= R0; px += 2){ var yy = PY(I(left + (px - L0) / (R0 - L0) * (right - left))); if (px === L0) ctx.moveTo(px, yy); else ctx.lineTo(px, yy); }
        ctx.stroke();
        S.draw.line(c, PX(xa), gy1 + 2, PX(xa), gy1 + 14, B4.pal.red, 3); S.draw.line(c, PX(xb), gy1 + 2, PX(xb), gy1 + 14, B4.pal.red, 3);
        B4.txt(c, "points réels (écart " + S.fmt(dd.value, 2) + " µm)", W / 2, H - 8, B4.pal.red, 12);
        var ok = d >= res;
        ro.set(0, "× " + G + " (sans effet ici)"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, S.fmt(res, 0) + " nm");
        nt.set(ok ? "d = " + S.fmt(d, 0) + " nm ≥ résolution " + S.fmt(res, 0) + " nm : on voit deux pics, les points sont distingués." :
          "d = " + S.fmt(d, 0) + " nm < résolution " + S.fmt(res, 0) + " nm : les deux taches se fondent en une seule. Change d'objectif ou de couleur, pas d'oculaire !", ok ? "ok" : "bad");
      }
    });
  }
});

SFA.sim({
  id:"b4-c01-zoom", ch:"c01", tag:"Puissances de 10 · zoom",
  titre:"Zoom 10ⁿ : du mètre à l'atome",
  resume:"Glisse sur l'échelle logarithmique : le viseur zoome sur un enfant, une fourmi, une cellule, une mitochondrie, l'ADN, un atome.",
  but:"Glisse le repère rouge sur l'échelle du bas (ou le curseur) : le viseur montre les objets de cette taille, avec la barre d'échelle. Lis l'instrument nécessaire et relève le défi.",
  aRetenir:"Chaque pas de l'échelle multiplie ou divise la taille par 10. Un globule rouge (7 µm) est environ 140 000 fois plus petit qu'un enfant d'1 m ; l'œil nu distingue ≈ 0,1 mm, le microscope optique ≈ 0,2 µm.",
  piege:"Sur une échelle logarithmique, des distances égales ne représentent pas des différences égales : de 10⁻⁶ m à 10⁻⁷ m, on divise par 10, on ne retranche pas 10⁻⁷.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.06});
    var n = k.slider("Exposant n (taille = 10ⁿ m)", -10, 0, 0.1, -5, "");
    var ro = k.readouts(["Taille", "Fois plus petit qu'1 m", "Instrument", "Objet le plus proche"]);
    var nt = k.note("", "");
    var items = [["enfant (1 m)", 0], ["main d'adulte (18 cm)", -0.74], ["fourmi (5 mm)", -2.3], ["ovule humain (0,12 mm)", -3.92], ["globule rouge (7 µm)", -5.15], ["bactérie E. coli (2 µm)", -5.7], ["mitochondrie (1 µm)", -6], ["virus grippal (100 nm)", -7], ["ribosome (25 nm)", -7.6], ["épaisseur de membrane (7 nm)", -8.15], ["diamètre de l'ADN (2 nm)", -8.7], ["molécule de glucose (≈ 1 nm)", -9.0], ["atome d'hydrogène (0,1 nm)", -10]];
    var target = null, geo = {};
    k.button("Défi : trouve la taille d'un objet", function(){ target = items[Math.floor(Math.random() * items.length)]; }, true);
    /* dessins : (x, y, d) d = diamètre/longueur en px ; renvoient rien */
    var D = [
      function(ctx, x, y, d){ ctx.fillStyle = "#f2b8a0"; ctx.beginPath(); ctx.arc(x, y - d * 0.36, d * 0.11, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#3b82c4"; S.draw.rrect(c, x - d * 0.13, y - d * 0.24, d * 0.26, d * 0.34, d * 0.06); ctx.fill(); ctx.fillStyle = "#294a77"; ctx.fillRect(x - d * 0.12, y + d * 0.1, d * 0.1, d * 0.3); ctx.fillRect(x + d * 0.02, y + d * 0.1, d * 0.1, d * 0.3); ctx.strokeStyle = "#f2b8a0"; ctx.lineWidth = d * 0.05; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - d * 0.13, y - d * 0.18); ctx.lineTo(x - d * 0.26, y + d * 0.05); ctx.moveTo(x + d * 0.13, y - d * 0.18); ctx.lineTo(x + d * 0.26, y + d * 0.05); ctx.stroke(); },
      function(ctx, x, y, d){ ctx.fillStyle = "#f2c3a8"; S.draw.rrect(c, x - d * 0.28, y - d * 0.1, d * 0.56, d * 0.42, d * 0.08); ctx.fill(); for (var i = 0; i < 4; i++){ S.draw.rrect(c, x - d * 0.28 + i * d * 0.14, y - d * 0.5 + (i === 1 || i === 2 ? -d * 0.05 : d * 0.04), d * 0.11, d * 0.45, d * 0.05); ctx.fill(); } S.draw.rrect(c, x - d * 0.5, y + d * 0.0, d * 0.25, d * 0.1, d * 0.05); ctx.fill(); },
      function(ctx, x, y, d){ ctx.fillStyle = "#4a2f27"; [[-0.3, 0.12], [0, 0.1], [0.3, 0.16]].forEach(function(p){ ctx.beginPath(); ctx.ellipse(x + d * p[0], y, d * p[1], d * p[1] * 0.75, 0, 0, 6.2832); ctx.fill(); }); ctx.strokeStyle = "#4a2f27"; ctx.lineWidth = Math.max(1, d * 0.012); for (var i = -1; i <= 1; i++){ ctx.beginPath(); ctx.moveTo(x + i * d * 0.12, y); ctx.lineTo(x + i * d * 0.2, y + d * 0.3); ctx.moveTo(x + i * d * 0.12, y); ctx.lineTo(x + i * d * 0.2, y - d * 0.3); ctx.stroke(); } },
      function(ctx, x, y, d){ S.draw.glow(c, x, y, d * 0.7, "#fff4c9", 0.9); ctx.beginPath(); ctx.arc(x, y, d * 0.42, 0, 6.2832); ctx.fillStyle = "#fbe4d4"; ctx.fill(); ctx.strokeStyle = "#d9a17f"; ctx.lineWidth = d * 0.04; ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, d * 0.12, 0, 6.2832); ctx.fillStyle = "#a9658a"; ctx.fill(); },
      function(ctx, x, y, d){ ctx.beginPath(); ctx.ellipse(x, y, d * 0.5, d * 0.46, 0, 0, 6.2832); ctx.fillStyle = "#d9534f"; ctx.fill(); ctx.strokeStyle = "#9f2b28"; ctx.lineWidth = Math.max(1, d * 0.04); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x, y, d * 0.22, d * 0.18, 0, 0, 6.2832); ctx.fillStyle = "#ee8a86"; ctx.fill(); },
      function(ctx, x, y, d){ ctx.fillStyle = "#e6a15b"; S.draw.rrect(c, x - d * 0.5, y - d * 0.17, d, d * 0.34, d * 0.17); ctx.fill(); ctx.strokeStyle = "#9b5f1f"; ctx.lineWidth = Math.max(1, d * 0.03); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + d * 0.5, y); ctx.bezierCurveTo(x + d * 0.75, y - d * 0.3, x + d * 0.9, y + d * 0.3, x + d * 1.1, y); ctx.stroke(); },
      function(ctx, x, y, d){ S.draw.rrect(c, x - d * 0.5, y - d * 0.28, d, d * 0.56, d * 0.28); ctx.fillStyle = "#7cc9a0"; ctx.fill(); ctx.strokeStyle = "#1f7a52"; ctx.lineWidth = Math.max(1, d * 0.035); ctx.stroke(); ctx.beginPath(); for (var i = -2; i <= 2; i++){ ctx.moveTo(x + i * d * 0.15, y - d * 0.18); ctx.lineTo(x + i * d * 0.15, y + (i % 2 ? 0.08 : 0.02) * d); } ctx.stroke(); },
      function(ctx, x, y, d){ ctx.beginPath(); ctx.arc(x, y, d * 0.4, 0, 6.2832); ctx.fillStyle = "#b7a0e6"; ctx.fill(); ctx.strokeStyle = "#6236c4"; ctx.lineWidth = Math.max(1, d * 0.03); for (var i = 0; i < 14; i++){ var a = i / 14 * 6.2832; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * d * 0.4, y + Math.sin(a) * d * 0.4); ctx.lineTo(x + Math.cos(a) * d * 0.55, y + Math.sin(a) * d * 0.55); ctx.stroke(); S.draw.dot(c, x + Math.cos(a) * d * 0.56, y + Math.sin(a) * d * 0.56, Math.max(1, d * 0.04), "#6236c4"); } ctx.stroke(); },
      function(ctx, x, y, d){ ctx.fillStyle = "#e07a8a"; ctx.beginPath(); ctx.arc(x - d * 0.18, y + d * 0.05, d * 0.3, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#c0506a"; ctx.beginPath(); ctx.arc(x + d * 0.2, y - d * 0.15, d * 0.22, 0, 6.2832); ctx.fill(); },
      function(ctx, x, y, d){ for (var i = -3; i <= 3; i++){ S.draw.dot(c, x + i * d * 0.15, y - d * 0.3, Math.max(1.5, d * 0.07), "#e8b04a"); S.draw.dot(c, x + i * d * 0.15, y + d * 0.3, Math.max(1.5, d * 0.07), "#e8b04a"); ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = Math.max(1, d * 0.03); ctx.beginPath(); ctx.moveTo(x + i * d * 0.15, y - d * 0.24); ctx.lineTo(x + i * d * 0.15, y + d * 0.24); ctx.stroke(); } },
      function(ctx, x, y, d){ ctx.lineWidth = Math.max(1.5, d * 0.04); for (var s = 0; s < 2; s++){ ctx.strokeStyle = s ? "#c43a7a" : "#2f7fd1"; ctx.beginPath(); for (var i = 0; i <= 40; i++){ var u = i / 40, xx = x - d * 0.5 + u * d, yy = y + Math.sin(u * 12.5 + s * 3.1416) * d * 0.2; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } },
      function(ctx, x, y, d){ ctx.beginPath(); for (var i = 0; i < 6; i++){ var a = i * Math.PI / 3; i ? ctx.lineTo(x + d * 0.4 * Math.cos(a), y + d * 0.4 * Math.sin(a)) : ctx.moveTo(x + d * 0.4 * Math.cos(a), y + d * 0.4 * Math.sin(a)); } ctx.closePath(); ctx.fillStyle = "#f7dc7a"; ctx.fill(); ctx.strokeStyle = "#7a5b12"; ctx.lineWidth = Math.max(1, d * 0.05); ctx.stroke(); S.draw.dot(c, x + d * 0.4, y, d * 0.1, "#c0321d"); },
      function(ctx, x, y, d){ S.draw.glow(c, x, y, d * 0.7, "#8ec5ff", 0.8); S.draw.dot(c, x, y, Math.max(2, d * 0.1), "#c0321d"); ctx.beginPath(); ctx.arc(x, y, d * 0.4, 0, 6.2832); ctx.strokeStyle = "rgba(47,127,209,.6)"; ctx.lineWidth = Math.max(1, d * 0.03); ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]); }
    ];
    var LOC = [[0, 0], [-.2, .5], [.35, .25], [-.45, -.2], [.1, -.5], [-.35, .1], [.35, -.1], [-.2, .35], [.3, .4], [-.4, -.3], [.1, .5], [-.3, .5], [.4, -.35]];
    c.pointer(function(type, p){ if ((type === "down" || type === "drag") && geo.L && p.y > geo.ry - 32){ var v = -(p.x - geo.L) / (geo.R - geo.L) * 10; n.set(Math.round(Math.max(-10, Math.min(0, v)) * 10) / 10); k.redraw(); } });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, L = 24, Rr = W - 24, vr = Math.min(W * 0.36, H * 0.3), vcx = W / 2, vcy = vr + 12;
      geo = {L:L, R:Rr, ry:vcy + vr + 40};
      var FOV = Math.pow(10, n.value + 1);       /* diamètre du viseur, en m */
      /* viseur */
      ctx.save(); ctx.beginPath(); ctx.arc(vcx, vcy, vr, 0, 6.2832); ctx.clip();
      var vg = ctx.createRadialGradient(vcx, vcy, vr * 0.2, vcx, vcy, vr); vg.addColorStop(0, "#fbfcff"); vg.addColorStop(1, "#dfe7f5"); ctx.fillStyle = vg; ctx.fillRect(vcx - vr, vcy - vr, 2 * vr, 2 * vr);
      var near = items.reduce(function(a, b){ return Math.abs(b[1] - n.value) < Math.abs(a[1] - n.value) ? b : a; });
      var order = items.map(function(it, i){ return i; }).sort(function(a, b){ return items[b][1] - items[a][1]; });
      order.forEach(function(i){
        var it = items[i], size = Math.pow(10, it[1]) * (i === 0 ? 1 : 1), r = size / FOV, d = r * 2 * vr; if (d < 3 || d > 7 * vr) return;
        var al = Math.min(1, (d - 3) / 12) * (d > vr * 1.3 ? 0.3 : 1) * (d > 2.4 * vr ? Math.max(0, 1 - (d - 2.4 * vr) / (3 * vr)) : 1);
        var lx = d > vr * 0.9 ? 0 : LOC[i][0] * vr * 0.7, ly = d > vr * 0.9 ? 0 : LOC[i][1] * vr * 0.7;
        ctx.save(); ctx.globalAlpha = al; D[i](ctx, vcx + lx, vcy + ly, d); ctx.restore();
        if (d > 16 && d < vr * 1.4){ ctx.save(); ctx.globalAlpha = al; S.draw.label(c, it[0].replace(/ \(.*\)/, ""), vcx + lx, vcy + ly + Math.min(d * 0.55, vr * 0.85) + 8, {color:P.ink, size:10}); ctx.restore(); }
      });
      ctx.restore();
      ctx.beginPath(); ctx.arc(vcx, vcy, vr, 0, 6.2832); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(vcx, vcy, vr + 5, 0, 6.2832); ctx.strokeStyle = "rgba(15,27,45,.12)"; ctx.lineWidth = 4; ctx.stroke();
      /* barre d'échelle = 10^n m */
      var bl = Math.pow(10, n.value) / FOV * 2 * vr; S.draw.line(c, vcx - bl / 2, vcy + vr - 14, vcx + bl / 2, vcy + vr - 14, P.red, 3.5); S.draw.label(c, B4.len(Math.pow(10, n.value)), vcx, vcy + vr - 28, {color:P.red, size:11});
      S.draw.label(c, "viseur : " + B4.len(FOV) + " de large", vcx, vcy + vr + 16, {color:"#5f6b7a", size:10});
      /* règle logarithmique */
      var ry = geo.ry + 6; function PX(e){ return L + (-e) / 10 * (Rr - L); }
      var bands = [["œil nu", 0, -4, "#fde68a"], ["optique", -4, -6.7, "#bfdbfe"], ["électronique", -6.7, -9.7, "#ddd6fe"]];
      bands.forEach(function(b){ S.draw.rrect(c, PX(b[1]), ry + 24, PX(b[2]) - PX(b[1]) - 2, 20, 5); ctx.fillStyle = b[3]; ctx.fill(); S.draw.text(c, b[0], (PX(b[1]) + PX(b[2])) / 2, ry + 34, {size:10.5, color:P.ink}); });
      S.draw.line(c, L, ry, Rr, ry, P.ink, 2);
      for (var e = 0; e >= -10; e--){ S.draw.line(c, PX(e), ry - 6, PX(e), ry + 6, P.ink, 2); S.draw.text(c, e === 0 ? "1 m" : "10" + String(e).replace("-", "⁻").replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }), PX(e), ry + 17, {size:9.5, color:"#5f6b7a"}); }
      items.forEach(function(it){ S.draw.dot(c, PX(it[1]), ry, 3.5, P.teal); });
      var xm = PX(n.value); S.draw.line(c, xm, ry - 14, xm, ry + 50, P.red, 2.5); S.draw.dot(c, xm, ry - 14, 7, P.red);
      var m = Math.pow(10, n.value);
      var inst = n.value > -4 ? "œil nu" : n.value >= -6.7 ? "microscope optique" : n.value >= -9.7 ? "microscope électronique" : "techniques spéciales (≪ 0,2 nm)";
      ro.set(0, B4.len(m)); ro.set(1, S.sci(Math.pow(10, -n.value), 3)); ro.set(2, inst); ro.set(3, near[0]);
      if (target){
        var okc = Math.abs(n.value - target[1]) <= 0.3;
        nt.set("Défi : place le repère sur la taille de « " + target[0].replace(/ \(.*\)/, "") + " ». " + (okc ? "Bravo, c'est bien l'ordre de grandeur (" + target[0].replace(/.*\(|\)/g, "") + ") !" : "Tu en es à " + B4.len(m) + "."), okc ? "ok" : "warn");
      } else nt.set("Taille de l'objet voisin : " + near[0] + ". Tout à gauche : l'échelle humaine ; tout à droite : l'atome.", "");
    });
  }
});

SFA.sim({
  id:"b4-c01-mesure", ch:"c01", tag:"Mesure",
  titre:"Mesurer une cellule avec la barre d'échelle",
  resume:"Déplace les deux extrémités d'une règle sur une micrographie et convertis en taille réelle.",
  but:"Glisse les points rouges (souris ou doigt) pour mesurer le noyau, puis compare avec la vraie valeur.",
  aRetenir:"Taille réelle = longueur mesurée sur l'image ÷ grossissement. Avec une barre d'échelle : taille réelle = (longueur mesurée ÷ longueur de la barre) × valeur de la barre.",
  piege:"Ne mesure pas en « cm sur l'écran » sans la barre d'échelle : l'image peut être agrandie ou réduite, seul le rapport avec la barre est fiable.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.72});
    var st = {bar:10, Dc:40, Dn:12, A:{x:0.3, y:0.88}, B:{x:0.55, y:0.88}, seed:3, rev:false, drag:null};
    function neu(){
      var bars = [5, 10, 20, 50], mult = [3, 3.5, 4, 4.5, 5], nf = [0.25, 0.3, 0.35, 0.4];
      st.bar = bars[Math.floor(Math.random() * bars.length)];
      st.Dc = Math.round(st.bar * mult[Math.floor(Math.random() * mult.length)] * 10) / 10;
      st.Dn = Math.round(st.Dc * nf[Math.floor(Math.random() * nf.length)] * 10) / 10;
      st.seed = 1 + Math.floor(Math.random() * 9999); st.rev = false;
      st.A = {x:0.3, y:0.9}; st.B = {x:0.5, y:0.9};
    }
    neu();
    var ro = k.readouts(["Longueur mesurée (image)", "Barre d'échelle (image)", "Taille réelle mesurée", "Vraie valeur"]);
    var nt = k.note("", "");
    k.button("Nouvelle image", function(){ neu(); }, true);
    k.button("Révéler la vraie valeur", function(){ st.rev = true; });
    function geo(){ var cellPx = 0.7 * c.H; var ppu = cellPx / st.Dc; return {cellPx:cellPx, ppu:ppu}; }
    c.pointer(function(type, p){
      var fx = p.x / c.W, fy = p.y / c.H;
      if (type === "down"){ var da = Math.hypot(fx - st.A.x, (fy - st.A.y) * c.H / c.W), db = Math.hypot(fx - st.B.x, (fy - st.B.y) * c.H / c.W); st.drag = da < db ? "A" : "B"; }
      if ((type === "down" || type === "drag") && st.drag){ st[st.drag] = {x:Math.max(0.02, Math.min(0.98, fx)), y:Math.max(0.03, Math.min(0.97, fy))}; k.redraw(); }
      if (type === "up") st.drag = null;
    });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, g = geo(), cx = W / 2, cy = H * 0.46, rnd = B4.rng(st.seed);
      ctx.fillStyle = "#f3f5f9"; ctx.fillRect(0, 0, W, H);
      B4.ell(c, cx, cy, g.cellPx / 2, g.cellPx / 2 * 0.95, "rgba(150,200,170,.35)", B4.pal.green, 2.5);
      var nx = cx + (rnd() - 0.5) * (g.cellPx / 2 - st.Dn * g.ppu / 2) * 0.8, ny = cy + (rnd() - 0.5) * 0.3 * g.cellPx * 0.3;
      for (var i = 0; i < 7; i++){ var a = rnd() * 6.28, r = (0.2 + rnd() * 0.22) * g.cellPx; B4.ell(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9, g.cellPx * 0.04, g.cellPx * 0.02, "rgba(180,83,9,.4)", null, 0, rnd() * 3); }
      B4.ell(c, nx, ny, st.Dn * g.ppu / 2, st.Dn * g.ppu / 2, "rgba(30,63,143,.4)", B4.pal.acc, 2);
      B4.ell(c, nx + st.Dn * g.ppu * 0.1, ny - st.Dn * g.ppu * 0.1, st.Dn * g.ppu * 0.1, st.Dn * g.ppu * 0.1, "rgba(30,63,143,.65)");
      var bpx = st.bar * g.ppu, bx = W - 20 - bpx, by = H - 18;
      S.draw.line(c, bx, by, bx + bpx, by, B4.pal.ink, 4); S.draw.line(c, bx, by - 6, bx, by + 6, B4.pal.ink, 2); S.draw.line(c, bx + bpx, by - 6, bx + bpx, by + 6, B4.pal.ink, 2);
      B4.txt(c, st.bar + " µm", bx + bpx / 2, by - 14, B4.pal.ink, 13);
      var ax = st.A.x * W, ay = st.A.y * H, bx2 = st.B.x * W, by2 = st.B.y * H, Lpx = Math.hypot(bx2 - ax, by2 - ay);
      S.draw.line(c, ax, ay, bx2, by2, B4.pal.red, 3); S.draw.dot(c, ax, ay, 9, B4.pal.red); S.draw.dot(c, bx2, by2, 9, B4.pal.red);
      var real = Lpx / g.ppu;
      ro.set(0, S.fmt(Lpx, 0) + " px"); ro.set(1, S.fmt(bpx, 0) + " px = " + st.bar + " µm"); ro.set(2, S.fmt(real, 1) + " µm"); ro.set(3, st.rev ? S.fmt(st.Dn, 1) + " µm" : "?");
      if (st.rev){ var err = Math.abs(real - st.Dn) / st.Dn * 100; nt.set("Diamètre réel du noyau : " + S.fmt(st.Dn, 1) + " µm ; ta mesure : " + S.fmt(real, 1) + " µm (écart " + S.fmt(err, 0) + " %). " + (err <= 10 ? "Très bien !" : "Place les points exactement sur le bord du noyau."), err <= 10 ? "ok" : "warn"); }
      else nt.set("Mesure le diamètre du noyau (disque bleu) : règle = " + S.fmt(Lpx, 0) + " px ; barre = " + S.fmt(bpx, 0) + " px pour " + st.bar + " µm. Calcul : " + S.fmt(Lpx, 0) + " ÷ " + S.fmt(bpx, 0) + " × " + st.bar + " = " + S.fmt(real, 1) + " µm.", "");
    });
  }
});

SFA.sim({
  id:"b4-c01-comparer", ch:"c01", tag:"Comparaison · défi",
  titre:"Bactérie, cellule animale, cellule végétale",
  resume:"Compare structures et tailles, puis identifie une cellule mystère d'après ses indices.",
  but:"Choisis un type de cellule pour voir ses structures (active les légendes). En mode « Cellule mystère », devine le type à partir du dessin et de la barre d'échelle.",
  aRetenir:"Toutes les cellules ont une membrane, des ribosomes et de l'ADN. Les eucaryotes (animales, végétales) ont un noyau délimité par une enveloppe ; les bactéries (procaryotes) ont leur ADN libre dans le cytoplasme. Seules les cellules végétales ont chloroplastes, grande vacuole et paroi cellulosique.",
  piege:"Les bactéries ont bien de l'ADN (dans le nucléoïde) : c'est l'enveloppe nucléaire qui manque. Les cellules végétales ont aussi des mitochondries.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.7});
    var mode = k.seg("Mode", [["c","Comparer"],["m","Cellule mystère"]], "c");
    var typ = k.seg("Type", [["b","Bactérie"],["a","Animale"],["v","Végétale"]], "a");
    var lab = k.toggle("Légendes", true);
    var ro = k.readouts(["Taille typique", "Noyau délimité", "Paroi", "Équivalent en bactéries (volume)"]);
    var nt = k.note("", "");
    var st = {sec:"a", score:0, tot:0, shown:false};
    var info = {b:{L:2, nom:"Bactérie (procaryote)", noy:"non (nucléoïde)", paroi:"oui (peptidoglycane)"}, a:{L:20, nom:"Cellule animale", noy:"oui", paroi:"non"}, v:{L:80, nom:"Cellule végétale", noy:"oui", paroi:"oui (cellulose)"}};
    k.button("Nouvelle cellule mystère", function(){ var t = ["b","a","v"]; st.sec = t[Math.floor(Math.random() * 3)]; st.shown = false; mode.set("m"); });
    ["b","a","v"].forEach(function(t){ k.button("C'est : " + info[t].nom.split(" (")[0], function(){
      if (mode.value !== "m"){ return; } if (st.shown) return; st.shown = true; st.tot++; if (t === st.sec) st.score++;
    }); });
    function draw(type, hid){
      var ctx = c.ctx, W = c.W, H = c.H, cx = W / 2, cy = H * 0.5, Lr = type === "b" ? Math.min(W * 0.62, 260) : type === "a" ? Math.min(W * 0.62, H * 0.82) : Math.min(W * 0.7, H * 0.88);
      var L = lab.value && !hid;
      function lb(s, x, y, tx, ty){ if (!L) return; S.draw.line(c, x, y, tx, ty, "#5f6b7a", 1); B4.txt(c, s, tx, ty + (ty < y ? -8 : 8), B4.pal.ink, 12, "center"); }
      if (type === "b"){
        var w = Lr, h = Lr * 0.42;
        B4.rr(c, cx - w / 2 - 5, cy - h / 2 - 5, w + 10, h + 10, h / 2 + 5, "rgba(180,83,9,.2)", B4.pal.amber, 3);
        B4.rr(c, cx - w / 2, cy - h / 2, w, h, h / 2, "rgba(255,247,237,.9)", "#7c4a0d", 1.5);
        ctx.save(); ctx.strokeStyle = B4.pal.violet; ctx.lineWidth = 2.2; ctx.beginPath(); var t0 = -w * 0.2; ctx.moveTo(cx + t0, cy);
        for (var i = 0; i < 40; i++){ ctx.lineTo(cx + t0 + i * w * 0.011, cy + Math.sin(i * 0.9) * h * 0.22 + Math.cos(i * 0.31) * h * 0.1); } ctx.stroke(); ctx.restore();
        var r = B4.rng(5); for (i = 0; i < 18; i++) S.draw.dot(c, cx - w * 0.43 + r() * w * 0.86, cy - h * 0.38 + r() * h * 0.76, 2.2, "#475569");
        ctx.save(); ctx.strokeStyle = "#7c4a0d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + w / 2 + 5, cy); for (i = 1; i < 24; i++) ctx.lineTo(cx + w / 2 + 5 + i * 3, cy + Math.sin(i * 0.8) * 6); ctx.stroke(); ctx.restore();
        lb("nucléoïde (ADN)", cx + w * 0.05, cy, cx - w * 0.1, cy - h / 2 - 28);
        lb("paroi", cx - w / 2 - 3, cy - h / 2 - 3, cx - w / 2 - 6, cy - h / 2 - 28);
        lb("ribosomes", cx - w * 0.35, cy + h * 0.2, cx - w * 0.28, cy + h / 2 + 24);
        lb("flagelle", cx + w / 2 + 40, cy + 4, cx + w / 2 + 6, cy + h / 2 + 24);
      } else if (type === "a"){
        var rx = Lr / 2, ry = Lr * 0.42;
        B4.ell(c, cx, cy, rx, ry, "rgba(254,226,226,.55)", "#9f1239", 3);
        B4.ell(c, cx - rx * 0.1, cy - ry * 0.05, rx * 0.34, rx * 0.34, "rgba(30,63,143,.3)", B4.pal.acc, 2.5); B4.ell(c, cx - rx * 0.05, cy - ry * 0.1, rx * 0.09, rx * 0.09, "rgba(30,63,143,.7)");
        [[0.45, 0.25, 0.2], [-0.5, 0.3, -0.4], [0.5, -0.3, 0.5], [-0.45, -0.38, 0.1]].forEach(function(m){ B4.ell(c, cx + rx * m[0], cy + ry * m[1], rx * 0.14, rx * 0.07, "rgba(180,83,9,.45)", B4.pal.amber, 1.5, m[2]); });
        var r2 = B4.rng(9); for (i = 0; i < 26; i++){ var a = r2() * 6.28, rr0 = 0.25 + r2() * 0.65; S.draw.dot(c, cx + Math.cos(a) * rx * rr0, cy + Math.sin(a) * ry * rr0, 1.8, "#475569"); }
        lb("noyau", cx - rx * 0.1, cy - ry * 0.3, cx - rx * 0.3, cy - ry - 22);
        lb("mitochondrie", cx + rx * 0.5, cy + ry * 0.25, cx + rx * 0.62, cy + ry + 22);
        lb("membrane", cx + rx, cy, cx + rx * 0.82, cy - ry - 22);
      } else {
        var w2 = Lr, h2 = Lr * 0.6, x0 = cx - w2 / 2, y0 = cy - h2 / 2;
        B4.rr(c, x0 - 4, y0 - 4, w2 + 8, h2 + 8, 6, "rgba(34,120,70,.35)", "#2e6b55", 3);
        B4.rr(c, x0, y0, w2, h2, 4, "rgba(240,253,244,.9)", "#2e6b55", 1.2);
        B4.rr(c, x0 + w2 * 0.2, y0 + h2 * 0.2, w2 * 0.55, h2 * 0.6, h2 * 0.2, "rgba(186,230,253,.65)", B4.pal.teal, 1.6);
        B4.ell(c, x0 + w2 * 0.1, y0 + h2 * 0.5, h2 * 0.14, h2 * 0.17, "rgba(30,63,143,.35)", B4.pal.acc, 2);
        var r3 = B4.rng(2); for (i = 0; i < 7; i++){ var px = x0 + w2 * (0.1 + r3() * 0.8), py = i % 2 ? y0 + h2 * (0.08 + r3() * 0.1) : y0 + h2 * (0.85 + r3() * 0.08); B4.ell(c, px, py, w2 * 0.05, w2 * 0.028, "rgba(22,163,74,.8)", "#14532d", 1.2, r3()); }
        B4.ell(c, x0 + w2 * 0.9, y0 + h2 * 0.5, w2 * 0.045, w2 * 0.022, "rgba(180,83,9,.5)", B4.pal.amber, 1.2, 0.5);
        lb("paroi", x0 + w2, y0 + h2 * 0.2, x0 + w2 - 10, y0 - 24);
        lb("grande vacuole", cx + w2 * 0.1, cy, cx + w2 * 0.18, y0 + h2 + 28);
        lb("noyau", x0 + w2 * 0.1, y0 + h2 * 0.5, x0 + 10, y0 - 24);
        lb("chloroplaste", x0 + w2 * 0.35, y0 + h2 * 0.9, x0 + w2 * 0.38, y0 + h2 + 28);
      }
      /* barre d'échelle */
      var Lreal = info[type].L, ppu = (type === "b" ? Lr : Lr) / Lreal, bar = type === "b" ? 0.5 : type === "a" ? 5 : 20, bpx = bar * ppu;
      S.draw.line(c, 16, H - 14, 16 + bpx, H - 14, B4.pal.ink, 4); B4.txt(c, S.fmt(bar, 1) + " µm", 16 + bpx / 2, H - 28, B4.pal.ink, 12);
    }
    k.draw(function(){
      c.clear();
      if (mode.value === "c"){
        var t = typ.value, I = info[t];
        draw(t, false);
        ro.set(0, "≈ " + I.L + " µm"); ro.set(1, I.noy); ro.set(2, I.paroi); ro.set(3, S.fmt(Math.pow(I.L / 2, 3), 0));
        nt.set("<b>" + I.nom + ".</b> " + (t === "b" ? "Pas d'organites entourées de membrane : ADN libre, ribosomes, paroi." : t === "a" ? "Pas de paroi ni de chloroplastes ; mitochondries présentes." : "Paroi, chloroplastes et grande vacuole en plus du noyau et des mitochondries."), "");
      } else {
        draw(st.sec, true);
        ro.set(0, st.shown ? "≈ " + info[st.sec].L + " µm" : "? (lis la barre)"); ro.set(1, st.shown ? info[st.sec].noy : "?"); ro.set(2, st.shown ? info[st.sec].paroi : "?"); ro.set(3, st.shown ? S.fmt(Math.pow(info[st.sec].L / 2, 3), 0) : "?");
        nt.set(st.shown ? "Réponse : <b>" + info[st.sec].nom + "</b>. Score : " + st.score + " / " + st.tot + ". Indices : " + (st.sec === "b" ? "très petite (barre = 0,5 µm), sans noyau, avec paroi et flagelle." : st.sec === "a" ? "forme arrondie, noyau net, pas de paroi, pas de chloroplaste." : "forme anguleuse avec paroi, grande vacuole centrale, chloroplastes verts.") + " Clique sur « Nouvelle cellule mystère » pour recommencer." :
          "Observe : noyau délimité ou non ? paroi ? chloroplastes ? Regarde aussi la barre d'échelle. Puis clique sur ta réponse. Score : " + st.score + " / " + st.tot + ".", st.shown ? "ok" : "");
      }
    });
  }
});
