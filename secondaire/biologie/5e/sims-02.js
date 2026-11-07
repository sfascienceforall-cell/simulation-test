/* Chapitre 2 · Synapse, réflexe et intégration nerveuse */
(function(){
var REST = -70, THR = -55;

SFA.sim({
  id: "b5-c02-sommation", ch: "c02", tag: "Classique",
  titre: "La synapse additionne : sommation spatiale et temporelle",
  resume: "Nombre de synapses excitatrices/inhibitrices et fréquence → le neurone décharge-t-il ?",
  but: "Un neurone reçoit des messages de plusieurs synapses. Chaque synapse excitatrice ajoute +2 mV, chaque synapse inhibitrice retire 2 mV (la dépolarisation s'efface avec une constante de temps de 10 ms). Trouve une combinaison qui déclenche des potentiels d'action, puis la plus petite fréquence qui y parvient avec 4 synapses.",
  aRetenir: "Un seul message est presque toujours insuffisant. Le neurone additionne les potentiels postsynaptiques : sommation spatiale (plusieurs synapses en même temps) et sommation temporelle (messages rapprochés, qui s'ajoutent avant de s'éteindre). Les synapses inhibitrices éloignent du seuil. Le neurone décharge si le total atteint −55 mV.",
  piege: "Les neurones ne se touchent pas : la fente synaptique (≈ 20 nm) est franchie par un neurotransmetteur, et le message arrivant n'est pas « tout ou rien » au niveau du neurone suivant : les petits potentiels postsynaptiques s'additionnent. Modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var nE = k.slider("Synapses excitatrices actives", 0, 10, 1, 4, "");
    var nI = k.slider("Synapses inhibitrices actives", 0, 6, 1, 0, "");
    var f = k.slider("Fréquence des PA présynaptiques", 5, 200, 5, 50, "Hz");
    var ro = k.readouts(["Effet d'une salve", "PA postsynaptiques / 200 ms", "Potentiel max."]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var T = 200, J = 2 * (nE.value - nI.value), per = 1000 / f.value, tau = 10, V = REST, vmax = REST, nap = 0, pts = [], spikes = [], pre = [];
      for (var t0 = 5; t0 <= T; t0 += per) pre.push(t0);
      var pi = 0;
      for (var t = 0; t <= T; t += 0.1){
        V = REST + (V - REST) * Math.exp(-0.1 / tau);
        while (pi < pre.length && pre[pi] <= t + 1e-9){ V += J; pi++; }
        if (V < REST - 15) V = REST - 15;
        if (V >= THR - 1e-9){ nap++; spikes.push(t); vmax = Math.max(vmax, THR); V = REST; pts.push([t, 40]); pts.push([t + 0.1, REST]); continue; }
        if (V > vmax) vmax = V;
        pts.push([t, V]);
      }
      var ax = S.draw.axes(c, {x0: 0, x1: T, y0: -90, y1: 50, xl: "t (ms)", yl: "V (mV)", stepX: 20, stepY: 20});
      S.draw.line(c, ax.X(0), ax.Y(THR), ax.X(T), ax.Y(THR), pal.red, 1.5, [6, 4]);
      S.draw.text(c, "seuil −55", ax.X(T) - 4, ax.Y(THR) + 10, {size: 12, color: pal.red, align: "right"});
      pre.forEach(function(p){ S.draw.line(c, ax.X(p), ax.B, ax.X(p), ax.B - 12, pal.amber, 1.5); });
      S.draw.text(c, "PA présynaptiques", ax.L + 4, ax.B - 22, {align: "left", size: 12, color: pal.amber});
      B5.poly(c, ax, pts, pal.violet, 2.2);
      ro.set(0, (J >= 0 ? "+" : "−") + S.fmt(Math.abs(J), 0) + " mV"); ro.set(1, String(nap)); ro.set(2, S.fmt(vmax, 1) + " mV");
      if (nE.value === 0 && nI.value === 0) nt.set("Aucune synapse active : rien ne perturbe le potentiel de repos.", "");
      else if (nap) nt.set("Le total atteint le seuil : " + nap + " potentiels d'action postsynaptiques en 200 ms.", "ok");
      else if (J <= 0) nt.set("Les inhibiteurs compensent ou dépassent les excitateurs : le neurone ne peut pas atteindre le seuil.", "warn");
      else nt.set("Pas de PA : le potentiel maximal (" + S.fmt(vmax, 1) + " mV) reste sous −55 mV. Augmente le nombre de synapses (sommation spatiale) ou la fréquence (sommation temporelle).", "warn");
    });
  }
});

/* ---------- arc réflexe ---------- */
var SIT = {
  rot: {nom: "Réflexe rotulien (genou)", ref: true, d1: 0.5, d2: 0.5, ns: 1, ti: 0},
  main: {nom: "Retrait de la main (brûlure)", ref: true, d1: 0.7, d2: 0.7, ns: 2, ti: 0},
  pied: {nom: "Retrait du pied (clou)", ref: true, d1: 0.9, d2: 0.9, ns: 2, ti: 0},
  vol: {nom: "Action volontaire (lever la main au signal)", ref: false, d1: 0.7, d2: 0.7, ns: 5, ti: 100}
};
function tot(s, v){                  /* ms */
  var dist = 2 * s.d1 + (s.ref ? 0 : 1.0);        /* volontaire : 2 × 0,5 m en plus entre moelle et encéphale */
  return {dist: dist, cond: dist / v * 1000, syn: s.ns, integ: s.ti, total: dist / v * 1000 + s.ns * 1 + s.ti};
}
SFA.sim({
  id: "b5-c02-arc", ch: "c02", tag: "Animation",
  titre: "Arc réflexe contre acte volontaire",
  resume: "Trajet, synapses et intégration → durée totale de la réponse.",
  but: "Choisis une situation et la vitesse de conduction, puis lance l'influx (ralenti ×20). Compare le temps total d'un réflexe et celui d'une action volontaire. Que se passe-t-il si les nerfs sont plus lents ?",
  aRetenir: "Le réflexe est une réponse involontaire, rapide et stéréotypée : le centre nerveux est la moelle épinière (ou le tronc cérébral), pas l'encéphale. Le trajet est court, il y a 1 à 2 synapses ; l'information monte ensuite vers l'encéphale seulement pour information. Un acte volontaire passe par le cortex : trajet plus long, plus de synapses, plus d'intégration.",
  piege: "« Le réflexe passe par le cerveau » est faux. Autre erreur : croire que le message dépend d'un seul neurone : l'arc compte au moins un neurone sensitif et un neurone moteur. Valeurs : ordres de grandeur d'un modèle simplifié (chaque synapse ajoute 1 ms).",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var sit = k.select("Situation", [["rot", SIT.rot.nom], ["main", SIT.main.nom], ["pied", SIT.pied.nom], ["vol", SIT.vol.nom]], "main");
    var v = k.slider("Vitesse de conduction des nerfs", 20, 100, 5, 60, "m/s");
    var ro = k.readouts(["Trajet", "Conduction", "Synapses + intégration", "Durée totale"]);
    var nt = k.note("", "");
    var tt = 0, SL = 20;
    var lp = k.loop(function(dt){ tt += dt; var s = SIT[sit.value]; if (tt > (tot(s, v.value).total / 1000) * SL + 0.4){ lp.pause(); } k.redraw(); });
    k.button("Envoyer l'influx (ralenti ×20)", function(){ tt = 0; lp.play(); }, true);
    k.draw(function(){
      c.clear();
      var s = SIT[sit.value], T = tot(s, v.value), W = c.W, H = c.H, ctx = c.ctx;
      var R = {x: W * 0.84, y: H * 0.78}, M = {x: W * 0.5, y: H * 0.52}, E = {x: W * 0.16, y: H * 0.78}, Br = {x: W * 0.5, y: H * 0.14};
      ctx.fillStyle = "#f1ecfb"; ctx.fillRect(M.x - 12, Br.y + 18, 24, M.y - Br.y + 44);
      S.draw.text(c, "moelle épinière", M.x + 18, M.y + 40, {align: "left", size: 12, color: pal.grey});
      B5.circ(c, Br.x, Br.y, 26, "#f1ecfb", pal.violet); S.draw.text(c, "encéphale", Br.x, Br.y, {size: 12});
      B5.circ(c, R.x, R.y, 12, "#fde3d6", pal.red); S.draw.text(c, "récepteur", R.x, R.y + 26, {size: 12});
      B5.circ(c, E.x, E.y, 12, "#dfeee7", pal.green); S.draw.text(c, "muscle", E.x, E.y + 26, {size: 12});
      B5.circ(c, M.x, M.y, 8, pal.violet);
      var path = s.ref ? [R, M, E] : [R, M, Br, M, E];
      var cols = [pal.red, pal.violet, pal.violet, pal.green];
      for (var i = 0; i < path.length - 1; i++) S.draw.line(c, path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, s.ref ? (i ? pal.green : pal.red) : (i < 2 ? pal.red : pal.green), 2.5, i && !s.ref && (i === 1 || i === 2) ? [6, 4] : null);
      /* position du signal : progression au prorata des durées (conduction + délais aux relais) */
      var treal = tt / SL * 1000, segLen = [], total = 0, j;
      for (j = 0; j < path.length - 1; j++){ var dl = Math.hypot(path[j + 1].x - path[j].x, path[j + 1].y - path[j].y); segLen.push(dl); total += dl; }
      var tcond = T.cond, tdelay = T.syn + T.integ, tTotal = T.total;
      if (tt > 0 && treal <= tTotal + 1){
        var frac;
        var cp = tcond / (tcond + tdelay);
        var u = treal / tTotal;
        /* le délai est consommé à la moelle (réflexe) ou à l'encéphale (volontaire) : le point y attend */
        var pause0 = s.ref ? 0.5 : 0.5, wait = tdelay / tTotal;
        var moving = Math.max(0, treal - 0) ;
        var cum = 0, tpos = Math.min(treal, tTotal);
        var mt = tpos <= (tTotal - tdelay) * pause0 ? tpos : (tpos <= (tTotal - tdelay) * pause0 + tdelay ? (tTotal - tdelay) * pause0 : tpos - tdelay);
        frac = (tTotal - tdelay) > 0 ? mt / (tTotal - tdelay) : 0;
        var target = frac * total, px = path[0].x, py = path[0].y; cum = 0;
        for (j = 0; j < segLen.length; j++){ if (target <= cum + segLen[j] + 1e-9){ var q = (target - cum) / segLen[j]; px = path[j].x + q * (path[j + 1].x - path[j].x); py = path[j].y + q * (path[j + 1].y - path[j].y); break; } cum += segLen[j]; px = path[j + 1].x; py = path[j + 1].y; }
        B5.circ(c, px, py, 9, "rgba(180,35,24,.9)");
      }
      S.draw.text(c, "Temps écoulé (réel) : " + S.fmt(Math.min(tt / SL * 1000, tTotal), 0) + " ms", 10, H - 12, {align: "left", size: 12, color: pal.ink});
      S.draw.text(c, s.ref ? "centre nerveux : moelle épinière" : "centre nerveux : cortex cérébral", W - 10, 14, {align: "right", size: 12, color: pal.violet});
      var vol = tot(SIT.vol, v.value);
      var Tv = tot({ref: false, d1: s.d1, d2: s.d2, ns: 5, ti: 100}, v.value);
      ro.set(0, S.fmt(T.dist, 1) + " m"); ro.set(1, S.fmt(T.cond, 0) + " ms"); ro.set(2, S.fmt(T.syn + T.integ, 0) + " ms"); ro.set(3, S.fmt(T.total, 0) + " ms");
      nt.set(s.ref ? "Pour la même zone du corps, une action volontaire durerait " + S.fmt(Tv.total, 0) + " ms : environ " + S.fmt(Tv.total / T.total, 1) + " fois plus. Le réflexe protège (retrait avant même de sentir la douleur)." : "Ici l'intégration corticale (≈ 100 ms) représente " + S.fmt(100 * s.ti / T.total, 0) + " % de la durée totale : le cortex, plus que les nerfs, fait la lenteur d'un acte volontaire.", "ok");
    });
  }
});

/* ---------- drogues ---------- */
SFA.sim({
  id: "b5-c02-drogues", ch: "c02", tag: "Substances",
  titre: "Que font les drogues à la synapse ?",
  resume: "Cocaïne, curare, nicotine : dose → neurotransmetteur, récepteurs occupés, réponse.",
  but: "Regarde la synapse en fonctionnement : le neurone libère son neurotransmetteur, qui est recapturé puis éliminé. Choisis une substance et une dose, puis observe qui reste dans la fente, quels récepteurs s'allument et la réponse totale par rapport à la situation normale (pointillés).",
  aRetenir: "Une substance peut agir à plusieurs niveaux : en bloquant l'élimination du neurotransmetteur (cocaïne : la dopamine reste plus longtemps), en bloquant les récepteurs (curare : le message n'est plus reçu, d'où la paralysie), ou en imitant le neurotransmetteur (nicotine : elle active les récepteurs de l'acétylcholine).",
  piege: "Toutes les drogues n'augmentent pas l'activité : le curare la diminue. Et « stimulant » ne veut pas dire « sans risque ». Modèle de principe : les unités sont arbitraires, aucune donnée de dosage réel.",
  build: function(k, S){
    var c = k.canvas(470), pal = S.draw.palette, D = S.draw;
    var dr = k.select("Substance", [["a", "Aucune (témoin)"], ["c", "Cocaïne (bloque la recapture)"], ["u", "Curare (bloque les récepteurs)"], ["n", "Nicotine (agoniste des récepteurs)"]], "c");
    var dose = k.slider("Dose", 0, 100, 5, 60, "%");
    var ro = k.readouts(["Durée du neurotransmetteur", "Récepteurs actifs (pic)", "Réponse totale (témoin = 100 %)"]);
    var nt = k.note("", "");
    var Kd = 0.5, T = 12, NP = 16, MS = 0.5;       /* MS : secondes réelles par ms du modèle */
    function curves(drug, d){
      var kk = 1, blk = 0, ag = 0; d = d / 100;
      if (drug === "c") kk = 1 - 0.8 * d; if (drug === "u") blk = d; if (drug === "n") ag = 0.6 * d;
      var nts = [], occ = [], A = 0;
      for (var t = 0; t <= T + 1e-9; t += 0.1){
        var N = Math.exp(-kk * t), o = N / (N + Kd);
        o = 1 - (1 - o * (1 - blk)) * (1 - ag * (1 - blk));
        nts.push([t, N]); occ.push([t, o]); A += o * 0.1;
      }
      return {nts: nts, occ: occ, area: A, kk: kk, blk: blk, ag: ag};
    }
    var base = curves("a", 0);
    var rnd = B5.rng(7), P = [];
    for (var i = 0; i < NP; i++) P.push({u: rnd(), tx: rnd(), ty: rnd(), ph: rnd() * 6.28, fq: 2 + rnd() * 3, sx: rnd() * 2 - 1});
    var tm = 0, GAP = 1.6;
    var lp = k.loop(function(dt){ tm += dt; if (tm > T * MS + GAP) tm = 0; k.redraw(); });
    lp.play();
    k.button("Rejouer la libération", function(){ tm = 0; }, true);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cu = curves(dr.value, dose.value);
      var tms = Math.min(T, tm / MS);                       /* temps du modèle (ms) */
      /* ---------- scène ---------- */
      var sh = 262, yT = 56, yM = 190;                       /* bas du neurone pré, haut de la membrane post */
      var bg = ctx.createLinearGradient(0, 0, 0, sh); bg.addColorStop(0, "#f4f0fc"); bg.addColorStop(1, "#fdf3f1");
      D.rrect(c, 8, 8, W - 16, sh, 12); ctx.fillStyle = bg; ctx.fill();
      ctx.save(); D.rrect(c, 8, 8, W - 16, sh, 12); ctx.clip();
      /* neurone présynaptique */
      ctx.fillStyle = "#d9ccf3"; ctx.beginPath(); ctx.moveTo(40, 8); ctx.lineTo(40, 36); ctx.quadraticCurveTo(40, yT, 70, yT); ctx.lineTo(W - 70, yT); ctx.quadraticCurveTo(W - 40, yT, W - 40, 36); ctx.lineTo(W - 40, 8); ctx.fill();
      ctx.strokeStyle = "#8d77cf"; ctx.lineWidth = 2.5; ctx.stroke();
      D.text(c, "neurone présynaptique", 56, 22, {align: "left", size: 11.5, color: "#5b45a0", weight: 800});
      /* vésicules */
      var rx0 = W / 2 - 36, vp = tms < 0.4 ? 1 : 0;
      for (var v = 0; v < 4; v++){ var vx = W / 2 - 54 + v * 36; B5.circ(c, vx, yT - 14, 9, tms < 0.4 || v > 1 ? "#f4c542" : "#f8e4a0", "#b8860b", 1.5); }
      /* transporteurs de recapture */
      var blocked = dr.value === "c" ? dose.value / 100 : 0, pumps = [W * 0.2, W * 0.8];
      pumps.forEach(function(px){
        D.rrect(c, px - 10, yT - 5, 20, 12, 3); ctx.fillStyle = blocked > 0.5 ? "#e8b4ac" : "#7a6aa8"; ctx.fill();
        if (blocked > 0.05){ B5.circ(c, px, yT + 14, 8, pal.red); D.text(c, "×", px, yT + 14, {size: 14, color: "#fff", weight: 900}); }
        else { D.arrow(c, px, yT + 22, px, yT + 2, "#7a6aa8", 1.5); }
      });
      D.text(c, "recapture", pumps[0], yT + 34, {size: 10.5, color: "#5b45a0", weight: 700});
      /* membrane postsynaptique + récepteurs */
      var gm = ctx.createLinearGradient(0, yM, 0, sh + 8); gm.addColorStop(0, "#f2b8ad"); gm.addColorStop(1, "#e89a8c"); ctx.fillStyle = gm; ctx.fillRect(8, yM + 14, W - 16, sh);
      D.text(c, "cellule postsynaptique (neurone ou muscle)", 20, yM + 33, {align: "left", size: 11.5, color: "#8a2a1a", weight: 800});
      var NR = 6, rcx = [], o = Math.max(0, tms < 0 ? 0 : B5.interp(cu.occ, tms));
      var nact = Math.round(o * NR), nblk = Math.round(cu.blk * NR), nag = Math.round(cu.ag * NR);
      for (var r = 0; r < NR; r++){
        var rx = W / 2 + (r - (NR - 1) / 2) * Math.min(52, (W - 140) / NR), act = r < nact;
        rcx.push(rx);
        ctx.fillStyle = act ? pal.green : "#b86a5c"; ctx.beginPath(); ctx.moveTo(rx - 15, yM + 16); ctx.lineTo(rx - 15, yM + 2); ctx.quadraticCurveTo(rx, yM + 22, rx + 15, yM + 2); ctx.lineTo(rx + 15, yM + 16); ctx.closePath(); ctx.fill();
        if (act){ D.glow(c, rx, yM + 8, 28, pal.green, .6); }
        if (dr.value === "u" && r >= NR - nblk){ B5.circ(c, rx, yM - 1, 9, "#4b3a2a"); D.text(c, "C", rx, yM - 1, {size: 10, color: "#fff", weight: 800}); }
        if (dr.value === "n" && r < nag && !(r < 0)){ B5.circ(c, rx, yM - 1, 8, "#f08a1c", "#fff", 1.5); }
      }
      /* neurotransmetteur : durée de vie exponentielle (taux kk) */
      for (var i = 0; i < NP; i++){
        var p = P[i], td = -Math.log(1 - p.u * 0.98) / cu.kk * 0.9, tr = i * 0.03;
        var a = tms - tr; if (a < 0) continue;
        if (a > td + 0.5) continue;
        var e = Math.min(1, a / 1.2), x = W / 2 + (p.tx - 0.5) * (W - 160) * e + Math.sin(p.fq * a + p.ph) * 7, y = yT + 8 + (p.ty * (yM - yT - 24)) * e + Math.cos(p.fq * a * 1.3 + p.ph) * 5;
        var out = Math.max(0, Math.min(1, (a - td) / 0.5));
        if (a > td){ var pxx = p.sx < 0 ? pumps[0] : pumps[1]; x = x + (pxx - x) * out; y = y + (yT + 6 - y) * out; }
        ctx.globalAlpha = 1 - out * 0.8; B5.circ(c, x, y, 5, "#f4a413", "#a56300", 1.2); ctx.globalAlpha = 1;
      }
      ctx.restore();
      /* légende */
      var items = [["#f4a413", "neurotransmetteur"]].concat(dr.value === "u" ? [["#4b3a2a", "curare"]] : dr.value === "n" ? [["#f08a1c", "nicotine"]] : [[pal.green, "récepteur actif"]]), lx = 20;
      items.forEach(function(it){ B5.circ(c, lx + 5, yM + 52, 5, it[0], "#fff", 1); D.text(c, it[1], lx + 14, yM + 52, {align: "left", size: 11, color: "#6b1f12", weight: 700}); lx += 30 + it[1].length * 6.2; });
      /* ---------- courbes ---------- */
      var gy = sh + 22;
      D.panel(c, 8, gy - 4, W - 16, H - gy - 4, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: T, y0: 0, y1: 1.05, xl: "t (ms)", stepX: 2, stepY: 0.5, t: gy + 8, b: 34, l: 42, r: 20});
      B5.poly(c, ax, base.nts, "#d5b27a", 1.6, [5, 4]); B5.poly(c, ax, cu.nts, pal.amber, 2.8);
      B5.poly(c, ax, base.occ, "#b9b0d6", 1.6, [5, 4]); B5.poly(c, ax, cu.occ, pal.violet, 3);
      D.line(c, ax.X(tms), ax.T, ax.X(tms), ax.B, pal.ink, 1.2, [3, 3]);
      D.legend(c, [[pal.amber, "neurotransmetteur"], [pal.violet, "récepteurs actifs"], [pal.grey, "témoin (pointillés)", true]], ax.R - 4, ax.T + 4, {align: "right"});
      var half = Math.LN2 / cu.kk, peak = Math.max.apply(null, cu.occ.map(function(p){ return p[1]; })), rel = cu.area / base.area * 100;
      ro.set(0, "demi-vie " + S.fmt(half, 1) + " ms"); ro.set(1, S.fmt(peak * 100, 0) + " %"); ro.set(2, S.fmt(rel, 0) + " %");
      var msg = {a: "Situation normale : le neurotransmetteur est éliminé en quelques ms, la réponse est brève.",
        c: "La recapture est freinée : le neurotransmetteur reste dans la fente, les récepteurs sont stimulés plus longtemps (réponse × " + S.fmt(rel / 100, 1) + ").",
        u: "Les récepteurs sont occupés par le curare : même avec autant de neurotransmetteur, la réponse tombe à " + S.fmt(rel, 0) + " % (paralysie musculaire si la dose augmente).",
        n: "La nicotine active les récepteurs même quand il n'y a plus de neurotransmetteur : activation persistante (réponse × " + S.fmt(rel / 100, 1) + ")."};
      nt.set(msg[dr.value], dr.value === "u" ? "warn" : "ok");
    });
  }
});

/* ---------- temps de réaction ---------- */
SFA.sim({
  id: "b5-c02-regle", ch: "c02", tag: "Défi",
  titre: "Test de la règle qui tombe : ton temps de réaction",
  resume: "Distance de chute de la règle → temps de réaction de la chaîne nerveuse.",
  but: "Mode « Jouer » : clique sur « Lâcher », puis sur « Attraper ! » (ou touche la scène) dès que la règle bouge ; répète plusieurs fois. Mode « Calculer » : choisis la distance de chute et obtiens le temps (d = ½·g·t²). Ton temps est-il dans la fourchette habituelle (0,15 à 0,25 s) ?",
  aRetenir: "La règle tombe d'une hauteur d = ½·g·t², donc t = √(2d/g). Le temps de réaction comprend : détection par la rétine, trajet vers le cortex visuel, décision, trajet vers les muscles de la main, contraction. C'est une action volontaire : bien plus longue qu'un réflexe (≈ 20–30 ms).",
  piege: "Plus la règle tombe de haut, plus la réaction est lente, mais pas proportionnellement : d croît comme t² (une réaction deux fois plus lente fait chuter la règle quatre fois plus loin).",
  build: function(k, S){
    var c = k.canvas(440), pal = S.draw.palette, D = S.draw, g = 9.81;
    var mode = k.seg("Mode", [["j", "Jouer"], ["c", "Calculer"]], "j");
    var dd = k.slider("Distance de chute (mode Calculer)", 1, 40, 1, 20, "cm");
    var ro = k.readouts(["Distance", "Temps de réaction", "Moyenne"]);
    var nt = k.note("Mode « Jouer » : lâche la règle, puis attrape-la dès qu'elle bouge.", "");
    var st = "idle", wait = 0, tfall = 0, res = [], dist = 0, dcalc = null;
    var lp = k.loop(function(dt){
      if (st === "wait"){ wait -= dt; if (wait <= 0){ st = "fall"; tfall = 0; } }
      else if (st === "fall"){ tfall += dt; var d = 0.5 * g * tfall * tfall * 100; if (d >= 42){ dist = 40; st = "miss"; lp.pause(); nt.set("Raté : la règle est tombée complètement. Anticipe moins, réagis plus vite.", "warn"); } }
      k.redraw();
    });
    function lacher(){ if (st === "wait" || st === "fall") return; st = "wait"; wait = 1 + Math.random() * 2; nt.set("Attention… la règle va tomber.", ""); lp.play(); }
    function attraper(){
      if (st === "fall"){ dist = 0.5 * g * tfall * tfall * 100; res.push(tfall); if (res.length > 8) res.shift(); st = "done"; lp.pause(); nt.set("Attrapée à " + S.fmt(dist, 1) + " cm : " + S.fmt(tfall * 1000, 0) + " ms. " + (tfall >= .15 && tfall <= .25 ? "Dans la fourchette habituelle." : (tfall < .15 ? "Très rapide (ou tu as anticipé) !" : "Un peu lent : recommence concentré.")), "ok"); }
      else if (st === "wait"){ st = "idle"; lp.pause(); nt.set("Trop tôt : tu as cliqué avant la chute.", "warn"); }
    }
    k.button("Lâcher la règle", lacher, true);
    k.button("Attraper !", attraper);
    k.button("Effacer les essais", function(){ res = []; st = "idle"; lp.pause(); });
    c.cv.style.touchAction = "none";
    c.pointer(function(t){ if (t === "down" && mode.value === "j"){ if (st === "idle" || st === "done" || st === "miss") lacher(); else attraper(); } });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, calc = mode.value === "c";
      var sw = Math.min(150, Math.max(118, W * 0.34));
      /* scène de gauche */
      D.panel(c, 8, 8, sw, H - 16, {shadow: false, fill: "#f6f8fc"});
      var cx = 8 + sw * 0.62, yf = H - 100, sc = (yf - 26) / 40;
      var fall = calc ? dd.value : (st === "fall" ? 0.5 * g * tfall * tfall * 100 : (st === "done" || st === "miss" ? dist : 0));
      var yb = yf + fall * sc;                         /* bas de la règle (repère 0) */
      var rw = 30, rx = cx - rw / 2;
      var gr = ctx.createLinearGradient(rx, 0, rx + rw, 0); gr.addColorStop(0, "#fbe7a0"); gr.addColorStop(1, "#e8b93d");
      ctx.save(); ctx.beginPath(); ctx.rect(8, 10, sw, H - 20); ctx.clip();
      D.rrect(c, rx, yb - 40 * sc, rw, 40 * sc + 4, 4); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = "#b8860b"; ctx.lineWidth = 1.5; ctx.stroke();
      for (var m = 0; m <= 40; m += 1){
        var yy = yb - m * sc, big = m % 10 === 0, mid = m % 5 === 0;
        D.line(c, rx, yy, rx + (big ? 14 : mid ? 10 : 5), yy, "#8a6508", big ? 1.5 : 1);
        if (big && m > 0) D.text(c, m, rx + 20, yy, {size: 10.5, color: "#6b4f05", weight: 800, align: "left"});
      }
      ctx.restore();
      /* main : pouce et index */
      ctx.fillStyle = "#f0c7a4"; ctx.strokeStyle = "#c28b63"; ctx.lineWidth = 1.5;
      D.rrect(c, rx - 30, yf - 26, 36, 22, 11); ctx.fill(); ctx.stroke();
      D.rrect(c, rx - 30, yf + 6, 36, 22, 11); ctx.fill(); ctx.stroke();
      D.rrect(c, rx - 62, yf - 10, 44, 30, 12); ctx.fill(); ctx.stroke();
      D.line(c, rx - 4, yf, rx + rw + 6, yf, pal.violet, 2, [4, 3]);
      D.text(c, "main", rx - 40, yf + 36, {size: 11, color: "#9a6a43", weight: 800});
      D.label(c, "repère 0", cx + 12, yf + 22, {color: pal.violet, size: 10.5});
      var stTxt = st === "wait" ? "Attends…" : st === "fall" ? "ATTRAPE !" : calc ? "" : st === "idle" ? "Touche la scène" : "";
      if (stTxt) D.text(c, stTxt, 8 + sw / 2, H - 26, {size: 14, color: st === "fall" ? pal.red : pal.grey, weight: 900});
      if (st === "fall") D.glow(c, 8 + sw / 2, H - 26, 50, pal.red, .35);
      /* valeurs */
      var dshow, tshow;
      if (calc){ dshow = dd.value; tshow = Math.sqrt(2 * dshow / 100 / g); }
      else if (st === "fall"){ dshow = fall; tshow = tfall; }
      else if (st === "done"){ dshow = dist; tshow = res[res.length - 1]; }
      else if (st === "miss"){ dshow = 40; tshow = Math.sqrt(2 * 0.4 / g); }
      else dshow = null;
      /* graphe de droite */
      var gx = sw + 16, gw = W - gx - 8;
      D.panel(c, gx, 8, gw, H - 16, {shadow: false, fill: "#fbfcfe"});
      var ax = D.axes(c, {x0: 0, x1: 40, y0: 0, y1: 0.3, xl: "d (cm)", yl: "t (s)", stepX: 10, stepY: 0.05, l: gx + 44, r: 20, t: 30, b: 38});
      ctx.fillStyle = "rgba(36,119,90,.14)"; ctx.fillRect(ax.X(0), ax.Y(0.25), ax.X(40) - ax.X(0), ax.Y(0.15) - ax.Y(0.25));
      D.text(c, "zone habituelle", ax.L + 6, ax.Y(0.2), {align: "left", size: 11, color: pal.green});
      var pts = []; for (var d = 0; d <= 40; d += 0.5) pts.push([d, Math.sqrt(2 * d / 100 / g)]);
      B5.poly(c, ax, pts, pal.violet, 3);
      res.forEach(function(t, i){ D.dot(c, ax.X(0.5 * g * t * t * 100), ax.Y(t), 5, "rgba(192,50,29,.45)"); });
      if (dshow !== null){ D.line(c, ax.X(dshow), ax.B, ax.X(dshow), ax.Y(tshow), pal.red, 1, [3, 3]); D.line(c, ax.L, ax.Y(tshow), ax.X(dshow), ax.Y(tshow), pal.red, 1, [3, 3]); D.glow(c, ax.X(Math.min(dshow, 40)), ax.Y(tshow), 18, pal.red, .5); D.dot(c, ax.X(Math.min(dshow, 40)), ax.Y(tshow), 7, pal.red); D.label(c, S.fmt(tshow * 1000, 0) + " ms", ax.X(Math.min(dshow, 40)) - 10, ax.Y(tshow) - 16, {color: pal.red, align: "right", size: 12}); }
      var mean = res.length ? res.reduce(function(a, b){ return a + b; }, 0) / res.length : null;
      ro.set(0, dshow === null ? "—" : S.fmt(dshow, 1) + " cm"); ro.set(1, dshow === null ? "—" : S.fmt(tshow * 1000, 0) + " ms");
      ro.set(2, mean === null ? "—" : S.fmt(mean * 1000, 0) + " ms (" + res.length + " essais)");
    });
  }
});
})();

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b5-3d-synapse*/
SFA.sim({
  id:"b5-3d-synapse", ch:"c02", tag:"3D · synapse chimique",
  titre:"La synapse en 3D : du potentiel d'action au potentiel postsynaptique",
  resume:"Un potentiel d'action arrive : calcium, vésicules, neurotransmetteurs, récepteurs, ions Na⁺. Teste cocaïne, curare et toxine botulique.",
  but:"Envoie un potentiel d'action et suis chaque étape en 3D (glisse pour tourner), puis lis la réponse du neurone suivant sur le graphe. Choisis une substance pour voir quelle étape elle bloque.",
  aRetenir:"À la synapse chimique, le potentiel d'action ouvre des canaux Ca²⁺ ; le calcium fait fusionner les vésicules avec la membrane présynaptique (exocytose) ; le neurotransmetteur diffuse dans la fente et se fixe sur des récepteurs de la membrane postsynaptique ; les canaux s'ouvrent (entrée de Na⁺) et un potentiel postsynaptique naît. Le neurotransmetteur est ensuite détruit ou recapté. La transmission est unidirectionnelle : seule la membrane présynaptique libère le neurotransmetteur.",
  piege:"Le potentiel d'action ne « traverse » pas la fente : il est converti en signal chimique, puis reconverti en signal électrique. Un seul potentiel postsynaptique ne suffit pas toujours à atteindre le seuil (−55 mV) : les effets s'additionnent (sommation). Un neurotransmetteur n'est pas bon ou mauvais en soi : l'effet dépend du récepteur.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(330), g = k.canvas(170), cam = B.cam(0.4, 0.12, 8);
    var drug = k.select("Substance", [["none","Aucune (synapse normale)"],["coc","Cocaïne : bloque la recapture"],["cur","Curare : bloque les récepteurs"],["bot","Toxine botulique : bloque l'exocytose"]], "none", function(){ mark(); });
    var fr = k.slider("PA automatiques", 0, 4, 0.5, 0.5, "Hz");
    var spd = k.slider("Vitesse du film", 0.2, 1, 0.1, 0.5, "×");
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    k.button("Envoyer un potentiel d'action", function(){ fire(); }, true);
    var ro = k.readouts(["Neurotransmetteur dans la fente", "Récepteurs ouverts", "Potentiel postsynaptique", "PA du neurone suivant"]);
    var nt = k.note("", "");
    cam.auto = false;
    var T = 0, auto = 0, Vm = -70, hist = [], aps = [], nSp = 0, refr = 0, ca = [], caT = 0, NT = [], na = [], stage = 0, stageT = 0, lastMsg = "";
    var VES = [[-1.1, -0.4], [-0.55, 0.45], [0, -0.35], [0.5, 0.4], [1.0, -0.4], [-0.3, 0.05], [0.8, 0.05]].map(function(p){ return {x:p[0], z:p[1], y:0.85, st:"ready", t:0}; });
    var REC = [[-1.1, 0.2], [-0.5, -0.4], [0.1, 0.35], [0.6, -0.2], [1.1, 0.3], [-0.2, -0.05]].map(function(p){ return {x:p[0], z:p[1], open:0}; });
    var CAC = [[-0.8, 0.0], [0.3, -0.5], [0.9, 0.4]], TR = [[-0.4, 0.5], [0.5, 0.0]];
    function rnd(){ return Math.random() * 2 - 1; }
    function mark(){}
    function fire(){ aps.push(T); ca = []; CAC.forEach(function(p){ for (var i = 0; i < 3; i++) ca.push({x:p[0] + rnd() * 0.08, z:p[1] + rnd() * 0.08, y:0.2 + i * 0.12, vy:1 + Math.random()}); }); caT = 0.45; stage = 1; stageT = T; }
    function step(dt0){
      var dt = dt0 * spd.value; T += dt;
      if (fr.value > 0){ auto += dt; if (auto >= 1 / fr.value){ auto = 0; fire(); } }
      if (caT > 0){ caT -= dt; ca.forEach(function(q){ q.y += q.vy * dt * 0.8; if (q.y > 1.3) q.y = 1.3; });
        if (caT <= 0){ ca = []; if (drug.value !== "bot"){ var ready = VES.filter(function(v){ return v.st === "ready"; }), n = 0; ready.forEach(function(v){ if (n < 3 && Math.random() < 0.85){ v.st = "fusing"; v.t = 0; n++; } }); stage = 2; stageT = T; } } }
      VES.forEach(function(v){
        if (v.st === "fusing"){ v.t += dt; v.y = 0.85 - Math.min(1, v.t / 0.35) * 0.48; if (v.t >= 0.35){ v.st = "empty"; v.t = 0; for (var i = 0; i < 6; i++) NT.push({x:v.x + rnd() * 0.1, y:0.28, z:v.z + rnd() * 0.1, vx:rnd(), vy:-0.5 - Math.random(), vz:rnd(), bound:-1, t:0}); stage = 3; stageT = T; } }
        else if (v.st === "empty"){ v.t += dt; if (v.t > 2.2){ v.st = "ready"; v.y = 0.85; } }
      });
      /* neurotransmetteur */
      var uptake = drug.value === "coc" ? 0.3 : 5;
      NT.forEach(function(p){
        if (p.bound >= 0){ p.t += dt; var r = REC[p.bound]; if (p.t > 0.55){ r.open = 0; p.bound = -1; if (Math.random() < 0.5) p.dead = true; else { p.y = -0.2; p.vy = 0.6; } } return; }
        p.vx = 0.9 * p.vx + 0.5 * rnd(); p.vz = 0.9 * p.vz + 0.5 * rnd(); p.vy = 0.9 * p.vy + 0.5 * rnd();
        p.x += p.vx * dt * 0.8; p.y += p.vy * dt * 0.8; p.z += p.vz * dt * 0.8;
        if (Math.abs(p.x) > 1.55){ p.x = Math.sign(p.x) * 1.55; p.vx *= -1; } if (Math.abs(p.z) > 0.95){ p.z = Math.sign(p.z) * 0.95; p.vz *= -1; }
        if (p.y > 0.28){ p.y = 0.28; p.vy = -Math.abs(p.vy);
          TR.forEach(function(q){ if (Math.hypot(p.x - q[0], p.z - q[1]) < 0.28 && Math.random() < uptake * dt * 3) p.dead = true; }); }
        if (p.y < -0.26){ p.y = -0.26; p.vy = Math.abs(p.vy);
          REC.forEach(function(r, i){ if (!p.dead && p.bound < 0 && !r.open && drug.value !== "cur" && Math.hypot(p.x - r.x, p.z - r.z) < 0.3){ r.open = 1; p.bound = i; p.t = 0; p.x = r.x; p.z = r.z; p.y = -0.24; if (stage < 4){ stage = 4; stageT = T; } } }); }
        if (Math.random() < 0.35 * dt) p.dead = true;
      });
      NT = NT.filter(function(p){ return !p.dead; });
      var nOpen = REC.filter(function(r){ return r.open; }).length;
      /* ions Na+ */
      REC.forEach(function(r){ if (r.open && Math.random() < 6 * dt) na.push({x:r.x + rnd() * 0.05, y:-0.3, z:r.z + rnd() * 0.05, t:0}); });
      na.forEach(function(q){ q.t += dt; q.y -= dt * 0.9; }); na = na.filter(function(q){ return q.t < 0.8; });
      /* potentiel postsynaptique */
      var f = nOpen / REC.length, tgt = -70 + 38 * f;
      if (refr > 0){ refr -= dt; Vm += ((refr > 0.03 ? -80 : -70) - Vm) * Math.min(1, dt * 12); }
      else { Vm += (tgt - Vm) * Math.min(1, dt / 0.12); if (Vm > -55){ nSp++; refr = 0.12; Vm = 30; } }
      hist.push({t:T, v:Vm}); while (hist.length && hist[0].t < T - 8) hist.shift();
      if (T - stageT > 3.5 && stage > 0 && nOpen === 0 && NT.length === 0) stage = 0;
    }
    B.drag(c, cam, function(){ render(); });
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W / 5.3, c.H / 4.9), 4), YC = 0.3;
      function slab(y0, y1, col, al){ [[1, 0, 0], [-1, 0, 0]].forEach(function(n){}); sc.poly([[-1.7, y1, -1.1], [1.7, y1, -1.1], [1.7, y1, 1.1], [-1.7, y1, 1.1]], col, [0, 1, 0], al, "rgba(80,60,120,.4)"); sc.poly([[-1.7, y0, -1.1], [1.7, y0, -1.1], [1.7, y0, 1.1], [-1.7, y0, 1.1]], col, [0, -1, 0], al); sc.poly([[-1.7, y0, -1.1], [1.7, y0, -1.1], [1.7, y1, -1.1], [-1.7, y1, -1.1]], col, [0, 0, -1], al, "rgba(80,60,120,.4)"); }
      /* bouton présynaptique et dendrite (cubes translucides) */
      sc.poly([[-1.7, 0.3, -1.1], [1.7, 0.3, -1.1], [1.7, 1.9, -1.1], [-1.7, 1.9, -1.1]], B.hex("#ddd6fe"), [0, 0, -1], 0.22, "rgba(109,40,217,.35)");
      sc.poly([[-1.7, -0.3, -1.1], [1.7, -0.3, -1.1], [1.7, -1.5, -1.1], [-1.7, -1.5, -1.1]], B.hex("#fecdd3"), [0, 0, -1], 0.22, "rgba(190,18,60,.3)");
      slab(0.3, 0.37, B.hex("#a78bfa"), 0.9); slab(-0.37, -0.3, B.hex("#fb7185"), 0.9);
      sc.sphere([-1.2, 1.55, -0.3], 0.3, B.hex("#fcd34d"), 0.6, "#b45309");
      /* canaux Ca2+, transporteurs, récepteurs */
      CAC.forEach(function(p){ sc.tube([p[0], 0.26, p[1]], [p[0], 0.45, p[1]], 0.07, B.hex("#fb923c")); });
      TR.forEach(function(p){ sc.tube([p[0], 0.22, p[1]], [p[0], 0.46, p[1]], 0.08, drug.value === "coc" ? B.hex("#b91c1c") : B.hex("#a16207")); });
      REC.forEach(function(r){ var col = drug.value === "cur" ? B.hex("#b91c1c") : (r.open ? B.hex("#16a34a") : B.hex("#94a3b8")); sc.tube([r.x, -0.5, r.z], [r.x, -0.24, r.z], 0.1, col); if (r.open) sc.sphere([r.x, -0.3, r.z], 0.14, B.hex("#86efac"), 0.8); });
      /* vésicules */
      VES.forEach(function(v){ if (v.st === "empty") return; sc.sphere([v.x, v.y, v.z], 0.2, B.hex("#93c5fd"), 0.75, "#1d4ed8"); if (v.st !== "empty") for (var i = 0; i < 4; i++) sc.sphere([v.x + 0.07 * Math.cos(i * 1.6), v.y + 0.05 * Math.sin(i * 2.3), v.z + 0.07 * Math.sin(i * 1.6)], 0.045, B.hex("#0d9488")); });
      ca.forEach(function(q){ sc.sphere([q.x, q.y, q.z], 0.06, B.hex("#f97316")); });
      NT.forEach(function(p){ sc.sphere([p.x, p.y, p.z], 0.055, B.hex("#0d9488")); });
      na.forEach(function(q){ sc.sphere([q.x, q.y, q.z], 0.06, B.hex("#7c3aed")); });
      sc.label([-0.6, 2.05, -1.1], "neurone présynaptique", "#5b21b6", 10, 0, 0);
      sc.label([1.2, 0, -1.1], "fente synaptique", "#0f1b2d", 10, 0, 0);
      sc.label([0, -1.7, -1.1], "neurone postsynaptique", "#be123c", 10, 0, 0);
      sc.flush(); B.hint(c);
      var ctx = c.ctx; ctx.save(); ctx.font = "700 11px Mulish,system-ui,sans-serif"; ctx.textBaseline = "middle";
      [["neurotransmetteur", "#0d9488"], ["Ca²⁺", "#f97316"], ["Na⁺", "#7c3aed"]].forEach(function(q, n){ ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(c.W - 128, 16 + n * 16, 5, 0, 6.3); ctx.fill(); ctx.fillStyle = "#0f1b2d"; ctx.fillText(q[0], c.W - 118, 16 + n * 16); }); ctx.restore();
      /* graphe du potentiel postsynaptique */
      g.clear(); var W = g.W, H = g.H, L = 44, R = W - 8, g2 = g.ctx;
      function Yv(v){ return 14 + (30 - v) / 110 * (H - 34); }
      g2.font = "700 10px Mulish,system-ui,sans-serif"; g2.fillStyle = "#64748b"; g2.textAlign = "right";
      [[-70, "−70"], [-55, "−55"], [0, "0"], [30, "+30"]].forEach(function(q){ g2.fillText(q[1], L - 4, Yv(q[0]) + 3); g2.strokeStyle = q[0] === -55 ? "#dc2626" : "#e2e8f0"; g2.setLineDash(q[0] === -55 ? [5, 4] : []); g2.beginPath(); g2.moveTo(L, Yv(q[0])); g2.lineTo(R, Yv(q[0])); g2.stroke(); g2.setLineDash([]); });
      g2.fillStyle = "#dc2626"; g2.textAlign = "left"; g2.fillText("seuil", L + 4, Yv(-55) - 4);
      g2.fillStyle = "#64748b"; g2.fillText("mV", 6, 10); g2.textAlign = "right"; g2.fillText("8 dernières secondes", R, H - 4);
      aps.forEach(function(a){ if (a < T - 8) return; var x = R - (T - a) / 8 * (R - L); g2.fillStyle = "#7c3aed"; g2.beginPath(); g2.moveTo(x, 4); g2.lineTo(x - 4, -2); g2.lineTo(x + 4, -2); g2.fill(); g2.strokeStyle = "rgba(124,58,237,.3)"; g2.beginPath(); g2.moveTo(x, 2); g2.lineTo(x, H - 18); g2.stroke(); });
      g2.beginPath(); hist.forEach(function(h, i){ var x = R - (T - h.t) / 8 * (R - L), y = Yv(h.v); if (i) g2.lineTo(x, y); else g2.moveTo(x, y); }); g2.strokeStyle = "#be123c"; g2.lineWidth = 2; g2.stroke(); g2.lineWidth = 1;
      var nOpen = REC.filter(function(r){ return r.open; }).length;
      ro.set(0, NT.length); ro.set(1, nOpen + " / " + REC.length); ro.set(2, S.fmt(Vm, 0) + " mV"); ro.set(3, nSp);
      var ST = ["Au repos : clique sur « Envoyer un potentiel d'action » (ou règle une fréquence).", "1. Le potentiel d'action arrive : les canaux Ca²⁺ s'ouvrent, le calcium entre dans le bouton.", "2. Le calcium fait fusionner les vésicules avec la membrane (exocytose).", "3. Le neurotransmetteur est libéré dans la fente et diffuse.", "4. Il se fixe sur les récepteurs : les canaux s'ouvrent, Na⁺ entre dans le neurone postsynaptique."];
      var msg = ST[stage], kind = "";
      if (drug.value === "bot" && stage >= 1){ msg = "Toxine botulique : le calcium entre mais les vésicules ne fusionnent pas. Aucun neurotransmetteur libéré, aucun potentiel postsynaptique : paralysie."; kind = "bad"; }
      else if (drug.value === "cur" && stage >= 3){ msg = "Curare : le neurotransmetteur est libéré mais les récepteurs sont occupés par le curare : les canaux ne s'ouvrent pas, pas de contraction possible (paralysie)."; kind = "bad"; }
      else if (drug.value === "coc" && stage >= 3){ msg = "Cocaïne : le transporteur de recapture est bloqué, le neurotransmetteur reste longtemps dans la fente : réponse plus forte et plus longue, atteinte plus facile du seuil."; kind = "warn"; }
      nt.set(msg, kind);
    }
    k.draw(render);
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b5-3d-synapse*/
