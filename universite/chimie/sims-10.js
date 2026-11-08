/* Chimie BA1 · compléments · chapitre 10 : alcools, carbonyles, acides et dérivés */
(function(){
var P = function(){ return SFA.draw.palette; };

/* ---------- 1. Alcools : oxydation, déshydratation, substitution ---------- */
var ALC = {
  et:{n:"éthanol",c:"primaire",no:-1,ox:["éthanal","acide éthanoïque"],de:["éthène","E1/E2 : à 170 °C ; à 140 °C : éther (CH₃CH₂)₂O"],hx:["bromoéthane","SN2 (H⁺ protonne OH, Br⁻ déplace H₂O)"]},
  p1:{n:"propan-1-ol",c:"primaire",no:-1,ox:["propanal","acide propanoïque"],de:["propène","E1/E2 à chaud, H₂SO₄ concentré"],hx:["1-bromopropane","SN2"]},
  p2:{n:"propan-2-ol",c:"secondaire",no:0,ox:["propanone (acétone)",null],de:["propène","E1 (cation secondaire)"],hx:["2-bromopropane","SN1/SN2 mixte"]},
  b2:{n:"butan-2-ol",c:"secondaire",no:0,ox:["butanone",null],de:["but-2-ène (majoritaire, Zaitsev, surtout trans) + but-1-ène","E1 : alcène le plus substitué favorisé"],hx:["2-bromobutane (racémique)","SN1/SN2 : mélange des deux énantiomères"]},
  cy:{n:"cyclohexanol",c:"secondaire",no:0,ox:["cyclohexanone",null],de:["cyclohexène","E1"],hx:["bromocyclohexane","SN1/SN2"]},
  t:{n:"2-méthylpropan-2-ol",c:"tertiaire",no:1,ox:[null,null],de:["2-méthylpropène","E1 : cation tertiaire, très facile (déjà à ≈ 50 °C avec H₂SO₄ dilué)"],hx:["2-bromo-2-méthylpropane","SN1 : le plus rapide (cation tertiaire), à froid"]}
};
SFA.sim({
  id:"uc-c10-alcools-reactivite", ch:"c10", tag:"Alcools",
  titre:"Alcools primaire, secondaire, tertiaire : qui réagit comment ?",
  resume:"Oxydation douce ou forte, déshydratation, substitution par HBr : produit et nombre d’oxydation du carbone.",
  but:"Choisis un alcool et un réactif. L’échelle d’oxydation montre où le carbone portant OH s’arrête ; la classe de l’alcool (nombre de H sur ce carbone) décide de tout.",
  aRetenir:"Primaire : alcool → aldéhyde (PCC, ménagé) → acide (oxydant fort). Secondaire : alcool → cétone, s’arrête. Tertiaire : pas d’oxydation (pas de H sur C–OH). Déshydratation (H₂SO₄, chaleur) : Zaitsev, E1. HBr : 3° par SN1 (rapide), 1° par SN2.",
  piege:"Oxyder un alcool tertiaire. Croire qu’un oxydant fort s’arrête à l’aldéhyde (il va à l’acide, car l’aldéhyde s’hydrate et s’oxyde plus vite). Oublier que les produits de substitution/élimination d’un cation sont en compétition.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:0.95});
    var al = k.select("Alcool",[["et","éthanol (1°)"],["p1","propan-1-ol (1°)"],["p2","propan-2-ol (2°)"],["b2","butan-2-ol (2°)"],["cy","cyclohexanol (2°)"],["t","2-méthylpropan-2-ol (3°)"]],"et");
    var re = k.select("Réactif",[["pcc","PCC (oxydation ménagée)"],["jones","CrO₃/H₂SO₄ ou KMnO₄ chaud (oxydation forte)"],["de","H₂SO₄ concentré, chaleur"],["hx","HBr concentré"]],"pcc");
    var nt = k.note("","");
    var nt2 = k.note("","ok");
    var st = {t:1, key:""};
    var lp = k.loop(function(dt){ if (st.t < 1){ st.t = Math.min(1, st.t + dt / 1.0); k.redraw(); } }); lp.play();
    var CL = {primaire:["R","H","H"], secondaire:["R","R","H"], tertiaire:["R","R","R"]};
    /* carbone central : haut = groupe fonctionnel, gauche / droite / bas = substituants */
    function atom(c, x, y, lab, col, r, tc){ var ctx = c.ctx; UC.ball(ctx, x, y, r, col); S.draw.text(c, lab, x, y, {size:r > 12 ? 12 : 10.5, color:tc || "#fff"}); }
    function mol(c, cx, cy, subs, top, alpha, hot){
      var ctx = c.ctx, P = S.draw.palette, d = 38; ctx.save(); ctx.globalAlpha = alpha;
      var pos = [[-d, 0], [d, 0], [0, d]], dbl = top.dbl;
      pos.forEach(function(p, i){ if (subs[i] == null) return; UC.stick(ctx, cx, cy, cx + p[0], cy + p[1], 5, "#9aa5b1"); });
      if (top.t){
        if (dbl){ UC.stick(ctx, cx - 4, cy, cx - 4, cy - d, 4, "#9aa5b1"); UC.stick(ctx, cx + 4, cy, cx + 4, cy - d, 4, "#9aa5b1"); }
        else UC.stick(ctx, cx, cy, cx, cy - d, 5, "#9aa5b1");
      }
      pos.forEach(function(p, i){ var s = subs[i]; if (s == null) return; if (s === "H") atom(c, cx + p[0], cy + p[1], "H", "#e6ebf2", 9, "#0f1b2d"); else if (s === "OH") atom(c, cx + p[0], cy + p[1], "OH", "#d6392f", 12); else atom(c, cx + p[0], cy + p[1], "R", "#6b7787", 12); });
      atom(c, cx, cy, "C", "#3b4655", 14);
      if (top.t) atom(c, cx, cy - d, top.t, top.col, 13);
      ctx.restore();
      if (hot){ ctx.save(); ctx.globalAlpha = alpha; subs.forEach(function(s, i){ if (s === "H"){ ctx.strokeStyle = S.draw.palette.amber; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(cx + pos[i][0], cy + pos[i][1], 14, 0, 7); ctx.stroke(); } }); ctx.restore(); }
    }
    k.draw(function(){
      var a = ALC[al.value], r = re.value, W = c.W, H = c.H, ctx = c.ctx, P = S.draw.palette;
      var key = al.value + r; if (key !== st.key){ st.key = key; st.t = 0; lp.play(); }
      UC.bg(c, "#f8fafd", "#ffffff");
      var subs = CL[a.c].slice(), nH = subs.filter(function(s){ return s === "H"; }).length;
      S.draw.label(c, "alcool " + a.c + " · " + nH + " H sur le carbone C–OH", W / 2, 20, {color:nH ? P.green : P.red, size:12});
      var cx1 = W * 0.24, cx2 = W * 0.76, cy = 96, e = st.t * st.t * (3 - 2 * st.t);
      var oxi = (r === "pcc" || r === "jones"), prod = null, topP = null, subsP = subs.slice(), reach = 0, nothing = false;
      var s1 = subs.slice(); s1 = [s1[0], s1[1], s1[2]];
      mol(c, cx1, cy, subs, {t:"OH", col:"#d6392f"}, 1, oxi);
      var pname = "", no2 = null;
      if (oxi){
        reach = (r === "pcc") ? (a.c === "tertiaire" ? 0 : 1) : (a.c === "primaire" ? 2 : a.c === "secondaire" ? 1 : 0);
        if (a.c === "tertiaire") nothing = true;
        else if (reach === 2){ topP = {t:"O", col:"#d6392f", dbl:true}; subsP = ["R", "OH", null]; pname = a.ox[1]; no2 = 3; }
        else { topP = {t:"O", col:"#d6392f", dbl:true}; subsP = a.c === "primaire" ? ["R", "H", null] : ["R", "R", null]; pname = a.ox[0]; no2 = a.c === "primaire" ? 1 : 2; }
      } else if (r === "de"){ pname = a.de[0]; topP = {t:null}; }
      else { topP = {t:"Br", col:"#9a2a1c"}; subsP = subs.slice(); pname = a.hx[0]; }
      /* flèche et réactif */
      var rl = {pcc:"PCC", jones:"CrO₃ / H⁺", de:"H₂SO₄, Δ", hx:"HBr"}[r];
      S.draw.arrow(c, W * 0.40, cy, W * 0.60, cy, nothing ? "#cbd1d9" : P.acc, 3);
      S.draw.label(c, rl, W / 2, cy - 18, {color:P.acc, size:11});
      if (r === "jones" && a.c === "primaire") S.draw.text(c, "(2 étapes)", W / 2, cy + 18, {size:9.5, color:P.grey});
      if (nothing){ S.draw.text(c, "✗", cx2, cy, {size:44, color:P.red}); S.draw.text(c, "pas de H sur C–OH", cx2, cy + 50, {size:11, color:P.red}); }
      else if (r === "de"){
        /* alcène : C=C schématique */
        ctx.save(); ctx.globalAlpha = e; UC.stick(ctx, cx2 - 26, cy - 3, cx2 + 26, cy - 3, 5, "#9aa5b1"); UC.stick(ctx, cx2 - 26, cy + 4, cx2 + 26, cy + 4, 5, "#9aa5b1");
        atom(c, cx2 - 26, cy, "C", "#3b4655", 14); atom(c, cx2 + 26, cy, "C", "#3b4655", 14); ctx.restore();
        ctx.save(); ctx.globalAlpha = 1 - e; S.draw.text(c, "+ H₂O", cx2 + 40, cy + 40, {size:11, color:P.teal}); ctx.restore();
        S.draw.text(c, "+ H₂O", cx2, cy + 44, {size:11, color:P.teal});
      } else mol(c, cx2, cy, subsP, topP, e, false);
      S.draw.text(c, a.n, cx1, cy + 62, {size:11, color:P.ink}); if (!nothing) S.draw.text(c, pname, cx2, cy + 62, {size:11, color:P.green, bg:S.draw.tint(P.green, 0.1)});
      /* échelle d'oxydation */
      var gy = H - 62, gx0 = 28, gx1 = W - 28;
      S.draw.text(c, "échelle d’oxydation du carbone portant OH (n.o.)", W / 2, gy - 24, {size:10.5, color:P.grey});
      S.draw.line(c, gx0, gy, gx1, gy, "#cfd6df", 4);
      [[-1, "−1"], [1, "+1"], [3, "+3"]].forEach(function(q){ var x = gx0 + (q[0] + 2) / 6 * (gx1 - gx0); S.draw.line(c, x, gy - 5, x, gy + 5, P.grey, 1.5); S.draw.text(c, q[1], x, gy + 16, {size:10, color:P.grey}); });
      var n0 = a.no, nx = n0, nowSet = oxi && !nothing ? no2 : n0;
      function GX(v){ return gx0 + (v + 2) / 6 * (gx1 - gx0); }
      var curv = n0 + (nowSet - n0) * e;
      S.draw.dot(c, GX(n0), gy, 5, P.acc);
      if (oxi && !nothing){ S.draw.arrow(c, GX(n0), gy - 10, GX(curv), gy - 10, P.green, 2.4); S.draw.dot(c, GX(curv), gy, 7, P.green); }
      S.draw.text(c, "alcool : " + (n0 > 0 ? "+" : n0 < 0 ? "−" : "") + Math.abs(n0), GX(n0), gy + 34, {size:10, color:P.acc, weight:800});
      if (oxi && !nothing) { var shown = {1:"aldéhyde / cétone", 2:"cétone", 3:"acide"}; }
      if (oxi){
        var what = nothing ? "Aucune réaction : le carbone porte OH mais pas de H, il faudrait rompre une liaison C–C." : ("Produit : <b>" + (a.c === "primaire" && r === "jones" ? a.ox[1] : a.ox[0]) + "</b>.");
        nt2.set(what, a.c === "tertiaire" ? "warn" : "ok");
        nt.set(r === "pcc" ? "<b>PCC (ou Swern) :</b> oxydation ménagée en milieu anhydre : le primaire s’arrête à l’aldéhyde, le secondaire donne la cétone." + (a.c === "primaire" ? " Le Δn.o. de C est +2 (−I → +I)." : "") : "<b>Oxydant fort en milieu aqueux :</b> le primaire est oxydé jusqu’à l’acide carboxylique (l’aldéhyde s’hydrate et continue), le secondaire s’arrête à la cétone, le tertiaire ne réagit pas.", "");
      } else if (r === "de"){
        nt.set("<b>Déshydratation :</b> H₂SO₄ protone OH (qui devient le bon groupe partant H₂O), puis perte de H⁺ voisin. Réactivité 3° &gt; 2° &gt; 1° (stabilité du carbocation). " + a.de[1] + ".", "");
        nt2.set("Produit : <b>" + a.de[0] + "</b>.", "ok");
      } else {
        nt.set("<b>Substitution par HBr :</b> OH est un mauvais groupe partant ; H⁺ le transforme en H₂O⁺. " + a.hx[1] + ". Réactivité 3° &gt; 2° &gt; 1° pour SN1, et 1° &gt; 2° pour SN2.", "");
        nt2.set("Produit : <b>" + a.hx[0] + "</b>.", "ok");
      }
    });
  }
});

/* ---------- 2. Acidité des acides carboxyliques et pH ---------- */
var ACI = [["hco","acide méthanoïque (formique)",3.75],["ac","acide éthanoïque (acétique)",4.76],["pro","acide propanoïque",4.87],["but","acide butanoïque",4.82],["cl4","acide 4-chlorobutanoïque",4.52],["cl3","acide 3-chlorobutanoïque",4.06],["cl2","acide 2-chlorobutanoïque",2.84],["clac","acide chloroéthanoïque",2.87],["dclac","acide dichloroéthanoïque",1.35],["tclac","acide trichloroéthanoïque",0.66],["benz","acide benzoïque",4.20],["asp","aspirine (acide acétylsalicylique)",3.5],["ibu","ibuprofène (4,4 à 4,9 selon les sources ; 4,4 retenu)",4.4],["phe","phénol (pas un acide carboxylique)",10.0],["eth","éthanol (pas un acide carboxylique)",16.0]];
SFA.sim({
  id:"uc-c10-acidite-carboxylique", ch:"c10", tag:"pKa et structure",
  titre:"Acidité des acides carboxyliques et ionisation selon le pH",
  resume:"Effet inductif et résonance du carboxylate ; % ionisé dans l’estomac, l’intestin et le sang.",
  but:"Choisis un acide et un pH. Compare son pKa à celui des autres : les atomes électroattracteurs (Cl) rapprochés du COOH renforcent l’acide. La courbe donne la fraction ionisée.",
  aRetenir:"Carboxylate = résonance sur 2 O (délocalisation) : acide carboxylique (pKa ≈ 4–5) ≫ phénol (≈ 10) ≫ alcool (≈ 16). Un substituant électroattracteur proche stabilise RCOO⁻ (effet inductif −I) et abaisse le pKa ; l’effet s’atténue avec la distance (2-Cl : 2,84 ; 3-Cl : 4,06 ; 4-Cl : 4,52). % ionisé = 1/(1 + 10<sup>pKa − pH</sup>).",
  piege:"Confondre pKa bas et base forte. Penser qu’un acide « faible » est peu ionisé à tout pH : au pH sanguin 7,4, tous les acides carboxyliques usuels sont ≥ 99 % ionisés. Seule la forme neutre traverse facilement les membranes.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:1.0});
    var sel = k.select("Composé",ACI.map(function(a){ return [a[0],a[1]+" (pKa "+String(a[2]).replace(".",",")+")"]; }),"ac");
    var ph = k.slider("pH",0,14,0.1,7.4,"");
    var ro = k.readouts(["pKa","% ionisé à ce pH","% neutre","% ionisé à pH 1,5 (estomac)"]);
    var nt = k.note("","");
    var geo = null, rnd = [], i0;
    for (i0 = 0; i0 < 100; i0++) rnd.push(((i0 * 37 + 11) % 100) / 100);
    function pk(){ return ACI.filter(function(a){ return a[0]===sel.value; })[0][2]; }
    function alpha(p,h){ return 1/(1+Math.pow(10,p-h)); }
    c.pointer(function(type, p){ if (!geo || (type !== "down" && type !== "drag")) return; if (p.y < geo.sh - 6) return; ph.set(Math.round(geo.ax.ix(p.x) * 10) / 10); k.redraw(); });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, P = S.draw.palette, p = pk(), a = alpha(p, ph.value);
      UC.bg(c, "#f8fafd", "#ffffff");
      var sh = Math.round(H * 0.38);
      /* 100 molécules : celles dont le rang < a·100 sont ionisées */
      var cols = 20, rows = 5, gx = 14, cw = (W - 28) / cols, ch = Math.min(cw, (sh - 56) / rows), nion = Math.round(100 * a);
      S.draw.text(c, "pH " + S.fmt(ph.value, 1), 14, 14, {size:11.5, color:P.ink, align:"left"});
      S.draw.label(c, nion + " molécules sur 100 ionisées", W - 14, 14, {color:P.red, size:11, align:"right"});
      var order = []; for (i0 = 0; i0 < 100; i0++) order.push(i0); order.sort(function(x, y){ return rnd[x] - rnd[y]; });
      var rank = {}; order.forEach(function(v, r){ rank[v] = r; });
      for (var i = 0; i < 100; i++){
        var x = gx + (i % cols + 0.5) * cw, y = 34 + Math.floor(i / cols) * ch + ch / 2, on = rank[i] < nion;
        if (on){ UC.ball(ctx, x - cw * 0.17, y, cw * 0.3, "#d6392f"); UC.ball(ctx, x + cw * 0.2, y, cw * 0.17, "#2f7fd1"); }
        else UC.ball(ctx, x, y, cw * 0.34, "#b6c0cd");
      }
      S.draw.text(c, "gris : RCOOH · rouge : RCOO⁻ · bleu : H⁺", 14, sh - 8, {size:10, color:P.grey, align:"left"});
      /* courbe : sous-repère */
      var c2 = {ctx:ctx, W:W, H:H - sh, clear:function(){}};
      ctx.save(); ctx.translate(0, sh);
      var ax = S.draw.axes(c2, {x0:0,x1:14,y0:0,y1:100,xl:"pH (clique ou glisse ici)",yl:"% ionisé (RCOO⁻)",stepX:2,stepY:25,l:46,r:14,t:20,b:34});
      geo = {ax:ax, sh:sh};
      [[1.5,"estomac"],[7.4,"sang"]].forEach(function(z){ S.draw.line(c2,ax.X(z[0]),ax.T,ax.X(z[0]),ax.B,"#b8c2cf",1.3,[2,4]); S.draw.text(c2,z[1],ax.X(z[0]) + (z[0] < 3 ? 4 : 4),ax.B - 10,{size:10,color:P.grey,align:"left"}); });
      S.draw.fn(c2,ax,function(h){ return 100*alpha(4.76,h); },P.grey,1.6,[5,4]);
      S.draw.fn(c2,ax,function(h){ return 100*alpha(p,h); },P.acc,3);
      if (p >= 0 && p <= 14){ S.draw.line(c2,ax.X(p),ax.B,ax.X(p),ax.Y(50),P.amber,1.6,[4,4]); S.draw.label(c2,"pH = pKa : 50 %",Math.min(ax.R - 50, Math.max(ax.L + 50, ax.X(p) + (p < 7 ? 56 : -56))),ax.Y(50) + (p < 7 ? 18 : -18),{color:P.amber,size:10.5}); }
      S.draw.dot(c2,ax.X(ph.value),ax.Y(100*a),6.5,P.red);
      ctx.restore();
      ro.set(0,S.fmt(p,2)); ro.set(1,S.fmt(100*a,a>0.99||a<0.01?3:1)+" %"); ro.set(2,S.fmt(100*(1-a),a>0.99||a<0.01?3:1)+" %"); ro.set(3,S.fmt(100*alpha(p,1.5),2)+" %");
nt.set(p<2?"Acide carboxylique relativement fort (pKa &lt; 2, mais pas totalement dissocié comme HCl) : carboxylate fortement stabilisé par l’effet inductif des atomes électronégatifs.":p<6?"Acide carboxylique typique : résonance du carboxylate + éventuel effet inductif.":p<12?"Phénol : l’anion est stabilisé par résonance dans le cycle, mais la charge reste sur O avec une délocalisation moins efficace.":"Alcool : l’alcoolate n’a aucune stabilisation par résonance, d’où un pKa proche de celui de l’eau.","");
    });
    k.note("Courbe grise : acide éthanoïque (référence). Les pKa sont des valeurs usuelles à 25 °C ; l’effet des solvants et de la température n’est pas modélisé.","");
  }
});

/* ---------- 3. Estérification : un équilibre ---------- */
SFA.sim({
  id:"uc-c10-esterification-equilibre", ch:"c10", tag:"Équilibre",
  titre:"Estérification de Fischer : rendement et déplacement de l’équilibre",
  resume:"Acide + alcool ⇌ ester + eau : K ≈ 4, excès d’alcool, élimination de l’eau, hydrolyse et saponification.",
  but:"Fais varier l’excès d’alcool, l’élimination de l’eau et la constante K. Compare au cas de la saponification, qui est totale car le carboxylate formé ne réagit plus.",
  aRetenir:"RCOOH + R′OH ⇌ RCOOR′ + H₂O, K ≈ 4 (acide acétique + éthanol, 25 °C) : avec des quantités équimolaires, rendement 2/3 ≈ 67 %. Le catalyseur acide accélère mais ne change pas K. On déplace l’équilibre (Le Chatelier) par un excès d’un réactif ou en retirant l’eau (Dean-Stark). Saponification (RCOOR′ + OH⁻ → RCOO⁻ + R′OH) : quasi totale.",
  piege:"Croire que le catalyseur améliore le rendement. Confondre rendement (≤ 67 % à l’équilibre en proportions stœchiométriques) et vitesse. Appliquer le même raisonnement à la saponification : sa constante d’équilibre est immense.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:1.12});
    var mode = k.seg("Réaction",[["est","Estérification"],["hyd","Hydrolyse acide"],["sap","Saponification (NaOH)"]],"est");
    var K = k.slider("Constante K",1,20,0.5,4,"");
    var eq = k.slider("Équivalents d’alcool (ou d’eau en hydrolyse)",0.5,10,0.5,1,"");
    var f = k.slider("Fraction de l’eau retirée (Dean-Stark)",0,95,5,0,"%");
    var ro = k.readouts(["Rendement à l’équilibre","Ester","Acide","Eau"]);
    var nt = k.note("","");
    var st = {cur:[1,1,0,0], tgt:[1,1,0,0]};
    var lp = k.loop(function(dt){ var mv = false; for (var i = 0; i < 4; i++){ var d = st.tgt[i] - st.cur[i]; if (Math.abs(d) > 0.002){ st.cur[i] += d * Math.min(1, dt * 6); mv = true; } } if (mv) k.redraw(); }); lp.play();
    var geo = null;
    function yieldX(Kv,b,fr){ var a=1, A=Kv-(1-fr), Bq=-Kv*(a+b), C=Kv*a*b; if (Math.abs(A)<1e-9) return -C/Bq; var d=Bq*Bq-4*A*C; var x1=(-Bq-Math.sqrt(d))/(2*A), x2=(-Bq+Math.sqrt(d))/(2*A); var lim=Math.min(a,b); var x=x1; if (!(x>=0&&x<=lim)) x=x2; return Math.max(0,Math.min(lim,x)); }
    c.pointer(function(type, p){ if (!geo || (type !== "down" && type !== "drag") || p.y < geo.sh) return; var v = Math.round(geo.ax.ix(p.x) * 2) / 2; eq.set(Math.max(0.5, Math.min(10, v))); k.redraw(); });
    k.draw(function(){
      var ctx=c.ctx, W=c.W, H=c.H, P=S.draw.palette, fr=f.value/100, b=eq.value, x, md=mode.value;
      if (md==="sap") x=1;
      else if (md==="est") x=yieldX(K.value,b,fr);
      else { var A2=K.value-1, B2=1+b, C2=-b; x=Math.abs(A2)<1e-9?-C2/B2:(-B2+Math.sqrt(B2*B2-4*A2*C2))/(2*A2); x=Math.max(0,Math.min(1,x)); }
      var comp, bars;
      if (md==="est"){ comp=[x,1-x,b-x,x*(1-fr)]; bars=[["acide",1-x,"#6b7787"],["alcool",b-x,"#9a6a2a"],["ester",x,"#24775a"],["eau",x*(1-fr),"#2f7fd1"]]; }
      else if (md==="hyd"){ comp=[1-x,x,x,eq.value-x]; bars=[["ester",1-x,"#24775a"],["eau",eq.value-x,"#2f7fd1"],["acide",x,"#6b7787"],["alcool",x,"#9a6a2a"]]; }
      else { comp=[0,1,0,0]; bars=[["ester",0,"#24775a"],["HO⁻",0,"#2f7fd1"],["RCOO⁻",1,"#6b7787"],["alcool",1,"#9a6a2a"]]; }
      st.tgt = bars.map(function(q){ return q[1]; }); lp.play();
      UC.bg(c, "#f8fafd", "#ffffff");
      var sh = Math.round(H*0.44), bw = (W - 40) / 4, mx = Math.max(1.2, st.cur[0], st.cur[1], st.cur[2], st.cur[3]) * 1.08, base = sh - 26, top = 36;
      S.draw.text(c, "composition à l’équilibre (mol)", W/2, 12, {size:10.5, color:P.grey});
      S.draw.line(c, 14, base, W - 14, base, P.axis, 1.4);
      for (var i = 0; i < 4; i++){
        var xx = 20 + i * bw, h = st.cur[i] / mx * (base - top), prod = (md === "est" ? i >= 2 : (md === "hyd" ? i >= 2 : i >= 2));
        S.draw.rrect(c, xx + 8, base - h, bw - 16, Math.max(h, 1), 5); ctx.fillStyle = bars[i][2]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
        S.draw.text(c, bars[i][0], xx + bw/2, base + 12, {size:10.5, color:P.ink, weight:700});
        S.draw.text(c, S.fmt(bars[i][1], 2), xx + bw/2, Math.max(top - 4, base - h - 9), {size:10.5, color:bars[i][2], weight:800});
      }
      S.draw.text(c, "réactifs", 20 + bw, 26, {size:9.5, color:P.grey}); S.draw.text(c, "produits", 20 + 3 * bw, 26, {size:9.5, color:P.grey});
      S.draw.line(c, 20 + 2 * bw, 20, 20 + 2 * bw, base, "#cfd6df", 1, [3,3]);
      if (md !== "sap" && bars[0][1] > 1e-6 && bars[1][1] > 1e-6){ var Q = bars[2][1] * bars[3][1] / (bars[0][1] * bars[1][1]); var Kt = md === "est" ? K.value : K.value; S.draw.label(c, md === "est" && fr > 0 ? "retrait d’eau : Q ≠ K" : "Q = " + S.fmt(Q, 1) + " = K ✓", W / 2, sh - 4, {color:P.violet, size:10.5}); }
      else if (md === "sap") S.draw.label(c, "K immense : réaction totale", W / 2, sh - 4, {color:P.green, size:10.5});
      /* courbe du rendement */
      var c2 = {ctx:ctx, W:W, H:H - sh, clear:function(){}};
      ctx.save(); ctx.translate(0, sh);
      var ax=S.draw.axes(c2,{x0:0,x1:10,y0:0,y1:100,xl:"équivalents d’alcool (clique ou glisse)",yl:"rendement (%)",stepX:2,stepY:25,l:46,r:14,t:20,b:34});
      geo = {ax:ax, sh:sh};
      S.draw.fn(c2,ax,function(bb){ return 100*yieldX(K.value,Math.max(bb,0.01),0); },P.grey,1.4,[5,4]);
      S.draw.fn(c2,ax,function(bb){ return 100*yieldX(K.value,Math.max(bb,0.01),fr); },P.acc,2.8);
      S.draw.line(c2,ax.L,ax.Y(66.7),ax.R,ax.Y(66.7),P.amber,1.2,[3,4]); S.draw.text(c2,"67 % (K = 4, équimolaire)",ax.R-6,ax.Y(66.7)+10,{size:10,color:P.amber,align:"right"});
      if (md==="est") S.draw.dot(c2,ax.X(b),ax.Y(100*x),7,P.red);
      else S.draw.text(c2, md === "sap" ? "Saponification : ≈ 100 % (irréversible)" : "Hydrolyse : rendement en acide = "+S.fmt(x*100,0)+" %", ax.X(5), ax.Y(35), {size:12, color:md === "sap" ? P.green : P.violet});
      ctx.restore();
      var main=md==="sap"?1:x;
      ro.set(0,S.fmt(main*100,0)+" %"); ro.set(1,S.fmt(comp[0],2)+" mol"); ro.set(2,S.fmt(comp[1],2)+" mol"); ro.set(3,S.fmt(comp[3],2)+" mol");
nt.set(md==="est"?"Pour 1 mol d’acide et "+S.fmt(b,1)+" mol d’alcool, avec K = "+S.fmt(K.value,1)+" : "+S.fmt(x*100,0)+" % d’ester. Courbe grise : sans retrait d’eau. Un excès d’alcool OU le retrait de l’eau déplace l’équilibre.":md==="hyd"?"Hydrolyse acide de 1 mol d’ester avec "+S.fmt(eq.value,1)+" mol d’eau : c’est l’estérification à l’envers (même K). Un grand excès d’eau est nécessaire pour hydrolyser largement.":"En milieu basique, RCOOH formé est immédiatement déprotoné en RCOO⁻ (pKa ≈ 4–5 contre ≈ 16 pour l’alcool) : la réaction est déplacée irréversiblement. C’est le principe du savon (saponification d’un triglycéride).","");
    });
    k.note("Dans l’affichage de l’hydrolyse, « Ester » désigne l’ester restant, « Acide » l’acide formé ; en saponification, la ligne « Ester » est nulle et « Acide » désigne le carboxylate formé (1 mol).","");
  }
});

/* ---------- 4. Réactivité des carbonyles : réducteurs, Grignard, cyanhydrine ---------- */
var SUB = {
  pal:{n:"propanal",t:"aldéhyde",e:5},
  pon:{n:"propanone",t:"cétone",e:4},
  bal:{n:"benzaldéhyde",t:"aldéhyde aromatique",e:4},
  est:{n:"éthanoate d’éthyle",t:"ester",e:2},
  aci:{n:"acide propanoïque",t:"acide carboxylique",e:1}
};
var RCT = {
  nabh4:{t:"NaBH₄ (EtOH, H₂O)",note:"Réducteur doux, utilisable dans l’alcool ou l’eau. Réduit seulement aldéhydes et cétones (et chlorures d’acyle)."},
  lah:{t:"LiAlH₄ (éther anhydre) puis H₃O⁺",note:"Réducteur puissant : tous les carbonyles. Réagit violemment avec l’eau : solvant anhydre obligatoire."},
  mg:{t:"CH₃MgBr (éther) puis H₃O⁺",note:"Le carbanion CH₃⁻ (Grignard) forme une liaison C–C ; aussi une base très forte (détruit tout H acide : eau, alcool, acide)."},
  hcn:{t:"HCN / CN⁻ (cat.)",note:"Addition nucléophile de CN⁻ sur un aldéhyde ou une cétone : cyanhydrine (liaison C–C). Équilibre favorable pour les aldéhydes, plus défavorable pour les cétones encombrées."}
};
var OUT = {
  pal:{nabh4:["propan-1-ol","alcool primaire"],lah:["propan-1-ol","alcool primaire"],mg:["butan-2-ol","alcool secondaire (nouvelle liaison C–C)"],hcn:["2-hydroxybutanenitrile (cyanhydrine)","alcool + nitrile"]},
  pon:{nabh4:["propan-2-ol","alcool secondaire"],lah:["propan-2-ol","alcool secondaire"],mg:["2-méthylpropan-2-ol","alcool tertiaire"],hcn:["2-hydroxy-2-méthylpropanenitrile (cyanhydrine de l’acétone)","alcool tertiaire + nitrile"]},
  bal:{nabh4:["phénylméthanol (alcool benzylique)","alcool primaire"],lah:["phénylméthanol (alcool benzylique)","alcool primaire"],mg:["1-phényléthan-1-ol","alcool secondaire"],hcn:["2-hydroxy-2-phényléthanenitrile (mandélonitrile)","alcool secondaire + nitrile"]},
  est:{nabh4:[null,"pas de réaction dans les conditions usuelles (ester peu électrophile)"],lah:["éthanol (2 équivalents)","2 alcools primaires : l’acyle donne CH₃CH₂OH et l’alcool de l’ester donne aussi éthanol"],mg:["2-méthylpropan-2-ol + éthanol","alcool tertiaire : 2 CH₃ s’additionnent (il faut 2 équivalents)"],hcn:[null,"pas de réaction"]},
  aci:{nabh4:[null,"pas de réduction : NaBH₄ déprotone l’acide (H₂ + carboxylate)"],lah:["propan-1-ol","alcool primaire (après H⁺ ; 1ᵉʳ équivalent consommé par la réaction acide-base)"],mg:[null,"réaction acide-base : CH₄ + carboxylate ; pas d’addition sur C=O"],hcn:[null,"pas de réaction"]}
};
SFA.sim({
  id:"uc-c10-reactivite-carbonyles", ch:"c10", tag:"Carbonyles",
  titre:"Carbonyles : réduction, Grignard et cyanhydrine",
  resume:"Aldéhyde, cétone, ester ou acide face à NaBH₄, LiAlH₄, CH₃MgBr, HCN : produit, classe de l’alcool, limites.",
  but:"Choisis un substrat et un réactif. L’électrophilie de C=O diminue de l’aldéhyde à l’acide : NaBH₄ ne voit que les plus électrophiles, LiAlH₄ presque tous.",
  aRetenir:"Électrophilie de C=O : aldéhyde &gt; cétone &gt; ester &gt; acide / amide. NaBH₄ : aldéhydes et cétones → alcools. LiAlH₄ : tous (ester → 2 alcools primaires, acide → alcool primaire). Grignard sur aldéhyde → alcool 2° ; cétone → 3° ; ester → 3° (2 additions identiques). HCN → cyanhydrine (liaison C–C).",
  piege:"Utiliser LiAlH₄ dans l’eau. Faire réagir un Grignard avec un composé portant un H acide (OH, COOH, NH). Oublier que l’ester réagit deux fois avec RMgX.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:0.95});
    var su = k.select("Substrat",[["pal","propanal (aldéhyde)"],["pon","propanone (cétone)"],["bal","benzaldéhyde"],["est","éthanoate d’éthyle (ester)"],["aci","acide propanoïque"]],"pal");
    var rg = k.select("Réactif",[["nabh4","NaBH₄"],["lah","LiAlH₄"],["mg","CH₃MgBr"],["hcn","HCN / CN⁻"]],"nabh4");
    var nt = k.note("","");
    var nt2 = k.note("","");
    var keys = ["pal","pon","bal","est","aci"], short = ["aldéhyde","cétone","benzald.","ester","acide"];
    var st = {t:1, key:"", bars:[]};
    var lp = k.loop(function(dt){ if (st.t < 1){ st.t = Math.min(1, st.t + dt / 1.8); k.redraw(); } }); lp.play();
    c.pointer(function(type, p){ if (type !== "down") return; st.bars.forEach(function(b){ if (p.x >= b[0] && p.x <= b[1] && p.y >= b[2]){ su.set(b[3]); k.redraw(); } }); });
    var R1 = {pal:["Et","H"], pon:["Me","Me"], bal:["Ph","H"], est:["Me","OEt"], aci:["Et","OH"]};
    var NU = {nabh4:"H⁻", lah:"H⁻", mg:"CH₃⁻", hcn:"CN⁻"};
    k.draw(function(){
      var ctx = c.ctx, s = SUB[su.value], o = OUT[su.value][rg.value], W = c.W, H = c.H, P = S.draw.palette, reacts = o[0] !== null;
      var key = su.value + rg.value; if (key !== st.key){ st.key = key; st.t = 0; lp.play(); }
      UC.bg(c, "#f8fafd", "#ffffff");
      S.draw.text(c, s.n + " + " + NU[rg.value] + (rg.value === "hcn" ? "" : " (nucléophile)"), W / 2, 16, {size:12, color:P.ink});
      /* molécule C=O */
      var cx = W * 0.56, cy = 90, d = 38, e = s.e / 5;
      S.draw.glow(c, cx, cy, 52, "#2f7fd1", 0.18 + 0.4 * e);
      UC.stick(ctx, cx - 4, cy, cx - 4, cy - d, 4, "#9aa5b1"); UC.stick(ctx, cx + 4, cy, cx + 4, cy - d, 4, "#9aa5b1");
      var subs = R1[su.value];
      UC.stick(ctx, cx, cy, cx - d * 0.9, cy + d * 0.8, 5, "#9aa5b1"); UC.stick(ctx, cx, cy, cx + d * 0.9, cy + d * 0.8, 5, "#9aa5b1");
      subs.forEach(function(q, i){ var x = cx + (i ? 1 : -1) * d * 0.9, y = cy + d * 0.8; if (q === "H"){ UC.ball(ctx, x, y, 9, "#e6ebf2"); S.draw.text(c, "H", x, y, {size:10, color:P.ink}); } else if (q === "OH" || q === "OEt"){ UC.ball(ctx, x, y, 13, "#d6392f"); S.draw.text(c, q, x, y, {size:q === "OEt" ? 9.5 : 11, color:"#fff"}); } else { UC.ball(ctx, x, y, 13, "#6b7787"); S.draw.text(c, q, x, y, {size:10.5, color:"#fff"}); } });
      UC.ball(ctx, cx, cy, 14, "#3b4655"); S.draw.text(c, "C", cx, cy, {size:12, color:"#fff"});
      UC.ball(ctx, cx, cy - d, 13, "#d6392f"); S.draw.text(c, "O", cx, cy - d, {size:12, color:"#fff"});
      S.draw.label(c, "δ+", cx + 22, cy - 10, {color:P.acc, size:11.5}); S.draw.label(c, "δ−", cx + 24, cy - d, {color:P.red, size:11.5});
      S.draw.text(c, "électrophilie " + "●".repeat(s.e) + "○".repeat(5 - s.e), cx, cy + d * 0.8 + 28, {size:10.5, color:P.acc, weight:700});
      /* nucléophile qui attaque */
      var t = st.t, nx0 = W * 0.10, ny = cy, tx = cx - 20, ty = cy - 8, px, py;
      if (reacts){ var u = Math.min(1, t / 0.6); u = u * u * (3 - 2 * u); px = nx0 + (tx - nx0) * u; py = ny + (ty - ny) * u; }
      else { var u2 = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5 * 0.9; var a2 = Math.sin(Math.min(1, t) * Math.PI); px = nx0 + (tx - nx0) * 0.55 * a2; py = ny; }
      var ncol = reacts ? "#c0321d" : "#8a95a3";
      UC.ball(ctx, px, py, 13, ncol); S.draw.text(c, NU[rg.value], px, py, {size:10.5, color:"#fff"});
      if (reacts && t > 0.6){ S.draw.glow(c, cx, cy, 36, "#24775a", 0.35 * Math.sin((t - 0.6) / 0.4 * 3)); }
      if (!reacts && t > 0.45){ S.draw.text(c, "✗", (nx0 + tx) / 2 + 10, cy - 34, {size:30, color:P.red}); }
      S.draw.text(c, RCT[rg.value].t, nx0 + 6, 38, {size:10, color:P.grey, align:"left"});
      /* produit */
      var yb = 178;
      S.draw.panel(c, 8, yb - 14, W - 16, 30, {shadow:false, fill:reacts ? S.draw.tint(P.green, 0.1) : S.draw.tint(P.red, 0.08), stroke:reacts ? S.draw.tint(P.green, 0.4) : S.draw.tint(P.red, 0.4)});
      S.draw.text(c, reacts ? "→  " + o[0] : "Pas de produit utile", W / 2, yb + 1, {size:W < 400 ? 10.5 : 12, color:reacts ? P.green : P.red, weight:800});
      /* barres d'électrophilie (clic = choix du substrat) */
      var by0 = 222, bh = H - by0 - 30, bw = (W - 24) / 5; st.bars = [];
      S.draw.text(c, "électrophilie du carbone C=O (clique une barre)", W / 2, by0 - 8, {size:10.5, color:P.grey});
      keys.forEach(function(kk, i){
        var x = 12 + i * bw, h = SUB[kk].e / 5 * (bh - 4), y = by0 + bh - h, on = kk === su.value;
        S.draw.rrect(c, x + 5, y, bw - 10, h, 4); ctx.fillStyle = on ? P.acc : "rgba(31,75,158,.2)"; ctx.fill();
        S.draw.text(c, short[i], x + bw / 2, by0 + bh + 12, {size:9.5, color:on ? P.acc : P.grey, weight:on ? 800 : 600});
        st.bars.push([x, x + bw, by0 - 4, kk]);
      });
      nt.set("<b>" + RCT[rg.value].t + "</b><br>" + RCT[rg.value].note, "");
      nt2.set(reacts ? "<b>" + s.n + " → " + o[0] + "</b><br>" + o[1] : "<b>" + s.n + " + " + RCT[rg.value].t + " : " + o[1] + "</b>", reacts ? "ok" : "warn");
    });
  }
});

/* ---------- 5. Liaison amide et peptides ---------- */
var AA = [["gly","glycine (Gly)",75.07],["ala","alanine (Ala)",89.09],["ser","sérine (Ser)",105.09],["val","valine (Val)",117.15],["leu","leucine (Leu)",131.17],["phe","phénylalanine (Phe)",165.19],["asp","acide aspartique (Asp)",133.10],["lys","lysine (Lys)",146.19]];
SFA.sim({
  id:"uc-c10-liaison-peptidique", ch:"c10", tag:"Amides",
  titre:"La liaison peptidique : résonance, planéité et dipeptides",
  resume:"Pourquoi la liaison amide est plane et rigide, quelle masse a un dipeptide, combien de séquences existent.",
  but:"Tourne la liaison C–N d’un peptide : l’énergie monte jusqu’à ≈ 80 kJ/mol à 90°, car la résonance du doublet de N avec C=O est rompue. Compose ensuite un dipeptide et compte les séquences possibles.",
  aRetenir:"Amide : le doublet du N se délocalise sur C=O (N–C(=O) ↔ N⁺=C–O⁻) : liaison C–N partielle double (≈ 1,33 Å), atomes O=C–N–H coplanaires, forme trans (ω = 180°) favorisée, barrière de rotation ≈ 80 kJ/mol. L’amide est peu basique (le doublet N est engagé). Dipeptide : M = M(AA₁) + M(AA₂) − M(H₂O). Deux acides différents donnent 2 dipeptides distincts (Gly-Ala ≠ Ala-Gly).",
  piege:"Dessiner la liaison C–N d’un amide comme une simple liaison libre à tourner. Oublier que l’eau est perdue (18 g/mol) à chaque liaison. Une séquence se lit du N-terminal vers le C-terminal.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:1.15});
    var om = k.slider("Angle de torsion ω autour de C–N",0,180,5,180,"°");
    var T = k.slider("Température",280,330,1,298,"K");
    var a1 = k.select("1<sup>er</sup> acide aminé (N-terminal)",AA.map(function(a){ return [a[0],a[1]]; }),"gly");
    var a2 = k.select("2<sup>e</sup> acide aminé (C-terminal)",AA.map(function(a){ return [a[0],a[1]]; }),"ala");
    var ro = k.readouts(["E(ω) relative","Demi-vie de la rotation (barrière 80 kJ/mol)","Dipeptide","Masse molaire"]);
    var nt = k.note("","");
    var R=8.314, view = {a:-0.55, b:0.32}, drag = null;
    function En(w){ var r=w*Math.PI/180; return 37.5*(1-Math.cos(2*r))+5*(1+Math.cos(r)); }
    function mm(id){ return AA.filter(function(a){ return a[0]===id; })[0]; }
    c.pointer(function(type, p){
      if (type === "down") drag = p.x; else if (type === "up") drag = null;
      else if (type === "drag" && drag != null){ om.set(om.value + (p.x - drag) * 0.9); drag = p.x; k.redraw(); }
    });
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, P = S.draw.palette, w = om.value, rw = w * Math.PI / 180;
      UC.bg(c, "#f8fafd", "#ffffff");
      var sh = Math.round(H * 0.5), sc = Math.min(W / 6.4, 52), cx = W / 2, cy = sh * 0.52;
      /* atomes : axe C–N le long de x, plan de l'amide z = 0 côté C ; côté N, les substituants tournent de ω */
      var A = [
        {n:"C", p:[-0.75,0,0], col:UC.COL.C, r:15}, {n:"N", p:[0.75,0,0], col:UC.COL.N, r:15},
        {n:"O", p:[-1.4,1.05,0], col:UC.COL.O, r:14}, {n:"Cα", p:[-1.55,-1.0,0], col:"#6b7787", r:13},
        {n:"Cα", p:[1.55,-Math.cos(rw),-Math.sin(rw)], col:"#6b7787", r:13}, {n:"H", p:[1.35,0.8*Math.cos(rw),0.8*Math.sin(rw)], col:UC.COL.H, r:9}
      ];
      var B = [[0,1,1],[0,2,2],[0,3,1],[1,4,1],[1,5,1]];
      var pr = A.map(function(a){ return UC.proj(a.p, view, sc, cx, cy); });
      /* orbitales p (résonance) : recouvrement ∝ |cos ω| */
      var ov = Math.abs(Math.cos(rw));
      [0,1].forEach(function(i){
        var up = UC.proj([A[i].p[0], 0, 1.15], view, sc, cx, cy), dn = UC.proj([A[i].p[0], 0, -1.15], view, sc, cx, cy);
        [up, dn].forEach(function(q, j){ UC.lobe(ctx, pr[i].x, pr[i].y, Math.atan2(q.y - pr[i].y, q.x - pr[i].x), Math.hypot(q.x - pr[i].x, q.y - pr[i].y), 15, i ? P.blue : P.amber, 0.14 + 0.4 * ov); });
      });
      var order = A.map(function(a, i){ return i; });
      B.forEach(function(b){ var p1 = pr[b[0]], p2 = pr[b[1]]; if (b[2] === 2){ UC.stick(ctx, p1.x - 3, p1.y - 2, p2.x - 3, p2.y - 2, 4, "#9aa5b1"); UC.stick(ctx, p1.x + 3, p1.y + 2, p2.x + 3, p2.y + 2, 4, "#9aa5b1"); } else UC.stick(ctx, p1.x, p1.y, p2.x, p2.y, b[0] === 0 && b[1] === 1 ? 7 : 5, b[0] === 0 && b[1] === 1 ? (ov > 0.5 ? "#4d7fd1" : "#9aa5b1") : "#9aa5b1"); });
      order.sort(function(i, j){ return pr[i].z - pr[j].z; }).forEach(function(i){ var a = A[i], q = pr[i]; UC.ball(ctx, q.x, q.y, a.r * q.s * 0.85, a.col); S.draw.text(c, a.n, q.x, q.y, {size:10.5, color:a.n === "H" ? P.ink : "#fff"}); });
      var cn = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y);
      S.draw.label(c, ov > 0.85 ? "C–N : liaison partielle double (plan)" : ov < 0.25 ? "résonance rompue : C–N simple" : "résonance affaiblie", W / 2, 14, {color:ov > 0.85 ? P.green : ov < 0.25 ? P.red : P.amber, size:11});
      S.draw.text(c, "glisse pour tordre · ω = " + Math.round(w) + "°", W / 2, sh - 6, {size:10.5, color:P.grey});
      /* courbe d'énergie */
      var c2 = {ctx:ctx, W:W, H:H - sh, clear:function(){}};
      ctx.save(); ctx.translate(0, sh);
      var ax = S.draw.axes(c2, {x0:0, x1:180, y0:0, y1:100, xl:"ω (°)", yl:"E (kJ/mol)", stepX:30, stepY:25, l:44, r:14, t:18, b:32});
      S.draw.fn(c2, ax, En, P.acc, 3);
      var E = En(w); S.draw.dot(c2, ax.X(w), ax.Y(E), 7, P.red);
      S.draw.text(c2, "trans : minimum", ax.X(176), ax.Y(0) - 14, {size:10, color:P.green, align:"right"});
      S.draw.text(c2, "cis : +10", ax.X(4), ax.Y(10) - 12, {size:10, color:P.amber, align:"left"});
      S.draw.text(c2, "barrière ≈ 80", ax.X(90), ax.Y(80) - 10, {size:10, color:P.red});
      ctx.restore();
      var kk=1e13*Math.exp(-80*1000/(R*T.value)), t12=Math.LN2/kk;
      var p1=mm(a1.value), p2=mm(a2.value), M=p1[2]+p2[2]-18.015;
      var s1=p1[1].match(/\((.*)\)/)[1], s2=p2[1].match(/\((.*)\)/)[1];
      ro.set(0,S.fmt(E,1)+" kJ/mol"); ro.set(1,S.fmt(t12,t12<100?1:0)+" s"); ro.set(2,"H₂N–"+s1+"–"+s2+"–COOH"); ro.set(3,S.fmt(M,2)+" g/mol");
      var same=a1.value===a2.value;
      nt.set("Avec ces deux acides aminés, "+(same?"un seul dipeptide (même acide aminé répété) : "+s1+"-"+s2+".":"on peut former 2 dipeptides différents : "+s1+"-"+s2+" et "+s2+"-"+s1+" (isomères de constitution, même masse).")+" Avec 20 acides aminés : 20² = 400 dipeptides, 20³ = 8 000 tripeptides. Demi-vie : k = A·e<sup>−Ea/RT</sup>, A ≈ 10<sup>13</sup> s<sup>−1</sup> (ordre de grandeur), Ea ≈ 80 kJ/mol : la rotation est lente à l’échelle moléculaire mais pas figée (secondes à minutes).","");
    });
    k.note("Courbe d’énergie : modèle simplifié E = 37,5·(1 − cos 2ω) + 5·(1 + cos ω) (kJ/mol). Le cis est ≈ 10 kJ/mol au-dessus du trans pour un résidu ordinaire (la proline fait exception). Masses molaires moyennes en g/mol.","");
  }
});
})();
