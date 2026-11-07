(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function actY(t){ return t<=35 ? Math.pow(2,(t-35)/10) : Math.max(0,1-Math.pow((t-35)/20,2)); }

/* ===== 1 · Bilan de la respiration ===== */
SFA.sim({
  id:"b3-c06-bilan", ch:"c06", tag:"Classique · tombe souvent",
  titre:"Le bilan de la respiration cellulaire",
  resume:"Glucose + dioxygène → dioxyde de carbone + eau + énergie. Choisis les quantités et lis les produits.",
  but:"Règle la masse de glucose et de dioxygène disponibles. Observe ce qui est consommé, produit, ce qui reste (réactif limitant) et comment l'énergie libérée se partage entre ATP et chaleur.",
  aRetenir:"Respiration cellulaire : glucose + dioxygène → dioxyde de carbone + eau + énergie. Les masses se conservent : 180 g de glucose + 192 g de O₂ donnent 264 g de CO₂ + 108 g d'eau. L'énergie libérée (environ 15,6 kJ par gramme de glucose) est en partie stockée sous forme d'ATP (environ un tiers), le reste est de la chaleur.",
  piege:"L'énergie n'est pas « une matière » qui s'ajoute dans le bilan des masses. Le glucose ne devient pas de l'énergie « stockée telle quelle » : l'énergie de ses liaisons est libérée par réaction avec O₂. Et sans O₂, le glucose n'est pas entièrement dégradé (fermentation). (Valeurs arrondies.)",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.12});
    var gl = k.slider("Glucose disponible", 0, 180, 1, 90, "g");
    var ox = k.slider("Dioxygène disponible", 0, 250, 1, 96, "g");
    var ro = k.readouts(["Énergie libérée","dont ATP (≈ 32 %)","CO₂ produit","Eau produite","Réactif limitant"]);
    var nt = k.note("","");
    var MG = 180.16, MO = 6*31.998, MC = 6*44.01, MW = 6*18.015;
    function ball(g,x,y,r,col){ var gr=g.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r); gr.addColorStop(0,"#fff"); gr.addColorStop(.25,col); gr.addColorStop(1,col); g.beginPath(); g.arc(x,y,r,0,6.3); g.fillStyle=col; g.fill(); g.fillStyle="rgba(255,255,255,.4)"; g.beginPath(); g.arc(x-r*.3,y-r*.3,r*.35,0,6.3); g.fill(); g.strokeStyle="rgba(0,0,0,.25)"; g.lineWidth=.8; g.beginPath(); g.arc(x,y,r,0,6.3); g.stroke(); }
    var CC="#566170", OO="#d4443a", HH="#eef2f7";
    function mol(g,type,x,y,u){ g.save(); g.strokeStyle="#7b8694"; g.lineWidth=u*.35;
      if (type==="O2"){ g.beginPath(); g.moveTo(x-u,y); g.lineTo(x+u,y); g.stroke(); ball(g,x-u,y,u*.95,OO); ball(g,x+u,y,u*.95,OO); }
      else if (type==="CO2"){ g.beginPath(); g.moveTo(x-u*1.6,y); g.lineTo(x+u*1.6,y); g.stroke(); ball(g,x-u*1.6,y,u*.9,OO); ball(g,x,y,u*1.1,CC); ball(g,x+u*1.6,y,u*.9,OO); }
      else if (type==="H2O"){ g.beginPath(); g.moveTo(x,y); g.lineTo(x-u*1.1,y+u*.9); g.moveTo(x,y); g.lineTo(x+u*1.1,y+u*.9); g.stroke(); ball(g,x,y,u*1.05,OO); ball(g,x-u*1.1,y+u*.9,u*.6,HH); ball(g,x+u*1.1,y+u*.9,u*.6,HH); }
      else { for (var i=0;i<6;i++){ var a=i*Math.PI/3, px=x+Math.cos(a)*u*1.5, py=y+Math.sin(a)*u*1.5, qx=x+Math.cos(a+Math.PI/3)*u*1.5, qy=y+Math.sin(a+Math.PI/3)*u*1.5; g.beginPath(); g.moveTo(px,py); g.lineTo(qx,qy); g.stroke(); }
        for (i=0;i<6;i++){ a=i*Math.PI/3; ball(g,x+Math.cos(a)*u*1.5,y+Math.sin(a)*u*1.5,u*(i%2?.7:.8),i%2?OO:CC); } ball(g,x,y,u*.6,OO); }
      g.restore(); }
    k.draw(function(){
      c.clear(); var g=c.ctx, W=c.W, H=c.H;
      var xi = Math.min(gl.value/MG, ox.value/MO), used_g = xi*MG, used_o = xi*MO, co2 = xi*MC, h2o = xi*MW, left_g = gl.value-used_g, left_o = ox.value-used_o;
      var E = xi*2803, atp = E*.32;
      var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#f7f9fc"); bgc.addColorStop(1,"#edf1f7"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      /* béchers */
      var bw=Math.min(W*.3,112), bh=H*.42, y0=H*.08, x1=W*.1, x2=W-W*.1-bw, tot=Math.max(300,gl.value+ox.value,left_g+left_o+co2+h2o), sc=(bh-8)/tot;
      D.text(c,"Avant",x1+bw/2,y0-9,{size:12.5}); D.text(c,"Après",x2+bw/2,y0-9,{size:12.5});
      function beaker(x,items){ g.save(); g.fillStyle="rgba(255,255,255,.8)"; D.rrect(c,x,y0,bw,bh,10); g.fill(); g.clip(); var y=y0+bh-4; items.forEach(function(it){ var h=it[0]*sc; if (h>.5){ y-=h; g.fillStyle=it[1]; g.fillRect(x+2,y,bw-4,h); g.fillStyle="rgba(255,255,255,.35)"; g.fillRect(x+4,y,5,h); if (h>15) D.text(c,it[2]+" "+S.fmt(it[0],0)+" g",x+bw/2+3,y+h/2,{size:11.5,color:P.ink}); } }); g.restore(); D.rrect(c,x,y0,bw,bh,10); g.strokeStyle="#9fb0c4"; g.lineWidth=2.2; g.stroke(); }
      beaker(x1,[[gl.value,"#f6d77f","glucose"],[ox.value,"#b5d1f2","O₂"]]);
      beaker(x2,[[left_g,"#f6d77f","glucose"],[left_o,"#b5d1f2","O₂"],[co2,"#cdd3da","CO₂"],[h2o,"#7cc3e8","H₂O"]]);
      var my=y0+bh/2; D.arrow(c,x1+bw+10,my,x2-10,my,P.ink,3); D.label(c,"+ énergie",W/2,my-16,{size:12,color:P.amber});
      D.text(c,"masse : "+S.fmt(gl.value+ox.value,0)+" g → "+S.fmt(left_g+left_o+co2+h2o,0)+" g",W/2,y0+bh+16,{size:11.5,color:P.grey});
      /* équation moléculaire */
      var ey=H*.66, u=Math.max(4.4,W/64);
      D.panel(c,6,ey-34,W-12,68,{shadow:false});
      var xs=W*.035; mol(g,"glu",xs+u*2,ey,u); D.text(c,"+",xs+u*5.2,ey,{size:15});
      var qx=xs+u*7.4; for (var i=0;i<3;i++){ mol(g,"O2",qx+i*u*3.6,ey-u*1.8,u*.8); mol(g,"O2",qx+i*u*3.6,ey+u*1.8,u*.8); }
      var ax=qx+u*11.4; D.arrow(c,ax,ey,ax+u*3.6,ey,P.ink,2.5);
      var rx=ax+u*6.6; for (i=0;i<3;i++){ mol(g,"CO2",rx+i*u*5.6,ey-u*1.9,u*.62); mol(g,"CO2",rx+i*u*5.6,ey+u*1.9,u*.62); }
      D.text(c,"+",rx+u*16.2,ey,{size:15});
      var wx=rx+u*18.4; for (i=0;i<3;i++){ mol(g,"H2O",wx+i*u*3.2,ey-u*1.9,u*.62); mol(g,"H2O",wx+i*u*3.2,ey+u*1.2,u*.62); }
      D.text(c,"1 glucose + 6 O₂  →  6 CO₂ + 6 H₂O",W/2,ey+45,{size:11.5,color:P.grey});
      /* énergie */
      var by=H*.87, bwid=W-24; D.text(c,"Énergie libérée : "+S.fmt(E,0)+" kJ",12,by-14,{size:12,align:"left"});
      D.rrect(c,12,by,bwid,16,8); g.fillStyle="#e3e8ef"; g.fill();
      var fw=Math.min(1,E/2803*(180.16/Math.max(gl.value,1)>1?1:1)); var scE=Math.max(2803, E); var wa=bwid*atp/scE, wh=bwid*(E-atp)/scE;
      g.save(); D.rrect(c,12,by,bwid,16,8); g.clip(); g.fillStyle=P.green; g.fillRect(12,by,wa,16); g.fillStyle=P.orange; g.fillRect(12+wa,by,wh,16); g.restore();
      D.label(c,"ATP "+S.fmt(atp,0)+" kJ",12,by+30,{size:11,color:P.green,align:"left"}); D.label(c,"chaleur "+S.fmt(E-atp,0)+" kJ",W-12,by+30,{size:11,color:"#b4560c",align:"right"});
      ro.set(0,S.fmt(E,0)+" kJ"); ro.set(1,S.fmt(atp,0)+" kJ"); ro.set(2,S.fmt(co2,0)+" g"); ro.set(3,S.fmt(h2o,0)+" g");
      var rg = gl.value/MG, rox = ox.value/MO, tie = Math.abs(rg-rox) <= .006*Math.max(rg,rox);
      var lim = xi===0 ? "—" : tie ? "aucun (juste)" : (rg<rox ? "glucose" : "dioxygène");
      ro.set(4,lim);
      nt.set(xi===0 ? "Il faut du glucose et du dioxygène pour que la respiration ait lieu." : tie ? "Proportions exactes : tout le glucose et tout le dioxygène sont consommés (180 g de glucose pour 192 g de O₂)." : ox.value/MO<gl.value/MG ? "Il manque du dioxygène : il reste "+S.fmt(left_g,0)+" g de glucose qui ne peut pas être entièrement dégradé par respiration (la cellule passerait à la fermentation)." : "Tout le glucose est consommé, il reste "+S.fmt(left_o,0)+" g de O₂ : le glucose est le réactif limitant.","ok");
    });
  }
});

/* ===== 2 · Levures ===== */
SFA.sim({
  id:"b3-c06-levures", ch:"c06", tag:"Expérience virtuelle",
  titre:"Levures dans un flacon : le ballon qui se gonfle",
  resume:"Sucre, température, temps : combien de CO₂ les levures produisent-elles dans un flacon fermé ?",
  but:"Règle la quantité de sucre et la température. Fais avancer le temps : le ballon se gonfle selon le CO₂ produit.",
  aRetenir:"Les levures libèrent de l'énergie en dégradant le sucre et rejettent du CO₂ qui gonfle le ballon. Sans dioxygène (flacon fermé), c'est une fermentation : glucose → alcool + CO₂ + peu d'énergie. La vitesse dépend de la température (optimum vers 35 °C), et la quantité totale de CO₂ dépend du sucre disponible.",
  piege:"Le ballon ne se gonfle pas plus vite à 60 °C : la chaleur tue les levures. Une température plus basse ralentit la production sans la supprimer. Et sans sucre, il n'y a presque pas de CO₂ : les levures n'ont plus de « carburant ». (Modèle simplifié ; CO₂ dissous négligé.)",
  build:function(k,S){
    var c1 = k.canvas(225), c2 = k.canvas(190);
    var su = k.slider("Sucre au départ", 0, 10, .5, 5, "g");
    var tp = k.slider("Température", 0, 70, 1, 35, "°C");
    var tm = k.slider("Temps écoulé", 0, 120, 5, 60, "min");
    var ro = k.readouts(["CO₂ produit","Sucre restant","Vitesse de production","Levures"]);
    var nt = k.note("","");
    function run(){
      var v = .25*actY(tp.value), s = su.value, out = [], dt = .1, co = 0, Vm = 22.41*(tp.value+273.15)/273.15;
      for (var i=0;i<=1200;i++){
        var r = v*s/(1+s);
        if (i%10===0) out.push([i*dt,co,s,r]);
        var d = Math.min(s,r*dt); s -= d; co += d/180.16*2*Vm*1000;
      }
      return out;
    }
    k.draw(function(){
      var out = run(), cur = out[Math.min(120,Math.round(tm.value))], vmax = su.value/180.16*2*22.41*(tp.value+273.15)/273.15*1000;
      c2.clear(); var ax = D.axes(c2,{x0:0,x1:120,y0:0,y1:Math.max(100,Math.ceil(vmax/100)*100*1.0),xl:"temps (min)",yl:"CO₂ (mL)",stepX:20,l:56});
      D.fn(c2,ax,function(x){ var j = Math.min(119,Math.floor(x)), f = x-j; return out[j][1]+(out[j+1][1]-out[j][1])*f; },P.green,3);
      D.dot(c2,ax.X(tm.value),ax.Y(cur[1]),6,P.violet);
      /* flacon + ballon */
      c1.clear(); var cx = c1.W/2, g = c1.ctx, r = 10 + 38*Math.sqrt(Math.min(1,cur[1]/2900));
      rect(c1,cx-45,128,90,78,"rgba(244,210,122,.6)",P.ink,2.5,10); rect(c1,cx-14,98,28,36,"rgba(255,255,255,.6)",P.ink,2.5);
      for (var j=0;j<14;j++){ var rr = rng(j+3); circ(c1,cx-38+rr()*76,146+rr()*52,2+rr()*2,"#b5651d"); }
      g.save(); g.fillStyle = "rgba(240,140,130,.8)"; g.strokeStyle = "#b8473c"; g.lineWidth = 2; g.beginPath(); g.ellipse(cx,98-r*.9,r*.8,r,0,0,6.2832); g.fill(); g.stroke(); g.restore();
      T(c1,"flacon : eau + sucre + levures",c1.W/2,216,{size:12,color:P.grey});
      ro.set(0,S.fmt(cur[1],0)+" mL"); ro.set(1,S.fmt(cur[2],1)+" g"); ro.set(2,S.fmt(cur[3]/180.16*2*(22.41*(tp.value+273.15)/273.15)*1000,0)+" mL/min");
      ro.set(3, tp.value>=55 ? "mortes" : tp.value<8 ? "très lentes" : "actives");
      nt.set(tp.value>=55 ? "À 55 °C et plus, les levures sont tuées : aucune production de CO₂." : su.value===0 ? "Sans sucre, pas de CO₂ : rien à fermenter." : cur[2]<.05 && tm.value>0 ? "Le sucre est épuisé : le ballon cesse de grossir (la quantité de CO₂ dépend du sucre de départ)." : tp.value<10 ? "Au froid, les levures travaillent très lentement." : "Le ballon se gonfle d'autant plus vite que la température est proche de 35 °C.","ok");
    });
  }
});

/* ===== 3 · Effort et énergie ===== */
SFA.sim({
  id:"b3-c06-effort-energie", ch:"c06", tag:"Chiffré · utile",
  titre:"Combien d'énergie, de O₂ et de glucose pour une activité ?",
  resume:"Du sommeil à la course : dépense d'énergie, dioxygène consommé et équivalent en glucose.",
  but:"Touche une activité dans le classement (ou choisis-la dans la liste), règle ta masse et la durée. Compare l'énergie dépensée par les activités et vois combien de morceaux de sucre et de litres de O₂ cela représente.",
  aRetenir:"Plus l'activité est intense, plus les cellules musculaires réalisent de respiration cellulaire : elles consomment plus de glucose et de dioxygène et rejettent plus de CO₂ et de chaleur. Même au repos (ou en dormant), les cellules respirent en continu.",
  piege:"Le corps utilise un mélange de glucose et de lipides : l'équivalent en glucose est un repère, pas ce qui est « brûlé » exactement. Et la plus grande part de l'énergie (environ les trois quarts) finit en chaleur, pas en travail mécanique. (Valeurs moyennes, à partir des MET : 1 MET ≈ 1 kcal par kg et par heure.)",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.18});
    var ac = k.select("Activité", [["0.95","Dormir (0,95 MET)"],["1.3","Assis, faire un devoir (1,3 MET)"],["3.5","Marche à 5 km/h (3,5 MET)"],["4","Vélo tranquille (4 MET)"],["8.3","Jogging à 8 km/h (8,3 MET)"],["9.8","Course à 10 km/h (9,8 MET)"]], "3.5");
    var kg = k.slider("Masse corporelle", 30, 90, 1, 55, "kg");
    var mn = k.slider("Durée", 10, 120, 5, 60, "min");
    var ro = k.readouts(["Énergie dépensée","O₂ consommé","Équivalent glucose","Dont chaleur (≈ 75 %)"]);
    var nt = k.note("","");
    var LIST = [["Dormir",.95],["Devoir",1.3],["Marche",3.5],["Vélo",4],["Jogging",8.3],["Course",9.8]];
    var ROWS=[];
    c.pointer(function(type,p){ if (type!=="down") return; ROWS.forEach(function(r){ if (p.y>=r.y0 && p.y<=r.y1){ ac.set(String(r.v)); k.redraw(); } }); });
    k.draw(function(){
      var met = +ac.value, h = mn.value/60, kJ = met*4.184*kg.value*h, o2 = met*3.5*kg.value*mn.value/1000, glu = kJ/15.6, g=c.ctx, W=c.W, H=c.H;
      c.clear(); var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#f8fbf6"); bgc.addColorStop(1,"#eef3f8"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      /* sucres */
      D.text(c,"Équivalent en glucose : "+S.fmt(glu,0)+" g",10,13,{size:12,align:"left"});
      var nc=glu/5, cols=Math.floor((W-20)/22), full=Math.floor(nc), rows=Math.ceil(Math.min(nc,60)/cols);
      for (var i=0;i<Math.min(60,Math.ceil(nc));i++){ var cx=12+(i%cols)*22, cy=26+Math.floor(i/cols)*20, fr=i<full?1:nc-full;
        g.fillStyle="#fff"; g.strokeStyle="#c3ccd8"; g.lineWidth=1; g.fillRect(cx,cy,18*fr,16); g.strokeRect(cx,cy,18*fr,16); g.fillStyle="rgba(180,200,225,.5)"; g.fillRect(cx+2,cy+2,Math.max(0,18*fr-6),3); }
      if (nc>60) D.text(c,"… "+S.fmt(nc,0)+" morceaux de 5 g",W-10,13,{size:11,align:"right",color:P.grey}); else D.text(c,S.fmt(nc,0)+" morceaux de 5 g",W-10,13,{size:11,align:"right",color:P.grey});
      var fy=Math.min(H*.36,26+rows*20+22);
      /* flux d'énergie */
      D.text(c,"Où va l'énergie ?",10,fy,{size:12,align:"left"});
      var bw=W-20; D.rrect(c,10,fy+10,bw,24,8); g.save(); g.clip(); g.fillStyle=P.orange; g.fillRect(10,fy+10,bw*.75,24); g.fillStyle=P.green; g.fillRect(10+bw*.75,fy+10,bw*.25,24); g.restore();
      D.text(c,"chaleur ≈ 75 % · "+S.fmt(kJ*.75,0)+" kJ",16,fy+22,{size:11.5,align:"left",color:"#fff"}); D.text(c,"ATP/travail",10+bw-6,fy+22,{size:11,align:"right",color:"#fff"});
      D.text(c,"Dioxygène consommé : "+S.fmt(o2,1)+" L",10,fy+52,{size:11.5,align:"left",color:P.acc});
      /* classement */
      var ty=fy+72; D.text(c,"Énergie selon l'activité — touche une ligne",10,ty,{size:11.5,align:"left",color:P.grey});
      var ymax=9.8*4.184*kg.value*h*1.08, rowh=Math.min(34,(H-ty-14)/6); ROWS=[]; var wb=W-20;
      LIST.forEach(function(q,i){ var kj=q[1]*4.184*kg.value*h, yy=ty+14+i*rowh, on=Math.abs(q[1]-met)<.01; ROWS.push({v:q[1],y0:yy-2,y1:yy+rowh-2});
        if (on){ D.rrect(c,6,yy-2,W-12,rowh-1,8); g.fillStyle="rgba(98,54,196,.1)"; g.fill(); }
        D.text(c,q[0],12,yy+rowh*.28,{size:11.5,align:"left",color:on?P.violet:P.ink}); D.text(c,S.fmt(kj,0)+" kJ",W-12,yy+rowh*.28,{size:11.5,align:"right",color:on?P.violet:P.ink});
        D.rrect(c,12,yy+rowh*.5,wb-4,rowh*.3,4); g.fillStyle="#e3e8ef"; g.fill(); D.rrect(c,12,yy+rowh*.5,Math.max(4,(wb-4)*kj/ymax),rowh*.3,4); g.fillStyle=on?P.violet:"#aeb9cc"; g.fill(); });
      ro.set(0,S.fmt(kJ,0)+" kJ"); ro.set(1,S.fmt(o2,1)+" L"); ro.set(2,S.fmt(glu,0)+" g"); ro.set(3,S.fmt(kJ*.75,0)+" kJ");
      nt.set("Ça équivaut à "+S.fmt(glu/5,0)+" morceaux de sucre de 5 g, ou à "+S.fmt(kJ/2250,2)+" tablette de chocolat de 100 g (≈ 2 250 kJ).","ok");
    });
  }
});

/* ===== 4 · Dette d'oxygène ===== */
SFA.sim({
  id:"b3-c06-dette-oxygene", ch:"c06", tag:"Modèle chiffré",
  titre:"Sprint, dette d'oxygène et acide lactique",
  resume:"Un sprint demande plus de O₂ que ce que le corps peut livrer : le manque est comblé sans O₂ (lactate), puis remboursé.",
  but:"Règle l'intensité et la durée du sprint. Observe la consommation de O₂, le déficit et la concentration de lactate dans le sang.",
  aRetenir:"Quand l'effort dépasse ce que les poumons, le cœur et le sang peuvent apporter en O₂, les muscles produisent une partie de l'énergie sans O₂ (fermentation lactique) : le lactate s'accumule et provoque une fatigue. Après l'effort, la consommation de O₂ reste élevée un moment (la « dette d'oxygène ») : le lactate est éliminé et les réserves sont reconstituées.",
  piege:"Le lactate n'est pas un « déchet qui reste » : il est repris par le foie, le cœur et les muscles. Et la dette d'oxygène n'est pas due à un manque pendant la récupération, mais à ce qui s'est passé pendant l'effort. (Modèle simplifié : on suppose une consommation maximale de O₂ de 3,0 L/min.)",
  build:function(k,S){
    var c1 = k.canvas(190), c2 = k.canvas(170);
    var it = k.slider("Intensité du sprint (100 % = effort juste maximal en O₂)", 110, 250, 10, 200, "%");
    var du = k.slider("Durée du sprint", 10, 120, 5, 40, "s");
    var ro = k.readouts(["Déficit en O₂ (anaérobie)","Lactate maximal","Dette remboursée (O₂ en plus)","Retour du lactate sous 4 mmol/L"]);
    var nt = k.note("","");
    var REST = .3, VMAX = 3.0;
    function run(){
      var dt = .5, out = [], v = REST, def = 0, lac = 1, t0 = 60, t1 = 60 + du.value, Dm = it.value/100*VMAX, tau = 30, tr = null, vEnd = 0, lEnd = 1, rep = 0, capped = false, kl = Math.LN2/20, i;
      for (i=0;i<=2400;i++){
        var t = i*dt, dem = (t>=t0 && t<t1) ? Dm : REST;
        if (t >= t0 && t < t1){
          v += (Math.min(Dm,VMAX)-v)*(1-Math.exp(-dt/tau)); def += Math.max(0,Dm-v)*dt/60;
          if (def > 5){ def = 5; capped = true; } lac = 1 + 3.5*def;
        } else if (t >= t1){
          if (tr === null){ vEnd = v; lEnd = lac; tr = Math.max(.5, def/Math.max(.05,vEnd-REST)); }
          v = REST + (vEnd-REST)*Math.exp(-(t-t1)/60/tr); rep += (v-REST)*dt/60;
          lac = 1 + (lEnd-1)*Math.exp(-kl*(t-t1)/60);
        }
        out.push([t/60,v,lac,dem]);
      }
      var back = lEnd>4 ? Math.log((lEnd-1)/3)/kl : 0;
      return {out:out, def:def, lmax:lEnd, rep:rep, back:back, capped:capped};
    }
    k.draw(function(){
      var r = run(), o = r.out;
      c1.clear(); var a1 = D.axes(c1,{x0:0,x1:20,y0:0,y1:Math.max(4,Math.ceil(it.value/100*VMAX)+.5),xl:"temps (min)",yl:"O₂ (L/min)",stepX:5,l:50,t:30});
      D.fn(c1,a1,function(x){ var j = Math.min(o.length-1,Math.round(x*120)); return o[j][3]; },P.grey,2,[6,4]);
      D.fn(c1,a1,function(x){ var j = Math.min(o.length-1,Math.round(x*120)); return o[j][1]; },P.acc,3);
      T(c1,"pointillé : besoin en O₂ · bleu : O₂ consommé",c1.W/2,10,{size:12,align:"center",color:P.grey});
      c2.clear(); var a2 = D.axes(c2,{x0:0,x1:20,y0:0,y1:Math.max(8,Math.ceil(r.lmax)+1),xl:"temps (min)",yl:"lactate (mmol/L)",stepX:5,l:50});
      D.fn(c2,a2,function(x){ var j = Math.min(o.length-1,Math.round(x*120)); return o[j][2]; },P.red,3);
      D.line(c2,a2.L,a2.Y(4),a2.R,a2.Y(4),P.grey,1.2,[5,4]);
      ro.set(0,S.fmt(r.def,1)+" L"); ro.set(1,S.fmt(r.lmax,1)+" mmol/L"); ro.set(2,S.fmt(r.rep,1)+" L"); ro.set(3, r.back<=0 ? "immédiat" : S.fmt(r.back,0)+" min");
      nt.set(r.capped ? "Déficit maximal atteint (≈ 5 L) : épuisement. Aucun humain ne peut maintenir cette intensité aussi longtemps." : r.lmax>8 ? "Beaucoup de lactate : jambes lourdes, souffle court. La récupération demande plusieurs minutes." : "Effort modéré : peu de lactate, récupération rapide.", r.capped ? "warn" : "ok");
    });
  }
});
})();
