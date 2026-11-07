(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function fT(t){ return t<=30 ? Math.pow(2,(t-30)/10) : Math.max(0,1-Math.pow((t-30)/15,2)); }

/* ===== 1 · Plante aquatique ===== */
SFA.sim({
  id:"b3-c08-plante-aquatique", ch:"c08", tag:"Classique · tombe souvent",
  titre:"L'élodée et ses bulles de dioxygène",
  resume:"Rapproche la lampe, ajoute du CO₂ dissous : combien de bulles de O₂ par minute ?",
  but:"Règle la distance de la lampe et la quantité d'hydrogénocarbonate (source de CO₂ dissous). Compte les bulles. Éteins la lampe pour comparer.",
  aRetenir:"À la lumière, une plante verte aquatique rejette du dioxygène (bulles) : c'est la photosynthèse. Plus on rapproche la lampe, plus l'éclairement augmente (il varie comme 1 / distance²) et plus il y a de bulles, jusqu'à un plateau. Sans CO₂ dissous ou sans lumière, la production s'arrête.",
  piege:"Les bulles ne sont pas du CO₂ : c'est du dioxygène, produit à partir du CO₂ et de l'eau. L'éclairement ne diminue pas de moitié quand on double la distance : il est divisé par 4. Dans le noir, la plante respire : elle ne dégage plus de bulles. (Modèle simplifié, valeurs indicatives.)",
  build:function(k,S){
    var c = k.canvas(300);
    var ds = k.slider("Distance de la lampe", 10, 100, 5, 30, "cm");
    var cb = k.slider("CO₂ dissous (hydrogénocarbonate)", 0, 10, .5, 3, "g/L");
    var on = k.toggle("Lampe allumée", true);
    var ro = k.readouts(["Éclairement (20 cm = 100 %)","Bulles par minute","O₂ produit en 1 h"]);
    var nt = k.note("","");
    var bubbles = [], acc = 0;
    function rate(){ if (!on.value) return 0; var I = Math.pow(20/ds.value,2), C = .15 + cb.value; return 40*(I/(I+1))*(C/(C+1)); }
    var lp = k.loop(function(dt){
      acc += rate()/60*6*dt; while (acc >= 1){ acc -= 1; bubbles.push({x:0,y:0,s:.6+Math.random()*.8,ph:Math.random()*6}); }
      bubbles.forEach(function(b){ b.y += 40*b.s*dt; }); bubbles = bubbles.filter(function(b){ return b.y < 130; }); k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); var g = c.ctx, r = rate(), bx = c.W*.55, by = 70, bw = Math.min(150,c.W*.42), bh = 170;
      /* bécher */
      rect(c,bx-bw/2,by,bw,bh,"rgba(170,215,245,.45)",P.ink,2.5,6);
      /* plante */
      g.save(); g.strokeStyle = "#2e8b57"; g.lineWidth = 3; g.beginPath(); g.moveTo(bx,by+bh-8); g.lineTo(bx,by+bh-80); g.stroke();
      for (var i=0;i<7;i++){ var yy = by+bh-14-i*10; g.fillStyle = "#3fa664"; g.beginPath(); g.ellipse(bx-9,yy,10,3.2,-.3,0,6.2832); g.fill(); g.beginPath(); g.ellipse(bx+9,yy-4,10,3.2,.3,0,6.2832); g.fill(); } g.restore();
      /* lampe et rayons */
      var lx = Math.max(18, bx-bw/2-12-(ds.value-10)/90*(bx-bw/2-40)), ly = by+bh*.45;
      if (on.value){ var nR = Math.max(1,Math.round(6/ (ds.value/20))); for (i=-2;i<=2;i++) D.line(c,lx+10,ly+i*10,bx-bw/2,ly+i*12,"rgba(244,197,66,.75)",1.5); }
      circ(c,lx,ly,12,on.value?"#ffe27a":"#ddd",P.ink,2); D.line(c,lx-5,ly+12,lx-5,ly+30,P.ink,3);
      T(c,"lampe",lx,ly+44,{size:12,color:P.grey}); T(c,"distance : "+ds.value+" cm",c.W/2,18,{size:13,color:P.ink});
      bubbles.forEach(function(b){ circ(c,bx+Math.sin(b.ph+b.y/18)*6, by+bh-72-b.y*1.0, 2.5*b.s+1.5,"rgba(255,255,255,.8)","#4a90c2",1.2); });
      T(c,"film accéléré ×6",c.W-8,c.H-8,{size:12,align:"right",color:P.grey});
      var I = Math.pow(20/ds.value,2)*100;
      ro.set(0,S.fmt(I,0)+" %"); ro.set(1,S.fmt(r,0)+" / min"); ro.set(2,S.fmt(r*60*.003,1)+" mL");
      nt.set(!on.value ? "Lampe éteinte : plus de photosynthèse, donc plus de bulles (la plante respire seulement)." : cb.value===0 ? "Presque pas de CO₂ dissous : la plante manque de matière première, la production est très faible." : r>=25 ? "Plateau : un autre facteur limite maintenant (ici, la capacité de la plante)." : "Rapproche la lampe ou ajoute du CO₂ : le nombre de bulles augmente.","ok");
    });
  }
});

/* ===== 2 · Facteurs limitants ===== */
SFA.sim({
  id:"b3-c08-facteurs-limitants", ch:"c08", tag:"Modèle chiffré · manipulation directe",
  titre:"Facteurs limitants : la courbe qui plafonne",
  resume:"Fais varier un seul facteur, les autres étant fixés : la courbe monte puis plafonne. Quel est le facteur limitant ?",
  but:"Le tonneau de Liebig : le niveau d'eau (la photosynthèse) ne monte pas plus haut que la planche la plus courte. Tire sur le haut d'une planche (ou utilise les curseurs) et trouve le facteur limitant. Défi : atteindre 100 % en changeant le moins de facteurs possible.",
  aRetenir:"La vitesse de la photosynthèse dépend de la lumière, du CO₂ et de la température. Tant qu'un facteur est insuffisant, il limite le processus : en l'augmentant, la photosynthèse augmente ; une fois le plateau atteint, c'est un autre facteur qui limite. Pour augmenter la production, on agit sur le facteur limitant, pas sur les autres.",
  piege:"Augmenter un facteur qui n'est pas limitant ne change rien (plateau). Et trop de chaleur détruit les enzymes : la courbe de température monte puis retombe. (Modèle simplifié de type Blackman : valeurs indicatives, air = 420 ppm de CO₂.)",
  build:function(k,S){
    var cb = k.canvas(0,{ratio:.86});
    var c = k.canvas(250);
    var ab = k.seg("Courbe selon", [["L","Lumière"],["C","CO₂"],["T","Température"]], "L");
    var L = k.slider("Lumière", 0, 100, 5, 30, "% du plein soleil");
    var C = k.slider("CO₂", 0, 1500, 50, 400, "ppm");
    var Tt = k.slider("Température", 0, 45, 1, 22, "°C");
    var ro = k.readouts(["Photosynthèse","Facteur limitant"]);
    var nt = k.note("","");
    function fL(l){ return Math.min(1,l/60); } function fC(cc){ return Math.min(1,cc/800); }
    function P_(l,cc,t){ return 100*Math.min(fL(l),fC(cc),fT(t)); }
    var GE = [];
    function setStave(i,h){ h=Math.max(.04,Math.min(1,h)); if (i===0) L.set(Math.round(h*60/5)*5); else if (i===1) C.set(Math.round(h*800/50)*50); else Tt.set(Math.round(30+10*Math.log(h)/Math.LN2)); }
    var dr = -1;
    cb.pointer(function(type,p){ if (type==="down"){ dr=-1; GE.forEach(function(q,i){ if (p.x>=q.x-4 && p.x<=q.x+q.w+4 && p.y>=q.top-30 && p.y<=q.base+6) dr=i; }); }
      if (type==="up") dr=-1; if (dr>=0){ var q=GE[dr]; setStave(dr,(q.base-p.y)/q.hmax); k.redraw(); } });
    function barrel(){
      cb.clear(); var g=cb.ctx, W=cb.W, H=cb.H, a=fL(L.value), b=fC(C.value), t=fT(Tt.value), mn=Math.min(a,b,t), pp=100*mn;
      var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#eef6fb"); bgc.addColorStop(1,"#e5eef6"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      var bw=Math.min(W*.62,320), x0=(W-bw)/2-W*.06, base=H*.78, hmax=H*.62, sw=bw/3-6;
      var vals=[a,b,t], nm=["Lumière","CO₂","Température"], col=["#f2c14e","#8f9bad","#e0603f"], dk=["#b98a1a","#5e6a7d","#a8381d"], sub=[L.value+" %",C.value+" ppm",Tt.value+" °C"];
      GE=[]; g.fillStyle="#a9d6ee"; g.fillRect(x0-6,base-hmax*mn,bw+12,hmax*mn);
      g.fillStyle="rgba(255,255,255,.35)"; g.fillRect(x0-6,base-hmax*mn,bw+12,3); D.line(cb,x0-14,base-hmax*mn,x0+bw+14,base-hmax*mn,"#2f7fd1",2,[5,4]);
      vals.forEach(function(v,i){ var x=x0+i*(sw+9), h=Math.max(10,hmax*v), top=base-h;
        GE.push({x:x,w:sw,top:top,base:base,hmax:hmax});
        var gr=g.createLinearGradient(x,0,x+sw,0); gr.addColorStop(0,col[i]); gr.addColorStop(.5,"#fff7"); gr.addColorStop(1,col[i]);
        g.fillStyle=col[i]; D.rrect(c0b(),x,top,sw,h,5); g.fill(); g.fillStyle="rgba(255,255,255,.28)"; g.fillRect(x+4,top+4,5,h-8); g.strokeStyle=dk[i]; g.lineWidth=2; D.rrect(c0b(),x,top,sw,h,5); g.stroke();
        var low = v===mn && mn<.999;
        D.text(c0b(),nm[i],x+sw/2,base+17,{size:11.5,color:"#243044"}); D.text(c0b(),sub[i],x+sw/2,base+32,{size:11,color:P.grey});
        if (low) D.label(c0b(),"limitant",x+sw/2,top-16,{size:11,color:P.red});
        g.beginPath(); g.arc(x+sw/2,top-1,0,0,6.3); D.glow(cb,x+sw/2,top,16,"#6236c4",.3); g.beginPath(); g.arc(x+sw/2,top,6,0,6.3); g.fillStyle="#fff"; g.fill(); g.strokeStyle=P.violet; g.lineWidth=2.5; g.stroke(); });
      g.strokeStyle="#6c7a8c"; g.lineWidth=5; [.3,.78].forEach(function(f){ g.beginPath(); g.moveTo(x0-8,base-hmax*f*.9); g.lineTo(x0+bw+8,base-hmax*f*.9); g.stroke(); });
      g.fillStyle="#7a5232"; g.fillRect(x0-8,base,bw+16,6);
      D.display(cb,S.fmt(pp,0)+" %",W-Math.min(60,W*.16)-4,H*.1,{w:Math.min(110,W*.28),h:50,caption:"photosynthèse"});
      
    }
    function c0b(){ return cb; }
    k.draw(function(){
      barrel(); c.clear(); var m = ab.value, rg = {L:[0,100,"lumière (%)",L.value],C:[0,1500,"CO₂ (ppm)",C.value],T:[0,45,"température (°C)",Tt.value]}[m];
      var ax = D.axes(c,{x0:rg[0],x1:rg[1],y0:0,y1:105,xl:rg[2],yl:"photosynthèse (%)",stepY:25,l:50});
      var f = function(x){ return P_(m==="L"?x:L.value,m==="C"?x:C.value,m==="T"?x:Tt.value); };
      D.fn(c,ax,f,P.green,3.2); var p = f(rg[3]); D.dot(c,ax.X(rg[3]),ax.Y(p),7,P.violet);
      var a = fL(L.value), b = fC(C.value), t = fT(Tt.value), lim, mn = Math.min(a,b,t);
      lim = mn>=.999 ? "aucun (plateau)" : (t<=a && t<=b) ? "température" : (a<=b ? "lumière" : "CO₂");
      ro.set(0,S.fmt(p,0)+" %"); ro.set(1,lim);
      nt.set(mn>=.999 ? "Tous les facteurs sont suffisants : la photosynthèse est à son maximum." : "Facteur limitant : <b>"+lim+"</b>. Augmente-le pour faire monter la photosynthèse ; augmenter les autres ne change rien."+(t<.3&&Tt.value>35?" (À cette température, les enzymes sont détruites.)":""), mn>=.999 ? "ok" : "warn");
    });
  }
});

/* ===== 3 · Test à l'iode ===== */
SFA.sim({
  id:"b3-c08-test-iode", ch:"c08", tag:"Expérience virtuelle",
  titre:"Test à l'iode : où la feuille a-t-elle fabriqué de l'amidon ?",
  resume:"Feuille éclairée ou dans le noir, bande d'aluminium, bord blanc, sans CO₂ : où l'iode bleuit-il ?",
  but:"Prépare la plante (obscurité préalable ou non, lumière, masque, CO₂, durée), puis compare la feuille avant et après le test.",
  aRetenir:"Le glucose fabriqué est stocké sous forme d'amidon, que l'iode colore en bleu-noir. L'amidon n'apparaît que dans les parties vertes éclairées et en présence de CO₂ : lumière, chlorophylle et CO₂ sont nécessaires. Procédure : ébouillanter, décolorer à l'alcool chaud, puis ajouter l'iode.",
  piege:"Si la plante n'a pas été mise à l'obscurité au préalable, elle contient déjà de l'amidon : le résultat est faussé (même la partie masquée peut bleuir). La coloration brun-jaune de l'iode seul n'est pas « de l'amidon ». (Quantités d'amidon qualitatives.)",
  build:function(k,S){
    var c = k.canvas(300);
    var pr = k.toggle("Plante mise à l'obscurité 48 h avant (sans amidon au départ)", true);
    var lu = k.seg("Éclairement", [["l","Lumière"],["n","Obscurité"]], "l");
    var h = k.slider("Durée", 0, 8, 1, 4, "h");
    var al = k.toggle("Bande d'aluminium au milieu de la feuille", true);
    var cb = k.toggle("Avec CO₂ (sinon : potasse qui l'absorbe)", true);
    var pa = k.toggle("Feuille panachée (bord blanc, sans chlorophylle)", true);
    var ro = k.readouts(["Zone verte éclairée","Zone sous l'aluminium","Bord blanc"]);
    var nt = k.note("","");
    function lv(){
      var S0 = pr.value ? 0 : .55, light = lu.value==="l" && cb.value, gain = light ? Math.min(1,S0+.2*h.value) : Math.max(0,S0-.08*h.value);
      var mask = Math.max(0,S0-.08*h.value);
      return {green:(lu.value==="l"&&cb.value)?gain:mask, mask:mask, white:Math.max(0,S0-.08*h.value)};
    }
    function leaf(x,y,w,hh){ var g = c.ctx; g.beginPath(); g.moveTo(x,y+hh/2); g.bezierCurveTo(x+w*.25,y-hh*.1,x+w*.75,y-hh*.1,x+w,y+hh/2); g.bezierCurveTo(x+w*.75,y+hh*1.1,x+w*.25,y+hh*1.1,x,y+hh/2); g.closePath(); }
    function colI(s){ return mix([206,170,105],[22,18,70],s); }
    k.draw(function(){
      c.clear(); var g = c.ctx, v = lv(), lw = Math.min(150,(c.W-40)/2), x1 = c.W/2-lw-10, x2 = c.W/2+10, y = 70, hh = 100;
      [[x1,"Avant le test",false],[x2,"Après décoloration + iode",true]].forEach(function(q){
        var x = q[0], after = q[2];
        g.save(); leaf(x,y,lw,hh); g.clip();
        g.fillStyle = after ? colI(v.green) : "#43a35e"; g.fillRect(x,y-10,lw,hh+20);
        if (pa.value){ g.lineJoin = "round"; leaf(x,y,lw,hh); g.lineWidth = 24; g.strokeStyle = after ? colI(v.white) : "#f4f7ee"; g.stroke(); }
        if (al.value){ g.fillStyle = after ? colI(v.mask) : "#b8bec6"; g.fillRect(x,y+hh*.38,lw,hh*.24); }
        g.strokeStyle = after ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.55)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x,y+hh/2); g.lineTo(x+lw,y+hh/2); for (var i=1;i<4;i++){ g.moveTo(x+lw*i/4,y+hh/2); g.lineTo(x+lw*i/4+lw*.1,y+hh*.12); g.moveTo(x+lw*i/4,y+hh/2); g.lineTo(x+lw*i/4+lw*.1,y+hh*.88); } g.stroke();
        g.restore(); leaf(x,y,lw,hh); g.strokeStyle = P.ink; g.lineWidth = 2; g.stroke();
        T(c,q[1],x+lw/2,y-26,{size:12,color:P.ink});
      });
      D.arrow(c,c.W/2-8,y+hh/2,c.W/2+8,y+hh/2,P.grey,2);
      function lab(s){ return s>.66 ? "bleu-noir (beaucoup d'amidon)" : s>.2 ? "bleu-violet (un peu d'amidon)" : "brun-jaune (pas d'amidon)"; }
      T(c,"1) ébouillanter  2) décolorer (alcool chaud)  3) iode",c.W/2,y+hh+40,{size:12,color:P.grey});
      ro.set(0,lab(v.green)); ro.set(1,al.value ? lab(v.mask) : "—"); ro.set(2,pa.value ? lab(v.white) : "—");
      var noSyn = (lu.value==="n"||!cb.value), wrong = !pr.value && ((al.value && v.mask>.2) || (pa.value && v.white>.2) || (noSyn && v.green>.2));
      nt.set(wrong ? "Attention : la plante contenait déjà de l'amidon. Des zones qui n'ont pas pu en fabriquer (sous l'aluminium, bord blanc, ou feuille sans lumière ou sans CO₂) bleuissent aussi : l'expérience ne prouve plus rien. Mets d'abord la plante à l'obscurité." : (lu.value==="n"||!cb.value) ? "Sans lumière ou sans CO₂, il ne se forme pas d'amidon : la feuille reste brun-jaune après le test." : h.value===0 ? "Durée nulle : pas le temps de fabriquer de l'amidon." : "L'amidon n'apparaît que dans la partie verte éclairée : lumière, chlorophylle et CO₂ sont nécessaires à la photosynthèse.", wrong ? "warn" : "ok");
    });
  }
});

/* ===== 4 · Expérience de van Helmont ===== */
SFA.sim({
  id:"b3-c08-van-helmont", ch:"c08", tag:"Histoire des sciences",
  titre:"Van Helmont et son saule : d'où vient la masse de l'arbre ?",
  resume:"Un saule de 2,3 kg grandit en 5 ans jusqu'à 76,7 kg alors que la terre ne perd presque rien. Qui fournit la masse ?",
  but:"Fais avancer les années, compare les masses de l'arbre et de la terre, puis règle la teneur en eau du bois pour estimer la matière sèche et le CO₂ capté.",
  aRetenir:"Vers 1640, van Helmont fait pousser un saule de 2,3 kg dans 90,7 kg de terre séchée, arrosé à l'eau de pluie : cinq ans plus tard, l'arbre pèse 76,7 kg et la terre n'a perdu que 57 g. La masse de l'arbre ne vient donc pas de la terre. Elle vient surtout de l'eau et de l'air : le carbone de la matière sèche provient du CO₂ absorbé par photosynthèse.",
  piege:"Conclure que « toute la masse vient de l'eau » est incomplet : van Helmont ne connaissait pas le rôle du CO₂ de l'air. Une grande part de la masse fraîche est de l'eau, mais la matière sèche (cellulose, sucres) est fabriquée à partir de CO₂ et d'eau. (Valeurs de van Helmont converties en kg ; masse intermédiaire interpolée ; composition du bois : ordres de grandeur.)",
  build:function(k,S){
    var c = k.canvas(300);
    var an = k.slider("Années écoulées", 0, 5, .5, 0, "an");
    var ea = k.slider("Teneur en eau du bois", 30, 60, 5, 50, "%");
    var ro = k.readouts(["Masse du saule","Masse de terre","Gain de l'arbre","Matière sèche gagnée","Carbone venu de l'air (CO₂)"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var t = an.value, m = 2.268*Math.pow(76.75/2.268,t/5), soil = 90.7-.0567*t/5, gain = m-2.268, dry = gain*(1-ea.value/100), carb = dry*.48, co2 = carb*44/12;
      var gx = c.W/2-70, y0 = 215, sc = 1.2;
      /* balance gauche : arbre */
      var th = 20+Math.cbrt(m/2.268)*38;
      rect(c,c.W*.25-48,y0-44,96,44,"#b5651d",P.ink,2,6);
      T(c,"terre",c.W*.25,y0-22,{size:12,color:"#fff"});
      D.line(c,c.W*.25,y0-44,c.W*.25,y0-44-th,"#7a5230",5+t*1.2);
      circ(c,c.W*.25,y0-44-th-10,10+Math.cbrt(m/2.268)*12,"#4f9a5c","#2e6b55",2);
      T(c,"arbre : "+S.fmt(m,1)+" kg",c.W*.25,y0+16,{size:13,color:P.ink});
      /* barres de masse */
      var bx = c.W*.55, bw = c.W*.4, mx = 90.7;
      T(c,"terre",bx,22,{size:12,align:"left",color:P.ink}); rect(c,bx,30,bw,16,"#eef1f5"); rect(c,bx,30,bw*soil/mx,16,"#b5651d");
      T(c,S.fmt(soil,2)+" kg",bx+bw,22,{size:12,align:"right",color:P.ink});
      T(c,"arbre",bx,70,{size:12,align:"left",color:P.ink}); rect(c,bx,78,bw,16,"#eef1f5"); rect(c,bx,78,bw*m/mx,16,"#4f9a5c");
      T(c,S.fmt(m,1)+" kg",bx+bw,70,{size:12,align:"right",color:P.ink});
      T(c,"gain de l'arbre",bx,118,{size:12,align:"left",color:P.ink}); rect(c,bx,126,bw,16,"#eef1f5"); rect(c,bx,126,bw*gain/mx,16,"#3fa664");
      T(c,"terre perdue",bx,166,{size:12,align:"left",color:P.ink}); rect(c,bx,174,bw,16,"#eef1f5"); rect(c,bx,174,Math.max(1,bw*(90.7-soil)/mx),16,P.red);
      T(c,S.fmt((90.7-soil)*1000,0)+" g",bx+bw,166,{size:12,align:"right",color:P.red});
      ro.set(0,S.fmt(m,1)+" kg"); ro.set(1,S.fmt(soil,2)+" kg"); ro.set(2,S.fmt(gain,1)+" kg"); ro.set(3,S.fmt(dry,1)+" kg"); ro.set(4,S.fmt(co2,0)+" kg de CO₂ (soit "+S.fmt(carb,1)+" kg de carbone)");
      nt.set(t===0 ? "Départ : un jeune saule de 2,3 kg dans 90,7 kg de terre. Fais avancer le temps." : "Gain de l'arbre : "+S.fmt(gain,1)+" kg. Perte de la terre : seulement "+S.fmt((90.7-soil)*1000,0)+" g, soit "+S.fmt((90.7-soil)/gain*100,2)+" % du gain : la terre ne fournit pas la masse de l'arbre.","ok");
    });
  }
});
})();
