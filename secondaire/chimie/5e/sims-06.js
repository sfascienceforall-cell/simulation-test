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
    var c = k.canvas(250), g = k.canvas(230);
    var per = k.seg("Comparer par", [["kg", "masse (kg)"], ["L", "volume (litres)"]], "kg");
    var E = k.slider("Énergie utile voulue", 1, 100, 1, 17, "MJ");
    var hum = k.slider("Humidité du bois", 0, 60, 5, 20, "%");
    var ro = k.readouts(["Meilleur par " + "unité choisie", "Le moins de CO₂"]);
    var nt = k.note("100 L d'eau de 15 °C à 55 °C demandent 100 000 × 4,18 × 40 ≈ 16,7 MJ.", "");
    function data(f){
      var e = f.dh / f.M;   /* MJ/kg : kJ/mol ÷ g/mol = kJ/g = MJ/kg */
      if (f.id === "bois"){ var h = hum.value / 100; e = (1 - h) * e - h * 2.44; }
      var mass = E.value / e;     /* kg de combustible */
      var rhoKgL = f.rho;    /* masse volumique en kg par litre */
      var vol = mass / rhoKgL;    /* litres */
      var co2 = f.nC > 0 ? (f.id === "bois" ? mass * (1 - hum.value / 100) * 6 * 44 / 162 : mass * 1000 / f.M * f.nC * 44 / 1000) : 0;   /* kg de CO2 */
      return {e: e, mass: mass, vol: vol, co2: co2, ev: e * rhoKgL};
    }
    k.draw(function(){
      c.clear(); g.clear();
      var D = F.map(data), byL = per.value === "L", i;
      var vals = D.map(function(d){ return byL ? d.vol : d.mass; }), mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
      var len = function(v){ return byL ? (Math.log(v / mn) / Math.LN10 + 0.3) / (Math.log(mx / mn) / Math.LN10 + 0.3) : v / mx; };
      var lx = 112, W = c.W - lx - 70, rh = (c.H - 22) / F.length;
      S.draw.text(c, byL ? "Volume nécessaire (litres) — échelle logarithmique" : "Masse nécessaire (kg)", 6, 10, {size: 12, align: "left", color: pal.grey});
      F.forEach(function(f, j){ var y = 24 + j * rh + rh / 2, w = Math.max(2, len(vals[j]) * W);
        S.draw.text(c, f.n, 6, y, {size: 12, align: "left"}); c.ctx.fillStyle = f.col; c.ctx.fillRect(lx, y - rh * 0.32, w, rh * 0.64);
        S.draw.text(c, S.fmt(vals[j], vals[j] < 1 ? 3 : vals[j] < 100 ? 1 : 0), lx + w + 4, y, {size: 12, align: "left"}); });
      var cm = Math.max.apply(null, D.map(function(d){ return d.co2; })); cm = Math.max(cm, 0.001);
      S.draw.text(g, "CO₂ émis (kg) pour cette énergie", 6, 10, {size: 12, align: "left", color: pal.grey});
      var rh2 = (g.H - 22) / F.length;
      F.forEach(function(f, j){ var y = 24 + j * rh2 + rh2 / 2, w = Math.max(0, D[j].co2 / cm * (g.W - lx - 70));
        S.draw.text(g, f.n, 6, y, {size: 12, align: "left"}); g.ctx.fillStyle = f.col; g.ctx.fillRect(lx, y - rh2 * 0.32, w, rh2 * 0.64);
        S.draw.text(g, S.fmt(D[j].co2, 2), lx + w + 4, y, {size: 12, align: "left"}); });
      var best = 0, low = 0; for (i = 1; i < F.length; i++){ if (vals[i] < vals[best]) best = i; if (D[i].co2 < D[low].co2) low = i; }
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
