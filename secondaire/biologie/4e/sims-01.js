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
  rng: function(seed){ var s = seed >>> 0; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; },
  /* bruit déterministe 0..1 pour une case (i, j) */
  hash: function(i, j, s){ var x = Math.sin(i * 127.1 + j * 311.7 + (s || 0) * 74.7) * 43758.5453; return x - Math.floor(x); },
  ease: function(x){ x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); },
  /* hauteur du canevas adaptée à la largeur : ratio « étroit » sous la largeur bp (téléphone), « large » au-dessus */
  adapt: function(c, rNarrow, rWide, bp){
    try { Object.defineProperty(c, "ratio", {configurable:true, get:function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; return w < (bp || 480) ? rNarrow : rWide; }}); c.resize(); } catch (e){}
  },
  /* hexagone (cycle d'un sucre) */
  hex: function(c, x, y, r, fill, stroke, lw){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); for (var i = 0; i < 6; i++){ var a = i * Math.PI / 3 + Math.PI / 6; i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.2; ctx.stroke(); } ctx.restore(); },
  /* texte sur plusieurs lignes (largeur maxi en px) ; renvoie la hauteur utilisée */
  wrap: function(c, s, x, y, maxW, opt){
    opt = opt || {}; var ctx = c.ctx, size = opt.size || 11, lh = opt.lh || size * 1.3, words = String(s).split(" "), line = "", n = 0;
    ctx.save(); ctx.font = (opt.weight || 600) + " " + size + "px Mulish, system-ui, sans-serif";
    var lines = []; words.forEach(function(w){ var t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line){ lines.push(line); line = w; } else line = t; }); if (line) lines.push(line);
    ctx.restore();
    lines.forEach(function(L, i){ SFA.draw.text(c, L, x, y + i * lh, {size:size, color:opt.color || "#2c3a4e", align:opt.align || "left", weight:opt.weight || 600}); n++; });
    return n * lh;
  },
  /* couleur (approchée) d'une longueur d'onde visible, en [r, g, b] */
  lrgb: function(l){
    var r = 0, g = 0, b = 0;
    if (l < 440){ r = -(l - 440) / 60; b = 1; } else if (l < 490){ g = (l - 440) / 50; b = 1; } else if (l < 510){ g = 1; b = -(l - 510) / 20; } else if (l < 580){ r = (l - 510) / 70; g = 1; } else if (l < 645){ r = 1; g = -(l - 645) / 65; } else r = 1;
    return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
  }
};

SFA.sim({
  id:"b4-c01-microscope", ch:"c01", tag:"Classique · microscope",
  titre:"Le microscope : grossir ou distinguer ?",
  resume:"Pilote un microscope optique : clique un objectif, tourne la vis, observe le champ. La loupe et sa courbe d'intensité montrent pourquoi grossir plus ne suffit pas à voir plus fin.",
  but:"Clique un objectif sur la tourelle, choisis l'oculaire et glisse la vis de mise au point (sur le dessin ou au curseur). Le champ montre la préparation ; la loupe et sa courbe disent si deux détails voisins sont séparés. Relève les défis chiffrés.",
  aRetenir:"Grossissement total = grossissement de l'objectif × grossissement de l'oculaire. Le pouvoir de résolution (d ≈ 0,61·λ / ON) est la plus petite distance entre deux points encore séparés : il dépend de l'objectif (son ouverture numérique ON) et de la lumière, pas de l'oculaire. En lumière visible, il ne descend pas sous ≈ 0,2 µm ; le microscope électronique descend beaucoup plus bas.",
  piege:"Un fort grossissement ne rend pas l'image plus nette : si deux points sont plus proches que la résolution, les agrandir ne les sépare pas (« grossissement vide »). Plus l'objectif est fort, plus la profondeur de champ est faible : il faut refaire la mise au point.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.2}); B4.adapt(c, 1.2, 1.02, 480);
    var obj = k.seg("Objectif", [[4,"×4"],[10,"×10"],[40,"×40"],[100,"×100"]], 40);
    var oc = k.seg("Oculaire", [[5,"×5"],[10,"×10"],[15,"×15"]], 10);
    var spec = k.select("Préparation sur la lame", [["oig","Épiderme d'oignon coloré (cellules ≈ 250 µm)"],["sang","Frottis de sang (globules rouges 7,5 µm)"],["bac","Bactéries E. coli (2 µm × 0,6 µm)"],["vir","Virus de la grippe (≈ 0,1 µm)"]], "oig");
    var lam = k.seg("Couleur de la lumière", [[650,"rouge"],[550,"verte"],[450,"bleue"]], 550);
    var foc = k.slider("Vis micrométrique (hauteur de la platine)", -30, 30, 0.5, 0, "µm");
    var dd = k.slider("Écart entre deux détails voisins (loupe)", 0.1, 4, 0.05, 0.5, "µm");
    var ro = k.readouts(["Grossissement total", "Champ observé (diamètre réel)", "Taille apparente de l'objet", "Résolution d = 0,61·λ/ON"]);
    var nt = k.note("", ""), nd = k.note("", "");
    var NA = {4:0.10, 10:0.25, 40:0.65, 100:1.25}, FN = {5:20, 10:18, 15:12}, RING = {4:"#d6453d", 10:"#e8b923", 40:"#5fb3e6", 100:"#f4f6f8"};
    var SIZE = {oig:250, sang:7.5, bac:2, vir:0.1}, NAME = {oig:"cellule d'oignon", sang:"globule rouge", bac:"bactérie", vir:"virus"};
    var st = {z0:0, t:0, defi:null, score:0, tot:0, hits:[], knob:null, drag:null, geo:{}}, cacheF = {}, cacheL = {};
    /* ---------- défis ---------- */
    var DEF = [
      function(){ var g = [40, 50, 100, 150, 200, 400, 600, 1000, 1500][Math.floor(Math.random() * 9)]; return {txt:"Obtiens un grossissement total de ×" + g + ".", ok:function(){ return G() === g; }}; },
      function(){ var o = [[7.5, 3, "un globule rouge (7,5 µm)"], [7.5, 0.75, "un globule rouge (7,5 µm)"], [2, 3, "une bactérie (2 µm)"], [250, 10, "une cellule d'oignon (250 µm)"], [2, 0.8, "une bactérie (2 µm)"]][Math.floor(Math.random() * 5)], g = Math.round(o[1] * 1000 / o[0]);
        return {txt:"Calcule puis règle : quel grossissement total donne à " + o[2] + " une taille apparente de " + S.fmt(o[1], 2) + " mm ?", ok:function(){ return G() === g; }, sol:"×" + g + " (" + S.fmt(o[1] * 1000, 0) + " µm ÷ " + S.fmt(o[0], 1) + " µm)"}; },
      function(){ var d = [0.3, 0.4, 0.6, 1, 1.5, 2.5][Math.floor(Math.random() * 6)]; dd.set(d); foc.set(st.z0);
        return {txt:"Sépare deux détails distants de " + S.fmt(d, 1) + " µm avec l'objectif le plus faible possible (la couleur de lumière compte).", ok:function(){ if (Math.abs(dd.value - d) > 1e-6 || !sep()) return false; var mn = [4, 10, 40, 100].filter(function(o){ return 0.61 * lam.value / 1000 / NA[o] <= d; })[0]; return +obj.value === mn; }}; },
      function(){ obj.set(40); var z; do { z = Math.round((Math.random() * 40 - 20) * 2) / 2; } while (Math.abs(z - foc.value) < 6); st.z0 = z; cacheF = {};
        return {txt:"La platine est déréglée : avec l'objectif ×40, tourne la vis jusqu'à une image nette (puis essaie ×100 : il faudra peut-être retoucher).", ok:function(){ return defocus() === 0 && +obj.value >= 40; }}; }
    ];
    k.button("Défi suivant", function(){ st.defi = DEF[Math.floor(Math.random() * DEF.length)](); st.defi.done = false; st.tot++; }, true);
    k.button("Mise au point parfaite", function(){ foc.set(st.z0); });
    function G(){ return +obj.value * +oc.value; }
    function res(){ return 0.61 * lam.value / 1000 / NA[obj.value]; }           /* µm */
    function dof(){ return lam.value / 1000 / (NA[obj.value] * NA[obj.value]); }  /* µm */
    function defocus(){ return Math.max(0, Math.abs(foc.value - st.z0) - dof() / 2) * 2 * NA[obj.value]; }   /* diamètre de flou (µm) */
    function sigma(){ var s0 = res() / 2, b = defocus() / 2; return Math.sqrt(s0 * s0 + b * b); }
    function sep(){ return dd.value >= 2 * sigma() - 1e-9; }
    /* ---------- préparation (en µm, centrée) ---------- */
    function specimen(ctx, sp, D, s){
      var h = B4.hash, R = D / 2 + 20, lw = 1 / s;
      if (sp === "oig"){
        var rh = 55;
        if (rh * s < 3){ ctx.fillStyle = "#ecd59b"; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.strokeStyle = "rgba(150,105,45,.35)"; ctx.lineWidth = lw; for (var y = -R; y < R; y += rh){ ctx.beginPath(); ctx.moveTo(-R, y); ctx.lineTo(R, y); ctx.stroke(); } return; }
        for (var j = Math.floor(-R / rh); j * rh < R; j++){
          var x = -R - 300 * h(j, 3, 1);
          for (var i = 0; x < R; i++){
            var L = 210 + 90 * h(i, j, 2), y0 = j * rh;
            if (x + L > -R){
              ctx.fillStyle = "#f2dfa6"; ctx.fillRect(x, y0, L, rh);
              ctx.strokeStyle = "#9c6b2e"; ctx.lineWidth = Math.max(2.2, 1.2 * lw); ctx.strokeRect(x, y0, L, rh);
              var nx = x + L * (0.2 + 0.6 * h(i, j, 5)), ny = y0 + rh * (0.3 + 0.4 * h(i, j, 6));
              ctx.fillStyle = "#93591f"; ctx.beginPath(); ctx.ellipse(nx, ny, 10, 8, 0, 0, 6.2832); ctx.fill();
              ctx.fillStyle = "#5c3510"; ctx.beginPath(); ctx.arc(nx + 2, ny - 1.5, 2.6, 0, 6.2832); ctx.fill();
            }
            x += L;
          }
        }
      } else if (sp === "sang"){
        var g = 9.2;
        if (3.75 * s < 1.2){ ctx.fillStyle = "#f0c3c6"; ctx.fillRect(-R, -R, 2 * R, 2 * R); }
        else for (var a = Math.floor(-R / g); a * g < R; a++) for (var b = Math.floor(-R / g); b * g < R; b++){
          if (h(a, b, 9) < 0.08) continue;
          var px = a * g + (h(a, b, 1) - 0.5) * 4, py = b * g + (h(a, b, 2) - 0.5) * 4;
          var gr = ctx.createRadialGradient(px, py, 0.5, px, py, 3.75); gr.addColorStop(0, "#f7d9da"); gr.addColorStop(0.55, "#e9a5ab"); gr.addColorStop(1, "#c9636f");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, 3.75, 0, 6.2832); ctx.fill();
        }
        var gw = 70;
        for (a = Math.floor(-R / gw); a * gw < R; a++) for (b = Math.floor(-R / gw); b * gw < R; b++){
          var wx = a * gw + 20 * h(a, b, 4), wy = b * gw + 20 * h(a, b, 5);
          if (h(a, b, 7) < 0.25){ ctx.fillStyle = "#e3d4ee"; ctx.beginPath(); ctx.arc(wx, wy, 6, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#5e3392"; [[-2, -1.5], [1.8, -2], [0.5, 2.2]].forEach(function(q){ ctx.beginPath(); ctx.arc(wx + q[0], wy + q[1], 1.9, 0, 6.2832); ctx.fill(); }); }
          if (h(a, b, 8) < 0.6){ ctx.fillStyle = "#7d4fb0"; ctx.beginPath(); ctx.arc(wx + 30, wy - 12, 1.2, 0, 6.2832); ctx.fill(); }
        }
      } else if (sp === "bac"){
        var gb = 5;
        ctx.fillStyle = "#fbf4f6"; ctx.fillRect(-R, -R, 2 * R, 2 * R);
        if (2 * s < 0.8){ ctx.fillStyle = "rgba(208,86,127,.18)"; ctx.fillRect(-R, -R, 2 * R, 2 * R); return; }
        ctx.strokeStyle = "#cc4f7c"; ctx.lineCap = "round"; ctx.lineWidth = 0.6;
        for (a = Math.floor(-R / gb); a * gb < R; a++) for (b = Math.floor(-R / gb); b * gb < R; b++){
          if (h(a, b, 3) > 0.55) continue;
          var bx = a * gb + (h(a, b, 1) - 0.5) * 3, by = b * gb + (h(a, b, 2) - 0.5) * 3, an = h(a, b, 4) * 3.1416;
          ctx.beginPath(); ctx.moveTo(bx - 0.7 * Math.cos(an), by - 0.7 * Math.sin(an)); ctx.lineTo(bx + 0.7 * Math.cos(an), by + 0.7 * Math.sin(an)); ctx.stroke();
        }
      } else {
        ctx.fillStyle = "#faf8fc"; ctx.fillRect(-R, -R, 2 * R, 2 * R);
        var gv = 2.5, al = Math.min(1, Math.pow(0.1 / res(), 2));
        if (gv * s < 2){ ctx.fillStyle = "rgba(107,74,160," + (0.12 * al) + ")"; ctx.fillRect(-R, -R, 2 * R, 2 * R); return; }
        ctx.fillStyle = "rgba(107,74,160," + al + ")";
        for (a = Math.floor(-R / gv); a * gv < R; a++) for (b = Math.floor(-R / gv); b * gv < R; b++){ if (h(a, b, 3) > 0.5) continue; ctx.beginPath(); ctx.arc(a * gv + h(a, b, 1), b * gv + h(a, b, 2), Math.max(0.05, 0.5 / s), 0, 6.2832); ctx.fill(); }
      }
    }
    function fieldImage(R){
      var D = FN[oc.value] * 1000 / obj.value, M = Math.max(40, Math.round(2 * R)), s = M / D, blur = Math.sqrt(Math.pow(res() * s, 2) + Math.pow(defocus() * s, 2));
      var key = [spec.value, obj.value, oc.value, M, Math.round(blur * 4), lam.value].join("|");
      if (cacheF.key === key) return cacheF.cv;
      var cv = document.createElement("canvas"); cv.width = cv.height = M; var x = cv.getContext("2d");
      x.fillStyle = "#fffdf7"; x.fillRect(0, 0, M, M);
      x.save(); x.translate(M / 2, M / 2); x.scale(s, s); specimen(x, spec.value, D, s); x.restore();
      if (blur > 1.15){
        var N = Math.max(6, Math.round(M / blur)), sm = document.createElement("canvas"); sm.width = sm.height = N; var y = sm.getContext("2d");
        y.imageSmoothingEnabled = true; y.drawImage(cv, 0, 0, N, N);
        x.imageSmoothingEnabled = true; x.clearRect(0, 0, M, M); x.drawImage(sm, 0, 0, M, M);
      }
      var rgb = B4.lrgb(+lam.value); x.globalCompositeOperation = "multiply"; x.fillStyle = "rgba(" + Math.round(205 + rgb[0] * 0.196) + "," + Math.round(205 + rgb[1] * 0.196) + "," + Math.round(205 + rgb[2] * 0.196) + ",1)"; x.fillRect(0, 0, M, M); x.globalCompositeOperation = "source-over";
      cacheF = {key:key, cv:cv, D:D}; return cv;
    }
    function loupeImage(Lp){
      var ppu = G() * 0.12, sg = sigma(), d = dd.value, key = [Lp, ppu, sg.toFixed(4), d, lam.value].join("|");
      if (cacheL.key === key) return cacheL.cv;
      var n = Math.max(30, Math.round(Lp)), cv = document.createElement("canvas"); cv.width = cv.height = n; var x = cv.getContext("2d"), im = x.createImageData(n, n), rgb = B4.lrgb(+lam.value);
      var base = [255 - (255 - rgb[0]) * 0.45, 255 - (255 - rgb[1]) * 0.45, 255 - (255 - rgb[2]) * 0.45], k2 = 1 / (2 * sg * sg), amp = 0.42 * Math.pow(res() / 2 / sg, 2);
      for (var j = 0; j < n; j++) for (var i = 0; i < n; i++){
        var ux = (i - n / 2) / ppu, uy = (j - n / 2) / ppu, A = Math.exp(-((ux + d / 2) * (ux + d / 2) + uy * uy) * k2) + Math.exp(-((ux - d / 2) * (ux - d / 2) + uy * uy) * k2), I = 1 - amp * A, o = (j * n + i) * 4;
        im.data[o] = base[0] * I; im.data[o + 1] = base[1] * I; im.data[o + 2] = base[2] * I; im.data[o + 3] = 255;
      }
      x.putImageData(im, 0, 0); cacheL = {key:key, cv:cv}; return cv;
    }
    function profile(u){ var sg = sigma(), d = dd.value, k2 = 1 / (2 * sg * sg); return 1 - 0.42 * Math.pow(res() / 2 / sg, 2) * (Math.exp(-(u + d / 2) * (u + d / 2) * k2) + Math.exp(-(u - d / 2) * (u - d / 2) * k2)); }
    /* ---------- dessin du microscope ---------- */
    function scope(ox, oy, u, cw){
      var ctx = c.ctx, X = function(v){ return ox + v * u; }, Y = function(v){ return oy + v * u; }, dz = Math.max(-1, Math.min(1, foc.value / 30)) * 2.2, o = +obj.value;
      st.hits = [];
      /* faisceau lumineux animé */
      ctx.save(); ctx.strokeStyle = "rgba(244,197,66,.55)"; ctx.lineWidth = 2.2 * u; ctx.setLineDash([2.2 * u, 3 * u]); ctx.lineDashOffset = -st.t * 18 * u; ctx.beginPath(); ctx.moveTo(X(24), Y(88)); ctx.lineTo(X(24), Y(2)); ctx.stroke(); ctx.restore();
      /* socle, lampe, potence */
      S.draw.rrect(c, X(5), Y(89), 50 * u, 9 * u, 2.5 * u); ctx.fillStyle = "#2f3e55"; ctx.fill();
      S.draw.glow(c, X(24), Y(89), 7 * u, P.yellow, 0.9); ctx.beginPath(); ctx.arc(X(24), Y(89.5), 2.4 * u, 0, 6.2832); ctx.fillStyle = "#ffe08a"; ctx.fill();
      ctx.save(); ctx.strokeStyle = "#3d4f6b"; ctx.lineWidth = 6 * u; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X(48), Y(89)); ctx.lineTo(X(48), Y(42)); ctx.quadraticCurveTo(X(48), Y(27), X(33), Y(25)); ctx.stroke(); ctx.restore();
      /* condenseur + platine (monte et descend avec la vis) */
      ctx.fillStyle = "#56677f"; ctx.beginPath(); ctx.moveTo(X(19), Y(70 + dz)); ctx.lineTo(X(29), Y(70 + dz)); ctx.lineTo(X(27), Y(76 + dz)); ctx.lineTo(X(21), Y(76 + dz)); ctx.closePath(); ctx.fill();
      S.draw.rrect(c, X(7), Y(65 + dz), 41 * u, 3.4 * u, u); ctx.fillStyle = "#2f3e55"; ctx.fill();
      S.draw.rrect(c, X(12), Y(63.6 + dz), 25 * u, 1.5 * u, 0.4 * u); ctx.fillStyle = "rgba(170,215,240,.9)"; ctx.fill(); ctx.strokeStyle = "#7fb2cf"; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(X(24), Y(64.3 + dz), 1.6 * u, 0, 6.2832); ctx.fillStyle = spec.value === "oig" ? "#c9a35a" : spec.value === "sang" ? "#d9737d" : spec.value === "bac" ? "#cc4f7c" : "#8a6bbd"; ctx.fill();
      ctx.fillStyle = "#56677f"; ctx.fillRect(X(9), Y(62.2 + dz), 6 * u, 1.4 * u); ctx.fillRect(X(33), Y(62.2 + dz), 6 * u, 1.4 * u);
      /* vis macro / micrométrique (à glisser) */
      var kx = X(48), ky = Y(70), kr = 5 * u, rot = foc.value / 30 * 3.1416;
      ctx.beginPath(); ctx.arc(kx, ky, kr, 0, 6.2832); ctx.fillStyle = "#506380"; ctx.fill(); ctx.strokeStyle = st.drag === "knob" ? P.red : "#24324a"; ctx.lineWidth = st.drag === "knob" ? 2.5 : 1.5; ctx.stroke();
      for (var q = 0; q < 10; q++){ var a = rot + q * 0.628; ctx.beginPath(); ctx.moveTo(kx + Math.cos(a) * kr * 0.55, ky + Math.sin(a) * kr * 0.55); ctx.lineTo(kx + Math.cos(a) * kr * 0.95, ky + Math.sin(a) * kr * 0.95); ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(kx, ky, kr * 0.42, 0, 6.2832); ctx.fillStyle = "#7489a8"; ctx.fill();
      st.knob = {x:kx, y:ky, r:kr + 10};
      /* tube et oculaire */
      S.draw.rrect(c, X(20), Y(9), 8 * u, 18 * u, u); ctx.fillStyle = "#3d4f6b"; ctx.fill();
      S.draw.rrect(c, X(20.8), Y(2), 6.4 * u, 7.5 * u, u); ctx.fillStyle = "#24324a"; ctx.fill();
      ctx.fillStyle = "#c9d3df"; ctx.fillRect(X(20.8), Y(6.2), 6.4 * u, 0.9 * u);
      /* tourelle et objectifs */
      ctx.beginPath(); ctx.moveTo(X(15), Y(27)); ctx.lineTo(X(33), Y(27)); ctx.lineTo(X(30), Y(33)); ctx.lineTo(X(18), Y(33)); ctx.closePath(); ctx.fillStyle = "#56677f"; ctx.fill();
      var others = [4, 10, 40, 100].filter(function(v){ return v !== o; }), ang = [-0.62, 0.62, 0.0];
      var LEN = {4:9, 10:11, 40:14, 100:16};
      function objective(v, angle, active){
        var len = LEN[v] * (active ? 1 : 0.78), w = (active ? 4.4 : 3.6) * u;
        ctx.save(); ctx.translate(X(24), Y(32.5)); ctx.rotate(angle);
        ctx.globalAlpha = active ? 1 : 0.9;
        S.draw.rrect(c, -w / 2, 0, w, len * u, 0.8 * u); var gg = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); gg.addColorStop(0, "#c9d3df"); gg.addColorStop(0.5, "#f4f6f8"); gg.addColorStop(1, "#9aa6b6"); ctx.fillStyle = gg; ctx.fill(); ctx.strokeStyle = active ? "#13233a" : "#7b8694"; ctx.lineWidth = active ? 1.6 : 1; ctx.stroke();
        ctx.fillStyle = RING[v]; ctx.fillRect(-w / 2, len * u * 0.55, w, 1.4 * u); if (v === 100){ ctx.strokeStyle = "#13233a"; ctx.lineWidth = 0.8; ctx.strokeRect(-w / 2, len * u * 0.55, w, 1.4 * u); }
        S.draw.rrect(c, -w * 0.32, len * u - 0.4 * u, w * 0.64, 1.6 * u, 0.5 * u); ctx.fillStyle = "#56677f"; ctx.fill();
        ctx.restore();
        var tipx = X(24) + Math.sin(-angle) * len * u * 0.6, tipy = Y(32.5) + Math.cos(angle) * len * u * 0.6;
        st.hits.push({v:v, x:tipx, y:tipy, r:Math.max(14, 4 * u)});
        return {x:tipx, y:tipy, len:len};
      }
      objective(others[2], 0.0, false); objective(others[0], -0.62, false); objective(others[1], 0.62, false);
      var act = objective(o, 0, true);
      if (o === 100){ ctx.beginPath(); ctx.arc(X(24), Y(32.5 + LEN[100]) + 0.4 * u, 1.1 * u, 0, 3.1416); ctx.fillStyle = "rgba(240,220,140,.8)"; ctx.fill(); }
      /* étiquettes (dessinées après le champ) */
      st.lab = {X:X, Y:Y, o:o, dz:dz, kx:kx, ky:ky, kr:kr, cw:cw};
    }
    function scopeLabels(){
      var L = st.lab, X = L.X, Y = L.Y, o = L.o, dz = L.dz, kx = L.kx, ky = L.ky, kr = L.kr, cw = L.cw, fs = cw < 150 ? 9 : 10.5;
      S.draw.label(c, (cw < 150 ? "oc. ×" : "oculaire ×") + oc.value, X(29), Y(5), {color:P.ink, size:fs, align:"left"});
      S.draw.label(c, (cw < 150 ? "obj. ×" : "objectif ×") + o, X(29), Y(47.5), {color:"#1f4b9e", size:fs, align:"left"});
      S.draw.label(c, "platine", X(7.5), Y(60.5 + dz), {color:"#5f6b7a", size:fs, align:"left"});
      S.draw.label(c, "vis", kx, ky + kr + 9, {color:st.drag === "knob" ? P.red : "#5f6b7a", size:fs});
      S.draw.label(c, "lampe", X(13), Y(84.5), {color:"#8a6d1a", size:fs});
      S.draw.text(c, "clique un objectif", X(14), Y(51), {size:fs - 0.5, color:"#5f6b7a", weight:600});
    }
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); }); lp.play();
    c.pointer(function(type, p){
      if (type === "down"){
        if (st.knob && Math.hypot(p.x - st.knob.x, p.y - st.knob.y) < st.knob.r){ st.drag = "knob"; st.px = p.x; st.f0 = foc.value; return; }
        var g = st.geo; if (g.lx !== undefined && p.x >= g.lx && p.x <= g.lx + g.lp && p.y >= g.ly && p.y <= g.ly + g.lp){ st.drag = "loupe"; }
        else { var best = null; st.hits.forEach(function(hh){ if (Math.hypot(p.x - hh.x, p.y - hh.y) < hh.r) best = hh; }); if (best){ obj.set(best.v); k.redraw(); return; } }
      }
      if (type === "drag" && st.drag === "knob"){ foc.set(Math.round((st.f0 + (p.x - st.px) * 0.2) * 2) / 2); k.redraw(); }
      if ((type === "down" || type === "drag") && st.drag === "loupe"){ var gg = st.geo, u = Math.abs(p.x - (gg.lx + gg.lp / 2)) * 2 / (G() * 0.12); dd.set(Math.round(Math.max(0.1, Math.min(4, u)) * 20) / 20); k.redraw(); }
      if (type === "up") st.drag = null;
    });
    c.cv.style.touchAction = "pan-y";
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, wide = W >= 480;
      var topH = wide ? H * 0.6 : H * 0.56, cw = W * (wide ? 0.33 : 0.38);
      /* microscope */
      var u = Math.min(cw / 58, (topH - 8) / 100); scope(4 + (cw - 58 * u) / 2, 4 + (topH - 8 - 100 * u) / 2, u, cw);
      /* champ */
      var fx = cw + (W - cw) / 2, fy = topH / 2 + 2, Rmax = Math.min((W - cw) / 2 - 8, topH / 2 - 16), R = Rmax * Math.min(1, FN[oc.value] * oc.value / 180);
      var D = FN[oc.value] * 1000 / obj.value;
      ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, Rmax + 6, 0, 6.2832); ctx.fillStyle = "#0b1220"; ctx.fill(); ctx.restore();
      var img = fieldImage(R);
      ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, R, 0, 6.2832); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.drawImage(img, fx - R, fy - R, 2 * R, 2 * R);
      var vg = ctx.createRadialGradient(fx, fy, R * 0.65, fx, fy, R); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(10,18,32,.35)"); ctx.fillStyle = vg; ctx.fillRect(fx - R, fy - R, 2 * R, 2 * R);
      var bar = B4.nice(D / 4), bpx = bar / D * 2 * R; S.draw.line(c, fx - bpx / 2, fy + R * 0.78, fx + bpx / 2, fy + R * 0.78, "#13233a", 3); S.draw.label(c, (bar >= 1000 ? S.fmt(bar / 1000, 1) + " mm" : S.fmt(bar, bar < 1 ? 2 : 0) + " µm"), fx, fy + R * 0.78 - 12, {color:P.ink, size:10});
      ctx.restore();
      ctx.beginPath(); ctx.arc(fx, fy, R, 0, 6.2832); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, "champ vu dans l'oculaire · " + S.fmt(D >= 1000 ? D / 1000 : D, D >= 1000 ? 2 : 0) + (D >= 1000 ? " mm" : " µm"), fx, topH - 4, {size:wide ? 11 : 9.5, color:"#5f6b7a", weight:600});
      scopeLabels();
      var blurF = defocus();
      if (blurF > 0.3 * res() + 0.05) S.draw.label(c, "flou : tourne la vis", fx, fy - R + 16, {color:P.red, size:10});
      /* loupe + courbe d'intensité */
      var by = topH + 16, bh = H - by - 6, lp2 = Math.min(bh - 18, W * (wide ? 0.3 : 0.36)), lx = 10, ly = by + 14;
      st.geo = {lx:lx, ly:ly, lp:lp2};
      S.draw.text(c, wide ? "Loupe sur deux détails (glisse dessus)" : "Loupe (glisse)", lx, by + 2, {size:wide ? 11 : 9.5, color:P.ink, align:"left"});
      ctx.save(); S.draw.rrect(c, lx, ly, lp2, lp2, 10); ctx.clip(); ctx.drawImage(loupeImage(lp2), lx, ly, lp2, lp2); ctx.restore();
      S.draw.rrect(c, lx, ly, lp2, lp2, 10); ctx.strokeStyle = st.drag === "loupe" ? P.red : "#13233a"; ctx.lineWidth = 2; ctx.stroke();
      var ppu = G() * 0.12, wl = lp2 / ppu, d = dd.value, rr = res(), sg = sigma(), ok = sep();
      [-d / 2, d / 2].forEach(function(xx){ var px = lx + lp2 / 2 + xx * ppu; if (px > lx && px < lx + lp2){ S.draw.line(c, px, ly + lp2 - 9, px, ly + lp2 - 2, P.red, 2.5); } });
      S.draw.label(c, "largeur " + (wl >= 1 ? S.fmt(wl, 1) : S.fmt(wl, 2)) + " µm", lx + lp2 / 2, ly + 12, {color:P.ink, size:9.5});
      var gx0 = lx + lp2 + 10;
      var pf = function(x){ return profile(x - wl / 2); };
      var ax = S.draw.axes(c, {x0:0, x1:wl, y0:0, y1:1.1, l:gx0 + 26, r:10, t:ly + 4, b:H - (ly + lp2) + 2, xl:"x (µm)", yl:"intensité", stepY:0.5});
      S.draw.area(c, ax, pf, 0, wl, ok ? P.green : P.amber, 0.12);
      S.draw.fn(c, ax, pf, ok ? P.green : P.amber, 2.6);
      [-d / 2, d / 2].forEach(function(xx){ if (xx > -wl / 2 && xx < wl / 2) S.draw.line(c, ax.X(xx + wl / 2), ax.B - 1, ax.X(xx + wl / 2), ax.B - 9, P.red, 2.5); });
      S.draw.label(c, ok ? "deux creux : séparés" : "un creux : confondus", W - 8, by + 2, {color:ok ? P.green : P.red, size:wide ? 10.5 : 9.5, align:"right"});
      /* lectures */
      var g = G(), size = SIZE[spec.value];
      ro.set(0, "×" + g + " (" + obj.value + " × " + oc.value + ")");
      ro.set(1, D >= 1000 ? S.fmt(D / 1000, 2) + " mm" : S.fmt(D, 0) + " µm");
      var app = size * g / 1000; ro.set(2, (app < 1 ? S.fmt(app, 2) : S.fmt(app, 1)) + " mm");
      ro.set(3, S.fmt(rr * 1000, 0) + " nm (ON " + S.fmt(NA[obj.value], 2) + ")");
      var vis = size >= rr, msg;
      if (!vis) msg = "Un " + NAME[spec.value] + " mesure ≈ " + S.fmt(size * 1000, 0) + " nm, moins que la résolution (" + S.fmt(rr * 1000, 0) + " nm) : au microscope optique on n'en voit au mieux qu'un vague grain, quel que soit le grossissement.";
      else if (size > D) msg = "L'objet (" + S.fmt(size, 0) + " µm) est plus grand que le champ (" + S.fmt(D, 0) + " µm) : on n'en voit qu'une partie. Prends un objectif plus faible.";
      else msg = "Taille apparente = " + S.fmt(size, size < 10 ? 1 : 0) + " µm × " + g + " = " + (app < 1 ? S.fmt(app, 2) : S.fmt(app, 1)) + " mm. On aligne ≈ " + S.fmt(D / size, D / size < 10 ? 1 : 0) + " " + NAME[spec.value] + "s dans le diamètre du champ.";
      msg += " Loupe : écart " + S.fmt(d, 2) + " µm " + (ok ? "≥" : "<") + " " + (sg > rr / 2 * 1.02 ? "résolution effective (flou compris) " + S.fmt(2 * sg, 2) : "résolution " + S.fmt(rr, 2)) + " µm : " + (ok ? "les deux détails sont séparés." : "ils se fondent en une tache. Change d'objectif ou de couleur, pas d'oculaire !");
      nt.set(msg, ok && vis ? "ok" : "warn");
      if (st.defi){
        if (!st.defi.done && st.defi.ok()){ st.defi.done = true; st.score++; }
        nd.set("<b>Défi " + st.tot + "</b> · " + st.defi.txt + (st.defi.done ? "<br><b>Réussi !</b>" + (st.defi.sol ? " Réponse : " + st.defi.sol + "." : "") : "") + " Score : " + st.score + " / " + st.tot + ".", st.defi.done ? "ok" : "warn");
      } else nd.set("Clique sur « Défi suivant » pour un objectif chiffré (grossissement, taille apparente, séparation, mise au point).", "");
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
