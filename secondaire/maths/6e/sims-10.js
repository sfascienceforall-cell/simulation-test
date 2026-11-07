/* Chapitre 10 : variables aléatoires, loi binomiale, loi normale, TCL */
var LF=[0]; function lf(n){ while(LF.length<=n) LF.push(LF[LF.length-1]+Math.log(LF.length)); return LF[n]; }
function pmf(n,k,p){ if(k<0||k>n) return 0; if(p<=0) return k===0?1:0; if(p>=1) return k===n?1:0; return Math.exp(lf(n)-lf(k)-lf(n-k)+k*Math.log(p)+(n-k)*Math.log(1-p)); }
function cdfB(n,k,p){ var s=0; for(var i=0;i<=Math.min(k,n);i++) s+=pmf(n,i,p); return Math.min(1,s); }
function poisson(l,k){ return Math.exp(-l+k*Math.log(l)-lf(k)); }
function erf(x){ var s=x<0?-1:1, a=Math.abs(x); if(a>6) return s;
  if(a<=3){ var t=a, sum=a, n=0; for(n=1;n<80;n++){ t*=-a*a/n; sum+=t/(2*n+1); } return s*2/Math.sqrt(Math.PI)*sum; }
  var e=Math.exp(-a*a)/(a*Math.sqrt(Math.PI)), ser=1-1/(2*a*a)+3/(4*a*a*a*a)-15/(8*Math.pow(a,6)); return s*(1-e*ser); }
function Phi(z){ return 0.5*(1+erf(z/Math.SQRT2)); }
function phi(z){ return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI); }
SFA.Phi=Phi;
function pc(S,x,d){ return S.fmt(x*100,d===undefined?2:d)+" %"; }

SFA.sim({
  id:"m6-c10-binomiale", ch:"c10", tag:"Classique",
  titre:"La loi binomiale B(n ; p) en bâtons",
  resume:"Fais varier n et p : le diagramme, l'espérance np et l'écart-type √(npq) suivent.",
  but:"Règle n (nombre d'essais) et p (probabilité de succès). Clique sur un bâton (ou règle k) pour lire P(X = k) et P(X ≤ k). Active la comparaison avec la loi de Poisson quand p est petit.",
  aRetenir:"X = nombre de succès en n essais indépendants de probabilité p : P(X = k) = C(n ; k)·p<sup>k</sup>·(1−p)<sup>n−k</sup>. L'espérance (valeur moyenne à long terme) vaut E(X) = np et l'écart-type σ = √(np(1−p)). Pour n grand et p petit, B(n ; p) ressemble à la loi de Poisson de paramètre λ = np.",
  piege:"L'espérance n'est pas la valeur « certaine » : avec n = 10 et p = 0,5, E(X) = 5 mais P(X = 5) n'est que 24,6 %. Et P(X ≥ k) = 1 − P(X ≤ k − 1), pas 1 − P(X ≤ k).",
  build:function(k,S){
    var c=M6.canvas(k,.7,340), P=S.draw.palette;
    var n=k.slider("Nombre d'essais n",1,60,1,10,"",null), p=k.slider("Probabilité de succès p",0.01,0.99,0.01,0.5,"",null), kk=k.slider("Valeur k",0,60,1,5,"",null);
    var po=k.toggle("Comparer avec la loi de Poisson (λ = np)",false);
    var ro=k.readouts(["Espérance E(X) = np","Écart-type","Probabilité P(X = k)","Cumul P(X ≤ k) ; P(X ≥ k)"]);
    var nt=k.note("","ok"), geo=null;
    k.draw(function(){
      c.clear(); var ctx=c.ctx, N=n.value, pp=p.value, K=Math.min(kk.value,N), mu=N*pp, sg=Math.sqrt(N*pp*(1-pp)), fs=M6.fs(c,12);
      var vals=[],mx=0; for(var i=0;i<=N;i++){ vals.push(pmf(N,i,pp)); if(vals[i]>mx) mx=vals[i]; }
      if(po.value){ for(i=0;i<=N;i++) mx=Math.max(mx,poisson(Math.max(mu,1e-9),i)); }
      mx*=1.18; var W=c.W,H=c.H,L=50,R=14,T=16,B=36, bw=(W-L-R)/(N+1);
      var Y=function(y){return H-B-y/mx*(H-T-B);};
      ctx.save(); ctx.font="600 "+(fs-1)+"px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="right"; ctx.textBaseline="middle";
      for(var j=0;j<=4;j++){ var v=mx*j/4; ctx.beginPath(); ctx.moveTo(L,Y(v)); ctx.lineTo(W-R,Y(v)); ctx.stroke(); ctx.fillText(S.fmt(v,2),L-6,Y(v)); }
      ctx.restore();
      ctx.save(); ctx.fillStyle=S.draw.tint(P.green,0.11); var xa=L+(mu-sg+0.5)*bw, xb=L+(mu+sg+0.5)*bw; ctx.fillRect(Math.max(L,xa),T,Math.min(W-R,xb)-Math.max(L,xa),H-T-B); ctx.restore();
      var step=N>40?5:(N>20?2:1);
      for(i=0;i<=N;i++){ var x=L+i*bw, h=(H-T-B)*vals[i]/mx; ctx.fillStyle=(i===K)?P.red:(i<K?"#7f9bd8":"#b9c8ea"); ctx.fillRect(x+1,H-B-h,Math.max(1,bw-2),h); if(i%step===0) S.draw.text(c,String(i),x+bw/2,H-B+14,{size:fs}); }
      if(po.value){ for(i=0;i<=N;i++) S.draw.dot(c,L+i*bw+bw/2,Y(poisson(Math.max(mu,1e-9),i)),Math.max(3,Math.min(5,bw/3)),P.amber); S.draw.label(c,"points : Poisson(λ = "+S.fmt(mu,2)+")",W-R-4,T+12,{size:fs,align:"right",color:P.amber}); }
      S.draw.line(c,L+(mu+0.5)*bw,T,L+(mu+0.5)*bw,H-B,P.green,2,[5,4]); S.draw.label(c,"E(X) = "+S.fmt(mu,1),L+(mu+0.5)*bw+6,T+10,{size:fs,align:"left",color:P.green});
      S.draw.line(c,L,H-B,W-R,H-B,"#8a95a3",1.2);
      S.draw.label(c,"P(X = "+K+") = "+pc(S,vals[K],1),L+(K+0.5)*bw,Y(vals[K])-14,{size:fs,color:P.red,align:K>N*0.7?"right":(K<N*0.3?"left":"center")});
      geo={L:L,bw:bw,N:N};
      var cum=cdfB(N,K,pp), ge=1-(K>0?cdfB(N,K-1,pp):0);
      ro.set(0,S.fmt(mu,2)); ro.set(1,S.fmt(sg,3)); ro.set(2,pc(S,vals[K],2)); ro.set(3,pc(S,cum,1)+" ; "+pc(S,ge,1));
      if(po.value) nt.set(pp<=0.1&&N>=20?"p est petit et n grand : Poisson(np) est une bonne approximation de B(n ; p) (barres et points presque confondus).":"Ici p n'est pas petit ou n est trop petit : la loi de Poisson s'écarte nettement de la binomiale.", pp<=0.1&&N>=20?"ok":"warn");
      else nt.set("Bande verte : E(X) ± σ. Barres foncées : k de 0 à "+K+" (P(X ≤ k)).","ok");
    });
    c.pointer(function(type,p2){ if(!geo) return; if(type==="move"){ c.cv.style.cursor="pointer"; return; } if(type==="down"||type==="drag"){ kk.set(M6.clamp(Math.floor((p2.x-geo.L)/geo.bw),0,geo.N)); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c10-normale", ch:"c10", tag:"Classique",
  titre:"La loi normale : cloche, μ, σ et aires",
  resume:"Fais varier μ et σ, choisis un intervalle : l'aire colorée est la probabilité.",
  but:"Règle la moyenne μ et l'écart-type σ. Tire les poignées de la cloche (le sommet pour μ, les deux bornes pour a et b) ou choisis un bouton μ ± σ, 2σ, 3σ : l'aire sous la cloche entre a et b est P(a ≤ X ≤ b).",
  aRetenir:"Pour X de loi N(μ ; σ), la courbe est une cloche symétrique centrée en μ ; σ mesure l'étalement. Règle 68-95-99,7 : P(|X − μ| ≤ σ) ≈ 68,3 % ; ≤ 2σ ≈ 95,4 % ; ≤ 3σ ≈ 99,7 %. On centre-réduit : Z = (X − μ)/σ suit N(0 ; 1), ce qui ramène tout calcul à la table (ou à la calculatrice).",
  piege:"La hauteur de la courbe n'est pas une probabilité : c'est la densité. La probabilité d'une valeur précise est nulle ; seule l'aire sur un intervalle compte. Et si σ double, la cloche s'aplatit mais l'aire totale reste 1.",
  build:function(k,S){
    var c=M6.canvas(k,.72,340), P=S.draw.palette;
    var mu=k.slider("Moyenne μ",-5,5,0.5,0,"",null), sg=k.slider("Écart-type σ",0.5,4,0.1,1.5,"",null);
    var a=k.slider("Borne a",-12,12,0.1,-1.5,"",null), b=k.slider("Borne b",-12,12,0.1,1.5,"",null);
    var seg=k.seg("Raccourci",[[1,"μ ± σ"],[2,"μ ± 2σ"],[3,"μ ± 3σ"]],1,function(m){ a.set(Math.round((mu.value-m*sg.value)*10)/10); b.set(Math.round((mu.value+m*sg.value)*10)/10); });
    var fix=k.toggle("Garder la même échelle verticale",false);
    var ro=k.readouts(["P(a ≤ X ≤ b)","z de a","z de b","Densité en μ"]);
    var nt=k.note("","ok"), ax=null;
    function span(){ return {A:Math.min(a.value,b.value),B:Math.max(a.value,b.value)}; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, M=mu.value, s=sg.value, sp=span(), A=sp.A, Bv=sp.B, fs=M6.fs(c,12);
      var f=function(x){return phi((x-M)/s)/s;}, peak=f(M), top=fix.value?0.85:Math.max(0.12,peak*1.75);
      ax=S.draw.axes(c,{x0:-12,x1:12,y0:0,y1:top,xl:"x",yl:"densité",stepX:2});
      S.draw.area(c,ax,f,A,Bv,P.mat,0.28);
      if(!fix.value||true){ S.draw.fn(c,ax,function(x){return phi(x);},"#c5ccd8",1.6,[4,4]); }
      S.draw.fn(c,ax,f,P.mat,3.2);
      /* repères σ */
      [-1,1].forEach(function(q){ var xx=M+q*s; S.draw.line(c,ax.X(xx),ax.Y(0),ax.X(xx),ax.Y(f(xx)),P.grey,1,[3,3]); });
      S.draw.line(c,ax.X(M),ax.Y(0),ax.X(M),ax.Y(peak),P.green,1.8,[5,4]);
      S.draw.line(c,ax.X(A),ax.Y(0),ax.X(A),ax.Y(f(A)),P.red,1.8); S.draw.line(c,ax.X(Bv),ax.Y(0),ax.X(Bv),ax.Y(f(Bv)),P.red,1.8);
      M6.handle(S,c,ax.X(M),ax.Y(peak),P.green,false,7); M6.handle(S,c,ax.X(a.value),ax.Y(0),P.red,false,7); M6.handle(S,c,ax.X(b.value),ax.Y(0),P.red,false,7);
      var pr=Phi((Bv-M)/s)-Phi((A-M)/s);
      var mxp=M6.clamp((A+Bv)/2,-11,11); S.draw.label(c,S.fmt(pr*100,1)+" %",ax.X(mxp),ax.Y(Math.min(f(mxp)*0.45,top*0.4)),{size:M6.fs(c,14),color:P.mat});
      S.draw.legend(c,[[P.mat,"N("+S.fmt(M,1)+" ; "+S.fmt(s,1)+")"],["#c5ccd8","N(0 ; 1) de référence",true]],ax.R-8,ax.T+4,{align:"right"});
      ro.set(0,pc(S,pr,2)); ro.set(1,S.fmt((A-M)/s,2)); ro.set(2,S.fmt((Bv-M)/s,2)); ro.set(3,S.fmt(f(M),3));
      nt.set("P("+S.fmt(A,1)+" ≤ X ≤ "+S.fmt(Bv,1)+") = Φ("+S.fmt((Bv-M)/s,2)+") − Φ("+S.fmt((A-M)/s,2)+") = "+S.fmt(Phi((Bv-M)/s),4)+" − "+S.fmt(Phi((A-M)/s),4)+" = "+S.fmt(pr,4)+".","ok");
    });
    M6.drag(c,function(){ if(!ax) return []; var M=mu.value,s=sg.value; return [{x:ax.X(M),y:ax.Y(phi(0)/s)},{x:ax.X(a.value),y:ax.Y(0)},{x:ax.X(b.value),y:ax.Y(0)}]; },function(i,pt){ var x=ax.ix(pt.x);
      if(i===0){ var d=mu.value; mu.set(M6.clamp(Math.round(x*2)/2,-5,5)); a.set(M6.clamp(Math.round((a.value+mu.value-d)*10)/10,-12,12)); b.set(M6.clamp(Math.round((b.value+mu.value-d)*10)/10,-12,12)); }
      else if(i===1) a.set(M6.clamp(Math.round(x*10)/10,-12,12)); else b.set(M6.clamp(Math.round(x*10)/10,-12,12)); k.redraw(); },{r:26});
  }
});

SFA.sim({
  id:"m6-c10-binom-normale", ch:"c10", tag:"Approximation",
  titre:"De la binomiale à la cloche, avec correction de continuité",
  resume:"Augmente n : les bâtons épousent la courbe normale ; compare le calcul exact et les approximations.",
  but:"Règle n et p, puis k (curseur, ou clic sur le graphique). Le tableau compare P(X ≤ k) exact, l'approximation normale sans correction et avec correction de continuité (on utilise k + 0,5).",
  aRetenir:"Si np ≥ 5 et n(1−p) ≥ 5, B(n ; p) est bien approchée par N(np ; √(np(1−p))). Comme X est entier et la loi normale continue, on corrige : P(X ≤ k) ≈ Φ((k + 0,5 − np)/σ). Le « +0,5 » représente la demi-largeur du bâton en k.",
  piege:"Hors des conditions (np ou n(1−p) petit), la cloche est trompeuse : la loi binomiale est alors asymétrique. Et oublier la correction de continuité fait perdre une précision qui compte pour n modéré.",
  build:function(k,S){
    var c=M6.canvas(k,.7,340), P=S.draw.palette;
    var n=k.slider("Nombre d'essais n",5,200,1,30,"",null), p=k.slider("Probabilité p",0.05,0.95,0.05,0.4,"",null), kk=k.slider("Valeur k",0,200,1,12,"",null);
    var ro=k.readouts(["P(X ≤ k) exact","Normale sans correction","Normale avec correction","Conditions d'approximation"]);
    var nt=k.note("","ok"), geo=null;
    k.draw(function(){
      c.clear(); var ctx=c.ctx, N=n.value, pp=p.value, mu=N*pp, sg=Math.sqrt(N*pp*(1-pp)), K=Math.min(kk.value,N), fs=M6.fs(c,12);
      var lo=Math.max(0,Math.floor(mu-4.2*sg)), hi=Math.min(N,Math.ceil(mu+4.2*sg)); if(hi-lo<6){ lo=Math.max(0,lo-2); hi=Math.min(N,hi+2); }
      var ymax=0; for(var i=lo;i<=hi;i++) ymax=Math.max(ymax,pmf(N,i,pp)); ymax=Math.max(ymax,phi(0)/sg)*1.18;
      var W=c.W,H=c.H,L=52,R=14,T=16,B=36, cnt=hi-lo+1, bw=(W-L-R)/cnt;
      var X=function(v){return L+(v-lo+0.5)*bw;}, Y=function(y){return H-B-y/ymax*(H-T-B);};
      ctx.save(); ctx.font="600 "+(fs-1)+"px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="right"; ctx.textBaseline="middle";
      for(var j=0;j<=4;j++){ var v=ymax*j/4; ctx.beginPath(); ctx.moveTo(L,Y(v)); ctx.lineTo(W-R,Y(v)); ctx.stroke(); ctx.fillText(S.fmt(v,3),L-6,Y(v)); } ctx.restore();
      var st=cnt>30?5:(cnt>15?2:1);
      for(i=lo;i<=hi;i++){ var h=(H-T-B)*pmf(N,i,pp)/ymax; ctx.fillStyle=(i<=K)?"#7f9bd8":"#c9d5ef"; ctx.fillRect(X(i)-bw/2+1,H-B-h,Math.max(1,bw-2),h); if(i%st===0) S.draw.text(c,String(i),X(i),H-B+14,{size:fs}); }
      ctx.save(); ctx.beginPath(); ctx.rect(L,T,W-L-R,H-T-B); ctx.clip(); ctx.strokeStyle=P.red; ctx.lineWidth=2.8; ctx.beginPath();
      for(var q=0;q<=240;q++){ var x=lo-0.5+(cnt)*q/240, y=phi((x-mu)/sg)/sg; if(q===0) ctx.moveTo(L+(x-lo+0.5)*bw,Y(y)); else ctx.lineTo(L+(x-lo+0.5)*bw,Y(y)); } ctx.stroke(); ctx.restore();
      var xk=L+(K+0.5-lo+0.5)*bw, inWin=(K>=lo-1&&K<=hi); if(inWin){ S.draw.line(c,xk,T,xk,H-B,P.violet,1.8,[5,4]); S.draw.label(c,"k + 0,5",xk+6,T+10,{size:fs,align:"left",color:P.violet}); }
      S.draw.legend(c,[["#7f9bd8","bâtons B("+N+" ; "+S.fmt(pp,2)+")"],[P.red,"cloche N(np ; σ)"]],W-R-4,T+26,{align:"right"});
      S.draw.line(c,L,H-B,W-R,H-B,"#8a95a3",1.2);
      geo={X:X,lo:lo,hi:hi,L:L,bw:bw};
      var ex=cdfB(N,K,pp), a1=Phi((K-mu)/sg), a2=Phi((K+0.5-mu)/sg), okc=(mu>=5&&N*(1-pp)>=5);
      ro.set(0,S.fmt(ex,4)); ro.set(1,S.fmt(a1,4)+" (écart "+S.fmt(a1-ex,4)+")"); ro.set(2,S.fmt(a2,4)+" (écart "+S.fmt(a2-ex,4)+")"); ro.set(3,"np = "+S.fmt(mu,1)+" ; nq = "+S.fmt(N*(1-pp),1)+(okc?" ✓":" ✗"));
      nt.set((inWin?"":"<b>k est hors de la fenêtre dessinée</b> (loin de la moyenne) : P(X ≤ k) vaut presque 0 ou presque 1. ")+(okc?"Conditions remplies : l'approximation avec correction est en général la plus proche de la valeur exacte.":"np ou n(1−p) est inférieur à 5 : la cloche approche mal la binomiale (asymétrique). N'utilise pas cette approximation."), okc?"ok":"warn");
    });
    c.pointer(function(type,p2){ if(!geo) return; if(type==="move"){ c.cv.style.cursor="pointer"; return; } if(type==="down"||type==="drag"){ kk.set(M6.clamp(Math.round(geo.lo+(p2.x-geo.L)/geo.bw-0.5),0,n.value)); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c10-tcl", ch:"c10", tag:"Théorème central limite",
  titre:"La moyenne de beaucoup de tirages devient normale",
  resume:"Quelle que soit la loi de départ, la distribution des moyennes d'échantillons devient une cloche.",
  but:"Choisis une loi de départ et la taille m des échantillons. Chaque échantillon est la moyenne de m tirages : elle tombe dans l'histogramme, comparé à la cloche N(μ ; σ/√m). Lance l'animation et augmente m : la cloche apparaît.",
  aRetenir:"Si on moyenne m tirages indépendants d'une même loi (moyenne μ, écart-type σ), la moyenne a pour espérance μ et pour écart-type σ/√m ; et pour m grand sa distribution est proche d'une loi normale, quelle que soit la loi de départ (théorème central limite, admis). Il faut quadrupler m pour diviser l'écart-type de la moyenne par 2.",
  piege:"Le théorème porte sur la distribution des <i>moyennes</i>, pas sur les données individuelles : les tirages eux-mêmes restent asymétriques. Et pour une loi très asymétrique il faut un m plus grand pour que la cloche apparaisse.",
  build:function(k,S){
    var c=M6.canvas(k,.85,370), P=S.draw.palette;
    var D={
      d:{n:"Dé équilibré (1 à 6)",v:[[1,1/6],[2,1/6],[3,1/6],[4,1/6],[5,1/6],[6,1/6]]},
      a:{n:"Loi très asymétrique",v:[[0,0.5],[1,0.3],[2,0.12],[5,0.06],[12,0.02]]},
      b:{n:"Pile ou face très biaisé (1 avec p = 0,1)",v:[[0,0.9],[1,0.1]]}
    };
    var means=[], lastS=[], lastM=null, run=false, rng=M6.rng(5);
    function reset(){ means=[]; lastS=[]; lastM=null; sim(300); }
    var sel=k.select("Loi de départ",[["d","Dé équilibré (1 à 6)"],["a","Loi très asymétrique"],["b","Pile ou face biaisé : 1 avec p = 0,1"]],"d",function(){ reset(); });
    var m=k.slider("Taille m de l'échantillon",1,100,1,12,"",function(){ reset(); });
    function draw1(d){ var u=Math.random(),s=0; for(var i=0;i<d.v.length;i++){ s+=d.v[i][1]; if(u<s) return d.v[i][0]; } return d.v[d.v.length-1][0]; }
    function sim(N){ var d=D[sel.value], mm=m.value; for(var i=0;i<N;i++){ var s=0, arr=[]; for(var j=0;j<mm;j++){ var x=draw1(d); s+=x; if(j<30) arr.push(x); } means.push(s/mm); lastS=arr; lastM=s/mm; } }
    var lp=k.loop(function(dt){ sim(Math.max(1,Math.round(dt*90))); k.redraw(); if(!run||means.length>=20000) lp.pause(); });
    k.button("+ 100 échantillons",function(){ sim(100); },true); k.button("+ 2 000 échantillons",function(){ sim(2000); });
    k.button("Lancer / arrêter l'animation",function(){ run=!run; if(run) lp.play(); });
    k.button("Remise à zéro",function(){ means=[]; lastS=[]; lastM=null; });
    var ro=k.readouts(["Échantillons","Moyenne des moyennes","Écart-type observé","Écart-type théorique"]);
    var nt=k.note("Lance des échantillons pour voir l'histogramme.","ok");
    sim(300);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, d=D[sel.value], mm=m.value, W=c.W, H=c.H, fs=M6.fs(c,12);
      var mu=0; d.v.forEach(function(q){mu+=q[0]*q[1];}); var va=0; d.v.forEach(function(q){va+=q[1]*Math.pow(q[0]-mu,2);}); var sg=Math.sqrt(va), sm=sg/Math.sqrt(mm);
      var lo=mu-4.2*sm, hi=mu+4.2*sm, vmin=d.v[0][0], vmax=d.v[d.v.length-1][0]; lo=Math.max(vmin-0.3,lo); hi=Math.min(vmax+0.3,hi); if(mm===1){ lo=vmin-0.5; hi=vmax+0.5; }
      var nb, bw;
      if(mm===1){ nb=vmax-vmin+1; bw=(hi-lo)/nb; }
      else { var kq=Math.max(1,Math.round((hi-lo)*mm/40)); bw=kq/mm; lo=Math.floor(lo*mm)/mm-0.5/mm; nb=Math.ceil((hi-lo)/bw); hi=lo+nb*bw; }
      var cnt=new Array(nb).fill(0);
      means.forEach(function(x){ var i=Math.floor((x-lo)/bw); if(i>=0&&i<nb) cnt[i]++; });
      var tot=means.length, dens=cnt.map(function(q){return tot?q/(tot*bw):0;}), top=Math.max.apply(null,dens.concat([phi(0)/sm]))*1.15;
      var ih=Math.round(H*0.24), sub={W:W,H:H-ih-6,ctx:ctx,clear:c.clear};
      ctx.save(); ctx.translate(0,ih+6);
      var ax=S.draw.axes(sub,{x0:lo,x1:hi,y0:0,y1:top,xl:"moyenne des "+mm+" tirages",yl:"densité"});
      for(var i2=0;i2<nb;i2++){ ctx.fillStyle=S.draw.tint(P.mat,0.42); ctx.fillRect(ax.X(lo+i2*bw)+0.5,ax.Y(dens[i2]),Math.max(1,ax.X(lo+(i2+1)*bw)-ax.X(lo+i2*bw)-1),ax.Y(0)-ax.Y(dens[i2])); }
      S.draw.fn(sub,ax,function(x){return phi((x-mu)/sm)/sm;},P.red,2.8);
      if(lastM!==null){ var lx=ax.X(M6.clamp(lastM,lo,hi)); ctx.fillStyle=P.amber; ctx.beginPath(); ctx.moveTo(lx,ax.B-2); ctx.lineTo(lx-7,ax.B+9); ctx.lineTo(lx+7,ax.B+9); ctx.closePath(); ctx.fill(); }
      S.draw.legend(sub,[[P.mat,"moyennes obtenues"],[P.red,"cloche N(μ ; σ/√m)"]],ax.R-6,ax.T+2,{align:"right"});
      ctx.restore();
      /* loi de départ et dernier échantillon */
      S.draw.panel(c,6,4,W-12,ih,{shadow:false});
      var pw=Math.min(230,W*0.45), px=16, pb=ih-18, ph=ih-34, pmax=Math.max.apply(null,d.v.map(function(q){return q[1];}));
      var vals=d.v, xr=function(v){ return px+(v-(vmin-0.6))/((vmax+0.6)-(vmin-0.6))*pw; };
      S.draw.text(c,"loi de départ",px,14,{size:11,align:"left",color:P.grey,weight:800});
      vals.forEach(function(q){ var h=ph*q[1]/pmax; ctx.fillStyle="#9fb4e3"; ctx.fillRect(xr(q[0])-4,pb-h+4,8,h); S.draw.text(c,String(q[0]),xr(q[0]),pb+11,{size:10,color:P.grey}); });
      var sx=px+pw+22; S.draw.text(c,"dernier échantillon (m = "+mm+")",sx,14,{size:11,align:"left",color:P.grey,weight:800});
      var show=lastS.slice(0,Math.floor((W-sx-10)/11)), rr=Math.max(3,Math.min(5,(W-sx-12)/Math.max(14,show.length)/2.2));
      show.forEach(function(v,i){ var xx=sx+8+i*rr*2.2, yy=pb-((v-vmin)/Math.max(1e-9,(vmax-vmin)))*(ph-6); S.draw.dot(c,xx,yy,rr,P.mat); });
      if(lastM!==null) S.draw.label(c,"moyenne = "+S.fmt(lastM,2),W-14,ih-4,{size:11.5,align:"right",color:P.amber});
      var mo=0; means.forEach(function(x){mo+=x;}); mo=tot?mo/tot:0; var so=0; means.forEach(function(x){so+=(x-mo)*(x-mo);}); so=tot>1?Math.sqrt(so/(tot-1)):0;
      ro.set(0,String(tot)); ro.set(1,tot?S.fmt(mo,3)+" (μ = "+S.fmt(mu,3)+")":"—"); ro.set(2,tot>1?S.fmt(so,3):"—"); ro.set(3,S.fmt(sm,3));
      nt.set(mm===1?"m = 1 : l'histogramme reproduit la loi de départ (ici "+d.n.toLowerCase()+"), qui n'est pas une cloche.":(mm<10?"m est encore petit : la cloche est approximative, surtout si la loi de départ est asymétrique.":"m = "+mm+" : la distribution des moyennes est déjà proche de la cloche N("+S.fmt(mu,2)+" ; "+S.fmt(sm,2)+")."),"ok");
    });
  }
});
