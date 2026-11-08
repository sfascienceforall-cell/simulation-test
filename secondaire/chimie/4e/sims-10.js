/* Chimie 4e · chapitre 10 · Précipitation et oxydoréduction */
(function(){
/* règles de solubilité utilisées (cations en nitrates, anions en sels de sodium) : [statut, couleur, remarque] ; P précipité, S soluble, L peu soluble */
var CATS = [["Ag",1,"nitrate d'argent"],["Pb",2,"nitrate de plomb (II)"],["Ba",2,"nitrate de baryum"],["Ca",2,"nitrate de calcium"],["Cu",2,"nitrate de cuivre (II)"],["Zn",2,"nitrate de zinc"],["Mg",2,"nitrate de magnésium"],["Fe",3,"nitrate de fer (III)"]];
var ANS = [["Cl","chlorure de sodium","NaCl"],["SO4","sulfate de sodium","Na₂SO₄"],["CO3","carbonate de sodium","Na₂CO₃"],["OH","hydroxyde de sodium","NaOH"]];
var T = {
  Ag:{Cl:["P","#f4f4f4","blanc"],SO4:["L","#f4f4f4","blanc, peu soluble"],CO3:["P","#e8e2a8","jaune pâle"],OH:["P","#8b5a3c","brun (en réalité Ag₂O)"]},
  Pb:{Cl:["L","#f4f4f4","blanc, peu soluble (seulement avec des solutions assez concentrées ; se redissout à chaud)"],SO4:["P","#f4f4f4","blanc"],CO3:["P","#f4f4f4","blanc"],OH:["P","#f4f4f4","blanc (se redissout dans un excès de soude)"]},
  Ba:{Cl:["S"],SO4:["P","#f4f4f4","blanc"],CO3:["P","#f4f4f4","blanc"],OH:["S"]},
  Ca:{Cl:["S"],SO4:["L","#f4f4f4","blanc, peu soluble"],CO3:["P","#f4f4f4","blanc"],OH:["L","#f4f4f4","blanc, peu soluble"]},
  Cu:{Cl:["S"],SO4:["S"],CO3:["P","#5fb7a8","bleu-vert (carbonate basique)"],OH:["P","#6fa8dc","bleu pâle"]},
  Zn:{Cl:["S"],SO4:["S"],CO3:["P","#f4f4f4","blanc"],OH:["P","#f4f4f4","blanc (se redissout dans un excès de soude)"]},
  Mg:{Cl:["S"],SO4:["S"],CO3:["P","#f4f4f4","blanc"],OH:["P","#f4f4f4","blanc"]},
  Fe:{Cl:["S"],SO4:["S"],CO3:["X","#a0522d","Fe(OH)₃ brun + CO₂"],OH:["P","#a0522d","brun-rouille"]}
};
var CATCOL = {Ag:"#f4f4f4",Pb:"#f4f4f4",Ba:"#f4f4f4",Ca:"#f4f4f4",Cu:"#9ecbe8",Zn:"#f4f4f4",Mg:"#f4f4f4",Fe:"#f1c76a"};
function ionObj(s, q){ return C4.CAT.filter(function(i){ return i.s === s && i.q === q; })[0]; }
function anObj(s){ return C4.AN.filter(function(i){ return i.s === s; })[0]; }
SFA.sim({
  id:"c4-c10-melange", ch:"c10", tag:"Classique",
  titre:"Mélanger deux solutions : précipité ou pas ?",
  resume:"Un nitrate métallique + un sel de sodium : regarde les ions se rencontrer, et repère ceux qui s'associent en un solide.",
  but:"Choisis une solution de cation et une solution d'anion, puis clique sur « Verser » : les ions se mélangent, certains s'assemblent et tombent au fond. Repère les ions spectateurs qui ne bougent pas.",
  aRetenir:"Règles (table simplifiée, pour des solutions d'environ 0,1 mol/L) : les nitrates et les sels de sodium sont solubles. Les chlorures sont solubles sauf AgCl (et PbCl₂, seulement peu soluble) ; les sulfates sauf BaSO₄ et PbSO₄ (CaSO₄ et Ag₂SO₄ sont peu solubles : léger trouble) ; les carbonates et hydroxydes sont peu solubles sauf avec Na⁺ (et quelques autres). Équation nette : on garde seulement les ions qui forment le solide.",
  piege:"Un précipité n'est pas n'importe quel trouble : c'est un solide formé à partir d'ions dissous. Les ions spectateurs (Na⁺, NO₃⁻) restent en solution et ne figurent pas dans l'équation nette.",
  build:function(k, S){
    var c = k.canvas(350), P = S.draw.palette;
    var ca = k.select("Solution 1 (cations)", CATS.map(function(x, i){ return [i, x[2] + " (" + x[0] + ["", "⁺", "²⁺", "³⁺"][x[1]] + ")"]; }), 0);
    var an = k.select("Solution 2 (anions)", ANS.map(function(x, i){ return [i, x[1] + " (" + x[2] + ")"]; }), 0);
    var out = k.note("", "ok");
    var A = C4.anim(k, 5.5);
    A.p = 0;
    [ca.el, an.el].forEach(function(e){ e.addEventListener("change", function(){ A.stop(); A.p = 0; }); });
    k.button("▶ Verser", function(){ A.go(); }, true); k.button("↺ Séparer", function(){ A.stop(); A.p = 0; });
    var rd = C4.rnd(9), J = []; for (var i = 0; i < 80; i++) J.push([rd(), rd()]);
    var CC = {Ag:"#8e9aa8", Pb:"#6b7a8a", Ba:"#2f9e8f", Ca:"#7aa874", Cu:"#2f86c9", Zn:"#7d8fa3", Mg:"#5f8f3a", Fe:"#c26a0c"}, AC = {Cl:"#2e8b57", SO4:"#c8a600", CO3:"#8e5bb5", OH:"#c0321d"};
    k.draw(function(){
      var cc = CATS[+ca.value], aa = ANS[+an.value], info = T[cc[0]][aa[0]], status = info[0], cat = ionObj(cc[0], cc[1]), anion = anObj(aa[0]);
      var W = c.W, ctx = c.ctx, p = A.p, ph = C4.ph, s = C4.salt(cat, anion);
      C4.bg(c, 296);
      var bw = Math.min(110, W * .27), bh = 150, by = 100, xs = [W * .03, W * .365, W * .7];
      if (W - xs[2] - bw < 6) xs[2] = W - bw - 6;
      var rc = Math.min(11, bw / 8), rs = Math.max(4, rc * .55);
      var tpl = ph(p, .02, .5), bind = ph(p, .5, .95), lvl3 = .62 * tpl, lvl12 = .62 * (1 - tpl * .9);
      C4.beaker2(c, xs[0], by, bw, bh, lvl12, CATCOL[cc[0]] === "#f4f4f4" ? "#cfe2f0" : CATCOL[cc[0]], {alpha:.5});
      C4.beaker2(c, xs[1], by, bw, bh, lvl12, "#cfe2f0", {alpha:.5});
      C4.beaker2(c, xs[2], by, bw, bh, lvl3, CATCOL[cc[0]] === "#f4f4f4" ? "#cfe2f0" : CATCOL[cc[0]], {alpha:.45});
      S.draw.text(c, "+", (xs[0] + bw + xs[1]) / 2, by + bh * .5, {size:24, color:P.grey}); S.draw.text(c, "→", (xs[1] + bw + xs[2]) / 2, by + bh * .5, {size:24, color:P.grey});
      /* ions */
      var mult = s.x + s.y > 2 ? 2 : 3, Nc = mult * s.x, Na_ = mult * s.y, U = status === "S" ? 0 : status === "L" ? 1 : mult, items = [];
      for (var i = 0; i < Nc; i++) items.push({t:"c", b:0, i:i});
      for (i = 0; i < Nc * cc[1]; i++) items.push({t:"n", b:0, i:i});
      for (i = 0; i < Na_; i++) items.push({t:"a", b:1, i:i});
      for (i = 0; i < Na_ * anion.q; i++) items.push({t:"s", b:1, i:i});
      var boundC = U * s.x, boundA = U * s.y, nb = boundC + boundA, row = 0, bcx = xs[2] + bw / 2, cnt = {c:0, a:0};
      items.forEach(function(it, idx){
        var r = it.t === "c" || it.t === "a" ? rc : rs, ex = it.b === 0 ? xs[0] : xs[1];
        var j = J[(idx * 2) % 80], j2 = J[(idx * 2 + 1) % 80];
        var sx = ex + 10 + j[0] * (bw - 20), sy = by + bh * .42 + j[1] * (bh * .5 - 10);
        var mx = xs[2] + 10 + j2[0] * (bw - 20), my = by + bh * .38 + j2[1] * (bh * .52 - 12);
        var x = C4.lerp(sx, mx, tpl), y = C4.lerp(sy, my, tpl);
        /* ions qui forment le solide */
        var bound = false, k2 = -1;
        if (it.t === "c" && it.i < boundC){ bound = true; k2 = it.i; } if (it.t === "a" && it.i < boundA){ bound = true; k2 = boundC + it.i; }
        if (bound && bind > 0){
          var per = Math.max(3, Math.floor((bw - 14) / (rc * 1.8))), rr = Math.floor(k2 / per), cc2 = k2 % per, nr = Math.min(per, nb - rr * per);
          var gx = bcx + (cc2 - (nr - 1) / 2) * rc * 1.8, gy = by + bh - rc - 3 - rr * rc * 1.7;
          x = C4.lerp(mx, gx, bind); y = C4.lerp(my, gy, bind);
        } else if (p > .6){ x += Math.sin(Date.now() / 400 + idx) * 1.6 * tpl; y += Math.cos(Date.now() / 450 + idx * 2) * 1.6 * tpl; }
        var col, lab = "";
        if (it.t === "c"){ col = bound && bind > .9 ? S.draw.palette.grey : CC[cc[0]]; col = CC[cc[0]]; lab = C4.uni(cc[0]) + ["", "⁺", "²⁺", "³⁺"][cc[1]]; }
        else if (it.t === "a"){ col = AC[aa[0]]; lab = C4.ionUni(anion, 0).replace(/[₀-₉]/g, function(ch){ return ch; }); }
        else col = it.t === "n" ? "#b8c0cc" : "#d7b4f0";
        C4.ion(c, x, y, r, col, r === rc ? lab : "", {size:Math.max(8.5, rc * .78)});
      });
      if (bind > .6){ ctx.save(); ctx.globalAlpha = Math.min(1, (bind - .6) / .4);
        if (U > 0){ S.draw.label(c, status === "L" ? "léger trouble : " + C4.uni(s.f) + "(s)" : status === "X" ? "Fe(OH)₃(s) + CO₂ ↑" : "précipité " + C4.uni(s.f) + "(s)", W - 8, by + bh + 38, {color:P.ink, size:12, align:"right"}); C4.t(c, status === "X" ? "brun" : info[2].split(/[ (,]/)[0], W - 8, by + bh + 60, {align:"right", size:12, color:P.grey}); }
        else S.draw.label(c, "aucun précipité", W - 8, by + bh + 38, {color:P.green, size:12, align:"right"});
        ctx.restore(); }
      S.draw.text(c, C4.uni(cc[0]) + ["", "⁺", "²⁺", "³⁺"][cc[1]] + "  + NO₃⁻", xs[0] + bw / 2, by + bh + 16, {size:12.5, color:P.acc}); S.draw.text(c, C4.uni(aa[2]), xs[1] + bw / 2, by + bh + 16, {size:12.5, color:P.red});
      S.draw.text(c, "mélange", xs[2] + bw / 2, by + bh + 16, {size:12.5, color:P.ink});
      /* légende */
      var lx = 10, ly = 14; C4.ion(c, lx + 6, ly, 6, "#2f86c9"); C4.t(c, "cation", lx + 16, ly, {align:"left", size:11.5, color:P.grey}); C4.ion(c, lx + 74, ly, 6, "#2e8b57"); C4.t(c, "anion", lx + 84, ly, {align:"left", size:11.5, color:P.grey});
      C4.ion(c, lx + 138, ly, 4.5, "#b8c0cc"); C4.ion(c, lx + 148, ly, 4.5, "#d7b4f0"); C4.t(c, "NO₃⁻, Na⁺ : spectateurs", lx + 158, ly, {align:"left", size:11.5, color:P.grey});
      var net, h;
      if (status === "S"){ net = "Aucune réaction : tous les ions restent dissous."; }
      else if (cc[0] === "Ag" && aa[0] === "OH") net = "2 Ag⁺ + 2 OH⁻ → Ag₂O(s) + H₂O";
      else if (status === "X") net = "2 Fe³⁺ + 3 CO₃²⁻ + 3 H₂O → 2 Fe(OH)₃(s) + 3 CO₂(g)";
      else net = (s.x > 1 ? s.x + " " : "") + C4.uni(cc[0]) + ["", "⁺", "²⁺", "³⁺"][cc[1]] + " + " + (s.y > 1 ? s.y + " " : "") + C4.ionUni(anion, 0) + " → " + C4.uni(s.f) + "(s)";
      h = "<b>Équation nette :</b> " + net + "<br>";
      if (status === "S") h += "Les quatre ions (" + C4.sub(cc[0]) + C4.sup(cc[1], 1) + ", NO<sub>3</sub><sup>−</sup>, Na<sup>+</sup>, " + C4.ionHtml(anion, 0) + ") restent dissous : tout le monde est spectateur.";
      else h += "<b>Ions spectateurs :</b> NO<sub>3</sub><sup>−</sup> et Na<sup>+</sup> (ils restent dissous et n'apparaissent pas dans l'équation nette)." + (status === "L" ? "<br><i>Ce solide est peu soluble : on observe un trouble léger si les solutions sont concentrées, rien si elles sont diluées.</i>" : "") + "<br>Précipité : " + info[2] + ".";
      out.set(h, status === "S" ? "" : "ok");
    });
  }
});

SFA.sim({
  id:"c4-c10-flacons", ch:"c10", tag:"Enquête",
  titre:"Les trois flacons sans étiquette",
  resume:"NaCl, Na₂SO₄ ou Na₂CO₃ ? Verse du nitrate de baryum ou de l'acide chlorhydrique dans les tubes, observe à l'œil et à la loupe, puis identifie les trois flacons.",
  but:"Glisse un flacon compte-gouttes (Ba(NO₃)₂ ou HCl) sur un tube, ou touche un tube puis utilise les boutons. La loupe montre les ions du tube choisi : précipité, bulles de CO₂… Propose une identification. Défi : y arriver en 3 tests au plus.",
  aRetenir:"Ba²⁺ forme un précipité blanc avec SO₄²⁻ (BaSO₄) et avec CO₃²⁻ (BaCO₃), mais pas avec Cl⁻. L'acide détruit les ions carbonate : CO₃²⁻ + 2 H₃O⁺ → CO₂ + 3 H₂O (effervescence), ce qui redissout BaCO₃ ; BaSO₄, lui, reste. Deux réactifs bien choisis suffisent.",
  piege:"Si tu ajoutes l'acide AVANT le baryum, le carbonate est déjà parti en CO₂ : plus de précipité BaCO₃, et le tube ressemble à celui du chlorure. L'ordre des tests compte. Les ions Na⁺ et NO₃⁻ ne réagissent jamais : ce sont des ions spectateurs.",
  build:function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var NAMES = {Cl:"NaCl", SO4:"Na₂SO₄", CO3:"Na₂CO₃"}, st = {};
    function fresh(sol){ return {sol:sol, ba:0, hcl:0, carb:sol === "CO3" ? 1 : 0, pre:null, tp:0, td:0, tc:0, te:0, kind:""}; }
    function newGame(){ var a = ["Cl", "SO4", "CO3"].map(function(x){ return [Math.random(), x]; }).sort(function(p, q){ return p[0] - q[0]; }).map(function(z){ return z[1]; });
      st = {sol:a, tube:a.map(fresh), log:[[], [], []], tests:0, res:null, sel:0, t:0}; }
    newGame();
    var opt = [["Cl","NaCl"],["SO4","Na₂SO₄"],["CO3","Na₂CO₃"]];
    var gs = [k.select("Je pense que A est", opt, "Cl"), k.select("Je pense que B est", opt, "SO4"), k.select("Je pense que C est", opt, "CO3")];
    var ro = k.readouts(["Tube choisi", "Tests effectués"]);
    var out = k.note("", "");
    function add(r, i){
      var u = st.tube[i], now = st.t; st.tests++; st.sel = i; u.te = now; u.kind = r; st.res = null;
      if (r === "ba"){
        if (u.ba){ st.log[i].push("+ Ba(NO₃)₂ : rien de nouveau"); return; }
        u.ba = 1;
        if (u.sol === "SO4"){ u.pre = "BaSO4"; u.tp = now; st.log[i].push("+ Ba(NO₃)₂ : précipité blanc"); }
        else if (u.sol === "CO3" && u.carb){ u.pre = "BaCO3"; u.tp = now; st.log[i].push("+ Ba(NO₃)₂ : précipité blanc"); }
        else st.log[i].push("+ Ba(NO₃)₂ : rien" + (u.sol === "CO3" ? " (le carbonate est déjà parti avec l'acide)" : ""));
      } else {
        u.hcl = 1;
        if (u.carb){ u.carb = 0; u.tc = now; var had = u.pre === "BaCO3"; if (had){ u.pre = null; u.td = now; }
          st.log[i].push("+ HCl : effervescence (bulles)" + (had ? ", le précipité disparaît" : "")); }
        else st.log[i].push("+ HCl : " + (u.pre === "BaSO4" ? "le précipité reste" : "rien d'observable"));
      }
    }
    k.button("+ Ba(NO₃)₂ dans le tube choisi", function(){ add("ba", st.sel); }, true);
    k.button("+ HCl dilué dans le tube choisi", function(){ add("hcl", st.sel); });
    k.button("Nouvel échantillon (vider le tube)", function(){ var i = st.sel; st.tube[i] = fresh(st.sol[i]); st.log[i].push("— nouvel échantillon —"); });
    k.button("Vérifier mes réponses", function(){ var okk = gs.every(function(x, i){ return x.value === st.sol[i]; }); st.res = okk ? "ok" : "ko"; });
    k.button("Nouveau jeu", function(){ newGame(); });
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); }); lp.play();
    var L = {}, drag = null;
    c.pointer(function(type, p){
      if (!L.tubes) return;
      if (type === "down"){
        drag = null;
        L.bot.forEach(function(b){ if (Math.abs(p.x - b.x) < 30 && Math.abs(p.y - b.y) < 40) drag = {r:b.r, x:p.x, y:p.y}; });
        if (!drag) L.tubes.forEach(function(t, i){ if (Math.abs(p.x - t.x) < t.w && p.y > t.y - 20 && p.y < t.y + t.h + 20) st.sel = i; });
      } else if (type === "drag" && drag){ drag.x = p.x; drag.y = p.y; }
      else if (type === "up" && drag){ L.tubes.forEach(function(t, i){ if (Math.abs(drag.x - t.x) < t.w && drag.y > t.y - 70 && drag.y < t.y + t.h) add(drag.r, i); }); drag = null; }
    });
    function dropper(x, y, r, lab, col, ghost){
      var ctx = c.ctx; ctx.save(); if (ghost) ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#7a4a1f"; C4.rr(ctx, x - 15, y - 6, 30, 38, 6); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(x - 12, y + 6, 24, 14);
      ctx.fillStyle = "#2c3a4e"; ctx.fillRect(x - 5, y - 18, 10, 12); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y - 24, 7, 9, 0, 0, 7); ctx.fill();
      ctx.restore();
      if (!ghost) C4.t(c, lab, x, y + 46, {size:11.5, color:"#2c3a4e"});
    }
    /* types d'ions dans la loupe */
    var ION = {Na:["#9b6fd6", "Na⁺", 6], Cl:["#3aa35b", "Cl⁻", 7], SO4:["#e0a020", "SO₄²⁻", 9], CO3:["#4b5563", "CO₃²⁻", 9], Ba:["#2f64c8", "Ba²⁺", 8.5], NO3:["#c9b7e8", "NO₃⁻", 6.5], H:["#e2453c", "H₃O⁺", 6.5], CO2:["#9aa5b4", "CO₂", 8]};
    function seed(i){ var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
    k.draw(function(){
      var W = c.W, H = c.H, ctx = c.ctx, wide = W >= 480, t = st.t;
      C4.bg(c);
      var zone = wide ? W * 0.58 : W, ty = wide ? 120 : 110, th = wide ? 170 : 120, tw = Math.min(40, zone / 3 * 0.42);
      L.tubes = []; L.bot = [{r:"ba", x:zone * 0.3, y:34}, {r:"hcl", x:zone * 0.7, y:34}];
      dropper(L.bot[0].x, L.bot[0].y, "ba", "Ba(NO₃)₂", "#2f64c8", drag && drag.r === "ba");
      dropper(L.bot[1].x, L.bot[1].y, "hcl", "HCl dilué", "#e2453c", drag && drag.r === "hcl");
      /* portoir et tubes */
      ctx.fillStyle = "#c9a77c"; C4.rr(ctx, 8, ty + th * 0.55, zone - 16, 12, 4); ctx.fill();
      for (var i = 0; i < 3; i++){
        var u = st.tube[i], tx = zone * (2 * i + 1) / 6, sel = st.sel === i, dt = t - u.te;
        L.tubes.push({x:tx, y:ty, w:tw, h:th});
        if (sel){ ctx.save(); ctx.fillStyle = "rgba(31,75,158,.08)"; C4.rr(ctx, tx - zone / 6 + 4, ty - 26, zone / 3 - 8, th + 58, 10); ctx.fill(); ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
        C4.tube(c, tx - tw / 2, ty, tw, th, 0.6, "#9cc7e8", {alpha:.45});
        var ly = ty + th * 0.4;
        /* trouble puis dépôt du précipité */
        if (u.pre){ var age = t - u.tp, sett = Math.min(1, Math.max(0, (age - 0.4) / 2.2));
          ctx.save(); ctx.beginPath(); ctx.rect(tx - tw / 2 + 2, ly, tw - 4, th - (ly - ty) - 1); ctx.clip();
          ctx.fillStyle = "rgba(255,255,255," + (0.8 * (1 - sett)).toFixed(2) + ")"; ctx.fillRect(tx - tw / 2, ly, tw, th);
          ctx.fillStyle = "#fbfbfb"; ctx.strokeStyle = "#aab4c3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(tx, ty + th - tw * 0.32, tw * 0.4, tw * 0.3 * sett + 2, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
        /* précipité qui se redissout */
        if (!u.pre && u.td && t - u.td < 1.5){ ctx.fillStyle = "rgba(255,255,255," + (0.7 * (1 - (t - u.td) / 1.5)).toFixed(2) + ")"; ctx.beginPath(); ctx.ellipse(tx, ty + th - tw * 0.32, tw * 0.4, tw * 0.25, 0, 0, 7); ctx.fill(); }
        /* bulles de CO₂ */
        if (u.tc && t - u.tc < 3.5) for (var b = 0; b < 10; b++){ var by = ty + th - 12 - (((t - u.tc) * 70 + b * 23) % (th - th * 0.4 - 10)); if (by > ly) S.draw.dot(c, tx - tw / 2 + 7 + (b * 13 % (tw - 14)) + Math.sin(t * 6 + b) * 2, by, 2.2 + (b % 3) * 0.6, "rgba(255,255,255,.95)"); }
        /* goutte qui tombe */
        if (u.kind && dt < 0.6){ var gy2 = ty - 30 + dt / 0.6 * (ly - ty + 30); ctx.fillStyle = u.kind === "ba" ? "#7fb4de" : "#f08f87"; ctx.beginPath(); ctx.ellipse(tx, gy2, 4, 6, 0, 0, 7); ctx.fill(); }
        S.draw.text(c, "Tube " + "ABC"[i], tx, ty - 12, {size:13, color:sel ? P.acc : P.ink});
        if (st.res) S.draw.label(c, NAMES[st.sol[i]], tx, ty + th + 18, {color:gs[i].value === st.sol[i] ? P.green : P.red, size:12});
        else S.draw.text(c, "?", tx, ty + th + 18, {size:17, color:"#b8c0cc"});
      }
      if (drag) dropper(drag.x, drag.y, drag.r, "", drag.r === "ba" ? "#2f64c8" : "#e2453c", false);
      /* loupe : ions du tube choisi */
      var lr = wide ? Math.min(W * 0.19, 100) : 62, lx = wide ? zone + (W - zone) / 2 : W / 2, lyy = wide ? ty + th / 2 + 6 : ty + th + 30 + lr;
      var tt = L.tubes[st.sel];
      S.draw.line(c, tt.x + tw / 2, ty + th * 0.7, lx - lr * 0.7, lyy - lr * 0.7, "rgba(15,27,45,.3)", 1.4, [4, 4]);
      ctx.save(); ctx.beginPath(); ctx.arc(lx, lyy, lr, 0, 7); ctx.fillStyle = "#eaf4fb"; ctx.fill(); ctx.clip();
      var u2 = st.tube[st.sel], list = [], n;
      for (n = 0; n < 6; n++) list.push(["Na", n]);
      if (u2.sol === "Cl") for (n = 0; n < 6; n++) list.push(["Cl", 10 + n]);
      if (u2.sol === "SO4") for (n = 0; n < 3; n++) list.push(["SO4", 20 + n, "pair", n]);
      if (u2.sol === "CO3") for (n = 0; n < 3; n++) list.push([u2.carb ? "CO3" : "CO2", 30 + n, "pair", n]);
      if (u2.ba){ for (n = 0; n < 3; n++) list.push(["Ba", 40 + n, "pair", n]); for (n = 0; n < 6; n++) list.push(["NO3", 50 + n]); }
      if (u2.hcl){ var nh = u2.tc ? 1 : 4; for (n = 0; n < nh; n++) list.push(["H", 60 + n]); for (n = 0; n < 4; n++) list.push(["Cl", 70 + n]); }
      var solid = u2.pre ? Math.min(1, (t - u2.tp) / 1.6) : (u2.td && t - u2.td < 1.6 ? 1 - (t - u2.td) / 1.6 : 0);
      list.forEach(function(p){
        var s1 = seed(p[1] + 1), s2 = seed(p[1] + 101), hx = lx + (s1 - 0.5) * lr * 1.5, hy = lyy + (s2 - 0.5) * lr * 1.4;
        var x = hx + Math.sin(t * (0.8 + s1) + p[1]) * 6, y = hy + Math.cos(t * (0.7 + s2) + p[1]) * 6, info = ION[p[0]];
        if (p[2] === "pair" && solid > 0 && (p[0] === "Ba" || p[0] === "SO4" || p[0] === "CO3" || (p[0] === "CO2" && u2.td))){
          var isBa = p[0] === "Ba", sp = lr * 0.42, sx = lx + (p[3] - 1) * sp + (isBa ? -sp * 0.27 : sp * 0.27), sy = lyy + lr * 0.6;
          x = C4.lerp(x, sx, C4.ease(solid)); y = C4.lerp(y, sy, C4.ease(solid));
        }
        if (p[0] === "CO2"){ var age = t - u2.tc; if (age > 2.6) return; y = C4.lerp(hy, lyy - lr - 10, Math.min(1, age / 2.4)); ctx.globalAlpha = Math.max(0, 1 - age / 2.6); }
        C4.ion(c, x, y, info[2] * Math.max(0.85, lr / 85), info[0], "", {}); ctx.globalAlpha = 1;
      });
      if (solid > 0.9 && u2.pre){ ctx.fillStyle = "rgba(255,255,255,.35)"; C4.rr(ctx, lx - 52, lyy + lr * 0.62 - 14, 104, 28, 8); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lx, lyy, lr, 0, 7); ctx.stroke(); ctx.restore();
      if (u2.pre && solid > 0.9) S.draw.label(c, "précipité " + (u2.pre === "BaSO4" ? "BaSO₄" : "BaCO₃"), lx, lyy + lr * 0.62 - 26, {color:P.ink, size:11});
      C4.t(c, "loupe : tube " + "ABC"[st.sel], lx, lyy - lr - 12, {size:12, color:P.acc});
      /* légende des ions présents */
      var seen = {}; list.forEach(function(p){ seen[p[0]] = 1; }); if (!u2.tc || t - u2.tc > 2.6) delete seen.CO2;
      var keys = Object.keys(seen), cols = wide ? 2 : 4, lw = wide ? (W - zone) / 2 - 6 : (W - 20) / 4;
      keys.forEach(function(key, j){ var ex = (wide ? zone + 8 : 10) + (j % cols) * lw, ey = lyy + lr + 18 + Math.floor(j / cols) * 17; C4.ion(c, ex + 6, ey, 5.5, ION[key][0], "", {}); S.draw.text(c, ION[key][1], ex + 15, ey, {size:11.5, align:"left", color:"#2c3a4e"}); });
      ro.set(0, "ABC"[st.sel]); ro.set(1, st.tests);
      var stars = st.tests <= 3 ? 3 : st.tests <= 5 ? 2 : 1;
      var h = "<b>Observations</b><br>" + [0, 1, 2].map(function(i){ return "<b>" + "ABC"[i] + " :</b> " + (st.log[i].length ? st.log[i].join(" ; ") : "aucun test"); }).join("<br>");
      if (st.res === "ok") h += "<br>✅ Identification correcte en " + st.tests + " test(s) : " + C4.stars(stars) + (stars < 3 ? " (défi : 3 tests au plus)" : " défi réussi !") + " Le précipité qui reste avec l'acide désigne le sulfate, celui qui disparaît en moussant le carbonate, l'absence de précipité le chlorure.";
      if (st.res === "ko") h += "<br>Pas encore : revois tes observations. Un précipité avec Ba²⁺ exclut le chlorure ; l'acide départage sulfate et carbonate.";
      out.set(h, st.res === "ok" ? "ok" : st.res === "ko" ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c10-zinc", ch:"c10", tag:"Redox",
  titre:"Une lame de zinc dans le sulfate de cuivre",
  resume:"Le zinc cède des électrons aux ions cuivre : le cuivre se dépose, la solution bleue pâlit.",
  but:"Choisis la solution de CuSO₄ et la masse de zinc, puis laisse la réaction avancer. Compare ce qui s'épuise en premier.",
  aRetenir:"Zn → Zn²⁺ + 2 e⁻ (oxydation : Zn est le réducteur) ; Cu²⁺ + 2 e⁻ → Cu (réduction : Cu²⁺ est l'oxydant). Équation : Zn + Cu²⁺ → Zn²⁺ + Cu. La couleur bleue est due aux ions Cu²⁺ : elle pâlit quand ils disparaissent.",
  piege:"Oxydation ne veut pas dire « gain d'oxygène » : c'est une perte d'électrons. Ici, aucun oxygène n'intervient dans l'équation.",
  build:function(k, S){
    var c = k.canvas(270), g = k.canvas(190), P = S.draw.palette;
    var cc = k.slider("c(CuSO₄)", 0.05, 0.50, 0.05, 0.2, "mol/L");
    var vv = k.slider("Volume de solution", 50, 200, 10, 100, "mL");
    var mz = k.slider("Masse de la lame de zinc", 0.2, 5, 0.1, 2, "g");
    var t = k.slider("Temps", 0, 60, 1, 0, "min");
    var ro = k.readouts(["ξ (mol)", "Cu déposé", "Zn consommé", "c(Cu²⁺) restante"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ t.set(Math.min(60, t.value + dt * 8)); if (t.value >= 60) lp.pause(); k.redraw(); });
    k.button("▶ Plonger la lame", function(){ if (t.value >= 60) t.set(0); lp.play(); }, true); k.button("❚❚ Pause", function(){ lp.pause(); }); k.button("↺ Départ", function(){ lp.pause(); t.set(0); });
    var rd = C4.rnd(17), J = []; for (var i = 0; i < 120; i++) J.push([rd(), rd()]);
    var anim = k.loop(function(){ k.redraw(); }); anim.play();
    k.note("<b>Demi-équations.</b> Oxydation : Zn → Zn<sup>2+</sup> + 2 e<sup>−</sup> (Zn est le réducteur). Réduction : Cu<sup>2+</sup> + 2 e<sup>−</sup> → Cu (Cu<sup>2+</sup> est l'oxydant). Bilan : Zn + Cu<sup>2+</sup> → Zn<sup>2+</sup> + Cu.", "ok");
    k.note("Cinétique simplifiée : ξ(t) = ξ<sub>max</sub>·(1 − e<sup>−t/12</sup>) ; M(Zn) = 65, M(Cu) = 63,5 g/mol. Un point = 4 mmol d'ions (schéma qualitatif).", "");
    function xi(tt, nCu, nZn){ return Math.min(nCu, nZn) * (1 - Math.exp(-tt / 12)); }
    k.draw(function(){
      var nCu = cc.value * vv.value / 1000, nZn = mz.value / 65, xm = Math.min(nCu, nZn), x = xi(t.value, nCu, nZn), cR = (nCu - x) / (vv.value / 1000), W = c.W, ctx = c.ctx;
      c.clear(); C4.bg(c); g.clear(); C4.bg(c, 250);
      var bw = Math.min(190, W * .52), bx = W / 2 - bw / 2, by = 92, bh = 150, run = lp.running;
      var inten = Math.min(.8, .05 + cR * 1.5);
      C4.beaker2(c, bx, by, bw, bh, .74, "#2f86c9", {alpha:inten + .02});
      /* lame de zinc, recouverte de cuivre */
      var zw = 20, zx = W / 2 - zw / 2, zt = 24, zb = by + bh - 14, cover = Math.min(1, x / Math.max(1e-9, xm)) * (nCu <= nZn ? 1 : nZn / nCu * 0 + 1);
      var zg = ctx.createLinearGradient(zx, 0, zx + zw, 0); zg.addColorStop(0, "#c4cdd8"); zg.addColorStop(.5, "#e2e8ef"); zg.addColorStop(1, "#aab4c1");
      ctx.fillStyle = zg; S.draw.rrect(c, zx, zt, zw, zb - zt, 3); ctx.fill();
      var cuTop = by + bh * .26, depth = (zb - cuTop) * Math.min(1, cover * 1.0);
      if (cover > .01){ ctx.save(); ctx.beginPath(); ctx.rect(zx - 8, zb - depth, zw + 16, depth); ctx.clip();
        ctx.fillStyle = "#b86a2e"; S.draw.rrect(c, zx - 2, cuTop, zw + 4, zb - cuTop, 3); ctx.globalAlpha = .55 + .45 * Math.min(1, cover); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = "#d98a4a"; for (var q = 0; q < 26; q++){ var yy = cuTop + J[q][0] * (zb - cuTop), xx = zx - 4 + J[q][1] * (zw + 8) , sz = 2 + cover * 3.5; ctx.beginPath(); ctx.moveTo(xx - sz, yy); ctx.lineTo(xx, yy - sz * 1.8); ctx.lineTo(xx + sz, yy); ctx.fill(); }
        ctx.restore(); }
      S.draw.text(c, "lame de zinc", W / 2, 12, {size:12.5, color:P.grey});
      /* ions */
      var dCu = Math.min(40, Math.round((nCu - x) * 1000 / 4)), dZn = Math.min(40, Math.round(x * 1000 / 4)), r = 10;
      for (var i = 0; i < dCu; i++){ var j = J[i + 30], px = bx + 14 + j[0] * (bw / 2 - 40) + (j[0] > 0 ? 0 : 0), side = i % 2 ? 1 : -1; px = side < 0 ? bx + 14 + j[0] * (bw / 2 - 34) : W / 2 + zw / 2 + 12 + j[0] * (bw / 2 - 34); var py = by + bh * .32 + j[1] * (bh * .6); C4.ion(c, px + Math.sin(Date.now() / 600 + i) * 2, py + Math.cos(Date.now() / 700 + i) * 2, r, P.blue, "Cu²⁺", {size:8}); }
      for (i = 0; i < dZn; i++){ j = J[i + 75]; side = i % 2 ? 1 : -1; px = side < 0 ? bx + 14 + j[0] * (bw / 2 - 34) : W / 2 + zw / 2 + 12 + j[0] * (bw / 2 - 34); py = by + bh * .32 + j[1] * (bh * .6); C4.ion(c, px + Math.sin(Date.now() / 650 + i) * 2, py + Math.cos(Date.now() / 720 + i) * 2, r, "#a9b4c2", "Zn²⁺", {size:8, tcolor:"#2c3a4e"}); }
      if (run && x < xm * .995) for (i = 0; i < 4; i++){ var ey = zt + 10 + ((Date.now() / 18 + i * 60) % (by - zt - 6)); S.draw.dot(c, W / 2, ey, 3.2, P.red); }
      if (run) C4.t(c, "e⁻", W / 2 + 18, by - 14, {size:12.5, color:P.red});
      S.draw.text(c, S.fmt(t.value, 0) + " min", W - 12, 18, {size:13, color:P.ink, align:"right"});
      C4.t(c, "Cu²⁺ (bleu) · Zn²⁺ (gris)", 12, 18, {size:12, color:P.grey, align:"left"});
      /* graphique des quantités */
      var top = Math.max(nCu, nZn) * 1000 * 1.08, ax = S.draw.axes(g, {x0:0, x1:60, y0:0, y1:Math.max(1, top), xl:"t (min)", yl:"n (mmol)", l:44});
      S.draw.fn(g, ax, function(tt){ return (nCu - xi(tt, nCu, nZn)) * 1000; }, P.blue, 3);
      S.draw.fn(g, ax, function(tt){ return xi(tt, nCu, nZn) * 1000; }, P.grey, 3);
      S.draw.line(g, ax.X(t.value), ax.Y(0), ax.X(t.value), ax.T, "rgba(15,27,45,.25)", 1.5, [4, 4]);
      S.draw.dot(g, ax.X(t.value), ax.Y((nCu - x) * 1000), 6, P.blue); S.draw.dot(g, ax.X(t.value), ax.Y(x * 1000), 6, "#6b7889");
      S.draw.label(g, "n(Cu²⁺)", ax.X(2), ax.Y(nCu * 1000) - 14, {align:"left", color:P.blue, size:12}); S.draw.label(g, "n(Zn²⁺) = ξ", ax.X(34), ax.Y(Math.max(1, xm * 1000)) + 18, {align:"left", color:"#4a5568", size:12});
      ro.set(0, S.fmt(x * 1000, 2) + " mmol"); ro.set(1, S.fmt(x * 63.5, 2) + " g"); ro.set(2, S.fmt(x * 65, 2) + " g"); ro.set(3, S.fmt(cR, 3) + " mol/L");
      nt.set(nCu < nZn ? "Les ions Cu²⁺ sont limitants (" + S.fmt(nCu * 1000, 1) + " mmol contre " + S.fmt(nZn * 1000, 1) + " mmol de Zn) : la solution finit par se décolorer, il reste du zinc. Masse de la lame à la fin : " + S.fmt(mz.value - xm * 65 + xm * 63.5, 2) + " g (le cuivre déposé pèse un peu moins que le zinc dissous)." : "Le zinc est limitant : il disparaît avant la fin, la solution reste bleue (il reste " + S.fmt((nCu - nZn) * 1000, 1) + " mmol de Cu²⁺).", "");
    });
  }
});

SFA.sim({
  id:"c4-c10-durete", ch:"c10", tag:"Niche",
  titre:"Dureté de l'eau : quand le savon forme un précipité",
  resume:"Dans une eau calcaire, le savon précipite avec Ca²⁺ avant de mousser : plus l'eau est dure, plus il faut de savon.",
  but:"Ajoute du savon goutte à goutte (boutons, ou touche le flacon) : chaque Ca²⁺ capte 2 savons avant que la mousse apparaisse. Défi : devine la dureté d'une eau inconnue en comptant les gouttes.",
  aRetenir:"Ca²⁺ + 2 savon⁻ → (savon)₂Ca (précipité, « écume »). La mousse n'apparaît qu'une fois tous les ions Ca²⁺ précipités. Dureté en degrés français : 1 °f = 0,1 mmol/L d'ions Ca²⁺ (équivalent), soit 10 mg/L de CaCO₃.",
  piege:"Le précipité d'écume n'est pas de la saleté : c'est le savon qui a réagi avec le calcaire. L'eau dure consomme du savon sans nettoyer.",
  build:function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var st = {defi:false, hid:30, dropT:0, score:0, n:0, res:null};
    var h = k.slider("Dureté de l'eau", 0, 60, 1, 30, "°f");
    var v = k.slider("Volume d'eau", 50, 200, 10, 100, "mL");
    var d = k.slider("Gouttes de savon ajoutées (0,05 mmol chacune)", 0, 60, 1, 0, "");
    var df = k.toggle("Eau inconnue (défi)", false, function(on){ st.defi = on; st.res = null; if (on){ st.hid = 8 + Math.floor(Math.random() * 45); st.n++; d.set(0); } vis(); });
    var est = k.slider("Mon estimation de la dureté", 0, 60, 1, 25, "°f");
    var chk = k.button("✔ Vérifier mon estimation", function(){ st.res = Math.abs(est.value - st.hid) <= 3 ? "ok" : "ko"; if (st.res === "ok") st.score++; }, true);
    k.button("+1 goutte", function(){ d.set(d.value + 1); st.dropT = Date.now(); });
    k.button("+5 gouttes", function(){ d.set(d.value + 5); st.dropT = Date.now(); });
    k.button("Vider le bécher", function(){ d.set(0); st.res = null; });
    var ro = k.readouts(["n(Ca²⁺)", "Savon nécessaire", "Gouttes nécessaires", "Mousse ?", "Classe (indicative)"]);
    var nt = k.note("", "");
    function vis(){ est.el.parentNode.style.display = st.defi ? "" : "none"; chk.style.display = st.defi ? "" : "none"; h.el.parentNode.style.display = st.defi ? "none" : ""; }
    vis();
    var rd = C4.rnd(4), J = []; for (var i = 0; i < 160; i++) J.push([rd(), rd()]);
    c.pointer(function(type, pt){ if (type === "down" && pt.x > c.W * .62 && pt.y < 150){ d.set(d.value + 1); st.dropT = Date.now(); k.redraw(); } });
    var lp = k.loop(function(){ k.redraw(); }); lp.play();
    k.draw(function(){
      var hh = st.defi ? st.hid : h.value, nCa = hh * 0.1 * v.value / 1000, soap = d.value * 0.05, need = 2 * nCa, ppt = Math.min(soap / 2, nCa), excess = Math.max(0, soap - need), dn = need / 0.05, W = c.W, ctx = c.ctx, now = Date.now();
      C4.bg(c, 296);
      var bw = 120 + (v.value - 50) / 150 * 50, bh = 150, bx = W * .36 - bw / 2, by = 112, lvl = .42 + v.value / 200 * .34, surf = by + bh * (1 - lvl);
      C4.beaker2(c, bx, by, bw, bh, lvl, "#6fb4e8", {alpha:.4});
      /* ions Ca2+ libres, flocons, savon en excès */
      var nFree = Math.round((nCa - ppt) / 0.05), nPpt = Math.round(ppt / 0.05), nEx = Math.round(excess / 0.05);
      for (var i = 0; i < nFree; i++){ var j = J[i]; C4.ion(c, bx + 12 + j[0] * (bw - 24) + Math.sin(now / 700 + i) * 2, surf + 12 + j[1] * (by + bh - surf - 28) + Math.cos(now / 800 + i) * 2, 9, "#4d8f7a", "Ca²⁺", {size:7.5}); }
      for (i = 0; i < nPpt; i++){ j = J[i + 40]; var fy = by + bh - 10 - (i % 5) * 5 - j[1] * 6, fx = bx + 14 + ((i * 29) % (bw - 28)); ctx.save(); ctx.fillStyle = "rgba(250,250,244,.98)"; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(fx - 7, fy); ctx.lineTo(fx - 3, fy - 7); ctx.lineTo(fx + 4, fy - 6); ctx.lineTo(fx + 8, fy); ctx.lineTo(fx + 2, fy + 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
      for (i = 0; i < Math.min(30, nEx * 2); i++){ j = J[i + 90]; C4.ion(c, bx + 10 + j[0] * (bw - 20) + Math.sin(now / 500 + i) * 2, surf + 8 + j[1] * (by + bh - surf - 24), 4, P.orange); }
      /* mousse */
      if (excess > 1e-9){ var nb = Math.min(34, 6 + Math.round(excess / 0.05 * 3)); ctx.save(); for (i = 0; i < nb; i++){ j = J[i + 120]; var r = 5 + j[1] * 5, bxx = bx + 4 + (i / nb) * (bw - 8) + (j[0] - .5) * 10, byy = surf - 3 - j[0] * 9 + (i % 2) * 3; ctx.fillStyle = "rgba(255,255,255,.96)"; ctx.strokeStyle = "#b8c0cc"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bxx, byy, r, 0, 7); ctx.fill(); ctx.stroke(); } ctx.restore(); }
      /* flacon de savon */
      var kx = W * .8, ky = 36, tilt = Math.min(1, (now - st.dropT) / 150); 
      ctx.save(); ctx.translate(kx, ky); ctx.rotate(.18); ctx.fillStyle = P.teal; S.draw.rrect(c, -22, -10, 44, 68, 10); ctx.fill(); ctx.fillStyle = "#e6f3f6"; ctx.fillRect(-14, 14, 28, 26); ctx.fillStyle = P.teal; ctx.beginPath(); ctx.moveTo(-8, 58); ctx.lineTo(0, 76); ctx.lineTo(8, 58); ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.text(c, "savon", kx + 3, ky + 28, {size:12, color:P.teal}); C4.t(c, "touche pour verser", kx, ky + 92, {size:11.5, color:P.grey, weight:600});
      var dt = now - st.dropT; if (dt < 600){ var dx = kx - 8 + (bx + bw * .62 - kx + 8) * Math.min(1, dt / 600) * .0, dy = ky + 72 + (surf - ky - 72) * Math.min(1, dt / 600); ctx.fillStyle = P.teal; ctx.beginPath(); ctx.ellipse(kx - 8 + (bx + bw * .7 - (kx - 8)) * Math.min(1, dt / 600), dy, 4.5, 6.5, 0, 0, 7); ctx.fill(); }
      S.draw.text(c, "Ca²⁺ + 2 savon⁻ → (savon)₂Ca ↓", W * .36, 18, {size:W < 480 ? 13 : 15, color:P.ink, math:true});
      C4.t(c, S.fmt(v.value, 0) + " mL d'eau" + (st.defi ? " (dureté inconnue)" : " à " + S.fmt(hh, 0) + " °f"), bx + bw / 2, by + bh + 16, {size:12.5, color:P.ink});
      C4.t(c, d.value + " goutte" + (d.value > 1 ? "s" : "") + " versée" + (d.value > 1 ? "s" : ""), bx + bw / 2, by + bh + 36, {size:13, color:P.teal});
      var hid = st.defi && st.res == null, cls = hh < 7 ? "très douce" : hh < 15 ? "douce" : hh < 25 ? "moyennement dure" : hh < 32 ? "assez dure" : hh < 42 ? "dure" : "très dure";
      ro.set(0, hid ? "?" : S.fmt(nCa, 3) + " mmol"); ro.set(1, hid ? "?" : S.fmt(need, 2) + " mmol"); ro.set(2, hid ? "?" : S.fmt(dn, 1)); ro.set(3, excess > 1e-9 ? "oui" : "non"); ro.set(4, hid ? "?" : cls);
      if (st.defi){
        if (st.res === "ok") nt.set("✅ Dureté ≈ " + S.fmt(st.hid, 0) + " °f : tu es à ±3 °f. Il fallait " + S.fmt(dn, 1) + " gouttes pour tout précipiter (" + S.fmt(d.value, 0) + " versées). Réussites : " + st.score + " / " + st.n + ".", "ok");
        else if (st.res === "ko") nt.set("Pas tout à fait : la dureté réelle est " + S.fmt(st.hid, 0) + " °f. Rappelle-toi : n(savon) à la première mousse = 2 × n(Ca²⁺), et 1 °f = 0,1 mmol/L.", "warn");
        else nt.set("🎯 Défi : ajoute du savon jusqu'à ce que la mousse apparaisse (compte les gouttes), puis déduis n(Ca²⁺) = n(savon)/2, divise par le volume et convertis en °f (1 °f = 0,1 mmol/L). Règle ton estimation et vérifie.", "");
      } else nt.set(hh === 0 ? "Eau sans calcaire : la mousse apparaît dès la première goutte." : excess > 1e-9 ? "Mousse : tous les ions Ca²⁺ ont précipité, le savon en excès mousse. Dureté retrouvée : " + S.fmt(d.value * 0.05 / 2 / (v.value / 1000) / 0.1, 0) + " °f (au nombre entier de gouttes près)." : "Pas de mousse : le savon est consommé par le calcaire (précipité d'écume). " + (dn - d.value < 1e-9 ? "Tous les Ca²⁺ viennent de précipiter : la prochaine goutte fera mousser." : "Il faut encore " + S.fmt(Math.max(0, dn - d.value), 1) + " goutte(s) pour que tous les Ca²⁺ précipitent."), excess > 1e-9 ? "ok" : "");
    });
    k.note("Modèle simplifié : seul Ca²⁺ cause la dureté (en réalité aussi Mg²⁺) ; chaque goutte apporte 0,05 mmol de savon (anion carboxylate). Un disque = 0,05 mmol.", "");
  }
});
})();
