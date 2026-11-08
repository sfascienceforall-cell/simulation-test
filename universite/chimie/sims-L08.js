/* Chimie BA1 · L08 · Solutions et propriétés colligatives — simulations SFA originales */
(function(){
var R = 8.314, RHO = 997, G = 9.81;
function nice(x){ var p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
function rnd(i){ var h = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return h - Math.floor(h); }
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
var SOL = {
  none:{n:"eau pure", i:0, M:0, ions:[]},
  glu:{n:"glucose (i = 1)", i:1, M:180.16, ions:["#d08a3c"], f:"C₆H₁₂O₆"},
  ure:{n:"urée (i = 1)", i:1, M:60.06, ions:["#7b5cb8"], f:"CO(NH₂)₂"},
  sac:{n:"saccharose (i = 1)", i:1, M:342.30, ions:["#c0392b"], f:"C₁₂H₂₂O₁₁"},
  nacl:{n:"NaCl (i = 2)", i:2, M:58.44, ions:["#2f5fb3","#2e8b57"], f:"NaCl"},
  cacl2:{n:"CaCl₂ (i = 3)", i:3, M:110.98, ions:["#c9a227","#2e8b57","#2e8b57"], f:"CaCl₂"}
};
var SOLOPT = Object.keys(SOL).map(function(q){ return [q, SOL[q].n]; });

/* ---------- 1. Osmose : le tube en U et la colonne qui monte ---------- */
SFA.sim({
  id:"uc-L08-osmose", ch:"L08", tag:"Colligatives",
  titre:"Osmose : le tube en U et la colonne qui monte",
  resume:"Deux solutions séparées par une membrane semi-perméable : l'eau passe, la colonne monte jusqu'à équilibrer la pression osmotique. Ajoute une pression pour inverser le flux.",
  but:"Choisis le soluté et la concentration de chaque côté. Les molécules d'eau traversent la membrane vers le côté le plus concentré en particules (osmolarité = i·c) et le niveau monte jusqu'à ce que ρ·g·h compense la différence de pression osmotique. Applique une pression sur le côté concentré : au-delà de ΔΠ, l'eau repart dans l'autre sens (osmose inverse).",
  aRetenir:"Π = i·c·R·T (van 't Hoff, solutions diluées), avec c en mol/m³ pour obtenir des pascals. L'eau traverse la membrane vers la solution la plus concentrée en particules osmotiquement actives. À l'équilibre ρ·g·h = ΔΠ − P<sub>appliquée</sub>. Deux solutions de même osmolarité sont isotoniques : pas de flux net.",
  piege:"Ce n'est pas la concentration molaire qui compte, mais le nombre de particules : 0,15 mol/L de NaCl (≈ 0,30 osmol/L) est isotonique à 0,30 mol/L de glucose. Et 1 osmol/L à 25 °C donne déjà ≈ 2,5 MPa (≈ 25 atm) : la colonne théorique dépasse 250 m, d'où l'échelle automatique.",
  build:function(k, S){
    var c = k.canvas(380);
    var P = S.draw.palette;
    var st = {h:0, parts:[[], []], water:[], t:0, side:1};
    var sa = k.select("Côté gauche : soluté", SOLOPT, "none", function(){ st.parts = [[], []]; });
    var ca = k.slider("Concentration gauche", 0, 1, 0.01, 0, "mol/L");
    var sb = k.select("Côté droit : soluté", SOLOPT, "glu", function(){ st.parts = [[], []]; });
    var cb = k.slider("Concentration droite", 0, 1, 0.01, 0.1, "mol/L");
    var th = k.slider("Température", 5, 45, 1, 25, "°C");
    var pa = k.slider("Pression appliquée sur le côté concentré", 0, 4000, 10, 0, "kPa");
    k.button("Isotonique : glucose vs NaCl", function(){ sa.set("glu"); ca.set(0.30); sb.set("nacl"); cb.set(0.15); pa.set(0); st.parts = [[], []]; }, false);
    k.button("Plasma vs eau (37 °C)", function(){ sa.set("none"); ca.set(0); sb.set("nacl"); cb.set(0.15); th.set(37); pa.set(0); st.parts = [[], []]; }, false);
    k.button("Dessalement par osmose inverse", function(){ sa.set("none"); ca.set(0); sb.set("nacl"); cb.set(0.6); th.set(25); pa.set(4000); st.parts = [[], []]; }, false);
    var ro = k.readouts(["Osmolarité gauche", "Osmolarité droite", "Π gauche", "Π droite", "ΔΠ", "Hauteur de colonne h"]);
    var nt = k.note("", "ok");
    function calc(){
      var T = th.value + 273.15, A = SOL[sa.value], B = SOL[sb.value];
      var oa = A.i * (sa.value === "none" ? 0 : ca.value), ob = B.i * (sb.value === "none" ? 0 : cb.value);
      var Pa = oa * 1000 * R * T / 1000, Pb = ob * 1000 * R * T / 1000;   /* kPa */
      var dP = Math.abs(Pb - Pa), high = Pb >= Pa ? 1 : 0;
      var net = dP - pa.value;       /* kPa, positif : l'eau va vers le côté concentré */
      return {T:T, oa:oa, ob:ob, Pa:Pa, Pb:Pb, dP:dP, high:high, net:net, heq:net * 1000 / (RHO * G), eq:dP < 1e-9};
    }
    var lp = k.loop(function(dt){
      var cc = calc(); st.t += dt;
      var tau = 1.8; st.h += (cc.heq - st.h) * (1 - Math.exp(-dt / tau));
      /* particules de soluté : leur nombre suit la concentration */
      [[sa, ca, 0], [sb, cb, 1]].forEach(function(q){
        var s = SOL[q[0].value], want = q[0].value === "none" ? 0 : Math.round(q[1].value * 24), arr = st.parts[q[2]];
        while (arr.length < want){ arr.push({x:rnd(arr.length * 7 + q[2] * 3 + st.t * 0.0) , y:rnd(arr.length * 13 + 5 + q[2]), vx:(rnd(arr.length + 9) - .5), vy:(rnd(arr.length + 21) - .5)}); }
        while (arr.length > want) arr.pop();
        arr.forEach(function(p){ p.x += p.vx * dt * 0.35; p.y += p.vy * dt * 0.35; if (p.x < 0.04 || p.x > 0.96) p.vx *= -1; if (p.y < 0.04 || p.y > 0.96) p.vy *= -1; p.x = Math.max(.02, Math.min(.98, p.x)); p.y = Math.max(.02, Math.min(.98, p.y)); if (Math.random() < dt * 0.8){ p.vx = Math.random() - .5; p.vy = Math.random() - .5; } });
      });
      /* molécules d'eau qui traversent la membrane : flux net tant que le niveau n'a pas atteint l'équilibre */
      if (cc.dP > 1e-9){
        var toward = cc.high === 1 ? 1 : -1, flowDir = (cc.net >= 0 ? 1 : -1) * toward;
        var imb = Math.min(1, Math.abs(cc.net - st.h * RHO * G / 1000) / Math.max(cc.dP, 50));
        if (Math.random() < dt * (3 + 22 * imb)) st.water.push({k:0, dir:flowDir, y:Math.random()});
        if (Math.random() < dt * 3) st.water.push({k:0, dir:-flowDir, y:Math.random()});
      } else if (Math.random() < dt * 5){ st.water.push({k:0, dir:Math.random() < .5 ? 1 : -1, y:Math.random()}); }
      st.water.forEach(function(w){ w.k += dt / 0.9; });
      st.water = st.water.filter(function(w){ return w.k < 1; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, cc = calc(), cx = W / 2;
      c.clear();
      var armW = Math.min(110, W * 0.26), bottom = H - 50, chanH = 46, top = 46, yM = H * 0.52;
      var xl0 = cx - armW - 34, xl1 = cx - 34, xr0 = cx + 34, xr1 = cx + armW + 34;
      var hs = nice(Math.max(Math.abs(cc.heq), Math.abs(st.h), 0.05)), vis = Math.max(-92, Math.min(92, st.h / hs * 80));
      /* niveau de chaque bras : le côté concentré monte quand vis > 0 */
      var hiR = cc.high === 1, yHi = yM - vis / 2, yLo = yM + vis / 2;
      var yL = hiR ? yLo : yHi, yR = hiR ? yHi : yLo;
      if (cc.dP < 1e-9){ yL = yR = yM - vis / 2 * 0; }
      /* contenant en U */
      var tubeCol = "#8a95a3";
      function fillSide(x0, x1, y, tint, ions){
        ctx.fillStyle = "rgba(90,169,201,.30)"; ctx.fillRect(x0, y, x1 - x0, bottom - y);
        if (tint > 0){ ctx.fillStyle = "rgba(208,138,60," + Math.min(.28, tint * .35) + ")"; ctx.fillRect(x0, y, x1 - x0, bottom - y); }
      }
      var tintA = Math.min(1, cc.oa), tintB = Math.min(1, cc.ob);
      fillSide(xl0, xl1, yL, tintA); fillSide(xr0, xr1, yR, tintB);
      /* canal du bas */
      ctx.fillStyle = "rgba(90,169,201,.30)"; ctx.fillRect(xl1, bottom - chanH + 6, xr0 - xl1, chanH - 6);
      ctx.fillRect(xl0, bottom, xr1 - xl0, 0);
      ctx.strokeStyle = tubeCol; ctx.lineWidth = 3; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(xl0, top); ctx.lineTo(xl0, bottom); ctx.lineTo(xr1, bottom); ctx.lineTo(xr1, top); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xl1, top); ctx.lineTo(xl1, bottom - chanH); ctx.lineTo(xr0, bottom - chanH); ctx.lineTo(xr0, top); ctx.stroke();
      /* membrane au milieu du canal */
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = P.red; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(cx, bottom - chanH); ctx.lineTo(cx, bottom); ctx.stroke(); ctx.restore();
      S.draw.text(c, "membrane semi-perméable", cx, bottom + 16, {size:10.5, color:P.red});
      /* solutés */
      [[xl0, xl1, yL, 0, sa, tintA], [xr0, xr1, yR, 1, sb, tintB]].forEach(function(q){
        var arr = st.parts[q[3]], s = SOL[q[4].value], y0 = q[2] + 6, hh = bottom - q[2] - 12;
        arr.forEach(function(p, idx){
          s.ions.forEach(function(col, j){
            var ox = (rnd(idx * 5 + j * 11) - .5) * 0.05, oy = (rnd(idx * 3 + j * 7) - .5) * 0.05;
            ball(ctx, q[0] + 8 + (p.x + ox) * (q[1] - q[0] - 16), y0 + (p.y + oy) * hh, 4.2, col, 1);
          });
        });
      });
      /* eau qui traverse */
      st.water.forEach(function(w){
        var x = cx + w.dir * (w.k - 0.5) * 70, y = bottom - chanH + 10 + w.y * (chanH - 18);
        ball(ctx, x, y, 3.2, "#5aa9c9", 1);
      });
      /* pression appliquée : piston sur le côté concentré */
      if (pa.value > 0){
        var px0 = hiR ? xr0 : xl0, px1 = hiR ? xr1 : xl1, yy = hiR ? yR : yL;
        ctx.fillStyle = "#5f6b7a"; ctx.fillRect(px0 + 2, yy - 8, px1 - px0 - 4, 8);
        var nw = Math.max(1, Math.round(pa.value / 1000));
        for (var w2 = 0; w2 < nw; w2++){ ctx.fillStyle = "#3b4350"; ctx.fillRect(px0 + 14, yy - 8 - (w2 + 1) * 9, px1 - px0 - 28, 8); }
        S.draw.text(c, S.fmt(pa.value, 0) + " kPa", (px0 + px1) / 2, yy - 8 - (nw + 1) * 9 - 6, {size:11, color:P.ink});
      }
      /* flèche de colonne */
      if (cc.dP > 1e-9 && Math.abs(vis) > 3){
        var xa = hiR ? xr1 + 14 : xl0 - 14;
        S.draw.line(c, xa - 5, yHi, xa + 5, yHi, P.red, 2); S.draw.line(c, xa - 5, yLo, xa + 5, yLo, P.red, 2);
        S.draw.arrow(c, xa, yLo, xa, yHi, P.red, 2); S.draw.arrow(c, xa, yHi, xa, yLo, P.red, 2);
        S.draw.text(c, "h", xa + (hiR ? 10 : -10), (yHi + yLo) / 2, {size:12, color:P.red});
      }
      S.draw.text(c, "gauche", (xl0 + xl1) / 2, top - 18, {size:11.5, color:P.grey});
      S.draw.text(c, "droite", (xr0 + xr1) / 2, top - 18, {size:11.5, color:P.grey});
      S.draw.text(c, "échelle de h : 80 px ≈ " + S.fmt(hs, hs < 1 ? 2 : 0) + " m", 8, H - 8, {size:9.5, color:P.grey, align:"left", weight:600});
      if (cc.dP > 1e-9) S.draw.text(c, cc.net > 0 ? "l'eau va vers la solution la plus concentrée" : cc.net < 0 ? "osmose inverse : l'eau est chassée vers le côté dilué" : "pression appliquée = ΔΠ : plus de flux net", W / 2, H - 26, {size:10.5, color:cc.net < 0 ? P.red : P.acc, align:"center", weight:800});
      /* lectures */
      function atm(p){ return S.fmt(p / 101.325, 1) + " atm"; }
      ro.set(0, S.fmt(cc.oa, 3) + " osmol/L"); ro.set(1, S.fmt(cc.ob, 3) + " osmol/L");
      ro.set(2, S.fmt(cc.Pa, 0) + " kPa (" + atm(cc.Pa) + ")"); ro.set(3, S.fmt(cc.Pb, 0) + " kPa (" + atm(cc.Pb) + ")");
      ro.set(4, S.fmt(cc.dP, 0) + " kPa (" + atm(cc.dP) + ")");
      ro.set(5, S.fmt(Math.abs(st.h), Math.abs(st.h) < 10 ? 2 : 1) + " m" + (st.h < -0.005 ? " (sens inversé)" : ""));
      var msg;
      if (cc.dP < 1e-9) msg = "Les deux côtés ont la même osmolarité : ils sont isotoniques, aucun flux net d'eau (les molécules d'eau passent autant dans un sens que dans l'autre).";
      else if (cc.net > 0) msg = "Le côté " + (cc.high ? "droit" : "gauche") + " est plus concentré. À l'équilibre : ρ·g·h = ΔΠ − P<sub>appl.</sub> = " + S.fmt(cc.net, 0) + " kPa, soit h = " + S.fmt(cc.heq, cc.heq < 10 ? 2 : 1) + " m d'eau.";
      else if (cc.net < 0) msg = "La pression appliquée (" + S.fmt(pa.value, 0) + " kPa) dépasse ΔΠ = " + S.fmt(cc.dP, 0) + " kPa : l'eau est refoulée à travers la membrane vers le côté dilué. C'est le principe du dessalement par osmose inverse.";
      else msg = "La pression appliquée compense exactement ΔΠ : le niveau ne bouge pas.";
      var warn = (cc.oa > 1 || cc.ob > 1.1) ? " Au-delà d'environ 1 osmol/L, la loi de van 't Hoff devient approximative." : "";
      nt.set(msg + " (i supposé entier : dissociation totale idéale.)" + warn, (cc.oa > 1 || cc.ob > 1.1 || cc.net < 0) ? "warn" : "ok");
    });
  }
});

/* ---------- 2. Cryoscopie : la courbe de refroidissement ---------- */
var SLV = {
  eau:{n:"eau", Tf:0, Kf:1.86, Teb:100, Keb:0.512, Cp:4.18, L:334, Cps:2.09},
  benz:{n:"benzène", Tf:5.5, Kf:5.12, Teb:80.1, Keb:2.53, Cp:1.74, L:127, Cps:1.5},
  acet:{n:"acide acétique", Tf:16.6, Kf:3.90, Teb:118.1, Keb:3.07, Cp:2.05, L:195, Cps:1.9}
};
var CRY = {
  glu:{n:"glucose (i = 1)", i:1, M:180.16}, sac:{n:"saccharose (i = 1)", i:1, M:342.30}, eg:{n:"éthylène glycol (i = 1, antigel)", i:1, M:62.07},
  ure:{n:"urée (i = 1)", i:1, M:60.06}, nacl:{n:"NaCl (i = 2)", i:2, M:58.44}, cacl2:{n:"CaCl₂ (i = 3)", i:3, M:110.98}
};
function cooling(sv, dTf, Tend, Tb, pure){
  /* bilan d'énergie : 100 g de solvant, flux h·(T − T_bain) ; la solution gèle en se concentrant : T_f(x) = T_f° − ΔT_f/(1 − x) */
  var m = 100, h = m * sv.Cp / 240, dt = 1, t = 0, T = sv.Tf + 14, x = 0, ph = "liq", out = {t:[0], T:[T], x:[0]}, xmax = pure ? 1 : 0.85;
  while (t < 20000 && T > Tend){
    if (ph === "liq"){ T += -h * (T - Tb) / (m * sv.Cp) * dt; if (T <= sv.Tf - (pure ? 0 : dTf)){ T = sv.Tf - (pure ? 0 : dTf); ph = "frz"; out.first = t; } }
    else if (ph === "frz"){
      var Tf = sv.Tf - (pure ? 0 : dTf / (1 - x)); T = Tf;
      x += h * (T - Tb) / (m * sv.L) * dt;
      if (x >= xmax){ x = xmax; ph = "sol"; out.endFrz = t; }
    } else { T += -h * (T - Tb) / (m * sv.Cps) * dt; }
    t += dt;
    if (Math.round(t) % 3 === 0){ out.t.push(t); out.T.push(T); out.x.push(x); }
  }
  return out;
}
SFA.sim({
  id:"uc-L08-cryoscopie", ch:"L08", tag:"Colligatives",
  titre:"Cryoscopie : la courbe de refroidissement",
  resume:"Refroidis un solvant pur puis une solution : le palier de congélation baisse de ΔT<sub>f</sub> = i·K<sub>f</sub>·b et s'incline.",
  but:"Choisis un solvant, un soluté et une molalité. La courbe grise est celle du solvant pur (palier horizontal), la bleue celle de la solution. Fais avancer le temps : la glace se forme, la solution se concentre, et son point de congélation continue de descendre. Lis ΔT<sub>f</sub> au début du palier.",
  aRetenir:"ΔT<sub>f</sub> = i·K<sub>f</sub>·b avec b la molalité (mol de soluté par kg de <b>solvant</b>) et K<sub>f</sub> une constante du solvant (eau : 1,86 K·kg·mol⁻¹). Elle ne dépend que du nombre de particules dissoutes, pas de leur nature. Même loi pour l'élévation ébullioscopique : ΔT<sub>eb</sub> = i·K<sub>eb</sub>·b (eau : 0,512 K·kg·mol⁻¹).",
  piege:"La molalité se rapporte à la masse de solvant (en kg), pas au volume de solution. Et il faut compter les particules : NaCl donne i = 2, CaCl₂ i = 3 (dissociation totale idéale). Si on prend i = 1 pour NaCl, on trouve une masse molaire apparente moitié de la vraie.",
  build:function(k, S){
    var c = k.canvas(300), c2 = k.canvas(150);
    var P = S.draw.palette;
    var sl = k.select("Solvant", Object.keys(SLV).map(function(q){ return [q, SLV[q].n]; }), "eau");
    var so = k.select("Soluté", Object.keys(CRY).map(function(q){ return [q, CRY[q].n]; }), "nacl");
    var bS = k.slider("Molalité b", 0, 2, 0.05, 0.5, "mol/kg");
    var tS = k.slider("Temps écoulé", 0, 100, 1, 0, "%");
    var playing = false, tm = null;
    k.button("Lecture ▶ / pause", function(){ if (tS.value >= 100) tS.set(0); playing = !playing; if (playing) lp.play(); else lp.pause(); }, true);
    var ro = k.readouts(["ΔT<sub>f</sub> = i·K<sub>f</sub>·b", "Début de congélation (solution)", "Soluté pour 100 g de solvant", "Masse molaire apparente (si i = 1)", "ΔT<sub>eb</sub> = i·K<sub>eb</sub>·b", "Ébullition de la solution"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){ if (!playing) return; var v = tS.value + dt * 100 / 14; if (v >= 100){ v = 100; playing = false; lp.pause(); } tS.set(v); k.redraw(); });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, sv = SLV[sl.value], sx = CRY[so.value], b = bS.value, dTf = sx.i * sv.Kf * b;
      c.clear(); c2.clear();
      var Tend = sv.Tf - Math.max(15, dTf * 1.2 + 8), Tb = Tend - 12;
      var cp = cooling(sv, 0, Tend, Tb, true), cs = cooling(sv, dTf, Tend, Tb, false);
      var tmax = Math.max(cp.t[cp.t.length - 1], cs.t[cs.t.length - 1]);
      var L = 50, Rr = 14, Tp = 22, Bt = 30, ax = {L:L, R:c.W - Rr, T:Tp, B:c.H - Bt};
      ax.X = function(x){ return L + x / (tmax / 60) * (ax.R - ax.L); };
      var y0 = Tend, y1 = sv.Tf + 15;
      ax.Y = function(y){ return ax.B - (y - y0) / (y1 - y0) * (ax.B - ax.T); };
      ctx.save(); ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1;
      var sy = nice(y1 - y0), stY = (y1 - y0) / 6, stp = stY < 2 ? 1 : stY < 3.5 ? 2 : stY < 7 ? 5 : 10;
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var gy = Math.ceil(y0 / stp) * stp; gy <= y1; gy += stp){ ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(gy)); ctx.lineTo(ax.R, ax.Y(gy)); ctx.stroke(); ctx.fillText(S.fmt(gy, 0), ax.L - 6, ax.Y(gy)); }
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      var stx = tmax / 60 < 12 ? 2 : tmax / 60 < 30 ? 5 : 10;
      for (var gx = 0; gx <= tmax / 60; gx += stx){ ctx.beginPath(); ctx.moveTo(ax.X(gx), ax.T); ctx.lineTo(ax.X(gx), ax.B); ctx.stroke(); ctx.fillText(S.fmt(gx, 0), ax.X(gx), ax.B + 5); }
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax.L, ax.T); ctx.lineTo(ax.L, ax.B); ctx.lineTo(ax.R, ax.B); ctx.stroke();
      ctx.restore();
      S.draw.text(c, "T (°C)", ax.L, 9, {size:11.5, color:"#2c3a4e", align:"left"});
      S.draw.text(c, "t (min)", ax.R, ax.B + 17, {size:11.5, color:"#2c3a4e", align:"right"});
      var tcur = tS.value / 100 * tmax;
      function trace(cv, col, w, dash, upto){
        ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
        ctx.beginPath(); var started = false;
        for (var i = 0; i < cv.t.length; i++){ if (cv.t[i] > upto) break; var X = ax.X(cv.t[i] / 60), Y = ax.Y(cv.T[i]); if (!started){ ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y); }
        ctx.stroke(); ctx.restore();
      }
      /* repères de température de congélation */
      S.draw.line(c, ax.L, ax.Y(sv.Tf), ax.R, ax.Y(sv.Tf), "#b6bfcc", 1.2, [3, 4]);
      if (dTf > 0.005){
        S.draw.line(c, ax.L, ax.Y(sv.Tf - dTf), ax.R, ax.Y(sv.Tf - dTf), "rgba(30,63,143,.45)", 1.2, [3, 4]);
        S.draw.arrow(c, ax.X(tmax / 60 * 0.9), ax.Y(sv.Tf), ax.X(tmax / 60 * 0.9), ax.Y(sv.Tf - dTf), P.red, 2);
        S.draw.text(c, "ΔTf = " + S.fmt(dTf, 2) + " K", ax.X(tmax / 60 * 0.9) - 6, (ax.Y(sv.Tf) + ax.Y(sv.Tf - dTf)) / 2, {size:10.5, color:P.red, align:"right", bg:"rgba(255,255,255,.85)"});
      }
      trace(cp, "#b4bdc9", 3.2, null, tmax);
      trace(cs, P.acc, 3, null, tcur);
      /* point courant */
      var idx = 0; while (idx < cs.t.length - 1 && cs.t[idx] < tcur) idx++;
      var Tcur = cs.T[Math.min(idx, cs.T.length - 1)], xcur = cs.x[Math.min(idx, cs.x.length - 1)];
      S.draw.dot(c, ax.X(tcur / 60), ax.Y(Tcur), 6, P.red);
      S.draw.text(c, "solvant pur (gris)", ax.R - 6, ax.T + 10, {size:11, color:"#7b8696", align:"right"});
      S.draw.text(c, "solution (bleu)", ax.R - 6, ax.T + 26, {size:11, color:P.acc, align:"right"});
      /* bécher : glace et solution qui se concentre */
      var cx0 = 40, bw = 110, bt = 14, bb = c2.H - 22, bh = bb - bt;
      var c2x = c2.ctx;
      c2x.strokeStyle = "#8a95a3"; c2x.lineWidth = 3; c2x.beginPath(); c2x.moveTo(cx0, bt); c2x.lineTo(cx0, bb); c2x.lineTo(cx0 + bw, bb); c2x.lineTo(cx0 + bw, bt); c2x.stroke();
      var liqH = bh * 0.8 * (1 - 0.0 * xcur), iceH = liqH * xcur;
      c2x.fillStyle = "rgba(90,169,201,.28)"; c2x.fillRect(cx0 + 2, bb - liqH, bw - 4, liqH - iceH * 0.0);
      /* glace : cristaux qui s'empilent depuis le fond */
      c2x.fillStyle = "rgba(235,245,252,.95)"; c2x.strokeStyle = "#9fc3d8"; c2x.lineWidth = 1;
      var nIce = Math.round(xcur * 70);
      for (var q = 0; q < nIce; q++){ var col = q % 7, row = Math.floor(q / 7); var ix = cx0 + 6 + col * 15 + (row % 2) * 7, iy = bb - 8 - row * 11; c2x.beginPath(); c2x.rect(ix, iy, 12, 9); c2x.fill(); c2x.stroke(); }
      /* particules de soluté : leur nombre est fixe, elles restent dans le liquide restant */
      var nSol = Math.round(Math.min(1, b / 2) * 22 * sx.i);
      var liqTopY = bb - liqH, liqBotY = bb - Math.min(liqH, iceH * 1.0 + 0) - 4;
      for (var j = 0; j < nSol; j++){
        var px = cx0 + 8 + rnd(j * 3.1) * (bw - 16), py = liqTopY + 6 + rnd(j * 7.7 + 2) * Math.max(6, (liqH - iceH) - 12);
        ball(c2x, px, py, 3.3, j % 2 && sx.i > 1 ? "#2e8b57" : "#d08a3c", 1);
      }
      /* thermomètre */
      var tx = cx0 + bw + 46, ty0 = 14, ty1 = c2.H - 24;
      c2x.fillStyle = "#eef2f7"; c2x.fillRect(tx - 5, ty0, 10, ty1 - ty0);
      var Tlo = Tend, Thi = sv.Tf + 15, fr = Math.max(0, Math.min(1, (Tcur - Tlo) / (Thi - Tlo)));
      c2x.fillStyle = P.red; c2x.fillRect(tx - 5, ty1 - (ty1 - ty0) * fr, 10, (ty1 - ty0) * fr);
      S.draw.text(c2, S.fmt(Tcur, 1) + " °C", tx + 12, ty1 - (ty1 - ty0) * fr, {size:12, color:P.red, align:"left"});
      S.draw.text(c2, "glace formée : " + S.fmt(xcur * 100, 0) + " % de la masse", cx0 + bw / 2, c2.H - 8, {size:10.5, color:P.grey});
      S.draw.text(c2, "t = " + S.fmt(tcur / 60, 1) + " min", c2.W - 10, 28, {size:11.5, color:P.ink, align:"right"});
      var phase = xcur <= 0.0001 ? (Tcur > sv.Tf - dTf + 0.01 ? "liquide qui refroidit" : "début de congélation") : xcur < 0.84 ? "congélation en cours" : "presque tout est solide";
      S.draw.text(c2, phase, c2.W - 10, 48, {size:10.5, color:P.grey, align:"right"});
      /* lectures */
      var m2 = b * sx.M;   /* g de soluté par kg de solvant */
      ro.set(0, S.fmt(dTf, 2) + " K");
      ro.set(1, S.fmt(sv.Tf - dTf, 2) + " °C (pur : " + S.fmt(sv.Tf, 1) + " °C)");
      ro.set(2, S.fmt(m2 / 10, 2) + " g");
      ro.set(3, dTf > 0 ? S.fmt(sv.Kf * m2 / 1000 / (dTf) * 1000 / 1000 * 1, 1).replace(/.*/, S.fmt(sv.Kf * (m2 / 1000) / dTf, 1)) + " g/mol (réelle : " + S.fmt(sx.M, 1) + ")" : "—");
      var dTeb = sx.i * sv.Keb * b;
      ro.set(4, S.fmt(dTeb, 3) + " K"); ro.set(5, S.fmt(sv.Teb + dTeb, 2) + " °C (pur : " + S.fmt(sv.Teb, 1) + " °C)");
      var warn = (b > 1 && sx.i > 1) || b > 1.5 ? " Au-delà d'environ 1 mol/kg (surtout pour un électrolyte), la solution n'est plus idéale : l'écart à la loi devient notable." : "";
      nt.set("ΔT<sub>f</sub> = " + sx.i + " × " + S.fmt(sv.Kf, 2) + " × " + S.fmt(b, 2) + " = <b>" + S.fmt(dTf, 2) + " K</b>. Modèle simplifié : solution idéale, pas de surfusion, un seul solvant qui cristallise ; en réalité la solution se fige au point eutectique (l'eau salée à −21 °C environ)." + (sx.i > 1 && b > 0 ? " Avec i = 1 on déduirait une masse molaire " + S.fmt(sx.i, 0) + " fois trop faible : il faut compter les ions." : "") + warn, warn ? "warn" : "ok");
    });
  }
});
})();
