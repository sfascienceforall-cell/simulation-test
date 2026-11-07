/* Biologie BA1 · chapitre 1 : molécules du vivant et eau */

/* ---------- aides de dessin partagées par tous les chapitres de biologie (SFA.bio) ---------- */
(function(S){
  if (S.bio) return;
  var B = S.bio = {};
  function mix(h, f){ var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); } return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")"; }
  B.mix = mix;
  /* notation scientifique en texte brut (exposants Unicode) pour le canevas */
  B.sci = function(x, d){ if (!isFinite(x) || x === 0) return S.fmt(x, d); var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    if (e >= -2 && e <= 4) return S.fmt(x, x < 10 ? 2 : 0); var sup = {"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
    return S.fmt(m, d == null ? 1 : d) + "·10" + String(e).split("").map(function(ch){ return sup[ch]; }).join(""); };
  /* fond doux dégradé (vertical) : bg(c, haut, bas) */
  B.bg = function(c, top, bot){ var g = c.ctx.createLinearGradient(0, 0, 0, c.H); g.addColorStop(0, top || "#f6f9fd"); g.addColorStop(1, bot || "#eaf1f9"); c.ctx.fillStyle = g; c.ctx.fillRect(0, 0, c.W, c.H); };
  /* bille ombrée (molécule, ion, atome) */
  B.ball = function(c, x, y, r, col, opt){ var ctx = c.ctx; opt = opt || {};
    var g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, mix(col, .6)); g.addColorStop(.55, col); g.addColorStop(1, mix(col, -.38));
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha = opt.alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
    if (opt.text) S.draw.text(c, opt.text, x, y + .5, {size: opt.size || Math.max(9, r * .95), color: opt.tcolor || "#fff", weight: 800}); };
  /* globule rouge biconcave vu de dessus/de profil : rbc(c, x, y, r, {mode:"disque"|"crenele"|"turgescent"|"lyse", col}) */
  B.rbc = function(c, x, y, r, opt){ var ctx = c.ctx; opt = opt || {}; var col = opt.col || "#d94a52", mode = opt.mode || "disque";
    ctx.save(); ctx.translate(x, y);
    if (mode === "crenele"){ var n = 16; ctx.beginPath(); for (var i = 0; i < n * 2; i++){ var a = i * Math.PI / n, rr = i % 2 ? r * .82 : r * 1.0; ctx.lineTo(rr * Math.cos(a), rr * Math.sin(a)); } ctx.closePath(); }
    else if (mode === "lyse"){ ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(217,74,82,.5)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.stroke(); ctx.restore(); return; }
    else { ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); }
    var g = ctx.createRadialGradient(0, 0, r * .05, 0, 0, r);
    if (mode === "disque"){ g.addColorStop(0, mix(col, .35)); g.addColorStop(.38, mix(col, .1)); g.addColorStop(.62, col); g.addColorStop(1, mix(col, -.3)); }
    else { g.addColorStop(0, mix(col, .45)); g.addColorStop(.7, col); g.addColorStop(1, mix(col, -.3)); }
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = mix(col, -.4); ctx.stroke();
    if (mode === "disque"){ ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, 6.2832); ctx.strokeStyle = "rgba(120,20,30,.28)"; ctx.lineWidth = r * .1; ctx.stroke();
      var g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * .5); g2.addColorStop(0, "rgba(255,225,225,.75)"); g2.addColorStop(1, "rgba(255,225,225,0)"); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(0, 0, r * .5, 0, 6.2832); ctx.fill(); }
    ctx.restore(); };
  /* bicouche de phospholipides entre x0 et x1 centrée en y : membrane(c, x0, x1, y, {ep, gap}) */
  B.membrane = function(c, x0, x1, y, opt){ opt = opt || {}; var ctx = c.ctx, ep = opt.ep || 22, step = opt.step || 13, skip = opt.skip || [];
    ctx.save(); for (var x = x0 + step / 2; x < x1; x += step){
      var out = skip.some(function(s){ return x > s[0] && x < s[1]; }); if (out) continue;
      [[-1, y - ep / 2], [1, y + ep / 2]].forEach(function(p){ var hy = p[1], ty = hy + (p[0] < 0 ? 1 : -1) * ep * .55;
        ctx.strokeStyle = "#c7a96b"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 2, hy); ctx.lineTo(x - 2.5, ty); ctx.moveTo(x + 2, hy); ctx.lineTo(x + 2.5, ty); ctx.stroke();
        B.ball(c, x, hy, 4.2, "#e8b94a"); }); }
    ctx.restore(); };
  /* chromosome à 1 ou 2 chromatides : chrom(c, x, y, L, col, {dbl, angle, w}) ; dbl = 2 chromatides jointes au centromère (X) */
  B.chrom = function(c, x, y, L, col, opt){ opt = opt || {}; var ctx = c.ctx, w = opt.w || Math.max(3, L * .16); ctx.save(); ctx.translate(x, y); ctx.rotate(opt.angle || 0); ctx.lineCap = "round";
    function arm(sg){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-sg * L * .17, -L / 2); ctx.quadraticCurveTo(0, 0, sg * L * .17, L / 2); ctx.stroke(); }
    if (opt.dbl){ arm(1); arm(-1); } else { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, -L / 2); ctx.lineTo(0, L / 2); ctx.stroke(); }
    ctx.fillStyle = mix(col, -.35); ctx.beginPath(); ctx.arc(0, 0, w * .62, 0, 6.2832); ctx.fill(); ctx.restore(); };
  /* flèche courbe fine (flux) */
  B.flow = function(c, x1, y1, x2, y2, col, w){ S.draw.arrow(c, x1, y1, x2, y2, col || "#7b8694", w || 2); };
  /* bandeau de défi : état "ok" ou en cours, dessiné en haut du canevas */
  B.goal = function(c, txt, ok, y){ var col = ok ? S.draw.palette.green : S.draw.palette.amber; S.draw.label(c, (ok ? "✓ " : "◎ ") + txt, c.W / 2, y == null ? 16 : y, {color: col, size: 12}); };
})(window.SFA);

SFA.sim({
  id:"ub-c01-condensation", ch:"c01", tag:"Macromolécules",
  titre:"Condensation et hydrolyse : compter les liaisons et l'eau",
  resume:"Assemble n monomères : combien de liaisons, combien d'eau libérée, quelle masse ?",
  but:"Choisis un type de monomère, ajoute ou retire des monomères avec les boutons (ou le curseur) et regarde l'eau partir ou revenir. Relève le défi : retrouver n à partir de la masse du polymère.",
  aRetenir:"Une chaîne linéaire de n monomères contient n − 1 liaisons ; sa formation libère n − 1 molécules d'eau (condensation) et son hydrolyse complète en consomme n − 1. Masse du polymère = n·M − (n − 1)·18,02. Une chaîne cyclique a n liaisons.",
  piege:"« n monomères, n liaisons » est faux pour une chaîne linéaire (n − 1), mais juste pour une chaîne circulaire (plasmide, peptide cyclique).",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(0,{ratio:.62}); if(c.H<250){}
    var tp=k.seg("Monomère",[["aa","Acide aminé"],["glc","Glucose"],["nuc","Nucléotide"]],"aa");
    var n=k.slider("Nombre de monomères n",2,300,1,8,"");
    var cy=k.toggle("Chaîne cyclique (circulaire)",false);
    var ro=k.readouts(["Liaisons formées","H₂O libérées","Masse du polymère (g/mol)","Somme des monomères libres (g/mol)"]);
    var M={aa:128,glc:180.16,nuc:327}, W2=18.02;
    var NM={aa:["Acide aminé","liaison peptidique",P.acc,128],glc:["Glucose","liaison glycosidique",P.amber,180.16],nuc:["Nucléotide","liaison phosphodiester",P.green,327]};
    var drops=[], lastN=n.value, lastT=tp.value, lastC=cy.value, goal=null, nt=k.note("",""), pts=[];
    function layout(m,cyc){
      var W=c.W,H=c.H,out=[],i;
      if(cyc){ var cx=W/2, cyy=H/2+4, R=Math.min(W*.42,H/2-36); for(i=0;i<m;i++){var a=2*Math.PI*i/m-Math.PI/2; out.push([cx+R*Math.cos(a),cyy+R*Math.sin(a)]);} }
      else { var per=Math.max(4,Math.min(12,Math.floor((W-40)/38))), rows=Math.ceil(m/per), gx=(W-60)/(Math.max(per,2)-1), gy=Math.min(64,(H-110)/Math.max(1,rows-1||1));
        for(i=0;i<m;i++){var r=Math.floor(i/per), q=i%per; if(r%2) q=per-1-q; out.push([30+q*gx,56+r*gy+(rows===1?(H-110)/2-10:0)]);} }
      return out;
    }
    function bead(x,y,r,t,col,i){
      var ctx=c.ctx;
      if(t==="aa"){ B.ball(c,x,y,r,col); S.draw.text(c,"R"+(i%5===0?"":""),x,y,{size:r*.9,color:"#fff"}); }
      else if(t==="glc"){ ctx.save(); ctx.beginPath(); for(var j=0;j<6;j++){var a=j*Math.PI/3+Math.PI/6; ctx.lineTo(x+r*1.08*Math.cos(a),y+r*1.08*Math.sin(a));} ctx.closePath();
        var g=ctx.createLinearGradient(x,y-r,x,y+r); g.addColorStop(0,B.mix(col,.5)); g.addColorStop(1,B.mix(col,-.25)); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle=B.mix(col,-.4); ctx.lineWidth=1.5; ctx.stroke(); ctx.restore(); S.draw.text(c,"O",x,y,{size:r*.8,color:"#fff"}); }
      else { ctx.save(); ctx.fillStyle=B.mix(col,.1); ctx.strokeStyle=B.mix(col,-.4); ctx.lineWidth=1.5; B.ball(c,x,y,r*.55,P.violet); S.draw.rrect(c,x-r*.85,y-r*1.05,r*.9,r*.9,3); ctx.fill(); ctx.stroke(); ctx.restore(); B.ball(c,x+r*.7,y+r*.6,r*.42,P.amber); }
    }
    function spawn(kind,x,y){ for(var q=0;q<3;q++) drops.push({x:x,y:y,t:0,kind:kind,dx:(Math.random()-.5)*34,dy:-26-Math.random()*20}); }
    function sync(){
      var m=Math.min(n.value,24), p=layout(m,cy.value), N=n.value;
      if(N!==lastN && tp.value===lastT && cy.value===lastC){
        var step=Math.min(Math.abs(N-lastN),4), kind=N>lastN?"out":"in", i;
        for(i=0;i<step;i++){ var b=Math.min(m-1, m-1-i); if(b>0&&p[b]&&p[b-1]) spawn(kind,(p[b][0]+p[b-1][0])/2,(p[b][1]+p[b-1][1])/2); }
      }
      lastN=N; lastT=tp.value; lastC=cy.value;
      if(goal){ var done=(N===goal.n&&cy.value===goal.cyc&&tp.value===goal.t); goal.done=done; }
    }
    function R(){
      var ctx=c.ctx; c.clear(); B.bg(c,"#f7fafc","#eaf2f8");
      var N=n.value, cyc=cy.value, t=tp.value, col=NM[t][2], m=Math.min(N,24);
      var bonds=cyc?N:N-1, mass=N*M[t]-bonds*W2;
      pts=layout(m,cyc); var r=Math.max(9,Math.min(15,c.W/34));
      var nb=cyc?m:m-1;
      for(var b=0;b<nb;b++){ var p1=pts[b], p2=pts[(b+1)%m]; ctx.strokeStyle="#8a95a3"; ctx.lineWidth=4; ctx.lineCap="round"; ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]); ctx.stroke();
        var mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2; ctx.fillStyle=P.teal; ctx.beginPath(); ctx.arc(mx,my,3.2,0,7); ctx.fill(); }
      pts.forEach(function(p,i){ bead(p[0],p[1],r,t,col,i); });
      if(!cyc&&pts.length){ S.draw.label(c,t==="aa"?"NH₂":t==="glc"?"extrémité réductrice":"5′",pts[0][0],pts[0][1]-r-10,{color:P.grey,size:10});
        var l=pts[m-1]; S.draw.label(c,t==="aa"?"COOH":t==="glc"?"extrémité non réd.":"3′",l[0],l[1]+r+11,{color:P.grey,size:10}); }
      /* gouttes d'eau */
      drops.forEach(function(d){ var u=d.t, x,y,a;
        if(d.kind==="out"){ x=d.x+d.dx*u; y=d.y+d.dy*u+34*u*u; a=1-u; } else { x=d.x+d.dx*(1-u); y=d.y+(d.dy)*(1-u)+34*(1-u)*(1-u); a=u<.2?u*5:1; }
        ctx.save(); ctx.globalAlpha=Math.max(0,a); ctx.fillStyle="#4aa8e0"; ctx.beginPath(); ctx.arc(x,y,4.2,0,7); ctx.fill(); ctx.restore(); S.draw.text(c,"H₂O",x+13,y,{size:9,color:P.teal}); });
      S.draw.text(c,NM[t][0]+" · "+NM[t][1]+(cyc?" · chaîne cyclique":""),c.W/2,16,{size:12,color:P.ink});
      var foot=N>24?m+" monomères dessinés sur "+N:"● vert = liaison formée, une H₂O libérée par liaison";
      S.draw.text(c,foot,c.W/2,c.H-12,{size:11,color:P.teal});
      if(goal){ B.goal(c,goal.done?"Défi réussi : "+goal.n+" monomères !":"Défi : masse cible "+S.fmt(goal.mass,1)+" g/mol → quel n ?",goal.done,c.H-34); }
      ro.set(0,S.fmt(bonds,0)); ro.set(1,S.fmt(bonds,0)); ro.set(2,S.fmt(mass,1)); ro.set(3,S.fmt(N*M[t],1));
      nt.set(goal&&!goal.done?"Défi en cours : la masse cible est "+S.fmt(goal.mass,1)+" g/mol (type : "+NM[goal.t][0].toLowerCase()+", "+(goal.cyc?"chaîne cyclique":"chaîne linéaire")+"). Ajuste n : ta masse actuelle est "+S.fmt(mass,1)+" g/mol.":
        "Hydrolyse complète : "+S.fmt(bonds,0)+" H₂O consommées, "+S.fmt(N,0)+" monomères retrouvés ; la masse remonte de "+S.fmt(mass,1)+" à "+S.fmt(N*M[t],1)+" g/mol (+ "+S.fmt(bonds*W2,1)+").",goal&&goal.done?"ok":"ok");
    }
    k.button("＋ Condensation (+1)",function(){ n.set(n.value+1); },true);
    k.button("− Hydrolyse (−1)",function(){ n.set(n.value-1); });
    k.button("Défi : retrouver n",function(){
      var N=3+Math.floor(Math.random()*40), t=tp.value, cyc=cy.value; goal={n:N,t:t,cyc:cyc,mass:N*M[t]-(cyc?N:N-1)*W2,done:false}; n.set(2);
    });
    k.draw(function(){ sync(); R(); });
    var lp=k.loop(function(dt){ var any=false; drops.forEach(function(d){ d.t+=dt*1.1; }); drops=drops.filter(function(d){ return d.t<1; }); if(drops.length||true){ R(); } }); lp.play();
  }
});

SFA.sim({
  id:"ub-c01-gaz-sang", ch:"c01", tag:"pH · tampon bicarbonate",
  titre:"Gaz du sang : pH = 6,1 + log([HCO₃⁻] / 0,03·pCO₂)",
  resume:"Fais varier le bicarbonate et la pCO₂ : lis le pH et le type de trouble acide-base.",
  but:"Place le point sur le réseau de courbes. Repère les acidoses/alcaloses respiratoires (pCO₂) et métaboliques (HCO₃⁻).",
  aRetenir:"Henderson-Hasselbalch pour CO₂/HCO₃⁻ : pH = 6,1 + log([HCO₃⁻] / (0,03·pCO₂)). Normal : HCO₃⁻ ≈ 24 mmol/L, pCO₂ ≈ 40 mmHg → rapport 20 → pH ≈ 7,40. Le pH dépend du RAPPORT, pas d'une seule valeur. Pont avec la chimie : tampons et équilibres acide-base.",
  piege:"Une pCO₂ élevée acidifie (CO₂ + H₂O ⇌ H⁺ + HCO₃⁻) : c'est la cause d'une acidose respiratoire, pas une conséquence de l'alcalose. Rappel : le rein corrige HCO₃⁻ (heures-jours), le poumon corrige pCO₂ (minutes).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var hc=k.slider("[HCO₃⁻]",5,45,1,24,"mmol/L");
    var pc=k.slider("pCO₂",15,90,1,40,"mmHg");
    var ro=k.readouts(["Rapport HCO₃⁻ / (0,03·pCO₂)","pH","Interprétation"]);
    var nt=k.note("","");
    function ph(h,p){ return 6.1+Math.log10(h/(0.03*p)); }
    k.draw(function(){
      c.clear(); var ctx=c.ctx;
      var ax=S.draw.axes(c,{t:28,x0:10,x1:100,y0:6.2,y1:8.2,stepX:10,stepY:0.2,xl:"pCO₂ (mmHg)",yl:"pH"});
      ctx.fillStyle="rgba(46,107,85,.13)"; ctx.fillRect(ax.X(35),ax.Y(7.45),ax.X(45)-ax.X(35),ax.Y(7.35)-ax.Y(7.45));
      [[12,P.grey],[24,P.green],[36,P.grey]].forEach(function(o){
        S.draw.fn(c,ax,function(p){return ph(o[0],p);},o[1],o[0]===24?2.6:1.6,o[0]===24?null:[5,4]);
        S.draw.text(c,o[0]+" mmol/L",ax.X(96),ax.Y(ph(o[0],96))-9,{size:10,color:o[1],align:"right"});
      });
      var H=hc.value, p=pc.value, v=ph(H,p);
      S.draw.dot(c,ax.X(p),ax.Y(v),7,P.red);
      S.draw.text(c,"pH "+S.fmt(v,2),ax.X(p)+10,ax.Y(v)-12,{size:12,color:P.red,align:"left"});
      var r=H/(0.03*p), dx;
      var acid=v<7.35, alc=v>7.45;
      if(acid){ dx = (H<22&&p>45)?"Acidose mixte (métabolique + respiratoire)": p>45?"Acidose respiratoire": H<22?"Acidose métabolique":"Acidémie (valeurs limites)"; }
      else if(alc){ dx = (H>26&&p<35)?"Alcalose mixte": H>26?"Alcalose métabolique": p<35?"Alcalose respiratoire":"Alcalémie (valeurs limites)"; }
      else { dx = (H>=22&&H<=26&&p>=35&&p<=45)?"Équilibre normal": "pH normal mais anomalies compensées ou associées"; }
      ro.set(0,S.fmt(r,1)); ro.set(1,S.fmt(v,2)); ro.set(2,dx);
      nt.set("Zone verte : pH 7,35-7,45 et pCO₂ 35-45 mmHg. Valeurs de référence : HCO₃⁻ 22-26 mmol/L. Un rapport de 20 donne un pH de 7,40 ; doubler la pCO₂ à bicarbonate constant divise le rapport par 2 (− 0,30 unité de pH).",Math.abs(v-7.4)<=0.05?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"ub-c01-capacite-tampon", ch:"c01", tag:"Tampon · classique",
  titre:"Capacité d'un tampon : où et jusqu'où il protège",
  resume:"Ajoute de l'acide fort à un tampon : le pH bouge peu près du pKa, brutalement quand il est épuisé.",
  but:"Choisis le couple, sa concentration totale et le pH de départ, puis ajoute de l'acide (ou de la base) fort.",
  aRetenir:"Un tampon est efficace pour pH = pKa ± 1, et surtout quand [A⁻] ≈ [HA]. Sa capacité croît avec la concentration totale. Le phosphate (pKa ≈ 6,8) tamponne le cytosol (pH ≈ 7,2) ; le bicarbonate (pKa 6,1) tamponne le plasma grâce au poumon qui évacue le CO₂. Pont : chimie, tampons et Henderson-Hasselbalch.",
  piege:"Un tampon n'est pas infini : quand tout A⁻ (ou tout HA) est consommé, le pH s'effondre. Henderson-Hasselbalch ne s'applique plus.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(320);
    var sel=k.select("Couple tampon",[["6.1","Bicarbonate CO₂/HCO₃⁻ (pKa 6,1)"],["6.8","Phosphate H₂PO₄⁻/HPO₄²⁻ (pKa 6,8)"],["9.25","Ammonium NH₄⁺/NH₃ (pKa 9,25)"]],"6.8");
    var C=k.slider("Concentration totale",5,100,1,20,"mmol/L");
    var p0=k.slider("pH de départ",5,9,0.05,7.2,"");
    var h=k.slider("Acide fort ajouté (négatif = base forte)",-40,40,0.5,10,"mmol/L");
    var ro=k.readouts(["pH final","Variation de pH","Capacité β au départ (mmol/L par unité pH)"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear();
      var pKa=parseFloat(sel.value), Ct=C.value, r=Math.pow(10,p0.value-pKa), HA=Ct/(1+r), A=Ct-HA;
      function phAfter(x){ var a=A-x, ha=HA+x; return pKa+Math.log10(a/ha); }
      var ax=S.draw.axes(c,{t:28,x0:-40,x1:40,y0:4,y1:10,stepX:10,stepY:1,xl:"acide fort ajouté (mmol/L)",yl:"pH"});
      var lo=-HA, hi=A; var eps=0.02;
      var ctx=c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath(); var st=false;
      for(var x=Math.max(-40,lo+eps);x<=Math.min(40,hi-eps);x+=0.05){ var y=phAfter(x); if(!st){ctx.moveTo(ax.X(x),ax.Y(y));st=true;} else ctx.lineTo(ax.X(x),ax.Y(y)); }
      ctx.stroke(); ctx.restore();
      S.draw.line(c,ax.L,ax.Y(pKa),ax.R,ax.Y(pKa),P.amber,1.5,[5,4]);
      S.draw.text(c,"pKa "+S.fmt(pKa,2),ax.R-4,ax.Y(pKa)-8,{size:11,color:P.amber,align:"right"});
      var x0=h.value, ok=(A-x0>0.001 && HA+x0>0.001);
      var Ka=Math.pow(10,-pKa), Hh=Math.pow(10,-p0.value), beta=2.303*(Ct/1000)*Ka*Hh/Math.pow(Ka+Hh,2)*1000;
      ro.set(2,S.fmt(beta,2));
      if(ok){ var f=phAfter(x0), fOut=(f<4||f>10); S.draw.dot(c,ax.X(x0),ax.Y(Math.max(4,Math.min(10,f))),6,P.red); S.draw.dot(c,ax.X(0),ax.Y(p0.value),5,P.green);
        ro.set(0,S.fmt(f,2)); ro.set(1,S.fmt(f-p0.value,2));
        nt.set("Départ : [A⁻] = "+S.fmt(A,1)+" et [HA] = "+S.fmt(HA,1)+" mmol/L. Après ajout : [A⁻] = "+S.fmt(A-x0,1)+" et [HA] = "+S.fmt(HA+x0,1)+" mmol/L."+(fOut?" Le pH final sort de l'échelle du graphique (4 à 10) : le point est collé au bord.":"")+" Modèle simplifié : système fermé (pour le bicarbonate réel, le poumon évacue le CO₂ et le tampon est bien plus efficace).",(Math.abs(p0.value-pKa)<=1&&!fOut)?"ok":"warn");
      } else { ro.set(0,"tampon épuisé"); ro.set(1,"—");
        nt.set("Plus assez de "+(x0>0?"base conjuguée A⁻":"acide HA")+" : l'ajout dépasse la réserve ("+S.fmt(x0>0?A:HA,1)+" mmol/L). Le pH n'est plus tamponné et chute (ou grimpe) brutalement.","bad"); }
    });
  }
});

SFA.sim({
  id:"ub-c01-acides-gras-fluidite", ch:"c01", tag:"Lipides · niche",
  titre:"Acides gras : longueur, insaturations et fluidité membranaire",
  resume:"Compare la température de fusion de 11 acides gras réels : cis, trans, longueur de chaîne.",
  but:"Choisis un acide gras, déplace la température et vois s'il est ordonné (rigide) ou fluide. Les barres donnent le point de fusion de tous les acides gras.",
  aRetenir:"Chaîne plus longue → plus d'interactions de van der Waals → point de fusion plus haut. Une double liaison cis coude la chaîne, empêche l'empilement et abaisse fortement le point de fusion (18:0 : 70 °C ; 18:1 cis : 13 °C). Une liaison trans garde une chaîne droite : 44 °C. Dans les membranes, les chaînes insaturées maintiennent la fluidité.",
  piege:"Les acides gras insaturés naturels sont cis. Les « graisses trans » (élaïdique) ressemblent aux saturés par leur forme et leur point de fusion. Le cholestérol, lui, rigidifie les membranes chaudes mais empêche la solidification des froides (effet tampon de fluidité).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(340);
    var F=[["Laurique","12:0",12,[],43.2],["Myristique","14:0",14,[],54.4],["Palmitique","16:0",16,[],62.9],["Stéarique","18:0",18,[],69.6],["Arachidique","20:0",20,[],75.4],
      ["Oléique (cis)","18:1 cis Δ9",18,[9],13.4],["Élaïdique (trans)","18:1 trans Δ9",18,["t9"],44],["Linoléique","18:2 cis Δ9,12",18,[9,12],-5],["α-Linolénique","18:3 cis Δ9,12,15",18,[9,12,15],-11],["Arachidonique","20:4 cis",20,[5,8,11,14],-49.5],["Palmitoléique","16:1 cis Δ9",16,[9],0.5]];
    var sel=k.select("Acide gras",F.map(function(f,i){return [i,f[0]+" ("+f[1]+")"];}),3);
    var tt=k.slider("Température",-60,90,1,37,"°C");
    var ro=k.readouts(["Point de fusion","État à cette température"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, f=F[sel.value], T=tt.value, Tm=f[4];
      /* chaîne */
      var n=f[2], dx=(c.W-80)/22, x=40, y=60, sg=1, ang=0.5, xs=[x], ys=[y];
      var dbl=f[3].map(function(d){return typeof d==="string"?{p:parseInt(d.slice(1)),cis:false}:{p:d,cis:true};});
      for(var i=1;i<n;i++){ var d=dbl.filter(function(q){return q.p===i;})[0];
        x+=dx*Math.cos(ang); y+=sg*dx*Math.sin(ang); xs.push(x); ys.push(y);
        if(!(d&&d.cis)) sg=-sg; }
      var shiftY=(Math.min.apply(null,ys)+Math.max.apply(null,ys))/2;
      ctx.save(); ctx.translate(0,70-shiftY); ctx.lineJoin="round";
      for(var j=1;j<n;j++){ var d2=dbl.filter(function(q){return q.p===j;})[0];
        S.draw.line(c,xs[j-1],ys[j-1],xs[j],ys[j],d2?P.red:P.ink,d2?3.4:2.4); }
      xs.forEach(function(xx,ii){ S.draw.dot(c,xx,ys[ii],3,ii===0?P.red:P.grey); });
      ctx.restore();
      S.draw.text(c,"COOH",xs[0]-2,28,{size:11,color:P.red,align:"center"});
      S.draw.text(c,"CH₃",xs[n-1]+8,28,{size:11,color:P.grey});
      S.draw.text(c,f[0]+" · "+f[1]+" · "+(f[3].length&&typeof f[3][0]==="number"?"coude(s) cis":"chaîne droite"),c.W/2,c.H-150,{size:12,color:P.ink});
      /* barres de Tm */
      var bx0=44,bw=(c.W-70)/F.length, zero=c.H-60, sc=0.62;
      S.draw.line(c,bx0-6,zero,c.W-8,zero,"#8a95a3",1);
      S.draw.text(c,"Point de fusion (°C)",bx0,c.H-138+10,{size:10,color:P.grey,align:"left"});
      F.forEach(function(g,i){ var h=g[4]*sc*0.9, xx=bx0+i*bw; ctx.fillStyle=(i==sel.value)?P.acc:(g[4]>T?"#c8d1de":"#a8cdbb");
        ctx.fillRect(xx+3,h>=0?zero-h:zero,bw-6,Math.abs(h)); S.draw.text(c,S.fmt(g[4],0),xx+bw/2,h>=0?zero-h-8:zero-h+8,{size:9,color:P.ink});
        S.draw.text(c,g[1].split(" ")[0]+(g[1].indexOf("trans")>0?"t":g[1].indexOf("cis")>0?"c":""),xx+bw/2,c.H-12,{size:9,color:P.grey}); });
      var yT=zero-T*sc*0.9; S.draw.line(c,bx0-6,yT,c.W-8,yT,P.red,1.6,[5,4]);
      S.draw.text(c,S.fmt(T,0)+" °C",c.W-10,yT-8,{size:11,color:P.red,align:"right"});
      ro.set(0,S.fmt(Tm,1)+" °C"); ro.set(1,T<Tm?"solide / ordonné (gel)":"liquide / fluide");
      nt.set("Barres vertes : fluides à "+S.fmt(T,0)+" °C ; grises : encore solides. Valeurs expérimentales usuelles des acides gras libres (les valeurs peuvent différer de quelques degrés selon la source) ; dans une membrane, ce sont les chaînes des phospholipides qui comptent.","ok");
    });
  }
});

/* BIO3D-BEGIN:s_c01_helice.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c01-3d-helice-alpha", ch:"c01", tag:"Protéines · 3D",
  titre:"L'hélice α en 3D : un ressort tenu par des liaisons H",
  resume:"Fais tourner l'hélice, étire-la, casse ses liaisons hydrogène : 3,6 acides aminés par tour, liaison i → i+4.",
  but:"Glisse pour faire pivoter la molécule. Ajoute des acides aminés, puis augmente la dénaturation (chaleur, urée) : les liaisons H se rompent et la chaîne s'étire.",
  aRetenir:"Dans l'hélice α, chaque C=O forme une liaison hydrogène avec le N–H situé 4 acides aminés plus loin (i → i+4). Il y a 3,6 résidus par tour, un pas de 0,54 nm (0,15 nm par résidu) et les chaînes latérales pointent vers l'extérieur. Ce sont des liaisons faibles mais nombreuses : leur somme stabilise la structure secondaire.",
  piege:"Ce ne sont pas les chaînes latérales qui tiennent l'hélice, mais les liaisons H du squelette peptidique (donc possibles pour presque tous les acides aminés). Dénaturer ne casse pas les liaisons peptidiques : la séquence (structure primaire) reste intacte. Les distances sont à l'échelle, mais les atomes sont simplifiés (seuls les Cα et les groupes C=O sont figurés).",
  build:function(k,S){
    var c = k.canvas(380), pal = P(S), v = V3(c, S, {yaw:0.6, pit:0.25, D:9});
    var n = k.slider("Acides aminés dans la chaîne", 8, 30, 1, 18, "");
    var den = k.slider("Dénaturation (chaleur, urée)", 0, 100, 1, 0, "%");
    var hb = k.toggle("Montrer les liaisons hydrogène", true);
    var sc = k.toggle("Montrer les chaînes latérales", true);
    var ro = k.readouts(["Longueur", "Tours", "Liaisons H", "Structure"]);
    var cols = [pal.acc, pal.teal, pal.violet, pal.amber, pal.green];
    k.note("Modèle simplifié : la transition hélice → chaîne étirée est représentée de façon continue ; en réalité elle est coopérative (« tout ou presque rien »).", "warn");
    function pos(i, d, N){
      var th = i * 100 * Math.PI / 180, hel = [0.23 * Math.cos(th), i * 0.15, 0.23 * Math.sin(th)];
      var ext = [(i % 2 ? 0.1 : -0.1) * Math.cos(0.5), i * 0.33, (i % 2 ? 0.07 : -0.07)];
      var cy = ((N - 1) * (0.15 * (1 - d) + 0.33 * d)) / 2;
      return [hel[0] * (1 - d) + ext[0] * d, hel[1] * (1 - d) + ext[1] * d - cy, hel[2] * (1 - d) + ext[2] * d];
    }
    function R(){
      c.clear(); var N = n.value, d = den.value / 100;
      var len = (N - 1) * (0.15 * (1 - d) + 0.33 * d);
      v.sc = Math.min(c.H * 0.8 / Math.max(len + 0.8, 2.5), 150);
      var pts = []; for (var i = 0; i < N; i++) pts.push(pos(i, d, N));
      var nH = 0;
      for (i = 0; i < N - 1; i++) v.seg(pts[i], pts[i + 1], 0.07, "#8a95a3", 1);
      for (i = 0; i < N; i++){
        var th = i * 100 * Math.PI / 180, p = pts[i];
        v.ball(p[0], p[1], p[2], 0.09, "#4b5563");
        var oc = [p[0], p[1] + 0.1 * (1 - d), p[2]];
        v.ball(oc[0] + 0.08 * Math.cos(th) * (1 - d), oc[1] + 0.05, oc[2] + 0.08 * Math.sin(th) * (1 - d), 0.075, pal.red);
        if (sc.value){
          var r = 0.26 + 0.12 * (1 - d) * 0 , out = [p[0] + Math.cos(th) * 0.3, p[1], p[2] + Math.sin(th) * 0.3];
          if (d > 0.5) out = [p[0] + (i % 2 ? 0.28 : -0.28), p[1], p[2] + (i % 2 ? 0.2 : -0.2)];
          v.seg(p, out, 0.04, "#8a95a3", 0.9);
          v.ball(out[0], out[1], out[2], 0.11, cols[i % 5]);
        }
      }
      var formed = d < 0.5;
      if (hb.value) for (i = 0; i + 4 < N; i++){
        var a = pts[i], b = pts[i + 4], dist = Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
        if (formed){ nH++; v.seg([a[0], a[1] + 0.1, a[2]], [b[0], b[1] - 0.02, b[2]], 0.03, pal.amber, 0.9, [3, 3]); }
        else if (d < 0.8) v.seg([a[0], a[1] + 0.1, a[2]], [b[0], b[1], b[2]], 0.02, pal.amber, 0.25, [2, 6]);
      }
      if (!hb.value && formed) nH = N - 4;
      v.flush();
      S.draw.text(c, "Cα gris · C=O rouge", c.W / 2, c.H - 28, {size:11, color:pal.grey});
      S.draw.text(c, "liaison H i → i+4 : pointillés orange", c.W / 2, c.H - 12, {size:11, color:pal.grey});
      ro.set(0, S.fmt(len, 2) + " nm"); ro.set(1, formed ? S.fmt(N / 3.6, 1) : "—"); ro.set(2, nH + " / " + Math.max(0, N - 4)); 
      ro.set(3, d < 0.05 ? "hélice α" : d < 0.5 ? "hélice qui s'étire" : "chaîne dénaturée");
    }
    k.draw(R);
    var lp = k.loop(function(dt){ v.spin(dt); R(); }); lp.play();
  }
});

})();
/* BIO3D-END:s_c01_helice.js */
