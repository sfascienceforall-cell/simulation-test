/* Chapitre 9 : probabilités */
function pct(S,x,d){ return S.fmt(x*100,d===undefined?1:d)+" %"; }
function drawDie(c,x,y,s,face,col){ var ctx=c.ctx; ctx.save(); ctx.fillStyle="#fff"; ctx.strokeStyle=col; ctx.lineWidth=2; c.ctx.beginPath(); (function(){ var r=s*0.18; ctx.moveTo(x+r,y); ctx.arcTo(x+s,y,x+s,y+s,r); ctx.arcTo(x+s,y+s,x,y+s,r); ctx.arcTo(x,y+s,x,y,r); ctx.arcTo(x,y,x+s,y,r); ctx.closePath(); })(); ctx.fill(); ctx.stroke();
  var pos={1:[[.5,.5]],2:[[.25,.25],[.75,.75]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],5:[[.25,.25],[.75,.25],[.5,.5],[.25,.75],[.75,.75]],6:[[.25,.22],[.75,.22],[.25,.5],[.75,.5],[.25,.78],[.75,.78]]};
  ctx.fillStyle=col; (pos[face]||[]).forEach(function(q){ ctx.beginPath(); ctx.arc(x+q[0]*s,y+q[1]*s,s*0.085,0,6.2832); ctx.fill(); }); ctx.restore(); }

SFA.sim({
  id:"m6-c09-grands-nombres", ch:"c09", tag:"Classique",
  titre:"La fréquence se stabilise : loi des grands nombres",
  resume:"Répète une expérience 10, 100, 10 000 fois : la fréquence se rapproche de la probabilité.",
  but:"Choisis une expérience, puis lance-la de plus en plus de fois. Trois séries indépendantes sont tracées : la fréquence du succès après chaque lancer (échelle logarithmique en abscisse). La bande grise est l'enveloppe ±2·√(p(1−p)/n).",
  aRetenir:"La probabilité théorique d'un événement est la valeur vers laquelle la fréquence se stabilise quand le nombre d'essais augmente (loi des grands nombres). Les fluctuations diminuent comme 1/√n : pour avoir 10 fois plus de précision, il faut 100 fois plus d'essais.",
  piege:"La loi des grands nombres ne « compense » pas le passé : après 5 piles de suite, la probabilité de pile reste 1/2 (erreur du joueur). C'est la proportion qui se stabilise, pas l'écart absolu entre piles et faces.",
  build:function(k,S){
    var c=M6.canvas(k,.8,360), P=S.draw.palette;
    var EX={
      p:{n:"Pièce : obtenir pile",p:0.5,run:function(r){return r<0.5;}},
      d:{n:"Un dé : obtenir 6",p:1/6,run:function(r){return Math.floor(r*6)===5;}},
      u:{n:"Deux dés : au moins un 6",p:11/36,run:function(r,r2){return Math.floor(r*6)===5||Math.floor(r2*6)===5;}},
      s:{n:"Deux dés : somme égale à 12",p:1/36,run:function(r,r2){return Math.floor(r*6)===5&&Math.floor(r2*6)===5;}}
    };
    var sel=k.select("Expérience",[["p","Pièce : obtenir pile (p = 1/2)"],["d","Un dé : obtenir 6 (p = 1/6)"],["u","Deux dés : au moins un 6 (p = 11/36)"],["s","Deux dés : double six (p = 1/36)"]],"p",function(){ reset(); go(200); });
    var env=k.toggle("Montrer l'enveloppe ±2√(p(1−p)/n)",true);
    var runs=[{n:0,h:0,f:[],last:null},{n:0,h:0,f:[],last:null},{n:0,h:0,f:[],last:null}];
    function reset(){ runs.forEach(function(r){ r.n=0; r.h=0; r.f=[]; r.last=null; }); }
    function go(m){ var e=EX[sel.value]; runs.forEach(function(r){ for(var i=0;i<m&&r.n<20000;i++){ var a=Math.random(), b=Math.random(); r.n++; var ok=e.run(a,b); if(ok) r.h++; r.f[r.n]=r.h/r.n; r.last=[a,b,ok]; } }); }
    k.button("+ 1",function(){go(1);},true); k.button("+ 10",function(){go(10);}); k.button("+ 100",function(){go(100);}); k.button("+ 1 000",function(){go(1000);}); k.button("+ 10 000",function(){go(10000);}); k.button("Remise à zéro",function(){ reset(); });
    go(120);
    var ro=k.readouts(["Essais n","Succès (série 1)","Fréquence observée (série 1)","Probabilité théorique"]);
    var nt=k.note("","ok");
    var cols=[P.mat,P.green,P.violet];
    k.draw(function(){
      c.clear(); var ctx=c.ctx, e=EX[sel.value], W=c.W,H=c.H,L=46,R=14,T=14,B=36, fs=M6.fs(c,12), n=runs[0].n;
      var emax=Math.max(2,Math.ceil(Math.log10(Math.max(100,n)))), X=function(m){ return L+Math.log10(m)/emax*(W-L-R); };
      var lo=Math.max(0,e.p-0.4), hi=Math.min(1,e.p+0.4); if(e.p<0.2){ lo=0; hi=0.4; } if(e.p>0.8){ lo=0.6; hi=1; }
      var Y=function(y){ return H-B-(y-lo)/(hi-lo)*(H-T-B); };
      ctx.save(); ctx.font="600 "+(fs-1)+"px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="center"; ctx.textBaseline="top";
      for(var q=0;q<=emax;q++){ ctx.beginPath(); ctx.moveTo(X(Math.pow(10,q)),T); ctx.lineTo(X(Math.pow(10,q)),H-B); ctx.stroke(); ctx.fillText(M6.int(Math.pow(10,q)),X(Math.pow(10,q)),H-B+6); }
      ctx.textAlign="right"; ctx.textBaseline="middle"; for(var j=0;j<=4;j++){ var yy=lo+(hi-lo)*j/4; ctx.beginPath(); ctx.moveTo(L,Y(yy)); ctx.lineTo(W-R,Y(yy)); ctx.stroke(); ctx.fillText(S.fmt(yy,2),L-6,Y(yy)); }
      ctx.strokeStyle="#a3adba"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(L,T); ctx.lineTo(L,H-B); ctx.lineTo(W-R,H-B); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(L,T,W-L-R,H-T-B); ctx.clip();
      if(env.value){ ctx.fillStyle="rgba(138,149,163,.2)"; ctx.beginPath(); for(var m=1;m<=Math.pow(10,emax)*1.001;m*=1.1){ var d=2*Math.sqrt(e.p*(1-e.p)/m); m===1?ctx.moveTo(X(m),Y(e.p+d)):ctx.lineTo(X(m),Y(e.p+d)); } for(m=Math.pow(10,emax);m>=1;m/=1.1){ d=2*Math.sqrt(e.p*(1-e.p)/m); ctx.lineTo(X(m),Y(e.p-d)); } ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(L,Y(e.p)); ctx.lineTo(W-R,Y(e.p)); ctx.stroke(); ctx.setLineDash([]);
      runs.forEach(function(r,ri){ if(r.n>0){ ctx.strokeStyle=cols[ri]; ctx.lineWidth=ri?1.6:2.4; ctx.globalAlpha=ri?0.8:1; ctx.beginPath(); var step=Math.max(1,Math.floor(r.n/700)); for(var i=1;i<=r.n;i+=step){ i===1?ctx.moveTo(X(i),Y(r.f[i])):ctx.lineTo(X(i),Y(r.f[i])); } ctx.lineTo(X(r.n),Y(r.f[r.n])); ctx.stroke(); ctx.globalAlpha=1; } });
      ctx.restore();
      S.draw.text(c,"nombre d'essais n (échelle logarithmique)",W-R,H-8,{size:11,align:"right",color:P.grey}); S.draw.label(c,"p = "+S.fmt(e.p,3),L+8,Y(e.p)-14,{size:fs,align:"left",color:P.red});
      S.draw.legend(c,[[cols[0],"série 1"],[cols[1],"série 2"],[cols[2],"série 3"]],W-R-4,T+4,{align:"right"});
      /* dernier résultat de la série 1 */
      var last=runs[0].last; if(last){ var two=sel.value==="u"||sel.value==="s"; if(sel.value==="p"){ var side=last[0]<0.5; ctx.fillStyle=side?P.amber:"#cbd5e1"; ctx.beginPath(); ctx.arc(L+26,T+30,16,0,6.2832); ctx.fill(); S.draw.text(c,side?"P":"F",L+26,T+30.5,{size:16,color:"#fff",weight:800}); }
        else { drawDie(c,L+10,T+14,30,Math.floor(last[0]*6)+1,P.ink); if(two) drawDie(c,L+46,T+14,30,Math.floor(last[1]*6)+1,P.ink); } }
      var r1=runs[0]; ro.set(0,M6.int(r1.n)); ro.set(1,M6.int(r1.h)); ro.set(2,r1.n?S.fmt(r1.h/r1.n,4):"—"); ro.set(3,S.fmt(e.p,4));
      nt.set(r1.n===0?"Lance l'expérience pour commencer.":(r1.n<30?"Avec si peu d'essais, la fréquence bouge beaucoup : écart = "+S.fmt(Math.abs(r1.h/r1.n-e.p),3)+".":"Après "+M6.int(r1.n)+" essais, l'écart entre la fréquence (série 1) et la probabilité est "+S.fmt(Math.abs(r1.h/r1.n-e.p),4)+". Les trois séries se resserrent autour de p."),"ok");
    });
  }
});

SFA.sim({
  id:"m6-c09-arbre", ch:"c09", tag:"Classique",
  titre:"Arbre pondéré : probabilités composées et conditionnelles",
  resume:"Règle P(A), P(B | A) et P(B | non A) : lis P(A ∩ B), P(B) et P(A | B).",
  but:"Règle les trois probabilités de l'arbre. Les branches qui mènent à B sont en gras. Le carré unité à côté traduit l'arbre en aires : largeur = P(A), hauteur = P(B | …). Essaie de rendre A et B indépendants.",
  aRetenir:"Sur un arbre, on <i>multiplie</i> le long d'un chemin : P(A ∩ B) = P(A)·P(B | A). On <i>additionne</i> les chemins qui mènent à B (probabilités totales) : P(B) = P(A)·P(B | A) + P(Ā)·P(B | Ā). Alors P(A | B) = P(A ∩ B) / P(B) (formule de Bayes). A et B sont indépendants si P(B | A) = P(B).",
  piege:"P(A | B) et P(B | A) sont deux nombres différents. Et « indépendants » n'est pas « incompatibles » : des événements incompatibles (A ∩ B = ∅) de probabilité non nulle sont au contraire très dépendants.",
  build:function(k,S){
    var c=M6.canvas(k,.95,420), P=S.draw.palette;
    var pa=k.slider("P(A)",0,1,0.05,0.3,"",null), pba=k.slider("P(B | A)",0,1,0.05,0.8,"",null), pbn=k.slider("P(B | non A)",0,1,0.05,0.2,"",null);
    var ro=k.readouts(["P(A ∩ B)","P(B)","P(A | B)","P(B | A)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, W=c.W,H=c.H, A=pa.value, BA=pba.value, BN=pbn.value, fs=M6.fs(c,12), wide=W>=600;
      var th=wide?H:Math.round(H*0.62), tw=wide?Math.round(W*0.62):W;
      var f=function(x){return S.fmt(x,2);};
      var x0=34, x1=tw*0.4, x2=tw-(wide?150:148), ys=[th*0.14,th*0.38,th*0.62,th*0.86], yA=(ys[0]+ys[1])/2, yN=(ys[2]+ys[3])/2, y0=th/2;
      function edge(xa,ya,xb,yb,txt,bold,col,pr){ ctx.save(); ctx.strokeStyle=col||"#8a95a3"; ctx.lineWidth=Math.max(1.5,(bold?2.2:1.4)+pr*4); ctx.lineCap="round"; ctx.beginPath(); ctx.moveTo(xa,ya); ctx.lineTo(xb,yb); ctx.stroke(); ctx.restore(); S.draw.label(c,txt,(xa+xb)/2,(ya+yb)/2-(yb<ya?-14:14)*0+(yb<ya?-12:-12),{size:fs,color:col||P.ink,fill:"rgba(255,255,255,.94)"}); }
      edge(x0,y0,x1,yA,f(A),false,P.mat,A); edge(x0,y0,x1,yN,f(1-A),false,P.mat,1-A);
      edge(x1,yA,x2,ys[0],f(BA),true,P.red,BA); edge(x1,yA,x2,ys[1],f(1-BA),false,P.grey,1-BA);
      edge(x1,yN,x2,ys[2],f(BN),true,P.red,BN); edge(x1,yN,x2,ys[3],f(1-BN),false,P.grey,1-BN);
      S.draw.dot(c,x0,y0,6,P.ink); S.draw.dot(c,x1,yA,6,P.mat); S.draw.dot(c,x1,yN,6,P.mat);
      S.draw.label(c,"A",x1-14,yA-18,{color:P.mat,size:fs+1}); S.draw.label(c,"non A",x1-22,yN+22,{color:P.mat,size:fs});
      var lab=[["A ∩ B",A*BA],["A ∩ non B",A*(1-BA)],["non A ∩ B",(1-A)*BN],["non A ∩ non B",(1-A)*(1-BN)]];
      lab.forEach(function(l,i){ S.draw.dot(c,x2,ys[i],5,i===0||i===2?P.red:P.grey); S.draw.text(c,l[0]+" : "+S.fmt(l[1],3),x2+9,ys[i],{size:fs,align:"left",color:(i===0||i===2)?P.red:P.ink}); });
      /* carré unité : largeur P(A), hauteur P(B | …) */
      var side=wide?Math.min(W-tw-24,H-80):Math.min(H-th-62,W*0.52), sx=wide?tw+12:(W-side)/2, sy=wide?(H-side)/2+6:th+30;
      S.draw.panel(c,sx-6,sy-18,side+12,side+30,{shadow:false});
      var wA=A*side, hB1=BA*side, hB2=BN*side;
      ctx.fillStyle="#f1f3f7"; ctx.fillRect(sx,sy,side,side);
      ctx.fillStyle=S.draw.tint(P.red,0.45); ctx.fillRect(sx,sy+side-hB1,wA,hB1); ctx.fillRect(sx+wA,sy+side-hB2,side-wA,hB2);
      ctx.fillStyle=S.draw.tint(P.mat,0.18); ctx.fillRect(sx,sy,wA,side-hB1); ctx.fillStyle=S.draw.tint(P.grey,0.18); ctx.fillRect(sx+wA,sy,side-wA,side-hB2);
      ctx.strokeStyle="#13233a"; ctx.lineWidth=1.5; ctx.strokeRect(sx,sy,side,side); S.draw.line(c,sx+wA,sy,sx+wA,sy+side,"#13233a",1.5);
      S.draw.text(c,"A",sx+wA/2,sy-8,{size:11.5,color:P.mat}); S.draw.text(c,"non A",sx+wA+(side-wA)/2,sy-8,{size:11.5,color:P.mat});
      if(wA>26&&hB1>14) S.draw.text(c,"A∩B",sx+wA/2,sy+side-hB1/2,{size:10.5,color:"#7a1b0e"}); if(side-wA>40&&hB2>14) S.draw.text(c,"Ā∩B",sx+wA+(side-wA)/2,sy+side-hB2/2,{size:10.5,color:"#7a1b0e"});
      S.draw.text(c,"rouge = B : aire totale = P(B)",sx+side/2,sy+side+11,{size:10.5,color:P.red,weight:700});
      var pB=A*BA+(1-A)*BN, pAB=A*BA;
      ro.set(0,S.fmt(pAB,3)); ro.set(1,S.fmt(pB,3)); ro.set(2,pB>0?S.fmt(pAB/pB,3):"non défini"); ro.set(3,S.fmt(BA,3));
      if(A===0||A===1) nt.set("P(A) vaut 0 ou 1 : A est certain ou impossible, la notion de dépendance n'a plus d'intérêt.","warn");
      else if(Math.abs(BA-BN)<1e-9) nt.set("P(B | A) = P(B | non A) = "+S.fmt(BA,2)+" : B ne dépend pas de A, les événements sont <b>indépendants</b> (les deux colonnes rouges ont la même hauteur), et P(A ∩ B) = P(A)·P(B) = "+S.fmt(A*pB,3)+".","ok");
      else nt.set("P(B | A) ≠ P(B | non A) : A et B sont dépendants (hauteurs rouges différentes). Vérifie : P(A)·P(B) = "+S.fmt(A*pB,3)+" ≠ P(A ∩ B) = "+S.fmt(pAB,3)+".","warn");
    });
  }
});

SFA.sim({
  id:"m6-c09-test-medical", ch:"c09", tag:"Bayes · Niche utile",
  titre:"Test positif : suis-je vraiment malade ?",
  resume:"Prévalence, sensibilité, spécificité : la probabilité d'être malade après un test positif peut être faible.",
  but:"Chaque point est une personne parmi 1 000. Règle la prévalence de la maladie, la sensibilité et la spécificité du test, puis trie les personnes selon le résultat du test. Compare, parmi les positifs, les vrais malades (rouge) et les faux positifs (bleu).",
  aRetenir:"P(malade | test +) = P(M ∩ +) / P(+) = prév·sens / (prév·sens + (1 − prév)·(1 − spéc)). Quand la maladie est rare, les faux positifs (très nombreux sains × petit taux d'erreur) peuvent être plus nombreux que les vrais positifs : un test fiable à 95 % ne signifie pas « 95 % de chances d'être malade ».",
  piege:"La sensibilité P(+ | malade) n'est pas la valeur prédictive P(malade | +). C'est la confusion entre P(A | B) et P(B | A). Les valeurs choisies ici sont des exemples, pas des données d'un vrai test.",
  build:function(k,S){
    var c=M6.canvas(k,1,440), P=S.draw.palette;
    var prev=k.slider("Prévalence (part de malades)",0.1,30,0.1,1,"%",null), se=k.slider("Sensibilité P(+ | malade)",50,100,1,95,"%",null), sp=k.slider("Spécificité P(− | sain)",50,100,1,95,"%",null);
    var s=0, tgt=0, lp=k.loop(function(dt){ var d=tgt-s; s+=Math.sign(d)*Math.min(Math.abs(d),dt*1.3); if(Math.abs(tgt-s)<1e-4){ s=tgt; lp.pause(); } k.redraw(); });
    var tri=k.toggle("Trier selon le résultat du test",false,function(on){ tgt=on?1:0; lp.play(); });
    var ro=k.readouts(["P(malade | test +)","Vrais positifs / 10 000","Faux positifs / 10 000","P(sain | test −)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, pr=prev.value/100, s1=se.value/100, s2=sp.value/100, W=c.W, H=c.H, fs=M6.fs(c,12);
      var TP=pr*s1, FN=pr*(1-s1), FP=(1-pr)*(1-s2), TN=(1-pr)*s2, pos=TP+FP, neg=FN+TN;
      var N=1000, nTP=Math.round(TP*N), nFN=Math.round(FN*N), nFP=Math.round(FP*N), nTN=N-nTP-nFN-nFP;
      var cols=40, cell=Math.min(12,(W-24)/cols), r0=cell*0.4, ox=(W-cols*cell)/2, oy=34;
      var seq=[[nTP,P.red],[nFN,"#eaa59c"],[nFP,P.mat],[nTN,"#d5dbe5"]], idx=0, e=M6.ease(s);
      /* cases de destination quand on trie : boîte « positifs » à gauche, boîte « négatifs » à droite */
      var bw=(W-36)/2, colsB=Math.max(4,Math.floor((bw-10)/cell)), bx=[12,W/2+6];
      var posList=[], negList=[]; seq.forEach(function(sg,gi){ for(var i=0;i<sg[0];i++){ ((gi===0||gi===2)?posList:negList).push(gi); } });
      var counters={p:0,n:0}, order=0;
      seq.forEach(function(sg,gi){ for(var i=0;i<sg[0];i++){
        var r=Math.floor(idx/cols), q=idx%cols, x1=ox+q*cell+cell/2, y1=oy+r*cell+cell/2, x2, y2;
        if(gi===0||gi===2){ var m=counters.p++; x2=bx[0]+6+(m%colsB)*cell+cell/2; y2=oy+16+Math.floor(m/colsB)*cell+cell/2; } else { var m2=counters.n++; x2=bx[1]+6+(m2%colsB)*cell+cell/2; y2=oy+16+Math.floor(m2/colsB)*cell+cell/2; }
        var x=x1+(x2-x1)*e, y=y1+(y2-y1)*e; ctx.fillStyle=sg[1]; ctx.beginPath(); ctx.arc(x,y,r0,0,6.2832); ctx.fill(); idx++; } });
      var rows=Math.ceil(N/cols), gridBottom=oy+rows*cell;
      if(e>0.02){ ctx.save(); ctx.globalAlpha=e; [[0,"Test positif ("+(nTP+nFP)+")"],[1,"Test négatif ("+(nFN+nTN)+")"]].forEach(function(b){ var h=Math.ceil((b[0]?(nFN+nTN):(nTP+nFP))/colsB)*cell+22; ctx.strokeStyle="#cdd5e1"; ctx.lineWidth=1.5; S.draw.rrect(c,bx[b[0]],oy+8,bw,Math.min(h,gridBottom-oy),8); ctx.stroke(); S.draw.text(c,b[1],bx[b[0]]+bw/2,oy-1,{size:fs,color:P.ink,weight:800}); }); ctx.restore(); }
      else S.draw.text(c,"1 000 personnes : chaque point est quelqu'un",W/2,oy-12,{size:fs,color:P.grey,weight:700});
      /* légende + afficheur */
      var ly=gridBottom+16, dispW=Math.min(150,W*0.4);
      [[P.red,"Vrais positifs ("+nTP+")"],["#eaa59c","Faux négatifs ("+nFN+")"],[P.mat,"Faux positifs ("+nFP+")"],["#bcc5d3","Vrais négatifs ("+nTN+")"]].forEach(function(l,i){ var x=14, y=ly+i*20; ctx.fillStyle=l[0]; ctx.beginPath(); ctx.arc(x+6,y,6,0,6.2832); ctx.fill(); S.draw.text(c,l[1],x+18,y,{size:fs,align:"left"}); });
      S.draw.display(c,pct(S,TP/pos,1),W-dispW/2-12,ly+12,{w:dispW,h:56,caption:"P(MALADE | TEST +)",color:TP/pos<0.5?"#a5301f":"#1c5a43"});
      ro.set(0,pct(S,TP/pos,1)); ro.set(1,String(Math.round(TP*10000)));
      ro.set(2,String(Math.round(FP*10000))); ro.set(3,pct(S,TN/neg,2));
      nt.set("Parmi 10 000 personnes, "+Math.round(pos*10000)+" sont positives dont seulement "+Math.round(TP*10000)+" malades : "+pct(S,TP/pos,1)+" des positifs sont vraiment malades.", TP/pos<0.5?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"m6-c09-monty-hall", ch:"c09", tag:"Paradoxe",
  titre:"Monty Hall : faut-il changer de porte ?",
  resume:"Joue plusieurs parties, puis simule 1 000 parties : changer double les chances de gagner.",
  but:"Derrière une porte : une voiture ; derrière les deux autres : des chèvres. Clique sur une porte, l'animateur en ouvre une avec une chèvre, puis tu gardes ou tu changes (clique sur la porte de ton choix). Ensuite lance une simulation de 1 000 parties.",
  aRetenir:"Au départ, ta porte a 1 chance sur 3 d'être la bonne et les deux autres ensemble 2 chances sur 3. L'animateur sait où est la voiture et ouvre toujours une chèvre : ces 2/3 se concentrent sur la porte restante. Garder gagne dans 1/3 des cas, changer dans 2/3 des cas.",
  piege:"Ce n'est pas du 50/50 : les deux portes restantes ne sont pas équiprobables, parce que l'animateur n'ouvre pas une porte au hasard. L'information qu'il donne n'est pas symétrique.",
  build:function(k,S){
    var c=M6.canvas(k,.88,380), P=S.draw.palette;
    var st, rec={sw:[0,0],kp:[0,0]}, openA=[0,0,0], geo=null;
    function newGame(){ st={phase:0,car:Math.floor(Math.random()*3),pick:-1,open:-1,final:-1}; openA=[0,0,0]; lp.play(); }
    var lp=k.loop(function(dt){ var busy=false; for(var i=0;i<3;i++){ var want=(st.open===i||st.phase===2)?1:0, d=want-openA[i]; if(Math.abs(d)>0.001){ openA[i]+=Math.sign(d)*Math.min(Math.abs(d),dt*2.6); busy=true; } } k.redraw(); if(!busy) lp.pause(); });
    newGame();
    function choose(i){ if(st.phase!==0) return; st.pick=i; var opts=[0,1,2].filter(function(j){return j!==i&&j!==st.car;}); st.open=opts[Math.floor(Math.random()*opts.length)]; st.phase=1; lp.play(); }
    function decide(sw){ if(st.phase!==1) return; var other=[0,1,2].filter(function(j){return j!==st.pick&&j!==st.open;})[0]; st.final=sw?other:st.pick; st.phase=2; var win=st.final===st.car; if(sw){ rec.sw[1]++; if(win) rec.sw[0]++; } else { rec.kp[1]++; if(win) rec.kp[0]++; } lp.play(); }
    k.button("Garder ma porte",function(){decide(false);}); k.button("Changer de porte",function(){decide(true);}); k.button("Nouvelle partie",function(){newGame();},true);
    k.button("Simuler 1 000 parties",function(){ for(var g=0;g<1000;g++){ var car=Math.floor(Math.random()*3), pick=Math.floor(Math.random()*3); rec.kp[1]++; if(pick===car) rec.kp[0]++; rec.sw[1]++; if(pick!==car) rec.sw[0]++; } });
    k.button("Remettre les scores à zéro",function(){ rec={sw:[0,0],kp:[0,0]}; });
    var ro=k.readouts(["Parties « garder »","Victoires « garder »","Parties « changer »","Victoires « changer »"]);
    var nt=k.note("","ok");
    function goat(ctx,cx,cy,s){ ctx.save(); ctx.fillStyle="#f5f1e8"; ctx.strokeStyle="#8b7d62"; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(cx,cy+s*0.1,s*0.4,s*0.24,0,0,6.2832); ctx.fill(); ctx.stroke();
      [[-0.26,0.3],[-0.1,0.32],[0.12,0.32],[0.27,0.3]].forEach(function(l){ ctx.fillRect(cx+l[0]*s-s*0.025,cy+l[1]*s-s*0.04,s*0.05,s*0.25); }); ctx.beginPath(); ctx.arc(cx+s*0.42,cy-s*0.12,s*0.14,0,6.2832); ctx.fill(); ctx.stroke();
      ctx.strokeStyle="#6b5d44"; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(cx+s*0.4,cy-s*0.24); ctx.quadraticCurveTo(cx+s*0.36,cy-s*0.42,cx+s*0.5,cy-s*0.4); ctx.moveTo(cx+s*0.47,cy-s*0.23); ctx.quadraticCurveTo(cx+s*0.5,cy-s*0.38,cx+s*0.62,cy-s*0.33); ctx.stroke();
      ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.arc(cx+s*0.47,cy-s*0.14,s*0.022,0,6.2832); ctx.fill(); ctx.restore(); }
    function carDraw(ctx,cx,cy,s){ ctx.save(); ctx.fillStyle=P.red; ctx.beginPath(); ctx.moveTo(cx-s*0.5,cy+s*0.12); ctx.lineTo(cx-s*0.5,cy-s*0.02); ctx.lineTo(cx-s*0.28,cy-s*0.06); ctx.lineTo(cx-s*0.14,cy-s*0.24); ctx.lineTo(cx+s*0.22,cy-s*0.24); ctx.lineTo(cx+s*0.36,cy-s*0.04); ctx.lineTo(cx+s*0.5,cy-s*0.0); ctx.lineTo(cx+s*0.5,cy+s*0.12); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#dbeafe"; ctx.beginPath(); ctx.moveTo(cx-s*0.2,cy-s*0.05); ctx.lineTo(cx-s*0.1,cy-s*0.2); ctx.lineTo(cx+s*0.2,cy-s*0.2); ctx.lineTo(cx+s*0.29,cy-s*0.05); ctx.closePath(); ctx.fill();
      [-0.28,0.28].forEach(function(f){ ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.arc(cx+f*s,cy+s*0.13,s*0.1,0,6.2832); ctx.fill(); ctx.fillStyle="#cbd5e1"; ctx.beginPath(); ctx.arc(cx+f*s,cy+s*0.13,s*0.04,0,6.2832); ctx.fill(); }); ctx.restore(); }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, W=c.W,H=c.H, fs=M6.fs(c,12);
      var dh=Math.round(H*0.6), dw=Math.min(118,(W-40)/3.3), gap=(W-3*dw)/4, y=26, h=dh-22; geo=[];
      for(var i=0;i<3;i++){ var x=gap+i*(dw+gap), o=openA[i]; geo.push({x:x,y:y,w:dw,h:h});
        ctx.fillStyle="#e8ecf3"; ctx.fillRect(x,y,dw,h); /* fond de la niche */
        var open=o>0.5; if(o>0.02){ var cx=x+dw/2, cy=y+h*0.62; if(st.car===i) carDraw(ctx,cx,cy,dw*0.82); else goat(ctx,cx-dw*0.08,cy,dw*0.8); }
        /* vantail qui pivote : largeur réduite quand la porte s'ouvre */
        var pw=dw*(1-0.88*o); ctx.fillStyle=(st.pick===i&&st.phase>0)?"#2a57c4":P.mat; ctx.fillRect(x,y,pw,h); ctx.strokeStyle="rgba(255,255,255,.18)"; ctx.lineWidth=1.5; ctx.strokeRect(x+pw*0.12,y+h*0.07,pw*0.76,h*0.4); ctx.strokeRect(x+pw*0.12,y+h*0.53,pw*0.76,h*0.4);
        if(pw>dw*0.4){ ctx.fillStyle="#f4c542"; ctx.beginPath(); ctx.arc(x+pw*0.82,y+h*0.52,4,0,6.2832); ctx.fill(); S.draw.text(c,String(i+1),x+pw/2,y+h*0.27,{size:Math.round(dw*0.34),color:"#ffffff",weight:800}); }
        ctx.strokeStyle=(st.pick===i)?P.amber:"#13233a"; ctx.lineWidth=(st.pick===i)?4:2; ctx.strokeRect(x,y,dw,h);
        var tag=""; if(st.phase===2&&st.final===i) tag="choix final"; else if(st.pick===i&&st.phase>0) tag="ton choix"; else if(st.open===i&&st.phase===1) tag="ouverte par l'animateur";
        if(tag) S.draw.label(c,tag,x+dw/2,y+h+16,{size:fs,color:P.amber}); }
      /* scores */
      var by=dh+50, bh=Math.max(14,Math.min(24,(H-by-30)/2-4)), lx=96, rx=W-16;
      S.draw.text(c,"Fréquence de victoire",12,by-10,{size:fs,align:"left",color:P.grey,weight:800});
      [[ "Garder",rec.kp,P.grey,1/3],["Changer",rec.sw,P.green,2/3]].forEach(function(r,i){ var yy=by+i*(bh+8), fr=r[1][1]?r[1][0]/r[1][1]:0;
        S.draw.text(c,r[0],lx-8,yy+bh/2,{size:fs,align:"right",color:r[2],weight:800}); ctx.fillStyle="#eef1f5"; ctx.fillRect(lx,yy,rx-lx,bh); ctx.fillStyle=r[2]; ctx.fillRect(lx,yy,(rx-lx)*fr,bh);
        S.draw.line(c,lx+(rx-lx)*r[3],yy-3,lx+(rx-lx)*r[3],yy+bh+3,P.red,2); S.draw.text(c,r[1][1]?pct(S,fr,0)+" ("+r[1][0]+"/"+r[1][1]+")":"—",lx+6,yy+bh/2,{size:fs,align:"left",color:fr>0.12?"#fff":P.ink,weight:700}); });
      S.draw.text(c,"traits rouges : 1/3 et 2/3 (valeurs théoriques)",rx,by+2*(bh+8)+6,{size:10.5,align:"right",color:P.red});
      ro.set(0,String(rec.kp[1])); ro.set(1,rec.kp[1]?rec.kp[0]+" ("+pct(S,rec.kp[0]/rec.kp[1],0)+")":"—"); ro.set(2,String(rec.sw[1])); ro.set(3,rec.sw[1]?rec.sw[0]+" ("+pct(S,rec.sw[0]/rec.sw[1],0)+")":"—");
      if(st.phase===0) nt.set("Étape 1 : clique sur la porte que tu choisis.","ok");
      else if(st.phase===1) nt.set("L'animateur a ouvert la porte "+(st.open+1)+" (chèvre). Garder ou changer ? Clique sur ta porte pour la garder, sur l'autre porte fermée pour changer.","ok");
      else nt.set(st.final===st.car?"Gagné ! La voiture était derrière la porte "+(st.car+1)+".":"Perdu : la voiture était derrière la porte "+(st.car+1)+".","ok");
    });
    c.pointer(function(type,p){ if(!geo) return; var hit=-1; geo.forEach(function(g,i){ if(p.x>=g.x&&p.x<=g.x+g.w&&p.y>=g.y&&p.y<=g.y+g.h) hit=i; });
      if(type==="move"){ c.cv.style.cursor=hit>=0&&st.phase<2&&hit!==st.open?"pointer":"default"; return; }
      if(type==="down"&&hit>=0){ if(st.phase===0) choose(hit); else if(st.phase===1&&hit!==st.open){ decide(hit!==st.pick); } else if(st.phase===2) { /* rien */ } k.redraw(); } });
  }
});
