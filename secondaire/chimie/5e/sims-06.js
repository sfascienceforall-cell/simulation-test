/* Chapitre 6 · Calorimétrie et pouvoir calorifique */
SFA.sim({
  id: "c5-c06-calorimetre", ch: "c06", tag: "Expérience virtuelle",
  titre: "Le calorimètre : mesurer ΔH et corriger les pertes",
  resume: "Réaction au choix, courbe T(t) réaliste, ΔT corrigé par extrapolation, ΔH par mole.",
  but: "Choisis une réaction et une quantité n. Lis le ΔT au maximum de la courbe, puis le ΔT extrapolé (droite en pointillés) et compare les deux ΔH calculés avec la valeur de table. Change l'isolation et la capacité du calorimètre.",
  aRetenir: "Énergie reçue par la solution : Q = (m·c + C)·ΔT. Enthalpie molaire : ΔH = −Q/n (si la température monte, la réaction libère de la chaleur : ΔH < 0). Avec des pertes, le maximum lu sous-estime ΔT : on extrapole la décroissance jusqu'à l'instant de la réaction.",
  piege: "Oublier la capacité C du calorimètre (ou prendre le maximum de la courbe sans correction) donne un |ΔH| trop petit. Modèle simplifié : la masse du soluté est négligée devant celle de l'eau, c(solution) = c(eau) = 4,18 J/(g·K), pertes proportionnelles à (T − T_ambiante), mélange en ≈ 8 s.",
  build: function(k, S){
    var pal = S.draw.palette, CW = 4.18;
    var R = {
      neu: ["Neutralisation HCl + NaOH", -57], naoh: ["Dissolution de NaOH(s)", -44], cacl2: ["Dissolution de CaCl₂(s)", -83],
      nh4no3: ["Dissolution de NH₄NO₃(s)", 26], kno3: ["Dissolution de KNO₃(s)", 35], nacl: ["Dissolution de NaCl(s)", 4]
    };
    var c = k.canvas(280);
    var rx = k.select("Réaction", Object.keys(R).map(function(x){ return [x, R[x][0] + " (ΔH tabulé " + R[x][1] + " kJ/mol)"]; }), "naoh");
    var n = k.slider("Quantité n de réactif limitant", 0.01, 0.10, 0.005, 0.05, "mol");
    var mw = k.slider("Masse d'eau", 50, 250, 10, 100, "g");
    var Cc = k.slider("Capacité du calorimètre C", 0, 60, 5, 20, "J/K");
    var tau = k.slider("Constante de pertes τ (grande = bien isolé)", 100, 3000, 50, 300, "s");
    var useC = k.toggle("Tenir compte de C dans le calcul", true);
    var ro = k.readouts(["ΔT vrai (sans pertes)", "ΔT lu au maximum", "ΔT extrapolé", "ΔH (maximum)", "ΔH (extrapolé)", "ΔH tabulé"]);
    var nt = k.note("", "");
    k.draw(function(){
      var dH = R[rx.value][1] * 1000, C = Cc.value, mc = mw.value * CW + C, dTv = -n.value * dH / mc, T0 = 20, t0 = 60, tm = 8, tl = tau.value;
      var ts = [], Ts = [], T = T0, t, sub, tt;
      /* chaleur libérée en ≈ tm secondes (source exponentielle, total = ΔT vrai) ; pertes proportionnelles à (T − T0), constante τ */
      for (t = 0; t <= 600; t += 1){
        ts.push(t); Ts.push(T);
        for (sub = 0; sub < 4; sub++){ tt = t + sub * 0.25; T += ((tt >= t0 ? dTv / tm * Math.exp(-(tt - t0) / tm) : 0) - (T - T0) / tl) * 0.25; }
      }
      /* maximum (en valeur absolue) et extrapolation (droite) sur [t0+40, t0+160], après la fin du mélange */
      var W0 = 40, W1 = 160, ext = 0, imax = 0; Ts.forEach(function(v, i){ if (Math.abs(v - T0) > Math.abs(Ts[imax] - T0)) imax = i; });
      var xs = [], ys = [], i; for (i = t0 + W0; i <= t0 + W1; i++){ xs.push(i); ys.push(Ts[i]); }
      var mx = xs.reduce(function(a, b){ return a + b; }, 0) / xs.length, my = ys.reduce(function(a, b){ return a + b; }, 0) / ys.length, num = 0, den = 0;
      for (i = 0; i < xs.length; i++){ num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) * (xs[i] - mx); }
      var a = num / den, b0 = my - a * mx, Tex = a * t0 + b0, dTex = Tex - T0, dTmax = Ts[imax] - T0;
      c.clear();
      var lo = Math.min(T0, T0 + dTv, Tex) - 1.5, hi = Math.max(T0, T0 + dTv, Tex) + 1.5; if (hi - lo < 4){ lo -= 2; hi += 2; }
      var ax = S.draw.axes(c, {x0: 0, x1: 600, y0: lo, y1: hi, xl: "t (s)", yl: "T (°C)", stepX: 100, l: 52});
      S.draw.fn(c, ax, function(x){ return Ts[Math.max(0, Math.min(600, Math.round(x)))]; }, pal.acc, 2.6);
      S.draw.line(c, ax.X(t0 + W0), ax.Y(a * (t0 + W0) + b0), ax.X(t0), ax.Y(Tex), pal.red, 1.8, [5, 4]); S.draw.line(c, ax.X(t0 + W0), ax.Y(a * (t0 + W0) + b0), ax.X(t0 + W1), ax.Y(a * (t0 + W1) + b0), pal.red, 2.2);
      S.draw.dot(c, ax.X(t0), ax.Y(Tex), 5, pal.red); S.draw.dot(c, ax.X(imax), ax.Y(Ts[imax]), 5, pal.amber);
      S.draw.line(c, ax.X(0), ax.Y(T0 + dTv), ax.X(600), ax.Y(T0 + dTv), pal.green, 1.2, [4, 4]);
      S.draw.text(c, "ΔT vrai", ax.X(600) - 4, ax.Y(T0 + dTv) + (dTv > 0 ? -9 : 11), {size: 12, color: pal.green, align: "right"});
      S.draw.text(c, "réaction à t = 60 s", ax.X(t0) + 6, ax.B - 10, {size: 12, color: pal.grey, align: "left"});
      var Cuse = useC.value ? C : 0, dHm = -(mw.value * CW + Cuse) * dTmax / n.value, dHe = -(mw.value * CW + Cuse) * dTex / n.value;
      ro.set(0, (dTv > 0 ? "+" : "") + S.fmt(dTv, 2) + " K"); ro.set(1, (dTmax > 0 ? "+" : "") + S.fmt(dTmax, 2) + " K"); ro.set(2, (dTex > 0 ? "+" : "") + S.fmt(dTex, 2) + " K");
      ro.set(3, S.fmt(dHm / 1000, 1) + " kJ/mol"); ro.set(4, S.fmt(dHe / 1000, 1) + " kJ/mol"); ro.set(5, R[rx.value][1] + " kJ/mol");
      var dr = Math.abs(dHe / 1000 - R[rx.value][1]) / Math.abs(R[rx.value][1]);
      nt.set(dTv > 0 ? "Température qui monte : réaction exothermique (ΔH < 0). " : "Température qui baisse : réaction endothermique (ΔH > 0). ", "");
      nt.set(nt.el.textContent + (!useC.value && C > 0 ? "Tu ne comptes pas C : les deux ΔH sont trop petits en valeur absolue." : "Le point jaune est le maximum lu ; le point rouge est l'extrapolation à t = 60 s (droite tracée après la fin du mélange) : elle se rapproche du ΔT vrai quand les pertes sont faibles (τ grand).") + (Math.abs(dTv) > 0 ? " Écart de ΔH extrapolé par rapport à la table : " + S.fmt(dr * 100, 0) + " %." : ""), !useC.value && C > 0 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "c5-c06-combustibles", ch: "c06", tag: "Comparaison",
  titre: "Quel combustible ? Énergie, encombrement et CO₂",
  resume: "Hydrogène, méthane, butane, essence, éthanol, charbon, bois : par kg, par litre, et CO₂ émis.",
  but: "Fixe l'énergie dont tu as besoin. Compare la masse ou le volume de chaque combustible, et le CO₂ émis. Bascule « par kg » / « par litre », puis règle l'humidité du bois.",
  aRetenir: "Le pouvoir calorifique est l'énergie libérée par unité de masse (MJ/kg) ou de volume (MJ/L). L'hydrogène gagne par kg (≈ 143 MJ/kg) mais perd par litre à l'état gazeux (≈ 0,012 MJ/L). Les hydrocarbures émettent d'autant plus de CO₂ par MJ qu'ils sont riches en carbone ; l'hydrogène n'émet pas de CO₂ à la combustion.",
  piege: "Le classement change selon l'unité : kg ou litre. Un bois humide donne moins d'énergie utile : une partie sert à évaporer l'eau. Valeurs calculées à partir des enthalpies de combustion (eau liquide) et de masses molaires arrondies ; volumes : gaz à 20 °C sous 1 atm (24 L/mol), masses volumiques arrondies.",
  build: function(k, S){
    var pal = S.draw.palette;
    var F = [
      {id: "H2", n: "Hydrogène (gaz)", dh: 286, M: 2, nC: 0, rho: 2 / 24 / 1000, col: "#6fb3e8"},
      {id: "CH4", n: "Méthane (gaz)", dh: 890, M: 16, nC: 1, rho: 16 / 24 / 1000, col: "#7bc8a4"},
      {id: "C4", n: "Butane (liquide)", dh: 2877, M: 58, nC: 4, rho: 0.58, col: "#f1c071"},
      {id: "C8", n: "Essence (octane)", dh: 5470, M: 114, nC: 8, rho: 0.70, col: "#e08f6a"},
      {id: "EtOH", n: "Éthanol", dh: 1367, M: 46, nC: 2, rho: 0.79, col: "#b79adf"},
      {id: "C", n: "Charbon", dh: 394, M: 12, nC: 1, rho: 0.85, col: "#777"},
      {id: "bois", n: "Bois", dh: 2820, M: 162, nC: 6, rho: 0.45, col: "#b58b5e"}
    ];
    var RH = function(w){ return w < 460 ? 50 : 56; };
    var c = k.canvas(0, {ratio: 0.8}); Object.defineProperty(c, "ratio", {get: function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); return (102 + F.length * RH(w) + 8) / w; }, configurable: true}); c.resize();
    var g = k.canvas(250);
    var per = k.seg("Comparer par", [["kg", "masse (kg)"], ["L", "volume (litres)"]], "kg");
    var E = k.slider("Énergie utile voulue", 1, 100, 1, 17, "MJ");
    var hum = k.slider("Humidité du bois", 0, 60, 5, 20, "%");
    var ro = k.readouts(["Meilleur par " + "unité choisie", "Le moins de CO₂"]);
    var nt = k.note("100 L d'eau de 15 °C à 55 °C demandent 100 000 × 4,18 × 40 ≈ 16,7 MJ.", "");
    var tm = 0, disp = null, dispC = null;
    k.loop(function(dt, t){ tm = t; k.redraw(); }).play();
    function data(f){
      var e = f.dh / f.M;   /* MJ/kg : kJ/mol ÷ g/mol = kJ/g = MJ/kg */
      if (f.id === "bois"){ var h = hum.value / 100; e = (1 - h) * e - h * 2.44; }
      var mass = E.value / e;     /* kg de combustible */
      var rhoKgL = f.rho;    /* masse volumique en kg par litre */
      var vol = mass / rhoKgL;    /* litres */
      var co2 = f.nC > 0 ? (f.id === "bois" ? mass * (1 - hum.value / 100) * 6 * 44 / 162 : mass * 1000 / f.M * f.nC * 44 / 1000) : 0;   /* kg de CO2 */
      return {e: e, mass: mass, vol: vol, co2: co2, ev: e * rhoKgL};
    }
    function lin(ctx, x0, y0, x1, y1, st){ var gg = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(q){ gg.addColorStop(q[0], q[1]); }); return gg; }
    /* objets dessinés : bouteille de gaz, cartouche, bidon, bouteille, charbon, bûche (centrés en x, posés sur y) */
    function icon(ctx, id, x, y, s, col){
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.fillStyle = "rgba(15,27,45,.14)"; ctx.beginPath(); ctx.ellipse(0, 0, 17, 3.2, 0, 0, 6.2832); ctx.fill();
      if (id === "H2" || id === "CH4"){   /* bouteille de gaz haute pression */
        ctx.fillStyle = lin(ctx, -9, 0, 9, 0, [[0, C5.shade(col, -0.35)], [0.4, C5.shade(col, 0.35)], [1, C5.shade(col, -0.45)]]);
        S.draw.rrect({ctx: ctx}, -9, -36, 18, 36, 8); ctx.fill(); ctx.fillRect(-9, -8, 18, 8);
        ctx.fillStyle = "#8b96a5"; ctx.fillRect(-3, -42, 6, 7); ctx.fillStyle = "#5b6676"; ctx.fillRect(-7, -45, 14, 4); ctx.fillRect(3, -41, 6, 3);
        ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.font = "800 8px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(id === "H2" ? "H₂" : "CH₄", 0, -18);
      } else if (id === "C4"){   /* cartouche de camping */
        ctx.fillStyle = lin(ctx, -13, 0, 13, 0, [[0, "#1f4f9e"], [0.4, "#4f86d8"], [1, "#183f80"]]);
        ctx.beginPath(); ctx.moveTo(-13, -4); ctx.lineTo(-13, -20); ctx.quadraticCurveTo(-13, -28, 0, -29); ctx.quadraticCurveTo(13, -28, 13, -20); ctx.lineTo(13, -4); ctx.quadraticCurveTo(13, 0, 0, 0); ctx.quadraticCurveTo(-13, 0, -13, -4); ctx.fill();
        ctx.fillStyle = "#f1c071"; ctx.fillRect(-13, -17, 26, 7); ctx.fillStyle = "#9aa5b3"; ctx.fillRect(-3, -34, 6, 6);
      } else if (id === "C8"){   /* bidon d'essence */
        ctx.fillStyle = lin(ctx, -14, 0, 14, 0, [[0, "#a8261a"], [0.45, "#e04a35"], [1, "#8f1f15"]]);
        ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-14, -26); ctx.lineTo(-6, -32); ctx.lineTo(14, -32); ctx.lineTo(14, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#7a170e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-2, -32); ctx.lineTo(-2, -38); ctx.lineTo(10, -38); ctx.lineTo(10, -32); ctx.stroke();
        ctx.fillStyle = "#3b3f46"; ctx.fillRect(-15, -36, 6, 6);
        ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(9, -24); ctx.moveTo(-9, -24); ctx.lineTo(9, -6); ctx.stroke();
      } else if (id === "EtOH"){   /* bouteille d'alcool à brûler */
        ctx.fillStyle = "rgba(200,225,240,.55)"; ctx.strokeStyle = "#7d8ea3"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-9, -22); ctx.quadraticCurveTo(-9, -28, -4, -30); ctx.lineTo(-4, -38); ctx.lineTo(4, -38); ctx.lineTo(4, -30); ctx.quadraticCurveTo(9, -28, 9, -22); ctx.lineTo(9, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(183,154,223,.85)"; ctx.fillRect(-8.4, -16, 16.8, 15.4); ctx.fillStyle = "#fff"; ctx.fillRect(-7, -14, 14, 7);
        ctx.fillStyle = "#6236c4"; ctx.fillRect(-4.5, -42, 9, 5); ctx.fillStyle = "#6236c4"; ctx.font = "800 5.5px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("ÉTHANOL", 0, -10.5);
      } else if (id === "C"){   /* tas de charbon */
        [[-10, -6, 7], [0, -7, 8], [10, -6, 7], [-5, -15, 7], [6, -15, 7], [0, -23, 6]].forEach(function(q, i){
          ctx.fillStyle = lin(ctx, q[0] - q[2], q[1] - q[2], q[0] + q[2], q[1] + q[2], [[0, "#6c7480"], [0.5, "#2c3138"], [1, "#16191d"]]);
          ctx.beginPath(); for (var a = 0; a < 6; a++){ var an = a / 6 * 6.2832 + i, rr = q[2] * (0.8 + 0.2 * ((a + i) % 2)); a ? ctx.lineTo(q[0] + Math.cos(an) * rr, q[1] + Math.sin(an) * rr) : ctx.moveTo(q[0] + Math.cos(an) * rr, q[1] + Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); });
      } else {   /* bûches */
        [[-1, -7], [1, -7], [0, -18]].forEach(function(q){
          var cx = q[0] * 8, cy = q[1];
          ctx.fillStyle = lin(ctx, 0, cy - 6, 0, cy + 6, [[0, "#a0703f"], [0.5, "#7a4f28"], [1, "#5e3a1c"]]); S.draw.rrect({ctx: ctx}, cx - 16, cy - 6, 26, 12, 4); ctx.fill();
          ctx.fillStyle = "#e7c48e"; ctx.beginPath(); ctx.ellipse(cx + 10, cy, 4.5, 6, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#b8874f"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(cx + 10, cy, 2.5, 3.5, 0, 0, 6.2832); ctx.stroke();
        });
      }
      ctx.restore();
    }
    /* chauffe-eau : la tâche à accomplir, avec sa flamme */
    function heater(ctx, x, y, h){
      var w = h * 0.55;
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.ellipse(x, y + 2, w * 0.7, 4, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, "#c9d2de"], [0.4, "#f7f9fc"], [1, "#b3becc"]]); S.draw.rrect(c, x - w / 2, y - h, w, h - 10, w * 0.3); ctx.fill(); ctx.strokeStyle = "#8a97a8"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "rgba(47,127,209,.18)"; S.draw.rrect(c, x - w / 2 + 4, y - h * 0.62, w - 8, h * 0.48, 4); ctx.fill();
      var fl = 9 + Math.sin(tm * 9) * 1.5 + Math.sin(tm * 14) * 1;
      ctx.fillStyle = "rgba(255,140,30,.9)"; C5.flame(ctx, x, y - 2, fl, 5, Math.sin(tm * 7) * 1.5); ctx.fill(); ctx.fillStyle = "rgba(80,120,255,.85)"; C5.flame(ctx, x, y - 2, fl * 0.45, 3, 0); ctx.fill();
      ctx.restore();
    }
    k.draw(function(){
      c.clear(); g.clear();
      var D = F.map(data), byL = per.value === "L", i, ctx = c.ctx, W = c.W, rh = RH(W), phn = W < 460;
      var vals = D.map(function(d){ return byL ? d.vol : d.mass; }), mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
      var len = function(v){ return byL ? (Math.log(v / mn) / Math.LN10 + 0.3) / (Math.log(mx / mn) / Math.LN10 + 0.3) : v / mx; };
      if (!disp || disp.byL !== byL) disp = {byL: byL, v: vals.map(function(){ return 0; })};
      vals.forEach(function(v, j){ disp.v[j] += (len(v) - disp.v[j]) * 0.12; });
      /* en-tête : la tâche (chauffer de l'eau) */
      var hb = ctx.createLinearGradient(0, 0, 0, 78); hb.addColorStop(0, "#fff7ec"); hb.addColorStop(1, "#fdecd6"); ctx.fillStyle = hb; S.draw.rrect(c, 6, 6, W - 12, 70, 10); ctx.fill();
      heater(ctx, 40, 72, 62);
      S.draw.text(c, "Besoin : " + S.fmt(E.value, 0) + " MJ utiles", 74, 26, {size: phn ? 14 : 16, align: "left", color: pal.ink, weight: 800});
      S.draw.text(c, "≈ de quoi chauffer " + S.fmt(E.value * 1e6 / (4180 * 40), 0) + " L d'eau de 15 °C à 55 °C", 74, 48, {size: 11.5, align: "left", color: "#8a5a12"});
      S.draw.text(c, byL ? "Volume à emporter (litres) · échelle logarithmique" : "Masse à emporter (kg)", 10, 90, {size: 12, align: "left", color: pal.grey});
      var ix = phn ? 26 : 36, lx = phn ? 56 : 74, Wb = W - lx - 66, y0 = 102;
      var best = 0, low = 0; for (i = 1; i < F.length; i++){ if (vals[i] < vals[best]) best = i; if (D[i].co2 < D[low].co2) low = i; }
      F.forEach(function(f, j){
        var yb = y0 + j * rh, yc = yb + rh * 0.62, w = Math.max(3, disp.v[j] * Wb);
        if (j % 2 === 0){ ctx.fillStyle = "#f7f9fc"; ctx.fillRect(4, yb, W - 8, rh); }
        if (j === best) S.draw.glow(c, ix, yb + rh * 0.55, rh * 0.75, "#f4c542", 0.5);
        icon(ctx, f.id, ix, yb + rh - 5, (rh - 8) / 44, f.col);
        S.draw.text(c, f.n, lx, yb + 13, {size: 11.5, align: "left", color: j === best ? pal.green : pal.ink, weight: j === best ? 800 : 700});
        ctx.fillStyle = lin(ctx, 0, yc - 8, 0, yc + 8, [[0, C5.shade(f.col, 0.35)], [1, C5.shade(f.col, -0.15)]]); S.draw.rrect(c, lx, yc - 8, w, 16, 5); ctx.fill();
        S.draw.text(c, S.fmt(vals[j], vals[j] < 1 ? 3 : vals[j] < 100 ? 1 : 0) + (byL ? " L" : " kg"), lx + w + 5, yc, {size: 12, align: "left", color: pal.ink});
      });
      /* CO₂ : barres « fumée » avec bouffées qui montent */
      var cm = Math.max.apply(null, D.map(function(d){ return d.co2; })); cm = Math.max(cm, 0.001);
      if (!dispC) dispC = D.map(function(){ return 0; });
      S.draw.text(g, "CO₂ émis (kg) pour cette énergie", 8, 12, {size: 12, align: "left", color: pal.grey});
      var rh2 = (g.H - 26) / F.length, gx0 = phn ? 96 : 112, gctx = g.ctx;
      F.forEach(function(f, j){ var y = 24 + j * rh2 + rh2 / 2; dispC[j] += (D[j].co2 / cm - dispC[j]) * 0.12; var w = Math.max(0, dispC[j] * (g.W - gx0 - 70));
        S.draw.text(g, f.n.replace(" (gaz)", "").replace(" (liquide)", "").replace(" (octane)", ""), 8, y, {size: 12, align: "left"});
        gctx.fillStyle = lin(gctx, 0, y - rh2 * 0.3, 0, y + rh2 * 0.3, [[0, "#9aa4b1"], [1, "#69737f"]]); S.draw.rrect(g, gx0, y - rh2 * 0.3, Math.max(0.1, w), rh2 * 0.6, 4); gctx.fill();
        if (D[j].co2 > 0.005){ for (var q = 0; q < 3; q++){ var ph = (tm * 0.35 + q / 3 + j * 0.17) % 1, rr = (3 + 5 * Math.sqrt(D[j].co2 / cm)) * (0.6 + ph); gctx.fillStyle = "rgba(120,130,145," + (0.35 * (1 - ph)) + ")"; gctx.beginPath(); gctx.arc(gx0 + w + 4 + ph * 14, y - ph * rh2 * 0.6, rr, 0, 6.2832); gctx.fill(); } }
        S.draw.text(g, D[j].co2 > 0 ? S.fmt(D[j].co2, 2) : "0 (seulement H₂O)", gx0 + w + (D[j].co2 > 0.005 ? 24 : 5), y, {size: 12, align: "left", color: D[j].co2 > 0 ? pal.ink : pal.teal}); });
      ro.set(0, F[best].n + " : " + S.fmt(vals[best], vals[best] < 1 ? 3 : 1) + (byL ? " L" : " kg")); ro.set(1, F[low].n + " : " + S.fmt(D[low].co2, 1) + " kg");
      var eh = D[0].e, ehv = D[0].ev;
      nt.set("Énergie par kg : H₂ " + S.fmt(eh, 0) + " MJ/kg, mais seulement " + S.fmt(ehv * 1000, 1) + " kJ par litre de gaz (≈ 20 °C, 1 atm) ; essence " + S.fmt(D[3].e, 1) + " MJ/kg et " + S.fmt(D[3].ev, 1) + " MJ/L. Bois à " + hum.value + " % d'humidité : " + S.fmt(D[6].e, 1) + " MJ/kg utiles.", "");
    });
  }
});

SFA.sim({
  id: "c5-c06-hess", ch: "c06", tag: "Puzzle",
  titre: "Loi de Hess : construis une réaction avec ce que tu connais",
  resume: "Combine trois combustions pour obtenir l'enthalpie de formation du méthane.",
  but: "Objectif : C(s) + 2 H₂(g) → CH₄(g). Règle les coefficients a, b, c de chaque équation donnée (négatif = on l'inverse) jusqu'à ce que toutes les espèces intermédiaires s'annulent. Lis alors ΔH.",
  aRetenir: "L'enthalpie est une fonction d'état : ΔH ne dépend que de l'état initial et final, pas du chemin. On combine des réactions connues : on multiplie une équation par un coefficient (ΔH aussi) ; si on l'inverse, ΔH change de signe. ΔH_cible = a·ΔH₁ + b·ΔH₂ + c·ΔH₃.",
  piege: "Quand on inverse une équation, le signe de ΔH s'inverse ; quand on la multiplie, ΔH est multiplié aussi. Les valeurs sont arrondies : on trouve −76 kJ/mol ici (valeur de table : environ −75 kJ/mol).",
  build: function(k, S){
    var pal = S.draw.palette;
    var SP = ["C", "H₂", "CH₄", "O₂", "CO₂", "H₂O"];
    var EQ = [
      {t: "(1) C + O₂ → CO₂", dh: -394, v: [-1, 0, 0, -1, 1, 0]},
      {t: "(2) H₂ + ½ O₂ → H₂O", dh: -286, v: [0, -1, 0, -0.5, 0, 1]},
      {t: "(3) CH₄ + 2 O₂ → CO₂ + 2 H₂O", dh: -890, v: [0, 0, -1, -2, 1, 2]}
    ];
    var TG = [-1, -2, 1, 0, 0, 0];
    var c = k.canvas(290);
    var co = [k.slider("a (équation 1, −394 kJ)", -2, 2, 0.5, 1, ""), k.slider("b (équation 2, −286 kJ)", -2, 2, 0.5, 1, ""), k.slider("c (équation 3, −890 kJ)", -2, 2, 0.5, 1, "")];
    var hint = false;
    k.button("Indice", function(){ hint = !hint; });
    var ro = k.readouts(["Somme pondérée des ΔH", "Espèces qui ne s'annulent pas", "État"]);
    var nt = k.note("", "");
    k.draw(function(){
      var cf = co.map(function(s){ return s.value; }), net = [0, 0, 0, 0, 0, 0], tot = 0, i, j;
      for (i = 0; i < 3; i++){ tot += cf[i] * EQ[i].dh; for (j = 0; j < 6; j++) net[j] += cf[i] * EQ[i].v[j]; }
      var resid = []; for (j = 0; j < 6; j++){ var d = Math.abs(net[j] - TG[j]); if (d > 1e-9) resid.push(SP[j] + " (" + (net[j] - TG[j] > 0 ? "+" : "") + S.fmt(net[j] - TG[j], 1) + ")"); }
      var ok = resid.length === 0;
      c.clear();
      var x0 = 16, bw = (c.W - 40) / 4, sc = 1, cum = 0, vals = [cf[0] * EQ[0].dh, cf[1] * EQ[1].dh, cf[2] * EQ[2].dh], mx = 100, mn = -100, run = 0;
      for (i = 0; i < 3; i++){ run += vals[i]; mx = Math.max(mx, run, 0); mn = Math.min(mn, run); }
      mx += 40; mn -= 40; if (mx - mn < 200) mx = mn + 200;
      var Y = function(v){ return 22 + (mx - v) / (mx - mn) * (c.H - 100); }, y0 = Y(0);
      S.draw.line(c, x0, y0, c.W - 10, y0, pal.grey, 1.5);
      S.draw.text(c, "enthalpie cumulée (kJ/mol)", 6, 8, {size: 12, align: "left", color: pal.grey});
      cum = 0;
      for (i = 0; i < 3; i++){
        var from = cum, to = cum + vals[i]; cum = to;
        c.ctx.fillStyle = vals[i] < 0 ? "#f2b7b0" : "#b7c9f2"; var yt = Math.min(Y(from), Y(to)), hh = Math.abs(Y(from) - Y(to));
        c.ctx.fillRect(x0 + i * bw + 4, yt, bw - 12, Math.max(1, hh));
        S.draw.text(c, "×" + S.fmt(cf[i], 1).replace("−", "−") + " éq. " + (i + 1), x0 + i * bw + bw / 2 - 2, c.H - 38, {size: 12});
        S.draw.text(c, S.fmt(vals[i], 0), x0 + i * bw + bw / 2 - 2, Y(to) + (vals[i] < 0 ? 12 : -12), {size: 12});
      }
      c.ctx.fillStyle = ok ? "#9fd3bd" : "#d9dde3"; var yt2 = Math.min(Y(0), Y(tot)); c.ctx.fillRect(x0 + 3 * bw + 4, yt2, bw - 12, Math.max(1, Math.abs(Y(tot) - Y(0))));
      S.draw.text(c, "total", x0 + 3 * bw + bw / 2 - 2, c.H - 38, {size: 12}); S.draw.text(c, S.fmt(tot, 0), x0 + 3 * bw + bw / 2 - 2, Y(tot) + (tot < 0 ? 12 : -12), {size: 12, color: ok ? pal.green : pal.ink});
      S.draw.text(c, ok ? "ΔH(C + 2 H₂ → CH₄) = −76 kJ/mol" : "les espèces ne s'annulent pas encore", c.W / 2, c.H - 12, {size: 13, color: ok ? pal.green : pal.red});
      ro.set(0, S.fmt(tot, 0) + " kJ/mol"); ro.set(1, ok ? "aucune" : resid.join(" ; ")); ro.set(2, ok ? "cible atteinte" : "à ajuster");
      nt.set(ok ? "Réussi : (1) + 2 × (2) − (3) donne C + 2 H₂ → CH₄ : ΔH = −394 + 2(−286) − (−890) = −76 kJ/mol." : hint ? "Indice : CH₄ doit être un PRODUIT : inverse l'équation 3 (c = −1). C est un réactif comme dans (1) : a = 1. Il faut 2 H₂ : b = 2." : "Regarde la liste des espèces en trop ; les nombres entre parenthèses indiquent l'excès (+) ou le manque (−) dans le bilan.", ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c06-canette", ch: "c06", tag: "Niche utile",
  titre: "Une calorie alimentaire : brûler un aliment sous une canette",
  resume: "On brûle un aliment sous une canette d'eau : combien d'énergie dans 1 g ? Et que perd-on ?",
  but: "Choisis un aliment, la masse brûlée, l'eau de la canette et le rendement du montage. Calcule l'énergie mesurée et compare-la à la valeur réelle : qu'est-ce qui change quand tu améliores le rendement ?",
  aRetenir: "Q reçue par l'eau = m(eau)·c·ΔT. Énergie par gramme mesurée = Q / m(aliment brûlé). 1 kcal = 4,18 kJ. Une partie de la chaleur s'échappe dans l'air : la valeur mesurée est toujours INFÉRIEURE à la valeur réelle (rendement η = Q reçue / Q libérée).",
  piege: "Ne divise pas par la masse de l'aliment avant brûlage, mais par la masse effectivement brûlée (différence de pesée). Le rendement d'un montage « canette » est faible (20 à 50 %). Les valeurs énergétiques sont des valeurs de tables arrondies (± quelques %).",
  build: function(k, S){
    var pal = S.draw.palette, CW = 4.18;
    var A = {
      cac: ["Cacahuète", 24, "#c9a06a"], noix: ["Noix", 27, "#a97d52"], choc: ["Chocolat noir", 23, "#5a3a2a"], sucre: ["Sucre", 17, "#f2efe6"], pain: ["Pain", 11, "#d9b57a"], huile: ["Huile", 38, "#e8c840"]
    };
    var c = k.canvas(352), g = k.canvas(190);
    var al = k.select("Aliment", Object.keys(A).map(function(x){ return [x, A[x][0] + " (≈ " + A[x][1] + " kJ/g)"]; }), "cac", function(){ rerun(); });
    var dm = k.slider("Masse d'aliment brûlée", 0.2, 2, 0.1, 0.8, "g", function(){ rerun(); });
    var mw = k.slider("Eau dans la canette", 100, 300, 10, 200, "g");
    var eta = k.slider("Rendement du montage η", 10, 70, 5, 30, "%");
    var burn = {p: 0, on: true};
    function rerun(){ burn.p = 0; burn.on = true; }
    k.button("Allumer l'aliment (relancer)", rerun, true);
    var ro = k.readouts(["Énergie libérée (réelle)", "Énergie reçue par l'eau", "ΔT de l'eau", "Valeur mesurée", "Valeur réelle"]);
    var nt = k.note("", "");
    var tm = 0;
    k.loop(function(dt, t){ tm = t; if (burn.on){ burn.p += dt / 6; if (burn.p >= 1){ burn.p = 1; burn.on = false; } } k.redraw(); }).play();
    k.draw(function(){
      var e = A[al.value][1], Qr = e * dm.value, Qe = Qr * eta.value / 100, dT = Qe * 1000 / (mw.value * CW), emes = Qe / dm.value, p = burn.p, ctx = c.ctx;
      c.clear(); g.clear();
      var cx = c.W / 2 + 14, base = 276, Tnow = 20 + dT * p;
      C5.bench(c, base);
      /* potence */
      ctx.fillStyle = "#5b6678"; ctx.fillRect(cx - 120, 20, 7, base - 20); S.draw.rrect(c, cx - 138, base - 8, 44, 10, 4); ctx.fill(); ctx.fillRect(cx - 120, 22, 86, 6);
      /* canette (coupe) : eau qui se réchauffe */
      var hot = Math.min(1, Math.max(0, (Tnow - 20) / 60)), wc = "rgb(" + Math.round(190 + 50 * hot) + "," + Math.round(224 - 30 * hot) + "," + Math.round(246 - 70 * hot) + ")";
      C5.beaker(c, cx - 62, 30, 124, 138, wc, 0.84, {taper: 0});
      S.draw.text(c, "canette : " + mw.value + " g d'eau", cx, 18, {size: 12, color: pal.grey});
      C5.thermo(c, cx + 36, 44, 96, Tnow, 15, 100, S.fmt(Tnow, 1) + " °C");
      /* aliment + flamme */
      var left = Math.max(0, 1 - p), fl = (burn.on || p < 1) ? (30 + 28 * dm.value) * (0.55 + 0.45 * left) : 0;
      ctx.fillStyle = "#6b7686"; ctx.fillRect(cx - 2, base - 22, 4, 22); ctx.beginPath(); ctx.moveTo(cx - 16, base); ctx.lineTo(cx + 16, base); ctx.lineTo(cx, base - 8); ctx.closePath(); ctx.fillStyle = "#4a5568"; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, base - 30, 13 * (0.4 + 0.6 * left), 8 * (0.4 + 0.6 * left), 0, 0, 6.3); ctx.fillStyle = left > 0.02 ? A[al.value][2] : "#33302c"; ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.4)"; ctx.stroke();
      if (fl > 2){
        var wob = Math.sin(tm * 9) * 2.5;
        S.draw.glow(c, cx, base - 30 - fl / 2, 46 + fl * 0.4, "#ffb23a", 0.35);
        ctx.fillStyle = "rgba(255,120,30,.8)"; C5.flame(ctx, cx, base - 34, fl, 12 + fl * 0.08, wob); ctx.fill();
        ctx.fillStyle = "rgba(255,210,70,.9)"; C5.flame(ctx, cx, base - 34, fl * 0.7, 7 + fl * 0.04, wob * 0.7); ctx.fill();
        ctx.fillStyle = "rgba(80,110,255,.8)"; C5.flame(ctx, cx, base - 34, fl * 0.25, 4, 0); ctx.fill();
      }
      S.draw.text(c, A[al.value][0], cx, base + 16, {size: 12, color: pal.grey});
      /* flux d'énergie : utile (vert) et perdue (rouge) */
      var fu = 10 + 60 * eta.value / 100, fp = 10 + 60 * (1 - eta.value / 100);
      S.draw.arrow(c, cx + 2, base - 34 - fl - 4, cx + 2, 176, pal.green, 3.4);
      S.draw.label(c, S.fmt(Qe, 1) + " kJ utiles", cx + 12, 186, {color: pal.green, align: "left", size: 12});
      S.draw.arrow(c, cx - 22, base - 70, cx - 22 - fp * 0.8, base - 100, pal.red, 3); S.draw.arrow(c, cx + 24, base - 70, cx + 24 + fp * 0.8, base - 100, pal.red, 3);
      S.draw.label(c, "perdu : " + S.fmt(Qr - Qe, 1) + " kJ", cx - 32, base - 78, {color: pal.red, align: "right", size: 12});
      /* balance */
      S.draw.display(c, S.fmt(dm.value + 0.6 - dm.value * p, 2) + " g", 62, base - 30, {w: 98, h: 46, caption: "balance (aliment)", size: 18});
      /* bilan : part utile / perdue */
      var bw = c.W - 40, yb = base + 36;
      ctx.fillStyle = pal.red; ctx.fillRect(20, yb, bw, 12); ctx.fillStyle = pal.green; ctx.fillRect(20, yb, bw * eta.value / 100, 12);
      S.draw.text(c, "η = " + eta.value + " % reçus par l'eau", 24, yb + 22, {size: 11.5, color: pal.green, align: "left"}); S.draw.text(c, (100 - eta.value) + " % perdus", c.W - 24, yb + 22, {size: 11.5, color: pal.red, align: "right"});
      var ax = S.draw.axes(g, {x0: 0, x1: 2, y0: 0, y1: 120, xl: "masse brûlée (g)", yl: "ΔT (K)", stepX: 0.5, stepY: 20, l: 50});
      S.draw.fn(g, ax, function(x){ return e * x * eta.value / 100 * 1000 / (mw.value * CW); }, pal.acc, 2.6);
      S.draw.line(g, ax.X(0), ax.Y(80), ax.X(2), ax.Y(80), pal.red, 1, [3, 4]); S.draw.dot(g, ax.X(dm.value), ax.Y(Math.min(dT, 120)), 6, pal.red);
      ro.set(0, S.fmt(Qr, 1) + " kJ"); ro.set(1, S.fmt(Qe, 1) + " kJ"); ro.set(2, "+" + S.fmt(dT, 1) + " K"); ro.set(3, S.fmt(emes, 1) + " kJ/g = " + S.fmt(emes / 4.18, 1) + " kcal/g"); ro.set(4, e + " kJ/g = " + S.fmt(e / 4.18, 1) + " kcal/g");
      nt.set(dT > 80 ? "L'eau approcherait de l'ébullition (20 + " + S.fmt(dT, 0) + " > 100 °C) : le modèle n'est plus valable. Augmente la masse d'eau ou brûle moins." : "Valeur mesurée = " + S.fmt(emes, 1) + " kJ/g : seulement " + eta.value + " % de la valeur réelle. Un meilleur montage (η plus grand) rapproche la mesure de " + e + " kJ/g.", dT > 80 ? "warn" : "");
    });
  }
});
