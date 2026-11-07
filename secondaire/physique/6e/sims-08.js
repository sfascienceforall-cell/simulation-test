/* Chapitre 8 · Ondes électromagnétiques, interférences, spectres */
SFA.sim({
  id: "p6-c08-spectre-em", ch: "c08", tag: "Classique",
  titre: "Le spectre électromagnétique : c = λ·f",
  resume: "De l'onde radio aux rayons γ : même nature, longueurs d'onde différentes, énergies très différentes.",
  but: "Fais glisser le curseur sur une échelle logarithmique de longueurs d'onde (de 10⁻¹³ m à 10⁴ m). Lis la fréquence, l'énergie du photon, le domaine et un exemple. Les repères rapides te placent sur des cas concrets.",
  aRetenir: "Toutes les ondes électromagnétiques se propagent dans le vide à la même vitesse c = 3,00·10⁸ m/s et vérifient c = λ·f. De la radio aux rayons γ, la fréquence augmente quand la longueur d'onde diminue. La lumière visible n'occupe qu'un étroit domaine (≈ 380 à 750 nm). L'énergie d'un photon E = h·f augmente avec la fréquence : les X et γ sont ionisants, pas les ondes radio.",
  piege: "Radio, micro-ondes, lumière, rayons X sont de même nature : seule la fréquence change. Et un four à micro-ondes n'émet pas de rayonnement ionisant : l'énergie du photon est trop faible. Les limites entre domaines sont conventionnelles (elles varient légèrement selon les sources).",
  build: function(k, S){
    var c = k.canvas(200), z = k.canvas(78), P = S.draw.palette, C = 3.00e8, HEV = 1.2398e-6;
    var bands = [[-13, -11, "gamma", "#6d28d9"], [-11, -8, "X", "#7c3aed"], [-8, Math.log10(3.8e-7), "UV", "#a78bfa"], [Math.log10(3.8e-7), Math.log10(7.5e-7), "visible", "#16a34a"], [Math.log10(7.5e-7), -3, "infrarouge", "#dc2626"], [-3, 0, "micro-ondes", "#f59e0b"], [0, 4, "ondes radio", "#0e7490"]];
    var x = k.slider("Exposant : λ = 10^x mètres", -13, 4, 0.1, -6.26, "");
    k.select("Repère rapide", [["", "— choisir —"], ["-12", "Rayons γ d'un noyau (≈ 10⁻¹² m)"], ["-10", "Rayons X médicaux (≈ 0,1 nm)"], ["-7", "Ultraviolet (≈ 100 nm)"], ["-6.26", "Lumière verte (550 nm)"], ["-5", "Infrarouge du corps humain (≈ 10 µm)"], ["-1.9", "Four à micro-ondes et Wi-Fi (12 cm)"], ["0.5", "Radio FM (≈ 3 m)"], ["2.5", "Radio grandes ondes (≈ 300 m)"]], "", function(v){ if (v !== "") x.set(parseFloat(v)); });
    var ro = k.readouts(["Longueur d'onde λ", "Fréquence f = c/λ", "Énergie du photon", "Domaine"]);
    var nt = k.note("", "ok");
    function lam(l){ return l < 1e-9 ? S.sci(l * 1e12) + " pm" : l < 1e-6 ? S.fmt(l * 1e9, 1) + " nm" : l < 1e-3 ? S.fmt(l * 1e6, 1) + " µm" : l < 1 ? S.fmt(l * 1e3, 1) + " mm" : l < 1e3 ? S.fmt(l, 1) + " m" : S.fmt(l / 1e3, 1) + " km"; }
    function frq(f){ return f >= 1e18 ? S.fmt(f / 1e18, 1) + " EHz" : f >= 1e15 ? S.fmt(f / 1e15, 1) + " PHz" : f >= 1e12 ? S.fmt(f / 1e12, 1) + " THz" : f >= 1e9 ? S.fmt(f / 1e9, 1) + " GHz" : f >= 1e6 ? S.fmt(f / 1e6, 1) + " MHz" : S.fmt(f / 1e3, 1) + " kHz"; }
    var geo = {};
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(tp, p){ if (tp === "move" || tp === "up" || !geo.x1) return; var v = -13 + (geo.x1 - p.x) / (geo.x1 - geo.x0) * 17; x.set(Math.round(Math.max(-13, Math.min(4, v)) * 10) / 10); k.redraw(); });
    var EX = [[-12.3, "noyaux", 1], [-10, "radiographie", 0], [-7.4, "bronzage", 1], [-6.3, "lumière", 0], [-4.6, "chaleur", 1], [-2.1, "Wi-Fi · four", 0], [0.6, "radio FM", 1], [3, "grandes ondes", 0]];
    k.draw(function(){
      c.clear(); z.clear(); var ctx = c.ctx, W = c.W, x0 = 14, x1 = W - 14; geo.x0 = x0; geo.x1 = x1;
      function X(v){ return x1 - (v + 13) / 17 * (x1 - x0); }   /* les petites λ à droite */
      var by = 78, bh = 40;
      S.draw.text(c, "plus petite λ →", x1, 14, {size: 11.5, align: "right", color: P.grey}); S.draw.text(c, "← plus grande λ", x0, 14, {size: 11.5, align: "left", color: P.grey});
      bands.forEach(function(b, bi){
        var xa = X(b[1]), xb = X(b[0]);
        if (b[2] === "visible"){ var g = ctx.createLinearGradient(xa, 0, xb, 0); for (var i = 0; i <= 10; i++){ g.addColorStop(i / 10, P6.rgb(750 - (750 - 380) * i / 10)); } ctx.fillStyle = g; }
        else ctx.fillStyle = b[3];
        ctx.globalAlpha = b[2] === "visible" ? 1 : 0.88; ctx.fillRect(xa, by, xb - xa, bh); ctx.globalAlpha = 1;
        var nm = {"gamma": "γ", "X": "X", "UV": "UV", "visible": "", "infrarouge": "IR", "micro-ondes": "micro-ondes", "ondes radio": "ondes radio"}[b[2]];
        if (W < 520 && b[2] === "micro-ondes") nm = "µ-ondes"; if (W < 520 && b[2] === "ondes radio") nm = "radio";
        if (nm) S.draw.text(c, nm, (xa + xb) / 2, by + bh / 2, {size: 12.5, color: "#fff"});
      });
      S.draw.line(c, (X(bands[3][0]) + X(bands[3][1])) / 2, by + bh, (X(bands[3][0]) + X(bands[3][1])) / 2, by + bh + 32, P.green, 1.2, [2, 2]);
      ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = 1; ctx.strokeRect(x0, by, x1 - x0, bh);
      for (var e = -13; e <= 4; e += 1){ S.draw.line(c, X(e), by + bh, X(e), by + bh + (e % 3 === 0 ? 8 : 4), P.ink, 1); if (e % 3 === 0 && e > -13 && e < 4) S.draw.text(c, "10" + (e < 0 ? "⁻" : "") + String(Math.abs(e)).replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }) + " m", X(e), by + bh + 21, {size: 10.5, color: "#4a5668", weight: 600}); }
      var l = Math.pow(10, x.value), f = C / l, E = HEV / l, px = X(x.value);
      /* repères d'exemples sous la règle */
      EX.forEach(function(q){ if (W < 520 && (q[1] === "radiographie" || q[1] === "grandes ondes")) return; S.draw.text(c, q[1], Math.min(Math.max(X(q[0]), 34), W - 34), by + bh + 42 + (q[2] ? 15 : 0), {size: 10.5, color: q[1] === "lumière" ? P.green : "#5f6b7a", weight: q[1] === "lumière" ? 800 : 600}); });
      /* curseur */
      S.draw.line(c, px, by - 20, px, by + bh, P.ink, 2); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(px, by - 4); ctx.lineTo(px - 8, by - 22); ctx.lineTo(px + 8, by - 22); ctx.closePath(); ctx.fill();
      S.draw.label(c, "λ = " + lam(l), Math.min(Math.max(px, 50), W - 50), 38, {color: P.ink, size: 12.5});
      S.draw.label(c, "f = " + frq(f), Math.min(Math.max(px, 50), W - 50), 58, {color: P.acc, size: 11.5});
      /* loupe sur le visible */
      var zx0 = 16, zx1 = z.W - 16, zc = z.ctx, vis = x.value >= bands[3][0] - 1e-9 && x.value <= bands[3][1] + 1e-9;
      for (var wv = 0; wv <= 1; wv += 1 / 120){ zc.fillStyle = P6.rgb(380 + 370 * wv); zc.fillRect(zx0 + wv * (zx1 - zx0), 18, (zx1 - zx0) / 120 + 1, 26); }
      zc.strokeStyle = "rgba(15,27,45,.35)"; zc.strokeRect(zx0, 18, zx1 - zx0, 26);
      [400, 450, 500, 550, 600, 650, 700, 750].forEach(function(wv){ var xx = zx0 + (wv - 380) / 370 * (zx1 - zx0); S.draw.line(z, xx, 44, xx, 49, P.ink, 1); if (wv % 100 === 0 || z.W > 520) S.draw.text(z, wv, xx, 59, {size: 10.5, color: "#4a5668", weight: 600}); });
      S.draw.text(z, "Zoom sur le visible (nm)", z.W / 2, 7, {size: 11, color: P.green});
      if (vis){ var wn = l * 1e9, xx2 = zx0 + (wn - 380) / 370 * (zx1 - zx0); S.draw.line(z, xx2, 14, xx2, 44, P.ink, 2.4); S.draw.label(z, S.fmt(wn, 0) + " nm", Math.min(Math.max(xx2, 40), z.W - 40), 70, {color: P.ink, size: 11}); }
      else S.draw.text(z, "(le curseur est hors du visible)", z.W / 2, 70, {size: 11, color: P.grey, weight: 600});
      var dom = bands.filter(function(b){ return x.value >= b[0] && x.value < b[1] + 1e-9; }).pop(); var nm2 = dom ? dom[2] : "";
      ro.set(0, lam(l)); ro.set(1, frq(f)); ro.set(2, E >= 1000 ? S.sci(E / 1000) + " keV" : E < 1e-3 ? S.sci(E) + " eV" : S.sci(E) + " eV"); ro.set(3, nm2);
    var info = {gamma: "Rayons γ : émis par des noyaux ; très ionisants ; radiothérapie, stérilisation.", X: "Rayons X : radiographie, scanner ; ionisants.", UV: "Ultraviolets : bronzage, coups de soleil ; les UV-C stérilisent. Ionisants dans leur partie la plus énergétique.", visible: "Lumière visible : le seul domaine que l'œil perçoit. Rouge ≈ 700 nm, violet ≈ 400 nm.", infrarouge: "Infrarouge : chaleur rayonnée, télécommandes, caméras thermiques.", "micro-ondes": "Micro-ondes : four (2,45 GHz), Wi-Fi, GSM, radar.", "ondes radio": "Ondes radio : radio FM (≈ 100 MHz), télévision, communications."};
      nt.set(info[nm2] || "", "ok");
    });
  }
});

SFA.sim({
  id: "p6-c08-young-reseau", ch: "c08", tag: "Interférences",
  titre: "Fentes d'Young et réseau de diffraction",
  resume: "i = λ·D/a pour deux fentes ; sin θ = m·λ/d pour un réseau : la lumière interfère.",
  but: "Choisis les fentes d'Young (nombre de fentes réglable) ou le réseau. Change la longueur d'onde (la couleur du laser) et les distances : la figure d'interférence change en direct.",
  aRetenir: "Deux fentes éclairées par la même lumière donnent des franges alternativement brillantes et sombres, d'interfrange i = λ·D/a (petits angles) : plus λ est grande, plus les franges sont larges. Avec N fentes, les maxima restent à la même place mais s'affinent. Un réseau (grand N, pas d = 1/n) disperse la lumière : maxima à sin θ = m·λ/d. La lumière blanche donne des spectres colorés (violet le moins dévié, rouge le plus).",
  piege: "Rouge, vert, bleu n'ont pas le même interfrange : λ intervient. L'interfrange diminue quand on rapproche l'écran (D) mais augmente si on rapproche les fentes l'une de l'autre (a plus petit). Modèle : fentes infiniment fines, lumière monochromatique cohérente, écran lointain.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette;
    var mode = k.seg("Dispositif", [["y", "Fentes d'Young"], ["g", "Réseau"]], "y");
    var lam = k.slider("Longueur d'onde λ", 400, 700, 10, 600, "nm");
    var white = k.toggle("Lumière blanche (mode réseau)", false);
    var a = k.slider("Écart a entre fentes (Young)", 0.1, 1, 0.05, 0.5, "mm");
    var D = k.slider("Distance fentes–écran D (Young)", 1, 4, 0.5, 2, "m");
    var N = k.slider("Nombre de fentes N (Young)", 2, 10, 1, 2, "");
    var n = k.slider("Traits par mm (réseau)", 50, 600, 10, 300, "/mm");
    var ro = k.readouts(["Interfrange i = λD/a", "Pas du réseau d", "Angle de l'ordre 1", "Ordre maximal"]);
    var nt = k.note("", "ok");
    function scene(oy){
      var ctx = c.ctx, W = c.W, cy = oy / 2 - 2, xp = W * 0.4, xs = W - 22, g = mode.value === "g", colA = P6.rgb(lam.value);
      ctx.fillStyle = "#eef3fa"; S.draw.rrect(c, 8, 6, W - 16, oy - 12, 10); ctx.fill();
      PH6.metal(c, 14, cy - 11, 34, 22, 4, "#5b6678"); S.draw.dot(c, 50, cy, 3, colA); S.draw.text(c, "laser", 31, cy + 24, {size: 10.5, color: "#5f6b7a"});
      ctx.fillStyle = colA; ctx.globalAlpha = 0.55; ctx.fillRect(50, cy - 2, xp - 50, 4); ctx.globalAlpha = 1;
      var nS = g ? 9 : N.value, pitch = g ? 3 + 220 / n.value * 0.4 / 0.4 * 0.04 : 4 + a.value * 30;
      pitch = g ? Math.max(3.2, 70 / (n.value / 50)) / 4.2 : pitch; var tot = (nS - 1) * pitch;
      ctx.fillStyle = "#394456"; ctx.fillRect(xp - 3, 12, 6, oy - 24);
      var ys = []; for (var q = 0; q < nS; q++){ var yy = cy - tot / 2 + q * pitch; ys.push(yy); ctx.fillStyle = "#eef3fa"; ctx.fillRect(xp - 3, yy - 1.2, 6, 2.4); }
      ctx.fillStyle = "#4b5565"; ctx.fillRect(xs, 12, 6, oy - 24);
      for (var r2 = -2; r2 <= 2; r2++){ var ye = cy + r2 * (oy - 44) / 5; ctx.beginPath(); ctx.moveTo(xp, cy); var spread = g ? 1 : 1; ctx.strokeStyle = r2 === 0 ? colA : colA; ctx.globalAlpha = r2 === 0 ? 0.75 : 0.4; ctx.lineWidth = r2 === 0 ? 2.2 : 1.4; ctx.lineTo(xs, ye); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = colA; ctx.fillRect(xs - 1, ye - 3, 4, 6); }
      S.draw.line(c, xp, oy - 14, xs, oy - 14, "#5f6b7a", 1.2); S.draw.line(c, xp, oy - 19, xp, oy - 9, "#5f6b7a", 1.2); S.draw.line(c, xs, oy - 19, xs, oy - 9, "#5f6b7a", 1.2);
      S.draw.text(c, g ? "réseau : " + n.value + " traits/mm" : "D = " + S.fmt(D.value, 1) + " m", (xp + xs) / 2, oy - 24, {size: 11, color: "#2c3a4e", bg: "#eef3fa"});
      S.draw.text(c, g ? "réseau" : (N.value + " fentes"), xp, 8, {size: 10.5, color: "#5f6b7a", base: "top"});
      if (!g){ S.draw.line(c, xp - 14, ys[0], xp - 14, ys[ys.length - 1] === ys[0] ? ys[0] + 1 : ys[ys.length - 1], P.amber, 2); S.draw.text(c, "a", xp - 24, cy, {size: 12, color: P.amber, math: true}); }
      S.draw.text(c, "écran", xs, 8, {size: 10.5, color: "#5f6b7a", base: "top", align: "right"});
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, l = lam.value * 1e-9, oy = 112, colL = P6.rgb(lam.value);
      scene(oy);
      if (mode.value === "y"){
        var i = l * D.value / (a.value * 1e-3), half = 5 * i, ax;
        /* bande image */
        var sh = 90, x0 = 46, x1 = W - 16, col = P6.rgb(lam.value), rgb = col.match(/\d+/g).map(Number);
        function I(x){ var ph = Math.PI * (a.value * 1e-3) * x / (l * D.value), s = Math.sin(ph); if (Math.abs(s) < 1e-9) return 1; var r = Math.sin(N.value * ph) / (N.value * s); return r * r; }
        for (var px = x0; px <= x1; px++){ var xx = (px - (x0 + x1) / 2) / ((x1 - x0) / 2) * half, v = Math.pow(I(xx), 0.8); ctx.fillStyle = "rgb(" + Math.round(rgb[0] * v) + "," + Math.round(rgb[1] * v) + "," + Math.round(rgb[2] * v) + ")"; ctx.fillRect(px, oy + 14, 1.5, sh); }
        ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.strokeRect(x0, oy + 14, x1 - x0, sh);
        ax = S.draw.axes(c, {x0: -half * 1000, x1: half * 1000, y0: 0, y1: 1.1, xl: "x (mm)", yl: "I", l: x0, r: 16, t: oy + sh + 22, b: 34, stepY: 0.5});
        S.draw.fn(c, ax, function(xm){ return I(xm / 1000); }, P.red, 2.4);
        S.draw.line(c, ax.X(0), oy + 14 + sh, ax.X(0), ax.B, "#c7cdd6", 1, [3, 3]);
        S.draw.line(c, ax.X(0), ax.Y(1.07), ax.X(i * 1000), ax.Y(1.07), P.amber, 3); S.draw.label(c, "i = " + S.fmt(i * 1000, 2) + " mm", (ax.X(0) + ax.X(i * 1000)) / 2 + 30, ax.Y(1.07) - 12, {color: P.amber, size: 11.5});S.draw.text(c, "", 0, 0, {size: 13, color: P.amber, math: true});
        ro.set(0, S.fmt(i * 1000, 2) + " mm"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set("Interfrange mesurée sur l'écran : i = " + S.fmt(i * 1000, 2) + " mm. Avec N = " + N.value + " fentes, il y a " + (N.value - 2) + " petit(s) maximum(s) secondaire(s) entre deux maxima principaux.", "ok");
      } else {
        var d = 1e-3 / n.value, mmax = Math.floor(d / (white.value ? 400e-9 : l));
        var ax2 = S.draw.axes(c, {x0: -90, x1: 90, y0: 0, y1: 1, xl: "angle θ (°)", yl: "", l: 20, r: 20, t: oy + 22, b: 40, stepX: 30, stepY: 1, grid: false});
        ctx.fillStyle = "#0f1b2d"; ctx.fillRect(ax2.L, oy + 22, ax2.R - ax2.L, ax2.B - oy - 22 - 1);
        
        for (var m = -mmax; m <= mmax; m++){
          if (white.value){
            if (m === 0){ ctx.fillStyle = "#fff"; ctx.fillRect(ax2.X(0) - 3, oy + 22, 6, ax2.B - oy - 22); continue; }
            for (var w = 400; w <= 700; w += 5){ var s = m * w * 1e-9 / d; if (Math.abs(s) < 1){ var th = Math.asin(s) * 180 / Math.PI; ctx.fillStyle = P6.rgb(w); ctx.fillRect(ax2.X(th) - 1.6, oy + 22, 3.2, ax2.B - oy - 22); } }
          } else {
            var s2 = m * l / d; if (Math.abs(s2) <= 1){ var th2 = Math.asin(s2) * 180 / Math.PI; var rgb2 = P6.rgb(lam.value); ctx.fillStyle = rgb2; ctx.fillRect(ax2.X(th2) - 2.5, oy + 22, 5, ax2.B - oy - 22); S.draw.text(c, "m = " + m, ax2.X(th2), oy + 12, {size: 12, color: P.ink}); }
          }
        }
        var th1 = (l / d <= 1) ? Math.asin(l / d) * 180 / Math.PI : NaN;
        ro.set(0, "—"); ro.set(1, S.fmt(d * 1e6, 2) + " µm"); ro.set(2, isNaN(th1) ? "pas d'ordre 1" : S.fmt(th1, 1) + " °"); ro.set(3, white.value ? "m = " + Math.floor(d / 700e-9) + " (rouge) à " + mmax + " (violet)" : "m = " + mmax);
        nt.set(white.value ? "Lumière blanche : l'ordre 0 reste blanc, les autres sont étalés en spectres (violet près du centre, rouge à l'extérieur)." : "sin θ = m·λ/d : un réseau plus fin (plus de traits par mm) écarte davantage les ordres.", "ok");
      }
    });
  }
});

SFA.sim({
  id: "p6-c08-spectres", ch: "c08", tag: "Spectres · Défi",
  titre: "Spectres de raies : émission, absorption et étoile mystère",
  resume: "Chaque élément a sa signature : les mêmes raies en émission (brillantes) et en absorption (sombres).",
  but: "Coche des gaz et choisis le type de spectre. Puis relève le défi : l'étoile mystère contient 2 ou 3 de ces gaz ; compare son spectre d'absorption au tien et trouve sa composition.",
  aRetenir: "Un gaz chaud émet des raies brillantes à des longueurs d'onde bien précises (spectre d'émission) ; le même gaz froid, traversé par une lumière continue, absorbe exactement ces longueurs d'onde (raies noires). Les raies d'un élément sont sa « carte d'identité » : c'est ainsi qu'on connaît la composition du Soleil ou d'une étoile lointaine. Un solide chaud donne un spectre continu.",
  piege: "Un spectre d'absorption n'est pas le complémentaire d'un autre élément : ses raies noires sont aux mêmes λ que les raies brillantes du même gaz. Et deux gaz présents ensemble ajoutent leurs raies. Longueurs d'onde (nm) tirées de tables usuelles ; les intensités sont schématiques.",
  build: function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var gas = {
      H: {n: "Hydrogène", l: [[410.2, .5], [434.0, .6], [486.1, .8], [656.3, 1]]},
      He: {n: "Hélium", l: [[447.1, .6], [471.3, .4], [492.2, .4], [501.6, .8], [587.6, 1], [667.8, .5]]},
      Na: {n: "Sodium", l: [[568.8, .4], [589.0, 1], [589.6, 1], [615.4, .4]]},
      Hg: {n: "Mercure", l: [[404.7, .6], [435.8, .9], [546.1, 1], [577.0, .7], [579.1, .7]]},
      Ne: {n: "Néon", l: [[585.2, .8], [588.2, .6], [603.0, .5], [607.4, .6], [614.3, .8], [626.6, .6], [640.2, .9], [650.7, .7]]}
    };
    var keys = ["H", "He", "Na", "Hg", "Ne"], on = {};
    var mode = k.seg("Type de spectre", [["em", "Émission"], ["ab", "Absorption"], ["co", "Continu (lampe)"]], "em");
    keys.forEach(function(g){ on[g] = k.toggle(gas[g].n, g === "H"); });
    var myst = null, shown = false;
    k.button("Nouvelle étoile mystère", function(){ var n = 2 + Math.floor(Math.random() * 2), pool = keys.slice(), pick = []; while (pick.length < n){ pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]); } myst = pick; shown = false; }, true);
    k.button("Révéler la composition", function(){ shown = true; });
    var ro = k.readouts(["Raies affichées", "Étoile mystère"]);
    var nt = k.note("", "ok");
    function lines(sel){ var out = []; sel.forEach(function(g){ gas[g].l.forEach(function(q){ out.push(q); }); }); return out; }
    function strip(y, h, lns, kind, x0, x1){
      var ctx = c.ctx;
      function X(w){ return x0 + (w - 400) / 300 * (x1 - x0); }
      if (kind === "em"){ ctx.fillStyle = "#050a14"; ctx.fillRect(x0, y, x1 - x0, h); lns.forEach(function(q){ ctx.fillStyle = P6.rgb(q[0]); ctx.globalAlpha = 0.5 + 0.5 * q[1]; ctx.fillRect(X(q[0]) - 1.6, y, 3.2, h); ctx.globalAlpha = 1; }); }
      else { for (var px = x0; px <= x1; px++){ var w = 400 + (px - x0) / (x1 - x0) * 300; ctx.fillStyle = P6.rgb(w); ctx.fillRect(px, y, 1.5, h); } if (kind === "ab") lns.forEach(function(q){ ctx.fillStyle = "rgba(5,10,20," + (0.55 + 0.4 * q[1]) + ")"; ctx.fillRect(X(q[0]) - 1.8, y, 3.6, h); }); }
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.strokeRect(x0, y, x1 - x0, h);
    }
    k.draw(function(){
      c.clear(); var W = c.W, x0 = 30, x1 = W - 30, sel = keys.filter(function(g){ return on[g].value; });
      S.draw.text(c, "Ton spectre (" + (mode.value === "em" ? "émission" : mode.value === "ab" ? "absorption" : "continu") + ")", x0, 14, {size: 12, align: "left"});
      strip(24, 70, lines(sel), mode.value, x0, x1);
      for (var w = 400; w <= 700; w += 50){ var xx = x0 + (w - 400) / 300 * (x1 - x0); S.draw.line(c, xx, 94, xx, 100, P.ink, 1); S.draw.text(c, w + " nm", xx, 112, {size: 12, color: P.grey}); }
      S.draw.text(c, "Étoile mystère (spectre d'absorption)", x0, 138, {size: 12, align: "left"});
      if (myst) strip(148, 70, lines(myst), "ab", x0, x1); else { c.ctx.fillStyle = "#eef1f6"; c.ctx.fillRect(x0, 148, x1 - x0, 70); S.draw.text(c, "clique sur « Nouvelle étoile mystère »", W / 2, 183, {size: 13, color: P.grey}); }
      var nl = lines(sel).length; ro.set(0, sel.length ? sel.map(function(g){ return gas[g].n; }).join(", ") + " (" + nl + " raies)" : "aucun gaz coché");
      ro.set(1, !myst ? "—" : shown ? myst.map(function(g){ return gas[g].n; }).join(" + ") : "cachée");
      if (myst){ var ok = sel.length === myst.length && sel.every(function(g){ return myst.indexOf(g) >= 0; });
        nt.set(ok ? "Bravo : tes gaz cochés reproduisent exactement les raies de l'étoile." : "Compare les raies noires de l'étoile aux raies de chaque gaz (mode absorption) : coche seulement ceux dont TOUTES les raies sont présentes.", ok ? "ok" : "warn"); }
      else nt.set("Astuce : le doublet jaune du sodium (589,0 et 589,6 nm) est si serré qu'il paraît une seule raie. On le retrouve dans le spectre du Soleil.", "ok");
    });
  }
});

SFA.sim({
  id: "p6-c08-polariseurs", ch: "c08", tag: "Polarisation",
  titre: "Polariseurs : la loi de Malus et le troisième polariseur",
  resume: "I = I₀·cos²θ : deux polariseurs croisés éteignent la lumière, un troisième entre eux la rallume. Tourne les filtres à la main.",
  but: "La lumière traverse un polariseur P₁ (axe vertical), éventuellement un polariseur intermédiaire, puis un analyseur. Attrape un filtre et fais-le tourner avec la souris ou le doigt (ou règle l'angle au curseur). Les flèches indiquent la direction de polarisation du champ électrique ; l'écran affiche l'intensité.",
  aRetenir: "La lumière est une onde transversale : elle peut être polarisée. Un polariseur ne laisse passer que la composante du champ parallèle à son axe. Loi de Malus : une lumière polarisée traverse un analyseur à l'angle θ avec l'intensité I = I₀·cos²θ. Une lumière naturelle perd la moitié de son intensité au premier polariseur. Les écrans LCD utilisent des cristaux liquides qui tournent la polarisation entre deux polariseurs croisés.",
  piege: "Deux polariseurs croisés (90°) arrêtent tout, mais en intercalant un troisième à 45° entre eux, la lumière repasse (jusqu'à 12,5 % de l'intensité naturelle) : un polariseur ne « filtre » pas, il projette la polarisation sur son axe. La loi de Malus est cos² (pas cos).",
  build: function(k, S){
    var c = k.canvas(260), g = k.canvas(190), P = S.draw.palette, Pm = window.PH6;
    var src = k.seg("Lumière incidente", [["n", "Naturelle"], ["p", "Polarisée verticalement"]], "n");
    var al = k.slider("Angle de l'analyseur (par rapport à P₁)", 0, 180, 5, 90, "°");
    var mid = k.toggle("Insérer un polariseur intermédiaire", false);
    var be = k.slider("Angle du polariseur intermédiaire", 0, 90, 5, 45, "°");
    var ro = k.readouts(["Après P₁", "Après l'intermédiaire", "Après l'analyseur"]);
    var nt = k.note("", "ok"), geo = {}, sel = null, t = 0;
    var lp = k.loop(function(dt){ t += dt; if (src.value === "n") k.redraw(); }); lp.play();
    function chain(a, b, useMid, natural){
      var r = natural ? 0.5 : 1, i1 = r, i2 = i1, ar = a * Math.PI / 180, br = b * Math.PI / 180;
      if (useMid){ i2 = i1 * Math.pow(Math.cos(br), 2); return {i1: i1, i2: i2, i3: i2 * Math.pow(Math.cos(ar - br), 2)}; }
      return {i1: i1, i2: i1, i3: i1 * Math.pow(Math.cos(ar), 2)};
    }
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(tp, p){
      if (!geo.xs) return;
      if (tp === "down"){ var best = null, bd = 1e9; [["a", geo.xs[3]], ["m", geo.xs[2]]].forEach(function(q){ if (q[0] === "m" && !mid.value) return; var dd = Math.abs(p.x - q[1]); if (dd < bd){ bd = dd; best = q; } }); sel = best ? best[0] : null; }
      if ((tp === "down" || tp === "drag") && sel){
        var cx = sel === "a" ? geo.xs[3] : geo.xs[2], ang = Math.atan2(p.x - cx, -(p.y - geo.cy)) * 180 / Math.PI; ang = ((ang % 180) + 180) % 180; ang = Math.round(ang / 5) * 5; if (ang >= 180) ang = 0;
        if (sel === "a") al.set(ang); else { be.set(ang > 135 ? 0 : Math.min(90, ang)); }
      }
      if (tp === "up") sel = null;
    });
    k.draw(function(){
      c.clear(); g.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, cy = 98, nat = src.value === "n", u = chain(al.value, be.value, mid.value, nat), R = Math.min(34, W * 0.085);
      var xs = [W * 0.1, W * 0.3, W * 0.5, W * 0.7, W * 0.9]; geo.xs = xs; geo.cy = cy;
      function beam(xa, xb, I){ var gr = ctx.createLinearGradient(0, cy - R, 0, cy + R); var a = Math.max(0.05, Math.min(1, I)); gr.addColorStop(0, "rgba(244,197,66," + a * 0.55 + ")"); gr.addColorStop(0.5, "rgba(255,226,120," + a + ")"); gr.addColorStop(1, "rgba(244,197,66," + a * 0.55 + ")"); ctx.fillStyle = gr; ctx.fillRect(xa, cy - R * 0.8, xb - xa, R * 1.6); }
      var I1 = nat ? 1 : 1;
      beam(xs[0], xs[1], 1); beam(xs[1], xs[2], u.i1); beam(xs[2], xs[3], u.i2); beam(xs[3], xs[4], u.i3);
      /* source */
      Pm.bulb(c, xs[0], cy, 15, 1, ""); S.draw.text(c, "source", xs[0], cy + R + 14, {size: 11, color: P.grey});
      function disc(x, ang, label, col, faded, hot){
        ctx.save(); ctx.translate(x, cy); ctx.globalAlpha = faded ? 0.35 : 1;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill(); ctx.lineWidth = hot ? 4 : 3; ctx.strokeStyle = col; ctx.setLineDash(faded ? [4, 4] : []); ctx.stroke(); ctx.setLineDash([]);
        ctx.rotate(ang * Math.PI / 180); ctx.beginPath(); ctx.rect(-R, -R, 2 * R, 2 * R); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R - 2, 0, 7); ctx.clip();
        ctx.strokeStyle = col; ctx.lineWidth = 1.6; for (var q = -R + 5; q < R; q += 7){ ctx.beginPath(); ctx.moveTo(q, -R); ctx.lineTo(q, R); ctx.stroke(); } ctx.restore();
        S.draw.arrow({ctx: ctx}, 0, 10, 0, -R - 10, col, 2.6); ctx.restore();
        S.draw.text(c, label, x, cy + R + 14, {size: 11, color: faded ? P.grey : col});
      }
      disc(xs[1], 0, "P₁ (0°)", P.acc, false, false);
      disc(xs[2], be.value, mid.value ? "inter. " + be.value + "°" : "(absent)", P.green, !mid.value, sel === "m");
      disc(xs[3], al.value, "analyseur " + al.value + "°", P.red, false, sel === "a");
      /* écran */
      var lum = u.i3; S.draw.glow(c, xs[4], cy, R * (1.2 + 1.3 * lum), "#ffe27a", 0.7 * lum + 0.05);
      ctx.beginPath(); ctx.arc(xs[4], cy, R * 0.8, 0, 7); var sg = Math.round(235 * Math.min(1, lum * 1.8) + 20); ctx.fillStyle = "rgb(" + sg + "," + sg + "," + Math.round(sg * 0.9) + ")"; ctx.fill(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, "écran", xs[4], cy + R + 14, {size: 11, color: P.grey});
      S.draw.label(c, S.fmt(u.i3 * 100, 1) + " %", xs[4], cy - R - 14, {color: P.ink, size: 13});
      /* indicateurs de polarisation du champ électrique */
      function efield(x, I, angDeg, natural){
        var ry = cy + R + 50, rr = 19; ctx.beginPath(); ctx.arc(x, ry, rr, 0, 7); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fill(); ctx.strokeStyle = "#cfd6e1"; ctx.lineWidth = 1.2; ctx.stroke();
        if (natural){ for (var q = 0; q < 6; q++){ var an = q * Math.PI / 6 + Math.floor(t * 9 + q * 3.1) * 1.7, a = an; S.draw.line(c, x - Math.sin(a) * rr * 0.8, ry + Math.cos(a) * rr * 0.8, x + Math.sin(a) * rr * 0.8, ry - Math.cos(a) * rr * 0.8, "rgba(194,106,12,.5)", 1.6); } }
        else if (I > 0.002){ var a2 = angDeg * Math.PI / 180, L = rr * 0.9 * Math.sqrt(I) * (src.value === "p" ? 1 : 1.41); L = Math.min(rr * 0.92, L); S.draw.line(c, x - Math.sin(a2) * L, ry + Math.cos(a2) * L, x + Math.sin(a2) * L, ry - Math.cos(a2) * L, P.amber, 3); S.draw.arrow(c, x, ry, x + Math.sin(a2) * L, ry - Math.cos(a2) * L, P.amber, 3); S.draw.arrow(c, x, ry, x - Math.sin(a2) * L, ry + Math.cos(a2) * L, P.amber, 3); }
        else S.draw.text(c, "0", x, ry, {size: 13, color: P.grey});
      }
      efield((xs[0] + xs[1]) / 2, 1, 0, nat); if (!nat) {} 
      efield((xs[1] + xs[2]) / 2, u.i1, 0, false); efield((xs[2] + xs[3]) / 2, u.i2, mid.value ? be.value : 0, false); efield((xs[3] + xs[4]) / 2, u.i3, al.value, false);
      S.draw.text(c, "champ électrique E (vue de face)", W / 2, H - 12, {size: 11, color: P.grey, weight: 600});
      S.draw.label(c, "tourne les filtres rouge et vert à la main", W / 2, 14, {color: P.ink, size: 11});
      var f = function(a){ return chain(a, be.value, mid.value, nat).i3; };
      var ax = S.draw.axes(g, {x0: 0, x1: 180, y0: 0, y1: 1, xl: "angle de l'analyseur (°)", yl: "I / I₀", l: 46, t: 16, stepX: 30, stepY: 0.25});
      S.draw.fn(g, ax, function(a){ return f(a); }, P.red, 2.8); S.draw.dot(g, ax.X(al.value), ax.Y(u.i3), 7, P.ink);
      ro.set(0, S.fmt(u.i1 * 100, 1) + " % de I₀"); ro.set(1, mid.value ? S.fmt(u.i2 * 100, 1) + " % de I₀" : "(absent)"); ro.set(2, S.fmt(u.i3 * 100, 1) + " % de I₀");
      nt.set(al.value === 90 && !mid.value ? "Polariseurs croisés : plus de lumière. Insère maintenant le polariseur intermédiaire à 45°." : u.i3 < 0.001 ? "Extinction (analyseur ⟂ à la polarisation entrante)." : "Loi de Malus appliquée à chaque polariseur successif.", "ok");
    });
  }
});

