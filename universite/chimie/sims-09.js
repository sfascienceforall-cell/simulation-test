/* Chimie BA1 · compléments · chapitre 9 : additions sur les alcènes */
(function(){
var P = function(){ return SFA.draw.palette; };

/* ---------- 1. Addition électrophile : produits et carbocations ---------- */
var ALK = {
  pr:{n:"propène",f:"CH₃–CH=CH₂",maj:"2°",mino:"1°",s:"CH₃–CH⁺–CH₃ (secondaire) plutôt que CH₃–CH₂–CH₂⁺ (primaire)"},
  ib:{n:"2-méthylpropène",f:"(CH₃)₂C=CH₂",maj:"3°",mino:"1°",s:"(CH₃)₃C⁺ (tertiaire) plutôt que (CH₃)₂CH–CH₂⁺ (primaire)"},
  b1:{n:"but-1-ène",f:"CH₃CH₂–CH=CH₂",maj:"2°",mino:"1°",s:"CH₃CH₂–CH⁺–CH₃ (secondaire) plutôt que primaire"},
  ch:{n:"cyclohexène",f:"C₆H₁₀ (cycle)",maj:"2°",mino:"2°",s:"cation secondaire des deux côtés : aucune régiosélectivité à discuter"},
  mb2:{n:"2-méthylbut-2-ène",f:"(CH₃)₂C=CH–CH₃",maj:"3°",mino:"2°",s:"(CH₃)₂C⁺–CH₂CH₃ (tertiaire) plutôt que (CH₃)₂CH–CH⁺–CH₃ (secondaire)"},
  mb1:{n:"3-méthylbut-1-ène",f:"(CH₃)₂CH–CH=CH₂",maj:"2°",mino:"1°",s:"cation secondaire (CH₃)₂CH–CH⁺–CH₃, qui peut se transposer en tertiaire par glissement d’hydrure"}
};
var RES = {
  pr:{hbr:["2-bromopropane","1-bromopropane (traces)"],h2o:["propan-2-ol","propan-1-ol (traces)"],br2:["1,2-dibromopropane (racémique)",""],rad:["1-bromopropane","2-bromopropane (traces)"],h2:["propane",""]},
  ib:{hbr:["2-bromo-2-méthylpropane","1-bromo-2-méthylpropane (traces)"],h2o:["2-méthylpropan-2-ol","2-méthylpropan-1-ol (traces)"],br2:["1,2-dibromo-2-méthylpropane (achiral)",""],rad:["1-bromo-2-méthylpropane","2-bromo-2-méthylpropane (traces)"],h2:["2-méthylpropane",""]},
  b1:{hbr:["2-bromobutane (racémique)","1-bromobutane (traces)"],h2o:["butan-2-ol (racémique)","butan-1-ol (traces)"],br2:["1,2-dibromobutane (racémique)",""],rad:["1-bromobutane","2-bromobutane (traces)"],h2:["butane",""]},
  ch:{hbr:["bromocyclohexane",""],h2o:["cyclohexanol",""],br2:["trans-1,2-dibromocyclohexane (racémique)","cis : pas observé"],rad:["bromocyclohexane (aucune régiosélectivité)",""],h2:["cyclohexane",""]},
  mb2:{hbr:["2-bromo-2-méthylbutane","2-bromo-3-méthylbutane (traces)"],h2o:["2-méthylbutan-2-ol","3-méthylbutan-2-ol (traces)"],br2:["2,3-dibromo-2-méthylbutane (racémique)",""],rad:["2-bromo-3-méthylbutane (racémique)","2-bromo-2-méthylbutane (traces)"],h2:["2-méthylbutane",""]},
  mb1:{hbr:["2-bromo-2-méthylbutane (après transposition d’hydrure)","2-bromo-3-méthylbutane (minoritaire, sans transposition)"],h2o:["2-méthylbutan-2-ol (après transposition d’hydrure)","3-méthylbutan-2-ol (minoritaire)"],br2:["1,2-dibromo-3-méthylbutane (racémique ; pas de transposition : ion bromonium)",""],rad:["1-bromo-3-méthylbutane","2-bromo-3-méthylbutane (traces)"],h2:["2-méthylbutane",""]}
};
var REAG = {
  hbr:{t:"HBr (ionique)",m:"Étape 1 (lente) : la liaison π attaque H⁺ → carbocation. Étape 2 (rapide) : Br⁻ attaque le cation. Règle de Markovnikov : H va sur le carbone qui en porte le plus, car le cation le plus substitué est le plus stable."},
  h2o:{t:"H₂O / H⁺ (hydratation)",m:"Protonation de la liaison π → carbocation ; H₂O attaque le cation, puis perte de H⁺ (catalyseur régénéré). Même régiosélectivité de Markovnikov ; transposition possible. Équilibre : l’hydratation se fait dans l’eau, la déshydratation à chaud en milieu acide concentré."},
  br2:{t:"Br₂ (CCl₄)",m:"Le Br₂ polarisé donne un ion bromonium cyclique (pas de carbocation libre, donc pas de transposition) ; Br⁻ attaque par la face opposée : addition ANTI, stéréospécifique."},
  rad:{t:"HBr + peroxydes (ROOR)",m:"Mécanisme radicalaire en chaîne : Br· s’additionne sur le carbone le moins substitué pour former le radical le plus stable ; anti-Markovnikov. Valable avec HBr seulement (pas HCl ni HI)."},
  h2:{t:"H₂ / Pd, Pt ou Ni",m:"Hydrogénation catalytique : les deux H arrivent sur la même face de la liaison double, adsorbée sur le métal : addition SYN. Produit : l’alcane."}
};
var LEV = {"3°":70,"2°":120,"1°":190};
SFA.sim({
  id:"uc-c09-addition-electrophile", ch:"c09", tag:"Markovnikov",
  titre:"Additions sur un alcène : produit, cation et mécanisme",
  resume:"HBr, H₂O/H⁺, Br₂, HBr/peroxydes, H₂ : le produit majoritaire, le carbocation et la stéréochimie.",
  but:"Choisis un alcène et un réactif. Pour HBr et H₂O/H⁺, clique sur le carbone qui reçoit H⁺ : tu vois le carbocation formé, sa stabilité et le profil d'énergie. Le panneau donne le produit, le mécanisme et la stéréochimie.",
  aRetenir:"Cation : 3° &gt; 2° &gt; 1° (hyperconjugaison, effet inductif donneur). Markovnikov : le nucléophile se fixe sur le carbone le plus substitué. Br₂ : anti ; H₂/Pd : syn ; HBr + ROOR : anti-Markovnikov. Un carbocation peut se transposer (hydrure, méthyle) vers un cation plus stable.",
  piege:"Appliquer Markovnikov à HBr/peroxydes ou à Br₂. Oublier de vérifier si une transposition produit un cation plus stable. Dire que Br₂ donne un cation (il donne un ion bromonium).",
  build:function(k,S){
    var c = k.canvas(480);
    var al = k.select("Alcène",[["pr","propène"],["ib","2-méthylpropène"],["b1","but-1-ène"],["ch","cyclohexène"],["mb2","2-méthylbut-2-ène"],["mb1","3-méthylbut-1-ène"]],"pr", function(){ st.ch = null; st.t = 0; });
    var re = k.select("Réactif",[["hbr","HBr"],["h2o","H₂O / H⁺"],["br2","Br₂"],["rad","HBr + ROOR"],["h2","H₂ / Pd"]],"hbr", function(){ st.ch = null; st.t = 0; });
    var nt = k.note("","");
    var nt2 = k.note("","ok");
    var SUB = {pr:[["H","H"],["H","CH₃"]], ib:[["H","H"],["CH₃","CH₃"]], b1:[["H","H"],["H","CH₂CH₃"]], ch:[["H","CH₂"],["H","CH₂"]], mb2:[["CH₃","CH₃"],["H","CH₃"]], mb1:[["H","H"],["H","CH(CH₃)₂"]]};
    var st = {ch:null, t:0}, hit = {};
    var ND = ["", "1°", "2°", "3°"];
    function degOf(subs){ return 1 + subs.filter(function(x){ return x !== "H"; }).length; }
    c.pointer(function(type, p){
      if (type !== "down") return;
      if (!(re.value === "hbr" || re.value === "h2o")) return;
      ["a","b"].forEach(function(w){ var h = hit[w]; if (h && Math.hypot(p.x - h.x, p.y - h.y) < 34){ st.ch = w; st.t = 0; k.redraw(); } });
    });
    var lp = k.loop(function(dt){ if (st.ch && st.t < 1){ st.t = Math.min(1, st.t + dt * 1.1); k.redraw(); } else if (!st.ch && (re.value === "hbr" || re.value === "h2o")){ st.pulse = (st.pulse || 0) + dt; k.redraw(); } });
    lp.play();
    function wrap(s,n){ var w=s.split(" "), out=[], cur=""; w.forEach(function(x){ if ((cur+" "+x).trim().length>n){ out.push(cur.trim()); cur=x; } else cur+=" "+x; }); out.push(cur.trim()); return out; }
    k.draw(function(){
      var Pl = S.draw.palette, a = ALK[al.value], r = RES[al.value][re.value], ctx = c.ctx, W = c.W, H = c.H, ph = W < 420, ion = (re.value === "hbr" || re.value === "h2o");
      UC.bg(c, "#f6f9fc", "#ffffff");
      var sb = SUB[al.value], cy = 96, cx = W / 2 - (ph ? 8 : 0), d = 56, A = [cx - d / 2, cy], B = [cx + d / 2, cy];
      var dA = degOf(sb[0]), dB = degOf(sb[1]);          /* degré du cation si le + est sur A (resp. B) */
      /* l'utilisateur choisit où va H+ : cation sur l'autre carbone */
      var hOnA = st.ch === "a", hOnB = st.ch === "b", cat = hOnA ? "b" : hOnB ? "a" : null;
      var degCat = cat === "a" ? dA : cat === "b" ? dB : null;
      var bestDeg = Math.max(dA, dB);
      function sub(P0, ang, lab, col){ var L = 40, x = P0[0] + Math.cos(ang) * L, y = P0[1] - Math.sin(ang) * L; S.draw.line(c, P0[0], P0[1], x, y, "#64748b", 3); S.draw.text(c, lab, x + Math.cos(ang) * (7 + lab.length * 2.4), y - Math.sin(ang) * 8, {size:12.5, color:col || Pl.ink, weight:700}); }
      /* liaison C=C ou C–C */
      var dbl = !(ion && st.ch && st.t > 0.8);
      S.draw.line(c, A[0], A[1] - (dbl ? 3 : 0), B[0], B[1] - (dbl ? 3 : 0), "#475569", 3.4); if (dbl) S.draw.line(c, A[0], A[1] + 3.5, B[0], B[1] + 3.5, "#475569", 3.4);
      if (al.value === "ch"){ var hexy = [[A[0], A[1]], [A[0] - 22, A[1] + 40], [A[0] + 2, A[1] + 80], [B[0] - 2, B[1] + 80], [B[0] + 22, B[1] + 40], [B[0], B[1]]]; ctx.save(); ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath(); hexy.forEach(function(q, i){ i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.restore(); S.draw.text(c, "(CH₂)₄", cx, cy + 44, {size:11, color:Pl.grey}); }
      else { sub(A, Math.PI * 5 / 6, sb[0][0]); sub(A, -Math.PI * 5 / 6, sb[0][1]); sub(B, Math.PI / 6, sb[1][0]); sub(B, -Math.PI / 6, sb[1][1]); }
      /* atomes : C1, C2 */
      [["a", A, "C"], ["b", B, "C"]].forEach(function(q){
        UC.ball(ctx, q[1][0], q[1][1], 13, cat === q[0] ? "#c0321d" : "#4b5563"); S.draw.text(c, "C", q[1][0], q[1][1] + 0.5, {size:12, color:"#fff"}); hit[q[0]] = {x:q[1][0], y:q[1][1]};
        if (cat === q[0] && st.t > 0.8){ S.draw.label(c, "+", q[1][0], q[1][1] - 28, {color:Pl.red, size:15}); S.draw.label(c, "cation " + ND[degCat], q[1][0], q[1][1] - 50, {color:degCat === bestDeg ? Pl.green : Pl.red, size:11.5}); }
        if (ion && !st.ch){ var pu = 0.5 + 0.5 * Math.sin((st.pulse || 0) * 4); ctx.save(); ctx.strokeStyle = Pl.amber; ctx.globalAlpha = 0.35 + 0.5 * pu; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(q[1][0], q[1][1], 21 + pu * 3, 0, 7); ctx.stroke(); ctx.restore(); }
      });
      if (ion){
        var hx0 = W * 0.12, hy0 = cy - 70, tgt = st.ch === "a" ? A : st.ch === "b" ? B : null;
        var u = st.ch ? Math.min(1, st.t / 0.8) : 0, hx = tgt ? hx0 + (tgt[0] - hx0) * u : hx0, hy = tgt ? hy0 + (tgt[1] - 14 - hy0) * u : hy0;
        UC.ball(ctx, hx, hy, 9, "#e6ebf2"); S.draw.text(c, "H⁺", hx, hy + 0.5, {size:9, color:Pl.ink});
        if (!st.ch) S.draw.label(c, "clique le carbone qui reçoit H⁺", W / 2, 16, {color:Pl.amber, size:12});
        else if (st.t >= 0.8){ var good = degCat === bestDeg; S.draw.label(c, good ? "Markovnikov : cation le plus stable (" + ND[degCat] + ")" : "Cation moins stable (" + ND[degCat] + ") : voie minoritaire", W / 2, 16, {color:good ? Pl.green : Pl.red, size:ph ? 11 : 12.5}); S.draw.text(c, (re.value === "hbr" ? "Br⁻" : "H₂O"), cat === "b" ? B[0] + 88 : A[0] - 88, cy + 4 + 0, {size:12, color:Pl.acc, weight:800}); }
      }
      /* bas : profil d'énergie (ions) ou cartes des étapes */
      var py0 = 188, ph0 = H - py0 - 10;
      if (ion){
        var X = function(t){ return 56 + t * (W - 90); }, Y = function(e){ return py0 + ph0 - 20 - (e + 30) / 300 * (ph0 - 36); };
        ctx.save(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(46, py0 + 4); ctx.lineTo(46, py0 + ph0 - 10); ctx.lineTo(W - 8, py0 + ph0 - 10); ctx.stroke(); ctx.restore();
        S.draw.text(c, "énergie", 50, py0 + 8, {size:10.5, align:"left", color:Pl.grey, weight:700}); S.draw.text(c, "coordonnée de réaction", W - 10, py0 + ph0 - 0, {size:10.5, align:"right", color:Pl.grey, weight:700});
        function hill(t0,e0,t1,e1,top,col,w,dash){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (var i=0;i<=40;i++){ var u2=i/40,t=t0+(t1-t0)*u2, e=e0+(e1-e0)*(3*u2*u2-2*u2*u2*u2)+(top-(e0+e1)/2)*Math.sin(Math.PI*u2); if (i===0) ctx.moveTo(X(t),Y(e)); else ctx.lineTo(X(t),Y(e)); } ctx.stroke(); ctx.restore(); }
        var eA = LEV[ND[dA]], eB = LEV[ND[dB]], paths = [["a", dA, eA, "cation sur C1 (H⁺ sur C2)"], ["b", dB, eB, "cation sur C2 (H⁺ sur C1)"]];
        paths = [["b", dB, eB, "cation " + ND[dB] + " (H⁺ sur C1)"], ["a", dA, eA, "cation " + ND[dA] + " (H⁺ sur C2)"]];
        paths.forEach(function(p, i){
          var sel = cat === p[0], good2 = p[1] === bestDeg, col = good2 ? Pl.acc : Pl.red;
          ctx.save(); ctx.globalAlpha = (cat && !sel) ? 0.3 : 1; hill(0, 20, 0.55, p[2], p[2] + 45, col, sel ? 4 : good2 ? 3 : 2, good2 ? null : [5, 4]); hill(0.55, p[2], 1, -30, p[2] + 25, col, sel ? 4 : good2 ? 3 : 2, good2 ? null : [5, 4]); ctx.restore();
          if (dA !== dB || i === 0) S.draw.label(c, p[3], X(0.55) + (dA === dB ? 0 : (i === 0 ? 0 : 0)), Y(p[2]) + (good2 ? 16 : -36), {color:col, size:10.5});
        });
        S.draw.text(c, "alcène + " + (re.value === "hbr" ? "HBr" : "H₂O/H⁺"), X(0), Y(20) + 16, {size:10.5, align:"left", weight:700}); S.draw.text(c, "produit", X(1), Y(-30) - 12, {size:10.5, align:"right", weight:700});
        if (al.value === "mb1") S.draw.label(c, "puis glissement d’hydrure : cation 2° → 3°", W / 2, py0 + 12, {color:Pl.green, size:10.5});
      } else {
        var step = {br2:["alcène + Br₂","ion bromonium (pont Br)","attaque anti de Br⁻","dibromure vicinal"],rad:["Br· + alcène","radical le plus stable (3° > 2° > 1°)","H· pris à HBr","bromoalcane anti-Markovnikov"],h2:["alcène + H₂ adsorbés sur Pd","addition syn des 2 H","désorption","alcane"]}[re.value];
        var cols = ph ? 2 : 4, cw = (W - 24 - (cols - 1) * 22) / cols, chh = ph ? 92 : 112;
        step.forEach(function(sx, i){
          var bx = 12 + (i % cols) * (cw + 22), by = py0 + 10 + Math.floor(i / cols) * (chh + 22);
          ctx.save(); ctx.fillStyle = "rgba(31,75,158,.07)"; ctx.strokeStyle = "#1f4b9e"; ctx.lineWidth = 1.6; S.draw.rrect(c, bx, by, cw, chh, 12); ctx.fill(); ctx.stroke(); ctx.restore();
          S.draw.label(c, String(i + 1), bx + 16, by + 16, {color:Pl.mat, size:12});
          wrap(sx, ph ? 16 : 14).forEach(function(line, j, arr){ S.draw.text(c, line, bx + cw / 2, by + chh / 2 + 8 + j * 16 - (arr.length - 1) * 8, {size:12, color:Pl.ink, weight:700}); });
          if (i % cols < cols - 1) S.draw.arrow(c, bx + cw + 3, by + chh / 2, bx + cw + 19, by + chh / 2, Pl.acc, 2.4);
        });
      }
      nt.set("<b>"+REAG[re.value].t+" sur le "+a.n+"</b> ("+a.f+")<br>"+REAG[re.value].m+(ion?"<br><b>Cations possibles :</b> "+a.s+".":""),"");
      var extra = "";
      if (ion && st.ch && st.t >= 0.8) extra = degCat === bestDeg ? "<br>Ton choix donne le cation le plus stable : c’est la voie majoritaire." : "<br>Ton choix donne un cation moins stable : voie minoritaire (traces).";
      nt2.set("<b>Produit majoritaire :</b> "+r[0]+(r[1]?"<br><b>Autre :</b> "+r[1]:"")+extra,"ok");
    });
  }
});

/* ---------- 2. Stabilité des alcènes : chaleurs d’hydrogénation ---------- */
var HYD = {
  c4:[["but-1-ène",-127,"monosubstitué"],["cis-but-2-ène",-120,"disubstitué cis"],["2-méthylpropène",-119,"disubstitué gem"],["trans-but-2-ène",-116,"disubstitué trans"]],
  sub:[["éthène",-137,"non substitué"],["propène",-125,"monosubstitué"],["2-méthylbut-2-ène",-113,"trisubstitué"],["2,3-diméthylbut-2-ène",-111,"tétrasubstitué"]],
  conj:[["cyclohexène",-120,"1 C=C"],["cyclohexa-1,4-diène",-240,"2 C=C isolées"],["cyclohexa-1,3-diène",-232,"2 C=C conjuguées"],["benzène",-208,"aromatique"]]
};
SFA.sim({
  id:"uc-c09-stabilite-hydrogenation", ch:"c09", tag:"Thermochimie",
  titre:"Chaleur d’hydrogénation et stabilité des alcènes",
  resume:"Moins la chaleur d’hydrogénation est exothermique, plus l’alcène est stable : substitution, cis/trans, conjugaison, benzène.",
  but:"Chaque alcène est un niveau d'énergie au-dessus de son alcane : plus la marche vers l'alcane est courte, plus l'alcène est stable. Clique sur un niveau pour le détailler. Pour le benzène, lis l’énergie de résonance.",
  aRetenir:"Alcènes qui donnent le même alcane : ΔH°(hydrogénation) mesure la stabilité relative. Stabilité : tétrasubstitué &gt; trisubstitué &gt; disubstitué &gt; monosubstitué &gt; éthène ; trans &gt; cis (gêne stérique). La conjugaison stabilise de quelques kJ/mol (≈ 8 kJ/mol pour le cyclohexa-1,3-diène, ≈ 15 kJ/mol pour le penta-1,3-diène) ; le benzène l’est bien plus (≈ 150 kJ/mol).",
  piege:"Comparer des alcènes qui ne donnent pas le même alcane (leur ΔH ne se comparent alors pas directement). Confondre « plus stable » et « moins réactif » dans le sens de la vitesse.",
  build:function(k,S){
    var c = k.canvas(420);
    var se = k.seg("Série",[["c4","Isomères C₄H₈ → butane (sauf iso)"],["sub","Degré de substitution"],["conj","Conjugaison et benzène"]],"c4", function(){ st.sel = -1; });
    var ro = k.readouts(["Plus stable","Écart avec le moins stable"]);
    var nt = k.note("","");
    var st = {sel:-1}, hit = [];
    c.pointer(function(type, p){ if (type !== "down") return; hit.forEach(function(h){ if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h){ st.sel = h.i; k.redraw(); } }); });
    function wrap(s, n){ var w = s.split(/(?<=[\s-])/), out = [], cur = ""; w.forEach(function(x){ if ((cur + x).trim().length > n && cur){ out.push(cur.trim()); cur = x; } else cur += x; }); out.push(cur.trim()); return out; }
    k.draw(function(){
      var arr = HYD[se.value], ctx = c.ctx, W = c.W, H = c.H, Pl = S.draw.palette, ph = W < 420, n = arr.length;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var top = 42, base = H - 88, vals = arr.map(function(a){ return a[1]; }), lo = Math.min.apply(null, vals), isConj = se.value === "conj";
      var maxA = isConj ? 260 : -lo + 8, lowCut = isConj ? 0 : Math.floor((-Math.max.apply(null, vals) - 14) / 10) * 10;
      function Y(v){ return base - ((-v) - lowCut) / (maxA - lowCut) * (base - top); }       /* hauteur = |ΔH| au-dessus de l'alcane */
      var lw = 52, rw = W - 14, slot = (rw - lw) / n, bw = Math.min(76, slot - 14);
      /* axe + alcane de référence */
      S.draw.line(c, 46, top - 8, 46, base + 6, "#94a3b8", 1.5);
      S.draw.text(c, "énergie", 50, top - 18, {size:10.5, align:"left", color:Pl.grey, weight:700});
      ctx.save(); ctx.fillStyle = "rgba(36,119,90,.14)"; ctx.fillRect(46, base, W - 54, 5); ctx.restore(); S.draw.line(c, 46, base, W - 8, base, Pl.green, 3);
      if (!isConj){ ctx.save(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, base - 24); ctx.lineTo(46, base - 20); ctx.lineTo(40, base - 16); ctx.lineTo(46, base - 12); ctx.stroke(); ctx.restore(); S.draw.text(c, "axe tronqué", 52, base - 18, {size:9, align:"left", color:Pl.grey, weight:700}); }
      S.draw.text(c, isConj ? "produits saturés (cyclohexane)" : se.value === "c4" ? "butane (+ isobutane pour l'iso)" : "alcane correspondant", W - 10, base + 16, {size:10.5, align:"right", color:Pl.green, weight:800});
      [20, 40, 60, 80, 90, 100, 110, 120, 130, 140, 150, 200, 250].forEach(function(g){ if (g < maxA && g > lowCut + 4 && (isConj ? g % 50 === 0 : g % 10 === 0 && (maxA - lowCut < 60 || g % 20 === 0))){ ctx.save(); ctx.strokeStyle = "#eef1f5"; ctx.beginPath(); ctx.moveTo(46, Y(-g)); ctx.lineTo(W - 8, Y(-g)); ctx.stroke(); ctx.restore(); S.draw.text(c, g + "", 40, Y(-g), {size:9.5, align:"right", color:Pl.grey}); } });
      var best = vals.indexOf(Math.max.apply(null, vals));
      hit = [];
      var cols = [Pl.acc, Pl.amber, Pl.violet, Pl.teal];
      arr.forEach(function(a, i){
        var x = lw + i * slot + (slot - bw) / 2, y = Y(a[1]), sel = st.sel === i, col = isConj ? cols[i] : (i === best ? Pl.green : Pl.acc);
        /* marche d'hydrogénation : flèche vers l'alcane */
        ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col; ctx.fillRect(x, y, bw, base - y); ctx.restore();
        S.draw.arrow(c, x + bw / 2, y + 2, x + bw / 2, base - 3, col, sel ? 3.6 : 2.4);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = sel ? 6 : 4.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + bw, y); ctx.stroke(); ctx.restore();
        S.draw.label(c, "ΔH = " + String(a[1]).replace("-", "−"), x + bw / 2, y - 14, {color:col, size:ph ? 10.5 : 11.5});
        wrap(a[0], ph ? 10 : 14).forEach(function(line, j){ S.draw.text(c, line, x + bw / 2, base + 28 + j * 11, {size:ph ? 9 : 10.5, color:sel ? Pl.ink : "#334155", weight:sel ? 800 : 700}); });
        wrap(a[2], ph ? 11 : 15).forEach(function(l2, j2){ S.draw.text(c, l2, x + bw / 2, H - 22 + j2 * 10, {size:9, color:Pl.grey, weight:600}); });
        hit.push({i:i, x:x - 6, y:Math.min(y, base - 30) - 20, w:bw + 12, h:base - y + 40});
        if (sel){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); S.draw.rrect(c, x - 6, y - 26, bw + 12, base - y + 70, 8); ctx.stroke(); ctx.restore(); }
      });
      if (isConj){
        /* énergie de résonance du benzène : trois C=C isolées attendues (−360) ou ici 3 × cyclohexène */
        var bx = lw + 3 * slot + (slot - bw) / 2, yb = Y(-208), ye = Y(-260);
        S.draw.line(c, bx - 10, ye, bx + bw + 10, ye, Pl.red, 2, [4, 3]);
        S.draw.label(c, "attendu 3×C=C : −360 (hors cadre)", bx + bw / 2, top - 4, {color:Pl.red, size:ph ? 9.5 : 10.5});
      }
      var sel2 = st.sel >= 0 ? arr[st.sel] : null;
      if (isConj){
        ro.set(0,"—"); ro.set(1,"—");
        nt.set((sel2 ? "<b>" + sel2[0] + "</b> (" + sel2[2] + ") : ΔH = " + sel2[1] + " kJ/mol.<br>" : "") + "<b>Énergie de résonance du benzène :</b> 3 × ΔH(cyclohexène) = 3 × (−120) = −360 kJ/mol attendus pour trois C=C isolées ; mesuré −208 kJ/mol ; stabilisation ≈ <b>152 kJ/mol</b>.<br><b>Conjugaison :</b> 2 × (−120) = −240 attendus pour 2 C=C isolées ; cyclohexa-1,3-diène (−232) est stabilisé d’≈ 8 kJ/mol par rapport au cyclohexa-1,4-diène (−240).","ok");
      } else {
        ro.set(0, arr[best][0]); ro.set(1, S.fmt(Math.max.apply(null, vals) - Math.min.apply(null, vals), 0) + " kJ/mol");
        nt.set((sel2 ? "<b>" + sel2[0] + "</b> (" + sel2[2] + ") : " + sel2[1] + " kJ/mol, soit " + S.fmt(sel2[1] - Math.max.apply(null, vals), 0) + " kJ/mol de plus que l'alcène le plus stable.<br>" : "") + (se.value === "c4" ? "Les quatre isomères C₄H₈ ne donnent pas tous le butane : l’isobutène donne l’isobutane. Les trois autres (but-1-ène, cis et trans-but-2-ène) donnent le même butane : leurs ΔH se comparent directement (trans la plus stable)." : "Plus la liaison double est substituée, moins l’hydrogénation dégage d’énergie : l’alcène de départ est déjà plus stable (hyperconjugaison avec les C–H voisins). Les alcanes formés ne sont pas identiques : la comparaison est indicative."), "");
      }
    });
    k.note("Valeurs expérimentales approchées en phase gazeuse (arrondies au kJ/mol) ; l’ordre est solide, les chiffres peuvent différer de 1 à 3 kJ/mol selon les sources.","");
  }
});

/* ---------- 3. Stéréochimie de l’addition ---------- */
SFA.sim({
  id:"uc-c09-stereochimie-addition", ch:"c09", tag:"Stéréospécificité",
  titre:"Addition syn ou anti : méso ou racémique ?",
  resume:"Br₂ (anti) et dihydroxylation (syn) sur un alcène cis ou trans : quel stéréoisomère obtient-on ?",
  but:"Choisis la géométrie de l’alcène, le mode d’addition et la probabilité d’attaque par la face supérieure, puis lance des molécules : chaque attaque est tirée au hasard et le bilan se construit sous tes yeux.",
  aRetenir:"Alcène cis + addition anti → racémique (R,R + S,S) ; trans + anti → méso (R,S). Alcène cis + addition syn → méso ; trans + syn → racémique. La réaction est stéréospécifique : l’alcène (Z ou E) détermine le stéréoisomère. Un mélange racémique est optiquement inactif (ee = 0) ; un méso aussi (plan de symétrie interne).",
  piege:"Dire que « méso = racémique » : le méso est UNE molécule achirale, le racémique est un mélange 50/50 de deux énantiomères. Une face d’attaque ne donne un excès que si les deux faces ne sont pas équivalentes (réactif chiral) : sans cela p = 50 % et ee = 0.",
  build:function(k,S){
    var c = k.canvas(440);
    var al = k.seg("Alcène",[["cis","cis-but-2-ène"],["trans","trans-but-2-ène"],["cy","cyclohexène"]],"cis", function(){ cnt = {a:0, b:0, m:0}; last = null; });
    var mo = k.seg("Addition",[["anti","anti (Br₂)"],["syn","syn (OsO₄ ou KMnO₄ froid : diol)"]],"anti", function(){ cnt = {a:0, b:0, m:0}; last = null; });
    var p = k.slider("Probabilité d’attaque par la face supérieure",0,100,5,50,"%");
    var ro = k.readouts(["Produit","Pouvoir rotatoire","Excès énantiomérique"]);
    var nt = k.note("","");
    var cnt = {a:0, b:0, m:0}, last = null, anim = 0, tt = 0;
    function shoot(){
      var cisLike = al.value !== "trans", anti = mo.value === "anti", racemic = (cisLike === anti), top = Math.random() < p.value / 100;
      var kind = racemic ? (top ? "a" : "b") : "m"; cnt[kind]++; last = {top:top, kind:kind}; anim = 0;
    }
    for (var i0 = 0; i0 < 24; i0++) shoot(); anim = 1; last = null;
    k.button("Lancer 1 molécule", function(){ shoot(); }, true);
    k.button("Lancer 100 molécules", function(){ for (var i = 0; i < 100; i++) shoot(); });
    k.button("Remettre à zéro", function(){ cnt = {a:0, b:0, m:0}; last = null; });
    var lp = k.loop(function(dt, t){ tt = t; if (anim < 1) anim = Math.min(1, anim + dt * 1.6); k.redraw(); }); lp.play();
    k.draw(function(){
      var ctx = c.ctx, Pl = S.draw.palette, W = c.W, H = c.H, ph = W < 420, cisLike = al.value !== "trans", anti = mo.value === "anti";
      UC.bg(c, "#f6f9fc", "#ffffff");
      /* alcène vu de dessus, avec le réactif qui arrive par le dessus / le dessous */
      var cx = W / 2, cy = 120, d = 58, C1 = [cx - d / 2, cy], C2 = [cx + d / 2, cy], up = cisLike ? -1 : 1, big = al.value === "cy" ? "CH₂" : "CH₃";
      S.draw.line(c, C1[0], C1[1] - 3.5, C2[0], C2[1] - 3.5, "#475569", 3.4); S.draw.line(c, C1[0], C1[1] + 3.5, C2[0], C2[1] + 3.5, "#475569", 3.4);
      function sub(x0, y0, dx, dy, l){ S.draw.line(c, x0, y0, x0 + dx, y0 + dy, "#64748b", 3); S.draw.text(c, l, x0 + dx * 1.35, y0 + dy * 1.35, {size:12.5, weight:700}); }
      sub(C1[0], C1[1], -34, -26, big); sub(C1[0], C1[1], -34, 26, "H"); sub(C2[0], C2[1], 34, up * 26, big); sub(C2[0], C2[1], 34, -up * 26, "H");
      UC.ball(ctx, C1[0], C1[1], 12, "#4b5563"); UC.ball(ctx, C2[0], C2[1], 12, "#4b5563");
      var reag = anti ? "Br" : "OH";
      /* face du dessus (bleue) et face du dessous (rouge) : le plus probable est plus épais */
      var pt = p.value / 100;
      S.draw.text(c, "face du dessus", cx, 14, {size:11, color:Pl.acc, weight:800}); S.draw.text(c, "face du dessous", cx, cy + 108, {size:11, color:Pl.red, weight:800});
      var wU = 1.6 + 4 * pt, wD = 1.6 + 4 * (1 - pt);
      S.draw.arrow(c, C1[0] - 4, 26, C1[0] - 4, cy - 26, Pl.acc, wU);
      if (anti) S.draw.arrow(c, C2[0] + 4, cy + 96, C2[0] + 4, cy + 26, Pl.red, wD); else S.draw.arrow(c, C2[0] + 4, 26, C2[0] + 4, cy - 26, Pl.acc, wU);
      S.draw.text(c, reag + (anti ? "  (1ʳᵉ attaque : dessus)" : "  (les 2 du même côté)"), C1[0] - 4, 36, {size:10.5, color:Pl.acc, align:"right", weight:700});
      /* animation de la dernière molécule : le réactif descend du côté tiré */
      if (last && anim < 1){ var ya = last.top ? 26 + (cy - 52) * anim : cy + 96 - (cy + 96 - cy - 26) * anim; UC.ball(ctx, C1[0] - 4, last.top ? ya : cy + 96 - (70) * anim, 9, anti ? "#9a2a1c" : "#d6392f"); S.draw.text(c, reag, C1[0] - 4, (last.top ? ya : cy + 96 - 70 * anim) + 0.5, {size:9, color:"#fff", weight:800}); }
      /* bilan : histogramme des produits */
      var by0 = cy + 138, bh = H - by0 - 26, racemic = (cisLike === anti), tot = cnt.a + cnt.b + cnt.m;
      var items = racemic ? [["(R,R)", cnt.a, Pl.acc, pt], ["(S,S)", cnt.b, Pl.red, 1 - pt]] : [["méso (R,S)", cnt.m, Pl.green, 1]];
      var maxc = Math.max(10, items.reduce(function(m, it){ return Math.max(m, it[1]); }, 0));
      var bw = Math.min(110, (W - 60) / (items.length + 0.4)), gx = (W - items.length * bw - (items.length - 1) * 30) / 2;
      S.draw.line(c, 30, by0 + bh, W - 30, by0 + bh, "#94a3b8", 1.4);
      items.forEach(function(it, i){
        var x = gx + i * (bw + 30), h = it[1] / maxc * (bh - 16), exp = tot ? it[3] * tot / maxc * (bh - 16) : 0;
        ctx.save(); ctx.fillStyle = it[2]; ctx.globalAlpha = 0.85; S.draw.rrect(c, x, by0 + bh - h, bw, Math.max(h, 1), 5); ctx.fill(); ctx.restore();
        if (tot > 0){ S.draw.line(c, x - 4, by0 + bh - exp, x + bw + 4, by0 + bh - exp, Pl.ink, 1.6, [4, 3]); }
        S.draw.text(c, it[1] + (tot ? " (" + S.fmt(it[1] / tot * 100, 0) + " %)" : ""), x + bw / 2, by0 + bh - h - 10, {size:11.5, color:it[2], weight:800});
        S.draw.text(c, it[0], x + bw / 2, by0 + bh + 14, {size:12, color:Pl.ink, weight:800});
      });
      S.draw.text(c, tot ? "pointillés : proportion attendue (" + S.fmt(pt * 100, 0) + " / " + S.fmt(100 - pt * 100, 0) + " %)" : "lance des molécules : chaque attaque tire la face au hasard", W / 2, by0 - 8, {size:10.5, color:Pl.grey, weight:700});
      var ee = racemic && tot ? Math.abs(cnt.a - cnt.b) / tot : (racemic ? Math.abs(2 * pt - 1) : 0), prod = racemic ? "racémique (R,R) + (S,S)" : "méso (R,S)";
      if (al.value === "cy" && anti) prod = "trans-1,2-dibromocyclohexane : racémique (R,R) + (S,S)";
      if (al.value === "cy" && !anti) prod = "cis-cyclohexane-1,2-diol : méso (R,S)";
      ro.set(0, prod); ro.set(1, racemic ? (ee < 0.001 ? "nul (mélange 50/50)" : "non nul") : "nul (méso, achiral)");
      ro.set(2, racemic ? S.fmt(ee * 100, 0) + " %" : "sans objet");
      var what = anti ? "dibromure" : "diol";
      nt.set(racemic ? ("Les deux faces sont équivalentes pour l’alcène plan : les deux énantiomères se forment dans les proportions " + S.fmt(p.value, 0) + " % / " + S.fmt(100 - p.value, 0) + " %. Avec un réactif et un milieu achiraux, p = 50 % : produit racémique." + (p.value !== 50 ? " Un excès ne serait possible qu’avec un réactif ou un catalyseur chiral." : "")) : ("Le " + what + " obtenu est la forme méso, quel que soit le côté de l’attaque : les deux « faces » donnent la même molécule (plan de symétrie interne). Le curseur n’a pas d’effet."), racemic ? "" : "ok");
    });
    k.note("Dessin : l’alcène est vu de dessus (les substituants sont dans le plan de la page) ; le réactif approche de la face du dessus ou du dessous.","");
  }
});

/* ---------- 4. Entraîneur de prédiction ---------- */
var QB = [
  {q:"HBr + propène (sans peroxyde)",c:["1-bromopropane","2-bromopropane","1,2-dibromopropane","propane"],b:1,e:"Markovnikov : le cation secondaire se forme préférentiellement ; Br⁻ attaque le carbone 2."},
  {q:"H₂O / H⁺ + 2-méthylbut-2-ène",c:["3-méthylbutan-2-ol","2-méthylbutan-1-ol","2-méthylbutan-2-ol","pentan-2-ol"],b:2,e:"Protonation sur C3 (le CH) pour donner le cation tertiaire en C2 ; H₂O attaque C2 : alcool tertiaire."},
  {q:"Br₂ + cyclohexène",c:["cis-1,2-dibromocyclohexane","trans-1,2-dibromocyclohexane (racémique)","1,1-dibromocyclohexane","3-bromocyclohexène"],b:1,e:"Ion bromonium puis attaque anti de Br⁻ : trans, racémique (les deux faces sont équivalentes)."},
  {q:"HBr + peroxydes (ROOR) + propène",c:["2-bromopropane","1-bromopropane","propan-1-ol","1,2-dibromopropane"],b:1,e:"Mécanisme radicalaire : Br· va sur le C le moins substitué, formant le radical secondaire : anti-Markovnikov."},
  {q:"HBr + 3-méthylbut-1-ène (produit majoritaire)",c:["1-bromo-3-méthylbutane","2-bromo-3-méthylbutane","2-bromo-2-méthylbutane","2-bromopentane"],b:2,e:"Le cation secondaire se transpose par glissement d’hydrure en cation tertiaire, plus stable ; Br⁻ attaque ce dernier."},
  {q:"HBr + 1-méthylcyclohexène",c:["1-bromo-1-méthylcyclohexane","2-bromo-1-méthylcyclohexane","(bromométhyl)cyclohexane","3-bromo-1-méthylcyclohexène"],b:0,e:"H sur le carbone le plus hydrogéné (C2), le cation tertiaire sur C1 est attaqué par Br⁻."},
  {q:"1) BH₃·THF puis 2) H₂O₂, NaOH + propène",c:["propan-2-ol","propan-1-ol","propane-1,2-diol","propanal"],b:1,e:"Hydroboration-oxydation : anti-Markovnikov, addition syn, sans carbocation ni transposition."},
  {q:"1) Hg(OAc)₂, H₂O puis 2) NaBH₄ + 3,3-diméthylbut-1-ène",c:["2,3-diméthylbutan-2-ol (transposition)","3,3-diméthylbutan-2-ol","3,3-diméthylbutan-1-ol","2,2-diméthylbutane"],b:1,e:"L’oxymercuration-démercuration est de Markovnikov et sans transposition (ion mercurinium). L’hydratation acide, elle, donnerait l’alcool transposé."},
  {q:"Br₂ + trans-but-2-ène (addition anti)",c:["(2R,3R)-2,3-dibromobutane seul","mélange racémique","2,3-dibromobutane méso","1,2-dibromobutane"],b:2,e:"Anti sur trans : on obtient la forme méso (R,S), achirale."},
  {q:"H₂, Pd/C + but-1-ène",c:["butane","but-2-ène","butan-1-ol","1,2-dibromobutane"],b:0,e:"Hydrogénation catalytique : l’alcane correspondant, addition syn des deux H sur la même face."}
];
SFA.sim({
  id:"uc-c09-entraineur-additions", ch:"c09", tag:"Entraînement",
  titre:"Entraîneur : prédire le produit (10 questions)",
  resume:"Dix cas de type examen : Markovnikov, anti-Markovnikov, transposition, stéréochimie.",
  but:"Observe le schéma de la réaction (alcène, réactif, conditions), choisis A, B, C ou D, puis lis l’explication. Le score se cumule ; la question suivante te propose un autre cas.",
  aRetenir:"Avant de répondre : (1) cation ou pas de cation ? (2) transposition possible ? (3) mode syn ou anti ? (4) régiochimie de Markovnikov ou inverse ?",
  piege:"Appliquer « Markovnikov » partout. Les peroxydes n’inversent que HBr. L’hydroboration et l’oxymercuration évitent les transpositions.",
  build:function(k,S){
    var i=0, ok=0, tot=0, done=false, hist=[], chosen=-1;
    var c = k.canvas(260);
    /* squelettes des alcènes : atomes [x, y] et liaisons [i, j, ordre] (x : 0-110, y : 0-80) */
    function hexa(dbl, me){ var at = [], b = [], r; for (r = 0; r < 6; r++){ var a = -Math.PI / 2 + r * Math.PI / 3; at.push([55 + 32 * Math.cos(a), 45 + 32 * Math.sin(a)]); } for (r = 0; r < 6; r++) b.push([r, (r + 1) % 6, r === 0 ? 2 : 1]); if (me){ at.push([55 + 32 * Math.cos(-Math.PI / 2) , 45 - 32 - 18]); b.push([0, 6, 1]); } return {at:at, b:b}; }
    var SK = [
      {at:[[0,40],[40,15],[80,40]], b:[[0,1,1],[1,2,2]]},
      {at:[[0,12],[34,38],[0,64],[74,38],[108,14]], b:[[1,0,1],[1,2,1],[1,3,2],[3,4,1]]},
      hexa(true,false),
      {at:[[0,40],[40,15],[80,40]], b:[[0,1,1],[1,2,2]]},
      {at:[[0,45],[34,25],[72,45],[108,25],[72,80]], b:[[0,1,2],[1,2,1],[2,3,1],[2,4,1]]},
      hexa(true,true),
      {at:[[0,40],[40,15],[80,40]], b:[[0,1,1],[1,2,2]]},
      {at:[[0,50],[34,30],[72,50],[72,12],[108,66],[34,72]], b:[[0,1,2],[1,2,1],[2,3,1],[2,4,1],[2,5,1]]},
      {at:[[0,55],[36,32],[76,55],[112,32]], b:[[0,1,1],[1,2,2],[2,3,1]]},
      {at:[[0,55],[36,32],[76,55],[112,32]], b:[[0,1,2],[1,2,1],[2,3,1]]}
    ];
    var q = k.note("","","stage");
    var fb = k.note("","");
    var ans = k.seg("Ta réponse",[["0","A"],["1","B"],["2","C"],["3","D"]],undefined,function(v){
      if (done) return; done=true; tot++; chosen = Number(v); var qq=QB[i]; var good=chosen===qq.b; if (good) ok++; hist[i] = good ? 1 : 0;
      fb.set((good?"✅ <b>Bonne réponse.</b> ":"❌ <b>Pas tout à fait.</b> Bonne réponse : "+"ABCD"[qq.b]+". ")+qq.e,good?"ok":"warn"); upd();
    });
    ans.set(null);
    var ro = k.readouts(["Bonnes réponses","Questions traitées"]);
    k.button("Question suivante",function(){ i=(i+1)%QB.length; done=false; chosen=-1; fb.set("","" ); ans.set(undefined); show(); },true);
    function upd(){ ro.set(0,String(ok)); ro.set(1,String(tot)); }
    function show(){ var qq=QB[i]; q.set("<b>Question "+(i+1)+" / "+QB.length+" : "+qq.q+"</b><br>"+qq.c.map(function(x,j){ return "<b>"+"ABCD"[j]+".</b> "+x; }).join("<br>"),""); upd(); }
    function wrap(s,n){ var w=s.split(" "), out=[], cur=""; w.forEach(function(x){ if ((cur+" "+x).trim().length>n && cur){ out.push(cur.trim()); cur=x; } else cur+=" "+x; }); out.push(cur.trim()); return out; }
    k.draw(function(){
      var ctx = c.ctx, Pl = S.draw.palette, W = c.W, H = c.H, ph = W < 420, qq = QB[i], sk = SK[i], cut = qq.q.lastIndexOf(" + "), reag = cut > 0 ? qq.q.slice(0, cut) : qq.q, alc = cut > 0 ? qq.q.slice(cut + 3) : "";
      UC.bg(c, "#f6f9fc", "#ffffff");
      /* progression */
      for (var d = 0; d < QB.length; d++){ var x = 14 + d * ((W - 28) / QB.length); ctx.fillStyle = d === i ? Pl.mat : hist[d] === 1 ? Pl.green : hist[d] === 0 ? Pl.red : "#e3e7ed"; S.draw.rrect(c, x, 10, (W - 28) / QB.length - 4, 6, 3); ctx.fill(); }
      /* réactif : squelette à gauche */
      var bx = 10, bw = ph ? 118 : 150, by = 50, bh = 110, sc = Math.min((bw - 10) / 112, 1.05), ox = bx + (bw - 112 * sc) / 2 + 4, oy = by + (bh - 90 * sc) / 2 + 4;
      ctx.save(); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#d3dae3"; ctx.lineWidth = 1.4; S.draw.rrect(c, bx, by, bw, bh, 12); ctx.fill(); ctx.stroke(); ctx.restore();
      sk.b.forEach(function(b){ var p1 = sk.at[b[0]], p2 = sk.at[b[1]], x1 = ox + p1[0] * sc, y1 = oy + p1[1] * sc, x2 = ox + p2[0] * sc, y2 = oy + p2[1] * sc, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * 2.8, ny = dx / L * 2.8;
        if (b[2] === 2){ S.draw.line(c, x1 + nx, y1 + ny, x2 + nx, y2 + ny, "#334155", 2.8); S.draw.line(c, x1 - nx, y1 - ny, x2 - nx, y2 - ny, "#334155", 2.8); } else S.draw.line(c, x1, y1, x2, y2, "#334155", 2.8); });
      wrap(alc, ph ? 16 : 24).slice(0, 2).forEach(function(l, j){ S.draw.text(c, l, bx + bw / 2, by + bh + 14 + j * 13, {size:10.5, color:Pl.grey, weight:700}); });
      /* flèche et réactif */
      var ax0 = bx + bw + 10, ax1 = W - (ph ? 126 : 166);
      S.draw.arrow(c, ax0, by + bh / 2, ax1, by + bh / 2, Pl.ink, 3);
      wrap(reag, Math.max(10, Math.floor((ax1 - ax0) / 7))).forEach(function(line, j, arr){ S.draw.text(c, line, (ax0 + ax1) / 2, by + bh / 2 - 14 - (arr.length - 1 - j) * 14, {size:ph ? 11 : 12, color:Pl.mat, weight:800}); });
      /* produit : point d'interrogation ou réponse choisie */
      var px = ax1 + 10, pw = W - px - 10, good = chosen === qq.b;
      ctx.save(); ctx.fillStyle = done ? (good ? "rgba(36,119,90,.10)" : "rgba(192,50,29,.08)") : "#fff"; ctx.strokeStyle = done ? (good ? Pl.green : Pl.red) : "#cbd5e1"; ctx.lineWidth = 2; if (!done) ctx.setLineDash([6, 4]); S.draw.rrect(c, px, by, pw, bh, 12); ctx.fill(); ctx.stroke(); ctx.restore();
      if (!done) S.draw.text(c, "?", px + pw / 2, by + bh / 2, {size:44, color:"#94a3b8", weight:800});
      else wrap(qq.c[qq.b], ph ? 12 : 16).forEach(function(line, j, arr){ S.draw.text(c, line, px + pw / 2, by + bh / 2 + j * 15 - (arr.length - 1) * 7.5, {size:ph ? 11 : 12.5, color:Pl.green, weight:800}); });
      if (done) S.draw.label(c, good ? "Bien joué" : "Réponse : " + "ABCD"[qq.b], W / 2, by + bh + 52, {color:good ? Pl.green : Pl.red, size:12.5});
      else S.draw.text(c, "Quel est le produit majoritaire ?", W / 2, by + bh + 52, {size:12.5, color:Pl.ink, weight:800});
      show();
    });
  }
});

/* ---------- 5. Indice d’iode ---------- */
var TG = {sat:{n:"saturés (tripalmitine)",M:807.32,d:0},ole:{n:"trioléine (acide oléique, 1 C=C)",M:885.43,d:3},lin:{n:"trilinoléine (acide linoléique, 2 C=C)",M:879.38,d:6},lnc:{n:"trilinolénine (acide linolénique, 3 C=C)",M:873.33,d:9}};
var MI2=253.81;
function iv(key){ return 100*MI2*TG[key].d/TG[key].M; }
var PRESETS={coco:[92,6,2,0],olive:[15,75,9,1],tournesol:[10,25,64,1],lin:[10,20,15,55]};
SFA.sim({
  id:"uc-c09-indice-iode", ch:"c09", tag:"Lipides",
  titre:"Indice d’iode : mesurer l’insaturation d’une huile",
  resume:"Fixation de I₂ sur les C=C d’un mélange de triglycérides : l’indice d’iode et l’hydrogénation d’une margarine.",
  but:"Compose une huile (fraction massique de chaque triglycéride) ou choisis un exemple. L’indice d’iode (g de I₂ fixés par 100 g de matière grasse) mesure le nombre de liaisons C=C ; en déduis le volume de H₂ à fixer pour la durcir.",
  aRetenir:"I₂ s’additionne sur C=C comme Br₂ : 1 mol de I₂ par mole de C=C. Indice d’iode = 100 × n(C=C) × M(I₂)/M(graisse) (par 100 g). Trioléine ≈ 86 ; trilinoléine ≈ 173 ; trilinolénine ≈ 262. Les huiles liquides (insaturées) ont un indice élevé ; les graisses solides (saturées), un indice faible.",
  piege:"Compter les C=C par triglycéride (3 chaînes !) : la trioléine a 3 C=C, pas 1. Confondre indice d’iode (g I₂/100 g) et quantité de matière. Modèle simplifié : on ignore les chaînes autres que ces 4 types et les isomères trans.",
  build:function(k,S){
    var c = k.canvas(280);
    var pr = k.select("Exemple",[["","personnalisé"],["coco","coco (saturée)"],["olive","olive"],["tournesol","tournesol"],["lin","lin"]],"",function(v){ if (PRESETS[v]){ PRESETS[v].forEach(function(x,i){ sl[i].set(x); }); } });
    var sl=[ k.slider("Saturés",0,100,1,15,"%"), k.slider("Trioléine (C18:1)",0,100,1,75,"%"), k.slider("Trilinoléine (C18:2)",0,100,1,9,"%"), k.slider("Trilinolénine (C18:3)",0,100,1,1,"%") ];
    var ro = k.readouts(["Indice d’iode","C=C pour 100 g","H₂ pour 100 g (25 °C, 1 atm)"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, keys=["sat","ole","lin","lnc"];
      var w=sl.map(function(s){ return s.value; }), tot=w[0]+w[1]+w[2]+w[3];
      if (tot<=0){ ro.set(0,"—"); ro.set(1,"—"); ro.set(2,"—"); nt.set("Mets au moins un composant.","warn"); return; }
      var f=w.map(function(x){ return x/tot; }), IV=0, nCC=0;
      keys.forEach(function(key,i){ IV+=f[i]*iv(key); nCC+=f[i]*100/TG[key].M*TG[key].d; });
      var VH=nCC*0.0821*298;
      /* barres des composants et échelle de l'indice */
      var ax=S.draw.axes(c,{x0:0,x1:4,y0:0,y1:280,xl:"",yl:"indice d’iode",stepX:100,hideZero:true,stepY:50,l:50});
      var cols=[P().grey,P().acc,P().amber,P().violet], nm=["saturés","trioléine","trilinoléine","trilinolénine"];
      keys.forEach(function(key,i){ var x0=ax.X(i+0.15), x1=ax.X(i+0.85); ctx.save(); ctx.fillStyle=cols[i]; ctx.globalAlpha=0.35; ctx.fillRect(x0,ax.Y(iv(key)),x1-x0,ax.Y(0)-ax.Y(iv(key))); ctx.restore(); S.draw.text(c,nm[i]+" : "+S.fmt(iv(key),0),(x0+x1)/2,ax.Y(iv(key))-9,{size:11,color:cols[i]}); });
      S.draw.line(c,ax.L,ax.Y(IV),ax.R,ax.Y(IV),P().red,2.4,[6,4]); S.draw.text(c,"mélange : "+S.fmt(IV,0),ax.R-6,ax.Y(IV)-10,{align:"right",size:12,color:P().red});
      ro.set(0,S.fmt(IV,0)+" g I₂/100 g"); ro.set(1,S.fmt(nCC*1000,0)+" mmol"); ro.set(2,S.fmt(VH,2)+" L");
      nt.set(IV<20?"Graisse solide à température ambiante (très saturée).":IV<100?"Huile peu à moyennement insaturée (type olive, indice ≈ 75 – 90).":IV<150?"Huile très insaturée (type tournesol).":"Huile « siccative » très insaturée : s’oxyde et durcit à l’air (type lin).","");
    });
    k.note("M(I₂) = 253,81 g/mol. Indices de référence par triglycéride homogène : 0 ; 86,0 ; 173,2 ; 261,6.","");
  }
});
})();
