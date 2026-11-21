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
  resume:"Le plateau du jeu : trois portes, une voiture, deux chèvres. Joue, puis regarde les scores « garder / changer » se remplir.",
  but:"Derrière une porte : une voiture ; derrière les deux autres : des chèvres. Clique sur une porte, l'animateur en ouvre une avec une chèvre, puis tu gardes ou tu changes (clique sur la porte de ton choix). Lance ensuite les parties automatiques (une sur deux en gardant, une sur deux en changeant) ou simule 1 000 parties : les scores se remplissent en direct.",
  aRetenir:"Au départ, ta porte a 1 chance sur 3 d'être la bonne et les deux autres ensemble 2 chances sur 3. L'animateur sait où est la voiture et ouvre toujours une chèvre : ces 2/3 se concentrent sur la porte restante. Garder gagne dans 1/3 des cas, changer dans 2/3 des cas.",
  piege:"Ce n'est pas du 50/50 : les deux portes restantes ne sont pas équiprobables, parce que l'animateur n'ouvre pas une porte au hasard. L'information qu'il donne n'est pas symétrique.",
  build:function(k,S){
    var c=M6.canvas(k,.98,470), P=S.draw.palette;
    var st, rec={sw:[0,0],kp:[0,0]}, openA=[0,0,0], geo=null, clock=0, confetti=[], auto={on:false,t:0,strat:true}, simQ=0, flash={kp:0,sw:0};
    function lin(ctx,x0,y0,x1,y1,s){ var g=ctx.createLinearGradient(x0,y0,x1,y1); s.forEach(function(q){ g.addColorStop(q[0],q[1]); }); return g; }
    function rr(x,y,w,h,r){ S.draw.rrect(c,x,y,w,h,r); }
    function newGame(){ st={phase:0,car:Math.floor(Math.random()*3),pick:-1,open:-1,final:-1,tReveal:0,last:null}; openA=[0,0,0]; confetti=[]; }
    function choose(i){ if(st.phase!==0) return; st.pick=i; var opts=[0,1,2].filter(function(j){return j!==i&&j!==st.car;}); st.open=opts[Math.floor(Math.random()*opts.length)]; st.phase=1; }
    function decide(sw){ if(st.phase!==1) return; var other=[0,1,2].filter(function(j){return j!==st.pick&&j!==st.open;})[0]; st.final=sw?other:st.pick; st.phase=2; st.tReveal=0; var win=st.final===st.car; st.last={sw:sw,win:win};
      if(sw){ rec.sw[1]++; if(win) rec.sw[0]++; flash.sw=1; } else { rec.kp[1]++; if(win) rec.kp[0]++; flash.kp=1; } }
    function burst(i){ if(!geo) return; var g=geo[i]; for(var n=0;n<46;n++) confetti.push({x:g.x+g.w/2,y:g.y+g.h*0.35,vx:(Math.random()-0.5)*260,vy:-120-Math.random()*220,r:Math.random()*6.28,vr:(Math.random()-0.5)*12,c:["#f4c542","#c0321d","#2f7fd1","#24775a","#c43a7a","#ffffff"][n%6],life:1.8}); }
    newGame();
    var lp=k.loop(function(dt){
      clock+=dt; var sp=+speed.value;
      /* ouverture des vantaux : la porte de l'animateur, puis le choix final, puis la dernière */
      for(var i=0;i<3;i++){ var want=0; if(st.open===i) want=1; if(st.phase===2){ if(i===st.final&&st.tReveal>0.15) want=1; if(i!==st.final&&i!==st.open&&st.tReveal>0.75) want=1; }
        var d=want-openA[i]; if(Math.abs(d)>0.001){ var was=openA[i]; openA[i]+=Math.sign(d)*Math.min(Math.abs(d),dt*2.4*Math.max(1,sp*0.8)); if(was<0.45&&openA[i]>=0.45&&i===st.car) burst(i); } }
      if(st.phase===2) st.tReveal+=dt*Math.max(1,sp*0.8);
      confetti.forEach(function(p){ p.vy+=380*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=0.985; p.r+=p.vr*dt; p.life-=dt; }); confetti=confetti.filter(function(p){ return p.life>0; });
      flash.kp=Math.max(0,flash.kp-dt*1.5); flash.sw=Math.max(0,flash.sw-dt*1.5);
      /* parties automatiques */
      if(auto.on){ auto.t+=dt*sp;
        if(st.phase===0&&auto.t>0.55) choose(Math.floor(Math.random()*3));
        if(st.phase===1&&auto.t>1.7){ decide(auto.strat); }
        if(st.phase===2&&auto.t>3.5){ newGame(); auto.t=0; auto.strat=!auto.strat; } }
      /* 1 000 parties simulées : le score se remplit en direct */
      if(simQ>0){ var m=Math.min(simQ,Math.max(1,Math.round(dt*420))); for(var gg=0;gg<m;gg++){ var car=Math.floor(Math.random()*3), pick=Math.floor(Math.random()*3); rec.kp[1]++; if(pick===car) rec.kp[0]++; rec.sw[1]++; if(pick!==car) rec.sw[0]++; } simQ-=m; flash.kp=flash.sw=0.6; }
      k.redraw();
    });
    var speed;
    var bAuto=k.button("▶ Parties automatiques",function(){ auto.on=!auto.on; if(auto.on){ newGame(); auto.t=0; } bAuto.textContent=auto.on?"❚❚ Arrêter les parties":"▶ Parties automatiques"; },true);
    k.button("Garder ma porte",function(){ stopAuto(); decide(false); }); k.button("Changer de porte",function(){ stopAuto(); decide(true); });
    k.button("Nouvelle partie",function(){ stopAuto(); newGame(); });
    k.button("Simuler 1 000 parties",function(){ simQ+=1000; });
    k.button("Remettre les scores à zéro",function(){ rec={sw:[0,0],kp:[0,0]}; simQ=0; });
    speed=k.seg("Vitesse des parties automatiques",[[1,"×1"],[3,"×3"],[8,"×8"]],1);
    function stopAuto(){ if(auto.on){ auto.on=false; bAuto.textContent="▶ Parties automatiques"; } }
    var ro=k.readouts(["Parties « garder »","Victoires « garder »","Parties « changer »","Victoires « changer »"]);
    var nt=k.note("","ok");
    lp.play();
    /* ---- dessins ---- */
    function goat(ctx,cx,cy,s,t){ /* (cx, cy) = sol sous la chèvre ; s = largeur */
      ctx.save(); ctx.translate(cx,cy); var u=s/100, chew=Math.sin(t*6)*1.2*u; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.fillStyle="rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0,0,40*u,6*u,0,0,6.2832); ctx.fill();
      ctx.strokeStyle="#b9ab8f"; ctx.lineWidth=7*u; [[-26,-2],[-14,2],[14,-2],[24,2]].forEach(function(l,i){ ctx.strokeStyle=i%2?"#cfc3a8":"#b9ab8f"; ctx.beginPath(); ctx.moveTo(l[0]*u,-30*u); ctx.lineTo((l[0]+l[1])*u,-3*u); ctx.stroke(); });
      ctx.fillStyle="#4a3d2a"; [[-26,-2],[-14,2],[14,-2],[24,2]].forEach(function(l){ ctx.fillRect((l[0]+l[1]-4)*u,-5*u,8*u,5*u); });
      var g=ctx.createRadialGradient(-6*u,-50*u,4*u,0,-40*u,40*u); g.addColorStop(0,"#ffffff"); g.addColorStop(1,"#d9cfba");
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(0,-40*u,36*u,17*u,0,0,6.2832); ctx.fill();
      ctx.fillStyle="#efe7d6"; ctx.beginPath(); ctx.moveTo(-34*u,-46*u); ctx.lineTo(-44*u,-56*u+Math.sin(t*9)*3*u); ctx.lineTo(-36*u,-40*u); ctx.closePath(); ctx.fill();
      /* cou et tête */
      ctx.fillStyle="#f3ecdd"; ctx.beginPath(); ctx.moveTo(22*u,-50*u); ctx.lineTo(34*u,-72*u); ctx.lineTo(44*u,-66*u); ctx.lineTo(34*u,-38*u); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.translate(40*u,-74*u); ctx.rotate(0.35);
      ctx.fillStyle="#f6f0e3"; ctx.beginPath(); ctx.ellipse(6*u,0,15*u,9*u,0,0,6.2832); ctx.fill();
      ctx.fillStyle="#e3d6bd"; ctx.beginPath(); ctx.ellipse(17*u,2*u+chew*0.3,6*u,6*u,0,0,6.2832); ctx.fill();
      ctx.strokeStyle="#7a6a4e"; ctx.lineWidth=3.2*u; ctx.beginPath(); ctx.moveTo(-2*u,-7*u); ctx.quadraticCurveTo(-10*u,-22*u,-20*u,-14*u); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3*u,-8*u); ctx.quadraticCurveTo(-3*u,-24*u,-13*u,-19*u); ctx.stroke();
      ctx.fillStyle="#e8dcc4"; ctx.beginPath(); ctx.ellipse(-6*u,-2*u,9*u,3.5*u,-0.5,0,6.2832); ctx.fill();
      ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.arc(8*u,-3*u,1.9*u,0,6.2832); ctx.fill();
      ctx.fillStyle="#cfc3a8"; ctx.beginPath(); ctx.moveTo(12*u,7*u); ctx.lineTo(16*u,19*u+chew); ctx.lineTo(19*u,7*u); ctx.closePath(); ctx.fill();
      ctx.restore(); ctx.restore(); }
    function car(ctx,cx,cy,s,t){ /* (cx, cy) = sol ; s = longueur */
      ctx.save(); ctx.translate(cx,cy); var u=s/100;
      ctx.fillStyle="rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0,0,50*u,6*u,0,0,6.2832); ctx.fill();
      ctx.fillStyle=lin(ctx,0,-34*u,0,-6*u,[[0,"#e24a33"],[0.55,"#c0321d"],[1,"#7d1d10"]]);
      ctx.beginPath(); ctx.moveTo(-50*u,-10*u); ctx.lineTo(-50*u,-20*u); ctx.quadraticCurveTo(-46*u,-26*u,-30*u,-27*u); ctx.lineTo(-16*u,-40*u); ctx.quadraticCurveTo(0,-45*u,18*u,-40*u); ctx.lineTo(30*u,-28*u); ctx.quadraticCurveTo(48*u,-26*u,50*u,-18*u); ctx.lineTo(50*u,-10*u); ctx.closePath(); ctx.fill();
      ctx.fillStyle=lin(ctx,0,-40*u,0,-28*u,[[0,"#dbeafe"],[1,"#8fb3d9"]]);
      ctx.beginPath(); ctx.moveTo(-26*u,-28*u); ctx.lineTo(-14*u,-38*u); ctx.lineTo(-1*u,-39*u); ctx.lineTo(-1*u,-28*u); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(2*u,-28*u); ctx.lineTo(2*u,-39*u); ctx.lineTo(16*u,-38*u); ctx.lineTo(25*u,-28*u); ctx.closePath(); ctx.fill();
      ctx.fillStyle="rgba(255,255,255,.35)"; ctx.fillRect(-46*u,-24*u,92*u,2*u);
      ctx.fillStyle="#fff6b0"; ctx.beginPath(); ctx.ellipse(47*u,-19*u,3*u,2.4*u,0,0,6.2832); ctx.fill();
      ctx.fillStyle="#ff8a7a"; ctx.fillRect(-50*u,-21*u,3*u,4*u);
      [-30,30].forEach(function(f){ ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.arc(f*u,-9*u,10*u,0,6.2832); ctx.fill(); ctx.fillStyle=lin(ctx,0,-15*u,0,-3*u,[[0,"#e3e7ed"],[1,"#8a95a3"]]); ctx.beginPath(); ctx.arc(f*u,-9*u,5.5*u,0,6.2832); ctx.fill();
        ctx.strokeStyle="#5f6b7a"; ctx.lineWidth=1.2*u; for(var a=0;a<5;a++){ var q=a*1.2566+t*0; ctx.beginPath(); ctx.moveTo(f*u,-9*u); ctx.lineTo(f*u+Math.cos(q)*5*u,-9*u+Math.sin(q)*5*u); ctx.stroke(); } });
      /* nœud de cadeau */
      ctx.fillStyle="#f4c542"; ctx.fillRect(-3*u,-43*u,6*u,33*u); ctx.beginPath(); ctx.ellipse(-8*u,-47*u,7*u,4*u,-0.4,0,6.2832); ctx.ellipse(8*u,-47*u,7*u,4*u,0.4,0,6.2832); ctx.fill();
      ctx.restore(); }
    function host(ctx,x,y,h,pointTo,t){ /* présentateur : (x, y) = pieds */
      var u=h/100; ctx.save(); ctx.translate(x,y); ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.fillStyle="rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0,0,20*u,4*u,0,0,6.2832); ctx.fill();
      ctx.strokeStyle="#241a3d"; ctx.lineWidth=10*u; ctx.beginPath(); ctx.moveTo(-5*u,-44*u); ctx.lineTo(-7*u,-4*u); ctx.moveTo(5*u,-44*u); ctx.lineTo(7*u,-4*u); ctx.stroke();
      ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.ellipse(-5*u,-3*u,8*u,4*u,0,0,6.2832); ctx.ellipse(10*u,-3*u,8*u,4*u,0,0,6.2832); ctx.fill();
      ctx.fillStyle=lin(ctx,-16*u,0,16*u,0,[[0,"#6236c4"],[1,"#40218a"]]); rr(-16*u,-86*u,32*u,46*u,10*u); ctx.fill();
      ctx.fillStyle="#ffffff"; ctx.beginPath(); ctx.moveTo(-6*u,-86*u); ctx.lineTo(6*u,-86*u); ctx.lineTo(0,-62*u); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#c0321d"; ctx.beginPath(); ctx.moveTo(-6*u,-84*u); ctx.lineTo(0,-80*u); ctx.lineTo(-6*u,-76*u); ctx.closePath(); ctx.moveTo(6*u,-84*u); ctx.lineTo(0,-80*u); ctx.lineTo(6*u,-76*u); ctx.closePath(); ctx.fill();
      /* bras : un tient le micro, l'autre montre la porte */
      ctx.strokeStyle="#4b2a9e"; ctx.lineWidth=8*u; ctx.beginPath(); ctx.moveTo(-12*u,-80*u); ctx.lineTo(-16*u,-60*u); ctx.lineTo(-6*u,-66*u); ctx.stroke();
      ctx.fillStyle="#2c3a4e"; ctx.fillRect(-8*u,-78*u,4*u,13*u); ctx.fillStyle="#8a95a3"; ctx.beginPath(); ctx.arc(-6*u,-80*u,4*u,0,6.2832); ctx.fill();
      var ang=pointTo==null?1.2:Math.atan2(pointTo[1]-(y-80*u),pointTo[0]-x)+Math.PI/2, wave=pointTo==null?Math.sin(t*2)*0.15:0;
      ctx.save(); ctx.translate(12*u,-80*u); ctx.rotate(ang+wave); ctx.strokeStyle="#4b2a9e"; ctx.lineWidth=8*u; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-28*u); ctx.stroke(); ctx.fillStyle="#f0c9a0"; ctx.beginPath(); ctx.arc(0,-31*u,4.5*u,0,6.2832); ctx.fill(); ctx.restore();
      ctx.fillStyle="#f0c9a0"; ctx.fillRect(-4*u,-92*u,8*u,7*u); ctx.beginPath(); ctx.arc(0,-98*u,11*u,0,6.2832); ctx.fill();
      ctx.fillStyle="#2b1d14"; ctx.beginPath(); ctx.arc(0,-101*u,11.5*u,Math.PI*1.05,Math.PI*2.02); ctx.fill();
      ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.arc(-4*u,-98*u,1.4*u,0,6.2832); ctx.arc(4*u,-98*u,1.4*u,0,6.2832); ctx.fill();
      ctx.strokeStyle="#9a4a3a"; ctx.lineWidth=1.6*u; ctx.beginPath(); ctx.arc(0,-94*u,4*u,0.2,Math.PI-0.2); ctx.stroke();
      ctx.restore(); }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, W=c.W, H=c.H, small=W<470, fs=M6.fs(c,12), t=clock;
      /* studio */
      ctx.fillStyle=lin(ctx,0,0,0,H,[[0,"#1b1240"],[0.6,"#2c1f63"],[1,"#120c2b"]]); ctx.fillRect(0,0,W,H);
      /* projecteurs */
      ctx.save(); ctx.globalCompositeOperation="lighter";
      [[0.15,0.4],[0.5,-0.2],[0.85,-0.5]].forEach(function(q,i){ var x0=q[0]*W, sw=Math.sin(t*0.6+i*2)*0.25+q[1]*0.2, x1=x0+Math.sin(sw)*H; ctx.fillStyle=lin(ctx,0,0,0,H*0.8,[[0,"rgba(180,160,255,.22)"],[1,"rgba(180,160,255,0)"]]); ctx.beginPath(); ctx.moveTo(x0-6,0); ctx.lineTo(x0+6,0); ctx.lineTo(x1+70,H*0.8); ctx.lineTo(x1-70,H*0.8); ctx.closePath(); ctx.fill(); });
      ctx.restore();
      /* enseigne lumineuse */
      var sg=small?"3 PORTES":"LE JEU DES 3 PORTES", sw_=Math.min(W-30,small?170:300), sx=W/2-sw_/2, sy=8, sh=small?30:34;
      ctx.fillStyle="#3a1d0e"; rr(sx,sy,sw_,sh,9); ctx.fill(); ctx.strokeStyle="#f4c542"; ctx.lineWidth=2; ctx.stroke();
      var nb=Math.floor(sw_/14); for(var b=0;b<nb;b++){ var on=(Math.floor(t*6)+b)%3===0; ctx.fillStyle=on?"#fff3b0":"#a8842c"; ctx.beginPath(); ctx.arc(sx+7+b*(sw_-14)/(nb-1),sy+3.5,2,0,6.2832); ctx.arc(sx+7+b*(sw_-14)/(nb-1),sy+sh-3.5,2,0,6.2832); ctx.fill(); }
      S.draw.text(c,sg,W/2,sy+sh/2+1,{size:small?14:17,weight:800,color:"#f4c542"});
      /* portes */
      var boardH=small?118:112, floorY=H-boardH-34, hostW=small?0:Math.min(100,W*0.17);
      var doorTop=sy+sh+30, dh=floorY-doorTop, areaL=hostW+10, areaW=W-areaL-10, dw=Math.min(dh*0.62,(areaW-30)/3.25), gap=(areaW-3*dw)/4; geo=[];
      /* sol brillant */
      ctx.fillStyle=lin(ctx,0,floorY,0,H,[[0,"#3b2a78"],[1,"#150e30"]]); ctx.fillRect(0,floorY,W,H-floorY);
      ctx.strokeStyle="rgba(255,255,255,.08)"; ctx.lineWidth=1; ctx.beginPath(); for(var fx=-W;fx<2*W;fx+=40){ ctx.moveTo(W/2+(fx-W/2)*0.35,floorY); ctx.lineTo(fx,H); } ctx.stroke();
      var COL=[["#c0321d","#7d1d10"],["#1f4b9e","#12306b"],["#24775a","#134a37"]];
      for(var i=0;i<3;i++){ var x=areaL+gap+i*(dw+gap), y=doorTop, h=dh, o=openA[i]; geo.push({x:x,y:y,w:dw,h:h});
        /* cadre lumineux */
        ctx.fillStyle="#2a1a10"; rr(x-9,y-9,dw+18,h+9,8); ctx.fill();
        var nbb=Math.floor((2*h+dw)/16); for(var q=0;q<nbb;q++){ var d=q*16, bx, by; if(d<h){ bx=x-4.5; by=y+h-d; } else if(d<h+dw){ bx=x+(d-h); by=y-4.5; } else { bx=x+dw+4.5; by=y+(d-h-dw); } var lit=(Math.floor(t*7)+q)%4<2||(st.pick===i&&st.phase<2); ctx.fillStyle=lit?(st.pick===i?"#ffd36b":"#fff3b0"):"#8a6a24"; ctx.beginPath(); ctx.arc(bx,by,2.3,0,6.2832); ctx.fill(); }
        /* coulisse derrière la porte */
        ctx.fillStyle=lin(ctx,0,y,0,y+h,[[0,"#0e0a20"],[0.75,"#2a2152"],[1,"#3d3170"]]); ctx.fillRect(x,y,dw,h);
        if(o>0.01){ S.draw.glow(c,x+dw/2,y+h*0.55,dw*0.7,st.car===i?"#f4c542":"#b9a8ff",st.car===i?0.5:0.25);
          ctx.save(); ctx.beginPath(); ctx.rect(x,y,dw,h); ctx.clip();
          if(st.car===i){ ctx.fillStyle="rgba(244,197,66,.35)"; ctx.beginPath(); ctx.ellipse(x+dw/2,y+h-8,dw*0.46,7,0,0,6.2832); ctx.fill(); car(ctx,x+dw/2,y+h-8,dw*0.92,t); }
          else goat(ctx,x+dw/2-dw*0.08,y+h-6,dw*0.8,t);
          ctx.restore(); }
        /* vantail qui pivote vers nous (charnière à gauche) */
        var phi=o*1.45, pw=dw*Math.cos(phi), ex=dw*Math.sin(phi)*0.13;
        if(pw>0.5){ ctx.fillStyle=lin(ctx,x,0,x+pw,0,[[0,COL[i][0]],[1,COL[i][1]]]); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+pw,y-ex); ctx.lineTo(x+pw,y+h+ex); ctx.lineTo(x,y+h); ctx.closePath(); ctx.fill();
          ctx.strokeStyle="rgba(255,255,255,.18)"; ctx.lineWidth=1.5; [[0.07,0.4],[0.53,0.4]].forEach(function(pn){ ctx.beginPath(); ctx.moveTo(x+pw*0.12,y+h*pn[0]-ex*0.12); ctx.lineTo(x+pw*0.88,y+h*pn[0]-ex*0.88); ctx.lineTo(x+pw*0.88,y+h*(pn[0]+pn[1])+ex*0.6); ctx.lineTo(x+pw*0.12,y+h*(pn[0]+pn[1])+ex*0.1); ctx.closePath(); ctx.stroke(); });
          if(pw>dw*0.35){ ctx.save(); ctx.translate(x+pw/2,y+h*0.27); ctx.scale(Math.max(0.2,pw/dw),1); S.draw.text(c,String(i+1),0,0,{size:Math.round(dw*0.36),color:"#ffffff",weight:800}); ctx.restore(); }
          ctx.fillStyle="#f4c542"; ctx.beginPath(); ctx.arc(x+pw*0.84,y+h*0.53,Math.max(2.5,dw*0.035),0,6.2832); ctx.fill(); }
        /* reflet au sol */
        ctx.fillStyle="rgba(255,255,255,.05)"; ctx.fillRect(x,floorY+4,dw,12);
        /* repère « ton choix » */
        if(st.pick===i&&st.phase<2||st.final===i&&st.phase===2){ var bob=Math.sin(t*5)*3; ctx.fillStyle=P.amber; ctx.beginPath(); ctx.moveTo(x+dw/2,y-12+bob); ctx.lineTo(x+dw/2-9,y-24+bob); ctx.lineTo(x+dw/2+9,y-24+bob); ctx.closePath(); ctx.fill(); }
        var tag=""; if(st.phase===2&&st.final===i) tag=st.last&&st.last.win?"gagné !":"choix final"; else if(st.pick===i&&st.phase>0) tag="ton choix"; else if(st.open===i&&st.phase===1) tag=small?"ouverte":"ouverte par l'animateur";
        if(tag) S.draw.label(c,tag,x+dw/2,floorY+16,{size:fs,color:st.phase===2&&st.final===i&&st.last&&st.last.win?P.green:P.amber,fill:"rgba(255,255,255,.92)"}); }
      /* présentateur */
      if(!small){ var target=st.open>=0&&geo[st.open]?[geo[st.open].x+geo[st.open].w/2,geo[st.open].y+geo[st.open].h*0.5]:null; host(ctx,hostW*0.55,floorY+6,Math.min(dh*0.78,150),target,t); }
      /* confettis */
      confetti.forEach(function(p){ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.globalAlpha=Math.min(1,p.life); ctx.fillStyle=p.c; ctx.fillRect(-3,-1.5,6,3); ctx.restore(); });
      /* tableau des scores */
      var by=H-boardH-4, bx=8, bw=W-16;
      ctx.fillStyle="#0b0820"; rr(bx,by,bw,boardH,10); ctx.fill(); ctx.strokeStyle="#f4c542"; ctx.lineWidth=1.5; ctx.stroke();
      S.draw.text(c,"SCORE EN DIRECT",bx+12,by+13,{size:small?10:11,align:"left",color:"#f4c542",weight:800}); S.draw.text(c,"fréquence de victoire",bx+bw-12,by+13,{size:small?9.5:10.5,align:"right",color:"#9fb0c8",weight:700});
      var lx=bx+(small?70:86), rx=bx+bw-(small?66:92), bh=small?22:24;
      [["GARDER",rec.kp,"#9fb0c8",1/3,flash.kp],["CHANGER",rec.sw,"#3fbf8a",2/3,flash.sw]].forEach(function(r,j){ var yy=by+30+j*(bh+12), fr=r[1][1]?r[1][0]/r[1][1]:0;
        S.draw.text(c,r[0],lx-8,yy+bh/2,{size:small?10.5:12,align:"right",color:r[2],weight:800});
        ctx.fillStyle="#1d1840"; rr(lx,yy,rx-lx,bh,5); ctx.fill();
        if(fr>0){ ctx.fillStyle=lin(ctx,0,yy,0,yy+bh,[[0,r[2]],[1,S.draw.tint(r[2],0.65)]]); rr(lx,yy,Math.max(6,(rx-lx)*fr),bh,5); ctx.fill(); }
        if(r[4]>0){ ctx.fillStyle="rgba(255,255,255,"+(r[4]*0.35)+")"; rr(lx,yy,rx-lx,bh,5); ctx.fill(); }
        var mx=lx+(rx-lx)*r[3]; S.draw.line(c,mx,yy-4,mx,yy+bh+4,"#ff6b5a",2); S.draw.text(c,j?"2/3":"1/3",mx,yy-8+(j?bh+20:0)*0,{size:9,color:"#ff9a8c",weight:800});
        S.draw.text(c,r[1][1]?pct(S,fr,0):"—",rx+8,yy+bh/2-(small?0:5),{size:small?14:16,align:"left",color:"#ffffff",weight:800,mono:true});
        if(!small) S.draw.text(c,r[1][1]?r[1][0]+" / "+r[1][1]:"",rx+8,yy+bh/2+9,{size:9.5,align:"left",color:"#9fb0c8",weight:700}); });
      ro.set(0,String(rec.kp[1])); ro.set(1,rec.kp[1]?rec.kp[0]+" ("+pct(S,rec.kp[0]/rec.kp[1],0)+")":"—"); ro.set(2,String(rec.sw[1])); ro.set(3,rec.sw[1]?rec.sw[0]+" ("+pct(S,rec.sw[0]/rec.sw[1],0)+")":"—");
      if(simQ>0) nt.set("Simulation en cours : encore "+simQ+" parties…","ok");
      else if(st.phase===0) nt.set(auto.on?"Parties automatiques : le joueur choisit une porte au hasard…":"Étape 1 : clique sur la porte que tu choisis.","ok");
      else if(st.phase===1) nt.set("L'animateur a ouvert la porte "+(st.open+1)+" (chèvre). "+(auto.on?"Cette fois, le joueur va "+(auto.strat?"changer":"garder")+".":"Garder ou changer ? Clique sur ta porte pour la garder, sur l'autre porte fermée pour changer."),"ok");
      else nt.set((st.last&&st.last.sw?"Il a changé. ":"Il a gardé. ")+(st.final===st.car?"Gagné ! La voiture était derrière la porte "+(st.car+1)+".":"Perdu : la voiture était derrière la porte "+(st.car+1)+"."),"ok");
    });
    c.pointer(function(type,p){ if(!geo) return; var hit=-1; geo.forEach(function(g,i){ if(p.x>=g.x&&p.x<=g.x+g.w&&p.y>=g.y&&p.y<=g.y+g.h) hit=i; });
      if(type==="move"){ c.cv.style.cursor=hit>=0&&st.phase<2&&hit!==st.open?"pointer":"default"; return; }
      if(type==="down"&&hit>=0){ stopAuto(); if(st.phase===0) choose(hit); else if(st.phase===1&&hit!==st.open){ decide(hit!==st.pick); } k.redraw(); } });
  }
});
