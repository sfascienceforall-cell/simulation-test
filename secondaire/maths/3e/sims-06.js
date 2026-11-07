/* Chapitre 6 : systèmes de deux équations du premier degré */
window.M3 = window.M3 || {};
M3.eqXY = function(a,b,c,S){
  var s="", f=function(v){return S.fmt(Math.abs(v),2);};
  if(a!==0) s+=(a===1?"":a===-1?"−":S.fmt(a,2))+"x";
  if(b!==0){ if(s==="") s+=(b===1?"":b===-1?"−":S.fmt(b,2))+"y"; else s+=(b<0?" − ":" + ")+(Math.abs(b)===1?"":f(b))+"y"; }
  if(s==="") s="0";
  return s+" = "+S.fmt(c,2);
};
M3.drawXY = function(c,ax,a,b,cc,col,S){
  if(b!==0) S.draw.fn(c,ax,function(x){return (cc-a*x)/b;},col,3);
  else if(a!==0) S.draw.line(c,ax.X(cc/a),ax.T,ax.X(cc/a),ax.B,col,3);
};
M3.solve2 = function(a1,b1,c1,a2,b2,c2){
  var det=a1*b2-a2*b1;
  if(det!==0) return {kind:"one",x:(c1*b2-c2*b1)/det,y:(a1*c2-a2*c1)/det};
  if(a1===0&&b1===0&&c1!==0||a2===0&&b2===0&&c2!==0) return {kind:"none"};
  if(a1===0&&b1===0&&a2===0&&b2===0) return c1===0&&c2===0?{kind:"inf"}:{kind:"none"};
  if(a1===0&&b1===0) return c1===0?{kind:"inf"}:{kind:"none"};
  if(a2===0&&b2===0) return c2===0?{kind:"inf"}:{kind:"none"};
  return (a1*c2===a2*c1&&b1*c2===b2*c1)?{kind:"inf"}:{kind:"none"};
};
SFA.sim({
  id:"m3-c06-intersection", ch:"c06", tag:"Graphique", titre:"Deux droites, un couple solution",
  resume:"Chaque équation est une droite ; la solution du système est leur point commun.",
  but:"Change les coefficients des deux équations. Lis le couple (x ; y) sur le graphique, puis vérifie-le dans les deux équations.",
  aRetenir:"Un couple (x ; y) est solution du système s'il vérifie les deux équations à la fois : c'est le point d'intersection des deux droites.",
  piege:"Une solution est un couple : donner seulement x (ou seulement y) ne suffit pas.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a1=k.slider("Éq. 1 : a₁ (devant x)",-4,4,1,1,""), b1=k.slider("b₁ (devant y)",-4,4,1,1,""), c1=k.slider("c₁",-10,10,1,5,"");
    var a2=k.slider("Éq. 2 : a₂",-4,4,1,1,""), b2=k.slider("b₂",-4,4,1,-1,""), c2=k.slider("c₂",-10,10,1,1,"");
    var ro=k.readouts(["Équation 1","Équation 2","Solution","Vérification"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var A1=a1.value,B1=b1.value,C1=c1.value,A2=a2.value,B2=b2.value,C2=c2.value;
      var ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,xl:"x",yl:"y",stepX:2,stepY:2});
      M3.drawXY(c,ax,A1,B1,C1,P.acc,S); M3.drawXY(c,ax,A2,B2,C2,P.red,S);
      S.draw.legend(c,[[P.acc,"(1) "+M3.eqXY(A1,B1,C1,S)],[P.red,"(2) "+M3.eqXY(A2,B2,C2,S)]],ax.R-4,ax.T+4,{align:"right"});
      var r=M3.solve2(A1,B1,C1,A2,B2,C2);
      ro.set(0,M3.eqXY(A1,B1,C1,S)); ro.set(1,M3.eqXY(A2,B2,C2,S));
      if(r.kind==="one"){ if(Math.abs(r.x)<=10&&Math.abs(r.y)<=10) S.draw.dot(c,ax.X(r.x),ax.Y(r.y),7,P.green);
        ro.set(2,"("+S.fmt(r.x,2)+" ; "+S.fmt(r.y,2)+")");
        ro.set(3,S.fmt(A1*r.x+B1*r.y,2)+" = "+S.fmt(C1,2)+" ✓ ; "+S.fmt(A2*r.x+B2*r.y,2)+" = "+S.fmt(C2,2)+" ✓");
        nt.set(Math.abs(r.x)>10||Math.abs(r.y)>10?"Le point d'intersection sort du cadre, mais la solution existe bien.":"Le point vert est le seul point commun aux deux droites.","ok"); }
      else if(r.kind==="inf"){ ro.set(2,"infinité"); ro.set(3,"—"); nt.set("Les deux équations décrivent la même droite : une infinité de solutions (système indéterminé).","warn"); }
      else { ro.set(2,"aucune"); ro.set(3,"—"); nt.set("Droites parallèles (ou équation impossible) : aucune solution (système impossible).","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c06-troiscas", ch:"c06", tag:"Trois cas", titre:"Une solution, aucune, ou une infinité ?",
  resume:"Fixe l'équation 2x + y = 6 et fais varier la seconde : 4x + m·y = k.",
  but:"Fais varier m puis k. Trouve les valeurs qui donnent chacun des trois cas.",
  aRetenir:"Si les droites ont des pentes différentes : une seule solution. Mêmes pentes, ordonnées différentes : aucune solution. Même droite : infinité de solutions.",
  piege:"Un système qui mène à 0 = 5 n'a pas « x = 0 » pour solution : il est impossible.",
  build:function(k,S){
    var c=k.canvas(340), P=S.draw.palette;
    var m=k.slider("m",1,4,1,2,""), kk=k.slider("k",4,16,1,12,"");
    var ro=k.readouts(["Équation 1","Équation 2","Cas"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var M=m.value,K=kk.value;
      var ax=S.draw.axes(c,{x0:-2,x1:8,y0:-10,y1:10,xl:"x",yl:"y",stepX:1,stepY:2});
      M3.drawXY(c,ax,2,1,6,P.acc,S); M3.drawXY(c,ax,4,M,K,P.red,S);
      S.draw.legend(c,[[P.acc,"(1) "+M3.eqXY(2,1,6,S)],[P.red,"(2) "+M3.eqXY(4,M,K,S)]],ax.R-4,ax.T+4,{align:"right"});
      var r=M3.solve2(2,1,6,4,M,K);
      ro.set(0,M3.eqXY(2,1,6,S)); ro.set(1,M3.eqXY(4,M,K,S));
      if(r.kind==="one"){ if(r.x>=-2&&r.x<=8&&r.y>=-10&&r.y<=10) S.draw.dot(c,ax.X(r.x),ax.Y(r.y),7,P.green); ro.set(2,"1 solution : ("+S.fmt(r.x,2)+" ; "+S.fmt(r.y,2)+")"); nt.set("Pentes différentes : les droites se coupent en un seul point.","ok"); }
      else if(r.kind==="inf"){ ro.set(2,"infinité de solutions"); nt.set("4x + 2y = 12 est l'équation 1 multipliée par 2 : c'est la même droite.","warn"); }
      else { ro.set(2,"aucune solution"); nt.set("4x + 2y = "+S.fmt(K,0)+" : en divisant par 2, on obtient 2x + y = "+S.fmt(K/2,1)+", incompatible avec 2x + y = 6.","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c06-combinaison", ch:"c06", tag:"Combinaison", titre:"Combinaison : fais disparaître une inconnue",
  resume:"Multiplie les équations puis additionne-les : l'une des inconnues doit s'annuler.",
  but:"Choisis un système, règle les multiplicateurs p et q et regarde le tableau : quand une colonne de la somme tombe à 0, l'inconnue a disparu. Les boutons d'aide proposent un choix de p et q.",
  aRetenir:"On multiplie les équations pour que les coefficients d'une inconnue soient opposés, puis on additionne : il reste une équation à une inconnue. On remplace ensuite pour trouver l'autre.",
  piege:"Il faut multiplier tous les termes de l'équation, y compris le second membre. Attention aux signes quand on soustrait.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.62}), P=S.draw.palette, T=S.draw.tint;
    var PRE=[[2,3,13,1,-1,-1],[3,2,16,5,-2,0],[1,2,7,3,-1,0],[4,-3,-1,2,1,7]];
    var ps=k.select("Système",PRE.map(function(p,i){return [i,"{ "+M3.eqXY(p[0],p[1],p[2],S)+"  ;  "+M3.eqXY(p[3],p[4],p[5],S)+" }"];}),0,function(){ p.set(1); q.set(1); });
    var p=k.slider("Multiplicateur p de l'équation 1",-5,5,1,1,""), q=k.slider("Multiplicateur q de l'équation 2",-5,5,1,3,"");
    function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a||1; }
    k.button("Aide : éliminer x",function(){ var E=PRE[+ps.value], g=gcd(E[0],E[3]); p.set(E[3]/g); q.set(-E[0]/g); },false);
    k.button("Aide : éliminer y",function(){ var E=PRE[+ps.value], g=gcd(E[1],E[4]); p.set(E[4]/g); q.set(-E[1]/g); },false);
    var ro=k.readouts(["Somme","Résultat"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, E=PRE[+ps.value], pp=p.value, qq=q.value, fs=M3.sz(c,16);
      var A=pp*E[0]+qq*E[3], B=pp*E[1]+qq*E[4], C=pp*E[2]+qq*E[5];
      var lw=Math.min(104,c.W*0.25), cw=(c.W-lw-26)/3, rh=Math.min(40,(c.H-190)/6), x0=12+lw, y0=44;
      ["x","y","= constante"].forEach(function(h,i){ S.draw.text(c,h,x0+i*cw+cw/2,y0-16,{size:fs-1,color:P.grey,math:true,italic:i<2}); });
      var rows=[
        {l:"(1)",v:[E[0],E[1],E[2]],col:P.acc},{l:"(2)",v:[E[3],E[4],E[5]],col:P.red},
        {l:"(1) × "+M3.par(pp,0),v:[pp*E[0],pp*E[1],pp*E[2]],col:P.acc,mul:true},{l:"(2) × "+M3.par(qq,0),v:[qq*E[3],qq*E[4],qq*E[5]],col:P.red,mul:true},
        {l:"Somme",v:[A,B,C],col:P.ink,sum:true}];
      var y=y0;
      rows.forEach(function(r,i){
        if(i===2) y+=10; if(i===4){ y+=8; S.draw.line(c,12,y-5,c.W-12,y-5,P.ink,2.5); S.draw.text(c,"+",x0-14,y-12,{size:fs+4,color:P.ink}); }
        S.draw.text(c,r.l,12,y+rh/2,{size:fs-1,color:r.col,align:"left",math:true});
        r.v.forEach(function(val,j){
          var cx=x0+j*cw+3, zero=(r.sum&&j<2&&val===0), cc=zero?P.green:r.col;
          S.draw.rrect(c,cx,y,cw-6,rh-6,9); ctx.fillStyle=zero?T(P.green,0.22):T(cc,r.sum?0.07:0.09); ctx.fill(); ctx.lineWidth=zero?3:1.5; ctx.strokeStyle=zero?P.green:T(cc,0.45); ctx.stroke();
          S.draw.text(c,(j===2?"= ":"")+S.fmt(val,0),cx+(cw-6)/2,y+(rh-6)/2,{size:fs+2,color:zero?P.green:cc,weight:800}); });
        y+=rh; });
      var res="", kind="", sol=M3.solve2(E[0],E[1],E[2],E[3],E[4],E[5]);
      var vx=(A===0&&B!==0), vy=(B===0&&A!==0);
      if(A===0&&B===0){ res=C===0?"0 = 0 : tout s'est annulé (change p et q)":"0 = "+S.fmt(C,0)+" : impossible ici"; kind="warn"; }
      else if(vx){ var yv=C/B; res="x a disparu : "+S.fmt(B,0)+"y = "+S.fmt(C,0)+", donc y = "+S.fmt(yv,2); kind="ok"; }
      else if(vy){ var xv=C/A; res="y a disparu : "+S.fmt(A,0)+"x = "+S.fmt(C,0)+", donc x = "+S.fmt(xv,2); kind="ok"; }
      else { res="Aucune inconnue n'a disparu : change p et q."; kind="warn"; }
      var ry=y+16, col=kind==="ok"?P.green:P.red;
      S.draw.panel(c,12,ry,c.W-24,50,{shadow:false,fill:T(col,0.09),stroke:T(col,0.45)});
      S.draw.text(c,res,c.W/2,ry+17,{size:Math.max(12,fs-2),color:col});
      if(kind==="ok"&&sol.kind==="one") S.draw.text(c,"Solution du système : ("+S.fmt(sol.x,2)+" ; "+S.fmt(sol.y,2)+")",c.W/2,ry+37,{size:Math.max(12,fs-2),color:P.ink,weight:800});
      /* mini-graphique : la droite « somme » passe toujours par la solution */
      var gy0=ry+62, gh=c.H-gy0-8;
      if(gh>110){
        S.draw.panel(c,12,gy0,c.W-24,gh,{shadow:false,fill:"#fbfcfe"});
        var ax=S.draw.axes(c,{x0:-2,x1:9,y0:-3,y1:9,xl:"x",yl:"y",stepX:2,stepY:2,l:44,t:gy0+8,b:30,r:22});
        M3.drawXY(c,ax,E[0],E[1],E[2],P.acc,S); M3.drawXY(c,ax,E[3],E[4],E[5],P.red,S);
        if(A!==0||B!==0){ ctx.save(); ctx.globalAlpha=.9; M3.drawXY(c,ax,A,B,C,P.green,S); ctx.restore(); }
        if(sol.kind==="one"){ S.draw.dot(c,ax.X(sol.x),ax.Y(sol.y),7,P.ink); S.draw.label(c,"("+S.fmt(sol.x,0)+" ; "+S.fmt(sol.y,0)+")",ax.X(sol.x)+10,ax.Y(sol.y)-16,{color:P.ink,size:fs-4,align:"left"}); }
        S.draw.legend(c,[[P.acc,"(1)"],[P.red,"(2)"],[P.green,"somme"]],c.W-24,gy0+8,{align:"right"});
      }
      ro.set(0,M3.eqXY(A,B,C,S)); ro.set(1,kind==="ok"&&sol.kind==="one"?"("+S.fmt(sol.x,2)+" ; "+S.fmt(sol.y,2)+")":"—");
      nt.set(kind==="ok"?"Bien joué : "+(vx?"x":"y")+" a disparu. Vérifie le couple dans les deux équations de départ.":(A===0&&B===0?"p = q = 0 ou combinaison nulle : on n'obtient rien d'utile. Change p et q.":"Cherche p et q pour que les coefficients de x (ou de y) soient opposés : la case de la somme devient verte."),kind);
    });
  }
});
SFA.sim({
  id:"m3-c06-poules", ch:"c06", tag:"Problème classique", titre:"Poules et lapins : têtes et pattes",
  resume:"Dans une cour, on compte T têtes et P pattes. Combien de poules et de lapins ?",
  but:"Règle T et P : la cour se remplit d'animaux et le graphique montre où se croisent les deux équations. Passe en mode essai-erreur pour chercher toi-même le nombre de lapins en comptant les pattes. Regarde quand il n'y a pas de réponse possible.",
  aRetenir:"Avec x poules et y lapins : x + y = T et 2x + 4y = P. On trouve y = (P − 2T) ÷ 2 et x = T − y. La solution doit être un entier positif ou nul.",
  piege:"Une solution mathématique n'est pas toujours une solution du problème : on ne peut pas avoir 2,5 lapins ni −3 poules.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.3}), P=S.draw.palette, T0=S.draw.tint;
    var T=k.slider("Têtes T",4,30,1,14,""), Pa=k.slider("Pattes P",8,120,1,40,"");
    var tr=k.toggle("Mode essai-erreur : je choisis le nombre de lapins",false);
    var ly=k.slider("Lapins essayés",0,30,1,3,"");
    var ro=k.readouts(["Poules x","Lapins y","Vérification"]); var nt=k.note("");
    function hen(ctx,x,y,s,col){ ctx.save(); ctx.lineCap="round";
      ctx.strokeStyle=P.orange; ctx.lineWidth=Math.max(1.6,s*.06); ctx.beginPath(); ctx.moveTo(x-s*.1,y+s*.2); ctx.lineTo(x-s*.1,y+s*.42); ctx.moveTo(x+s*.1,y+s*.2); ctx.lineTo(x+s*.1,y+s*.42); ctx.stroke();
      ctx.fillStyle=col; ctx.beginPath(); ctx.ellipse(x,y+s*.02,s*.27,s*.22,0,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(x+s*.2,y-s*.2,s*.13,0,7); ctx.fill();
      ctx.fillStyle=P.red; ctx.beginPath(); ctx.arc(x+s*.2,y-s*.34,s*.05,0,7); ctx.fill();
      ctx.fillStyle=P.orange; ctx.beginPath(); ctx.moveTo(x+s*.31,y-s*.22); ctx.lineTo(x+s*.43,y-s*.18); ctx.lineTo(x+s*.31,y-s*.14); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(x+s*.23,y-s*.22,s*.03,0,7); ctx.fill(); ctx.restore(); }
    function rab(ctx,x,y,s,col){ ctx.save(); ctx.lineCap="round";
      ctx.strokeStyle=P.grey; ctx.lineWidth=Math.max(1.6,s*.06); ctx.beginPath(); [-.2,-.08,.08,.2].forEach(function(d){ ctx.moveTo(x+s*d,y+s*.2); ctx.lineTo(x+s*d,y+s*.4); }); ctx.stroke();
      ctx.fillStyle=col; ctx.beginPath(); ctx.ellipse(x-s*.04,y+s*.04,s*.28,s*.2,0,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(x+s*.2,y-s*.12,s*.14,0,7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x+s*.16,y-s*.33,s*.045,s*.15,-.15,0,7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x+s*.27,y-s*.32,s*.045,s*.15,.2,0,7); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(x-s*.32,y+s*.02,s*.06,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(x+s*.24,y-s*.15,s*.025,0,7); ctx.fillStyle=P.ink; ctx.fill(); ctx.restore(); }
    window.M3.fit(c,0.8,1.3);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, t=T.value, p=Pa.value, fs=M3.sz(c,12.5), test=tr.value;
      var y=(p-2*t)/2, x=t-y, ok=Number.isInteger(y)&&y>=0&&x>=0;
      var yy=test?Math.min(ly.value,t):y, xx=t-yy, patt=2*xx+4*yy, tryOk=test&&patt===p;
      /* cour */
      var ah=c.H*0.4-10, ctop=10;
      var g=ctx.createLinearGradient(0,ctop,0,ctop+ah); g.addColorStop(0,"#eef6e6"); g.addColorStop(1,"#dcebcb"); S.draw.rrect(c,8,ctop,c.W-16,ah,12); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle="#c6dbb0"; ctx.lineWidth=1.5; ctx.stroke();
      var cell=44, rows, cols; for(;cell>=18;cell-=2){ rows=Math.max(1,Math.floor((ah-26)/cell)); cols=Math.ceil(t/rows); if(cols*cell<=c.W-28) break; }
      var nHens=Math.max(0,Math.round(test?xx:(ok?x:Math.max(0,Math.min(t,x)))));
      var nR=t-nHens; if(!test&&!ok){ nHens=0; nR=0; }
      var gx=(c.W-cols*cell)/2+cell/2, gy=ctop+14+cell*0.55;
      for(var i=0;i<t;i++){ var col=Math.floor(i/rows), row=i%rows, px=gx+col*cell, py=gy+row*cell;
        var kind=(!test&&!ok)?0:(i<nHens?1:2);
        if(kind===1) hen(ctx,px,py,cell,P.amber); else if(kind===2) rab(ctx,px,py,cell,"#8896aa"); else { ctx.save(); ctx.setLineDash([3,3]); ctx.strokeStyle=T0(P.grey,.6); ctx.lineWidth=1.4; ctx.beginPath(); ctx.arc(px,py,cell*.3,0,7); ctx.stroke(); ctx.restore(); S.draw.text(c,"?",px,py,{size:cell*.4,color:P.grey}); } }
      S.draw.label(c,t+" têtes",14,ctop+ah-10,{color:P.ink,size:fs-1,align:"left"});
      var pat=(test||ok)?patt:null;
      S.draw.label(c,(pat==null?"? pattes":pat+" pattes")+" (cible "+p+")",c.W-14,ctop+ah-10,{color:test?(tryOk?P.green:P.red):P.ink,size:fs-1,align:"right"});
      /* graphique */
      var gt=ctop+ah+14, ax=S.draw.axes(c,{x0:0,x1:30,y0:0,y1:30,xl:"poules x",yl:"lapins y",stepX:5,stepY:5,t:gt+6,b:34,r:12});
      S.draw.fn(c,ax,function(q){return t-q;},P.acc,2.6);
      S.draw.fn(c,ax,function(q){return (p-2*q)/4;},P.red,2.6);
      S.draw.legend(c,[[P.acc,"têtes : x + y = "+t],[P.red,"pattes : 2x + 4y = "+p]],c.W-14,gt+8,{align:"right"});
      if(x>=0&&y>=0&&x<=30&&y<=30) S.draw.dot(c,ax.X(x),ax.Y(y),7.5,ok?P.green:P.amber);
      if(test){ S.draw.dot(c,ax.X(xx),ax.Y(yy),6,tryOk?P.green:P.violet); S.draw.label(c,"essai",ax.X(xx)+8,ax.Y(yy)-14,{color:P.violet,size:fs-2,align:"left"}); }
      ro.set(0,S.fmt(x,1)); ro.set(1,S.fmt(y,1)); ro.set(2,ok?S.fmt(x,0)+" + "+S.fmt(y,0)+" = "+t+" ; "+S.fmt(2*x+4*y,0)+" pattes ✓":"—");
      if(test) nt.set(tryOk?"Trouvé : "+xx+" poules et "+yy+" lapins font "+patt+" pattes pour "+t+" têtes.":"Avec "+yy+" lapin(s) : "+xx+" × 2 + "+yy+" × 4 = "+patt+" pattes ("+(patt<p?"il en faut plus : ajoute des lapins":"trop : retire des lapins")+").",tryOk?"ok":"warn");
      else if(ok) nt.set(S.fmt(x,0)+" poules et "+S.fmt(y,0)+" lapins : "+S.fmt(x,0)+" × 2 + "+S.fmt(y,0)+" × 4 = "+S.fmt(p,0)+" pattes.","ok");
      else if(p%2===1) nt.set("P est impair : impossible, car poules et lapins ont un nombre pair de pattes.","warn");
      else if(y<0) nt.set("Pas assez de pattes pour "+t+" têtes : il faudrait un nombre négatif de lapins.","warn");
      else if(x<0) nt.set("Trop de pattes : il faudrait un nombre négatif de poules.","warn");
      else nt.set("Pas de solution entière pour ce couple (T ; P).","warn");
    });
  }
});
