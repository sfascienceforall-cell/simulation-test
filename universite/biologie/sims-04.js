/* Biologie BA1 · chapitre 4 : communication cellulaire, excitabilité et homéostasie */

SFA.sim({
  id:"ub-c04-potentiel-action", ch:"c04", tag:"Excitabilité · classique",
  titre:"Potentiel d'action : seuil, tout ou rien et période réfractaire",
  resume:"Modèle de Hodgkin-Huxley : un stimulus sous le seuil ne donne rien ; au-dessus, un pic de même taille.",
  but:"Glisse sur la courbe pour suivre un instant : les canaux Na⁺ et K⁺ s'ouvrent ou se ferment sous tes yeux. Fais varier l'intensité du stimulus, active un second stimulus à intervalle réglable et bloque les canaux Na⁺ (TTX) ou K⁺ (TEA).",
  aRetenir:"Seuil : en dessous, la dépolarisation s'éteint ; au-dessus, un potentiel d'action d'amplitude fixe (≈ 100 mV) se déclenche : loi du tout ou rien. L'intensité est codée par la fréquence, pas par l'amplitude. Phase ascendante : ouverture des canaux Na⁺ voltage-dépendants ; repolarisation : inactivation de Na⁺ et ouverture de K⁺ ; période réfractaire : canaux Na⁺ inactivés. TTX bloque Na⁺ (pas de pic) ; TEA bloque K⁺ (repolarisation retardée).",
  piege:"Un stimulus plus fort ne donne pas un potentiel d'action plus grand, mais éventuellement plus fréquent. Pendant la période réfractaire absolue, aucun stimulus (même très fort) ne déclenche un second potentiel d'action.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(470);
    var I1=k.slider("Intensité du stimulus",0,40,0.5,10,"µA/cm²");
    var du=k.slider("Durée du stimulus",0.2,5,0.1,1,"ms");
    var tw=k.toggle("Second stimulus identique",false);
    var dl=k.slider("Délai du second stimulus",3,24,0.5,6,"ms");
    var dr=k.seg("Toxine",[["none","Aucune"],["ttx","TTX (bloque Na⁺)"],["tea","TEA (bloque K⁺)"]],"none");
    var B=S.bio, tcur=0, auto=true, cache=null, ckey='';
    var ro=k.readouts(["Potentiel maximal","Nombre de potentiels d'action","Verdict"]);
    function run(){
      var gNa=120*(dr.value==="ttx"?0:1), gK=36*(dr.value==="tea"?0:1), gL=0.3, ENa=50, EK=-77, EL=-54.387, dt=0.01, V=-65;
      function an(V){var x=V+55;return Math.abs(x)<1e-6?0.1:0.01*x/(1-Math.exp(-x/10));}
      function bn(V){return 0.125*Math.exp(-(V+65)/80);}
      function am(V){var x=V+40;return Math.abs(x)<1e-6?1:0.1*x/(1-Math.exp(-x/10));}
      function bm(V){return 4*Math.exp(-(V+65)/18);}
      function ah(V){return 0.07*Math.exp(-(V+65)/20);}
      function bh(V){return 1/(1+Math.exp(-(V+35)/10));}
      var n=an(V)/(an(V)+bn(V)), m=am(V)/(am(V)+bm(V)), h=ah(V)/(ah(V)+bh(V)), out=[], om=[], oh=[], on=[], sp=0, up=false, mx=-100;
      for(var i=0;i<=3000;i++){
        var t=i*dt, I=0;
        if(t>=2&&t<2+du.value) I+=I1.value;
        if(tw.value&&t>=2+dl.value&&t<2+dl.value+du.value) I+=I1.value;
        var dV=I-gNa*m*m*m*h*(V-ENa)-gK*n*n*n*n*(V-EK)-gL*(V-EL);
        m+=dt*(am(V)*(1-m)-bm(V)*m); h+=dt*(ah(V)*(1-h)-bh(V)*h); n+=dt*(an(V)*(1-n)-bn(V)*n); V+=dt*dV;
        if(!isFinite(V)) V=-65;
        if(V>mx) mx=V; if(V>0&&!up){sp++;up=true;} if(V<-20) up=false;
        if(i%10===0){ out.push(V); om.push(m); oh.push(h); on.push(n); }
      }
      return {v:out,m:om,h:oh,n:on,sp:sp,mx:mx};
    }
    c.pointer(function(t,p){ if(t==="down"||t==="drag"){ auto=false; var gh=c.H*.58, px=Math.max(0,Math.min(1,(p.x-46)/(c.W-62))); tcur=px*30; k.redraw(); } });
    function frame(dt){
      var ctx=c.ctx, W=c.W, H=c.H, GH=Math.round(H*.58); c.clear(); B.bg(c,"#fbfdff","#f1f5fa");
      var key=[I1.value,du.value,tw.value,dl.value,dr.value].join(); if(key!==ckey){ ckey=key; cache=run(); auto=true; tcur=0; }
      var r=cache; if(auto){ tcur+=dt*5; if(tcur>32) tcur=0; }
      var tc=Math.max(0,Math.min(29.99,tcur)), ix=Math.min(r.v.length-1,Math.round(tc*10));
      var fake={ctx:ctx,W:W,H:GH}, ax=S.draw.axes(fake,{x0:0,x1:30,y0:-80,y1:50,stepX:5,stepY:20,xl:"temps (ms)",yl:"Vm (mV)",t:26});
      ctx.fillStyle="rgba(180,83,9,.18)"; ctx.fillRect(ax.X(2),ax.T,Math.max(2,ax.X(2+du.value)-ax.X(2)),ax.B-ax.T);
      if(tw.value) ctx.fillRect(ax.X(2+dl.value),ax.T,Math.max(2,ax.X(2+dl.value+du.value)-ax.X(2+dl.value)),ax.B-ax.T);
      S.draw.line(c,ax.L,ax.Y(-65),ax.R,ax.Y(-65),"#c8d1de",1,[4,4]); S.draw.text(c,"repos −65",ax.R-4,ax.Y(-65)+10,{size:9.5,color:P.grey,align:"right"});
      S.draw.line(c,ax.L,ax.Y(-55),ax.R,ax.Y(-55),"rgba(192,50,29,.4)",1,[2,4]); S.draw.text(c,"seuil ≈ −55",ax.L+6,ax.Y(-55)-7,{size:9.5,color:P.red,align:"left"});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath();
      r.v.forEach(function(v,i){ var x=ax.X(i*0.1), y=ax.Y(v); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.restore();
      S.draw.line(c,ax.X(tc),ax.T,ax.X(tc),ax.B,P.ink,1.2,[3,3]); S.draw.dot(c,ax.X(tc),ax.Y(r.v[ix]),6,P.red);
      S.draw.label(c,S.fmt(r.v[ix],0)+" mV",Math.min(ax.X(tc)+10,ax.R-40),Math.max(ax.T+10,ax.Y(r.v[ix])-14),{color:P.red,align:"left"});
      S.draw.text(c,"orange : stimulus · glisse pour explorer",ax.R-4,ax.T+8,{size:9.5,color:P.amber,align:"right"});
      /* coupe de membrane : canaux */
      var my=GH+78, m=r.m[ix], h=r.h[ix], nn=r.n[ix];
      var act=Math.pow(m,3), inact=1-h, kopen=Math.pow(nn,4);
      ctx.fillStyle="#fff1d6"; ctx.fillRect(8,GH+14,W-16,my-GH-14-14); ctx.fillStyle="#d8e6fa"; ctx.fillRect(8,my+14,W-16,H-my-22);
      ctx.fillStyle="#f2e3b8"; ctx.fillRect(8,my-14,W-16,28); for(var x=14;x<W-8;x+=12){ B.ball(c,x,my-12,3.6,"#e8b94a"); B.ball(c,x,my+12,3.6,"#e8b94a"); }
      S.draw.text(c,"extérieur (Na⁺ ++)",14,GH+26,{align:"left",size:10,color:"#a2650c"}); S.draw.text(c,"cytoplasme (K⁺ ++)",14,H-16,{align:"left",size:10,color:"#2c5aa0"});
      function channel(cx,col,open,label,ion,dirDown,plug){
        var gap=6+open*18; ctx.fillStyle=col; ctx.fillRect(cx-gap/2-18,my-18,18,36); ctx.fillRect(cx+gap/2,my-18,18,36); ctx.fillStyle="rgba(255,255,255,.0)";
        /* porte d'activation */
        ctx.fillStyle=B.mix(col,-.2); ctx.fillRect(cx-8-0,my-22,0,0);
        S.draw.rrect(c,cx-gap/2,my-3+(open>.15?-17:-3)*(dirDown?1:-1)*0-(open>.15?24:0),gap,6,3); ctx.fillStyle="#2c3a4e"; ctx.fill();
        if(plug!=null){ B.ball(c,cx,my+22-plug*0,0.01,col); var by=my+20-plug*0; ctx.save(); ctx.globalAlpha=Math.min(1,.2+plug); B.ball(c,cx+4,my+19,8,P.violet); ctx.restore(); }
        S.draw.text(c,label,cx,my-30,{size:11,color:col});
        var flux=open*(plug!=null?(1-plug):1); var nf=Math.round(flux*6);
        for(var q=0;q<nf;q++){ var u=((tt0*1.2+q/Math.max(1,nf))%1), y=dirDown?my-40+u*80:my+40-u*80; B.ball(c,cx+(q%2?4:-4),y,5.5,ion==="Na"?P.acc:P.amber,{text:ion==="Na"?"Na⁺":"K⁺",size:6.5}); }
      }
      var tt0=tc;
      channel(W*.3,P.acc,act,"canal Na⁺",  "Na",true,inact);
      channel(W*.7,P.amber,kopen,"canal K⁺","K",false,null);
      /* jauges */
      var gx=W*.5, gy=GH+34; [["m³ (activation Na⁺)",act,P.acc],["1−h (inactivation Na⁺)",inact,P.violet],["n⁴ (ouverture K⁺)",kopen,P.amber]].forEach(function(g,q){ var yy=GH+22+q*0; });
      var gw=Math.min(110,W*.2), x0=W-gw-14; [["m³",act,P.acc],["1−h",inact,P.violet],["n⁴",kopen,P.amber]].forEach(function(g,q){ var yy=my+30+q*12; if(W>420){ ctx.fillStyle="rgba(255,255,255,.7)"; ctx.fillRect(x0,yy-4,gw,8); ctx.fillStyle=g[2]; ctx.fillRect(x0,yy-4,gw*g[1],8); S.draw.text(c,g[0],x0-6,yy,{size:9.5,color:g[2],align:"right"}); } });
      var verdict = dr.value==="ttx"?"aucun pic (Na⁺ bloqué)":r.sp===0?"sous le seuil : pas de potentiel d'action":r.sp===1?"un potentiel d'action":r.sp+" potentiels d'action";
      if(tw.value&&r.sp===1) verdict+=" : le 2ᵉ stimulus tombe en période réfractaire";
      ro.set(0,S.fmt(r.mx,1)+" mV"); ro.set(1,String(r.sp)); ro.set(2,verdict);
    }
    k.button("▶ Rejouer",function(){ auto=true; tcur=0; },true);
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
    k.note("Modèle d'axone géant de calmar à 6,3 °C (Hodgkin-Huxley, 1952), tension de repos −65 mV. À 37 °C chez les mammifères, tout est beaucoup plus rapide (pic en < 1 ms). Seuil de ≈ 7 µA/cm² pour un stimulus de 1 ms. Les canaux dessinés montrent les variables de portes du modèle (m³, 1−h, n⁴).","warn");
  }
});

SFA.sim({
  id:"ub-c04-propagation-myeline", ch:"c04", tag:"Conduction nerveuse",
  titre:"Vitesse de conduction : diamètre, myéline et sclérose en plaques",
  resume:"Course entre une fibre amyélinique et une fibre myélinisée : l'onde continue contre les sauts de nœud en nœud, et ce que la démyélinisation leur fait perdre.",
  but:"Règle le diamètre (curseur ou point du graphique), la distance et le taux de démyélinisation, puis lance la course : le potentiel d'action (lueur rouge) avance en continu dans la fibre nue et saute de nœud de Ranvier en nœud dans la fibre myélinisée.",
  aRetenir:"Fibre amyélinique : v ≈ 1,1·√d (m/s, d en µm). Fibre myélinisée : v ≈ 6·d (m/s) : conduction saltatoire de nœud en nœud de Ranvier (≈ 100·d entre deux nœuds). Pour d = 10 µm, ≈ 60 m/s contre 3,5 m/s. La démyélinisation ralentit puis peut bloquer la conduction (sclérose en plaques).",
  piege:"La myéline n'isole pas pour « garder le courant » : elle diminue la capacité de membrane et force les canaux Na⁺ à se concentrer aux nœuds. Gros diamètre = plus rapide, mais la myéline est bien plus rentable en place.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(560);
    var d=k.slider("Diamètre de la fibre d",0.2,20,0.2,10,"µm");
    var L=k.slider("Distance à parcourir",0.05,1.5,0.05,1,"m");
    var dm=k.slider("Démyélinisation",0,100,5,0,"%");
    var ro=k.readouts(["v amyélinique","v myélinisée","Latence amyélinique","Latence myélinisée"]);
    var nt=k.note("","");
    var tA=-1, t=0, ax=null, drag=false;
    function V(){ var vu=1.1*Math.sqrt(d.value), vm=6*d.value; return {vu:vu,vm:vm,vx:vu+(1-dm.value/100)*(vm-vu)}; }
    function fmtT(s){ return s<1?S.fmt(s*1000,1)+" ms":S.fmt(s,2)+" s"; }
    var df=B.defi(k,function(n){ return [{id:0,txt:"réflexe : latence ≤ 20 ms sur 1 m dans une fibre myélinisée saine : quel diamètre minimal ? (pas de 0,2 µm)"},
        {id:1,txt:"sclérose en plaques (d = 10 µm, 1 m) : quel taux de démyélinisation minimal fait dépasser 50 ms de latence ?"},
        {id:2,txt:"trouve le diamètre de fibre AMYÉLINIQUE qui conduit aussi vite qu'une fibre myélinisée de 0,6 µm (± 0,05 m/s)"}][n%3]; },
      function(q){ var v=V();
        if(q.id===0) return {ok:dm.value===0&&L.value===1&&L.value/v.vx<=0.02&&L.value/(6*(d.value-0.2))>0.02};
        if(q.id===1) return {ok:d.value===10&&L.value===1&&L.value/v.vx>0.05&&L.value/(v.vu+(1-(dm.value-5)/100)*(v.vm-v.vu))<=0.05};
        return {ok:Math.abs(v.vu-3.6)<=0.05}; });
    k.button("▶ Lancer la course",function(){ tA=0; },true);
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8); if((tp==="down"||tp==="drag")&&drag){ d.set(Math.round(Math.max(0.2,Math.min(20,ax.ix(p.x)))*5)/5); k.redraw(); } if(tp==="up") drag=false; });
    function frame(dt){
      t+=dt; if(tA>=0) tA+=dt; var ctx=c.ctx, W=c.W, Ls=B.split(c,.5), D=Ls.d, v=V(), Tu=L.value/v.vu, Tm=L.value/v.vx, Tmax=Math.max(Tu,Tm), sc=6/Tmax;
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44, x0=D.x+30, x1=D.x+D.w-26, nn=10, seg=(x1-x0)/nn, rr=Math.max(4,Math.min(10,3+d.value*.4));
      function prog(T){ return tA<0?0:Math.min(1,tA/(T*sc)); }
      [[top+40,false,Tu,P.amber,"Amyélinique"],[top+(D.h-44)*.66,true,Tm,P.acc,"Myélinisée"+(dm.value>0?" ("+dm.value+" % démyélinisée)":"")]].forEach(function(o){
        var y=o[0], u=prog(o[2]); S.draw.text(c,o[4]+" · v = "+S.fmt(o[1]?v.vx:v.vu,o[1]?1:2)+" m/s",x0-14,y-rr-22,{size:11,color:o[3],align:"left"});
        /* axone */
        ctx.save(); var g=ctx.createLinearGradient(0,y-rr,0,y+rr); g.addColorStop(0,"#e6dcf7"); g.addColorStop(.5,"#cdbdf0"); g.addColorStop(1,"#a993de"); ctx.fillStyle=g; S.draw.rrect(c,x0-12,y-rr,x1-x0+24,2*rr,rr); ctx.fill(); ctx.restore();
        /* gaines de myéline (cellules de Schwann) */
        if(o[1]) for(var i=0;i<nn;i++){ var a=0.15+0.8*(1-dm.value/100)*(i%3===1&&dm.value>0?.4:1); ctx.save(); ctx.globalAlpha=a; S.draw.rrect(c,x0+i*seg+5,y-rr-6,seg-10,2*rr+12,rr+6); ctx.fillStyle="#fbf3dd"; ctx.fill(); ctx.strokeStyle="#d6c08a"; ctx.lineWidth=1.2; ctx.stroke();
            ctx.strokeStyle="rgba(190,160,100,.5)"; for(var q=1;q<4;q++){ ctx.beginPath(); ctx.moveTo(x0+i*seg+9,y-rr-6+q*(2*rr+12)/4); ctx.lineTo(x0+(i+1)*seg-9,y-rr-6+q*(2*rr+12)/4); ctx.stroke(); } ctx.restore(); }
        if(o[1]) for(var j=0;j<=nn;j++) S.draw.dot(c,x0+j*seg,y,3,P.red);
        /* potentiel d'action */
        if(tA>=0){ var px=o[1]?x0+Math.min(nn,Math.floor(u*nn+1e-9))*seg:x0+u*(x1-x0);
          if(o[1]&&dm.value>=50) px=x0+u*(x1-x0);
          var gl=ctx.createLinearGradient(px-50,0,px+6,0); gl.addColorStop(0,"rgba(192,50,29,0)"); gl.addColorStop(1,"rgba(192,50,29,.55)"); ctx.fillStyle=gl; ctx.fillRect(Math.max(x0-12,px-50),y-rr,Math.min(56,px-x0+18),2*rr);
          S.draw.glow(c,px,y,18,P.red,.7); for(var m=0;m<3;m++){ var w=((t*3+m/3)%1); B.ball(c,px+(m-1)*5,y-rr-14+w*14,2.6,P.blue); }
          if(u>=1) S.draw.label(c,"arrivée : "+fmtT(o[2]),x1-30,y+rr+16,{color:o[3],size:10}); }
      });
      S.draw.text(c,"stimulus",x0-14,D.y+D.h-14,{size:9.5,color:P.grey,align:"left"}); S.draw.text(c,"enregistrement à "+S.fmt(L.value,2)+" m",x1+10,D.y+D.h-14,{size:9.5,color:P.grey,align:"right"});
      S.draw.text(c,"crème : myéline · rouge : nœuds de Ranvier · bleu : Na⁺ qui entre",D.x+D.w/2,D.y+D.h-30,{size:9.5,color:P.grey});
      /* vitesse en fonction du diamètre */
      ax=B.axes(c,Ls.g,{frame:true,t:24,b:36,l:42,x0:0,x1:20,y0:0,y1:125,stepX:2,stepY:25,xl:"diamètre d (µm)",yl:"vitesse (m/s)"});
      S.draw.fn(c,ax,function(x){ return 6*x; },P.acc,2.4); S.draw.fn(c,ax,function(x){ return 1.1*Math.sqrt(x); },P.amber,2.4);
      if(dm.value>0) S.draw.fn(c,ax,function(x){ return 1.1*Math.sqrt(x)+(1-dm.value/100)*(6*x-1.1*Math.sqrt(x)); },P.red,1.8,[5,4]);
      S.draw.line(c,ax.X(d.value),ax.T,ax.X(d.value),ax.B,P.ink,1,[3,3]);
      S.draw.dot(c,ax.X(d.value),ax.cy(v.vx),8,P.acc); S.draw.dot(c,ax.X(d.value),ax.Y(v.vu),7,P.amber);
      S.draw.legend(c,[[P.acc,"myélinisée : 6·d"],[P.amber,"amyélinique : 1,1·√d"],[P.red,"démyélinisée",1]],ax.L+6,ax.T+4);
      var q=df.banner(c,13);
      ro.set(0,S.fmt(v.vu,2)+" m/s"); ro.set(1,S.fmt(v.vx,1)+" m/s"); ro.set(2,fmtT(Tu)); ro.set(3,fmtT(Tm));
      nt.set((q&&q.ok?"<b>Défi réussi.</b> ":"")+"Lois empiriques approchées (d = diamètre total) ; l'interpolation linéaire selon le taux de démyélinisation est un modèle qualitatif et le blocage complet de la conduction n'est pas modélisé. Animation : la fibre la plus lente met 6 s.",q&&q.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c04-cascade-amplification", ch:"c04", tag:"Transduction",
  titre:"Cascade AMPc : amplification et durée du signal",
  resume:"Dépose l'hormone sur son récepteur : protéine G, adénylyl cyclase, AMPc, PKA… chaque étage multiplie le signal ; la phosphodiestérase l'éteint.",
  but:"Glisse l'hormone (violette) sur le récepteur ou appuie sur « Libérer l'hormone ». Règle l'amplification de chaque étage et teste la caféine (inhibe la PDE) ou la toxine cholérique (Gs bloquée active). La courbe suit [AMPc] en direct.",
  aRetenir:"Chaque étage d'une cascade multiplie le signal : 1 ligand × n₁ protéines G × n₂ AMPc × n₃ substrats phosphorylés. L'AMPc est dégradé par la phosphodiestérase : [AMPc] suit d[AMPc]/dt = production − k·[AMPc] ; sa demi-vie est ln 2 / k. La caféine ralentit cette dégradation et prolonge le signal ; la toxine cholérique empêche l'arrêt de Gs : production d'AMPc permanente.",
  piege:"Amplifier ne veut pas dire « plus de ligand » : un faible nombre de récepteurs activés peut produire une réponse énorme. Inversement, un signal qui ne s'éteint pas est pathologique (choléra).",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var n0=k.slider("Molécules de ligand liées",1,1000,1,10,"");
    var n1=k.slider("n₁ : protéines G activées par récepteur",1,100,1,10,"");
    var n2=k.slider("n₂ : AMPc produites par protéine G active",1,500,1,50,"");
    var n3=k.slider("n₃ : substrats phosphorylés par molécule d'AMPc",1,200,1,20,"");
    var du=k.slider("Durée de présence de l'hormone",5,40,1,20,"s");
    var dr=k.seg("Condition",[["none","Normal"],["caf","Caféine"],["cho","Toxine cholérique"]],"none");
    var ro=k.readouts(["Amplification totale","Substrats phosphorylés","[AMPc] maximale","Demi-vie de l'AMPc"]);
    var nt=k.note("","");
    var ts=-1, t=0, lig={x:0,y:0,drag:false,home:true}, R={}, rnd=B.rng(31), camp=[], gpos=0, ax=null;
    for(var q=0;q<44;q++) camp.push({x:rnd(),y:rnd(),ph:rnd()*6.28});
    function kk(){ return dr.value==="caf"?0.1:0.2; }
    function traj(){ var s0=0.3+0.1*Math.log10(n0.value*n1.value*n2.value), k1=kk(), T=du.value, x=0.05, pts=[[0,x]], mx=x, e15=null;
      for(var tt=0;tt<100;tt+=0.1){ var on=tt>=2&&tt<2+T, pr=on||(dr.value==="cho"&&tt>=2)?s0:0; x+=0.1*(pr-k1*(x-0.05)); if(x>mx) mx=x; pts.push([tt+0.1,x]); if(e15===null&&tt>=2+T+15) e15=x; }
      return {pts:pts,mx:mx,e15:e15==null?x:e15}; }
    function at(tr,tt){ var i=Math.max(0,Math.min(tr.pts.length-1,Math.round(tt*10))); return tr.pts[i][1]; }
    function fire(){ ts=0; lig.home=false; }
    k.button("▶ Libérer l'hormone",fire,true);
    var df=B.defi(k,function(n){ return [{id:0,txt:"avec UNE seule molécule d'hormone, fais phosphoryler plus d'un million de substrats"},
        {id:1,txt:"fais durer le signal : [AMPc] encore > 1 µmol/L 15 s après le départ de l'hormone"},
        {id:2,txt:"règle les trois étages pour une amplification totale de 10⁵ (± 10 %)"}][n%3]; },
      function(d){ var A=n1.value*n2.value*n3.value;
        if(d.id===0) return {ok:n0.value===1&&A>=1e6}; if(d.id===1) return {ok:traj().e15>1};
        return {ok:Math.abs(A/1e5-1)<=0.1}; });
    c.pointer(function(tp,p){
      if(tp==="down"&&Math.hypot(p.x-lig.x,p.y-lig.y)<22){ lig.drag=true; }
      if(tp==="drag"&&lig.drag){ lig.x=p.x; lig.y=p.y; }
      if(tp==="up"&&lig.drag){ lig.drag=false; if(Math.hypot(p.x-R.rx,p.y-(R.my-26))<46) fire(); }
      if(ax&&(tp==="down"||tp==="drag")&&!lig.drag&&ax.has(p,6)&&ts>=0){ ts=Math.max(0,Math.min(100,ax.ix(p.x))); } });
    function frame(dt){
      t+=dt; if(ts>=0&&ts<100) ts=Math.min(100,ts+dt*8);
      var ctx=c.ctx, W=c.W, L=B.split(c,.56), D=L.d, tr=traj(), tt=Math.max(0,ts), x=ts>=0?at(tr,tt):0.05, on=ts>=2&&ts<2+du.value, gact=on||(dr.value==="cho"&&ts>=2);
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44, my=top+64, dw=D.w, x0=D.x;
      R.my=my; R.rx=x0+dw*.2; var acx=x0+dw*.52, pkx=x0+dw*.3, pdx=x0+dw*.8, cyb=D.y+D.h-10;
      ctx.fillStyle="rgba(168,210,240,.25)"; ctx.fillRect(x0+6,top,dw-12,my-13-top); ctx.fillStyle="rgba(250,236,214,.4)"; ctx.fillRect(x0+6,my+13,dw-12,cyb-my-13);
      B.membrane(c,x0+6,x0+dw-6,my,{ep:26,step:12,skip:[[R.rx-22,R.rx+22],[acx-24,acx+24]]});
      /* récepteur à 7 hélices */
      ctx.save(); ctx.strokeStyle="#6a4fc4"; ctx.lineWidth=5; ctx.lineCap="round"; ctx.beginPath(); for(var h=0;h<7;h++){ var hx=R.rx-18+h*6; ctx.moveTo(hx,my-16); ctx.lineTo(hx,my+16); } ctx.stroke(); ctx.restore();
      S.draw.text(c,"récepteur",R.rx,my+24,{size:9,color:P.violet,halo:true});
      /* adénylyl cyclase */
      ctx.save(); S.draw.rrect(c,acx-20,my-16,40,40,10); var ga=ctx.createLinearGradient(0,my-16,0,my+24); ga.addColorStop(0,"#7fc7a0"); ga.addColorStop(1,"#2f8a62"); ctx.fillStyle=ga; ctx.fill(); ctx.strokeStyle="#1d5d40"; ctx.stroke(); ctx.restore();
      S.draw.text(c,"AC",acx,my+4,{size:10,color:"#fff"});
      /* protéine G : l'α (bleu) va du récepteur à l'AC quand elle est active */
      gpos+=((gact?1:0)-gpos)*Math.min(1,dt*3+(dt===0?1:0)); var gx=R.rx+18+gpos*(acx-R.rx-40), gy=my+26;
      B.ball(c,gx,gy,8,P.blue,{text:"α",size:9}); B.ball(c,R.rx+16,gy+12,5.5,"#8aa6c9"); B.ball(c,R.rx+26,gy+14,4.5,"#8aa6c9");
      if(dr.value==="cho") S.draw.text(c,"✶ toxine",gx,gy+18,{size:9,color:P.red,halo:true});
      /* hormone (glissable) */
      if(lig.home&&!lig.drag){ lig.x=x0+30; lig.y=top+14; } else if(!lig.drag&&!lig.home){ var bound=ts>=0&&ts<2+du.value, tx=bound?R.rx:x0+dw*.12, tyy=bound?my-22:top+12; lig.x+=(tx-lig.x)*Math.min(1,dt*4); lig.y+=(tyy-lig.y)*Math.min(1,dt*4); if(ts>=2+du.value+3&&Math.abs(lig.x-tx)<2) lig.home=true; }
      S.draw.glow(c,lig.x,lig.y,16,P.violet,.35); B.ball(c,lig.x,lig.y,8,P.violet,{text:"H",size:9});
      if(lig.home&&ts<0) S.draw.text(c,"← glisse l'hormone sur le récepteur",lig.x+16,lig.y,{size:10,color:P.violet,align:"left",halo:true});
      /* AMPc dans le cytoplasme : nombre ∝ concentration */
      var nC=Math.min(camp.length,Math.round(x*7));
      for(var i=0;i<nC;i++){ var o=camp[i], cx=x0+16+((o.x+.03*Math.sin(t+o.ph))%1+1)%1*(dw-32), cy=my+40+((o.y+.04*Math.cos(t*.8+o.ph))%1+1)%1*(cyb-my-90); B.ball(c,cx,cy,3.6,P.teal); }
      if(gact){ var u=(t*1.5)%1; B.ball(c,acx+(u-.5)*20,my+26+u*30,3.6,P.teal); }
      /* PKA et substrats phosphorylés */
      var act=x/(x+1.5); ctx.save(); [0,1].forEach(function(j){ var py=cyb-62+j*14; B.ball(c,pkx-12,py,6.5,"#8e6b2e"); B.ball(c,pkx+6+act*24,py+(act*6),6.5,P.amber,{text:"C",size:8}); }); ctx.restore();
      S.draw.text(c,"PKA",pkx-12,cyb-82,{size:9.5,color:P.amber,halo:true});
      var nS=12, nP=Math.round(act*nS); for(var j2=0;j2<nS;j2++){ var sx=x0+18+j2*(dw-36)/(nS-1), sy=cyb-16; B.ball(c,sx,sy,6,"#9aa6b6"); if(j2<nP) B.ball(c,sx+5,sy-5,3.4,P.yellow,{text:"P",size:5.5,tcolor:"#5a3b00"}); }
      S.draw.text(c,"substrats (enzymes, canaux…) : "+S.fmt(act*100,0)+" % phosphorylés",x0+dw/2,cyb-34,{size:9.5,color:P.ink,halo:true});
      /* PDE */
      ctx.save(); ctx.fillStyle=dr.value==="caf"?"#e7a59a":P.red; ctx.beginPath(); var mo=.35+.25*Math.abs(Math.sin(t*(dr.value==="caf"?2:5))); ctx.moveTo(pdx,my+66); ctx.arc(pdx,my+66,12,mo,6.2832-mo); ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.text(c,"PDE"+(dr.value==="caf"?" (freinée)":""),pdx,my+88,{size:9.5,color:P.red,halo:true});
      /* facteurs d'amplification */
      S.draw.label(c,"×"+n1.value,(R.rx+acx)/2,my+50,{color:P.blue,size:10}); S.draw.label(c,"×"+n2.value,acx+30,my+44,{color:P.teal,size:10}); S.draw.label(c,"×"+n3.value,pkx+40,cyb-62,{color:P.amber,size:10});
      /* [AMPc](t) en direct */
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:40,x0:0,x1:100,y0:0,y1:Math.max(6,Math.ceil(tr.mx*1.15)),stepX:10,xl:"temps (s)",yl:"[AMPc] (µmol/L)"});
      ctx.save(); ctx.fillStyle="rgba(98,54,196,.10)"; ctx.fillRect(ax.X(2),ax.T,ax.X(Math.min(100,2+du.value))-ax.X(2),ax.B-ax.T); ctx.restore();
      S.draw.text(c,"hormone liée",ax.X(2+du.value/2),ax.T+8,{size:9.5,color:P.violet,halo:true});
      B.poly(c,ax,tr.pts,"#9fd3dd",1.4,[4,3]); if(ts>=0){ B.poly(c,ax,tr.pts.slice(0,Math.round(tt*10)+1),P.teal,2.8); S.draw.dot(c,ax.X(tt),ax.Y(x),7,P.teal); }
      S.draw.line(c,ax.L,ax.Y(1),ax.R,ax.Y(1),P.grey,1,[2,4]); S.draw.text(c,"1 µmol/L",ax.R-4,ax.Y(1)-7,{size:9,color:P.grey,align:"right",halo:true});
      var d=df.banner(c,13), A=n1.value*n2.value*n3.value;
      ro.set(0,B.sci(A,1)+" ×"); ro.set(1,B.sci(n0.value*A,1)); ro.set(2,S.fmt(tr.mx,2)+" µmol/L"); ro.set(3,S.fmt(Math.LN2/kk(),1)+" s");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+(ts<0?"Glisse l'hormone sur le récepteur pour lancer la cascade. ":"Temps simulé : "+S.fmt(tt,0)+" s (glisse sur le graphique pour revoir un instant). ")+"Valeurs pédagogiques : production d'AMPc croissant avec le logarithme du signal, dégradation k = 0,2 s⁻¹ (0,1 s⁻¹ avec caféine) ; toxine cholérique : production permanente dès l'activation.",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c04-synapse-sommation", ch:"c04", tag:"Synapse · sommation",
  titre:"Sommation spatiale et temporelle de potentiels post-synaptiques",
  resume:"Un neurone et ses boutons synaptiques : les PPSE (verts) et PPSI (rouges) voyagent jusqu'au soma et s'additionnent ; au seuil, l'axone décharge.",
  but:"Règle le nombre et la fréquence des synapses excitatrices et inhibitrices, ou touche un bouton synaptique pour l'activer toi-même (tapote vite : sommation temporelle). L'oscilloscope montre Vm au cône d'émergence, ralenti 20 fois.",
  aRetenir:"Le neurone intègre : chaque PPSE (+) ou PPSI (−) décroît avec la constante de temps τ ; ils s'additionnent dans l'espace (plusieurs synapses simultanées) et dans le temps (arrivées rapprochées). Dépolarisation moyenne ≈ (Σ n·f·a)·τ. Seuil ≈ −55 mV depuis −70 mV (15 mV).",
  piege:"Un seul PPSE de 1 mV est loin d'un seuil de 15 mV : c'est la sommation qui compte. Une synapse inhibitrice ne « bloque » pas : elle soustrait.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var ne=k.slider("Synapses excitatrices",0,30,1,6,"");
    var fe=k.slider("Fréquence de chaque synapse excitatrice",1,100,1,40,"Hz");
    var ae=k.slider("Amplitude d'un PPSE",0.2,3,0.1,1,"mV");
    var ni=k.slider("Synapses inhibitrices",0,15,1,0,"");
    var fi=k.slider("Fréquence de chaque synapse inhibitrice",1,100,1,40,"Hz");
    var tau=k.slider("Constante de temps τ",2,30,1,10,"ms");
    var ro=k.readouts(["Dépolarisation moyenne prévue","Fréquence de décharge (calcul sur 1 s)","Potentiels d'action à l'écran"]);
    var nt=k.note("","");
    var rest=-70, th=-55, tm=0, V=rest, ref=0, buf=[], spikes=[], waves=[], flash={}, man=[], cache={}, bt=[], rnd=B.rng(41);
    function offline(n1,n2){ var key=[n1,fe.value,ae.value,n2,fi.value,tau.value].join(); if(cache[key]!=null) return cache[key];
      var ev=[], T=1000, i, t2; for(i=0;i<n1;i++){ var per=1000/fe.value, ph=((i*0.618034)%1)*per; for(t2=ph;t2<T;t2+=per) ev.push([t2,ae.value]); }
      for(i=0;i<n2;i++){ var p2=1000/fi.value, h2=((i*0.381966+0.17)%1)*p2; for(t2=h2;t2<T;t2+=p2) ev.push([t2,-ae.value]); }
      ev.sort(function(a,b){ return a[0]-b[0]; }); var v=rest, ei=0, rf=0, sp=0;
      for(var s=0;s<=T*10;s++){ var t=s/10; v=rest+(v-rest)*Math.exp(-0.1/tau.value); while(ei<ev.length&&ev[ei][0]<=t){ if(rf<=0) v=Math.max(-85,v+ev[ei][1]); ei++; } rf-=0.1; if(v>=th&&rf<=0){ sp++; v=rest; rf=3; } }
      return (cache[key]=sp); }
    var df=B.defi(k,function(n){ return [{id:0,txt:"fais décharger le neurone à 40 Hz (± 5 Hz)"},{id:1,txt:"sans inhibition et avec au plus 3 synapses excitatrices, obtiens au moins 20 potentiels d'action par seconde"},{id:2,txt:"ajoute juste assez de synapses inhibitrices pour faire taire un neurone qui reçoit 20 synapses excitatrices"}][n%3]; },
      function(d){ var f=offline(ne.value,ni.value);
        if(d.id===0) return {ok:Math.abs(f-40)<=5}; if(d.id===1) return {ok:ni.value===0&&ne.value<=3&&f>=20};
        return {ok:ne.value===20&&f===0&&ni.value>0&&offline(ne.value,ni.value-1)>0}; });
    k.button("Tout réinitialiser",function(){ ne.set(6); fe.set(40); ae.set(1); ni.set(0); fi.set(40); tau.set(10); });
    c.pointer(function(tp,p){ if(tp!=="down") return; bt.forEach(function(b){ if(Math.hypot(p.x-b.x,p.y-b.y)<14){ man.push({tm:tm,amp:b.exc?ae.value:-ae.value}); flash[b.k]=0.25; waves.push({b:b,u:0}); } }); });
    function syncEvents(t0,t1,fn){ /* événements des trains réguliers dans ]t0, t1] */
      [[ne.value,fe.value,1,0.618034,0],[ni.value,fi.value,-1,0.381966,0.17]].forEach(function(g){ var per=1000/g[1];
        for(var i=0;i<g[0];i++){ var ph=((i*g[3]+g[4])%1)*per, n=Math.floor((t1-ph)/per); if(n<0) continue; var te=ph+n*per; if(te>t0) fn(g[2],i); } }); }
    function frame(dt){
      var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, dm=dt*50, t0=tm; tm+=dm;
      /* intégration à pas de 0,1 ms */
      var nE=0;
      for(var s=t0;s<tm;s+=0.1){ var s1=Math.min(tm,s+0.1); V=rest+(V-rest)*Math.exp(-(s1-s)/tau.value);
        syncEvents(s,s1,function(sg,i){ if(ref<=0) V=Math.max(-85,V+sg*ae.value); var key=(sg>0?"e":"i")+(i%10); flash[key]=0.18; if(nE++<6){ var b=bt.filter(function(q){ return q.k===key; })[0]; if(b) waves.push({b:b,u:0}); } });
        man=man.filter(function(m){ if(m.tm<=s1){ if(ref<=0) V=Math.max(-85,V+m.amp); return false; } return true; });
        ref-=(s1-s); if(V>=th&&ref<=0){ spikes.push({t:s1,u:0}); V=rest; ref=3; buf.push([s1,30]); } buf.push([s1,V]); }
      while(buf.length&&buf[0][0]<tm-200) buf.shift(); spikes=spikes.filter(function(q){ return q.t>tm-200; });
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+40, sx=D.x+D.w*.58, sy=top+(D.h-40)*.5, sr=Math.min(30,D.h*.13);
      /* dendrites */
      var den=[[-1,-.9],[-1,-.35],[-1,.3],[-1,.85],[-.3,-1.1],[-.4,1.1]], tips=[];
      ctx.save(); ctx.strokeStyle="#c9b2e8"; ctx.lineCap="round";
      den.forEach(function(d){ var ex=sx+d[0]*D.w*.48, ey=sy+d[1]*(D.h-60)*.42; ex=Math.max(D.x+16,ex); ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo((sx+ex)/2,(sy+ey)/2+(d[1]>0?-14:14),ex,ey); ctx.stroke(); tips.push([ex,ey]); });
      /* axone */
      var axx1=D.x+D.w-10; ctx.lineWidth=6; ctx.strokeStyle="#c9b2e8"; ctx.beginPath(); ctx.moveTo(sx+sr,sy); ctx.lineTo(axx1,sy); ctx.stroke(); ctx.restore();
      for(var m=0;m<4;m++){ var mx=sx+sr+22+m*(axx1-sx-sr-30)/4; ctx.fillStyle="rgba(46,107,85,.35)"; S.draw.rrect(c,mx,sy-7,(axx1-sx-sr-30)/4-8,14,6); ctx.fill(); }
      /* soma coloré selon Vm */
      var f=Math.max(0,Math.min(1,(V-rest)/(th-rest))), scol=V<rest?"#6c8fd6":"rgb("+Math.round(150+105*f)+","+Math.round(120-40*f)+","+Math.round(210-150*f)+")";
      S.draw.glow(c,sx,sy,sr*1.8,f>0.7?P.red:P.violet,.25+.3*f); B.ball(c,sx,sy,sr,scol); B.ball(c,sx-sr*.2,sy-sr*.15,sr*.38,"#5b3fa0");
      S.draw.text(c,S.fmt(V,0)+" mV",sx,sy+sr+12,{size:10.5,color:P.ink,halo:true});
      /* boutons synaptiques : 10 dessinés au plus par type */
      bt=[]; var nEd=Math.min(10,ne.value), nId=Math.min(10,ni.value);
      for(var i=0;i<nEd+nId;i++){ var exc=i<nEd, j=exc?i:i-nEd, tp=tips[(j*2+(exc?0:1))%tips.length], u=0.55+0.4*((j*0.37+(exc?0:.2))%1), bx=sx+(tp[0]-sx)*u, by=sy+(tp[1]-sy)*u+(exc?-9:9);
        bt.push({x:bx,y:by,exc:exc,k:(exc?"e":"i")+j}); }
      bt.forEach(function(b){ var fl=flash[b.k]||0; if(fl>0) S.draw.glow(c,b.x,b.y,16,b.exc?P.green:P.red,.6); B.ball(c,b.x,b.y,7.5,b.exc?P.green:P.red,{text:b.exc?"+":"−",size:10}); });
      Object.keys(flash).forEach(function(q){ flash[q]-=dt; });
      if(ne.value>10) S.draw.text(c,"1 bouton vert = "+S.fmt(ne.value/10,1)+" synapses",D.x+8,D.y+D.h-12,{size:9.5,color:P.green,align:"left"});
      /* ondes PPSE / PPSI vers le soma */
      waves.forEach(function(w){ w.u+=dt*2.2; var x=w.b.x+(sx-w.b.x)*w.u, y=w.b.y+(sy-w.b.y)*w.u; ctx.save(); ctx.globalAlpha=1-w.u*.6; B.ball(c,x,y,3.4,w.b.exc?"#4fbf7f":"#e06a5a"); ctx.restore(); });
      waves=waves.filter(function(w){ return w.u<1; }); if(waves.length>60) waves=waves.slice(-60);
      /* potentiels d'action sur l'axone */
      spikes.forEach(function(q){ var u=(tm-q.t)/6; if(u>1) return; var x=sx+sr+u*(axx1-sx-sr); S.draw.glow(c,x,sy,14,P.amber,.8); B.ball(c,x,sy,5,P.amber); });
      S.draw.text(c,"touche un bouton (+ ou −) pour l'activer",D.x+D.w/2,top+6,{size:9.5,color:P.grey,halo:true});
      /* oscilloscope */
      var ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:42,x0:-200,x1:0,y0:-90,y1:40,stepX:50,stepY:20,xl:"temps (ms, 0 = maintenant)",yl:"Vm au cône d'émergence (mV)"});
      S.draw.line(c,ax.L,ax.Y(th),ax.R,ax.Y(th),P.red,1.3,[6,4]); S.draw.text(c,"seuil −55",ax.L+6,ax.Y(th)-8,{size:9.5,color:P.red,align:"left",halo:true});
      S.draw.line(c,ax.L,ax.Y(rest),ax.R,ax.Y(rest),"#c8d1de",1,[3,4]);
      B.poly(c,ax,buf.map(function(q){ return [q[0]-tm,q[1]]; }),P.acc,1.8);
      var mean=(ne.value*fe.value*ae.value-ni.value*fi.value*ae.value)/1000*tau.value, fr=offline(ne.value,ni.value);
      var d=df.banner(c,13);
      ro.set(0,(mean>=0?"+":"")+S.fmt(mean,1)+" mV"); ro.set(1,S.fmt(fr,0)+" Hz"); ro.set(2,String(spikes.length));
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Modèle d'intégrateur à fuite : repos −70 mV, seuil −55 mV, retour à −70 mV après chaque potentiel d'action (pics dessinés à +30 mV), réfractaire 3 ms, hyperpolarisation limitée à −85 mV. Trains réguliers déphasés ; l'animation est ralentie 20 fois.",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c04-homeostasie-retroaction", ch:"c04", tag:"Homéostasie",
  titre:"Rétroaction négative et positive : gain et erreur résiduelle",
  resume:"Un repas (ou le froid) perturbe la variable ; capteur, centre intégrateur et effecteurs la ramènent vers la consigne. Plus le gain est grand, plus l'erreur restante est petite.",
  but:"Choisis la variable, le type de rétroaction et le gain, puis lance le film : la boucle s'anime (capteur → centre → effecteurs) et la courbe se trace. Glisse sur le graphique pour revoir n'importe quel instant.",
  aRetenir:"Rétroaction négative : x' = D − a(1 + G)·x. À l'équilibre, l'écart vaut D / [a(1 + G)] : l'erreur est réduite d'un facteur 1 + G par rapport à l'absence de régulation, et la correction est plus rapide (constante de temps 1/[a(1 + G)]). Il reste toujours un petit écart. Rétroaction positive : x' = D + a(G − 1)·x : si G > 1, emballement exponentiel (G = 1 : croissance linéaire, sans équilibre ; accouchement, coagulation, potentiel d'action).",
  piege:"« Homéostasie » ne veut pas dire valeur constante : il reste une erreur résiduelle, et la consigne elle-même peut changer (fièvre).",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var sc=k.seg("Variable",[["gly","Glycémie (g/L)"],["tmp","Température (°C)"]],"gly");
    var md=k.seg("Rétroaction",[["neg","Négative"],["pos","Positive"]],"neg");
    var G=k.slider("Gain G (effecteurs / perturbation)",0,20,0.5,4,"");
    var tmp=k.toggle("Perturbation temporaire (s'arrête à t = 30 min)",false);
    var ro=k.readouts(["Écart final (ou pic)","Réduction de l'erreur","Constante de temps"]);
    var nt=k.note("","");
    var tc=0, play=true, ax=null, drag=false, t=0, rnd=B.rng(51), dots=[]; for(var q=0;q<40;q++) dots.push({x:rnd(),y:rnd(),ph:rnd()*6.28});
    function model(){ var g=G.value, a=0.1, isG=sc.value==="gly", D=isG?0.06:0.4, pos=md.value==="pos", x=0, pts=[[0,0]], cap=10*D/a, mx=0, runaway=false;
      for(var tt=0;tt<60;tt+=0.1){ var d=(tt>=5&&(!tmp.value||tt<30))?D:0, rate=pos?d+a*(g-1)*x:d-a*(1+g)*x; x+=0.1*rate; if(x>cap){ x=cap; runaway=true; } pts.push([tt+0.1,x]); if(Math.abs(x)>mx) mx=Math.abs(x); }
      return {pts:pts,D:D,a:a,isG:isG,pos:pos,cap:cap,mx:mx,runaway:runaway,set:isG?1.0:37,u:isG?"g/L":"°C"}; }
    function at(m,tt){ return m.pts[Math.max(0,Math.min(m.pts.length-1,Math.round(tt*10)))][1]; }
    var df=B.defi(k,function(n){ var id=n%3;
        if(id===0){ var gly=sc.value==="gly", e=gly?[0.04,0.05,0.06,0.08][Math.floor(rnd()*4)]:[0.2,0.25,0.3,0.4][Math.floor(rnd()*4)]; return {id:0,e:e,gly:gly,txt:"rétroaction négative, perturbation permanente : écart final ≤ "+S.fmt(e,2)+" "+(gly?"g/L":"°C")+" avec le gain le plus petit possible"}; }
        if(id===1) return {id:1,txt:"rétroaction positive : trouve le gain minimal à partir duquel le système n'a plus d'équilibre"};
        return {id:2,txt:"perturbation temporaire : après son arrêt, l'écart doit retomber sous 10 % du pic en moins de 5 min, avec G minimal"}; },
      function(d){ var m=model(), g=G.value;
        if(d.id===0){ if(md.value!=="neg"||tmp.value||(sc.value==="gly")!==d.gly) return {ok:false}; var gm=Math.ceil((m.D/(m.a*d.e)-1)*2-1e-6)/2; return {ok:g===gm}; }
        if(d.id===1) return {ok:md.value==="pos"&&g===1};
        var gm2=Math.ceil((2.3026/(0.1*5)-1)*2)/2; return {ok:md.value==="neg"&&tmp.value&&g===gm2}; });
    k.button("▶ Rejouer le film",function(){ tc=0; play=true; },true);
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8); if((tp==="down"||tp==="drag")&&drag){ tc=Math.max(0,Math.min(60,ax.ix(p.x))); play=false; k.redraw(); } if(tp==="up") drag=false; });
    function box(x,y,w,h,col,title,sub){ S.draw.panel(c,x-w/2,y-h/2,w,h,{fill:"#ffffff",stroke:col,radius:10}); S.draw.text(c,title,x,y-(sub?7:0),{size:10.5,color:col}); if(sub) S.draw.text(c,sub,x,y+8,{size:9,color:P.grey}); }
    function frame(dt){
      t+=dt; if(play){ tc+=dt*6; if(tc>=60){ tc=60; play=false; } }
      var ctx=c.ctx, W=c.W, L=B.split(c,.52), D=L.d, m=model(), x=at(m,tc), pert=tc>=5&&(!tmp.value||tc<30), g=G.value;
      var corr=m.pos?g*x:g*x; /* intensité de la réponse des effecteurs */
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44, x0=D.x+10, x1=D.x+D.w-10, cx=(x0+x1)/2, wv=Math.min(200,D.w*.5), yv=top+30, yb=D.y+D.h-36;
      /* variable réglée : vaisseau sanguin (glucose) ou corps (température) */
      var rel=Math.max(-1,Math.min(3,x/(m.D/m.a)));
      if(m.isG){ ctx.save(); S.draw.rrect(c,cx-wv/2,yv-20,wv,40,20); var gg=ctx.createLinearGradient(0,yv-20,0,yv+20); gg.addColorStop(0,"#f9d5d5"); gg.addColorStop(1,"#efb0b0"); ctx.fillStyle=gg; ctx.fill(); ctx.strokeStyle="#c46b6b"; ctx.lineWidth=2; ctx.stroke(); ctx.clip();
          var nG=Math.round(14*(1+x/m.set*2.5)); for(var i=0;i<nG&&i<dots.length;i++){ var o=dots[i]; B.ball(c,cx-wv/2+((o.x-t*.06)%1+1)%1*wv,yv-14+o.y*28,3.6,P.amber); } ctx.restore();
          S.draw.text(c,"glycémie "+B.f(m.set+x,2)+" g/L",cx,yv+30,{size:10.5,color:P.ink,halo:true}); }
      else { var tcol=B.mix(P.red,Math.max(-.3,Math.min(.6,.25-rel*.3))); ctx.save(); ctx.fillStyle=tcol; ctx.beginPath(); ctx.arc(cx,yv-12,9,0,6.2832); ctx.fill(); S.draw.rrect(c,cx-14,yv-2,28,34,10); ctx.fill(); ctx.restore();
          S.draw.text(c,"température "+B.f(m.set+x,2)+" °C",cx,yv+44,{size:10.5,color:P.ink,halo:true}); }
      /* perturbation */
      var px=x0+34; S.draw.text(c,m.isG?"repas":"froid",px,yv-14,{size:10,color:pert?P.amber:P.grey});
      if(pert){ var pu=(t*1.2)%1; S.draw.arrow(c,px+14,yv,cx-wv/2-6,yv,P.amber,2.6); B.ball(c,px+14+pu*(cx-wv/2-px-24),yv,4,P.amber); }
      /* boucle : capteur → centre → effecteurs */
      var bw=Math.min(120,D.w*.3), bh=36, cxs=x1-bw/2, cxe=x0+bw/2, yc=(yv+yb)/2+18;
      box(cxs,yc,bw,bh,P.teal,"capteur",m.isG?"cellules β, pancréas":"thermorécepteurs");
      box(cx,yb,bw,bh,P.violet,"centre intégrateur",m.isG?"pancréas (insuline)":"hypothalamus");
      box(cxe,yc,bw,bh,m.pos?P.red:P.green,"effecteurs",m.isG?"foie, muscles":"peau, muscles");
      var sig=Math.min(1,Math.abs(corr)/(m.D/m.a*2)), lw=1.5+5*sig;
      [[cx+wv/2,yv+6,cxs,yc-bh/2],[cxs,yc+bh/2,cx+bw/2,yb],[cx-bw/2,yb,cxe,yc+bh/2],[cxe,yc-bh/2,cx-wv/2,yv+6]].forEach(function(a,i){
        S.draw.arrow(c,a[0],a[1],a[2],a[3],i===3?(m.pos?P.red:P.green):"#9aa6b6",i===3?lw:1.8);
        var u=((t*.8+i*.25)%1); if(sig>0.02) B.ball(c,a[0]+(a[2]-a[0])*u,a[1]+(a[3]-a[1])*u,3.2,i===3?(m.pos?P.red:P.green):P.violet); });
      S.draw.label(c,m.pos?"+ amplifie l'écart":"− corrige l'écart",(cxe+cx-wv/2)/2-6,(yc+yv)/2-6,{color:m.pos?P.red:P.green,size:10});
      /* graphique */
      var ymax=m.pos?m.cap*1.05:m.D/m.a*1.2;
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:46,x0:0,x1:60,y0:0,y1:ymax,stepX:10,stepY:ymax/4,xl:"temps (min)",yl:"écart à la consigne ("+m.u+")",fy:function(v){ return S.fmt(v,m.isG?2:1); }});
      S.draw.line(c,ax.L,ax.cy(m.D/m.a),ax.R,ax.cy(m.D/m.a),P.grey,1.3,[5,4]); S.draw.text(c,"sans régulation : "+S.fmt(m.D/m.a,2),ax.R-4,ax.cy(m.D/m.a)-8,{size:9.5,color:P.grey,align:"right",halo:true});
      ctx.save(); ctx.fillStyle="rgba(194,106,12,.08)"; ctx.fillRect(ax.X(5),ax.T,ax.X(tmp.value?30:60)-ax.X(5),ax.B-ax.T); ctx.restore();
      B.poly(c,ax,m.pts,"#c8d1de",1.3,[4,3]); B.poly(c,ax,m.pts.slice(0,Math.round(tc*10)+1),m.pos?P.red:P.acc,2.8);
      S.draw.dot(c,ax.X(tc),ax.cy(x),7,m.pos?P.red:P.acc);
      var d=df.banner(c,13);
      if(!m.pos){ var pk=tmp.value?m.mx:m.D/(m.a*(1+g)); ro.set(0,S.fmt(pk,3)+" "+m.u); ro.set(1,"÷ "+S.fmt(1+g,1)); ro.set(2,S.fmt(1/(m.a*(1+g)),1)+" min"); }
      else { ro.set(0,g>=1?"emballement":S.fmt(m.D/(m.a*(1-g)),3)+" "+m.u); ro.set(1,g<1?"× "+S.fmt(1/(1-g),2)+" (amplifiée)":"aucune"); ro.set(2,g<1?S.fmt(1/(m.a*(1-g)),1)+" min":g===1?"croissance linéaire":"exponentielle"); }
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+(m.pos&&g>=1?"G ≥ 1 : la perturbation s'auto-amplifie jusqu'à ce qu'un événement externe l'arrête (ex. expulsion du fœtus) ; courbe plafonnée à "+S.fmt(m.cap,1)+" pour l'affichage. ":"")+"Modèle linéaire à une variable (a = 0,1 min⁻¹, perturbation constante à partir de t = 5 min). Glycémie et température illustrent la même logique ; les vraies boucles font intervenir plusieurs hormones ou effecteurs.",d&&d.ok?"ok":(m.pos&&g>=1)?"warn":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* BIO3D-BEGIN:s_c04_synapse.js */
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
  id:"ub-c04-3d-synapse-chimique", ch:"c04", tag:"Synapse · 3D",
  titre:"La synapse chimique en 3D : de l'arrivée du PA au PPSE",
  resume:"Le PA ouvre les canaux Ca²⁺, les vésicules fusionnent, le neurotransmetteur traverse la fente et ouvre les récepteurs : suis les 6 étapes.",
  but:"Fais pivoter la synapse, avance étape par étape (ou en automatique), change la concentration extracellulaire de Ca²⁺, le type de synapse et regarde le potentiel postsynaptique se former.",
  aRetenir:"PA présynaptique → ouverture des canaux Ca²⁺ voltage-dépendants → entrée de Ca²⁺ → fusion des vésicules (exocytose, protéines SNARE) → neurotransmetteur dans la fente (≈ 20 nm) → fixation sur des récepteurs-canaux → entrée de Na⁺ (PPSE, dépolarisant) ou de Cl⁻ (PPSI, hyperpolarisant) → arrêt par recapture ou dégradation enzymatique. La libération dépend très fortement du Ca²⁺ (environ [Ca²⁺]⁴).",
  piege:"C'est le Ca²⁺, pas le Na⁺, qui déclenche l'exocytose. Un neurotransmetteur n'est pas excitateur ou inhibiteur en soi : c'est le récepteur postsynaptique qui décide (le même neurotransmetteur peut ouvrir des canaux différents). Un PPSE n'est pas un PA : il est gradué, et il n'y a PA que si la somme atteint le seuil (≈ −55 mV). Schéma très simplifié : une vraie synapse libère quelques milliers de molécules par vésicule.",
  build:function(k,S){
    var c = k.canvas(430), pal = P(S), v = V3(c, S, {yaw:0.35, pit:0.22, D:12, sc:46});
    var ca = k.slider("[Ca²⁺] extracellulaire", 0.5, 4, 0.1, 2, "mM");
    var typ = k.seg("Type de synapse", [["e","Excitatrice (Na⁺)"],["i","Inhibitrice (Cl⁻)"]], "e");
    var inh = k.toggle("Inhibiteur de dégradation / recapture", false);
    var auto = k.toggle("Déroulement automatique", true);
    var ro = k.readouts(["Étape", "P(libération)", "Vésicules libérées", "Pic du potentiel"]);
    var info = k.note("", "ok");
    var NAMES = ["1 · Un potentiel d'action arrive dans la terminaison", "2 · Les canaux Ca²⁺ voltage-dépendants s'ouvrent : le Ca²⁺ entre", "3 · Fusion des vésicules avec la membrane : exocytose", "4 · Le neurotransmetteur diffuse dans la fente synaptique", "5 · Il se fixe sur les récepteurs-canaux : entrée d'ions", "6 · Arrêt : dégradation enzymatique ou recapture"];
    var DUR = [1.0, 1.3, 1.2, 1.3, 2.0, 1.6], ph = 0, pt = 0, ct = 0, seed = 3;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var Y1 = 0.7, Y2 = -0.7, RM = 2.1;
    var docked = [], free = [], i;
    for (i = 0; i < 4; i++){ var a0 = i / 4 * 6.28 + 0.4; docked.push({x:0.9 * Math.cos(a0), z:0.9 * Math.sin(a0), alive:true}); }
    for (i = 0; i < 7; i++){ var a1 = rnd() * 6.28, r1 = 0.4 + rnd() * 1.1; free.push({x:r1 * Math.cos(a1), y:1.5 + rnd() * 0.8, z:r1 * Math.sin(a1), ph:rnd() * 6.28}); }
    var chans = [], recs = [];
    for (i = 0; i < 4; i++){ var a2 = i / 4 * 6.28 + 1.0; chans.push({x:1.5 * Math.cos(a2), z:1.5 * Math.sin(a2)}); }
    for (i = 0; i < 4; i++){ var a3 = i / 4 * 6.28 + 0.4; recs.push({x:0.9 * Math.cos(a3), z:0.9 * Math.sin(a3), bound:false}); }
    for (i = 0; i < 2; i++){ var a4 = i * 3.14 + 0.1; recs.push({x:1.6 * Math.cos(a4), z:1.6 * Math.sin(a4), bound:false}); }
    var nt = [], caIons = [], postIons = [], nrel = 0, amp = 0, tStart = 0, peak = 0, depol = 0;
    function enter(p){
      ph = p; pt = 0;
      if (p === 0){ ct = 0; nrel = 0; amp = 0; peak = 0; nt = []; recs.forEach(function(r){ r.bound = false; }); docked.forEach(function(d){ d.alive = true; }); }
      if (p === 1){ for (var q = 0; q < 10; q++) caIons.push({c:chans[q % 4], t:-q * 0.12}); }
      if (p === 2){
        var pr = Math.pow(ca.value, 4) / (Math.pow(ca.value, 4) + Math.pow(1.5, 4)); nrel = 0;
        docked.forEach(function(d){ if (rnd() < pr){ d.alive = false; nrel++; for (var q = 0; q < 6; q++) nt.push({x:d.x + (rnd() - 0.5) * 0.3, y:Y1 - 0.05, z:d.z + (rnd() - 0.5) * 0.3, vy:-0.4 - rnd() * 0.3, bound:-1, a:1}); } });
        var A0 = 16 * (1 - Math.exp(-nrel * 0.75)); amp = typ.value === "e" ? A0 : -0.45 * A0; if (inh.value) amp *= 1.25;
      }
      if (p === 4){ tStart = ct; }
    }
    function tau(){ return inh.value ? 3.2 : 1.0; }
    function vm(s){
      if (s < 0 || amp === 0) return 0;
      var tr = 0.2, td = tau(), sp = tr * td / (td - tr) * Math.log(td / tr), g = Math.exp(-s / td) - Math.exp(-s / tr), gp = Math.exp(-sp / td) - Math.exp(-sp / tr);
      return amp * g / gp;
    }
    function nextStep(){ enter((ph + 1) % 6); }
    function ring(cy, r, N, col, w, al, rz){
      for (var q = 0; q < N; q++){ var a = q / N * 6.2832, b = (q + 1) / N * 6.2832; v.seg([r * Math.cos(a), cy, r * Math.sin(a)], [r * Math.cos(b), cy, r * Math.sin(b)], w, col, al); }
    }
    function R(){
      c.clear(); v.oy = -22; v.sc = Math.min(60, c.W / 5.4);
      var pcol = ph <= 1 ? "#f59e0b" : "#0e7490";
      /* membranes : disques en grillage */
      [2.1, 1.5, 0.9, 0.3].forEach(function(r){ ring(Y1, r, 28, pcol, 0.045, 0.7); ring(Y2, r, 28, "#2e6b55", 0.045, 0.7); });
      for (i = 0; i < 12; i++){ var a = i / 12 * 6.2832; v.seg([0.15 * Math.cos(a), Y1, 0.15 * Math.sin(a)], [2.1 * Math.cos(a), Y1, 2.1 * Math.sin(a)], 0.02, pcol, 0.35); v.seg([0.15 * Math.cos(a), Y2, 0.15 * Math.sin(a)], [2.1 * Math.cos(a), Y2, 2.1 * Math.sin(a)], 0.02, "#2e6b55", 0.35); }
      /* dôme de la terminaison */
      [20, 40, 60, 78].forEach(function(deg){ var f = deg * Math.PI / 180; ring(Y1 + 1.9 * Math.sin(f), 2.1 * Math.cos(f), 28, pcol, 0.03, 0.45); });
      for (i = 0; i < 8; i++){ var th = i / 8 * 6.2832; for (var j = 0; j < 8; j++){ var f1 = j / 8 * 1.5708, f2 = (j + 1) / 8 * 1.5708; v.seg([2.1 * Math.cos(f1) * Math.cos(th), Y1 + 1.9 * Math.sin(f1), 2.1 * Math.cos(f1) * Math.sin(th)], [2.1 * Math.cos(f2) * Math.cos(th), Y1 + 1.9 * Math.sin(f2), 2.1 * Math.cos(f2) * Math.sin(th)], 0.03, pcol, 0.4); } }
      /* canaux Ca2+ (ouverts aux étapes 2-3) */
      chans.forEach(function(ch){ var open = ph === 1 || (ph === 2 && pt < 0.5); for (var m = 0; m < 6; m++){ var aa = m / 6 * 6.28, g = open ? 0.17 : 0.06; v.ball(ch.x + 0.17 * Math.cos(aa), Y1, ch.z + 0.17 * Math.sin(aa), 0.1, "#0891b2"); v.ball(ch.x + g * Math.cos(aa), Y1 + 0.12, ch.z + g * Math.sin(aa), 0.07, "#164e63"); } });
      /* récepteurs */
      var open2 = ph === 4, col2 = typ.value === "e" ? "#16a34a" : "#7c3aed";
      recs.forEach(function(r){
        var g = (r.bound && ph >= 4 && ph < 5) ? 0.16 : 0.06;
        for (var m = 0; m < 6; m++){ var aa = m / 6 * 6.28; v.ball(r.x + 0.17 * Math.cos(aa), Y2, r.z + 0.17 * Math.sin(aa), 0.1, "#2e6b55"); v.ball(r.x + g * Math.cos(aa), Y2 - 0.1, r.z + g * Math.sin(aa), 0.07, col2); }
        v.ball(r.x, Y2 + 0.16, r.z, 0.06, "#6b7280", 0.6);
      });
      /* vésicules */
      free.forEach(function(f){ var yy = f.y + 0.06 * Math.sin(tt + f.ph); v.ball(f.x, yy, f.z, 0.24, "#7c3aed", 0.9); v.ball(f.x + 0.05, yy + 0.04, f.z, 0.06, "#fde68a"); });
      docked.forEach(function(d){
        if (d.alive) { v.ball(d.x, Y1 + 0.3, d.z, 0.26, "#7c3aed"); v.ball(d.x, Y1 + 0.3, d.z + 0.2, 0.06, "#fde68a"); }
        else if (ph === 2 && pt < 0.6){ var s = pt / 0.6; v.ball(d.x, Y1 + 0.1, d.z, 0.26 * (1 - s) + 0.04, "#a78bfa", 1 - s); }
      });
      /* ions Ca2+ */
      caIons.forEach(function(q){ if (q.t >= 0 && q.t <= 1.1){ v.ball(q.c.x + 0.04 * Math.sin(q.t * 10), Y1 - 0.5 + q.t * 1.3, q.c.z, 0.075, "#06b6d4"); } });
      /* neurotransmetteurs */
      nt.forEach(function(n){ if (n.a > 0.02) v.ball(n.x, n.y, n.z, 0.07, "#facc15", n.a); });
      postIons.forEach(function(q){ if (q.t >= 0 && q.t <= 1) v.ball(q.x, Y2 - 0.1 - q.t * 0.9, q.z, 0.08, typ.value === "e" ? "#2563eb" : "#7c3aed", 1 - q.t * 0.6); });
      v.label("Terminaison présynaptique", 0, Y1 + 2.15, 0, pal.ink, 11);
      v.label("fente ≈ 20 nm", 2.6, 0, 0, pal.grey, 10);
      v.label("Neurone postsynaptique", 0, Y2 - 0.95, 0, pal.ink, 11);
      v.flush();
      /* tracé du potentiel postsynaptique */
      var bx = 36, bw = c.W - 52, by = c.H - 58, bh = 48, T = 8.4, ctx = c.ctx;
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(bx, by - 6, bw, bh + 10); ctx.strokeStyle = "#cbd5e1"; ctx.strokeRect(bx, by - 6, bw, bh + 10);
      var vy = function(m){ return by + bh - (m + 78) / 30 * bh; };
      ctx.strokeStyle = "#dc2626"; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(bx, vy(-55)); ctx.lineTo(bx + bw, vy(-55)); ctx.stroke(); ctx.setLineDash([]);
      S.draw.text(c, "seuil", bx + bw - 14, vy(-55) - 6, {size:9, color:"#dc2626"});
      S.draw.text(c, "−70", bx - 14, vy(-70), {size:9, color:pal.grey}); S.draw.text(c, "mV", bx - 14, by - 4, {size:9, color:pal.grey});
      ctx.strokeStyle = typ.value === "e" ? pal.acc : pal.violet; ctx.lineWidth = 2; ctx.beginPath();
      for (var s = 0; s <= ct + 0.001 && s <= T; s += 0.08){ var yv = vy(-70 + vm(s - tStart)), xv = bx + s / T * bw; if (s === 0) ctx.moveTo(xv, yv); else ctx.lineTo(xv, yv); }
      ctx.stroke(); ctx.lineWidth = 1;
      var pk = 0; for (s = 0; s < 8; s += 0.05) if (Math.abs(vm(s)) > Math.abs(pk)) pk = vm(s);
      ro.set(0, (ph + 1) + " / 6"); ro.set(1, S.fmt(100 * Math.pow(ca.value, 4) / (Math.pow(ca.value, 4) + Math.pow(1.5, 4)), 0) + " %"); ro.set(2, ph >= 2 ? nrel + " / 4" : "—");
      ro.set(3, ph >= 4 && amp !== 0 ? S.fmt(-70 + pk, 1) + " mV" : ph >= 4 ? "−70 mV (rien libéré)" : "—");
      var msg = "<b>" + NAMES[ph] + "</b>";
      if (ph === 2 && nrel === 0) msg += "<br>Aucune vésicule n'a fusionné cette fois (Ca²⁺ trop faible) : la libération est probabiliste."; 
      if (ph === 4 && amp !== 0) msg += "<br>" + (typ.value === "e" ? "Entrée de Na⁺ : PPSE (dépolarisation), sous le seuil à lui seul." : "Entrée de Cl⁻ : PPSI (hyperpolarisation), on s'éloigne du seuil.");
      if (ph === 5) msg += inh.value ? "<br>Dégradation bloquée : le neurotransmetteur persiste, le PPS dure plus longtemps." : "<br>Enzyme (ex. acétylcholinestérase) ou recapture : le signal est bref.";
      info.set(msg, "ok");
    }
    var tt = 0;
    k.button("Étape suivante", function(){ auto.set(false); nextStep(); }, true);
    k.button("Nouveau potentiel d'action", function(){ enter(0); });
    k.draw(R);
    enter(0);
    var lp = k.loop(function(dt){
      tt += dt; v.spin(dt * 0.6);
      pt += dt / DUR[ph]; ct += dt;
      if (ph === 0) depol = pt;
      if (auto.value && pt >= 1) { if (ph === 5 && ct > 8.3) enter(0); else if (ph < 5) nextStep(); else pt = 1; }
      if (!auto.value && pt > 1) pt = 1;
      caIons.forEach(function(q){ q.t += dt * 0.9; });
      nt.forEach(function(n){
        if (ph >= 2 && ph <= 4 && n.bound < 0){
          n.vy += (Math.random() - 0.5) * 0.4; n.y += n.vy * dt * 0.9; n.x += (Math.random() - 0.5) * 0.05; n.z += (Math.random() - 0.5) * 0.05;
          if (n.y > Y1 - 0.02){ n.y = Y1 - 0.02; n.vy = -Math.abs(n.vy); }
          if (n.y < Y2 + 0.2){
            var near = null; recs.forEach(function(r){ if (!r.bound && Math.hypot(r.x - n.x, r.z - n.z) < 0.7) near = r; });
            if (near && ph >= 3){ near.bound = true; n.bound = 1; n.x = near.x; n.y = Y2 + 0.22; n.z = near.z; if (ph === 4 && !postIons.length) for (var q = 0; q < 6; q++) postIons.push({x:near.x, z:near.z, t:-q * 0.25}); }
            else { n.y = Y2 + 0.22; n.vy = Math.abs(n.vy) + 0.1; }
          }
          var rr = Math.hypot(n.x, n.z); if (rr > 2) { n.x *= 2 / rr; n.z *= 2 / rr; }
        }
        if (ph === 5){ n.a -= dt * (inh.value ? 0.08 : 0.7); if (n.bound === 1 && ph === 5) { } }
      });
      if (ph === 4 && postIons.length < 14 && Math.random() < dt * 4) { var rb = recs.filter(function(r){ return r.bound; }); if (rb.length){ var r0 = rb[Math.floor(Math.random() * rb.length)]; postIons.push({x:r0.x, z:r0.z, t:0}); } }
      postIons.forEach(function(q){ q.t += dt * 0.8; });
      if (ph === 5 || ph === 0){ postIons = postIons.filter(function(q){ return q.t < 1; }); }
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c04_synapse.js */
