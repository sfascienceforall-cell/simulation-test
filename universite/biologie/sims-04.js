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
  resume:"Course entre une fibre amyélinique et une fibre myélinisée de même diamètre, avec démyélinisation réglable.",
  but:"Règle le diamètre, la distance et le taux de démyélinisation ; lis les vitesses et les latences. Lance la course.",
  aRetenir:"Fibre amyélinique : v ≈ 1,1·√d (m/s, d en µm). Fibre myélinisée : v ≈ 6·d (m/s) : conduction saltatoire de nœud en nœud de Ranvier (≈ 100·d entre deux nœuds). Pour d = 10 µm, ≈ 60 m/s contre 3,5 m/s. La démyélinisation ralentit puis peut bloquer la conduction (sclérose en plaques).",
  piege:"La myéline n'isole pas pour « garder le courant » : elle diminue la capacité de membrane et force les canaux Na⁺ à se concentrer aux nœuds. Gros diamètre = plus rapide, mais la myéline est bien plus rentable en place.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(250);
    var d=k.slider("Diamètre de la fibre d",0.2,20,0.2,10,"µm");
    var L=k.slider("Distance à parcourir",0.05,1.5,0.05,1,"m");
    var dm=k.slider("Démyélinisation",0,100,5,0,"%");
    var ro=k.readouts(["v amyélinique","v myélinisée","Latence amyélinique","Latence myélinisée"]);
    var tA=0;
    var run=k.loop(function(dt,t){ tA=t; if(t>7) run.pause(); k.redraw(); });
    k.button("Lancer la course",function(){ run.reset(); tA=0; run.play(); },true);
    function fmtT(s){ return s<1?S.fmt(s*1000,1)+" ms":S.fmt(s,2)+" s"; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, vu=1.1*Math.sqrt(d.value), vm=6*d.value, vx=vu+(1-dm.value/100)*(vm-vu);
      var Tu=L.value/vu, Tm=L.value/vx, Tmax=Math.max(Tu,Tm);
      ro.set(0,S.fmt(vu,2)+" m/s"); ro.set(1,S.fmt(vx,1)+" m/s"); ro.set(2,fmtT(Tu)); ro.set(3,fmtT(Tm));
      var tt=Math.min(1,tA/6), x0=40, x1=c.W-30, seg=(x1-x0)/10;
      function prog(T){ return Math.min(1,tt*Tmax/T); }
      [[70,"Amyélinique (v = "+S.fmt(vu,2)+" m/s)",P.amber,prog(Tu),false],[170,"Myélinisée (v = "+S.fmt(vx,1)+" m/s)",P.acc,prog(Tm),true]].forEach(function(o){
        var y=o[0]; S.draw.text(c,o[1],x0,y-36,{size:12,color:o[2],align:"left"});
        S.draw.line(c,x0,y,x1,y,"#c8d1de",o[4]?3:10);
        if(o[4]){ for(var i=0;i<10;i++){ ctx.fillStyle="rgba(46,107,85,"+(0.08+0.55*(1-dm.value/100))+")"; ctx.fillRect(x0+i*seg+10,y-11,seg-20,22); S.draw.dot(c,x0+i*seg+5,y,3,P.red); } S.draw.dot(c,x1,y,3,P.red); }
        var px=o[4]?x0+Math.round(o[3]*10)*seg:x0+o[3]*(x1-x0);
        S.draw.dot(c,px,y,9,o[2]); ctx.save(); ctx.strokeStyle=o[2]; ctx.globalAlpha=0.3; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(px,y,15,0,7); ctx.stroke(); ctx.restore();
      });
      S.draw.text(c,"Vert : myéline · rouge : nœuds de Ranvier · animation : 6 s pour la fibre la plus lente",c.W/2,c.H-12,{size:10,color:P.grey});
    });
    k.note("Lois empiriques approchées (v amyélinique ≈ 1,1·√d ; v myélinisée ≈ 6·d, d = diamètre total) ; l'interpolation linéaire selon le taux de démyélinisation est un modèle qualitatif. Le blocage complet de la conduction (démyélinisation sévère) n'est pas modélisé : à 100 %, la fibre myélinisée garde la vitesse d'une fibre amyélinique. Le dessin est schématique : seul le calcul des vitesses est quantitatif.","warn");
  }
});

SFA.sim({
  id:"ub-c04-cascade-amplification", ch:"c04", tag:"Transduction",
  titre:"Cascade AMPc : amplification et durée du signal",
  resume:"Un ligand active des centaines de milliers de molécules ; la phosphodiestérase éteint le signal ; caféine et toxine cholérique le modifient.",
  but:"Règle l'amplification de chaque étage, l'intensité du signal, et teste la caféine (inhibe la PDE) ou la toxine cholérique (Gs bloquée active).",
  aRetenir:"Chaque étage d'une cascade multiplie le signal : 1 ligand × n₁ protéines G × n₂ AMPc × n₃ substrats phosphorylés. L'AMPc est dégradé par la phosphodiestérase : [AMPc] suit d[AMPc]/dt = production − k·[AMPc] ; sa demi-vie est ln 2 / k. La caféine ralentit cette dégradation et prolonge le signal ; la toxine cholérique empêche l'arrêt de Gs : production d'AMPc permanente.",
  piege:"Amplifier ne veut pas dire « plus de ligand » : un faible nombre de récepteurs activés peut produire une réponse énorme. Inversement, un signal qui ne s'éteint pas est pathologique (choléra).",
  build:function(k,S){
    var P=S.draw.palette, c1=k.canvas(170), c2=k.canvas(210);
    var n0=k.slider("Molécules de ligand liées",1,1000,1,10,"");
    var n1=k.slider("n₁ : protéines G activées par récepteur",1,100,1,10,"");
    var n2=k.slider("n₂ : AMPc produites par protéine G active",1,500,1,50,"");
    var n3=k.slider("n₃ : substrats phosphorylés par molécule d'AMPc",1,200,1,20,"");
    var du=k.slider("Durée du signal",5,40,1,20,"s");
    var dr=k.seg("Condition",[["none","Normal"],["caf","Caféine"],["cho","Toxine cholérique"]],"none");
    var ro=k.readouts(["Amplification totale","[AMPc] maximale","Demi-vie de l'AMPc"]);
    function sci2(x){ if(x<10000) return S.fmt(x,0); var e=Math.floor(Math.log10(x)), m=x/Math.pow(10,e); return S.fmt(m,1)+"·10"+String(e).split("").map(function(ch){return "⁰¹²³⁴⁵⁶⁷⁸⁹".charAt(+ch);}).join(""); }
    k.draw(function(){
      var ctx;
      c1.clear(); ctx=c1.ctx;
      var st=[["Ligand",n0.value],["Prot. G",n0.value*n1.value],["AMPc",n0.value*n1.value*n2.value],["Substrats phosph.",n0.value*n1.value*n2.value*n3.value]];
      var lo=0, hi=Math.max(7,Math.ceil(Math.log10(st[3][1]))), bw=(c1.W-60)/4;
      st.forEach(function(s,i){ var h=(Math.log10(s[1])+0.1)/(hi+0.1)*(c1.H-60); ctx.fillStyle=[P.violet,P.acc,P.teal,P.green][i]; ctx.fillRect(40+i*bw,c1.H-30-h,bw-14,h); S.draw.text(c1,sci2(s[1]),40+i*bw+(bw-14)/2,c1.H-30-h-9,{size:11,color:P.ink}); S.draw.text(c1,s[0],40+i*bw+(bw-14)/2,c1.H-14,{size:10,color:P.grey}); });
      S.draw.text(c1,"Nombre de molécules (échelle logarithmique)",c1.W/2,12,{size:11,color:P.ink});
      /* cinétique */
      c2.clear();
      var s0=0.3+0.1*Math.log10(n0.value*n1.value*n2.value), kk=dr.value==="caf"?0.1:0.2, T=du.value;
      var sf=function(t){ return t<T? s0 : (dr.value==="cho"? 0.3*s0 : 0); };
      var a=0.05, x=0.05, pts=[[0,x]], mx=x;
      for(var t=0;t<100;t+=0.1){ x+=0.1*(sf(t)-kk*x)+0.1*kk*a; if(x>mx)mx=x; pts.push([t+0.1,x]); }
      var ax=S.draw.axes(c2,{x0:0,x1:100,y0:0,y1:Math.max(6,Math.ceil(mx*1.1)),stepX:10,xl:"temps (s)",yl:"[AMPc] (µmol/L)"});
      ctx=c2.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.teal; ctx.lineWidth=2.6; ctx.beginPath();
      pts.forEach(function(p,i){ var xx=ax.X(p[0]),yy=ax.Y(p[1]); if(i===0)ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); }); ctx.stroke(); ctx.restore();
      ctx.fillStyle="rgba(180,83,9,.15)"; ctx.fillRect(ax.X(0),ax.T,ax.X(T)-ax.X(0),ax.B-ax.T);
      S.draw.text(c2,"signal (ligand lié)",ax.X(T/2),ax.B-10,{size:10,color:P.amber});
      ro.set(0,S.sci(st[3][1]/st[0][1],2)+" ×"); ro.set(1,S.fmt(mx,2)+" µmol/L"); ro.set(2,S.fmt(Math.LN2/kk,1)+" s");
    });
    k.note("Valeurs numériques pédagogiques (ordres de grandeur) : production d'AMPc croissante avec le signal (loi logarithmique arbitraire), dégradation k = 0,2 s⁻¹ (0,1 s⁻¹ avec caféine). La toxine cholérique est modélisée par une production maintenue à 30 % après la fin du signal.","warn");
  }
});

SFA.sim({
  id:"ub-c04-synapse-sommation", ch:"c04", tag:"Synapse · sommation",
  titre:"Sommation spatiale et temporelle de potentiels post-synaptiques",
  resume:"Des synapses excitatrices et inhibitrices s'additionnent ; le neurone décharge si le seuil est atteint.",
  but:"Choisis le nombre de synapses excitatrices et inhibitrices, leur fréquence et la constante de temps de la membrane : suis Vm et les potentiels d'action.",
  aRetenir:"Le neurone intègre : chaque PPSE (+) ou PPSI (−) décroît avec la constante de temps τ ; ils s'additionnent dans l'espace (plusieurs synapses simultanées) et dans le temps (arrivées rapprochées). Dépolarisation moyenne ≈ (Σ n·f·a)·τ. Seuil ≈ −55 mV depuis −70 mV (15 mV).",
  piege:"Un seul PPSE de 1 mV est loin d'un seuil de 15 mV : c'est la sommation qui compte. Une synapse inhibitrice ne « bloque » pas : elle soustrait.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(320);
    var ne=k.slider("Synapses excitatrices",0,30,1,24,"");
    var fe=k.slider("Fréquence de chaque synapse excitatrice",1,100,1,60,"Hz");
    var ae=k.slider("Amplitude d'un PPSE",0.2,3,0.1,1,"mV");
    var ni=k.slider("Synapses inhibitrices",0,15,1,0,"");
    var fi=k.slider("Fréquence de chaque synapse inhibitrice",1,100,1,40,"Hz");
    var tau=k.slider("Constante de temps τ",2,30,1,10,"ms");
    var ro=k.readouts(["Dépolarisation moyenne prévue","Potentiels d'action (200 ms)","Fréquence de décharge"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, rest=-70, th=-55, dt=0.1, T=200;
      var ev=[]; /* événements : [temps, amplitude] */
      for(var i=0;i<ne.value;i++){ var per=1000/fe.value, ph=((i*0.618034)%1)*per; for(var t=ph;t<T;t+=per) ev.push([t,ae.value]); }
      for(var j=0;j<ni.value;j++){ var per2=1000/fi.value, ph2=((j*0.381966+0.17)%1)*per2; for(var t2=ph2;t2<T;t2+=per2) ev.push([t2,-ae.value]); }
      ev.sort(function(a,b){return a[0]-b[0];});
      var V=rest, ei=0, ref=0, sp=[], tr=[];
      for(var s=0;s<=T/dt;s++){ var t=s*dt; V=rest+(V-rest)*Math.exp(-dt/tau.value);
        while(ei<ev.length&&ev[ei][0]<=t){ if(ref<=0) V=Math.max(-85,V+ev[ei][1]); ei++; }
        ref-=dt; if(V>=th&&ref<=0){ sp.push(t); V=rest; ref=3; tr.push(0); } else tr.push(V); }
      var ax=S.draw.axes(c,{t:28,x0:0,x1:T,y0:-90,y1:10,stepX:25,stepY:10,xl:"temps (ms)",yl:"Vm (mV)"});
      S.draw.line(c,ax.L,ax.Y(th),ax.R,ax.Y(th),P.red,1.5,[6,4]); S.draw.text(c,"seuil −55 mV",ax.R-4,ax.Y(th)-8,{size:10,color:P.red,align:"right"});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=1.8; ctx.beginPath();
      tr.forEach(function(v,i){ var x=ax.X(i*dt), y=ax.Y(v); if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.restore();
      sp.forEach(function(t){ S.draw.line(c,ax.X(t),ax.Y(th),ax.X(t),ax.Y(0),P.green,2.5); });
      var mean=(ne.value*fe.value*ae.value-ni.value*fi.value*ae.value)/1000*tau.value;
      ro.set(0,(mean>=0?"+":"")+S.fmt(mean,1).replace("−","−")+" mV"); ro.set(1,String(sp.length)); ro.set(2,S.fmt(sp.length/(T/1000),0)+" Hz");
    });
    k.note("Modèle d'intégrateur à fuite : Vm = −70 mV au repos, seuil −55 mV, retour à −70 mV après un potentiel d'action, réfractaire 3 ms. Hyperpolarisation limitée à −85 mV (potentiel d'équilibre de K⁺ et Cl⁻). Trains réguliers déphasés ; les potentiels d'action (traits verts) sont symboliques.","warn");
  }
});

SFA.sim({
  id:"ub-c04-homeostasie-retroaction", ch:"c04", tag:"Homéostasie",
  titre:"Rétroaction négative et positive : gain et erreur résiduelle",
  resume:"Perturbation d'une variable réglée : plus le gain est grand, plus l'erreur est petite. Une rétroaction positive emballe le système.",
  but:"Choisis la variable (glycémie ou température), le type de rétroaction et le gain. Observe l'écart à la consigne au cours du temps.",
  aRetenir:"Rétroaction négative : x' = D − a(1 + G)·x. À l'équilibre, l'écart vaut D / [a(1 + G)] : l'erreur est réduite d'un facteur 1 + G par rapport à l'absence de régulation, et la correction est plus rapide (constante de temps 1/[a(1 + G)]). Il reste toujours un petit écart. Rétroaction positive : x' = D + a(G − 1)·x : si G > 1, emballement exponentiel (G = 1 : croissance linéaire, sans équilibre ; accouchement, coagulation, potentiel d'action).",
  piege:"« Homéostasie » ne veut pas dire valeur constante : il reste une erreur résiduelle, et la consigne elle-même peut changer (fièvre).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var sc=k.seg("Variable",[["gly","Glycémie (g/L)"],["tmp","Température (°C)"]],"gly");
    var md=k.seg("Rétroaction",[["neg","Négative"],["pos","Positive"]],"neg");
    var G=k.slider("Gain G (effecteurs / perturbation)",0,20,0.5,4,"");
    var tmp=k.toggle("Perturbation temporaire (s'arrête à t = 30)",false);
    var ro=k.readouts(["Écart final (ou pic)","Réduction de l'erreur","Constante de temps"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var g=G.value, a=0.1, isG=sc.value==="gly", D=isG?0.06:0.4, set=isG?1.0:37, pos=md.value==="pos";
      var Gp=g; var x=0, pts=[], cap=10*D/a, runaway=false, mx=0;
      for(var t=0;t<=60;t+=0.1){ var d=(t>=5&&(!tmp.value||t<30))?D:0; var rate=pos? d+a*(Gp-1)*x : d-a*(1+g)*x; x+=0.1*rate; if(x>cap){ x=cap; runaway=true; } pts.push(x); if(Math.abs(x)>mx) mx=Math.abs(x); }
      var ymax=pos?cap*1.05:D/a*1.2, ax=S.draw.axes(c,{t:28,x0:0,x1:60,y0:-ymax*0.05,y1:ymax,xl:"temps (min)",yl:"écart à la consigne ("+(isG?"g/L":"°C")+")"});
      S.draw.line(c,ax.L,ax.Y(D/a),ax.R,ax.Y(D/a),P.grey,1.4,[5,4]); S.draw.text(c,"sans régulation : "+S.fmt(D/a,2),ax.R-4,ax.Y(D/a)-8,{size:10,color:P.grey,align:"right"});
      var ctx=c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=pos?P.red:P.acc; ctx.lineWidth=2.6; ctx.beginPath();
      pts.forEach(function(p,i){ var xx=ax.X(i*0.1), yy=ax.Y(p); if(i===0)ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); }); ctx.stroke(); ctx.restore();
      S.draw.text(c,"consigne : "+S.fmt(set,1)+(isG?" g/L":" °C")+" (écart = 0)",ax.L+10,ax.B-12,{size:11,color:P.ink,align:"left"});
      var fin=pts[pts.length-1];
      if(!pos){ var pk=tmp.value?mx:D/(a*(1+g)); ro.set(0,S.fmt(pk,3)); ro.set(1,"÷ "+S.fmt(1+g,1)); ro.set(2,S.fmt(1/(a*(1+g)),1)+" min");
        nt.set((tmp.value?"Valeur au pic : ":"Valeur finale : ")+S.fmt(set+pk,3)+(isG?" g/L":" °C")+" (sans régulation : "+S.fmt(set+D/a,2)+")."+(tmp.value?" Après l'arrêt de la perturbation, la variable revient à la consigne.":""),"ok"); }
      else { ro.set(0,Gp>=1?"emballement (pas d'équilibre)":S.fmt(D/(a*(1-Gp)),3)+(runaway?" (au-delà du plafond affiché)":"")); ro.set(1,Gp<1?"× "+S.fmt(1/(1-Gp),2)+" (amplifié)":"aucune"); ro.set(2,Gp<1?S.fmt(1/(a*(1-Gp)),1)+" min":Gp===1?"croissance linéaire":"exponentielle");
        nt.set(Gp>=1?"G ≥ 1 : la perturbation s'auto-amplifie jusqu'à ce qu'un événement externe l'arrête (ex. expulsion du fœtus). Courbe plafonnée à "+S.fmt(cap,1)+" pour l'affichage.":"G < 1 : la rétroaction positive amplifie l'écart sans emballement, ce qui reste un mauvais régulateur.","warn"); }
    });
    k.note("Modèle linéaire à une variable (perturbation constante, a = 0,1 min⁻¹). La glycémie et la température sont des illustrations de la même logique ; les vraies boucles font intervenir plusieurs hormones ou effecteurs.","warn");
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
